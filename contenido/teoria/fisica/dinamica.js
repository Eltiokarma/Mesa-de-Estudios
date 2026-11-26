/*
 * Teoría de «Dinámica» (fisica.dinamica), para 5.º de secundaria y preuniversitario. Rehecha el 19 nov 2026 con el
 * método delegado (docs/metodo/unidad/etapa-delegada.md; propuesta en docs/etapa7/propuesta-fisica.md; Gerson delegó el
 * criterio y revisa después). Octava unidad de la rama «Mecánica», después de Estática: usa la primera y la tercera ley,
 * el DCL, el rozamiento y la normal de Estática, las fórmulas de MRUV como dato y la aceleración centrípeta de
 * Movimiento circular (no la vuelve a enseñar). Deja el trabajo y la energía para «Trabajo, energía y potencia».
 *
 * Las seis ideas, en orden (los seis ids son los publicados; todas estrenan otra Predice: Avance.migrar, en
 * nucleo/avance.js, borra una vez las predicciones viejas sin huella con la marca prediccionDN):
 *   1 `fuerza-neta-acelera` «Segunda ley de Newton» ........ el carrito del mercado.
 *   2 `masa-y-peso` «Masa y peso» ............................ la balanza de resorte en la Tierra, Marte y la Luna.
 *   3 `rozamiento-en-movimiento` «Rozamiento en movimiento» .. el costal que se arrastra por el almacén.
 *   4 `plano-y-polea` «Bloques unidos por una cuerda» ........ el costal sobre la mesa y el balde que cuelga.
 *   5 `ascensor-y-marcos` «Peso aparente en el ascensor» ..... la balanza de baño dentro del ascensor.
 *   6 `centripeta-es-resultante` «Dinámica circular» ......... el auto en la cima de una loma.
 * Objetos: pieza fis-estatica (nucleo/kit/piezas/fis-estatica.js) con su bloque de Dinámica (carrito, ascensor, auto,
 * pista y disco); dibujos de prueba (data-prueba).
 *
 * Letras (propuesta §5; campo `letras`): F una fuerza de una mano, un motor o una cuerda que jala; ΣF la fuerza neta;
 * m la masa (m₁, m₂ las de cada bloque); a la aceleración; P el peso; g = 10 m/s² (g_L la de la Luna, g_M la de Marte);
 * N la normal y lo que marca una balanza; T la tensión; f_k y f_s el rozamiento cinético y estático, μ_k y μ_s sus
 * coeficientes; θ un ángulo; v y v₀ la rapidez al final y al empezar; t el tiempo; d la distancia recorrida; r el radio de
 * la curva, a_c la aceleración centrípeta y ω la rapidez angular.
 * REGLA DE COLORES (propuesta §6; tabla COLORES): un color fijo por clase de fuerza, el de Estática, el mismo en el juego,
 *   la figura, la fórmula, los datos, los ejemplos y «Ahora tú»:
 *   - carmín (c-h): el peso P⃗ y g (g_L, g_M);
 *   - violeta (c-f): la normal N⃗, lo que marca una balanza y toda fuerza de un apoyo;
 *   - naranja (c-o): lo que jala o empuja desde afuera: la tensión T⃗ y la fuerza F⃗ de una mano o un motor;
 *   - turquesa (c-i): el rozamiento f⃗ (f_k, f_s);
 *   - tinta: la aceleración a⃗ (flecha punteada, al lado del cuerpo), la fuerza neta ΣF⃗, m, v⃗ (flecha continua sobre el
 *     cuerpo), t, d, μ, θ, r, a_c, ω, los objetos y lo que se pide en una figura («?»). La respuesta de una aceleración va
 *     en negrita (decisión 3 de la propuesta: el carmín de la aceleración en MRUV chocaría con el del peso).
 *   Sin verde (0,010 junto al naranja en protanopía).
 * Errores (docs/investigacion/dinamica-ideas-erroneas.md D1, D3, D5, D9; estatica-energia W5; la trampa «N = P» de San
 *   Marcos). Los demás son hipótesis de diseño (AC-FRENA, DN-*, MP-*, RM-*, PL-*, AS-*, DC-*), descritos en el informe de
 *   dinámica, «Dinámica (19 nov 2026)».
 *
 * Molde: docs/teoria.md y docs/molde-unidad.md. Fuente: docs/teoria/matriz/fisica.json (unidad 5) y la propuesta.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const G = 10;
  const PI = Math.PI;
  const rad = d => d * PI / 180;
  // Azar con semilla para «Ahora tú» y «Así se resuelve» (el mismo de Estática).
  function azar(sm) {
    let q = (sm * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = arr => arr[Math.floor(r() * arr.length)];
    return r;
  }
  // Opciones distintas: la correcta primero. Un distractor que repite el texto de la correcta es un caso mal elegido: se
  // marca en `repiteCorrecta` (la prueba de la unidad lo busca en 400 semillas) y no entra.
  function opciones(correcta, distractores, fmt, textoBien) {
    const bien = textoBien || fmt(correcta), vistos = new Set([bien]), repite = [];
    const ops = [{ id: 'c', texto: bien, correcta: true }];
    for (const d of distractores) {
      if (!d || (d.texto === undefined && !(Number.isFinite(d.valor) && d.valor >= 0))) continue;
      const txt = d.texto !== undefined ? d.texto : fmt(d.valor);
      if (txt === bien) repite.push(d.id);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    const out = ops.slice(0, 4);
    if (repite.length) Object.defineProperty(out, 'repiteCorrecta', { value: repite });
    return out;
  }
  const SEN = { 0: 0, 30: 0.5, 37: 0.6, 53: 0.8, 90: 1 };
  const COS = { 0: 1, 30: Math.sqrt(3) / 2, 37: 0.8, 53: 0.6, 90: 0 };

  // ---- Un color fijo por clase de fuerza (el de Estática): cada ficha dice su clase en m (lo comprueba el .test.js) ----
  const COLORES = { peso: 'h', normal: 'f', jalón: 'o', rozamiento: 'i' };
  const ficha = (c, m) => t => ({ v: c, t: String(t), m });
  const pp = ficha('c-h', 'peso'), pn = ficha('c-f', 'normal'), pj = ficha('c-o', 'jalón'), pr = ficha('c-i', 'rozamiento');
  const P = pp('P'), g = pp('g'), N = pn('N'), T = pj('T'), F = pj('F'), fr = pr('f');
  const sub = (x, i) => ({ sub: [x, i] });
  const vec = x => ({ vec: [x] });
  const neg = l => ({ negrita: [l] });
  const fk = sub(fr, 'k'), fs = sub(fr, 's'), muk = sub('μ', 'k'), mus = sub('μ', 's'), gL = sub(g, 'L'), gM = sub(g, 'M');
  const SF = ['Σ', vec('F')];
  const est = (datos, estado = {}) => ({ pieza: 'fis-estatica', datos, estado });
  const N_ = v => `${f(v)} N`;
  const A_ = v => `${f(v)} m/s²`;
  const frac = (a, b) => ({ frac: [a, b] });
  // Un valor que se escribe con «=» tiene que ser exacto con dos decimales (auditoría de la etapa 5).
  const exacto = x => Number.isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const elegir = fn => { for (let i = 0; i < 400; i++) { const c = fn(); if (c) return c; } throw new Error('dinamica: sin caso exacto'); };
  const mayus = s => s[0].toUpperCase() + s.slice(1);
  // Distractores sin choques: ningún error da la correcta ni repite otro (auditoría de Estática, M4).
  const distintos = (bien, ...vs) => vs.every(v => Number.isFinite(v) && v >= 0 && Math.abs(v - bien) > 1e-6) && new Set(vs.map(v => f(v))).size === vs.length && !vs.some(v => f(v) === f(bien));

  // Datos de cada ejercicio (contrato, punto 13): herramientas, nunca el paso hecho; ningún atajo ni consejo.
  const D = {
    peso: ['Peso: ', P, ' = m · ', g, ', con ', g, ' = 10 m/s²'],
    segunda: ['Las fuerzas se suman con su sentido: ', ...SF, ' = m · ', vec('a')],
    primera: ['Primera ley: ', ...SF, ' = 0 si va a velocidad constante o está quieto'],
    tercera: 'Tercera ley: la fuerza de A sobre B es igual y opuesta a la de B sobre A',
    reposo: 'v = a · t y d = a · t² / 2, desde el reposo',
    mruv: 'v² = v₀² + 2 · a · d, con a constante',
    mruvT: 'v = v₀ + a · t, con a constante',
    vertical: 'Si no sube ni baja, lo vertical suma cero',
    cin: [fk, ' = ', muk, ' · ', N, ' mientras desliza, contra el deslizamiento'],
    est: [fs, ' ≤ ', mus, ' · ', N, ' mientras no desliza'],
    comp: ['Una fuerza F con ángulo θ sobre la horizontal: F · cos θ de lado y F · sen θ hacia arriba'],
    trig: 'sen 37° = 3/5 y cos 37° = 4/5; sen 53° = 4/5 y cos 53° = 3/5 (convención del examen)',
    trig30: 'sen 30° = 1/2 (convención del examen)',
    rampa: ['En una rampa de ángulo θ: ', P, ' · sen θ a lo largo y ', P, ' · cos θ contra ella'],
    cuerda: ['Una cuerda ideal jala con la misma ', T, ' en sus dos puntas, también al pasar por una polea'],
    juntos: 'Los cuerpos unidos por una cuerda tensa tienen la misma aceleración',
    balanza: ['Una balanza marca la fuerza con que sostiene lo que tiene encima: la normal ', N],
    eje: 'Hacia arriba es positivo: a > 0 si la aceleración apunta hacia arriba',
    ac: [sub('a', 'c'), ' = v² / r, hacia el centro; v es la rapidez y r, el radio de la curva'],
    acw: [sub('a', 'c'), ' = ω² · r, hacia el centro; ω es la rapidez angular, en rad/s, y r, la distancia al eje'],
    centro: [...SF, ' = m · ', sub('a', 'c'), ', hacia el centro de la curva'],
  };

  // ---- Figuras (todas con la pieza fis-estatica) ----
  // Largo de una flecha: a escala (k px por newton, con un mínimo para que se vea el palo), salvo lo que se pide («?») o
  // una figura sin escala, que van todas con el mismo largo (auditoría de Estática, M1: la flecha no dice lo que se pregunta).
  const LARGO_FIJO = 30;
  const largoDe = (v, t, k, fijo) => (fijo || /\?/.test(t || '') ? LARGO_FIJO : Math.max(18, Math.min(56, v * k)));
  // El DCL de un cuerpo, a la derecha del lienzo: P⃗ abajo, N⃗ arriba, F⃗ o T⃗ hacia un lado (con su ángulo sobre la
  // horizontal), f⃗ hacia el otro y a⃗ punteada bajo la caja (horizontal) o a su derecha (vertical). Toda fuerza que actúa
  // va en el DCL (auditoría de Estática, A4); lo que se pide, con «?» y sin escala.
  function dclCaja(fz, o = {}) {
    // Sin escala (decisión de la sesión): las fuerzas de un DCL van de pesos de cientos de newtons a empujones de decenas;
    // a escala, el empujón quedaría como un triángulo. Todas miden lo mismo y llevan su valor escrito.
    const cx = o.cx || 250, cy = o.cy || 118, h = 16, w = 44, fl = [], fijo = o.escala !== true;
    const grande = Math.max(fz.P || 1, fz.N || 1, fz.F || 0, fz.T || 0, fz.f || 0);
    const k = Math.min(o.k || 0.12, 56 / grande, (fz.F || fz.T) ? 34 / Math.max(fz.F || 0, fz.T || 0, fz.f || 0, 1) : Infinity);
    const L = (v, t) => largoDe(v, t, k, fijo);
    if (fz.P) fl.push({ de: [cx - 8, cy + h], ang: 270, largo: L(fz.P, fz.tP), color: 'h', texto: fz.tP || `P = ${N_(fz.P)}`, rumbo: String(fz.tP || 'P').length > 6 ? [-0.5, 1] : [-1, 0.4], paso: o.pP });
    // Una fuerza vertical al lado del peso (auditoría, A1): la pista que empuja hacia abajo arriba del rizo (Nabajo) o la
    // cuerda o las cadenas que jalan hacia arriba o hacia abajo (Tvert: 1 o −1) en una curva vertical.
    const vertical = (v, t, dir, color) => fl.push({ de: [cx + 12, dir > 0 ? cy - h : cy + h], ang: dir > 0 ? 90 : 270, largo: L(v, t), color, texto: t, rumbo: [1, dir > 0 ? -0.4 : 0.4] });
    // «N = 0» (la pista ya no empuja) va escrito sobre la caja, sin flecha (lector en frío B, tarjeta 18).
    const nCero = /^N = 0$/.test(fz.tN || '');
    if (nCero) { /* sin flecha */ } else if (fz.Nabajo) vertical(fz.N || 0, fz.tN || `N = ${N_(fz.N)}`, -1, 'f');
    else if (fz.N || (fz.tN && fz.tN.includes('?'))) fl.push({ de: [cx - 8, cy - h], ang: 90, largo: L(fz.N || 0, fz.tN), color: 'f', texto: fz.tN || `N = ${N_(fz.N)}`, rumbo: [-1, -0.4], paso: o.pN });
    if (fz.Tvert && fz.T) vertical(fz.T, fz.tT || `T = ${N_(fz.T)}`, fz.Tvert, 'o');
    const lado = fz.Fdir || 1, angF = fz.Fang || 0;
    const tira = fz.F ? { v: fz.F, t: fz.tF || `F = ${N_(fz.F)}` } : fz.T && !fz.Tvert ? { v: fz.T, t: fz.tT || `T = ${N_(fz.T)}` } : null;
    if (tira || (fz.tF && fz.tF.includes('?'))) fl.push({ de: [cx + lado * w / 2, cy - (angF ? 6 : 0)], ang: lado > 0 ? angF : 180 - angF, largo: L(tira ? tira.v : 0, tira ? tira.t : fz.tF), color: 'o', texto: tira ? tira.t : fz.tF, rumbo: [lado * 0.4, -1], paso: o.pF });
    if (fz.F2) fl.push({ de: [cx - lado * w / 2, cy - 6], ang: lado > 0 ? 180 : 0, largo: L(fz.F2, fz.tF2), color: 'o', texto: fz.tF2 || `F = ${N_(fz.F2)}`, rumbo: [-lado * 0.4, -1] });
    const fd = fz.fdir || -lado;
    if (fz.f || (fz.tf && fz.tf.includes('?'))) fl.push({ de: [cx + fd * w / 2, cy + 8], ang: fd > 0 ? 0 : 180, largo: L(fz.f || 0, fz.tf), color: 'i', texto: fz.tf || `f = ${N_(fz.f)}`, rumbo: [fd * 0.3, 1], paso: o.pf });
    if (fz.adir) {
      const ta = fz.ta || 'a⃗';
      if (fz.avert) fl.push({ de: [cx + 36, fz.adir > 0 ? cy + 14 : cy - 14], ang: fz.adir > 0 ? 90 : 270, largo: LARGO_FIJO, color: 'tinta', discontinua: true, texto: ta, rumbo: [0, fz.adir > 0 ? -1 : 1], paso: o.pa });
      else fl.push({ de: [fz.adir > 0 ? cx + 8 : cx + 38, cy + 72], ang: fz.adir > 0 ? 0 : 180, largo: LARGO_FIJO, color: 'tinta', discontinua: true, texto: ta, rumbo: [fz.adir, 0], paso: o.pa });
    }
    return { obj: [{ tipo: 'caja', fig: true, x: cx, y: cy + h, w, h: 2 * h }], fl,
      txt: [...(nCero ? [{ x: cx, y: cy - h - 12, texto: 'N = 0', ancla: 'middle', color: 'f' }] : []), ...(o.sinTitulo ? [] : [{ x: cx, y: 18, texto: o.titulo || 'DCL', ancla: 'middle', peso: 400 }, ...(fijo ? [{ x: cx, y: cy + 98, texto: 'sin escala', ancla: 'middle', peso: 400 }] : [])])] };
  }
  // Un cuerpo en el piso, a la izquierda, con quien lo empuja o la cuerda que lo jala; su DCL a la derecha.
  //   o.cosa: el objeto ({ tipo: 'carrito' | 'caja' | 'costal', … }); o.mano: 1 (la persona empuja hacia la derecha, desde
  //   la izquierda) o −1; o.cuerda: true (una cuerda tira hacia la derecha; con o.ang, inclinada); o.v: 1 o −1 (la velocidad
  //   v⃗, sobre el cuerpo); o.fz y o.dcl: el DCL.
  function figPiso(o) {
    const piso = 204, c = Object.assign({ tipo: 'carrito', x: 110, y: piso, w: 74, h: 30 }, o.cosa || {});
    if (c.tipo !== 'carrito') { c.w = c.w || 70; c.h = c.h || 40; }
    // los textos de arriba a la izquierda bajan a y = 42: arriba a la derecha va el título del DCL
    const alto = c.tipo === 'carrito' ? c.h + 14 : c.h, objs = [c], fl = [], txt = (o.textos || []).map(t => (o.fz && t.y < 30 && t.ancla === 'start' ? Object.assign({}, t, { y: 42 }) : t));
    if (o.mano) {
      const xm = c.x - o.mano * (c.w / 2), xp = xm - o.mano * 34;
      if (c.tipo === 'carrito') c.mango = 0;
      objs.push({ tipo: 'persona', x: xp, y: piso, alto: 92, mira: o.mano, mano: [xm, piso - alto * 0.65] });
    }
    if (o.cuerda) {
      const y0 = piso - alto * 0.55, x0 = c.x + c.w / 2, ang = o.ang || 0, L = o.largoCuerda || 62;
      objs.push({ tipo: 'cuerda', de: [x0, y0], a: [x0 + L * Math.cos(rad(ang)), y0 - L * Math.sin(rad(ang))] });
      if (ang) txt.push({ x: x0 + 6, y: y0 + 16, texto: `${ang}°`, ancla: 'start', peso: 400 });
    }
    if (o.v) fl.push({ de: [o.v > 0 ? c.x - 18 : c.x + 18, piso - alto - 14], ang: o.v > 0 ? 0 : 180, largo: o.largoV || 36, color: 'tinta', texto: o.tv || 'v⃗', rumbo: [o.v, -0.4] });
    const d = o.fz ? dclCaja(o.fz, o.dcl || {}) : { obj: [], fl: [], txt: [] };
    return { alto: 226, piso: { y: piso, x0: 8, x1: o.pisoHasta || 200 }, objetos: [...objs, ...d.obj], flechas: [...fl, ...d.fl], textos: [...d.txt, ...txt],
      lineas: o.lineas, angulos: o.angulos, alt: o.alt };
  }

  // ======================= 1: segunda ley (el carrito del mercado) =======================
  // Cambia: la fuerza y la masa · Permanece: el piso que casi no frena · Progresa: la flecha v⃗ que crece cada segundo ·
  // Se reserva: la fuerza que va contra la velocidad (Predice) · Debe verse: a = ΣF/m, en el sentido de la fuerza neta.
  // Lienzo: el carrito y quien lo empuja a la izquierda (piso en y = 204) y el DCL a la derecha (caja en x = 250).
  const PXM1 = 2.3;
  const juego1 = val => {
    const a = val.F / val.m, t = val.t || 0, s = Math.min(63, a * t * t / 2 * PXM1), v = a * t;
    return est(figPiso({ cosa: { x: 96 + s, texto: `${val.m} kg` }, mano: val.F > 0 ? 1 : 0, v: v > 1e-9 ? 1 : 0, largoV: Math.min(48, 14 + v * 2),
      fz: { P: val.m * G, N: val.m * G, F: val.F, tP: 'P⃗', tN: 'N⃗', tF: 'F⃗', adir: val.F > 0 ? 1 : 0 },
      alt: `El carrito de ${val.m} kg, empujado con ${val.F} N${val.F ? `: acelera ${f(a)} m/s²` : ': sigue quieto'}.` }));
  };
  const PRED1 = figPiso({ cosa: { x: 92, texto: '30 kg' }, mano: -1, v: 1, fz: { P: 300, N: 300, F: 60, Fdir: -1, tP: 'P⃗', tN: 'N⃗', tF: 'F = 60 N' },
    textos: [{ x: 250, y: 190, texto: 'a⃗ = ?', ancla: 'middle' }],
    alt: 'El carrito va hacia la derecha y una persona, del lado derecho, lo empuja hacia la izquierda con 60 N. La aceleración, con un signo de pregunta.' });
  const REVELA1 = figPiso({ cosa: { x: 92, texto: '30 kg' }, mano: -1, v: 1, fz: { P: 300, N: 300, F: 60, Fdir: -1, tP: 'P⃗', tN: 'N⃗', tF: 'F = 60 N', adir: -1 },
    alt: 'El carrito va hacia la derecha, pero su aceleración apunta hacia la izquierda, como la fuerza.' });
  // Mira: el carrito de 30 kg sale a 6 m/s hacia la derecha y la mano lo empuja 60 N hacia la izquierda: a = −2 m/s².
  // Un corte por segundo: v = 6 − 2t y lo recorrido, 6t − t² (6 px por metro). a⃗ siempre a la izquierda.
  const corte1 = (tt, ta = 'a = 2 m/s²') => {
    const v = 6 - 2 * tt, s = 6 * tt - tt * tt, x = 60 + 6 * s, fl = [];
    if (Math.abs(v) > 1e-9) fl.push({ de: [v > 0 ? x - 16 : x + 16, 136], ang: v > 0 ? 0 : 180, largo: 12 + 4 * Math.abs(v), color: 'tinta', texto: `v = ${f(Math.abs(v))} m/s`, rumbo: [v > 0 ? 1 : -1, -0.2] });
    fl.push({ de: [x + 15, 104], ang: 180, largo: LARGO_FIJO, color: 'tinta', discontinua: true, texto: ta, rumbo: [-1, -0.2] });
    return { objetos: [{ tipo: 'carrito', x, y: 204, w: 74, h: 30, mango: 0, texto: '30 kg' }, { tipo: 'persona', x: x + 71, y: 204, alto: 92, mira: -1, mano: [x + 37, 175] }],
      flechas: fl, textos: [{ x: 8, y: 26, texto: `t = ${tt} s`, ancla: 'start' }, ...(Math.abs(v) < 1e-9 ? [{ x, y: 136, texto: 'v = 0: se detiene', ancla: 'middle', peso: 400 }] : [])] };
  };
  const MIRA1 = { alto: 226, piso: { y: 204, x0: 8, x1: 312 }, objetos: [], cortes: [corte1(0, 'a⃗'), corte1(0), corte1(1), corte1(3), corte1(4)],
    alt: 'El carrito sale a 6 m/s hacia la derecha; la mano lo empuja a la izquierda. Cada segundo va 2 m/s más lento, se detiene y vuelve.' };

  // Ejemplos resueltos de la idea 1. Cuentas rehechas con un script aparte que no usa este archivo (scratchpad
  // e7-fisica/cuentas.js: integra el movimiento paso a paso con la suma de fuerzas): 60/20; 25·2; 90/3; a = 0;
  // 4000/2000; (70 − 30)/10; 16/8 y 2·3 (auditoría, M6: antes 15 m/s); 30/15 y 2·4²/2; 150·10/5; 60/6; 2·16/4² y 5·2 con cada alternativa; las cinco
  // cajas (F·t/m); 60/6 y 2·10 con cada alternativa; 5/0,5; 8²/(2·16) y 400·2 con cada alternativa.
  const caja1 = (o = {}) => figPiso(Object.assign({ cosa: { tipo: 'caja', x: 100, w: 70, h: 44, texto: o.texto } }, o));
  const EJEMPLOS_SEGUNDA = [
    { nivel: 1, titulo: 'La aceleración del carrito',
      figura: est(figPiso({ cosa: { x: 100, texto: '20 kg' }, mano: 1, fz: { P: 200, N: 200, F: 60, tP: 'P⃗', tN: 'N⃗', tF: 'F = 60 N', adir: 1, ta: 'a = ?' },
        alt: 'Una persona empuja un carrito de 20 kg con 60 N; su aceleración, con un signo de pregunta.' })),
      enunciado: ['Empujas un carrito de 20 kg con ', pj('60 N'), ' sobre un piso que casi no frena. ¿Cuánto acelera?'],
      datos: [D.segunda],
      solucion: [{ texto: 'El peso y la normal se anulan, y el piso casi no frena; tu empujón es la única fuerza de lado y es la fuerza neta. Dividida entre la masa, da la aceleración:', ecuacion: ['a = ', frac('60', '20'), ' = ', neg('3 m/s²')] }],
      respuesta: [neg('a = 3 m/s²')] },
    { nivel: 1, titulo: 'La fuerza que hace falta',
      figura: est(figPiso({ cosa: { x: 100, texto: '25 kg' }, mano: 1, fz: { P: 250, N: 250, tP: 'P⃗', tN: 'N⃗', tF: 'F = ?', adir: 1, ta: 'a = 2 m/s²' },
        alt: 'Un carrito de 25 kg que acelera 2 m/s²; la fuerza que lo empuja, con un signo de pregunta.' })),
      enunciado: ['¿Qué fuerza neta hace falta para que un carrito de 25 kg acelere 2 m/s²?'],
      datos: [D.segunda],
      solucion: [{ texto: 'La segunda ley dice que la fuerza neta es la masa por la aceleración, así que se multiplican los dos datos:', ecuacion: [...SF, ' = 25 · 2 = ', neg('50 N')] }],
      respuesta: ['Hace falta ', neg('50 N')] },
    { nivel: 1, titulo: 'La masa de la caja',
      figura: est(caja1({ texto: '? kg', mano: 1, fz: { P: 1, N: 1, tP: 'P⃗', tN: 'N⃗', F: 90, tF: 'F = 90 N', adir: 1, ta: 'a = 3 m/s²' },
        alt: 'Una caja empujada con 90 N que acelera 3 m/s²; su masa, con un signo de pregunta.' })),
      enunciado: ['Una fuerza neta de ', pj('90 N'), ' acelera una caja a 3 m/s². ¿Qué masa tiene la caja?'],
      datos: [D.segunda],
      solucion: [{ texto: 'De ΣF = m · a se despeja la masa: es la fuerza neta dividida entre la aceleración. Con más masa, la misma fuerza la habría acelerado menos.', ecuacion: ['m = ', frac('90', '3'), ' = ', neg('30 kg')] }],
      respuesta: [neg('m = 30 kg')] },
    { nivel: 1, titulo: 'Siempre a la misma rapidez',
      figura: est(figPiso({ cosa: { x: 100, texto: '40 kg' }, v: 1, tv: 'v = 2 m/s', textos: [{ x: 8, y: 22, texto: 'siempre a 2 m/s', ancla: 'start', peso: 400 }, { x: 250, y: 60, texto: 'ΣF⃗ = ?', ancla: 'middle' }],
        alt: 'Un carrito de 40 kg que avanza siempre a 2 m/s; la suma de sus fuerzas, con un signo de pregunta.' })),
      enunciado: ['Un carrito de 40 kg avanza en línea recta siempre a 2 m/s. ¿Cuánto vale la fuerza neta sobre él?'],
      datos: [D.segunda],
      solucion: [{ texto: 'Que vaya siempre a 2 m/s quiere decir que su velocidad no cambia, así que no acelera: a = 0. Entonces la fuerza neta también es cero; moverse no pide fuerza neta, cambiar de velocidad sí.', ecuacion: [...SF, ' = 40 · 0 = ', neg('0 N')] }],
      respuesta: ['La fuerza neta es ', neg('0 N')] },
    { nivel: 1, titulo: 'El auto que frena',
      figura: est({ alto: 150, piso: { y: 130 }, objetos: [{ tipo: 'auto', x: 140, y: 130, w: 84 }],
        flechas: [{ de: [110, 76], ang: 0, largo: 40, color: 'tinta', texto: 'v⃗, al este', rumbo: [1, -0.3] }, { de: [300, 100], ang: 180, largo: LARGO_FIJO, color: 'tinta', texto: 'ΣF = 2000 N', rumbo: [0, -1] }],
        textos: [{ x: 8, y: 24, texto: 'a = ?', ancla: 'start' }],
        alt: 'Un auto que va al este y frena: la fuerza neta, de 2000 N, apunta al oeste. Su aceleración, con un signo de pregunta.' }),
      enunciado: ['Un auto de 1000 kg va hacia el este y frena. La fuerza neta sobre él es de 2000 N, hacia el oeste. ¿Cuánto acelera y hacia dónde?'],
      datos: [D.segunda],
      solucion: [{ texto: 'La aceleración apunta hacia donde apunta la fuerza neta, al oeste, aunque el auto vaya al este, y por eso frena. Su valor es la fuerza entre la masa:', ecuacion: ['a = ', frac('2000', '1000'), ' = ', neg('2 m/s²'), ', al oeste'] }],
      respuesta: [neg('2 m/s²'), ', hacia el oeste'] },
    { nivel: 2, titulo: 'Dos fuerzas en contra',
      figura: est(caja1({ texto: '10 kg', fz: { P: 100, N: 100, F: 70, F2: 30, tP: 'P⃗', tN: 'N⃗', tF: 'F = 70 N', tF2: '30 N', adir: 1, ta: 'a = ?' },
        alt: 'Una caja de 10 kg empujada con 70 N hacia la derecha y con 30 N hacia la izquierda.' })),
      enunciado: ['Sobre una caja de 10 kg, en un piso liso, tú empujas con ', pj('70 N'), ' hacia la derecha y tu amigo con ', pj('30 N'), ' hacia la izquierda. ¿Cuánto acelera?'],
      datos: [D.segunda],
      solucion: [
        { texto: 'Las dos fuerzas tiran hacia lados opuestos, así que se restan y la neta apunta hacia la mayor:', ecuacion: [...SF, ' = 70 − 30 = 40 N, a la derecha'] },
        { texto: 'Esa fuerza neta, dividida entre la masa, da la aceleración, también hacia la derecha:', ecuacion: ['a = ', frac('40', '10'), ' = ', neg('4 m/s²')] },
      ],
      respuesta: [neg('4 m/s²'), ', hacia la derecha'] },
    { nivel: 2, titulo: 'Rapidez a los 3 segundos',
      figura: est(figPiso({ cosa: { x: 100, texto: '8 kg' }, mano: 1, fz: { P: 80, N: 80, F: 16, tP: 'P⃗', tN: 'N⃗', tF: 'F = 16 N', adir: 1 },
        textos: [{ x: 8, y: 22, texto: 'parte del reposo; v a los 3 s: ?', ancla: 'start', peso: 400 }], alt: 'Un carrito de 8 kg empujado con 16 N desde el reposo.' })),
      enunciado: ['Un carrito de 8 kg parte del reposo empujado con ', pj('16 N'), ', sobre un piso que casi no frena. ¿Qué rapidez tiene a los 3 s?'],
      datos: [D.segunda, D.reposo],
      solucion: [
        { texto: 'Primero, la segunda ley da la aceleración, la fuerza entre la masa:', ecuacion: ['a = ', frac('16', '8'), ' = 2 m/s²'] },
        { texto: 'Parte del reposo y gana 2 m/s en cada segundo, así que a los 3 s lleva tres veces 2 m/s:', ecuacion: ['v = 2 · 3 = ', neg('6 m/s')] },
      ],
      respuesta: [neg('v = 6 m/s')] },
    { nivel: 2, titulo: 'Distancia en 4 segundos',
      figura: est(caja1({ texto: '15 kg', mano: 1, fz: { P: 150, N: 150, F: 30, tP: 'P⃗', tN: 'N⃗', tF: 'F = 30 N', adir: 1 },
        textos: [{ x: 8, y: 22, texto: 'parte del reposo; d en 4 s: ?', ancla: 'start', peso: 400 }], alt: 'Una caja de 15 kg empujada con 30 N desde el reposo, en un piso liso.' })),
      enunciado: ['Una caja de 15 kg parte del reposo en un piso liso, empujada con ', pj('30 N'), '. ¿Qué distancia recorre en 4 s?'],
      datos: [D.segunda, D.reposo],
      solucion: [
        { texto: 'Primero, la segunda ley da la aceleración, la fuerza entre la masa:', ecuacion: ['a = ', frac('30', '15'), ' = 2 m/s²'] },
        { texto: 'Con esa aceleración, la fórmula del reposo da la distancia; el tiempo va al cuadrado:', ecuacion: ['d = ', frac('2 · 4²', '2'), ' = ', neg('16 m')] },
      ],
      respuesta: [neg('d = 16 m')] },
    { nivel: 2, titulo: 'El taxi que frena',
      figura: est({ alto: 150, piso: { y: 130 }, objetos: [{ tipo: 'auto', x: 130, y: 130, w: 84, texto: 'TAXI' }],
        flechas: [{ de: [110, 84], ang: 0, largo: 40, color: 'tinta', texto: 'v = 10 m/s', rumbo: [1, -0.3] }],
        textos: [{ x: 8, y: 24, texto: 'se detiene en 5 s; ΣF = ?', ancla: 'start', peso: 400 }],
        alt: 'Un taxi de 1200 kg va a 10 m/s y frena hasta detenerse en 5 s.' }),
      enunciado: ['Un taxi de 1200 kg, con su chofer, va a 10 m/s y frena hasta detenerse en 5 s. ¿Qué fuerza neta lo frena?'],
      datos: [D.segunda, D.mruvT],
      solucion: [
        { texto: 'La aceleración es lo que cambia la velocidad en cada segundo, y aquí pasa de 10 m/s a 0 en 5 s:', ecuacion: ['a = ', frac('0 − 10', '5'), ' = −2 m/s²'] },
        { texto: 'El signo menos dice que la aceleración apunta contra el avance. La fuerza neta que frena el taxi es la masa por el valor de esa aceleración:', ecuacion: [...SF, ' = 1200 · 2 = ', neg('2400 N')] },
      ],
      respuesta: [neg('2400 N'), ', contra el avance'] },
    { nivel: 2, titulo: 'Dos bloques que van juntos',
      figura: est({ alto: 170, piso: { y: 150 }, objetos: [{ tipo: 'persona', x: 40, y: 150, alto: 92, mano: [76, 128] }, { tipo: 'caja', x: 104, y: 150, w: 56, h: 44, texto: '4 kg' }, { tipo: 'caja', x: 154, y: 150, w: 44, h: 36, texto: '2 kg' }],
        flechas: [{ de: [72, 76], ang: 0, largo: 30, color: 'o', texto: 'F = 60 N', rumbo: [0, -1] }],
        textos: [{ x: 312, y: 30, texto: 'piso liso; a = ?', ancla: 'end', peso: 400 }], alt: 'Una persona empuja con 60 N un bloque de 4 kg que empuja a otro de 2 kg.' }),
      enunciado: ['Empujas con ', pj('60 N'), ' un bloque de 4 kg, que empuja a otro de 2 kg pegado a él, sobre un piso liso. ¿Cuánto aceleran?'],
      datos: [D.segunda],
      solucion: [
        { texto: 'Los dos bloques van pegados y aceleran igual, así que se pueden tratar como un solo cuerpo de 4 + 2 = 6 kg.' },
        { texto: 'Los empujones entre los dos bloques son de adentro y se anulan; la única fuerza de afuera, de lado, es la tuya:', ecuacion: ['a = ', frac('60', '6'), ' = ', neg('10 m/s²')] },
      ],
      respuesta: [neg('a = 10 m/s²')] },
    { nivel: 3, titulo: 'La fuerza que lo hizo recorrer',
      figura: est(caja1({ texto: '5 kg', fz: { P: 50, N: 50, tP: 'P⃗', tN: 'N⃗', tF: 'F = ?', adir: 1 },
        textos: [{ x: 8, y: 22, texto: 'parte del reposo: 16 m en 4 s', ancla: 'start', peso: 400 }], alt: 'Una caja de 5 kg que, desde el reposo, recorre 16 m en 4 s empujada por una fuerza.' })),
      enunciado: ['Una caja de 5 kg parte del reposo en un piso liso y una sola fuerza horizontal constante la hace recorrer 16 m en 4 s. ¿Cuánto vale esa fuerza?'],
      alternativas: ['5 N', '10 N', '20 N', '40 N', '80 N'],
      datos: [D.segunda, D.reposo],
      solucion: [
        { texto: 'Como parte del reposo, la aceleración se despeja de d = a · t² / 2:', ecuacion: ['a = ', frac('2 · 16', '4²'), ' = 2 m/s²'] },
        { texto: 'Con esa aceleración, la segunda ley da la fuerza, masa por aceleración:', ecuacion: [F, ' = 5 · 2 = ', pj('10 N')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si olvidas el 2 al despejar; ', neg('C'), ', si tomas la velocidad media, 4 m/s, como aceleración; ', neg('D'), ', si tomas la rapidez final, 8 m/s, y ', neg('E'), ', si multiplicas por los 16 m.'] },
      ],
      respuesta: [neg('B'), ', ', pj('10 N')] },
    { nivel: 3, titulo: 'La tabla de las cinco cajas',
      figura: est({ alto: 200, objetos: [], textos: [
        { x: 30, y: 30, texto: 'caja', ancla: 'middle', peso: 400 }, { x: 110, y: 30, texto: 'masa', ancla: 'middle', peso: 400 }, { x: 200, y: 30, texto: 'fuerza', ancla: 'middle', peso: 400 }, { x: 280, y: 30, texto: 'tiempo', ancla: 'middle', peso: 400 },
        ...[[1, 2, 6, 2], [2, 1, 5, 1], [3, 5, 20, 1], [4, 3, 6, 4], [5, 4, 12, 2]].flatMap(([k, m, Fv, t], i) => [
          { x: 30, y: 62 + 28 * i, texto: String(k), ancla: 'middle' }, { x: 110, y: 62 + 28 * i, texto: `${m} kg`, ancla: 'middle' },
          { x: 200, y: 62 + 28 * i, texto: `${Fv} N`, ancla: 'middle', color: 'o' }, { x: 280, y: 62 + 28 * i, texto: `${t} s`, ancla: 'middle' }])],
        alt: 'Tabla de cinco cajas con su masa, la fuerza que las empuja y el tiempo que la empuja.' }),
      enunciado: ['Cinco cajas parten del reposo sobre un piso liso. Cada una es empujada por una fuerza horizontal constante durante el tiempo de la tabla. ¿Cuál termina con más rapidez?'],
      alternativas: ['La caja 1', 'La caja 2', 'La caja 3', 'La caja 4', 'La caja 5'],
      datos: [D.segunda, D.reposo],
      solucion: [
        { texto: 'Cada caja gana rapidez según su aceleración, a = F ÷ m, y según cuánto tiempo la empujan: v = a · t. Para las cajas 1, 2 y 3 salen 3 · 2 = 6 m/s, 5 · 1 = 5 m/s y 4 · 1 = 4 m/s.' },
        { texto: 'Para las cajas 4 y 5 salen 2 · 4 = 8 m/s y 3 · 2 = 6 m/s. Gana la caja 4, que acelera poco pero durante más tiempo.' },
        { texto: [neg('C'), ' tiene la mayor fuerza y ', neg('B'), ', la mayor aceleración, pero a las dos las empujan un solo segundo; ', neg('A'), ' y ', neg('E'), ' llegan a 6 m/s, menos que la caja 4.'] },
      ],
      respuesta: [neg('D'), ': la caja 4, con ', neg('8 m/s')] },
    { nivel: 3, titulo: 'Empujar dos bloques',
      figura: est({ alto: 170, piso: { y: 150 }, objetos: [{ tipo: 'persona', x: 40, y: 150, alto: 92, mano: [76, 128] }, { tipo: 'caja', x: 104, y: 150, w: 56, h: 44, texto: '4 kg' }, { tipo: 'caja', x: 154, y: 150, w: 44, h: 36, texto: '2 kg' }],
        flechas: [{ de: [72, 76], ang: 0, largo: 30, color: 'o', texto: 'F = 60 N', rumbo: [0, -1] }],
        textos: [{ x: 312, y: 30, texto: 'el de 4 kg sobre el de 2 kg: ?', ancla: 'end', peso: 400 }], alt: 'Una persona empuja con 60 N un bloque de 4 kg que empuja a otro de 2 kg.' }),
      enunciado: ['Empujas con ', pj('60 N'), ' un bloque de 4 kg, que empuja a otro de 2 kg, sobre un piso liso. ¿Con qué fuerza empuja el bloque de 4 kg al de 2 kg?'],
      alternativas: ['60 N', '40 N', '30 N', '0 N', '20 N'],
      datos: [D.segunda, D.juntos],
      solucion: [
        { texto: 'Primero, los dos bloques aceleran juntos, como un solo cuerpo de 6 kg:', ecuacion: ['a = ', frac('60', '4 + 2'), ' = 10 m/s²'] },
        { texto: 'Ahora se mira solo el bloque de 2 kg: la única fuerza de lado sobre él es el empujón del otro bloque, y es la que le da su aceleración:', ecuacion: [sub(N, 'contacto'), ' = 2 · 10 = ', pn('20 N')] },
        { texto: 'Las otras salen de un error: 60 N, si crees que tu empujón pasa entero al otro bloque; 40 N, si calculas lo que necesita el de 4 kg; 30 N, si repartes por mitades, y 0 N, si olvidas que se tocan.' },
      ],
      respuesta: [neg('E'), ', ', pn('20 N')] },
    { nivel: 3, titulo: 'En lo más alto del vuelo',
      figura: est({ alto: 200, piso: { y: 186 }, objetos: [{ tipo: 'persona', x: 70, y: 186, alto: 96, mano: [92, 98] }, { tipo: 'pelota', x: 92, y: 40, r: 12 }],
        lineas: [{ de: [92, 88], a: [92, 54], discontinua: true }], textos: [{ x: 114, y: 34, texto: 'aquí, v = 0', ancla: 'start', peso: 400 }, { x: 114, y: 56, texto: 'a = ?', ancla: 'start' }],
        alt: 'Una pelota de 0,5 kg lanzada hacia arriba, en lo más alto de su vuelo.' }),
      enunciado: ['Lanzas una pelota de 0,5 kg hacia arriba. En lo más alto, su velocidad es cero por un instante. Sin contar el aire, ¿cuál es su aceleración en ese instante?'],
      alternativas: ['10 m/s², hacia abajo', '0: está quieta un instante', '10 m/s², hacia arriba', 'Menos de 10 m/s², hacia abajo', '50 m/s², hacia abajo'],
      datos: [D.peso, D.segunda],
      solucion: [
        { texto: 'Sin aire, la única fuerza sobre la pelota es su peso, hacia abajo, también en lo más alto:', ecuacion: [P, ' = 0,5 · 10 = ', pp('5 N')] },
        { texto: 'El peso es la fuerza neta, así que la aceleración es el peso entre la masa. Que la velocidad sea cero no importa: en ese instante está cambiando de subir a bajar.', ecuacion: ['a = ', frac('5', '0,5'), ' = ', neg('10 m/s²'), ', hacia abajo'] },
        { texto: ['Las otras salen de un error: ', neg('B'), ', si confundes v = 0 con a = 0; ', neg('C'), ', si sigues al movimiento de subida; ', neg('D'), ', si crees que la fuerza del lanzamiento se va gastando, y ', neg('E'), ', si calculas 5 · 10 en vez de 5 ÷ 0,5.'] },
      ],
      respuesta: [neg('A'), ': ', neg('10 m/s²'), ', hacia abajo'] },
    { nivel: 3, titulo: 'El carro de la mina',
      figura: est(figPiso({ cosa: { x: 100, texto: '400 kg' }, v: 1, tv: 'v = 8 m/s', textos: [{ x: 8, y: 22, texto: 'se detiene en 16 m', ancla: 'start', peso: 400 }, { x: 250, y: 60, texto: 'ΣF = ?', ancla: 'middle' }],
        alt: 'Un carro de mina de 400 kg va a 8 m/s y se detiene en 16 m.' })),
      enunciado: ['Un carro de mina de 400 kg va por los rieles a 8 m/s. Una fuerza neta constante lo detiene en 16 m. ¿Cuánto vale esa fuerza?'],
      alternativas: ['200 N', '1600 N', '800 N', '3200 N', '4000 N'],
      datos: [D.segunda, D.mruv, D.peso],
      solucion: [
        { texto: 'No dan el tiempo, pero el carro termina quieto, v = 0, así que la aceleración sale de v² = v₀² + 2 · a · d:', ecuacion: ['a = ', frac('8²', '2 · 16'), ' = 2 m/s², contra el avance'] },
        { texto: 'La fuerza neta que lo detiene es la masa por esa aceleración:', ecuacion: [...SF, ' = 400 · 2 = ', neg('800 N')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si tomas 8 ÷ 16 como aceleración; ', neg('B'), ', si olvidas el 2; ', neg('D'), ', si multiplicas la masa por la rapidez, y ', neg('E'), ', si das el peso del carro, que no es la fuerza que lo frena.'] },
      ],
      respuesta: [neg('C'), ', ', neg('800 N')] },
  ];

  // Casos de «Ahora tú» y «Así se resuelve», de listas distintas (regla resuelve-repite). Ninguno es el de Predice
  // (30 kg empujado con 60 N) ni el de la misión (2 m/s²).
  const COSAS1_AT = [{ n: 'una caja', cosa: 'caja' }, { n: 'un baúl', cosa: 'caja' }, { n: 'un carrito', cosa: 'carrito' }];
  const COSAS1_RS = [{ n: 'una caja de fruta', cosa: 'caja' }, { n: 'una carreta', cosa: 'carrito' }];
  const SITUACIONES1 = [
    { pregunta: 'Lanzas una pelota hacia arriba. Mientras sube, solo la jala su peso. ¿Hacia dónde apunta su aceleración?',
      bien: 'Hacia abajo, como su peso', mov: 'Hacia arriba, como se mueve', cero: 'No tiene: en el aire nada la empuja', otro: 'No tiene: va cada vez más lento' },
    { pregunta: 'Una combi va hacia el norte y frena antes del paradero. ¿Hacia dónde apunta su aceleración?',
      bien: 'Hacia el sur, contra el avance', mov: 'Hacia el norte, como se mueve', cero: 'No tiene: solo está frenando', otro: 'No tiene: ya casi para' },
    { pregunta: 'Un trineo de arena baja por una duna hacia la derecha y tú lo jalas con una cuerda hacia la izquierda, con más fuerza que todo lo demás. ¿Hacia dónde apunta su aceleración?',
      bien: 'Hacia la izquierda, como tu jalón', mov: 'Hacia la derecha, como se mueve', cero: 'No tiene: las fuerzas se oponen', otro: 'Hacia abajo, como la duna' },
    { pregunta: 'Arrastras una caja a velocidad constante hacia la derecha; el piso la frena. ¿Hacia dónde apunta su aceleración?',
      bien: 'No tiene: su velocidad no cambia', mov: 'Hacia la derecha, como se mueve', cero: 'Hacia la izquierda, como el rozamiento', otro: 'Hacia la derecha, porque la jalas',
      // aquí la velocidad no cambia: cada error tiene su propia explicación (auditoría, M7)
      fb: { mov: ['D1', 'Así se mueve, cierto, pero moverse no es acelerar. Su velocidad no cambia porque tu jalón y el rozamiento se anulan: la fuerza neta es cero, y no hay aceleración.'],
        cero: ['DN-UNA', 'El piso la frena hacia la izquierda, cierto, pero tu jalón hacia la derecha lo iguala. Como la suma de las fuerzas es cero, la velocidad no cambia y no hay aceleración.'],
        otro: ['W5', 'Jalas hacia la derecha, cierto, pero el piso frena con la misma fuerza hacia la izquierda. Sin fuerza neta no hay aceleración, y por eso la caja sigue a velocidad constante.'] } },
  ];
  const segunda = {
    id: 'fuerza-neta-acelera',
    titulo: 'Segunda ley de Newton',
    pregunta: '¿Hacia dónde apunta la aceleración de un carrito que frenas?',
    temas: ['Segunda ley de Newton'],
    pieza: 'fis-estatica',
    aprendizaje: 'La fuerza neta da una aceleración en su mismo sentido: a = ΣF/m. La aceleración sigue a la fuerza, no a la velocidad.',
    actividad: 'Empujar el carrito del mercado con más o menos fuerza y más o menos papas.',
    lee: {
      tarjetas: [
        { titulo: 'Vacío o lleno', texto: 'En la feria, arrancar un carrito vacío cuesta poco; lleno de papas, cuesta bastante más. Lo que cambia es la masa, que dice cuánta materia hay que poner en movimiento: con más masa, el mismo empujón cambia la velocidad más despacio.',
          dibujo: est(figPiso({ cosa: { x: 100, texto: 'papas' }, mano: 1, alt: 'Una persona empuja un carrito del mercado lleno de papas.' })) },
        { titulo: 'Todas las fuerzas juntas', texto: ['Si varias fuerzas actúan a la vez, se suman con su sentido: las que van hacia un lado suman y las del contrario restan. El resultado es la fuerza neta, ', ...SF, ' (Σ se lee «suma de»). En Estática esa suma daba cero y la velocidad no cambiaba; aquí no da cero, y por eso el carrito acelera.'],
          ecuacion: [...SF, ' = 50 N − 20 N = 30 N'] },
        { titulo: 'Qué mirar al jugar', texto: ['La flecha punteada, ', vec('a'), ', es la aceleración: cuánto cambia la velocidad en cada segundo. Si el carrito pasa de 2 m/s a 5 m/s en un segundo, su aceleración es de 3 m/s². Cambia la fuerza o la masa y mira qué tan rápido crece la flecha ', vec('v'), '.'] },
      ],
    },
    ejemplos: EJEMPLOS_SEGUNDA,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'En el mercado empujas un carrito con papas, que parte del reposo. Las ruedas casi no frenan. Elige tu fuerza y la masa.',
      mision: {
        texto: 'Haz que el carrito acelere justo 1,5 m/s².',
        // Una sola manera en la grilla: 60 N con 40 kg (las fuerzas van de 20 en 20).
        logrado: val => val.F > 0 && Math.abs(val.F - 1.5 * val.m) < 1e-9,
        bien: '¡1,5 m/s²! Cada segundo, el carrito va 1,5 m/s más rápido.',
      },
      voz: 'Empuja más o pon más papas. ¿Qué tan rápido crece la flecha v?',
      leyenda: [
        { s: [vec(F)], t: 'tu empujón sobre el carrito' },
        { s: [vec(P)], t: 'peso: la Tierra jala al carrito' },
        { s: [vec(N)], t: 'el piso empuja al carrito hacia arriba' },
        { s: [vec('a')], t: 'aceleración, flecha punteada: cuánto cambia v⃗' },
        { s: [vec('v')], t: 'velocidad del carrito' },
        { s: 'm', t: 'masa del carrito con las papas' },
        { s: 't', t: 'tiempo: con ▶ el juego avanza solo' },
      ],
      controles: [
        { id: 'F', etiqueta: 'Empujón, F', color: 'c-o', min: 0, max: 120, paso: 20, inicio: 40, unidad: 'N', decimales: 0 },
        { id: 'm', etiqueta: 'Masa, m', min: 20, max: 60, paso: 10, inicio: 40, unidad: 'kg', decimales: 0 },
        { id: 't', etiqueta: 't', min: 0, max: 3, paso: 0.1, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: juego1,
      // La lectura enuncia la relación entre la fuerza, la masa y la aceleración.
      lectura: val => (val.F === 0 ? ['Sin empujón no acelera: sigue quieto'] : [pj(N_(val.F)), ` sobre ${val.m} kg: acelera ${f(val.F / val.m)} m/s²`]),
      resumen: { F: 80, m: 40, t: 1.5 },
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora el carrito ya va hacia la derecha, y tú lo empujas hacia la izquierda para frenarlo. ¿Hacia dónde apunta su aceleración?',
      datos: ['El carrito va hacia la derecha.', 'Tu mano lo empuja hacia la izquierda con 60 N.', 'Las ruedas casi no frenan.'],
      opciones: [
        { id: 'c', texto: 'Hacia la izquierda', correcta: true },
        { id: 'v', texto: 'Hacia la derecha', error: 'D1', siFuera: 'Elegiste por la velocidad: el carrito sí se mueve hacia la derecha. Pero la aceleración sigue a la fuerza, y la única fuerza de lado es tu mano, que empuja hacia la izquierda.' },
        { id: 'frena', texto: 'No tiene: va frenando', error: 'AC-FRENA', siFuera: 'Va frenando, cierto, pero frenar es cambiar de velocidad, y todo cambio de velocidad es una aceleración. Si su velocidad baja un poco cada segundo, el carrito tiene aceleración, aunque se mueva cada vez más lento.' },
        { id: 'cero', texto: 'No tiene: la fuerza es constante', error: 'D3', siFuera: 'La fuerza es constante, cierto, pero una fuerza constante da una aceleración constante, no una aceleración cero. La aceleración solo es cero cuando la fuerza neta es cero, y aquí tu mano sigue empujando.' },
      ],
      dibujo: est(PRED1),
      revelar: est(REVELA1),
      coincide: 'Coincide: la aceleración apunta como la fuerza neta, a la izquierda, aunque el carrito vaya a la derecha.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: MIRA1,
      pasos: [
        { estado: { corte: 0 }, texto: 'El carrito de 30 kg va a 6 m/s hacia la derecha, y tu mano lo empuja hacia la izquierda para frenarlo.', ecuacion: [F, ' = ', pj('60 N'), ', hacia la izquierda'] },
        { estado: { corte: 1 }, texto: 'El peso y la normal se anulan y las ruedas casi no frenan, así que tu empujón es la fuerza neta. La aceleración apunta hacia donde apunta ella, a la izquierda:', ecuacion: ['a = ', frac('60', '30'), ' = 2 m/s², hacia la izquierda'] },
        { estado: { corte: 2 }, texto: 'Una aceleración de 2 m/s² contra el avance quiere decir que el carrito pierde 2 m/s en cada segundo: al primer segundo ya va a 4 m/s.', ecuacion: ['v = 6 − 2 · 1 = 4 m/s'] },
        { estado: { corte: 3 }, texto: 'A los 3 s ya perdió sus 6 m/s y se detiene por un instante. La aceleración sigue apuntando a la izquierda, porque tu mano sigue empujando hacia allá.', ecuacion: ['v = 6 − 2 · 3 = 0'] },
        { estado: { corte: 4 }, texto: 'Si sigues empujando, el carrito regresa hacia la izquierda, cada vez más rápido. El signo menos de la velocidad dice que ahora va hacia ese lado.', ecuacion: ['v = 6 − 2 · 4 = −2 m/s'] },
      ],
    },
    regla: {
      texto: 'La fuerza neta, la suma de todas las fuerzas con su sentido, le da al cuerpo una aceleración que apunta hacia donde apunta ella, aunque el cuerpo vaya al otro lado: al frenar un carrito que va a la derecha, la aceleración apunta a la izquierda. Con la misma fuerza, más masa acelera menos, porque hay más materia que mover.',
      ecuacion: [...SF, ' = m · ', vec('a'), ';   a = ', frac('ΣF', 'm')],
      condicion: 'las fuerzas se suman con su signo, la masa no cambia y todo se mira desde el piso, que no acelera; desde un vehículo que frena o acelera, las cosas se mueven sin que ninguna fuerza las empuje.',
      dibujo: est(REVELA1),
    },
    // Así se resuelve: dos fuerzas opuestas sobre un trineo o una carreta (otra lista que «Ahora tú») y, en las semillas
    // impares, la distancia que recorre desde el reposo.
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900), ob = r.de(COSAS1_RS);
        if (sm % 2 === 1) {
          const c = elegir(() => { const m = r.de([4, 5, 8, 10]), Fv = r.de([20, 40, 60]), t = r.de([2, 3, 4]); const a = Fv / m, d = a * t * t / 2; return exacto(a) && exacto(d) && { m, Fv, t, a, d }; });
          return {
            enunciado: [`${mayus(ob.n)} de ${c.m} kg parte del reposo empujad${ob.n.startsWith('una') ? 'a' : 'o'} por una fuerza neta de `, pj(N_(c.Fv)), `. ¿Qué distancia recorre en ${c.t} s?`],
            datos: [D.segunda, D.reposo],
            dibujo: est(figPiso({ cosa: { tipo: ob.cosa, x: 100, texto: `${c.m} kg` }, mano: 1, fz: { P: c.m * G, N: c.m * G, F: c.Fv, tP: 'P⃗', tN: 'N⃗', tF: `F = ${N_(c.Fv)}`, adir: 1 },
              textos: [{ x: 8, y: 22, texto: `parte del reposo; d en ${c.t} s: ?`, ancla: 'start', peso: 400 }] })),
            pasos: [
              { tipo: 'pide', texto: `Piden la distancia que recorre en ${c.t} s.` },
              { tipo: 'datos', texto: [`Masa: ${c.m} kg. Fuerza neta: `, pj(N_(c.Fv)), '. Parte del reposo.'] },
              { tipo: 'regla', texto: 'Ninguna fórmula lleva directo de la fuerza a la distancia, así que se va en dos pasos: la segunda ley da la aceleración, y con ella la fórmula del reposo da la distancia.', ecuacion: ['a = ', frac('ΣF', 'm')] },
              { tipo: 'cuentas', texto: `Primero, la aceleración: a = ${c.Fv} ÷ ${c.m} = ${f(c.a)} m/s². Después, esa aceleración y el tiempo entran en d = a · t² / 2, la fórmula del reposo:`, ecuacion: [`d = ${f(c.a)} · ${c.t}² ÷ 2 = `, neg(`${f(c.d)} m`)] },
              { tipo: 'sentido', texto: `El tiempo va al cuadrado porque el cuerpo acelera desde cero: cada segundo va más rápido y recorre más que en el anterior, y en ${c.t} s suma ${f(c.d)} m.` },
            ],
            respuesta: [neg(`d = ${f(c.d)} m`)],
          };
        }
        const c = elegir(() => { const m = r.de([5, 8, 10, 20]), F1 = r.de([30, 50, 70, 90]), F2 = r.de([10, 20, 30]); const a = (F1 - F2) / m; return F1 > F2 && exacto(a) && !(m === 10 && F1 === 70 && F2 === 30) && { m, F1, F2, a }; });
        return {
          enunciado: [`Sobre ${ob.n} de ${c.m} kg, en un piso liso, actúan dos fuerzas horizontales: `, sub(F, '1'), ' = ', pj(N_(c.F1)), ' hacia la derecha y ', sub(F, '2'), ' = ', pj(N_(c.F2)), ' hacia la izquierda. ¿Cuánto acelera?'],
          datos: [D.segunda],
          dibujo: est(figPiso({ cosa: { tipo: ob.cosa, x: 100, texto: `${c.m} kg` }, fz: { P: c.m * G, N: c.m * G, F: c.F1, F2: c.F2, tP: 'P⃗', tN: 'N⃗', tF: `F_1 = ${N_(c.F1)}`, tF2: `F_2 = ${N_(c.F2)}`, adir: 1, ta: 'a = ?' } })),
          pasos: [
            { tipo: 'pide', texto: 'Piden la aceleración.' },
            { tipo: 'datos', texto: [`Masa: ${c.m} kg. Hacia la derecha, `, pj(N_(c.F1)), '; hacia la izquierda, ', pj(N_(c.F2)), '.'] },
            { tipo: 'regla', texto: 'Las dos fuerzas están en la misma línea, pero tiran hacia lados opuestos, así que se restan. Esa fuerza neta, dividida entre la masa, da la aceleración.', ecuacion: [...SF, ' = m · a'] },
            { tipo: 'cuentas', texto: `La fuerza neta es ΣF = ${c.F1} − ${c.F2} = ${c.F1 - c.F2} N, hacia la derecha, porque gana la fuerza mayor. Ahora se divide entre la masa:`, ecuacion: [`a = ${c.F1 - c.F2} ÷ ${c.m} = `, neg(A_(c.a))] },
            { tipo: 'sentido', texto: `Acelera hacia la derecha, el lado de la fuerza mayor. Si sumaras las dos fuerzas como si empujaran juntas, darías ${f((c.F1 + c.F2) / c.m)} m/s², más de lo que en verdad acelera.` },
          ],
          respuesta: [neg(A_(c.a)), ', hacia la derecha'],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4;
        if (k === 0) {
          const ob = r.de(COSAS1_AT);
          const c = elegir(() => { const m = r.de([4, 5, 10, 20, 25]), F1 = r.de([50, 60, 80, 90, 120]), F2 = r.de([10, 20, 30, 40]), a = (F1 - F2) / m;
            return F1 > F2 && exacto(a) && distintos(a, (F1 + F2) / m, F1 / m, m / (F1 - F2)) && !(m === 30 && F1 - F2 === 60) && { m, F1, F2, a }; });
          return {
            pregunta: [`Sobre ${ob.n} de ${c.m} kg, en un piso liso, tú empujas con `, pj(N_(c.F1)), ' hacia la derecha y tu amigo con ', pj(N_(c.F2)), ' hacia la izquierda. ¿Cuánto acelera?'],
            datos: [D.segunda],
            dibujo: est(figPiso({ cosa: { tipo: ob.cosa, x: 100, texto: `${c.m} kg` }, fz: { P: c.m * G, N: c.m * G, F: c.F1, F2: c.F2, tP: 'P⃗', tN: 'N⃗', tF: `F = ${N_(c.F1)}`, tF2: N_(c.F2), adir: 1, ta: 'a = ?' } })),
            opciones: opciones(c.a, [
              { id: 'suma', valor: (c.F1 + c.F2) / c.m, error: 'DN-SUMA', siFuera: 'Bien dividir entre la masa, pero sumaste las dos fuerzas como si empujaran hacia el mismo lado. Tu amigo empuja en contra, así que su fuerza se resta de la tuya antes de dividir.' },
              { id: 'una', valor: c.F1 / c.m, error: 'DN-UNA', siFuera: 'Usaste solo tu empujón, como si tu amigo no estuviera. Su fuerza también actúa sobre el mismo cuerpo, en contra de la tuya, así que la fuerza neta es la resta de las dos.' },
              { id: 'inv', valor: c.m / (c.F1 - c.F2), error: 'DN-INV', siFuera: 'Bien la fuerza neta, pero dividiste la masa entre la fuerza. Es al revés, a = ΣF ÷ m, porque más fuerza da más aceleración y más masa da menos.' },
              { id: 'por', valor: (c.F1 - c.F2) * c.m, error: 'DN-POR', siFuera: 'Bien la fuerza neta, pero la multiplicaste por la masa. Así, un cuerpo con más masa aceleraría más, y pasa lo contrario: la fuerza neta se divide entre la masa.' },
            ], A_),
            solucion: { texto: 'Las fuerzas se oponen, así que la fuerza neta es su resta y apunta hacia el lado de la mayor. Esa neta, dividida entre la masa, da la aceleración:', ecuacion: [`a = (${c.F1} − ${c.F2}) ÷ ${c.m} = `, neg(A_(c.a))] },
          };
        }
        if (k === 1) {
          if (sm % 8 < 4) {
            const ob = r.de(COSAS1_AT), c = elegir(() => { const m = r.de([15, 20, 30, 40, 50]), a = r.de([0.5, 2.5, 3, 4]), Fv = m * a;
              return exacto(Fv) && distintos(Fv, m / a, m * G * a, m + a) && !(a === 2) && { m, a, Fv }; });
            return {
              pregunta: [`¿Qué fuerza neta hace falta para que ${ob.n} de ${c.m} kg acelere ${f(c.a)} m/s²?`],
              datos: [D.segunda],
              opciones: opciones(c.Fv, [
                { id: 'div', valor: c.m / c.a, error: 'DN-DIV', siFuera: 'Bien usar la masa y la aceleración, pero las dividiste. La fuerza neta es su producto, ΣF = m · a: para acelerar más masa, o para acelerarla más, hace falta más fuerza.' },
                { id: 'peso', valor: c.m * G * c.a, error: 'DN-PESO', siFuera: 'Bien multiplicar, pero usaste el peso, m · g, en lugar de la masa. La segunda ley pide la masa en kilogramos; el peso solo entra cuando es una de las fuerzas que se suman.' },
                { id: 'suma', valor: c.m + c.a, error: 'DN-SUMA2', siFuera: 'Sumaste la masa y la aceleración, pero son magnitudes distintas, una en kilogramos y otra en m/s², y no se pueden sumar. La segunda ley las multiplica: ΣF = m · a.' },
              ], N_),
              solucion: { texto: 'La segunda ley dice que la fuerza neta es la masa por la aceleración, así que basta multiplicar los dos datos:', ecuacion: [`ΣF = ${c.m} · ${f(c.a)} = `, neg(N_(c.Fv))] },
            };
          }
          // La masa de un cuerpo unido a otro (San Marcos 2021, pregunta 81)
          const c = elegir(() => { const Fv = r.de([60, 90, 120, 150]), a = r.de([2, 3, 5]), m1 = r.de([4, 6, 8, 10]), m2 = Fv / a - m1;
            return Number.isInteger(m2) && m2 > 0 && m2 !== m1 && distintos(m2, Fv / a, Fv * a, Fv / a + m1) && { Fv, a, m1, m2 }; });
          return {
            pregunta: ['Una fuerza neta de ', pj(N_(c.Fv)), ` acelera juntos, a ${c.a} m/s², a un bloque de ${c.m1} kg y a otro unido a él. ¿Qué masa tiene el otro bloque?`],
            datos: [D.segunda, D.juntos],
            opciones: opciones(c.m2, [
              { id: 'total', valor: c.Fv / c.a, error: 'DN-TOTAL', siFuera: 'Bien: la fuerza entre la aceleración da la masa de los dos bloques juntos, porque aceleran como un solo cuerpo. Pero te piden solo el otro bloque, así que falta restar el que ya conoces.' },
              { id: 'suma', valor: c.Fv / c.a + c.m1, error: 'DN-SUMA-M', siFuera: 'Bien la masa total, pero le sumaste el bloque conocido. Ese bloque ya está dentro de la masa total; para quedarte solo con el otro, hay que restarlo.' },
              { id: 'por', valor: c.Fv * c.a, error: 'DN-POR', siFuera: 'Multiplicaste la fuerza por la aceleración. De ΣF = m · a, la masa se despeja dividiendo, m = ΣF ÷ a, y esa es la masa de los dos juntos.' },
            ], v => `${f(v)} kg`),
            solucion: { texto: 'Los dos bloques aceleran juntos, así que la fuerza entre la aceleración da su masa total. A esa masa se le resta la del bloque conocido:', ecuacion: [`${c.Fv} ÷ ${c.a} − ${c.m1} = `, neg(`${c.m2} kg`)] },
          };
        }
        if (k === 2) {
          const s = SITUACIONES1[Math.floor(sm / 4) % SITUACIONES1.length];
          return {
            pregunta: [s.pregunta],
            datos: [D.segunda],
            opciones: opciones(0, [
              { id: 'mov', texto: s.mov, error: s.fb ? s.fb.mov[0] : 'D1', siFuera: s.fb ? s.fb.mov[1] : 'Así se mueve, cierto, pero elegiste por la velocidad. La aceleración no sigue al movimiento sino a la fuerza neta: apunta hacia donde jala la suma de las fuerzas.' },
              { id: 'cero', texto: s.cero, error: s.fb ? s.fb.cero[0] : 'D3', siFuera: s.fb ? s.fb.cero[1] : 'Para que no haya aceleración, la velocidad no debería cambiar. Aquí sí cambia, y todo cambio de velocidad, también frenar, es una aceleración que apunta hacia donde jala la fuerza neta.' },
              { id: 'otro', texto: s.otro, error: s.fb ? s.fb.otro[0] : 'AC-FRENA', siFuera: s.fb ? s.fb.otro[1] : 'Bien ver que algo cambia, pero la aceleración no se adivina por cómo va el movimiento ni por el terreno. Apunta hacia donde jala la suma de todas las fuerzas, con su sentido.' },
            ], () => '', s.bien),
            solucion: { texto: 'La aceleración no sigue a la velocidad: apunta hacia donde apunta la fuerza neta, la suma de todas las fuerzas con su sentido.', ecuacion: [s.bien] },
          };
        }
        // Nivel examen: la fuerza a partir de la distancia y el tiempo (San Marcos 2026-II) o la rapidez tras empujar
        // (San Marcos 2023-I, la tabla de cajas).
        if (sm % 8 >= 4) {
          const c = elegir(() => { const m = r.de([2, 4, 5, 8]), a = r.de([1, 2, 3, 4]), t = r.de([2, 3, 4, 5]), d = a * t * t / 2, Fv = m * a;
            return exacto(d) && distintos(Fv, m * d / t, m * d / (t * t), 2 * m * d / t, m * d) && !(m === 5 && d === 16) && { m, a, t, d, Fv }; });
          return {
            pregunta: [`Una caja de ${c.m} kg parte del reposo en un piso liso. Una sola fuerza horizontal constante la hace recorrer ${f(c.d)} m en ${c.t} s. ¿Cuánto vale esa fuerza?`],
            datos: [D.segunda, D.reposo],
            opciones: opciones(c.Fv, [
              { id: 'media', valor: c.m * c.d / c.t, error: 'DN-VMEDIA', siFuera: 'Bien multiplicar por la masa, pero d ÷ t es la velocidad media, en m/s, no la aceleración. La aceleración sale de d = a · t² / 2, con el tiempo al cuadrado.' },
              { id: 'dos', valor: c.m * c.d / (c.t * c.t), error: 'DN-SIN-DOS', siFuera: 'Bien usar d = a · t² / 2, pero al despejar perdiste el 2. Como la aceleración está dividida entre 2, el 2 pasa multiplicando: a = 2d ÷ t².' },
              { id: 'final', valor: 2 * c.m * c.d / c.t, error: 'DN-VFINAL', siFuera: 'Bien: 2d ÷ t es la rapidez con que termina. Pero la segunda ley pide la aceleración, no la rapidez, y falta dividir otra vez entre el tiempo.' },
              { id: 'pord', valor: c.m * c.d, error: 'DN-POR-D', siFuera: 'Multiplicaste la masa por la distancia. La segunda ley multiplica la masa por la aceleración, que hay que sacar antes de d = a · t² / 2.' },
            ], N_),
            solucion: { texto: 'Como parte del reposo, la distancia y el tiempo dan la aceleración con d = a · t² / 2. Después, la segunda ley da la fuerza, masa por aceleración:', ecuacion: [`a = 2 · ${f(c.d)} ÷ ${c.t}² = ${c.a} m/s²;   F = ${c.m} · ${c.a} = `, pj(N_(c.Fv))] },
          };
        }
        const c = elegir(() => { const m = r.de([2, 4, 5, 8]), Fv = r.de([4, 6, 10, 12, 20]), t = r.de([2, 3, 4, 5]), v = Fv * t / m;
          return exacto(v) && v <= 12 && distintos(v, Fv / m, Fv * t, Fv * t / (2 * m)) && { m, Fv, t, v }; });
        return {
          pregunta: [`Una caja de ${c.m} kg está quieta en un piso liso. La empujas con `, pj(N_(c.Fv)), ` horizontales durante ${c.t} s. ¿Qué rapidez tiene al terminar?`],
          datos: [D.segunda, D.reposo],
          opciones: opciones(c.v, [
            { id: 'a', valor: c.Fv / c.m, error: 'DN-SOLO-A', siFuera: 'Bien la aceleración, pero te quedaste ahí. La aceleración dice cuánta rapidez gana en cada segundo; para saber cuánta ganó en todo el empujón, falta multiplicarla por el tiempo.' },
            { id: 'sinm', valor: c.Fv * c.t, error: 'DN-SIN-M', siFuera: 'Multiplicaste la fuerza por el tiempo sin pasar por la masa. La rapidez que gana depende de la aceleración, la fuerza entre la masa: una caja con más masa gana menos.' },
            { id: 'medio', valor: c.Fv * c.t / (2 * c.m), error: 'DN-MEDIO', siFuera: 'Bien la aceleración, pero dividiste entre 2. El medio va en la fórmula de la distancia, d = a · t² / 2; la rapidez desde el reposo es v = a · t, sin dividir.' },
          ], v => `${f(v)} m/s`),
          solucion: { texto: 'La fuerza entre la masa da la aceleración, lo que gana de rapidez cada segundo. Multiplicada por el tiempo, da la rapidez al terminar:', ecuacion: [`a = ${c.Fv} ÷ ${c.m} = ${f(c.Fv / c.m)} m/s²;   v = ${f(c.Fv / c.m)} · ${c.t} = `, neg(`${f(c.v)} m/s`)] },
        };
      },
    },
  };

  // ======================= 2: masa y peso (la balanza de resorte en la Tierra, Marte y la Luna) =======================
  // Cambia: la masa de la bolsa y el lugar · Permanece: la balanza · Progresa: lo que marca (el peso) · Se reserva:
  // empujar de lado en la Luna (Predice) · Debe verse: el peso cambia con g; la masa, no.
  const LUGAR = { 10: 'la Tierra', 3.7: 'Marte', 1.6: 'la Luna' };
  const D2 = {
    peso: ['Peso: ', P, ' = m · ', g, ', con la ', g, ' del lugar'],
    gs: [g, ' en la Tierra: 10 m/s²; en Marte, ', gM, ': unos 3,7 m/s²; en la Luna, ', gL, ': unos 1,6 m/s²'],
    gL: [gL, ' (en la Luna): unos 1,6 m/s²'],
    gM: [gM, ' (en Marte): unos 3,7 m/s²'],
    dina: 'Una balanza de resorte colgada marca el peso de lo que cuelga, si está quieto',
  };
  // La bolsa colgada de la balanza de resorte (gancho bajo la viga): el resorte se estira 1,1 px por newton.
  function figBalanzaR(o) {
    const x = 160, estira = Math.min(80, (o.P || 0) * 1.1), y1 = 72 + estira, objs = [{ tipo: 'viga', x0: 96, x1: 224, y: 30 }, { tipo: 'gancho', x, y: 30 },
      { tipo: 'resorte', de: [x, 52], a: [x, y1], vueltas: 9 }, Object.assign({ tipo: 'bolsa', x, y: y1, w: 56, h: 36, texto: o.texto || '' }, o.cosa || {})];
    const fl = [];
    if (o.P !== undefined) fl.push({ de: [x - 12, y1 + 36], ang: 270, largo: LARGO_FIJO, color: 'h', texto: o.tP || `P = ${N_(o.P)}`, rumbo: [-1, 0.2] });
    if (o.tF) fl.push({ de: [x + 14, y1], ang: 90, largo: LARGO_FIJO, color: 'o', texto: o.tF, rumbo: [1, 0] });
    return { alto: 240, objetos: objs, flechas: fl, textos: [{ x: 238, y: 46, texto: o.lectura || '', ancla: 'start' }, ...(o.textos || [])], alt: o.alt };
  }
  const juego2 = val => {
    const Pv = val.m * val.g;
    return est(figBalanzaR({ P: Pv, tP: 'P⃗', tF: 'F⃗', texto: `${val.m} kg`, lectura: `marca ${N_(Pv)}`,
      textos: [{ x: 8, y: 22, texto: `En ${LUGAR[val.g]}`, ancla: 'start' }],
      alt: `Una bolsa de ${val.m} kg colgada de la balanza de resorte en ${LUGAR[val.g]}: marca ${f(Pv)} N.` }));
  };
  // Una cosa empujada de lado (o levantada) en un lugar, con su DCL: la de Predice y la de varios ejemplos.
  const figLugar = (o) => figPiso(Object.assign({ cosa: { tipo: 'caja', x: 100, w: 70, h: 44, texto: o.texto }, mano: 1 }, o,
    { textos: [{ x: 8, y: 22, texto: o.lugar || '', ancla: 'start' }, ...(o.textos || [])] }));
  const PRED2 = figLugar({ texto: '20 kg', lugar: 'En la Luna, piso liso', fz: { P: 32, N: 32, F: 40, tP: 'P⃗', tN: 'N⃗', tF: 'F = 40 N', adir: 1, ta: 'a = ?' },
    alt: 'En la Luna, una persona empuja de lado una caja de 20 kg con 40 N, sobre un piso liso. La aceleración, con un signo de pregunta.' });
  const REVELA2 = figLugar({ texto: '20 kg', lugar: 'En la Luna, piso liso', fz: { P: 32, N: 32, F: 40, tP: 'P = 32 N', tN: 'N = 32 N', tF: 'F = 40 N', adir: 1, ta: 'a = 2 m/s²' },
    alt: 'En la Luna la caja de 20 kg pesa 32 N, pero empujada de lado con 40 N acelera 2 m/s², igual que en la Tierra.' });
  const corte2 = (lugar, Pv) => { const d = figLugar({ texto: '20 kg', lugar, fz: { P: Pv, N: Pv, F: 40, tP: `P = ${N_(Pv)}`, tN: `N = ${N_(Pv)}`, tF: 'F = 40 N', adir: 1, ta: 'a = 2 m/s²' } });
    return { objetos: d.objetos, flechas: d.flechas, textos: d.textos }; };
  const MIRA2 = Object.assign(figLugar({ texto: '20 kg' }), { alt: 'La misma caja de 20 kg empujada con 40 N en la Tierra y en la Luna: pesa distinto y acelera igual.',
    cortes: [corte2('En la Tierra', 200), corte2('En la Luna', 32)] });

  // Ejemplos de la idea 2. Cuentas rehechas aparte (cuentas.js: pesa con la g de cada lugar y acelera con la masa):
  // 50·10; 70 kg; 70·1,6; 30/10; 20·3,7; 120/10·1,6; 60/30; 37/3,7·10; (300 − 250)/25; 36/4; (50 − 32)/20 con cada
  // alternativa; las tres proposiciones del astronauta; 74/3,7 y 40/20 con cada alternativa; 30/2·60 con cada
  // alternativa; 48/1,6·2 con cada alternativa.
  const EJEMPLOS_MASA = [
    { nivel: 1, titulo: 'El peso de un saco',
      figura: est(figBalanzaR({ P: 500, tP: 'P = ?', cosa: { tipo: 'bolsa', w: 60, h: 40 }, texto: '50 kg', textos: [{ x: 8, y: 22, texto: 'En la Tierra', ancla: 'start' }], alt: 'Un saco de 50 kg colgado de una balanza de resorte en la Tierra; su peso, con un signo de pregunta.' })),
      enunciado: ['Un saco de quinua tiene 50 kg de masa. ¿Cuánto pesa en la Tierra?'],
      datos: [D2.peso, D2.gs],
      solucion: [{ texto: 'El peso es la masa por la g del lugar; en la Tierra, cada kilogramo pesa 10 N:', ecuacion: [P, ' = 50 · 10 = ', pp('500 N')] }],
      respuesta: ['Pesa ', pp('500 N')] },
    { nivel: 1, titulo: 'La masa en la Luna',
      figura: est({ alto: 200, piso: { y: 186 }, objetos: [{ tipo: 'persona', x: 120, y: 186, alto: 120, texto: '70 kg' }], textos: [{ x: 8, y: 22, texto: 'En la Tierra: 70 kg', ancla: 'start' }, { x: 312, y: 22, texto: 'En la Luna: ? kg', ancla: 'end' }],
        alt: 'Una astronauta de 70 kg. Su masa en la Luna, con un signo de pregunta.' }),
      enunciado: ['Una astronauta tiene 70 kg de masa en la Tierra. ¿Qué masa tiene cuando llega a la Luna?'],
      datos: [D2.peso, D2.gs],
      solucion: [{ texto: 'La masa es cuánta materia tiene la astronauta y cuánto cuesta acelerarla, y eso no cambia al viajar: en la Luna sigue teniendo 70 kg, aunque allá pese mucho menos.' }],
      respuesta: [neg('70 kg'), ', la misma'] },
    { nivel: 1, titulo: 'El peso en la Luna',
      figura: est({ alto: 200, piso: { y: 186 }, objetos: [{ tipo: 'persona', x: 120, y: 186, alto: 120, texto: '70 kg' }],
        flechas: [{ de: [128, 128], ang: 270, largo: LARGO_FIJO, color: 'h', texto: 'P = ?', rumbo: [1, 0] }], textos: [{ x: 8, y: 22, texto: 'En la Luna', ancla: 'start' }],
        alt: 'La astronauta de 70 kg en la Luna; su peso, con un signo de pregunta.' }),
      enunciado: ['¿Cuánto pesa en la Luna la astronauta de 70 kg?'],
      datos: [D2.peso, D2.gs],
      solucion: [{ texto: 'La masa no cambia, pero en la Luna cada kilogramo pesa solo 1,6 N, así que el peso se calcula con la g de allá:', ecuacion: [P, ' = 70 · 1,6 = ', pp('112 N')] }],
      respuesta: ['Pesa ', pp('112 N')] },
    { nivel: 1, titulo: 'De peso a masa',
      figura: est(figBalanzaR({ P: 30, tP: 'P = 30 N', texto: '? kg', lectura: 'marca 30 N', textos: [{ x: 8, y: 22, texto: 'En la Tierra', ancla: 'start' }], alt: 'Una bolsa colgada de la balanza de resorte en la Tierra; la balanza marca 30 N.' })),
      enunciado: ['En la Tierra, la balanza de resorte del mercado marca 30 N con una bolsa de habas colgada y quieta. ¿Qué masa tiene la bolsa?'],
      datos: [D2.peso, D2.gs, D2.dina],
      solucion: [{ texto: 'Como el peso es la masa por g, la masa es el peso dividido entre g:', ecuacion: ['m = ', frac(pp('30'), '10'), ' = ', neg('3 kg')] }],
      respuesta: [neg('m = 3 kg')] },
    { nivel: 1, titulo: 'Un perro en Marte',
      figura: est(figLugar({ texto: '20 kg', mano: 0, lugar: 'En Marte', fz: { P: 74, N: 74, tP: 'P = ?', tN: 'N⃗' }, alt: 'Una caja con un perro de 20 kg, en Marte; su peso, con un signo de pregunta.' })),
      enunciado: ['Un perro de 20 kg viaja en una nave a Marte. ¿Cuánto pesa allá?'],
      datos: [D2.peso, D2.gs],
      solucion: [{ texto: 'El peso se calcula con la g del lugar donde está el cuerpo, en este caso la de Marte:', ecuacion: [P, ' = 20 · 3,7 = ', pp('74 N')] }],
      respuesta: ['Pesa ', pp('74 N')] },
    { nivel: 2, titulo: 'De la Tierra a la Luna',
      figura: est(figBalanzaR({ P: 120, tP: 'P = 120 N', texto: 'mochila', lectura: 'marca 120 N', textos: [{ x: 8, y: 22, texto: 'En la Tierra', ancla: 'start' }, { x: 312, y: 228, texto: 'En la Luna: ?', ancla: 'end' }], alt: 'Una mochila que pesa 120 N en la Tierra; su peso en la Luna, con un signo de pregunta.' })),
      enunciado: ['Una mochila pesa 120 N en la Tierra. ¿Cuánto pesa en la Luna?'],
      datos: [D2.peso, D2.gs],
      solucion: [
        { texto: 'Primero, su masa, con el peso y la g de la Tierra:', ecuacion: ['m = ', frac(pp('120'), '10'), ' = 12 kg'] },
        { texto: 'La masa no cambia al viajar; en la Luna, esos mismos 12 kg pesan:', ecuacion: [P, ' = 12 · 1,6 = ', pp('19,2 N')] },
      ],
      respuesta: ['Pesa ', pp('19,2 N')] },
    { nivel: 2, titulo: 'La misma fuerza en Marte',
      figura: est(figLugar({ texto: '30 kg', lugar: 'En Marte, piso liso', fz: { P: 111, N: 111, F: 60, tP: 'P⃗', tN: 'N⃗', tF: 'F = 60 N', adir: 1, ta: 'a = ?' }, alt: 'En Marte, una persona empuja de lado una caja de 30 kg con 60 N.' })),
      enunciado: ['En Marte, una astronauta empuja de lado una caja de 30 kg con ', pj('60 N'), ', sobre un piso liso. ¿Cuánto acelera la caja?'],
      datos: [D2.peso, D2.gs, D.segunda],
      solucion: [
        { texto: 'El peso y la normal son verticales y se cancelan, aunque en Marte valgan menos que en la Tierra. De lado solo actúa el empujón de la astronauta.' },
        { texto: 'La masa es la de siempre, así que la aceleración es el empujón entre esa masa:', ecuacion: ['a = ', frac('60', '30'), ' = ', neg('2 m/s²')] },
      ],
      respuesta: [neg('a = 2 m/s²'), ', como en la Tierra'] },
    { nivel: 2, titulo: 'La balanza que viajó a Marte',
      figura: est(figBalanzaR({ P: 37, tP: 'P = 37 N', texto: '? kg', lectura: 'marca 37 N', textos: [{ x: 8, y: 22, texto: 'En Marte', ancla: 'start' }, { x: 312, y: 228, texto: 'En la Tierra: ?', ancla: 'end' }], alt: 'Una bolsa colgada de una balanza de resorte en Marte: marca 37 N.' })),
      enunciado: ['En Marte, una balanza de resorte marca 37 N con una bolsa colgada y quieta. ¿Cuánto marcaría en la Tierra con la misma bolsa?'],
      datos: [D2.peso, D2.gs, D2.dina],
      solucion: [
        { texto: 'La bolsa cuelga quieta, así que la balanza marca su peso en Marte; su masa sale con la g de allá:', ecuacion: ['m = ', frac(pp('37'), gM), ' = ', frac('37', '3,7'), ' = 10 kg'] },
        { texto: 'Con esa misma masa, en la Tierra la balanza marcaría:', ecuacion: [P, ' = 10 · 10 = ', pp('100 N')] },
      ],
      respuesta: ['Marcaría ', pp('100 N')] },
    { nivel: 2, titulo: 'Levantar una caja en la Tierra',
      figura: est({ alto: 220, techo: { y: 14, x0: 60, x1: 160 }, objetos: [{ tipo: 'cuerda', de: [110, 14], a: [110, 120] }, { tipo: 'caja', x: 110, y: 164, w: 60, h: 44, texto: '25 kg' }],
        flechas: [{ de: [124, 120], ang: 90, largo: LARGO_FIJO, color: 'o', texto: 'T = 300 N', rumbo: [1, 0] }, { de: [96, 164], ang: 270, largo: LARGO_FIJO, color: 'h', texto: 'P⃗', rumbo: [-1, 0] }, { de: [210, 150], ang: 90, largo: LARGO_FIJO, color: 'tinta', discontinua: true, texto: 'a = ?', rumbo: [1, 0] }],
        alt: 'Una caja de 25 kg levantada con una cuerda que jala hacia arriba con 300 N.' }),
      enunciado: ['Con una cuerda levantas una caja de 25 kg: la cuerda la jala hacia arriba con ', pj('300 N'), '. ¿Cuánto acelera la caja?'],
      datos: [D2.peso, D2.gs, D.segunda],
      solucion: [
        { texto: 'Sobre la caja tiran la cuerda, hacia arriba, y el peso, hacia abajo; la fuerza neta es su resta:', ecuacion: [...SF, ' = 300 − 25 · 10 = 50 N, hacia arriba'] },
        { texto: 'Esa fuerza neta, dividida entre la masa, da la aceleración hacia arriba:', ecuacion: ['a = ', frac('50', '25'), ' = ', neg('2 m/s²')] },
      ],
      respuesta: [neg('a = 2 m/s²'), ', hacia arriba'] },
    { nivel: 2, titulo: 'La g de otro planeta',
      figura: est(figBalanzaR({ P: 36, tP: 'P = 36 N', texto: '4 kg', lectura: 'marca 36 N', textos: [{ x: 8, y: 22, texto: 'Otro planeta', ancla: 'start' }], alt: 'Una roca de 4 kg colgada de una balanza de resorte en otro planeta: marca 36 N.' })),
      enunciado: ['En otro planeta, una roca de 4 kg colgada y quieta hace marcar 36 N a una balanza de resorte. ¿Cuánto vale g en ese planeta?'],
      datos: [D2.peso, D2.dina],
      solucion: [{ texto: 'De P = m · g se despeja la g del lugar, que es el peso dividido entre la masa:', ecuacion: [g, ' = ', frac(pp('36'), '4'), ' = ', pp('9 m/s²')] }],
      respuesta: [g, ' = ', pp('9 m/s²')] },
    { nivel: 3, titulo: 'Levantar una caja en la Luna',
      figura: est({ alto: 220, techo: { y: 14, x0: 60, x1: 160 }, objetos: [{ tipo: 'cuerda', de: [110, 14], a: [110, 120] }, { tipo: 'caja', x: 110, y: 164, w: 60, h: 44, texto: '20 kg' }],
        flechas: [{ de: [124, 120], ang: 90, largo: LARGO_FIJO, color: 'o', texto: 'T = 50 N', rumbo: [1, 0] }, { de: [96, 164], ang: 270, largo: LARGO_FIJO, color: 'h', texto: 'P⃗', rumbo: [-1, 0] }],
        textos: [{ x: 312, y: 30, texto: 'En la Luna; a = ?', ancla: 'end' }], alt: 'En la Luna, una caja de 20 kg levantada con una cuerda que jala con 50 N.' }),
      enunciado: ['En la Luna levantas con una cuerda una caja de 20 kg: la cuerda la jala hacia arriba con ', pj('50 N'), '. ¿Cuánto acelera la caja?'],
      alternativas: ['2,5 m/s²', 'No sube', '0,9 m/s²', '4,1 m/s²', '0,25 m/s²'],
      datos: [D2.peso, D2.gs, D.segunda],
      solucion: [
        { texto: 'En la Luna, la caja pesa poco, porque allá la g es de 1,6 m/s²:', ecuacion: [P, ' = 20 · 1,6 = ', pp('32 N')] },
        { texto: 'La cuerda jala más que el peso; lo que sobra hacia arriba es la fuerza neta, y dividida entre la masa da la aceleración:', ecuacion: ['a = ', frac('50 − 32', '20'), ' = ', neg('0,9 m/s²')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si olvidas el peso; ', neg('B'), ', si usas la g de la Tierra; ', neg('D'), ', si sumas el peso en vez de restarlo, y ', neg('E'), ', si divides 50 entre el peso en la Tierra.'] },
      ],
      respuesta: [neg('C'), ', ', neg('0,9 m/s²')] },
    { nivel: 3, titulo: 'El astronauta: verdadero o falso',
      figura: est({ alto: 200, piso: { y: 186 }, objetos: [{ tipo: 'persona', x: 120, y: 186, alto: 120, texto: '80 kg' }], textos: [{ x: 8, y: 22, texto: 'En la Luna', ancla: 'start' }],
        alt: 'Un astronauta de 80 kg en la Luna.' }),
      enunciado: ['Un astronauta de 80 kg va a la Luna. I. Allí su masa es menor. II. Allí pesa 128 N. III. Allí, la misma fuerza de lado, sin rozamiento, lo acelera igual. ¿Qué es verdadero (V) y qué falso (F)?'],
      alternativas: ['VVV', 'VFV', 'FFV', 'VVF', 'FVV'],
      datos: [D2.peso, D2.gs, D.segunda],
      solucion: [
        { texto: 'I es falsa, porque la masa no depende del lugar: sigue siendo de 80 kg. II es verdadera, porque en la Luna pesa:', ecuacion: [P, ' = 80 · 1,6 = ', pp('128 N')] },
        { texto: 'III es verdadera: de lado, la aceleración es la fuerza entre la masa, y como la masa no cambió, la misma fuerza lo acelera igual.' },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si crees que la masa baja; ', neg('B'), ', si además usas la g de la Tierra para el peso (800 N); ', neg('C'), ', si solo usas esa g, y ', neg('D'), ', si crees que la masa baja y que por eso acelera distinto.'] },
      ],
      respuesta: [neg('E'), ': FVV'] },
    { nivel: 3, titulo: 'Del dinamómetro al empujón',
      figura: est(figBalanzaR({ P: 74, tP: 'P = 74 N', texto: 'caja', lectura: 'marca 74 N', textos: [{ x: 8, y: 22, texto: 'En Marte', ancla: 'start' }], alt: 'En Marte, una caja colgada de un dinamómetro: marca 74 N.' })),
      enunciado: ['En Marte, un dinamómetro marca 74 N con una caja colgada y quieta. Después empujas esa caja de lado con ', pj('40 N'), ', sobre un piso liso. ¿Cuánto acelera?'],
      alternativas: ['2 m/s²', '0,54 m/s²', '5,41 m/s²', '1,85 m/s²', '20 m/s²'],
      datos: [D2.peso, D2.gs, D.segunda, D2.dina],
      solucion: [
        { texto: 'La caja cuelga quieta, así que el dinamómetro marca su peso en Marte; la masa es ese peso entre la g de allá:', ecuacion: ['m = ', frac('74', '3,7'), ' = 20 kg'] },
        { texto: 'De lado solo actúa tu empujón, y la aceleración es ese empujón entre la masa:', ecuacion: ['a = ', frac('40', '20'), ' = ', neg('2 m/s²')] },
        { texto: ['Las otras salen de un error: ', neg('B'), ', si divides entre el peso; ', neg('C'), ', si sacas la masa con la g de la Tierra; ', neg('D'), ', si divides 74 entre 40, y ', neg('E'), ', si das la masa en lugar de la aceleración.'] },
      ],
      respuesta: [neg('A'), ', ', neg('2 m/s²')] },
    { nivel: 3, titulo: 'Pesar en un planeta lejano',
      figura: est(figBalanzaR({ P: 30, tP: 'P = 30 N', texto: '2 kg', lectura: 'marca 30 N', textos: [{ x: 8, y: 22, texto: 'Otro planeta', ancla: 'start' }, { x: 312, y: 228, texto: 'persona de 60 kg: ?', ancla: 'end' }], alt: 'En un planeta lejano, un objeto de 2 kg colgado de una balanza de resorte: marca 30 N.' })),
      enunciado: ['En un planeta lejano, un objeto de 2 kg colgado y quieto hace marcar 30 N a una balanza de resorte. ¿Cuánto pesa allá una persona de 60 kg?'],
      alternativas: ['600 N', '900 N', '400 N', '1800 N', '40 N'],
      datos: [D2.peso, D2.dina],
      solucion: [
        { texto: 'El objeto cuelga quieto, así que la balanza marca su peso allá; ese peso entre la masa da la g del planeta:', ecuacion: [g, ' = ', frac('30', '2'), ' = 15 m/s²'] },
        { texto: 'Con esa g, el peso de la persona es su masa por 15 m/s²:', ecuacion: [P, ' = 60 · 15 = ', pp('900 N')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si usas la g de la Tierra; ', neg('C'), ', si divides entre 15 y multiplicas por 10; ', neg('D'), ', si multiplicas por 30, y ', neg('E'), ', si divides 600 entre 15.'] },
      ],
      respuesta: [neg('B'), ', ', pp('900 N')] },
    { nivel: 3, titulo: 'Levantar despacio y empujar',
      figura: est({ alto: 220, techo: { y: 14, x0: 60, x1: 160 }, objetos: [{ tipo: 'cuerda', de: [110, 14], a: [110, 120] }, { tipo: 'caja', x: 110, y: 164, w: 60, h: 44, texto: 'caja' }],
        flechas: [{ de: [124, 120], ang: 90, largo: LARGO_FIJO, color: 'o', texto: 'T = 48 N', rumbo: [1, 0] }, { de: [96, 164], ang: 270, largo: LARGO_FIJO, color: 'h', texto: 'P⃗', rumbo: [-1, 0] }],
        textos: [{ x: 312, y: 30, texto: 'En la Luna', ancla: 'end' }, { x: 312, y: 52, texto: 'sube a velocidad constante', ancla: 'end', peso: 400 }], alt: 'En la Luna, una caja que sube a velocidad constante colgada de una cuerda que jala con 48 N.' }),
      enunciado: ['En la Luna, para subir una caja a velocidad constante, la cuerda jala con ', pj('48 N'), '. ¿Con qué fuerza de lado, sobre un piso liso, aceleras esa caja 2 m/s²?'],
      alternativas: ['96 N', '9,6 N', '24 N', '60 N', '4,8 N'],
      datos: [D2.peso, D2.gs, D.segunda, D.primera],
      solucion: [
        { texto: 'A velocidad constante no hay aceleración, así que la cuerda iguala al peso: P = 48 N. La masa es ese peso entre la g de la Luna:', ecuacion: ['m = ', frac('48', '1,6'), ' = 30 kg'] },
        { texto: 'De lado, la fuerza que hace falta es la masa por la aceleración que se pide:', ecuacion: [F, ' = 30 · 2 = ', pj('60 N')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si usas el peso como si fuera la masa; ', neg('B'), ', si sacas la masa con la g de la Tierra; ', neg('C'), ', si divides el peso entre 2, y ', neg('E'), ', si das 48 ÷ 10.'] },
      ],
      respuesta: [neg('D'), ', ', pj('60 N')] },
  ];

  const COSAS2_AT = ['una mochila', 'una caja de herramientas', 'un saco de quinua'];
  const COSAS2_RS = ['una maleta', 'un balde de agua'];
  const LUGARES = [{ n: 'la Luna', g: 1.6, ficha: gL }, { n: 'Marte', g: 3.7, ficha: gM }];
  const masaPeso = {
    id: 'masa-y-peso',
    titulo: 'Masa y peso',
    pregunta: '¿Una caja acelera igual en la Luna que en la Tierra?',
    temas: ['Masa y peso'],
    pieza: 'fis-estatica',
    aprendizaje: 'La masa, lo que cuesta acelerar un cuerpo, es la misma en todas partes. El peso, P = m·g, cambia con la g del lugar.',
    actividad: 'Colgar una bolsa de la balanza de resorte en la Tierra, Marte y la Luna.',
    lee: {
      tarjetas: [
        { titulo: 'Dos kilos de papa', texto: 'Cuando pides 2 kg de papa en el mercado, pides masa: cuánta materia hay. La masa mide también la inercia, que es cuánto cuesta cambiar cómo se mueve algo: un costal de 50 kg cuesta más de arrancar que una bolsa de 2 kg. El peso es otra cosa: la fuerza con que la Tierra jala ese cuerpo hacia abajo.' },
        { titulo: 'Cada astro jala distinto', texto: ['La Luna y Marte jalan menos que la Tierra. Cada lugar tiene su g: en la Tierra, 10 m/s²; en Marte, unos 3,7; en la Luna, unos 1,6. Ese número dice cuántos newtons pesa cada kilogramo, porque 1 m/s² es lo mismo que 1 N/kg: 1 kg pesa 10 N aquí y 1,6 N en la Luna.'],
          ecuacion: [P, ' = m · ', g] },
        { titulo: 'Qué mirar al jugar', texto: ['La balanza de resorte, o dinamómetro, mide el peso: cuanto más jalan la bolsa hacia abajo, más se estira su resorte. La flecha ', vec(F), ' es lo que el resorte jala la bolsa hacia arriba; como la bolsa cuelga quieta, iguala al peso. Cambia la masa y el lugar.'],
          dibujo: est(figBalanzaR({ P: 30, tP: 'P⃗', tF: 'F⃗', texto: '3 kg', lectura: 'marca 30 N', alt: 'Una bolsa de 3 kg colgada de una balanza de resorte, que marca 30 N.' })) },
      ],
    },
    ejemplos: EJEMPLOS_MASA,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'Cuelgas una bolsa de la balanza de resorte en la Tierra, en Marte o en la Luna. La balanza marca su peso, en newtons.',
      mision: {
        texto: 'Consigue que la balanza marque justo 8 N.',
        // Una sola manera: 5 kg en la Luna.
        logrado: val => Math.abs(val.m * val.g - 8) < 1e-9,
        bien: '¡8 N! En la Luna, 5 kg pesan lo que 0,8 kg en la Tierra.',
      },
      voz: '¿Cuánto marca la misma bolsa en cada lugar?',
      leyenda: [
        { s: [vec(P)], t: 'peso: lo que el astro jala la bolsa' },
        { s: [vec(F)], t: 'lo que jala el resorte hacia arriba' },
        { s: [g], t: 'gravedad del lugar, en m/s²' },
        { s: 'm', t: 'masa de la bolsa' },
        { s: 'marca', t: 'lo que lee la balanza, en newtons' },
      ],
      controles: [
        { id: 'm', etiqueta: 'Masa, m', min: 1, max: 8, paso: 1, inicio: 4, unidad: 'kg', decimales: 0 },
        { id: 'g', etiqueta: 'Lugar', color: 'c-h', opciones: [{ valor: 10, texto: 'Tierra, g = 10' }, { valor: 3.7, texto: 'Marte, g = 3,7' }, { valor: 1.6, texto: 'Luna, g = 1,6' }], inicio: 10 },
      ],
      dibujo: juego2,
      // La lectura enuncia la relación entre la masa, el lugar y el peso.
      lectura: val => [`En ${LUGAR[val.g]}, ${val.m} kg pesan `, pp(N_(val.m * val.g))],
      resumen: { m: 3, g: 10 },
      minimo: 3,
    },
    predice: {
      pregunta: 'En la Luna, sobre un piso liso, empujas de lado una caja de 20 kg con 40 N. ¿Cuánto acelera?',
      datos: ['La caja tiene 20 kg y la empujas de lado con 40 N.', [gL, ' (en la Luna): unos 1,6 m/s²']],
      opciones: [
        { id: 'c', texto: '2 m/s²', correcta: true },
        { id: 'peso', texto: '12,5 m/s²', error: 'MP-PESO', siFuera: 'Tomaste 3,2 kg como su masa, como si en la Luna tuviera menos materia. Allá pesa menos, cierto, pero sigue teniendo 20 kg, y para acelerarla de lado lo que cuenta es la masa.' },
        { id: 'liviano', texto: '0,32 m/s²', error: 'MP-LIVIANO', siFuera: 'Pensaste que, como en la Luna todo pesa menos, también acelera menos. Pero el empujón de lado no depende de la g: la fuerza y la masa son las mismas, así que acelera igual que en la Tierra.' },
        { id: 'div', texto: '1,25 m/s²', error: 'MP-DIV', siFuera: 'Bien calcular su peso en la Luna, 32 N, pero dividiste el empujón entre ese peso. La segunda ley divide la fuerza entre la masa, en kilogramos; el peso es otra fuerza, en newtons.' },
      ],
      dibujo: est(PRED2),
      revelar: est(REVELA2),
      coincide: 'Coincide: de lado solo cuenta la masa, que es la misma. En la Luna acelera 2 m/s², como en la Tierra.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: MIRA2,
      pasos: [
        { estado: { corte: 0 }, texto: 'En la Tierra, con g = 10 m/s², la caja de 20 kg pesa su masa por la g del lugar:', ecuacion: [P, ' = 20 · 10 = ', pp('200 N')] },
        { estado: { corte: 1 }, texto: 'En la Luna, la misma caja pesa mucho menos, porque allá la g es de solo 1,6 m/s²:', ecuacion: [P, ' = 20 · 1,6 = ', pp('32 N')] },
        { estado: { corte: 1 }, texto: 'El peso y la normal son verticales y se cancelan en los dos lugares: en la Luna, el piso empuja hacia arriba con 32 N.', ecuacion: [N, ' = ', P] },
        { estado: { corte: 1 }, texto: 'De lado solo actúa tu empujón, que es el mismo, y la masa también es la misma; por eso la aceleración no cambia:', ecuacion: ['a = ', frac('40', '20'), ' = 2 m/s², en los dos'] },
        { estado: { corte: 0 }, texto: 'Lo que sí cambia es levantarla, porque para eso hay que vencer su peso: en la Luna basta poco más de 32 N, y en la Tierra hace falta más de 200 N.' },
      ],
    },
    regla: {
      texto: 'La masa mide cuánta materia tiene un cuerpo y cuánto cuesta acelerarlo, y no cambia de lugar: la caja tiene 20 kg en la Tierra y en la Luna. El peso es la fuerza con que el astro la jala, la masa por la g del lugar; por eso en la Luna pesa 32 N y no 200 N.',
      ecuacion: [P, ' = m · ', g, ';   ', ...SF, ' = m · a'],
      condicion: 'usas la g del lugar donde está el cuerpo, con la masa en kilogramos y el peso en newtons; con la g de la Tierra, en la Luna el peso saldría unas seis veces más grande.',
      dibujo: est(REVELA2),
    },
    // Así se resuelve: el peso en Marte desde el de la Tierra (dos pasos) o, en las semillas impares, levantar algo en
    // Marte (en «Ahora tú» se levanta en la Luna).
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900), ob = r.de(COSAS2_RS);
        if (sm % 2 === 1) {
          const c = elegir(() => { const m = r.de([10, 20, 30]), Tv = r.de([50, 60, 80, 100, 150]), a = (Tv - m * 3.7) / m; return a > 0 && exacto(a) && { m, Tv, a }; });
          return {
            enunciado: [`En Marte levantas con una cuerda ${ob} de ${c.m} kg: la cuerda jala hacia arriba con `, pj(N_(c.Tv)), '. ¿Cuánto acelera?'],
            datos: [D2.peso, D2.gs, D.segunda],
            dibujo: est({ alto: 220, techo: { y: 14, x0: 60, x1: 160 }, objetos: [{ tipo: 'cuerda', de: [110, 14], a: [110, 120] }, { tipo: ob.includes('balde') ? 'balde' : 'caja', x: 110, y: 164, w: 60, h: 44, texto: `${c.m} kg` }],
              flechas: [{ de: [124, 120], ang: 90, largo: LARGO_FIJO, color: 'o', texto: `T = ${N_(c.Tv)}`, rumbo: [1, 0] }, { de: [96, 164], ang: 270, largo: LARGO_FIJO, color: 'h', texto: 'P⃗', rumbo: [-1, 0] }],
              textos: [{ x: 312, y: 30, texto: 'En Marte; a = ?', ancla: 'end' }] }),
            pasos: [
              { tipo: 'pide', texto: 'Piden la aceleración hacia arriba.' },
              { tipo: 'datos', texto: [`Masa: ${c.m} kg. La cuerda: `, pj(N_(c.Tv)), '. En Marte, ', gM, ' = 3,7 m/s².'] },
              { tipo: 'regla', texto: 'Sobre el cuerpo tiran dos fuerzas verticales: la cuerda, hacia arriba, y el peso, hacia abajo, que se calcula con la g de Marte. La fuerza neta, dividida entre la masa, da la aceleración.', ecuacion: [P, ' = m · ', gM, ';   a = ', frac('ΣF', 'm')] },
              { tipo: 'cuentas', texto: `Su peso en Marte es P = ${c.m} · 3,7 = ${f(c.m * 3.7)} N. La cuerda jala más que eso, y lo que sobra hacia arriba es la fuerza neta; dividida entre la masa:`, ecuacion: [`a = (${c.Tv} − ${f(c.m * 3.7)}) ÷ ${c.m} = `, neg(A_(c.a))] },
              { tipo: 'sentido', texto: `El resultado depende del lugar: en la Tierra, donde la g es mayor, pesaría ${c.m * 10} N, y esa cuerda ${c.Tv > c.m * 10 ? 'subiría la carga con menos aceleración' : 'no alcanzaría para levantar la carga'}.` },
            ],
            respuesta: [neg(A_(c.a)), ', hacia arriba'],
          };
        }
        const c = elegir(() => { const PT = r.de([40, 60, 80, 120, 150]), PM = PT / 10 * 3.7; return exacto(PM) && { PT, m: PT / 10, PM }; });
        return {
          enunciado: [`${mayus(ob)} pesa `, pp(N_(c.PT)), ' en la Tierra. ¿Cuánto pesaría en Marte?'],
          datos: [D2.peso, D2.gs],
          dibujo: est(figBalanzaR({ P: c.PT, tP: `P = ${N_(c.PT)}`, texto: ob.includes('balde') ? 'balde' : 'maleta', lectura: `marca ${N_(c.PT)}`, textos: [{ x: 8, y: 22, texto: 'En la Tierra', ancla: 'start' }, { x: 312, y: 228, texto: 'En Marte: ?', ancla: 'end' }] })),
          pasos: [
            { tipo: 'pide', texto: 'Piden su peso en Marte.' },
            { tipo: 'datos', texto: ['En la Tierra pesa ', pp(N_(c.PT)), ', con ', g, ' = 10 m/s². En Marte, ', gM, ' = 3,7 m/s².'] },
            { tipo: 'regla', texto: 'El peso cambia de un lugar a otro, pero la masa no. Por eso primero se saca la masa con la g de la Tierra, y después se multiplica por la g de Marte.', ecuacion: [P, ' = m · ', g] },
            { tipo: 'cuentas', texto: `Con la g de la Tierra, la masa es m = ${c.PT} ÷ 10 = ${c.m} kg. Esos mismos ${c.m} kg, con la g de Marte, pesan:`, ecuacion: [P, ` = ${c.m} · 3,7 = `, pp(N_(c.PM))] },
            { tipo: 'sentido', texto: 'En Marte pesa menos de la mitad que en la Tierra, porque su g, 3,7 m/s², es menos de la mitad de 10 m/s²; su masa sigue siendo la misma.' },
          ],
          respuesta: ['Pesaría ', pp(N_(c.PM))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4, lu = LUGARES[Math.floor(sm / 4) % 2];
        if (k === 0) {
          const ob = r.de(COSAS2_AT), c = elegir(() => { const PT = r.de([30, 50, 70, 90, 110]), m = PT / 10, P2 = m * lu.g; return exacto(P2) && distintos(P2, PT, PT * lu.g, PT / lu.g, m) && { PT, m, P2 }; });
          return {
            pregunta: [`${mayus(ob)} pesa `, pp(N_(c.PT)), ` en la Tierra. ¿Cuánto pesa en ${lu.n}?`],
            datos: [D2.peso, D2.gs],
            dibujo: est(figBalanzaR({ P: c.PT, tP: `P = ${N_(c.PT)}`, texto: ob.split(' ')[1], lectura: `marca ${N_(c.PT)}`, textos: [{ x: 8, y: 22, texto: 'En la Tierra', ancla: 'start' }, { x: 312, y: 228, texto: `En ${lu.n}: ?`, ancla: 'end' }] })),
            opciones: opciones(c.P2, [
              { id: 'igual', valor: c.PT, error: 'MP-IGUAL', siFuera: 'Bien que la masa no cambie, pero el peso sí cambia: es la masa por la g del lugar. Dejaste el peso de la Tierra, como si allá lo jalaran con la misma fuerza.' },
              { id: 'div', valor: c.PT / lu.g, error: 'MP-DIV', siFuera: 'Bien usar la g del lugar, pero dividiste entre ella el peso de la Tierra. Primero se saca la masa, el peso entre 10, y esa masa se multiplica por la nueva g.' },
              { id: 'por', valor: c.PT * lu.g, error: 'MP-POR', siFuera: 'Bien multiplicar por la nueva g, pero multiplicaste el peso de la Tierra, que ya lleva dentro la g de aquí. Lo que se multiplica es la masa, el peso entre 10.' },
              { id: 'masa', valor: c.m, error: 'MP-MASA', siFuera: 'Bien: esa es su masa, en kilogramos. Pero te piden un peso, en newtons, y falta multiplicar esa masa por la g del lugar.' },
            ], N_),
            solucion: { texto: `Primero se saca la masa con la g de la Tierra, porque la masa no cambia de lugar; después, esa masa por la g de ${lu.n} da el peso allá:`, ecuacion: [`m = ${c.PT} ÷ 10 = ${f(c.m)} kg;   `, P, ` = ${f(c.m)} · ${f(lu.g)} = `, pp(N_(c.P2))] },
          };
        }
        if (k === 1) {
          const c = elegir(() => { const m = r.de([5, 12, 15, 30, 40]), Pv = m * lu.g; return exacto(Pv) && !(lu.g === 1.6 && m === 5) && distintos(m, Pv / 10, Pv * lu.g, Pv) && { m, Pv }; });
          return {
            pregunta: [`En ${lu.n}, una balanza de resorte marca `, pp(N_(c.Pv)), ' con una roca colgada y quieta. ¿Cuál es la masa de la roca?'],
            datos: [D2.peso, D2.gs, D2.dina],
            dibujo: est(figBalanzaR({ P: c.Pv, tP: `P = ${N_(c.Pv)}`, texto: '? kg', lectura: `marca ${N_(c.Pv)}`, textos: [{ x: 8, y: 22, texto: `En ${lu.n}`, ancla: 'start' }] })),
            opciones: opciones(c.m, [
              { id: 'tierra', valor: c.Pv / 10, error: 'MP-G-TIERRA', siFuera: 'Bien dividir el peso entre g, pero usaste la g de la Tierra. La balanza está en otro lugar y marca el peso de allá, así que se divide entre la g de ese lugar.' },
              { id: 'por', valor: c.Pv * lu.g, error: 'MP-POR', siFuera: 'Bien usar la g del lugar, pero la multiplicaste. Como el peso es la masa por g, la masa es el peso dividido entre g.' },
              { id: 'peso', valor: c.Pv, error: 'MP-PESO-MASA', siFuera: 'Tomaste lo que marca la balanza como si fuera la masa. La balanza marca un peso, en newtons; la masa, en kilogramos, sale de dividir ese peso entre la g del lugar.' },
            ], v => `${f(v)} kg`),
            solucion: { texto: 'La balanza marca el peso de allá, así que la masa es ese peso dividido entre la g del mismo lugar:', ecuacion: [`m = ${f(c.Pv)} ÷ ${f(lu.g)} = `, neg(`${c.m} kg`)] },
          };
        }
        if (k === 2) {
          const c = elegir(() => { const m = r.de([10, 25, 40, 50]), Fv = r.de([30, 50, 60, 100]), a = Fv / m, Pv = m * lu.g;
            return exacto(a) && distintos(a, Fv / (m * lu.g / 10), a * lu.g / 10, Fv / Pv) && !(m === 20 && Fv === 40) && { m, Fv, a, Pv }; });
          return {
            pregunta: [`En ${lu.n}, sobre hielo liso, una astronauta empuja de lado una caja de ${c.m} kg con `, pj(N_(c.Fv)), '. ¿Cuánto acelera la caja?'],
            datos: [D2.peso, D2.gs, D.segunda],
            dibujo: est(figLugar({ texto: `${c.m} kg`, lugar: `En ${lu.n}, hielo liso`, fz: { P: c.Pv, N: c.Pv, F: c.Fv, tP: 'P⃗', tN: 'N⃗', tF: `F = ${N_(c.Fv)}`, adir: 1, ta: 'a = ?' } })),
            opciones: opciones(c.a, [
              { id: 'peso', valor: c.Fv / (c.m * lu.g / 10), error: 'MP-PESO', siFuera: 'Sacaste una masa más chica con el peso de allá, como si la caja tuviera menos materia. Pesa menos, cierto, pero su masa no cambia, y para acelerarla de lado lo que cuenta es la masa.' },
              { id: 'liviano', valor: c.a * lu.g / 10, error: 'MP-LIVIANO', siFuera: 'Allá la g es menor, cierto, pero la g solo cambia el peso, que es vertical. La aceleración de lado es el empujón entre la masa, igual que en la Tierra.' },
              { id: 'div', valor: c.Fv / c.Pv, error: 'MP-DIV', siFuera: 'Bien calcular su peso allá, pero dividiste el empujón entre ese peso. La segunda ley divide la fuerza entre la masa, en kilogramos, no entre otra fuerza.' },
            ], A_),
            solucion: { texto: 'De lado solo actúa el empujón, porque el peso y la normal se anulan. La aceleración es ese empujón entre la masa, igual que en la Tierra:', ecuacion: [`a = ${c.Fv} ÷ ${c.m} = `, neg(A_(c.a))] },
          };
        }
        // Nivel examen: levantar con una cuerda en la Luna (San Marcos 2024-II) o las proposiciones del astronauta (2021).
        if (sm % 8 >= 4) {
          const c = elegir(() => { const m = r.de([10, 15, 25, 30]), Tv = r.de([20, 30, 40, 60, 80]), Pv = m * 1.6, a = (Tv - Pv) / m;
            return a > 0 && exacto(a) && Tv < m * G && distintos(a, Tv / m, (Tv + Pv) / m, Tv / (m * G)) && !(m === 20 && Tv === 50) && { m, Tv, Pv, a }; });
          return {
            pregunta: [`En la Luna levantas con una cuerda una caja de ${c.m} kg: la cuerda la jala hacia arriba con `, pj(N_(c.Tv)), '. ¿Cuánto acelera la caja?'],
            datos: [D2.peso, D2.gs, D.segunda],
            dibujo: est({ alto: 220, techo: { y: 14, x0: 60, x1: 160 }, objetos: [{ tipo: 'cuerda', de: [110, 14], a: [110, 120] }, { tipo: 'caja', x: 110, y: 164, w: 60, h: 44, texto: `${c.m} kg` }],
              flechas: [{ de: [124, 120], ang: 90, largo: LARGO_FIJO, color: 'o', texto: `T = ${N_(c.Tv)}`, rumbo: [1, 0] }, { de: [96, 164], ang: 270, largo: LARGO_FIJO, color: 'h', texto: 'P⃗', rumbo: [-1, 0] }],
              textos: [{ x: 312, y: 30, texto: 'En la Luna; a = ?', ancla: 'end' }] }),
            opciones: opciones(c.a, [
              { id: 'sinpeso', valor: c.Tv / c.m, error: 'MP-SIN-PESO', siFuera: 'Bien dividir entre la masa, pero contaste solo la cuerda. El peso también actúa, hacia abajo, y hay que restárselo a la cuerda antes de dividir.' },
              { id: 'tierra', texto: 'No sube', error: 'MP-G-TIERRA', siFuera: 'Usaste el peso de la Tierra, donde la cuerda no alcanzaría, cierto. Pero la carga está en la Luna, donde pesa mucho menos, y ese jalón sí alcanza para subirla.' },
              { id: 'suma', valor: (c.Tv + c.Pv) / c.m, error: 'MP-SUMA-PESO', siFuera: 'Bien contar el peso, pero lo sumaste a la cuerda. El peso apunta hacia abajo y la cuerda hacia arriba, así que se restan, y lo que sobra hacia arriba es la fuerza neta.' },
              { id: 'pesoT', valor: c.Tv / (c.m * G), error: 'MP-DIV', siFuera: 'Bien usar la cuerda, pero dividiste su jalón entre el peso en la Tierra. La segunda ley divide la fuerza neta entre la masa, en kilogramos, y aquí además falta restar el peso.' },
            ], A_),
            solucion: { texto: 'El peso en la Luna apunta hacia abajo y se resta del jalón de la cuerda; lo que sobra hacia arriba, dividido entre la masa, da la aceleración:', ecuacion: [P, ` = ${c.m} · 1,6 = ${f(c.Pv)} N;   a = (${c.Tv} − ${f(c.Pv)}) ÷ ${c.m} = `, neg(A_(c.a))] },
          };
        }
        const m = r.de([60, 75, 90]), PL = m * 1.6, vI = r() < 0.5, vII = r() < 0.5;
        const I = vI ? `Allí su masa es ${m} kg.` : 'Allí su masa es menor.';
        const II = vII ? `Allí pesa ${f(PL)} N.` : `Allí pesa ${m * G} N.`;
        const III = 'Allí, la misma fuerza de lado, sin rozamiento, lo acelera igual.';
        const L = b => (b ? 'V' : 'F'), bien = `${L(vI)}${L(vII)}V`;
        return {
          pregunta: [`Un astronauta de ${m} kg va a la Luna. I. ${I} II. ${II} III. ${III} ¿Cuáles son V y cuáles F?`],
          datos: [D2.peso, D2.gs],
          opciones: opciones(0, [
            { id: 'masa', texto: `${L(!vI)}${L(vII)}V`, error: 'MP-MASA-CAMBIA', siFuera: 'Bien juzgaste II y III, pero revisa I. La masa es la cantidad de materia y no depende del lugar: en la Luna el astronauta tiene los mismos kilogramos que en la Tierra.' },
            { id: 'pesoI', texto: `${L(vI)}${L(!vII)}V`, error: 'MP-G-TIERRA', siFuera: 'Bien juzgaste I y III, pero revisa II. El peso en la Luna se calcula con la g de allá, 1,6 m/s²: multiplica la masa por 1,6 y compáralo con lo que dice II.' },
            { id: 'acel', texto: `${L(vI)}${L(vII)}F`, error: 'MP-PESO', siFuera: 'Bien juzgaste I y II, pero revisa III. De lado, la aceleración es la fuerza entre la masa, y la masa no cambia en la Luna: la misma fuerza lo acelera igual.' },
          ], () => '', bien),
          solucion: { texto: `I es ${vI ? 'verdadera' : 'falsa'}, porque la masa no depende del lugar; II es ${vII ? 'verdadera' : 'falsa'}, porque allá pesa ${m} · 1,6 = ${f(PL)} N, y III es verdadera, porque de lado solo cuenta la masa.`, ecuacion: [bien] },
        };
      },
    },
  };

  // ======================= 3: rozamiento en movimiento (el costal que se arrastra por el almacén) =======================
  // Cambia: con cuánta fuerza jalas y qué tan áspero es el piso · Permanece: el costal de 20 kg, que ya desliza ·
  // Progresa: si acelera, va parejo o frena · Se reserva: que la masa no cambia la frenada (Predice compara dos cajas) ·
  // Debe verse: f_k = μ_k · N; lo que sobra, entre la masa, da la aceleración.
  const M3 = 20, V03 = 2, PXM3 = 3;
  const mov3 = val => {
    const fkv = val.mu * M3 * G, a = (val.F - fkv) / M3, t = val.t || 0;
    // si frena hasta parar, queda quieto (el rozamiento estático lo sostiene: jalas menos de lo que frenaba)
    const tp = a < 0 ? V03 / -a : Infinity, te = Math.min(t, tp), v = V03 + a * te, x = V03 * te + a * te * te / 2;
    return { fkv, a, v, x, quieto: t >= tp };
  };
  const juego3 = val => {
    const m = mov3(val), s = Math.min(63, m.x * PXM3);
    return est(figPiso({ cosa: { tipo: 'costal', x: 92 + s, w: 70, h: 52, texto: '20 kg' }, cuerda: true, largoCuerda: 40, v: m.quieto ? 0 : 1, largoV: Math.min(48, 12 + m.v * 3),
      fz: m.quieto ? { P: 200, N: 200, F: val.F, tP: 'P⃗', tN: 'N⃗', tF: 'F⃗', f: val.F, tf: `f⃗_s`, adir: 0 }
        : { P: 200, N: 200, F: val.F, tP: 'P⃗', tN: 'N⃗', tF: 'F⃗', f: m.fkv, tf: 'f⃗_k', adir: Math.abs(m.a) < 1e-9 ? 0 : Math.sign(m.a) },
      textos: [{ x: 8, y: 22, texto: m.quieto ? 'se detuvo' : Math.abs(m.a) < 1e-9 ? 'desliza parejo' : m.a > 0 ? 'acelera' : 'frena', ancla: 'start', peso: 400 }, { x: 8, y: 66, texto: `μ_k = ${f(val.mu)}`, ancla: 'start' }],
      alt: `El costal de 20 kg jalado con ${val.F} N por un piso con μk = ${f(val.mu)}: ${m.quieto ? 'frenó hasta quedar quieto' : m.a > 1e-9 ? 'acelera' : m.a < -1e-9 ? 'frena' : 'desliza a velocidad constante'}.` }));
  };
  // Dos cajas en dos carriles iguales: arriba la de 10 kg, abajo la de 20 kg; salen juntas con la misma rapidez.
  function figDosCajas(o) {
    const x0 = 46, k = 44, cota = (y, d, t) => ({ de: [x0, y], a: [x0 + d * k, y], texto: t, lado: -1, sep: 0 });
    return { alto: 236, objetos: [{ tipo: 'viga', x0: 8, x1: 312, y: 108 }, { tipo: 'viga', x0: 8, x1: 312, y: 224 },
      { tipo: 'caja', x: x0 + (o.d1 || 0) * k, y: 100, w: 46, h: 36, texto: '10 kg' }, { tipo: 'caja', x: x0 + (o.d2 || 0) * k, y: 216, w: 56, h: 44, texto: '20 kg' }],
      flechas: o.v ? [{ de: [x0 - 10, 52], ang: 0, largo: 30, color: 'tinta', texto: 'v⃗', rumbo: [1, -0.4] }, { de: [x0 - 10, 160], ang: 0, largo: 30, color: 'tinta', texto: 'v⃗', rumbo: [1, -0.4] }] : [],
      cotas: [...(o.c1 ? [cota(58, 4, o.c1)] : []), ...(o.c2 ? [cota(166, 4, o.c2)] : [])], textos: o.textos || [], alt: o.alt };
  }
  const PRED3 = figDosCajas({ v: true, textos: [{ x: 312, y: 36, texto: 'se detiene a 4 m', ancla: 'end', peso: 400 }, { x: 312, y: 146, texto: '¿a qué distancia?', ancla: 'end', peso: 400 }],
    alt: 'Dos cajas, de 10 kg y de 20 kg, salen a la misma rapidez por pisos iguales. La de 10 kg se detiene a 4 m; la otra, con un signo de pregunta.' });
  const REVELA3 = figDosCajas({ d1: 4, d2: 4, c1: '4 m', c2: '4 m', alt: 'Las dos cajas se detienen a 4 m: la de 20 kg tiene el doble de rozamiento y el doble de masa.' });
  const MIRA3 = Object.assign(figDosCajas({ v: true }), { alt: 'Las dos cajas frenan con la misma aceleración y se detienen en el mismo lugar.',
    cortes: [{ objetos: figDosCajas({ v: true }).objetos }, { objetos: figDosCajas({ d1: 4, d2: 4 }).objetos, flechas: [], cotas: figDosCajas({ c1: '4 m', c2: '4 m' }).cotas }] });
  // La caja en una rampa de ángulo θ, con sus fuerzas (P⃗ del centro, N⃗ contra la rampa, f⃗ a lo largo) y a⃗ punteada.
  function figRampa(o) {
    const th = o.ang || 37, x0 = 20, y0 = 214, L = 270, s0 = o.s || 150, cs = Math.cos(rad(th)), sn = Math.sin(rad(th));
    const base = [x0 + s0 * cs, y0 - s0 * sn], h = 34, w = 50, c = [base[0] - sn * h / 2, base[1] - cs * h / 2], fl = [];
    if (o.P !== undefined) fl.push({ de: c, ang: 270, largo: LARGO_FIJO, color: 'h', texto: o.tP || 'P⃗', rumbo: [1, 0.4] });
    if (o.N !== undefined) fl.push({ de: [base[0] - sn * h, base[1] - cs * h], ang: 90 + th, largo: LARGO_FIJO, color: 'f', texto: o.tN || 'N⃗', rumbo: [-1, -0.3] });
    // el rozamiento, a lo largo de la rampa, contra el deslizamiento: hacia arriba si baja; hacia abajo (fAbajo) si sube
    if (o.f !== undefined) fl.push(o.fAbajo
      ? { de: [base[0] - cs * w / 2 - sn * 6, base[1] + sn * w / 2 - cs * 6], ang: th + 180, largo: LARGO_FIJO, color: 'i', texto: o.tf || 'f⃗_k', rumbo: [-0.3, 1] }
      : { de: [base[0] + cs * w / 2 - sn * 6, base[1] - sn * w / 2 - cs * 6], ang: th, largo: LARGO_FIJO, color: 'i', texto: o.tf || 'f⃗_k', rumbo: [0.3, -1] });
    if (o.adir) fl.push({ de: [base[0] - sn * (h + 30) - cs * 15 * o.adir, base[1] - cs * (h + 30) + sn * 15 * o.adir], ang: o.adir > 0 ? th : th + 180, largo: LARGO_FIJO, color: 'tinta', discontinua: true, texto: o.ta || 'a⃗', rumbo: [-0.5, -1] });
    if (o.v) fl.push({ de: [base[0] + sn * 22 - cs * 15 * o.v, base[1] + cs * 22 + sn * 15 * o.v], ang: o.v > 0 ? th : th + 180, largo: 30, color: 'tinta', texto: o.tv || 'v⃗', rumbo: [1, 0.6] });
    return { alto: 236, objetos: [{ tipo: 'rampa', x0, y0, largo: L, ang: th }, { tipo: o.cosa || 'caja', x: base[0], y: base[1], w, h, giro: th, texto: o.texto || '' }],
      flechas: fl, angulos: [{ c: [x0, y0], de: 0, a: th, r: 44, texto: `${th}°` }], textos: o.textos || [], alt: o.alt };
  }
  const D3 = {
    normal: 'La normal: lo perpendicular al piso suma cero',
    largo: 'A lo largo del piso: ΣF = m · a',
    rampaLargo: 'A lo largo de la rampa: ΣF = m · a; contra ella, suma cero',
  };

  // Ejemplos de la idea 3. Cuentas rehechas aparte (cuentas.js: suma las fuerzas de cada eje, con el rozamiento contra el
  // deslizamiento, y integra el frenado paso a paso): 0,2·300; (100 − 60)/20; 0,25·400; 0,3·10; 100/500; (100 − 50)/25;
  // 6²/(2·3); el jalón a 37° de 50 N; 10·3/5; 10·(3/5 − 0,5·4/5); el ladrillo que sube con cada alternativa; el jalón a
  // 37° de 100 N con cada alternativa; la rueda de atrás; 8²/(2·16)/10 con cada alternativa; tan 37°.
  const EJEMPLOS_ROCE = [
    { nivel: 1, titulo: 'El rozamiento mientras desliza',
      figura: est(figPiso({ cosa: { tipo: 'caja', x: 100, w: 70, h: 44, texto: '30 kg' }, v: 1, fz: { P: 300, N: 300, tP: 'P = 300 N', tN: 'N⃗', f: 1, tf: 'f_k = ?', fdir: -1 }, alt: 'Una caja de 30 kg que desliza hacia la derecha; el rozamiento, con un signo de pregunta.' })),
      enunciado: ['Una caja de 30 kg desliza por el piso de la tienda, donde ', muk, ' = 0,2. ¿Con qué fuerza la frena el piso?'],
      datos: [D.peso, D.cin, D3.normal],
      solucion: [{ texto: 'En un piso plano, sin nada que levante la caja, la normal iguala al peso, 300 N. El rozamiento es el coeficiente por esa normal:', ecuacion: [fk, ' = 0,2 · 300 = ', pr('60 N')] }],
      respuesta: [fk, ' = ', pr('60 N')] },
    { nivel: 1, titulo: 'Lo que sobra acelera',
      figura: est(figPiso({ cosa: { tipo: 'costal', x: 92, w: 70, h: 52, texto: '20 kg' }, cuerda: true, largoCuerda: 40, fz: { P: 200, N: 200, F: 100, tP: 'P⃗', tN: 'N⃗', tF: 'F = 100 N', f: 60, tf: 'f_k = 60 N', adir: 1, ta: 'a = ?' }, alt: 'Un costal de 20 kg jalado con 100 N; el piso lo frena con 60 N.' })),
      enunciado: ['Jalas un costal de 20 kg con ', pj('100 N'), ' y el piso lo frena con ', pr('60 N'), ' mientras desliza. ¿Cuánto acelera?'],
      datos: [D.segunda],
      solucion: [{ texto: 'Tu jalón gana al rozamiento por 40 N; lo que sobra es la fuerza neta, y dividida entre la masa da la aceleración:', ecuacion: ['a = ', frac('100 − 60', '20'), ' = ', neg('2 m/s²')] }],
      respuesta: [neg('a = 2 m/s²')] },
    { nivel: 1, titulo: 'Arrastrar a velocidad constante',
      figura: est(figPiso({ cosa: { tipo: 'caja', x: 100, w: 76, h: 50, texto: '40 kg' }, cuerda: true, largoCuerda: 40, v: 1, fz: { P: 400, N: 400, tP: 'P = 400 N', tN: 'N⃗', tF: 'F = ?', f: 1, tf: 'f⃗_k' },
        textos: [{ x: 8, y: 22, texto: 'siempre a la misma rapidez', ancla: 'start', peso: 400 }], alt: 'Un baúl de 40 kg arrastrado con una cuerda a velocidad constante.' })),
      enunciado: ['Arrastras un baúl de 40 kg con una cuerda horizontal, siempre a la misma rapidez. Entre el baúl y el piso, ', muk, ' = 0,25. ¿Con qué fuerza jalas?'],
      datos: [D.peso, D.cin, D.primera, D3.normal],
      solucion: [{ texto: 'A velocidad constante no hay aceleración, así que la fuerza neta es cero: jalas lo mismo que frena el piso, el coeficiente por la normal, que es el peso.', ecuacion: [F, ' = ', fk, ' = 0,25 · 400 = ', pj('100 N')] }],
      respuesta: [F, ' = ', pj('100 N')] },
    { nivel: 1, titulo: 'Suelta y frena',
      figura: est(figPiso({ cosa: { tipo: 'caja', x: 100, w: 70, h: 44, texto: '15 kg' }, v: 1, fz: { P: 150, N: 150, tP: 'P⃗', tN: 'N⃗', f: 45, tf: 'f⃗_k', fdir: -1, adir: -1, ta: 'a = ?' }, alt: 'Una caja de 15 kg que desliza sola y frena por el rozamiento.' })),
      enunciado: ['Le das un empujón a una caja de 15 kg y la sueltas. Desliza sobre un piso con ', muk, ' = 0,3. ¿Con qué aceleración frena?'],
      datos: [D.peso, D.cin, D.segunda],
      solucion: [{ texto: 'Ya nadie la empuja, así que el rozamiento es la única fuerza de lado y es la fuerza neta; dividido entre la masa, da una aceleración contra el avance:', ecuacion: ['a = ', frac('0,3 · 150', '15'), ' = ', neg('3 m/s²'), ', contra el avance'] }],
      respuesta: [neg('3 m/s²'), ', contra el avance'] },
    { nivel: 1, titulo: 'El coeficiente del piso',
      figura: est(figPiso({ cosa: { tipo: 'caja', x: 100, w: 76, h: 50, texto: '50 kg' }, v: 1, fz: { P: 500, N: 500, tP: 'P = 500 N', tN: 'N⃗', f: 100, tf: 'f_k = 100 N', fdir: -1 }, alt: 'Una caja de 50 kg que desliza; el piso la frena con 100 N.' })),
      enunciado: ['Una caja de 50 kg desliza y el piso la frena con ', pr('100 N'), '. ¿Cuánto vale ', muk, '?'],
      datos: [D.peso, D.cin, D3.normal],
      solucion: [{ texto: 'El coeficiente es el rozamiento dividido entre la normal, y en un piso plano la normal es el peso, 500 N:', ecuacion: [muk, ' = ', frac(pr('100'), pn('500')), ' = ', neg('0,2')] }],
      respuesta: [muk, ' = ', neg('0,2')] },
    { nivel: 2, titulo: 'Jalar el costal y acelerar',
      figura: est(figPiso({ cosa: { tipo: 'costal', x: 92, w: 70, h: 52, texto: '25 kg' }, cuerda: true, largoCuerda: 40, fz: { P: 250, N: 250, F: 100, tP: 'P⃗', tN: 'N⃗', tF: 'F = 100 N', f: 50, tf: 'f⃗_k', adir: 1, ta: 'a = ?' }, alt: 'Un costal de 25 kg jalado con 100 N por un piso con rozamiento.' })),
      enunciado: ['Jalas con una cuerda horizontal, con ', pj('100 N'), ', un costal de 25 kg que ya desliza. Entre el costal y el piso, ', muk, ' = 0,2. ¿Cuánto acelera?'],
      datos: [D.peso, D.cin, D.segunda],
      solucion: [
        { texto: 'La cuerda es horizontal, así que la normal iguala al peso, 250 N, y el rozamiento es el coeficiente por esa normal:', ecuacion: [fk, ' = 0,2 · 250 = ', pr('50 N')] },
        { texto: 'El jalón gana al rozamiento por 50 N; lo que sobra, dividido entre la masa, da la aceleración:', ecuacion: ['a = ', frac('100 − 50', '25'), ' = ', neg('2 m/s²')] },
      ],
      respuesta: [neg('a = 2 m/s²')] },
    { nivel: 2, titulo: 'Hasta dónde llega',
      figura: est(figPiso({ cosa: { tipo: 'caja', x: 100, w: 70, h: 44, texto: '' }, v: 1, tv: 'v = 6 m/s', fz: { P: 1, N: 1, tP: 'P⃗', tN: 'N⃗', f: 1, tf: 'f⃗_k', fdir: -1, adir: -1 },
        textos: [{ x: 8, y: 22, texto: 'se detiene a: ?', ancla: 'start', peso: 400 }], alt: 'Una caja suelta que desliza a 6 m/s y frena por el rozamiento.' })),
      enunciado: ['Una caja desliza sola a 6 m/s por un piso con ', muk, ' = 0,3. ¿Qué distancia recorre hasta detenerse?'],
      datos: [D.peso, D.cin, D.segunda, D.mruv],
      solucion: [
        { texto: 'Nadie la empuja, así que el rozamiento es la fuerza neta. Al dividirlo entre la masa, la masa se cancela:', ecuacion: ['a = ', frac('0,3 · m · 10', 'm'), ' = 3 m/s², contra el avance'] },
        { texto: 'No dan el tiempo, y al final la caja está quieta, v = 0; la distancia sale de v² = v₀² + 2 · a · d:', ecuacion: ['d = ', frac('6²', '2 · 3'), ' = ', neg('6 m')] },
      ],
      respuesta: [neg('d = 6 m')] },
    { nivel: 2, titulo: 'Jalar inclinado',
      figura: est(figPiso({ cosa: { tipo: 'caja', x: 92, w: 70, h: 44, texto: '10 kg' }, cuerda: true, ang: 37, largoCuerda: 50, fz: { P: 100, N: 70, F: 50, Fang: 37, tP: 'P = 100 N', tN: 'N = ?', tF: 'F = 50 N' },
        alt: 'Una caja de 10 kg jalada con 50 N por una cuerda inclinada 37° sobre la horizontal.' })),
      enunciado: ['Jalas una caja de 10 kg con ', pj('50 N'), ' por una cuerda inclinada 37° sobre la horizontal, en un piso liso. ¿Con qué fuerza la empuja el piso hacia arriba?'],
      datos: [D.peso, D.comp, D.trig, D3.normal],
      solucion: [
        { texto: 'La cuerda está inclinada, así que además de jalar de lado levanta un poco la caja con su parte vertical:', ecuacion: ['50 · sen 37° = 50 · ', frac('3', '5'), ' = 30 N, hacia arriba'] },
        { texto: 'La caja no sube ni baja, así que lo vertical suma cero: el piso solo empuja lo que falta para sostener el peso.', ecuacion: [N, ' = 100 − 30 = ', pn('70 N')] },
      ],
      respuesta: [N, ' = ', pn('70 N')] },
    { nivel: 2, titulo: 'Bajar por una rampa lisa',
      figura: est(figRampa({ ang: 37, P: 1, N: 1, adir: -1, ta: 'a = ?', textos: [{ x: 312, y: 30, texto: 'rampa lisa', ancla: 'end', peso: 400 }], alt: 'Una caja que baja por una rampa lisa de 37°.' })),
      enunciado: ['Una caja baja sola por una rampa lisa, inclinada 37°. ¿Cuánto acelera?'],
      datos: [D.peso, D.rampa, D.trig, D3.rampaLargo],
      solucion: [
        { texto: 'La normal es perpendicular a la rampa y no la mueve; a lo largo de la rampa solo jala la parte del peso P · sen 37°:', ecuacion: [P, ' · sen 37° = m · 10 · ', frac('3', '5'), ' = m · 6'] },
        { texto: 'Al dividir esa fuerza entre la masa, la masa se cancela:', ecuacion: ['a = ', neg('6 m/s²'), ', hacia abajo de la rampa'] },
      ],
      respuesta: [neg('a = 6 m/s²')] },
    { nivel: 2, titulo: 'Bajar por una rampa áspera',
      figura: est(figRampa({ ang: 37, P: 1, N: 1, f: 1, adir: -1, ta: 'a = ?', alt: 'Una caja que baja por una rampa de 37° con rozamiento.' })),
      enunciado: ['Una caja baja deslizando por una rampa de 37°, con ', muk, ' = 0,5. ¿Cuánto acelera?'],
      datos: [D.peso, D.rampa, D.cin, D.trig, D3.rampaLargo],
      solucion: [
        { texto: 'Contra la rampa, la normal iguala la parte del peso que la aprieta: N = P · cos 37°. El rozamiento, el coeficiente por esa normal, apunta hacia arriba de la rampa:', ecuacion: [fk, ' = 0,5 · ', P, ' · ', frac('4', '5'), ' = 0,4 · ', P] },
        { texto: 'A lo largo, hacia abajo, la parte del peso le gana al rozamiento: 0,6 · P − 0,4 · P = 0,2 · P = 0,2 · m · 10. Al dividir entre la masa:', ecuacion: ['a = ', neg('2 m/s²')] },
      ],
      respuesta: [neg('a = 2 m/s²'), ', hacia abajo de la rampa'] },
    { nivel: 3, titulo: 'El ladrillo que sube la rampa',
      figura: est(figRampa({ ang: 37, s: 90, P: 1, N: 1, f: 1, fAbajo: true, v: 1, tv: 'v = 10 m/s', textos: [{ x: 312, y: 30, texto: 'sube hasta: ?', ancla: 'end', peso: 400 }], alt: 'Un ladrillo lanzado hacia arriba por una rampa de 37°, a 10 m/s.' })),
      enunciado: ['Lanzas un ladrillo hacia arriba por una rampa de 37°, a 10 m/s. Entre el ladrillo y la rampa, ', muk, ' = 0,5. ¿Qué distancia sube hasta detenerse?'],
      alternativas: ['25 m', '8,33 m', '10 m', '5 m', '4,55 m'],
      datos: [D.peso, D.rampa, D.cin, D.trig, D.mruv],
      solucion: [
        { texto: 'Al subir, la parte del peso y el rozamiento apuntan hacia abajo de la rampa y frenan juntos; la masa se cancela:', ecuacion: ['a = 10 · ', frac('3', '5'), ' + 0,5 · 10 · ', frac('4', '5'), ' = 10 m/s²'] },
        { texto: 'Frena hasta quedar quieto, v = 0, así que la distancia sale de v² = v₀² + 2 · a · d:', ecuacion: ['d = ', frac('10²', '2 · 10'), ' = ', neg('5 m')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si restas el rozamiento en vez de sumarlo; ', neg('B'), ', si lo olvidas; ', neg('C'), ', si olvidas el 2, y ', neg('E'), ', si usas N = P.'] },
      ],
      respuesta: [neg('D'), ', ', neg('5 m')] },
    { nivel: 3, titulo: 'Jalar a 37° con rozamiento',
      figura: est(figPiso({ cosa: { tipo: 'caja', x: 92, w: 70, h: 44, texto: '10 kg' }, cuerda: true, ang: 37, largoCuerda: 50, fz: { P: 100, N: 40, F: 100, Fang: 37, tP: 'P⃗', tN: 'N⃗', tF: 'F = 100 N', f: 1, tf: 'f⃗_k', adir: 1, ta: 'a = ?' },
        alt: 'Un bloque de 10 kg jalado con 100 N por una cuerda a 37°, sobre un piso con rozamiento.' })),
      enunciado: ['Un bloque de 10 kg desliza por el piso jalado con ', pj('100 N'), ' por una cuerda a 37° sobre la horizontal. Si ', muk, ' = 0,5, ¿cuánto acelera?'],
      alternativas: ['6 m/s²', '3 m/s²', '8 m/s²', '5 m/s²', '0 m/s²'],
      datos: [D.peso, D.comp, D.trig, D.cin, D.segunda],
      solucion: [
        { texto: 'Hacia arriba, la cuerda da 100 · 3/5 = 60 N y sostiene parte del peso, así que el piso empuja menos: N = 100 − 60 = 40 N. El rozamiento:', ecuacion: [fk, ' = 0,5 · 40 = 20 N'] },
        { texto: 'De lado, la cuerda da 100 · 4/5 = 80 N; se le resta el rozamiento y lo que sobra, entre la masa:', ecuacion: ['a = ', frac('80 − 20', '10'), ' = ', neg('6 m/s²')] },
        { texto: ['Las otras salen de un error: ', neg('B'), ', si tomas N = P; ', neg('C'), ', si olvidas el rozamiento; ', neg('D'), ', si no descompones la fuerza, y ', neg('E'), ', si sumas los 60 N a la normal.'] },
      ],
      respuesta: [neg('A'), ', ', neg('6 m/s²')] },
    { nivel: 3, titulo: 'Las ruedas que empujan',
      figura: est({ alto: 150, piso: { y: 130 }, objetos: [{ tipo: 'auto', x: 150, y: 130, w: 110 }],
        flechas: [{ de: [130, 72], ang: 0, largo: 34, color: 'tinta', discontinua: true, texto: 'a⃗', rumbo: [1, -0.3] }],
        textos: [{ x: 8, y: 24, texto: 'el motor mueve la rueda de atrás', ancla: 'start', peso: 400 }, { x: 96, y: 146, texto: 'f = ?', ancla: 'middle' }],
        alt: 'Un auto que arranca hacia la derecha; el motor hace girar solo la rueda de atrás. El rozamiento del piso sobre ella, con un signo de pregunta.' }),
      enunciado: ['Un auto arranca y acelera hacia adelante. El motor hace girar solo la rueda de atrás, que no patina. ¿Hacia dónde apunta el rozamiento del piso sobre esa rueda?'],
      alternativas: ['Hacia atrás: frena el avance', 'Hacia adelante', 'No hay: la rueda gira', 'Hacia abajo, como el peso', 'Hacia arriba, como la normal'],
      datos: [D.tercera, D.segunda, D.est],
      solucion: [
        { texto: 'La de atrás es la rueda motriz: al girar, empuja el piso hacia atrás y, por la tercera ley, el piso la empuja hacia adelante.' },
        { texto: 'Ese rozamiento estático es la fuerza de afuera que acelera al auto: sin él, la rueda patinaría.' },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si crees que el rozamiento siempre frena; ', neg('C'), ', si olvidas que la rueda aprieta el piso, y ', neg('D'), ' y ', neg('E'), ', si confundes el rozamiento, que va a lo largo del piso, con fuerzas verticales.'] },
      ],
      respuesta: [neg('B'), ': hacia adelante'] },
    { nivel: 3, titulo: 'Frenar sin saber la masa',
      figura: est(figPiso({ cosa: { x: 100, texto: '' }, v: 1, tv: 'v = 8 m/s', fz: { P: 1, N: 1, tP: 'P⃗', tN: 'N⃗', f: 1, tf: 'f⃗_k', fdir: -1, adir: -1 },
        textos: [{ x: 8, y: 22, texto: 'se detiene en 16 m; μ_k = ?', ancla: 'start', peso: 400 }], alt: 'Un carrito que desliza a 8 m/s y se detiene en 16 m por el rozamiento.' })),
      enunciado: ['Un carrito con las ruedas trabadas desliza a 8 m/s y se detiene en 16 m. ¿Cuánto vale ', muk, ' entre las ruedas y el piso?'],
      alternativas: ['0,4', '0,05', '0,2', '2', '0,5'],
      datos: [D.peso, D.cin, D.segunda, D.mruv],
      solucion: [
        { texto: 'No dan el tiempo, y al final el carrito está quieto, v = 0; la aceleración sale de v² = v₀² + 2 · a · d:', ecuacion: ['a = ', frac('8²', '2 · 16'), ' = 2 m/s²'] },
        { texto: 'Con las ruedas trabadas, el rozamiento es la fuerza neta que lo frena: el coeficiente por el peso es igual a la masa por la aceleración.', ecuacion: [muk, ' · m · 10 = m · 2'] },
        { texto: 'La masa está a los dos lados y se cancela, por eso no hace falta conocerla:', ecuacion: [muk, ' = ', frac('2', '10'), ' = ', neg('0,2')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si olvidas el 2; ', neg('B'), ', si usas 8 ÷ 16 como aceleración; ', neg('D'), ', si das la aceleración en lugar del coeficiente, y ', neg('E'), ', si das 8 ÷ 16.'] },
      ],
      respuesta: [neg('C'), ', ', muk, ' = ', neg('0,2')] },
    { nivel: 3, titulo: 'Bajar la rampa a velocidad constante',
      figura: est(figRampa({ ang: 37, P: 1, N: 1, f: 1, tf: 'f⃗_k', v: -1, textos: [{ x: 312, y: 30, texto: 'baja a velocidad constante', ancla: 'end', peso: 400 }, { x: 312, y: 52, texto: 'μ_k = ?', ancla: 'end' }],
        alt: 'Un bloque que baja por una rampa de 37° a velocidad constante.' })),
      enunciado: ['Un bloque baja por una rampa de 37° siempre a la misma rapidez. ¿Cuánto vale ', muk, ' entre el bloque y la rampa?'],
      alternativas: ['0,6', '1,25', '1,33', '0', '0,75'],
      datos: [D.rampa, D.cin, D.trig, D.primera],
      solucion: [
        { texto: 'A velocidad constante no hay aceleración, así que a lo largo de la rampa las fuerzas suman cero: el rozamiento, hacia arriba, iguala la parte del peso que jala hacia abajo.', ecuacion: [muk, ' · ', P, ' · ', frac('4', '5'), ' = ', P, ' · ', frac('3', '5')] },
        { texto: 'El peso está a los dos lados y se cancela, así que el coeficiente depende solo del ángulo:', ecuacion: [muk, ' = ', frac('3', '4'), ' = ', neg('0,75')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si olvidas el cos 37° de la normal; ', neg('B'), ', si olvidas el sen 37° del peso a lo largo; ', neg('C'), ', si divides al revés, y ', neg('D'), ', si crees que sin acelerar no hay rozamiento.'] },
      ],
      respuesta: [neg('E'), ', ', muk, ' = ', neg('0,75')] },
  ];

  const COSAS3_AT = [{ n: 'un costal de papas', cosa: 'costal', lo: 'lo' }, { n: 'una caja de libros', cosa: 'caja', lo: 'la' }, { n: 'un baúl', cosa: 'caja', lo: 'lo' }];
  const COSAS3_RS = [{ n: 'un saco de arroz', cosa: 'costal', lo: 'lo' }, { n: 'una maleta', cosa: 'caja', lo: 'la' }];
  const roceMov = {
    id: 'rozamiento-en-movimiento',
    titulo: 'Rozamiento en movimiento',
    pregunta: '¿Una caja más pesada frena antes al deslizar?',
    temas: ['Rozamiento en movimiento'],
    pieza: 'fis-estatica',
    aprendizaje: 'Mientras desliza, el rozamiento vale μk · N y va contra el deslizamiento. Lo que sobra acelera; sin empuje, frena.',
    actividad: 'Arrastrar con una cuerda un costal que ya desliza por el piso del almacén.',
    lee: {
      tarjetas: [
        { titulo: 'El piso frena', texto: ['Como viste en Estática, mientras algo desliza, el piso lo frena con el rozamiento cinético, ', fk, ' = ', muk, ' · ', N, ', donde ', N, ' es la normal, lo que el piso empuja hacia arriba. La letra μ se lee «mu»: es un número sin unidades que dice qué tan áspero es el contacto, más grande en un piso de cemento que en uno encerado.'] },
        { titulo: 'Jalar inclinado', texto: 'Una cuerda inclinada hace una fuerza oblicua, que jala de lado y a la vez levanta un poco el costal. Como la cuerda ya sostiene parte del peso, el piso empuja menos hacia arriba: la normal es menor que el peso, y el rozamiento también baja.' },
        { titulo: 'Qué mirar al jugar', texto: ['El costal ya va deslizando, así que el piso lo frena todo el tiempo. Jala más o menos fuerte, cambia el piso y mira si la flecha punteada, ', vec('a'), ', apunta hacia adelante, hacia atrás o desaparece.'],
          dibujo: est(figPiso({ cosa: { tipo: 'costal', x: 92, w: 70, h: 52, texto: '20 kg' }, cuerda: true, largoCuerda: 40, v: 1, fz: { P: 200, N: 200, F: 60, tP: 'P⃗', tN: 'N⃗', tF: 'F⃗', f: 40, tf: 'f⃗_k', adir: 1 }, alt: 'El costal jalado con una cuerda; su DCL con el peso, la normal, el jalón y el rozamiento.' })) },
      ],
    },
    ejemplos: EJEMPLOS_ROCE,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'Arrastras con una cuerda un costal de 20 kg que ya desliza por el piso del almacén. Cada kilogramo pesa 10 N.',
      mision: {
        texto: 'Con el piso más áspero, haz que el costal deslice sin acelerar.',
        // Una sola manera: μk = 0,4 y 80 N (con los otros pisos también hay una, pero la misión pide el más áspero).
        logrado: val => val.mu === 0.4 && Math.abs(val.F - val.mu * M3 * G) < 1e-9,
        bien: '¡Parejo! Jalas justo lo que frena el piso: la fuerza neta es cero.',
      },
      voz: '¿Cuándo acelera, cuándo frena y cuándo va parejo?',
      leyenda: [
        { s: [vec(F)], t: 'lo que jala la cuerda' },
        { s: [fk], t: 'rozamiento: el piso frena el costal' },
        { s: [vec(P)], t: 'peso del costal' },
        { s: [vec(N)], t: 'el piso empuja hacia arriba' },
        { s: [muk], t: 'qué tan áspero es el piso' },
        { s: [vec('a')], t: 'aceleración: la flecha punteada' },
        { s: 't', t: 'tiempo: con ▶ el juego avanza solo' },
      ],
      controles: [
        { id: 'F', etiqueta: 'Jalón, F', color: 'c-o', min: 0, max: 100, paso: 10, inicio: 60, unidad: 'N', decimales: 0 },
        { id: 'mu', etiqueta: 'Piso, μk', opciones: [{ valor: 0.2, texto: '0,2' }, { valor: 0.3, texto: '0,3' }, { valor: 0.4, texto: '0,4' }], inicio: 0.2 },
        { id: 't', etiqueta: 't', min: 0, max: 3, paso: 0.1, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: juego3,
      // La lectura enuncia lo que sobra: el jalón menos lo que frena el piso.
      lectura: val => { const m = mov3(val);
        if (m.quieto) return ['Se detuvo: el piso frena lo que jalas'];
        const d = val.F - m.fkv;
        return ['Jalas ', pj(N_(val.F)), ' y el piso frena ', pr(N_(m.fkv)), Math.abs(d) < 1e-9 ? ': no sobra nada' : d > 0 ? `: sobran ${f(d)} N` : `: faltan ${f(-d)} N`]; },
      resumen: { F: 60, mu: 0.2, t: 1 },
      minimo: 3,
    },
    predice: {
      pregunta: 'Sueltas a la vez dos cajas, de 10 kg y de 20 kg, que deslizan por el mismo piso a la misma rapidez. La de 10 kg se detiene a 4 m. ¿Dónde se detiene la otra?',
      datos: ['La caja de 10 kg se detiene a 4 m.', 'Las dos salen a la misma rapidez y en el mismo piso.'],
      opciones: [
        { id: 'c', texto: '4 m', correcta: true },
        { id: 'roce', texto: '2 m', error: 'RM-MAS-ROCE', siFuera: 'Pensaste que el doble de rozamiento la detiene en la mitad del camino. La frena el doble, cierto, pero también tiene el doble de masa que frenar, y las dos cosas se compensan.' },
        { id: 'impetu', texto: '8 m', error: 'RM-IMPETU', siFuera: 'Pensaste que, por tener más masa, le cuesta más detenerse y llega más lejos. Cuesta más frenarla, cierto, pero el piso también la frena con el doble de fuerza, porque ella lo aprieta el doble.' },
        { id: 'cuadrado', texto: '16 m', error: 'RM-CUADRADO', siFuera: 'Pensaste que la masa doble cuenta al cuadrado en la distancia. La masa cambia el rozamiento y también lo que cuesta frenar, y en la aceleración las dos se cancelan: la distancia no depende de la masa.' },
      ],
      dibujo: est(PRED3),
      revelar: est(REVELA3),
      coincide: 'Coincide: el doble de rozamiento frena el doble de masa. Las dos frenan igual y se detienen a 4 m.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: MIRA3,
      pasos: [
        { estado: { corte: 0 }, texto: ['La caja de 10 kg pesa 100 N, y en un piso plano la normal iguala al peso. Con ', muk, ' = 0,2, el piso la frena con:'], ecuacion: [fk, ' = 0,2 · 100 = ', pr('20 N')] },
        { estado: { corte: 0 }, texto: 'La de 20 kg pesa el doble y aprieta el piso el doble; por eso el piso la frena con el doble de rozamiento:', ecuacion: [fk, ' = 0,2 · 200 = ', pr('40 N')] },
        { estado: { corte: 0 }, texto: 'Pero también tiene el doble de masa que frenar, y su aceleración es el rozamiento entre su masa:', ecuacion: ['a = 40 ÷ 20 = 2 m/s²'] },
        { estado: { corte: 0 }, texto: 'Las dos frenan igual porque la masa se cancela: el rozamiento es μ · m · g, y al dividirlo entre m queda solo μ · g.', ecuacion: ['a = ', muk, ' · ', g, ' = 0,2 · 10 = 2 m/s²'] },
        { estado: { corte: 1 }, texto: 'Salieron a la misma rapidez, 4 m/s, y frenan igual, así que las dos se detienen a 4 m.', ecuacion: ['d = ', frac('4²', '2 · 2'), ' = 4 m'] },
      ],
    },
    regla: {
      texto: 'Mientras un cuerpo desliza, el piso lo frena con el rozamiento cinético, el coeficiente por la normal, que apunta contra el deslizamiento. Si una cuerda jala inclinada, levanta un poco el cuerpo, la normal baja y el rozamiento también. Lo que sobra de las fuerzas de lado, dividido entre la masa, es la aceleración; si nada empuja, el rozamiento frena.',
      ecuacion: [fk, ' = ', muk, ' · ', N, ';   ', ...SF, ' = m · a'],
      condicion: 'el cuerpo ya desliza y el coeficiente no cambia con la rapidez; si sigue quieto, vale el rozamiento estático, que solo iguala lo que lo empuja.',
      dibujo: est(figPiso({ cosa: { tipo: 'caja', x: 92, w: 70, h: 44, texto: 'm' }, cuerda: true, ang: 37, largoCuerda: 50, fz: { P: 100, N: 40, F: 100, Fang: 37, tP: 'P⃗', tN: 'N⃗', tF: 'F⃗', f: 1, tf: 'f⃗_k', adir: 1 },
        alt: 'Un bloque jalado con una cuerda inclinada: la normal es el peso menos lo que levanta la cuerda; el rozamiento frena, y lo que sobra acelera.' })),
    },
    // Así se resuelve: jalar con una cuerda horizontal un saco o una maleta (otra lista que «Ahora tú») y, en las semillas
    // impares, la distancia de frenado de lo que se suelta.
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900), ob = r.de(COSAS3_RS);
        if (sm % 2 === 1) {
          const c = elegir(() => { const v0 = r.de([2, 4, 6, 8]), mu = r.de([0.2, 0.25, 0.4, 0.5]), a = mu * G, d = v0 * v0 / (2 * a); return exacto(d) && { v0, mu, a, d }; });
          return {
            enunciado: [`Empujas ${ob.n} y ${ob.lo === 'la' ? 'la' : 'lo'} sueltas: desliza sol${ob.lo === 'la' ? 'a' : 'o'} a ${c.v0} m/s por un piso con `, muk, ` = ${f(c.mu)}. ¿Qué distancia recorre hasta detenerse?`],
            datos: [D.peso, D.cin, D.segunda, D.mruv],
            dibujo: est(figPiso({ cosa: { tipo: ob.cosa, x: 100, w: 70, h: 48, texto: '' }, v: 1, tv: `v = ${c.v0} m/s`, fz: { P: 1, N: 1, tP: 'P⃗', tN: 'N⃗', f: 1, tf: 'f⃗_k', fdir: -1, adir: -1 },
              textos: [{ x: 8, y: 22, texto: 'se detiene a: ?', ancla: 'start', peso: 400 }] })),
            pasos: [
              { tipo: 'pide', texto: 'Piden la distancia hasta detenerse.' },
              { tipo: 'datos', texto: [`Sale a ${c.v0} m/s y nadie ${ob.lo === 'la' ? 'la' : 'lo'} empuja. El piso: `, muk, ` = ${f(c.mu)}. No dan la masa.`] },
              { tipo: 'regla', texto: 'Ya nadie empuja, así que el rozamiento es la única fuerza de lado y es la fuerza neta. Con la aceleración que da, la fórmula de MRUV que no usa el tiempo da la distancia.', ecuacion: [fk, ' = ', muk, ' · ', N, ';   v² = v₀² + 2 · a · d'] },
              { tipo: 'cuentas', texto: `El rozamiento es μ · m · g y, al dividirlo entre la masa, la masa se cancela: a = ${f(c.mu)} · 10 = ${f(c.a)} m/s², contra el avance. Al final está quieto, v = 0:`, ecuacion: [`d = ${c.v0}² ÷ (2 · ${f(c.a)}) = `, neg(`${f(c.d)} m`)] },
              { tipo: 'sentido', texto: 'La distancia va con la rapidez al cuadrado: con el doble de rapidez llegaría cuatro veces más lejos, aunque el piso la frene igual.' },
            ],
            respuesta: [neg(`d = ${f(c.d)} m`)],
          };
        }
        const c = elegir(() => { const m = r.de([10, 30, 40, 50]), mu = r.de([0.1, 0.2, 0.3]), Fv = r.de([80, 100, 150, 200]), fkv = mu * m * G, a = (Fv - fkv) / m; return a > 0 && exacto(a) && exacto(fkv) && { m, mu, Fv, fkv, a }; });
        return {
          enunciado: [`Jalas con una cuerda horizontal ${ob.n} de ${c.m} kg que ya desliza. La cuerda jala con `, pj(N_(c.Fv)), ' y entre el piso y ', ob.lo === 'la' ? 'ella' : 'él', ', ', muk, ` = ${f(c.mu)}. ¿Cuánto acelera?`],
          datos: [D.peso, D.cin, D.segunda],
          dibujo: est(figPiso({ cosa: { tipo: ob.cosa, x: 92, w: 70, h: 48, texto: `${c.m} kg` }, cuerda: true, largoCuerda: 40, fz: { P: c.m * G, N: c.m * G, F: c.Fv, tP: 'P⃗', tN: 'N⃗', tF: `F = ${N_(c.Fv)}`, f: 1, tf: 'f⃗_k', adir: 1, ta: 'a = ?' } })),
          pasos: [
            { tipo: 'pide', texto: 'Piden la aceleración.' },
            { tipo: 'datos', texto: [`Masa: ${c.m} kg. La cuerda: `, pj(N_(c.Fv)), ', horizontal. El piso: ', muk, ` = ${f(c.mu)}.`] },
            { tipo: 'regla', texto: 'La cuerda es horizontal, así que lo vertical suma cero y la normal iguala al peso. El rozamiento frena contra el jalón, y lo que sobra del jalón, dividido entre la masa, es la aceleración.', ecuacion: [fk, ' = ', muk, ' · ', N, ';   ', ...SF, ' = m · a'] },
            { tipo: 'cuentas', texto: [fk, ` = ${f(c.mu)} · ${c.m * G} = ${f(c.fkv)} N es lo que frena el piso. El jalón es mayor, y lo que sobra, dividido entre la masa, da la aceleración:`], ecuacion: [`a = (${c.Fv} − ${f(c.fkv)}) ÷ ${c.m} = `, neg(A_(c.a))] },
            { tipo: 'sentido', texto: `Sin rozamiento, el mismo jalón le daría ${f(c.Fv / c.m)} m/s²; el piso se come una parte del jalón y por eso acelera menos.` },
          ],
          respuesta: [neg(A_(c.a))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4;
        if (k === 0) {
          const ob = r.de(COSAS3_AT);
          if (sm % 8 >= 4) {
            // A velocidad constante (W5): jalas lo mismo que frena el piso.
            const c = elegir(() => { const m = r.de([20, 25, 30, 60]), mu = r.de([0.2, 0.3, 0.5]), fkv = mu * m * G; return exacto(fkv) && distintos(fkv, m * G, mu * m) && !(m === 40 && mu === 0.25) && { m, mu, fkv }; });
            return {
              pregunta: [`Arrastras ${ob.n} de ${c.m} kg con una cuerda horizontal, siempre a la misma rapidez. Entre el piso y ${ob.lo === 'la' ? 'ella' : 'él'}, `, muk, ` = ${f(c.mu)}. ¿Con qué fuerza jalas?`],
              datos: [D.peso, D.cin, D.primera],
              opciones: opciones(c.fkv, [
                { id: 'mas', texto: `Más de ${N_(c.fkv)}`, error: 'W5', siFuera: 'Para arrancarlo sí hace falta más, porque el rozamiento estático puede ser mayor. Pero ya desliza a la misma rapidez, sin aceleración, así que la fuerza neta es cero y basta igualar al rozamiento.' },
                { id: 'peso', valor: c.m * G, error: 'RM-PESO', siFuera: 'Bien usar el peso como normal, pero diste la normal entera. El piso no frena con todo el peso: frena con una fracción de él, la normal por el coeficiente de rozamiento.' },
                { id: 'masa', valor: c.mu * c.m, error: 'RM-MASA', siFuera: 'Bien usar el coeficiente, pero lo multiplicaste por la masa, en kilogramos. El rozamiento es una fuerza y sale de la normal, en newtons: el coeficiente por el peso.' },
              ], N_),
              solucion: { texto: 'A velocidad constante no hay aceleración, así que la fuerza neta es cero: tu jalón iguala al rozamiento, el coeficiente por la normal, que aquí es el peso.', ecuacion: [F, ' = ', fk, ` = ${f(c.mu)} · ${c.m * G} = `, pj(N_(c.fkv))] },
            };
          }
          const c = elegir(() => { const m = r.de([10, 20, 40, 50]), mu = r.de([0.1, 0.2, 0.3, 0.4]), Fv = r.de([60, 90, 120, 160, 200]), fkv = mu * m * G, a = (Fv - fkv) / m;
            return a > 0 && exacto(a) && exacto(fkv) && distintos(a, Fv / m, (Fv + fkv) / m, (Fv - mu * m) / m, fkv / m) && !(m === 20 && Fv === 60) && { m, mu, Fv, fkv, a }; });
          return {
            pregunta: [`Jalas con una cuerda horizontal ${ob.n} de ${c.m} kg que ya desliza. La cuerda jala con `, pj(N_(c.Fv)), ' y el piso tiene ', muk, ` = ${f(c.mu)}. ¿Cuánto acelera?`],
            datos: [D.peso, D.cin, D.segunda],
            dibujo: est(figPiso({ cosa: { tipo: ob.cosa, x: 92, w: 70, h: 48, texto: `${c.m} kg` }, cuerda: true, largoCuerda: 40, fz: { P: c.m * G, N: c.m * G, F: c.Fv, tP: 'P⃗', tN: 'N⃗', tF: `F = ${N_(c.Fv)}`, f: 1, tf: 'f⃗_k', adir: 1, ta: 'a = ?' } })),
            opciones: opciones(c.a, [
              { id: 'sin', valor: c.Fv / c.m, error: 'RM-SIN-ROCE', siFuera: 'Bien dividir entre la masa, pero dividiste el jalón entero. Mientras desliza, el piso lo frena, así que primero se le resta el rozamiento al jalón y solo lo que sobra se divide.' },
              { id: 'suma', valor: (c.Fv + c.fkv) / c.m, error: 'RM-SUMA', siFuera: 'Bien contar el rozamiento, pero lo sumaste al jalón como si ayudara. El rozamiento apunta contra el deslizamiento, al revés que la cuerda, así que se resta.' },
              { id: 'masa', valor: (c.Fv - c.mu * c.m) / c.m, error: 'RM-MASA', siFuera: 'Bien restar el rozamiento, pero lo calculaste con la masa, en kilogramos. El rozamiento es el coeficiente por la normal, que aquí es el peso en newtons.' },
              { id: 'solo', valor: c.fkv / c.m, error: 'RM-SOLO-ROCE', siFuera: 'Bien calcular el rozamiento, pero lo dividiste solo entre la masa. La fuerza neta no es el rozamiento sino lo que sobra del jalón después de restarle el rozamiento.' },
            ], A_),
            solucion: { texto: 'La normal es el peso, porque la cuerda es horizontal; el rozamiento, el coeficiente por esa normal, se resta del jalón, y lo que sobra, dividido entre la masa, da la aceleración:', ecuacion: [`a = (${c.Fv} − ${f(c.mu)} · ${c.m * G}) ÷ ${c.m} = `, neg(A_(c.a))] },
          };
        }
        if (k === 1) {
          const ob = r.de(COSAS3_AT), c = elegir(() => { const v0 = r.de([3, 4, 5, 10]), mu = r.de([0.1, 0.2, 0.5]), m = r.de([10, 20, 30]), a = mu * G, d = v0 * v0 / (2 * a);
            return exacto(d) && distintos(d, v0 * v0 / a, v0 / a, d / m) && { v0, mu, m, a, d }; });
          return {
            pregunta: [`Empujas ${ob.n} de ${c.m} kg y ${ob.lo} sueltas: sale deslizando a ${c.v0} m/s por un piso con `, muk, ` = ${f(c.mu)}. ¿Qué distancia recorre hasta detenerse?`],
            datos: [D.peso, D.cin, D.segunda, D.mruv],
            opciones: opciones(c.d, [
              { id: 'dos', valor: c.v0 * c.v0 / c.a, error: 'RM-SIN-DOS', siFuera: 'Bien la aceleración, pero al despejar la distancia perdiste el 2. En v² = v₀² + 2 · a · d, con v = 0, la distancia es v₀² dividido entre 2 · a.' },
              { id: 'tiempo', valor: c.v0 / c.a, error: 'RM-TIEMPO', siFuera: 'Bien: v₀ ÷ a es lo que tarda en detenerse, en segundos. Pero te piden la distancia, en metros, que sale de v² = v₀² + 2 · a · d.' },
              { id: 'masa', valor: c.d / c.m, error: 'RM-MASA-FRENA', siFuera: 'Bien la distancia, pero después la dividiste entre la masa. La masa ya se canceló al sacar la aceleración: una caja más pesada sufre más rozamiento, pero también cuesta más frenarla.' },
            ], v => `${f(v)} m`),
            solucion: { texto: ['Sin empuje, el rozamiento es la fuerza neta, y al dividirlo entre la masa queda a = ', muk, ' · g. Después, con v = 0 al final, la fórmula de MRUV da la distancia:'], ecuacion: [`a = ${f(c.mu)} · 10 = ${f(c.a)} m/s²;   d = ${c.v0}² ÷ (2 · ${f(c.a)}) = `, neg(`${f(c.d)} m`)] },
          };
        }
        if (k === 2) {
          // Jalón a 37° (San Marcos 2025-II): la cuerda levanta un poco y la normal baja.
          const c = elegir(() => { const m = r.de([5, 10, 20]), Fv = r.de([50, 100, 150]), mu = r.de([0.2, 0.25, 0.5]), Nv = m * G - Fv * 0.6, a = (Fv * 0.8 - mu * Nv) / m;
            return Nv > 0 && a > 0 && exacto(a) && distintos(a, (Fv * 0.8 - mu * m * G) / m, (Fv - mu * Nv) / m, (Fv * 0.8 - mu * (m * G + Fv * 0.6)) / m) && !(m === 10 && Fv === 100 && mu === 0.5) && { m, Fv, mu, Nv, a }; });
          return {
            pregunta: [`Un bloque de ${c.m} kg desliza por el piso jalado con `, pj(N_(c.Fv)), ' por una cuerda a 37° sobre la horizontal. Entre el bloque y el piso, ', muk, ` = ${f(c.mu)}. ¿Cuánto acelera?`],
            datos: [D.peso, D.comp, D.trig, D.cin, D.segunda],
            dibujo: est(figPiso({ cosa: { tipo: 'caja', x: 92, w: 70, h: 44, texto: `${c.m} kg` }, cuerda: true, ang: 37, largoCuerda: 50, fz: { P: c.m * G, N: 1, F: c.Fv, Fang: 37, tP: 'P⃗', tN: 'N⃗', tF: `F = ${N_(c.Fv)}`, f: 1, tf: 'f⃗_k', adir: 1, ta: 'a = ?' } })),
            opciones: opciones(c.a, [
              { id: 'mg', valor: (c.Fv * 0.8 - c.mu * c.m * G) / c.m, error: 'N-MG', siFuera: 'Bien descomponer el jalón, pero tomaste la normal igual al peso. La cuerda inclinada levanta un poco el bloque, así que el piso empuja menos: la normal es el peso menos F · sen 37°.' },
              { id: 'entera', valor: (c.Fv - c.mu * c.Nv) / c.m, error: 'RM-SIN-COS', siFuera: 'Bien la normal, pero usaste el jalón entero de lado. Como la cuerda está inclinada, solo una parte jala hacia adelante: F · cos 37°; el resto levanta.' },
              { id: 'signo', valor: (c.Fv * 0.8 - c.mu * (c.m * G + c.Fv * 0.6)) / c.m, error: 'RM-SIGNO-N', siFuera: 'Bien que la cuerda cambia la normal, pero le sumaste su parte vertical. La cuerda jala hacia arriba, como ayudando al piso, así que la normal es el peso menos esa parte, no más.' },
            ], A_),
            solucion: { texto: 'La cuerda levanta con F · sen 37°, así que la normal es el peso menos eso. De lado jala F · cos 37°; se le resta el rozamiento y lo que sobra, entre la masa, da la aceleración:', ecuacion: [N, ` = ${c.m * G} − ${f(c.Fv * 0.6)} = ${f(c.Nv)} N;   a = (${f(c.Fv * 0.8)} − ${f(c.mu * c.Nv)}) ÷ ${c.m} = `, neg(A_(c.a))] },
          };
        }
        // Nivel examen: la rampa áspera. Lo que sube (San Marcos 2027-I: frenan juntos el peso y el rozamiento) o lo que baja.
        const sube = sm % 8 >= 4;
        const c = elegir(() => { const mu = r.de([0.25, 0.5, 0.1]), v0 = r.de([4, 6, 8]), a = sube ? G * (0.6 + 0.8 * mu) : G * (0.6 - 0.8 * mu), d = v0 * v0 / (2 * a);
          return a > 0 && exacto(a) && (!sube || exacto(d)) && !(sube && mu === 0.5 && v0 === 10) && !(!sube && mu === 0.5) && (sube ? distintos(d, v0 * v0 / (2 * G * (0.6 - 0.8 * mu)), v0 * v0 / (2 * G * 0.6), v0 * v0 / (2 * G * (0.6 + mu)))
            : distintos(a, G * 0.6, G * (0.6 + 0.8 * mu), G * (0.6 - mu), G * (0.8 - 0.6 * mu))) && { mu, v0, a, d }; });
        if (sube) {
          return {
            pregunta: [`Lanzas una caja hacia arriba por una rampa de 37°, a ${c.v0} m/s. Entre la caja y la rampa, `, muk, ` = ${f(c.mu)}. ¿Qué distancia sube hasta detenerse?`],
            datos: [D.rampa, D.cin, D.trig, D.mruv],
            dibujo: est(figRampa({ ang: 37, s: 90, P: 1, N: 1, f: 1, fAbajo: true, v: 1, tv: `v = ${c.v0} m/s` })),
            opciones: opciones(c.d, [
              { id: 'resta', valor: c.v0 * c.v0 / (2 * G * (0.6 - 0.8 * c.mu)), error: 'RM-RAMPA-RESTA', siFuera: 'Bien contar el rozamiento, pero lo restaste. El rozamiento va contra el deslizamiento: al subir apunta hacia abajo de la rampa, como la parte del peso, y las dos frenan juntas.' },
              { id: 'sin', valor: c.v0 * c.v0 / (2 * G * 0.6), error: 'RM-SIN-ROCE', siFuera: 'Bien la parte del peso a lo largo, pero olvidaste el rozamiento. La rampa es áspera, y mientras la caja sube, el rozamiento también la frena.' },
              { id: 'mg', valor: c.v0 * c.v0 / (2 * G * (0.6 + c.mu)), error: 'N-MG', siFuera: 'Bien sumar las dos, pero tomaste la normal igual al peso. En la rampa, el piso solo empuja contra la parte del peso que aprieta la rampa: N = P · cos 37°.' },
            ], v => `${f(v)} m`),
            solucion: { texto: 'Al subir, la parte del peso a lo largo y el rozamiento apuntan hacia abajo de la rampa y frenan juntos; con esa aceleración, la fórmula de MRUV da lo que sube:', ecuacion: [`a = 10 · (0,6 + ${f(c.mu)} · 0,8) = ${f(c.a)} m/s²;   d = ${c.v0}² ÷ (2 · ${f(c.a)}) = `, neg(`${f(c.d)} m`)] },
          };
        }
        return {
          pregunta: ['Una caja baja deslizando por una rampa de 37°. Entre la caja y la rampa, ', muk, ` = ${f(c.mu)}. ¿Cuánto acelera?`],
          datos: [D.rampa, D.cin, D.trig, D3.rampaLargo],
          dibujo: est(figRampa({ ang: 37, P: 1, N: 1, f: 1, adir: -1, ta: 'a = ?' })),
          opciones: opciones(c.a, [
            { id: 'sin', valor: G * 0.6, error: 'RM-SIN-ROCE', siFuera: 'Bien la parte del peso a lo largo, pero olvidaste el rozamiento. La rampa es áspera: mientras la caja baja, el rozamiento apunta hacia arriba de la rampa y le quita aceleración.' },
            { id: 'suma', valor: G * (0.6 + 0.8 * c.mu), error: 'RM-SUMA', siFuera: 'Bien contar el rozamiento, pero lo sumaste como si empujara hacia abajo. Al bajar, el rozamiento apunta hacia arriba de la rampa, contra el deslizamiento, así que se resta.' },
            { id: 'mg', valor: G * (0.6 - c.mu), error: 'N-MG', siFuera: 'Bien restar el rozamiento, pero lo calculaste con el peso entero. En la rampa, la normal solo iguala la parte del peso que aprieta la rampa: N = P · cos 37°.' },
            { id: 'cambia', valor: G * (0.8 - 0.6 * c.mu), error: 'RM-SEN-COS', siFuera: 'Bien la idea, pero cambiaste el seno y el coseno. A lo largo de la rampa jala P · sen 37°, y contra la rampa aprieta P · cos 37°, que es la normal.' },
          ], A_),
          solucion: { texto: 'A lo largo de la rampa, la parte del peso jala hacia abajo y el rozamiento frena hacia arriba; lo que sobra, entre la masa, es la aceleración. La masa se cancela:', ecuacion: [`a = 10 · (0,6 − ${f(c.mu)} · 0,8) = `, neg(A_(c.a))] },
        };
      },
    },
  };

  // ======================= 4: bloques unidos por una cuerda (el costal sobre la mesa y el balde que cuelga) ===========
  // Cambia: las dos masas · Permanece: la mesa lisa y la polea · Progresa: la aceleración del conjunto · Se reserva: cuánto
  // jala la cuerda (Predice) · Debe verse: van juntos; la tensión sale de un solo bloque y no es el peso del balde.
  // Lienzo: la mesa de y = 120 (tablero) a 220 (piso); la polea en la esquina derecha; el balde cuelga en x = 248.
  const XP = 236, YT = 120;
  function figMesa(o0) {
    // Si la figura dibuja alguna fuerza, dibuja todas las de los dos cuerpos (auditoría, M2): el costal con su peso, la
    // normal de la mesa y la cuerda (y el rozamiento si lo hay); el balde con su peso y la cuerda.
    const o = Object.assign({}, o0), alguna = o.T1 || o.T2 || o.P2 || o.f1;
    if (alguna && o.todas !== false) { o.T1 = o.T1 || 'T⃗'; o.T2 = o.T2 || 'T⃗'; o.P2 = o.P2 || 'P⃗'; o.N1 = o.N1 || 'N⃗'; o.P1 = o.P1 || 'P⃗'; }
    const s = o.s || 0, xb = (o.xb || 96) + s, wb = 58, hb = 40, yr = YT - hb / 2, yb = (o.ybalde || 166) + s;
    const objs = [{ tipo: 'viga', x0: 8, x1: XP - 4, y: YT + 8 }, { tipo: 'barra', de: [24, YT + 8], a: [24, 220], grosor: 6 }, { tipo: 'barra', de: [XP - 22, YT + 8], a: [XP - 22, 220], grosor: 6 },
      Object.assign({ tipo: 'caja', x: xb, y: YT, w: wb, h: hb, texto: o.t1 || '' }, o.cosa1 || {}),
      { tipo: 'cuerda', de: [xb + wb / 2, yr], a: [XP, yr] }, { tipo: 'polea', c: [XP, yr + 14], r: 14 }, { tipo: 'cuerda', de: [XP + 14, yr + 14], a: [XP + 14, yb - 30] },
      { tipo: 'balde', x: XP + 14, y: yb, w: 38, h: 30, texto: '' }];
    const fl = [], tx = [{ x: XP + 40, y: yb - 6, texto: o.t2 || '', ancla: 'start' }, ...(o.textos || [])];
    if (o.T1) fl.push({ de: [xb + wb / 2, yr - 12], ang: 0, largo: LARGO_FIJO, color: 'o', texto: o.T1, rumbo: [0, -1] });
    if (o.N1) fl.push({ de: [xb - 14, YT - hb], ang: 90, largo: LARGO_FIJO, color: 'f', texto: o.N1, rumbo: [-1, -0.3] });
    if (o.P1) fl.push({ de: [xb - 14, YT - 6], ang: 270, largo: LARGO_FIJO, color: 'h', texto: o.P1, rumbo: [-1, 0.2] });
    if (o.f1) fl.push({ de: [xb - wb / 2, YT - 8], ang: 180, largo: LARGO_FIJO, color: 'i', texto: o.f1, rumbo: [-0.2, -1] });
    if (o.T2) fl.push({ de: [XP + 28, yb - 30], ang: 90, largo: LARGO_FIJO, color: 'o', texto: o.T2, rumbo: [1, 0] });
    if (o.P2) fl.push({ de: [XP + 14, yb], ang: 270, largo: LARGO_FIJO, color: 'h', texto: o.P2, rumbo: [1, 0.3] });
    if (o.a) { fl.push({ de: [xb + 22, 40], ang: 0, largo: LARGO_FIJO, color: 'tinta', discontinua: true, texto: o.a, rumbo: [1, -0.4] });
      fl.push({ de: [XP - 12, yb - 30], ang: 270, largo: LARGO_FIJO, color: 'tinta', discontinua: true, texto: o.a2 || '', rumbo: [-1, 0] }); }
    return { alto: 236, piso: { y: 220, x0: 8, x1: 312 }, objetos: objs, flechas: fl, textos: tx, alt: o.alt };
  }
  // La máquina de Atwood: una polea del techo con un bloque a cada lado.
  function figAtwood(o0) {
    // Con los pesos dibujados, también la cuerda que jala a cada bloque (auditoría, M2).
    const o = Object.assign({}, o0);
    if (o.P && !o.T) o.T = 'T⃗';
    const c = [160, 46], r = 22, y1 = o.y1 || 150, y2 = o.y2 || 150, fl = [];
    const objs = [{ tipo: 'cuerda', de: [160, 10], a: [160, 24] }, { tipo: 'polea', c, r }, { tipo: 'cuerda', de: [138, 46], a: [138, y1 - 40] }, { tipo: 'cuerda', de: [182, 46], a: [182, y2 - 34] },
      { tipo: 'caja', x: 138, y: y1, w: 46, h: 40, texto: o.t1 || '' }, { tipo: 'caja', x: 182, y: y2, w: 40, h: 34, texto: o.t2 || '' }];
    if (o.T) { fl.push({ de: [118, y1 - 40], ang: 90, largo: LARGO_FIJO, color: 'o', texto: o.T, rumbo: [-1, 0] }); fl.push({ de: [204, y2 - 34], ang: 90, largo: LARGO_FIJO, color: 'o', texto: o.T2 || o.T, rumbo: [1, 0] }); }
    if (o.P) { fl.push({ de: [128, y1], ang: 270, largo: LARGO_FIJO, color: 'h', texto: o.P, rumbo: [-1, 0.2] }); fl.push({ de: [192, y2], ang: 270, largo: LARGO_FIJO, color: 'h', texto: o.P2 || o.P, rumbo: [1, 0.2] }); }
    if (o.a) { fl.push({ de: [80, y1 - 30], ang: 270, largo: LARGO_FIJO, color: 'tinta', discontinua: true, texto: o.a, rumbo: [-1, 0] }); fl.push({ de: [240, y2 - 30], ang: 90, largo: LARGO_FIJO, color: 'tinta', discontinua: true, texto: '', rumbo: [1, 0] }); }
    return { alto: 236, techo: { y: 10, x0: 110, x1: 210 }, piso: o.piso ? { y: 226, x0: 60, x1: 260 } : undefined, objetos: objs, flechas: fl, cotas: o.cotas || [], textos: o.textos || [], alt: o.alt };
  }
  // Carritos en fila sobre un piso liso; F jala el de adelante (a la derecha).
  function figTren(o) {
    const ms = o.ms, w = 56, gap = 26, x0 = 30, objs = [], txt = [...(o.textos || [])];
    ms.forEach((m, i) => objs.push({ tipo: 'carrito', x: x0 + w / 2 + (ms.length - 1 - i) * (w + gap), y: 186, w, h: 26, mango: 0, texto: `${m} kg` }));
    for (let i = 0; i < ms.length - 1; i++) { const xa = x0 + w + (ms.length - 2 - i) * (w + gap); objs.push({ tipo: 'cuerda', de: [xa, 160], a: [xa + gap, 160] }); }
    const xf = x0 + ms.length * w + (ms.length - 1) * gap;
    objs.push({ tipo: 'cuerda', de: [xf, 160], a: [xf + 30, 160] });
    return { alto: 210, piso: { y: 186, x0: 8, x1: 312 }, objetos: objs, flechas: [{ de: [xf + 6, 140], ang: 0, largo: LARGO_FIJO, color: 'o', texto: o.F, rumbo: [0, -1] }], textos: txt, alt: o.alt };
  }
  // El bloque en una rampa lisa, unido por una cuerda que pasa por una polea en lo alto a un balde que cuelga.
  function figRampaPolea(o) {
    const th = 37, x0 = 14, y0 = 214, L = 230, cs = 0.8, sn = 0.6, top = [x0 + L * cs, y0 - L * sn], s0 = 120;
    const base = [x0 + s0 * cs, y0 - s0 * sn], h = 30, w = 44, cuerda = [base[0] + cs * w / 2 - sn * h / 2, base[1] - sn * w / 2 - cs * h / 2];
    const pc = [top[0] + 4, top[1] - 12];
    return { alto: 236, objetos: [{ tipo: 'rampa', x0, y0, largo: L, ang: th }, { tipo: 'caja', x: base[0], y: base[1], w, h, giro: th, texto: o.t1 || '' }, { tipo: 'polea', c: pc, r: 12 },
      { tipo: 'cuerda', de: cuerda, a: [pc[0] - 7, pc[1] - 10] }, { tipo: 'cuerda', de: [pc[0] + 12, pc[1]], a: [pc[0] + 12, 150] }, { tipo: 'balde', x: pc[0] + 12, y: 184, w: 36, h: 30, texto: '' }],
      flechas: o.a ? [{ de: [pc[0] + 40, 150], ang: 270, largo: LARGO_FIJO, color: 'tinta', discontinua: true, texto: o.a, rumbo: [0, 1] }] : [],
      angulos: [{ c: [x0, y0], de: 0, a: th, r: 40, texto: '37°' }], textos: [{ x: pc[0] + 34, y: 190, texto: o.t2 || '', ancla: 'start' }, ...(o.textos || [])], alt: o.alt };
  }
  const aMesa = (m1, m2, mu = 0) => (m2 * G - mu * m1 * G) / (m1 + m2);
  const juego4 = val => {
    const a = aMesa(val.m1, val.m2), t = val.t || 0, s = Math.min(28, a * t * t / 2 * 3);
    return est(figMesa({ s, t1: `${val.m1} kg`, t2: `${val.m2} kg`, T1: 'T⃗', T2: 'T⃗', P2: 'P⃗', a: 'a⃗', textos: [{ x: 8, y: 22, texto: 'mesa lisa', ancla: 'start', peso: 400 }],
      alt: `Un costal de ${val.m1} kg sobre una mesa lisa, unido por una cuerda a un balde de ${val.m2} kg que cuelga: aceleran ${f(a)} m/s².` }));
  };
  const PRED4 = figMesa({ t1: '3 kg', t2: '2 kg', T1: 'T = ?', T2: 'T = ?', P2: 'P⃗', a: 'a = 4 m/s²', textos: [{ x: 8, y: 22, texto: 'mesa lisa', ancla: 'start', peso: 400 }],
    alt: 'Un costal de 3 kg sobre una mesa lisa y un balde de 2 kg que cuelga, unidos por una cuerda. Lo que jala la cuerda, con un signo de pregunta.' });
  const REVELA4 = figMesa({ t1: '3 kg', t2: '2 kg', T1: 'T = 12 N', T2: 'T = 12 N', P2: 'P = 20 N', a: 'a = 4 m/s²', textos: [{ x: 8, y: 22, texto: 'mesa lisa', ancla: 'start', peso: 400 }],
    alt: 'La cuerda jala con 12 N en sus dos puntas: menos que los 20 N que pesa el balde.' });
  const MIRA4 = Object.assign(figMesa({ t1: '3 kg', t2: '2 kg', textos: [{ x: 8, y: 22, texto: 'mesa lisa', ancla: 'start', peso: 400 }] }), {
    alt: 'El costal y el balde, primero con la cuerda, después con las fuerzas de cada uno.',
    cortes: [{ flechas: [] }, { flechas: figMesa({ T1: 'T⃗', a: 'a = 4 m/s²' }).flechas.filter(x => x.color !== 'tinta' || x.texto) },
      { flechas: figMesa({ T1: 'T⃗', T2: 'T⃗', P2: 'P = 20 N', a: 'a = 4 m/s²' }).flechas.filter(x => x.color !== 'tinta' || x.texto) },
      { flechas: figMesa({ T1: 'T = 12 N', T2: 'T = 12 N', P2: 'P = 20 N', a: 'a = 4 m/s²' }).flechas.filter(x => x.color !== 'tinta' || x.texto) }] });

  // Ejemplos de la idea 4. Cuentas rehechas aparte (cuentas.js: resuelve las ecuaciones de cada bloque, con la misma
  // aceleración, por eliminación): 20/8; 4·3; 30/6; 15; 3 y 3; 20/10 y 8·2; 10/5 y 3·(10 − 2); 30/6 y 4·5;
  // (30 − 10)/8; 30/(10 − 4); 40/10 y 6·4 con cada alternativa; la Atwood de 6 y 4 kg con √(2·2·1); los tres carritos;
  // (50 − 30)/10 en la rampa; (60 − 10)/10 y 6·5 con cada alternativa.
  const D4 = {
    sistema: 'Para el sistema, a lo largo de la cuerda: lo que lo mueve − lo que lo frena = (m₁ + m₂) · a',
    bloque: 'Para un bloque: ΣF sobre él = m · a',
  };
  const EJEMPLOS_BLOQUES = [
    { nivel: 1, titulo: 'La aceleración del sistema',
      figura: est(figMesa({ t1: '6 kg', t2: '2 kg', P2: 'P⃗', a: 'a = ?', textos: [{ x: 8, y: 22, texto: 'mesa lisa', ancla: 'start', peso: 400 }], alt: 'Un costal de 6 kg sobre una mesa lisa, unido a un balde de 2 kg que cuelga.' })),
      enunciado: ['Un costal de 6 kg está sobre una mesa lisa, unido por una cuerda a un balde de 2 kg que cuelga de una polea. ¿Cuánto aceleran?'],
      datos: [D.peso, D.juntos, D4.sistema],
      solucion: [{ texto: 'La mesa es lisa y la tensión queda adentro, así que lo único de afuera que los mueve es el peso del balde, 20 N; con él se mueven los 8 kg:', ecuacion: ['a = ', frac('20', '6 + 2'), ' = ', neg('2,5 m/s²')] }],
      respuesta: [neg('a = 2,5 m/s²')] },
    { nivel: 1, titulo: 'La tensión con la aceleración',
      figura: est(figMesa({ t1: '4 kg', t2: '', T1: 'T = ?', a: 'a = 3 m/s²', textos: [{ x: 8, y: 22, texto: 'mesa lisa', ancla: 'start', peso: 400 }], alt: 'Una caja de 4 kg sobre una mesa lisa, jalada por una cuerda, que acelera 3 m/s².' })),
      enunciado: ['Una caja de 4 kg, sobre una mesa lisa, acelera 3 m/s² jalada solo por una cuerda horizontal. ¿Con qué fuerza jala la cuerda?'],
      datos: [D4.bloque],
      solucion: [{ texto: 'La mesa es lisa, así que de lado solo la jala la cuerda, y la tensión es la masa por la aceleración:', ecuacion: [T, ' = 4 · 3 = ', pj('12 N')] }],
      respuesta: [T, ' = ', pj('12 N')] },
    { nivel: 1, titulo: 'Dos carritos en fila',
      figura: est(figTren({ ms: [2, 4], F: 'F = 30 N', textos: [{ x: 8, y: 22, texto: 'piso liso; a = ?', ancla: 'start', peso: 400 }], alt: 'Dos carritos unidos por una cuerda, de 2 kg adelante y 4 kg atrás, jalados con 30 N.' })),
      enunciado: ['Jalas con ', pj('30 N'), ' dos carritos unidos por una cuerda, de 2 kg y 4 kg, sobre un piso liso. ¿Cuánto aceleran?'],
      datos: [D.juntos, D4.sistema],
      solucion: [{ texto: 'Los carritos van juntos, así que se tratan como un solo cuerpo de 6 kg, y la cuerda que los une queda adentro:', ecuacion: ['a = ', frac('30', '2 + 4'), ' = ', neg('5 m/s²')] }],
      respuesta: [neg('a = 5 m/s²')] },
    { nivel: 1, titulo: 'La cuerda en la polea',
      figura: est(figMesa({ t1: 'costal', t2: 'balde', T1: 'T = 15 N', T2: 'T = ?', alt: 'La cuerda que une el costal y el balde pasa por la polea; jala al costal con 15 N.' })),
      enunciado: ['La cuerda que une el costal y el balde pasa por una polea liviana y jala al costal con ', pj('15 N'), '. ¿Con qué fuerza jala al balde hacia arriba?'],
      datos: [D.cuerda],
      solucion: [{ texto: 'Es la misma cuerda, liviana, y la polea no frena, así que jala igual en sus dos puntas:', ecuacion: [T, ' = ', pj('15 N')] }],
      respuesta: [pj('15 N')] },
    { nivel: 1, titulo: 'Dos baldes iguales',
      figura: est(figAtwood({ t1: '3 kg', t2: '3 kg', P: 'P⃗', textos: [{ x: 8, y: 30, texto: 'a = ?', ancla: 'start' }], alt: 'Dos baldes de 3 kg colgados de los dos lados de una polea.' })),
      enunciado: ['De los dos lados de una polea cuelgan dos bloques de 3 kg, unidos por la misma cuerda. Si los sueltas quietos, ¿cuánto aceleran?'],
      datos: [D.peso, D.juntos, D4.sistema],
      solucion: [{ texto: 'Los dos pesos tiran hacia lados opuestos y son iguales, así que se anulan y nada los mueve; si parten quietos, siguen quietos:', ecuacion: ['a = ', frac('30 − 30', '3 + 3'), ' = ', neg('0')] }],
      respuesta: [neg('a = 0'), ': siguen quietos'] },
    { nivel: 2, titulo: 'La tensión en la mesa lisa',
      figura: est(figMesa({ t1: '8 kg', t2: '2 kg', T1: 'T = ?', P2: 'P⃗', a: 'a⃗', textos: [{ x: 8, y: 22, texto: 'mesa lisa', ancla: 'start', peso: 400 }], alt: 'Un costal de 8 kg sobre una mesa lisa, unido a un balde de 2 kg que cuelga.' })),
      enunciado: ['Un costal de 8 kg está sobre una mesa lisa, unido a un balde de 2 kg que cuelga. ¿Con qué fuerza jala la cuerda?'],
      datos: [D.peso, D.juntos, D4.sistema, D4.bloque],
      solucion: [
        { texto: 'Primero, el sistema: el peso del balde mueve las dos masas.', ecuacion: ['a = ', frac('20', '8 + 2'), ' = 2 m/s²'] },
        { texto: 'Después, el costal: solo la cuerda lo jala de lado, así que la tensión es su masa por la aceleración.', ecuacion: [T, ' = 8 · 2 = ', pj('16 N')] },
      ],
      respuesta: [T, ' = ', pj('16 N')] },
    { nivel: 2, titulo: 'La máquina de Atwood',
      figura: est(figAtwood({ t1: '3 kg', t2: '2 kg', T: 'T = ?', P: 'P⃗', a: 'a⃗', alt: 'Una máquina de Atwood: 3 kg de un lado y 2 kg del otro.' })),
      enunciado: ['En una máquina de Atwood cuelgan 3 kg de un lado y 2 kg del otro. ¿Cuánto aceleran y con qué fuerza jala la cuerda?'],
      datos: [D.peso, D.juntos, D4.sistema, D4.bloque],
      solucion: [
        { texto: 'El de 3 kg baja y el de 2 kg sube; los mueve la diferencia de pesos, repartida entre las dos masas:', ecuacion: ['a = ', frac('30 − 20', '3 + 2'), ' = 2 m/s²'] },
        { texto: 'El de 2 kg sube acelerando, así que la cuerda jala más que su peso; lo que sobra es su fuerza neta:', ecuacion: [T, ' − 20 = 2 · 2   →   ', T, ' = ', pj('24 N')] },
      ],
      respuesta: [neg('2 m/s²'), ' y ', T, ' = ', pj('24 N')] },
    { nivel: 2, titulo: 'La cuerda entre dos carritos',
      figura: est(figTren({ ms: [2, 4], F: 'F = 30 N', textos: [{ x: 8, y: 22, texto: 'piso liso; la cuerda del medio: ?', ancla: 'start', peso: 400 }], alt: 'Dos carritos unidos por una cuerda, de 2 kg adelante y 4 kg atrás, jalados con 30 N.' })),
      enunciado: ['Jalas con ', pj('30 N'), ' el carrito de adelante, de 2 kg, que jala con una cuerda al de atrás, de 4 kg, sobre un piso liso. ¿Con qué fuerza jala la cuerda del medio?'],
      datos: [D.juntos, D4.sistema, D4.bloque],
      solucion: [
        { texto: 'Los dos carritos aceleran juntos, como un solo cuerpo de 6 kg:', ecuacion: ['a = ', frac('30', '6'), ' = 5 m/s²'] },
        { texto: 'Al de atrás solo lo jala la cuerda del medio, así que la tensión es su masa por la aceleración:', ecuacion: [T, ' = 4 · 5 = ', pj('20 N')] },
      ],
      respuesta: [T, ' = ', pj('20 N')] },
    { nivel: 2, titulo: 'La mesa que frena',
      figura: est(figMesa({ t1: '5 kg', t2: '3 kg', P2: 'P⃗', f1: 'f⃗_k', a: 'a = ?', alt: 'Una caja de 5 kg sobre una mesa con rozamiento, unida a un balde de 3 kg que cuelga.' })),
      enunciado: ['Una caja de 5 kg desliza sobre una mesa con ', muk, ' = 0,2, unida a un balde de 3 kg que cuelga de una polea. ¿Cuánto aceleran?'],
      datos: [D.peso, D.cin, D.juntos, D4.sistema],
      solucion: [
        { texto: 'Al sistema lo mueve el peso del balde y lo frena el rozamiento de la caja, el coeficiente por su normal:', ecuacion: [fk, ' = 0,2 · 50 = ', pr('10 N')] },
        { texto: 'Lo que sobra a favor, dividido entre las dos masas, da la aceleración:', ecuacion: ['a = ', frac('30 − 10', '5 + 3'), ' = ', neg('2,5 m/s²')] },
      ],
      respuesta: [neg('a = 2,5 m/s²')] },
    { nivel: 2, titulo: 'Cuánto pesa el balde',
      figura: est(figMesa({ t1: 'costal', t2: '? kg', T2: 'T = 30 N', P2: 'P⃗', a: 'a⃗', a2: 'a = 4 m/s²', alt: 'Un balde que baja acelerando 4 m/s²; la cuerda lo jala hacia arriba con 30 N.' })),
      enunciado: ['Un balde baja acelerando 4 m/s², colgado de una cuerda que lo jala hacia arriba con ', pj('30 N'), '. ¿Qué masa tiene el balde?'],
      datos: [D.peso, D4.bloque],
      solucion: [
        { texto: 'Baja acelerando, así que su peso le gana a la cuerda, y lo que sobra es su masa por la aceleración:', ecuacion: ['m · 10 − 30 = m · 4'] },
        { texto: 'Se pasan los términos con m a un lado y se despeja la masa:', ecuacion: ['m = ', frac('30', '10 − 4'), ' = ', neg('5 kg')] },
      ],
      respuesta: [neg('m = 5 kg')] },
    { nivel: 3, titulo: 'La tensión de la mesa lisa',
      figura: est(figMesa({ t1: '6 kg', t2: '4 kg', T1: 'T = ?', P2: 'P⃗', a: 'a⃗', textos: [{ x: 8, y: 22, texto: 'mesa lisa', ancla: 'start', peso: 400 }], alt: 'Un bloque de 6 kg sobre una mesa lisa, unido a otro de 4 kg que cuelga.' })),
      enunciado: ['Un bloque de 6 kg está sobre una mesa lisa, unido por una cuerda que pasa por una polea a otro bloque de 4 kg que cuelga. ¿Con qué fuerza jala la cuerda?'],
      alternativas: ['40 N', '16 N', '60 N', '100 N', '24 N'],
      datos: [D.peso, D.juntos, D4.sistema, D4.bloque],
      solucion: [
        { texto: 'Primero, el sistema: el peso del que cuelga mueve las dos masas.', ecuacion: ['a = ', frac('40', '6 + 4'), ' = 4 m/s²'] },
        { texto: 'Después, el de la mesa: solo lo jala la cuerda, así que la tensión es su masa por la aceleración.', ecuacion: [T, ' = 6 · 4 = ', pj('24 N')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si igualas la cuerda al peso del que cuelga; ', neg('B'), ', si das su fuerza neta; ', neg('C'), ', si das el peso del de la mesa, y ', neg('D'), ', si sumas los dos pesos.'] },
      ],
      respuesta: [neg('E'), ', ', pj('24 N')] },
    { nivel: 3, titulo: 'La Atwood que llega al piso',
      figura: est(figAtwood({ t1: '6 kg', t2: '4 kg', y1: 196, y2: 150, piso: true, cotas: [{ de: [80, 196], a: [80, 226], texto: '1 m', lado: 1, sep: 0 }], textos: [{ x: 8, y: 30, texto: 'del reposo; v al piso: ?', ancla: 'start', peso: 400 }],
        alt: 'Una máquina de Atwood con 6 kg y 4 kg; el de 6 kg, soltado desde el reposo, está a 1 m del piso.' })),
      enunciado: ['En una máquina de Atwood cuelgan 6 kg y 4 kg. Se sueltan desde el reposo, con el de 6 kg a 1 m del piso. ¿Con qué rapidez llega al piso?'],
      alternativas: ['4,47 m/s', '2 m/s', '1 m/s', '4 m/s', '1,41 m/s'],
      datos: [D.peso, D.juntos, D4.sistema, D.mruv],
      solucion: [
        { texto: 'Primero, el sistema: la diferencia de pesos, entre la masa total.', ecuacion: ['a = ', frac('60 − 40', '6 + 4'), ' = 2 m/s²'] },
        { texto: 'Parte del reposo, recorre 1 m y no dan el tiempo, así que la rapidez sale de v² = 2 · a · d:', ecuacion: ['v = ', { raiz: ['2 · 2 · 1'] }, ' = ', neg('2 m/s')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si usas g como si cayera libre; ', neg('C'), ', si das la velocidad media, 1 m en 1 s; ', neg('D'), ', si olvidas la raíz, y ', neg('E'), ', si olvidas el 2.'] },
      ],
      respuesta: [neg('B'), ', ', neg('2 m/s')] },
    { nivel: 3, titulo: 'Tres carritos en fila',
      figura: est(figTren({ ms: [2, 3, 5], F: 'F = 60 N', textos: [{ x: 8, y: 22, texto: 'piso liso', ancla: 'start', peso: 400 }], alt: 'Tres carritos en fila, de 2, 3 y 5 kg, jalados con 60 N desde el de adelante.' })),
      enunciado: ['Jalas con ', pj('60 N'), ' tres carritos en fila sobre un piso liso: adelante el de 2 kg, después el de 3 kg y al final el de 5 kg. ¿Cuánto jala la cuerda entre el primero y el segundo?'],
      alternativas: ['60 N', '20 N', '48 N', '12 N', '30 N'],
      datos: [D.juntos, D4.sistema, D4.bloque],
      solucion: [
        { texto: 'Los tres carritos aceleran juntos, como un solo cuerpo de 10 kg:', ecuacion: ['a = ', frac('60', '2 + 3 + 5'), ' = 6 m/s²'] },
        { texto: 'La cuerda entre el primero y el segundo arrastra a los dos de atrás, así que acelera sus 3 + 5 kg:', ecuacion: [T, ' = (3 + 5) · 6 = ', pj('48 N')] },
        { texto: 'Las otras salen de un error: 60 N, si igualas la cuerda a tu jalón; 20 N, si repartes en tres partes iguales; 12 N, si miras solo el de adelante, y 30 N, si miras solo el último.' },
      ],
      respuesta: [neg('C'), ', ', pj('48 N')] },
    { nivel: 3, titulo: 'La rampa y el balde',
      figura: est(figRampaPolea({ t1: '5 kg', t2: '5 kg', a: 'a = ?', textos: [{ x: 8, y: 22, texto: 'rampa lisa', ancla: 'start', peso: 400 }], alt: 'Un bloque de 5 kg en una rampa lisa de 37°, unido por una cuerda que pasa por una polea a un balde de 5 kg que cuelga.' })),
      enunciado: ['Un bloque de 5 kg está en una rampa lisa de 37°, unido por una cuerda que pasa por una polea en lo alto a un balde de 5 kg que cuelga. ¿Cuánto aceleran?'],
      alternativas: ['5 m/s²', '4 m/s²', '8 m/s²', '2 m/s²', '10 m/s²'],
      datos: [D.peso, D.rampa, D.trig, D.juntos, D4.sistema],
      solucion: [
        { texto: 'El balde tira del sistema con su peso, 50 N, y lo frena la parte del peso del bloque a lo largo de la rampa, P · sen 37°:', ecuacion: ['50 · ', frac('3', '5'), ' = 30 N'] },
        { texto: 'Lo que sobra a favor se divide entre todo el sistema, de 10 kg:', ecuacion: ['a = ', frac('50 − 30', '5 + 5'), ' = ', neg('2 m/s²')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si olvidas la rampa; ', neg('B'), ', si divides entre una sola masa; ', neg('C'), ', si sumas la parte del peso en vez de restarla, y ', neg('E'), ', si usas g.'] },
      ],
      respuesta: [neg('D'), ', ', neg('2 m/s²')] },
    { nivel: 3, titulo: 'La mesa áspera y su cuerda',
      figura: est(figMesa({ t1: '4 kg', t2: '6 kg', T1: 'T = ?', P2: 'P⃗', f1: 'f⃗_k', a: 'a⃗', alt: 'Un bloque de 4 kg sobre una mesa con rozamiento, unido a otro de 6 kg que cuelga.' })),
      enunciado: ['Un bloque de 4 kg desliza sobre una mesa con ', muk, ' = 0,25, unido por una cuerda a otro de 6 kg que cuelga de una polea. ¿Con qué fuerza jala la cuerda?'],
      alternativas: ['30 N', '60 N', '20 N', '24 N', '50 N'],
      datos: [D.peso, D.cin, D.juntos, D4.sistema, D4.bloque],
      solucion: [
        { texto: 'En el sistema, el peso del que cuelga mueve con 60 N y el rozamiento frena con 0,25 · 40 = 10 N; lo que sobra, entre la masa total:', ecuacion: ['a = ', frac('60 − 10', '4 + 6'), ' = 5 m/s²'] },
        { texto: 'Después, el que cuelga: baja acelerando, así que su peso le gana a la cuerda, y lo que sobra es su masa por la aceleración.', ecuacion: ['60 − ', T, ' = 6 · 5   →   ', T, ' = ', pj('30 N')] },
        { texto: ['Las otras salen de un error: ', neg('B'), ', si igualas la cuerda al peso; ', neg('C'), ', si olvidas el rozamiento en el bloque de la mesa; ', neg('D'), ', si lo olvidas en todo, y ', neg('E'), ', si das la fuerza neta del sistema.'] },
      ],
      respuesta: [neg('A'), ', ', pj('30 N')] },
  ];

  const COSAS4_AT = ['un costal', 'una caja', 'un bloque'];
  const planoIdea = {
    id: 'plano-y-polea',
    titulo: 'Bloques unidos por una cuerda',
    pregunta: '¿La cuerda jala con el peso del balde que cuelga?',
    temas: ['Bloques, poleas y planos inclinados'],
    pieza: 'fis-estatica',
    aprendizaje: 'Unidos por una cuerda tensa, los cuerpos aceleran juntos. La aceleración sale del sistema; la tensión, de un bloque, y no es un peso.',
    actividad: 'Unir con una cuerda un costal sobre la mesa y un balde que cuelga.',
    lee: {
      tarjetas: [
        { titulo: 'Unidos por la cuerda', texto: ['En la obra, un costal sobre una mesa y un balde que cuelga están unidos por una cuerda que pasa por una polea. Si la cuerda no se estira, cuando el balde baja 1 m, el costal avanza 1 m: se mueven juntos.'] },
        { titulo: 'Una cuerda ideal', texto: ['Una cuerda ideal no se estira y casi no pesa. La fuerza con que jala se llama tensión, ', T, ', y es la misma en sus dos puntas, también al pasar por una polea liviana: jala al costal hacia la polea y al balde hacia arriba.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia la masa del costal y la del balde, y mira cómo cambia la aceleración. Fíjate en que el costal y el balde siempre aceleran lo mismo, porque la cuerda tensa no los deja separarse.',
          dibujo: est(figMesa({ t1: 'costal', t2: 'balde', T1: 'T⃗', T2: 'T⃗', alt: 'El costal sobre la mesa y el balde que cuelga, unidos por una cuerda que jala igual en sus dos puntas.' })) },
      ],
    },
    ejemplos: EJEMPLOS_BLOQUES,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'En la obra, un costal sobre una mesa lisa está unido a un balde que cuelga de una polea. Cada kilogramo pesa 10 N.',
      mision: {
        texto: 'Haz que los dos aceleren justo 8 m/s².',
        // Una sola manera en la grilla: el costal de 1 kg con el balde de 4 kg.
        logrado: val => Math.abs(aMesa(val.m1, val.m2) - 8) < 1e-9,
        bien: '¡8 m/s²! Los 40 N del balde mueven 5 kg: casi cae libre.',
      },
      voz: '¿Cuánto mueve el balde? ¿Y si el costal pesa más?',
      leyenda: [
        { s: [vec(T)], t: 'tensión: lo que jala la cuerda' },
        { s: [vec(P)], t: 'peso del balde' },
        { s: [vec('a')], t: 'aceleración, flecha punteada: la misma en los dos' },
        { s: [sub('m', '1')], t: 'masa del costal' },
        { s: [sub('m', '2')], t: 'masa del balde' },
        { s: 't', t: 'tiempo: con ▶ el juego avanza solo' },
      ],
      controles: [
        { id: 'm1', etiqueta: 'Costal, m₁', min: 1, max: 8, paso: 1, inicio: 3, unidad: 'kg', decimales: 0 },
        { id: 'm2', etiqueta: 'Balde, m₂', min: 1, max: 4, paso: 1, inicio: 1, unidad: 'kg', decimales: 0 },
        { id: 't', etiqueta: 't', min: 0, max: 2, paso: 0.1, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 0.8, modo: 'repite' } },
      ],
      dibujo: juego4,
      // La lectura enuncia qué mueve a quién: el peso del balde, entre toda la masa.
      lectura: val => ['El balde pesa ', pp(N_(val.m2 * G)), ` y mueve ${val.m1 + val.m2} kg: ${f(aMesa(val.m1, val.m2))} m/s²`],
      resumen: { m1: 3, m2: 2, t: 1 },
      minimo: 3,
    },
    predice: {
      pregunta: 'En la mesa hay un costal de 3 kg y cuelga un balde de 2 kg. Juntos aceleran 4 m/s². ¿Con qué fuerza jala la cuerda?',
      datos: ['El costal tiene 3 kg y el balde, 2 kg.', 'Cada kilogramo pesa 10 N; la mesa no frena.', 'Juntos aceleran 4 m/s².'],
      opciones: [
        { id: 'c', texto: '12 N', correcta: true },
        { id: 'peso', texto: '20 N', error: 'PL-TPESO', siFuera: 'Pensaste que la cuerda jala con todo el peso del balde. El balde pesa 20 N, cierto, pero si la cuerda lo igualara, la fuerza neta sobre el balde sería cero y no bajaría acelerando.' },
        { id: 'neta', texto: '8 N', error: 'PL-NETA', siFuera: 'Bien la cuenta del balde, 2 · 4 = 8 N, pero esa es su fuerza neta: lo que sobra de su peso después de restarle la cuerda. La cuerda es lo que falta, 20 − 8.' },
        { id: 'mesa', texto: '30 N', error: 'PL-PESO-MESA', siFuera: 'Bien mirar el costal, pero usaste su peso, 30 N. Ese peso apunta hacia abajo y lo sostiene la mesa; de lado solo lo jala la cuerda, que debe darle a sus 3 kg los 4 m/s².' },
      ],
      dibujo: est(PRED4),
      revelar: est(REVELA4),
      coincide: 'Coincide: la cuerda solo tiene que acelerar al costal, 3 · 4 = 12 N. Es menos que el peso del balde.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: MIRA4,
      pasos: [
        { estado: { corte: 0 }, texto: 'La cuerda tensa une el costal y el balde, así que los dos aceleran juntos, a 4 m/s².' },
        { estado: { corte: 1 }, texto: 'Primero, el costal: la mesa no frena, así que de lado solo lo jala la cuerda, y esa tensión es su fuerza neta:', ecuacion: [T, ' = 3 · 4 = ', pj('12 N')] },
        { estado: { corte: 2 }, texto: 'Ahora, el balde: su peso lo jala hacia abajo y la cuerda hacia arriba, y la diferencia es su fuerza neta:', ecuacion: ['20 − ', T, ' = 2 · 4   →   ', T, ' = ', pj('12 N')] },
        { estado: { corte: 3 }, texto: 'Las dos cuentas dan lo mismo, 12 N: la cuerda jala menos que el peso del balde, y por eso el balde baja acelerando.' },
        { estado: { corte: 3 }, texto: 'Si miras los dos juntos, la tensión queda adentro y se anula: son un solo cuerpo de 5 kg movido por el peso del balde, 20 N.', ecuacion: ['a = 20 ÷ 5 = 4 m/s²'] },
      ],
    },
    regla: {
      texto: 'Los cuerpos unidos por una cuerda tensa aceleran juntos. Para la aceleración, mira todo el sistema: la tensión queda adentro, y lo que mueve menos lo que frena se divide entre la masa total. Para la tensión, haz el DCL de un solo bloque. Si el que cuelga baja acelerando, la cuerda jala menos que su peso.',
      ecuacion: ['a = ', frac('lo que mueve − lo que frena', 'm₁ + m₂')],
      condicion: 'la cuerda no se estira ni pesa y la polea no frena, así que la tensión es la misma de punta a punta; con una polea pesada o una cuerda que pesa, cada tramo jala distinto.',
      dibujo: est(REVELA4),
    },
    // Así se resuelve: la mesa lisa con su tensión (otras masas que «Ahora tú») y, en las semillas impares, la máquina de
    // Atwood con su aceleración.
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 1) {
          const c = elegir(() => { const m1 = r.de([5, 7, 9]), m2 = r.de([1, 3]), a = (m1 - m2) * G / (m1 + m2); return exacto(a) && { m1, m2, a }; });
          return {
            enunciado: [`En una máquina de Atwood cuelgan ${c.m1} kg de un lado y ${c.m2} kg del otro. Si se sueltan desde el reposo, ¿cuánto aceleran?`],
            datos: [D.peso, D.juntos, D4.sistema],
            dibujo: est(figAtwood({ t1: `${c.m1} kg`, t2: `${c.m2} kg`, P: 'P⃗', a: 'a = ?' })),
            pasos: [
              { tipo: 'pide', texto: 'Piden la aceleración de los dos bloques.' },
              { tipo: 'datos', texto: `Un lado: ${c.m1} kg, que pesa ${c.m1 * G} N. El otro: ${c.m2} kg, que pesa ${c.m2 * G} N.` },
              { tipo: 'regla', texto: 'Los dos bloques van juntos, así que se mira el sistema entero: el peso mayor tira hacia su lado y el menor, en contra. Lo que sobra a favor se divide entre toda la masa.', ecuacion: ['a = ', frac('lo que mueve − lo que frena', 'masa total')] },
              { tipo: 'cuentas', texto: 'La tensión queda adentro y no entra. Lo que mueve es la diferencia de pesos, y se divide entre las dos masas, porque las dos aceleran:', ecuacion: [`a = (${c.m1 * G} − ${c.m2 * G}) ÷ (${c.m1} + ${c.m2}) = `, neg(A_(c.a))] },
              { tipo: 'sentido', texto: 'Sale menos que g, 10 m/s², porque el bloque pesado no cae libre: tiene que arrastrar hacia arriba al liviano, que frena su caída.' },
            ],
            respuesta: [neg(A_(c.a))],
          };
        }
        const c = elegir(() => { const m1 = r.de([7, 9, 15]), m2 = r.de([1, 5]), a = m2 * G / (m1 + m2), Tv = m1 * a; return exacto(a) && exacto(Tv) && { m1, m2, a, Tv }; });
        return {
          enunciado: [`Una caja de ${c.m1} kg está sobre una mesa lisa, unida por una cuerda a un balde de ${c.m2} kg que cuelga de una polea. ¿Con qué fuerza jala la cuerda?`],
          datos: [D.peso, D.juntos, D4.sistema, D4.bloque],
          dibujo: est(figMesa({ t1: `${c.m1} kg`, t2: `${c.m2} kg`, T1: 'T = ?', P2: 'P⃗', a: 'a⃗', textos: [{ x: 8, y: 22, texto: 'mesa lisa', ancla: 'start', peso: 400 }] })),
          pasos: [
            { tipo: 'pide', texto: 'Piden la tensión de la cuerda.' },
            { tipo: 'datos', texto: `La caja: ${c.m1} kg, sobre la mesa lisa. El balde: ${c.m2} kg, que pesa ${c.m2 * G} N.` },
            { tipo: 'regla', texto: 'Se va en dos pasos: el sistema entero da la aceleración, porque la tensión queda adentro; después, el DCL de la caja da la tensión, que es lo único que la jala de lado.', ecuacion: ['a = ', frac('lo que mueve', 'masa total'), ';   ', T, ' = m · a'] },
            { tipo: 'cuentas', texto: `a = ${c.m2 * G} ÷ (${c.m1} + ${c.m2}) = ${f(c.a)} m/s², porque lo único que mueve al sistema es el peso del balde. La caja acelera eso, y de lado solo la jala la cuerda:`, ecuacion: [T, ` = ${c.m1} · ${f(c.a)} = `, pj(N_(c.Tv))] },
            { tipo: 'sentido', texto: `La cuerda jala menos que los ${c.m2 * G} N que pesa el balde, y eso tiene sentido: si jalara igual que su peso, el balde no bajaría acelerando.` },
          ],
          respuesta: [T, ' = ', pj(N_(c.Tv))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4;
        if (k === 0) {
          const ob = r.de(COSAS4_AT), pideT = sm % 8 >= 4;
          const c = elegir(() => { const m1 = r.de([2, 4, 6, 8, 12]), m2 = r.de([2, 4, 8]), a = m2 * G / (m1 + m2), Tv = m1 * a;
            return exacto(a) && exacto(Tv) && !(m1 === 3 && m2 === 2) && !(m1 === 4 * m2) && !(m1 === 6 && (m2 === 2 || m2 === 4)) && (pideT ? distintos(Tv, m2 * G, m2 * a, m1 * G) : distintos(a, G, m2 * G / m1, (m1 + m2) * G / m2)) && { m1, m2, a, Tv }; });
          const base = [`${mayus(ob)} de ${c.m1} kg está sobre una mesa lisa, unid${ob.startsWith('una') ? 'a' : 'o'} por una cuerda a un balde de ${c.m2} kg que cuelga de una polea. `];
          const dib = est(figMesa({ t1: `${c.m1} kg`, t2: `${c.m2} kg`, T1: pideT ? 'T = ?' : undefined, P2: 'P⃗', a: pideT ? 'a⃗' : 'a = ?', textos: [{ x: 8, y: 22, texto: 'mesa lisa', ancla: 'start', peso: 400 }] }));
          if (pideT) return {
            pregunta: [...base, '¿Con qué fuerza jala la cuerda?'], datos: [D.peso, D.juntos, D4.sistema, D4.bloque], dibujo: dib,
            opciones: opciones(c.Tv, [
              { id: 'peso', valor: c.m2 * G, error: 'PL-TPESO', siFuera: 'Bien mirar el balde, pero igualaste la cuerda a su peso. Si la cuerda jalara con todo su peso, la fuerza neta sobre el balde sería cero y no bajaría acelerando.' },
              { id: 'neta', valor: c.m2 * c.a, error: 'PL-NETA', siFuera: 'Bien la aceleración, pero multiplicaste la masa del balde por ella. Eso es la fuerza neta del balde, lo que sobra de su peso; la cuerda es lo que le falta a esa neta para llegar al peso.' },
              { id: 'mesa', valor: c.m1 * G, error: 'PL-PESO-MESA', siFuera: 'Bien mirar lo de la mesa, pero usaste su peso. Ese peso apunta hacia abajo y lo sostiene la mesa; de lado solo jala la cuerda, que es su masa por la aceleración.' },
            ], N_),
            solucion: { texto: 'El peso del balde mueve las dos masas y da la aceleración del sistema. Después, lo de la mesa: solo la cuerda lo jala de lado, así que la tensión es su masa por esa aceleración.', ecuacion: [`a = ${c.m2 * G} ÷ ${c.m1 + c.m2} = ${f(c.a)} m/s²;   `, T, ` = ${c.m1} · ${f(c.a)} = `, pj(N_(c.Tv))] },
          };
          return {
            pregunta: [...base, '¿Cuánto aceleran?'], datos: [D.peso, D.juntos, D4.sistema], dibujo: dib,
            opciones: opciones(c.a, [
              { id: 'g', valor: G, error: 'PL-G', siFuera: 'Así caería el balde solo, sin cuerda. Pero está atado y arrastra también lo de la mesa, así que su peso tiene que acelerar las dos masas y la aceleración sale menor que g.' },
              { id: 'm1', valor: c.m2 * G / c.m1, error: 'PL-M1', siFuera: 'Bien el peso del balde, pero lo dividiste solo entre la masa de la mesa. El balde también acelera, así que su peso mueve las dos masas: se divide entre la masa total.' },
              { id: 'inv', valor: (c.m1 + c.m2) * G / c.m2, error: 'PL-INV', siFuera: 'Bien usar la masa total, pero dividiste al revés. La aceleración es la fuerza entre la masa: el peso del balde dividido entre la masa total.' },
            ], A_),
            solucion: { texto: 'La mesa es lisa y la tensión queda adentro del sistema, así que lo único que mueve a los dos es el peso del balde; se divide entre las dos masas, porque las dos aceleran:', ecuacion: [`a = ${c.m2 * G} ÷ (${c.m1} + ${c.m2}) = `, neg(A_(c.a))] },
          };
        }
        if (k === 1) {
          const pideT = sm % 8 >= 4;
          const c = elegir(() => { const m1 = r.de([4, 6, 8, 9]), m2 = r.de([1, 2, 4]), a = (m1 - m2) * G / (m1 + m2), Tv = 2 * m1 * m2 * G / (m1 + m2);
            return m1 > m2 && exacto(a) && exacto(Tv) && !(m1 === 3 && m2 === 2) && !(m1 === 6 && m2 === 4) && (pideT ? distintos(Tv, m2 * G, m1 * G, (m1 + m2) * G / 2) : distintos(a, G, (m1 - m2) * G / m1, (m1 + m2) * G / (m1 - m2))) && { m1, m2, a, Tv }; });
          const base = [`En una máquina de Atwood cuelgan ${c.m1} kg de un lado y ${c.m2} kg del otro, y se sueltan. `];
          const dib = est(figAtwood({ t1: `${c.m1} kg`, t2: `${c.m2} kg`, P: 'P⃗', T: pideT ? 'T = ?' : undefined, a: pideT ? 'a⃗' : 'a = ?' }));
          if (pideT) return {
            pregunta: [...base, '¿Con qué fuerza jala la cuerda?'], datos: [D.peso, D.juntos, D4.sistema, D4.bloque], dibujo: dib,
            opciones: opciones(c.Tv, [
              { id: 'liv', valor: c.m2 * G, error: 'PL-TPESO', siFuera: 'Bien mirar el liviano, pero igualaste la cuerda a su peso. Ese bloque sube acelerando, así que la cuerda tiene que jalar más que su peso: su peso más su masa por la aceleración.' },
              { id: 'pes', valor: c.m1 * G, error: 'PL-TPESO2', siFuera: 'Bien mirar el pesado, pero igualaste la cuerda a su peso. Ese bloque baja acelerando, así que la cuerda jala menos que su peso; si lo igualara, no aceleraría.' },
              { id: 'prom', valor: (c.m1 + c.m2) * G / 2, error: 'PL-PROMEDIO', siFuera: 'Bien que la tensión está entre los dos pesos, pero no es su promedio. Sale del DCL de un bloque, y depende de las masas: con estos datos, queda más cerca del peso del liviano.' },
            ], N_),
            solucion: { texto: 'Primero, la aceleración del sistema, la diferencia de pesos entre la masa total. Después, el DCL del liviano: sube acelerando, así que la cuerda jala su peso más su masa por la aceleración.', ecuacion: [`a = ${f(c.a)} m/s²;   `, T, ` = ${c.m2} · (10 + ${f(c.a)}) = `, pj(N_(c.Tv))] },
          };
          return {
            pregunta: [...base, '¿Cuánto aceleran?'], datos: [D.peso, D.juntos, D4.sistema], dibujo: dib,
            opciones: opciones(c.a, [
              { id: 'g', valor: G, error: 'PL-G', siFuera: 'Así caería el pesado solo, sin cuerda. Pero está atado al otro bloque, que tira en contra y también hay que acelerar, así que la aceleración sale menor que g.' },
              { id: 'm1', valor: (c.m1 - c.m2) * G / c.m1, error: 'PL-M1', siFuera: 'Bien la diferencia de pesos, pero la dividiste solo entre un bloque. Esa diferencia mueve a los dos, que aceleran juntos, así que se divide entre la suma de las masas.' },
              { id: 'inv', valor: (c.m1 + c.m2) * G / (c.m1 - c.m2), error: 'PL-INV', siFuera: 'Bien usar las dos masas, pero dividiste al revés. La aceleración es fuerza entre masa: la diferencia de pesos va arriba y la suma de las masas, abajo.' },
            ], A_),
            solucion: { texto: 'El peso mayor tira hacia su lado y el menor en contra, así que mueve la diferencia de pesos; los dos bloques aceleran, y por eso se divide entre la masa total:', ecuacion: [`a = (${c.m1 * G} − ${c.m2 * G}) ÷ (${c.m1} + ${c.m2}) = `, neg(A_(c.a))] },
          };
        }
        if (k === 2) {
          const c = elegir(() => { const m1 = r.de([2, 3, 4, 5]), m2 = r.de([1, 3, 5, 6]), Fv = r.de([12, 24, 30, 36, 40]), a = Fv / (m1 + m2), Tv = m2 * a;
            return exacto(a) && exacto(Tv) && !(m1 === 2 && m2 === 4 && Fv === 30) && distintos(Tv, Fv, Fv / 2, m1 * a) && { m1, m2, Fv, a, Tv }; });
          return {
            pregunta: ['Jalas con ', pj(N_(c.Fv)), ` un carrito de ${c.m1} kg, que jala con una cuerda a otro de ${c.m2} kg, sobre un piso liso. ¿Con qué fuerza jala la cuerda entre los dos?`],
            datos: [D.juntos, D4.sistema, D4.bloque],
            dibujo: est(figTren({ ms: [c.m1, c.m2], F: `F = ${N_(c.Fv)}`, textos: [{ x: 8, y: 22, texto: 'piso liso; la cuerda del medio: ?', ancla: 'start', peso: 400 }] })),
            opciones: opciones(c.Tv, [
              { id: 'igual', valor: c.Fv, error: 'PL-IGUAL-F', siFuera: 'Igualaste la cuerda a tu jalón. Tu jalón acelera a los dos carritos, pero la cuerda del medio solo tiene que acelerar al de atrás, así que jala menos.' },
              { id: 'mitad', valor: c.Fv / 2, error: 'PL-MITAD', siFuera: 'Bien que es menos que tu jalón, pero no se reparte por mitades. La cuerda acelera solo al de atrás, así que jala según su masa: su masa por la aceleración de los dos.' },
              { id: 'delante', valor: c.m1 * c.a, error: 'PL-DELANTE', siFuera: 'Bien la aceleración, pero la multiplicaste por la masa del de adelante. La cuerda del medio no jala al de adelante, que lo jalas tú: jala al de atrás, así que va su masa.' },
            ], N_),
            solucion: { texto: 'Los dos juntos dan la aceleración: tu jalón entre la masa total. Después, el de atrás: solo lo jala la cuerda del medio, así que la tensión es su masa por esa aceleración.', ecuacion: [`a = ${c.Fv} ÷ ${c.m1 + c.m2} = ${f(c.a)} m/s²;   `, T, ` = ${c.m2} · ${f(c.a)} = `, pj(N_(c.Tv))] },
          };
        }
        // Nivel examen: la mesa áspera (tensión) o la Atwood que llega al piso (San Marcos 2026-I).
        if (sm % 8 >= 4) {
          const c = elegir(() => { const m1 = r.de([3, 5, 7, 8]), m2 = r.de([1, 2, 3]), h = r.de([0.5, 1, 2, 4]), a = (m1 - m2) * G / (m1 + m2), v = Math.sqrt(2 * a * h);
            return m1 > m2 && exacto(a) && exacto(v) && distintos(v, Math.sqrt(2 * G * h), 2 * a * h, Math.sqrt(a * h)) && !(m1 === 6 && m2 === 4) && { m1, m2, h, a, v }; });
          return {
            pregunta: [`En una máquina de Atwood cuelgan ${c.m1} kg y ${c.m2} kg. Se sueltan desde el reposo, con el de ${c.m1} kg a ${f(c.h)} m del piso. ¿Con qué rapidez llega al piso?`],
            datos: [D.peso, D.juntos, D4.sistema, D.mruv],
            opciones: opciones(c.v, [
              { id: 'g', valor: Math.sqrt(2 * G * c.h), error: 'PL-G', siFuera: 'Bien la fórmula de MRUV, pero usaste g como si cayera libre. El bloque está atado al otro, que lo frena, así que la aceleración es la del sistema, menor que g.' },
              { id: 'raiz', valor: 2 * c.a * c.h, error: 'PL-SIN-RAIZ', siFuera: 'Bien: 2 · a · d es la rapidez al cuadrado, v². Falta sacar la raíz cuadrada para tener la rapidez, en m/s.' },
              { id: 'dos', valor: Math.sqrt(c.a * c.h), error: 'PL-SIN-DOS', siFuera: 'Bien la aceleración del sistema, pero olvidaste el 2. Desde el reposo, la rapidez sale de v² = 2 · a · d, y el 2 va dentro de la raíz.' },
            ], v => `${f(v)} m/s`),
            solucion: { texto: 'Primero, la aceleración del sistema: la diferencia de pesos entre la masa total. Como parte del reposo y no dan el tiempo, la rapidez sale de v² = 2 · a · d:', ecuacion: [`a = ${f(c.a)} m/s²;   v = √(2 · ${f(c.a)} · ${f(c.h)}) = `, neg(`${f(c.v)} m/s`)] },
          };
        }
        const c = elegir(() => { const m1 = r.de([2, 4, 5, 10]), m2 = r.de([2, 3, 5, 6]), mu = r.de([0.1, 0.2, 0.5]), a = aMesa(m1, m2, mu), Tv = m2 * (G - a);
          return a > 0 && exacto(a) && exacto(Tv) && distintos(Tv, m2 * G, m1 * a, m2 * (G - m2 * G / (m1 + m2)), (m2 * G - mu * m1 * G)) && !(m1 === 4 && m2 === 6) && !(m1 === 5 && m2 === 3 && mu === 0.2) && { m1, m2, mu, a, Tv }; });
        return {
          pregunta: [`Un bloque de ${c.m1} kg desliza sobre una mesa con `, muk, ` = ${f(c.mu)}, unido por una cuerda a otro de ${c.m2} kg que cuelga de una polea. ¿Con qué fuerza jala la cuerda?`],
          datos: [D.peso, D.cin, D.juntos, D4.sistema, D4.bloque],
          dibujo: est(figMesa({ t1: `${c.m1} kg`, t2: `${c.m2} kg`, T1: 'T = ?', P2: 'P⃗', f1: 'f⃗_k', a: 'a⃗' })),
          opciones: opciones(c.Tv, [
            { id: 'peso', valor: c.m2 * G, error: 'PL-TPESO', siFuera: 'Bien mirar el que cuelga, pero igualaste la cuerda a su peso. Ese bloque baja acelerando, así que la cuerda jala menos que su peso; si lo igualara, no aceleraría.' },
            { id: 'sinroce', valor: c.m1 * c.a, error: 'PL-SIN-ROCE-T', siFuera: 'Bien la aceleración, pero en el DCL del de la mesa contaste solo la cuerda. Sobre ese bloque también actúa el rozamiento, en contra, así que la cuerda tiene que jalar más.' },
            { id: 'lisa', valor: c.m2 * (G - c.m2 * G / (c.m1 + c.m2)), error: 'PL-LISA', siFuera: 'Bien el DCL del que cuelga, pero sacaste la aceleración como si la mesa fuera lisa. El rozamiento frena al sistema, así que se resta del peso que cuelga antes de dividir.' },
            { id: 'neta', valor: c.m2 * G - c.mu * c.m1 * G, error: 'PL-NETA-SIS', siFuera: 'Bien: esa es la fuerza neta del sistema, lo que sobra después del rozamiento. Pero la tensión es una fuerza entre los dos bloques, y sale del DCL de uno solo.' },
          ], N_),
          solucion: { texto: 'En el sistema, el peso que cuelga mueve y el rozamiento frena; lo que sobra, entre la masa total, da la aceleración. Después, el que cuelga: la cuerda es su peso menos su masa por la aceleración.', ecuacion: [`a = (${c.m2 * G} − ${f(c.mu * c.m1 * G)}) ÷ ${c.m1 + c.m2} = ${f(c.a)} m/s²;   `, T, ` = ${c.m2} · (10 − ${f(c.a)}) = `, pj(N_(c.Tv))] },
        };
      },
    },
  };

  // ======================= 5: peso aparente (la balanza de baño dentro del ascensor) =======================
  // Cambia: la aceleración del ascensor (solo hacia arriba en el juego) · Permanece: tu masa de 50 kg · Progresa: lo que
  // marca la balanza · Se reserva: subir frenando (Predice) · Debe verse: N = m · (g + a); manda a, no v.
  const M5 = 50;
  // El ascensor con la balanza y la persona, y el DCL de la persona a la derecha. v: 1 (sube) o −1 (baja), al lado.
  function figAscensor(o) {
    const x = 104, piso = 214, objs = [{ tipo: 'ascensor', x, y: piso, w: 132, h: 176 }, { tipo: 'balanza', x, y: piso, w: 78, lectura: o.lectura },
      Object.assign({ tipo: 'persona', x, y: piso - 26, alto: 118, texto: o.masa || '' }, o.persona || {})];
    const fl = [];
    if (o.v) fl.push({ de: [22, o.v > 0 ? 150 : 110], ang: o.v > 0 ? 90 : 270, largo: o.largoV || 36, color: 'tinta', texto: o.tv || 'v⃗', rumbo: [0, o.v > 0 ? -1 : 1] });
    const d = o.fz ? dclCaja(o.fz, Object.assign({ cx: 252, cy: 122, titulo: 'DCL de la persona' }, o.dcl || {})) : { obj: [], fl: [], txt: [] };
    return { alto: 236, objetos: [...objs, ...d.obj], flechas: [...fl, ...d.fl], textos: [...d.txt, ...(o.textos || [])], alt: o.alt };
  }
  const juego5 = val => {
    const Nv = M5 * (G + val.a), v = val.a * (val.t || 0);
    return est(figAscensor({ lectura: N_(Nv), masa: '50 kg', v: v > 1e-9 ? 1 : 0, largoV: Math.min(44, 14 + v * 3), fz: { P: 500, N: Nv, tP: 'P⃗', tN: 'N⃗', adir: val.a > 0 ? 1 : 0, avert: true },
      textos: [{ x: 8, y: 228, texto: val.a > 0 ? `sube y acelera` : 'quieto', ancla: 'start', peso: 400 }],
      alt: `Una persona de 50 kg sobre una balanza en el ascensor, que ${val.a > 0 ? `sube con aceleración de ${val.a} m/s²` : 'está quieto'}: la balanza marca ${f(Nv)} N.` }));
  };
  const PRED5 = figAscensor({ lectura: '? N', masa: '50 kg', v: 1, fz: { P: 500, N: 1, tP: 'P = 500 N', tN: 'N = ?' }, textos: [{ x: 8, y: 228, texto: 'sube frenando', ancla: 'start', peso: 400 }],
    alt: 'El ascensor sube frenando; la persona de 50 kg está sobre la balanza, que marca un signo de pregunta.' });
  const REVELA5 = figAscensor({ lectura: '400 N', masa: '50 kg', v: 1, fz: { P: 500, N: 400, tP: 'P = 500 N', tN: 'N = 400 N', adir: -1, avert: true, ta: 'a = 2 m/s²' }, textos: [{ x: 8, y: 228, texto: 'sube frenando', ancla: 'start', peso: 400 }],
    alt: 'Sube frenando: la aceleración apunta hacia abajo y la balanza marca 400 N, menos que el peso.' });
  const corte5 = (v, adir, Nv, txt, ta) => { const d = figAscensor({ lectura: N_(Nv), masa: '50 kg', v, fz: { P: 500, N: Nv, tP: 'P = 500 N', tN: `N = ${N_(Nv)}`, adir, avert: true, ta }, textos: [{ x: 8, y: 228, texto: txt, ancla: 'start', peso: 400 }] });
    return { objetos: d.objetos, flechas: d.flechas, textos: d.textos }; };
  const MIRA5 = Object.assign(figAscensor({ masa: '50 kg' }), { alt: 'El ascensor sube frenando, baja frenando y cae: la balanza marca 400 N, 600 N y 0 N.',
    cortes: [corte5(1, -1, 400, 'sube frenando', 'a = 2 m/s²'), corte5(-1, 1, 600, 'baja frenando', 'a = 2 m/s²'), corte5(-1, -1, 0, 'cae: se cortó el cable', 'a = 10 m/s²')] });
  const D5 = {
    eje: 'Hacia arriba es positivo: a > 0 si la aceleración apunta hacia arriba, aunque el ascensor baje',
    vertical: ['Sobre la persona: ', N, ' − ', P, ' = m · a'],
    kilos: 'Una balanza de baño en kilos muestra la normal dividida entre 10',
  };

  // Ejemplos de la idea 5. Cuentas rehechas aparte (cuentas.js: suma con signo, hacia arriba positivo, N − P = m · a):
  // 60·10; 60·12; 60·10; 50·8; 0; 70·13; (550 − 500)/50; 200·10,5; 840/12; 60·12/10; 480 con cada movimiento;
  // 6/3 y 70·12 con cada alternativa; 2·4/2² y 80·12 con cada alternativa; 2·13 con cada alternativa; N = 0.
  const EJEMPLOS_ASCENSOR = [
    { nivel: 1, titulo: 'La balanza en el ascensor quieto',
      figura: est(figAscensor({ lectura: '? N', masa: '60 kg', fz: { P: 600, N: 1, tP: 'P⃗', tN: 'N = ?' }, textos: [{ x: 8, y: 228, texto: 'quieto', ancla: 'start', peso: 400 }], alt: 'Una persona de 60 kg sobre la balanza en un ascensor quieto.' })),
      enunciado: ['Una persona de 60 kg está sobre una balanza en un ascensor quieto. ¿Cuánto marca la balanza?'],
      datos: [D.peso, D5.vertical, D.balanza],
      solucion: [{ texto: 'El ascensor quieto no acelera, así que la fuerza neta es cero y la balanza iguala al peso:', ecuacion: [N, ' = 60 · 10 = ', pn('600 N')] }],
      respuesta: ['Marca ', pn('600 N')] },
    { nivel: 1, titulo: 'Arranca hacia arriba',
      figura: est(figAscensor({ lectura: '? N', masa: '60 kg', v: 1, fz: { P: 600, N: 1, tP: 'P⃗', tN: 'N = ?', adir: 1, avert: true, ta: 'a = 2 m/s²' }, textos: [{ x: 8, y: 228, texto: 'sube y acelera', ancla: 'start', peso: 400 }], alt: 'El ascensor arranca hacia arriba con 2 m/s²; la persona de 60 kg está sobre la balanza.' })),
      enunciado: ['El ascensor arranca hacia arriba con una aceleración de 2 m/s². ¿Cuánto marca la balanza bajo una persona de 60 kg?'],
      datos: [D.peso, D5.vertical, D.balanza, D5.eje],
      solucion: [{ texto: 'Arranca hacia arriba, así que la aceleración apunta hacia arriba y va con signo más, a = +2; la balanza empuja el peso y además esa aceleración:', ecuacion: [N, ' = 60 · (10 + 2) = ', pn('720 N')] }],
      respuesta: ['Marca ', pn('720 N')] },
    { nivel: 1, titulo: 'Subir a velocidad constante',
      figura: est(figAscensor({ lectura: '? N', masa: '60 kg', v: 1, tv: 'v = 3 m/s', fz: { P: 600, N: 1, tP: 'P⃗', tN: 'N = ?' }, textos: [{ x: 8, y: 228, texto: 'siempre a 3 m/s', ancla: 'start', peso: 400 }], alt: 'El ascensor sube siempre a 3 m/s con una persona de 60 kg sobre la balanza.' })),
      enunciado: ['El ascensor sube siempre a 3 m/s. ¿Cuánto marca la balanza bajo una persona de 60 kg?'],
      datos: [D.peso, D5.vertical, D.balanza],
      solucion: [{ texto: 'A velocidad constante, a = 0; la velocidad no cuenta, solo la aceleración, así que la balanza marca el peso:', ecuacion: [N, ' = 60 · (10 + 0) = ', pn('600 N')] }],
      respuesta: ['Marca ', pn('600 N'), ', como quieto'] },
    { nivel: 1, titulo: 'Baja acelerando',
      figura: est(figAscensor({ lectura: '? N', masa: '50 kg', v: -1, fz: { P: 500, N: 1, tP: 'P⃗', tN: 'N = ?', adir: -1, avert: true, ta: 'a = 2 m/s²' }, textos: [{ x: 8, y: 228, texto: 'baja y acelera', ancla: 'start', peso: 400 }], alt: 'El ascensor baja cada vez más rápido, con 2 m/s²; la persona de 50 kg está sobre la balanza.' })),
      enunciado: ['El ascensor baja cada vez más rápido, con una aceleración de 2 m/s². ¿Cuánto marca la balanza bajo una persona de 50 kg?'],
      datos: [D.peso, D5.vertical, D.balanza, D5.eje],
      solucion: [{ texto: 'Baja cada vez más rápido, así que la aceleración apunta hacia abajo y va con signo menos, a = −2; la balanza empuja menos que el peso:', ecuacion: [N, ' = 50 · (10 − 2) = ', pn('400 N')] }],
      respuesta: ['Marca ', pn('400 N')] },
    { nivel: 1, titulo: 'Si el cable se corta',
      figura: est(figAscensor({ lectura: '? N', masa: '50 kg', v: -1, fz: { P: 500, N: 1, tP: 'P⃗', tN: 'N = ?', adir: -1, avert: true, ta: 'a = 10 m/s²' }, textos: [{ x: 8, y: 228, texto: 'cae libre', ancla: 'start', peso: 400 }], alt: 'El ascensor cae libre con la persona sobre la balanza.' })),
      enunciado: ['Si se cortara el cable y el ascensor cayera libre, con a = 10 m/s² hacia abajo, ¿cuánto marcaría la balanza bajo una persona de 50 kg?'],
      datos: [D.peso, D5.vertical, D.balanza, D5.eje],
      solucion: [{ texto: 'Persona y balanza caen juntas, con g, y la balanza ya no tiene que empujar:', ecuacion: [N, ' = 50 · (10 − 10) = ', pn('0 N')] }],
      respuesta: ['Marcaría ', pn('0 N')] },
    { nivel: 2, titulo: 'Baja frenando',
      figura: est(figAscensor({ lectura: '? N', masa: '70 kg', v: -1, fz: { P: 700, N: 1, tP: 'P⃗', tN: 'N = ?' }, textos: [{ x: 8, y: 228, texto: 'baja y frena 3 m/s²', ancla: 'start', peso: 400 }], alt: 'El ascensor baja y frena; la persona de 70 kg está sobre la balanza.' })),
      enunciado: ['El ascensor baja y frena: cada segundo va 3 m/s más lento. ¿Cuánto marca la balanza bajo una persona de 70 kg?'],
      datos: [D.peso, D5.vertical, D.balanza, D5.eje],
      solucion: [
        { texto: 'Baja, pero frena: la velocidad apunta hacia abajo y la aceleración, hacia arriba. a = +3.' },
        { texto: 'Como la aceleración apunta hacia arriba, la balanza marca más que el peso:', ecuacion: [N, ' = 70 · (10 + 3) = ', pn('910 N')] },
      ],
      respuesta: ['Marca ', pn('910 N')] },
    { nivel: 2, titulo: 'La aceleración del ascensor',
      figura: est(figAscensor({ lectura: '550 N', masa: '50 kg', fz: { P: 500, N: 550, tP: 'P = 500 N', tN: 'N = 550 N' }, textos: [{ x: 8, y: 228, texto: 'a = ?', ancla: 'start' }], alt: 'Una persona de 50 kg sobre la balanza del ascensor, que marca 550 N.' })),
      enunciado: ['En un ascensor, la balanza marca 550 N bajo una persona de 50 kg. ¿Cuánto vale la aceleración del ascensor y hacia dónde apunta?'],
      datos: [D.peso, D5.vertical, D.balanza, D5.eje],
      solucion: [
        { texto: 'Sobre la persona, lo que marca la balanza menos su peso es la masa por la aceleración:', ecuacion: ['550 − 500 = 50 · a'] },
        { texto: 'Sale positiva, así que apunta hacia arriba: marca más que el peso.', ecuacion: ['a = ', frac('50', '50'), ' = ', neg('1 m/s²')] },
      ],
      respuesta: [neg('1 m/s²'), ', hacia arriba'] },
    { nivel: 2, titulo: 'La grúa que acelera',
      figura: est({ alto: 220, techo: { y: 12, x0: 60, x1: 200 }, objetos: [{ tipo: 'polea', c: [130, 30], r: 14 }, { tipo: 'cuerda', de: [130, 44], a: [130, 130] }, { tipo: 'caja', x: 130, y: 180, w: 70, h: 50, texto: '200 kg' }],
        flechas: [{ de: [150, 130], ang: 90, largo: LARGO_FIJO, color: 'o', texto: 'T = ?', rumbo: [1, 0] }, { de: [112, 180], ang: 270, largo: LARGO_FIJO, color: 'h', texto: 'P⃗', rumbo: [-1, 0] }, { de: [230, 150], ang: 90, largo: LARGO_FIJO, color: 'tinta', discontinua: true, texto: 'a = 0,5 m/s²', rumbo: [0, -1] }],
        alt: 'Una grúa sube con su cable un bloque de cemento de 200 kg que acelera hacia arriba 0,5 m/s².' }),
      enunciado: ['El cable de una grúa sube un bloque de cemento de 200 kg con una aceleración de 0,5 m/s² hacia arriba. ¿Con qué fuerza jala el cable?'],
      datos: [D.peso, D.segunda, D.eje],
      solucion: [
        { texto: 'Sobre el bloque tiran el cable, hacia arriba, y el peso, hacia abajo; su diferencia es la masa por la aceleración:', ecuacion: [T, ' − 2000 = 200 · 0,5'] },
        { texto: 'Al despejar, el cable resulta ser el peso más lo que hace falta para acelerar:', ecuacion: [T, ' = 2000 + 100 = ', pj('2100 N')] },
      ],
      respuesta: [T, ' = ', pj('2100 N')] },
    { nivel: 2, titulo: 'La masa desde la balanza',
      figura: est(figAscensor({ lectura: '840 N', masa: '? kg', v: 1, fz: { P: 1, N: 840, tP: 'P⃗', tN: 'N = 840 N', adir: 1, avert: true, ta: 'a = 2 m/s²' }, textos: [{ x: 8, y: 228, texto: 'sube y acelera', ancla: 'start', peso: 400 }], alt: 'El ascensor sube acelerando 2 m/s²; la balanza marca 840 N.' })),
      enunciado: ['El ascensor sube acelerando 2 m/s² y la balanza marca 840 N. ¿Qué masa tiene la persona?'],
      datos: [D.peso, D5.vertical, D.balanza, D5.eje],
      solucion: [
        { texto: 'La balanza marca la normal, N = m · (g + a), y la aceleración va con signo más porque apunta hacia arriba:', ecuacion: ['840 = m · (10 + 2)'] },
        { texto: 'Se despeja la masa dividiendo lo que marca entre g + a:', ecuacion: ['m = ', frac('840', '12'), ' = ', neg('70 kg')] },
      ],
      respuesta: [neg('m = 70 kg')] },
    { nivel: 2, titulo: 'Los kilos que marca',
      figura: est(figAscensor({ lectura: '? kg', masa: '60 kg', v: 1, fz: { P: 600, N: 1, tP: 'P⃗', tN: 'N⃗', adir: 1, avert: true, ta: 'a = 2 m/s²' }, textos: [{ x: 8, y: 228, texto: 'sube y acelera', ancla: 'start', peso: 400 }], alt: 'Una persona de 60 kg sobre una balanza de baño en kilos, en un ascensor que sube acelerando.' })),
      enunciado: ['Tu balanza de baño muestra kilos. Si tienes 60 kg y el ascensor sube acelerando 2 m/s², ¿qué número muestra?'],
      datos: [D.peso, D5.vertical, D5.kilos, D5.eje],
      solucion: [
        { texto: 'Primero, la normal, con la aceleración hacia arriba:', ecuacion: [N, ' = 60 · (10 + 2) = ', pn('720 N')] },
        { texto: 'Una balanza de baño está calibrada para la Tierra quieta: divide la normal entre 10 y muestra ese número como si fueran kilos.', ecuacion: [frac('720', '10'), ' = ', neg('72')] },
      ],
      respuesta: ['Muestra ', neg('72 kg'), ', aunque tu masa sigue siendo 60 kg'] },
    { nivel: 3, titulo: 'Qué hace el ascensor',
      figura: est(figAscensor({ lectura: '480 N', masa: '60 kg', fz: { P: 600, N: 480, tP: 'P = 600 N', tN: 'N = 480 N' }, alt: 'Una persona de 60 kg sobre la balanza del ascensor, que marca 480 N.' })),
      enunciado: ['En un ascensor, la balanza marca 480 N bajo una persona de 60 kg. ¿Qué puede estar haciendo el ascensor?'],
      alternativas: ['Sube frenando o baja acelerando, con 2 m/s²', 'Sube acelerando, con 2 m/s²', 'Baja a velocidad constante', 'Baja frenando, con 2 m/s²', 'Sube acelerando, con 8 m/s²'],
      datos: [D.peso, D5.vertical, D.balanza, D5.eje],
      solucion: [
        { texto: 'Sobre la persona, lo que marca la balanza menos su peso es la masa por la aceleración:', ecuacion: ['480 − 600 = 60 · a   →   a = −2 m/s²'] },
        { texto: 'La aceleración sale negativa, así que apunta hacia abajo. Eso pasa de dos maneras: si sube frenando o si baja cada vez más rápido.' },
        { texto: ['Las otras salen de un error: ', neg('B'), ' y ', neg('D'), ' tienen la aceleración hacia arriba; ', neg('C'), ' no acelera, y marcaría el peso, y ', neg('E'), ' toma 480 ÷ 60 como aceleración.'] },
      ],
      respuesta: [neg('A')] },
    { nivel: 3, titulo: 'La normal al subir acelerando',
      figura: est(figAscensor({ lectura: '? N', masa: '70 kg', v: 1, fz: { P: 700, N: 1, tP: 'P⃗', tN: 'N = ?', adir: 1, avert: true }, textos: [{ x: 8, y: 228, texto: 'de 0 a 6 m/s en 3 s', ancla: 'start', peso: 400 }], alt: 'Un ascensor que sube y pasa de 0 a 6 m/s en 3 s, con una persona de 70 kg sobre la balanza.' })),
      enunciado: ['Un ascensor parte del reposo hacia arriba y llega a 6 m/s en 3 s, acelerando parejo. ¿Con qué fuerza empuja el piso a una persona de 70 kg?'],
      alternativas: ['560 N', '700 N', '840 N', '140 N', '910 N'],
      datos: [D.peso, D5.vertical, D.mruvT, D5.eje],
      solucion: [
        { texto: 'Primero, la aceleración: cuánto cambia la velocidad en cada segundo.', ecuacion: ['a = ', frac('6 − 0', '3'), ' = 2 m/s², hacia arriba'] },
        { texto: 'La aceleración apunta hacia arriba, así que el piso empuja el peso y además esa aceleración:', ecuacion: [N, ' = 70 · (10 + 2) = ', pn('840 N')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si restas la aceleración; ', neg('B'), ', si das el peso; ', neg('D'), ', si das solo m · a, y ', neg('E'), ', si usas 6 ÷ 2 = 3 m/s².'] },
      ],
      respuesta: [neg('C'), ', ', pn('840 N')] },
    { nivel: 3, titulo: 'La cuerda de la grúa',
      figura: est({ alto: 220, techo: { y: 12, x0: 60, x1: 200 }, objetos: [{ tipo: 'polea', c: [130, 30], r: 14 }, { tipo: 'cuerda', de: [130, 44], a: [130, 130] }, { tipo: 'caja', x: 130, y: 180, w: 70, h: 50, texto: '80 kg' }],
        flechas: [{ de: [150, 130], ang: 90, largo: LARGO_FIJO, color: 'o', texto: 'T = ?', rumbo: [1, 0] }, { de: [112, 180], ang: 270, largo: LARGO_FIJO, color: 'h', texto: 'P⃗', rumbo: [-1, 0] }],
        textos: [{ x: 312, y: 200, texto: 'parte del reposo: 4 m en 2 s', ancla: 'end', peso: 400 }], alt: 'Una grúa sube un bloque de 80 kg que parte del reposo y sube 4 m en 2 s.' }),
      enunciado: ['Una grúa sube un bloque de 80 kg desde el reposo, con aceleración constante: sube 4 m en 2 s. ¿Con qué fuerza jala la cuerda?'],
      alternativas: ['800 N', '640 N', '160 N', '960 N', '1120 N'],
      datos: [D.peso, D.segunda, D.reposo, D.eje],
      solucion: [
        { texto: 'Parte del reposo, así que la aceleración sale de d = a · t² / 2:', ecuacion: ['a = ', frac('2 · 4', '2²'), ' = 2 m/s²'] },
        { texto: 'Sobre el bloque, la cuerda jala su peso más la masa por la aceleración, que apunta hacia arriba:', ecuacion: [T, ' = 80 · (10 + 2) = ', pj('960 N')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si das el peso; ', neg('B'), ', si restas la aceleración; ', neg('C'), ', si das solo m · a, y ', neg('E'), ', si tomas la rapidez final, 4 m/s, como aceleración.'] },
      ],
      respuesta: [neg('D'), ', ', pj('960 N')] },
    { nivel: 3, titulo: 'La pesa en el dinamómetro',
      figura: est({ alto: 236, objetos: [{ tipo: 'ascensor', x: 120, y: 214, w: 150, h: 176 }, { tipo: 'gancho', x: 120, y: 40 }, { tipo: 'resorte', de: [120, 62], a: [120, 120], vueltas: 8 }, { tipo: 'bolsa', x: 120, y: 120, w: 44, h: 32, texto: '2 kg' }],
        flechas: [{ de: [26, 110], ang: 270, largo: 36, color: 'tinta', texto: 'v⃗', rumbo: [0, 1] }], textos: [{ x: 8, y: 228, texto: 'baja y frena 3 m/s²', ancla: 'start', peso: 400 }, { x: 206, y: 56, texto: 'marca: ?', ancla: 'start' }],
        alt: 'Una pesa de 2 kg colgada de un dinamómetro dentro de un ascensor que baja y frena.' }),
      enunciado: ['En un ascensor que baja y frena 3 m/s², una pesa de 2 kg cuelga de un dinamómetro sujeto al techo. ¿Cuánto marca el dinamómetro?'],
      alternativas: ['20 N', '14 N', '6 N', '0 N', '26 N'],
      datos: [D.peso, D.segunda, D5.eje],
      solucion: [
        { texto: 'Baja frenando, así que la aceleración apunta hacia arriba, contra la velocidad: a = +3.' },
        { texto: 'Sobre la pesa, el resorte jala hacia arriba y el peso hacia abajo; el resorte jala el peso más la masa por la aceleración:', ecuacion: [F, ' = 2 · (10 + 3) = ', pj('26 N')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si das el peso; ', neg('B'), ', si restas la aceleración; ', neg('C'), ', si das solo m · a, y ', neg('D'), ', si crees que cae libre.'] },
      ],
      respuesta: [neg('E'), ', ', pj('26 N')] },
    { nivel: 3, titulo: 'Que la balanza marque cero',
      figura: est(figAscensor({ lectura: '0 N', masa: '50 kg', fz: { P: 500, tP: 'P⃗', tN: 'N = 0' }, alt: 'Una persona sobre la balanza del ascensor, que marca 0 N.' })),
      enunciado: ['¿Cómo tiene que moverse un ascensor para que la balanza marque 0 N bajo una persona de 50 kg?'],
      alternativas: ['Con 10 m/s², hacia arriba', 'Con 10 m/s², hacia abajo', 'A velocidad constante', 'Con 5 m/s², hacia abajo', 'De ninguna forma: siempre marca el peso'],
      datos: [D.peso, D5.vertical, D.balanza, D5.eje],
      solucion: [
        { texto: 'Que la balanza marque cero quiere decir que N = 0, así que la única fuerza es el peso:', ecuacion: ['0 − 500 = 50 · a   →   a = −10 m/s²'] },
        { texto: 'La aceleración es g, hacia abajo: el ascensor cae como si nada lo sostuviera, y la balanza cae con la persona sin empujarla.' },
        { texto: ['Las otras salen de un error: ', neg('A'), ' tiene el signo al revés; ', neg('C'), ' marcaría el peso; ', neg('D'), ' usa la mitad de g, y ', neg('E'), ' olvida que la balanza mide la normal.'] },
      ],
      respuesta: [neg('B')] },
  ];

  const PERSONAS5_AT = [55, 60, 65, 80];
  const ascensorIdea = {
    id: 'ascensor-y-marcos',
    titulo: 'Peso aparente en el ascensor',
    pregunta: '¿Qué marca tu balanza en un ascensor que frena?',
    temas: ['Movimiento relativo y sistemas inerciales'],
    pieza: 'fis-estatica',
    aprendizaje: 'La balanza marca la normal: N = m·(g + a), con a positiva hacia arriba. Manda el sentido de la aceleración, no el del viaje.',
    actividad: 'Pararte en una balanza dentro de un ascensor que arranca.',
    lee: {
      tarjetas: [
        { titulo: 'Lo que marca la balanza', texto: ['Como viste en Estática, una balanza no mide tu masa: mide cuánto la aprietas. Por la tercera ley, ella te empuja hacia arriba con esa misma fuerza, la normal ', N, '. A esa lectura se le llama peso aparente, porque es lo que sientes que pesas, y puede no coincidir con tu peso.'] },
        { titulo: 'Viajar y acelerar', texto: 'En un ascensor hay dos cosas distintas: hacia dónde viaja, que es su velocidad, y si esa velocidad crece o baja, que es su aceleración. Un ascensor puede subir y estar frenando a la vez. Aquí, todo lo que apunta hacia arriba es positivo, y lo que apunta hacia abajo, negativo.' },
        { titulo: 'Qué mirar al jugar', texto: ['El ascensor arranca hacia arriba, cada vez más rápido. Elige su aceleración y compara lo que marca la balanza con tu peso, 500 N, que es lo que marcaría si el ascensor estuviera quieto.'],
          dibujo: est(figAscensor({ lectura: '500 N', masa: '50 kg', fz: { P: 500, N: 500, tP: 'P⃗', tN: 'N⃗' }, alt: 'Una persona de 50 kg sobre la balanza en un ascensor quieto: marca 500 N.' })) },
      ],
    },
    ejemplos: EJEMPLOS_ASCENSOR,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'Te paras en una balanza dentro del ascensor. Tu masa es 50 kg y cada kilogramo pesa 10 N. El ascensor arranca hacia arriba.',
      mision: {
        texto: 'Haz que la balanza marque justo 650 N.',
        logrado: val => Math.abs(M5 * (G + val.a) - 650) < 1e-9,
        bien: '¡650 N! El piso te empuja 150 N más que tu peso: eso te acelera.',
      },
      voz: 'Acelera hacia arriba. ¿Marca más o menos que tu peso?',
      leyenda: [
        { s: [vec(N)], t: 'la balanza te empuja hacia arriba' },
        { s: [vec(P)], t: 'tu peso, 500 N' },
        { s: [vec('a')], t: 'aceleración del ascensor, flecha punteada' },
        { s: [vec('v')], t: 'velocidad del ascensor' },
        { s: 'pantalla', t: 'lo que marca la balanza: la normal' },
        { s: 't', t: 'tiempo: con ▶ el juego avanza solo' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Aceleración, a', min: 0, max: 4, paso: 1, inicio: 0, unidad: 'm/s²', decimales: 0 },
        { id: 't', etiqueta: 't', min: 0, max: 3, paso: 0.1, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: juego5,
      // La lectura enuncia la relación entre lo que marca y el peso.
      lectura: val => (val.a === 0 ? ['Marca ', pn('500 N'), ': lo mismo que tu peso'] : ['Marca ', pn(N_(M5 * (G + val.a))), `: ${f(M5 * val.a)} N más que tu peso`]),
      resumen: { a: 2, t: 1.5 },
      minimo: 3,
    },
    predice: {
      pregunta: 'Cerca del último piso, el ascensor sube frenando: cada segundo va 2 m/s más lento. ¿Cuánto marca la balanza?',
      datos: ['Tu masa es 50 kg.', 'Cada kilogramo pesa 10 N.', 'El ascensor sube; cada segundo va 2 m/s más lento.'],
      opciones: [
        { id: 'c', texto: '400 N', correcta: true },
        { id: 'signo', texto: '600 N', error: 'AS-SIGNO', siFuera: 'Elegiste por el viaje: el ascensor sube, cierto. Pero va frenando, así que su aceleración apunta hacia abajo, contra la velocidad; la balanza empuja menos que tu peso, y eso resta.' },
        { id: 'peso', texto: '500 N', error: 'N-MG', siFuera: 'Así marcaría quieto o a velocidad constante, porque entonces no hay aceleración. Pero aquí frena: su velocidad cambia 2 m/s cada segundo, y la balanza ya no iguala tu peso.' },
        { id: 'ma', texto: '100 N', error: 'AS-MA', siFuera: 'Bien la cuenta 50 · 2 = 100 N, pero esa es solo la fuerza neta sobre ti. La balanza, además de darte esa aceleración, también sostiene tu peso, así que hay que juntar las dos cosas.' },
      ],
      dibujo: est(PRED5),
      revelar: est(REVELA5),
      coincide: 'Coincide: al frenar subiendo, la aceleración apunta hacia abajo y la balanza marca menos que tu peso.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: MIRA5,
      pasos: [
        { estado: { corte: 0 }, texto: 'Sube frenando, así que la aceleración, de 2 m/s², apunta hacia abajo, contra la velocidad. Como hacia arriba es positivo, lleva signo menos:', ecuacion: ['a = −2 m/s²'] },
        { estado: { corte: 0 }, texto: 'Sobre ti actúan dos fuerzas: la balanza, que empuja hacia arriba, y tu peso, hacia abajo. Su diferencia es la fuerza neta:', ecuacion: [N, ' − ', P, ' = m · a'] },
        { estado: { corte: 0 }, texto: 'Con los números, la balanza marca menos que tu peso: solo tiene que empujar lo justo para que frenes con el ascensor.', ecuacion: [N, ' = 50 · (10 − 2) = ', pn('400 N')] },
        { estado: { corte: 1 }, texto: 'Si el ascensor baja frenando, la aceleración apunta hacia arriba, contra la velocidad, y la balanza marca más que tu peso:', ecuacion: [N, ' = 50 · (10 + 2) = ', pn('600 N')] },
        { estado: { corte: 2 }, texto: 'Si el cable se corta, tú y la balanza caen juntos con g, y la balanza ya no te empuja: marca cero. Eso es la ingravidez, aunque tu peso siga ahí.', ecuacion: [N, ' = 50 · (10 − 10) = ', pn('0 N')] },
      ],
    },
    regla: {
      texto: 'La balanza marca la normal, no el peso. Con hacia arriba positivo, la normal menos el peso es la masa por la aceleración: marca más que el peso si la aceleración apunta hacia arriba, y menos si apunta hacia abajo. Lo que decide es hacia dónde apunta la aceleración, no hacia dónde viaja el ascensor.',
      ecuacion: [N, ' = m · (', g, ' + a)'],
      condicion: 'se mira desde el edificio, que es un sistema inercial porque no acelera, y no desde el ascensor; a velocidad constante, suba o baje, la balanza marca el peso.',
      dibujo: est(REVELA5),
    },
    // Así se resuelve: la balanza en un ascensor que sube acelerando o baja frenando (otras masas que «Ahora tú») y, en
    // las semillas impares, el cable del montacargas.
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 1) {
          const M = r.de([400, 500, 600]), a = r.de([1, 1.5, 2]), baja = sm % 4 === 3, Tv = M * (G + a);
          return {
            enunciado: [`Un montacargas, con todo lo que lleva, tiene ${M} kg. ${baja ? 'Baja y frena' : 'Sube y acelera'} con ${f(a)} m/s². ¿Con qué fuerza jala el cable?`],
            datos: [D.peso, D.segunda, D5.eje],
            dibujo: est({ alto: 236, objetos: [{ tipo: 'ascensor', x: 140, y: 214, w: 150, h: 160 }, { tipo: 'caja', x: 140, y: 214, w: 90, h: 50, texto: `${M} kg` }],
              flechas: [{ de: [150, 54], ang: 90, largo: LARGO_FIJO, color: 'o', texto: 'T = ?', rumbo: [1, 0] }, { de: [26, baja ? 110 : 150], ang: baja ? 270 : 90, largo: 36, color: 'tinta', texto: 'v⃗', rumbo: [0, baja ? 1 : -1] },
                { de: [244, 150], ang: 90, largo: LARGO_FIJO, color: 'tinta', discontinua: true, texto: 'a⃗', rumbo: [1, 0] }] }),
            pasos: [
              { tipo: 'pide', texto: 'Piden la tensión del cable.' },
              { tipo: 'datos', texto: `Masa: ${M} kg. ${baja ? 'Baja y frena: la aceleración apunta hacia arriba' : 'Sube y acelera: la aceleración apunta hacia arriba'}, a = +${f(a)} m/s².` },
              { tipo: 'regla', texto: 'Sobre el montacargas actúan el cable, hacia arriba, y el peso, hacia abajo. Con hacia arriba positivo, su diferencia es la masa por la aceleración:', ecuacion: [T, ' − ', P, ' = m · a'] },
              { tipo: 'cuentas', texto: 'La aceleración apunta hacia arriba, así que va con signo más. Se despeja la tensión: el peso más la masa por la aceleración, T = m · (g + a).', ecuacion: [T, ` = ${M} · (10 + ${f(a)}) = `, pj(N_(Tv))] },
              { tipo: 'sentido', texto: `El cable jala más que el peso, ${M * G} N, porque la aceleración apunta hacia arriba${baja ? ', aunque el montacargas baje: frenar al bajar también pide más fuerza' : ''}.` },
            ],
            respuesta: [T, ' = ', pj(N_(Tv))],
          };
        }
        const baja = sm % 4 === 2, { m, a } = elegir(() => { const m = r.de([45, 70, 75]), a = r.de([1, 3]); return !(baja && m === 70 && a === 3) && { m, a }; }), Nv = m * (G + a);
        return {
          enunciado: [`Una persona de ${m} kg está sobre una balanza en un ascensor que ${baja ? 'baja y frena' : 'sube y acelera'} con ${a} m/s². ¿Cuánto marca la balanza?`],
          datos: [D.peso, D5.vertical, D.balanza, D5.eje],
          dibujo: est(figAscensor({ lectura: '? N', masa: `${m} kg`, v: baja ? -1 : 1, fz: { P: m * G, N: 1, tP: 'P⃗', tN: 'N = ?', adir: 1, avert: true, ta: `a = ${a} m/s²` }, textos: [{ x: 8, y: 228, texto: baja ? 'baja y frena' : 'sube y acelera', ancla: 'start', peso: 400 }] })),
          pasos: [
            { tipo: 'pide', texto: 'Piden lo que marca la balanza: la normal.' },
            { tipo: 'datos', texto: `Masa: ${m} kg; peso: ${m * G} N. ${baja ? 'Baja, pero frena' : 'Sube y acelera'}: la aceleración apunta hacia arriba, a = +${a} m/s².` },
            { tipo: 'regla', texto: 'Sobre la persona actúan la balanza, hacia arriba, y su peso, hacia abajo. Con hacia arriba positivo, su diferencia es la masa por la aceleración:', ecuacion: [N, ' − ', P, ' = m · a'] },
            { tipo: 'cuentas', texto: 'La aceleración apunta hacia arriba, así que va con signo más. Se despeja la normal: el peso más la masa por la aceleración, N = m · (g + a).', ecuacion: [N, ` = ${m} · (10 + ${a}) = `, pn(N_(Nv))] },
            { tipo: 'sentido', texto: `Marca más que el peso, ${m * G} N, porque la balanza, además de sostener a la persona, tiene que darle una aceleración hacia arriba.` },
          ],
          respuesta: ['Marca ', pn(N_(Nv))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4, m = r.de(PERSONAS5_AT);
        const SITU_ARRIBA = ['sube y acelera', 'baja y frena'], SITU_ABAJO = ['sube y frena', 'baja y acelera'];
        if (k === 0 || k === 1) {
          const arriba = k === 0, que = (arriba ? SITU_ARRIBA : SITU_ABAJO)[Math.floor(sm / 4) % 2];
          const a = elegir(() => { const x = r.de([1, 2, 3, 4]); return !(m === 50 && x === 2) && !(m === 60 && x === 2 && que === 'sube y acelera') && x; }), Nv = m * (G + (arriba ? a : -a)), Ninv = m * (G + (arriba ? -a : a));
          return {
            pregunta: [`Una persona de ${m} kg está sobre una balanza en un ascensor que ${que} con ${a} m/s². ¿Cuánto marca la balanza?`],
            datos: [D.peso, D5.vertical, D.balanza, D5.eje],
            dibujo: est(figAscensor({ lectura: '? N', masa: `${m} kg`, v: que.startsWith('sube') ? 1 : -1, fz: { P: m * G, N: 1, tP: 'P⃗', tN: 'N = ?' }, textos: [{ x: 8, y: 228, texto: que, ancla: 'start', peso: 400 }] })),
            opciones: opciones(Nv, [
              { id: 'signo', valor: Ninv, error: 'AS-SIGNO', siFuera: arriba ? 'Bien usar la aceleración, pero la restaste. Aquí apunta hacia arriba, así que la balanza tiene que empujar más que el peso: se suma a g.' : 'Bien usar la aceleración, pero la sumaste. Aquí apunta hacia abajo, así que la balanza empuja menos que el peso: se resta de g.' },
              { id: 'peso', valor: m * G, error: 'N-MG', siFuera: 'Así marcaría quieto o a velocidad constante. Pero aquí la velocidad cambia, así que hay aceleración, y la balanza ya no iguala el peso.' },
              { id: 'ma', valor: m * a, error: 'AS-MA', siFuera: 'Bien la cuenta m · a, pero esa es solo la fuerza neta. La balanza también sostiene el peso de la persona, así que marca el peso más o menos esa neta.' },
            ], N_),
            solucion: { texto: `${mayus(que)}, así que la aceleración apunta hacia ${arriba ? 'arriba' : 'abajo'}: a = ${arriba ? '+' : '−'}${a} m/s². La balanza marca la normal, N = m · (g + a):`, ecuacion: [N, ` = ${m} · (10 ${arriba ? '+' : '−'} ${a}) = `, pn(N_(Nv))] },
          };
        }
        if (k === 2) {
          // La grúa (San Marcos 2027-I): la cuerda que sube un bloque acelerando.
          const mc = r.de([50, 120, 150, 300]), a = r.de([0.5, 1, 2, 2.5]), Tv = mc * (G + a);
          return {
            pregunta: [`El cable de una grúa sube un bloque de ${mc} kg con una aceleración de ${f(a)} m/s² hacia arriba. ¿Con qué fuerza jala el cable?`],
            datos: [D.peso, D.segunda, D.eje],
            opciones: opciones(Tv, [
              { id: 'resta', valor: mc * (G - a), error: 'AS-SIGNO', siFuera: 'Bien usar la aceleración, pero la restaste. Apunta hacia arriba, así que el cable tiene que jalar más que el peso: el peso más la masa por la aceleración.' },
              { id: 'peso', valor: mc * G, error: 'N-MG', siFuera: 'Así jalaría si subiera a velocidad constante. Pero el bloque acelera hacia arriba, y para eso el cable tiene que jalar más que su peso.' },
              { id: 'ma', valor: mc * a, error: 'AS-MA', siFuera: 'Bien la cuenta m · a, pero esa es solo la fuerza neta. El cable, además de acelerar el bloque, sostiene su peso, así que hay que sumarle el peso.' },
            ], N_),
            solucion: { texto: 'Sobre el bloque tiran el cable, hacia arriba, y el peso, hacia abajo. Con hacia arriba positivo, el cable es el peso más la masa por la aceleración:', ecuacion: [T, ` = ${mc} · (10 + ${f(a)}) = `, pj(N_(Tv))] },
          };
        }
        // Nivel examen: de lo que marca, qué hace el ascensor (San Marcos 2023-I).
        const sube = sm % 8 < 4, a = elegir(() => { const x = r.de([1, 2, 3, 4]); return !(m === 60 && x === 2 && !sube) && x; }), Nv = m * (G + (sube ? a : -a));
        const bien = sube ? `Sube acelerando o baja frenando, con ${a} m/s²` : `Sube frenando o baja acelerando, con ${a} m/s²`;
        return {
          pregunta: [`En un ascensor, la balanza marca `, pn(N_(Nv)), ` bajo una persona de ${m} kg. ¿Qué puede estar haciendo el ascensor?`],
          datos: [D.peso, D5.vertical, D.balanza, D5.eje],
          opciones: opciones(0, [
            { id: 'signo', texto: sube ? `Sube frenando o baja acelerando, con ${a} m/s²` : `Sube acelerando o baja frenando, con ${a} m/s²`, error: 'AS-SIGNO', siFuera: 'Bien el valor de la aceleración, pero el signo está al revés. La balanza marca más que el peso, así que la aceleración apunta hacia arriba: sube acelerando o baja frenando.' },
            { id: 'v', texto: sube ? 'Sube a velocidad constante' : 'Baja a velocidad constante', error: 'AS-V', siFuera: 'A velocidad constante no hay aceleración, y la balanza marcaría el peso exacto. Aquí marca otra cosa, así que el ascensor tiene que estar acelerando.' },
            { id: 'g', texto: `${sube ? 'Sube acelerando' : 'Baja acelerando'}, con ${f(Nv / m)} m/s²`, error: 'AS-G', siFuera: 'Bien dividir entre la masa, pero dividiste lo que marca la balanza. Eso da g + a, no la aceleración: falta restar g, o restar primero el peso.' },
          ], () => '', bien),
          solucion: { texto: 'De N − P = m · a: lo que marca de más o de menos respecto al peso, dividido entre la masa, es la aceleración, con su signo.', ecuacion: [`a = (${f(Nv)} − ${m * G}) ÷ ${m} = ${sube ? '+' : '−'}${a} m/s²`] },
        };
      },
    },
  };

  // ======================= 6: dinámica circular (el auto en la cima de una loma) =======================
  // Cambia: la rapidez del auto · Permanece: la loma de 20 m de radio y el auto de 1000 kg · Progresa: la normal, que
  // baja cuando sube la rapidez · Se reserva: el fondo de una hondonada (Predice) · Debe verse: la suma de las fuerzas
  // apunta al centro y vale m · v²/r; aquí el peso le gana a la normal.
  // Lienzo: la pista (un arco de 40°) a la izquierda, con el centro de la curva fuera del dibujo, y el DCL del auto a la derecha.
  const M6 = 1000, R6 = 20;
  function figLoma(o) {
    const cx = 130, loma = o.forma !== 'hondonada', r = 230, c = loma ? [cx, 120 + r] : [cx, 196 - r], yAuto = loma ? 120 : 196;
    const objs = [{ tipo: 'pista', forma: loma ? 'loma' : 'hondonada', c, r, de: loma ? 70 : 250, a: loma ? 110 : 290 }, Object.assign({ tipo: 'auto', x: cx, y: yAuto, w: 78 }, o.auto || {})];
    const fl = [], tx = [...(o.textos || [])];
    if (o.v) fl.push({ de: [cx - 50, yAuto - 42], ang: 0, largo: o.largoV || 36, color: 'tinta', texto: o.tv || 'v⃗', rumbo: [1, -0.3] });
    const lin = loma ? [{ de: [cx, yAuto + 6], a: [cx, 222] }] : [{ de: [cx, yAuto - 38], a: [cx, 30] }];
    tx.push(loma ? { x: cx - 6, y: 214, texto: o.tr || 'hacia el centro ↓', ancla: 'end', peso: 400 } : { x: cx + 6, y: 40, texto: o.tr || 'hacia el centro ↑', ancla: 'start', peso: 400 });
    const d = o.fz ? dclCaja(o.fz, Object.assign({ cx: 262, cy: 118, titulo: 'DCL del auto' }, o.dcl || {})) : { obj: [], fl: [], txt: [] };
    return { alto: 236, objetos: [...objs, ...d.obj], flechas: [...fl, ...d.fl], lineas: lin, textos: [...d.txt, ...tx], alt: o.alt };
  }
  const N6 = v => M6 * (G - v * v / R6);
  // La rapidez que se lee (una cifra decimal): con el control en marcha, la lectura y el dibujo usan esa, no la de la animación.
  const vVista = v => Math.round(v * 10) / 10;
  const juego6 = val0 => { const val = { v: vVista(val0.v) }; return est(figLoma({ textos: [{ x: 8, y: 22, texto: 'r = 20 m', ancla: 'start' }], v: val.v > 0 ? 1 : 0, largoV: 14 + val.v * 2, fz: { P: 10000, N: N6(val.v), tP: 'P⃗', tN: 'N⃗', adir: val.v > 0 ? -1 : 0, avert: true, ta: 'a⃗_c' },
    alt: `Un auto de 1000 kg en la cima de una loma de 20 m de radio, a ${f(val.v, 1)} m/s: la pista lo empuja con ${f(N6(val.v))} N.` })); };
  const PRED6 = figLoma({ forma: 'hondonada', v: 1, tv: 'v = 8 m/s', fz: { P: 10000, N: 1, tP: 'P = 10 000 N', tN: 'N = ?' }, textos: [{ x: 8, y: 22, texto: 'r = 20 m', ancla: 'start' }],
    alt: 'El auto en el fondo de una hondonada de 20 m de radio, a 8 m/s. Lo que lo empuja la pista, con un signo de pregunta.' });
  const REVELA6 = figLoma({ forma: 'hondonada', v: 1, tv: 'v = 8 m/s', fz: { P: 10000, N: 13200, tP: 'P = 10 000 N', tN: 'N = 13 200 N', adir: 1, avert: true, ta: 'a⃗_c' }, textos: [{ x: 8, y: 22, texto: 'r = 20 m', ancla: 'start' }],
    alt: 'En el fondo de la hondonada el centro está arriba: la pista empuja al auto con 13 200 N, más que su peso.' });
  const corte6 = (forma, Nv, adir) => { const d = figLoma({ forma, v: 1, tv: 'v = 8 m/s', fz: { P: 10000, N: Nv, tP: 'P = 10 000 N', tN: `N = ${N_(Nv)}`, adir, avert: true, ta: 'a⃗_c' } }); return { objetos: d.objetos, flechas: d.flechas, lineas: d.lineas, textos: d.textos }; };
  const MIRA6 = Object.assign(figLoma({ forma: 'hondonada' }), { alt: 'El auto a 8 m/s en el fondo de una hondonada y en la cima de una loma, las dos de 20 m de radio.',
    cortes: [corte6('hondonada', 13200, 1), corte6('loma', 6800, -1)] });
  // La plataforma que gira vista desde arriba, con lo que va encima a r del eje y el rozamiento hacia el centro.
  function figDisco(o) {
    const c = [120, 120], R = 96, x = c[0] + (o.rpx || 64);
    return { alto: 240, objetos: [{ tipo: 'disco', c, r: R }, { tipo: 'caja', x, y: c[1] + 10, w: 22, h: 20, texto: '' }],
      flechas: [...(o.f ? [{ de: [x - 12, c[1]], ang: 180, largo: LARGO_FIJO, color: o.fc || 'i', texto: o.f, rumbo: [0, -1] }] : [])],
      cotas: [{ de: c, a: [x, c[1]], texto: o.r || 'r', lado: 1, sep: 22 }],
      textos: [{ x: 236, y: 40, texto: o.w || '', ancla: 'start' }, ...(o.textos || [])], alt: o.alt };
  }
  // El rizo (o el balde que gira en un círculo vertical), con lo que va arriba del todo.
  function figRizo(o) {
    const c = [120, 128], R = 90, top = [c[0], c[1] - R];
    const objs = [{ tipo: 'pista', forma: 'hondonada', c, r: R, de: 110, a: 430 }];
    if (o.balde) objs.push({ tipo: 'cuerda', de: c, a: [top[0], top[1] + 4] }, { tipo: 'balde', x: top[0], y: top[1] + 4, w: 30, h: 26, texto: '' });
    else objs.push({ tipo: 'auto', x: top[0], y: top[1] + 2, w: 48, giro: 180 });
    const fl = [];
    if (o.v) fl.push({ de: [top[0] - 44, top[1] - 34], ang: 0, largo: 32, color: 'tinta', texto: o.tv || 'v⃗', rumbo: [1, -0.4] });
    const d = o.fz ? dclCaja(o.fz, Object.assign({ cx: 266, cy: 118, titulo: o.titulo || 'DCL arriba' }, o.dcl || {})) : { obj: [], fl: [], txt: [] };
    return { alto: 236, objetos: [...objs, ...d.obj], flechas: [...fl, ...d.fl], lineas: o.balde ? [] : [{ de: c, a: [top[0], top[1] + 22] }],
      cotas: o.r ? [{ de: [c[0], c[1]], a: [c[0] + R, c[1]], texto: o.r, lado: 1, sep: 10 }] : [], textos: [...d.txt, ...(o.textos || [])], alt: o.alt };
  }
  // El columpio en lo más bajo: la cadena desde el travesaño y el niño sentado.
  function figColumpio(o) {
    const x = 120, y0 = 22, L = 150;
    const objs = [{ tipo: 'viga', x0: 50, x1: 190, y: y0 }, { tipo: 'cuerda', de: [x - 10, y0], a: [x - 10, y0 + L] }, { tipo: 'cuerda', de: [x + 10, y0], a: [x + 10, y0 + L] },
      { tipo: 'barra', de: [x - 18, y0 + L], a: [x + 18, y0 + L], grosor: 5 }, { tipo: 'persona', x, y: y0 + L + 30, alto: 80, texto: o.masa || '' }];
    const d = o.fz ? dclCaja(o.fz, Object.assign({ cx: 266, cy: 118, titulo: 'DCL abajo' }, o.dcl || {})) : { obj: [], fl: [], txt: [] };
    return { alto: 236, objetos: [...objs, ...d.obj], flechas: [...(o.v ? [{ de: [x - 50, y0 + L + 40], ang: 0, largo: 32, color: 'tinta', texto: o.tv || 'v⃗', rumbo: [0, 1] }] : []), ...d.fl],
      cotas: [{ de: [x - 10, y0], a: [x - 10, y0 + L], texto: o.L || '', lado: 1, sep: 18 }], textos: [...d.txt, ...(o.textos || [])], alt: o.alt };
  }
  const D6 = {
    ac: D.ac,
    acw: D.acw,
    centro: D.centro,
    signos: 'Las fuerzas que apuntan al centro suman; las que se alejan del centro restan',
    loma: 'En la cima de una loma, el centro de la curva está abajo; en el fondo de una hondonada, arriba',
  };

  // Ejemplos de la idea 6. Cuentas rehechas aparte (cuentas.js: proyecta cada fuerza sobre la recta hacia el centro y
  // compara con m · v²/r): 1000·10²/50; la moneda; 0,2·3²/0,5; 1000·(10 − 10²/40); 4 · 2000; 30·(10 + 4²/2);
  // √(10·40); 2·1²/10; 1200·10²/50; 2·4²/1 − 20; el rizo de 5 m con cada alternativa; 0,5·10/2² con cada alternativa; el
  // cuenco de 0,5 m a 37° con cada alternativa; √(10·10) con cada alternativa; 25·(10 + v²/2,5) = 500 con cada alternativa.
  const EJEMPLOS_CIRCULAR = [
    { nivel: 1, titulo: 'La fuerza neta en la curva',
      figura: est(figDisco({ rpx: 70, r: 'r = 50 m', f: 'ΣF = ?', fc: 'tinta', textos: [{ x: 236, y: 64, texto: 'v = 10 m/s', ancla: 'start' }], alt: 'Un auto, visto desde arriba, que toma una curva de 50 m de radio a 10 m/s.' })),
      enunciado: ['Un auto de 1000 kg toma una curva de 50 m de radio a 10 m/s. ¿Cuánto vale la suma de las fuerzas sobre él, hacia el centro?'],
      datos: [D6.ac, D6.centro],
      solucion: [{ texto: 'En una curva, la suma de las fuerzas apunta al centro y es la masa por la aceleración centrípeta, v²/r:', ecuacion: [...SF, ' = 1000 · ', frac('10²', '50'), ' = ', neg('2000 N')] }],
      respuesta: [neg('2000 N'), ', hacia el centro'] },
    { nivel: 1, titulo: 'Quién la lleva al centro',
      figura: est(figDisco({ rpx: 60, f: 'f⃗ = ?', w: 'gira parejo', alt: 'Una moneda sobre un tocadiscos que gira; la fuerza que la lleva al centro, con un signo de pregunta.' })),
      enunciado: ['Una moneda gira sobre un tocadiscos sin resbalar. Vista desde arriba, ¿qué fuerza la jala hacia el centro?'],
      datos: [D6.centro, D.est],
      solucion: [{ texto: 'El peso y la normal son verticales y se cancelan. La única fuerza horizontal es el rozamiento estático del disco, y es la que lleva la moneda hacia el centro; sin ella, la moneda saldría por la tangente.' }],
      respuesta: ['El ', neg('rozamiento estático'), ', hacia el centro'] },
    { nivel: 1, titulo: 'La piedra atada',
      figura: est(figDisco({ rpx: 60, r: 'r = 0,5 m', f: 'T = ?', fc: 'o', w: 'v = 3 m/s', textos: [{ x: 236, y: 64, texto: 'mesa lisa', ancla: 'start', peso: 400 }], alt: 'Una piedra atada a una cuerda gira sobre una mesa lisa, vista desde arriba.' })),
      enunciado: ['Una piedra de 0,2 kg, atada a una cuerda de 0,5 m, gira sobre una mesa lisa a 3 m/s. ¿Con qué fuerza jala la cuerda?'],
      datos: [D6.ac, D6.centro],
      solucion: [{ texto: 'La mesa es lisa y el peso y la normal se cancelan, así que lo único que lleva la piedra al centro es la cuerda:', ecuacion: [T, ' = 0,2 · ', frac('3²', '0,5'), ' = ', pj('3,6 N')] }],
      respuesta: [T, ' = ', pj('3,6 N')] },
    { nivel: 1, titulo: 'La normal en la cima',
      figura: est(figLoma({ v: 1, tv: 'v = 10 m/s', fz: { P: 10000, N: 1, tP: 'P = 10 000 N', tN: 'N = ?' }, textos: [{ x: 8, y: 22, texto: 'r = 40 m', ancla: 'start' }], alt: 'Un auto de 1000 kg en la cima de una loma de 40 m de radio, a 10 m/s.' })),
      enunciado: ['Un auto de 1000 kg pasa por la cima de una loma de 40 m de radio a 10 m/s. ¿Con qué fuerza lo empuja la pista?'],
      datos: [D.peso, D6.ac, D6.centro, D6.signos, D6.loma],
      solucion: [{ texto: 'En la cima, el centro está abajo: el peso apunta al centro y suma, y la normal se aleja y resta.', ecuacion: ['10 000 − ', N, ' = 1000 · ', frac('10²', '40'), ' = 2500'] }, { texto: 'La pista empuja el peso menos lo que hace falta hacia el centro:', ecuacion: [N, ' = 10 000 − 2500 = ', pn('7500 N')] }],
      respuesta: [N, ' = ', pn('7500 N')] },
    { nivel: 1, titulo: 'El doble de rapidez',
      figura: est(figDisco({ rpx: 70, r: 'r = 50 m', f: 'ΣF = ?', fc: 'tinta', textos: [{ x: 236, y: 64, texto: 'v = 20 m/s', ancla: 'start' }], alt: 'El mismo auto en la misma curva, ahora a 20 m/s.' })),
      enunciado: ['El auto de 1000 kg vuelve a tomar la curva de 50 m de radio, ahora a 20 m/s. ¿Cuánto vale la suma de las fuerzas hacia el centro?'],
      datos: [D6.ac, D6.centro],
      solucion: [{ texto: 'Con el doble de rapidez, v² se hace cuatro veces mayor, y la fuerza hacia el centro también:', ecuacion: [...SF, ' = 1000 · ', frac('20²', '50'), ' = ', neg('8000 N')] }],
      respuesta: [neg('8000 N')] },
    { nivel: 2, titulo: 'El columpio en lo más bajo',
      figura: est(figColumpio({ masa: '30 kg', L: '2 m', v: 1, tv: 'v = 4 m/s', fz: { P: 300, T: 1, Tvert: 1, tP: 'P = 300 N', tT: 'T = ?' }, dcl: { cx: 266 }, alt: 'Una niña de 30 kg en un columpio de 2 m, en lo más bajo, a 4 m/s.' })),
      enunciado: ['Una niña de 30 kg se mece en un columpio de cadenas de 2 m. En lo más bajo va a 4 m/s. ¿Con qué fuerza jalan las dos cadenas juntas?'],
      datos: [D.peso, D6.ac, D6.centro, D6.signos],
      solucion: [
        { texto: 'En lo más bajo, el centro está arriba: las cadenas apuntan al centro y suman, y el peso se aleja y resta.', ecuacion: [T, ' − 300 = 30 · ', frac('4²', '2'), ' = 240'] },
        { texto: 'Las cadenas sostienen el peso y además dan lo que hace falta hacia el centro:', ecuacion: [T, ' = 300 + 240 = ', pj('540 N')] },
      ],
      respuesta: [T, ' = ', pj('540 N')] },
    { nivel: 2, titulo: 'Casi volar sobre la loma',
      figura: est(figLoma({ v: 1, tv: 'v = ?', fz: { P: 1, N: 1, tP: 'P⃗', tN: 'N = 0' }, textos: [{ x: 8, y: 22, texto: 'r = 40 m', ancla: 'start' }], alt: 'Un auto en la cima de una loma de 40 m de radio, justo cuando la pista ya no lo empuja.' })),
      enunciado: ['¿A qué rapidez un auto en la cima de una loma de 40 m de radio deja de apretar la pista, con N = 0?'],
      datos: [D.peso, D6.ac, D6.centro, D6.signos, D6.loma],
      solucion: [
        { texto: 'Con N = 0, la pista ya no empuja, y solo el peso lleva el auto al centro:', ecuacion: ['m · 10 = m · ', frac('v²', '40')] },
        { texto: 'La masa está a los dos lados y se cancela, así que la rapidez no depende del auto:', ecuacion: ['v = ', { raiz: ['10 · 40'] }, ' = ', neg('20 m/s')] },
      ],
      respuesta: [neg('v = 20 m/s')] },
    { nivel: 2, titulo: 'El niño en la plataforma',
      figura: est(figDisco({ rpx: 64, r: 'r = 2 m', f: 'f⃗_s', w: 'ω = 1 rad/s', alt: 'Un niño a 2 m del eje de una plataforma que gira a 1 rad/s.' })),
      enunciado: ['Un niño está parado a 2 m del eje de una plataforma que gira a 1 rad/s. ¿Cuál es el menor ', mus, ' que le permite no resbalar?'],
      datos: [D.peso, D6.acw, D6.centro, D.est, D.vertical],
      solucion: [
        { texto: 'El peso y la normal se cancelan, así que el rozamiento estático es lo único que lleva al niño al centro:', ecuacion: [fs, ' = m · 1² · 2 = m · 2'] },
        { texto: 'Ese rozamiento no puede pasar de su tope, el coeficiente por el peso, y ese tope tiene que alcanzar:', ecuacion: [mus, ' · m · 10 ≥ m · 2   →   ', mus, ' ≥ ', neg('0,2')] },
      ],
      respuesta: [mus, ' = ', neg('0,2')] },
    { nivel: 2, titulo: 'La curva plana',
      figura: est(figDisco({ rpx: 70, r: 'r = 50 m', f: 'f⃗_s = ?', textos: [{ x: 236, y: 64, texto: 'v = 10 m/s', ancla: 'start' }], alt: 'Un auto de 1200 kg en una curva plana de 50 m de radio, a 10 m/s, visto desde arriba.' })),
      enunciado: ['Un auto de 1200 kg toma una curva plana de 50 m de radio a 10 m/s, sin derrapar. ¿Con qué fuerza lo jala el piso hacia el centro?'],
      datos: [D.peso, D6.ac, D6.centro, D.est],
      solucion: [
        { texto: 'En una curva plana, el peso y la normal son verticales; lo único horizontal es el rozamiento estático entre las llantas y el piso.' },
        { texto: 'Ese rozamiento es toda la fuerza hacia el centro, así que vale la masa por v²/r:', ecuacion: [fs, ' = 1200 · ', frac('10²', '50'), ' = ', pr('2400 N')] },
      ],
      respuesta: [fs, ' = ', pr('2400 N')] },
    { nivel: 2, titulo: 'El balde de agua arriba',
      figura: est(figRizo({ balde: true, r: 'r = 1 m', v: 1, tv: 'v = 4 m/s', fz: { P: 20, T: 1, Tvert: -1, tP: 'P = 20 N', tT: 'T = ?' }, alt: 'Un balde de 2 kg que gira en un círculo vertical de 1 m, en lo más alto, a 4 m/s.' })),
      enunciado: ['Haces girar un balde de 2 kg en un círculo vertical de 1 m de radio. En lo más alto va a 4 m/s. ¿Con qué fuerza jala la cuerda?'],
      datos: [D.peso, D6.ac, D6.centro, D6.signos],
      solucion: [
        { texto: 'En lo más alto, el centro está abajo: la cuerda y el peso apuntan hacia abajo, al centro, y suman.', ecuacion: [T, ' + 20 = 2 · ', frac('4²', '1'), ' = 32'] },
        { texto: 'El peso ya pone 20 N hacia el centro, así que la cuerda solo pone lo que falta:', ecuacion: [T, ' = 32 − 20 = ', pj('12 N')] },
      ],
      respuesta: [T, ' = ', pj('12 N')] },
    { nivel: 3, titulo: 'El carrito arriba del rizo',
      figura: est(figRizo({ r: 'r = 5 m', v: 1, tv: 'v = 10 m/s', fz: { P: 2000, N: 1, Nabajo: true, tP: 'P⃗', tN: 'N = ?' }, alt: 'Un carrito de 200 kg en lo alto de un rizo de 5 m de radio, de cabeza, a 10 m/s.' })),
      enunciado: ['Un carrito de 200 kg de la montaña rusa pasa de cabeza por lo alto de un rizo de 5 m de radio, a 10 m/s. ¿Con qué fuerza lo empuja la pista?'],
      alternativas: ['6000 N', '2000 N', '4000 N', '0 N', '400 N'],
      datos: [D.peso, D6.ac, D6.centro, D6.signos],
      solucion: [
        { texto: 'Arriba del rizo, el carrito va de cabeza y el centro está abajo: la pista lo empuja hacia abajo y el peso también, así que los dos suman.', ecuacion: [N, ' + 2000 = 200 · ', frac('10²', '5'), ' = 4000'] },
        { texto: 'El peso ya pone 2000 N hacia el centro; la pista pone lo que falta:', ecuacion: [N, ' = 4000 − 2000 = ', pn('2000 N')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si sumas el peso a la centrípeta; ', neg('C'), ', si olvidas el peso; ', neg('D'), ', si crees que arriba nada lo empuja, y ', neg('E'), ', si olvidas el cuadrado de v y, además, el peso.'] },
      ],
      respuesta: [neg('B'), ', ', pn('2000 N')] },
    { nivel: 3, titulo: 'El radio máximo en la plataforma',
      figura: est(figDisco({ rpx: 64, r: 'r = ?', f: 'f⃗_s', w: 'ω = 2 rad/s', alt: 'Una persona sobre una plataforma que gira a 2 rad/s; la distancia máxima al eje, con un signo de pregunta.' })),
      enunciado: ['Una plataforma de feria gira a 2 rad/s. Entre los zapatos de una persona y el piso, ', mus, ' = 0,5. ¿A qué distancia máxima del eje puede pararse sin resbalar?'],
      alternativas: ['0,8 m', '2,5 m', '20 m', '0,125 m', '1,25 m'],
      datos: [D.peso, D6.acw, D6.centro, D.est],
      solucion: [
        { texto: 'Justo antes de resbalar, el rozamiento estático llega a su tope, y ese tope es lo que lleva a la persona al centro:', ecuacion: ['0,5 · m · 10 = m · 2² · r'] },
        { texto: 'La masa está a los dos lados y se cancela, así que se despeja el radio:', ecuacion: ['r = ', frac('0,5 · 10', '2²'), ' = ', neg('1,25 m')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si divides al revés; ', neg('B'), ', si usas ω sin el cuadrado; ', neg('C'), ', si multiplicas por ω², y ', neg('D'), ', si olvidas g.'] },
      ],
      respuesta: [neg('E'), ', ', neg('1,25 m')] },
    { nivel: 3, titulo: 'La bolita en el cuenco',
      figura: est({ alto: 220, objetos: [{ tipo: 'pista', forma: 'hondonada', c: [150, 40], r: 140, de: 190, a: 350 }, { tipo: 'pelota', x: 150 + 140 * 0.6, y: 40 + 140 * 0.8, r: 9 }],
        lineas: [{ de: [150, 40], a: [150 + 140 * 0.6, 40 + 140 * 0.8] }, { de: [150, 40], a: [150, 200] }, { de: [150, 152], a: [150 + 140 * 0.6, 152], discontinua: false }],
        angulos: [{ c: [150, 40], de: 270, a: 270 + 37, r: 40, texto: '37°' }], textos: [{ x: 8, y: 26, texto: 'R = 0,5 m; ω = ?', ancla: 'start' }],
        alt: 'Una bolita que gira dentro de un cuenco semiesférico liso, a 37° de la vertical medidos desde el centro de la esfera.' }),
      enunciado: ['Una bolita gira en un círculo horizontal dentro de un cuenco semiesférico liso de 0,5 m de radio. La recta del centro del cuenco a la bolita forma 37° con la vertical. ¿Cuánto vale ω?'],
      alternativas: ['5 rad/s', '3,87 rad/s', '5,77 rad/s', '25 rad/s', '3,54 rad/s'],
      datos: [D.peso, D6.acw, D.trig, 'La normal del cuenco apunta al centro de la esfera; el círculo de giro tiene radio r = R · sen θ'],
      solucion: [
        { texto: 'Hacia el centro del giro empuja N · sen 37°, y el radio del giro es 0,5 · sen 37°; al igualar con m · ω² · r, el sen 37° queda a los dos lados y se cancela:', ecuacion: [N, ' = m · ω² · 0,5'] },
        { texto: 'La bolita no sube ni baja, así que en la vertical N · cos 37° iguala al peso, m · 10; con la N de arriba, la masa también se cancela:', ecuacion: ['ω² · 0,5 · ', frac('4', '5'), ' = 10   →   ω = ', neg('5 rad/s')] },
        { texto: ['Las otras salen de un error: ', neg('B'), ', si tomas R como radio del giro; ', neg('C'), ', si usas el seno en vez del coseno; ', neg('D'), ', si das ω² en lugar de ω, y ', neg('E'), ', si olvidas el radio.'] },
      ],
      respuesta: [neg('A'), ', ', neg('ω = 5 rad/s')] },
    { nivel: 3, titulo: 'La rapidez mínima en el rizo',
      figura: est(figRizo({ r: 'r = 10 m', v: 1, tv: 'v = ?', fz: { P: 1, N: 1, tP: 'P⃗', tN: 'N = 0' }, alt: 'Un carrito en lo alto de un rizo de 10 m de radio, justo cuando la pista ya no lo empuja.' })),
      enunciado: ['¿Cuál es la menor rapidez con la que un carrito puede pasar de cabeza por lo alto de un rizo de 10 m de radio sin despegarse de la pista?'],
      alternativas: ['14,14 m/s', '100 m/s', '10 m/s', '0 m/s', '3,16 m/s'],
      datos: [D.peso, D6.ac, D6.centro, D6.signos],
      solucion: [
        { texto: 'Con la menor rapidez, la pista ya no empuja, N = 0, y solo el peso lleva el carrito al centro; si fuera más lento, el peso le sobraría y lo despegaría de la pista.', ecuacion: ['m · 10 = m · ', frac('v²', '10')] },
        { texto: 'La masa está a los dos lados y se cancela:', ecuacion: ['v = ', { raiz: ['10 · 10'] }, ' = ', neg('10 m/s')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si pones un 2 que no va; ', neg('B'), ', si olvidas la raíz; ', neg('D'), ', si crees que puede pasar quieto, y ', neg('E'), ', si olvidas g.'] },
      ],
      respuesta: [neg('C'), ', ', neg('10 m/s')] },
    { nivel: 3, titulo: 'El columpio y su cadena',
      figura: est(figColumpio({ masa: '25 kg', L: '2,5 m', v: 1, tv: 'v = ?', fz: { P: 250, T: 1, Tvert: 1, tP: 'P = 250 N', tT: 'T = 500 N' }, alt: 'Un niño de 25 kg en un columpio de 2,5 m; las cadenas aguantan 500 N.' })),
      enunciado: ['Un niño de 25 kg se mece en un columpio de 2,5 m. Las dos cadenas juntas aguantan 500 N como máximo. ¿Cuál es su mayor rapidez posible en lo más bajo?'],
      alternativas: ['7,07 m/s', '8,66 m/s', '25 m/s', '5 m/s', '0 m/s'],
      datos: [D.peso, D6.ac, D6.centro, D6.signos],
      solucion: [
        { texto: 'En lo más bajo, el centro está arriba: las cadenas apuntan al centro y suman, y el peso resta. Con las cadenas en su máximo:', ecuacion: ['500 − 250 = 25 · ', frac('v²', '2,5')] },
        { texto: 'Se despeja v² y después se saca la raíz:', ecuacion: ['v² = ', frac('250 · 2,5', '25'), ' = 25   →   v = ', neg('5 m/s')] },
        { texto: ['Las otras salen de un error: ', neg('A'), ', si olvidas el peso; ', neg('B'), ', si lo sumas; ', neg('C'), ', si olvidas la raíz, y ', neg('E'), ', si igualas las cadenas al peso.'] },
      ],
      respuesta: [neg('D'), ', ', neg('5 m/s')] },
  ];

  const AUTOS6 = [800, 1200, 1500];
  const OBJ_DISCO = [{ n: 'una caja', de: 'la caja' }, { n: 'un niño', de: 'el niño' }, { n: 'una moneda', de: 'la moneda' }];
  const circular = {
    id: 'centripeta-es-resultante',
    titulo: 'Dinámica circular',
    pregunta: '¿La pista empuja más a un auto en una hondonada o en una loma?',
    temas: ['Dinámica circular'],
    pieza: 'fis-estatica',
    aprendizaje: 'En una curva, la suma de las fuerzas apunta al centro y vale m·v²/r. No es otra fuerza: la ponen las demás.',
    actividad: 'Pasar con un auto por la cima de una loma, cada vez más rápido.',
    lee: {
      tarjetas: [
        { titulo: 'Lomas y hondonadas', texto: 'En la carretera de Juliaca a Puno, el auto pasa por lomas, donde la pista sube y vuelve a bajar, y por hondonadas, donde baja y vuelve a subir. Cada tramo curvo es como un pedazo de círculo, con su centro y su radio r.' },
        { titulo: 'De Movimiento circular', texto: ['Al recorrer una curva, la velocidad cambia de dirección aunque la rapidez no cambie, y todo cambio de velocidad es una aceleración. Esta se llama aceleración centrípeta, ', sub('a', 'c'), ', y apunta al centro de la curva; es mayor cuanto más rápido se va y cuanto más cerrada es la curva.'],
          ecuacion: [sub('a', 'c'), ' = ', frac('v²', 'r')] },
        { titulo: 'Qué mirar al jugar', texto: ['El auto pasa por la cima de la loma. Cambia su rapidez y compara la flecha de la normal, ', vec(N), ', con la del peso, ', vec(P), ', que no cambia con la rapidez.'],
          dibujo: est(figLoma({ fz: { P: 10000, N: 10000, tP: 'P⃗', tN: 'N⃗' }, alt: 'Un auto quieto en la cima de una loma; su DCL con el peso y la normal.' })) },
      ],
    },
    ejemplos: EJEMPLOS_CIRCULAR,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'Un auto de 1000 kg pasa por la cima de una loma de 20 m de radio. Pesa 10 000 N. Elige su rapidez.',
      mision: {
        texto: 'Haz que la pista empuje al auto con la mitad de su peso.',
        logrado: val => Math.abs(N6(val.v) - 5000) < 1e-9,
        bien: '¡La mitad! El peso le gana a la normal: lo que sobra apunta al centro.',
      },
      voz: 'Más rápido sobre la loma. ¿Qué flecha se achica?',
      leyenda: [
        { s: [vec(N)], t: 'la pista empuja al auto hacia arriba' },
        { s: [vec(P)], t: 'peso del auto' },
        { s: [vec(sub('a', 'c'))], t: 'aceleración centrípeta, punteada, al centro' },
        { s: [vec('v')], t: 'velocidad del auto' },
        { s: 'r', t: 'radio de la loma, 20 m' },
      ],
      controles: [
        { id: 'v', etiqueta: 'Rapidez, v', min: 0, max: 14, paso: 2, inicio: 4, unidad: 'm/s', decimales: 0, auto: { velocidad: 3, modo: 'rebota' } },
      ],
      dibujo: juego6,
      // La lectura enuncia la relación entre la normal y el peso.
      lectura: val0 => { const v = vVista(val0.v); return v === 0 ? ['Quieto: la pista empuja ', pn('10 000 N'), ', todo el peso'] : [`A ${f(v, 1)} m/s: `, pn(N_(N6(v))), ', menos que el peso']; },
      resumen: { v: 6 },
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora el auto pasa por el fondo de una hondonada de 20 m de radio, a 8 m/s. ¿Con qué fuerza lo empuja la pista?',
      datos: ['El auto tiene 1000 kg y pesa 10 000 N.', 'A esa rapidez, en esa curva, la aceleración centrípeta es 3,2 m/s².'],
      opciones: [
        { id: 'c', texto: '13 200 N', correcta: true },
        { id: 'loma', texto: '6800 N', error: 'DC-LOMA', siFuera: 'Restaste, como si el auto estuviera en la cima de una loma. Aquí está en el fondo de una hondonada, con el centro arriba, así que la normal tiene que ganarle al peso.' },
        { id: 'peso', texto: '10 000 N', error: 'N-MG', siFuera: 'Así sería en un tramo recto, donde la normal iguala al peso. En la curva, la suma de las fuerzas tiene que apuntar al centro, hacia arriba, así que la normal tiene que ser mayor.' },
        { id: 'solo', texto: '3200 N', error: 'DC-SOLO', siFuera: 'Bien la cuenta 1000 · 3,2 = 3200 N, pero esa es solo la fuerza neta hacia el centro. La pista, además, sostiene el peso del auto, así que empuja el peso más esos 3200 N.' },
      ],
      dibujo: est(PRED6),
      revelar: est(REVELA6),
      coincide: 'Coincide: abajo, el centro está arriba; la pista sostiene el peso y da 3200 N más.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: MIRA6,
      pasos: [
        { estado: { corte: 0 }, texto: 'En el fondo de la hondonada, el centro de la curva está arriba, así que la aceleración centrípeta apunta hacia arriba:', ecuacion: [sub('a', 'c'), ' = ', frac('8²', '20'), ' = 3,2 m/s², hacia arriba'] },
        { estado: { corte: 0 }, texto: 'Para que la suma de las fuerzas apunte al centro, hacia arriba, la normal tiene que ganarle al peso; lo que sobra es la masa por la aceleración centrípeta:', ecuacion: [N, ' − ', P, ' = m · ', sub('a', 'c')] },
        { estado: { corte: 0 }, texto: 'Con los números, la pista sostiene el peso y además empuja 3200 N más:', ecuacion: [N, ' = 10 000 + 1000 · 3,2 = ', pn('13 200 N')] },
        { estado: { corte: 1 }, texto: 'En la cima de una loma pasa lo contrario: el centro está abajo, así que el peso le gana a la normal y la pista empuja menos:', ecuacion: [P, ' − ', N, ' = m · ', sub('a', 'c'), '   →   ', N, ' = ', pn('6800 N')] },
        { estado: { corte: 1 }, texto: 'En ningún caso hay una fuerza que empuje hacia afuera, ni una fuerza centrípeta aparte: la centrípeta no se dibuja, porque es la suma del peso y la normal.' },
      ],
    },
    regla: {
      texto: 'En una curva, la suma de las fuerzas apunta al centro y vale m · v²/r: suman las que apuntan al centro y restan las que se alejan. Esa suma se llama fuerza centrípeta, pero no es una fuerza más que se dibuje: la ponen el peso, la normal, una cuerda o el rozamiento.',
      ecuacion: [...SF, ' = m · ', frac('v²', 'r')],
      condicion: 'se mira desde el suelo, que no gira, y se usa la rapidez en ese punto; desde el auto parece que algo te empuja hacia afuera, pero esa fuerza no existe.',
      dibujo: est(REVELA6),
    },
    // Así se resuelve: la cima de una loma (otros autos y radios que «Ahora tú») y, en las semillas impares, el columpio
    // en lo más bajo.
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 1) {
          const c = elegir(() => { const m = r.de([20, 35, 40]), L = r.de([2, 2.5, 4]), v = r.de([2, 4, 5]), Tv = m * (G + v * v / L); return exacto(Tv) && { m, L, v, Tv }; });
          return {
            enunciado: [`Un niño de ${c.m} kg se mece en un columpio de ${f(c.L)} m. En lo más bajo va a ${c.v} m/s. ¿Con qué fuerza jalan las dos cadenas juntas?`],
            datos: [D.peso, D6.ac, D6.centro, D6.signos],
            dibujo: est(figColumpio({ masa: `${c.m} kg`, L: `${f(c.L)} m`, v: 1, tv: `v = ${c.v} m/s`, fz: { P: c.m * G, T: 1, Tvert: 1, tP: `P = ${N_(c.m * G)}`, tT: 'T = ?' } })),
            pasos: [
              { tipo: 'pide', texto: 'Piden la fuerza de las cadenas en lo más bajo.' },
              { tipo: 'datos', texto: `Masa: ${c.m} kg; peso: ${c.m * G} N. Radio: ${f(c.L)} m. Rapidez: ${c.v} m/s.` },
              { tipo: 'regla', texto: 'En lo más bajo, el centro del círculo está arriba, en el punto de donde cuelgan las cadenas. Por eso las cadenas, que apuntan al centro, suman, y el peso, que se aleja, resta.', ecuacion: [T, ' − ', P, ' = m · ', frac('v²', 'r')] },
              { tipo: 'cuentas', texto: `Hacia el centro hace falta m · v² ÷ r = ${c.m} · ${c.v}² ÷ ${f(c.L)} = ${f(c.m * c.v * c.v / c.L)} N. Las cadenas dan eso y además sostienen el peso:`, ecuacion: [T, ` = ${c.m * G} + ${f(c.m * c.v * c.v / c.L)} = `, pj(N_(c.Tv))] },
              { tipo: 'sentido', texto: `Las cadenas jalan más que el peso, ${c.m * G} N, porque además de sostener al niño tienen que llevarlo hacia el centro.` },
            ],
            respuesta: [T, ' = ', pj(N_(c.Tv))],
          };
        }
        const c = elegir(() => { const m = r.de([900, 1100]), R = r.de([30, 45, 60]), v = r.de([6, 9, 15]), ac = v * v / R, Nv = m * (G - ac); return Nv > 0 && exacto(ac) && exacto(Nv) && { m, R, v, ac, Nv }; });
        return {
          enunciado: [`Un auto de ${c.m} kg pasa por la cima de una loma de ${c.R} m de radio a ${c.v} m/s. ¿Con qué fuerza lo empuja la pista?`],
          datos: [D.peso, D6.ac, D6.centro, D6.signos, D6.loma],
          dibujo: est(figLoma({ v: 1, tv: `v = ${c.v} m/s`, fz: { P: c.m * G, N: 1, tP: `P = ${N_(c.m * G)}`, tN: 'N = ?' }, textos: [{ x: 8, y: 22, texto: `r = ${c.R} m`, ancla: 'start' }] })),
          pasos: [
            { tipo: 'pide', texto: 'Piden la normal de la pista en la cima.' },
            { tipo: 'datos', texto: `Masa: ${c.m} kg; peso: ${N_(c.m * G)}. Radio: ${c.R} m. Rapidez: ${c.v} m/s.` },
            { tipo: 'regla', texto: 'En la cima, el centro de la curva está abajo. Por eso el peso, que apunta al centro, suma, y la normal, que se aleja de él, resta.', ecuacion: [P, ' − ', N, ' = m · ', sub('a', 'c')] },
            { tipo: 'cuentas', texto: [sub('a', 'c'), ` = ${c.v}² ÷ ${c.R} = ${f(c.ac)} m/s², hacia abajo, al centro. La normal es el peso menos la masa por esa aceleración:`], ecuacion: [N, ` = ${c.m} · (10 − ${f(c.ac)}) = `, pn(N_(c.Nv))] },
            { tipo: 'sentido', texto: 'La pista empuja menos que el peso, y por eso el auto se siente más liviano en la cima: lo que sobra del peso es lo que lo lleva hacia el centro.' },
          ],
          respuesta: [N, ' = ', pn(N_(c.Nv))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4;
        if (k === 0 || k === 1) {
          const loma = k === 0;
          const c = elegir(() => { const m = r.de(AUTOS6), R = r.de([20, 25, 40, 50]), v = r.de([5, 10, 12]), ac = v * v / R, Nv = m * (G + (loma ? -ac : ac));
            return Nv > 0 && exacto(ac) && exacto(Nv) && !(R === 20 && v === 8) && distintos(Nv, m * (G + (loma ? ac : -ac)), m * G, m * ac) && { m, R, v, ac, Nv }; });
          return {
            pregunta: [`Un auto de ${c.m} kg pasa por ${loma ? 'la cima de una loma' : 'el fondo de una hondonada'} de ${c.R} m de radio a ${c.v} m/s. ¿Con qué fuerza lo empuja la pista?`],
            datos: [D.peso, D6.ac, D6.centro, D6.signos, D6.loma],
            dibujo: est(figLoma({ forma: loma ? 'loma' : 'hondonada', v: 1, tv: `v = ${c.v} m/s`, fz: { P: c.m * G, N: 1, tP: `P = ${N_(c.m * G)}`, tN: 'N = ?' }, textos: [{ x: 8, y: 22, texto: `r = ${c.R} m`, ancla: 'start' }] })),
            opciones: opciones(c.Nv, [
              { id: 'signo', valor: c.m * (G + (loma ? c.ac : -c.ac)), error: loma ? 'DC-SUMA' : 'DC-LOMA', siFuera: loma ? 'Bien la parte hacia el centro, pero la sumaste al peso. En la cima, el centro está abajo: el peso apunta al centro y la normal se aleja, así que la normal es el peso menos esa parte.' : 'Bien la parte hacia el centro, pero la restaste del peso. En el fondo, el centro está arriba: la normal apunta al centro y le gana al peso, así que es el peso más esa parte.' },
              { id: 'peso', valor: c.m * G, error: 'N-MG', siFuera: 'Así sería en un tramo recto, donde la normal iguala al peso. En la curva, la suma de las fuerzas tiene que apuntar al centro, así que la normal y el peso no pueden anularse.' },
              { id: 'solo', valor: c.m * c.ac, error: 'DC-SOLO', siFuera: 'Bien la cuenta m · v²/r, pero esa es la fuerza neta hacia el centro, no la normal. El peso también actúa, y la normal es lo que le falta o le sobra al peso para dar esa neta.' },
            ], N_),
            solucion: { texto: loma ? 'En la cima, el centro está abajo: el peso apunta al centro y la normal se aleja, así que P − N = m · v²/r.' : 'En el fondo, el centro está arriba: la normal apunta al centro y el peso se aleja, así que N − P = m · v²/r.', ecuacion: [N, ` = ${c.m} · (10 ${loma ? '−' : '+'} ${f(c.ac)}) = `, pn(N_(c.Nv))] },
          };
        }
        if (k === 2) {
          // La plataforma que gira (San Marcos 2019-II): el rozamiento estático hace de centrípeta.
          const ob = OBJ_DISCO[Math.floor(sm / 4) % OBJ_DISCO.length];
          if (sm % 8 < 4) {
            const c = elegir(() => { const w = r.de([1, 2, 4]), mu = r.de([0.2, 0.4, 0.8]), R = mu * G / (w * w); return exacto(R) && !(w === 2 && mu === 0.5) && distintos(R, w * w / (mu * G), mu * G / w, mu / (w * w)) && { w, mu, R }; });
            return {
              pregunta: [`Una plataforma gira a ${c.w} rad/s. Entre ${ob.de} y el piso de la plataforma, `, mus, ` = ${f(c.mu)}. ¿A qué distancia máxima del eje se queda sin resbalar?`],
              datos: [D.peso, D6.acw, D6.centro, D.est],
              dibujo: est(figDisco({ rpx: 64, r: 'r = ?', f: 'f⃗_s', w: `ω = ${c.w} rad/s` })),
              opciones: opciones(c.R, [
                { id: 'inv', valor: c.w * c.w / (c.mu * G), error: 'DC-INV', siFuera: 'Bien igualar el tope del rozamiento a la centrípeta, pero al despejar r diste vuelta la fracción. De μ · g = ω² · r sale r = μ · g ÷ ω².' },
                { id: 'w', valor: c.mu * G / c.w, error: 'DC-W', siFuera: 'Bien la idea, pero usaste ω sin elevarla al cuadrado. La aceleración centrípeta es ω² · r, así que al despejar se divide entre ω².' },
                { id: 'g', valor: c.mu / (c.w * c.w), error: 'DC-SIN-G', siFuera: ['Bien despejar r, pero olvidaste g. El tope del rozamiento es ', mus, ' · m · g, porque en la plataforma la normal es el peso, así que g queda arriba en la fracción.'] },
              ], v => `${f(v)} m`),
              solucion: { texto: ['Justo antes de resbalar, el rozamiento estático llega a su tope, ', mus, ' · m · g, y es lo único que lleva la caja al centro; se iguala a m · ω² · r y la masa se cancela:'], ecuacion: [`r = ${f(c.mu)} · 10 ÷ ${c.w}² = `, neg(`${f(c.R)} m`)] },
            };
          }
          const c = elegir(() => { const w = r.de([1, 2, 3]), R = r.de([0.5, 1, 1.5, 2]), mu = w * w * R / G; return exacto(mu) && mu <= 1 && distintos(mu, w * w * R, w * R / G, G / (w * w * R)) && { w, R, mu }; });
          return {
            pregunta: [`Una plataforma gira a ${c.w} rad/s y ${ob.n} está a ${f(c.R)} m del eje. ¿Cuál es el menor `, mus, ' que le permite girar sin resbalar?'],
            datos: [D.peso, D6.acw, D6.centro, D.est],
            dibujo: est(figDisco({ rpx: 64, r: `r = ${f(c.R)} m`, f: 'f⃗_s', w: `ω = ${c.w} rad/s` })),
            opciones: opciones(c.mu, [
              { id: 'sing', valor: c.w * c.w * c.R, error: 'DC-SIN-G', siFuera: ['Bien la aceleración centrípeta, pero falta dividir entre g. El tope del rozamiento es ', mus, ' · m · g, así que el coeficiente es la aceleración centrípeta dividida entre g.'] },
              { id: 'w', valor: c.w * c.R / G, error: 'DC-W', siFuera: 'Bien dividir entre g, pero usaste ω sin elevarla al cuadrado. La aceleración centrípeta es ω² · r.' },
              { id: 'inv', valor: G / (c.w * c.w * c.R), error: 'DC-INV', siFuera: 'Bien igualar el tope del rozamiento a la centrípeta, pero al despejar el coeficiente diste vuelta la fracción: es la aceleración centrípeta, ω² · r, dividida entre g.' },
            ], v => f(v)),
            solucion: { texto: ['El rozamiento estático es lo único que lleva al niño al centro, y no puede pasar de su tope, ', mus, ' · m · g; el menor coeficiente es el que da justo m · ω² · r:'], ecuacion: [mus, ` = ${c.w}² · ${f(c.R)} ÷ 10 = `, neg(f(c.mu))] },
          };
        }
        // Nivel examen: lo alto del rizo (San Marcos 2026-I: el peso no se suma a la centrípeta) o la rapidez mínima.
        if (sm % 8 >= 4) {
          const R = r.de([4.9, 8.1, 2.5, 6.4, 3.6]), v = Math.sqrt(G * R);
          return {
            pregunta: [`¿Cuál es la menor rapidez con la que un carrito puede pasar de cabeza por lo alto de un rizo de ${f(R)} m de radio sin despegarse de la pista?`],
            datos: [D.peso, D6.ac, D6.centro, D6.signos],
            opciones: opciones(v, [
              { id: 'dos', valor: Math.sqrt(2 * G * R), error: 'DC-DOS', siFuera: 'Bien que el peso solo hace de centrípeta, pero pusiste un 2 que no va. De m · g = m · v²/r sale v² = g · r, sin ningún 2.' },
              { id: 'raiz', valor: G * R, error: 'DC-SIN-RAIZ', siFuera: 'Bien: g · r es la rapidez al cuadrado, v². Falta sacar la raíz cuadrada para tener la rapidez, en m/s.' },
              { id: 'g', valor: Math.sqrt(R), error: 'DC-SIN-G', siFuera: 'Bien sacar la raíz, pero solo del radio. Adentro va g · r, porque el peso, m · g, es la fuerza que lleva el carrito al centro.' },
            ], v => `${f(v)} m/s`),
            solucion: { texto: 'A la menor rapidez, la pista ya no empuja, N = 0, y solo el peso lo lleva al centro: m · g = m · v²/r, y la masa se cancela.', ecuacion: [`v = √(10 · ${f(R)}) = `, neg(`${f(v)} m/s`)] },
          };
        }
        const c = elegir(() => { const m = r.de([150, 250, 300]), R = r.de([4, 5, 8]), v = r.de([8, 10, 12]), ac = v * v / R, Nv = m * (ac - G);
          return Nv > 0 && exacto(ac) && exacto(Nv) && !(m === 200 && R === 5 && v === 10) && distintos(Nv, m * (ac + G), m * ac, m * G, m * v / R) && { m, R, v, ac, Nv }; });
        return {
          pregunta: [`Un carrito de ${c.m} kg de la montaña rusa pasa de cabeza por lo alto de un rizo de ${c.R} m de radio, a ${c.v} m/s. ¿Con qué fuerza lo empuja la pista?`],
          datos: [D.peso, D6.ac, D6.centro, D6.signos],
          dibujo: est(figRizo({ r: `r = ${c.R} m`, v: 1, tv: `v = ${c.v} m/s`, fz: { P: c.m * G, N: 1, Nabajo: true, tP: 'P⃗', tN: 'N = ?' } })),
          opciones: opciones(c.Nv, [
            { id: 'suma', valor: c.m * (c.ac + G), error: 'DC-SUMA', siFuera: 'Bien la parte hacia el centro, pero le sumaste el peso. Arriba del rizo, el peso también apunta al centro y ya pone una parte: la pista solo pone lo que falta.' },
            { id: 'solo', valor: c.m * c.ac, error: 'DC-SOLO', siFuera: 'Bien la cuenta m · v²/r, pero esa es toda la fuerza hacia el centro. Arriba del rizo, el peso apunta al centro y ya pone una parte, así que la pista empuja menos.' },
            { id: 'peso', valor: c.m * G, error: 'N-MG', siFuera: 'Bien que el peso cuenta, pero la pista no tiene por qué empujar lo mismo que él. Empuja lo que le falta al peso para llegar a m · v²/r.' },
            { id: 'cuad', valor: c.m * c.v / c.R, error: 'DC-SIN-CUADRADO', siFuera: 'Bien la idea, pero usaste v sin elevarla al cuadrado y olvidaste el peso. La centrípeta es m · v²/r, y arriba del rizo el peso también apunta al centro.' },
          ], N_),
          solucion: { texto: 'Arriba del rizo, el carrito va de cabeza: la pista lo empuja hacia abajo y el peso también, los dos hacia el centro, y juntos suman m · v²/r:', ecuacion: [N, ` = ${c.m} · (${f(c.ac)} − 10) = `, pn(N_(c.Nv))] },
        };
      },
    },
  };

  // ======================= Laboratorio (juego libre, sin preguntas) =======================
  // Las tres mesas de antes, con sus ids y controles (un caso guardado sigue abriendo igual), dibujadas con fis-estatica.
  const BLOQUE_LIBRE = [
    { id: 'F', etiqueta: 'F', color: 'c-o', min: 0, max: 35, paso: 5, inicio: 25, unidad: 'N', decimales: 0 },
    { id: 'm', etiqueta: 'm', min: 5, max: 8, paso: 1, inicio: 5, unidad: 'kg', decimales: 0 },
    { id: 'mu', etiqueta: 'μk', opciones: [{ valor: 0, texto: '0' }, { valor: 0.2, texto: '0,2' }, { valor: 0.4, texto: '0,4' }], inicio: 0.2 },
    { id: 't', etiqueta: 't', min: 0, max: 1.5, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 0.4, modo: 'repite' } },
  ];
  const rocBloque = val => val.mu * val.m * G;
  const aBloque = val => (val.F - rocBloque(val)) / val.m;
  // La mayor aceleración que dan los controles: se busca en su grilla (fuerza máxima, masa mínima, sin roce).
  const A_MAX_BLOQUE = Math.max(...[0, 0.2, 0.4].flatMap(mu => [5, 6, 7, 8].map(m => aBloque({ F: 35, m, mu }))));
  const mesaBloque = val => {
    const a = aBloque(val), t = val.t || 0, v0 = 1, tp = a < 0 ? v0 / -a : Infinity, te = Math.min(t, tp), x = v0 * te + a * te * te / 2, quieto = t >= tp;
    return est(figPiso({ cosa: { tipo: 'caja', x: 92 + Math.min(60, x * 30), w: 64, h: 44, texto: `${val.m} kg` }, cuerda: val.F > 0, largoCuerda: 36, v: quieto ? 0 : 1,
      fz: { P: val.m * G, N: val.m * G, F: val.F, tP: 'P⃗', tN: 'N⃗', tF: `F = ${N_(val.F)}`, f: quieto ? val.F : rocBloque(val), tf: quieto ? 'f⃗_s' : `f_k = ${N_(rocBloque(val))}`, adir: quieto || Math.abs(a) < 1e-9 ? 0 : Math.sign(a) },
      textos: [{ x: 8, y: 22, texto: quieto ? 'se detuvo' : Math.abs(a) < 1e-9 ? 'desliza parejo' : a > 0 ? 'acelera' : 'frena', ancla: 'start', peso: 400 }],
      alt: `Un bloque de ${val.m} kg jalado con ${val.F} N por un piso con μk = ${f(val.mu)}.` }));
  };
  const ASC_M = 60;
  const laboratorio = [
    { id: 'bloque-libre', titulo: 'Fuerza, masa y rozamiento', pieza: 'fis-estatica',
      consigna: 'Un bloque ya desliza, en cámara lenta. Cambia la fuerza, la masa y μk, y mira cuánto sobra para acelerar.',
      controles: BLOQUE_LIBRE,
      dibujo: mesaBloque,
      lectura: val => { const d = val.F - rocBloque(val); return ['Jalas ', pj(N_(val.F)), ', el piso frena ', pr(N_(rocBloque(val))), Math.abs(d) < 1e-9 ? ': no sobra nada' : d > 0 ? `: a = ${f(d / val.m)} m/s²` : ': frena']; },
      invitaciones: [
        { texto: 'Haz que el bloque deslice sin acelerar, aunque lo jales.', logrado: val => val.F > 0 && Math.abs(val.F - rocBloque(val)) < 1e-9,
          bien: 'Jalas y no acelera, porque el rozamiento iguala tu jalón: sigue a velocidad constante.' },
        { texto: 'Consigue una aceleración de justo 2 m/s².', logrado: val => Math.abs(aBloque(val) - 2) < 1e-9,
          bien: 'Lo que sobra del jalón, dividido entre la masa, da 2 m/s². ¿Hay otra manera?' },
        { texto: 'Busca la mayor aceleración que permiten los controles.', logrado: val => aBloque(val) >= A_MAX_BLOQUE - 1e-9,
          bien: 'Con la fuerza máxima, la masa mínima y sin rozamiento, sobra lo más posible.' },
        { texto: 'Haz que el piso le gane a tu jalón: que el bloque frene.', logrado: val => val.F < rocBloque(val) - 1e-9,
          bien: 'El rozamiento le gana a tu jalón: la fuerza neta va hacia atrás y frena.' },
      ] },
    { id: 'ascensor-libre', titulo: 'Ascensor hasta la caída libre', pieza: 'fis-estatica',
      consigna: 'Una persona de 60 kg está en la balanza. Lleva la aceleración de +6 a −10 m/s²: ¿y si se corta el cable?',
      controles: [{ id: 'a', etiqueta: 'a', min: -10, max: 6, paso: 2, inicio: 2, unidad: 'm/s²', decimales: 0 },
        { id: 't', etiqueta: 't', min: 0, max: 2, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 0.5, modo: 'repite' } }],
      dibujo: val => { const Nv = ASC_M * (G + val.a); return est(figAscensor({ lectura: N_(Nv), masa: '60 kg', fz: { P: 600, N: Nv, tP: 'P⃗', tN: 'N⃗', adir: Math.sign(val.a), avert: true },
        textos: [{ x: 8, y: 228, texto: `a = ${f(val.a, 0)} m/s²`, ancla: 'start', peso: 400 }], alt: `La persona de 60 kg en un ascensor con a = ${f(val.a, 0)} m/s²: la balanza marca ${f(Nv)} N.` })); },
      lectura: val => ['a = ', f(val.a, 0), ' m/s²: la balanza marca ', pn(N_(ASC_M * (G + val.a)))],
      invitaciones: [
        { texto: 'Haz que la balanza marque justo el peso de la persona.', logrado: val => Math.abs(val.a) < 1e-9, bien: 'Con a = 0 marca el peso, suba o baje. ¿Importa la velocidad?' },
        { texto: 'Haz que la balanza marque más de 900 N.', logrado: val => ASC_M * (G + val.a) > 900, bien: 'Acelerar hacia arriba aprieta la balanza: el peso aparente crece.' },
        { texto: 'Consigue que la balanza marque 0.', logrado: val => Math.abs(G + val.a) < 1e-9, bien: 'Persona y ascensor caen juntos: eso es ingravidez, con la misma masa.' },
      ] },
    { id: 'loma', titulo: 'El auto en la loma', pieza: 'fis-estatica',
      consigna: 'Un auto de 1000 kg pasa por la cima de una loma de 10 m de radio. Su rapidez cambia sola: mira la normal.',
      controles: [{ id: 'v', etiqueta: 'v', min: 0, max: 10, paso: 2.5, inicio: 5, unidad: 'm/s', decimales: 1, auto: { velocidad: 2.5, modo: 'rebota' } }],
      dibujo: val0 => { const val = { v: vVista(val0.v) }, Nv = Math.max(0, 1000 * (G - val.v * val.v / 10)); return est(figLoma({ v: val.v > 0 ? 1 : 0, largoV: 14 + val.v * 3, fz: { P: 10000, N: Nv, tP: 'P⃗', tN: Nv > 0 ? 'N⃗' : 'N = 0', adir: val.v > 0 ? -1 : 0, avert: true, ta: 'a⃗_c' },
        textos: [{ x: 8, y: 22, texto: 'r = 10 m', ancla: 'start' }], alt: `Un auto de 1000 kg en la cima de una loma de 10 m, a ${f(val.v, 1)} m/s: la pista lo empuja con ${f(Nv)} N.` })); },
      lectura: val0 => { const v = vVista(val0.v); return [`A ${f(v, 1)} m/s, la pista empuja `, pn(N_(Math.max(0, 1000 * (G - v * v / 10))))]; },
      invitaciones: [
        { texto: 'Busca la rapidez con la que el auto casi se despega.', logrado: val => 1000 * (G - val.v * val.v / 10) < 1e-9, bien: 'Con N = 0, solo el peso lleva el auto al centro. ¿Y si va más rápido?' },
        { texto: 'Haz que la normal valga lo mismo que el peso.', logrado: val => val.v === 0, bien: 'Sin rapidez no hay giro: la normal sostiene todo el peso.' },
        { texto: 'Guarda dos casos con distinta rapidez y compara sus normales.', logrado: (val, guardados) => guardados.some(x => x.v !== val.v) && guardados.some(x => x.v === val.v),
          bien: 'Con más rapidez, la normal baja, porque hace falta más fuerza neta hacia el centro.' },
      ] },
  ];

  // Glosario del tema (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso, cada una con su aproximación
  // (`simple`) y tres ejemplos. Fuerza, peso, normal, tensión, polea, rozamiento y plano inclinado vienen de Estática;
  // aceleración, gravedad y distancia de frenado, de MRUV; aceleración centrípeta, de Movimiento circular; masa, de
  // Magnitudes. Ningún ejemplo responde una Predice: ninguno dice hacia dónde acelera algo que se frena, la aceleración de
  // la Luna con los 40 N, la frenada de las dos cajas, los 12 N de la cuerda, los 400 N del ascensor ni la hondonada.
  const GLOSARIO = [
    { termino: 'segunda ley de Newton', formas: ['segunda ley de Newton', 'segunda ley'],
      def: 'La fuerza neta sobre un cuerpo es su masa por su aceleración: ΣF = m · a.',
      simple: 'Empuja más y el carrito acelera más; llénalo de papas y acelera menos.',
      ejemplos: ['6 N de fuerza neta sobre 3 kg dan 2 m/s².', 'Un carrito lleno acelera menos que uno vacío con el mismo empujón.', 'Con fuerza neta cero, la aceleración es cero.'],
      ver: ['fuerza neta', 'masa'] },
    { termino: 'fuerza neta', simbolo: 'ΣF', medida: 'N', formas: ['fuerza neta', 'fuerzas netas'],
      def: 'Suma, con su sentido, de todas las fuerzas que actúan sobre un cuerpo.',
      simple: 'Lo que queda al juntar los empujones y jalones, cada uno con su sentido.',
      ejemplos: ['30 N a la derecha y 20 N a la izquierda: 10 N a la derecha.', 'Dos personas jalan igual en sentidos opuestos: cero.', 'Si solo actúa el peso, la fuerza neta es el peso.'],
      ver: ['segunda ley de Newton', 'resultante'] },
    { termino: 'inercia', formas: ['inercia'],
      def: 'Lo que un cuerpo se resiste a cambiar su velocidad; se mide con su masa.',
      simple: 'Lo que cuesta cambiar cómo se mueve algo, como frenar un camión lleno.',
      ejemplos: ['Arrancar un camión lleno cuesta más que uno vacío.', 'Al frenar el bus, tu cuerpo sigue hacia adelante.', 'Si jalas rápido el mantel, los platos casi no se mueven.'],
      ver: ['masa'] },
    { termino: 'dinamómetro', formas: ['dinamómetro', 'dinamómetros', 'balanza de resorte', 'balanzas de resorte'],
      def: 'Instrumento con un resorte que mide fuerzas; colgado y quieto, marca el peso de lo que cuelga.',
      simple: 'Un aparato con un resorte que se estira más cuanto más lo jalan.',
      ejemplos: ['La balanza de gancho del mercado.', 'Con 3 kg colgados, en la Tierra marca 30 N.', 'Marca más mientras más se estira su resorte.'],
      ver: ['peso', 'fuerza elástica'] },
    { termino: 'fuerza oblicua', formas: ['fuerza oblicua', 'fuerzas oblicuas'],
      def: 'Fuerza inclinada respecto del piso: tiene una parte horizontal y otra vertical.',
      simple: 'Un jalón inclinado, como el de una maleta de rueditas jalada por el asa.',
      ejemplos: ['Jalar una maleta de rueditas por el asa.', 'Empujar una carretilla con los brazos inclinados.', 'Una cuerda a 37° del piso jala de lado y levanta un poco.'],
      ver: ['componente', 'fuerza normal'] },
    { termino: 'rueda motriz', formas: ['rueda motriz', 'ruedas motrices'],
      def: 'Rueda que hace girar el motor: empuja el piso hacia atrás, y el rozamiento del piso la empuja hacia adelante.',
      simple: 'La rueda que mueven el motor o los pedales para avanzar.',
      ejemplos: ['La rueda de atrás de una bicicleta, la que mueve la cadena.', 'En muchos autos, las dos ruedas de adelante.', 'En un piso con hielo, la rueda motriz patina.'],
      ver: ['rozamiento estático', 'tercera ley de Newton'] },
    { termino: 'cuerda ideal', formas: ['cuerda ideal', 'cuerdas ideales'],
      def: 'Cuerda que no se estira y casi no pesa: jala con la misma tensión en sus dos puntas.',
      simple: 'Una soga que no se estira ni pesa: jala igual en sus dos puntas.',
      ejemplos: ['Un hilo de pescar con una plomada chica.', 'Una soga tensa entre dos carritos.', 'Si se estirara, los dos cuerpos no irían juntos.'],
      ver: ['tensión', 'polea'] },
    { termino: 'máquina de Atwood', formas: ['máquina de Atwood', 'máquinas de Atwood', 'Atwood'],
      def: 'Dos cuerpos colgados de una misma cuerda que pasa por una polea fija.',
      simple: 'Dos pesos colgados de una cuerda en una polea: el más pesado baja.',
      ejemplos: ['Dos baldes en una polea de la obra.', 'Con dos pesos iguales, sueltos, no se mueven.', 'El más pesado baja y el otro sube.'],
      ver: ['polea', 'tensión'] },
    { termino: 'peso aparente', medida: 'N', formas: ['peso aparente', 'pesos aparentes'],
      def: 'Lo que marca una balanza: la normal con que te sostiene, que cambia si aceleras hacia arriba o hacia abajo.',
      simple: 'Lo que marca la balanza, que al arrancar un ascensor no es tu peso.',
      ejemplos: ['En un ascensor quieto es igual a tu peso.', 'Al arrancar hacia arriba, sientes las piernas más pesadas.', 'En una montaña rusa, al bajar de golpe te sientes liviano.'],
      ver: ['fuerza normal', 'ingravidez'] },
    { termino: 'ingravidez', formas: ['ingravidez'],
      def: 'Estado en que nada te sostiene y caes con g: la balanza marca 0, aunque tu masa no cambie.',
      simple: 'Cuando caes junto con lo que te sostendría, y por eso sientes que flotas.',
      ejemplos: ['Un ascensor con el cable cortado.', 'Los astronautas dentro de la estación espacial.', 'Un instante de un salto en la cama elástica.'],
      ver: ['peso aparente', 'caída libre'] },
    { termino: 'sistema inercial', formas: ['sistema inercial', 'sistemas inerciales', 'marco inercial', 'marcos inerciales'],
      def: 'Punto de vista que no acelera, como el piso; desde él valen las leyes de Newton tal como se escriben.',
      simple: 'Mirar desde algo que no acelera, como el piso, no desde una combi.',
      ejemplos: ['El piso del colegio.', 'Un tren que va siempre a la misma rapidez en línea recta.', 'Un ascensor que arranca no lo es.'],
      ver: ['segunda ley de Newton'] },
    { termino: 'fuerza centrípeta', medida: 'N', formas: ['fuerza centrípeta', 'fuerzas centrípetas'],
      def: 'Nombre de la suma de fuerzas hacia el centro de una curva, m · v²/r; no es una fuerza más.',
      simple: 'Lo que suman las fuerzas hacia el centro de una curva.',
      ejemplos: ['En una curva plana, la pone el rozamiento de las llantas.', 'En una piedra que gira atada, la pone la cuerda.', 'En un columpio, la ponen las cadenas menos el peso.'],
      ver: ['aceleración centrípeta'] },
    { termino: 'rizo', formas: ['rizo', 'rizos'],
      def: 'Vuelta completa de una pista en un plano vertical, como la de una montaña rusa.',
      simple: 'Una vuelta completa de la pista donde la montaña rusa pasa de cabeza.',
      ejemplos: ['El carrito pasa de cabeza por lo alto del rizo.', 'En lo alto, la pista empuja al carrito hacia abajo.', 'Un balde que gira con agua en un círculo vertical hace lo mismo.'],
      ver: ['fuerza centrípeta'] },
  ];
  const IDEAS = [segunda, masaPeso, roceMov, planoIdea, ascensorIdea, circular];

  // Tabla de letras (propuesta §5): un solo significado en la unidad.
  const LETRAS = { F: 'fuerza de una mano, un motor o una cuerda que jala; ΣF, la fuerza neta', F_1: 'la primera de dos fuerzas', F_2: 'la segunda de dos fuerzas', m: 'masa', m_1: 'masa del primer bloque', m_2: 'masa del segundo bloque',
    a: 'aceleración', P: 'peso', g: 'aceleración de la gravedad, 10 m/s² en la Tierra', g_L: 'gravedad de la Luna', g_M: 'gravedad de Marte',
    N: 'fuerza normal; lo que marca una balanza', T: 'tensión', T_1: 'tensión de la primera cuerda', T_2: 'tensión de la segunda cuerda',
    f_k: 'rozamiento cinético', f_s: 'rozamiento estático', 'μ_k': 'coeficiente de rozamiento cinético', 'μ_s': 'coeficiente de rozamiento estático',
    'θ': 'ángulo', v: 'rapidez (v₀, al empezar)', t: 'tiempo', d: 'distancia recorrida', r: 'radio de la curva',
    a_c: 'aceleración centrípeta', 'ω': 'rapidez angular', F_x: 'componente horizontal de una fuerza', F_y: 'componente vertical de una fuerza' };

  return {
    unidad: 'fisica.dinamica',
    version: '0.3.1',
    calidad: 2,
    estado: 'completa',
    colores: COLORES,
    notacion: { vectores: true, motivo: 'Las fuerzas, la velocidad y la aceleración son vectores: llevan flecha (F⃗, a⃗) cuando se habla de la flecha; en las cuentas va su valor, sin flecha.' },
    letras: LETRAS,
    requiere: ['/nucleo/kit/piezas/fis-estatica.js'],
    glosario: GLOSARIO,
    laboratorio,
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov).
    laboratorioIdeas: { 'bloque-libre': ['rozamiento-en-movimiento'], 'ascensor-libre': ['ascensor-y-marcos'], loma: ['centripeta-es-resultante'] },
    historia: {
      texto: 'En el siglo XVII, explicar el movimiento obligó a juntar choques, caídas y órbitas. Las conversaciones entre Halley, Hooke, Wren y Newton sobre las órbitas están en el origen de los Principia, de 1687. Newton escribió allí sus leyes del movimiento, aunque no con la fórmula escolar F = m · a: esa forma llegó después.',
      pregunta: '¿Qué dice una fuerza: hacia dónde vas o cómo cambias?',
      fuente: { titulo: 'The Newton Project — introducción', url: 'https://newtonproject.ox.ac.uk/texts/introduction' },
    },
    ideas: IDEAS,
  };
});
