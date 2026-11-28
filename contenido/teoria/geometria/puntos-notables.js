/*
 * Teoría de «Puntos notables del triángulo» (geometria.puntos-notables). Molde: docs/teoria.md.
 * Propuesta: docs/etapa9/propuesta-geometria.md (etapa 9, 26 nov 2026). Fuente: Euclides IV.4 y IV.5 (incentro y
 * circuncentro); Kedlaya, Geometry Unbound §7 (Euler y nueve puntos); investigación docs/investigacion/etapa9/.
 * Compañera: Neri (nutria). Piezas: geo-figura y geo-objeto (escena «notable», bloque propio).
 *
 * Ficha de tarea
 *   Promesa: reconocer cada centro por las líneas que lo forman y por lo que garantiza (equilibrio, igual distancia a los
 *     vértices o a los lados, el cruce de las alturas), saber dónde queda y usar sus medidas.
 *   Persona y condiciones: postulante de 5.º de secundaria, celular a 360 px, sin audio, quizás sin conexión.
 *   Resultado observable: usa el 2 : 1 del baricentro, R y m∠BOC = 2 · m∠A, la tangente s − a y S = r · s, m∠BHC =
 *     180° − m∠A, la tangente s de la exinscrita y GH = 2 · OG con el radio R/2 de los nueve puntos.
 *   Orden de atención: 1.º la figura y su lectura · 2.º la pregunta · acción: «Comprobar» · fondo: Neri.
 *   Duda que resuelve: «¿cuál centro es cuál?» y «¿siempre queda adentro?».
 *
 * Colores (un color por magnitud en toda la unidad; propuesta §6): el tramo largo de una razón 2 : 1 (AG, GH) y las
 * tangentes desde un vértice en naranja (c-o); el tramo corto (GM, OG) y los radios (R, r, el de la exinscrita) en
 * turquesa (c-i); los ángulos dados en carmín (c-h); lo pedido con «?» en tinta y, solo en el texto del resuelto y en la
 * respuesta, en violeta (c-f). Sin verde. La prueba de la unidad lo comprueba en todas las figuras.
 * Códigos: GE8 (informe de geometría); D-EXT y D-COIN documentados en la investigación de la etapa 9; GE-PN, GE-CC,
 * GE-IN, GE-OR, GE-EX y GE-EU son hipótesis (docs/investigacion/geometria-ideas-erroneas.md).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../nucleo/kit/piezas/geo-figura.js'), require('../../../nucleo/kit/piezas/geo-objeto.js'))
    : fabrica(root.Kit, root.Kit.piezas['geo-figura'], root.Kit.piezas['geo-objeto']);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, G, PO) {
  'use strict';
  const U = G.util;
  const f = (n, d = 2) => Kit.formatear(n, d);
  const fm = n => Kit.formatear(n, 2);
  const gr = n => `${Kit.formatear(n, 1)}°`;
  const cm = n => `${fm(n)} cm`, m_ = n => `${fm(n)} m`, cm2 = n => `${fm(n)} cm²`, m2 = n => `${fm(n)} m²`;
  const dO = t => ({ v: 'c-o', t }), dI = t => ({ v: 'c-i', t }), dH = t => ({ v: 'c-h', t }), dF = t => ({ v: 'c-f', t });
  // Entre dos igualdades, «y» o una flecha (un «·» se leía como un producto; auditoría de Circunferencia, M3).
  const Y = '   y   ', FL = '   →   ';
  // Una relación que no se parte en dos líneas: sus espacios pasan a espacios duros.
  const junto = x => (typeof x === 'string' ? x.replace(/ /g, ' ') : Array.isArray(x) ? x.map(junto) : x && x.t ? Object.assign({}, x, { t: junto(x.t) }) : x);
  const GO = 'geo-objeto';
  const figO = (datos, estado = {}) => ({ pieza: GO, datos, estado });
  const NO_ESC = ' El dibujo no está a escala.';
  const pt = (id, p, o = {}) => Object.assign({ id, x: p[0], y: p[1] }, o);
  const enPantalla = (datos, p) => PO.aPantalla(datos, p);
  const alPlano = (datos, p) => PO.aPlano(datos, p);
  const casi = (a, b, e = 1e-9) => Math.abs(a - b) < e;
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[Math.floor(r() * l.length)];
    return r;
  }
  // Las opciones: la correcta y los errores que dan un valor distinto (positivo); siempre 4 si se puede.
  function ops(correcta, distractores, fmt, n = 4) {
    const vistos = new Set([fmt(correcta)]);
    const out = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (!Number.isFinite(d.valor) || d.valor <= 0) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      out.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return out.slice(0, n);
  }
  // Opciones de texto (dónde queda un centro, cuál es): la correcta y las demás, sin repetir.
  const opsTexto = (correcta, otras) => [{ id: 'c', texto: correcta, correcta: true }, ...otras.filter(o => o.texto !== correcta).map(o => ({ id: o.id, texto: o.texto, error: o.error, siFuera: o.siFuera }))].slice(0, 4);
  // «Ahora tú» no repite un ejemplo de su idea (lección M3 de Congruencia): firma de números y pregunta.
  const firmaDe = t => { const q = Kit.plano(t); return `${(q.match(/\d+(?:[  ]\d{3})*(?:,\d+)?/g) || []).join(' ')}|${((q.match(/¿[^?]*\?/g) || []).pop() || '').replace(/\d+(?:,\d+)?/g, '#')}`; };
  const firmasDe = (ejs, mas = []) => new Set(ejs.map(e => firmaDe(e.enunciado)).concat(mas.map(firmaDe)));
  function conCuatro(caso, r, vetadas) {
    for (let i = 0; i < 400; i++) { const c = caso(r); if (c && c.opciones.length >= 4 && !(vetadas && vetadas.has(firmaDe(c.pregunta)))) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }
  // Una figura de geo-figura dentro de la escena «notable» de geo-objeto (como sem() de Proporcionalidad).
  //   pts: { id: [x, y] }; letra: { id: texto | null } (sin entrada, la letra es el id; un id que empieza por «~» es de
  //   ayuda: sin punto ni letra); ver: { id: { …props } }; segs: [[de, a, { … }]]; angs; circs; regiones; lados, llaves,
  //   libres; obj: { tipo, … }; vista, alto, alt, fijas: ids cuya letra no se acomoda.
  function nt(o) {
    const puntos = [];
    for (const [id, p] of Object.entries(o.pts)) {
      const q = { id, x: p[0], y: p[1] }, ayuda = id[0] === '~';
      const letra = o.letra && Object.prototype.hasOwnProperty.call(o.letra, id) ? o.letra[id] : id;
      if (ayuda) q.sinPunto = true; else if (letra) Object.assign(q, { rotulo: letra, lado: 90 });
      Object.assign(q, (o.ver || {})[id] || {});
      puntos.push(q);
    }
    const segmentos = (o.segs || []).map(([de, a, x]) => Object.assign({ de, a }, x || {}));
    const angulos = (o.angs || []).map(a => Object.assign({ radio: 18, holgura: 6 }, a));
    const fg = { alt: o.alt, alto: o.alto || 240, puntos, segmentos, angulos };
    if (o.regiones) fg.regiones = o.regiones;
    if (o.circs) fg.circulos = o.circs;
    const xs = puntos.filter(q => q.id[0] !== '~').map(q => q.x), ys = puntos.filter(q => q.id[0] !== '~').map(q => q.y);
    fg.vista = o.vista || { x: [Math.min(...xs) - 1.2, Math.max(...xs) + 1.2], y: [Math.min(...ys) - 1.2, Math.max(...ys) + 1.2] };
    PO.acomodarLetras(fg, puntos.filter(q => q.rotulo && !(o.fijas || []).includes(q.id)).map(q => q.id), o.evita || {});
    const F = Object.assign({ objeto: 'notable', tipo: 'examen' }, o.obj || {}, { figura: fg },
      o.llaves ? { llaves: o.llaves } : {}, o.lados ? { ladosRot: o.lados } : {}, o.libres ? { libres: o.libres } : {}, o.manija ? { manija: o.manija } : {});
    return acomodarRotulos(F);
  }
  // Si un rótulo de lado pisa algo, se prueban otros lugares (el otro costado, más cerca de una punta, más o menos aire),
  // uno por uno, hasta que todos caben: la figura se revisa entera con escenaCabe en cada corte donde aparece el rótulo.
  function acomodarRotulos(F) {
    const rs = F.ladosRot || [];
    if (!rs.length) return F;
    const cortes = () => { const c = new Set([Infinity]); for (const r of rs) if (r.desde !== undefined) c.add(r.desde); return [...c]; };
    const ok = () => cortes().every(k => PO.escenaCabe(F, k));
    if (ok()) return F;
    const P = Object.fromEntries(F.figura.puntos.map(q => [q.id, [q.x, q.y]]));
    // Las opciones de cada rótulo; se prueban las combinaciones (hasta tres rótulos), primero las más parecidas a la pedida.
    const opciones = rs.map(r => {
      const p = P[r.de], q = P[r.a]; if (!p || !q) return [Object.assign({}, r)];
      const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], n = [-(q[1] - p[1]), q[0] - p[0]], out = [];
      for (const ref of [r.ref, [m[0] + n[0], m[1] + n[1]], [m[0] - n[0], m[1] - n[1]]]) for (const en of [r.en === undefined ? 0.5 : r.en, 0.3, 0.7, 0.2, 0.8]) for (const dist of [r.dist === undefined ? 5 : r.dist, 2, 9])
        out.push({ ref, en, dist });
      return out;
    });
    const base = rs.map(r => Object.assign({}, r));
    const prueba = k => { if (k === rs.length) return ok(); for (const x of opciones[k]) { Object.assign(rs[k], x); if (prueba(k + 1)) return true; } Object.assign(rs[k], base[k]); return false; };
    if (rs.length <= 3) prueba(0);
    return F;
  }
  const cabe = F => PO.escenaCabe(F);

  // Geometría de los centros (la usan las figuras, los juegos y las cuentas).
  const centrosDe = (A, B, C) => {
    const a = U.dist(B, C), b = U.dist(A, C), c = U.dist(A, B), s = (a + b + c) / 2;
    const Gc = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
    const mAB = U.medio(A, B), mAC = U.medio(A, C);
    const O = U.corte(mAB, [mAB[0] - (B[1] - A[1]), mAB[1] + (B[0] - A[0])], mAC, [mAC[0] - (C[1] - A[1]), mAC[1] + (C[0] - A[0])]);
    const H = [A[0] + B[0] + C[0] - 2 * O[0], A[1] + B[1] + C[1] - 2 * O[1]];
    const I = [(a * A[0] + b * B[0] + c * C[0]) / (2 * s), (a * A[1] + b * B[1] + c * C[1]) / (2 * s)];
    const w = -a + b + c, E = [(-a * A[0] + b * B[0] + c * C[0]) / w, (-a * A[1] + b * B[1] + c * C[1]) / w];
    const S = Math.abs(U.area([A, B, C])), r = S / s, R = U.dist(O, A), ra = S / (s - a);
    return { G: Gc, O, H, I, E, a, b, c, s, S, r, R, ra, N: U.medio(O, H) };
  };
  // ¿P está dentro del triángulo ABC (o en su borde)?
  const dentroDe = (P, A, B, C) => { const s1 = U.area([A, B, P]), s2 = U.area([B, C, P]), s3 = U.area([C, A, P]); return (s1 >= -1e-9 && s2 >= -1e-9 && s3 >= -1e-9) || (s1 <= 1e-9 && s2 <= 1e-9 && s3 <= 1e-9); };
  const anguloEn = (V, P, Q) => U.angulo(V, P, Q);
  const claseDe = (A, B, C) => { const mx = Math.max(anguloEn(A, B, C), anguloEn(B, A, C), anguloEn(C, A, B)); return Math.abs(mx - 90) < 1e-6 ? 'rectángulo' : mx > 90 ? 'obtusángulo' : 'acutángulo'; };
  // Cierre del 26 nov (lector A y auditoría): una figura «no está a escala» de verdad. triAng arma el triángulo con los
  // ángulos a (en A) y b (en B) sobre la base BC = base; lejos(x, d, lo, hi) corre un dato d o más, dentro de [lo, hi], para
  // que lo pedido no se mida en el dibujo con transportador o regla (la prueba lo mide: más de 15 % de diferencia).
  const triAng = (a, b, base = 8) => {
    const ra = a * Math.PI / 180, rb = b * Math.PI / 180, c = base * Math.sin(ra + rb) / Math.sin(ra);
    return { A: [c * Math.cos(rb), c * Math.sin(rb)], B: [0, 0], C: [base, 0] };
  };
  const lejos = (x, d, lo, hi) => (x + d <= hi ? x + d : Math.max(lo, x - d));
  // La primera figura que cabe entre las que dibujan lo pedido lejos de su valor: medida(a) es lo pedido si el ángulo de A
  // del dibujo fuera a; arma(a, b) arma la figura con los ángulos a en A y b en B.
  function figLejos(valor, medida, arma, lo = 20, hi = 130, agudo = false, centro = 60) {
    const intentos = [];
    for (let a = lo; a <= hi; a += 5) if (Math.abs(medida(a) - valor) > 0.15 * Math.abs(valor) + 2) intentos.push(a);
    intentos.sort((x, y) => Math.abs(x - centro) - Math.abs(y - centro));
    for (const a of intentos) for (const k of [8, 0, -8, 16]) {
      const b = (180 - a) / 2 + k; if (b <= 5 || 180 - a - b <= 5 || (agudo && (b >= 85 || 180 - a - b >= 85))) continue;
      const F = arma(a, b); if (PO.escenaCabe(F.datos)) return F;
    }
    return arma(intentos[0], (180 - intentos[0]) / 2);
  }

  // ======================= Idea 1: el baricentro =======================
  // Objeto de la primera pantalla: una cartulina triangular sobre la punta de un lápiz, vista desde arriba (escena
  // «notable», tipo «carton»; dibujo de prueba). La sombra se corre hacia donde se cae.
  // Cambia: dónde está la punta P. · Permanece: la cartulina A(3, 9), B(0, 0), C(12, 0), en cm. · Progresa: hacia dónde
  // se inclina. · Se reserva: las medianas y el 2 : 1 (la predicción). · Debe verse: hay un solo punto donde no se cae.
  const CA = [3, 9], CB = [0, 0], CC = [12, 0], CG = [(CA[0] + CB[0] + CC[0]) / 3, (CA[1] + CB[1] + CC[1]) / 3];
  // Hacia dónde se inclina la cartulina con la punta en P: el nombre de la esquina o del lado más cerca de la dirección
  // que va de P a G (la cartulina cae del lado donde queda su centro de gravedad).
  const LUGARES = [['la esquina A', CA], ['la esquina B', CB], ['la esquina C', CC],
    ['el lado BC', U.medio(CB, CC)], ['el lado CA', U.medio(CC, CA)], ['el lado AB', U.medio(CA, CB)]];
  function inclina(P) {
    const u = [CG[0] - P[0], CG[1] - P[1]];
    if (Math.hypot(...u) < 1e-9) return null;
    let mejor = null, cmax = -2;
    for (const [nom, X] of LUGARES) {
      const v = [X[0] - P[0], X[1] - P[1]], L = Math.hypot(...v);
      if (L < 1e-9) continue;
      const c = (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * L);
      if (c > cmax) { cmax = c; mejor = nom; }
    }
    return mejor;
  }
  // La cartulina del juego, con la punta en P.
  function figCarton(P) {
    const fuera = !dentroDe(P, CA, CB, CC), u = [CG[0] - P[0], CG[1] - P[1]], L = Math.hypot(...u);
    const k = L < 1e-9 ? 0 : Math.min(10, 3 + 1.5 * L) / L;
    // En pantalla, y crece hacia abajo: la sombra se corre (u_x, −u_y).
    const sombra = fuera ? [0, 0] : [u[0] * k, -u[1] * k];
    const pts = { A: CA, B: CB, C: CC, P };
    const segs = [['A', 'B'], ['B', 'C'], ['C', 'A']];
    if (!fuera && L > 1e-9) { pts['~f'] = [P[0] + u[0] / L * 2.2, P[1] + u[1] / L * 2.2]; segs.push(['P', '~f', { flecha: true, color: 'o', grosor: 'fino' }]); }
    // La letra P va lejos de la flecha y del lápiz (que sale hacia abajo y a la derecha, a unos −48°).
    const flecha = L < 1e-9 ? null : U.grados(Math.atan2(u[1], u[0])), lejosDe = (t, x) => { const d = Math.abs(((t - x) % 360 + 540) % 360 - 180); return d; };
    const ladoP = [135, 90, 180, 45, 225, 0].map(t => [t, Math.min(lejosDe(t, -48), flecha === null ? 180 : lejosDe(t, flecha))]).sort((a, b) => b[1] - a[1])[0][0];
    return nt({ pts, segs, letra: { P: 'P' }, ver: { A: { lado: 90 }, B: { lado: 210 }, C: { lado: 330 }, P: { color: 'o', lado: ladoP } }, fijas: ['A', 'B', 'C', 'P'],
      obj: { tipo: 'carton', lamina: ['A', 'B', 'C'], sombra, lapiz: fuera ? undefined : 'P' }, manija: 'P',
      vista: { x: [-1.4, 13.4], y: [-2.6, 10.2] }, alto: 250,
      alt: fuera ? 'La cartulina triangular ABC y la punta P del lápiz, que quedó fuera de la cartulina.'
        : L < 1e-9 ? 'La cartulina triangular ABC sobre la punta P del lápiz: no se inclina.'
          : `La cartulina triangular ABC sobre la punta P del lápiz; la flecha y la sombra muestran que se cae hacia ${inclina(P)}.` });
  }
  // Un triángulo con sus medianas (figura de examen o la cartulina). o: { medianas: ['A', 'B', 'C'] (las que se ven),
  //   desde: { A, B, C } (corte de cada una), G: false | true | corte, rot: { AG, GM, AM, BG, GN, BN, ... } (texto; «?»
  //   en tinta), seis: corte (los seis triangulitos), una: [p, q, r] (un triangulito resaltado), cuadro: [ids] (región),
  //   objeto: 'carton' | 'examen', alt, vista, alto, base: corte (la base media MN), letras: { … } }
  function figMed(A, B, C, o = {}) {
    const M = U.medio(B, C), N = U.medio(A, C), Q = U.medio(A, B), Gc = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
    const rot = o.rot || {}, col = (k, base) => (rot[k] === '?' || (rot[k] === undefined && !o.colores) ? undefined : base);
    const med = o.medianas || ['A'], de = o.desde || {}, veG = o.G !== undefined && o.G !== false;
    const pts = { A, B, C, M, N, Q };
    const letra = Object.assign({ Q: null }, o.letras || {});
    if (!med.includes('B') && o.base === undefined) letra.N = null;
    if (veG) pts.G = Gc;
    const segs = [['A', 'B'], ['B', 'C'], ['B', 'M', { marcas: 1 }], ['M', 'C', { marcas: 1 }]];
    const ver = { A: { lado: 90 }, B: { lado: 225 }, C: { lado: 315 }, M: { lado: 270 } };
    // Los puntos medios N y Q (y sus rayitas) solo se ven con su mediana (o con la base media MN).
    const dN = med.includes('B') ? (de.B || 0) : o.base, dQ = de.C || 0;
    segs.push(['C', 'A']);
    if (med.includes('B') || o.base !== undefined) { segs.push(['A', 'N', { marcas: 2, desde: dN }], ['N', 'C', { marcas: 2, desde: dN }]); ver.N = { lado: 30, desde: dN }; }
    if (med.includes('C')) { segs.push(['A', 'Q', { marcas: 3, desde: dQ }], ['Q', 'B', { marcas: 3, desde: dQ }]); ver.Q = { desde: dQ }; } else delete pts.Q;
    if (!(med.includes('B') || o.base !== undefined)) delete pts.N;
    // Con G desde un corte, la mediana va entera (en tinta) hasta ese corte, y partida en sus dos colores desde ahí: los
    // colores no adelantan dónde queda G.
    const gG = typeof o.G === 'number' ? o.G : 0;
    const tramo = (v, Mv, kL, kC) => {
      const d0 = de[v] || 0, d1 = Math.max(d0, gG);
      if (veG && gG > d0) segs.push([v, Mv, { grosor: 'variable', desde: d0, hasta: gG - 1 }]);
      if (veG) segs.push([v, 'G', { color: col(kL, 'o'), grosor: 'variable', desde: d1 }], ['G', Mv, { color: col(kC, 'i'), grosor: 'variable', desde: d1 }]);
      else segs.push([v, Mv, { grosor: 'variable', desde: d0 }]);
    };
    if (med.includes('A')) tramo('A', 'M', 'AG', 'GM');
    if (med.includes('B')) tramo('B', 'N', 'BG', 'GN');
    if (med.includes('C')) tramo('C', 'Q', 'CG', 'GQ');
    if (o.base !== undefined) segs.push(['M', 'N', { discontinua: true, desde: o.base }]);
    if (veG) ver.G = { lado: o.ladoG === undefined ? 0 : o.ladoG, desde: typeof o.G === 'number' ? o.G : 0 };
    const regiones = [];
    if (o.seis !== undefined) [['A', 'Q'], ['Q', 'B'], ['B', 'M'], ['M', 'C'], ['C', 'N'], ['N', 'A']].forEach(([p, q], i) => regiones.push({ puntos: [p, q, 'G'], opacidad: i % 2 ? 0.05 : 0.14, desde: o.seis }));
    if (o.una) regiones.push({ puntos: o.una, opacidad: 0.18 });
    if (o.cuadro) regiones.push({ puntos: o.cuadro, opacidad: 0.18 });
    const lados = [];
    const L = (p, q, k, base, ref) => { if (rot[k] !== undefined) lados.push(Object.assign({ de: p, a: q, texto: rot[k], color: col(k, base), ref, dist: 5, desde: o.rotDesde && o.rotDesde[k] }, (o.rotPos || {})[k] || {})); };
    L('A', 'G', 'AG', 'o', 'C'); L('G', 'M', 'GM', 'i', 'C'); L('B', 'G', 'BG', 'o', 'A'); L('G', 'N', 'GN', 'i', 'A');
    if (rot.AM !== undefined) lados.push({ de: 'A', a: 'M', texto: rot.AM, ref: o.refAM || 'C', dist: o.distAM || 6, en: o.enAM || 0.45 });
    if (rot.BN !== undefined) lados.push({ de: 'B', a: 'N', texto: rot.BN, ref: 'C', dist: 6, en: 0.45 });
    for (const [p, q, k] of [['A', 'B', 'AB'], ['B', 'C', 'BC'], ['A', 'C', 'AC'], ['M', 'N', 'MN']]) if (rot[k] !== undefined) lados.push({ de: p, a: q, texto: rot[k], dist: 6, desde: k === 'MN' ? o.base : undefined });
    const obj = o.objeto === 'carton' ? { tipo: 'carton', lamina: ['A', 'B', 'C'], sombra: [0, 0] } : { tipo: 'examen' };
    return nt({ pts, segs, letra, ver, lados, regiones: regiones.length ? regiones : undefined, obj, alto: o.alto || 240, vista: o.vista,
      fijas: ['A', 'B', 'C', 'M', 'N'], alt: o.alt || 'Un triángulo ABC con su mediana AM.' });
  }

  // Datos de la idea 1 (una línea cada uno; herramientas, no el paso hecho).
  const D_MED = 'Una mediana une un vértice con el punto medio del lado opuesto.';
  const D_BAR = ['El baricentro G parte cada mediana en 2 : 1 desde el vértice: ', junto([dO('AG'), ' = 2 · ', dI('GM')]), '.'];
  const D_SEIS = 'Las tres medianas parten el triángulo en seis triángulos de igual área.';
  const D_HIP = 'En un triángulo rectángulo, la mediana que va a la hipotenusa mide la mitad de ella.';
  // (ecuaciones-ancho, 26 nov: «cateto² + cateto² = ⏎ hipotenusa²» se partía; dicho en palabras, como en Circunferencia.)
  const D_PIT = 'Pitágoras: en un triángulo rectángulo, la suma de los cuadrados de los catetos es el cuadrado de la hipotenusa.';
  const D_ISO = 'En un triángulo isósceles, la mediana que va a la base es también su altura.';

  // Los 15 ejemplos (cuentas rehechas aparte en el scratchpad: e9-geometria/cuentas.py, idea 1): 10 cm; 8 cm; 7 cm;
  // 12 cm²; 15 cm; 15 cm; 18 cm; 30 cm²; 6 cm; 18 cm; 5 cm; 18 cm²; 5 cm; 8 cm; 10 cm.
  const T1 = { A: [3.6, 6.2], B: [0, 0], C: [9, 0] };
  const fig1 = o => figO(figMed(T1.A, T1.B, T1.C, o));
  const EJ1 = [];
  EJ1.push({ nivel: 1, titulo: 'Del vértice al baricentro',
    figura: fig1({ G: true, rot: { AG: '?' } }),
    enunciado: 'En el triángulo ABC, AM es una mediana y mide 15 cm. G es el baricentro. ¿Cuánto mide AG?',
    datos: [D_BAR],
    solucion: [{ texto: 'AG es el doble de GM, así que la mediana queda en tres partes iguales y dos son de AG.', ecuacion: junto(['15 ÷ 3 = 5', FL, 'AG = 2 · 5 = ', dF('10 cm')]) }],
    respuesta: [junto('AG = '), dF('10 cm')] });
  EJ1.push({ nivel: 1, titulo: 'El tramo corto dado',
    figura: fig1({ G: true, rot: { AG: '?', GM: '4 cm' } }),
    enunciado: 'En el triángulo ABC, G es el baricentro y está sobre la mediana AM. GM = 4 cm. ¿Cuánto mide AG?',
    datos: [D_BAR],
    solucion: [{ texto: 'El tramo del vértice es el doble del tramo del lado:', ecuacion: junto([dO('AG'), ' = 2 · ', dI('4'), ' = ', dF('8 cm')]) }],
    respuesta: [junto('AG = '), dF('8 cm')] });
  EJ1.push({ nivel: 1, titulo: 'Del baricentro al lado',
    enunciado: 'En el triángulo ABC, G es el baricentro y AM es una mediana. AG = 14 cm. ¿Cuánto mide GM?',
    datos: [D_BAR],
    solucion: [{ texto: 'GM, el tramo del lado, es la mitad de AG:', ecuacion: junto([dI('GM'), ' = ', dO('14'), ' ÷ 2 = ', dF('7 cm')]) }],
    respuesta: [junto('GM = '), dF('7 cm')] });
  EJ1.push({ nivel: 1, titulo: 'Seis pedazos de cartulina',
    figura: fig1({ medianas: ['A', 'B', 'C'], G: true, seis: 0, alt: 'Las tres medianas parten el triángulo ABC en seis triángulos con un vértice en G.' }),
    enunciado: 'Una cartulina triangular tiene 72 cm² de área. Se trazan sus tres medianas y se corta por ellas. ¿Cuánto mide el área de cada pedazo?',
    datos: [D_SEIS],
    solucion: [{ texto: 'Las medianas dejan seis pedazos de igual área:', ecuacion: junto(['72 ÷ 6 = ', dF('12 cm²')]) }],
    respuesta: [dF('12 cm²')] });
  EJ1.push({ nivel: 1, titulo: 'Otra mediana',
    figura: fig1({ medianas: ['B'], G: true, rot: { BG: '10 cm', BN: 'BN = ?' } }),
    enunciado: 'En el triángulo ABC, N es el punto medio de AC y G es el baricentro. BG = 10 cm. ¿Cuánto mide la mediana BN?',
    datos: [D_BAR, 'Vale igual en las tres medianas: BG = 2 · GN.'],
    solucion: [{ texto: 'BG ocupa dos partes iguales de la mediana, y GN ocupa una:', ecuacion: junto(['10 ÷ 2 = 5', FL, 'BN = 10 + 5 = ', dF('15 cm')]) }],
    respuesta: [junto('BN = '), dF('15 cm')] });

  EJ1.push({ nivel: 2, titulo: 'La mediana entera',
    figura: fig1({ G: true, rot: { GM: '5 cm', AM: 'AM = ?' } }),
    enunciado: 'En el triángulo ABC, G es el baricentro y está sobre la mediana AM. GM = 5 cm. ¿Cuánto mide AM?',
    datos: [D_BAR],
    solucion: [{ texto: 'Primero se halla el tramo del vértice, que es el doble de GM:', ecuacion: junto([dO('AG'), ' = 2 · ', dI('5'), ' = 10']) },
      { texto: 'La mediana es la suma de los dos tramos:', ecuacion: junto(['AM = 10 + 5 = ', dF('15 cm')]) }],
    respuesta: [junto('AM = '), dF('15 cm')] });
  EJ1.push({ nivel: 2, titulo: 'La diferencia de los tramos',
    enunciado: 'En el triángulo ABC, G es el baricentro y AM es una mediana. AG mide 6 cm más que GM. ¿Cuánto mide AM?',
    datos: [D_BAR],
    solucion: [{ texto: 'Si GM = k, entonces AG = 2k, y la diferencia es k:', ecuacion: junto(['2k − k = 6', FL, 'k = 6']) },
      { texto: 'La mediana tiene tres partes de 6 cm:', ecuacion: junto(['AM = 3 · 6 = ', dF('18 cm')]) }],
    respuesta: [junto('AM = '), dF('18 cm')] });
  EJ1.push({ nivel: 2, titulo: 'Dos pedazos juntos',
    figura: fig1({ medianas: ['A', 'B', 'C'], G: true, una: ['A', 'B', 'G'], alt: 'Las tres medianas del triángulo ABC; el triángulo AGB está sombreado.' }),
    enunciado: 'El triángulo ABC tiene 90 cm² de área y G es su baricentro. ¿Cuál es el área del triángulo AGB?',
    datos: [D_SEIS],
    solucion: [{ texto: 'Cada uno de los seis triángulos mide 90 ÷ 6 = 15 cm².' },
      { texto: 'La mediana que sale de C parte AGB en dos de esos triángulos, así que su área es el doble:', ecuacion: junto(['2 · 15 = ', dF('30 cm²')]) }],
    respuesta: [dF('30 cm²')] });
  EJ1.push({ nivel: 2, titulo: 'La escuadra de cartón',
    figura: figO(figMed([0, 6], [0, 0], [8, 0], { medianas: ['B'], G: true, objeto: 'carton', rot: { BG: '?', AC: 'AC = 18 cm' }, letras: {},
      alt: 'Una escuadra de cartón: triángulo rectángulo en B, con la mediana BN a la hipotenusa AC y su baricentro G.' })),
    enunciado: 'Una escuadra de cartón tiene forma de triángulo rectángulo en B, con hipotenusa AC = 18 cm. G es su baricentro. ¿A qué distancia de B está G?',
    datos: [D_HIP, D_BAR],
    solucion: [{ texto: 'La mediana BN va a la hipotenusa, así que mide la mitad de AC.', ecuacion: junto(['BN = 18 ÷ 2 = 9']) },
      { texto: 'G está sobre BN, a dos tercios de su largo contando desde B:', ecuacion: junto([dO('BG'), ' = 2 · (9 ÷ 3) = ', dF('6 cm')]) }],
    respuesta: [junto('BG = '), dF('6 cm')] });
  EJ1.push({ nivel: 2, titulo: 'Los tramos con x',
    enunciado: 'En el triángulo ABC, G es el baricentro y AM es una mediana. AG = x + 6 y GM = x, en centímetros. ¿Cuánto mide AM?',
    datos: [D_BAR],
    solucion: [{ texto: 'AG es el doble de GM:', ecuacion: junto(['x + 6 = 2x', FL, 'x = 6']) },
      { texto: 'Con x = 6 quedan AG = 12 y GM = 6, y la mediana es su suma:', ecuacion: junto(['AM = 12 + 6 = ', dF('18 cm')]) }],
    respuesta: [junto('AM = '), dF('18 cm')] });

  // Nivel 3 (examen): cinco alternativas; la correcta en B, D, A, E y C; cada incorrecta se explica por su valor (la figura
  // tiene puntos A, B, C: nunca por su letra).
  EJ1.push({ nivel: 3, titulo: 'El baricentro de la escuadra',
    enunciado: 'Un triángulo rectángulo en B tiene catetos AB = 9 cm y BC = 12 cm. G es su baricentro. ¿Cuánto mide BG?',
    alternativas: ['7,5 cm', '5 cm', '2,5 cm', '10 cm', '6 cm'],
    datos: [D_PIT, D_HIP, D_BAR],
    solucion: [{ texto: 'Primero se halla la hipotenusa: AC² = 81 + 144 = 225, así que AC = 15 cm.' },
      { texto: 'La mediana BN mide la mitad de AC, 7,5 cm, y BG toma dos tercios:', ecuacion: junto(['BG = 2 · (7,5 ÷ 3) = ', dF('5 cm')]) },
      { texto: 'Las otras alternativas salen de errores: 7,5 cm es la mediana entera, 2,5 cm es solo GN, 10 cm son dos tercios de AC y 6 cm es la mitad de BC.' }],
    respuesta: [junto('BG = '), dF('5 cm')] });
  EJ1.push({ nivel: 3, titulo: 'Un cuadrilátero de la cartulina',
    figura: fig1({ medianas: ['A', 'B', 'C'], G: true, cuadro: ['A', 'Q', 'G', 'N'], alt: 'Las tres medianas del triángulo ABC; el cuadrilátero entre A y G, limitado por dos medianas, está sombreado.' }),
    enunciado: 'Una cartulina triangular ABC tiene 54 cm² de área. Las medianas que salen de B y de C se cortan en G. ¿Cuál es el área del cuadrilátero sombreado, que tiene vértices en A y en G?',
    alternativas: ['9 cm²', '27 cm²', '13,5 cm²', '18 cm²', '36 cm²'],
    datos: [D_SEIS, D_MED],
    solucion: [{ texto: 'La tercera mediana, desde A, también pasa por G y parte el cuadrilátero en dos de los seis triángulos.' },
      { texto: 'Cada triángulo mide 54 ÷ 6 = 9 cm²:', ecuacion: junto(['2 · 9 = ', dF('18 cm²')]) },
      { texto: 'Las otras alternativas: 9 cm² es un solo triángulo, 27 cm² es la mitad de la cartulina, 13,5 cm² es un cuarto y 36 cm² son cuatro de los seis.' }],
    respuesta: [dF('18 cm²')] });
  EJ1.push({ nivel: 3, titulo: 'Una mediana perpendicular',
    enunciado: 'En el triángulo ABC, la mediana AM es perpendicular a BC. AM = 12 cm y BC = 6 cm. G es el baricentro. ¿Cuánto mide BG?',
    alternativas: ['5 cm', '8,54 cm', '3 cm', '4 cm', '6 cm'],
    datos: [D_BAR, D_PIT],
    solucion: [{ texto: 'GM = 12 ÷ 3 = 4 cm y BM = 6 ÷ 2 = 3 cm. Como AM es perpendicular a BC, el triángulo BMG es rectángulo en M.' },
      { texto: 'Con Pitágoras en el triángulo BMG:', ecuacion: junto(['BG² = 3² + 4² = 25', FL, 'BG = ', dF('5 cm')]) },
      { texto: 'Las otras alternativas: 8,54 cm usa AG = 8 en lugar de GM, 3 cm es BM, 4 cm es GM y 6 cm es BC.' }],
    respuesta: [junto('BG = '), dF('5 cm')] });
  EJ1.push({ nivel: 3, titulo: 'El banderín isósceles',
    figura: figO(figMed([5, 6], [0, 0], [10, 0], { G: true, rot: { AG: '?', AB: '13 cm', AC: '13 cm' }, vista: { x: [-1.6, 11.6], y: [-1.6, 7.4] }, alto: 220, alt: 'Un banderín isósceles ABC, con AB = AC = 13 cm, BC = 10 cm y la mediana AM.' })),
    enunciado: 'Un banderín tiene forma de triángulo isósceles con AB = AC = 13 cm y BC = 10 cm. G es su baricentro. ¿A qué distancia de A está G?',
    alternativas: ['12 cm', '4 cm', '6 cm', '6,5 cm', '8 cm'],
    datos: [D_ISO, D_PIT, D_BAR],
    solucion: [{ texto: 'En el isósceles, la mediana AM es también altura, y BM = 5 cm: AM² = 169 − 25 = 144, así que AM = 12 cm.' },
      { texto: 'G está sobre AM, a dos tercios de su largo contando desde A:', ecuacion: junto(['AG = 2 · (12 ÷ 3) = ', dF('8 cm')]) },
      { texto: 'Las otras alternativas: 12 cm es la mediana entera, 4 cm es GM, 6 cm es la mitad de la mediana y 6,5 cm es la mitad de AB.' }],
    respuesta: [junto('AG = '), dF('8 cm')] });
  EJ1.push({ nivel: 3, titulo: 'Dos medianas a escuadra',
    enunciado: 'En el triángulo ABC, las medianas AM y BN se cortan en G formando un ángulo recto. AM = 9 cm y BN = 12 cm. ¿Cuánto mide AB?',
    alternativas: ['15 cm', '5 cm', '10 cm', '21 cm', '12 cm'],
    datos: [D_BAR, D_PIT],
    solucion: [{ texto: 'AG = 2 · (9 ÷ 3) = 6 cm y BG = 2 · (12 ÷ 3) = 8 cm. Como las medianas se cortan en ángulo recto, el triángulo AGB es rectángulo en G.' },
      { texto: 'Con Pitágoras en el triángulo AGB:', ecuacion: junto(['AB² = 6² + 8² = 100', FL, 'AB = ', dF('10 cm')]) },
      { texto: 'Las otras alternativas: 15 cm usa las medianas enteras, 5 cm usa los tramos cortos GM y GN, 21 cm suma las medianas y 12 cm copia BN.' }],
    respuesta: [junto('AB = '), dF('10 cm')] });

  // Juego, predicción y mira.
  const PRED1 = 'En otra cartulina se traza la mediana AM, que mide 12 cm. El punto de equilibrio está sobre ella. ¿A qué distancia de A queda?';
  // La cartulina de la predicción: B(0, 0), C(10, 0) y A a 12 cm de M(5, 0) (AM = 12 a escala).
  const PA = [6 + 12 * Math.cos(U.rad(108)), 12 * Math.sin(U.rad(108))], PB = [0, 0], PC = [12, 0];
  const VPRED = { x: [-2.6, 13.6], y: [-1.8, 12.6] };
  // Así se resuelve: tres tipos (el tramo del vértice desde la mediana, la escuadra con su hipotenusa, un pedazo de área).
  function resuelveBar(s) {
    const r = azar(s + 900), t = s % 3;
    if (t === 0) {
      const k = r.ent(3, 9), AM = 3 * k;
      return {
        enunciado: `Una cartulina triangular ABC tiene la mediana AM de ${AM} cm. Se quiere sostener en la punta de un lápiz, sobre esa mediana. ¿A qué distancia de A va la punta?`,
        datos: [D_BAR],
        dibujo: figO(figMed(T1.A, T1.B, T1.C, { G: true, objeto: 'carton', rot: { AG: '?' } })),
        // (Cierre del 26 nov, lector A: el rótulo «15 cm» solo cabía junto a G y se leía como GM; AM va en el enunciado.)
        pasos: [
          { tipo: 'pide', texto: 'Piden AG: la cartulina se sostiene en su baricentro G, y G está sobre la mediana AM.' },
          { tipo: 'datos', texto: `La mediana entera mide AM = ${AM} cm.` },
          { tipo: 'regla', texto: 'G parte la mediana en 2 : 1 desde el vértice: la mediana queda en tres partes iguales, y dos son de AG.', ecuacion: junto([dO('AG'), ' = 2 · ', dI('GM')]) },
          { tipo: 'cuentas', texto: 'Cada parte mide la tercera parte de la mediana, y AG toma dos de ellas.', ecuacion: junto([`${AM} ÷ 3 = ${k}`, FL, `AG = 2 · ${k} = `, dF(`${2 * k} cm`)]) },
          { tipo: 'sentido', texto: `Queda GM = ${k} cm, y ${2 * k} + ${k} = ${AM} es la mediana completa, con el tramo largo junto a A.` },
        ],
        respuesta: [junto('AG = '), dF(`${2 * k} cm`)],
      };
    }
    if (t === 1) {
      const h = 6 * r.ent(2, 7);
      return {
        enunciado: `Una escuadra de cartón tiene forma de triángulo rectángulo en B y su hipotenusa AC mide ${h} cm. ¿A qué distancia de B está su baricentro G?`,
        datos: [D_HIP, D_BAR],
        dibujo: figO(figMed([0, 6], [0, 0], [8, 0], { medianas: ['B'], G: true, objeto: 'carton', rot: { BG: '?', AC: `AC = ${h} cm` }, alt: 'Una escuadra de cartón rectángula en B, con la mediana BN a la hipotenusa y su baricentro G.' })),
        pasos: [
          { tipo: 'pide', texto: 'Piden BG, la distancia del vértice del ángulo recto al baricentro, que se mide sobre la mediana BN.' },
          { tipo: 'datos', texto: `La hipotenusa mide AC = ${h} cm, y N es su punto medio.` },
          { tipo: 'regla', texto: 'La mediana a la hipotenusa mide la mitad de ella, y G toma dos tercios de esa mediana desde B.', ecuacion: junto([dO('BG'), ' = 2 · ', dI('GN')]) },
          // (ecuaciones-ancho, 26 nov: la cadena entera se partía en «= ⏎ 12 cm»; el primer paso pasa al texto.)
          { tipo: 'cuentas', texto: `Primero se calcula la mediana: BN = ${h} ÷ 2 = ${h / 2} cm. Después se toman sus dos tercios.`, ecuacion: junto([`BG = 2 · (${h / 2} ÷ 3) = `, dF(`${h / 3} cm`)]) },
          { tipo: 'sentido', texto: `BG = ${h / 3} cm es la tercera parte de la hipotenusa, y es menor que BN = ${h / 2} cm.` },
        ],
        respuesta: [junto('BG = '), dF(`${h / 3} cm`)],
      };
    }
    const S = 6 * r.ent(4, 15), dos = r() < 0.5;
    return {
      enunciado: `Un triángulo ABC tiene ${S} cm² de área y G es su baricentro. ¿Cuál es el área del triángulo ${dos ? 'BGC' : 'BGM'}, donde M es el punto medio de BC?`,
      datos: [D_SEIS],
      dibujo: fig1({ medianas: ['A', 'B', 'C'], G: true, una: dos ? ['B', 'C', 'G'] : ['B', 'M', 'G'], alt: `Las tres medianas del triángulo ABC; el triángulo ${dos ? 'BGC' : 'BGM'} está sombreado.` }),
      pasos: [
        { tipo: 'pide', texto: `Piden el área del triángulo ${dos ? 'BGC' : 'BGM'}, que tiene un vértice en G.` },
        { tipo: 'datos', texto: `El triángulo entero tiene ${S} cm², y sus medianas se cortan en G.` },
        { tipo: 'regla', texto: 'Las tres medianas parten el triángulo en seis triángulos de igual área.', ecuacion: junto(['cada uno = S ÷ 6']) },
        { tipo: 'cuentas', texto: dos ? 'BGC tiene dos de los seis triángulos, porque la mediana GM lo parte en dos.' : 'BGM es uno de los seis triángulos, así que su área es la sexta parte.', ecuacion: junto(dos ? [`2 · (${S} ÷ 6) = `, dF(`${S / 3} cm²`)] : [`${S} ÷ 6 = `, dF(`${S / 6} cm²`)]) },
        { tipo: 'sentido', texto: dos ? `${S / 3} cm² es la tercera parte de ${S} cm², porque AGB, BGC y CGA tienen igual área.` : `Seis triángulos de ${S / 6} cm² dan ${S} cm², el área de todo el triángulo.` },
      ],
      respuesta: [dF(dos ? `${S / 3} cm²` : `${S / 6} cm²`)],
    };
  }
  // «Ahora tú» de la idea 1. Tipos: AG desde AM; AM desde GM; GN desde BG; un área; la escuadra; los tramos con x.
  function casoAG(r) {
    const k = r.ent(2, 15), AM = 3 * k;
    return { pregunta: `En el triángulo ABC, la mediana AM mide ${AM} cm y G es el baricentro. ¿Cuánto mide AG?`,
      datos: [D_BAR],
      opciones: ops(2 * k, [
        { id: 'mitad', valor: AM / 2, error: 'GE-PN2', siFuera: 'Es cierto que G está sobre AM, pero no en su mitad: G parte la mediana en 2 : 1 desde A.' },
        { id: 'corto', valor: k, error: 'GE-PN3', siFuera: `Partir AM en tres está bien, pero ${k} cm es GM, una sola parte; AG toma dos.` },
        { id: 'tres', valor: 3 * AM / 4, error: 'GE-PN4', siFuera: 'Partir la mediana está bien, pero G la parte en 2 : 1, no en 3 : 1.' },
      ], cm),
      solucion: { texto: 'AM tiene tres partes iguales, y AG toma dos de ellas.', ecuacion: junto([`AG = 2 · (${AM} ÷ 3) = `, dF(cm(2 * k))]) } };
  }
  function casoAM(r) {
    const k = r.ent(2, 14);
    return { pregunta: `En el triángulo ABC, G es el baricentro y está sobre la mediana AM. GM = ${k} cm. ¿Cuánto mide AM?`,
      datos: [D_BAR],
      opciones: ops(3 * k, [
        { id: 'ag', valor: 2 * k, error: 'GE-PN5', siFuera: `AG = ${2 * k} cm está bien; falta sumarle GM para la mediana entera.` },
        { id: 'invertido', valor: 1.5 * k, error: 'GE-PN3', siFuera: 'Sumar los tramos está bien, pero AG es el doble de GM, no su mitad.' },
        { id: 'cuatro', valor: 4 * k, error: 'GE-PN4', siFuera: 'Sumar los tramos está bien, pero AG = 2 · GM, no 3 · GM.' },
      ], cm),
      solucion: { texto: 'AG es el doble de GM, y la mediana es la suma de los dos tramos.', ecuacion: junto([`AM = 2 · ${k} + ${k} = `, dF(cm(3 * k))]) } };
  }
  function casoGN(r) {
    const k = r.ent(2, 15), BG = 2 * k;
    return { pregunta: `En el triángulo ABC, N es el punto medio de AC y G es el baricentro. BG = ${BG} cm. ¿Cuánto mide GN?`,
      datos: [D_BAR, 'Vale igual en las tres medianas: BG = 2 · GN.'],
      opciones: ops(k, [
        { id: 'igual', valor: BG, error: 'GE-PN2', siFuera: 'Comparar BG con GN está bien, pero no miden igual: BG es el doble.' },
        { id: 'doble', valor: 2 * BG, error: 'GE-PN3', siFuera: 'Usar el 2 : 1 está bien, pero el doble es BG, el tramo del vértice.' },
        { id: 'entera', valor: 3 * k, error: 'GE-PN5', siFuera: `${3 * k} cm es la mediana BN entera; GN es solo el tramo corto.` },
      ], cm),
      solucion: { texto: 'GN es el tramo corto, la mitad de BG.', ecuacion: junto([`GN = ${BG} ÷ 2 = `, dF(cm(k))]) } };
  }
  function casoArea(r) {
    const S = 6 * r.ent(3, 20), cual = r.de(['uno', 'dos']);
    return { pregunta: cual === 'uno' ? `Un triángulo tiene ${S} cm² de área. Sus tres medianas lo parten en seis triángulos. ¿Cuál es el área de uno de ellos?`
      : `El triángulo ABC tiene ${S} cm² de área y G es su baricentro. ¿Cuál es el área del triángulo AGC?`,
      datos: [D_SEIS],
      opciones: ops(cual === 'uno' ? S / 6 : S / 3, [
        { id: 'tercio', valor: cual === 'uno' ? S / 3 : S / 6, error: 'GE-PN6', siFuera: cual === 'uno' ? 'Repartir el área está bien, pero un tercio del área son dos pedazos juntos, no uno.' : 'Usar los seis pedazos está bien, pero AGC tiene dos de ellos.' },
        { id: 'mitad', valor: S / 2, error: 'GE-PN6', siFuera: 'Una sola mediana sí parte el área por la mitad, pero aquí hay tres medianas.' },
        { id: 'cuarto', valor: S / 4, error: 'GE-PN6', siFuera: 'Repartir el área está bien, pero las medianas dejan seis pedazos, no cuatro.' },
      ], cm2),
      solucion: { texto: cual === 'uno' ? 'Los seis triángulos tienen igual área, así que cada uno es la sexta parte.' : 'AGC está formado por dos de los seis triángulos.', ecuacion: junto(cual === 'uno' ? [`${S} ÷ 6 = `, dF(cm2(S / 6))] : [`2 · (${S} ÷ 6) = `, dF(cm2(S / 3))]) } };
  }
  function casoHip(r) {
    const h = 6 * r.ent(2, 9);
    return { pregunta: `Un triángulo ABC es rectángulo en B y su hipotenusa AC mide ${h} cm. G es el baricentro. ¿Cuánto mide BG?`,
      datos: [D_HIP, D_BAR],
      opciones: ops(h / 3, [
        { id: 'mediana', valor: h / 2, error: 'GE-PN5', siFuera: `La mediana BN = ${h / 2} cm está bien, pero BG es solo dos tercios de ella.` },
        { id: 'dosTercios', valor: 2 * h / 3, error: 'GE-PN7', siFuera: 'Tomar dos tercios está bien, pero de la mediana BN, no de la hipotenusa.' },
        { id: 'corto', valor: h / 6, error: 'GE-PN3', siFuera: `Partir BN en tres está bien; ${fm(h / 6)} cm es GN, el tramo corto.` },
      ], cm),
      solucion: { texto: 'BN es la mitad de la hipotenusa, y BG toma dos tercios de BN.', ecuacion: junto([`BN = ${h / 2}`, FL, `BG = 2 · (${h / 2} ÷ 3) = `, dF(cm(h / 3))]) } };
  }
  function casoX(r) {
    const p = r.ent(2, 9), q = r.ent(1, 4);
    if (r() < 0.5) return { pregunta: `En el triángulo ABC, G es el baricentro y AM una mediana. AG = x + ${p} y GM = x, en centímetros. ¿Cuánto mide AM?`,
      datos: [D_BAR],
      opciones: ops(3 * p, [
        { id: 'x', valor: p, error: 'GE-PN8', siFuera: `Despejar está bien: x = ${p}. Falta hallar la mediana, AM = AG + GM.` },
        { id: 'ag', valor: 2 * p, error: 'GE-PN5', siFuera: `AG = ${2 * p} cm está bien, pero falta sumarle GM.` },
        { id: 'invertido', valor: 1.5 * p, error: 'GE-PN3', siFuera: 'Plantear la ecuación está bien, pero AG = 2 · GM, no GM = 2 · AG.' },
      ], cm),
      solucion: { texto: `Como AG = 2 · GM, se plantea x + ${p} = 2x.`, ecuacion: junto([`x = ${p}`, FL, `AM = ${2 * p} + ${p} = `, dF(cm(3 * p))]) } };
    // AG = 3x − p y GM = x + q: 3x − p = 2x + 2q, así que x = p + 2q y GM = p + 3q.
    const x = p + 2 * q, gm = x + q;
    return { pregunta: `En el triángulo ABC, G es el baricentro y AM una mediana. AG = 3x − ${p} y GM = x + ${q}, en centímetros. ¿Cuánto mide AG?`,
      datos: [D_BAR],
      opciones: ops(2 * gm, [
        { id: 'x', valor: x, error: 'GE-PN8', siFuera: `Despejar está bien: x = ${x}. Falta reemplazar x en AG.` },
        { id: 'gm', valor: gm, error: 'GE-PN3', siFuera: `${gm} cm es GM, y AG es el doble de GM.` },
        { id: 'am', valor: 3 * gm, error: 'GE-PN5', siFuera: `${3 * gm} cm es la mediana entera, pero piden solo AG.` },
      ], cm),
      solucion: { texto: 'Como AG = 2 · GM, se plantea la ecuación:', ecuacion: junto([`3x − ${p} = 2x + ${2 * q}`, FL, `x = ${x}`, FL, 'AG = ', dF(cm(2 * gm))]) } };
  }
  const ideaBaricentro = {
    id: 'baricentro',
    titulo: 'El baricentro y las medianas',
    pregunta: '¿Dónde se sostiene una cartulina triangular sin caerse?',
    temas: ['Baricentro, incentro, circuncentro, ortocentro y excentro', 'Propiedades de los puntos notables'],
    pieza: GO,
    aprendizaje: 'Las medianas se cortan en el baricentro G, punto de equilibrio de una lámina pareja; G parte cada mediana en 2 : 1 desde el vértice.',
    actividad: 'Buscar el punto donde una cartulina se sostiene sobre la punta de un lápiz.',
    // Lee: mediana, lámina pareja y qué mirar. No dice dónde queda el punto de equilibrio ni cómo parte la mediana.
    lee: {
      tarjetas: [
        { titulo: 'Una cartulina pareja', texto: 'Esta cartulina tiene el mismo grosor en toda su superficie: no lleva huecos ni pesos pegados. Si la apoyas en la punta de un lápiz, casi siempre se cae hacia algún lado.',
          pieza: GO, dibujo: figO(figCarton([8, 2])) },
        { titulo: 'Qué es una mediana', texto: 'Una mediana une un vértice con el punto medio del lado de enfrente. Aquí, M es el punto medio de BC, y AM es la mediana que sale de A. Donde se cruzan tres líneas del mismo tipo hay un punto notable.',
          pieza: GO, dibujo: figO(figMed(T1.A, T1.B, T1.C, { alt: 'Un triángulo ABC con su mediana AM; las rayitas marcan que BM y MC miden igual.' })) },
        { titulo: 'Qué mirar al jugar', texto: 'Mueve la punta del lápiz, P, por debajo de la cartulina. La flecha y la sombra muestran hacia dónde se cae, y tu meta es encontrar el punto donde ya no se cae.' },
      ],
    },
    ejemplos: EJ1,
    juega: {
      pieza: GO,
      consigna: 'Una cartulina triangular de 12 cm de base descansa sobre la punta de un lápiz.',
      mision: { texto: 'Mueve la punta del lápiz hasta que la cartulina no se caiga.', logrado: v => v.px === CG[0] && v.py === CG[1],
        bien: 'Listo: en ese punto la cartulina se sostiene sola, sin inclinarse.' },
      voz: 'Sigue la flecha: te dice hacia dónde se cae la cartulina.',
      leyenda: [
        { s: 'A, B, C', t: 'las esquinas de la cartulina' },
        { s: dO('P'), t: 'la punta del lápiz, debajo de la cartulina' },
        { s: 'flecha', t: 'hacia dónde se cae la cartulina' },
      ],
      controles: [
        { id: 'px', etiqueta: 'P a lo ancho', min: 0, max: 12, paso: 1, inicio: 4, unidad: 'cm', decimales: 0, color: 'c-o' },
        { id: 'py', etiqueta: 'P a lo alto', min: 0, max: 9, paso: 1, inicio: 5, unidad: 'cm', decimales: 0, color: 'c-o' },
      ],
      dibujo: v => ({ datos: figCarton([v.px, v.py]), estado: {} }),
      arrastres: [{ id: 'punta', etiqueta: 'punta del lápiz', color: 'c-o',
        donde: v => enPantalla(figCarton([v.px, v.py]), [v.px, v.py]),
        mover: (p, v) => { const q = alPlano(figCarton([v.px, v.py]), p); return { px: q[0], py: q[1] }; } }],
      // La relación: hacia dónde se cae y por qué (de ese lado pesa más).
      lectura: v => {
        const P = [v.px, v.py];
        if (!dentroDe(P, CA, CB, CC)) return ['La punta quedó fuera de la cartulina: no la sostiene.'];
        const x = inclina(P);
        return [x ? `Se inclina hacia ${x}: de ese lado pesa más.` : 'No se cae: el peso queda parejo alrededor de P.'];
      },
      minimo: 3,
    },
    predice: {
      pregunta: PRED1,
      datos: ['AM = 12 cm.', 'M es el punto medio de BC.'],
      voz: 'El punto que hallaste también está en las medianas. ¿Dónde, en esta?',
      opciones: [
        { id: 'c', texto: 'A 8 cm de A', correcta: true },
        { id: 'mitad', texto: 'A 6 cm de A', error: 'GE-PN2', siFuera: 'Es cierto que el punto está sobre AM, pero no en su mitad: queda más cerca de M que de A.' },
        { id: 'invertido', texto: 'A 4 cm de A', error: 'GE-PN3', siFuera: 'Partir AM en tres partes es buena idea, pero el tramo largo es el que llega a A, no el que llega a M.' },
        { id: 'tres', texto: 'A 9 cm de A', error: 'GE-PN4', siFuera: 'Es cierto que queda más cerca de M, pero el tramo que llega a A es el doble del otro, no el triple.' },
      ],
      dibujo: figO(figMed(PA, PB, PC, { objeto: 'carton', rot: { AM: '12 cm' }, refAM: 'C', enAM: 0.75, distAM: 6, vista: VPRED, alto: 250, alt: 'Otra cartulina triangular ABC con su mediana AM, de 12 cm.' })),
      revelar: figO(figMed(PA, PB, PC, { objeto: 'carton', G: true, rot: { AG: '8 cm', GM: '4 cm' }, rotPos: { AG: { ref: 'C', en: 0.8, dist: 3 }, GM: { ref: 'B' } }, vista: VPRED, alto: 250, alt: 'La misma cartulina: el punto de equilibrio G queda a 8 cm de A y a 4 cm de M.' })),
      coincide: 'Coincide: G deja 8 cm hacia A y 4 cm hacia M, así que el tramo de A es el doble del otro.',
      noCoincide: 'Revisemos: G parte la mediana en tres partes de 4 cm, y dos de ellas quedan del lado de A. Por eso AG = 8 cm.',
    },
    mira: {
      pieza: GO,
      datos: figMed(PA, PB, PC, { objeto: 'carton', medianas: ['A', 'B', 'C'], desde: { B: 1, C: 1 }, G: 1, base: 3, seis: 6,
        colores: true, vista: VPRED, alto: 250,
        alt: 'La cartulina con sus tres medianas, que se cortan en G; la base media MN; AG = 8 cm y GM = 4 cm; los seis triángulos de igual área.' }),
      voz: 'Primero las tres medianas; después, por qué G las parte así.',
      pasos: [
        { estado: { corte: 0 }, texto: 'La mediana AM mide 12 cm.', ecuacion: junto(['AM = 12 cm']) },
        { estado: { corte: 1 }, texto: 'Las otras dos medianas cruzan a AM en un mismo punto, G.' },
        { estado: { corte: 2 }, texto: 'G es el punto donde la cartulina se sostiene sola: su punto de equilibrio.' },
        { estado: { corte: 3 }, texto: 'MN une los puntos medios de dos lados, así que es paralela a AB y mide la mitad de AB.', ecuacion: junto(['MN = AB ÷ 2']) },
        { estado: { corte: 4 }, texto: 'Por eso el triángulo GMN es el GAB reducido a la mitad, y GM mide la mitad de AG.', ecuacion: junto([dO('AG'), ' = 2 · ', dI('GM')]) },
        { estado: { corte: 5 }, texto: 'Los 12 cm de AM quedan en tres partes de 4 cm, y dos de ellas son de AG.', ecuacion: junto([dO('AG'), ' = 8 cm', Y, dI('GM'), ' = 4 cm']) },
        { estado: { corte: 6 }, texto: 'Las tres medianas dejan seis triángulos de igual área, aunque tengan formas distintas.', ecuacion: junto(['cada uno = S ÷ 6']) },
      ],
    },
    regla: {
      texto: 'Las tres medianas se cortan en el baricentro G, que siempre queda dentro del triángulo. G parte cada mediana en 2 : 1 desde el vértice, y las tres medianas dejan seis triángulos de igual área.',
      ecuacion: [junto([dO('AG'), ' = 2 · ', dI('GM')]), Y, junto([dO('AG'), ' = ']), { frac: ['2', '3'] }, junto(' · AM')],
      condicion: 'AM va de A al punto medio M del lado opuesto; con las medianas que salen de B y de C pasa lo mismo.',
      voz: 'Dos partes para el vértice, una para el lado.',
      dibujo: figO(figMed(T1.A, T1.B, T1.C, { medianas: ['A', 'B', 'C'], G: true, rot: { AG: '2k', GM: 'k' }, seis: 0, alt: 'El triángulo ABC con sus tres medianas: G parte AM en AG = 2k y GM = k; los seis triángulos tienen igual área.' })),
    },
    resuelve: { pieza: GO, generar: resuelveBar },
    ahoraTu: {
      pieza: GO,
      voz: 'Ubica el tramo largo: siempre es el que llega al vértice.',
      generar(s) { return conCuatro([casoAG, casoAM, casoGN, casoArea, casoHip, casoX][s % 6], azar(s + 7), firmasDe(EJ1, [PRED1])); },
    },
  };

  // ======================= Idea 2: el circuncentro =======================
  // Objeto de la primera pantalla: tres casas de una comunidad y un tanque de agua, vistos desde arriba (escena «notable»,
  // tipo «casas»; dibujo de prueba). Coordenadas en metros.
  // Cambia: dónde está el tanque P. · Permanece: las casas A(20, 60), B(0, 0), C(80, 0) (acutángulo). · Progresa: las tres
  // distancias PA, PB, PC. · Se reserva: el obtusángulo (la predicción) y el rectángulo (la regla). · Debe verse: hay un
  // solo punto a la misma distancia de las tres casas.
  const KA = [20, 60], KB = [0, 0], KC = [80, 0], KO = centrosDe(KA, KB, KC).O;
  // Un punto de la mediatriz de PQ (para dibujarla como recta): el punto medio y otro corrido a lo perpendicular.
  const perp = (P, Q) => { const m = U.medio(P, Q), d = [Q[0] - P[0], Q[1] - P[1]]; return [m, [m[0] - d[1], m[1] + d[0]]]; };
  const RADIO = (de, a, x = {}) => [de, a, Object.assign({ color: 'i', grosor: 'fino' }, x)];
  // Las casas con el tanque en P (el juego).
  function figCasas(P) {
    const pts = { A: KA, B: KB, C: KC, P };
    const segs = [['A', 'B', { grosor: 'fino', discontinua: true }], ['B', 'C', { grosor: 'fino', discontinua: true }], ['C', 'A', { grosor: 'fino', discontinua: true }],
      RADIO('P', 'A'), RADIO('P', 'B'), RADIO('P', 'C')];
    return nt({ pts, segs, ver: { A: { lado: 90 }, B: { lado: 225 }, C: { lado: 315 }, P: { color: 'o', lado: 200 } }, fijas: ['A', 'B', 'C'],
      obj: { tipo: 'casas', casas: ['A', 'B', 'C'], tanque: 'P' }, manija: 'P', vista: { x: [-12, 92], y: [-14, 74] }, alto: 240,
      alt: 'Tres casas A, B y C vistas desde arriba, y el tanque P unido a cada casa con un tubo recto.' });
  }
  // Un triángulo con su circuncentro. o: { O: corte | true, med: { BC, AB, AC: corte } (mediatrices punteadas, rectas
  //   enteras), radios: corte, circ: corte, angA: texto, angBOC: texto, angOBC: texto, rot: { AB, BC, AC, R… }, objeto,
  //   alt, vista, alto, ladoO }
  function figCirc(A, B, C, o = {}) {
    const c = centrosDe(A, B, C), pts = { A, B, C };
    const segs = [['A', 'B'], ['B', 'C'], ['C', 'A']];
    const veO = o.O !== undefined && o.O !== false, dO_ = typeof o.O === 'number' ? o.O : 0;
    if (veO) pts.O = c.O;
    for (const [k, [P, Q]] of Object.entries({ BC: [B, C], AB: [A, B], AC: [A, C] })) {
      if (!o.med || o.med[k] === undefined) continue;
      const [m, q] = perp(P, Q); pts[`~${k}a`] = m; pts[`~${k}b`] = q;
      segs.push([`~${k}a`, `~${k}b`, { recta: true, discontinua: true, grosor: 'fino', desde: o.med[k] }]);
    }
    if (o.radios !== undefined && veO) for (const v of ['A', 'B', 'C']) segs.push(RADIO('O', v, { desde: o.radios }));
    const angs = [];
    if (o.angA) angs.push({ en: 'A', de: 'B', a: 'C', texto: o.angA, color: o.angA === '?' ? undefined : 'h' });
    if (o.angB) angs.push({ en: 'B', de: 'C', a: 'A', texto: o.angB, color: o.angB === '?' ? undefined : 'h' });
    if (o.angBOC && veO) angs.push({ en: 'O', de: 'B', a: 'C', texto: o.angBOC, color: o.angBOC === '?' ? undefined : 'h', radio: 16 });
    if (o.angOBC && veO) angs.push({ en: 'B', de: 'C', a: 'O', texto: o.angOBC, color: o.angOBC === '?' ? undefined : 'h', radio: 26 });
    if (o.angOAC && veO) angs.push({ en: 'A', de: 'O', a: 'C', texto: o.angOAC, color: o.angOAC === '?' ? undefined : 'h', radio: 30 });
    const circs = o.circ !== undefined && veO ? [{ centro: 'O', r: c.R, grosor: 'fino', desde: o.circ }] : undefined;
    const rot = o.rot || {}, lados = [];
    for (const [p, q, k] of [['A', 'B', 'AB'], ['B', 'C', 'BC'], ['A', 'C', 'AC'], ['O', 'A', 'OA'], ['O', 'B', 'OB'], ['O', 'C', 'OC']]) if (rot[k] !== undefined) lados.push({ de: p, a: q, texto: rot[k], color: /^O/.test(k) && rot[k] !== '?' ? 'i' : undefined, dist: 5 });
    const xs = [A[0], B[0], C[0]], ys = [A[1], B[1], C[1]];
    if (veO && (o.circ !== undefined)) { xs.push(c.O[0] - c.R, c.O[0] + c.R); ys.push(c.O[1] - c.R, c.O[1] + c.R); } else if (veO) { xs.push(c.O[0]); ys.push(c.O[1]); }
    const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)), mg = span * 0.12;
    const vista = o.vista || { x: [Math.min(...xs) - mg, Math.max(...xs) + mg], y: [Math.min(...ys) - mg, Math.max(...ys) + mg] };
    const obj = o.objeto === 'casas' ? { tipo: 'casas', casas: ['A', 'B', 'C'] } : { tipo: 'examen' };
    return nt({ pts, segs, angs, circs, lados, obj, vista, alto: o.alto || 240, ver: veO ? { O: { desde: dO_, lado: o.ladoO === undefined ? 270 : o.ladoO } } : {},
      fijas: o.fijas || [], alt: o.alt || 'Un triángulo ABC y su circuncentro O.' });
  }
  const D_CIRC = 'El circuncentro O es el corte de las mediatrices: OA = OB = OC = R, el circunradio.';
  const D_CENT = 'Un ángulo central mide el doble del inscrito que abarca el mismo arco.';
  const D_SUMA = 'Los tres ángulos de un triángulo suman 180°.';
  const D_ISOS = 'En un triángulo isósceles, los dos ángulos de la base miden igual.';
  const D_ORECT = 'En un triángulo rectángulo, el circuncentro es el punto medio de la hipotenusa.';
  const D_LUGAR = 'O queda dentro de un acutángulo, en la hipotenusa de un rectángulo y fuera de un obtusángulo.';
  const D_VUELTA = 'Una vuelta completa mide 360°.';
  const D_NOT30 = 'En el triángulo rectángulo de 30° y 60°, el cateto opuesto a 30° mide la mitad de la hipotenusa.';
  const gra = n => `${fm(n)}°`;

  // Los 15 ejemplos (cuentas rehechas aparte: cuentas.py, idea 2): 70°; 13 cm; 9 m; dentro; 55°; 5 m; 50°; 65°; 120°;
  // fuera; 8 cm; 6,5 cm; 10 cm; 16 cm; 26°.
  const T2 = { A: [3, 6.5], B: [0, 0], C: [8, 0] };
  const fig2 = o => figO(figCirc(T2.A, T2.B, T2.C, o));
  const EJ2 = [];
  EJ2.push({ nivel: 1, titulo: 'El ángulo en el circuncentro',
    figura: fig2({ O: true, radios: 0, angA: '35°', angBOC: '?', alt: 'Un triángulo acutángulo ABC con su circuncentro O unido a B y a C; m∠A = 35°.' }),
    enunciado: 'En el triángulo acutángulo ABC, m∠A = 35° y O es el circuncentro. ¿Cuánto mide el ángulo BOC?',
    datos: [D_CIRC, D_CENT],
    solucion: [{ texto: 'O es el centro de la circunferencia que pasa por A, B y C. ∠BOC es central y ∠A es inscrito sobre el mismo arco BC:', ecuacion: junto(['m∠BOC = 2 · ', dH('35°'), ' = ', dF('70°')]) }],
    respuesta: [junto('m∠BOC = '), dF('70°')] });
  EJ2.push({ nivel: 1, titulo: 'La escuadra en su circunferencia',
    enunciado: 'Un triángulo es rectángulo y su hipotenusa mide 26 cm. ¿Cuánto mide su circunradio R?',
    datos: [D_ORECT, D_CIRC],
    solucion: [{ texto: 'O es el punto medio de la hipotenusa, y R va de O a un extremo, así que R es la mitad:', ecuacion: junto(['R = 26 ÷ 2 = ', dF('13 cm')]) }],
    respuesta: [junto('R = '), dF('13 cm')] });
  EJ2.push({ nivel: 1, titulo: 'Tres postes y un foco',
    figura: figO(figCirc([20, 60], [0, 0], [80, 0], { O: true, radios: 0, objeto: 'casas', rot: { OA: '9 m', OC: '?' }, alt: 'Tres postes A, B y C y el foco O, unido a cada poste.' })),
    enunciado: 'Un foco O está a la misma distancia de los postes A, B y C, y OA = 9 m. ¿A qué distancia está el foco del poste C?',
    datos: ['Equidistar: estar a la misma distancia.'],
    solucion: [{ texto: 'O equidista de los tres postes: OC mide lo mismo que OA.', ecuacion: junto(['OC = OA = ', dF('9 m')]) }],
    respuesta: [junto('OC = '), dF('9 m')] });
  EJ2.push({ nivel: 1, titulo: '¿Dentro o fuera?',
    enunciado: 'Los ángulos de un triángulo miden 50°, 60° y 70°. ¿Dónde queda su circuncentro?',
    datos: [D_LUGAR],
    solucion: [{ texto: 'Los tres ángulos son agudos: el triángulo es acutángulo, y el circuncentro queda ', ecuacion: [dF('dentro del triángulo')] }],
    respuesta: [dF('Dentro del triángulo')] });
  EJ2.push({ nivel: 1, titulo: 'Del central al inscrito',
    enunciado: 'En el triángulo acutángulo ABC, O es el circuncentro y m∠BOC = 110°. ¿Cuánto mide el ángulo A?',
    datos: [D_CENT],
    solucion: [{ texto: '∠BOC es central y ∠A es inscrito sobre el mismo arco, así que A mide la mitad de BOC.', ecuacion: junto(['m∠A = ', dH('110°'), ' ÷ 2 = ', dF('55°')]) }],
    respuesta: [junto('m∠A = '), dF('55°')] });

  EJ2.push({ nivel: 2, titulo: 'Un terreno rectángulo',
    enunciado: 'Un terreno tiene forma de triángulo rectángulo, con catetos de 6 m y 8 m. ¿Cuál es el radio de la circunferencia que pasa por sus tres esquinas?',
    datos: [D_PIT, D_ORECT],
    solucion: [{ texto: 'Primero se halla la hipotenusa con Pitágoras:', ecuacion: junto(['h² = 36 + 64 = 100', FL, 'h = 10 m']) },
      { texto: 'El circuncentro es el punto medio de la hipotenusa, y R es su mitad:', ecuacion: junto(['R = 10 ÷ 2 = ', dF('5 m')]) }],
    respuesta: [junto('R = '), dF('5 m')] });
  EJ2.push({ nivel: 2, titulo: 'Un ángulo junto a la base',
    figura: fig2({ O: true, radios: 0, angA: '40°', angOBC: '?', alt: 'El triángulo acutángulo ABC con su circuncentro O unido a B y a C; m∠A = 40°.' }),
    enunciado: 'En el triángulo acutángulo ABC, m∠A = 40° y O es el circuncentro. ¿Cuánto mide el ángulo OBC?',
    datos: [D_CENT, D_CIRC, D_ISOS, D_SUMA],
    solucion: [{ texto: 'El ángulo central mide el doble del inscrito: m∠BOC = 2 · 40° = 80°. Como OB = OC, el triángulo BOC es isósceles.' },
      { texto: 'Sus dos ángulos de la base son iguales y se reparten lo que falta para 180°:', ecuacion: junto(['(180° − 80°) ÷ 2 = ', dF('50°')]) }],
    respuesta: [junto('m∠OBC = '), dF('50°')] });
  EJ2.push({ nivel: 2, titulo: 'Al revés: desde OBC',
    figura: (() => { const t = triAng(45, 70); return figO(figCirc(t.A, t.B, t.C, { O: true, radios: 0, angOBC: '25°', angA: '?', alt: 'El triángulo acutángulo ABC con su circuncentro O unido a B y a C; m∠OBC = 25°.' })); })(),
    enunciado: 'En el triángulo acutángulo ABC, O es el circuncentro y m∠OBC = 25°. ¿Cuánto mide el ángulo A?',
    datos: [D_CENT, D_CIRC, D_ISOS, D_SUMA],
    solucion: [{ texto: 'El triángulo BOC es isósceles porque OB = OC, así que m∠OCB = 25° y m∠BOC = 180° − 50° = 130°.' },
      { texto: '∠A es inscrito sobre el mismo arco que ese ángulo central, así que mide su mitad:', ecuacion: junto(['m∠A = 130° ÷ 2 = ', dF('65°')]) }],
    respuesta: [junto('m∠A = '), dF('65°')] });
  EJ2.push({ nivel: 2, titulo: 'Con el ángulo A obtuso',
    enunciado: 'En el triángulo ABC, m∠A = 120° y O es el circuncentro. ¿Cuánto mide el ángulo BOC, el menor de los dos que forman OB y OC?',
    datos: [D_CENT, D_VUELTA],
    solucion: [{ texto: 'El inscrito de 120° abarca el arco BC que no pasa por A: su central mide 2 · 120° = 240°, más que media vuelta.' },
      { texto: 'El ángulo BOC menor es lo que le falta a 240° para completar la vuelta:', ecuacion: junto(['360° − 240° = ', dF('120°')]) }],
    respuesta: [junto('m∠BOC = '), dF('120°')] });
  EJ2.push({ nivel: 2, titulo: 'Dos ángulos dados',
    enunciado: 'Dos ángulos de un triángulo miden 30° y 45°. ¿Dónde queda su circuncentro?',
    datos: [D_SUMA, D_LUGAR],
    solucion: [{ texto: 'Primero se halla el tercer ángulo:', ecuacion: junto(['180° − 30° − 45° = 105°']) },
      { texto: ['105° es un ángulo obtuso, así que el triángulo es obtusángulo y O queda ', dF('fuera del triángulo'), '.'] }],
    respuesta: [dF('Fuera del triángulo')] });

  // Nivel 3: la correcta en C, E, B, A y D; cada incorrecta se explica por su valor.
  EJ2.push({ nivel: 3, titulo: 'El circunradio del equilátero',
    enunciado: 'Un triángulo equilátero tiene 12 cm de altura. ¿Cuánto mide su circunradio R?',
    alternativas: ['12 cm', '6 cm', '8 cm', '4 cm', '9 cm'],
    datos: ['En un equilátero, la altura, la mediana y la mediatriz de un lado son la misma recta.', D_BAR],
    solucion: [{ texto: 'En el equilátero, las tres mediatrices son también medianas, así que el circuncentro O coincide con el baricentro G.' },
      { texto: 'R va de O a un vértice, y esa distancia es dos tercios de la altura:', ecuacion: junto(['R = 2 · (12 ÷ 3) = ', dF('8 cm')]) },
      { texto: 'Las otras alternativas: 12 cm es la altura entera, 6 cm es su mitad, 4 cm va de O al lado y 9 cm son tres cuartos de la altura.' }],
    respuesta: [junto('R = '), dF('8 cm')] });
  EJ2.push({ nivel: 3, titulo: 'Catetos de 5 y 12 cm',
    enunciado: 'Un triángulo rectángulo tiene catetos de 5 cm y 12 cm. ¿Cuánto mide su circunradio?',
    alternativas: ['13 cm', '8,5 cm', '6 cm', '2,5 cm', '6,5 cm'],
    datos: [D_PIT, D_ORECT],
    solucion: [{ texto: 'Primero se halla la hipotenusa: 25 + 144 = 169, así que mide 13 cm.' },
      { texto: 'O es el punto medio de la hipotenusa, y R es su mitad:', ecuacion: junto(['R = 13 ÷ 2 = ', dF('6,5 cm')]) },
      { texto: 'Las otras alternativas: 13 cm es la hipotenusa entera, que es el diámetro; 8,5 cm promedia los catetos, y 6 cm y 2,5 cm son mitades de un cateto.' }],
    respuesta: [junto('R = '), dF('6,5 cm')] });
  EJ2.push({ nivel: 3, titulo: 'Frente a un ángulo de 30°',
    figura: fig2({ O: true, radios: 0, angA: '30°', rot: { BC: '10 cm' }, alt: 'Un triángulo acutángulo ABC con m∠A = 30°, BC = 10 cm y su circuncentro O unido a B y a C.' }),
    enunciado: 'En el triángulo acutángulo ABC, m∠A = 30° y BC = 10 cm. ¿Cuánto mide su circunradio?',
    alternativas: ['5 cm', '10 cm', '20 cm', '8,66 cm', '5,77 cm'],
    datos: [D_CENT, D_CIRC, D_ISOS, D_SUMA],
    solucion: [{ texto: 'm∠BOC = 2 · 30° = 60°, y OB = OC: los ángulos en B y en C del triángulo BOC miden (180° − 60°) ÷ 2 = 60°.' },
      { texto: 'BOC es equilátero, así que OB mide lo mismo que BC:', ecuacion: junto(['R = OB = ', dF('10 cm')]) },
      { texto: 'Las otras alternativas: 5 cm es la mitad de BC, que valdría con A recto; 20 cm, el diámetro; 8,66 cm, la altura de BOC desde O, y 5,77 cm, el circunradio de un equilátero de lado 10.' }],
    respuesta: [junto('R = '), dF('10 cm')] });
  EJ2.push({ nivel: 3, titulo: 'El cateto que falta',
    enunciado: 'El circuncentro de un triángulo rectángulo está a 10 cm de cada vértice, y uno de sus catetos mide 12 cm. ¿Cuánto mide el otro cateto?',
    alternativas: ['16 cm', '8 cm', '10 cm', '15,62 cm', '6 cm'],
    datos: [D_ORECT, D_PIT],
    solucion: [{ texto: 'R = 10 cm es la mitad de la hipotenusa: la hipotenusa mide 20 cm.' },
      { texto: 'Con Pitágoras, el otro cateto x cumple:', ecuacion: junto(['x² = 400 − 144 = 256', FL, 'x = ', dF('16 cm')]) },
      { texto: 'Las otras alternativas: 8 cm resta los lados, 20 − 12, en lugar de sus cuadrados; 10 cm copia R; 15,62 cm suma los cuadrados de 10 y 12, y 6 cm es la mitad de 12.' }],
    respuesta: [dF('16 cm')] });
  EJ2.push({ nivel: 3, titulo: 'Del circunradio a un lado',
    figura: (() => { const t = triAng(75, 45); return figO(figCirc(t.A, t.B, t.C, { O: true, radios: 0, angB: '64°', angOAC: '?', alt: 'El triángulo acutángulo ABC con m∠B = 64° y su circuncentro O unido a A y a C.' })); })(),
    enunciado: 'En el triángulo acutángulo ABC, m∠B = 64° y O es el circuncentro. ¿Cuánto mide el ángulo OAC?',
    alternativas: ['32°', '64°', '58°', '26°', '116°'],
    datos: [D_CENT, D_CIRC, D_ISOS, D_SUMA],
    solucion: [{ texto: '∠AOC es central sobre el arco AC, el mismo que abarca ∠B: m∠AOC = 2 · 64° = 128°.' },
      { texto: 'Como OA = OC, el triángulo AOC es isósceles y sus ángulos de la base miden igual:', ecuacion: junto(['m∠OAC = (180° − 128°) ÷ 2 = ', dF('26°')]) },
      { texto: 'Las otras alternativas: 32° es la mitad de B, 64° copia B, y 58° y 116° salen de 180° − 64°.' }],
    respuesta: [junto('m∠OAC = '), dF('26°')] });

  const PRED2 = 'Ahora las tres casas forman un triángulo con un ángulo obtuso en A. ¿Dónde queda el punto que está a la misma distancia de las tres?';
  const QA = [20, 20], QB = [0, 0], QC = [80, 0], VQ = { x: [-14, 94], y: [-72, 34] };
  function resuelveCirc(s) {
    const r = azar(s + 900), t = s % 3;
    if (t === 0) {
      const [p, q, h] = r.de([[6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]]), k = r.de([1, 2, 3]);
      const a = p * k, b = q * k, hh = h * k;
      return {
        enunciado: `Un parque tiene forma de triángulo rectángulo, con catetos de ${a} m y ${b} m. Se pondrá un poste de luz a la misma distancia de sus tres esquinas. ¿A qué distancia de cada esquina queda?`,
        datos: [D_PIT, D_ORECT],
        // (Cierre del 26 nov, lector A: «sin figura cuesta imaginar el punto medio de la hipotenusa». Sin medidas en el
        // dibujo: que O sea el punto medio es la regla, no la respuesta.)
        dibujo: figO(figCirc([0, 5], [0, 0], [9, 0], { O: true, radios: 0, objeto: 'casas', rot: { OA: '?' }, alt: 'El parque rectángulo en B con el poste O en el punto medio de la hipotenusa, unido a las tres esquinas.' })),
        pasos: [
          { tipo: 'pide', texto: 'Piden R: el poste equidista de las tres esquinas, así que está en el circuncentro.' },
          { tipo: 'datos', texto: `Los catetos miden ${a} m y ${b} m; la hipotenusa no se da.` },
          { tipo: 'regla', texto: 'En un triángulo rectángulo, el circuncentro es el punto medio de la hipotenusa, así que R es la mitad de la hipotenusa.' },
          { tipo: 'cuentas', texto: `Con Pitágoras, la hipotenusa mide √(${a * a} + ${b * b}), que es √${hh * hh} = ${hh} m, y R es su mitad.`, ecuacion: junto([`R = ${hh} ÷ 2 = `, dF(m_(hh / 2))]) },
          { tipo: 'sentido', texto: `R = ${fm(hh / 2)} m es menor que el cateto mayor, ${b} m, y mayor que la mitad de ese cateto.` },
        ],
        respuesta: [junto('R = '), dF(m_(hh / 2))],
      };
    }
    const A = 2 * r.ent(14, 38);
    if (t === 1) return {
      enunciado: `En el triángulo acutángulo ABC, m∠A = ${A}° y O es el circuncentro. ¿Cuánto mide el ángulo OBC?${NO_ESC}`,
      datos: [D_CENT, D_CIRC, D_ISOS, D_SUMA],
      dibujo: figLejos(90 - A, a => 90 - a, (a, b) => { const t = triAng(a, b); return figO(figCirc(t.A, t.B, t.C, { O: true, radios: 0, angA: `${A}°`, angOBC: '?', alt: `Un triángulo acutángulo ABC con m∠A = ${A}° y su circuncentro O unido a B y a C.` })); }, 20, 80),
      pasos: [
        { tipo: 'pide', texto: 'Piden el ángulo OBC, entre el radio OB y el lado BC.' },
        { tipo: 'datos', texto: `m∠A = ${A}°, que es agudo, y O equidista de los vértices, así que OB = OC.` },
        { tipo: 'regla', texto: '∠BOC es central sobre el arco BC, el mismo que abarca ∠A, así que mide el doble; además, el triángulo BOC es isósceles.', ecuacion: junto(['m∠BOC = 2 · m∠A']) },
        { tipo: 'cuentas', texto: 'Primero se halla el ángulo central, y después se reparte lo que falta para 180° entre los dos ángulos iguales de BOC.', ecuacion: junto([`m∠BOC = ${2 * A}°`, FL, `(180° − ${2 * A}°) ÷ 2 = `, dF(`${90 - A}°`)]) },
        { tipo: 'sentido', texto: `${90 - A}° + ${90 - A}° + ${2 * A}° = 180°: los tres ángulos del triángulo BOC suman lo que deben.` },
      ],
      respuesta: [junto('m∠OBC = '), dF(`${90 - A}°`)],
    };
    const b = 5 * r.ent(4, 14), c = 5 * r.ent(2, 12), x = 180 - b - c;
    if (x <= 5) return resuelveCirc(s + 3);
    const clase = x > 90 ? 'obtusángulo' : x === 90 ? 'rectángulo' : 'acutángulo', lugar = x > 90 ? 'fuera del triángulo' : x === 90 ? 'en el punto medio de la hipotenusa' : 'dentro del triángulo';
    return {
      enunciado: `Dos ángulos de un triángulo miden ${b}° y ${c}°. ¿Dónde queda su circuncentro?`,
      datos: [D_SUMA, D_LUGAR],
      pasos: [
        { tipo: 'pide', texto: 'Piden dónde queda O: dentro del triángulo, sobre un lado o fuera.' },
        { tipo: 'datos', texto: `Se conocen dos ángulos, ${b}° y ${c}°; el tercero no se da.` },
        { tipo: 'regla', texto: 'El lugar de O depende del ángulo mayor: queda dentro si los tres son agudos, en la hipotenusa si uno es recto y fuera si uno es obtuso.' },
        { tipo: 'cuentas', texto: 'El tercer ángulo es lo que les falta a los otros dos para sumar 180°.', ecuacion: junto([`180° − ${b}° − ${c}° = ${x}°`]) },
        { tipo: 'sentido', texto: [`Con ${x}°, el triángulo es ${clase}: O queda `, dF(lugar), '.'] },
      ],
      respuesta: [dF(lugar[0].toUpperCase() + lugar.slice(1))],
    };
  }
  // «Ahora tú» de la idea 2. Tipos: R de un rectángulo; ∠BOC; ∠A desde ∠BOC; ∠OBC; dónde queda O.
  function casoR(r) {
    const [p, q, h] = r.de([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), k = r.de([2, 3, 4]);
    const a = p * k, b = q * k, hh = h * k;
    return { pregunta: `Un triángulo rectángulo tiene catetos de ${a} cm y ${b} cm. ¿Cuánto mide su circunradio?`,
      datos: [D_PIT, D_ORECT],
      opciones: ops(hh / 2, [
        { id: 'diam', valor: hh, error: 'GE-CC1', siFuera: `La hipotenusa, ${hh} cm, está bien, pero es el diámetro: R es su mitad.` },
        { id: 'prom', valor: (a + b) / 2, error: 'GE-CC2', siFuera: 'Partir por la mitad está bien, pero R es la mitad de la hipotenusa, no de la suma de los catetos.' },
        { id: 'bar', valor: hh / 3, error: 'GE-CC3', siFuera: 'Usar la hipotenusa está bien, pero O no la parte en tercios: está en su punto medio.' },
        { id: 'cat', valor: b / 2, error: 'GE-CC2', siFuera: 'Tomar una mitad está bien, pero R es la mitad de la hipotenusa, no la de un cateto.' },
      ], cm),
      solucion: { texto: 'Con Pitágoras sale la hipotenusa, y O está en su punto medio.', ecuacion: junto([`h = ${hh}`, FL, 'R = ', dF(cm(hh / 2))]) } };
  }
  const malBXC = A => [
    { id: 'igual', valor: A, error: 'GE-CC4', siFuera: 'Ubicar el ángulo está bien, pero el central no mide lo mismo que el inscrito: mide el doble.' },
    { id: 'orto', valor: 180 - A, error: 'GE-CC5', siFuera: '180° − A es el ángulo entre dos alturas; aquí los lados de BOC son radios.' },
    { id: 'in', valor: 90 + A / 2, error: 'GE-CC5', siFuera: '90° + A/2 es el ángulo entre dos bisectrices; aquí los lados de BOC son radios.' },
  ];
  function casoBOC(r) {
    const A = r.ent(20, 80);
    return { pregunta: `En el triángulo acutángulo ABC, m∠A = ${A}° y O es el circuncentro. ¿Cuánto mide el ángulo BOC?`,
      datos: [D_CIRC, D_CENT],
      opciones: ops(2 * A, malBXC(A), gra),
      solucion: { texto: '∠BOC es central sobre el arco BC y ∠A es inscrito sobre el mismo arco, así que BOC mide el doble.', ecuacion: junto([`m∠BOC = 2 · ${A}° = `, dF(`${2 * A}°`)]) } };
  }
  function casoA(r) {
    const X = 2 * r.ent(25, 85);
    return { pregunta: `En el triángulo acutángulo ABC, O es el circuncentro y m∠BOC = ${X}°. ¿Cuánto mide el ángulo A?`,
      datos: [D_CIRC, D_CENT],
      opciones: ops(X / 2, [
        { id: 'igual', valor: X, error: 'GE-CC4', siFuera: 'Relacionar los dos ángulos está bien, pero el inscrito mide la mitad del central.' },
        { id: 'doble', valor: 2 * X > 179 ? 360 - X : 2 * X, error: 'GE-CC4', siFuera: 'Es al revés: el ángulo central es el doble del inscrito, no el inscrito el doble del central.' },
        { id: 'supl', valor: 180 - X, error: 'GE-CC5', siFuera: 'Restar de 180° sirve con dos alturas; aquí BOC es un ángulo central.' },
        { id: 'resta', valor: 90 - X / 2, error: 'GE-CC6', siFuera: `${90 - X / 2}° es el ángulo OBC; piden el ángulo A.` },
      ], gra),
      solucion: { texto: '∠A es inscrito sobre el mismo arco que el central BOC, así que mide su mitad.', ecuacion: junto([`m∠A = ${X}° ÷ 2 = `, dF(`${X / 2}°`)]) } };
  }
  function casoOBC(r) {
    const A = r.ent(20, 80);
    return { pregunta: `En el triángulo acutángulo ABC, m∠A = ${A}° y O es el circuncentro. ¿Cuánto mide el ángulo OBC?`,
      datos: [D_CENT, D_CIRC, D_ISOS, D_SUMA],
      opciones: ops(90 - A, [
        { id: 'boc', valor: 2 * A, error: 'GE-CC6', siFuera: `${2 * A}° es m∠BOC, el ángulo central; falta repartir lo que queda entre los dos ángulos iguales de BOC.` },
        { id: 'sinDoble', valor: (180 - A) / 2, error: 'GE-CC4', siFuera: 'Usar el isósceles BOC está bien, pero el central mide 2A, no A.' },
        { id: 'igual', valor: A, error: 'GE-CC6', siFuera: 'Buscar el ángulo en B está bien, pero OBC no mide lo mismo que el ángulo A.' },
        { id: 'mitad', valor: 90 - A / 2, error: 'GE-CC5', siFuera: '90° − A/2 es el ángulo entre dos bisectrices exteriores; aquí OB y OC son radios iguales.' },
      ], gra),
      solucion: { texto: `m∠BOC = 2 · ${A}° = ${2 * A}°, y BOC es isósceles, así que sus dos ángulos de la base se reparten el resto.`, ecuacion: junto([`(180° − ${2 * A}°) ÷ 2 = `, dF(`${90 - A}°`)]) } };
  }
  const LUGARES_O = [
    { id: 'dentro', texto: 'Dentro del triángulo', error: 'GE-CC7', siFuera: 'O queda dentro solo si los tres ángulos son agudos; calcula el tercero y revísalo.' },
    { id: 'lado', texto: 'En el punto medio del lado mayor', error: 'GE-CC7', siFuera: 'O queda en el punto medio de un lado solo si hay un ángulo recto.' },
    { id: 'fuera', texto: 'Fuera del triángulo', error: 'GE-CC7', siFuera: 'O queda fuera solo si hay un ángulo obtuso.' },
    { id: 'vertice', texto: 'En el vértice del ángulo mayor', error: 'GE-CC8', siFuera: 'O equidista de los tres vértices: no puede estar en uno de ellos.' },
  ];
  function casoDonde(r) {
    for (;;) {
      const b = 5 * r.ent(3, 16), c = 5 * r.ent(3, 16), x = 180 - b - c;
      if (x < 10) continue;
      const k = x > 90 ? 2 : x === 90 ? 1 : 0;
      if (k === 1 && r() < 0.6) continue;
      return { pregunta: `Dos ángulos de un triángulo miden ${b}° y ${c}°. ¿Dónde queda su circuncentro?`,
        datos: [D_SUMA, D_LUGAR],
        opciones: opsTexto(LUGARES_O[k].texto, LUGARES_O.filter((_, i) => i !== k)),
        solucion: { texto: `El tercer ángulo mide 180° − ${b}° − ${c}° = ${x}°: el triángulo es ${['acutángulo', 'rectángulo', 'obtusángulo'][k]}.`, ecuacion: [dF(LUGARES_O[k].texto)] } };
    }
  }
  const ideaCircuncentro = {
    id: 'circuncentro',
    titulo: 'El circuncentro y la circunscrita',
    pregunta: '¿Dónde va un tanque a igual distancia de tres casas?',
    temas: ['Baricentro, incentro, circuncentro, ortocentro y excentro', 'Propiedades de los puntos notables'],
    pieza: GO,
    aprendizaje: 'Las mediatrices se cortan en el circuncentro O, a la misma distancia R de los vértices; O queda dentro, en la hipotenusa o fuera.',
    actividad: 'Mover un tanque de agua hasta dejarlo igual de lejos de tres casas.',
    // Lee: equidistar y la mediatriz de Congruencia, sin decir dónde queda O en un obtusángulo.
    lee: {
      tarjetas: [
        { titulo: 'Tres casas y un tanque', texto: 'Una comunidad quiere un tanque de agua a la misma distancia de sus tres casas, para que los tres tubos midan igual. Las casas son A, B y C; el tanque es P.',
          pieza: GO, dibujo: figO(figCasas([50, 40])) },
        { titulo: 'La mediatriz, otra vez', texto: 'La mediatriz de un segmento es la recta perpendicular que pasa por su punto medio. Cada punto de la mediatriz de BC está igual de lejos de B que de C.' },
        // Apertura (28 nov): el doblez de esquina sobre esquina es la mediatriz. No dice dónde se cruzan (la predicción).
        { titulo: 'Doblar esquina sobre esquina', texto: 'Con papel puedes marcar una mediatriz sin regla: dobla el triángulo de modo que la esquina B caiga justo encima de la esquina C. Al desdoblar, la raya del doblez corta BC por su mitad y en ángulo recto, porque las dos mitades de BC quedaron una encima de la otra: es la mediatriz de BC.' },
        { titulo: 'Qué mirar al jugar', texto: 'Mueve el tanque P y compara las tres distancias PA, PB y PC. Busca el lugar donde las tres miden igual.' },
      ],
    },
    ejemplos: EJ2,
    juega: {
      pieza: GO,
      consigna: 'Tres casas, A, B y C, necesitan un tanque de agua. Cada casa se une al tanque P con un tubo recto.',
      mision: { texto: 'Lleva el tanque hasta que quede igual de lejos de las tres casas.', logrado: v => v.px === KO[0] && v.py === KO[1],
        bien: 'Listo: los tres tubos miden lo mismo, unos 44,72 m.' },
      voz: 'Iguala dos tubos primero; después busca el tercero.',
      leyenda: [
        { s: 'A, B, C', t: 'las tres casas' },
        { s: dO('P'), t: 'el tanque de agua' },
        { s: dI('PA, PB, PC'), t: 'los tubos, de P a cada casa' },
      ],
      controles: [
        { id: 'px', etiqueta: 'P a lo ancho', min: 0, max: 80, paso: 10, inicio: 50, unidad: 'm', decimales: 0, color: 'c-o' },
        { id: 'py', etiqueta: 'P a lo alto', min: 0, max: 60, paso: 10, inicio: 40, unidad: 'm', decimales: 0, color: 'c-o' },
      ],
      dibujo: v => ({ datos: figCasas([v.px, v.py]), estado: {} }),
      arrastres: [{ id: 'tanque', etiqueta: 'tanque', color: 'c-o',
        donde: v => enPantalla(figCasas([v.px, v.py]), [v.px, v.py]),
        mover: (p, v) => { const q = alPlano(figCasas([v.px, v.py]), p); return { px: q[0], py: q[1] }; } }],
      // La relación: cuáles tubos miden igual y cuál no.
      lectura: v => {
        const P = [v.px, v.py], d = { A: U.dist(P, KA), B: U.dist(P, KB), C: U.dist(P, KC) }, t = k => `P${k}`;
        const ig = (x, y) => Math.abs(d[x] - d[y]) < 1e-9;
        if (ig('A', 'B') && ig('B', 'C')) return [`PA = PB = PC = ${m_(d.A)}: los tres tubos iguales.`];
        for (const [x, y, z] of [['A', 'B', 'C'], ['B', 'C', 'A'], ['A', 'C', 'B']]) if (ig(x, y)) return [`${t(x)} = ${t(y)} = ${m_(d[x])}, pero ${t(z)} = ${m_(d[z])}.`];
        const orden = ['A', 'B', 'C'].sort((x, y) => d[x] - d[y]);
        return [`El más corto es ${t(orden[0])}, de ${m_(d[orden[0]])}; el más largo, ${t(orden[2])}.`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: PRED2,
      datos: ['B y C están a 80 m una de otra.', 'A está a 20 m de la recta BC.', 'El pie de A sobre BC está a 20 m de B.'],
      voz: 'Antes había un punto así adentro. ¿Y ahora?',
      opciones: [
        { id: 'c', texto: 'Fuera del triángulo, al otro lado de BC', correcta: true },
        { id: 'dentro', texto: 'Dentro del triángulo, como antes', error: 'GE-CC7', siFuera: 'Buscar el cruce de las mediatrices es correcto, pero con el ángulo obtuso ese cruce sale del triángulo.' },
        { id: 'medio', texto: 'En el punto medio de BC, el lado más largo', error: 'GE-CC9', siFuera: 'Ese punto equidista de B y de C, pero A queda más cerca de él que B.' },
        { id: 'ninguno', texto: 'No hay ningún punto así', error: 'GE-CC10', siFuera: 'Las mediatrices de dos lados siempre se cortan, así que el punto existe, aunque quede fuera.' },
      ],
      dibujo: figO(figCirc(QA, QB, QC, { objeto: 'casas', alto: 200, alt: 'Las casas A, B y C forman un triángulo con el ángulo en A obtuso.' })),
      revelar: figO(figCirc(QA, QB, QC, { objeto: 'casas', O: true, radios: 0, circ: 0, vista: VQ, alto: 250, alt: 'El punto O, a la misma distancia de las tres casas, queda fuera del triángulo, debajo de BC.' })),
      coincide: 'Coincide: O queda fuera, debajo de BC, y está a unos 44,72 m de cada casa.',
      noCoincide: 'Revisemos: las mediatrices se cortan debajo de BC. Ese punto O está a unos 44,72 m de las tres casas.',
    },
    mira: {
      pieza: GO,
      datos: figCirc(QA, QB, QC, { objeto: 'casas', O: 3, med: { BC: 1, AB: 2, AC: 4 }, radios: 3, circ: 5, vista: VQ, alto: 250,
        alt: 'Las mediatrices de BC, AB y AC se cortan en O, fuera del triángulo; la circunferencia de centro O pasa por las tres casas.' }),
      voz: 'Una mediatriz por cada par de casas.',
      pasos: [
        { estado: { corte: 0 }, texto: 'El ángulo en A es obtuso.' },
        { estado: { corte: 1 }, texto: 'Cada punto de la mediatriz de BC equidista de B y de C.' },
        { estado: { corte: 2 }, texto: 'Cada punto de la mediatriz de AB equidista de A y de B.' },
        { estado: { corte: 3 }, texto: 'Las dos mediatrices se cortan en O, debajo de BC, es decir, fuera del triángulo.', ecuacion: junto([dI('OA'), ' = ', dI('OB'), ' = ', dI('OC')]) },
        { estado: { corte: 4 }, texto: 'La mediatriz de AC también pasa por O.' },
        { estado: { corte: 5 }, texto: 'Con centro en O, una circunferencia pasa por las tres casas.', ecuacion: junto(['radio = ', dI('R')]) },
      ],
    },
    regla: {
      texto: 'Las tres mediatrices se cortan en el circuncentro O, que está a la misma distancia R de los tres vértices; R se llama circunradio. O queda dentro del acutángulo, en la hipotenusa del rectángulo y fuera del obtusángulo.',
      ecuacion: [junto([dI('OA'), ' = ', dI('OB'), ' = ', dI('OC'), ' = ', dI('R')]), Y, junto(['m∠BOC = 2 · ', dH('m∠A')])],
      condicion: 'el ángulo A es agudo. Si A es obtuso, O queda al otro lado de BC, y el ángulo BOC (el menor de los dos) mide 360° − 2 · m∠A.',
      voz: 'Primero mira el ángulo mayor: te dice dónde queda O.',
      dibujo: figO(figReglaCirc()),
    },
    resuelve: { pieza: GO, generar: resuelveCirc },
    ahoraTu: {
      pieza: GO,
      voz: 'O está igual de lejos de los tres vértices: busca radios iguales.',
      generar(s) { return conCuatro([casoR, casoBOC, casoA, casoOBC, casoDonde][s % 5], azar(s + 7), firmasDe(EJ2, [PRED2])); },
    },
  };
  // La regla de la idea 2: tres triángulos lado a lado (acutángulo, rectángulo y obtusángulo), cada uno con su O y su
  // circunferencia. Las letras A, B y C se repiten porque son tres figuras distintas, como en un libro.
  function figReglaCirc() {
    const T = [[[2, 3.6], [0, 0], [4, 0]], [[7.5, 3], [7.5, 0], [11.5, 0]], [[15.8, 1], [15, 0], [19, 0]]];
    const NOM = ['acutángulo', 'rectángulo', 'obtusángulo'];
    const pts = {}, segs = [], circs = [], libres = [], letra = {}, ver = {};
    T.forEach(([A, B, C], i) => {
      const c = centrosDe(A, B, C), s = 'abc'[i];
      Object.assign(pts, { [`A${s}`]: A, [`B${s}`]: B, [`C${s}`]: C, [`O${s}`]: c.O, [`~n${s}`]: [(B[0] + C[0]) / 2, -3.2] });
      // (Cierre del 26 nov, lector A: el acutángulo lleva sus letras y el arco de A en carmín, para que la fórmula se amarre
      // a algo que se ve; el arco de BOC no cabía sin tapar la O.)
      Object.assign(letra, i === 0 ? { Aa: 'A', Ba: 'B', Ca: 'C', Oa: 'O' } : { [`A${s}`]: null, [`B${s}`]: null, [`C${s}`]: null, [`O${s}`]: 'O' });
      segs.push([`A${s}`, `B${s}`], [`B${s}`, `C${s}`], [`C${s}`, `A${s}`], RADIO(`O${s}`, `A${s}`), RADIO(`O${s}`, `B${s}`), RADIO(`O${s}`, `C${s}`));
      circs.push({ centro: `O${s}`, r: c.R, grosor: 'fino' });
      libres.push({ en: `~n${s}`, dir: 270, dist: 2, texto: NOM[i] });
    });
    const angs = [{ en: 'Aa', de: 'Ba', a: 'Ca', color: 'h', radio: 14 }];
    // (El rótulo R no cabe en ninguna posición a 200 px de alto: los radios van en turquesa, el color de R en la fórmula.)
    return nt({ pts, segs, circs, letra, ver, libres, angs, fijas: ['Aa', 'Ba', 'Ca'], vista: { x: [-0.9, 19.9], y: [-4.6, 4.6] }, alto: 200,
      alt: 'Tres triángulos con su circuncentro O y su circunferencia: en el acutángulo O queda dentro; en el rectángulo, en el punto medio de la hipotenusa; en el obtusángulo, fuera.' });
  }


  // ======================= Idea 3: el incentro =======================
  // Objeto de la primera pantalla: un parque triangular con su pileta redonda (escena «notable», tipo «parque»; dibujo de
  // prueba). Coordenadas en metros: B(0, 0), C(12, 0), A(0, 16), con BC = 12 m, AB = 16 m y CA = 20 m.
  // Cambia: el centro P y el radio de la pileta. · Permanece: el parque. · Progresa: qué veredas toca. · Se reserva: las
  // tangentes desde un vértice (la predicción) y el área (la regla). · Debe verse: la pileta más grande toca las tres
  // veredas, y su centro está a la misma distancia de los tres lados.
  const JA = [0, 16], JB = [0, 0], JC = [12, 0], JI = centrosDe(JA, JB, JC).I, JR = centrosDe(JA, JB, JC).r;
  // Distancia de P a la recta de un lado.
  const aRecta = (P, X, Y) => U.dist(P, U.pie(P, X, Y));
  const LADOS_J = [['AB', JA, JB], ['BC', JB, JC], ['CA', JC, JA]];
  function figParque(P, rr) {
    const pts = { A: JA, B: JB, C: JC, P, '~r': [P[0] + rr, P[1]] };
    const segs = [['A', 'B'], ['B', 'C'], ['C', 'A'], ['P', '~r', { color: 'i', grosor: 'fino' }]];
    return nt({ pts, segs, circs: [{ centro: 'P', r: rr, grosor: 'fino' }], ver: { A: { lado: 90 }, B: { lado: 225 }, C: { lado: 315 }, P: { color: 'o', lado: 135 } },
      fijas: ['A', 'B', 'C', 'P'], obj: { tipo: 'parque', lamina: ['A', 'B', 'C'], franjas: [['A', 'B'], ['B', 'C'], ['C', 'A']], agua: [{ centro: 'P', r: rr }] }, manija: 'P',
      vista: { x: [-3, 15], y: [-2, 18] }, alto: 250, lados: [{ de: 'P', a: '~r', texto: 'r', color: 'i', dist: 3 }],
      alt: 'Un parque triangular con sus veredas AB, BC y CA, y una pileta redonda de centro P y radio r.' });
  }
  // Un triángulo con su incentro y su inscrita. o: { I, bis: corte (bisectrices), circ: corte, toques: corte (D, F, K y
  //   los radios), rot: { AF, AK, BF, BD, CD, CK, AB, AC, BC, r }, partes: corte (los tres triángulos IBC, ICA, IAB),
  //   angA, angBIC, objeto, alt, vista, alto }
  function figIn(A, B, C, o = {}) {
    const c = centrosDe(A, B, C), I = c.I, D = U.pie(I, B, C), F = U.pie(I, A, B), K = U.pie(I, A, C);
    const pts = { A, B, C };
    const segs = [['A', 'B'], ['B', 'C'], ['C', 'A']];
    const veI = o.I !== undefined && o.I !== false;
    const ver = { A: { lado: 90 }, B: { lado: 225 }, C: { lado: 315 } };
    if (veI) { pts.I = I; ver.I = { desde: typeof o.I === 'number' ? o.I : 0, lado: o.ladoI === undefined ? 200 : o.ladoI }; }
    if (o.toques !== undefined) {
      Object.assign(pts, { D, F, K });
      Object.assign(ver, { D: { lado: 270, desde: o.toques }, F: { lado: 180, desde: o.toques }, K: { lado: 30, desde: o.toques } });
      if (veI && o.radios !== null) for (const x of ['D', 'F', 'K']) segs.push(RADIO('I', x, { desde: o.radios === undefined ? o.toques : o.radios }));
    }
    if (o.bis !== undefined && veI) for (const v of ['A', 'B', 'C']) segs.push([v, 'I', { discontinua: true, grosor: 'fino', desde: o.bis }]);
    const regiones = o.partes !== undefined ? [['B', 'C'], ['C', 'A'], ['A', 'B']].map(([p, q], i) => ({ puntos: [p, q, 'I'], opacidad: [0.06, 0.12, 0.18][i], desde: o.partes })) : undefined;
    if (o.partes !== undefined) for (const v of ['A', 'B', 'C']) segs.push(['I', v, { grosor: 'fino', desde: o.partes }]);
    const angs = [];
    if (o.angA) angs.push({ en: 'A', de: 'B', a: 'C', texto: o.angA, color: o.angA === '?' ? undefined : 'h' });
    if (o.angBIC && veI) angs.push({ en: 'I', de: 'B', a: 'C', texto: o.angBIC, color: o.angBIC === '?' ? undefined : 'h', radio: 14 });
    const rot = o.rot || {}, lados = [], col = (k, b) => (rot[k] === '?' ? undefined : b);
    for (const [p, q, k, b] of [['A', 'F', 'AF', 'o'], ['A', 'K', 'AK', 'o'], ['B', 'F', 'BF', 'o'], ['B', 'D', 'BD', 'o'], ['C', 'D', 'CD', 'o'], ['C', 'K', 'CK', 'o'],
      ['A', 'B', 'AB'], ['A', 'C', 'AC'], ['B', 'C', 'BC'], ['I', 'D', 'r', 'i']]) if (rot[k] !== undefined) lados.push({ de: p, a: q, texto: rot[k], color: b ? col(k, b) : undefined, dist: 5, ref: k === 'r' ? 'C' : undefined, desde: (o.rotDesde || {})[k] });
    const circs = o.circ !== undefined && veI ? [{ centro: 'I', r: c.r, grosor: 'fino', desde: o.circ }] : undefined;
    const obj = o.objeto === 'parque' ? { tipo: 'parque', lamina: ['A', 'B', 'C'], franjas: [['A', 'B'], ['B', 'C'], ['C', 'A']], agua: o.circ !== undefined ? [{ centro: I, r: c.r }] : [] } : { tipo: 'examen' };
    return nt({ pts, segs, angs, circs, regiones, lados, ver, obj, alto: o.alto || 240, vista: o.vista, fijas: ['A', 'B', 'C', 'D', 'F', 'K', 'I'],
      alt: o.alt || 'Un triángulo ABC con su incentro I y su circunferencia inscrita.' });
  }
  const D_INC = 'El incentro I es el corte de las bisectrices y está a la misma distancia r de los tres lados.';
  const D_TAN = 'Las dos tangentes trazadas desde un mismo punto a una circunferencia miden igual.';
  const D_TANS = 'Desde A, las dos tangentes a la inscrita miden s − a, con a = BC y s el semiperímetro.';
  const D_SEMI = 'Semiperímetro: s = (a + b + c) ÷ 2, la mitad del perímetro.';
  const D_SRS = 'Área del triángulo: S = r · s, con r el radio de la inscrita y s el semiperímetro.';
  const D_AREA = 'Área de un triángulo: base por altura, entre 2.';
  const D_BIC = 'Las bisectrices de B y C se cortan en I con m∠BIC = 90° + m∠A ÷ 2.';
  const D_BISTEO = 'Teorema de la bisectriz: la bisectriz de B llega a AD en I, y AI/ID = AB/BD.';

  // Los 15 ejemplos (cuentas rehechas aparte: cuentas.py, idea 3): 3 cm; 4 cm; 10 cm; 30 cm²; 2 cm; 2 cm; 2 m; 45 cm²;
  // 30 cm; 105°; 3 cm; 6 cm; 12 cm; 3 cm; 76°.
  const T3 = { A: [2.6, 6], B: [0, 0], C: [8, 0] };
  const fig3 = o => figO(figIn(T3.A, T3.B, T3.C, o));
  const EJ3 = [];
  EJ3.push({ nivel: 1, titulo: 'Igual de lejos de los lados',
    enunciado: 'En el triángulo ABC, I es el incentro y está a 3 cm del lado BC. ¿A qué distancia está I del lado AB?',
    datos: [D_INC],
    solucion: [{ texto: 'I equidista de los tres lados: la distancia a AB es la misma que a BC.', ecuacion: junto(['r = ', dF('3 cm')]) }],
    respuesta: [dF('3 cm')] });
  EJ3.push({ nivel: 1, titulo: 'Dos tangentes desde A',
    figura: fig3({ I: true, circ: 0, toques: 0, radios: null, rot: { AF: '4 cm', AK: '?' }, alt: 'El triángulo ABC con su inscrita, que toca AB en F y AC en K.' }),
    enunciado: 'La circunferencia inscrita en el triángulo ABC toca AB en F y AC en K. AF = 4 cm. ¿Cuánto mide AK?',
    datos: [D_TAN],
    solucion: [{ texto: 'AF y AK son las dos tangentes que salen de A, así que miden igual:', ecuacion: junto(['AK = AF = ', dF('4 cm')]) }],
    respuesta: [junto('AK = '), dF('4 cm')] });
  EJ3.push({ nivel: 1, titulo: 'La mitad del perímetro',
    enunciado: 'Los lados de un triángulo miden 5 cm, 7 cm y 8 cm. ¿Cuánto mide su semiperímetro s?',
    datos: [D_SEMI],
    solucion: [{ texto: 'Se suman los tres lados y se toma la mitad:', ecuacion: junto(['s = (5 + 7 + 8) ÷ 2 = ', dF('10 cm')]) }],
    respuesta: [junto('s = '), dF('10 cm')] });
  EJ3.push({ nivel: 1, titulo: 'El área con el inradio',
    enunciado: 'Un triángulo tiene semiperímetro s = 15 cm y su circunferencia inscrita tiene radio r = 2 cm. ¿Cuál es su área?',
    datos: [D_SRS],
    solucion: [{ texto: 'Se multiplica el radio por el semiperímetro:', ecuacion: junto(['S = 2 · 15 = ', dF('30 cm²')]) }],
    respuesta: [junto('S = '), dF('30 cm²')] });
  EJ3.push({ nivel: 1, titulo: 'El inradio con el área',
    enunciado: 'Un triángulo tiene 24 cm² de área y semiperímetro s = 12 cm. ¿Cuánto mide el radio r de su inscrita?',
    datos: [D_SRS],
    solucion: [{ texto: 'De S = r · s se despeja r:', ecuacion: junto(['r = 24 ÷ 12 = ', dF('2 cm')]) }],
    respuesta: [junto('r = '), dF('2 cm')] });

  EJ3.push({ nivel: 2, titulo: 'La tangente desde un vértice',
    figura: fig3({ I: true, circ: 0, toques: 0, radios: null, rot: { AF: '?' }, alt: 'El triángulo ABC con su inscrita, que toca AB en F, BC en D y AC en K.' }),
    enunciado: `En el triángulo ABC, AB = 6 cm, AC = 7 cm y BC = 9 cm. La inscrita toca AB en F. ¿Cuánto mide AF?${NO_ESC}`,
    datos: [D_SEMI, D_TANS],
    solucion: [{ texto: 'Primero se halla el semiperímetro:', ecuacion: junto(['s = (6 + 7 + 9) ÷ 2 = 11']) },
      { texto: 'La tangente desde A es s menos el lado de enfrente, BC:', ecuacion: junto(['AF = 11 − 9 = ', dF('2 cm')]) }],
    respuesta: [junto('AF = '), dF('2 cm')] });
  EJ3.push({ nivel: 2, titulo: 'La pileta del parque',
    figura: figO(figIn([0, 8], [0, 0], [9, 0], { I: true, circ: 0, objeto: 'parque', rot: { AB: '8 m', BC: '6 m', AC: '10 m' }, alt: 'Un parque con forma de triángulo rectángulo en B y su pileta redonda, que toca las tres veredas.' })),
    enunciado: 'Un parque tiene forma de triángulo rectángulo con catetos de 6 m y 8 m, e hipotenusa de 10 m. ¿Cuál es el radio de la pileta más grande que cabe tocando las tres veredas?',
    datos: [D_AREA, D_SEMI, D_SRS],
    solucion: [{ texto: 'El área es 6 · 8 ÷ 2 = 24 m² y el semiperímetro, (6 + 8 + 10) ÷ 2 = 12 m.' },
      { texto: 'De S = r · s:', ecuacion: junto(['r = 24 ÷ 12 = ', dF('2 m')]) }],
    respuesta: [junto('r = '), dF('2 m')] });
  EJ3.push({ nivel: 2, titulo: 'Perímetro e inradio',
    enunciado: 'Un triángulo tiene 30 cm de perímetro y su circunferencia inscrita tiene radio 3 cm. ¿Cuál es su área?',
    datos: [D_SEMI, D_SRS],
    solucion: [{ texto: 'El semiperímetro es la mitad del perímetro:', ecuacion: junto(['s = 30 ÷ 2 = 15 cm']) },
      { texto: 'Con S = r · s, el área es el radio por el semiperímetro:', ecuacion: junto(['S = 3 · 15 = ', dF('45 cm²')]) }],
    respuesta: [junto('S = '), dF('45 cm²')] });
  EJ3.push({ nivel: 2, titulo: 'El perímetro desde las tangentes',
    figura: fig3({ I: true, circ: 0, toques: 0, radios: null, rot: { BD: '4 cm', CD: '6 cm', AF: '5 cm' }, alt: 'El triángulo ABC con su inscrita, que toca BC en D, AB en F y AC en K.' }),
    enunciado: 'La inscrita del triángulo ABC toca BC en D, AB en F y AC en K. BD = 4 cm, DC = 6 cm y AF = 5 cm. ¿Cuál es el perímetro del triángulo?',
    datos: [D_TAN],
    solucion: [{ texto: 'Desde cada vértice, las dos tangentes miden igual: BF = 4, CK = 6 y AK = 5.' },
      { texto: 'Cada tramo aparece dos veces en el contorno:', ecuacion: junto(['2 · (4 + 6 + 5) = ', dF('30 cm')]) }],
    respuesta: [dF('30 cm')] });
  EJ3.push({ nivel: 2, titulo: 'El ángulo en el incentro',
    // (Cierre del 26 nov: con m∠A = 70° el dibujo de 65° dejaba medir BIC con transportador; ningún triángulo que cupiera
    // lo alejaba más de 15 %, así que cambió el dato: con 30°, el BIC dibujado se aleja 17 %.)
    figura: fig3({ I: true, bis: 0, angA: '30°', angBIC: '?', alt: 'El triángulo ABC con sus bisectrices, que se cortan en I; m∠A = 30°.' }),
    enunciado: 'En el triángulo ABC, m∠A = 30° e I es el incentro. ¿Cuánto mide el ángulo BIC?',
    datos: [D_BIC],
    solucion: [{ texto: 'I es el cruce de las bisectrices de B y de C:', ecuacion: junto(['m∠BIC = 90° + ', dH('30°'), ' ÷ 2 = ', dF('105°')]) }],
    respuesta: [junto('m∠BIC = '), dF('105°')] });

  // Nivel 3: la correcta en D, A, C, E y B; cada incorrecta se explica por su valor.
  EJ3.push({ nivel: 3, titulo: 'Catetos de 9 y 12 cm',
    enunciado: 'Un triángulo rectángulo tiene catetos de 9 cm y 12 cm. ¿Cuánto mide el radio de su circunferencia inscrita?',
    alternativas: ['7,5 cm', '6 cm', '4,5 cm', '3 cm', '1,5 cm'],
    datos: [D_PIT, D_AREA, D_SEMI, D_SRS],
    solucion: [{ texto: 'La hipotenusa mide 15 cm (81 + 144 = 225). El área es 9 · 12 ÷ 2 = 54 cm² y s = (9 + 12 + 15) ÷ 2 = 18 cm.' },
      { texto: 'De S = r · s:', ecuacion: junto(['r = 54 ÷ 18 = ', dF('3 cm')]) },
      { texto: 'Las otras alternativas: 7,5 cm es el circunradio, 6 cm y 4,5 cm son mitades de un cateto, y 1,5 cm divide el área entre el perímetro.' }],
    respuesta: [junto('r = '), dF('3 cm')] });
  EJ3.push({ nivel: 3, titulo: 'El incentro sobre una bisectriz',
    enunciado: 'En el triángulo ABC, AB = 6 cm, AC = 9 cm y BC = 10 cm. La bisectriz AD (D en BC) mide 10 cm e I es el incentro. ¿Cuánto mide AI?',
    alternativas: ['6 cm', '5 cm', '4 cm', '7,5 cm', '6,67 cm'],
    datos: ['Teorema de la bisectriz: la bisectriz de A llega a BC en D, y BD/DC = AB/AC.', D_BISTEO],
    fuente: 'Modelo de San Marcos 2020-I (pregunta 41), con otros números.',
    solucion: [{ texto: 'Por el teorema de la bisectriz, BD : DC = 6 : 9, así que los 10 cm de BC se reparten en 4 cm y 6 cm: BD = 4 cm.' },
      { texto: 'BI es la bisectriz de B en el triángulo ABD, así que AI/ID = 6/4 = 3/2. Entonces AD = 10 cm queda en 5 partes de 2 cm:', ecuacion: junto(['AI = 3 · 2 = ', dF('6 cm')]) },
      { texto: 'Las otras alternativas: 5 cm pone a I en la mitad, 4 cm es ID, 7,5 cm parte AD en 3 : 1 y 6,67 cm la parte en 2 : 1, como el baricentro.' }],
    respuesta: [junto('AI = '), dF('6 cm')] });
  EJ3.push({ nivel: 3, titulo: 'Un lado desde las tangentes',
    enunciado: 'La inscrita del triángulo ABC toca BC en D, con BD = 5 cm y DC = 8 cm. AB = 9 cm. ¿Cuánto mide AC?',
    alternativas: ['13 cm', '17 cm', '12 cm', '4 cm', '9 cm'],
    datos: [D_TAN],
    solucion: [{ texto: 'Desde B, BF = BD = 5 cm; entonces AF = 9 − 5 = 4 cm, y desde A, AK = 4 cm.' },
      { texto: 'Desde C, CK = CD = 8 cm, y AC es la suma de AK y KC:', ecuacion: junto(['AC = 4 + 8 = ', dF('12 cm')]) },
      { texto: 'Las otras alternativas: 13 cm es BC, 17 cm suma AB y DC, 4 cm es solo AK y 9 cm copia AB.' }],
    respuesta: [junto('AC = '), dF('12 cm')] });
  EJ3.push({ nivel: 3, titulo: 'La inscrita del banderín',
    figura: figO(figIn([6, 4], [0, 0], [12, 0], { I: true, circ: 0, rot: { AB: '10 cm', AC: '10 cm', BC: '12 cm' }, alt: 'Un triángulo isósceles con AB = AC = 10 cm, BC = 12 cm y su circunferencia inscrita.' })),
    enunciado: 'Un banderín isósceles tiene AB = AC = 10 cm y BC = 12 cm. ¿Cuánto mide el radio de su circunferencia inscrita?',
    alternativas: ['6 cm', '4 cm', '8 cm', '2,4 cm', '3 cm'],
    datos: [D_ISO, D_PIT, D_AREA, D_SEMI, D_SRS],
    solucion: [{ texto: 'En el isósceles, la altura cae en el punto medio de BC: h² = 100 − 36 = 64, así que h = 8 cm y el área es 12 · 8 ÷ 2 = 48 cm².' },
      { texto: 's = (10 + 10 + 12) ÷ 2 = 16 cm:', ecuacion: junto(['r = 48 ÷ 16 = ', dF('3 cm')]) },
      { texto: 'Las otras alternativas: 6 cm es la mitad de BC, 4 cm divide 48 entre BC, 8 cm es la altura y 2,4 cm divide 48 entre AB + AC.' }],
    respuesta: [junto('r = '), dF('3 cm')] });
  EJ3.push({ nivel: 3, titulo: 'Del ángulo BIC al ángulo A',
    enunciado: 'En el triángulo ABC, I es el incentro y m∠BIC = 128°. ¿Cuánto mide el ángulo A?',
    alternativas: ['38°', '76°', '52°', '64°', '104°'],
    datos: [D_BIC],
    solucion: [{ texto: 'Se iguala: 90° + m∠A ÷ 2 = 128°, así que m∠A ÷ 2 = 38°.' },
      { texto: 'El ángulo A es el doble de esa mitad:', ecuacion: junto(['m∠A = 2 · 38° = ', dF('76°')]) },
      { texto: 'Las otras alternativas: 38° es la mitad de A, 52° es 180° − 128°, 64° es la mitad de 128° y 104° es 180° − 76°.' }],
    respuesta: [junto('m∠A = '), dF('76°')] });

  // La pileta de la predicción: AB = 7 m, AC = 8 m, BC = 9 m (B en el origen, C a la derecha).
  // Se dibuja con otras proporciones (A más a la derecha): así AF no se puede medir en la figura.
  const LA = [6.6, 5.6], LB = [0, 0], LC = [9, 0];
  const PRED3 = 'En otro parque, AB = 7 m, AC = 8 m y BC = 9 m. La pileta más grande toca AB en F y AC en K. ¿Cuánto mide AF?' + NO_ESC;
  // Un jardín dibujado de modo que AF no se lea con regla: con la escala de cualquiera de los tres lados del enunciado, el
  // AF del dibujo se aleja más de 15 % del de verdad (cierre del 26 nov: con un triángulo fijo, el isósceles 10, 15, 15
  // dejaba F en el punto medio y AF = 5 se medía).
  const FORMAS3 = [[2.6, 6], [1, 4], [5.5, 4], [4, 7], [0.6, 6], [6.5, 5], [3, 3], [1.8, 7.5], [7, 6.5]];
  function sinMedirAF(c, b, a, af) {
    for (const A of FORMAS3) {
      const B = [0, 0], C = [8, 0], k = centrosDe(A, B, C), F = U.pie(k.I, A, B), afD = U.dist(A, F);
      if ([[c, k.c], [b, k.b], [a, k.a]].every(([v, d]) => Math.abs(afD * v / d - af) / af > 0.15)) return { A, B, C };
    }
    return { A: FORMAS3[0], B: [0, 0], C: [8, 0] };
  }
  function resuelveIn(s) {
    const r = azar(s + 900), t = s % 3;
    if (t === 0) {
      for (;;) {
        const a = r.ent(6, 16), b = r.ent(5, 15), c = r.ent(5, 15);
        if ((a + b + c) % 2 || !(a < b + c && b < a + c && c < a + b) || b === c) continue;
        const sp = (a + b + c) / 2;
        return {
          enunciado: `Un jardín triangular ABC tiene AB = ${c} m, AC = ${b} m y BC = ${a} m. Una pileta redonda toca sus tres bordes; toca AB en F. ¿Cuánto mide AF?${NO_ESC}`,
          datos: [D_SEMI, D_TANS],
          dibujo: (() => { const t = sinMedirAF(c, b, a, sp - a); return figO(figIn(t.A, t.B, t.C, { I: true, circ: 0, toques: 0, radios: null, objeto: 'parque', rot: { AF: '?' }, alt: 'Un jardín triangular ABC con su pileta, que toca AB en F, BC en D y AC en K.' })); })(),
          pasos: [
            { tipo: 'pide', texto: 'Piden AF: la tangente que sale de la esquina A hasta la pileta.' },
            { tipo: 'datos', texto: `Los tres lados miden ${c} m, ${b} m y ${a} m, y el que está frente a A es BC = ${a} m.` },
            { tipo: 'regla', texto: 'Desde cada vértice, las dos tangentes miden igual, y la de A mide el semiperímetro menos el lado opuesto.', ecuacion: junto([dO('AF'), ' = s − a']) },
            { tipo: 'cuentas', texto: 'Primero se halla el semiperímetro, y después se le resta BC.', ecuacion: junto([`s = ${a + b + c} ÷ 2 = ${sp}`, FL, `AF = ${sp} − ${a} = `, dF(m_(sp - a))]) },
            { tipo: 'sentido', texto: `Las otras tangentes miden BF = ${sp - b} y CK = ${sp - c}, y AF + BF = ${sp - a} + ${sp - b} = ${c}, que es AB.` },
          ],
          respuesta: [junto('AF = '), dF(m_(sp - a))],
        };
      }
    }
    if (t === 1) {
      const [p, q, h] = r.de([[6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25]]), S = p * q / 2, sp = (p + q + h) / 2;
      return {
        enunciado: `Una cartulina con forma de triángulo rectángulo tiene catetos de ${p} cm y ${q} cm, e hipotenusa de ${h} cm. ¿Cuál es el radio del círculo más grande que se puede recortar de ella?`,
        datos: [D_AREA, D_SEMI, D_SRS],
        pasos: [
          { tipo: 'pide', texto: 'Piden r: el círculo más grande toca los tres bordes, así que es la circunferencia inscrita.' },
          { tipo: 'datos', texto: `Los catetos miden ${p} cm y ${q} cm, y la hipotenusa, ${h} cm.` },
          { tipo: 'regla', texto: 'El área del triángulo es el radio de la inscrita por el semiperímetro.', ecuacion: junto(['S = ', dI('r'), ' · s']) },
          { tipo: 'cuentas', texto: 'Se calculan el área y el semiperímetro, y después se divide el área entre s.', ecuacion: junto([`S = ${S}`, Y, `s = ${sp}`, FL, `r = ${S} ÷ ${sp} = `, dF(cm(S / sp))]) },
          { tipo: 'sentido', texto: `r = ${fm(S / sp)} cm es menor que la mitad del cateto menor, ${fm(p / 2)} cm: el círculo cabe.` },
        ],
        respuesta: [junto('r = '), dF(cm(S / sp))],
      };
    }
    const bd = r.ent(3, 9), dc = r.ent(3, 9), af = r.ent(2, 8);
    return {
      enunciado: `La inscrita del triángulo ABC toca BC en D, AB en F y AC en K. BD = ${bd} cm, DC = ${dc} cm y AB = ${bd + af} cm. ¿Cuánto mide AC?`,
      datos: [D_TAN],
      dibujo: figO(figIn(T3.A, T3.B, T3.C, { I: true, circ: 0, toques: 0, radios: null, rot: { BD: `${bd} cm`, CD: `${dc} cm` }, alt: 'El triángulo ABC con su inscrita, que toca BC en D, AB en F y AC en K.' })),
      pasos: [
        { tipo: 'pide', texto: 'Piden AC, que se arma con dos tangentes: AK y KC.' },
        { tipo: 'datos', texto: `BD = ${bd} cm, DC = ${dc} cm y AB = ${bd + af} cm.` },
        { tipo: 'regla', texto: 'Desde cada vértice, las dos tangentes a la inscrita miden igual.', ecuacion: junto(['BF = BD', Y, 'AF = AK', Y, 'CK = CD']) },
        { tipo: 'cuentas', texto: 'Primero se halla AF, que es AB menos BF, y después AC = AK + KC.', ecuacion: junto([`AF = ${bd + af} − ${bd} = ${af}`, FL, `AC = ${af} + ${dc} = `, dF(cm(af + dc))]) },
        { tipo: 'sentido', texto: `El perímetro es 2 · (${bd} + ${dc} + ${af}) = ${2 * (bd + dc + af)} cm: cada tangente cuenta dos veces.` },
      ],
      respuesta: [junto('AC = '), dF(cm(af + dc))],
    };
  }
  // «Ahora tú» de la idea 3. Tipos: la tangente s − a; r = S/s; el área S = r · s; r de un rectángulo con s − c; un lado
  // desde las tangentes.
  function casoTan(r) {
    for (;;) {
      const a = r.ent(5, 15), b = r.ent(5, 15), c = r.ent(5, 15);
      if ((a + b + c) % 2 || !(a < b + c && b < a + c && c < a + b) || new Set([a, b, c]).size < 3) continue;
      const s = (a + b + c) / 2;
      return { pregunta: `En el triángulo ABC, AB = ${c} cm, AC = ${b} cm y BC = ${a} cm. La inscrita toca AB en F. ¿Cuánto mide AF?`,
        datos: [D_SEMI, D_TANS],
        opciones: ops(s - a, [
          { id: 'mitad', valor: c / 2, error: 'GE-IN1', siFuera: 'Buscar el punto de contacto está bien, pero F no es el punto medio de AB.' },
          { id: 'otro', valor: s - b, error: 'GE-IN2', siFuera: `Usar s está bien, y s = ${s}, pero a s se le resta el lado que está frente a A, que es BC.` },
          { id: 's', valor: s, error: 'GE-IN3', siFuera: `${s} cm es el semiperímetro, pero falta restarle BC.` },
          { id: 'medioOp', valor: a / 2, error: 'GE-IN1', siFuera: 'Mirar el lado de enfrente está bien, pero se le resta a s, no se parte por la mitad.' },
        ], cm),
        solucion: { texto: `s = ${a + b + c} ÷ 2 = ${s}, y la tangente desde A es s menos BC.`, ecuacion: junto([`AF = ${s} − ${a} = `, dF(cm(s - a))]) } };
    }
  }
  const TRIPLES = [[6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25], [15, 20, 25], [10, 24, 26]];
  function casoInradio(r) {
    const [p, q, h] = r.de(TRIPLES), S = p * q / 2, sp = (p + q + h) / 2;
    return { pregunta: `Un triángulo rectángulo tiene catetos de ${p} cm y ${q} cm, e hipotenusa de ${h} cm. ¿Cuánto mide el radio de su inscrita?`,
      datos: [D_AREA, D_SEMI, D_SRS],
      opciones: ops(S / sp, [
        { id: 'perim', valor: S / (2 * sp), error: 'GE-IN4', siFuera: 'Usar S = r · s está bien, pero s es la mitad del perímetro, no el perímetro.' },
        { id: 'R', valor: h / 2, error: 'GE-IN5', siFuera: `${fm(h / 2)} cm es el circunradio, la mitad de la hipotenusa; piden el de la inscrita.` },
        { id: 'sinMitad', valor: 2 * S / sp, error: 'GE-IN6', siFuera: 'Dividir entre s está bien, pero el área es base por altura entre 2.' },
      ], cm),
      solucion: { texto: `El área es S = ${p} · ${q} ÷ 2 = ${S} y s = ${sp}; r es S entre s.`, ecuacion: junto([`r = ${S} ÷ ${sp} = `, dF(cm(S / sp))]) } };
  }
  function casoAreaIn(r) {
    const rr = r.ent(2, 6), P = 2 * r.ent(8, 25);
    return { pregunta: `Un triángulo tiene ${P} cm de perímetro y su inscrita tiene radio ${rr} cm. ¿Cuál es su área?`,
      datos: [D_SEMI, D_SRS],
      opciones: ops(rr * P / 2, [
        { id: 'perim', valor: rr * P, error: 'GE-IN4', siFuera: 'Multiplicar r está bien, pero se multiplica por el semiperímetro, no por el perímetro.' },
        { id: 'cuarto', valor: rr * P / 4, error: 'GE-IN6', siFuera: 'Usar s = P ÷ 2 está bien, pero después no hay que dividir entre 2 otra vez.' },
        { id: 's', valor: P / 2, error: 'GE-IN3', siFuera: `${P / 2} cm es el semiperímetro, pero falta multiplicarlo por r.` },
      ], cm2),
      solucion: { texto: `El semiperímetro es s = ${P} ÷ 2 = ${P / 2}, y el área es r por s.`, ecuacion: junto([`S = ${rr} · ${P / 2} = `, dF(cm2(rr * P / 2))]) } };
  }
  function casoPoncelet(r) {
    const [p, q, h] = r.de(TRIPLES), k = r.de([1, 2]), a = p * k, b = q * k, c = h * k, sp = (a + b + c) / 2;
    return { pregunta: `Un triángulo es rectángulo en B, con AB = ${a} cm, BC = ${b} cm y AC = ${c} cm. ¿Cuánto mide el radio de su inscrita?`,
      datos: [D_SEMI, D_TANS, 'En el ángulo recto, los dos radios a los puntos de contacto y las dos tangentes desde B forman un cuadrado.'],
      opciones: ops(sp - c, [
        { id: 'R', valor: c / 2, error: 'GE-IN5', siFuera: `${fm(c / 2)} cm es el circunradio, pero piden el radio de la inscrita.` },
        { id: 's', valor: sp, error: 'GE-IN3', siFuera: `${sp} cm es el semiperímetro, pero falta restarle la hipotenusa.` },
        { id: 'otro', valor: sp - a, error: 'GE-IN2', siFuera: `Usar s − lado está bien, pero desde B se resta el lado de enfrente, AC.` },
      ], cm),
      solucion: { texto: `Con s = ${sp}, la tangente desde B mide s − AC, y en el ángulo recto esa tangente es igual a r.`, ecuacion: junto([`r = ${sp} − ${c} = `, dF(cm(sp - c))]) } };
  }
  function casoLadoTan(r) {
    const bd = r.ent(2, 9), dc = r.ent(2, 9), af = r.ent(2, 9);
    return { pregunta: `La inscrita del triángulo ABC toca BC en D, AB en F y AC en K. BD = ${bd} cm, DC = ${dc} cm y AB = ${bd + af} cm. ¿Cuánto mide AC?`,
      datos: [D_TAN],
      opciones: ops(af + dc, [
        { id: 'bc', valor: bd + dc, error: 'GE-IN7', siFuera: `${bd + dc} cm es BC, pero AC se arma con AK y KC.` },
        { id: 'suma', valor: bd + af + dc, error: 'GE-IN7', siFuera: 'Usar CK = CD está bien, pero a AB hay que restarle BF antes de sumar.' },
        { id: 'ak', valor: af, error: 'GE-IN7', siFuera: `AK = ${af} cm está bien, pero falta sumarle KC = ${dc} cm.` },
        { id: 'ab', valor: bd + af, error: 'GE-IN7', siFuera: `${bd + af} cm es AB, y AC no tiene por qué medir lo mismo.` },
      ], cm),
      solucion: { texto: `BF = BD = ${bd}, así que AF = AK = ${af}; además, CK = CD = ${dc}.`, ecuacion: junto([`AC = ${af} + ${dc} = `, dF(cm(af + dc))]) } };
  }
  // Cuántas veredas toca la pileta y cuánto le falta (para la lectura).
  function toques(P, rr) {
    const d = LADOS_J.map(([k, X, Y]) => [k, aRecta(P, X, Y)]);
    if (!dentroDe(P, JA, JB, JC)) return 'El centro P quedó fuera del parque.';
    const sale = d.filter(([, x]) => x < rr - 1e-9).map(([k]) => k), toca = d.filter(([, x]) => Math.abs(x - rr) < 1e-9).map(([k]) => k);
    if (sale.length) return `Se sale por ${sale.join(' y ')}: el borde pisa la vereda.`;
    if (toca.length === 3) return 'Toca las tres veredas: P está a r de cada lado.';
    const falta = d.filter(([, x]) => x > rr + 1e-9).sort((u, w) => u[1] - w[1])[0];
    return toca.length ? `Toca ${toca.join(' y ')}; a ${falta[0]} le faltan ${m_(falta[1] - rr)}.` : `No toca ninguna; a ${falta[0]} le faltan ${m_(falta[1] - rr)}.`;
  }
  const ideaIncentro = {
    id: 'incentro',
    titulo: 'El incentro y la inscrita',
    pregunta: '¿Dónde cabe la pileta más grande de un parque triangular?',
    temas: ['Baricentro, incentro, circuncentro, ortocentro y excentro', 'Propiedades de los puntos notables'],
    pieza: GO,
    aprendizaje: 'Las bisectrices se cortan en el incentro I, a distancia r de los tres lados; desde A, las tangentes miden s − a.',
    actividad: 'Ubicar y agrandar una pileta redonda hasta que toque las tres veredas de un parque.',
    // Lee: distancia a un lado (a escuadra) y la bisectriz que equidista de los lados; no dice cuánto mide una tangente.
    lee: {
      tarjetas: [
        { titulo: 'Un parque y su pileta', texto: 'En un parque triangular se quiere la pileta redonda más grande posible, sin pisar ninguna vereda. P es su centro y r, su radio.',
          pieza: GO, dibujo: figO(figParque([5, 4], 2)) },
        { titulo: 'La distancia a un lado', texto: 'La distancia de un punto a una vereda se mide a escuadra, por el camino más corto. Además, cada punto de una bisectriz está igual de lejos de los dos lados de su ángulo.' },
        // Apertura (28 nov): el doblez de lado sobre lado es la bisectriz. No dice cuánto mide una tangente (la predicción).
        { titulo: 'Doblar lado sobre lado', texto: 'Con papel también puedes marcar una bisectriz: dobla el triángulo por la esquina A de modo que el lado AB quede a lo largo del lado AC. Al desdoblar, la raya del doblez parte el ángulo A en dos ángulos iguales, porque esas dos partes quedaron una encima de la otra: es la bisectriz de A.' },
        { titulo: 'Qué mirar al jugar', texto: 'Mueve el centro P y cambia el radio r. La lectura dice qué veredas toca la pileta y cuánto le falta para tocar la siguiente.' },
      ],
    },
    ejemplos: EJ3,
    juega: {
      pieza: GO,
      consigna: 'Un parque triangular mide 12 m, 16 m y 20 m por lado. Su pileta redonda no puede pisar ninguna vereda.',
      mision: { texto: 'Ubica y agranda la pileta hasta que toque las tres veredas.', logrado: v => v.px === JI[0] && v.py === JI[1] && v.r === JR,
        bien: 'Listo: es la pileta más grande que cabe, y su centro equidista de los tres lados.' },
      voz: 'Primero acerca la pileta a dos veredas; después agrándala.',
      leyenda: [
        { s: 'A, B, C', t: 'las esquinas del parque' },
        { s: dO('P'), t: 'el centro de la pileta' },
        { s: dI('r'), t: 'el radio de la pileta' },
      ],
      controles: [
        { id: 'px', etiqueta: 'P a lo ancho', min: 0, max: 12, paso: 1, inicio: 5, unidad: 'm', decimales: 0, color: 'c-o' },
        { id: 'py', etiqueta: 'P a lo alto', min: 0, max: 16, paso: 1, inicio: 6, unidad: 'm', decimales: 0, color: 'c-o' },
        { id: 'r', etiqueta: 'r, el radio', min: 1, max: 6, paso: 0.5, inicio: 2, unidad: 'm', decimales: 1, color: 'c-i' },
      ],
      dibujo: v => ({ datos: figParque([v.px, v.py], v.r), estado: {} }),
      arrastres: [{ id: 'pileta', etiqueta: 'centro de la pileta', color: 'c-o',
        donde: v => enPantalla(figParque([v.px, v.py], v.r), [v.px, v.py]),
        mover: (p, v) => { const q = alPlano(figParque([v.px, v.py], v.r), p); return { px: q[0], py: q[1] }; } }],
      lectura: v => [toques([v.px, v.py], v.r)],
      minimo: 3,
    },
    predice: {
      pregunta: PRED3,
      datos: ['AB = 7 m, AC = 8 m y BC = 9 m.'],
      voz: 'Desde A salen dos tramos hasta la pileta. ¿Cuánto mide cada uno?',
      opciones: [
        { id: 'c', texto: '3 m', correcta: true },
        { id: 'mitadAB', texto: '3,5 m', error: 'GE-IN1', siFuera: 'Buscar F sobre AB es correcto, pero la pileta no toca AB en su punto medio.' },
        { id: 'mitadBC', texto: '4,5 m', error: 'GE-IN1', siFuera: 'Mirar el lado de enfrente, BC, es buena idea, pero AF no sale de partirlo por la mitad.' },
        { id: 'mitadAC', texto: '4 m', error: 'GE-IN1', siFuera: 'AF y AK miden igual, es cierto, pero ninguno es la mitad de AC.' },
      ],
      dibujo: figO(figIn(LA, LB, LC, { I: true, circ: 0, toques: 0, radios: null, objeto: 'parque', alt: 'Otro parque ABC con su pileta, que toca AB en F, BC en D y AC en K.' })),
      revelar: figO(figIn(LA, LB, LC, { I: true, circ: 0, toques: 0, radios: null, objeto: 'parque', rot: { AF: '3 m', AK: '3 m' }, alt: 'El mismo parque: AF = AK = 3 m.' })),
      coincide: 'Coincide: AF = AK = 3 m. Desde B quedan 4 m y desde C, 5 m.',
      noCoincide: 'Revisemos: desde A, las dos tangentes miden x; desde B miden 7 − x, y desde C, 8 − x. Como (7 − x) + (8 − x) = 9, sale x = 3 m.',
    },
    mira: {
      pieza: GO,
      datos: figIn(LA, LB, LC, { I: 1, bis: 1, circ: 0, toques: 0, radios: 1, objeto: 'parque', partes: 6, rot: { AF: 'x', AK: 'x', BF: '7 − x', BD: '7 − x', CD: '8 − x', CK: '8 − x', r: 'r' },
        rotDesde: { AF: 2, AK: 2, BF: 3, BD: 3, CD: 3, CK: 3, r: 1 }, alt: 'El parque con su pileta: las bisectrices se cortan en I; las tangentes desde A miden x, desde B 7 − x y desde C 8 − x.' }),
      voz: 'Primero el centro; después, los tramos de las tangentes.',
      pasos: [
        { estado: { corte: 0 }, texto: 'La pileta toca las veredas en D, F y K.' },
        { estado: { corte: 1 }, texto: 'Su centro equidista de los tres lados, así que está en las tres bisectrices: es el incentro I.', ecuacion: junto([dI('ID'), ' = ', dI('IF'), ' = ', dI('IK'), ' = ', dI('r')]) },
        { estado: { corte: 2 }, texto: 'Los dos tramos que van de A a la pileta, las tangentes, miden igual: AF = AK = x.' },
        { estado: { corte: 3 }, texto: 'Entonces las tangentes desde B miden 7 − x, y las tangentes desde C, 8 − x.' },
        { estado: { corte: 4 }, texto: 'BD y DC juntas forman BC, que mide 9 m, y de ahí sale x.', ecuacion: junto(['(7 − x) + (8 − x) = 9', FL, 'x = 3']) },
        { estado: { corte: 5 }, texto: 'En general, la tangente desde A es el semiperímetro menos BC.', ecuacion: junto([dO('AF'), ' = s − a = 12 − 9 = 3']) },
        { estado: { corte: 6 }, texto: 'Al unir I con los vértices salen tres triángulos de altura r, y sus áreas suman r · s.', ecuacion: junto(['S = ', dI('r'), ' · s']) },
      ],
    },
    regla: {
      texto: 'Las tres bisectrices se cortan en el incentro I, que siempre queda dentro y a la misma distancia r de los tres lados. Desde cada vértice, las dos tangentes a la inscrita miden igual, y el área es r por s.',
      ecuacion: [junto([dO('AF'), ' = ', dO('AK'), ' = s − a']), Y, junto(['S = ', dI('r'), ' · s'])],
      condicion: 'a es el lado BC, opuesto a A; s es la mitad del perímetro, y S, el área del triángulo. En el dibujo, x = s − a = 12 − 9 = 3.',
      voz: 'Para una tangente, resta del semiperímetro el lado de enfrente.',
    },
    resuelve: { pieza: GO, generar: resuelveIn },
    ahoraTu: {
      pieza: GO,
      voz: 'Ubica las tangentes iguales antes de sumar o restar.',
      generar(s) { return conCuatro([casoTan, casoInradio, casoAreaIn, casoPoncelet, casoLadoTan][s % 5], azar(s + 7), firmasDe(EJ3, [PRED3])); },
    },
  };

  // ======================= Idea 4: el ortocentro =======================
  // Objeto de la primera pantalla: tres pueblos unidos por tres carreteras rectas (escena «notable», tipo «pueblos»;
  // dibujo de prueba). Coordenadas en kilómetros: B(0, 0), C(12, 0) y el pueblo A, que se mueve.
  // Cambia: dónde está A (siempre acutángulo o rectángulo). · Permanece: B y C. · Progresa: dónde se cruzan las trochas. ·
  // Se reserva: el obtusángulo (la predicción). · Debe verse: las tres trochas más cortas, cada una a escuadra con su
  // carretera, pasan por un mismo punto H.
  const OB = [0, 0], OC = [12, 0];
  // Pie de la altura desde V sobre la recta XY.
  const pieDe = (V, X, Y) => U.pie(V, X, Y);
  // Una figura con las tres alturas. o: { H: corte | true, alt: { A, B, C: corte } (cada altura; con prolongar, la recta
  //   entera hasta H), prolongar: true, objeto: 'pueblos' | 'examen', angA, angBHC, angHBC, angC, rot, alt, vista, alto }
  function figOrto(A, B, C, o = {}) {
    const c = centrosDe(A, B, C), H = c.H;
    const pts = { A, B, C };
    const ver = { A: { lado: 90 }, B: { lado: 225 }, C: { lado: 315 } };
    const segs = [['A', 'B'], ['B', 'C'], ['C', 'A']];
    const veH = o.H !== undefined && o.H !== false;
    if (veH) { pts.H = H; ver.H = { desde: typeof o.H === 'number' ? o.H : 0, lado: o.ladoH === undefined ? 200 : o.ladoH }; }
    const angs = [];
    const al = o.alt_ || o.alturas || {};
    for (const [v, X, Y, k] of [['A', B, C, 'a'], ['B', C, A, 'b'], ['C', A, B, 'c']]) {
      if (al[v] === undefined) continue;
      const V = { A, B, C }[v], P = pieDe(V, X, Y), id = `Q${k}`;
      pts[id] = P; ver[id] = { desde: al[v] };
      const [x, y] = { A: ['B', 'C'], B: ['C', 'A'], C: ['A', 'B'] }[v];
      // La recta del lado, prolongada hasta el pie si cae afuera.
      const dentroLado = U.dist(P, X) + U.dist(P, Y) <= U.dist(X, Y) + 1e-6;
      if (!dentroLado) segs.push([U.dist(P, X) < U.dist(P, Y) ? x : y, id, { discontinua: true, grosor: 'fino', desde: al[v] }]);
      if (U.dist(V, P) > 1e-6) {
        segs.push([v, id, { grosor: 'fino', desde: al[v] }]);
        angs.push({ en: id, de: U.dist(P, X) > 1e-6 ? x : y, a: v, desde: al[v], radio: 9 });
        if (veH && o.prolongar && U.dist(H, V) > 1e-6) {
          const tH = ((H[0] - V[0]) * (P[0] - V[0]) + (H[1] - V[1]) * (P[1] - V[1])) / U.dist(V, P) ** 2;
          if (tH > 1 + 1e-6) segs.push([id, 'H', { discontinua: true, grosor: 'fino', desde: Math.max(al[v], typeof o.H === 'number' ? o.H : 0) }]);
          if (tH < -1e-6) segs.push([v, 'H', { discontinua: true, grosor: 'fino', desde: Math.max(al[v], typeof o.H === 'number' ? o.H : 0) }]);
        }
      }
    }
    // Un ángulo con «true» lleva su arco en carmín, sin rótulo (la regla).
    const tx = x => (x === true ? undefined : x);
    if (o.angA) angs.push({ en: 'A', de: 'B', a: 'C', texto: tx(o.angA), color: o.angA === '?' ? undefined : 'h' });
    if (o.angC) angs.push({ en: 'C', de: 'A', a: 'B', texto: o.angC, color: o.angC === '?' ? undefined : 'h' });
    if (o.angBHC && veH) angs.push({ en: 'H', de: 'B', a: 'C', texto: tx(o.angBHC), color: o.angBHC === '?' ? undefined : 'h', radio: 14, marcas: 2 });
    if (o.angHBC && veH) { segs.push(['B', 'H', { grosor: 'fino' }]); angs.push({ en: 'B', de: 'C', a: 'H', texto: o.angHBC, color: o.angHBC === '?' ? undefined : 'h', radio: 24 }); }
    if (o.angBHC && veH) segs.push(['B', 'H', { grosor: 'fino' }], ['C', 'H', { grosor: 'fino' }]);
    const lados = [];
    for (const [p, q, k] of [['A', 'B', 'AB'], ['B', 'C', 'BC'], ['A', 'C', 'AC']]) if ((o.rot || {})[k] !== undefined) lados.push({ de: p, a: q, texto: o.rot[k], dist: 5 });
    const xs = Object.values(pts).map(p => p[0]), ys = Object.values(pts).map(p => p[1]);
    const sp = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) * 0.14;
    const vista = o.vista || { x: [Math.min(...xs) - sp, Math.max(...xs) + sp], y: [Math.min(...ys) - sp, Math.max(...ys) + sp] };
    const obj = o.objeto === 'pueblos' ? { tipo: 'pueblos', casas: ['A', 'B', 'C'], franjas: [['A', 'B'], ['B', 'C'], ['C', 'A']] } : { tipo: 'examen' };
    return nt({ pts, segs, angs, lados, ver, obj, vista, alto: o.alto || 240, letra: { Qa: null, Qb: null, Qc: null }, fijas: ['A', 'B', 'C', 'H'],
      manija: o.manija, alt: o.alt || 'Un triángulo ABC con sus alturas y su ortocentro H.' });
  }
  const figPueblos = A => figOrto(A, OB, OC, { H: true, alturas: { A: 0, B: 0, C: 0 }, objeto: 'pueblos', manija: 'A', vista: { x: [-2.5, 14.5], y: [-2, 11.6] }, alto: 240,
    alt: 'Tres pueblos A, B y C unidos por carreteras rectas; de cada pueblo sale la trocha más corta a la carretera de enfrente, y las tres se cruzan en H.' });
  const D_ORTO = 'El ortocentro H es el corte de las alturas: cada altura es perpendicular a la recta del lado opuesto.';
  const D_BHC = 'En un triángulo acutángulo, m∠BHC = 180° − m∠A.';
  const D_LUGARH = 'H queda dentro de un acutángulo, en el vértice recto de un rectángulo y fuera de un obtusángulo.';
  const D_CUAD = 'Los cuatro ángulos de un cuadrilátero suman 360°.';
  const D_ALTH = 'La recta que une un vértice con el ortocentro es la altura de ese vértice.';

  // Los 15 ejemplos (cuentas rehechas aparte: cuentas.py, idea 4): 150° (antes 130°, cierre del 26 nov); en C; dentro; 70°; 55°; 144° (antes 116°); 62°; fuera;
  // 18°; 45°; 115°; 15 cm; 34°; 6 cm; 130° (el 15 rehecho en el cierre del 26 nov: A sale de B y C).
  const T4 = { A: [3, 6.5], B: [0, 0], C: [8, 0] };
  const fig4 = o => figO(figOrto(T4.A, T4.B, T4.C, o));
  const D_OPV = 'Dos ángulos opuestos por el vértice miden igual.';
  const EJ4 = [];
  EJ4.push({ nivel: 1, titulo: 'El ángulo en el ortocentro',
    // (Cierre del 26 nov: con m∠A = 50° el dibujo dejaba medir BHC; el triángulo que lo evitaba salía apretado. Con 30°, el
    // BHC dibujado se aleja 21 %.)
    figura: fig4({ H: true, alturas: { B: 0, C: 0 }, angA: '30°', angBHC: '?', alt: 'Un triángulo acutángulo ABC con las alturas desde B y C, que se cortan en H; m∠A = 30°.' }),
    enunciado: 'En el triángulo acutángulo ABC, m∠A = 30° y H es el ortocentro. ¿Cuánto mide el ángulo BHC?',
    datos: [D_BHC],
    solucion: [{ texto: 'En un acutángulo, ∠BHC y ∠A suman 180°:', ecuacion: junto(['m∠BHC = 180° − ', dH('30°'), ' = ', dF('150°')]) }],
    respuesta: [junto('m∠BHC = '), dF('150°')] });
  EJ4.push({ nivel: 1, titulo: 'Un triángulo con ángulo recto',
    enunciado: 'El triángulo ABC es rectángulo en C. ¿Dónde está su ortocentro?',
    datos: [D_ORTO],
    solucion: [{ texto: 'Los catetos CA y CB son dos alturas, porque cada uno es perpendicular al otro, y se cortan en C.', ecuacion: [dF('H está en el vértice C')] }],
    respuesta: [dF('En el vértice C')] });
  EJ4.push({ nivel: 1, titulo: '¿Dentro o fuera?',
    enunciado: 'Los ángulos de un triángulo miden 40°, 60° y 80°. ¿Dónde queda su ortocentro?',
    datos: [D_LUGARH],
    solucion: [{ texto: 'Los tres ángulos son agudos, así que el triángulo es acutángulo y H queda ', ecuacion: [dF('dentro del triángulo')] }],
    respuesta: [dF('Dentro del triángulo')] });
  EJ4.push({ nivel: 1, titulo: 'Del ángulo BHC al ángulo A',
    enunciado: 'En el triángulo acutángulo ABC, H es el ortocentro y m∠BHC = 110°. ¿Cuánto mide el ángulo A?',
    datos: [D_BHC],
    solucion: [{ texto: 'En un acutángulo, ∠BHC y ∠A suman 180°:', ecuacion: junto(['m∠A = 180° − ', dH('110°'), ' = ', dF('70°')]) }],
    respuesta: [junto('m∠A = '), dF('70°')] });
  EJ4.push({ nivel: 1, titulo: 'Una altura y la base',
    figura: fig4({ H: true, alturas: { B: 0 }, angC: '35°', angHBC: '?', alt: 'El triángulo ABC con la altura desde B, que llega a AC a escuadra; m∠C = 35°.' }),
    enunciado: 'En el triángulo acutángulo ABC, m∠C = 35° y H es el ortocentro. ¿Cuánto mide el ángulo HBC?',
    datos: [D_ORTO, D_SUMA],
    solucion: [{ texto: 'BH está sobre la altura desde B, que forma 90° con AC. En el triángulo rectángulo que queda junto a C, los dos ángulos agudos suman 90°:', ecuacion: junto(['m∠HBC = 90° − ', dH('35°'), ' = ', dF('55°')]) }],
    respuesta: [junto('m∠HBC = '), dF('55°')] });

  EJ4.push({ nivel: 2, titulo: 'Un cuadrilátero con dos rectos',
    figura: fig4({ H: true, alturas: { B: 0, C: 0 }, angA: '36°', angBHC: '?', alt: 'El triángulo ABC con las alturas desde B y C, que se cortan en H; m∠A = 36°.' }),
    enunciado: 'En el triángulo acutángulo ABC, m∠A = 36°. Las alturas desde B y desde C se cortan en H. ¿Cuánto mide el ángulo BHC?',
    datos: [D_ORTO, D_CUAD, 'Dos ángulos opuestos por el vértice miden igual.'],
    solucion: [{ texto: 'Las dos alturas forman con A y H un cuadrilátero con dos ángulos de 90°. Su ángulo en H mide 360° − 90° − 90° − 36° = 144°.' },
      { texto: 'El ángulo BHC es opuesto por el vértice a ese ángulo, así que mide lo mismo:', ecuacion: junto(['m∠BHC = ', dF('144°')]) }],
    respuesta: [junto('m∠BHC = '), dF('144°')] });
  EJ4.push({ nivel: 2, titulo: 'Desde el ángulo HBC',
    enunciado: 'En el triángulo acutángulo ABC, H es el ortocentro y m∠HBC = 28°. ¿Cuánto mide el ángulo C?',
    datos: [D_ORTO, D_SUMA],
    solucion: [{ texto: 'BH va sobre la altura desde B, que forma 90° con AC.' },
      { texto: 'En ese triángulo rectángulo, los otros dos ángulos suman 90°:', ecuacion: junto(['m∠C = 90° − ', dH('28°'), ' = ', dF('62°')]) }],
    respuesta: [junto('m∠C = '), dF('62°')] });
  EJ4.push({ nivel: 2, titulo: 'Dos ángulos dados',
    enunciado: 'Dos ángulos de un triángulo miden 25° y 50°. ¿Dónde queda su ortocentro?',
    datos: [D_SUMA, D_LUGARH],
    solucion: [{ texto: 'Primero se halla el tercer ángulo:', ecuacion: junto(['180° − 25° − 50° = 105°']) },
      { texto: ['Ese ángulo es obtuso, así que el triángulo es obtusángulo y H queda ', dF('fuera del triángulo'), '.'] }],
    respuesta: [dF('Fuera del triángulo')] });
  EJ4.push({ nivel: 2, titulo: 'La altura desde A',
    enunciado: 'En el triángulo acutángulo ABC, m∠B = 72° y H es el ortocentro. ¿Cuánto mide el ángulo HAB?',
    datos: [D_ORTO, D_SUMA],
    solucion: [{ texto: 'AH va sobre la altura desde A, que llega a BC a escuadra.' },
      { texto: 'En el triángulo rectángulo que forma con B, los dos ángulos agudos suman 90°:', ecuacion: junto(['m∠HAB = 90° − ', dH('72°'), ' = ', dF('18°')]) }],
    respuesta: [junto('m∠HAB = '), dF('18°')] });
  EJ4.push({ nivel: 2, titulo: 'El triple del ángulo A',
    enunciado: 'En el triángulo acutángulo ABC, H es el ortocentro y el ángulo BHC mide el triple del ángulo A. ¿Cuánto mide el ángulo A?',
    datos: [D_BHC],
    solucion: [{ texto: 'Si m∠A = x, entonces m∠BHC = 3x, y suman 180°:', ecuacion: junto(['x + 3x = 180°', FL, 'x = ', dF('45°')]) }],
    respuesta: [junto('m∠A = '), dF('45°')] });

  // Nivel 3: la correcta en E, B, D, A y C; cada incorrecta se explica por su valor.
  EJ4.push({ nivel: 3, titulo: 'Ortocentro e incentro juntos',
    enunciado: 'En el triángulo acutángulo ABC, H es el ortocentro e I el incentro. Si m∠BHC = 130°, ¿cuánto mide el ángulo BIC?',
    alternativas: ['130°', '65°', '140°', '50°', '115°'],
    datos: [D_BHC, D_BIC],
    fuente: 'Modelo de San Marcos 2024-I, Medicina (pregunta 34), con otros números.',
    solucion: [{ texto: 'Con el ortocentro: m∠A = 180° − 130° = 50°.' },
      { texto: 'Con ese ángulo A, el incentro da:', ecuacion: junto(['m∠BIC = 90° + 50° ÷ 2 = ', dF('115°')]) },
      { texto: 'Las otras alternativas: 130° copia BHC, 65° es su mitad, 140° suma 90° y 50° sin dividir, y 50° es el ángulo A.' }],
    respuesta: [junto('m∠BIC = '), dF('115°')] });
  EJ4.push({ nivel: 3, titulo: 'La canaleta por el ortocentro',
    figura: figO(figOrto([9, 12], [0, 0], [25, 0], { H: true, alturas: { A: 0 }, rot: { AC: '20 cm' }, alt: 'El triángulo ABC con la recta de A por H, que llega a BC en P a escuadra.' })),
    enunciado: 'En el triángulo ABC, H es el ortocentro. La recta AH corta BC en P, con BP = 9 cm y PC = 16 cm. AC = 20 cm. ¿Cuánto mide AB?',
    alternativas: ['20 cm', '15 cm', '12 cm', '25 cm', '9 cm'],
    datos: [D_ALTH, D_PIT],
    fuente: 'Modelo de San Marcos 2026-I (pregunta 36), con otros números.',
    solucion: [{ texto: 'AP está sobre la altura desde A, así que es perpendicular a BC. En el triángulo APC, AP² = 400 − 256 = 144, así que AP = 12 cm.' },
      { texto: 'Con Pitágoras en el triángulo APB, AB² = 81 + 144 = 225, así que:', ecuacion: junto(['AB = √225 = ', dF('15 cm')]) },
      { texto: 'Las otras alternativas: 20 cm copia AC, 12 cm es AP, 25 cm es BC y 9 cm es BP.' }],
    respuesta: [junto('AB = '), dF('15 cm')] });
  EJ4.push({ nivel: 3, titulo: 'Un ángulo entre altura y lado',
    enunciado: 'En el triángulo acutángulo ABC, m∠A = 58° y m∠B = 66°. H es el ortocentro. ¿Cuánto mide el ángulo HBC?',
    alternativas: ['56°', '32°', '24°', '34°', '66°'],
    datos: [D_ORTO, D_SUMA],
    solucion: [{ texto: 'El tercer ángulo: m∠C = 180° − 58° − 66° = 56°.' },
      { texto: 'BH va sobre la altura desde B, que es perpendicular a AC:', ecuacion: junto(['m∠HBC = 90° − 56° = ', dF('34°')]) },
      { texto: 'Las otras alternativas: 56° es el ángulo C, 32° es 90° − 58°, 24° es 90° − 66° y 66° es el ángulo B.' }],
    respuesta: [junto('m∠HBC = '), dF('34°')] });
  EJ4.push({ nivel: 3, titulo: 'El ortocentro de la escuadra',
    enunciado: 'Un triángulo ABC es rectángulo en B, con AB = 6 cm y BC = 8 cm. ¿A qué distancia de A está su ortocentro?',
    alternativas: ['6 cm', '5 cm', '10 cm', '4,8 cm', '8 cm'],
    datos: [D_ORTO, D_PIT],
    solucion: [{ texto: 'Los catetos AB y BC son dos alturas y se cortan en B: el ortocentro es el vértice B.' },
      { texto: 'Como H es B, la distancia de A al ortocentro es AB:', ecuacion: junto(['AH = AB = ', dF('6 cm')]) },
      { texto: 'Las otras alternativas: 5 cm va al circuncentro y es la mitad de la hipotenusa; 10 cm es la hipotenusa, 4,8 cm es la altura a la hipotenusa y 8 cm es BC.' }],
    respuesta: [junto('AH = '), dF('6 cm')] });
  // (Cierre del 26 nov: antes daba m∠A y era el ejemplo 6 con otro número; ahora A sale primero de B y C.)
  EJ4.push({ nivel: 3, titulo: 'Desde los ángulos B y C',
    enunciado: 'En el triángulo acutángulo ABC, m∠B = 70° y m∠C = 60°. H es el ortocentro. ¿Cuánto mide el ángulo BHC?',
    alternativas: ['100°', '50°', '130°', '115°', '120°'],
    datos: [D_ORTO, D_SUMA, D_CUAD, D_OPV],
    solucion: [{ texto: 'Primero se halla el ángulo A: 180° − 70° − 60° = 50°.' },
      { texto: ['Las alturas desde B y C forman con A un cuadrilátero con dos ángulos rectos. Su ángulo en H mide ', junto('360° − 90° − 90° − 50° = 130°'), ', y es opuesto por el vértice a BHC:'], ecuacion: junto(['m∠BHC = ', dF('130°')]) },
      { texto: 'Las otras alternativas: 100° es 2 · A, la del circuncentro; 50° es el ángulo A; 115° es 90° + 50° ÷ 2, la del incentro, y 120° usa el ángulo C en lugar de A.' }],
    respuesta: [junto('m∠BHC = '), dF('130°')] });

  // La predicción: el pueblo A más allá de B, con el ángulo en B obtuso (H sale debajo de BC).
  const XA = [-3, 6], VX = { x: [-6, 14], y: [-9, 8] };
  const PRED4 = 'Ahora el pueblo A queda más allá de B, y el ángulo en B es obtuso. Prolongadas, ¿dónde se cruzan las tres trochas?';
  function resuelveOrto(s) {
    const r = azar(s + 900), t = s % 3;
    if (t === 0) {
      // Con el triángulo fijo T4 (A de unos 62°), BHC se dibuja de unos 118°: los datos lo dejan lejos, a más de 15 % (cierre
      // del 26 nov; deformar el triángulo lo dejaba muy angosto y apretaba H contra BC).
      const A = r.de([30, 32, 34, 36, 38, 40, 80, 82, 84]);
      return {
        enunciado: `En el triángulo acutángulo ABC, m∠A = ${A}°. Las alturas desde B y desde C se cortan en H. ¿Cuánto mide el ángulo BHC?${NO_ESC}`,
        datos: [D_ORTO, D_CUAD, D_OPV],
        dibujo: fig4({ H: true, alturas: { B: 0, C: 0 }, angA: `${A}°`, angBHC: '?', alt: `El triángulo ABC con las alturas desde B y C, que se cortan en H; m∠A = ${A}°.` }),
        pasos: [
          { tipo: 'pide', texto: 'Piden el ángulo BHC, que forman las dos alturas en su cruce.' },
          { tipo: 'datos', texto: `m∠A = ${A}°, y las alturas llegan a escuadra a AC y a AB.` },
          { tipo: 'regla', texto: 'Las dos alturas y los lados de A forman un cuadrilátero con dos ángulos rectos, y sus cuatro ángulos suman 360°.' },
          { tipo: 'cuentas', texto: 'Se halla el ángulo del cuadrilátero en H, y BHC mide lo mismo porque es opuesto por el vértice.', ecuacion: junto([`360° − 90° − 90° − ${A}° = `, dF(`${180 - A}°`)]) },
          { tipo: 'sentido', texto: `${180 - A}° + ${A}° = 180°, que es la regla m∠BHC = 180° − m∠A, y el ángulo sale obtuso.` },
        ],
        respuesta: [junto('m∠BHC = '), dF(`${180 - A}°`)],
      };
    }
    if (t === 1) {
      const C = r.de([30, 32, 35, 38, 40, 42, 44, 58, 62, 66, 70, 74, 78, 80]);
      return {
        enunciado: `En el triángulo acutángulo ABC, m∠C = ${C}° y H es el ortocentro. ¿Cuánto mide el ángulo HBC?${NO_ESC}`,
        datos: [D_ORTO, D_SUMA],
        dibujo: fig4({ H: true, alturas: { B: 0 }, angC: `${C}°`, angHBC: '?', alt: `El triángulo ABC con la altura desde B; m∠C = ${C}°.` }),
        pasos: [
          { tipo: 'pide', texto: 'Piden el ángulo HBC, que forman BH y el lado BC.' },
          { tipo: 'datos', texto: `Se conoce m∠C = ${C}°.` },
          { tipo: 'regla', texto: 'BH va sobre la altura desde B, que es perpendicular a AC, así que con C forma un triángulo rectángulo.' },
          { tipo: 'cuentas', texto: 'Los dos ángulos agudos de un triángulo rectángulo suman 90°.', ecuacion: junto([`m∠HBC = 90° − ${C}° = `, dF(`${90 - C}°`)]) },
          { tipo: 'sentido', texto: `${90 - C}° + ${C}° + 90° = 180°: los tres ángulos del triángulo rectángulo suman lo que deben.` },
        ],
        respuesta: [junto('m∠HBC = '), dF(`${90 - C}°`)],
      };
    }
    const [p, q, h] = r.de([[9, 12, 15], [5, 12, 13], [8, 15, 17], [12, 16, 20], [6, 8, 10]]), k = r.de([1, 2]);
    const bp = p * k, ap = q * k, ab = h * k;
    return {
      enunciado: `En el triángulo ABC, H es el ortocentro y la recta AH corta BC en P. AB = ${ab} cm y BP = ${bp} cm. ¿Cuánto mide AP?`,
      datos: [D_ALTH, D_PIT],
      pasos: [
        { tipo: 'pide', texto: 'Piden AP, el tramo de A hasta BC sobre la recta que pasa por H.' },
        { tipo: 'datos', texto: `AB = ${ab} cm y BP = ${bp} cm.` },
        { tipo: 'regla', texto: 'La recta que une A con el ortocentro es la altura desde A, así que AP es perpendicular a BC y APB es rectángulo en P.' },
        { tipo: 'cuentas', texto: 'Se usa Pitágoras en APB, con AB como hipotenusa.', ecuacion: junto([`AP² = ${ab * ab} − ${bp * bp} = ${ap * ap}`, FL, 'AP = ', dF(cm(ap))]) },
        { tipo: 'sentido', texto: `AP = ${ap} cm es menor que AB = ${ab} cm, como todo cateto frente a su hipotenusa.` },
      ],
      respuesta: [junto('AP = '), dF(cm(ap))],
    };
  }
  // «Ahora tú» de la idea 4. Tipos: ∠BHC; ∠A desde ∠BHC; ∠HBC; dónde queda H; AP por Pitágoras.
  function casoBHC(r) {
    const A = r.ent(25, 85);
    return { pregunta: `En el triángulo acutángulo ABC, m∠A = ${A}° y H es el ortocentro. ¿Cuánto mide el ángulo BHC?`,
      datos: [D_ORTO, D_CUAD, D_OPV],
      opciones: ops(180 - A, [
        { id: 'igual', valor: A, error: 'GE-OR1', siFuera: 'Ubicar el ángulo en H está bien, pero no mide lo mismo que A: los dos suman 180°.' },
        { id: 'circ', valor: 2 * A, error: 'GE-OR2', siFuera: 'El doble de A vale para el circuncentro; aquí H es el ortocentro, el cruce de las alturas.' },
        { id: 'in', valor: 90 + A / 2, error: 'GE-OR2', siFuera: '90° + A/2 vale para el incentro; aquí H es el ortocentro, el cruce de las alturas.' },
        { id: 'comp', valor: 90 - A, error: 'GE-OR3', siFuera: '90° − A es el ángulo entre una altura y un lado; piden el cruce de dos alturas.' },
      ], gra),
      solucion: { texto: 'Las alturas desde B y C forman con A un cuadrilátero con dos ángulos rectos, y su ángulo en H es opuesto por el vértice a BHC.', ecuacion: junto([`360° − 90° − 90° − ${A}° = `, dF(`${180 - A}°`)]) } };
  }
  function casoAH(r) {
    const X = r.ent(95, 155);
    return { pregunta: `En el triángulo acutángulo ABC, H es el ortocentro y m∠BHC = ${X}°. ¿Cuánto mide el ángulo A?`,
      datos: [D_ORTO, D_CUAD, D_OPV],
      opciones: ops(180 - X, [
        { id: 'mitad', valor: X / 2, error: 'GE-OR2', siFuera: 'Tomar la mitad valdría para el circuncentro; aquí H es el ortocentro.' },
        { id: 'resta90', valor: X - 90, error: 'GE-OR2', siFuera: 'Restar 90° es un paso del incentro; con el ortocentro, A y BHC suman 180°.' },
        { id: 'in', valor: 2 * (X - 90), error: 'GE-OR2', siFuera: 'Esa cuenta es la del incentro; con el ortocentro, A = 180° − BHC.' },
        { id: 'igual', valor: X > 179 ? 1 : X, error: 'GE-OR1', siFuera: 'Relacionar los dos ángulos está bien, pero suman 180°, no son iguales.' },
      ], gra),
      solucion: { texto: 'Las alturas desde B y C forman con A un cuadrilátero con dos ángulos rectos; su ángulo en H mide lo mismo que BHC, y los cuatro suman 360°.', ecuacion: junto([`m∠A = 360° − 90° − 90° − ${X}° = `, dF(`${180 - X}°`)]) } };
  }
  function casoHBC(r) {
    const C = r.ent(25, 80);
    return { pregunta: `En el triángulo acutángulo ABC, m∠C = ${C}° y H es el ortocentro. ¿Cuánto mide el ángulo HBC?`,
      datos: [D_ORTO, D_SUMA],
      opciones: ops(90 - C, [
        { id: 'copia', valor: C, error: 'GE-OR3', siFuera: 'Mirar el ángulo C está bien, pero HBC es su complemento, lo que le falta para 90°, no una copia de C.' },
        { id: 'sup', valor: 180 - C, error: 'GE-OR3', siFuera: 'Restar está bien, pero se resta de 90°, porque la altura forma un ángulo recto.' },
        { id: 'mitad', valor: C / 2, error: 'GE-OR4', siFuera: 'BH no es la bisectriz de B: es la altura, así que no parte B por la mitad.' },
      ], gra),
      solucion: { texto: 'BH va sobre la altura desde B, perpendicular a AC, así que HBC y C suman 90°.', ecuacion: junto([`90° − ${C}° = `, dF(`${90 - C}°`)]) } };
  }
  const LUGARES_H = [
    { id: 'dentro', texto: 'Dentro del triángulo', error: 'GE-OR5', siFuera: 'H queda dentro solo si los tres ángulos son agudos; calcula el tercero y revísalo.' },
    { id: 'vertice', texto: 'En el vértice del ángulo mayor', error: 'GE-OR6', siFuera: 'H queda en un vértice solo si hay un ángulo recto.' },
    { id: 'fuera', texto: 'Fuera del triángulo', error: 'GE-OR5', siFuera: 'H queda fuera solo si hay un ángulo obtuso.' },
    { id: 'medio', texto: 'En el punto medio del lado mayor', error: 'GE-OR7', siFuera: 'Ese lugar es el del circuncentro en un triángulo rectángulo, no el del ortocentro.' },
  ];
  function casoDondeH(r) {
    for (;;) {
      const b = 5 * r.ent(3, 16), c = 5 * r.ent(3, 16), x = 180 - b - c;
      if (x < 10) continue;
      const k = x > 90 ? 2 : x === 90 ? 1 : 0;
      if (k === 1 && r() < 0.6) continue;
      return { pregunta: `Dos ángulos de un triángulo miden ${b}° y ${c}°. ¿Dónde queda su ortocentro?`,
        datos: [D_SUMA, D_LUGARH],
        opciones: opsTexto(LUGARES_H[k].texto, LUGARES_H.filter((_, i) => i !== k)),
        solucion: { texto: `El tercer ángulo mide 180° − ${b}° − ${c}° = ${x}°: el triángulo es ${['acutángulo', 'rectángulo', 'obtusángulo'][k]}.`, ecuacion: [dF(LUGARES_H[k].texto)] } };
    }
  }
  function casoAP(r) {
    const [p, q, h] = r.de([[9, 12, 15], [5, 12, 13], [8, 15, 17], [12, 16, 20], [6, 8, 10], [7, 24, 25]]), k = r.de([1, 2, 3]);
    const bp = p * k, ap = q * k, ab = h * k, pc = r.ent(2, 12) + bp;
    return { pregunta: `En el triángulo ABC, H es el ortocentro y la recta AH corta BC en P. AB = ${ab} cm, BP = ${bp} cm y PC = ${pc} cm. ¿Cuánto mide AP?`,
      datos: [D_ALTH, D_PIT],
      opciones: ops(ap, [
        { id: 'suma', valor: Math.round(Math.sqrt(ab * ab + bp * bp) * 100) / 100, error: 'GE-OR8', siFuera: 'Usar Pitágoras está bien, pero AB es la hipotenusa, así que los cuadrados se restan, no se suman.' },
        { id: 'resta', valor: ab - bp, error: 'GE-OR8', siFuera: 'Restar está bien, pero se restan los cuadrados, no las medidas.' },
        { id: 'mitad', valor: (bp + pc) / 2, error: 'GE-OR9', siFuera: 'AP es la altura desde A, no la mitad de BC.' },
      ], cm),
      solucion: { texto: 'AP está sobre la altura desde A, así que APB es rectángulo en P.', ecuacion: junto([`AP² = ${ab * ab} − ${bp * bp}`, FL, 'AP = ', dF(cm(ap))]) } };
  }
  const ideaOrtocentro = {
    id: 'ortocentro',
    titulo: 'El ortocentro y las alturas',
    pregunta: '¿Dónde se cruzan los caminos más cortos a cada carretera?',
    temas: ['Baricentro, incentro, circuncentro, ortocentro y excentro', 'Propiedades de los puntos notables'],
    pieza: GO,
    aprendizaje: 'Las alturas se cortan en el ortocentro H, que queda dentro, en el vértice recto o fuera; en un acutángulo, m∠BHC = 180° − m∠A.',
    actividad: 'Mover un pueblo y mirar dónde se cruzan las tres trochas más cortas.',
    lee: {
      tarjetas: [
        { titulo: 'Tres pueblos y tres carreteras', texto: 'Tres pueblos, A, B y C, están unidos por tres carreteras rectas. De cada pueblo sale una trocha hasta la carretera de enfrente, por el camino más corto.',
          pieza: GO, dibujo: figO(figPueblos([4, 8])) },
        { titulo: 'El camino más corto', texto: 'El camino más corto de un punto a una recta llega a escuadra: es perpendicular. Por eso cada trocha es una altura del triángulo, y el cuadradito marca el ángulo recto.' },
        { titulo: 'Qué mirar al jugar', texto: 'Mueve el pueblo A. Mira dónde se cruzan las tres trochas, H, y qué tipo de ángulos tiene el triángulo.' },
      ],
    },
    ejemplos: EJ4,
    juega: {
      pieza: GO,
      consigna: 'B y C están a 12 km uno de otro, y cada pueblo tiene su trocha más corta hasta la carretera de enfrente.',
      mision: { texto: 'Mueve el pueblo A hasta que el cruce H caiga en un pueblo.', logrado: v => v.ax === 0 || v.ax === 12,
        bien: 'Listo: el ángulo en ese pueblo es recto, y dos carreteras hacen de trochas.' },
      voz: 'Lleva A hacia un costado y mira cómo se mueve H.',
      leyenda: [
        { s: 'A, B, C', t: 'los tres pueblos' },
        { s: 'H', t: 'donde se cruzan las tres trochas' },
        { s: '∟', t: 'ángulo recto: la trocha llega a escuadra' },
      ],
      controles: [
        { id: 'ax', etiqueta: 'A a lo ancho', min: 0, max: 12, paso: 1, inicio: 4, unidad: 'km', decimales: 0, color: 'c-o' },
        { id: 'ay', etiqueta: 'A a lo alto', min: 7, max: 10, paso: 1, inicio: 8, unidad: 'km', decimales: 0, color: 'c-o' },
      ],
      dibujo: v => ({ datos: figPueblos([v.ax, v.ay]), estado: {} }),
      arrastres: [{ id: 'pueblo', etiqueta: 'pueblo A', color: 'c-o',
        donde: v => enPantalla(figPueblos([v.ax, v.ay]), [v.ax, v.ay]),
        mover: (p, v) => { const q = alPlano(figPueblos([v.ax, v.ay]), p); return { ax: q[0], ay: q[1] }; } }],
      lectura: v => {
        const A = [v.ax, v.ay];
        if (v.ax === 0) return ['El ángulo en B es recto: H cae en el pueblo B.'];
        if (v.ax === 12) return ['El ángulo en C es recto: H cae en el pueblo C.'];
        return claseDe(A, OB, OC) === 'acutángulo' ? ['Los tres ángulos son agudos: H queda dentro del triángulo.'] : ['Hay un ángulo recto: H cae en ese vértice.'];
      },
      minimo: 3,
    },
    predice: {
      pregunta: PRED4,
      datos: ['B y C están a 12 km.', 'A está a 6 km de la carretera BC.', 'El pie de A sobre esa recta queda 3 km a la izquierda de B, fuera del tramo BC.'],
      voz: 'Antes el cruce quedaba adentro. ¿Y con un ángulo obtuso?',
      opciones: [
        { id: 'c', texto: 'Fuera del triángulo, más allá de B', correcta: true },
        { id: 'dentro', texto: 'Dentro del triángulo, como antes', error: 'GE-OR5', siFuera: 'Buscar el cruce de las trochas es correcto, pero con un ángulo obtuso ese cruce sale del triángulo.' },
        { id: 'vertice', texto: 'En el pueblo B, el del ángulo obtuso', error: 'GE-OR6', siFuera: 'El cruce cae en un vértice cuando ese ángulo es recto; con un ángulo obtuso, pasa de largo.' },
        { id: 'nunca', texto: 'No se cruzan: dos trochas caen fuera', error: 'D-EXT', siFuera: 'Es cierto que dos trochas caen en la prolongación de un lado, pero si se prolongan, sí se cruzan.' },
      ],
      dibujo: figO(figOrto(XA, OB, OC, { objeto: 'pueblos', alt: 'Los pueblos A, B y C: el ángulo en B es obtuso.' })),
      revelar: figO(figOrto(XA, OB, OC, { objeto: 'pueblos', H: true, prolongar: true, alturas: { A: 0, B: 0, C: 0 }, vista: VX, alto: 250, alt: 'Las tres trochas, prolongadas, se cruzan en H, fuera del triángulo, debajo de B.' })),
      coincide: 'Coincide: H queda fuera, más allá de B, debajo de la carretera BC.',
      noCoincide: 'Revisemos: las trochas de A y de C caen en las prolongaciones de los lados. Si se prolongan las tres, se cruzan en H, fuera del triángulo.',
    },
    mira: {
      pieza: GO,
      datos: figOrto(XA, OB, OC, { objeto: 'pueblos', H: 3, prolongar: true, alturas: { A: 1, C: 2, B: 4 }, vista: VX, alto: 250,
        alt: 'El triángulo con el ángulo en B obtuso: las alturas desde A y C caen en las prolongaciones; prolongadas, las tres se cortan en H, fuera.' }),
      voz: 'Una trocha por vez; las que caen fuera se prolongan.',
      pasos: [
        { estado: { corte: 0 }, texto: 'El ángulo en B es obtuso.' },
        { estado: { corte: 1 }, texto: 'El pie de la altura de A, donde llega su trocha, cae en la prolongación de CB.' },
        { estado: { corte: 2 }, texto: 'La trocha de C cae en la prolongación de AB.' },
        { estado: { corte: 3 }, texto: 'Si se prolongan, esas dos trochas se cortan en H, debajo de BC y fuera del triángulo.' },
        { estado: { corte: 4 }, texto: 'La trocha de B, prolongada, también pasa por H.' },
      ],
    },
    regla: {
      texto: 'Las tres alturas, o sus prolongaciones, se cortan en el ortocentro H. H queda dentro del acutángulo, en el vértice del ángulo recto del rectángulo y fuera del obtusángulo.',
      ecuacion: [junto(['m∠BHC = 180° − ', dH('m∠A')])],
      condicion: 'los ángulos B y C son agudos (A puede ser obtuso). Si B o C es obtuso, el ángulo BHC mide lo mismo que A.',
      voz: 'Las alturas llegan a escuadra; prolóngalas si caen fuera.',
      dibujo: fig4({ H: true, alturas: { A: 0, B: 0, C: 0 }, angA: true, angBHC: true, alt: 'Un triángulo acutángulo con sus tres alturas, que se cortan en H; el ángulo BHC (dos arcos) y el ángulo A (un arco) suman 180°.' }),
    },
    resuelve: { pieza: GO, generar: resuelveOrto },
    ahoraTu: {
      pieza: GO,
      voz: 'Busca los ángulos rectos de las alturas antes de restar.',
      generar(s) { return conCuatro([casoBHC, casoAH, casoHBC, casoDondeH, casoAP][s % 5], azar(s + 7), firmasDe(EJ4, [PRED4])); },
    },
  };

  // ======================= Idea 5: el excentro =======================
  // Objeto de la primera pantalla: el parque de la idea 3 con sus tres avenidas largas y una glorieta redonda afuera
  // (escena «notable», tipo «avenidas»; dibujo de prueba). Excentro relativo a BC: E(8, −8), radio 8 m.
  // Cambia: el centro P y el radio de la glorieta. · Permanece: el parque y sus avenidas. · Progresa: qué avenidas toca.
  // · Se reserva: cuántas circunferencias tocan las tres avenidas (la predicción). · Debe verse: la glorieta toca la
  // avenida BC y las prolongaciones de las otras dos.
  const JE = centrosDe(JA, JB, JC).E, JRA = centrosDe(JA, JB, JC).ra;
  function figAvenidas(P, rr) {
    const pts = { A: JA, B: JB, C: JC, P, '~r': [P[0] + rr, P[1]] };
    const segs = [['A', 'B', { recta: true, grosor: 'fino' }], ['B', 'C', { recta: true, grosor: 'fino' }], ['C', 'A', { recta: true, grosor: 'fino' }],
      ['A', 'B'], ['B', 'C'], ['C', 'A'], ['P', '~r', { color: 'i', grosor: 'fino' }]];
    return nt({ pts, segs, circs: [{ centro: 'P', r: rr, grosor: 'fino' }], ver: { A: { lado: 0 }, B: { lado: 200 }, C: { lado: 60 }, P: { color: 'o', lado: 225 } },
      fijas: ['A', 'B', 'C', 'P'], obj: { tipo: 'avenidas', lamina: ['A', 'B', 'C'], franjas: [['A', 'B'], ['B', 'C'], ['C', 'A']], agua: [{ centro: 'P', r: rr }] }, manija: 'P',
      vista: { x: [-5, 21], y: [-19, 18] }, alto: 260, lados: [{ de: 'P', a: '~r', texto: 'r', color: 'i', dist: 3 }],
      alt: 'El parque triangular entre tres avenidas largas, y una glorieta redonda de centro P y radio r afuera.' });
  }
  // Un triángulo con sus circunferencias tangentes a las tres rectas. o: { I, ins: corte (la inscrita), exs: { A, B, C:
  //   corte } (cada exinscrita, frente a ese vértice), bisE: corte (las bisectrices exteriores de B y C y la interior de A
  //   hasta E), T: corte (la tangente AT), rot, angA, angBEC, objeto, vista, alto, alt }
  function figEx(A, B, C, o = {}) {
    const c = centrosDe(A, B, C), pts = { A, B, C }, letra = {};
    const ver = { A: { lado: 90 }, B: { lado: 200 }, C: { lado: 340 } };
    const segs = [['A', 'B', { recta: true, grosor: 'fino' }], ['B', 'C', { recta: true, grosor: 'fino' }], ['C', 'A', { recta: true, grosor: 'fino' }], ['A', 'B'], ['B', 'C'], ['C', 'A']];
    const circs = [];
    if (o.ins !== undefined) { pts.I = c.I; ver.I = { desde: o.ins, lado: 120 }; circs.push({ centro: 'I', r: c.r, grosor: 'fino', desde: o.ins }); }
    const ex = (V, X, Y) => centrosDe(V, X, Y);
    for (const [v, [V, X, Y], nom] of [['A', [A, B, C], 'E'], ['B', [B, C, A], 'E₂'], ['C', [C, A, B], 'E₃']]) {
      const d = (o.exs || {})[v]; if (d === undefined) continue;
      const k = ex(V, X, Y), id = v === 'A' ? 'E' : `E${v}`;
      pts[id] = k.E; letra[id] = v === 'A' ? 'E' : null; ver[id] = { desde: d, lado: 300 };
      if (!o.sinCirc) circs.push({ centro: id, r: k.ra, grosor: 'fino', desde: d });
      if (v === 'A' && o.radioE !== undefined) { pts['~rE'] = pieDe(k.E, B, C); segs.push(RADIO('E', '~rE', { desde: o.radioE })); }
      void nom;
    }
    if (o.bisE !== undefined && pts.E) {
      segs.push(['B', 'E', { discontinua: true, grosor: 'fino', desde: o.bisE }], ['C', 'E', { discontinua: true, grosor: 'fino', desde: o.bisE }]);
      // bisI: null, sin la bisectriz interior de A (su trazo pasaría justo por el rótulo del ángulo A).
      if (o.bisI !== null) segs.push(['A', 'E', { discontinua: true, grosor: 'fino', desde: o.bisI === undefined ? o.bisE : o.bisI }]);
    }
    if (o.T !== undefined && pts.E) { pts.T = pieDe(c.E, A, B); ver.T = { desde: o.T, lado: 180 }; segs.push(['A', 'T', { color: 'o', grosor: 'variable', desde: o.T }]); }
    const angs = [];
    if (o.angA) angs.push({ en: 'A', de: 'B', a: 'C', texto: o.angA === true ? undefined : o.angA, color: o.angA === '?' ? undefined : 'h' });
    if (o.angBEC && pts.E) angs.push({ en: 'E', de: 'B', a: 'C', texto: o.angBEC, color: o.angBEC === '?' ? undefined : 'h', radio: 16 });
    const lados = [];
    for (const [p, q, k] of [['A', 'B', 'AB'], ['B', 'C', 'BC'], ['A', 'C', 'AC'], ['A', 'T', 'AT']]) if ((o.rot || {})[k] !== undefined) lados.push({ de: p, a: q, texto: o.rot[k], dist: 5, color: k === 'AT' && o.rot[k] !== '?' ? 'o' : undefined, desde: (o.rotDesde || {})[k], en: (o.rotEn || {})[k] });
    const obj = o.objeto === 'avenidas' ? { tipo: 'avenidas', lamina: ['A', 'B', 'C'], franjas: [['A', 'B'], ['B', 'C'], ['C', 'A']] } : { tipo: 'examen' };
    const xs = [], ys = [];
    for (const p of Object.values(pts)) { xs.push(p[0]); ys.push(p[1]); }
    for (const q of circs) { const p = pts[q.centro]; xs.push(p[0] - q.r, p[0] + q.r); ys.push(p[1] - q.r, p[1] + q.r); }
    const sp = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) * 0.06;
    const vista = o.vista || { x: [Math.min(...xs) - sp, Math.max(...xs) + sp], y: [Math.min(...ys) - sp, Math.max(...ys) + sp] };
    return nt({ pts, segs, circs, angs, lados, letra, ver, obj, vista, alto: o.alto || 250, fijas: ['A', 'B', 'C', 'I', 'E', 'T'],
      alt: o.alt || 'Un triángulo ABC con su excentro E y su circunferencia exinscrita.' });
  }
  const D_EXC = 'El excentro E relativo a BC es el corte de la bisectriz interior de A con las exteriores de B y C.';
  const D_ATS = 'La exinscrita relativa a BC toca la prolongación de AB en T, y AT = s, el semiperímetro.';
  const D_BEC = 'Las bisectrices exteriores de B y C se cortan en E con m∠BEC = 90° − m∠A ÷ 2.';
  const D_PERP = 'La bisectriz interior y la exterior de un mismo ángulo son perpendiculares.';
  const D_EXTB = 'Un ángulo interior y su exterior suman 180°; la bisectriz exterior parte el exterior en dos iguales.';

  // Los 15 ejemplos (cuentas rehechas aparte: cuentas.py, idea 5): 65°; 9 cm; 90°; 40°; tres; 5 cm; 65°; 15 cm; 7 cm;
  // 55°; 6 cm; 10 cm; 65°; 11 cm; 70° (cierre del 26 nov: el 8 pide BT = 4 cm, el 11 pide CD y el 14 pide BC).
  const T5 = { A: [2.6, 4.6], B: [0, 0], C: [6, 0] };
  const fig5 = o => figO(figEx(T5.A, T5.B, T5.C, o));
  const fig5a = (a, b, o) => { const t = triAng(a, b, 6); return figO(figEx(t.A, t.B, t.C, o)); };
  const EJ5 = [];
  EJ5.push({ nivel: 1, titulo: 'El ángulo en el excentro',
    figura: fig5a(80, 55, { exs: { A: 0 }, sinCirc: true, bisE: 0, bisI: null, angA: '50°', angBEC: '?', alt: 'El triángulo ABC con las bisectrices exteriores de B y C, que se cortan en E, fuera; m∠A = 50°.' }),
    enunciado: 'En el triángulo ABC, m∠A = 50° y E es el excentro relativo a BC. ¿Cuánto mide el ángulo BEC?',
    datos: [D_BEC],
    solucion: [{ texto: 'E es el cruce de las bisectrices exteriores de B y C:', ecuacion: junto(['m∠BEC = 90° − ', dH('50°'), ' ÷ 2 = ', dF('65°')]) }],
    respuesta: [junto('m∠BEC = '), dF('65°')] });
  EJ5.push({ nivel: 1, titulo: 'La tangente desde A',
    enunciado: 'Los lados de un triángulo ABC miden 5 cm, 6 cm y 7 cm. La exinscrita relativa a BC toca la prolongación de AB en T. ¿Cuánto mide AT?',
    datos: [D_SEMI, D_ATS],
    solucion: [{ texto: 'AT mide el semiperímetro, la mitad de la suma de los tres lados:', ecuacion: junto(['AT = (5 + 6 + 7) ÷ 2 = ', dF('9 cm')]) }],
    respuesta: [junto('AT = '), dF('9 cm')] });
  EJ5.push({ nivel: 1, titulo: 'Incentro y excentro desde B',
    enunciado: 'En el triángulo ABC, I es el incentro y E el excentro relativo a BC. ¿Cuánto mide el ángulo IBE?',
    datos: ['El incentro I está en la bisectriz interior de B; el excentro E relativo a BC, en la exterior de B.', 'Un ángulo interior y su exterior suman 180°.', 'Una bisectriz parte su ángulo en dos iguales.'],
    solucion: [{ texto: 'BI se lleva la mitad del ángulo B, y BE, la mitad de su exterior. Entre BI y BE quedan las dos mitades, y B con su exterior suman 180°:', ecuacion: junto(['m∠IBE = 180° ÷ 2 = ', dF('90°')]) }],
    respuesta: [junto('m∠IBE = '), dF('90°')] });
  EJ5.push({ nivel: 1, titulo: 'Del ángulo BEC al ángulo A',
    enunciado: 'En el triángulo ABC, E es el excentro relativo a BC y m∠BEC = 70°. ¿Cuánto mide el ángulo A?',
    datos: [D_BEC],
    solucion: [{ texto: 'Se iguala 90° − m∠A ÷ 2 = 70°, así que m∠A ÷ 2 = 20° y A es el doble:', ecuacion: junto(['m∠A = 2 · 20° = ', dF('40°')]) }],
    respuesta: [junto('m∠A = '), dF('40°')] });
  EJ5.push({ nivel: 1, titulo: 'Cuántas exinscritas',
    enunciado: '¿Cuántas circunferencias exinscritas tiene un triángulo?',
    datos: ['Una exinscrita toca un lado por fuera y las prolongaciones de los otros dos.'],
    solucion: [{ texto: 'Hay una frente a cada lado: frente a BC, frente a CA y frente a AB.', ecuacion: [dF('tres')] }],
    respuesta: [dF('Tres')] });

  EJ5.push({ nivel: 2, titulo: 'La tangente desde B',
    enunciado: 'En el triángulo ABC, AB = 7 cm, AC = 8 cm y BC = 9 cm. La exinscrita relativa a BC toca la prolongación de AB en T. ¿Cuánto mide BT?',
    datos: [D_SEMI, D_ATS],
    solucion: [{ texto: 'AT mide el semiperímetro, la mitad de la suma de los tres lados:', ecuacion: junto(['AT = (7 + 8 + 9) ÷ 2 = 12']) },
      { texto: 'B está entre A y T, así que BT = AT − AB:', ecuacion: junto(['BT = 12 − 7 = ', dF('5 cm')]) }],
    respuesta: [junto('BT = '), dF('5 cm')] });
  EJ5.push({ nivel: 2, titulo: 'Del incentro al excentro',
    enunciado: 'En el triángulo ABC, I es el incentro, E el excentro relativo a BC y m∠BIC = 115°. ¿Cuánto mide el ángulo BEC?',
    datos: [D_BIC, D_BEC],
    solucion: [{ texto: 'Con el incentro: 90° + m∠A ÷ 2 = 115°, así que m∠A ÷ 2 = 25°.' },
      { texto: 'Con esa mitad de A, el excentro da:', ecuacion: junto(['m∠BEC = 90° − 25° = ', dF('65°')]) }],
    respuesta: [junto('m∠BEC = '), dF('65°')] });
  EJ5.push({ nivel: 2, titulo: 'Desde el perímetro',
    enunciado: 'Un triángulo ABC tiene 30 cm de perímetro y AB = 11 cm. Su exinscrita relativa a BC toca la prolongación de AB en T. ¿Cuánto mide BT?',
    datos: [D_ATS, 'B está entre A y T: AT = AB + BT.'],
    solucion: [{ texto: 'AT es el semiperímetro, la mitad del perímetro:', ecuacion: junto(['AT = 30 ÷ 2 = 15 cm']) },
      { texto: 'B está entre A y T, así que a AT se le resta AB:', ecuacion: junto(['BT = 15 − 11 = ', dF('4 cm')]) }],
    respuesta: [junto('BT = '), dF('4 cm')] });
  EJ5.push({ nivel: 2, titulo: 'Un tramo de la prolongación',
    figura: fig5({ exs: { A: 0 }, T: 0, rot: { AT: '15 cm', AB: '8 cm' }, alt: 'El triángulo ABC y su exinscrita relativa a BC, que toca la prolongación de AB en T.' }),
    enunciado: 'La exinscrita relativa a BC del triángulo ABC toca la prolongación de AB en T. AT = 15 cm y AB = 8 cm. ¿Cuánto mide BT?',
    datos: ['B está entre A y T: AT = AB + BT.'],
    solucion: [{ texto: 'Se resta AB de AT:', ecuacion: junto(['BT = 15 − 8 = ', dF('7 cm')]) }],
    respuesta: [junto('BT = '), dF('7 cm')] });
  EJ5.push({ nivel: 2, titulo: 'La bisectriz exterior de B',
    enunciado: 'En el triángulo ABC, m∠B = 70° y E es el excentro relativo a BC. ¿Cuánto mide el ángulo EBC?',
    datos: [D_EXC, D_EXTB],
    solucion: [{ texto: 'El exterior de B mide 180° − 70° = 110°, y BE es su bisectriz:', ecuacion: junto(['m∠EBC = 110° ÷ 2 = ', dF('55°')]) }],
    respuesta: [junto('m∠EBC = '), dF('55°')] });

  // Nivel 3: la correcta en A, D, B, E y C; cada incorrecta se explica por su valor.
  // (Cierre del 26 nov: antes pedía AT, un paso como el ejemplo 2; ahora pide la tangente desde C, con tres pasos.)
  EJ5.push({ nivel: 3, titulo: 'Tres lados seguidos',
    enunciado: 'En el triángulo ABC, AB = 13 cm, BC = 14 cm y AC = 15 cm. La exinscrita relativa a BC toca la prolongación de AB en T y el lado BC en D. ¿Cuánto mide CD?',
    alternativas: ['6 cm', '7 cm', '8 cm', '21 cm', '14 cm'],
    datos: [D_SEMI, D_ATS, D_TAN],
    solucion: [{ texto: 'AT mide el semiperímetro: AT = (13 + 14 + 15) ÷ 2 = 21 cm, y como B está entre A y T, BT = 21 − 13 = 8 cm.' },
      { texto: 'Desde B, las dos tangentes a la exinscrita miden igual: BD = BT = 8 cm. CD es lo que queda de BC:', ecuacion: junto(['CD = 14 − 8 = ', dF('6 cm')]) },
      { texto: 'Las otras alternativas: 7 cm es s − BC, la tangente desde A a la inscrita; 8 cm es BD; 21 cm es AT, y 14 cm es BC entero.' }],
    respuesta: [junto('CD = '), dF('6 cm')] });
  EJ5.push({ nivel: 3, titulo: 'El punto medio del arco',
    enunciado: 'La bisectriz de A corta otra vez a la circunferencia circunscrita de ABC en M. I es el incentro, E el excentro relativo a BC y MI = 5 cm. ¿Cuánto mide IE?',
    alternativas: ['5 cm', '2,5 cm', '15 cm', '10 cm', '7,5 cm'],
    datos: ['M, el punto medio del arco BC que no contiene a A, cumple MB = MC = MI = ME.', 'A, I, M y E están en ese orden sobre la bisectriz de A.'],
    fuente: 'Modelo de San Marcos 2022 (pregunta 37), con otros números.',
    solucion: [{ texto: 'M está entre I y E, a 5 cm de cada uno: ME = MI = 5 cm.' },
      { texto: 'IE es la suma de los dos tramos:', ecuacion: junto(['IE = 5 + 5 = ', dF('10 cm')]) },
      { texto: 'Las otras alternativas: 5 cm es solo MI, 2,5 cm es su mitad, y 15 cm y 7,5 cm suman o parten tramos que no están en la figura.' }],
    respuesta: [junto('IE = '), dF('10 cm')] });
  EJ5.push({ nivel: 3, titulo: 'Un ángulo con dos datos',
    enunciado: 'En el triángulo ABC, E es el excentro relativo a BC, y el ángulo BEC mide 15° más que el ángulo A. ¿Cuánto mide el ángulo BEC?',
    alternativas: ['50°', '65°', '75°', '115°', '40°'],
    datos: [D_BEC],
    solucion: [{ texto: 'Si m∠A = x, entonces 90° − x ÷ 2 = x + 15°, así que 75° = 1,5x y x = 50°.' },
      { texto: 'BEC mide 15° más que A:', ecuacion: junto(['m∠BEC = 50° + 15° = ', dF('65°')]) },
      { texto: 'Las otras alternativas: 50° es el ángulo A; 75° es 90° − 15°; 115° es 90° + 25°, que sale del incentro, y 40° es 90° − 50°.' }],
    respuesta: [junto('m∠BEC = '), dF('65°')] });
  // (Cierre del 26 nov: antes pedía el perímetro, 2 · AT, un paso; ahora pide el lado BC.)
  EJ5.push({ nivel: 3, titulo: 'El lado que falta',
    figura: fig5({ exs: { A: 0 }, T: 0, rot: { AT: '14 cm', BC: '?' }, alt: 'El triángulo ABC y su exinscrita relativa a BC, que toca la prolongación de AB en T.' }),
    enunciado: 'La exinscrita relativa a BC del triángulo ABC toca la prolongación de AB en T, y AT = 14 cm. AB = 9 cm y AC = 8 cm. ¿Cuánto mide BC?',
    alternativas: ['14 cm', '23 cm', '5 cm', '6 cm', '11 cm'],
    datos: [D_ATS, 'Perímetro: la suma de los tres lados.'],
    solucion: [{ texto: 'AT es el semiperímetro: s = 14 cm, así que el perímetro mide 2 · 14 = 28 cm.' },
      { texto: 'BC es lo que les falta a AB y AC para completar el perímetro:', ecuacion: junto(['BC = 28 − 9 − 8 = ', dF('11 cm')]) },
      { texto: 'Las otras alternativas: 14 cm es s, 23 cm suma AT y AB, 5 cm es BT = 14 − 9 y 6 cm es 14 − 8, la tangente desde C.' }],
    respuesta: [junto('BC = '), dF('11 cm')] });
  EJ5.push({ nivel: 3, titulo: 'Los ángulos B y C',
    enunciado: 'En el triángulo ABC, m∠B = 60° y m∠C = 80°. E es el excentro relativo a BC. ¿Cuánto mide el ángulo BEC?',
    alternativas: ['20°', '110°', '70°', '40°', '50°'],
    datos: [D_SUMA, D_BEC],
    solucion: [{ texto: 'Primero se halla el ángulo A: 180° − 60° − 80° = 40°.' },
      { texto: 'Con el ángulo A, el excentro da:', ecuacion: junto(['m∠BEC = 90° − 40° ÷ 2 = ', dF('70°')]) },
      { texto: 'Las otras alternativas: 20° es la mitad de A; 110° es 90° + 20°, que sale del incentro; 40° es el ángulo A, y 50° es el ángulo ECB.' }],
    respuesta: [junto('m∠BEC = '), dF('70°')] });

  const PRED5 = 'Una pileta redonda dentro del parque y la glorieta de afuera tocan, las dos, las tres avenidas. Contando estas dos, ¿cuántas circunferencias tocan las tres avenidas a la vez?';
  function resuelveEx(s) {
    const r = azar(s + 900), t = s % 3;
    if (t === 0) {
      for (;;) {
        const a = r.ent(6, 16), b = r.ent(5, 15), c = r.ent(5, 15);
        if ((a + b + c) % 2 || !(a < b + c && b < a + c && c < a + b) || new Set([a, b, c]).size < 3) continue;
        const sp = (a + b + c) / 2;
        return {
          enunciado: `Un parque triangular ABC tiene AB = ${c} m, AC = ${b} m y BC = ${a} m. Afuera, una glorieta toca la avenida BC y las prolongaciones de AB y AC; toca la de AB en T. ¿Cuánto mide BT?`,
          datos: [D_SEMI, D_ATS],
          pasos: [
            { tipo: 'pide', texto: 'Piden BT: de la esquina B hasta donde la glorieta toca la prolongación de AB.' },
            { tipo: 'datos', texto: `Los lados miden AB = ${c} m, AC = ${b} m y BC = ${a} m.` },
            { tipo: 'regla', texto: 'La glorieta es la exinscrita relativa a BC: la tangente desde A mide el semiperímetro, y B está entre A y T.', ecuacion: junto([dO('AT'), ' = s']) },
            { tipo: 'cuentas', texto: 'Primero se halla el semiperímetro, y después se le resta AB.', ecuacion: junto([`s = ${a + b + c} ÷ 2 = ${sp}`, FL, `BT = ${sp} − ${c} = `, dF(m_(sp - c))]) },
            { tipo: 'sentido', texto: `Desde B, las dos tangentes a la glorieta miden igual: BT = BD = ${sp - c} m, y CD = ${sp - b} m. Suman BC = ${a} m.` },
          ],
          respuesta: [junto('BT = '), dF(m_(sp - c))],
        };
      }
    }
    if (t === 1) {
      const A = 2 * r.ent(15, 60);
      return {
        enunciado: `En el triángulo ABC, m∠A = ${A}° y E es el excentro relativo a BC. ¿Cuánto mide el ángulo BEC?${NO_ESC}`,
        datos: [D_EXC, D_SUMA, D_EXTB],
        dibujo: figLejos(90 - A / 2, a => 90 - a / 2, (a, b) => fig5a(a, b, { exs: { A: 0 }, sinCirc: true, bisE: 0, bisI: null, angA: `${A}°`, angBEC: '?', alt: `El triángulo ABC con las bisectrices exteriores de B y C, que se cortan en E; m∠A = ${A}°.` }), 20, 130),
        pasos: [
          { tipo: 'pide', texto: 'Piden el ángulo BEC, donde se cruzan las bisectrices exteriores de B y C.' },
          { tipo: 'datos', texto: `m∠A = ${A}°, pero B y C no se dan por separado.` },
          { tipo: 'regla', texto: 'En el triángulo BEC, los ángulos en B y en C son las mitades de los ángulos exteriores, y los tres ángulos de BEC suman 180°.' },
          { tipo: 'cuentas', texto: `Los exteriores de B y C suman 360° − (180° − ${A}°) = ${180 + A}°, y sus mitades suman ${90 + A / 2}°.`, ecuacion: junto([`m∠BEC = 180° − ${90 + A / 2}° = `, dF(`${90 - A / 2}°`)]) },
          { tipo: 'sentido', texto: `Es 90° − ${A}° ÷ 2, y sale agudo, como todo ángulo BEC: a 90° se le resta la mitad de A.` },
        ],
        respuesta: [junto('m∠BEC = '), dF(`${90 - A / 2}°`)],
      };
    }
    const X = 2 * r.ent(46, 80);
    return {
      enunciado: `En el triángulo ABC, I es el incentro, E el excentro relativo a BC y m∠BIC = ${X}°. ¿Cuánto mide el ángulo BEC?`,
      datos: [D_BIC, D_BEC],
      pasos: [
        { tipo: 'pide', texto: 'Piden el ángulo BEC, con vértice en el excentro.' },
        { tipo: 'datos', texto: `Se da m∠BIC = ${X}°, el ángulo con vértice en el incentro.` },
        { tipo: 'regla', texto: 'Los dos ángulos dependen solo de A: BIC = 90° + A ÷ 2 y BEC = 90° − A ÷ 2.' },
        { tipo: 'cuentas', texto: 'Primero se halla la mitad de A con BIC, y después se calcula BEC.', ecuacion: junto([`m∠A ÷ 2 = ${X}° − 90° = ${X - 90}°`, FL, 'm∠BEC = ', dF(`${180 - X}°`)]) },
        { tipo: 'sentido', texto: `${X}° + ${180 - X}° = 180°: BIC y BEC son suplementarios, porque IBE e ICE son rectos.` },
      ],
      respuesta: [junto('m∠BEC = '), dF(`${180 - X}°`)],
    };
  }
  // «Ahora tú» de la idea 5. Tipos: AT = s; BT = s − c; ∠BEC; ∠A desde ∠BEC; ∠BEC desde ∠BIC.
  function casoBD(r) {
    for (;;) {
      const a = r.ent(5, 16), b = r.ent(5, 16), c = r.ent(5, 16);
      if ((a + b + c) % 2 || !(a < b + c && b < a + c && c < a + b) || new Set([a, b, c]).size < 3) continue;
      const sp = (a + b + c) / 2;
      // (Cierre del 26 nov: antes pedía AT, que el recuadro Datos daba hecho; ahora pide BD, que sale de AT y de las tangentes.)
      return { pregunta: `En el triángulo ABC, AB = ${c} cm, AC = ${b} cm y BC = ${a} cm. La exinscrita relativa a BC toca la prolongación de AB en T y el lado BC en D. ¿Cuánto mide BD?`,
        datos: [D_SEMI, D_ATS, D_TAN],
        opciones: ops(sp - c, [
          { id: 'at', valor: sp, error: 'GE-EX3', siFuera: `${sp} cm es AT; desde B la tangente es más corta, porque B está entre A y T.` },
          { id: 'cd', valor: sp - b, error: 'GE-EX3', siFuera: `${sp - b} cm es CD, la tangente desde C; BD sale de restar AB, no AC.` },
          { id: 'inscrita', valor: sp - a, error: 'GE-EX1', siFuera: 's − BC es la tangente desde A a la inscrita, no a la exinscrita.' },
          { id: 'mitad', valor: a / 2, error: 'GE-EX3', siFuera: 'La exinscrita no toca BC en su punto medio: BD es la tangente desde B, igual a BT.' },
        ], cm),
        solucion: { texto: `AT = s = ${sp} y B está entre A y T, así que BT = ${sp} − ${c}. Desde B, las dos tangentes miden igual: BD = BT.`, ecuacion: junto([`BD = ${sp} − ${c} = `, dF(cm(sp - c))]) } };
    }
  }
  function casoBT(r) {
    for (;;) {
      const a = r.ent(5, 16), b = r.ent(5, 16), c = r.ent(5, 16);
      if ((a + b + c) % 2 || !(a < b + c && b < a + c && c < a + b) || new Set([a, b, c]).size < 3) continue;
      const sp = (a + b + c) / 2;
      return { pregunta: `En el triángulo ABC, AB = ${c} cm, AC = ${b} cm y BC = ${a} cm. La exinscrita relativa a BC toca la prolongación de AB en T. ¿Cuánto mide BT?`,
        datos: [D_SEMI, D_ATS],
        opciones: ops(sp - c, [
          { id: 'at', valor: sp, error: 'GE-EX3', siFuera: `AT = ${sp} cm está bien, pero falta restarle AB.` },
          { id: 'otro', valor: sp - b, error: 'GE-EX3', siFuera: 'Restar del semiperímetro está bien, pero para BT se resta AB, el lado que está sobre AT.' },
          { id: 'inscrita', valor: sp - a, error: 'GE-EX1', siFuera: 's − BC es la tangente desde A a la inscrita, no a la exinscrita.' },
        ], cm),
        solucion: { texto: `AT = s = ${sp}, y como B está entre A y T, BT = AT − AB.`, ecuacion: junto([`BT = ${sp} − ${c} = `, dF(cm(sp - c))]) } };
    }
  }
  function casoBEC(r) {
    const A = 2 * r.ent(12, 60);
    return { pregunta: `En el triángulo ABC, m∠A = ${A}° y E es el excentro relativo a BC. ¿Cuánto mide el ángulo BEC?`,
      datos: [D_EXC, D_SUMA, D_EXTB],
      opciones: ops(90 - A / 2, [
        { id: 'in', valor: 90 + A / 2, error: 'GE-EX4', siFuera: '90° + A/2 vale para el incentro, con bisectrices interiores.' },
        { id: 'mitad', valor: A / 2, error: 'GE-EX5', siFuera: 'A/2 sale cuando se cruzan una bisectriz interior y una exterior; aquí las dos son exteriores.' },
        { id: 'resta', valor: 90 - A, error: 'GE-EX6', siFuera: 'Restar de 90° está bien, pero se resta la mitad de A, no A entero.' },
      ], gra),
      solucion: { texto: `Los exteriores de B y C suman 360° − (180° − ${A}°) = ${180 + A}°; en el triángulo BEC, sus mitades suman ${f(90 + A / 2)}°.`, ecuacion: junto([`m∠BEC = 180° − ${f(90 + A / 2)}° = `, dF(`${90 - A / 2}°`)]) } };
  }
  function casoAE(r) {
    const X = r.ent(35, 85);
    return { pregunta: `En el triángulo ABC, E es el excentro relativo a BC y m∠BEC = ${X}°. ¿Cuánto mide el ángulo A?`,
      datos: [D_EXC, D_SUMA, D_EXTB],
      opciones: ops(2 * (90 - X), [
        { id: 'mitad', valor: 90 - X, error: 'GE-EX6', siFuera: `${90 - X}° es la mitad de A, pero falta duplicarla.` },
        { id: 'sup', valor: 180 - X, error: 'GE-EX4', siFuera: 'Restar de 180° vale para el ortocentro; aquí E es el excentro.' },
        { id: 'doble', valor: 2 * X > 179 ? 179 : 2 * X, error: 'GE-EX7', siFuera: 'Duplicar está bien, pero se duplica lo que le falta a BEC para 90°, no BEC.' },
      ], gra),
      solucion: { texto: `En el triángulo BEC, las mitades de los exteriores de B y C suman 180° − ${X}° = ${180 - X}°, así que los exteriores suman ${2 * (180 - X)}°, y B y C suman ${360 - 2 * (180 - X)}°.`, ecuacion: junto([`m∠A = 180° − ${360 - 2 * (180 - X)}° = `, dF(`${2 * (90 - X)}°`)]) } };
  }
  function casoIE(r) {
    const X = r.ent(95, 165);
    return { pregunta: `En el triángulo ABC, I es el incentro, E el excentro relativo a BC y m∠BIC = ${X}°. ¿Cuánto mide el ángulo BEC?`,
      datos: [D_BIC, D_BEC],
      opciones: ops(180 - X, [
        { id: 'igual', valor: X, error: 'GE-EX7', siFuera: 'Los dos dependen de A, es cierto, pero BEC no mide lo mismo que BIC: suman 180°.' },
        { id: 'a', valor: 2 * (X - 90), error: 'GE-EX7', siFuera: `${2 * (X - 90)}° es el ángulo A, pero falta pasar de A a BEC.` },
        { id: 'mitad', valor: X - 90, error: 'GE-EX6', siFuera: `${X - 90}° es la mitad de A, y BEC es 90° menos esa mitad.` },
      ], gra),
      solucion: { texto: `La mitad de A: ${X}° − 90° = ${X - 90}°.`, ecuacion: junto([`m∠BEC = 90° − ${X - 90}° = `, dF(`${180 - X}°`)]) } };
  }
  function toquesE(P, rr) {
    const d = LADOS_J.map(([k, X, Y]) => [k, aRecta(P, X, Y)]);
    const sale = d.filter(([, x]) => x < rr - 1e-9).map(([k]) => k), toca = d.filter(([, x]) => Math.abs(x - rr) < 1e-9).map(([k]) => k);
    if (dentroDe(P, JA, JB, JC)) return 'Ese centro quedó dentro del parque: la glorieta va afuera.';
    if (sale.length) return `Cruza la avenida ${sale.join(' y la ')}: le sobra radio.`;
    if (toca.length === 3) return 'Toca las tres avenidas: P está a r de las tres rectas.';
    const falta = d.filter(([, x]) => x > rr + 1e-9).sort((u, w) => u[1] - w[1])[0];
    return toca.length ? `Toca ${toca.join(' y ')}; a ${falta[0]} le faltan ${m_(falta[1] - rr)}.` : `No toca ninguna; a ${falta[0]} le faltan ${m_(falta[1] - rr)}.`;
  }
  const VP5 = (() => { const c = centrosDe(T5.A, T5.B, T5.C); return null; })();
  void VP5;
  const ideaExcentro = {
    id: 'excentro',
    titulo: 'El excentro y la exinscrita',
    pregunta: '¿Qué circunferencias tocan las tres avenidas por fuera?',
    temas: ['Baricentro, incentro, circuncentro, ortocentro y excentro', 'Propiedades de los puntos notables'],
    pieza: GO,
    aprendizaje: 'Una bisectriz interior y dos exteriores se cortan en un excentro, centro de una exinscrita; hay tres, siempre fuera, y AT mide s.',
    actividad: 'Ubicar una glorieta afuera del parque, tocando las tres avenidas.',
    lee: {
      tarjetas: [
        { titulo: 'Las avenidas siguen de largo', texto: 'Los lados del parque son tramos de tres avenidas rectas que siguen de largo. Afuera hay sitio para una glorieta redonda de centro P y radio r.',
          pieza: GO, dibujo: figO(figAvenidas([10, -5], 3)) },
        { titulo: 'La bisectriz exterior', texto: 'Al prolongar un lado se forma el ángulo exterior. Su bisectriz lo parte en dos iguales, y cada punto suyo está igual de lejos de las dos avenidas que lo forman.' },
        { titulo: 'Qué mirar al jugar', texto: 'Mueve el centro P por debajo de BC y cambia el radio r. La lectura dice qué avenidas toca la glorieta y cuánto le falta para tocar la siguiente.' },
      ],
    },
    ejemplos: EJ5,
    juega: {
      pieza: GO,
      consigna: 'El parque de 12 m, 16 m y 20 m está entre tres avenidas, y afuera, del lado de BC, va una glorieta.',
      mision: { texto: 'Pon la glorieta fuera, tocando la avenida BC y las otras dos.', logrado: v => v.px === JE[0] && v.py === JE[1] && v.r === JRA,
        bien: 'Listo: la glorieta toca BC y las prolongaciones de AB y AC.' },
      voz: 'Toca primero BC y la prolongación de AB; después agrándala.',
      leyenda: [
        { s: 'A, B, C', t: 'las esquinas del parque' },
        { s: dO('P'), t: 'el centro de la glorieta' },
        { s: dI('r'), t: 'el radio de la glorieta' },
      ],
      controles: [
        { id: 'px', etiqueta: 'P a lo ancho', min: 0, max: 16, paso: 1, inicio: 10, unidad: 'm', decimales: 0, color: 'c-o' },
        { id: 'py', etiqueta: 'P a lo alto', min: -14, max: -1, paso: 1, inicio: -5, unidad: 'm', decimales: 0, color: 'c-o' },
        { id: 'r', etiqueta: 'r, el radio', min: 1, max: 10, paso: 0.5, inicio: 3, unidad: 'm', decimales: 1, color: 'c-i' },
      ],
      dibujo: v => ({ datos: figAvenidas([v.px, v.py], v.r), estado: {} }),
      arrastres: [{ id: 'glorieta', etiqueta: 'centro de la glorieta', color: 'c-o',
        donde: v => enPantalla(figAvenidas([v.px, v.py], v.r), [v.px, v.py]),
        mover: (p, v) => { const q = alPlano(figAvenidas([v.px, v.py], v.r), p); return { px: q[0], py: q[1] }; } }],
      lectura: v => [toquesE([v.px, v.py], v.r)],
      minimo: 3,
    },
    predice: {
      pregunta: PRED5,
      voz: 'Ya viste una adentro y una afuera. ¿Hay más?',
      opciones: [
        { id: 'c', texto: '4', correcta: true },
        { id: 'dos', texto: '2', error: 'GE-EX8', siFuera: 'Esas dos sí tocan las tres avenidas, pero hay más afuera, del otro lado de AB y de CA.' },
        { id: 'seis', texto: '6', error: 'GE-EX8', siFuera: 'Afuera hay una sola glorieta frente a cada lado, no dos, porque tres bisectrices fijan su centro.' },
        { id: 'infinitas', texto: 'Infinitas', error: 'GE-EX9', siFuera: 'Si una glorieta se corre, deja de tocar alguna avenida, así que cada una es única.' },
      ],
      dibujo: figO(figEx(T5.A, T5.B, T5.C, { ins: 0, exs: { A: 0 }, objeto: 'avenidas', vista: { x: [-7.6, 14.4], y: [-12, 10.4] }, alt: 'Un parque entre tres avenidas: la pileta adentro y la glorieta afuera, frente a BC.' })),
      revelar: figO(figEx(T5.A, T5.B, T5.C, { ins: 0, exs: { A: 0, B: 0, C: 0 }, objeto: 'avenidas', vista: { x: [-7.6, 14.4], y: [-12, 10.4] }, alt: 'Las cuatro circunferencias que tocan las tres avenidas: la inscrita y una exinscrita frente a cada lado.' })),
      coincide: 'Coincide: cuatro, la inscrita y tres exinscritas, una frente a cada lado.',
      noCoincide: 'Revisemos: además de la pileta y la glorieta de BC, hay una glorieta frente a CA y otra frente a AB. Son cuatro.',
    },
    mira: {
      pieza: GO,
      datos: figEx(T5.A, T5.B, T5.C, { ins: 0, exs: { A: 1, B: 4, C: 4 }, bisE: 1, bisI: 2, radioE: 3, T: 5, objeto: 'avenidas', rot: { AT: 's' }, rotDesde: { AT: 5 }, vista: { x: [-7.6, 14.4], y: [-12, 10.4] },
        alt: 'Las bisectrices exteriores de B y C y la interior de A se cortan en E; la exinscrita de centro E toca BC y las prolongaciones; hay otra frente a cada lado; AT mide s.' }),
      voz: 'Primero el centro de la glorieta; después, cuántas hay.',
      pasos: [
        { estado: { corte: 0 }, texto: 'La pileta de adentro tiene su centro en I.' },
        { estado: { corte: 1 }, texto: 'Las bisectrices exteriores de B y de C se cortan en E, fuera del parque.' },
        { estado: { corte: 2 }, texto: 'La bisectriz interior de A también pasa por E.' },
        { estado: { corte: 3 }, texto: 'E equidista de las tres avenidas: es el centro de la glorieta.' },
        { estado: { corte: 4 }, texto: 'Hay otra glorieta frente a CA y otra frente a AB: con la pileta, son cuatro.' },
        { estado: { corte: 5 }, texto: 'La tangente desde A hasta la glorieta de BC mide el semiperímetro.', ecuacion: junto([dO('AT'), ' = s']) },
      ],
    },
    regla: {
      texto: 'La bisectriz interior de A y las exteriores de B y C se cortan en el excentro E, que queda fuera y equidista de las rectas de los tres lados. Hay un excentro frente a cada lado.',
      ecuacion: [junto([dO('AT'), ' = s']), Y, junto(['m∠BEC = 90° − ', dH('m∠A'), ' ÷ 2'])],
      condicion: 'E es el excentro relativo a BC, el que está frente a ese lado, y T es donde su exinscrita toca la prolongación de AB.',
      voz: 'Desde A, la tangente a la exinscrita es el semiperímetro entero.',
      // (Cierre del 26 nov, lector B: la «s» junto a AB parecía s = AB, y el ángulo A de la fórmula no estaba marcado.)
      dibujo: fig5({ exs: { A: 0 }, bisE: 0, T: 0, angA: true, rot: { AT: 's' }, rotEn: { AT: 0.8 }, alt: 'El triángulo ABC con su excentro E, cruce de las bisectrices exteriores de B y C y de la interior de A; la exinscrita toca la prolongación de AB en T, y AT mide s.' }),
    },
    resuelve: { pieza: GO, generar: resuelveEx },
    ahoraTu: {
      pieza: GO,
      voz: 'Ubica el excentro frente a BC; después mira qué sale de A: la tangente s o la bisectriz interior.',
      generar(s) { return conCuatro([casoBD, casoBT, casoBEC, casoAE, casoIE][s % 5], azar(s + 7), firmasDe(EJ5, [PRED5])); },
    },
  };

  // ======================= Idea 6: la recta de Euler =======================
  // Objeto de la primera pantalla: la cartulina con los centros marcados (la punta del lápiz G, el tanque O, el cruce de
  // las trochas H y el centro de la pileta I). Cambia: el vértice A. · Permanece: B(0, 0) y C(8, 0). · Progresa: si los
  // cuatro quedan en una recta. · Se reserva: cuáles tres quedan siempre en una recta (la predicción). · Debe verse: O, G
  // y H en una recta, con GH = 2 · OG; I fuera de ella en un escaleno.
  const UB = [0, 0], UC = [8, 0];
  // Los cuatro centros. o: { recta: corte (la recta OH), d: corte (los tramos OG y GH con su color y su rótulo), nueve:
  //   { m, f, n } (cortes: puntos medios, pies de las alturas y la circunferencia con su centro N), objeto, alt, vista }
  function figEuler(A, o = {}) {
    const c = centrosDe(A, UB, UC), pts = o.sinCentros ? { A, B: UB, C: UC } : { A, B: UB, C: UC, O: c.O, G: c.G, H: c.H, I: c.I };
    const ver = { A: { lado: 90 }, B: { lado: 225 }, C: { lado: 315 }, O: { lado: 0 }, G: { lado: 150 }, H: { lado: 180 }, I: { lado: 270 } };
    const segs = [['A', 'B'], ['B', 'C'], ['C', 'A']];
    const lados = [];
    if (o.recta !== undefined) {
      const u = [c.H[0] - c.O[0], c.H[1] - c.O[1]];
      pts['~e1'] = [c.O[0] - u[0] * 0.6, c.O[1] - u[1] * 0.6]; pts['~e2'] = [c.H[0] + u[0] * 0.4, c.H[1] + u[1] * 0.4];
      segs.push(['~e1', '~e2', { grosor: 'fino', discontinua: true, desde: o.recta }]);
    }
    if (o.d !== undefined) {
      const t0 = o.dTxt ? o.dTxt[0] : 'd', t1 = o.dTxt ? o.dTxt[1] : '2d';
      segs.push(['O', 'G', { color: t0 === '?' ? undefined : 'i', grosor: 'variable', desde: o.d }], ['G', 'H', { color: t1 === '?' ? undefined : 'o', grosor: 'variable', desde: o.d }]);
      lados.push({ de: 'O', a: 'G', texto: t0, color: t0 === '?' ? undefined : 'i', dist: 4, desde: o.d }, { de: 'G', a: 'H', texto: t1, color: t1 === '?' ? undefined : 'o', dist: 4, desde: o.d });
    }
    const circs = [];
    if (o.nueve) {
      const M3 = [U.medio(UB, UC), U.medio(A, UC), U.medio(A, UB)], F3 = [pieDe(A, UB, UC), pieDe(UB, A, UC), pieDe(UC, A, UB)];
      M3.forEach((p, i) => { pts[`m${i}`] = p; ver[`m${i}`] = { desde: o.nueve.m }; });
      F3.forEach((p, i) => { pts[`f${i}`] = p; ver[`f${i}`] = { desde: o.nueve.f }; });
      pts.N = c.N; ver.N = { desde: o.nueve.n, lado: 30 };
      circs.push({ centro: 'N', r: c.R / 2, grosor: 'fino', desde: o.nueve.n });
    }
    const letra = { m0: null, m1: null, m2: null, f0: null, f1: null, f2: null };
    const xs = Object.values(pts).map(p => p[0]), ys = Object.values(pts).map(p => p[1]);
    const vista = o.vista || { x: [Math.min(...xs) - 1.2, Math.max(...xs) + 1.2], y: [Math.min(...ys) - 1.2, Math.max(...ys) + 1.2] };
    const obj = o.objeto === 'carton' ? { tipo: 'carton', lamina: ['A', 'B', 'C'], sombra: [0, 0] } : { tipo: 'examen' };
    // Con la cartulina de EA, las letras van donde no pisan un lado ni a otro centro (cierre del 26 nov, lector B).
    if (o.letrasFijas) for (const [k, l] of Object.entries(o.letrasFijas)) if (ver[k]) ver[k].lado = l;
    return nt({ pts, segs, circs, lados, ver, letra, obj, vista, alto: o.alto || 250, fijas: ['A', 'B', 'C', ...Object.keys(o.letrasFijas || {})], manija: o.manija,
      alt: o.alt || 'Un triángulo ABC con su circuncentro O, su baricentro G, su ortocentro H y su incentro I.' });
  }
  const figUno = A => figEuler(A, { objeto: 'carton', manija: 'A', vista: { x: [-1.5, 9.5], y: [-1.6, 8.2] },
    alt: 'La cartulina ABC con sus cuatro centros marcados: O, G, H e I.' });
  const D_EUL = 'Recta de Euler: O, G y H están en una recta, con G entre O y H y GH = 2 · OG.';
  // (Cierre del 26 nov, lector B: R se dice qué es; el centro va en su propia línea, que solo usa el ejemplo 15.)
  const D_NUEVE = 'La circunferencia de nueve puntos tiene radio R ÷ 2, con R el radio de la circunscrita.';
  const D_NUEVEC = 'El centro de la circunferencia de nueve puntos es el punto medio de OH.';
  // (Cierre del 26 nov, lector B: «equidista de los vértices» regalaba la elección; van las definiciones y las herramientas.)
  const D_CENTROS = 'G: cruce de medianas. O: de mediatrices. I: de bisectrices. H: de alturas.';
  const D_MEDIATRIZ = 'Cada punto de la mediatriz de un segmento está igual de lejos de sus dos extremos.';
  const D_BISEC = 'Cada punto de la bisectriz de un ángulo está igual de lejos de sus dos lados.';
  const D_EQUIL = 'El punto de equilibrio de una lámina pareja está en cada una de sus medianas.';

  // Los 15 ejemplos (cuentas rehechas aparte: cuentas.py, idea 6): 8 cm; 5 cm; 9 cm; 7 cm; coinciden; 12 cm; 10 cm;
  // 24 cm; 21 cm; sí, en el eje; 5 cm; 16 cm; 5 cm; circuncentro fuera (cierre del 26 nov); 2 cm.
  const T6 = [1.5, 3.5];
  const fig6 = o => figO(figEuler(T6, o));
  const EJ6 = [];
  EJ6.push({ nivel: 1, titulo: 'El tramo largo de la recta',
    enunciado: 'En la recta de Euler de un triángulo, OG = 4 cm. ¿Cuánto mide GH?',
    datos: [D_EUL],
    solucion: [{ texto: 'GH es el doble de OG:', ecuacion: junto([dO('GH'), ' = 2 · ', dI('4'), ' = ', dF('8 cm')]) }],
    respuesta: [junto('GH = '), dF('8 cm')] });
  EJ6.push({ nivel: 1, titulo: 'El tramo corto',
    enunciado: 'En la recta de Euler de un triángulo, GH = 10 cm. ¿Cuánto mide OG?',
    datos: [D_EUL],
    solucion: [{ texto: 'OG es la mitad de GH:', ecuacion: junto([dI('OG'), ' = ', dO('10'), ' ÷ 2 = ', dF('5 cm')]) }],
    respuesta: [junto('OG = '), dF('5 cm')] });
  EJ6.push({ nivel: 1, titulo: 'De O a H',
    enunciado: 'En la recta de Euler de un triángulo, OG = 3 cm. ¿Cuánto mide OH?',
    datos: [D_EUL],
    solucion: [{ texto: 'GH = 2 · 3 = 6 cm, y OH junta los dos tramos:', ecuacion: junto(['OH = 3 + 6 = ', dF('9 cm')]) }],
    respuesta: [junto('OH = '), dF('9 cm')] });
  EJ6.push({ nivel: 1, titulo: 'El radio de nueve puntos',
    enunciado: 'El circunradio de un triángulo mide 14 cm. ¿Cuánto mide el radio de su circunferencia de nueve puntos?',
    datos: [D_NUEVE],
    solucion: [{ texto: 'El radio de nueve puntos es la mitad del circunradio:', ecuacion: junto(['14 ÷ 2 = ', dF('7 cm')]) }],
    respuesta: [dF('7 cm')] });
  EJ6.push({ nivel: 1, titulo: 'El triángulo equilátero',
    enunciado: 'En un triángulo equilátero, ¿cómo quedan su circuncentro, su baricentro y su ortocentro?',
    datos: ['En un equilátero, cada mediana es también altura, bisectriz y mediatriz.'],
    solucion: [{ texto: 'Las medianas, las alturas y las mediatrices son las mismas tres rectas: se cortan en un solo punto.', ecuacion: [dF('los tres coinciden')] }],
    respuesta: [dF('Coinciden en un mismo punto')] });

  EJ6.push({ nivel: 2, titulo: 'Desde OH entero',
    enunciado: 'En la recta de Euler de un triángulo, OH = 18 cm. ¿Cuánto mide GH?',
    datos: [D_EUL],
    solucion: [{ texto: 'OH tiene tres partes iguales: una es OG y dos son GH.', ecuacion: junto(['18 ÷ 3 = 6', FL, 'GH = 2 · 6 = ', dF('12 cm')]) }],
    respuesta: [junto('GH = '), dF('12 cm')] });
  EJ6.push({ nivel: 2, titulo: 'La escuadra y su recta',
    enunciado: 'Un triángulo es rectángulo en B y su hipotenusa AC mide 30 cm. ¿Cuánto mide GH, del baricentro al ortocentro?',
    datos: [D_ORECT, D_ORTO, D_EUL],
    solucion: [{ texto: 'O es el punto medio de AC y H es el vértice B, así que OH es la mediana a la hipotenusa y mide 30 ÷ 2 = 15 cm.' },
      { texto: 'GH toma dos tercios de OH:', ecuacion: junto(['GH = 2 · (15 ÷ 3) = ', dF('10 cm')]) }],
    respuesta: [junto('GH = '), dF('10 cm')] });
  EJ6.push({ nivel: 2, titulo: 'Del radio chico al diámetro',
    enunciado: 'La circunferencia de nueve puntos de un triángulo tiene radio 6 cm. ¿Cuánto mide el diámetro de su circunferencia circunscrita?',
    datos: [D_NUEVE],
    solucion: [{ texto: 'R es el doble del radio de nueve puntos: R = 12 cm.' },
      { texto: 'El diámetro es el doble de R:', ecuacion: junto(['2 · 12 = ', dF('24 cm')]) }],
    respuesta: [dF('24 cm')] });
  EJ6.push({ nivel: 2, titulo: 'Los tramos con x',
    enunciado: 'En la recta de Euler de un triángulo, OG = x + 1 y GH = 3x − 4, en centímetros. ¿Cuánto mide OH?',
    datos: [D_EUL],
    solucion: [{ texto: 'Como GH = 2 · OG, se plantea la ecuación:', ecuacion: junto(['3x − 4 = 2x + 2', FL, 'x = 6']) },
      { texto: 'Con x = 6 quedan OG = 7 y GH = 14, y OH es su suma:', ecuacion: junto(['OH = 7 + 14 = ', dF('21 cm')]) }],
    respuesta: [junto('OH = '), dF('21 cm')] });
  EJ6.push({ nivel: 2, titulo: 'Un triángulo isósceles',
    figura: figO(figEuler([4, 6.5], { alt: 'Un triángulo isósceles ABC, con AB = AC, y sus centros O, G, H e I.' })),
    enunciado: 'En un triángulo isósceles con AB = AC, que no es equilátero, ¿quedan O, G, H e I en una misma recta?',
    datos: ['En un isósceles, la mediana, la altura, la mediatriz y la bisectriz que van a la base son la misma recta.'],
    solucion: [{ texto: 'Los cuatro centros están en esa recta, que es el eje de simetría. No coinciden: están en distintos lugares de ella.', ecuacion: [dF('sí, en el eje de simetría')] }],
    respuesta: [dF('Sí: en el eje de simetría')] });

  // Nivel 3: la correcta en C, A, E, D y B; cada incorrecta se explica por su valor.
  EJ6.push({ nivel: 3, titulo: 'Catetos de 9 y 12 cm',
    enunciado: 'Un triángulo es rectángulo en B, con catetos de 9 cm y 12 cm. ¿Cuánto mide GH, del baricentro al ortocentro?',
    alternativas: ['7,5 cm', '2,5 cm', '5 cm', '15 cm', '10 cm'],
    datos: [D_PIT, D_ORECT, D_ORTO, D_EUL],
    solucion: [{ texto: 'La hipotenusa mide 15 cm. O es su punto medio y H es B, así que OH = 15 ÷ 2 = 7,5 cm.' },
      { texto: 'GH toma dos tercios de OH:', ecuacion: junto(['GH = 2 · (7,5 ÷ 3) = ', dF('5 cm')]) },
      { texto: 'Las otras alternativas: 7,5 cm es OH, 2,5 cm es OG, 15 cm es la hipotenusa y 10 cm son dos tercios de la hipotenusa.' }],
    respuesta: [junto('GH = '), dF('5 cm')] });
  EJ6.push({ nivel: 3, titulo: 'Dos tramos que suman',
    enunciado: 'En la recta de Euler de un triángulo, OG + GH = 24 cm. ¿Cuánto mide GH?',
    alternativas: ['16 cm', '12 cm', '8 cm', '18 cm', '6 cm'],
    datos: [D_EUL],
    solucion: [{ texto: 'OG + GH = OH = 24 cm, y OH queda en tres partes de 8 cm.' },
      { texto: 'GH toma dos de esas partes:', ecuacion: junto(['GH = 2 · 8 = ', dF('16 cm')]) },
      { texto: 'Las otras alternativas: 12 cm pone a G en la mitad, 8 cm es OG, 18 cm parte OH en 3 : 1 y 6 cm es un cuarto de OH.' }],
    respuesta: [junto('GH = '), dF('16 cm')] });
  EJ6.push({ nivel: 3, titulo: 'Nueve puntos en la escuadra',
    enunciado: 'Un triángulo rectángulo tiene una hipotenusa de 20 cm. ¿Cuánto mide el radio de su circunferencia de nueve puntos?',
    alternativas: ['10 cm', '20 cm', '2,5 cm', '6,67 cm', '5 cm'],
    datos: [D_ORECT, D_NUEVE],
    solucion: [{ texto: 'El circuncentro es el punto medio de la hipotenusa: R = 20 ÷ 2 = 10 cm.' },
      { texto: 'El radio de nueve puntos es la mitad de R:', ecuacion: junto(['10 ÷ 2 = ', dF('5 cm')]) },
      { texto: 'Las otras alternativas: 10 cm es R, 20 cm es la hipotenusa, 2,5 cm divide otra vez entre 2 y 6,67 cm es un tercio de la hipotenusa.' }],
    respuesta: [dF('5 cm')] });
  // (Cierre del 26 nov, lector B: era el más fácil de la idea y los Datos lo regalaban; ahora se elige el centro y su lugar.)
  EJ6.push({ nivel: 3, titulo: 'Qué centro elegir y dónde queda',
    enunciado: 'Se quiere poner una antena a la misma distancia de tres pueblos. Los caminos rectos entre ellos forman un triángulo con ángulos de 25°, 45° y 110°. ¿Qué punto notable es el lugar, y dónde queda?',
    alternativas: ['El circuncentro, dentro del triángulo', 'El incentro, dentro del triángulo', 'El circuncentro, en el punto medio del lado mayor', 'El circuncentro, fuera del triángulo', 'El baricentro, dentro del triángulo'],
    datos: [D_CENTROS, D_MEDIATRIZ, D_LUGAR],
    solucion: [{ texto: 'Los pueblos son los vértices. El punto igual de lejos de dos vértices está en la mediatriz de ese lado, así que el de los tres está en las tres mediatrices: es el circuncentro.' },
      { texto: 'Con un ángulo de 110°, el triángulo es obtusángulo, y O queda', ecuacion: [dF('fuera del triángulo')] },
      { texto: 'Las otras alternativas: el incentro y el baricentro no quedan a igual distancia de los tres vértices; O queda en el punto medio de un lado solo si hay un ángulo recto, y dentro solo si los tres son agudos.' }],
    respuesta: [dF('El circuncentro, fuera del triángulo')] });
  EJ6.push({ nivel: 3, titulo: 'El centro de nueve puntos',
    enunciado: 'En la recta de Euler de un triángulo, OH = 12 cm, y N es el centro de su circunferencia de nueve puntos. ¿Cuánto mide NG?',
    alternativas: ['6 cm', '2 cm', '4 cm', '3 cm', '8 cm'],
    datos: [D_EUL, D_NUEVEC],
    solucion: [{ texto: 'Desde O, N está a 12 ÷ 2 = 6 cm y G está a 12 ÷ 3 = 4 cm, así que G queda entre O y N.' },
      { texto: 'NG es la diferencia:', ecuacion: junto(['NG = 6 − 4 = ', dF('2 cm')]) },
      { texto: 'Las otras alternativas: 6 cm es ON, 4 cm es OG, 3 cm es un cuarto de OH y 8 cm es GH.' }],
    respuesta: [junto('NG = '), dF('2 cm')] });

  const PRED6 = 'En un triángulo escaleno, ¿cuáles tres centros quedan siempre en una misma recta?';
  // (Cierre del 26 nov, lector B: con A = (1,5; 3,5) la O pisaba BC, H se pegaba a A e I casi tocaba la recta.)
  const EA = [0.5, 4.75], VE = undefined, LE = { O: 315, G: 90, I: 120, H: 290 };
  function resuelveEul(s) {
    const r = azar(s + 900), t = s % 3;
    if (t === 0) {
      const k = r.ent(2, 9), OH = 3 * k;
      return {
        enunciado: `En la recta de Euler de un triángulo, OH = ${OH} cm. ¿Cuánto miden OG y GH?`,
        datos: [D_EUL],
        dibujo: fig6({ recta: 0, d: 0, dTxt: ['?', '?'], alt: 'El triángulo ABC con su recta de Euler: O, G y H alineados.' }),
        pasos: [
          { tipo: 'pide', texto: 'Piden los dos tramos de la recta de Euler: de O a G y de G a H.' },
          { tipo: 'datos', texto: `El tramo entero, de O a H, mide ${OH} cm.` },
          { tipo: 'regla', texto: 'G está entre O y H, y GH es el doble de OG: OH queda en tres partes iguales.', ecuacion: junto([dO('GH'), ' = 2 · ', dI('OG')]) },
          { tipo: 'cuentas', texto: 'Se divide OH entre 3: una parte es OG y dos partes son GH.', ecuacion: junto([`${OH} ÷ 3 = ${k}`, FL, `OG = ${k}`, Y, 'GH = ', dF(cm(2 * k))]) },
          { tipo: 'sentido', texto: `${k} + ${2 * k} = ${OH}, así que los dos tramos juntos forman OH.` },
        ],
        respuesta: [dF(junto(`OG = ${k} cm y GH = ${cm(2 * k)}`))],
      };
    }
    if (t === 1) {
      const h = 6 * r.ent(2, 8);
      return {
        enunciado: `Un triángulo es rectángulo en B y su hipotenusa AC mide ${h} cm. ¿Cuánto mide GH?`,
        datos: [D_ORECT, D_ORTO, D_EUL],
        pasos: [
          { tipo: 'pide', texto: 'Piden GH, la distancia del baricentro al ortocentro.' },
          { tipo: 'datos', texto: `AC = ${h} cm y el ángulo recto está en B.` },
          { tipo: 'regla', texto: 'En el triángulo rectángulo, O es el punto medio de la hipotenusa y H es el vértice del ángulo recto; G está entre ellos, con GH = 2 · OG.' },
          { tipo: 'cuentas', texto: `OH es la mediana que va a la hipotenusa: OH = ${h} ÷ 2 = ${h / 2} cm. GH toma dos tercios de ella.`, ecuacion: junto([`GH = 2 · (${h / 2} ÷ 3) = `, dF(cm(h / 3))]) },
          { tipo: 'sentido', texto: `GH = ${h / 3} cm es también BG: H es B, y G está a dos tercios de la mediana desde B.` },
        ],
        respuesta: [junto('GH = '), dF(cm(h / 3))],
      };
    }
    const R = 2 * r.ent(3, 15);
    return {
      enunciado: `El circunradio de un triángulo mide ${R} cm. ¿Cuánto mide el diámetro de su circunferencia de nueve puntos?`,
      datos: [D_NUEVE],
      pasos: [
        { tipo: 'pide', texto: 'Piden el diámetro de la circunferencia que pasa por los puntos medios de los lados y los pies de las alturas.' },
        { tipo: 'datos', texto: `R = ${R} cm es el radio de la circunscrita.` },
        { tipo: 'regla', texto: 'El radio de nueve puntos es la mitad de R, y el diámetro es el doble de un radio.' },
        { tipo: 'cuentas', texto: 'Primero se toma la mitad de R, y después se duplica ese radio.', ecuacion: junto([`${R} ÷ 2 = ${R / 2}`, FL, `2 · ${R / 2} = `, dF(cm(R))]) },
        { tipo: 'sentido', texto: 'El diámetro de la circunferencia de nueve puntos mide lo mismo que el circunradio R.' },
      ],
      respuesta: [dF(cm(R))],
    };
  }
  // «Ahora tú» de la idea 6. Tipos: GH; OH; OG desde OH; radio de nueve puntos; qué centro; GH en el rectángulo.
  function casoGH(r) {
    const d = r.ent(2, 15);
    // (Cierre del 26 nov, lector B: pedía GH, que el recuadro Datos daba hecho; ahora pide OH, que junta los dos tramos.)
    return { pregunta: `En la recta de Euler de un triángulo, OG = ${d} cm. ¿Cuánto mide OH?`,
      datos: [D_EUL],
      opciones: ops(3 * d, [
        { id: 'igual', valor: 2 * d, error: 'GE-EU1', siFuera: `${2 * d} cm es GH, o el OH que saldría con G en la mitad; OH junta OG y GH.` },
        { id: 'mitad', valor: 1.5 * d, error: 'GE-EU2', siFuera: 'Usar la razón 1 : 2 está bien, pero al revés: GH es el doble de OG, no la mitad.' },
        { id: 'og', valor: d, error: 'GE-EU3', siFuera: `${d} cm es solo OG, el tramo corto.` },
      ], cm),
      solucion: { texto: `GH es el doble de OG: 2 · ${d} = ${2 * d}. OH junta los dos tramos.`, ecuacion: junto([`OH = ${d} + ${2 * d} = `, dF(cm(3 * d))]) } };
  }
  function casoOH(r) {
    const d = r.ent(2, 12);
    return { pregunta: `En la recta de Euler de un triángulo, GH = ${2 * d} cm. ¿Cuánto mide OH?`,
      datos: [D_EUL],
      opciones: ops(3 * d, [
        { id: 'gh', valor: 2 * d, error: 'GE-EU3', siFuera: 'GH es solo un tramo de OH; falta sumarle OG.' },
        { id: 'doble', valor: 4 * d, error: 'GE-EU2', siFuera: 'Sumar los tramos está bien, pero OG es la mitad de GH, no el doble.' },
        { id: 'og', valor: d, error: 'GE-EU3', siFuera: `${d} cm es OG, el tramo corto; OH es la suma de los dos tramos.` },
      ], cm),
      solucion: { texto: `OG es la mitad de GH: ${2 * d} ÷ 2 = ${d}.`, ecuacion: junto([`OH = ${d} + ${2 * d} = `, dF(cm(3 * d))]) } };
  }
  function casoOG(r) {
    const k = r.ent(2, 12), OH = 3 * k;
    return { pregunta: `En la recta de Euler de un triángulo, OH = ${OH} cm. ¿Cuánto mide OG?`,
      datos: [D_EUL],
      opciones: ops(k, [
        { id: 'mitad', valor: OH / 2, error: 'GE-EU1', siFuera: 'G no es el punto medio de OH: lo parte en 1 : 2.' },
        { id: 'gh', valor: 2 * k, error: 'GE-EU2', siFuera: `Partir en tres está bien, pero ${2 * k} cm es GH, el tramo largo.` },
        { id: 'cuarto', valor: OH / 4, error: 'GE-EU4', siFuera: 'Partir OH está bien, pero en tres partes, no en cuatro.' },
      ], cm),
      solucion: { texto: 'OH tiene tres partes iguales: una es OG.', ecuacion: junto([`${OH} ÷ 3 = `, dF(cm(k))]) } };
  }
  function casoNueve(r) {
    const R = 2 * r.ent(3, 18);
    return { pregunta: `El circunradio de un triángulo mide ${R} cm. ¿Cuánto mide el radio de su circunferencia de nueve puntos?`,
      datos: [D_NUEVE],
      opciones: ops(R / 2, [
        { id: 'igual', valor: R, error: 'GE-EU5', siFuera: `${R} cm es R, el radio de la circunscrita; el de nueve puntos es más chico.` },
        { id: 'tercio', valor: R / 3, error: 'GE-EU6', siFuera: 'Tomar un tercio viene del baricentro; aquí el radio es la mitad de R.' },
        { id: 'doble', valor: 2 * R, error: 'GE-EU5', siFuera: 'Es al revés: el radio de nueve puntos es la mitad de R, no el doble.' },
      ], cm),
      solucion: { texto: 'El radio de nueve puntos es R ÷ 2.', ecuacion: junto([`${R} ÷ 2 = `, dF(cm(R / 2))]) } };
  }
  const ENCARGOS = [
    ['Una antena debe quedar a la misma distancia de tres pueblos, que forman un triángulo.', 'El circuncentro'],
    ['Una fuente debe quedar a la misma distancia de los tres muros rectos que la rodean, que forman un triángulo.', 'El incentro'],
    ['Una placa triangular pareja se sostiene en equilibrio sobre un solo punto.', 'El baricentro'],
    ['De cada vértice de un triángulo sale una recta perpendicular al lado de enfrente, y las tres se cruzan en un punto.', 'El ortocentro'],
  ];
  function casoCual(r) {
    const k = r.ent(0, 3), [txt, bien] = ENCARGOS[k];
    const todos = ['El circuncentro', 'El incentro', 'El baricentro', 'El ortocentro'];
    const porque = { 'El circuncentro': 'equidista de los vértices', 'El incentro': 'equidista de los lados', 'El baricentro': 'es el cruce de las medianas', 'El ortocentro': 'es el cruce de las alturas' };
    return { pregunta: `${txt} ¿Qué punto notable del triángulo es?`,
      datos: [D_CENTROS, k === 2 ? D_EQUIL : k === 1 ? D_BISEC : D_MEDIATRIZ],
      opciones: opsTexto(bien, todos.filter(x => x !== bien).map((x, i) => ({ id: `o${i}`, texto: x, error: 'GE-EU7', siFuera: `${x} ${porque[x]}, y el enunciado describe otra cosa.` }))),
      solucion: { texto: `${bien} ${porque[bien]}.`, ecuacion: [dF(bien)] } };
  }
  function casoRect(r) {
    const h = 6 * r.ent(2, 9);
    return { pregunta: `Un triángulo es rectángulo en B y su hipotenusa mide ${h} cm. ¿Cuánto mide OH, del circuncentro al ortocentro?`,
      datos: [D_ORECT, D_ORTO],
      opciones: ops(h / 2, [
        { id: 'hip', valor: h, error: 'GE-EU8', siFuera: 'O está en la hipotenusa, es cierto, pero en su punto medio, no en un extremo.' },
        { id: 'gh', valor: h / 3, error: 'GE-EU3', siFuera: `${h / 3} cm es GH, pero piden OH entero.` },
        { id: 'og', valor: h / 6, error: 'GE-EU3', siFuera: `${h / 6} cm es OG, pero piden OH entero.` },
      ], cm),
      solucion: { texto: 'O es el punto medio de la hipotenusa y H es B, así que OH es la mediana que va a la hipotenusa.', ecuacion: junto([`${h} ÷ 2 = `, dF(cm(h / 2))]) } };
  }
  const ideaEuler = {
    id: 'euler',
    titulo: 'La recta de Euler',
    pregunta: '¿Qué centros de un triángulo quedan en una recta?',
    temas: ['Recta y circunferencia de Euler', 'Propiedades de los puntos notables'],
    pieza: GO,
    aprendizaje: 'O, G y H están en una recta, con G entre ellos y GH = 2 · OG; la circunferencia de nueve puntos tiene radio R/2.',
    actividad: 'Mover una esquina de la cartulina y mirar dónde quedan sus cuatro centros.',
    lee: {
      tarjetas: [
        { titulo: 'Cuatro centros en una cartulina', texto: 'En la cartulina están marcados los cuatro centros que ya conoces: el baricentro G, el circuncentro O, el ortocentro H y el incentro I.',
          pieza: GO, dibujo: figO(figUno([1, 5])) },
        { titulo: 'Puntos colineales', texto: 'Tres puntos son colineales si una misma regla recta pasa por los tres. Dos puntos siempre lo son; tres, no siempre.' },
        { titulo: 'Qué mirar al jugar', texto: 'Mueve la esquina A. Mira cuándo los cuatro centros se ponen en fila y qué pasa con ellos cuando la forma cambia.' },
      ],
    },
    ejemplos: EJ6,
    juega: {
      pieza: GO,
      consigna: 'La cartulina tiene sus cuatro centros marcados; su base BC mide 8 cm y la esquina A se puede mover.',
      mision: { texto: 'Mueve A hasta que los cuatro centros queden en una sola recta.', logrado: v => v.ax === 4,
        bien: 'Listo: con AB = AC, los cuatro quedan en el eje de simetría, sin juntarse.' },
      voz: 'Compara AB con AC mientras mueves A.',
      leyenda: [
        { s: 'G', t: 'baricentro: cruce de las medianas' },
        { s: 'O', t: 'circuncentro: cruce de las mediatrices' },
        { s: 'H', t: 'ortocentro: cruce de las alturas' },
        { s: 'I', t: 'incentro: cruce de las bisectrices' },
      ],
      controles: [
        { id: 'ax', etiqueta: 'A a lo ancho', min: 0, max: 8, paso: 1, inicio: 1, unidad: 'cm', decimales: 0, color: 'c-o' },
        { id: 'ay', etiqueta: 'A a lo alto', min: 4, max: 7, paso: 1, inicio: 5, unidad: 'cm', decimales: 0, color: 'c-o' },
      ],
      dibujo: v => ({ datos: figUno([v.ax, v.ay]), estado: {} }),
      arrastres: [{ id: 'vertice-a', etiqueta: 'esquina A', color: 'c-o',
        donde: v => enPantalla(figUno([v.ax, v.ay]), [v.ax, v.ay]),
        mover: (p, v) => { const q = alPlano(figUno([v.ax, v.ay]), p); return { ax: q[0], ay: q[1] }; } }],
      lectura: v => {
        const A = [v.ax, v.ay], ab = U.dist(A, UB), ac = U.dist(A, UC);
        return Math.abs(ab - ac) < 1e-9 ? [`AB = AC = ${cm(ab)}: los cuatro quedan en el eje.`] : [`AB = ${cm(ab)} y AC = ${cm(ac)}: lados distintos.`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: PRED6,
      voz: 'En el isósceles, los cuatro se alinearon. ¿Y si los lados son distintos?',
      opciones: [
        { id: 'c', texto: 'O, G y H', correcta: true },
        { id: 'ogi', texto: 'O, G e I', error: 'GE-EU9', siFuera: 'O y G sí están en esa recta, pero el tercero es H, no I.' },
        { id: 'ghi', texto: 'G, H e I', error: 'GE-EU9', siFuera: 'G y H sí están en esa recta, pero el tercero es O, no I.' },
        { id: 'cuatro', texto: 'Los cuatro: O, G, H e I', error: 'D-COIN', siFuera: 'En el isósceles, los cuatro se alinean; en un escaleno, I sale de la recta.' },
      ],
      dibujo: figO(figEuler(EA, { objeto: 'carton', sinCentros: true, vista: VE, alt: 'Una cartulina escalena: sus centros se marcan al ver la respuesta.' })),
      revelar: figO(figEuler(EA, { objeto: 'carton', recta: 0, vista: VE, letrasFijas: LE, alt: 'La misma cartulina: una recta pasa por O, G y H; I queda fuera de ella.' })),
      coincide: 'Coincide: O, G y H están en una recta, la recta de Euler; I queda fuera.',
      noCoincide: 'Revisemos: la recta que pasa por O y H pasa también por G. I queda fuera de ella.',
    },
    mira: {
      pieza: GO,
      datos: figEuler(EA, { recta: 1, d: 2, nueve: { m: 4, f: 5, n: 6 }, letrasFijas: LE,
        alt: 'El escaleno con su recta de Euler: OG = d y GH = 2d; la circunferencia de nueve puntos pasa por los puntos medios de los lados y los pies de las alturas.' }),
      voz: 'Primero la recta; después, la circunferencia de nueve puntos.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Aquí están los cuatro centros de un triángulo escaleno.' },
        { estado: { corte: 1 }, texto: 'La recta que pasa por O y H pasa también por G.' },
        { estado: { corte: 2 }, texto: 'G queda entre O y H, y GH es el doble de OG.', ecuacion: junto([dO('GH'), ' = 2 · ', dI('OG')]) },
        { estado: { corte: 3 }, texto: 'El incentro I queda fuera de esa recta.' },
        { estado: { corte: 4 }, texto: 'Los puntos medios de los tres lados están en una circunferencia.' },
        { estado: { corte: 5 }, texto: 'Los pies de las tres alturas están en esa misma circunferencia.' },
        { estado: { corte: 6 }, texto: 'Su centro N es el punto medio de OH, y su radio mide la mitad de R.', ecuacion: junto(['radio = R ÷ 2']) },
      ],
    },
    regla: {
      texto: 'O, G y H están en una recta, la recta de Euler, con G entre ellos. La circunferencia de nueve puntos pasa por los puntos medios de los lados y los pies de las alturas, y su centro es el punto medio de OH.',
      ecuacion: [junto([dO('GH'), ' = 2 · ', dI('OG')]), Y, junto(['radio de nueve puntos = R ÷ 2'])],
      condicion: 'el triángulo no es equilátero (en el equilátero, los cuatro centros coinciden). R es el radio de la circunscrita.',
      voz: 'Tres centros en fila, en razón 1 : 2. El incentro no entra.',
    },
    resuelve: { pieza: GO, generar: resuelveEul },
    ahoraTu: {
      pieza: GO,
      voz: 'Ordena O, G y H: G va entre los dos, y GH es el doble de OG.',
      generar(s) { return conCuatro([casoGH, casoOH, casoOG, casoNueve, casoCual, casoRect][s % 6], azar(s + 7), firmasDe(EJ6, [PRED6])); },
    },
  };
  // ======================= Laboratorio =======================
  // Las tres mesas de la versión 0.2.0 (sus ids se quedan), con los colores del curso (sin verde). Usan su propia base
  // B(0, 0), C(6, 0) y sus funciones, que siguen aquí.
  function opciones(correcta, distractores, fmt, n = 4) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor) || d.valor <= 0) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, n);
  }
  const B = [0, 0], C = [6, 0];
  // Centros del triángulo ABC (B y C fijos).
  const centros = A => {
    const a = U.dist(B, C), b = U.dist(A, C), c = U.dist(A, B);
    const Gc = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
    const mAB = U.medio(A, B), mAC = U.medio(A, C);
    const O = U.corte(mAB, [mAB[0] - (B[1] - A[1]), mAB[1] + (B[0] - A[0])], mAC, [mAC[0] - (C[1] - A[1]), mAC[1] + (C[0] - A[0])]);
    const H = [A[0] + B[0] + C[0] - 2 * O[0], A[1] + B[1] + C[1] - 2 * O[1]];
    const s = a + b + c, I = [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s];
    const area = Math.abs(U.area([A, B, C])), r = area / (s / 2), R = U.dist(O, A);
    return { G: Gc, O, H, I, r, R, a, b, c, N: U.medio(O, H) };
  };
  const dentro = (P, A) => { const s1 = U.area([A, B, P]), s2 = U.area([B, C, P]), s3 = U.area([C, A, P]); return (s1 >= -1e-9 && s2 >= -1e-9 && s3 >= -1e-9) || (s1 <= 1e-9 && s2 <= 1e-9 && s3 <= 1e-9); };
  const tipo = A => { const m = Math.max(U.angulo(A, B, C), U.angulo(B, A, C), U.angulo(C, A, B)); return Math.abs(m - 90) < 0.5 ? 'rectángulo' : m > 90 ? 'obtusángulo' : 'acutángulo'; };

  // ---------- Idea 1: baricentro ----------
  // Cambia: el vértice A · Permanece: la base BC · Progresa: AG : GM, siempre 2 : 1 ·
  // Se reserva: las seis áreas iguales · Debe verse: G parte cada mediana en dos tercios y un tercio.
  const bari = (A, o = {}) => {
    const { G: Gc } = centros(A), Ma = U.medio(B, C), Mb = U.medio(A, C), Mc = U.medio(A, B), k = o.pasos || {};
    const seis = o.seis ? [['A', 'Mc', 'G'], ['Mc', 'B', 'G'], ['B', 'Ma', 'G'], ['Ma', 'C', 'G'], ['C', 'Mb', 'G'], ['Mb', 'A', 'G']].map((p, i) => ({ puntos: p, opacidad: i % 2 ? 0.06 : 0.16, desde: k.seis || 0 })) : [];
    return {
      alt: o.alt || `Las tres medianas se cortan en el baricentro G, que parte cada una en razón 2 : 1${o.seis ? '; forman seis triángulos de igual área' : ''}`,
      vista: { x: [-1.4, 7.4], y: [-1, 5.6] },
      puntos: [pt('A', A, { rotulo: 'A', lado: 90 }), pt('B', B, { rotulo: 'B', lado: -120 }), pt('C', C, { rotulo: 'C', lado: -60 }), pt('Ma', Ma, { rotulo: 'M', lado: -90 }), pt('Mb', Mb, {}), pt('Mc', Mc, {}), pt('G', Gc, { rotulo: 'G', lado: 0 })],
      regiones: seis,
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' },
        { de: 'A', a: 'G', color: 'o', grosor: 'variable', texto: o.num ? '2k' : undefined }, { de: 'G', a: 'Ma', color: 'i', grosor: 'variable', texto: o.num ? 'k' : undefined },
        { de: 'B', a: 'Mb', grosor: 'fino' }, { de: 'C', a: 'Mc', grosor: 'fino' }, { de: 'B', a: 'Ma', marcas: 1 }, { de: 'Ma', a: 'C', marcas: 1 }],
    };
  };
  // Manija del vértice A para las figuras que dependen de (ax, ay).
  const arrastreA = dib => ({ id: 'vertice-a', etiqueta: 'vértice A', color: 'c-o',
    donde: v => G.aPantalla(dib(v.ax, v.ay), [v.ax, v.ay]),
    mover: (p, v) => { const q = G.aPlano(dib(v.ax, v.ay), p); return { ax: q[0], ay: q[1] }; } });
  // ---------- Idea 2: los centros y dónde quedan ----------
  // Cambia: el vértice A y el centro elegido · Permanece: la base BC · Progresa: si el centro queda dentro o fuera ·
  // Se reserva: el triángulo rectángulo · Debe verse: cada centro sale de sus líneas y de lo que equidista.
  const NOMBRE = { I: 'incentro', O: 'circuncentro', H: 'ortocentro', G: 'baricentro' };
  // La figura de Euler de la mesa «euler-libre»: O, G y H en su recta, con la circunferencia de nueve puntos.
  // Cambia: el vértice A · Permanece: la base BC · Progresa: O, G y H sobre una recta con OG : GH = 1 : 2 ·
  // Se reserva: la circunferencia de nueve puntos · Debe verse: su centro es el punto medio de OH y su radio, R/2.
  const euler = (A, o = {}) => {
    const c = centros(A), k = o.pasos || {};
    const Ma = U.medio(B, C), Mb = U.medio(A, C), Mc = U.medio(A, B);
    const Fa = U.pie(A, B, C), Fb = U.pie(B, A, C), Fc = U.pie(C, A, B);
    const ext = [U.mezcla(c.O, c.H, -0.4), U.mezcla(c.O, c.H, 1.4)];
    return {
      alt: o.alt || `O, G y H están alineados con GH = 2 · OG${o.nueve ? `; la circunferencia de nueve puntos tiene centro en el punto medio de OH y radio ${f(c.R / 2)}` : ''}`,
      vista: { x: [-1.6, 7.6], y: [-1.6, 6.4] },
      puntos: [pt('A', A, { rotulo: 'A', lado: 90 }), pt('B', B, { rotulo: 'B', lado: -120 }), pt('C', C, { rotulo: 'C', lado: -60 }),
        pt('O', c.O, { rotulo: 'O', lado: -30 }), pt('G', c.G, { rotulo: 'G', lado: 150 }), pt('H', c.H, { rotulo: 'H', lado: 150 }),
        pt('e1', ext[0], { sinPunto: true }), pt('e2', ext[1], { sinPunto: true }),
        ...(o.nueve ? [Ma, Mb, Mc, Fa, Fb, Fc, U.medio(A, c.H), U.medio(B, c.H), U.medio(C, c.H)].map((p, i) => pt('n' + i, p, { desde: i < 3 ? k.m || 0 : i < 6 ? k.f || 0 : k.h || 0 })).concat([pt('N', c.N, { rotulo: 'N', lado: 0, desde: k.n || 0 })]) : [])],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.06 }],
      circulos: [{ centro: 'O', r: c.R, grosor: 'fino', discontinua: true }, ...(o.nueve ? [{ centro: 'N', r: c.R / 2, desde: k.n || 0 }] : [])],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }, { de: 'e1', a: 'e2', grosor: 'fino', desde: k.recta || 0 },
        { de: 'O', a: 'G', color: 'i', grosor: 'variable', texto: o.num ? 'd' : undefined, desde: k.recta || 0 }, { de: 'G', a: 'H', color: 'o', grosor: 'variable', texto: o.num ? '2d' : undefined, desde: k.recta || 0 }],
    };
  };
  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que la idea 2: los cuatro centros a la vez, con A libre en el plano (la idea lo deja a altura fija y
  // muestra un centro por vez). Deja buscar el rectángulo exacto, el isósceles con los centros alineados y el equilátero.
  const VCU = { x: [-3.4, 9.4], y: [-3.6, 7.4] };
  const fueraVista = p => p[0] < VCU.x[0] || p[0] > VCU.x[1] || p[1] < VCU.y[0] || p[1] > VCU.y[1];
  // Reto «lo más bajo con H dentro»: la menor altura de A con triángulo acutángulo, buscada en la grilla de la mesa.
  const AY_MIN_H = (() => { let m = Infinity; for (let i = 0; i <= 20; i++) for (let j = 0; j <= 10; j++) { const A = [-2 + 0.5 * i, 1 + 0.5 * j]; if (tipo(A) === 'acutángulo') m = Math.min(m, A[1]); } return m; })();
  const cuatro = (ax, ay, circ) => {
    const A = [ax, ay], c = centros(A), fuera = ['O', 'H'].filter(k => !dentro(c[k], A));
    const lejos = fueraVista;
    return {
      alt: `Triángulo ${tipo(A)}: baricentro e incentro dentro; circuncentro y ortocentro ${fuera.length ? `con ${fuera.map(k => NOMBRE[k]).join(' y ')} fuera` : 'dentro'}`,
      vista: VCU,
      puntos: [pt('A', A, { rotulo: 'A', lado: 90 }), pt('B', B, { rotulo: 'B', lado: -120 }), pt('C', C, { rotulo: 'C', lado: -60 }),
        ...['O', 'H', 'G', 'I'].filter(k => !lejos(c[k])).map(k => pt(k, c[k], { rotulo: k, color: undefined, lado: { O: -30, H: 150, G: 30, I: -150 }[k] }))],
      regiones: [{ puntos: ['A', 'B', 'C'], color: 'i', opacidad: 0.08 }],
      circulos: circ === 'O' ? [{ centro: c.O, r: c.R, color: 'i', discontinua: true }] : circ === 'I' ? [{ centro: c.I, r: c.r }] : [],
      segmentos: [{ de: 'A', a: 'B' }, { de: 'B', a: 'C' }, { de: 'C', a: 'A' }],
    };
  };
  const mesaCuatro = {
    id: 'cuatro-centros', titulo: 'Los cuatro centros juntos', pieza: 'geo-figura',
    consigna: 'Arrastra A por todo el plano. Mira qué centros salen y cuándo se juntan. Elige qué circunferencia ver.',
    controles: [
      { id: 'ax', etiqueta: 'A a lo ancho', min: -2, max: 8, paso: 0.5, inicio: 1.5, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'ay', etiqueta: 'A a lo alto', min: 1, max: 6, paso: 0.5, inicio: 4, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'circ', etiqueta: 'Circunferencia', opciones: [{ valor: 'no', texto: 'ninguna' }, { valor: 'O', texto: 'circunscrita' }, { valor: 'I', texto: 'inscrita' }] },
    ],
    dibujo: v => ({ datos: cuatro(v.ax, v.ay, v.circ), estado: {} }),
    arrastres: [arrastreA((ax, ay) => cuatro(ax, ay, 'no'))],
    lectura: v => {
      const A = [v.ax, v.ay], c = centros(A), fuera = ['O', 'H'].filter(k => !dentro(c[k], A));
      return [`${tipo(A)}   ·   fuera: ${fuera.length ? fuera.join(' y ') : 'ninguno'}`];
    },
    // Retos comprobados con centros(), dentro() y tipo(): las mismas funciones que dibujan la mesa.
    invitaciones: [
      { texto: 'Muestra la circunscrita y lleva su centro justo sobre el lado BC.',
        logrado: v => v.circ === 'O' && Math.abs(centros([v.ax, v.ay]).O[1]) < 1e-9,
        bien: 'O quedó en el medio de BC: el ángulo en A es recto. ¿Dónde está H?' },
      { texto: 'Saca del triángulo al circuncentro y al ortocentro a la vez.',
        logrado: v => { const A = [v.ax, v.ay], c = centros(A); return !dentro(c.O, A) && !dentro(c.H, A); },
        bien: 'Salieron los dos porque un ángulo es obtuso. Comprueba que G e I siguen dentro.' },
      { texto: 'Baja A lo más que puedas sin que el ortocentro salga del triángulo.',
        logrado: v => v.ay === AY_MIN_H && tipo([v.ax, v.ay]) === 'acutángulo',
        bien: 'Más abajo ya no hay acutángulo: un ángulo llega a 90° o más. ¿Cuál?' },
      { texto: 'Pon los cuatro centros sobre una misma recta, todos a la vista.',
        logrado: v => { const c = centros([v.ax, v.ay]); return ['O', 'H', 'G', 'I'].every(k => Math.abs(c[k][0] - c.G[0]) < 1e-9 && !fueraVista(c[k])); },
        bien: 'Con AB = AC, los cuatro caen en el eje de simetría. Mueve A y compara.' },
      { texto: 'Guarda un acutángulo y un obtusángulo, y compara dónde queda el ortocentro.',
        logrado: (v, guardados) => guardados.some(g => tipo([g.ax, g.ay]) === 'acutángulo') && guardados.some(g => tipo([g.ax, g.ay]) === 'obtusángulo'),
        bien: 'H queda dentro en uno y fuera en el otro: depende del ángulo mayor.' },
    ],
  };
  // Mesa 2, más rica que la idea 3: la circunferencia de nueve puntos siempre a la vista y A en un rango más amplio
  // (también obtusángulos, donde H sale del triángulo y la recta sigue).
  const mesaEuler = {
    id: 'euler-libre', titulo: 'Euler con nueve puntos', pieza: 'geo-figura',
    consigna: 'Arrastra A, también hasta un obtusángulo. Comprueba que O, G y H siguen en línea y el radio, R/2.',
    controles: [
      { id: 'ax', etiqueta: 'A a lo ancho', min: -1, max: 7, paso: 0.5, inicio: 1.5, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'ay', etiqueta: 'A a lo alto', min: 2, max: 6, paso: 0.5, inicio: 4.5, unidad: '', decimales: 1, color: 'c-o' },
    ],
    dibujo: v => ({ datos: Object.assign(euler([v.ax, v.ay], { nueve: true }), { vista: { x: [-2.4, 8.4], y: [-3.4, 6.8] } }), estado: {} }),
    arrastres: [arrastreA((ax, ay) => Object.assign(euler([ax, ay], { nueve: true }), { vista: { x: [-2.4, 8.4], y: [-3.4, 6.8] } }))],
    lectura: v => {
      const c = centros([v.ax, v.ay]), og = U.dist(c.O, c.G);
      return [{ v: 'c-o', t: 'GH' }, ` : `, { v: 'c-i', t: 'OG' }, ` = ${og < 1e-6 ? '—' : f(U.dist(c.G, c.H) / og)}   ·   R/2 = ${f(c.R / 2)}`];
    },
    invitaciones: [
      { texto: 'Haz que el ortocentro H caiga justo en un vértice.',
        logrado: v => { const A = [v.ax, v.ay], H = centros(A).H; return [A, B, C].some(P => U.dist(H, P) < 1e-9); },
        bien: 'H quedó en el vértice del ángulo recto. Ubica ahora O: ¿en qué lado quedó?' },
      { texto: 'Busca el menor radio posible de la circunferencia de nueve puntos.',
        logrado: v => Math.abs(centros([v.ax, v.ay]).R - R_MIN_E) < 1e-9,
        bien: 'R/2 = 1,5: el menor, cuando BC es diámetro de la circunscrita.' },
      { texto: 'Pon la recta de Euler vertical, perpendicular a BC.',
        logrado: v => { const c = centros([v.ax, v.ay]); return Math.abs(c.O[0] - c.H[0]) < 1e-9 && U.dist(c.O, c.H) > 1e-9; },
        bien: 'La recta queda vertical cuando AB = AC. ¿El incentro también cae en ella?' },
      { texto: 'Guarda dos triángulos de formas distintas con el mismo radio R/2.',
        logrado: (v, guardados) => guardados.some((g, i) => guardados.some((h, j) => j > i && Math.abs(centros([g.ax, g.ay]).R - centros([h.ax, h.ay]).R) < 1e-6
          && !(g.ay === h.ay && (g.ax === h.ax || g.ax === 6 - h.ax)))),
        bien: 'Con el mismo R, el radio de nueve puntos no cambia; solo se mueve su centro.' },
    ],
  };
  // Menor circunradio en la grilla de la mesa de Euler (el reto lo pide sin decir dónde está).
  const R_MIN_E = (() => { let m = Infinity; for (let i = 0; i <= 16; i++) for (let j = 0; j <= 8; j++) m = Math.min(m, centros([-1 + 0.5 * i, 2 + 0.5 * j]).R); return m; })();
  // Mesa 3: las seis áreas del baricentro, que la idea 1 reserva para la predicción, con A libre y el área en vivo.
  const sexto = v => Math.abs(U.area([[v.ax, v.ay], B, C])) / 6;
  const SEXTO_MAX = (() => { let m = 0; for (let i = 0; i <= 16; i++) for (let j = 0; j <= 8; j++) m = Math.max(m, sexto({ ax: -1 + 0.5 * i, ay: 1 + 0.5 * j })); return m; })();
  const seisLibre = (ax, ay) => bari([ax, ay], { seis: true, alt: `Las medianas parten el triángulo en seis de área ${f(Math.abs(U.area([[ax, ay], B, C])) / 6)} cada uno` });
  const mesaSeis = {
    id: 'seis-areas', titulo: 'Seis triangulitos del baricentro', pieza: 'geo-figura',
    consigna: 'Arrastra A y deforma el triángulo. Mira el área de cada uno de los seis triangulitos.',
    controles: [
      { id: 'ax', etiqueta: 'A a lo ancho', min: -1, max: 7, paso: 0.5, inicio: 1, unidad: '', decimales: 1, color: 'c-o' },
      { id: 'ay', etiqueta: 'A a lo alto', min: 1, max: 5, paso: 0.5, inicio: 4.5, unidad: '', decimales: 1, color: 'c-o' },
    ],
    dibujo: v => ({ datos: seisLibre(v.ax, v.ay), estado: {} }),
    arrastres: [arrastreA(seisLibre)],
    lectura: v => { const S = Math.abs(U.area([[v.ax, v.ay], B, C])); return [`área ${f(S)}   ·   cada uno ${f(S / 6)}`]; },
    invitaciones: [
      { texto: 'Consigue que cada triangulito mida justo 1,5.',
        logrado: v => Math.abs(sexto(v) - 1.5) < 1e-9,
        bien: 'El área 9 se reparte en seis. Mueve A a lo ancho: ¿cambia algún triangulito?' },
      { texto: 'Deforma el triángulo hasta que un ángulo quede obtuso.',
        logrado: v => tipo([v.ax, v.ay]) === 'obtusángulo',
        bien: 'Aun con un ángulo obtuso, las seis áreas siguen iguales.' },
      { texto: 'Busca la mayor área que puede tener cada triangulito.',
        logrado: v => Math.abs(sexto(v) - SEXTO_MAX) < 1e-9,
        bien: 'A en lo más alto da el área mayor; moverla a lo ancho no la cambia.' },
      { texto: 'Guarda dos triángulos de formas distintas con triangulitos de igual área.',
        logrado: (v, guardados) => guardados.some((g, i) => guardados.some((h, j) => j > i && Math.abs(sexto(g) - sexto(h)) < 1e-9
          && !(g.ay === h.ay && (g.ax === h.ax || g.ax === 6 - h.ax)))),
        bien: 'Con la misma altura sobre BC salen las mismas seis áreas, aunque cambie la forma.' },
    ],
  };


  // Toda figura de ejemplo con lo pedido («?») va con el aviso: se dibuja con otras medidas que las del enunciado, y lo
  // pedido no se mide en ella (lección 5 de la etapa 5).
  // Salvo donde lo pedido sale de la regla misma (G a dos tercios de la mediana, OC = OA, AK = AF): ahí el dibujo sí está a
  // escala y decir lo contrario sería falso (cierre del 26 nov, lector A); la prueba mide las demás.
  const A_ESCALA = new Set(['Del vértice al baricentro', 'El tramo corto dado', 'La escuadra de cartón', 'Tres postes y un foco', 'Dos tangentes desde A']);
  for (const EJ of [EJ1, EJ2, EJ3, EJ4, EJ5, EJ6]) for (const e of EJ) {
    if (e.figura && /"texto":"[^"]*\?"/.test(JSON.stringify(e.figura)) && !/a escala/.test(e.enunciado) && !A_ESCALA.has(e.titulo)) e.enunciado += NO_ESC;
  }

  return {
    unidad: 'geometria.puntos-notables',
    version: '0.3.0',
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/geo-figura.js', '/nucleo/kit/piezas/geo-objeto.js'],
    historia: {
      texto: 'Los puntos notables no llegaron como un solo descubrimiento. La circunferencia de nueve puntos es un ejemplo: Brianchon y Poncelet describieron sus propiedades en 1821, y Feuerbach publicó en 1822 su tangencia con la inscrita y las exinscritas. Cada afirmación (qué puntos están, dónde está el centro, con qué es tangente) necesita su propia justificación.',
      pregunta: '¿Qué tienen en común nueve puntos tan distintos?',
      fuente: { titulo: 'K. S. Kedlaya, Geometry Unbound, cap. 7', url: 'https://kskedlaya.org/geometryunbound/gu-060118.pdf' },
    },
    letras: { k: 'la medida de una parte (AG = 2k, GM = k)', x: 'lo que se pide, un número', P: 'el punto que mueves en el juego',
      M: 'el punto medio de BC', N: 'el punto medio de AC', S: 'el área del triángulo', s: 'el semiperímetro: la mitad del perímetro',
      a: 'el lado BC', b: 'el lado CA', c: 'el lado AB', D: 'donde la inscrita toca BC', F: 'donde la inscrita toca AB', K: 'donde la inscrita toca AC',
      T: 'donde la exinscrita toca la prolongación de AB' },
    // Glosario: lo que este tema estrena. Mediana, mediatriz, bisectriz, altura, pie, circunscrita e inscrita vienen de
    // unidades anteriores. «incentro» se mudó aquí desde Proporcionalidad y semejanza (etapa 8). Ninguna definición dice la
    // respuesta de una predicción (dónde queda cada centro, cómo parte la mediana, cuáles quedan en una recta).
    glosario: [
      { termino: 'punto notable', formas: ['puntos notables', 'punto notable'],
        simple: 'Un cruce especial: tres líneas del mismo tipo pasan por él.',
        def: 'Cruce de tres líneas del triángulo: medianas, alturas, bisectrices o mediatrices; en el excentro, una bisectriz interior y dos exteriores.',
        ejemplos: ['Las tres medianas pasan por el baricentro.', 'Las tres mediatrices pasan por el circuncentro.', 'Las tres alturas pasan por el ortocentro.'],
        ver: ['baricentro', 'circuncentro', 'ortocentro', 'incentro'] },
      { termino: 'baricentro', simbolo: 'G',
        simple: 'El cruce de las tres medianas: donde la cartulina se sostiene sola.',
        def: 'Punto donde se cortan las tres medianas de un triángulo. Es el punto de equilibrio de una lámina triangular pareja.',
        ejemplos: ['En la cartulina, el punto donde la sostiene la punta del lápiz.', 'En un equilátero, el centro de la figura.', 'Con una mediana de 15 cm, AG = 10 cm.'],
        ver: ['mediana', 'punto de equilibrio'] },
      { termino: 'punto de equilibrio', formas: ['punto de equilibrio', 'equilibrio'],
        simple: 'Donde apoyas algo con un dedo y no se cae para ningún lado.',
        def: 'Punto de apoyo de un objeto en el que su peso queda parejo a todos lados y no se inclina.',
        ejemplos: ['Una regla se sostiene en su mitad.', 'Un plato se sostiene en su centro.', 'Una cartulina triangular, en su baricentro.'],
        ver: ['baricentro'] },
      { termino: 'circuncentro', simbolo: 'O',
        simple: 'El punto que queda igual de lejos de las tres esquinas.',
        def: 'Punto donde se cortan las mediatrices de los lados de un triángulo. Está a igual distancia de los tres vértices.',
        ejemplos: ['El tanque a igual distancia de tres casas.', 'El centro de la circunferencia que pasa por A, B y C.', 'Si OA = 9 m, también OB = 9 m y OC = 9 m.'],
        ver: ['mediatriz', 'circunscrita', 'circunradio'] },
      { termino: 'circunradio', simbolo: 'R',
        simple: 'Lo que mide cada tubo cuando los tres miden igual.',
        def: 'Radio de la circunferencia que pasa por los tres vértices de un triángulo: la distancia del circuncentro a cada vértice.',
        ejemplos: ['En el juego de las casas, unos 44,72 m.', 'Con una hipotenusa de 26 cm, R = 13 cm.', 'Un triángulo con R = 5 cabe en un círculo de radio 5.'],
        ver: ['circuncentro'] },
      { termino: 'incentro', simbolo: 'I',
        simple: 'El punto que queda igual de lejos de los tres bordes.',
        def: 'Punto donde se cortan las tres bisectrices de un triángulo; es el centro de la circunferencia inscrita.',
        ejemplos: ['El centro de la pileta más grande de un parque triangular.', 'Si I está a 3 cm de BC, también está a 3 cm de AB.', 'En un equilátero, coincide con el baricentro.'],
        ver: ['bisectriz', 'circunferencia inscrita', 'inradio'] },
      { termino: 'inradio', simbolo: 'r',
        simple: 'El radio de la pileta que toca los tres bordes.',
        def: 'Radio de la circunferencia inscrita: la distancia del incentro a cada lado, medida a escuadra.',
        ejemplos: ['En el parque de 12, 16 y 20 m, mide 4 m.', 'Con área 24 cm² y s = 12 cm, mide 2 cm.', 'Es menor que la mitad de cualquier altura.'],
        ver: ['incentro', 'semiperímetro'] },
      { termino: 'semiperímetro', simbolo: 's',
        simple: 'La mitad de la vuelta completa al triángulo.',
        def: 'La mitad del perímetro de un triángulo: la suma de sus tres lados, dividida entre 2.',
        ejemplos: ['Lados de 5, 7 y 8 cm: s = 10 cm.', 'Perímetro de 30 m: s = 15 m.', 'Lados de 6, 8 y 10 m: s = 12 m.'],
        ver: ['inradio'] },
      { termino: 'ortocentro', simbolo: 'H',
        simple: 'El cruce de los caminos más cortos de cada esquina al borde de enfrente.',
        def: 'Punto donde se cortan las tres alturas de un triángulo, o las rectas que las contienen.',
        ejemplos: ['El cruce de las tres trochas entre los pueblos.', 'En un triángulo rectángulo en B, es el vértice B.', 'En un equilátero, coincide con el baricentro.'],
        ver: ['altura', 'pie de la altura'] },
      { termino: 'pie de la altura', formas: ['pie de la altura', 'pies de las alturas', 'pie de una altura'],
        simple: 'Donde la trocha llega a la carretera de enfrente.',
        def: 'Punto donde la altura llega a la recta del lado opuesto. Puede caer sobre la prolongación del lado.',
        ejemplos: ['La altura desde A llega a BC en su pie.', 'En un triángulo rectángulo, el pie de una altura puede ser un vértice.', 'En la escuadra, el pie de la altura a la hipotenusa cae en ella.'],
        ver: ['ortocentro'] },
      { termino: 'excentro', simbolo: 'E',
        simple: 'Un punto de afuera igual de lejos de las tres rectas de los lados.',
        def: 'Corte de la bisectriz interior de un ángulo del triángulo con las bisectrices exteriores de los otros dos.',
        ejemplos: ['El centro de la glorieta de afuera, frente a BC.', 'Con m∠A = 50°, m∠BEC = 65°.', 'El excentro relativo a BC está en la bisectriz de A.'],
        ver: ['bisectriz exterior', 'circunferencia exinscrita'] },
      { termino: 'circunferencia exinscrita', formas: ['circunferencia exinscrita', 'circunferencias exinscritas', 'exinscrita', 'exinscritas'],
        simple: 'Una rueda de afuera que toca un lado y la prolongación de los otros.',
        def: 'Circunferencia que toca un lado por fuera y las prolongaciones de los otros dos; su centro es un excentro.',
        ejemplos: ['La glorieta que toca la avenida BC desde afuera.', 'Frente a BC, toca la prolongación de AB en T.', 'Desde A, su tangente mide el semiperímetro.'],
        ver: ['excentro'] },
      { termino: 'recta de Euler', formas: ['recta de Euler', 'rectas de Euler'],
        simple: 'Una línea recta que pasa por tres centros del mismo triángulo.',
        def: 'Recta que une tres puntos notables de un triángulo no equilátero; Leonhard Euler la estudió en 1765.',
        ejemplos: ['Con OG = 4 cm, GH = 8 cm.', 'En un isósceles, es su eje de simetría.', 'En un equilátero, no hay una sola: los centros coinciden.'],
        ver: ['circunferencia de nueve puntos', 'colineales'] },
      { termino: 'colineales', formas: ['colineales', 'colineal'],
        simple: 'Puntos por los que pasa una misma regla recta.',
        def: 'Puntos que están en una misma recta.',
        ejemplos: ['Tres casas a lo largo de una carretera recta.', 'A, I, M y E, sobre la bisectriz de A.', 'El punto medio de un segmento y sus extremos.'],
        ver: ['recta de Euler'] },
      { termino: 'circunferencia de nueve puntos', formas: ['circunferencia de nueve puntos', 'circunferencia de los nueve puntos'],
        simple: 'Pasa por el medio de cada lado y por el pie de cada altura.',
        def: 'Pasa por los pies de las alturas y los puntos medios de los lados y de AH, BH y CH.',
        ejemplos: ['Con R = 14 cm, su radio mide 7 cm.', 'Su centro es el punto medio de OH.', 'En la escuadra de hipotenusa 20 cm, su radio mide 5 cm.'],
        ver: ['recta de Euler'] },
    ],
    laboratorio: [mesaCuatro, mesaEuler, mesaSeis],
    // Laboratorio: los cuatro centros con A libre (ideas 2 y 4), Euler con los nueve puntos (idea 6) y las seis áreas (idea 1).
    laboratorioIdeas: { 'cuatro-centros': ['circuncentro', 'ortocentro'], 'euler-libre': ['euler'], 'seis-areas': ['baricentro'] },
    ideas: [ideaBaricentro, ideaCircuncentro, ideaIncentro, ideaOrtocentro, ideaExcentro, ideaEuler],
  };
});
