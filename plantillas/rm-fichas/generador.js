/*
 * Generador: fichas y piezas (semejanza, perímetros de contornos, encajes y sucesiones de figuras).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['rm-fichas']) y en Node (require). No usa ningún motor.
 *
 * Tipos y sus _datos:
 *   semejanza     { tipo, ficha: 'triangulo'|'rectangulo'|'trapecio', N, L, a, b } con N fichas iguales se arma la
 *                 mayor figura semejante a una ficha (sin huecos ni superposiciones). Usa k² fichas, con el mayor k
 *                 tal que k² ≤ N. Respuesta: su perímetro (k veces el de la ficha). El trapecio es el de tres
 *                 triángulos equiláteros (lados L, L, L y 2L); que k² trapecios arman el trapecio de lado k lo
 *                 comprueba la prueba con una búsqueda sobre la malla de triángulos (k ≤ 7).
 *   hexagonos     { tipo, T, H, L } T triángulos equiláteros y H hexágonos regulares, todos de lado L. Respuesta: el
 *                 perímetro del mayor triángulo equilátero que se arma usando de los dos tipos. Un hexágono vale 6
 *                 triángulos y en el triángulo de lado k caben a lo más hmax(k) hexágonos (centros no vecinos en
 *                 la malla: se cuenta con una búsqueda).
 *   contorno      { tipo, forma, n, s, m, a, b, pide: 'perimetro'|'b', P } fichas rectangulares de a × b (a < b)
 *                 puestas sin superponerse en una escalera (cada una corrida s cm), una L o una T (m echadas y
 *                 n − m paradas) o una cruz (echadas y paradas alternadas). 'perimetro': el del contorno; 'b': se
 *                 da el perímetro P y a, y se pide b (se prueba cada b con la misma disposición).
 *   medios        { tipo, L, n, pide: 'area'|'perimetro'|'razon' } cuadrado de lado L; se unen los puntos medios
 *                 de sus lados y así sucesivamente. Cuadrado 1 = el inicial. Respuesta: área o perímetro del
 *                 cuadrado n, o la razón entre los perímetros del 1 y del n.
 *   rectangulo    { tipo, piezas: [id, id], pide: 'area'|'perimetro' } el menor rectángulo (en área o en
 *                 perímetro) que se cubre exactamente con piezas de los dos tipos, al menos una de cada una
 *                 (se pueden girar y voltear). Búsqueda de embaldosados.
 *   lineal        { tipo, W, H, n } un bloque de W × H se corta en n tiras iguales (cortes paralelos al lado H) y
 *                 se ponen en fila, cada una pegada a la siguiente por un lado completo. Respuesta: el mayor
 *                 perímetro posible (se juntan por el lado corto).
 *   cajas         { tipo, W, L, p, q, H } barras de p × q × H en una caja de W × L × H (de pie). Respuesta: el
 *                 máximo de barras que caben (búsqueda de empaques, con giros).
 *   tablero       { tipo, r, c, bloqueadas: [[f, c]], pieza: 'I3'|'L3' } máximo de fichas de tres cuadraditos
 *                 en un tablero con casillas tapadas (búsqueda).
 *   fibonacci     { tipo, u, n, pide: 'area'|'perimetro' } figuras de cuadrados de lados 1, 1, 2, 3, 5, … (por u cm)
 *                 que se arman en espiral. Respuesta: área o perímetro de la figura n.
 *   malla         { tipo, n, t } puntos en n filas (1, 2, …, n) en una malla triangular; una hormiga recorre
 *                 los segmentos (t segundos cada uno). Respuesta: el menor tiempo para pasar por todos los puntos.
 *
 * calc:
 *   semejanza(d) → { k, fichas, perimetro }; medios(L, n) → { lado, area, perimetro }; orientaciones(celdas), embaldosar(w, h, ids, opciones), minRectangulo(ids, pide), maxEmpaque(w, h, celdas, bloq)
 *   voraz(w, h, celdas, bloq), hmax(k), hexagonos(T, H), contorno(fichas), formaFichas(d, a, b), perimetroCon(d, b, modo),
 *   trapecioTeselado(k), malla(n), fib(n)
 *
 * Errores (ver el informe de respuesta de este módulo):
 *   AR7-*          linealidad: escalar el perímetro como el área, usar todas las fichas, la mitad en cada paso
 *                  (parcial: el informe documenta AR7 con figuras semejantes, no estas caras)
 *   RM2-*          sucesión de figuras tomada como lineal u «objeto entero» (parcial)
 *   RMP68-*        perímetro del contorno: sumar perímetros sin restar lo que se toca, restarlo una sola vez,
 *                  creer que se conserva al cortar
 *   RMP69-*        contar áreas o piezas sin ver cómo encajan: dividir áreas, sumar áreas, el hexágono como una ficha
 *   RMP63-*        no usar una condición (las casillas tapadas)
 *   RMP1-*         puntos contra intervalos: cuadrados contra pasos, puntos contra segmentos
 *   RMP2-*         quedarse con una opción que no es la extrema (juntar por el lado largo, una sola orientación, voraz)
 *   RMP61-*        responder un valor intermedio (el lado, el último cuadrado)
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const INF = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const pa = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: INF });
  const v = P.v;
  const f = x => P.formatear(x, 2);
  const ent = x => Number.isInteger(x);
  const SVG = (w, hgt, cuerpo) => `<svg viewBox="0 0 ${w} ${hgt}" xmlns="http://www.w3.org/2000/svg" font-family="inherit" text-anchor="middle">${cuerpo}</svg>`;
  const texto = (x, y, t, tam = 15, estilo = 'fill:currentColor') => `<text x="${x}" y="${y}" font-size="${tam}" style="${estilo}">${P.xml(t)}</text>`;
  const poligono = (pts, estilo = 'fill:var(--card)', ancho = 1.5) => `<polygon points="${pts.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ')}" style="${estilo}" stroke="currentColor" stroke-width="${ancho}"/>`;
  const f2 = x => Math.round(x * 10) / 10;
  const R3 = Math.sqrt(3);

  // =====================================================================
  // Piezas de cuadraditos: orientaciones, embaldosados y empaques
  // =====================================================================
  const PIEZAS = {
    D2: { celdas: [[0, 0], [1, 0]], nombre: 'dominó (2 cuadraditos en fila)' },
    I3: { celdas: [[0, 0], [1, 0], [2, 0]], nombre: 'recta de 3 cuadraditos' },
    L3: { celdas: [[0, 0], [1, 0], [0, 1]], nombre: 'ele de 3 cuadraditos' },
    O4: { celdas: [[0, 0], [1, 0], [0, 1], [1, 1]], nombre: 'cuadrado de 2 × 2' },
    I4: { celdas: [[0, 0], [1, 0], [2, 0], [3, 0]], nombre: 'recta de 4 cuadraditos' },
    L4: { celdas: [[0, 0], [0, 1], [0, 2], [1, 0]], nombre: 'ele de 4 cuadraditos' },
    T4: { celdas: [[0, 0], [1, 0], [2, 0], [1, 1]], nombre: 'te de 4 cuadraditos' },
    S4: { celdas: [[0, 0], [1, 0], [1, 1], [2, 1]], nombre: 'ese de 4 cuadraditos' },
    P5: { celdas: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]], nombre: 'pe de 5 cuadraditos' },
    V5: { celdas: [[0, 0], [0, 1], [0, 2], [1, 0], [2, 0]], nombre: 'ele grande de 5 cuadraditos' },
  };
  const normal = cs => { const mx = Math.min(...cs.map(c => c[0])), my = Math.min(...cs.map(c => c[1])); return cs.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[1] - b[1] || a[0] - b[0]); };
  function orientaciones(cs) {
    const m = new Map(); let p = cs;
    for (let r = 0; r < 2; r++) { for (let k = 0; k < 4; k++) { const n = normal(p); m.set(JSON.stringify(n), n); p = p.map(([x, y]) => [-y, x]); } p = p.map(([x, y]) => [-x, y]); }
    return [...m.values()];
  }
  // Un embaldosado de w × h con piezas de los tipos dados, al menos una de cada tipo; null si no hay.
  // Devuelve la lista de piezas puestas: [{ t: índice del tipo, celdas: [[x, y]] }].
  function embaldosar(w, hh, ids) {
    const O = ids.map(t => orientaciones(PIEZAS[t].celdas));
    const g = new Int16Array(w * hh).fill(-1), cnt = ids.map(() => 0), puestas = [];
    let nodos = 0;
    const rec = () => {
      if (++nodos > 300000) return false;
      const i = g.indexOf(-1);
      if (i < 0) return cnt.every(c => c > 0);
      const x = i % w, y = (i / w) | 0;
      for (let t = 0; t < O.length; t++) for (const o of O[t]) {
        const [ax, ay] = o[0], dx = x - ax, dy = y - ay;
        if (!o.every(([cx, cy]) => { const X = cx + dx, Y = cy + dy; return X >= 0 && Y >= 0 && X < w && Y < hh && g[Y * w + X] < 0; })) continue;
        const cel = o.map(([cx, cy]) => [cx + dx, cy + dy]);
        cel.forEach(([X, Y]) => { g[Y * w + X] = puestas.length; });
        puestas.push({ t, celdas: cel }); cnt[t]++;
        if (rec()) return true;
        puestas.pop(); cnt[t]--; cel.forEach(([X, Y]) => { g[Y * w + X] = -1; });
      }
      return false;
    };
    return rec() ? puestas : null;
  }
  const CACHE_RECT = new Map();
  // El menor rectángulo (por área o por perímetro; a igualdad, el otro criterio) que se embaldosa.
  function minRectangulo(ids, pide) {
    const k = ids.join('+') + '|' + pide;
    if (CACHE_RECT.has(k)) return CACHE_RECT.get(k);
    const a = ids.map(t => PIEZAS[t].celdas.length), minA = a[0] + a[1];
    const cand = [];
    for (let w = 1; w <= 12; w++) for (let hh = w; hh <= 24; hh++) if (w * hh >= minA && w * hh <= 60) cand.push([w, hh]);
    cand.sort(pide === 'area' ? (p, q) => p[0] * p[1] - q[0] * q[1] || (p[0] + p[1]) - (q[0] + q[1]) : (p, q) => (p[0] + p[1]) - (q[0] + q[1]) || p[0] * p[1] - q[0] * q[1]);
    const halladas = [];
    for (const [w, hh] of cand) {
      const t = embaldosar(w, hh, ids);
      if (t) { halladas.push({ w, h: hh, teselas: t }); if (halladas.length === 2) break; }
    }
    const r = halladas.length ? { ...halladas[0], segundo: halladas[1] || null } : null;
    CACHE_RECT.set(k, r);
    return r;
  }
  // Máximo de piezas (todas iguales, con giros) en w × h con casillas tapadas. Búsqueda con cota.
  function maxEmpaque(w, hh, cs, bloq = []) {
    const O = orientaciones(cs), A = cs.length;
    const g = new Int16Array(w * hh).fill(-1); bloq.forEach(([x, y]) => { g[y * w + x] = -2; });
    let mejor = 0, mejorSol = [];
    const puestas = [];
    const rec = (i, libres) => {
      while (i < w * hh && g[i] !== -1) i++;
      if (i >= w * hh) { if (puestas.length > mejor) { mejor = puestas.length; mejorSol = puestas.map(p => p.map(c => c.slice())); } return; }
      if (puestas.length + Math.floor(libres / A) <= mejor) return;
      const x = i % w, y = (i / w) | 0;
      for (const o of O) {
        const [ax, ay] = o[0], dx = x - ax, dy = y - ay;
        if (!o.every(([cx, cy]) => { const X = cx + dx, Y = cy + dy; return X >= 0 && Y >= 0 && X < w && Y < hh && g[Y * w + X] === -1; })) continue;
        const cel = o.map(([cx, cy]) => [cx + dx, cy + dy]);
        cel.forEach(([X, Y]) => { g[Y * w + X] = 1; }); puestas.push(cel);
        rec(i + 1, libres - A);
        puestas.pop(); cel.forEach(([X, Y]) => { g[Y * w + X] = -1; });
      }
      g[i] = -3; rec(i + 1, libres - 1); g[i] = -1;
    };
    rec(0, w * hh - bloq.length);
    return { max: mejor, piezas: mejorSol };
  }
  // Lo que hace quien coloca «la primera que entra» recorriendo por filas, sin volver atrás.
  function voraz(w, hh, cs, bloq = []) {
    const O = orientaciones(cs), g = new Int16Array(w * hh).fill(-1); bloq.forEach(([x, y]) => { g[y * w + x] = -2; });
    let n = 0;
    for (let i = 0; i < w * hh; i++) {
      if (g[i] !== -1) continue;
      const x = i % w, y = (i / w) | 0;
      for (const o of O) {
        const [ax, ay] = o[0], dx = x - ax, dy = y - ay;
        if (o.every(([cx, cy]) => { const X = cx + dx, Y = cy + dy; return X >= 0 && Y >= 0 && X < w && Y < hh && g[Y * w + X] === -1; })) { o.forEach(([cx, cy]) => { g[(cy + dy) * w + cx + dx] = 1; }); n++; break; }
      }
    }
    return n;
  }
  const rectCeldas = (p, q) => { const r = []; for (let y = 0; y < q; y++) for (let x = 0; x < p; x++) r.push([x, y]); return r; };
  function dibujaCuadricula(w, hh, celdaPx, x0, y0, pintar) {
    let s = '';
    for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) s += `<rect x="${x0 + x * celdaPx}" y="${y0 + y * celdaPx}" width="${celdaPx}" height="${celdaPx}" style="${pintar(x, y)}" stroke="currentColor" stroke-width="1"/>`;
    return s;
  }
  function dibujaPieza(cs, celdaPx, x0, y0, color = 'o') {
    return cs.map(([x, y]) => `<rect x="${x0 + x * celdaPx}" y="${y0 + y * celdaPx}" width="${celdaPx}" height="${celdaPx}" style="fill:var(--c-${color});fill-opacity:0.3" stroke="currentColor" stroke-width="1.5"/>`).join('');
  }
  const COLORES = ['o', 'i', 'h', 'd'];
  // Borde de cada pieza de cuadraditos (lados que no tocan otra celda de la misma pieza), en trazo grueso.
  function bordesPiezas(piezas, cp, x0, y0) {
    let s = '';
    for (const cel of piezas) {
      const esta = new Set(cel.map(c => c.join(',')));
      for (const [x, y] of cel) for (const [dx, dy, x1, y1, x2, y2] of [[0, -1, 0, 0, 1, 0], [0, 1, 0, 1, 1, 1], [-1, 0, 0, 0, 0, 1], [1, 0, 1, 0, 1, 1]]) {
        if (esta.has(`${x + dx},${y + dy}`)) continue;
        s += `<line x1="${f2(x0 + (x + x1) * cp)}" y1="${f2(y0 + (y + y1) * cp)}" x2="${f2(x0 + (x + x2) * cp)}" y2="${f2(y0 + (y + y2) * cp)}" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`;
      }
    }
    return s;
  }

  // =====================================================================
  // 1. Semejanza con fichas
  // =====================================================================
  // Trapecio de tres triángulos en la malla de triángulos: ¿k² trapecios arman el de lado k? (búsqueda)
  function trapecioTeselado(k) {
    const verts = t => (t.u ? [[t.x, t.y], [t.x + 1, t.y], [t.x, t.y + 1]] : [[t.x + 1, t.y], [t.x, t.y + 1], [t.x + 1, t.y + 1]]);
    const triDe = vs => { const mx = Math.min(...vs.map(q => q[0])), my = Math.min(...vs.map(q => q[1])); const kk = vs.map(q => (q[0] - mx) + ',' + (q[1] - my)).sort().join(' '); return { u: kk === '0,0 0,1 1,0' ? 1 : 0, x: mx, y: my }; };
    const rot = ([x, y]) => [-y, x + y], refl = ([x, y]) => [x + y, -y];
    const base = [{ u: 1, x: 0, y: 0 }, { u: 0, x: 0, y: 0 }, { u: 1, x: 1, y: 0 }];
    const orient = new Map(); let p = base.map(verts);
    for (let r = 0; r < 2; r++) { for (let q = 0; q < 6; q++) { const ts = p.map(triDe); const mx = Math.min(...ts.map(t => t.x)), my = Math.min(...ts.map(t => t.y)); const nm = ts.map(t => ({ u: t.u, x: t.x - mx, y: t.y - my })); orient.set(nm.map(t => `${t.u}:${t.x}:${t.y}`).sort().join('|'), nm); p = p.map(vs => vs.map(rot)); } p = p.map(vs => vs.map(refl)); }
    const O = [...orient.values()];
    const region = new Set();
    for (let y = 0; y < k; y++) for (let x = 0; x < 2 * k; x++) { if (x + y <= 2 * k - 1) region.add(`1:${x}:${y}`); if (x + y <= 2 * k - 2) region.add(`0:${x}:${y}`); }
    const celdas = [...region].sort((A, B) => { const [ua, xa, ya] = A.split(':').map(Number), [ub, xb, yb] = B.split(':').map(Number); return ya - yb || xa - xb || ub - ua; });
    const cub = new Set(), piezas = [];
    const rec = () => {
      const c = celdas.find(z => !cub.has(z));
      if (!c) return true;
      const [u, x, y] = c.split(':').map(Number);
      for (const o of O) for (const t of o) {
        if (t.u !== u) continue;
        const ks = o.map(q => `${q.u}:${q.x + x - t.x}:${q.y + y - t.y}`);
        if (ks.every(z => region.has(z) && !cub.has(z))) { ks.forEach(z => cub.add(z)); piezas.push(ks); if (rec()) return true; piezas.pop(); ks.forEach(z => cub.delete(z)); }
      }
      return false;
    };
    return rec() ? piezas : null;
  }
  const FICHAS = {
    triangulo: { nombre: 'triángulo equilátero', per: d => 3 * d.L, lados: d => `de ${d.L} cm de lado` },
    rectangulo: { nombre: 'rectángulo', per: d => 2 * (d.a + d.b), lados: d => `de ${d.a} cm por ${d.b} cm` },
    trapecio: { nombre: 'trapecio isósceles', per: d => 5 * d.L, lados: d => `con bases de ${d.L} cm y ${2 * d.L} cm y lados no paralelos de ${d.L} cm` },
  };
  function construirSemejanza(rng, semilla) {
    for (let intento = 0; intento < 100; intento++) {
      const ficha = rng.elegir(['triangulo', 'rectangulo', 'rectangulo', 'trapecio', 'trapecio']);
      const k = rng.entero(3, 7);
      const N = rng.entero(k * k + 1, (k + 1) * (k + 1) - 1);
      const d = { tipo: 'semejanza', ficha, N, L: null, a: null, b: null };
      if (ficha === 'rectangulo') { d.a = rng.entero(2, 5); d.b = d.a * rng.elegir([2, 3]) + rng.elegir([0, 0, 1]); if (d.b === d.a) continue; }
      else d.L = rng.entero(2, 6);
      const p = armarSemejanza(d, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function figFicha(d, k = 1) {
    // Dibujo de una ficha (k = 1) o de la figura grande con sus fichas (k > 1).
    const F = d.ficha;
    if (F === 'rectangulo') {
      const esc = Math.min(260 / (k * d.b), 150 / (k * d.a));
      let s = '';
      for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) s += `<rect x="${20 + j * d.b * esc}" y="${10 + i * d.a * esc}" width="${d.b * esc}" height="${d.a * esc}" style="fill:var(--c-o);fill-opacity:${k > 1 ? 0.15 : 0.25}" stroke="currentColor" stroke-width="1.5"/>`;
      const W = k * d.b * esc, H = k * d.a * esc;
      if (k === 1) s += texto(20 + W / 2, 10 + H + 20, `${d.b} cm`, 15) + texto(20 + W + 24, 10 + H / 2 + 5, `${d.a} cm`, 15);
      return SVG(W + 70, H + 34, s);
    }
    if (F === 'triangulo') {
      const lado = k === 1 ? 120 : 260 / k, Hh = lado * R3 / 2;
      let s = '';
      for (let i = 0; i < k; i++) for (let j = 0; j <= i; j++) {
        const x0 = 20 + (k - 1 - i) * lado / 2 + j * lado, y0 = 10 + i * Hh;
        s += poligono([[x0 + lado / 2, y0], [x0, y0 + Hh], [x0 + lado, y0 + Hh]], `fill:var(--c-o);fill-opacity:${k > 1 ? 0.15 : 0.25}`);
        if (j < i) s += poligono([[x0 + lado / 2, y0], [x0 + lado, y0 + Hh], [x0 + lado * 1.5, y0]], `fill:var(--c-o);fill-opacity:${k > 1 ? 0.15 : 0.25}`);
      }
      if (k === 1) s += texto(80, 10 + Hh + 20, `${d.L} cm`, 15);
      return SVG(k * lado + 40, k * Hh + 36, s);
    }
    // trapecio: k = 1, la ficha; k > 1, el teselado hallado por búsqueda
    const u = k === 1 ? 60 : 280 / (2 * k);
    const P_ = ([x, y]) => [20 + (x + y / 2) * u, 10 + (k - y) * u * R3 / 2];
    let s = '';
    if (k === 1) {
      s += poligono([P_([0, 0]), P_([2, 0]), P_([1, 1]), P_([0, 1])], 'fill:var(--c-o);fill-opacity:0.25');
      const [bx, by] = P_([1, 0]), [tx, ty] = P_([0.5, 1]);
      s += texto(bx, by + 20, `${2 * d.L} cm`, 15) + texto(tx + u / 2, ty - 6, `${d.L} cm`, 15);
      return SVG(2 * u + 60, u * R3 / 2 + 50, `<g transform="translate(0,14)">${s}</g>`);
    }
    const piezas = trapecioTeselado(k) || [];
    piezas.forEach((ks, i) => {
      for (const z of ks) {
        const [uu, x, y] = z.split(':').map(Number);
        const vs = uu ? [[x, y], [x + 1, y], [x, y + 1]] : [[x + 1, y], [x, y + 1], [x + 1, y + 1]];
        s += `<polygon points="${vs.map(P_).map(([a, b]) => `${f2(a)},${f2(b)}`).join(' ')}" style="fill:var(--c-${COLORES[i % 4]});fill-opacity:0.25;stroke:var(--c-${COLORES[i % 4]})" stroke-width="0.5"/>`;
      }
    });
    // Borde de cada trapecio: los lados de sus triángulos que no comparte consigo mismo.
    for (const ks of piezas) {
      const lados = new Map();
      for (const z of ks) {
        const [uu, x, y] = z.split(':').map(Number);
        const vs = uu ? [[x, y], [x + 1, y], [x, y + 1]] : [[x + 1, y], [x, y + 1], [x + 1, y + 1]];
        for (let i = 0; i < 3; i++) { const a = vs[i], b = vs[(i + 1) % 3]; const kk = [a, b].map(q => q.join(',')).sort().join('|'); lados.set(kk, (lados.get(kk) || 0) + 1); }
      }
      for (const [kk, c] of lados) if (c === 1) { const [a, b] = kk.split('|').map(t => P_(t.split(',').map(Number))); s += `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`; }
    }
    return SVG(2 * k * u + 40, k * u * R3 / 2 + 20, s);
  }
  // El mayor k con k² ≤ N y el perímetro de la figura semejante de lado k.
  function semejanza(d) { const k = Math.floor(Math.sqrt(d.N)); return { k, fichas: k * k, perimetro: k * FICHAS[d.ficha].per(d) }; }
  function armarSemejanza(d, rng, semilla) {
    const F = FICHAS[d.ficha], p1 = F.per(d), N = d.N, k = Math.floor(Math.sqrt(N));
    const correcta = k * p1;
    const errores = [
      h('RMP68-suma', N * p1, `Sumaste los perímetros de las ${N} fichas. Al juntarlas, los lados que se tocan quedan adentro y no son parte del contorno.`),
      pa('AR7-perimetro-como-area', k * k * p1, `Multiplicaste el perímetro por ${k * k}, que es lo que crece el área. Si la figura es ${k} veces más grande en cada lado, el perímetro crece ${k} veces.`),
      pa('AR7-todas-las-fichas', (k + 1) * p1, `Tomaste un lado ${k + 1} veces mayor: harían falta ${(k + 1) * (k + 1)} fichas y solo hay ${N}. Una figura semejante de lado k veces mayor usa k² fichas.`),
      h('RMP2-no-la-mayor', (k - 1) * p1, `Con ${(k - 1) * (k - 1)} fichas sí sale una figura semejante, pero no es la mayor: alcanzan para una de ${k} veces el lado.`),
    ];
    const alternativas = P.armar({ correcta, errores, rng }).map(a => ({ ...a, texto: a.texto + ' cm' }));
    if (alternativas.length < 4) return null;
    const lados = d.ficha === 'rectangulo' ? `${d.b} cm × ${d.a} cm` : d.ficha === 'triangulo' ? `${d.L} cm` : `${d.L}, ${d.L}, ${d.L} y ${2 * d.L} cm`;
    return {
      id: `rm-fichas#${semilla}`,
      variables: { N: { nombre: 'fichas', color: 'o' }, k: { nombre: 'veces el lado', color: 'i' }, p: { nombre: 'perímetro de una ficha', color: 'h' } },
      enunciado: ['Se tienen ', v('N', `${N} fichas`), ` iguales con forma de ${F.nombre} ${F.lados(d)}. Con algunas de ellas (o todas) se quiere armar, sin huecos ni superposiciones, la mayor figura posible semejante a una ficha.`],
      figura: { svg: figFicha(d, 1), alt: `Una ficha: ${F.nombre} ${F.lados(d)}.` },
      pregunta: ['¿Cuál es el perímetro de esa figura?'],
      datos: '', alternativas,
      solucion: [
        ['Una figura semejante con el lado ', v('k', 'k veces'), ' mayor tiene k² veces el área: usa k² fichas (1, 4, 9, 16, 25, …).'],
        ['El mayor cuadrado perfecto que no pasa de ', v('N', String(N)), ` es ${k * k} = ${k}², así que `, v('k', `k = ${k}`), ` (para k = ${k + 1} harían falta ${(k + 1) ** 2}).`],
        ['El perímetro de una ficha es ', v('p', `${p1} cm`), ` (${lados}); el de la figura grande es ${k} veces ese: `, v('k', String(k)), ' × ', v('p', String(p1)), ` = ${correcta} cm.`],
      ],
      figuraSolucion: { svg: figFicha(d, k), alt: `La figura grande: ${k} veces el lado de la ficha, armada con ${k * k} fichas.` },
      respuesta: { valor: correcta, unidad: 'cm' },
      _datos: d,
    };
  }

  // ---------- triángulos y hexágonos ----------
  const CACHE_H = new Map();
  function hmax(k) { // centros de hexágono: puntos interiores de la malla, sin dos vecinos
    if (CACHE_H.has(k)) return CACHE_H.get(k);
    const pts = []; for (let i = 2; i <= k - 1; i++) for (let j = 1; j <= i - 1; j++) pts.push([i, j]);
    const ady = (a, b) => { const di = b[0] - a[0], dj = b[1] - a[1]; return (di === 0 && Math.abs(dj) === 1) || (di === 1 && (dj === 0 || dj === 1)) || (di === -1 && (dj === 0 || dj === -1)); };
    let mejor = 0, mejorSel = []; const sel = [];
    const rec = i => { if (sel.length + (pts.length - i) <= mejor) return; if (i === pts.length) { mejor = sel.length; mejorSel = sel.slice(); return; } if (sel.every(s => !ady(pts[s], pts[i]))) { sel.push(i); rec(i + 1); sel.pop(); } rec(i + 1); };
    rec(0);
    const r = { max: mejor, centros: mejorSel.map(i => pts[i]) };
    CACHE_H.set(k, r);
    return r;
  }
  // Mayor k (triángulo de lado k) que se arma con t ≥ 1 triángulos y h ≥ 1 hexágonos, t ≤ T, h ≤ H.
  function hexagonos(T, H) {
    for (let k = 10; k >= 3; k--) {
      const hm = Math.min(H, hmax(k).max);
      for (let hh = hm; hh >= 1; hh--) { const t = k * k - 6 * hh; if (t >= 1 && t <= T) return { k, h: hh, t }; }
    }
    return null;
  }
  function construirHexagonos(rng, semilla) {
    for (let intento = 0; intento < 200; intento++) {
      const T = rng.entero(5, 40), H = rng.entero(2, 9), L = rng.entero(2, 5);
      const d = { tipo: 'hexagonos', T, H, L };
      const p = armarHexagonos(d, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function armarHexagonos(d, rng, semilla) {
    const { T, H, L } = d;
    const r = hexagonos(T, H);
    if (!r || r.k < 4) return null;
    const correcta = 3 * r.k * L;
    let kUno = 0; for (let k = 1; k * k <= T + H; k++) kUno = k; // hexágono como un triángulo
    const kArea = Math.floor(Math.sqrt(T + 6 * H));
    const errores = [
      h('RMP69-hexagono-como-uno', 3 * kUno * L, `Contaste cada hexágono como si fuera un triángulo. Un hexágono de lado ${L} cm equivale a 6 triángulos.`),
      h('RMP69-sin-encaje', 3 * kArea * L, `Juntaste toda el área (${T} + 6 × ${H} = ${T + 6 * H} triángulos) sin ver cuántos hexágonos caben de verdad en el triángulo: en el de lado ${kArea} caben a lo más ${hmax(kArea).max}.`),
      h('RMP68-suma', (3 * T + 6 * H) * L, 'Sumaste los perímetros de todas las fichas. Los lados que se tocan quedan adentro del triángulo grande.'),
      h('RMP2-no-la-mayor', 3 * (r.k - 1) * L, `Ese triángulo (de lado ${r.k - 1} veces el de una ficha) se puede armar, pero no es el mayor.`),
    ];
    const alternativas = P.armar({ correcta, errores, rng }).map(a => ({ ...a, texto: a.texto + ' cm' }));
    if (alternativas.length < 4) return null;
    // Figura: un triángulo y un hexágono.
    const u = 44;
    const tri = poligono([[40, 20], [40 - u / 2, 20 + u * R3 / 2], [40 + u / 2, 20 + u * R3 / 2]], 'fill:var(--c-o);fill-opacity:0.25');
    const hx = [0, 1, 2, 3, 4, 5].map(i => [180 + u * Math.cos(Math.PI / 3 * i), 20 + u * R3 / 2 + u * Math.sin(Math.PI / 3 * i)]);
    let fig = tri + poligono(hx, 'fill:var(--c-i);fill-opacity:0.25');
    for (let i = 0; i < 6; i++) fig += `<line x1="180" y1="${f2(20 + u * R3 / 2)}" x2="${f2(hx[i][0])}" y2="${f2(hx[i][1])}" stroke="currentColor" stroke-width="0.8" stroke-dasharray="3 3"/>`;
    fig += texto(40, 20 + u * R3 / 2 + 22, `${L} cm`, 15) + texto(180, 20 + u * R3 + 22, `lado ${L} cm`, 15);
    // Solución: el triángulo grande con los hexágonos puestos.
    const k = r.k, lado = 300 / k, Hh = lado * R3 / 2;
    const P_ = (i, j) => [20 + (k - i) * lado / 2 + j * lado, 10 + i * Hh]; // punto de la fila i (0 arriba), j de 0 a i
    let figS = poligono([P_(0, 0), P_(k, 0), P_(k, k)], 'fill:none', 2);
    for (let i = 1; i < k; i++) figS += `<line x1="${f2(P_(i, 0)[0])}" y1="${f2(P_(i, 0)[1])}" x2="${f2(P_(i, i)[0])}" y2="${f2(P_(i, i)[1])}" stroke="currentColor" stroke-width="0.6"/>`;
    for (let j = 1; j < k; j++) {
      figS += `<line x1="${f2(P_(j, 0)[0])}" y1="${f2(P_(j, 0)[1])}" x2="${f2(P_(k, k - j)[0])}" y2="${f2(P_(k, k - j)[1])}" stroke="currentColor" stroke-width="0.6"/>`;
      figS += `<line x1="${f2(P_(j, j)[0])}" y1="${f2(P_(j, j)[1])}" x2="${f2(P_(k, j)[0])}" y2="${f2(P_(k, j)[1])}" stroke="currentColor" stroke-width="0.6"/>`;
    }
    for (const [i, j] of hmax(k).centros.slice(0, r.h)) {
      const [cx, cy] = P_(i, j);
      figS += poligono([0, 1, 2, 3, 4, 5].map(q => [cx + lado * Math.cos(Math.PI / 3 * q + Math.PI / 6 * 0), cy + lado * Math.sin(Math.PI / 3 * q)]).map(([x, y], q) => [x, y]), 'fill:var(--c-i);fill-opacity:0.35', 1.5);
    }
    return {
      id: `rm-fichas#${semilla}`,
      variables: { t: { nombre: 'triángulos', color: 'o' }, x: { nombre: 'hexágonos', color: 'i' }, k: { nombre: 'veces el lado', color: 'h' } },
      enunciado: ['Se tienen ', v('t', `${T} fichas triangulares`), ' (triángulos equiláteros) y ', v('x', `${H} fichas hexagonales`), ` (hexágonos regulares), todas de ${L} cm de lado. Se quiere armar el mayor triángulo equilátero posible, sin huecos ni superposiciones, usando fichas de los dos tipos (no hace falta usarlas todas).`],
      figura: { svg: SVG(240, u * R3 + 50, fig), alt: `Una ficha triangular equilátera de ${L} cm de lado y una ficha hexagonal regular de ${L} cm de lado; líneas punteadas parten el hexágono en 6 triángulos iguales al de la ficha.` },
      pregunta: ['¿Cuál es el perímetro del mayor triángulo que se puede armar?'],
      datos: '', alternativas,
      solucion: [
        ['Un hexágono de lado ', `${L} cm`, ' son 6 triángulos de la ficha. Un triángulo de lado ', v('k', 'k'), ' veces el de la ficha tiene k² triangulitos.'],
        ['Pero los hexágonos no caben en cualquier cantidad: en el triángulo de lado k, los centros de los hexágonos son puntos de adentro de la malla, sin dos vecinos. ' + [3, 4, 5, 6, 7, 8].map(q => `Lado ${q}: hasta ${hmax(q).max}`).join('; ') + '.'],
        [`Con lado ${k} se usan ${r.h} hexágonos (${6 * r.h} triangulitos) y ${r.t} triángulos: ${6 * r.h} + ${r.t} = ${k * k} = ${k}². Con lado ${k + 1} no alcanza (harían falta ${(k + 1) ** 2} triangulitos con a lo más ${Math.min(H, hmax(k + 1).max)} hexágonos y ${T} triángulos).`],
        ['Perímetro: 3 × ', v('k', String(k)), ` × ${L} = ${correcta} cm.`],
      ],
      figuraSolucion: { svg: SVG(340, k * Hh + 20, figS), alt: `El triángulo de lado ${k} veces el de la ficha, con ${r.h} hexágonos y ${r.t} triángulos.` },
      respuesta: { valor: correcta, unidad: 'cm' },
      _datos: d,
    };
  }

  // =====================================================================
  // 2. Perímetro del contorno de fichas adosadas
  // =====================================================================
  // fichas: [[x, y, ancho, alto]] en cm enteros. Perímetro por aristas unitarias del contorno.
  function contorno(fichas) {
    const celdas = new Set();
    for (const [x, y, w, hh] of fichas) for (let i = 0; i < w; i++) for (let j = 0; j < hh; j++) { const k = `${x + i},${y + j}`; if (celdas.has(k)) return null; celdas.add(k); }
    let per = 0;
    for (const k of celdas) { const [x, y] = k.split(',').map(Number); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!celdas.has(`${x + dx},${y + dy}`)) per++; }
    // ¿Está todo unido?
    const lista = [...celdas], visto = new Set([lista[0]]), cola = [lista[0]];
    while (cola.length) { const [x, y] = cola.pop().split(',').map(Number); for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = `${x + dx},${y + dy}`; if (celdas.has(k) && !visto.has(k)) { visto.add(k); cola.push(k); } } }
    return visto.size === celdas.size ? per : null;
  }
  const toque = (A, B) => { // largo del lado común de dos rectángulos
    const [x1, y1, w1, h1] = A, [x2, y2, w2, h2] = B;
    const solX = Math.max(0, Math.min(x1 + w1, x2 + w2) - Math.max(x1, x2)), solY = Math.max(0, Math.min(y1 + h1, y2 + h2) - Math.max(y1, y2));
    if (x1 + w1 === x2 || x2 + w2 === x1) return solY;
    if (y1 + h1 === y2 || y2 + h2 === y1) return solX;
    return 0;
  };
  // La disposición sale de parámetros fijos (forma, n, s, m), así se puede rehacer con otro b.
  //   escalera: n fichas echadas, cada una sobre la anterior y corrida s cm a la derecha
  //   L: m echadas en fila sobre el piso y n − m paradas apiladas sobre el extremo izquierdo
  //   T: m echadas en fila y n − m paradas colgando debajo, centradas
  //   cruz: n fichas en fila alternando echada y parada; las paradas sobresalen lo mismo arriba y abajo
  function formaFichas(fp, a, b) {
    const { forma, n, s: corr, m } = fp, fs = [];
    if (forma === 'escalera') for (let i = 0; i < n; i++) fs.push([i * corr, i * a, b, a]);
    else if (forma === 'L') { for (let i = 0; i < m; i++) fs.push([i * b, 0, b, a]); for (let j = 0; j < n - m; j++) fs.push([0, a + j * b, a, b]); }
    else if (forma === 'T') { for (let i = 0; i < m; i++) fs.push([i * b, 0, b, a]); const x = (m * b - a) / 2; for (let j = 0; j < n - m; j++) fs.push([x, -(j + 1) * b, a, b]); }
    else { let x = 0; for (let i = 0; i < n; i++) { if (i % 2 === 0) { fs.push([x, 0, b, a]); x += b; } else { fs.push([x, -(b - a) / 2, a, b]); x += a; } } }
    if (fs.some(q => !Number.isInteger(q[0]) || !Number.isInteger(q[1]))) return null;
    const my = Math.min(...fs.map(q => q[1])), mx = Math.min(...fs.map(q => q[0]));
    return fs.map(([x, y, w, hh]) => [x - mx, y - my, w, hh]);
  }
  function textoForma(fp, A, B, a, b) {
    const { forma, n, s: corr, m } = fp;
    if (forma === 'escalera') return `${n} fichas echadas (el lado de ${B} horizontal), una encima de otra como una escalera; cada una está corrida ${corr} cm a la derecha respecto de la de abajo.`;
    if (forma === 'L') return `${m} fichas echadas en fila sobre el piso, unidas por sus lados cortos de ${A}; sobre el extremo izquierdo, ${n - m} ficha${n - m > 1 ? 's' : ''} parada${n - m > 1 ? 's' : ''} (el lado de ${B} vertical)${n - m > 1 ? ', una sobre otra,' : ''} alineada${n - m > 1 ? 's' : ''} con el borde izquierdo: forman una L.`;
    if (forma === 'T') return `${m} fichas echadas en fila arriba, unidas por sus lados cortos de ${A}; debajo del centro de esa fila, ${n - m} ficha${n - m > 1 ? 's' : ''} parada${n - m > 1 ? 's, una debajo de otra' : ''}, centrada${n - m > 1 ? 's' : ''}: forman una T.`;
    return `${n} fichas en una fila horizontal, alternando echada y parada, cada una pegada a la anterior; las paradas sobresalen lo mismo por arriba y por abajo de las echadas.`;
  }
  function construirContorno(rng, semilla) {
    for (let intento = 0; intento < 200; intento++) {
      const a = rng.entero(2, 5), b = a + 2 * rng.entero(1, 3) + (rng.moneda() ? 1 : 0);
      const pide = rng.sig() < 0.6 ? 'perimetro' : 'b';
      const forma = rng.elegir(pide === 'b' ? ['escalera', 'escalera', 'L', 'cruz'] : ['escalera', 'escalera', 'L', 'T', 'cruz']);
      const n = rng.entero(3, 5);
      const fp = { forma, n, s: forma === 'escalera' ? rng.entero(1, a + 1) : 0, m: forma === 'L' || forma === 'T' ? rng.entero(2, n - 1) : 0 };
      const fichas = formaFichas(fp, a, b);
      if (!fichas || contorno(fichas) === null) continue;
      const d = { tipo: 'contorno', ...fp, a, b, pide, P: contorno(fichas) };
      const p = armarContorno(d, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function figuraContorno(fichas, etiqueta) {
    const W = Math.max(...fichas.map(q => q[0] + q[2])), H = Math.max(...fichas.map(q => q[1] + q[3]));
    const esc = Math.min(320 / W, 220 / H);
    const X = x => 40 + x * esc, Y = y => 10 + (H - y) * esc;
    let s = '';
    fichas.forEach(([x, y, w, hh], i) => { s += `<rect x="${f2(X(x))}" y="${f2(Y(y + hh))}" width="${f2(w * esc)}" height="${f2(hh * esc)}" style="fill:var(--c-${i % 2 === 0 ? 'o' : 'i'});fill-opacity:0.2" stroke="currentColor" stroke-width="1.5"/>`; });
    const [x0, y0, w0, h0] = fichas[0];
    const largoAbajo = w0 > h0;
    const algoDebajo = fichas.some(([x, y, w]) => y + 0 < y0 && x < x0 + w0 && x + w > x0);
    s += texto(X(x0 + w0 / 2), algoDebajo ? Y(y0 + h0) - 6 : Y(y0) + 18, largoAbajo ? etiqueta.largo : etiqueta.corto, 14, `fill:var(--c-${largoAbajo ? 'h' : 'i'})`);
    s += texto(X(x0) - 18, Y(y0 + h0 / 2) + 5, largoAbajo ? etiqueta.corto : etiqueta.largo, 14, `fill:var(--c-${largoAbajo ? 'i' : 'h'})`);
    return SVG(W * esc + 60, H * esc + 34, `<g transform="translate(0,14)">${s}</g>`.replace('<g', '<g') ).replace(`viewBox="0 0 ${W * esc + 60} ${H * esc + 34}"`, `viewBox="0 0 ${W * esc + 60} ${H * esc + 48}"`);
  }
  // Perímetro de la misma disposición con largo bb, según cómo se calcule.
  function perimetroCon(d, bb, modo) {
    const fs = formaFichas(d, d.a, bb);
    if (!fs) return null;
    const n = fs.length, c = contorno(fs);
    if (c === null) return null;
    const ts = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const t = toque(fs[i], fs[j]); if (t) ts.push([i, j, t]); }
    const suma = n * 2 * (d.a + bb), st = ts.reduce((p, q) => p + q[2], 0);
    const lado = ts.reduce((p, [i, j]) => { const A = fs[i], B = fs[j]; const vert = A[0] + A[2] === B[0] || B[0] + B[2] === A[0]; return p + Math.min(vert ? A[3] : A[2], vert ? B[3] : B[2]); }, 0);
    const W = Math.max(...fs.map(q => q[0] + q[2])), H = Math.max(...fs.map(q => q[1] + q[3]));
    const r = { bien: c, suma, una: suma - st, lado: suma - 2 * lado, caja: 2 * (W + H), toques: ts.map(q => q[2]), st, W, H };
    return modo === 'todo' ? r : r[modo];
  }
  function armarContorno(d, rng, semilla) {
    const { a, b, pide, n } = d;
    const fichas = formaFichas(d, a, b);
    const T = perimetroCon(d, b, 'todo');
    let correcta, errores, pregunta, enunciado, etiqueta;
    if (pide === 'perimetro') {
      correcta = T.bien;
      errores = [
        h('RMP68-suma', T.suma, `Sumaste los perímetros de las ${n} fichas (${n} × ${2 * (a + b)} cm). Los tramos donde dos fichas se tocan quedan adentro: no son contorno.`),
        h('RMP68-una-vez', T.una, 'Restaste cada tramo donde se tocan dos fichas una sola vez. Ese tramo deja de ser borde en las dos fichas: se resta dos veces.'),
        h('RMP68-lado-entero', T.lado, 'Restaste el lado entero de cada ficha donde se tocan, pero algunas se tocan solo en una parte del lado.'),
        h('RMP68-caja', T.caja, `Tomaste el perímetro del rectángulo que encierra la figura (${T.W} × ${T.H}). La figura tiene entrantes que agregan bordes.`),
      ];
      etiqueta = { largo: `${b} cm`, corto: `${a} cm` };
      enunciado = [`Con ${n} fichas rectangulares iguales de `, v('a', `${a} cm`), ' por ', v('b', `${b} cm`), ' se arma la figura del dibujo, sin superponerlas.'];
      pregunta = ['¿Cuál es el perímetro del contorno de la figura?'];
    } else {
      correcta = b;
      const despeja = modo => { for (let bb = a + 1; bb <= 30; bb++) if (perimetroCon(d, bb, modo) === T.bien) return bb; return null; };
      errores = [
        ['RMP68-suma', 'Igualaste el perímetro a la suma de los perímetros de las fichas. Los tramos donde se tocan no son contorno.'],
        ['RMP68-una-vez', 'Restaste una sola vez cada tramo donde se tocan dos fichas; deja de ser borde en las dos, así que se resta dos veces.'],
        ['RMP68-lado-entero', 'Restaste el lado entero de cada ficha donde se tocan, pero algunas se tocan solo en una parte del lado.'],
        ['RMP68-caja', 'Igualaste el perímetro al del rectángulo que encierra la figura. La figura tiene entrantes que agregan bordes.'],
      ].map(([id, ex]) => { const bb = despeja({ 'RMP68-suma': 'suma', 'RMP68-una-vez': 'una', 'RMP68-lado-entero': 'lado', 'RMP68-caja': 'caja' }[id]); return bb ? h(id, bb, ex) : null; }).filter(Boolean);
      etiqueta = { largo: 'b', corto: `${a} cm` };
      enunciado = [`Con ${n} fichas rectangulares iguales de `, v('a', `${a} cm`), ' por ', v('b', 'b cm'), ` (b mayor que ${a}) se arma la figura del dibujo, sin superponerlas. El perímetro del contorno es `, v('P', `${T.bien} cm`), '.'];
      pregunta = ['¿Cuánto mide ', v('b', 'b'), '?'];
    }
    const alternativas = P.armar({ correcta, errores, rng }).map(x => ({ ...x, texto: x.texto + ' cm' }));
    if (alternativas.length < 4) return null;
    const A_ = `${a} cm`, B_ = pide === 'b' ? 'b' : `${b} cm`;
    const solucion = [
      [`Si las fichas estuvieran separadas, sus bordes sumarían ${n} × 2 × (${pide === 'b' ? `${a} + b` : `${a} + ${b}`}) cm${pide === 'b' ? '' : ` = ${T.suma} cm`}.`],
      [`Donde dos fichas se tocan, ese tramo deja de ser borde en las dos: se resta dos veces. Tramos de contacto${pide === 'b' ? ` (con b = ${b})` : ''}: ${T.toques.map(t => `${t} cm`).join(', ')}.`],
      pide === 'perimetro'
        ? ['Perímetro: ', `${T.suma} − 2 × ${T.st} = `, v('P', `${T.bien} cm`), '.']
        : [`Con b = ${b}: ${T.suma} − 2 × ${T.st} = `, v('P', `${T.bien} cm`), ', que es el dato (con otro b el perímetro cambia): ', v('b', `b = ${b} cm`), '.'],
    ];
    const coords = pide === 'perimetro' ? ` Coordenadas en cm (x hacia la derecha, y hacia arriba): ${fichas.map(([x, y, w, hh], i) => `ficha ${i + 1} de (${x}; ${y}) a (${x + w}; ${y + hh})`).join('; ')}.` : '';
    return {
      id: `rm-fichas#${semilla}`,
      variables: { a: { nombre: 'lado corto', color: 'i' }, b: { nombre: 'lado largo', color: 'h' }, P: { nombre: 'perímetro', color: 'o' } },
      enunciado, figura: { svg: figuraContorno(fichas, etiqueta), alt: `Fichas de ${A_} por ${B_}: ` + textoForma(d, A_, B_) + coords },
      pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad: 'cm' },
      _datos: d,
    };
  }

  // =====================================================================
  // 3. Cuadrados por puntos medios
  // =====================================================================
  // Cuadrado n de la sucesión (el 1 es el de lado L): lado L / √2^(n − 1), área L² / 2^(n − 1).
  function medios(L, n) { const lado = L / Math.SQRT2 ** (n - 1); return { lado, area: L * L / 2 ** (n - 1), perimetro: 4 * lado }; }
  function construirMedios(rng, semilla) {
    for (let intento = 0; intento < 100; intento++) {
      const L = rng.elegir([8, 12, 16, 20, 24, 32, 40]);
      const n = rng.entero(3, 6);
      const pide = rng.elegir(['area', 'area', 'perimetro', 'razon']);
      const d = { tipo: 'medios', L, n, pide };
      const p = armarMedios(d, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function armarMedios(d, rng, semilla) {
    const { L, n, pide } = d, m = n - 1;
    const pasos = k => `${k} ${k === 1 ? 'paso' : 'pasos'}`;
    const A1 = L * L, P1 = 4 * L, r2 = Math.SQRT2;
    let correcta, errores, texto_, unidad, pregunta;
    if (pide === 'area') {
      correcta = A1 / 2 ** m; unidad = 'cm²';
      errores = [
        pa('AR7-area-como-lado', A1 / 4 ** m, 'Dividiste el área entre 4 en cada paso, como si el lado se redujera a la mitad. El lado nuevo es la mitad de la diagonal: el área se reduce a la mitad.'),
        h('RMP1-pasos', A1 / 2 ** n, `Contaste ${pasos(n)}, pero del cuadrado 1 al ${n} hay ${m}: el cuadrado 1 es el inicial.`),
        h('RMP1-pasos', A1 / 2 ** (m - 1), `Contaste ${pasos(m - 1)}; del cuadrado 1 al ${n} hay ${m}.`),
        pa('AR7-raiz', A1 / r2 ** m, `Dividiste el área entre √2 en cada paso: eso le pasa al lado. El área se divide entre 2.`),
      ];
      texto_ = x => P.radical(x) + ' cm²';
      pregunta = [`¿Cuál es el área del cuadrado ${n}?`];
    } else if (pide === 'perimetro') {
      correcta = P1 / r2 ** m; unidad = 'cm';
      errores = [
        pa('AR7-mitad', P1 / 2 ** m, 'Dividiste el perímetro a la mitad en cada paso. Lo que se reduce a la mitad es el área; el lado (y el perímetro) se divide entre √2.'),
        h('RMP1-pasos', P1 / r2 ** n, `Contaste ${pasos(n)}, pero del cuadrado 1 al ${n} hay ${m}.`),
        h('RMP61-lado', L / r2 ** m, `Ese es el lado del cuadrado ${n}; el perímetro es 4 veces el lado.`),
        pa('AR7-area-como-lado', P1 / 4 ** m, 'Dividiste entre 4 en cada paso. El lado nuevo une puntos medios: es la mitad de la diagonal del anterior, o sea, el lado anterior entre √2.'),
      ];
      texto_ = x => P.radical(x) + ' cm';
      pregunta = [`¿Cuál es el perímetro del cuadrado ${n}?`];
    } else {
      correcta = r2 ** m; unidad = '';
      errores = [
        pa('AR7-mitad', 2 ** m, `Usaste 2 en cada paso: esa es la razón de las áreas. La de los perímetros es √2 por paso.`),
        h('RMP1-pasos', r2 ** n, `Contaste ${pasos(n)}; del cuadrado 1 al ${n} hay ${m}.`),
        h('RMP1-pasos', r2 ** (m - 1), `Contaste ${pasos(m - 1)}; del cuadrado 1 al ${n} hay ${m}.`),
        pa('AR7-area-como-lado', 4 ** m, 'Usaste 4 por paso, como si el lado se redujera a la mitad.'),
      ];
      texto_ = x => P.radical(x);
      pregunta = [`¿Cuál es la razón entre el perímetro del cuadrado 1 y el del cuadrado ${n}?`];
    }
    const alternativas = P.armar({ correcta, errores, rng, texto: texto_ });
    if (alternativas.length < 4) return null;
    const lado = k => L / r2 ** (k - 1);
    let fig = '', c = 150, s0 = 200;
    for (let k = 1; k <= Math.min(n, 6); k++) {
      const s = s0 / r2 ** (k - 1), rot = (k - 1) % 2 === 1;
      const pts = rot ? [[c, c - s / r2], [c + s / r2, c], [c, c + s / r2], [c - s / r2, c]] : [[c - s / 2, c - s / 2], [c + s / 2, c - s / 2], [c + s / 2, c + s / 2], [c - s / 2, c + s / 2]];
      fig += poligono(pts, k === n ? 'fill:var(--c-o);fill-opacity:0.25' : 'fill:none', 1.5);
    }
    fig += texto(150, 268, `${L} cm`, 15);
    return {
      id: `rm-fichas#${semilla}`,
      variables: { L: { nombre: 'lado inicial', color: 'i' }, r: { nombre: 'factor por paso', color: 'h' }, x: { nombre: 'respuesta', color: 'o' } },
      enunciado: ['Se dibuja un cuadrado de ', v('L', `${L} cm`), ' de lado (el cuadrado 1). Uniendo los puntos medios de sus lados se obtiene el cuadrado 2; uniendo los puntos medios de los lados del cuadrado 2, el cuadrado 3; y así sucesivamente.'],
      figura: { svg: SVG(300, 280, fig), alt: `Cuadrados encajados, cada uno con sus vértices en los puntos medios de los lados del anterior. El exterior mide ${L} cm de lado; el cuadrado ${n} está sombreado.` },
      pregunta, datos: '', alternativas,
      solucion: [
        ['El lado del cuadrado nuevo une dos puntos medios: es la mitad de la diagonal del anterior. Lado nuevo = lado ÷ ', v('r', '√2'), ', y el área se reduce a la mitad (el cuadrado nuevo es el anterior menos cuatro triángulos que suman la mitad).'],
        [`Del cuadrado 1 al ${n} hay ${m} pasos (el 1 es el inicial).`],
        pide === 'area' ? ['Área: ', v('L', `${L}`), `² ÷ 2^${m} = ${A1} ÷ ${2 ** m} = `, v('x', P.radical(correcta) + ' cm²'), '.']
          : pide === 'perimetro' ? ['Lado del cuadrado ', String(n), ': ', `${L} ÷ (√2)^${m} = ${P.radical(lado(n))} cm. Perímetro: 4 × ${P.radical(lado(n))} = `, v('x', P.radical(correcta) + ' cm'), '.']
            : ['Cada paso divide el perímetro entre ', v('r', '√2'), `: la razón es (√2)^${m} = `, v('x', P.radical(correcta)), '.'],
      ],
      respuesta: { valor: correcta, unidad },
      _datos: d,
    };
  }

  // =====================================================================
  // 4. El menor rectángulo con dos tipos de piezas
  // =====================================================================
  const PARES = [['D2', 'L3'], ['D2', 'T4'], ['D2', 'S4'], ['I3', 'L4'], ['I3', 'T4'], ['L3', 'I4'], ['L3', 'L4'], ['O4', 'T4'], ['I4', 'T4'], ['L4', 'T4'],
    ['T4', 'S4'], ['I3', 'P5'], ['I3', 'V5'], ['D2', 'P5'], ['L3', 'V5'], ['O4', 'L4'], ['I3', 'O4'], ['L3', 'T4'], ['L4', 'S4'], ['O4', 'P5']];
  function construirRectangulo(rng, semilla) {
    for (let intento = 0; intento < 60; intento++) {
      const piezas = rng.barajar(rng.elegir(PARES));
      const pide = rng.sig() < 0.6 ? 'area' : 'perimetro';
      const d = { tipo: 'rectangulo', piezas, pide };
      const p = armarRectangulo(d, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function armarRectangulo(d, rng, semilla) {
    const { piezas, pide } = d;
    const r = minRectangulo(piezas, pide);
    if (!r) return null;
    const a = piezas.map(t => PIEZAS[t].celdas.length);
    const correcta = pide === 'area' ? r.w * r.h : 2 * (r.w + r.h);
    const medida = (w, hh) => (pide === 'area' ? w * hh : 2 * (w + hh));
    const errores = [];
    // Solo mirando el área: la menor cantidad de cuadraditos m·a1 + n·a2 que forma algún rectángulo.
    let ingenuo = null;
    for (let A = a[0] + a[1]; A <= 60 && !ingenuo; A++) {
      let sePuede = false;
      for (let m = 1; m * a[0] < A; m++) if ((A - m * a[0]) % a[1] === 0) sePuede = true;
      if (!sePuede) continue;
      let mejor = null; for (let w = 2; w * w <= A; w++) if (A % w === 0) { const c = medida(w, A / w); if (mejor === null || c < mejor) mejor = c; }
      if (mejor !== null) ingenuo = pide === 'area' ? A : mejor;
    }
    if (ingenuo !== null) errores.push(h('RMP69-sin-encaje', ingenuo, 'Solo miraste que la cantidad de cuadraditos alcanzara para un rectángulo, sin comprobar que las piezas encajen en él.'));
    errores.push(h('RMP69-suma-areas', pide === 'area' ? a[0] + a[1] : 2 * (1 + a[0] + a[1]), pide === 'area' ? `Sumaste una pieza de cada tipo (${a[0]} + ${a[1]} cuadraditos), sin ver si forman un rectángulo.` : `Pusiste las dos piezas como si formaran una tira de 1 × ${a[0] + a[1]}.`));
    if (r.segundo) errores.push(h('RMP2-no-el-menor', medida(r.segundo.w, r.segundo.h), `El rectángulo de ${r.segundo.w} × ${r.segundo.h} también se arma, pero no es el ${pide === 'area' ? 'de menor área' : 'de menor perímetro'}.`));
    errores.push(h('RMP69-producto', pide === 'area' ? a[0] * a[1] : 2 * (a[0] + a[1]), pide === 'area' ? `Multiplicaste las áreas de las piezas (${a[0]} × ${a[1]}). Eso no dice si las piezas encajan.` : `Tomaste un rectángulo de ${a[0]} × ${a[1]} (multiplicando las áreas), sin comprobar que se arme.`));
    const alternativas = P.armar({ correcta, errores, rng }).map(x => ({ ...x, texto: x.texto + (pide === 'area' ? ' cuadraditos' : ' unidades') }));
    if (alternativas.length < 4) return null;
    const cp = 22;
    let fig = '';
    piezas.forEach((t, i) => { fig += dibujaPieza(PIEZAS[t].celdas, cp, 20 + i * 150, 14, COLORES[i]); fig += texto(20 + i * 150 + 50, 14 + 3 * cp + 24, `pieza ${'AB'[i]}`, 14, `fill:var(--c-${COLORES[i]})`); });
    let figS = '';
    const cs = Math.min(300 / r.w, 220 / r.h);
    r.teselas.forEach(q => { figS += q.celdas.map(([x, y]) => `<rect x="${f2(10 + x * cs)}" y="${f2(10 + y * cs)}" width="${f2(cs)}" height="${f2(cs)}" style="fill:var(--c-${COLORES[q.t]});fill-opacity:0.25" stroke="currentColor" stroke-width="0.5"/>`).join(''); });
    figS += bordesPiezas(r.teselas.map(q => q.celdas), cs, 10, 10);
    const cuenta = piezas.map((_, t) => r.teselas.filter(q => q.t === t).length);
    return {
      id: `rm-fichas#${semilla}`,
      variables: { A: { nombre: 'pieza A', color: 'o' }, B: { nombre: 'pieza B', color: 'i' }, x: { nombre: 'rectángulo', color: 'h' } },
      enunciado: ['Hay muchas piezas de dos tipos: la ', v('A', `pieza A (${PIEZAS[piezas[0]].nombre})`), ' y la ', v('B', `pieza B (${PIEZAS[piezas[1]].nombre})`), '. Se pueden girar y voltear. Se quiere cubrir un rectángulo exactamente, sin huecos ni superposiciones, usando al menos una pieza de cada tipo.'],
      figura: { svg: SVG(320, 3 * cp + 48, fig), alt: `Pieza A: ${PIEZAS[piezas[0]].nombre}, celdas (columna, fila) ${PIEZAS[piezas[0]].celdas.map(c => `(${c[0] + 1}; ${c[1] + 1})`).join(', ')}. Pieza B: ${PIEZAS[piezas[1]].nombre}, celdas ${PIEZAS[piezas[1]].celdas.map(c => `(${c[0] + 1}; ${c[1] + 1})`).join(', ')}. Cada celda es un cuadradito de 1 unidad de lado.` },
      pregunta: [pide === 'area' ? '¿Cuántos cuadraditos tiene el rectángulo más pequeño que se puede cubrir así?' : '¿Cuál es el menor perímetro posible de un rectángulo cubierto así? (cada cuadradito mide 1 unidad de lado)'],
      datos: '', alternativas,
      solucion: [
        [`La pieza A tiene ${a[0]} cuadraditos y la B, ${a[1]}. No basta con que la cuenta dé: las piezas tienen que encajar en el rectángulo.`],
        ['Probando los rectángulos de menor a mayor ' + (pide === 'area' ? 'área' : 'perímetro') + ', el primero que se puede cubrir es el de ', v('x', `${r.w} × ${r.h}`), `, con ${cuenta[0]} pieza${cuenta[0] > 1 ? 's' : ''} A y ${cuenta[1]} pieza${cuenta[1] > 1 ? 's' : ''} B.`],
        [pide === 'area' ? `Área: ${r.w} × ${r.h} = ` : `Perímetro: 2 × (${r.w} + ${r.h}) = `, v('x', String(correcta)), pide === 'area' ? ' cuadraditos.' : ' unidades.'],
      ],
      figuraSolucion: { svg: SVG(r.w * cs + 20, r.h * cs + 20, figS), alt: `Rectángulo de ${r.w} × ${r.h} cubierto con ${cuenta[0]} piezas A y ${cuenta[1]} piezas B: ` + r.teselas.map(q => `${'AB'[q.t]} en ${q.celdas.map(([x, y]) => `(${x + 1}; ${y + 1})`).join(' ')}`).join('; ') + '.' },
      respuesta: { valor: correcta, unidad: pide === 'area' ? 'cuadraditos' : 'unidades' },
      _datos: d,
    };
  }

  // =====================================================================
  // 5. Tiras en fila: el mayor perímetro
  // =====================================================================
  function construirLineal(rng, semilla) {
    for (let intento = 0; intento < 100; intento++) {
      const n = rng.entero(3, 6);
      const p = rng.entero(2, 6), q = rng.entero(2, 12);
      if (p === q) continue;
      const d = { tipo: 'lineal', W: n * p, H: q, n };
      const pr = armarLineal(d, rng, semilla);
      if (pr) return pr;
    }
    return null;
  }
  function armarLineal(d, rng, semilla) {
    const { W, H, n } = d, p = W / n, q = H;
    const corto = Math.min(p, q), largo = Math.max(p, q);
    const suma = n * 2 * (p + q);
    const correcta = suma - 2 * (n - 1) * corto;
    const errores = [
      h('RMP2-lado-largo', suma - 2 * (n - 1) * largo, 'Juntaste las tiras por el lado largo. Así se esconde más borde; para el mayor perímetro se juntan por el lado corto.'),
      h('RMP68-suma', suma, `Sumaste los perímetros de las ${n} tiras. Donde una toca a la siguiente, ese lado queda adentro en las dos.`),
      h('RMP68-una-vez', suma - (n - 1) * corto, 'Restaste cada lado de contacto una sola vez; deja de ser borde en las dos tiras que se tocan, así que se resta dos veces.'),
      h('RMP68-se-conserva', 2 * (W + H), 'Pensaste que el perímetro no cambia al cortar y reacomodar, como el área. El área se conserva; el perímetro no.'),
    ];
    const alternativas = P.armar({ correcta, errores, rng }).map(x => ({ ...x, texto: x.texto + ' cm' }));
    if (alternativas.length < 4) return null;
    const esc = Math.min(260 / W, 160 / H);
    let fig = `<rect x="20" y="10" width="${f2(W * esc)}" height="${f2(H * esc)}" style="fill:var(--c-o);fill-opacity:0.2" stroke="currentColor" stroke-width="1.5"/>`;
    for (let i = 1; i < n; i++) fig += `<line x1="${f2(20 + i * p * esc)}" y1="10" x2="${f2(20 + i * p * esc)}" y2="${f2(10 + H * esc)}" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    fig += texto(20 + W * esc / 2, 10 + H * esc + 20, `${W} cm`, 15) + texto(20 + W * esc + 26, 10 + H * esc / 2 + 5, `${H} cm`, 15);
    const esc2 = Math.min(320 / (n * largo), 100 / corto);
    let figS = '';
    for (let i = 0; i < n; i++) figS += `<rect x="${f2(10 + i * largo * esc2)}" y="10" width="${f2(largo * esc2)}" height="${f2(corto * esc2)}" style="fill:var(--c-o);fill-opacity:0.2" stroke="currentColor" stroke-width="1.5"/>`;
    return {
      id: `rm-fichas#${semilla}`,
      variables: { c: { nombre: 'lado corto de la tira', color: 'i' }, x: { nombre: 'perímetro máximo', color: 'o' } },
      enunciado: [`Un cartón rectangular de ${W} cm por ${H} cm se corta, por las líneas punteadas, en ${n} tiras iguales. Luego las tiras se ponen en fila, sin superponerse, cada una pegada a la siguiente por un lado completo.`],
      figura: { svg: SVG(W * esc + 70, H * esc + 34, fig), alt: `Rectángulo de ${W} cm de ancho por ${H} cm de alto, con ${n - 1} líneas punteadas verticales que lo parten en ${n} tiras de ${p} cm por ${q} cm.` },
      pregunta: ['¿Cuál es el mayor perímetro que puede tener la figura formada?'],
      datos: '', alternativas,
      solucion: [
        [`Cada tira mide ${p} cm por ${q} cm. Separadas, sus bordes suman ${n} × 2 × (${p} + ${q}) = ${suma} cm.`],
        [`Hay ${n - 1} contactos, y en cada uno se pierde dos veces el lado de contacto. Para perder lo menos, se juntan por el `, v('c', `lado corto (${corto} cm)`), '.'],
        [`Perímetro máximo: ${suma} − 2 × ${n - 1} × ${corto} = `, v('x', `${correcta} cm`), '.'],
      ],
      figuraSolucion: { svg: SVG(n * largo * esc2 + 20, corto * esc2 + 20, figS), alt: `Las ${n} tiras en fila, unidas por sus lados de ${corto} cm: forman un rectángulo de ${n * largo} cm por ${corto} cm.` },
      respuesta: { valor: correcta, unidad: 'cm' },
      _datos: d,
    };
  }

  // =====================================================================
  // 6. Barras en una caja
  // =====================================================================
  const BARRAS = [[1, 3], [2, 3], [1, 4], [2, 5], [3, 4], [2, 3], [3, 5], [1, 5]];
  function construirCajas(rng, semilla) {
    for (let intento = 0; intento < 300; intento++) {
      const [p, q] = rng.elegir(BARRAS);
      const W = rng.entero(Math.max(q, 4), 10), L = rng.entero(Math.max(q, 4), 9), H = rng.entero(2, 8);
      if (W * L > 70) continue;
      const d = { tipo: 'cajas', W, L, p, q, H };
      const pr = armarCajas(d, rng, semilla);
      if (pr) return pr;
    }
    return null;
  }
  function armarCajas(d, rng, semilla) {
    const { W, L, p, q, H } = d;
    const M = maxEmpaque(W, L, rectCeldas(p, q));
    const correcta = M.max;
    const area = Math.floor(W * L / (p * q)), uni = Math.max(Math.floor(W / p) * Math.floor(L / q), Math.floor(W / q) * Math.floor(L / p));
    if (area === correcta && uni === correcta && rng.sig() < 0.8) return null; // casi siempre con alguna trampa
    const errores = [
      h('RMP69-volumen', area, `Dividiste volúmenes (${W * L * H} ÷ ${p * q * H}) y te quedaste con la parte entera. Las barras no se pueden partir: hay que ver cuántas encajan.`),
      h('RMP2-una-orientacion', uni, 'Pusiste todas las barras en la misma dirección. Combinando barras echadas en un sentido y en el otro entran más.'),
      h('RMP2-sin-girar', Math.floor(W / p) * Math.floor(L / q), `Pusiste todas con el lado de ${p} cm a lo largo de los ${W} cm, sin probar a girarlas.`),
      h('RMP69-redondeo', Math.ceil(W * L / (p * q)), `Redondeaste hacia arriba la división de volúmenes (${W * L * H} ÷ ${p * q * H}). No puede entrar una barra incompleta.`),
    ];
    const alternativas = P.armar({ correcta, errores, rng }).map(x => ({ ...x, texto: x.texto + (x.valor === 1 ? ' barra' : ' barras') }));
    if (alternativas.length < 4) return null;
    const cs = Math.min(280 / W, 180 / L);
    let fig = `<rect x="20" y="10" width="${f2(W * cs)}" height="${f2(L * cs)}" style="fill:var(--card)" stroke="currentColor" stroke-width="2"/>`;
    fig += texto(20 + W * cs / 2, 10 + L * cs + 20, `${W} cm`, 15) + texto(20 + W * cs + 28, 10 + L * cs / 2 + 5, `${L} cm`, 15);
    fig += `<rect x="${f2(20 + W * cs + 80)}" y="10" width="${f2(p * cs)}" height="${f2(q * cs)}" style="fill:var(--c-o);fill-opacity:0.3" stroke="currentColor" stroke-width="1.5"/>`;
    fig += texto(20 + W * cs + 80 + p * cs / 2, 10 + q * cs + 18, `${p} × ${q} cm`, 14, 'fill:var(--c-o)');
    let figS = `<rect x="10" y="10" width="${f2(W * cs)}" height="${f2(L * cs)}" style="fill:var(--card)" stroke="currentColor" stroke-width="2"/>`;
    M.piezas.forEach((cel, i) => {
      const xs = cel.map(c => c[0]), ys = cel.map(c => c[1]);
      const x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0 + 1, hh = Math.max(...ys) - y0 + 1;
      figS += `<rect x="${f2(10 + x0 * cs)}" y="${f2(10 + y0 * cs)}" width="${f2(w * cs)}" height="${f2(hh * cs)}" style="fill:var(--c-${COLORES[i % 2]});fill-opacity:0.3" stroke="currentColor" stroke-width="1.2"/>`;
    });
    return {
      id: `rm-fichas#${semilla}`,
      variables: { x: { nombre: 'barras que caben', color: 'o' } },
      enunciado: [`En una caja sin tapa de ${W} cm de largo, ${L} cm de ancho y ${H} cm de alto se guardan barras de jabón de ${p} cm × ${q} cm × ${H} cm, de pie (con el lado de ${H} cm vertical, a la altura de la caja). Las barras no se cortan.`],
      figura: { svg: SVG(W * cs + 100 + Math.max(p * cs, 60) + 10, Math.max(L, q) * cs + 34, fig), alt: `Vista desde arriba: el fondo de la caja, un rectángulo de ${W} cm por ${L} cm, y al lado una barra vista desde arriba, de ${p} cm por ${q} cm.` },
      pregunta: ['¿Cuántas barras, como máximo, caben en la caja?'],
      datos: '', alternativas,
      solucion: [
        [`Como las barras tienen la altura de la caja, basta mirar el fondo: cuántos rectángulos de ${p} × ${q} caben en uno de ${W} × ${L}.`],
        [`Por área cabrían a lo más ${W * L} ÷ ${p * q} = ${f(W * L / (p * q))}, pero tienen que encajar. Todas en la misma dirección entran ${uni}.`],
        ['Probando todas las formas de acomodarlas (mezclando direcciones), el máximo es ', v('x', String(correcta)), '.'],
      ],
      figuraSolucion: { svg: SVG(W * cs + 20, L * cs + 20, figS), alt: `Una forma de acomodar ${correcta} barras en el fondo de ${W} × ${L}: ` + M.piezas.map(cel => { const xs = cel.map(c => c[0]), ys = cel.map(c => c[1]); return `de (${Math.min(...xs)}; ${Math.min(...ys)}) a (${Math.max(...xs) + 1}; ${Math.max(...ys) + 1})`; }).join(', ') + '.' },
      respuesta: { valor: correcta, unidad: 'barras' },
      _datos: d,
    };
  }

  // =====================================================================
  // 7. Fichas de tres cuadraditos en un tablero con casillas tapadas
  // =====================================================================
  function construirTablero(rng, semilla) {
    for (let intento = 0; intento < 300; intento++) {
      const r = rng.entero(4, 6), c = rng.entero(4, 6), nb = rng.entero(2, 5);
      const pieza = rng.elegir(['I3', 'L3']);
      const bloq = [];
      while (bloq.length < nb) { const z = [rng.entero(0, c - 1), rng.entero(0, r - 1)]; if (!bloq.some(([x, y]) => x === z[0] && y === z[1])) bloq.push(z); }
      bloq.sort((p, q) => p[1] - q[1] || p[0] - q[0]);
      const d = { tipo: 'tablero', r, c, bloqueadas: bloq, pieza };
      const pr = armarTablero(d, rng, semilla);
      if (pr) return pr;
    }
    return null;
  }
  function armarTablero(d, rng, semilla) {
    const { r, c, bloqueadas: bloq, pieza } = d;
    const cs = PIEZAS[pieza].celdas;
    const M = maxEmpaque(c, r, cs, bloq);
    const libres = r * c - bloq.length;
    const correcta = M.max;
    if (Math.floor(libres / 3) === correcta && rng.sig() < 0.75) return null; // casi siempre que no baste dividir
    const errores = [
      h('RMP69-dividir', Math.floor(libres / 3), `Dividiste las ${libres} casillas libres entre 3. Las fichas tienen forma: no siempre caben tantas.`),
      h('RMP63-sin-tapadas', maxEmpaque(c, r, cs, []).max, `Contaste como si el tablero de ${r} × ${c} no tuviera casillas tapadas.`),
      h('RMP2-voraz', voraz(c, r, cs, bloq), 'Fuiste poniendo fichas donde entraban, fila por fila, sin volver atrás. Reacomodando entran más.'),
      h('RMP69-redondeo', Math.ceil(libres / 3), `Redondeaste hacia arriba ${libres} ÷ 3. Una ficha no puede quedar incompleta.`),
    ];
    const alternativas = P.armar({ correcta, errores, rng }).map(x => ({ ...x, texto: x.texto + (x.valor === 1 ? ' ficha' : ' fichas') }));
    if (alternativas.length < 4) return null;
    const cp = Math.min(40, 240 / Math.max(r, c));
    const tap = (x, y) => bloq.some(([a, b]) => a === x && b === y);
    let fig = dibujaCuadricula(c, r, cp, 10, 10, (x, y) => (tap(x, y) ? 'fill:currentColor' : 'fill:var(--card)'));
    const altoF = Math.max(...cs.map(q => q[1])) + 1;
    fig += dibujaPieza(cs, cp, 10 + c * cp + 30, 10, 'o') + texto(10 + c * cp + 30 + 1.5 * cp, 10 + altoF * cp + 20, 'ficha', 14, 'fill:var(--c-o)');
    let figS = dibujaCuadricula(c, r, cp, 10, 10, (x, y) => (tap(x, y) ? 'fill:currentColor' : 'fill:var(--card)'));
    M.piezas.forEach((cel, i) => { figS += dibujaPieza(cel, cp, 10, 10, COLORES[i % 4]); });
    figS += bordesPiezas(M.piezas, cp, 10, 10);
    return {
      id: `rm-fichas#${semilla}`,
      variables: { x: { nombre: 'fichas', color: 'o' } },
      enunciado: [`En el tablero de ${r} filas y ${c} columnas, las casillas negras están tapadas. Se ponen fichas iguales a la del dibujo (${PIEZAS[pieza].nombre}), que se pueden girar, cada una cubriendo 3 casillas libres, sin superponerse.`],
      figura: { svg: SVG(c * cp + 40 + 3 * cp + 20, Math.max(r * cp, 3 * cp + 24) + 20, fig), alt: `Tablero de ${r} filas y ${c} columnas. Casillas tapadas (fila, columna): ${bloq.map(([x, y]) => `(${y + 1}, ${x + 1})`).join(', ')}. Al lado, la ficha: ${PIEZAS[pieza].nombre}.` },
      pregunta: ['¿Cuántas fichas, como máximo, se pueden poner?'],
      datos: '', alternativas,
      solucion: [
        [`Hay ${libres} casillas libres; por cuenta cabrían a lo más ${Math.floor(libres / 3)} fichas, pero la forma de la ficha y las casillas tapadas pueden dejar huecos que no se aprovechan.`],
        ['Probando todas las formas de acomodarlas, el máximo es ', v('x', String(correcta)), correcta < Math.floor(libres / 3) ? `: siempre quedan casillas sueltas donde no entra ninguna ficha.` : '.'],
      ],
      figuraSolucion: { svg: SVG(c * cp + 20, r * cp + 20, figS), alt: `Una forma de poner ${correcta} fichas: ` + M.piezas.map(cel => cel.map(([x, y]) => `(${y + 1}, ${x + 1})`).join(' ')).join('; ') + '.' },
      respuesta: { valor: correcta, unidad: 'fichas' },
      _datos: d,
    };
  }

  // =====================================================================
  // 8. Figuras con cuadrados de Fibonacci
  // =====================================================================
  const fib = n => { let a = 1, b = 1; for (let i = 2; i <= n; i++) [a, b] = [b, a + b]; return a; }; // fib(1) = fib(2) = 1
  function construirFibonacci(rng, semilla) {
    for (let intento = 0; intento < 50; intento++) {
      const d = { tipo: 'fibonacci', u: rng.entero(1, 3), n: rng.entero(7, 11), pide: rng.moneda() ? 'area' : 'perimetro' };
      const p = armarFibonacci(d, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function figuraFib(k, u0) { // cuadrados de la figura k, en espiral: derecha, arriba, izquierda, abajo
    const sq = [[0, 0, 1]]; let x0 = 0, y0 = 0, x1 = 1, y1 = 1;
    for (let i = 2; i <= k; i++) {
      const s = fib(i), dir = (i - 2) % 4;
      if (dir === 0) { sq.push([x1, y0, s]); x1 += s; } else if (dir === 1) { sq.push([x0, y1, s]); y1 += s; } else if (dir === 2) { sq.push([x0 - s, y0, s]); x0 -= s; } else { sq.push([x0, y0 - s, s]); y0 -= s; }
    }
    return { sq, x0, y0, x1, y1 };
  }
  function armarFibonacci(d, rng, semilla) {
    const { u, n, pide } = d;
    const area = k => fib(k) * fib(k + 1) * u * u, per = k => 2 * (fib(k) + fib(k + 1)) * u;
    const val = pide === 'area' ? area : per;
    const correcta = val(n);
    const lin = val(4) + (n - 4) * (val(4) - val(3));
    const errores = [
      pa('RM2-lineal', lin, `Supusiste que crece siempre igual que de la figura 3 a la 4 (${val(4) - val(3)} cada vez). Cada cuadrado nuevo es más grande que el anterior: crece cada vez más.`),
      h('RMP1-corrido', val(n - 1), `Esa es la figura ${n - 1}: la figura 1 ya tiene un cuadrado.`),
      pide === 'area' ? h('RMP61-ultimo', fib(n) ** 2 * u * u, `Ese es solo el cuadrado más grande de la figura ${n}; el área es la de todo el rectángulo.`)
        : h('RMP68-suma', 4 * u * Array.from({ length: n }, (_, i) => fib(i + 1)).reduce((a, b) => a + b, 0), 'Sumaste los perímetros de todos los cuadrados. Los lados que comparten quedan adentro del rectángulo.'),
      ent(n / 2) ? pa('RM2-objeto-entero', 2 * val(n / 2), `Duplicaste la figura ${n / 2} para la ${n}, como si fuera proporcional.`) : pa('RM2-objeto-entero', Math.round(n / 4 * val(4)), `Tomaste la figura 4 y la multiplicaste por ${f(n / 4)}, como si fuera proporcional.`),
    ];
    const alternativas = P.armar({ correcta, errores: errores.filter(e => ent(e.valor)), rng }).map(x => ({ ...x, texto: x.texto + (pide === 'area' ? ' cm²' : ' cm') }));
    if (alternativas.length < 4) return null;
    const px = 17;
    let fig = '', xoff = 10;
    for (let k = 1; k <= 4; k++) {
      const F = figuraFib(k);
      const W = (F.x1 - F.x0) * px;
      F.sq.forEach(([x, y, s], i) => { fig += `<rect x="${xoff + (x - F.x0) * px}" y="${10 + (F.y1 - y - s) * px}" width="${s * px}" height="${s * px}" style="fill:var(--c-${COLORES[i % 4]});fill-opacity:0.25" stroke="currentColor" stroke-width="1.2"/>`; });
      fig += texto(xoff + W / 2, 10 + 3 * px + 34, `Fig. ${k}`, 14);
      xoff += W + 26;
    }
    return {
      id: `rm-fichas#${semilla}`,
      variables: { a: { nombre: 'lados de los cuadrados', color: 'i' }, x: { nombre: 'respuesta', color: 'o' } },
      enunciado: ['Se arma una sucesión de figuras con cuadrados. La figura 1 es un cuadrado de ', `${u} cm`, ' de lado. Cada figura se obtiene de la anterior pegándole, en espiral, un cuadrado cuyo lado es el lado más largo de la figura anterior, como en el dibujo.'],
      figura: { svg: SVG(Math.min(420, xoff), 3 * px + 52, fig), alt: `Figura 1: un cuadrado de ${u} cm. Figura 2: dos cuadrados de ${u} cm lado a lado. Figura 3: se agrega un cuadrado de ${2 * u} cm (rectángulo de ${2 * u} cm × ${3 * u} cm). Figura 4: se agrega uno de ${3 * u} cm (rectángulo de ${3 * u} cm × ${5 * u} cm). Los lados de los cuadrados son 1, 1, 2, 3, … veces ${u} cm.` },
      pregunta: [pide === 'area' ? `¿Cuál es el área de la figura ${n}?` : `¿Cuál es el perímetro de la figura ${n}?`],
      datos: '', alternativas,
      solucion: [
        ['Los lados de los cuadrados son ', v('a', '1, 1, 2, 3, 5, 8, 13, …'), ` (cada uno es la suma de los dos anteriores), por ${u} cm.`],
        [`La figura k es un rectángulo cuyos lados son dos números seguidos de esa lista: la figura ${n} mide ${fib(n) * u} cm × ${fib(n + 1) * u} cm.`],
        [pide === 'area' ? `Área: ${fib(n) * u} × ${fib(n + 1) * u} = ` : `Perímetro: 2 × (${fib(n) * u} + ${fib(n + 1) * u}) = `, v('x', `${correcta} ${pide === 'area' ? 'cm²' : 'cm'}`), '.'],
      ],
      respuesta: { valor: correcta, unidad: pide === 'area' ? 'cm²' : 'cm' },
      _datos: d,
    };
  }

  // =====================================================================
  // 9. Recorrido por todos los puntos de una malla triangular
  // =====================================================================
  // Puntos (fila i de 1 a n, j de 1 a i); vecinos: (i, j±1), (i+1, j), (i+1, j+1), (i−1, j−1), (i−1, j).
  function malla(n) {
    const puntos = n * (n + 1) / 2, segmentos = 3 * (n - 1) * n / 2;
    // Camino en zigzag: fila 1; fila 2 de izquierda a derecha; fila 3 de derecha a izquierda; …
    const camino = [];
    for (let i = 1; i <= n; i++) { const fila = Array.from({ length: i }, (_, k) => [i, k + 1]); camino.push(...(i % 2 === 0 ? fila : fila.reverse())); }
    return { puntos, segmentos, pasos: puntos - 1, camino };
  }
  function construirMalla(rng, semilla) {
    for (let intento = 0; intento < 50; intento++) {
      const d = { tipo: 'malla', n: rng.entero(6, 25), t: rng.elegir([1, 2, 3, 5]) };
      const p = armarMalla(d, rng, semilla);
      if (p) return p;
    }
    return null;
  }
  function armarMalla(d, rng, semilla) {
    const { n, t } = d, M = malla(n);
    const correcta = M.pasos * t;
    const f3 = 5, f4 = 9; // con 3 y 4 filas
    const errores = [
      h('RMP1-puntos', M.puntos * t, `Contaste los puntos (${M.puntos}) en vez de los tramos: para pasar por ${M.puntos} puntos bastan ${M.puntos - 1} tramos.`),
      h('RMP1-todos-los-tramos', M.segmentos * t, `Contaste todos los segmentos de la malla (${M.segmentos}). No hace falta recorrerlos todos, solo pasar por todos los puntos.`),
      pa('RM2-lineal', (f4 + (n - 4) * (f4 - f3)) * t, `Supusiste que cada fila nueva agrega lo mismo que la cuarta (${f4 - f3} tramos). Cada fila agrega un punto más que la anterior.`),
      h('RMP1-filas', (M.puntos - n) * t, `Restaste un tramo por fila (${n}); solo se resta 1 en total: la hormiga empieza en un punto y cada tramo la lleva a uno nuevo.`),
    ];
    const alternativas = P.armar({ correcta, errores, rng }).map(x => ({ ...x, texto: x.texto + ' s' }));
    if (alternativas.length < 4) return null;
    const dibuja = (k, x0, y0, l, conCamino) => {
      const pos = (i, j) => [x0 + (j - 1) * l - (i - 1) * l / 2, y0 + (i - 1) * l * R3 / 2];
      let s = '';
      for (let i = 1; i <= k; i++) for (let j = 1; j <= i; j++) {
        const [x, y] = pos(i, j);
        for (const [a, b] of [[i, j + 1], [i + 1, j], [i + 1, j + 1]]) if (a <= k && b <= a) { const [x2, y2] = pos(a, b); s += `<line x1="${f2(x)}" y1="${f2(y)}" x2="${f2(x2)}" y2="${f2(y2)}" stroke="currentColor" stroke-width="1" style="stroke-opacity:0.5"/>`; }
      }
      if (conCamino) { const c = malla(k).camino.map(([i, j]) => pos(i, j)); s += `<polyline points="${c.map(([x, y]) => `${f2(x)},${f2(y)}`).join(' ')}" style="fill:none;stroke:var(--c-o)" stroke-width="3"/>`; }
      for (let i = 1; i <= k; i++) for (let j = 1; j <= i; j++) { const [x, y] = pos(i, j); s += `<circle cx="${f2(x)}" cy="${f2(y)}" r="5" style="fill:currentColor"/>`; }
      return s;
    };
    return {
      id: `rm-fichas#${semilla}`,
      variables: { N: { nombre: 'puntos', color: 'i' }, x: { nombre: 'tiempo mínimo', color: 'o' } },
      enunciado: [`En una malla triangular hay ${n} filas de puntos: 1 punto en la primera, 2 en la segunda, …, ${n} en la última. Cada punto está unido por segmentos de 1 m con sus vecinos (el dibujo muestra una malla de 4 filas). Una hormiga camina por los segmentos y tarda ${t} s en cada uno.`],
      figura: { svg: SVG(240, 165, dibuja(4, 120, 20, 50, false)), alt: 'Ejemplo de malla triangular de 4 filas: 1, 2, 3 y 4 puntos, cada punto unido con sus vecinos de la misma fila y de las filas de arriba y de abajo, formando triangulitos.' },
      pregunta: [`¿Cuál es el menor tiempo para que la hormiga pase por todos los puntos de la malla de ${n} filas, empezando en el punto de arriba?`],
      datos: '', alternativas,
      solucion: [
        ['La malla tiene ', v('N', `1 + 2 + … + ${n} = ${M.puntos} puntos`), '.'],
        [`Cada tramo lleva a lo más a un punto nuevo, y se empieza ya en uno: hacen falta al menos ${M.puntos} − 1 = ${M.pasos} tramos.`],
        ['Se puede con exactamente esos tramos, en zigzag: se baja a la fila siguiente por el extremo y se la recorre entera, alternando el sentido (el dibujo de la solución lo muestra con 4 filas).'],
        [`Tiempo: ${M.pasos} × ${t} s = `, v('x', `${correcta} s`), '.'],
      ],
      figuraSolucion: { svg: SVG(240, 165, dibuja(4, 120, 20, 50, true)), alt: 'La malla de 4 filas con el recorrido en zigzag: el punto de arriba, la fila 2 de izquierda a derecha, la fila 3 de derecha a izquierda y la fila 4 de izquierda a derecha; 9 tramos para 10 puntos.' },
      respuesta: { valor: correcta, unidad: 's' },
      _datos: d,
    };
  }

  // =====================================================================
  const TIPOS = { semejanza: construirSemejanza, hexagonos: construirHexagonos, contorno: construirContorno, medios: construirMedios, rectangulo: construirRectangulo,
    lineal: construirLineal, cajas: construirCajas, tablero: construirTablero, fibonacci: construirFibonacci, malla: construirMalla };
  const SORTEO = ['semejanza', 'semejanza', 'hexagonos', 'contorno', 'contorno', 'medios', 'rectangulo', 'lineal', 'cajas', 'tablero', 'fibonacci', 'malla'];
  function generar(semilla) {
    const rng = Azar.crear('rm-fichas|' + semilla);
    const tipo = rng.elegir(SORTEO);
    for (let intento = 0; intento < 20; intento++) {
      const p = TIPOS[tipo](rng, semilla);
      if (p && p.alternativas.length >= 4) return p;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  return {
    id: 'rm-fichas', titulo: 'Fichas, piezas y figuras que crecen', generar,
    calc: { semejanza, medios, orientaciones, embaldosar, minRectangulo, maxEmpaque, voraz, hmax, hexagonos, contorno, formaFichas, perimetroCon, trapecioTeselado, malla, fib, PIEZAS },
  };
});
