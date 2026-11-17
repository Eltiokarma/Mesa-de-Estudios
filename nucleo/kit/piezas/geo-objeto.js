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
 * Objetos de una recta (ideas 1 y 2, con el formato de abajo):
 *   carretera  una carretera recta vista desde arriba, como en un mapa: la pista con su línea discontinua, los paraderos
 *              al borde de abajo (puntos con su letra debajo) y, si se pide, la combi en el carril de arriba
 *   recta      la misma figura en versión de examen: una recta con sus puntos, sin pista ni combi
 *   soga       el tira y afloja del colegio: el patio, la soga entre sus puntas (soga: ['A', 'C']), el pañuelo atado en un
 *              punto (panuelo: 'M') y la raya pintada en otro (raya: 'B'); lo demás, como la carretera
 *
 * Escenas con ángulos (ideas 3 a 6, 17 nov): los trazos, los arcos y los puntos los dibuja geo-figura a escala (los
 * ángulos con su valor real); esta pieza arma la figura desde unos pocos datos, le pone el objeto debajo (data-prueba)
 * y escribe los rótulos de los ángulos donde no pisan los lados (geo-figura los deja a 58 px como máximo y en ángulos
 * chicos caen sobre un lado). escena(datos) devuelve los datos de geo-figura que se dibujan (las pruebas miden ahí cada
 * ángulo contra su rótulo). Estado: { corte } de geo-figura (se ve lo que tiene desde ≤ corte).
 *   reloj      { relojes: [{ hora: 0..11, tam: 'plaza' | 'pulsera', arco: { texto, color, desde } | null, alarga: corte,
 *              rotulo }] }: uno o dos relojes a una hora en punto; el arco va del minutero (en las 12) al horario, en el
 *              sentido del reloj (más de 180°: el ángulo no convexo). alarga: desde qué corte se ven las agujas alargadas
 *   tranquera  { alfa, O: true, pista, poste, otro: { texto, color, desde } | null, bisectrices: corte, mitades: { texto1,
 *              texto2, color1, color2 }, entre: { texto, desde } }: la barra que sube desde el pie O del poste, junto a la
 *              pista; pista = ángulo de la barra con la pista, poste = con el poste, otro = con la pista del otro lado
 *   rieles     { theta, giro, calle: true, angulos: [{ cruce: 'P' | 'Q', cuad: 'ad' | 'ai' | 'bi' | 'bd', texto, color,
 *              desde }], letras: true }: los dos rieles del tren (L₁ arriba, en Q; L₂ abajo, en P) y la calle que los
 *              cruza con inclinación theta; giro: cuánto se abre el riel de arriba (0: paralelos). cuad: arriba o abajo
 *              del riel y a la derecha o izquierda de la calle
 *   pasaje     { a, b, aux: corte, auxHasta, examen, angulos: { a, b, x, a2, b2, afP, afQ: { texto, color, desde } } }: el pasaje
 *              P–V–Q entre dos avenidas paralelas; a y b, los ángulos de cada tramo con su avenida; x, el quiebre en V;
 *              a2 y b2, sus copias en V junto a la paralela auxiliar; afP y afQ, los ángulos del otro lado (180° − a y
 *              180° − b). examen: true lo dibuja como figura de examen (dos rectas y la línea quebrada, sin avenidas)
 *   (reloj: arco.corto pide el ángulo convexo aunque el horario pase de las 6)
 *   angulos    { figura: <datos de geo-figura>, ls: [{ p: [x, y], k: 1 }] }: una figura de examen (ls: rótulos L₁, L₂); los rótulos de sus ángulos los pone esta pieza.
 *              En un ángulo, sector: [desde°, hasta°] (antihorario, en el plano) dice dónde va su rótulo si no es en su
 *              propio arco; mide (opcional) es el valor que el rótulo representa cuando es una expresión (2x + 10°)
 *
 * datos = {
 *   objeto: 'carretera' | 'recta',
 *   vista: [desde, hasta],          opcional: el tramo de la carretera que se ve, en km (o m); fija la escala (el juego,
 *                                   para que el paradero siga al dedo). Si no va, se ajusta a los puntos
 *   puntos: [{ id: 'A', km: 0 }, { id: 'B', km: 4, alto: 3 }],   alto: a cuánto queda de la carretera (fuera de ella,
 *                                   arriba), en la misma unidad; sin alto, en la carretera
 *   tramos: [{ de: 'A', a: 'B', papel: 'dato' | 'todo' | 'pide' | 'igual' | 'otro', texto, nivel, marcas, paso }],
 *            papel (decide el color; la unidad no lo elige a mano, regla de colores de la unidad):
 *              todo  el segmento de punta a punta, el viaje directo: en tinta
 *              pide  lo que se pide, con «?»: en tinta, para que el color no lo delate
 *              dato  un tramo que se junta con otro: el primero (de izquierda a derecha) naranja, el segundo turquesa
 *              igual una de las mitades iguales (con marcas: 1 o 2 rayitas): en tinta
 *              otro  una medida que se lee y no es dato del problema (la distancia del pañuelo a la raya): en tinta
 *            marcas: rayitas de «miden igual»; con nivel 0 van sobre la carretera (o la soga), sin cota
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
  if (nodo) require('./geo-figura.js');   // las escenas con ángulos dibujan sus trazos con geo-figura
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
  const OBJETOS = ['carretera', 'recta', 'soga', 'reloj', 'tranquera', 'rieles', 'pasaje', 'angulos'];
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

  // Rayitas de «miden igual» (1 o 2), inclinadas, centradas en (x, y), de ±dy de alto.
  const rayitas = (x, y, k, dy, c = 'currentColor') => Array.from({ length: k }, (_, i) => {
    const cx = x + (i - (k - 1) / 2) * 6;
    return `<line x1="${n(cx - 3)}" y1="${n(y + dy)}" x2="${n(cx + 3)}" y2="${n(y - dy)}" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`;
  }).join('');
  // Una cota horizontal (tramo en la carretera) con su medida encima (nivel > 0) o debajo (nivel < 0). Con nivel 0, solo
  // las rayitas sobre el borde de la carretera.
  function cota(x1, x2, nivel, texto, color, marcas) {
    const a = Math.min(x1, x2), b = Math.max(x1, x2);
    if (nivel === 0) return marcas ? rayitas((a + b) / 2, BOT, marcas, 7) : '';
    const y = NIVEL[nivel] || NIVEL[1], c = T.color(color), g = color ? 3 : 2;
    let s = `<line x1="${n(a)}" y1="${n(y)}" x2="${n(b)}" y2="${n(y)}" stroke="${c}" stroke-width="${g}" stroke-linecap="round"/>`
      + `<line x1="${n(a)}" y1="${n(y - 4)}" x2="${n(a)}" y2="${n(y + 4)}" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`
      + `<line x1="${n(b)}" y1="${n(y - 4)}" x2="${n(b)}" y2="${n(y + 4)}" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`;
    if (marcas) s += rayitas((a + b) / 2, y, marcas, 4.5, c);
    if (texto) s += T.rotulo((a + b) / 2, nivel < 0 ? y + 19 : y - 10, texto, { ancla: 'middle', peso: 700, color, min: M, max: W - M });
    return s;
  }
  // La soga del tira y afloja (dibujo de prueba): el patio, la soga trenzada entre sus puntas, la raya pintada y el
  // pañuelo atado. La soga va sobre el borde de abajo del patio, donde están los puntos.
  function soga(d, g) {
    let s = `<rect x="8" y="${TOP}" width="${W - 16}" height="${BOT - TOP}" fill="currentColor" fill-opacity="0.05"/>`;
    const raya = d.raya && g.P[d.raya];
    if (raya) s += `<line x1="${n(raya[0])}" y1="${TOP + 4}" x2="${n(raya[0])}" y2="${BOT + 6}" stroke="currentColor" stroke-width="4" stroke-opacity="0.45" stroke-dasharray="7 4"/>`;
    const ends = (d.soga || []).map(id => g.P[id]).filter(Boolean);
    if (ends.length === 2) {
      const a = Math.min(ends[0][0], ends[1][0]), b = Math.max(ends[0][0], ends[1][0]);
      s += `<line x1="${n(a)}" y1="${BOT}" x2="${n(b)}" y2="${BOT}" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>`;
      for (let x = a + 5; x < b - 3; x += 7) s += `<line x1="${n(x - 2)}" y1="${BOT + 2.5}" x2="${n(x + 2)}" y2="${BOT - 2.5}" stroke="var(--card)" stroke-width="1.4"/>`;
    }
    const pz = d.panuelo && g.P[d.panuelo];
    if (pz) s += `<path d="M${n(pz[0])} ${BOT - 4}L${n(pz[0] - 8)} ${BOT - 26}L${n(pz[0] + 8)} ${BOT - 26}Z" fill="currentColor" fill-opacity="0.55" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`;
    return `<g class="kit-objeto" data-objeto="soga" data-prueba="si">${s}</g>`;
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
    if (ESCENAS[d.objeto]) return dibujarEscena(d, estado);
    const g = geometria(d), p = pasoDe(estado), cs = colores(d), carretera = d.objeto !== 'recta' && d.objeto !== 'soga';
    let s = '';
    // La pista (o la recta de examen, o el patio con la soga).
    if (d.objeto === 'soga') s += soga(d, g);
    else if (carretera) {
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
      if (!fuera(d, t.de) && !fuera(d, t.a)) { s += cota(a[0], b[0], t.nivel === 0 ? 0 : t.nivel || 1, texto, color, t.marcas); continue; }
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
      s += d.objeto !== 'recta' || +q.alto > 0 ? `<circle cx="${n(x)}" cy="${n(y)}" r="5.5" fill="var(--card)" ${tinta(2.5)}/>` : `<circle cx="${n(x)}" cy="${n(y)}" r="4" fill="currentColor"/>`;
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
    const niveles = (d.tramos || []).filter(t => !fuera(d, t.de) && !fuera(d, t.a) && t.nivel !== 0).map(t => t.nivel || 1);
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

  // ---------- Escenas con ángulos (ideas 3 a 6) ----------
  const GF = () => Kit.piezas['geo-figura'];
  const RAD = Math.PI / 180;
  const TAM = 16, ALTO_T = TAM * 1.05;
  const pol = (c, r, gr) => [c[0] + r * Math.cos(gr * RAD), c[1] + r * Math.sin(gr * RAD)];
  const mas = (p, w, k = 1) => [p[0] + w[0] * k, p[1] + w[1] * k];
  const dir = gr => [Math.cos(gr * RAD), Math.sin(gr * RAD)];
  const ve = (x, corte) => (x.desde || 0) <= corte && !(x.hasta < corte);
  const pt = (id, p, o) => Object.assign({ id, x: p[0], y: p[1] }, o || { sinPunto: true });

  // El sector de un ángulo en pantalla (radianes, y hacia abajo), igual que lo dibuja geo-figura: del lado «de» al lado
  // «a» por el camino corto, o por el largo si es mayor. sector: [a1, a2] en grados del plano (antihorario) lo reemplaza.
  function sectorEn(g, an) {
    const c = g.S(an.en);
    if (an._sec) return { c, t1: an._sec.t1, dt: an._sec.dt };
    if (an.sector) { const sw = ((an.sector[1] - an.sector[0]) % 360 + 360) % 360; return { c, t1: -an.sector[0] * RAD, dt: -sw * RAD }; }
    const p1 = g.S(an.de), p2 = g.S(an.a);
    const t1 = Math.atan2(p1[1] - c[1], p1[0] - c[0]), t2 = Math.atan2(p2[1] - c[1], p2[0] - c[0]);
    let dt = t2 - t1; while (dt > Math.PI) dt -= 2 * Math.PI; while (dt < -Math.PI) dt += 2 * Math.PI;
    if (an.mayor) dt = dt > 0 ? dt - 2 * Math.PI : dt + 2 * Math.PI;
    return { c, t1, dt };
  }
  // Dónde va el rótulo de un ángulo: sobre su bisectriz, a la distancia justa para que la caja del texto no toque ninguno
  // de los dos lados (con holgura) ni su arco. Si el ángulo es chico, el rótulo se aleja; afuera: lejos (en unidades del
  // plano) marca hasta dónde, y afuera (en unidades) lo saca más allá de esa distancia si adentro no cabe.
  function lugarRotulo(g, an) {
    const { c, t1, dt } = sectorEn(g, an), texto = String(an.texto);
    const w = T.ancho(texto, TAM, 700), h = ALTO_T, half = Math.abs(dt) / 2, bis = t1 + dt / 2;
    const r0 = (an.radio || 26) + 4, hol = an.holgura === undefined ? 5 : an.holgura;
    const sop = t => (w / 2) * Math.abs(Math.cos(t)) + (h / 2) * Math.abs(Math.sin(t));
    let d = r0 + 3 + sop(bis);
    if (half < Math.PI / 2 - 1e-6) for (const t of [t1, t1 + dt]) d = Math.max(d, (sop(t + Math.PI / 2) + hol) / Math.sin(half));
    if (an.lejos !== undefined && d > an.lejos * g.s) d = an.afuera !== undefined ? an.afuera * g.s + 4 + sop(bis) : an.lejos * g.s;
    return { x: c[0] + d * Math.cos(bis), y: c[1] + d * Math.sin(bis), w, h, d, sb: sop(bis) };
  }
  // En un ángulo chico el rótulo se aleja; su arco crece hasta quedar junto al rótulo, para que se lea de quién es (no si
  // el rótulo va en otro sector, ni si es recto: geo-figura lo dibuja con un cuadradito).
  function conArco(g, an) {
    if (!an.texto || an.sector || an._sec || an.ajusta === false) return an;
    const { dt } = sectorEn(g, an);
    if (Math.abs(Math.abs(dt) - Math.PI / 2) < 1e-4) return an;
    const q = lugarRotulo(g, an), r = an.radio || 26, r2 = q.d - q.sb - 5;
    return r2 > r + 6 ? Object.assign({}, an, { radio: Math.round(r2) }) : an;
  }
  function rotuloAngulo(g, an, q = lugarRotulo(g, an)) {
    return T.rotulo(q.x, q.y + TAM * 0.275, String(an.texto), { ancla: 'middle', peso: 700, color: an.color, min: M, max: W - M });
  }
  // Caja de un rótulo centrado en (x, y), ya encajado en el lienzo como lo hace T.rotulo.
  const cajaDe = (x, y, w, h) => { const xx = Math.min(Math.max(x, M + w / 2), W - M - w / 2); return { x0: xx - w / 2, x1: xx + w / 2, y0: y - h / 2, y1: y + h / 2 }; };
  const chocan = (a, b, e = 2) => a.x0 < b.x1 + e && b.x0 < a.x1 + e && a.y0 < b.y1 + e && b.y0 < a.y1 + e;
  // Las letras de los puntos (geo-figura las pone a 15 px, hacia «lado») y los rótulos L₁, L₂: obstáculos fijos.
  function letras(g, fig, corte, ls) {
    const out = [];
    for (const q of fig.puntos || []) {
      if (!q.rotulo || q.lado === undefined || !ve(q, corte)) continue;
      const [x, y] = g.S(q.id), w = T.ancho(q.rotulo, TAM, 600);
      out.push(cajaDe(x + Math.cos(q.lado * RAD) * 15, y - Math.sin(q.lado * RAD) * 15 + 1, w, ALTO_T));
    }
    for (const l of ls || []) out.push({ x0: l[0], x1: l[0] + 16, y0: l[1] - 13, y1: l[1] + 6 });
    return out;
  }
  // Si un rótulo choca con otro ya puesto (de otro vértice) o con una letra, se aleja por su bisectriz de a 4 px, sin
  // salir del lienzo; si no encuentra lugar, se queda donde estaba.
  // ¿El segmento p–q toca la caja b? (Liang-Barsky.)
  function tocaCaja(p, q, b) {
    let t0 = 0, t1 = 1; const dx = q[0] - p[0], dy = q[1] - p[1];
    for (const [pp, qq] of [[-dx, p[0] - b.x0], [dx, b.x1 - p[0]], [-dy, p[1] - b.y0], [dy, b.y1 - p[1]]]) {
      if (pp === 0) { if (qq < 0) return false; continue; }
      const r = qq / pp; if (pp < 0) { if (r > t1) return false; if (r > t0) t0 = r; } else { if (r < t0) return false; if (r < t1) t1 = r; }
    }
    return true;
  }
  // Los trazos rectos de la figura, en pantalla (las rectas, alargadas a todo el lienzo).
  function trazos(g, fig, corte) {
    return (fig.segmentos || []).filter(l => ve(l, corte)).map(l => {
      const a = g.S(l.de), b = g.S(l.a);
      if (!a || !b) return null;
      if (!l.recta) return [a, b];
      const u = [b[0] - a[0], b[1] - a[1]], L = Math.hypot(...u) || 1;
      return [[a[0] - u[0] / L * 900, a[1] - u[1] / L * 900], [a[0] + u[0] / L * 900, a[1] + u[1] / L * 900]];
    }).filter(Boolean);
  }
  function separar(g, an, puestos, lineas) {
    const q = lugarRotulo(g, an), { t1, dt } = sectorEn(g, an), bis = t1 + dt / 2, c = g.S(an.en);
    const en = d => { const x = c[0] + d * Math.cos(bis), y = c[1] + d * Math.sin(bis); return { x, y, w: q.w, h: q.h, caja: cajaDe(x, y, q.w, q.h) }; };
    const cabe = z => z.caja.y0 >= M && z.caja.y1 <= g.alto - M && Math.abs(z.caja.x0 + z.w / 2 - z.x) < 0.5 && !lineas.some(([a, b]) => tocaCaja(a, b, z.caja));
    let z = en(q.d);
    if (!puestos.some(b => chocan(z.caja, b))) return z;
    for (let k = 1; k <= 20; k++) { const w = en(q.d + 4 * k); if (!cabe(w)) break; if (!puestos.some(b => chocan(w.caja, b))) return w; }
    return z;
  }
  // L₁ con subíndice de verdad (tspan), en tinta.
  const rotuloL = (x, y, k) => `<text class="kit-txt" x="${n(x)}" y="${n(y)}" fill="currentColor" font-size="${TAM}" font-weight="700">L<tspan dy="4" font-size="14">${k}</tspan></text>`;
  // Un polígono (en pantalla) recortado al semiplano a·x + b·y ≤ c (Sutherland–Hodgman).
  function recorte(ps, a, b, c) {
    const out = [], f = p => a * p[0] + b * p[1] - c;
    ps.forEach((p, i) => {
      const q = ps[(i + 1) % ps.length], fp = f(p), fq = f(q);
      if (fp <= 0) out.push(p);
      if ((fp < 0 && fq > 0) || (fp > 0 && fq < 0)) { const t = fp / (fp - fq); out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); }
    });
    return out;
  }
  // Una franja de ancho 2·hw (px) a lo largo de la recta por p con dirección u (pantalla), recortada al lienzo.
  function franja(p, u, hw, alto) {
    let ps = [[6, 6], [W - 6, 6], [W - 6, alto - 6], [6, alto - 6]];
    const nx = -u[1], ny = u[0], c = nx * p[0] + ny * p[1];
    ps = recorte(ps, nx, ny, c + hw); ps = recorte(ps, -nx, -ny, -c + hw);
    return ps.length ? `<path d="M${ps.map(q => `${n(q[0])} ${n(q[1])}`).join('L')}Z" fill="currentColor" fill-opacity="0.08"/>` : '';
  }
  // Marcas cortas de durmiente a lo largo de una recta de pantalla (de x = x0 en adelante), dentro del lienzo.
  function durmientes(p, u, alto, x0 = 44, lejosDe = []) {
    let s = '';
    const nx = -u[1], ny = u[0];
    for (let k = -40; k <= 40; k++) {
      const q = [p[0] + u[0] * (k * 15 + 7.5), p[1] + u[1] * (k * 15 + 7.5)];
      if (q[0] < x0 || q[0] > W - 10 || q[1] < 10 || q[1] > alto - 10 || lejosDe.some(c => Math.hypot(q[0] - c[0], q[1] - c[1]) < 30)) continue;
      s += `<line x1="${n(q[0] - nx * 5)}" y1="${n(q[1] - ny * 5)}" x2="${n(q[0] + nx * 5)}" y2="${n(q[1] + ny * 5)}" stroke="currentColor" stroke-width="2" stroke-opacity="0.55" stroke-linecap="round"/>`;
    }
    return s;
  }
  const ang = (en, de, a, o) => Object.assign({ en, de, a }, o);
  const conTexto = (an, x) => (x ? Object.assign(an, { texto: x.texto, color: x.color, desde: x.desde || 0 }, x.hasta !== undefined ? { hasta: x.hasta } : {}) : null);

  // Reloj de la plaza (en su torre) y reloj de pulsera (con su correa), a una hora en punto. Agujas en tinta.
  function reloj(d) {
    const rs = (d.relojes || []).slice(0, 2), dos = rs.length === 2;
    const puntos = [], segmentos = [], angulos = [], caras = [];
    rs.forEach((r, k) => {
      const R = r.tam === 'pulsera' && dos ? 0.62 : 1, c = dos ? (k ? [1.38, 0.08] : [-1.0, 0.08]) : [0, 0], h = ((r.hora % 12) + 12) % 12;
      const gH = 90 - 30 * h, Mi = [c[0], c[1] + 0.6 * R], Ho = pol(c, 0.4 * R, gH);
      const O = `O${k}`, Mk = `M${k}`, Hk = `H${k}`;
      // La O va lejos de las dos agujas: del lado libre si el arco marcado es convexo; si es el no convexo, adentro de su
      // arco (que entonces va más afuera), en su bisectriz.
      const mayor = h > 6 && !(r.arco && r.arco.corto), libre = !r.arco || !h ? 180 : mayor ? 15 * h : h > 6 ? 15 * h : (30 * h + 360) / 2;
      puntos.push(pt(O, c, r.O ? { rotulo: 'O', lado: 90 - libre, sinPunto: true } : undefined), pt(Mk, Mi), pt(Hk, Ho));
      segmentos.push({ de: O, a: Mk, grosor: 'variable' }, { de: O, a: Hk, grosor: 'variable' });
      if (r.alarga !== undefined) {
        puntos.push(pt(`m${k}`, [c[0], c[1] + 0.6]), pt(`h${k}`, pol(c, 0.4, gH)));
        segmentos.push({ de: Mk, a: `m${k}`, discontinua: true, desde: r.alarga }, { de: Hk, a: `h${k}`, discontinua: true, desde: r.alarga });
      }
      if (r.arco && h > 0) angulos.push(conTexto(ang(O, Mk, Hk, { mayor: h > 6 && !r.arco.corto, radio: h > 6 && !r.arco.corto ? 30 : h === 3 || h === 9 ? 12 : R < 1 ? 12 : 18, holgura: 4, lejos: 0.6 * R, afuera: 1.04 * R, ajusta: false, mide: h > 6 && !r.arco.corto ? 30 * h : Math.min(30 * h, 360 - 30 * h) }), r.arco));
      caras.push({ c, R, plaza: r.tam !== 'pulsera' });
    });
    const vista = dos ? { x: [-2.12, 2.12], y: [-1.6, 1.62] } : { x: [-1.42, 1.42], y: [-1.32, 1.42] };
    const alt = rs.map(r => `reloj ${r.tam === 'pulsera' ? 'de pulsera' : 'de la plaza'} a las ${((r.hora % 12) || 12)}:00${r.arco && r.arco.texto ? `, ángulo marcado ${r.arco.texto}` : ''}`).join('; ');
    const fig = { alt: `${alt.charAt(0).toUpperCase()}${alt.slice(1)}.`, vista, alto: dos ? 232 : 248, puntos, segmentos, angulos: angulos.filter(Boolean) };
    const deco = g => caras.map(({ c, R, plaza }) => {
      const C = g.S(c), r = R * g.s;
      let s = '';
      if (plaza) {
        const top = C[1] + r * 0.82, base = g.Y(g.y0) - 6;   // la torre, debajo de la esfera
        s += `<rect x="${n(C[0] - r * 0.5)}" y="${n(top)}" width="${n(r)}" height="${n(base - top)}" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="2"/>`;
      } else {
        for (const sg of [-1, 1]) s += `<rect x="${n(C[0] - r * 0.33)}" y="${n(sg < 0 ? C[1] - r * 1.55 : C[1] + r * 0.9)}" width="${n(r * 0.66)}" height="${n(r * 0.65)}" rx="3" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="1.5"/>`;
        s += `<rect x="${n(C[0] + r * 0.98)}" y="${n(C[1] - 4)}" width="6" height="8" rx="1.5" fill="currentColor"/>`;
      }
      s += `<circle cx="${n(C[0])}" cy="${n(C[1])}" r="${n(r)}" fill="var(--card)" stroke="currentColor" stroke-width="2.5"/>`;
      const nums = plaza && r >= 60;
      for (let k = 0; k < 12; k++) {
        if (nums && k % 3 === 0) continue;   // ahí van los números
        const t = (k * 30 - 90) * RAD, l = k % 3 ? 0.08 : 0.14;
        s += `<line x1="${n(C[0] + Math.cos(t) * r * (0.97 - l))}" y1="${n(C[1] + Math.sin(t) * r * (0.97 - l))}" x2="${n(C[0] + Math.cos(t) * r * 0.97)}" y2="${n(C[1] + Math.sin(t) * r * 0.97)}" stroke="currentColor" stroke-width="${k % 3 ? 1.5 : 2.5}" stroke-linecap="round"/>`;
      }
      if (nums) for (const [k, t] of [[12, -90], [3, 0], [6, 90], [9, 180]]) s += T.rotulo(C[0] + Math.cos(t * RAD) * r * 0.82, C[1] + Math.sin(t * RAD) * r * 0.82 + 5, String(k), { ancla: 'middle', tam: 14, clase: 'kit-num' });
      return s + `<circle cx="${n(C[0])}" cy="${n(C[1])}" r="3.5" fill="currentColor"/>`;
    }).join('');
    return { fig, deco };
  }

  // La tranquera: el poste derecho en O, la pista (una recta) y la barra que sube desde O formando alfa con la pista.
  function tranquera(d) {
    const a = d.alfa, O = [0, 0], L = 2.5, B = pol(O, L, a), M1 = pol(O, 2.15, a / 2), M2 = pol(O, 2.15, 90 + a / 2);
    const puntos = [pt('O', O, { rotulo: d.O === false ? undefined : 'O', lado: -60, sinPunto: true }), pt('A', [2.8, 0]), pt('D', [-2.8, 0]), pt('T', [0, L + 0.05]), pt('B', B), pt('M1', M1), pt('M2', M2)];
    const segmentos = [{ de: 'D', a: 'A' }, { de: 'O', a: 'T' }, { de: 'O', a: 'B', grosor: 'variable' }];
    const angulos = [];
    const bis = d.bisectrices;
    if (bis !== undefined) segmentos.push({ de: 'O', a: 'M1', discontinua: true, desde: typeof bis === 'object' ? bis.primera : bis }, { de: 'O', a: 'M2', discontinua: true, desde: typeof bis === 'object' ? bis.segunda : bis });
    if (d.pista) angulos.push(conTexto(ang('O', 'A', 'B', { radio: 30, holgura: 8, lejos: 2.4, afuera: 2.62, mide: a, ajusta: false }), d.pista));
    if (d.poste && a < 90) angulos.push(conTexto(ang('O', 'B', 'T', { radio: 36, holgura: 8, lejos: 1.4, afuera: 2.62, mide: 90 - a, ajusta: false }), d.poste));
    if (d.otro) angulos.push(conTexto(ang('O', 'B', 'D', { radio: 84, holgura: 8, sector: a < 90 ? [96, 178] : undefined, mide: 180 - a }), d.otro));
    const mi = d.mitades;
    if (mi) {
      angulos.push(conTexto(ang('O', 'A', 'M1', { radio: 30, rayita: 1, holgura: 6, lejos: 2.4, mide: a / 2, ajusta: false }), { texto: mi.texto1, color: mi.color1, desde: mi.desde1 }));
      angulos.push(conTexto(ang('O', 'M1', 'B', { radio: 30, rayita: 1, mide: a / 2 }), { color: mi.color1, desde: mi.desde1 }));
      angulos.push(conTexto(ang('O', 'B', 'M2', { radio: 30, rayita: 2, mide: 90 - a / 2 }), { color: mi.color2, desde: mi.desde2 }));
      angulos.push(conTexto(ang('O', 'M2', 'D', { radio: 30, rayita: 2, holgura: 6, mide: 90 - a / 2 }), { texto: mi.texto2, color: mi.color2, desde: mi.desde2 }));
    }
    if (d.entre) angulos.push(conTexto(ang('O', 'M1', 'M2', { radio: 64, holgura: 6, mide: 90, ajusta: false }), d.entre));
    const fig = { alt: `Tranquera: la barra sube desde el pie O del poste y forma ${Kit.formatear(a, 1)}° con la pista${d.bisectrices !== undefined ? ', con las bisectrices de los dos ángulos que forma con la pista' : ''}.`,
      vista: { x: [-3.05, 3.05], y: [-0.62, 3.25] }, alto: 250, puntos, segmentos, angulos: angulos.filter(Boolean) };
    const deco = g => {
      const o = g.S(O), t = g.S([0, L]), b = g.S(B), y0 = o[1], u = [(b[0] - o[0]) / (L * g.s), (b[1] - o[1]) / (L * g.s)], nn = [-u[1], u[0]];
      let s = `<rect x="8" y="${n(y0)}" width="${W - 16}" height="${n(g.alto - 8 - y0)}" fill="currentColor" fill-opacity="0.09"/>`;
      s += `<rect x="${n(o[0] - 5)}" y="${n(t[1])}" width="10" height="${n(y0 - t[1])}" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`;
      const q = (k, e) => [o[0] + u[0] * k + nn[0] * e, o[1] + u[1] * k + nn[1] * e], Lp = L * g.s;
      s += `<path d="M${q(6, -5).map(n).join(' ')}L${q(Lp, -5).map(n).join(' ')}L${q(Lp, 5).map(n).join(' ')}L${q(6, 5).map(n).join(' ')}Z" fill="var(--card)" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`;
      for (let k = 0; k < 4; k++) { const k0 = 6 + (Lp - 6) * (2 * k + 1) / 8, k1 = 6 + (Lp - 6) * (2 * k + 2) / 8; s += `<path d="M${q(k0, -5).map(n).join(' ')}L${q(k1, -5).map(n).join(' ')}L${q(k1, 5).map(n).join(' ')}L${q(k0, 5).map(n).join(' ')}Z" fill="currentColor" fill-opacity="0.4"/>`; }
      return s;
    };
    return { fig, deco };
  }

  // Los rieles del tren (dos rectas con sus durmientes) y la calle que los cruza. P en el de abajo (L₂), Q en el de
  // arriba (L₁). Cuadrantes en cada cruce: ad (arriba del riel, a la derecha de la calle), ai, bi y bd.
  function rieles(d) {
    const th = d.theta, gi = d.giro || 0, hh = 2.4, tt = Math.tan(th * RAD), P = [-hh / 2 / tt, 0], Q = [hh / 2 / tt, hh];
    const u = dir(th), v = dir(gi), x = [1, 0];
    // Las letras P y Q van a 15 px del cruce, en el sector de 180° − θ (el más ancho si θ < 90°), adentro de los arcos.
    const ladoP = th <= 90 ? 270 + th / 2 : 90 + th / 2, ladoQ = th <= 90 ? (th + 180 + gi) / 2 : (th + gi) / 2 - 90;
    const puntos = [pt('P', P, d.letras ? { rotulo: 'P', lado: ladoP, sinPunto: true } : undefined), pt('Q', Q, d.letras ? { rotulo: 'Q', lado: ladoQ, sinPunto: true } : undefined),
      pt('Pd', mas(P, x)), pt('Pi', mas(P, x, -1)), pt('Pu', mas(P, u)), pt('Pb', mas(P, u, -1)),
      pt('Qd', mas(Q, v)), pt('Qi', mas(Q, v, -1)), pt('Qu', mas(Q, u)), pt('Qb', mas(Q, u, -1))];
    const segmentos = [{ de: 'Pi', a: 'Pd', recta: true, paralela: gi ? 0 : 1 }, { de: 'Qi', a: 'Qd', recta: true, paralela: gi ? 0 : 1 }, { de: 'Pb', a: 'Qu', recta: true }];
    const LADOS = { ad: ['d', 'u'], ai: ['u', 'i'], bi: ['i', 'b'], bd: ['b', 'd'] };
    const medida = (cruce, cuad) => { const e = th - (cruce === 'Q' ? gi : 0); return cuad === 'ad' || cuad === 'bi' ? e : 180 - e; };
    const angulos = (d.angulos || []).map(z => {
      const [l1, l2] = LADOS[z.cuad], m = medida(z.cruce, z.cuad);
      return conTexto(ang(z.cruce, z.cruce + l1, z.cruce + l2, { radio: z.radio || (d.letras ? 27 : 22), holgura: 8, mide: m }), z);
    }).filter(Boolean);
    const fig = { alt: `Dos rieles de tren${gi ? ' que ya no son paralelos: el de arriba se abre ' + Kit.formatear(gi, 1) + '°' : ' paralelos'} y una calle que los cruza formando ${Kit.formatear(th, 1)}° con el de abajo.`,
      vista: { x: [-3.3, 3.3], y: [-1.42, 3.82] }, alto: 262, puntos, segmentos, angulos };
    const deco = g => {
      const p = g.S(P), q = g.S(Q), uu = [Math.cos(th * RAD), -Math.sin(th * RAD)], vv = [Math.cos(gi * RAD), -Math.sin(gi * RAD)];
      return (d.calle === false ? '' : franja(p, uu, 13, g.alto)) + durmientes(p, [1, 0], g.alto, 44, [p]) + durmientes(q, vv, g.alto, 44, [q]);
    };
    const ls = g => { const p = g.S(P), q = g.S(Q), yq = q[1] + (14 - q[0]) * -Math.tan(gi * RAD); return [[10, p[1] - 8], [10, yq - 8]]; };
    const encima = g => { const [a2, a1] = ls(g); return rotuloL(a2[0], a2[1], 2) + rotuloL(a1[0], a1[1], 1); };
    return { fig, deco, encima, ls, medida };
  }

  // El pasaje P–V–Q entre dos avenidas paralelas (L₁ arriba, L₂ abajo), visto en el mapa.
  function pasaje(d) {
    const a = d.a, b = d.b, V = [2.9, 1.5], P = [V[0] - 1.5 / Math.tan(a * RAD), 3], Q = [V[0] - 1.5 / Math.tan(b * RAD), 0];
    const puntos = [pt('V', V, { rotulo: 'V', lado: 50, sinPunto: true }), pt('P', P, { rotulo: 'P', lado: 110, sinPunto: true }), pt('Q', Q, { rotulo: 'Q', lado: -110, sinPunto: true }),
      pt('Pd', [P[0] + 1, 3]), pt('Qd', [Q[0] + 1, 0]), pt('Pi', [P[0] - 1, 3]), pt('Qi', [Q[0] - 1, 0]), pt('Vi', [V[0] - 1, 1.5]), pt('Vd', [V[0] + 1, 1.5]),
      pt('Ti', [-3, 3]), pt('Td', [3, 3]), pt('Bi', [-3, 0]), pt('Bd', [3, 0])];
    const segmentos = [{ de: 'Ti', a: 'Td', recta: true, paralela: 1 }, { de: 'Bi', a: 'Bd', recta: true, paralela: 1 },
      { de: 'P', a: 'V', grosor: 'variable' }, { de: 'V', a: 'Q', grosor: 'variable' }];
    if (d.aux !== undefined) segmentos.push(Object.assign({ de: 'Vi', a: 'Vd', recta: true, discontinua: true, grosor: 'fino', desde: d.aux }, d.auxHasta !== undefined ? { hasta: d.auxHasta } : {}));
    const A = d.angulos || {}, angulos = [];
    if (A.a) angulos.push(conTexto(ang('P', 'Pd', 'V', { radio: 24, holgura: 8, mide: a }), A.a));
    if (A.b) angulos.push(conTexto(ang('Q', 'Qd', 'V', { radio: 24, holgura: 8, mide: b }), A.b));
    if (A.a2) angulos.push(conTexto(ang('V', 'P', 'Vi', { radio: 26, holgura: 6, mide: a }), A.a2));
    if (A.b2) angulos.push(conTexto(ang('V', 'Vi', 'Q', { radio: 26, holgura: 6, mide: b }), A.b2));
    // Con la paralela auxiliar a la vista, el rótulo de x va arriba de ella (no sobre la línea); si ya están las copias
    // de a y b, x lleva solo su arco mientras la paralela se vea.
    const conAux = d.aux !== undefined, copias = A.a2 || A.b2;
    if (A.x) angulos.push(conTexto(ang('V', 'P', 'Q', Object.assign({ radio: copias ? 18 : 30, holgura: 6, mide: a + b }, conAux && !copias ? { sector: [180 - a, 180] } : {})),
      conAux && copias && d.auxHasta === undefined ? Object.assign({}, A.x, { texto: undefined }) : A.x));
    if (A.afP) angulos.push(conTexto(ang('P', 'V', 'Pi', { radio: 24, holgura: 8, mide: 180 - a }), A.afP));
    if (A.afQ) angulos.push(conTexto(ang('Q', 'V', 'Qi', { radio: 24, holgura: 8, mide: 180 - b }), A.afQ));
    const fig = { alt: `Un pasaje sale de P en la avenida de arriba, dobla en V y llega a Q en la de abajo; las avenidas son paralelas. El tramo PV forma ${Kit.formatear(a, 1)}° con su avenida y el tramo VQ, ${Kit.formatear(b, 1)}°.`,
      vista: { x: [-2.05, 3.95], y: [-0.78, 3.78] }, alto: 240, puntos, segmentos, angulos: angulos.filter(Boolean) };
    if (d.examen) return { fig, ls: g => [[10, g.Y(3) - 8], [10, g.Y(0) - 8]], encima: g => rotuloL(10, g.Y(3) - 8, 1) + rotuloL(10, g.Y(0) - 8, 2) };
    const deco = g => {
      const yt = g.Y(3), yb = g.Y(0), sp = g.S(P), sv = g.S(V), sq = g.S(Q);
      let s = `<rect x="8" y="8" width="${W - 16}" height="${n(yt - 8)}" fill="currentColor" fill-opacity="0.09"/><rect x="8" y="${n(yb)}" width="${W - 16}" height="${n(g.alto - 8 - yb)}" fill="currentColor" fill-opacity="0.09"/>`;
      for (const y of [(8 + yt) / 2, (yb + g.alto - 8) / 2]) s += `<line x1="14" y1="${n(y)}" x2="${W - 14}" y2="${n(y)}" stroke="currentColor" stroke-width="1.5" stroke-dasharray="8 8" stroke-opacity="0.35"/>`;
      s += `<path d="M${n(sp[0])} ${n(sp[1])}L${n(sv[0])} ${n(sv[1])}L${n(sq[0])} ${n(sq[1])}" fill="none" stroke="currentColor" stroke-opacity="0.12" stroke-width="16" stroke-linejoin="round"/>`;
      return s;
    };
    const encima = g => rotuloL(10, g.Y(3) + 20, 1) + rotuloL(10, g.Y(0) - 8, 2);
    return { fig, deco, encima, ls: g => [[10, g.Y(3) + 20], [10, g.Y(0) - 8]] };
  }

  // Los ángulos de una escena, listos para dibujar: (1) el rótulo de un ángulo que tiene otros rayos adentro (∠AOC con
  // OB en medio) va en el hueco más ancho entre esos rayos, no sobre OB; (2) un arco que contiene a otros ángulos del
  // mismo vértice pasa por fuera de sus rótulos; (3) en un ángulo chico, el arco crece hasta su rótulo (conArco). Se
  // trabaja del ángulo más chico al más grande.
  const TAU = 2 * Math.PI, norm = t => ((t % TAU) + TAU) % TAU;
  function prepararAngulos(g, fig, corte = Infinity) {
    const angs = (fig.angulos || []).map(a => Object.assign({}, a));
    const iv = angs.map(a => { const { t1, dt } = sectorEn(g, a); return dt >= 0 ? [norm(t1), dt] : [norm(t1 + dt), -dt]; });
    const rayos = id => (fig.segmentos || []).filter(sg => ve(sg, corte)).flatMap(sg => (sg.de === id ? [sg.a] : sg.a === id ? [sg.de] : [])).map(o => { const c = g.S(id), q = g.S(o); return c && q ? Math.atan2(q[1] - c[1], q[0] - c[0]) : null; }).filter(t => t !== null);
    const dentro = (t, [lo, w], e = 1e-3) => { const x = norm(t - lo); return x > e && x < w - e; };
    const contiene = ([lo, w], [lo2, w2]) => { const x = norm(lo2 - lo); return w2 < w - 1e-6 && x <= w - w2 + 1e-6; };
    const orden = angs.map((_, i) => i).sort((i, j) => iv[i][1] - iv[j][1]);
    const lejos = {}, cerca = {}, dirR = {};
    // Dos ángulos se estorban solo si se ven a la vez (sus intervalos desde–hasta se tocan).
    const juntos = (a, b) => Math.max(a.desde || 0, b.desde || 0) <= Math.min(a.hasta === undefined ? Infinity : a.hasta, b.hasta === undefined ? Infinity : b.hasta);
    for (const i of orden) {
      let a = angs[i];
      if (a.texto && !a.sector) {
        const ts = rayos(a.en).filter(t => dentro(t, iv[i])).map(t => norm(t - iv[i][0])).sort((x, y) => x - y);
        if (ts.length) {
          const cs = [0, ...ts, iv[i][1]]; let k = 0;
          for (let j = 1; j < cs.length - 1; j++) if (cs[j + 1] - cs[j] > cs[k + 1] - cs[k] + 1e-3) k = j;
          a._sec = { t1: iv[i][0] + cs[k], dt: cs[k + 1] - cs[k] };
        }
      }
      // Su arco pasa por fuera de los rótulos (y arcos) de los ángulos más chicos del mismo vértice que caen en su abertura.
      // (Un rótulo que queda más allá del arco no estorba: el arco pasa por dentro. Las franjas se recorren de adentro
      // hacia afuera, porque al crecer el arco puede tocar la siguiente.)
      const franjas = orden.filter(j => j !== i && lejos[j] !== undefined && angs[j].en === a.en && juntos(a, angs[j]) && (contiene(iv[i], iv[j]) || (dirR[j] !== undefined && dentro(dirR[j], iv[i], 0.03))))
        .map(j => [cerca[j], lejos[j]]).sort((x, y) => x[0] - y[0]);
      let rr = a.radio || 26;
      for (const [c0, c1] of franjas) if (rr + 5 > c0 && rr - 5 < c1) rr = Math.ceil(c1 + 6);
      a.radio = rr;
      a = angs[i] = conArco(g, a);
      if (a.texto) { const q = lugarRotulo(g, a), sc = sectorEn(g, a), md = Math.hypot(q.w, q.h) / 2; lejos[i] = q.d + md; cerca[i] = q.d - md; dirR[i] = norm(sc.t1 + sc.dt / 2); } else { lejos[i] = (a.radio || 26) + (a.rayita ? 6 : 2); cerca[i] = 0; }
    }
    return angs;
  }

  const ESCENAS = { reloj, tranquera, rieles, pasaje,
    angulos: d => ({ fig: d.figura || { puntos: [] }, ls: g => (d.ls || []).map(l => g.S(l.p)), encima: g => (d.ls || []).map(l => { const q = g.S(l.p); return rotuloL(q[0], q[1], l.k); }).join('') }) };
  const escena = d => ESCENAS[d.objeto](d);
  function dibujarEscena(d, estado = {}) {
    const G = GF(), e = escena(d), fig = e.fig, g = G.geometria(fig);
    const corte = Math.max(0, (estado && estado.corte) || 0);
    const angs = prepararAngulos(g, fig, corte);
    // Un ángulo recto que se pide («?» o una letra en tinta) se dibuja con arco, no con el cuadradito: el cuadradito
    // diría la respuesta. Su lado «de» se gira 0,02° (no se ve; la medida no cambia a la vista).
    const extra = [];
    const conArcoRecto = angs.map((a, k) => {
      const pedido = a.texto !== undefined && !a.color && (/\?$/.test(String(a.texto)) || /^[a-zθ]$/.test(String(a.texto)));
      const { dt } = sectorEn(g, a);
      if (!pedido || a._sec || Math.abs(Math.abs(dt) - Math.PI / 2) > 1e-3) return a;
      const V = g.P(a.en), D = g.P(a.de), t = Math.atan2(D[1] - V[1], D[0] - V[0]) + (dt < 0 ? 1 : -1) * 0.02 * RAD;
      extra.push({ id: `~${k}`, x: V[0] + Math.cos(t), y: V[1] + Math.sin(t), sinPunto: true });
      return Object.assign({}, a, { de: `~${k}` });
    });
    const sin = Object.assign({}, fig, { puntos: [...(fig.puntos || []), ...extra], angulos: conArcoRecto.map(a => Object.assign({}, a, { texto: undefined })) });
    const svg = G.dibujar(sin, { corte });
    let enc = '';
    const puestos = letras(g, fig, corte, e.ls ? e.ls(g) : []), lineas = trazos(g, fig, corte);
    for (const an of angs) if (an.texto !== undefined && an.texto !== null && an.texto !== '' && ve(an, corte)) { const z = separar(g, an, puestos, lineas); puestos.push(z.caja); enc += rotuloAngulo(g, an, z); }
    if (e.encima) enc += e.encima(g, corte);
    const deco = e.deco ? `<g class="kit-objeto" data-objeto="${d.objeto}" data-prueba="si">${e.deco(g, corte)}</g>` : '';
    return svg.replace(/^(<svg[^>]*>)/, m => m + deco).replace(/<\/svg>$/, () => `${enc}</svg>`);
  }
  // Gesto directo en una escena: del plano a la pantalla y de vuelta (las coordenadas de geo-figura).
  const aPantalla = (d, p) => GF().aPantalla(escena(d).fig, p);
  const aPlano = (d, q) => GF().aPlano(escena(d).fig, q);

  function alt(d = {}) {
    if (ESCENAS[d.objeto]) { const fg = escena(d).fig; return fg.alt || GF().alt(fg); }
    const que = d.objeto === 'recta' ? 'Una recta con los puntos' : d.objeto === 'soga' ? 'Una soga de tira y afloja en el patio, con los puntos' : 'Una carretera recta vista desde arriba, con los paraderos';
    const pts = (d.puntos || []).map(q => `${q.id}${+q.alto > 0 ? ` (fuera de la carretera, a ${f(+q.alto)} de ella)` : ''}`).join(', ');
    const ts = (d.tramos || []).map(t => `${nombre(t)}: ${textoEn(t.texto, Infinity) || 'sin medida'}`).join('; ');
    return `${que} ${pts || 'sin puntos'}${ts ? `. Tramos ${ts}` : ''}${d.combi !== undefined && d.objeto !== 'recta' ? '. Una combi en la pista' : ''}.`;
  }

  return { id: 'geo-objeto', dibujar, alt, geometria, marco, colores, colorDe, OBJETOS, ESCENAS: Object.keys(ESCENAS), escena, lugarRotulo, aPantalla, aPlano, constantes: { W, H, M, TOP, BOT, CENTRO, LETRA, NIVEL, X0, X1 } };
});
