/*
 * Pieza «geo-objeto» (17 nov 2026): objetos de la vida real para la teoría de «Segmentos y ángulos»
 * (contenido/teoria/geometria/segmentos-y-angulos.js). Dibujos de prueba (data-prueba): Gerson decide después cuáles
 * reemplaza (docs/plan-calidad.md, M4). Las ideas siguientes de la unidad agregan aquí sus objetos (la soga, la tranquera,
 * los rieles, el pasaje entre avenidas; docs/etapa3/propuesta-geometria.md §2).
 *
 * Afirmación de la figura: un segmento es un tramo de carretera entre dos paraderos, y su medida es lo que recorre la
 * combi. Cada tramo lleva su medida pegada (una cota encima de la pista o el camino mismo, si sale de la pista).
 *
 * Fidelidad: una sola escala para los dos ejes: los tramos, el desvío y la regla del mapa se dibujan a escala con sus
 * medidas (km o m). El ancho de la pista no está a escala: es el símbolo del mapa.
 *
 * Objetos:
 *   carretera  una carretera recta vista desde arriba, como en un mapa: la pista con su línea discontinua, los paraderos
 *              al borde de abajo (puntos con su letra debajo) y, si se pide, la combi en el carril de arriba
 *   recta      la misma figura en versión de examen: una recta con sus puntos, sin pista ni combi
 *
 * datos = {
 *   objeto: 'carretera' | 'recta',
 *   vista: [desde, hasta],          opcional: el tramo de la carretera que se ve, en km (o m); fija la escala (el juego,
 *                                   para que el paradero siga al dedo). Si no va, se ajusta a los puntos
 *   puntos: [{ id: 'A', km: 0 }, { id: 'B', km: 4, alto: 3 }],   alto: a cuánto queda de la carretera (fuera de ella,
 *                                   arriba), en la misma unidad; sin alto, en la carretera
 *   tramos: [{ de: 'A', a: 'B', papel: 'dato' | 'todo' | 'pide', texto, nivel, paso }],
 *            papel (decide el color; la unidad no lo elige a mano, regla de colores de la unidad):
 *              todo  el segmento de punta a punta, el viaje directo: en tinta
 *              pide  lo que se pide, con «?»: en tinta, para que el color no lo delate
 *              dato  un tramo que se junta con otro: el primero (de izquierda a derecha) naranja, el segundo turquesa
 *            texto: la medida («4 km», «?», «2k») o [{ t, paso }] (se ve el último cuyo paso ya llegó; t: null lo oculta)
 *            nivel: 1, 2 o 3 (cotas encima de la pista, de abajo hacia arriba) o −1, −2 (debajo de las letras); si un
 *            extremo está fuera de la carretera, el tramo es un camino recto y nivel no se usa
 *            paso: desde qué paso de «Mira» se ve el tramo
 *   alturas: [{ punto: 'B', texto: '3 km', paso }],   la distancia de un punto de afuera a la carretera, punteada, con su medida al pie (debajo de la pista)
 *   reglas: [{ de: 'A', a: 'B', texto: '5 km', paso }],   la regla del mapa apoyada en un tramo, con su lectura
 *   combi: 2,                       opcional: la combi en el carril de arriba, con su frente en ese km (solo carretera)
 *   hitos: 1,                       opcional: una marca en el borde de la pista cada tantos km
 *   nota: '5 + 6,7 ≈ 11,7 km',      opcional: una línea arriba, al centro (un texto o [{ t, paso }]; sin cotas de nivel 3)
 * }
 * estado = { paso: 0..n, final }. Sin paso, se ve todo. Función pura de (datos, estado): sin ids, sin azar, sin reloj.
 * Lienzo de 320 de ancho. El alto se recorta a lo que la figura declara (cotas de nivel 1 a 3 arriba, −1 y −2 abajo, un
 * punto fuera de la carretera, la nota): sin franjas vacías arriba ni abajo. Como sale de la forma de los datos y no del
 * estado, un juego o un «Mira» no cambian de alto al moverse. Colores: currentColor (tinta) y var(--c-*).
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
  const W = 320, H = 240, M = 4;
  const X0 = 22, X1 = 298;                        // dónde caben los puntos
  const TOP = 104, BOT = 140, CENTRO = 122;       // la pista; los paraderos van en su borde de abajo
  const LETRA = 162;                              // línea base de las letras de los paraderos
  const NIVEL = { 1: 88, 2: 58, 3: 28, '-1': 182, '-2': 212 };
  const CW = 30, CH = 15;                         // la combi
  const OBJETOS = ['carretera', 'recta'];
  const COLORES_DATO = ['o', 'i', 'd'];
  const n = T.n;
  const f = x => Kit.formatear(x, 2);
  const tinta = (g = 2) => `stroke="currentColor" stroke-width="${g}" stroke-linecap="round" stroke-linejoin="round"`;

  // Lo que se ve de un texto con pasos: el último cuyo paso ya llegó (null si ninguno, o si ese dice t: null).
  const textoEn = (t, p) => {
    if (t === undefined || t === null || t === '') return null;
    if (!Array.isArray(t)) return String(t);
    let out = null;
    for (const x of t) if (x && (x.paso || 0) <= p) out = x.t === null || x.t === undefined ? null : String(x.t);
    return out;
  };
  const visible = (x, p) => !x || !(x.paso > p);
  const pasoDe = estado => (estado && estado.final ? Infinity : estado && Number.isFinite(estado.paso) ? estado.paso : Infinity);

  // Escala y posiciones: una sola escala (px por km) para lo largo y lo alto.
  function geometria(d = {}) {
    const pts = d.puntos || [];
    const kms = pts.map(p => +p.km).filter(Number.isFinite);
    const lo = kms.length ? Math.min(...kms) : 0, hi = kms.length ? Math.max(...kms) : 10;
    let desde, hasta;
    if (Array.isArray(d.vista) && d.vista.length === 2 && d.vista[1] > d.vista[0]) [desde, hasta] = d.vista;
    else { const pad = Math.max(0.6, (hi - lo || 1) * 0.07); desde = lo - pad; hasta = hi + pad; }
    const altoMax = Math.max(0, ...pts.map(p => +p.alto || 0));
    let s = (X1 - X0) / (hasta - desde);
    if (altoMax > 0) s = Math.min(s, (BOT - 34) / altoMax);
    const cx = (X0 + X1) / 2, medio = (desde + hasta) / 2;
    const X = km => cx + (km - medio) * s;
    const Y = alto => BOT - (alto || 0) * s;
    const P = {};
    for (const p of pts) P[p.id] = [X(+p.km), Y(+p.alto)];
    const km = x => medio + (x - cx) / s;
    return { s, X, Y, km, P, desde, hasta, TOP, BOT, CENTRO };
  }

  const fuera = (d, id) => { const p = (d.puntos || []).find(x => x.id === id); return !!(p && +p.alto > 0); };
  const kmDe = (d, id) => { const p = (d.puntos || []).find(x => x.id === id); return p ? +p.km : NaN; };
  const nombre = t => `${t.de}${t.a}`;
  const clave = s => String(s).split('').sort().join('');

  // El color de cada tramo sale de su papel (regla de colores de la unidad): todo y pide en tinta; los datos, en el
  // orden de la carretera (de izquierda a derecha: primero el que empieza antes; si empiezan juntos, el que acaba antes),
  // naranja el primero y turquesa el segundo. Devuelve { AB: 'o', BC: 'i', AC: null }.
  function colores(d = {}) {
    const out = {}, ts = d.tramos || [];
    const datos = ts.filter(t => (t.papel || 'dato') === 'dato').map(t => {
      const a = kmDe(d, t.de), b = kmDe(d, t.a);
      return { t, lo: Math.min(a, b), hi: Math.max(a, b) };
    }).sort((x, y) => x.lo - y.lo || x.hi - y.hi);
    for (const t of ts) out[nombre(t)] = null;
    datos.forEach((x, k) => { out[nombre(x.t)] = COLORES_DATO[Math.min(k, COLORES_DATO.length - 1)]; });
    return out;
  }
  // Busca el color de un tramo por su nombre en cualquier orden de letras («BA» es «AB»).
  function colorDe(d, nom) {
    const cs = colores(d), k = clave(nom);
    for (const [t, c] of Object.entries(cs)) if (clave(t) === k) return c;
    return undefined;
  }

  // La combi (dibujo de prueba), con su frente en x, en el carril de arriba. Igual en espíritu a la de fis-combi.
  function combi(x) {
    const x0 = x - CW, y = CENTRO - 2;
    let s = `<path d="M${n(x0)} ${n(y - 3)}L${n(x0)} ${n(y - CH + 3)}Q${n(x0)} ${n(y - CH)} ${n(x0 + 3)} ${n(y - CH)}L${n(x - 8)} ${n(y - CH)}L${n(x)} ${n(y - 8)}L${n(x)} ${n(y - 3)}Z" fill="var(--card)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    s += `<rect x="${n(x0 + 4)}" y="${n(y - CH + 3)}" width="7" height="5" rx="1.2" fill="currentColor" fill-opacity="0.3"/>`
      + `<rect x="${n(x0 + 13)}" y="${n(y - CH + 3)}" width="7" height="5" rx="1.2" fill="currentColor" fill-opacity="0.3"/>`;
    for (const c of [x0 + 7, x - 7]) s += `<circle cx="${n(c)}" cy="${n(y - 1)}" r="3.2" fill="currentColor"/>`;
    return `<g class="kit-objeto" data-objeto="combi" data-prueba="si">${s}</g>`;
  }

  // Una cota horizontal (tramo en la carretera) con su medida encima (nivel > 0) o debajo (nivel < 0).
  function cota(x1, x2, nivel, texto, color) {
    const y = NIVEL[nivel] || NIVEL[1], c = T.color(color), g = color ? 3 : 2;
    const a = Math.min(x1, x2), b = Math.max(x1, x2);
    let s = `<line x1="${n(a)}" y1="${n(y)}" x2="${n(b)}" y2="${n(y)}" stroke="${c}" stroke-width="${g}" stroke-linecap="round"/>`
      + `<line x1="${n(a)}" y1="${n(y - 4)}" x2="${n(a)}" y2="${n(y + 4)}" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`
      + `<line x1="${n(b)}" y1="${n(y - 4)}" x2="${n(b)}" y2="${n(y + 4)}" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`;
    if (texto) s += T.rotulo((a + b) / 2, nivel < 0 ? y + 19 : y - 10, texto, { ancla: 'middle', peso: 700, color, min: M, max: W - M });
    return s;
  }
  // La normal de p→q que apunta hacia arriba (afuera de la carretera).
  const normalArriba = (p, q) => {
    const dx = q[0] - p[0], dy = q[1] - p[1], L = Math.hypot(dx, dy) || 1;
    let nx = -dy / L, ny = dx / L;
    if (ny > 0 || (ny === 0 && nx > 0)) { nx = -nx; ny = -ny; }
    return [nx, ny];
  };
  // Un rótulo junto a un punto, del lado de la normal: el ancla sigue a la normal para no pisar la línea.
  function rotuloNormal(P, nv, texto, color, tam = 16) {
    const ancla = Math.abs(nv[0]) < 0.35 ? 'middle' : nv[0] > 0 ? 'start' : 'end';
    return T.rotulo(P[0], P[1] + (nv[1] > 0.35 ? 13 : nv[1] < -0.35 ? -3 : 5), texto, { ancla, peso: 700, tam, color, min: M, max: W - M });
  }

  // La regla del mapa apoyada en un tramo p→q: una tira con una marca por km y su lectura.
  function reglaEn(p, q, s, texto) {
    const nv = normalArriba(p, q), L = Math.hypot(q[0] - p[0], q[1] - p[1]), u = [(q[0] - p[0]) / L, (q[1] - p[1]) / L];
    const off = (pt, k) => [pt[0] + nv[0] * k, pt[1] + nv[1] * k];
    const a = off(p, 9), b = off(q, 9), c = off(q, 19), e = off(p, 19);
    let out = `<path d="M${n(a[0])} ${n(a[1])}L${n(b[0])} ${n(b[1])}L${n(c[0])} ${n(c[1])}L${n(e[0])} ${n(e[1])}Z" fill="currentColor" fill-opacity="0.1" ${tinta(1.5)}/>`;
    const km = L / s;
    for (let k = 0; k <= km + 1e-9; k++) {
      const t = [p[0] + u[0] * k * s, p[1] + u[1] * k * s], t1 = off(t, 9), t2 = off(t, 14);
      out += `<line x1="${n(t1[0])}" y1="${n(t1[1])}" x2="${n(t2[0])}" y2="${n(t2[1])}" ${tinta(1.2)}/>`;
    }
    if (texto) out += rotuloNormal(off([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], 24), nv, texto);
    return `<g class="kit-objeto" data-objeto="regla" data-prueba="si">${out}</g>`;
  }

  function dibujar(d = {}, estado = {}) {
    const g = geometria(d), p = pasoDe(estado), cs = colores(d), carretera = d.objeto !== 'recta';
    let s = '';
    // La pista (o la recta de examen).
    if (carretera) {
      let pista = `<rect x="8" y="${TOP}" width="${W - 16}" height="${BOT - TOP}" fill="currentColor" fill-opacity="0.09"/>`
        + `<line x1="8" y1="${TOP}" x2="${W - 8}" y2="${TOP}" ${tinta(2)}/>`
        + `<line x1="8" y1="${BOT}" x2="${W - 8}" y2="${BOT}" ${tinta(2)}/>`
        + `<line x1="12" y1="${CENTRO}" x2="${W - 12}" y2="${CENTRO}" stroke="currentColor" stroke-width="1.5" stroke-dasharray="8 8" stroke-opacity="0.35"/>`;
      if (+d.hitos > 0) for (let k = Math.ceil(g.desde / d.hitos) * d.hitos; k <= g.hasta + 1e-9; k += +d.hitos) {
        const x = g.X(k);
        if (x > 10 && x < W - 10) pista += `<line x1="${n(x)}" y1="${TOP}" x2="${n(x)}" y2="${TOP - 5}" ${tinta(1.2)}/>`;
      }
      s += `<g class="kit-objeto" data-objeto="carretera" data-prueba="si">${pista}</g>`;
    } else s += `<line x1="8" y1="${BOT}" x2="${W - 8}" y2="${BOT}" ${tinta(2)}/>`;
    if (carretera && Number.isFinite(+d.combi) && d.combi !== null && d.combi !== '') s += combi(Math.max(8 + CW, Math.min(W - 8, g.X(+d.combi))));

    // Alturas: de un punto de afuera a la carretera, punteada, con su medida al lado.
    for (const al of d.alturas || []) {
      if (!visible(al, p)) continue;
      const q = g.P[al.punto];
      if (!q) continue;
      s += `<line x1="${n(q[0])}" y1="${n(q[1] + 6)}" x2="${n(q[0])}" y2="${BOT}" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4"/>`;
      // La medida va al pie, debajo de la pista, donde no la cruza ningún camino (a la altura de las letras).
      const t = textoEn(al.texto, p);
      if (t) s += T.rotulo(q[0], LETRA, t, { ancla: 'middle', peso: 700, min: M, max: W - M });
    }

    // Tramos: cota en la carretera o camino recto si sale de ella.
    for (const t of d.tramos || []) {
      if (!visible(t, p)) continue;
      const a = g.P[t.de], b = g.P[t.a];
      if (!a || !b) continue;
      const color = cs[nombre(t)] || undefined, texto = textoEn(t.texto, p);
      if (!fuera(d, t.de) && !fuera(d, t.a)) { s += cota(a[0], b[0], t.nivel || 1, texto, color); continue; }
      s += `<line x1="${n(a[0])}" y1="${n(a[1])}" x2="${n(b[0])}" y2="${n(b[1])}" stroke="${T.color(color)}" stroke-width="${color ? 3 : 2}" stroke-linecap="round"/>`;
      if (texto) {
        const nv = normalArriba(a, b), mid = [(a[0] + b[0]) / 2 + nv[0] * 10, (a[1] + b[1]) / 2 + nv[1] * 10];
        s += rotuloNormal(mid, nv, texto, color);
      }
    }
    // La regla del mapa.
    for (const r of d.reglas || []) {
      if (!visible(r, p)) continue;
      const a = g.P[r.de], b = g.P[r.a];
      if (a && b) s += reglaEn(a, b, g.s, textoEn(r.texto, p));
    }

    // Paraderos: los de la carretera, en su borde de abajo, con la letra debajo; los de afuera, con la letra encima.
    // Letras de puntos muy juntos (o en el mismo lugar) se reparten para no pisarse.
    const enPista = (d.puntos || []).filter(q => !(+q.alto > 0)).map((q, k) => ({ q, k, x: g.P[q.id][0] })).sort((u, v) => u.x - v.x || u.k - v.k);
    const grupos = [];
    for (const e of enPista) { const ult = grupos[grupos.length - 1]; if (ult && e.x - ult[ult.length - 1].x < 16) ult.push(e); else grupos.push([e]); }
    for (const q of d.puntos || []) {
      const [x, y] = g.P[q.id];
      s += carretera || +q.alto > 0 ? `<circle cx="${n(x)}" cy="${n(y)}" r="5.5" fill="var(--card)" ${tinta(2.5)}/>` : `<circle cx="${n(x)}" cy="${n(y)}" r="4" fill="currentColor"/>`;
      // Si una regla del mapa llega a este punto, la letra sube para que la regla no la tape.
      const conRegla = (d.reglas || []).some(r => visible(r, p) && (r.de === q.id || r.a === q.id));
      if (+q.alto > 0) s += T.rotulo(x, y - (conRegla ? 30 : 11), q.id, { ancla: 'middle', peso: 700, min: M, max: W - M });
    }
    for (const gr of grupos) {
      const medio = gr.reduce((t, e) => t + e.x, 0) / gr.length, paso = 15;
      gr.forEach((e, k) => { s += T.rotulo(medio + (k - (gr.length - 1) / 2) * paso, LETRA, e.q.id, { ancla: 'middle', peso: 700, min: M, max: W - M }); });
    }
    const nota = textoEn(d.nota, p);
    if (nota) s += T.rotulo(W / 2, 20, nota, { ancla: 'middle', peso: 700, min: M, max: W - M });
    const { top, alto } = marco(d, g);
    return T.svg(W, alto, s, { alt: alt(d) }).replace(`viewBox="0 0 ${W} ${n(alto)}"`, `viewBox="0 ${n(top)} ${W} ${n(alto)}"`);
  }

  // El recorte vertical: desde lo más alto que la figura puede dibujar hasta lo más bajo, con su margen. Depende solo de
  // qué trae la figura (niveles, puntos de afuera, reglas, nota), nunca del paso ni de los valores del juego.
  function marco(d = {}, g = geometria(d)) {
    const carretera = d.objeto !== 'recta';
    let top = carretera ? TOP - 18 : BOT - 24, bot = LETRA + 10;
    const niveles = (d.tramos || []).filter(t => !fuera(d, t.de) && !fuera(d, t.a)).map(t => t.nivel || 1);
    for (const nv of niveles) {
      if (nv > 0) top = Math.min(top, NIVEL[nv] - 30);
      else bot = Math.max(bot, NIVEL[nv] + 28);
    }
    for (const q of d.puntos || []) if (+q.alto > 0) {
      const conRegla = (d.reglas || []).some(r => r.de === q.id || r.a === q.id);
      top = Math.min(top, g.P[q.id][1] - (conRegla ? 52 : 32));
    }
    if (d.nota) top = 0;
    top = Math.max(0, Math.min(top, H)); bot = Math.min(H, bot);
    return { top, alto: bot - top };
  }

  function alt(d = {}) {
    const que = d.objeto === 'recta' ? 'Una recta con los puntos' : 'Una carretera recta vista desde arriba, con los paraderos';
    const pts = (d.puntos || []).map(q => `${q.id}${+q.alto > 0 ? ` (fuera de la carretera, a ${f(+q.alto)} de ella)` : ''}`).join(', ');
    const ts = (d.tramos || []).map(t => `${nombre(t)}: ${textoEn(t.texto, Infinity) || 'sin medida'}`).join('; ');
    return `${que} ${pts || 'sin puntos'}${ts ? `. Tramos ${ts}` : ''}${d.combi !== undefined && d.objeto !== 'recta' ? '. Una combi en la pista' : ''}.`;
  }

  return { id: 'geo-objeto', dibujar, alt, geometria, marco, colores, colorDe, OBJETOS, constantes: { W, H, M, TOP, BOT, CENTRO, LETRA, NIVEL, X0, X1 } };
});
