/*
 * Pieza «fis-ventana» (18 nov 2026, Movimiento rectilíneo uniforme, idea 5 «Velocidad relativa»; docs/etapa4/propuesta-fisica.md
 * §2, A5): tu combi A y otra combi B en la carretera, cada una en su carril, vistas dos veces en el mismo instante.
 * Arriba, desde la orilla de la carretera: los postes quietos y las dos combis andando. Abajo, desde tu ventana: tu combi
 * quieta en el centro, los postes que pasan hacia atrás y la otra combi con la diferencia de las velocidades.
 * Dibujo de prueba (data-prueba); Gerson decide después si lo reemplaza.
 *
 * Afirmación de la figura: desde tu combi, tú estás quieto; lo demás se mueve con su velocidad menos la tuya.
 *
 * datos = {
 *   vA: 15, vB: 10,          // m/s, con signo (+ hacia la derecha), medidas desde la carretera
 *   t: 2,                    // s: el instante dibujado (las dos combis salen juntas, una al lado de la otra)
 *   rotuloRel: '?',          // opcional: lo que se pide de B abajo, sin flecha (por omisión, su rapidez relativa en m/s)
 *   textoA, textoB: '54 km/h',   // opcional: los rótulos de arriba (textoB '?' quita la flecha de B: es lo que se pide)
 *   sinB: true,              // opcional: sin la otra combi (solo tu combi y los postes)
 *   postes: true,            // opcional, con sinB: abajo, la flecha de los postes que pasan hacia atrás, con su rapidez
 *   titulos: true,
 * }
 * Ronda 2 del lector en frío (18 nov): «las dos combis están casi una encima de la otra y no tienen letra». B sale
 * ATRAS_B px detrás de A (los dos carriles se tocaban con las combis lado a lado) y cada combi lleva su letra en la
 * ventana de atrás. La separación de salida no cambia lo que se ve: desde tu ventana, B se mueve con vB − vA.
 * estado = {}. Función pura de (datos, estado): sin ids, sin azar, sin reloj. Ancho 320, alto fijo. Lo que sale de la
 * franja se recorta (svg anidado, sin ids).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const Kit = nodo ? require('../kit.js') : root.Kit;
  const T = nodo ? require('../trazo.js') : root.Kit.trazo;
  if (nodo) require('./fis-combi.js');
  const api = fabrica(Kit, T);
  Kit.registrar(api);
  if (nodo) module.exports = api;
})(typeof self !== 'undefined' ? self : this, function (Kit, T) {
  'use strict';
  const W = 320, FRANJA = 110, H = 2 * FRANJA + 4, TXT = 14, PXM = 2, CX = 150, POSTE = 20, ATRAS_B = 46, LETRA = 12;
  // Dentro de cada franja (y relativas): título, flecha de A, carretera, carril de A, carril de B, flecha de B.
  const F = { TITULO: 15, FLECHA_A: 27, CAMINO: 46, CARRIL_A: 65, CARRIL_B: 85, BORDE: 88, FLECHA_B: 98 };
  const n = T.n;
  const COMBI = () => Kit.piezas['fis-combi'];
  const fmt = m => Kit.formatear(m, 2).replace(/^-/, '−');
  const caja = (x, y, texto, ancla, peso = 700) => {
    const w = T.ancho(texto, TXT, peso), xx = T.encajar(x, texto, ancla, { tam: TXT, peso, min: 4, max: W - 4 });
    const izq = ancla === 'middle' ? xx - w / 2 : ancla === 'end' ? xx - w : xx;
    return { x0: izq, x1: izq + w, y0: y - TXT * 0.78, y1: y + TXT * 0.22, x: xx, y, texto, ancla, peso };
  };
  // Una flecha de velocidad (30 px, el mismo largo para toda rapidez: el número dice cuánto) y su rótulo del lado libre.
  function flecha(cx, y, v, texto) {
    if (!v) return { quieta: true, y, caja: caja(cx - 20, y + 5, texto, 'start') };
    const dir = v > 0 ? 1 : -1, x2 = cx + dir * 30, w = T.ancho(texto, TXT, 700);
    // del lado de la punta si cabe sin correrse; si no, del lado de la cola (nunca encima de la flecha)
    const cabe = dir > 0 ? x2 + 6 + w <= W - 4 : x2 - 6 - w >= 4;
    const c = cabe ? caja(dir > 0 ? x2 + 6 : x2 - 6, y + 5, texto, dir > 0 ? 'start' : 'end')
      : caja(dir > 0 ? cx - 6 : cx + 6, y + 5, texto, dir > 0 ? 'end' : 'start');
    return { x1: cx, x2, y, caja: c };
  }

  function geometria(datos) {
    const d = Object.assign({ vA: 15, vB: 10, t: 0, titulos: true }, datos || {}), t = Math.max(0, d.t || 0), g = { d, franjas: [], rotulos: [] };
    const rel = d.vB - d.vA;
    // arriba, desde la carretera: A sale de CX − 40 px y avanza; B sale a su lado
    const a0 = CX - 40, xa = a0 + d.vA * t * PXM, xb = a0 - ATRAS_B + d.vB * t * PXM;
    const postesArriba = [];
    for (let k = -8; k <= 18; k++) postesArriba.push(a0 + k * POSTE * PXM / 2);
    // abajo, desde tu ventana: A quieta en CX; los postes y B se mueven con su velocidad menos la de A
    const corr = (d.vA * t * PXM) % (POSTE * PXM / 2), postesAbajo = [];
    for (let k = -2; k <= 20; k++) postesAbajo.push(CX + k * POSTE * PXM / 2 - corr - POSTE * PXM / 2);
    const vis = fl => fl.quieta || (fl.x1 > 4 && fl.x1 < W - 4);
    const fr = [
      { y0: 0, titulo: 'Desde la orilla de la carretera', xa, xb, postes: postesArriba,
        fa: flecha(xa, F.FLECHA_A, d.vA, `A: ${d.textoA || (d.vA ? `${fmt(Math.abs(d.vA))} m/s` : 'quieta')}`),
        fb: flecha(xb, F.FLECHA_B, d.textoB === '?' ? 0 : d.vB, `B: ${d.textoB || (d.vB ? `${fmt(Math.abs(d.vB))} m/s` : 'quieta')}`) },
      { y0: FRANJA, titulo: 'Desde tu ventana, en A', xa: CX, xb: CX - ATRAS_B + rel * t * PXM, postes: postesAbajo,
        fa: flecha(CX, FRANJA + F.FLECHA_A, 0, 'A: quieta'),
        // con rotuloRel ('?'), lo que se pide: sin flecha, para que su sentido no dé la respuesta
        fb: flecha(CX - ATRAS_B + rel * t * PXM, FRANJA + F.FLECHA_B, d.rotuloRel ? 0 : rel, `B: ${d.rotuloRel || (rel ? `${fmt(Math.abs(rel))} m/s` : 'parece quieta')}`) },
    ];
    if (d.sinB) for (const f of fr) f.fb = null;
    // Los postes que pasan hacia atrás, abajo (Lee: «no hay ninguna flecha que lo diga»).
    if (d.sinB && d.postes && d.vA) fr[1].fb = flecha(CX + 70, FRANJA + F.FLECHA_B, -d.vA, `postes: ${fmt(Math.abs(d.vA))} m/s`);
    for (const f of fr) {
      if (d.titulos) { f.ct = caja(4, f.y0 + F.TITULO, f.titulo, 'start', 400); g.rotulos.push(f.ct); }
      for (const fl of [f.fa, f.fb].filter(Boolean)) { fl.ve = vis(fl); if (fl.ve) g.rotulos.push(fl.caja); }
      g.franjas.push(f);
    }
    return g;
  }

  function dibujar(datos) {
    const g = geometria(datos), d = g.d, V = COMBI().vehiculo;
    const rot = (b, color) => T.rotulo(b.x, b.y, b.texto, { ancla: b.ancla, peso: b.peso, color, tam: TXT, min: 4, max: W - 4 });
    let s = '';
    for (const f of g.franjas) {
      const y0 = f.y0;
      let dentro = `<rect x="6" y="${y0 + F.CAMINO}" width="${W - 12}" height="${F.BORDE - F.CAMINO}" rx="6" fill="currentColor" fill-opacity="0.08"/>`
        + `<line x1="10" y1="${y0 + (F.CAMINO + F.BORDE) / 2}" x2="${W - 10}" y2="${y0 + (F.CAMINO + F.BORDE) / 2}" stroke="currentColor" stroke-width="1.5" stroke-dasharray="8 8" stroke-opacity="0.35"/>`;
      for (const p of f.postes.filter(x => x >= 8 && x <= W - 8)) dentro += `<line x1="${n(p)}" y1="${y0 + F.CAMINO}" x2="${n(p)}" y2="${y0 + F.CAMINO - 6}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-opacity="0.6"/><circle cx="${n(p)}" cy="${y0 + F.CAMINO - 7}" r="2" fill="currentColor" fill-opacity="0.6"/>`;
      // Cada combi con su letra pintada en la ventana de atrás (la cola: del lado contrario al que mira), con un borde del
      // color de la tarjeta para que se lea sobre el vidrio. Fuera del grupo reflejado: la letra no sale al revés.
      const letra = (x, y, v, txt) => `<text class="kit-txt" x="${n(x + (v < 0 ? 1 : -1) * 11.5)}" y="${n(y - 9)}" fill="currentColor" stroke="var(--card)" stroke-width="3" paint-order="stroke" font-size="${LETRA}" font-weight="800" text-anchor="middle">${txt}</text>`;
      dentro += V('combi', f.xa, y0 + F.CARRIL_A, { izquierda: d.vA < 0 }) + letra(f.xa, y0 + F.CARRIL_A, d.vA, 'A');
      if (!d.sinB) dentro += V('combi', f.xb, y0 + F.CARRIL_B, { izquierda: d.vB < 0 }) + letra(f.xb, y0 + F.CARRIL_B, d.vB, 'B');
      // lo que sale de la franja se recorta
      s += `<svg x="0" y="${y0 + F.CAMINO - 10}" width="${W}" height="${F.BORDE - F.CAMINO + 12}" viewBox="0 ${y0 + F.CAMINO - 10} ${W} ${F.BORDE - F.CAMINO + 12}">${dentro}</svg>`;
      for (const fl of [f.fa, f.fb].filter(Boolean)) {
        if (!fl.ve) continue;
        if (!fl.quieta) s += T.flecha(fl.x1, fl.y, fl.x2, fl.y, { color: 'o', grosor: 3 });
        s += rot(fl.caja, 'o');
      }
      if (f.ct) s += rot(f.ct);
      s += `<line x1="8" y1="${y0 + FRANJA - 2}" x2="${W - 8}" y2="${y0 + FRANJA - 2}" stroke="currentColor" stroke-width="1" stroke-opacity="${y0 ? 0 : 0.25}"/>`;
    }
    return T.svg(W, H, `<g data-prueba="si" class="fis-ventana">${s}</g>`, { alt: alt(datos) });
  }

  function alt(datos) {
    const d = Object.assign({ vA: 15, vB: 10 }, datos || {}), rel = d.vB - d.vA;
    const hacia = v => (v > 0 ? 'hacia la derecha' : 'hacia la izquierda');
    const vel = (v, txt) => (txt === '?' ? 'con una velocidad que se pide' : txt ? `a ${txt}` : v ? `a ${fmt(Math.abs(v))} m/s ${hacia(v)}` : 'quieta');
    let s = `Una carretera vista dos veces. Desde la orilla, tu combi A va ${vel(d.vA, d.textoA)}`;
    if (d.sinB) return `${s}. Desde tu ventana, tu combi está quieta y los postes pasan hacia atrás${d.postes && d.vA ? `, a ${fmt(Math.abs(d.vA))} m/s` : ''}.`;
    s += ` y otra combi, B, en el carril vecino, va ${vel(d.vB, d.textoB)}. Desde tu ventana, tu combi está quieta, los postes pasan hacia atrás y B `;
    return s + (d.rotuloRel ? 'se mueve con la velocidad que se pide.' : rel ? `se mueve a ${fmt(Math.abs(rel))} m/s ${hacia(rel)}.` : 'parece quieta.');
  }

  return { id: 'fis-ventana', dibujar, alt, geometria, constantes: { W, H, FRANJA, F, CX, PXM, ATRAS_B } };
});
