/*
 * Generador «estadistica-datos»: promedios, medidas de tendencia central, dispersión y medias.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['estadistica-datos']) y en Node (require). No usa ningún motor.
 *
 * Tipos (entre paréntesis, la fila de la clasificación de admisión que cubren, por su «falta»):
 *   extremo       (optimizar un dato extremo dado el promedio y una cota) promedio fijo y una cota:
 *                 sub cota       el mayor valor posible de un dato si todos son al menos m
 *                 sub distintos  lo mismo con datos enteros distintos (notas o edades)
 *                 sub tope       la menor nota posible si ninguna pasa de M
 *   central       (mediana y moda de datos sueltos, comparadas con la media) datos sin ordenar:
 *                 sub mediana    se pide la mediana (número par o impar de datos)
 *                 sub orden      se pide la relación de orden entre media, mediana y moda
 *   reconstruir   (reconstruir datos a partir de media, mediana y moda) datos enteros positivos:
 *                 sub cinco      5 datos con media, mediana y moda única (y a veces un dato conocido);
 *                                se pide el mayor, el rango o la suma de los extremos; la lista es
 *                                única (comprobado por enumeración)
 *                 sub seis       6 datos con media, mediana y moda única; se pide el mayor o el menor
 *                                valor posible del mayor dato (por enumeración)
 *                 sub incognitas datos ordenados con dos desconocidos x, y; media y mediana dadas
 *   varianza      (efecto de multiplicar y sumar constantes sobre la varianza) Y = aX + b:
 *                 sub var, desv, var-a-desv, media
 *   medias        (medias geométricas y comparación entre medias con casos enteros):
 *                 sub dos        dos números por su MA y su MG: el mayor o la diferencia
 *                 sub mh         la MH con MA y MG (MH = MG²/MA)
 *                 sub dados      dados con producto fijo: la menor MA posible (MA ≥ MG)
 *   subconjuntos  (sumas de progresiones para promedios de subconjuntos):
 *                 sub multiplos  promedio de los múltiplos de k (o de los impares) entre A y B
 *                 sub grupos     pares del 2 al 2N en tres grupos consecutivos: promedio del medio
 *
 * Errores: AR15 (promedio de promedios sin ponderar, parcial) del informe de aritmética; el resto
 * son hipótesis (trampas 24 y 27 de docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md).
 * La varianza es la poblacional (se divide entre n), como en la academia.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'estadistica-datos';
  const INF = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const ar15 = (valor, explicacion) => ({ id: 'AR15-promedio-de-promedios', valor, explicacion, respaldo: 'parcial', fuente: INF });
  const v = P.v;
  const f = (x, d = 2) => P.formatear(x, d);
  const corto = x => Number.isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-7 && Math.abs(x) < 1e6;
  const suma = xs => xs.reduce((a, b) => a + b, 0);
  const lista = xs => xs.map(x => f(x)).join('; ');
  const ord = i => `${i}.°`;
  const TIPOS = ['extremo', 'extremo', 'central', 'central', 'reconstruir', 'reconstruir', 'reconstruir',
    'varianza', 'varianza', 'medias', 'medias', 'subconjuntos', 'subconjuntos'];
  const SUBS = {
    extremo: ['cota', 'cota', 'distintos', 'tope'], central: ['mediana', 'orden'], reconstruir: ['cinco', 'seis', 'incognitas'],
    varianza: ['var', 'var', 'desv', 'var-a-desv', 'media'], medias: ['dos', 'mh', 'dados'], subconjuntos: ['multiplos', 'grupos'],
  };

  // Exacto con coma: 17,125 sale con sus tres decimales (nunca redondeado a la vista en la solución).
  const exacto = x => { for (const d of [0, 1, 2, 3]) if (Math.abs(x * 10 ** d - Math.round(x * 10 ** d)) < 1e-9) return f(x, d); return null; };
  // «= 17,125» si el decimal termina pronto; si no, «≈ 34,44».
  const igualA = x => exacto(x) !== null ? '= ' + exacto(x) : '≈ ' + f(x);
  // Valor racional con denominador pequeño, escrito como fracción irreducible («13/3», «4»).
  function fracTxt(x) {
    for (let d = 1; d <= 12; d++) { const n = Math.round(x * d); if (Math.abs(x * d - n) < 1e-9) return P.textoFraccion(P.frac(n, d)); }
    return null;
  }

  // ---------- estadísticos (los usa también la enumeración) ----------
  const ordenar = xs => xs.slice().sort((a, b) => a - b);
  function mediana(xs) {
    const s = ordenar(xs), n = s.length;
    return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  }
  // Modas: los valores con la mayor frecuencia (si es ≥ 2).
  function modas(xs) {
    const fr = new Map(); for (const x of xs) fr.set(x, (fr.get(x) || 0) + 1);
    const max = Math.max(...fr.values());
    if (max < 2) return { valores: [], frecuencia: 1 };
    return { valores: [...fr].filter(([, c]) => c === max).map(([x]) => x).sort((a, b) => a - b), frecuencia: max };
  }
  const modaUnica = (xs, m) => { const M = modas(xs); return M.valores.length === 1 && M.valores[0] === m; };
  const modaEntre = (xs, m) => modas(xs).valores.includes(m); // la moda puede estar empatada

  /*
   * Listas ordenadas (no decrecientes) de n enteros positivos con suma S y mediana Me2/2.
   * modo 'normal': mediana bien tomada; 'un-central' (n par): el (n/2)-ésimo dato vale Me y el que
   * sigue queda libre (el error de tomar un solo central). cond(lista) filtra al final.
   */
  function listas(n, S, Me2, cond, modo = 'normal') {
    const out = [], acc = [];
    const impar = n % 2 === 1, mid = (n - 1) / 2, c1 = n / 2 - 1;
    const Me = Me2 / 2;
    (function rec(i, min, resto) {
      if (i === n) { if (resto === 0 && cond(acc)) out.push(acc.slice()); return; }
      let lo = min, hi = Math.floor(resto / (n - i));
      if (impar) {
        if (i < mid) hi = Math.min(hi, Math.floor(Me));
        if (i === mid) { if (!Number.isInteger(Me)) return; lo = Math.max(lo, Me); hi = Math.min(hi, Me); }
      } else if (modo === 'un-central') {
        if (i < c1) hi = Math.min(hi, Math.floor(Me));
        if (i === c1) { if (!Number.isInteger(Me)) return; lo = Math.max(lo, Me); hi = Math.min(hi, Me); }
      } else {
        if (i <= c1) hi = Math.min(hi, Math.floor(Me));
        if (i === c1 + 1) { const x = Me2 - acc[c1]; lo = Math.max(lo, x); hi = Math.min(hi, x); }
      }
      for (let x = lo; x <= hi; x++) { acc.push(x); rec(i + 1, x, resto - x); acc.pop(); }
    })(0, 1, S);
    return out;
  }

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(TIPOS);
    const sub = rng.elegir(SUBS[tipo]);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo, sub) {
    if (tipo === 'extremo') return extremo(rng, semilla, sub);
    if (tipo === 'central') return central(rng, semilla, sub);
    if (tipo === 'reconstruir') return sub === 'cinco' ? recCinco(rng, semilla) : sub === 'seis' ? recSeis(rng, semilla) : recIncognitas(rng, semilla);
    if (tipo === 'varianza') return varianza(rng, semilla, sub);
    if (tipo === 'medias') return sub === 'dados' ? mediasDados(rng, semilla) : medias(rng, semilla, sub);
    return subconjuntos(rng, semilla, sub);
  }

  function cerrar(rng, semilla, o) {
    let alternativas, respuesta;
    if (o.textual) {
      alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores.filter(Boolean), rng });
      respuesta = { valor: o.correcta.clave, texto: o.correcta.texto, unidad: '' };
    } else {
      const texto = o.texto || (x => f(x) + (o.unidad ? ' ' + o.unidad : ''));
      const errores = o.errores.filter(e => e && Number.isFinite(e.valor) && (o.fraccion ? texto(e.valor) !== null : corto(e.valor)));
      alternativas = P.armar({ correcta: o.correcta, errores, rng, texto, negativos: !!o.negativos });
      respuesta = { valor: o.correcta, texto: texto(o.correcta), unidad: o.unidad || '' };
    }
    return { id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta, _datos: o.datos };
  }

  // ======================= extremo =======================
  function extremo(rng, semilla, sub) {
    if (sub === 'cota') {
      const colecta = rng.moneda();
      const n = colecta ? rng.entero(5, 12) : rng.entero(4, 10);
      const m = colecta ? rng.elegir([5, 10, 15, 20]) : rng.elegir([40, 45, 48, 50]);
      const k = colecta ? rng.entero(2, 12) : rng.entero(1, 5);
      const p = m + k, S = n * p, x = S - (n - 1) * m;
      const texto = colecta ? (y => `S/ ${f(y)}`) : (y => `${f(y)} kg`);
      const variables = { n: { nombre: colecta ? 'número de vecinos' : 'número de sacos', color: 'o' }, p: { nombre: 'promedio', color: 'i' },
        m: { nombre: 'mínimo de cada uno', color: 'd' }, x: { nombre: 'mayor valor posible', color: 'h' } };
      const enunciado = colecta
        ? ['En una colecta para la fiesta del barrio, ', v('n', `${n} vecinos`), ' aportaron en promedio ', v('p', `S/ ${p}`), ' cada uno. Nadie aportó menos de ', v('m', `S/ ${m}`), '.']
        : ['Un camión lleva ', v('n', `${n} sacos`), ' de papa con un peso promedio de ', v('p', `${p} kg`), '. Ningún saco pesa menos de ', v('m', `${m} kg`), '.'];
      const pregunta = colecta ? ['¿Cuál es el ', v('x', 'mayor aporte posible'), ' de uno de los vecinos?'] : ['¿Cuál es el ', v('x', 'mayor peso posible'), ' de uno de los sacos?'];
      const quien = colecta ? 'vecinos' : 'sacos';
      const errores = [
        h('extremo-resta-n-minimos', S - n * m, `Restaste el mínimo ${n} veces, también al que quieres hacer grande. Solo los otros ${n - 1} ${quien} se quedan en el mínimo.`),
        h('extremo-cuenta-uno-menos', S - (n - 2) * m, `Dejaste en el mínimo a ${n - 2} ${quien}, pero los demás son ${n - 1}: todos ellos deben quedarse en el mínimo para que sobre lo más posible.`),
        h('extremo-simetrico', 2 * p - m, `Supusiste que el mayor queda tan arriba del promedio como el mínimo queda abajo (${p} + ${k}). Eso pasa con dos datos; aquí son ${n - 1} los que ceden ${k} cada uno.`),
        h('extremo-todos-iguales', p, 'Diste el promedio: eso pasaría si todos fueran iguales. Para que uno sea lo más grande posible, los demás deben ser lo más pequeños posible.'),
      ];
      const solucion = [
        ['La suma de todos es ', v('n', n), ' × ', v('p', p), ` = ${S}.`],
        [`Para que uno sea lo más grande posible, los otros ${n - 1} deben quedarse en el mínimo, `, v('m', texto(m)), ` cada uno: suman ${n - 1} × ${m} = ${(n - 1) * m}.`],
        ['Lo que queda es para uno solo: ', `${S} − ${(n - 1) * m} = `, v('x', texto(x)), '.'],
      ];
      return cerrar(rng, semilla, { correcta: x, errores, texto, unidad: colecta ? 'soles' : 'kg', variables, enunciado, pregunta, solucion,
        datos: { tipo: 'extremo', sub, contexto: colecta ? 'colecta' : 'sacos', n, p, m } });
    }
    if (sub === 'distintos') {
      const notas = rng.moneda();
      const n = rng.entero(4, 6);
      const m = notas ? rng.entero(8, 13) : rng.entero(3, 10);
      const low = (n - 1) * m + (n - 1) * (n - 2) / 2;
      const tope = notas ? 20 : 30;
      const x = rng.entero(m + n + 1, tope);
      const S = low + x, p = S / n;
      if (!corto(p) || x > tope) return null;
      const texto = y => `${f(y)}${notas ? '' : ' años'}`;
      const variables = { n: { nombre: notas ? 'número de alumnos' : 'número de primos', color: 'o' }, p: { nombre: 'promedio', color: 'i' },
        m: { nombre: 'mínimo', color: 'd' }, x: { nombre: 'mayor valor posible', color: 'h' } };
      const enunciado = notas
        ? [v('n', `${n} alumnos`), ' de un taller de oratoria obtuvieron notas enteras, todas diferentes, con un promedio de ', v('p', f(p)), '. Ninguno sacó menos de ', v('m', m), '.']
        : ['Los ', v('n', `${n} primos`), ' de Micaela tienen edades enteras, todas diferentes, y su promedio es ', v('p', `${f(p)} años`), '. Ninguno tiene menos de ', v('m', `${m} años`), '.'];
      const pregunta = notas ? ['¿Cuál es la ', v('x', 'mayor nota posible'), ' de uno de ellos?'] : ['¿Cuál es la ', v('x', 'mayor edad posible'), ' de uno de ellos?'];
      const menores = Array.from({ length: n - 1 }, (_, i) => m + i);
      const errores = [
        h('distintos-olvida-distintos', S - (n - 1) * m, `Dejaste a los otros ${n - 1} en ${m}, pero los valores son todos diferentes: los más pequeños posibles son ${lista(menores)}.`),
        h('distintos-desde-m-mas-1', S - ((n - 1) * m + (n - 1) * n / 2), `Empezaste los otros en ${m + 1}. El menor de ellos puede ser justo ${m}: los más pequeños posibles son ${lista(menores)}.`),
        h('distintos-cuenta-n', S - (n * m + n * (n - 1) / 2), `Restaste ${n} valores distintos desde ${m}, contando también al que quieres hacer grande. Solo son ${n - 1} los otros.`),
        h('extremo-todos-iguales', p, 'Diste el promedio: eso pasaría si todos fueran iguales, y además aquí son diferentes. Para que uno sea lo más grande posible, los demás deben ser lo más pequeños posible.'),
      ];
      const solucion = [
        ['La suma de todos es ', v('n', n), ' × ', v('p', f(p)), ` = ${S}.`],
        [`Para que uno sea lo más grande posible, los otros ${n - 1} deben ser lo más pequeños posible, pero diferentes entre sí y desde `, v('m', m), `: ${lista(menores)}, que suman ${low}.`],
        ['Al mayor le queda ', `${S} − ${low} = `, v('x', texto(x)), `, que es mayor que todos los otros: la lista sirve.`],
      ];
      return cerrar(rng, semilla, { correcta: x, errores, texto, variables, enunciado, pregunta, solucion,
        datos: { tipo: 'extremo', sub, contexto: notas ? 'notas' : 'edades', n, p, m, tope } });
    }
    // tope: la menor nota posible si ninguna pasa de M
    const n = rng.entero(4, 8), M = rng.elegir([17, 18, 19, 20]), d = rng.entero(1, 3);
    const p = M - d, S = n * p, x = S - (n - 1) * M;
    if (x < 2 || x > 14) return null;
    const nombre = rng.elegir(['Rosa', 'Yaneth', 'Wilber', 'Fidel', 'Nayeli']);
    const texto = y => f(y);
    const variables = { n: { nombre: 'número de prácticas', color: 'o' }, p: { nombre: 'promedio', color: 'i' },
      m: { nombre: 'nota más alta', color: 'd' }, x: { nombre: 'menor nota posible', color: 'h' } };
    const enunciado = [`${nombre} rindió `, v('n', `${n} prácticas`), ' (calificadas de 0 a 20) y su promedio es ', v('p', p), '. En ninguna sacó más de ', v('m', M), '.'];
    const pregunta = ['¿Cuál es la ', v('x', 'menor nota posible'), ` que pudo sacar ${nombre} en alguna práctica?`];
    const errores = [
      h('extremo-cuenta-uno-menos', S - (n - 2) * M, `Dejaste en ${M} a ${n - 2} prácticas, pero las otras son ${n - 1}: todas deben estar en ${M} para que una quede lo más baja posible.`),
      h('extremo-cuenta-uno-mas', p - n * d, `Compensaste ${n} prácticas, pero la que buscas no compensa a nadie: solo las otras ${n - 1} están ${d} sobre el promedio.`),
      h('extremo-simetrico', 2 * p - M, `Supusiste que la nota más baja queda tan abajo del promedio como ${M} queda arriba. Eso pasa con dos notas; aquí son ${n - 1} las que suben ${d} cada una.`),
      h('extremo-todos-iguales', p, 'Diste el promedio: eso pasaría si todas las notas fueran iguales. Para que una sea lo más baja posible, las demás deben ser lo más altas posible.'),
    ];
    const solucion = [
      ['La suma de las notas es ', v('n', n), ' × ', v('p', p), ` = ${S}.`],
      [`Para que una nota sea lo más baja posible, las otras ${n - 1} deben ser lo más altas posible: `, v('m', M), ` cada una, que suman ${(n - 1) * M}.`],
      ['La que queda: ', `${S} − ${(n - 1) * M} = `, v('x', texto(x)), '.'],
    ];
    return cerrar(rng, semilla, { correcta: x, errores, texto, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'extremo', sub, n, p, M } });
  }

  // ======================= central =======================
  const CONTEXTOS_CENTRAL = [
    { txt: n => ['Estos son los minutos que tardaron ', v('n', `${n} alumnos`), ' en llegar al colegio una mañana:'], lo: 8, hi: 40 },
    { txt: n => ['Estos son los pasajeros que subieron a una combi de Juliaca en ', v('n', `${n} viajes`), ':'], lo: 5, hi: 25 },
    { txt: n => ['Estos son los kilos de papa que vendió un puesto del mercado en ', v('n', `${n} días`), ':'], lo: 12, hi: 45 },
  ];
  function datosSueltos(rng) {
    const n = rng.elegir([7, 8, 9, 10]);
    const ctx = rng.elegir(CONTEXTOS_CENTRAL);
    const r = rng.elegir([2, 3]);
    const mo = rng.entero(ctx.lo, ctx.hi);
    const usados = new Set([mo]); const datos = Array(r).fill(mo);
    while (datos.length < n) { const x = rng.entero(ctx.lo, ctx.hi); if (!usados.has(x)) { usados.add(x); datos.push(x); } }
    const sueltos = rng.barajar(datos);
    return { n, ctx, r, mo, sueltos, s: ordenar(sueltos) };
  }
  const centralSinOrdenar = xs => { const n = xs.length; return n % 2 ? xs[(n - 1) / 2] : (xs[n / 2 - 1] + xs[n / 2]) / 2; };

  function textoOrden(t) {
    const items = [['x̄', t.media], ['Me', t.mediana], ['Mo', t.moda]].sort((a, b) => a[1] - b[1]);
    let s = items[0][0];
    for (let i = 1; i < 3; i++) s += (Math.abs(items[i][1] - items[i - 1][1]) < 1e-9 ? ' = ' : ' < ') + items[i][0];
    return { clave: 'ord:' + s, texto: s };
  }

  function central(rng, semilla, sub) {
    const { n, ctx, r, mo, sueltos, s } = datosSueltos(rng);
    const S = suma(s), media = S / n, Me = mediana(s), sinOrd = centralSinOrdenar(sueltos);
    if (Math.abs(sinOrd - Me) < 1e-9) return null;
    const par = n % 2 === 0;
    const c1 = par ? s[n / 2 - 1] : null, c2 = par ? s[n / 2] : null;
    const variables = { n: { nombre: 'número de datos', color: 'o' }, me: { nombre: 'mediana', color: 'h' },
      mo: { nombre: 'moda', color: 'd' }, x: { nombre: 'media', color: 'i' } };
    const enunciado = [...ctx.txt(n), ` ${lista(sueltos)}.`];
    const centrales = par ? `los centrales son el ${ord(n / 2)} y el ${ord(n / 2 + 1)}` : `el central es el ${ord((n + 1) / 2)}`;
    const pasoOrden = ['Ordenados de menor a mayor: ', lista(s), `. Con ${n} datos, ${centrales}.`];
    const pasoMe = par
      ? [v('me', 'Me'), ` = (${c1} + ${c2})/2 = `, v('me', f(Me)), '.']
      : [v('me', 'Me'), ' = ', v('me', f(Me)), '.'];
    if (sub === 'mediana') {
      const pregunta = ['¿Cuál es la ', v('me', 'mediana'), ' de estos datos?'];
      const errores = [
        h('mediana-sin-ordenar', sinOrd, `Tomaste ${par ? 'los datos del medio' : 'el dato del medio'} tal como ${par ? 'están' : 'está'} en la lista, sin ordenar. La mediana es el central de los datos ordenados de menor a mayor.`),
        ...(par ? [
          h('mediana-un-central', c1, `Con ${n} datos (número par) hay dos centrales, ${c1} y ${c2}; tomaste solo el primero. La mediana es su semisuma.`),
          h('mediana-un-central', c2, `Con ${n} datos (número par) hay dos centrales, ${c1} y ${c2}; tomaste solo el segundo. La mediana es su semisuma.`),
        ] : []),
        h('mediana-es-la-posicion', (n + 1) / 2, `${f((n + 1) / 2)} es la posición del centro en la lista ordenada, (n + 1)/2, no el valor del dato que está ahí.`),
        h('mediana-es-la-moda', mo, `${mo} es la moda, el dato que más se repite. La mediana es el dato del centro de la lista ordenada.`),
        h('mediana-mitad-del-rango', (s[0] + s[n - 1]) / 2, `Promediaste el menor y el mayor (${s[0]} y ${s[n - 1]}). La mediana es el dato del centro de la lista ordenada, no la mitad del recorrido.`),
        h('mediana-es-la-media', media, 'Esa es la media: la suma entre el número de datos. La mediana es el dato del centro de la lista ordenada.'),
      ];
      const solucion = [pasoOrden, pasoMe];
      return cerrar(rng, semilla, { correcta: Me, errores, texto: y => f(y), variables, enunciado, pregunta, solucion,
        datos: { tipo: 'central', sub, datos: sueltos } });
    }
    // orden: las tres deben ser distintas en la respuesta correcta
    if (Math.abs(media - Me) < 1e-9 || Math.abs(media - mo) < 1e-9 || Me === mo) return null;
    const correcta = textoOrden({ media, mediana: Me, moda: mo });
    const pregunta = ['Si ', v('x', 'x̄'), ' es la media, ', v('me', 'Me'), ' la mediana y ', v('mo', 'Mo'), ' la moda de estos datos, ¿qué relación es correcta?'];
    const conError = (id, t, explicacion) => { const o = textoOrden(t); return { id, clave: o.clave, texto: o.texto, explicacion, respaldo: 'hipotesis', fuente: null }; };
    const errores = [
      conError('mediana-sin-ordenar', { media, mediana: sinOrd, moda: mo }, `Tomaste como mediana ${f(sinOrd)}, el centro de la lista sin ordenar. Primero se ordena: la mediana es ${f(Me)}.`),
      ...(par ? [conError('mediana-un-central', { media, mediana: c1, moda: mo }, `Tomaste como mediana solo uno de los dos centrales (${c1}). Con ${n} datos es la semisuma de ${c1} y ${c2}: ${f(Me)}.`),
        conError('mediana-un-central', { media, mediana: c2, moda: mo }, `Tomaste como mediana solo uno de los dos centrales (${c2}). Con ${n} datos es la semisuma de ${c1} y ${c2}: ${f(Me)}.`)] : []),
      conError('moda-es-la-frecuencia', { media, mediana: Me, moda: r }, `Tomaste como moda ${r}, las veces que se repite el dato más frecuente. La moda es el dato que más se repite: ${mo}.`),
      conError('media-entre-n-menos-1', { media: S / (n - 1), mediana: Me, moda: mo }, `Dividiste la suma (${S}) entre ${n - 1}. Son ${n} datos: la media es ${S}/${n} ${igualA(media)}.`),
      conError('mediana-mitad-del-rango', { media, mediana: (s[0] + s[n - 1]) / 2, moda: mo }, `Tomaste como mediana la mitad entre el menor y el mayor, ${f((s[0] + s[n - 1]) / 2)}. La mediana es el centro de la lista ordenada: ${f(Me)}.`),
    ];
    const solucion = [
      pasoOrden, pasoMe,
      [v('mo', 'Mo'), ' = ', v('mo', mo), `, que se repite ${r} veces (los demás, una sola vez).`],
      [v('x', 'x̄'), ` = ${S}/${n} `, v('x', igualA(media)), '.'],
      [`Entonces: ${correcta.texto}.`],
    ];
    return cerrar(rng, semilla, { textual: true, correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'central', sub, datos: sueltos } });
  }

  // ======================= reconstruir =======================
  const CONTEXTOS_REC = [
    { cinco: 'Durante cinco días, Ruth anotó cuántas decenas de panes vendió su bodega por la tarde', seis: 'Durante seis días, Ruth anotó cuántas decenas de panes vendió su bodega por la tarde', unidad: '' },
    { cinco: 'Una librería de Puno anotó cuántos cuadernos vendió en cinco días', seis: 'Una librería de Puno anotó cuántos cuadernos vendió en seis días', unidad: '' },
    { cinco: 'Se contaron los pasajeros de cinco viajes de una combi', seis: 'Se contaron los pasajeros de seis viajes de una combi', unidad: '' },
  ];
  const NOMBRE_Q = { mayor: 'el mayor de los datos', rango: 'el rango (el mayor menos el menor)', extremos: 'la suma del menor y el mayor de los datos' };
  const valorQ = (q, L) => q === 'mayor' ? L[L.length - 1] : q === 'rango' ? L[L.length - 1] - L[0] : L[0] + L[L.length - 1];

  function recCinco(rng, semilla) {
    const ctx = rng.elegir(CONTEXTOS_REC);
    const Me = rng.entero(5, 12);
    const abajo = rng.moneda();                // la moda está antes de la mediana
    const conocido = rng.moneda();
    let L, m;
    if (abajo) {
      m = rng.entero(1, Me - 1);
      const d = conocido ? rng.entero(Me + 1, Me + 5) : Me + 1;
      const e = conocido ? rng.entero(d + 1, d + 6) : Me + 2;
      L = [m, m, Me, d, e];
    } else {
      m = rng.entero(Me + 1, Me + 6);
      const a = conocido ? rng.entero(1, Me - 2) : Me - 2;
      const b = conocido ? rng.entero(a + 1, Me - 1) : Me - 1;
      if (a < 1) return null;
      L = [a, b, Me, m, m];
    }
    const S = suma(L), media = S / 5;
    if (!modaUnica(L, m)) return null;
    // El dato conocido: uno de los dos libres (no la moda ni la mediana).
    const libres = abajo ? [3, 4] : [0, 1];
    const iK = conocido ? rng.elegir(libres) : null, k = conocido ? L[iK] : null;
    const cond = xs => modaUnica(xs, m) && (k === null || xs.includes(k));
    const sols = listas(5, S, 2 * Me, cond);
    if (sols.length !== 1) return null;
    const q = rng.elegir(['mayor', 'mayor', 'rango', 'extremos']);
    const Q = valorQ(q, L);
    const variables = { x: { nombre: 'media', color: 'i' }, me: { nombre: 'mediana', color: 'o' }, mo: { nombre: 'moda', color: 'd' }, q: { nombre: 'lo que se pide', color: 'h' } };
    const enunciado = [`${ctx.cinco}. Los cinco números son enteros positivos; su media es `, v('x', exacto(media)), ', su mediana es ', v('me', Me),
      ' y tienen una sola moda, ', v('mo', m), '.', ...(conocido ? [` Uno de los números es ${k}.`] : [])];
    const pregunta = ['¿Cuál es ', v('q', NOMBRE_Q[q]), '?'];
    // Errores: el libre que se calcula al final es el que absorbe una suma mal tomada.
    const iLibre = conocido ? libres.find(i => i !== iK) : (abajo ? 4 : 0);
    const conSuma = S2 => { const L2 = L.slice(); L2[iLibre] += S2 - S; return valorQ(q, L2); };
    const errores = [];
    if (conocido && iK !== 4) {
      errores.push(h('dato-conocido-es-el-mayor', valorQ(q, [L[0], k]), `Supusiste que ${k} es el mayor de los números. Nada lo dice: ${k} es uno de los datos y su lugar sale de la mediana y la moda.`));
    }
    if (Number.isInteger(4 * media)) errores.push(h('suma-con-un-dato-menos', conSuma(4 * media), `Tomaste la suma como 4 × ${exacto(media)}. Son cinco datos: la suma es 5 × ${exacto(media)} = ${S}.`));
    if (Me !== media) errores.push(h('suma-con-la-mediana', conSuma(5 * Me), `Tomaste la suma como 5 × ${Me}, con la mediana. La suma sale de la media: 5 × ${exacto(media)} = ${S}.`));
    const otros = { mayor: ['rango', 'extremos'], rango: ['mayor', 'extremos'], extremos: ['mayor', 'rango'] }[q];
    for (const o of otros) errores.push(h(`da-${o}-en-vez-de-${q}`, valorQ(o, L), `Hallaste bien los datos, pero ese valor es ${NOMBRE_Q[o]}. Se pide ${NOMBRE_Q[q]}.`));
    const R = abajo ? S - 2 * m - Me : S - Me - 2 * m;
    const pasos = [
      ['Ordena los cinco números: a ≤ b ≤ c ≤ d ≤ e. La mediana es el del centro: c = ', v('me', Me), '. La suma es 5 × ', v('x', exacto(media)), ` = ${S}.`],
    ];
    if (abajo) {
      pasos.push(['La moda ', v('mo', m), ' es menor que la mediana, así que sus repeticiones van antes del centro: a = b = ', v('mo', m), `. Los otros dos son mayores que ${Me} y distintos (si no, habría otra moda): ${Me} < d < e, con d + e = ${S} − ${2 * m} − ${Me} = ${R}.`]);
    } else {
      pasos.push(['La moda ', v('mo', m), ' es mayor que la mediana, así que sus repeticiones van después del centro: d = e = ', v('mo', m), `. Los otros dos son menores que ${Me} y distintos (si no, habría otra moda): a < b < ${Me}, con a + b = ${S} − ${Me} − ${2 * m} = ${R}.`]);
    }
    if (!conocido) {
      pasos.push([abajo ? `Lo menos que pueden sumar d y e es ${Me + 1} + ${Me + 2} = ${R}: la única opción es d = ${Me + 1} y e = ${Me + 2}.`
        : `Lo más que pueden sumar a y b es ${Me - 2} + ${Me - 1} = ${R}: la única opción es a = ${Me - 2} y b = ${Me - 1}.`]);
    } else {
      const [p1, p2] = abajo ? ['d', 'e'] : ['a', 'b'];
      const otro = R - k, esPrimero = iK === libres[0];
      const malo = esPrimero ? `si ${k} fuera ${p2}, ${p1} valdría ${otro}, y no se cumpliría ${abajo ? `${Me} < d < e` : `a < b < ${Me}`}` : `si ${k} fuera ${p1}, ${p2} valdría ${otro}, y no se cumpliría ${abajo ? `${Me} < d < e` : `a < b < ${Me}`}`;
      pasos.push([`El ${k} tiene que ser ${p1} o ${p2}: ${malo}. Así que ${esPrimero ? p1 : p2} = ${k} y ${esPrimero ? p2 : p1} = ${otro}.`]);
    }
    pasos.push(['Los números son ', lista(L), '. Se pide ', NOMBRE_Q[q], ': ', v('q', f(Q)), '.']);
    return cerrar(rng, semilla, { correcta: Q, errores, texto: y => f(y), variables, enunciado, pregunta, solucion: pasos,
      datos: { tipo: 'reconstruir', sub: 'cinco', media, mediana: Me, moda: m, conocido: k, pide: q } });
  }

  const NOMBRE_SEIS = { 'max-mayor': 'el mayor valor posible del mayor de los números', 'min-mayor': 'el menor valor posible del mayor de los números' };
  function extremoSeis(pide, sols) {
    if (!sols.length) return null;
    const vals = sols.map(L => L[5]);
    return pide === 'max-mayor' ? Math.max(...vals) : Math.min(...vals);
  }
  function recSeis(rng, semilla) {
    const ctx = rng.elegir(CONTEXTOS_REC);
    // Una lista de partida: seis enteros con una moda que se repite dos veces.
    const base = Array.from({ length: 6 }, () => rng.entero(2, 18));
    const L0 = ordenar(base);
    const M0 = modas(L0);
    if (M0.valores.length !== 1 || M0.frecuencia !== 2) return null;
    const m = M0.valores[0], S = suma(L0), Me2 = L0[2] + L0[3], Me = Me2 / 2, media = S / 6;
    if (!corto(media) || S % 3 !== 0) return null;
    const cond = xs => modaUnica(xs, m);
    const sols = listas(6, S, Me2, cond);
    if (sols.length < 2 || sols.length > 400) return null;
    const pide = rng.elegir(['max-mayor', 'min-mayor']);
    const Q = extremoSeis(pide, sols);
    const optima = sols.find(L => L[5] === Q);
    const variables = { x: { nombre: 'media', color: 'i' }, me: { nombre: 'mediana', color: 'o' }, mo: { nombre: 'moda', color: 'd' }, q: { nombre: 'lo que se pide', color: 'h' } };
    const enunciado = [`${ctx.seis}. Los seis números son enteros positivos; su media es `, v('x', exacto(media)), ', su mediana es ', v('me', f(Me)),
      ' y tienen una sola moda, ', v('mo', m), '.'];
    const pregunta = ['¿Cuál es ', v('q', NOMBRE_SEIS[pide]), '?'];
    const errores = [];
    const otra = pide === 'max-mayor' ? 'min-mayor' : 'max-mayor';
    errores.push(h('extremo-al-reves', extremoSeis(otra, sols), `Ese es ${NOMBRE_SEIS[otra]}. Se pide ${NOMBRE_SEIS[pide]}.`));
    errores.push(h('olvida-moda-unica', extremoSeis(pide, listas(6, S, Me2, xs => modaEntre(xs, m))), `Con ese valor la lista tendría otra moda empatada con ${m}. El enunciado dice que hay una sola moda.`));
    if (Number.isInteger(Me)) errores.push(h('mediana-un-central', extremoSeis(pide, listas(6, S, Me2, cond, 'un-central')), `Pusiste el tercer dato igual a ${f(Me)}, como si hubiera un solo central. Con seis datos la mediana es la semisuma del 3.° y el 4.°: c + d = ${Me2}.`));
    if (Number.isInteger(5 * media)) errores.push(h('suma-con-un-dato-menos', extremoSeis(pide, listas(6, 5 * media, Me2, cond)), `Tomaste la suma como 5 × ${exacto(media)}. Son seis datos: la suma es 6 × ${exacto(media)} = ${S}.`));
    if (Number.isInteger(6 * Me) && Me !== media) errores.push(h('suma-con-la-mediana', extremoSeis(pide, listas(6, 6 * Me, Me2, cond)), `Tomaste la suma como 6 × ${f(Me)}, con la mediana. La suma sale de la media: 6 × ${exacto(media)} = ${S}.`));
    const meta = pide === 'max-mayor' ? 'lo más grande posible, los otros deben ser lo más pequeños que permitan la mediana y la moda'
      : 'lo más pequeño posible, los datos deben estar lo más parejos que permitan la mediana y la moda';
    const QQ = pide === 'max-mayor' ? Q + 1 : Q - 1;
    const solucion = [
      ['Ordena: a ≤ b ≤ c ≤ d ≤ e ≤ f. Con seis datos, la mediana es la semisuma del 3.° y el 4.°: c + d = 2 × ', v('me', f(Me)), ` = ${Me2}. La suma es 6 × `, v('x', exacto(media)), ` = ${S}.`],
      ['La moda ', v('mo', m), ' tiene que repetirse más veces que cualquier otro número.'],
      [`Para que f sea ${meta}. La mejor lista es `, lista(optima), `: su mediana es (${optima[2]} + ${optima[3]})/2 = ${f(Me)}, suma ${S} y su única moda es ${m}.`],
      [`Con f = ${QQ} ya no hay ninguna lista que cumpla las tres condiciones. Respuesta: `, v('q', f(Q)), '.'],
    ];
    return cerrar(rng, semilla, { correcta: Q, errores, texto: y => f(y), variables, enunciado, pregunta, solucion,
      datos: { tipo: 'reconstruir', sub: 'seis', media, mediana: Me, moda: m, pide } });
  }

  function recIncognitas(rng, semilla) {
    const n = rng.elegir([6, 6, 7]);
    // Lista estrictamente creciente.
    const L = []; let x0 = rng.entero(2, 6);
    for (let i = 0; i < n; i++) { L.push(x0); x0 += rng.entero(1, 5); }
    const iX = n === 6 ? 2 : 3;
    const iY = rng.elegir(n === 6 ? [0, 1, 4, 5] : [0, 1, 2, 4, 5, 6]);
    const S = suma(L), media = S / n, Me = mediana(L);
    if (!corto(media) || (n === 7 && !Number.isInteger(media))) return null;
    const xv = L[iX], yv = L[iY];
    const pide = iY > iX ? rng.elegir(['y', 'dif']) : 'y';
    const Q = pide === 'y' ? yv : yv - xv;
    const variables = { x: { nombre: 'media', color: 'i' }, me: { nombre: 'mediana', color: 'o' }, u: { nombre: 'x', color: 'd' }, q: { nombre: pide === 'y' ? 'y' : 'y − x', color: 'h' } };
    const vista = L.map((t, i) => i === iX ? 'x' : i === iY ? 'y' : f(t)).join('; ');
    const enunciado = [`Los ${n} datos de una encuesta, ordenados de menor a mayor, son: ${vista}. Su media es `, v('x', exacto(media)), ' y su mediana es ', v('me', f(Me)), '.'];
    const pregunta = ['¿Cuál es el valor de ', v('q', pide === 'y' ? 'y' : 'y − x'), '?'];
    const conocidos = S - xv - yv;
    const resp = (x, y) => pide === 'y' ? y : y - x;
    const errores = [];
    if (n === 6) {
      const x2 = Me, y2 = S - conocidos - x2;
      errores.push(h('mediana-un-central', resp(x2, y2), `Pusiste x = ${f(Me)}, como si la mediana fuera un solo dato. Con seis datos es la semisuma del 3.° y el 4.°: (x + ${L[3]})/2 = ${f(Me)}.`));
    }
    errores.push(h('suma-con-un-dato-menos', resp(xv, (n - 1) * media - conocidos - xv), `Tomaste la suma como ${n - 1} × ${exacto(media)}. Son ${n} datos: la suma es ${n} × ${exacto(media)} = ${S}.`));
    if (Me !== media && Number.isInteger(n * Me)) errores.push(h('suma-con-la-mediana', resp(xv, n * Me - conocidos - xv), `Tomaste la suma como ${n} × ${f(Me)}, con la mediana. La suma sale de la media: ${n} × ${exacto(media)} = ${S}.`));
    if (pide === 'y') errores.push(h('da-x-en-vez-de-y', xv, `Ese es el valor de x. Se pide y.`));
    else { errores.push(h('suma-en-vez-de-diferencia', xv + yv, `Ese es x + y. Se pide y − x.`)); errores.push(h('da-y-en-vez-de-diferencia', yv, `Ese es el valor de y. Se pide y − x.`)); }
    const solucion = [
      n === 6 ? ['Con seis datos, la mediana es la semisuma del 3.° y el 4.°: (x + ', `${L[3]})/2 = `, v('me', f(Me)), `, así que x = ${2 * Me} − ${L[3]} = `, v('u', xv), '.']
        : ['Con siete datos, la mediana es el 4.°, que es x: x = ', v('me', f(Me)), ' = ', v('u', xv), '.'],
      ['La suma de los datos es ', n, ' × ', v('x', exacto(media)), ` = ${S}. Los conocidos y x suman ${conocidos + xv}, así que y = ${S} − ${conocidos + xv} = ${yv}.`],
      ...(pide === 'y' ? [['Respuesta: ', v('q', `y = ${yv}`), '.']] : [['Entonces ', v('q', 'y − x'), ` = ${yv} − ${xv} = `, v('q', f(Q)), '.']]),
    ];
    return cerrar(rng, semilla, { correcta: Q, errores, texto: y => f(y), variables, enunciado, pregunta, solucion,
      datos: { tipo: 'reconstruir', sub: 'incognitas', vista, media, mediana: Me, pide } });
  }

  // ======================= varianza =======================
  function varianza(rng, semilla, sub) {
    const ctx = rng.elegir(['puntajes', 'temperaturas', 'sueldos']);
    let mu, a, b, sigma, unidad, unidad2, intro, cambio;
    if (ctx === 'puntajes') {
      mu = rng.entero(10, 16); a = rng.elegir([2, 3, 4]); b = rng.elegir([-5, -4, -3, -2, 2, 3, 4, 5]);
      sigma = rng.elegir([1, 1.5, 2, 2.5, 3]); unidad = 'puntos'; unidad2 = 'puntos²';
      intro = 'Los puntajes de los participantes de un concurso de matemática tienen';
      cambio = `Para pasarlos a otra escala, cada puntaje se multiplica por ${a} y luego se le ${b > 0 ? 'suma' : 'resta'} ${Math.abs(b)}.`;
    } else if (ctx === 'temperaturas') {
      mu = rng.entero(8, 18); a = 1.8; b = 32; sigma = rng.elegir([1, 2, 2.5, 3, 5]); unidad = '°F'; unidad2 = '(°F)²';
      intro = 'Las temperaturas máximas de un mes en Arequipa, en grados Celsius, tienen';
      cambio = 'Se pasan todas a grados Fahrenheit con F = 1,8·C + 32.';
    } else {
      mu = 100 * rng.entero(12, 20); a = rng.elegir([1.1, 1.2, 1.5]); b = rng.elegir([50, 100, -50, -100]);
      sigma = rng.elegir([100, 120, 150, 200]); unidad = 'soles'; unidad2 = 'soles²';
      intro = 'Los sueldos de los trabajadores de una empresa tienen';
      cambio = `A cada sueldo se le aplica un reajuste: se multiplica por ${f(a)} y luego se le ${b > 0 ? 'suma' : 'resta'} S/ ${Math.abs(b)}.`;
    }
    if (ctx === 'sueldos' && (sub === 'var' || sub === 'var-a-desv')) return null;
    const V = sigma * sigma;
    if (sub === 'var-a-desv' && !Number.isInteger(V)) return null;
    const signoB = b > 0 ? `+ ${f(b)}` : `− ${f(-b)}`;
    const daVar = sub === 'var' || sub === 'var-a-desv';
    const variables = { x: { nombre: sub === 'media' ? 'media original' : (daVar ? 'varianza original' : 'desviación estándar original'), color: 'o' }, a: { nombre: 'factor', color: 'i' }, b: { nombre: 'constante', color: 'd' }, y: { nombre: 'resultado pedido', color: 'h' } };
    const dadoMedia = ctx === 'sueldos' ? `S/ ${f(mu)}` : ctx === 'temperaturas' ? `${mu} °C` : `${mu} puntos`;
    const dadoDesv = ctx === 'sueldos' ? `S/ ${f(sigma)}` : ctx === 'temperaturas' ? `${f(sigma)} °C` : `${f(sigma)} puntos`;
    const dadoVar = ctx === 'temperaturas' ? `${f(V)} (°C)²` : `${f(V)} puntos²`;
    const enunciado = [`${intro} media `, sub === 'media' ? v('x', dadoMedia) : dadoMedia, ' y ', daVar ? 'varianza ' : 'desviación estándar ', sub === 'media' ? (daVar ? dadoVar : dadoDesv) : v('x', daVar ? dadoVar : dadoDesv), '. ', cambio];
    const regla = ['Con Y = ', v('a', f(a)), '·X ', v('b', signoB), ': la constante ', v('b', signoB), ' corre todos los datos por igual y no cambia la dispersión; el factor ', v('a', f(a)), ' estira las distancias a la media.'];
    let correcta, errores, pregunta, solucion, texto;
    if (sub === 'var') {
      correcta = a * a * V; texto = y => `${f(y)} ${unidad2}`;
      pregunta = ['¿Cuál es la ', v('y', 'varianza'), ' de los nuevos datos?'];
      errores = [
        h('varianza-por-k', a * V, `Multiplicaste la varianza por ${f(a)}. La varianza promedia distancias al cuadrado: si cada distancia se multiplica por ${f(a)}, la varianza se multiplica por ${f(a)}² = ${f(a * a)}.`),
        h('varianza-cambia-con-constante', a * a * V + b, `Le ${b > 0 ? 'sumaste' : 'restaste'} ${f(Math.abs(b))} a la varianza. Esa constante mueve todos los datos por igual: las distancias a la media no cambian.`),
        h('varianza-por-k-y-constante', a * V + b, `Trataste la varianza como si fuera un dato: la multiplicaste por ${f(a)} y le ${b > 0 ? 'sumaste' : 'restaste'} ${f(Math.abs(b))}. La constante no la cambia y el factor entra al cuadrado.`),
        h('varianza-con-b-cuadrado', a * a * V + b * b, `Sumaste ${f(Math.abs(b))}² a la varianza. La constante no cambia las distancias a la media, ni elevada al cuadrado.`),
        h('varianza-no-cambia', V, `Dejaste la varianza igual. Sumar o restar una constante no la cambia, pero multiplicar por ${f(a)} sí estira los datos.`),
      ];
      solucion = [regla, [v('y', 'Var(Y)'), ' = ', v('a', f(a)), '² × ', v('x', f(V)), ` = ${f(a * a)} × ${f(V)} = `, v('y', texto(correcta)), '.']];
    } else if (sub === 'desv' || sub === 'var-a-desv') {
      correcta = a * sigma; texto = y => ctx === 'sueldos' ? `S/ ${f(y)}` : `${f(y)} ${unidad}`;
      pregunta = ['¿Cuál es la ', v('y', 'desviación estándar'), ' de los nuevos datos?'];
      errores = [
        h('desviacion-por-k-cuadrado', a * a * sigma, `Multiplicaste la desviación estándar por ${f(a)}² = ${f(a * a)}. El cuadrado va en la varianza; la desviación estándar es su raíz y se multiplica por ${f(a)}.`),
        h('desviacion-cambia-con-constante', a * sigma + b, `Le ${b > 0 ? 'sumaste' : 'restaste'} ${f(Math.abs(b))} a la desviación estándar. Esa constante mueve todos los datos por igual: la dispersión no cambia.`),
        h('desviacion-no-cambia', sigma, `Dejaste la desviación estándar igual. La constante no la cambia, pero multiplicar por ${f(a)} sí separa los datos.`),
        h('desviacion-es-la-varianza', a * a * V, `Ese valor es la varianza nueva (${f(a)}² × ${f(V)}). Se pide la desviación estándar, que es su raíz.`),
      ];
      if (sub === 'var-a-desv') errores.push(h('varianza-por-k', a * V, `Multiplicaste la varianza por ${f(a)} y no sacaste la raíz. La desviación estándar es √${f(V)} = ${f(sigma)}, y se multiplica por ${f(a)}.`));
      solucion = [
        ...(sub === 'var-a-desv' ? [['La desviación estándar original es √', v('x', f(V)), ` = ${f(sigma)}.`]] : []),
        regla,
        [v('y', 'σ(Y)'), ' = ', v('a', f(a)), ` × ${f(sigma)} = `, v('y', texto(correcta)), '.'],
      ];
    } else {
      correcta = a * mu + b; texto = y => ctx === 'sueldos' ? `S/ ${f(y)}` : `${f(y)} ${ctx === 'temperaturas' ? '°F' : 'puntos'}`;
      pregunta = ['¿Cuál es la ', v('y', 'media'), ' de los nuevos datos?'];
      errores = [
        h('media-olvida-constante', a * mu, `Solo multiplicaste por ${f(a)}. La media sigue a los datos: también se le ${b > 0 ? 'suma' : 'resta'} ${f(Math.abs(b))}.`),
        h('media-constante-antes', a * (mu + b), `${b > 0 ? 'Sumaste' : 'Restaste'} la constante antes de multiplicar. El orden es el del enunciado: primero por ${f(a)} y después ${signoB}.`),
        h('media-solo-constante', mu + b, `Solo ${b > 0 ? 'sumaste' : 'restaste'} la constante. Cada dato también se multiplica por ${f(a)}, y la media con ellos.`),
        h('media-signo-constante', a * mu - b, `Cambiaste el signo de la constante: el enunciado dice que se ${b > 0 ? 'suma' : 'resta'}.`),
      ];
      solucion = [
        ['Si cada dato se transforma con Y = ', v('a', f(a)), '·X ', v('b', signoB), ', la media se transforma igual.'],
        [v('y', 'Media(Y)'), ' = ', v('a', f(a)), ' × ', v('x', f(mu)), ' ', v('b', signoB), ' = ', v('y', texto(correcta)), '.'],
      ];
    }
    return cerrar(rng, semilla, { correcta, errores, texto, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'varianza', sub, contexto: ctx, media: mu, desviacion: sigma, a, b } });
  }

  // ======================= medias =======================
  function parejaMedias(rng) {
    // p = k·s², q = k·t²: su producto es un cuadrado; p + q par para que la MA sea entera.
    const k = rng.elegir([1, 2, 3, 5, 6]), s = rng.entero(1, 4), t = rng.entero(s + 1, 7);
    const p = k * s * s, q = k * t * t;
    if ((p + q) % 2 || q > 100) return null;
    return { p, q, A: (p + q) / 2, G: k * s * t };
  }
  function medias(rng, semilla, sub) {
    const par = parejaMedias(rng); if (!par) return null;
    const { p, q, A, G } = par;
    const variables = { a: { nombre: 'media aritmética', color: 'i' }, g: { nombre: 'media geométrica', color: 'd' }, r: { nombre: 'raíz auxiliar', color: 'o' }, y: { nombre: 'lo que se pide', color: 'h' } };
    const enunciado = ['La media aritmética de dos números enteros positivos es ', v('a', A), ' y su media geométrica es ', v('g', G), '.'];
    if (sub === 'mh') {
      const correcta = G * G / A;
      if (!corto(correcta)) return null;
      const pregunta = ['¿Cuál es su ', v('y', 'media armónica'), '?'];
      const errores = [
        h('mh-invierte', A * A / G, `Calculaste MA²/MG. Es al revés: MH = MG²/MA. Fíjate que la MH no puede ser mayor que la MG (${G}).`),
        h('mh-olvida-el-2', G * G / (2 * A), `Dividiste MG² entre 2·MA. La MH de a y b es 2ab/(a + b); con ab = ${G}² y a + b = 2 × ${A}, el 2 de arriba se cancela con el de abajo: MH = ${G}²/${A}.`),
        h('mh-suma-como-ma', 2 * G * G / A, `Usaste a + b = ${A}. Ese es el promedio; la suma es 2 × ${A} = ${2 * A}.`),
        h('mh-misma-distancia', 2 * G - A, `Supusiste que la MH queda tan debajo de la MG como la MA queda encima. No es así: se cumple MG² = MA·MH.`),
        h('promedio-de-medias', (A + G) / 2, 'Promediaste la MA y la MG. La MH no es un promedio de las otras dos: es menor o igual que la MG, y MG² = MA·MH.'),
      ];
      const solucion = [
        ['Si los números son a y b: a + b = 2 × ', v('a', A), ` = ${2 * A} y ab = `, v('g', G), `² = ${G * G}.`],
        ['La media armónica es 2ab/(a + b) = ', `2 × ${G * G}/${2 * A} = `, v('g', `${G}²`), '/', v('a', A), ' = ', v('y', f(correcta)), '. (Siempre MA ≥ MG ≥ MH.)'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: y => f(y), variables, enunciado, pregunta, solucion,
        datos: { tipo: 'medias', sub, MA: A, MG: G } });
    }
    const pide = rng.elegir(['mayor', 'dif']);
    const raiz = Math.sqrt(A * A - G * G); // = (q − p)/2
    const correcta = pide === 'mayor' ? q : q - p;
    const pregunta = pide === 'mayor' ? ['¿Cuál es el ', v('y', 'mayor de los dos números'), '?'] : ['¿Cuál es la ', v('y', 'diferencia entre los dos números'), '?'];
    const errores = pide === 'mayor' ? [
      h('da-el-menor', p, `Ese es el menor de los dos números. Se pide el mayor.`),
      h('mayor-es-ma-mas-mg', A + G, `Sumaste las dos medias. El mayor es MA + √(MA² − MG²) = ${A} + ${raiz}.`),
      h('mayor-misma-distancia', 2 * A - G, `Supusiste que el mayor está tan arriba de la MA como la MG está abajo. Los números son MA ± √(MA² − MG²).`),
      h('mayor-es-la-ma', A, 'La media aritmética está entre los dos números: es el punto medio, no el mayor.'),
      h('olvida-la-raiz', A + A * A - G * G, `Sumaste MA² − MG² sin sacarle raíz: la mitad de la diferencia es √(${A * A - G * G}) = ${raiz}.`),
    ] : [
      h('olvida-el-2', raiz, `Ese valor, √(MA² − MG²), es la mitad de la diferencia: cada número está a esa distancia de la MA. La diferencia es el doble.`),
      h('diferencia-de-medias', A - G, 'Restaste las dos medias. La diferencia entre los números sale de (a − b)² = (a + b)² − 4ab.'),
      h('diferencia-doble-de-medias', 2 * (A - G), 'Duplicaste la resta de las medias. La diferencia entre los números sale de (a − b)² = (a + b)² − 4ab.'),
      h('olvida-la-raiz', 4 * (A * A - G * G), `Calculaste (a − b)² = ${4 * (A * A - G * G)} y no sacaste la raíz.`),
    ];
    const solucion = [
      ['Si los números son a y b: a + b = 2 × ', v('a', A), ` = ${2 * A} y ab = `, v('g', G), `² = ${G * G}.`],
      [`(a − b)² = (a + b)² − 4ab = ${4 * A * A} − ${4 * G * G} = ${4 * (A * A - G * G)}, así que a − b = `, v('r', 2 * raiz), '.'],
      pide === 'mayor'
        ? ['El mayor es (', `${2 * A} + ${2 * raiz})/2 = `, v('y', f(q)), ` (y el menor, ${p}; comprueba: ${p} × ${q} = ${G * G}).`]
        : ['La diferencia es ', v('y', f(correcta)), ` (los números son ${p} y ${q}).`],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: y => f(y), variables, enunciado, pregunta, solucion,
      datos: { tipo: 'medias', sub, MA: A, MG: G, pide } });
  }

  function ternasDados(k, N) {
    const out = [];
    (function rec(i, min, prod, acc) {
      if (i === k) { if (prod === N) out.push(acc.slice()); return; }
      for (let x = min; x <= 6; x++) if (N % (prod * x) === 0) { acc.push(x); rec(i + 1, x, prod * x, acc); acc.pop(); }
    })(0, 1, 1, []);
    return out;
  }
  function mediasDados(rng, semilla) {
    const k = rng.elegir([3, 3, 4]);
    const base = Array.from({ length: k }, () => rng.entero(1, 6));
    const N = base.reduce((a, b) => a * b, 1);
    const ts = ternasDados(k, N);
    if (ts.length < 3) return null;
    const sumas = [...new Set(ts.map(suma))].sort((a, b) => a - b);
    const minS = sumas[0], maxS = sumas[sumas.length - 1];
    const optima = ts.find(t => suma(t) === minS);
    if (optima.every(x => x === optima[0])) return null; // con todos iguales es solo MA = MG
    const correcta = minS / k;
    const grupo = k === 3 ? 'tres' : 'cuatro';
    const variables = { n: { nombre: 'producto', color: 'd' }, k: { nombre: 'número de dados', color: 'o' }, g: { nombre: 'media geométrica', color: 'i' }, y: { nombre: 'menor media aritmética', color: 'h' } };
    const enunciado = ['Se lanzan ', v('k', `${grupo} dados`), ' comunes (caras del 1 al 6) y el producto de los resultados es ', v('n', N), '.'];
    const pregunta = ['¿Cuál es la ', v('y', 'menor media aritmética posible'), ' de los resultados?'];
    const ver = t => `(${t.join('; ')})`;
    const segunda = ts.filter(t => suma(t) === sumas[1])[0];
    const primera = ts[0];
    const errores = [
      h('mayor-en-vez-de-menor', maxS / k, `Esa es la mayor media posible, con ${ver(ts.find(t => suma(t) === maxS))}. Se pide la menor.`),
      sumas.length > 1 ? h('no-reviso-todas', sumas[1] / k, `${ver(segunda)} tiene producto ${N}, pero ${ver(optima)} tiene números más parejos y suma menos.`) : null,
      suma(primera) !== minS ? h('primera-que-encontro', suma(primera) / k, `Te quedaste con ${ver(primera)}, la primera que encontraste. Hay que revisar todas: ${ver(optima)} suma menos.`) : null,
      h('suma-en-vez-de-media', minS, `${minS} es la menor suma posible. La media aritmética es esa suma entre ${k}.`),
      h('media-entre-k-menos-1', minS / (k - 1), `Dividiste la suma entre ${k - 1}. Son ${k} resultados: se divide entre ${k}.`),
    ];
    const raizTxt = k === 3 ? '∛' : '⁴√';
    const solucion = [
      ['Con el producto fijo, la ', v('g', 'media geométrica'), ' también es fija: ', v('g', `${raizTxt}${N}`), '. Como MA ≥ MG, la MA es menor mientras más parejos sean los números (y no pueden ser todos iguales, porque ', v('n', N), ` no es una potencia ${k === 3 ? 'cúbica' : 'cuarta'} de un número del 1 al 6).`],
      [`Las formas de obtener ${N} con caras del 1 al 6 son: ${ts.map(ver).join(', ')}.`],
      [`La de menor suma es ${ver(optima)}, con suma ${minS}: la menor MA es ${minS}/${k} = `, v('y', fracTxt(correcta)), '.'],
    ];
    const texto = y => fracTxt(y);
    return cerrar(rng, semilla, { correcta, errores: errores.filter(Boolean), texto, fraccion: true, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'medias', sub: 'dados', k, producto: N } });
  }

  // ======================= subconjuntos =======================
  function subconjuntos(rng, semilla, sub) {
    if (sub === 'multiplos') {
      const impares = rng.moneda();
      const k = impares ? 2 : rng.elegir([3, 4, 5, 6, 7, 9]);
      const r = impares ? 1 : 0;
      const A = impares ? 2 * rng.entero(5, 60) : rng.entero(10, 120);
      const B = impares ? A + 2 * rng.entero(8, 60) : A + rng.entero(40, 300);
      if (!impares && (A % k === 0 || B % k === 0)) return null; // así «entre» no es ambiguo
      const fi = A + ((r - A) % k + k) % k, la = B - ((B - r) % k + k) % k;
      const n = (la - fi) / k + 1, Ssum = n * (fi + la) / 2, correcta = (fi + la) / 2;
      if (n < 5) return null;
      const nombre = impares ? 'los números impares' : `los múltiplos de ${k}`;
      const variables = { a: { nombre: 'primero', color: 'o' }, l: { nombre: 'último', color: 'd' }, n: { nombre: 'cantidad de términos', color: 'i' }, y: { nombre: 'promedio', color: 'h' } };
      const enunciado = [`Se consideran ${nombre} comprendidos entre ${A} y ${B}.`];
      const pregunta = ['¿Cuál es su ', v('y', 'promedio'), '?'];
      const errores = [
        h('promedio-de-los-limites', (A + B) / 2, `Promediaste ${A} y ${B}, pero esos no son ${impares ? 'impares' : `múltiplos de ${k}`}. Se promedian el primero y el último de ${nombre} que están entre ellos: ${fi} y ${la}.`),
        h('poste-valla-cuenta-terminos', Ssum / (n - 1), `Contaste ${n - 1} términos con (${la} − ${fi})/${k}. Ese cociente cuenta los saltos; los términos son uno más: ${n}.`),
        h('poste-valla-cuenta-terminos', Ssum / (n + 1), `Dividiste la suma entre ${n + 1}: contaste un término de más. Del ${fi} al ${la}, de ${k} en ${k}, hay ${n} términos.`),
        h('semidiferencia', (la - fi) / 2, `Restaste el último menos el primero y dividiste entre 2. El promedio de una progresión es la semisuma del primero y el último.`),
        h('poste-valla-un-extremo-de-mas', (fi + la + k) / 2, `Llegaste hasta ${la + k}, que ya pasa de ${B}. El último ${impares ? 'impar' : `múltiplo de ${k}`} antes de ${B} es ${la}.`),
      ];
      const solucion = [
        [`El primero de ${nombre} mayor que ${A} es `, v('a', fi), ` y el último menor que ${B} es `, v('l', la), '.'],
        ['Forman una progresión de razón ', k, ': hay ', v('n', `(${la} − ${fi})/${k} + 1 = ${n}`), ` términos y suman ${n} × (${fi} + ${la})/2 = ${f(Ssum)}.`],
        ['El promedio es la suma entre la cantidad de términos, que en una progresión es la semisuma de los extremos: (', v('a', fi), ' + ', v('l', la), ')/2 = ', v('y', f(correcta)), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: y => f(y), variables, enunciado, pregunta, solucion,
        datos: { tipo: 'subconjuntos', sub, k, resto: r, A, B } });
    }
    // grupos: pares 2, 4, …, 2N; el primer grupo tiene a términos, el último c términos.
    const N = rng.entero(20, 60), a = rng.entero(4, Math.floor(N / 3)), c = rng.entero(4, Math.floor(N / 3));
    const medio = N - a - c;
    if (medio < 3 || a === c) return null;
    const p1 = a + 1, p3 = 2 * N - c + 1, correcta = p1 + p3 - N - 1;
    const total = N + 1;
    const variables = { p: { nombre: 'promedio del primer grupo', color: 'o' }, q: { nombre: 'promedio del último grupo', color: 'd' }, n: { nombre: 'cantidad de pares', color: 'i' }, y: { nombre: 'promedio del grupo del medio', color: 'h' } };
    const enunciado = ['Los ', v('n', `${N} primeros números pares`), ` (del 2 al ${2 * N}) se separan, en orden, en tres grupos de pares consecutivos. El promedio del primer grupo es `,
      v('p', p1), ' y el del último grupo es ', v('q', p3), '.'];
    const pregunta = ['¿Cuál es el ', v('y', 'promedio de los pares del grupo del medio'), '?'];
    const errores = [
      ar15(3 * total - p1 - p3, `Supusiste que el promedio de todos (${total}) es el promedio de los tres promedios. Los grupos tienen distinta cantidad de números: hay que pesar cada promedio por su cantidad.`),
      h('promedio-de-los-dos-grupos', (p1 + p3) / 2, 'Promediaste los dos promedios dados. El grupo del medio tiene sus propios números: sale de dónde empieza y dónde termina.'),
      h('promedio-de-todos', total, `${total} es el promedio de todos los pares. El grupo del medio coincide con él solo si los otros dos están parejos a cada lado.`),
      h('poste-valla-cuenta-grupo', correcta + 1, `Contaste un par de más en el primer grupo: si su promedio es ${p1}, va del 2 al ${2 * a} (${a} pares), y el grupo del medio empieza en ${2 * a + 2}.`),
      h('poste-valla-cuenta-grupo', correcta - 1, `Contaste un par de más en el último grupo: si su promedio es ${p3}, va del ${2 * (N - c + 1)} al ${2 * N} (${c} pares), y el grupo del medio termina en ${2 * (N - c)}.`),
    ];
    const solucion = [
      ['En pares consecutivos, el promedio es la semisuma del primero y el último. El primer grupo empieza en 2: termina en 2 × ', v('p', p1), ` − 2 = ${2 * a}.`],
      ['El último termina en ', `${2 * N}: empieza en 2 × `, v('q', p3), ` − ${2 * N} = ${2 * (N - c + 1)}.`],
      [`El grupo del medio va del ${2 * a + 2} al ${2 * (N - c)}: su promedio es (${2 * a + 2} + ${2 * (N - c)})/2 = `, v('y', f(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: y => f(y), variables, enunciado, pregunta, solucion,
      datos: { tipo: 'subconjuntos', sub, N, p1, p3 } });
  }

  return { id: ID, titulo: 'Promedios y estadística', generar, _internos: { listas, mediana, modas } };
});
