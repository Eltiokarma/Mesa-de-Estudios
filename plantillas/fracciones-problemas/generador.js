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
    return { id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta, _datos: o.datos };
  }

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
    const enunciado = ['Se consideran las fracciones de la forma ', v('f', forma), ', donde n es un entero positivo.'];
    const pregunta = ['¿Cuántas de ellas son irreducibles y, a la vez, mayores que ', v('c1', `${p1}/${q1}`), ' y menores que ', v('c2', `${p2}/${q2}`), '?'];
    let nr = lo; while (mcd(nr, k) === 1) nr++;
    const errores = [
      e('cuenta-reducibles', T, `Contaste los ${T} valores de n, también los que hacen reducible la fracción. Por ejemplo, n = ${nr} da ${nr}/${nr + k}, que se simplifica entre ${mcd(nr, k)}. Se piden solo las irreducibles.`),
    ];
    for (const p of ps) {
      const cnt = T - multiplos(lo, hi, p);
      errores.push(e(`quita-solo-multiplos-de-${p}`, cnt, `Quitaste solo los múltiplos de ${p}. Como ${k} = ${factorizar(k)}, la fracción también se simplifica cuando n es múltiplo de ${ps.filter(x => x !== p).join(' o de ')}.`));
    }
    const sinIE = T - ps.reduce((s, p) => s + multiplos(lo, hi, p), 0);
    errores.push(e('sin-inclusion-exclusion', sinIE, `Quitaste los múltiplos de cada primo de ${k} por separado, y los que son múltiplos de dos de ellos a la vez (de ${ps[0] * ps[1]}, por ejemplo) los quitaste dos veces. Hay que devolverlos una vez.`));
    errores.push(e('cuenta-las-reducibles', T - C, `Ese número es el de las fracciones que se simplifican. Se piden las irreducibles: las que quedan al quitar esas de los ${T} valores de n.`));
    const cota = (p, q) => { const fr = P.frac(p * k, q - p); return P.textoFraccion(fr) + (fr.d === 1 ? '' : ` = ${F(fr.n / fr.d)}`); };
    const ineq = (p, q, sg) => `${q}n ${sg} ${p === 1 ? `n + ${k}` : `${p}(n + ${k})`}` + (q - p === 1 ? '' : ` ⇔ ${q - p}n ${sg} ${p * k}`) + ` ⇔ n ${sg} ${cota(p, q)}`;
    const ieTxt = partes.map((x, idx) => `${idx === 0 ? '' : x.signo > 0 ? ' + ' : ' − '}${x.c}`).join('') + (partes.length > 1 ? ` = ${quitar}` : '');
    const listaMult = partes.map(x => `de ${x.prod}: ${x.c}`).join('; ');
    const solucion = [
      [v('f', forma), ' > ', v('c1', `${p1}/${q1}`), ` ⇔ ${ineq(p1, q1, '>')}. El menor n es ${lo}.`],
      [v('f', forma), ' < ', v('c2', `${p2}/${q2}`), ` ⇔ ${ineq(p2, q2, '<')}. El mayor n es ${hi}.`],
      [`Así n va de ${lo} a ${hi}: son ${hi} − ${lo} + 1 = ${T} valores.`],
      [`MCD(n; n + ${k}) = MCD(n; ${k}), y ${k} = ${factorizar(k)}: la fracción es irreducible cuando n no es múltiplo de ${ps.join(' ni de ')}.`],
      [`Múltiplos entre ${lo} y ${hi}, ${listaMult}. Se quitan ${ieTxt}.`],
      ['Quedan ', `${T} − ${quitar} = `, v('x', `${C}`), ' fracciones.'],
    ];
    return cerrar(rng, semilla, { correcta: C, errores, texto: F, variables, enunciado, pregunta, solucion,
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
      e('cocientes-sin-el-mcd', p + q, `Sumaste los cocientes p = ${p} y q = ${q}. Los números son d·p y d·q: falta multiplicar por el MCD, d = ${d}.`),
    ];
    for (const t of ternas(D, M, false)) if (t.d * (t.p + t.q) !== A && t.d * (t.p + t.q) !== B) errores.push(e('cocientes-no-pesi', t.d * (t.p + t.q), `Tomaste p = ${t.p} y q = ${t.q}, que no son primos entre sí. Con ellos el MCD de ${t.d * t.p} y ${t.d * t.q} no es ${t.d}, y su MCM no es ${M}: compruébalo.`));
    const disc = D * D + 4 * M, r = Math.round(Math.sqrt(disc));
    if (r * r === disc && (r - D) % 2 === 0) { const b = (r - D) / 2; errores.push(e('mcm-como-producto', 2 * b + D, `Tomaste el MCM como si fuera el producto de los dos números. Eso solo pasa si son primos entre sí; aquí ${b}·${b + D} = ${M}, pero el MCM de ${b} y ${b + D} no es ${M}.`)); }
    errores.push(e('responde-un-numero-mayor', A, `${A} es el mayor de los dos números. Se pide la suma de los dos: ${A} + ${B}.`));
    errores.push(e('responde-un-numero-menor', B, `${B} es el menor de los dos números. Se pide la suma de los dos: ${A} + ${B}.`));
    errores.push(e('suma-diferencia-y-mcm', D + M, 'Sumaste la diferencia y el MCM. Esos son datos; los números salen de escribirlos como d·p y d·q.'));
    const solucion = [
      ['Sea ', v('d', 'd'), ' el MCD: los números son d·p y d·q, con p > q primos entre sí. Entonces ', v('D', `d·(p − q) = ${D}`), ' y ', v('M', `d·p·q = ${M}`), '.'],
      ['Como p − q y p·q no tienen factores comunes (p y q son PESI), ', v('d', 'd'), ` = MCD(${D}; ${M}) = `, v('d', `${d}`), '.'],
      [`Entonces p − q = ${D}/${d} = ${p - q} y p·q = ${M}/${d} = ${p * q}: p = ${p} y q = ${q}.`],
      [`Los números son ${d}·${p} = ${A} y ${d}·${q} = ${B}. Comprobación: diferencia ${D} y MCM ${M}.`],
      [v('S', 'Suma'), ` = ${A} + ${B} = `, v('S', `${A + B}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: A + B, errores, texto: F, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'pesi', D, M } });
  }

  // Porcentajes con periódico: fracción del total (p/q) → texto del porcentaje y su generatriz.
  function porcentajeTxt(n, d) {
    const des = desarrollo(100 * n, d);
    return { texto: conPuntos(des) + ' %', des };
  }
  function generatrizPasos(n, d) {
    const { des } = porcentajeTxt(n, d);
    const todo = Number(`${des.ent}${des.ante}${des.per}`), sinPer = Number(`${des.ent}${des.ante}`);
    const den = '9'.repeat(des.per.length) + '0'.repeat(des.ante.length);
    const num = todo - sinPer;
    return `${conPuntos(des)} = (${todo} − ${sinPer})/${den} = ${num}/${den}${fracTxt(num, Number(den)) === `${num}/${den}` ? '' : ` = ${fracTxt(num, Number(den))}`}; dividido entre 100: ${fracTxt(n, d)}`;
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
    const quien = rng.elegir([['Rosa', 'su gratificación'], ['Don Julio', 'lo que ganó en la feria'], ['Carmen', 'su sueldo'], ['Wilber', 'sus ahorros']]);
    const par = rng.elegir([['ropa', 'útiles'], ['el alquiler', 'el mercado'], ['un celular', 'pasajes'], ['la matrícula', 'regalos']]);
    const gastos = g1 >= g2 ? par : [par[1], par[0]];       // el rubro grande va con el gasto grande
    const variables = { g1: { nombre: 'primer porcentaje', color: 'o' }, g2: { nombre: 'segundo porcentaje', color: 'i' }, R: { nombre: 'lo que quedó', color: 'h' }, X: { nombre: 'dinero inicial', color: 'd' } };
    const enunciado = [`${quien[0]} gastó el `, v('g1', p1), ` de ${quien[1]} en ${gastos[0]} y luego el `, v('g2', p2), ` de lo que le quedaba en ${gastos[1]}. Al final le quedaron `, v('R', `S/ ${F(R)}`), '.'];
    const pregunta = ['¿Cuánto ', v('X', 'dinero tenía al inicio'), '?'];
    const q1 = 1 - n1 / d1, q2 = 1 - n2 / d2;
    const errores = [];
    if (n1 / d1 + n2 / d2 < 1) errores.push(e('AR3-segundo-sobre-el-total', R / (1 - n1 / d1 - n2 / d2), `Tomaste el ${p2} sobre todo el dinero. El segundo gasto es de lo que le quedaba después del primero, no del total.`, 'parcial'));
    errores.push(e('AR3-revertir-sumando', R * (1 + n2 / d2) * (1 + n1 / d1), `Para regresar le sumaste a lo que quedó el mismo porcentaje que se gastó. Pero el porcentaje se calculó sobre la cantidad de antes, que es mayor: hay que dividir entre lo que queda (${fracTxt(d2 - n2, d2)} y ${fracTxt(d1 - n1, d1)}).`, 'parcial'));
    errores.push(e('AR4-gasto-por-lo-que-queda', R / (n1 / d1 * n2 / d2), `Multiplicaste las fracciones que se gastan (${fracTxt(n1, d1)} y ${fracTxt(n2, d2)}) como si fueran lo que queda. Después de gastar ${fracTxt(n1, d1)} queda ${fracTxt(d1 - n1, d1)}.`, 'parcial'));
    errores.push(e('olvida-un-gasto', R / q1, `Solo deshiciste el primer gasto. Lo que quedó al final es después de los dos gastos.`));
    errores.push(e('generatriz-con-90', R / ((1 - n1 / d1 / 10) * q2), `Escribiste ${p1} con un 0 de más en el denominador de la generatriz. ${conPuntos(porcentajeTxt(n1, d1).des)} es periódico puro: va un 9 por cada cifra del periodo y ningún 0.`));
    const solucion = [
      ['Cada porcentaje a fracción: ', v('g1', p1), ': ', generatrizPasos(n1, d1), '.'],
      [v('g2', p2), ': ', generatrizPasos(n2, d2), '.'],
      [`Después del primer gasto queda ${fracTxt(d1 - n1, d1)} del dinero; del resto gasta ${fracTxt(n2, d2)} y queda ${fracTxt(d2 - n2, d2)} de ese resto.`],
      [`Al final queda ${fracTxt(d1 - n1, d1)} · ${fracTxt(d2 - n2, d2)} = ${fracTxt((d1 - n1) * (d2 - n2), d1 * d2)} del dinero inicial: `, v('X', 'X'), ` · ${fracTxt((d1 - n1) * (d2 - n2), d1 * d2)} = `, v('R', F(R)), '.'],
      [v('X', 'X'), ` = ${F(R)} ÷ ${fracTxt((d1 - n1) * (d2 - n2), d1 * d2)} = `, v('X', `S/ ${F(X)}`), `. Comprobación: gasta ${F(g1)}, quedan ${F(resto)}; gasta ${F(g2)}, quedan ${F(R)}.`],
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
    const enunciado = [`Un comerciante de Juliaca tenía entre ${L} y ${H} ${prod[0]}. Vendió `, v('f1', `${a1}/${b1}`), ' del total y luego ', v('f2', `${a2}/${b2}`), ` de lo que le quedaba. Le quedaron menos de `, v('C', `${C}`), ` ${prod[1]}.`];
    const pregunta = ['¿Cuántos ', v('N', `${prod[1]} tenía como máximo`), '?'];
    const errores = [];
    const l12 = mcm(b1, b2);
    if (l12 !== m) errores.push(e('exige-multiplo-de-ambos', mayor(l12, fn, fd, C, true), m > l12
      ? `No alcanza con que sea múltiplo de ${b1} y de ${b2}: ${a2}/${b2} se toma de lo que queda, ${b1 - a1}/${b1} del total, y eso tiene que dar entero; el total debe ser múltiplo de ${m}.`
      : `Pediste que el total sea múltiplo de ${b1} y de ${b2}. Pero ${a2}/${b2} se toma de lo que queda, ${b1 - a1}/${b1} del total: basta que el total sea múltiplo de ${m}.`));
    if (b1 * b2 !== m && b1 * b2 !== l12) errores.push(e('exige-multiplo-del-producto', mayor(b1 * b2, fn, fd, C, true), `Pediste que el total sea múltiplo de ${b1}·${b2} = ${b1 * b2}. Basta que salgan enteras las dos ventas: múltiplo de ${m}.`));
    if (b1 !== m) errores.push(e('solo-primera-venta', mayor(b1, fn, fd, C, true), `Solo cuidaste que la primera venta salga entera. La segunda, ${a2}/${b2} de lo que queda, también tiene que dar un número entero de ${prod[1]}.`));
    if (a1 * b2 + a2 * b1 < b1 * b2) errores.push(e('AR3-segunda-sobre-el-total', mayor(l12, b1 * b2 - a1 * b2 - a2 * b1, b1 * b2, C, true), `Tomaste ${a2}/${b2} del total. La segunda venta es de lo que le quedaba después de la primera.`, 'parcial'));
    errores.push(e('AR5-responde-lo-que-queda', R, `${F(R)} es lo que le quedó con ese máximo. Se pide cuántos ${prod[1]} tenía al inicio.`));
    errores.push(e('cota-no-estricta', mayor(m, fn, fd, C, false), `Aceptaste que le queden exactamente ${C}. El enunciado dice menos de ${C}.`));
    errores.push(e('sin-divisibilidad', Math.min(H, topeC), `Tomaste el mayor número que cumple la cota sin revisar que las ventas den enteros: con ese total, ${a1}/${b1} o ${a2}/${b2} de lo que queda no es un número entero de ${prod[1]}.`));
    const s = b2 / mcd(b1 - a1, b2);
    const solucion = [
      [`Vende `, v('f1', `${a1}/${b1}`), ` del total: el total `, v('N', 'N'), ` es múltiplo de ${b1}, N = ${b1}t, y le quedan ${b1 - a1}t.`],
      ['Luego vende ', v('f2', `${a2}/${b2}`), ` de ${b1 - a1}t: ${b1 - a1}t debe ser múltiplo de ${b2}` + (s === 1 ? `, y eso ya se cumple para todo t. Así basta que N sea múltiplo de ${m}.` : `, y eso pide que t sea múltiplo de ${s}. Así N es múltiplo de ${b1}·${s} = ${m}.`)],
      [`Le queda ${b1 - a1}/${b1} · ${b2 - a2}/${b2} = ${fracTxt(fn, fd)} del total: N·${fracTxt(fn, fd)} < `, v('C', `${C}`), ` ⇒ N < ${F(C * fd / fn)}.`],
      [`El mayor múltiplo de ${m} que cumple, entre ${L} y ${H}, es `, v('N', `${N}`), `. Comprobación: vende ${N * a1 / b1}, quedan ${N * (b1 - a1) / b1}; vende ${N * (b1 - a1) / b1 * a2 / b2}, quedan ${F(R)} < ${C}.`],
    ];
    return cerrar(rng, semilla, { correcta: N, errores, texto: F, variables, enunciado, pregunta, solucion,
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
      ? ['Se buscan fracciones equivalentes a ', v('fr', `${a}/${b}`), ' cuyo denominador sea un número de tres cifras que no sea múltiplo de ', v('q', `${q}`), '.']
      : ['Se buscan fracciones equivalentes a ', v('fr', `${a}/${b}`), ' cuya suma de términos sea un número de tres cifras y cuyo numerador no sea múltiplo de ', v('q', `${q}`), '.'];
    const pregunta = ['¿Cuántas ', v('x', 'fracciones'), ' cumplen?'];
    const errores = [
      e('olvida-la-condicion', T, `Contaste todas las equivalentes de tres cifras: faltó quitar aquellas cuyo ${quien} es múltiplo de ${q}.`),
      e('cuenta-las-excluidas', E, `Esas son las que hay que quitar: las de ${quien} múltiplo de ${q}. Se piden las otras.`),
      e('poste-sin-sumar-uno', T - 1 - E, `Restaste ${kmax} − ${kmin} y olvidaste sumar 1: de ${kmin} a ${kmax} hay ${T} valores de k, porque se cuentan los dos extremos.`),
    ];
    if (100 % base) { const k0 = Math.floor(100 / base); errores.push(e('incluye-dos-cifras', kmax - k0 + 1 - multiplos(k0, kmax, q), `Empezaste en k = ${k0}, pero ${base}·${k0} = ${base * k0} tiene dos cifras. El primer k que sirve es ${kmin}.`)); }
    errores.push(e('resta-entre-q', T - Math.floor(T / q), `Quitaste ${T}/${q} redondeado, como si exactamente una de cada ${q} se fuera. Hay que contar los múltiplos de ${q} entre ${kmin} y ${kmax}, que dependen de dónde empieza el rango.`));
    const expr = sub === 'den' ? `${b}k` : `${a}k + ${b}k = ${a + b}k`;
    const solucion = [
      ['Como ', v('fr', `${a}/${b}`), ` es irreducible, sus equivalentes son ${a}k/${b}k con `, v('k', 'k'), ' entero positivo.'],
      [`${sub === 'den' ? 'Denominador' : 'Suma de términos'}: ${expr}, de tres cifras: 100 ≤ ${base}k ≤ 999 ⇒ k va de ${kmin} a ${kmax}: ${kmax} − ${kmin} + 1 = ${T} valores.`],
      [`El ${quien} es ${cond}k, y como ${cond} no es múltiplo de `, v('q', `${q}`), `, ${cond}k es múltiplo de ${q} solo cuando k lo es. Múltiplos de ${q} entre ${kmin} y ${kmax}: ${E}.`],
      ['Cumplen ', `${T} − ${E} = `, v('x', `${C}`), ' fracciones.'],
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
    const enunciado = ['Una bomba llena ', v('f', `${p}/${q}`), ` de ${obj} en `, v('t1', `${t1} ${t1 === 1 ? 'hora' : 'horas'}`), '. Desde ese momento su rendimiento disminuye en ', v('r', `${a}/${b}`), ' de lo que era, y así sigue hasta terminar.'];
    const pregunta = ['¿En cuántas horas se llena, ', v('T', 'en total'), `, ${el}?`];
    const base = t1 * (q - p) / p; // horas que faltarían con el rendimiento de antes
    const errores = [
      e('AR4-disminuye-en-como-queda-en', t1 + base * b / a, `Tomaste «disminuye en ${a}/${b}» como «queda en ${a}/${b}». Si disminuye en ${a}/${b}, la bomba trabaja con ${b - a}/${b} de su rendimiento.`, 'parcial'),
      e('sin-cambio-de-rendimiento', t1 + base, `Seguiste con el rendimiento de antes. Después de llenar ${p}/${q} la bomba llena menos por hora: tarda más.`),
      e('AR8-tiempo-directo', t1 + base * (b - a) / b, `Multiplicaste el tiempo por ${b - a}/${b}. Con menos rendimiento se tarda más: el tiempo se divide entre ${b - a}/${b} (es inversamente proporcional).`),
      e('AR5-solo-lo-que-falta', t2.n / t2.d, `Esas son solo las horas de la segunda parte. Se pide el tiempo total: hay que sumar las ${t1} primeras horas.`),
    ];
    const r1 = P.frac(p, q * t1), r2 = P.frac(p * (b - a), q * t1 * b);
    const solucion = [
      ['Rendimiento al inicio: ', v('f', `${p}/${q}`), ' en ', v('t1', `${t1} h`), ` ⇒ ${P.textoFraccion(r1)} ${del} por hora.`],
      ['Disminuye en ', v('r', `${a}/${b}`), `: queda ${b - a}/${b} del rendimiento, ${P.textoFraccion(r1)} · ${b - a}/${b} = ${P.textoFraccion(r2)} ${del} por hora.`],
      [`Falta ${fracTxt(q - p, q)} ${del}: ${fracTxt(q - p, q)} ÷ ${P.textoFraccion(r2)} = ${P.textoFraccion(t2)} h${t2.d === 1 ? '' : ` = ${F(t2.n / t2.d)} h`}.`],
      [v('T', 'Total'), ` = ${t1} + ${F(t2.n / t2.d)} = `, v('T', `${F(total)} h`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: total, errores, texto: x => `${F(x)} h`, unidad: 'h', variables, enunciado, pregunta, solucion,
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
    const pregunta = ['De todas las que cumplen, ¿cuál es ', v('x', 'la que tiene la menor diferencia entre su denominador y su numerador'), '?'];
    const correcta = terminos(a, b);
    const errores = [
      et('reducible-aceptada', terminos(ra, rb), `${ra}/${rb} tiene la diferencia más pequeña, pero no es irreducible: ${ra} y ${rb} se dividen entre ${g}.`),
      et('simplifica-y-cambia-el-dato', terminos(ra / g, rb / g), `Simplificaste ${ra}/${rb} a ${ra / g}/${rb / g}, pero así sus términos ya no tienen ${sub === 'suma' ? 'suma' : 'producto'} ${S}.`),
      et('impropia', terminos(b, a), `${b}/${a} es impropia: el numerador es mayor que el denominador. Se pide una fracción propia.`),
      malas[1] ? et('reducible-aceptada', terminos(malas[1][0], malas[1][1]), `${malas[1][0]}/${malas[1][1]} no es irreducible: ${malas[1][0]} y ${malas[1][1]} se dividen entre ${mcd(malas[1][0], malas[1][1])}.`) : null,
      sub === 'suma' && S % 2 === 0 ? et('terminos-iguales', terminos(S / 2, S / 2), `${S / 2}/${S / 2} vale 1: no es propia ni irreducible.`) : null,
      sub === 'producto' && Number.isInteger(Math.sqrt(S)) ? et('terminos-iguales', terminos(Math.sqrt(S), Math.sqrt(S)), `${Math.sqrt(S)}/${Math.sqrt(S)} vale 1: no es propia ni irreducible.`) : null,
      et('mayor-diferencia', terminos(pares.lista[pares.lista.length - 1][0], pares.lista[pares.lista.length - 1][1]), 'Esa es la de mayor diferencia entre sus términos. Se pide la de menor diferencia.'),
    ];
    const prueba = pares.lista.slice(0, pares.lista.indexOf(buena) + 1).map(([x, y]) => `${x}/${y} (${mcd(x, y) === 1 ? 'irreducible' : `MCD ${mcd(x, y)}`})`).join('; ');
    const solucion = sub === 'suma'
      ? [[`Si a + b = `, v('S', `${S}`), ' con a < b, la diferencia b − a = ', `${S} − 2a`, ' es menor cuanto más cerca está a de la mitad.'],
         [`Se prueba desde a = ${pares.lista[0][0]} hacia abajo: ${prueba}.`],
         ['La primera irreducible es ', v('x', `${a}/${b}`), `, con diferencia ${b - a}.`]]
      : [[`Si a·b = `, v('S', `${S}`), ' con a < b, la diferencia b − a es menor cuanto más cerca están a y b de √', `${S} ≈ ${F(Math.sqrt(S))}`, '.'],
         [`Se prueban los pares de divisores desde el centro: ${prueba}.`],
         ['La primera irreducible es ', v('x', `${a}/${b}`), `, con diferencia ${b - a}.`]];
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
    const enunciado = ['Con los números ', v('n', ns.join(', ').replace(/, (\d+)$/, ' y $1')), ' se forman fracciones cuyo numerador y denominador son dos de ellos, distintos. Se toman todas las fracciones propias e irreducibles que se pueden formar.'];
    const pregunta = ['¿Cuál es el ', v('x', 'producto'), ' de esas fracciones?'];
    const correcta = numero(pn, pd);
    const errores = [
      et('reducibles-incluidas', numero(tn, td), `Multiplicaste también ${red.map(([x, y]) => `${x}/${y}`).join(', ')}, que no ${red.length === 1 ? 'es irreducible' : 'son irreducibles'}. Se piden solo las irreducibles.`),
      et('impropias-incluidas', numero(1), 'Multiplicaste también las impropias (cada una es la inversa de una propia): así todo se cancela y sale 1. Se piden solo las propias.'),
      et('impropias-en-vez-de-propias', numero(pd, pn), 'Pusiste el número mayor arriba: esas son impropias. En una fracción propia el numerador es menor que el denominador.'),
    ];
    const solucion = [
      [`Las propias se forman con el menor arriba: ${prop.map(([x, y]) => `${x}/${y}`).join(', ')}.`],
      [`Irreductibles (MCD de los términos igual a 1): ${irr.map(([x, y]) => `${x}/${y}`).join(', ')}. Se descartan ${red.map(([x, y]) => `${x}/${y} (MCD ${mcd(x, y)})`).join(', ')}.`],
      [v('x', 'Producto'), ` = ${irr.map(([x, y]) => `${x}/${y}`).join(' · ')} = ${pn}/${pd}${correcta.texto === `${pn}/${pd}` ? '' : ''} `, ...(correcta.texto === `${pn}/${pd}` ? ['(ya es irreducible): ', v('x', correcta.texto)] : ['= ', v('x', correcta.texto)]), '.'],
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
      const variables = { fr: { nombre: 'fracción dada', color: 'o' }, L: { nombre: 'cifras del periodo', color: 'i' }, x: { nombre: 'últimas dos cifras del periodo', color: 'd' } };
      const enunciado = ['La fracción ', v('fr', `${a}/${p}`), ' da un decimal periódico puro cuyo periodo tiene ', v('L', `${L} cifras`), '.'];
      const pregunta = ['Sin hacer toda la división, ¿en qué ', v('x', 'dos cifras termina el periodo'), '?'];
      const u = p % 10, Tu = T % 10, uu = x % 10;
      const errores = [
        et('sin-el-signo', dos(a * inv100(p) % 100), `Buscaste un número que multiplicado por ${p} termine en ${String(a).padStart(2, '0')}. Pero periodo·${p} = ${a}·99…9 = ${a}·10${sup(L)} − ${a}, que termina en ${String(T).padStart(2, '0')}.`),
        et('primeras-cifras', dos(Number(des.per.slice(0, 2))), `Esas son las dos primeras cifras del periodo (salen al empezar a dividir). Se piden las dos últimas.`),
        et('cifras-al-reves', dos(Number(String(x).padStart(2, '0').split('').reverse().join(''))), 'Tienes las cifras correctas pero en el orden al revés: la de las unidades es la última del periodo.'),
        a !== 1 ? et('periodo-de-uno-entre-p', dos(99 * inv100(p) % 100), `Esas son las últimas cifras del periodo de 1/${p}. El de ${a}/${p} es ${a} veces 99…9 entre ${p}: hay que buscar el que por ${p} termine en ${String(T).padStart(2, '0')}.`) : null,
      ];
      const solucion = [
        ['Un periódico puro de ', v('L', `${L} cifras`), ' es periodo/99…9 (', v('L', `${L} nueves`), '). Así ', v('fr', `${a}/${p}`), ` = periodo/(10${sup(L)} − 1), y periodo · ${p} = ${a} · (10${sup(L)} − 1).`],
        [`${a} · (10${sup(L)} − 1) = ${a}·10${sup(L)} − ${a} termina en ${String(T).padStart(2, '0')} (es ${100} − ${a % 100} en las dos últimas cifras).`],
        [`Unidades: u · ${u} debe terminar en ${Tu} ⇒ u = ${uu}. Decenas: probando, ${String(x).padStart(2, '0')} · ${p} = ${x * p}, que termina en ${String(T).padStart(2, '0')}.`],
        ['El periodo termina en ', v('x', String(x).padStart(2, '0')), `. Comprobación: ${a}/${p} = 0,${L <= 20 ? des.per : des.per.slice(0, 8) + '…' + des.per.slice(-6)}… (${L} cifras en el periodo).`],
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
      r === 0 ? et('resto-cero-primera', c(cif(1)), `El resto de ${k} entre ${L} es 0: eso quiere decir que el lugar ${k} cierra un periodo completo. Le toca la última cifra del periodo, no la primera.`) : null,
      et('corrido-uno', c(cif(pos + 1)), `Te corriste un lugar: con resto ${r}, la cifra es la ${pos}.ª del periodo${r === 0 ? ' (resto 0 = la última)' : ''}.`),
      et('corrido-menos-uno', c(cif(pos - 1)), `Te corriste un lugar hacia atrás: con resto ${r}, la cifra es la ${pos}.ª del periodo${r === 0 ? ' (resto 0 = la última)' : ''}.`),
      et('usa-el-cociente', c(cif(cocPos)), `Usaste el cociente de ${k} entre ${L} (${Math.floor(k / L)}) para ubicar la cifra. El cociente dice cuántos periodos completos hay; la posición la da el resto.`),
      et('cifra-de-la-fraccion', c(Number(String(a)[String(a).length - 1])), `Esa es una cifra de la fracción, no del decimal. El decimal repite el bloque ${per}.`),
    ];
    const solucion = [
      ['El periodo de ', v('fr', `${a}/${q}`), ' es ', v('L', per), `: tiene ${L} cifras y se repite desde la primera cifra después de la coma.`],
      [v('k', `${k}`), ` = ${L} · ${Math.floor(k / L)} + ${r}: ${Math.floor(k / L)} periodos completos ${r === 0 ? 'y ninguna cifra más; el lugar ' + k + ' es la última cifra del periodo' : `y ${r} ${r === 1 ? 'cifra' : 'cifras'} más`}.`],
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
      e('acepta-reducibles', todos, `Contaste todos los a entre ${d + 1} y ${Math.ceil(S / 2) - 1}, también los que tienen factores comunes con ${d}: esas fracciones se simplifican.`),
      e('pares-ordenados', 2 * C, `Contaste cada par dos veces, como (a; b) y (b; a). El enunciado pide a < b.`),
      e('incluye-propias', propias, `Contaste también valores de a menores que ${d}: con ellos a/${d} es propia. Las dos fracciones deben ser impropias.`),
      S % 2 === 0 && mcd(S / 2, d) === 1 && S / 2 > d ? e('incluye-a-igual-b', C + 1, `Contaste a = b = ${S / 2}, pero el enunciado pide a < b.`) : null,
    ];
    const solucion = [
      [`a/${d} + b/${d} = (a + b)/${d} = `, v('m', `${m}`), ` ⇒ a + b = ${S}.`],
      [`Impropias: a > `, v('d', `${d}`), ` y b > ${d}. Con a < b, a < ${S / 2}: a va de ${d + 1} a ${Math.ceil(S / 2) - 1}.`],
      [`Irreducibles: MCD(a; ${d}) = 1. Como b = ${S} − a y ${S} es múltiplo de ${d}, MCD(b; ${d}) = MCD(a; ${d}): basta mirar a.`],
      [`Valores de a primos con ${d} = ${factorizar(d)}: ${as.join(', ')}. Son `, v('x', `${C}`), ' pares.'],
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
      g > 1 ? et('sin-simplificar', cuenta(bruto.ante, bruto.per), `Miraste el denominador sin simplificar. ${N} y ${sub === 'factorial' ? presentacion + ' = ' + D : presentacion} tienen factor común ${g}: primero se simplifica y luego se miran los factores.`) : null,
      real.x > 0 && real.y > 0 ? et('suma-exponentes', cuenta(real.x + real.y, real.per), `Sumaste los exponentes del 2 y del 5. Las cifras no periódicas son el mayor de los dos exponentes: con 2${sup(real.x)}·5${sup(real.y)} se completa 10${sup(real.ante)}.`) : null,
      real.x > 0 && real.y > 0 && Math.min(real.x, real.y) > 0 && real.x !== real.y ? et('ante-menor-exponente', cuenta(Math.min(real.x, real.y), real.per), `Tomaste el menor exponente. Hace falta el mayor de los exponentes del 2 y del 5 para que 10ⁿ se divida entre ellos.`) : null,
      et('puro-por-mixto', cuenta(0, real.per), `Lo tomaste como periódico puro. El denominador simplificado tiene factor ${real.x ? 2 : 5}: el decimal es periódico mixto y tiene cifras no periódicas.`),
      real.comps.length > 1 ? et('periodo-suma', cuenta(real.ante, sumaOrd), `Sumaste las cifras del periodo de cada factor. El periodo de todo es el MCM de esas cantidades, no su suma.`) : null,
      real.comps.length === 1 && primos(real.m).length === 1 && real.m === primos(real.m)[0] && real.m - 1 !== real.per ? et('periodo-p-menos-1', cuenta(real.ante, real.m - 1), `Diste ${real.m} − 1 cifras al periodo. Ese es el máximo posible; el periodo de 1/${real.m} tiene tantas cifras como nueves tiene el menor 99…9 que se divide entre ${real.m}: ${real.per}.`) : null,
      et('cambia-los-papeles', cuenta(real.per, real.ante), 'Cambiaste los papeles: las cifras no periódicas salen del 2 y del 5; las periódicas, de los otros factores.'),
    ];
    const ords = real.comps.map(c => `${c} → ${orden10(c)}`).join('; ');
    const solucion = [
      g > 1 ? [`Primero se simplifica: MCD = ${g}, y `, v('fr', fracDada), ` = ${N / g}/${Dr}.`] : [v('fr', fracDada), ` ya es irreducible (denominador ${Dr}).`],
      [`${Dr} = ${factorizar(Dr)}. Del 2 y del 5: el mayor exponente es `, v('a', `${real.ante}`), ', y esas son las ', v('a', 'cifras no periódicas'), '.'],
      [`Lo demás es ${real.m}${factorizar(real.m) === String(real.m) ? '' : ' = ' + factorizar(real.m)}. Cifras del periodo de cada parte (el menor 99…9 que se divide entre ella): ${ords}.${real.comps.length > 1 ? ` El MCM es ${real.per}.` : ''}`, ' Cifras periódicas: ', v('p', `${real.per}`), '.'],
      ['Tiene ', v('a', real.ante === 1 ? '1 cifra no periódica' : `${real.ante} cifras no periódicas`), ' y ', v('p', plural(real.per, 'periódica')), `. Comprobación: ${N / g}/${Dr} = ${conPuntos(desarrollo(N / g, Dr))}`],
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
    const enunciado = [`Las edades de ${quien} están en progresión geométrica. El producto de las tres edades es `, v('P', P.formatear(Pr)), ' y su suma es ', v('S', `${S}`), '.'];
    const pregunta = ['¿Cuál es el ', v('x', 'MCD de la menor y la mayor edad'), '?'];
    const errores = [
      e('mcd-con-la-central', mcd(a, m), `Ese es el MCD de la menor edad (${a}) y la del medio (${m}). Se pide el de la menor y la mayor (${a} y ${c}).`),
      e('responde-la-central', m, `${m} es la edad del medio. Con ella se hallan las otras dos; se pide el MCD de la menor y la mayor.`),
      e('mcd-es-la-menor', a, `Supusiste que la menor edad divide a la mayor. ${c} no es múltiplo de ${a}: hay que buscar el MCD.`),
      e('mcd-central-y-mayor', mcd(m, c), `Ese es el MCD de la edad del medio y la mayor. Se pide el de la menor y la mayor.`),
      e('mcm-por-mcd', mcm(a, c), `Ese es el MCM de ${a} y ${c}. Se pide el MCD, el mayor número que divide a los dos.`),
    ];
    const solucion = [
      ['En una progresión geométrica a, ', v('m', 'm'), ', c se cumple a·c = m². Así el producto es m³: ', v('m', 'm'), ' = ∛', v('P', P.formatear(Pr)), ' = ', v('m', `${m}`), '.'],
      ['a + c = ', v('S', `${S}`), ' − ', v('m', `${m}`), ` = ${a + c} y a·c = ${m}² = ${m * m}: dos números que suman ${a + c} y multiplican ${m * m}: ${a} y ${c}.`],
      [`Las edades son ${a}, ${m} y ${c} (razón ${p}/${q}). ${a} = ${factorizar(a)} y ${c} = ${factorizar(c)}.`],
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
    const enunciado = ['Para hallar el MCD de las medidas de dos listones de madera (en cm) se usó el algoritmo de Euclides y se obtuvieron, en este orden, los cocientes ', v('q', qs.join(', ').replace(/, (\d+)$/, ' y $1')), `. La ${ord} división se hizo por exceso y las demás por defecto. Los listones se diferencian en `, v('D', `${D} cm`), '.'];
    const pregunta = ['¿Cuánto ', v('S', 'suman las dos medidas'), '?'];
    const alt = (s, txt, id) => { const w = reconstruir(...s); if (w.A <= w.B || D % (w.A - w.B)) return null; const dd = D / (w.A - w.B); return e(id, dd * (w.A + w.B), txt); };
    const errores = [
      alt([qs, [1, 1]], `Hiciste todas las divisiones por defecto. En la ${ord}, por exceso, el dividendo es cociente·divisor menos el resto, no más.`, 'exceso-como-defecto'),
      alt([qs.slice().reverse(), signos], 'Usaste los cocientes al revés. El primero corresponde a la primera división: la de los dos números dados.', 'cocientes-al-reves'),
      alt([qs, [signos[1], signos[0]]], `Pusiste la división por exceso en otro lugar. Es la ${ord} división la que se hizo por exceso.`, 'exceso-en-otra-division'),
      e('responde-un-numero-mayor', A, `${A} cm es el listón más largo. Se pide la suma de las dos medidas.`),
      e('responde-el-mcd', d, `${d} cm es el MCD. Se pide la suma de las dos medidas.`),
    ];
    const r1 = qs[2];
    const lin = (i) => {
      const rr = [u.A, u.B, r1, 1];
      return `${rr[i]}d = ${qs[i]}·${rr[i + 1]}d ${signos[i] > 0 ? '+' : '−'} ${rr[i + 2]}d${signos[i] < 0 ? ' (por exceso)' : ''}`;
    };
    const solucion = [
      ['Se trabaja de abajo hacia arriba con el MCD ', v('d', 'd'), `: la última división es exacta, así que el resto de la primera división es ${qs[2]}·d = ${r1}d.`],
      [`Segunda división: ${lin(1)}.`],
      [`Primera división: ${lin(0)}.`],
      ['Diferencia: ', `${u.A}d − ${u.B}d = ${u.A - u.B}d = `, v('D', `${D}`), ' ⇒ ', v('d', `d = ${d}`), '.'],
      [`Las medidas son ${A} cm y ${B} cm; `, v('S', 'suma'), ' = ', v('S', `${A + B} cm`), '.'],
      [`Comprobación: ${A} = ${qs[0]}·${B} ${signos[0] > 0 ? '+' : '−'} ${r1 * d}${signos[0] < 0 ? ' (por exceso)' : ''}; ${B} = ${qs[1]}·${r1 * d} ${signos[1] > 0 ? '+' : '−'} ${d}${signos[1] < 0 ? ' (por exceso)' : ''}; ${r1 * d} = ${qs[2]}·${d}.`],
    ];
    return cerrar(rng, semilla, { correcta: A + B, errores, texto: x => `${F(x)} cm`, unidad: 'cm', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'euclides', cocientes: qs, exceso: ex + 1, D } });
  }

  return { id: ID, titulo: 'Fracciones, decimales periódicos y MCD en problemas', generar, TIPOS };
});
