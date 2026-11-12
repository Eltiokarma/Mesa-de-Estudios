/*
 * Generador: ¿de cuántas maneras se lee una palabra (o un número) en un arreglo de letras?
 * Razonamiento matemático, rutas y visualización espacial. Formato "predicciones"
 * (docs/arquitectura.md). Funciona en el navegador (window.Generadores['rm-lectura-palabras']) y en Node.
 *
 * Una lectura es un camino de letra en letra que deletrea la palabra. Vecindad:
 *   'diag'  filas en zigzag (cada letra entre dos de la fila de abajo; en los rombos con a ≠ b las filas
 *           no quedan centradas); de una letra se pasa a la de abajo a la izquierda o a la de abajo a la derecha.
 *   'rd'    cuadrícula; de una letra se pasa a la de la derecha o a la de abajo.
 * El cálculo es el de Pascal (el mismo del tablero de los caminos, plantillas/binomio-newton/): sobre cada
 * letra se escribe cuántas lecturas llegan a ella, y cada una suma lo que le llega de sus vecinas de arriba
 * (o de la izquierda y de arriba). Programación dinámica sobre la rejilla.
 *
 * Tipos y sus _datos (todos con { tipo, palabra, forma, mov, ... }):
 *   triangulo   fila f con f + 1 letras iguales; se empieza arriba. 2^(n − 1). { n }
 *   rombo       rectángulo girado 45° de a × b pasos (rombo si a = b); de arriba hasta abajo. C(a + b, a). { a, b }
 *   palindromo  palabra que se lee igual al derecho y al revés, en un rombo o un triángulo; se puede leer de
 *               arriba abajo o de abajo arriba. Con iguales = true, una lectura y la misma al revés (mismas
 *               casillas) cuentan como una sola; con false, se cuentan aparte. { base, sentidos: 2, iguales, a, b | n }
 *   cuadricula  cuadrícula de filas × columnas, o escalonada (banda: solo casillas con −bajo ≤ j − i ≤ alto);
 *               de la esquina de arriba a la izquierda a la de abajo a la derecha. { filas, columnas, banda }
 *   bloques     dos tramos unidos por una sola letra: arriba un triángulo invertido (se empieza en cualquier
 *               letra de la primera fila) o un rombo; abajo un triángulo o un rombo. Se multiplican.
 *               { arriba: { tipo, k }, abajo: { tipo, k } }
 *   tapada      un triángulo, un rombo o una cuadrícula con una casilla tapada (■) por la que no se pasa:
 *               total − (llegan × salen). { base, ..., tapada: [fila, posición en la fila] (desde 1) }
 *
 *   doble       palabra que empieza con dos letras iguales (LLOVIZNA) en un arreglo triangular de letras donde la fila k
 *               tiene k + 1 casillas y trae la k-ésima letra (la fila 1 tiene dos casillas). Vecinas a igual distancia
 *               mínima: las dos de al lado en la misma fila y las dos de arriba y las dos de abajo. Se puede volver a
 *               pasar por una casilla. { palabra }  (UNMSM 2024-I; semilla 'unmsm-2024-I-28'.)
 *   malla       dos mallas intercaladas: las letras de una palabra X Z Y Z (… ) con las de lugar par en una malla de
 *               filas × columnas y la letra Z en todas las casillas de otra malla corrida media casilla a la derecha
 *               y media hacia abajo. Vecinas a igual distancia mínima: las cuatro en diagonal. Se puede volver a pasar
 *               por una casilla (ida y vuelta). { palabra, filas, columnas, letras: [[..]] }  (UNMSM 2025-II;
 *               semilla 'unmsm-2025-II-29'.)
 *
 * calc (puras, sin azar):
 *   doble({ palabra }) → { total, soloAbajo (las lecturas que siempre bajan), numeros (por fila, lo que llega a cada
 *                          letra), n }
 *   malla({ palabra, filas, columnas, letras }) → { total, sinRepetir, soloAbajo, porInicio: [{ fila, columna, n }], … }
 *   arreglo(spec)  → { filas: [[{ c, l }]] (c: columna, en medias casillas si mov = 'diag'), mov }.
 *   lecturas(spec) → { total, numeros (por fila, lo que llega a cada letra de arriba abajo), llegan, salen }
 *                    (llegan y salen, solo si hay tapada: lecturas que llegan a la tapada y que salen de ella).
 *
 * Errores: AR18-solo-rectas (enumeración sin sistema: solo las lecturas por los bordes; parcial,
 * docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md). Hipótesis: RMP1 (letras contra pasos: n
 * decisiones en vez de n − 1), RMP45 (contar dos veces la lectura común: una lectura y la misma al revés),
 * RMP46 (olvidar restar lo que no vale: la casilla tapada o las casillas que no están), RMP81 (multiplicar
 * donde no va: 2 por paso aunque en los bordes haya una sola salida, o pasos por pasos), RMP82 (contar las
 * casillas en vez de los caminos), RMP83 (sumar opciones, tramos o caminos que se combinan, en vez de
 * multiplicarlos) y RMP84 (contar solo una parte: hasta la fila ancha, un tramo, solo el centro, una lectura
 * por letra final, un solo sentido o solo las lecturas que bajan). Nuevas (cierre-100): RMP113 (un solo caso de
 * comienzo en las dos L), RMP114 (una sola L arriba), RMP115 (no volver a pasar por una casilla) y RMP116 (una
 * sola letra de salida, multiplicada).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'rm-lectura-palabras';
  const RM = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const par = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: RM });
  const v = P.v;
  const f = x => P.formatear(x, 0);
  const comb = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };

  const PALABRAS = {
    4: ['PUNO', 'LIMA', 'PERU', 'INTI', 'LAGO', 'PUNA', 'MAIZ', 'ROCA', '1821', '2026'],
    5: ['CUSCO', 'TACNA', 'COMBI', 'FERIA', 'LLAMA', 'ANDES', 'PAPAS', 'TRIGO', '13579', '24680'],
    6: ['CALLAO', 'ALPACA', 'QUINUA', 'CANCHA', 'CHOCLO', 'CHULLO', 'TUMBES', '314159'],
    7: ['JULIACA', 'CEVICHE', 'MERCADO', 'COLEGIO', 'AYAVIRI', '1234567'],
    8: ['AREQUIPA', 'TITICACA', 'CHUCUITO', '20262027'],
  };
  const PALINDROMOS = { 5: ['RADAR', 'SOMOS', 'SALAS', 'SERES', 'NADAN', 'ORURO', '12321', '40504'], 7: ['ANILINA', '1234321', '7654567'], 9: ['RECONOCER', 'SOMETEMOS'] };
  const esNumero = w => /^\d+$/.test(w);
  const que = w => (esNumero(w) ? `el número ${w}` : `la palabra ${w}`);

  // ---------- arreglos ----------
  // Cada fila es una lista de casillas { c, l } (c en medias casillas para 'diag').
  function arreglo(spec) {
    const w = spec.palabra, filas = [];
    const fila = (fi, cs) => { filas[fi] = cs.map(c => ({ c, l: w[fi] })); };
    if (spec.forma === 'triangulo') {
      for (let fi = 0; fi < spec.n; fi++) fila(fi, Array.from({ length: fi + 1 }, (_, j) => 2 * j - fi));
    } else if (spec.forma === 'rombo') {
      for (let fi = 0; fi <= spec.a + spec.b; fi++) {
        const cs = [];
        for (let i = 0; i <= spec.a; i++) { const j = fi - i; if (j >= 0 && j <= spec.b) cs.push(j - i); }
        fila(fi, cs.sort((x, y) => x - y));
      }
    } else if (spec.forma === 'cuadricula') {
      const [bajo, alto] = spec.banda || [spec.filas, spec.columnas];
      for (let i = 0; i < spec.filas; i++) {
        const cs = [];
        for (let j = 0; j < spec.columnas; j++) if (j - i >= -bajo && j - i <= alto) cs.push(j);
        filas[i] = cs.map(j => ({ c: j, l: w[i + j] }));
      }
    } else if (spec.forma === 'bloques') {
      const { arriba, abajo } = spec;
      let fi = 0;
      // Arriba: triángulo invertido (k + 1 letras en la primera fila) o rombo de k × k, que termina en una letra.
      const alto = arriba.tipo === 'invertido' ? arriba.k : 2 * arriba.k;
      for (; fi <= alto; fi++) {
        let cs = [];
        if (arriba.tipo === 'invertido') { const m = arriba.k - fi; cs = Array.from({ length: m + 1 }, (_, j) => 2 * j - m); }
        else { for (let i = 0; i <= arriba.k; i++) { const j = fi - i; if (j >= 0 && j <= arriba.k) cs.push(j - i); } cs.sort((x, y) => x - y); }
        fila(fi, cs);
      }
      const bajoF = abajo.tipo === 'triangulo' ? abajo.k : 2 * abajo.k;
      for (let g = 1; g <= bajoF; g++, fi++) {
        let cs = [];
        if (abajo.tipo === 'triangulo') cs = Array.from({ length: g + 1 }, (_, j) => 2 * j - g);
        else { for (let i = 0; i <= abajo.k; i++) { const j = g - i; if (j >= 0 && j <= abajo.k) cs.push(j - i); } cs.sort((x, y) => x - y); }
        fila(fi, cs);
      }
    }
    if (spec.tapada) { const [fi, p] = spec.tapada; filas[fi - 1][p - 1].l = '■'; }
    return { filas, mov: spec.forma === 'cuadricula' ? 'rd' : 'diag' };
  }
  // Programación dinámica de arriba abajo: lo que llega a cada casilla (las tapadas, 0).
  function dp(A, desdeArriba = true) {
    const { filas, mov } = A, N = filas.length;
    const num = filas.map(r => r.map(() => 0));
    const orden = desdeArriba ? [...Array(N).keys()] : [...Array(N).keys()].reverse();
    for (const fi of orden) {
      const r = filas[fi];
      if (mov === 'rd') {
        // en la cuadrícula, «arriba» es la fila anterior en la misma columna y «antes» la casilla de la izquierda
        const idx = desdeArriba ? [...r.keys()] : [...r.keys()].reverse();
        for (const k of idx) {
          if (r[k].l === '■') { num[fi][k] = 0; continue; }
          const c = r[k].c;
          const vert = desdeArriba ? fi - 1 : fi + 1, hor = desdeArriba ? c - 1 : c + 1;
          let s = 0;
          const fv = filas[vert]; if (fv) { const q = fv.findIndex(x => x.c === c); if (q >= 0) s += num[vert][q]; }
          const qh = r.findIndex(x => x.c === hor); if (qh >= 0) s += num[fi][qh];
          const inicio = desdeArriba ? (fi === 0 && k === 0) : (fi === N - 1 && k === r.length - 1);
          num[fi][k] = inicio ? 1 : s;
        }
      } else {
        const ant = desdeArriba ? fi - 1 : fi + 1;
        r.forEach((x, k) => {
          if (x.l === '■') { num[fi][k] = 0; return; }
          if (!filas[ant]) { num[fi][k] = 1; return; }  // primera fila (o última, al revés): cada letra es un comienzo
          num[fi][k] = filas[ant].reduce((s, y, q) => s + (Math.abs(y.c - x.c) === 1 ? num[ant][q] : 0), 0);
        });
      }
    }
    return num;
  }
  function lecturas(spec) {
    const A = arreglo(spec);
    const num = dp(A), N = A.filas.length;
    const ult = A.mov === 'rd' ? [num[N - 1][num[N - 1].length - 1]] : num[N - 1];
    let total = ult.reduce((s, x) => s + x, 0);
    const out = { numeros: num };
    if (spec.tapada) {
      const sinT = { ...spec }; delete sinT.tapada;
      const B = arreglo(sinT), d1 = dp(B), d2 = dp(B, false);
      const [fi, p] = spec.tapada;
      out.llegan = d1[fi - 1][p - 1]; out.salen = d2[fi - 1][p - 1];
      out.sinTapar = lecturas(sinT).total;
    }
    if (spec.forma !== undefined && spec.sentidos === 2 && !spec.iguales) total *= 2;
    out.total = total;
    return out;
  }

  // ---------- doble: triángulo de k + 1 casillas por fila, con vecinas también en la misma fila ----------
  function doble({ palabra }) {
    const n = palabra.length, filas = [];
    for (let k = 1; k <= n; k++) filas.push(Array.from({ length: k + 1 }, (_, j) => ({ c: 2 * j - k, l: palabra[k - 1] })));
    // vecinas: misma fila a 2 medias casillas; filas seguidas a 1
    const vec = (fi, c) => {
      const out = [];
      for (const [fj, r] of filas.entries()) r.forEach((y, q) => {
        if ((fj === fi && Math.abs(y.c - c) === 2) || (Math.abs(fj - fi) === 1 && Math.abs(y.c - c) === 1)) out.push([fj, q]);
      });
      return out;
    };
    // pasos[t][fi][q]: lecturas de las t + 1 primeras letras que terminan en esa casilla
    let act = filas.map(r => r.map(x => (x.l === palabra[0] ? 1 : 0)));
    const porFila = [act];
    for (let t = 1; t < n; t++) {
      const sig = filas.map(r => r.map(() => 0));
      filas.forEach((r, fi) => r.forEach((x, q) => {
        if (!act[fi][q]) return;
        for (const [fj, k] of vec(fi, x.c)) if (filas[fj][k].l === palabra[t]) sig[fj][k] += act[fi][q];
      }));
      act = sig; porFila.push(act);
    }
    const total = act.flat().reduce((a, b) => a + b, 0);
    // numeros[fi]: lecturas de las fi + 1 primeras letras que terminan en cada casilla de la fila fi + 1
    const numeros = filas.map((r, fi) => r.map((x, q) => (fi === 0 ? 0 : porFila[fi][fi][q])));
    return { total, soloAbajo: 2 ** n, filas, numeros, n };
  }

  // ---------- malla: dos mallas intercaladas, vecinas en diagonal ----------
  // Posiciones en medias casillas: las letras de la malla A en (2·columna, 2·fila), las de la B (todas Z) en
  // (2·columna + 1, 2·fila + 1). Dos casillas son vecinas si están a una media casilla en cada eje.
  function mallaCasillas(spec) {
    const cs = [];
    for (let r = 0; r < spec.filas; r++) for (let c = 0; c < spec.columnas; c++) {
      cs.push({ x: 2 * c, y: 2 * r, l: spec.letras[r][c], tipo: 'A', fila: r, col: c });
      cs.push({ x: 2 * c + 1, y: 2 * r + 1, l: spec.palabra[1], tipo: 'B', fila: r, col: c });
    }
    return cs;
  }
  function malla(spec) {
    const w = spec.palabra, cs = mallaCasillas(spec);
    const vec = cs.map(a => cs.map((b, j) => (Math.abs(a.x - b.x) === 1 && Math.abs(a.y - b.y) === 1 ? j : -1)).filter(j => j >= 0));
    // lecturas: todas, las que no repiten casilla y las que siempre bajan
    const total = (i, t) => (cs[i].l !== w[t] ? 0 : t === w.length - 1 ? 1 : vec[i].reduce((s, j) => s + total(j, t + 1), 0));
    const sin = (i, t, usadas) => {
      if (cs[i].l !== w[t] || usadas.has(i)) return 0;
      if (t === w.length - 1) return 1;
      usadas.add(i);
      const r = vec[i].reduce((s, j) => s + sin(j, t + 1, usadas), 0);
      usadas.delete(i);
      return r;
    };
    const baja = (i, t) => (cs[i].l !== w[t] ? 0 : t === w.length - 1 ? 1 : vec[i].filter(j => cs[j].y > cs[i].y).reduce((s, j) => s + baja(j, t + 1), 0));
    const porInicio = [];
    cs.forEach((c, i) => { if (c.l === w[0] && c.tipo === 'A') porInicio.push({ fila: c.fila + 1, columna: c.col + 1, n: total(i, 0) }); });
    const tot = porInicio.reduce((s, x) => s + x.n, 0);
    let sinRepetir = 0, soloAbajo = 0;
    cs.forEach((c, i) => { if (c.l === w[0] && c.tipo === 'A') { sinRepetir += sin(i, 0, new Set()); soloAbajo += baja(i, 0); } });
    return { total: tot, sinRepetir, soloAbajo, porInicio, casillas: cs };
  }
  const PALABRAS_MALLA = {
    4: { O: ['LODO', 'SOLO', 'TOPO', 'MOTO', 'LOBO', 'POZO', 'LOGO', 'TORO', 'POLO', 'COLO'], A: ['CASA', 'MASA', 'PATA', 'SALA', 'LAVA', 'LANA', 'MALA', 'TAPA', 'PALA', 'CAMA', 'MATA', 'RATA'] },
    5: { O: ['SALAS', 'CASAS', 'PATAS', 'LANAS', 'MALAS', 'TAPAS', 'LOTOS'], A: ['MOTOS', 'LOBOS', 'POZOS', 'LOGOS', 'TOROS', 'POLOS', 'COLOS'] },
  };

  const figuraMalla = (spec, rotulo) => {
    const cs = mallaCasillas(spec), u = 24, W = 2 * spec.columnas * u + 40, H = 2 * spec.filas * u + 36;
    let s = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" font-family="inherit">`;
    cs.forEach(c => {
      const X = (24 + c.x * u).toFixed(1), Y = 28 + c.y * u;
      if (rotulo) s += `<text x="${X}" y="${Y}" font-size="14" text-anchor="middle" font-weight="700" style="fill:var(--c-d)">${P.xml(rotulo(c))}</text>`;
      else s += `<text x="${X}" y="${Y}" font-size="17" text-anchor="middle" ${c.tipo === 'B' ? 'style="fill:var(--c-i)"' : 'fill="currentColor"'}>${P.xml(c.l)}</text>`;
    });
    return s + '</svg>';
  };
  const altMalla = spec => {
    const cs = mallaCasillas(spec);
    const filas = [];
    for (let y = 0; y < 2 * spec.filas; y++) {
      const fila = cs.filter(c => c.y === y).sort((a, b) => a.x - b.x);
      filas.push(`fila ${y + 1}: ${fila.map(c => `${c.l} (${c.x + 1})`).join(', ')}`);
    }
    return 'Letras en filas que se alternan: una fila de la primera malla, una fila de la segunda (la que está corrida media casilla a la derecha y media hacia abajo). Cada letra es vecina de las cuatro que están en diagonal. Entre paréntesis va la posición de cada letra contada en medias casillas desde la izquierda: dos letras de filas seguidas son vecinas si sus posiciones se diferencian en 1. De arriba abajo: ' + filas.join('; ') + '.';
  };
  const figuraDoble = (d, rotulo) => {
    const A = { filas: d.filas, mov: 'diag' };
    return svgArreglo(A, rotulo);
  };
  const altDoble = d => {
    const minC = -d.n;
    return 'Arreglo triangular de letras en filas; cada letra tiene como vecinas, a igual distancia, las dos de su misma fila (la de la izquierda y la de la derecha), las dos de la fila de arriba y las dos de la de abajo que están más cerca (en los bordes puede faltar alguna). Entre paréntesis va la posición de cada letra contada en medias casillas desde la izquierda: dos letras de la misma fila son vecinas si sus posiciones se diferencian en 2, y dos de filas seguidas si se diferencian en 1. De arriba abajo: '
      + d.filas.map((r, i) => `fila ${i + 1}: ${r.map(x => `${x.l} (${x.c - minC + 1})`).join(', ')}`).join('; ') + '.';
  };

  // Errores y problema de los dos tipos nuevos
  function construirDoble(rng, semilla, spec, fuente) {
    const D = doble(spec), n = D.n, w = spec.palabra, correcta = D.total;
    const errores = [
      h('RMP113-un-caso', D.soloAbajo, 'Contaste solo las lecturas en que cada paso baja de fila (la primera L arriba y la segunda en la fila de abajo). Falta el otro comienzo: las dos L en la misma fila, una al lado de la otra.'),
      h('RMP114-una-L', D.soloAbajo / 2, 'Contaste como si arriba hubiera una sola L, como en un triángulo común. En la fila de arriba hay dos L, y desde cualquiera de ellas se puede empezar.'),
      h('RMP82-casillas', D.filas.flat().length, 'Contaste las casillas del arreglo, no los caminos que deletrean la palabra.'),
      h('RMP83-suma-opciones', 2 * (n - 1), 'Sumaste las dos opciones de cada paso (2 + 2 + …). Las opciones de pasos seguidos se combinan entre sí: se multiplican.'),
    ];
    const alternativas = P.armar({ correcta, errores, rng, decimales: 0, texto: x => f(x) });
    const nums = D.numeros;
    const filaTxt = nums.map((r, i) => (i === 0 ? null : `fila ${i + 1}: ${r.join(', ')}`)).filter(Boolean).join('; ');
    const enunciado = ['En el arreglo de la figura se quiere leer ', v('w', `la palabra ${w}`), '. Cada letra se lee pasando a una vecina a igual distancia mínima: las dos de su misma fila (la de la izquierda y la de la derecha) y las dos de la fila de arriba y las dos de la fila de abajo que están más cerca. Se puede empezar en cualquier letra.'];
    const pregunta = [`¿De cuántas maneras diferentes se puede leer la palabra ${w}?`];
    const solucion = [
      [`Las dos primeras letras son iguales (${w[0]}), y la tercera (${w[2]}) solo aparece en la fila 3. Así que la segunda ${w[1]} tiene que estar en la fila 2, la única fila de ${w[0]} que toca la fila 3.`],
      [`Comienzo A: la primera ${w[0]} en la fila 1 (2 casillas) y la segunda en la fila 2. Comienzo B: las dos en la fila 2, una al lado de la otra (2 parejas de vecinas, cada una en los dos órdenes). Las lecturas que llegan a las 3 casillas de la fila 2 son ${nums[1].join(', ')}.`],
      ['Desde ahí cada letra recibe lo que llega de sus dos vecinas de la fila de arriba (triángulo de Pascal). Lecturas que llegan a cada casilla, de arriba abajo: ' + filaTxt + '.'],
      [`En la última fila suman ${nums[n - 1].join(' + ')} = `, v('x', f(correcta)), `. Atajo: ${nums[1].reduce((a, b) => a + b, 0)} lecturas llegan a la fila 2 y cada una puede bajar de 2 formas en cada uno de los ${n - 2} pasos que quedan: ${nums[1].reduce((a, b) => a + b, 0)} · 2^${n - 2} = ${f(correcta)}.`],
    ];
    return {
      id: `${ID}#${semilla}`, variables, enunciado, pregunta, datos: fuente || '',
      figura: { svg: figuraDoble(D), alt: altDoble(D) },
      figuraSolucion: { svg: figuraDoble(D, (fi, k) => (fi === 0 ? '·' : D.numeros[fi][k])), alt: `El mismo arreglo con el número de lecturas que llega a cada casilla, de arriba abajo (la fila 1 sin número): ${D.numeros.map((r, i) => (i === 0 ? null : `fila ${i + 1}: ${r.join(' ')}`)).filter(Boolean).join('; ')}.` },
      alternativas, solucion, respuesta: { valor: correcta, unidad: 'lecturas' }, _datos: { tipo: 'doble', ...spec },
    };
  }

  function construirMalla(rng, semilla, spec, fuente) {
    const M = malla(spec), w = spec.palabra, correcta = M.total, k = M.porInicio.length;
    const cs = M.casillas;
    const errores = [];
    if (M.sinRepetir !== correcta) errores.push(h('RMP115-sin-volver', M.sinRepetir, 'Contaste solo las lecturas que no pasan dos veces por la misma casilla. El enunciado dice que se puede volver a pasar: «ida y vuelta» también cuenta, y son lecturas distintas.'));
    if (M.sinRepetir !== correcta) errores.push(h('RMP45-vuelta-doble', correcta + (correcta - M.sinRepetir), 'Contaste las lecturas que vuelven por la misma casilla dos veces: una vez con todas y otra aparte. Cada lectura es una sola, vuelva o no vuelva.'));
    if (M.soloAbajo !== correcta) errores.push(h('RMP84-solo-abajo', M.soloAbajo, 'Contaste solo las lecturas que siempre bajan. También valen las que suben, porque cada paso puede ir a cualquiera de las cuatro vecinas en diagonal.'));
    const una = M.porInicio[0].n * k;
    if (una !== correcta) errores.push(h('RMP116-una-salida', una, `Contaste las lecturas que salen de la primera ${w[0]} (${M.porInicio[0].n}) y las multiplicaste por las ${k} letras ${w[0]}. Cada ${w[0]} tiene su propia cuenta: sus vecinas no son las mismas.`));
    errores.push(h('RMP82-casillas', cs.length, 'Contaste las letras de la figura, no los caminos que deletrean la palabra.'));
    const alternativas = P.armar({ correcta, errores, rng, decimales: 0, texto: x => f(x) });
    const rot = c => (c.l === w[0] && c.tipo === 'A' ? String(M.porInicio.find(x => x.fila === c.fila + 1 && x.columna === c.col + 1).n) : '');
    const enunciado = ['En el arreglo de la figura se quiere leer ', v('w', `la palabra ${w}`), '. Cada letra se lee pasando a una vecina a igual distancia mínima (las cuatro que están en diagonal). Se puede empezar en cualquier letra, y se puede volver a pasar por una letra ya usada: ir y volver por la misma casilla cuenta como otra lectura.'];
    const pregunta = [`¿De cuántas maneras diferentes se puede leer la palabra ${w}?`];
    const lista = M.porInicio.map(x => `${x.n} (fila ${x.fila}, columna ${x.columna})`).join('; ');
    const solucion = [
      [`Cada lectura va de una ${w[0]} a una ${w[1]} vecina, luego a la ${w[2]} vecina, luego a la ${w[3]} vecina${w.length > 4 ? ', y así hasta la última letra' : ''}. Para cada letra de salida se cuentan sus caminos: sus vecinas ${w[1]}, de cada una sus vecinas ${w[2]}, y así sucesivamente.`],
      ['Una letra de un borde tiene menos vecinas en diagonal que una del centro, por eso cada letra de salida tiene su propia cuenta.'],
      [`Lecturas que salen de cada ${w[0]} (hay ${k}): ${lista}.`],
      [`Se suman: `, v('x', f(correcta)), '. En esas lecturas hay ', `${f(correcta - M.sinRepetir)} que repiten una casilla (ida y vuelta); si las dejaras fuera quedarían ${f(M.sinRepetir)}, pero el enunciado las acepta.`],
    ];
    return {
      id: `${ID}#${semilla}`, variables, enunciado, pregunta, datos: fuente || '',
      figura: { svg: figuraMalla(spec), alt: altMalla(spec) },
      figuraSolucion: { svg: figuraMalla(spec, rot), alt: `Las mismas letras; sobre cada ${w[0]} de la primera malla, el número de lecturas que salen de ella: ${lista}.` },
      alternativas, solucion, respuesta: { valor: correcta, unidad: 'lecturas' }, _datos: { tipo: 'malla', ...spec },
    };
  }
  function datosMalla(rng) {
    const filas = rng.entero(3, 4), columnas = rng.entero(3, 4);
    const lg = rng.elegir([4, 4, 4, 5]);
    const z = rng.elegir(['O', 'A']);
    const palabra = rng.elegir(PALABRAS_MALLA[lg][z]);
    const letras = [...new Set([...palabra].filter((_, i) => i % 2 === 0))];
    if (letras.length < 2) return null;
    // Cada letra de la malla A, al azar entre las de lugar par de la palabra; la primera letra sale en una de cada tres.
    const g = [];
    for (let r = 0; r < filas; r++) { const fila = []; for (let c = 0; c < columnas; c++) fila.push(rng.elegir(letras)); g.push(fila); }
    const quedan = g.flat().filter(x => x === palabra[0]).length;
    if (quedan < 2 || quedan > filas * columnas - 2) return null;
    return { palabra, filas, columnas, letras: g };
  }
  const PALABRAS_DOBLE = ['LLAVES', 'LLANTO', 'LLUVIA', 'LLAVERO', 'LLUVIAS', 'LLOVIZNA', 'LLAVEROS'];

  // ---------- figura ----------
  const DX = 34, DY = 32;
  function svgArreglo(A, rotulo) {
    const { filas, mov } = A;
    const paso = mov === 'rd' ? 40 : DX / 2;
    const cs = filas.flat().map(x => x.c), minC = Math.min(...cs), maxC = Math.max(...cs);
    const ancho = Math.max(300, (maxC - minC) * paso + 80);
    const W = Math.min(420, ancho), x0 = (W - (maxC - minC) * paso) / 2;
    const Hh = 30 + (filas.length - 1) * DY + 30;
    let s = `<svg viewBox="0 0 ${W} ${Hh}" xmlns="http://www.w3.org/2000/svg" font-family="inherit">`;
    filas.forEach((r, fi) => r.forEach((x, k) => {
      const X = (x0 + (x.c - minC) * paso).toFixed(1), Y = 30 + fi * DY;
      if (x.l === '■') s += `<rect class="tapada" x="${(Number(X) - 10).toFixed(1)}" y="${Y - 16}" width="20" height="20" rx="3" style="fill:var(--muted)"/>`;
      else {
        const t = rotulo ? rotulo(fi, k) : x.l;
        s += `<text x="${X}" y="${Y}" font-size="${rotulo ? 15 : 18}" text-anchor="middle" ${rotulo ? 'style="fill:var(--c-d)" font-weight="700"' : 'fill="currentColor"'}>${P.xml(t)}</text>`;
      }
    }));
    return s + '</svg>';
  }
  const filaTxt = r => r.map(x => x.l).join(' ');
  // El alt da la posición de cada letra en medias casillas (de izquierda a derecha), para que se puedan
  // rehacer las vecindades sin ver el dibujo: en los rombos con a ≠ b las filas no quedan centradas.
  function altArreglo(A, forma, cifras) {
    const L = cifras ? 'cifras' : 'letras', l1 = cifras ? 'cifra' : 'letra';
    if (A.mov === 'rd') {
      const desc = `Cuadrícula de ${L}${forma === 'escalonada' ? ' escalonada (cada fila empieza o termina corrida respecto de la de arriba)' : ''}, fila por fila de arriba abajo, con las columnas alineadas: `;
      const filas = A.filas.map((r, i) => `fila ${i + 1}: ${filaTxt(r)} (columnas ${r[0].c + 1} a ${r[r.length - 1].c + 1})`).join('; ');
      const tap = A.filas.flat().some(x => x.l === '■') ? ' El cuadrado ■ es una casilla tapada.' : '';
      return desc + filas + '.' + tap;
    }
    const minC = Math.min(...A.filas.flat().map(x => x.c));
    const desc = `Arreglo de ${L} en filas; cada ${l1} queda entre la de abajo a la izquierda y la de abajo a la derecha, que son sus vecinas (en los bordes puede faltar una). `
      + `Entre paréntesis va la posición de cada ${l1} contada en medias casillas desde la izquierda: dos ${L} de filas seguidas son vecinas si sus posiciones se diferencian en 1. De arriba abajo: `;
    const filas = A.filas.map((r, i) => `fila ${i + 1}: ${r.map(x => `${x.l} (${x.c - minC + 1})`).join(', ')}`).join('; ');
    const tap = A.filas.flat().some(x => x.l === '■') ? ' El cuadrado ■ es una casilla tapada.' : '';
    return desc + filas + '.' + tap;
  }
  const altNumeros = (num, A) => 'El mismo arreglo con el número de lecturas que llega a cada casilla, de arriba abajo: '
    + num.map((r, i) => `fila ${i + 1}: ${r.map((x, k) => (A.filas[i][k].l === '■' ? '■ (0)' : x)).join(' ')}`).join('; ') + '.';

  const variables = { w: { nombre: 'palabra', color: 'o' }, b: { nombre: 'casilla tapada', color: 'h' }, x: { nombre: 'lecturas', color: 'd' } };
  const REGLA = {
    diag: 'en cada paso se baja a una letra vecina de la fila siguiente: la de abajo a la izquierda o la de abajo a la derecha.',
    rd: 'en cada paso se avanza a la letra de la derecha o a la de abajo.',
  };

  const OFICIALES = {
    'unmsm-2024-I-28': { tipo: 'doble', spec: { palabra: 'LLOVIZNA' }, fuente: 'Pregunta de UNMSM 2024-I (examen de admisión, razonamiento matemático).' },
    'unmsm-2025-II-29': { tipo: 'malla', spec: { palabra: 'LODO', filas: 4, columnas: 4, letras: [['L', 'L', 'L', 'L'], ['L', 'D', 'D', 'D'], ['L', 'D', 'L', 'D'], ['L', 'D', 'D', 'D']] }, fuente: 'Pregunta de UNMSM 2025-II (examen de admisión, razonamiento matemático).' },
  };
  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const FIJO = { 1: 'triangulo', 2: 'rombo', 3: 'tapada' };
    const m = /^(entrada|salida)-([123])$/.exec(String(semilla));
    // Las semillas numéricas (casos.json, pruebas) siguen dando los mismos problemas de siempre; las de texto
    // (las de la app) también sacan los dos tipos de cierre-100: doble y malla.
    const lista = ['triangulo', 'rombo', 'rombo', 'palindromo', 'palindromo', 'cuadricula', 'cuadricula', 'bloques', 'bloques', 'tapada', 'tapada'];
    const of = OFICIALES[semilla];
    if (of) return of.tipo === 'doble' ? construirDoble(rng, semilla, of.spec, of.fuente) : construirMalla(rng, semilla, of.spec, of.fuente);
    const tipo = m ? FIJO[m[2]] : typeof semilla === 'number' ? rng.elegir(lista) : rng.elegir(lista.concat(['doble', 'malla', 'malla']));
    if (tipo === 'doble') return construirDoble(rng, semilla, { palabra: rng.elegir(PALABRAS_DOBLE) });
    if (tipo === 'malla') {
      for (let intento = 0; intento < 2000; intento++) {
        const spec = datosMalla(rng);
        if (!spec) continue;
        const t = malla(spec).total;
        if (t < 12 || t > 900) continue;
        const pr = construirMalla(rng, semilla, spec);
        if (pr.alternativas.length >= 4) return pr;
      }
      throw new Error('No se pudo generar una malla con 4 alternativas distintas');
    }
    for (let intento = 0; intento < 2000; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  // Errores que dependen de la forma (sin tapada ni palíndromo).
  function erroresBase(spec, n) {
    const e = [];
    if (spec.forma === 'triangulo') {
      e.push(h('RMP84-una-por-final', n, `Contaste una lectura por cada letra de la última fila (${n}). A cada letra de abajo llegan muchas lecturas distintas: hay que sumarlas, fila por fila.`));
      e.push(h('RMP1-letras-por-pasos', 2 ** n, `Contaste ${n} pasos con dos opciones cada uno, pero entre ${n} letras hay solo ${n - 1} pasos: son 2^${n - 1}, no 2^${n}.`));
      e.push(h('RMP83-suma-opciones', 2 * (n - 1), `Sumaste las dos opciones de cada paso (2 + 2 + …). Las opciones de pasos seguidos se combinan entre sí: se multiplican, 2 · 2 · … · 2.`));
      e.push(h('RMP84-solo-centro', comb(n - 1, Math.floor((n - 1) / 2)), 'Contaste solo las lecturas que terminan en la letra del medio de la última fila. Valen las que terminan en cualquier letra de abajo.'));
      e.push(h('RMP82-casillas', n * (n + 1) / 2, 'Contaste las casillas del arreglo, no los caminos que deletrean la palabra.'));
    } else if (spec.forma === 'rombo') {
      const { a, b } = spec;
      e.push(h('RMP81-como-triangulo', 2 ** (a + b), `Multiplicaste por 2 en cada uno de los ${a + b} pasos, como en un triángulo. En la mitad de abajo el arreglo se cierra: las letras del borde tienen una sola vecina abajo.`));
      e.push(h('RMP84-hasta-la-fila-ancha', 2 ** Math.min(a, b), 'Contaste solo hasta la fila más ancha. Desde ahí los caminos siguen bajando y se juntan: hay que seguir sumando hasta la última letra.'));
      e.push(h('RMP82-casillas', (a + 1) * (b + 1), 'Contaste las casillas del arreglo, no los caminos que deletrean la palabra.'));
      e.push(par('AR18-solo-rectas', 2, 'Contaste solo las lecturas que van por los bordes. Hay muchas más que zigzaguean por dentro.'));
    } else if (spec.forma === 'cuadricula') {
      const R = spec.filas, C = spec.columnas, n = R + C - 1;
      if (spec.banda) e.push(h('RMP46-casillas-que-no-estan', comb(R + C - 2, R - 1), 'Contaste como si la cuadrícula estuviera completa. Las esquinas que faltan no tienen letras: los caminos que pasarían por ahí no valen.'));
      e.push(h('RMP81-como-triangulo', 2 ** (n - 1), `Multiplicaste por 2 en cada paso. En el borde derecho y en el de abajo solo hay una forma de seguir.`));
      e.push(h('RMP82-casillas', spec.banda ? arreglo(spec).filas.flat().length : R * C, 'Contaste las casillas de la cuadrícula, no los caminos que deletrean la palabra.'));
      e.push(h('RMP81-producto-pasos', (R - 1) * (C - 1) || NaN, `Multiplicaste los ${R - 1} pasos hacia abajo por los ${C - 1} hacia la derecha. Lo que importa es en qué orden se intercalan: eso lo cuentan los números de Pascal.`));
      e.push(par('AR18-solo-rectas', 2, 'Contaste solo los dos caminos por los bordes. Hay muchos más que bajan y avanzan intercalados.'));
    } else if (spec.forma === 'bloques') {
      const T = bloque(spec.arriba, true), U = bloque(spec.abajo, false);
      e.push(h('RMP83-suma-tramos', T + U, `Sumaste las lecturas de los dos tramos (${T} + ${U}). Cada lectura del tramo de arriba se puede seguir con cualquiera del de abajo: se multiplican.`));
      e.push(h('RMP84-un-tramo', Math.max(T, U), 'Contaste solo uno de los dos tramos. La palabra pasa por los dos, y cada forma de hacer el primero se combina con cada forma de hacer el segundo.'));
      e.push(h('RMP81-como-triangulo', 2 ** (spec.palabra.length - 1), 'Contaste dos opciones en cada paso, como en un triángulo completo. En la letra de la unión todos los caminos se juntan en una sola casilla.'));
      e.push(h('RMP84-un-tramo-menor', Math.min(T, U), 'Contaste solo uno de los dos tramos. La palabra pasa por los dos, y se multiplican.'));
    }
    return e;
  }
  // Lecturas de un bloque: de toda la primera fila a la punta (invertido) o de punta a punta (rombo), o de la
  // punta a toda la última fila (triángulo).
  const bloque = (b) => (b.tipo === 'rombo' ? comb(2 * b.k, b.k) : 2 ** b.k);

  function construir(rng, semilla, tipo) {
    let spec, forma;
    if (tipo === 'triangulo') { const n = rng.entero(4, 8); spec = { forma: 'triangulo', n, palabra: rng.elegir(PALABRAS[n]) }; }
    else if (tipo === 'rombo') {
      const a = rng.entero(2, 4), b = rng.elegir([a, a, a - 1, a + 1].filter(x => x >= 2 && x <= 4)), n = a + b + 1;
      if (!PALABRAS[n]) return null;
      spec = { forma: 'rombo', a, b, palabra: rng.elegir(PALABRAS[n]) };
    } else if (tipo === 'palindromo') {
      const base = rng.elegir(['rombo', 'rombo', 'triangulo']);
      const n = rng.elegir(base === 'rombo' ? [5, 7, 9] : [5, 7]);
      const w = rng.elegir(PALINDROMOS[n]), m = (n - 1) / 2;
      spec = base === 'rombo' ? { forma: 'rombo', a: m, b: m, palabra: w } : { forma: 'triangulo', n, palabra: w };
      spec.sentidos = 2; spec.iguales = rng.moneda();
    } else if (tipo === 'cuadricula') {
      const R = rng.entero(3, 5), C = rng.entero(3, 6), n = R + C - 1;
      if (!PALABRAS[n] || R === C && rng.moneda()) return null;
      spec = { forma: 'cuadricula', filas: R, columnas: C, palabra: rng.elegir(PALABRAS[n]) };
      if (rng.moneda()) {
        // banda que contiene las dos esquinas (bajo ≥ R − C y alto ≥ C − R) y corta al menos una esquina
        const bajo = rng.entero(Math.max(1, R - C), R - 1), alto = rng.entero(Math.max(1, C - R), C - 1);
        if (bajo < R - 1 || alto < C - 1) spec.banda = [bajo, alto];
      }
      forma = spec.banda ? 'escalonada' : 'completa';
    } else if (tipo === 'bloques') {
      const arriba = rng.elegir([{ tipo: 'invertido', k: rng.entero(2, 4) }, { tipo: 'rombo', k: 2 }]);
      const abajo = rng.elegir([{ tipo: 'triangulo', k: rng.entero(2, 4) }, { tipo: 'rombo', k: 2 }]);
      const n = (arriba.tipo === 'invertido' ? arriba.k : 4) + (abajo.tipo === 'triangulo' ? abajo.k : 4) + 1;
      if (!PALABRAS[n] || bloque(arriba) === bloque(abajo) && rng.moneda()) return null;
      spec = { forma: 'bloques', arriba, abajo, palabra: rng.elegir(PALABRAS[n]) };
    } else {
      const base = rng.elegir(['triangulo', 'rombo', 'cuadricula']);
      if (base === 'triangulo') { const n = rng.entero(5, 7); spec = { forma: 'triangulo', n, palabra: rng.elegir(PALABRAS[n]) }; }
      else if (base === 'rombo') { const a = rng.entero(2, 3), b = rng.entero(2, 3); spec = { forma: 'rombo', a, b, palabra: rng.elegir(PALABRAS[a + b + 1]) }; }
      else { const R = rng.entero(3, 4), C = rng.entero(3, 5); spec = { forma: 'cuadricula', filas: R, columnas: C, palabra: rng.elegir(PALABRAS[R + C - 1]) }; }
      const A0 = arreglo(spec);
      const N = A0.filas.length;
      const fi = rng.entero(2, N - 1);          // ni la primera ni la última fila
      const p = rng.entero(1, A0.filas[fi - 1].length);
      spec.tapada = [fi, p];
    }
    spec = { tipo, ...spec };
    const w = spec.palabra, n = w.length;
    const A = arreglo(spec);
    const L = lecturas(spec);
    const correcta = L.total;
    if (!(correcta > 0)) return null;

    // enunciado
    const comienzo = spec.forma === 'cuadricula' ? 'Se empieza en la letra de la esquina de arriba a la izquierda y ' :
      spec.forma === 'bloques' && spec.arriba.tipo === 'invertido' ? 'Se puede empezar en cualquier letra de la primera fila y ' : 'Se empieza en la letra de arriba y ';
    const enunciado = ['En el arreglo de la figura se quiere leer ', v('w', que(w)), ' pasando de una casilla a otra vecina. ', comienzo, REGLA[A.mov]];
    if (spec.tapada) enunciado.push(' No se puede pasar por la ', v('b', 'casilla tapada (■)'), '.');
    if (spec.sentidos === 2) {
      enunciado.splice(3, 2, `Como ${esNumero(w) ? 'el número' : 'la palabra'} se lee igual al derecho y al revés, vale leer de arriba abajo (empezando en la letra de arriba) o de abajo arriba (empezando en una letra de la última fila), pasando en cada paso a una letra vecina de la fila siguiente, sin cambiar de sentido.`);
      enunciado.push(spec.iguales ? ' Dos lecturas que usan las mismas casillas cuentan como una sola, aunque vayan en sentidos contrarios.' : ' Una lectura de abajo arriba se cuenta aparte de la que usa las mismas casillas de arriba abajo.');
    }
    if (esNumero(w)) for (let i = 0; i < enunciado.length; i++) if (typeof enunciado[i] === 'string') enunciado[i] = enunciado[i].replace(/\bletras\b/g, 'cifras').replace(/\bletra\b/g, 'cifra');

    // errores
    let errores = [];
    if (spec.tapada) {
      const S = L.sinTapar;
      errores = [
        h('RMP46-sin-restar', S, `Contaste todas las lecturas, también las que pasan por la casilla tapada. Esas no valen: a la casilla tapada no llega ninguna lectura (escribe 0 sobre ella y sigue sumando).`),
        h('RMP46-solo-llegan', S - L.llegan, `Restaste ${L.llegan === 1 ? 'la única lectura que llega' : `las ${L.llegan} lecturas que llegan`} a la casilla tapada, pero ${L.llegan === 1 ? 'esa lectura' : 'cada una'} se puede continuar de ${L.salen} formas. Las que se pierden son ${L.llegan} × ${L.salen}.`),
        h('RMP46-solo-salen', S - L.salen, `Restaste solo ${L.salen === 1 ? 'el único camino que sale' : `los ${L.salen} caminos que salen`} de la casilla tapada. Las lecturas que se pierden son las que llegan a ella (${L.llegan}) por las que salen (${L.salen}).`),
        h('RMP46-una', S - 1, 'Restaste una sola lectura por la casilla tapada. Por esa casilla pasan muchas lecturas: todas se pierden.'),
        h('RMP83-suma-en-vez-de-producto', S - L.llegan - L.salen, `Restaste ${L.llegan} + ${L.salen}. Cada camino que llega a la casilla tapada se puede seguir con cada camino que sale: se pierden ${L.llegan} × ${L.salen}.`),
      ];
    } else if (spec.sentidos === 2) {
      const B = lecturas({ ...spec, sentidos: 1 }).total;
      errores = spec.iguales
        ? [h('RMP45-doble', 2 * B, `Contaste cada lectura dos veces: una de arriba abajo y otra de abajo arriba. Usan las mismas casillas, y el problema dice que cuentan como una sola.`)]
        : [h('RMP84-solo-ida', B, 'Contaste solo las lecturas de arriba abajo. Como la palabra se lee igual al revés, también valen las de abajo arriba, y el problema dice que se cuentan aparte.')];
      const s = spec.iguales ? 1 : 2;
      for (const e of erroresBase({ ...spec, sentidos: 1 }, n)) errores.push({ ...e, valor: s * e.valor, explicacion: e.explicacion + (s === 2 ? ' (Y luego lo duplicaste por los dos sentidos.)' : '') });
    } else errores = erroresBase(spec, n);

    const cifras = t => (esNumero(w) ? t.replace(/\bletras\b/g, 'cifras').replace(/\bletra\b/g, 'cifra').replace(/\bla palabra\b/g, 'el número') : t);
    errores = errores.map(e => ({ ...e, explicacion: cifras(e.explicacion) }));
    const alternativas = P.armar({ correcta, errores, rng, decimales: 0, texto: x => f(x) });

    // solución
    const num = L.numeros;
    const filasNum = num.map((r, i) => `fila ${i + 1}: ${r.map((x, k) => (A.filas[i][k].l === '■' ? '■' : x)).join(', ')}`).join('; ');
    const solucion = [];
    if (A.mov === 'diag') solucion.push(['Escribe sobre cada letra cuántas lecturas llegan hasta ella. ', spec.forma === 'bloques' && spec.arriba.tipo === 'invertido' ? 'Cada letra de la primera fila es un comienzo: lleva 1. ' : 'La letra de arriba lleva 1. ',
      'Cada letra recibe las lecturas de sus vecinas de la fila de arriba, y se suman: es el triángulo de Pascal, como en el tablero de los caminos.']);
    else solucion.push(['Escribe sobre cada letra cuántas lecturas llegan hasta ella. La de la esquina lleva 1; cada letra suma lo que le llega de la de su izquierda y de la de arriba (como en el triángulo de Pascal del tablero de los caminos).']);
    if (spec.tapada) solucion.push(['La ', v('b', 'casilla tapada'), ' lleva 0: por ahí no pasa ninguna lectura.']);
    solucion.push([`Números, de arriba abajo: ${filasNum}.`]);
    const ult = A.mov === 'rd' ? num[num.length - 1][num[num.length - 1].length - 1] : num[num.length - 1].reduce((s, x) => s + x, 0);
    const ultTxt = A.mov === 'rd' || num[num.length - 1].length === 1 ? `la última letra recibe ${ult}` : `la última fila suma ${num[num.length - 1].join(' + ')} = ${ult}`;
    if (spec.sentidos === 2) {
      solucion.push([`De arriba abajo, ${ultTxt}. `, spec.iguales ? 'Cada lectura de abajo arriba usa las mismas casillas que una de arriba abajo, y cuentan como una sola: ' : 'Cada una se puede hacer también de abajo arriba, y se cuentan aparte: ', spec.iguales ? '' : `${ult} · 2 = `, v('x', `${f(correcta)}`), '.']);
    } else solucion.push([`Las lecturas completas son las que llegan al final: ${ultTxt}. Respuesta: `, v('x', f(correcta)), '.']);
    if (spec.tapada) solucion.push([`Atajo: sin tapar habría ${L.sinTapar}; por la casilla tapada pasan ${L.llegan} (que llegan) × ${L.salen} (que salen) = ${L.llegan * L.salen}, y ${L.sinTapar} − ${L.llegan * L.salen} = ${correcta}.`]);
    else if (spec.forma === 'triangulo' && !spec.sentidos) solucion.push([`Atajo: entre ${n} letras hay ${n - 1} pasos, con 2 opciones cada uno: 2^${n - 1} = ${correcta}.`]);
    else if (spec.forma === 'rombo' && !spec.sentidos) solucion.push([`Atajo: de los ${spec.a + spec.b} pasos, ${spec.a} van a la izquierda y ${spec.b} a la derecha, en cualquier orden: C(${spec.a + spec.b}; ${spec.a}) = ${correcta}.`]);
    else if (spec.forma === 'cuadricula' && !spec.banda) solucion.push([`Atajo: de los ${spec.filas + spec.columnas - 2} pasos, ${spec.filas - 1} son hacia abajo, en cualquier orden: C(${spec.filas + spec.columnas - 2}; ${spec.filas - 1}) = ${correcta}.`]);
    else if (spec.forma === 'bloques') solucion.push([`Atajo: por la letra de la unión pasan todas. Arriba hay ${bloque(spec.arriba)} formas de llegar a ella y abajo ${bloque(spec.abajo)} de seguir: ${bloque(spec.arriba)} × ${bloque(spec.abajo)} = ${correcta}.`]);

    for (const paso of solucion) for (let i = 0; i < paso.length; i++) if (typeof paso[i] === 'string') paso[i] = cifras(paso[i]);
    return {
      id: `${ID}#${semilla}`, variables, enunciado, pregunta: [`¿De cuántas maneras distintas se puede leer ${esNumero(w) ? 'el número' : 'la palabra'}?`], datos: '',
      figura: { svg: svgArreglo(A), alt: altArreglo(A, forma, esNumero(w)) },
      figuraSolucion: { svg: svgArreglo(A, (fi, k) => num[fi][k]), alt: altNumeros(num, A) },
      alternativas, solucion, respuesta: { valor: correcta, unidad: 'lecturas' }, _datos: spec,
    };
  }

  return { id: ID, titulo: 'Lecturas en un arreglo de letras', generar, calc: { arreglo, lecturas, doble, malla } };
});
