/*
 * Generador: trasvases con recipientes sin marcas (y el reparto de barriles enteros).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['rm-trasvases']) y en Node (require). No usa ningún motor.
 *
 * Tipos y sus _datos:
 *   dos-jarras     { tipo, caps: [a, b], cuenta: 'todo' | 'trasvases', x, contexto }
 *                  dos jarras vacías, un caño y un desagüe. Con cuenta 'todo', llenar, vaciar y pasar
 *                  agua cuentan como una operación cada una; con 'trasvases', solo cuenta pasar agua de
 *                  una jarra a la otra. Meta: que una de las jarras tenga exactamente x litros.
 *   tres-cerrados  { tipo, caps: [A, B, C], meta, contexto } el recipiente grande lleno (A litros) y dos
 *                  jarras vacías, sin caño ni desagüe; solo se trasvasa. meta: { tipo: 'alguno', x }
 *                  (x litros en cualquier recipiente), { tipo: 'en', i: 0, x } (dejar x en el grande) o
 *                  { tipo: 'reparto', estado: [..] } (un reparto exacto, por ejemplo mitad y mitad).
 *   cuatro         { tipo, caps: [A, B, C, D], meta, contexto } el grande lleno y tres jarras vacías;
 *                  meta 'en' (dejar x en el grande) o 'alguno'.
 *   barriles       { tipo, barriles: [..], k, contexto } barriles enteros de capacidades distintas; se
 *                  venden todos menos uno a dos clientes y el segundo se lleva k veces los litros del
 *                  primero (k = 1: la misma cantidad). ¿Qué barril queda? Se resuelve por divisibilidad
 *                  (T − r múltiplo de k + 1) y se comprueba que los barriles formen los dos pedidos.
 *
 * Un trasvase es pasar agua de un recipiente a otro hasta que el primero se vacíe o el segundo se llene
 * (sin marcas no hay otra forma de medir). El mínimo se calcula por búsqueda en anchura sobre los estados
 * (con costo 0 para llenar y vaciar cuando no cuentan).
 *
 * calc:
 *   minimo(d)        → { n, camino: [estados], movs: [{ tipo, de, a }], ops }  para los tres primeros tipos
 *   rutas(d)         → [costo mínimo empezando por cada primera jugada posible], ordenado
 *   barriles(d)      → { queda, primero: [..], segundo: [..], candidatos: [r con T − r múltiplo de k + 1] }
 *   aMeta(d, meta)   → mínimo para otra meta (la usan los errores de «meta a medias»)
 *
 * Errores (todos hipótesis; ver el informe de respuesta de este módulo):
 *   RMP1-estados         contar estados en vez de trasvases (n + 1)
 *   RMP2-otra-ruta       quedarse con la ruta que empieza por la otra jarra, que también llega pero más larga
 *   RMP10-operaciones    contar llenar y vaciar cuando no cuentan, o no contarlos cuando sí
 *   RMP11-*              detenerse en un estado que no cumple la meta exacta: repartida entre dos recipientes,
 *                        en otro recipiente, en un recipiente fijo, con el reparto en otros recipientes
 *   RMP12-sin-reparto    barriles: el que cumple la divisibilidad pero con el que no se forman los pedidos
 *   RMP13-entre-k        barriles: dividir entre k (o tomar el doble como «la mitad») en vez de entre k + 1
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
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  const COL = ['o', 'i', 'h', 'd'];

  // ---------------- Búsqueda sobre estados ----------------
  // Jugadas desde un estado: pasar de i a j (siempre) y, con caño, llenar y vaciar.
  function jugadas(caps, e, cano) {
    const r = [];
    for (let i = 0; i < caps.length; i++) {
      if (cano && e[i] < caps[i]) { const s = e.slice(); s[i] = caps[i]; r.push({ tipo: 'llenar', de: -1, a: i, estado: s }); }
      if (cano && e[i] > 0) { const s = e.slice(); s[i] = 0; r.push({ tipo: 'vaciar', de: i, a: -1, estado: s }); }
      for (let j = 0; j < caps.length; j++) {
        if (i === j || e[i] === 0 || e[j] === caps[j]) continue;
        const q = Math.min(e[i], caps[j] - e[j]); const s = e.slice(); s[i] -= q; s[j] += q;
        r.push({ tipo: 'pasar', de: i, a: j, estado: s });
      }
    }
    return r;
  }
  // Peso de cada jugada: 1001 si cuenta (el 1 desempata por menos acciones en total), 1 si no cuenta.
  const peso = (cuenta, m) => (cuenta === 'trasvases' && m.tipo !== 'pasar' ? 1 : 1001);

  // Dijkstra con montículo (con pesos iguales es la búsqueda en anchura). Devuelve el primer estado meta.
  function buscar(caps, inicio, cano, cuenta, esMeta) {
    const k = e => e.join(',');
    const info = new Map([[k(inicio), { d: 0, padre: null, mov: null, estado: inicio }]]);
    const heap = [[0, inicio]];
    const push = x => { heap.push(x); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
    const pop = () => { const t = heap[0], u = heap.pop(); if (heap.length) { heap[0] = u; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return t; };
    const hechos = new Set();
    while (heap.length) {
      const [d, e] = pop(); const ke = k(e);
      if (hechos.has(ke)) continue; hechos.add(ke);
      if (esMeta(e)) {
        const camino = [], movs = []; let x = ke;
        while (x !== null) { const it = info.get(x); camino.unshift(it.estado); if (it.mov) movs.unshift(it.mov); x = it.padre; }
        return { costo: d, n: Math.floor(d / 1000), ops: movs.length, camino, movs };
      }
      for (const m of jugadas(caps, e, cano)) {
        const km = k(m.estado), nd = d + peso(cuenta, m), prev = info.get(km);
        if (!prev || nd < prev.d) { info.set(km, { d: nd, padre: ke, mov: { tipo: m.tipo, de: m.de, a: m.a }, estado: m.estado }); push([nd, m.estado]); }
      }
    }
    return null;
  }

  function inicioDe(d) { return d.tipo === 'dos-jarras' ? d.caps.map(() => 0) : d.caps.map((c, i) => (i === 0 ? c : 0)); }
  function cumple(meta) {
    if (meta.tipo === 'alguno') return e => e.includes(meta.x);
    if (meta.tipo === 'en') return e => e[meta.i] === meta.x;
    if (meta.tipo === 'reparto') return e => e.every((c, i) => c === meta.estado[i]);
    if (meta.tipo === 'suma-dos') return e => !e.includes(meta.x) && e.some((a, i) => e.some((b, j) => i < j && a + b === meta.x));
    if (meta.tipo === 'permutado') { const s = meta.estado.slice().sort((a, b) => a - b).join(); return e => e.slice().sort((a, b) => a - b).join() === s && e.join() !== meta.estado.join(); }
    throw new Error('meta desconocida');
  }
  const metaDe = d => (d.tipo === 'dos-jarras' ? { tipo: 'alguno', x: d.x } : d.meta);
  const cano = d => d.tipo === 'dos-jarras';
  const cuentaDe = d => (d.tipo === 'dos-jarras' ? d.cuenta : 'todo');

  function aMeta(d, meta) {
    const r = buscar(d.caps, inicioDe(d), cano(d), cuentaDe(d), cumple(meta));
    return r ? r.n : NaN;
  }
  function minimo(d) {
    const r = buscar(d.caps, inicioDe(d), cano(d), cuentaDe(d), cumple(metaDe(d)));
    return r && { n: r.n, ops: r.ops, camino: r.camino, movs: r.movs };
  }
  // Costo mínimo empezando por cada primera jugada (ordenado y sin repetir).
  function rutas(d) {
    const ini = inicioDe(d), met = cumple(metaDe(d)), out = new Set();
    for (const m of jugadas(d.caps, ini, cano(d))) {
      if (met(m.estado)) { out.add(Math.floor(peso(cuentaDe(d), m) / 1000)); continue; }
      const r = buscar(d.caps, m.estado, cano(d), cuentaDe(d), met);
      if (r) out.add(r.n + Math.floor(peso(cuentaDe(d), m) / 1000));
    }
    return [...out].sort((a, b) => a - b);
  }

  // ---------------- Barriles ----------------
  function barriles(d) {
    const T = d.barriles.reduce((s, x) => s + x, 0), k = d.k;
    const candidatos = d.barriles.filter(r => (T - r) % (k + 1) === 0);
    const validos = [];
    for (const r of candidatos) {
      const resto = d.barriles.filter(x => x !== r), S1 = (T - r) / (k + 1);
      for (let m = 1; m < (1 << resto.length) - 1; m++) {
        const g = resto.filter((x, i) => m >> i & 1);
        if (g.reduce((s, x) => s + x, 0) === S1) { validos.push({ queda: r, primero: g, segundo: resto.filter((x, i) => !(m >> i & 1)) }); break; }
      }
    }
    if (validos.length !== 1) return { queda: null, candidatos, validos: validos.length };
    return { ...validos[0], candidatos, validos: 1 };
  }

  // ---------------- Textos y figuras ----------------
  const CONTEXTOS = {
    agua: { liquido: 'agua', grande: 'bidón', lugar: 'En la chacra' },
    chicha: { liquido: 'chicha morada', grande: 'balde', lugar: 'En la feria de Juliaca' },
    leche: { liquido: 'leche', grande: 'porongo', lugar: 'En el establo' },
    aceite: { liquido: 'aceite', grande: 'tanque', lugar: 'En la bodega' },
  };
  function nombres(d) {
    const c = CONTEXTOS[d.contexto];
    if (d.tipo === 'dos-jarras') return d.caps.map(x => `la jarra de ${x} L`);
    return d.caps.map((x, i) => (i === 0 ? `el ${c.grande}` : `la jarra de ${x} L`));
  }
  const corto = (d, i) => (d.tipo !== 'dos-jarras' && i === 0 ? CONTEXTOS[d.contexto].grande : `${d.caps[i]} L`);
  const lista = a => (a.length === 1 ? String(a[0]) : a.slice(0, -1).join(', ') + ' y ' + a[a.length - 1]);
  const grupo = g => (g.length === 1 ? `el barril de ${g[0]} L` : `los barriles de ${g.join(' + ')} L`);
  const tupla = e => `(${e.join('; ')})`;

  function figuraRecipientes(d, estado, titulo) {
    const n = d.caps.length, ancho = n === 2 ? 300 : n === 3 ? 340 : 400, max = Math.max(...d.caps);
    const paso = (ancho - 40) / n, w = Math.min(64, paso - 24), base = 180;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} 230" font-size="15" fill="currentColor">`;
    if (titulo) s += `<text x="${ancho / 2}" y="18" text-anchor="middle" style="fill:var(--muted)">${P.xml(titulo)}</text>`;
    d.caps.forEach((cap, i) => {
      const x = 20 + paso * i + (paso - w) / 2, alto = Math.max(24, Math.round(130 * cap / max)), y = base - alto;
      const lleno = Math.round(alto * estado[i] / cap), col = colorRecipiente(d, i);
      if (lleno > 0) s += `<rect x="${x}" y="${base - lleno}" width="${w}" height="${lleno}" style="fill:var(--muted);fill-opacity:.3"/>`;
      s += `<path d="M${x} ${y} V${base} H${x + w} V${y}" fill="none" stroke-width="2.5" style="stroke:${col ? `var(--c-${col})` : 'currentColor'}"/>`;
      s += `<text x="${x + w / 2}" y="${base - Math.max(lleno, 0) - 6}" text-anchor="middle">${P.xml(estado[i] + ' L')}</text>`;
      const nombre = d.tipo !== 'dos-jarras' && i === 0 ? CONTEXTOS[d.contexto].grande : 'jarra';
      s += `<text x="${x + w / 2}" y="${base + 20}" text-anchor="middle" font-size="14" style="fill:var(--muted)">${P.xml(nombre)}</text>`;
      s += `<text x="${x + w / 2}" y="${base + 40}" text-anchor="middle" font-weight="bold"${col ? ` style="fill:var(--c-${col})"` : ''}>${P.xml('de ' + cap + ' L')}</text>`;
    });
    if (cano(d)) {
      s += `<text x="14" y="40" style="fill:var(--muted)">${P.xml('caño ↓')}</text><text x="${ancho - 14}" y="40" text-anchor="end" style="fill:var(--muted)">${P.xml('desagüe ↓')}</text>`;
    }
    return s + '</svg>';
  }
  function colorRecipiente(d, i) {
    if (d.tipo === 'dos-jarras') return COL[i];
    if (d.tipo === 'tres-cerrados') return COL[i];
    return i === 0 ? null : COL[i - 1];
  }
  function altRecipientes(d, estado) {
    const ns = nombres(d);
    const partes = d.caps.map((c, i) => `${ns[i]}, de ${c} litros de capacidad, con ${estado[i]} litros`);
    return `Recipientes sin marcas: ${partes.join('; ')}.` + (cano(d) ? ' A la izquierda hay un caño para llenar y a la derecha un desagüe para vaciar.' : ' No hay caño ni desagüe.');
  }
  function figuraTabla(d, sol) {
    const filas = sol.camino.length, alto = 40 + 24 * filas, ancho = d.caps.length === 4 ? 400 : 360;
    const cols = d.caps.length, x0 = 120, paso = (ancho - x0 - 10) / cols;
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${alto}" font-size="15" fill="currentColor">`;
    s += `<text x="10" y="22" font-weight="bold">${P.xml(cano(d) ? 'Acción' : 'Trasvase')}</text>`;
    d.caps.forEach((c, i) => { const col = colorRecipiente(d, i); s += `<text x="${x0 + paso * i + paso / 2}" y="22" text-anchor="middle" font-weight="bold"${col ? ` style="fill:var(--c-${col})"` : ''}>${P.xml(corto(d, i) === `${c} L` ? `${c} L` : corto(d, i))}</text>`; });
    s += `<line x1="8" y1="30" x2="${ancho - 8}" y2="30" style="stroke:var(--line)" stroke-width="1.5"/>`;
    let cont = 0;
    sol.camino.forEach((e, f) => {
      const y = 50 + 24 * f, m = f ? sol.movs[f - 1] : null;
      let etiqueta = 'inicio';
      if (m) { if (m.tipo === 'pasar') { cont++; etiqueta = `${cont}.º ${corto(d, m.de)} → ${corto(d, m.a)}`; } else etiqueta = m.tipo === 'llenar' ? `llenar ${corto(d, m.a)}` : `vaciar ${corto(d, m.de)}`; }
      s += `<text x="10" y="${y}" font-size="13"${m && m.tipo !== 'pasar' ? ' style="fill:var(--muted)"' : ''}>${P.xml(etiqueta)}</text>`;
      e.forEach((c, i) => { s += `<text x="${x0 + paso * i + paso / 2}" y="${y}" text-anchor="middle">${P.xml(c)}</text>`; });
    });
    return s + '</svg>';
  }
  function altTabla(d, sol) {
    const ns = nombres(d);
    let cont = 0;
    const filas = sol.camino.map((e, f) => {
      const m = f ? sol.movs[f - 1] : null;
      let a = 'al inicio';
      if (m) { if (m.tipo === 'pasar') { cont++; a = `trasvase ${cont}, de ${ns[m.de]} a ${ns[m.a]}`.replace(/\bde el /g, 'del ').replace(/\ba el /g, 'al '); } else a = m.tipo === 'llenar' ? `llenar ${ns[m.a]}` : `vaciar ${ns[m.de]}`; }
      return `${a}: ${tupla(e)}`;
    });
    return `Tabla de estados, con el contenido en el orden (${ns.join(', ')}): ${filas.join('; ')}.`;
  }

  // ---------------- Construcción ----------------
  // Pruebas de entrada y salida en paralelo: el mismo tipo, la misma meta y un largo parecido.
  const P1 = { tipo: 'tres-cerrados', ok: (d, n) => d.meta.tipo === 'alguno' && n >= 5 && n <= 6 };
  const P2 = { tipo: 'dos-jarras', ok: (d, n) => d.cuenta === 'todo' && n >= 5 && n <= 6 };
  const P3 = { tipo: 'cuatro', ok: (d, n) => d.meta.tipo === 'en' && n >= 4 && n <= 5 };
  const FIJOS = { 'entrada-1': P1, 'entrada-2': P2, 'entrada-3': P3, 'salida-1': P1, 'salida-2': P2, 'salida-3': P3 };
  function generar(semilla) {
    const rng = Azar.crear('rm-trasvases|' + semilla);
    // Las pruebas de entrada y salida llevan los mismos tipos, en paralelo.
    const fijo = FIJOS[semilla];
    const tipo = fijo ? fijo.tipo : rng.elegir(['dos-jarras', 'dos-jarras', 'tres-cerrados', 'tres-cerrados', 'tres-cerrados', 'cuatro', 'cuatro', 'barriles']);
    for (let intento = 0; intento < 3000; intento++) {
      const d = tipo === 'barriles' ? datosBarriles(rng) : datosTrasvase(rng, tipo);
      if (!d) continue;
      const p = tipo === 'barriles' ? construirBarriles(d, semilla, rng) : construirTrasvase(d, semilla, rng);
      if (p && p.alternativas.length >= 4 && (!fijo || fijo.ok(p._datos, p.respuesta.valor))) return p;
    }
    throw new Error('rm-trasvases: no se pudo generar un problema con 4 alternativas');
  }

  function datosTrasvase(rng, tipo) {
    const contexto = rng.elegir(Object.keys(CONTEXTOS));
    if (tipo === 'dos-jarras') {
      const a = rng.entero(2, 9), b = rng.entero(a + 2, 13);
      if (gcd(a, b) !== 1) return null;
      const x = rng.entero(1, b - 1);
      if (x === a) return null;
      return { tipo, caps: [a, b], cuenta: rng.elegir(['todo', 'trasvases']), x, contexto };
    }
    if (tipo === 'tres-cerrados') {
      const A = rng.entero(6, 16), B = rng.entero(3, A - 1), C = rng.entero(2, B - 1);
      if (B + C < A - 6 || gcd(B, C) !== 1 && rng.moneda()) return null;
      const t = rng.elegir(['alguno', 'alguno', 'en', 'reparto']);
      if (t === 'reparto') {
        if (A % 2 === 0 && B >= A / 2 && rng.moneda()) return { tipo, caps: [A, B, C], meta: { tipo: 'reparto', estado: [A / 2, A / 2, 0] }, contexto };
        const q = rng.entero(1, B), r = rng.entero(0, C), p = A - q - r;
        if (p < 0 || p > A) return null;
        return { tipo, caps: [A, B, C], meta: { tipo: 'reparto', estado: [p, q, r] }, contexto };
      }
      const x = rng.entero(1, A - 1);
      if (t === 'en') return { tipo, caps: [A, B, C], meta: { tipo: 'en', i: 0, x }, contexto };
      return { tipo, caps: [A, B, C], meta: { tipo: 'alguno', x }, contexto };
    }
    const A = rng.entero(10, 20), B = rng.entero(5, Math.min(11, A - 2)), C = rng.entero(3, B - 1), D = rng.entero(2, C - 1);
    const x = rng.entero(1, A - 1);
    return { tipo, caps: [A, B, C, D], meta: { tipo: rng.elegir(['en', 'en', 'alguno']), i: 0, x }, contexto };
  }

  function construirTrasvase(d, semilla, rng) {
    if (d.meta && d.meta.tipo === 'alguno') delete d.meta.i;
    const sol = minimo(d);
    if (!sol) return null;
    const n = sol.n, ini = inicioDe(d);
    const [lo, hi] = d.tipo === 'dos-jarras' ? (d.cuenta === 'todo' ? [3, 10] : [2, 8]) : d.tipo === 'cuatro' ? [4, 6] : [3, 8];
    if (n < lo || n > hi) return null;
    // En «alguno», x no puede ser la capacidad de un recipiente ni estar ya al inicio.
    const meta = metaDe(d);
    if (meta.tipo !== 'reparto' && (d.caps.includes(meta.x) || ini.includes(meta.x))) return null;
    if (meta.tipo === 'en' && d.caps.slice(1).some(c => c === d.caps[0] - meta.x)) return null; // sale de un trasvase
    const ns = nombres(d), c = CONTEXTOS[d.contexto];
    const variables = {}, rec = i => colorRecipiente(d, i);
    d.caps.forEach((cap, i) => { if (rec(i)) variables['r' + i] = { nombre: ns[i], color: rec(i) }; });
    const V = i => (rec(i) ? v('r' + i, ns[i]) : ns[i]);
    // «del balde», «al balde»: la contracción va fuera del texto coloreado.
    const conArt = (i, sin, con) => { if (!ns[i].startsWith('el ')) return [sin + ' ', V(i)]; const resto = ns[i].slice(3); return [con + ' ', rec(i) ? v('r' + i, resto) : resto]; };
    const deV = i => conArt(i, 'de', 'del'), aV = i => conArt(i, 'a', 'al');
    const Vc = i => (rec(i) ? v('r' + i, `${d.caps[i]} L`) : `${d.caps[i]} L`);
    const unir = arr => arr.reduce((acc, x, i) => acc.concat(i === 0 ? [] : [i === arr.length - 1 ? ' y ' : ', '], [x]), []);
    let enunciado, pregunta, palabra = 'trasvases';
    if (d.tipo === 'dos-jarras') {
      variables.x = { nombre: 'cantidad pedida', color: 'h' };
      enunciado = [`${c.lugar} hay un caño, un desagüe y dos jarras sin marcas, vacías, de `, Vc(0), ' y ', Vc(1), '. Se puede llenar una jarra con el caño, vaciarla por completo en el desagüe o pasar ' + c.liquido.replace('chicha morada', 'chicha') + ' de una jarra a la otra hasta que la primera se vacíe o la segunda se llene. '];
      if (d.cuenta === 'todo') { enunciado.push('Cada una de esas acciones (llenar, vaciar o pasar) cuenta como una operación.'); palabra = 'operaciones'; }
      else enunciado.push('Llenar con el caño y vaciar en el desagüe no se cuentan: solo cuenta como trasvase pasar líquido de una jarra a la otra.');
      pregunta = [`¿${palabra === 'operaciones' ? 'Cuántas' : 'Cuántos'} ${palabra}, como mínimo, se necesitan para que una de las jarras tenga exactamente `, v('x', `${d.x} L`), '?'];
    } else {
      variables.x = { nombre: 'cantidad pedida', color: 'd' };
      const jarras = d.caps.slice(1).map((cap, j) => Vc(j + 1));
      enunciado = [`${c.lugar} hay un ${c.grande} lleno con ${d.caps[0]} L de ${c.liquido} y tres jarras vacías de `, ...unir(jarras),
        ', todos sin marcas. No hay caño ni desagüe: solo se puede pasar líquido de un recipiente a otro hasta que el primero se vacíe o el segundo se llene. Cada paso así es un trasvase.'];
      if (d.tipo === 'tres-cerrados') { enunciado = [`${c.lugar} hay un `, v('r0', `${c.grande} lleno con ${d.caps[0]} L`), ` de ${c.liquido} y dos jarras vacías de `, ...unir(jarras), ', todos sin marcas. No hay caño ni desagüe: solo se puede pasar líquido de un recipiente a otro hasta que el primero se vacíe o el segundo se llene. Cada paso así es un trasvase.']; }
      if (meta.tipo === 'alguno') pregunta = ['¿Cuántos trasvases, como mínimo, se necesitan para que uno de los recipientes tenga exactamente ', v('x', `${meta.x} L`), '?'];
      else if (meta.tipo === 'en') pregunta = [`¿Cuántos trasvases, como mínimo, se necesitan para que en el ${c.grande} queden exactamente `, v('x', `${meta.x} L`), '?'];
      else {
        delete variables.x;
        const partes = meta.estado.map((q, i) => [`${q} L en `, V(i)]);
        const mitades = meta.estado[2] === 0 && meta.estado[0] === meta.estado[1];
        pregunta = mitades
          ? ['¿Cuántos trasvases, como mínimo, se necesitan para repartir el líquido en dos partes iguales, ', `${meta.estado[0]} L en `, V(0), ` y ${meta.estado[1]} L en `, V(1), '?']
          : ['¿Cuántos trasvases, como mínimo, se necesitan para que queden ', ...partes[0], ', ', ...partes[1], ' y ', ...partes[2], '?'];
      }
    }
    // ---- Errores ----
    const unidad = palabra;
    const errores = [];
    const r = rutas(d), otra = r.find(x => x > n);
    if (otra !== undefined) errores.push(h('RMP2-otra-ruta', otra, `Esa ruta también llega, pero no es la más corta: con otro comienzo se logra en ${n}. ${d.tipo === 'dos-jarras' ? 'Hay que probar los dos caminos (empezar llenando una jarra o la otra)' : 'Hay que probar los caminos que empiezan por cada recipiente'} y quedarse con el más corto.`));
    errores.push(h('RMP1-estados', n + 1, `Contaste los estados de la tabla (incluido el de inicio) en vez de los pasos entre ellos. Con ${n + 1} filas hay ${n} ${unidad}, como en la cerca: los tramos son uno menos que los postes.`));
    if (d.tipo === 'dos-jarras') {
      const pasos = sol.movs.filter(m => m.tipo === 'pasar').length;
      if (d.cuenta === 'todo') errores.push(h('RMP10-operaciones', pasos, 'Contaste solo las veces que pasaste líquido de una jarra a otra. Aquí llenar con el caño y vaciar en el desagüe también son operaciones.'));
      else errores.push(h('RMP10-operaciones', sol.ops, 'Contaste también las veces que llenaste con el caño o vaciaste en el desagüe. El enunciado dice que esas acciones no cuentan: solo los trasvases de una jarra a la otra.'));
    }
    if (meta.tipo === 'alguno' || meta.tipo === 'en') {
      const s2 = aMeta(d, { tipo: 'suma-dos', x: meta.x });
      if (s2 < n) errores.push(h('RMP11-repartida', s2, `Te detuviste cuando entre dos recipientes sumaban ${meta.x} L. Eso no sirve: sin marcas, la cantidad tiene que quedar sola en un recipiente.`));
    }
    if (meta.tipo === 'alguno' && d.tipo !== 'dos-jarras') {
      const fijos = d.caps.map((cap, i) => (cap >= meta.x ? aMeta(d, { tipo: 'en', i, x: meta.x }) : NaN)).filter(x => Number.isFinite(x) && x > n);
      if (fijos.length) errores.push(h('RMP11-recipiente-fijo', Math.max(...fijos), `Buscaste que los ${meta.x} L quedaran en un recipiente en particular, pero la pregunta acepta cualquiera. En otro recipiente se logra antes.`));
    }
    if (meta.tipo === 'en') {
      const cual = aMeta(d, { tipo: 'alguno', x: meta.x });
      if (cual < n) errores.push(h('RMP11-otro-recipiente', cual, `Con esos trasvases quedan ${meta.x} L, pero en una jarra, no en el ${c.grande}. La pregunta pide que queden en el ${c.grande}.`));
    }
    if (meta.tipo === 'reparto') {
      const perm = aMeta(d, { tipo: 'permutado', estado: meta.estado });
      if (Number.isFinite(perm) && perm !== n) errores.push(h('RMP11-permutado', perm, 'Lograste esas mismas cantidades, pero en otros recipientes. El reparto dice cuánto debe quedar en cada uno.'));
      const vals = [...new Set(meta.estado)].filter(q => q > 0 && !ini.includes(q));
      const medias = vals.map(q => aMeta(d, { tipo: 'alguno', x: q })).filter(x => x < n);
      if (medias.length) errores.push(h('RMP11-a-medias', Math.min(...medias), 'Te detuviste cuando apareció la primera de las cantidades pedidas, pero el reparto exige que todos los recipientes queden como se pide a la vez.'));
    }
    const sing = { trasvases: 'trasvase', operaciones: 'operación' }[unidad];
    const alternativas = P.armar({ correcta: n, errores, rng, texto: x => `${x} ${x === 1 ? sing : unidad}` });
    // ---- Solución ----
    const solucion = [];
    solucion.push(['Anotamos el contenido de los recipientes en este orden: (', ...unir(d.caps.map((cap, i) => V(i))), `). Al inicio: ${tupla(ini)}.`]);
    let cont = 0;
    sol.movs.forEach((m, f) => {
      const e = tupla(sol.camino[f + 1]);
      if (m.tipo === 'pasar') { cont++; solucion.push([`${d.tipo === 'dos-jarras' && d.cuenta === 'todo' ? `Operación ${f + 1}` : `Trasvase ${cont}`}: `, ...deV(m.de), ' ', ...aV(m.a), ` → ${e}.`]); }
      else solucion.push([d.cuenta === 'todo' ? `Operación ${f + 1}: ` : 'Sin contar: ', m.tipo === 'llenar' ? 'llenar ' : 'vaciar ', V(m.tipo === 'llenar' ? m.a : m.de), ` → ${e}.`]);
    });
    const fin = sol.camino[sol.camino.length - 1];
    if (meta.tipo === 'reparto') solucion.push([`Queda ${tupla(fin)}, el reparto pedido, en ${n} ${unidad}.`]);
    else { const i = meta.tipo === 'en' ? meta.i : fin.indexOf(meta.x); solucion.push(['Ya hay ', v('x', `${meta.x} L`), ' en ', V(i), `: ${n} ${unidad}.`]); }
    solucion.push([otra !== undefined
      ? `¿Se puede en menos? Se revisan todos los estados alcanzables paso a paso: con ${n - 1} no se llega a la meta. Algunos comienzos no llevan a la ruta más corta: con ellos hacen falta al menos ${otra}. El mínimo es ${n}.`
      : `¿Se puede en menos? Se revisan todos los estados alcanzables paso a paso: con ${n - 1} no se llega a la meta. El mínimo es ${n}.`]);
    return {
      id: `rm-trasvases#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      figura: { svg: figuraRecipientes(d, ini, 'al inicio'), alt: altRecipientes(d, ini) },
      figuraSolucion: { svg: figuraTabla(d, sol), alt: altTabla(d, sol) },
      respuesta: { valor: n, unidad },
      _datos: d,
    };
  }

  function datosBarriles(rng) {
    const barr = new Set();
    while (barr.size < 6) barr.add(rng.entero(8, 40));
    const lista = [...barr].sort((a, b) => a - b);
    return { tipo: 'barriles', barriles: lista, k: rng.elegir([1, 2, 2, 3]), contexto: rng.elegir(['chicha', 'aceite', 'leche']) };
  }
  function construirBarriles(d, semilla, rng) {
    const r = barriles(d);
    if (r.queda === null) return null;
    const T = d.barriles.reduce((s, x) => s + x, 0), k = d.k;
    const errores = [];
    for (const c of r.candidatos) if (c !== r.queda) errores.push(h('RMP12-sin-reparto', c, `Con ese barril los litros vendidos (${T - c}) sí se dividen en ${k + 1} partes iguales, pero con barriles enteros no se arma un pedido de ${(T - c) / (k + 1)} L. Hay que comprobar que los barriles formen los dos pedidos.`));
    if (k >= 2) for (const c of d.barriles) if (c !== r.queda && !r.candidatos.includes(c) && (T - c) % k === 0) errores.push(h('RMP13-entre-k', c, `Dividiste lo vendido entre ${k}. Si el segundo se lleva ${k} veces lo del primero, lo vendido son ${k} + 1 = ${k + 1} partes iguales, no ${k}.`));
    for (const c of d.barriles) if (c !== r.queda && !r.candidatos.includes(c) && c % (k + 1) === 0) errores.push(h('RMP13-al-que-queda', c, k === 1
      ? `Buscaste un barril de capacidad par, pero lo que debe ser par es lo vendido (${T} − el que queda), porque se reparte en dos partes iguales. Con ese barril se venderían ${T - c} L, que no se parte en dos.`
      : `Buscaste un barril múltiplo de ${k + 1}, pero lo que debe ser múltiplo de ${k + 1} es lo vendido (${T} − el que queda). Con ese barril se venderían ${T - c} L, que no se parte en ${k + 1} partes iguales.`));
    const alternativas = P.armar({ correcta: r.queda, errores, rng, unidad: 'L', decimales: 0 });
    if (alternativas.length < 4) return null;
    const c = CONTEXTOS[d.contexto];
    const relacion = k === 1 ? 'la misma cantidad de litros que el primero' : `el ${k === 2 ? 'doble' : 'triple'} de litros que el primero`;
    const variables = { k: { nombre: 'relación entre los pedidos', color: 'o' }, T: { nombre: 'litros en total', color: 'i' } };
    const enunciado = [`Un comerciante tiene seis barriles de ${c.liquido} de ${lista(d.barriles)} litros, todos llenos. Vende barriles enteros, sin abrirlos, a dos clientes: el segundo se lleva `, v('k', relacion), '. Al final le queda un solo barril.'];
    const pregunta = ['¿De cuántos litros es el barril que le queda?'];
    const S1 = (T - r.queda) / (k + 1);
    const solucion = [
      ['Entre los seis barriles hay ', v('T', `${T} L`), '.'],
      ['Si el primero se lleva una parte, el segundo se lleva ', v('k', k === 1 ? 'otra igual' : `${k} partes`), `: lo vendido son ${k + 1} partes iguales. Entonces ${T} − (barril que queda) debe ser múltiplo de ${k + 1}.`],
      [`Cumplen eso ${r.candidatos.length === 1 ? 'solo el barril' : 'los barriles'} de ${lista(r.candidatos)} L.`],
      ...r.candidatos.filter(x => x !== r.queda).map(x => [`Si quedara el de ${x} L, el primero se llevaría ${(T - x) / (k + 1)} L, y ningún grupo de los otros barriles suma eso: se descarta.`]),
      [`Si queda el de ${r.queda} L, el primero se lleva ${S1} L con ${grupo(r.primero)}, y el segundo ${S1 * k} L con ${grupo(r.segundo)}. Funciona.`],
      [`Queda el barril de ${r.queda} L.`],
    ];
    const ancho = 400;
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} 150" font-size="16" fill="currentColor">`;
    d.barriles.forEach((b, i) => {
      const x = 12 + i * 64, alto = 40 + Math.round(60 * b / 40);
      svg += `<rect x="${x}" y="${120 - alto}" width="52" height="${alto}" rx="12" fill="none" stroke="currentColor" stroke-width="2"/>`;
      svg += `<line x1="${x}" y1="${120 - alto * 0.7}" x2="${x + 52}" y2="${120 - alto * 0.7}" style="stroke:var(--muted)"/><line x1="${x}" y1="${120 - alto * 0.3}" x2="${x + 52}" y2="${120 - alto * 0.3}" style="stroke:var(--muted)"/>`;
      svg += `<text x="${x + 26}" y="${120 - alto / 2 + 6}" text-anchor="middle" font-weight="bold">${P.xml(b)}</text><text x="${x + 26}" y="140" text-anchor="middle" font-size="14" style="fill:var(--muted)">litros</text>`;
    });
    svg += '</svg>';
    return {
      id: `rm-trasvases#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      figura: { svg, alt: `Seis barriles llenos, con sus capacidades escritas: ${d.barriles.join(', ')} litros.` },
      respuesta: { valor: r.queda, unidad: 'L' },
      _datos: d,
    };
  }

  return { id: 'rm-trasvases', titulo: 'Recipientes sin marcas: trasvases y repartos', generar, calc: { minimo, rutas, barriles, aMeta, jugadas } };
});
