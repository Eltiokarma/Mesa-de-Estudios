/*
 * Teoría de «Matrices y determinantes» (algebra.matrices-y-determinantes). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 15), expediente teoria-152-unidades (Álgebra) y
 * historia-ecuaciones (pp. 57–68). Errores: los MT de plantillas/matrices/ (hipótesis) y TAL-* nuevos.
 * Colores (regla 4): la fila (o la primera columna) en estudio naranja (c-o), la columna (o la segunda) turquesa
 * (c-i), el resultado verde (c-d), lo que cambia de signo o falla rojo (c-h).
 * Notación en texto plano: una matriz se escribe por filas, separadas por punto y coma: (1, 2; 3, 4).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · leer una matriz como tabla con reglas: qué se multiplica con qué, qué mide el determinante y cuándo hay inversa.
 * Persona y condiciones · 5.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · multiplica fila por columna, transpone, calcula traza, determinante, inversa 2×2 y rango.
 * Orden de atención · 1.º la tabla o el paralelogramo · 2.º la casilla o el área que cambia · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué AB no se calcula casilla por casilla y por qué det = 0 no es «la matriz es cero».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const A = { v: 'c-o', t: 'A' }, B = { v: 'c-i', t: 'B' };
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    return r;
  }
  function distintas(ops) {
    const vistos = new Set(), out = [];
    for (const o of ops) { const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined|Infinity/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }
  // Fracción exacta n/d simplificada, como texto: «−3/2», «4».
  const mcd = (a, b) => (b ? mcd(b, a % b) : Math.abs(a));
  function fr(n, d = 1) {
    if (d < 0) { n = -n; d = -d; }
    const g = mcd(Math.round(n), Math.round(d)) || 1;
    n = Math.round(n) / g; d = Math.round(d) / g;
    return d === 1 ? f(n) : `${n < 0 ? '−' : ''}${Math.abs(n)}/${d}`;
  }
  const pa = v => (v < 0 ? `(${f(v)})` : f(v));
  const mt = M => `(${M.map(fila => fila.map(x => (typeof x === 'string' ? x : f(x))).join(', ')).join('; ')})`;
  const prod = (X, Y) => X.map(fila => Y[0].map((_, j) => fila.reduce((s, x, k) => s + x * Y[k][j], 0)));
  const tr = X => X[0].map((_, j) => X.map(fila => fila[j]));
  const det2 = ([[a, b], [c, d]]) => a * d - b * c;
  const det3 = M => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
  // Rango por eliminación de Gauss (con tolerancia: las entradas son enteros chicos).
  function rango(M) {
    const X = M.map(r => r.slice()); let rg = 0;
    for (let c = 0; c < X[0].length && rg < X.length; c++) {
      let p = X.findIndex((r, i) => i >= rg && Math.abs(r[c]) > 1e-9);
      if (p < 0) continue;
      [X[rg], X[p]] = [X[p], X[rg]];
      for (let i = 0; i < X.length; i++) if (i !== rg) { const k = X[i][c] / X[rg][c]; X[i] = X[i].map((x, j) => x - k * X[rg][j]); }
      rg++;
    }
    return rg;
  }
  // Una matriz en la pieza alg-tabla: entre corchetes, con color por fila o por columna.
  const celdas = (M, color = () => null, desde = () => 0) => M.map((fila, i) => fila.map((x, j) => ({ t: typeof x === 'string' ? x : f(x), color: color(i, j), desde: desde(i, j) })));
  const matriz = (M, o = {}) => ({ corchetes: true, filas: celdas(M, o.color, o.desde), alt: o.alt || `Matriz ${mt(M)}`, resaltes: o.resaltes || [], pie: o.pie || '' });

  // ---------- Idea 1: fila por columna ----------
  // Cambia: los tamaños de A y B · Permanece: la regla «columnas de A = filas de B» · Progresa: cada casilla de AB
  // · Se reserva: BA, que da otra cosa · Debe verse: la casilla (i, j) usa la fila i entera y la columna j entera.
  const tamanos = val => {
    const existe = val.n === val.p;
    return {
      columnas: ['', 'filas', 'columnas'], colorCol: [null, null, null],
      filas: [
        [{ t: 'A', color: 'o', fuerte: true }, String(val.m), { t: String(val.n), color: 'o', fuerte: true }],
        [{ t: 'B', color: 'i', fuerte: true }, { t: String(val.p), color: 'i', fuerte: true }, String(val.q)],
        [{ t: 'AB', color: 'd', fuerte: true }, existe ? { t: String(val.m), color: 'd' } : { t: 'no existe', color: 'h' }, existe ? { t: String(val.q), color: 'd' } : ''],
      ],
      resaltes: [{ f: 0, c: 2, color: existe ? 'd' : 'h' }, { f: 1, c: 1, color: existe ? 'd' : 'h' }],
      alt: `A de ${val.m} por ${val.n} y B de ${val.p} por ${val.q}: ${existe ? `AB es ${val.m} por ${val.q}` : 'AB no existe'}`,
    };
  };
  const PA = [[1, 2], [3, 4]], PB = [[0, 1], [1, 0]];
  const producto = {
    id: 'fila-por-columna',
    titulo: 'Fila por columna',
    temas: ['Operaciones con matrices'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Elige cuántas filas y columnas tienen A y B. Mira cuándo existe el producto AB y qué tamaño tiene.',
      voz: 'Fíjate en los dos números que se tocan.',
      controles: [
        { id: 'm', etiqueta: 'Filas de A', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0 },
        { id: 'n', etiqueta: 'Columnas de A', min: 1, max: 3, paso: 1, inicio: 3, decimales: 0, color: 'c-o' },
        { id: 'p', etiqueta: 'Filas de B', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
        { id: 'q', etiqueta: 'Columnas de B', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: val => ({ datos: tamanos(val), estado: {} }),
      lectura: val => [A, ` ${val.m}×${val.n} · `, B, ` ${val.p}×${val.q}: `, val.n === val.p ? `AB es ${val.m}×${val.q}` : 'AB no existe'],
      minimo: 4,
    },
    predice: (() => {
      const P = prod(PA, PB), Q = prod(PB, PA), E = PA.map((r, i) => r.map((x, j) => x * PB[i][j]));
      return {
        pregunta: [A, ` = ${mt(PA)} y `, B, ` = ${mt(PB)}, escritas por filas. ¿Cuánto vale `, A, B, '?'],
        opciones: [
          { id: 'c', texto: mt(P), correcta: true },
          { id: 'casilla', texto: mt(E), error: 'MT1', siFuera: 'Eso multiplica casilla con casilla; el producto usa fila por columna.' },
          { id: 'ba', texto: mt(Q), error: 'MT2', siFuera: 'Ese es BA: B a la izquierda. En general AB y BA son distintos.' },
          { id: 'filas', texto: mt(prod(PA, tr(PB))), error: 'MT14', siFuera: 'Eso multiplica fila de A por fila de B; va fila por columna.' },
        ].filter((o, k, l) => l.findIndex(x => x.texto === o.texto) === k),
        dibujo: { datos: matriz(PA, { color: i => (i === 0 ? 'o' : null), alt: `A = ${mt(PA)}` }), estado: {} },
        revelar: { datos: matriz(P, { color: () => 'd', alt: `AB = ${mt(P)}` }), estado: {} },
        coincide: `Coincide: cada fila de A por cada columna de B da ${mt(P)}.`,
      };
    })(),
    mira: (() => {
      const P = prod(PA, PB);
      return {
        datos: {
          columnas: ['A', '', '', 'B', '', '', 'AB', ''], colorCol: ['o', null, null, 'i', null, null, 'd'],
          filas: [0, 1].map(i => [
            ...PA[i].map(x => ({ t: f(x), color: i === 0 ? 'o' : null })), '',
            ...PB[i].map((x, j) => ({ t: f(x), color: j === 0 ? 'i' : null })), '',
            ...P[i].map((x, j) => ({ t: f(x), color: 'd', fuerte: true, desde: 1 + 2 * i + j })),
          ]),
          resaltes: [{ f: 0, c: 0, ancho: 2, color: 'o', desde: 1 }, { f: 0, c: 3, alto: 2, color: 'i', desde: 1 }],
          alt: `A = ${mt(PA)}, B = ${mt(PB)} y AB = ${mt(P)}, casilla por casilla`,
        },
        voz: 'Creo que conviene seguir una sola casilla primero.',
        pasos: [
          { estado: { corte: 1 }, texto: 'Casilla (1, 1): fila 1 de A por columna 1 de B.', ecuacion: [`1·0 + 2·1 = ${P[0][0]}`] },
          { estado: { corte: 2 }, texto: 'Casilla (1, 2): la misma fila, la columna 2.', ecuacion: [`1·1 + 2·0 = ${P[0][1]}`] },
          { estado: { corte: 3 }, texto: 'Casilla (2, 1): fila 2 de A, columna 1 de B.', ecuacion: [`3·0 + 4·1 = ${P[1][0]}`] },
          { estado: { corte: 4 }, texto: 'Casilla (2, 2): fila 2, columna 2.', ecuacion: [`3·1 + 4·0 = ${P[1][1]}`] },
          { estado: { corte: 4 }, texto: `En otro orden, BA = ${mt(prod(PB, PA))}: no es lo mismo.`, ecuacion: [A, B, ' ≠ ', B, A] },
        ],
      };
    })(),
    regla: {
      texto: 'AB existe si A tiene tantas columnas como filas tiene B. Su casilla (i, j) multiplica la fila i de A por la columna j de B.',
      ecuacion: [{ sub: ['(AB)', 'ij'] }, ' = ', { sub: [A, 'i1'] }, { sub: [B, '1j'] }, ' + ', { sub: [A, 'i2'] }, { sub: [B, '2j'] }, ' + …'],
      condicion: 'la suma A + B exige el mismo tamaño y va casilla por casilla; en general AB y BA son distintos.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n = s % 3 === 2 ? 3 : 2;
        const X = [0, 1].map(() => Array.from({ length: n }, () => r.ent(-3, 4)));
        const Y = Array.from({ length: n }, () => [r.ent(-3, 4), r.ent(-3, 4)]);
        const i = r.ent(0, 1), j = r.ent(0, 1), P = prod(X, Y), bien = P[i][j];
        const fila = X[i], col = Y.map(z => z[j]);
        return {
          pregunta: [A, ` = ${mt(X)} y `, B, ` = ${mt(Y)}. ¿Cuánto vale la casilla de la fila ${i + 1}, columna ${j + 1} de `, A, B, '?'],
          opciones: distintas([
            { id: 'c', texto: f(bien), correcta: true },
            { id: 'casilla', texto: f(X[i][j] * Y[i][j]), error: 'MT1', siFuera: 'Eso multiplica solo las casillas en la misma posición.' },
            { id: 'filas', texto: f(X[i].reduce((s2, x, k) => s2 + x * (Y[k] ? Y[k][(j + 1) % 2] : 0), 0)), error: 'MT14', siFuera: `Esa es la casilla de la columna ${(j + 1) % 2 + 1}; revisa qué columna de B usas.` },
            { id: 'suma', texto: f(fila.reduce((a, b) => a + b, 0) + col.reduce((a, b) => a + b, 0)), error: 'TAL-SUMA-TODO', siFuera: 'Eso suma la fila y la columna; hay que multiplicar término a término.' },
            { id: 'sin-sumar', texto: f(fila[0] * col[0]), error: 'TAL-UN-TERMINO', siFuera: 'Ese es solo el primer producto; faltan los demás.' },
          ]).slice(0, 4),
          solucion: { texto: `Fila ${i + 1} de A por columna ${j + 1} de B, y se suma.`, ecuacion: [fila.map((x, k) => `${x < 0 ? `(${f(x)})` : f(x)}·${col[k] < 0 ? `(${f(col[k])})` : f(col[k])}`).join(' + ') + ` = ${f(bien)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: transponer cambia filas por columnas ----------
  // Cambia: el tipo de matriz · Permanece: las casillas y sus valores · Progresa: la diagonal y la traza · Se reserva:
  // la simétrica, igual a su transpuesta · Debe verse: la fila 1 (naranja) pasa a ser la columna 1.
  const TIPOS = {
    rectangular: { M: [[1, 4, 0], [2, -1, 3]], nombre: 'rectangular 2×3' },
    cuadrada: { M: [[2, 1, 5], [0, 3, -1], [4, 2, 1]], nombre: 'cuadrada 3×3' },
    diagonal: { M: [[3, 0, 0], [0, -1, 0], [0, 0, 2]], nombre: 'diagonal' },
    identidad: { M: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], nombre: 'identidad' },
    triangular: { M: [[2, 5, 1], [0, 4, 3], [0, 0, 1]], nombre: 'triangular superior' },
    simetrica: { M: [[1, 2, 5], [2, 0, 3], [5, 3, 4]], nombre: 'simétrica' },
  };
  const traza = M => (M.length === M[0].length ? M.reduce((s, fila, i) => s + fila[i], 0) : null);
  const tablaTipo = (M, ver) => {
    const X = ver ? tr(M) : M;
    const cuadrada = X.length === X[0].length;
    return matriz(X, {
      color: (i, j) => (ver ? (j === 0 ? 'o' : null) : (i === 0 ? 'o' : null)),
      resaltes: cuadrada ? X.map((_, i) => ({ f: i, c: i, color: 'd' })) : [],
      alt: `${ver ? 'Transpuesta' : 'Matriz'} ${mt(X)}${cuadrada ? `; diagonal resaltada, traza ${traza(X)}` : ''}`,
    });
  };
  const transpuesta = {
    id: 'tipos-traza-transpuesta',
    titulo: 'Filas que pasan a columnas',
    temas: ['Tipos de matrices', 'Traza y transpuesta'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Elige un tipo de matriz y mírala sola o transpuesta. La primera fila va en naranja; la diagonal, en verde si es cuadrada.',
      voz: 'Mira a dónde va la fila naranja al transponer.',
      controles: [
        { id: 'tipo', etiqueta: 'Tipo', opciones: Object.entries(TIPOS).map(([k, x]) => ({ valor: k, texto: x.nombre })) },
        { id: 'ver', etiqueta: 'Ver', opciones: [{ valor: 'A', texto: 'A' }, { valor: 'At', texto: 'Aᵀ' }] },
      ],
      dibujo: val => ({ datos: tablaTipo(TIPOS[val.tipo].M, val.ver === 'At'), estado: {} }),
      lectura: val => {
        const M = val.ver === 'At' ? tr(TIPOS[val.tipo].M) : TIPOS[val.tipo].M, t = traza(M);
        return [`${M.length}×${M[0].length} · `, t === null ? 'sin traza: no es cuadrada' : `traza = ${f(t)}`];
      },
      minimo: 4,
    },
    predice: (() => {
      const M = [[1, 2], [3, 4]], N = [[1, 3], [3, 4]], O = [[1, -2], [2, 4]], Q = [[4, 2], [3, 1]];
      return {
        pregunta: '¿Cuál de estas matrices es igual a su transpuesta? Están escritas por filas.',
        opciones: [
          { id: 'c', texto: mt(N), correcta: true },
          { id: 'cuadrada', texto: mt(M), error: 'TAL-SIMETRICA', siFuera: `Su transpuesta es ${mt(tr(M))}: el 2 y el 3 cambian de lugar.` },
          { id: 'signo', texto: mt(O), error: 'MT25', siFuera: `Transponer no cambia signos; su transpuesta es ${mt(tr(O))}.` },
          { id: 'giro', texto: mt(Q), error: 'MT10', siFuera: `Transponer no gira la matriz; su transpuesta es ${mt(tr(Q))}.` },
        ],
        dibujo: { datos: matriz(N, { alt: `Matriz ${mt(N)}` }), estado: {} },
        revelar: { datos: matriz(tr(N), { color: (i, j) => (i !== j ? 'd' : null), alt: `Su transpuesta ${mt(tr(N))}: igual` }), estado: {} },
        coincide: 'Coincide: las casillas fuera de la diagonal son iguales a ambos lados; es simétrica.',
      };
    })(),
    mira: (() => {
      const M = [[1, 4, 0], [2, -1, 3]], T = tr(M);
      return {
        datos: {
          columnas: ['A', '', '', '', 'Aᵀ', ''], colorCol: [null, null, null, null, null, null],
          filas: [0, 1, 2].map(i => [
            ...(M[i] ? M[i].map(x => ({ t: f(x), color: i === 0 ? 'o' : 'i' })) : ['', '', '']), '',
            ...T[i].map((x, j) => ({ t: f(x), color: j === 0 ? 'o' : 'i', desde: j === 0 ? 1 : 2 })),
          ]),
          alt: `A = ${mt(M)} de 2×3 y su transpuesta ${mt(T)} de 3×2`,
        },
        pasos: [
          { estado: { corte: 0 }, texto: 'A tiene 2 filas y 3 columnas.', ecuacion: [A, ' es 2×3'] },
          { estado: { corte: 1 }, texto: 'La fila 1 de A se escribe como columna 1 de Aᵀ.', ecuacion: ['(1, 4, 0) → columna 1'] },
          { estado: { corte: 2 }, texto: 'La fila 2 pasa a la columna 2: Aᵀ es 3×2.', ecuacion: [{ sub: ['(Aᵀ)', 'ij'] }, ' = ', { sub: [A, 'ji'] }] },
          { estado: { corte: 2 }, texto: 'La traza solo existe en matrices cuadradas: suma la diagonal.', ecuacion: ['tr(', A, ') = ', { sub: ['a', '11'] }, ' + ', { sub: ['a', '22'] }, ' + …'] },
        ],
      };
    })(),
    regla: {
      texto: 'La transpuesta cambia filas por columnas. La traza suma la diagonal de una matriz cuadrada, y no cambia al transponer. Simétrica significa igual a su transpuesta.',
      ecuacion: [{ sub: ['(Aᵀ)', 'ij'] }, ' = ', { sub: [A, 'ji'] }, '   ·   tr(Aᵀ) = tr(', A, ')'],
      condicion: 'diagonal, identidad y triangular son matrices cuadradas; una de m×n tiene transpuesta de n×m.',
    },
    ahoraTu: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        const n = r.ent(2, 3), m = tipo === 2 ? (n === 2 ? 3 : 2) : n;
        const M = Array.from({ length: m }, () => Array.from({ length: n }, () => r.ent(-4, 6)));
        if (tipo === 0) {
          const t = traza(M), anti = M.reduce((s2, fila, i) => s2 + fila[n - 1 - i], 0);
          return {
            pregunta: [A, ` = ${mt(M)}, escrita por filas. ¿Cuánto vale la traza de `, A, '?'],
            dibujo: { datos: matriz(M), estado: {} },
            opciones: distintas([
              { id: 'c', texto: f(t), correcta: true },
              { id: 'anti', texto: f(anti), error: 'TAL-TRAZA-OTRA', siFuera: 'Esa es la otra diagonal; la traza usa la que baja de izquierda a derecha.' },
              { id: 'todo', texto: f(M.flat().reduce((a, b) => a + b, 0)), error: 'TAL-TRAZA-TODO', siFuera: 'Eso suma todas las casillas; la traza suma solo la diagonal.' },
              { id: 'prod', texto: f(M.reduce((s2, fila, i) => s2 * fila[i], 1)), error: 'TAL-TRAZA-PROD', siFuera: 'Eso multiplica la diagonal; la traza la suma.' },
            ]),
            solucion: { texto: 'Se suman las casillas de la diagonal.', ecuacion: [`tr(A) = ${M.map((fila, i) => (fila[i] < 0 ? `(${f(fila[i])})` : f(fila[i]))).join(' + ')} = ${f(t)}`], dibujo: { datos: Object.assign(matriz(M), { resaltes: M.map((_, i) => ({ f: i, c: i, color: 'd' })) }), estado: {} } },
          };
        }
        const i = r.ent(0, n - 1), j = r.ent(0, m - 1);
        if (tipo === 1) {
          let q; do { q = r.ent(0, n - 1); } while (q === i && n > 1 && M[i][q] === M[q][i] && s % 7 !== 0);
          return {
            pregunta: [A, ` = ${mt(M)}. ¿Cuánto vale la casilla de la fila ${i + 1}, columna ${q + 1} de Aᵀ?`],
            dibujo: { datos: matriz(M), estado: {} },
            opciones: distintas([
              { id: 'c', texto: f(M[q][i]), correcta: true },
              { id: 'misma', texto: f(M[i][q]), error: 'MT10', siFuera: `Esa es la casilla (${i + 1}, ${q + 1}) de A; en Aᵀ se lee la (${q + 1}, ${i + 1}).` },
              { id: 'signo', texto: f(-M[q][i]), error: 'MT25', siFuera: 'Transponer no cambia el signo de las casillas.' },
              { id: 'otra', texto: f(M[(q + 1) % n][i]), error: 'TAL-TRANSP-CORRE', siFuera: 'Esa casilla está corrida una fila; cuenta otra vez.' },
              { id: 'otra2', texto: f(M[q][(i + 1) % n]), error: 'TAL-TRANSP-CORRE', siFuera: 'Esa casilla está corrida una columna; cuenta otra vez.' },
            ]),
            solucion: { texto: `En Aᵀ, la casilla (${i + 1}, ${q + 1}) es la (${q + 1}, ${i + 1}) de A.`, ecuacion: [{ sub: ['(Aᵀ)', `${i + 1}${q + 1}`] }, ' = ', { sub: [A, `${q + 1}${i + 1}`] }, ` = ${f(M[q][i])}`] },
          };
        }
        return {
          pregunta: [A, ` = ${mt(M)} tiene ${m} filas y ${n} columnas. ¿Qué tamaño tiene `, A, 'ᵀ·', A, '?'],
          opciones: distintas([
            { id: 'c', texto: `${n}×${n}`, correcta: true },
            { id: 'mm', texto: `${m}×${m}`, error: 'MT11', siFuera: `Ese es el tamaño de A·Aᵀ; Aᵀ·A tiene ${n} filas.` },
            { id: 'mn', texto: `${m}×${n}`, error: 'TAL-TAMANO', siFuera: `Ese es el tamaño de A; Aᵀ es ${n}×${m}.` },
            { id: 'no', texto: 'No existe', error: 'MT16', siFuera: `Sí existe: Aᵀ tiene ${m} columnas y A tiene ${m} filas.` },
          ]),
          solucion: { texto: `Aᵀ es ${n}×${m} y A es ${m}×${n}: se tocan los ${m}.`, ecuacion: [`(${n}×${m})·(${m}×${n}) → ${n}×${n}`] },
        };
      },
    },
  };

  // ---------- Idea 3: el determinante es un área con signo ----------
  // Cambia: las columnas (a, c) y (b, d) · Permanece: el origen y la escala · Progresa: el paralelogramo ·
  // Se reserva: el paralelogramo aplastado (det = 0) · Debe verse: área = |ad − bc| y el signo es el giro.
  const EJE3 = { x: { min: -2, max: 10, paso: 1, cada: 2, nombre: 'x', decimales: 0 }, y: { min: -2, max: 6, paso: 1, nombre: 'y', decimales: 0 } };
  const para = (a, b, c, d, o = {}) => {
    const D = a * d - b * c;
    return Object.assign({}, EJE3, {
      areas: [{ puntos: [[0, 0], [a, c], [a + b, c + d], [b, d]], color: D >= 0 ? 'd' : 'h', cerrada: true, rotulo: o.rotulo, desde: o.desdeArea }],
      curvas: [{ puntos: [[0, 0], [a, c]], color: 'o', rotulo: 'col 1' }, { puntos: [[0, 0], [b, d]], color: 'i', rotulo: 'col 2' }],
      puntos: [{ x: a, y: c, color: 'o' }, { x: b, y: d, color: 'i' }],
      alt: `Paralelogramo de las columnas (${a}, ${c}) y (${b}, ${d}); área con signo ${D}`,
    });
  };
  const determinante = {
    id: 'determinante-area',
    titulo: 'El determinante es un área',
    temas: ['Determinantes y propiedades'],
    pieza: 'ejes',
    juega: {
      consigna: 'Columnas (a, c) en naranja y (b, d) en turquesa. Mira el paralelogramo: verde si det > 0 y rojo si det < 0.',
      voz: 'Busca columnas que dejen el paralelogramo aplastado.',
      controles: [
        { id: 'a', etiqueta: 'a', min: 1, max: 4, paso: 1, inicio: 3, decimales: 0, color: 'c-o' },
        { id: 'c', etiqueta: 'c', min: -1, max: 2, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: -1, max: 4, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
        { id: 'd', etiqueta: 'd', min: -1, max: 4, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
      ],
      dibujo: val => ({ datos: para(val.a, val.b, val.c, val.d), estado: {} }),
      lectura: val => [`det = ${f(val.a)}·${f(val.d)} − ${f(val.b)}·${f(val.c)} = ${f(val.a * val.d - val.b * val.c)}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Una matriz tiene columnas (2, 1) y (4, 2): la segunda es el doble de la primera. ¿Cuánto vale su determinante?',
      opciones: [
        { id: 'c', texto: f(det2([[2, 4], [1, 2]])), correcta: true },
        { id: 'suma', texto: f(2 * 2 + 4 * 1), error: 'MT5', siFuera: 'Eso suma los dos productos; el determinante los resta: ad − bc.' },
        { id: 'diag', texto: f(2 * 2), error: 'TAL-DET-DIAG', siFuera: 'Ese es solo el producto de la diagonal; falta restar bc.' },
        { id: 'nula', texto: 'No tiene: la matriz no es nula', error: 'TAL-DET-NULA', siFuera: 'Toda matriz cuadrada tiene determinante; vale 0 aunque sus casillas no sean 0.' },
      ],
      dibujo: { datos: Object.assign({}, EJE3, { curvas: [{ puntos: [[0, 0], [4, 2]], color: 'i' }, { puntos: [[0, 0], [2, 1]], color: 'o' }], puntos: [{ x: 2, y: 1, color: 'o', rotulo: '(2, 1)' }, { x: 4, y: 2, color: 'i', rotulo: '(4, 2)' }], alt: 'Las columnas (2, 1) y (4, 2) sobre la misma recta' }), estado: {} },
      revelar: { datos: para(2, 4, 1, 2, { rotulo: 'área 0' }), estado: {} },
      coincide: 'Coincide: las columnas están en la misma recta; el paralelogramo se aplasta y su área es 0.',
    },
    mira: (() => {
      // Cada paso dibuja su propio paralelogramo (desde/hasta): intercambio, columna doble y columnas alineadas.
      const casos = [[3, 1, 1, 2], [1, 3, 2, 1], [6, 1, 2, 2], [3, 6, 1, 2]];
      const areas = [], curvas = [];
      casos.forEach(([a, b, c, d], k) => {
        const D = a * d - b * c, desde = k + 2, hasta = k === 3 ? undefined : k + 2;
        areas.push({ puntos: [[0, 0], [a, c], [a + b, c + d], [b, d]], color: D >= 0 ? 'd' : 'h', cerrada: true, rotulo: `${f(D)}`, desde, hasta });
        curvas.push({ puntos: [[0, 0], [a, c]], color: 'o', rotulo: 'col 1', desde: k ? desde : 0, hasta: k === 0 ? 2 : hasta });
        curvas.push({ puntos: [[0, 0], [b, d]], color: 'i', rotulo: 'col 2', desde: k ? desde : 0, hasta: k === 0 ? 2 : hasta });
      });
      return {
        datos: Object.assign({}, EJE3, { areas, curvas, alt: 'Paralelogramos de cuatro matrices: área 5, −5 al intercambiar columnas, 10 al duplicar una y 0 si quedan alineadas' }),
        voz: 'Creo que el área y el número son lo mismo. Comprobemos.',
        pasos: [
          { estado: { corte: 1 }, texto: 'Columnas (3, 1) y (1, 2): los lados del paralelogramo.', ecuacion: [A, ' = (3, 1; 1, 2)'] },
          { estado: { corte: 2 }, texto: 'Su área es ad − bc.', ecuacion: [`det A = 3·2 − 1·1 = ${det2([[3, 1], [1, 2]])}`] },
          { estado: { corte: 3 }, texto: 'Si las columnas se intercambian, el giro se invierte: cambia el signo.', ecuacion: [`1·1 − 3·2 = ${f(det2([[1, 3], [2, 1]]))}`] },
          { estado: { corte: 4 }, texto: 'Si una columna se duplica, el área se duplica.', ecuacion: [`6·2 − 1·2 = ${det2([[6, 1], [2, 2]])}`] },
          { estado: { corte: 5 }, texto: 'Si las columnas quedan alineadas, el área es 0.', ecuacion: [`3·2 − 6·1 = ${det2([[3, 6], [1, 2]])}`] },
        ],
      };
    })(),
    regla: {
      texto: 'El determinante de una matriz 2×2 es el área con signo del paralelogramo de sus columnas. Vale 0 justo cuando las columnas están alineadas.',
      ecuacion: ['det', { par: ['a, b; c, d'] }, ' = ad − bc'],
      condicion: 'solo para matrices cuadradas; intercambiar dos columnas cambia el signo, y multiplicar una por k multiplica el determinante por k.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 2) {
          const M = [0, 1, 2].map(() => [r.ent(-2, 3), r.ent(-2, 3), r.ent(-2, 3)]);
          const D = det3(M);
          const diag = M[0][0] * M[1][1] * M[2][2] + M[0][1] * M[1][2] * M[2][0] + M[0][2] * M[1][0] * M[2][1];
          const anti = M[0][2] * M[1][1] * M[2][0] + M[0][0] * M[1][2] * M[2][1] + M[0][1] * M[1][0] * M[2][2];
          return {
            pregunta: [A, ` = ${mt(M)}, escrita por filas. ¿Cuánto vale det `, A, '?'],
            opciones: distintas([
              { id: 'c', texto: f(D), correcta: true },
              { id: 'suma', texto: f(diag + anti), error: 'MT6', siFuera: 'En Sarrus, los productos de las diagonales que suben se restan.' },
              { id: 'al-reves', texto: f(anti - diag), error: 'MT28', siFuera: 'Esa resta va al revés: bajan menos suben.' },
              { id: 'diag', texto: f(M[0][0] * M[1][1] * M[2][2]), error: 'MT27', siFuera: 'Ese es solo el producto de la diagonal principal.' },
              { id: 'baja', texto: f(diag), error: 'MT27', siFuera: 'Esas son solo las diagonales que bajan; falta restar las que suben.' },
              { id: 'todo', texto: f(M.flat().reduce((a, b) => a + b, 0)), error: 'TAL-DET-SUMA', siFuera: 'Eso suma las casillas; el determinante combina productos.' },
            ]).slice(0, 4),
            solucion: { texto: 'Sarrus: diagonales que bajan menos diagonales que suben.', ecuacion: [`${f(diag)} − (${f(anti)}) = ${f(D)}`] },
          };
        }
        if (tipo === 1) {
          const n = r.ent(2, 3), k = r.uno([2, 3, -1]), d0 = r.uno([-3, -2, 2, 4, 5]);
          const bien = k ** n * d0;
          return {
            pregunta: [A, ` es ${n}×${n} y det `, A, ` = ${f(d0)}. ¿Cuánto vale det(${f(k)}`, A, ')?'],
            opciones: distintas([
              { id: 'c', texto: f(bien), correcta: true },
              { id: 'k', texto: f(k * d0), error: 'MT33', siFuera: `Cada una de las ${n} filas se multiplica por ${f(k)}: el factor sale ${n} veces.` },
              { id: 'suma', texto: f(k + d0), error: 'TAL-DET-ESCALA', siFuera: 'Multiplicar la matriz no suma al determinante; lo multiplica.' },
              { id: 'n', texto: f(k * n * d0), error: 'TAL-DET-ESCALA', siFuera: `El factor ${f(k)} se eleva a ${n}, no se multiplica por ${n}.` },
            ]),
            solucion: { texto: `Cada fila sale con un factor ${f(k)}: son ${n} filas.`, ecuacion: [`det(${f(k)}A) = `, { sup: [`(${f(k)})`, String(n)] }, ` · ${pa(d0)} = ${f(bien)}`] },
          };
        }
        let M; do { M = [[r.ent(-3, 5), r.ent(-3, 5)], [r.ent(-3, 5), r.ent(-3, 5)]]; } while (det2(M) === M[0][0] * M[1][1] + M[0][1] * M[1][0]);
        const D = det2(M);
        return {
          pregunta: [A, ` = ${mt(M)}, escrita por filas. ¿Cuánto vale det `, A, '?'],
          opciones: distintas([
            { id: 'c', texto: f(D), correcta: true },
            { id: 'suma', texto: f(M[0][0] * M[1][1] + M[0][1] * M[1][0]), error: 'MT5', siFuera: 'Los dos productos se restan, no se suman.' },
            { id: 'reves', texto: f(-D), error: 'MT18', siFuera: 'Esa resta va al revés: es ad − bc.' },
            { id: 'filas', texto: f(M[0][0] * M[0][1] - M[1][0] * M[1][1]), error: 'MT19', siFuera: 'Eso multiplica dentro de cada fila; se multiplica en diagonal.' },
            { id: 'diag', texto: f(M[0][0] * M[1][1]), error: 'TAL-DET-DIAG', siFuera: 'Ese es solo ad; falta restar bc.' },
          ]).slice(0, 4),
          solucion: { texto: 'Diagonal principal menos la otra diagonal.', ecuacion: [`${pa(M[0][0])}·${pa(M[1][1])} − ${pa(M[0][1])}·${pa(M[1][0])} = ${f(D)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: la inversa deshace ----------
  // Cambia: las casillas de A · Permanece: la receta (intercambiar, cambiar signos, dividir) · Progresa: adj(A) y
  // A⁻¹ · Se reserva: det = 0, sin inversa · Debe verse: dividir entre det exige det ≠ 0.
  const adj2 = ([[a, b], [c, d]]) => [[d, -b], [-c, a]];
  const tablaInversa = M => {
    const D = det2(M), J = adj2(M);
    const inv = D ? J.map(fila => fila.map(x => fr(x, D))) : [['—', '—'], ['—', '—']];
    return {
      columnas: ['A', '', '', 'adj A', '', '', 'A⁻¹', ''],
      filas: [0, 1].map(i => [
        ...M[i].map((x, j) => ({ t: f(x), color: i === j ? 'o' : 'i' })), '',
        ...J[i].map((x, j) => ({ t: f(x), color: i === j ? 'o' : 'h' })), '',
        ...inv[i].map(x => ({ t: x, color: D ? 'd' : 'h', fuerte: true })),
      ]),
      pie: D ? `det A = ${f(D)}: se divide adj A entre ${f(D)}` : 'det A = 0: no hay inversa',
      alt: D ? `A = ${mt(M)}, su adjunta ${mt(J)} e inversa ${mt(inv)}` : `A = ${mt(M)} tiene determinante 0 y no tiene inversa`,
    };
  };
  const inversa = {
    id: 'inversa-adjunta',
    titulo: 'La inversa deshace a A',
    temas: ['Matriz inversa y adjunta'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Cambia las casillas de A. La tabla muestra su adjunta y su inversa. Busca un caso sin inversa.',
      voz: 'Mira qué pasa con la diagonal y con los signos.',
      controles: [
        { id: 'a', etiqueta: 'a', min: -3, max: 4, paso: 1, inicio: 4, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: -3, max: 4, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
        { id: 'c', etiqueta: 'c', min: -3, max: 4, paso: 1, inicio: 3, decimales: 0, color: 'c-i' },
        { id: 'd', etiqueta: 'd', min: -3, max: 4, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
      ],
      dibujo: val => ({ datos: tablaInversa([[val.a, val.b], [val.c, val.d]]), estado: {} }),
      lectura: val => { const D = val.a * val.d - val.b * val.c; return [`det = ${f(D)}: `, D ? 'tiene inversa' : 'no tiene inversa']; },
      minimo: 4,
    },
    predice: (() => {
      const M = [[4, 2], [3, 2]], D = det2(M), J = adj2(M);
      const inv = J.map(r => r.map(x => fr(x, D)));
      return {
        pregunta: [A, ` = ${mt(M)}, escrita por filas. ¿Cuál es su inversa?`],
        opciones: [
          { id: 'c', texto: mt(inv), correcta: true },
          { id: 'sin-dividir', texto: mt(J), error: 'MT7', siFuera: `Esa es la adjunta; falta dividir entre det A = ${f(D)}.` },
          { id: 'sin-signos', texto: mt([[M[1][1], M[0][1]], [M[1][0], M[0][0]]].map(r => r.map(x => fr(x, D)))), error: 'MT13', siFuera: 'Intercambiar la diagonal está bien; falta cambiar el signo de b y de c.' },
          { id: 'sin-cambiar', texto: mt([[M[0][0], -M[0][1]], [-M[1][0], M[1][1]]].map(r => r.map(x => fr(x, D)))), error: 'MT22', siFuera: 'Los signos están bien; falta intercambiar a con d.' },
        ],
        dibujo: { datos: matriz(M, { alt: `A = ${mt(M)}` }), estado: {} },
        revelar: { datos: tablaInversa(M), estado: {} },
        coincide: `Coincide: adj A = ${mt(J)} dividida entre det A = ${f(D)}.`,
      };
    })(),
    mira: (() => {
      const M = [[4, 2], [3, 2]], D = det2(M), J = adj2(M), inv = J.map(r => r.map(x => x / D));
      const P = prod(M, inv);
      const datos = tablaInversa(M);
      datos.filas = datos.filas.map(fila => fila.map((x, j) => (j >= 3 && j <= 4 ? Object.assign({}, x, { desde: 2 }) : j >= 6 ? Object.assign({}, x, { desde: 3 }) : x)));
      datos.pie = '';
      return {
        datos,
        pasos: [
          { estado: { corte: 1 }, texto: 'Primero, el determinante. Si fuera 0, no habría inversa.', ecuacion: [`det A = 4·2 − 2·3 = ${f(D)}`] },
          { estado: { corte: 2 }, texto: 'Adjunta: se intercambian a y d, y b y c cambian de signo.', ecuacion: [`adj A = ${mt(J)}`] },
          { estado: { corte: 3 }, texto: 'La inversa es la adjunta dividida entre el determinante.', ecuacion: ['A⁻¹ = ', { frac: ['adj A', `${f(D)}`] }] },
          { estado: { corte: 3 }, texto: 'Comprobación: A por su inversa da la identidad.', ecuacion: [`A·A⁻¹ = ${mt(P)} = I`] },
        ],
      };
    })(),
    regla: {
      texto: 'Una matriz cuadrada tiene inversa si su determinante no es 0. En 2×2, a y d se intercambian, b y c cambian de signo, y se divide entre det.',
      ecuacion: ['A⁻¹ = ', { frac: ['adj A', 'det A'] }],
      condicion: 'det A ≠ 0; la adjunta es la transpuesta de los cofactores, no la transpuesta sola.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let M; do { M = [[r.ent(-3, 5), r.ent(-3, 5)], [r.ent(-3, 5), r.ent(-3, 5)]]; } while (![1, -1, 2, -2, 3, 0].includes(det2(M)) || (det2(M) === 0) !== (s % 5 === 4) || M.flat().filter(x => x === 0).length > 1);
        const D = det2(M);
        if (!D) {
          return {
            pregunta: [A, ` = ${mt(M)}, escrita por filas. ¿Qué pasa con su inversa?`],
            opciones: [
              { id: 'c', texto: 'No tiene: su determinante es 0', correcta: true },
              { id: 'adj', texto: `Es ${mt(adj2(M))}`, error: 'MT7', siFuera: 'Esa es la adjunta; para la inversa habría que dividir entre det A = 0.' },
              { id: 'ceros', texto: 'Tiene inversa: ninguna fila es solo ceros', error: 'MT21', siFuera: 'Sin filas nulas puede faltar inversa: aquí las filas son proporcionales.' },
            ],
            solucion: { texto: 'Las filas son proporcionales; no se puede dividir entre 0.', ecuacion: [`det A = ${pa(M[0][0])}·${pa(M[1][1])} − ${pa(M[0][1])}·${pa(M[1][0])} = 0`] },
          };
        }
        const J = adj2(M), i = r.ent(0, 1), j = r.ent(0, 1);
        return {
          pregunta: [A, ` = ${mt(M)}, escrita por filas. ¿Cuánto vale la casilla de la fila ${i + 1}, columna ${j + 1} de A⁻¹?`],
          opciones: distintas([
            { id: 'c', texto: fr(J[i][j], D), correcta: true },
            { id: 'sin-dividir', texto: f(J[i][j]), error: 'MT7', siFuera: `Esa casilla es de la adjunta; falta dividir entre ${f(D)}.` },
            { id: 'signo', texto: fr(-J[i][j], D), error: 'MT13', siFuera: 'El signo de esa casilla está cambiado; revisa cuáles cambian.' },
            { id: 'sin-cambiar', texto: fr(M[i][j], D), error: 'MT22', siFuera: 'Esa es la casilla de A dividida; primero se arma la adjunta.' },
            { id: 'reciproco', texto: M[i][j] ? fr(1, M[i][j]) : 'no existe', error: 'TAL-INV-RECIPROCO', siFuera: 'La inversa no invierte casilla por casilla.' },
          ]).slice(0, 4),
          solucion: { texto: `det A = ${f(D)}; adj A = ${mt(J)}.`, ecuacion: ['A⁻¹ = ', { frac: [mt(J), f(D)] }] },
        };
      },
    },
  };

  // ---------- Idea 5: rango, las filas que aportan ----------
  // Cambia: la tercera fila · Permanece: las dos primeras filas · Progresa: la eliminación que deja ceros · Se reserva:
  // la fila que se vuelve nula · Debe verse: rango = filas no nulas al escalonar, no el tamaño.
  const R1 = [1, 2, 3], R2 = [2, 1, 0];
  const comb = (x, y) => R1.map((v, k) => x * v + y * R2[k]);
  const filaTxt = v => v.map(x => f(x)).join(', ');
  const escalonar = M => {
    // Pasos de Gauss con las filas que quedan, para mostrar en la tabla.
    const X = M.map(r => r.slice());
    const k1 = X[1][0] / X[0][0], k2 = X[2][0] / X[0][0];
    X[1] = X[1].map((v, j) => v - k1 * X[0][j]); X[2] = X[2].map((v, j) => v - k2 * X[0][j]);
    const k3 = Math.abs(X[1][1]) > 1e-9 ? X[2][1] / X[1][1] : 0;
    const Y = X.map(r => r.slice()); Y[2] = Y[2].map((v, j) => v - k3 * Y[1][j]);
    return { X, Y };
  };
  // Escalonada por Gauss con búsqueda de pivote (sirve aunque la primera casilla sea 0).
  function gauss(M) {
    const X = M.map(r => r.slice()); let rg = 0;
    for (let c = 0; c < X[0].length && rg < X.length; c++) {
      const p = X.findIndex((r, i) => i >= rg && Math.abs(r[c]) > 1e-9);
      if (p < 0) continue;
      [X[rg], X[p]] = [X[p], X[rg]];
      for (let i = rg + 1; i < X.length; i++) { const k = X[i][c] / X[rg][c]; X[i] = X[i].map((x, j) => x - k * X[rg][j]); }
      rg++;
    }
    return X;
  }
  const tablaRango = (M, conPasos) => {
    const fin = gauss(M).map(r => r.map(v => Math.round(v * 1e6) / 1e6));
    return {
      columnas: ['', 'A', '', '', 'escalonada', '', ''],
      filas: M.map((fila, i) => [
        { t: `F${i + 1}`, fuerte: true },
        ...fila.map(x => ({ t: f(x), color: i === 2 ? 'i' : 'o' })),
        ...(conPasos ? fin[i].map(v => ({ t: f(v), color: fin[i].every(z => Math.abs(z) < 1e-9) ? 'h' : 'd', desde: 1 })) : ['', '', '']),
      ]),
      alt: `Matriz de filas ${M.map(filaTxt).join(' / ')}; rango ${rango(M)}`,
    };
  };
  const rangoIdea = {
    id: 'rango',
    titulo: 'Rango: filas que aportan',
    temas: ['Rango de una matriz'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'F1 y F2 están fijas. Arma F3 como x·F1 + y·F2 más un ajuste. Mira la matriz escalonada y cuenta sus filas no nulas.',
      voz: 'Prueba un ajuste de 0 y uno distinto de 0.',
      controles: [
        { id: 'x', etiqueta: 'x', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
        { id: 'y', etiqueta: 'y', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
        { id: 'e', etiqueta: 'Ajuste en la 3.ª casilla', min: 0, max: 2, paso: 1, inicio: 0, decimales: 0, color: 'c-i' },
      ],
      dibujo: val => { const F3 = comb(val.x, val.y); F3[2] += val.e; return { datos: tablaRango([R1, R2, F3], true), estado: { corte: 1 } }; },
      lectura: val => { const F3 = comb(val.x, val.y); F3[2] += val.e; return [`Rango ${rango([R1, R2, F3])} de 3`]; },
      minimo: 3,
    },
    predice: (() => {
      const M = [[1, 2, 3], [2, 4, 6], [1, 0, 1]];
      return {
        pregunta: [A, ` = ${mt(M)}, escrita por filas. ¿Cuál es su rango?`],
        opciones: [
          { id: 'c', texto: f(rango(M)), correcta: true },
          { id: 'orden', texto: '3', error: 'TAL-RANGO-ORDEN', siFuera: 'Sería 3 si las tres filas fueran independientes; la segunda es el doble de la primera.' },
          { id: 'uno', texto: '1', error: 'TAL-RANGO-UNO', siFuera: 'La tercera fila no es múltiplo de la primera: aporta una dirección nueva.' },
          { id: 'cero', texto: '0', error: 'TAL-RANGO-CERO', siFuera: 'Rango 0 solo tiene la matriz nula.' },
        ],
        dibujo: { datos: tablaRango(M, false), estado: {} },
        revelar: { datos: tablaRango(M, true), estado: { corte: 1 } },
        coincide: `Coincide: al escalonar, una fila se vuelve ceros; quedan ${rango(M)} filas no nulas.`,
      };
    })(),
    mira: (() => {
      const M = [R1, R2, comb(1, 1)];
      const { X, Y } = escalonar(M);
      const r6 = v => Math.round(v * 1e6) / 1e6;
      return {
        datos: {
          columnas: ['', 'A', '', '', 'paso 1', '', ''],
          filas: [...M.map((fila, i) => [
            { t: `F${i + 1}`, fuerte: true },
            ...fila.map(x => ({ t: f(x), color: 'o' })),
            ...X[i].map(v => ({ t: f(r6(v)), desde: 1 })),
          ]), [{ t: 'F3 − F2', fuerte: true, color: 'h', desde: 2 }, '', '', '', ...Y[2].map(v => ({ t: f(r6(v)), color: 'h', fuerte: true, desde: 2 }))]],
          resaltes: [{ f: 1, c: 4, ancho: 3, color: 'i', desde: 2 }, { f: 2, c: 4, ancho: 3, color: 'i', desde: 2 }, { f: 3, c: 4, ancho: 3, color: 'h', desde: 2 }],
          pie: '',
          alt: `F3 = F1 + F2; al escalonar, F3 queda ${filaTxt(Y[2].map(r6))}`,
        },
        pasos: [
          { estado: { corte: 0 }, texto: 'F3 = (3, 3, 3) es la suma de F1 y F2.', ecuacion: ['F3 = F1 + F2'] },
          { estado: { corte: 1 }, texto: 'Se anula la primera casilla de F2 y F3 restando múltiplos de F1.', ecuacion: ['F2 − 2F1 · F3 − 3F1'] },
          { estado: { corte: 2 }, texto: 'Ahora F3 es igual a F2: restarlas deja una fila de ceros.', ecuacion: [`F3 − F2 = (${filaTxt(Y[2].map(r6))})`] },
          { estado: { corte: 2 }, texto: `Quedan ${rango(M)} filas no nulas: el rango es ${rango(M)}, aunque A sea 3×3.`, ecuacion: [`rango A = ${rango(M)}`, '   ·   det ', A, ` = ${f(det3(M))}`] },
        ],
      };
    })(),
    regla: {
      texto: 'El rango es cuántas filas no se vuelven ceros al escalonar: las filas independientes. Una matriz n×n tiene rango n justo cuando su determinante no es 0.',
      ecuacion: ['rango ', A, ' = n  ⇔  det ', A, ' ≠ 0'],
      condicion: 'las operaciones de fila no cambian el rango; el rango nunca supera el número de filas ni el de columnas.',
    },
    ahoraTu: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s), quiere = [1, 2, 3, 2][s % 4];
        let M;
        for (let k = 0; k < 200; k++) {
          const u = [r.ent(-2, 3), r.ent(-2, 3), r.ent(-2, 3)], v = [r.ent(-2, 3), r.ent(-2, 3), r.ent(-2, 3)], w = [r.ent(-2, 3), r.ent(-2, 3), r.ent(-2, 3)];
          const a = r.ent(-2, 2) || 1, b = r.ent(-2, 2), c = r.ent(-2, 2) || 2;
          M = quiere === 1 ? [u, u.map(x => a * x), u.map(x => c * x)] : quiere === 2 ? [u, v, u.map((x, j) => a * x + b * v[j])] : [u, v, w];
          if (rango(M) === quiere && M.flat().some(x => x)) break;
        }
        const n0 = M.filter(fila => fila.some(x => x)).length;
        return {
          pregunta: [A, ` = ${mt(M)}, escrita por filas. ¿Cuál es su rango?`],
          dibujo: { datos: tablaRango(M, false), estado: {} },
          opciones: [1, 2, 3].map(k => (k === quiere ? { id: 'c', texto: f(k), correcta: true }
            : { id: `r${k}`, texto: f(k), error: k === 3 ? 'TAL-RANGO-ORDEN' : k > quiere ? 'TAL-RANGO-NULAS' : 'TAL-RANGO-UNO', siFuera: k === 3 ? 'Sería 3 si ninguna fila saliera de las otras.' : k > quiere ? `Al escalonar, ${quiere === 1 ? 'queda una sola fila no nula' : `quedan solo ${quiere} filas no nulas`}.` : `Hay ${quiere} filas que no salen unas de otras.` })),
          solucion: { texto: `Al escalonar, ${quiere === 1 ? 'queda una fila no nula' : `quedan ${quiere} filas no nulas`}${n0 === 3 && quiere < 3 ? ', aunque ninguna sea de ceros al inicio' : ''}.`, ecuacion: [`rango A = ${quiere}`, quiere < 3 ? '   ·   det A = 0' : `   ·   det A = ${f(det3(M))}`], dibujo: { datos: tablaRango(M, true), estado: { corte: 1 } } },
        };
      },
    },
  };

  return {
    unidad: 'algebra.matrices-y-determinantes',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'Los determinantes aparecieron antes que las matrices: Seki en Japón y Leibniz en Europa los usaron para resolver sistemas. Recién en el siglo XIX Sylvester llamó «matriz» a la tabla y Cayley estudió cómo operar con ella. Una tabla de números no dice sola qué operación representa: por eso cada regla de esta unidad tiene su porqué.',
      pregunta: '¿Qué podría medir un solo número de una tabla?',
      fuente: { titulo: 'O’Connor y Robertson, Matrices and determinants — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Matrices_and_determinants/' },
    },
    ideas: [producto, transpuesta, determinante, inversa, rangoIdea],
  };
});
