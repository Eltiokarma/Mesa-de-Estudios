/*
 * Generador: arreglos numéricos en cuadros, pirámides y filas.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['rm-arreglos']) y en Node (require). No usa ningún motor.
 * El cuadrado mágico aditivo y la suma por lado ya están en plantillas/arreglos-giros/; aquí no se repiten.
 *
 * Casillas de un cuadro de 3 × 3, por filas: 0 1 2 / 3 4 5 / 6 7 8 (4 es el centro).
 *
 * Tipos y sus _datos:
 *   multiplicativo  { tipo, base, signos: [9 de ±1], exps: [9], dados: [índices], x: índice | null, pide: 'x'|'suma' }
 *                   cuadrado mágico multiplicativo: cada fila, columna y diagonal da el mismo producto. Sus
 *                   números son ±base^exponente y los exponentes forman un cuadrado mágico aditivo. pide 'x': el
 *                   número de la casilla marcada; 'suma': la suma de todos los números que faltan.
 *   vertices        { tipo, numeros: [9], pide: 'max'|'min' } se ponen los 9 números en un cuadro de 3 × 3 de modo
 *                   que las cuatro casillas alrededor de cada uno de los 4 vértices interiores sumen lo mismo.
 *                   Respuesta: la mayor (o la menor) suma común posible, por búsqueda sobre todas las formas; solo
 *                   se piden los casos donde la alcanza la cota de 4S = total + 3 · centro + bordes (cotaVertices).
 *   piramide        { tipo, base: [n], pide: 'cima'|'x', x: índice de la base } cada círculo es la suma de los dos
 *                   de abajo. 'cima': se da la base y se pide el de arriba; 'x': se da el de arriba y la base
 *                   menos un número.
 *   fila            { tipo, n, k, periodo: [k], total } n casillas en fila; cada k seguidas suman lo mismo; se dan
 *                   la primera, la última y la suma de todas. Respuesta: la suma común.
 *   latino          { tipo, n, diag, sol: [[...]], dados: [[f, c]], marcas: [[f, c] × 3], expr } cuadro de n × n con
 *                   1…n sin repetir en filas, columnas (y diagonales si diag). Respuesta: la expresión con las
 *                   casillas a, b y c. La solución es única (se comprueba contando soluciones).
 *   crecientes      { tipo, r, c, j, pide: 'max'|'min', m, d } los números m, m + d, …, (r · c términos) en un
 *                   cuadro de r × c, cada fila creciente de izquierda a derecha. Respuesta: la mayor (o menor)
 *                   suma posible de la columna j.
 *   paridad         { tipo, r, c, bloqueadas: [[f, c]] } en cada casilla libre va un entero positivo; dos vecinas
 *                   (con un lado común) deben sumar impar. Respuesta: la mayor cantidad posible de pares.
 *   asientos        { tipo, c, n, pide: 'detras'|'delante' } butacas numeradas en zigzag desde la fila 1 (la
 *                   primera fila va de izquierda a derecha, la segunda de derecha a izquierda, …). Respuesta: el
 *                   número de la butaca que está justo detrás (o delante) de la n.
 *
 * calc:
 *   magicoDesde(a, b, c)          exponentes del cuadrado mágico aditivo de centro c (los 9, por filas)
 *   completarMultiplicativo(d)    todas las formas de completar el cuadro con los dados (búsqueda en una familia amplia)
 *   sumasVertices(numeros)        { [S]: un arreglo } con todas las sumas comunes posibles
 *   extremoVertices(numeros, pide) { S, posibles }
 *   cotaVertices(numeros, pide)   { S, centro, bordes, X }: la cota de 4S = total + 3 · centro + bordes (solo se
 *                                 piden los casos donde se alcanza)
 *   sumaFila({ n, k, primero, ultimo, total })  { S, grupos, sobran }
 *   cima(base), coeficientes(n)   la cima de la pirámide y sus coeficientes (de Pascal)
 *   resolverLatino(n, diag, dados, tope, reglas)  soluciones (hasta tope) con las reglas { filas, columnas, diagonales }
 *   columnaExtrema(r, c, j, pide) suma extrema de la columna j con 1…rc (en posiciones)
 *   maxPares(r, c, bloqueadas)    { max, comps: [[tamaño color A, tamaño color B]] }
 *   butaca(c, n), numeroEn(c, fila, pos)
 *
 * Errores (todos hipótesis; ver el informe de respuesta de este módulo):
 *   RMP65-aditivo / -exponente   tratar el multiplicativo como aditivo; responder el exponente y no la potencia
 *   RMP61-*                      responder un valor intermedio (la constante, antes de dividir, una casilla vecina)
 *   RMP63-*                      no aplicar una condición: el signo, las columnas, la diagonal, el orden, las bloqueadas
 *   RMP1-*                       casillas compartidas: contarlas una sola vez, o dos veces todas; grupos que se solapan
 *   RMP2-*                       quedarse con un arreglo natural o el primero que sale, sin buscar el extremo
 *   RMP66-*                      repartir mitad y mitad o elegir un solo color sin mirar cómo se alternan las paridades
 *   RMP67-valor                  el número más cercano en valor y no en posición
 *   RMP64-sentido                confundir delante con detrás
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const v = P.v;
  const f = x => P.formatear(x, 2);
  const ent = x => Number.isInteger(x);
  const LINEAS = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const NOM_LINEA = ['la fila de arriba', 'la fila del medio', 'la fila de abajo', 'la columna izquierda', 'la columna del medio', 'la columna derecha', 'la diagonal que baja', 'la diagonal que sube'];
  const lista = xs => xs.length <= 1 ? xs.join('') : xs.slice(0, -1).join(', ') + ' y ' + xs[xs.length - 1];
  const num = x => (x < 0 ? '−' : '') + f(Math.abs(x));
  const SVG = (w, hgt, cuerpo) => `<svg viewBox="0 0 ${w} ${hgt}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" text-anchor="middle">${cuerpo}</svg>`;
  const caja = (x, y, w, hgt, estilo = 'fill:var(--card)') => `<rect x="${x}" y="${y}" width="${w}" height="${hgt}" style="${estilo}" stroke="currentColor" stroke-width="1.5"/>`;
  const texto = (x, y, t, tam = 18, estilo = 'fill:currentColor') => `<text x="${x}" y="${y}" font-size="${tam}" style="${estilo}">${P.xml(t)}</text>`;

  // =====================================================================
  // 1. Cuadrado mágico multiplicativo
  // =====================================================================
  const magicoDesde = (a, b, c) => [c + a, c - a - b, c + b, c - a + b, c, c + a - b, c - b, c + a + b, c - a];
  let SIGNOS = null;
  function signosValidos() { // patrones de signos con el mismo signo de producto en las 8 líneas
    if (SIGNOS) return SIGNOS;
    SIGNOS = [];
    for (let m = 0; m < 512; m++) {
      const s = Array.from({ length: 9 }, (_, i) => (m >> i) & 1 ? -1 : 1);
      const pr = LINEAS.map(l => s[l[0]] * s[l[1]] * s[l[2]]);
      if (pr.every(x => x === pr[0])) SIGNOS.push(s);
    }
    return SIGNOS;
  }
  // Todas las formas de completar: exponentes de cualquier cuadrado mágico aditivo de enteros (centro de 0 a 14,
  // a y b de −8 a 8) y cualquier patrón de signos válido que respeten los números dados.
  function completarMultiplicativo(d) {
    const res = [];
    const valor = (s, e) => s * Math.pow(d.base, e);
    const dados = d.dados.map(i => [i, d.signos[i] * Math.pow(d.base, d.exps[i])]);
    const sigs = signosValidos().filter(s => dados.every(([i, x]) => Math.sign(x) === s[i]));
    for (let c = 0; c <= 14; c++) for (let a = -8; a <= 8; a++) for (let b = -8; b <= 8; b++) {
      const e = magicoDesde(a, b, c);
      if (e.some(x => x < 0)) continue;
      if (!dados.every(([i, x]) => Math.pow(d.base, e[i]) === Math.abs(x))) continue;
      for (const s of sigs) res.push(e.map((x, i) => valor(s[i], x)));
    }
    return res;
  }
  // Completa un cuadro mágico ADITIVO con los mismos números dados (el error de tratarlo como aditivo).
  // Resuelve a, b y c del molde magicoDesde con eliminación (fracciones como decimales); null si no hay una sola.
  function completarAditivo(dados) {
    const filas = dados.map(([i, x]) => { const e1 = magicoDesde(1, 0, 0)[i], e2 = magicoDesde(0, 1, 0)[i]; return [e1, e2, 1, x]; });
    const M = filas.map(r => r.slice());
    let fila = 0; const piv = [];
    for (let col = 0; col < 3 && fila < M.length; col++) {
      let k = fila; while (k < M.length && Math.abs(M[k][col]) < 1e-12) k++;
      if (k === M.length) continue;
      [M[fila], M[k]] = [M[k], M[fila]];
      for (let r = 0; r < M.length; r++) if (r !== fila) { const q = M[r][col] / M[fila][col]; for (let t = col; t < 4; t++) M[r][t] -= q * M[fila][t]; }
      piv.push(col); fila++;
    }
    if (piv.length < 3) return null;
    for (let r = 3; r < M.length; r++) if (Math.abs(M[r][3]) > 1e-9) return null;
    const sol = [0, 0, 0]; for (let r = 0; r < 3; r++) sol[piv[r]] = M[r][3] / M[r][piv[r]];
    return magicoDesde(sol[0], sol[1], sol[2]).map(x => Math.round(x * 1e9) / 1e9);
  }
  // Pasos con los que un alumno completa los exponentes (y los signos); null si se traba.
  function pasosExponentes(exps, dados) {
    const e = Array(9).fill(null); dados.forEach(i => { e[i] = exps[i]; });
    let S = null; const pasos = [];
    const OPU = [[0, 8], [1, 7], [2, 6], [3, 5]];
    for (let vuelta = 0; vuelta < 20 && e.some(x => x === null); vuelta++) {
      let avanzo = false;
      if (S === null && e[4] !== null) { S = 3 * e[4]; pasos.push({ t: 'S-centro', S }); avanzo = true; }
      if (S === null) for (let l = 0; l < 8; l++) if (LINEAS[l].every(i => e[i] !== null)) { S = LINEAS[l].reduce((s, i) => s + e[i], 0); pasos.push({ t: 'S-linea', l, S }); avanzo = true; break; }
      if (e[4] === null) for (const [p, q] of OPU) if (e[p] !== null && e[q] !== null) { e[4] = (e[p] + e[q]) / 2; pasos.push({ t: 'centro', p, q, val: e[4] }); avanzo = true; break; }
      if (e[4] !== null) for (const [p, q] of OPU) {
        if (e[p] !== null && e[q] === null) { e[q] = 2 * e[4] - e[p]; pasos.push({ t: 'opuesto', de: p, a: q, val: e[q] }); avanzo = true; }
        else if (e[q] !== null && e[p] === null) { e[p] = 2 * e[4] - e[q]; pasos.push({ t: 'opuesto', de: q, a: p, val: e[p] }); avanzo = true; }
      }
      if (S !== null) for (let l = 0; l < 8; l++) {
        const faltan = LINEAS[l].filter(i => e[i] === null);
        if (faltan.length === 1) { const i = faltan[0]; e[i] = S - LINEAS[l].filter(j => j !== i).reduce((s, j) => s + e[j], 0); pasos.push({ t: 'linea', l, i, val: e[i] }); avanzo = true; }
      }
      if (!avanzo) return null;
    }
    return e.every((x, i) => x === exps[i]) ? { pasos, S } : null;
  }
  function pasosSignos(signos, dados) {
    const s = Array(9).fill(null); dados.forEach(i => { s[i] = signos[i]; });
    let sigma = null; const pasos = [];
    for (let vuelta = 0; vuelta < 20 && s.some(x => x === null); vuelta++) {
      let avanzo = false;
      if (sigma === null) for (let l = 0; l < 8; l++) if (LINEAS[l].every(i => s[i] !== null)) { sigma = LINEAS[l].reduce((p, i) => p * s[i], 1); pasos.push({ t: 'sigma', l, sigma }); avanzo = true; break; }
      if (sigma !== null) for (let l = 0; l < 8; l++) {
        const faltan = LINEAS[l].filter(i => s[i] === null);
        if (faltan.length === 1) { const i = faltan[0]; s[i] = sigma * LINEAS[l].filter(j => j !== i).reduce((p, j) => p * s[j], 1); pasos.push({ t: 'signo', l, i, val: s[i] }); avanzo = true; }
      }
      if (!avanzo) return null;
    }
    return s.every((x, i) => x === signos[i]) ? { pasos, sigma } : null;
  }
  const CAS = ['arriba a la izquierda', 'arriba al centro', 'arriba a la derecha', 'al medio a la izquierda', 'el centro', 'al medio a la derecha', 'abajo a la izquierda', 'abajo al centro', 'abajo a la derecha'];

  function figuraCuadro(valores, marcas = {}, n = 3, tam = 60) {
    const W = n * tam + 20, x0 = 10, y0 = 10;
    let s = '';
    for (let i = 0; i < n * n; i++) {
      const fx = x0 + (i % n) * tam, fy = y0 + Math.floor(i / n) * tam, m = marcas[i];
      s += caja(fx, fy, tam, tam, m ? `fill:var(--c-${m.c});fill-opacity:0.18` : 'fill:var(--card)');
      if (m) s += texto(fx + tam / 2, fy + tam / 2 + 7, m.t, 20, `fill:var(--c-${m.c});font-weight:700`);
      else if (valores[i] !== null && valores[i] !== undefined) s += texto(fx + tam / 2, fy + tam / 2 + 6, String(valores[i]), tam > 50 ? 18 : 16);
    }
    return SVG(W, n * tam + 20, s);
  }
  const altCuadro = (valores, marcas = {}, n = 3) => {
    const filas = [];
    for (let r = 0; r < n; r++) {
      const celdas = [];
      for (let c = 0; c < n; c++) { const i = r * n + c; celdas.push(marcas[i] ? `«${marcas[i].t}»` : (valores[i] === null || valores[i] === undefined ? 'vacía' : String(valores[i]))); }
      filas.push(`fila ${r + 1}: ${celdas.join(', ')}`);
    }
    return filas.join('; ');
  };

  function construirMultiplicativo(rng, semilla) {
    for (let intento = 0; intento < 400; intento++) {
      const base = rng.elegir([2, 2, 2, 3]);
      const maxE = base === 2 ? 9 : 6;
      const a = rng.entero(-3, 3), b = rng.entero(-3, 3), c = rng.entero(2, maxE - 2);
      const exps = magicoDesde(a, b, c);
      if (exps.some(x => x < 0 || x > maxE) || new Set(exps).size !== 9) continue;
      const neg = rng.sig() < 0.4;
      const sigs = signosValidos().filter(s => s.some(x => x < 0));
      const signos = neg ? rng.elegir(sigs) : Array(9).fill(1);
      const k = rng.elegir([3, 4, 4]);
      const dados = rng.barajar([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, k).sort((x, y) => x - y);
      const pide = rng.sig() < 0.6 ? 'x' : 'suma';
      const libres = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(i => !dados.includes(i));
      const x = pide === 'x' ? rng.elegir(libres) : null;
      const d = { tipo: 'multiplicativo', base, signos, exps, dados, x, pide };
      const sols = completarMultiplicativo(d);
      if (sols.length !== 1) continue;
      const pe = pasosExponentes(exps, dados), ps = neg ? pasosSignos(signos, dados) : { pasos: [], sigma: 1 };
      if (!pe || !ps) continue;
      const p = armarMultiplicativo(d, pe, ps, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function armarMultiplicativo(d, pe, ps, rng, semilla) {
    const { base, signos, exps, dados, x, pide } = d;
    const val = exps.map((e, i) => signos[i] * Math.pow(base, e));
    const libres = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(i => !dados.includes(i));
    const K = ps.sigma * Math.pow(base, pe.S);
    const neg = signos.some(s => s < 0);
    const correcta = pide === 'x' ? val[x] : libres.reduce((s, i) => s + val[i], 0);
    const errores = [];
    const adit = completarAditivo(dados.map(i => [i, val[i]]));
    if (adit) {
      const va = pide === 'x' ? adit[x] : libres.reduce((s, i) => s + adit[i], 0);
      if (ent(va)) errores.push(h('RMP65-aditivo', va, 'Lo completaste como si cada línea sumara lo mismo. Aquí lo que se repite es el producto: hay que multiplicar, o trabajar con los exponentes.'));
    }
    errores.push(h('RMP65-exponente', pide === 'x' ? exps[x] * (neg ? signos[x] : 1) : libres.reduce((s, i) => s + exps[i], 0),
      `Trabajaste bien con los exponentes, pero ${pide === 'x' ? 'respondiste el exponente' : 'sumaste los exponentes'} y no ${pide === 'x' ? 'la potencia' : 'los números'}: hay que volver a escribir ${base}^exponente.`));
    errores.push(h('RMP61-constante', K, `Ese es el producto de cada línea (${num(K)}), un paso intermedio. ${pide === 'x' ? 'Falta usarlo para hallar la casilla marcada.' : 'Falta usarlo para hallar los números que faltan y sumarlos.'}`));
    if (neg) {
      const sinSigno = pide === 'x' ? -val[x] : libres.reduce((s, i) => s + Math.abs(val[i]), 0);
      errores.push(h('RMP63-signo', sinSigno, pide === 'x' ? 'Te equivocaste de signo. En cada línea el producto tiene el mismo signo: cuenta cuántos negativos hay en la línea.' : 'No tomaste en cuenta los signos: algunos de los números que faltan son negativos (en cada línea el producto tiene el mismo signo).'));
    }
    if (pide === 'suma') errores.push(h('RMP61-todos', val.reduce((s, z) => s + z, 0), 'Sumaste los nueve números; se piden solo los que faltan.'));
    const alternativas = P.armar({ correcta, errores, rng, negativos: true, texto: num });
    if (alternativas.length < 4) return null;
    const marcas = {}; if (x !== null) marcas[x] = { t: 'x', c: 'o' };
    const visibles = val.map((z, i) => (dados.includes(i) ? num(z) : null));
    const potencia = (s, e) => (s < 0 ? '−' : '') + `${base}^${e}`;
    const solucion = [[`Escribe cada número como potencia de ${base}${neg ? ' (con su signo)' : ''}: ` + dados.map(i => `${num(val[i])} = ${potencia(signos[i], exps[i])}`).join(', ') + '. Al multiplicar, los exponentes se suman: los exponentes forman un cuadrado mágico aditivo.']];
    for (const q of pe.pasos) {
      if (q.t === 'S-centro') solucion.push(['En un cuadrado mágico de 3 × 3, la suma de cada línea es el triple del centro: ', v('K', `${q.S}`), ` (el producto de cada línea es ${base}^${q.S}).`]);
      else if (q.t === 'S-linea') solucion.push([`En ${NOM_LINEA[q.l]} ya están los tres exponentes: suman `, v('K', `${q.S}`), '.']);
      else if (q.t === 'centro') solucion.push([`El centro es el promedio de dos casillas opuestas: (${exps[q.p]} + ${exps[q.q]}) ÷ 2 = ${q.val}.`]);
      else if (q.t === 'opuesto') solucion.push([`La casilla opuesta a la de exponente ${exps[q.de]} (${CAS[q.a]}) tiene 2 × ${exps[4]} − ${exps[q.de]} = ${q.val}.`]);
      else solucion.push([`En ${NOM_LINEA[q.l]} falta el exponente de la casilla de ${CAS[q.i]}: `, v('K', `${pe.S}`), ` − ${LINEAS[q.l].filter(j => j !== q.i).map(j => exps[j]).join(' − ')} = ${q.val}.`]);
    }
    if (neg) {
      const s0 = ps.pasos.find(q => q.t === 'sigma');
      solucion.push([`Signos: en ${NOM_LINEA[s0.l]} el producto es ${s0.sigma > 0 ? 'positivo' : 'negativo'}, así que en todas las líneas tiene que serlo; cada casilla que falta toma el signo que lo cumple.`]);
    }
    solucion.push(['Cuadro completo: ' + [0, 1, 2].map(r => [0, 1, 2].map(c => num(val[3 * r + c])).join(', ')).join(' / ') + '.']);
    solucion.push(pide === 'x' ? ['La casilla marcada es ', v('x', num(correcta)), '.'] : ['Los que faltan suman ', libres.map(i => num(val[i])).join(' + ').replace(/\+ −/g, '− '), ' = ', v('x', num(correcta)), '.']);
    return {
      id: `rm-arreglos#${semilla}`,
      variables: { x: { nombre: pide === 'x' ? 'casilla marcada' : 'suma pedida', color: 'o' }, K: { nombre: 'suma de exponentes por línea', color: 'h' } },
      enunciado: [`En el cuadro, el producto de los tres números de cada fila, de cada columna y de cada diagonal es el mismo.${neg ? ' Algunos números son negativos.' : ''}`],
      figura: { svg: figuraCuadro(visibles, marcas), alt: 'Cuadro de 3 × 3. ' + altCuadro(visibles, marcas) + '.' },
      pregunta: [pide === 'x' ? '¿Qué número va en la casilla ' : '¿Cuánto suman todos los números que faltan?', ...(pide === 'x' ? [v('x', 'x'), '?'] : [])],
      datos: '', alternativas, solucion,
      figuraSolucion: { svg: figuraCuadro(val.map(num)), alt: 'Cuadro completo. ' + altCuadro(val.map(num)) + '.' },
      respuesta: { valor: correcta, unidad: '' },
      _datos: d,
    };
  }

  // =====================================================================
  // 2. Sumas alrededor de los vértices
  // =====================================================================
  const BLOQUES = [[0, 1, 3, 4], [1, 2, 4, 5], [3, 4, 6, 7], [4, 5, 7, 8]];
  // Todas las sumas comunes posibles, con un arreglo de ejemplo de cada una. Se elige el centro y la fila de
  // arriba con la casilla de la izquierda del medio; lo demás sale de las igualdades y se comprueba.
  function sumasVertices(numeros) {
    const res = {}, n = numeros, usa = new Set();
    const libre = x => n.includes(x) && !usa.has(x);
    for (const e of n) { usa.add(e);
      for (const a of n) { if (usa.has(a)) continue; usa.add(a);
        for (const b of n) { if (usa.has(b)) continue; usa.add(b);
          for (const d of n) { if (usa.has(d)) continue; usa.add(d);
            const S = a + b + d + e;
            for (const c of n) { if (usa.has(c)) continue; const fv = S - b - e - c; if (fv === c || !libre(fv)) continue; usa.add(c); usa.add(fv);
              for (const g of n) { if (usa.has(g)) continue; const hv = S - d - e - g; if (hv === g || !libre(hv)) continue; usa.add(g); usa.add(hv);
                const iv = S - e - fv - hv;
                if (libre(iv) && res[S] === undefined) res[S] = [a, b, c, d, e, fv, g, hv, iv];
                usa.delete(g); usa.delete(hv); }
              usa.delete(c); usa.delete(fv); }
            usa.delete(d); }
          usa.delete(b); }
        usa.delete(a); }
      usa.delete(e); }
    return res;
  }
  function construirVertices(rng, semilla) {
    for (let intento = 0; intento < 100; intento++) {
      let numeros;
      if (rng.moneda()) { const m = rng.entero(1, 6); numeros = Array.from({ length: 9 }, (_, i) => m + i); }
      else numeros = rng.barajar(Array.from({ length: 14 }, (_, i) => i + 1)).slice(0, 9).sort((x, y) => x - y);
      const pide = rng.sig() < 0.65 ? 'max' : 'min';
      const d = { tipo: 'vertices', numeros, pide };
      const p = armarVertices(d, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function armarVertices(d, rng, semilla) {
    const { numeros, pide } = d;
    const sumas = sumasVertices(numeros);
    const Ss = Object.keys(sumas).map(Number).sort((x, y) => x - y);
    if (Ss.length < 2) return null;
    const correcta = pide === 'max' ? Ss[Ss.length - 1] : Ss[0];
    const T = numeros.reduce((s, x) => s + x, 0);
    const orden = numeros.slice().sort((x, y) => x - y), medio = orden[4];
    // Cota: 4S = T + 3 · centro + (bordes). Lo más (o lo menos) que da 3 · centro + bordes es con el extremo al
    // centro y los cuatro siguientes en los bordes. Solo se piden los casos donde esa cota se alcanza.
    const cotaV = cotaVertices(numeros, pide);
    if (cotaV.S !== correcta) return null;
    const errores = [];
    const conMedioTodas = buscarConCentro(numeros, medio);
    if (conMedioTodas.length) errores.push(h('RMP2-centro-medio', pide === 'max' ? Math.max(...conMedioTodas) : Math.min(...conMedioTodas),
      `Pusiste al centro el número del medio (${medio}), como en el cuadrado mágico. Aquí el centro está en los cuatro grupos: conviene ${pide === 'max' ? 'el mayor' : 'el menor'}.`));
    const top = pide === 'max' ? orden.slice(-4) : orden.slice(0, 4);
    errores.push(h('RMP63-un-grupo', top.reduce((s, x) => s + x, 0), `Juntaste los cuatro números ${pide === 'max' ? 'mayores' : 'menores'} en un grupo, sin ver que los otros tres grupos también deben sumar lo mismo.`));
    if (T % 4 === 0) errores.push(h('RMP1-sin-compartir', T / 4, `Repartiste el total (${T}) entre los 4 grupos como si no compartieran casillas. El centro está en los cuatro grupos y cada casilla del borde en dos.`));
    if (T % 2 === 0) errores.push(h('RMP1-todas-dos-veces', T / 2, 'Contaste cada casilla en dos grupos. El centro está en cuatro, las del borde en dos y las esquinas en uno solo.'));
    errores.push(h('RMP2-extremo-opuesto', pide === 'max' ? Ss[0] : Ss[Ss.length - 1], `Esa es la ${pide === 'max' ? 'menor' : 'mayor'} suma posible; se pide la ${pide === 'max' ? 'mayor' : 'menor'}.`));
    const alternativas = P.armar({ correcta, errores, rng });
    if (alternativas.length < 4) return null;
    const arr = sumas[correcta];
    const esquinas = [0, 2, 6, 8].map(i => arr[i]), bordes = [1, 3, 5, 7].map(i => arr[i]);
    const marcas = { 0: { t: '', c: 'i' }, 1: { t: '', c: 'i' }, 3: { t: '', c: 'i' }, 4: { t: '', c: 'i' } };
    let fig = '';
    for (let i = 0; i < 9; i++) fig += caja(10 + (i % 3) * 60, 10 + Math.floor(i / 3) * 60, 60, 60, marcas[i] ? 'fill:var(--c-i);fill-opacity:0.18' : 'fill:var(--card)');
    for (const [px, py] of [[70, 70], [130, 70], [70, 130], [130, 130]]) fig += `<circle cx="${px}" cy="${py}" r="5" style="fill:currentColor"/>`;
    return {
      id: `rm-arreglos#${semilla}`,
      variables: { S: { nombre: 'suma común', color: 'o' }, c: { nombre: 'centro', color: 'h' }, g: { nombre: 'un grupo de cuatro', color: 'i' } },
      enunciado: [`Se escriben los números ${lista(numeros.map(String))}, uno en cada casilla de un cuadro de 3 × 3. Alrededor de cada uno de los 4 puntos marcados hay un `, v('g', 'grupo de cuatro casillas'), ', y los cuatro grupos deben sumar lo mismo: ', v('S', 'S'), '.'],
      figura: { svg: SVG(200, 200, fig), alt: 'Cuadro de 3 × 3 vacío con los cuatro puntos interiores marcados (donde se cruzan las líneas). Sombreado, como ejemplo, el grupo de las cuatro casillas de arriba a la izquierda alrededor del primer punto.' },
      pregunta: [`¿Cuál es la ${pide === 'max' ? 'mayor' : 'menor'} suma común posible?`],
      datos: '', alternativas,
      solucion: [
        ['Cada casilla está en varios grupos: el ', v('c', 'centro'), ' en los 4, cada casilla del medio de un borde en 2 y cada esquina en 1.'],
        ['Sumando los cuatro grupos: 4S = 4 · centro + 2 · (bordes) + esquinas = (todos) + 3 · centro + (bordes) = ', `${T} + 3 · centro + (bordes)`, '.'],
        [pide === 'max'
          ? `3 · centro + (bordes) vale lo más con el mayor, ${cotaV.centro}, al centro (cuenta tres veces) y los cuatro siguientes en los bordes: 3 · ${cotaV.centro} + ${cotaV.bordes.join(' + ')} = ${cotaV.X}. Entonces 4S ≤ ${T} + ${cotaV.X} = ${T + cotaV.X}, y S ≤ ${T + cotaV.X} ÷ 4${(T + cotaV.X) % 4 ? ` = ${f((T + cotaV.X) / 4)}; como S es entero, S ≤ ${cotaV.S}` : ` = ${cotaV.S}`}.`
          : `3 · centro + (bordes) vale lo menos con el menor, ${cotaV.centro}, al centro (cuenta tres veces) y los cuatro siguientes en los bordes: 3 · ${cotaV.centro} + ${cotaV.bordes.join(' + ')} = ${cotaV.X}. Entonces 4S ≥ ${T} + ${cotaV.X} = ${T + cotaV.X}, y S ≥ ${T + cotaV.X} ÷ 4${(T + cotaV.X) % 4 ? ` = ${f((T + cotaV.X) / 4)}; como S es entero, S ≥ ${cotaV.S}` : ` = ${cotaV.S}`}.`],
        [`Y `, v('S', `S = ${correcta}`), ` sí se logra: por ejemplo con ${arr[4]} al centro, ${lista(bordes.map(String))} en los bordes y ${lista(esquinas.map(String))} en las esquinas.`],
        ['Comprueba: ' + BLOQUES.map(B => B.map(i => arr[i]).join(' + ') + ' = ' + B.reduce((s, i) => s + arr[i], 0)).join('; ') + '.'],
      ],
      figuraSolucion: { svg: figuraCuadro(arr.map(String)), alt: 'Un arreglo que lo logra. ' + altCuadro(arr.map(String)) + '.' },
      respuesta: { valor: correcta, unidad: '' },
      _datos: d,
    };
  }
  function cotaVertices(numeros, pide) {
    const o = numeros.slice().sort((x, y) => (pide === 'max' ? y - x : x - y));
    const X = 3 * o[0] + o[1] + o[2] + o[3] + o[4], T = numeros.reduce((s, x) => s + x, 0);
    return { S: pide === 'max' ? Math.floor((T + X) / 4) : Math.ceil((T + X) / 4), centro: o[0], bordes: o.slice(1, 5), X };
  }
  function extremoVertices(numeros, pide) {
    const Ss = Object.keys(sumasVertices(numeros)).map(Number);
    return { S: pide === 'max' ? Math.max(...Ss) : Math.min(...Ss), posibles: Ss.sort((a, b) => a - b) };
  }
  // Suma común de la fila: T = q · S + (las casillas que sobran, que repiten el comienzo del patrón).
  function sumaFila({ n, k, primero, ultimo, total }) {
    const q = Math.floor(n / k), s = n % k;
    if (s !== 1 && s !== 2) return null;
    return { S: (total - primero - (s === 2 ? ultimo : 0)) / q, grupos: q, sobran: s };
  }
  function buscarConCentro(n, e) { // todas las S con e fijo al centro
    const res = new Set(), usa = new Set([e]);
    const libre = x => n.includes(x) && !usa.has(x);
    for (const a of n) { if (usa.has(a)) continue; usa.add(a);
      for (const b of n) { if (usa.has(b)) continue; usa.add(b);
        for (const d of n) { if (usa.has(d)) continue; usa.add(d);
          const S = a + b + d + e;
          for (const c of n) { if (usa.has(c)) continue; const fv = S - b - e - c; if (fv === c || !libre(fv)) continue; usa.add(c); usa.add(fv);
            for (const g of n) { if (usa.has(g)) continue; const hv = S - d - e - g; if (hv === g || !libre(hv)) continue; usa.add(g); usa.add(hv);
              if (libre(S - e - fv - hv)) res.add(S);
              usa.delete(g); usa.delete(hv); }
            usa.delete(c); usa.delete(fv); }
          usa.delete(d); }
        usa.delete(b); }
      usa.delete(a); }
    return [...res];
  }

  // =====================================================================
  // 3. Pirámide de sumas
  // =====================================================================
  const coeficientes = n => { const c = [1]; for (let k = 1; k < n; k++) c.push(c[k - 1] * (n - k) / k); return c; };
  function filasPiramide(base) { const filas = [base.slice()]; while (filas[filas.length - 1].length > 1) { const u = filas[filas.length - 1]; filas.push(u.slice(1).map((x, i) => x + u[i])); } return filas; }
  const cima = base => filasPiramide(base).pop()[0];
  function figuraPiramide(filas, mostrar) {
    const n = filas[0].length, R = 21, dx = 50, W = n * dx + 20, H = n * 46 + 14;
    let s = '';
    filas.forEach((fila, r) => fila.forEach((x, i) => {
      const cx = 10 + dx / 2 + i * dx + r * dx / 2, cy = H - 30 - r * 46;
      const m = mostrar(r, i);
      s += `<circle cx="${cx}" cy="${cy}" r="${R}" style="${m && m.c ? `fill:var(--c-${m.c});fill-opacity:0.18` : 'fill:var(--card)'}" stroke="currentColor" stroke-width="1.5"/>`;
      if (m) s += texto(cx, cy + 6, m.t, 17, m.c ? `fill:var(--c-${m.c});font-weight:700` : 'fill:currentColor');
    }));
    return SVG(W, H, s);
  }
  function construirPiramide(rng, semilla) {
    for (let intento = 0; intento < 200; intento++) {
      const n = rng.elegir([4, 4, 5]);
      const base = Array.from({ length: n }, () => rng.entero(1, n === 4 ? 12 : 9));
      const pide = rng.moneda() ? 'cima' : 'x';
      const x = pide === 'x' ? rng.entero(0, n - 1) : null;
      if (pide === 'x' && coeficientes(n)[x] === 1 && rng.sig() < 0.7) continue; // casi siempre una del medio
      const d = { tipo: 'piramide', base, pide, x };
      const p = armarPiramide(d, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function armarPiramide(d, rng, semilla) {
    const { base, pide, x } = d, n = base.length;
    const filas = filasPiramide(base), T = filas[n - 1][0], C = coeficientes(n);
    const dobles = C.map((_, i) => (i === 0 || i === n - 1 ? 1 : 2));
    const errores = [];
    let correcta, enunciado, pregunta, solucion, mostrar;
    if (pide === 'cima') {
      correcta = T;
      errores.push(h('RMP1-una-vez', base.reduce((s, z) => s + z, 0), 'Sumaste los números de abajo una vez cada uno. Los del medio se usan en más de una suma al subir: cuentan más veces.'));
      if (n > 3) errores.push(h('RMP1-doble', base.reduce((s, z, i) => s + dobles[i] * z, 0), `Contaste dos veces los del medio, como si solo subieran dos pisos. Con ${n} pisos los coeficientes son ${C.join(', ')}.`));
      errores.push(h('RMP61-penultimo', Math.max(...filas[n - 2]), `Ese es uno de los dos círculos que están justo debajo del de arriba: falta sumarlos (${filas[n - 2].join(' + ')}).`));
      errores.push(h('RMP61-piso', filas[n - 3].reduce((s, z) => s + z, 0), `Sumaste los círculos del tercer piso desde arriba (${filas[n - 3].join(' + ')}). El del medio de ese piso aporta dos veces a la cima.`));
      mostrar = (r, i) => (r === 0 ? { t: String(base[i]) } : r === n - 1 ? { t: '?', c: 'o' } : null);
      enunciado = [`En la pirámide, cada círculo vale la suma de los dos que tiene debajo. Abajo están los números ${base.join(', ')}.`];
      pregunta = ['¿Qué número va en el ', v('T', 'círculo de arriba'), '?'];
      solucion = [
        ['Se puede subir piso por piso: ' + filas.slice(1).map(fl => fl.join(', ')).join(' → ') + '.'],
        ['Atajo: cada número de abajo llega a la cima tantas veces como caminos tiene hacia arriba. Los coeficientes son los de Pascal: ', v('C', C.join(', ')), '.'],
        ['Cima: ', base.map((z, i) => `${C[i]} · ${z}`).join(' + '), ' = ', v('T', String(T)), '.'],
      ];
    } else {
      correcta = base[x];
      const resto = T - base.reduce((s, z, i) => (i === x ? s : s + C[i] * z), 0);
      const conCoef = (cs) => (T - base.reduce((s, z, i) => (i === x ? s : s + cs[i] * z), 0)) / cs[x];
      const unos = conCoef(C.map(() => 1));
      if (ent(unos)) errores.push(h('RMP1-una-vez', unos, 'Restaste los números de abajo una vez cada uno. Al subir, cada número de abajo cuenta tantas veces como caminos tiene hasta la cima (coeficientes de Pascal).'));
      const dob = conCoef(dobles);
      if (ent(dob) && n > 3) errores.push(h('RMP1-doble', dob, `Usaste 1, 2, …, 2, 1 como coeficientes. Con ${n} pisos son ${C.join(', ')}.`));
      if (C[x] > 1) errores.push(h('RMP61-sin-dividir', resto, `Llegaste a ${C[x]} · x = ${resto}, pero te faltó dividir entre ${C[x]}.`));
      errores.push(h('RMP61-vecino', filas[1][Math.min(x, n - 2)], `Ese es el círculo que está encima de x, a la ${x <= n - 2 ? 'derecha' : 'izquierda'}; no es x.`));
      mostrar = (r, i) => (r === 0 ? (i === x ? { t: 'x', c: 'o' } : { t: String(base[i]) }) : r === n - 1 ? { t: String(T), c: 'h' } : null);
      enunciado = ['En la pirámide, cada círculo vale la suma de los dos que tiene debajo. El de arriba vale ', v('T', String(T)), ` y abajo están ${base.map((z, i) => (i === x ? 'x' : String(z))).join(', ')}.`];
      pregunta = ['¿Cuánto vale ', v('x', 'x'), '?'];
      solucion = [
        ['Cada número de abajo llega a la cima tantas veces como caminos tiene hacia arriba. Los coeficientes son los de Pascal: ', v('C', C.join(', ')), '.'],
        ['Entonces ', base.map((z, i) => `${C[i]} · ${i === x ? 'x' : z}`).join(' + '), ' = ', v('T', String(T)), '.'],
        [`${C[x]} · x = ${T} − ${T - resto} = ${resto}, así que `, v('x', `x = ${correcta}`), '.'],
      ];
    }
    const alternativas = P.armar({ correcta, errores, rng });
    if (alternativas.length < 4) return null;
    const alt = `Pirámide de círculos de ${n} pisos (${n} abajo, 1 arriba). ` + (pide === 'cima' ? `Abajo, de izquierda a derecha: ${base.join(', ')}. Arriba, un signo de interrogación. Los demás círculos están vacíos.`
      : `Abajo, de izquierda a derecha: ${base.map((z, i) => (i === x ? 'x' : z)).join(', ')}. Arriba: ${T}. Los demás círculos están vacíos.`);
    return {
      id: `rm-arreglos#${semilla}`,
      variables: { T: { nombre: 'círculo de arriba', color: 'h' }, x: { nombre: 'número buscado', color: 'o' }, C: { nombre: 'coeficientes de Pascal', color: 'i' } },
      enunciado, figura: { svg: figuraPiramide(filas, mostrar), alt }, pregunta, datos: '', alternativas, solucion,
      figuraSolucion: { svg: figuraPiramide(filas, (r, i) => ({ t: String(filas[r][i]) })), alt: 'Pirámide completa, de abajo hacia arriba: ' + filas.map(fl => fl.join(', ')).join(' / ') + '.' },
      respuesta: { valor: correcta, unidad: '' },
      _datos: d,
    };
  }

  // =====================================================================
  // 4. Fila con sumas fijas de k casillas seguidas
  // =====================================================================
  function construirFila(rng, semilla) {
    for (let intento = 0; intento < 300; intento++) {
      const k = rng.elegir([3, 3, 4]);
      const n = rng.entero(7, 11);
      const s = n % k;
      if (s !== 1 && s !== 2) continue;
      const periodo = Array.from({ length: k }, () => rng.entero(1, 12));
      const celdas = Array.from({ length: n }, (_, i) => periodo[i % k]);
      const total = celdas.reduce((a, b) => a + b, 0);
      const d = { tipo: 'fila', n, k, periodo, total };
      const p = armarFila(d, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function armarFila(d, rng, semilla) {
    const { n, k, periodo, total } = d;
    const q = Math.floor(n / k), s = n % k;
    const S = periodo.reduce((a, b) => a + b, 0);
    const primero = periodo[0], ultimo = periodo[(n - 1) % k];
    const sobrantes = periodo.slice(0, s);
    const sumaSob = sobrantes.reduce((a, b) => a + b, 0);
    const errores = [];
    errores.push(h('RMP61-sin-dividir', total - sumaSob, `Llegaste a ${q}S = ${total - sumaSob}, pero te faltó dividir entre ${q}.`));
    if (ent(total / q)) errores.push(h('RMP1-sin-sobrantes', total / q, `Dividiste el total entre ${q} grupos, pero ${s === 1 ? 'sobra una casilla que no forma un grupo completo: hay que restarla antes.' : `sobran ${s} casillas que no forman un grupo completo: hay que restarlas antes.`}`));
    if (s === 1 && ent((total - primero - ultimo) / q)) errores.push(h('RMP1-resta-extremos', (total - primero - ultimo) / q, `Restaste la primera y la última como si las dos sobraran. Con ${n} casillas en grupos de ${k} sobra una sola, y la última es igual a la primera.`));
    if (s === 2 && ent((total - primero) / q)) errores.push(h('RMP1-un-sobrante', (total - primero) / q, `Restaste solo la primera casilla; con ${n} casillas en grupos de ${k} sobran dos.`));
    const ventanas = n - k + 1;
    if (ent(total / ventanas)) errores.push(h('RMP1-grupos-solapados', total / ventanas, `Dividiste el total entre los ${ventanas} grupos de ${k} seguidas, pero esos grupos se solapan: cada casilla está en varios.`));
    if (ent((total * k) / n)) errores.push(h('RMP1-proporcional', (total * k) / n, `Repartiste el total en partes iguales por casilla (${total} ÷ ${n} por casilla, por ${k}). Las casillas no valen todas lo mismo.`));
    const alternativas = P.armar({ correcta: S, errores, rng });
    if (alternativas.length < 4) return null;
    const ancho = 32, W = n * ancho + 20;
    let fig = '';
    for (let i = 0; i < n; i++) {
      const x0 = 10 + i * ancho, es = i === 0 || i === n - 1;
      fig += caja(x0, 14, ancho, 40, es ? 'fill:var(--c-i);fill-opacity:0.18' : 'fill:var(--card)');
      if (es) fig += texto(x0 + ancho / 2, 40, String(i === 0 ? primero : ultimo), 16);
    }
    fig += `<path d="M ${10} 62 h ${k * ancho}" stroke="currentColor" stroke-width="2" fill="none"/>` + texto(10 + k * ancho / 2, 80, `${k} seguidas: S`, 14, 'fill:var(--c-o)');
    return {
      id: `rm-arreglos#${semilla}`,
      variables: { S: { nombre: 'suma común', color: 'o' }, e: { nombre: 'casillas de los extremos', color: 'i' }, T: { nombre: 'suma de todas', color: 'h' } },
      enunciado: [`En una fila de ${n} casillas hay un número en cada una. Cualesquiera ${k} casillas seguidas suman lo mismo, S. La primera casilla tiene `, v('e', String(primero)), ', la última tiene ', v('e', String(ultimo)), ' y la suma de las ', `${n} casillas es `, v('T', String(total)), '.'],
      figura: { svg: SVG(W, 90, fig), alt: `Fila de ${n} casillas. La primera tiene ${primero} y la última ${ultimo}; las demás están vacías. Debajo de las ${k} primeras, una llave con «${k} seguidas: S».` },
      pregunta: ['¿Cuánto vale ', v('S', 'S'), '?'],
      datos: '', alternativas,
      solucion: [
        [`Si las casillas 1 a ${k} y las casillas 2 a ${k + 1} suman lo mismo, la casilla ${k + 1} es igual a la 1. Los números se repiten cada ${k}: la fila es un patrón de ${k} números que se copia.`],
        [`Con ${n} casillas hay ${q} grupos completos de ${k} y ${s === 1 ? 'sobra 1 casilla' : `sobran ${s} casillas`} al final, que repiten ${s === 1 ? 'la primera' : 'las dos primeras'} del patrón: ${s === 1 ? `la última vale ${ultimo}, igual que la primera` : `valen ${sobrantes.join(' y ')} (la última es la segunda del patrón)`}.`],
        ['Entonces ', v('T', String(total)), ` = ${q}S + ${sobrantes.join(' + ')}, y ${q}S = ${total - sumaSob}: `, v('S', `S = ${S}`), '.'],
      ],
      respuesta: { valor: S, unidad: '' },
      _datos: d,
    };
  }

  // =====================================================================
  // 5. Cuadro latino
  // =====================================================================
  // Soluciones con backtracking (hasta 'tope'). reglas: qué se exige sin repetir.
  function resolverLatino(n, diag, dados, tope = 2, reglas = { filas: true, columnas: true, diagonales: true }) {
    const g = Array.from({ length: n }, () => Array(n).fill(0));
    for (const [r, c, x] of dados) g[r][c] = x;
    const sols = [];
    const puede = (r, c, x) => {
      for (let t = 0; t < n; t++) {
        if (reglas.filas && t !== c && g[r][t] === x) return false;
        if (reglas.columnas && t !== r && g[t][c] === x) return false;
      }
      if (diag && reglas.diagonales) {
        if (r === c) for (let t = 0; t < n; t++) if (t !== r && g[t][t] === x) return false;
        if (r + c === n - 1) for (let t = 0; t < n; t++) if (t !== r && g[t][n - 1 - t] === x) return false;
      }
      return true;
    };
    for (const [r, c, x] of dados) if (!puede(r, c, x)) return [];
    const vacias = []; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (!g[r][c]) vacias.push([r, c]);
    const rec = k => {
      if (sols.length >= tope) return;
      if (k === vacias.length) { sols.push(g.map(f => f.slice())); return; }
      const [r, c] = vacias[k];
      for (let x = 1; x <= n; x++) if (puede(r, c, x)) { g[r][c] = x; rec(k + 1); g[r][c] = 0; }
    };
    rec(0);
    return sols;
  }
  const EXPRS = [
    { t: 'a + b + c', f: (a, b, c) => a + b + c }, { t: 'a × b + c', f: (a, b, c) => a * b + c }, { t: 'a × b − c', f: (a, b, c) => a * b - c },
    { t: '(a + b) × c', f: (a, b, c) => (a + b) * c }, { t: 'a × b × c', f: (a, b, c) => a * b * c }, { t: 'a + b × c', f: (a, b, c) => a + b * c },
  ];
  function construirLatino(rng, semilla) {
    for (let intento = 0; intento < 60; intento++) {
      const n = rng.elegir([4, 4, 5]);
      const diag = rng.sig() < 0.45;
      // Una solución completa al azar: se llena con el orden de números barajado en cada casilla.
      const g = Array.from({ length: n }, () => Array(n).fill(0));
      const vacias = []; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) vacias.push([r, c]);
      let pasos = 0;
      const ok = (r, c, x) => { for (let t = 0; t < n; t++) if (g[r][t] === x || g[t][c] === x) return false; if (diag) { if (r === c) for (let t = 0; t < n; t++) if (g[t][t] === x) return false; if (r + c === n - 1) for (let t = 0; t < n; t++) if (g[t][n - 1 - t] === x) return false; } return true; };
      const llenar = k => { if (++pasos > 20000) return false; if (k === vacias.length) return true; const [r, c] = vacias[k]; for (const x of rng.barajar(Array.from({ length: n }, (_, i) => i + 1))) if (ok(r, c, x)) { g[r][c] = x; if (llenar(k + 1)) return true; g[r][c] = 0; } return false; };
      if (!llenar(0)) continue;
      const sol = g.map(fl => fl.slice());
      // Se quitan números mientras la solución siga siendo única.
      let dados = []; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) dados.push([r, c]);
      for (const cel of rng.barajar(dados.slice())) {
        const sin = dados.filter(z => z !== cel);
        if (resolverLatino(n, diag, sin.map(([r, c]) => [r, c, sol[r][c]])).length === 1) dados = sin;
      }
      const libres = []; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (!dados.some(([a, b]) => a === r && b === c)) libres.push([r, c]);
      if (libres.length < 4) continue;
      const marcas = rng.barajar(libres).slice(0, 3);
      const expr = rng.elegir(EXPRS).t;
      const d = { tipo: 'latino', n, diag, sol, dados: dados.sort((x, y) => x[0] - y[0] || x[1] - y[1]), marcas, expr };
      const p = armarLatino(d, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function armarLatino(d, rng, semilla) {
    const { n, diag, sol, dados, marcas, expr } = d;
    const fx = EXPRS.find(e => e.t === expr).f;
    const valor = g => fx(...marcas.map(([r, c]) => g[r][c]));
    const correcta = valor(sol);
    const conDados = dados.map(([r, c]) => [r, c, sol[r][c]]);
    const errores = [];
    const usados = new Set([correcta]);
    const relajar = (reglas, id, txt) => {
      const sols = resolverLatino(n, diag, conDados, 300, reglas);
      const otra = sols.find(g => !usados.has(valor(g)));
      if (otra) { usados.add(valor(otra)); errores.push(h(id, valor(otra), txt)); }
    };
    if (diag) relajar({ filas: true, columnas: true, diagonales: false }, 'RMP63-sin-diagonal', 'Ese valor sale de un cuadro que repite un número en una diagonal. También las dos diagonales deben tener todos los números distintos.');
    relajar({ filas: true, columnas: false, diagonales: true }, 'RMP63-sin-columnas', 'Ese valor sale de un cuadro que cumple las filas pero repite un número en alguna columna.');
    relajar({ filas: false, columnas: true, diagonales: true }, 'RMP63-sin-filas', 'Ese valor sale de un cuadro que cumple las columnas pero repite un número en alguna fila.');
    if (errores.length < 3) relajar({ filas: true, columnas: false, diagonales: false }, 'RMP63-solo-filas', 'Ese valor sale de un cuadro que solo revisa las filas: repite números en alguna columna.');
    const alternativas = P.armar({ correcta, errores, rng, negativos: true });
    if (alternativas.length < 4) return null;
    const LET = ['a', 'b', 'c'], COL = ['o', 'i', 'h'];
    const grid = [], mk = {};
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) grid.push(dados.some(([a, b]) => a === r && b === c) ? String(sol[r][c]) : null);
    marcas.forEach(([r, c], k) => { mk[r * n + c] = { t: LET[k], c: COL[k] }; });
    const tam = n === 4 ? 56 : 48;
    const vals = marcas.map(([r, c]) => sol[r][c]);
    return {
      id: `rm-arreglos#${semilla}`,
      variables: { a: { nombre: 'casilla a', color: 'o' }, b: { nombre: 'casilla b', color: 'i' }, c: { nombre: 'casilla c', color: 'h' } },
      enunciado: [`Completa el cuadro de ${n} × ${n} con los números del 1 al ${n}, sin repetir ninguno en una misma fila ni en una misma columna${diag ? ', ni en ninguna de las dos diagonales' : ''}.`],
      figura: { svg: figuraCuadro(grid, mk, n, tam), alt: `Cuadro de ${n} × ${n}. ` + altCuadro(grid, mk, n) + '.' },
      pregunta: ['¿Cuánto vale ', expr.split(/([abc])/).filter(Boolean).map(t => (LET.includes(t) ? v(t, t) : t)), '?'].flat(),
      datos: '', alternativas,
      solucion: [
        ['Empieza por las filas, columnas' + (diag ? ' y diagonales' : '') + ' a las que les falta un solo número, y sigue con lo que queda: cada número nuevo destraba otros.'],
        ['El cuadro completo (es el único que cumple): ' + sol.map(fl => fl.join(' ')).join(' / ') + '.'],
        ['Entonces ', v('a', `a = ${vals[0]}`), ', ', v('b', `b = ${vals[1]}`), ' y ', v('c', `c = ${vals[2]}`), `: ${expr.replace(/[abc]/g, t => vals[LET.indexOf(t)])} = ${num(correcta)}.`],
      ],
      figuraSolucion: { svg: figuraCuadro(sol.flat().map(String), {}, n, tam), alt: 'Cuadro completo. ' + altCuadro(sol.flat().map(String), {}, n) + '.' },
      respuesta: { valor: correcta, unidad: '' },
      _datos: d,
    };
  }

  // =====================================================================
  // 6. Filas crecientes: la columna de suma extrema
  // =====================================================================
  // En posiciones 1…rc. Máximo: la fila t (desde 0) pone en la columna j el número rc − (c − j) − t(c − j + 1);
  // mínimo: j + t · j.
  function columnaExtrema(r, c, j, pide) {
    const N = r * c, vals = [];
    for (let t = 0; t < r; t++) vals.push(pide === 'max' ? N - (c - j) - t * (c - j + 1) : j + t * j);
    return { suma: vals.reduce((a, b) => a + b, 0), vals };
  }
  function construirCrecientes(rng, semilla) {
    for (let intento = 0; intento < 100; intento++) {
      const [r, c] = rng.elegir([[3, 3], [3, 4], [4, 3], [3, 5], [3, 4]]);
      const j = rng.entero(2, c - 1 >= 2 ? c - 1 : 2);
      const pide = rng.sig() < 0.65 ? 'max' : 'min';
      const m = rng.elegir([1, 1, 1, 2, 5, 10]), dd = m === 1 ? rng.elegir([1, 1, 2]) : rng.elegir([1, 2, 5]);
      const d = { tipo: 'crecientes', r, c, j, pide, m, d: dd };
      const p = armarCrecientes(d, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function armarCrecientes(d, rng, semilla) {
    const { r, c, j, pide, m } = d, dd = d.d, N = r * c;
    const map = k => m + (k - 1) * dd, sumaMap = ks => ks.reduce((s, k) => s + map(k), 0);
    const { vals } = columnaExtrema(r, c, j, pide);
    const correcta = sumaMap(vals);
    const numeros = Array.from({ length: N }, (_, i) => map(i + 1));
    const errores = [];
    const extremos = pide === 'max' ? Array.from({ length: r }, (_, t) => N - t) : Array.from({ length: r }, (_, t) => t + 1);
    errores.push(h('RMP63-sin-orden', sumaMap(extremos), `Pusiste en la columna los ${r} números ${pide === 'max' ? 'mayores' : 'menores'}, pero cada fila debe crecer: a la ${pide === 'max' ? 'derecha' : 'izquierda'} de cada uno tiene${(pide === 'max' ? c - j : j - 1) === 1 ? '' : 'n'} que caber ${pide === 'max' ? c - j : j - 1} ${(pide === 'max' ? c - j : j - 1) === 1 ? 'número' : 'números'} ${pide === 'max' ? 'mayor' : 'menor'}${(pide === 'max' ? c - j : j - 1) === 1 ? '' : 'es'}.`));
    const vecina = pide === 'max' ? (j < c ? columnaExtrema(r, c, j + 1, 'max').vals : null) : (j > 1 ? columnaExtrema(r, c, j - 1, 'min').vals : null);
    const lug = k => `${k} ${k === 1 ? 'lugar' : 'lugares'}`;
    if (vecina) errores.push(h('RMP1-un-lugar', sumaMap(vecina), `Dejaste ${lug(pide === 'max' ? c - j - 1 : j - 2)} a la ${pide === 'max' ? 'derecha' : 'izquierda'} en vez de ${pide === 'max' ? c - j : j - 1}: contaste mal las casillas que quedan en la fila.`));
    errores.push(h('RMP2-natural', sumaMap(Array.from({ length: r }, (_, t) => t * c + j)), 'Llenaste el cuadro en orden, fila por fila, y sumaste la columna. Ese es un arreglo posible, pero no el que da la suma ' + (pide === 'max' ? 'mayor.' : 'menor.')));
    errores.push(h('RMP2-por-columnas', sumaMap(Array.from({ length: r }, (_, t) => (j - 1) * r + t + 1)), 'Llenaste el cuadro en orden, columna por columna. Ese arreglo cumple, pero no da la suma ' + (pide === 'max' ? 'mayor.' : 'menor.')));
    const alternativas = P.armar({ correcta, errores, rng });
    if (alternativas.length < 4) return null;
    // Un arreglo que lo logra: en cada fila, el de la columna j y a su lado los que le tocan.
    const filas = [];
    const usados = new Set(vals);
    const resto = Array.from({ length: N }, (_, i) => i + 1).filter(k => !usados.has(k));
    for (let t = 0; t < r; t++) {
      const x = vals[t];
      let der, izq;
      if (pide === 'max') { der = Array.from({ length: c - j }, (_, u) => x + 1 + u); der.forEach(k => resto.splice(resto.indexOf(k), 1)); izq = null; }
      else { izq = Array.from({ length: j - 1 }, (_, u) => x - (j - 1) + u); izq.forEach(k => resto.splice(resto.indexOf(k), 1)); der = null; }
      filas.push({ x, der, izq });
    }
    // Lo que falta se reparte en orden creciente donde quepa.
    for (const fila of filas) {
      if (pide === 'max') { const menores = resto.filter(k => k < fila.x).slice(0, j - 1); menores.forEach(k => resto.splice(resto.indexOf(k), 1)); fila.izq = menores; }
      else { const mayores = resto.filter(k => k > fila.x).slice(-(c - j)); mayores.forEach(k => resto.splice(resto.indexOf(k), 1)); fila.der = mayores; }
    }
    const arreglo = filas.map(fl => [...fl.izq, fl.x, ...fl.der]);
    const valido = arreglo.every(fl => fl.length === c && fl.every((k, i) => i === 0 || fl[i - 1] < k));
    if (!valido) return null;
    const tam = 46, W = c * tam + 20;
    let fig = '';
    for (let t = 0; t < r; t++) for (let u = 0; u < c; u++) fig += caja(10 + u * tam, 10 + t * tam, tam, tam, u === j - 1 ? 'fill:var(--c-o);fill-opacity:0.18' : 'fill:var(--card)');
    fig += texto(10 + (j - 1) * tam + tam / 2, r * tam + 34, `columna ${j}`, 14, 'fill:var(--c-o)');
    const lista_ = lista(numeros.length > 8 ? [numeros[0], numeros[1], numeros[2], '…', numeros[N - 1]].map(String) : numeros.map(String));
    const arrTxt = arreglo.map(fl => fl.map(map).join(' < ')).join(' / ');
    return {
      id: `rm-arreglos#${semilla}`,
      variables: { j: { nombre: 'columna pedida', color: 'o' }, k: { nombre: 'lugares que deben quedar', color: 'i' }, s: { nombre: 'suma de la columna', color: 'h' } },
      enunciado: [`Los ${N} números ${numeros.length > 8 ? `${numeros[0]}, ${numeros[1]}, ${numeros[2]}, …, ${numeros[N - 1]} (de ${dd} en ${dd})` : lista_} se escriben, uno por casilla, en un cuadro de ${r} filas y ${c} columnas, de modo que en cada fila crezcan de izquierda a derecha.`],
      figura: { svg: SVG(W, r * tam + 44, fig), alt: `Cuadro vacío de ${r} filas y ${c} columnas, con la columna ${j} (contando desde la izquierda) sombreada.` },
      pregunta: ['¿Cuál es la ', pide === 'max' ? 'mayor' : 'menor', ' suma posible de los números de la ', v('j', `columna ${j}`), '?'],
      datos: '', alternativas,
      solucion: [
        [`En cada fila, el número de la columna ${j} tiene `, v('k', `${pide === 'max' ? c - j : j - 1} ${pide === 'max' ? 'números mayores a su derecha' : 'números menores a su izquierda'}`), '.'],
        [pide === 'max' ? `Para la mayor suma, el más grande posible de la columna es el ${map(vals[0])} (a su derecha van los ${c - j} mayores). El siguiente tiene que dejar libres otros ${c - j} mayores que él, y así: ` : `Para la menor suma, el más chico posible es el ${map(vals[0])} (a su izquierda van ${j - 1} menores). El siguiente tiene que dejar ${j - 1} menores más, y así: `,
          v('s', `${vals.map(map).join(' + ')} = ${correcta}`), '.'],
        [`Un arreglo que lo logra (filas): ${arrTxt}.`],
      ],
      respuesta: { valor: correcta, unidad: '' },
      _datos: d,
    };
  }

  // =====================================================================
  // 7. Paridad en un tablero
  // =====================================================================
  function maxPares(r, c, bloq) {
    const libre = (i, j) => i >= 0 && j >= 0 && i < r && j < c && !bloq.some(([a, b]) => a === i && b === j);
    const visto = new Set(), comps = [];
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) {
      if (!libre(i, j) || visto.has(i * c + j)) continue;
      const cola = [[i, j]]; visto.add(i * c + j);
      let A = 0, B = 0, primero = (i + j) % 2;
      while (cola.length) {
        const [a, b] = cola.shift();
        if ((a + b) % 2 === primero) A++; else B++;
        for (const [x, y] of [[a + 1, b], [a - 1, b], [a, b + 1], [a, b - 1]]) if (libre(x, y) && !visto.has(x * c + y)) { visto.add(x * c + y); cola.push([x, y]); }
      }
      comps.push({ A, B, color: primero });
    }
    return { max: comps.reduce((s, k) => s + Math.max(k.A, k.B), 0), comps };
  }
  function construirParidad(rng, semilla) {
    for (let intento = 0; intento < 300; intento++) {
      const r = rng.entero(3, 5), c = rng.entero(3, 5);
      const nb = rng.entero(1, 4);
      const bloq = [];
      while (bloq.length < nb) { const z = [rng.entero(0, r - 1), rng.entero(0, c - 1)]; if (!bloq.some(([a, b]) => a === z[0] && b === z[1])) bloq.push(z); }
      bloq.sort((x, y) => x[0] - y[0] || x[1] - y[1]);
      const d = { tipo: 'paridad', r, c, bloqueadas: bloq };
      const p = armarParidad(d, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function armarParidad(d, rng, semilla) {
    const { r, c, bloqueadas: bloq } = d;
    const libres = r * c - bloq.length;
    if (libres < 6) return null;
    const M = maxPares(r, c, bloq);
    const errores = [];
    errores.push(h('RMP66-mitad', Math.floor(libres / 2), `Pensaste en mitad y mitad (${libres} ÷ 2). Los pares tienen que alternarse con los impares como en un tablero de ajedrez, y un color puede tener más casillas que el otro.`));
    errores.push(h('RMP66-mitad', Math.ceil(libres / 2), `Pensaste en mitad y mitad redondeando hacia arriba (${libres} ÷ 2). Hay que contar las casillas de cada color del ajedrezado, una por una.`));
    errores.push(h('RMP63-sin-bloqueadas', Math.ceil(r * c / 2), `Contaste como si el tablero de ${r} × ${c} estuviera completo. Las casillas negras no llevan número.`));
    const primer = M.comps.reduce((s, k) => s + k.A, 0);
    errores.push(h('RMP66-primer-color', primer, 'Pusiste pares en el color de la primera casilla libre sin comparar con el otro color.'));
    let ajA = 0, ajB = 0;
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) if (!bloq.some(([a, b]) => a === i && b === j)) { if ((i + j) % 2 === 0) ajA++; else ajB++; }
    if (M.comps.length > 1) errores.push(h('RMP66-un-color', Math.max(ajA, ajB), 'Elegiste un solo color para todo el tablero. Las casillas negras lo parten en zonas separadas, y en cada zona se elige el color que más casillas tiene.'));
    errores.push(h('RMP66-todos-juntos', libres - M.comps.length, 'Supusiste que basta un impar por zona y que los pares pueden ir juntos. Dos pares vecinos suman par: no pueden estar lado a lado.'));
    const alternativas = P.armar({ correcta: M.max, errores, rng });
    if (alternativas.length < 4) return null;
    const tam = 46, W = c * tam + 20;
    let fig = '';
    const esB = (i, j) => bloq.some(([a, b]) => a === i && b === j);
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) fig += caja(10 + j * tam, 10 + i * tam, tam, tam, esB(i, j) ? 'fill:currentColor' : 'fill:var(--card)');
    let figS = '';
    // Solución: en cada zona, los pares en el color con más casillas.
    const visto = new Set(), elegido = {};
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) {
      if (esB(i, j) || visto.has(i * c + j)) continue;
      const cola = [[i, j]], miembros = []; visto.add(i * c + j);
      while (cola.length) { const [a, b] = cola.shift(); miembros.push([a, b]); for (const [x, y] of [[a + 1, b], [a - 1, b], [a, b + 1], [a, b - 1]]) if (x >= 0 && y >= 0 && x < r && y < c && !esB(x, y) && !visto.has(x * c + y)) { visto.add(x * c + y); cola.push([x, y]); } }
      const A = miembros.filter(([a, b]) => (a + b) % 2 === 0).length;
      const par = A >= miembros.length - A ? 0 : 1;
      miembros.forEach(([a, b]) => { elegido[a * c + b] = (a + b) % 2 === par; });
    }
    for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) {
      const x0 = 10 + j * tam, y0 = 10 + i * tam;
      figS += caja(x0, y0, tam, tam, esB(i, j) ? 'fill:currentColor' : elegido[i * c + j] ? 'fill:var(--c-o);fill-opacity:0.25' : 'fill:var(--card)');
      if (!esB(i, j)) figS += texto(x0 + tam / 2, y0 + tam / 2 + 6, elegido[i * c + j] ? 'P' : 'I', 16, elegido[i * c + j] ? 'fill:var(--c-o);font-weight:700' : 'fill:currentColor');
    }
    const bl = bloq.map(([a, b]) => `fila ${a + 1}, columna ${b + 1}`).join('; ');
    return {
      id: `rm-arreglos#${semilla}`,
      variables: { P: { nombre: 'casillas con par', color: 'o' } },
      enunciado: [`En el tablero de ${r} × ${c}, las casillas negras no se usan. En cada casilla blanca se escribe un número entero positivo, de modo que dos casillas blancas que comparten un lado sumen siempre un número impar.`],
      figura: { svg: SVG(W, r * tam + 20, fig), alt: `Tablero de ${r} filas y ${c} columnas. Casillas negras (sin número): ${bl}. Las demás, ${libres}, son blancas.` },
      pregunta: ['¿Cuántos números pares, como máximo, se pueden escribir?'],
      datos: '', alternativas,
      solucion: [
        ['Para que dos vecinas sumen impar, una debe ser par y la otra impar: pares e impares se alternan como los colores de un tablero de ajedrez.'],
        [M.comps.length > 1 ? `Las casillas negras separan el tablero en ${M.comps.length} zonas. En cada zona los colores se alternan solos, y se elige poner los pares en el color que tiene más casillas: ` : 'Todas las casillas blancas están conectadas. Se cuentan las de cada color del ajedrezado y los pares van en el color con más casillas: ',
          M.comps.map(k => `${Math.max(k.A, k.B)} de ${k.A + k.B}`).join(' + '), ' = ', v('P', String(M.max)), '.'],
      ],
      figuraSolucion: { svg: SVG(W, r * tam + 20, figS), alt: 'Una forma de lograrlo: P marca las casillas con número par e I las de impar. ' + Array.from({ length: r }, (_, i) => `fila ${i + 1}: ` + Array.from({ length: c }, (_, j) => (esB(i, j) ? 'negra' : elegido[i * c + j] ? 'P' : 'I')).join(', ')).join('; ') + '.' },
      respuesta: { valor: M.max, unidad: '' },
      _datos: d,
    };
  }

  // =====================================================================
  // 8. Butacas en zigzag
  // =====================================================================
  const numeroEn = (c, fila, pos) => (fila - 1) * c + (fila % 2 === 1 ? pos : c - pos + 1); // pos 1…c desde la izquierda
  const butaca = (c, n) => { const fila = Math.ceil(n / c), k = n - (fila - 1) * c; return { fila, pos: fila % 2 === 1 ? k : c - k + 1 }; };
  function construirAsientos(rng, semilla) {
    for (let intento = 0; intento < 100; intento++) {
      const c = rng.entero(6, 12);
      const fila = rng.entero(4, 9), pos = rng.entero(2, c - 1);
      const n = numeroEn(c, fila, pos);
      const pide = rng.sig() < 0.6 ? 'detras' : 'delante';
      const d = { tipo: 'asientos', c, n, pide };
      const p = armarAsientos(d, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function armarAsientos(d, rng, semilla) {
    const { c, n, pide } = d;
    const { fila, pos } = butaca(c, n);
    const otra = pide === 'detras' ? fila + 1 : fila - 1, contra = pide === 'detras' ? fila - 1 : fila + 1;
    const correcta = numeroEn(c, otra, pos);
    const errores = [
      h('RMP67-valor', pide === 'detras' ? n + 1 : n - 1, `Ese es el número ${pide === 'detras' ? 'siguiente' : 'anterior'} a ${n}, el más cercano en valor; está al costado, en la misma fila, no ${pide === 'detras' ? 'detrás' : 'delante'}.`),
      h('RMP63-sin-zigzag', pide === 'detras' ? n + c : n - c, `${pide === 'detras' ? 'Sumaste' : 'Restaste'} ${c} como si todas las filas se numeraran de izquierda a derecha. La numeración va en zigzag: una fila sí y otra no, se cuenta de derecha a izquierda.`),
      h('RMP64-sentido', numeroEn(c, contra, pos), `Ese número está ${pide === 'detras' ? 'delante' : 'detrás'} de ${n}, no ${pide === 'detras' ? 'detrás' : 'delante'}. La fila 1 es la más cercana al escenario.`),
      h('RMP1-reflejo', numeroEn(c, otra, pos) + (otra % 2 === 0 ? 1 : -1), 'Hiciste bien el zigzag, pero te corriste una butaca al reflejar la fila: cuenta la posición desde el mismo borde.'),
    ];
    const alternativas = P.armar({ correcta, errores, rng });
    if (alternativas.length < 4) return null;
    const ancho = Math.min(30, Math.floor(340 / c)), W = c * ancho + 20;
    let fig = `<rect x="10" y="6" width="${c * ancho}" height="20" style="fill:var(--muted);fill-opacity:0.35"/>` + texto(10 + c * ancho / 2, 21, 'ESCENARIO', 13);
    for (let fl = 1; fl <= 3; fl++) for (let p = 1; p <= c; p++) {
      const x0 = 10 + (p - 1) * ancho, y0 = 34 + (fl - 1) * 34;
      fig += caja(x0 + 1, y0, ancho - 2, 28);
      fig += texto(x0 + ancho / 2, y0 + 19, String(numeroEn(c, fl, p)), 14);
    }
    for (const dy of [0, 7, 14]) fig += `<circle cx="${10 + c * ancho / 2}" cy="${34 + 3 * 34 + 4 + dy}" r="2" style="fill:currentColor"/>`;
    const filaTxt = fl => `fila ${fl}: ` + Array.from({ length: c }, (_, p) => numeroEn(c, fl, p + 1)).join(', ');
    return {
      id: `rm-arreglos#${semilla}`,
      variables: { n: { nombre: 'butaca dada', color: 'o' }, f: { nombre: 'fila', color: 'i' }, x: { nombre: 'butaca buscada', color: 'h' } },
      enunciado: [`En un auditorio, cada fila tiene ${c} butacas y se numeran como muestra el dibujo, siguiendo el mismo patrón en todas las filas. La fila 1 es la más cercana al escenario.`],
      figura: { svg: SVG(W, 34 + 3 * 34 + 24, fig), alt: `Escenario arriba. Debajo, las tres primeras filas de ${c} butacas, de izquierda a derecha en el dibujo: ${filaTxt(1)}; ${filaTxt(2)}; ${filaTxt(3)}. Siguen más filas.` },
      pregunta: ['¿Qué número tiene la butaca que está justo ', pide === 'detras' ? 'detrás' : 'delante', ' de la ', v('n', String(n)), '?'],
      datos: '', alternativas,
      solucion: [
        ['Las filas impares van de izquierda a derecha y las pares de derecha a izquierda (zigzag).'],
        [`La butaca ${n} está en la `, v('f', `fila ${fila}`), ` (porque ${(fila - 1) * c} < ${n} ≤ ${fila * c}), en el lugar ${pos} contando desde la izquierda.`],
        [`Justo ${pide === 'detras' ? 'detrás' : 'delante'} está el lugar ${pos} de la fila ${otra}, que ${otra % 2 === 1 ? 'va de izquierda a derecha' : 'va de derecha a izquierda'}: `, otra % 2 === 1 ? `${(otra - 1) * c} + ${pos}` : `${(otra - 1) * c} + (${c} − ${pos} + 1)`, ' = ', v('x', String(correcta)), '.'],
      ],
      respuesta: { valor: correcta, unidad: '' },
      _datos: d,
    };
  }

  // =====================================================================
  const TIPOS = { multiplicativo: construirMultiplicativo, vertices: construirVertices, piramide: construirPiramide, fila: construirFila,
    latino: construirLatino, crecientes: construirCrecientes, paridad: construirParidad, asientos: construirAsientos };
  const SORTEO = ['multiplicativo', 'multiplicativo', 'vertices', 'piramide', 'fila', 'latino', 'latino', 'crecientes', 'paridad', 'asientos'];
  function generar(semilla) {
    const rng = Azar.crear('rm-arreglos|' + semilla);
    const tipo = rng.elegir(SORTEO);
    for (let intento = 0; intento < 20; intento++) {
      const p = TIPOS[tipo](rng, semilla);
      if (p && p.alternativas.length >= 4) return p;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  return {
    id: 'rm-arreglos', titulo: 'Cuadros, pirámides y filas de números', generar,
    calc: { magicoDesde, completarMultiplicativo, sumasVertices, extremoVertices, cotaVertices, cima, coeficientes, sumaFila, resolverLatino, columnaExtrema, maxPares, butaca, numeroEn },
  };
});
