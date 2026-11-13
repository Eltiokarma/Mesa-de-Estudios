/*
 * Generador: problemas de fracciones, decimales periódicos y MCD (aritmética, números racionales
 * y MCD-MCM). Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['fracciones-problemas']) y en Node (require). No usa ningún motor.
 *
 * Tipos (entre paréntesis, la fila que cubre, por su campo «falta»):
 *   acotada       fracciones irreducibles n/(n + k) entre dos cotas: cuántas hay
 *                 (condiciones sobre fracciones con parámetro entero y acotación)
 *   pesi          dos números con su diferencia y su MCM: A = d·p, B = d·q con p y q PESI; se pide A + B
 *                 (propiedades MCD·cocientes PESI para reconstruir dos números)
 *   porcentaje    gastos sucesivos en porcentajes periódicos (16,666… %): se pasa a fracción y se
 *                 regresa al inicio (porcentajes con decimales periódicos convertidos a fracción)
 *   stock         ventas sucesivas de fracciones del resto con el stock entre cotas y lo que queda
 *                 acotado: el mayor stock (fracciones sucesivas del resto combinadas con cotas enteras)
 *   equivalentes  sub den: equivalentes a a/b con denominador de tres cifras que no es múltiplo de q;
 *                 sub suma: suma de términos de tres cifras y numerador no múltiplo de q
 *                 (contar fracciones equivalentes con restricciones de divisibilidad)
 *   trabajo       una bomba llena una fracción y luego su rendimiento disminuye en a/b: tiempo total
 *                 (trabajo con rendimiento que cambia a mitad de la tarea)
 *   diferencia    sub suma: fracción propia irreducible con suma de términos dada y la menor
 *                 diferencia; sub producto: lo mismo con el producto de los términos
 *                 (elegir la fracción irreducible que minimiza una diferencia)
 *   formar        con cuatro números, todas las fracciones propias irreducibles y su producto
 *                 (formar fracciones propias irreducibles a partir de un conjunto de números)
 *   periodo       sub ultimas: las dos últimas cifras del periodo de a/p, p primo, sin dividir;
 *                 sub lugar: la cifra del lugar k de un periódico puro
 *                 (cifras del periodo de un decimal sin dividir completamente)
 *   suma-entera   a/d y b/d impropias irreducibles con suma entera: cuántos pares (a; b)
 *                 (condiciones sobre fracciones con suma entera y denominadores comunes)
 *   tipo-decimal  sub factorial: N/k!; sub producto: N/D con un factor común escondido; cuántas
 *                 cifras no periódicas y periódicas (relación entre factores del denominador y tipo
 *                 de decimal)
 *   pg-mcd        tres edades en progresión geométrica con producto y suma: MCD del menor y el mayor
 *                 (combinar propiedades de progresiones geométricas con MCD)
 *   euclides      cocientes de Euclides (una división por exceso) y la diferencia: A + B
 *                 (reconstruir números desde los cocientes del algoritmo de Euclides)
 *
 * Convenciones: los periódicos se escriben con puntos suspensivos y el bloque repetido
 * («16,666… %», «27,2727… %»), como en plantillas/fracciones/papel.json. Respuestas que no son un
 * número (fracciones con sus términos, cifras, pares de cantidades) van con armarTexto.
 * Errores: AR3, AR4, AR5, AR8 del informe docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md
 * y trampas de docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md (hipótesis).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'fracciones-problemas';
  const INF = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const v = P.v;
  const F = x => P.formatear(x, 2);
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const mcm = (a, b) => a / mcd(a, b) * b;
  const corto = x => Number.isFinite(x) && x > 0 && Math.abs(x * 100 - Math.round(x * 100)) < 1e-7;
  // Error numérico: los AR llevan la fuente del informe; los demás son hipótesis nuestras.
  const e = (id, valor, explicacion, respaldo = 'hipotesis') => ({ id, valor, explicacion, respaldo, fuente: /^AR\d/.test(id) ? INF : null });
  const et = (id, r, explicacion, respaldo = 'hipotesis') => (r ? { id, clave: r.clave, texto: r.texto, explicacion, respaldo, fuente: /^AR\d/.test(id) ? INF : null } : null);
  const fracTxt = (n, d) => P.textoFraccion(P.frac(n, d));
  const numero = (n, d = 1) => { const f = P.frac(n, d); return { clave: `num:${f.n}/${f.d}`, texto: P.textoFraccion(f) }; };
  const terminos = (a, b) => ({ clave: `t:${a}/${b}`, texto: `${a}/${b}` });
  const primos = n => { const ps = []; for (let p = 2; p * p <= n; p++) if (n % p === 0) { ps.push(p); while (n % p === 0) n /= p; } if (n > 1) ps.push(n); return ps; };
  const val = (n, p) => { let k = 0; while (n % p === 0) { n /= p; k++; } return k; };
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = k => String(k).split('').map(c => SUP[c]).join('');
  const factorizar = n => { const t = []; for (const p of primos(n)) { const k = val(n, p); t.push(p + (k > 1 ? sup(k) : '')); } return t.join('·') || '1'; };
  // Orden de 10 módulo m (m > 1, primo con 10): cifras del periodo de 1/m.
  const orden10 = m => { let x = 10 % m, k = 1; while (x !== 1) { x = x * 10 % m; k++; } return k; };
  // Desarrollo decimal exacto por división larga: parte entera, anteperiodo y periodo.
  function desarrollo(n, d) {
    const ent = Math.floor(n / d); let r = n % d, cif = ''; const vistos = new Map();
    while (r !== 0 && !vistos.has(r)) { vistos.set(r, cif.length); r *= 10; cif += Math.floor(r / d); r %= d; }
    if (r === 0) return { ent, ante: cif, per: '' };
    const i = vistos.get(r); return { ent, ante: cif.slice(0, i), per: cif.slice(i) };
  }
  const conPuntos = ({ ent, ante, per }) => per ? `${P.formatear(ent)},${ante}${per.repeat(per.length === 1 ? 3 : 2)}…` : (ante ? `${P.formatear(ent)},${ante}` : P.formatear(ent));
  const TIPOS = ['acotada', 'pesi', 'porcentaje', 'stock', 'equivalentes', 'trabajo', 'diferencia', 'formar', 'periodo', 'suma-entera', 'tipo-decimal', 'pg-mcd', 'euclides'];

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(TIPOS);
    const sub = SUBS[tipo] ? rng.elegir(SUBS[tipo]) : null;
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  const SUBS = { equivalentes: ['den', 'den', 'suma'], diferencia: ['suma', 'producto', 'producto'], periodo: ['ultimas', 'lugar'], 'tipo-decimal': ['factorial', 'producto'] };
  function construir(rng, semilla, tipo, sub) {
    const f = { acotada, pesi, porcentaje, stock, equivalentes, trabajo, diferencia, formar, periodo,
      'suma-entera': sumaEntera, 'tipo-decimal': tipoDecimal, 'pg-mcd': pgMcd, euclides }[tipo];
    return f(rng, semilla, sub);
  }

  // Con o.viva, el problema trae además escena, pasos, fantasmas y (si se arrastra) la respuesta ampliada.
  function cerrar(rng, semilla, o) {
    let alternativas, respuesta;
    if (o.textual) {
      alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores.filter(Boolean), rng });
      respuesta = { valor: o.correcta.clave, texto: o.correcta.texto, unidad: '' };
    } else {
      const errores = o.errores.filter(x => x && corto(x.valor) && Math.abs(x.valor - o.correcta) > 1e-9);
      alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.texto });
      respuesta = { valor: o.correcta, unidad: o.unidad || '' };
    }
    const pr = { id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta, _datos: o.datos };
    return o.viva ? Object.assign(pr, o.viva(alternativas, respuesta)) : pr;
  }

  // ======================= escena viva (docs/escena-viva.md) =======================
  // La recta numérica del kit (nucleo/kit/piezas/recta.js) en los tipos que viven en una recta: acotada (los n
  // posibles), stock (múltiplos bajo una cota, la respuesta se arrastra) y trabajo (la línea del tiempo).
  // Los demás tipos son de divisibilidad y cifras: siguen con su solución de siempre, ya recortada.
  const ROT = {
    'exige-multiplo-de-ambos': 'múltiplo de ambos', 'exige-multiplo-del-producto': 'múltiplo del producto', 'solo-primera-venta': 'solo la 1.ª venta',
    'AR3-segunda-sobre-el-total': 'sobre el total', 'AR5-responde-lo-que-queda': 'lo que queda', 'cota-no-estricta': 'con el igual',
    'sin-divisibilidad': 'sin dividir', 'AR4-disminuye-en-como-queda-en': '«queda en»', 'sin-cambio-de-rendimiento': 'sin cambio',
    'AR8-tiempo-directo': 'tiempo × fracción', 'AR5-solo-lo-que-falta': 'solo lo que falta',
  };
  const nb = x => (typeof x === 'string' ? x.replace(/ %/g, ' %').replace(/S\/ /g, 'S/ ') : x);
  // Una cota que puede no ser exacta: entera si lo es; si no, truncada a 2 decimales con «…».
  const cota = x => (Math.abs(x - Math.round(x)) < 1e-9 ? F(Math.round(x)) : `${P.formatear(Math.floor(x * 100 + 1e-9) / 100, 2)}…`);
  function rango(vals) {
    const lo = Math.min(...vals), hi = Math.max(...vals);
    const paso = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500].find(p => (hi - lo) / p <= 10) || 1000;
    let min = Math.floor(lo / paso) * paso, max = Math.ceil(hi / paso) * paso;
    if (lo - min < paso / 2) min -= paso;
    if (max - hi < paso / 2) max += paso;
    if (lo >= 0 && min < 0) min = 0;
    return { min, max, paso };
  }
  const paso = (corte, texto, ecuacion, final) => ({ estado: final ? { corte, final: true } : { corte }, texto, ecuacion });
  // o: { variable, color, sufijo, elementos, pasos, alt, extra, arrastra, marcaFinal, filas }. Sin arrastre, marcaFinal
  // dibuja igual la respuesta con ✓ (cuando es un punto de la recta). Un error con id repetido no lleva fantasma.
  function escena(alternativas, respuesta, o) {
    const conMarca = o.arrastra || o.marcaFinal;
    const vals = [...(o.extra || []), ...(conMarca ? alternativas.map(a => a.valor) : [])].filter(Number.isFinite);
    const r = rango(vals);
    const datos = { min: r.min, max: r.max, paso: r.paso, variable: o.variable, color: o.color, sufijo: o.sufijo || '', decimales: 2,
      filas: o.filas || 2, elementos: o.elementos, marca: o.arrastra ? { min: r.min, max: r.max, inicio: r.min } : null,
      respuesta: conMarca ? respuesta.valor : null };
    const cuenta = {};
    for (const a of alternativas) if (a.error) cuenta[a.error.id] = (cuenta[a.error.id] || 0) + 1;
    const fantasmas = {};
    for (const a of alternativas) if (a.error) fantasmas[a.error.id] = conMarca && cuenta[a.error.id] === 1 ? { marca: a.valor, rotulo: ROT[a.error.id] || 'tu opción' } : {};
    const out = { escena: { pieza: 'recta', datos, alt: o.alt }, fantasmas,
      pasos: o.pasos.map(q => ({ ...q, texto: q.texto.map(nb), ecuacion: (q.ecuacion || []).map(nb) })) };
    if (o.arrastra) out.respuesta = { ...respuesta, tipo: 'arrastrar', control: 'marca', paso: 1, tolerancia: 0.5 };
    return out;
  }
  // Una lista larga partida en trozos de k (para que ningún paso pase de 14 palabras).
  const trozos = (lista, k) => { const out = []; for (let i = 0; i < lista.length; i += k) out.push(lista.slice(i, i + k)); return out; };

  // Cantidad de enteros de [lo; hi] múltiplos de m.
  const multiplos = (lo, hi, m) => Math.floor(hi / m) - Math.floor((lo - 1) / m);
  // Cantidad de enteros de [lo; hi] primos con todos los primos de ps (inclusión-exclusión).
  function coprimosIE(lo, hi, ps) {
    let total = 0; const partes = [];
    for (let mask = 1; mask < 1 << ps.length; mask++) {
      let prod = 1, bits = 0;
      ps.forEach((p, i) => { if (mask >> i & 1) { prod *= p; bits++; } });
      const c = multiplos(lo, hi, prod);
      total += bits % 2 ? c : -c; partes.push({ prod, c, signo: bits % 2 ? 1 : -1 });
    }
    return { quitar: total, partes };
  }

  // ---- acotada: n/(n + k) irreducibles entre dos cotas ----
  function acotada(rng, semilla) {
    const k = rng.elegir([6, 10, 12, 14, 15, 18, 20, 21, 24, 28, 30]);
    const COT = [[1, 4], [1, 3], [2, 5], [1, 2], [3, 5], [2, 3], [3, 4], [4, 5], [5, 6]];
    const i = rng.entero(0, COT.length - 2), j = rng.entero(i + 1, COT.length - 1);
    const [p1, q1] = COT[i], [p2, q2] = COT[j];
    const lo = Math.floor(p1 * k / (q1 - p1)) + 1, hi = Math.ceil(p2 * k / (q2 - p2)) - 1;
    const T = hi - lo + 1;
    if (T < 6 || T > 70) return null;
    const ps = primos(k);
    const { quitar, partes } = coprimosIE(lo, hi, ps);
    const C = T - quitar;
    if (C < 3) return null;
    const variables = { f: { nombre: `fracción n/(n + ${k})`, color: 'o' }, c1: { nombre: 'cota inferior', color: 'i' }, c2: { nombre: 'cota superior', color: 'h' }, x: { nombre: 'cantidad de fracciones', color: 'd' } };
    const forma = `n/(n + ${k})`;
    const enunciado = ['Se consideran las fracciones ', v('f', forma), ', con n entero positivo.'];
    const pregunta = ['¿Cuántas son irreducibles, mayores que ', v('c1', `${p1}/${q1}`), ' y menores que ', v('c2', `${p2}/${q2}`), '?'];
    let nr = lo; while (mcd(nr, k) === 1) nr++;
    const errores = [
      e('cuenta-reducibles', T, `Contaste los ${T} valores de n. Con n = ${nr}, ${nr}/${nr + k} se simplifica: solo van las irreducibles.`),
    ];
    for (const p of ps) {
      const cnt = T - multiplos(lo, hi, p);
      errores.push(e(`quita-solo-multiplos-de-${p}`, cnt, `Quitaste solo los múltiplos de ${p}. También se simplifica si n es múltiplo de ${ps.filter(x => x !== p).join(' o de ')}.`));
    }
    const sinIE = T - ps.reduce((s, p) => s + multiplos(lo, hi, p), 0);
    errores.push(e('sin-inclusion-exclusion', sinIE, `Los múltiplos de ${ps[0] * ps[1]} los quitaste dos veces: hay que devolverlos una vez.`));
    errores.push(e('cuenta-las-reducibles', T - C, `Esas son las que se simplifican. Se piden las otras: ${T} menos esas.`));
    const c1 = P.frac(p1 * k, q1 - p1), c2 = P.frac(p2 * k, q2 - p2);
    const ieTxt = partes.map((x, idx) => `${idx === 0 ? '' : x.signo > 0 ? ' + ' : ' − '}${x.c}`).join('') + (partes.length > 1 ? ` = ${quitar}` : '');
    const solucion = [
      [v('f', forma), ' > ', v('c1', `${p1}/${q1}`), ` ⇒ n > ${P.textoFraccion(c1)}: desde n = ${lo}.`],
      [v('f', forma), ' < ', v('c2', `${p2}/${q2}`), ` ⇒ n < ${P.textoFraccion(c2)}: hasta n = ${hi}.`],
      [`De ${lo} a ${hi} hay ${T} valores.`],
      [`MCD(n; n + ${k}) = MCD(n; ${k}), con ${k} = ${factorizar(k)}.`],
      [`Se quitan los múltiplos de ${ps.join(', ')}.`],
      [`Inclusión-exclusión: ${ieTxt}.`],
      ['Quedan ', `${T} − ${quitar} = `, v('x', `${C}`), ' fracciones.'],
    ];
    const viva = (alts, resp) => escena(alts, resp, {
      variable: 'n', color: null, extra: [c1.n / c1.d, c2.n / c2.d],
      alt: `Recta de n: n > ${P.textoFraccion(c1)} y n < ${P.textoFraccion(c2)}; los ${T} enteros de ${lo} a ${hi}`,
      elementos: [
        { tipo: 'intervalo', a: c1.n / c1.d, b: null, ca: false, color: 'i', rotulo: `n > ${P.textoFraccion(c1)}`, fila: 2, desde: 1 },
        { tipo: 'intervalo', a: null, b: c2.n / c2.d, cb: false, color: 'h', rotulo: `n < ${P.textoFraccion(c2)}`, fila: 1, desde: 2 },
        { tipo: 'enteros', a: lo, b: hi, color: 'o', rotulo: `${T} valores`, fila: 0, desde: 3 },
      ],
      pasos: [
        paso(1, [v('f', forma), ' > ', v('c1', `${p1}/${q1}`), ` desde n = ${lo}.`], [`n > ${P.textoFraccion(c1)}`]),
        paso(2, [v('f', forma), ' < ', v('c2', `${p2}/${q2}`), ` hasta n = ${hi}.`], [`n < ${P.textoFraccion(c2)}`]),
        paso(3, [`De ${lo} a ${hi} hay ${T} valores de n.`], [`${hi} − ${lo} + 1 = ${T}`]),
        paso(3, [`Se quitan los n que comparten factor con ${k} = ${factorizar(k)}.`], [`${T} − (${ieTxt}) → `, v('x', `${C}`)], true),
      ],
    });
    return cerrar(rng, semilla, { correcta: C, errores, texto: F, variables, enunciado, pregunta, solucion, viva,
      datos: { tipo: 'acotada', k, cotas: [[p1, q1], [p2, q2]] } });
  }

  // Ternas (d; p; q) con d·(p − q) = D y d·p·q = M; pesi = si se exige MCD(p; q) = 1.
  function ternas(D, M, pesi) {
    const out = [];
    for (let d = 1; d <= D; d++) {
      if (D % d || M % d) continue;
      const s = D / d, t = M / d, disc = s * s + 4 * t, r = Math.round(Math.sqrt(disc));
      if (r * r !== disc || (r - s) % 2) continue;
      const q = (r - s) / 2, p = q + s;
      if (q < 1) continue;
      if (pesi === (mcd(p, q) === 1)) out.push({ d, p, q });
    }
    return out;
  }

  // ---- pesi: diferencia y MCM ----
  function pesi(rng, semilla) {
    const d = rng.entero(2, 30), q = rng.entero(1, 6), p = rng.entero(q + 1, 9);
    if (mcd(p, q) !== 1) return null;
    const A = d * p, B = d * q;
    if (A > 600) return null;
    const D = A - B, M = d * p * q;
    if (ternas(D, M, true).length !== 1) return null;
    const variables = { D: { nombre: 'diferencia', color: 'o' }, M: { nombre: 'MCM', color: 'i' }, d: { nombre: 'MCD', color: 'h' }, S: { nombre: 'suma', color: 'd' } };
    const enunciado = ['Dos números enteros positivos se diferencian en ', v('D', `${D}`), ' y su mínimo común múltiplo es ', v('M', `${M}`), '.'];
    const pregunta = ['¿Cuánto ', v('S', 'suman'), ' los dos números?'];
    const errores = [
      e('cocientes-sin-el-mcd', p + q, `Sumaste los cocientes ${p} y ${q}. Falta multiplicar por el MCD, ${d}.`),
    ];
    for (const t of ternas(D, M, false)) if (t.d * (t.p + t.q) !== A && t.d * (t.p + t.q) !== B) errores.push(e('cocientes-no-pesi', t.d * (t.p + t.q), `Tomaste p = ${t.p} y q = ${t.q}, que no son PESI: así el MCM no es ${M}.`));
    const disc = D * D + 4 * M, r = Math.round(Math.sqrt(disc));
    if (r * r === disc && (r - D) % 2 === 0) errores.push(e('mcm-como-producto', 2 * ((r - D) / 2) + D, 'Tomaste el MCM como el producto de los números. Eso solo vale si son PESI.'));
    errores.push(e('responde-un-numero-mayor', A, `${A} es el mayor número. Se pide la suma: ${A} + ${B}.`));
    errores.push(e('responde-un-numero-menor', B, `${B} es el menor número. Se pide la suma: ${A} + ${B}.`));
    errores.push(e('suma-diferencia-y-mcm', D + M, 'Sumaste la diferencia y el MCM, que son datos. Los números son d·p y d·q.'));
    const solucion = [
      ['Números: d·p y d·q, con ', v('d', 'd'), ' el MCD y p, q PESI.'],
      [v('D', `d(p − q) = ${D}`), ' y ', v('M', `d·p·q = ${M}`), '.'],
      ['p − q y p·q son PESI: ', v('d', `d = MCD(${D}; ${M}) = ${d}`), '.'],
      [`p − q = ${p - q} y p·q = ${p * q}: p = ${p}, q = ${q}.`],
      [`Los números son ${A} y ${B}: `, v('S', `suma ${A + B}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: A + B, errores, texto: F, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'pesi', D, M } });
  }

  // Porcentajes con periódico: fracción del total (p/q) → texto del porcentaje y su generatriz.
  function porcentajeTxt(n, d) {
    const des = desarrollo(100 * n, d);
    return { texto: conPuntos(des) + ' %', des };
  }
  // «16,666… = 150/9; ÷ 100 → 1/6».
  function generatriz(n, d) {
    const { des } = porcentajeTxt(n, d);
    const todo = Number(`${des.ent}${des.ante}${des.per}`), sinPer = Number(`${des.ent}${des.ante}`);
    const den = Number('9'.repeat(des.per.length) + '0'.repeat(des.ante.length));
    return `${conPuntos(des)} = ${todo - sinPer}/${den}; ÷ 100 → ${fracTxt(n, d)}`;
  }
  const FR_PER = [[1, 3], [2, 3], [1, 6], [5, 6], [1, 9], [2, 9], [4, 9], [1, 12], [5, 12], [7, 12], [1, 11], [2, 11], [3, 11], [1, 15], [2, 15], [4, 15], [1, 18], [5, 18]];

  // ---- porcentaje: gastos sucesivos con porcentajes periódicos ----
  function porcentaje(rng, semilla) {
    const [n1, d1] = rng.elegir(FR_PER), [n2, d2] = rng.elegir(FR_PER);
    if (n1 * d2 === n2 * d1) return null;
    const t = rng.entero(1, 12), X = d1 * d2 * t;
    if (X < 120 || X > 3000) return null;
    const g1 = X * n1 / d1, resto = X - g1, g2 = resto * n2 / d2, R = resto - g2;
    if (!Number.isInteger(g1) || !Number.isInteger(g2)) return null;
    const p1 = porcentajeTxt(n1, d1).texto, p2 = porcentajeTxt(n2, d2).texto;
    const quien = rng.elegir([['Rosa', 'su gratificación'], ['Don Julio', 'lo que ganó'], ['Carmen', 'su sueldo'], ['Wilber', 'sus ahorros']]);
    const par = rng.elegir([['ropa', 'útiles'], ['el alquiler', 'el mercado'], ['un celular', 'pasajes'], ['la matrícula', 'regalos']]);
    const gastos = g1 >= g2 ? par : [par[1], par[0]];       // el rubro grande va con el gasto grande
    const variables = { g1: { nombre: 'primer porcentaje', color: 'o' }, g2: { nombre: 'segundo porcentaje', color: 'i' }, R: { nombre: 'lo que quedó', color: 'h' }, X: { nombre: 'dinero inicial', color: 'd' } };
    const enunciado = [`${quien[0]} gastó el `, v('g1', p1), ` de ${quien[1]} en ${gastos[0]} y luego el `, v('g2', p2), ` del resto en ${gastos[1]}. Le quedaron `, v('R', `S/ ${F(R)}`), '.'];
    const pregunta = ['¿Cuánto ', v('X', 'tenía al inicio'), '?'];
    const q1 = 1 - n1 / d1, q2 = 1 - n2 / d2;
    const f1 = fracTxt(n1, d1), f2 = fracTxt(n2, d2), k1 = fracTxt(d1 - n1, d1), k2 = fracTxt(d2 - n2, d2);
    const errores = [];
    if (n1 / d1 + n2 / d2 < 1) errores.push(e('AR3-segundo-sobre-el-total', R / (1 - n1 / d1 - n2 / d2), `Tomaste el ${p2} sobre todo el dinero. Es sobre lo que quedaba tras el primer gasto.`, 'parcial'));
    errores.push(e('AR3-revertir-sumando', R * (1 + n2 / d2) * (1 + n1 / d1), `Sumaste a lo que quedó el mismo porcentaje. Hay que dividir entre lo que queda: ${k2} y ${k1}.`, 'parcial'));
    errores.push(e('AR4-gasto-por-lo-que-queda', R / (n1 / d1 * n2 / d2), `Multiplicaste lo gastado (${f1} y ${f2}). Tras gastar ${f1} queda ${k1}.`, 'parcial'));
    errores.push(e('olvida-un-gasto', R / q1, 'Solo deshiciste el primer gasto. Lo que quedó es después de los dos.'));
    errores.push(e('generatriz-con-90', R / ((1 - n1 / d1 / 10) * q2), `Pusiste un 0 de más en la generatriz de ${p1}: es periódico puro, solo nueves.`));
    const kk = fracTxt((d1 - n1) * (d2 - n2), d1 * d2);
    const solucion = [
      ['Generatriz: ', v('g1', p1), ` → ${generatriz(n1, d1).split(' = ')[1]}.`],
      ['Generatriz: ', v('g2', p2), ` → ${generatriz(n2, d2).split(' = ')[1]}.`],
      [`Queda ${k1} y luego ${k2} de eso: ${kk} del inicio.`],
      [v('X', 'X'), ` = ${F(R)} ÷ ${kk} = `, v('X', `S/ ${F(X)}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: X, errores: errores.filter(x => Number.isInteger(Math.round(x.valor * 1e6) / 1e6)), texto: x => `S/ ${F(x)}`, unidad: 'S/', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'porcentaje', f1: [n1, d1], f2: [n2, d2], p1, p2, R } });
  }

  // ---- stock: ventas sucesivas del resto con cotas ----
  const FR_STOCK = [[1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 6], [5, 6], [2, 7], [3, 7], [1, 8], [3, 8], [5, 8], [2, 9], [4, 9]];
  function stock(rng, semilla) {
    const [a1, b1] = rng.elegir(FR_STOCK), [a2, b2] = rng.elegir(FR_STOCK);
    const m = b1 * b2 / mcd(b1 - a1, b2);
    const fn = (b1 - a1) * (b2 - a2), fd = b1 * b2; // queda N·fn/fd
    const C = rng.entero(4, 30) * 5;
    const topeC = Math.floor((C * fd - 1) / fn);     // N·fn < C·fd
    const Nstar0 = Math.floor(topeC / m) * m;
    if (Nstar0 < 2 * m || Nstar0 > 900) return null;
    const H = Math.ceil((Nstar0 + rng.entero(1, 3) * m + rng.entero(0, m - 1)) / 10) * 10;
    const L = Math.max(10, Math.floor((Nstar0 - rng.entero(2, 5) * m - rng.entero(0, m - 1)) / 10) * 10);
    // El mayor N de [L; H] múltiplo de paso con N·num < cota (estricto o no).
    const mayor = (paso, num, den, cotaC, estricto) => { for (let N = Math.floor(H / paso) * paso; N >= L; N -= paso) { const ok = estricto ? N * num < cotaC * den : N * num <= cotaC * den; if (ok) return N; } return NaN; };
    const N = mayor(m, fn, fd, C, true);
    if (N !== Nstar0) return null;
    const R = N * fn / fd;
    const prod = rng.elegir([['botellas de gaseosa', 'botellas'], ['panes', 'panes'], ['cuadernos', 'cuadernos'], ['polos', 'polos'], ['sacos de papa', 'sacos']]);
    const variables = { f1: { nombre: 'primera fracción vendida', color: 'o' }, f2: { nombre: 'segunda fracción vendida', color: 'i' }, C: { nombre: 'cota de lo que queda', color: 'h' }, N: { nombre: 'stock inicial', color: 'd' } };
    const enunciado = [`Un comerciante tenía entre ${L} y ${H} ${prod[0]}. Vendió `, v('f1', `${a1}/${b1}`), ' del total y luego ', v('f2', `${a2}/${b2}`), ' del resto. Le quedaron menos de ', v('C', `${C}`), ` ${prod[1]}.`];
    const pregunta = ['¿Cuántos ', v('N', `${prod[1]} tenía como máximo`), '?'];
    const errores = [];
    const l12 = mcm(b1, b2);
    if (l12 !== m) errores.push(e('exige-multiplo-de-ambos', mayor(l12, fn, fd, C, true), m > l12
      ? `No basta múltiplo de ${b1} y de ${b2}: lo que queda también se reparte. Debe ser múltiplo de ${m}.`
      : `Basta múltiplo de ${m}: ${a2}/${b2} se toma de lo que queda, no del total.`));
    if (b1 * b2 !== m && b1 * b2 !== l12) errores.push(e('exige-multiplo-del-producto', mayor(b1 * b2, fn, fd, C, true), `No hace falta múltiplo de ${b1 * b2}: basta que las dos ventas den enteros, múltiplo de ${m}.`));
    if (b1 !== m) errores.push(e('solo-primera-venta', mayor(b1, fn, fd, C, true), 'Solo cuidaste la primera venta. La segunda también debe dar un número entero.'));
    if (a1 * b2 + a2 * b1 < b1 * b2) errores.push(e('AR3-segunda-sobre-el-total', mayor(l12, b1 * b2 - a1 * b2 - a2 * b1, b1 * b2, C, true), `Tomaste ${a2}/${b2} del total. La segunda venta es de lo que quedaba.`, 'parcial'));
    errores.push(e('AR5-responde-lo-que-queda', R, `${F(R)} es lo que le quedó. Se pide cuántos tenía al inicio.`));
    errores.push(e('cota-no-estricta', mayor(m, fn, fd, C, false), `Aceptaste que le queden ${C}. Dice menos de ${C}.`));
    errores.push(e('sin-divisibilidad', Math.min(H, topeC), 'Tomaste el mayor que cumple la cota sin revisar que las ventas den enteros.'));
    const tope = C * fd / fn;
    const solucion = [
      ['Las dos ventas deben dar enteros: ', v('N', 'N'), ` es múltiplo de ${m}.`],
      [`Le queda ${fracTxt(fn, fd)} del total, menos de `, v('C', `${C}`), ` ⇒ N < ${cota(tope)}.`],
      [`El mayor múltiplo de ${m} que cumple es `, v('N', `${N}`), '.'],
    ];
    const viva = (alts, resp) => escena(alts, resp, {
      variable: 'N', color: 'd', arrastra: true, extra: [L, H, tope],
      alt: `Recta de N: entre ${L} y ${H}; los múltiplos de ${m}; N < ${cota(tope)}; el mayor que cumple es ${N}`,
      elementos: [
        { tipo: 'intervalo', a: L, b: H, ca: true, cb: true, color: null, rotulo: `entre ${L} y ${H}`, fila: 2, desde: 0 },
        { tipo: 'enteros', a: L, b: H, cada: m, color: 'o', fila: 0, desde: 1 },
        { tipo: 'intervalo', a: null, b: tope, cb: false, color: 'h', rotulo: `N < ${cota(tope)}`, fila: 1, desde: 2 },
        { tipo: 'punto', x: N, color: 'd', rotulo: `N = ${N}`, fila: 0, desde: 3 },
      ],
      pasos: [
        paso(1, ['Las dos ventas deben dar enteros: ', v('N', 'N'), ` múltiplo de ${m}.`], [`N = ${m}·t`]),
        paso(2, [`Le queda ${fracTxt(fn, fd)} del total, menos de `, v('C', `${C}`), '.'], [`N·${fracTxt(fn, fd)} < ${C} → N < ${cota(tope)}`]),
        paso(3, [`El mayor múltiplo de ${m} que cumple es `, v('N', `${N}`), '.'], [`Vende ${N * a1 / b1} y ${N * (b1 - a1) / b1 * a2 / b2}; quedan ${F(R)} < ${C}`], true),
      ],
    });
    return cerrar(rng, semilla, { correcta: N, errores, texto: F, variables, enunciado, pregunta, solucion, viva,
      datos: { tipo: 'stock', f1: [a1, b1], f2: [a2, b2], L, H, C } });
  }

  // ---- equivalentes: contar fracciones equivalentes con condiciones ----
  function equivalentes(rng, semilla, sub) {
    const b = rng.entero(6, 45), a = rng.entero(1, b - 1);
    if (mcd(a, b) !== 1) return null;
    const q = rng.elegir([2, 3, 5, 7, 11]);
    const base = sub === 'den' ? b : a + b, cond = sub === 'den' ? b : a;
    if (mcd(cond, q) !== 1 || base > 160) return null;
    const kmin = Math.ceil(100 / base), kmax = Math.floor(999 / base);
    const T = kmax - kmin + 1, E = multiplos(kmin, kmax, q), C = T - E;
    if (C < 4) return null;
    const variables = { fr: { nombre: 'fracción dada', color: 'o' }, q: { nombre: 'número que no debe dividir', color: 'i' }, k: { nombre: 'factor de amplificación', color: 'h' }, x: { nombre: 'cantidad de fracciones', color: 'd' } };
    const quien = sub === 'den' ? 'denominador' : 'numerador';
    const enunciado = sub === 'den'
      ? ['Se buscan fracciones equivalentes a ', v('fr', `${a}/${b}`), ' con denominador de tres cifras que no sea múltiplo de ', v('q', `${q}`), '.']
      : ['Se buscan fracciones equivalentes a ', v('fr', `${a}/${b}`), ' cuya suma de términos tenga tres cifras y cuyo numerador no sea múltiplo de ', v('q', `${q}`), '.'];
    const pregunta = ['¿Cuántas ', v('x', 'fracciones'), ' cumplen?'];
    const errores = [
      e('olvida-la-condicion', T, `Contaste todas: faltó quitar las de ${quien} múltiplo de ${q}.`),
      e('cuenta-las-excluidas', E, `Esas son las que se quitan: las de ${quien} múltiplo de ${q}.`),
      e('poste-sin-sumar-uno', T - 1 - E, `De ${kmin} a ${kmax} hay ${T} valores: se cuentan los dos extremos.`),
    ];
    if (100 % base) { const k0 = Math.floor(100 / base); errores.push(e('incluye-dos-cifras', kmax - k0 + 1 - multiplos(k0, kmax, q), `Con k = ${k0}, ${base}·${k0} = ${base * k0} tiene dos cifras. Se empieza en k = ${kmin}.`)); }
    errores.push(e('resta-entre-q', T - Math.floor(T / q), `Quitaste ${T}/${q} redondeado. Hay que contar los múltiplos de ${q} entre ${kmin} y ${kmax}.`));
    const solucion = [
      ['Equivalentes a ', v('fr', `${a}/${b}`), `: ${a}k/${b}k, con `, v('k', 'k'), ' entero positivo.'],
      [`100 ≤ ${base}k ≤ 999 ⇒ k de ${kmin} a ${kmax}: ${T} valores.`],
      [`El ${quien} ${cond}k es múltiplo de `, v('q', `${q}`), ` solo si k lo es: ${E} casos.`],
      ['Cumplen ', `${T} − ${E} = `, v('x', `${C}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: C, errores, texto: F, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'equivalentes', sub, a, b, q } });
  }

  // ---- trabajo: rendimiento que disminuye ----
  function trabajo(rng, semilla) {
    const [p, q] = rng.elegir([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [1, 5]]);
    const t1 = rng.entero(1, 8);
    const [a, b] = rng.elegir([[1, 3], [2, 3], [1, 4], [1, 2], [3, 4], [1, 5], [2, 5]]);
    // t2 = t1·(1 − p/q)/(p/q) · b/(b − a)
    const t2 = P.frac(t1 * (q - p) * b, p * (b - a));
    const total = t1 + t2.n / t2.d;
    if (!corto(total) || Math.abs(total * 4 - Math.round(total * 4)) > 1e-9 || total > 40) return null;
    const variables = { f: { nombre: 'fracción llenada', color: 'o' }, t1: { nombre: 'tiempo de la primera parte', color: 'i' }, r: { nombre: 'disminución del rendimiento', color: 'h' }, T: { nombre: 'tiempo total', color: 'd' } };
    const [obj, el, del] = rng.elegir([['un tanque', 'el tanque', 'del tanque'], ['un reservorio', 'el reservorio', 'del reservorio'], ['una cisterna', 'la cisterna', 'de la cisterna'], ['un tanque elevado', 'el tanque', 'del tanque']]);
    const enunciado = ['Una bomba llena ', v('f', `${p}/${q}`), ` de ${obj} en `, v('t1', `${t1} ${t1 === 1 ? 'hora' : 'horas'}`), '. Luego su rendimiento disminuye en ', v('r', `${a}/${b}`), ' y sigue así hasta terminar.'];
    const pregunta = ['¿En cuántas horas se llena, ', v('T', 'en total'), `, ${el}?`];
    const base = t1 * (q - p) / p; // horas que faltarían con el rendimiento de antes
    const errores = [
      e('AR4-disminuye-en-como-queda-en', t1 + base * b / a, `Tomaste «disminuye en ${a}/${b}» como «queda en ${a}/${b}». Trabaja con ${b - a}/${b} de su rendimiento.`, 'parcial'),
      e('sin-cambio-de-rendimiento', t1 + base, 'Seguiste con el rendimiento de antes. Después llena menos por hora: tarda más.'),
      e('AR8-tiempo-directo', t1 + base * (b - a) / b, `Multiplicaste el tiempo por ${b - a}/${b}. Con menos rendimiento se tarda más: se divide.`),
      e('AR5-solo-lo-que-falta', t2.n / t2.d, `Esas son solo las horas de la segunda parte. Falta sumar las ${t1} primeras.`),
    ];
    const r1 = P.frac(p, q * t1), r2 = P.frac(p * (b - a), q * t1 * b);
    const T2 = F(t2.n / t2.d), falta = fracTxt(q - p, q);
    const solucion = [
      ['Al inicio: ', v('f', `${p}/${q}`), ' en ', v('t1', `${t1} h`), ` ⇒ ${P.textoFraccion(r1)} ${del} por hora.`],
      ['Disminuye en ', v('r', `${a}/${b}`), `: ${P.textoFraccion(r1)} · ${b - a}/${b} = ${P.textoFraccion(r2)} por hora.`],
      [`Falta ${falta}: ${falta} ÷ ${P.textoFraccion(r2)} = ${T2} h.`],
      [v('T', 'Total'), ` = ${t1} + ${T2} = `, v('T', `${F(total)} h`), '.'],
    ];
    const viva = (alts, resp) => escena(alts, resp, {
      variable: 't (h)', color: null, sufijo: ' h', marcaFinal: true, extra: [0, total],
      alt: `Línea del tiempo: ${p}/${q} en ${t1} h; lo que falta, ${falta}, en ${T2} h; total ${F(total)} h`,
      elementos: [
        { tipo: 'salto', a: 0, b: t1, color: 'i', rotulo: `${p}/${q} en ${t1} h`, fila: 1, desde: 1 },
        { tipo: 'salto', a: t1, b: total, color: 'h', rotulo: `${falta} en ${T2} h`, fila: 1, desde: 2 },
        { tipo: 'distancia', a: 0, b: total, color: 'd', rotulo: `${F(total)} h`, fila: 2, desde: 3 },
      ],
      pasos: [
        paso(1, ['Al inicio llena ', v('f', `${p}/${q}`), ' en ', v('t1', `${t1} h`), '.'], [`${P.textoFraccion(r1)} ${del} por hora`]),
        paso(2, ['Con ', v('r', `${a}/${b}`), ` menos de rendimiento, falta ${falta}.`], [`${P.textoFraccion(r1)} · ${b - a}/${b} = ${P.textoFraccion(r2)} por hora → ${T2} h`]),
        paso(3, ['Tiempo total: ', v('T', `${F(total)} h`), '.'], [`${t1} + ${T2} = ${F(total)}`], true),
      ],
    });
    return cerrar(rng, semilla, { correcta: total, errores, texto: x => `${F(x)} h`, unidad: 'h', variables, enunciado, pregunta, solucion, viva,
      datos: { tipo: 'trabajo', f: [p, q], t1, baja: [a, b] } });
  }

  // ---- diferencia: la fracción propia irreducible con la menor diferencia de términos ----
  function diferencia(rng, semilla, sub) {
    let pares;
    if (sub === 'suma') {
      const S = rng.elegir([18, 22, 26, 30, 34, 38, 42, 46, 50, 54, 58, 62, 66, 70]);
      pares = { S, lista: [] };
      for (let a = Math.floor((S - 1) / 2); a >= 1; a--) pares.lista.push([a, S - a]);
    } else {
      const Pp = rng.elegir([72, 120, 144, 180, 240, 300, 360, 420, 480, 540, 600, 720, 840, 900]);
      pares = { S: Pp, lista: [] };
      for (let a = Math.floor(Math.sqrt(Pp)); a >= 1; a--) if (Pp % a === 0 && a < Pp / a) pares.lista.push([a, Pp / a]);
    }
    const S = pares.S;
    const buena = pares.lista.find(([a, b]) => mcd(a, b) === 1);
    const malas = pares.lista.slice(0, pares.lista.indexOf(buena));
    if (!malas.length) return null;
    const [a, b] = buena, [ra, rb] = malas[0];
    const g = mcd(ra, rb);
    const variables = { S: { nombre: sub === 'suma' ? 'suma de los términos' : 'producto de los términos', color: 'o' }, x: { nombre: 'fracción buscada', color: 'd' } };
    const enunciado = ['En una fracción propia e irreducible, ', v('S', `${sub === 'suma' ? 'la suma' : 'el producto'} de sus términos es ${S}`), '.'];
    const pregunta = ['De todas las que cumplen, ¿cuál es ', v('x', 'la de menor diferencia entre sus términos'), '?'];
    const correcta = terminos(a, b);
    const errores = [
      et('reducible-aceptada', terminos(ra, rb), `${ra}/${rb} tiene la menor diferencia, pero ${ra} y ${rb} se dividen entre ${g}.`),
      et('simplifica-y-cambia-el-dato', terminos(ra / g, rb / g), `Al simplificar a ${ra / g}/${rb / g}, sus términos ya no ${sub === 'suma' ? 'suman' : 'multiplican'} ${S}.`),
      et('impropia', terminos(b, a), `${b}/${a} es impropia: el numerador es mayor. Se pide una propia.`),
      malas[1] ? et('reducible-aceptada', terminos(malas[1][0], malas[1][1]), `${malas[1][0]}/${malas[1][1]} no es irreducible: se dividen entre ${mcd(malas[1][0], malas[1][1])}.`) : null,
      sub === 'suma' && S % 2 === 0 ? et('terminos-iguales', terminos(S / 2, S / 2), `${S / 2}/${S / 2} vale 1: no es propia ni irreducible.`) : null,
      sub === 'producto' && Number.isInteger(Math.sqrt(S)) ? et('terminos-iguales', terminos(Math.sqrt(S), Math.sqrt(S)), `${Math.sqrt(S)}/${Math.sqrt(S)} vale 1: no es propia ni irreducible.`) : null,
      et('mayor-diferencia', terminos(pares.lista[pares.lista.length - 1][0], pares.lista[pares.lista.length - 1][1]), 'Esa es la de mayor diferencia. Se pide la de menor diferencia.'),
    ];
    const prueba = trozos(pares.lista.slice(0, pares.lista.indexOf(buena) + 1).map(([x, y]) => `${x}/${y} ${mcd(x, y) === 1 ? '(irreducible)' : `(MCD ${mcd(x, y)})`}`), 3)
      .map(t => [`Se prueba: ${t.join('; ')}.`]);
    const solucion = [
      sub === 'suma' ? ['Si a + b = ', v('S', `${S}`), ', b − a baja cuando a se acerca a la mitad.']
        : ['Si a·b = ', v('S', `${S}`), `, conviene a y b cerca de √${S} ≈ ${F(Math.sqrt(S))}.`],
      ...prueba,
      ['La primera irreducible es ', v('x', `${a}/${b}`), `, con diferencia ${b - a}.`],
    ];
    return cerrar(rng, semilla, { textual: true, correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'diferencia', sub, S } });
  }

  // ---- formar: fracciones propias irreducibles con cuatro números ----
  function formar(rng, semilla) {
    const set = new Set(); while (set.size < 4) set.add(rng.entero(2, 24));
    const ns = [...set].sort((x, y) => x - y);
    const prop = []; for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) prop.push([ns[i], ns[j]]);
    const irr = prop.filter(([x, y]) => mcd(x, y) === 1), red = prop.filter(([x, y]) => mcd(x, y) > 1);
    if (irr.length < 2 || irr.length > 4 || red.length < 1) return null;
    const prod = l => l.reduce((acc, [x, y]) => [acc[0] * x, acc[1] * y], [1, 1]);
    const [pn, pd] = prod(irr), [tn, td] = prod(prop);
    if (P.frac(pn, pd).d > 2000) return null;
    const variables = { n: { nombre: 'números dados', color: 'o' }, x: { nombre: 'producto de las fracciones', color: 'd' } };
    const lista = l => l.map(([x, y]) => `${x}/${y}`).join(', ');
    const enunciado = ['Con ', v('n', ns.join(', ').replace(/, (\d+)$/, ' y $1')), ' se forman fracciones de dos números distintos. Se toman todas las propias e irreducibles.'];
    const pregunta = ['¿Cuál es su ', v('x', 'producto'), '?'];
    const correcta = numero(pn, pd);
    const errores = [
      et('reducibles-incluidas', numero(tn, td), `Multiplicaste también ${lista(red)}, que no ${red.length === 1 ? 'es irreducible' : 'son irreducibles'}.`),
      et('impropias-incluidas', numero(1), 'Incluiste las impropias: cada una es inversa de una propia y todo se cancela.'),
      et('impropias-en-vez-de-propias', numero(pd, pn), 'Pusiste el mayor arriba: esas son impropias.'),
    ];
    const solucion = [
      ['Propias, con el menor arriba:'],
      ...trozos(prop, 3).map(t => [`${lista(t)}.`]),
      [`Irreducibles: ${lista(irr)}.`],
      [`Se descartan ${lista(red)}.`],
      [v('x', 'Producto'), ` = ${pn}/${pd}${correcta.texto === `${pn}/${pd}` ? '' : ` = ${correcta.texto}`}.`],
    ];
    return cerrar(rng, semilla, { textual: true, correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'formar', numeros: ns } });
  }

  // Inverso de x módulo 100 (x primo con 10).
  const inv100 = x => { for (let y = 1; y < 100; y++) if (x * y % 100 === 1) return y; return NaN; };
  const dos = x => ({ clave: `cc:${String(x).padStart(2, '0')}`, texto: String(x).padStart(2, '0') });

  // ---- periodo: cifras del periodo sin dividir todo ----
  function periodo(rng, semilla, sub) {
    if (sub === 'ultimas') {
      const p = rng.elegir([17, 19, 23, 29, 31, 43, 47, 53, 59, 61, 67, 71, 79, 83, 89, 97]);
      const a = rng.entero(1, Math.min(p - 1, 40));
      const L = orden10(p);
      const T = (100 - a % 100) % 100;                       // a·(10^L − 1) termina en −a (mod 100)
      const x = T * inv100(p) % 100;
      const des = desarrollo(a, p);
      const TT = String(T).padStart(2, '0'), xx = String(x).padStart(2, '0');
      const variables = { fr: { nombre: 'fracción dada', color: 'o' }, L: { nombre: 'cifras del periodo', color: 'i' }, x: { nombre: 'últimas dos cifras del periodo', color: 'd' } };
      const enunciado = ['La fracción ', v('fr', `${a}/${p}`), ' es periódica pura, con ', v('L', `${L} cifras`), ' de periodo.'];
      const pregunta = ['Sin dividir, ¿en qué ', v('x', 'dos cifras termina el periodo'), '?'];
      const u = p % 10, Tu = T % 10, uu = x % 10;
      const errores = [
        et('sin-el-signo', dos(a * inv100(p) % 100), `Buscaste que por ${p} termine en ${String(a).padStart(2, '0')}. Pero ${a}·10${sup(L)} − ${a} termina en ${TT}.`),
        et('primeras-cifras', dos(Number(des.per.slice(0, 2))), 'Esas son las dos primeras cifras del periodo. Se piden las dos últimas.'),
        et('cifras-al-reves', dos(Number(xx.split('').reverse().join(''))), 'Son las cifras correctas, pero al revés.'),
        a !== 1 ? et('periodo-de-uno-entre-p', dos(99 * inv100(p) % 100), `Esas son las del periodo de 1/${p}. Para ${a}/${p}, periodo·${p} termina en ${TT}.`) : null,
      ];
      const solucion = [
        ['Periodo · ', v('fr', `${p}`), ` = ${a}·(10${sup(L)} − 1).`],
        [`${a}·10${sup(L)} − ${a} termina en ${TT}.`],
        [`Unidades: u·${u} termina en ${Tu} ⇒ u = ${uu}.`],
        [`Probando: ${xx}·${p} = ${x * p}, que termina en ${TT}.`],
        ['El periodo termina en ', v('x', xx), '.'],
      ];
      return cerrar(rng, semilla, { textual: true, correcta: dos(x), errores, variables, enunciado, pregunta, solucion,
        datos: { tipo: 'periodo', sub, a, p } });
    }
    const q = rng.elegir([7, 13, 21, 27, 37, 39, 41, 11, 33]);
    const a = rng.entero(1, q - 1);
    if (mcd(a, q) !== 1) return null;
    const des = desarrollo(a, q), per = des.per, L = per.length;
    if (des.ante || L < 2) return null;
    const k = rng.entero(25, 250);
    const r = k % L, pos = r === 0 ? L : r;
    const cif = i => Number(per[((i - 1) % L + L) % L]);
    const c = d => ({ clave: `cifra:${d}`, texto: String(d) });
    const variables = { fr: { nombre: 'fracción dada', color: 'o' }, k: { nombre: 'lugar pedido', color: 'i' }, L: { nombre: 'cifras del periodo', color: 'h' }, x: { nombre: 'cifra pedida', color: 'd' } };
    const enunciado = ['La fracción ', v('fr', `${a}/${q}`), ' es igual a ', `${conPuntos(des)}`];
    const pregunta = ['¿Qué ', v('x', 'cifra'), ' ocupa el lugar ', v('k', `${k}`), ' después de la coma?'];
    const cocPos = (Math.floor(k / L) - 1) % L + 1;
    const errores = [
      r === 0 ? et('resto-cero-primera', c(cif(1)), `Resto 0 quiere decir que el lugar ${k} cierra un periodo: va la última cifra.`) : null,
      et('corrido-uno', c(cif(pos + 1)), `Te corriste un lugar: con resto ${r}, va la cifra ${pos}.ª del periodo.`),
      et('corrido-menos-uno', c(cif(pos - 1)), `Te corriste un lugar hacia atrás: con resto ${r}, va la ${pos}.ª.`),
      et('usa-el-cociente', c(cif(cocPos)), `Usaste el cociente, ${Math.floor(k / L)}. Cuenta periodos completos; la posición la da el resto.`),
      et('cifra-de-la-fraccion', c(Number(String(a)[String(a).length - 1])), `Esa es una cifra de la fracción. El decimal repite el bloque ${per}.`),
    ];
    const solucion = [
      ['El periodo es ', v('L', per), `: ${L} cifras.`],
      [v('k', `${k}`), ` = ${L}·${Math.floor(k / L)} + ${r}.`],
      [r === 0 ? `Resto 0: el lugar ${k} es la última cifra del periodo.` : `Resto ${r}: es la cifra ${pos}.ª del periodo.`],
      [`La ${pos}.ª cifra de ${per} es `, v('x', `${cif(pos)}`), '.'],
    ];
    return cerrar(rng, semilla, { textual: true, correcta: c(cif(pos)), errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'periodo', sub, a, q, k } });
  }

  // ---- suma-entera: a/d + b/d entero, impropias irreducibles ----
  function sumaEntera(rng, semilla) {
    const d = rng.elegir([6, 8, 9, 10, 12, 14, 15, 16, 18, 20]), m = rng.entero(3, 8), S = d * m;
    const as = []; for (let a = d + 1; 2 * a < S; a++) if (mcd(a, d) === 1) as.push(a);
    const C = as.length;
    if (C < 3 || C > 20) return null;
    const todos = Math.ceil(S / 2) - 1 - d;
    const variables = { d: { nombre: 'denominador común', color: 'o' }, m: { nombre: 'suma de las fracciones', color: 'i' }, x: { nombre: 'cantidad de pares', color: 'd' } };
    const enunciado = ['Las fracciones a/', v('d', `${d}`), ' y b/', v('d', `${d}`), ' son impropias e irreducibles, con a < b, y su suma es ', v('m', `${m}`), '.'];
    const pregunta = ['¿Cuántos ', v('x', 'pares (a; b)'), ' son posibles?'];
    let propias = 0; for (let a = 1; 2 * a < S; a++) if (mcd(a, d) === 1) propias++;
    const errores = [
      e('acepta-reducibles', todos, `Contaste todos los a de ${d + 1} a ${Math.ceil(S / 2) - 1}, también los que se simplifican con ${d}.`),
      e('pares-ordenados', 2 * C, 'Contaste cada par dos veces. Se pide a < b.'),
      e('incluye-propias', propias, `Contaste a menores que ${d}: con ellos a/${d} es propia.`),
      S % 2 === 0 && mcd(S / 2, d) === 1 && S / 2 > d ? e('incluye-a-igual-b', C + 1, `Contaste a = b = ${S / 2}, pero se pide a < b.`) : null,
    ];
    const solucion = [
      [`(a + b)/${d} = `, v('m', `${m}`), ` ⇒ a + b = ${S}.`],
      ['Impropias y a < b: a va de ', v('d', `${d + 1}`), ` a ${Math.ceil(S / 2) - 1}.`],
      [`Irreducibles: MCD(a; ${d}) = 1; b = ${S} − a cumple lo mismo.`],
      ...trozos(as, 10).map((t, i) => [`${i === 0 ? 'Valores de a' : 'Y'}: ${t.join(', ')}.`]),
      ['Son ', v('x', `${C}`), ' pares.'],
    ];
    return cerrar(rng, semilla, { correcta: C, errores, texto: F, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'suma-entera', d, m } });
  }

  // ---- tipo-decimal: cifras no periódicas y periódicas desde los factores del denominador ----
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
  const cuenta = (ante, per) => ({ clave: `np:${ante},p:${per}`, texto: `${plural(ante, 'no periódica')} y ${plural(per, 'periódica')}` });
  function partes(D) {
    const x = val(D, 2), y = val(D, 5); const m = D / 2 ** x / 5 ** y;
    const comps = primos(m).map(p => p ** val(m, p));
    return { x, y, m, ante: Math.max(x, y), per: m === 1 ? 0 : orden10(m), comps };
  }
  function tipoDecimal(rng, semilla, sub) {
    let N, D, presentacion;
    if (sub === 'factorial') {
      const k = rng.entero(5, 8), fact = [1, 1, 2, 6, 24, 120, 720, 5040, 40320][k];
      N = rng.elegir([1, 7, 9, 11, 13, 21, 27, 49, 63, 77]);
      if (N >= fact) return null;
      D = fact; presentacion = `${k}!`;
    } else {
      const x = rng.entero(0, 4), y = rng.entero(0, 3), m = rng.elegir([3, 7, 9, 11, 13, 21, 27, 33, 37, 41, 63, 77, 99]);
      if (x + y === 0) return null;
      const g = rng.elegir([1, 3, 7, 11]);
      const D0 = 2 ** x * 5 ** y * m;
      let c = rng.entero(1, 40);
      if (mcd(c, D0) !== 1) return null;
      N = c * g; D = D0 * g;
      if (D > 99999) return null;
      presentacion = String(D);
    }
    const g = mcd(N, D), Dr = D / g;
    const real = partes(Dr), bruto = partes(D);
    if (real.m === 1 || real.ante === 0) return null;
    const variables = { fr: { nombre: 'fracción dada', color: 'o' }, a: { nombre: 'cifras no periódicas', color: 'i' }, p: { nombre: 'cifras periódicas', color: 'h' } };
    const fracDada = sub === 'factorial' ? `${N}/(${presentacion})` : `${N}/${presentacion}`;
    const enunciado = ['Se escribe como decimal la fracción ', v('fr', fracDada), '.'];
    const pregunta = ['¿Cuántas ', v('a', 'cifras no periódicas'), ' (después de la coma) y cuántas ', v('p', 'cifras periódicas'), ' tiene?'];
    const correcta = cuenta(real.ante, real.per);
    const sumaOrd = real.comps.reduce((s, c) => s + orden10(c), 0);
    const errores = [
      g > 1 ? et('sin-simplificar', cuenta(bruto.ante, bruto.per), `Miraste el denominador sin simplificar: ${N} y ${D} tienen factor común ${g}.`) : null,
      real.x > 0 && real.y > 0 ? et('suma-exponentes', cuenta(real.x + real.y, real.per), 'Sumaste los exponentes del 2 y del 5. Las no periódicas son el mayor de los dos.') : null,
      real.x > 0 && real.y > 0 && Math.min(real.x, real.y) > 0 && real.x !== real.y ? et('ante-menor-exponente', cuenta(Math.min(real.x, real.y), real.per), 'Tomaste el menor exponente. Las no periódicas son el mayor exponente del 2 y del 5.') : null,
      et('puro-por-mixto', cuenta(0, real.per), `Lo tomaste como periódico puro. El denominador tiene factor ${real.x ? 2 : 5}: es mixto.`),
      real.comps.length > 1 ? et('periodo-suma', cuenta(real.ante, sumaOrd), 'Sumaste los periodos de cada factor. El periodo total es su MCM.') : null,
      real.comps.length === 1 && primos(real.m).length === 1 && real.m === primos(real.m)[0] && real.m - 1 !== real.per ? et('periodo-p-menos-1', cuenta(real.ante, real.m - 1), `${real.m - 1} es el máximo posible. El periodo de 1/${real.m} tiene ${real.per} cifras.`) : null,
      et('cambia-los-papeles', cuenta(real.per, real.ante), 'Cambiaste los papeles: las no periódicas salen del 2 y del 5.'),
    ];
    const ords = real.comps.map(c => `${c} → ${orden10(c)}`).join('; ');
    const solucion = [
      g > 1 ? ['Se simplifica: ', v('fr', fracDada), ` = ${N / g}/${Dr}.`] : [v('fr', fracDada), ' ya es irreducible.'],
      [`${Dr} = ${factorizar(Dr)}.`],
      ['Mayor exponente del 2 y del 5: ', v('a', `${real.ante}`), ' cifras no periódicas.'],
      [`Periodo de cada factor: ${ords}.${real.comps.length > 1 ? ` MCM: ${real.per}.` : ''}`],
      ['Cifras periódicas: ', v('p', `${real.per}`), `. ${N / g}/${Dr} = ${conPuntos(desarrollo(N / g, Dr))}`],
    ];
    return cerrar(rng, semilla, { textual: true, correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'tipo-decimal', sub, N, D, presentacion } });
  }

  // ---- pg-mcd: tres edades en progresión geométrica ----
  function pgMcd(rng, semilla) {
    const [p, q] = rng.elegir([[3, 2], [5, 2], [4, 3], [5, 3], [5, 4], [7, 4], [7, 5]]);
    const k = rng.entero(1, 10);
    const a = k * q * q, m = k * p * q, c = k * p * p;
    if (c > 90 || a < 3) return null;
    const Pr = a * m * c, S = a + m + c;
    const variables = { P: { nombre: 'producto de las edades', color: 'o' }, S: { nombre: 'suma de las edades', color: 'i' }, m: { nombre: 'edad del medio', color: 'h' }, x: { nombre: 'MCD pedido', color: 'd' } };
    const quien = rng.elegir(['tres hermanos', 'tres primas', 'tres amigos de un club', 'tres integrantes de una familia']);
    const enunciado = [`Las edades de ${quien} están en progresión geométrica. Su producto es `, v('P', P.formatear(Pr)), ' y su suma, ', v('S', `${S}`), '.'];
    const pregunta = ['¿Cuál es el ', v('x', 'MCD de la menor y la mayor edad'), '?'];
    const errores = [
      e('mcd-con-la-central', mcd(a, m), `Ese es el MCD de ${a} y ${m}, con la del medio. Se pide el de ${a} y ${c}.`),
      e('responde-la-central', m, `${m} es la edad del medio. Se pide el MCD de la menor y la mayor.`),
      e('mcd-es-la-menor', a, `Supusiste que ${a} divide a ${c}, y no es así: hay que buscar el MCD.`),
      e('mcd-central-y-mayor', mcd(m, c), `Ese es el MCD de la del medio y la mayor. Se pide el de ${a} y ${c}.`),
      e('mcm-por-mcd', mcm(a, c), `Ese es el MCM de ${a} y ${c}. Se pide el MCD.`),
    ];
    const solucion = [
      ['En la progresión a, ', v('m', 'm'), ', c: a·c = m², y el producto es m³.'],
      [v('m', 'm'), ' = ∛', v('P', P.formatear(Pr)), ' = ', v('m', `${m}`), '.'],
      ['a + c = ', v('S', `${S}`), ` − ${m} = ${a + c} y a·c = ${m * m}: ${a} y ${c}.`],
      [`${a} = ${factorizar(a)} y ${c} = ${factorizar(c)}.`],
      [v('x', 'MCD'), `(${a}; ${c}) = `, v('x', `${mcd(a, c)}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: mcd(a, c), errores, texto: F, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'pg-mcd', producto: Pr, suma: S } });
  }

  // Euclides hacia atrás en unidades del MCD: cocientes q[0..n−1] y signos (+1 defecto, −1 exceso).
  function reconstruir(qs, signos) {
    // r_{n−1} = 1 (el MCD), r_{n−2} = q_n·1; luego r_{i−2} = q_i·r_{i−1} ± r_i.
    const n = qs.length; const r = new Array(n + 1);
    r[n] = 1; r[n - 1] = qs[n - 1];
    for (let i = n - 2; i >= 0; i--) r[i] = qs[i] * r[i + 1] + signos[i] * r[i + 2];
    return { A: r[0], B: r[1] };
  }

  // ---- euclides: cocientes con una división por exceso ----
  function euclides(rng, semilla) {
    const qs = [rng.entero(1, 4), rng.entero(2, 4), rng.entero(2, 5)];
    const ex = rng.entero(0, 1);                                 // la división por exceso
    if (qs[ex] < 2) return null;
    const signos = [1, 1]; signos[ex] = -1;
    const u = reconstruir(qs, signos);
    if (u.A <= u.B) return null;
    const d = rng.entero(2, 15), A = u.A * d, B = u.B * d, D = A - B;
    if (A > 500) return null;
    const variables = { q: { nombre: 'cocientes', color: 'o' }, D: { nombre: 'diferencia', color: 'i' }, d: { nombre: 'MCD', color: 'h' }, S: { nombre: 'suma de las medidas', color: 'd' } };
    const ord = ['primera', 'segunda'][ex];
    const enunciado = ['Al hallar el MCD de dos listones (en cm) con el algoritmo de Euclides, los cocientes fueron ', v('q', qs.join(', ').replace(/, (\d+)$/, ' y $1')), `. La ${ord} división fue por exceso. Se diferencian en `, v('D', `${D} cm`), '.'];
    const pregunta = ['¿Cuánto ', v('S', 'suman las dos medidas'), '?'];
    const alt = (s, txt, id) => { const w = reconstruir(...s); if (w.A <= w.B || D % (w.A - w.B)) return null; const dd = D / (w.A - w.B); return e(id, dd * (w.A + w.B), txt); };
    const errores = [
      alt([qs, [1, 1]], `Hiciste todas por defecto. En la ${ord}, por exceso, se resta el resto.`, 'exceso-como-defecto'),
      alt([qs.slice().reverse(), signos], 'Usaste los cocientes al revés. El primero es de la primera división.', 'cocientes-al-reves'),
      alt([qs, [signos[1], signos[0]]], `Pusiste el exceso en otra división. Es la ${ord}.`, 'exceso-en-otra-division'),
      e('responde-un-numero-mayor', A, `${A} cm es el listón más largo. Se pide la suma.`),
      e('responde-el-mcd', d, `${d} cm es el MCD. Se pide la suma de las medidas.`),
    ];
    const r1 = qs[2];
    const lin = (i) => {
      const rr = [u.A, u.B, r1, 1];
      return `${rr[i]}d = ${qs[i]}·${rr[i + 1]}d ${signos[i] > 0 ? '+' : '−'} ${rr[i + 2]}d${signos[i] < 0 ? ' (por exceso)' : ''}`;
    };
    const solucion = [
      ['De abajo arriba, en unidades del MCD ', v('d', 'd'), `: el último resto es ${r1}d.`],
      [`Segunda división: ${lin(1)}.`],
      [`Primera: ${lin(0)}.`],
      [`${u.A}d − ${u.B}d = ${u.A - u.B}d = `, v('D', `${D}`), ' ⇒ ', v('d', `d = ${d}`), '.'],
      [`Medidas: ${A} cm y ${B} cm; `, v('S', `suma ${A + B} cm`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: A + B, errores, texto: x => `${F(x)} cm`, unidad: 'cm', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'euclides', cocientes: qs, exceso: ex + 1, D } });
  }

  return { id: ID, titulo: 'Fracciones, decimales periódicos y MCD en problemas', generar, TIPOS };
});
