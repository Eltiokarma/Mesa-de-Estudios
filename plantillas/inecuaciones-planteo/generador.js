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

  // Con o.viva, el problema trae además escena, pasos, fantasmas y (si se arrastra) la respuesta ampliada.
  function salida(semilla, o, alternativas, respuesta) {
    const p = { id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta, _datos: o.datos };
    return o.viva ? Object.assign(p, o.viva(alternativas, respuesta)) : p;
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

  // ======================= escena viva (docs/escena-viva.md) =======================
  // La recta numérica del kit (nucleo/kit/piezas/recta.js): cada condición en su fila, lo que queda en la recta.
  // Todo número de la figura sale de aquí. Sin escena (dos-enteros, medias y lineal-entera), la app usa la solución.
  const ROT = {
    'AL19-inecuacion-como-ecuacion': 'como ecuación', 'redondeo-de-la-cota': 'redondeando', 'extremo-excluido': 'sin el extremo',
    'extremo-incluido': 'con el extremo', 'discriminante-signo-invertido': 'Δ > 0', 'discriminante-sin-el-4': 'sin el 4',
    'discriminante-sin-a': 'sin el coeficiente', 'olvida-la-altura-inicial': 'sin la azotea', 'perimetro-como-suma-de-dos-lados': 'perímetro entero',
    'no-menor-que-como-a-lo-mas': '«a lo más»', 'olvida-el-signo-de-a': 'sin el signo de k', 'solo-el-coeficiente-principal': 'solo k',
    'corchetes-cambiados': 'corchetes', 'todo-cerrado': 'todo cerrado', 'olvida-la-parte-entera': 'sin la parte entera',
    'numerador-y-denominador-por-separado': 'por separado', 'solo-los-extremos': 'solo extremos', 'maximo-en-el-centro': 'en el centro',
    'olvida-el-cuadrado': 'sin el cuadrado', 'signo-del-producto-invertido': 'a·b ≤ 0', 'AL22-suma-de-absolutos': 'siempre igual',
    'triangular-sin-igualdad': 'sin igualdad', 'extremo-excluido-tomado': 'B',
  };
  const rotulo = id => ROT[id] || (id.startsWith('responde-') ? 'otra cantidad' : 'tu opción');
  const nb = x => (typeof x === 'string' ? x.replace(/ %/g, ' %').replace(/S\/ /g, 'S/ ') : x);
  // Una cota que puede no ser exacta: entera si lo es; si no, truncada a 2 decimales con «…».
  const cota = x => (Math.abs(x - Math.round(x)) < 1e-9 ? N(Math.round(x)) : `${P.formatear(Math.floor(x * 100 + 1e-9) / 100, 2)}…`);
  // Tramo de la recta que deja ver todos los valores, con rayitas «bonitas».
  function rango(vals) {
    const lo = Math.min(...vals), hi = Math.max(...vals);
    const paso = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500].find(p => (hi - lo) / p <= 10) || 1000;
    let min = Math.floor(lo / paso) * paso, max = Math.ceil(hi / paso) * paso;
    if (lo - min < paso / 2) min -= paso;
    if (max - hi < paso / 2) max += paso;
    if (lo >= 0 && min < 0) min = 0;
    return { min, max, paso };
  }
  // Intervalos de una clave «int:lo,lc,hi,hc|…» como elementos de la recta (para el fantasma de una opción).
  function deClave(clave) {
    const val = t => (t === '-inf' || t === 'inf' ? null : t.split('/').reduce((n, d) => n / d));
    if (!/^int:/.test(clave)) return [];
    const cuerpo = clave.slice(4);
    if (!cuerpo) return [];
    return cuerpo.split('|').map(s => { const [lo, lc, hi, hc] = s.split(','); return { tipo: 'intervalo', a: val(lo), b: val(hi), ca: lc === '1', cb: hc === '1' }; });
  }
  const extremos = clave => deClave(clave).flatMap(e => [e.a, e.b]).filter(Number.isFinite);
  /*
   * o: { variable, color, sufijo, elementos, pasos, alt, extra (valores que deben verse), arrastra, fantasma(a) }
   * Con arrastra, la respuesta se pone con la marca en la recta (paso 1: las respuestas son enteras). Un error cuyo id
   * se repite en el problema no lleva fantasma: no se sabría cuál dibujar.
   */
  function escena(alternativas, respuesta, o) {
    const vals = [...(o.extra || []), ...(o.arrastra ? alternativas.map(a => a.valor) : [])].filter(Number.isFinite);
    const r = rango(vals);
    const datos = { min: r.min, max: r.max, paso: r.paso, variable: o.variable, color: o.color, sufijo: o.sufijo || '', decimales: 2,
      filas: o.filas || 2, elementos: o.elementos, marca: o.arrastra ? { min: r.min, max: r.max, inicio: r.min } : null,
      respuesta: o.arrastra ? respuesta.valor : null };
    const cuenta = {};
    for (const a of alternativas) if (a.error) cuenta[a.error.id] = (cuenta[a.error.id] || 0) + 1;
    const fantasmas = {};
    for (const a of alternativas) {
      if (!a.error) continue;
      const f = cuenta[a.error.id] > 1 ? null : o.fantasma ? o.fantasma(a) : o.arrastra ? { marca: a.valor, rotulo: rotulo(a.error.id) } : null;
      fantasmas[a.error.id] = f || {};
    }
    const out = { escena: { pieza: 'recta', datos, alt: o.alt }, fantasmas,
      pasos: o.pasos.map(q => ({ ...q, texto: q.texto.map(nb), ecuacion: (q.ecuacion || []).map(nb) })) };
    if (o.arrastra) out.respuesta = { ...respuesta, tipo: 'arrastrar', control: 'marca', paso: 1, tolerancia: 0.5 };
    return out;
  }
  // Fantasma de una opción que es un intervalo (o un número suelto «num:n/d»): se dibuja discontinuo en su fila.
  // La clave de una opción de texto viene en su valor («int:…» o «num:n/d»).
  const claveDe = a => String(a.clave || a.valor || '');
  const numDe = a => (/^num:/.test(claveDe(a)) ? claveDe(a).slice(4).split('/').reduce((n, d) => n / d) : NaN);
  function fantasmaTexto(a) {
    if (/^num:/.test(claveDe(a))) return { elementos: [{ tipo: 'punto', x: numDe(a) }], rotulo: `${rotulo(a.error.id)}: ${a.texto}` };
    return { elementos: deClave(claveDe(a)), rotulo: rotulo(a.error.id) };
  }
  const paso = (corte, texto, ecuacion, final) => ({ estado: final ? { corte, final: true } : { corte }, texto, ecuacion });

  // ======================= entero-unico =======================
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
    const quien = rng.elegir(['Una comerciante de Juliaca', 'Don Lucho', 'Una vendedora de Tacna', 'Un tendero de Cusco']);
    const variables = { k1: { nombre: 'primera venta', color: 'o' }, k2: { nombre: 'segunda venta', color: 'i' }, N: { nombre: 'cantidad inicial', color: 'd' } };
    const f1 = `${a}/${b}`, f2 = `${c}/${d}`;
    const enunciado = [`${quien} tenía `, v('N', 'N'), ` ${obj.n}. Vendió `, v('k1', k1), ` y le quedó más de ${f1} de N; luego vendió `, v('k2', k2),
      ` más y le quedó menos de ${f2} de N.`];
    const pregunta = [`¿${obj.cu} ${obj.n} tenía al inicio?`];
    const NN = v('N', 'N');
    const solucion = [
      ['Tras vender ', v('k1', k1), ': ', NN, ` − ${k1} > (${f1})·N → `, NN, ` > ${qDec(L)}.`],
      ['Tras vender ', v('k2', k2), ' más: ', NN, ` − ${k1 + k2} < (${f2})·N → `, NN, ` < ${qDec(U)}.`],
      ['El único entero entre las dos cotas es ', v('N', n), '.'],
    ];
    const errores = [
      qv(L) === n - 1
        ? al19(n - 1, `Resolviste como ecuación: N = ${n - 1}. Con ${n - 1} le queda justo ${f1} de N, no más.`)
        : redondeo(n - 1, `Redondeaste ${qt(L)} hacia abajo. Con ${n - 1} no le queda más de ${f1} de N.`),
      qv(U) === n + 1
        ? al19(n + 1, `Resolviste como ecuación: N = ${n + 1}. Con ${n + 1} le queda justo ${f2} de N, no menos.`)
        : redondeo(n + 1, `Redondeaste ${qt(U)} hacia arriba. Con ${n + 1} no le queda menos de ${f2} de N.`),
      ar5('lo-que-quedo', n - k1 - k2, `${n - k1 - k2} es lo que le quedó al final. Se pide cuántos tenía.`),
      ar5('quedo-tras-la-primera-venta', n - k1, `${n - k1} es lo que quedó tras la primera venta. Se pide cuántos tenía.`),
    ];
    const viva = (alts, resp) => escena(alts, resp, {
      variable: 'N', color: 'd', arrastra: true, extra: [qv(L), qv(U)],
      alt: `Recta de N: N > ${qt(L)} y N < ${qt(U)}; solo el ${n} cumple las dos`,
      elementos: [
        { tipo: 'intervalo', a: qv(L), b: null, ca: false, color: 'o', rotulo: `N > ${qt(L)}`, fila: 2, desde: 1 },
        { tipo: 'intervalo', a: null, b: qv(U), cb: false, color: 'i', rotulo: `N < ${qt(U)}`, fila: 1, desde: 2 },
        { tipo: 'enteros', a: n, b: n, color: 'd', rotulo: `N = ${n}`, fila: 0, desde: 3 },
      ],
      pasos: [
        paso(1, ['Tras vender ', v('k1', k1), `, le queda más de ${f1} de N.`], [`N − ${k1} > (${f1})·N → N > ${qt(L)}`]),
        paso(2, ['Tras vender ', v('k2', k2), ` más, le queda menos de ${f2} de N.`], [`N − ${k1 + k2} < (${f2})·N → N < ${qt(U)}`]),
        paso(3, ['El único entero entre las dos cotas es ', v('N', n), '.'], [`Le quedan ${n - k1} y luego ${n - k1 - k2}.`], true),
      ],
    });
    return cerrar(rng, semilla, { correcta: n, errores, texto: x => N(x), variables, enunciado, pregunta, solucion, viva,
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
    const enunciado = [`${A} y ${B} ganaron cantidades enteras de soles. ${B} ganó S/ ${ac} ${c < 0 ? 'menos' : 'más'} que ${veces} de lo de ${A}. Juntos ganaron más de `,
      v('T', `S/ ${T}`), `; si ${A} ganaba `, v('e', `S/ ${e}`), ` más, superaba a ${B}.`];
    const pregunta = ['¿Cuánto ', v('L', `ganó ${B}`), '?'];
    const Lx = `${m}x ${sg} ${ac}`;
    const baja = fr(T - c, m + 1), alta = fr(e - c, m - 1);
    const solucion = [
      ['Sea ', v('x', 'x'), ` lo de ${A}; ${B} ganó `, v('L', Lx), '.'],
      [v('x', 'x'), ' + ', v('L', `(${Lx})`), ' > ', v('T', T), ` → x > ${qDec(baja)}.`],
      [`x + ${e} > ${Lx} → x < ${qDec(alta)}.`],
      [`Solo x = ${x0}: ${B} ganó `, v('L', `${m}·${x0} ${sg} ${ac} = S/ ${L0}`), '.'],
    ];
    const errores = [
      ar5('la-otra-persona', x0, `S/ ${x0} es lo que ganó ${A}. Se pide lo de ${B}.`),
      (m + 1) * (x0 - 1) === T - c
        ? al19(m * (x0 - 1) + c, `Resolviste ${m + 1}x = ${N(T - c)} como ecuación: x = ${x0 - 1}. Así juntos ganan justo S/ ${T}, no más.`)
        : redondeo(m * (x0 - 1) + c, `Redondeaste x > ${qt(baja)} hacia abajo: con x = ${x0 - 1}, juntos no pasan de S/ ${T}.`),
      (m - 1) * (x0 + 1) === e - c
        ? al19(m * (x0 + 1) + c, `Resolviste x + ${e} = ${Lx} como ecuación: x = ${x0 + 1}. Así ${A} solo empata con ${B}.`)
        : redondeo(m * (x0 + 1) + c, `Redondeaste x < ${qt(alta)} hacia arriba: con x = ${x0 + 1}, ${A} no supera a ${B}.`),
      ar5('el-total', x0 + L0, `S/ ${x0 + L0} es lo que ganaron juntos. Se pide solo lo de ${B}.`),
    ];
    // Los errores de cota usaron otro x: su fantasma es ese x en la recta.
    const fantasma = a => {
      if (a.error.id === 'responde-la-otra-persona') return { marca: x0, rotulo: `lo de ${A}` };
      if (a.error.id === 'responde-el-total') return null;
      const x = (a.valor - c) / m;
      return Number.isInteger(x) ? { marca: x, rotulo: 'x usado' } : null;
    };
    const viva = (alts, resp) => escena(alts, resp, {
      variable: 'x', color: 'o', extra: [qv(baja), qv(alta), x0], fantasma,
      alt: `Recta de x, lo que ganó ${A}: x > ${qt(baja)} y x < ${qt(alta)}; solo el ${x0} cumple`,
      elementos: [
        { tipo: 'intervalo', a: qv(baja), b: null, ca: false, color: 'i', rotulo: `x > ${qt(baja)}`, fila: 2, desde: 1 },
        { tipo: 'intervalo', a: null, b: qv(alta), cb: false, color: 'h', rotulo: `x < ${qt(alta)}`, fila: 1, desde: 2 },
        { tipo: 'enteros', a: x0, b: x0, color: 'o', rotulo: `x = ${x0}`, fila: 0, desde: 3 },
      ],
      pasos: [
        paso(1, [`Sea x lo de ${A}. Juntos ganan más de `, v('T', `S/ ${T}`), '.'], [`x + (${Lx}) > ${T} → x > ${qt(baja)}`]),
        paso(2, ['Con ', v('e', `S/ ${e}`), ` más, ${A} supera a ${B}.`], [`x + ${e} > ${Lx} → x < ${qt(alta)}`]),
        paso(3, ['El único entero es ', v('x', `x = ${x0}`), `; ${B} ganó `, v('L', `S/ ${L0}`), '.'], [`${m}·${x0} ${sg} ${ac} = ${L0}`], true),
      ],
    });
    return cerrar(rng, semilla, { correcta: L0, errores, texto: x => `S/ ${N(x)}`, unidad: 'S/', variables, enunciado, pregunta, solucion, viva,
      datos: { tipo: 'entero-unico', sub: 'dos-personas', m, c, T, e } });
  }

  // ======================= dos-enteros =======================
  // Sin escena: la región de parejas enteras no cabe en una recta (pide una cuadrícula).
  const CTX2 = [
    { lugar: 'Hay', X: 'patos', Y: 'gallinas' },
    { lugar: 'Hay', X: 'combis', Y: 'mototaxis' },
    { lugar: 'Hay', X: 'diccionarios', Y: 'atlas' },
    { lugar: 'Hay', X: 'alpacas', Y: 'llamas' },
  ];
  const REL = { '>': 'es mayor que', '<': 'es menor que', '≥': 'no es menor que', '≤': 'no es mayor que' };
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
  // La condición con la relación en palabras: «3x − 2y no es menor que 4».
  const frase = ([a, b, rel, c]) => `${(termino(a, 'x', true) + termino(b, 'y', a === 0)) || '0'} ${REL[rel]} ${N(c)}`;

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
      const cuales = xs.length === 0 ? 'ningún entero' : xs.length === 1 ? 'x = ' + xs[0] : xs.length <= 3 ? 'x ∈ {' + xs.join('; ') + '}' : `x de ${xs[0]} a ${xs[xs.length - 1]}`;
      filas.push(`y = ${y}: ${qt(lo)} ${r1 === '>' ? '<' : '≤'} x ${r2} ${qt(hi)} → ${cuales}.`);
    }
    if (filas.length > 7 || filas.length < 1) return null;
    if (S.some(p => p[1] >= yMin + filas.length)) return null; // las filas deben cubrir todas las soluciones

    const variables = { x: { nombre: `número de ${ctx.X}`, color: 'o' }, y: { nombre: `número de ${ctx.Y}`, color: 'i' }, r: { nombre: 'lo que se pide', color: 'd' } };
    const enunciado = [`${ctx.lugar} `, v('x', 'x'), ` ${ctx.X} e `, v('y', 'y'), ` ${ctx.Y}. Se cumple que ${frase(I1)}, que ${frase(I2)} y que ${frase(I3)}.`];
    const pregunta = pedido === 'suma' ? ['¿Cuánto vale ', v('r', 'x + y'), '?']
      : pedido === 'producto' ? ['¿Cuánto vale ', v('r', 'x·y'), '?']
        : pedido === 'max-suma' ? ['¿Cuál es el mayor valor posible de ', v('r', 'x + y'), '?']
          : ['¿Cuál es el mayor valor posible de ', v('r', 'x'), '?'];
    const solucion = [
      [`Condiciones: ${ineqTxt(I1)}, ${ineqTxt(I2)} y ${ineqTxt(I3)}.`],
      ...(r1 === '≥' || r3 === '≥' ? [['«No es menor que» significa ≥.']] : []),
      ['Para cada ', v('y', 'y'), ', se acota ', v('x', 'x'), ':'],
      ...filas.map(f => [f]),
    ];
    const op = pedido === 'producto' ? '·' : ' + ';
    if (sub === 'unico') solucion.push([`Única pareja: x = ${S[0][0]}, y = ${S[0][1]}: `, v('r', `${S[0][0]}${op}${S[0][1]} = ${correcta}`), '.']);
    else {
      const mejor = S.find(p => obj(p) === correcta);
      solucion.push([`${pedido === 'max-x' ? 'El mayor x' : 'La mayor suma'} es `, v('r', correcta), `, en (${mejor[0]}; ${mejor[1]}).`]);
    }

    const errores = [];
    // AL1: «no es menor que» leído como ≤.
    const idxGe = [0, 2].find(i => ineqs[i][2] === '≥');
    if (idxGe !== undefined) {
      const c = ineqs[idxGe][3];
      const inv = ineqs.map((I, i) => (i === idxGe ? [I[0], I[1], '≤', I[3]] : I));
      const Si = soluciones(inv);
      if (Si.length && acotado(Si) && (sub === 'maximo' || Si.length === 1)) errores.push(hip('no-menor-que-como-a-lo-mas', valorDe(Si),
        `Leíste «no es menor que ${c}» como ≤ ${c}. Significa ≥ ${c}.`));
      const est = ineqs.map((I, i) => (i === idxGe ? [I[0], I[1], '>', I[3]] : I));
      const Se = soluciones(est);
      if (Se.length && (sub === 'maximo' || Se.length === 1)) errores.push(hip('extremo-excluido', valorDe(Se),
        `Tomaste «no es menor que ${c}» como > ${c}: el caso igual a ${c} sí vale.`));
    }
    if (sub === 'unico') {
      const [x, y] = S[0];
      const pide = pedido === 'suma' ? 'la suma' : 'el producto';
      errores.push(ar5('solo-una-cantidad', x, `${x} es solo x. Se pide ${pide} con y.`));
      errores.push(ar5('solo-una-cantidad', y, `${y} es solo y. Se pide ${pide} con x.`));
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
        `Tomaste el vértice (${qt(Vx[0])}; ${qt(Vx[1])}), que no es entero, y redondeaste. Ninguna pareja entera llega ahí.`));
      errores.push(ar5('el-menor', Math.min(...S.map(obj)), 'Ese es el menor valor posible. Se pide el mayor.'));
      errores.push(ar5('cuenta-parejas', S.length, `Hay ${S.length} parejas posibles; no se pide cuántas, sino el mayor valor.`));
      const sinTercera = soluciones([I1, I2]);
      if (sinTercera.length && acotado(sinTercera)) errores.push(err('olvida-una-condicion', valorDe(sinTercera), `Ese valor no cumple ${ineqTxt(I3)}. Las tres condiciones van a la vez.`));
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
    const enunciado = [`Una auxiliar compró varios paquetes. Cada paquete costó ${a} soles más que el número de paquetes, y gastó más de `,
      v('A', `S/ ${A}`), `. Si costara ${b} menos que el número de paquetes, gastaría menos de `, v('B', `S/ ${B}`), '.'];
    const pregunta = ['¿Cuántos ', v('n', 'paquetes'), ' compró?'];
    const D1 = a * a + 4 * A, D2 = b * b + 4 * B;
    const r1 = (-a + Math.sqrt(D1)) / 2, r2 = (b + Math.sqrt(D2)) / 2;
    const solucion = [
      [v('n', 'n'), ` paquetes a n + ${a} soles: n(n + ${a}) > `, v('A', A), ` → n > ${cota(r1)}.`],
      [`Al otro precio: n(n − ${b}) < `, v('B', B), ` → n < ${cota(r2)}.`],
      ['El único entero entre esas cotas es ', v('n', n0), '.'],
    ];
    const errores = [
      g(n0 - 1) === A
        ? al19(n0 - 1, `Resolviste como ecuación: n = ${n0 - 1}. Con ${n0 - 1} paquetes gasta justo S/ ${A}, no más.`)
        : redondeo(n0 - 1, `Redondeaste ${cota(r1)} hacia abajo. Con ${n0 - 1} paquetes gasta S/ ${g(n0 - 1)}, no más de S/ ${A}.`),
      h(n0 + 1) === B
        ? al19(n0 + 1, `Resolviste como ecuación: n = ${n0 + 1}. Con ${n0 + 1} paquetes gastaría justo S/ ${B}, no menos.`)
        : redondeo(n0 + 1, `Redondeaste ${cota(r2)} hacia arriba. Con ${n0 + 1} gastaría S/ ${h(n0 + 1)}, no menos de S/ ${B}.`),
      ar5('el-precio', n0 + a, `S/ ${n0 + a} es el precio de cada paquete. Se pide cuántos compró.`),
      ar5('el-precio-supuesto', n0 - b, `S/ ${n0 - b} es el precio supuesto. Se pide cuántos paquetes compró.`),
    ];
    const viva = (alts, resp) => escena(alts, resp, {
      variable: 'n', color: 'd', arrastra: true, extra: [r1, r2],
      alt: `Recta de n: n > ${cota(r1)} y n < ${cota(r2)}; solo el ${n0} cumple las dos`,
      elementos: [
        { tipo: 'intervalo', a: r1, b: null, ca: false, color: 'o', rotulo: `n > ${cota(r1)}`, fila: 2, desde: 1 },
        { tipo: 'intervalo', a: null, b: r2, cb: false, color: 'i', rotulo: `n < ${cota(r2)}`, fila: 1, desde: 2 },
        { tipo: 'enteros', a: n0, b: n0, color: 'd', rotulo: `n = ${n0}`, fila: 0, desde: 3 },
      ],
      pasos: [
        paso(1, ['El gasto real pasa de ', v('A', `S/ ${A}`), '.'], [`n(n + ${a}) > ${A} → n > ${cota(r1)}`]),
        paso(2, ['Al otro precio no llegaría a ', v('B', `S/ ${B}`), '.'], [`n(n − ${b}) < ${B} → n < ${cota(r2)}`]),
        paso(3, ['El único entero entre las dos cotas es ', v('n', n0), '.'], [`${n0}·${n0 + a} = ${g(n0)} > ${A} y ${n0}·${n0 - b} = ${h(n0)} < ${B}`], true),
      ],
    });
    return cerrar(rng, semilla, { correcta: n0, errores, texto: x => N(x), variables, enunciado, pregunta, solucion, viva,
      datos: { tipo: 'cuadratica-entera', a, b, A, B } });
  }

  // ======================= area =======================
  function perimetroComun(rng, semilla) {
    const s = rng.entero(6, 20), D = rng.entero(2, Math.min(s * s - 1, 45));
    const rD = Math.floor(Math.sqrt(D) + 1e-12), exacta = rD * rD === D;
    const xm = s + rD, Amin = s * s - D;
    const variables = { s: { nombre: 'lado del cuadrado', color: 'o' }, D: { nombre: 'lo que se le resta al área', color: 'i' }, x: { nombre: 'largo del rectángulo', color: 'd' } };
    const enunciado = ['Un cuadrado de ', v('s', `${s} cm`), ' de lado y un rectángulo de lados enteros tienen igual perímetro. El área del rectángulo no es menor que la del cuadrado menos ',
      v('D', `${D} cm²`), '.'];
    const pregunta = ['¿Cuál es el mayor ', v('x', 'largo'), ' posible?'];
    const solucion = [
      ['Largo + ancho = ', `${2 * s} cm`, '; si el largo es ', v('x', 'x'), `, el ancho es ${2 * s} − x.`],
      [`x(${2 * s} − x) ≥ ${s}² − `, v('D', D), ` = ${Amin} → (x − ${s})² ≤ ${D}.`],
      [`x ≤ ${s} + √${D}${exacta ? ' = ' + xm : ' ≈ ' + N(s + Math.sqrt(D))}: el mayor entero es `, v('x', `${xm} cm`), '.'],
    ];
    const xMal = Math.floor(2 * s + Math.sqrt(3 * s * s + D) + 1e-12);
    const errores = [
      exacta
        ? hip('extremo-excluido', xm - 1, `Con largo ${xm} el área es justo ${Amin} cm², y vale: «no es menor» incluye el igual.`)
        : redondeo(xm + 1, `Redondeaste ${N(s + Math.sqrt(D))} hacia arriba: con largo ${xm + 1} el área es ${(xm + 1) * (2 * s - xm - 1)} cm², menos de ${Amin}.`),
      err('perimetro-como-suma-de-dos-lados', xMal, `Tomaste largo + ancho = ${4 * s} cm, el perímetro entero. Es la mitad: ${2 * s} cm.`),
      hip('no-menor-que-como-a-lo-mas', 2 * s - 1, `Leíste «no es menor que» como «a lo más». Con largo ${2 * s - 1} el área es solo ${2 * s - 1} cm².`),
      ar5('el-ancho', 2 * s - xm, `${2 * s - xm} cm es el ancho. Se pide el largo.`),
      ar5('el-lado-del-cuadrado', s, `${s} cm es el lado del cuadrado. Se pide el mayor largo.`),
    ];
    const lo = s - Math.sqrt(D), hi = s + Math.sqrt(D);
    const viva = (alts, resp) => escena(alts, resp, {
      variable: 'x', color: 'd', sufijo: ' cm', arrastra: true, extra: [lo, hi],
      alt: `Recta del largo x: el cuadrado es x = ${s}; el área pide x entre ${cota(lo)} y ${cota(hi)}; el mayor entero es ${xm}`,
      elementos: [
        { tipo: 'punto', x: s, color: 'o', rotulo: `cuadrado: ${s}`, fila: 2, desde: 1 },
        { tipo: 'intervalo', a: lo, b: hi, ca: true, cb: true, color: 'i', rotulo: `(x − ${s})² ≤ ${D}`, fila: 1, desde: 2 },
        { tipo: 'enteros', a: s, b: xm, color: 'd', rotulo: `x ≤ ${xm}`, fila: 0, desde: 3 },
      ],
      pasos: [
        paso(1, ['Mismo perímetro: largo + ancho = ', `${2 * s} cm`, ', como el cuadrado.'], [`ancho = ${2 * s} − x`]),
        paso(2, ['El área no baja de ', `${Amin} cm²`, '.'], [`x(${2 * s} − x) ≥ ${Amin} → (x − ${s})² ≤ ${D}`]),
        paso(3, ['El mayor entero que cumple es ', v('x', `${xm} cm`), '.'], [`x ≤ ${s} + √${D}${exacta ? ' = ' + xm : ' ≈ ' + N(hi)}`], true),
      ],
    });
    return cerrar(rng, semilla, { correcta: xm, errores, texto: x => `${N(x)} cm`, unidad: 'cm', variables, enunciado, pregunta, solucion, viva,
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
    const enunciado = ['Un rectángulo mide ', v('x', 'x'), ` cm por (x + ${a}) cm; otro, ${lado2} por (x − ${b}) cm, con x entero. La suma de sus áreas está entre `,
      v('B', `${Bc} cm²`), ' y ', v('A', `${Ac} cm²`), '.'];
    const pregunta = ['¿Cuál es el ', v('P', 'perímetro'), ' del primero?'];
    const k = a + c - b, poli = pol([2, k, -b * c]);
    // Raíces positivas de 2x² + kx − bc = cota: dónde la suma de áreas cruza cada cota.
    const raiz = C => (-k + Math.sqrt(k * k + 8 * (b * c + C))) / 4;
    const r1 = raiz(Bc), r2 = raiz(Ac);
    const solucion = [
      [`Suma de áreas: ${poli}.`],
      [v('B', Bc), ` < ${poli} < `, v('A', Ac), ` → ${cota(r1)} < x < ${cota(r2)}.`],
      ['Solo ', v('x', `x = ${x0}`), ': ', v('P', `perímetro = 2(${x0} + ${x0 + a}) = ${P1} cm`), '.'],
    ];
    const errores = [
      err('semiperimetro', 2 * x0 + a, `${2 * x0 + a} cm es largo + ancho, medio perímetro. El perímetro suma los cuatro lados.`),
      ar5('el-otro-rectangulo', 2 * (2 * x0 + c - b), `${2 * (2 * x0 + c - b)} cm es el perímetro del segundo. Se pide el del primero.`),
      S(x0 - 1) === Bc
        ? al19(2 * (2 * (x0 - 1) + a), `Resolviste como ecuación: x = ${x0 - 1}. Ahí la suma es justo ${Bc} cm², no más.`)
        : redondeo(2 * (2 * (x0 - 1) + a), `Usaste x = ${x0 - 1}: la suma de áreas sería ${S(x0 - 1)} cm², no mayor que ${Bc}.`),
      S(x0 + 1) === Ac
        ? al19(2 * (2 * (x0 + 1) + a), `Resolviste como ecuación: x = ${x0 + 1}. Ahí la suma es justo ${Ac} cm², no menos.`)
        : redondeo(2 * (2 * (x0 + 1) + a), `Usaste x = ${x0 + 1}: la suma de áreas sería ${S(x0 + 1)} cm², no menor que ${Ac}.`),
      ar5('el-valor-de-x', x0, `${x0} es x, el ancho del primero. Se pide su perímetro.`),
    ];
    const fantasma = alt => {
      if (alt.error.id === 'responde-el-valor-de-x') return { marca: x0, rotulo: 'eso es x' };
      if (alt.error.id === 'AL19-inecuacion-como-ecuacion' || alt.error.id === 'redondeo-de-la-cota') {
        const x = (alt.valor / 2 - a) / 2; // perímetro 2(2x + a) → el x que se usó
        return Number.isInteger(x) ? { marca: x, rotulo: 'x usado' } : null;
      }
      return null;
    };
    const viva = (alts, resp) => escena(alts, resp, {
      variable: 'x', color: 'o', extra: [r1, r2, x0], fantasma,
      alt: `Recta de x: la suma de áreas pide x entre ${cota(r1)} y ${cota(r2)}; solo el ${x0} cumple`,
      elementos: [
        { tipo: 'intervalo', a: r1, b: null, ca: false, color: 'i', rotulo: `x > ${cota(r1)}`, fila: 2, desde: 1 },
        { tipo: 'intervalo', a: null, b: r2, cb: false, color: 'h', rotulo: `x < ${cota(r2)}`, fila: 1, desde: 2 },
        { tipo: 'enteros', a: x0, b: x0, color: 'o', rotulo: `x = ${x0}`, fila: 0, desde: 3 },
      ],
      pasos: [
        paso(1, ['La suma de áreas pasa de ', v('B', `${Bc} cm²`), '.'], [`${poli} > ${Bc} → x > ${cota(r1)}`]),
        paso(2, ['Y no llega a ', v('A', `${Ac} cm²`), '.'], [`${poli} < ${Ac} → x < ${cota(r2)}`]),
        paso(3, ['Solo ', v('x', `x = ${x0}`), ` cumple: el primero mide ${x0} × ${x0 + a}.`], [v('P', `P = 2(${x0} + ${x0 + a}) = ${P1} cm`)], true),
      ],
    });
    return cerrar(rng, semilla, { correcta: P1, errores, texto: x => `${N(x)} cm`, unidad: 'cm', variables, enunciado, pregunta, solucion, viva,
      datos: { tipo: 'area', sub: 'dos-rectangulos', a, b, c, B: Bc, A: Ac } });
  }

  // ======================= discriminante =======================
  function menorEntero(rng, semilla) {
    const a = rng.elegir([1, 1, 2, 3]), b = rng.elegir([-12, -10, -9, -8, -7, -6, -5, -4, 4, 5, 6, 7, 8, 9, 10, 12]);
    const t = fr(b * b, 4 * a);
    if (qv(t) < 2) return null;
    const ans = piso(t) + 1, entero = t.d === 1;
    const variables = { k: { nombre: 'k', color: 'd' } };
    const enunciado = ['Se quiere que ', `${pol([a, b, 0])} + `, v('k', 'k'), ' > 0 para todo número real x.'];
    const pregunta = ['¿Cuál es el menor valor entero de ', v('k', 'k'), '?'];
    const vx = fr(-b, 2 * a);
    const solucion = [
      [`Abre hacia arriba (${a} > 0): basta que no toque el eje, Δ < 0.`],
      [`Δ = ${b * b} − ${4 * a}k < 0 → k > ${qDec(t)}.`],
      ['El menor entero es ', v('k', ans), '.'],
    ];
    const errores = [
      entero ? al19(t.n, `Resolviste Δ = 0: k = ${t.n}. Con ese k la expresión vale 0 en x = ${qt(vx)}, no es positiva.`)
        : redondeo(piso(t), `Redondeaste ${qt(t)} hacia abajo. Con k = ${piso(t)}, Δ > 0 y la expresión se hace negativa.`),
      err('discriminante-signo-invertido', techo(t) - 1, `Pediste Δ > 0: da k < ${qt(t)}. Para no cortar el eje, Δ < 0.`),
      err('discriminante-sin-el-4', piso(fr(b * b, a)) + 1, 'Olvidaste el 4 de Δ = b² − 4ac.'),
      ...(a !== 1 ? [err('discriminante-sin-a', piso(fr(b * b, 4)) + 1, `Olvidaste el coeficiente ${a} de x² en Δ = b² − 4ac.`)] : []),
      ...(vx.d === 1 && vx.n > 0 ? [ar5('el-vertice', vx.n, `${vx.n} es la abscisa del vértice. Se pide k.`)] : []),
    ];
    const viva = (alts, resp) => escena(alts, resp, {
      variable: 'k', color: 'd', arrastra: true, extra: [qv(t)], filas: 1,
      alt: `Recta de k: Δ < 0 pide k > ${qt(t)}; el menor entero es ${ans}`,
      elementos: [
        { tipo: 'intervalo', a: qv(t), b: null, ca: false, color: 'd', rotulo: `k > ${qt(t)}`, fila: 1, desde: 1 },
        { tipo: 'enteros', a: ans, b: ans, color: 'd', rotulo: `k = ${ans}`, fila: 0, desde: 2 },
      ],
      pasos: [
        paso(1, [`Abre hacia arriba: basta que no toque el eje, Δ < 0.`], [`Δ = ${b * b} − ${4 * a}k < 0 → k > ${qDec(t)}`]),
        paso(2, [`El menor entero mayor que ${qt(t)} es `, v('k', ans), '.'], [entero ? `Con k = ${t.n} vale 0 en x = ${qt(vx)}` : `k = ${ans}`], true),
      ],
    });
    return cerrar(rng, semilla, { correcta: ans, errores, texto: x => N(x), variables, enunciado, pregunta, solucion, viva,
      datos: { tipo: 'discriminante', sub: 'menor-entero', a, b } });
  }

  function pelota(rng, semilla) {
    const vel = rng.elegir([6, 8, 10, 12, 14, 16, 18, 20]), h0 = rng.entero(2, 15);
    const max = fr(20 * h0 + vel * vel, 20);
    const entero = max.d === 1, ans = piso(max) + 1;
    const variables = { h0: { nombre: 'altura inicial', color: 'o' }, vv: { nombre: 'rapidez inicial', color: 'i' }, H: { nombre: 'altura de la malla', color: 'd' } };
    const enunciado = ['Desde ', v('h0', `${h0} m`), ' de altura se lanza una pelota hacia arriba: h(t) = −5t² + ',
      v('vv', vel), 't + ', v('h0', h0), '. Encima se pondrá una malla horizontal que la pelota no debe tocar.'];
    const pregunta = ['¿A qué menor ', v('H', 'altura'), ' entera, en metros, se puede poner?'];
    const hm = N(qv(max));
    const solucion = [
      ['No la toca si h(t) < ', v('H', 'H'), ' para todo t: 5t² − ', v('vv', vel), 't + (H − ', v('h0', h0), ') > 0.'],
      [`Δ < 0: ${vel}² − 20(H − ${h0}) < 0 → H > ${hm}.`],
      ['La menor altura entera es ', v('H', `${ans} m`), '.'],
    ];
    const errores = [
      entero ? al19(max.n, `Resolviste Δ = 0: H = ${max.n}. A esa altura la pelota llega justo y la toca.`)
        : redondeo(piso(max), `Redondeaste ${hm} hacia abajo. La pelota sube hasta ${hm} m: tocaría la malla a ${piso(max)} m.`),
      err('discriminante-signo-invertido', techo(max) - 1, 'Pediste Δ > 0: son alturas que la pelota sí alcanza. Para no tocarla, Δ < 0.'),
      err('discriminante-sin-el-4', piso(fr(5 * h0 + vel * vel, 5)) + 1, 'Olvidaste el 4 de Δ = b² − 4ac.'),
      err('olvida-la-altura-inicial', piso(fr(vel * vel, 20)) + 1, `No sumaste los ${h0} m de partida: la altura se mide desde el suelo.`),
    ];
    const viva = (alts, resp) => escena(alts, resp, {
      variable: 'H', color: 'd', sufijo: ' m', arrastra: true, extra: [h0, qv(max)],
      alt: `Recta de alturas: la pelota sube de ${h0} m a ${hm} m; la malla va más arriba, en ${ans} m`,
      elementos: [
        { tipo: 'intervalo', a: h0, b: qv(max), ca: true, cb: true, color: 'i', rotulo: `la pelota: hasta ${hm}`, fila: 1, desde: 1 },
        { tipo: 'intervalo', a: qv(max), b: null, ca: false, color: 'd', rotulo: `H > ${hm}`, fila: 2, desde: 2 },
        { tipo: 'enteros', a: ans, b: ans, color: 'd', rotulo: `H = ${ans}`, fila: 0, desde: 3 },
      ],
      pasos: [
        paso(1, ['No la toca si h(t) < ', v('H', 'H'), ' para todo t.'], [`5t² − ${vel}t + (H − ${h0}) > 0`]),
        paso(2, ['Para todo t hace falta Δ < 0.'], [`${vel}² − 20(H − ${h0}) < 0 → H > ${hm}`]),
        paso(3, ['La menor altura entera es ', v('H', `${ans} m`), '.'], [`${ans} > ${hm}`], true),
      ],
    });
    return cerrar(rng, semilla, { correcta: ans, errores, texto: x => `${N(x)} m`, unidad: 'm', variables, enunciado, pregunta, solucion, viva,
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
      [`Debe abrir hacia ${positivo ? 'arriba' : 'abajo'} y no tocar el eje: `, v('k', 'k'), ` ${positivo ? '>' : '<'} 0 y Δ < 0.`],
      [`Δ = ${b * b} − 4k² < 0 → k < −${m} o k > ${m}.`],
      [`Con k ${positivo ? '>' : '<'} 0 queda k ∈ `, v('k', correcta.texto), '.'],
    ];
    const union = intervalo([pz(null, false, -m, false), pz(m, false, null, false)]);
    const errores = [
      conTexto(err('olvida-el-signo-de-a', 0, `Falta que k sea ${positivo ? 'positivo' : 'negativo'}: con k ${positivo ? `< −${m}` : `> ${m}`} la parábola abre al otro lado.`), union),
      conTexto(err('discriminante-signo-invertido', 0, `Pediste Δ > 0. Así la parábola corta el eje y cambia de signo.`), intervalo([pz(-m, false, m, false)])),
      conTexto(hip('extremo-incluido', 0, `Con k = ${N(positivo ? m : -m)}, Δ = 0 y la expresión vale 0 en un punto.`),
        intervalo(positivo ? [pz(m, true, null, false)] : [pz(null, false, -m, true)])),
      conTexto(err('solo-el-coeficiente-principal', 0, `Pediste solo k ${positivo ? '>' : '<'} 0. Con k = ${qt(fr(positivo ? m : -m, 2))}, Δ > 0 y corta el eje.`),
        intervalo(positivo ? [pz(0, false, null, false)] : [pz(null, false, 0, false)])),
    ];
    const signo = positivo ? { a: 0, b: null, rot: 'k > 0' } : { a: null, b: 0, rot: 'k < 0' };
    const viva = (alts, resp) => escena(alts, resp, {
      variable: 'k', color: 'd', extra: [-m, m, 0], fantasma: fantasmaTexto,
      alt: `Recta de k: ${signo.rot}; Δ < 0 pide k < −${m} o k > ${m}; las dos a la vez: ${correcta.texto}`,
      elementos: [
        { tipo: 'intervalo', a: signo.a, b: signo.b, ca: false, cb: false, color: 'o', rotulo: signo.rot, fila: 2, desde: 1 },
        { tipo: 'intervalo', a: null, b: -m, cb: false, color: null, rotulo: `k < −${m}`, fila: 1, desde: 2 },
        { tipo: 'intervalo', a: m, b: null, ca: false, color: null, rotulo: `k > ${m}`, fila: 1, desde: 2 },
        positivo ? { tipo: 'intervalo', a: m, b: null, ca: false, color: 'd', fila: 0, desde: 3 } : { tipo: 'intervalo', a: null, b: -m, cb: false, color: 'd', fila: 0, desde: 3 },
      ],
      pasos: [
        paso(1, [`Para ser ${positivo ? 'positiva' : 'negativa'} siempre, abre hacia ${positivo ? 'arriba' : 'abajo'}.`], [`k ${positivo ? '>' : '<'} 0`]),
        paso(2, ['Y no toca el eje: Δ < 0.'], [`${b * b} − 4k² < 0 → k < −${m} o k > ${m}`]),
        paso(3, ['Las dos condiciones a la vez.'], ['k ∈ ', v('k', correcta.texto)], true),
      ],
    });
    return cerrarTexto(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion, viva,
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
    // Frases completas (docs/escena-viva.md, regla 1): cada ciclista con su verbo y su condición.
    const enunciado = [`Los ciclistas A y B se acercan, a ${vA} y ${vB} km/h. A sale del km `, v('p', 'p'), `, el mayor x que cumple ${e1} ≤ 0. B sale del km `,
      v('q', 'q'), `, el menor entero que cumple ${e2} < 0.`];
    const pregunta = ['¿En cuántas horas se ', v('t', 'encuentran'), '?'];
    const solucion = [
      [`${factor(r1)}${factor(r2)} ≤ 0 → [${r1}; ${r2}]: `, v('p', `p = ${p}`), '.'],
      [`${factor(s1)}${factor(s2)} < 0 → ⟨${s1}; ${s2}⟩: `, v('q', `q = ${q}`), '.'],
      [`Distancia ${d} km, se acercan a ${vA + vB} km/h: `, v('t', `t = ${N(t)} h`), '.'],
    ];
    const S = vA + vB;
    const errores = [
      hip('extremo-excluido-tomado', (p - s1) / S, `${s1} sería el menor si el intervalo fuera cerrado; en ⟨${s1}; ${s2}⟩ no entra: B sale del ${q}.`),
      err('otro-extremo', Math.abs(q - r1) / S, `El intervalo [${r1}; ${r2}] está bien; ${r1} es su menor elemento y A sale del mayor, ${r2}.`),
      err('otro-extremo', (p - (s2 - 1)) / S, `Los enteros de ⟨${s1}; ${s2}⟩ están bien; ${s2 - 1} es el mayor y B sale del menor, ${q}.`),
      err('encuentro-con-resta', d / Math.abs(vA - vB), `Restar rapideces sirve si uno persigue al otro; aquí van de frente y se acercan a ${S} km/h.`),
    ];
    const fantasma = a => (a.error.id === 'extremo-excluido-tomado' ? { elementos: [{ tipo: 'punto', x: s1 }], rotulo: `B en ${s1}` } : null);
    const viva = (alts, resp) => escena(alts, resp, {
      variable: 'km', color: null, extra: [r1, r2, s1, s2], filas: 3, fantasma,
      alt: `Recta de kilómetros: A en ${p}, el mayor de [${r1}; ${r2}]; B en ${q}, el menor entero de ⟨${s1}; ${s2}⟩; los separan ${d} km`,
      elementos: [
        { tipo: 'intervalo', a: r1, b: r2, ca: true, cb: true, color: 'o', rotulo: `[${r1}; ${r2}]`, fila: 2, desde: 1 },
        { tipo: 'punto', x: p, color: 'o', rotulo: `A: ${p}`, fila: 0, desde: 1 },
        { tipo: 'intervalo', a: s1, b: s2, ca: false, cb: false, color: 'i', rotulo: `⟨${s1}; ${s2}⟩`, fila: 1, desde: 2 },
        { tipo: 'punto', x: q, color: 'i', rotulo: `B: ${q}`, fila: 0, desde: 2 },
        { tipo: 'distancia', a: q, b: p, color: 'd', rotulo: `${d} km`, fila: 3, desde: 3 },
      ],
      pasos: [
        paso(1, ['A sale del mayor elemento del intervalo: ', v('p', `p = ${p}`), '.'], [`${factor(r1)}${factor(r2)} ≤ 0 → [${r1}; ${r2}]`]),
        paso(2, ['B sale del menor entero del intervalo abierto: ', v('q', `q = ${q}`), '.'], [`${factor(s1)}${factor(s2)} < 0 → ⟨${s1}; ${s2}⟩`]),
        paso(3, [`Los separan ${d} km y se acercan a ${S} km/h.`], ['t = ', v('t', `${d}/${S} = ${N(t)} h`)], true),
      ],
    });
    return cerrar(rng, semilla, { correcta: t, errores, texto: x => `${N(x)} h`, unidad: 'h', variables, enunciado, pregunta, solucion, viva,
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
    const sep = `E = ${pp} ${m < 0 ? '−' : '+'} ${Math.abs(m)}/(x + ${r})`;
    const solucion = [
      [`Se separa la parte entera: ${sep}.`],
      [`x + ${r} ∈ ${Ir} es positivo; al invertir se da vuelta: 1/(x + ${r}) ∈ ${inv}.`],
      [`Por ${N(m)}${m < 0 ? ' (se da vuelta otra vez)' : ''} y más ${pp}: `, v('E', `E ∈ ${correcta.texto}`), '.'],
    ];
    const errores = [
      conTexto(hip('corchetes-cambiados', 0, `Los extremos están bien; los corchetes no. ${qt(lo)} sale de x = ${decrece ? b : a}, que ${(decrece ? !izqCerrado : izqCerrado) ? 'sí' : 'no'} está.`),
        intervalo([{ lo, lc: !lc, hi, hc: !hc }])),
      conTexto(hip('todo-cerrado', 0, 'Cerraste los dos extremos, pero uno sale de un extremo de x que no está incluido.'), intervalo([{ lo, lc: true, hi, hc: true }])),
      conTexto(err('olvida-la-parte-entera', 0, `Ese es el intervalo de ${N(m)}/(x + ${r}). Falta sumar la parte entera, ${pp}.`),
        intervalo([{ lo: fr(lo.n - pp * lo.d, lo.d), lc, hi: fr(hi.n - pp * hi.d, hi.d), hc }])),
      pp * a + q > 0 ? conTexto(err('numerador-y-denominador-por-separado', 0, 'Acotaste numerador y denominador por separado. Dependen del mismo x: no llegan a sus extremos a la vez.'),
        intervalo([{ lo: fr(pp * a + q, b + r), lc: false, hi: fr(pp * b + q, a + r), hc: false }])) : null,
    ];
    const ext = (x, fx, incl) => ({ tipo: 'punto', x: qv(fx), abierto: !incl, color: 'o', rotulo: `x = ${x}: ${qt(fx)}`, fila: x === (decrece ? b : a) ? 2 : 1, desde: 1 });
    const viva = (alts, resp) => escena(alts, resp, {
      variable: 'E', color: 'd', fantasma: fantasmaTexto,
      extra: [qv(lo), qv(hi), ...alts.flatMap(x => extremos(claveDe(x)))],
      alt: `Recta de E: en x = ${a} vale ${qt(fa)} y en x = ${b} vale ${qt(fb)}; E ∈ ${correcta.texto}`,
      elementos: [
        ext(a, fa, izqCerrado), ext(b, fb, !izqCerrado),
        { tipo: 'intervalo', a: qv(lo), b: qv(hi), ca: lc, cb: hc, color: 'd', fila: 0, desde: 2 },
      ],
      pasos: [
        paso(1, ['E va de un extremo al otro; mira cuál incluye ', v('x', 'x'), '.'], [sep]),
        paso(2, ['Cada corchete va con el extremo de x que lo produce.'], ['E ∈ ', v('E', correcta.texto)], true),
      ],
    });
    return cerrarTexto(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion, viva,
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
    const Ea = fr(k, a * a + c), Eb = fr(k, b * b + c), Emin = fr(k, M + c);
    const solucion = [
      ['El 0 está dentro: x² va de 0 a ', `${M}`, ` (en x = ${N(lejos)}).`],
      [`x² + ${c} ∈ [${c}; ${M + c}] → E ∈ [${qt(Emin)}; ${qt(fr(k, c))}].`],
      ['El mayor valor es ', v('E', correcta.texto), ', en x = 0.'],
    ];
    const mid = fr(a + b, 2);
    const errores = [
      conTexto(err('solo-los-extremos', 0, `Evaluaste solo en x = ${N(a)} y x = ${b}. En x = 0, dentro del intervalo, E es mayor.`), numero(fr(k, mn + c))),
      conTexto(ar5('el-menor-valor', 0, `${qt(Emin)} es el menor valor de E. Se pide el mayor.`), numero(Emin)),
      conTexto(err('maximo-en-el-centro', 0, `Evaluaste en el centro, x = ${qt(mid)}. E es máximo donde x² es mínimo: x = 0.`), numero(fr(k * mid.d * mid.d, mid.n * mid.n + c * mid.d * mid.d))),
      a + c > 0 ? conTexto(err('olvida-el-cuadrado', 0, `Usaste x en vez de x² y tomaste x = ${N(a)}. Pero x² es mínimo en x = 0.`), numero(fr(k, a + c))) : null,
    ];
    const viva = (alts, resp) => escena(alts, resp, {
      variable: 'E', color: 'd', fantasma: fantasmaTexto,
      extra: [qv(Emin), k / c, ...alts.map(numDe)],
      alt: `Recta de E: en x = ${N(a)} vale ${qt(Ea)}, en x = ${b} vale ${qt(Eb)} y en x = 0, el mayor, ${correcta.texto}`,
      elementos: [
        { tipo: 'punto', x: qv(Ea), color: 'o', rotulo: `x = ${N(a)}`, fila: 2, desde: 1 },
        { tipo: 'punto', x: qv(Eb), color: 'o', rotulo: `x = ${b}`, fila: Ea.n * Eb.d === Eb.n * Ea.d ? 2 : 1, desde: 1 },
        { tipo: 'intervalo', a: qv(Emin), b: k / c, ca: true, cb: true, color: 'd', fila: 0, desde: 2 },
        { tipo: 'punto', x: k / c, color: 'd', rotulo: `x = 0: ${correcta.texto}`, fila: 1, desde: 3 },
      ],
      pasos: [
        paso(1, ['En los extremos de ', v('x', 'x'), ', E vale:'], [`x = ${N(a)} → ${qt(Ea)}; x = ${b} → ${qt(Eb)}`]),
        paso(2, ['Pero x = 0 está dentro: ahí x² es mínimo.'], [`x² ∈ [0; ${M}] → E ∈ [${qt(Emin)}; ${qt(fr(k, c))}]`]),
        paso(3, ['El mayor valor es ', v('E', correcta.texto), ', en x = 0.'], [`${k}/(0 + ${c}) = ${correcta.texto}`], true),
      ],
    });
    return cerrarTexto(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion, viva,
      datos: { tipo: 'racional', sub: 'cuadrado', k, c, a, b } });
  }

  // ======================= medias =======================
  // Sin escena: la desigualdad de medias no se lee en una recta.
  function medias(rng, semilla) {
    const k = rng.entero(1, 3), ex = rng.elegir([1, 2]), y0 = rng.entero(4, 30);
    const x0 = (k + 2) * y0 / ex;
    if (!Number.isInteger(x0)) return null;
    const A = x0 * y0;
    if (A > 5000 || A < 60) return null;
    const L = 2 * ex * x0;
    const variables = { A: { nombre: 'área del terreno', color: 'o' }, x: { nombre: 'frente', color: 'i' }, y: { nombre: 'costado', color: 'h' }, L: { nombre: 'longitud de cerco', color: 'd' } };
    const div = k === 1 ? 'el divisorio' : `los ${k} divisorios`;
    const enunciado = ['Se cercará un terreno rectangular de ', v('A', `${A} m²`), ` y se dividirá en ${k + 1} parcelas con ${k === 1 ? 'un cerco paralelo' : `${k} cercos paralelos`} a los costados.`,
      ex === 1 ? ' El frente da a un muro y no se cerca.' : ''];
    const pregunta = ['¿Cuál es la menor ', v('L', 'longitud de alambre'), ', en metros?'];
    const exT = ex === 1 ? '' : '2';
    const solucion = [
      ['Con frente ', v('x', 'x'), ' y costado ', v('y', 'y'), ': x·y = ', v('A', A), '.'],
      [`Alambre: ${ex === 2 ? 'frente y fondo' : 'el fondo'}, dos costados y ${div}: `, v('L', `L = ${exT}x + ${k + 2}y`), '.'],
      [`Medias: ${exT}x + ${k + 2}y ≥ 2√(${ex * (k + 2)}·${A}) = ${L}.`],
      [`Igualdad si ${exT}x = ${k + 2}y: `, v('x', `x = ${x0} m`), ', ', v('y', `y = ${y0} m`), '; ', v('L', `L = ${L} m`), '.'],
    ];
    const errores = [
      err('sin-cercos-divisorios', 2 * Math.sqrt(ex * 2 * A), `No contaste ${k === 1 ? 'el cerco divisorio' : 'los cercos divisorios'}: también son alambre.`),
      err('lados-sin-ponderar', (ex + 2 + k) * Math.sqrt(A), 'Tomaste el terreno cuadrado. Eso sirve solo si x e y pesan igual en L.'),
      err('medias-sin-el-2', L / 2, 'Olvidaste el 2 de la desigualdad de medias: a + b ≥ 2√(ab).'),
      ...(ex === 1 ? [err('cerca-el-muro', 2 * Math.sqrt(2 * (k + 2) * A), 'Contaste también el frente, que da al muro y no se cerca.')] : []),
      ar5('el-frente', x0, `${x0} m es el frente óptimo. Se pide el alambre total.`),
      hip('olvida-los-divisorios-al-sumar', ex * x0 + 2 * y0, `Con ${x0} m y ${y0} m no sumaste ${div}, que también son alambre.`),
      ar5('el-costado', y0, `${y0} m es el costado óptimo. Se pide el alambre total.`),
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
      ['Con ', v('a', `a = ${lineal(...U)}`), ' y ', v('b', `b = ${lineal(...W)}`), `, a + b = ${lineal(...Sm)}: |a| + |b| ≤ |a + b|.`],
      ['Siempre |a + b| ≤ |a| + |b|: solo vale la igualdad, con a·b ≥ 0.'],
      [sub === 'mismo' ? `${factor(p)}${factor(q)} ≥ 0 → x ≤ ${N(p)} o x ≥ ${N(q)}.` : `${factor(p)}${factor(q)} ≤ 0 → ${N(p)} ≤ x ≤ ${N(q)}.`],
      ['C.S. = ', v('C', correcta.texto), '.'],
    ];
    const errores = [
      conTexto(err('signo-del-producto-invertido', 0, 'Pediste a·b ≤ 0, signos opuestos. Ahí |a + b| es menor que |a| + |b|.'), sub === 'mismo' ? dentro : fuera),
      conTexto(hip('extremo-excluido', 0, `Dejaste fuera x = ${N(p)} y x = ${N(q)}. Ahí uno vale 0 y la igualdad se cumple.`),
        sub === 'mismo' ? intervalo([pz(null, false, p, false), pz(q, false, null, false)]) : intervalo([pz(p, false, q, false)])),
      conTexto(err('AL22-suma-de-absolutos', 0, 'Tomaste |a| + |b| = |a + b| siempre. Solo vale si a y b no tienen signos opuestos.', 'parcial', FAL), intervalo([pz(null, false, null, false)])),
      conTexto(err('triangular-sin-igualdad', 0, 'La desigualdad triangular admite la igualdad: cuando a y b tienen el mismo signo.'), intervalo([])),
    ];
    const ceroA = U === A ? p : q, ceroB = U === A ? q : p;
    const viva = (alts, resp) => escena(alts, resp, {
      variable: 'x', color: null, extra: [p, q], fantasma: fantasmaTexto, filas: 1,
      alt: `Recta de x: a vale 0 en ${N(ceroA)} y b en ${N(ceroB)}; el conjunto solución es ${correcta.texto}`,
      elementos: [
        { tipo: 'punto', x: ceroA, color: 'o', rotulo: 'a = 0', fila: 1, desde: 1 },
        { tipo: 'punto', x: ceroB, color: 'i', rotulo: 'b = 0', fila: 1, desde: 1 },
        ...deClave(correcta.clave).map(e => ({ ...e, color: 'd', fila: 0, desde: 2 })),
      ],
      pasos: [
        paso(1, ['Siempre |a + b| ≤ |a| + |b|: solo vale la igualdad.'], [`a = ${lineal(...U)}, b = ${lineal(...W)}`]),
        paso(2, ['La igualdad pide a y b sin signos opuestos: a·b ≥ 0.'], ['C.S. = ', v('C', correcta.texto)], true),
      ],
    });
    return cerrarTexto(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion, viva,
      datos: { tipo: 'valor-absoluto', sub, A, B } });
  }

  // ======================= lineal-entera =======================
  // Sin escena: la región factible es del plano, no de una recta.
  function interseccion(a1, b1, R1, a2, b2, R2) {
    const D = a1 * b2 - a2 * b1;
    if (D === 0) return null;
    return [fr(R1 * b2 - R2 * b1, D), fr(a1 * R2 - a2 * R1, D)];
  }
  // De a dos puntos por línea: «(0; 15) da 450, (1; 14) da 440.»
  const listaPuntos = pts => { const out = []; for (let i = 0; i < pts.length; i += 2) out.push([pts.slice(i, i + 2).map(([x, y, o]) => `(${x}; ${y}) da ${o}`).join(', ') + '.']); return out; };
  const s = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

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
    const enunciado = ['Cada ', v('x', 'chompa'), ` usa ${s(a1, 'ovillo', 'ovillos')} y ${a2} h de trabajo, y deja S/ ${c}. Cada `, v('y', 'chalina'), ` usa ${s(b1, 'ovillo', 'ovillos')} y ${b2} h, y deja S/ ${d}. Hay ${R1} ovillos y ${R2} h.`];
    const pregunta = ['¿Cuál es la mayor ', v('G', 'ganancia'), ' con prendas enteras?'];
    const solucion = [
      [`Condiciones: ${ineqTxt([a1, b1, '≤', R1])} y ${ineqTxt([a2, b2, '≤', R2])}, con `, v('x', 'x'), ' e ', v('y', 'y'), ' enteros.'],
      ['Se maximiza ', v('G', `G = ${c}x + ${d}y`), '.'],
      [`El vértice (${qt(Vx)}; ${qt(Vy)}) no es entero: G = ${oV.n} no se alcanza.`],
      ['Para cada x, el mayor y entero:'],
      ...listaPuntos(filas),
      ['La mayor ganancia es ', v('G', `S/ ${opt}`), `, con (${arg[0]}; ${arg[1]}).`],
    ];
    const errores = [
      err('PL-vertice-no-entero', oV.n, `S/ ${oV.n} es la ganancia en el vértice (${qt(Vx)}; ${qt(Vy)}), que no es entero.`),
      err('PL-vertice-redondeado', oF, `Redondeaste el vértice hacia abajo, a (${fx}; ${fy}). Hay puntos enteros con más ganancia.`),
      err('PL-solo-vertices-de-los-ejes', ejes, 'Revisaste solo hacer un tipo de prenda. Mezclando las dos se gana más.'),
      ...(!ok(rx, ry) ? [err('PL-redondeo-al-mas-cercano', c * rx + d * ry, `Redondeaste el vértice a (${rx}; ${ry}), pero ese punto se pasa de ${[a1 * rx + b1 * ry > R1 ? 'ovillos' : '', a2 * rx + b2 * ry > R2 ? 'horas' : ''].filter(Boolean).join(' y ')}.`)] : []),
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
    const enunciado = ['La ', v('x', 'caja A'), ` trae ${s(u1, 'pan', 'panes')} y ${s(u2, 'fruta', 'frutas')}, y cuesta S/ ${ca}. La `, v('y', 'caja B'), ` trae ${s(v1, 'pan', 'panes')} y ${s(v2, 'fruta', 'frutas')}, y cuesta S/ ${cb}. Se necesitan ${R1} panes y ${R2} frutas como mínimo; hay S/ ${Bud}.`];
    const pregunta = ['¿Cuál es el mayor ', v('S', 'sobrante'), '?'];
    const solucion = [
      [`Condiciones: ${ineqTxt([u1, v1, '≥', R1])} y ${ineqTxt([u2, v2, '≥', R2])}, con `, v('x', 'x'), ' e ', v('y', 'y'), ' enteros.'],
      [`Mayor sobrante es menor gasto: se minimiza ${ca}x + ${cb}y.`],
      [`El vértice (${qt(Vx)}; ${qt(Vy)}) no es entero: S/ ${cV.n} no se logra.`],
      ['Para cada x, el menor y entero:'],
      ...listaPuntos(filas),
      [`Menor gasto S/ ${best}, con (${arg[0]}; ${arg[1]}): sobran `, v('S', `S/ ${Bud - best}`), '.'],
    ];
    const errores = [
      err('PL-vertice-no-entero', Bud - cV.n, `Usaste el gasto del vértice (${qt(Vx)}; ${qt(Vy)}), S/ ${cV.n}, que no es entero.`),
      err('PL-vertice-redondeado', Bud - cC, `Redondeaste el vértice hacia arriba, a (${cx}; ${cy}). Hay puntos enteros más baratos.`),
      err('PL-solo-vertices-de-los-ejes', Bud - ejes, 'Revisaste solo comprar un tipo de caja. Mezclando los dos se gasta menos.'),
      ...(!ok(rx, ry) ? [err('PL-redondeo-al-mas-cercano', Bud - (ca * rx + cb * ry), `Redondeaste el vértice a (${rx}; ${ry}), pero así faltan ${[u1 * rx + v1 * ry < R1 ? 'panes' : '', u2 * rx + v2 * ry < R2 ? 'frutas' : ''].filter(Boolean).join(' y ')}.`)] : []),
      err('AR5-el-gasto', best, `S/ ${best} es lo que se gasta. Se pide lo que sobra.`, 'hipotesis', FAR),
    ];
    return cerrar(rng, semilla, { correcta: Bud - best, errores, texto: x => `S/ ${N(x)}`, unidad: 'S/', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'lineal-entera', sub: 'sobrante', u1, v1, u2, v2, R1, R2, ca, cb, presupuesto: Bud } });
  }

  return { id: ID, titulo: 'Inecuaciones y desigualdades en problemas', generar, intervalo, pz };
});
