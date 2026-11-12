/*
 * Generador: el menor número de movimientos (cruces de río, caballo de ajedrez, saltos en una fila,
 * bolas en un tubo y fichas que se mueven de a dos). Formato "predicciones" (docs/arquitectura.md).
 * Funciona en el navegador (window.Generadores['rm-movimientos']) y en Node (require). No usa motor.
 * Cada respuesta se calcula por búsqueda en anchura sobre los estados del juego.
 *
 * Tipos y sus _datos:
 *   canoa    { tipo, modo: 'peso' | 'cupo', gente: [{ nombre, peso?, rema }], limite?, cupo?, choques: [[i, j]] }
 *            todos empiezan en una orilla; la canoa cruza con al menos uno que reme; 'peso': la suma de
 *            pesos no pasa del límite; 'cupo': a lo más «cupo» a bordo. choques: pares que no pueden
 *            quedar en una orilla sin una persona. Cada cruce (de ida o de vuelta) es un viaje.
 *   caballo  { tipo, filas, columnas, A: [c, f], B: [c, f], C: [c, f] | null, bloqueadas: [[c, f]] }
 *            menor número de saltos de caballo de A a B (pasando por C si la hay), sin caer en las
 *            casillas bloqueadas. Casillas como en ajedrez: columna con letra, fila con número desde abajo.
 *   salto    { tipo, modo: 'dos-saltos' | 'avanza-retrocede', n, p, q, s, t }
 *            fila de casillas 1..n; con 'dos-saltos' la ficha salta exactamente p o q casillas hacia
 *            cualquier lado; con 'avanza-retrocede', avanza p o retrocede q. Nunca sale de la fila.
 *   tubo     { tipo, bocas: 1 | 2, inicio: [..], meta: [..] } bolas numeradas en un tubo; un movimiento es
 *            sacar una bola por una boca y dejarla en la mesa, o meter una bola de la mesa por una boca.
 *            Con 2 bocas el tubo está acostado (izquierda y derecha); con 1, es un tubo de ensayo (arriba).
 *   pares    { tipo, meta: 'alternar' | 'separar', n, L, inicio: 'BBNN..' } fila de L casillas con n fichas
 *            blancas y n negras; un movimiento lleva dos fichas vecinas, sin cambiar su orden, a dos
 *            casillas vecinas vacías. Meta: fichas en casillas seguidas, alternadas o separadas por color.
 *
 * calc: minimo(d) → { n, camino: [estados], movs: [..] }; relajado(d, cambio) → mínimo con una regla
 *       cambiada (lo usan los errores); y por tipo: canoa, caballo, salto, tubo, pares (→ { n }).
 *
 * Errores (todos hipótesis):
 *   RMP1-estados        contar las posiciones o casillas pisadas (incluida la de salida) en vez de los movimientos
 *   RMP2-*              quedarse con la primera estrategia que funciona (un solo remero, sacar todas las bolas)
 *   RMP11-con-huecos    detenerse con las fichas alternadas pero con huecos entre ellas
 *   RMP14-sin-regresos  olvidar los viajes de regreso de la canoa; RMP14-regreso-final: contar uno de más
 *   RMP15-*             pasar por alto una restricción: el que no rema vuelve solo, los choques, la casilla
 *                       bloqueada, la boca cerrada
 *   RMP16-distancia     dividir la distancia entre lo que avanza cada salto, sin ver el camino real
 *   RMP17-directo       ir directo, sin pasar por la casilla intermedia
 *   RMP18-*             contar fichas o bolas movidas (o sacar y meter como un solo movimiento)
 *   RMP19-bordes        olvidar los bordes del tablero o de la fila
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
  const LET = 'abcdefgh';
  const casilla = ([c, f]) => LET[c] + (f + 1);
  const lista = a => (a.length === 1 ? String(a[0]) : a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1]);

  // Búsqueda en anchura genérica: vecinos(e) → [{ estado, mov }]; clave(e) → texto.
  function bfs(inicio, vecinos, esMeta, clave = e => JSON.stringify(e), tope = 400000) {
    const info = new Map([[clave(inicio), { padre: null, mov: null, estado: inicio }]]);
    let capa = [inicio], d = 0;
    while (capa.length) {
      for (const e of capa) if (esMeta(e)) {
        const camino = [], movs = []; let k = clave(e);
        while (k !== null) { const it = info.get(k); camino.unshift(it.estado); if (it.mov !== null) movs.unshift(it.mov); k = it.padre; }
        return { n: d, camino, movs };
      }
      const sig = [];
      for (const e of capa) {
        const ke = clave(e);
        for (const { estado, mov } of vecinos(e)) {
          const k = clave(estado);
          if (info.has(k)) continue;
          info.set(k, { padre: ke, mov, estado }); sig.push(estado);
        }
      }
      if (info.size > tope) return null;
      capa = sig; d++;
    }
    return null;
  }

  // ---------------- Canoa ----------------
  // Estado: [máscara de los que están en la orilla de salida, lado de la canoa (0 salida, 1 llegada)].
  function canoaReglas(d, cambio = {}) {
    const N = d.gente.length, todos = (1 << N) - 1;
    const rema = i => cambio.todosReman || d.gente[i].rema;
    // En las orillas cuida una persona; si guarda es 'campesino', solo él (la hija no impone respeto).
    const persona = i => d.gente[i].rema && (cambio.cuidaCualquiera || d.guarda !== 'campesino' || i === 0);
    const valida = m => {
      if (cambio.sinChoques) return true;
      for (const lado of [m, todos & ~m]) {
        if ([...Array(N).keys()].some(i => lado >> i & 1 && persona(i))) continue;
        if (d.choques.some(([a, b]) => lado >> a & 1 && lado >> b & 1)) return false;
      }
      return true;
    };
    const vecinos = ([m, lado]) => {
      const aca = lado === 0 ? m : todos & ~m, out = [];
      for (let S = aca; S > 0; S = (S - 1) & aca) {
        const ids = [...Array(N).keys()].filter(i => S >> i & 1);
        if (!ids.some(rema)) continue;
        if (cambio.remero !== undefined && !(S >> cambio.remero & 1)) continue;
        if (d.modo === 'cupo' && ids.length > d.cupo) continue;
        if (d.modo === 'peso' && ids.reduce((s, i) => s + d.gente[i].peso, 0) > d.limite) continue;
        const nm = lado === 0 ? m & ~S : m | S;
        if (!valida(nm)) continue;
        out.push({ estado: [nm, 1 - lado], mov: ids });
      }
      // Primero los viajes con menos pasajeros que no reman y con menos gente: así la ruta mostrada no pasea al perro.
      const costo = ids => 10 * ids.filter(i => !d.gente[i].rema).length + ids.length;
      return out.sort((x, y) => costo(x.mov) - costo(y.mov));
    };
    return { inicio: [todos, 0], vecinos, meta: ([m, lado]) => m === 0 && lado === 1, clave: e => e.join(',') };
  }
  const canoa = (d, cambio) => { const r = canoaReglas(d, cambio); return bfs(r.inicio, r.vecinos, r.meta, r.clave); };

  // ---------------- Caballo ----------------
  const SALTOS = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]];
  function caballoTramo(d, de, a, cambio = {}) {
    const libre = (c, f) => (cambio.sinBordes || (c >= 0 && f >= 0 && c < d.columnas && f < d.filas)) &&
      (cambio.sinBloqueo || !d.bloqueadas.some(([x, y]) => x === c && y === f));
    const lim = cambio.sinBordes ? 12 : 99;
    return bfs(de, ([c, f]) => SALTOS.filter(([dc, df]) => libre(c + dc, f + df) && Math.abs(c + dc) < 20 && Math.abs(f + df) < 20)
      .map(([dc, df]) => ({ estado: [c + dc, f + df], mov: [c + dc, f + df] })), ([c, f]) => c === a[0] && f === a[1], e => e.join(','), lim * 1000);
  }
  function caballo(d, cambio = {}) {
    if (!d.C || cambio.directo) return caballoTramo(d, d.A, d.B, cambio);
    const t1 = caballoTramo(d, d.A, d.C, cambio), t2 = caballoTramo(d, d.C, d.B, cambio);
    if (!t1 || !t2) return null;
    return { n: t1.n + t2.n, camino: t1.camino.concat(t2.camino.slice(1)), movs: t1.movs.concat(t2.movs), tramos: [t1.n, t2.n] };
  }

  // ---------------- Salto en una fila ----------------
  function salto(d, cambio = {}) {
    const pasos = d.modo === 'dos-saltos' ? [d.p, -d.p, d.q, -d.q] : [d.p, -d.q];
    const dentro = x => cambio.sinBordes ? x > -60 && x < d.n + 60 : x >= 1 && x <= d.n;
    return bfs(d.s, x => pasos.filter(k => dentro(x + k)).map(k => ({ estado: x + k, mov: k })), x => x === d.t, String);
  }

  // ---------------- Tubo ----------------
  // Estado: { t: bolas en el tubo (de izquierda a derecha, o de arriba hacia abajo), m: bolas en la mesa }.
  function tubo(d, cambio = {}) {
    const bocas = cambio.dosBocas ? 2 : d.bocas;
    const clave = e => e.t.join('') + '|' + e.m.slice().sort().join('');
    const vecinos = ({ t, m }) => {
      const out = [];
      if (t.length) {
        out.push({ estado: { t: t.slice(1), m: m.concat(t[0]) }, mov: { sacar: t[0], boca: 0 } });
        if (bocas === 2 && t.length > 1) out.push({ estado: { t: t.slice(0, -1), m: m.concat(t[t.length - 1]) }, mov: { sacar: t[t.length - 1], boca: 1 } });
      }
      for (const b of new Set(m)) {
        const resto = m.slice(); resto.splice(resto.indexOf(b), 1);
        out.push({ estado: { t: [b].concat(t), m: resto }, mov: { meter: b, boca: 0 } });
        if (bocas === 2 && t.length) out.push({ estado: { t: t.concat(b), m: resto }, mov: { meter: b, boca: 1 } });
      }
      return out;
    };
    return bfs({ t: d.inicio.slice(), m: [] }, vecinos, e => e.m.length === 0 && e.t.join('') === d.meta.join(''), clave);
  }

  // ---------------- Fichas de a dos ----------------
  function paresMeta(meta, n) {
    return s => {
      const a = s.indexOf('B') < s.indexOf('N') ? s.indexOf('B') : s.indexOf('N');
      const bloque = s.replace(/^_+|_+$/g, '');
      if (meta === 'alternar') return bloque.length === 2 * n && !/BB|NN|_/.test(bloque);
      if (meta === 'alternar-con-huecos') { const f = s.replace(/_/g, ''); return !/BB|NN/.test(f) && a >= 0; }
      return bloque.length === 2 * n && /^(B+N+|N+B+)$/.test(bloque);
    };
  }
  function pares(d, cambio = {}) {
    const extra = cambio.sinBordes ? 4 : 0;
    const ini = '_'.repeat(extra) + d.inicio + '_'.repeat(extra);
    const vecinos = s => {
      const out = [];
      for (let i = 0; i + 1 < s.length; i++) {
        if (s[i] === '_' || s[i + 1] === '_') continue;
        const par = s[i] + s[i + 1], sin = s.slice(0, i) + '__' + s.slice(i + 2);
        for (let j = 0; j + 1 < sin.length; j++) {
          if (j === i || sin[j] !== '_' || sin[j + 1] !== '_') continue;
          if (Math.abs(j - i) < 2) continue; // deslizar sobre sí mismo no es llevar a casillas vacías
          out.push({ estado: sin.slice(0, j) + par + sin.slice(j + 2), mov: [i + 1 - extra, j + 1 - extra] });
        }
      }
      return out;
    };
    return bfs(ini, vecinos, paresMeta(cambio.meta || d.meta, d.n), String);
  }

  function minimo(d) {
    if (d.tipo === 'canoa') return canoa(d);
    if (d.tipo === 'caballo') return caballo(d);
    if (d.tipo === 'salto') return salto(d);
    if (d.tipo === 'tubo') return tubo(d);
    return pares(d);
  }
  function relajado(d, cambio) {
    const f = { canoa, caballo, salto, tubo, pares }[d.tipo];
    const r = f(d, cambio);
    return r ? r.n : NaN;
  }

  // ---------------- Figuras ----------------
  const svgAbre = (w, hgt) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${hgt}" font-size="15" fill="currentColor">`;
  function figuraLista(titulo, filas) {
    const alto = 34 + 22 * filas.length;
    let s = svgAbre(380, alto) + `<text x="10" y="20" font-weight="bold">${P.xml(titulo)}</text>`;
    filas.forEach((f, i) => { s += `<text x="10" y="${44 + 22 * i}" font-size="14">${P.xml(f)}</text>`; });
    return s + '</svg>';
  }
  function figuraCanoa(d) {
    const N = d.gente.length, alto = 50 + 24 * N;
    let s = svgAbre(380, alto);
    s += `<rect x="205" y="10" width="50" height="${alto - 20}" style="fill:var(--c-i);fill-opacity:.18"/>`;
    s += `<text x="230" y="30" text-anchor="middle" font-size="13" style="fill:var(--muted)">río</text>`;
    s += `<text x="10" y="24" font-weight="bold">salida</text><text x="370" y="24" text-anchor="end" font-weight="bold">llegada</text>`;
    d.gente.forEach((g, i) => {
      const t = g.nombre.replace(/^(el|la) /, '') + (g.peso ? ` (${g.peso} kg)` : '') + (g.rema ? '' : ' *');
      s += `<text x="10" y="${50 + 24 * i}"${g.rema || d.modo === 'cupo' ? '' : ' style="fill:var(--c-h)"'}>${P.xml(t)}</text>`;
    });
    s += `<path d="M208 ${alto - 34} h40 l-6 10 h-28 z" fill="none" stroke="currentColor" stroke-width="2"/>`;
    s += `<text x="262" y="${alto - 22}" font-size="13" style="fill:var(--c-o)">${P.xml(d.modo === 'peso' ? `canoa: ${d.limite} kg` : `canoa: ${d.cupo} a la vez`)}</text>`;
    s += `<text x="262" y="${alto - 6}" font-size="13" style="fill:var(${d.modo === 'cupo' ? '--muted' : '--c-h'})">${P.xml('* no rema')}</text>`;
    return s + '</svg>';
  }
  function figuraTablero(d, camino) {
    const t = Math.min(40, Math.floor(300 / Math.max(d.columnas, d.filas))), x0 = 30, y0 = 10;
    const W = x0 + t * d.columnas + 10, H = y0 + t * d.filas + 30;
    let s = svgAbre(Math.max(W, 300), H);
    for (let c = 0; c < d.columnas; c++) for (let f = 0; f < d.filas; f++) {
      const x = x0 + c * t, y = y0 + (d.filas - 1 - f) * t;
      s += `<rect x="${x}" y="${y}" width="${t}" height="${t}" style="fill:${(c + f) % 2 ? 'var(--card)' : 'var(--line)'};stroke:var(--muted)" stroke-width="1"/>`;
    }
    const centro = ([c, f]) => [x0 + c * t + t / 2, y0 + (d.filas - 1 - f) * t + t / 2];
    for (let c = 0; c < d.columnas; c++) s += `<text x="${x0 + c * t + t / 2}" y="${H - 10}" text-anchor="middle" font-size="14" style="fill:var(--muted)">${LET[c]}</text>`;
    for (let f = 0; f < d.filas; f++) s += `<text x="${x0 - 12}" y="${y0 + (d.filas - 1 - f) * t + t / 2 + 5}" text-anchor="middle" font-size="14" style="fill:var(--muted)">${f + 1}</text>`;
    for (const b of d.bloqueadas) { const [x, y] = centro(b); s += `<path d="M${x - t / 3} ${y - t / 3} L${x + t / 3} ${y + t / 3} M${x + t / 3} ${y - t / 3} L${x - t / 3} ${y + t / 3}" stroke="currentColor" stroke-width="2.5"/>`; }
    if (camino) {
      const marcas = new Map();
      camino.forEach((e, i) => { if (i === 0) return; const k = e.join(); marcas.set(k, (marcas.get(k) || []).concat(i)); });
      for (const [k, nums] of marcas) { const [x, y] = centro(k.split(',').map(Number)); s += `<text x="${x}" y="${y + 5}" text-anchor="middle" font-size="${nums.length > 1 ? 12 : 14}" font-weight="bold" style="fill:var(--c-d)">${P.xml(nums.join(','))}</text>`; }
    }
    const marca = (p, letra, col) => { if (!p) return; const [x, y] = centro(p); s += `<circle cx="${x}" cy="${y}" r="${t * 0.38}" fill="none" stroke-width="2.5" style="stroke:var(--c-${col})"/>`; if (!camino || letra === 'A') s += `<text x="${x}" y="${y + 5}" text-anchor="middle" font-weight="bold" style="fill:var(--c-${col})">${letra}</text>`; };
    marca(d.A, 'A', 'o'); marca(d.B, 'B', 'i'); marca(d.C, 'C', 'h');
    return s + '</svg>';
  }
  function figuraFila(d) {
    const t = 22, W = Math.max(300, t * d.n + 20);
    let s = svgAbre(W, 90);
    for (let i = 1; i <= d.n; i++) {
      const x = 10 + (i - 1) * t;
      s += `<rect x="${x}" y="20" width="${t}" height="${t}" fill="none" style="stroke:var(--muted)"/>`;
      s += `<text x="${x + t / 2}" y="${20 + t + 20}" text-anchor="middle" font-size="${i > 9 ? 13 : 15}" style="fill:var(--muted)">${i}</text>`;
      if (i === d.s) s += `<circle cx="${x + t / 2}" cy="${20 + t / 2}" r="${t * 0.35}" style="fill:var(--c-h)"/>`;
      if (i === d.t) s += `<text x="${x + t / 2}" y="${20 + t / 2 + 6}" text-anchor="middle" font-size="18" style="fill:var(--c-d)">★</text>`;
    }
    return s + '</svg>';
  }
  function figuraTubo(d) {
    const N = d.inicio.length, r = 16;
    let s = svgAbre(380, d.bocas === 2 ? 150 : 60 + 2 * r * N + 20);
    if (d.bocas === 2) {
      const dibuja = (bolas, y, titulo, col) => {
        s += `<text x="10" y="${y - 14}" font-size="14" style="fill:var(--muted)">${P.xml(titulo)}</text>`;
        s += `<path d="M20 ${y} H${30 + 2 * r * N + 10} M20 ${y + 2 * r + 4} H${30 + 2 * r * N + 10}" stroke="currentColor" stroke-width="2"/>`;
        bolas.forEach((b, i) => { s += `<circle cx="${35 + r + 2 * r * i}" cy="${y + r + 2}" r="${r - 2}" fill="none" stroke-width="2" style="stroke:var(--c-${col})"/><text x="${35 + r + 2 * r * i}" y="${y + r + 7}" text-anchor="middle" font-weight="bold">${P.xml(b)}</text>`; });
      };
      dibuja(d.inicio, 30, 'ahora (abierto por los dos extremos)', 'o');
      dibuja(d.meta, 100, 'como debe quedar', 'i');
    } else {
      const dibuja = (bolas, x, titulo, col) => {
        s += `<text x="${x + r + 4}" y="18" text-anchor="middle" font-size="14" style="fill:var(--muted)">${P.xml(titulo)}</text>`;
        s += `<path d="M${x} 30 V${34 + 2 * r * N} H${x + 2 * r + 8} V30" fill="none" stroke="currentColor" stroke-width="2"/>`;
        bolas.forEach((b, i) => { const y = 34 + r + 2 * r * i; s += `<circle cx="${x + r + 4}" cy="${y}" r="${r - 2}" fill="none" stroke-width="2" style="stroke:var(--c-${col})"/><text x="${x + r + 4}" y="${y + 5}" text-anchor="middle" font-weight="bold">${P.xml(b)}</text>`; });
      };
      dibuja(d.inicio, 80, 'ahora', 'o');
      dibuja(d.meta, 240, 'como debe quedar', 'i');
    }
    return s + '</svg>';
  }
  function figuraPares(estado, titulo) {
    const L = estado.length, t = Math.min(40, Math.floor(380 / L));
    let s = svgAbre(Math.max(300, 10 + t * L + 10), 90) + `<text x="10" y="16" font-size="14" style="fill:var(--muted)">${P.xml(titulo)}</text>`;
    [...estado].forEach((c, i) => {
      const x = 10 + i * t;
      s += `<rect x="${x}" y="24" width="${t}" height="${t}" fill="none" style="stroke:var(--muted)"/><text x="${x + t / 2}" y="${24 + t + 16}" text-anchor="middle" font-size="13" style="fill:var(--muted)">${i + 1}</text>`;
      if (c === 'B') s += `<circle cx="${x + t / 2}" cy="${24 + t / 2}" r="${t * 0.36}" fill="none" stroke-width="2.5" style="stroke:var(--c-o)"/><text x="${x + t / 2}" y="${24 + t / 2 + 5}" text-anchor="middle" font-weight="bold" style="fill:var(--c-o)">B</text>`;
      if (c === 'N') s += `<circle cx="${x + t / 2}" cy="${24 + t / 2}" r="${t * 0.36}" style="fill:var(--c-i);fill-opacity:.35;stroke:var(--c-i)" stroke-width="2.5"/><text x="${x + t / 2}" y="${24 + t / 2 + 5}" text-anchor="middle" font-weight="bold">N</text>`;
    });
    return s + '</svg>';
  }
  const textoPares = e => [...e].map(c => (c === 'B' ? 'B' : c === 'N' ? 'N' : '·')).join(' ');

  // ---------------- Construcción ----------------
  // Pruebas de entrada y salida en paralelo: el mismo tipo, la misma variante y un largo parecido.
  // La canoa de las pruebas no es la clásica del zorro, la gallina y el maíz.
  const clasica = d => ['el zorro', 'la gallina', 'el maíz'].every(x => d.gente.some(g => g.nombre === x));
  const P1 = { tipo: 'canoa', ok: (d, n) => d.modo === 'cupo' && !d.guarda && d.cupo === 2 && n === 9 && !clasica(d) };
  const P2 = { tipo: 'caballo', ok: (d, n) => d.C && !d.bloqueadas.length && n === 5 };
  const P3 = { tipo: 'tubo', ok: (d, n) => d.bocas === 2 && d.inicio.length === 4 && n === 6 };
  const FIJOS = { 'entrada-1': P1, 'entrada-2': P2, 'entrada-3': P3, 'salida-1': P1, 'salida-2': P2, 'salida-3': P3 };
  function generar(semilla) {
    const rng = Azar.crear('rm-movimientos|' + semilla);
    const fijo = FIJOS[semilla];
    const tipo = fijo ? fijo.tipo : rng.elegir(['canoa', 'canoa', 'caballo', 'caballo', 'salto', 'tubo', 'tubo', 'pares']);
    for (let intento = 0; intento < 3000; intento++) {
      const d = DATOS[tipo](rng);
      if (!d) continue;
      const p = CONSTRUIR[tipo](d, semilla, rng);
      if (p && p.alternativas.length >= 4 && (!fijo || fijo.ok(p._datos, p.respuesta.valor))) return p;
    }
    throw new Error('rm-movimientos: no se pudo generar un problema con 4 alternativas');
  }
  const armar = (n, errores, rng, unidad, sing) => P.armar({ correcta: n, errores, rng, texto: x => `${x} ${x === 1 ? sing : unidad}` });
  const base = (tipo, semilla, d, extra) => ({ id: `rm-movimientos#${semilla}`, datos: '', _datos: d, ...extra });

  // ---- canoa ----
  const ITEMS = ['el zorro', 'la gallina', 'el maíz', 'el perro', 'el gato', 'el cuy', 'la leña', 'la alfalfa'];
  // Pares que no pueden quedar juntos sin una persona (índices de ITEMS). La leña no choca con nadie.
  const CHOQUES = [[0, 1], [1, 2], [3, 4], [4, 5], [0, 5], [1, 3], [5, 7]];
  const VERBO = { '0,1': 'el zorro se come a la gallina', '1,2': 'la gallina se come el maíz', '3,4': 'el perro ataca al gato', '4,5': 'el gato ataca al cuy', '0,5': 'el zorro se come al cuy', '1,3': 'el perro persigue a la gallina', '5,7': 'el cuy se come la alfalfa' };
  const DATOS = {
    canoa(rng) {
      if (rng.moneda()) {
        // Por peso: una familia, a veces con un perro o una carga que no reman.
        const gente = [];
        const adultos = rng.entero(1, 2), ninos = rng.entero(1, 3);
        const NA = ['el papá', 'la mamá'], NN = ['Ana', 'Luis', 'Rosa', 'Iván'];
        for (let i = 0; i < adultos; i++) gente.push({ nombre: NA[i], peso: rng.elegir([60, 65, 70, 75, 80, 85, 90]), rema: true });
        for (let i = 0; i < ninos; i++) gente.push({ nombre: NN[i], peso: rng.elegir([25, 30, 35, 40, 45]), rema: true });
        const extra = rng.elegir([null, 'perro', 'saco']);
        if (extra === 'perro') gente.push({ nombre: 'el perro', peso: rng.elegir([10, 15, 20, 25]), rema: false });
        if (extra === 'saco') gente.push({ nombre: 'el saco de papas', peso: rng.elegir([20, 30, 40, 50]), rema: false });
        if (gente.length < 3) return null;
        const maxP = Math.max(...gente.map(g => g.peso));
        const limite = maxP + rng.elegir([0, 5, 10, 20, 25, 30, 40]);
        return { tipo: 'canoa', modo: 'peso', gente, limite, choques: [] };
      }
      // Por cupo: el campesino (y a veces su hija) reman; animales o cosas que no pueden quedarse juntos.
      const gente = [{ nombre: 'el campesino', rema: true }];
      const hija = rng.moneda();
      if (hija) gente.push({ nombre: 'su hija', rema: true });
      const k = rng.entero(3, 5);
      let grupo = rng.barajar([...ITEMS.keys()]).slice(0, k);
      // El maíz solo tiene sentido con la gallina; si no está, es leña.
      if (grupo.includes(2) && !grupo.includes(1)) grupo = grupo.includes(6) ? grupo.filter(i => i !== 2) : grupo.map(i => (i === 2 ? 6 : i));
      grupo.sort((x, y) => x - y);
      const off = gente.length;
      grupo.forEach(i => gente.push({ nombre: ITEMS[i], rema: false }));
      const choques = [];
      CHOQUES.forEach(([a, b]) => { const ia = grupo.indexOf(a), ib = grupo.indexOf(b); if (ia >= 0 && ib >= 0) choques.push([off + ia, off + ib]); });
      if (!choques.length) return null;
      const d = { tipo: 'canoa', modo: 'cupo', gente, cupo: rng.elegir([2, 2, 3]), choques };
      if (hija) d.guarda = 'campesino'; // con dos que reman, solo así la hija cambia algo
      return d;
    },
    caballo(rng) {
      const [columnas, filas] = rng.elegir([[4, 4], [4, 5], [5, 5], [5, 6], [6, 6], [6, 5], [8, 8]]);
      const pos = () => [rng.entero(0, columnas - 1), rng.entero(0, filas - 1)];
      const A = pos(), B = pos(), C = rng.sig() < 0.35 ? pos() : null;
      const igual = (p, q) => p && q && p[0] === q[0] && p[1] === q[1];
      if (igual(A, B) || igual(A, C) || igual(B, C)) return null;
      const bloqueadas = [];
      const nb = rng.elegir([0, 0, 1, 2, 3]);
      for (let i = 0; i < nb; i++) { const b = pos(); if (![A, B, C, ...bloqueadas].some(p => igual(p, b))) bloqueadas.push(b); }
      return { tipo: 'caballo', filas, columnas, A, B, C, bloqueadas };
    },
    salto(rng) {
      const modo = rng.elegir(['dos-saltos', 'avanza-retrocede']);
      const n = rng.entero(10, 15), p = rng.entero(2, 7), q = rng.entero(2, 7);
      if (p === q) return null;
      const s = rng.entero(1, n), t = rng.entero(1, n);
      if (s === t) return null;
      return { tipo: 'salto', modo, n, p, q, s, t };
    },
    tubo(rng) {
      const N = rng.elegir([4, 4, 5]);
      const meta = [...Array(N).keys()].map(i => i + 1);
      const inicio = rng.barajar(meta);
      return { tipo: 'tubo', bocas: rng.elegir([1, 2, 2]), inicio, meta: rng.moneda() ? meta : meta.slice().reverse() };
    },
    pares(rng) {
      // Una fila con n blancas, n negras y dos casillas vacías juntas, en cualquier lugar.
      const n = 3, meta = rng.elegir(['alternar', 'alternar', 'separar']);
      let fichas = rng.barajar([...'B'.repeat(n) + 'N'.repeat(n)]).join('');
      if (rng.moneda()) fichas = meta === 'alternar' ? (rng.moneda() ? 'B'.repeat(n) + 'N'.repeat(n) : 'N'.repeat(n) + 'B'.repeat(n)) : (rng.moneda() ? 'BN' : 'NB').repeat(n);
      const k = rng.elegir([0, 2 * n, rng.entero(1, 2 * n - 1)]);
      const inicio = fichas.slice(0, k) + '__' + fichas.slice(k);
      if (paresMeta(meta, n)(inicio)) return null;
      return { tipo: 'pares', meta, n, L: inicio.length, inicio };
    },
  };

  const CONSTRUIR = {
    canoa(d, semilla, rng) {
      const sol = canoa(d);
      if (!sol || sol.n < 5 || sol.n > 9) return null;
      const n = sol.n, errores = [];
      errores.push(h('RMP14-sin-regresos', (n + 1) / 2, `Contaste solo los viajes de ida. La canoa no vuelve sola: cada regreso lo hace alguien que rema, y también es un viaje. Son ${(n + 1) / 2} idas y ${(n - 1) / 2} regresos.`));
      errores.push(h('RMP14-regreso-final', n + 1, 'Contaste un regreso después del último cruce. Cuando todos llegan a la otra orilla, la canoa ya no tiene que volver.'));
      const noReman = d.gente.filter(g => !g.rema);
      const sinChoques = () => {
        if (!d.choques.length) return;
        const r = relajado(d, { sinChoques: true });
        if (Number.isFinite(r) && r !== n) errores.push(h('RMP15-sin-choques', r, 'Dejaste juntos, sin una persona, a dos que no pueden quedarse solos. Hay que revisar las dos orillas después de cada viaje.'));
      };
      if (d.modo === 'cupo') sinChoques();
      if (d.guarda === 'campesino') {
        const r = relajado(d, { cuidaCualquiera: true });
        if (Number.isFinite(r) && r !== n) errores.push(h('RMP15-hija-cuida', r, 'Dejaste a la hija cuidando a dos que no pueden quedarse juntos, pero el enunciado dice que solo el campesino los controla.'));
      }
      if (noReman.length) {
        const r = relajado(d, { todosReman: true });
        if (Number.isFinite(r) && r !== n) errores.push(h('RMP15-rema-solo', r, `Esa cuenta deja que ${noReman.length > 1 ? `alguno de los que no reman (${lista(noReman.map(g => g.nombre))})` : noReman[0].nombre} cruce sin alguien que reme. La canoa siempre necesita a alguien que reme, también para volver.`));
      }
      if (d.modo !== 'cupo') sinChoques();
      const remeros = d.gente.map((g, i) => i).filter(i => d.gente[i].rema);
      const fijos = d.modo === 'peso' ? [remeros.reduce((a, i) => (d.gente[i].peso < d.gente[a].peso ? i : a), remeros[0])] : remeros;
      for (const fijo of fijos) {
        const r1 = relajado(d, { remero: fijo });
        if (Number.isFinite(r1) && r1 > n) errores.push(h('RMP2-un-remero', r1, `Esa es la cuenta si ${d.gente[fijo].nombre} va en todos los viajes. Funciona, pero no es lo mínimo: hay que buscar quién conviene que vuelva en cada regreso.`));
      }
      const alternativas = armar(n, errores, rng, 'viajes', 'viaje');
      const variables = { L: { nombre: d.modo === 'peso' ? 'límite de la canoa' : 'cupo de la canoa', color: 'o' } };
      const nombres = d.gente.map(g => g.nombre + (g.peso ? ` (${g.peso} kg)` : ''));
      const enunciado = [];
      if (d.modo === 'peso') {
        enunciado.push(`Hay que llevar a la otra orilla de un río a ${lista(nombres)}`.replace(/ a el /g, ' al '), '. La canoa puede llevar a varios a la vez, siempre que juntos no pasen de ', v('L', `${d.limite} kg`), ', y en cada cruce necesita a alguien que reme.');
        if (noReman.length) { variables.X = { nombre: 'no rema', color: 'h' }; enunciado.push(' ', v('X', noReman[0].nombre === 'el perro' ? 'El perro no rema' : 'El saco de papas no se mueve solo'), noReman[0].nombre === 'el perro' ? '; todos los demás saben remar.' : ': siempre viaja con alguien que rema. Todas las personas saben remar.'); }
        else enunciado.push(' Todos saben remar.');
      } else {
        variables.X = { nombre: 'los que no pueden quedarse juntos', color: 'h' };
        const per = d.gente.filter(g => g.rema).map(g => g.nombre), cosas = d.gente.filter(g => !g.rema).map(g => g.nombre);
        const reglas = lista(d.choques.map(([a, b]) => VERBO[[ITEMS.indexOf(d.gente[a].nombre), ITEMS.indexOf(d.gente[b].nombre)].join()]));
        enunciado.push(`${per.length === 1 ? 'Un campesino' : 'Un campesino y su hija'} debe${per.length === 1 ? '' : 'n'} cruzar un río con ${lista(cosas)}. En la canoa caben `, v('L', `${d.cupo} a la vez`), ` (contando a quien rema), y solo ${per.length === 1 ? 'el campesino rema' : 'el campesino y su hija reman'}. `,
          d.guarda === 'campesino' ? 'Si en una orilla no está el campesino (a la hija no le hacen caso), ' : 'Si en una orilla no queda ninguna persona, ',
          v('X', reglas), '. Fuera de eso, nadie ataca ni se come a nadie.');
      }
      enunciado.push(' Cada cruce de la canoa, de ida o de vuelta, cuenta como un viaje.');
      const pregunta = ['¿Cuántos viajes, como mínimo, se necesitan para que todos queden en la otra orilla?'];
      const solucion = [['Se anota quién va en cada cruce y se revisa que la canoa lleve a alguien que reme y que ninguna orilla quede en peligro.']];
      sol.movs.forEach((ids, i) => solucion.push([`Viaje ${i + 1} (${i % 2 ? 'regreso' : 'ida'}): ${lista(ids.map(j => d.gente[j].nombre))}${d.modo === 'peso' ? ` (${ids.reduce((s, j) => s + d.gente[j].peso, 0)} kg)` : ''}.`]));
      solucion.push([`Son ${(n + 1) / 2} idas y ${(n - 1) / 2} regresos: ${n} viajes. La búsqueda por todos los estados muestra que con ${n - 2} no se llega (el total siempre es impar).`]);
      const filas = sol.camino.map((e, i) => {
        const a = d.gente.filter((g, j) => e[0] >> j & 1).map(g => g.nombre).join(', ') || '—';
        const b = d.gente.filter((g, j) => !(e[0] >> j & 1)).map(g => g.nombre).join(', ') || '—';
        return `${i}: salida [${a}] | llegada [${b}]`;
      });
      return base('canoa', semilla, d, {
        variables, enunciado, pregunta, alternativas, solucion, respuesta: { valor: n, unidad: 'viajes' },
        figura: { svg: figuraCanoa(d), alt: `Un río con dos orillas. En la orilla de salida están ${lista(nombres)}, con la canoa. ${noReman.length ? `Con asterisco, los que no reman: ${lista(noReman.map(g => g.nombre))}. ` : ''}La canoa lleva ${d.modo === 'peso' ? `hasta ${d.limite} kg` : `hasta ${d.cupo} a la vez`}. La orilla de llegada está vacía.` },
        figuraSolucion: { svg: figuraLista('Quién va en la canoa en cada viaje', sol.movs.map((ids, i) => `${i + 1}. ${i % 2 ? '←' : '→'} ${ids.map(j => d.gente[j].nombre.replace(/^(el|la|los|las) /, '')).join(', ')}`)), alt: 'Orillas después de cada viaje: ' + filas.join('; ') + '.' },
      });
    },
    caballo(d, semilla, rng) {
      const sol = caballo(d);
      if (!sol || sol.n < 2 || sol.n > 7) return null;
      const n = sol.n, errores = [];
      const dist = (p, q) => Math.ceil((Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1])) / 3);
      const lineal = d.C ? dist(d.A, d.C) + dist(d.C, d.B) : dist(d.A, d.B);
      errores.push(h('RMP16-distancia', lineal, 'Dividiste entre 3 las casillas que hay que avanzar (cada salto mueve 2 + 1), pero el caballo no siempre puede aprovechar sus saltos completos: hay que seguir el camino casilla por casilla.'));
      const rey = d.C ? Math.max(Math.abs(d.A[0] - d.C[0]), Math.abs(d.A[1] - d.C[1])) + Math.max(Math.abs(d.C[0] - d.B[0]), Math.abs(d.C[1] - d.B[1])) : Math.max(Math.abs(d.A[0] - d.B[0]), Math.abs(d.A[1] - d.B[1]));
      errores.push(h('RMP16-como-rey', rey, 'Contaste las casillas de distancia como si el caballo avanzara una casilla por salto, como el rey. El caballo salta en L: a veces llega antes y a veces tiene que dar rodeos.'));
      errores.push(h('RMP1-estados', n + 1, 'Contaste las casillas que pisa el caballo, incluida la de salida. Los saltos son uno menos que las casillas pisadas.'));
      if (d.C) { const r = relajado(d, { directo: true }); if (Number.isFinite(r)) errores.push(h('RMP17-directo', r, `Ese es el camino directo de ${casilla(d.A)} a ${casilla(d.B)}, pero el caballo tiene que pasar por ${casilla(d.C)}.`)); }
      const sb = relajado(d, { sinBordes: true });
      if (Number.isFinite(sb) && sb < n) errores.push(h('RMP19-bordes', sb, 'Ese camino usa casillas que están fuera del tablero. Cerca de los bordes y las esquinas el caballo tiene menos saltos posibles.'));
      if (d.bloqueadas.length) { const r = relajado(d, { sinBloqueo: true }); if (Number.isFinite(r) && r < n) errores.push(h('RMP15-bloqueada', r, 'Tu camino cae en una casilla marcada con X, y el caballo no puede caer ahí.')); }
      const alternativas = armar(n, errores, rng, 'saltos', 'salto');
      const variables = { A: { nombre: 'casilla de salida', color: 'o' }, B: { nombre: 'casilla de llegada', color: 'i' } };
      if (d.C) variables.C = { nombre: 'casilla intermedia', color: 'h' };
      const enunciado = [`En un tablero de ${d.columnas} columnas (de la a a la ${LET[d.columnas - 1]}) y ${d.filas} filas (de la 1 a la ${d.filas}), un caballo de ajedrez está en `, v('A', casilla(d.A)), '. El caballo salta en L: dos casillas en una dirección y una en la perpendicular.'];
      if (d.bloqueadas.length) enunciado.push(` No puede caer en ${d.bloqueadas.length === 1 ? 'la casilla marcada con X' : 'las casillas marcadas con X'} (${lista(d.bloqueadas.map(casilla))}), pero sí saltar por encima.`);
      const pregunta = d.C
        ? ['¿Cuántos saltos, como mínimo, necesita para llegar a ', v('B', casilla(d.B)), ' pasando antes por ', v('C', casilla(d.C)), '?']
        : ['¿Cuántos saltos, como mínimo, necesita para llegar a ', v('B', casilla(d.B)), '?'];
      const solucion = [];
      solucion.push(['Se marcan las casillas a 1 salto de ', v('A', casilla(d.A)), ', luego las que están a 2, y así hasta llegar' + (d.C ? ' (primero a la intermedia y desde ahí a la final).' : '.')]);
      solucion.push([`Un camino de largo mínimo: ${sol.camino.map(casilla).join(' → ')}.`]);
      if (d.C) solucion.push(['De ', v('A', casilla(d.A)), ' a ', v('C', casilla(d.C)), ` hacen falta ${sol.tramos[0]} y de `, v('C', casilla(d.C)), ' a ', v('B', casilla(d.B)), ` ${sol.tramos[1]}: ${sol.tramos[0]} + ${sol.tramos[1]} = ${n} saltos.`]);
      else solucion.push([`Ninguna casilla a ${n - 1} saltos o menos es `, v('B', casilla(d.B)), `: el mínimo es ${n} saltos.`]);
      return base('caballo', semilla, d, {
        variables, enunciado, pregunta, alternativas, solucion, respuesta: { valor: n, unidad: 'saltos' },
        figura: { svg: figuraTablero(d, null), alt: `Tablero de ${d.columnas} columnas, a a ${LET[d.columnas - 1]}, y ${d.filas} filas, 1 a ${d.filas} desde abajo. El caballo está en ${casilla(d.A)} (letra A); la casilla de llegada es ${casilla(d.B)} (B)${d.C ? `; la intermedia es ${casilla(d.C)} (C)` : ''}.${d.bloqueadas.length ? ` Casillas con X, donde no puede caer: ${lista(d.bloqueadas.map(casilla))}.` : ''}` },
        figuraSolucion: { svg: figuraTablero(d, sol.camino), alt: `El mismo tablero con un camino mínimo numerado: ${sol.camino.map((e, i) => `${i === 0 ? 'salida' : 'salto ' + i} en ${casilla(e)}`).join(', ')}.` },
      });
    },
    salto(d, semilla, rng) {
      const sol = salto(d);
      if (!sol || sol.n < 3 || sol.n > 7) return null;
      const n = sol.n, errores = [], dist = Math.abs(d.t - d.s);
      if (dist >= Math.max(d.p, d.q)) errores.push(h('RMP16-distancia', Math.ceil(dist / Math.max(d.p, d.q)), `Dividiste la distancia (${dist} casillas) entre el salto más largo, pero con saltos fijos no se puede avanzar «un poco menos»: hay que combinar saltos que lleguen justo.`));
      errores.push(h('RMP1-estados', n + 1, 'Contaste las casillas que pisa la ficha, incluida la de salida. Los saltos son uno menos.'));
      const sb = relajado(d, { sinBordes: true });
      if (Number.isFinite(sb) && sb < n) errores.push(h('RMP19-bordes', sb, `Esa combinación de saltos saca a la ficha de la fila (antes de la 1 o después de la ${d.n}). La ficha nunca sale de la fila.`));
      // Solo hacia la meta (sin retroceder), si se puede.
      const dir = Math.sign(d.t - d.s);
      let soloIda = Infinity;
      const hacia = d.modo === 'dos-saltos' ? [d.p, d.q] : (dir > 0 ? [d.p] : [d.q]);
      for (let a = 0; a <= 20; a++) for (let b = 0; b <= 20; b++) if (a * hacia[0] + b * (hacia[1] || 0) === dist && (hacia[1] || b === 0)) soloIda = Math.min(soloIda, a + b);
      if (Number.isFinite(soloIda) && soloIda > n) errores.push(h('RMP2-sin-retroceder', soloIda, 'Solo usaste saltos hacia la meta. Así se llega, pero retroceder alguna vez puede acortar el camino.'));
      const ida = sol.movs.filter(k => k > 0).length, vuelta = n - ida;
      if (ida && vuelta) errores.push(h('RMP18-ida-y-vuelta', Math.max(ida, vuelta), 'Contaste cada salto hacia un lado junto con uno hacia el otro como un solo movimiento. Cada salto es un movimiento, vaya hacia donde vaya.'));
      const alternativas = armar(n, errores, rng, 'saltos', 'salto');
      const variables = { p: { nombre: 'un salto', color: 'o' }, q: { nombre: 'el otro salto', color: 'i' }, s: { nombre: 'casilla de salida', color: 'h' }, t: { nombre: 'casilla de llegada', color: 'd' } };
      const enunciado = [`Una fila tiene ${d.n} casillas numeradas del 1 al ${d.n}. Una ficha está en la casilla `, v('s', d.s), '. '];
      if (d.modo === 'dos-saltos') enunciado.push('En cada movimiento salta exactamente ', v('p', `${d.p}`), ' o exactamente ', v('q', `${d.q}`), ' casillas, hacia la derecha o hacia la izquierda, sin salir de la fila.');
      else enunciado.push('En cada movimiento avanza exactamente ', v('p', `${d.p}`), ' casillas hacia la derecha o retrocede exactamente ', v('q', `${d.q}`), ' hacia la izquierda, sin salir de la fila.');
      const pregunta = ['¿Cuántos saltos, como mínimo, necesita para llegar a la casilla ', v('t', d.t), '?'];
      const solucion = [
        ['Se anotan las casillas a las que se llega con 1 salto, luego con 2, y así, sin repetir ni salir de la fila.'],
        [`Un camino de largo mínimo: ${sol.camino.join(' → ')} (${sol.movs.map(k => (k > 0 ? '+' : '−') + Math.abs(k)).join(', ')}).`],
        [`Con ${n - 1} saltos o menos no se llega a la casilla `, v('t', d.t), `: el mínimo es ${n}.`],
      ];
      return base('salto', semilla, d, {
        variables, enunciado, pregunta, alternativas, solucion, respuesta: { valor: n, unidad: 'saltos' },
        figura: { svg: figuraFila(d), alt: `Fila de ${d.n} casillas numeradas del 1 al ${d.n}. La ficha está en la casilla ${d.s} y la estrella, la meta, en la ${d.t}.` },
      });
    },
    tubo(d, semilla, rng) {
      if (d.inicio.join() === d.meta.join()) return null;
      const sol = tubo(d);
      if (!sol || sol.n < 4 || sol.n > (d.bocas === 1 ? 8 : 12)) return null;
      const n = sol.n, N = d.inicio.length, errores = [];
      errores.push(h('RMP18-sacar-y-meter', n / 2, 'Contaste sacar una bola y volver a meterla como un solo movimiento. El enunciado cuenta por separado cada vez que una bola sale y cada vez que entra.'));
      errores.push(h('RMP1-estados', n + 1, 'Contaste las posiciones por las que pasa el tubo, incluida la de inicio, en vez de los movimientos entre ellas.'));
      if (2 * N > n) errores.push(h('RMP2-sacar-todas', 2 * N, `Sacaste las ${N} bolas y las volviste a meter en orden. Funciona, pero no es lo mínimo: algunas bolas pueden quedarse dentro.`));
      if (d.bocas === 1) { const r = relajado(d, { dosBocas: true }); if (Number.isFinite(r) && r < n) errores.push(h('RMP15-boca-cerrada', r, 'Usaste el fondo del tubo como si fuera otra boca. El tubo de ensayo está cerrado por abajo: todo entra y sale por arriba.')); }
      const fuera = d.inicio.filter((b, i) => b !== d.meta[i]).length;
      if (2 * fuera !== n) errores.push(h('RMP18-fuera-de-lugar', 2 * fuera, 'Contaste dos movimientos por cada bola que no está en su lugar. Pero mover una bola corre a las demás: hay que seguir el tubo paso a paso.'));
      const alternativas = armar(n, errores, rng, 'movimientos', 'movimiento');
      const variables = { I: { nombre: 'orden de ahora', color: 'o' }, M: { nombre: 'orden pedido', color: 'i' } };
      const orden = d.bocas === 2 ? 'de izquierda a derecha' : 'de arriba hacia abajo';
      const enunciado = d.bocas === 2
        ? [`Un tubo acostado, abierto por sus dos extremos, tiene ${N} bolas numeradas en este orden, ${orden}: `, v('I', d.inicio.join(', ')), '. Las bolas no se pueden pasar unas sobre otras dentro del tubo. Un movimiento es sacar una bola por un extremo y dejarla en la mesa, o tomar una bola de la mesa y meterla por un extremo.']
        : [`Un tubo de ensayo, cerrado por abajo, tiene ${N} bolas numeradas en este orden, ${orden}: `, v('I', d.inicio.join(', ')), '. Solo se puede sacar la bola de arriba. Un movimiento es sacar la bola de arriba y dejarla en la mesa, o tomar una bola de la mesa y meterla por arriba.'];
      const pregunta = ['¿Cuántos movimientos, como mínimo, se necesitan para que todas las bolas queden dentro del tubo en el orden ', v('M', d.meta.join(', ')), ` (${orden})?`];
      const extremo = b => (d.bocas === 1 ? 'por arriba' : b === 0 ? 'por la izquierda' : 'por la derecha');
      const solucion = [['Se anota lo que hay en el tubo y en la mesa después de cada movimiento.']];
      sol.movs.forEach((m, i) => {
        const e = sol.camino[i + 1];
        solucion.push([`${i + 1}. ${m.sacar !== undefined ? `Sacar la ${m.sacar} ${extremo(m.boca)}` : `Meter la ${m.meter} ${extremo(m.boca)}`}: tubo (${e.t.join(', ')})${e.m.length ? `, mesa {${e.m.slice().sort().join(', ')}}` : ''}.`]);
      });
      solucion.push([`Son ${n} movimientos (${n / 2} bolas salen y vuelven a entrar). La búsqueda por todos los estados muestra que con menos no se llega.`]);
      return base('tubo', semilla, d, {
        variables, enunciado, pregunta, alternativas, solucion, respuesta: { valor: n, unidad: 'movimientos' },
        figura: { svg: figuraTubo(d), alt: d.bocas === 2 ? `Tubo acostado, abierto por los dos extremos, con las bolas ${d.inicio.join(', ')} de izquierda a derecha. Debajo, cómo debe quedar: ${d.meta.join(', ')}.` : `Tubo de ensayo cerrado por abajo con las bolas ${d.inicio.join(', ')} de arriba hacia abajo. Al lado, cómo debe quedar: ${d.meta.join(', ')}.` },
      });
    },
    pares(d, semilla, rng) {
      const sol = pares(d);
      if (!sol || sol.n < 2 || sol.n > 6) return null;
      const n = sol.n, errores = [];
      errores.push(h('RMP18-fichas', 2 * n, 'Contaste las fichas que se mueven, pero cada movimiento lleva dos fichas a la vez.'));
      errores.push(h('RMP1-estados', n + 1, 'Contaste las posiciones de la fila, incluida la de inicio, en vez de los movimientos entre ellas.'));
      const sb = relajado(d, { sinBordes: true });
      if (Number.isFinite(sb) && sb < n) errores.push(h('RMP19-bordes', sb, `Usaste casillas fuera de la fila. Solo hay ${d.L} casillas.`));
      if (d.meta === 'alternar') {
        const ch = relajado(d, { meta: 'alternar-con-huecos' });
        if (Number.isFinite(ch) && ch < n) errores.push(h('RMP11-con-huecos', ch, 'Te detuviste con las fichas alternadas pero con casillas vacías entre ellas. Tienen que quedar en casillas seguidas.'));
      }
      const alternativas = armar(n, errores, rng, 'movimientos', 'movimiento');
      const variables = { B: { nombre: 'fichas blancas', color: 'o' }, N: { nombre: 'fichas negras', color: 'i' } };
      const desc = textoPares(d.inicio);
      const enunciado = [`Una fila tiene ${d.L} casillas numeradas del 1 al ${d.L}. Hay `, v('B', `${d.n} fichas blancas (B)`), ' y ', v('N', `${d.n} fichas negras (N)`), ` así: ${desc} (el punto es una casilla vacía). En cada movimiento se toman dos fichas que estén juntas y se llevan, sin cambiar su orden, a dos casillas vacías que estén juntas.`];
      const pregunta = d.meta === 'alternar'
        ? ['¿Cuántos movimientos, como mínimo, se necesitan para que las fichas queden en casillas seguidas, alternando blanca y negra (da igual con qué color empiece la fila de fichas)?']
        : ['¿Cuántos movimientos, como mínimo, se necesitan para que las fichas queden en casillas seguidas, todas las blancas juntas y todas las negras juntas (da igual qué color quede a la izquierda)?'];
      const solucion = [['Se busca entre todas las posiciones posibles, movimiento a movimiento.']];
      sol.movs.forEach((m, i) => solucion.push([`${i + 1}. Las fichas de las casillas ${m[0]} y ${m[0] + 1} pasan a la ${m[1]} y la ${m[1] + 1}: ${textoPares(sol.camino[i + 1])}.`]));
      solucion.push([`Con ${n - 1} movimientos no se llega a ninguna posición que cumpla: el mínimo es ${n}.`]);
      return base('pares', semilla, d, {
        variables, enunciado, pregunta, alternativas, solucion, respuesta: { valor: n, unidad: 'movimientos' },
        figura: { svg: figuraPares(d.inicio, 'al inicio'), alt: `Fila de ${d.L} casillas numeradas; de la 1 a la ${d.L}: ${[...d.inicio].map(c => (c === 'B' ? 'blanca' : c === 'N' ? 'negra' : 'vacía')).join(', ')}.` },
        figuraSolucion: { svg: figuraLista('Fila después de cada movimiento (· = vacía)', sol.camino.map((e, i) => `${i}: ${textoPares(e)}`)), alt: 'Fila después de cada movimiento: ' + sol.camino.map((e, i) => `${i}: ${textoPares(e)}`).join('; ') + '.' },
      });
    },
  };

  return { id: 'rm-movimientos', titulo: 'El menor número de movimientos: canoas, caballos, saltos y fichas', generar, calc: { minimo, relajado, canoa, caballo, salto, tubo, pares } };
});
