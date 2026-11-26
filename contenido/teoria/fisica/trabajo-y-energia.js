/*
 * Teoría de «Trabajo, energía y potencia» (fisica.trabajo-y-energia), para 5.º de secundaria y preuniversitario. Rehecha
 * el 19 nov 2026 con el método delegado (docs/metodo/unidad/etapa-delegada.md; propuesta en docs/etapa8/propuesta-fisica.md;
 * Gerson delegó el criterio y revisa después). Novena unidad de la rama «Mecánica», después de Dinámica: usa la
 * descomposición de una fuerza oblicua, la normal, f_k = μ_k · N y ΣF = m · a de Dinámica, la fuerza elástica (k, x) de
 * Estática y las fórmulas de MRUV como dato. No adelanta la cantidad de movimiento ni los choques (Impulso y choques), la
 * energía de las órbitas (Gravitación) ni la del MAS (Oscilaciones).
 *
 * Las seis ideas, en orden (los cinco ids publicados se quedan con otra Predice; `energia-y-rozamiento` es nueva:
 * Avance.migrar, en nucleo/avance.js, REHECHAS_E6 con las marcas prediccionTE y estudiadaTE):
 *   1 `trabajo-y-angulo` «Trabajo de una fuerza» ...................... la maleta de rueditas jalada por el asa.
 *   2 `trabajo-energia-cinetica` «Trabajo neto y energía cinética» ..... el carrito de ladrillos de la obra.
 *   3 `energia-potencial` «Energía potencial» ......................... la maceta en el balcón de un edificio.
 *   4 `conservacion-energia` «Conservación de la energía mecánica» .... el niño en el tobogán del parque.
 *   5 `energia-y-rozamiento` «Energía con rozamiento» .................. la caja en la rampa de tablones del almacén.
 *   6 `potencia-y-eficiencia` «Potencia y eficiencia» ................... el montacargas de la obra.
 * Objetos: pieza fis-estatica (nucleo/kit/piezas/fis-estatica.js) con su bloque de Energía (maleta, barra-e, tobogan,
 * sentado, maceta, edificio, motor), además de la persona, la caja, el carrito, la rampa y el resorte; gráficas F–x con la
 * pieza ejes. Dibujos de prueba (data-prueba).
 *
 * Letras (propuesta §5; campo `letras`): F una fuerza de una mano, un motor o una cuerda; W el trabajo de una fuerza (W_F,
 * W_peso, W_N y W_f el de cada una; W_neto el de todas); d la distancia recorrida; θ el ángulo entre la fuerza y el
 * avance; x la posición en una gráfica F–x y la deformación de un resorte; m la masa; g = 10 m/s²; v y v₀ la rapidez al
 * final y al empezar; h la altura sobre la referencia; E_C, E_PG, E_PE y E_M la energía cinética, la potencial
 * gravitatoria, la elástica y la mecánica; k la constante elástica; f_k, μ_k y N el rozamiento, su coeficiente y la normal;
 * t el tiempo; P la potencia (P_útil, P_consumida) y η la eficiencia. Aviso: P es la potencia y el peso se escribe m · g
 * (decisión 4); W después de un número es el watt.
 * REGLA DE COLORES (propuesta §6; tabla COLORES): las fuerzas con los colores de Estática y Dinámica, y cada trabajo y cada
 *   energía potencial con el de su fuerza, en el juego, la figura, la fórmula, los datos, los ejemplos y «Ahora tú»:
 *   - carmín (c-h): el peso m · g⃗, g, su trabajo W_peso y la energía potencial gravitatoria E_PG;
 *   - naranja (c-o): F⃗ de la mano, la cuerda o el motor, la fuerza del resorte, su trabajo W_F y la energía potencial
 *     elástica E_PE;
 *   - turquesa (c-i): el rozamiento f⃗, su trabajo W_f y lo que se vuelve calor;
 *   - violeta (c-f): la normal N⃗ y su trabajo W_N;
 *   - tinta: a⃗, ΣF⃗, W_neto, la energía cinética E_C y la mecánica E_M, v⃗, m, d, h, x, k, θ, t, P, η, los objetos y lo que
 *     se pide en una figura («?»). La respuesta en tinta va en negrita (decisión 3).
 *   Sin verde (0,010 junto al naranja en protanopía).
 * Errores (docs/investigacion/estatica-energia-ideas-erroneas.md): W1, W3, W4, W5, W6, W7, W9, W14 y W15 con respaldo; los
 *   demás son hipótesis de diseño (TR-*, TE-*, EP-*, CE-*, RZ-*, PO-*), descritos en ese informe, «Trabajo, energía y
 *   potencia (19 nov 2026)».
 *
 * Molde: docs/teoria.md y docs/molde-unidad.md. Fuente: docs/teoria/matriz/fisica.json (unidad 7) y la propuesta.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const G = 10;
  const rad = d => d * Math.PI / 180;
  // Azar con semilla para «Ahora tú» y «Así se resuelve» (el mismo de Estática y Dinámica).
  function azar(sm) {
    let q = (sm * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = arr => arr[Math.floor(r() * arr.length)];
    return r;
  }
  // Opciones distintas, la correcta primero. Un distractor que repite el texto de la correcta es un caso mal elegido: se
  // marca en `repiteCorrecta` (la prueba de la unidad lo busca en 400 semillas) y no entra. Aquí sí hay valores negativos
  // (el trabajo de lo que frena).
  function opciones(correcta, distractores, fmt, textoBien) {
    const bien = textoBien || fmt(correcta), vistos = new Set([bien]), repite = [];
    const ops = [{ id: 'c', texto: bien, correcta: true }];
    for (const d of distractores) {
      if (!d || (d.texto === undefined && !Number.isFinite(d.valor))) continue;
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
  // Un valor que se escribe con «=» tiene que ser exacto con dos decimales (auditorías de la etapa 5).
  const exacto = x => Number.isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const elegir = fn => { for (let i = 0; i < 600; i++) { const c = fn(); if (c) return c; } throw new Error('trabajo-y-energia: sin caso exacto'); };
  const mayus = s => s[0].toUpperCase() + s.slice(1);
  // Distractores sin choques: ningún error da la correcta ni repite otro (auditoría de Estática, M4).
  const distintos = (bien, ...vs) => vs.every(v => Number.isFinite(v) && Math.abs(v - bien) > 1e-6) && new Set(vs.map(v => f(v))).size === vs.length && !vs.some(v => f(v) === f(bien));
  // Un número en una cuenta: los negativos entre paréntesis.
  const en = (v, d = 2) => (v < 0 ? `(${f(v, d)})` : f(v, d));
  const J_ = v => `${f(v)} J`, N_ = v => `${f(v)} N`, MS = v => `${f(v)} m/s`, M_ = v => `${f(v)} m`, W_ = v => `${f(v)} W`;
  const COS = { 0: 1, 30: Math.sqrt(3) / 2, 37: 0.8, 53: 0.6, 60: 0.5, 90: 0, 120: -0.5, 127: -0.6, 143: -0.8, 180: -1 };
  const SEN = { 0: 0, 30: 0.5, 37: 0.6, 53: 0.8, 60: Math.sqrt(3) / 2, 90: 1, 127: 0.8, 143: 0.6, 180: 0 };
  const COSTXT = { 0: '1', 37: '0,8', 53: '0,6', 60: '0,5', 90: '0', 127: '−0,6', 143: '−0,8', 180: '−1' };

  // ---- Un color fijo por clase de fuerza (el de Estática); cada trabajo y cada energía potencial, el de su fuerza ----
  // Cada ficha dice su clase en m (lo comprueba el .test.js).
  const COLORES = { peso: 'h', normal: 'f', jalón: 'o', rozamiento: 'i' };
  const ficha = (c, m) => t => ({ v: c, t: String(t), m });
  const pp = ficha('c-h', 'peso'), pn = ficha('c-f', 'normal'), pj = ficha('c-o', 'jalón'), pr = ficha('c-i', 'rozamiento');
  const sub = (x, i) => ({ sub: [x, i] });
  const vec = x => ({ vec: [x] });
  const neg = l => ({ negrita: [l] });
  const frac = (a, b) => ({ frac: [a, b] });
  const F = pj('F'), g = pp('g'), N = pn('N');
  const MG = [pp('m · g')];
  const W = 'W', WF = sub(pj('W'), 'F'), Wpeso = sub(pp('W'), 'peso'), WN = sub(pn('W'), 'N'), Wf = sub(pr('W'), 'f'), Wneto = sub('W', 'neto');
  const EC = sub('E', 'C'), EPG = sub(pp('E'), 'PG'), EPE = sub(pj('E'), 'PE'), EM = sub('E', 'M');
  const fk = sub(pr('f'), 'k'), muk = sub('μ', 'k');
  const Putil = sub('P', 'útil'), Pcons = sub('P', 'consumida');
  const est = (datos, estado = {}) => ({ pieza: 'fis-estatica', datos, estado });
  const plano = (datos, estado = {}) => ({ pieza: 'ejes', datos, estado });

  // Datos de cada ejercicio (contrato, punto 13): herramientas, nunca el paso hecho; ningún atajo ni consejo.
  const D = {
    trabajo: ['Trabajo de una fuerza constante: ', W, ' = ', F, ' · d · cos θ, con θ el ángulo entre la fuerza y el avance'],
    cosNot: 'cos 0° = 1, cos 90° = 0 y cos 180° = −1',
    trig: 'sen 37° = 0,6 y cos 37° = 0,8; sen 53° = 0,8 y cos 53° = 0,6 (convención del examen)',
    trig60: 'cos 60° = 0,5 (convención del examen)',
    area: ['Si la fuerza cambia en el camino: ', W, ' = área bajo la gráfica F–x; bajo el eje, el área es negativa'],
    triangulo: 'Área de un triángulo: base · altura / 2; de un rectángulo: base · altura',
    peso: ['Peso: ', ...MG, ', con ', g, ' = 10 m/s²'],
    pesoW: ['Trabajo del peso: ', Wpeso, ' = ', ...MG, ' · h al bajar h, y −', ...MG, ' · h al subir h'],
    comp: 'Una fuerza F con ángulo θ sobre la horizontal: F · cos θ de lado y F · sen θ hacia arriba',
    normal: 'Si no sube ni baja, lo vertical suma cero',
    cin: [fk, ' = ', muk, ' · ', N, ' mientras desliza, contra el deslizamiento'],
    constante: 'A rapidez constante, la fuerza neta es cero',
    pitagoras: 'Pitágoras: hipotenusa² = cateto² + cateto²',
    cuerda: 'Una cuerda ideal no se estira: el trabajo de quien jala su punta llega entero al otro extremo',
    g: 'g = 10 m/s²',
    cuesta: ['En una rampa de ángulo θ: normal, ', ...MG, ' · cos θ; el peso tira ', ...MG, ' · sen θ rampa abajo'],
    fvConst: ['A rapidez constante, la fuerza neta es cero y P = ', F, ' · v'],
    calor: ['Lo que se vuelve calor vale lo mismo que −', Wf],
  };

  // ---- Figuras ----
  // Un rótulo que se pide va con «?»; una flecha pedida, con largo fijo (auditoría de Estática, M1).
  // figJalon: un cuerpo sobre el piso jalado por un asa o una cuerda con el ángulo θ sobre la horizontal; la flecha F⃗ sale
  // de la punta del asa, en su dirección, y la punteada es su parte a lo largo del piso. Debajo, la cota de lo que avanza.
  //   o.cosa: 'maleta' | 'caja' | 'costal' | 'carrito'; o.ang (grados); o.tF, o.tC (rótulos de F⃗ y de la punteada);
  //   o.d (texto de la cota); o.dcl: { … } dibuja el DCL a la derecha (y la cota queda bajo el cuerpo).
  const PISO1 = 170;
  function figJalon(o) {
    const ang = o.ang || 0, c = Math.cos(rad(ang)), s = Math.sin(rad(ang)), x = o.x || 62, objs = [], fl = [], txt = (o.textos || []).slice();
    let gx, gy;
    if (o.cosa === 'maleta' || !o.cosa) {
      const w = 40, h = 54, x0 = x - w / 2, y0 = PISO1 - 6 - h, ax = ang > 90 ? x0 : x0 + w, ay = y0 + 6, L = 30;
      objs.push({ tipo: 'maleta', x, y: PISO1, w, h, asa: ang, largo: L, texto: o.texto });
      gx = ax + L * c; gy = ay - L * s;
    } else {
      const w = o.cosa === 'carrito' ? 70 : 58, h = 38, y0 = PISO1 - h, ax = ang > 90 ? x - w / 2 : x + w / 2, ay = y0 + 12, L = 30;
      objs.push(Object.assign({ tipo: o.cosa, x, y: PISO1, w, h, texto: o.texto }, o.cosa === 'carrito' ? { mango: 0 } : {}));
      gx = ax + L * c; gy = ay - L * s;
      objs.push({ tipo: 'cuerda', de: [ax, ay], a: [gx, gy] });
    }
    const LF = o.largoF || 60;
    if (!o.sinF) fl.push({ de: [gx, gy], ang, largo: LF, color: 'o', texto: o.tF || 'F⃗', rumbo: [c * 0.3, -1] });
    if (o.tC && Math.abs(c) > 1e-9 && ang !== 0 && ang !== 180) fl.push({ de: [gx, gy], ang: c > 0 ? 0 : 180, largo: Math.abs(c) * LF, color: 'o', discontinua: true, texto: o.tC, rumbo: [0, 1] });
    const arcos = ang > 0 && ang < 180 && !o.sinF ? [{ c: [gx, gy], de: ang < 90 ? 0 : ang, a: ang < 90 ? ang : 180, r: 20, texto: o.tAng || `θ = ${ang}°` }] : [];
    // con θ > 90° el ángulo con el avance (hacia la derecha) es θ: el arco va desde la horizontal de adelante
    if (ang > 90 && ang < 180 && !o.sinF) arcos[0] = { c: [gx, gy], de: 0, a: ang, r: 16, texto: o.tAng || `θ = ${ang}°` };
    const d = o.dcl ? dcl(o.dcl) : { obj: [], fl: [], txt: [] };
    const x1 = o.dcl ? 200 : 312;
    const cotas = o.d ? [{ de: [x - (o.cosa === 'maleta' || !o.cosa ? 20 : 29), PISO1], a: [o.dcl ? 196 : x - 20 + (o.largoD || 230), PISO1], texto: o.d, lado: 1, sep: 16 }] : [];
    return { alto: o.alto || 212, piso: { y: PISO1, x0: 8, x1 }, objetos: [...objs, ...(o.objetos || []), ...d.obj], flechas: [...fl, ...d.fl], textos: [...d.txt, ...txt],
      angulos: arcos, cotas, lineas: o.lineas, alt: o.alt };
  }
  // El DCL de un cuerpo, a la derecha del lienzo (caja en x = 252), sin escala: todas las fuerzas con el mismo largo y su
  // valor escrito. fz: { mg, N, F, Fang, f, Fdir } (textos de cada rótulo; la que no está, no se dibuja).
  function dcl(fz, o = {}) {
    const cx = o.cx || 252, cy = o.cy || 96, h = 15, w = 42, fl = [], L = 30;
    if (fz.mg) fl.push({ de: [cx - 8, cy + h], ang: 270, largo: L, color: 'h', texto: fz.mg, rumbo: [1, 0.15] });
    if (fz.N) fl.push({ de: [cx - 8, cy - h], ang: 90, largo: L, color: 'f', texto: fz.N, rumbo: [-1, -0.5] });
    const lado = fz.Fdir || 1, a = fz.Fang || 0;
    if (fz.F) fl.push({ de: [cx + lado * w / 2, cy - (a ? 6 : 0)], ang: lado > 0 ? a : 180 - a, largo: L + 4, color: 'o', texto: fz.F, rumbo: [lado * 0.4, -1] });
    if (fz.f) fl.push({ de: [cx - lado * w / 2, cy + 8], ang: lado > 0 ? 180 : 0, largo: L, color: 'i', texto: fz.f, rumbo: [-lado * 0.3, 1] });
    return { obj: [{ tipo: 'caja', fig: true, x: cx, y: cy + h, w, h: 2 * h }], fl,
      txt: [{ x: cx, y: 18, texto: 'DCL', ancla: 'middle', peso: 400 }, { x: cx, y: cy + 74, texto: 'sin escala', ancla: 'middle', peso: 400 }] };
  }
  // Una gráfica F–x con sus áreas (pieza ejes). tramos: [[x, F], …]; areas: [{ puntos, rotulo }]. Todo en el naranja de F.
  function grafica(puntos, o = {}) {
    const xs = puntos.filter(Boolean).map(p => p[0]), fs = puntos.filter(Boolean).map(p => p[1]);
    const ymax = Math.max(10, ...fs), ymin = Math.min(0, ...fs), paso = o.paso || (ymax > 40 ? 20 : ymax > 20 ? 10 : 5);
    return { x: { min: 0, max: o.xmax || Math.max(...xs), paso: o.pasoX || 1, nombre: 'x', unidad: 'm', decimales: 0 },
      y: { min: ymin < 0 ? -Math.ceil(-ymin / paso) * paso : 0, max: Math.ceil((ymax * 1.15) / paso) * paso, paso, nombre: o.nombre || 'F', unidad: 'N', decimales: 0, color: 'o' },
      curvas: [{ puntos, color: 'o' }],
      areas: (o.areas || []).map(a => Object.assign({ color: 'o' }, a)), compacto: true };
  }

  // ======================= 1: trabajo de una fuerza (la maleta de rueditas) =======================
  // Cambia: la fuerza y la inclinación del asa · Permanece: los 5 m que avanza · Progresa: la parte de F⃗ a lo largo del
  // piso, que se achica al inclinar · Se reserva: la fuerza de lado, a 90° (Predice: la mochila) y la que frena · Debe
  // verse: W = F · d · cos θ; a favor, positivo; en contra, negativo; de lado, cero.
  // El juego dibuja solo la fuerza del asa, no un DCL: el peso y la normal, con su trabajo cero, delatarían la Predice
  // (decisión 6 de la propuesta).
  const juego1 = val => { const Fp = val.F * COS[val.ang];
    return est(figJalon({ ang: val.ang, tF: `F = ${val.F} N`, tC: val.ang ? N_(Fp) : undefined, d: 'd = 5 m',
      alt: `Una maleta jalada por el asa con ${val.F} N a ${val.ang}° del piso, a lo largo de 5 m: ${f(Fp)} N van a lo largo del piso.` })); };
  function figMochila(o = {}) {
    const fl = [{ de: [124, 104], ang: 90, largo: 34, color: 'o', texto: 'F = 50 N', rumbo: [1, -0.3] },
      { de: [108, 128], ang: 270, largo: 22, color: 'h', texto: 'mg = 50 N', rumbo: [1, 0.2] },
      { de: [40, 40], ang: 0, largo: 46, color: 'tinta', texto: 'v⃗ constante', rumbo: [1, -0.2] }];
    return { alto: 212, piso: { y: PISO1, x0: 8, x1: 312 },
      objetos: [{ tipo: 'persona', x: 76, y: PISO1, alto: 120, mira: 1, mano: [104, 88] }, { tipo: 'bolsa', x: 108, y: 92, w: 32, h: 36 }],
      flechas: fl, cotas: [{ de: [70, PISO1], a: [300, PISO1], texto: 'd = 10 m', lado: 1, sep: 16 }],
      angulos: o.arco ? [{ c: [124, 104], de: 0, a: 90, r: 16, texto: '90°' }] : [],
      textos: [{ x: 312, y: 24, texto: o.res || 'W de la mano: ?', ancla: 'end', peso: 400 }],
      alt: o.alt };
  }
  const PRED1 = figMochila({ alt: 'Una persona camina 10 m por un piso horizontal con su mochila colgada de la mano. La mano la sostiene con 50 N hacia arriba. El trabajo de la mano, con un signo de pregunta.' });
  const REVELA1 = figMochila({ arco: true, res: 'W = 50 · 10 · cos 90° = 0', alt: 'La mano empuja hacia arriba y la mochila avanza de lado: el ángulo es 90° y el trabajo de la mano es cero.' });
  // Mira: la parte de la fuerza a lo largo del camino contra la posición; el área es el trabajo.
  const MIRA1 = {
    x: { min: 0, max: 10, paso: 2, nombre: 'x', unidad: 'm', decimales: 0 },
    y: { min: -30, max: 45, paso: 15, nombre: 'F · cos θ', unidad: 'N', decimales: 0, color: 'o' },
    curvas: [{ puntos: [[0, 0], [10, 0]], color: 'o', desde: 0, hasta: 0, rotulo: 'mochila: 0 N a lo largo', en: [5, 6] },
      { puntos: [[0, 32], [5, 32]], color: 'o', desde: 1, hasta: 1, rotulo: 'maleta: 32 N', en: [2.5, 38] },
      { puntos: [[0, -20], [5, -20]], color: 'o', desde: 2, hasta: 2, rotulo: '−20 N', en: [6.4, -20] }],
    areas: [{ puntos: [[0, 32], [5, 32]], color: 'o', rotulo: '160 J', desde: 1, hasta: 1 },
      { puntos: [[0, -20], [5, -20]], color: 'o', rotulo: '−100 J', desde: 2, hasta: 2 }],
  };

  // Ejemplos resueltos de la idea 1. Cuentas rehechas con un script aparte que no usa este archivo (scratchpad
  // e8-fisica/cuentas.js: el trabajo como suma de fuerza por tramo, con el coseno de cada ángulo, y el montacargas tramo
  // por tramo): 30·4; 50·6·0,8; 0; −12·5; 2·3; 50·1,2; 400/(10·0,8); cos θ = 50/100; −0,3·200·5; −40·3;
  // N = 100 − 30, 0,5·70·4 y cada alternativa; 300 y 320 con cada alternativa; 7500 + 6000 + 4500 y cada alternativa;
  // 50·(5 − 3) y cada alternativa; V V F.
  const EJEMPLOS_TRABAJO = [
    { nivel: 1, titulo: 'El carrito que empujas',
      figura: est({ alto: 212, piso: { y: PISO1, x0: 8, x1: 312 }, objetos: [{ tipo: 'persona', x: 40, y: PISO1, alto: 92, mira: 1, mano: [64, 128] }, { tipo: 'carrito', x: 102, y: PISO1, w: 74, h: 30, mango: 0, texto: 'papas' }],
        flechas: [{ de: [140, 118], ang: 0, largo: 44, color: 'o', texto: 'F = 30 N', rumbo: [0, -1] }], cotas: [{ de: [65, PISO1], a: [265, PISO1], texto: 'd = 4 m', lado: 1, sep: 16 }],
        textos: [{ x: 312, y: 24, texto: 'W = ?', ancla: 'end' }], alt: 'Una persona empuja un carrito con 30 N horizontales a lo largo de 4 m. El trabajo, con un signo de pregunta.' }),
      enunciado: ['Empujas un carrito con ', pj('30 N'), ' horizontales, en el sentido en que avanza, a lo largo de 4 m. ¿Cuánto trabajo hace tu empujón?'],
      datos: [D.trabajo, D.cosNot],
      solucion: [{ texto: 'Tu empujón va justo en el sentido en que avanza el carrito, así que θ = 0° y cos 0° = 1: toda la fuerza cuenta.', ecuacion: [W, ' = 30 · 4 · 1 = ', pj('120 J')] }],
      respuesta: [WF, ' = ', pj('120 J')] },
    { nivel: 1, titulo: 'El asa inclinada',
      figura: est(figJalon({ ang: 37, tF: 'F = 50 N', d: 'd = 6 m', textos: [{ x: 312, y: 24, texto: 'W = ?', ancla: 'end' }], alt: 'Una maleta jalada por el asa con 50 N a 37° del piso, a lo largo de 6 m.' })),
      enunciado: ['Jalas una maleta por el asa con ', pj('50 N'), ', a 37° del piso. La maleta avanza 6 m. ¿Cuánto trabajo hace tu jalón?'],
      datos: [D.trabajo, D.trig],
      solucion: [{ texto: 'El asa forma 37° con el piso, y ese es el ángulo entre tu jalón y el avance; el coseno de 37° dice qué parte del jalón va a lo largo del piso:', ecuacion: [W, ' = 50 · 6 · cos 37° = 50 · 6 · 0,8 = ', pj('240 J')] }],
      respuesta: [WF, ' = ', pj('240 J')] },
    { nivel: 1, titulo: 'La normal no trabaja',
      figura: est({ alto: 212, piso: { y: PISO1, x0: 8, x1: 312 }, objetos: [{ tipo: 'caja', x: 80, y: PISO1, w: 60, h: 40, texto: 'caja' }],
        flechas: [{ de: [80, 130], ang: 90, largo: 40, color: 'f', texto: 'N = 120 N', rumbo: [1, -0.4] }, { de: [116, 112], ang: 0, largo: 40, color: 'tinta', texto: 'v⃗', rumbo: [1, -0.3] }],
        cotas: [{ de: [50, PISO1], a: [290, PISO1], texto: 'd = 8 m', lado: 1, sep: 16 }], textos: [{ x: 312, y: 24, texto: 'W de la normal: ?', ancla: 'end', peso: 400 }],
        alt: 'Una caja desliza 8 m por el piso; el piso la empuja hacia arriba con 120 N. El trabajo de la normal, con un signo de pregunta.' }),
      enunciado: ['Una caja desliza 8 m por un piso horizontal. El piso la empuja hacia arriba con una normal de ', pn('120 N'), '. ¿Cuánto trabajo hace la normal?'],
      datos: [D.trabajo, D.cosNot],
      solucion: [{ texto: 'La normal apunta hacia arriba y la caja avanza en horizontal, así que θ = 90°: la normal no ayuda ni frena el avance.', ecuacion: [WN, ' = 120 · 8 · cos 90° = 120 · 8 · 0 = ', pn('0 J')] }],
      respuesta: [WN, ' = ', pn('0 J')] },
    { nivel: 1, titulo: 'El rozamiento frena',
      figura: est({ alto: 212, piso: { y: PISO1, x0: 8, x1: 312 }, objetos: [{ tipo: 'costal', x: 150, y: PISO1, w: 64, h: 42, texto: 'arroz' }],
        flechas: [{ de: [118, 162], ang: 180, largo: 40, color: 'i', texto: 'f = 12 N', rumbo: [-0.5, -1] }, { de: [140, 112], ang: 0, largo: 40, color: 'tinta', texto: 'v⃗', rumbo: [1, -0.3] }],
        cotas: [{ de: [118, PISO1], a: [300, PISO1], texto: 'd = 5 m', lado: 1, sep: 16 }], textos: [{ x: 8, y: 24, texto: 'W del rozamiento: ?', ancla: 'start', peso: 400 }],
        alt: 'Un costal desliza 5 m hacia la derecha y el piso lo frena con 12 N hacia la izquierda.' }),
      enunciado: ['Un costal desliza 5 m por el piso y el rozamiento lo frena con ', pr('12 N'), '. ¿Cuánto trabajo hace el rozamiento?'],
      datos: [D.trabajo, D.cosNot],
      solucion: [{ texto: 'El rozamiento apunta hacia atrás y el costal avanza hacia adelante, así que θ = 180° y el trabajo sale negativo: frena.', ecuacion: [Wf, ' = 12 · 5 · cos 180° = 12 · 5 · (−1) = ', pr('−60 J')] }],
      respuesta: [Wf, ' = ', pr('−60 J')] },
    { nivel: 1, titulo: 'La manzana que cae',
      figura: est({ alto: 212, piso: { y: PISO1, x0: 8, x1: 312 }, objetos: [{ tipo: 'pelota', x: 150, y: 40, r: 10 }],
        flechas: [{ de: [150, 52], ang: 270, largo: 30, color: 'h', texto: 'mg = 2 N', rumbo: [1, 0.3] }], lineas: [{ de: [150, 90], a: [150, 166] }],
        cotas: [{ de: [190, 40], a: [190, PISO1], texto: 'h = 3 m', lado: -1, sep: 12 }], textos: [{ x: 8, y: 24, texto: 'W del peso: ?', ancla: 'start', peso: 400 }],
        alt: 'Una manzana de 0,2 kg cae 3 m hasta el piso.' }),
      enunciado: ['Una manzana de 0,2 kg cae 3 m desde una rama hasta el suelo. ¿Cuánto trabajo hace su peso?'],
      datos: [D.peso, D.trabajo, D.cosNot],
      solucion: [{ texto: 'El peso de la manzana es 0,2 · 10 = 2 N y apunta hacia abajo, justo hacia donde cae, así que θ = 0° y el peso ayuda a la caída.', ecuacion: [Wpeso, ' = 2 · 3 · cos 0° = ', pp('6 J')] }],
      respuesta: [Wpeso, ' = ', pp('6 J')] },
    { nivel: 2, titulo: 'Subir la caja a la repisa',
      figura: est({ alto: 212, piso: { y: PISO1, x0: 8, x1: 312 }, objetos: [{ tipo: 'persona', x: 60, y: PISO1, alto: 96, mira: 1, mano: [96, 104] }, { tipo: 'caja', x: 116, y: 128, w: 44, h: 32, texto: '5 kg' },
        { tipo: 'viga', x0: 150, x1: 260, y: 64 }],
        flechas: [{ de: [116, 96], ang: 90, largo: 30, color: 'o', texto: 'F = ?', rumbo: [1, -0.5] }],
        cotas: [{ de: [280, 64], a: [280, 128], texto: 'sube 1,2 m', lado: -1, sep: 8 }], textos: [{ x: 8, y: 24, texto: 'a rapidez constante', ancla: 'start', peso: 400 }],
        alt: 'Una persona sube una caja de 5 kg hasta una repisa 1,2 m más alta, despacio y siempre a la misma rapidez.' }),
      enunciado: ['Subes una caja de 5 kg hasta una repisa 1,2 m más alta, siempre a la misma rapidez. ¿Cuánto trabajo hace tu mano?'],
      datos: [D.peso, D.constante, D.trabajo],
      solucion: [
        { texto: 'Como la caja sube siempre a la misma rapidez, la fuerza neta es cero, y tu mano empuja hacia arriba lo mismo que pesa la caja:', ecuacion: [F, ' = 5 · 10 = ', pj('50 N')] },
        { texto: 'Tu mano empuja hacia arriba y la caja sube, así que θ = 0° y el trabajo es la fuerza por la altura:', ecuacion: [WF, ' = 50 · 1,2 = ', pj('60 J')] },
      ],
      respuesta: [WF, ' = ', pj('60 J')] },
    { nivel: 2, titulo: 'La fuerza de la cuerda',
      figura: est(figJalon({ cosa: 'caja', ang: 37, tF: 'F = ?', d: 'd = 10 m', textos: [{ x: 312, y: 24, texto: 'W = 400 J', ancla: 'end', peso: 400 }],
        alt: 'Una caja arrastrada 10 m con una cuerda a 37° del piso; la fuerza de la cuerda, con un signo de pregunta.' })),
      enunciado: ['Una cuerda a 37° del piso arrastra una caja 10 m y hace un trabajo de ', pj('400 J'), '. ¿Con qué fuerza jala la cuerda?'],
      datos: [D.trabajo, D.trig],
      solucion: [
        { texto: 'El trabajo dividido entre los 10 m da la parte de la fuerza que va a lo largo del piso:', ecuacion: [F, ' · 0,8 = ', frac('400', '10'), ' = 40 N'] },
        { texto: 'Esa parte es la fuerza por cos 37° = 0,8, es decir, el 80 % de la fuerza, así que se divide entre 0,8:', ecuacion: [F, ' = ', frac('40', '0,8'), ' = ', pj('50 N')] },
      ],
      respuesta: [F, ' = ', pj('50 N')] },
    { nivel: 2, titulo: 'El ángulo de la fuerza',
      figura: est(figJalon({ cosa: 'costal', ang: 60, tF: 'F = 20 N', tAng: 'θ = ?', d: 'd = 5 m', textos: [{ x: 312, y: 24, texto: 'W = 50 J', ancla: 'end', peso: 400 }],
        alt: 'Un costal arrastrado 5 m con una cuerda de 20 N; el ángulo de la cuerda, con un signo de pregunta.' })),
      enunciado: ['Una cuerda jala un costal con ', pj('20 N'), ' mientras avanza 5 m, y hace un trabajo de ', pj('50 J'), '. ¿Qué ángulo forma la cuerda con el piso?'],
      datos: [D.trabajo, 'cos 0° = 1; cos 37° = 0,8; cos 53° = 0,6; cos 60° = 0,5; cos 90° = 0 (convención del examen)'],
      solucion: [
        { texto: 'De W = F · d · cos θ se despeja el coseno, dividiendo el trabajo entre la fuerza y la distancia:', ecuacion: ['cos θ = ', frac('50', '20 · 5'), ' = 0,5'] },
        { texto: 'En la lista de Datos, el ángulo cuyo coseno vale 0,5 es 60°.', ecuacion: ['θ = ', neg('60°')] },
      ],
      respuesta: ['θ = ', neg('60°')] },
    { nivel: 2, titulo: 'El rozamiento de la caja',
      figura: est(figJalon({ cosa: 'caja', ang: 0, tF: 'F⃗', texto: '20 kg', d: 'd = 5 m', dcl: { mg: 'mg = 200 N', N: 'N = ?', F: 'F⃗', f: 'f_k = ?' },
        alt: 'Una caja de 20 kg arrastrada 5 m con una cuerda horizontal; a la derecha, su DCL.' })),
      enunciado: ['Arrastras 5 m una caja de 20 kg con una cuerda horizontal. Entre el piso y la caja, ', muk, ' = 0,3. ¿Cuánto trabajo hace el rozamiento?'],
      datos: [D.peso, D.normal, D.cin, D.trabajo],
      solucion: [
        { texto: 'Como la cuerda es horizontal, no levanta la caja y la normal iguala al peso, 200 N; el rozamiento es el coeficiente por esa normal:', ecuacion: [fk, ' = 0,3 · 200 = 60 N'] },
        { texto: 'El rozamiento apunta contra el avance, así que θ = 180° y su trabajo es negativo:', ecuacion: [Wf, ' = 60 · 5 · cos 180° = ', pr('−300 J')] },
      ],
      respuesta: [Wf, ' = ', pr('−300 J')] },
    { nivel: 2, titulo: 'Sujetar la caja en la bajada',
      figura: est({ alto: 212, piso: { y: PISO1, x0: 8, x1: 312 }, objetos: [{ tipo: 'rampa', x0: 30, y0: PISO1, largo: 250, ang: 30 }, { tipo: 'caja', x: 150, y: 101, w: 46, h: 30, giro: 30, texto: 'caja' }],
        flechas: [{ de: [180, 98], ang: 30, largo: 40, color: 'o', texto: 'F = 40 N', rumbo: [0.3, -1] }, { de: [120, 140], ang: 210, largo: 40, color: 'tinta', texto: 'baja 3 m', rumbo: [-0.3, 1] }],
        textos: [{ x: 8, y: 24, texto: 'W de tu mano: ?', ancla: 'start', peso: 400 }], alt: 'Una caja baja 3 m por una rampa y una persona la sujeta con 40 N hacia arriba de la rampa.' }),
      enunciado: ['Una caja baja 3 m por una rampa y tú la sujetas con ', pj('40 N'), ' hacia arriba, a lo largo de la rampa, para que no se escape. ¿Cuánto trabajo hace tu mano?'],
      datos: [D.trabajo, D.cosNot],
      solucion: [
        { texto: 'Tu mano empuja rampa arriba y la caja avanza rampa abajo: la fuerza y el avance van en sentidos contrarios, así que θ = 180°.' },
        { texto: 'El trabajo sale negativo porque tu mano frena la caja en vez de ayudarla a avanzar:', ecuacion: [WF, ' = 40 · 3 · (−1) = ', pj('−120 J')] },
      ],
      respuesta: [WF, ' = ', pj('−120 J')] },
    { nivel: 3, titulo: 'El rozamiento con la cuerda inclinada', fuente: 'Parecida a San Marcos 2019-II, pregunta 106.',
      figura: est(figJalon({ cosa: 'caja', ang: 37, tF: 'F = 50 N', texto: '10 kg', d: 'd = 4 m', dcl: { mg: 'mg = 100 N', N: 'N = ?', F: 'F = 50 N', Fang: 37, f: 'f_k = ?' },
        alt: 'Un bloque de 10 kg jalado 4 m con una cuerda de 50 N a 37° sobre la horizontal; a la derecha, su DCL.' })),
      enunciado: ['Un bloque de 10 kg es arrastrado 4 m por un piso horizontal con una cuerda que jala con ', pj('50 N'), ' a 37° sobre la horizontal. Si ', muk, ' = 0,5, ¿cuánta energía disipa el rozamiento?'],
      alternativas: ['200 J', '140 J', '260 J', '160 J', '280 J'],
      datos: [D.peso, D.comp, D.trig, D.normal, D.cin, D.trabajo],
      solucion: [
        { texto: 'La cuerda tira un poco hacia arriba y el piso sostiene menos, así que la normal es el peso menos la parte vertical de F, que es F · sen 37°:', ecuacion: [N, ' = 100 − 50 · 0,6 = ', pn('70 N')] },
        { texto: 'El rozamiento es el coeficiente por esa normal, y su trabajo es negativo porque va contra el avance; la energía que disipa es ese valor sin el signo:', ecuacion: [fk, ' = 0,5 · 70 = 35 N;   ', Wf, ' = −35 · 4 = ', pr('−140 J')] },
        { texto: [neg('A'), ' toma la normal igual al peso y olvida que la cuerda levanta; ', neg('C'), ' suma la parte vertical de F en vez de restarla; ', neg('D'), ' calcula el trabajo de la cuerda, 50 · 4 · 0,8, y no el del rozamiento; ', neg('E'), ' olvida multiplicar por el coeficiente 0,5.'] },
      ],
      respuesta: [neg('B'), ': ', pr('140 J')] },
    { nivel: 3, titulo: 'Dos jalones distintos',
      figura: est({ alto: 212, piso: { y: PISO1, x0: 8, x1: 312 }, objetos: [{ tipo: 'caja', x: 70, y: PISO1, w: 50, h: 36, texto: 'Ana' }, { tipo: 'caja', x: 210, y: PISO1, w: 50, h: 36, texto: 'Beto' },
        { tipo: 'cuerda', de: [95, 146], a: [113, 122] }, { tipo: 'cuerda', de: [235, 146], a: [259, 128] }],
        flechas: [{ de: [113, 122], ang: 53, largo: 40, color: 'o', texto: '50 N', rumbo: [0.3, -1] }, { de: [259, 128], ang: 37, largo: 40, color: 'o', texto: '40 N', rumbo: [0.3, -1] }],
        angulos: [{ c: [113, 122], de: 0, a: 53, r: 18, texto: '53°' }, { c: [259, 128], de: 0, a: 37, r: 18, texto: '37°' }],
        textos: [{ x: 160, y: 200, texto: 'cada caja avanza 10 m', ancla: 'middle', peso: 400 }],
        alt: 'Ana jala su caja con 50 N a 53° del piso y Beto la suya con 40 N a 37°; cada caja avanza 10 m.' }),
      enunciado: ['Ana jala una caja con ', pj('50 N'), ' a 53° del piso y Beto otra con ', pj('40 N'), ' a 37°. Cada caja avanza 10 m. ¿Cuánto más trabajo hace el que más trabaja?'],
      alternativas: ['100 J', '160 J', '0 J', '20 J', '620 J'],
      datos: [D.trabajo, D.trig],
      solucion: [
        { texto: 'El trabajo de cada uno usa solo la parte de su jalón a lo largo del piso, que lleva el coseno de su ángulo:', ecuacion: ['Ana: 50 · 10 · 0,6 = 300 J;   Beto: 40 · 10 · 0,8 = 320 J'] },
        { texto: 'Beto trabaja más aunque jala con menos fuerza, porque su cuerda va menos empinada y más parte de su jalón va a lo largo del piso:', ecuacion: ['320 − 300 = ', pj('20 J')] },
        { texto: [neg('A'), ' olvida el coseno y resta 500 − 400; ', neg('B'), ' usa el seno, que da la parte que levanta, y resta 400 − 240; ', neg('C'), ' supone que trabajan igual; ', neg('E'), ' suma los dos trabajos en vez de restarlos.'] },
      ],
      respuesta: [neg('D'), ': ', pj('20 J')] },
    { nivel: 3, titulo: 'El montacargas que deja sacos', fuente: 'Parecida a San Marcos 2021, pregunta 91.',
      figura: est({ alto: 230, piso: { y: 216, x0: 8, x1: 312 }, objetos: [{ tipo: 'edificio', x0: 40, x1: 150, y: 216, pisos: 4, hp: 46 }, { tipo: 'caja', x: 205, y: 216, w: 50, h: 40, texto: '3 sacos' }],
        textos: [{ x: 312, y: 24, texto: 'W del motor: ?', ancla: 'end', peso: 400 }, { x: 205, y: 160, texto: '100 kg', ancla: 'middle', peso: 400 }],
        cotas: [{ de: [26, 170], a: [26, 216], texto: '3 m', lado: 1, sep: 6 }],
        alt: 'Un montacargas de 100 kg con tres sacos de 50 kg al pie de un edificio; para a 3 m, a 6 m y a 9 m.' }),
      enunciado: ['Un montacargas de 100 kg sube a rapidez constante con tres sacos de 50 kg, y deja uno a 3 m, otro a 6 m y otro a 9 m de altura. ¿Cuánto trabaja su motor hasta los 9 m?'],
      alternativas: ['22 500 J', '9000 J', '13 500 J', '4500 J', '18 000 J'],
      datos: [D.peso, D.constante, D.trabajo],
      solucion: [
        { texto: 'La carga cambia en cada parada: hasta los 3 m sube con 100 + 150 = 250 kg, de 3 a 6 m sube con 200 kg y de 6 a 9 m, con 150 kg.' },
        { texto: 'A rapidez constante, el motor jala con lo que pesa la carga de cada tramo, y en cada tramo su trabajo es ese peso por 3 m:', ecuacion: ['2500 · 3 + 2000 · 3 + 1500 · 3 = ', pj('18 000 J')] },
        { texto: [neg('A'), ' sube los tres sacos hasta los 9 m, como si no dejara ninguno; ', neg('B'), ' sube solo el montacargas vacío; ', neg('C'), ' lleva un solo saco en todo el camino; ', neg('D'), ' cuenta solo el último tramo, de 6 a 9 m.'] },
      ],
      respuesta: [neg('E'), ': ', pj('18 000 J')] },
    { nivel: 3, titulo: 'El collarín y la polea', fuente: 'Parecida a San Marcos 2026-II, pregunta 81.',
      figura: est({ alto: 226, objetos: [{ tipo: 'barra', de: [20, 170], a: [300, 170], grosor: 6 }, { tipo: 'polea', c: [240, 50], r: 12 }, { tipo: 'caja', x: 80, y: 178, w: 26, h: 16, texto: '' },
        { tipo: 'cuerda', de: [80, 164], a: [229, 54] }, { tipo: 'cuerda', de: [252, 50], a: [292, 50] }],
        flechas: [{ de: [292, 50], ang: 0, largo: 18, color: 'o', texto: 'F = 50 N', rumbo: [-0.2, -1] }],
        cotas: [{ de: [80, 186], a: [240, 186], texto: '4 m', lado: 1, sep: 8 }, { de: [270, 50], a: [270, 170], texto: '3 m', lado: -1, sep: 0 }],
        lineas: [{ de: [240, 62], a: [240, 166] }], textos: [{ x: 8, y: 24, texto: 'W de la cuerda: ?', ancla: 'start', peso: 400 }],
        alt: 'Un collarín en una varilla horizontal jalado por una cuerda que pasa por una polea 3 m más arriba; parte 4 m antes de quedar debajo de la polea.' }),
      enunciado: ['Un collarín, en una varilla horizontal, es jalado por una cuerda que pasa por una polea 3 m arriba; su punta se jala con ', pj('50 N'), '. Parte 4 m antes de la polea y llega debajo. ¿Cuánto trabaja la cuerda?'],
      alternativas: ['100 J', '200 J', '250 J', '160 J', '150 J'],
      datos: [D.pitagoras, D.cuerda, D.trabajo],
      solucion: [
        { texto: 'Al empezar, el tramo de cuerda entre el collarín y la polea es la hipotenusa de un triángulo de 4 m y 3 m, así que mide √(4² + 3²) = 5 m. Al final, con el collarín debajo, mide 3 m.' },
        { texto: 'Quien jala la punta recoge 5 − 3 = 2 m de cuerda con 50 N, y ese trabajo llega entero al collarín:', ecuacion: [W, ' = 50 · (5 − 3) = ', pj('100 J')] },
        { texto: [neg('B'), ' multiplica por los 4 m que corre el collarín; ', neg('C'), ' usa los 5 m del comienzo, como si se recogiera toda la cuerda; ', neg('D'), ' usa el ángulo del comienzo en todo el camino, aunque la cuerda se empina; ', neg('E'), ' usa los 3 m del tramo final.'] },
      ],
      respuesta: [neg('A'), ': ', pj('100 J')] },
    { nivel: 3, titulo: 'Verdadero o falso del montacargas', fuente: 'Parecida a San Marcos 2026-II, pregunta 90.',
      figura: est({ alto: 212, objetos: [{ tipo: 'viga', x0: 100, x1: 220, y: 30 }, { tipo: 'cuerda', de: [160, 30], a: [160, 90] }, { tipo: 'caja', x: 160, y: 130, w: 50, h: 40, texto: 'caja' }],
        flechas: [{ de: [196, 120], ang: 90, largo: 34, color: 'tinta', texto: 'v⃗, constante', rumbo: [1, -0.2] }],
        textos: [{ x: 8, y: 180, texto: 'sube a rapidez constante', ancla: 'start', peso: 400 }], alt: 'Un montacargas sube una caja colgada de un cable, a rapidez constante.' }),
      enunciado: ['Un montacargas sube una caja a rapidez constante. Di si cada una es verdadera (V) o falsa (F): I. El peso hace trabajo negativo. II. El cable, positivo. III. En valor, el cable trabaja más que el peso.'],
      alternativas: ['VVV', 'FVF', 'VVF', 'VFF', 'FFV'],
      datos: [D.constante, D.trabajo],
      solucion: [
        { texto: 'I: el peso apunta hacia abajo y la caja sube, así que θ = 180° y su trabajo es negativo (V). II: el cable jala hacia arriba, hacia donde sube la caja, así que su trabajo es positivo (V).' },
        { texto: 'III: a rapidez constante la fuerza neta es cero, así que el cable jala con lo mismo que pesa la caja y a lo largo del mismo camino: en valor, los dos trabajos son iguales (F).' },
        { texto: [neg('A'), ' cree que el cable debe ganarle al peso para que la caja suba, pero a rapidez constante empatan; ', neg('B'), ' y ', neg('E'), ' le dan al peso un trabajo positivo; ', neg('D'), ' cree que el cable no trabaja.'] },
      ],
      respuesta: [neg('C'), ': VVF'] },
  ];

  // Casos de «Ahora tú» y «Así se resuelve», de listas distintas (regla resuelve-repite). Ninguno es el de la misión
  // (40 N a 37° en 5 m), el de Predice (la mochila) ni el de un ejemplo.
  const COSAS1_AT = [{ n: 'un trineo de arena', cosa: 'caja' }, { n: 'una caja', cosa: 'caja' }, { n: 'un costal', cosa: 'costal' }];
  const COSAS1_RS = [{ n: 'una carretilla', cosa: 'carrito' }, { n: 'un cajón', cosa: 'caja' }];
  // Signo del trabajo: cada situación con sus explicaciones (auditoría de Dinámica, M7: cada una la suya).
  const SIGNOS = [
    { p: 'Un ascensor sube a rapidez constante. ¿Qué signo tiene el trabajo del peso de la persona que va adentro?', bien: 'Negativo',
      fb: { Positivo: 'La persona sube, pero el signo no sale del avance solo: sale de comparar la fuerza con el avance. El peso apunta hacia abajo, contra la subida.', Cero: 'Que la rapidez no cambie no hace cero el trabajo de cada fuerza. El peso apunta hacia abajo, justo a lo largo del camino vertical, y va contra la subida.' } },
    { p: 'Una caja desliza por un piso horizontal. ¿Qué signo tiene el trabajo de la normal del piso?', bien: 'Cero',
      fb: { Positivo: 'La normal sí empuja, pero hacia arriba, y la caja avanza de lado. Una fuerza sin ninguna parte a lo largo del camino no ayuda al avance.', Negativo: 'Para ser negativo, la normal tendría que apuntar contra el avance, hacia atrás. Apunta hacia arriba, de lado al camino, así que no frena ni ayuda.' } },
    { p: 'Un niño baja por un tobogán. ¿Qué signo tiene el trabajo de su peso?', bien: 'Positivo',
      fb: { Negativo: 'El peso apunta hacia abajo, pero el niño también baja: una parte del peso va a lo largo de la bajada y lo ayuda a avanzar.', Cero: 'El tobogán está inclinado, así que el peso no queda de lado al camino: una parte de él apunta a lo largo de la bajada y ayuda al niño a avanzar.' } },
    { p: 'Arrastras un costal por el piso. ¿Qué signo tiene el trabajo del rozamiento sobre el costal?', bien: 'Negativo',
      fb: { Positivo: 'El costal avanza, pero el signo depende de la fuerza comparada con el avance, y el rozamiento apunta contra el avance: lo frena.', Cero: 'Aunque el rozamiento sea chico, va a lo largo del camino y contra el avance. Una fuerza pequeña da un trabajo pequeño, no un trabajo cero.' } },
    { p: 'Una piedra gira atada a una cuerda en un círculo horizontal, siempre a la misma rapidez. ¿Qué signo tiene el trabajo de la cuerda?', bien: 'Cero',
      fb: { Positivo: 'La cuerda jala, pero hacia el centro del círculo, y en cada instante la piedra avanza de lado a esa dirección. Sin parte a lo largo del camino, no ayuda al avance.', Negativo: 'La cuerda jala hacia adentro, y eso no es ir contra el avance: la piedra avanza de lado a la cuerda en cada instante, así que la cuerda no la frena.' } },
    { p: 'Pateas una pelota quieta y sale disparada. ¿Qué signo tiene el trabajo de tu pie mientras la empuja?', bien: 'Positivo',
      fb: { Negativo: 'Que el pie se detenga después no cuenta: el trabajo se mide mientras empuja, y en ese tramo el pie empuja hacia donde sale la pelota, a favor del avance.', Cero: 'El contacto dura poco, pero en ese tiempo la pelota avanza unos centímetros empujada por el pie, a favor del avance, y ese tramo basta para darle su rapidez.' } },
  ];
  const TXT_SIGNOS = ['Positivo', 'Negativo', 'Cero'];
  const trabajo = {
    id: 'trabajo-y-angulo',
    titulo: 'Trabajo de una fuerza',
    pregunta: '¿Cuánto trabajo hace tu mano cuando jalas una maleta?',
    temas: ['Trabajo de fuerzas constantes y variables'],
    pieza: 'fis-estatica',
    aprendizaje: 'Una fuerza trabaja solo con su parte a lo largo del camino: a favor, positivo; en contra, negativo; de lado, cero, por grande que sea.',
    actividad: 'Jalar una maleta de rueditas por el asa, con más o menos fuerza e inclinación.',
    lee: {
      tarjetas: [
        { titulo: 'Trabajo no es cansancio', texto: 'En la vida diaria, «trabajo» es cualquier esfuerzo que cansa, como estudiar toda una tarde. En física la palabra es más estrecha: mide cuánto ayuda una fuerza a que un cuerpo avance mientras recorre su camino.',
          dibujo: est(figJalon({ ang: 37, alt: 'Una maleta de rueditas jalada por el asa en el pasillo del terminal.' })) },
        { titulo: 'Se mide en joules', texto: ['El trabajo se escribe ', W, ' y se mide en joules (J). Un joule es lo que aporta una fuerza de 1 N que jala en el sentido del avance a lo largo de 1 m: es, más o menos, lo que cuesta subir una manzana chica, de unos 100 g, un metro hacia arriba.'],
          ecuacion: ['1 J = 1 N · 1 m'] },
        { titulo: 'Qué mirar al jugar', texto: ['La flecha ', vec(F), ' es tu jalón y apunta a lo largo del asa. La flecha punteada es la parte de ', vec(F), ' que va a lo largo del piso, la que empuja la maleta hacia adelante. Inclina el asa y mira cómo cambia el largo de la punteada.'] },
      ],
    },
    ejemplos: EJEMPLOS_TRABAJO,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'En el terminal jalas tu maleta 5 m por el piso, tomada del asa. Elige con qué fuerza jalas y cuánto inclinas el asa.',
      mision: {
        texto: 'Haz que tu jalón haga un trabajo de 160 J.',
        // Una sola manera en la grilla: 40 N a 37° (F · cos θ = 32 N; con 0° o 53° no sale).
        logrado: val => Math.abs(val.F * COS[val.ang] * 5 - 160) < 1e-9,
        bien: 'Solo 32 de tus 40 N van por el piso: 32 · 5 = 160 J.',
      },
      voz: 'Inclina el asa. ¿Qué le pasa a la flecha punteada y al trabajo?',
      leyenda: [
        { s: [vec(F)], t: 'tu jalón, a lo largo del asa' },
        { s: 'θ', t: 'ángulo del asa con el piso' },
        { s: 'punteada', t: 'tu jalón a lo largo del piso' },
        { s: 'd', t: 'lo que avanza la maleta: 5 m' },
        { s: W, t: 'trabajo de tu jalón, en joules (J)' },
        { s: 'cos θ', t: '37°: 0,8; 53°: 0,6 (convención del examen)' },
      ],
      controles: [
        { id: 'F', etiqueta: 'Jalón, F', color: 'c-o', min: 10, max: 50, paso: 10, inicio: 20, unidad: 'N', decimales: 0 },
        { id: 'ang', etiqueta: 'Ángulo del asa, θ', opciones: [{ valor: 0, texto: '0°' }, { valor: 37, texto: '37°' }, { valor: 53, texto: '53°' }], inicio: 0 },
      ],
      dibujo: juego1,
      // La lectura enuncia la relación: lo que va a lo largo del piso, por los 5 m.
      lectura: val => { const Fp = val.F * COS[val.ang]; return ['Por el piso van ', pj(N_(Fp)), `: W = ${f(Fp)} · 5 = ${J_(Fp * 5)}`]; },
      resumen: { F: 40, ang: 37 },
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora llevas tu mochila colgada de la mano y caminas 10 m por un piso horizontal, siempre a la misma rapidez. ¿Cuánto trabajo hace tu mano sobre la mochila?',
      datos: ['La mochila pesa 50 N.', 'Tu mano la sostiene hacia arriba con 50 N.', 'Caminas 10 m en horizontal, siempre a la misma rapidez.'],
      opciones: [
        { id: 'c', texto: '0 J', correcta: true },
        { id: 'todo', texto: '500 J', error: 'TR-PERP', siFuera: 'Multiplicar 50 N por 10 m valdría si tu mano empujara hacia donde avanzas. Pero tu mano empuja hacia arriba y la mochila avanza de lado: mira el ángulo entre la fuerza y el camino.' },
        { id: 'neg', texto: '−500 J', error: 'TR-SIGNO', siFuera: 'Saldría negativo si tu mano empujara contra el avance, por ejemplo hacia atrás. Tu mano empuja hacia arriba, de lado al camino, así que no ayuda ni estorba al avance.' },
        { id: 'rapidez', texto: 'Depende de lo rápido que camines', error: 'TR-RAPIDEZ', siFuera: 'La rapidez cambia otras cosas, como el tiempo que tardas, pero el trabajo no la usa: depende solo de la fuerza, de lo que avanzas y del ángulo entre las dos.' },
      ],
      dibujo: est(PRED1),
      revelar: est(REVELA1),
      coincide: 'Coincide: tu mano empuja hacia arriba y la mochila avanza de lado, así que esa fuerza no ayuda al avance y no trabaja, aunque te canse el brazo.',
    },
    mira: {
      pieza: 'ejes',
      datos: MIRA1,
      pasos: [
        { estado: { corte: 0 }, texto: 'En la mochila, tu mano empuja hacia arriba y ninguna parte de esa fuerza va a lo largo del camino: la línea queda en cero y no encierra área.', ecuacion: [W, ' = 50 · 10 · cos 90° = 0'] },
        { estado: { corte: 1 }, texto: 'En la maleta, 32 N de tu jalón van a lo largo del piso durante 5 m, y el área del rectángulo, 32 por 5, es el trabajo.', ecuacion: [W, ' = 40 · 5 · cos 37° = 32 · 5 = 160 J'] },
        { estado: { corte: 2 }, texto: 'Si la fuerza va contra el avance, como el rozamiento, su línea queda bajo el eje y el área cuenta negativa: esa fuerza frena.', ecuacion: [W, ' = 20 · 5 · cos 180° = −100 J'] },
      ],
    },
    regla: {
      texto: 'El trabajo de una fuerza es su parte a lo largo del camino por la distancia d que avanza; esa parte la da el coseno del ángulo. Si la fuerza ayuda al avance, el trabajo es positivo; si lo frena, como el rozamiento, es negativo, y si va de lado, como la normal en un piso plano, es cero.',
      ecuacion: [W, ' = ', F, ' · d · cos θ'],
      condicion: 'la fuerza no cambia de tamaño ni de dirección en el camino y θ se mide entre la fuerza y el avance. Si la fuerza cambia, el trabajo sale del área bajo la gráfica F–x.',
      voz: 'Una fuerza de lado al camino no trabaja, por grande que sea. Mira primero el ángulo.',
      dibujo: est(figJalon({ ang: 37, tF: 'F = 40 N', tC: '32 N', d: 'd = 5 m', alt: 'La maleta jalada con 40 N a 37°: 32 N van a lo largo del piso, durante 5 m.' })),
    },
    // Así se resuelve: el trabajo de una cuerda inclinada (otra lista que «Ahora tú») y, en las semillas impares, el del
    // rozamiento con la cuerda inclinada, que cambia la normal.
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900), ob = r.de(COSAS1_RS);
        if (sm % 2 === 1) {
          const c = elegir(() => { const m = r.de([5, 8, 12]), Fv = r.de([20, 40, 50]), mu = r.de([0.2, 0.25, 0.5]), d = r.de([2, 3, 4]);
            const Nn = m * G - Fv * 0.6, fr = mu * Nn, Wr = -fr * d;
            return Nn > 0 && Fv * 0.8 > fr && exacto(fr) && exacto(Wr) && { m, Fv, mu, d, Nn, fr, Wr }; });
          return {
            enunciado: [`${mayus(ob.n)} de ${c.m} kg es arrastrad${ob.n.startsWith('una') ? 'a' : 'o'} ${c.d} m por el piso con una cuerda que jala con `, pj(N_(c.Fv)), ' a 37° sobre la horizontal. Si ', muk, ` = ${f(c.mu)}, ¿cuánto trabajo hace el rozamiento?`],
            datos: [D.peso, D.comp, D.trig, D.normal, D.cin, D.trabajo],
            dibujo: est(figJalon({ cosa: ob.cosa, ang: 37, tF: `F = ${N_(c.Fv)}`, texto: `${c.m} kg`, d: `d = ${c.d} m`, dcl: { mg: `mg = ${N_(c.m * G)}`, N: 'N = ?', F: `F = ${N_(c.Fv)}`, Fang: 37, f: 'f_k = ?' } })),
            pasos: [
              { tipo: 'pide', texto: 'Piden el trabajo del rozamiento, con su signo: positivo si ayudara al avance y negativo si lo frena.' },
              { tipo: 'datos', texto: [`Masa: ${c.m} kg. Cuerda: `, pj(N_(c.Fv)), ' a 37°. ', muk, ` = ${f(c.mu)}. Recorre ${c.d} m.`] },
              { tipo: 'regla', texto: ['El rozamiento vale ', muk, ' por la normal. La cuerda inclinada levanta un poco el cuerpo, así que el piso lo sostiene menos y la normal queda menor que el peso. Luego, el trabajo es el rozamiento por la distancia, negativo porque va contra el avance.'], ecuacion: [fk, ' = ', muk, ' · ', N] },
              { tipo: 'cuentas', texto: `En lo vertical, la normal y la parte que levanta la cuerda (F · sen 37°) sostienen el peso: N = ${c.m * G} − ${c.Fv} · 0,6 = ${f(c.Nn)} N. Entonces el rozamiento vale ${f(c.mu)} · ${f(c.Nn)} = ${f(c.fr)} N.`, ecuacion: [Wf, ` = −${f(c.fr)} · ${c.d} = `, pr(J_(c.Wr))] },
              { tipo: 'sentido', texto: `Sale negativo porque el rozamiento frena el avance. Con la normal igual al peso habría salido −${f(c.mu * c.m * G * c.d)} J, demasiado, porque se olvida que la cuerda alivia el apoyo en el piso.` },
            ],
            respuesta: [Wf, ' = ', pr(J_(c.Wr))],
          };
        }
        const c = elegir(() => { const Fv = r.de([25, 50, 75]), ang = r.de([37, 53, 60]), d = r.de([4, 6, 8]); const Wv = Fv * d * COS[ang];
          return exacto(Wv) && !(Fv === 50 && ang === 37 && d === 6) && { Fv, ang, d, Wv }; });
        return {
          enunciado: [`Jalas ${ob.n} con una cuerda que forma ${c.ang}° con el piso, con `, pj(N_(c.Fv)), `. Avanza ${c.d} m. ¿Cuánto trabajo hace la cuerda?`],
          datos: [D.trabajo, c.ang === 60 ? D.trig60 : D.trig],
          dibujo: est(figJalon({ cosa: ob.cosa, ang: c.ang, tF: `F = ${N_(c.Fv)}`, d: `d = ${c.d} m`, textos: [{ x: 312, y: 24, texto: 'W = ?', ancla: 'end' }] })),
          pasos: [
            { tipo: 'pide', texto: 'Piden el trabajo de la cuerda, es decir, cuánto ayuda su jalón a que el cuerpo avance.' },
            { tipo: 'datos', texto: ['Cuerda: ', pj(N_(c.Fv)), `, a ${c.ang}° del piso. Avanza ${c.d} m.`] },
            { tipo: 'regla', texto: 'Solo cuenta la parte de la fuerza a lo largo del piso, porque la parte que levanta no hace avanzar el cuerpo. Esa parte es la fuerza por el coseno del ángulo, y se multiplica por la distancia.', ecuacion: [W, ' = ', F, ' · d · cos θ'] },
            { tipo: 'cuentas', texto: `A lo largo del piso van ${c.Fv} · ${COSTXT[c.ang]} = ${f(c.Fv * COS[c.ang])} N, y esa fuerza actúa durante los ${c.d} m.`, ecuacion: [W, ` = ${c.Fv} · ${c.d} · ${COSTXT[c.ang]} = `, pj(J_(c.Wv))] },
            { tipo: 'sentido', texto: `Sale menos que ${c.Fv} · ${c.d} = ${J_(c.Fv * c.d)}, que es lo que daría la misma cuerda tendida a lo largo del piso: al inclinarla, parte del jalón se va en levantar.` },
          ],
          respuesta: [W, ' = ', pj(J_(c.Wv))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4;
        if (k === 0) {
          const ob = r.de(COSAS1_AT);
          const c = elegir(() => { const Fv = r.de([20, 40, 60, 100]), ang = r.de([37, 53, 60]), d = r.de([2, 3, 5, 10]); const Wv = Fv * d * COS[ang];
            return exacto(Wv) && !(Fv === 40 && ang === 37 && d === 5) && distintos(Wv, Fv * d, Fv * d * SEN[ang], Fv * COS[ang]) && { Fv, ang, d, Wv }; });
          return {
            pregunta: [`Jalas ${ob.n} con una cuerda a ${c.ang}° sobre la horizontal, con `, pj(N_(c.Fv)), `, mientras avanza ${c.d} m por el piso. ¿Cuánto trabajo hace la cuerda?`],
            datos: [D.trabajo, c.ang === 60 ? D.trig60 : D.trig],
            dibujo: est(figJalon({ cosa: ob.cosa, ang: c.ang, tF: `F = ${N_(c.Fv)}`, d: `d = ${c.d} m`, textos: [{ x: 312, y: 24, texto: 'W = ?', ancla: 'end' }] })),
            opciones: opciones(c.Wv, [
              { id: 'sin-cos', valor: c.Fv * c.d, error: 'TR-SIN-COS', siFuera: 'Multiplicaste la fuerza entera por la distancia, como si la cuerda fuera paralela al piso. Inclinada, solo su parte a lo largo del piso hace avanzar, y esa parte lleva el coseno.' },
              { id: 'seno', valor: c.Fv * c.d * SEN[c.ang], error: 'TR-SENO', siFuera: 'Usaste el seno, que da la parte de la fuerza que levanta el cuerpo. Esa parte no lo hace avanzar; la que va a lo largo del piso se calcula con el coseno.' },
              { id: 'sin-d', valor: c.Fv * COS[c.ang], error: 'TR-SIN-D', siFuera: 'La parte de la fuerza a lo largo del piso está bien, pero es una fuerza, en newtons, y no un trabajo. Falta multiplicarla por la distancia que avanza.' },
            ], J_),
            solucion: { texto: 'Solo la parte de la fuerza a lo largo del piso hace avanzar el cuerpo, así que esa parte, F · cos θ, se multiplica por la distancia:', ecuacion: [W, ` = ${c.Fv} · ${c.d} · ${COSTXT[c.ang]} = `, pj(J_(c.Wv))] },
          };
        }
        if (k === 1) {
          const s = SIGNOS[Math.floor(sm / 4) % SIGNOS.length], otros = TXT_SIGNOS.filter(t => t !== s.bien);
          return {
            pregunta: [s.p],
            datos: [D.trabajo, D.cosNot],
            opciones: opciones(0, [
              ...otros.map((t, i) => ({ id: `s${i}`, texto: t, error: 'TR-SIGNO', siFuera: s.fb[t] })),
              { id: 'num', texto: 'No se sabe sin los números', error: 'TR-NUM', siFuera: 'Los números dirían cuánto vale el trabajo, pero el signo no los necesita: sale de mirar si la fuerza va a favor del avance, en contra o de lado.' },
            ], () => '', s.bien),
            solucion: { texto: 'El signo sale de comparar la dirección de la fuerza con la del avance: a favor da positivo, en contra da negativo y de lado da cero.', ecuacion: [s.bien] },
          };
        }
        if (k === 2) {
          // Despejar la fuerza con el trabajo, la distancia y el ángulo.
          const ob = r.de(COSAS1_AT);
          const c = elegir(() => { const Fv = r.de([25, 50, 75, 100]), ang = r.de([37, 53]), d = r.de([2, 4, 5, 8]); const Wv = Fv * d * COS[ang];
            return exacto(Wv) && !(Fv === 50 && ang === 37) && distintos(Fv, Wv / d, Wv * COS[ang] / d, Wv / (d * SEN[ang])) && { Fv, ang, d, Wv }; });
          return {
            pregunta: [`Una cuerda a ${c.ang}° del piso arrastra ${ob.n} a lo largo de ${c.d} m y hace un trabajo de `, pj(J_(c.Wv)), '. ¿Con qué fuerza jala la cuerda?'],
            datos: [D.trabajo, D.trig],
            dibujo: est(figJalon({ cosa: ob.cosa, ang: c.ang, tF: 'F = ?', d: `d = ${c.d} m`, textos: [{ x: 312, y: 24, texto: `W = ${J_(c.Wv)}`, ancla: 'end', peso: 400 }] })),
            opciones: opciones(c.Fv, [
              { id: 'sin-cos', valor: c.Wv / c.d, error: 'TR-SIN-COS', siFuera: 'Dividir el trabajo entre la distancia está bien, pero eso da solo la parte de la fuerza a lo largo del piso. Falta dividir entre el coseno para llegar a la fuerza entera de la cuerda.' },
              { id: 'por-cos', valor: c.Wv * COS[c.ang] / c.d, error: 'TR-POR-COS', siFuera: 'Usar el coseno está bien, pero lo multiplicaste. En W = F · d · cos θ el coseno multiplica a F, así que al despejar F se divide entre él.' },
              { id: 'seno', valor: c.Wv / (c.d * SEN[c.ang]), error: 'TR-SENO', siFuera: 'El despeje va bien, pero usaste el seno. La parte de la fuerza que hace avanzar va a lo largo del piso, y esa parte lleva el coseno.' },
            ], N_),
            solucion: { texto: 'De W = F · d · cos θ se despeja F: el trabajo se divide entre la distancia y entre el coseno.', ecuacion: [F, ` = ${f(c.Wv)} ÷ (${c.d} · ${COSTXT[c.ang]}) = `, pj(N_(c.Fv))] },
          };
        }
        // Nivel examen: el collarín de la polea (San Marcos 2026-II) o el rozamiento con la cuerda inclinada (San Marcos 2019-II).
        if (sm % 8 < 4) {
          const c = elegir(() => { const [H, Dh, L] = r.de([[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 6, 10], [12, 5, 13]]), Fv = r.de([20, 30, 40, 60]);
            const Wv = Fv * (L - H);
            return !(H === 3 && Dh === 4 && Fv === 50) && distintos(Wv, Fv * Dh, Fv * L, Fv * H, Fv * Dh * Dh / L) && { H, Dh, L, Fv, Wv }; });
          return {
            pregunta: [`Un collarín, en una varilla horizontal, es jalado por una cuerda que pasa por una polea ${c.H} m arriba; su punta se jala con `, pj(N_(c.Fv)), `. Parte ${c.Dh} m antes de la polea y llega debajo. ¿Cuánto trabaja la cuerda?`],
            datos: [D.pitagoras, D.cuerda, D.trabajo],
            opciones: opciones(c.Wv, [
              { id: 'despl', valor: c.Fv * c.Dh, error: 'TR-COLLARIN', siFuera: 'La fuerza está bien, pero lo que corre el collarín no es el camino de la fuerza. Quien jala la punta recoge cuerda, y cuenta cuánto se acorta el tramo hasta la polea.' },
              { id: 'entera', valor: c.Fv * c.L, error: 'TR-CUERDA', siFuera: 'El tramo inicial de cuerda está bien, pero al final todavía queda cuerda hasta la polea. Lo que se recoge es la diferencia entre el tramo inicial y el final.' },
              { id: 'cos', valor: c.Fv * c.Dh * c.Dh / c.L, error: 'TR-ANGULO-FIJO', siFuera: 'El coseno del comienzo vale solo en ese instante: mientras el collarín avanza, la cuerda se empina y el ángulo cambia. Por eso no sirve un solo ángulo y se cuenta la cuerda recogida.' },
            ], J_),
            solucion: { texto: `Quien jala recoge lo que se acorta el tramo hasta la polea, que pasa de √(${c.Dh}² + ${c.H}²) = ${c.L} m a ${c.H} m:`, ecuacion: [W, ` = ${c.Fv} · (${c.L} − ${c.H}) = `, pj(J_(c.Wv))] },
          };
        }
        const ob = r.de(COSAS1_AT);
        const c = elegir(() => { const m = r.de([10, 15, 20]), Fv = r.de([30, 60, 100]), ang = r.de([37, 53]), mu = r.de([0.1, 0.2, 0.4]), d = r.de([5, 6, 10]);
          const Nn = m * G - Fv * SEN[ang], fr = mu * Nn, Wr = -fr * d;
          return Nn > 0 && Fv * COS[ang] > fr && exacto(Wr) && !(m === 10 && Fv === 50) && distintos(Wr, -mu * m * G * d, -mu * (m * G + Fv * SEN[ang]) * d, fr * d) && { m, Fv, ang, mu, d, Nn, fr, Wr }; });
        return {
          pregunta: [`Arrastras ${ob.n} de ${c.m} kg a lo largo de ${c.d} m con una cuerda que jala con `, pj(N_(c.Fv)), ` a ${c.ang}° sobre la horizontal. Si `, muk, ` = ${f(c.mu)}, ¿cuánto trabajo hace el rozamiento?`],
          datos: [D.peso, D.comp, D.trig, D.normal, D.cin, D.trabajo],
          dibujo: est(figJalon({ cosa: ob.cosa, ang: c.ang, tF: `F = ${N_(c.Fv)}`, texto: `${c.m} kg`, d: `d = ${c.d} m`, dcl: { mg: `mg = ${N_(c.m * G)}`, N: 'N = ?', F: `F = ${N_(c.Fv)}`, Fang: c.ang, f: 'f_k = ?' } })),
          opciones: opciones(c.Wr, [
            { id: 'nmg', valor: -c.mu * c.m * G * c.d, error: 'N-MG', siFuera: 'Multiplicar el coeficiente por la normal está bien, pero la normal no es el peso entero. La cuerda tira un poco hacia arriba, así que el piso empuja menos.' },
            { id: 'suma', valor: -c.mu * (c.m * G + c.Fv * SEN[c.ang]) * c.d, error: 'N-SUMA', siFuera: 'Mirar la parte vertical de la cuerda está bien, pero la sumaste. Esa parte jala hacia arriba y le quita apoyo al piso, así que se resta del peso.' },
            { id: 'signo', valor: c.fr * c.d, error: 'TR-SIGNO', siFuera: 'El tamaño está bien, pero falta el signo: el rozamiento va contra el avance, y una fuerza que frena hace trabajo negativo.' },
          ], J_),
          solucion: { texto: 'La cuerda tira un poco hacia arriba, así que la normal es el peso menos la parte vertical de la cuerda; luego, el rozamiento por la distancia, en contra:', ecuacion: [`N = ${f(c.Nn)} N;   `, Wf, ` = −${f(c.mu)} · ${f(c.Nn)} · ${c.d} = `, pr(J_(c.Wr))] },
        };
      },
    },
  };

  // ---- Barras de energía (bloque de Energía de fis-estatica): una por concepto, a la misma escala, con su valor arriba
  // (abajo si es negativo) y su nombre bajo la base. lista: [{ n: 'E_C', v: 90, c: 'tinta' | 'h' | 'o' | 'i' | 'f', t }]
  function barras(lista, o = {}) {
    const x0 = o.x0 || 250, dx = o.dx || 34, y = o.y || 200, k = o.k || 0.5, w = o.w || 24, objetos = [], textos = [];
    const neg = Math.max(0, ...lista.map(b => (b.v < 0 ? -b.v * k : 0)));
    lista.forEach((b, i) => {
      const x = x0 + i * dx, h = Math.abs(b.v) * k, col = b.c === 'tinta' ? undefined : b.c;
      objetos.push({ tipo: 'barra-e', x, y, w, h, color: b.c || 'tinta', abajo: b.v < 0, vacia: b.vacia, paso: b.paso });
      textos.push({ x, y: b.v < 0 ? y + h + 14 : y - h - 6, texto: b.t || J_(b.v), ancla: 'middle', color: col, peso: 700, paso: b.paso });
      textos.push({ x, y: y + neg + (neg ? 30 : 16), texto: b.n, ancla: 'middle', color: col, peso: 700, paso: b.paso });
    });
    return { objetos, textos };
  }

  // ======================= 2: trabajo neto y energía cinética (el carrito de ladrillos) =======================
  // Cambia: la fuerza y la distancia del empujón · Permanece: el carrito de 20 kg y el piso que casi no frena · Progresa:
  // las barras W y E_C, siempre iguales · Se reserva: el doble de rapidez (Predice) · Debe verse: W_neto = ½mv² − ½mv₀².
  const M2 = 20, PX2 = 26;
  // El carrito empujado desde el reposo: queda al final del empujón, con la cota de lo que lo empujaron.
  function figCarrito(o = {}) {
    const d = o.d === undefined ? 3 : o.d, xc = 50 + PX2 * d, piso = 200, fl = [], txt = (o.textos || []).slice();
    const objs = [{ tipo: 'carrito', x: xc, y: piso, w: 64, h: 30, mango: 0, texto: o.texto || 'ladrillos' }];
    if (o.persona !== false) objs.push({ tipo: 'persona', x: xc - (o.f ? 68 : 54), y: piso, alto: 92, mira: 1, mano: [xc - 32, piso - 26] });
    if (o.F) fl.push({ de: [xc - 14, 150], ang: 0, largo: 30, color: 'o', texto: o.F, rumbo: [0.4, -1] });
    // el rótulo del rozamiento, arriba a la izquierda: junto a su flecha caía sobre la pierna o el piso (lector A)
    if (o.f) { fl.push({ de: [xc - 33, 194], ang: 180, largo: 22, color: 'i', texto: 'f⃗', rumbo: [0.2, -1] }); txt.push({ x: 8, y: 48, texto: `piso: ${o.f}`, ancla: 'start', color: 'i' }); }
    if (o.v) fl.push({ de: [xc - 14, 104], ang: 0, largo: 36, color: 'tinta', texto: o.v, rumbo: [1, -0.4] });
    const b = o.barras ? barras(o.barras, { x0: o.bx0 || 238, dx: o.dx || 40, y: piso, k: o.k || 0.7 }) : { objetos: [], textos: [] };
    return { alto: o.alto || (o.barras && o.barras.some(x => x.v < 0) ? 266 : o.f ? 256 : 244), piso: { y: piso, x0: 8, x1: o.barras ? 214 : 312 }, objetos: [...objs, ...b.objetos], flechas: fl, textos: [...txt, ...b.textos],
      lineas: [{ de: [18, 150], a: [18, 198] }], cotas: o.sinCota ? [] : [{ de: [18, piso], a: [18 + PX2 * d, piso], texto: o.tD || `d = ${f(d)} m`, lado: 1, sep: 16 }], alt: o.alt };
  }
  const v2 = val => Math.sqrt(2 * val.F * val.d / M2);
  const vTxt = v => (exacto(v) ? `v = ${MS(v)}` : `v ≈ ${MS(v)}`);
  const juego2 = val => { const Wv = val.F * val.d, v = v2(val);
    return est(figCarrito({ d: val.d, F: `F = ${val.F} N`, v: vTxt(v), barras: [{ n: 'W', v: Wv, c: 'o' }, { n: 'E_C', v: Wv, c: 'tinta' }],
      alt: `Un carrito de 20 kg empujado desde el reposo con ${val.F} N a lo largo de ${val.d} m: el trabajo es ${Wv} J y sale con ${Wv} J de energía cinética.` })); };
  const PRED2 = figCarrito({ d: 3, persona: true, sinCota: true, v: 'v = 6 m/s', textos: [{ x: 312, y: 24, texto: 'del reposo a 6 m/s: W = ?', ancla: 'end', peso: 400 }],
    alt: 'El carrito de 20 kg, que debe pasar del reposo a 6 m/s. El trabajo que hace falta, con un signo de pregunta.' });
  const REVELA2 = figCarrito({ d: 3, sinCota: true, v: 'v = 6 m/s', barras: [{ n: '3 m/s', v: 90 }, { n: '6 m/s', v: 360 }], k: 0.33, bx0: 240, dx: 48,
    alt: 'Del reposo a 3 m/s hacen falta 90 J; a 6 m/s, 360 J: cuatro veces más.' });
  const MIRA2 = { alto: 266, piso: { y: 200, x0: 8, x1: 214 }, objetos: [], cortes: [
    figCarrito({ d: 3, v: 'v = 3 m/s', barras: [{ n: '3 m/s', v: 90 }], k: 0.33, bx0: 240, dx: 48 }),
    figCarrito({ d: 3, v: 'v = 6 m/s', barras: [{ n: '3 m/s', v: 90 }, { n: '6 m/s', v: 360 }], k: 0.33, bx0: 240, dx: 48 }),
    figCarrito({ d: 3, F: 'F = 30 N', f: 'f = 10 N', barras: [{ n: 'W_F', v: 90, c: 'o' }, { n: 'W_f', v: -30, c: 'i' }], k: 0.7, bx0: 228, dx: 36 }),
    figCarrito({ d: 3, F: 'F = 30 N', f: 'f = 10 N', v: 'v ≈ 2,45 m/s', barras: [{ n: 'W_F', v: 90, c: 'o' }, { n: 'W_f', v: -30, c: 'i' }, { n: 'E_C', v: 60 }], k: 0.7, bx0: 228, dx: 36 }),
  ], alt: 'Del reposo a 3 m/s el carrito lleva 90 J; a 6 m/s, 360 J. Con un piso que frena 10 N, el trabajo neto es 60 J y eso es lo que lleva.' };
  // Una gráfica de ejemplo para «Lee»: la fuerza crece y después se queda (no es la de la misión).
  const LEE2 = grafica([[0, 0], [2, 20], [5, 20]], { areas: [{ puntos: [[0, 0], [2, 20]], rotulo: '20 J' }, { puntos: [[2, 20], [5, 20]], rotulo: '60 J' }] });

  const D2 = {
    ec: ['Energía cinética: ', EC, ' = ½ · m · v²'],
    teorema: ['Trabajo neto: ', Wneto, ' = ½ · m · v² − ½ · m · v₀² (v₀ al empezar, v al final)'],
    suma: [Wneto, ': la suma, con su signo, de los trabajos de todas las fuerzas'],
    trabajo: D.trabajo,
    cin: D.cin, peso: D.peso, normal: D.normal, cosNot: D.cosNot,
    area: D.area, triangulo: D.triangulo,
    reposo: 'Desde el reposo, con a constante: v = a · t y d = a · t² / 2',
    segunda: 'Segunda ley: ΣF = m · a',
    kmh: '36 km/h = 10 m/s y 72 km/h = 20 m/s',
  };

  // Ejemplos resueltos de la idea 2. Cuentas rehechas aparte (scratchpad e8-fisica/cuentas.js: la energía cinética con
  // ½ · m · v² en cada punto y el trabajo de cada fuerza por separado; la frenada y el MRUV integrados paso a paso; las
  // áreas por trapecios): ½·2000·10²; ½·0,4·20²; ½·4·5²; √36; 80 − 30; (50 − 20)·6 = ½·10·v²; 200 000/8000;
  // ½·80·(10² − 5²); 10·4; 30 + 120 = ½·3·v²; 10²/(2·10·25) y cada alternativa; 4·2·9 y cada alternativa;
  // ½·0,4·(15² − 5²) y cada alternativa; 9 + 30 + 10 = ½·2·v² y cada alternativa; 40·(5 − 4) = ½·5·v² y cada alternativa.
  const caja2 = (o = {}) => est({ alto: 214, piso: { y: 170, x0: 8, x1: 312 }, objetos: [Object.assign({ tipo: 'caja', x: 90, y: 170, w: 60, h: 40 }, o.cosa || {})],
    flechas: o.flechas || [], textos: o.textos || [], cotas: o.cotas || [], alt: o.alt });
  const EJEMPLOS_CINETICA = [
    { nivel: 1, titulo: 'La energía de la combi',
      figura: est({ alto: 170, piso: { y: 150, x0: 8, x1: 312 }, objetos: [{ tipo: 'auto', x: 130, y: 150, w: 110, texto: 'COMBI' }],
        flechas: [{ de: [100, 92], ang: 0, largo: 44, color: 'tinta', texto: 'v = 10 m/s', rumbo: [1, -0.3] }], textos: [{ x: 8, y: 24, texto: 'E_C = ?', ancla: 'start' }],
        alt: 'Una combi de 2000 kg que va a 10 m/s; su energía cinética, con un signo de pregunta.' }),
      enunciado: ['Una combi de 2000 kg, con sus pasajeros, va a 10 m/s. ¿Cuánta energía cinética tiene?'],
      datos: [D2.ec],
      solucion: [{ texto: 'La energía cinética es la mitad de la masa por la rapidez al cuadrado; con la masa en kilogramos y la rapidez en m/s, sale en joules:', ecuacion: [EC, ' = ½ · 2000 · 10² = ', neg('100 000 J')] }],
      respuesta: [EC, ' = ', neg('100 000 J')] },
    { nivel: 1, titulo: 'La pelota pateada',
      figura: est({ alto: 150, piso: { y: 130, x0: 8, x1: 312 }, objetos: [{ tipo: 'pelota', x: 120, y: 90, r: 12 }],
        flechas: [{ de: [136, 90], ang: 0, largo: 44, color: 'tinta', texto: 'v = 20 m/s', rumbo: [1, -0.3] }], textos: [{ x: 8, y: 24, texto: '0,4 kg; E_C = ?', ancla: 'start' }],
        alt: 'Una pelota de 0,4 kg que sale a 20 m/s.' }),
      enunciado: ['Una pelota de fútbol de 0,4 kg sale disparada a 20 m/s. ¿Cuánta energía cinética lleva?'],
      datos: [D2.ec],
      solucion: [{ texto: 'La rapidez va al cuadrado, así que primero se eleva 20 al cuadrado y después se multiplica por la mitad de la masa:', ecuacion: [EC, ' = ½ · 0,4 · 20² = ', neg('80 J')] }],
      respuesta: [EC, ' = ', neg('80 J')] },
    { nivel: 1, titulo: 'Del reposo a 5 m/s',
      figura: est(figCarrito({ d: 2, persona: true, sinCota: true, texto: '4 kg', v: 'v = 5 m/s', textos: [{ x: 312, y: 24, texto: 'del reposo; W neto = ?', ancla: 'end', peso: 400 }],
        alt: 'Un carrito de 4 kg que pasa del reposo a 5 m/s.' })),
      enunciado: ['Un carrito de 4 kg pasa del reposo a 5 m/s. ¿Cuánto trabajo neto se hizo sobre él?'],
      datos: [D2.teorema],
      solucion: [{ texto: 'Al empezar estaba quieto y no tenía energía cinética, así que el trabajo neto es toda la que tiene al final.', ecuacion: [Wneto, ' = ½ · 4 · 5² − 0 = ', neg('50 J')] }],
      respuesta: [Wneto, ' = ', neg('50 J')] },
    { nivel: 1, titulo: 'La rapidez con 36 J',
      figura: caja2({ cosa: { texto: '2 kg' }, flechas: [{ de: [124, 140], ang: 0, largo: 40, color: 'tinta', texto: 'v = ?', rumbo: [1, -0.3] }], textos: [{ x: 312, y: 24, texto: 'E_C = 36 J', ancla: 'end' }],
        alt: 'Un bloque de 2 kg con 36 J de energía cinética; su rapidez, con un signo de pregunta.' }),
      enunciado: ['Un bloque de 2 kg desliza con 36 J de energía cinética. ¿Con qué rapidez va?'],
      datos: [D2.ec],
      solucion: [{ texto: 'Se iguala la fórmula de la energía cinética a los 36 J y se despeja v, sacando la raíz al final:', ecuacion: ['½ · 2 · v² = 36;   v² = 36;   v = ', neg('6 m/s')] }],
      respuesta: ['v = ', neg('6 m/s')] },
    { nivel: 1, titulo: 'Sumar los trabajos',
      figura: caja2({ cosa: { texto: 'caja' }, textos: [{ x: 312, y: 24, texto: 'W neto = ?', ancla: 'end' }, { x: 312, y: 56, texto: 'W_F = 80 J', ancla: 'end', color: 'o' }, { x: 312, y: 80, texto: 'W_f = −30 J', ancla: 'end', color: 'i' }],
        flechas: [{ de: [120, 150], ang: 0, largo: 34, color: 'o', texto: 'F⃗', rumbo: [0.5, -1] }, { de: [60, 162], ang: 180, largo: 30, color: 'i', texto: 'f⃗', rumbo: [-0.3, -1] }],
        alt: 'Una caja: la fuerza que la empuja trabaja 80 J y el rozamiento, −30 J.' }),
      enunciado: ['Sobre una caja que avanza por un piso horizontal, tu empujón trabaja ', pj('80 J'), ' y el rozamiento ', pr('−30 J'), '. El peso y la normal no trabajan. ¿Cuánto vale el trabajo neto?'],
      datos: [D2.suma],
      solucion: [{ texto: 'El trabajo neto suma el de todas las fuerzas con su signo: el rozamiento resta porque frena, y el peso y la normal suman 0 porque van de lado al avance:', ecuacion: [Wneto, ' = 80 − 30 + 0 + 0 = ', neg('50 J')] }],
      respuesta: [Wneto, ' = ', neg('50 J')] },
    { nivel: 2, titulo: 'Empujar contra el rozamiento',
      figura: est(figCarrito({ d: 4, persona: true, texto: '10 kg', F: 'F = 50 N', f: 'f = 20 N', tD: 'd = 6 m', textos: [{ x: 312, y: 24, texto: 'del reposo; v = ?', ancla: 'end', peso: 400 }],
        alt: 'Una caja de 10 kg empujada desde el reposo con 50 N a lo largo de 6 m; el piso la frena con 20 N.' })),
      enunciado: ['Empujas desde el reposo una carretilla de 10 kg con ', pj('50 N'), ' a lo largo de 6 m, y el piso la frena con ', pr('20 N'), '. ¿Con qué rapidez queda?'],
      datos: [D2.suma, D2.teorema],
      solucion: [
        { texto: 'Tu empujón ayuda al avance y suma; el rozamiento lo frena y resta:', ecuacion: [Wneto, ' = 50 · 6 − 20 · 6 = 180 J'] },
        { texto: 'Como partió del reposo, todo ese trabajo neto queda como energía cinética al final:', ecuacion: ['½ · 10 · v² = 180;   v² = 36;   v = ', neg('6 m/s')] },
      ],
      respuesta: ['v = ', neg('6 m/s')] },
    { nivel: 2, titulo: 'La frenada del auto',
      figura: est({ alto: 170, piso: { y: 150, x0: 8, x1: 312 }, objetos: [{ tipo: 'auto', x: 80, y: 150, w: 84 }],
        flechas: [{ de: [60, 98], ang: 0, largo: 44, color: 'tinta', texto: 'v = 20 m/s', rumbo: [1, -0.3] }], cotas: [{ de: [122, 150], a: [300, 150], texto: 'd = ?', lado: 1, sep: 18 }],
        textos: [{ x: 312, y: 24, texto: 'frenos: f = 8000 N', ancla: 'end', color: 'i' }], alt: 'Un auto de 1000 kg a 20 m/s frena con una fuerza de 8000 N.' }),
      enunciado: ['Un auto de 1000 kg va a 20 m/s. Frena con una fuerza de ', pr('8000 N'), ' hasta detenerse. ¿Qué distancia recorre frenando?'],
      datos: [D2.teorema, D2.trabajo, D2.cosNot],
      solucion: [
        { texto: 'Al detenerse, el auto pierde toda su energía cinética, así que el trabajo neto es negativo:', ecuacion: [Wneto, ' = 0 − ½ · 1000 · 20² = −200 000 J'] },
        { texto: 'Los frenos son la única fuerza que trabaja, y van contra el avance; su trabajo, −8000 · d, tiene que valer eso:', ecuacion: ['−8000 · d = −200 000;   d = ', neg('25 m')] },
      ],
      respuesta: ['d = ', neg('25 m')] },
    { nivel: 2, titulo: 'Acelerar la bicicleta',
      enunciado: ['Una ciclista y su bicicleta suman 80 kg. Pedaleando, pasan de 5 m/s a 10 m/s. ¿Cuánto trabajo neto se hizo sobre ellas?'],
      datos: [D2.teorema],
      solucion: [
        { texto: 'Primero se calcula la energía cinética al final y al empezar, cada una con su rapidez:', ecuacion: ['½ · 80 · 10² = 4000 J;   ½ · 80 · 5² = 1000 J'] },
        { texto: 'El trabajo neto es lo que ganó la energía cinética, la final menos la del comienzo:', ecuacion: [Wneto, ' = 4000 − 1000 = ', neg('3000 J')] },
      ],
      respuesta: [Wneto, ' = ', neg('3000 J')] },
    { nivel: 2, titulo: 'Frenar desde el doble',
      figura: est({ alto: 170, piso: { y: 150, x0: 8, x1: 312 }, objetos: [{ tipo: 'auto', x: 70, y: 150, w: 84 }],
        flechas: [{ de: [50, 98], ang: 0, largo: 44, color: 'tinta', texto: '72 km/h', rumbo: [1, -0.3] }], textos: [{ x: 312, y: 24, texto: 'a 36 km/h frena en 10 m', ancla: 'end', peso: 400 }, { x: 312, y: 48, texto: 'a 72 km/h: ?', ancla: 'end', peso: 400 }],
        alt: 'Un auto que a 36 km/h frena en 10 m; ahora va a 72 km/h con los mismos frenos.' }),
      enunciado: ['Un auto que va a 36 km/h frena en 10 m. Con los mismos frenos, que empujan siempre igual, ¿en cuántos metros frena si va a 72 km/h?'],
      datos: [D2.teorema, D2.trabajo, D2.kmh],
      solucion: [
        { texto: 'A 72 km/h el auto va al doble de rapidez, y como la energía cinética va con v², tiene cuatro veces la energía que los frenos deben quitar:', ecuacion: ['(20/10)² = 4'] },
        { texto: 'Los frenos quitan la misma energía en cada metro, así que para quitar cuatro veces la energía hace falta cuatro veces el camino:', ecuacion: ['d = 4 · 10 = ', neg('40 m')] },
      ],
      respuesta: ['d = ', neg('40 m')] },
    { nivel: 2, titulo: 'La gráfica y la rapidez',
      figura: plano(grafica([[0, 0], [2, 30], [6, 30]])),
      enunciado: ['Un carrito de 3 kg parte del reposo. La fuerza neta crece de 0 a ', pj('30 N'), ' en los primeros 2 m y sigue en 30 N hasta los 6 m. ¿Con qué rapidez llega a los 6 m?'],
      datos: [D2.area, D2.triangulo, D2.teorema],
      solucion: [
        { texto: 'Como la fuerza cambia, su trabajo es el área bajo la gráfica, que se parte en un triángulo de 0 a 2 m y un rectángulo de 2 a 6 m:', ecuacion: [W, ' = 2 · 30 / 2 + 4 · 30 = 30 + 120 = 150 J'] },
        { texto: 'Como partió del reposo, ese trabajo neto es toda su energía cinética:', ecuacion: ['½ · 3 · v² = 150;   v² = 100;   v = ', neg('10 m/s')] },
      ],
      respuesta: ['v = ', neg('10 m/s')] },
    { nivel: 3, titulo: 'El rozamiento con la frenada', fuente: 'Parecida a San Marcos 2024-I, pregunta 89.',
      figura: caja2({ cosa: { texto: 'caja' }, flechas: [{ de: [124, 140], ang: 0, largo: 40, color: 'tinta', texto: 'v₀ = 10 m/s', rumbo: [1, -0.3] }],
        cotas: [{ de: [60, 170], a: [300, 170], texto: 'se detiene en 25 m', lado: 1, sep: 18 }], textos: [{ x: 8, y: 24, texto: 'μ_k = ?', ancla: 'start' }],
        alt: 'Una caja que desliza a 10 m/s y se detiene en 25 m.' }),
      enunciado: ['Una caja desliza por un piso horizontal a 10 m/s y el rozamiento la detiene en 25 m. ¿Cuánto vale el coeficiente de rozamiento cinético?'],
      alternativas: ['0,4', '0,02', '0,2', '5', '0,04'],
      datos: [D2.teorema, D2.cin, D2.peso, D2.normal, D2.trabajo],
      solucion: [
        { texto: ['La normal y el peso no trabajan porque van de lado; solo trabaja el rozamiento, ', muk, ' · m · g, en contra del avance, y quita toda la energía cinética:'], ecuacion: ['−', muk, ' · m · 10 · 25 = 0 − ½ · m · 10²'] },
        { texto: 'La masa aparece en los dos lados y se cancela, así que no hace falta conocerla:', ecuacion: [muk, ' = ', frac('100', '2 · 10 · 25'), ' = ', neg('0,2')] },
        { texto: [neg('A'), ' olvida el 2 que deja el ½ al despejar; ', neg('B'), ' usa v en vez de v²; ', neg('D'), ' despeja al revés y pone arriba lo que iba abajo; ', neg('E'), ' olvida el 2 y también el cuadrado.'] },
      ],
      respuesta: [neg('C'), ': ', muk, ' = ', neg('0,2')] },
    { nivel: 3, titulo: 'Trabajo neto con distancia y tiempo', fuente: 'Parecida a San Marcos 2025-II, pregunta 91.',
      figura: caja2({ cosa: { texto: '4 kg' }, cotas: [{ de: [60, 170], a: [300, 170], texto: 'd = 9 m en 3 s', lado: 1, sep: 18 }], textos: [{ x: 8, y: 24, texto: 'parte del reposo; W neto = ?', ancla: 'start', peso: 400 }],
        alt: 'Un bloque de 4 kg que parte del reposo y recorre 9 m en 3 s.' }),
      enunciado: ['Un bloque de 4 kg parte del reposo y, empujado por una fuerza neta constante, recorre 9 m en 3 s. ¿Cuánto trabajo neto se hizo sobre él?'],
      alternativas: ['108 J', '36 J', '24 J', '18 J', '72 J'],
      datos: [D2.reposo, D2.segunda, D2.teorema],
      solucion: [
        { texto: 'La fuerza neta es constante, así que la aceleración también lo es; de d = a · t² / 2 sale la aceleración, y con ella la rapidez final:', ecuacion: ['a = ', frac('2 · 9', '3²'), ' = 2 m/s²;   v = 2 · 3 = 6 m/s'] },
        { texto: 'Como partió del reposo, el trabajo neto es toda la energía cinética final:', ecuacion: [Wneto, ' = ½ · 4 · 6² = ', neg('72 J')] },
        { texto: [neg('A'), ' toma d ÷ t, que es la velocidad media, como si fuera la aceleración; ', neg('B'), ' olvida el 2 de d = a · t² / 2; ', neg('C'), ' calcula m · a · t, que no es un trabajo; ', neg('D'), ' usa la velocidad media, 3 m/s, como si fuera la final.'] },
      ],
      respuesta: [neg('E'), ': ', neg('72 J')] },
    { nivel: 3, titulo: 'De A a B', fuente: 'Parecida a San Marcos 2025-I, pregunta 91.',
      figura: est({ alto: 170, piso: { y: 150, x0: 8, x1: 312 }, objetos: [{ tipo: 'pelota', x: 60, y: 120, r: 10 }, { tipo: 'pelota', x: 250, y: 60, r: 10 }],
        lineas: [{ de: [70, 116], a: [240, 64] }], textos: [{ x: 60, y: 100, texto: 'A: 5 m/s', ancla: 'middle' }, { x: 250, y: 40, texto: 'B: 15 m/s', ancla: 'middle' }],
        alt: 'Una pelota de 0,4 kg pasa por A a 5 m/s y por B a 15 m/s.' }),
      enunciado: ['Una pelota de 0,4 kg pasa por el punto A a 5 m/s y, más tarde, por el punto B a 15 m/s. ¿Cuánto trabajo neto se hizo sobre ella de A a B?'],
      alternativas: ['40 J', '45 J', '20 J', '80 J', '5 J'],
      datos: [D2.teorema],
      solucion: [
        { texto: 'Primero, la energía cinética en B y en A, cada una con su rapidez al cuadrado:', ecuacion: ['½ · 0,4 · 15² = 45 J;   ½ · 0,4 · 5² = 5 J'] },
        { texto: 'El trabajo neto es lo que ganó la energía cinética de A a B:', ecuacion: [Wneto, ' = 45 − 5 = ', neg('40 J')] },
        { texto: [neg('B'), ' da solo la energía en B, sin restar la que traía en A; ', neg('C'), ' resta las rapideces antes de elevar al cuadrado; ', neg('D'), ' olvida el ½ de la energía cinética; ', neg('E'), ' da la energía en A.'] },
      ],
      respuesta: [neg('A'), ': ', neg('40 J')] },
    { nivel: 3, titulo: 'La gráfica con rapidez al empezar',
      figura: plano(grafica([[0, 10], [3, 10], [5, 0]])),
      enunciado: ['Un carrito de 2 kg pasa por x = 0 a 3 m/s, empujado a favor del avance por la fuerza neta de la gráfica. ¿Con qué rapidez pasa por x = 5 m?'],
      alternativas: ['6,32 m/s', '7 m/s', '9,32 m/s', '6,24 m/s', '49 m/s'],
      datos: [D2.area, D2.triangulo, D2.teorema],
      solucion: [
        { texto: 'El trabajo de la fuerza es el área bajo la gráfica: un rectángulo de 0 a 3 m y un triángulo de 3 a 5 m.', ecuacion: [W, ' = 10 · 3 + 2 · 10 / 2 = 40 J'] },
        { texto: 'El carrito ya traía energía cinética a 3 m/s, y el trabajo se le suma a esa energía:', ecuacion: ['½ · 2 · v² = ½ · 2 · 3² + 40 = 49;   v = ', neg('7 m/s')] },
        { texto: [neg('A'), ' olvida la energía que el carrito ya traía; ', neg('C'), ' suma rapideces, 3 + 6,32, cuando lo que se suma son energías; ', neg('D'), ' olvida el área del triángulo; ', neg('E'), ' no saca la raíz y da v².'] },
      ],
      respuesta: [neg('B'), ': ', neg('7 m/s')] },
    { nivel: 3, titulo: 'La rapidez del collarín', fuente: 'Parecida a San Marcos 2026-II, pregunta 81.',
      figura: est({ alto: 226, objetos: [{ tipo: 'barra', de: [20, 170], a: [300, 170], grosor: 6 }, { tipo: 'polea', c: [200, 60], r: 12 }, { tipo: 'caja', x: 110, y: 178, w: 26, h: 16, texto: '' },
        { tipo: 'cuerda', de: [110, 164], a: [190, 66] }, { tipo: 'cuerda', de: [212, 60], a: [282, 60] }],
        flechas: [{ de: [282, 60], ang: 0, largo: 18, color: 'o', texto: 'F = 40 N', rumbo: [-0.2, -1] }],
        cotas: [{ de: [110, 186], a: [200, 186], texto: '3 m', lado: 1, sep: 8 }, { de: [230, 60], a: [230, 170], texto: '4 m', lado: -1, sep: 0 }],
        lineas: [{ de: [200, 72], a: [200, 166] }], textos: [{ x: 8, y: 24, texto: '5 kg; parte del reposo; v = ?', ancla: 'start', peso: 400 }],
        alt: 'Un collarín de 5 kg en una varilla horizontal lisa, jalado por una cuerda que pasa por una polea 4 m más arriba; parte 3 m antes de quedar debajo de la polea.' }),
      enunciado: ['Un collarín de 5 kg parte del reposo en una varilla horizontal sin rozamiento, 3 m antes de una polea que está 4 m arriba. La cuerda lo jala con ', pj('40 N'), '. ¿Qué rapidez tiene debajo de la polea?'],
      alternativas: ['6,93 m/s', '16 m/s', '8,94 m/s', '4 m/s', '5,37 m/s'],
      datos: [D.pitagoras, D.cuerda, D2.teorema],
      solucion: [
        { texto: 'El tramo de cuerda hasta la polea pasa de √(3² + 4²) = 5 m a 4 m, así que quien jala recoge 1 m y la cuerda trabaja 40 · 1 = 40 J.' },
        { texto: 'La varilla no tiene rozamiento y el peso y la normal van de lado al avance, así que ese es el único trabajo, y es toda la energía cinética:', ecuacion: ['½ · 5 · v² = 40;   v² = 16;   v = ', neg('4 m/s')] },
        { texto: [neg('A'), ' multiplica por los 3 m que corre el collarín y no por la cuerda recogida; ', neg('B'), ' no saca la raíz; ', neg('C'), ' usa la cuerda entera, 5 m, como si se recogiera toda; ', neg('E'), ' usa el ángulo del comienzo en todo el camino, aunque la cuerda se empina.'] },
      ],
      respuesta: [neg('D'), ': ', neg('4 m/s')] },
  ];

  // Casos de «Ahora tú» y «Así se resuelve», de listas distintas. Ninguno es el de Predice (20 kg de 0 a 6 m/s), el de la
  // misión (90 J para 3 m/s) ni el de un ejemplo.
  const COSAS2_AT = [{ n: 'un carrito', m: [20, 30, 40], v0: [1, 2], v: [3, 4, 5] }, { n: 'una bicicleta con su ciclista', m: [60, 70], v0: [2, 4], v: [6, 8] },
    { n: 'una pelota', m: [0.4, 0.5], v0: [5, 10], v: [15, 20] }];
  const COSAS2_RS = [{ n: 'un trineo', m: [10, 15], v0: [1, 3], v: [4, 5] }, { n: 'una moto con su piloto', m: [200, 250], v0: [5, 10], v: [15, 20] }];
  const teorema = {
    id: 'trabajo-energia-cinetica',
    titulo: 'Trabajo neto y energía cinética',
    pregunta: '¿Qué le hace el trabajo neto a la rapidez de un cuerpo?',
    temas: ['Teorema trabajo-energía cinética', 'Trabajo de fuerzas constantes y variables'],
    pieza: 'fis-estatica',
    aprendizaje: 'El trabajo neto es lo que gana la energía cinética, ½ · m · v²: el doble de rapidez pide cuatro veces el trabajo.',
    actividad: 'Empujar desde el reposo un carrito de ladrillos, con más o menos fuerza y distancia.',
    lee: {
      tarjetas: [
        { titulo: 'Energía de movimiento', texto: ['Todo lo que se mueve lleva energía, como una combi en la avenida o una piedra que rueda cerro abajo: si choca con algo, lo empuja o lo rompe. Esa energía de movimiento se llama energía cinética, ', EC, ', y se mide en joules, como el trabajo.'],
          dibujo: est(figCarrito({ d: 2, sinCota: true, v: 'v⃗', alt: 'Un carrito de ladrillos empujado por una persona en la obra.' })) },
        { titulo: 'Varias fuerzas a la vez', texto: ['Sobre el carrito actúan varias fuerzas a la vez: tu empujón, el peso, la normal y lo poco que frena el piso. Cada una hace su propio trabajo, con su signo, y la suma de todos esos trabajos se llama trabajo neto, ', Wneto, '.'] },
        { titulo: 'Si la fuerza cambia', texto: ['A veces la fuerza cambia mientras el cuerpo avanza, y ya no basta multiplicar una sola fuerza por la distancia. Entonces su trabajo es el área bajo la gráfica F–x, que muestra la fuerza a lo largo del camino en cada posición x, porque cada tramo chico aporta su fuerza por su largo.'],
          dibujo: plano(LEE2) },
        { titulo: 'Qué mirar al jugar', texto: ['Compara las dos barras: una es el trabajo de tu empujón, ', W, ', y la otra es la energía cinética con que sale el carrito, ', EC, '. Mira también la rapidez con que sale cada vez.'] },
      ],
    },
    ejemplos: EJEMPLOS_CINETICA,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'En la obra empujas desde el reposo un carrito de ladrillos de 20 kg; el piso casi no frena. Elige tu fuerza y la distancia.',
      mision: {
        texto: 'Haz que el carrito salga a 3 m/s.',
        // Una sola manera en la grilla: 30 N a lo largo de 3 m (90 J).
        logrado: val => Math.abs(val.F * val.d - 90) < 1e-9,
        bien: 'Sale a 3 m/s: los 90 J de tu empujón son ahora su energía cinética.',
      },
      voz: '¿Cómo son las dos barras? ¿Y qué pasa con la rapidez?',
      leyenda: [
        { s: [vec(F)], t: 'tu empujón sobre el carrito' },
        { s: 'd', t: 'lo que lo empujas' },
        { s: W, t: 'trabajo de tu empujón' },
        { s: EC, t: 'energía cinética: la de su movimiento' },
        { s: 'v', t: 'rapidez cuando lo sueltas' },
      ],
      controles: [
        { id: 'F', etiqueta: 'Empujón, F', color: 'c-o', min: 10, max: 40, paso: 10, inicio: 10, unidad: 'N', decimales: 0 },
        { id: 'd', etiqueta: 'Distancia, d', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'm', decimales: 0 },
      ],
      dibujo: juego2,
      // La lectura enuncia la relación: el trabajo del empujón y la rapidez con que sale.
      lectura: val => { const v = v2(val); return [`W = ${val.F} · ${val.d} = ${J_(val.F * val.d)}: sale a ${exacto(v) ? '' : '≈ '}${MS(v)}`]; },
      resumen: { F: 20, d: 2 },
      minimo: 3,
    },
    predice: {
      pregunta: 'Para llevar el carrito del reposo a 3 m/s hicieron falta 90 J. ¿Cuánto trabajo hace falta para llevarlo del reposo a 6 m/s?',
      datos: ['Del reposo a 3 m/s: 90 J de trabajo.', 'Es el mismo carrito de 20 kg.', 'El piso casi no frena.'],
      opciones: [
        { id: 'c', texto: '360 J', correcta: true },
        { id: 'doble', texto: '180 J', error: 'TE-LINEAL', siFuera: 'Parece que el doble de rapidez pide el doble de trabajo, pero la energía cinética crece con el cuadrado de la rapidez: al doble de v le toca cuatro veces la energía.' },
        { id: 'igual', texto: '90 J', error: 'TE-IGUAL', siFuera: 'El carrito es el mismo, pero a 6 m/s lleva más energía de movimiento que a 3 m/s, y cada joule de más tiene que venir de un trabajo.' },
        { id: 'tiempo', texto: 'Depende de cuánto tarde', error: 'TE-TIEMPO', siFuera: 'Tardar más o menos cambia la fuerza que necesitas, pero no el trabajo: el trabajo neto depende solo de la rapidez al empezar y al final.' },
      ],
      dibujo: est(PRED2),
      revelar: est(REVELA2),
      coincide: 'Coincide: como la energía cinética va con el cuadrado de la rapidez, el doble de rapidez es cuatro veces la energía, y hace falta cuatro veces el trabajo.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: MIRA2,
      pasos: [
        { estado: { corte: 0 }, texto: 'A 3 m/s, el carrito de 20 kg lleva 90 J de energía cinética, que es justo el trabajo que hizo falta para darle esa rapidez.', ecuacion: [EC, ' = ½ · 20 · 3² = 90 J'] },
        { estado: { corte: 1 }, texto: 'A 6 m/s lleva el doble de rapidez y cuatro veces la energía, porque la rapidez entra al cuadrado: 6² es cuatro veces 3².', ecuacion: [EC, ' = ½ · 20 · 6² = 360 J'] },
        { estado: { corte: 2 }, texto: 'Si el piso frena con 10 N, tu empujón suma su trabajo y el rozamiento resta el suyo, porque va contra el avance.', ecuacion: [Wneto, ' = 30 · 3 − 10 · 3 = 60 J'] },
        { estado: { corte: 3 }, texto: 'La energía cinética gana justo ese trabajo neto, 60 J, y no los 90 J del empujón: por eso el carrito sale más lento.', ecuacion: ['½ · 20 · v² = 60 J;   v ≈ 2,45 m/s'] },
      ],
    },
    regla: {
      texto: 'La energía cinética es la que tiene un cuerpo por moverse y crece con el cuadrado de la rapidez. El trabajo neto, la suma de los trabajos de las fuerzas, es lo que gana o pierde esa energía: si es positivo, acelera, y si es negativo, frena. Si la fuerza cambia, el área bajo F–x da ese trabajo.',
      ecuacion: [Wneto, ' = ½ · m · v² − ½ · m · v₀²', '   ;   ', EC, ' = ½ · m · v²'],
      condicion: 'se suman los trabajos de todas las fuerzas, también los negativos, con v₀ al empezar y v al final. Si se olvida una fuerza que frena, sale más rapidez de la real.',
      voz: 'El doble de rapidez pide cuatro veces la energía: v va al cuadrado.',
      dibujo: plano(grafica([[0, 0], [2, 20], [5, 20]], { nombre: 'F neta', areas: [{ puntos: [[0, 0], [2, 20]], rotulo: '20 J' }, { puntos: [[2, 20], [5, 20]], rotulo: '60 J' }] })),
    },
    // Así se resuelve: empujar contra el rozamiento hasta una rapidez (semillas pares) o el trabajo neto entre dos
    // rapideces (impares), con otros objetos que «Ahora tú».
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 1) {
          const ob = r.de(COSAS2_RS), m = r.de(ob.m), v0 = r.de(ob.v0), v = r.de(ob.v), Wv = m * (v * v - v0 * v0) / 2;
          return {
            enunciado: [`${mayus(ob.n)} de ${f(m)} kg pasa de ${v0} m/s a ${v} m/s. ¿Cuánto trabajo neto se hizo sobre ${ob.n.startsWith('una') ? 'ella' : 'él'}?`],
            datos: [D2.teorema],
            pasos: [
              { tipo: 'pide', texto: 'Piden el trabajo neto, es decir, la suma de lo que hicieron todas las fuerzas juntas.' },
              { tipo: 'datos', texto: `Masa: ${f(m)} kg. Rapidez al empezar: ${v0} m/s; al final: ${v} m/s.` },
              { tipo: 'regla', texto: 'No hace falta conocer cada fuerza: el trabajo neto es lo que cambió la energía cinética, la final menos la del comienzo.', ecuacion: [Wneto, ' = ½ · m · v² − ½ · m · v₀²'] },
              { tipo: 'cuentas', texto: `Al final: ½ · ${f(m)} · ${v}² = ${J_(m * v * v / 2)}. Al empezar: ½ · ${f(m)} · ${v0}² = ${J_(m * v0 * v0 / 2)}.`, ecuacion: [Wneto, ` = ${f(m * v * v / 2)} − ${f(m * v0 * v0 / 2)} = `, neg(J_(Wv))] },
              { tipo: 'sentido', texto: `Sale positivo porque ganó rapidez. Si se restaran las rapideces antes de elevarlas al cuadrado, saldría ${J_(m * (v - v0) ** 2 / 2)}, mucho menos, porque la energía crece con v² y no con v.` },
            ],
            respuesta: [Wneto, ' = ', neg(J_(Wv))],
          };
        }
        const c = elegir(() => { const m = r.de([4, 5, 8, 10]), Fv = r.de([30, 40, 60]), fr = r.de([10, 20]), d = r.de([2, 3, 4, 5]), v = Math.sqrt(2 * (Fv - fr) * d / m);
          return Fv > fr && exacto(v) && v <= 8 && !(m === 10 && Fv === 50) && { m, Fv, fr, d, v }; });
        return {
          enunciado: ['Empujas desde el reposo un cajón de ', `${c.m} kg con `, pj(N_(c.Fv)), ` a lo largo de ${c.d} m, y el piso lo frena con `, pr(N_(c.fr)), '. ¿Con qué rapidez queda?'],
          datos: [D2.suma, D2.teorema],
          dibujo: est(figCarrito({ d: c.d, texto: `${c.m} kg`, F: `F = ${N_(c.Fv)}`, f: `f = ${N_(c.fr)}`, textos: [{ x: 312, y: 24, texto: 'del reposo; v = ?', ancla: 'end', peso: 400 }] })),
          pasos: [
            { tipo: 'pide', texto: 'Piden la rapidez con que queda el cajón al final del empujón.' },
            { tipo: 'datos', texto: [`Masa: ${c.m} kg. Empujón: `, pj(N_(c.Fv)), '; rozamiento: ', pr(N_(c.fr)), `; a lo largo de ${c.d} m, desde el reposo.`] },
            { tipo: 'regla', texto: 'El trabajo neto suma el de cada fuerza con su signo, y como el cajón partió del reposo, es toda la energía cinética final.', ecuacion: [Wneto, ' = ½ · m · v² − 0'] },
            { tipo: 'cuentas', texto: `El empujón suma y el rozamiento resta: ${c.Fv} · ${c.d} − ${c.fr} · ${c.d} = ${J_((c.Fv - c.fr) * c.d)}. Ese trabajo neto se iguala a ½ · m · v² y se despeja v:`, ecuacion: [`½ · ${c.m} · v² = ${f((c.Fv - c.fr) * c.d)};   v = `, neg(MS(c.v))] },
            { tipo: 'sentido', texto: `Sin el rozamiento habría salido más rápido: el empujón trabaja ${J_(c.Fv * c.d)}, pero el piso le quita ${J_(c.fr * c.d)}, y solo lo que queda se vuelve movimiento.` },
          ],
          respuesta: ['v = ', neg(MS(c.v))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4;
        if (k === 0) {
          const c = elegir(() => { const ob = r.de(COSAS2_AT), m = r.de(ob.m), v0 = r.de(ob.v0), v = r.de(ob.v), Wv = m * (v * v - v0 * v0) / 2;
            return !(m === 0.4 && v0 === 5 && v === 15) && distintos(Wv, m * v * v / 2, m * (v - v0) ** 2 / 2, m * (v * v - v0 * v0)) && { ob, m, v0, v, Wv }; });   // 0,4 kg de 5 a 15 m/s: el ejemplo 2.13
          return {
            pregunta: [`${mayus(c.ob.n)} de ${f(c.m)} kg pasa de ${c.v0} m/s a ${c.v} m/s. ¿Cuánto trabajo neto se hizo sobre ${c.ob.n.startsWith('una') ? 'ella' : 'él'}?`],
            datos: [D2.teorema],
            opciones: opciones(c.Wv, [
              { id: 'sin-v0', valor: c.m * c.v * c.v / 2, error: 'TE-SIN-V0', siFuera: 'La energía del final está bien, pero el cuerpo ya se movía al empezar y tenía energía cinética. El trabajo neto es solo lo que ganó, así que esa energía inicial se resta.' },
              { id: 'resta-v', valor: c.m * (c.v - c.v0) ** 2 / 2, error: 'TE-RESTA-V', siFuera: 'La fórmula está bien, pero restaste las rapideces antes de elevarlas al cuadrado. Lo que se resta son las energías, cada una con su propia rapidez al cuadrado.' },
              { id: 'sin-medio', valor: c.m * (c.v * c.v - c.v0 * c.v0), error: 'TE-SIN-MEDIO', siFuera: 'La diferencia de rapideces al cuadrado está bien, pero la energía cinética es la mitad de m · v². Falta multiplicar por ½.' },
            ], J_),
            solucion: { texto: 'El trabajo neto es lo que ganó la energía cinética: la final menos la del comienzo.', ecuacion: [Wneto, ` = ${f(c.m * c.v * c.v / 2)} − ${f(c.m * c.v0 * c.v0 / 2)} = `, neg(J_(c.Wv))] },
          };
        }
        if (k === 1) {
          const ob = r.de(['un carrito', 'una caja', 'un trineo']);
          const c = elegir(() => { const m = r.de([2, 4, 5, 8, 10]), v = r.de([2, 3, 4, 5, 6]), d = r.de([2, 3, 4, 5]), Fv = m * v * v / (2 * d);
            return Number.isInteger(Fv) && Fv <= 60 && !(m === 20) && distintos(v, v * v, Math.sqrt(Fv * d / m), Fv * d / m) && { m, v, d, Fv }; });
          return {
            pregunta: [`Empujas desde el reposo ${ob} de ${c.m} kg con `, pj(N_(c.Fv)), ` horizontales a lo largo de ${c.d} m, en un piso que casi no frena. ¿Con qué rapidez queda?`],
            datos: [D.trabajo, D2.teorema],
            opciones: opciones(c.v, [
              { id: 'sin-raiz', valor: c.v * c.v, error: 'TE-SIN-RAIZ', siFuera: 'Igualar el trabajo a la energía cinética está bien, pero ese número es v², la rapidez al cuadrado. Falta sacar la raíz para llegar a la rapidez.' },
              { id: 'sin-dos', valor: Math.sqrt(c.Fv * c.d / c.m), error: 'TE-SIN-DOS', siFuera: 'El despeje va bien, pero olvidaste el ½ de la energía cinética. Al pasarlo al otro lado, multiplica por 2 antes de sacar la raíz.' },
              { id: 'sin-medio', valor: c.Fv * c.d / c.m, error: 'TE-SIN-RAIZ', siFuera: 'Dividir el trabajo entre la masa es el comienzo, pero faltan dos pasos: multiplicar por 2, por el ½ de la energía, y sacar la raíz.' },
            ], MS),
            solucion: { texto: 'Como el piso casi no frena y el cuerpo partió del reposo, el trabajo del empujón es toda la energía cinética:', ecuacion: [`½ · ${c.m} · v² = ${c.Fv} · ${c.d};   v = `, neg(MS(c.v))] },
          };
        }
        if (k === 2) {
          // La distancia de frenado con el rozamiento: la masa se cancela.
          const ob = r.de(['Una caja', 'Un costal', 'Un bloque de hielo']);
          const c = elegir(() => { const m = r.de([2, 5, 10, 20]), v = r.de([2, 4, 6, 8]), mu = r.de([0.1, 0.2, 0.4, 0.5, 0.8]), d = v * v / (2 * mu * G);
            return exacto(d) && d >= 1 && d <= 40 && !(v === 10) && distintos(d, v * v / (mu * G), v / (2 * mu * G), m * d) && { m, v, mu, d }; });
          return {
            pregunta: [`${ob} de ${c.m} kg desliza a ${c.v} m/s por un piso horizontal con `, muk, ` = ${f(c.mu)}. ¿Qué distancia recorre hasta detenerse?`],
            datos: [D2.teorema, D.cin, D.peso, D.normal, D.trabajo],
            opciones: opciones(c.d, [
              { id: 'sin-dos', valor: c.v * c.v / (c.mu * G), error: 'TE-SIN-MEDIO', siFuera: 'Igualar el trabajo del rozamiento a la energía está bien, pero la energía cinética es ½ · m · v², y ese ½ faltó. Sin él, la distancia sale el doble.' },
              { id: 'sin-cuad', valor: c.v / (2 * c.mu * G), error: 'TE-LINEAL', siFuera: 'El planteo va bien, pero usaste la rapidez sin elevarla. La energía cinética va con v², y por eso la distancia de frenado crece con el cuadrado de la rapidez.' },
              { id: 'masa', valor: c.m * c.d, error: 'TE-MASA', siFuera: 'La masa aparece en el rozamiento y también en la energía cinética, así que se cancela. Multiplicar por la masa da otra cosa, no la distancia.' },
            ], M_),
            solucion: { texto: 'El rozamiento es la única fuerza que trabaja y quita toda la energía cinética; la masa está en los dos lados y se cancela:', ecuacion: [`${f(c.mu)} · 10 · d = ½ · ${c.v}²;   d = `, neg(M_(c.d))] },
          };
        }
        // Nivel examen: la gráfica F–x hasta una rapidez, o el trabajo neto con la distancia y el tiempo (San Marcos 2025-II).
        if (sm % 8 < 4) {
          const c = elegir(() => { const tipo = r.de(['rect-tri', 'tri-rect', 'signo']), F1 = r.de([10, 20, 30, 40]), a = r.de([1, 2, 3, 4]), b = r.de([1, 2, 3, 4]), F2 = r.de([10, 20]), m = r.de([1, 2, 4, 5, 8]);
            let pts, Wv, mala;
            if (tipo === 'rect-tri') { pts = [[0, F1], [a, F1], [a + b, 0]]; Wv = F1 * a + F1 * b / 2; mala = F1 * (a + b); }
            else if (tipo === 'tri-rect') { pts = [[0, 0], [a, F1], [a + b, F1]]; Wv = F1 * a / 2 + F1 * b; mala = F1 * (a + b); }
            else { pts = [[0, F1], [a, F1], null, [a, -F2], [a + b, -F2]]; Wv = F1 * a - F2 * b; mala = F1 * a + F2 * b; }
            if ((tipo === 'tri-rect' && F1 === 30 && a === 2 && b === 4) || (tipo === 'tri-rect' && F1 === 20 && a === 2 && b === 3)) return null;   // el ejemplo 2.10 y el de Lee
            const v = Math.sqrt(2 * Math.max(0, Wv) / m);
            return Wv > 0 && exacto(v) && v <= 12 && distintos(v, 2 * Wv / m, Math.sqrt(Wv / m), Math.sqrt(2 * mala / m)) && { tipo, pts, Wv, mala, F1, F2, a, b, m, v }; });
          const t = c.tipo;
          return {
            pregunta: [`Un carrito de ${c.m} kg parte del reposo, empujado por la fuerza neta de la gráfica, a lo largo de su camino. ¿Qué rapidez tiene en x = ${c.a + c.b} m?`],
            datos: [D.area, D.triangulo, D2.teorema],
            dibujo: plano(grafica(c.pts, { xmax: c.a + c.b })),
            opciones: opciones(c.v, [
              { id: 'sin-raiz', valor: 2 * c.Wv / c.m, error: 'TE-SIN-RAIZ', siFuera: 'El área y el teorema están bien, pero ese número es v², la rapidez al cuadrado. Falta sacar la raíz.' },
              { id: 'sin-dos', valor: Math.sqrt(c.Wv / c.m), error: 'TE-SIN-DOS', siFuera: 'El área está bien, pero olvidaste el ½ de la energía cinética. Al despejar, ese ½ multiplica por 2 antes de la raíz.' },
              { id: 'area', valor: Math.sqrt(2 * c.mala / c.m), error: t === 'signo' ? 'TR-AREA-SIGNO' : 'TR-RECT', siFuera: t === 'signo' ? 'El teorema está bien, pero sumaste el área bajo el eje. Ahí la fuerza va contra el avance, su trabajo es negativo y esa área se resta.' : 'El teorema está bien, pero tomaste el área como un rectángulo entero. Un tramo es un triángulo, y su área es la mitad de base por altura.' },
            ], MS),
            solucion: { texto: `El área bajo la gráfica, con su signo, da el trabajo neto, ${J_(c.Wv)}, y como partió del reposo es toda su energía cinética:`, ecuacion: [`½ · ${c.m} · v² = ${f(c.Wv)};   v = `, neg(MS(c.v))] },
          };
        }
        const c = elegir(() => { const m = r.de([2, 3, 5, 6]), a = r.de([1, 2, 3, 4]), t = r.de([2, 3, 4]), d = a * t * t / 2, Wv = m * a * d;
          return exacto(d) && !(m === 4 && d === 9 && t === 3) && distintos(Wv, m * (d / t) * d, m * (d / (t * t)) * d, m * (d / t) ** 2 / 2) && { m, a, t, d, Wv }; });
        return {
          pregunta: [`Un bloque de ${c.m} kg parte del reposo y, con una fuerza neta constante, recorre ${f(c.d)} m en ${c.t} s. ¿Cuánto trabajo neto se hizo sobre él?`],
          datos: [D2.reposo, D2.segunda, D2.teorema],
          opciones: opciones(c.Wv, [
            { id: 'media', valor: c.m * (c.d / c.t) * c.d, error: 'DN-VMEDIA', siFuera: 'Usar m · a · d está bien, pero d ÷ t no es la aceleración: es la velocidad media. La aceleración sale de d = a · t² / 2.' },
            { id: 'sin-dos', valor: c.m * (c.d / (c.t * c.t)) * c.d, error: 'DN-SIN-DOS', siFuera: 'Despejar la aceleración está bien, pero en d = a · t² / 2 hay un 2 que faltó. Sin él, la aceleración sale la mitad.' },
            { id: 'vmedia', valor: c.m * (c.d / c.t) ** 2 / 2, error: 'TE-VMEDIA', siFuera: 'Usar ½ · m · v² está bien, pero d ÷ t es la rapidez media. Desde el reposo y con aceleración constante, la rapidez final es el doble de la media.' },
          ], J_),
          solucion: { texto: 'De d = a · t² / 2 sale la aceleración y de v = a · t, la rapidez final; con ella, la energía cinética es el trabajo neto:', ecuacion: [`a = ${c.a} m/s²;   v = ${c.a * c.t} m/s;   `, Wneto, ` = ½ · ${c.m} · ${c.a * c.t}² = `, neg(J_(c.Wv))] },
        };
      },
    },
  };

  // ======================= 3: energía potencial (la maceta en el balcón) =======================
  // Cambia: el balcón y la referencia · Permanece: la maceta de 2 kg (pesa 20 N) · Progresa: la barra de E_PG, hacia
  // arriba o hacia abajo de la referencia · Se reserva: lo que cambia al caer de un balcón a otro (Predice) · Debe verse:
  // E_PG = m · g · h desde la referencia elegida; sus cambios no dependen de ella. Un resorte guarda ½ · k · x².
  // Edificio de cuatro pisos de 3 m (16 px por metro): la vereda en y = 224, los balcones a 3, 6 y 9 m, la azotea a 12 m.
  const PISO3 = 224, PXM3 = 16, M3 = 2;
  const yAlt = hm => PISO3 - PXM3 * hm;
  const NOMREF = { 0: 'la vereda', 3: 'el balcón a 3 m', 12: 'la azotea' };
  const NOMREF_CORTO = { 0: 'vereda', 3: 'balcón a 3 m', 12: 'azotea' };
  function figEdificio(o = {}) {
    const objs = [{ tipo: 'edificio', x0: 60, x1: 140, y: PISO3, pisos: 4, hp: 3 * PXM3 }], txt = (o.textos || []).slice(), lineas = [], cotas = [];
    for (const b of o.macetas || []) { objs.push({ tipo: 'maceta', x: 150, y: yAlt(b.h), w: 22 }); if (b.t) txt.push({ x: 168, y: yAlt(b.h) - 8, texto: b.t, ancla: 'start', peso: 400 }); }
    for (const ref of o.refs || []) {
      lineas.push({ de: [12, yAlt(ref)], a: [222, yAlt(ref)] });
      txt.push({ x: 8, y: yAlt(ref) - 6, texto: `h = 0: ${NOMREF_CORTO[ref] || 'referencia'}`, ancla: 'start', peso: 400 });
    }
    if (o.cota) cotas.push({ de: [196, yAlt(o.cota[0])], a: [196, yAlt(o.cota[1])], texto: o.cota[2], lado: o.cota[1] > o.cota[0] ? 1 : -1, sep: 0 });
    const b = o.barras ? barras(o.barras, { x0: o.bx0 || 268, dx: o.dx || 64, y: yAlt(o.base || 0), k: o.k || 0.4, w: 22 }) : { objetos: [], textos: [] };
    return { alto: 252, piso: { y: PISO3, x0: 8, x1: 226 }, objetos: [...objs, ...b.objetos], textos: [...txt, ...b.textos], lineas, cotas, flechas: o.flechas || [], alt: o.alt };
  }
  const juego3 = val => { const h = val.b - val.ref, E = M3 * G * h;
    return est(figEdificio({ macetas: [{ h: val.b }], refs: [val.ref], cota: [val.ref, val.b, `h = ${f(h)} m`], base: val.ref,
      barras: [{ n: 'E_PG', v: E, c: 'h' }],
      alt: `La maceta de 2 kg en el balcón a ${val.b} m de la vereda, medida desde ${NOMREF[val.ref]}: h = ${f(h)} m y su energía potencial es ${f(E)} J.` })); };
  const PRED3 = figEdificio({ macetas: [{ h: 9, t: 'antes' }, { h: 3, t: 'después' }], refs: [0, 12],
    flechas: [{ de: [262, 82], ang: 270, largo: 80, color: 'tinta', texto: 'cae', rumbo: [1, 0] }],
    textos: [{ x: 312, y: 24, texto: 'cambio de E_PG: ?', ancla: 'end', peso: 400 }],
    alt: 'La maceta cae del balcón a 9 m al balcón a 3 m. Hay dos referencias: la vereda y la azotea.' });
  const REVELA3 = figEdificio({ macetas: [{ h: 9, t: 'antes' }, { h: 3, t: 'después' }], refs: [0, 12],
    textos: [{ x: 312, y: 106, texto: 'vereda: 180 → 60 J', ancla: 'end', peso: 400 }, { x: 312, y: 130, texto: 'azotea: −60 → −180 J', ancla: 'end', peso: 400 }, { x: 312, y: 228, texto: 'baja 120 J en las dos', ancla: 'end' }],
    alt: 'Desde la vereda, la energía potencial baja de 180 J a 60 J; desde la azotea, de −60 J a −180 J. Baja 120 J con las dos referencias.' });
  // El resorte del juguete: una pared, el resorte comprimido y el bloque; la línea punteada marca su largo natural.
  function figResorte(o = {}) {
    const piso = 200, xn = 190, xpx = o.xpx || 50, xc = xn - (xpx > 0 ? Math.max(xpx, 56) : xpx), objs = [{ tipo: 'resorte', de: [30, 182], a: [xc, 182], vueltas: 10, ancho: 9 }, { tipo: 'caja', x: xc + 18, y: piso, w: 36, h: 36, texto: o.texto || '' }];
    return { alto: 252, piso: { y: piso, x0: 8, x1: 312 }, paredes: [{ x: 30, y0: 130, y1: piso, lado: -1 }], objetos: objs,
      lineas: [{ de: [xn, 140], a: [xn, 198] }], textos: [...(o.textos || []), { x: xn, y: 132, texto: 'largo natural', ancla: 'middle', peso: 400 }],
      cotas: [{ de: [xc, piso], a: [xn, piso], texto: o.tx || 'x', lado: xc < xn ? 1 : -1, sep: 20 }], flechas: o.flechas || [], alt: o.alt };
  }
  const MIRA3 = { alto: 252, piso: { y: PISO3, x0: 8, x1: 236 }, objetos: [], cortes: [
    figEdificio({ macetas: [{ h: 9, t: 'antes' }, { h: 3, t: 'después' }], refs: [0], base: 0, bx0: 236, barras: [{ n: 'a 9 m', v: 180, c: 'h' }, { n: 'a 3 m', v: 60, c: 'h' }] }),
    figEdificio({ macetas: [{ h: 9, t: 'antes' }, { h: 3, t: 'después' }], refs: [12], base: 12, bx0: 236, barras: [{ n: 'a 9 m', v: -60, c: 'h' }, { n: 'a 3 m', v: -180, c: 'h' }] }),
    figEdificio({ macetas: [{ h: 9, t: 'antes' }, { h: 3, t: 'después' }], refs: [0, 12], flechas: [{ de: [262, 82], ang: 270, largo: 80, color: 'h', texto: 'mg = 20 N', rumbo: [1, 0] }],
      textos: [{ x: 312, y: 200, texto: 'W del peso = 120 J', ancla: 'end', color: 'h' }] }),
    figResorte({ xpx: 50, texto: '', tx: 'x = 0,1 m', textos: [{ x: 8, y: 24, texto: 'k = 400 N/m', ancla: 'start' }] }),
  ], alt: 'La maceta cae del 3.er al 1.er piso: desde la vereda, de 180 J a 60 J; desde la azotea, de −60 J a −180 J. Después, un resorte comprimido 0,1 m.' };
  const REGLA3 = { x: { min: 0, max: 0.25, paso: 0.05, nombre: 'x', unidad: 'm', decimales: 2 }, y: { min: 0, max: 100, paso: 20, nombre: 'F', unidad: 'N', decimales: 0, color: 'o' },
    curvas: [{ puntos: [[0, 0], [0.2, 80]], color: 'o', rotulo: 'resorte: F = k · x, k = 400 N/m', en: [0.09, 72] }], areas: [{ puntos: [[0, 0], [0.2, 80]], color: 'o', rotulo: '8 J' }] };

  const D3 = {
    epg: [EPG, ' = ', ...MG, ' · h: energía potencial gravitatoria, con h la altura sobre la referencia (negativa debajo)'],
    epe: [EPE, ' = ½ · k · x²: energía potencial elástica, con x la deformación en metros'],
    peso: D.peso, pesoW: D.pesoW,
    wpeso: ['El trabajo del peso es lo que baja la ', EPG, ': ', Wpeso, ' = ', EPG, ' al inicio − ', EPG, ' al final'],
    hooke: ['Fuerza de un resorte: ', pj('F'), ' = k · x'],
    cm: '1 m = 100 cm',
    constante: D.constante, trabajo: D.trabajo,
  };

  // Ejemplos resueltos de la idea 3. Cuentas rehechas aparte (scratchpad e8-fisica/cuentas.js: la energía potencial con la
  // altura medida desde cada referencia y la del resorte como área del triángulo bajo F = k · x, por trapecios):
  // 2·10·1,5; 0,5·10·(−0,8); ½·500·0,2²; ½·200·0,1²; 60·10·40; 50·10·9; −10·10·3; 2·3/0,1²; ½·800·0,1²; √(2·8/400);
  // 12 000/(80·10) y cada alternativa; ½·60·0,15 y cada alternativa; ½·1000·(0,3² − 0,1²) y cada alternativa;
  // 2·10·(5 − 15) y cada alternativa; x = 50/500, ½·500·0,1² y cada alternativa.
  const EJEMPLOS_POTENCIAL = [
    { nivel: 1, titulo: 'El libro en el estante',
      figura: est({ alto: 200, piso: { y: 180, x0: 8, x1: 312 }, paredes: [{ x: 240, y0: 30, y1: 180, lado: 1 }], objetos: [{ tipo: 'viga', x0: 120, x1: 240, y: 90 }, { tipo: 'caja', x: 170, y: 82, w: 40, h: 16, texto: '' }],
        cotas: [{ de: [272, 90], a: [272, 180], texto: 'h = 1,5 m', lado: -1, sep: 0 }], textos: [{ x: 8, y: 24, texto: 'referencia: el piso; E_PG = ?', ancla: 'start', peso: 400 }],
        alt: 'Un libro de 2 kg en un estante a 1,5 m del piso.' }),
      enunciado: ['Un libro de 2 kg está en un estante, a 1,5 m del piso. Con el piso como referencia, ¿cuánta energía potencial gravitatoria tiene?'],
      datos: [D3.epg, D.peso],
      solucion: [{ texto: 'La energía potencial gravitatoria es la masa por g por la altura, y como la referencia es el piso, la altura se mide desde el piso:', ecuacion: [EPG, ' = 2 · 10 · 1,5 = ', pp('30 J')] }],
      respuesta: [EPG, ' = ', pp('30 J')] },
    { nivel: 1, titulo: 'Debajo de la referencia',
      figura: est({ alto: 200, piso: { y: 180, x0: 8, x1: 312 }, objetos: [{ tipo: 'viga', x0: 120, x1: 240, y: 110 }, { tipo: 'pelota', x: 90, y: 170, r: 10 }],
        lineas: [{ de: [20, 110], a: [300, 110] }, { de: [126, 110], a: [126, 180], discontinua: false }, { de: [234, 110], a: [234, 180], discontinua: false }], cotas: [{ de: [60, 110], a: [60, 180], texto: '0,8 m', lado: 1, sep: 0 }],
        textos: [{ x: 300, y: 100, texto: 'h = 0: la mesa', ancla: 'end', peso: 400 }, { x: 8, y: 24, texto: 'E_PG = ?', ancla: 'start' }], alt: 'Una pelota de 0,5 kg en el piso, 0,8 m debajo de la mesa, que es la referencia.' }),
      enunciado: ['Una pelota de 0,5 kg está en el piso. Si la referencia es la mesa, de 0,8 m de alto, ¿cuánto vale su energía potencial gravitatoria?'],
      datos: [D3.epg, D.peso],
      solucion: [{ texto: 'La pelota está 0,8 m debajo de la mesa, que es la referencia, así que su altura es negativa: h = −0,8 m.', ecuacion: [EPG, ' = 0,5 · 10 · (−0,8) = ', pp('−4 J')] }],
      respuesta: [EPG, ' = ', pp('−4 J')] },
    { nivel: 1, titulo: 'El resorte comprimido',
      figura: est(figResorte({ xpx: 70, tx: 'x = 0,2 m', textos: [{ x: 8, y: 24, texto: 'k = 500 N/m; E_PE = ?', ancla: 'start' }], alt: 'Un resorte de 500 N/m comprimido 0,2 m contra una pared.' })),
      enunciado: ['Un resorte de constante 500 N/m está comprimido 0,2 m. ¿Cuánta energía potencial elástica guarda?'],
      datos: [D3.epe],
      solucion: [{ texto: 'La energía elástica es la mitad de k por la deformación al cuadrado, con x en metros:', ecuacion: [EPE, ' = ½ · 500 · 0,2² = ', pj('10 J')] }],
      respuesta: [EPE, ' = ', pj('10 J')] },
    { nivel: 1, titulo: 'En centímetros',
      figura: est(figResorte({ xpx: 40, tx: 'x = 10 cm', textos: [{ x: 8, y: 24, texto: 'k = 200 N/m; E_PE = ?', ancla: 'start' }], alt: 'Un resorte de 200 N/m comprimido 10 cm.' })),
      enunciado: ['Un resorte de 200 N/m se comprime 10 cm. ¿Cuánta energía potencial elástica guarda?'],
      datos: [D3.epe, D3.cm],
      solucion: [{ texto: 'La constante viene en N/m, así que la deformación va en metros: 10 cm = 0,1 m.', ecuacion: [EPE, ' = ½ · 200 · 0,1² = ', pj('1 J')] }],
      respuesta: [EPE, ' = ', pj('1 J')] },
    { nivel: 1, titulo: 'En el mirador',
      figura: est({ alto: 200, piso: { y: 180, x0: 8, x1: 312 }, objetos: [{ tipo: 'rampa', x0: 40, y0: 180, largo: 220, ang: 30 }, { tipo: 'persona', x: 230, y: 70, alto: 50 }],
        cotas: [{ de: [262, 70], a: [262, 180], texto: '40 m', lado: -1, sep: 0 }], textos: [{ x: 8, y: 24, texto: 'referencia: la plaza; E_PG = ?', ancla: 'start', peso: 400 }],
        alt: 'Una persona de 60 kg en un mirador 40 m sobre la plaza.' }),
      enunciado: ['Una turista de 60 kg sube a un mirador que está 40 m sobre la plaza. Con la plaza como referencia, ¿cuánta energía potencial gravitatoria tiene allá arriba?'],
      datos: [D3.epg, D.peso],
      solucion: [{ texto: 'Con la plaza como referencia, la altura del mirador es 40 m, y la energía es la masa por g por esa altura:', ecuacion: [EPG, ' = 60 · 10 · 40 = ', pp('24 000 J')] }],
      respuesta: [EPG, ' = ', pp('24 000 J')] },
    { nivel: 2, titulo: 'Subir tres pisos',
      figura: est(figEdificio({ textos: [{ x: 312, y: 24, texto: 'del 1.er al 4.º piso', ancla: 'end', peso: 400 }], cota: [0, 9, '?'], alt: 'Una persona sube por la escalera del 1.er piso, a nivel de la vereda, al 4.º piso de un edificio de pisos de 3 m.' })),
      enunciado: ['Una persona de 50 kg sube por la escalera desde el 1.er piso, a nivel de la vereda, hasta el 4.º piso de un edificio. Cada piso mide 3 m de alto. ¿Cuánta energía potencial gana?'],
      datos: [D3.epg, D.peso],
      solucion: [
        { texto: 'Del 1.er piso al 4.º hay tres pisos de diferencia, no cuatro, así que sube:', ecuacion: ['3 · 3 = 9 m'] },
        { texto: 'Piden lo que gana, y un cambio de energía potencial no depende de la referencia: basta la altura que sube.', ecuacion: ['50 · 10 · 9 = ', pp('4500 J')] },
      ],
      respuesta: ['Gana ', pp('4500 J')] },
    { nivel: 2, titulo: 'Por la rampa o en vertical',
      figura: est({ alto: 212, piso: { y: PISO1, x0: 8, x1: 312 }, objetos: [{ tipo: 'rampa', x0: 40, y0: PISO1, largo: 200, ang: 37 }, { tipo: 'costal', x: 88, y: 136, w: 46, h: 30, giro: 37, texto: '10 kg' }],
        cotas: [{ de: [40, PISO1], a: [200, 50], texto: 'L = 5 m', lado: -1, sep: 34 }, { de: [200, 50], a: [200, PISO1], texto: 'h = 3 m', lado: -1, sep: 12 }],
        textos: [{ x: 312, y: 24, texto: 'W del peso: ?', ancla: 'end', peso: 400 }], alt: 'Un costal de 10 kg sube por una rampa de 5 m de largo hasta 3 m de altura.' }),
      enunciado: ['Un costal de 10 kg sube por una rampa de 5 m de largo hasta una plataforma a 3 m de altura. ¿Cuánto trabajo hace su peso?'],
      datos: [D.peso, D3.wpeso, D3.epg],
      solucion: [
        { texto: 'La energía potencial sube 10 · 10 · 3 = 300 J. Solo cuenta la altura, no el largo de la rampa, porque el peso apunta hacia abajo y solo trabaja con lo que sube el costal.' },
        { texto: 'El trabajo del peso es lo que baja la energía potencial; aquí la energía sube, así que el trabajo sale negativo:', ecuacion: [Wpeso, ' = 0 − 300 = ', pp('−300 J')] },
      ],
      respuesta: [Wpeso, ' = ', pp('−300 J')] },
    { nivel: 2, titulo: 'La constante del resorte',
      figura: est(figResorte({ xpx: 40, tx: 'x = 0,1 m', textos: [{ x: 8, y: 24, texto: 'E_PE = 3 J; k = ?', ancla: 'start' }], alt: 'Un resorte comprimido 0,1 m que guarda 3 J.' })),
      enunciado: ['Un resorte comprimido 0,1 m guarda 3 J de energía potencial elástica. ¿Cuánto vale su constante k?'],
      datos: [D3.epe],
      solucion: [
        { texto: 'En la fórmula de la energía elástica se ponen los 3 J y la deformación en metros:', ecuacion: ['3 = ½ · k · 0,1²'] },
        { texto: 'Después se despeja k: se pasa el ½ multiplicando y el 0,1² dividiendo.', ecuacion: ['k = ', frac('2 · 3', '0,01'), ' = ', neg('600 N/m')] },
      ],
      respuesta: ['k = ', neg('600 N/m')] },
    { nivel: 2, titulo: 'Estirar desde el largo natural',
      figura: est(figResorte({ xpx: -40, tx: '15 cm → 25 cm', textos: [{ x: 8, y: 24, texto: 'k = 800 N/m; E_PE = ?', ancla: 'start' }], alt: 'Un resorte de 800 N/m y 15 cm de largo natural, que se lleva hasta 25 cm.' })),
      enunciado: ['Un resorte de 800 N/m mide 15 cm cuando no está deformado. Lo estiras hasta que mide 25 cm. ¿Cuánta energía potencial elástica guarda?'],
      datos: [D3.epe, D3.cm],
      solucion: [
        { texto: 'La deformación no es el largo del resorte: es cuánto se alargó desde su largo natural, y se pasa a metros.', ecuacion: ['x = 25 − 15 = 10 cm = 0,1 m'] },
        { texto: 'Con esa deformación, la energía elástica es:', ecuacion: [EPE, ' = ½ · 800 · 0,1² = ', pj('4 J')] },
      ],
      respuesta: [EPE, ' = ', pj('4 J')] },
    { nivel: 2, titulo: 'La deformación que guarda 8 J',
      figura: est(figResorte({ xpx: 60, tx: 'x = ?', textos: [{ x: 8, y: 24, texto: 'k = 400 N/m; E_PE = 8 J', ancla: 'start' }], alt: 'Un resorte de 400 N/m que guarda 8 J; su deformación, con un signo de pregunta.' })),
      enunciado: ['Un resorte de 400 N/m guarda 8 J de energía potencial elástica. ¿Cuánto está comprimido?'],
      datos: [D3.epe],
      solucion: [
        { texto: 'En la fórmula de la energía elástica se despeja x²:', ecuacion: ['x² = ', frac('2 · 8', '400'), ' = 0,04'] },
        { texto: 'Como x va al cuadrado, se saca la raíz para obtener la deformación:', ecuacion: ['x = ', neg('0,2 m')] },
      ],
      respuesta: ['x = ', neg('0,2 m')] },
    { nivel: 3, titulo: 'La profundidad del pozo', fuente: 'Parecida a San Marcos 2019-I, pregunta 106.',
      figura: est({ alto: 212, piso: { y: 60, x0: 8, x1: 312 }, objetos: [{ tipo: 'viga', x0: 120, x1: 200, y: 40 }, { tipo: 'cuerda', de: [160, 40], a: [160, 130] }, { tipo: 'persona', x: 160, y: 200, alto: 70 }],
        paredes: [{ x: 130, y0: 60, y1: 204, lado: -1 }, { x: 190, y0: 60, y1: 204, lado: 1 }], cotas: [{ de: [230, 60], a: [230, 204], texto: 'h = ?', lado: -1, sep: 0 }],
        textos: [{ x: 8, y: 24, texto: 'W del torno = 12 000 J', ancla: 'start', color: 'o' }], alt: 'Un obrero de 80 kg en el fondo de un pozo, sacado con un torno.' }),
      enunciado: ['Para sacar a un obrero de 80 kg desde el fondo de un pozo hasta la superficie, a rapidez constante, un torno hace un trabajo de 12 000 J. ¿Qué profundidad tiene el pozo?'],
      alternativas: ['150 m', '30 m', '0,07 m', '15 m', '1200 m'],
      datos: [D3.epg, D.peso, D.constante],
      solucion: [
        { texto: 'A rapidez constante el obrero no gana energía cinética, así que todo el trabajo del torno se vuelve energía potencial:', ecuacion: ['80 · 10 · h = 12 000'] },
        { texto: 'Se despeja h dividiendo el trabajo entre el peso, 80 · 10 = 800 N:', ecuacion: ['h = ', frac('12 000', '800'), ' = ', neg('15 m')] },
        { texto: [neg('A'), ' olvida g y divide solo entre la masa; ', neg('B'), ' usa ½ · m · g · h, con un ½ que es de la energía cinética; ', neg('C'), ' despeja al revés y divide el peso entre el trabajo; ', neg('E'), ' olvida la masa y divide solo entre g.'] },
      ],
      respuesta: [neg('D'), ': ', neg('15 m')] },
    { nivel: 3, titulo: 'La energía con fuerza y estiramiento', fuente: 'Parecida a San Marcos 2027-I, pregunta 89.',
      figura: est(figResorte({ xpx: -40, tx: 'x = 15 cm', flechas: [{ de: [270, 182], ang: 0, largo: 30, color: 'o', texto: 'F = 60 N', rumbo: [0, -1] }], textos: [{ x: 8, y: 24, texto: 'E_PE = ?', ancla: 'start' }],
        alt: 'Un resorte jalado con 60 N que se estira 15 cm.' })),
      enunciado: ['Al jalar un resorte con ', pj('60 N'), ', se estira 15 cm y se queda quieto. ¿Cuánta energía potencial elástica guarda?'],
      alternativas: ['4,5 J', '9 J', '450 J', '0,675 J', '400 J'],
      datos: [D3.epe, D3.hooke, D3.cm],
      solucion: [
        { texto: 'Quieto, el resorte jala con los mismos 60 N, así que primero sale la constante k = F ÷ x:', ecuacion: ['k = ', frac('60', '0,15'), ' = 400 N/m'] },
        { texto: 'La fuerza del resorte creció de 0 a 60 N, así que su energía es el área del triángulo bajo F–x, la mitad de F por x:', ecuacion: [EPE, ' = ½ · 400 · 0,15² = ½ · 60 · 0,15 = ', pj('4,5 J')] },
        { texto: [neg('B'), ' olvida el ½, como si la fuerza hubiera sido 60 N desde el comienzo; ', neg('C'), ' usa los 15 cm sin pasar a metros; ', neg('D'), ' usa ½ · F · x², con una x de más, porque F ya es k · x; ', neg('E'), ' da la constante k, que no es una energía.'] },
      ],
      respuesta: [neg('A'), ': ', pj('4,5 J')] },
    { nivel: 3, titulo: 'Estirar lo que ya está estirado',
      figura: plano({ x: { min: 0, max: 0.35, paso: 0.05, nombre: 'x', unidad: 'm', decimales: 2 }, y: { min: 0, max: 350, paso: 50, nombre: 'F', unidad: 'N', decimales: 0, color: 'o' },
        curvas: [{ puntos: [[0, 0], [0.3, 300]], color: 'o', rotulo: 'F = k · x', en: [0.12, 200] }] }),
      enunciado: ['Un resorte de 1000 N/m ya está estirado 0,1 m. ¿Cuánto trabajo cuesta estirarlo más, hasta 0,3 m?'],
      alternativas: ['20 J', '40 J', '45 J', '80 J', '5 J'],
      datos: [D3.epe, D.area],
      solucion: [
        { texto: 'Primero, lo que guarda el resorte al final y al empezar, cada vez con su deformación:', ecuacion: ['½ · 1000 · 0,3² = 45 J;   ½ · 1000 · 0,1² = 5 J'] },
        { texto: 'El trabajo de estirarlo es lo que ganó su energía, que es el área bajo F–x entre 0,1 m y 0,3 m.', ecuacion: [W, ' = 45 − 5 = ', pj('40 J')] },
        { texto: [neg('A'), ' eleva al cuadrado la diferencia, 0,2², en vez de restar las energías; ', neg('C'), ' da la energía final y olvida que ya estaba estirado; ', neg('D'), ' olvida el ½; ', neg('E'), ' da la energía del comienzo.'] },
      ],
      respuesta: [neg('B'), ': ', pj('40 J')] },
    { nivel: 3, titulo: 'Con la azotea como referencia',
      figura: est({ alto: 252, piso: { y: PISO3, x0: 8, x1: 236 }, objetos: [{ tipo: 'edificio', x0: 30, x1: 130, y: PISO3, pisos: 5, hp: 40 }, { tipo: 'maceta', x: 140, y: PISO3 - 9 * 40 / 3, w: 22 }, { tipo: 'viga', x0: 150, x1: 200, y: PISO3 - 5 * 40 / 3 }],
        lineas: [{ de: [16, 24], a: [232, 24] }], textos: [{ x: 312, y: 40, texto: 'h = 0: la azotea, a 15 m', ancla: 'end', peso: 400 }, { x: 206, y: 140, texto: 'toldo a 5 m', ancla: 'start', peso: 400 }, { x: 160, y: 96, texto: 'balcón a 9 m', ancla: 'start', peso: 400 }],
        alt: 'Una maceta de 2 kg cae de un balcón a 9 m hasta un toldo a 5 m; la azotea, a 15 m, es la referencia.' }),
      enunciado: ['Una maceta de 2 kg cae de un balcón, a 9 m sobre la vereda, hasta un toldo a 5 m. Con la azotea, a 15 m, como referencia, ¿cuánto vale su energía potencial sobre el toldo?'],
      alternativas: ['100 J', '200 J', '−200 J', '−80 J', '−120 J'],
      datos: [D3.epg, D.peso],
      solucion: [
        { texto: 'La referencia es la azotea, y el toldo está 15 − 5 = 10 m debajo de ella, así que su altura es negativa:', ecuacion: ['h = −10 m'] },
        { texto: 'Con esa altura, la energía potencial sale negativa:', ecuacion: [EPG, ' = 2 · 10 · (−10) = ', pp('−200 J')] },
        { texto: ['100 J la mide desde la vereda y no desde la azotea; 200 J olvida que el toldo está debajo de la referencia; −80 J es lo que cambió desde el balcón, no lo que tiene; −120 J es la del balcón, no la del toldo.'] },
      ],
      respuesta: [neg('C'), ': ', EPG, ' = ', pp('−200 J')] },
    { nivel: 3, titulo: 'El resorte que sostiene la caja',
      figura: est({ alto: 212, techo: { y: 20, x0: 100, x1: 220 }, objetos: [{ tipo: 'resorte', de: [160, 20], a: [160, 120], vueltas: 10 }, { tipo: 'caja', x: 160, y: 160, w: 50, h: 40, texto: '5 kg' }],
        textos: [{ x: 8, y: 40, texto: 'k = 500 N/m', ancla: 'start' }, { x: 8, y: 64, texto: 'quieta; E_PE = ?', ancla: 'start' }], alt: 'Una caja de 5 kg colgada quieta de un resorte de 500 N/m.' }),
      enunciado: ['Una caja de 5 kg cuelga quieta de un resorte de 500 N/m. ¿Cuánta energía potencial elástica guarda el resorte?'],
      alternativas: ['5 J', '25 J', '50 J', '25 000 J', '2,5 J'],
      datos: [D3.epe, D3.hooke, D.peso, D.constante],
      solucion: [
        { texto: 'La caja está quieta, así que el resorte jala hacia arriba lo mismo que pesa, 50 N, y de ahí sale cuánto se estira:', ecuacion: ['500 · x = 50;   x = 0,1 m'] },
        { texto: 'Con esa deformación, la energía que guarda el resorte es:', ecuacion: [EPE, ' = ½ · 500 · 0,1² = ', pj('2,5 J')] },
        { texto: [neg('A'), ' olvida el ½; ', neg('B'), ' no eleva x al cuadrado; ', neg('C'), ' da la fuerza del resorte, en newtons, que no es una energía; ', neg('D'), ' usa 10 cm sin pasar a metros.'] },
      ],
      respuesta: [neg('E'), ': ', pj('2,5 J')] },
  ];

  const COSAS3_AT = [{ n: 'Una caja', h1: [1.5, 2, 2.5] }, { n: 'Una olla', h1: [1.8, 2.2] }, { n: 'Un balde', h1: [1.2, 2.4] }];
  const COSAS3_RS = [{ n: 'Una mochila', h1: [1.6, 2.8] }, { n: 'Un florero', h1: [1.4, 2.6] }];
  const potencial = {
    id: 'energia-potencial',
    titulo: 'Energía potencial',
    pregunta: '¿Desde dónde se mide la energía de una maceta en el balcón?',
    temas: ['Energía potencial gravitatoria y elástica'],
    pieza: 'fis-estatica',
    aprendizaje: 'La energía potencial gravitatoria es m · g · h desde una referencia elegida; sus cambios no dependen de ella. Un resorte guarda ½ · k · x².',
    actividad: 'Poner una maceta en un balcón y elegir desde dónde se mide su altura.',
    lee: {
      tarjetas: [
        { titulo: 'Energía guardada', texto: ['Una piedra en lo alto de un cerro o un resorte comprimido tienen energía guardada: si los sueltas, se ponen en movimiento. La energía que se guarda por la altura se llama energía potencial gravitatoria, ', EPG, ', y la que guarda un resorte estirado o comprimido se llama energía potencial elástica, ', EPE, '.'],
          dibujo: est(figEdificio({ macetas: [{ h: 6 }], alt: 'Una maceta en un balcón a 6 m de la vereda.' })) },
        { titulo: '¿Altura desde dónde?', texto: ['La ', EPG, ' depende de la altura h, y h se mide desde un nivel que tú eliges, como la vereda, un piso o la azotea. Ese nivel se llama referencia, y en él la altura vale cero: h = 0.'] },
        { titulo: 'Qué mirar al jugar', texto: ['Pon la maceta en un balcón y elige la referencia. Mira la barra de ', EPG, ': cuánto mide y si crece hacia arriba o hacia abajo.'] },
      ],
    },
    ejemplos: EJEMPLOS_POTENCIAL,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'Una maceta de 2 kg está en un balcón de un edificio con pisos de 3 m. Elige el balcón y desde dónde mides.',
      mision: {
        texto: 'Haz que la maceta tenga una energía potencial de −60 J.',
        // Una sola manera en la grilla: el balcón a 9 m medido desde la azotea (12 m).
        logrado: val => Math.abs(M3 * G * (val.b - val.ref) + 60) < 1e-9,
        bien: 'Está 3 m debajo de la azotea: su altura es negativa y da −60 J.',
      },
      voz: 'Cambia la referencia con la maceta quieta. ¿Qué le pasa a la barra?',
      leyenda: [
        { s: EPG, t: 'energía potencial gravitatoria' },
        { s: 'h', t: 'altura de la maceta sobre la referencia' },
        { s: 'referencia', t: 'el nivel que eliges como h = 0' },
        { s: 'maceta', t: '2 kg: pesa 20 N' },
      ],
      controles: [
        { id: 'b', etiqueta: 'Balcón', opciones: [{ valor: 3, texto: 'a 3 m' }, { valor: 6, texto: 'a 6 m' }, { valor: 9, texto: 'a 9 m' }], inicio: 6 },
        { id: 'ref', etiqueta: 'Referencia', opciones: [{ valor: 0, texto: 'Vereda' }, { valor: 3, texto: 'Balcón a 3 m' }, { valor: 12, texto: 'Azotea' }], inicio: 0 },
      ],
      dibujo: juego3,
      // La lectura enuncia la relación: el peso por la altura sobre la referencia.
      lectura: val => { const h = val.b - val.ref, E = M3 * G * h; return [EPG, ` = 20 · ${en(h)} = ${J_(E)}: ${h > 0 ? 'sobre' : h < 0 ? 'bajo' : 'en'} ${NOMREF[val.ref]}`]; },
      resumen: { b: 6, ref: 0 },
      minimo: 3,
    },
    predice: {
      pregunta: 'La maceta cae del balcón que está a 9 m al que está a 3 m sobre la vereda. ¿Cuánto cambia su energía potencial si la mides desde la vereda, y si la mides desde la azotea?',
      datos: ['La maceta tiene 2 kg; g = 10 m/s².', 'Los dos balcones están a 9 m y a 3 m sobre la vereda.', 'La azotea está a 12 m.'],
      opciones: [
        { id: 'c', texto: 'Baja 120 J con las dos referencias', correcta: true },
        { id: 'vereda', texto: 'Baja más si se mide desde la vereda', error: 'EP-REF', siFuera: 'Desde la vereda los números son más grandes, pero cambiar la referencia les suma lo mismo a los dos balcones. Lo que baja depende solo de los metros que cae la maceta, y esos no cambian.' },
        { id: 'sube', texto: 'Desde la azotea sube, porque se aleja de ella', error: 'EP-SIGNO', siFuera: 'La maceta se aleja de la azotea, pero hacia abajo: su altura pasa de −3 m a −9 m, y su energía pasa a un número más negativo. Eso es bajar, no subir.' },
        { id: 'cero', texto: 'Desde la azotea no cambia: está debajo', error: 'EP-CERO', siFuera: 'Estar debajo de la referencia hace negativa la energía, pero no la deja fija. Al caer, la maceta queda todavía más abajo, y su energía cambia.' },
      ],
      dibujo: est(PRED3),
      revelar: est(REVELA3),
      coincide: 'Coincide: la referencia cambia los números, pero no cuánto cambian, porque la maceta cae los mismos 6 m. Baja 120 J con las dos.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: MIRA3,
      pasos: [
        { estado: { corte: 0 }, texto: 'Desde la vereda, la maceta tiene 180 J en el balcón de arriba y 60 J en el de abajo: baja 120 J.', ecuacion: ['180 − 60 = 120 J: baja 120 J'] },
        { estado: { corte: 1 }, texto: 'Desde la azotea, las dos energías son negativas: −60 J arriba y −180 J abajo. Aun así, también baja 120 J.', ecuacion: ['−60 − (−180) = 120 J: baja 120 J'] },
        { estado: { corte: 2 }, texto: 'Lo que baja la energía potencial es el trabajo del peso, su fuerza por los 6 m que cae, con cualquier referencia.', ecuacion: [Wpeso, ' = 20 · 6 = 120 J'] },
        { estado: { corte: 3 }, texto: 'Un resorte estirado o comprimido también guarda energía: es el área del triángulo bajo su gráfica F–x.', ecuacion: [EPE, ' = ½ · 400 · 0,1² = 2 J'] },
      ],
    },
    regla: {
      texto: 'La energía potencial gravitatoria es la que guarda un cuerpo por su altura sobre una referencia que tú eliges; debajo de ella es negativa. Cuánto cambia no depende de la referencia: solo de cuánto sube o baja, y el peso trabaja lo que esa energía baja. Un resorte deformado guarda el área del triángulo bajo su F–x.',
      ecuacion: [EPG, ' = ', ...MG, ' · h', '   ;   ', EPE, ' = ½ · k · x²', '   ;   ', Wpeso, ' = −Δ', EPG],
      condicion: 'h se mide desde la referencia y x desde el largo natural del resorte, en metros; Δ es el final menos el comienzo. Si se usa el largo del resorte como x, la energía sale mal.',
      voz: 'La energía del resorte es el área bajo su F–x: un triángulo, por eso el ½.',
      dibujo: plano(REGLA3),
    },
    // Así se resuelve: la energía con una referencia que no es el piso (semillas pares) o la de un resorte (impares).
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 1) {
          const c = elegir(() => { const k = r.de([300, 600, 900]), xc = r.de([4, 8, 12, 15]), E = k * (xc / 100) ** 2 / 2; return exacto(E) && { k, xc, E }; });
          return {
            enunciado: [`Un resorte de ${c.k} N/m se estira ${c.xc} cm. ¿Cuánta energía potencial elástica guarda?`],
            datos: [D3.epe, D3.cm],
            dibujo: est(figResorte({ xpx: 20 + 2 * c.xc, tx: `x = ${c.xc} cm`, textos: [{ x: 8, y: 24, texto: `k = ${c.k} N/m; E_PE = ?`, ancla: 'start' }] })),
            pasos: [
              { tipo: 'pide', texto: 'Piden la energía potencial elástica, la que guarda el resorte estirado.' },
              { tipo: 'datos', texto: `Constante: ${c.k} N/m. Deformación: ${c.xc} cm.` },
              { tipo: 'regla', texto: 'La fuerza del resorte crece desde 0 al estirarlo, así que su energía es el área del triángulo bajo su F–x: la mitad de k por x al cuadrado, con x en metros.', ecuacion: [EPE, ' = ½ · k · x²'] },
              { tipo: 'cuentas', texto: `La constante está en N/m, así que primero se pasa a metros: ${c.xc} cm = ${f(c.xc / 100)} m.`, ecuacion: [EPE, ` = ½ · ${c.k} · ${f(c.xc / 100)}² = `, pj(J_(c.E))] },
              { tipo: 'sentido', texto: `Con el doble de estiramiento guardaría cuatro veces más, ${J_(4 * c.E)}, porque x va al cuadrado: estirar un resorte cuesta cada vez más.` },
            ],
            respuesta: [EPE, ' = ', pj(J_(c.E))],
          };
        }
        const ob = r.de(COSAS3_RS), m = r.de([2, 3, 4]), h1 = r.de(ob.h1), h0 = r.de([0.8, 1]), h = h1 - h0, E = m * G * h;
        return {
          enunciado: [`${ob.n} de ${m} kg está en un estante a ${f(h1)} m del piso. Si la referencia es una mesa de ${f(h0)} m de alto, ¿cuánto vale su energía potencial gravitatoria?`],
          datos: [D3.epg, D.peso],
          dibujo: est({ alto: 200, piso: { y: 180, x0: 8, x1: 312 }, paredes: [{ x: 262, y0: 30, y1: 180, lado: 1 }], objetos: [{ tipo: 'viga', x0: 160, x1: 262, y: 180 - 50 * h1 }, { tipo: 'caja', x: 210, y: 180 - 50 * h1 - 8, w: 34, h: 24, texto: `${m} kg` }, { tipo: 'viga', x0: 30, x1: 120, y: 180 - 50 * h0 }],
            lineas: [{ de: [20, 180 - 50 * h0], a: [250, 180 - 50 * h0] }, { de: [36, 180 - 50 * h0], a: [36, 180], discontinua: false }, { de: [114, 180 - 50 * h0], a: [114, 180], discontinua: false }],
            textos: [{ x: 75, y: 168 - 50 * h0, texto: 'mesa: h = 0', ancla: 'middle', peso: 400 }],
            cotas: [{ de: [286, 180 - 50 * h1], a: [286, 180], texto: `${f(h1)} m`, lado: -1, sep: 0 }, { de: [20, 180 - 50 * h0], a: [20, 180], texto: `${f(h0)} m`, lado: 1, sep: 0 }] }),
          pasos: [
            { tipo: 'pide', texto: 'Piden la energía potencial gravitatoria medida desde la mesa, que es la referencia que dan.' },
            { tipo: 'datos', texto: `Masa: ${m} kg. Estante a ${f(h1)} m del piso; mesa de ${f(h0)} m.` },
            { tipo: 'regla', texto: 'La altura h de la fórmula se mide desde la referencia, no desde el piso: es cuánto está el cuerpo sobre la mesa.', ecuacion: [EPG, ' = ', ...MG, ' · h'] },
            { tipo: 'cuentas', texto: `La altura sobre la mesa es lo que el estante sobresale de ella: h = ${f(h1)} − ${f(h0)} = ${f(h)} m.`, ecuacion: [EPG, ` = ${m} · 10 · ${f(h)} = `, pp(J_(E))] },
            { tipo: 'sentido', texto: `Desde el piso habría salido ${J_(m * G * h1)}: con la referencia más alta, la altura y el número bajan, aunque el cuerpo esté en el mismo lugar.` },
          ],
          respuesta: [EPG, ' = ', pp(J_(E))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4;
        if (k === 0) {
          const c = elegir(() => { const ob = r.de(COSAS3_AT), m = r.de([2, 3, 4, 5]), h1 = r.de(ob.h1), techo = r() < 0.5, h0 = techo ? 3 : r.de([0.5, 0.8, 1]), h = h1 - h0, E = m * G * h;
            return exacto(E) && distintos(E, m * G * h1, -E, m * h) && { ob, m, h1, techo, h0, h, E }; });
          return {
            pregunta: [`${c.ob.n} de ${c.m} kg está a ${f(c.h1)} m del piso. Si la referencia es ${c.techo ? 'el techo, a 3 m del piso' : `una mesa de ${f(c.h0)} m de alto`}, ¿cuánto vale su energía potencial gravitatoria?`],
            datos: [D3.epg, D.peso],
            opciones: opciones(c.E, [
              { id: 'piso', valor: c.m * G * c.h1, error: 'EP-REF', siFuera: 'Usar m · g · h está bien, pero mediste h desde el piso. La altura se mide desde la referencia que dan, así que primero se resta la altura de la referencia.' },
              { id: 'signo', valor: -c.E, error: 'EP-SIGNO', siFuera: `El tamaño está bien, pero no el signo: ${c.techo ? 'el cuerpo está debajo del techo, su altura es negativa y la energía también' : 'el cuerpo está sobre la mesa, su altura es positiva y la energía también'}.` },
              { id: 'sin-g', valor: c.m * c.h, error: 'EP-SIN-G', siFuera: 'La altura sobre la referencia está bien, pero multiplicaste por la masa sola. La energía potencial usa el peso, m · g, así que falta multiplicar por g = 10 m/s².' },
            ], J_),
            solucion: { texto: `La altura se mide desde la referencia: h = ${f(c.h1)} − ${f(c.h0)} = ${f(c.h)} m. Con ella sale la energía:`, ecuacion: [EPG, ` = ${c.m} · 10 · ${en(c.h)} = `, pp(J_(c.E))] },
          };
        }
        if (k === 1) {
          const c = elegir(() => { const kk = r.de([200, 400, 500, 800, 1000]), xc = r.de([5, 10, 20, 30]), x = xc / 100, E = kk * x * x / 2;
            return exacto(E) && !(kk === 200 && xc === 10) && !(kk === 400 && xc === 10) && distintos(E, kk * x / 2, kk * x * x, kk * x) && { kk, xc, x, E }; });
          return {
            pregunta: [`Un resorte de ${c.kk} N/m se comprime ${c.xc} cm. ¿Cuánta energía potencial elástica guarda?`],
            datos: [D3.epe, D3.cm],
            opciones: opciones(c.E, [
              { id: 'lineal', valor: c.kk * c.x / 2, error: 'EP-LINEAL', siFuera: 'El ½ y la k están bien, pero x va al cuadrado. El triángulo bajo F–x tiene base x y altura k · x, así que x entra dos veces.' },
              { id: 'sin-medio', valor: c.kk * c.x * c.x, error: 'EP-SIN-MEDIO', siFuera: 'k por x al cuadrado está bien, pero falta el ½. La fuerza del resorte crece desde 0, y el área bajo F–x es un triángulo, la mitad de un rectángulo.' },
              { id: 'fuerza', valor: c.kk * c.x, error: 'EP-FUERZA', siFuera: 'k · x es la fuerza con que empuja el resorte, en newtons, no la energía que guarda. La energía es el área bajo F–x.' },
            ], J_),
            solucion: { texto: `Primero se pasa la deformación a metros, x = ${f(c.x)} m, y después se usa la mitad de k por x²:`, ecuacion: [EPE, ` = ½ · ${c.kk} · ${f(c.x)}² = `, pj(J_(c.E))] },
          };
        }
        if (k === 2) {
          // El trabajo del peso en una rampa: solo cuenta la altura (W1).
          const c = elegir(() => { const [L, h, ang] = r.de([[5, 3, 37], [10, 6, 37], [2.5, 1.5, 37], [4, 2, 30], [6, 3, 30], [8, 4, 30]]), m = r.de([2, 4, 5, 20]), baja = r() < 0.5;
            const Wv = (baja ? 1 : -1) * m * G * h;
            return distintos(Wv, (baja ? 1 : -1) * m * G * L, -Wv, (baja ? 1 : -1) * m * h) && { L, h, ang, m, baja, Wv }; });
          const cosa = r.de(['una caja', 'un costal de arroz', 'un balde de arena']), xa = 40 + 220 * Math.cos(rad(c.ang)), ya = PISO1 - 220 * Math.sin(rad(c.ang));
          return {
            pregunta: [`${mayus(cosa)} de ${c.m} kg ${c.baja ? 'baja' : 'sube'} por una rampa de ${f(c.L)} m de largo y ${f(c.h)} m de alto. ¿Cuánto trabajo hace su peso?`],
            datos: [D.peso, D3.wpeso, D3.epg],
            dibujo: est({ alto: 212, piso: { y: PISO1, x0: 8, x1: 312 }, objetos: [{ tipo: 'rampa', x0: 40, y0: PISO1, largo: 220, ang: c.ang }, { tipo: 'caja', x: 40 + 70 * Math.cos(rad(c.ang)), y: PISO1 - 70 * Math.sin(rad(c.ang)), w: 46, h: 28, giro: c.ang, texto: `${c.m} kg` }],
              cotas: [{ de: [40, PISO1], a: [xa, ya], texto: `L = ${f(c.L)} m`, lado: -1, sep: 34 }, { de: [xa, ya], a: [xa, PISO1], texto: `h = ${f(c.h)} m`, lado: -1, sep: 10 }],
              textos: [{ x: 8, y: 24, texto: c.baja ? 'baja' : 'sube', ancla: 'start', peso: 400 }] }),
            opciones: opciones(c.Wv, [
              { id: 'largo', valor: (c.baja ? 1 : -1) * c.m * G * c.L, error: 'W1', siFuera: 'El peso está bien, pero lo multiplicaste por el largo de la rampa. El peso apunta hacia abajo, así que solo trabaja con lo que el cuerpo sube o baja: la altura.' },
              { id: 'signo', valor: -c.Wv, error: 'TR-SIGNO', siFuera: `El tamaño está bien, pero no el signo: ${c.baja ? 'al bajar, la energía potencial baja y el peso trabaja a favor del avance, así que su trabajo es positivo' : 'al subir, la energía potencial sube y el peso trabaja en contra del avance, así que su trabajo es negativo'}.` },
              { id: 'sin-g', valor: (c.baja ? 1 : -1) * c.m * c.h, error: 'EP-SIN-G', siFuera: 'La altura está bien, pero multiplicaste por la masa sola. El trabajo es del peso, m · g, así que falta multiplicar por g.' },
            ], J_),
            solucion: { texto: `Solo cuenta la altura: la energía potencial ${c.baja ? 'baja' : 'sube'} ${c.m} · 10 · ${f(c.h)} = ${J_(Math.abs(c.Wv))}, y el peso trabaja lo que esa energía baja:`, ecuacion: [Wpeso, ' = ', pp(J_(c.Wv))] },
          };
        }
        // Nivel examen: la energía con la fuerza y el estiramiento (San Marcos 2027-I) o estirar desde el largo natural.
        if (sm % 8 < 4) {
          const c = elegir(() => { const Fv = r.de([20, 40, 50, 80, 120]), xc = r.de([4, 5, 10, 20, 25]), x = xc / 100, E = Fv * x / 2;
            return exacto(E) && !(Fv === 60 && xc === 15) && distintos(E, Fv * x, Fv * xc / 2, Fv * x * x / 2) && { Fv, xc, x, E }; });
          return {
            pregunta: ['Al jalar un resorte con ', pj(N_(c.Fv)), `, se estira ${c.xc} cm y se queda quieto. ¿Cuánta energía potencial elástica guarda?`],
            datos: [D3.epe, D3.hooke, D3.cm],
            opciones: opciones(c.E, [
              { id: 'sin-medio', valor: c.Fv * c.x, error: 'EP-SIN-MEDIO', siFuera: 'Multiplicar la fuerza por la deformación da un rectángulo, pero la fuerza no valió eso desde el comienzo: creció desde 0. El área bajo F–x es un triángulo, con ½.' },
              { id: 'cm', valor: c.Fv * c.xc / 2, error: 'EP-CM', siFuera: 'Usar ½ · F · x está bien, pero la deformación quedó en centímetros. Para que la energía salga en joules, x va en metros.' },
              { id: 'cuad', valor: c.Fv * c.x * c.x / 2, error: 'EP-F-K', siFuera: 'El ½ está bien, pero pusiste x al cuadrado junto con F. Como F ya es k · x, al usar F la deformación entra una sola vez.' },
            ], J_),
            solucion: { texto: `Quieto, el resorte jala con la misma fuerza, así que k = ${c.Fv} ÷ ${f(c.x)}; la energía es el área del triángulo, la mitad de F por x:`, ecuacion: [EPE, ` = ½ · ${c.Fv} · ${f(c.x)} = `, pj(J_(c.E))] },
          };
        }
        const c = elegir(() => { const kk = r.de([200, 400, 500, 800]), L0 = r.de([10, 15, 20]), a = r.de([5, 10]), b = r.de([15, 20, 25]), x1 = a / 100, x2 = b / 100, Wv = kk * (x2 * x2 - x1 * x1) / 2;
          return b > a && exacto(Wv) && distintos(Wv, kk * (x2 - x1) ** 2 / 2, kk * x2 * x2 / 2, kk * ((L0 + b) ** 2 - (L0 + a) ** 2) / 20000) && { kk, L0, a, b, x1, x2, Wv }; });
        return {
          pregunta: [`Un resorte de ${c.kk} N/m tiene un largo natural de ${c.L0} cm. ¿Cuánto trabajo cuesta estirarlo desde que mide ${c.L0 + c.a} cm hasta que mide ${c.L0 + c.b} cm?`],
          datos: [D3.epe, D3.cm],
          opciones: opciones(c.Wv, [
            { id: 'dif', valor: c.kk * (c.x2 - c.x1) ** 2 / 2, error: 'EP-DIF', siFuera: 'Las dos deformaciones están bien, pero las restaste antes de elevarlas al cuadrado. Lo que se resta son las dos energías, cada una con su propia deformación al cuadrado.' },
            { id: 'final', valor: c.kk * c.x2 * c.x2 / 2, error: 'EP-FINAL', siFuera: 'La energía del final está bien, pero el resorte ya estaba estirado al empezar y guardaba algo. El trabajo es solo lo que ganó, así que se resta la energía del comienzo.' },
            { id: 'largo', valor: c.kk * ((c.L0 + c.b) ** 2 - (c.L0 + c.a) ** 2) / 20000, error: 'EP-LARGO', siFuera: 'Restar las energías está bien, pero usaste los largos del resorte. La deformación se mide desde el largo natural: es cuánto se alargó, no cuánto mide.' },
          ], J_),
          solucion: { texto: `Desde el largo natural, las deformaciones son ${f(c.x1)} m y ${f(c.x2)} m, y el trabajo es lo que ganó la energía:`, ecuacion: [W, ` = ½ · ${c.kk} · (${f(c.x2)}² − ${f(c.x1)}²) = `, pj(J_(c.Wv))] },
        };
      },
    },
  };

  // ======================= 4: conservación de la energía mecánica (el niño en el tobogán) =======================
  // Cambia: la altura del tobogán y dónde va el niño · Permanece: el niño de 30 kg y el tobogán sin rozamiento · Progresa:
  // la columna de energía, que cambia de color pero no de alto · Se reserva: el tobogán curvo (Predice) · Debe verse: sin
  // rozamiento, E_C + E_PG no cambia; la rapidez abajo depende de la altura, no del camino ni de la masa.
  // El punto del tobogán a la fracción u del camino (el mismo que dibuja la pieza: recto, o curvo y empinado al empezar).
  function enTob(o, u) {
    const [x0, y0] = o.de, [x1, y1] = o.a, k = Math.max(0, Math.min(1, u)), curva = o.forma === 'curva';
    const fy = s => (curva ? 1 - (1 - s) * (1 - s) : s), dfy = s => (curva ? 2 * (1 - s) : 1);
    return { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * fy(k), ang: Math.atan2((y1 - y0) * dfy(k), x1 - x0) * 180 / Math.PI };
  }
  const PISO4 = 214, M4 = 30;
  const nino = (tob, u, alto = 26) => { const p = enTob(tob, u); return { tipo: 'sentado', x: p.x, y: p.y - 3, giro: -p.ang, alto }; };
  // La columna de energía (E_C abajo, en tinta; E_PG encima, en carmín; su alto total es E_M) y, a la derecha, la lista con
  // los valores, en renglones fijos.
  function columna(Epg, Ec, o = {}) {
    const x = o.x || 196, y = o.y || PISO4, k = o.k || 0.085, hc = Ec * k, hp = Epg * k, filas = [[EPG, Epg, 'h'], [EC, Ec, undefined]];
    const objetos = [{ tipo: 'barra-e', x, y, w: 26, h: hc, color: 'tinta' }, { tipo: 'barra-e', x, y: y - hc, w: 26, h: hp, color: 'h' }, { tipo: 'barra-e', x, y, w: 34, h: hc + hp, color: 'tinta', vacia: true }];
    const textos = [{ x: 222, y: 40, texto: `E_PG = ${J_(Epg)}`, ancla: 'start', color: 'h' }, { x: 222, y: 64, texto: `E_C = ${J_(Ec)}`, ancla: 'start' },
      { x: 222, y: 88, texto: `E_M = ${J_(Epg + Ec)}`, ancla: 'start' }];
    if (o.v !== undefined) textos.push({ x: 222, y: 112, texto: vTxt(o.v), ancla: 'start', peso: 400 });
    if (o.h !== undefined) textos.push({ x: 222, y: 136, texto: `aquí, a ${M_(o.h)}`, ancla: 'start', peso: 400 });
    return { objetos, textos, filas };
  }
  function figTobogan(o = {}) {
    const h = o.h, tob = { de: [44, PISO4 - 26 * h], a: [150, PISO4], forma: o.forma || 'recta' }, u = o.u || 0, E = M4 * G * h, Epg = E * (1 - u), Ec = E * u;
    const c = columna(Epg, Ec, { v: Math.sqrt(2 * G * h * u), h: h * (1 - u) });
    return { alto: 236, piso: { y: PISO4, x0: 8, x1: 176 }, objetos: [Object.assign({ tipo: 'tobogan' }, tob), nino(tob, u), ...c.objetos], textos: [...c.textos, ...(o.textos || [])], alt: o.alt };
  }
  const uVista = u => Math.round(u * 100) / 100;   // el avance con las dos cifras que muestra el control: dibujo y lectura usan el mismo
  const juego4 = val => { const u = uVista(val.u), E = M4 * G * val.h;
    return est(figTobogan({ h: val.h, u, alt: `Un niño de 30 kg baja por un tobogán de ${f(val.h)} m sin rozamiento. Arriba tiene ${f(E)} J; en este punto, ${f(E * (1 - u))} J de energía potencial y ${f(E * u)} J de cinética.` })); };
  // Dos toboganes de 4 m, uno recto y otro curvo, lado a lado (25 px por metro).
  function figDos(o = {}) {
    const ta = { de: [26, 110], a: [126, 210], forma: 'recta' }, tb = { de: [176, 110], a: [296, 210], forma: 'curva' };
    return { alto: 236, piso: { y: 210, x0: 8, x1: 312 }, objetos: [Object.assign({ tipo: 'tobogan' }, ta), Object.assign({ tipo: 'tobogan' }, tb), nino(ta, o.u || 0), nino(tb, o.u || 0)],
      textos: [{ x: 76, y: 90, texto: 'recto', ancla: 'middle', peso: 400 }, { x: 236, y: 90, texto: 'curvo y más largo', ancla: 'middle', peso: 400 },
        { x: 120, y: 232, texto: o.v || 'v = ?', ancla: 'middle' }, { x: 290, y: 232, texto: o.v || 'v = ?', ancla: 'middle' }, { x: 160, y: 24, texto: `los dos de ${o.h || '4 m'} de alto`, ancla: 'middle', peso: 400 }, ...(o.textos || [])], alt: o.alt };
  }
  const PRED4 = figDos({ alt: 'Dos toboganes de 4 m de alto: uno recto y corto, otro curvo y más largo. El niño parte de arriba; su rapidez abajo, con un signo de pregunta.' });
  const REVELA4 = figDos({ v: 'v ≈ 8,94 m/s', alt: 'Los dos toboganes dejan al niño a la misma rapidez abajo: unos 8,94 m/s.' });
  const MIRA4 = { alto: 236, piso: { y: PISO4, x0: 8, x1: 176 }, objetos: [], cortes: [
    figTobogan({ h: 5, u: 0 }), figTobogan({ h: 5, u: 0.5 }),
    figDos({ v: 'v = 10 m/s', h: '5 m' }), figDos({ v: 'v = 10 m/s', h: '5 m', textos: [{ x: 160, y: 50, texto: 'v² = 2 · g · h', ancla: 'middle' }] }),
  ], alt: 'Un niño de 30 kg en un tobogán de 5 m: arriba, 1500 J de energía potencial; a media altura, 750 J y 750 J; abajo, a 10 m/s, por el recto y por el curvo.' };

  const D4 = {
    em: ['Energía mecánica: ', EM, ' = ', EC, ' + ', EPG, ' + ', EPE],
    conserva: ['Sin rozamiento: ', EM, ' al inicio = ', EM, ' al final'],
    ec: D2.ec, epg: D3.epg, epe: D3.epe, peso: D.peso, cm: D3.cm,
    trig30: 'sen 30° = 0,5 y sen 60° ≈ 0,87',
  };

  // Ejemplos resueltos de la idea 4. Cuentas rehechas aparte (scratchpad e8-fisica/cuentas.js: la energía mecánica en dos
  // puntos y, donde hace falta, el movimiento integrado paso a paso con g = 10 m/s²): √(2·10·0,8); 8²/20; 100 + 16; 1·10·5;
  // √(2·10·3,2) con 2 y 6 kg; √(10² + 2·10·15); ½·200·0,05² = ½·0,02·v²; √(2·10·0,45); √(2·10·3,2); 4·√(2/800);
  // 125 = 5·h + 50 y cada alternativa; 2·4·10/400 y cada alternativa; √(2·10·1,25) y cada alternativa;
  // √(16 + 48) y cada alternativa; ½·200·0,2² = ½·2·v² y cada alternativa.
  const rampaLisa = (o = {}) => est({ alto: 200, piso: { y: 180, x0: 8, x1: 312 }, objetos: [{ tipo: 'rampa', x0: 40, y0: 180, largo: 200, ang: o.ang || 30 }, Object.assign({ tipo: 'caja', x: 40 + 150 * Math.cos(rad(o.ang || 30)), y: 180 - 150 * Math.sin(rad(o.ang || 30)), w: 34, h: 24, giro: o.ang || 30 }, o.cosa || {})],
    cotas: [{ de: [40 + 200 * Math.cos(rad(o.ang || 30)), 180 - 200 * Math.sin(rad(o.ang || 30))], a: [40 + 200 * Math.cos(rad(o.ang || 30)), 180], texto: o.th || 'h', lado: -1, sep: 10 }],
    textos: o.textos || [], alt: o.alt });
  const EJEMPLOS_CONSERVACION = [
    { nivel: 1, titulo: 'La rampa sin rozamiento',
      figura: rampaLisa({ th: 'h = 0,8 m', cosa: { texto: 'hielo' }, textos: [{ x: 8, y: 24, texto: 'parte del reposo; abajo, v = ?', ancla: 'start', peso: 400 }], alt: 'Un bloque de hielo en lo alto de una rampa de 0,8 m, sin rozamiento.' }),
      enunciado: ['Un bloque de hielo se suelta desde lo alto de una rampa de 0,8 m de alto, sin rozamiento. ¿Con qué rapidez llega abajo?'],
      datos: [D4.conserva, D4.epg, D4.ec],
      solucion: [{ texto: 'Sin rozamiento, la energía mecánica no cambia: toda la energía potencial de arriba se vuelve cinética abajo, y la masa, que está en los dos lados, se cancela:', ecuacion: ['m · 10 · 0,8 = ½ · m · v²;   v² = 16;   v = ', neg('4 m/s')] }],
      respuesta: ['v = ', neg('4 m/s')] },
    { nivel: 1, titulo: 'Hasta dónde sube',
      figura: est({ alto: 200, piso: { y: 180, x0: 8, x1: 312 }, objetos: [{ tipo: 'persona', x: 120, y: 180, alto: 80, mano: [140, 112] }, { tipo: 'pelota', x: 140, y: 96, r: 10 }],
        flechas: [{ de: [156, 96], ang: 90, largo: 40, color: 'tinta', texto: 'v₀ = 8 m/s', rumbo: [1, 0] }], textos: [{ x: 8, y: 24, texto: 'altura máxima: ?', ancla: 'start', peso: 400 }], alt: 'Una pelota lanzada hacia arriba a 8 m/s.' }),
      enunciado: ['Lanzas una pelota hacia arriba a 8 m/s. Sin contar el aire, ¿cuánto sube sobre tu mano?'],
      datos: [D4.conserva, D4.epg, D4.ec],
      solucion: [{ texto: 'En lo más alto la pelota se detiene un instante, así que toda la energía cinética con que salió se volvió potencial:', ecuacion: ['½ · m · 8² = m · 10 · h;   h = ', frac('64', '20'), ' = ', neg('3,2 m')] }],
      respuesta: ['Sube ', neg('3,2 m')] },
    { nivel: 1, titulo: 'La energía mecánica en un punto',
      figura: est({ alto: 200, piso: { y: 180, x0: 8, x1: 312 }, objetos: [{ tipo: 'pelota', x: 120, y: 80, r: 10 }], flechas: [{ de: [136, 80], ang: 0, largo: 36, color: 'tinta', texto: 'v = 4 m/s', rumbo: [1, -0.3] }],
        cotas: [{ de: [90, 80], a: [90, 180], texto: 'h = 5 m', lado: 1, sep: 0 }], textos: [{ x: 312, y: 24, texto: '2 kg; E_M = ?', ancla: 'end' }], alt: 'Una piedra de 2 kg a 5 m de altura que va a 4 m/s.' }),
      enunciado: ['Una piedra de 2 kg pasa a 5 m sobre el suelo, a 4 m/s. Con el suelo como referencia, ¿cuánta energía mecánica tiene?'],
      datos: [D4.em, D4.epg, D4.ec],
      solucion: [{ texto: 'La energía mecánica es la suma de la potencial, por estar a 5 m, y la cinética, por moverse a 4 m/s:', ecuacion: [EM, ' = 2 · 10 · 5 + ½ · 2 · 4² = 100 + 16 = ', neg('116 J')] }],
      respuesta: [EM, ' = ', neg('116 J')] },
    { nivel: 1, titulo: 'Toda se vuelve cinética',
      figura: est({ alto: 200, piso: { y: 180, x0: 8, x1: 312 }, objetos: [{ tipo: 'maceta', x: 120, y: 60, w: 22 }], lineas: [{ de: [120, 70], a: [120, 176] }],
        cotas: [{ de: [160, 60], a: [160, 180], texto: 'h = 5 m', lado: -1, sep: 0 }], textos: [{ x: 312, y: 24, texto: '1 kg; abajo, E_C = ?', ancla: 'end' }], alt: 'Una maceta de 1 kg que cae desde 5 m.' }),
      enunciado: ['Una maceta de 1 kg cae desde 5 m de altura. Sin contar el aire, ¿con cuánta energía cinética llega al suelo?'],
      datos: [D4.conserva, D4.epg],
      solucion: [{ texto: 'Sin aire, la energía mecánica no cambia: toda la energía potencial que tenía arriba llega como cinética al suelo:', ecuacion: [EC, ' = 1 · 10 · 5 = ', neg('50 J')] }],
      respuesta: [EC, ' = ', neg('50 J')] },
    { nivel: 1, titulo: 'El pesado y el liviano',
      figura: rampaLisa({ th: 'h = 3,2 m', cosa: { texto: '2 kg' }, textos: [{ x: 8, y: 24, texto: '2 kg y 6 kg; abajo, v = ?', ancla: 'start', peso: 400 }], alt: 'Una rampa sin rozamiento de 3,2 m de alto por la que bajan un bloque de 2 kg y otro de 6 kg.' }),
      enunciado: ['Por una rampa sin rozamiento de 3,2 m de alto se sueltan, uno después del otro, un bloque de 2 kg y otro de 6 kg. ¿Con qué rapidez llega abajo cada uno?'],
      datos: [D4.conserva, D4.epg, D4.ec],
      solucion: [{ texto: 'En m · g · h = ½ · m · v² la masa está en los dos lados y se cancela, así que los dos bloques llegan igual de rápido:', ecuacion: ['v² = 2 · 10 · 3,2 = 64;   v = ', neg('8 m/s'), ', los dos'] }],
      respuesta: ['Los dos a ', neg('8 m/s')] },
    { nivel: 2, titulo: 'La montaña rusa',
      figura: est({ alto: 200, piso: { y: 180, x0: 8, x1: 312 }, objetos: [{ tipo: 'pista', c: [160, 230], r: 190, de: 50, a: 130, forma: 'loma' }, { tipo: 'carrito', x: 60, y: 76, w: 40, h: 18, mango: 0 }],
        textos: [{ x: 60, y: 40, texto: '20 m; 10 m/s', ancla: 'middle', peso: 400 }, { x: 270, y: 150, texto: '5 m: v = ?', ancla: 'middle', peso: 400 }], alt: 'Un carrito de montaña rusa pasa por un punto a 20 m a 10 m/s y baja a otro a 5 m.' }),
      enunciado: ['Un carrito de montaña rusa pasa por un punto a 20 m de altura a 10 m/s. Sin rozamiento, ¿con qué rapidez pasa por un punto a 5 m de altura?'],
      datos: [D4.conserva, D4.epg, D4.ec],
      solucion: [
        { texto: 'La energía mecánica arriba es igual a la de abajo, y como la masa está en todos los términos, se cancela y se trabaja por cada kilo:', ecuacion: ['½ · 10² + 10 · 20 = ½ · v² + 10 · 5'] },
        { texto: 'Se despeja v²: a la rapidez que traía se le suma lo que ganó al bajar 15 m.', ecuacion: ['v² = 100 + 2 · 10 · 15 = 400;   v = ', neg('20 m/s')] },
      ],
      respuesta: ['v = ', neg('20 m/s')] },
    { nivel: 2, titulo: 'El resorte dispara el dardo',
      figura: est(figResorte({ xpx: 30, texto: '20 g', tx: 'x = 5 cm', textos: [{ x: 8, y: 24, texto: 'k = 200 N/m; al salir, v = ?', ancla: 'start' }], alt: 'Un resorte de 200 N/m comprimido 5 cm contra un dardo de 20 g.' })),
      enunciado: ['Una pistola de juguete tiene un resorte de 200 N/m comprimido 5 cm contra un dardo de 20 g. Sin rozamiento, ¿con qué rapidez sale el dardo?'],
      datos: [D4.conserva, D4.epe, D4.ec, D3.cm, '1 kg = 1000 g'],
      solucion: [
        { texto: 'Primero, la energía que guarda el resorte comprimido, con x en metros:', ecuacion: [EPE, ' = ½ · 200 · 0,05² = 0,25 J'] },
        { texto: 'Sin rozamiento, toda esa energía se vuelve cinética del dardo al salir, con la masa en kilogramos:', ecuacion: ['½ · 0,02 · v² = 0,25;   v² = 25;   v = ', neg('5 m/s')] },
      ],
      respuesta: ['v = ', neg('5 m/s')] },
    { nivel: 2, titulo: 'El columpio',
      figura: est({ alto: 200, techo: { y: 20, x0: 120, x1: 200 }, objetos: [{ tipo: 'cuerda', de: [160, 20], a: [110, 140] }, { tipo: 'caja', x: 110, y: 150, w: 30, h: 10, texto: '' }],
        lineas: [{ de: [160, 20], a: [160, 180] }], cotas: [{ de: [220, 140], a: [220, 185], texto: '0,45 m', lado: -1, sep: 0 }],
        textos: [{ x: 8, y: 24, texto: 'abajo, v = ?', ancla: 'start' }], alt: 'Un columpio soltado con el asiento 0,45 m más alto que su punto más bajo.' }),
      enunciado: ['Sueltas un columpio desde el reposo, con el asiento 0,45 m más alto que en su punto más bajo. Sin rozamiento ni aire, ¿con qué rapidez pasa por abajo?'],
      datos: [D4.conserva, D4.epg, D4.ec],
      solucion: [
        { texto: 'La cuerda tira siempre de lado al camino del asiento, así que no trabaja; solo trabaja el peso, y cuenta lo que baja el asiento:', ecuacion: ['m · 10 · 0,45 = ½ · m · v²'] },
        { texto: 'La masa está en los dos lados y se cancela:', ecuacion: ['v² = 2 · 10 · 0,45 = 9;   v = ', neg('3 m/s')] },
      ],
      respuesta: ['v = ', neg('3 m/s')] },
    { nivel: 2, titulo: 'A media bajada',
      figura: est({ alto: 236, piso: { y: PISO4, x0: 8, x1: 312 }, objetos: [{ tipo: 'tobogan', de: [44, PISO4 - 130], a: [200, PISO4] }, nino({ de: [44, PISO4 - 130], a: [200, PISO4] }, 0.64)],
        cotas: [{ de: [20, PISO4 - 130], a: [20, PISO4], texto: '5 m', lado: 1, sep: 0 }, { de: [240, PISO4 - 47], a: [240, PISO4], texto: '1,8 m', lado: -1, sep: 0 }],
        textos: [{ x: 312, y: 24, texto: 'aquí, v = ?', ancla: 'end' }], alt: 'Un niño que baja por un tobogán de 5 m, cuando pasa a 1,8 m del suelo.' }) ,
      enunciado: ['Un niño se suelta desde lo alto de un tobogán de 5 m, sin rozamiento. ¿Con qué rapidez va cuando pasa a 1,8 m del suelo?'],
      datos: [D4.conserva, D4.epg, D4.ec],
      solucion: [
        { texto: 'Lo que importa es cuánto bajó desde donde partió: 5 − 1,8 = 3,2 m.' },
        { texto: 'La energía potencial que perdió en esa bajada se volvió cinética:', ecuacion: ['v² = 2 · 10 · 3,2 = 64;   v = ', neg('8 m/s')] },
      ],
      respuesta: ['v = ', neg('8 m/s')] },
    { nivel: 2, titulo: 'El bloque que aprieta el resorte',
      figura: est(figResorte({ xpx: 60, texto: '2 kg', tx: 'x = ?', flechas: [{ de: [190, 150], ang: 180, largo: 34, color: 'tinta', texto: 'v = 4 m/s', rumbo: [-0.3, -1] }], textos: [{ x: 8, y: 24, texto: 'k = 800 N/m', ancla: 'start' }],
        alt: 'Un bloque de 2 kg que llega a 4 m/s a un resorte de 800 N/m.' })),
      enunciado: ['Un bloque de 2 kg desliza a 4 m/s sin rozamiento y llega a un resorte de 800 N/m. ¿Cuánto lo comprime como máximo?'],
      datos: [D4.conserva, D4.epe, D4.ec],
      solucion: [
        { texto: 'En la compresión máxima el bloque se detiene un instante, así que toda su energía cinética quedó guardada en el resorte:', ecuacion: ['½ · 2 · 4² = ½ · 800 · x²'] },
        { texto: 'Se despeja x² y se saca la raíz:', ecuacion: ['x² = ', frac('32', '800'), ' = 0,04;   x = ', neg('0,2 m')] },
      ],
      respuesta: ['x = ', neg('0,2 m')] },
    { nivel: 3, titulo: 'La altura desde la azotea', fuente: 'Parecida a San Marcos 2026-II, pregunta 88.',
      figura: est({ alto: 236, piso: { y: 220, x0: 8, x1: 312 }, objetos: [{ tipo: 'edificio', x0: 30, x1: 120, y: 220, pisos: 4, hp: 40 }, { tipo: 'pelota', x: 160, y: 50, r: 9 }],
        flechas: [{ de: [176, 50], ang: 90, largo: 34, color: 'tinta', texto: 'v₀ = 10 m/s', rumbo: [1, 0] }], cotas: [{ de: [24, 60], a: [24, 220], texto: '20 m', lado: 1, sep: 0 }],
        textos: [{ x: 312, y: 200, texto: 'E_C = 50 J: ¿a qué altura?', ancla: 'end', peso: 400 }], alt: 'Desde una azotea a 20 m del suelo se lanza hacia arriba una pelota de 0,5 kg a 10 m/s.' }),
      enunciado: ['Desde una azotea a 20 m del suelo lanzas hacia arriba una pelota de 0,5 kg a 10 m/s. Sin aire, ¿a qué altura sobre el suelo pasa con 50 J de energía cinética?'],
      alternativas: ['5 m', '10 m', '25 m', '20 m', '15 m'],
      datos: [D4.conserva, D4.epg, D4.ec],
      solucion: [
        { texto: 'Con el suelo como referencia, la energía mecánica al lanzarla suma la potencial de la azotea y la cinética del lanzamiento:', ecuacion: [EM, ' = 0,5 · 10 · 20 + ½ · 0,5 · 10² = 125 J'] },
        { texto: 'Esa energía no cambia, así que cuando tiene 50 J de cinética, los otros 75 J son potencial:', ecuacion: ['0,5 · 10 · h = 75;   h = ', neg('15 m')] },
        { texto: [neg('A'), ' da lo que bajó desde la azotea, no la altura sobre el suelo; ', neg('B'), ' iguala la potencial a 50 J, cuando 50 J es la cinética; ', neg('C'), ' suma a la azotea los 5 m que sube la pelota; ', neg('D'), ' olvida el ½ de la cinética inicial.'] },
      ],
      respuesta: [neg('E'), ': ', neg('15 m')] },
    { nivel: 3, titulo: 'Soltar el bloque del resorte', fuente: 'Parecida a San Marcos 2025-II, pregunta 84.',
      figura: est({ alto: 212, techo: { y: 20, x0: 100, x1: 220 }, objetos: [{ tipo: 'resorte', de: [160, 20], a: [160, 90], vueltas: 9 }, { tipo: 'caja', x: 160, y: 130, w: 50, h: 40, texto: '4 kg' }],
        lineas: [{ de: [100, 90], a: [230, 90] }], textos: [{ x: 236, y: 94, texto: 'largo natural', ancla: 'start', peso: 400 }, { x: 8, y: 40, texto: 'k = 400 N/m', ancla: 'start' }, { x: 8, y: 180, texto: 'se suelta: ¿estiramiento máximo?', ancla: 'start', peso: 400 }],
        alt: 'Un bloque de 4 kg colgado de un resorte de 400 N/m en su largo natural, a punto de soltarse.' }),
      enunciado: ['Cuelgas un bloque de 4 kg de un resorte de 400 N/m que está en su largo natural, y lo sueltas desde el reposo. ¿Cuánto se estira el resorte como máximo?'],
      alternativas: ['0,1 m', '0,2 m', '0,02 m', '0,05 m', '0,01 m'],
      datos: [D4.conserva, D4.epg, D4.epe],
      solucion: [
        { texto: 'En el punto más bajo el bloque se detiene, así que la energía potencial que perdió al bajar x quedó guardada en el resorte:', ecuacion: ['4 · 10 · x = ½ · 400 · x²'] },
        { texto: 'Se divide entre x, que no es cero, y se despeja:', ecuacion: ['x = ', frac('2 · 40', '400'), ' = ', neg('0,2 m')] },
        { texto: [neg('A'), ' da donde el bloque se quedaría quieto, pero suelto pasa de largo y llega más abajo; ', neg('C'), ' olvida g; ', neg('D'), ' pone el ½ del lado del peso y no del resorte; ', neg('E'), ' olvida g y el 2.'] },
      ],
      respuesta: [neg('B'), ': ', neg('0,2 m')] },
    { nivel: 3, titulo: 'Dos pendientes, la misma altura', fuente: 'Parecida a San Marcos 2027-I, pregunta 84.',
      figura: rampaLisa({ ang: 30, th: 'h = 1,25 m', textos: [{ x: 8, y: 24, texto: '30° y 60°, sin rozamiento', ancla: 'start', peso: 400 }], alt: 'Una pendiente de 30° y 1,25 m de alto, sin rozamiento.' }),
      enunciado: ['Un bloque se suelta desde 1,25 m de alto por una pendiente de 30° sin rozamiento, y otro igual desde la misma altura por una de 60°. ¿Con qué rapidez llega abajo el de 30°?'],
      alternativas: ['2,5 m/s', '3,54 m/s', '5 m/s', '7,07 m/s', '25 m/s'],
      datos: [D4.conserva, D4.epg, D4.ec, D4.trig30],
      solucion: [
        { texto: 'La normal es perpendicular a la pendiente y no trabaja; solo trabaja el peso, y su trabajo depende de lo que baja, que es igual en las dos pendientes.' },
        { texto: 'La masa está en los dos lados y se cancela, y el ángulo no entra:', ecuacion: ['v² = 2 · 10 · 1,25 = 25;   v = ', neg('5 m/s')] },
        { texto: [neg('A'), ' multiplica por sen 30°, como si el ángulo importara; ', neg('B'), ' olvida el 2 al despejar; ', neg('D'), ' usa el largo de la pendiente, 2,5 m, como si fuera la altura; ', neg('E'), ' no saca la raíz.'] },
      ],
      respuesta: [neg('C'), ': ', neg('5 m/s'), ', como el de 60°'] },
    { nivel: 3, titulo: 'La pista ondulada', fuente: 'Parecida a San Marcos 2024-I, pregunta 88.',
      figura: est({ alto: 200, piso: { y: 180, x0: 8, x1: 312 }, objetos: [{ tipo: 'pista', c: [100, 240], r: 150, de: 60, a: 120, forma: 'loma' }, { tipo: 'pista', c: [230, 15], r: 110, de: 240, a: 300, forma: 'hondonada' }, { tipo: 'caja', x: 70, y: 100, w: 28, h: 18, texto: '' }],
        lineas: [{ de: [70, 109], a: [300, 109] }], cotas: [{ de: [296, 109], a: [296, 125], texto: '2,4 m', lado: -1, sep: 0 }],
        textos: [{ x: 70, y: 74, texto: 'A: 4 m/s', ancla: 'middle', peso: 400 }, { x: 230, y: 150, texto: 'B: v = ?', ancla: 'middle', peso: 400 }], alt: 'Un bloque de hielo pasa por A a 4 m/s y baja por una pista ondulada hasta B, 2,4 m más abajo.' }),
      enunciado: ['Un bloque de hielo pasa por el punto A a 4 m/s y baja por una pista ondulada, sin rozamiento, hasta el punto B, 2,4 m más abajo. ¿Con qué rapidez llega a B?'],
      alternativas: ['6,93 m/s', '10,93 m/s', '6,32 m/s', '8 m/s', '64 m/s'],
      datos: [D4.conserva, D4.epg, D4.ec],
      solucion: [
        { texto: 'La pista no tiene rozamiento, así que su forma no importa: la energía que gana depende solo de lo que baja, y se suma a la cinética que traía.', ecuacion: ['½ · v² = ½ · 4² + 10 · 2,4'] },
        { texto: 'Se despeja v² y se saca la raíz:', ecuacion: ['v² = 16 + 48 = 64;   v = ', neg('8 m/s')] },
        { texto: [neg('A'), ' olvida la rapidez que traía en A; ', neg('B'), ' suma rapideces, 4 + 6,93, cuando lo que se suma son energías; ', neg('C'), ' olvida el 2 al despejar; ', neg('E'), ' no saca la raíz.'] },
      ],
      respuesta: [neg('D'), ': ', neg('8 m/s')] },
    { nivel: 3, titulo: 'El resorte desde su largo natural', fuente: 'Parecida a San Marcos 2027-I, pregunta 83.',
      figura: est(figResorte({ xpx: -60, texto: '2 kg', tx: '30 cm → 50 cm', textos: [{ x: 8, y: 24, texto: 'k = 200 N/m; en el largo natural, v = ?', ancla: 'start' }], alt: 'Un bloque de 2 kg unido a un resorte de 200 N/m y 30 cm de largo natural, estirado hasta 50 cm.' })),
      enunciado: ['Un bloque de 2 kg en un piso sin rozamiento está unido a un resorte de 200 N/m y 30 cm de largo natural. Lo sueltas cuando el resorte mide 50 cm. ¿Qué rapidez tiene en el largo natural?'],
      alternativas: ['2 m/s', '5 m/s', '4 m/s', '2,83 m/s', '3 m/s'],
      datos: [D4.conserva, D4.epe, D4.ec, D3.cm],
      solucion: [
        { texto: 'La deformación se mide desde el largo natural: 50 − 30 = 20 cm = 0,2 m. Con ella, el resorte guarda ½ · 200 · 0,2² = 4 J.' },
        { texto: 'En el largo natural el resorte ya no guarda nada, así que esos 4 J son ahora energía cinética:', ecuacion: ['½ · 2 · v² = 4;   v = ', neg('2 m/s')] },
        { texto: [neg('B'), ' toma como deformación todo el largo, 0,5 m, y no lo que se estiró; ', neg('C'), ' no saca la raíz; ', neg('D'), ' olvida el ½ de la energía del resorte; ', neg('E'), ' usa el largo natural, 0,3 m, como deformación.'] },
      ],
      respuesta: [neg('A'), ': ', neg('2 m/s')] },
  ];

  const conservacion = {
    id: 'conservacion-energia',
    titulo: 'Conservación de la energía mecánica',
    pregunta: '¿De qué depende la rapidez al final del tobogán?',
    temas: ['Conservación de la energía mecánica'],
    pieza: 'fis-estatica',
    aprendizaje: 'Sin rozamiento, la energía cinética más la potencial no cambia: la rapidez abajo depende de la altura, no del camino ni de la masa.',
    actividad: 'Soltar a un niño desde lo alto de un tobogán más o menos alto.',
    lee: {
      tarjetas: [
        { titulo: 'Altura por rapidez', texto: ['Al bajar por un tobogán, el niño pierde altura y gana rapidez: cambia energía potencial por energía cinética. La suma de la energía cinética y las potenciales se llama energía mecánica, ', EM, '.'],
          dibujo: est(figTobogan({ h: 3.2, u: 0.25, alt: 'Un niño bajando por el tobogán del parque.' })) },
        { titulo: 'Sin nada que frene', texto: 'Un tobogán encerado casi no frena. Aquí supondremos que no frena nada, como si fuera perfectamente liso y no hubiera aire. Lo que pasa cuando algo sí frena se ve en la idea que sigue.' },
        { titulo: 'Qué mirar al jugar', texto: ['Elige la altura y dale ▶ para que el niño baje. Mira la columna de energía mientras baja: la parte de ', EPG, ', la parte de ', EC, ' y el alto total de la columna, que es ', EM, '.'] },
      ],
    },
    ejemplos: EJEMPLOS_CONSERVACION,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'Un niño de 30 kg se suelta desde lo alto de un tobogán sin rozamiento. Elige la altura y mira cómo baja.',
      mision: {
        texto: 'Elige la altura para que el niño llegue abajo a 6 m/s.',
        // Una sola manera en la grilla: 1,8 m (540 J, ½ · 30 · 6² = 540).
        logrado: val => Math.abs(val.h - 1.8) < 1e-9,
        bien: 'Llega a 6 m/s: los 540 J de arriba llegan enteros como energía cinética.',
      },
      voz: 'Mientras baja, ¿qué le pasa al alto de la columna?',
      leyenda: [
        { s: EPG, t: 'energía de la altura' },
        { s: EC, t: 'energía del movimiento' },
        { s: EM, t: 'la suma: el alto de la columna' },
        { s: 'h', t: 'altura del tobogán' },
        { s: 'v', t: 'rapidez del niño' },
      ],
      controles: [
        { id: 'h', etiqueta: 'Altura, h', opciones: [{ valor: 1.25, texto: '1,25 m' }, { valor: 1.8, texto: '1,8 m' }, { valor: 3.2, texto: '3,2 m' }, { valor: 5, texto: '5 m' }], inicio: 3.2 },
        { id: 'u', etiqueta: 'Parte del camino (0 arriba, 1 abajo)', min: 0, max: 1, paso: 0.25, inicio: 0, unidad: '', decimales: 2, auto: { velocidad: 0.25, modo: 'repite' } },
      ],
      dibujo: juego4,
      // La lectura enuncia la relación: la suma no cambia.
      lectura: val => { const u = uVista(val.u), E = M4 * G * val.h; return [`${J_(E * (1 - u))} + ${J_(E * u)} = ${J_(E)}, como arriba`]; },
      resumen: { h: 3.2, u: 0.5 },
      minimo: 3,
    },
    predice: {
      pregunta: 'Dos toboganes sin rozamiento tienen el mismo alto: uno es recto y corto; el otro, curvo y más largo. ¿En cuál llega más rápido abajo el mismo niño?',
      datos: ['Los dos toboganes tienen 4 m de alto.', 'El niño parte del reposo arriba.', 'No hay rozamiento ni aire.'],
      opciones: [
        { id: 'c', texto: 'Llega igual de rápido en los dos', correcta: true },
        { id: 'curvo', texto: 'En el curvo: tiene más camino para acelerar', error: 'W1', siFuera: 'El curvo tiene más camino, pero el peso solo trabaja con lo que baja, y en los dos toboganes el niño baja los mismos 4 m. Gana la misma energía cinética en los dos.' },
        { id: 'recto', texto: 'En el recto: es más directo', error: 'CE-CAMINO', siFuera: 'Que el recto sea más corto no lo hace llegar con más rapidez: aquí se pregunta la rapidez abajo, no cuánto tarda. Sin rozamiento, esa rapidez depende solo de lo que bajó, 4 m en los dos.' },
        { id: 'forma', texto: 'En el curvo: al empezar es más empinado', error: 'CE-FORMA', siFuera: 'Es cierto que en el curvo acelera más al empezar, pero después la pista se aplana y gana menos. Al final, la energía ganada depende solo de los 4 m que bajó.' },
      ],
      dibujo: est(PRED4),
      revelar: est(REVELA4),
      coincide: 'Coincide: sin rozamiento, el peso es la única fuerza que trabaja, y su trabajo depende solo de la altura que bajó el niño, no de la forma del camino.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: MIRA4,
      pasos: [
        { estado: { corte: 0 }, texto: 'Arriba, el niño de 30 kg está quieto: toda su energía mecánica es potencial.', ecuacion: [EPG, ' = 30 · 10 · 5 = 1500 J'] },
        { estado: { corte: 1 }, texto: 'A media altura perdió la mitad de su energía potencial, y esa mitad se volvió cinética: la suma sigue igual.', ecuacion: ['750 J + 750 J = 1500 J'] },
        { estado: { corte: 2 }, texto: 'Abajo toda la energía es cinética, en el tobogán recto y en el curvo, porque los dos bajan lo mismo.', ecuacion: ['½ · 30 · v² = 1500 J;   v = 10 m/s'] },
        { estado: { corte: 3 }, texto: 'La masa está a los dos lados de la igualdad y se cancela: un niño más pesado llega igual de rápido.', ecuacion: ['m · g · h = ½ · m · v²;   v² = 2 · g · h'] },
      ],
    },
    regla: {
      texto: 'La energía mecánica es la cinética más las potenciales. Si nada frena, no cambia en todo el camino: lo que pierde una forma lo gana otra, como el niño que pierde altura y gana rapidez. Por eso la rapidez depende de cuánto bajó el cuerpo, no de la forma ni del largo del camino.',
      ecuacion: [EM, ' = ', EC, ' + ', EPG, ' + ', EPE, '   ;   ', EM, ' al inicio = ', EM, ' al final'],
      condicion: 'solo trabajan el peso y los resortes; la normal de una pista quieta no trabaja. Si hay rozamiento, la energía mecánica baja: parte se vuelve calor.',
      voz: 'Sin rozamiento, lo que pierde la altura lo gana la rapidez, por cualquier camino.',
      dibujo: est(REVELA4),
    },
    // Así se resuelve: la rapidez al pie de una rampa (semillas pares) o la altura de lo que se lanza hacia arriba
    // (impares), con otros objetos que «Ahora tú».
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 1) {
          const v0 = r.de([5, 7, 9, 15]), hh = v0 * v0 / (2 * G);
          return {
            enunciado: [`Una piedra se lanza hacia arriba a ${v0} m/s. Sin aire, ¿cuánto sube desde donde se lanzó?`],
            datos: [D4.conserva, D4.epg, D4.ec],
            pasos: [
              { tipo: 'pide', texto: 'Piden la altura que sube la piedra desde donde se lanzó.' },
              { tipo: 'datos', texto: `Sale a ${v0} m/s hacia arriba. En lo más alto, por un instante, está quieta.` },
              { tipo: 'regla', texto: 'Sin aire, solo trabaja el peso y la energía mecánica no cambia: la cinética del lanzamiento se vuelve potencial en lo más alto, donde la piedra está quieta.', ecuacion: ['½ · m · v₀² = m · g · h'] },
              { tipo: 'cuentas', texto: 'La masa está en los dos lados y se cancela, así que se despeja h:', ecuacion: [`h = ${v0}² ÷ (2 · 10) = `, neg(M_(hh))] },
              { tipo: 'sentido', texto: `Con el doble de rapidez subiría cuatro veces más, porque la energía del lanzamiento va con v² y toda se vuelve altura.` },
            ],
            respuesta: ['Sube ', neg(M_(hh))],
          };
        }
        const ob = r.de(['Una caja', 'Un trineo']), hh = r.de([0.2, 6.05, 8.45, 9.8]), v = Math.sqrt(2 * G * hh), ang = r.de([30, 37]);
        return {
          enunciado: [`${ob} se suelta desde lo alto de una rampa sin rozamiento de ${f(hh)} m de alto. ¿Con qué rapidez llega abajo?`],
          datos: [D4.conserva, D4.epg, D4.ec],
          dibujo: rampaLisa({ ang, th: `h = ${f(hh)} m`, textos: [{ x: 8, y: 24, texto: 'parte del reposo; abajo, v = ?', ancla: 'start', peso: 400 }] }),
          pasos: [
            { tipo: 'pide', texto: 'Piden la rapidez con que el cuerpo llega al pie de la rampa.' },
            { tipo: 'datos', texto: `Parte del reposo a ${f(hh)} m de alto. No hay rozamiento.` },
            { tipo: 'regla', texto: 'Sin rozamiento, la normal no trabaja y la energía mecánica no cambia: la potencial de arriba se vuelve cinética abajo.', ecuacion: ['m · g · h = ½ · m · v²'] },
            { tipo: 'cuentas', texto: 'La masa está en los dos lados y se cancela, así que se despeja v²:', ecuacion: [`v² = 2 · 10 · ${f(hh)} = ${f(2 * G * hh)};   v = `, neg(MS(v))] },
            { tipo: 'sentido', texto: 'No hizo falta ni la masa ni el ángulo de la rampa: sin rozamiento, la rapidez de abajo depende solo de la altura.' },
          ],
          respuesta: ['v = ', neg(MS(v))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4;
        if (k === 0) {
          const ob = r.de(['un niño, por un tobogán', 'un bloque de hielo, por una rampa', 'un trineo, por una duna']);
          const c = elegir(() => { const hh = r.de([0.45, 1.25, 2.45, 4.05, 7.2, 11.25]), v = Math.sqrt(2 * G * hh); return distintos(v, 2 * G * hh, Math.sqrt(G * hh), G * hh) && { hh, v }; });
          return {
            pregunta: [`Sin rozamiento, ${ob.split(',')[0]} baja${ob.split(',')[1]} de ${f(c.hh)} m de alto, desde el reposo. ¿Con qué rapidez llega abajo?`],
            datos: [D4.conserva, D4.epg, D4.ec],
            opciones: opciones(c.v, [
              { id: 'sin-raiz', valor: 2 * G * c.hh, error: 'CE-SIN-RAIZ', siFuera: 'Igualar las energías está bien, pero ese número es v², la rapidez al cuadrado. Falta sacar la raíz.' },
              { id: 'sin-dos', valor: Math.sqrt(G * c.hh), error: 'TE-SIN-DOS', siFuera: 'La raíz está bien, pero olvidaste el ½ de la energía cinética. Al despejar v², ese ½ deja un 2 que multiplica a g · h.' },
              { id: 'gh', valor: G * c.hh, error: 'CE-GH', siFuera: 'Usar g y h es el comienzo, pero faltan dos pasos: el 2 que deja el ½ de la cinética y la raíz para pasar de v² a v.' },
            ], MS),
            solucion: { texto: 'Sin rozamiento, la potencial de arriba es la cinética de abajo; la masa se cancela:', ecuacion: [`v² = 2 · 10 · ${f(c.hh)};   v = `, neg(MS(c.v))] },
          };
        }
        if (k === 1) {
          const c = elegir(() => { const v0 = r.de([4, 6, 10, 12, 14, 20]), hh = v0 * v0 / (2 * G); return distintos(hh, v0 * v0 / G, v0 / (2 * G), v0 / G) && { v0, hh }; });
          return {
            pregunta: [`Lanzas una pelota hacia arriba a ${c.v0} m/s. Sin aire, ¿cuánto sube sobre tu mano?`],
            datos: [D4.conserva, D4.epg, D4.ec],
            opciones: opciones(c.hh, [
              { id: 'sin-dos', valor: c.v0 * c.v0 / G, error: 'TE-SIN-MEDIO', siFuera: 'Igualar las energías está bien, pero la energía cinética es ½ · m · v², y ese ½ faltó. Sin él, la altura sale el doble.' },
              { id: 'sin-cuad', valor: c.v0 / (2 * G), error: 'TE-LINEAL', siFuera: 'El planteo va bien, pero usaste la rapidez sin elevarla. La energía cinética va con v², y por eso la altura crece con el cuadrado de la rapidez.' },
              { id: 'vg', valor: c.v0 / G, error: 'CE-TIEMPO', siFuera: 'Dividir la rapidez entre g da el tiempo que tarda en subir, en segundos, no la altura. La altura sale de igualar la energía cinética con la potencial.' },
            ], M_),
            solucion: { texto: 'Sin aire, la cinética del lanzamiento es la potencial de arriba, donde la pelota se detiene; la masa se cancela:', ecuacion: [`h = ${c.v0}² ÷ (2 · 10) = `, neg(M_(c.hh))] },
          };
        }
        if (k === 2) {
          const c = elegir(() => { const v0 = r.de([2, 4, 6, 8, 10]), dh = r.de([1.6, 2.4, 3, 4.2, 5, 6.4]), v = Math.sqrt(v0 * v0 + 2 * G * dh);
            return exacto(v) && !(v0 === 4 && dh === 2.4) && distintos(v, Math.sqrt(2 * G * dh), v0 + Math.sqrt(2 * G * dh), Math.sqrt(v0 * v0 + G * dh)) && { v0, dh, v }; });
          return {
            pregunta: [`Un carrito de montaña rusa pasa por un punto a ${c.v0} m/s y baja, sin rozamiento, hasta otro punto ${f(c.dh)} m más abajo. ¿Con qué rapidez pasa por ahí?`],
            datos: [D4.conserva, D4.epg, D4.ec],
            opciones: opciones(c.v, [
              { id: 'sin-v0', valor: Math.sqrt(2 * G * c.dh), error: 'CE-SIN-V0', siFuera: 'Lo que gana en la bajada está bien, pero el carrito ya traía rapidez. Su energía cinética de antes se suma a la que gana al bajar.' },
              { id: 'suma-v', valor: c.v0 + Math.sqrt(2 * G * c.dh), error: 'CE-SUMA-V', siFuera: 'Las dos partes están bien, pero sumaste rapideces. Lo que se suma son energías, y por eso se suman los cuadrados: v² = v₀² + 2 · g · h.' },
              { id: 'sin-dos', valor: Math.sqrt(c.v0 * c.v0 + G * c.dh), error: 'TE-SIN-DOS', siFuera: 'Sumar la energía que traía está bien, pero la bajada aporta 2 · g · h a v², no solo g · h. Ese 2 viene del ½ de la energía cinética.' },
            ], MS),
            solucion: { texto: 'La energía mecánica no cambia; por cada kilo, a la cinética de antes se le suma lo que ganó al bajar:', ecuacion: [`v² = ${c.v0}² + 2 · 10 · ${f(c.dh)} = ${f(c.v * c.v)};   v = `, neg(MS(c.v))] },
          };
        }
        // Nivel examen: un resorte que frena un bloque, o el resorte vertical que se estira al soltar (San Marcos 2025-II).
        if (sm % 8 < 4) {
          const c = elegir(() => { const m = r.de([1, 2, 4, 5]), v = r.de([2, 3, 4, 5, 6]), kk = r.de([100, 200, 400, 500, 1000]), x = v * Math.sqrt(m / kk);
            return exacto(x) && x >= 0.05 && x <= 0.6 && !(m === 2 && v === 4 && kk === 800) && distintos(x, m * v * v / kk, Math.sqrt(m * v * v / (2 * kk)), m * v / kk) && { m, v, kk, x }; });
          return {
            pregunta: [`Un bloque de ${c.m} kg desliza a ${c.v} m/s sin rozamiento y llega a un resorte de ${c.kk} N/m. ¿Cuánto lo comprime como máximo?`],
            datos: [D4.conserva, D4.epe, D4.ec],
            opciones: opciones(c.x, [
              { id: 'sin-raiz', valor: c.m * c.v * c.v / c.kk, error: 'CE-SIN-RAIZ', siFuera: 'Igualar las energías está bien, pero ese número es x², la compresión al cuadrado. Falta sacar la raíz.' },
              { id: 'un-medio', valor: Math.sqrt(c.m * c.v * c.v / (2 * c.kk)), error: 'EP-SIN-MEDIO', siFuera: 'La raíz está bien, pero hay un ½ en la energía cinética y otro en la del resorte, y se cancelan. Aquí quedó uno solo.' },
              { id: 'lineal', valor: c.m * c.v / c.kk, error: 'EP-LINEAL', siFuera: 'Usar m, v y k está bien, pero sin cuadrados. La energía cinética va con v² y la del resorte con x², así que se iguala con cuadrados y al final se saca la raíz.' },
            ], M_),
            solucion: { texto: 'En la compresión máxima el bloque se detiene, así que toda su energía cinética quedó en el resorte:', ecuacion: [`½ · ${c.m} · ${c.v}² = ½ · ${c.kk} · x²;   x = `, neg(M_(c.x))] },
          };
        }
        const c = elegir(() => { const m = r.de([1, 2, 3, 5]), kk = r.de([100, 200, 250, 500]), x = 2 * m * G / kk;
          return exacto(x) && !(m === 4 && kk === 400) && distintos(x, m * G / kk, m * G / (2 * kk), 2 * m / kk) && { m, kk, x }; });
        return {
          pregunta: [`Cuelgas un bloque de ${c.m} kg de un resorte de ${c.kk} N/m que está en su largo natural, y lo sueltas desde el reposo. ¿Cuánto se estira el resorte como máximo?`],
          datos: [D4.conserva, D4.epg, D4.epe],
          opciones: opciones(c.x, [
            { id: 'equilibrio', valor: c.m * G / c.kk, error: 'CE-EQUILIBRIO', siFuera: 'Ahí el resorte sostiene el peso y el bloque se quedaría quieto si lo bajaras despacio. Suelto, llega a ese punto con rapidez y pasa de largo, hasta el doble.' },
            { id: 'medio', valor: c.m * G / (2 * c.kk), error: 'EP-SIN-MEDIO', siFuera: 'Igualar las energías está bien, pero el ½ quedó en el lado del peso. El ½ es de la energía del resorte; lo que baja el bloque da m · g · x, sin ½.' },
            { id: 'sin-g', valor: 2 * c.m / c.kk, error: 'EP-SIN-G', siFuera: 'El planteo va bien, pero lo que baja el bloque aporta m · g · x, y faltó g. Sin g se usa la masa en vez del peso.' },
          ], M_),
          solucion: { texto: 'En el punto más bajo el bloque se detiene, así que la energía potencial que perdió al bajar quedó en el resorte:', ecuacion: [`${c.m} · 10 · x = ½ · ${c.kk} · x²;   x = `, neg(M_(c.x))] },
        };
      },
    },
  };

  // ======================= 5: energía con rozamiento (la caja en la rampa de tablones) =======================
  // Cambia: la altura de la rampa y lo áspero de los tablones · Permanece: la caja de 2 kg y la rampa de 37° · Progresa: la
  // parte de la columna que se vuelve calor · Se reserva: otra rampa más empinada, de la misma altura (Predice) · Debe
  // verse: E_M al final = E_M al inicio + W_f; el trabajo del rozamiento depende del camino.
  const PISO5 = 214, PX5 = 22, M5 = 2;
  // Una rampa de ángulo ang y altura h (en px), con el vértice de abajo en x0; la caja a la fracción u del camino, desde arriba.
  function rampaCaja(x0, hpx, ang, u, texto) {
    const run = hpx / Math.tan(rad(ang)), top = [x0 + run, PISO5 - hpx], L = hpx / Math.sin(rad(ang)), s = Math.max(20, (L - 40) * (1 - u) + 20);
    const px = x0 + s * Math.cos(rad(ang)), py = PISO5 - s * Math.sin(rad(ang));
    return { objetos: [{ tipo: 'rampa', x0, y0: PISO5, largo: L, ang }, { tipo: 'caja', x: px, y: py, w: 30, h: 22, giro: ang, texto: texto || '' }], top, run };
  }
  // La columna de la energía con rozamiento: E_C abajo (tinta), lo que ya es calor (turquesa) y E_PG arriba (carmín); el
  // borde punteado es la energía del comienzo, que no cambia.
  function columna5(Epg, Ec, Q, o = {}) {
    const x = 196, y = PISO5, k = o.k || 0.9;
    return { objetos: [{ tipo: 'barra-e', x, y, w: 26, h: Ec * k, color: 'tinta' }, { tipo: 'barra-e', x, y: y - Ec * k, w: 26, h: Q * k, color: 'i' },
      { tipo: 'barra-e', x, y: y - (Ec + Q) * k, w: 26, h: Epg * k, color: 'h' }, { tipo: 'barra-e', x, y, w: 34, h: (Epg + Ec + Q) * k, color: 'tinta', vacia: true }],
    textos: [{ x: 222, y: 40, texto: `E_PG = ${J_(Epg)}`, ancla: 'start', color: 'h' }, { x: 222, y: 64, texto: `E_C = ${J_(Ec)}`, ancla: 'start' }, { x: 222, y: 88, texto: `calor: ${J_(Q)}`, ancla: 'start', color: 'i' }] };
  }
  const energia5 = (h, mu, u) => { const E = M5 * G * h, Qt = mu * M5 * G * 0.8 * h / 0.6; return { E, Qt, Epg: E * (1 - u), Q: Qt * u, Ec: (E - Qt) * u }; };
  function figRampa5(o) {
    const hpx = PX5 * o.h, rc = rampaCaja(20, hpx, 37, o.u, `${M5} kg`), e = energia5(o.h, o.mu, o.u), c = columna5(e.Epg, e.Ec, e.Q, { k: 0.9 });
    return { alto: 236, piso: { y: PISO5, x0: 8, x1: 176 }, objetos: [...rc.objetos, ...c.objetos], textos: [...c.textos, { x: 222, y: 112, texto: `μ_k = ${f(o.mu)}`, ancla: 'start', peso: 400 }],
      angulos: [{ c: [20, PISO5], de: 0, a: 37, r: 30, texto: 'θ = 37°' }], cotas: [{ de: [rc.top[0], rc.top[1]], a: [rc.top[0], PISO5], texto: `h = ${f(o.h)} m`, lado: -1, sep: 4 }], alt: o.alt };
  }
  const juego5 = val => { const u = uVista(val.u), e = energia5(val.h, val.mu, u);
    return est(figRampa5({ h: val.h, mu: val.mu, u, alt: `Una caja de 2 kg baja por una rampa de 37° y ${f(val.h)} m de alto con μk = ${f(val.mu)}: arriba tiene ${f(e.E)} J; abajo llegará con ${f(e.E - e.Qt)} J y ${f(e.Qt)} J se volverán calor.` })); };
  // Dos rampas de 3 m (30 px por metro), una de 37° y otra de 53°, con la caja arriba.
  function figDosRampas(o = {}) {
    const a = rampaCaja(16, 90, 37, 0, ''), b = rampaCaja(196, 90, 53, 0, '');
    return { alto: 236, piso: { y: PISO5, x0: 8, x1: 312 }, objetos: [...a.objetos, ...b.objetos],
      angulos: [{ c: [16, PISO5], de: 0, a: 37, r: 26, texto: '37°' }, { c: [196, PISO5], de: 0, a: 53, r: 22, texto: '53°' }],
      cotas: [{ de: [a.top[0], a.top[1]], a: [a.top[0], PISO5], texto: '3 m', lado: -1, sep: 4 }, { de: [b.top[0], b.top[1]], a: [b.top[0], PISO5], texto: '3 m', lado: -1, sep: 4 }],
      textos: [{ x: 60, y: 232, texto: o.a !== undefined ? o.a : 'abajo: v = ?', ancla: 'middle', peso: 400 }, { x: 236, y: 232, texto: o.b !== undefined ? o.b : 'abajo: v = ?', ancla: 'middle', peso: 400 }, ...(o.textos || [])], alt: o.alt };
  }
  const PRED5 = figDosRampas({ alt: 'Dos rampas de 3 m de alto con los mismos tablones: una de 37° y otra de 53°. La caja parte de arriba; su rapidez abajo, con un signo de pregunta.' });
  const REVELA5 = figDosRampas({ a: 'E_C = 36 J', b: 'E_C = 46,5 J', textos: [{ x: 160, y: 24, texto: 'con 2 kg y μ_k = 0,3', ancla: 'middle', peso: 400 }],
    alt: 'Con una caja de 2 kg y μk = 0,3, abajo de la rampa de 37° llega con 36 J y abajo de la de 53° con 46,5 J: más rápida en la empinada.' });
  const MIRA5 = { alto: 236, piso: { y: PISO5, x0: 8, x1: 312 }, objetos: [], cortes: [
    figDosRampas({ a: 'recorre 5 m', b: '', textos: [{ x: 8, y: 24, texto: 'N = 20 · cos 37° = 16 N', ancla: 'start', color: 'f' }, { x: 8, y: 48, texto: 'caja de 2 kg; μ_k = 0,3', ancla: 'start', peso: 400 }] }),
    figDosRampas({ a: 'recorre 5 m', b: 'recorre 3,75 m', textos: [{ x: 312, y: 24, texto: 'N = 20 · cos 53° = 12 N', ancla: 'end', color: 'f' }] }),
    figDosRampas({ a: 'E_C = 36 J', b: 'E_C = 46,5 J', textos: [{ x: 160, y: 24, texto: 'arriba, 60 J en las dos', ancla: 'middle', peso: 400 }] }),
    figDosRampas({ a: 'W_f = −24 J', b: 'W_f = −13,5 J', textos: [{ x: 160, y: 24, texto: 'W del peso = 60 J en las dos', ancla: 'middle', color: 'h' }] }),
  ], alt: 'La caja de 2 kg recorre 5 m en la rampa de 37° y 3,75 m en la de 53°: el rozamiento le quita 24 J y 13,5 J; llega con 36 J y con 46,5 J.' };
  // Los botes de una pelota: la altura de cada uno, a la misma escala (alturas en metros, 18 px por metro).
  function figBotes(alturas, o = {}) {
    const piso = 214, xs = alturas.map((_, i) => 50 + i * 80), lineas = [], textos = [], k = Math.min(18, 150 / alturas[0]);
    // Una altura que se pide (null) no se dibuja: a escala delataría la respuesta; va su rótulo a media altura.
    alturas.forEach((hh, i) => { if (hh !== null) { lineas.push({ de: [xs[i], piso], a: [xs[i], piso - k * hh] }); textos.push({ x: xs[i] + 14, y: piso - k * hh + 4, texto: o.t ? o.t[i] : M_(hh), ancla: 'start', peso: 400 }); }
      else if (o.t && o.t[i]) textos.push({ x: xs[i], y: piso - k * alturas[0] / 2, texto: o.t[i], ancla: 'middle', peso: 400 }); });
    return { alto: 236, piso: { y: piso, x0: 8, x1: 312 }, objetos: [{ tipo: 'pelota', x: xs[0], y: piso - k * alturas[0] - 10, r: 9 }], lineas, textos: [...textos, ...(o.textos || [])], alt: o.alt };
  }

  const D5 = {
    balance: [EM, ' al final = ', EM, ' al inicio + ', Wf],
    wf: [Wf, ' = −', fk, ' · d, con d lo que desliza'],
    cin: D.cin, peso: D.peso, trig: D.trig, epg: D3.epg, ec: D2.ec, em: D4.em,
    rampa: ['En una rampa de ángulo θ, la normal es ', N, ' = ', ...MG, ' · cos θ, y el largo es h / sen θ'],
    piso: 'En un piso horizontal, la normal iguala al peso',
    pierde: 'Si pierde un p % de su energía, le queda (100 − p) %',
  };

  // Ejemplos resueltos de la idea 5. Cuentas rehechas aparte (scratchpad e8-fisica/cuentas.js: la energía mecánica tramo a
  // tramo, con el rozamiento μ_k · N por la distancia que desliza; los botes, multiplicando por lo que queda en cada uno):
  // 80 − 50; 600 − 150; −30·4; 2·0,75; ½·1000·(10² − 5²); 120 − 0,3·32·5 = ½·4·v²; 1,8/0,3; 100/(20·(1 + 0,5·4/3));
  // 5·0,8²; ½·20·8² − 20·10·5; 10·0,9⁴ y cada alternativa; (5 − 0,4·5)/5 y cada alternativa; (30 − 18)/(10·0,8·5) y cada
  // alternativa; (30 − 10)/2,5 y cada alternativa; 32/(10·(0,6 + 0,5·0,8)) y cada alternativa.
  const EJEMPLOS_ROCE = [
    { nivel: 1, titulo: 'Lo que se volvió calor',
      figura: est(figRampa5({ h: 4, mu: 0.15, u: 0, alt: 'Una caja de 2 kg arriba de una rampa de 4 m con rozamiento.' })),
      enunciado: ['Una caja de 2 kg baja desde 4 m de alto por una rampa con rozamiento, y llega abajo con 50 J de energía cinética. ¿Cuánta energía se volvió calor?'],
      datos: [D5.balance, D.calor, D5.epg],
      solucion: [{ texto: 'Arriba, quieta, la caja tenía 2 · 10 · 4 = 80 J de energía potencial. La energía no desaparece, así que lo que no llegó abajo como cinética se volvió calor:', ecuacion: ['80 − 50 = ', pr('30 J')] }],
      respuesta: ['Se volvieron calor ', pr('30 J')] },
    { nivel: 1, titulo: 'Con cuánta energía llega',
      figura: est({ alto: 236, piso: { y: PISO4, x0: 8, x1: 312 }, objetos: [{ tipo: 'tobogan', de: [44, PISO4 - 80], a: [200, PISO4] }, nino({ de: [44, PISO4 - 80], a: [200, PISO4] }, 0)],
        cotas: [{ de: [20, PISO4 - 80], a: [20, PISO4], texto: '2 m', lado: 1, sep: 0 }], textos: [{ x: 312, y: 24, texto: 'calor: 150 J; abajo, E_C = ?', ancla: 'end', peso: 400 }], alt: 'Un niño de 30 kg arriba de un tobogán de 2 m que frena un poco.' }),
      enunciado: ['Un niño de 30 kg baja desde el reposo por un tobogán de 2 m de alto que frena un poco: el rozamiento convierte 150 J en calor. ¿Con qué energía cinética llega abajo?'],
      datos: [D5.balance, D.calor, D5.epg],
      solucion: [{ texto: 'Arriba, el niño tiene 30 · 10 · 2 = 600 J de energía potencial. Abajo llega como cinética lo que el rozamiento no se llevó:', ecuacion: [EC, ' = 600 − 150 = ', neg('450 J')] }],
      respuesta: [EC, ' = ', neg('450 J')] },
    { nivel: 1, titulo: 'El rozamiento en el piso',
      figura: est({ alto: 216, piso: { y: 170, x0: 8, x1: 312 }, objetos: [{ tipo: 'costal', x: 120, y: 170, w: 60, h: 40, texto: 'papas' }],
        flechas: [{ de: [88, 162], ang: 180, largo: 30, color: 'i', texto: 'f = 30 N', rumbo: [-0.3, -1] }, { de: [120, 112], ang: 0, largo: 40, color: 'tinta', texto: 'v⃗', rumbo: [1, -0.3] }],
        cotas: [{ de: [90, 170], a: [300, 170], texto: 'd = 4 m', lado: 1, sep: 20 }], textos: [{ x: 312, y: 24, texto: 'W_f = ?', ancla: 'end' }], alt: 'Un costal desliza 4 m y el piso lo frena con 30 N.' }),
      enunciado: ['Un costal desliza 4 m por el piso y el rozamiento lo frena con ', pr('30 N'), '. ¿Cuánto trabajo hace el rozamiento, y cuánto baja la energía mecánica?'],
      datos: [D5.wf, D5.balance],
      solucion: [{ texto: 'El rozamiento va contra el avance, así que su trabajo es negativo:', ecuacion: [Wf, ' = −30 · 4 = ', pr('−120 J')] }, { texto: 'Ese trabajo negativo es lo que baja la energía mecánica: 120 J, que se vuelven calor en el piso y en el costal.' }],
      respuesta: [Wf, ' = ', pr('−120 J'), ': baja 120 J'] },
    { nivel: 1, titulo: 'El bote que pierde energía',
      figura: est(figBotes([2, null], { t: ['2 m', 'después: ?'], textos: [{ x: 312, y: 24, texto: 'pierde 25 % en el bote', ancla: 'end', peso: 400 }], alt: 'Una pelota cae de 2 m y pierde el 25 % de su energía al botar.' })),
      enunciado: ['Una pelota se suelta desde 2 m y, al botar, pierde el 25 % de su energía. Sin aire, ¿hasta qué altura sube después?'],
      datos: [D5.pierde, D5.epg],
      solucion: [{ texto: 'Después del bote le queda el 75 % de la energía, y en lo más alto toda es potencial; como la potencial es proporcional a la altura, la altura también queda en el 75 %:', ecuacion: ['h = 0,75 · 2 = ', neg('1,5 m')] }],
      respuesta: ['Sube ', neg('1,5 m')] },
    { nivel: 1, titulo: 'La energía que disipan los frenos',
      figura: est({ alto: 170, piso: { y: 150, x0: 8, x1: 312 }, objetos: [{ tipo: 'auto', x: 130, y: 150, w: 84 }],
        flechas: [{ de: [110, 96], ang: 0, largo: 44, color: 'tinta', texto: 'de 10 a 5 m/s', rumbo: [1, -0.3] }], textos: [{ x: 8, y: 24, texto: 'disipada: ?', ancla: 'start', color: 'i' }], alt: 'Un auto de 1000 kg que frena de 10 a 5 m/s en una pista plana.' }),
      enunciado: ['Un auto de 1000 kg frena en una pista plana y pasa de 10 m/s a 5 m/s. ¿Cuánta energía disiparon sus frenos?'],
      datos: [D5.balance, D5.ec],
      solucion: [{ texto: 'En una pista plana la altura no cambia, así que la energía mecánica es solo cinética, y lo que bajó es lo que disiparon los frenos:', ecuacion: ['½ · 1000 · 10² − ½ · 1000 · 5² = ', pr('37 500 J')] }],
      respuesta: ['Disiparon ', pr('37 500 J')] },
    { nivel: 2, titulo: 'La rampa áspera',
      figura: est(figDosRampas({ a: '', b: '', textos: [{ x: 8, y: 24, texto: '4 kg en la de 37°; μ_k = 0,3; abajo, v = ?', ancla: 'start', peso: 400 }] })),
      enunciado: ['Una caja de 4 kg baja desde el reposo por una rampa de 37° y 3 m de alto, con ', muk, ' = 0,3. ¿Con qué rapidez llega abajo?'],
      datos: [D5.balance, D5.wf, D5.rampa, D5.trig, D5.cin],
      solucion: [
        { texto: 'La rampa mide 3 ÷ sen 37° = 3 ÷ 0,6 = 5 m. En una rampa la normal es m · g · cos 37° = 40 · 0,8 = 32 N, y el rozamiento es 0,3 · 32 = 9,6 N, a lo largo de los 5 m:', ecuacion: [Wf, ' = −9,6 · 5 = −48 J'] },
        { texto: 'Arriba tenía 4 · 10 · 3 = 120 J; abajo llega como cinética lo que queda después del rozamiento:', ecuacion: ['½ · 4 · v² = 120 − 48 = 72;   v = ', neg('6 m/s')] },
      ],
      respuesta: ['v = ', neg('6 m/s')] },
    { nivel: 2, titulo: 'Del tobogán al piso áspero',
      figura: est({ alto: 236, piso: { y: PISO4, x0: 8, x1: 312 }, objetos: [{ tipo: 'tobogan', de: [44, PISO4 - 60], a: [130, PISO4] }, nino({ de: [44, PISO4 - 60], a: [130, PISO4] }, 0)],
        cotas: [{ de: [20, PISO4 - 60], a: [20, PISO4], texto: '1,8 m', lado: 1, sep: 0 }, { de: [146, PISO4], a: [300, PISO4], texto: 'μ_k = 0,3; d = ?', lado: 1, sep: 20 }],
        alt: 'Un niño baja por un tobogán liso de 1,8 m y sigue por un piso áspero.' }),
      enunciado: ['Un niño baja desde el reposo por un tobogán sin rozamiento de 1,8 m de alto y sigue por un piso horizontal con ', muk, ' = 0,3. ¿Qué distancia recorre en el piso hasta detenerse?'],
      datos: [D5.balance, D5.wf, D5.cin, D5.piso, D5.epg],
      solucion: [
        { texto: 'El tobogán no frena, así que el niño llega al piso con toda la energía de arriba, m · 10 · 1,8; el rozamiento del piso la quita entera:', ecuacion: ['m · 10 · 1,8 = 0,3 · m · 10 · d'] },
        { texto: 'La masa y g están en los dos lados y se cancelan:', ecuacion: ['d = ', frac('1,8', '0,3'), ' = ', neg('6 m')] },
      ],
      respuesta: ['d = ', neg('6 m')] },
    { nivel: 2, titulo: 'Subir por la rampa áspera',
      figura: est({ alto: 236, piso: { y: PISO5, x0: 8, x1: 312 }, objetos: [{ tipo: 'rampa', x0: 40, y0: PISO5, largo: 230, ang: 37 }, { tipo: 'caja', x: 70, y: PISO5 - 22, w: 30, h: 20, giro: 37, texto: '' }],
        flechas: [{ de: [92, 178], ang: 37, largo: 40, color: 'tinta' }], angulos: [{ c: [40, PISO5], de: 0, a: 37, r: 26, texto: '37°' }],
        textos: [{ x: 8, y: 24, texto: 'v₀ = 10 m/s, rampa arriba', ancla: 'start', peso: 400 }, { x: 8, y: 48, texto: 'μ_k = 0,5; ¿hasta qué altura?', ancla: 'start', peso: 400 }], alt: 'Un ladrillo lanzado a 10 m/s hacia arriba por una rampa áspera de 37°.' }),
      enunciado: ['Lanzas un ladrillo a 10 m/s hacia arriba por una rampa de 37° con ', muk, ' = 0,5. ¿Hasta qué altura sube?'],
      datos: [D5.balance, D5.wf, D5.rampa, D5.trig],
      solucion: [
        { texto: 'La masa no se da porque se cancela, así que se cuenta por cada kilo. Si el ladrillo sube una altura h, por la rampa desliza h ÷ sen 37° = h ÷ 0,6.' },
        { texto: 'Por kilo, la normal es 1 · 10 · cos 37° = 8 N, y el rozamiento le quita 0,5 · 8 · h ÷ 0,6 = 4 · h ÷ 0,6 de energía.' },
        { texto: 'La energía cinética del lanzamiento se reparte entre la potencial que gana al subir y el calor del rozamiento:', ecuacion: ['½ · 10² = 10 · h + ', frac('4 · h', '0,6'), ';   h = ', neg('3 m')] },
      ],
      respuesta: ['h = ', neg('3 m')] },
    { nivel: 2, titulo: 'Dos botes',
      figura: est(figBotes([5, null, null], { t: ['5 m', '1.er bote', '2.º: ?'], textos: [{ x: 312, y: 24, texto: 'pierde 20 % en cada bote', ancla: 'end', peso: 400 }], alt: 'Una pelota cae de 5 m y pierde el 20 % de su energía en cada bote.' })),
      enunciado: ['Una pelota se suelta desde 5 m y en cada bote pierde el 20 % de su energía. ¿Hasta qué altura sube después del segundo bote?'],
      datos: [D5.pierde, D5.epg],
      solucion: [
        { texto: 'En cada bote pierde el 20 % de la energía que traía en ese momento, así que le queda el 80 % de esa energía, y la altura baja en la misma fracción.' },
        { texto: 'Son dos botes, así que se multiplica dos veces por 0,8:', ecuacion: ['h = 5 · 0,8 · 0,8 = ', neg('3,2 m')] },
      ],
      respuesta: ['Sube ', neg('3,2 m')] },
    { nivel: 2, titulo: 'El trineo en la duna',
      figura: est({ alto: 200, piso: { y: 180, x0: 8, x1: 312 }, objetos: [{ tipo: 'rampa', x0: 40, y0: 180, largo: 200, ang: 30 }, { tipo: 'caja', x: 180, y: 112, w: 30, h: 16, giro: 30, texto: '' }],
        cotas: [{ de: [222, 80], a: [222, 180], texto: '5 m', lado: -1, sep: 0 }], textos: [{ x: 312, y: 24, texto: '20 kg; abajo, 8 m/s', ancla: 'end', peso: 400 }, { x: 312, y: 48, texto: 'W_f = ?', ancla: 'end' }],
        alt: 'Un trineo de 20 kg baja por una duna de 5 m de alto y llega abajo a 8 m/s.' }),
      enunciado: ['Un trineo de 20 kg baja desde el reposo por una duna de 5 m de alto y llega abajo a 8 m/s. ¿Cuánto trabajo hizo el rozamiento?'],
      datos: [D5.balance, D5.epg, D5.ec],
      solucion: [
        { texto: 'Arriba, quieto, el trineo tiene 20 · 10 · 5 = 1000 J de energía potencial. Abajo lleva ½ · 20 · 8² = 640 J de energía cinética.' },
        { texto: 'Lo que falta lo quitó el rozamiento, y su trabajo es negativo porque frena:', ecuacion: [Wf, ' = 640 − 1000 = ', pr('−360 J')] },
      ],
      respuesta: [Wf, ' = ', pr('−360 J')] },
    { nivel: 3, titulo: 'Pierde en cada tramo', fuente: 'Parecida a San Marcos 2024-II, pregunta 80.',
      figura: est(figBotes([10, null, null], { t: ['10 m', '', ''], textos: [{ x: 312, y: 24, texto: 'pierde 10 % en cada tramo', ancla: 'end', peso: 400 }, { x: 200, y: 120, texto: '¿tras el 2.º bote?', ancla: 'middle', peso: 400 }],
        alt: 'Una pelota que se suelta desde 10 m y pierde el 10 % de su energía en cada tramo, al bajar y al subir.' })),
      enunciado: ['Una pelota se suelta desde 10 m. Por el aire, pierde el 10 % de su energía en cada tramo: en cada bajada y en cada subida. ¿Hasta qué altura sube después del segundo bote?'],
      alternativas: ['6,56 m', '8,1 m', '8 m', '6 m', '7,29 m'],
      datos: [D5.pierde, D5.epg],
      solucion: [
        { texto: 'Desde que se suelta hasta que sube después del segundo bote hay cuatro tramos por el aire: bajar, subir, bajar y subir.' },
        { texto: 'En cada tramo le queda el 90 % de lo que traía, así que se multiplica cuatro veces por 0,9:', ecuacion: ['h = 10 · 0,9⁴ ≈ ', neg('6,56 m')] },
        { texto: [neg('B'), ' cuenta una sola pérdida por bote, cuando hay una en cada tramo; ', neg('C'), ' resta 1 m dos veces, como si el 10 % fuera siempre de los 10 m iniciales; ', neg('D'), ' resta 1 m en cada tramo; ', neg('E'), ' cuenta solo tres tramos.'] },
      ],
      respuesta: [neg('A'), ': ', neg('6,56 m')] },
    { nivel: 3, titulo: 'Dos tramos ásperos', fuente: 'Parecida a San Marcos 2021, pregunta 82.',
      figura: est({ alto: 200, piso: { y: 170, x0: 8, x1: 312 }, objetos: [{ tipo: 'caja', x: 40, y: 170, w: 34, h: 26, texto: '' }],
        flechas: [{ de: [58, 132], ang: 0, largo: 36, color: 'tinta', texto: 'v₀ = 10 m/s', rumbo: [1, -0.3] }], lineas: [{ de: [70, 150], a: [70, 190] }, { de: [180, 150], a: [180, 190] }, { de: [290, 150], a: [290, 190] }],
        textos: [{ x: 125, y: 196, texto: 'μ₁ = 0,4; 5 m', ancla: 'middle', peso: 400 }, { x: 235, y: 196, texto: 'μ₂ = ?; 5 m', ancla: 'middle', peso: 400 }],
        alt: 'Un bloque entra a 10 m/s a dos tramos ásperos de 5 m: el primero con μ = 0,4 y el segundo con μ desconocido.' }),
      enunciado: ['Un bloque entra a 10 m/s a dos tramos ásperos seguidos de 5 m cada uno. En el primero, ', muk, ' = 0,4. ¿Qué ', muk, ' debe tener el segundo para que se detenga justo al final?'],
      alternativas: ['1', '0,4', '0,6', '1,6', '0,2'],
      datos: [D5.balance, D5.wf, D5.cin, D5.piso, D5.ec],
      solucion: [
        { texto: 'Se cuenta por kilo, porque la masa se cancela: entra con ½ · 10² = 50 J, y el primer tramo le quita 0,4 · 10 · 5 = 20 J.' },
        { texto: 'Para que se detenga justo al final, el segundo tramo debe quitarle los 30 J que quedan:', ecuacion: ['μ₂ · 10 · 5 = 30;   μ₂ = ', neg('0,6')] },
        { texto: [neg('A'), ' olvida lo que quitó el primer tramo; ', neg('B'), ' supone que los dos tramos son iguales, pero el primero no basta para detenerlo; ', neg('D'), ' olvida el ½ de la energía cinética; ', neg('E'), ' le aplica el 0,4 a los 10 m, y no solo al primer tramo.'] },
      ],
      respuesta: [neg('C'), ': μ₂ = ', neg('0,6')] },
    { nivel: 3, titulo: 'El rozamiento por la rapidez',
      figura: est(figDosRampas({ a: 'llega a 6 m/s', b: '', textos: [{ x: 8, y: 24, texto: 'en la de 37°: μ_k = ?', ancla: 'start', peso: 400 }] })),
      enunciado: ['Una caja baja desde el reposo por una rampa de 37° y 3 m de alto, y llega abajo a 6 m/s. ¿Cuánto vale el coeficiente de rozamiento cinético?'],
      alternativas: ['0,5', '0,24', '0,6', '0,3', '0,8'],
      datos: [D5.balance, D5.wf, D5.rampa, D5.trig],
      solucion: [
        { texto: 'La masa no se da porque se cancela, así que se cuenta por cada kilo. Arriba hay 1 · 10 · 3 = 30 J y abajo, ½ · 1 · 6² = 18 J, así que el rozamiento quitó 12 J.' },
        { texto: 'La caja desliza 3 ÷ 0,6 = 5 m por la rampa, con una normal de 1 · 10 · cos 37° = 8 N por kilo; el rozamiento por ese largo da los 12 J:', ecuacion: [muk, ' · 8 · 5 = 12;   ', muk, ' = ', neg('0,3')] },
        { texto: [neg('A'), ' multiplica por la altura en vez del largo que desliza; ', neg('B'), ' usa la normal igual al peso, como en un piso plano; ', neg('C'), ' da la fracción de energía que llega, 18 de 30, que no es un coeficiente; ', neg('E'), ' toma el largo como si fuera la altura.'] },
      ],
      respuesta: [neg('D'), ': ', muk, ' = ', neg('0,3')] },
    { nivel: 3, titulo: 'La rampa y después el piso',
      figura: est({ alto: 236, piso: { y: PISO5, x0: 8, x1: 312 }, objetos: [{ tipo: 'rampa', x0: 10, y0: PISO5, largo: 150, ang: 37 }, { tipo: 'caja', x: 116, y: 128, w: 28, h: 18, giro: 37, texto: '' }],
        cotas: [{ de: [130, PISO5 - 90], a: [130, PISO5], texto: '3 m', lado: -1, sep: 4 }], textos: [{ x: 312, y: 24, texto: 'μ_k = 0,25 en la rampa y en el piso', ancla: 'end', peso: 400 }, { x: 230, y: 200, texto: 'd = ?', ancla: 'middle', peso: 400 }],
        alt: 'Un bloque baja por una rampa áspera de 37° y 3 m de alto y sigue por un piso áspero.' }),
      enunciado: ['Un bloque baja desde el reposo por una rampa de 37° y 3 m de alto y sigue por el piso. La rampa y el piso tienen ', muk, ' = 0,25. ¿Qué distancia recorre en el piso hasta detenerse?'],
      alternativas: ['12 m', '9 m', '7 m', '80 m', '8 m'],
      datos: [D5.balance, D5.wf, D5.rampa, D5.trig, D5.piso],
      solucion: [
        { texto: 'La masa se cancela, así que se cuenta por cada kilo. Arriba, el bloque tiene 1 · 10 · 3 = 30 J.' },
        { texto: 'En la rampa la normal es 1 · 10 · cos 37° = 8 N, y en sus 3 ÷ 0,6 = 5 m el rozamiento quita 0,25 · 8 · 5 = 10 J.' },
        { texto: 'En el piso la normal es el peso, 10 N por kilo, así que el rozamiento quita 0,25 · 10 = 2,5 J por metro; los 20 J que quedan se acaban en:', ecuacion: ['d = ', frac('20', '0,25 · 10'), ' = ', neg('8 m')] },
        { texto: [neg('A'), ' olvida el rozamiento de la rampa; ', neg('B'), ' usa el seno para la normal de la rampa, y la normal va con el coseno; ', neg('C'), ' usa la normal igual al peso también en la rampa; ', neg('D'), ' olvida g en el rozamiento del piso.'] },
      ],
      respuesta: [neg('E'), ': ', neg('8 m')] },
    { nivel: 3, titulo: 'Cuánto sube por la rampa',
      figura: est({ alto: 236, piso: { y: PISO5, x0: 8, x1: 312 }, objetos: [{ tipo: 'rampa', x0: 40, y0: PISO5, largo: 230, ang: 37 }, { tipo: 'caja', x: 70, y: PISO5 - 22, w: 30, h: 20, giro: 37, texto: '' }],
        flechas: [{ de: [92, 178], ang: 37, largo: 40, color: 'tinta' }], angulos: [{ c: [40, PISO5], de: 0, a: 37, r: 26, texto: '37°' }],
        textos: [{ x: 8, y: 24, texto: 'v₀ = 8 m/s, rampa arriba', ancla: 'start', peso: 400 }, { x: 8, y: 48, texto: 'μ_k = 0,5; L = ?', ancla: 'start', peso: 400 }], alt: 'Una caja lanzada a 8 m/s hacia arriba por una rampa de 37° con rozamiento.' }),
      enunciado: ['Lanzas una caja a 8 m/s hacia arriba por una rampa de 37° con ', muk, ' = 0,5. ¿Qué distancia recorre por la rampa antes de detenerse?'],
      alternativas: ['5,33 m', '3,2 m', '8 m', '1,92 m', '6,4 m'],
      datos: [D5.balance, D5.wf, D5.rampa, D5.trig],
      solucion: [
        { texto: 'La masa se cancela, así que se cuenta por cada kilo. Si la caja recorre L por la rampa, sube una altura de L · sen 37° = 0,6 · L.' },
        { texto: 'Por kilo, la normal es 1 · 10 · cos 37° = 8 N, y el rozamiento le quita 0,5 · 8 · L = 4 · L de energía.' },
        { texto: 'La energía cinética del lanzamiento se reparte entre la potencial que gana y el calor del rozamiento:', ecuacion: ['½ · 8² = 10 · 0,6 · L + 4 · L;   L = ', neg('3,2 m')] },
        { texto: [neg('A'), ' olvida el rozamiento y supone que toda la energía se vuelve altura; ', neg('C'), ' olvida el peso y supone que todo se lo lleva el rozamiento; ', neg('D'), ' da la altura que sube, no lo que recorre; ', neg('E'), ' olvida el ½ de la energía cinética.'] },
      ],
      respuesta: [neg('B'), ': ', neg('3,2 m')] },
  ];

  const COSAS5_AT = [{ n: 'Un bloque', m: [2, 4, 5] }, { n: 'Un niño', m: [25, 30, 40] }, { n: 'Una caja', m: [3, 6, 10] }];
  const rozamiento = {
    id: 'energia-y-rozamiento',
    titulo: 'Energía con rozamiento',
    pregunta: '¿Adónde va la energía que se lleva el rozamiento?',
    temas: ['Conservación de la energía mecánica'],
    pieza: 'fis-estatica',
    aprendizaje: 'Con rozamiento, la energía mecánica baja lo que vale el trabajo del rozamiento, que se vuelve calor y sí depende del camino recorrido.',
    actividad: 'Soltar una caja por una rampa de tablones, más o menos alta y áspera.',
    lee: {
      tarjetas: [
        { titulo: 'El rozamiento calienta', texto: 'Si frotas tus manos rápido, se calientan. Con todo lo que desliza pasa lo mismo: el rozamiento convierte parte de la energía de movimiento en calor, y ese calor ya no vuelve a ser rapidez.',
          dibujo: est(figRampa5({ h: 4, mu: 0.3, u: 0, alt: 'Una caja arriba de una rampa de tablones en el almacén.' })) },
        { titulo: 'Una fuerza que no devuelve', texto: 'El peso le quita energía cinética al cuerpo cuando sube y se la devuelve cuando baja, por eso se dice que es una fuerza conservativa. El rozamiento no devuelve nada, ni de ida ni de vuelta: es una fuerza no conservativa, y la energía que se lleva se llama energía disipada.' },
        { titulo: 'Qué mirar al jugar', texto: 'Elige la altura y qué tan ásperos son los tablones. Dale ▶ y mira la columna de energía: cuánto tenía la caja arriba, cuánto llega abajo como movimiento y cuánto se vuelve calor en el camino.' },
      ],
    },
    ejemplos: EJEMPLOS_ROCE,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'Sueltas una caja de 2 kg desde lo alto de una rampa de tablones de 37°. Elige la altura y qué tan ásperos son.',
      mision: {
        texto: 'Haz que el rozamiento convierta justo 40 J en calor.',
        // Una sola manera en la grilla: 5 m con μk = 0,3 (100 J arriba; 40 J de calor).
        logrado: val => Math.abs(energia5(val.h, val.mu, 1).Qt - 40) < 1e-9,
        bien: 'Se vuelven 40 J de calor: de 100 J arriba, abajo llegan 60 J.',
      },
      voz: 'Mientras baja, ¿cambia el alto de la columna? ¿Y qué parte crece?',
      leyenda: [
        { s: EPG, t: 'energía de la altura' },
        { s: EC, t: 'energía del movimiento' },
        { s: 'calor', t: 'lo que el rozamiento se llevó' },
        { s: muk, t: 'qué tan ásperos son los tablones' },
        { s: 'θ', t: 'ángulo de la rampa: 37°' },
        { s: 'h', t: 'altura de la rampa' },
      ],
      controles: [
        { id: 'h', etiqueta: 'Altura, h', min: 2, max: 5, paso: 1, inicio: 3, unidad: 'm', decimales: 0 },
        { id: 'mu', etiqueta: 'Tablones, μk', opciones: [{ valor: 0, texto: '0' }, { valor: 0.15, texto: '0,15' }, { valor: 0.3, texto: '0,3' }, { valor: 0.45, texto: '0,45' }], inicio: 0.15 },
        { id: 'u', etiqueta: 'Parte del camino (0 arriba, 1 abajo)', min: 0, max: 1, paso: 0.25, inicio: 0, unidad: '', decimales: 2, auto: { velocidad: 0.25, modo: 'repite' } },
      ],
      dibujo: juego5,
      // La lectura enuncia la relación: lo de arriba se reparte entre la energía cinética y el calor.
      lectura: val => { const e = energia5(val.h, val.mu, 1); return [`Arriba ${J_(e.E)}; abajo, `, EC, ` = ${J_(e.E - e.Qt)} y calor ${J_(e.Qt)}`]; },
      resumen: { h: 3, mu: 0.15, u: 0.5 },
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora hay dos rampas de 3 m de alto con los mismos tablones ásperos: una de 37° y otra de 53°. ¿En cuál llega más rápida la caja abajo?',
      datos: ['Las dos rampas tienen 3 m de alto.', 'Los tablones son los mismos en las dos: el mismo coeficiente de rozamiento.', 'La caja parte del reposo arriba.'],
      opciones: [
        { id: 'c', texto: 'En la de 53°, la más empinada', correcta: true },
        { id: 'igual', texto: 'Igual en las dos: tienen la misma altura', error: 'CE-ROCE', siFuera: 'Así sería sin rozamiento, porque el peso trabaja igual en las dos rampas. Pero el rozamiento frena en cada metro que la caja desliza, y las dos rampas no tienen el mismo largo.' },
        { id: 'larga', texto: 'En la de 37°: tiene más camino para acelerar', error: 'W1', siFuera: 'La de 37° tiene más camino, pero el peso gana la misma energía en las dos, porque bajan lo mismo. Ese camino de más solo agrega metros en los que el rozamiento frena.' },
        { id: 'normal', texto: 'En la de 37°: la rampa la empuja más', error: 'RZ-NORMAL', siFuera: 'Es cierto que la rampa de 37° empuja más a la caja, pero la normal no la hace avanzar: va de lado al camino. Una normal mayor solo da más rozamiento, y eso frena.' },
      ],
      dibujo: est(PRED5),
      revelar: est(REVELA5),
      coincide: 'Coincide: en la empinada la caja desliza menos metros y con menos normal, así que el rozamiento le quita menos energía y llega más rápida.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: MIRA5,
      pasos: [
        { estado: { corte: 0 }, texto: 'En la de 37° desliza 5 m, y su normal es el peso por cos 37° = 0,8 (convención del examen).', ecuacion: [fk, ' = 0,3 · 16 = 4,8 N;   ', Wf, ' = −4,8 · 5 = −24 J'] },
        { estado: { corte: 1 }, texto: 'En la de 53° desliza solo 3,75 m, con menos normal (cos 53° = 0,6), así que el rozamiento quita menos.', ecuacion: [fk, ' = 0,3 · 12 = 3,6 N;   ', Wf, ' = −3,6 · 3,75 = −13,5 J'] },
        { estado: { corte: 2 }, texto: 'Arriba la caja tiene 60 J en las dos rampas, y abajo llega como movimiento lo que el rozamiento dejó.', ecuacion: ['60 − 24 = 36 J;   60 − 13,5 = 46,5 J'] },
        { estado: { corte: 3 }, texto: 'El peso trabaja lo mismo en las dos, porque solo mira la altura; el rozamiento, en cambio, depende del camino.', ecuacion: [Wpeso, ' = 20 · 3 = 60 J en las dos'] },
      ],
    },
    regla: {
      texto: 'Con rozamiento, la energía mecánica baja: al final queda la del comienzo más el trabajo del rozamiento, que es negativo porque frena. Lo que falta no desaparece: se vuelve calor. Como el rozamiento frena en cada metro, su trabajo depende de cuánto camino desliza el cuerpo, y no solo de la altura.',
      ecuacion: [EM, ' al final = ', EM, ' al inicio + ', Wf, '   ;   ', Wf, ' = −', fk, ' · d'],
      condicion: 'el rozamiento vale el coeficiente por la normal y d es lo que desliza. Si además empuja una mano o un motor, su trabajo también se suma.',
      voz: 'La energía no desaparece: lo que falta abajo está en el calor.',
      dibujo: est(REVELA5),
    },
    // Así se resuelve: la rapidez al pie de una rampa áspera de 53° (semillas pares) o los botes (impares), con otros
    // números que «Ahora tú» (que usa la rampa de 37°).
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 1) {
          const H = r.de([3, 6, 12]), p = r.de([20, 30, 40]), n = r.de([1, 2]), hh = H * (1 - p / 100) ** n;
          return {
            enunciado: [`Una pelota se suelta desde ${H} m y en cada bote pierde el ${p} % de su energía. ¿Hasta qué altura sube después del ${n === 1 ? 'primer' : 'segundo'} bote?`],
            datos: [D5.pierde, D5.epg],
            dibujo: est(figBotes([H, ...Array(n).fill(null)], { t: [`${H} m`], textos: [{ x: 312, y: 24, texto: `pierde ${p} % en cada bote`, ancla: 'end', peso: 400 }] })),
            pasos: [
              { tipo: 'pide', texto: `Piden hasta qué altura sube la pelota después del ${n === 1 ? 'primer' : 'segundo'} bote.` },
              { tipo: 'datos', texto: `Cae de ${H} m. En cada bote pierde el ${p} % de la energía que trae, así que le queda el ${100 - p} %.` },
              { tipo: 'regla', texto: 'En lo más alto toda su energía es potencial, y la potencial va con la altura: la altura baja en la misma fracción que la energía.', ecuacion: [EPG, ' = ', ...MG, ' · h'] },
              { tipo: 'cuentas', texto: n === 1 ? 'Hay un solo bote, así que la altura se multiplica una vez por lo que queda:' : 'Hay dos botes, así que la altura se multiplica dos veces por lo que queda:', ecuacion: [`h = ${H}${` · ${f(1 - p / 100)}`.repeat(n)} = `, neg(M_(hh))] },
              { tipo: 'sentido', texto: `Sube menos que los ${H} m del comienzo porque la energía que falta se volvió calor y sonido en el bote.` },
            ],
            respuesta: ['Sube ', neg(M_(hh))],
          };
        }
        const c = elegir(() => { const m = r.de([2, 4, 5]), hh = r.de([2, 8]), mu = r.de([0.5, 0.8]), v2 = 2 * G * hh * (1 - mu * 0.75), v = Math.sqrt(v2);
          return exacto(v) && { m, hh, mu, v, L: hh / 0.8, Nn: m * G * 0.6, Wr: -mu * m * G * 0.6 * hh / 0.8 }; });
        return {
          enunciado: [`Una caja de ${c.m} kg baja desde el reposo por una rampa de 53° y ${f(c.hh)} m de alto, con `, muk, ` = ${f(c.mu)}. ¿Con qué rapidez llega abajo?`],
          datos: [D5.balance, D5.wf, D5.rampa, D5.trig, D5.cin],
          pasos: [
            { tipo: 'pide', texto: 'Piden la rapidez con que la caja llega al pie de la rampa áspera.' },
            { tipo: 'datos', texto: [`Masa: ${c.m} kg. Altura: ${f(c.hh)} m. Rampa de 53°. `, muk, ` = ${f(c.mu)}.`] },
            { tipo: 'regla', texto: 'La energía de arriba, menos lo que quita el rozamiento a lo largo de la rampa, es la cinética de abajo. Para el rozamiento hacen falta el largo de la rampa y la normal.', ecuacion: [EM, ' al final = ', EM, ' al inicio + ', Wf] },
            { tipo: 'cuentas', texto: [`El largo es la altura entre sen 53°: ${f(c.hh)} ÷ 0,8 = ${M_(c.L)}. La normal es el peso por cos 53°: ${c.m * G} · 0,6 = ${N_(c.Nn)}. Entonces `, Wf, ` = −${f(c.mu)} · ${f(c.Nn)} · ${f(c.L)} = ${J_(c.Wr)}.`], ecuacion: [`½ · ${c.m} · v² = ${f(c.m * G * c.hh)} − ${f(-c.Wr)};   v = `, neg(MS(c.v))] },
            { tipo: 'sentido', texto: `Sin rozamiento habría llegado a ${f(Math.sqrt(2 * G * c.hh))} m/s, más rápido, porque nada se habría vuelto calor en el camino.` },
          ],
          respuesta: ['v = ', neg(MS(c.v))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4;
        if (k === 0) {
          const c = elegir(() => { const ob = r.de(COSAS5_AT), m = r.de(ob.m), hh = r.de([1.5, 2, 3, 4, 5]), E = m * G * hh, Q = Math.round(E * r.de([0.1, 0.2, 0.3, 0.4, 0.5]));
            return Q > 0 && Q < E && distintos(E - Q, E, E + Q, Q) && !(m === 2 && hh === 4 && Q === 30) && { ob, m, hh, E, Q }; });
          return {
            pregunta: [`${c.ob.n} de ${c.m} kg baja desde ${f(c.hh)} m de alto, partiendo del reposo, y el rozamiento convierte ${c.Q} J en calor. ¿Con qué energía cinética llega abajo?`],
            datos: [D5.balance, D.calor, D5.epg],
            opciones: opciones(c.E - c.Q, [
              { id: 'sin-roce', valor: c.E, error: 'CE-ROCE', siFuera: 'La energía de arriba está bien, pero así llegaría si no hubiera rozamiento. Aquí una parte de esa energía se volvió calor en el camino y no llega como movimiento.' },
              { id: 'suma', valor: c.E + c.Q, error: 'W14', siFuera: 'Sumaste el calor a la energía de arriba, pero el calor no es energía extra: sale de la misma energía que tenía arriba. Por eso se resta.' },
              { id: 'calor', valor: c.Q, error: 'RZ-CALOR', siFuera: 'Esa es la parte que se volvió calor. La que llega como movimiento es lo que queda de la energía de arriba después de restarle ese calor.' },
            ], J_),
            solucion: { texto: `Arriba hay ${c.m} · 10 · ${f(c.hh)} = ${J_(c.E)} de energía potencial, y abajo llega como cinética lo que el rozamiento no se llevó:`, ecuacion: [EC, ` = ${f(c.E)} − ${c.Q} = `, neg(J_(c.E - c.Q))] },
          };
        }
        if (k === 1) {
          const c = elegir(() => { const hh = r.de([1.25, 1.8, 2.5, 3.2, 4.5, 5, 7.2]), mu = r.de([0.15, 0.3, 0.45]), v = Math.sqrt(2 * G * hh * (1 - mu * 4 / 3));
            return exacto(v) && !(hh === 3 && mu === 0.3) && distintos(v, Math.sqrt(2 * G * hh), Math.sqrt(2 * G * hh - 2 * mu * G * hh / 0.6), 2 * G * hh * (1 - mu * 4 / 3)) && { hh, mu, v }; });
          return {
            pregunta: ['Una caja baja desde el reposo por una rampa de 37° y ', `${f(c.hh)} m de alto, con `, muk, ` = ${f(c.mu)}. ¿Con qué rapidez llega abajo?`],
            datos: [D5.balance, D5.wf, D5.rampa, D5.trig, D5.cin],
            opciones: opciones(c.v, [
              { id: 'sin-roce', valor: Math.sqrt(2 * G * c.hh), error: 'CE-ROCE', siFuera: 'La energía de arriba está bien, pero así sería sin rozamiento. Aquí la rampa áspera le quita una parte en el camino, y llega más lenta.' },
              { id: 'nmg', valor: Math.sqrt(2 * G * c.hh - 2 * c.mu * G * c.hh / 0.6), error: 'RZ-NMG', siFuera: 'Restar el rozamiento está bien, pero tomaste la normal igual al peso. En una rampa, el peso se reparte y la normal es solo m · g · cos 37°.' },
              { id: 'sin-raiz', valor: 2 * G * c.hh * (1 - c.mu * 4 / 3), error: 'CE-SIN-RAIZ', siFuera: 'El balance de energía está bien, pero ese número es v², la rapidez al cuadrado. Falta sacar la raíz.' },
            ], MS),
            solucion: { texto: `Por kilo, arriba hay ${f(G * c.hh)} J; la normal es 8 N y la rampa mide ${f(c.hh / 0.6)} m, así que el rozamiento quita ${f(c.mu)} · 8 · ${f(c.hh / 0.6)} = ${f(c.mu * 8 * c.hh / 0.6)} J.`, ecuacion: [`½ · v² = ${f(G * c.hh * (1 - c.mu * 4 / 3))};   v = `, neg(MS(c.v))] },
          };
        }
        if (k === 2) {
          const c = elegir(() => { const H = r.de([2, 4, 5, 8, 10]), p = r.de([10, 20, 25, 50]), n = r.de([1, 2, 3]), q = 1 - p / 100, hh = H * q ** n;
            const malas = [H * (1 - n * p / 100), n >= 2 ? H * q : H * p / 100, H * q ** (2 * n)];
            return exacto(hh) && malas[0] > 0 && !(H === 5 && p === 20 && n === 2) && !(H === 2 && p === 25) && distintos(hh, ...malas) && { H, p, n, hh, malas }; });
          const cual = ['primer', 'segundo', 'tercer'][c.n - 1];
          return {
            pregunta: [`Una pelota se suelta desde ${c.H} m y en cada bote pierde el ${c.p} % de su energía. ¿Hasta qué altura sube después del ${cual} bote?`],
            datos: [D5.pierde, D5.epg],
            opciones: opciones(c.hh, [
              { id: 'lineal', valor: c.malas[0], error: 'RZ-LINEAL', siFuera: `La pérdida de cada bote está bien, pero cada ${c.p} % se calcula sobre lo que traía en ese bote, no sobre la altura del comienzo. Por eso se multiplica, no se resta.` },
              { id: 'uno', valor: c.malas[1], error: c.n >= 2 ? 'RZ-UNO' : 'RZ-PIERDE', siFuera: c.n >= 2 ? 'Un bote está bien calculado, pero hay más de uno, y en cada bote se vuelve a perder la misma fracción.' : 'Esa es la parte de la altura que pierde, no la que le queda después del bote.' },
              { id: 'tramo', valor: c.malas[2], error: 'RZ-TRAMO', siFuera: 'Multiplicar por lo que queda está bien, pero la pelota pierde energía en cada bote, no en cada bajada y en cada subida. Contaste el doble de pérdidas.' },
            ], M_),
            solucion: { texto: `En cada bote le queda el ${100 - c.p} % de la energía, y la altura baja en la misma fracción; se multiplica ${c.n === 1 ? 'una vez' : `${c.n} veces`}:`, ecuacion: [`h = ${c.H}${` · ${f(1 - c.p / 100)}`.repeat(c.n)} = `, neg(M_(c.hh))] },
          };
        }
        // Nivel examen: dos tramos ásperos (San Marcos 2021) o lo que sube por una rampa áspera.
        if (sm % 8 < 4) {
          const c = elegir(() => { const v0 = r.de([6, 8, 10, 12]), d1 = r.de([2, 4, 5]), d2 = r.de([2, 4, 5]), mu1 = r.de([0.2, 0.25, 0.4]), mu2 = (v0 * v0 / (2 * G) - mu1 * d1) / d2;
            return mu2 > 0.05 && mu2 < 1 && exacto(mu2) && !(v0 === 10 && d1 === 5 && d2 === 5 && mu1 === 0.4) && distintos(mu2, v0 * v0 / (2 * G * d2), (v0 * v0 / G - mu1 * d1) / d2, (v0 * v0 / (2 * G) - mu1 * (d1 + d2)) / d2) && { v0, d1, d2, mu1, mu2 }; });
          return {
            pregunta: [`Un bloque entra a ${c.v0} m/s a dos tramos ásperos seguidos: el primero de ${c.d1} m, con `, muk, ` = ${f(c.mu1)}, y el segundo de ${c.d2} m. ¿Qué `, muk, ' debe tener el segundo para que se detenga justo al final?'],
            datos: [D5.balance, D5.wf, D5.cin, D5.piso, D5.ec],
            opciones: opciones(c.mu2, [
              { id: 'olvida', valor: c.v0 * c.v0 / (2 * G * c.d2), error: 'RZ-UN-TRAMO', siFuera: 'El balance del segundo tramo está bien, pero el bloque no entra a él con toda su energía: el primer tramo ya le quitó una parte.' },
              { id: 'sin-medio', valor: (c.v0 * c.v0 / G - c.mu1 * c.d1) / c.d2, error: 'TE-SIN-MEDIO', siFuera: 'Los dos tramos están bien, pero la energía cinética es ½ · m · v², y ese ½ faltó.' },
              { id: 'todo', valor: (c.v0 * c.v0 / (2 * G) - c.mu1 * (c.d1 + c.d2)) / c.d2, error: 'RZ-TODO', siFuera: 'Restar el primer tramo está bien, pero le aplicaste su coeficiente también a los metros del segundo. Cada coeficiente vale solo en su propio tramo.' },
            ], v => f(v)),
            solucion: { texto: `Por kilo, entra con ${f(c.v0 * c.v0 / 2)} J y el primer tramo le quita ${f(c.mu1 * G * c.d1)} J; el segundo debe quitarle lo que queda.`, ecuacion: [muk, ` · 10 · ${c.d2} = ${f(c.v0 * c.v0 / 2 - c.mu1 * G * c.d1)};   `, muk, ' = ', neg(f(c.mu2))] },
          };
        }
        const c = elegir(() => { const v0 = r.de([4, 6, 8, 10, 12]), mu = r.de([0.15, 0.3, 0.6, 0.75]), hh = v0 * v0 / (2 * G * (1 + mu * 4 / 3));
          return exacto(hh) && !(v0 === 10 && mu === 0.5) && distintos(hh, v0 * v0 / (2 * G), hh / 0.6, v0 * v0 / (G * (1 + mu * 4 / 3))) && { v0, mu, hh }; });
        return {
          pregunta: [`Lanzas una caja a ${c.v0} m/s hacia arriba por una rampa de 37° con `, muk, ` = ${f(c.mu)}. ¿Hasta qué altura sube?`],
          datos: [D5.balance, D5.wf, D5.rampa, D5.trig],
          opciones: opciones(c.hh, [
            { id: 'sin-roce', valor: c.v0 * c.v0 / (2 * G), error: 'CE-ROCE', siFuera: 'La energía del lanzamiento está bien, pero así subiría si no hubiera rozamiento. Aquí parte de esa energía se vuelve calor mientras sube, y llega menos alto.' },
            { id: 'largo', valor: c.hh / 0.6, error: 'RZ-LARGO', siFuera: 'El balance está bien, pero ese número es lo que recorre por la rampa. La altura es menor: es lo recorrido por sen 37°.' },
            { id: 'sin-medio', valor: c.v0 * c.v0 / (G * (1 + c.mu * 4 / 3)), error: 'TE-SIN-MEDIO', siFuera: 'Sumar lo que gana en altura y lo que quita el rozamiento está bien, pero la energía cinética del lanzamiento lleva el ½, y faltó.' },
          ], M_),
          solucion: { texto: `Si sube h, desliza h ÷ 0,6; por kilo, la cinética del lanzamiento se reparte entre altura y calor: ½ · ${c.v0}² = 10 · h + ${f(c.mu)} · 8 · h ÷ 0,6.`, ecuacion: ['h = ', neg(M_(c.hh))] },
        };
      },
    },
  };

  // ======================= 6: potencia y eficiencia (el montacargas de la obra) =======================
  // Cambia: el tiempo que tarda en subir · Permanece: la carga de 50 kg y los 10 m (5000 J) · Progresa: los joules de cada
  // segundo · Se reserva: el motor que pierde una parte (Predice) · Debe verse: P = W/t = F · v; η = P_útil/P_consumida.
  const PISO6 = 224, PX6 = 12;
  function figMontacargas(o = {}) {
    const u = o.u || 0, yb = PISO6 - PX6 * 10 * u, fl = [];
    if (o.v) fl.push({ de: [158, yb - 6], ang: 90, largo: 30, color: 'tinta', texto: o.v, rumbo: [1, 0] });
    if (o.F) fl.push({ de: [130, yb - 34], ang: 90, largo: 30, color: 'o', texto: o.F, rumbo: [1, -0.3] });
    return { alto: 244, piso: { y: PISO6, x0: 8, x1: o.barras ? 176 : 312 },
      objetos: [{ tipo: 'viga', x0: 76, x1: 160, y: 28 }, { tipo: 'polea', c: [118, 42], r: 12 }, { tipo: 'motor', x: 36, y: PISO6, w: 46, h: 30 },
        { tipo: 'cuerda', de: [22, PISO6 - 15], a: [106, 42] }, { tipo: 'cuerda', de: [130, 42], a: [130, yb - 30] }, { tipo: 'caja', x: 130, y: yb, w: 44, h: 30, texto: o.texto !== undefined ? o.texto : '50 kg' },
        ...(o.barras ? o.barras.objetos : [])],
      flechas: fl, textos: [...(o.textos || []), ...(o.barras ? o.barras.textos : [])],
      cotas: o.cota === false ? [] : [{ de: [178, PISO6 - PX6 * 10], a: [178, PISO6], texto: '10 m', lado: -1, sep: 0 }], alt: o.alt };
  }
  const juego6 = val => { const u = uVista(val.u), P = 5000 / val.t, v = 10 / val.t;
    return est(figMontacargas({ u, v: `v = ${MS(v)}`, textos: [{ x: 312, y: 24, texto: `P = ${W_(P)}`, ancla: 'end' }, { x: 312, y: 48, texto: 'W = 5000 J', ancla: 'end', color: 'o' }],
      alt: `El montacargas sube 50 kg a 10 m en ${val.t} s: 5000 J de trabajo, ${f(P)} W.` })); };
  // Las barras del motor, en watts: lo que consume (tinta), lo útil (naranja) y lo que se vuelve calor (turquesa).
  const barrasMotor = (cons, util, calor, k = 0.16) => barras([{ n: 'consume', v: cons || 0, c: 'tinta', t: cons ? W_(cons) : '?' }, { n: 'útil', v: util, c: 'o', t: W_(util) },
    { n: 'calor', v: calor || 0, c: 'i', t: calor ? W_(calor) : '?' }], { x0: 196, dx: 48, y: PISO6, k, w: 22 });
  const PRED6 = figMontacargas({ u: 0.5, cota: false, barras: barrasMotor(0, 500, 0), alt: 'Un motor que entrega 500 W a la carga; lo que consume y lo que se vuelve calor, con signos de pregunta.' });
  const REVELA6 = figMontacargas({ u: 0.5, cota: false, barras: barrasMotor(625, 500, 125), alt: 'El motor consume 625 W: entrega 500 W a la carga y 125 W se vuelven calor.' });
  const MIRA6 = { alto: 240, piso: { y: PISO6, x0: 8, x1: 230 }, objetos: [], cortes: [
    figMontacargas({ u: 0.5, cota: false, barras: barras([{ n: 'útil', v: 500, c: 'o', t: W_(500) }], { x0: 244, y: PISO6, k: 0.16, w: 22 }) }),
    figMontacargas({ u: 0.5, cota: false, barras: barras([{ n: 'consume', v: 625, c: 'tinta', t: W_(625) }, { n: 'útil', v: 500, c: 'o', t: W_(500) }], { x0: 196, dx: 48, y: PISO6, k: 0.16, w: 22 }) }),
    figMontacargas({ u: 0.5, cota: false, barras: barrasMotor(625, 500, 125) }),
    figMontacargas({ u: 0.5, F: 'F = 500 N', v: 'v = 1 m/s', textos: [{ x: 312, y: 24, texto: 'P = 500 W', ancla: 'end' }] }),
  ], alt: 'Un motor entrega 500 W a la carga, el 80 % de lo que consume: consume 625 W y 125 W se vuelven calor. A 1 m/s, el cable jala 500 N.' };

  const D6 = {
    potencia: ['Potencia: P = W / t (1 W = 1 J/s)'],
    fv: ['A rapidez constante: P = ', F, ' · v, con ', F, ' en la dirección de v'],
    efic: ['Eficiencia: η = ', Putil, ' / ', Pcons, '; un porcentaje se divide entre 100'],
    peso: D.peso, constante: D.constante, trig: D.trig, rampa: D5.rampa, cin: D.cin,
    kmh: '1 m/s = 3,6 km/h',
    min: '1 min = 60 s; 1 h = 3600 s',
    agua: '1 L de agua tiene unos 1 kg',
    trabajo: ['Trabajo para subir algo a rapidez constante: ', W, ' = ', ...MG, ' · h'],
  };

  // Ejemplos resueltos de la idea 6. Cuentas rehechas aparte (scratchpad e8-fisica/cuentas.js: la potencia como trabajo
  // entre tiempo y como fuerza por rapidez, con cada conversión de unidades por separado): 10·3600; 200·10·6/12; 400·2;
  // 1500/2000; 300/0,5; 60·10·9/18; 1500·20; 600·10·10/120; 150·10·15/750; 1200·0,25; 50 000/(20 000·(0,6 + 0,5·0,8))
  // y cada alternativa; 30·10·20/60/0,8 y cada alternativa; 0,6·50 000/15 y cada alternativa; (300 + 100)·2 y cada
  // alternativa; V V F.
  const EJEMPLOS_POTENCIA = [
    { nivel: 1, titulo: 'El foco de la sala',
      figura: est({ alto: 170, techo: { y: 20, x0: 100, x1: 220 }, objetos: [{ tipo: 'cuerda', de: [160, 20], a: [160, 70] }, { tipo: 'pelota', x: 160, y: 82, r: 12 }],
        textos: [{ x: 196, y: 88, texto: '10 W', ancla: 'start' }, { x: 160, y: 140, texto: 'prendido 1 h: W = ?', ancla: 'middle', peso: 400 }], alt: 'Un foco de 10 W prendido una hora.' }),
      enunciado: ['Un foco LED de 10 W está prendido 1 hora. ¿Cuánta energía consume en ese tiempo?'],
      datos: [D6.potencia, D6.min],
      solucion: [{ texto: 'Un watt es un joule en cada segundo, así que de P = W / t la energía es la potencia por el tiempo, con el tiempo en segundos: 1 hora son 3600 s.', ecuacion: [W, ' = 10 · 3600 = ', neg('36 000 J')] }],
      respuesta: [W, ' = ', neg('36 000 J')] },
    { nivel: 1, titulo: 'La grúa de la obra',
      figura: est(figMontacargas({ u: 0, cota: false, texto: '200 kg', textos: [{ x: 312, y: 24, texto: '6 m en 12 s', ancla: 'end', peso: 400 }, { x: 312, y: 48, texto: 'P = ?', ancla: 'end' }], alt: 'Una grúa que sube 200 kg a 6 m en 12 s.' })),
      enunciado: ['Una grúa sube 200 kg de ladrillos a 6 m de altura en 12 s, a rapidez constante. ¿Qué potencia útil desarrolla?'],
      datos: [D6.potencia, D6.trabajo, D.peso],
      solucion: [{ texto: 'A rapidez constante, la grúa jala lo que pesan los ladrillos, así que su trabajo es 200 · 10 · 6 = 12 000 J; la potencia reparte ese trabajo entre los 12 s:', ecuacion: ['P = ', frac('12 000', '12'), ' = ', neg('1000 W')] }],
      respuesta: ['P = ', neg('1000 W')] },
    { nivel: 1, titulo: 'Fuerza por rapidez',
      figura: est({ alto: 170, piso: { y: 150, x0: 8, x1: 312 }, objetos: [{ tipo: 'carrito', x: 100, y: 150, w: 80, h: 30, mango: 0, texto: 'carreta' }, { tipo: 'cuerda', de: [140, 128], a: [200, 128] }],
        flechas: [{ de: [200, 128], ang: 0, largo: 36, color: 'o', texto: 'F = 400 N', rumbo: [0.6, -1] }, { de: [80, 90], ang: 0, largo: 36, color: 'tinta', texto: 'v = 2 m/s', rumbo: [1, -0.3] }],
        textos: [{ x: 8, y: 24, texto: 'P = ?', ancla: 'start' }], alt: 'Una carreta jalada con 400 N a 2 m/s constantes.' }),
      enunciado: ['Un caballo jala una carreta con ', pj('400 N'), ' y la lleva siempre a 2 m/s. ¿Qué potencia desarrolla?'],
      datos: [D6.fv],
      solucion: [{ texto: 'La carreta va a rapidez constante y el caballo jala en el sentido del avance, así que la potencia es la fuerza por la rapidez:', ecuacion: ['P = 400 · 2 = ', neg('800 W')] }],
      respuesta: ['P = ', neg('800 W')] },
    { nivel: 1, titulo: 'La eficiencia del motor',
      figura: est(figMontacargas({ u: 0.4, cota: false, texto: '', barras: barras([{ n: 'consume', v: 2000, c: 'tinta', t: W_(2000) }, { n: 'útil', v: 1500, c: 'o', t: W_(1500) }], { x0: 210, dx: 56, y: PISO6, k: 0.05, w: 22 }),
        textos: [{ x: 312, y: 24, texto: 'η = ?', ancla: 'end' }], alt: 'Un motor que consume 2000 W y entrega 1500 W útiles.' })),
      enunciado: ['Un motor consume 2000 W y entrega 1500 W útiles. ¿Cuál es su eficiencia?'],
      datos: [D6.efic],
      solucion: [{ texto: 'La eficiencia es la fracción de lo consumido que se vuelve útil: lo útil entre lo consumido.', ecuacion: ['η = ', frac('1500', '2000'), ' = 0,75 = ', neg('75 %')] }],
      respuesta: ['η = ', neg('75 %')] },
    { nivel: 1, titulo: 'Lo que consume',
      figura: est(figMontacargas({ u: 0.4, cota: false, texto: '', barras: barras([{ n: 'útil', v: 300, c: 'o', t: W_(300) }], { x0: 244, y: PISO6, k: 0.2, w: 22 }),
        textos: [{ x: 312, y: 24, texto: 'η = 50 %; consume: ?', ancla: 'end' }], alt: 'Un motor de eficiencia 50 % que entrega 300 W.' })),
      enunciado: ['Un motor con eficiencia del 50 % entrega 300 W útiles. ¿Qué potencia consume?'],
      datos: [D6.efic],
      solucion: [{ texto: 'Con una eficiencia del 50 %, lo útil es la mitad de lo consumido, así que lo consumido es lo útil entre 0,5:', ecuacion: [Pcons, ' = ', frac('300', '0,5'), ' = ', neg('600 W')] }],
      respuesta: [Pcons, ' = ', neg('600 W')] },
    { nivel: 2, titulo: 'Subir la escalera corriendo',
      figura: est(figEdificio({ cota: [0, 9, '9 m'], textos: [{ x: 312, y: 24, texto: '60 kg en 18 s; P = ?', ancla: 'end', peso: 400 }], alt: 'Una estudiante sube tres pisos de 3 m en 18 s.' })),
      enunciado: ['Una estudiante de 60 kg sube corriendo tres pisos de 3 m cada uno en 18 s. ¿Qué potencia desarrolla para subir?'],
      datos: [D6.potencia, D6.trabajo, D.peso],
      solucion: [
        { texto: 'Tres pisos de 3 m son 9 m de subida, así que el trabajo contra su peso es:', ecuacion: [W, ' = 60 · 10 · 9 = 5400 J'] },
        { texto: 'La potencia reparte ese trabajo entre los 18 s que tarda:', ecuacion: ['P = ', frac('5400', '18'), ' = ', neg('300 W')] },
      ],
      respuesta: ['P = ', neg('300 W')] },
    { nivel: 2, titulo: 'En kilómetros por hora',
      figura: est({ alto: 170, piso: { y: 150, x0: 8, x1: 312 }, objetos: [{ tipo: 'auto', x: 130, y: 150, w: 84 }],
        flechas: [{ de: [176, 126], ang: 0, largo: 36, color: 'o', texto: 'F = 1500 N', rumbo: [0, -1] }, { de: [110, 90], ang: 0, largo: 36, color: 'tinta', texto: '72 km/h', rumbo: [1, -0.3] }],
        textos: [{ x: 8, y: 24, texto: 'P = ?', ancla: 'start' }], alt: 'Un auto que va siempre a 72 km/h con una fuerza del motor de 1500 N.' }),
      enunciado: ['Un auto va siempre a 72 km/h por una carretera plana, y su motor lo empuja con ', pj('1500 N'), '. ¿Qué potencia desarrolla el motor?'],
      datos: [D6.fv, D6.kmh],
      solucion: [
        { texto: 'La rapidez tiene que ir en m/s para que la potencia salga en watts:', ecuacion: ['72 ÷ 3,6 = 20 m/s'] },
        { texto: 'A rapidez constante, la potencia del motor es la fuerza por la rapidez:', ecuacion: ['P = 1500 · 20 = ', neg('30 000 W')] },
      ],
      respuesta: ['P = ', neg('30 000 W')] },
    { nivel: 2, titulo: 'La bomba del tanque',
      figura: est({ alto: 212, piso: { y: 196, x0: 8, x1: 312 }, objetos: [{ tipo: 'motor', x: 60, y: 196, w: 46, h: 30 }, { tipo: 'cuerda', de: [80, 180], a: [220, 60] }, { tipo: 'caja', x: 240, y: 76, w: 60, h: 40, texto: 'tanque' }],
        cotas: [{ de: [300, 76], a: [300, 196], texto: '10 m', lado: -1, sep: 0 }], textos: [{ x: 8, y: 24, texto: '600 L en 2 min; P = ?', ancla: 'start', peso: 400 }],
        alt: 'Una bomba sube 600 L de agua a un tanque a 10 m en 2 minutos.' }),
      enunciado: ['Una bomba sube 600 L de agua a un tanque que está 10 m más arriba, en 2 minutos. ¿Qué potencia útil desarrolla?'],
      datos: [D6.potencia, D6.trabajo, D6.agua, D6.min],
      solucion: [
        { texto: 'Un litro de agua tiene una masa de 1 kg, así que 600 L son unos 600 kg, y el trabajo para subirlos 10 m es:', ecuacion: [W, ' = 600 · 10 · 10 = 60 000 J'] },
        { texto: 'La potencia va por segundo, y 2 min son 120 s:', ecuacion: ['P = ', frac('60 000', '120'), ' = ', neg('500 W')] },
      ],
      respuesta: ['P = ', neg('500 W')] },
    { nivel: 2, titulo: 'El tiempo con la potencia',
      figura: est(figMontacargas({ u: 0, cota: false, texto: '150 kg', textos: [{ x: 312, y: 24, texto: '750 W; a 15 m', ancla: 'end', peso: 400 }, { x: 312, y: 48, texto: 't = ?', ancla: 'end' }], alt: 'Un montacargas de 750 W que sube 150 kg a 15 m.' })),
      enunciado: ['Un montacargas de 750 W útiles sube 150 kg a 15 m de altura, a rapidez constante. ¿Cuánto tarda?'],
      datos: [D6.potencia, D6.trabajo, D.peso],
      solucion: [
        { texto: 'A rapidez constante, el trabajo es el peso de la carga por la altura:', ecuacion: [W, ' = 150 · 10 · 15 = 22 500 J'] },
        { texto: 'De P = W / t se despeja el tiempo: el trabajo entre la potencia.', ecuacion: ['t = ', frac('22 500', '750'), ' = ', neg('30 s')] },
      ],
      respuesta: ['t = ', neg('30 s')] },
    { nivel: 2, titulo: 'Lo que se vuelve calor',
      figura: est(figMontacargas({ u: 0.4, cota: false, texto: '', barras: barras([{ n: 'consume', v: 1200, c: 'tinta', t: W_(1200) }], { x0: 244, y: PISO6, k: 0.1, w: 22 }),
        textos: [{ x: 312, y: 24, texto: 'η = 75 %; calor: ?', ancla: 'end' }], alt: 'Un motor que consume 1200 W con una eficiencia del 75 %.' })),
      enunciado: ['Un motor consume 1200 W y tiene una eficiencia del 75 %. ¿Cuántos watts se le vuelven calor?'],
      datos: [D6.efic],
      solucion: [
        { texto: 'Lo útil es el 75 % de lo que consume:', ecuacion: [Putil, ' = 0,75 · 1200 = 900 W'] },
        { texto: 'El resto de lo consumido no llega a la carga y se vuelve calor:', ecuacion: ['1200 − 900 = ', pr('300 W')] },
      ],
      respuesta: ['Se vuelven calor ', pr('300 W')] },
    { nivel: 3, titulo: 'El tractor en la cuesta', fuente: 'Parecida a San Marcos 2023-I, pregunta 80.',
      figura: est({ alto: 212, piso: { y: 196, x0: 8, x1: 312 }, objetos: [{ tipo: 'rampa', x0: 20, y0: 196, largo: 270, ang: 37 }, { tipo: 'auto', x: 150, y: 98, w: 70, giro: 37, texto: 'tractor' }],
        angulos: [{ c: [20, 196], de: 0, a: 37, r: 30, texto: '37°' }], textos: [{ x: 8, y: 24, texto: '50 kW; 2000 kg; μ_k = 0,5', ancla: 'start', peso: 400 }, { x: 8, y: 48, texto: 'v = ?', ancla: 'start' }],
        alt: 'Un tractor de 50 kW con su remolque, 2000 kg en total, sube una cuesta de 37° con rozamiento.' }),
      enunciado: ['Un tractor con su remolque suma 2000 kg y desarrolla 50 kW útiles. Sube una cuesta de 37° con ', muk, ' = 0,5 a rapidez constante. ¿Con qué rapidez sube?'],
      alternativas: ['4,17 m/s', '2,5 m/s', '6,25 m/s', '2,27 m/s', '0,4 m/s'],
      datos: [D.fvConst, D.cuesta, D6.cin, D6.trig, '1 kW = 1000 W'],
      solucion: [
        { texto: 'A rapidez constante, la fuerza neta es cero: el motor empuja con lo mismo que suman la parte del peso a lo largo de la cuesta y el rozamiento:', ecuacion: [F, ' = 20 000 · 0,6 + 0,5 · 20 000 · 0,8 = 20 000 N'] },
        { texto: 'De P = F · v se despeja la rapidez, dividiendo la potencia útil entre la fuerza:', ecuacion: ['v = ', frac('50 000', '20 000'), ' = ', neg('2,5 m/s')] },
        { texto: [neg('A'), ' olvida el rozamiento, que también frena; ', neg('C'), ' olvida la parte del peso a lo largo de la cuesta; ', neg('D'), ' usa la normal igual al peso, como en un piso plano; ', neg('E'), ' divide la fuerza entre la potencia, al revés.'] },
      ],
      respuesta: [neg('B'), ': ', neg('2,5 m/s')] },
    { nivel: 3, titulo: 'La bomba del pozo', fuente: 'Parecida a San Marcos 2024-I, pregunta 81.',
      figura: est({ alto: 212, piso: { y: 60, x0: 8, x1: 312 }, objetos: [{ tipo: 'motor', x: 230, y: 60, w: 46, h: 30 }, { tipo: 'cuerda', de: [160, 60], a: [160, 190] }],
        paredes: [{ x: 140, y0: 60, y1: 200, lado: -1 }, { x: 180, y0: 60, y1: 200, lado: 1 }], cotas: [{ de: [110, 60], a: [110, 196], texto: '20 m', lado: 1, sep: 0 }],
        textos: [{ x: 8, y: 24, texto: '30 kg por minuto; pierde 20 %', ancla: 'start', peso: 400 }, { x: 312, y: 100, texto: 'consume: ?', ancla: 'end' }],
        alt: 'Una bomba saca 30 kg de agua por minuto de un pozo de 20 m y pierde el 20 % de lo que recibe.' }),
      enunciado: ['Una bomba saca 30 kg de agua por minuto de un pozo de 20 m de profundidad. Pierde el 20 % de la energía que recibe. ¿Qué potencia consume?'],
      alternativas: ['80 W', '100 W', '120 W', '7500 W', '125 W'],
      datos: [D6.potencia, D6.efic, D6.trabajo, D6.min],
      solucion: [
        { texto: 'Cada minuto la bomba sube 30 · 10 · 20 = 6000 J, y la potencia útil reparte eso entre los 60 s:', ecuacion: [Putil, ' = ', frac('6000', '60'), ' = 100 W'] },
        { texto: 'Pierde el 20 %, así que aprovecha el 80 % de lo que consume; lo consumido es lo útil entre 0,8:', ecuacion: [Pcons, ' = ', frac('100', '0,8'), ' = ', neg('125 W')] },
        { texto: [neg('A'), ' multiplica por 0,8 y le da a la bomba menos de lo que entrega; ', neg('B'), ' da la potencia útil, no la consumida; ', neg('C'), ' suma el 20 % de la útil, cuando el 20 % es de lo consumido; ', neg('D'), ' no pasa el minuto a segundos.'] },
      ],
      respuesta: [neg('E'), ': ', neg('125 W')] },
    { nivel: 3, titulo: 'La fuerza del motor del auto', fuente: 'Parecida a San Marcos 2023-II, pregunta 89.',
      figura: est({ alto: 170, piso: { y: 150, x0: 8, x1: 312 }, objetos: [{ tipo: 'auto', x: 130, y: 150, w: 84 }],
        flechas: [{ de: [176, 126], ang: 0, largo: 36, color: 'o', texto: 'F = ?', rumbo: [0, -1] }, { de: [110, 90], ang: 0, largo: 36, color: 'tinta', texto: 'v = 15 m/s', rumbo: [1, -0.3] }],
        textos: [{ x: 8, y: 24, texto: 'consume 50 kW; rinde 60 %', ancla: 'start', peso: 400 }], alt: 'Un auto cuyo motor consume 50 kW y rinde el 60 %, cuando va a 15 m/s.' }),
      enunciado: ['El motor de un auto consume 50 kW y rinde el 60 %. Parte del reposo y acelera; en el instante en que va a 15 m/s, ¿con qué fuerza lo empuja el motor?'],
      alternativas: ['2000 N', '3333,33 N', '5555,56 N', '4000 N', '450 000 N'],
      datos: [D6.fv, D6.efic, '1 kW = 1000 W'],
      solucion: [
        { texto: 'Solo el 60 % de lo que consume el motor llega a mover el auto:', ecuacion: [Putil, ' = 0,6 · 50 000 = 30 000 W'] },
        { texto: 'La potencia útil es la fuerza por la rapidez, y en ese instante el auto va a 15 m/s, así que la fuerza es:', ecuacion: [F, ' = ', frac('30 000', '15'), ' = ', neg('2000 N')] },
        { texto: [neg('B'), ' olvida la eficiencia y usa todo lo consumido; ', neg('C'), ' divide entre la eficiencia, cuando lo útil es menos que lo consumido; ', neg('D'), ' usa la rapidez media del arranque, 7,5 m/s, y no la de ese instante; ', neg('E'), ' multiplica en vez de dividir.'] },
      ],
      respuesta: [neg('A'), ': ', neg('2000 N')] },
    { nivel: 3, titulo: 'El motor de la rampa', fuente: 'Parecida a San Marcos 2023-I, pregunta 92.',
      figura: est({ alto: 212, piso: { y: 196, x0: 8, x1: 312 }, objetos: [{ tipo: 'rampa', x0: 20, y0: 196, largo: 270, ang: 37 }, { tipo: 'caja', x: 140, y: 106, w: 40, h: 28, giro: 37, texto: '50 kg' }],
        flechas: [{ de: [176, 96], ang: 37, largo: 34, color: 'tinta' }], angulos: [{ c: [20, 196], de: 0, a: 37, r: 30, texto: '37°' }],
        textos: [{ x: 8, y: 24, texto: 'v = 2 m/s, rampa arriba', ancla: 'start', peso: 400 }, { x: 8, y: 48, texto: 'μ_k = 0,25; P = ?', ancla: 'start', peso: 400 }], alt: 'Una caja de 50 kg subida por una rampa de 37° con rozamiento, a 2 m/s constantes.' }),
      enunciado: ['Un motor sube una caja de 50 kg por una rampa de 37°, a 2 m/s constantes. Entre la caja y la rampa, ', muk, ' = 0,25. ¿Qué potencia útil desarrolla el motor?'],
      alternativas: ['600 W', '1200 W', '800 W', '200 W', '400 W'],
      datos: [D.fvConst, D.cuesta, D6.cin, D6.trig],
      solucion: [
        { texto: 'A rapidez constante, la fuerza neta es cero: el motor empuja con lo mismo que suman la parte del peso a lo largo de la rampa y el rozamiento:', ecuacion: [F, ' = 500 · 0,6 + 0,25 · 500 · 0,8 = 300 + 100 = 400 N'] },
        { texto: 'La potencia útil es esa fuerza por la rapidez constante de la caja:', ecuacion: ['P = 400 · 2 = ', neg('800 W')] },
        { texto: [neg('A'), ' olvida el rozamiento; ', neg('B'), ' usa el peso entero, 500 + 100, en vez de su parte a lo largo de la rampa, que es 500 · 0,6.'] },
        { texto: [neg('D'), ' cuenta solo el rozamiento; ', neg('E'), ' da la fuerza del motor, en newtons, y no la potencia.'] },
      ],
      respuesta: [neg('C'), ': ', neg('800 W')] },
    { nivel: 3, titulo: 'Verdadero o falso de la potencia', fuente: 'Parecida a San Marcos 2026-II, pregunta 90.',
      figura: est(figMontacargas({ u: 0.4, cota: false, texto: '400 kg', textos: [{ x: 312, y: 24, texto: '10 m en 20 s', ancla: 'end', peso: 400 }], alt: 'Un montacargas que sube 400 kg a 10 m en 20 s.' })),
      enunciado: ['Un montacargas sube 400 kg a 10 m en 20 s, a rapidez constante. V o F: I. El cable jala con 4000 N. II. Trabaja 40 000 J. III. En 10 s haría el doble de trabajo.'],
      alternativas: ['VVV', 'FVV', 'VFF', 'VVF', 'FFV'],
      datos: [D6.potencia, D6.trabajo, D6.constante, D.peso],
      solucion: [
        { texto: 'I: a rapidez constante la fuerza neta es cero, así que el cable jala lo que pesa la carga, 4000 N (V). II: su trabajo es esa fuerza por la altura, 4000 · 10 = 40 000 J (V).' },
        { texto: 'III: en 10 s sube la misma carga a la misma altura, así que hace el mismo trabajo; lo que se duplica es la potencia (F).' },
        { texto: [neg('A'), ' cree que hacerlo más rápido es hacer más trabajo, y eso es más potencia; ', neg('B'), ' y ', neg('E'), ' dudan de que el cable jale lo que pesa la carga; ', neg('C'), ' se equivoca en el trabajo.'] },
      ],
      respuesta: [neg('D'), ': VVF'] },
  ];

  const COSAS6_AT = ['Una grúa', 'Un montacargas', 'Un torno'];
  const potencia = {
    id: 'potencia-y-eficiencia',
    titulo: 'Potencia y eficiencia',
    pregunta: '¿Cuánto consume un motor que entrega 500 W?',
    temas: ['Potencia y eficiencia'],
    pieza: 'fis-estatica',
    aprendizaje: 'La potencia es el trabajo en cada segundo, P = W/t = F · v; la eficiencia es lo útil entre lo consumido, nunca más de 1.',
    actividad: 'Subir una carga con el montacargas de la obra, más o menos rápido.',
    lee: {
      tarjetas: [
        { titulo: 'Se mide en watts', texto: 'La potencia dice qué tan rápido se hace un trabajo: subir la misma carga en la mitad del tiempo pide el doble de potencia. Se mide en watts (W), y un watt es un joule en cada segundo. Un foco LED de casa usa unos 10 W, y una terma eléctrica, unos 1500 W.',
          ecuacion: ['1 W = 1 J / 1 s'], dibujo: est(figMontacargas({ u: 0.3, alt: 'El montacargas de la obra subiendo una carga de cemento.' })) },
        { titulo: 'Dos letras que cambian', texto: 'Ojo con las letras: aquí P es la potencia, así que el peso se escribe m · g. La letra W sola es el trabajo, pero después de un número, como en 500 W, es el watt, la unidad de potencia.' },
        { titulo: 'Nada sale gratis', texto: 'Un motor recibe energía eléctrica y entrega trabajo a la carga, pero una parte de esa energía se le escapa como calor en sus cables y piezas: por eso un motor que trabaja se calienta.' },
        { titulo: 'Qué mirar al jugar', texto: 'El montacargas sube siempre la misma carga 10 m, así que su trabajo no cambia. Elige cuánto tarda y mira cuántos joules hace en cada segundo.' },
      ],
    },
    ejemplos: EJEMPLOS_POTENCIA,
    juega: {
      pieza: 'fis-estatica',
      consigna: 'El montacargas de la obra sube 50 kg de cemento 10 m, a rapidez constante. Elige cuánto tarda.',
      mision: {
        texto: 'Haz que el motor desarrolle 125 W.',
        // Una sola manera en la grilla: 40 s (5000 J ÷ 40 s).
        logrado: val => Math.abs(5000 / val.t - 125) < 1e-9,
        bien: 'Son 125 W: 5000 J repartidos en 40 s dan 125 J en cada segundo.',
      },
      voz: 'Si tarda el doble, ¿qué le pasa a la potencia?',
      leyenda: [
        { s: W, t: 'trabajo para subir la carga: 5000 J' },
        { s: 't', t: 'tiempo que tarda en subir 10 m' },
        { s: 'P', t: 'potencia en watts: 250 W = 250 J/s' },
        { s: 'v', t: 'rapidez de la carga' },
      ],
      controles: [
        { id: 't', etiqueta: 'Tiempo, t', opciones: [{ valor: 10, texto: '10 s' }, { valor: 20, texto: '20 s' }, { valor: 25, texto: '25 s' }, { valor: 40, texto: '40 s' }, { valor: 50, texto: '50 s' }], inicio: 20 },
        { id: 'u', etiqueta: 'Parte de la subida (0 abajo, 1 arriba)', min: 0, max: 1, paso: 0.25, inicio: 0, unidad: '', decimales: 2, auto: { velocidad: 0.25, modo: 'repite' } },
      ],
      dibujo: juego6,
      // La lectura enuncia la relación: el trabajo repartido en los segundos.
      lectura: val => [`5000 J en ${val.t} s: ${f(5000 / val.t)} J cada segundo`],
      resumen: { t: 20, u: 0.5 },
      minimo: 3,
    },
    predice: {
      pregunta: 'Otro motor entrega 500 W a la carga, pero solo aprovecha el 80 % de la energía eléctrica que consume. ¿Cuánta potencia consume?',
      datos: ['Entrega 500 W a la carga.', 'Aprovecha el 80 % de lo que consume; el resto se vuelve calor.'],
      opciones: [
        { id: 'c', texto: '625 W', correcta: true },
        { id: 'por', texto: '400 W', error: 'PO-EFIC', siFuera: 'Usar el 80 % está bien, pero lo multiplicaste por lo que entrega. El motor pierde energía como calor, así que consume más de lo que entrega, y 400 W es menos.' },
        { id: 'ignora', texto: '500 W', error: 'PO-IGNORA', siFuera: '500 W es lo que entrega a la carga. Consume más que eso, porque una parte de la energía eléctrica se vuelve calor y no llega a la carga.' },
        { id: 'suma', texto: '600 W', error: 'PO-SUMA', siFuera: 'Es cierto que consume más, pero el 20 % que pierde es una parte de lo que consume, no de los 500 W. Por eso no basta sumarle 100 W a lo que entrega.' },
      ],
      dibujo: est(PRED6),
      revelar: est(REVELA6),
      coincide: 'Coincide: 500 W son el 80 % de 625 W, así que el motor consume 625 W y los otros 125 W se vuelven calor.',
    },
    mira: {
      pieza: 'fis-estatica',
      datos: MIRA6,
      pasos: [
        { estado: { corte: 0 }, texto: 'El motor entrega 500 W: en cada segundo le da 500 J de trabajo a la carga.', ecuacion: [Putil, ' = 500 W'] },
        { estado: { corte: 1 }, texto: 'Esos 500 W son solo el 80 % de lo que consume, así que lo consumido es 500 entre 0,8.', ecuacion: ['0,8 · ', Pcons, ' = 500 W;   ', Pcons, ' = 500 / 0,8 = 625 W'] },
        { estado: { corte: 2 }, texto: 'Los 125 W que no llegan a la carga se vuelven calor en el motor.', ecuacion: ['625 − 500 = 125 W'] },
        { estado: { corte: 3 }, texto: 'A rapidez constante, la potencia también es la fuerza por la rapidez: aquí, 500 N a 1 m/s.', ecuacion: ['P = ', F, ' · v = 500 · 1 = 500 W'] },
      ],
    },
    regla: {
      texto: 'La potencia es el trabajo que se hace en cada segundo; si la fuerza mueve el cuerpo a rapidez constante, es la fuerza por la rapidez. La eficiencia dice qué fracción de la energía consumida llega como trabajo útil, y nunca pasa de 1 porque ningún motor entrega más de lo que recibe: el resto se vuelve calor.',
      ecuacion: ['P = ', frac(pj('W'), 't'), ' = ', F, ' · v', '   ;   ', 'η = ', frac(Putil, Pcons)],
      condicion: 'la fuerza va en el sentido de la velocidad y la eficiencia se usa en decimal: 80 % es 0,8. Si la fuerza va inclinada, solo cuenta su parte a lo largo del avance.',
      voz: 'Para hallar lo que consume, divide lo útil entre la eficiencia: siempre sale más.',
      dibujo: est(REVELA6),
    },
    // Así se resuelve: la potencia útil de un montacargas (semillas pares) o lo que consume una bomba con su eficiencia
    // (impares), con otros números que «Ahora tú».
    resuelve: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 1) {
          const c = elegir(() => { const Pu = r.de([400, 800, 1200]), ef = r.de([0.6, 0.8]), Pc = Pu / ef; return exacto(Pc) && { Pu, ef, Pc }; });
          return {
            enunciado: [`Una bomba de agua entrega ${W_(c.Pu)} útiles y su eficiencia es del ${f(c.ef * 100)} %. ¿Qué potencia consume?`],
            datos: [D6.efic],
            pasos: [
              { tipo: 'pide', texto: 'Piden la potencia que consume, es decir, la que entra a la bomba, no la que entrega al agua.' },
              { tipo: 'datos', texto: [`Útil: ${W_(c.Pu)}. Eficiencia: ${f(c.ef * 100)} % = ${f(c.ef)}.`] },
              { tipo: 'regla', texto: 'La eficiencia es lo útil entre lo consumido. Para hallar lo consumido se despeja: se divide lo útil entre la eficiencia, en decimal.', ecuacion: ['η = ', frac(Putil, Pcons)] },
              { tipo: 'cuentas', texto: 'Al dividir entre un número menor que 1, el resultado sale mayor que lo útil:', ecuacion: [Pcons, ` = ${f(c.Pu)} / ${f(c.ef)} = `, neg(W_(c.Pc))] },
              { tipo: 'sentido', texto: `Consume más de lo que entrega, como debe ser en cualquier máquina: la diferencia, ${W_(c.Pc - c.Pu)}, se vuelve calor.` },
            ],
            respuesta: [Pcons, ' = ', neg(W_(c.Pc))],
          };
        }
        const m = r.de([60, 120, 300]), hh = r.de([4, 8, 12]), t = r.de([16, 24, 30]), Wv = m * G * hh, P = Wv / t;
        if (!exacto(P)) return this.generar(sm + 2);
        return {
          enunciado: [`Un torno sube ${m} kg a ${hh} m de altura en ${t} s, a rapidez constante. ¿Qué potencia útil desarrolla?`],
          datos: [D6.potencia, D6.trabajo, D.peso],
          dibujo: est(figMontacargas({ u: 0.3, cota: false, texto: `${m} kg`, textos: [{ x: 312, y: 24, texto: `${hh} m en ${t} s`, ancla: 'end', peso: 400 }, { x: 312, y: 48, texto: 'P = ?', ancla: 'end' }] })),
          pasos: [
            { tipo: 'pide', texto: 'Piden la potencia útil, es decir, cuánto trabajo hace el torno sobre la carga en cada segundo.' },
            { tipo: 'datos', texto: `Sube ${m} kg a ${hh} m en ${t} s, a rapidez constante.` },
            { tipo: 'regla', texto: 'A rapidez constante el torno jala lo que pesa la carga, así que su trabajo es el peso por la altura; la potencia es ese trabajo entre el tiempo.', ecuacion: ['P = ', frac('W', 't')] },
            { tipo: 'cuentas', texto: `El trabajo es el peso por la altura: ${m} · 10 · ${hh} = ${J_(Wv)}.`, ecuacion: [`P = ${f(Wv)} / ${t} = `, neg(W_(P))] },
            { tipo: 'sentido', texto: `Un joule en cada segundo es un watt. Si tardara el doble, haría el mismo trabajo con la mitad de potencia: ${W_(P / 2)}.` },
          ],
          respuesta: ['P = ', neg(W_(P))],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-estatica',
      generar(sm) {
        const r = azar(sm), k = sm % 4;
        if (k === 0) {
          const c = elegir(() => { const ob = r.de(COSAS6_AT), m = r.de([40, 80, 100, 200]), hh = r.de([5, 10, 15, 20]), min = r() < 0.3, t = min ? r.de([1, 2]) : r.de([5, 10, 20, 25]), ts = min ? 60 * t : t, Wv = m * G * hh, P = Wv / ts;
            return exacto(P) && !(m === 50 && hh === 10) && distintos(P, Wv, m * hh / ts, min ? Wv / t : m * G) && { ob, m, hh, min, t, ts, Wv, P }; });
          return {
            pregunta: [`${c.ob} sube ${c.m} kg a ${c.hh} m de altura en ${c.t} ${c.min ? (c.t === 1 ? 'minuto' : 'minutos') : 's'}, a rapidez constante. ¿Qué potencia útil desarrolla?`],
            datos: [D6.potencia, D6.trabajo, D.peso, ...(c.min ? [D6.min] : [])],
            opciones: opciones(c.P, [
              { id: 'trabajo', valor: c.Wv, error: 'W15', siFuera: 'El trabajo está bien, pero eso son joules, no watts. La potencia reparte ese trabajo entre los segundos que tarda, así que falta dividir entre el tiempo.' },
              { id: 'sin-g', valor: c.m * c.hh / c.ts, error: 'PO-SIN-G', siFuera: 'Dividir entre el tiempo está bien, pero el trabajo es el peso por la altura, y el peso es m · g. Falta multiplicar por g.' },
              c.min ? { id: 'min', valor: c.Wv / c.t, error: 'PO-MIN', siFuera: 'Dividir el trabajo entre el tiempo está bien, pero el tiempo quedó en minutos. Un watt es un joule por segundo, así que el tiempo va en segundos.' }
                : { id: 'fuerza', valor: c.m * G, error: 'PO-FUERZA', siFuera: 'Ese número es la fuerza del cable, en newtons. La potencia es el trabajo por segundo: falta multiplicar por la altura y dividir entre el tiempo.' },
            ], W_),
            solucion: { texto: `A rapidez constante, el trabajo es el peso por la altura, ${J_(c.Wv)}, y se reparte entre los ${c.ts} s:`, ecuacion: [`P = ${f(c.Wv)} / ${c.ts} = `, neg(W_(c.P))] },
          };
        }
        if (k === 1) {
          const c = elegir(() => { const Pu = r.de([300, 600, 900, 1200, 1500]), ef = r.de([0.6, 0.75, 0.9]), Pc = Pu / ef;
            return exacto(Pc) && !(Pu === 500) && distintos(Pc, Pu * ef, Pu, Pu * (2 - ef)) && { Pu, ef, Pc }; });
          const cosa = r.de(['Un motor', 'Una bomba', 'Una licuadora']);
          return {
            pregunta: [`${cosa} con una eficiencia del ${f(c.ef * 100)} % entrega ${W_(c.Pu)} útiles. ¿Qué potencia consume?`],
            datos: [D6.efic],
            opciones: opciones(c.Pc, [
              { id: 'por', valor: c.Pu * c.ef, error: 'PO-EFIC', siFuera: 'Usar la eficiencia está bien, pero la multiplicaste y salió menos que lo útil. Lo consumido siempre es más que lo útil, así que se divide entre la eficiencia.' },
              { id: 'ignora', valor: c.Pu, error: 'PO-IGNORA', siFuera: 'Ese es el número que entrega. Consume más que eso, porque una parte de lo que recibe se pierde como calor.' },
              { id: 'suma', valor: c.Pu * (2 - c.ef), error: 'PO-SUMA', siFuera: 'Es cierto que consume más, pero lo que pierde es una fracción de lo consumido, no de lo útil. Por eso no basta sumarle ese porcentaje a lo útil.' },
            ], W_),
            solucion: { texto: 'De η = útil ÷ consumida se despeja lo consumido: lo útil entre la eficiencia.', ecuacion: [Pcons, ` = ${f(c.Pu)} / ${f(c.ef)} = `, neg(W_(c.Pc))] },
          };
        }
        if (k === 2) {
          const c = elegir(() => { const Fv = r.de([800, 1000, 1500, 2000]), vk = r.de([18, 36, 54, 72]), v = vk / 3.6, P = Fv * v;
            return exacto(P) && !(Fv === 1500 && vk === 72) && distintos(P, Fv * vk, Fv / v, Fv) && { Fv, vk, v, P }; });
          const cosa = r.de(['Un tractor arrastra un remolque', 'Una grúa remolca un auto', 'Un camión jala un tráiler']);
          return {
            pregunta: [`${cosa} a ${c.vk} km/h constantes, con una fuerza de `, pj(N_(c.Fv)), '. ¿Qué potencia desarrolla?'],
            datos: [D6.fv, D6.kmh],
            opciones: opciones(c.P, [
              { id: 'kmh', valor: c.Fv * c.vk, error: 'U-KMH', siFuera: 'Fuerza por rapidez está bien, pero la rapidez quedó en km/h. Para que salga en watts, la rapidez va en m/s: se divide entre 3,6.' },
              { id: 'div', valor: c.Fv / c.v, error: 'PO-INVERSA', siFuera: 'Pasar a m/s está bien, pero dividiste la fuerza entre la rapidez. La potencia es fuerza por rapidez: cuanto más rápido, más potencia.' },
              { id: 'fuerza', valor: c.Fv, error: 'PO-FUERZA', siFuera: 'Ese número es la fuerza, en newtons, no la potencia. Falta multiplicarla por la rapidez en m/s.' },
            ], W_),
            solucion: { texto: `Primero la rapidez en m/s, ${c.vk} ÷ 3,6 = ${MS(c.v)}, y después la fuerza por esa rapidez:`, ecuacion: [`P = ${f(c.Fv)} · ${f(c.v)} = `, neg(W_(c.P))] },
          };
        }
        // Nivel examen (cada cuatro semillas, por turno): el tractor en la cuesta (San Marcos 2023-I), la bomba con su caudal
        // (2022) o el motor del auto con su rendimiento (2023-II).
        const turno = Math.floor(sm / 4) % 3;
        if (turno === 0) {
          const c = elegir(() => { const m = r.de([1000, 1500, 2000]), mu = r.de([0.25, 0.5]), Pk = r.de([24, 30, 36, 48]), Fv = m * G * (0.6 + mu * 0.8), v = Pk * 1000 / Fv;
            return exacto(v) && !(m === 2000 && mu === 0.5 && Pk === 50) && distintos(v, Pk * 1000 / (m * G * 0.6), Pk * 1000 / (m * G * mu * 0.8), Pk * 1000 / (m * G * (0.6 + mu))) && { m, mu, Pk, Fv, v }; });
          return {
            pregunta: [`Un tractor con su remolque suma ${c.m} kg y desarrolla ${c.Pk} kW útiles. Sube una cuesta de 37° con `, muk, ` = ${f(c.mu)}, a rapidez constante. ¿Con qué rapidez sube?`],
            datos: [D.fvConst, D.cuesta, D6.cin, D6.trig, '1 kW = 1000 W'],
            opciones: opciones(c.v, [
              { id: 'sin-roce', valor: c.Pk * 1000 / (c.m * G * 0.6), error: 'PO-SIN-ROCE', siFuera: 'La parte del peso a lo largo de la cuesta está bien, pero falta el rozamiento, que también frena. El motor tiene que vencer las dos.' },
              { id: 'sin-peso', valor: c.Pk * 1000 / (c.m * G * c.mu * 0.8), error: 'PO-SIN-PESO', siFuera: 'El rozamiento está bien, pero en una cuesta una parte del peso también tira hacia abajo, a lo largo de ella, y el motor tiene que vencerla.' },
              { id: 'nmg', valor: c.Pk * 1000 / (c.m * G * (0.6 + c.mu)), error: 'N-MG', siFuera: 'Sumar las dos fuerzas está bien, pero tomaste la normal igual al peso. En la cuesta la normal es m · g · cos 37°, y el rozamiento sale menor.' },
            ], MS),
            solucion: { texto: `A rapidez constante, el motor vence la parte del peso y el rozamiento: ${c.m * G} · 0,6 + ${f(c.mu)} · ${c.m * G} · 0,8 = ${N_(c.Fv)}. Luego, v = P ÷ F:`, ecuacion: [`v = ${f(c.Pk * 1000)} / ${f(c.Fv)} = `, neg(MS(c.v))] },
          };
        }
        if (turno === 1) {
          const c = elegir(() => { const Q = r.de([60, 120, 180, 300]), hh = r.de([5, 10, 15, 20]), P = Q / 60 * G * hh;
            return exacto(P) && distintos(P, Q * G * hh, Q / 60 * hh, Q * G * hh / 3600) && { Q, hh, P }; });
          return {
            pregunta: [`Una bomba sube ${c.Q} litros de agua por minuto hasta un tanque ${c.hh} m más arriba. ¿Qué potencia útil desarrolla?`],
            datos: [D6.potencia, D6.trabajo, D6.agua, D6.min],
            opciones: opciones(c.P, [
              { id: 'min', valor: c.Q * G * c.hh, error: 'PO-MIN', siFuera: 'El trabajo de un minuto está bien, pero la potencia es por segundo, y un minuto tiene 60 s. Falta dividir entre 60.' },
              { id: 'sin-g', valor: c.Q / 60 * c.hh, error: 'PO-SIN-G', siFuera: 'Los kilos por segundo están bien, pero el trabajo lleva el peso, m · g, y no solo la masa. Falta multiplicar por g.' },
              { id: 'hora', valor: c.Q * G * c.hh / 3600, error: 'PO-HORA', siFuera: 'El trabajo de un minuto está bien, pero lo dividiste entre 3600, que son los segundos de una hora. Un minuto tiene 60 s.' },
            ], W_),
            solucion: { texto: `Un litro de agua es 1 kg, así que cada segundo sube ${f(c.Q / 60)} kg a ${c.hh} m, y la potencia es el trabajo de ese segundo:`, ecuacion: [`P = ${f(c.Q / 60)} · 10 · ${c.hh} = `, neg(W_(c.P))] },
          };
        }
        const c = elegir(() => { const Pk = r.de([40, 60, 80]), ef = r.de([0.5, 0.6, 0.75]), v = r.de([10, 15, 20, 25]), Fv = ef * Pk * 1000 / v;
          return exacto(Fv) && !(Pk === 50) && distintos(Fv, Pk * 1000 / v, Pk * 1000 / (ef * v), 2 * Fv) && { Pk, ef, v, Fv }; });
        return {
          pregunta: [`El motor de un auto consume ${c.Pk} kW y rinde el ${f(c.ef * 100)} %. En el instante en que va a ${c.v} m/s, ¿con qué fuerza lo empuja el motor?`],
          datos: [D6.fv, D6.efic, '1 kW = 1000 W'],
          opciones: opciones(c.Fv, [
            { id: 'sin-ef', valor: c.Pk * 1000 / c.v, error: 'PO-IGNORA', siFuera: 'Dividir la potencia entre la rapidez está bien, pero usaste todo lo que consume. Solo la parte útil mueve el auto: primero se multiplica por el rendimiento.' },
            { id: 'div-ef', valor: c.Pk * 1000 / (c.ef * c.v), error: 'PO-EFIC', siFuera: 'Usar el rendimiento está bien, pero dividiste entre él. Lo útil es menos que lo consumido, así que se multiplica por el rendimiento.' },
            { id: 'media', valor: 2 * c.Fv, error: 'PO-VMEDIA', siFuera: 'Lo útil entre la rapidez está bien, pero usaste la mitad de la rapidez. La fuerza de ese instante va con la rapidez de ese instante, no con una media.' },
          ], N_),
          solucion: { texto: `Solo lo útil mueve el auto: ${f(c.ef)} · ${f(c.Pk * 1000)} = ${W_(c.ef * c.Pk * 1000)}. Esa potencia es F · v, con la rapidez de ese instante:`, ecuacion: [F, ` = ${f(c.ef * c.Pk * 1000)} / ${c.v} = `, neg(N_(c.Fv))] },
        };
      },
    },
  };

  // Motores de las mesas del laboratorio (los mismos que dibujan y leen). `guardado` dice si el caso actual ya se guardó.
  const trabajoAsa = val => val.F * 5 * COS[val.ang];
  const guardado = (val, gs, claves) => gs.some(gg => claves.every(c => gg[c] === val[c]));
  const laboratorio = [
    { id: 'cuerda-libre', titulo: 'La maleta y su asa', pieza: 'fis-estatica',
      consigna: 'La maleta avanza 5 m hacia la derecha. Jala el asa con la fuerza y hacia el lado que quieras.',
      controles: [
        { id: 'F', etiqueta: 'Jalón, F', color: 'c-o', min: 10, max: 50, paso: 10, inicio: 30, unidad: 'N', decimales: 0 },
        { id: 'ang', etiqueta: 'Ángulo, θ', opciones: [0, 37, 53, 90, 127, 143, 180].map(a => ({ valor: a, texto: `${a}°` })), inicio: 37 },
      ],
      dibujo: val => est(figJalon({ ang: val.ang, tF: `F = ${val.F} N`, tC: val.ang !== 90 && val.ang !== 0 && val.ang !== 180 ? N_(Math.abs(val.F * COS[val.ang])) : undefined, d: 'd = 5 m',
        alt: `Una maleta que avanza 5 m; el asa jala con ${val.F} N a ${val.ang}° del avance: su trabajo es ${f(trabajoAsa(val))} J.` })),
      lectura: val => [`W = ${val.F} · 5 · cos ${val.ang}° = ${J_(trabajoAsa(val))}`],
      invitaciones: [
        { texto: 'Jala con 50 N y haz que tu jalón no haga ningún trabajo.', logrado: val => val.F === 50 && val.ang === 90,
          bien: 'De lado al avance: nada va a lo largo del piso. W = 0 con cualquier fuerza.' },
        { texto: 'Consigue que tu jalón frene la maleta con −120 J.', logrado: val => Math.abs(trabajoAsa(val) + 120) < 1e-9,
          bien: 'Pasado 90°, el jalón va contra el avance. ¿Hallaste las dos maneras?' },
        { texto: 'Busca el trabajo más negativo que puede hacer tu jalón.', logrado: val => val.F === 50 && val.ang === 180,
          bien: 'Toda la fuerza contra el avance: −250 J.' },
        { texto: 'Guarda dos casos con distinta fuerza que hagan el mismo trabajo, sin ser cero.',
          logrado: (val, gs) => Math.abs(trabajoAsa(val)) > 1e-9 && guardado(val, gs, ['F', 'ang']) && gs.some(gg => gg.F !== val.F && Math.abs(trabajoAsa(gg) - trabajoAsa(val)) < 1e-9),
          bien: 'Más fuerza, más inclinada: solo cuenta la parte a lo largo del camino.' },
      ] },
    { id: 'rampa', titulo: 'La rampa con y sin rozamiento', pieza: 'fis-estatica',
      consigna: 'La caja de 2 kg baja por la rampa de 37°. Cambia la altura y los tablones, y compara lo que llega abajo.',
      controles: [
        { id: 'h', etiqueta: 'Altura, h', min: 2, max: 5, paso: 1, inicio: 2, unidad: 'm', decimales: 0 },
        { id: 'mu', etiqueta: 'Tablones, μk', opciones: [{ valor: 0, texto: '0' }, { valor: 0.15, texto: '0,15' }, { valor: 0.3, texto: '0,3' }, { valor: 0.45, texto: '0,45' }], inicio: 0.3 },
        { id: 'u', etiqueta: 'Parte del camino (0 arriba, 1 abajo)', min: 0, max: 1, paso: 0.25, inicio: 0, unidad: '', decimales: 2, auto: { velocidad: 0.25, modo: 'repite' } },
      ],
      dibujo: juego5,
      lectura: val => { const e = energia5(val.h, val.mu, 1); return [`Arriba ${J_(e.E)}; abajo, `, EC, ` = ${J_(e.E - e.Qt)} y calor ${J_(e.Qt)}`]; },
      invitaciones: [
        { texto: 'Sin rozamiento, haz que la caja llegue abajo con 80 J.', logrado: val => val.mu === 0 && Math.abs(energia5(val.h, 0, 1).E - 80) < 1e-9,
          bien: 'Sin rozamiento llega toda la energía de arriba: 2 · 10 · 4 = 80 J.' },
        { texto: 'Con rozamiento, haz que llegue abajo con 48 J.', logrado: val => val.mu > 0 && Math.abs(energia5(val.h, val.mu, 1).E - energia5(val.h, val.mu, 1).Qt - 48) < 1e-9,
          bien: '¿Hallaste las dos maneras: más alta y más áspera, o más baja y menos áspera?' },
        { texto: 'Haz que más de la mitad de la energía se vuelva calor.', logrado: val => energia5(val.h, val.mu, 1).Qt > energia5(val.h, val.mu, 1).E / 2 + 1e-9,
          bien: 'Con los tablones más ásperos, el rozamiento se lleva más de lo que llega.' },
        { texto: 'Guarda la misma altura con y sin rozamiento.', logrado: (val, gs) => guardado(val, gs, ['h', 'mu']) && gs.some(gg => gg.h === val.h && gg.mu !== val.mu && (gg.mu === 0 || val.mu === 0)),
          bien: 'Arriba tienen lo mismo; abajo, la diferencia es el calor.' },
      ] },
    { id: 'empujon', titulo: 'El empujón y las barras', pieza: 'fis-estatica',
      consigna: 'Empujas desde el reposo el carrito de 20 kg. Cambia la fuerza y la distancia, y mira las barras y la rapidez.',
      controles: [
        { id: 'F', etiqueta: 'Empujón, F', color: 'c-o', min: 10, max: 40, paso: 10, inicio: 20, unidad: 'N', decimales: 0 },
        { id: 'd', etiqueta: 'Distancia, d', min: 1, max: 4, paso: 1, inicio: 1, unidad: 'm', decimales: 0 },
      ],
      dibujo: juego2,
      lectura: val => { const v = v2(val); return [`W = ${val.F} · ${val.d} = ${J_(val.F * val.d)}: sale a ${exacto(v) ? '' : '≈ '}${MS(v)}`]; },
      invitaciones: [
        { texto: 'Guarda dos empujones distintos que den la misma rapidez.', logrado: (val, gs) => guardado(val, gs, ['F', 'd']) && gs.some(gg => gg.F !== val.F && gg.F * gg.d === val.F * val.d),
          bien: 'Mismo trabajo, misma rapidez: no importa si pusiste más fuerza o más distancia.' },
        { texto: 'Consigue el doble de rapidez que da empujar 10 N por 1 m.', logrado: val => val.F * val.d === 40,
          bien: 'El doble de rapidez pidió cuatro veces el trabajo: 40 J en vez de 10 J.' },
        { texto: 'Busca la mayor rapidez que permiten los controles.', logrado: val => val.F === 40 && val.d === 4,
          bien: '160 J de trabajo: sale a 4 m/s.' },
      ] },
  ];

  // Glosario del tema (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso, cada una con su aproximación
  // (`simple`) y tres ejemplos. Fuerza, peso, normal, rozamiento, fuerza elástica, constante elástica y deformación vienen
  // de Estática; fuerza neta, de Dinámica; área bajo la gráfica, de MRUV; calor, de Temperatura y calor. Ningún ejemplo
  // responde una Predice: ni el trabajo de la mochila, ni los 360 J, ni lo que cambia la maceta, ni los toboganes, ni las
  // dos rampas, ni los 625 W.
  const GLOSARIO = [
    { termino: 'trabajo', simbolo: 'W', medida: 'J', formas: ['trabajo', 'trabajos'],
      def: 'Lo que aporta una fuerza mientras el cuerpo avanza: su parte a lo largo del camino por la distancia.',
      simple: 'Cuánto ayuda o frena una fuerza al avance, como tu empujón a un carrito.',
      ejemplos: ['Arrastrar una caja 5 m con 20 N, en el sentido del avance: 100 J.', 'El rozamiento que frena un costal hace un trabajo negativo.', 'Empujar una pared que no se mueve no hace trabajo: la pared no avanza.'],
      ver: ['joule', 'gráfica F–x'] },
    { termino: 'joule', simbolo: 'J', formas: ['joule', 'joules'],
      def: 'Unidad de trabajo y de energía: lo que aporta 1 N a lo largo de 1 m.',
      simple: 'La unidad de energía; subir una manzana chica un metro cuesta uno.',
      ejemplos: ['1 J = 1 N · 1 m.', 'Subir una manzana de 100 g a 1 m de altura cuesta 1 J.', 'Un trabajo de 2000 J se escribe también 2 kJ.'],
      ver: ['trabajo'] },
    { termino: 'gráfica F–x', formas: ['gráfica F–x', 'gráficas F–x'],
      def: 'Gráfica de la fuerza a lo largo del camino contra la posición x del cuerpo.',
      simple: 'Un dibujo de cuánto empuja una fuerza en cada punto del camino.',
      ejemplos: ['Una recta horizontal: la fuerza no cambia.', 'Una recta que sube desde 0: la fuerza de un resorte que se estira.', 'El área bajo ella entre dos posiciones es el trabajo.'],
      ver: ['trabajo', 'área bajo la gráfica'] },
    { termino: 'energía cinética', simbolo: 'E_C', medida: 'J', formas: ['energía cinética', 'energías cinéticas'],
      def: 'Energía de un cuerpo por moverse: la mitad de su masa por su rapidez al cuadrado.',
      simple: 'La energía que lleva algo por moverse: una combi rápida golpea más fuerte.',
      ejemplos: ['Una pelota de 0,5 kg a 4 m/s: ½ · 0,5 · 4² = 4 J.', 'Un cuerpo quieto no tiene energía cinética.', 'Un camión lleno, a la misma rapidez, tiene más que uno vacío.'],
      ver: ['trabajo neto', 'joule'] },
    { termino: 'trabajo neto', simbolo: 'W_neto', medida: 'J', formas: ['trabajo neto', 'trabajos netos'],
      def: 'Suma, con su signo, de los trabajos de todas las fuerzas sobre un cuerpo.',
      simple: 'Lo que queda al juntar lo que ayuda y lo que frena el avance.',
      ejemplos: ['El empujón trabaja 80 J y el rozamiento −30 J: quedan 50 J.', 'A rapidez constante, vale cero.', 'Si es positivo, el cuerpo termina más rápido.'],
      ver: ['energía cinética', 'fuerza neta'] },
    { termino: 'energía potencial gravitatoria', simbolo: 'E_PG', medida: 'J', formas: ['energía potencial gravitatoria', 'energías potenciales gravitatorias'],
      def: 'Energía de un cuerpo por su altura sobre una referencia: su peso por esa altura.',
      simple: 'La energía de algo por estar en alto, como una maceta en un balcón.',
      ejemplos: ['Un libro de 1 kg a 2 m del piso, medido desde el piso: 20 J.', 'Debajo de la referencia, es negativa.', 'Una piedra en el cerro tiene más que en la plaza.'],
      ver: ['nivel de referencia', 'peso'] },
    { termino: 'nivel de referencia', formas: ['nivel de referencia', 'niveles de referencia', 'referencia', 'referencias'],
      def: 'Nivel que se elige como altura cero para medir la energía potencial gravitatoria.',
      simple: 'El lugar desde donde decides medir las alturas, como el piso del aula.',
      ejemplos: ['El piso del aula.', 'La superficie de una mesa.', 'La azotea de un edificio.'],
      ver: ['energía potencial gravitatoria'] },
    { termino: 'energía potencial elástica', simbolo: 'E_PE', medida: 'J', formas: ['energía potencial elástica', 'energías potenciales elásticas'],
      def: 'Energía de un resorte estirado o comprimido: la mitad de k por su deformación al cuadrado.',
      simple: 'La energía que guarda un resorte apretado o estirado, como una honda tensa.',
      ejemplos: ['Un resorte de 200 N/m comprimido 0,1 m: 1 J.', 'Un resorte en su largo natural no guarda nada.', 'La honda estirada antes de soltar la piedra.'],
      ver: ['constante elástica', 'deformación'] },
    { termino: 'energía mecánica', simbolo: 'E_M', medida: 'J', formas: ['energía mecánica', 'energías mecánicas'],
      def: 'Suma de la energía cinética y las energías potenciales de un cuerpo.',
      simple: 'Toda la energía de movimiento y de altura junta, como la de un columpio.',
      ejemplos: ['Una pelota de 1 kg quieta, a 2 m del piso: 20 J.', 'Si además va a 2 m/s, suma 2 J: 22 J.', 'Un resorte apretado también le suma su energía.'],
      ver: ['energía cinética', 'energía potencial gravitatoria'] },
    { termino: 'superficie lisa', formas: ['superficie lisa', 'superficies lisas', 'liso', 'lisa', 'lisos', 'lisas'],
      def: 'En los problemas, una superficie sin rozamiento: nada frena lo que desliza sobre ella.',
      simple: 'Una superficie que no frena lo que resbala, como el hielo, casi.',
      ejemplos: ['El hielo, casi.', 'Un tobogán bien encerado.', 'En un examen, «plano liso» quiere decir sin rozamiento.'],
      ver: ['rozamiento cinético'] },
    { termino: 'fuerza conservativa', formas: ['fuerza conservativa', 'fuerzas conservativas'],
      def: 'Fuerza que devuelve la energía que quita, como el peso o la fuerza de un resorte.',
      simple: 'Una fuerza que devuelve lo que quita, como el peso al bajar.',
      ejemplos: ['El peso: quita energía al subir y la devuelve al bajar.', 'La fuerza de un resorte.', 'El rozamiento no lo es.'],
      ver: ['fuerza no conservativa', 'energía mecánica'] },
    { termino: 'fuerza no conservativa', formas: ['fuerza no conservativa', 'fuerzas no conservativas'],
      def: 'Fuerza cuyo trabajo no se recupera, como el rozamiento: lo que quita se vuelve calor.',
      simple: 'Una fuerza que se lleva energía y no la devuelve, como los frenos.',
      ejemplos: ['El rozamiento del piso.', 'El aire que frena a una ciclista.', 'Los frenos de un auto.'],
      ver: ['fuerza conservativa', 'energía disipada'] },
    { termino: 'energía disipada', medida: 'J', formas: ['energía disipada', 'energías disipadas'],
      def: 'Energía mecánica que el rozamiento convierte en calor.',
      simple: 'La energía que se escapa como calor; por eso se calientan los frenos.',
      ejemplos: ['Los frenos calientes después de una bajada.', 'Una caja llega abajo con 30 J de 50 J: se disiparon 20 J.', 'Las manos que se frotan y se calientan.'],
      ver: ['fuerza no conservativa', 'calor'] },
    { termino: 'potencia', simbolo: 'P', medida: 'W', formas: ['potencia', 'potencias'],
      def: 'Trabajo hecho en cada segundo: el trabajo entre el tiempo que toma.',
      simple: 'Qué tan rápido se hace un trabajo: subir corriendo pide más que subir despacio.',
      ejemplos: ['3000 J en 10 s: 300 W.', 'Subir la escalera corriendo pide más que subirla despacio.', 'Un motor de 2 kW hace 2000 J en cada segundo.'],
      ver: ['watt', 'eficiencia', 'trabajo'] },
    { termino: 'watt', formas: ['watt', 'watts'],
      def: 'Unidad de potencia: un joule en cada segundo.',
      simple: 'La unidad de qué tan rápido se trabaja; un foco LED usa unos diez.',
      ejemplos: ['1 W = 1 J/s.', 'Un foco LED de casa: unos 10 W.', '1 kW = 1000 W.'],
      ver: ['potencia', 'joule'] },
    { termino: 'eficiencia', simbolo: 'η', formas: ['eficiencia', 'eficiencias', 'rendimiento'],
      def: 'Fracción de lo que consume una máquina que sale como útil; nunca pasa de 1.',
      simple: 'Qué parte de lo que gasta una máquina aprovecha; lo demás la calienta.',
      ejemplos: ['Consume 1000 W y entrega 700 W: 0,7, es decir, 70 %.', 'Ninguna máquina llega al 100 %.', 'Lo que no aprovecha se vuelve calor.'],
      ver: ['potencia'] },
  ];
  const IDEAS = [trabajo, teorema, potencial, conservacion, rozamiento, potencia];
  // g en los Datos de todo ejercicio que la usa (lector en frío B, 20 nov): si una línea habla del peso o de m · g y
  // ninguna dice cuánto vale g, se agrega «g = 10 m/s²» al final. Vale para los ejemplos, «Así se resuelve» y «Ahora tú».
  const textoDe = x => (typeof x === 'string' ? x : Array.isArray(x) ? x.map(textoDe).join('') : x && x.t !== undefined ? String(x.t) : x && x.sub ? textoDe(x.sub[0]) + textoDe(x.sub[1]) : '');
  const conG = datos => { if (!Array.isArray(datos)) return datos; const t = datos.map(textoDe);
    return t.some(l => /m · g|peso/.test(l)) && !t.some(l => /g = 10 m\/s²/.test(l)) ? [...datos, D.g] : datos; };
  for (const idea of IDEAS) {
    for (const e of idea.ejemplos) e.datos = conG(e.datos);
    for (const k of ['resuelve', 'ahoraTu']) { const gen = idea[k].generar; idea[k].generar = function (sm) { const c = gen.call(this, sm); c.datos = conG(c.datos); return c; }; }
  }

  // Tabla de letras (propuesta §5): un solo significado en la unidad.
  const LETRAS = { F: 'fuerza de una mano, un motor o una cuerda', W: 'trabajo de una fuerza', W_F: 'trabajo de la fuerza F', W_peso: 'trabajo del peso', W_N: 'trabajo de la normal',
    W_f: 'trabajo del rozamiento', W_neto: 'trabajo neto: el de todas las fuerzas', d: 'distancia recorrida', 'θ': 'ángulo entre la fuerza y el avance',
    x: 'posición en la gráfica F–x; deformación de un resorte', m: 'masa', g: 'aceleración de la gravedad, 10 m/s²', h: 'altura sobre la referencia', v: 'rapidez (v₀, al empezar)',
    a: 'aceleración', t: 'tiempo', E_C: 'energía cinética', E_PG: 'energía potencial gravitatoria', E_PE: 'energía potencial elástica', E_M: 'energía mecánica', k: 'constante elástica',
    N: 'fuerza normal', f_k: 'rozamiento cinético', 'μ_k': 'coeficiente de rozamiento cinético', L: 'largo de una rampa', P: 'potencia', 'P_útil': 'potencia útil',
    P_consumida: 'potencia que consume una máquina', 'η': 'eficiencia' };

  return {
    unidad: 'fisica.trabajo-y-energia',
    version: '0.3.1',
    calidad: 2,
    estado: 'completa',
    colores: COLORES,
    notacion: { vectores: true, motivo: 'Las fuerzas y la velocidad son vectores: llevan flecha (F⃗, v⃗) cuando se habla de la flecha; el trabajo, la energía y la potencia son números con signo, sin flecha.' },
    letras: LETRAS,
    requiere: ['/nucleo/kit/piezas/fis-estatica.js', '/nucleo/kit/piezas/ejes.js'],
    glosario: GLOSARIO,
    laboratorio,
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov).
    laboratorioIdeas: { 'cuerda-libre': ['trabajo-y-angulo'], rampa: ['conservacion-energia', 'energia-y-rozamiento'], empujon: ['trabajo-energia-cinetica'] },
    historia: {
      texto: 'Comparar máquinas obligó a preguntar cuánto efecto útil daban y adónde iba lo que parecía perderse. En la década de 1840, Joule agitó agua con paletas movidas por pesas que bajaban y midió cómo subía su temperatura: el trabajo mecánico se volvía calor. Así se armó la idea de una energía que cambia de forma.',
      pregunta: '¿Adónde se va la energía que «se pierde» por rozamiento?',
      fuente: { titulo: 'Science Museum Group — réplica del calorímetro de Joule', url: 'https://collection.sciencemuseumgroup.org.uk/objects/co8404682/replica-of-calorimeter-used-by-james-joule' },
    },
    ideas: IDEAS,
  };
});
