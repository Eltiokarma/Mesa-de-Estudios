/*
 * Pieza «fis-rio» (18 nov 2026, Movimiento rectilíneo uniforme, idea 5 «Velocidad relativa»; docs/etapa4/propuesta-fisica.md
 * §1, A5, y decisiones del 18 nov: «el río en una recta entra en A5»): un río de la sierra visto de costado, con su
 * corriente, un bote que va río abajo o río arriba y una persona parada en la orilla. Todo en una sola recta: el bote
 * no cruza el río (eso es suma de vectores en el plano, de Vectores). Dibujos de prueba (data-prueba).
 *
 * Afirmación de la figura: el agua lleva al bote; desde la orilla, la velocidad del bote es la suya respecto al agua más
 * la de la corriente, con su sentido.
 *
 * datos = {
 *   sentido: 'abajo' | 'arriba',            // río abajo: el bote va con la corriente (hacia la derecha); arriba: en contra
 *   u: '5 m/s',                             // rótulo de la flecha del bote (respecto al agua); sin u, sin flecha
 *   c: '2 m/s',                             // rótulo de la corriente (las flechitas del agua)
 *   total: { texto: '7 m/s', desde },       // opcional: la velocidad vista desde la orilla, en una flecha encima
 *   cota: { de: 0.2, a: 0.9, texto: 'L = 120 m', color: 'f' },   // opcional: un tramo del río (fracciones del ancho)
 *   bote: 0.5,                              // dónde va el bote, como fracción del ancho (0 a 1)
 * }
 * estado = { corte }: la flecha `total` con `desde` aparece cuando corte ≥ desde («Mira»). Función pura de (datos, estado): sin ids, sin azar, sin reloj. Ancho 320, alto fijo.
 *
 * Largo de las flechas (auditoría de MRU, 18 nov, M7: la flecha «u − c» río arriba salía más larga que la de u). Las
 * flechas comparten escala (docs/molde-unidad.md §6): si u y c son números en m/s, cada flecha (u, cada flechita de la
 * corriente y la vista desde la orilla) mide su valor por los mismos px por m/s, y la de la orilla va hacia donde da
 * la suma con signo (+ río abajo). Si son letras o «?», un largo de muestra: u = 56 px, c = 22 px y la de la orilla
 * mide |±u + c| con esos largos (río arriba, más corta que u). Abajo a la derecha, el eje: «+» hacia río abajo.
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
  const W = 320, H = 182, TXT = 14, AGUA = 96, FONDO = 138, ORILLA = 58;
  const Y = { TOTAL: 28, U: 56, CORRIENTE: 112, CORRIENTE_T: 132, COTA: 154, COTA_T: 172, EJE: 127 };
  const n = T.n;
  const BASE = { sentido: 'abajo', u: '', c: '', bote: 0.55 };
  const caja = (x, y, texto, ancla, peso = 700) => {
    const w = T.ancho(texto, TXT, peso), xx = T.encajar(x, texto, ancla, { tam: TXT, peso, min: 4, max: W - 4 });
    const izq = ancla === 'middle' ? xx - w / 2 : ancla === 'end' ? xx - w : xx;
    return { x0: izq, x1: izq + w, y0: y - TXT * 0.78, y1: y + TXT * 0.22, x: xx, y, texto, ancla, peso };
  };
  const XR = f => ORILLA + 10 + (W - 14 - ORILLA - 10) * f;   // fracción del río → x

  // Un rótulo «5 m/s» o «1,5 m/s» → 5 o 1,5; letras, «?» o vacío → null.
  const valor = t => { const m = String(t || '').match(/^\s*(\d+(?:,\d+)?)\s*m\/s\s*$/); return m ? Number(m[1].replace(',', '.')) : null; };
  const MUESTRA = { u: 56, c: 22 }, PXMAX = 12, LMAX = 100;   // px por m/s como mucho; la flecha más larga, 100 px
  function geometria(datos, estado = {}) {
    const d = Object.assign({}, BASE, datos || {}), g = { d, rotulos: [] }, corte = Number.isFinite(estado.corte) ? estado.corte : Infinity;
    const dir = d.sentido === 'arriba' ? -1 : 1, bx = XR(d.bote);
    g.bote = { x: bx, dir };
    // La escala: con u y c en números, la misma para todas las flechas; si no, los largos de muestra.
    const nu = valor(d.u), nc = valor(d.c);
    const numeros = nu !== null && (nc !== null || !d.c);
    const vu = numeros ? dir * nu : dir * MUESTRA.u, vc = numeros ? (nc || 0) : MUESTRA.c, vt = vu + vc;
    const k = numeros ? Math.min(PXMAX, LMAX / Math.max(Math.abs(vu), Math.abs(vc), Math.abs(vt), 1e-9)) : 1;
    g.escala = numeros ? k : null;
    // Cada flecha lleva su rótulo encima, centrado (el rótulo es largo: «5 m/s respecto al agua»).
    const conRotulo = (y, texto, v) => {
      const x2 = bx + v * k, c = caja((bx + x2) / 2, y - 12, texto, 'middle');
      g.rotulos.push(c);
      return { x1: bx, x2, y, caja: c, valor: numeros ? v : null };
    };
    if (d.u) g.u = conRotulo(Y.U, `${d.u} respecto al agua`, vu);
    if (d.total && (d.total.desde === undefined || corte >= d.total.desde)) g.total = conRotulo(Y.TOTAL, `${d.total.texto} desde la orilla`, vt);
    // la corriente: tres flechitas en el agua, siempre río abajo (hacia la derecha), con el largo de su valor, y su rótulo
    const Lc = vc * k;
    g.corriente = [0.08, 0.42, 0.76].map(f => ({ x1: XR(f), x2: XR(f) + Lc }));
    if (d.c) { g.cc = caja(XR(0.08), Y.CORRIENTE_T, `corriente: ${d.c}`, 'start'); g.rotulos.push(g.cc); }
    g.orilla = caja(6, FONDO - 4, 'Orilla', 'start', 400);
    g.rotulos.push(g.orilla);
    // el eje: «+» hacia río abajo, en el agua, abajo a la derecha (bajo la corriente y lejos de su rótulo)
    g.eje = { x1: W - 32, x2: W - 12, y: Y.EJE };
    g.mas = caja(W - 36, Y.EJE + 5, '+', 'end');
    g.rotulos.push(g.mas);
    if (d.cota) {
      const a = XR(d.cota.de), b = XR(d.cota.a);
      g.cota = { a: Math.min(a, b), b: Math.max(a, b), caja: caja((a + b) / 2, Y.COTA_T, d.cota.texto, 'middle') };
      g.rotulos.push(g.cota.caja);
    }
    return g;
  }

  // El bote de costado, con quien rema; mira hacia dir.
  function bote(x, dir) {
    const X = dx => n(x + dir * dx), w = AGUA;
    const s = `<path d="M${X(-26)} ${n(w - 10)}L${X(26)} ${n(w - 10)}Q${X(22)} ${n(w + 4)} ${X(10)} ${n(w + 4)}L${X(-18)} ${n(w + 4)}Q${X(-26)} ${n(w + 2)} ${X(-26)} ${n(w - 10)}Z" fill="var(--card)" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`
      + `<circle cx="${X(-4)}" cy="${n(w - 33)}" r="5" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`
      + `<path d="M${X(-4)} ${n(w - 28)}L${X(-6)} ${n(w - 12)}M${X(-5)} ${n(w - 22)}L${X(6)} ${n(w - 18)}M${X(12)} ${n(w - 28)}L${X(-2)} ${n(w + 2)}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`;
    return `<g class="kit-objeto" data-objeto="bote" data-prueba="si">${s}</g>`;
  }
  // Quien mira desde la orilla (palitos), de pie en el borde.
  function persona(x, piso) {
    const s = `<circle cx="${n(x)}" cy="${n(piso - 42)}" r="6" fill="var(--card)" stroke="currentColor" stroke-width="2"/>`
      + `<path d="M${n(x)} ${n(piso - 36)}L${n(x)} ${n(piso - 14)}M${n(x)} ${n(piso - 14)}L${n(x - 6)} ${piso}M${n(x)} ${n(piso - 14)}L${n(x + 6)} ${piso}M${n(x)} ${n(piso - 30)}L${n(x - 7)} ${n(piso - 20)}M${n(x)} ${n(piso - 30)}L${n(x + 7)} ${n(piso - 20)}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>`;
    return `<g class="kit-objeto" data-objeto="persona" data-prueba="si">${s}</g>`;
  }

  function dibujar(datos, estado = {}) {
    const g = geometria(datos, estado), d = g.d, co = T.color('o');
    const rot = (b, color) => T.rotulo(b.x, b.y, b.texto, { ancla: b.ancla, peso: b.peso, color, tam: TXT, min: 4, max: W - 4 });
    // el agua, con la superficie ondulada, y la orilla de tierra a la izquierda
    let ola = `M${ORILLA} ${AGUA}`;
    for (let x = ORILLA; x < W - 6; x += 16) ola += `Q${n(x + 4)} ${AGUA - 3} ${n(x + 8)} ${AGUA}T${n(x + 16)} ${AGUA}`;
    let s = `<g data-prueba="si" class="fis-rio"><rect x="${ORILLA}" y="${AGUA}" width="${W - 6 - ORILLA}" height="${FONDO - AGUA}" fill="currentColor" fill-opacity="0.1"/>`
      + `<path d="${ola}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.6"/>`
      + `<path d="M4 ${AGUA - 10}H${ORILLA}L${ORILLA + 6} ${FONDO}H4Z" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></g>`;
    s += persona(30, AGUA - 10);
    for (const f of g.corriente) s += `<g opacity="0.75">${T.flecha(f.x1, Y.CORRIENTE, f.x2, Y.CORRIENTE, { color: 'o', grosor: 2 })}</g>`;
    s += bote(g.bote.x, g.bote.dir);
    if (g.u) s += T.flecha(g.u.x1, g.u.y, g.u.x2, g.u.y, { color: 'o', grosor: 3 }) + rot(g.u.caja, 'o');
    if (g.total) s += `<g>${T.flecha(g.total.x1, g.total.y, g.total.x2, g.total.y, { color: 'o', grosor: 3 })}</g>`
      + ` <line x1="${n(g.total.x1)}" y1="${Y.TOTAL}" x2="${n(g.total.x1)}" y2="${Y.U - 22}" stroke="${co}" stroke-width="1.5" stroke-dasharray="3 3"/>` + rot(g.total.caja, 'o');
    if (g.cc) s += rot(g.cc, 'o');
    s += rot(g.orilla);
    s += `<line x1="${n(g.eje.x1)}" y1="${g.eje.y}" x2="${n(g.eje.x2)}" y2="${g.eje.y}" stroke="currentColor" stroke-width="1.5"/>`
      + `<path d="M${n(g.eje.x2 + 4)} ${g.eje.y}l-8 -4.5v9z" fill="currentColor"/>` + rot(g.mas);
    if (g.cota) {
      const k = T.color(d.cota.color);
      s += `<path d="M${n(g.cota.a)} ${Y.COTA - 6}V${Y.COTA}H${n(g.cota.b)}V${Y.COTA - 6}" fill="none" stroke="${k}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>` + rot(g.cota.caja, d.cota.color);
    }
    return T.svg(W, H, s, { alt: alt(datos) });
  }

  function alt(datos) {
    const d = Object.assign({}, BASE, datos || {});
    let s = `Un río visto de costado, con una persona parada en la orilla. Un bote va río ${d.sentido === 'arriba' ? 'arriba, contra la corriente' : 'abajo, con la corriente'}.`;
    if (d.u) s += ` Respecto al agua, el bote va a ${d.u}.`;
    if (d.c) s += ` La corriente lleva ${d.c} hacia la derecha.`;
    if (d.total) s += ` Desde la orilla se ve a ${d.total.texto}.`;
    if (d.cota) s += ` Abajo, un tramo del río: ${d.cota.texto}.`;
    s += ' El sentido + es río abajo, hacia la derecha.';
    return s;
  }

  return { id: 'fis-rio', dibujar, alt, geometria, constantes: { W, H, Y, AGUA } };
});
