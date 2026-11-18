/*
 * Pieza «fis-pista» (18 nov 2026, Movimiento rectilíneo uniforme, idea 3 «Velocidad media y rapidez media»;
 * docs/etapa4/propuesta-fisica.md §2, A3): la recta de la pista atlética del colegio, vista de costado, con sus carriles,
 * la regla de metros desde la partida, una valla y quien corre. Arriba, el camino: la ida y la vuelta como dos flechas
 * (todo el camino es la distancia recorrida); abajo de la regla, la llave del desplazamiento, de la partida a donde
 * terminó. Dibujos de prueba (data-prueba); Gerson decide después cuáles reemplaza.
 *
 * Afirmación de la figura: la distancia recorrida es todo el camino, ida más vuelta; el desplazamiento solo mira dónde
 * empezó y dónde terminó.
 *
 * datos = {
 *   largo: 60, paso: 10, numero: 20,       // m: la regla, desde la partida (0); rayita cada paso, número cada `numero`
 *   valla: 60,                             // m: dónde está la valla (sin valla: null)
 *   corredor: 40, mira: 'izq',             // m: dónde está quien corre y hacia dónde mira (sin corredor: null)
 *   ida: { a: 60, texto: '2 m/s', color: 'o' },          // flecha de la partida hasta a, con su rótulo
 *   vuelta: { de: 60, a: 20, texto: '6 m/s', color: 'o' }, // flecha de vuelta, debajo de la de ida
 *   tramos: [{ de, a, texto, color, desde }],             // en vez de ida y vuelta: dos tramos cualesquiera (2 filas)
 *   dx: { a: 20, texto: 'Δx = ?', color: 'f' },          // llave del desplazamiento: de la partida a `a`
 *   reloj: { texto: 't = 40 s', color: 'i' },            // el cronómetro, arriba a la izquierda
 *   lugares: true,                          // «Partida» y «Valla» escritos bajo la figura
 * }
 * estado = { corte }: los tramos, la llave y el reloj con `desde` aparecen cuando corte ≥ desde («Mira»). Función pura: sin ids, sin azar, sin reloj. Ancho 320, alto fijo.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  const T = nodo ? require('../trazo.js') : root.Kit.trazo;
  const api = fabrica(Kit, T);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, T) {
  'use strict';
  const W = 320, H = 200, X0 = 30, X1 = 286, TXT = 14;
  const Y = { IDA: 30, VUELTA: 58, PISTA: 68, PISO: 108, EJE: 120, NUM: 140, LLAVE: 154, LLAVE_T: 172, LUGAR: 192 };
  const n = T.n;
  const BASE = { largo: 60, paso: 10, numero: 20, valla: 60, corredor: 0, mira: 'der', lugares: true };
  const fmt = m => Kit.formatear(m, 2).replace(/^-/, '−');
  const caja = (x, y, texto, ancla, peso = 400) => {
    const w = T.ancho(texto, TXT, peso), xx = T.encajar(x, texto, ancla, { tam: TXT, peso, min: 4, max: W - 4 });
    const izq = ancla === 'middle' ? xx - w / 2 : ancla === 'end' ? xx - w : xx;
    return { x0: izq, x1: izq + w, y0: y - TXT * 0.78, y1: y + TXT * 0.22, x: xx, y, texto, ancla, peso };
  };
  const separa = (c, otras) => otras.every(o => c.x1 + 3 < o.x0 || c.x0 > o.x1 + 3 || c.y1 <= o.y0 || c.y0 >= o.y1);

  function geometria(datos, estado = {}) {
    const d = Object.assign({}, BASE, datos || {}), corte = Number.isFinite(estado.corte) ? estado.corte : Infinity;
    const vis = o => !o || o.desde === undefined || corte >= o.desde;
    const X = m => X0 + (X1 - X0) * Math.max(0, Math.min(d.largo, m)) / d.largo;
    const g = { d, X, rotulos: [] };
    if (d.reloj && vis(d.reloj)) { g.reloj = caja(4, 18, d.reloj.texto, 'start', 700); g.rotulos.push(g.reloj); }
    // Una flecha del camino con su rótulo encima; si el rótulo chocaría con otro, se corre al lado libre.
    const tramo = (de, a, y, f) => {
      const t = { x1: X(de), x2: X(a), y, f, caja: null };
      if (f.texto) {
        let c = caja((t.x1 + t.x2) / 2, y - 8, f.texto, 'middle', 700);
        if (!separa(c, g.rotulos)) c = caja(Math.max(t.x1, t.x2) + 8, y + 5, f.texto, 'start', 700);
        if (!separa(c, g.rotulos) || c.x1 > W - 4) c = caja(Math.min(t.x1, t.x2) - 8, y + 5, f.texto, 'end', 700);
        t.caja = c; g.rotulos.push(c);
      }
      return t;
    };
    // Los tramos del camino: el primero arriba, el segundo debajo (ida y vuelta, o dos tramos hacia adelante).
    const tramos = d.tramos || [d.ida && Object.assign({ de: 0 }, d.ida), d.vuelta].filter(Boolean);
    g.tramos = [];
    tramos.slice(0, 2).forEach((f, k) => {
      if (!f || !vis(f) || Math.abs((f.de || 0) - f.a) < 1e-9) return;
      g.tramos.push(tramo(f.de || 0, f.a, k ? Y.VUELTA : Y.IDA, f));
    });
    g.numeros = [];
    for (let m = 0; m <= d.largo + 1e-9; m += d.paso) {
      if (Math.abs(m / d.numero - Math.round(m / d.numero)) < 1e-9) { const c = caja(X(m), Y.NUM, fmt(Math.round(m * 100) / 100), 'middle'); g.numeros.push(c); g.rotulos.push(c); }
    }
    g.unidad = caja(W - 4, Y.NUM, 'm', 'end', 700); g.rotulos.push(g.unidad);
    if (d.dx && vis(d.dx)) {
      const a = X(0), b = X(d.dx.a);
      g.dx = { a: Math.min(a, b), b: Math.max(a, b), caja: d.dx.texto ? caja((a + b) / 2, Y.LLAVE_T, d.dx.texto, 'middle', 700) : null };
      if (g.dx.caja) g.rotulos.push(g.dx.caja);
    }
    if (d.lugares) {
      g.lugares = [caja(X(0), Y.LUGAR, 'Partida', 'start')];
      if (Number.isFinite(d.valla)) g.lugares.push(caja(X(d.valla), Y.LUGAR, 'Valla', 'end'));
      g.rotulos.push(...g.lugares);
    }
    return g;
  }

  // Quien corre (palitos): cabeza, torso inclinado, un brazo adelante y otro atrás, una pierna en el aire.
  function corredor(x, mira) {
    const k = mira === 'izq' ? -1 : 1, p = Y.PISO, X = dx => n(x + k * dx);
    const s = `<circle cx="${X(3)}" cy="${n(p - 31)}" r="5" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`
      + `<path d="M${X(2)} ${n(p - 26)}L${X(-1)} ${n(p - 14)}M${X(-1)} ${n(p - 14)}L${X(5)} ${n(p - 7)}L${X(3)} ${n(p)}M${X(-1)} ${n(p - 14)}L${X(-7)} ${n(p - 6)}L${X(-12)} ${n(p - 8)}`
      + `M${X(1)} ${n(p - 23)}L${X(7)} ${n(p - 18)}L${X(11)} ${n(p - 22)}M${X(1)} ${n(p - 23)}L${X(-5)} ${n(p - 19)}L${X(-8)} ${n(p - 14)}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    return `<g class="kit-objeto" data-objeto="corredor" data-prueba="si">${s}</g>`;
  }
  // La valla de atletismo vista de costado: dos patas en el piso y el travesaño arriba.
  function valla(x) {
    const p = Y.PISO;
    return `<g class="kit-objeto" data-objeto="valla" data-prueba="si"><path d="M${n(x - 6)} ${p}L${n(x + 4)} ${p}M${n(x)} ${p}L${n(x)} ${n(p - 20)}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`
      + `<rect x="${n(x - 2)}" y="${n(p - 24)}" width="4" height="7" rx="1" fill="currentColor"/></g>`;
  }

  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado), d = g.d, X = g.X;
    const rot = (b, color) => T.rotulo(b.x, b.y, b.texto, { ancla: b.ancla, peso: b.peso, color, tam: TXT, min: 4, max: W - 4 });
    // la pista: el carril con su línea de llegada en la partida y las líneas de los carriles
    let s = `<g data-prueba="si" class="fis-pista"><rect x="6" y="${Y.PISTA}" width="${W - 12}" height="${Y.PISO - Y.PISTA + 4}" rx="5" fill="currentColor" fill-opacity="0.08"/>`;
    for (const y of [Y.PISTA + 13, Y.PISTA + 26]) s += `<line x1="10" y1="${y}" x2="${W - 10}" y2="${y}" stroke="currentColor" stroke-width="1" stroke-opacity="0.3"/>`;
    s += `<line x1="${n(X(0))}" y1="${Y.PISTA}" x2="${n(X(0))}" y2="${Y.PISO + 4}" stroke="currentColor" stroke-width="3" stroke-dasharray="4 3"/></g>`;
    // la regla de metros desde la partida
    s += `<line x1="${n(X(0))}" y1="${Y.EJE}" x2="${n(X(d.largo))}" y2="${Y.EJE}" stroke="currentColor" stroke-width="1.5"/>`;
    for (let m = 0; m <= d.largo + 1e-9; m += d.paso) {
      const esN = Math.abs(m / d.numero - Math.round(m / d.numero)) < 1e-9;
      s += `<line x1="${n(X(m))}" y1="${Y.EJE}" x2="${n(X(m))}" y2="${Y.EJE + (esN ? 8 : 5)}" stroke="currentColor" stroke-width="1"/>`;
    }
    for (const c of g.numeros) s += rot(c);
    s += rot(g.unidad);
    if (Number.isFinite(d.valla)) s += valla(X(d.valla));
    if (Number.isFinite(d.corredor)) s += corredor(X(d.corredor), d.mira);
    // el camino: ida y vuelta
    for (const t of g.tramos) {
      s += T.flecha(t.x1, t.y, t.x2, t.y, { grosor: 3 });
      if (t.caja) s += rot(t.caja, t.f.color);
    }
    if (g.dx) {
      const k = T.color(d.dx.color);
      s += `<path d="M${n(g.dx.a)} ${Y.LLAVE - 6}V${Y.LLAVE}H${n(g.dx.b)}V${Y.LLAVE - 6}" fill="none" stroke="${k}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
      if (g.dx.caja) s += rot(g.dx.caja, d.dx.color);
    }
    if (g.reloj) s += rot(g.reloj, d.reloj.color);
    for (const c of g.lugares || []) s += rot(c);
    return T.svg(W, H, s, { alt: alt(datos) });
  }

  function alt(datos) {
    const d = Object.assign({}, BASE, datos || {});
    let s = `La recta de la pista atlética, con una regla de ${fmt(d.largo)} m desde la partida`;
    s += Number.isFinite(d.valla) ? ` y una valla a ${fmt(d.valla)} m.` : '.';
    const tramos = d.tramos || [d.ida && Object.assign({ de: 0 }, d.ida), d.vuelta].filter(Boolean);
    tramos.slice(0, 2).forEach((f, k) => { if (f) s += ` ${k ? 'Debajo, otro tramo' : 'Arriba, un tramo'}: de ${fmt(f.de || 0)} m a ${fmt(f.a)} m${f.texto ? ` (${f.texto})` : ''}.`; });
    if (d.dx) s += ` Bajo la regla, el desplazamiento desde la partida: ${d.dx.texto || ''}.`;
    return s;
  }

  return { id: 'fis-pista', dibujar, alt, geometria, constantes: { W, H, X0, X1, Y } };
});
