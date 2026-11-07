/*
 * Motor de «El plano que se deforma»: matrices y determinantes.
 *
 * Toda la matemática de la plantilla vive aquí (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorMatrices) y en Node (require('./motor.js')). Las cuentas son EXACTAS con fracciones.
 *
 * CONVENCIONES
 *   Una matriz es una lista de filas: [[1, 0, -1], [3, 2, 1]] es la matriz de 2 × 3 con a₁₃ = −1 y a₂₁ = 3. Cada
 *   elemento es un entero o decimal, o un texto de fracción '1/2' / '-3/4'. Las matrices de salida (campo 'matriz')
 *   son listas de filas de NÚMEROS (−1,5 sale -1.5); el campo 'texto' es exacto: '[1, 0, −1; 3, 2, 1]' (filas separadas
 *   por «; », signo menos tipográfico −, fracciones 'p/q'). Los índices i, j de los textos empiezan en 1; los de las
 *   listas internas (celdas, diagonales) empiezan en 0. Un vector o punto del plano es [x, y].
 *   Cada función que responde una predicción devuelve { …, texto, errores, coinciden }: 'errores' es un objeto cuyas
 *   claves son errores típicos y cada uno trae { valor o matriz, texto, id, regla }; 'id' es MT1…MT34 (hipótesis
 *   nuestras, salvo MT4, que es parcial por Aygör y Özdağ, 2012; ver
 *   docs/investigacion/matematica-avanzada-ideas-erroneas.md) o AL16. Un error que con esos números daría lo mismo
 *   que la respuesta correcta (mismo texto) o que no aplica NO va en 'errores': su clave va en la lista 'coinciden'.
 *
 * FUNCIONES EXPORTADAS
 *   textoMatriz(M)                    → '[1, 0, −1; 3, 2, 1]'. M como arriba (números o textos de fracción).
 *   textoNumero(x)                    → '−3/2', '4', '0' (x número o texto de fracción).
 *   orden({ M })                      → { filas, columnas, texto: '2 × 3', cuadrada (booleano) }.
 *   construir({ filas, columnas, formula: { i, j, c } })
 *                                     → la matriz de filas × columnas con aᵢⱼ = i·(formula.i) + j·(formula.j) + c.
 *                                     { matriz, texto, orden: '2 × 3', errores: cambiaIJ (MT10: aᵢⱼ con i y j
 *                                     cambiados, mismo orden), ordenAlReves (MT11: columnas × filas con la misma
 *                                     fórmula), porColumnas (MT12: los números correctos escritos por columnas, o sea la
 *                                     transpuesta) }.
 *   elemento({ M, i, j })             → aᵢⱼ (i fila, j columna, desde 1). { valor, texto, errores: cambiaIJ (MT10: aⱼᵢ;
 *                                     no aparece si aⱼᵢ no existe o vale lo mismo) }.
 *   tipos({ M })                      → { cuadrada, nula, diagonal, escalar, identidad, triangularSuperior,
 *                                     triangularInferior, simetrica, antisimetrica (booleanos), traza (número; null si
 *                                     no es cuadrada), trazaTexto }.
 *   iguales({ A, B })                 → { valor (booleano), distintas: [[i, j], …] (desde 1; null si el orden difiere) }.
 *   sumar({ A, B })                   → { matriz, texto } (A + B, mismo orden; si no, lanza «del mismo orden»).
 *   escalar({ k, A })                 → { matriz, texto } (k·A, cada elemento por k).
 *   transpuesta({ A })                → { matriz, texto, orden } (Aᵀ: la fila i pasa a ser la columna i).
 *   producto({ A, B })                → A·B, fila de A por columna de B. Columnas de A = filas de B (si no, lanza «el
 *                                     número de columnas de A debe ser igual al de filas de B»). { matriz, texto, orden,
 *                                     celdas: [[{ sumandos: [[aᵢₖ, bₖⱼ], …] (números), texto: '3 · 2 + (−1) · 1' }]],
 *                                     errores: elementoAElemento (MT1: aᵢⱼ·bᵢⱼ, solo con el mismo orden), alReves
 *                                     (MT2: B·A, si existe), filaPorFila (MT14: fila de A por fila de B, A·Bᵀ, si
 *                                     existe) }.
 *   ordenProducto({ A: [m, n], B: [p, q] }) → órdenes de A·B y B·A. { AB: [m, q] o null, BA: [p, n] o null,
 *                                     texto: 'AB es 2 × 4; BA no existe', errores: medio (MT15: AB con los números de
 *                                     en medio, n × p), reves (MT8: BA existe con el orden de AB al revés, q × m),
 *                                     mismoOrden (MT16: solo se multiplican matrices del mismo orden) }.
 *   composicion({ primero: B, luego: A }) → primero se aplica B y luego A: la matriz es A·B (la de la derecha actúa
 *                                     primero). { matriz, texto, errores: alReves (MT34: B·A, en el orden en que actúan), suma
 *                                     (MT17: A + B), escalar (MT33: (det B)·A, como si B estirara igual en todas las
 *                                     direcciones) }.
 *   det({ M })                        → determinante de una matriz cuadrada de cualquier orden (eliminación exacta).
 *                                     { valor, texto }.
 *   det2({ M })                       → determinante 2 × 2 = ad − bc con M = [[a, b], [c, d]]. { valor, texto,
 *                                     principal: ad, secundaria: bc, errores: sumaDiagonales (MT5: ad + bc), sinSigno
 *                                     (MT20: |ad − bc|, «un área no es negativa»; solo si det < 0), alReves (MT18:
 *                                     bc − ad; con det < 0 coincide con sinSigno y queda en 'coinciden'), filas (MT19:
 *                                     ab − cd, multiplica a lo largo de las filas) }.
 *   det3({ M })                       → determinante 3 × 3 por Sarrus y por cofactores de la primera fila. { valor,
 *                                     texto, suman: [{ celdas: [[i, j] ×3] (desde 0), producto }] (las tres diagonales
 *                                     ↘), restan: [ … ] (las tres ↙), principales (suma de las ↘), secundarias (suma
 *                                     de las ↙), cofactores: [{ j (desde 0), signo (+1/−1), menor: matriz 2 × 2,
 *                                     detMenor, termino: signo·a₁ⱼ·detMenor }], errores: sumaTodo (MT6: suma las seis
 *                                     diagonales), soloPrincipal (MT27: solo el producto de la diagonal principal),
 *                                     alReves (MT28: secundarias − principales) }.
 *   detK({ detA, k, n })              → det(k·A) = kⁿ·det A para A de n × n. { valor, texto, errores: lineal (MT4:
 *                                     k·det A), porElementos (MT24: k elevado al número de elementos, k^(n²)·det A) }.
 *   propiedadesDet({ detA, detB })    → la afirmación verdadera 'det(AB) = …' y tres falsas en general. { valor:
 *                                     detA·detB, texto: 'det(AB) = 6', errores (texto de cada afirmación): suma (MT3:
 *                                     'det(A + B) = detA + detB'), transpuesta (MT25: 'det(Aᵀ) = −detA'; no aparece si
 *                                     detA = 0), ordenCambia (MT26: 'det(BA) = −detA·detB'; no aparece si el producto
 *                                     es 0) }.
 *   inversa2({ M })                   → inversa de una 2 × 2: (1/det)·[[d, −b], [−c, a]]. Si det = 0 lanza «det = 0: no
 *                                     tiene inversa». { matriz, texto, det, detTexto, adjunta (matriz de números),
 *                                     errores: sinDividir (MT7: la adjunta sin dividir entre det), sinSignos (MT13:
 *                                     intercambia a y d pero no cambia el signo de b y c), sinIntercambiar (MT22: cambia
 *                                     los signos de b y c pero no intercambia a y d), reciprocos (MT23: 1/aᵢⱼ elemento
 *                                     por elemento; solo si ningún elemento es 0) }.
 *   kSinInversa({ M })                → M de 2 × 2 con UN elemento 'k': el valor de k con det = 0 (sin inversa).
 *                                     { valor, texto: 'k = 4', errores: sumaDiagonales (MT5: ad + bc = 0), filas
 *                                     (MT19: ab − cd = 0), cero (MT21: k = 0, «sin inversa si un elemento es 0») }.
 *                                     Lanza si M no trae exactamente una 'k' o si det no depende de k.
 *   cramer2({ A, b })                 → sistema A·(x; y) = b con A de 2 × 2 y b = [e, f]. Si det = 0 lanza «det = 0».
 *                                     { det, detX, detY, x, y, texto: 'x = 2', textoY: 'y = 1', errores (para x):
 *                                     sinDividir (MT29: x = Δx), alReves (MT30: x = Δ/Δx; no aparece si Δx = 0),
 *                                     otraColumna (MT31: Δy/Δ, el valor de y) }.
 *   kSistema({ A, b })                → sistema A·(x; y) = b con UNA 'k' en A: el k con Δ = 0, sin solución única.
 *                                     { valor, texto: 'k = 4', errores: sumaDiagonales (MT5: ad + bc = 0), cambiado
 *                                     (AL17: iguala a 0 Δx, o Δy si Δx no depende de k), cero (MT21: k = 0) }.
 *   sustituir({ M, valores })         → M con elementos número o expresión lineal de una letra ('x + 2', '2y', '−1');
 *                                     valores = { x: 5, y: −3 }. { matriz, texto }. Lanza si falta un valor o la
 *                                     expresión no es lineal.
 *   cramer3({ A, b })                 → sistema 3 × 3 por Cramer. { det, dets: [Δx, Δy, Δz], x, y, z, texto:
 *                                     'x = 1; y = 2; z = 3' }. Si det = 0 lanza «det = 0».
 *   productoTranspuesta({ A, B })     → (AB)ᵀ = BᵀAᵀ. { matriz, texto, errores: AtBt (MT9: AᵀBᵀ, si existe),
 *                                     sinTransponer (MT32: AB) }.
 *   aplicar({ M, p })                 → M·p para M de 2 × 2 y p = [x, y]: [x', y'] (números).
 *   paralelogramo({ M })              → la imagen del cuadrado unidad por M de 2 × 2: { u: columna 1, v: columna 2,
 *                                     vertices: [[0, 0], u, u + v, v], area: |det| (número), det, orientacion:
 *                                     'antihorario' (det > 0) | 'horario' (det < 0) | 'plano' (det = 0) }.
 *   cizalla({ M })                    → dos deslizamientos que no cambian el área (a una columna se le suma un múltiplo
 *                                     de la otra) y llevan el paralelogramo de M = [[a, b], [c, d]] (a ≠ 0) a un
 *                                     rectángulo de lados a y det/a. { pasos: [{ u, v }, { u, v }, { u, v }] (columnas
 *                                     de números: al inicio, tras v − (b/a)·u y tras u − t·v), t1: b/a, t2,
 *                                     ancho: a, alto: det/a, det }. Lanza si a = 0.
 *
 * ENTRADAS QUE LANZAN (con mensaje en español): matriz vacía o con filas de distinto largo; un elemento que no es número
 *   ni fracción; elemento({ i, j }) fuera de rango («aᵢⱼ no existe en una matriz de m × n»); sumar con órdenes
 *   distintos («del mismo orden»); producto con columnas de A ≠ filas de B (p. ej. 2 × 3 por 2 × 3); det de una matriz
 *   no cuadrada; det2/det3/inversa2/cizalla con otro orden; inversa2 con det = 0 («det = 0: no tiene inversa»);
 *   cramer2/cramer3 con Δ = 0 («det = 0: Cramer no se aplica»), aunque Δx, Δy (y Δz) también sean 0; kSinInversa y
 *   kSistema sin exactamente una 'k' o con un det que no depende de k; cizalla con a = 0.
 */
(function (root, fabrica) {
  const api = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.MotorMatrices = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ---------- fracciones exactas ----------
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  function F(n, d) {
    if (d === undefined) d = 1;
    if (d === 0) throw new Error('división entre 0');
    if (d < 0) { n = -n; d = -d; }
    const g = mcd(n, d) || 1;
    return { n: n / g + 0, d: d / g };
  }
  function Q(x) {
    if (x && typeof x === 'object' && 'n' in x) return x;
    if (typeof x === 'number') {
      if (!Number.isFinite(x)) throw new Error('número no finito');
      if (Number.isInteger(x)) return F(x, 1);
      let d = 1; while (!Number.isInteger(Math.round(x * d * 1e9) / 1e9) && d < 1e6) d *= 10;
      return F(Math.round(x * d), d);
    }
    if (typeof x === 'string') {
      const m = x.trim().replace('−', '-').match(/^(-?\d+)(?:\/(\d+))?$/);
      if (!m) throw new Error(`«${x}» no es un número ni una fracción`);
      return F(Number(m[1]), m[2] ? Number(m[2]) : 1);
    }
    throw new Error(`«${x}» no es un número ni una fracción`);
  }
  const sum = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
  const res = (a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d);
  const mul = (a, b) => F(a.n * b.n, a.d * b.d);
  const div = (a, b) => { if (b.n === 0) throw new Error('división entre 0'); return F(a.n * b.d, a.d * b.n); };
  const neg = a => F(-a.n, a.d);
  const cero = a => a.n === 0;
  const num = a => a.n / a.d;
  const txt = a => (a.n < 0 ? '−' : '') + Math.abs(a.n) + (a.d === 1 ? '' : '/' + a.d);
  const potQ = (a, e) => { let r = F(1); for (let k = 0; k < e; k++) r = mul(r, a); return r; };

  // ---------- matrices ----------
  function mat(M, que) {
    if (!Array.isArray(M) || !M.length || !M.every(f => Array.isArray(f) && f.length)) throw new Error(`${que || 'la matriz'} debe ser una lista de filas no vacías`);
    const n = M[0].length;
    if (!M.every(f => f.length === n)) throw new Error(`${que || 'la matriz'}: todas las filas deben tener el mismo largo`);
    return M.map(f => f.map(Q));
  }
  const dims = M => [M.length, M[0].length];
  const numeros = M => M.map(f => f.map(num));
  const textoQ = M => '[' + M.map(f => f.map(txt).join(', ')).join('; ') + ']';
  const tr = M => M[0].map((_, j) => M.map(f => f[j]));
  function prod(A, B) {
    const [m, n] = dims(A), [p, q] = dims(B);
    if (n !== p) return null;
    return A.map(f => Array.from({ length: q }, (_, j) => f.reduce((s, a, k) => sum(s, mul(a, B[k][j])), F(0))));
  }
  const ordTx = (a, b) => `${a} × ${b}`;
  // arma { errores, coinciden } sin errores que dan lo mismo que la correcta ni repetidos entre sí
  function juntar(correcto, lista) {
    const errores = {}, coinciden = [], vistos = new Set([correcto]);
    for (const [k, e] of lista) {
      if (!e || vistos.has(e.texto)) { coinciden.push(k); continue; }
      vistos.add(e.texto); errores[k] = e;
    }
    return { errores, coinciden };
  }
  const errM = (M, id, regla) => (M ? { matriz: numeros(M), texto: textoQ(M), id, regla } : null);
  const errV = (v, id, regla, pre) => (v ? { valor: num(v), texto: (pre || '') + txt(v), id, regla } : null);

  function textoMatriz(M) { return textoQ(mat(M)); }
  function textoNumero(x) { return txt(Q(x)); }

  function orden({ M }) { const [m, n] = dims(mat(M)); return { filas: m, columnas: n, texto: ordTx(m, n), cuadrada: m === n }; }

  function construir({ filas, columnas, formula }) {
    if (!(Number.isInteger(filas) && Number.isInteger(columnas) && filas > 0 && columnas > 0)) throw new Error('filas y columnas deben ser enteros positivos');
    const p = Q(formula.i || 0), q = Q(formula.j || 0), c = Q(formula.c || 0);
    const arma = (m, n, f) => Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => f(F(i + 1), F(j + 1))));
    const bien = (i, j) => sum(sum(mul(p, i), mul(q, j)), c);
    const M = arma(filas, columnas, bien);
    const r = { matriz: numeros(M), texto: textoQ(M), orden: ordTx(filas, columnas) };
    Object.assign(r, juntar(r.texto, [
      ['cambiaIJ', errM(arma(filas, columnas, (i, j) => bien(j, i)), 'MT10', 'aᵢⱼ con i y j cambiados: i se toma como columna y j como fila')],
      ['ordenAlReves', errM(arma(columnas, filas, bien), 'MT11', 'el orden m × n leído al revés: n filas y m columnas')],
      ['porColumnas', errM(tr(M), 'MT12', 'los números bien calculados, pero escritos por columnas (la transpuesta)')],
    ]));
    return r;
  }

  function elemento({ M, i, j }) {
    const A = mat(M), [m, n] = dims(A);
    if (!(i >= 1 && i <= m && j >= 1 && j <= n)) throw new Error(`a${i}${j} no existe en una matriz de ${ordTx(m, n)}`);
    const v = A[i - 1][j - 1], r = { valor: num(v), texto: txt(v) };
    const sw = j <= m && i <= n ? A[j - 1][i - 1] : null;
    Object.assign(r, juntar(r.texto, [['cambiaIJ', errV(sw, 'MT10', 'confunde fila con columna: lee aⱼᵢ')]]));
    return r;
  }

  function tipos({ M }) {
    const A = mat(M), [m, n] = dims(A), cuadrada = m === n;
    const todos = f => A.every((fila, i) => fila.every((a, j) => f(a, i, j)));
    const nula = todos(a => cero(a));
    const diagonal = cuadrada && todos((a, i, j) => i === j || cero(a));
    const escalarM = diagonal && A.every((f, i) => num(f[i]) === num(A[0][0]));
    const identidad = escalarM && num(A[0][0]) === 1;
    const triangularSuperior = cuadrada && todos((a, i, j) => j >= i || cero(a));
    const triangularInferior = cuadrada && todos((a, i, j) => j <= i || cero(a));
    const simetrica = cuadrada && todos((a, i, j) => num(a) === num(A[j][i]));
    const antisimetrica = cuadrada && todos((a, i, j) => num(a) === -num(A[j][i]));
    const t = cuadrada ? A.reduce((s, f, i) => sum(s, f[i]), F(0)) : null;
    return { cuadrada, nula, diagonal, escalar: escalarM, identidad, triangularSuperior, triangularInferior, simetrica, antisimetrica,
      traza: t ? num(t) : null, trazaTexto: t ? txt(t) : null };
  }

  function iguales({ A, B }) {
    const X = mat(A, 'A'), Y = mat(B, 'B'), [m, n] = dims(X), [p, q] = dims(Y);
    if (m !== p || n !== q) return { valor: false, distintas: null };
    const d = [];
    X.forEach((f, i) => f.forEach((a, j) => { if (num(a) !== num(Y[i][j])) d.push([i + 1, j + 1]); }));
    return { valor: d.length === 0, distintas: d };
  }

  function sumar({ A, B }) {
    const X = mat(A, 'A'), Y = mat(B, 'B'), [m, n] = dims(X), [p, q] = dims(Y);
    if (m !== p || n !== q) throw new Error('para sumar, A y B deben ser del mismo orden');
    const S = X.map((f, i) => f.map((a, j) => sum(a, Y[i][j])));
    return { matriz: numeros(S), texto: textoQ(S) };
  }
  function escalar({ k, A }) { const K = Q(k), S = mat(A, 'A').map(f => f.map(a => mul(K, a))); return { matriz: numeros(S), texto: textoQ(S) }; }
  function transpuesta({ A }) { const T = tr(mat(A, 'A')), [m, n] = dims(T); return { matriz: numeros(T), texto: textoQ(T), orden: ordTx(m, n) }; }

  function producto({ A, B }) {
    const X = mat(A, 'A'), Y = mat(B, 'B'), [m, n] = dims(X), [p, q] = dims(Y);
    if (n !== p) throw new Error('el número de columnas de A debe ser igual al de filas de B');
    const P = prod(X, Y);
    const celdas = X.map(f => Array.from({ length: q }, (_, j) => {
      const s = f.map((a, k) => [a, Y[k][j]]);
      return { sumandos: s.map(([a, b]) => [num(a), num(b)]), texto: s.map(([a, b], k) => `${a.n < 0 && k ? '(' + txt(a) + ')' : txt(a)} · ${b.n < 0 ? '(' + txt(b) + ')' : txt(b)}`).join(' + ') };
    }));
    const r = { matriz: numeros(P), texto: textoQ(P), orden: ordTx(m, q), celdas };
    const ee = m === p && n === q ? X.map((f, i) => f.map((a, j) => mul(a, Y[i][j]))) : null;
    Object.assign(r, juntar(r.texto, [
      ['elementoAElemento', errM(ee, 'MT1', 'multiplica elemento a elemento, como si fuera una suma')],
      ['alReves', errM(prod(Y, X), 'MT2', 'cambia el orden: calcula B·A, como si AB = BA')],
      ['filaPorFila', errM(prod(X, tr(Y)), 'MT14', 'multiplica fila de A por fila de B (A·Bᵀ)')],
    ]));
    return r;
  }

  function ordenProducto({ A, B }) {
    const [m, n] = A, [p, q] = B;
    if (![m, n, p, q].every(x => Number.isInteger(x) && x > 0)) throw new Error('los órdenes deben ser enteros positivos');
    const parte = (nom, o) => (o ? `${nom} es ${ordTx(o[0], o[1])}` : `${nom} no existe`);
    const frase = (ab, ba) => `${parte('AB', ab)}; ${parte('BA', ba)}`;
    const AB = n === p ? [m, q] : null, BA = q === m ? [p, n] : null;
    const r = { AB, BA, texto: frase(AB, BA) };
    const tx = t => ({ texto: t });
    const mismo = m === p && n === q;
    Object.assign(r, juntar(r.texto, [
      ['medio', AB ? Object.assign(tx(frase([n, p], BA)), { id: 'MT15', regla: 'toma los números de en medio (n × p) como orden de AB' }) : null],
      ['reves', AB ? Object.assign(tx(frase(AB, [q, m])), { id: 'MT8', regla: 'cree que si AB existe, BA también, con el orden al revés' }) : null],
      ['mismoOrden', Object.assign(tx(frase(mismo ? [m, n] : null, mismo ? [m, n] : null)), { id: 'MT16', regla: 'cree que solo se multiplican matrices del mismo orden' })],
    ]));
    return r;
  }

  function composicion({ primero, luego }) {
    const B = mat(primero, 'primero'), A = mat(luego, 'luego'), [m, n] = dims(A), [p, q] = dims(B);
    if (!(m === n && p === q && m === p)) throw new Error('las dos matrices deben ser cuadradas del mismo orden');
    const P = prod(A, B), r = { matriz: numeros(P), texto: textoQ(P) };
    Object.assign(r, juntar(r.texto, [
      ['alReves', errM(prod(B, A), 'MT34', 'escribe las matrices en el orden en que actúan: B·A')],
      ['suma', errM(A.map((f, i) => f.map((a, j) => sum(a, B[i][j]))), 'MT17', 'hacer una cosa y luego otra se toma como sumar A + B')],
      ['escalar', errM(A.map(f => f.map(a => mul(detQ(B), a))), 'MT33', 'toma B como un número (su determinante) que multiplica a A: estira en todas las direcciones')],
    ]));
    return r;
  }

  function detQ(A) {
    const n = A.length;
    if (A.some(f => f.length !== n)) throw new Error('el determinante solo existe para matrices cuadradas');
    const M = A.map(f => f.slice());
    let d = F(1);
    for (let c = 0; c < n; c++) {
      let piv = -1;
      for (let i = c; i < n; i++) if (!cero(M[i][c])) { piv = i; break; }
      if (piv < 0) return F(0);
      if (piv !== c) { [M[c], M[piv]] = [M[piv], M[c]]; d = neg(d); }
      d = mul(d, M[c][c]);
      for (let i = c + 1; i < n; i++) {
        const f = div(M[i][c], M[c][c]);
        for (let j = c; j < n; j++) M[i][j] = res(M[i][j], mul(f, M[c][j]));
      }
    }
    return d;
  }
  function det({ M }) { const d = detQ(mat(M)); return { valor: num(d), texto: txt(d) }; }

  function de2(M) { const A = mat(M); if (A.length !== 2 || A[0].length !== 2) throw new Error('se esperaba una matriz de 2 × 2'); return A; }
  function det2({ M }) {
    const [[a, b], [c, d]] = de2(M), p = mul(a, d), s = mul(b, c), D = res(p, s);
    const r = { valor: num(D), texto: txt(D), principal: num(p), secundaria: num(s) };
    Object.assign(r, juntar(r.texto, [
      ['sumaDiagonales', errV(sum(p, s), 'MT5', 'suma los productos de las diagonales: ad + bc')],
      ['sinSigno', D.n < 0 ? errV(neg(D), 'MT20', 'un área no puede ser negativa: quita el signo') : null],
      ['alReves', errV(res(s, p), 'MT18', 'resta en el orden contrario: bc − ad')],
      ['filas', errV(res(mul(a, b), mul(c, d)), 'MT19', 'multiplica a lo largo de las filas: ab − cd')],
    ]));
    return r;
  }

  function det3({ M }) {
    const A = mat(M);
    if (A.length !== 3 || A[0].length !== 3) throw new Error('se esperaba una matriz de 3 × 3');
    const diag = (pasos) => pasos.map(k => { const celdas = [0, 1, 2].map(i => [i, pasos === ab ? (k + i) % 3 : (k - i + 3) % 3]); return { celdas, P: celdas.reduce((s, [i, j]) => mul(s, A[i][j]), F(1)) }; });
    const ab = [0, 1, 2], ar = [2, 0, 1];
    const S = diag(ab), R = diag(ar);
    const P = S.reduce((s, x) => sum(s, x.P), F(0)), Sec = R.reduce((s, x) => sum(s, x.P), F(0)), D = res(P, Sec);
    const cof = [0, 1, 2].map(j => {
      const menor = [1, 2].map(i => [0, 1, 2].filter(c => c !== j).map(c => A[i][c]));
      const dm = res(mul(menor[0][0], menor[1][1]), mul(menor[0][1], menor[1][0])), signo = j % 2 ? -1 : 1;
      return { j, signo, menor: numeros(menor), detMenor: num(dm), termino: num(mul(F(signo), mul(A[0][j], dm))) };
    });
    const r = { valor: num(D), texto: txt(D), suman: S.map(x => ({ celdas: x.celdas, producto: num(x.P) })), restan: R.map(x => ({ celdas: x.celdas, producto: num(x.P) })),
      principales: num(P), secundarias: num(Sec), cofactores: cof };
    Object.assign(r, juntar(r.texto, [
      ['sumaTodo', errV(sum(P, Sec), 'MT6', 'Sarrus con un signo cambiado: suma las seis diagonales')],
      ['soloPrincipal', errV(mul(mul(A[0][0], A[1][1]), A[2][2]), 'MT27', 'solo multiplica la diagonal principal')],
      ['alReves', errV(res(Sec, P), 'MT28', 'resta al revés: secundarias menos principales')],
    ]));
    return r;
  }

  function detK({ detA, k, n }) {
    if (!(Number.isInteger(n) && n >= 1)) throw new Error('n debe ser un entero positivo');
    const D = Q(detA), K = Q(k), v = mul(potQ(K, n), D), r = { valor: num(v), texto: txt(v) };
    Object.assign(r, juntar(r.texto, [
      ['lineal', errV(mul(K, D), 'MT4', 'det(kA) = k·det A, como si k multiplicara una sola fila')],
      ['porElementos', errV(mul(potQ(K, n * n), D), 'MT24', 'k elevado al número de elementos (n²), no al orden n')],
    ]));
    return r;
  }

  function propiedadesDet({ detA, detB }) {
    const a = Q(detA), b = Q(detB), p = mul(a, b);
    const r = { valor: num(p), texto: `det(AB) = ${txt(p)}` };
    const af = (t, id, regla) => ({ texto: t, id, regla });
    Object.assign(r, juntar(r.texto, [
      ['suma', af(`det(A + B) = ${txt(sum(a, b))}`, 'MT3', 'det(A + B) = det A + det B')],
      ['transpuesta', cero(a) ? null : af(`det(Aᵀ) = ${txt(neg(a))}`, 'MT25', 'transponer cambia el signo del determinante')],
      ['ordenCambia', cero(p) ? null : af(`det(BA) = ${txt(neg(p))}`, 'MT26', 'cambiar el orden del producto cambia el signo')],
    ]));
    return r;
  }

  function inversa2({ M }) {
    const A = de2(M), [[a, b], [c, d]] = A, D = res(mul(a, d), mul(b, c));
    if (cero(D)) throw new Error('det = 0: no tiene inversa');
    const adj = [[d, neg(b)], [neg(c), a]], I = adj.map(f => f.map(x => div(x, D)));
    const r = { matriz: numeros(I), texto: textoQ(I), det: num(D), detTexto: txt(D), adjunta: numeros(adj) };
    const todos = [a, b, c, d].every(x => !cero(x));
    Object.assign(r, juntar(r.texto, [
      ['sinDividir', errM(adj, 'MT7', 'escribe la adjunta y no divide entre el determinante')],
      ['sinSignos', errM([[d, b], [c, a]].map(f => f.map(x => div(x, D))), 'MT13', 'intercambia a y d pero no cambia el signo de b y c')],
      ['sinIntercambiar', errM([[a, neg(b)], [neg(c), d]].map(f => f.map(x => div(x, D))), 'MT22', 'cambia los signos de b y c pero no intercambia a y d')],
      ['reciprocos', todos ? errM(A.map(f => f.map(x => div(F(1), x))), 'MT23', 'invierte cada elemento: 1/aᵢⱼ') : null],
    ]));
    return r;
  }

  function kSinInversa({ M }) {
    if (!Array.isArray(M) || M.length !== 2 || !M.every(f => Array.isArray(f) && f.length === 2)) throw new Error('se esperaba una matriz de 2 × 2');
    const pos = []; M.forEach((f, i) => f.forEach((x, j) => { if (x === 'k') pos.push([i, j]); }));
    if (pos.length !== 1) throw new Error("la matriz debe traer exactamente un elemento 'k'");
    // cada expresión es lineal en k: valor(k) = α·k + β; se halla con k = 0 y k = 1
    const con = k => M.map(f => f.map(x => (x === 'k' ? F(k) : Q(x))));
    const resolver = (f, id, regla) => {
      const b0 = f(con(0)), a1 = res(f(con(1)), b0);
      if (cero(a1)) return null;
      return { valor: num(div(neg(b0), a1)), texto: `k = ${txt(div(neg(b0), a1))}`, id, regla };
    };
    const D = ([[a, b], [c, d]]) => res(mul(a, d), mul(b, c));
    const bien = resolver(D);
    if (!bien) throw new Error('el determinante no depende de k');
    const r = { valor: bien.valor, texto: bien.texto };
    Object.assign(r, juntar(r.texto, [
      ['sumaDiagonales', resolver(([[a, b], [c, d]]) => sum(mul(a, d), mul(b, c)), 'MT5', 'iguala a 0 ad + bc')],
      ['filas', resolver(([[a, b], [c, d]]) => res(mul(a, b), mul(c, d)), 'MT19', 'iguala a 0 ab − cd (multiplica por filas)')],
      ['cero', { valor: 0, texto: 'k = 0', id: 'MT21', regla: 'cree que no hay inversa cuando un elemento vale 0' }],
    ]));
    return r;
  }

  function cramer2({ A, b }) {
    const X = de2(A); if (!Array.isArray(b) || b.length !== 2) throw new Error('b debe ser [e, f]');
    const [e, f] = b.map(Q), [[a, bb], [c, d]] = X;
    const D = res(mul(a, d), mul(bb, c)); if (cero(D)) throw new Error('det = 0: Cramer no se aplica');
    const Dx = res(mul(e, d), mul(bb, f)), Dy = res(mul(a, f), mul(e, c)), x = div(Dx, D), y = div(Dy, D);
    const r = { det: num(D), detX: num(Dx), detY: num(Dy), x: num(x), y: num(y), texto: `x = ${txt(x)}`, textoY: `y = ${txt(y)}` };
    Object.assign(r, juntar(r.texto, [
      ['sinDividir', errV(Dx, 'MT29', 'se queda con Δx y no divide entre Δ', 'x = ')],
      ['alReves', cero(Dx) ? null : errV(div(D, Dx), 'MT30', 'divide al revés: Δ/Δx', 'x = ')],
      ['otraColumna', errV(y, 'MT31', 'reemplaza la columna equivocada: calcula Δy/Δ', 'x = ')],
    ]));
    return r;
  }

  // sistema A·(x; y) = b con UNA 'k' en A: el k que deja Δ = 0 (sin solución única)
  function kSistema({ A, b }) {
    if (!Array.isArray(b) || b.length !== 2) throw new Error('b debe ser [e, f]');
    const base = kSinInversa({ M: A }), B = b.map(Q);
    const con = k => A.map(f => f.map(x => (x === 'k' ? F(k) : Q(x))));
    const dx = M => res(mul(B[0], M[1][1]), mul(M[0][1], B[1])), dy = M => res(mul(M[0][0], B[1]), mul(B[0], M[1][0]));
    const resolver = (f, id, regla) => { const b0 = f(con(0)), a1 = res(f(con(1)), b0); if (cero(a1)) return null;
      const v = div(neg(b0), a1); return { valor: num(v), texto: `k = ${txt(v)}`, id, regla }; };
    const cambiado = resolver(dx, 'AL17', 'cree que no hay solución única cuando Δx = 0') || resolver(dy, 'AL17', 'cree que no hay solución única cuando Δy = 0');
    const r = { valor: base.valor, texto: base.texto };
    Object.assign(r, juntar(r.texto, [
      ['sumaDiagonales', base.errores.sumaDiagonales || null],
      ['cambiado', cambiado],
      ['cero', { valor: 0, texto: 'k = 0', id: 'MT21', regla: 'cree que un 0 en la matriz impide la solución única' }],
    ]));
    return r;
  }

  // reemplaza letras en una matriz cuyos elementos son números o expresiones lineales ('x + 2', '2y', '−1', '1/2')
  function sustituir({ M, valores }) {
    const ev = e => {
      if (typeof e === 'number') return Q(e);
      const t = String(e).replace(/−/g, '-').replace(/\s+/g, '');
      if (!t) throw new Error('expresión vacía');
      let acc = F(0);
      for (const m of t.match(/[+-]?[^+-]+/g)) {
        const k = m.match(/^([+-]?)(\d+(?:\/\d+)?)?([a-z]?)$/);
        if (!k || (!k[2] && !k[3])) throw new Error(`«${e}» no es una expresión lineal`);
        let v = k[2] ? Q(k[2]) : F(1);
        if (k[3]) { if (!(k[3] in valores)) throw new Error(`falta el valor de ${k[3]}`); v = mul(v, Q(valores[k[3]])); }
        acc = k[1] === '-' ? res(acc, v) : sum(acc, v);
      }
      return acc;
    };
    if (!Array.isArray(M) || !M.length) throw new Error('la matriz debe ser una lista de filas no vacías');
    const R = M.map(f => f.map(ev));
    return { matriz: numeros(R), texto: textoQ(R) };
  }

  function cramer3({ A, b }) {
    const X = mat(A, 'A'); if (X.length !== 3 || X[0].length !== 3) throw new Error('se esperaba una matriz de 3 × 3');
    if (!Array.isArray(b) || b.length !== 3) throw new Error('b debe tener tres números');
    const B = b.map(Q), D = detQ(X); if (cero(D)) throw new Error('det = 0: Cramer no se aplica');
    const ds = [0, 1, 2].map(j => detQ(X.map((f, i) => f.map((v, k) => (k === j ? B[i] : v)))));
    const s = ds.map(d => div(d, D));
    return { det: num(D), dets: ds.map(num), x: num(s[0]), y: num(s[1]), z: num(s[2]), texto: `x = ${txt(s[0])}; y = ${txt(s[1])}; z = ${txt(s[2])}` };
  }

  function productoTranspuesta({ A, B }) {
    const X = mat(A, 'A'), Y = mat(B, 'B'), P = prod(X, Y);
    if (!P) throw new Error('el número de columnas de A debe ser igual al de filas de B');
    const T = tr(P), r = { matriz: numeros(T), texto: textoQ(T) };
    Object.assign(r, juntar(r.texto, [
      ['AtBt', errM(prod(tr(X), tr(Y)), 'MT9', '(AB)ᵀ = AᵀBᵀ, sin invertir el orden')],
      ['sinTransponer', errM(P, 'MT32', 'deja el producto AB sin transponer')],
    ]));
    return r;
  }

  function aplicar({ M, p }) {
    const A = de2(M), [x, y] = p.map(Q);
    return [num(sum(mul(A[0][0], x), mul(A[0][1], y))), num(sum(mul(A[1][0], x), mul(A[1][1], y)))];
  }
  function paralelogramo({ M }) {
    const A = de2(M), u = [num(A[0][0]), num(A[1][0])], v = [num(A[0][1]), num(A[1][1])];
    const D = res(mul(A[0][0], A[1][1]), mul(A[0][1], A[1][0]));
    return { u, v, vertices: [[0, 0], u, [u[0] + v[0], u[1] + v[1]], v], area: Math.abs(num(D)), det: num(D),
      orientacion: D.n > 0 ? 'antihorario' : D.n < 0 ? 'horario' : 'plano' };
  }
  function cizalla({ M }) {
    const [[a, b], [c, d]] = de2(M);
    if (cero(a)) throw new Error('cizalla: se necesita a ≠ 0');
    const D = res(mul(a, d), mul(b, c)), t1 = div(b, a), alto = div(D, a);
    const u = [a, c], v = [b, d], v1 = [F(0), alto];               // v − (b/a)·u
    const t2 = cero(alto) ? F(0) : div(c, alto), u2 = [a, F(0)];  // u − t2·v1
    const n2 = w => w.map(num);
    return { pasos: [{ u: n2(u), v: n2(v) }, { u: n2(u), v: n2(v1) }, { u: n2(cero(alto) ? u : u2), v: n2(v1) }],
      t1: num(t1), t2: num(t2), ancho: num(a), alto: num(alto), det: num(D) };
  }

  return { textoMatriz, textoNumero, orden, construir, elemento, tipos, iguales, sumar, escalar, transpuesta, producto,
    ordenProducto, composicion, kSistema, sustituir, det, det2, det3, detK, propiedadesDet, inversa2, kSinInversa, cramer2, cramer3,
    productoTranspuesta, aplicar, paralelogramo, cizalla };
});
