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
 *              letras: ['A', 'B'] }] }: uno o dos relojes a una hora en punto; el arco va del minutero (en las 12) al horario, en el
 *              sentido del reloj (más de 180°: el ángulo no convexo). alarga: desde qué corte se ven las agujas alargadas
 *   tranquera  { alfa, O: true, pista, poste (poste.lejos: hasta dónde puede alejarse su rótulo antes de salir afuera), otro: { texto, color, desde } | null, bisectrices: corte, mitades: { texto1,
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
 *              propio arco; mide (opcional) es el valor que el rótulo representa cuando es una expresión (2x + 10°);
 *              centro: true pone el rótulo de un ángulo entero sobre su bisectriz, más afuera que sus partes (y corta el
 *              rayo punteado de su vértice que pase por debajo); arcoRecto: true dibuja un recto con arco y no con el cuadradito.
 *              Dos ángulos consecutivos del mismo color (sin rayitas) nunca quedan con el mismo radio: el segundo va
 *              8 px más afuera. angulosListos(datos) da los ángulos como se dibujan (radios y sectores finales).
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
 *            marcas: rayitas de «miden igual»; con nivel 0 van sin cota, sobre un arco que une las puntas del tramo,
 *            encima de la línea (así otro punto que parta el tramo no cambia qué tramo se lee)
 *            texto: la medida («4 km», «?», «2k») o [{ t, paso }] (se ve el último cuyo paso ya llegó; t: null lo oculta)
 *            nivel: 1, 2 o 3 (cotas encima de la pista, de abajo hacia arriba) o −1, −2 (debajo de las letras); si un
 *            extremo está fuera de la carretera, el tramo es un camino recto y nivel no se usa
 *            paso: desde qué paso de «Mira» se ve el tramo
 *   alturas: [{ punto: 'B', texto: '3 km', paso }],   la distancia de un punto de afuera a la carretera, punteada, con su medida sobre ella, justo encima de la pista
 *   reglas: [{ de: 'A', a: 'B', texto, marca: 4, paso }],   la regla del mapa apoyada en un tramo (sus km contados desde
 *                                   «de»), con su lectura; marca resalta un km de la regla con su número («4 km»)
 *   kmRotulo: [4],                  opcional: kilómetros rotulados debajo de la pista («km 4»), con su marca
 *   combi: 2,                       opcional: la combi en el carril de arriba, con su frente en ese km (solo carretera)
 *   hitos: 1,                       opcional: una marca en el borde de la pista cada tantos km
 *   nota: 'AB + BC > 10 km',        opcional: una línea arriba, al centro (un texto o [{ t, paso }]; sin cotas de nivel 3)
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
  const OBJETOS = ['carretera', 'recta', 'soga', 'reloj', 'tranquera', 'rieles', 'pasaje', 'cartulina', 'tijeral', 'angulos'];
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
  // Las rayitas de «miden igual» de los tramos sobre la carretera, la recta o la soga (nivel 0) van sobre un arco que
  // une las dos puntas de su tramo, por encima de la línea, nunca sobre la línea misma. Ronda 2 del lector en frío (18
  // nov): con la marca sobre la línea, si B partía el tramo MC, la rayita de MC caía entre B y C y se leía «AM = BC».
  // Con el arco se ve de qué punta a qué punta va cada tramo marcado, aunque otro punto lo parta.
  // Alto del arco: ALTO_ARCO px sobre la línea; un tramo que contiene a otro tramo marcado va PASO_ARCO px más arriba (AN sobre AM y
  // MB), y todo un grupo (mismo número de rayitas) va a la altura del más alto de los suyos.
  // Devuelve [{ tramo, x, y, hw, holgura, arco: { a, b, alto } }]: (x, y), centro de las rayitas (la cima del arco); hw,
  // medio ancho de las rayitas; holgura, la menor distancia de las rayitas a un punto, a las rayitas de otro grupo o a
  // otro arco. HOLGURA_MARCA es lo mínimo que se pide.
  const HOLGURA_MARCA = 10, ALTO_ARCO = 22, PASO_ARCO = 20, DY_MARCA = 5, R_PUNTO = 5.5;
  // El arco de un tramo: de (a, b) en x, por encima de BOT, con su lomo plano a «alto» px (una llave de esquinas
  // redondas: así un arco que contiene a otro le pasa por encima a la misma distancia en todo su largo). yEn(x) da la
  // altura del lomo en pantalla (null fuera del arco).
  function arcoMarca(a, b, alto) {
    const m = Math.min(4, (b - a) / 6), x0 = a + m, x1 = b - m, y0 = BOT - 6, cima = BOT - alto, r = Math.min(7, (x1 - x0) / 2, y0 - cima);
    const yEn = x => {
      if (x < x0 || x > x1) return null;
      const dx = x < x0 + r ? x0 + r - x : x > x1 - r ? x - (x1 - r) : 0;
      return cima + r - Math.sqrt(Math.max(0, r * r - dx * dx));
    };
    const d = `M${n(x0)} ${n(y0)}L${n(x0)} ${n(cima + r)}Q${n(x0)} ${n(cima)} ${n(x0 + r)} ${n(cima)}L${n(x1 - r)} ${n(cima)}Q${n(x1)} ${n(cima)} ${n(x1)} ${n(cima + r)}L${n(x1)} ${n(y0)}`;
    return { a, b, alto, x0, x1, y0, cima, yEn, d };
  }
  function marcas(d = {}, g = geometria(d)) {
    const ts = (d.tramos || []).filter(t => t.nivel === 0 && t.marcas > 0 && g.P[t.de] && g.P[t.a] && !fuera(d, t.de) && !fuera(d, t.a));
    if (!ts.length) return [];
    const xs = (d.puntos || []).filter(q => !(+q.alto > 0)).map(q => g.P[q.id][0]);
    const hwDe = t => (t.marcas - 1) * 3 + 4;
    const ext = t => [Math.min(g.P[t.de][0], g.P[t.a][0]), Math.max(g.P[t.de][0], g.P[t.a][0])];
    const dentro = (u, t) => { const [a, b] = ext(t), [c, e] = ext(u); return u !== t && c >= a - 0.5 && e <= b + 0.5 && e - c < b - a - 0.5; };
    const prof = new Map();
    const profDe = t => { if (!prof.has(t)) { prof.set(t, 0); prof.set(t, Math.max(0, ...ts.filter(u => dentro(u, t)).map(u => profDe(u) + 1))); } return prof.get(t); };
    const altoGrupo = k => ALTO_ARCO + PASO_ARCO * Math.max(...ts.filter(t => t.marcas === k).map(profDe));
    const puestas = ts.map(t => { const [a, b] = ext(t), arco = arcoMarca(a, b, altoGrupo(t.marcas)); return { tramo: t, x: (a + b) / 2, y: arco.cima, hw: hwDe(t), arco }; });
    for (const z of puestas) {
      let h = Infinity;
      // A los puntos (en la línea): lo que separa la caja de las rayitas del círculo del punto, de lado o hacia arriba.
      for (const x of xs) h = Math.min(h, Math.max(Math.abs(z.x - x) - z.hw - R_PUNTO, BOT - z.y - DY_MARCA - R_PUNTO));
      for (const w of puestas) {
        if (w === z) continue;
        if (w.tramo.marcas !== z.tramo.marcas) h = Math.min(h, Math.max(Math.abs(z.x - w.x) - z.hw - w.hw, Math.abs(z.y - w.y) - 2 * DY_MARCA));
        // A otro arco que pase por debajo o por encima de las rayitas.
        for (const x of [z.x - z.hw, z.x, z.x + z.hw]) { const y = w.arco.yEn(x); if (y !== null) h = Math.min(h, Math.abs(y - z.y) - DY_MARCA); }
      }
      z.holgura = h;
    }
    return puestas;
  }
  // ¿Caben las rayitas con su holgura? (la teoría y el generador arman otro caso si no).
  const marcasCaben = (d, min = HOLGURA_MARCA) => marcas(d).every(z => z.holgura >= min);

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

  // La regla del mapa apoyada en un tramo p→q: una tira con una marca por km (contadas desde p) y su lectura. marca: un
  // km de la regla que se resalta con su número (la marca larga), para comparar el camino con un tramo de carretera sin
  // calcular su largo (ronda 2 del lector, 18 nov: «5 km» y «≈ 6,7 km» salían de Pitágoras).
  function reglaEn(p, q, s, texto, marca) {
    const nv = normalArriba(p, q), L = Math.hypot(q[0] - p[0], q[1] - p[1]), u = [(q[0] - p[0]) / L, (q[1] - p[1]) / L];
    const off = (pt, k) => [pt[0] + nv[0] * k, pt[1] + nv[1] * k];
    const a = off(p, 9), b = off(q, 9), c = off(q, 19), e = off(p, 19);
    let out = `<path d="M${n(a[0])} ${n(a[1])}L${n(b[0])} ${n(b[1])}L${n(c[0])} ${n(c[1])}L${n(e[0])} ${n(e[1])}Z" fill="currentColor" fill-opacity="0.1" ${tinta(1.5)}/>`;
    const km = L / s;
    for (let k = 0; k <= km + 1e-9; k++) {
      const t = [p[0] + u[0] * k * s, p[1] + u[1] * k * s], t1 = off(t, 9), t2 = off(t, 14);
      out += `<line x1="${n(t1[0])}" y1="${n(t1[1])}" x2="${n(t2[0])}" y2="${n(t2[1])}" ${tinta(1.2)}/>`;
    }
    if (Number.isFinite(marca) && marca <= km + 1e-9) {
      const t = [p[0] + u[0] * marca * s, p[1] + u[1] * marca * s], t1 = off(t, 4), t2 = off(t, 22);
      out += `<line x1="${n(t1[0])}" y1="${n(t1[1])}" x2="${n(t2[0])}" y2="${n(t2[1])}" ${tinta(2.5)}/>`;
      out += rotuloNormal(off(t, 25), nv, `${f(marca)} km`, undefined, 14);
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
    // Kilómetros rotulados debajo de la pista («km 4»): una marca en el borde de abajo y su número, para que «frente al
    // kilómetro 4» se vea en el dibujo (ronda 2 del lector, 18 nov).
    for (const k of d.kmRotulo || []) {
      const x = g.X(+k);
      s += `<line x1="${n(x)}" y1="${BOT - 6}" x2="${n(x)}" y2="${BOT + 6}" ${tinta(1.5)}/>` + T.rotulo(x, LETRA, `km ${f(+k)}`, { ancla: 'middle', peso: 600, tam: 13, min: M, max: W - M });
    }
    if (carretera && Number.isFinite(+d.combi) && d.combi !== null && d.combi !== '') s += combi(Math.max(8 + CW, Math.min(W - 8, g.X(+d.combi))));

    // Alturas: de un punto de afuera a la carretera, punteada, con su medida al lado.
    for (const al of d.alturas || []) {
      if (!visible(al, p)) continue;
      const q = g.P[al.punto];
      if (!q) continue;
      // La medida va sobre la punteada, justo encima de la pista, y la punteada se corta debajo del rótulo (auditoría, 17
      // nov: al pie, debajo de la pista, se leía como un tramo de la carretera; a media altura no cabe entre los caminos).
      const t = textoEn(al.texto, p), base = TOP - 6, alto = 16 * 0.8;
      const linea = (y1, y2) => (y2 - y1 > 2 ? `<line x1="${n(q[0])}" y1="${n(y1)}" x2="${n(q[0])}" y2="${n(y2)}" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4"/>` : '');
      // El rótulo se corre a lo ancho (sin dejar la punteada) hasta quedar lo más lejos posible de los caminos.
      const w = T.ancho(t || '', 16, 700), y0 = base - alto, y1 = base + 4;
      const caminos = (d.tramos || []).filter(tt => fuera(d, tt.de) || fuera(d, tt.a)).map(tt => [g.P[tt.de], g.P[tt.a]]).filter(([u, v]) => u && v);
      const xEn = ([u, v], y) => (Math.abs(v[1] - u[1]) < 1e-9 ? null : u[0] + (v[0] - u[0]) * (y - u[1]) / (v[1] - u[1]));
      let cx = q[0], mejor = -Infinity;
      for (let dx = -w / 2 + 5; dx <= w / 2 - 5; dx += 1) {
        let h = Infinity;
        for (const c of caminos) for (const y of [y0, y1]) { const x = xEn(c, y); if (x !== null) h = Math.min(h, Math.max(q[0] + dx - w / 2 - x, x - (q[0] + dx + w / 2))); }
        if (h > mejor + 1e-9) { mejor = h; cx = q[0] + dx; }
      }
      if (t) s += linea(q[1] + 6, base - alto - 3) + linea(TOP, BOT) + T.rotulo(cx, base, t, { ancla: 'middle', peso: 700, min: M, max: W - M });
      else s += linea(q[1] + 6, BOT);
    }

    // Tramos: cota en la carretera o camino recto si sale de ella. Las rayitas de «miden igual» van sobre el arco de su
    // tramo (marcas).
    const marcasEn = marcas(d, g).filter(z => visible(z.tramo, p));
    for (const t of d.tramos || []) {
      if (!visible(t, p)) continue;
      const a = g.P[t.de], b = g.P[t.a];
      if (!a || !b) continue;
      const color = cs[nombre(t)] || undefined, texto = textoEn(t.texto, p);
      if (!fuera(d, t.de) && !fuera(d, t.a)) {
        if (t.nivel === 0) { const mk = marcasEn.find(z => z.tramo === t); if (mk) s += `<path d="${mk.arco.d}" fill="none" ${tinta(1.5)}/>` + rayitas(mk.x, mk.y, t.marcas, DY_MARCA); continue; }
        s += cota(a[0], b[0], t.nivel || 1, texto, color, t.marcas); continue;
      }
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
      if (a && b) s += reglaEn(a, b, g.s, textoEn(r.texto, p), +r.marca);
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
    for (const z of marcas(d, g)) top = Math.min(top, z.y - DY_MARCA - 6);
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
  // Un ángulo con 2 o 3 arcos (marcas, de geo-figura: cada arco 5 px más afuera; Triángulos, 18 nov) ocupa más: su rótulo
  // y los arcos vecinos cuentan desde el arco de afuera.
  const extraArcos = an => 5 * Math.max(0, Math.min(3, an.marcas || 1) - 1);

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
    const r0 = (an.radio || 26) + extraArcos(an) + 4, hol = an.holgura === undefined ? 5 : an.holgura;
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
    const q = lugarRotulo(g, an), r = an.radio || 26, r2 = q.d - q.sb - 5 - extraArcos(an);
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
    const en = (d, t = bis) => { const x = c[0] + d * Math.cos(t), y = c[1] + d * Math.sin(t); return { x, y, w: q.w, h: q.h, caja: cajaDe(x, y, q.w, q.h) }; };
    const cabe = z => z.caja.y0 >= M && z.caja.y1 <= g.alto - M && Math.abs(z.caja.x0 + z.w / 2 - z.x) < 0.5 && !lineas.some(([a, b]) => tocaCaja(a, b, z.caja));
    // Un rótulo «centro» (el ángulo entero, más afuera que sus partes) no va encima de la bisectriz punteada ni de la
    // paralela por su vértice (ronda 2 del lector, 18 nov: con la punteada cortada debajo, «76°», «70°», «x» y «84°» se
    // seguían leyendo sobre la línea). Se corre de a poco a un lado de su bisectriz, más allá de su arco, hasta que su caja
    // (con 3 px de aire) no toque ningún trazo recto; si no hay lugar, se queda sobre la bisectriz (y la punteada se corta).
    if (an.centro) {
      const aire = (b, e) => ({ x0: b.x0 - e, x1: b.x1 + e, y0: b.y0 - e, y1: b.y1 + e });
      const libre = z => z.caja.y0 >= M && z.caja.y1 <= g.alto - M && Math.abs(z.caja.x0 + z.w / 2 - z.x) < 0.5 && !lineas.some(([a, b]) => tocaCaja(a, b, aire(z.caja, 6))) && !puestos.some(b => chocan(z.caja, b, 6));
      const tope = Math.abs(dt) / 2 - 3 * RAD;
      let mejor = null;
      // El lugar más cercano al de la bisectriz: lo que se aleja hacia afuera más lo que se corre de lado (en px de arco).
      for (let k = 0; k * RAD <= tope; k++) for (const sg of k ? [1, -1] : [1]) for (let dd = 0; dd <= 32; dd += 4) {
        const costo = dd + (q.d + dd) * k * RAD;
        if (mejor && costo >= mejor.costo) continue;
        const z = en(q.d + dd, bis + sg * k * RAD);
        if (libre(z)) mejor = { z, costo };
      }
      if (mejor) return mejor.z;
    }
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
      // letras: [A, B] nombra las puntas del minutero y del horario (para leer m∠AOB en «Lee»).
      const ls = r.letras || [];
      puntos.push(pt(O, c, r.O ? { rotulo: 'O', lado: 90 - libre, sinPunto: true } : undefined),
        pt(Mk, Mi, ls[0] ? { rotulo: ls[0], lado: 180, sinPunto: true } : undefined), pt(Hk, Ho, ls[1] ? { rotulo: ls[1], lado: gH, sinPunto: true } : undefined));
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
    if (d.pista) angulos.push(conTexto(ang('O', 'A', 'B', { radio: 30, holgura: 8, lejos: 2.4, afuera: 2.62, mide: a, ajusta: false, centro: bis !== undefined }), d.pista));
    if (d.poste && a < 90) angulos.push(conTexto(ang('O', 'B', 'T', { radio: 36, holgura: 8, lejos: d.poste.lejos || 1.4, afuera: 2.62, mide: 90 - a, ajusta: false }), d.poste));
    if (d.otro) angulos.push(conTexto(ang('O', 'B', 'D', { radio: 84, holgura: 8, sector: a < 90 ? [96, 178] : undefined, mide: 180 - a }), d.otro));
    const mi = d.mitades;
    if (mi) {
      angulos.push(conTexto(ang('O', 'A', 'M1', { radio: 30, rayita: 1, holgura: 6, lejos: 2.4, mide: a / 2, ajusta: false }), { texto: mi.texto1, color: mi.color1, desde: mi.desde1 }));
      angulos.push(conTexto(ang('O', 'M1', 'B', { radio: 30, rayita: 1, mide: a / 2 }), { color: mi.color1, desde: mi.desde1 }));
      angulos.push(conTexto(ang('O', 'B', 'M2', { radio: 30, rayita: 2, mide: 90 - a / 2 }), { color: mi.color2, desde: mi.desde2 }));
      angulos.push(conTexto(ang('O', 'M2', 'D', { radio: 30, rayita: 2, holgura: 6, mide: 90 - a / 2 }), { texto: mi.texto2, color: mi.color2, desde: mi.desde2 }));
    }
    // El ángulo entre las bisectrices lleva su arco (no el cuadradito) y su rótulo sobre su propia bisectriz (auditoría,
    // 17 nov: el «?» sin arco, entre el poste y la barra, parecía pedir esos 40°).
    if (d.entre) angulos.push(conTexto(ang('O', 'M1', 'M2', { radio: 64, holgura: 6, mide: 90, ajusta: false, centro: true, arcoRecto: true }), d.entre));
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
    // Con la paralela auxiliar a la vista, el rótulo de x va sobre su bisectriz y la paralela se corta debajo (en la parte
    // de arriba se leía como la copia de a); si ya están las copias de a y b, x lleva solo su arco mientras se vea.
    const conAux = d.aux !== undefined, copias = A.a2 || A.b2;
    if (A.x) angulos.push(conTexto(ang('V', 'P', 'Q', Object.assign({ radio: copias ? 18 : 30, holgura: 6, mide: a + b }, conAux && !copias ? { centro: true } : {})),
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

  // ---------- Triángulos (geometria.triangulos, 18 nov): la cartulina y el tijeral (dibujos de prueba) ----------
  // Afirmación de la cartulina: los tres ángulos de un triángulo son las tres esquinas de una cartulina; recortadas y
  // juntas sobre el borde recto de una regla, no dejan hueco ni se montan. Fidelidad: la base BC mide 6 (horizontal, B a
  // la izquierda) y A sale de los ángulos b (en B) y c (en C), a escala (ley de senos); las esquinas recortadas son las
  // mismas de la cartulina (mismo tamaño R, mismos ángulos).
  const TRI_L = 6;
  // Arcos de cada vértice (regla de la unidad: 1 en A, 2 en B, 3 en C; sus copias y sus esquinas llevan los mismos).
  const ARCOS_V = { A: 1, B: 2, C: 3 };
  function vertices(b, c, L = TRI_L) {
    const ab = L * Math.sin(c * RAD) / Math.sin((b + c) * RAD);
    return { A: pol([0, 0], ab, b), B: [0, 0], C: [L, 0] };
  }
  // Lo que se ve en una ventana de cortes [desde, hasta]: la intersección con el desde/hasta propio (null si no se ve).
  function ventana(x, w) {
    const de = Math.max(x.desde || 0, w[0]), ha = Math.min(x.hasta === undefined ? Infinity : x.hasta, w[1]);
    if (de > ha) return null;
    const y = Object.assign({}, x, { desde: de });
    if (ha === Infinity) delete y.hasta; else y.hasta = ha;
    return y;
  }
  const ruta = (g, ps) => 'M' + ps.map(q => { const z = g.S(q); return `${n(z[0])} ${n(z[1])}`; }).join('L') + 'Z';
  const enCorte = (ws, corte) => ws.some(w => corte >= w[0] && corte <= w[1]);
  // La cartulina sobre la mesa, con la regla al lado.
  //   { b, c,                        ángulos en B y C (grados); sin triángulo: triangulo: false
  //     angulos: { A, B, C: { texto, color, desde, hasta } | null },   los tres ángulos interiores (null: sin arco)
  //     letras: true,                las letras A, B y C (letraA: la de A, tantas unidades más lejos)
  //     cortes: k,                   desde qué corte se ven las líneas punteadas por donde se cortan las esquinas
  //     recorte: k, restaura: k2,    de k a k2 − 1 las esquinas están recortadas y juntas sobre el borde de la regla;
  //                                  desde k2, la cartulina entera otra vez (las esquinas siguen en la regla)
  //     R: 2,                        cuánto se corta de cada lado en cada esquina (mientras se ven las líneas de corte,
  //                                  los ángulos de la cartulina quedan solo con sus arcos: el rótulo pisaría el corte)
  //     paralela: k, copias: k,      la paralela a BC por A (punteada) y las copias de B y C arriba (alternos internos)
  //     copiasTexto: { B, C },       sus rótulos (si no, los de B y C)
  //     piezas: [{ en: [x, y] | 'regla', dx, de, a, texto, color, marcas, desde, hasta }],   esquinas sueltas (grados del
  //                                  plano, antihorario); en: 'regla' las apoya en el borde de la regla (dx: corrimiento)
  //     regla: true | false, reglaY, vista: { x, y } (fija, para el juego), alto }
  function cartulina(d) {
    const tri = d.triangulo !== false, b = d.b, c = d.c, R = d.R || 2;
    const { A, B, C } = tri ? vertices(b, c) : { A: [TRI_L / 2, 2], B: [0, 0], C: [TRI_L, 0] };
    const K = d.recorte, K2 = d.restaura;
    const llena = K === undefined ? [[0, Infinity]] : [[0, K - 1], ...(K2 !== undefined ? [[K2, Infinity]] : [])];
    const cortada = K === undefined ? [] : [[K, K2 !== undefined ? K2 - 1 : Infinity]];
    const enV = (x, ws) => ws.map(w => ventana(x, w)).filter(Boolean);
    const AN = d.angulos || {}, medida = { A: 180 - b - c, B: b, C: c };
    // Las esquinas (sueltas o en la regla) y, con recorte, las tres de la cartulina sobre la regla: B a la izquierda, A en
    // medio y C a la derecha, en el mismo orden que la paralela por A.
    const piezas = (d.piezas || []).map(q => Object.assign({}, q));
    if (tri && K !== undefined) {
      const tx = v => (AN[v] && AN[v].texto !== undefined ? AN[v].texto : v);
      piezas.push({ en: 'regla', de: 180 - b, a: 180, texto: tx('B'), marcas: 2, desde: K, v: 'B' },
        { en: 'regla', de: c, a: 180 - b, texto: tx('A'), marcas: 1, desde: K, v: 'A' }, { en: 'regla', de: 0, a: c, texto: tx('C'), marcas: 3, desde: K, v: 'C' });
    }
    const enRegla = piezas.some(q => q.en === 'regla');
    const yR = d.reglaY !== undefined ? d.reglaY : enRegla ? (tri ? -(R + 2.3) : -(R + 1.6)) : -1.0, hR = 0.5, conRegla = d.regla !== false || enRegla;
    const xR = [-0.45, TRI_L + 0.45];
    piezas.forEach(q => { q.V = q.en === 'regla' ? [TRI_L / 2 + (q.dx || 0), yR] : q.en; });

    const puntos = [], segmentos = [], angulos = [];
    if (tri) {
      const L = d.letras !== false, ladoA = (b - c) / 2 + 90, ladoB = b / 2 + 180, ladoC = -c / 2;
      // letraA: cuántas unidades se aleja la letra A de su vértice (en el juego, la manija de A la tapaba).
      const lejosA = d.letraA || 0, Aq = pol(A, lejosA, ladoA);
      puntos.push(pt('A', A, L && !lejosA ? { rotulo: 'A', lado: ladoA, sinPunto: true } : undefined), pt('B', B, L ? { rotulo: 'B', lado: ladoB, sinPunto: true } : undefined),
        pt('C', C, L ? { rotulo: 'C', lado: ladoC, sinPunto: true } : undefined));
      if (L && lejosA) puntos.push(pt('Aletra', Aq, { rotulo: 'A', lado: ladoA, sinPunto: true }));
      const u = (p, q) => { const l = Math.hypot(q[0] - p[0], q[1] - p[1]); return [(q[0] - p[0]) / l, (q[1] - p[1]) / l]; };
      const corte = (p, q, id) => puntos.push(pt(id, mas(p, u(p, q), R)));
      corte(A, B, 'aB'); corte(A, C, 'aC'); corte(B, A, 'bA'); corte(B, C, 'bC'); corte(C, A, 'cA'); corte(C, B, 'cB');
      for (const [p, q] of [['A', 'B'], ['B', 'C'], ['C', 'A']]) segmentos.push(...enV({ de: p, a: q }, llena));
      // Las líneas por donde se corta cada esquina: punteadas antes del recorte; recortadas, el borde de lo que queda.
      const cuerdas = [['aB', 'aC'], ['bA', 'bC'], ['cB', 'cA']];
      if (d.cortes !== undefined) for (const [p, q] of cuerdas) segmentos.push(...enV({ de: p, a: q, discontinua: true, desde: d.cortes }, [[0, K === undefined ? Infinity : K - 1]]));
      for (const [p, q] of [...cuerdas, ['aB', 'bA'], ['bC', 'cB'], ['cA', 'aC']]) segmentos.push(...enV({ de: p, a: q }, cortada));
      // Donde estaban las esquinas queda su contorno, fino y punteado.
      for (const [p, q] of [['A', 'aB'], ['A', 'aC'], ['B', 'bA'], ['B', 'bC'], ['C', 'cA'], ['C', 'cB']]) segmentos.push(...enV({ de: p, a: q, discontinua: true, grosor: 'fino' }, cortada));
      const LADOS = { A: ['B', 'C'], B: ['C', 'A'], C: ['A', 'B'] };
      for (const v of ['A', 'B', 'C']) {
        if (AN[v] === null) continue;
        const x = AN[v] || {};
        const an = ang(v, LADOS[v][0], LADOS[v][1], { radio: d.radio || 20, holgura: 6, marcas: x.marcas || ARCOS_V[v], mide: medida[v], color: x.color === undefined && x.texto === undefined ? 'h' : x.color, texto: x.texto });
        if (x.desde !== undefined) an.desde = x.desde;
        if (x.hasta !== undefined) an.hasta = x.hasta;
        const conRotulo = d.cortes === undefined || K === undefined ? llena : [[0, d.cortes - 1], ...llena.slice(1)];
        angulos.push(...enV(an, conRotulo));
        if (conRotulo !== llena && an.texto !== undefined) angulos.push(...enV(Object.assign({}, an, { texto: undefined }), [[d.cortes, K - 1]]));
      }
      if (d.paralela !== undefined) {
        puntos.push(pt('Pi', [A[0] - 3, A[1]]), pt('Pd', [A[0] + 3, A[1]]));
        segmentos.push({ de: 'Pi', a: 'Pd', recta: true, discontinua: true, grosor: 'fino', desde: d.paralela });
        const ct = d.copiasTexto || {}, k = d.copias === undefined ? d.paralela : d.copias;
        const cp = (v, de, a) => ang('A', de, a, { radio: d.radio || 20, holgura: 6, marcas: ARCOS_V[v], mide: medida[v], color: 'h', texto: ct[v] !== undefined ? ct[v] : (AN[v] || {}).texto, desde: k });
        angulos.push(cp('B', 'Pi', 'B'), cp('C', 'C', 'Pd'));
      }
    }
    piezas.forEach((q, k) => {
      const id = `e${k}`, V = q.V;
      puntos.push(pt(`${id}v`, V), pt(`${id}1`, pol(V, R, q.de)), pt(`${id}2`, pol(V, R, q.a)));
      // Los bordes de la esquina son trazos de la figura: así ningún rótulo los pisa (la pieza los revisa).
      for (const [u, w] of [['v', '1'], ['1', '2'], ['2', 'v']]) segmentos.push(Object.assign({ de: `${id}${u}`, a: `${id}${w}`, grosor: 'fino' }, q.desde !== undefined ? { desde: q.desde } : {}, q.hasta !== undefined ? { hasta: q.hasta } : {}));
      // El rótulo de una esquina va afuera de su corte, en su bisectriz (adentro no cabe con sus arcos).
      const an = ang(`${id}v`, `${id}1`, `${id}2`, { radio: 17, holgura: 4, marcas: q.marcas || 1, mide: q.a - q.de, color: q.color === undefined ? 'h' : q.color, texto: q.texto, lejos: 0, afuera: R, ajusta: false, fijo: true });
      if (q.desde !== undefined) an.desde = q.desde;
      if (q.hasta !== undefined) an.hasta = q.hasta;
      angulos.push(an);
    });

    let vista = d.vista;
    if (!vista) {
      const xs = [], ys = [];
      const mete = p => { xs.push(p[0]); ys.push(p[1]); };
      if (tri) { [A, B, C].forEach(mete); ys.push(A[1] + 0.8, -0.8); }
      if (d.paralela !== undefined) { xs.push(A[0] - 3, A[0] + 3); }
      for (const q of piezas) { mete(q.V); for (const t of [q.de, (q.de + q.a) / 2, q.a]) mete(pol(q.V, R + 1.0, t)); }
      if (conRegla) { mete([xR[0], yR - hR - 0.25]); mete([xR[1], yR]); }
      vista = { x: [Math.min(...xs) - 0.55, Math.max(...xs) + 0.55], y: [Math.min(...ys) - 0.1, Math.max(...ys) + 0.1] };
    }
    const qt = piezas.map(q => q.texto).filter(t => t !== undefined && t !== null && t !== '');
    const fig = {
      alt: tri ? `Un triángulo de cartulina sobre la mesa, con ángulos de ${Kit.formatear(180 - b - c, 1)}° en A, ${Kit.formatear(b, 1)}° en B y ${Kit.formatear(c, 1)}° en C, y una regla al lado${K !== undefined ? '; sus tres esquinas, recortadas, se juntan sobre el borde recto de la regla' : ''}${d.paralela !== undefined ? '; por A pasa una paralela a BC' : ''}.`
        : `Esquinas recortadas de cartulina${enRegla ? ', juntas sobre el borde de una regla' : ' sobre la mesa'}${qt.length ? `: ${qt.join(', ')}` : ''}.`,
      vista, alto: d.alto || 270, puntos, segmentos, angulos };
    const deco = (g, corte) => {
      // La mesa (y unas vetas), la regla y la cartulina con su sombra; las esquinas sueltas o en la regla.
      let s = `<rect x="8" y="8" width="${W - 16}" height="${n(g.alto - 16)}" rx="6" fill="currentColor" fill-opacity="0.05"/>`;
      for (const y of [0.22, 0.47, 0.78]) s += `<path d="M14 ${n(g.alto * y)}Q${W / 2} ${n(g.alto * y + 7)} ${W - 14} ${n(g.alto * y - 3)}" fill="none" stroke="currentColor" stroke-opacity="0.1" stroke-width="1.5"/>`;
      if (conRegla) {
        const p0 = g.S([xR[0], yR]), p1 = g.S([xR[1], yR - hR]);
        s += `<rect x="${n(p0[0])}" y="${n(p0[1])}" width="${n(p1[0] - p0[0])}" height="${n(p1[1] - p0[1])}" rx="2" fill="var(--card)" stroke="currentColor" stroke-width="1.5"/>`;
        for (let k = 0; k <= (xR[1] - xR[0] - 0.3) / 0.5; k++) {
          const x = g.S([xR[0] + 0.15 + k * 0.5, yR])[0], largo = k % 2 ? 4 : 8;
          s += `<line x1="${n(x)}" y1="${n(p0[1] + 1)}" x2="${n(x)}" y2="${n(p0[1] + 1 + largo)}" stroke="currentColor" stroke-width="1.2"/>`;
        }
      }
      if (tri) {
        const en = id => { const q = puntos.find(z => z.id === id); return [q.x, q.y]; };
        const forma = enCorte(cortada, corte) ? ['aB', 'bA', 'bC', 'cB', 'cA', 'aC'].map(en) : [A, B, C];
        if (enCorte(llena, corte) || enCorte(cortada, corte)) {
          const sombra = ruta(g, forma).replace(/(-?[\d.]+) (-?[\d.]+)/g, (m, x, y) => `${n(+x + 2.5)} ${n(+y + 2.5)}`);
          s += `<path d="${sombra}" fill="currentColor" fill-opacity="0.12"/><path d="${ruta(g, forma)}" fill="var(--card)"/>`;
        }
      }
      for (const q of piezas) {
        if (!ve(q, corte)) continue;
        const ps = [q.V, pol(q.V, R, q.de), pol(q.V, R, q.a)];
        const sombra = ruta(g, ps).replace(/(-?[\d.]+) (-?[\d.]+)/g, (m, x, y) => `${n(+x + 2)} ${n(+y + 2)}`);
        s += `<path d="${sombra}" fill="currentColor" fill-opacity="0.12"/><path d="${ruta(g, ps)}" fill="var(--card)" fill-opacity="0.72"/>`;
      }
      return s;
    };
    return { fig, deco };
  }
  // El tijeral de un techo: dos vigas inclinadas (los pares) y una horizontal (el tirante), clavadas en sus puntas, con la
  // calamina encima y la pared debajo. Mismo triángulo que la cartulina (base 6, ángulos b y c); sin letras.
  //   { b, c, angulos: { A, B, C: { texto, color } }, alto }
  function tijeral(d) {
    const b = d.b, c = d.c, { A, B, C } = vertices(b, c), AN = d.angulos || {}, medida = { A: 180 - b - c, B: b, C: c };
    const LADOS = { A: ['B', 'C'], B: ['C', 'A'], C: ['A', 'B'] }, angulos = [];
    for (const v of ['A', 'B', 'C']) {
      const x = AN[v];
      if (!x) continue;
      angulos.push(ang(v, LADOS[v][0], LADOS[v][1], { radio: 24, holgura: 11, marcas: x.marcas || ARCOS_V[v], mide: medida[v], color: x.color, texto: x.texto, desde: x.desde || 0 }));
    }
    const ab = Math.hypot(A[0], A[1]), ac = Math.hypot(C[0] - A[0], C[1] - A[1]);
    const alero = 0.55, EB = mas(B, [-A[0] / ab, -A[1] / ab], alero), EC = mas(C, [(C[0] - A[0]) / ac, (C[1] - A[1]) / ac], alero);
    const fig = { alt: d.alt || `Tijeral de un techo: dos vigas inclinadas y una horizontal forman un triángulo, con ${Kit.formatear(b, 1)}° y ${Kit.formatear(c, 1)}° abajo y ${Kit.formatear(180 - b - c, 1)}° arriba; encima va la calamina.`,
      vista: { x: [EB[0] - 0.3, EC[0] + 0.3], y: [-1.25, A[1] + 0.55] }, alto: d.alto || 230,
      puntos: [pt('A', A), pt('B', B), pt('C', C)], segmentos: [], angulos };
    const deco = g => {
      const HW = 4.5;
      const tabla = (p, q, e0, e1) => {
        const P = g.S(p), Q = g.S(q), L = Math.hypot(Q[0] - P[0], Q[1] - P[1]), u = [(Q[0] - P[0]) / L, (Q[1] - P[1]) / L], nn = [-u[1], u[0]];
        const z = (o, k, e) => [o[0] + u[0] * k + nn[0] * e, o[1] + u[1] * k + nn[1] * e];
        const ps = [z(P, -e0, -HW), z(Q, e1, -HW), z(Q, e1, HW), z(P, -e0, HW)];
        return `<path d="M${ps.map(q => `${n(q[0])} ${n(q[1])}`).join('L')}Z" fill="var(--card)" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>`
          + `<path d="M${z(P, -e0 + 3, 0).map(n).join(' ')}L${z(Q, e1 - 3, 0).map(n).join(' ')}" fill="none" stroke="currentColor" stroke-opacity="0.18" stroke-width="1"/>`;
      };
      // La calamina: una franja sobre cada par, del alero hasta cerca de la cumbrera.
      const calamina = (p, q, lado) => {
        const P = g.S(p), Q = g.S(q), L = Math.hypot(Q[0] - P[0], Q[1] - P[1]), u = [(Q[0] - P[0]) / L, (Q[1] - P[1]) / L], nn = [-u[1] * lado, u[0] * lado];
        const z = (k, e) => [P[0] + u[0] * k + nn[0] * e, P[1] + u[1] * k + nn[1] * e];
        const ps = [z(-2, HW + 2), z(L * 0.9, HW + 2), z(L * 0.9, HW + 6), z(-2, HW + 6)];
        return `<path d="M${ps.map(q => `${n(q[0])} ${n(q[1])}`).join('L')}Z" fill="currentColor" fill-opacity="0.35"/>`;
      };
      const p0 = g.S([B[0] - 0.15, 0]), p1 = g.S([C[0] + 0.15, -1.15]);
      let s = `<rect x="${n(p0[0])}" y="${n(p0[1])}" width="${n(p1[0] - p0[0])}" height="${n(p1[1] - p0[1])}" fill="currentColor" fill-opacity="0.07"/>`;
      s += calamina(EB, A, -1) + calamina(EC, A, 1);
      s += tabla(EB, A, 0, 4) + tabla(EC, A, 0, 4) + tabla(B, C, 3, 3);
      return s;
    };
    return { fig, deco };
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
    // Dos ángulos se estorban solo si se ven a la vez (sus intervalos desde–hasta se tocan).
    const juntos = (a, b) => Math.max(a.desde || 0, b.desde || 0) <= Math.min(a.hasta === undefined ? Infinity : a.hasta, b.hasta === undefined ? Infinity : b.hasta);
    // angR: medio ancho angular del rótulo de un ángulo «centro» (su rótulo cae sobre un lado de los vecinos: el arco de
    // un vecino que lo toca pasa por fuera).
    const lejos = {}, cerca = {}, dirR = {}, angR = {};
    for (const i of orden) {
      let a = angs[i];
      if (a.texto && !a.sector && !a.centro) {
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
      // Si la franja es el rótulo de una parte («?» de la mitad), el arco del entero pasa 14 px más allá de ese rótulo: así
      // el rótulo queda claramente más cerca de su propio arco que del arco del entero (ronda 2 del lector, 18 nov: el «?»
      // quedaba a medio camino entre los dos arcos y no se sabía de cuál era).
      const franjas = orden.filter(j => j !== i && lejos[j] !== undefined && angs[j].en === a.en && juntos(a, angs[j]) && (contiene(iv[i], iv[j]) || (dirR[j] !== undefined && dentro(dirR[j], iv[i], angR[j] ? -angR[j] : 0.03))))
        .map(j => [cerca[j], lejos[j], cerca[j] > 0 && contiene(iv[i], iv[j]) ? 14 : 6]).sort((x, y) => x[0] - y[0]);
      // fijo: true (las esquinas recortadas de la cartulina, Triángulos): su arco no se mueve; cada esquina es otra pieza.
      if (!a.fijo) {
        let rr = a.radio || 26;
        for (const [c0, c1, aire] of franjas) if (rr + 5 > c0 && rr - aire < c1) rr = Math.ceil(c1 + aire);
        a.radio = rr;
        a = angs[i] = conArco(g, a);
      }
      if (a.texto) { const q = lugarRotulo(g, a), sc = sectorEn(g, a), md = Math.hypot(q.w, q.h) / 2; lejos[i] = q.d + md; cerca[i] = q.d - md; dirR[i] = norm(sc.t1 + sc.dt / 2); if (a.centro) angR[i] = Math.atan2(md, q.d); } else { lejos[i] = (a.radio || 26) + extraArcos(a) + (a.rayita ? 6 : 2); cerca[i] = 0; }
    }
    // El rótulo «centro» de un ángulo más grande puede caer sobre el lado de uno más chico (la bisectriz de ∠AOB es lado
    // de ∠DOE): el arco del más chico pasa por fuera de ese rótulo.
    orden.forEach((i, pos) => {
      const a = angs[i];
      if (a.fijo) return;
      for (const j of orden.slice(pos + 1)) {
        if (angR[j] === undefined || angs[j].en !== a.en || !juntos(a, angs[j]) || !dentro(dirR[j], iv[i], -angR[j])) continue;
        const rr = a.radio || 26;
        if (rr + 5 > cerca[j] && rr - 5 < lejos[j]) angs[i] = Object.assign(a, { radio: Math.ceil(lejos[j] + 6) });
      }
    });
    // Dos ángulos consecutivos (comparten un lado, ninguno contiene al otro) con el mismo radio se ven como un solo arco
    // (auditoría, 17 nov: 80° y 105°, o k y 2k; ronda 2 del lector, 18 nov: θ, «?» y θ en un cruce de las paralelas, de
    // colores distintos, se fundían en una S): el segundo va 8 px más afuera, sea del color que sea. Las mitades con rayitas
    // (bisectriz) quedan iguales a propósito: las rayitas ya marcan dónde termina cada una.
    const consecutivos = (i, j) => { const a = angs[i], b = angs[j]; return a.en === b.en && [a.de, a.a].some(x => x === b.de || x === b.a) && !contiene(iv[i], iv[j]) && !contiene(iv[j], iv[i]); };
    // (Al final, con los radios ya crecidos: el rótulo del que se aleja se aleja con él.)
    for (let vuelta = 0; vuelta < 4; vuelta++) {
      let cambio = false;
      angs.forEach((a, i) => {
        if (a.rayita || a.fijo) return;
        const tope = angs.find((b, j) => j !== i && !b.rayita && !b.fijo && juntos(a, b) && consecutivos(i, j) && Math.abs((b.radio || 26) - (a.radio || 26)) < 6 && ((b.radio || 26) < (a.radio || 26) || ((b.radio || 26) === (a.radio || 26) && j < i)));
        if (tope) { a.radio = (tope.radio || 26) + 8; cambio = true; }
      });
      if (!cambio) break;
    }

    return angs;
  }

  const ESCENAS = { reloj, tranquera, rieles, pasaje, cartulina, tijeral,
    angulos: d => ({ fig: d.figura || { puntos: [] }, ls: g => (d.ls || []).map(l => g.S(l.p)), encima: g => (d.ls || []).map(l => { const q = g.S(l.p); return rotuloL(q[0], q[1], l.k); }).join('') }) };
  const escena = d => ESCENAS[d.objeto](d);
  // Un trazo punteado que pasa por el vértice de un rótulo «centro» (la bisectriz, o la paralela auxiliar por V) y cruza
  // su caja: dónde se corta. Devuelve { S, E, c0, c1, t0, t1 } en pantalla (S y E, sus puntas; la recta, hasta 4 px del
  // borde como la dibuja geo-figura) o null.
  function cortePunteado(g, l, centrados) {
    let S = g.S(l.de), E = g.S(l.a);
    if (!S || !E) return null;
    if (l.recta) {
      const d = [E[0] - S[0], E[1] - S[1]];
      let t0 = -Infinity, t1 = Infinity;
      for (const [k, hi] of [[0, W], [1, g.alto]]) {
        if (Math.abs(d[k]) < 1e-12) continue;
        let u = (4 - S[k]) / d[k], v = (hi - 4 - S[k]) / d[k]; if (u > v) [u, v] = [v, u];
        t0 = Math.max(t0, u); t1 = Math.min(t1, v);
      }
      if (!(t0 < t1)) return null;
      [S, E] = [[S[0] + d[0] * t0, S[1] + d[1] * t0], [S[0] + d[0] * t1, S[1] + d[1] * t1]];
    }
    const u = [E[0] - S[0], E[1] - S[1]], L = Math.hypot(...u) || 1;
    for (const c of centrados) {
      const V = g.S(c.en), dist = Math.abs((V[0] - S[0]) * u[1] - (V[1] - S[1]) * u[0]) / L;
      if (dist > 1) continue;
      const b = { x0: c.caja.x0 - 3, x1: c.caja.x1 + 3, y0: c.caja.y0 - 3, y1: c.caja.y1 + 3 };
      let t0 = null, t1 = null;
      for (let k = 0; k <= 2 * L; k++) { const t = k / (2 * L), x = S[0] + u[0] * t, y = S[1] + u[1] * t; if (x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1) { if (t0 === null) t0 = t; t1 = t; } }
      if (t0 === null) continue;
      return { S, E, t0, t1, c0: [S[0] + u[0] * t0, S[1] + u[1] * t0], c1: [S[0] + u[0] * t1, S[1] + u[1] * t1] };
    }
    return null;
  }
  function dibujarEscena(d, estado = {}) {
    const G = GF(), e = escena(d), fig = e.fig, g = G.geometria(fig);
    const corte = Math.max(0, (estado && estado.corte) || 0);
    const angs = prepararAngulos(g, fig, corte);
    // Un ángulo recto que se pide («?» o una letra en tinta) se dibuja con arco, no con el cuadradito: el cuadradito
    // diría la respuesta. Su lado «de» se gira 0,02° (no se ve; la medida no cambia a la vista).
    const extra = [];
    const conArcoRecto = angs.map((a, k) => {
      // (arcoRecto: el recto entre dos bisectrices también va con arco, para que se vea de dónde a dónde va; auditoría.)
      const pedido = a.arcoRecto || (a.texto !== undefined && !a.color && (/\?$/.test(String(a.texto)) || /^[a-zθ]$/.test(String(a.texto))));
      const { dt } = sectorEn(g, a);
      if (!pedido || a._sec || Math.abs(Math.abs(dt) - Math.PI / 2) > 1e-3) return a;
      const V = g.P(a.en), D = g.P(a.de), t = Math.atan2(D[1] - V[1], D[0] - V[0]) + (dt < 0 ? 1 : -1) * 0.02 * RAD;
      extra.push({ id: `~${k}`, x: V[0] + Math.cos(t), y: V[1] + Math.sin(t), sinPunto: true });
      return Object.assign({}, a, { de: `~${k}` });
    });
    let enc = '';
    const puestos = letras(g, fig, corte, e.ls ? e.ls(g) : []), lineas = trazos(g, fig, corte), centrados = [];
    for (const an of angs) if (an.texto !== undefined && an.texto !== null && an.texto !== '' && ve(an, corte)) {
      const z = separar(g, an, puestos, lineas); puestos.push(z.caja); enc += rotuloAngulo(g, an, z);
      if (an.centro) centrados.push({ en: an.en, caja: z.caja });
    }
    // El rótulo de un ángulo entero va sobre su bisectriz (centro: true), más afuera que sus partes (auditoría, 17 nov:
    // en el hueco de una mitad, «76°» se leía como la mitad). Si un rayo punteado de su vértice (la bisectriz) pasa por
    // debajo del rótulo, se corta ahí y sigue después.
    const segs = [], cortes = [];
    for (const l of fig.segmentos || []) {
      const cortar = l.discontinua && ve(l, corte) ? cortePunteado(g, l, centrados) : null;
      if (!cortar) { segs.push(l); continue; }
      const k = cortes.length / 4, pl = q => G.aPlano(fig, { x: q[0], y: q[1] });
      const ids = ['s', 'a', 'b', 'e'].map(x => `~c${k}${x}`);
      [cortar.S, cortar.c0, cortar.c1, cortar.E].forEach((q, i) => { const r = pl(q); cortes.push({ id: ids[i], x: r[0], y: r[1], sinPunto: true }); });
      const base = Object.assign({}, l); delete base.recta;
      if (cortar.t0 > 0.02) segs.push(Object.assign({}, base, { de: ids[0], a: ids[1] }));
      if (cortar.t1 < 0.98) segs.push(Object.assign({}, base, { de: ids[2], a: ids[3] }));
    }
    const sin = Object.assign({}, fig, { puntos: [...(fig.puntos || []), ...extra, ...cortes], segmentos: segs, angulos: conArcoRecto.map(a => Object.assign({}, a, { texto: undefined })) });
    const svg = G.dibujar(sin, { corte });
    if (e.encima) enc += e.encima(g, corte);
    const deco = e.deco ? `<g class="kit-objeto" data-objeto="${d.objeto}" data-prueba="si">${e.deco(g, corte)}</g>` : '';
    return svg.replace(/^(<svg[^>]*>)/, m => m + deco).replace(/<\/svg>$/, () => `${enc}</svg>`);
  }
  // ¿Caben los rótulos de una escena? Los pone como dibujarEscena y revisa que ninguno salga del lienzo ni pise otro
  // rótulo, una letra, un lado (salvo el rayo que se corta bajo un rótulo «centro») o un arco. La teoría arma otro caso si
  // no caben (como el generador con rotular).
  // Los rótulos de los ángulos de una escena, como se dibujan: [{ an, x, y, caja }] (en pantalla), con los ángulos ya
  // preparados (angs) y las letras (fijos). Lo usan escenaCabe y las pruebas («cada rótulo dentro de su ángulo»).
  function rotulos(d, corte = Infinity) {
    const G = GF(), e = escena(d), fig = e.fig, g = G.geometria(fig), angs = prepararAngulos(g, fig, corte);
    const puestos = letras(g, fig, corte, e.ls ? e.ls(g) : []), fijos = puestos.slice(), lineas = trazos(g, fig, corte), rot = [];
    for (const an of angs) if (an.texto !== undefined && an.texto !== null && an.texto !== '' && ve(an, corte)) {
      const z = separar(g, an, puestos, lineas); puestos.push(z.caja); rot.push({ an, x: z.x, y: z.y, caja: z.caja });
    }
    return { g, fig, angs, fijos, rot, vertice: id => g.S(id) };
  }
  function escenaCabe(d, corte = Infinity) {
    const { g, fig, angs, fijos, rot } = rotulos(d, corte);
    for (const [k, { an, caja: b }] of rot.entries()) {
      if (b.x0 < M || b.x1 > W - M || b.y0 < M || b.y1 > g.alto - M) return false;
      if (fijos.some(q => chocan(b, q, 0)) || rot.some((o, j) => j !== k && chocan(b, o.caja, 0))) return false;
      // Ningún rótulo toca un trazo recto, tampoco la punteada que pasa por su vértice (ronda 2 del lector, 18 nov).
      for (const l of (fig.segmentos || []).filter(x => ve(x, corte))) {
        const [p, q] = trazos(g, { segmentos: [l] }, corte)[0] || [];
        if (p && tocaCaja(p, q, { x0: b.x0 - 2, x1: b.x1 + 2, y0: b.y0 - 2, y1: b.y1 + 2 })) return false;
      }
      // El rótulo queda más cerca de su arco que del arco de un ángulo entero («centro») del mismo vértice que pase por ahí.
      if (!an.sector && !an._sec) {
        const c = g.S(an.en), cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2, dd = Math.hypot(cx - c[0], cy - c[1]), t = Math.atan2(cy - c[1], cx - c[0]), propio = Math.abs(dd - (an.radio || 26));
        for (const o of angs) {
          if (o === an || !o.centro || o.en !== an.en || !ve(o, corte)) continue;
          const sc = sectorEn(g, Object.assign({}, o, { _sec: undefined, sector: undefined })), lo = sc.dt >= 0 ? sc.t1 : sc.t1 + sc.dt, w = Math.abs(sc.dt), x = norm(t - lo);
          if (x > 0.02 && x < w - 0.02 && Math.abs(dd - (o.radio || 26)) < propio) return false;
        }
      }
      for (const a of angs) {
        if (!ve(a, corte)) continue;
        const { c, t1, dt } = sectorEn(g, Object.assign({}, a, { _sec: undefined, sector: undefined }));
        for (let k = 0; k <= extraArcos(a); k += 5) {
          const r = (a.radio || 26) + k;
          for (let i = 0; i <= 24; i++) { const t = t1 + dt * i / 24, x = c[0] + r * Math.cos(t), y = c[1] + r * Math.sin(t); if (x > b.x0 - 1.5 && x < b.x1 + 1.5 && y > b.y0 - 1.5 && y < b.y1 + 1.5) return false; }
        }
      }
    }
    return true;
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

  return { id: 'geo-objeto', dibujar, alt, geometria, marco, colores, colorDe, marcas, marcasCaben, HOLGURA_MARCA, ALTO_ARCO, PASO_ARCO, escenaCabe, rotulos, angulosListos: (d, corte = Infinity) => { const fg = escena(d).fig; return prepararAngulos(GF().geometria(fg), fg, corte); }, OBJETOS, ESCENAS: Object.keys(ESCENAS), escena, lugarRotulo, aPantalla, aPlano, constantes: { W, H, M, TOP, BOT, CENTRO, LETRA, NIVEL, X0, X1 } };
});
