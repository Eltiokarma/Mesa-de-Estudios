/*
 * Teoría de «Estática: equilibrio y torque» (fisica.estatica), para 5.º de secundaria y preuniversitario. Rehecha el
 * 19 nov 2026 con el método delegado (docs/metodo/unidad/etapa-delegada.md; propuesta en docs/etapa6/propuesta-fisica.md;
 * Gerson delegó el criterio y revisa después). Sexta unidad de la rama «Mecánica», después de Movimiento parabólico y
 * Movimiento circular; usa las componentes y la resultante de Vectores, y deja la segunda ley para Dinámica.
 *
 * Las seis ideas, en orden (los ids 1 a 5 son los publicados; `polea-movil` se fue a las ideas 2 y 4, y entró
 * `cuerpo-rigido`). Avance.migrar (nucleo/avance.js, prediccionES y estudiadaES) borra una vez las predicciones viejas
 * sin huella de las cinco que cambiaron de Predice y conserva «Ya la estudié» a quien terminó las seis de antes.
 *   1 `diagrama-y-parejas` «Primera y tercera ley de Newton» ........ el costal sobre la balanza de la bodega.
 *   2 `nudo-en-equilibrio` «Equilibrio de una partícula» ............ el letrero colgado de dos cables.
 *   3 `rozamiento-se-ajusta` «Rozamiento estático y cinético» ....... el ropero que se empuja.
 *   4 `resorte-proporcional` «Fuerza elástica: la ley de Hooke» ..... la balanza de resorte del mercado.
 *   5 `torque-y-brazo` «Torque: fuerza por brazo» ................... el sube y baja del parque.
 *   6 `cuerpo-rigido` «Equilibrio del cuerpo rígido» ................ el tablón del pintor sobre dos caballetes.
 * Objetos: pieza fis-estatica (nucleo/kit/piezas/fis-estatica.js), dibujos de prueba (data-prueba).
 *
 * Letras (propuesta §5; campo `letras`): F una fuerza (sin subíndice, la de una mano); P el peso (P_b el de una barra);
 * m la masa; g = 10 m/s²; N la normal (N_A, N_B, N_p los apoyos y la pared); T la tensión; f el rozamiento (f_s estático,
 * f_k cinético); μ_s y μ_k sus coeficientes; F_e la fuerza elástica, k la constante, x la deformación, L₀ el largo
 * natural; τ el torque; d el brazo; θ un ángulo; R la reacción de una bisagra (idea 6, con aviso).
 * REGLA DE COLORES (propuesta §6; tabla COLORES): un color fijo por clase de fuerza, el mismo en el juego, la figura, la
 *   fórmula, los datos, los ejemplos y «Ahora tú»:
 *   - carmín (c-h): el peso P⃗ y g, como g en la rama;
 *   - violeta (c-f): la normal N⃗ y toda fuerza de un apoyo (N_A, N_B, la pared, R);
 *   - naranja (c-o): lo que jala o empuja desde afuera: la tensión T⃗, la mano F⃗ y el resorte F⃗_e;
 *   - turquesa (c-i): el rozamiento f⃗ (f_s, f_k);
 *   - tinta: m, μ, k, x, L, d, τ, los ángulos, los objetos y lo que se pide en una figura («?»).
 *   Sin verde (0,010 junto al naranja en protanopía y 0,086 junto al carmín).
 * Errores (docs/investigacion/estatica-energia-ideas-erroneas.md E1, E7, E8, E10; dinamica-ideas-erroneas.md D6, D11; la
 *   trampa 7 de San Marcos: la normal igual al peso). Los demás son hipótesis de diseño: N-MG, N-SIGNO, N-F, ES-REACCION,
 *   ES-SIN-PAREJA, ES-PILA, ES-SOLO, … (descritos en el informe de estática, «Estática (19 nov)»).
 *
 * Molde: docs/teoria.md y docs/molde-unidad.md. Fuente: docs/teoria/matriz/fisica.json (unidad 4) y la propuesta.
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
  // Azar con semilla para «Ahora tú» y «Así se resuelve» (el mismo de nucleo/azar.js, en corto).
  function azar(sm) {
    let q = (sm * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = arr => arr[Math.floor(r() * arr.length)];
    return r;
  }
  // Opciones distintas: la correcta primero; un distractor que repite un texto se descarta (hay uno de reserva por tipo,
  // para que siempre salgan 4).
  function opciones(correcta, distractores, fmt, textoBien) {
    const bien = textoBien || fmt(correcta), vistos = new Set([bien]), repite = [];
    const ops = [{ id: 'c', texto: bien, correcta: true }];
    for (const d of distractores) {
      if (!d || (d.texto === undefined && !(Number.isFinite(d.valor) && d.valor >= 0))) continue;
      const txt = d.texto !== undefined ? d.texto : fmt(d.valor);
      // Un error que da la correcta (o la misma cifra que ella) es un caso mal elegido: la prueba de la unidad lo busca.
      if (txt === bien) repite.push(d.id);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    const out = ops.slice(0, 4);
    if (repite.length) Object.defineProperty(out, 'repiteCorrecta', { value: repite });
    return out;
  }
  // Valores de examen de los ángulos notables (convención del examen): 37° y 53° del triángulo 3-4-5.
  const SEN = { 0: 0, 30: 0.5, 37: 0.6, 45: Math.SQRT1_2, 53: 0.8, 60: Math.sqrt(3) / 2, 90: 1 };
  const COS = { 0: 1, 30: Math.sqrt(3) / 2, 37: 0.8, 45: Math.SQRT1_2, 53: 0.6, 60: 0.5, 90: 0 };

  // ---- Un color fijo por clase de fuerza: cada ficha dice su clase en m (lo comprueba el .test.js) ----
  const COLORES = { peso: 'h', normal: 'f', jalón: 'o', rozamiento: 'i' };
  const ficha = (c, m) => t => ({ v: c, t: String(t), m });
  const pp = ficha('c-h', 'peso'), pn = ficha('c-f', 'normal'), pj = ficha('c-o', 'jalón'), pr = ficha('c-i', 'rozamiento');
  const P = pp('P'), g = pp('g'), N = pn('N'), T = pj('T'), F = pj('F'), fr = pr('f');
  const sub = (x, i) => ({ sub: [x, i] });
  const vec = x => ({ vec: [x] });
  const neg = l => ({ negrita: [l] });
  const Fe = sub(F, 'e'), fs = sub(fr, 's'), fk = sub(fr, 'k'), NA = sub(N, 'A'), NB = sub(N, 'B');
  const SF = ['Σ', vec('F')];
  const est = (datos, estado = {}) => ({ pieza: 'fis-estatica', datos, estado });
  const N_ = v => `${f(v)} N`;
  // Un valor que se escribe con «=» tiene que ser exacto con dos decimales (auditoría de la etapa 5: nada de redondeos con «=»).
  const exacto = x => Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const elegir = (r, fn) => { for (let i = 0; i < 200; i++) { const c = fn(); if (c) return c; } throw new Error('estatica: sin caso exacto'); };

  // Datos de cada ejercicio (contrato, punto 13): herramientas, nunca el paso hecho; ningún atajo ni consejo.
  const D = {
    peso: ['Peso: ', P, ' = m · ', g, ', con ', g, ' = 10 m/s²'],
    primera: ['Primera ley: ', ...SF, ' = 0 si está quieto o va a velocidad constante'],
    tercera: 'Tercera ley: la fuerza de A sobre B es igual y opuesta a la de B sobre A',
    balanza: ['La balanza marca con qué fuerza la aprietan: la pareja de ', N, ' sobre lo que se apoya'],
    vertical: 'Hacia arriba suman lo mismo que hacia abajo',
  };

  // ======================= 1: primera y tercera ley (el costal sobre la balanza) =======================
  // Cambia: la masa del costal y lo que jala la cuerda · Permanece: el costal quieto · Progresa: la flecha N⃗ que
  // achica la cuerda · Se reserva: el empujón hacia abajo (Predice) · Debe verse: la balanza marca N = P − T, no el peso.
  // Lienzo: la escena a la izquierda (balanza de 30 a 140, piso en y = 236) y el DCL del costal a la derecha (caja
  // centrada en x = 262, y = 122). Todas las flechas del DCL con la misma escala (K1 px por newton).
  const K1 = 0.14;
  // Largo de una flecha: a escala (k px por newton, con un mínimo para que se vea el palo), salvo lo que se pide («?») o
  // una figura sin escala, que van todas con el mismo largo (auditoría: la flecha no dice lo que se pregunta).
  const LARGO_FIJO = 30;
  const largoDe = (v, t, k, fijo) => (fijo || /\?/.test(t || '') ? LARGO_FIJO : Math.max(18, v * k));
  function dclCostal(fz, o = {}) {
    const cx = o.cx || 258, cy = o.cy || 124, h = 16, k = o.k || K1, dx = 15, fijo = !!o.sinEscala;
    const fl = [];
    const L = (v, t) => largoDe(v, t, k, fijo);
    if (fz.P) fl.push({ de: [cx - dx, cy + h], ang: 270, largo: L(fz.P, fz.tP), color: 'h', texto: fz.tP || `P = ${N_(fz.P)}`, rumbo: [-1, 0.6], paso: o.pP });
    // la mano empuja por arriba: la flecha llega a la cara de arriba del cuerpo
    if (fz.F) { const lf = L(fz.F, fz.tF); fl.push({ de: [cx + dx, cy - h - lf], ang: 270, largo: lf, color: 'o', texto: fz.tF || `F = ${N_(fz.F)}`, lado: -1, paso: o.pF }); }
    if (fz.N !== undefined && (fz.N > 0 || /\?/.test(fz.tN || ''))) fl.push({ de: [cx - dx, cy - h], ang: 90, largo: L(fz.N, fz.tN), color: 'f', texto: fz.tN || `N = ${N_(fz.N)}`, rumbo: [-1, -0.6], paso: o.pN });
    if (fz.T) fl.push({ de: [cx + dx, cy - h], ang: 90, largo: L(fz.T, fz.tT), color: 'o', texto: fz.tT || `T = ${N_(fz.T)}`, rumbo: [1, -0.6], paso: o.pT });
    return { obj: [{ tipo: 'caja', fig: true, x: cx, y: cy + h, w: 44, h: 2 * h, texto: o.nombre === undefined ? '' : o.nombre }], fl,
      txt: o.sinTitulo ? [] : [{ x: cx, y: 18, texto: o.titulo || 'DCL del costal', ancla: 'middle', peso: 400 }] };
  }
  // Una cosa apoyada en el piso, a la izquierda, y su DCL a la derecha (los ejemplos de una sola cosa).
  function figDcl(o) {
    const piso = 220, d = dclCostal(o.fz, Object.assign({ titulo: `DCL de ${o.de}` }, o.dcl || {}));
    const c = Object.assign({ tipo: 'caja', x: 85, y: piso, w: 74, h: 48 }, o.cosa);
    return { alto: 240, piso: { y: piso, x0: 8, x1: 190 }, objetos: [c, ...(o.extra || []), ...d.obj], flechas: d.fl, textos: [...d.txt, ...(o.textos || [])], alt: o.alt };
  }
  // El costal sobre la balanza; la cuerda que lo jala o la mano que lo empuja. `lectura` es lo que dice la pantalla.
  function figBalanza(o) {
    const xb = 90, piso = 236, costalY = piso - 26, d = dclCostal(o.fz || {}, o.dcl || {});
    const objs = [{ tipo: 'balanza', x: xb, y: piso, w: 120, lectura: o.lectura }, { tipo: o.cuerpo || 'costal', x: xb, y: costalY, w: 66, h: 62, texto: o.texto }];
    if (o.cuerda) objs.push({ tipo: 'cuerda', de: [xb, costalY - 58], a: [xb, 8], floja: o.cuerda === 'floja' });
    if (o.mano) objs.push({ tipo: 'persona', x: 18, y: piso, alto: 96, mano: [xb - 20, costalY - 60] });
    return { alto: 250, piso: { y: piso, x0: 8, x1: 206 }, objetos: [...objs, ...d.obj], flechas: d.fl,
      textos: [...d.txt, ...(o.cuerda && !o.sinNombreCuerda ? [{ x: xb + 8, y: 24, texto: 'cuerda', ancla: 'start', peso: 400 }] : []), ...(o.textos || [])],
      alt: o.alt };
  }
  const juego1 = val => {
    const Pv = val.m * G, Nv = Pv - val.T;
    return est(figBalanza({ cuerda: val.T > 0 ? true : 'floja', lectura: N_(Nv), fz: { P: Pv, N: Nv, T: val.T, tN: 'N⃗', tP: 'P⃗', tT: 'T⃗' },
      alt: `Un costal de ${val.m} kg sobre la balanza de la bodega; la cuerda lo jala hacia arriba con ${val.T} N y la balanza marca ${f(Nv)} N.` }));
  };
  const PRED1 = figBalanza({ mano: true, lectura: '? N', fz: { P: 400, F: 100, N: 0, tP: 'P = 400 N', tF: 'F = 100 N', tN: 'N = ?' }, dcl: { sinEscala: true },
    alt: 'Una persona empuja hacia abajo, con la mano, el costal de 40 kg puesto sobre la balanza. La pantalla dice «? N».' });
  const REVELA1 = figBalanza({ mano: true, lectura: '500 N', fz: { P: 400, F: 100, N: 500 },
    alt: 'El costal de 40 kg empujado con 100 N: la balanza lo empuja hacia arriba con 500 N y marca 500 N.' });
  // Mira: el DCL se arma de a una fuerza; al final, las dos parejas (la de N⃗ en la balanza y la del peso en la Tierra).
  const MIRA1 = (() => {
    const b = figBalanza({ mano: true, lectura: '500 N', fz: { P: 400, F: 100, N: 500 }, dcl: { pP: 1, pF: 2, pN: 3 },
      alt: 'El costal empujado sobre la balanza y, al lado, su diagrama de cuerpo libre, que se arma de a una fuerza.' });
    // La pareja de N⃗ (el costal aprieta la balanza) y la del peso (el costal jala la Tierra), escritas arriba.
    b.textos.push({ x: 8, y: 92, texto: 'costal → balanza: 500 N ↓', ancla: 'start', color: 'f', paso: 4 });
    b.textos.push({ x: 8, y: 114, texto: 'costal → Tierra: 400 N ↑', ancla: 'start', color: 'h', paso: 5 });
    b.textos.push({ x: 8, y: 70, texto: 'costal → mano: 100 N ↑', ancla: 'start', color: 'o', paso: 6 });
    return b;
  })();

  // Ejemplos resueltos de la idea 1. Cuentas rehechas con un script aparte que no usa este archivo (scratchpad
  // e6-fisica/cuentas.js: suma las fuerzas de cada DCL con su signo y busca la que falta para que den cero): 25·10;
  // 4·10; 300 − 100; la pareja de 2 N; 100 + 50; (180 + 70)/10; 50 + 80; 50 y 50; 600 + 50; 350; 700 − 200 y cada
  // alternativa; 550 + 150; 20 + 30; la pareja de la normal; la pareja de 2 N.
  const figCosa = (o) => {
    const piso = o.piso || 200, x = o.x || 110;
    const objs = (o.pila || [{ tipo: 'caja', w: 70, h: 44, texto: o.texto }]).reduce((acc, c) => {
      const y = acc.y; acc.l.push(Object.assign({ x, y }, c)); acc.y = y - (c.h || 40); return acc; }, { y: piso, l: [] }).l;
    return { alto: o.alto || 230, piso: { y: piso, x0: 8, x1: o.pisoHasta || 312 }, objetos: [...objs, ...(o.extra || [])], flechas: o.flechas || [], textos: o.textos || [], alt: o.alt };
  };
  const EJEMPLOS_DCL = [
    { nivel: 1, titulo: 'El peso de un costal',
      figura: est(figDcl({ de: 'el costal', cosa: { tipo: 'costal', w: 70, h: 64, texto: '25 kg' }, fz: { P: 250, tP: 'P = ?' },
        alt: 'Un costal de 25 kg sobre el piso y, al lado, su peso hacia abajo con un signo de pregunta.' })),
      enunciado: ['En la bodega hay un costal de arroz de 25 kg. ¿Cuánto pesa?'],
      datos: [D.peso],
      solucion: [{ texto: 'El peso es la masa por g, que vale 10 m/s²; con la masa en kilos, el peso sale en newtons:', ecuacion: [P, ' = 25 · 10 = ', pp('250 N')] }],
      respuesta: ['Pesa ', pp('250 N')] },
    { nivel: 1, titulo: 'La mochila en el piso',
      figura: est(figCosa({ pila: [{ tipo: 'caja', w: 72, h: 46, texto: 'mochila' }], flechas: [{ de: [110, 154], ang: 90, largo: 40, color: 'f', texto: 'N = ?' }],
        textos: [{ x: 312, y: 30, texto: '4 kg', ancla: 'end' }], alt: 'Una mochila de 4 kg quieta en el piso; la fuerza del piso sobre ella, con un signo de pregunta.' })),
      enunciado: ['Una mochila de 4 kg está quieta en el piso. ¿Con qué fuerza la empuja el piso hacia arriba?'],
      datos: [D.peso, D.primera],
      solucion: [{ texto: 'La mochila está quieta, así que lo que la empuja hacia arriba iguala a lo que la jala hacia abajo. Como solo actúan el piso y el peso, la normal iguala al peso:', ecuacion: [N, ' = ', P, ' = 4 · 10 = ', pn('40 N')] }],
      respuesta: [N, ' = ', pn('40 N')] },
    { nivel: 1, titulo: 'Lo que marca la balanza',
      figura: est(figBalanza({ cuerda: true, lectura: '? N', fz: { P: 300, T: 100, N: 0, tP: 'P = 300 N', tT: 'T = 100 N', tN: 'N = ?' }, dcl: { sinEscala: true }, alt: 'Un costal de 30 kg sobre la balanza, jalado hacia arriba con una cuerda con 100 N.' })),
      enunciado: ['Un costal de 30 kg está sobre la balanza. Una cuerda lo jala hacia arriba con ', pj('100 N'), ' y sigue quieto. ¿Cuánto marca la balanza?'],
      datos: [D.peso, D.primera, D.balanza],
      solucion: [{ texto: 'El costal pesa 300 N y está quieto. La cuerda sostiene 100 N de ese peso, y la balanza empuja hacia arriba el resto, que es lo que marca:', ecuacion: [N, ' = 300 − 100 = ', pn('200 N')] }],
      respuesta: ['Marca ', pn('200 N')] },
    { nivel: 1, titulo: 'La naranja jala a la Tierra',
      figura: est(figDcl({ de: 'la naranja', cosa: { tipo: 'caja', w: 70, h: 30, texto: 'naranja' }, fz: { P: 2, tP: 'P = 2 N' }, dcl: { k: 25, cx: 250 },
        textos: [{ x: 8, y: 50, texto: 'Tierra → naranja: 2 N ↓', ancla: 'start', color: 'h' }, { x: 8, y: 72, texto: 'naranja → Tierra: ?', ancla: 'start' }], alt: 'Una naranja sobre la mesa: la Tierra la jala hacia abajo con 2 N; la fuerza de la naranja sobre la Tierra, con un signo de pregunta.' })),
      enunciado: ['La Tierra jala a una naranja hacia abajo con ', pp('2 N'), '. ¿Con qué fuerza, y hacia dónde, jala la naranja a la Tierra?'],
      datos: [D.tercera],
      solucion: [{ texto: 'Por la tercera ley, si la Tierra jala a la naranja, la naranja jala a la Tierra con la misma fuerza y al revés. Si la Tierra casi no se mueve, es por su masa enorme, no porque la jalen menos.', ecuacion: ['naranja → Tierra: ', pp('2 N'), ', hacia arriba'] }],
      respuesta: [pp('2 N'), ', hacia arriba'] },
    { nivel: 1, titulo: 'Apretar la caja contra el piso',
      figura: est(figCosa({ pila: [{ tipo: 'caja', w: 70, h: 44, texto: '10 kg' }], extra: [{ tipo: 'persona', x: 34, y: 200, alto: 92, mano: [96, 156] }],
        flechas: [{ de: [128, 126], ang: 270, largo: 28, color: 'o', texto: 'F = 50 N', lado: 1 }], alt: 'Una persona aprieta hacia abajo una caja de 10 kg con 50 N.' })),
      enunciado: ['Una caja de 10 kg está en el piso. La aprietas hacia abajo con la mano, con ', pj('50 N'), '. ¿Con qué fuerza empuja el piso a la caja?'],
      datos: [D.peso, D.primera],
      solucion: [{ texto: 'La caja pesa 100 N. Hacia abajo la empujan su peso y tu mano, y hacia arriba solo el piso; como está quieta, el piso empuja lo que suman las dos:', ecuacion: [N, ' = 100 + 50 = ', pn('150 N')] }],
      respuesta: [N, ' = ', pn('150 N')] },
    { nivel: 2, titulo: '¿Cuánta masa tiene el costal?',
      figura: est(figBalanza({ cuerda: true, lectura: '180 N', fz: { P: 1, N: 180, T: 70, tP: 'P = ?', tN: 'N = 180 N', tT: 'T = 70 N' }, dcl: { sinEscala: true }, texto: '? kg', alt: 'Un costal sobre la balanza, jalado con 70 N; la balanza marca 180 N.' })),
      enunciado: ['Mientras una cuerda jala un costal hacia arriba con ', pj('70 N'), ', la balanza marca ', pn('180 N'), '. ¿Qué masa tiene el costal?'],
      datos: [D.peso, D.primera, D.balanza],
      solucion: [
        { texto: 'El costal está quieto, así que su peso iguala a lo que lo sostiene hacia arriba: la balanza y la cuerda juntas.', ecuacion: [P, ' = 180 + 70 = ', pp('250 N')] },
        { texto: 'Como el peso es la masa por g, la masa es el peso entre g:', ecuacion: ['m = ', { frac: [pp('250'), '10'] }, ' = 25 kg'] },
      ],
      respuesta: [neg('m = 25 kg')] },
    { nivel: 2, titulo: 'Dos cajas, una sobre otra',
      figura: est(figCosa({ pila: [{ tipo: 'caja', w: 80, h: 44, texto: 'B: 8 kg' }, { tipo: 'caja', w: 60, h: 36, texto: 'A: 5 kg' }],
        textos: [{ x: 312, y: 30, texto: 'piso sobre B: ?', ancla: 'end' }],
        alt: 'La caja A, de 5 kg, sobre la caja B, de 8 kg, en el piso.' })),
      enunciado: ['La caja A, de 5 kg, está sobre la caja B, de 8 kg, y las dos están quietas en el piso. ¿Con qué fuerza empuja el piso a B?'],
      datos: [D.peso, D.primera, D.tercera],
      solucion: [
        { texto: 'Sobre B empujan hacia abajo su peso, 80 N, y la caja A. Como A está quieta, B la sostiene con 50 N, y por la tercera ley A aprieta a B con esos mismos 50 N:', ecuacion: [pp('80 N'), ' + ', pn('50 N'), ' = 130 N'] },
        { texto: 'Hacia arriba solo empuja el piso, y B está quieta: el piso empuja lo mismo que suman las dos fuerzas de abajo.', ecuacion: [sub(N, 'piso'), ' = ', pn('130 N')] },
      ],
      respuesta: [sub(N, 'piso'), ' = ', pn('130 N')] },
    { nivel: 2, titulo: 'Entre las dos cajas',
      figura: est(figCosa({ pila: [{ tipo: 'caja', w: 80, h: 44, texto: 'B: 8 kg' }, { tipo: 'caja', w: 60, h: 36, texto: 'A: 5 kg' }],
        textos: [{ x: 312, y: 30, texto: 'B sobre A: ?', ancla: 'end' }, { x: 312, y: 50, texto: 'A sobre B: ?', ancla: 'end' }], alt: 'La caja A sobre la caja B, en el piso.' })),
      enunciado: ['La caja A, de 5 kg, está sobre la caja B, de 8 kg, y las dos están quietas en el piso. ¿Con qué fuerza empuja B a A, y con cuál empuja A a B?'],
      datos: [D.peso, D.primera, D.tercera],
      solucion: [
        { texto: 'Sobre A solo actúan su peso y el empujón de B. Como A está quieta, B la empuja hacia arriba con lo mismo que A pesa:', ecuacion: [sub(N, 'B→A'), ' = ', P, ' = 5 · 10 = ', pn('50 N')] },
        { texto: 'Por la tercera ley, A empuja a B con la misma fuerza, pero hacia abajo. Son una pareja: cada fuerza actúa sobre una caja distinta.', ecuacion: [sub(N, 'A→B'), ' = ', pn('50 N'), ', hacia abajo'] },
      ],
      respuesta: ['Las dos miden ', pn('50 N'), ', en sentidos opuestos'] },
    { nivel: 2, titulo: 'La balanza y la mochila',
      figura: est({ alto: 236, piso: { y: 222 }, objetos: [{ tipo: 'balanza', x: 120, y: 222, w: 96, lectura: '? N' }, { tipo: 'persona', x: 120, y: 196, alto: 126, mano: [104, 134], texto: '60 kg' },
        { tipo: 'caja', x: 100, y: 142, w: 24, h: 36, texto: '' }], textos: [{ x: 8, y: 40, texto: 'mochila: 5 kg', ancla: 'start' }],
        alt: 'Una persona de 60 kg sobre la balanza, con una mochila de 5 kg en la espalda.' }),
      enunciado: ['Una persona de 60 kg se para en la balanza con una mochila de 5 kg en la espalda. ¿Cuánto marca la balanza?'],
      datos: [D.peso, D.primera, D.balanza],
      solucion: [
        { texto: 'La mochila está quieta, así que la persona la sostiene con 50 N y, por la tercera ley, la mochila la aprieta hacia abajo con 50 N. Sobre la persona empujan hacia abajo su peso y la mochila:', ecuacion: [pp('600 N'), ' + ', pp('50 N'), ' = 650 N'] },
        { texto: 'La persona está quieta, así que la balanza la empuja hacia arriba con lo mismo, y eso es lo que marca la pantalla.', ecuacion: [N, ' = ', pn('650 N')] },
      ],
      respuesta: ['Marca ', pn('650 N')] },
    { nivel: 2, titulo: 'Que la balanza marque cero',
      figura: est(figBalanza({ cuerda: true, lectura: '0 N', fz: { P: 350, T: 350, tP: 'P', tT: 'T = ?' }, texto: '35 kg', alt: 'Un costal de 35 kg sobre la balanza, jalado con una cuerda; la balanza marca 0 N.' })),
      enunciado: ['Un costal de 35 kg está sobre la balanza. ¿Con cuánta fuerza hay que jalar la cuerda hacia arriba para que la balanza marque 0 N sin que el costal suba?'],
      datos: [D.peso, D.primera, D.balanza],
      solucion: [
        { texto: 'La balanza marca la fuerza con que empuja al costal; si marca cero, ya no lo empuja:', ecuacion: [N, ' = 0'] },
        { texto: 'Sobre el costal quedan solo el peso y la cuerda, y sigue quieto: la cuerda tiene que sostener todo el peso.', ecuacion: [T, ' = ', P, ' = 35 · 10 = ', pj('350 N')] },
      ],
      respuesta: [T, ' = ', pj('350 N')] },
    { nivel: 3, titulo: 'Jalar la cuerda del techo',
      figura: est({ alto: 240, piso: { y: 226 }, techo: { y: 10, x0: 60, x1: 200 }, objetos: [{ tipo: 'balanza', x: 120, y: 226, w: 96, lectura: '? N' },
        { tipo: 'cuerda', de: [150, 10], a: [150, 104] }, { tipo: 'persona', x: 120, y: 200, alto: 128, mano: [150, 104], texto: '70 kg' }],
        flechas: [{ de: [170, 100], ang: 270, largo: 34, color: 'o', texto: '200 N' }], alt: 'Una persona de 70 kg sobre la balanza jala hacia abajo, con 200 N, una cuerda amarrada al techo.' }),
      enunciado: ['Una persona de 70 kg está sobre la balanza y jala hacia abajo, con ', pj('200 N'), ', una cuerda amarrada al techo. ¿Cuánto marca la balanza?'],
      alternativas: ['700 N', '500 N', '900 N', '200 N', '300 N'],
      datos: [D.peso, D.primera, D.tercera, D.balanza],
      solucion: [
        { texto: 'La persona jala la cuerda hacia abajo y, por la tercera ley, la cuerda jala a la persona hacia arriba con 200 N. Esa es la fuerza que va en el DCL de la persona.' },
        { texto: 'Sobre la persona actúan su peso, 700 N hacia abajo, y dos fuerzas hacia arriba: la cuerda y la balanza. Como está quieta, a la balanza le toca lo que la cuerda no sostiene:', ecuacion: [N, ' = 700 − 200 = ', pn('500 N')] },
        { texto: ['La ', neg('A'), ' supone que la balanza marca siempre el peso y olvida la cuerda. La ', neg('C'), ' suma los 200 N como si la cuerda empujara hacia abajo. La ', neg('D'), ' da solo la cuerda, y la ', neg('E'), ' resta los 200 N dos veces, aunque son una sola fuerza.'] },
      ],
      respuesta: [neg('B'), ', marca ', pn('500 N')] },
    { nivel: 3, titulo: 'Subir una pesa sobre la balanza',
      figura: est({ alto: 240, piso: { y: 226 }, objetos: [{ tipo: 'balanza', x: 120, y: 226, w: 96, lectura: '? N' }, { tipo: 'persona', x: 120, y: 200, alto: 124, mano: [152, 66] },
        { tipo: 'caja', x: 156, y: 66, w: 46, h: 22, texto: '15 kg' }], textos: [{ x: 8, y: 30, texto: 'sube a velocidad constante', ancla: 'start', peso: 400 }, { x: 8, y: 140, texto: 'persona: 55 kg', ancla: 'start' }],
        alt: 'Una persona de 55 kg sobre la balanza sube una pesa de 15 kg por encima de la cabeza.' }),
      enunciado: ['Una persona de 55 kg está sobre la balanza y sube una pesa de 15 kg a velocidad constante. Mientras sube, ¿cuánto marca la balanza?'],
      alternativas: ['400 N', '550 N', '850 N', '700 N', '150 N'],
      datos: [D.peso, D.primera, D.tercera, D.balanza],
      solucion: [
        { texto: 'La pesa sube a velocidad constante, así que sus fuerzas suman cero, como si estuviera quieta: la mano la empuja con 150 N, lo que pesa, y por la tercera ley la pesa empuja la mano hacia abajo con 150 N.', ecuacion: [pj('150 N')] },
        { texto: 'Sobre la persona empujan hacia abajo su peso, 550 N, y la pesa, 150 N. La persona tampoco acelera, así que la balanza la empuja hacia arriba con la suma:', ecuacion: [N, ' = 550 + 150 = ', pn('700 N')] },
        { texto: ['La ', neg('A'), ' resta la pesa, como si jalara hacia arriba. La ', neg('B'), ' olvida que la pesa aprieta las manos. La ', neg('C'), ' cree que subir pide 150 N más, pero a velocidad constante no hace falta, y la ', neg('E'), ' da solo la pesa.'] },
      ],
      respuesta: [neg('D'), ', marca ', pn('700 N')] },
    { nivel: 3, titulo: 'Tres cajas apiladas',
      figura: est(figCosa({ pila: [{ tipo: 'caja', w: 90, h: 40, texto: '5 kg' }, { tipo: 'caja', w: 74, h: 36, texto: '3 kg' }, { tipo: 'caja', w: 56, h: 32, texto: '2 kg' }],
        textos: [{ x: 312, y: 30, texto: 'de abajo sobre la del medio: ?', ancla: 'end', peso: 400 }], alt: 'Tres cajas apiladas: 2 kg arriba, 3 kg al medio y 5 kg abajo.' })),
      enunciado: ['Tres cajas quietas están apiladas: 2 kg arriba, 3 kg al medio y 5 kg abajo, sobre el piso. ¿Con qué fuerza empuja la caja de abajo a la del medio?'],
      alternativas: ['50 N', '30 N', '100 N', '80 N', '20 N'],
      datos: [D.peso, D.primera, D.tercera],
      solucion: [
        { texto: 'Sobre la caja del medio empujan hacia abajo su peso, 30 N, y la caja de arriba, que está quieta y la aprieta con su propio peso, 20 N:', ecuacion: [pp('30 N'), ' + ', pp('20 N'), ' = 50 N'] },
        { texto: 'La caja del medio está quieta, así que la de abajo la empuja hacia arriba con lo mismo que suman esas dos fuerzas.', ecuacion: [N, ' = ', pn('50 N')] },
        { texto: ['La ', neg('B'), ' cuenta solo el peso de la del medio y olvida la de arriba. La ', neg('C'), ' suma las tres, pero la de abajo no se carga a sí misma. La ', neg('D'), ' suma la del medio y la de abajo, y la ', neg('E'), ' da solo la de arriba.'] },
      ],
      respuesta: [neg('A'), ', ', pn('50 N')] },
    { nivel: 3, titulo: 'La pareja de la normal',
      figura: est(figCosa({ pila: [{ tipo: 'caja', w: 74, h: 30, texto: 'libro' }], flechas: [{ de: [110, 170], ang: 90, largo: 40, color: 'f', texto: 'mesa → libro' }],
        textos: [{ x: 8, y: 216, texto: 'mesa', ancla: 'start', peso: 400 }], alt: 'Un libro sobre la mesa; la fuerza con que la mesa lo empuja hacia arriba.' })),
      enunciado: ['Un libro está quieto sobre la mesa. ¿Cuál es la pareja, según la tercera ley, de la fuerza con que la mesa empuja al libro hacia arriba?'],
      alternativas: ['El peso del libro, hacia abajo', 'La Tierra que jala a la mesa hacia abajo', 'El piso que empuja a la mesa', 'La mesa no tiene pareja: no se mueve', 'El libro que empuja la mesa hacia abajo'],
      datos: [D.tercera, D.primera],
      solucion: [
        { texto: 'La pareja de «la mesa empuja al libro» es «el libro empuja a la mesa»: son los mismos dos cuerpos, con los papeles al revés.' },
        { texto: ['La ', neg('A'), ' mide lo mismo que la normal y apunta al revés, pero actúa sobre el mismo libro y viene de otra interacción, la de la Tierra. La ', neg('B'), ' y la ', neg('C'), ' son fuerzas entre otros cuerpos. La ', neg('D'), ' olvida que toda fuerza tiene pareja, se mueva o no.'] },
      ],
      respuesta: [neg('E'), ': el libro empuja la mesa hacia abajo'] },
    { nivel: 3, titulo: 'El imán y el clavo',
      figura: est({ alto: 150, piso: { y: 130 }, objetos: [{ tipo: 'caja', x: 90, y: 130, w: 70, h: 40, texto: 'imán' }, { tipo: 'caja', x: 262, y: 130, w: 56, h: 16, texto: 'clavo' }],
        flechas: [{ de: [234, 122], ang: 180, largo: 44, color: 'o', texto: '2 N', lado: 1 }, { de: [125, 100], ang: 0, largo: 44, color: 'o', texto: '?', lado: -1 }],
        alt: 'Un imán atrae a un clavo con 2 N; la fuerza del clavo sobre el imán, con un signo de pregunta.' }),
      enunciado: ['Sobre la mesa, un imán atrae a un clavo con ', pj('2 N'), '. En ese momento, ¿con qué fuerza atrae el clavo al imán?'],
      alternativas: ['0 N: el clavo no es un imán', 'Menos de 2 N: el clavo es más chico', '2 N, hacia el clavo', 'Más de 2 N: el clavo se mueve', '4 N: las dos se suman'],
      datos: [D.tercera],
      solucion: [
        { texto: 'El imán jala al clavo y el clavo jala al imán: es una pareja de la tercera ley. Por eso la fuerza del clavo sobre el imán mide lo mismo, 2 N, y apunta hacia el clavo.' },
        { texto: ['La ', neg('A'), ' cree que solo el imán atrae, pero toda fuerza va entre dos cuerpos. La ', neg('B'), ' y la ', neg('D'), ' miran el tamaño o el movimiento, que no cambian la pareja. La ', neg('E'), ' suma dos fuerzas que actúan sobre cuerpos distintos.'] },
      ],
      respuesta: [neg('C'), ', ', pj('2 N'), ', hacia el clavo'] },
  ];

  // Casos de «Ahora tú» y «Así se resuelve» de la idea 1, de listas distintas (regla resuelve-repite). Ninguno es el de
  // Predice (40 kg empujado con 100 N).
  const COSAS_AT = [{ nombre: 'un costal de papas', cuerpo: 'costal', lo: 'Lo' }, { nombre: 'una caja de frutas', cuerpo: 'caja', lo: 'La' }, { nombre: 'un saco de quinua', cuerpo: 'costal', lo: 'Lo' }];
  const COSAS_RS = [{ nombre: 'una caja de herramientas', cuerpo: 'caja', lo: 'La' }, { nombre: 'un balde de arena', cuerpo: 'balde', lo: 'Lo' }];
  const PAREJAS = [
    { de: 'el peso de una pelota (la Tierra la jala hacia abajo)', bien: 'La pelota jala a la Tierra hacia arriba', mismo: 'El piso de la cancha empuja a la pelota hacia arriba', otro: 'La pelota empuja el piso hacia abajo' },
    { de: 'la fuerza con que el piso empuja una caja hacia arriba', bien: 'La caja empuja el piso hacia abajo', mismo: 'La Tierra jala a la caja hacia abajo', otro: 'La caja jala a la Tierra hacia arriba' },
    { de: 'la fuerza con que una cuerda jala una lámpara hacia arriba', bien: 'La lámpara jala la cuerda hacia abajo', mismo: 'La Tierra jala a la lámpara hacia abajo', otro: 'El techo jala la cuerda hacia arriba' },
    { de: 'la fuerza con que tu mano empuja una pared', bien: 'La pared empuja tu mano', mismo: 'El piso frena tus zapatos', otro: 'La Tierra jala a la pared hacia abajo' },
  ];
  function casoNormal(r, lista, sm) {
    const ob = r.de(lista), m = r.de([15, 20, 25, 30, 45]), Fm = r.de([50, 60, 80, 120]), abajo = sm % 8 < 4;
    const Pv = m * G, Nv = abajo ? Pv + Fm : Pv - Fm;
    return { ob, m, Fm, abajo, Pv, Nv,
      dibujo: est(abajo ? figBalanza({ mano: true, cuerpo: ob.cuerpo, texto: `${m} kg`, lectura: '? N', fz: { P: Pv, F: Fm, N: 0, tP: `P = ${N_(Pv)}`, tF: `F = ${N_(Fm)}`, tN: 'N = ?' }, dcl: { titulo: 'DCL', sinEscala: true } })
        : figBalanza({ cuerda: true, cuerpo: ob.cuerpo, texto: `${m} kg`, lectura: '? N', fz: { P: Pv, T: Fm, N: 0, tP: `P = ${N_(Pv)}`, tT: `T = ${N_(Fm)}`, tN: 'N = ?' }, dcl: { titulo: 'DCL', sinEscala: true } })) };
  }
  const dcl = {
    id: 'diagrama-y-parejas',
    titulo: 'Primera y tercera ley de Newton',
    pregunta: '¿La balanza marca siempre lo que pesa el costal?',
    temas: ['Primera y tercera ley de Newton', 'Diagrama de cuerpo libre'],
    pieza: 'fis-estatica',
    aprendizaje: 'Si un cuerpo está quieto, sus fuerzas suman cero: la normal no siempre iguala al peso, y cada fuerza tiene pareja en el otro cuerpo.',
    actividad: 'Jalar con una cuerda un costal puesto sobre la balanza de la bodega.',
    lee: {
      tarjetas: [
        { titulo: 'Empujones y jalones', texto: ['Una fuerza es un empujón o un jalón que un cuerpo le hace a otro, y se mide en newtons (N). Como importa hacia dónde apunta, se dibuja con una flecha. La Tierra jala hacia abajo cada kilo con unos 10 N, y ese jalón es el peso, ', P, ': la masa m por ', g, ', que vale 10 m/s².'],
          ecuacion: [P, ' = m · ', g] },
        { titulo: 'Un cuerpo a la vez', texto: ['Para estudiar un cuerpo se dibuja solo él, aparte de lo que lo rodea, con una flecha por cada fuerza que otro cuerpo le hace. Ese dibujo es su diagrama de cuerpo libre, o DCL. En el del costal van dos flechas: su peso, ', vec(P), ', y el empujón de la balanza, ', vec(N), '.'],
          dibujo: est(figBalanza({ fz: { P: 400, N: 400, tN: 'N⃗', tP: 'P⃗' }, lectura: '400 N', alt: 'Un costal sobre la balanza y, al lado, su diagrama de cuerpo libre con el peso y la fuerza de la balanza.' })) },
        { titulo: 'Qué mirar al jugar', texto: ['La balanza de la bodega empuja al costal hacia arriba, y esa fuerza se llama normal, ', N, ', porque sale perpendicular a la superficie donde se apoya. La pantalla muestra cuánto vale. Al jugar, jala la cuerda y fíjate qué flecha se achica.'] },
      ],
    },
    ejemplos: EJEMPLOS_DCL,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'El costal está sobre la balanza de la bodega y tú lo jalas con una cuerda. Cada kilo pesa 10 N (g = 10 m/s²).',
      mision: {
        texto: 'Haz que la balanza marque justo la mitad de lo que pesa el costal.',
        // Tres maneras: 20 kg con 100 N, 30 kg con 150 N y 40 kg con 200 N.
        logrado: val => Math.abs(val.m * G - val.T - val.m * G / 2) < 1e-9,
        bien: 'Coincide: la cuerda sostiene la mitad del peso y la balanza aguanta la otra mitad.',
      },
      voz: 'Jala la cuerda. ¿Qué flecha se achica?',
      leyenda: [
        { s: [vec(P)], t: 'peso: la Tierra jala al costal' },
        { s: [vec(N)], t: 'la balanza empuja al costal hacia arriba' },
        { s: [vec(T)], t: 'la cuerda jala al costal' },
        { s: 'pantalla', t: 'lo que marca la balanza, en newtons' },
        { s: 'DCL', t: 'solo las fuerzas que actúan sobre el costal' },
        { s: [g], t: 'gravedad: cada kilo pesa 10 N' },
      ],
      controles: [
        { id: 'm', etiqueta: 'Costal, m', min: 20, max: 50, paso: 10, inicio: 40, unidad: 'kg', decimales: 0 },
        { id: 'T', etiqueta: 'Cuerda, T', color: 'c-o', min: 0, max: 200, paso: 25, inicio: 0, unidad: 'N', decimales: 0 },
      ],
      dibujo: juego1,
      // La lectura enuncia la relación de lo que marca la balanza (con la cuerda que jala hacia arriba).
      lectura: val => (val.T === 0 ? ['Marca ', pn(N_(val.m * G)), ': nadie más sostiene el costal'] : ['Marca ', pn(N_(val.m * G - val.T)), ' = ', pp(N_(val.m * G)), ' − ', pj(N_(val.T)), ' de la cuerda']),
      resumen: { m: 40, T: 100 },
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora no jalas: con la mano empujas el costal hacia abajo. ¿Cuánto marca la balanza?',
      datos: ['El costal pesa 400 N.', 'Tu mano lo empuja hacia abajo con 100 N.'],
      opciones: [
        { id: 'c', texto: '500 N', correcta: true },
        { id: 'peso', texto: '400 N', error: 'N-MG', siFuera: 'Marcaría 400 N si nadie más tocara el costal, porque la balanza solo aguantaría su peso. Pero tu mano también lo aprieta contra la balanza, y ese empujón llega a la pantalla.' },
        { id: 'resta', texto: '300 N', error: 'N-SIGNO', siFuera: 'Restar valía con la cuerda, porque jalaba hacia arriba y sostenía una parte del costal. Tu mano empuja hacia abajo, en el mismo sentido que el peso, así que no le quita carga a la balanza: se la aumenta.' },
        { id: 'mano', texto: '100 N', error: 'N-F', siFuera: 'Sería 100 N si el costal no pesara nada y solo quedara tu mano. Pero el costal también pesa, y la balanza tiene que aguantar las dos fuerzas que empujan hacia abajo.' },
      ],
      dibujo: est(PRED1),
      revelar: est(REVELA1),
      coincide: 'Coincide: la balanza aguanta el peso y tu empujón, 400 N + 100 N = 500 N.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: MIRA1,
      pasos: [
        { estado: { paso: 0 }, texto: 'Se dibuja solo el costal, separado de la balanza y de tu mano: es su diagrama de cuerpo libre, con una flecha por cada fuerza que recibe.' },
        { estado: { paso: 1 }, texto: 'La primera flecha es el peso: la Tierra jala al costal hacia abajo, con 10 N por cada kilo.', ecuacion: [P, ' = 40 · 10 = ', pp('400 N')] },
        { estado: { paso: 2 }, texto: 'Tu mano lo empuja hacia abajo, en el mismo sentido que el peso.', ecuacion: [F, ' = ', pj('100 N')] },
        { estado: { paso: 3 }, texto: 'El costal está quieto, así que las fuerzas suman cero: la balanza tiene que empujar hacia arriba lo mismo que suman las dos fuerzas de abajo.', ecuacion: [N, ' = 400 + 100 = ', pn('500 N')] },
        { estado: { paso: 4 }, texto: ['Por la tercera ley, el costal aprieta la balanza hacia abajo con 500 N: es la pareja de ', vec(N), ', y por eso la pantalla marca 500 N.'], ecuacion: ['balanza → costal: ', pn('500 N'), ' ↑   ·   costal → balanza: ', pn('500 N'), ' ↓'] },
        { estado: { paso: 5 }, texto: 'El peso también tiene pareja: el costal jala a la Tierra hacia arriba. Esa fuerza actúa sobre la Tierra, no sobre el costal, y por eso no va en su DCL.', ecuacion: ['Tierra → costal: ', pp('400 N'), ' ↓   ·   costal → Tierra: ', pp('400 N'), ' ↑'] },
        { estado: { paso: 6 }, texto: 'Y la pareja de tu mano: el costal empuja tu mano hacia arriba con 100 N, y por eso sientes que el costal te resiste.', ecuacion: ['mano → costal: ', pj('100 N'), ' ↓   ·   costal → mano: ', pj('100 N'), ' ↑'] },
      ],
    },
    regla: {
      texto: 'Primera ley: si un cuerpo está quieto, o va en línea recta a velocidad constante, las fuerzas sobre él suman cero; por eso la balanza empuja lo justo para equilibrar lo demás. Tercera ley: si A empuja o jala a B, B le devuelve a A una fuerza igual y opuesta.',
      ecuacion: [...SF, ' = 0', '   ·   ', sub(vec('F'), 'A→B'), ' = −', sub(vec('F'), 'B→A')],
      condicion: 'el cuerpo está quieto o va a velocidad constante; si acelera, sus fuerzas ya no suman cero. La pareja vale siempre: mide lo mismo, apunta al revés y actúa sobre el otro cuerpo, así que nunca se anulan entre sí.',
      dibujo: est(Object.assign({}, MIRA1, { flechas: MIRA1.flechas.map(x => Object.assign({}, x, { paso: 0 })), textos: MIRA1.textos.map(x => Object.assign({}, x, { paso: 0 })) })),
    },
    // Así se resuelve: la caja de herramientas o el balde (otra lista que «Ahora tú») y, en las semillas impares, dos
    // libros apilados sobre la mesa.
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 1) {
          const a = r.de([1, 2, 3]), b = r.de([2, 4, 5]), tot = (a + b) * G;
          return {
            enunciado: [`Sobre la mesa hay dos libros quietos: uno de ${a} kg encima de otro de ${b} kg. ¿Con qué fuerza empuja la mesa al libro de abajo?`],
            datos: [D.peso, D.primera, D.tercera],
            dibujo: est(figCosa({ pila: [{ tipo: 'caja', w: 90, h: 26, texto: `${b} kg` }, { tipo: 'caja', w: 76, h: 22, texto: `${a} kg` }], textos: [{ x: 312, y: 30, texto: 'mesa sobre el de abajo: ?', ancla: 'end', peso: 400 }] })),
            pasos: [
              { tipo: 'pide', texto: 'Piden la normal: la fuerza con que la mesa empuja hacia arriba al libro de abajo.' },
              { tipo: 'datos', texto: ['El de abajo pesa ', pp(N_(b * G)), '. El de arriba está quieto, así que el de abajo lo sostiene con lo que pesa, ', pn(N_(a * G)), ', y por la tercera ley el de arriba lo aprieta con esa misma fuerza.'] },
              { tipo: 'regla', texto: 'El libro de abajo está quieto, así que sus fuerzas suman cero: lo que lo empuja hacia arriba iguala a lo que lo empuja hacia abajo.', ecuacion: [...SF, ' = 0'] },
              { tipo: 'cuentas', texto: 'Hacia abajo lo empujan su peso y el libro de arriba; hacia arriba, solo la mesa. Por eso la normal es la suma de las dos de abajo:', ecuacion: [N, ` = ${b * G} + ${a * G} = `, pn(N_(tot))] },
              { tipo: 'sentido', texto: `La mesa sostiene los dos libros: ${a + b} kg pesan ${tot} N. Si contaras solo el de abajo, saldrían ${b * G} N y faltaría lo que lo aprieta el de arriba.` },
            ],
            respuesta: [N, ' = ', pn(N_(tot))],
          };
        }
        const c = casoNormal(r, COSAS_RS, sm);
        return {
          enunciado: [`${c.ob.nombre[0].toUpperCase()}${c.ob.nombre.slice(1)} de ${c.m} kg está sobre la balanza. ${c.abajo ? 'Con la mano, ' + c.ob.lo.toLowerCase() + ' empujas hacia abajo' : 'Una cuerda ' + c.ob.lo.toLowerCase() + ' jala hacia arriba'} con `, pj(N_(c.Fm)), ` y sigue ${c.ob.lo === 'La' ? 'quieta' : 'quieto'}. ¿Cuánto marca la balanza?`],
          datos: [D.peso, D.primera, D.balanza],
          dibujo: c.dibujo,
          pasos: [
            { tipo: 'pide', texto: ['Piden lo que marca la balanza, que es la fuerza con que empuja hacia arriba: la normal ', N, '.'] },
            { tipo: 'datos', texto: ['Su peso: ', P, ` = ${c.m} · 10 = `, pp(N_(c.Pv)), '. ', c.abajo ? 'Tu mano empuja hacia abajo: ' : 'La cuerda jala hacia arriba: ', pj(N_(c.Fm)), '.'] },
            { tipo: 'regla', texto: 'El cuerpo está quieto, así que las fuerzas suman cero: lo que empuja hacia arriba iguala a lo que empuja hacia abajo.', ecuacion: [...SF, ' = 0'] },
            Object.assign({ tipo: 'cuentas' }, c.abajo
              ? { texto: ['Hacia abajo empujan el peso y la mano; hacia arriba solo empuja la balanza, así que ', N, ' es la suma de las dos:'], ecuacion: [N, ` = ${c.Pv} + ${c.Fm} = `, pn(N_(c.Nv))] }
              : { texto: ['Hacia arriba empujan ', N, ' y la cuerda; hacia abajo, solo el peso. Las dos de arriba suman el peso, así que despejamos ', N, ':'], ecuacion: [N, ` + ${c.Fm} = ${c.Pv}   →   `, N, ' = ', pn(N_(c.Nv))] }),
            { tipo: 'sentido', texto: c.abajo ? `Marca más que el peso, ${c.Pv} N, porque la balanza también aguanta el empujón de tu mano.` : `Marca menos que el peso, ${c.Pv} N, porque la cuerda sostiene una parte y a la balanza le queda el resto.` },
          ],
          respuesta: ['Marca ', pn(N_(c.Nv))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4;
        if (k === 0) {
          const c = casoNormal(r, COSAS_AT, sm);
          return {
            pregunta: [`${c.ob.nombre[0].toUpperCase()}${c.ob.nombre.slice(1)} de ${c.m} kg está sobre la balanza. ${c.abajo ? 'Con la mano, ' + c.ob.lo.toLowerCase() + ' empujas hacia abajo' : 'Una cuerda ' + c.ob.lo.toLowerCase() + ' jala hacia arriba'} con `, pj(N_(c.Fm)), ` y sigue ${c.ob.lo === 'La' ? 'quieta' : 'quieto'}. ¿Cuánto marca la balanza?`],
            datos: [D.peso, D.primera, D.balanza],
            dibujo: c.dibujo,
            opciones: opciones(c.Nv, [
              { id: 'mg', valor: c.Pv, error: 'N-MG', siFuera: 'Ese es el peso, bien calculado. Pero la balanza no marca siempre el peso: marca con cuánto empuja ella, y la otra fuerza cambia eso, porque sostiene una parte o aprieta más.' },
              { id: 'signo', valor: c.abajo ? c.Pv - c.Fm : c.Pv + c.Fm, error: 'N-SIGNO', siFuera: c.abajo ? 'Contaste la mano, pero con el signo cambiado. Restar valdría si jalara hacia arriba, como una cuerda; tu mano empuja hacia abajo, igual que el peso, así que se suma.' : 'Contaste la cuerda, pero con el signo cambiado. Sumar valdría si empujara hacia abajo, como una mano; la cuerda jala hacia arriba y sostiene una parte, así que se resta.' },
              { id: 'F', valor: c.Fm, error: 'N-F', siFuera: 'Esa es solo la fuerza de la mano o de la cuerda. La balanza también aguanta el peso del cuerpo, m · g, y lo que marca junta las dos fuerzas.' },
              { id: 'masa', valor: c.m, error: 'N-MASA', siFuera: 'Ese número son los kilos. La balanza mide una fuerza, en newtons, así que primero se pasa la masa a peso, m · g, y luego se suma o se resta la otra fuerza.' },
            ], N_),
            solucion: { texto: c.abajo ? 'El cuerpo está quieto, y hacia abajo lo empujan el peso y tu mano: la balanza aguanta las dos, así que marca la suma.' : 'El cuerpo está quieto y la cuerda sostiene una parte del peso: la balanza aguanta el resto, así que marca el peso menos la cuerda.', ecuacion: [N, ` = ${c.Pv} ${c.abajo ? '+' : '−'} ${c.Fm} = `, pn(N_(c.Nv))] },
          };
        }
        if (k === 1) {
          const pa = PAREJAS[Math.floor(sm / 4) % PAREJAS.length];
          return {
            pregunta: [`Según la tercera ley, ¿cuál es la pareja ${pa.de.startsWith('el ') ? 'del ' + pa.de.slice(3) : 'de ' + pa.de}?`],
            datos: [D.tercera],
            opciones: opciones(0, [
              { id: 'mismo', texto: pa.mismo, error: 'ES-REACCION', siFuera: 'Esa fuerza es opuesta, pero actúa sobre el mismo cuerpo. La pareja de la tercera ley siempre está en el otro cuerpo: si A empuja a B, la pareja es B empujando a A.' },
              { id: 'otro', texto: pa.otro, error: 'ES-OTRA-PAREJA', siFuera: 'Esa sí es una pareja de verdad, pero de otra fuerza. Para hallar la que buscas, nombra los dos cuerpos que se tocan o se jalan y cámbiales los papeles.' },
              { id: 'nada', texto: 'No tiene: no se mueve', error: 'ES-SIN-PAREJA', siFuera: 'Que esté quieto no quita la pareja. Toda fuerza es entre dos cuerpos, y cada uno le hace al otro una fuerza igual y opuesta, se muevan o no.' },
            ], () => '', pa.bien),
            solucion: { texto: 'La pareja es entre los mismos dos cuerpos, con los papeles al revés: el que empuja pasa a ser empujado, con la misma fuerza.', ecuacion: [pa.bien] },
          };
        }
        if (k === 2) {
          // sin b = 2a: ahí restar los pesos (N-SIGNO) daría justo lo que pesa la de arriba
          const { a, b } = elegir(r, () => { const c = { a: r.de([2, 3, 4, 6]), b: r.de([5, 7, 8, 10]) }; return c.b !== 2 * c.a && c; }), arriba = sm % 8 >= 4;
          const pide = arriba ? a * G : (a + b) * G;
          return {
            pregunta: [`Una caja de ${a} kg está sobre otra de ${b} kg, y las dos están quietas en el piso. ¿Con qué fuerza empuja ${arriba ? 'la caja de abajo a la de arriba' : 'el piso a la caja de abajo'}?`],
            datos: [D.peso, D.primera, D.tercera],
            dibujo: est(figCosa({ pila: [{ tipo: 'caja', w: 86, h: 42, texto: `${b} kg` }, { tipo: 'caja', w: 64, h: 34, texto: `${a} kg` }], textos: [{ x: 312, y: 30, texto: arriba ? 'abajo sobre arriba: ?' : 'piso sobre la de abajo: ?', ancla: 'end', peso: 400 }] })),
            opciones: opciones(pide, [
              { id: 'solo', valor: arriba ? b * G : b * G, error: 'ES-SOLO', siFuera: arriba ? 'Usaste el peso de la de abajo, pero la de arriba no carga a la de abajo: para estar quieta, solo necesita que la empujen con su propio peso.' : 'Ese es solo el peso de la de abajo. Pero la de arriba también la aprieta hacia abajo, y el piso tiene que aguantar las dos cajas.' },
              { id: 'suma', valor: arriba ? (a + b) * G : a * G, error: 'ES-PILA', siFuera: arriba ? 'Sumaste las dos cajas, pero eso es lo que aguanta el piso. La de arriba solo necesita que la sostengan a ella, con su propio peso.' : 'Ese es solo el peso de la de arriba. Pero el piso sostiene las dos cajas: la de abajo también pesa y empuja hacia abajo.' },
              { id: 'resta', valor: Math.abs(b - a) * G, error: 'N-SIGNO', siFuera: 'Restaste los dos pesos, pero ninguno se opone al otro: los dos empujan hacia abajo. Mira qué cajas sostiene la fuerza que te piden y usa solo sus pesos.' },
              { id: 'masa', valor: arriba ? a : a + b, error: 'N-MASA', siFuera: 'Ese número son kilos, no newtons. Una fuerza va en newtons, y cada kilo pesa 10 N: multiplica la masa por g antes de responder.' },
            ], N_),
            solucion: { texto: arriba ? 'Sobre la caja de arriba solo actúan su peso y el empujón de la de abajo; como está quieta, ese empujón iguala a su peso.' : 'El piso sostiene las dos cajas: la de abajo empuja con su peso y además la aprieta la de arriba, así que se suman los dos pesos.', ecuacion: [N, ' = ', arriba ? `${a} · 10` : `(${a} + ${b}) · 10`, ' = ', pn(N_(pide))] },
          };
        }
        // Nivel examen: la persona sobre la balanza con una pesa quieta o que sube a velocidad constante (San Marcos 2019-I),
        // o que jala hacia abajo una cuerda amarrada al techo.
        const M = r.de([50, 55, 60, 65]), techo = sm % 8 >= 4;
        if (techo) {
          const Fm = r.de([100, 150, 200]), Nv = M * G - Fm;
          return {
            pregunta: [`Una persona de ${M} kg está sobre la balanza y jala hacia abajo, con `, pj(N_(Fm)), ', una cuerda amarrada al techo. ¿Cuánto marca la balanza?'],
            datos: [D.peso, D.primera, D.tercera, D.balanza],
            opciones: opciones(Nv, [
              { id: 'suma', valor: M * G + Fm, error: 'N-SIGNO', siFuera: 'Contaste el jalón, pero al revés. La persona jala la cuerda hacia abajo y, por la tercera ley, la cuerda la jala a ella hacia arriba: esa fuerza sostiene una parte del peso, así que se resta.' },
              { id: 'mg', valor: M * G, error: 'N-MG', siFuera: 'Ese es el peso de la persona. Pero la cuerda, por la tercera ley, la jala hacia arriba y sostiene una parte, así que la balanza marca menos.' },
              { id: 'F', valor: Fm, error: 'N-F', siFuera: 'Esa es solo la fuerza de la cuerda. La balanza sostiene el resto del peso de la persona, que es la mayor parte.' },
              { id: 'doble', valor: M * G - 2 * Fm, error: 'ES-DOBLE', siFuera: 'Restaste el jalón dos veces. Su pareja actúa sobre la cuerda, no sobre la persona: en el DCL de la persona hay una sola fuerza de la cuerda.' },
            ], N_),
            solucion: { texto: 'La persona jala la cuerda hacia abajo y, por la tercera ley, la cuerda la jala hacia arriba. Esa fuerza sostiene una parte del peso, y la balanza marca el resto.', ecuacion: [N, ` = ${M * G} − ${Fm} = `, pn(N_(Nv))] },
          };
        }
        const mp = r.de([5, 10, 15, 20]), sube = sm % 3 === 0, Nv = (M + mp) * G;
        return {
          pregunta: [`Una persona de ${M} kg está sobre la balanza y ${sube ? 'sube una pesa de ' + mp + ' kg a velocidad constante' : 'sostiene quieta una pesa de ' + mp + ' kg'}. ¿Cuánto marca la balanza?`],
          datos: [D.peso, D.primera, D.tercera, D.balanza],
          opciones: opciones(Nv, [
            { id: 'sola', valor: M * G, error: 'N-MG', siFuera: 'Ese es solo el peso de la persona. Pero la pesa le aprieta las manos hacia abajo con su peso, y ese empujón llega a la balanza a través del cuerpo.' },
            { id: 'resta', valor: (M - mp) * G, error: 'N-SIGNO', siFuera: 'Contaste la pesa, pero la restaste. La pesa empuja las manos hacia abajo, en el mismo sentido que el peso de la persona, así que se suma.' },
            { id: 'pesa', valor: mp * G, error: 'N-F', siFuera: 'Ese es solo el peso de la pesa. La balanza también aguanta a la persona que la sostiene: falta sumar su peso.' },
            { id: 'mas', valor: (M + 2 * mp) * G, error: 'ES-SUBIR', siFuera: sube ? 'Sumaste la pesa dos veces, como si subirla pidiera fuerza extra. A velocidad constante sus fuerzas suman cero, como si estuviera quieta: la mano la empuja solo con su peso.' : 'Sumaste la pesa dos veces. Quieta, la pesa solo necesita que la mano la empuje con su peso, y ese empujón se cuenta una sola vez.' },
          ], N_),
          solucion: { texto: 'La pesa no acelera, así que la mano la empuja con su peso y, por la tercera ley, la pesa aprieta la mano con lo mismo. La balanza aguanta a la persona y a la pesa.', ecuacion: [N, ` = (${M} + ${mp}) · 10 = `, pn(N_(Nv))] },
        };
      },
    },
  };

  // ======================= 2: equilibrio de una partícula (el letrero colgado de dos cables) =======================
  // Cambia: el peso del letrero y el ángulo de los cables iguales · Permanece: el nudo quieto · Progresa: lo que jala
  // cada cable · Se reserva: los cables distintos (Predice) · Debe verse: más tendidos, más jalan; las partes verticales
  // suman el peso.
  // Lienzo: techo en y = 16; el nudo en (xn, yn); cada cable va del nudo a su amarre. Una flecha T⃗ sale del nudo a lo
  // largo de su cable; el peso del letrero, hacia abajo desde el letrero. Una sola escala por figura (k px por newton).
  const SEN_ = a => (SEN[a] !== undefined ? SEN[a] : Math.sin(rad(a))), COS_ = a => (COS[a] !== undefined ? COS[a] : Math.cos(rad(a)));
  function figColgado(o) {
    const yt = 16, xn = o.xn || 160, yn = o.yn || 110, objs = [], fl = [], an = [], txt = [...(o.textos || [])];
    const cosa = Object.assign({ tipo: 'letrero', w: 84, h: 34 }, o.cosa || {}), yc = yn + 18;
    // Una sola escala para todas las flechas (o.k); si el peso no cabe con su rótulo, la figura se alarga en vez de
    // achicar las flechas (auditoría: con 53° y 160 N las tensiones quedaban en dos puntas, «como un moño»).
    const k = Math.min(o.k || 0.6, o.P ? 110 / o.P : Infinity), alto = Math.max(o.alto || 250, o.P ? Math.ceil(yc + cosa.h + o.P * k + 30) : 0);
    const lados = [['izq', -1], ['der', 1]];
    let paredes = [];
    for (const [nom, sg] of lados) {
      const c = o[nom]; if (!c) continue;
      let amarre;
      if (c.tipo === 'pared') { const xw = sg < 0 ? 16 : 304; amarre = [xw, yn]; paredes.push({ x: xw, y0: yn - 40, y1: yn + 40, lado: sg }); }
      else amarre = [xn + sg * (yn - yt) / Math.tan(rad(c.ang)), yt];
      objs.push({ tipo: 'cuerda', de: [xn, yn], a: amarre });
      const L = Math.hypot(amarre[0] - xn, amarre[1] - yn), ux = (amarre[0] - xn) / L, uy = (amarre[1] - yn) / L;
      const angF = Math.atan2(-uy, ux) * 180 / PI;
      if (c.T) fl.push({ de: [xn, yn], ang: angF, largo: c.T * k, color: 'o', texto: c.tT, rumbo: [sg, -0.4], paso: c.paso });
      if (c.comp && c.T) {
        fl.push({ de: [xn, yn], ang: sg < 0 ? 180 : 0, largo: c.T * k * Math.abs(ux), color: 'o', discontinua: true, texto: c.tx, rumbo: [sg, 0.8], paso: c.pasoComp });
        // la parte vertical de cada cable, corrida 9 px a su lado para que las dos no queden en la misma línea
        fl.push({ de: [xn + sg * 9, yn], ang: 90, largo: c.T * k * Math.abs(uy), color: 'o', discontinua: true, texto: c.ty, rumbo: [sg, -0.2], paso: c.pasoComp });
      }
      if (c.tipo !== 'pared' && !c.sinAngulo) an.push(sg < 0 ? { c: amarre, de: -c.ang, a: 0, r: 26, texto: `${c.ang}°` } : { c: amarre, de: 180, a: 180 + c.ang, r: 26, texto: `${c.ang}°` });
    }
    objs.push({ tipo: 'nudo', en: [xn, yn] });
    // el letrero y la bolsa se ubican por arriba; la caja y el balde, por abajo
    objs.push({ tipo: 'cuerda', de: [xn, yn], a: [xn, yc] }, Object.assign({ x: xn, y: ['letrero', 'bolsa'].includes(cosa.tipo) ? yc : yc + cosa.h }, cosa));
    if (o.P) fl.push({ de: [xn, yc + cosa.h], ang: 270, largo: o.P * k, color: 'h', texto: o.tP || `P = ${N_(o.P)}`, rumbo: [1, 0.4], paso: o.pasoP });
    return { alto, techo: o.izq && o.izq.tipo === 'pared' && o.der && o.der.tipo === 'pared' ? undefined : { y: yt, x0: 8, x1: 312 },
      paredes, objetos: objs, flechas: [...fl, ...(o.flechas || [])], angulos: an, textos: txt, alt: o.alt };
  }
  // El juego: cables iguales de 150 px; el nudo baja más cuanto más parados van.
  const LC = 150;
  const colgadoIgual = (ang, Pv, o = {}) => {
    const yn = 16 + LC * SEN_(ang), Tv = Pv / (2 * SEN_(ang));
    return figColgado(Object.assign({ yn, k: 0.55, izq: { ang, T: Tv, tT: o.tT || 'T⃗₁' }, der: { ang, T: Tv, tT: o.tT2 || 'T⃗₂' }, P: Pv, tP: o.tP || 'P⃗', cosa: { texto: 'BODEGA' } }, o));
  };
  const juego2 = val => est(Object.assign(colgadoIgual(val.ang, val.P), {
    alt: `El letrero de la bodega, de ${val.P} N, cuelga de dos cables iguales que forman ${val.ang}° con el techo; cada uno jala ${f(val.P / (2 * SEN_(val.ang)))} N.` }));
  const PRED2 = figColgado({ xn: 180, yn: 100, k: 0.5, izq: { ang: 37 }, der: { ang: 53 }, P: 100, cosa: { texto: 'BODEGA' },
    alt: 'El letrero de 100 N cuelga de dos cables distintos: el de la izquierda forma 37° con el techo y el de la derecha, 53°.' });
  const asim = (o = {}) => figColgado(Object.assign({ xn: 180, yn: 100, k: 0.7, izq: { ang: 37, T: 60, tT: 'T₁ = 60 N', comp: o.comp, tx: '48 N', ty: '36 N', pasoComp: o.pasoComp },
    der: { ang: 53, T: 80, tT: 'T₂ = 80 N', comp: o.comp, tx: '48 N', ty: '64 N', pasoComp: o.pasoComp }, P: 100, cosa: { texto: 'BODEGA' } }, o.extra || {}));
  const REVELA2 = asim({ extra: { alt: 'El cable de 53° jala 80 N y el de 37°, 60 N: el más parado jala más.' } });
  const MIRA2 = (() => {
    const base = colgadoIgual(37, 120, { tT: 'T₁ = 100 N', tT2: 'T₂ = 100 N', tP: 'P = 120 N' });
    const sym = colgadoIgual(37, 120, { tT: 'T₁ = 100 N', tT2: 'T₂ = 100 N', tP: 'P = 120 N', izq: { ang: 37, T: 100, tT: 'T₁ = 100 N', comp: true, tx: '80 N', ty: '60 N' }, der: { ang: 37, T: 100, tT: 'T₂ = 100 N', comp: true, tx: '80 N', ty: '60 N' } });
    const a1 = asim({ comp: true }), a2 = asim({ comp: false });
    const corte = d => ({ objetos: d.objetos, flechas: d.flechas, angulos: d.angulos, textos: d.textos, techo: d.techo });
    return Object.assign({}, base, { alt: 'El letrero colgado de dos cables: sus partes horizontales se cancelan y las verticales sostienen el peso.',
      cortes: [corte(colgadoIgual(37, 120, { tT: 'T₁ = 100 N', tT2: 'T₂ = 100 N', tP: 'P = 120 N' })), corte(sym), corte(a2), corte(a1),
        corte(Object.assign(a1, { textos: [...a1.textos, { x: 8, y: 236, texto: '36 N + 64 N = 100 N', ancla: 'start', color: 'o' }] }))] });
  })();
  const D2 = {
    comp: ['Partes de una fuerza ', F, ' que forma θ con la horizontal: F · cos θ de lado y F · sen θ hacia arriba'],
    equil: 'Partícula en equilibrio: lo horizontal suma cero y lo vertical suma cero',
    trig: 'sen 37° = cos 53° = 3/5 y cos 37° = sen 53° = 4/5 (convención del examen)',
    trig30: 'sen 30° = cos 60° = 1/2 y cos 30° = sen 60° = √3/2',
    trig45: 'sen 45° = cos 45° = √2/2',
    polea: ['Una cuerda ideal jala con la misma ', T, ' en todos sus tramos, también al pasar por una polea'],
    tan: 'tan 37° = 3/4 y tan 53° = 4/3 (convención del examen)',
  };
  const trigDe = a => (a === 37 || a === 53 ? D2.trig : a === 45 ? D2.trig45 : D2.trig30);

  // Poleas: la fija, colgada del techo, con la carga a la izquierda y la mano a la derecha; la móvil, con un tramo
  // amarrado al techo y el otro que sube a la mano.
  function figPolea(o) {
    const objs = [], fl = [], txt = [...(o.textos || [])];
    if (!o.movil) {
      const c = [160, 54];
      objs.push({ tipo: 'cuerda', de: [160, 16], a: [160, 36] }, { tipo: 'polea', c, r: 18 },
        { tipo: 'cuerda', de: [142, 54], a: [142, 150] }, Object.assign({ tipo: 'balde', x: 142, y: 186, w: 40, h: 34 }, o.cosa || {}),
        { tipo: 'cuerda', de: [178, 54], a: [178, 140] }, { tipo: 'persona', x: 236, y: 232, alto: 110, mano: [178, 140] });
      if (o.P) fl.push({ de: [130, 186], ang: 270, largo: Math.min(o.P * (o.k || 0.3), 40), color: 'h', texto: o.tP || `P = ${N_(o.P)}`, rumbo: [-1, 0.3] });
      if (o.F !== undefined) fl.push({ de: [178, 140], ang: 270, largo: Math.min((o.F || o.P) * (o.k || 0.3), 40), color: 'o', texto: o.tF || `F = ${N_(o.F)}`, rumbo: [1, 0.3] });
    } else {
      const c = [160, 128];
      const k = Math.min(o.k || 0.3, 56 / (o.P || 1));
      objs.push({ tipo: 'cuerda', de: [142, 16], a: [142, 128] }, { tipo: 'polea', c, r: 18 }, { tipo: 'cuerda', de: [178, 128], a: [178, 76] },
        { tipo: 'cuerda', de: [160, 128], a: [160, 150] }, Object.assign({ tipo: 'caja', x: 160, y: 182, w: 60, h: 32 }, o.cosa || {}));
      if (o.P) fl.push({ de: [196, 166], ang: 270, largo: o.P * k, color: 'h', texto: o.tP || `P = ${N_(o.P)}`, rumbo: [1, 0.3] });
      if (o.F !== undefined) fl.push({ de: [178, 76], ang: 90, largo: Math.max(16, (o.F || o.P / 2) * k), color: 'o', texto: o.tF || `F = ${N_(o.F)}`, rumbo: [1, 0] });
      txt.push({ x: 188, y: 100, texto: 'mano', ancla: 'start', peso: 400 });
    }
    return { alto: 240, techo: { y: 16, x0: 60, x1: o.movil ? 166 : 260 }, piso: o.movil ? undefined : { y: 232, x0: 60, x1: 312 }, objetos: objs, flechas: fl, textos: txt, alt: o.alt };
  }
  // La escaladora contra una pared lisa, sostenida por una cuerda que forma θ con la pared.
  function figPared(o) {
    const xw = 290, cx = 268, cy = 130, th = o.ang, ag = [cx - 22, cy - 30], amarre = [xw, ag[1] - 44 / Math.tan(rad(th))];
    // Una sola escala: la flecha de la cuerda cabe en la cuerda.
    const k = o.T ? (Math.hypot(44, 44 / Math.tan(rad(th))) - 4) / o.T : 0.09, fl = [];
    if (o.T) fl.push({ de: ag, ang: 90 - th, largo: o.T * k, color: 'o', texto: o.tT || 'T', rumbo: [-1, -0.5] });
    if (o.N !== undefined) fl.push({ de: [cx - 22, cy], ang: 180, largo: Math.max(16, (o.N || 0) * k), color: 'f', texto: o.tN || 'N = ?', rumbo: [-1, -0.3] });
    if (o.P) fl.push({ de: [cx, cy + 30], ang: 270, largo: o.P * k, color: 'h', texto: o.tP || `P = ${N_(o.P)}`, rumbo: [-1, 0.3] });
    return { alto: 240, paredes: [{ x: xw, y0: 12, y1: 232, lado: 1 }], objetos: [{ tipo: 'cuerda', de: ag, a: amarre }, Object.assign({ tipo: 'caja', x: cx, y: cy + 30, w: 44, h: 60, texto: '' }, o.cosa || {})],
      flechas: fl, angulos: [{ c: amarre, de: 270 - th, a: 270, r: 24, texto: `${th}°` }], textos: o.textos || [], alt: o.alt };
  }

  // Ejemplos de la idea 2. Cuentas rehechas aparte (cuentas.js: busca, por bisección, las tensiones con las que la
  // suma de las flechas del nudo da cero, sin despejar): 4·10; 50·3/5; 80/2; 60; 200/2; 120/(2·3/5); 50/(2·1/2);
  // 160/(2·4/5); 37°/53° con 200 N; 80·3/4; la pared con 600 N; (400 + 20)/2; 30°/60° con 100 N; el ángulo de T = P;
  // la cuerda horizontal con 60 N.
  const EJEMPLOS_NUDO = [
    { nivel: 1, titulo: 'Una lámpara de un solo cable',
      figura: est({ alto: 200, techo: { y: 16, x0: 80, x1: 240 }, objetos: [{ tipo: 'cuerda', de: [160, 16], a: [160, 100] }, { tipo: 'caja', x: 160, y: 136, w: 56, h: 36, texto: '4 kg' }],
        flechas: [{ de: [160, 100], ang: 90, largo: 40, color: 'o', texto: 'T = ?', rumbo: [1, -0.2] }, { de: [160, 136], ang: 270, largo: 40, color: 'h', texto: 'P', rumbo: [1, 0.2] }],
        alt: 'Una lámpara de 4 kg cuelga de un solo cable vertical.' }),
      enunciado: ['Una lámpara de 4 kg cuelga quieta de un solo cable vertical. ¿Cuánto jala el cable?'],
      datos: [D.peso, D2.equil],
      solucion: [{ texto: 'La lámpara está quieta, así que lo vertical suma cero. Como el cable es lo único que la sostiene, jala hacia arriba con todo el peso:', ecuacion: [T, ' = ', P, ' = 4 · 10 = ', pj('40 N')] }],
      respuesta: [T, ' = ', pj('40 N')] },
    { nivel: 1, titulo: 'La parte que sube',
      figura: est({ alto: 170, piso: { y: 150 }, objetos: [{ tipo: 'nudo', en: [90, 130] }],
        flechas: [{ de: [90, 130], ang: 37, largo: 100, color: 'o', texto: 'T = 50 N', rumbo: [1, -0.4] }, { de: [90, 130], ang: 90, largo: 60, color: 'o', discontinua: true, texto: '?', rumbo: [-1, -0.2] }],
        angulos: [{ c: [90, 130], de: 0, a: 37, r: 34, texto: '37°' }], alt: 'Un cable jala con 50 N formando 37° con la horizontal; su parte vertical, con un signo de pregunta.' }),
      enunciado: ['Un cable jala un nudo con ', pj('50 N'), ', formando 37° con la horizontal. ¿Cuánto vale su parte vertical?'],
      datos: [D2.comp, D2.trig],
      solucion: [{ texto: 'Si el ángulo se mide desde la horizontal, la parte vertical de la fuerza es la fuerza por el seno de ese ángulo, y la horizontal va con el coseno:', ecuacion: [pj('50'), ' · sen 37° = 50 · ', { frac: ['3', '5'] }, ' = ', pj('30 N')] }],
      respuesta: [pj('30 N'), ' hacia arriba'] },
    { nivel: 1, titulo: 'Dos cables verticales',
      figura: est({ alto: 200, techo: { y: 16, x0: 60, x1: 260 }, objetos: [{ tipo: 'cuerda', de: [128, 16], a: [128, 100] }, { tipo: 'cuerda', de: [192, 16], a: [192, 100] }, { tipo: 'letrero', x: 160, y: 100, w: 90, h: 34, texto: 'BODEGA' }],
        flechas: [{ de: [128, 100], ang: 90, largo: 40, color: 'o', texto: 'T₁ = ?', rumbo: [-1, -0.2] }, { de: [192, 100], ang: 90, largo: 40, color: 'o', texto: 'T₂ = ?', rumbo: [1, -0.2] }, { de: [160, 134], ang: 270, largo: 48, color: 'h', texto: 'P = 80 N', rumbo: [1, 0.2] }],
        alt: 'Un letrero de 80 N colgado de dos cables verticales, uno en cada punta.' }),
      enunciado: ['Un letrero de 80 N cuelga de dos cables verticales iguales, uno en cada punta. ¿Cuánto jala cada cable?'],
      datos: [D2.equil],
      solucion: [{ texto: 'Los dos cables son verticales, así que todo su jalón va hacia arriba. Son iguales y el letrero está quieto: se reparten el peso por mitades.', ecuacion: [T, ' = ', { frac: [pp('80'), '2'] }, ' = ', pj('40 N')] }],
      respuesta: ['Cada uno, ', pj('40 N')] },
    { nivel: 1, titulo: 'Subir un balde con polea fija',
      figura: est(figPolea({ P: 60, F: 60, tF: 'F = ?', tP: 'P', cosa: { texto: '6 kg' }, k: 0.5, alt: 'Una polea fija colgada del techo: el balde de 6 kg a un lado y la mano que jala al otro.' })),
      enunciado: ['Sostienes quieto un balde de 6 kg con una cuerda que pasa por una polea fija del techo. ¿Con qué fuerza jalas?'],
      datos: [D.peso, D2.polea],
      solucion: [{ texto: 'Una cuerda ideal jala igual en todos sus tramos, y la polea fija solo la desvía. El tramo del balde lo sostiene con T, que iguala su peso, y tú jalas el otro tramo con esa misma T.', ecuacion: [F, ' = ', T, ' = ', P, ' = ', pj('60 N')] }],
      respuesta: [F, ' = ', pj('60 N')] },
    { nivel: 1, titulo: 'La polea móvil',
      figura: est(figPolea({ movil: true, P: 200, F: 100, tF: 'F = ?', cosa: { texto: '200 N' }, k: 0.3, alt: 'Una carga de 200 N cuelga de una polea móvil: un tramo de cuerda va al techo y el otro sube a la mano.' })),
      enunciado: ['Una carga de 200 N cuelga de una polea móvil liviana. Un tramo de la cuerda está amarrado al techo y el otro sube a tu mano. ¿Con qué fuerza jalas?'],
      datos: [D2.polea, D2.equil],
      solucion: [{ texto: 'La polea móvil cuelga de dos tramos de la misma cuerda, y cada uno jala hacia arriba con la misma T. Entre los dos sostienen la carga, así que cada tramo carga la mitad:', ecuacion: ['2', T, ' = 200   →   ', T, ' = ', pj('100 N')] }],
      respuesta: [F, ' = ', pj('100 N')] },
    { nivel: 2, titulo: 'El letrero de la bodega',
      figura: est(colgadoIgual(37, 120, { tT: 'T₁ = ?', tT2: 'T₂ = ?', tP: 'P = 120 N', alt: 'Un letrero de 120 N cuelga de dos cables iguales que forman 37° con el techo.' })),
      enunciado: ['Un letrero de 120 N cuelga de un nudo con dos cables iguales que forman 37° con el techo. ¿Cuánto jala cada cable?'],
      datos: [D2.comp, D2.equil, D2.trig],
      solucion: [
        { texto: 'Los cables son iguales, así que sus partes horizontales son iguales y opuestas, y se cancelan. Las partes verticales de los dos, T · sen 37° cada una, sostienen el peso:', ecuacion: ['2', T, ' · sen 37° = 120'] },
        { texto: 'Con sen 37° = 3/5 se despeja T. Sale más que la mitad del peso, porque solo una parte del jalón de cada cable va hacia arriba:', ecuacion: [T, ' = ', { frac: ['120', '2 · 3/5'] }, ' = ', pj('100 N')] },
      ],
      respuesta: ['Cada cable jala ', pj('100 N')] },
    { nivel: 2, titulo: 'La maceta a 30°',
      figura: est(colgadoIgual(30, 50, { tT: 'T₁ = ?', tT2: 'T₂ = ?', tP: 'P = 50 N', k: 0.9, cosa: { tipo: 'balde', w: 44, h: 36, texto: '' }, alt: 'Una maceta de 50 N cuelga de dos cables iguales que forman 30° con el techo.' })),
      enunciado: ['Una maceta de 50 N cuelga de dos cables iguales que forman 30° con el techo. ¿Cuánto jala cada cable?'],
      datos: [D2.comp, D2.equil, D2.trig30],
      solucion: [
        { texto: 'Las partes horizontales se cancelan, porque los cables son iguales. Las verticales, T · sen 30° cada una, sostienen el peso:', ecuacion: ['2', T, ' · sen 30° = 50'] },
        { texto: 'Con sen 30° = 1/2, cada cable sube solo la mitad de lo que jala, así que cada uno tiene que jalar tanto como todo el peso:', ecuacion: [T, ' = ', { frac: ['50', '2 · 1/2'] }, ' = ', pj('50 N')] },
      ],
      respuesta: ['Cada cable jala ', pj('50 N'), ': tanto como pesa la maceta'] },
    { nivel: 2, titulo: 'Cables más parados',
      figura: est(colgadoIgual(53, 160, { tT: 'T₁ = ?', tT2: 'T₂ = ?', tP: 'P = 160 N', k: 0.5, alt: 'Un letrero de 160 N cuelga de dos cables iguales que forman 53° con el techo.' })),
      enunciado: ['Un letrero de 160 N cuelga de dos cables iguales que forman 53° con el techo. ¿Cuánto jala cada cable?'],
      datos: [D2.comp, D2.equil, D2.trig],
      solucion: [
        { texto: 'Las partes horizontales se cancelan, porque los cables son iguales. Las verticales, T · sen 53° cada una, sostienen el peso:', ecuacion: ['2', T, ' · sen 53° = 160'] },
        { texto: 'Con sen 53° = 4/5 se despeja T. Como los cables van más parados, casi todo su jalón sube y la tensión queda cerca de la mitad del peso:', ecuacion: [T, ' = ', { frac: ['160', '2 · 4/5'] }, ' = ', pj('100 N')] },
      ],
      respuesta: ['Cada cable jala ', pj('100 N')] },
    { nivel: 2, titulo: 'Dos cables distintos',
      figura: est(Object.assign(figColgado({ xn: 180, yn: 100, k: 0.35, izq: { ang: 37 }, der: { ang: 53 }, P: 200, cosa: { texto: '200 N' } }), { alt: 'Un letrero de 200 N cuelga de un cable de 37° y otro de 53° con el techo.', textos: [{ x: 8, y: 236, texto: 'más tenso: ?', ancla: 'start' }] })),
      enunciado: ['Un letrero de 200 N cuelga de un nudo con dos cables: uno forma 37° con el techo y el otro, 53°. ¿Cuánto jala el más tenso?'],
      datos: [D2.comp, D2.equil, D2.trig],
      solucion: [
        { texto: 'Llamamos T₁ al cable de 37° y T₂ al de 53°. El nudo está quieto, así que sus partes horizontales, que van en sentidos opuestos, tienen que ser iguales:', ecuacion: [sub(T, '1'), ' · 4/5 = ', sub(T, '2'), ' · 3/5   →   ', sub(T, '2'), ' = ', { frac: ['4', '3'] }, ' ', sub(T, '1')] },
        { texto: 'Las partes verticales de los dos suman el peso. Reemplazamos T₂ por lo que vale en función de T₁ y queda una sola incógnita:', ecuacion: [sub(T, '1'), ' · 3/5 + ', { frac: ['4', '3'] }, sub(T, '1'), ' · 4/5 = 200   →   ', sub(T, '1'), ' = ', pj('120 N')] },
        { texto: 'Con T₁ hallado, sale T₂. El de 53° jala más porque va más parado y su jalón sube más:', ecuacion: [sub(T, '2'), ' = ', { frac: ['4', '3'] }, ' · 120 = ', pj('160 N')] },
      ],
      respuesta: [pj('160 N'), ': el cable de 53°'] },
    { nivel: 2, titulo: 'La lámpara jalada a un lado',
      figura: est(Object.assign(figColgado({ xn: 190, yn: 120, k: 0.6, izq: { tipo: 'pared' }, der: { ang: 53, sinAngulo: true }, P: 80, cosa: { tipo: 'caja', w: 44, h: 30, texto: '' } }),
        { flechas: [{ de: [190, 120], ang: 180, largo: 36, color: 'o', texto: '?', rumbo: [-0.3, -1] }, { de: [190, 168], ang: 270, largo: 48, color: 'h', texto: 'P = 80 N', rumbo: [1, 0.3] }],
          angulos: [{ c: [190, 120], de: 53, a: 90, r: 30, texto: '37°' }], alt: 'Una lámpara de 80 N cuelga de un cable que forma 37° con la vertical; una cuerda horizontal la jala hacia la pared.' })),
      enunciado: ['Una lámpara de 80 N cuelga de un cable que forma 37° con la vertical, porque una cuerda horizontal la jala hacia la pared. ¿Cuánto jala la cuerda horizontal?'],
      datos: [D2.equil, D2.trig, D2.tan],
      solucion: [
        { texto: 'La cuerda horizontal no sostiene nada hacia arriba: solo el cable. El ángulo se mide desde la vertical, así que su parte vertical va con el coseno, T · cos 37° = 80, y T = 100 N.' },
        { texto: 'De lado, la cuerda jala hacia la pared y el cable jala hacia el otro lado. Como el nudo está quieto, la cuerda iguala la parte horizontal del cable:', ecuacion: [sub(T, 'h'), ' = 100 · sen 37° = 100 · ', { frac: ['3', '5'] }, ' = ', pj('60 N')] },
      ],
      respuesta: ['Jala ', pj('60 N')] },
    { nivel: 3, titulo: 'La escaladora contra la pared',
      figura: est(figPared({ ang: 37, P: 600, T: 750, tT: 'T', N: 450, tN: 'N = ?', cosa: { texto: '60 kg' }, alt: 'Una escaladora de 60 kg, apoyada en una pared lisa, cuelga de una cuerda que forma 37° con la pared.' })),
      enunciado: ['Una escaladora de 60 kg está quieta, con los pies contra una pared lisa y colgada de una cuerda que forma 37° con la pared. ¿Con qué fuerza la empuja la pared? (Como en San Marcos 2023-II.)'],
      alternativas: ['600 N', '360 N', '450 N', '480 N', '750 N'],
      datos: [D.peso, D2.equil, D2.trig],
      solucion: [
        { texto: 'La pared es lisa, así que solo empuja de lado: hacia arriba la sostiene la cuerda. El ángulo se mide desde la pared, que es vertical, y la parte vertical de la cuerda va con el coseno:', ecuacion: [T, ' · cos 37° = 600   →   ', T, ' = ', pj('750 N')] },
        { texto: 'De lado, la cuerda la jala hacia la pared y la pared la empuja hacia afuera. Quieta, las dos fuerzas son iguales:', ecuacion: [N, ' = 750 · sen 37° = ', pn('450 N')] },
        { texto: ['La ', neg('A'), ' iguala la pared al peso, aunque la pared empuja de lado. La ', neg('B'), ' y la ', neg('D'), ' parten el peso, 600 · sen 37° y 600 · cos 37°, en vez de la cuerda. La ', neg('E'), ' da la cuerda entera.'] },
      ],
      respuesta: [neg('C'), ', ', pn('450 N')] },
    { nivel: 3, titulo: 'Polea móvil con peso propio',
      figura: est(figPolea({ movil: true, P: 420, F: 210, tF: 'F = ?', tP: '400 N + 20 N', cosa: { texto: '400 N' }, k: 0.16, alt: 'Una carga de 400 N cuelga de una polea móvil de 20 N; un tramo va al techo y el otro sube a la mano.' })),
      enunciado: ['Una carga de 400 N cuelga de una polea móvil que pesa 20 N. Un tramo de la cuerda está amarrado al techo y el otro sube a tu mano. ¿Con qué fuerza sostienes todo quieto?'],
      alternativas: ['210 N', '420 N', '200 N', '105 N', '400 N'],
      datos: [D2.polea, D2.equil],
      solucion: [
        { texto: 'La polea móvil está quieta. Hacia abajo la jalan la carga y su propio peso; hacia arriba, los dos tramos de cuerda, cada uno con la tensión que tú haces:', ecuacion: ['2', T, ' = 400 + 20   →   ', T, ' = ', pj('210 N')] },
        { texto: ['La ', neg('B'), ' pone todo en un solo tramo, como si fuera una polea fija. La ', neg('C'), ' olvida el peso de la polea. La ', neg('D'), ' reparte entre cuatro tramos, y la ', neg('E'), ' da solo la carga.'] },
      ],
      respuesta: [neg('A'), ', ', pj('210 N')] },
    { nivel: 3, titulo: 'Cables de 30° y 60°',
      figura: est(Object.assign(figColgado({ xn: 200, yn: 120, k: 0.6, izq: { ang: 30 }, der: { ang: 60 }, P: 100, cosa: { texto: '100 N' } }), { alt: 'Un letrero de 100 N cuelga de un cable de 30° y otro de 60° con el techo.', textos: [{ x: 8, y: 236, texto: 'el de 60°: ?', ancla: 'start' }] })),
      enunciado: ['Un letrero de 100 N cuelga de un nudo con dos cables: uno forma 30° con el techo y el otro, 60°. ¿Cuánto jala el cable de 60°?'],
      alternativas: ['50 N', '100 N', '25 N', '50√3 N', '100√3 N'],
      datos: [D2.comp, D2.equil, D2.trig30],
      solucion: [
        { texto: 'Llamamos T₁ al cable de 30° y T₂ al de 60°. Como el nudo está quieto, sus partes horizontales, opuestas, son iguales:', ecuacion: [sub(T, '1'), ' · cos 30° = ', sub(T, '2'), ' · cos 60°   →   ', sub(T, '2'), ' = √3 ', sub(T, '1')] },
        { texto: 'Las partes verticales suman el peso. Con T₂ escrito en función de T₁, queda una sola incógnita:', ecuacion: [sub(T, '1'), ' · ', { frac: ['1', '2'] }, ' + √3 ', sub(T, '1'), ' · ', { frac: ['√3', '2'] }, ' = 2', sub(T, '1'), ' = 100   →   ', sub(T, '2'), ' = ', pj('50√3 N')] },
        { texto: ['La ', neg('A'), ' da el cable de 30°, que jala menos. La ', neg('B'), ' cree que el cable más parado sostiene todo el peso. La ', neg('C'), ' reparte 100 entre 4, y la ', neg('E'), ' multiplica 100 por √3.'] },
      ],
      respuesta: [neg('D'), ', ', pj('50√3 N'), ', unos ', pj('86,6 N')] },
    { nivel: 3, titulo: '¿Con qué ángulo cuelgan los cables?',
      figura: est(Object.assign(colgadoIgual(37, 120, { tT: 'T = 75 N', tT2: 'T = 75 N', tP: 'P = 120 N', izq: { ang: 37, T: 75, tT: 'T = 75 N', sinAngulo: true }, der: { ang: 37, T: 75, tT: 'T = 75 N', sinAngulo: true } }), { alt: 'Un letrero de 120 N cuelga de dos cables iguales; cada cable jala 75 N. El dibujo no está a escala.' })),
      enunciado: ['Un letrero de 120 N cuelga de dos cables iguales, con el mismo ángulo con el techo. Cada cable jala ', pj('75 N'), '. ¿Qué ángulo forma cada cable con el techo? (El dibujo no está a escala.)'],
      alternativas: ['45°', '60°', '37°', '90°', '53°'],
      datos: [D2.comp, D2.equil, D2.trig30, D2.trig45, D2.trig],
      solucion: [
        { texto: 'Ahora se conoce la tensión y falta el ángulo. Las partes verticales de los dos cables, 75 · sen θ cada una, sostienen el peso:', ecuacion: ['2 · 75 · sen θ = 120   →   sen θ = ', { frac: ['120', '150'] }, ' = ', { frac: ['4', '5'] }] },
        { texto: ['El ángulo cuyo seno es 4/5 es 53°. La ', neg('C'), ' toma el coseno en vez del seno. Con la ', neg('D'), ' los cables serían verticales y jalarían 60 N cada uno; con la ', neg('A'), ' y la ', neg('B'), ', unos 85 N y 69 N.'] },
      ],
      respuesta: [neg('E'), ', 53°'] },
    { nivel: 3, titulo: 'La cuerda horizontal',
      figura: est(Object.assign(figColgado({ xn: 160, yn: 120, k: 0.8, izq: { tipo: 'pared' }, der: { ang: 53 }, P: 60, cosa: { tipo: 'caja', w: 50, h: 30, texto: '60 N' } }),
        { alt: 'Un bulto de 60 N cuelga de un nudo con una cuerda horizontal a la pared y un cable que forma 53° con el techo.', textos: [{ x: 8, y: 236, texto: 'cuerda horizontal: ?', ancla: 'start' }] })),
      enunciado: ['Un bulto de 60 N cuelga de un nudo. Del nudo salen una cuerda horizontal hacia la pared y un cable que forma 53° con el techo. ¿Cuánto jala la cuerda horizontal?'],
      alternativas: ['75 N', '45 N', '60 N', '80 N', '36 N'],
      datos: [D2.comp, D2.equil, D2.trig],
      solucion: [
        { texto: 'La cuerda horizontal no sube nada, así que solo el cable sostiene el bulto. El ángulo es con el techo, y su parte vertical va con el seno:', ecuacion: [T, ' · sen 53° = 60   →   ', T, ' = ', pj('75 N')] },
        { texto: 'De lado, el nudo está quieto: la cuerda iguala la parte horizontal del cable, que va con el coseno.', ecuacion: [sub(T, 'h'), ' = 75 · cos 53° = ', pj('45 N')] },
        { texto: ['La ', neg('A'), ' da el cable entero. La ', neg('C'), ' iguala la cuerda al peso. La ', neg('D'), ' cambia el seno por el coseno al hallar el cable, y la ', neg('E'), ' parte el peso, 60 · cos 53°, en vez del cable.'] },
      ],
      respuesta: [neg('B'), ', ', pj('45 N')] },
  ];

  const COLG_AT = ['una lámpara', 'una maceta', 'un parlante'];
  const COLG_RS = ['un letrero', 'un farol'];
  const nudo = {
    id: 'nudo-en-equilibrio',
    titulo: 'Equilibrio de una partícula',
    pregunta: 'Si un letrero cuelga de dos cables, ¿cuál de los dos jala más?',
    temas: ['Equilibrio de una partícula', 'Diagrama de cuerpo libre', 'Máquinas simples'],
    pieza: 'fis-estatica',
    aprendizaje: 'En equilibrio, las partes horizontales de los cables se cancelan y las verticales sostienen el peso; por eso el cable más parado jala más.',
    actividad: 'Colgar el letrero de la bodega con dos cables y cambiar su ángulo.',
    lee: {
      tarjetas: [
        { titulo: 'Cables que cuelgan', texto: 'El letrero de una bodega suele colgar de dos cables que se juntan en un nudo. El nudo no se mueve, así que está en equilibrio: sus fuerzas suman cero. Como es muy pequeño y todas las fuerzas actúan en él, se lo trata como un punto, al que en física se llama partícula.',
          dibujo: est(colgadoIgual(45, 100, { tT: '', tT2: '', tP: '', izq: { ang: 45, sinAngulo: true }, der: { ang: 45, sinAngulo: true }, P: 0, alt: 'El letrero de la bodega colgado de dos cables que se juntan en un nudo.' })) },
        { titulo: 'La tensión', texto: ['Un cable tirante jala con una fuerza llamada tensión, ', vec(T), ', que apunta siempre a lo largo del cable: un cable solo puede jalar, nunca empujar. Una cuerda liviana que pasa por una polea jala con la misma tensión a los dos lados; la polea solo cambia hacia dónde jala.'] },
        { titulo: 'Partir una flecha', texto: 'Como en Vectores, una flecha inclinada se parte en dos componentes: una horizontal y una vertical, que juntas hacen lo mismo que la flecha entera. Así se suman por separado lo que va de lado y lo que va hacia arriba. Al jugar, mira cuánto jala cada cable cuando los tiendes más.' },
      ],
    },
    ejemplos: EJEMPLOS_NUDO,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'El letrero de la bodega cuelga de un nudo con dos cables iguales. Tú eliges su peso y cuánto se inclinan los cables.',
      mision: {
        texto: 'Haz que cada cable jale lo mismo que pesa el letrero.',
        // Un solo ángulo lo logra, con cualquier peso: 30°.
        logrado: val => Math.abs(val.P / (2 * SEN_(val.ang)) - val.P) < 1e-9,
        bien: 'Coincide: a 30° sube la mitad de cada jalón, y cada uno jala todo el peso.',
      },
      voz: 'Tiende los cables. ¿Jalan más o menos?',
      leyenda: [
        { s: [vec(sub(T, '1')), ' y ', vec(sub(T, '2'))], t: 'lo que jala cada cable al nudo' },
        { s: [vec(P)], t: 'el peso del letrero' },
        { s: 'ángulo', t: 'entre cada cable y el techo' },
      ],
      controles: [
        { id: 'P', etiqueta: 'Letrero, P', color: 'c-h', min: 60, max: 120, paso: 20, inicio: 120, unidad: 'N', decimales: 0 },
        { id: 'ang', etiqueta: 'Ángulo', opciones: [30, 37, 45, 53, 60].map(a => ({ valor: a, texto: `${a}°` })), inicio: 37 },
      ],
      dibujo: juego2,
      lectura: val => ['Cada cable jala ', pj(N_(val.P / (2 * SEN_(val.ang)))), '; sus partes verticales suman ', pp(N_(val.P))],
      resumen: { P: 120, ang: 45 },
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora los cables son distintos: uno forma 37° con el techo y el otro, 53°. ¿Cuál jala más?',
      datos: ['El letrero pesa 100 N.', 'sen 37° = cos 53° = 3/5 y cos 37° = sen 53° = 4/5'],
      opciones: [
        { id: 'c', texto: 'El de 53°, el más parado', correcta: true },
        { id: 'tendido', texto: 'El de 37°, el más tendido', error: 'E8', siFuera: 'En el juego, tender los dos cables los hacía jalar más. Aquí solo uno va más tendido, y su jalón sube poco: el otro, que va más parado, tiene que cargar la mayor parte del peso.' },
        { id: 'mitad', texto: 'Los dos igual: cada uno la mitad', error: 'E8', siFuera: 'Eso pasa con cables iguales, porque el dibujo es simétrico. Con ángulos distintos, cada cable sostiene una parte distinta del peso, y ninguno sostiene justo la mitad.' },
        { id: 'largo', texto: 'El más largo de los dos', error: 'E7', siFuera: 'El largo se ve a simple vista, pero no cambia lo que jala un cable: si alargas un cable sin cambiar su ángulo, jala lo mismo. Lo que deciden la tensión son los ángulos y el peso.' },
      ],
      dibujo: est(PRED2),
      revelar: est(REVELA2),
      coincide: 'Coincide: el de 53° jala 80 N y el de 37°, 60 N. El más parado sostiene más.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: MIRA2,
      pasos: [
        { estado: { corte: 0 }, texto: 'El letrero pesa 120 N y cuelga de dos cables iguales, a 37° del techo. Cada cable jala 100 N.' },
        { estado: { corte: 1 }, texto: 'Cada jalón se parte en dos: 80 N de lado, con el coseno, y 60 N hacia arriba, con el seno.', ecuacion: [pj('100'), ' · cos 37° = 80   ·   ', pj('100'), ' · sen 37° = 60'] },
        { estado: { corte: 1 }, texto: 'Las partes de lado van en sentidos opuestos y se cancelan. Las de arriba se suman y sostienen el peso, así que el nudo queda quieto.', ecuacion: ['80 − 80 = 0   ·   60 + 60 = ', pp('120 N')] },
        { estado: { corte: 2 }, texto: 'Ahora el letrero pesa 100 N y los cables son distintos: uno a 37° y otro a 53°.', ecuacion: [sub(T, '1'), ' = ', pj('60 N'), '   ·   ', sub(T, '2'), ' = ', pj('80 N')] },
        { estado: { corte: 3 }, texto: 'De lado, los dos dan 48 N en sentidos opuestos, así que se cancelan: el nudo no se va hacia ningún lado.', ecuacion: ['60 · 4/5 = 48   ·   80 · 3/5 = 48'] },
        { estado: { corte: 4 }, texto: 'Hacia arriba suben 36 N y 64 N, que suman el peso. El cable más parado sube más, por eso sostiene más.', ecuacion: ['36 + 64 = ', pp('100 N')] },
      ],
    },
    regla: {
      texto: 'Una partícula está en equilibrio si las fuerzas suman cero por partes: lo horizontal suma cero y lo vertical suma cero, como dice el recuadro. Para eso, cada fuerza inclinada se parte en sus componentes. Por eso el cable más parado jala más: sube más con su jalón y carga más peso.',
      ecuacion: ['Σ', sub('F', 'x'), ' = 0', '   ·   ', 'Σ', sub('F', 'y'), ' = 0'],
      condicion: 'el cuerpo está quieto o va a velocidad constante. Si el ángulo θ se mide desde la horizontal, la parte de lado es F · cos θ y la de arriba, F · sen θ; si se mide desde la vertical, se cambian.',
    },
    // Así se resuelve: un letrero o un farol con cables iguales (otra lista que «Ahora tú») y, en las semillas impares,
    // la cuerda horizontal que jala la lámpara hacia la pared.
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 1) {
          const { Pv, ang, Tv, Th } = elegir(r, () => { const c = { Pv: r.de([40, 60, 80, 120, 160]), ang: r.de([37, 53]) }; c.Tv = c.Pv / COS_(c.ang); c.Th = c.Tv * SEN_(c.ang); return exacto(c.Tv) && exacto(c.Th) && c; });
          return {
            enunciado: [`Un farol de ${Pv} N cuelga de un cable que forma ${ang}° con la vertical, porque una cuerda horizontal lo jala hacia la pared. ¿Cuánto jala la cuerda horizontal?`],
            datos: [D2.equil, D2.trig],
            pasos: [
              { tipo: 'pide', texto: 'Piden la tensión de la cuerda horizontal que jala el farol hacia la pared.' },
              { tipo: 'datos', texto: ['El farol pesa ', pp(N_(Pv)), `, y el cable forma ${ang}° con la vertical. Ojo: el ángulo se mide desde la vertical, no desde el techo.`] },
              { tipo: 'regla', texto: 'El nudo está quieto, así que lo vertical suma cero y lo horizontal suma cero por separado.', ecuacion: ['Σ', sub('F', 'x'), ' = 0   ·   Σ', sub('F', 'y'), ' = 0'] },
              { tipo: 'cuentas', texto: 'La cuerda no sube nada: hacia arriba solo jala el cable, y su parte vertical va con el coseno, porque el ángulo es desde la vertical. De lado, la cuerda iguala la parte horizontal del cable.', ecuacion: [T, ` · cos ${ang}° = ${Pv}   →   `, T, ` = ${f(Tv)} N   ·   `, sub(T, 'h'), ` = ${f(Tv)} · sen ${ang}° = `, pj(N_(Th))] },
              { tipo: 'sentido', texto: ang === 37 ? 'Con el cable cerca de la vertical, la cuerda jala menos que el peso: basta un jalón chico para apartarlo un poco.' : 'Con el cable muy inclinado, la cuerda jala más que el peso: hace falta mucho jalón para apartarlo tanto.' },
            ],
            respuesta: [sub(T, 'h'), ' = ', pj(N_(Th))],
          };
        }
        const cosa = r.de(COLG_RS), ang = r.de([30, 37, 53]), Pv = r.de([60, 90, 120, 150]), Tv = Pv / (2 * SEN_(ang));
        return {
          enunciado: [`${cosa[0].toUpperCase()}${cosa.slice(1)} de ${Pv} N cuelga de un nudo con dos cables iguales que forman ${ang}° con el techo. ¿Cuánto jala cada cable?`],
          datos: [D2.comp, D2.equil, trigDe(ang)],
          dibujo: est(colgadoIgual(ang, Pv, { tT: 'T₁ = ?', tT2: 'T₂ = ?', tP: `P = ${N_(Pv)}` })),
          pasos: [
            { tipo: 'pide', texto: ['Piden la tensión ', T, ', lo que jala cada cable.'] },
            { tipo: 'datos', texto: ['Se conocen el peso, ', pp(N_(Pv)), `, y el ángulo de los cables con el techo, ${ang}°.`] },
            { tipo: 'regla', texto: 'Los cables son iguales, así que sus partes horizontales son iguales y opuestas, y se cancelan solas. Queda que lo vertical sume cero.', ecuacion: ['Σ', sub('F', 'y'), ' = 0'] },
            { tipo: 'cuentas', texto: `El ángulo es con el techo, así que cada cable sube con T · sen ${ang}°. Los dos juntos sostienen el peso, y de ahí se despeja T.`, ecuacion: [`2 · `, T, ` · sen ${ang}° = ${Pv}   →   `, T, ' = ', pj(N_(Tv))] },
            { tipo: 'sentido', texto: Tv > Pv / 2 ? `Cada uno jala más que la mitad del peso, ${f(Pv / 2)} N, porque solo una parte de su jalón va hacia arriba; el resto se gasta de lado.` : 'Cada uno jala la mitad del peso.' },
          ],
          respuesta: ['Cada cable jala ', pj(N_(Tv))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4;
        if (k === 0) {
          // Sin 30°: ahí cada cable jala justo el peso, que es la misión del juego y el error ST-P. Todas las opciones con
          // dos decimales exactos, para que ninguna se note por sus cifras (lector A: «46,19 N»).
          const { cosa, ang, Pv, Tv } = elegir(r, () => { const c = { cosa: r.de(COLG_AT), ang: r.de([37, 53]), Pv: r.de([60, 80, 90, 120, 150, 240]) }; c.Tv = c.Pv / (2 * SEN_(c.ang)); return exacto(c.Tv) && exacto(c.Pv / (2 * COS_(c.ang))) && c; });
          return {
            pregunta: [`${cosa[0].toUpperCase()}${cosa.slice(1)} de ${Pv} N cuelga de un nudo con dos cables iguales que forman ${ang}° con el techo. ¿Cuánto jala cada cable?`],
            datos: [D2.comp, D2.equil, trigDe(ang)],
            dibujo: est(colgadoIgual(ang, Pv, { tT: 'T₁ = ?', tT2: 'T₂ = ?', tP: `P = ${N_(Pv)}`, cosa: { tipo: 'caja', w: 50, h: 32, texto: '' } })),
            opciones: opciones(Tv, [
              { id: 'mitad', valor: Pv / 2, error: 'E8', siFuera: 'Repartiste el peso entre dos, pero eso vale si los cables fueran verticales. Inclinados, solo una parte de su jalón sube, así que cada uno tiene que jalar más que la mitad.' },
              { id: 'coseno', valor: Pv / (2 * COS_(ang)), error: 'ST-SENCOS', siFuera: 'El planteo es bueno, pero usaste el coseno. Con el ángulo medido desde el techo, que es horizontal, lo que sube va con el seno; el coseno da la parte de lado.' },
              { id: 'todo', valor: Pv, error: 'ST-P', siFuera: 'Ese es todo el peso. Cada cable jalaría eso solo a 30°; con este ángulo, los dos se reparten la carga y cada uno jala otra cantidad.' },
              { id: 'por', valor: Pv * SEN_(ang) / 2, error: 'ST-POR', siFuera: 'Multiplicaste por el seno, pero había que dividir entre él. La parte que sube, T · sen θ, es la que iguala la mitad del peso; por eso T sale mayor, no menor.' },
            ], N_),
            solucion: { texto: 'Las partes horizontales se cancelan, porque los cables son iguales, y las verticales de los dos sostienen el peso. De ahí se despeja T.', ecuacion: ['2', T, ` · sen ${ang}° = ${Pv}   →   `, T, ' = ', pj(N_(Tv))] },
          };
        }
        if (k === 1) {
          const Pv = r.de([50, 100, 150, 250, 300]), cual = sm % 8 < 4 ? 37 : 53, Tv = cual === 37 ? 0.6 * Pv : 0.8 * Pv;
          return {
            pregunta: [`Un letrero de ${Pv} N cuelga de un nudo con dos cables: uno forma 37° con el techo y el otro, 53°. ¿Cuánto jala el de ${cual}°?`],
            datos: [D2.comp, D2.equil, D2.trig],
            opciones: opciones(Tv, [
              { id: 'mitad', valor: Pv / 2, error: 'E8', siFuera: 'Los cables sí se reparten el peso, pero no por mitades: con ángulos distintos, el más parado sube más con su jalón y carga más.' },
              { id: 'otro', valor: cual === 37 ? 0.8 * Pv : 0.6 * Pv, error: 'E8-b', siFuera: 'Esa es la tensión del otro cable. Fíjate cuál te piden: el de 53° va más parado y jala más; el de 37°, menos.' },
              { id: 'todo', valor: Pv, error: 'ST-P', siFuera: 'Ese es todo el peso, pero los dos cables se lo reparten. Ninguno de los dos carga el letrero solo.' },
              { id: 'comp', valor: cual === 37 ? 0.36 * Pv : 0.64 * Pv, error: 'ST-COMP', siFuera: 'Esa es solo la parte vertical de ese cable. Piden todo lo que jala, que es más que lo que sube, porque una parte de su jalón va de lado.' },
            ], N_),
            solucion: { texto: 'Las partes de lado de los dos cables se cancelan y las de arriba suman el peso. Al resolver las dos ecuaciones, cada tensión sale como una fracción del peso:', ecuacion: [T, ` = ${cual === 37 ? '3/5' : '4/5'} · ${Pv} = `, pj(N_(Tv))] },
          };
        }
        if (k === 2) {
          const m = r.de([4, 6, 8, 12, 15]), Pv = m * G, movil = sm % 8 < 4, Fv = movil ? Pv / 2 : Pv;
          return {
            pregunta: [movil ? `Una carga de ${m} kg cuelga de una polea móvil liviana. Un tramo de la cuerda está amarrado al techo y el otro sube a tu mano. ¿Con qué fuerza la sostienes quieta?`
              : `Sostienes quieto un balde de ${m} kg con una cuerda que pasa por una polea fija del techo. ¿Con qué fuerza jalas?`],
            datos: [D.peso, D2.polea, D2.equil],
            dibujo: est(figPolea({ movil, P: Pv, F: Fv, tF: 'F = ?', cosa: { texto: `${m} kg` }, k: 40 / Pv })),
            opciones: opciones(Fv, movil ? [
              { id: 'todo', valor: Pv, error: 'MS-CUERDA', siFuera: 'Ese es el peso entero. Pero la polea móvil cuelga de dos tramos de la cuerda, y cada uno la jala hacia arriba con la misma fuerza: tu mano sostiene solo la mitad.' },
              { id: 'cuarto', valor: Pv / 4, error: 'MS-SUMA', siFuera: 'Repartiste entre cuatro, pero la polea cuelga de dos tramos, no de cuatro: cuenta los tramos que suben desde la polea.' },
              { id: 'doble', valor: 2 * Pv, error: 'MS-DOBLE', siFuera: 'La polea móvil sí cambia la fuerza, pero la achica, no la agranda: dos tramos sostienen la carga y cada uno aporta la mitad.' },
              { id: 'masa', valor: m / 2, error: 'N-MASA', siFuera: 'Sacaste la mitad, pero de los kilos. La fuerza va en newtons: primero pasa la masa a peso, con 10 N por kilo, y luego divide entre dos.' },
            ] : [
              { id: 'mitad', valor: Pv / 2, error: 'MS-FIJA', siFuera: 'Eso pasaría con una polea móvil. Una polea fija solo cambia la dirección del jalón, no lo achica: te deja jalar hacia abajo, pero con todo el peso.' },
              { id: 'doble', valor: 2 * Pv, error: 'MS-DOBLE', siFuera: 'Hay dos tramos, pero el balde cuelga de uno solo. La cuerda jala igual en los dos, así que tú jalas lo mismo que el tramo del balde, no el doble.' },
              { id: 'masa', valor: m, error: 'N-MASA', siFuera: 'Ese número son los kilos del balde. La fuerza va en newtons, y cada kilo pesa 10 N.' },
              { id: 'cuarto', valor: Pv / 4, error: 'MS-SUMA', siFuera: 'Buscaste un reparto, pero en una polea fija no lo hay: el balde cuelga de un solo tramo, y ese tramo carga todo su peso.' },
            ], N_),
            solucion: { texto: movil ? 'La polea cuelga de dos tramos de la misma cuerda, y los dos jalan con la misma T. Entre los dos sostienen la carga, así que tu mano aguanta la mitad.' : 'La cuerda jala igual a los dos lados de la polea fija: el tramo del balde sostiene su peso y tú jalas el otro tramo con lo mismo.', ecuacion: movil ? ['2', T, ` = ${Pv}   →   `, F, ' = ', pj(N_(Fv))] : [F, ' = ', T, ' = ', pj(N_(Fv))] },
          };
        }
        // Nivel examen: la escaladora contra la pared lisa (San Marcos 2023-II), con la cuerda a 37° o 53° de la pared.
        const { m, Pv, ang, Tv, Nv } = elegir(r, () => { const c = { m: r.de([45, 50, 60, 70, 80]), ang: r.de([37, 53]) }; c.Pv = c.m * G; c.Tv = c.Pv / COS_(c.ang); c.Nv = c.Tv * SEN_(c.ang); return exacto(c.Tv) && exacto(c.Nv) && c; });
        return {
          pregunta: [`Una escaladora de ${m} kg está quieta, con los pies contra una pared lisa y colgada de una cuerda que forma ${ang}° con la pared. ¿Con qué fuerza la empuja la pared?`],
          datos: [D.peso, D2.equil, D2.trig],
          dibujo: est(figPared({ ang, P: Pv, T: Tv, N: Nv, tN: 'N = ?', k: 80 / Tv, cosa: { texto: `${m} kg` } })),
          opciones: opciones(Nv, [
            { id: 'peso', valor: Pv, error: 'ES-PESO', siFuera: 'La pared lisa empuja de lado, perpendicular a ella, así que no puede sostener el peso: eso lo hace la cuerda. La pared solo equilibra lo que la cuerda jala hacia ella.' },
            { id: 'cuerda', valor: Tv, error: 'ST-T', siFuera: 'Ese es todo lo que jala la cuerda. La pared solo iguala la parte horizontal de ese jalón, que es menor que el jalón entero.' },
            { id: 'sen', valor: Pv * SEN_(ang), error: 'ST-SENCOS', siFuera: 'Partiste el peso con el seno, pero el peso no es lo que se parte. Primero se halla la cuerda con lo vertical; después se toma su parte de lado.' },
            { id: 'cos', valor: Pv * COS_(ang), error: 'ST-POR', siFuera: 'Partiste el peso, pero el peso ya es vertical y no tiene parte de lado. Lo que se parte es el jalón de la cuerda, que es la fuerza inclinada.' },
          ], N_),
          solucion: { texto: 'La pared lisa solo empuja de lado, así que la parte vertical de la cuerda sostiene el peso, y de ahí sale la cuerda. Su parte de lado es lo que empuja la pared.', ecuacion: [T, ` · cos ${ang}° = ${Pv}   →   `, N, ` = ${f(Tv)} · sen ${ang}° = `, pn(N_(Nv))] },
        };
      },
    },
  };

  // ======================= 3: rozamiento estático y cinético (el ropero que se empuja) =======================
  // Cambia: con cuánta fuerza empujas · Permanece: el ropero de 500 N y el piso · Progresa: hasta dónde aguanta quieto ·
  // Se reserva: cuánto frena el piso mientras no se mueve (el juego no dibuja el rozamiento) · Debe verse: el rozamiento
  // estático copia el empujón hasta un tope; el cinético vale μ_k · N.
  const MS3 = 0.4, MK3 = 0.3, P3 = 500, K3 = 0.12;
  // El DCL de un cuerpo con fuerzas de lado: F⃗ (con su ángulo θ sobre la horizontal) a la derecha y f⃗ a la izquierda.
  // El DCL del cuerpo que se empuja. El rozamiento va siempre que el cuerpo se apoya y algo lo empuja de lado (lector A:
  // «con F sola hacia un lado no debería quedarse quieto»): si no se sabe cuánto vale, con «?» y sin escala.
  function dclRoce(fz, o = {}) {
    const cx = o.cx || 258, cy = o.cy || 126, h = 16, w = 44, fl = [], fijo = !!o.sinEscala;
    // una sola escala: la flecha más larga, de unos 56 px
    const k = Math.min(o.k || K3, 56 / Math.max(fz.P || 1, fz.N || 1), fz.F ? 34 / fz.F : Infinity);
    const L = (v, t) => largoDe(v, t, k, fijo);
    if (fz.P) fl.push({ de: [cx - 8, cy + h], ang: 270, largo: L(fz.P, fz.tP), color: 'h', texto: fz.tP || `P = ${N_(fz.P)}`, rumbo: [1, 0.3] });
    if (fz.N) fl.push({ de: [cx - 8, cy - h], ang: 90, largo: L(fz.N, fz.tN), color: 'f', texto: fz.tN || `N = ${N_(fz.N)}`, rumbo: [-1, -0.4] });
    if (fz.F) fl.push({ de: [cx + w / 2, cy], ang: fz.ang || 0, largo: L(fz.F, fz.tF), color: 'o', texto: fz.tF || `F = ${N_(fz.F)}`, rumbo: [0.4, -1] });
    if (fz.f || (fz.tf && fz.tf.includes('?'))) fl.push({ de: [cx - w / 2, cy + 6], ang: 180, largo: L(fz.f || 0, fz.tf), color: 'i', texto: fz.tf || `f = ${N_(fz.f)}`, rumbo: [-0.3, 1] });
    return { obj: [{ tipo: 'caja', fig: true, x: cx, y: cy + h, w, h: 2 * h }], fl, txt: [{ x: cx, y: 18, texto: o.titulo || 'DCL del ropero', ancla: 'middle', peso: 400 }] };
  }
  function figRoce(o) {
    const piso = 200, d = dclRoce(o.fz || {}, o.dcl || {});
    const c = Object.assign({ tipo: 'ropero', x: 120, y: piso, w: 60, h: 104 }, o.cosa || {});
    const objs = [c];
    // la mano toca el cuerpo, también si es bajo (un baúl)
    if (o.persona !== false) objs.push({ tipo: 'persona', x: c.x - c.w / 2 - 42, y: piso, alto: 104, mano: [c.x - c.w / 2, piso - Math.min(62, c.h * 0.6)] });
    return { alto: 226, piso: { y: piso, x0: 8, x1: 196 }, objetos: [...objs, ...d.obj], flechas: d.fl, textos: [...d.txt, ...(o.textos || [])], alt: o.alt };
  }
  const roce3 = F => (F <= MS3 * P3 + 1e-9 ? { quieto: true, f: F } : { quieto: false, f: MK3 * P3 });
  const juego3 = val => {
    const r = roce3(val.F);
    return est(figRoce({ fz: { P: P3, N: P3, F: val.F, tP: 'P⃗', tN: 'N⃗', tF: 'F⃗', tf: 'f⃗ = ?' }, textos: [{ x: 8, y: 22, texto: r.quieto ? 'quieto' : 'se mueve →', ancla: 'start' }],
      alt: `Una persona empuja el ropero de 500 N con ${val.F} N; ${r.quieto ? 'el ropero sigue quieto' : 'el ropero se mueve'}.` }));
  };
  const PRED3 = figRoce({ fz: { P: 500, N: 500, F: 120, tf: 'f = ?' }, textos: [{ x: 8, y: 22, texto: 'quieto', ancla: 'start' }, { x: 312, y: 210, texto: 'el piso frena: ?', ancla: 'end' }],
    alt: 'La persona empuja el ropero con 120 N y el ropero sigue quieto; cuánto lo frena el piso, con un signo de pregunta.' });
  const REVELA3 = figRoce({ fz: { P: 500, N: 500, F: 120, f: 120 }, textos: [{ x: 8, y: 22, texto: 'quieto', ancla: 'start' }], alt: 'El piso frena el ropero con 120 N, lo mismo que lo empujas.' });
  const corte3 = (F, fv, txt) => { const d = figRoce({ fz: { P: 500, N: 500, F, f: fv, tf: `f = ${N_(fv)}` }, textos: [{ x: 8, y: 22, texto: txt, ancla: 'start' }] }); return { objetos: d.objetos, flechas: d.flechas, textos: d.textos }; };
  const MIRA3 = Object.assign(figRoce({ fz: { P: 500, N: 500 } }), { alt: 'El ropero empujado cada vez más: el rozamiento copia el empujón hasta su tope; al deslizar, baja.',
    cortes: [corte3(60, 60, 'quieto'), corte3(120, 120, 'quieto'), corte3(200, 200, 'a punto de moverse'), corte3(220, 150, 'se mueve →'), corte3(150, 150, 'velocidad constante →')] });
  const D3 = {
    est: [fs, ' ≤ ', sub('μ', 's'), ' · ', N, ': quieto, vale lo que haga falta, hasta ese tope'],
    cin: [fk, ' = ', sub('μ', 'k'), ' · ', N, ' mientras desliza'],
    eq: 'Quieto o a velocidad constante, lo horizontal suma cero y lo vertical suma cero',
    eqRampa: 'Quieto o a velocidad constante: a lo largo de la rampa suma cero, y contra ella también',
    comp: D2.comp, trig: D2.trig,
    rampa: ['En una rampa de ángulo θ: ', P, ' · sen θ a lo largo y ', P, ' · cos θ contra ella'],
  };
  function figRampa(o) {
    const th = o.ang, x0 = 20, y0 = 214, L = 270, s0 = o.s || 150, cs = Math.cos(rad(th)), sn = Math.sin(rad(th));
    const base = [x0 + s0 * cs, y0 - s0 * sn], h = 34, w = 50, c = [base[0] - sn * h / 2, base[1] - cs * h / 2], k = o.k || 0.6, fl = [];
    if (o.P) fl.push({ de: c, ang: 270, largo: largoDe(o.P, o.tP, k), color: 'h', texto: o.tP || `P = ${N_(o.P)}`, rumbo: [1, 0.4] });
    if (o.N !== undefined) fl.push({ de: [base[0] - sn * h, base[1] - cs * h], ang: 90 + th, largo: largoDe(o.N || 0, o.tN, k), color: 'f', texto: o.tN || `N = ${N_(o.N)}`, rumbo: [-1, -0.3] });
    // el rozamiento, a lo largo de la rampa: hacia arriba si la caja tiende a bajar; hacia abajo (fAbajo) si sube
    if (o.f !== undefined) fl.push(o.fAbajo
      ? { de: [base[0] - cs * w / 2 - sn * 6, base[1] + sn * w / 2 - cs * 6], ang: th + 180, largo: largoDe(o.f || 0, o.tf, k), color: 'i', texto: o.tf || `f = ${N_(o.f)}`, rumbo: [-0.3, 1] }
      : { de: [base[0] + cs * w / 2 - sn * 6, base[1] - sn * w / 2 - cs * 6], ang: th, largo: largoDe(o.f || 0, o.tf, k), color: 'i', texto: o.tf || `f = ${N_(o.f)}`, rumbo: [0.3, -1] });
    if (o.F !== undefined) fl.push({ de: [base[0] + cs * w / 2 - sn * 18, base[1] - sn * w / 2 - cs * 18], ang: th, largo: largoDe(o.F || 0, o.tF, k), color: 'o', texto: o.tF || `F = ${N_(o.F)}`, rumbo: [0.3, -1] });
    return { alto: 236, objetos: [{ tipo: 'rampa', x0, y0, largo: L, ang: th }, { tipo: 'caja', x: base[0], y: base[1], w, h, giro: th, texto: o.texto || '' }],
      flechas: fl, angulos: [{ c: [x0, y0], de: 0, a: th, r: 44, texto: `${th}°` }], textos: o.textos || [], alt: o.alt };
  }

  // Ejemplos de la idea 3. Cuentas rehechas aparte (cuentas.js: decide si desliza comparando el empujón con el tope y
  // suma las fuerzas de cada eje): 50; 0,5·200; 0,2·300; 80; 0,3·400 contra 100; 0,35·400 contra 150 y 0,25·400;
  // 0,4·600; 75/250; 100·3/5; 100·4/5; 300 − 100·3/5 y cada alternativa; la fuerza mínima con 0,75; tan 37°; 60 + 0,5·80;
  // el empujón inclinado hacia abajo.
  const EJEMPLOS_ROCE = [
    { nivel: 1, titulo: 'La caja que no se mueve',
      figura: est(figRoce({ cosa: { tipo: 'caja', w: 70, h: 50, texto: '30 kg' }, fz: { P: 300, N: 300, F: 50, tf: 'f = ?' }, dcl: { titulo: 'DCL de la caja', k: 0.18 }, textos: [{ x: 8, y: 22, texto: 'quieta', ancla: 'start' }] })),
      enunciado: ['Empujas de lado una caja de 30 kg con ', pj('50 N'), ' y sigue quieta. ¿Con cuánta fuerza la frena el piso?'],
      datos: [D3.est, D3.eq],
      solucion: [{ texto: 'La caja sigue quieta, así que lo horizontal suma cero: el piso la frena con lo mismo que tú empujas, ni más ni menos.', ecuacion: [fs, ' = ', F, ' = ', pr('50 N')] }],
      respuesta: [fs, ' = ', pr('50 N')] },
    { nivel: 1, titulo: 'El tope del rozamiento',
      figura: est(figRoce({ persona: false, cosa: { tipo: 'caja', w: 70, h: 50, texto: '' }, fz: { P: 200, N: 200, tf: '' }, dcl: { titulo: 'DCL de la caja', k: 0.25 }, textos: [{ x: 8, y: 22, texto: 'μ_s = 0,5', ancla: 'start' }] })),
      enunciado: ['Una caja se apoya en el piso con una normal de ', pn('200 N'), '. Si μ_s = 0,5, ¿cuánto es lo más que puede frenar el rozamiento estático?'],
      datos: [D3.est],
      solucion: [{ texto: 'Lo más que puede frenar el estático es su tope, el coeficiente μ_s por la normal. Si el empujón pasara ese tope, la caja empezaría a deslizar:', ecuacion: [fs, ' máx = 0,5 · 200 = ', pr('100 N')] }],
      respuesta: [pr('100 N')] },
    { nivel: 1, titulo: 'Ya desliza',
      figura: est(figRoce({ cosa: { tipo: 'caja', w: 70, h: 50, texto: '' }, fz: { P: 300, N: 300, F: 90, f: 60, tF: 'F', tf: 'f = ?' }, dcl: { titulo: 'DCL de la caja', k: 0.18 }, textos: [{ x: 8, y: 22, texto: 'desliza →', ancla: 'start' }] })),
      enunciado: ['Una caja desliza por el piso con una normal de ', pn('300 N'), '. Si μ_k = 0,2, ¿con cuánta fuerza la frena el rozamiento?'],
      datos: [D3.cin],
      solucion: [{ texto: 'La caja ya desliza, así que actúa el rozamiento cinético. Ese no se ajusta al empujón: vale siempre μ_k por la normal.', ecuacion: [fk, ' = 0,2 · 300 = ', pr('60 N')] }],
      respuesta: [fk, ' = ', pr('60 N')] },
    { nivel: 1, titulo: 'Arrastrar a velocidad constante',
      figura: est(figRoce({ cosa: { tipo: 'caja', w: 70, h: 50, texto: '' }, fz: { P: 300, N: 300, F: 80, f: 80, tF: 'F = ?', tf: 'f = 80 N' }, dcl: { titulo: 'DCL de la caja', k: 0.18 }, textos: [{ x: 8, y: 22, texto: 'velocidad constante →', ancla: 'start' }] })),
      enunciado: ['Empujas una caja que desliza a velocidad constante. El piso la frena con ', pr('80 N'), '. ¿Con cuánta fuerza la empujas?'],
      datos: [D.primera],
      solucion: [{ texto: 'A velocidad constante la caja no acelera, así que las fuerzas suman cero, igual que si estuviera quieta: tu empujón iguala al rozamiento.', ecuacion: [F, ' = ', fk, ' = ', pj('80 N')] }],
      respuesta: [F, ' = ', pj('80 N')] },
    { nivel: 1, titulo: '¿Se mueve o no?',
      figura: est(figRoce({ fz: { P: 400, N: 400, F: 100, tf: 'f = ?' }, dcl: { k: 0.14 }, textos: [{ x: 8, y: 22, texto: 'μ_s = 0,3', ancla: 'start' }] })),
      enunciado: ['Un ropero de 400 N está en un piso con μ_s = 0,3. Lo empujas de lado con ', pj('100 N'), '. ¿Se mueve? ¿Cuánto vale el rozamiento?'],
      datos: [D3.est, D3.eq],
      solucion: [
        { texto: 'Primero se calcula el tope del estático, lo más que puede frenar el piso. Empujas de lado, así que la normal es el peso:', ecuacion: [fs, ' máx = 0,3 · 400 = 120 N'] },
        { texto: 'Tu empujón, 100 N, no llega al tope de 120 N: el ropero sigue quieto, y el rozamiento frena justo lo que empujas.', ecuacion: [fs, ' = ', pr('100 N')] },
      ],
      respuesta: ['No se mueve; ', fs, ' = ', pr('100 N')] },
    { nivel: 2, titulo: 'Empujar de más',
      figura: est(figRoce({ fz: { P: 400, N: 400, F: 150, f: 100, tf: 'f = ?' }, dcl: { k: 0.14 }, textos: [{ x: 8, y: 22, texto: 'μ_s = 0,35; μ_k = 0,25', ancla: 'start' }] })),
      enunciado: ['Un ropero de 40 kg está en un piso con μ_s = 0,35 y μ_k = 0,25. Lo empujas de lado con ', pj('150 N'), '. ¿Con cuánta fuerza lo frena el piso?'],
      datos: [D.peso, D3.est, D3.cin],
      solucion: [
        { texto: 'El ropero pesa 400 N, y esa es la normal, porque lo empujas de lado. Con eso, el tope del estático es:', ecuacion: [fs, ' máx = 0,35 · 400 = 140 N'] },
        { texto: 'Tu empujón, 150 N, pasa el tope de 140 N: el ropero desliza, y desde ahí lo frena el cinético, μ_k por la normal.', ecuacion: [fk, ' = 0,25 · 400 = ', pr('100 N')] },
      ],
      respuesta: [fk, ' = ', pr('100 N')] },
    { nivel: 2, titulo: 'La fuerza para arrancarlo',
      figura: est(figRoce({ fz: { P: 600, N: 600, F: 240, f: 240, tF: 'F = ?', tf: 'f' }, dcl: { k: 0.1, sinEscala: true }, textos: [{ x: 8, y: 22, texto: '60 kg; μ_s = 0,4', ancla: 'start' }] })),
      enunciado: ['Un ropero de 60 kg está en un piso con μ_s = 0,4. ¿Con qué fuerza de lado empieza a moverse?'],
      datos: [D.peso, D3.est, D3.eq],
      solucion: [
        { texto: 'Tu empujón es de lado y no aprieta ni levanta el ropero, así que la normal iguala al peso:', ecuacion: [N, ' = 60 · 10 = 600 N'] },
        { texto: 'Mientras empujas menos que el tope, el piso frena lo mismo y el ropero no se mueve. Empieza a moverse cuando tu empujón llega al tope:', ecuacion: [F, ' = 0,4 · 600 = ', pj('240 N')] },
      ],
      respuesta: [F, ' = ', pj('240 N')] },
    { nivel: 2, titulo: '¿Qué tan áspero es el piso?',
      figura: est(figRoce({ cosa: { tipo: 'caja', w: 70, h: 50, texto: '25 kg' }, fz: { P: 250, N: 250, F: 75, f: 75, tf: 'f' }, dcl: { titulo: 'DCL de la caja', k: 0.2 }, textos: [{ x: 8, y: 22, texto: 'velocidad constante →', ancla: 'start' }] })),
      enunciado: ['Arrastras una caja de 25 kg a velocidad constante empujándola de lado con ', pj('75 N'), '. ¿Cuánto vale μ_k?'],
      datos: [D.peso, D3.cin, D.primera],
      solucion: [
        { texto: 'La caja va a velocidad constante, así que las fuerzas de lado suman cero: el rozamiento cinético iguala tu empujón.', ecuacion: [fk, ' = ', pr('75 N')] },
        { texto: 'Empujas de lado, así que la normal es el peso, 250 N. Como el cinético es μ_k por la normal, μ_k es el rozamiento entre la normal:', ecuacion: [sub('μ', 'k'), ' = ', { frac: [pr('75'), pn('250')] }, ' = 0,3'] },
      ],
      respuesta: [sub('μ', 'k'), ' = 0,3'] },
    { nivel: 2, titulo: 'La caja quieta en la rampa',
      figura: est(figRampa({ ang: 37, P: 100, f: 60, N: 80, tf: 'f = ?', tN: 'N', texto: '10 kg', k: 0.5, alt: 'Una caja de 10 kg quieta en una rampa de 37°.' })),
      enunciado: ['Una caja de 10 kg está quieta en una rampa de 37°. ¿Con cuánta fuerza la sostiene el rozamiento?'],
      datos: [D.peso, D3.rampa, D3.trig, D3.eqRampa],
      solucion: [{ texto: 'En la rampa, el peso se parte en dos: una parte a lo largo, que la haría bajar, y otra contra la rampa. Como la caja está quieta, el rozamiento iguala la parte que la haría bajar:', ecuacion: [fs, ' = 100 · sen 37° = 100 · ', { frac: ['3', '5'] }, ' = ', pr('60 N')] }],
      respuesta: [fs, ' = ', pr('60 N')] },
    { nivel: 2, titulo: 'La normal en la rampa',
      figura: est(figRampa({ ang: 37, P: 100, N: 80, tN: 'N = ?', texto: '10 kg', k: 0.5, alt: 'Una caja de 10 kg quieta en una rampa de 37°.' })),
      enunciado: ['La misma caja de 10 kg, quieta en la rampa de 37°: ¿con cuánta fuerza la empuja la rampa?'],
      datos: [D.peso, D3.rampa, D3.trig, D3.eqRampa],
      solucion: [{ texto: 'La caja no se hunde ni se separa de la rampa, así que la normal iguala la parte del peso que la aprieta contra ella. Por eso sale menos que el peso:', ecuacion: [N, ' = 100 · cos 37° = 100 · ', { frac: ['4', '5'] }, ' = ', pn('80 N')] }],
      respuesta: [N, ' = ', pn('80 N'), ': menos que el peso'] },
    { nivel: 3, titulo: 'Jalar hacia arriba con ángulo',
      figura: est(figRoce({ cosa: { tipo: 'caja', w: 70, h: 50, texto: '30 kg' }, persona: false, fz: { P: 300, N: 240, F: 100, f: 80, ang: 37, tN: 'N = ?', tf: 'f' }, dcl: { titulo: 'DCL de la caja', k: 0.2, sinEscala: true }, textos: [{ x: 8, y: 22, texto: 'velocidad constante →', ancla: 'start' }],
        alt: 'Una caja de 30 kg arrastrada con 100 N que forman 37° sobre la horizontal, a velocidad constante.' })),
      enunciado: ['Arrastras una caja de 30 kg a velocidad constante con una fuerza de ', pj('100 N'), ' que forma 37° sobre la horizontal. ¿Con cuánta fuerza la empuja el piso? (Como en San Marcos 2025-I.)'],
      alternativas: ['300 N', '360 N', '220 N', '240 N', '80 N'],
      datos: [D.peso, D3.comp, D3.trig, D3.eq],
      solucion: [
        { texto: 'Tu fuerza va inclinada: su parte vertical, 100 · sen 37° = 60 N, levanta un poco la caja y ayuda al piso a sostenerla.' },
        { texto: 'Lo vertical suma cero: la normal y la parte vertical de tu fuerza juntas igualan al peso, así que la normal sale menor que el peso.', ecuacion: [N, ' + 60 = 300   →   ', N, ' = ', pn('240 N')] },
        { texto: ['La ', neg('A'), ' iguala la normal al peso y olvida que tu fuerza levanta la caja. La ', neg('B'), ' suma los 60 N, como si empujaras hacia abajo. La ', neg('C'), ' resta la parte horizontal, 100 · cos 37°, y la ', neg('E'), ' da esa parte horizontal.'] },
      ],
      respuesta: [neg('D'), ', ', pn('240 N')] },
    { nivel: 3, titulo: 'La fuerza mínima con ángulo',
      figura: est(figRoce({ cosa: { tipo: 'caja', w: 70, h: 50, texto: '10 kg' }, persona: false, fz: { P: 100, N: 64, F: 60, f: 48, ang: 37, tF: 'F = ?', tN: 'N', tf: 'f' }, dcl: { titulo: 'DCL de la caja', k: 0.45, sinEscala: true }, textos: [{ x: 8, y: 22, texto: 'μ_s = 0,75', ancla: 'start' }],
        alt: 'Una caja de 10 kg jalada con una fuerza que forma 37° sobre la horizontal.' })),
      enunciado: ['Una caja de 10 kg está en un piso con μ_s = 0,75. La jalas con una fuerza que forma 37° sobre la horizontal. ¿Con qué fuerza empieza a moverse? (Como en San Marcos 2026-II.)'],
      alternativas: ['93,75 N', '60 N', '75 N', '62,5 N', '48 N'],
      datos: [D.peso, D3.est, D3.comp, D3.trig],
      solucion: [
        { texto: 'Tu fuerza jala hacia arriba con F · sen 37°, así que la normal ya no es el peso: baja en esa cantidad.', ecuacion: [N, ' = 100 − ', F, ' · 3/5'] },
        { texto: 'Empieza a moverse cuando la parte de lado, F · cos 37°, llega al tope, μ_s por esa normal. Queda una ecuación con una sola incógnita, F:', ecuacion: [F, ' · 4/5 = 0,75 · (100 − ', F, ' · 3/5)   →   ', F, ' = ', pj('60 N')] },
        { texto: ['La ', neg('A'), ' toma la normal igual al peso y olvida que la fuerza levanta la caja. La ', neg('C'), ' jala de lado, sin ángulo. La ', neg('D'), ' cambia el seno por el coseno, y la ', neg('E'), ' da solo la parte horizontal de la fuerza.'] },
      ],
      respuesta: [neg('B'), ', ', pj('60 N')] },
    { nivel: 3, titulo: 'A punto de resbalar',
      figura: est(figRampa({ ang: 37, P: 100, f: 60, N: 80, tf: 'f', tN: 'N', tP: 'P', k: 0.5, textos: [{ x: 8, y: 22, texto: 'a punto de resbalar', ancla: 'start' }], alt: 'Una caja a punto de resbalar en una rampa de 37°.' })),
      enunciado: ['Una caja está quieta en una rampa de 37°, pero a punto de resbalar. ¿Cuánto vale μ_s entre la caja y la rampa?'],
      alternativas: ['0,75', '0,6', '0,8', '1,33', '1,25'],
      datos: [D3.est, D3.rampa, D3.trig, D2.tan],
      solucion: [
        { texto: 'A punto de resbalar, el rozamiento está en su tope, y ese tope iguala justo la parte del peso que la haría bajar:', ecuacion: [P, ' · sen 37° = ', sub('μ', 's'), ' · ', P, ' · cos 37°'] },
        { texto: 'El peso aparece a los dos lados y se cancela: μ_s queda como el seno entre el coseno, que es la tangente del ángulo.', ecuacion: [sub('μ', 's'), ' = tan 37° = ', { frac: ['3', '4'] }, ' = 0,75'] },
        { texto: ['La ', neg('B'), ' y la ', neg('C'), ' dan solo el seno o el coseno. La ', neg('D'), ' divide al revés, el coseno entre el seno, y la ', neg('E'), ' iguala el rozamiento al peso entero: μ_s · P · cos 37° = P.'] },
      ],
      respuesta: [neg('A'), ', μ_s = 0,75'] },
    { nivel: 3, titulo: 'Subir la caja por la rampa',
      figura: est(figRampa({ ang: 37, P: 100, F: 100, f: 40, fAbajo: true, N: 80, tF: 'F = ?', tf: 'f', tN: 'N', tP: 'P', k: 0.45, texto: '10 kg', textos: [{ x: 8, y: 22, texto: 'sube a velocidad constante; μ_k = 0,5', ancla: 'start' }], alt: 'Una caja de 10 kg que sube por una rampa de 37° empujada por una fuerza paralela a la rampa.' })),
      enunciado: ['Subes una caja de 10 kg por una rampa de 37° a velocidad constante, empujándola paralela a la rampa. Si μ_k = 0,5, ¿con qué fuerza la empujas? (Como en San Marcos 2019-I.)'],
      alternativas: ['60 N', '20 N', '110 N', '40 N', '100 N'],
      datos: [D.peso, D3.cin, D3.rampa, D3.trig, D3.eqRampa],
      solucion: [
        { texto: 'Contra la rampa, la normal iguala la parte del peso que aprieta la caja contra ella:', ecuacion: [N, ' = 100 · cos 37° = 80 N'] },
        { texto: 'La caja desliza, así que la frena el rozamiento cinético, μ_k por la normal.', ecuacion: [fk, ' = 0,5 · 80 = 40 N'] },
        { texto: 'La caja sube, y el rozamiento se opone siempre al deslizamiento: apunta rampa abajo, junto con la parte del peso. Tu empujón tiene que igualar las dos:', ecuacion: [F, ' = 100 · sen 37° + 40 = 60 + 40 = ', pj('100 N')] },
        { texto: ['La ', neg('A'), ' olvida el rozamiento. La ', neg('B'), ' lo resta, como si ayudara a subir. La ', neg('C'), ' cambia el seno por el coseno, y la ', neg('D'), ' da solo el rozamiento.'] },
      ],
      respuesta: [neg('E'), ', ', pj('100 N')] },
    { nivel: 3, titulo: 'Empujar hacia abajo con ángulo',
      figura: est(figRoce({ cosa: { tipo: 'caja', w: 70, h: 50, texto: '20 kg' }, fz: { P: 200, N: 230, F: 50, ang: -37, tf: 'f = ?' }, dcl: { titulo: 'DCL de la caja', k: 0.22 }, textos: [{ x: 8, y: 22, texto: 'μ_s = 0,5', ancla: 'start' }],
        alt: 'Una caja de 20 kg empujada con 50 N hacia abajo, con 37° bajo la horizontal.' })),
      enunciado: ['Una caja de 20 kg está en un piso con μ_s = 0,5. La empujas con ', pj('50 N'), ' que forman 37° bajo la horizontal y sigue quieta. ¿Con cuánta fuerza la frena el piso?'],
      alternativas: ['115 N', '100 N', '40 N', '50 N', '0 N'],
      datos: [D.peso, D3.est, D3.comp, D3.trig, D3.eq],
      solucion: [
        { texto: 'Tu fuerza empuja hacia abajo, así que aprieta la caja contra el piso y la normal sube. Con ella, el tope del estático también sube:', ecuacion: [N, ' = 200 + 50 · 3/5 = 230 N   ·   tope: 0,5 · 230 = 115 N'] },
        { texto: 'De lado empujas 50 · 4/5 = 40 N. No llega al tope de 115 N, así que la caja sigue quieta y el rozamiento frena justo esos 40 N.', ecuacion: [fs, ' = ', pr('40 N')] },
        { texto: ['La ', neg('A'), ' da el tope, pero la caja no está a punto de moverse. La ', neg('B'), ' da el tope con la normal igual al peso. La ', neg('D'), ' toma toda tu fuerza, sin partirla, y la ', neg('E'), ' cree que, si está quieta, no hay rozamiento.'] },
      ],
      respuesta: [neg('C'), ', ', pr('40 N')] },
  ];

  const COSAS3_AT = [{ nombre: 'un ropero', lo: 'Lo', cosa: { tipo: 'ropero' } }, { nombre: 'una refrigeradora', lo: 'La', cosa: { tipo: 'ropero', w: 56, h: 110 } }, { nombre: 'un baúl', lo: 'Lo', cosa: { tipo: 'caja', w: 76, h: 50 } }];
  const COSAS3_RS = [{ nombre: 'un estante de libros', lo: 'Lo', cosa: { tipo: 'ropero', w: 66, h: 96 } }, { nombre: 'una mesa de madera', lo: 'La', cosa: { tipo: 'caja', w: 80, h: 40 } }];
  const roce = {
    id: 'rozamiento-se-ajusta',
    titulo: 'Rozamiento estático y cinético',
    pregunta: 'Si empujas un ropero y no se mueve, ¿cuánto lo frena el piso?',
    temas: ['Rozamiento estático y cinético'],
    pieza: 'fis-estatica',
    aprendizaje: 'Quieto, el rozamiento frena lo justo, hasta un tope; deslizando, frena siempre lo mismo. Ambos dependen de la normal, que no siempre es el peso.',
    actividad: 'Empujar el ropero del cuarto hasta que empiece a moverse.',
    lee: {
      tarjetas: [
        { titulo: 'El piso también frena', texto: 'Empujas un ropero pesado y no se mueve, así que algo lo frena: es el piso. Las pequeñas asperezas del piso y del ropero se traban, y el piso lo empuja paralelo al suelo, en contra del deslizamiento. Esa fuerza se llama rozamiento, f.',
          dibujo: est(figRoce({ fz: { P: 500, N: 500, F: 100, tP: 'P⃗', tN: 'N⃗', tF: 'F⃗', tf: 'f⃗ = ?' }, alt: 'Una persona empuja el ropero del cuarto; el piso lo frena con el rozamiento.' })) },
        { titulo: 'Dos nombres', texto: ['Mientras el cuerpo sigue quieto, actúa el rozamiento estático, ', fs, '. Cuando ya desliza, actúa el rozamiento cinético, ', fk, '. Cada uno tiene su coeficiente, μ_s y μ_k: números sin unidad que dicen qué tan ásperas son las dos superficies juntas. Con un coeficiente mayor, el piso puede frenar más.'] },
        { titulo: 'Áspero o liso', texto: 'Una zapatilla sobre cemento seco tiene un coeficiente alto, y por eso no resbala; sobre la escarcha de una mañana fría en el altiplano, uno muy bajo. Al jugar, empuja cada vez más y mira cuándo empieza a moverse.' },
      ],
    },
    ejemplos: EJEMPLOS_ROCE,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'El ropero del cuarto pesa 500 N. Lo empujas de lado, cada vez más fuerte; el juego dice si se mueve.',
      mision: {
        texto: 'Encuentra la mayor fuerza con la que el ropero sigue quieto.',
        logrado: val => Math.abs(val.F - MS3 * P3) < 1e-9,
        bien: 'Ese es el tope: con un poco más, el piso ya no alcanza a frenarlo.',
      },
      voz: 'Empuja más. ¿Cuándo cede?',
      leyenda: [
        { s: [vec(F)], t: 'lo que empuja tu mano' },
        { s: [vec(P)], t: 'el peso del ropero' },
        { s: [vec(N)], t: 'el piso lo empuja hacia arriba' },
        { s: [vec(fr)], t: 'el rozamiento: cuánto frena, en «Mira»' },
      ],
      controles: [{ id: 'F', etiqueta: 'Empujón, F', color: 'c-o', min: 0, max: 300, paso: 20, inicio: 60, unidad: 'N', decimales: 0 }],
      dibujo: juego3,
      lectura: val => (roce3(val.F).quieto ? ['Empujas con ', pj(N_(val.F)), ' y el ropero sigue quieto'] : ['Con ', pj(N_(val.F)), ', el ropero ya se mueve']),
      resumen: { F: 100 },
      minimo: 3,
    },
    predice: {
      pregunta: 'Empujas el ropero con 120 N y sigue quieto. ¿Con cuánta fuerza lo frena el piso?',
      datos: ['El ropero pesa 500 N.', 'En el juego, empezó a moverse al pasar de 200 N.'],
      opciones: [
        { id: 'c', texto: '120 N', correcta: true },
        { id: 'max', texto: '200 N', error: 'E10', siFuera: '200 N es lo más que puede frenar el piso, su tope, y lo encontraste bien en el juego. Pero el tope solo se alcanza a punto de moverse; antes, el piso frena justo lo que haga falta.' },
        { id: 'cero', texto: '0 N', error: 'RZ-CERO', siFuera: 'Es cierto que no se mueve, pero eso no quiere decir que nada lo frene. Sin rozamiento, tus 120 N lo harían deslizar, como pasaría sobre un hielo muy liso: si sigue quieto, el piso lo está frenando.' },
        { id: 'resta', texto: '80 N', error: 'RZ-RESTA', siFuera: 'Restaste tu empujón del tope, 200 − 120: eso es lo que le falta al rozamiento para llegar a su límite, no lo que frena. Para que el ropero siga quieto, el piso tiene que frenar lo mismo que empujas.' },
      ],
      dibujo: est(PRED3),
      revelar: est(REVELA3),
      coincide: 'Coincide: quieto, el piso frena justo lo que empujas, 120 N. Aún le sobra para llegar a 200 N.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: MIRA3,
      pasos: [
        { estado: { corte: 0 }, texto: 'Empujas con 60 N y el ropero sigue quieto, así que el piso lo frena con 60 N: lo justo para que las fuerzas de lado sumen cero.', ecuacion: [fs, ' = ', F, ' = ', pr('60 N')] },
        { estado: { corte: 1 }, texto: 'Con 120 N, el piso frena 120 N. El rozamiento estático no tiene un valor fijo: copia tu empujón para mantener el ropero quieto.', ecuacion: [fs, ' = ', pr('120 N')] },
        { estado: { corte: 2 }, texto: 'Con 200 N llega a su tope, μ_s · N, con μ_s = 0,4. Es lo más que puede frenar: el ropero está a punto de moverse.', ecuacion: [fs, ' máx = 0,4 · 500 = ', pr('200 N')] },
        { estado: { corte: 3 }, texto: 'Al pasar el tope, el ropero desliza y lo frena el cinético, μ_k · N, con μ_k = 0,3. Frena menos que el tope: por eso, ya en marcha, cuesta menos empujarlo.', ecuacion: [fk, ' = 0,3 · 500 = ', pr('150 N')] },
        { estado: { corte: 4 }, texto: 'Para que siga a velocidad constante, las fuerzas tienen que sumar cero: basta empujar con lo mismo que frena el cinético, 150 N.', ecuacion: [F, ' = ', fk, ' = ', pj('150 N')] },
      ],
    },
    regla: {
      texto: 'Mientras el cuerpo no desliza, el rozamiento estático frena lo justo para que siga quieto, y puede crecer hasta un tope: su coeficiente por la normal. Cuando desliza, el cinético ya no se ajusta: vale siempre su coeficiente por la normal, y suele ser menor que ese tope.',
      ecuacion: [fs, ' ≤ ', sub('μ', 's'), ' · ', N, '   ·   ', fk, ' = ', sub('μ', 'k'), ' · ', N],
      condicion: 'el cuerpo se apoya en una superficie con una normal N. Esa normal no siempre es el peso: una fuerza inclinada la sube o la baja, y en una rampa vale menos; si usas el peso, el tope sale mal.',
      dibujo: est(REVELA3),
    },
    // Así se resuelve: un estante o una mesa (otra lista que «Ahora tú»), quietos o deslizando, y en las semillas impares la
    // caja en una rampa de 53°.
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 1) {
          const m = r.de([4, 6, 8, 12]), Pv = m * G, fsv = Pv * 0.6;
          return {
            enunciado: [`Una caja de ${m} kg está quieta en una rampa de 37°. ¿Con cuánta fuerza la sostiene el rozamiento?`],
            datos: [D.peso, D3.rampa, D3.trig, D3.eqRampa],
            dibujo: est(figRampa({ ang: 37, P: Pv, f: fsv, N: Pv * 0.8, tf: 'f = ?', tN: 'N', texto: `${m} kg`, k: 50 / Pv })),
            pasos: [
              { tipo: 'pide', texto: 'Piden el rozamiento estático: la fuerza con que la rampa sostiene la caja para que no resbale.' },
              { tipo: 'datos', texto: ['La caja pesa ', pp(N_(Pv)), ', y la rampa forma 37° con el piso.'] },
              { tipo: 'regla', texto: 'La caja está quieta, así que a lo largo de la rampa las fuerzas suman cero: el rozamiento iguala la parte del peso que va rampa abajo, P · sen θ.', ecuacion: [fs, ' = ', P, ' · sen θ'] },
              { tipo: 'cuentas', texto: 'Con sen 37° = 3/5, la parte del peso que la haría bajar es:', ecuacion: [fs, ` = ${Pv} · 3/5 = `, pr(N_(fsv))] },
              { tipo: 'sentido', texto: 'El rozamiento sostiene 3/5 del peso, la parte que la haría bajar. La otra parte del peso, P · cos θ, no la hace resbalar: aprieta la caja contra la rampa.' },
            ],
            respuesta: [fs, ' = ', pr(N_(fsv))],
          };
        }
        const ob = r.de(COSAS3_RS), m = r.de([20, 30, 40, 50]), mu = r.de([0.3, 0.4, 0.5]), Pv = m * G, tope = mu * Pv, Fv = r.de([0.5, 0.75]) * tope;
        return {
          enunciado: [`${ob.nombre[0].toUpperCase()}${ob.nombre.slice(1)} de ${m} kg está en un piso con μ_s = ${f(mu)}. ${ob.lo} empujas de lado con `, pj(N_(Fv)), '. ¿Cuánto vale el rozamiento?'],
          datos: [D.peso, D3.est, D3.eq],
          dibujo: est(figRoce({ cosa: ob.cosa, fz: { P: Pv, N: Pv, F: Fv, tf: 'f = ?' }, dcl: { titulo: 'DCL', k: 60 / Pv } })),
          pasos: [
            { tipo: 'pide', texto: 'Piden con cuánta fuerza lo frena el piso: el rozamiento.' },
            { tipo: 'datos', texto: ['Su peso, ', pp(N_(Pv)), ', es la normal: nada más lo aprieta ni lo levanta. Empujas ', pj(N_(Fv)), '.'] },
            { tipo: 'regla', texto: 'Mientras no desliza, el rozamiento estático frena lo que haga falta, hasta su tope. Por eso hay que comparar tu empujón con ese tope.', ecuacion: [fs, ' ≤ ', sub('μ', 's'), ' · ', N] },
            { tipo: 'cuentas', texto: `El tope es ${f(mu)} · ${Pv} = ${f(tope)} N. Tu empujón no llega, así que sigue quieto, y el piso lo frena con lo mismo que empujas.`, ecuacion: [fs, ' = ', F, ' = ', pr(N_(Fv))] },
            { tipo: 'sentido', texto: `Sale menos que el tope porque no está a punto de moverse. Si empujaras más de ${f(tope)} N, empezaría a deslizar.` },
          ],
          respuesta: [fs, ' = ', pr(N_(Fv))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4;
        if (k === 0) {
          // Ningún error da la correcta (lector A: con μ_s = 0,5, μ_k = 0,4 y 0,8 del tope, μ_k · N daba lo mismo que F).
          const mueve = sm % 8 >= 4;
          const { ob, m, Pv, mus, muk, tope, Fv, fv } = elegir(r, () => {
            const c = { ob: r.de(COSAS3_AT), m: r.de([20, 30, 40, 50, 60]), mus: r.de([0.4, 0.5, 0.6]) };
            c.Pv = c.m * G; c.muk = Math.round((c.mus - 0.1) * 10) / 10; c.tope = c.mus * c.Pv;
            c.Fv = mueve ? c.tope + r.de([20, 40, 60]) : r.de([0.4, 0.6, 0.8]) * c.tope; c.fv = mueve ? c.muk * c.Pv : c.Fv;
            const errores = mueve ? [c.Fv, c.tope, c.Fv - c.muk * c.Pv, 0] : [c.tope, 0, c.tope - c.Fv, c.muk * c.Pv];
            return errores.every(x => Math.abs(x - c.fv) > 1e-9) && c;
          });
          return {
            pregunta: [`${ob.nombre[0].toUpperCase()}${ob.nombre.slice(1)} de ${m} kg está en un piso con μ_s = ${f(mus)} y μ_k = ${f(muk)}. ${ob.lo} empujas de lado con `, pj(N_(Fv)), `. ¿Con cuánta fuerza ${ob.lo.toLowerCase()} frena el piso?`],
            datos: [D.peso, D3.est, D3.cin, D3.eq],
            dibujo: est(figRoce({ cosa: ob.cosa, fz: { P: Pv, N: Pv, F: Fv, tf: 'f = ?' }, dcl: { titulo: 'DCL', k: 60 / Pv } })),
            opciones: opciones(fv, mueve ? [
              { id: 'F', valor: Fv, error: 'RZ-F', siFuera: 'Quieto, el piso copiaría tu empujón, pero aquí pasaste el tope y el cuerpo desliza. Desde ese momento lo frena el rozamiento cinético, que no se ajusta a tu empujón.' },
              { id: 'mus', valor: tope, error: 'RZ-MUS', siFuera: 'Ese es el tope estático, lo más que frena mientras está quieto. Pero ya lo pasaste y el cuerpo desliza: ahora frena el cinético, con su coeficiente, que es menor.' },
              { id: 'resta', valor: Fv - muk * Pv, error: 'RZ-RESTA', siFuera: 'Restaste el cinético de tu empujón: eso es lo que sobra, lo que acelera el cuerpo. Lo que frena el piso es el cinético mismo, su coeficiente por la normal.' },
              { id: 'cero', valor: 0, error: 'RZ-CERO', siFuera: 'Que se mueva no apaga el rozamiento. Mientras desliza, el piso sigue frenándolo con el cinético, que depende de la normal y no de la rapidez.' },
            ] : [
              { id: 'max', valor: tope, error: 'E10', siFuera: 'Ese es el tope, lo más que puede frenar el piso. Pero tu empujón no llega a él, así que el cuerpo sigue quieto y el piso frena solo lo que haga falta.' },
              { id: 'cero', valor: 0, error: 'RZ-CERO', siFuera: 'Sigue quieto, pero eso no quiere decir que nada lo frene. Sin rozamiento, tu empujón lo haría deslizar; si no se mueve, el piso lo está frenando.' },
              { id: 'resta', valor: tope - Fv, error: 'RZ-RESTA', siFuera: 'Restaste tu empujón del tope: eso es lo que le falta al rozamiento para llegar a su límite. Para que el cuerpo siga quieto, el piso frena lo mismo que empujas.' },
              { id: 'cin', valor: muk * Pv, error: 'RZ-MUK', siFuera: 'Usaste el coeficiente cinético, pero ese vale solo cuando el cuerpo desliza. Tu empujón no llegó al tope, así que sigue quieto y actúa el estático.' },
            ], N_),
            solucion: { texto: mueve ? `El tope es ${f(tope)} N y tu empujón lo pasa: el cuerpo desliza, y lo frena el cinético, que vale su coeficiente por la normal.` : `El tope es ${f(tope)} N y tu empujón no llega: el cuerpo sigue quieto, y el estático frena justo lo que empujas.`, ecuacion: mueve ? [fk, ` = ${f(muk)} · ${Pv} = `, pr(N_(fv))] : [fs, ' = ', pr(N_(fv))] },
          };
        }
        if (k === 1) {
          const m = r.de([15, 20, 25, 40, 50]), Pv = m * G, muk = r.de([0.2, 0.25, 0.3, 0.4]), Fv = muk * Pv;
          return {
            pregunta: [`Arrastras un costal de ${m} kg por el piso a velocidad constante, empujándolo de lado. Si μ_k = ${f(muk)}, ¿con qué fuerza lo empujas?`],
            datos: [D.peso, D3.cin, D.primera],
            opciones: opciones(Fv, [
              { id: 'peso', valor: Pv, error: 'N-MG', siFuera: 'Usaste el peso, que aquí es la normal. Pero la fuerza de lado no iguala al peso: iguala al rozamiento, que es el coeficiente cinético por la normal.' },
              { id: 'masa', valor: muk * m, error: 'N-MASA', siFuera: 'Multiplicaste el coeficiente por los kilos. El rozamiento es el coeficiente por la normal, que es una fuerza en newtons: aquí, el peso.' },
              { id: 'doble', valor: 2 * Fv, error: 'RZ-DOBLE', siFuera: 'Duplicaste el rozamiento, como si hiciera falta fuerza extra para avanzar. A velocidad constante no hay aceleración: tu fuerza solo iguala al rozamiento.' },
              { id: 'mitad', valor: Fv / 2, error: 'RZ-MITAD', siFuera: 'Pusiste la mitad del rozamiento. A velocidad constante las fuerzas suman cero, así que tu fuerza iguala todo el rozamiento; con menos, el costal se frenaría.' },
            ], N_),
            solucion: { texto: 'A velocidad constante, las fuerzas de lado suman cero: tu fuerza iguala al rozamiento cinético, su coeficiente por el peso, que aquí es la normal.', ecuacion: [F, ` = ${f(muk)} · ${Pv} = `, pj(N_(Fv))] },
          };
        }
        if (k === 2) {
          // Solo 37°: con μ_s de 0,8 o 0,9 el tope (0,64 P o 0,72 P) alcanza para P · sen 37° = 0,6 P. A 53° haría falta
          // μ_s de 1,33 o más: la caja «quieta» era imposible (auditoría A2).
          const m = r.de([5, 8, 10, 15, 20]), Pv = m * G, ang = 37, pideN = sm % 8 >= 4, mus = r.de([0.8, 0.9]);
          const v = pideN ? Pv * COS_(ang) : Pv * SEN_(ang);
          return {
            pregunta: [`Una caja de ${m} kg está quieta en una rampa de ${ang}°; entre ellas, μ_s = ${f(mus)}. ¿Con cuánta fuerza ${pideN ? 'la empuja la rampa' : 'la sostiene el rozamiento'}?`],
            datos: [D.peso, D3.rampa, D3.est, D3.trig, D3.eqRampa],
            dibujo: est(figRampa({ ang, P: Pv, N: pideN ? Pv * COS_(ang) : undefined, f: pideN ? undefined : Pv * SEN_(ang), tN: 'N = ?', tf: 'f = ?', texto: `${m} kg`, k: 50 / Pv })),
            opciones: opciones(v, [
              { id: 'swap', valor: pideN ? Pv * SEN_(ang) : Pv * COS_(ang), error: 'ST-SENCOS', siFuera: pideN ? 'Partiste bien el peso, pero cambiaste las partes. Contra la rampa va P · cos θ, la que aprieta; P · sen θ va a lo largo y es la que la haría bajar.' : 'Partiste bien el peso, pero cambiaste las partes. A lo largo de la rampa va P · sen θ, la que la haría bajar; P · cos θ va contra la rampa y la aprieta.' },
              { id: 'peso', valor: Pv, error: 'N-MG', siFuera: 'Ese es el peso entero. En la rampa se parte en dos, una parte a lo largo y otra contra ella, y cada fuerza equilibra solo una de esas partes.' },
              { id: 'tope', valor: mus * Pv * COS_(ang), error: 'E10', siFuera: pideN ? 'Ese es el tope del rozamiento, el coeficiente por la normal. Pero no piden el rozamiento: lo que empuja la rampa es la normal, que no lleva el coeficiente e iguala la parte del peso que aprieta, P · cos θ.' : 'Ese es el tope del estático. Pero la caja está quieta sin estar a punto de resbalar: el rozamiento frena solo lo justo, que es menos que el tope.' },
              { id: 'masa', valor: pideN ? m * COS_(ang) : m * SEN_(ang), error: 'N-MASA', siFuera: 'Usaste bien el ángulo, pero con los kilos. Lo que se parte es el peso, en newtons: primero multiplica la masa por g.' },
            ], N_),
            solucion: { texto: pideN ? 'La caja no se hunde ni se separa de la rampa: la normal iguala la parte del peso que la aprieta, P · cos θ.' : 'La caja está quieta: a lo largo de la rampa, el rozamiento iguala la parte del peso que la haría bajar, P · sen θ.', ecuacion: pideN ? [N, ` = ${Pv} · cos ${ang}° = `, pn(N_(v))] : [fs, ` = ${Pv} · sen ${ang}° = `, pr(N_(v))] },
          };
        }
        // Nivel examen: la fuerza inclinada (San Marcos 2025-I y 2026-II): la normal ya no es el peso.
        const m = r.de([20, 25, 30, 40, 50]), Pv = m * G, Fv = r.de([50, 100, 150]), ang = r.de([37, 53]), pideMu = sm % 8 >= 4;
        const Nv = Pv - Fv * SEN_(ang), fkv = Fv * COS_(ang), mu = fkv / Nv;
        // μ con dos decimales exactos, y que F ÷ P (el error de no partir la fuerza) no dé lo mismo
        if (pideMu && (Math.abs(Math.round(mu * 100) - mu * 100) > 1e-9 || Math.abs(Fv / Pv - mu) < 1e-9)) return generarExamen3(m, Pv, Fv, ang, Nv);
        if (!pideMu) return generarExamen3(m, Pv, Fv, ang, Nv);
        return {
          pregunta: [`Arrastras una caja de ${m} kg a velocidad constante con una fuerza de `, pj(N_(Fv)), ` que forma ${ang}° sobre la horizontal. ¿Cuánto vale μ_k?`],
          datos: [D.peso, D3.cin, D3.comp, D3.trig, D3.eq],
          opciones: opciones(mu, [
            { id: 'peso', valor: fkv / Pv, error: 'N-MG', siFuera: 'Usaste bien la parte horizontal, pero dividiste entre el peso. La normal no es el peso: tu fuerza levanta un poco la caja, y la normal baja en F · sen θ.' },
            { id: 'swap', valor: Fv * SEN_(ang) / (Pv - Fv * COS_(ang)), error: 'ST-SENCOS', siFuera: 'Cambiaste las partes de tu fuerza. Con el ángulo medido sobre la horizontal, de lado va F · cos θ y hacia arriba, F · sen θ.' },
            { id: 'sinang', valor: Fv / Pv, error: 'RZ-SIN-ANG', siFuera: 'Comparaste tu fuerza entera con el peso. Tu fuerza está inclinada y primero se parte: su parte de lado iguala al rozamiento, y su parte de arriba cambia la normal.' },
            { id: 'suma', valor: fkv / (Pv + Fv * SEN_(ang)), error: 'N-SIGNO', siFuera: 'Partiste bien la fuerza, pero sumaste su parte vertical a la normal. Tu fuerza jala hacia arriba y ayuda a sostener la caja, así que la normal baja, no sube.' },
          ], x => f(x, 2)),
          solucion: { texto: `Tu fuerza levanta un poco la caja, así que la normal es ${Pv} − ${f(Fv * SEN_(ang))} = ${f(Nv)} N. El rozamiento iguala tu parte de lado, ${f(fkv)} N, y el coeficiente es el rozamiento entre la normal.`, ecuacion: [sub('μ', 'k'), ' = ', { frac: [pr(f(fkv)), pn(f(Nv))] }, ` = ${f(mu, 2)}`] },
        };
      },
    },
  };
  // «Ahora tú» de examen de la idea 3 cuando se pide la normal.
  function generarExamen3(m, Pv, Fv, ang, Nv) {
    return {
      pregunta: [`Arrastras una caja de ${m} kg a velocidad constante con una fuerza de `, pj(N_(Fv)), ` que forma ${ang}° sobre la horizontal. ¿Con cuánta fuerza la empuja el piso?`],
      datos: [D.peso, D3.comp, D3.trig, D3.eq],
      opciones: opciones(Nv, [
        { id: 'peso', valor: Pv, error: 'N-MG', siFuera: 'Ese es el peso. La normal sostiene la caja, pero no sola: tu fuerza va inclinada hacia arriba y sostiene un poco, así que la normal es menor que el peso.' },
        { id: 'suma', valor: Pv + Fv * SEN_(ang), error: 'N-SIGNO', siFuera: 'Calculaste bien la parte vertical de tu fuerza, pero la sumaste. Tu fuerza jala hacia arriba, así que le quita carga al piso: se resta.' },
        { id: 'cos', valor: Pv - Fv * COS_(ang), error: 'ST-SENCOS', siFuera: 'Restar estaba bien, pero restaste la parte de lado. Con θ medido desde la horizontal, lo que sube es F · sen θ; F · cos θ va de lado y no cambia la normal.' },
        { id: 'parte', valor: Fv * SEN_(ang), error: 'N-F', siFuera: 'Esa es solo la parte vertical de tu fuerza. La normal no es eso: es lo que el piso pone para sostener el resto del peso.' },
      ], N_),
      solucion: { texto: `Tu fuerza sube con ${f(Fv)} · sen ${ang}° = ${f(Fv * SEN_(ang))} N y sostiene esa parte del peso. El piso sostiene el resto: la normal es el peso menos esa parte.`, ecuacion: [N, ` = ${Pv} − ${f(Fv * SEN_(ang))} = `, pn(N_(Nv))] },
    };
  }

  // «μ_s» y «μ_k» escritos en un texto pasan a ser fichas con subíndice de verdad (molde §5), en todo lo que lee el alumno.
  function mu(x) {
    if (typeof x === 'string') { const p = x.split(/(μ_s|μ_k)/).filter(Boolean); return p.length === 1 ? x : p.map(y => (y === 'μ_s' ? sub('μ', 's') : y === 'μ_k' ? sub('μ', 'k') : y)); }
    if (Array.isArray(x)) return x.flatMap(y => { const z = mu(y); return Array.isArray(z) && typeof y === 'string' ? z : [z]; });
    return x;
  }
  const muPasos = l => l.map(p => Object.assign({}, p, { texto: mu(p.texto) }));
  function conMu(idea) {
    idea.ejemplos = idea.ejemplos.map(e => Object.assign({}, e, { enunciado: mu(e.enunciado), datos: e.datos.map(mu), solucion: muPasos(e.solucion), respuesta: mu(e.respuesta) }));
    idea.lee.tarjetas = idea.lee.tarjetas.map(t => Object.assign({}, t, { texto: mu(t.texto) }));
    // La regla no: la app escribe su texto y su condición como texto plano (un arreglo salía «[object Object]»).
    idea.mira = Object.assign({}, idea.mira, { pasos: muPasos(idea.mira.pasos) });
    const gR = idea.resuelve.generar, gA = idea.ahoraTu.generar;
    idea.resuelve.generar = sm => { const c = gR(sm); return Object.assign(c, { enunciado: mu(c.enunciado), datos: c.datos.map(mu), pasos: muPasos(c.pasos) }); };
    idea.ahoraTu.generar = sm => { const c = gA(sm); return Object.assign(c, { pregunta: mu(c.pregunta), datos: c.datos.map(mu), solucion: Object.assign({}, c.solucion, { texto: mu(c.solucion.texto) }) }); };
    return idea;
  }
  conMu(roce);

  // ======================= 4: fuerza elástica (la balanza de resorte del mercado) =======================
  // Cambia: la bolsa que se cuelga · Permanece: el resorte de 200 N/m y su largo natural · Progresa: la cota x, desde la
  // línea punteada · Se reserva: el largo total de otro resorte (Predice) · Debe verse: x crece en proporción al peso.
  // Lienzo: el resorte cuelga de la viga (y = 22); 4 px por centímetro; la línea punteada marca el largo natural; la regla
  // en centímetros, a la derecha del resorte; el DCL de la bolsa, a la derecha.
  const CM = 4;
  function figResorte(o) {
    const y0 = 22, xs = 140, L0 = o.L0, x = o.x || 0, yEnd = y0 + (L0 + x) * CM, objs = [], fl = [], txt = [...(o.textos || [])];
    objs.push({ tipo: 'viga', x0: 100, x1: 190, y: y0 }, { tipo: 'resorte', de: [xs, y0], a: [xs, yEnd], vueltas: 12, ancho: 8 });
    if (o.bolsa !== false) objs.push({ tipo: 'bolsa', x: xs, y: yEnd, w: 44, h: 34, texto: o.texto || '' });
    // La regla en centímetros solo donde se mide jugando (o.regla: true): en un ejercicio dejaba leer la respuesta
    // (auditoría M1). La punteada marca siempre el largo natural; si eso es lo que se pide, no va (o.natural: false).
    if (o.regla) objs.push({ tipo: 'regla', x: 176, y0, y1: y0 + (o.reglaCm || 40) * CM, cm: CM });
    const lineas = o.natural === false ? [] : [{ de: [116, y0 + L0 * CM], a: [176, y0 + L0 * CM] }];
    const cotas = [];
    if (x > 0 && o.tx !== false) cotas.push({ de: [xs, y0 + L0 * CM], a: [xs, yEnd], lado: 1, sep: 26, texto: o.tx || `x = ${f(x)} cm` });
    if (o.tL) cotas.push({ de: [xs, y0], a: [xs, yEnd], lado: -1, sep: 46, texto: o.tL });
    if (o.fz) {
      const d = dclCostal(o.fz, { cx: 268, cy: 120, titulo: o.titulo || 'DCL de la bolsa', k: Math.min(o.k || 2, 56 / Math.max(o.fz.P || 1, o.fz.T || 1)) });
      objs.push(...d.obj); fl.push(...d.fl); txt.push(...d.txt);
    }
    return { alto: o.alto || 236, objetos: objs, flechas: fl, lineas, cotas, textos: txt, alt: o.alt };
  }
  const K4 = 200, L04 = 20;
  const juego4 = val => {
    const Pv = val.m * G, xcm = Pv / K4 * 100;
    return est(figResorte({ L0: L04, x: xcm, regla: true, texto: `${f(val.m)} kg`, fz: { P: Pv, T: Pv, tP: 'P⃗', tT: 'F⃗_e' },
      alt: `La balanza de resorte del mercado con una bolsa de ${f(val.m)} kg: el resorte se estira ${f(xcm)} cm desde su largo natural.` }));
  };
  const PRED4 = figResorte({ L0: 12, x: 3, texto: '1 kg', tx: false, tL: '15 cm', reglaCm: 40, textos: [{ x: 312, y: 196, texto: 'sin nada: 12 cm', ancla: 'end' }, { x: 312, y: 220, texto: 'con 3 kg: ? cm', ancla: 'end' }],
    alt: 'Otro resorte, de 12 cm sin nada colgado, mide 15 cm con 1 kg. ¿Cuánto medirá con 3 kg?' });
  const REVELA4 = figResorte({ L0: 12, x: 9, texto: '3 kg', tx: 'x = 9 cm', tL: '21 cm', textos: [{ x: 312, y: 220, texto: 'sin nada: 12 cm', ancla: 'end' }],
    alt: 'Con 3 kg el resorte se estira 9 cm desde su largo natural de 12 cm: mide 21 cm.' });
  const corte4 = (kg, xx) => { const d = figResorte({ L0: 12, x: xx, regla: true, bolsa: kg > 0, texto: `${kg} kg`, tx: xx ? `x = ${xx} cm` : false, tL: `${12 + xx} cm` }); return { objetos: d.objetos, cotas: d.cotas, lineas: d.lineas, textos: d.textos }; };
  const MIRA4 = Object.assign(figResorte({ L0: 12, x: 0, regla: true, bolsa: false }), { alt: 'El resorte de 12 cm con 1, 2 y 3 kg: cada kilo lo estira 3 cm más.',
    cortes: [corte4(0, 0), corte4(1, 3), corte4(2, 6), corte4(3, 9), corte4(3, 9)] });
  const D4 = {
    hooke: [Fe, ' = k · x, con x lo que se estira o se encoge desde el largo natural'],
    largo: ['Largo del resorte: L = ', sub('L', '0'), ' + x (', sub('L', '0'), ', el largo natural)'],
    cm: '1 m = 100 cm',
    eq: 'Quieto, las fuerzas sobre el cuerpo suman cero',
  };
  const xcmDe = (Pv, k) => Pv / k * 100;

  // Ejemplos de la idea 4. Cuentas rehechas aparte (cuentas.js: estira el resorte de a 0,01 cm hasta que su fuerza
  // iguala lo que lo jala): 10/200; 20/0,04; 20/400; 600·0,03; 250·0,06; 25 + 30/200; 15 cm de largo natural; el doble
  // de x; (30 − 10)/(0,30 − 0,22); 300·0,02; la polea móvil con 37°; la rampa lisa; la balanza con el resorte; 26 cm; 10 cm.
  const EJEMPLOS_RES = [
    { nivel: 1, titulo: '¿Cuánto se estira?',
      figura: est(figResorte({ L0: 15, x: 5, tx: 'x = ?', texto: '10 N', fz: { P: 10, T: 10, tT: 'F_e', tP: 'P = 10 N' }, alt: 'Un resorte de 200 N/m sostiene una bolsa de 10 N.' })),
      enunciado: ['Un resorte de k = 200 N/m sostiene quieta una bolsa de 10 N. ¿Cuánto se estira?'],
      datos: [D4.hooke, D4.eq, D4.cm],
      solucion: [{ texto: ['La bolsa está quieta, así que el resorte la jala hacia arriba con lo que pesa, 10 N. Como ', Fe, ' = k · x, la deformación es esa fuerza entre k:'], ecuacion: ['x = ', { frac: [pj('10'), '200'] }, ' = 0,05 m = 5 cm'] }],
      respuesta: [neg('x = 5 cm')] },
    { nivel: 1, titulo: 'Qué tan duro es',
      figura: est(figResorte({ L0: 15, x: 4, tx: 'x = 4 cm', texto: '20 N', fz: { P: 20, T: 20, tT: 'F_e = 20 N', tP: 'P' }, alt: 'Un resorte que se estira 4 cm con 20 N.' })),
      enunciado: ['Un resorte se estira 4 cm cuando jala con ', pj('20 N'), '. ¿Cuánto vale su constante k?'],
      datos: [D4.hooke, D4.cm],
      solucion: [{ texto: 'k es la fuerza entre la deformación. Como k va en N/m, la deformación se pasa a metros: 4 cm son 0,04 m.', ecuacion: ['k = ', { frac: [pj('20'), '0,04'] }, ' = 500 N/m'] }],
      respuesta: [neg('k = 500 N/m')] },
    { nivel: 1, titulo: 'La bolsa de papas',
      figura: est(figResorte({ L0: 15, x: 5, tx: 'x = ?', texto: '2 kg', fz: { P: 20, T: 20, tT: 'F_e', tP: 'P' }, alt: 'Una bolsa de 2 kg cuelga de un resorte de 400 N/m.' })),
      enunciado: ['En la balanza de resorte del mercado, de k = 400 N/m, cuelgas una bolsa de papas de 2 kg. ¿Cuánto se estira el resorte?'],
      datos: [D.peso, D4.hooke, D4.eq, D4.cm],
      solucion: [
        { texto: 'La bolsa está quieta, así que el resorte la jala con lo mismo que pesa:', ecuacion: [Fe, ' = ', P, ' = 20 N'] },
        { texto: ['De ', Fe, ' = k · x se despeja x: la fuerza entre k. Sale en metros y se pasa a centímetros:'], ecuacion: ['x = ', { frac: [pj('20'), '400'] }, ' = 0,05 m = 5 cm'] },
      ],
      respuesta: [neg('x = 5 cm')] },
    { nivel: 1, titulo: 'Un resorte apretado',
      figura: est({ alto: 140, piso: { y: 120 }, paredes: [{ x: 30, y0: 40, y1: 120, lado: -1 }], objetos: [{ tipo: 'resorte', de: [30, 96], a: [150, 96], vueltas: 12 }, { tipo: 'caja', x: 180, y: 120, w: 60, h: 48 }],
        flechas: [{ de: [210, 96], ang: 0, largo: 30, color: 'o', texto: 'F_e = ?', rumbo: [0.2, -1] }], cotas: [{ de: [150, 96], a: [170, 96], lado: -1, sep: 34, texto: '3 cm' }],
        alt: 'Un resorte apretado 3 cm entre la pared y una caja.' }),
      enunciado: ['Un resorte de k = 600 N/m está apretado 3 cm entre la pared y una caja. ¿Con cuánta fuerza empuja la caja?'],
      datos: [D4.hooke, D4.cm],
      solucion: [{ texto: 'Un resorte encogido también hace fuerza: empuja para volver a su largo natural. La deformación es lo que se encogió, 3 cm, que son 0,03 m:', ecuacion: [Fe, ' = 600 · 0,03 = ', pj('18 N')] }],
      respuesta: [Fe, ' = ', pj('18 N')] },
    { nivel: 1, titulo: '¿Cuánto pesa la bolsa?',
      figura: est(figResorte({ L0: 15, x: 6, tx: 'x = 6 cm', texto: '?', fz: { P: 15, T: 15, tT: 'F_e', tP: 'P = ?' }, alt: 'Una bolsa estira 6 cm un resorte de 250 N/m.' })),
      enunciado: ['Una bolsa estira 6 cm un resorte de k = 250 N/m y queda quieta. ¿Cuánto pesa?'],
      datos: [D4.hooke, D4.eq, D4.cm],
      solucion: [{ texto: 'La bolsa está quieta, así que su peso iguala la fuerza del resorte. Con x en metros, 0,06 m:', ecuacion: [P, ' = ', Fe, ' = 250 · 0,06 = ', pp('15 N')] }],
      respuesta: [P, ' = ', pp('15 N')] },
    { nivel: 2, titulo: 'El largo final',
      figura: est(figResorte({ L0: 25, x: 15, tx: false, tL: 'L = ?', texto: '3 kg', reglaCm: 44, alto: 236, textos: [{ x: 312, y: 30, texto: 'sin nada: 25 cm', ancla: 'end' }], alt: 'Un resorte de 25 cm de largo natural, de 200 N/m, con 3 kg colgados.' })),
      enunciado: ['Un resorte de k = 200 N/m mide 25 cm sin nada colgado. ¿Cuánto mide con una bolsa de 3 kg?'],
      datos: [D.peso, D4.hooke, D4.largo, D4.cm],
      solucion: [
        { texto: ['La bolsa de 3 kg pesa 30 N, y el resorte la sostiene con ', Fe, ' = 30 N. Lo que se estira es esa fuerza entre k:'], ecuacion: ['x = ', { frac: ['30', '200'] }, ' = 0,15 m = 15 cm'] },
        { texto: 'El resorte no mide 15 cm: mide su largo natural más lo que se estiró.', ecuacion: ['L = 25 + 15 = 40 cm'] },
      ],
      respuesta: [neg('L = 40 cm')] },
    { nivel: 2, titulo: 'El largo natural',
      figura: est(figResorte({ L0: 15, x: 3, tx: false, natural: false, tL: '18 cm', texto: '1 kg', textos: [{ x: 312, y: 30, texto: 'con 3 kg: 24 cm', ancla: 'end' }, { x: 312, y: 52, texto: 'sin nada: ?', ancla: 'end' }], alt: 'Un resorte mide 18 cm con 1 kg y 24 cm con 3 kg.' })),
      enunciado: ['Un resorte mide 18 cm con 1 kg colgado y 24 cm con 3 kg. ¿Cuánto mide sin nada?'],
      datos: [D4.hooke, D4.largo],
      solucion: [
        { texto: 'De 1 kg a 3 kg hay 2 kg más, y el largo creció 6 cm. Como la deformación va en proporción al peso, cada kilo lo estira 3 cm.' },
        { texto: 'Con 1 kg ya estaba estirado 3 cm, así que sin nada mide 3 cm menos:', ecuacion: [sub('L', '0'), ' = 18 − 3 = 15 cm'] },
      ],
      respuesta: [neg('15 cm')] },
    { nivel: 2, titulo: 'Más del doble de peso',
      figura: est(figResorte({ L0: 15, x: 4, tx: '4 cm', texto: '2 kg', textos: [{ x: 312, y: 30, texto: 'con 5 kg: x = ?', ancla: 'end' }], alt: 'Un resorte que se estira 4 cm con 2 kg.' })),
      enunciado: ['Con 2 kg colgados, un resorte se estira 4 cm. ¿Cuánto se estira con 5 kg?'],
      datos: [D4.hooke],
      solucion: [
        { texto: 'La deformación va en proporción a la fuerza: si 2 kg lo estiran 4 cm, cada kilo lo estira 2 cm.' },
        { texto: 'Con 5 kg, se estira cinco veces lo que estira un kilo:', ecuacion: ['x = 5 · 2 = 10 cm'] },
      ],
      respuesta: [neg('x = 10 cm')] },
    { nivel: 2, titulo: 'La constante con dos medidas',
      figura: est(figResorte({ L0: 17, x: 5, tx: false, tL: '22 cm', texto: '10 N', textos: [{ x: 312, y: 30, texto: 'con 30 N: 30 cm', ancla: 'end' }], alt: 'Un resorte mide 22 cm con 10 N y 30 cm con 30 N.' })),
      enunciado: ['Un resorte mide 22 cm cuando jala con ', pj('10 N'), ' y 30 cm cuando jala con ', pj('30 N'), '. ¿Cuánto vale k?'],
      datos: [D4.hooke, D4.cm],
      solucion: [
        { texto: 'No se conoce el largo natural, pero no hace falta: 20 N más lo estiran 8 cm más, y en un resorte el cambio de fuerza es k por el cambio de largo.' },
        { texto: 'Con el cambio de largo en metros, 0,08 m:', ecuacion: ['k = ', { frac: [pj('20'), '0,08'] }, ' = 250 N/m'] },
      ],
      respuesta: [neg('k = 250 N/m')] },
    { nivel: 2, titulo: 'El resorte y la caja quieta',
      figura: est({ alto: 150, piso: { y: 130 }, paredes: [{ x: 24, y0: 50, y1: 130, lado: -1 }], objetos: [{ tipo: 'resorte', de: [24, 106], a: [150, 106], vueltas: 12 }, { tipo: 'caja', x: 180, y: 130, w: 60, h: 48, texto: '' }],
        flechas: [{ de: [150, 90], ang: 180, largo: 34, color: 'o', texto: 'F_e', rumbo: [0, -1] }, { de: [210, 118], ang: 0, largo: 34, color: 'i', texto: 'f = ?', rumbo: [0.2, -1] }],
        textos: [{ x: 8, y: 22, texto: 'estirado 2 cm; k = 300 N/m', ancla: 'start' }], alt: 'Un resorte estirado 2 cm jala una caja que sigue quieta en el piso.' }),
      enunciado: ['Un resorte de k = 300 N/m, estirado 2 cm, jala una caja que sigue quieta en el piso. ¿Con cuánta fuerza la frena el piso?'],
      datos: [D4.hooke, D3.est, D4.cm],
      solucion: [
        { texto: 'Primero, la fuerza del resorte, con la deformación en metros:', ecuacion: [Fe, ' = 300 · 0,02 = ', pj('6 N')] },
        { texto: 'La caja sigue quieta, así que las fuerzas de lado suman cero: el rozamiento estático iguala el jalón del resorte.', ecuacion: [fs, ' = ', pr('6 N')] },
      ],
      respuesta: [fs, ' = ', pr('6 N')] },
    { nivel: 3, titulo: 'El resorte de la polea móvil',
      figura: est({ alto: 230, techo: { y: 16, x0: 40, x1: 280 }, objetos: [{ tipo: 'cuerda', de: [144, 120], a: [66, 16] }, { tipo: 'cuerda', de: [176, 120], a: [214, 70] }, { tipo: 'resorte', de: [214, 70], a: [254.5, 16], vueltas: 8, ancho: 6 },
        { tipo: 'polea', c: [160, 124], r: 16 }, { tipo: 'cuerda', de: [160, 124], a: [160, 156] }, { tipo: 'caja', x: 160, y: 190, w: 56, h: 34, texto: '160 N' }],
        angulos: [{ c: [176, 120], de: 53, a: 90, r: 26, texto: '37°' }], textos: [{ x: 312, y: 110, texto: 'k = 2000 N/m', ancla: 'end' }, { x: 312, y: 132, texto: 'x = ?', ancla: 'end' }],
        alt: 'Una carga de 160 N cuelga de una polea móvil; un tramo de cuerda va al techo y el otro a un resorte; los dos forman 37° con la vertical.' }),
      enunciado: ['Una carga de 160 N cuelga de una polea móvil liviana. Un tramo va al techo y el otro a un resorte de 2000 N/m; los dos forman 37° con la vertical. ¿Cuánto se estira el resorte?'],
      alternativas: ['8 cm', '4 cm', '6,67 cm', '10 cm', '5 cm'],
      datos: [D4.hooke, D2.polea, D2.comp, D2.trig, D4.cm],
      solucion: [
        { texto: 'La cuerda es una sola, así que los dos tramos jalan con la misma T. El ángulo es con la vertical: sus partes verticales, T · cos 37°, sostienen la carga.', ecuacion: ['2', T, ' · cos 37° = 160   →   ', T, ' = ', pj('100 N')] },
        { texto: 'El resorte está en uno de los tramos, así que jala con esa T y se estira T entre k:', ecuacion: ['x = ', { frac: [pj('100'), '2000'] }, ' = 0,05 m = 5 cm'] },
        { texto: ['La ', neg('A'), ' pone toda la carga en el resorte. La ', neg('B'), ' olvida el ángulo y reparte 160 N entre dos. La ', neg('C'), ' usa el seno en vez del coseno, y la ', neg('D'), ' suma los dos tramos en el resorte.'] },
      ],
      respuesta: [neg('E'), ', 5 cm'] },
    { nivel: 3, titulo: 'El resorte en la rampa',
      figura: est((() => { const d = figRampa({ ang: 37, P: 50, texto: '5 kg', k: 1 }); d.objetos.push({ tipo: 'resorte', de: [20 + 150 * 0.8 + 0.8 * 25 - 0.6 * 17, 214 - 150 * 0.6 - 0.6 * 25 - 0.8 * 17], a: [20 + 260 * 0.8 - 0.6 * 17, 214 - 260 * 0.6 - 0.8 * 17], vueltas: 8, ancho: 6 });
        d.textos = [{ x: 8, y: 22, texto: 'rampa lisa; k = 500 N/m; x = ?', ancla: 'start' }]; d.alt = 'Una caja de 5 kg quieta en una rampa lisa de 37°, sostenida por un resorte paralelo a la rampa.'; return d; })()),
      enunciado: ['Una caja de 5 kg está quieta en una rampa lisa de 37°, sostenida por un resorte de 500 N/m paralelo a la rampa. ¿Cuánto se estira el resorte?'],
      alternativas: ['10 cm', '6 cm', '0,06 cm', '8 cm', '12 cm'],
      datos: [D.peso, D4.hooke, D3.rampa, D3.trig, D4.cm],
      solucion: [
        { texto: 'La rampa es lisa, así que no hay rozamiento: a lo largo de la rampa, solo el resorte iguala la parte del peso que haría bajar la caja.', ecuacion: [Fe, ' = 50 · sen 37° = ', pj('30 N')] },
        { texto: ['De ', Fe, ' = k · x se despeja x, y se pasa a centímetros:'], ecuacion: ['x = ', { frac: [pj('30'), '500'] }, ' = 0,06 m = 6 cm'] },
        { texto: ['La ', neg('A'), ' usa todo el peso, como si la rampa fuera vertical. La ', neg('D'), ' usa el coseno, la parte que aprieta contra la rampa. La ', neg('C'), ' deja los metros como centímetros, y la ', neg('E'), ' toma el doble.'] },
      ],
      respuesta: [neg('B'), ', 6 cm'] },
    { nivel: 3, titulo: 'Caja, resorte y balanza',
      figura: est({ alto: 236, piso: { y: 226 }, objetos: [{ tipo: 'viga', x0: 100, x1: 200, y: 22 }, { tipo: 'resorte', de: [150, 22], a: [150, 152], vueltas: 12 }, { tipo: 'balanza', x: 150, y: 226, w: 110, lectura: '? N' }, { tipo: 'caja', x: 150, y: 200, w: 60, h: 48, texto: '6 kg' }],
        textos: [{ x: 312, y: 60, texto: 'k = 500 N/m', ancla: 'end' }, { x: 312, y: 82, texto: 'estirado 4 cm', ancla: 'end' }], alt: 'Una caja de 6 kg sobre la balanza, jalada hacia arriba por un resorte estirado 4 cm.' }),
      enunciado: ['Una caja de 6 kg está sobre la balanza. Un resorte de 500 N/m, estirado 4 cm, la jala hacia arriba. ¿Cuánto marca la balanza?'],
      alternativas: ['60 N', '80 N', '40 N', '20 N', '58 N'],
      datos: [D.peso, D4.hooke, D.primera, D.balanza, D4.cm],
      solucion: [
        { texto: 'El resorte está estirado, así que jala la caja hacia arriba con:', ecuacion: [Fe, ' = 500 · 0,04 = ', pj('20 N')] },
        { texto: 'La caja está quieta: el resorte sostiene 20 N de su peso, y la balanza empuja hacia arriba el resto, que es lo que marca.', ecuacion: [N, ' = 60 − 20 = ', pn('40 N')] },
        { texto: ['La ', neg('A'), ' marca el peso, como si el resorte no jalara. La ', neg('B'), ' suma el resorte, como si empujara hacia abajo. La ', neg('D'), ' da solo el resorte, y la ', neg('E'), ' usa 0,004 m: el resorte daría 2 N.'] },
      ],
      respuesta: [neg('C'), ', ', pn('40 N')] },
    { nivel: 3, titulo: 'El largo sin nada',
      figura: est(figResorte({ L0: 26, x: 4, tx: false, natural: false, tL: '30 cm', texto: '2 kg', reglaCm: 44, textos: [{ x: 312, y: 30, texto: 'con 6 kg: 38 cm', ancla: 'end' }, { x: 312, y: 52, texto: 'sin nada: ?', ancla: 'end' }], alt: 'Un resorte mide 30 cm con 2 kg y 38 cm con 6 kg.' })),
      enunciado: ['Un resorte mide 30 cm con 2 kg colgados y 38 cm con 6 kg. ¿Cuánto mide sin nada colgado?'],
      alternativas: ['22 cm', '30 cm', '15 cm', '26 cm', '28 cm'],
      datos: [D4.hooke, D4.largo],
      solucion: [
        { texto: 'De 2 kg a 6 kg hay 4 kg más, y el largo creció 8 cm: cada kilo lo estira 2 cm.' },
        { texto: 'Con 2 kg estaba estirado 4 cm, así que sin nada mide 4 cm menos:', ecuacion: [sub('L', '0'), ' = 30 − 4 = 26 cm'] },
        { texto: ['La ', neg('A'), ' resta 8 cm, lo que estiran 4 kg y no 2. La ', neg('B'), ' da el largo con 2 kg. La ', neg('C'), ' divide 30 entre 2, como si el largo entero fuera proporcional, y la ', neg('E'), ' resta solo 2 cm.'] },
      ],
      respuesta: [neg('D'), ', 26 cm'] },
    { nivel: 3, titulo: 'La caja sobre el resorte',
      figura: est({ alto: 200, piso: { y: 186 }, objetos: [{ tipo: 'resorte', de: [150, 186], a: [150, 146], vueltas: 8, ancho: 10 }, { tipo: 'caja', x: 150, y: 146, w: 60, h: 40, texto: '3 kg' }],
        lineas: [{ de: [110, 138], a: [196, 138] }], textos: [{ x: 312, y: 40, texto: 'k = 1500 N/m', ancla: 'end' }, { x: 312, y: 62, texto: 'sin nada: 12 cm', ancla: 'end' }, { x: 312, y: 84, texto: 'con la caja: ?', ancla: 'end' }],
        alt: 'Una caja de 3 kg apoyada sobre un resorte vertical que se encoge.' }),
      enunciado: ['Un resorte vertical de 1500 N/m mide 12 cm sin nada encima. ¿Cuánto mide con una caja de 3 kg apoyada encima?'],
      alternativas: ['10 cm', '2 cm', '12 cm', '8 cm', '14 cm'],
      datos: [D.peso, D4.hooke, D4.largo, D4.cm],
      solucion: [
        { texto: 'La caja está quieta, y el resorte la sostiene encogiéndose. Lo que se encoge es el peso, 30 N, entre k:', ecuacion: ['x = ', { frac: [pp('30'), '1500'] }, ' = 0,02 m = 2 cm'] },
        { texto: 'Como se encoge, su largo es el natural menos lo que se encogió:', ecuacion: ['L = 12 − 2 = 10 cm'] },
        { texto: ['La ', neg('E'), ' suma, como si se estirara. La ', neg('B'), ' da solo lo que se encoge, no el largo. La ', neg('C'), ' cree que el largo no cambia, y la ', neg('D'), ' resta dos veces.'] },
      ],
      respuesta: [neg('A'), ', 10 cm'] },
  ];

  const BOLSAS = ['una bolsa de papas', 'un racimo de plátanos', 'una bolsa de habas'];
  const elastica = {
    id: 'resorte-proporcional',
    titulo: 'Fuerza elástica: la ley de Hooke',
    pregunta: '¿Cuánto mide un resorte cuando le cuelgas más peso?',
    temas: ['Fuerza elástica', 'Máquinas simples'],
    pieza: 'fis-estatica',
    aprendizaje: 'Un resorte hace una fuerza proporcional a lo que se deforma desde su largo natural. Esa deformación, x, no es su largo total.',
    actividad: 'Colgar bolsas en la balanza de resorte del mercado.',
    lee: {
      tarjetas: [
        { titulo: 'Resortes de todos los días', texto: 'Hay resortes en el colchón, en el lapicero que haces clic y en la balanza de resorte del mercado, donde se cuelga una bolsa para pesarla. Todos hacen lo mismo: cuando los estiras o los aprietas, jalan o empujan para volver a su forma.',
          dibujo: est(figResorte({ L0: 20, x: 5, tx: false, texto: '1 kg', alt: 'La balanza de resorte del mercado con una bolsa colgada.' })) },
        { titulo: 'Largo natural', texto: ['Sin nada colgado, el resorte tiene su largo natural, ', sub('L', '0'), '. Lo que se estira o se encoge desde ese largo se llama deformación, x. Deformado, el resorte hace una fuerza elástica, ', Fe, ', que busca devolverlo a su largo natural.'] },
        { titulo: 'Duro o blando', texto: 'La constante elástica k dice qué tan duro es un resorte: cuántos newtons hacen falta para deformarlo un metro, por eso va en N/m. Un resorte duro tiene una k grande. Al jugar, cuelga bolsas distintas y anota cuánto se estira con cada una.' },
      ],
    },
    ejemplos: EJEMPLOS_RES,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'La balanza de resorte del mercado tiene k = 200 N/m; la punteada marca su largo natural. Cada kilo pesa 10 N.',
      mision: {
        texto: 'Cuelga una bolsa que estire el resorte justo 10 cm.',
        logrado: val => Math.abs(val.m * G / K4 * 100 - 10) < 1e-9,
        bien: 'Coincide: 20 N estiran 10 cm, así que este resorte pide 2 N por cada centímetro.',
      },
      voz: 'Cambia la bolsa. ¿Cómo crece x?',
      leyenda: [
        { s: [vec(Fe)], t: 'lo que jala el resorte a la bolsa' },
        { s: [vec(P)], t: 'el peso de la bolsa' },
        { s: 'x', t: 'lo que se estira desde la línea punteada' },
        { s: 'k', t: 'qué tan duro es el resorte' },
      ],
      controles: [{ id: 'm', etiqueta: 'Bolsa, m', min: 0.5, max: 3, paso: 0.5, inicio: 1.5, unidad: 'kg', decimales: 1 }],
      dibujo: juego4,
      lectura: val => ['La bolsa pesa ', pp(N_(val.m * G)), ' y el resorte se estira ', `${f(xcmDe(val.m * G, K4))} cm`],
      resumen: { m: 1 },
      minimo: 3,
    },
    predice: {
      pregunta: 'Otro resorte mide 12 cm sin nada colgado. Con 1 kg colgado, mide 15 cm. ¿Cuánto mide con 3 kg?',
      datos: ['Sin nada colgado: 12 cm.', 'Con 1 kg colgado: 15 cm.'],
      opciones: [
        { id: 'c', texto: '21 cm', correcta: true },
        { id: 'largo', texto: '45 cm', error: 'RS-LARGO', siFuera: 'El triple de peso sí da el triple de algo, pero de lo que se estira, no del largo entero. Los 12 cm del largo natural ya estaban sin nada colgado y no se triplican.' },
        { id: 'solo', texto: '9 cm', error: 'RS-SOLO-X', siFuera: 'Es cierto que se estira 9 cm. Pero piden cuánto mide el resorte, y su largo es el natural, 12 cm, más lo que se estiró.' },
        { id: 'paso', texto: '18 cm', error: 'RS-PASO', siFuera: 'Cada kilo sí lo estira 3 cm, pero sumaste un solo paso. De 1 kg a 3 kg hay 2 kilos más, así que el resorte crece 6 cm desde los 15 cm.' },
      ],
      dibujo: est(PRED4),
      revelar: est(REVELA4),
      coincide: 'Coincide: cada kilo lo estira 3 cm; con 3 kg se estira 9 cm y mide 12 + 9 = 21 cm.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: MIRA4,
      pasos: [
        { estado: { corte: 0 }, texto: 'Sin nada colgado, el resorte tiene su largo natural, 12 cm, marcado con la línea punteada.' },
        { estado: { corte: 1 }, texto: 'Con 1 kg mide 15 cm, así que se estiró 3 cm desde la punteada: esa es su deformación.', ecuacion: ['x = 15 − 12 = 3 cm'] },
        { estado: { corte: 2 }, texto: 'Con 2 kg, el doble de fuerza, se estira el doble, 6 cm, y mide 18 cm.', ecuacion: ['x = 6 cm   →   L = 18 cm'] },
        { estado: { corte: 3 }, texto: 'Con 3 kg se estira el triple, 9 cm. Lo que se triplica es la deformación, no el largo: mide 21 cm, no 45 cm.', ecuacion: ['L = 12 + 9 = 21 cm'] },
        { estado: { corte: 4 }, texto: 'La fuerza entre la deformación da siempre lo mismo para este resorte: ese número es su constante k.', ecuacion: ['k = ', { frac: [pj('10 N'), '0,03 m'] }, ' ≈ 333 N/m'] },
      ],
    },
    regla: {
      texto: 'Un resorte estirado o encogido hace una fuerza proporcional a su deformación x, que es lo que cambió su largo desde el largo natural: con el doble de deformación, el doble de fuerza. La constante k dice cuántos newtons hace por cada metro de deformación.',
      ecuacion: [Fe, ' = k · x'],
      condicion: 'el resorte no pasa de su límite; si lo estiras demasiado, queda deformado y ya no vuelve a su largo. Ojo: x no es el largo, que vale L₀ + x al estirar y L₀ − x al encoger.',
      dibujo: est(REVELA4),
    },
    // Así se resuelve: la constante con una medida (semillas pares) y el largo total de un resorte que se encoge bajo una
    // caja (impares); «Ahora tú» pide x, k con otra pregunta, el largo estirado y el examen.
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 1) {
          const L0 = r.de([10, 12, 15]), m = r.de([2, 3, 4]), k = r.de([1000, 2000]), xcm = xcmDe(m * G, k);
          return {
            enunciado: [`Un resorte vertical de k = ${k} N/m mide ${L0} cm sin nada encima. ¿Cuánto mide con una caja de ${m} kg apoyada encima?`],
            datos: [D.peso, D4.hooke, D4.largo, D4.cm],
            pasos: [
              { tipo: 'pide', texto: 'Piden el largo del resorte con la caja encima: no lo que se encoge, sino cuánto mide.' },
              { tipo: 'datos', texto: ['La caja pesa ', pp(N_(m * G)), `, y el largo natural es ${L0} cm.`] },
              { tipo: 'regla', texto: 'La caja está quieta, así que el resorte la sostiene encogiéndose x, hasta que su fuerza iguala el peso.', ecuacion: [Fe, ' = k · x'] },
              { tipo: 'cuentas', texto: 'Se despeja x, la fuerza entre k, y se pasa a centímetros. Como el resorte se encoge, x se resta al largo natural.', ecuacion: [`x = ${m * G} ÷ ${k} = ${f(xcm / 100, 4)} m = ${f(xcm)} cm   →   L = ${L0} − ${f(xcm)} = ${f(L0 - xcm)} cm`] },
              { tipo: 'sentido', texto: 'Se encoge poco porque es un resorte duro, de mucha k: cada centímetro de deformación le cuesta muchos newtons.' },
            ],
            respuesta: [neg(`L = ${f(L0 - xcm)} cm`)],
          };
        }
        const xcm = r.de([2, 4, 5, 8]), Fv = r.de([10, 20, 40]), k = Fv / (xcm / 100);
        return {
          enunciado: ['Un resorte se estira ', `${xcm} cm cuando jala con `, pj(N_(Fv)), '. ¿Cuánto vale su constante k?'],
          datos: [D4.hooke, D4.cm],
          dibujo: est(figResorte({ L0: 15, x: Math.min(xcm, 8), tx: `x = ${xcm} cm`, texto: N_(Fv), fz: { P: Fv, T: Fv, tT: `F_e = ${N_(Fv)}`, tP: 'P' } })),
          pasos: [
            { tipo: 'pide', texto: 'Piden la constante k: qué tan duro es el resorte.' },
            { tipo: 'datos', texto: ['Jala con ', pj(N_(Fv)), ` estirado ${xcm} cm, que son ${f(xcm / 100)} m.`] },
            { tipo: 'regla', texto: 'La fuerza del resorte es k por la deformación, así que k es la fuerza entre la deformación.', ecuacion: [Fe, ' = k · x'] },
            { tipo: 'cuentas', texto: 'Se despeja k, con x en metros, porque k va en newtons por metro.', ecuacion: ['k = ', { frac: [pj(f(Fv)), f(xcm / 100)] }, ` = ${f(k)} N/m`] },
            { tipo: 'sentido', texto: `Comprobación: ${f(k)} · ${f(xcm / 100)} = ${f(Fv)} N.` },
          ],
          respuesta: [neg(`k = ${f(k)} N/m`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4;
        if (k === 0) {
          // sin k ÷ P = x (el error RS-INV acertaba: 400 N/m con 4 kg) ni la misión del juego (200 N/m con 2 kg: 10 cm)
          const { bolsa, m, kk } = elegir(r, () => { const c = { bolsa: r.de(BOLSAS), m: r.de([1, 1.5, 2, 3, 4]), kk: r.de([200, 250, 400, 500]) }; const x = xcmDe(c.m * G, c.kk);
            return Math.abs(c.kk / (c.m * G) - x) > 1e-9 && !(c.kk === 200 && c.m === 2) && c; }), Pv = m * G, xcm = xcmDe(Pv, kk);
          return {
            pregunta: [`En la balanza de resorte del mercado, de k = ${kk} N/m, cuelgas ${bolsa} de ${f(m)} kg. ¿Cuánto se estira el resorte?`],
            datos: [D.peso, D4.hooke, D4.eq, D4.cm],
            dibujo: est(figResorte({ L0: 15, x: Math.min(xcm, 15), tx: 'x = ?', texto: `${f(m)} kg`, fz: { P: Pv, T: Pv, tT: 'F_e', tP: `P = ${N_(Pv)}` } })),
            opciones: opciones(xcm, [
              { id: 'm', valor: Pv / kk, error: 'U-cm', siFuera: 'La división está bien, pero el resultado está en metros, porque k va en N/m. Piden centímetros: multiplica por 100.' },
              { id: 'inv', valor: kk / Pv, error: 'RS-INV', siFuera: 'Usaste k y el peso, pero al revés. Por la ley de Hooke, x es la fuerza entre k: un resorte más duro se estira menos, no más.' },
              { id: 'masa', valor: m / kk * 100, error: 'N-MASA', siFuera: 'La cuenta salió en centímetros, pero usaste los kilos. El resorte sostiene el peso, en newtons, así que primero pasa la masa a peso.' },
              { id: 'doble', valor: 2 * xcm, error: 'RS-DOBLE', siFuera: 'La proporción está bien, pero ese sería el estiramiento con el doble de peso. Divide solo el peso de esta bolsa entre k.' },
            ], v => `${f(v)} cm`),
            solucion: { texto: ['El resorte sostiene la bolsa con una fuerza igual a su peso. De ', Fe, ' = k · x, la deformación es esa fuerza entre k, pasada a centímetros.'], ecuacion: [`x = ${Pv} ÷ ${kk} = ${f(Pv / kk, 4)} m = `, `${f(xcm)} cm`] },
          };
        }
        if (k === 1) {
          const m = r.de([0.5, 1, 2, 3]), xcm = r.de([2, 4, 5, 8, 10]), Pv = m * G, kk = Pv / (xcm / 100);
          return {
            pregunta: [`Una pesa de ${f(m)} kg cuelga quieta de un resorte y lo estira ${xcm} cm. ¿Cuánto vale k?`],
            datos: [D.peso, D4.hooke, D4.eq, D4.cm],
            opciones: opciones(kk, [
              { id: 'cm', valor: Pv / xcm, error: 'U-cm', siFuera: 'La división está bien, pero con x en centímetros. Como k va en N/m, x tiene que ir en metros, y con eso el resultado sale cien veces mayor.' },
              { id: 'por', valor: Pv * xcm / 100, error: 'RS-POR', siFuera: 'Usaste la fuerza y la deformación, pero multiplicaste. k es la fuerza entre la deformación: cuántos newtons por cada metro.' },
              { id: 'masa', valor: m / (xcm / 100), error: 'N-MASA', siFuera: 'Pasaste bien x a metros, pero usaste los kilos. El resorte sostiene el peso de la pesa, que va en newtons.' },
              { id: 'inv', valor: (xcm / 100) / Pv, error: 'RS-INV', siFuera: 'Dividiste al revés, la deformación entre la fuerza. k es la fuerza entre la deformación, y por eso se mide en newtons por metro.' },
            ], v => `${f(v)} N/m`),
            solucion: { texto: 'La pesa está quieta, así que el resorte la jala con su peso. k es esa fuerza entre la deformación, con x en metros.', ecuacion: [`k = ${Pv} ÷ ${f(xcm / 100)} = ${f(kk)} N/m`] },
          };
        }
        if (k === 2) {
          const L0 = r.de([10, 15, 20, 25]), m = r.de([1, 2, 3]), kk = r.de([200, 400, 500]), xcm = xcmDe(m * G, kk), L = L0 + xcm;
          return {
            pregunta: [`Un resorte de k = ${kk} N/m mide ${L0} cm sin nada colgado. ¿Cuánto mide con ${m} kg ${m === 1 ? 'colgado' : 'colgados'}?`],
            datos: [D.peso, D4.hooke, D4.largo, D4.cm],
            opciones: opciones(L, [
              { id: 'x', valor: xcm, error: 'RS-SOLO-X', siFuera: 'Eso es lo que se estira. Piden cuánto mide el resorte, y su largo es el natural más lo que se estiró.' },
              { id: 'resta', valor: L0 - xcm, error: 'RS-ENCOGE', siFuera: 'Calculaste bien x, pero lo restaste. Con un peso colgado el resorte se estira, así que su largo crece; se resta solo cuando se encoge.' },
              { id: 'm', valor: L0 + xcm / 100, error: 'U-cm', siFuera: 'Sumar estaba bien, pero x salió en metros y el largo está en centímetros. Pasa x a centímetros antes de sumar.' },
              { id: 'largo', valor: L0 * (1 + m), error: 'RS-LARGO', siFuera: 'El largo sí crece con el peso, pero lo que crece en proporción es la deformación, no el largo entero: el largo natural no se multiplica.' },
            ], v => `${f(v)} cm`),
            solucion: { texto: `Se estira ${f(xcm)} cm desde su largo natural, así que mide el largo natural más esa deformación.`, ecuacion: [`L = ${L0} + ${f(xcm)} = ${f(L)} cm`] },
          };
        }
        // Nivel examen: la carga en una polea móvil con un tramo al resorte (San Marcos 2027-I), tramos verticales.
        const Pv = r.de([80, 120, 160, 200, 240]), kk = r.de([1000, 2000, 4000]), Tv = Pv / 2, xcm = xcmDe(Tv, kk);
        return {
          pregunta: [`Una carga de ${Pv} N cuelga de una polea móvil liviana. Un tramo vertical de la cuerda va al techo y el otro, a un resorte de ${kk} N/m amarrado al techo. ¿Cuánto se estira el resorte?`],
          datos: [D4.hooke, D2.polea, D2.equil, D4.cm],
          opciones: opciones(xcm, [
            { id: 'todo', valor: xcmDe(Pv, kk), error: 'RS-POLEA', siFuera: 'La ley del resorte está bien, pero el resorte está en un solo tramo. La polea cuelga de dos tramos con la misma tensión, y cada uno sostiene la mitad de la carga.' },
            { id: 'cuarto', valor: xcmDe(Pv / 4, kk), error: 'MS-SUMA', siFuera: 'Repartiste entre cuatro, pero la polea cuelga de dos tramos. Cuenta los tramos que suben desde la polea.' },
            { id: 'm', valor: Tv / kk, error: 'U-cm', siFuera: 'La cuenta está bien, pero salió en metros. Pásala a centímetros, multiplicando por 100.' },
            { id: 'doble', valor: xcmDe(2 * Pv, kk), error: 'RS-DOBLE', siFuera: 'La polea móvil reparte la carga entre los dos tramos, no la duplica: el resorte sostiene la mitad, no el doble.' },
          ], v => `${f(v)} cm`),
          solucion: { texto: 'La polea cuelga de dos tramos con la misma T, que se reparten la carga. El resorte está en uno de ellos, así que jala con T y se estira T entre k.', ecuacion: [T, ` = ${Pv} ÷ 2 = ${Tv} N   →   x = ${Tv} ÷ ${kk} = ${f(xcm / 100, 4)} m = ${f(xcm)} cm`] },
        };
      },
    },
  };

  // ======================= 5: torque (el sube y baja del parque) =======================
  // Cambia: dónde se sienta Beto y cuánto pesa · Permanece: Ana, 30 kg a 1,5 m del apoyo · Progresa: hacia dónde se
  // inclina el sube y baja · Se reserva: la escoba cortada (Predice) · Debe verse: lo que equilibra es peso por distancia.
  // Lienzo: el apoyo en (160, 186); 56 px por metro; la barra se inclina 5° hacia el lado que gira más.
  const PXM = 56;
  function figBarra(o) {
    const c = o.c || [160, 180], ph = o.inclina || 0, cs = Math.cos(rad(ph)), sn = Math.sin(rad(ph)), half = o.medio || 2.5;
    const en = s => [c[0] + PXM * s * cs, c[1] - PXM * s * sn];
    const objs = [{ tipo: 'barra', de: en(-half), a: en(half), grosor: 8 }, { tipo: 'apoyo', x: c[0], y: c[1] + 4 }], fl = [], cotas = [];
    for (const q of o.cargas || []) {
      const p = en(q.s);
      if (q.persona) objs.push({ tipo: 'persona', x: p[0], y: p[1] - 4, alto: 54, mano: [p[0] + (q.s < 0 ? 10 : -10), p[1] - 28], texto: q.nombre });
      else if (q.caja) objs.push({ tipo: 'caja', x: p[0], y: p[1] - 4, w: 34, h: 26, texto: q.caja });
      if (q.F) fl.push({ de: [p[0], p[1] + 4], ang: q.ang === undefined ? 270 : q.ang, largo: largoDe(q.F, q.texto, o.k || 0.12), color: q.color || 'h', texto: q.texto, rumbo: [q.s < 0 ? -1 : 1, 0.4] });
      if (q.cota) cotas.push({ de: [c[0], c[1] + 6], a: [p[0], p[1] + 6], lado: q.s < 0 ? 1 : -1, sep: 18, texto: q.cota });
    }
    return { alto: o.alto || 240, piso: { y: c[1] + 26 + (o.pisoMas || 0), x0: 8, x1: 312 }, objetos: objs, flechas: fl, cotas, textos: o.textos || [], alt: o.alt };
  }
  const tauDe = val => [300 * 1.5, val.mB * G * val.d];
  const juego5 = val => {
    const [ta, tb] = tauDe(val), inc = Math.abs(ta - tb) < 1e-9 ? 0 : ta > tb ? 5 : -5;
    return est(figBarra({ inclina: inc, cargas: [{ s: -1.5, persona: true, nombre: 'Ana', F: 300, texto: 'P_A', cota: '1,5 m' }, { s: val.d, persona: true, nombre: 'Beto', F: val.mB * G, texto: 'P_B', cota: 'd' }],
      alt: `El sube y baja: Ana, de 30 kg, a 1,5 m del apoyo; Beto, de ${val.mB} kg, a ${f(val.d)} m. ${inc === 0 ? 'Queda horizontal.' : inc > 0 ? 'Baja el lado de Ana.' : 'Baja el lado de Beto.'}` }));
  };
  // La escoba equilibrada sobre un dedo (valores aproximados): el palo, de unos 2 N, con su centro a 0,45 m del corte;
  // el cepillo, de unos 6 N, con su centro a 0,15 m.
  function figEscoba(o = {}) {
    const objs = [{ tipo: 'escoba', de: [24, 110], a: [300, 110] }, { tipo: 'apoyo', x: 222, y: 118, alto: 18 }];
    return { alto: o.alto || 200, objetos: objs, lineas: [{ de: [222, 70], a: [222, 150] }], flechas: o.flechas || [], cotas: o.cotas || [], textos: o.textos || [], alt: o.alt };
  }
  const PRED5 = figEscoba({ textos: [{ x: 222, y: 186, texto: 'el dedo: aquí se corta', ancla: 'middle', peso: 400 }, { x: 100, y: 60, texto: 'palo', ancla: 'middle' }, { x: 276, y: 60, texto: 'cepillo', ancla: 'middle' }],
    alt: 'Una escoba equilibrada sobre un dedo, cerca del cepillo; una línea punteada marca dónde se corta.' });
  const REVELA5 = figEscoba({ flechas: [{ de: [120, 116], ang: 270, largo: 22, color: 'h', texto: '2 N', rumbo: [0, 1] }, { de: [272, 120], ang: 270, largo: 60, color: 'h', texto: '6 N', rumbo: [1, 0.3] }],
    cotas: [{ de: [222, 104], a: [120, 104], lado: 1, sep: 22, texto: '0,45 m' }, { de: [222, 104], a: [272, 104], lado: -1, sep: 22, texto: '0,15 m' }],
    alt: 'La parte del palo pesa unos 2 N con su centro lejos del corte; la del cepillo, unos 6 N, cerca: hacen el mismo torque.' });
  function figLlave(o) {
    const e = [70, 150], L = o.L || 170, a = [e[0] + L, e[1]], th = o.ang;
    const fl = [{ de: a, ang: th === 90 ? 90 : 180 - th, largo: o.largo || 72, color: 'o', texto: o.tF || `F = ${N_(o.F)}`, rumbo: [0, -1] }];
    const objs = [{ tipo: 'llave', de: e, a }];
    const lineas = [], angs = [];
    if (th !== 90) {
      const ux = Math.cos(rad(180 - th)), uy = -Math.sin(rad(180 - th));
      lineas.push({ de: [a[0] - ux * 50, a[1] - uy * 50], a: [a[0], a[1]] });
      angs.push({ c: a, de: 180 - th, a: 180, r: 26, texto: `${th}°` });
    }
    return { alto: 210, objetos: objs, flechas: fl, lineas, angulos: angs, cotas: [{ de: e, a, lado: 1, sep: 24, texto: o.tL || 'L' }], textos: o.textos || [], alt: o.alt };
  }
  // La puerta vista desde arriba: las bisagras a la izquierda y la fuerza en el borde, con su ángulo con la puerta.
  function figPuerta(o) {
    const x0 = 40, y = 120, x1 = x0 + 200 * o.L, a = [x1, y];
    return { alto: 180, objetos: [{ tipo: 'barra', de: [x0, y], a, grosor: 10 }, { tipo: 'nudo', en: [x0, y] }],
      flechas: [{ de: a, ang: 180 - o.ang, largo: 60, color: 'o', texto: o.tF, rumbo: [0, -1] }],
      angulos: [{ c: a, de: 180 - o.ang, a: 180, r: 26, texto: `${o.ang}°` }],
      cotas: [{ de: [x0, y + 6], a: [x1, y + 6], lado: 1, sep: 16, texto: `${f(o.L)} m` }], textos: [{ x: x0, y: y - 22, texto: 'bisagras', ancla: 'start', peso: 400 }],
      alt: `Una puerta vista desde arriba, empujada en su borde con una fuerza inclinada ${o.ang}° respecto de la puerta.` };
  }
  const MIRA5 = Object.assign(figBarra({ cargas: [] }), { alt: 'El sube y baja equilibrado, la escoba cortada y la llave con la fuerza inclinada.',
    cortes: [
      (() => { const d = figBarra({ cargas: [{ s: -1.5, persona: true, nombre: 'Ana', F: 300, texto: '300 N', cota: '1,5 m' }, { s: 2.25, persona: true, nombre: 'Beto', F: 200, texto: '200 N', cota: '2,25 m' }] }); return { objetos: d.objetos, flechas: d.flechas, cotas: d.cotas, piso: d.piso, lineas: [], angulos: [] }; })(),
      (() => { const d = figBarra({ cargas: [{ s: -1.5, persona: true, nombre: 'Ana', F: 300, texto: '300 N', cota: '1,5 m' }, { s: 2.25, persona: true, nombre: 'Beto', F: 200, texto: '200 N', cota: '2,25 m' }], textos: [{ x: 8, y: 22, texto: '450 N·m = 450 N·m', ancla: 'start' }] }); return { objetos: d.objetos, flechas: d.flechas, cotas: d.cotas, textos: d.textos, piso: d.piso, lineas: [], angulos: [] }; })(),
      (() => { const d = REVELA5; return { objetos: d.objetos, flechas: d.flechas, cotas: d.cotas, lineas: d.lineas, textos: [{ x: 8, y: 22, texto: '2 · 0,45 = 6 · 0,15', ancla: 'start' }], piso: undefined, angulos: [] }; })(),
      (() => { const d = figLlave({ ang: 53, F: 80, tF: 'F = 80 N', tL: 'L = 0,25 m' }); return { objetos: d.objetos, flechas: d.flechas, cotas: d.cotas, lineas: d.lineas, angulos: d.angulos, textos: [{ x: 8, y: 22, texto: 'brazo: 0,25 · sen 53° = 0,2 m', ancla: 'start' }], piso: undefined }; })(),
    ] });
  const D5 = {
    tau: 'Torque: τ = F · d, con F la fuerza y d su brazo: la distancia del eje a la línea de la fuerza',
    eq: 'Sin girar, los torques horarios igualan a los antihorarios',
    brazo: ['Fuerza que forma θ con una barra, a L del eje: d = L · sen θ'],
    cm: '1 m = 100 cm',
  };

  // Ejemplos de la idea 5. Cuentas rehechas aparte (cuentas.js: suma los torques con su signo, horario negativo, y busca
  // por bisección lo que los anula; el brazo de la fuerza inclinada se mide como distancia de un punto a una recta):
  // 50·0,3; 20·0,8; 300·2; 300·1 contra 200·2; 12/40; 600/300; 500/250 y /10; 80·0,25·4/5; 50·0,2; 60·0,4·1/2;
  // la barreta; los tres niños; la escoba; 20/(0,25·1/2); el bíceps.
  const EJEMPLOS_TQ = [
    { nivel: 1, titulo: 'La llave de ruedas',
      figura: est(figLlave({ ang: 90, F: 50, tF: 'F = 50 N', tL: 'L = 0,3 m', largo: 50, alt: 'Una llave de 0,3 m jalada en su punta con 50 N, perpendicular.' })),
      enunciado: ['Aflojas una tuerca jalando la punta de una llave de 0,3 m con ', pj('50 N'), ', perpendicular a la llave. ¿Qué torque le das?'],
      datos: [D5.tau],
      solucion: [{ texto: 'Como la fuerza es perpendicular a la llave, la distancia del eje a su línea es todo el largo de la llave:', ecuacion: ['τ = 50 · 0,3 = 15 N·m'] }],
      respuesta: [neg('τ = 15 N·m')] },
    { nivel: 1, titulo: 'Empujar la puerta',
      figura: est({ alto: 150, objetos: [{ tipo: 'barra', de: [40, 100], a: [270, 100], grosor: 10 }, { tipo: 'nudo', en: [40, 100] }], flechas: [{ de: [222, 92], ang: 90, largo: 40, color: 'o', texto: 'F = 20 N', rumbo: [1, -0.3] }],
        cotas: [{ de: [40, 108], a: [222, 108], lado: 1, sep: 16, texto: '0,8 m' }], textos: [{ x: 40, y: 80, texto: 'bisagras', ancla: 'start', peso: 400 }], alt: 'Una puerta vista desde arriba, empujada perpendicular a 0,8 m de las bisagras.' }),
      enunciado: ['Empujas una puerta con ', pj('20 N'), ', perpendicular a ella, a 0,8 m de las bisagras. ¿Qué torque haces?'],
      datos: [D5.tau],
      solucion: [{ texto: 'La puerta gira en las bisagras, así que ese es el eje. La fuerza es perpendicular, y su brazo es la distancia a las bisagras:', ecuacion: ['τ = 20 · 0,8 = 16 N·m'] }],
      respuesta: [neg('τ = 16 N·m')] },
    { nivel: 1, titulo: 'Ana en el sube y baja',
      figura: est(figBarra({ cargas: [{ s: -2, persona: true, nombre: 'Ana', F: 300, texto: '300 N', cota: '2 m' }], alt: 'Ana, de 300 N, sentada a 2 m del apoyo del sube y baja.' })),
      enunciado: ['Ana pesa ', pp('300 N'), ' y se sienta a 2 m del apoyo del sube y baja. ¿Qué torque hace respecto del apoyo?'],
      datos: [D5.tau],
      solucion: [{ texto: 'Su peso es vertical y la barra está horizontal, así que el peso es perpendicular a la barra y su brazo es la distancia al apoyo, 2 m.', ecuacion: ['τ = 300 · 2 = 600 N·m'] }],
      respuesta: [neg('τ = 600 N·m')] },
    { nivel: 1, titulo: '¿Hacia dónde gira?',
      figura: est(figBarra({ cargas: [{ s: -1, persona: true, nombre: 'Ana', F: 300, texto: '300 N', cota: '1 m' }, { s: 2, persona: true, nombre: 'Beto', F: 200, texto: '200 N', cota: '2 m' }], alt: 'Ana, de 300 N, a 1 m del apoyo; Beto, de 200 N, a 2 m.' })),
      enunciado: ['En el sube y baja, Ana, de ', pp('300 N'), ', está a 1 m del apoyo, y Beto, de ', pp('200 N'), ', a 2 m del otro lado. ¿Qué lado baja?'],
      datos: [D5.tau, D5.eq],
      solucion: [{ texto: 'Ana pesa más, pero eso no decide. Se comparan los torques, peso por distancia, y baja el lado del mayor:', ecuacion: ['Ana: 300 · 1 = 300 N·m   ·   Beto: 200 · 2 = 400 N·m'] }],
      respuesta: ['Baja el lado de Beto'] },
    { nivel: 1, titulo: 'El brazo que falta',
      figura: est(figLlave({ ang: 90, F: 40, tF: 'F = 40 N', tL: 'd = ?', largo: 46, alt: 'Una llave jalada con 40 N perpendicular; su largo, con un signo de pregunta.' })),
      enunciado: ['Con una fuerza de ', pj('40 N'), ' perpendicular a una llave, logras un torque de 12 N·m. ¿A qué distancia del eje jalas?'],
      datos: [D5.tau],
      solucion: [{ texto: 'Como el torque es la fuerza por el brazo, el brazo es el torque entre la fuerza:', ecuacion: ['d = ', { frac: ['12', pj('40')] }, ' = 0,3 m'] }],
      respuesta: [neg('d = 0,3 m')] },
    { nivel: 2, titulo: 'Equilibrar el sube y baja',
      figura: est(figBarra({ cargas: [{ s: -1.5, persona: true, nombre: '40 kg', F: 400, texto: '400 N', cota: '1,5 m' }, { s: 1.4, persona: true, nombre: '30 kg', F: 300, texto: '300 N', cota: 'd = ?' }], k: 0.1, textos: [{ x: 8, y: 22, texto: 'El dibujo no está a escala.', ancla: 'start', peso: 400 }], alt: 'Un niño de 40 kg a 1,5 m del apoyo y otro de 30 kg del otro lado. El dibujo no está a escala.' })),
      enunciado: ['Un niño de 40 kg se sienta a 1,5 m del apoyo del sube y baja. ¿A qué distancia del apoyo debe sentarse otro de 30 kg para que quede horizontal? (El dibujo no está a escala.)'],
      datos: [D.peso, D5.tau, D5.eq],
      solucion: [
        { texto: 'Para que quede horizontal, los torques de los dos lados se igualan: cada peso por su distancia al apoyo.', ecuacion: ['400 · 1,5 = 300 · d'] },
        { texto: 'Se despeja d. El niño más liviano tiene que sentarse más lejos:', ecuacion: ['d = ', { frac: ['600', '300'] }, ' = 2 m'] },
      ],
      respuesta: [neg('d = 2 m')] },
    { nivel: 2, titulo: '¿Qué masa equilibra?',
      figura: est(figBarra({ cargas: [{ s: -2, persona: true, nombre: '25 kg', F: 250, texto: '250 N', cota: '2 m' }, { s: 2.5, persona: true, nombre: '?', F: 200, texto: 'P = ?', cota: '2,5 m' }], alt: 'Un niño de 25 kg a 2 m del apoyo; del otro lado, otro a 2,5 m.' })),
      enunciado: ['Un niño de 25 kg está a 2 m del apoyo. ¿Qué masa debe tener otro niño, sentado a 2,5 m del otro lado, para equilibrarlo?'],
      datos: [D.peso, D5.tau, D5.eq],
      solucion: [
        { texto: 'Para equilibrarlo, los torques de los dos lados se igualan; de ahí sale el peso del otro niño:', ecuacion: ['250 · 2 = ', P, ' · 2,5   →   ', P, ' = ', pp('200 N')] },
        { texto: 'Piden la masa, así que el peso se divide entre g:', ecuacion: ['m = 200 ÷ 10 = 20 kg'] },
      ],
      respuesta: [neg('m = 20 kg')] },
    { nivel: 2, titulo: 'La llave con ángulo',
      figura: est(figLlave({ ang: 53, F: 80, tF: 'F = 80 N', tL: 'L = 0,25 m', alt: 'Una llave de 0,25 m jalada con 80 N que forman 53° con la llave.' })),
      enunciado: ['Jalas la punta de una llave de 0,25 m con ', pj('80 N'), ', pero la fuerza forma 53° con la llave. ¿Qué torque das?'],
      datos: [D5.tau, D5.brazo, D2.trig],
      solucion: [
        { texto: 'La fuerza no es perpendicular, así que el brazo no es toda la llave: es la distancia del eje a la línea de la fuerza.', ecuacion: ['d = 0,25 · sen 53° = 0,25 · ', { frac: ['4', '5'] }, ' = 0,2 m'] },
        { texto: 'Con ese brazo, el torque es la fuerza por el brazo:', ecuacion: ['τ = 80 · 0,2 = 16 N·m'] },
      ],
      respuesta: [neg('τ = 16 N·m')] },
    { nivel: 2, titulo: 'En centímetros',
      figura: est(figLlave({ ang: 90, F: 50, tF: 'F = 50 N', tL: '20 cm', largo: 50, alt: 'Una llave de 20 cm jalada con 50 N perpendicular.' })),
      enunciado: ['Una llave mide 20 cm. Jalas su punta con ', pj('50 N'), ', perpendicular. ¿Qué torque das, en N·m?'],
      datos: [D5.tau, D5.cm],
      solucion: [{ texto: 'El torque va en N·m, así que el brazo se pasa a metros: 20 cm son 0,2 m.', ecuacion: ['τ = 50 · 0,2 = 10 N·m'] }],
      respuesta: [neg('τ = 10 N·m')] },
    { nivel: 2, titulo: 'La fuerza a 30°',
      figura: est(figLlave({ ang: 30, F: 60, tF: 'F = 60 N', tL: 'L = 0,4 m', alt: 'Una barra de 0,4 m jalada en su punta con 60 N que forman 30° con la barra.' })),
      enunciado: ['Jalas la punta de una barra de 0,4 m, que gira en su otro extremo, con ', pj('60 N'), ' que forman 30° con la barra. ¿Qué torque das?'],
      datos: [D5.tau, D5.brazo, D2.trig30],
      solucion: [
        { texto: 'La fuerza forma 30° con la barra, así que el brazo es el largo por el seno de ese ángulo:', ecuacion: ['d = 0,4 · sen 30° = 0,2 m'] },
        { texto: 'Con ese brazo, el torque es la fuerza por el brazo:', ecuacion: ['τ = 60 · 0,2 = 12 N·m'] },
      ],
      respuesta: [neg('τ = 12 N·m')] },
    { nivel: 3, titulo: 'La barreta del agricultor',
      figura: est({ alto: 214, piso: { y: 178, x0: 120 }, objetos: [{ tipo: 'barra', de: [50, 140], a: [300, 140], grosor: 7 }, { tipo: 'apoyo', x: 100, y: 144, alto: 30 }, { tipo: 'caja', x: 60, y: 136, w: 40, h: 34, texto: 'piedra' }],
        flechas: [{ de: [54, 144], ang: 270, largo: 34, color: 'f', texto: '800 N', rumbo: [1, 0.6] }, { de: [300, 112], ang: 270, largo: 26, color: 'o', texto: 'F = ?', rumbo: [-1, -0.2] }],
        cotas: [{ de: [50, 150], a: [100, 150], lado: 1, sep: 46, texto: '0,3 m' }, { de: [50, 126], a: [300, 126], lado: -1, sep: 26, texto: '1,5 m' }], alt: 'Una barreta de 1,5 m apoyada en una piedrita a 0,3 m de la punta, bajo una piedra que empuja con 800 N.' }),
      enunciado: ['Un agricultor mueve una piedra con una barreta liviana de 1,5 m, apoyada en una piedrita a 0,3 m de la punta. La piedra empuja la punta con ', pn('800 N'), '. ¿Con qué fuerza vertical empuja el otro extremo?'],
      alternativas: ['200 N', '800 N', '160 N', '1000 N', '3200 N'],
      datos: [D5.tau, D5.eq],
      solucion: [
        { texto: 'La barreta gira sobre la piedrita, así que ese es el eje. La piedra empuja a 0,3 m de él, y la mano, en el otro extremo, a 1,5 − 0,3 = 1,2 m.' },
        { texto: 'La barreta no gira, así que los dos torques se igualan:', ecuacion: ['800 · 0,3 = ', F, ' · 1,2   →   ', F, ' = ', pj('200 N')] },
        { texto: ['La ', neg('B'), ' iguala las fuerzas en vez de los torques. La ', neg('C'), ' usa 1,5 m como brazo de la mano, sin restar la punta. La ', neg('D'), ' suma 800 y 200, y la ', neg('E'), ' invierte los brazos: 800 · 1,2 ÷ 0,3.'] },
      ],
      respuesta: [neg('A'), ', ', pj('200 N')] },
    { nivel: 3, titulo: 'Tres niños en el balancín',
      figura: est(figBarra({ cargas: [{ s: -2, persona: true, nombre: 'Ana', F: 300, texto: '300 N', cota: '2 m' }, { s: -1, persona: true, nombre: 'Beto', F: 200, texto: '200 N' }, { s: 1.4, persona: true, nombre: 'Carla', F: 400, texto: '400 N', cota: 'd = ?' }], k: 0.1,
        textos: [{ x: 8, y: 22, texto: 'Beto, a 1 m del apoyo', ancla: 'start', peso: 400 }, { x: 8, y: 42, texto: 'El dibujo no está a escala.', ancla: 'start', peso: 400 }], alt: 'Ana, de 300 N, a 2 m del apoyo y Beto, de 200 N, a 1 m, del mismo lado; Carla, de 400 N, del otro.' })),
      enunciado: ['Ana, de 30 kg, a 2 m del apoyo, y Beto, de 20 kg, a 1 m, están del mismo lado. ¿A qué distancia del apoyo se sienta Carla, de 40 kg, al otro lado?'],
      alternativas: ['1,5 m', '2,5 m', '3 m', '0,5 m', '2 m'],
      datos: [D.peso, D5.tau, D5.eq],
      solucion: [
        { texto: 'Ana y Beto hacen girar hacia el mismo lado, así que sus torques se suman:', ecuacion: ['300 · 2 + 200 · 1 = 800 N·m'] },
        { texto: 'Carla está al otro lado, y su torque tiene que igualar esa suma:', ecuacion: ['400 · d = 800   →   d = 2 m'] },
        { texto: ['La ', neg('A'), ' usa solo a Ana. La ', neg('B'), ' pone a Beto a 2 m, como si estuviera junto a Ana: 500 · 2 ÷ 400. La ', neg('C'), ' suma las distancias, 2 + 1, y la ', neg('D'), ' usa solo a Beto.'] },
      ],
      respuesta: [neg('E'), ', 2 m'] },
    { nivel: 3, titulo: 'La escoba cortada',
      figura: est(figEscoba({ flechas: [{ de: [120, 116], ang: 270, largo: 22, color: 'h', texto: '3 N', rumbo: [0, 1] }, { de: [272, 120], ang: 270, largo: 40, color: 'h', texto: 'P = ?', rumbo: [1, 0.3] }],
        cotas: [{ de: [222, 104], a: [120, 104], lado: 1, sep: 22, texto: '0,5 m' }, { de: [222, 104], a: [272, 104], lado: -1, sep: 22, texto: '0,1 m' }], alt: 'Una escoba equilibrada en un dedo: el palo, de 3 N, con su centro a 0,5 m; el cepillo, con su centro a 0,1 m.' })),
      enunciado: ['Una escoba se equilibra en tu dedo. El palo, de ', pp('3 N'), ', tiene su centro a 0,5 m del dedo; el cepillo, del otro lado, a 0,1 m. ¿Cuánto pesa el lado del cepillo?'],
      alternativas: ['3 N', '0,6 N', '15 N', '1,5 N', '30 N'],
      datos: [D5.tau, D5.eq],
      solucion: [
        { texto: 'El dedo es el eje. La escoba no gira, así que el torque del palo iguala al del cepillo:', ecuacion: ['3 · 0,5 = ', P, ' · 0,1   →   ', P, ' = ', pp('15 N')] },
        { texto: ['La ', neg('A'), ' cree que pesan igual porque está equilibrada. La ', neg('B'), ' divide al revés. La ', neg('D'), ' olvida dividir entre 0,1, y la ', neg('E'), ' usa 0,05 m.'] },
      ],
      respuesta: [neg('C'), ', ', pp('15 N')] },
    { nivel: 3, titulo: 'Jalar inclinado cuesta más',
      figura: est(figLlave({ ang: 30, F: 160, tF: 'F = ?', tL: 'L = 0,25 m', alt: 'Una llave de 0,25 m jalada con una fuerza que forma 30° con la llave.' })),
      enunciado: ['Para aflojar una tuerca hacen falta 20 N·m. Con una llave de 0,25 m, jalando con una fuerza que forma 30° con la llave, ¿cuánta fuerza necesitas?'],
      alternativas: ['80 N', '92,38 N', '40 N', '160 N', '5 N'],
      datos: [D5.tau, D5.brazo, D2.trig30],
      solucion: [
        { texto: 'La fuerza forma 30° con la llave, así que el brazo se achica: es el largo por sen 30°.', ecuacion: ['d = 0,25 · sen 30° = 0,125 m'] },
        { texto: 'Con un brazo más chico hace falta más fuerza para el mismo torque. Se despeja F:', ecuacion: [F, ' = ', { frac: ['20', '0,125'] }, ' = ', pj('160 N')] },
        { texto: ['La ', neg('A'), ' toma el brazo entero, como si jalaras perpendicular. La ', neg('B'), ' usa el coseno. La ', neg('C'), ' multiplica por sen 30° en vez de dividir, y la ', neg('E'), ' multiplica 20 por 0,25.'] },
      ],
      respuesta: [neg('D'), ', ', pj('160 N')] },
    { nivel: 3, titulo: 'El bíceps y la pesa',
      figura: est({ alto: 190, objetos: [{ tipo: 'barra', de: [50, 120], a: [270, 120], grosor: 14 }, { tipo: 'nudo', en: [50, 120] }, { tipo: 'caja', x: 276, y: 140, w: 30, h: 26, texto: '5 kg' }],
        flechas: [{ de: [79, 112], ang: 90, largo: 70, color: 'o', texto: 'bíceps: ?', rumbo: [1, -0.2] }, { de: [262, 142], ang: 270, largo: 26, color: 'h', texto: '50 N', rumbo: [-1, 0.2] }],
        cotas: [{ de: [50, 128], a: [79, 128], lado: 1, sep: 12, texto: '4 cm' }, { de: [50, 128], a: [262, 128], lado: 1, sep: 36, texto: '30 cm' }], textos: [{ x: 50, y: 92, texto: 'codo', ancla: 'middle', peso: 400 }],
        alt: 'El antebrazo horizontal: el codo a la izquierda, el bíceps que jala hacia arriba a 4 cm y una pesa de 5 kg en la mano, a 30 cm.' }),
      enunciado: ['Sostienes una pesa de 5 kg con el antebrazo horizontal, a 30 cm del codo. El bíceps jala hacia arriba a 4 cm del codo. Sin contar el peso del antebrazo, ¿con qué fuerza jala el bíceps?'],
      alternativas: ['50 N', '375 N', '3,75 N', '425 N', '6,67 N'],
      datos: [D.peso, D5.tau, D5.eq],
      solucion: [
        { texto: 'El antebrazo gira en el codo, así que ese es el eje. La pesa, de 50 N, tiene brazo 30 cm, y el bíceps, solo 4 cm.' },
        { texto: 'El antebrazo no gira: los torques se igualan. Los brazos pueden quedar en centímetros, porque los dos van en la misma unidad:', ecuacion: [F, ' · 4 = 50 · 30   →   ', F, ' = ', pj('375 N')] },
        { texto: ['La ', neg('A'), ' iguala las fuerzas en vez de los torques. La ', neg('C'), ' mezcla metros y centímetros. La ', neg('D'), ' suma la pesa, y la ', neg('E'), ' divide al revés.'] },
      ],
      respuesta: [neg('B'), ', ', pj('375 N')] },
  ];

  const NINOS = [['Luis', 'Rosa'], ['Juan', 'Sara'], ['Pedro', 'Mía']];
  const torque = {
    id: 'torque-y-brazo',
    titulo: 'Torque: fuerza por brazo',
    pregunta: '¿Dónde se sienta Beto para equilibrar a Ana en el sube y baja?',
    temas: ['Torque', 'Máquinas simples'],
    pieza: 'fis-estatica',
    aprendizaje: 'El torque, fuerza por brazo, es lo que hace girar. Si algo no gira, los torques de un sentido igualan a los del otro.',
    actividad: 'Sentar a Beto en el sube y baja del parque hasta equilibrarlo.',
    lee: {
      tarjetas: [
        { titulo: 'Cosas que giran', texto: 'Una puerta gira en sus bisagras, una llave gira en la tuerca y el sube y baja del parque gira en su apoyo del medio. Eso alrededor de lo cual algo gira es su eje de giro. Una palanca es una barra que gira en un apoyo, como el sube y baja.',
          dibujo: est(figBarra({ cargas: [{ s: -1.5, persona: true, nombre: 'Ana' }, { s: 1.5, persona: true, nombre: 'Beto' }], alt: 'El sube y baja del parque con Ana y Beto.' })) },
        { titulo: 'El torque', texto: 'Lo que mide cuánto hace girar una fuerza se llama torque, τ, y se mide en N·m. Depende de la fuerza y de su brazo, d: la distancia del eje a la línea de la fuerza. Por eso cuesta menos aflojar una tuerca con una llave larga que con una corta.' },
        { titulo: 'Qué mirar al jugar', texto: 'Ana se queda quieta. Mueve a Beto por la barra y cambia cuánto pesa: mira cuándo el sube y baja queda horizontal.' },
      ],
    },
    ejemplos: EJEMPLOS_TQ,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'En el sube y baja, Ana, de 30 kg, está a 1,5 m del apoyo. Tú sientas a Beto. Un kilo pesa 10 N.',
      mision: {
        texto: 'Sienta a Beto donde el sube y baja quede horizontal.',
        // Dos maneras: Beto de 20 kg a 2,25 m, o de 30 kg a 1,5 m.
        logrado: val => Math.abs(val.mB * G * val.d - 450) < 1e-9,
        bien: 'Coincide: el peso por la distancia da lo mismo a los dos lados.',
      },
      voz: 'Corre a Beto. ¿Dónde se equilibra?',
      leyenda: [
        { s: [sub(P, 'A'), ' y ', sub(P, 'B')], t: 'el peso de Ana y el de Beto' },
        { s: 'd', t: 'distancia de Beto al apoyo' },
        { s: 'τ', t: 'torque: cuánto hace girar cada niño' },
      ],
      controles: [
        { id: 'mB', etiqueta: 'Beto', opciones: [20, 25, 30].map(v => ({ valor: v, texto: `${v} kg` })), inicio: 20 },
        { id: 'd', etiqueta: 'Distancia, d', min: 0.5, max: 2.5, paso: 0.25, inicio: 1, unidad: 'm', decimales: 2 },
      ],
      dibujo: juego5,
      lectura: val => { const [ta, tb] = tauDe(val); return [`Ana, τ = ${f(ta)} N·m; Beto, τ = ${f(tb)} N·m: `, Math.abs(ta - tb) < 1e-9 ? 'queda horizontal' : ta > tb ? 'baja Ana' : 'baja Beto']; },
      resumen: { mB: 20, d: 1.5 },
      minimo: 3,
    },
    predice: {
      pregunta: 'Equilibras una escoba sobre tu dedo y la cortas justo ahí. ¿Qué parte pesa más?',
      datos: ['El cepillo queda a un lado del corte y el palo largo, al otro.'],
      opciones: [
        { id: 'c', texto: 'La del cepillo, la más corta', correcta: true },
        { id: 'igual', texto: 'Pesan igual: estaba equilibrada', error: 'E1', siFuera: 'Que esté equilibrada no quiere decir que los dos lados pesen igual. Lo que se iguala es el peso por la distancia al dedo: un lado cercano puede pesar más y aun así equilibrar.' },
        { id: 'largo', texto: 'La del palo, la más larga', error: 'E1-LARGO', siFuera: 'El largo sí importa, pero no como peso: el palo es delgado y pesa poco. Equilibra porque su peso actúa lejos del dedo, no porque pese más.' },
        { id: 'nose', texto: 'No se puede saber sin una balanza', error: 'TQ-NOSE', siFuera: 'Una balanza lo confirmaría, pero no hace falta. Si los dos lados se equilibran, sus pesos por sus distancias son iguales, y el lado que actúa más cerca del dedo tiene que pesar más.' },
      ],
      dibujo: est(PRED5),
      revelar: est(REVELA5),
      coincide: 'Coincide: el cepillo pesa más pero está cerca del dedo; el palo, liviano, está lejos. Sus torques se igualan.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: MIRA5,
      pasos: [
        { estado: { corte: 0 }, texto: 'Ana pesa 300 N y está a 1,5 m del apoyo; Beto pesa 200 N y está a 2,25 m. El sube y baja queda horizontal.' },
        { estado: { corte: 1 }, texto: 'Los pesos son distintos, pero el peso por la distancia da lo mismo a los dos lados: eso es el torque, y es lo que se iguala.', ecuacion: ['300 · 1,5 = 450 N·m   ·   200 · 2,25 = 450 N·m'] },
        { estado: { corte: 2 }, texto: 'En la escoba pasa lo mismo: el cepillo pesa más, pero actúa más cerca del dedo, y su torque iguala al del palo.', ecuacion: ['2 · 0,45 = 0,9 N·m   ·   6 · 0,15 = 0,9 N·m'] },
        { estado: { corte: 3 }, texto: 'Si la fuerza va inclinada, el brazo es la distancia del eje a la línea de la fuerza, y sale menor que la llave: por eso gira menos.', ecuacion: ['d = 0,25 · sen 53° = 0,2 m   →   τ = 80 · 0,2 = 16 N·m'] },
      ],
    },
    regla: {
      texto: 'El torque mide cuánto hace girar una fuerza: es la fuerza por su brazo d, la distancia del eje a la línea de la fuerza. Si algo no gira, los torques que lo harían girar en un sentido igualan a los del sentido contrario; por eso un peso chico lejos equilibra uno grande cerca.',
      ecuacion: ['τ = F · d'],
      condicion: 'el brazo d se mide del eje a la línea de la fuerza, no al punto donde se aplica; si la fuerza forma θ con la barra, d = L · sen θ, y con la fuerza perpendicular d es todo el largo.',
      dibujo: est(Object.assign({}, MIRA5, MIRA5.cortes[1], { cortes: undefined })),
    },
    // Así se resuelve: la palanca con un peso que se levanta (semillas pares) y el torque de una fuerza inclinada en una
    // puerta (impares). «Ahora tú» trae otros casos: torque perpendicular, sube y baja, llave inclinada y barreta.
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 1) {
          const Fv = r.de([30, 40, 50]), L = r.de([0.6, 0.8, 1]), ang = r.de([30, 37, 53]), d = L * SEN_(ang), tau = Fv * d;
          return {
            enunciado: ['Empujas el borde de una puerta, a ', `${f(L)} m de las bisagras, con `, pj(N_(Fv)), ` que forman ${ang}° con la puerta. ¿Qué torque haces?`],
            datos: [D5.tau, D5.brazo, trigDe(ang)],
            dibujo: est(figPuerta({ L, ang, tF: `F = ${N_(Fv)}` })),
            pasos: [
              { tipo: 'pide', texto: 'Piden el torque respecto de las bisagras, que son el eje de giro de la puerta.' },
              { tipo: 'datos', texto: ['La fuerza es de ', pj(N_(Fv)), `, a ${f(L)} m del eje, y forma ${ang}° con la puerta.`] },
              { tipo: 'regla', texto: 'El torque es la fuerza por su brazo. Como la fuerza va inclinada, su brazo es la distancia del eje a su línea, L · sen θ, y no todo el largo.', ecuacion: ['τ = F · d   ·   d = L · sen θ'] },
              { tipo: 'cuentas', texto: 'Primero se calcula el brazo y después se multiplica por la fuerza.', ecuacion: [`d = ${f(L)} · sen ${ang}° = ${f(d, 3)} m   →   τ = ${Fv} · ${f(d, 3)} = ${f(tau)} N·m`] },
              { tipo: 'sentido', texto: `Si empujaras perpendicular, darías ${f(Fv * L)} N·m. Inclinada, una parte de tu fuerza empuja hacia las bisagras y no hace girar la puerta.` },
            ],
            respuesta: [neg(`τ = ${f(tau)} N·m`)],
          };
        }
        const Pv = r.de([300, 400, 600]), a = r.de([0.2, 0.25, 0.4]), b = r.de([1, 1.2, 1.6]), Fv = Pv * a / b;
        return {
          enunciado: [`Con una palanca liviana levantas un saco de ${Pv} N. El saco está a ${f(a)} m del apoyo y tú empujas hacia abajo a ${f(b)} m del otro lado. ¿Con qué fuerza empujas?`],
          datos: [D5.tau, D5.eq],
          dibujo: est(figBarra({ medio: 1.8, k: 42 / Pv, cargas: [{ s: -a, caja: 'saco', F: Pv, texto: `${Pv} N`, cota: `${f(a)} m` }, { s: b, F: 1, color: 'o', texto: 'F = ?', cota: `${f(b)} m` }] })),
          pasos: [
            { tipo: 'pide', texto: 'Piden con qué fuerza empujas para sostener el saco sin que la palanca gire.' },
            { tipo: 'datos', texto: ['El saco empuja con ', pp(N_(Pv)), ` a ${f(a)} m del apoyo, y tú empujas a ${f(b)} m del otro lado.`] },
            { tipo: 'regla', texto: 'La palanca no gira, así que el torque del saco iguala al tuyo: cada fuerza por su distancia al apoyo.', ecuacion: ['τ = F · d'] },
            { tipo: 'cuentas', texto: 'Se igualan los dos torques y se despeja F.', ecuacion: [`${Pv} · ${f(a)} = `, F, ` · ${f(b)}   →   `, F, ' = ', pj(N_(Fv))] },
            { tipo: 'sentido', texto: `Empujas menos que ${Pv} N porque tu brazo es ${f(b / a)} veces el del saco, y tu fuerza sale esa misma cantidad de veces menor.` },
          ],
          respuesta: [F, ' = ', pj(N_(Fv))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4;
        if (k === 0) {
          const Fv = r.de([20, 30, 40, 60, 80]), dcm = r.de([15, 20, 25, 30, 40]), tau = Fv * dcm / 100;
          return {
            pregunta: ['Jalas la punta de una llave de ', `${dcm} cm con `, pj(N_(Fv)), ', perpendicular a ella. ¿Qué torque das?'],
            datos: [D5.tau, D5.cm],
            dibujo: est(figLlave({ ang: 90, F: Fv, tF: `F = ${N_(Fv)}`, tL: `${dcm} cm`, largo: 46 })),
            opciones: opciones(tau, [
              { id: 'cm', valor: Fv * dcm, error: 'U-cm', siFuera: 'Multiplicar está bien, pero dejaste el brazo en centímetros. El torque va en N·m, así que el brazo se pasa a metros; si no, sale cien veces más.' },
              { id: 'div', valor: Fv / (dcm / 100), error: 'TQ-DIV', siFuera: 'Usaste la fuerza y el brazo, pero los dividiste. El torque es la fuerza por el brazo: con más brazo, la llave gira más, no menos.' },
              { id: 'divcm', valor: Fv / dcm, error: 'TQ-DIV', siFuera: 'Usaste la fuerza y el brazo, pero los dividiste y dejaste el brazo en centímetros. El torque es la fuerza por el brazo, en metros.' },
              { id: 'mitad', valor: tau / 2, error: 'TQ-MITAD', siFuera: 'Fuerza por brazo está bien, pero tomaste la mitad del largo. Jalas la punta, perpendicular: el brazo es todo el largo de la llave.' },
            ], v => `${f(v)} N·m`),
            solucion: { texto: `La fuerza es perpendicular, así que el brazo es todo el largo de la llave, ${f(dcm / 100)} m, y el torque es la fuerza por ese brazo.`, ecuacion: [`τ = ${Fv} · ${f(dcm / 100)} = ${f(tau)} N·m`] },
          };
        }
        if (k === 1) {
          const [a, b] = r.de(NINOS), { ma, da, mb, db } = elegir(r, () => { const c = { ma: r.de([30, 36, 40]), da: r.de([1, 1.5, 2]), mb: r.de([20, 24, 25]) }; c.db = c.ma * c.da / c.mb; return exacto(c.db) && c.db <= 2.5 && c; });
          return {
            pregunta: [`En el sube y baja, ${a}, de ${ma} kg, se sienta a ${f(da)} m del apoyo. ¿A qué distancia del otro lado se sienta ${b}, de ${mb} kg, para que quede horizontal?`],
            datos: [D.peso, D5.tau, D5.eq],
            opciones: opciones(db, [
              { id: 'igual', valor: da, error: 'TQ-IGUAL', siFuera: 'Así quedaría si pesaran lo mismo. Con pesos distintos, lo que se iguala es el peso por la distancia, y las distancias tienen que ser distintas.' },
              { id: 'inv', valor: mb * da / ma, error: 'TQ-INV', siFuera: 'La proporción está bien, pero al revés. El niño más liviano tiene que ir más lejos del apoyo para hacer el mismo torque.' },
              { id: 'suma', valor: da + (ma - mb) / 10, error: 'TQ-RESTA', siFuera: 'El más liviano sí se aleja, pero no se suma la diferencia de kilos a la distancia. Lo que se iguala son los torques: peso por distancia a cada lado.' },
              { id: 'doble', valor: 2 * db, error: 'TQ-DOBLE', siFuera: 'Planteaste los torques, pero esa distancia daría el doble del torque necesario, y el sube y baja bajaría de ese lado.' },
            ], v => `${f(v)} m`),
            solucion: { texto: 'Para que quede horizontal, los torques de los dos lados se igualan: cada peso por su distancia al apoyo. De ahí se despeja d.', ecuacion: [`${ma * G} · ${f(da)} = ${mb * G} · d   →   d = ${f(db)} m`] },
          };
        }
        if (k === 2) {
          const Fv = r.de([40, 50, 60, 100]), L = r.de([0.2, 0.3, 0.4, 0.5]), ang = r.de([30, 37, 53]), tau = Fv * L * SEN_(ang);
          return {
            pregunta: ['Jalas la punta de una llave de ', `${f(L)} m con `, pj(N_(Fv)), ` que forman ${ang}° con la llave. ¿Qué torque das?`],
            datos: [D5.tau, D5.brazo, trigDe(ang)],
            dibujo: est(figLlave({ ang, F: Fv, tF: `F = ${N_(Fv)}`, tL: `L = ${f(L)} m` })),
            opciones: opciones(tau, [
              { id: 'brazo', valor: Fv * L, error: 'TQ-BRAZO', siFuera: 'Fuerza por distancia está bien, pero con la fuerza inclinada el brazo no es toda la llave. Es la distancia del eje a la línea de la fuerza, y es menor.' },
              { id: 'cos', valor: Fv * L * COS_(ang), error: 'TQ-COS', siFuera: 'Acortar el brazo está bien, pero con el coseno no. Si θ es el ángulo con la llave, el brazo es L · sen θ.' },
              { id: 'div', valor: Fv * SEN_(ang) / L, error: 'TQ-DIV', siFuera: 'Tomaste la parte de la fuerza que hace girar, pero la dividiste entre el largo. El torque multiplica esa parte por la distancia al eje.' },
              { id: 'entre', valor: Fv * L / SEN_(ang), error: 'TQ-ENTRE-SEN', siFuera: 'Usaste el seno, pero dividiste. Inclinar la fuerza acorta el brazo, así que se multiplica por sen θ, que es menor que 1.' },
            ], v => `${f(v)} N·m`),
            solucion: { texto: `La fuerza va inclinada, así que el brazo es ${f(L)} · sen ${ang}° = ${f(L * SEN_(ang), 3)} m, menor que la llave. El torque es la fuerza por ese brazo.`, ecuacion: [`τ = ${Fv} · ${f(L * SEN_(ang), 3)} = ${f(tau)} N·m`] },
          };
        }
        // Nivel examen: la barreta, con la distancia de la piedrita a la punta y el largo total.
        const { Pv, L, a, Fv } = elegir(r, () => { const c = { Pv: r.de([600, 800, 900, 1200]), L: r.de([1.2, 1.5, 2]), a: r.de([0.2, 0.3]) }; c.Fv = c.Pv * c.a / (c.L - c.a); return exacto(c.Fv) && c; });
        return {
          pregunta: [`Mueves una piedra con una barreta liviana de ${f(L)} m, apoyada en una piedrita a ${f(a)} m de la punta. La piedra empuja la punta con ${Pv} N. ¿Con qué fuerza vertical empujas el otro extremo?`],
          datos: [D5.tau, D5.eq],
          opciones: opciones(Fv, [
            { id: 'largo', valor: Pv * a / L, error: 'TQ-LARGO', siFuera: 'Igualar torques está bien, pero tomaste el largo entero como tu brazo. Tu brazo va de la piedrita a tu mano: el largo menos el tramo de la punta.' },
            { id: 'igual', valor: Pv, error: 'TQ-IGUAL', siFuera: 'La barreta no gira, pero eso no iguala las fuerzas. Lo que se iguala son los torques, y como tu brazo es más largo, empujas menos que la piedra.' },
            { id: 'por', valor: Pv * (L - a) / a, error: 'TQ-INV', siFuera: 'La proporción está bien, pero al revés. Con el brazo más largo empujas menos que la piedra, no más: esa es la ventaja de la barreta.' },
            { id: 'suma', valor: Pv + Pv * a / (L - a), error: 'TQ-SUMA', siFuera: 'Sumaste tu fuerza y la de la piedra: eso es lo que aguanta la piedrita, que es el apoyo. Lo que empujas sale solo de igualar los torques.' },
          ], N_),
          solucion: { texto: `La piedrita es el eje. Tu brazo va de ella a tu mano, ${f(L)} − ${f(a)} = ${f(L - a)} m, y los torques de los dos lados se igualan.`, ecuacion: [`${Pv} · ${f(a)} = `, F, ` · ${f(L - a)}   →   `, F, ' = ', pj(N_(Fv))] },
        };
      },
    },
  };

  // ======================= 6: equilibrio del cuerpo rígido (el tablón del pintor) =======================
  // Cambia: dónde está el pintor · Permanece: el tablón de 4 m y 200 N sobre dos caballetes · Progresa: cuánto empuja
  // cada caballete · Se reserva: el pintor justo encima de un caballete (Predice) · Debe verse: el peso del tablón va en
  // su centro y los dos caballetes se reparten todo según los torques.
  // Lienzo: el tablón de x = 40 a 280 (60 px por metro), su cara de arriba en y = 140; los caballetes A y B en sus puntas.
  const PXT = 60, XA = 40, K6 = 0.08;
  function figTablon(o) {
    const L = o.L || 4, xB = o.xB === undefined ? L : o.xB, X = s => XA + PXT * s, k = o.k || K6, fl = [], objs = [];
    objs.push({ tipo: 'barra', de: [X(0), 145], a: [X(L), 145], grosor: 10 }, { tipo: 'caballete', x: X(0) + 8, y: 150, alto: 64 }, { tipo: 'caballete', x: X(xB) - (xB === L ? 8 : 0), y: 150, alto: 64 });
    if (o.NA !== undefined) fl.push({ de: [X(0) + 8, 140], ang: 90, largo: largoDe(o.NA, o.tA, k), color: 'f', texto: o.tA || `N_A = ${N_(o.NA)}`, rumbo: [-0.2, -1] });
    if (o.NB !== undefined) fl.push({ de: [X(xB) - (xB === L ? 8 : 0), 140], ang: 90, largo: largoDe(o.NB, o.tB, k), color: 'f', texto: o.tB || `N_B = ${N_(o.NB)}`, rumbo: [0.2, -1] });
    if (o.Pb) fl.push({ de: [X(L / 2), 150], ang: 270, largo: o.Pb * k, color: 'h', texto: o.tPb || `P_b = ${N_(o.Pb)}`, rumbo: [o.pintor !== undefined && o.pintor < L / 2 ? 1 : -1, 0.3] });
    if (o.carga) { objs.push({ tipo: 'balde', x: X(o.carga.x), y: 140, w: 28, h: 24 }); fl.push({ de: [X(o.carga.x), 150], ang: 270, largo: o.carga.P * k, color: 'h', texto: o.carga.texto, rumbo: [o.carga.x < L / 2 ? -1 : 1, 0.3] }); }
    if (o.pintor !== undefined) {
      objs.push({ tipo: 'persona', x: X(o.pintor), y: 140, alto: 70, mano: [X(o.pintor) + 16, 96] });
      if (o.Pp) fl.push({ de: [X(o.pintor), 150], ang: 270, largo: o.Pp * k, color: 'h', texto: o.tPp || `${N_(o.Pp)}`, rumbo: [o.pintor < L / 2 ? -1 : 1, -0.2] });
    }
    const cotas = (o.cotas || []).map(c => ({ de: [X(c[0]), 156], a: [X(c[1]), 156], lado: 1, sep: c[3] || 14, texto: c[2] }));
    return { alto: o.alto || 250, piso: { y: 214, x0: 8, x1: 312 }, objetos: objs, flechas: fl, cotas, textos: o.textos || [], alt: o.alt };
  }
  const NAde = x => 700 - 150 * x, NBde = x => 100 + 150 * x;
  const juego6 = val => est(figTablon({ NA: NAde(val.x), NB: NBde(val.x), Pb: 200, pintor: val.x, Pp: 600, tA: 'N⃗_A', tB: 'N⃗_B', tPb: 'P⃗_b', tPp: '600 N', cotas: [[0, val.x, 'x', 30]],
    alt: `El tablón de 4 m y 200 N sobre dos caballetes, con el pintor de 600 N a ${f(val.x)} m del caballete A: A empuja ${f(NAde(val.x))} N y B, ${f(NBde(val.x))} N.` }));
  const PRED6 = figTablon({ NA: 0, tA: 'N_A = ?', Pb: 200, pintor: 4, Pp: 600, tPp: '600 N',
    alt: 'El pintor de 600 N parado justo encima del caballete B; el tablón de 200 N, parejo. Lo que empuja A, con un signo de pregunta.' });
  const REVELA6 = figTablon({ NA: 100, NB: 700, Pb: 200, pintor: 4, Pp: 600, alt: 'Con el pintor sobre B, el caballete A sostiene solo la mitad del tablón: 100 N.' });
  const corte6 = (o, txt) => { const d = figTablon(o); return { objetos: d.objetos, flechas: d.flechas, cotas: d.cotas, textos: txt ? [{ x: 8, y: 26, texto: txt, ancla: 'start' }] : [] }; };
  const MIRA6 = Object.assign(figTablon({}), { alt: 'El tablón con el pintor a 3 m de A: los torques respecto de A dan lo que empuja B; las fuerzas, lo que empuja A.',
    cortes: [corte6({ Pb: 200, pintor: 3, Pp: 600, cotas: [[0, 2, '2 m', 30], [0, 3, '3 m', 46]] }),
      corte6({ Pb: 200, pintor: 3, Pp: 600, NB: 550, cotas: [[0, 2, '2 m', 30], [0, 3, '3 m', 46]] }, 'torques respecto de A'),
      corte6({ Pb: 200, pintor: 3, Pp: 600, NB: 550, NA: 250 }, 'las fuerzas suman cero'),
      corte6({ Pb: 200, pintor: 3, Pp: 600, NB: 550, NA: 250, cotas: [[2, 4, '2 m', 30], [3, 4, '1 m', 46]] }, 'comprobación respecto de B'),
      corte6({ Pb: 200, pintor: 4, Pp: 600, NB: 700, NA: 100 }, 'el pintor sobre B')] });
  const D6 = {
    dos: 'Cuerpo rígido en equilibrio: las fuerzas suman cero y los torques, respecto de un mismo punto, también',
    cg: 'El peso de una barra o un tablón parejo actúa en su centro',
    tau: D5.tau,
    pared: 'Una pared lisa solo empuja perpendicular a ella: no tiene rozamiento',
    bisagra: 'Una bisagra puede empujar en cualquier dirección: R es la fuerza de la bisagra',
  };

  // Ejemplos de la idea 6. Cuentas rehechas aparte (cuentas.js: plantea ΣF = 0 y Στ = 0 respecto de un punto elegido
  // y lo comprueba respecto de otro; la escalera, con el brazo medido como distancia a la línea de cada fuerza): 100 y
  // 100; 1,5 m; 100·1; 200 y 200; 300·1/3; 550 y 250; 550 con 5 m; 45 kg; 0,5 m; el cable vertical; la escalera; el
  // antebrazo; el voladizo; el cable a 30°; el centro de gravedad.
  const figBarraSimple = (o) => {
    const fl = (o.flechas || []), objs = [{ tipo: 'barra', de: [40, 120], a: [280, 120], grosor: 10 }, ...(o.apoyos || []).map(x => ({ tipo: 'apoyo', x, y: 126, alto: 26 })), ...(o.extra || [])];
    return { alto: o.alto || 200, piso: o.piso === false ? undefined : { y: 152 }, objetos: objs, flechas: fl, cotas: o.cotas || [], textos: o.textos || [], paredes: o.paredes, alt: o.alt };
  };
  const EJEMPLOS_RIG = [
    { nivel: 1, titulo: 'El tablón solo',
      figura: est(figTablon({ Pb: 200, NA: 100, NB: 100, tA: 'N_A = ?', tB: 'N_B = ?', k: 0.25, alt: 'Un tablón parejo de 200 N sobre dos caballetes, uno en cada punta.' })),
      enunciado: ['Un tablón parejo de ', pp('200 N'), ' está apoyado en dos caballetes, uno en cada punta. ¿Cuánto empuja cada caballete?'],
      datos: [D6.dos, D6.cg],
      solucion: [{ texto: 'El tablón es parejo, así que su peso actúa en el centro, a la misma distancia de los dos caballetes. Por simetría, los dos se lo reparten por igual:', ecuacion: [NA, ' = ', NB, ' = ', { frac: [pp('200'), '2'] }, ' = ', pn('100 N')] }],
      respuesta: ['Cada uno, ', pn('100 N')] },
    { nivel: 1, titulo: '¿Dónde actúa el peso?',
      figura: est(figBarraSimple({ cotas: [{ de: [40, 128], a: [280, 128], lado: 1, sep: 30, texto: '3 m' }], textos: [{ x: 160, y: 60, texto: 'P_b: ¿dónde?', ancla: 'middle', color: 'h' }], piso: false, alt: 'Una barra pareja de 3 m.' })),
      enunciado: ['Una barra pareja mide 3 m. ¿A qué distancia de una punta actúa su peso?'],
      datos: [D6.cg],
      solucion: [{ texto: 'Como la barra es pareja, su peso actúa en su centro, a la mitad del largo:', ecuacion: ['3 ÷ 2 = 1,5 m'] }],
      respuesta: [neg('A 1,5 m de cada punta')] },
    { nivel: 1, titulo: 'El torque del peso propio',
      figura: est(figBarraSimple({ extra: [{ tipo: 'nudo', en: [40, 120] }], flechas: [{ de: [160, 126], ang: 270, largo: 40, color: 'h', texto: 'P_b = 100 N', rumbo: [1, 0.4] }], cotas: [{ de: [40, 112], a: [160, 112], lado: -1, sep: 16, texto: '1 m' }], piso: false,
        textos: [{ x: 40, y: 96, texto: 'eje', ancla: 'middle', peso: 400 }], alt: 'Una barra pareja de 2 m y 100 N, con el eje en una punta.' })),
      enunciado: ['Una barra pareja de 2 m pesa ', pp('100 N'), '. ¿Qué torque hace su peso respecto de una de sus puntas?'],
      datos: [D6.cg, D6.tau],
      solucion: [{ texto: 'El peso de la barra actúa en su centro, a 1 m de la punta, y es perpendicular a la barra: su brazo es 1 m.', ecuacion: ['τ = 100 · 1 = 100 N·m'] }],
      respuesta: [neg('τ = 100 N·m')] },
    { nivel: 1, titulo: 'La caja en el medio',
      figura: est(figBarraSimple({ apoyos: [48, 272], extra: [{ tipo: 'caja', x: 160, y: 115, w: 50, h: 34, texto: '400 N' }], flechas: [{ de: [48, 115], ang: 90, largo: 30, color: 'f', texto: 'N_A = ?', rumbo: [0, -1] }, { de: [272, 115], ang: 90, largo: 30, color: 'f', texto: 'N_B = ?', rumbo: [0, -1] }],
        alt: 'Una barra liviana con una caja de 400 N en el medio, sobre dos apoyos.' })),
      enunciado: ['Una barra liviana, sobre dos apoyos en sus puntas, sostiene una caja de 400 N justo en el medio. ¿Cuánto empuja cada apoyo?'],
      datos: [D6.dos],
      solucion: [{ texto: 'La barra no pesa y la caja está a la misma distancia de los dos apoyos, así que, por simetría, cada uno sostiene la mitad:', ecuacion: [NA, ' = ', NB, ' = ', pn('200 N')] }],
      respuesta: ['Cada uno, ', pn('200 N')] },
    { nivel: 1, titulo: 'La caja cerca de A',
      figura: est(figBarraSimple({ apoyos: [48, 272], extra: [{ tipo: 'caja', x: 120, y: 115, w: 44, h: 30, texto: '300 N' }], flechas: [{ de: [272, 115], ang: 90, largo: 26, color: 'f', texto: 'N_B = ?', rumbo: [0, -1] }],
        cotas: [{ de: [48, 128], a: [120, 128], lado: 1, sep: 30, texto: '1 m' }, { de: [48, 128], a: [272, 128], lado: 1, sep: 50, texto: '3 m' }], alto: 210, alt: 'Una barra liviana de 3 m con una caja de 300 N a 1 m del apoyo A.' })),
      enunciado: ['Una barra liviana de 3 m descansa en dos apoyos, A y B, en sus puntas. Una caja de 300 N está a 1 m de A. ¿Cuánto empuja B?'],
      datos: [D6.dos, D6.tau],
      solucion: [{ texto: ['Se toman torques respecto de A, porque ahí ', NA, ' no hace torque. La caja, a 1 m, se equilibra con ', NB, ', a 3 m:'], ecuacion: [NB, ' · 3 = 300 · 1   →   ', NB, ' = ', pn('100 N')] }],
      respuesta: [NB, ' = ', pn('100 N')] },
    { nivel: 2, titulo: 'El pintor cerca de A',
      figura: est(figTablon({ Pb: 200, pintor: 1, Pp: 600, NA: 550, NB: 250, tA: 'N_A = ?', tB: 'N_B', cotas: [[0, 1, '1 m', 30]], alt: 'El tablón de 200 N con el pintor de 600 N a 1 m del caballete A.' })),
      enunciado: ['El tablón parejo del pintor mide 4 m y pesa 200 N; está sobre dos caballetes en sus puntas. El pintor, de 600 N, se para a 1 m de A. ¿Cuánto empuja A?'],
      datos: [D6.dos, D6.cg, D6.tau],
      solucion: [
        { texto: ['Se toman torques respecto de B, porque ahí ', NB, ' no hace torque. El tablón está a 2 m de B, y el pintor, a 3 m:'], ecuacion: [NA, ' · 4 = 200 · 2 + 600 · 3 = 2200'] },
        { texto: 'Se despeja lo que empuja A. Sale más que la mitad del peso total porque el pintor está más cerca de A:', ecuacion: [NA, ' = ', { frac: ['2200', '4'] }, ' = ', pn('550 N')] },
      ],
      respuesta: [NA, ' = ', pn('550 N')] },
    { nivel: 2, titulo: 'Un tablón más largo',
      figura: est(Object.assign(figTablon({ Pb: 300, pintor: 3.2, Pp: 500, NB: 550, tB: 'N_B = ?', tPb: 'P_b = 300 N', cotas: [[0, 3.2, '4 m', 30]] }), { alt: 'Un tablón de 5 m y 300 N con el pintor de 500 N a 4 m del caballete A.' })),
      enunciado: ['Un tablón parejo de 5 m y 300 N está sobre dos caballetes en sus puntas. Un pintor de 500 N se para a 4 m de A. ¿Cuánto empuja B?'],
      datos: [D6.dos, D6.cg, D6.tau],
      solucion: [
        { texto: ['Se toman torques respecto de A, donde ', NA, ' no hace torque. El peso del tablón va en su centro, a 2,5 m de A:'], ecuacion: [NB, ' · 5 = 300 · 2,5 + 500 · 4 = 2750'] },
        { texto: 'Se despeja lo que empuja B, que carga más porque el pintor está más cerca de él:', ecuacion: [NB, ' = ', { frac: ['2750', '5'] }, ' = ', pn('550 N')] },
      ],
      respuesta: [NB, ' = ', pn('550 N')] },
    { nivel: 2, titulo: 'Un solo caballete',
      figura: est({ alto: 210, piso: { y: 198 }, objetos: [{ tipo: 'barra', de: [40, 145], a: [290, 145], grosor: 10 }, { tipo: 'caballete', x: 90, y: 150, alto: 48 }, { tipo: 'caja', x: 50, y: 140, w: 30, h: 30, texto: '?' }],
        flechas: [{ de: [165, 150], ang: 270, largo: 30, color: 'h', texto: 'P_b = 300 N', rumbo: [1, -0.2] }], cotas: [{ de: [40, 135], a: [90, 135], lado: -1, sep: 40, texto: '1 m' }, { de: [40, 135], a: [290, 135], lado: -1, sep: 64, texto: '5 m' }],
        alt: 'Un tablón de 5 m y 30 kg sobre un caballete a 1 m de su punta A, con una carga en A.' }),
      enunciado: ['Un tablón parejo de 5 m y 30 kg está sobre un solo caballete, a 1 m de su punta A. ¿Qué masa hay que poner en A para que quede horizontal?'],
      datos: [D.peso, D6.cg, D6.tau, D5.eq],
      solucion: [
        { texto: 'El peso del tablón, 300 N, va en su centro, a 2,5 m de A. Queda a 2,5 − 1 = 1,5 m del caballete, del otro lado.' },
        { texto: 'Se toman torques respecto del caballete, que es el eje. El peso en A, a 1 m, tiene que igualar el torque del tablón:', ecuacion: [P, ' · 1 = 300 · 1,5   →   ', P, ' = ', pp('450 N'), ', o sea 45 kg'] },
      ],
      respuesta: [neg('45 kg')] },
    { nivel: 2, titulo: 'Dónde apoyar la barra',
      figura: est(figBarraSimple({ extra: [{ tipo: 'caja', x: 52, y: 115, w: 24, h: 26, texto: '3 kg' }, { tipo: 'caja', x: 268, y: 115, w: 24, h: 26, texto: '1 kg' }], cotas: [{ de: [40, 128], a: [280, 128], lado: 1, sep: 30, texto: '2 m' }], piso: false,
        textos: [{ x: 160, y: 60, texto: 'el apoyo: ¿dónde?', ancla: 'middle' }], alt: 'Una barra liviana de 2 m con 3 kg en una punta y 1 kg en la otra.' })),
      enunciado: ['Una barra liviana de 2 m tiene 3 kg en una punta y 1 kg en la otra. ¿A qué distancia de los 3 kg hay que apoyarla para que quede horizontal?'],
      datos: [D.peso, D6.tau, D5.eq],
      solucion: [
        { texto: 'Si el apoyo está a d de los 3 kg, el otro peso queda a 2 − d. Los torques respecto del apoyo se igualan:', ecuacion: ['30 · d = 10 · (2 − d)'] },
        { texto: 'Se despeja d. Queda más cerca de los 3 kg, porque el peso mayor necesita menos brazo:', ecuacion: ['40 · d = 20   →   d = 0,5 m'] },
      ],
      respuesta: [neg('A 0,5 m de los 3 kg')] },
    { nivel: 2, titulo: 'La viga del letrero',
      figura: est({ alto: 200, paredes: [{ x: 30, y0: 60, y1: 190, lado: -1 }], techo: { y: 20, x0: 230, x1: 310 }, objetos: [{ tipo: 'barra', de: [30, 140], a: [270, 140], grosor: 10 }, { tipo: 'cuerda', de: [270, 135], a: [270, 20] }],
        flechas: [{ de: [270, 120], ang: 90, largo: 40, color: 'o', texto: 'T = ?', rumbo: [-1, -0.3] }, { de: [150, 146], ang: 270, largo: 40, color: 'h', texto: 'P_b = 100 N', rumbo: [1, 0.4] }, { de: [44, 132], ang: 90, largo: 40, color: 'f', texto: 'R', rumbo: [1, -0.3] }],
        alt: 'Una viga pareja de 100 N, con una bisagra en la pared y un cable vertical en la otra punta.' }),
      enunciado: ['Una viga pareja de 100 N sale horizontal de una pared, donde tiene una bisagra. En su otra punta la sostiene un cable vertical. ¿Cuánto jala el cable?'],
      datos: [D6.dos, D6.cg, D6.tau, D6.bisagra],
      solucion: [
        { texto: 'Se toman torques respecto de la bisagra, para que su fuerza R no cuente. El peso de la viga va en su centro, a la mitad del largo, y el cable jala en la punta:', ecuacion: [T, ' · L = 100 · ', { frac: ['L', '2'] }] },
        { texto: 'El largo aparece a los dos lados y se cancela, así que no hace falta conocerlo:', ecuacion: [T, ' = ', pj('50 N'), ', y la bisagra sostiene los otros 50 N'] },
      ],
      respuesta: [T, ' = ', pj('50 N')] },
    { nivel: 3, titulo: 'La escalera en la pared',
      figura: est({ alto: 252, piso: { y: 214 }, paredes: [{ x: 280, y0: 40, y1: 214, lado: 1 }], objetos: [{ tipo: 'escalera', de: [172, 214], a: [280, 70], peldanos: 9 }, { tipo: 'persona', x: 253, y: 106, alto: 56, mano: [268, 84] }],
        flechas: [{ de: [272, 70], ang: 180, largo: 40, color: 'f', texto: 'N_p', rumbo: [-1, -0.3] }, { de: [226, 142], ang: 270, largo: 22, color: 'h', texto: '200 N', rumbo: [1, 0.2] }, { de: [172, 214], ang: 90, largo: 70, color: 'f', texto: 'N', rumbo: [-1, -0.2] }, { de: [172, 214], ang: 0, largo: 40, color: 'i', texto: 'f = ?', rumbo: [0.2, 1] }],
        angulos: [{ c: [172, 214], de: 0, a: 53, r: 30, texto: '53°' }], textos: [{ x: 8, y: 30, texto: 'persona: 600 N, a 3 m del pie', ancla: 'start', peso: 400 }],
        alt: 'Una escalera de 4 m y 200 N apoyada en una pared lisa, a 53° del piso, con una persona de 600 N a 3 m del pie.' }),
      enunciado: ['Una escalera pareja de 4 m y 200 N se apoya en una pared lisa, a 53° del piso. Una persona de 600 N sube hasta 3 m del pie. ¿Con cuánta fuerza la frena el piso?'],
      alternativas: ['800 N', '412,5 N', '75 N', '733,33 N', '600 N'],
      datos: [D6.dos, D6.cg, D6.tau, D6.pared, D2.trig],
      solucion: [
        { texto: 'Se toman torques respecto del pie, donde la normal y el rozamiento del piso no hacen torque. Los pesos son verticales, así que su brazo es horizontal; la pared empuja de lado, y su brazo es vertical:', ecuacion: [sub(N, 'p'), ' · 4 · sen 53° = 200 · 2 · cos 53° + 600 · 3 · cos 53°'] },
        { texto: 'Con sen 53° = 4/5 y cos 53° = 3/5 se despeja lo que empuja la pared:', ecuacion: [sub(N, 'p'), ' · 3,2 = 240 + 1080   →   ', sub(N, 'p'), ' = 412,5 N'] },
        { texto: ['La pared empuja de lado y la escalera no se desliza, así que el piso la frena con lo mismo: ', fr, ' = ', pr('412,5 N'), '.'] },
        { texto: ['La ', neg('A'), ' da la normal del piso, que es lo que sostiene hacia arriba. La ', neg('C'), ' olvida a la persona. La ', neg('D'), ' cambia el seno por el coseno, y la ', neg('E'), ' da el peso de la persona.'] },
      ],
      respuesta: [neg('B'), ', ', pr('412,5 N')] },
    { nivel: 3, titulo: 'El antebrazo y la pesa',
      figura: est({ alto: 190, objetos: [{ tipo: 'barra', de: [50, 120], a: [270, 120], grosor: 14 }, { tipo: 'nudo', en: [50, 120] }, { tipo: 'caja', x: 276, y: 140, w: 30, h: 26, texto: '5 kg' }],
        flechas: [{ de: [81, 112], ang: 90, largo: 64, color: 'o', texto: 'bíceps', rumbo: [1, -0.2] }, { de: [144, 128], ang: 270, largo: 16, color: 'h', texto: '15 N', rumbo: [1, 0.4] }, { de: [262, 142], ang: 270, largo: 26, color: 'h', texto: '50 N', rumbo: [-1, 0.2] }, { de: [50, 128], ang: 270, largo: 40, color: 'f', texto: 'R = ?', rumbo: [1, 0.4] }],
        cotas: [{ de: [50, 106], a: [81, 106], lado: -1, sep: 8, texto: '5 cm' }], textos: [{ x: 8, y: 22, texto: 'antebrazo: 15 N a 15 cm; pesa a 35 cm', ancla: 'start', peso: 400 }],
        alt: 'El antebrazo horizontal: el codo, el bíceps a 5 cm, el peso del antebrazo a 15 cm y la pesa de 5 kg a 35 cm.' }),
      enunciado: ['Sostienes una pesa de 5 kg con el antebrazo horizontal, a 35 cm del codo. El antebrazo pesa 15 N, con su centro a 15 cm. El bíceps jala vertical a 5 cm. ¿Con qué fuerza empuja el codo?'],
      alternativas: ['395 N', '460 N', '330 N', '65 N', '300 N'],
      datos: [D.peso, D6.dos, D6.tau, D6.bisagra],
      solucion: [
        { texto: 'Se toman torques respecto del codo, donde su fuerza no hace torque. El bíceps, a 5 cm, equilibra el antebrazo y la pesa:', ecuacion: [F, ' · 5 = 15 · 15 + 50 · 35 = 1975   →   ', F, ' = ', pj('395 N')] },
        { texto: 'Ahora las fuerzas verticales: el bíceps sube 395 N y los pesos bajan 65 N. Para que sumen cero, el codo empuja hacia abajo lo que sobra:', ecuacion: ['R = 395 − 65 = ', pn('330 N')] },
        { texto: ['La ', neg('A'), ' da la fuerza del bíceps, no la del codo. La ', neg('B'), ' suma los pesos en vez de restarlos. La ', neg('D'), ' da solo los pesos, y la ', neg('E'), ' olvida el peso del antebrazo.'] },
      ],
      respuesta: [neg('C'), ', ', pn('330 N')] },
    { nivel: 3, titulo: 'Caminar hasta la punta',
      figura: est(figTablon({ xB: 3, Pb: 300, tPb: 'P_b = 300 N', pintor: 3.3, Pp: 600, tPp: '600 N', NA: 1e-9, tA: 'N_A', cotas: [[3, 4, '1 m', 30], [0, 3, '3 m', 30]], alt: 'Un tablón de 4 m y 300 N sobre los caballetes A, en una punta, y B, a 3 m; el pintor camina más allá de B.' })),
      enunciado: ['Un tablón parejo de 4 m y 300 N se apoya en A, una punta, y en B, a 3 m de A. ¿Cuánto puede pasar de B un pintor de 600 N sin que el tablón se levante?'],
      alternativas: ['1 m', '0 m', '0,25 m', '2 m', '0,5 m'],
      datos: [D6.dos, D6.cg, D6.tau],
      solucion: [
        { texto: 'A punto de levantarse, el tablón deja de apretar A, y A ya no empuja: el tablón gira sobre B. Su peso está a 2 m de A, es decir, 1 m antes de B.' },
        { texto: 'Respecto de B, el torque del pintor, más allá de B, tiene que igualar al del tablón:', ecuacion: ['600 · s = 300 · 1   →   s = 0,5 m'] },
        { texto: ['La ', neg('A'), ' cree que llega a la punta. La ', neg('B'), ' cree que se levanta apenas pasa B. La ', neg('C'), ' da al tablón 0,5 m de brazo, y la ', neg('D'), ' divide al revés.'] },
      ],
      respuesta: [neg('E'), ', 0,5 m'] },
    { nivel: 3, titulo: 'La viga y el cable inclinado',
      figura: est({ alto: 200, paredes: [{ x: 30, y0: 10, y1: 190, lado: -1 }], objetos: [{ tipo: 'barra', de: [30, 150], a: [270, 150], grosor: 10 }, { tipo: 'cuerda', de: [270, 146], a: [30, 7.4] }],
        flechas: [{ de: [270, 146], ang: 150, largo: 60, color: 'o', texto: 'T = ?', rumbo: [0.3, -1] }, { de: [150, 156], ang: 270, largo: 30, color: 'h', texto: 'P_b = 100 N', rumbo: [1, 0.4] }],
        angulos: [{ c: [270, 150], de: 150, a: 180, r: 34, texto: '30°' }], textos: [{ x: 38, y: 176, texto: 'bisagra', ancla: 'start', peso: 400 }], alt: 'Una viga pareja de 100 N con una bisagra en la pared y un cable desde su punta a la pared, a 30° de la viga.' }),
      enunciado: ['Una viga pareja de 100 N sale horizontal de una pared, con una bisagra. Un cable va de su otra punta a la pared y forma 30° con la viga. ¿Cuánto jala el cable?'],
      alternativas: ['50 N', '57,74 N', '200 N', '100 N', '25 N'],
      datos: [D6.dos, D6.cg, D5.tau, D5.brazo, D2.trig30],
      solucion: [
        { texto: 'Se toman torques respecto de la bisagra. El cable va inclinado, así que su brazo es L · sen 30°; el peso actúa en el centro, con brazo L/2:', ecuacion: [T, ' · L · ', { frac: ['1', '2'] }, ' = 100 · ', { frac: ['L', '2'] }] },
        { texto: 'El largo se cancela. El cable jala más que la mitad del peso porque su brazo es corto:', ecuacion: [T, ' = ', pj('100 N')] },
        { texto: ['La ', neg('A'), ' olvida el seno. La ', neg('B'), ' usa el coseno. La ', neg('C'), ' pone el peso en la punta, y la ', neg('E'), ' multiplica por sen 30° en vez de dividir: 50 · ½.'] },
      ],
      respuesta: [neg('D'), ', ', pj('100 N')] },
    { nivel: 3, titulo: 'El centro de la escoba',
      figura: est({ alto: 170, objetos: [{ tipo: 'escoba', de: [300, 90], a: [24, 90] }, { tipo: 'apoyo', x: 112, y: 98, alto: 18 }], cotas: [{ de: [24, 80], a: [112, 80], lado: -1, sep: 16, texto: '0,8 m' }, { de: [24, 104], a: [300, 104], lado: 1, sep: 30, texto: '2 m' }],
        textos: [{ x: 24, y: 60, texto: 'cepillo', ancla: 'start', peso: 400 }], alt: 'Una escoba de 2 m, horizontal y quieta sobre un apoyo a 0,8 m de la punta del cepillo.' }),
      enunciado: ['Una escoba de 2 m queda horizontal y quieta sobre un solo apoyo, a 0,8 m de la punta del cepillo. ¿Dónde está su centro de gravedad?'],
      alternativas: ['Sobre el apoyo, a 0,8 m', 'A 1,2 m de la punta del cepillo', 'A 0,4 m de la punta del cepillo', 'No se sabe sin pesarla', 'En el medio, a 1 m'],
      datos: [D6.dos, D6.tau],
      solucion: [
        { texto: 'Solo la sostiene el apoyo, que empuja justo en ese punto. Si el peso actuara a un lado, haría un torque que nadie equilibra y la escoba giraría. Por eso el peso pasa por el apoyo: su brazo es cero.' },
        { texto: ['La ', neg('E'), ' la cree pareja, pero el cepillo pesa más. La ', neg('B'), ' mide desde la otra punta. La ', neg('C'), ' toma la mitad de 0,8 m, y la ', neg('D'), ' no usa que la escoba está quieta.'] },
      ],
      respuesta: [neg('A'), ', sobre el apoyo'] },
  ];

  const rigido = {
    id: 'cuerpo-rigido',
    titulo: 'Equilibrio del cuerpo rígido',
    pregunta: '¿Cuánto sostiene cada caballete del tablón del pintor?',
    temas: ['Equilibrio del cuerpo rígido', 'Torque'],
    pieza: 'fis-estatica',
    aprendizaje: 'Un cuerpo rígido quieto cumple dos cosas: sus fuerzas suman cero y sus torques suman cero. Su peso actúa en su centro de gravedad.',
    actividad: 'Mover al pintor por el tablón apoyado en dos caballetes.',
    lee: {
      tarjetas: [
        { titulo: 'El tablón del pintor', texto: 'Un pintor trabaja sobre un tablón apoyado en dos caballetes. El tablón no se dobla, y por eso se lo llama cuerpo rígido. A diferencia del nudo, que era un punto, el tablón puede girar: para que esté en equilibrio, no basta que no se traslade, tampoco debe girar.',
          dibujo: est(figTablon({ pintor: 2, alt: 'El tablón del pintor sobre dos caballetes, A y B.' })) },
        { titulo: 'El peso del tablón', texto: 'El tablón también pesa. Para las cuentas, todo su peso se puede poner en un solo punto, su centro de gravedad; si el tablón es parejo, ese punto está en su centro. Cada caballete lo empuja hacia arriba con una fuerza de reacción.' },
        { titulo: 'Qué mirar al jugar', texto: ['Mueve al pintor y mira las dos flechas de los caballetes, ', NA, ' y ', NB, '. Ojo: aquí R será la fuerza de una bisagra; en Vectores, R⃗ era la resultante.'] },
      ],
    },
    ejemplos: EJEMPLOS_RIG,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'El tablón del pintor, de 4 m y 200 N, se apoya en sus puntas en los caballetes A y B. El pintor: 600 N.',
      mision: {
        texto: 'Lleva al pintor hasta que el caballete B aguante 550 N.',
        logrado: val => Math.abs(NBde(val.x) - 550) < 1e-9,
        bien: 'Coincide: el pintor está a 3 m de A, y B, más cerca, carga más.',
      },
      voz: 'Mueve al pintor. ¿Qué caballete carga más?',
      leyenda: [
        { s: [vec(NA), ' y ', vec(NB)], t: 'lo que empuja cada caballete' },
        { s: [vec(sub(P, 'b'))], t: 'el peso del tablón, en su centro' },
        { s: 'x', t: 'distancia del pintor al caballete A' },
      ],
      controles: [{ id: 'x', etiqueta: 'Pintor, x', min: 0.5, max: 3.5, paso: 0.5, inicio: 1, unidad: 'm', decimales: 1 }],
      dibujo: juego6,
      lectura: val => ['A empuja ', pn(N_(NAde(val.x))), ' y B, ', pn(N_(NBde(val.x))), ': suman ', pp('800 N')],
      resumen: { x: 2 },
      minimo: 3,
    },
    predice: {
      pregunta: 'El pintor se para justo encima del caballete B. ¿Cuánto empuja el caballete A?',
      datos: ['El tablón pesa 200 N, es parejo y mide 4 m.', 'El pintor pesa 600 N.'],
      opciones: [
        { id: 'c', texto: '100 N', correcta: true },
        { id: 'cero', texto: '0 N', error: 'RG-SIN-PESO', siFuera: 'Es cierto que el pintor queda entero sobre B, y A no carga nada de él. Pero el tablón también pesa, y su peso actúa en el centro, entre los dos caballetes: A sostiene una parte.' },
        { id: 'mitad', texto: '400 N', error: 'RG-MITAD', siFuera: 'Eso pasaría si el pintor estuviera en el medio, a la misma distancia de los dos. Está justo sobre B, así que B carga todo su peso, y A solo comparte el tablón.' },
        { id: 'todo', texto: '200 N', error: 'RG-TODO', siFuera: 'A sí sostiene parte del tablón, pero no todo. El peso del tablón actúa en su centro, a la misma distancia de A y de B, así que los dos se lo reparten.' },
      ],
      dibujo: est(PRED6),
      revelar: est(REVELA6),
      coincide: 'Coincide: A sostiene solo la mitad del tablón, 100 N; B, el pintor y la otra mitad.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: MIRA6,
      pasos: [
        { estado: { corte: 0 }, texto: 'El pintor está a 3 m de A. El peso del tablón actúa en su centro, a 2 m de A.' },
        { estado: { corte: 1 }, texto: ['Se toman torques respecto de A, porque ahí ', NA, ' no hace torque: su brazo es cero. Así queda una sola incógnita, ', NB, '.'], ecuacion: [NB, ' · 4 = 200 · 2 + 600 · 3   →   ', NB, ' = ', pn('550 N')] },
        { estado: { corte: 2 }, texto: 'Las fuerzas verticales también suman cero: entre los dos caballetes sostienen 800 N, y A pone lo que falta.', ecuacion: [NA, ' = 800 − 550 = ', pn('250 N')] },
        { estado: { corte: 3 }, texto: 'Si se toman torques respecto de B, también suman cero. Vale con cualquier punto, y sirve para comprobar.', ecuacion: ['250 · 4 = 200 · 2 + 600 · 1 = 1000'] },
        { estado: { corte: 4 }, texto: 'Con el pintor sobre B, su peso no hace torque respecto de B, y A sostiene solo la mitad del peso del tablón.', ecuacion: [NA, ' · 4 = 200 · 2   →   ', NA, ' = ', pn('100 N')] },
      ],
    },
    regla: {
      texto: 'Un cuerpo rígido, uno que no se dobla, está en equilibrio si cumple dos cosas: las fuerzas suman cero, para que no se traslade, y los torques respecto de un mismo punto también suman cero, para que no gire. El peso de un cuerpo parejo actúa en su centro.',
      ecuacion: [...SF, ' = 0', '   ·   ', 'Στ = 0'],
      condicion: 'todos los torques se toman respecto de un mismo punto, el que elijas; conviene uno por donde pasa una fuerza desconocida, porque ahí no hace torque. Si mezclas puntos, la suma deja de valer.',
      dibujo: est(Object.assign({}, MIRA6, MIRA6.cortes[2], { cortes: undefined })),
    },
    // Así se resuelve: el tablón con un balde (semillas pares) y la barra sobre un solo caballete (impares); «Ahora tú»
    // trae el pintor, la carga que equilibra, el voladizo y la escalera.
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 1) {
          const L = 4, Pb = r.de([200, 400]), a = r.de([0.5, 1]), m = Pb * (L / 2 - a) / a / G;
          return {
            enunciado: [`Una barra pareja de ${L} m y ${Pb} N está sobre un solo apoyo, a ${f(a)} m de su punta A. ¿Qué masa hay que colgar en A para que quede horizontal?`],
            datos: [D.peso, D6.cg, D6.tau, D5.eq],
            dibujo: est(figBarraSimple({ apoyos: [40 + 60 * a], extra: [{ tipo: 'caja', x: 52, y: 115, w: 24, h: 24, texto: '?' }], flechas: [{ de: [160, 126], ang: 270, largo: 34, color: 'h', texto: `P_b = ${N_(Pb)}`, rumbo: [1, 0.4] }],
              cotas: [{ de: [40, 112], a: [40 + 60 * a, 112], lado: -1, sep: 20, texto: `${f(a)} m` }, { de: [40, 112], a: [280, 112], lado: -1, sep: 44, texto: `${L} m` }], textos: [{ x: 40, y: 150, texto: 'A', ancla: 'middle' }] })),
            pasos: [
              { tipo: 'pide', texto: 'Piden la masa que hay que colgar en A para que la barra quede horizontal sobre el apoyo.' },
              { tipo: 'datos', texto: [`La barra pesa `, pp(N_(Pb)), `, en su centro: a ${f(L / 2)} − ${f(a)} = ${f(L / 2 - a)} m del apoyo. La carga va a ${f(a)} m del otro lado.`] },
              { tipo: 'regla', texto: 'La barra no gira, así que los torques respecto del apoyo se igualan: el de la carga, de un lado, y el del peso de la barra, del otro.', ecuacion: ['Στ = 0'] },
              { tipo: 'cuentas', texto: 'Se igualan los torques, se despeja el peso de la carga y se divide entre g para tener su masa.', ecuacion: [P, ` · ${f(a)} = ${Pb} · ${f(L / 2 - a)}   →   `, P, ` = ${f(m * G)} N   →   m = ${f(m)} kg`] },
              { tipo: 'sentido', texto: 'La carga va cerca del apoyo y su brazo es corto, así que necesita mucho peso para igualar el torque de la barra.' },
            ],
            respuesta: [neg(`m = ${f(m)} kg`)],
          };
        }
        const Pb = r.de([100, 200]), Pc = r.de([150, 300]), xc = r.de([0.5, 1.5, 2.5]), L = 3, NBv = (Pb * L / 2 + Pc * xc) / L, NAv = Pb + Pc - NBv;
        return {
          enunciado: [`Un tablón parejo de ${L} m y ${Pb} N está sobre dos caballetes en sus puntas, A y B. Un balde de ${Pc} N está a ${f(xc)} m de A. ¿Cuánto empuja A?`],
          datos: [D6.dos, D6.cg, D6.tau],
          dibujo: est(figTablon({ L, Pb, tPb: `P_b = ${N_(Pb)}`, carga: { x: xc, P: Pc, texto: `${N_(Pc)}` }, NA: 0, tA: 'N_A = ?', NB: 0, tB: 'N_B', k: 0.12, cotas: [[0, xc, `${f(xc)} m`, 30]] })),
          pasos: [
            { tipo: 'pide', texto: ['Piden ', NA, ', lo que empuja el caballete A.'] },
            { tipo: 'datos', texto: [`El tablón pesa `, pp(N_(Pb)), ` y actúa en su centro, a ${f(L / 2)} m de A; el balde pesa `, pp(N_(Pc)), ` y está a ${f(xc)} m de A.`] },
            { tipo: 'regla', texto: ['Fuerzas y torques suman cero. Si se toman torques respecto de B, ', NB, ' no hace torque y queda una sola incógnita.'], ecuacion: ['Στ = 0'] },
            { tipo: 'cuentas', texto: 'Respecto de B, cada fuerza se multiplica por su distancia a B; la de A está a todo el largo.', ecuacion: [NA, ` · ${L} = ${Pb} · ${f(L / 2)} + ${Pc} · ${f(L - xc)}   →   `, NA, ' = ', pn(N_(NAv))] },
            { tipo: 'sentido', texto: `Entonces B empuja ${f(NBv)} N. Juntos suman ${f(Pb + Pc)} N, todo el peso, como piden las fuerzas.` },
          ],
          respuesta: [NA, ' = ', pn(N_(NAv))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4;
        if (k === 0) {
          const Pb = r.de([100, 200, 300]), Pp = r.de([500, 600, 700]), x = r.de([0.5, 1, 1.5, 2.5, 3]), L = 4, pideB = sm % 8 >= 4;
          const NBv = (Pb * 2 + Pp * x) / L, NAv = Pb + Pp - NBv, v = pideB ? NBv : NAv;
          return {
            pregunta: [`Un tablón parejo de 4 m y ${Pb} N está sobre dos caballetes en sus puntas, A y B. Un pintor de ${Pp} N se para a ${f(x)} m de A. ¿Cuánto empuja ${pideB ? 'B' : 'A'}?`],
            datos: [D6.dos, D6.cg, D6.tau],
            dibujo: est(figTablon({ Pb, pintor: x, Pp, tPb: `P_b = ${N_(Pb)}`, cotas: [[0, x, `${f(x)} m`, 30]], k: 0.07 })),
            opciones: opciones(v, [
              { id: 'sin', valor: pideB ? Pp * x / L : Pp * (L - x) / L, error: 'RG-SIN-PESO', siFuera: 'Los torques del pintor están bien, pero olvidaste el tablón. El tablón también pesa, y su peso actúa en el centro, a 2 m de cada caballete.' },
              { id: 'mitad', valor: (Pb + Pp) / 2, error: 'RG-MITAD', siFuera: 'Los caballetes sí se reparten el peso, pero por mitades solo si el pintor está en el medio. Si no, el más cercano a él carga más.' },
              { id: 'otro', valor: pideB ? NAv : NBv, error: 'RG-OTRO', siFuera: 'La cuenta está bien, pero esa es la fuerza del otro caballete. Fíjate cuál piden: el más cercano al pintor carga más.' },
              { id: 'todo', valor: Pb + Pp, error: 'RG-TODO', siFuera: 'Ese es el peso total, del tablón y del pintor. Pero lo sostienen dos caballetes, y cada uno pone solo una parte.' },
            ], N_),
            solucion: { texto: pideB ? ['Se toman torques respecto de A, donde ', NA, ' no hace torque. El tablón actúa en su centro, a 2 m.'] : ['Se toman torques respecto de B, donde ', NB, ' no hace torque. El tablón actúa en su centro, a 2 m.'], ecuacion: pideB ? [NB, ` · 4 = ${Pb} · 2 + ${Pp} · ${f(x)}   →   `, NB, ' = ', pn(N_(NBv))] : [NA, ` · 4 = ${Pb} · 2 + ${Pp} · ${f(L - x)}   →   `, NA, ' = ', pn(N_(NAv))] },
          };
        }
        if (k === 1) {
          // sin L = 4a: ahí la carga pesa lo mismo que el tablón, y los errores TQ-IGUAL y TQ-INV dan la correcta
          const { L, m, a } = elegir(r, () => { const c = { L: r.de([3, 4, 6]), m: r.de([10, 20, 30]), a: r.de([0.5, 1]) }; return c.L !== 4 * c.a && c; }), Pb = m * G, Pc = Pb * (L / 2 - a) / a;
          return {
            pregunta: [`Un tablón parejo de ${L} m y ${m} kg está sobre un solo caballete, a ${f(a)} m de su punta A. ¿Qué peso hay que poner en A para que quede horizontal?`],
            datos: [D.peso, D6.cg, D6.tau, D5.eq],
            opciones: opciones(Pc, [
              { id: 'pesos', valor: Pb * (L - 2 * a) / L, error: 'E1', siFuera: 'Buscaste un equilibrio, pero igualaste lo que pesa cada lado del tablón. En una palanca se igualan los torques: peso por distancia al caballete.' },
              { id: 'punta', valor: Pb * (L - a) / a, error: 'RG-PUNTA', siFuera: 'El brazo de la carga está bien, pero pusiste el peso del tablón en la otra punta. Un tablón parejo tiene su peso en el centro.' },
              { id: 'igual', valor: Pb, error: 'TQ-IGUAL', siFuera: 'La carga sí equilibra al tablón, pero no pesando lo mismo: sus brazos son distintos, así que sus pesos también.' },
              { id: 'inv', valor: Pb * a / (L / 2 - a), error: 'TQ-INV', siFuera: `Cambiaste los brazos: la carga por ${f(L / 2 - a)} m y el tablón por ${f(a)} m dan ${N_(Pb * a / (L / 2 - a))}. Cada peso va con el suyo: la carga, ${f(a)} m hasta el caballete, y el tablón, ${f(L / 2 - a)} m. Por eso la carga pesa ${a < L / 2 - a ? 'más' : 'menos'} que el tablón.` },
              { id: 'largo', valor: Pb * (L / 2) / a, error: 'RG-BRAZO', siFuera: 'Igualar torques está bien, pero el brazo del tablón se mide desde el caballete hasta su centro, no desde la punta.' },
            ], N_),
            solucion: { texto: `El peso del tablón actúa en su centro, a ${f(L / 2 - a)} m del caballete. Su torque se iguala con el de la carga, que está en A, a ${f(a)} m.`, ecuacion: [P, ` · ${f(a)} = ${Pb} · ${f(L / 2 - a)}   →   `, P, ' = ', pp(N_(Pc))] },
          };
        }
        if (k === 2) {
          const [Pb, Pp] = r.de([[200, 400], [200, 800], [150, 600], [400, 800], [300, 400]]), s = Pb * 1 / Pp;
          return {
            pregunta: [`Un tablón parejo de 4 m y ${Pb} N se apoya en A, una punta, y en B, a 3 m de A. ¿Cuánto puede pasar de B un pintor de ${Pp} N sin que el tablón se levante?`],
            datos: [D6.dos, D6.cg, D6.tau],
            dibujo: est(figTablon({ xB: 3, Pb, tPb: `P_b = ${N_(Pb)}`, pintor: 3.3, Pp, tPp: `${N_(Pp)}`, cotas: [[3, 4, '1 m', 30], [0, 3, '3 m', 30]], k: 0.07 })),
            opciones: opciones(s, [
              { id: 'punta', valor: 1, error: 'RG-PUNTA', siFuera: 'El pintor sí puede pasar de B, pero no hasta la punta. Antes de llegar, su torque respecto de B supera al del tablón, y el tablón gira.' },
              { id: 'inv', valor: Pp / Pb, error: 'TQ-INV', siFuera: 'Planteaste bien los torques respecto de B, pero dividiste al revés. La distancia es el torque del tablón entre el peso del pintor.' },
              { id: 'dos', valor: Pb * 2 / Pp, error: 'RG-BRAZO', siFuera: 'Igualar torques está bien, pero el brazo del tablón se mide desde B, el eje: su centro está 1 m antes de B, no 2 m.' },
              { id: 'mitad', valor: s / 2, error: 'TQ-MITAD', siFuera: 'La idea está bien, pero el brazo del tablón es 1 m entero, de su centro hasta B, no la mitad.' },
            ], v => `${f(v)} m`),
            solucion: { texto: 'A punto de levantarse, el tablón deja de apretar A y gira sobre B. Su peso está 1 m antes de B, y el pintor tiene que hacer el mismo torque del otro lado.', ecuacion: [`${Pp} · s = ${Pb} · 1   →   s = ${f(s)} m`] },
          };
        }
        // Nivel examen: la escalera en la pared lisa, con o sin persona (San Marcos 2021).
        const conP = sm % 8 >= 4;
        const { L, Pe, ang, Pp, sP, Np } = elegir(r, () => { const c = { L: r.de([4, 5]), Pe: r.de([100, 150, 200, 300]), ang: r.de([37, 53]), Pp: conP ? r.de([400, 600]) : 0 }; c.sP = c.Pp ? r.de([0.5, 0.75]) * c.L : 0;
          c.Np = (c.Pe * c.L / 2 * COS_(c.ang) + c.Pp * c.sP * COS_(c.ang)) / (c.L * SEN_(c.ang));
          const esEjemplo = c.L === 4 && c.Pe === 200 && c.ang === 53 && c.Pp === 600 && c.sP === 3;
          return exacto(c.Np) && exacto(c.sP) && !esEjemplo && c; });
        return {
          pregunta: [`Una escalera pareja de ${L} m y ${Pe} N está apoyada en una pared lisa y forma ${ang}° con el piso.${Pp ? ` Una persona de ${Pp} N sube hasta ${f(sP)} m del pie.` : ''} ¿Con cuánta fuerza la frena el piso?`],
          datos: [D6.dos, D6.cg, D6.tau, D6.pared, D2.trig],
          opciones: opciones(Np, [
            { id: 'normal', valor: Pe + Pp, error: 'RG-NORMAL', siFuera: 'Esa es la normal del piso, lo que sostiene hacia arriba. El rozamiento es la fuerza de lado, y tiene que igualar a lo que empuja la pared.' },
            { id: 'swap', valor: (Pe * L / 2 * SEN_(ang) + Pp * sP * SEN_(ang)) / (L * COS_(ang)), error: 'ST-SENCOS', siFuera: 'Los torques respecto del pie están bien planteados, pero cambiaste seno y coseno. Los pesos son verticales, así que su brazo es horizontal: la distancia por cos θ.' },
            { id: 'sinP', valor: Pp ? Pe * L / 2 * COS_(ang) / (L * SEN_(ang)) : Pe / 2, error: Pp ? 'RG-SIN-PESO' : 'RG-MITAD', siFuera: Pp ? 'La escalera está bien, pero falta la persona: su peso también hace torque respecto del pie, y la pared tiene que empujar más.' : 'Buscaste una parte del peso, pero no sale de partirlo en dos. Sale de igualar los torques respecto del pie.' },
            { id: 'peso', valor: Pe, error: 'N-MG', siFuera: 'Ese es el peso. El piso frena de lado, así que su rozamiento iguala a lo que empuja la pared, no al peso.' },
          ], N_),
          solucion: { texto: 'Se toman torques respecto del pie, donde las fuerzas del piso no hacen torque, y de ahí sale lo que empuja la pared. El piso frena de lado con esa misma fuerza.', ecuacion: [sub(N, 'p'), ` · ${L} · sen ${ang}° = ${Pe} · ${f(L / 2)} · cos ${ang}°${Pp ? ` + ${Pp} · ${f(sP)} · cos ${ang}°` : ''}   →   `, fr, ' = ', pr(N_(Np))] },
        };
      },
    },
  };

  // ======================= Laboratorio (juego libre, sin preguntas) =======================
  // Las tres mesas de antes, con sus ids y controles (un caso guardado sigue abriendo igual), dibujadas con fis-estatica.
  const PALANCA_LIBRE = [
    { id: 'm1', etiqueta: 'm izq.', min: 1, max: 4, paso: 1, inicio: 3, unidad: 'kg', decimales: 0 },
    { id: 'd1', etiqueta: 'd izq.', min: 0.5, max: 2, paso: 0.25, inicio: 1, unidad: 'm', decimales: 2 },
    { id: 'm2', etiqueta: 'm der.', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'kg', decimales: 0 },
    { id: 'd2', etiqueta: 'd der.', min: 0.5, max: 2, paso: 0.25, inicio: 1, unidad: 'm', decimales: 2, auto: { velocidad: 0.3, modo: 'rebota' } },
  ];
  const torquesDe = val => [val.m1 * G * val.d1, val.m2 * G * val.d2];
  const horizontal = val => { const [t1, t2] = torquesDe(val); return Math.abs(t1 - t2) < 1e-9; };
  const casiHorizontal = val => { const [t1, t2] = torquesDe(val); return Math.abs(t1 - t2) <= 1; };
  const mesaPalanca = val => { const [t1, t2] = torquesDe(val), inc = Math.abs(t1 - t2) < 1e-9 ? 0 : t1 > t2 ? 5 : -5;
    return est(figBarra({ inclina: inc, k: 0.6, medio: 2.2, cargas: [{ s: -val.d1, caja: `${val.m1} kg`, F: val.m1 * G, texto: `${val.m1 * G} N` }, { s: val.d2, caja: `${val.m2} kg`, F: val.m2 * G, texto: `${val.m2 * G} N` }],
      alt: `Una palanca con ${val.m1} kg a ${f(val.d1)} m del apoyo y ${val.m2} kg a ${f(val.d2)} m.` })); };
  const MS_L = 0.5, MK_L = 0.3;
  const roceDe = val => { const Nv = val.m * G, desliza = val.F > MS_L * Nv + 1e-9; return { desliza, f: desliza ? MK_L * Nv : val.F }; };
  const tensionDe = val => val.P / (2 * SEN_(val.ang));
  const laboratorio = [
    { id: 'palanca-libre', titulo: 'Palanca con los dos lados libres', pieza: 'fis-estatica',
      consigna: 'La masa de la derecha se corre sola por la barra. Pausa cuando quede horizontal, o elige las masas y sus distancias.',
      controles: PALANCA_LIBRE,
      dibujo: mesaPalanca,
      lectura: val => { const [t1, t2] = torquesDe(val); return [`τ: ${f(t1, 1)} N·m contra ${f(t2, 1)} N·m: `, Math.abs(t1 - t2) < 0.05 ? 'horizontal' : `baja la ${t1 > t2 ? 'izquierda' : 'derecha'}`]; },
      invitaciones: [
        { texto: 'Deja la barra horizontal con masas distintas a cada lado.', logrado: val => horizontal(val) && val.m1 !== val.m2, bien: 'Más masa más cerca, menos masa más lejos: lo que se iguala es el torque.' },
        { texto: 'Equilibra 4 kg de la izquierda con solo 1 kg a la derecha.', logrado: val => val.m1 === 4 && val.m2 === 1 && horizontal(val), bien: 'Un kilo equilibra cuatro si cuelga cuatro veces más lejos del apoyo.' },
        { texto: 'Haz que cada lado haga justo 40 N·m de torque.', logrado: val => torquesDe(val).every(t => Math.abs(t - 40) < 1e-9), bien: '4 kg a 1 m o 2 kg a 2 m: el mismo giro.' },
        { texto: 'Pausa la barra justo cuando quede horizontal.', logrado: val => casiHorizontal(val), bien: 'Ahí los dos torques se igualan: peso por brazo, igual a cada lado.', pista: 'Pausa cerca y ajusta d der. con − y +.' },
      ] },
    { id: 'caja-con-masa', titulo: 'Caja de masa variable', pieza: 'fis-estatica',
      consigna: 'Cambia la masa de la caja (μs = 0,5 y μk = 0,3) y empújala. ¿Dónde está el tope ahora?',
      controles: [
        { id: 'm', etiqueta: 'm', min: 2, max: 6, paso: 1, inicio: 4, unidad: 'kg', decimales: 0 },
        { id: 'F', etiqueta: 'F', color: 'c-o', min: 0, max: 36, paso: 2, inicio: 10, unidad: 'N', decimales: 0 },
      ],
      dibujo: val => { const r = roceDe(val); return est(figRoce({ cosa: { tipo: 'caja', w: 70, h: 50, texto: `${val.m} kg` }, fz: { P: val.m * G, N: val.m * G, F: val.F, f: r.f }, dcl: { titulo: 'DCL de la caja', k: 1 }, textos: [{ x: 8, y: 22, texto: r.desliza ? 'desliza →' : 'quieta', ancla: 'start' }] })); },
      lectura: val => { const r = roceDe(val); return [`${f(val.m, 0)} kg, `, F, ` = ${f(val.F, 0)} N: `, fr, ` = ${f(r.f, 0)} N, ${r.desliza ? 'desliza' : 'quieta'}`]; },
      invitaciones: [
        { texto: 'Con 6 kg, busca el mayor empuje que todavía no la mueve.', logrado: val => val.m === 6 && !roceDe(val).desliza && roceDe(Object.assign({}, val, { F: val.F + 2 })).desliza, bien: 'Hasta ahí el rozamiento copia tu empuje. Un poco más y cede.' },
        { texto: 'Haz que la caja de 2 kg deslice con el menor empuje.', logrado: val => val.m === 2 && roceDe(val).desliza && !roceDe(Object.assign({}, val, { F: val.F - 2 })).desliza, bien: 'Con 2 kg el tope es 10 N: la masa sube o baja el tope.' },
        { texto: 'Haz que el rozamiento valga justo 12 N con la caja deslizando.', logrado: val => roceDe(val).desliza && Math.abs(roceDe(val).f - 12) < 1e-9, bien: 'Al deslizar ya no copia tu empuje: queda fijo en μk por la normal.' },
      ] },
    { id: 'nudo-libre', titulo: 'El nudo y sus cuerdas', pieza: 'fis-estatica',
      consigna: 'El letrero cuelga de dos cables iguales. Cambia su peso y el ángulo, y compara lo que jala cada cable.',
      controles: [
        { id: 'P', etiqueta: 'P', color: 'c-h', min: 20, max: 50, paso: 10, inicio: 30, unidad: 'N', decimales: 0 },
        { id: 'ang', etiqueta: 'θ', min: 30, max: 60, paso: 1, inicio: 53, unidad: '°', decimales: 0 },
      ],
      dibujo: val => est(colgadoIgual(val.ang, val.P, { tT: `T = ${N_(tensionDe(val))}`, tT2: `T = ${N_(tensionDe(val))}`, tP: `P = ${N_(val.P)}` })),
      lectura: val => ['Cada cable jala ', pj(N_(tensionDe(val)))],
      invitaciones: [
        { texto: 'Haz que cada cable jale con lo mismo que pesa el letrero.', logrado: val => Math.abs(tensionDe(val) - val.P) < 1e-9, bien: 'A 30°, cada cable jala todo el peso. ¿Y si fueran verticales?' },
        { texto: 'Con 40 N, busca el ángulo que menos tensa los cables.', logrado: val => val.P === 40 && val.ang === 60, bien: 'Cables más parados sostienen mejor: casi todo su jalón va hacia arriba.' },
      ] },
  ];

  // Tabla de letras (propuesta §5): un solo significado en la unidad.
  const LETRAS = { F: 'una fuerza; sin subíndice, la de una mano', P: 'peso', P_b: 'peso de la barra', m: 'masa', g: 'aceleración de la gravedad, 10 m/s²',
    N: 'fuerza normal', N_A: 'fuerza del apoyo A', N_B: 'fuerza del apoyo B', N_p: 'fuerza de la pared', T: 'tensión', T_1: 'tensión del cable 1', T_2: 'tensión del cable 2', P_A: 'peso de Ana', P_B: 'peso de Beto', T_h: 'tensión de la cuerda horizontal',
    f: 'rozamiento', f_s: 'rozamiento estático', f_k: 'rozamiento cinético', 'μ_s': 'coeficiente de rozamiento estático', 'μ_k': 'coeficiente de rozamiento cinético',
    F_e: 'fuerza elástica', k: 'constante elástica', x: 'deformación del resorte', L_0: 'largo natural', L: 'largo', 'τ': 'torque', d: 'brazo de palanca',
    'θ': 'ángulo', R: 'reacción de una bisagra', F_x: 'componente horizontal de una fuerza', F_y: 'componente vertical de una fuerza' };

  return {
    unidad: 'fisica.estatica',
    version: '0.3.1',
    calidad: 2,
    estado: 'completa',
    colores: COLORES,
    notacion: { vectores: true, motivo: 'Las fuerzas son vectores: llevan flecha (F⃗, P⃗, N⃗) cuando se habla de la flecha; en las cuentas va su valor, sin flecha.' },
    letras: LETRAS,
    requiere: ['/nucleo/kit/piezas/fis-estatica.js'],
    glosario: [
      { termino: 'fuerza', simbolo: 'F', medida: 'N', formas: ['fuerza', 'fuerzas'],
        def: 'Empujón o jalón entre dos cuerpos. Es un vector: tiene valor, en newtons, y dirección.',
        simple: 'Un empujón o un jalón, como cuando abres una puerta.',
        ejemplos: ['Tu mano que empuja una puerta.', 'La Tierra que jala una manzana.', 'Un imán que atrae un clavo sin tocarlo.'],
        ver: ['peso', 'tercera ley de Newton'] },
      { termino: 'peso', simbolo: 'P', medida: 'N', formas: ['peso', 'pesos'],
        def: 'Fuerza con que la Tierra jala a un cuerpo hacia abajo: masa por g.',
        simple: 'Lo que la Tierra jala a algo hacia abajo: por eso tu mochila pesa.',
        ejemplos: ['Un costal de 25 kg pesa 250 N.', 'Una manzana de 0,1 kg pesa 1 N.', 'El peso apunta siempre hacia abajo, al centro de la Tierra.'],
        ver: ['masa'] },
      { termino: 'fuerza normal', simbolo: 'N', medida: 'N', formas: ['fuerza normal', 'fuerzas normales', 'normal', 'normales'],
        def: 'Empuje de una superficie sobre lo que se apoya en ella, perpendicular a la superficie.',
        simple: 'Lo que empuja la carpeta hacia arriba a tu cuaderno apoyado en ella.',
        ejemplos: ['El piso que empuja tus zapatos hacia arriba.', 'La pared que empuja la escalera apoyada en ella.', 'La carpeta que sostiene tu cuaderno.'],
        ver: ['peso'] },
      { termino: 'tercera ley de Newton', formas: ['tercera ley de Newton', 'tercera ley'],
        def: 'Si A le hace una fuerza a B, B le hace a A una fuerza igual y opuesta.',
        simple: 'Si empujas la pared, la pared te empuja a ti igual.',
        ejemplos: ['Empujas la pared y la pared te empuja.', 'La Tierra jala a la Luna y la Luna jala a la Tierra.', 'Al remar, empujas el agua hacia atrás y el agua empuja el bote hacia adelante.'],
        ver: ['fuerza'] },
      { termino: 'primera ley de Newton', formas: ['primera ley de Newton', 'primera ley'],
        def: 'Si las fuerzas sobre un cuerpo suman cero, sigue quieto o en línea recta a velocidad constante.',
        ejemplos: ['Un libro quieto en la mesa.', 'Una lámpara colgada que no se mueve.', 'Una caja que se arrastra a velocidad constante.'],
        ver: ['equilibrio'] },
      { termino: 'diagrama de cuerpo libre', formas: ['diagrama de cuerpo libre', 'diagramas de cuerpo libre', 'DCL'],
        def: 'Dibujo de un solo cuerpo, aislado, con todas las fuerzas que otros cuerpos le hacen.',
        ejemplos: ['El DCL de un libro en la mesa: su peso y la normal.', 'El DCL de una lámpara colgada: su peso y lo que jala el cable.', 'En el DCL no va lo que el cuerpo hace a otros.'],
        ver: ['fuerza'] },
      { termino: 'equilibrio', formas: ['equilibrio', 'equilibrios'],
        def: 'Estado en que las fuerzas sobre un cuerpo suman cero, y también sus torques: queda quieto o en MRU.',
        simple: 'Todo lo que empuja y jala se cancela, como en un letrero colgado.',
        ejemplos: ['Un nudo del que cuelga un letrero, quieto.', 'Un sube y baja horizontal, sin girar.', 'Una caja que se arrastra a velocidad constante.'],
        ver: ['primera ley de Newton', 'torque'] },
      { termino: 'tensión', simbolo: 'T', medida: 'N', formas: ['tensión', 'tensiones'],
        def: 'Fuerza con que una cuerda o un cable tirante jala, siempre a lo largo de él.',
        simple: 'Lo que jala una cuerda estirada, como la del balde que sacas del pozo.',
        ejemplos: ['La cuerda de un balde que cuelga del pozo.', 'Los cables de un puente colgante.', 'Una cuerda floja no jala: su tensión es cero.'],
        ver: ['polea'] },
      { termino: 'polea', formas: ['polea', 'poleas', 'polea fija', 'polea móvil'],
        def: 'Rueda por donde pasa una cuerda: la fija desvía el jalón; la móvil reparte la carga en dos tramos.',
        simple: 'Una rueda por donde pasa una cuerda, como la de un pozo.',
        ejemplos: ['La rueda del techo de una obra para subir baldes de mezcla.', 'La rueda de un pozo.', 'Una carga colgada de una polea móvil cuelga de dos tramos de cuerda.'],
        ver: ['tensión'] },
      { termino: 'rozamiento estático', simbolo: 'f_s', medida: 'N', formas: ['rozamiento estático'],
        def: 'Fuerza del piso que impide que algo empiece a deslizar sobre él.',
        simple: 'Lo que no deja que un ropero pesado empiece a deslizar.',
        ejemplos: ['El piso que no deja que se mueva un ropero pesado.', 'Lo que sostiene un libro quieto en una rampa.', 'Lo que permite caminar sin resbalar.'],
        ver: ['rozamiento cinético', 'coeficiente de rozamiento'] },
      { termino: 'rozamiento cinético', simbolo: 'f_k', medida: 'N', formas: ['rozamiento cinético'],
        def: 'Fuerza que frena algo que ya desliza; vale μk · N y no depende de cuánto lo empujes.',
        simple: 'Lo que frena algo mientras desliza, como cuando arrastras una caja por el piso.',
        ejemplos: ['Una caja que se arrastra por el piso.', 'Un trineo que baja por la arena.', 'Un borrador que se desliza por la carpeta.'],
        ver: ['rozamiento estático'] },
      { termino: 'coeficiente de rozamiento', simbolo: 'μ', formas: ['coeficiente de rozamiento', 'coeficientes de rozamiento', 'coeficiente', 'coeficientes'],
        def: 'Número sin unidad que dice qué tan áspero es el contacto entre dos superficies.',
        simple: 'Qué tan áspero es el contacto: alto en cemento seco, bajo en hielo.',
        ejemplos: ['Una zapatilla en cemento seco: un μ alto.', 'Un zapato en el hielo: un μ muy bajo.', 'Con μ = 0,5 y N = 40 N, el tope es 20 N.'],
        ver: ['fuerza normal'] },
      { termino: 'plano inclinado', formas: ['plano inclinado', 'planos inclinados', 'rampa', 'rampas'],
        def: 'Superficie plana que forma un ángulo con la horizontal.',
        simple: 'Una superficie en subida, como la de una silla de ruedas.',
        ejemplos: ['La rampa para subir una silla de ruedas.', 'La tabla para subir costales a un camión.', 'Un tobogán recto.'],
        ver: ['peso'] },
      { termino: 'fuerza elástica', simbolo: 'F_e', medida: 'N', formas: ['fuerza elástica', 'fuerzas elásticas'],
        def: 'Fuerza que hace un resorte estirado o encogido, en contra de su deformación.',
        simple: 'Lo que jala un resorte o una liga cuando la estiras.',
        ejemplos: ['El resorte de un lapicero que empuja la punta hacia adentro.', 'El colchón que empuja hacia arriba.', 'La liga estirada que jala tus dedos.'],
        ver: ['constante elástica', 'deformación'] },
      { termino: 'constante elástica', simbolo: 'k', medida: 'N/m', formas: ['constante elástica', 'constantes elásticas'],
        def: 'Qué tan duro es un resorte: cuánta fuerza hace por cada metro que se deforma.',
        simple: 'Qué tan duro es un resorte: uno de colchón más que uno de lapicero.',
        ejemplos: ['20 N lo estiran 0,04 m: k = 500 N/m.', 'El resorte de un auto tiene una k muy grande.', 'El de un lapicero, una muy pequeña.'],
        ver: ['fuerza elástica'] },
      { termino: 'deformación', simbolo: 'x', medida: 'm', formas: ['deformación', 'deformaciones'],
        def: 'Lo que un resorte se estira o se encoge, medido desde su largo natural.',
        simple: 'Cuánto se estiró o se encogió un resorte desde su largo sin nada colgado.',
        ejemplos: ['Un resorte estirado 3 cm tiene x = 3 cm.', 'Un resorte apretado 2 cm tiene x = 2 cm.', 'Sin nada colgado, x = 0.'],
        ver: ['fuerza elástica'] },
      { termino: 'torque', simbolo: 'τ', medida: 'N·m', formas: ['torque', 'torques', 'momento de una fuerza'],
        def: 'Cuánto hace girar una fuerza: su valor por su brazo, la distancia del eje a la línea de la fuerza.',
        simple: 'Cuánto hace girar una fuerza, como cuando aflojas una tuerca con una llave.',
        ejemplos: ['50 N en una llave de 0,3 m, perpendicular: 15 N·m.', 'Una puerta se abre fácil empujando lejos de las bisagras.', 'Empujar justo en las bisagras no la hace girar.'],
        ver: ['brazo de palanca', 'cuerpo rígido'] },
      { termino: 'brazo de palanca', simbolo: 'd', medida: 'm', formas: ['brazo de palanca', 'brazo', 'brazos'],
        def: 'Distancia perpendicular del eje de giro a la línea de la fuerza.',
        simple: 'Qué tan lejos del eje actúa la fuerza: una llave larga afloja mejor.',
        ejemplos: ['En una llave de 0,3 m jalada perpendicular, el brazo mide 0,3 m.', 'Si jalas inclinado, el brazo es menor que la llave.', 'Una fuerza que apunta al eje tiene brazo cero.'],
        ver: ['torque'] },
      { termino: 'palanca', formas: ['palanca', 'palancas'],
        def: 'Barra que gira en un apoyo y sirve para mover un peso con menos fuerza: una máquina simple.',
        simple: 'Una barra que gira sobre un apoyo, como el sube y baja.',
        ejemplos: ['La barreta para mover una piedra.', 'El sube y baja del parque.', 'Una tijera o un abridor de botellas.'],
        ver: ['torque'] },
      { termino: 'cuerpo rígido', formas: ['cuerpo rígido', 'cuerpos rígidos'],
        def: 'Cuerpo que no se deforma: sus puntos guardan siempre la misma distancia entre sí.',
        simple: 'Algo que no se dobla ni se estira, como un tablón de madera.',
        ejemplos: ['Un tablón de madera.', 'Una escalera apoyada en la pared.', 'Una viga de fierro.'],
        ver: ['equilibrio'] },
      { termino: 'centro de gravedad', formas: ['centro de gravedad', 'centros de gravedad'],
        def: 'Punto donde se puede poner todo el peso de un cuerpo para calcular sus torques.',
        simple: 'Donde parece estar todo el peso: una regla apoyada ahí no se cae.',
        ejemplos: ['El de una regla pareja está en su mitad.', 'El de un martillo está cerca de su cabeza.', 'Un objeto quieto sobre un solo apoyo lo tiene encima del apoyo.'],
        ver: ['cuerpo rígido'] },
      { termino: 'reacción', simbolo: 'R', medida: 'N', formas: ['reacción', 'reacciones'],
        def: 'Fuerza con que un apoyo o una bisagra sostiene a un cuerpo.',
        simple: 'Lo que empuja un apoyo para sostener algo, como un caballete.',
        ejemplos: ['Lo que empuja cada caballete del tablón.', 'Lo que hace la bisagra de una puerta.', 'Lo que empuja el codo al antebrazo.'],
        ver: ['cuerpo rígido'] },
    ],
    laboratorio,
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov).
    laboratorioIdeas: { 'palanca-libre': ['torque-y-brazo'], 'caja-con-masa': ['rozamiento-se-ajusta'], 'nudo-libre': ['nudo-en-equilibrio'] },
    historia: {
      texto: 'Equilibrar pesos fue un problema práctico mucho antes de la mecánica moderna. Arquímedes relacionó pesos y distancias en la palanca con argumentos geométricos. Siglos después, Stevin estudió cuerpos en planos inclinados. Hoy esas ideas se escriben como dos condiciones: que las fuerzas y los giros se cancelen.',
      pregunta: '¿Por qué una puerta se abre más fácil empujando lejos de las bisagras?',
      fuente: { titulo: 'NYU — Archimedes, The Law of the Lever', url: 'https://math.nyu.edu/Archimedes/Lever/LeverLaw.html' },
    },
    ideas: [dcl, nudo, roce, elastica, torque, rigido],
  };
});
