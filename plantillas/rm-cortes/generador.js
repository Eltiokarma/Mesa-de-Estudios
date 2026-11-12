/*
 * Generador: cortes con apilado, tramos en progresión, estacas en una cuadrícula y recortes de esquinas.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['rm-cortes']) y en Node (require).
 *
 * Convención de los cortes: un corte es recto y atraviesa todo lo que está apilado; entre corte y corte las piezas se
 * pueden mover, girar y apilar (sin doblarlas). Cada pieza del montón queda partida en dos por una línea de su
 * cuadrícula. Si la sierra «corta a lo más c capas», en cada corte entran a lo más c piezas.
 *
 * Tipos y sus _datos:
 *   plancha     { tipo, m, n, c }          plancha (o tira, m = 1) de m × n cuadraditos que hay que separar todos.
 *                                          c: capas que admite la sierra (null: sin límite).
 *   arreglo     { tipo, filas, cols, celdas }   cartulina cuadriculada con letras; celdas[f][k] es el número de pieza
 *                                          de cada casilla (las casillas con el mismo número deben quedar juntas).
 *   progresion  { tipo, pide: 'cortes' | 'mayor', L, a, b, c }   listón de L cm partido en tramos cuyas longitudes
 *                                          forman una progresión aritmética; a el menor, b el mayor, c los cortes.
 *   estacas     { tipo, A, B, e, pide: 'vertices' | 'cada' }   terreno A × B m en parcelas cuadradas iguales, las más
 *                                          grandes posibles; estacas en los vértices de las parcelas o cada e m.
 *   esquinas    { tipo, corte: 'cuadrado' | 'triangulo' | 'octogono', L, W, a }   se recortan las cuatro esquinas.
 *
 * calc (funciones puras):
 *   plancha({ m, n, c })      { respuesta, plan: [[{ de: [a, b], en: [[a1, b1], [a2, b2]] }, …] por corte], cota }
 *                             búsqueda (profundización iterativa con cota) del menor número de cortes.
 *   arreglo({ celdas })       { respuesta, rondas: [[{ pieza, partes: [letrasA, letrasB] }, …] por corte], bloques }
 *                             con apilado sin límite: la menor altura de un árbol de cortes que no parte ninguna pieza.
 *   progresion({ pide, L, a, b, c })   { respuesta, n (tramos), d (diferencia), tramos }
 *   estacas({ A, B, e, pide })         { respuesta, g (lado de la parcela), p, q (parcelas por lado) }
 *   esquinas({ corte, L, W, a })       { respuesta (número o { p, q } = p + q√2), lado (octógono: [p, q]) }
 *   log2arriba(x)
 *
 * Errores (todos hipótesis; códigos de docs/clasificacion/trampas-admision-unmsm/rm-a.md, filas 3 y 6):
 *   RMP1-…    puntos contra intervalos: cortes por tramos, estacas compartidas contadas dos veces
 *   RMP35-…   cortar sin apilar ni reacomodar (pieza por pieza, o por las líneas del dibujo)
 *   RMP36-…   contar mal lo que permite el apilado (logaritmo mal redondeado, ignorar el límite de capas)
 *   RMP37-…   tomar mal una medida de lo que queda (lados nuevos del recorte, promedio de los tramos)
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'rm-cortes';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const v = P.v, x = P.xml;
  const f = (n, d = 2) => P.formatear(n, d);
  const lista = l => l.length <= 1 ? l.join('') : l.slice(0, -1).join(', ') + ' y ' + l[l.length - 1];
  const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // ======================= cálculo (regla 1) =======================
  const log2arriba = n => { let k = 0; while ((1 << k) < n) k++; return k; };
  const pieza = ([a, b]) => `${a}×${b}`;
  const orden = ([a, b]) => (a <= b ? [a, b] : [b, a]);
  const canon = ps => ps.map(orden).filter(p => p[0] * p[1] > 1).sort((p, q) => q[0] * q[1] - p[0] * p[1] || q[1] - p[1]);
  const claveDe = s => s.map(pieza).join(',');
  function partes(a, b) {
    const r = [];
    for (let i = 1; i <= b >> 1; i++) r.push([[a, i], [a, b - i]]);
    for (let i = 1; i <= a >> 1; i++) r.push([[i, b], [a - i, b]]);
    return r;
  }
  // Cota inferior: cada pieza necesita ⌈log₂ a⌉ + ⌈log₂ b⌉ cortes propios, y cada corte agrega a lo más c piezas.
  function cotaDe(s, c) {
    let alto = 0, faltan = 0;
    for (const [a, b] of s) { alto = Math.max(alto, log2arriba(a) + log2arriba(b)); faltan += a * b - 1; }
    return Math.max(alto, c ? Math.ceil(faltan / c) : 0);
  }
  // Todas las formas de elegir hasta c piezas del montón (sin repetir por tipos iguales) y cómo partir cada una.
  function* movidas(s, c) {
    const tipos = [];
    for (const p of s) { const t = tipos.find(y => y.p[0] === p[0] && y.p[1] === p[1]); if (t) t.k++; else tipos.push({ p, k: 1 }); }
    function* comb(n, j, desde, acc) { if (!j) { yield acc; return; } for (let i = desde; i < n; i++) yield* comb(n, j - 1, i, acc.concat([i])); }
    function* rec(i, cap, elegidos, resto) {
      if (i === tipos.length) { if (elegidos.length) yield { elegidos, resto }; return; }
      const { p, k } = tipos[i], sp = partes(p[0], p[1]);
      for (let j = Math.min(k, cap); j >= 0; j--) {
        for (const cs of comb(sp.length, j, 0, [])) {
          yield* rec(i + 1, cap - j, elegidos.concat(cs.map(t => ({ de: p, en: sp[t] }))), resto.concat(new Array(k - j).fill(p)));
        }
      }
    }
    yield* rec(0, c || Infinity, [], []);
  }
  function plancha({ m, n, c }) {
    const inicio = canon([[m, n]]), fallo = new Map();
    let plan = null;
    function dfs(s, g, lim, camino) {
      if (!s.length) { plan = camino.slice(); return true; }
      if (g + cotaDe(s, c) > lim) return false;
      const k = claveDe(s), previo = fallo.get(k);
      if (previo !== undefined && previo >= lim - g) return false;
      for (const mv of movidas(s, c)) {
        camino.push(mv.elegidos);
        if (dfs(canon(mv.resto.concat(mv.elegidos.flatMap(e => e.en))), g + 1, lim, camino)) return true;
        camino.pop();
      }
      fallo.set(k, lim - g);
      return false;
    }
    let lim = cotaDe(inicio, c);
    while (!dfs(inicio, 0, lim, [])) lim++;
    // La cota que se explica en la solución: piezas que puede haber tras cada corte y la altura por lados.
    let piezas = 1, porConteo = 0;
    while (piezas < m * n) { piezas += c ? Math.min(piezas, c) : piezas; porConteo++; }
    return { respuesta: lim, plan, cota: Math.max(porConteo, log2arriba(m) + log2arriba(n)), porConteo, porLados: log2arriba(m) + log2arriba(n) };
  }

  // Arreglo de piezas: altura mínima del árbol de cortes (con apilado sin límite, cada ronda corta todas las piezas).
  function arreglo({ celdas }) {
    const F = celdas.length, C = celdas[0].length, memo = new Map();
    const bloques = new Set(celdas.flat()).size;
    // rectángulo [f0, f1) × [k0, k1): ¿es una sola pieza? ¿qué líneas no parten ninguna pieza?
    function lineas(f0, f1, k0, k1) {
      const r = [];
      for (let k = k0 + 1; k < k1; k++) { let ok = true; for (let i = f0; i < f1 && ok; i++) if (celdas[i][k - 1] === celdas[i][k]) ok = false; if (ok) r.push(['v', k]); }
      for (let i = f0 + 1; i < f1; i++) { let ok = true; for (let k = k0; k < k1 && ok; k++) if (celdas[i - 1][k] === celdas[i][k]) ok = false; if (ok) r.push(['h', i]); }
      return r;
    }
    function una(f0, f1, k0, k1) { const b = celdas[f0][k0]; for (let i = f0; i < f1; i++) for (let k = k0; k < k1; k++) if (celdas[i][k] !== b) return false; return true; }
    function alto(f0, f1, k0, k1) {
      const key = [f0, f1, k0, k1].join(',');
      if (memo.has(key)) return memo.get(key).h;
      let mejor = { h: una(f0, f1, k0, k1) ? 0 : Infinity, l: null };
      if (mejor.h) for (const l of lineas(f0, f1, k0, k1)) {
        const [A, B] = l[0] === 'v' ? [[f0, f1, k0, l[1]], [f0, f1, l[1], k1]] : [[f0, l[1], k0, k1], [l[1], f1, k0, k1]];
        const t = 1 + Math.max(alto(...A), alto(...B));
        if (t < mejor.h) mejor = { h: t, l, A, B };
      }
      memo.set(key, mejor);
      return mejor.h;
    }
    const respuesta = alto(0, F, 0, C);
    const letras = (f0, f1, k0, k1) => { let s = ''; for (let i = f0; i < f1; i++) for (let k = k0; k < k1; k++) s += LETRAS[i * C + k]; return s; };
    const rondas = [];
    let piezasR = [[0, F, 0, C]];
    for (let r = 0; r < respuesta; r++) {
      const ronda = [], sig = [];
      for (const R of piezasR) {
        const m = memo.get(R.join(','));
        if (!m || !m.h) continue;
        ronda.push({ pieza: letras(...R), partes: [letras(...m.A), letras(...m.B)] });
        sig.push(m.A, m.B);
      }
      rondas.push(ronda); piezasR = sig;
    }
    return { respuesta: Number.isFinite(respuesta) ? respuesta : null, rondas, bloques };
  }

  function progresion({ pide, L, a, b, c }) {
    if (pide === 'cortes') { const n = 2 * L / (a + b); const d = (b - a) / (n - 1); return { respuesta: n - 1, n, d, tramos: Array.from({ length: n }, (_, i) => a + i * d) }; }
    const n = c + 1, bb = 2 * L / n - a, d = (bb - a) / (n - 1);
    return { respuesta: bb, n, d, tramos: Array.from({ length: n }, (_, i) => a + i * d) };
  }
  const mcd = (p, q) => { while (q) [p, q] = [q, p % q]; return p; };
  function estacas({ A, B, e, pide }) {
    const g = mcd(A, B), p = A / g, q = B / g;
    if (pide === 'vertices') return { respuesta: (p + 1) * (q + 1), g, p, q };
    // (q + 1) cercas a lo largo de A y (p + 1) a lo largo de B; los cruces se cuentan una vez.
    const respuesta = (q + 1) * (A / e + 1) + (p + 1) * (B / e + 1) - (p + 1) * (q + 1);
    return { respuesta, g, p, q };
  }
  function esquinas({ corte, L, W, a }) {
    if (corte === 'cuadrado') return { respuesta: 2 * (L + W) };
    if (corte === 'triangulo') return { respuesta: { p: 2 * (L + W) - 8 * a, q: 4 * a } };
    // Octógono regular desde un cuadrado de lado L: lado s con s + s√2 = L → s = L(√2 − 1); perímetro 8s.
    return { respuesta: { p: -8 * L, q: 8 * L }, lado: [-L, L] };
  }

  const calc = { plancha, arreglo, progresion, estacas, esquinas, log2arriba };

  // ======================= figuras =======================
  function figuraPlancha(m, n) {
    const t = Math.min(32, Math.floor(360 / n), Math.floor(200 / m)), W = n * t + 40, H = m * t + 40;
    let s = `<svg viewBox="0 0 ${Math.max(W, 300)} ${H}" xmlns="http://www.w3.org/2000/svg">`;
    const x0 = (Math.max(W, 300) - n * t) / 2;
    s += `<rect x="${x0}" y="20" width="${n * t}" height="${m * t}" style="fill:var(--card);stroke:currentColor" stroke-width="2.5"/>`;
    for (let k = 1; k < n; k++) s += `<line x1="${x0 + k * t}" y1="20" x2="${x0 + k * t}" y2="${20 + m * t}" style="stroke:var(--muted)" stroke-width="1"/>`;
    for (let i = 1; i < m; i++) s += `<line x1="${x0}" y1="${20 + i * t}" x2="${x0 + n * t}" y2="${20 + i * t}" style="stroke:var(--muted)" stroke-width="1"/>`;
    s += `<text x="${x0 + n * t / 2}" y="14" text-anchor="middle" font-size="14" style="fill:var(--c-i)">${x(n)}</text>`;
    if (m > 1) s += `<text x="${x0 - 6}" y="${20 + m * t / 2 + 5}" text-anchor="end" font-size="14" style="fill:var(--c-o)">${x(m)}</text>`;
    return s + '</svg>';
  }
  function figuraArreglo(celdas) {
    const F = celdas.length, C = celdas[0].length, t = Math.min(52, Math.floor(340 / C)), x0 = (380 - C * t) / 2, y0 = 12;
    let s = `<svg viewBox="0 0 380 ${F * t + 24}" xmlns="http://www.w3.org/2000/svg">`;
    for (let i = 0; i < F; i++) for (let k = 0; k < C; k++) {
      s += `<rect x="${x0 + k * t}" y="${y0 + i * t}" width="${t}" height="${t}" style="fill:var(--card);stroke:var(--line)" stroke-width="1" stroke-dasharray="3 3"/>`;
      s += `<text x="${x0 + k * t + t / 2}" y="${y0 + i * t + t / 2 + 6}" text-anchor="middle" font-size="17">${x(LETRAS[i * C + k])}</text>`;
    }
    // bordes gruesos entre piezas distintas y en el contorno
    const borde = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:currentColor" stroke-width="3" stroke-linecap="round"/>`;
    for (let i = 0; i < F; i++) for (let k = 0; k <= C; k++) if (k === 0 || k === C || celdas[i][k - 1] !== celdas[i][k]) s += borde(x0 + k * t, y0 + i * t, x0 + k * t, y0 + (i + 1) * t);
    for (let i = 0; i <= F; i++) for (let k = 0; k < C; k++) if (i === 0 || i === F || celdas[i - 1][k] !== celdas[i][k]) s += borde(x0 + k * t, y0 + i * t, x0 + (k + 1) * t, y0 + i * t);
    return s + '</svg>';
  }
  function figuraTerreno(A, B) {
    const esc = Math.min(300 / A, 170 / B), w = A * esc, hh = B * esc, x0 = (380 - w) / 2;
    return `<svg viewBox="0 0 380 ${hh + 50}" xmlns="http://www.w3.org/2000/svg">` +
      `<rect x="${x0}" y="16" width="${w}" height="${hh}" style="fill:var(--card);stroke:currentColor" stroke-width="2.5"/>` +
      `<text x="${x0 + w / 2}" y="${hh + 40}" text-anchor="middle" font-size="15" style="fill:var(--c-o)">${x(A + ' m')}</text>` +
      `<text x="${x0 - 8}" y="${16 + hh / 2 + 5}" text-anchor="end" font-size="15" style="fill:var(--c-i)">${x(B + ' m')}</text></svg>`;
  }
  function figuraEsquinas(corte, L, W, a) {
    const esc = Math.min(260 / L, 180 / W), w = L * esc, hh = W * esc, x0 = (380 - w) / 2, y0 = 22, c = (corte === 'octogono' ? L * (2 - Math.SQRT2) / 2 : a) * esc;
    let pts;
    if (corte === 'cuadrado') pts = [[x0 + c, y0], [x0 + w - c, y0], [x0 + w - c, y0 + c], [x0 + w, y0 + c], [x0 + w, y0 + hh - c], [x0 + w - c, y0 + hh - c], [x0 + w - c, y0 + hh], [x0 + c, y0 + hh], [x0 + c, y0 + hh - c], [x0, y0 + hh - c], [x0, y0 + c], [x0 + c, y0 + c]];
    else pts = [[x0 + c, y0], [x0 + w - c, y0], [x0 + w, y0 + c], [x0 + w, y0 + hh - c], [x0 + w - c, y0 + hh], [x0 + c, y0 + hh], [x0, y0 + hh - c], [x0, y0 + c]];
    let s = `<svg viewBox="0 0 380 ${hh + 60}" xmlns="http://www.w3.org/2000/svg">`;
    s += `<rect x="${x0}" y="${y0}" width="${w}" height="${hh}" style="fill:none;stroke:var(--muted)" stroke-width="1.5" stroke-dasharray="4 4"/>`;
    s += `<polygon points="${pts.map(p => p.map(z => z.toFixed(1)).join(',')).join(' ')}" style="fill:var(--card);stroke:currentColor" stroke-width="2.5"/>`;
    s += `<text x="${x0 + w / 2}" y="${y0 + hh + 24}" text-anchor="middle" font-size="15" style="fill:var(--c-o)">${x(L + ' cm')}</text>`;
    if (corte !== 'octogono') {
      s += `<text x="${x0 + w + 8}" y="${y0 + hh / 2 + 5}" font-size="15" style="fill:var(--c-i)">${x(W + ' cm')}</text>`;
      s += `<text x="${x0 + c / 2}" y="${y0 - 6}" text-anchor="middle" font-size="14" style="fill:var(--c-h)">${x(a)}</text>`;
      s += `<text x="${x0 - 6}" y="${y0 + c / 2 + 5}" text-anchor="end" font-size="14" style="fill:var(--c-h)">${x(a)}</text>`;
    }
    return s + '</svg>';
  }

  // ======================= redacción =======================
  const TIPOS = ['plancha', 'plancha', 'arreglo', 'progresion', 'estacas', 'esquinas'];

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 80; intento++) {
      const p = construir(rng, semilla, tipo);
      if (p && p.alternativas.length >= 4) return p;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }
  function construir(rng, semilla, tipo) {
    return { plancha: tPlancha, arreglo: tArreglo, progresion: tProgresion, estacas: tEstacas, esquinas: tEsquinas }[tipo](rng, semilla);
  }
  function cerrar(rng, semilla, o) {
    const u = o.unidad || '';
    const alternativas = o.texto
      ? P.armarTexto({ correcta: o.correcta, errores: o.errores, rng })
      : P.armar({ correcta: o.correcta, errores: o.errores.filter(e => e && Number.isFinite(e.valor)), rng, texto: o.formato || (y => f(y) + (u ? ' ' + (y === 1 ? o.singular || u : u) : '')) });
    // Solo las variables que de verdad aparecen (regla 4: ninguna declarada de adorno).
    const usadas = new Set(), marca = x => { if (Array.isArray(x)) x.forEach(marca); else if (x && typeof x === 'object' && x.v) usadas.add(x.v); };
    marca(o.enunciado); marca(o.pregunta); marca(o.solucion);
    const variables = {}; for (const k of Object.keys(o.variables)) if (usadas.has(k)) variables[k] = o.variables[k];
    const p = { id: `${ID}#${semilla}`, variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.texto ? o.correcta.clave : o.correcta, unidad: u }, _datos: o.datos };
    if (o.figura) p.figura = o.figura;
    return p;
  }

  const REGLA = 'Un corte es recto y atraviesa todo lo que esté apilado. Entre corte y corte se pueden mover, girar y apilar las piezas, pero no doblarlas.';
  const SIN_TOPE = ' La sierra corta cualquier cantidad de piezas apiladas (sin límite de capas).';

  // ---------- plancha ----------
  function tPlancha(rng, semilla) {
    const conLimite = rng.moneda();
    let m, n, c = null;
    if (conLimite) { m = rng.elegir([1, 2, 2, 3, 3, 4]); n = rng.entero(Math.max(m, 3), m === 1 ? 14 : Math.min(8, Math.floor(24 / m))); c = rng.entero(2, 4); }
    else { m = rng.elegir([1, 2, 3, 3, 4, 5, 6]); n = rng.entero(Math.max(m, 3), m === 1 ? 20 : 12); }
    if (m === n && m === 1) return null;
    const datos = { tipo: 'plancha', m, n, c };
    const R = plancha(datos), r = R.respuesta;
    const tira = m === 1;
    const variables = { m: { nombre: 'filas', color: 'o' }, n: { nombre: 'columnas', color: 'i' }, c: { nombre: 'capas de la sierra', color: 'h' } };
    const enunciado = tira
      ? ['Una tira de cartón está dividida en ', v('n', `${n} cuadraditos`), ' iguales, uno tras otro. Se quiere separar todos los cuadraditos. ', REGLA]
      : ['Una plancha de triplay está cuadriculada en ', v('m', `${m} filas`), ' y ', v('n', `${n} columnas`), ' de cuadraditos iguales. Se quiere separar todos los cuadraditos. ', REGLA];
    if (c) enunciado.push(' La sierra puede cortar a la vez ', v('c', `a lo más ${c} piezas apiladas`), '.');
    else enunciado.push(SIN_TOPE);
    const pregunta = ['¿Cuántos cortes se necesitan como mínimo?'];
    const sinLim = log2arriba(m) + log2arriba(n);
    const errores = [
      h('RMP35-pieza-por-pieza', m * n - 1, `Cortaste sin apilar: cada corte suelta una sola pieza más, y así salen ${m * n - 1} cortes. Apilando, un corte parte varias piezas a la vez.`),
      !tira ? h('RMP35-por-lineas', (m - 1) + (n - 1), `Contaste las líneas de la cuadrícula (${m - 1} + ${n - 1}), como si cada línea fuera un corte sin mover nada. Apilando las piezas se ahorran cortes${c ? ', aunque el límite de capas también cuenta' : ''}.`) : null,
      c ? h('RMP36-sin-limite', sinLim, `Esa sería la respuesta si se pudiera apilar todo. Con a lo más ${c} piezas por corte, cuando ya hay muchas piezas no se pueden partir todas en un solo corte.`) : null,
      c ? h('RMP36-solo-capas', Math.ceil((m * n - 1) / c), `Dividiste las ${m * n - 1} piezas nuevas entre ${c} capas, pero al principio no hay ${c} piezas para apilar: el primer corte parte una sola pieza, el segundo dos…`) : null,
      h('RMP36-log-producto', log2arriba(m * n), `Pensaste que cada corte duplica todas las piezas hasta llegar a ${m * n}. Pero los lados se parten por separado: una pieza de ${tira ? n : m + '×' + n} necesita ⌈log₂ ${m}⌉ + ⌈log₂ ${n}⌉ rondas de corte.`),
      h('RMP36-log-abajo', Math.floor(Math.log2(m)) + Math.floor(Math.log2(n)), `Redondeaste el logaritmo hacia abajo. Si ${n} no es potencia de 2, con ${Math.floor(Math.log2(n))} rondas de cortes por la mitad todavía quedan piezas de más de un cuadradito.`),
    ].filter(Boolean);
    let solucion;
    if (!c) {
      solucion = [
        [`Apilando todo, cada corte puede partir por la mitad todas las piezas que hay. A lo largo, `, v('n', `${n}`), ` cuadraditos piden ${log2arriba(n)} corte${log2arriba(n) === 1 ? '' : 's'} (cada corte a lo más duplica: 1, 2, 4, 8, 16…, hasta pasar de ${n}).`],
        tira ? ['La tira tiene un solo cuadradito de ancho: no hace falta cortar a lo ancho.'] : [`A lo ancho, `, v('m', `${m}`), ` filas piden ${log2arriba(m)} corte${log2arriba(m) === 1 ? '' : 's'} más.`],
        [`No se puede menos: un corte parte cada pieza a lo más en dos y en un solo sentido. Total: ${log2arriba(n)}${tira ? '' : ` + ${log2arriba(m)}`} = ${f(r)}.`],
      ];
    } else {
      const piezas = [1]; while (piezas[piezas.length - 1] < m * n) { const p = piezas[piezas.length - 1]; piezas.push(p + Math.min(p, c)); }
      solucion = [
        [`Cada corte parte a lo más `, v('c', `${c}`), ` piezas (o las que haya, si son menos), y cada pieza partida suma una pieza más. Piezas que puede haber: ${piezas.slice(0, -1).join(' → ')} → ${m * n} o más. Por eso no bastan menos de ${R.porConteo} cortes.`],
        [`Además, por los lados hacen falta al menos ${R.porLados} cortes (cada corte parte un lado a lo más por la mitad). La mayor de las dos cotas es ${R.cota}.`],
        ['Un plan que lo logra: ', R.plan.map((corte, i) => `corte ${i + 1}: ${lista(corte.map(e => `${pieza(e.de)} → ${pieza(e.en[0])} + ${pieza(e.en[1])}`))}`).join('; '), '.'],
        [`Mínimo: ${f(r)} cortes.`],
      ];
    }
    const alt = tira ? `Tira de 1 fila y ${n} cuadraditos.` : `Plancha cuadriculada de ${m} filas y ${n} columnas de cuadraditos.`;
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: 'cortes', singular: 'corte',
      figura: { svg: figuraPlancha(m, n), alt } });
  }

  // ---------- arreglo de piezas ----------
  function particion(rng, F, C) {
    const celdas = Array.from({ length: F }, () => new Array(C).fill(0));
    let id = 0;
    (function partir(f0, f1, k0, k1, prof) {
      const area = (f1 - f0) * (k1 - k0);
      const parar = area === 1 || (area <= 3 && rng.sig() < 0.6) || (prof > 1 && rng.sig() < 0.25);
      if (parar) { for (let i = f0; i < f1; i++) for (let k = k0; k < k1; k++) celdas[i][k] = id; id++; return; }
      const op = [];
      for (let k = k0 + 1; k < k1; k++) op.push(['v', k]);
      for (let i = f0 + 1; i < f1; i++) op.push(['h', i]);
      const [t, l] = rng.elegir(op);
      if (t === 'v') { partir(f0, f1, k0, l, prof + 1); partir(f0, f1, l, k1, prof + 1); }
      else { partir(f0, l, k0, k1, prof + 1); partir(l, f1, k0, k1, prof + 1); }
    })(0, F, 0, C, 0);
    // numera las piezas en orden de lectura
    const mapa = new Map(); let n = 0;
    for (const fila of celdas) for (const z of fila) if (!mapa.has(z)) mapa.set(z, n++);
    return celdas.map(fila => fila.map(z => mapa.get(z)));
  }
  function tArreglo(rng, semilla) {
    const F = rng.entero(2, 4), C = rng.entero(3, 6);
    const celdas = particion(rng, F, C);
    const datos = { tipo: 'arreglo', filas: F, cols: C, celdas };
    const R = arreglo(datos), r = R.respuesta, k = R.bloques;
    if (k < 4 || r === null || k === F * C) return null;
    const grupos = [];
    for (let b = 0; b < k; b++) { let s = ''; celdas.forEach((fila, i) => fila.forEach((z, j) => { if (z === b) s += LETRAS[i * C + j]; })); grupos.push(s); }
    // líneas distintas del dibujo donde cambia de pieza
    let lineas = 0;
    for (let kk = 1; kk < C; kk++) if (celdas.some(fila => fila[kk - 1] !== fila[kk])) lineas++;
    for (let i = 1; i < F; i++) if (celdas[i].some((z, j) => celdas[i - 1][j] !== z)) lineas++;
    const variables = { p: { nombre: 'piezas', color: 'o' } };
    const enunciado = [`Una cartulina cuadriculada de ${F} × ${C} tiene una letra en cada casilla. Se quiere cortarla en `, v('p', `${k} piezas`), ': ',
      lista(grupos.map(g => g.length === 1 ? g : g.split('').join('-'))), ' (las casillas unidas con guion quedan juntas; en el dibujo, cada pieza tiene borde grueso). ', REGLA, SIN_TOPE];
    const pregunta = ['¿Cuántos cortes se necesitan como mínimo?'];
    const errores = [
      h('RMP35-pieza-por-pieza', k - 1, `Cortaste sin apilar: cada corte suelta una pieza más, y para ${k} piezas salen ${k - 1}. Apilando, un corte separa varias piezas a la vez.`),
      h('RMP36-log-producto', log2arriba(k), `Pensaste que cada corte duplica las piezas (${k} piezas, ⌈log₂ ${k}⌉ cortes). Pero un corte recto no puede pasar por cualquier lado: no debe partir ninguna pieza, y eso obliga a más cortes.`),
      h('RMP35-por-lineas', lineas, `Contaste las líneas del dibujo donde cambia la pieza (${lineas}), como si cada una fuera un corte sin mover nada. Apilando se cortan varias a la vez.`),
      h('RMP36-una-ronda-de-mas', r + 1, 'Te sobró un corte. Revisa si en la última ronda las piezas que faltan se pueden apilar y separar con un solo corte.'),
    ];
    const solucion = [
      ['Con las piezas apiladas, en cada corte se puede partir una vez cada pieza que todavía tenga más de una de las piezas pedidas. Lo que importa es cuántas rondas de corte necesita la pieza más difícil.'],
      ...R.rondas.map((ronda, i) => [`Corte ${i + 1}: ${ronda.length > 1 ? 'se apilan ' + lista(ronda.map(z => z.pieza)) + ' y se separa' : 'se separa'} ${lista(ronda.map(z => `${z.partes[0]} de ${z.partes[1]}`))}.`]),
      [`Por qué no se puede con menos: en cada corte, cada pieza del montón se parte una sola vez, y solo por una línea que no atraviese ninguna pieza pedida. Probando esas líneas, ninguna forma de partir termina en menos rondas. Mínimo: ${f(r)} cortes.`],
    ];
    const filas = celdas.map((fila, i) => fila.map((_, j) => LETRAS[i * C + j]).join(' '));
    const alt = `Cartulina de ${F} filas y ${C} columnas. ${filas.map((t, i) => `Fila ${i + 1}: ${t}.`).join(' ')} Piezas con borde grueso: ${lista(grupos)}.`;
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: 'cortes', singular: 'corte',
      figura: { svg: figuraArreglo(celdas), alt } });
  }

  // ---------- progresión ----------
  function tProgresion(rng, semilla) {
    const pide = rng.elegir(['cortes', 'mayor']);
    const n = rng.entero(4, 10), a = rng.entero(2, 15), d = rng.entero(1, 6), b = a + (n - 1) * d, L = n * (a + b) / 2;
    if (!Number.isInteger(L) || L > 400) return null;
    const datos = pide === 'cortes' ? { tipo: 'progresion', pide, L, a, b, c: null } : { tipo: 'progresion', pide, L, a, b: null, c: n - 1 };
    const R = progresion(datos), r = R.respuesta;
    const variables = { L: { nombre: 'largo del listón', color: 'o' }, a: { nombre: 'tramo menor', color: 'i' }, b: { nombre: 'tramo mayor', color: 'h' }, c: { nombre: 'cortes', color: 'd' } };
    const enunciado = ['Un carpintero corta un listón de ', v('L', `${L} cm`), ' en tramos rectos. Ordenados de menor a mayor, cada tramo mide lo mismo más que el anterior (sus longitudes forman una progresión aritmética).'];
    let pregunta, errores, solucion;
    if (pide === 'cortes') {
      enunciado.push(' El tramo menor mide ', v('a', `${a} cm`), ' y el mayor, ', v('b', `${b} cm`), '.');
      pregunta = ['¿Cuántos cortes hizo?'];
      errores = [
        h('RMP1-cortes-tramos', n, `Ese es el número de tramos. En un listón abierto, ${n} tramos salen con ${n - 1} cortes.`),
        h('RMP1-mas-uno', n + 1, `Sumaste uno en vez de restarlo: con c cortes salen c + 1 tramos, así que ${n} tramos piden ${n - 1} cortes.`),
        Number.isInteger(L / (a + b)) ? h('RMP37-sin-promedio', L / (a + b) - 1, `Dividiste ${L} entre ${a} + ${b}, pero el tramo promedio es la mitad de esa suma: (${a} + ${b}) ÷ 2 = ${f((a + b) / 2)} cm.`) : null,
        Number.isInteger(L / a) ? h('RMP37-todos-iguales', L / a - 1, `Contaste como si todos los tramos midieran ${a} cm, el menor. Los tramos crecen, así que caben menos.`) : null,
        h('RMP1-dos-menos', n - 2, 'Restaste uno de más. Con c cortes salen c + 1 tramos.'),
      ].filter(Boolean);
      solucion = [
        ['En una progresión aritmética, el tramo promedio es el promedio del menor y el mayor: (', v('a', `${a}`), ' + ', v('b', `${b}`), `) ÷ 2 = ${f((a + b) / 2)} cm.`],
        ['Tramos: ', v('L', `${L}`), ` ÷ ${f((a + b) / 2)} = ${n}. (Cada uno mide ${R.d} cm más que el anterior: ${R.tramos.join(', ')}.)`],
        [`Un listón abierto con ${n} tramos tiene ${n} − 1 = ${f(r)} cortes.`],
      ];
      return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: 'cortes', singular: 'corte' });
    }
    const c = n - 1;
    enunciado.push(' Hizo ', v('c', `${c} cortes`), ' y el tramo menor mide ', v('a', `${a} cm`), '.');
    pregunta = ['¿Cuánto mide el tramo mayor?'];
    errores = [
      h('RMP1-cortes-tramos', 2 * L / c - a, `Tomaste ${c} tramos, pero ${c} cortes en un listón abierto dan ${c + 1} tramos.`),
      h('RMP37-promedio', L / n, `Ese es el tramo promedio (${L} ÷ ${n}). El mayor está tan por encima del promedio como el menor está por debajo.`),
      h('RMP37-sin-restar', 2 * L / n, `Duplicaste el promedio, pero eso es la suma del menor y el mayor: falta restar los ${a} cm del menor.`),
      h('RMP1-mas-uno', 2 * L / (c + 2) - a, `Sumaste dos a los cortes: ${c} cortes dan ${c + 1} tramos, no ${c + 2}.`),
    ];
    solucion = [
      [v('c', `${c} cortes`), ` en un listón abierto dan ${n} tramos.`],
      ['El tramo promedio es ', v('L', `${L}`), ` ÷ ${n} = ${f(L / n)} cm, y en una progresión aritmética es el promedio del menor y el mayor.`],
      ['Mayor = 2 × ', `${f(L / n)}`, ' − ', v('a', `${a}`), ` = ${f(r)} cm. (Tramos: ${R.tramos.join(', ')}.)`],
    ];
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: 'cm' });
  }

  // ---------- estacas ----------
  function tEstacas(rng, semilla) {
    const pide = rng.elegir(['vertices', 'cada']);
    let p = rng.entero(2, 5), q = rng.entero(2, 5);
    if (mcd(p, q) !== 1) return null;
    if (p < q) [p, q] = [q, p];   // el largo (A) es el lado mayor
    const e = pide === 'cada' ? rng.elegir([2, 3, 4, 5]) : null;
    const g = pide === 'cada' ? e * rng.entero(2, 4) : rng.elegir([6, 8, 9, 10, 12, 15, 18, 20, 24]);
    const A = p * g, B = q * g;
    if (A > 200 || B > 200) return null;
    const datos = { tipo: 'estacas', A, B, e, pide };
    const R = estacas(datos), r = R.respuesta;
    const variables = { A: { nombre: 'largo', color: 'o' }, B: { nombre: 'ancho', color: 'i' }, e: { nombre: 'separación de las estacas', color: 'h' } };
    const enunciado = ['Un terreno rectangular de ', v('A', `${A} m`), ' por ', v('B', `${B} m`), ' se divide en parcelas cuadradas iguales, lo más grandes posible, y se cerca el borde de cada parcela. Donde dos parcelas se tocan, el cerco es uno solo.'];
    let pregunta, errores, solucion;
    const parcelas = p * q;
    if (pide === 'vertices') {
      pregunta = ['Se pone una estaca en cada esquina de cada parcela. ¿Cuántas estacas se necesitan como mínimo?'];
      errores = [
        h('RMP1-cada-parcela', 4 * parcelas, `Pusiste 4 estacas por parcela (${parcelas} × 4), pero las esquinas que comparten varias parcelas llevan una sola estaca.`),
        h('RMP1-sin-mas-uno', parcelas, `Contaste parcelas, no esquinas: en cada lado hay una fila de esquinas más que de parcelas (${p} + 1 y ${q} + 1).`),
        h('RMP1-solo-borde', 2 * (p + q), 'Contaste solo las estacas del borde del terreno; las esquinas de adentro también llevan estaca.'),
        g % 2 === 0 ? h('RMP37-mcd-chico', (2 * p + 1) * (2 * q + 1), `Usaste parcelas de ${f(g / 2)} m, que también caben, pero no son las más grandes posibles: el lado es el MCD, ${g} m.`) : null,
      ].filter(Boolean);
      solucion = [
        ['El lado de la parcela más grande es el MCD de ', v('A', `${A}`), ' y ', v('B', `${B}`), `: ${g} m.`],
        [`Parcelas: ${A} ÷ ${g} = ${p} a lo largo y ${B} ÷ ${g} = ${q} a lo ancho.`],
        [`Las esquinas forman una cuadrícula de (${p} + 1) × (${q} + 1) = ${f(r)} puntos, cada uno con una sola estaca.`],
      ];
    } else {
      pregunta = ['Se ponen estacas cada ', v('e', `${e} m`), ' a lo largo de todos los cercos, con una en cada esquina. ¿Cuántas estacas se necesitan como mínimo?'];
      const porLinea = (q + 1) * (A / e + 1) + (p + 1) * (B / e + 1);
      errores = [
        h('RMP1-cada-parcela', parcelas * 4 * g / e, `Contaste cada parcela por separado (${4 * g / e} estacas cada una), pero los cercos compartidos y sus estacas se cuentan una sola vez.`),
        h('RMP1-cruces-dos-veces', porLinea, 'Contaste bien cada cerco recto, pero las estacas donde se cruzan dos cercos quedaron contadas dos veces: hay que restarlas.'),
        h('RMP1-solo-borde', 2 * (A + B) / e, 'Contaste solo las estacas del borde del terreno; los cercos de adentro también llevan estacas.'),
        h('RMP1-sin-mas-uno', (q + 1) * (A / e) + (p + 1) * (B / e) - (p + 1) * (q + 1), `En cada cerco recto hay una estaca más que tramos de ${e} m; contaste los tramos.`),
      ];
      solucion = [
        ['Lado de la parcela: MCD(', v('A', `${A}`), ', ', v('B', `${B}`), `) = ${g} m. Hay ${p} × ${q} parcelas.`],
        [`Cercos a lo largo: ${q} + 1 = ${q + 1}, cada uno con ${A} ÷ `, v('e', `${e}`), ` + 1 = ${A / e + 1} estacas. Cercos a lo ancho: ${p + 1}, con ${B / e + 1} estacas cada uno.`],
        [`Los ${(p + 1) * (q + 1)} cruces se contaron dos veces: ${(q + 1) * (A / e + 1)} + ${(p + 1) * (B / e + 1)} − ${(p + 1) * (q + 1)} = ${f(r)}.`],
      ];
    }
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: 'estacas', singular: 'estaca',
      figura: { svg: figuraTerreno(A, B), alt: `Rectángulo de ${A} m de largo por ${B} m de ancho, sin la división en parcelas.` } });
  }

  // ---------- recorte de esquinas ----------
  // p + q√2 escrito como en el examen: «28 + 12√2», «80√2 − 80», «80 − 40√2».
  function raiz({ p, q }) {
    const r = Math.abs(q) === 1 ? '√2' : `${f(Math.abs(q))}√2`;
    let t;
    if (q === 0) t = f(p);
    else if (p === 0) t = (q < 0 ? '−' : '') + r;
    else if (p > 0) t = `${f(p)} ${q > 0 ? '+' : '−'} ${r}`;
    else t = q > 0 ? `${r} − ${f(-p)}` : `−${f(-p)} − ${r}`;
    return { clave: `rad:${p}:${q}`, texto: t + ' cm' };
  }
  const aprox = x => Number.isInteger(x) ? f(x) : `unos ${P.formatear(x, 1)}`;
  const numTxt = n => ({ clave: `num:${n}`, texto: `${f(n)} cm` });
  function tEsquinas(rng, semilla) {
    const corte = rng.elegir(['cuadrado', 'triangulo', 'triangulo', 'octogono']);
    const cuadrado = corte === 'octogono' || rng.moneda();
    const L = rng.entero(8, 30), W = cuadrado ? L : rng.entero(6, L - 1);
    const a = corte === 'octogono' ? null : rng.entero(1, Math.floor(Math.min(L, W) / 2 - 1));
    if (a !== null && a < 1) return null;
    const datos = { tipo: 'esquinas', corte, L, W, a };
    const R = esquinas(datos);
    const variables = { L: { nombre: 'largo', color: 'o' }, W: { nombre: 'ancho', color: 'i' }, a: { nombre: 'lo que se recorta', color: 'h' } };
    const forma = cuadrado ? ['Una lámina cuadrada de ', v('L', `${L} cm`), ' de lado'] : ['Una lámina rectangular de ', v('L', `${L} cm`), ' por ', v('W', `${W} cm`)];
    const base = 2 * (L + W);
    let enunciado, pregunta = ['¿Cuál es el perímetro de la figura que queda?'], correcta, errores, solucion, alt;
    const e = (id, val, explicacion) => ({ id, ...(typeof val === 'number' ? numTxt(val) : raiz(val)), explicacion, respaldo: 'hipotesis', fuente: null });
    if (corte === 'cuadrado') {
      enunciado = [...forma, ' pierde sus cuatro esquinas: en cada una se recorta un cuadradito de ', v('a', `${a} cm`), ' de lado.'];
      correcta = numTxt(R.respuesta);
      errores = [
        e('RMP37-sin-lados-nuevos', base - 8 * a, `Restaste lo que se quita del borde (8 × ${a}), pero olvidaste que el recorte deja dos lados nuevos de ${a} cm en cada esquina.`),
        e('RMP37-medio-recorte', base - 4 * a, `Restaste un lado por esquina. En cada esquina se quitan dos tramos de ${a} cm y aparecen dos lados nuevos de ${a} cm: no cambia nada.`),
        e('RMP37-suma-de-mas', base + 8 * a, 'Sumaste los lados nuevos sin restar lo que se quitó del borde.'),
        e('RMP37-area', cuadrado ? L * L - 4 * a * a : L * W - 4 * a * a, 'Calculaste el área que queda, no el perímetro.'),
      ];
      solucion = [
        [`En cada esquina se quitan dos tramos de borde de `, v('a', `${a} cm`), ` y aparecen dos lados nuevos de ${a} cm, uno vertical y uno horizontal.`],
        ['Lo que se quita y lo que aparece mide lo mismo: el perímetro no cambia.'],
        [`Perímetro: 2 × (`, v('L', `${L}`), ' + ', v(cuadrado ? 'L' : 'W', `${W}`), `) = ${f(R.respuesta)} cm.`],
      ];
      alt = `${cuadrado ? `Cuadrado de ${L} cm` : `Rectángulo de ${L} cm por ${W} cm`} con un cuadradito de ${a} cm recortado en cada esquina (la figura queda con forma de cruz).`;
    } else if (corte === 'triangulo') {
      enunciado = [...forma, ' pierde sus cuatro esquinas con cortes rectos: en cada esquina se quita un triángulo rectángulo isósceles de catetos de ', v('a', `${a} cm`), ' sobre los bordes.'];
      correcta = raiz(R.respuesta);
      errores = [
        e('RMP37-sin-lados-nuevos', base - 8 * a, `Restaste los catetos que se quitan del borde, pero olvidaste los cuatro cortes nuevos: cada uno es una hipotenusa de ${a}√2 cm.`),
        e('RMP37-hipotenusa-como-cateto', base - 4 * a, `Tomaste la hipotenusa del corte como si midiera ${a} cm. En un triángulo rectángulo isósceles mide ${a}√2.`),
        e('RMP37-no-cambia', base, `Pensaste que, como con los cuadraditos, el perímetro no cambia. Aquí dos lados de ${a} cm se cambian por uno solo de ${a}√2 cm, que es menor que ${2 * a}.`),
        e('RMP37-dos-hipotenusas', { p: base - 8 * a, q: 8 * a }, 'Contaste dos hipotenusas por esquina; cada corte recto deja un solo lado nuevo.'),
      ];
      solucion = [
        ['En cada esquina se quitan dos tramos de ', v('a', `${a} cm`), ` del borde: en total 8 × ${a} = ${8 * a} cm.`],
        [`Cada corte es la hipotenusa de un triángulo rectángulo isósceles de catetos ${a}: mide ${a}√2 cm. Son cuatro: ${4 * a}√2 cm.`],
        [`Perímetro: ${base} − ${8 * a} + ${4 * a}√2 = ${raiz(R.respuesta).texto}.`],
      ];
      alt = `${cuadrado ? `Cuadrado de ${L} cm` : `Rectángulo de ${L} cm por ${W} cm`} con las cuatro esquinas cortadas en diagonal; cada corte quita ${a} cm de cada lado que toca. Queda un octógono.`;
    } else {
      enunciado = [...forma, ' pierde sus cuatro esquinas con cortes rectos iguales, de modo que queda un octógono regular (sus ocho lados miden lo mismo).'];
      pregunta = ['¿Cuál es el perímetro del octógono?'];
      correcta = raiz(R.respuesta);
      errores = [
        { id: 'RMP37-tercios', clave: `frac:${8 * L}/3`, texto: aprox(8 * L / 3) + ' cm', explicacion: `Partiste el lado en tres partes iguales, pero entonces el corte de cada esquina (la hipotenusa) mediría √2 veces un tercio del lado, más que el tercio del medio (${aprox(L / 3)} cm): los ocho lados no serían iguales.`, respaldo: 'hipotesis', fuente: null },
        e('RMP37-cateto', { p: 8 * L, q: -4 * L }, 'Calculaste 8 veces el cateto del triángulo que se quita (lo que se recorta de cada borde), no el lado del octógono.'),
        e('RMP37-no-cambia', 4 * L, 'Pensaste que el perímetro no cambia, pero cada corte cambia dos tramos del borde por un solo lado más corto: el perímetro disminuye.'),
      ];
      solucion = [
        ['Sea s el lado del octógono. Cada esquina quita un triángulo rectángulo isósceles con hipotenusa s, así que sus catetos miden s/√2.'],
        ['En un lado del cuadrado: s/√2 + s + s/√2 = ', v('L', `${L}`), `, o sea s(1 + √2) = ${L}.`],
        [`s = ${L} ÷ (1 + √2) = ${L}(√2 − 1) cm. Perímetro: 8s = ${raiz(R.respuesta).texto}.`],
      ];
      alt = `Cuadrado de ${L} cm de lado con las cuatro esquinas cortadas en diagonal, de modo que queda un octógono de ocho lados iguales.`;
    }
    return cerrar(rng, semilla, { correcta, errores, enunciado, pregunta, solucion, variables, datos, texto: true, unidad: 'cm',
      figura: { svg: figuraEsquinas(corte, L, W, a), alt } });
  }

  return { id: ID, titulo: 'Cortes, tramos y estacas', generar, calc };
});
