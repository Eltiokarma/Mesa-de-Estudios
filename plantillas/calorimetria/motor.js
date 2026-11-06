/*
 * Motor de Calorimetría y cambios de fase.
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el
 * DOM: funciona igual en el navegador (window.MotorCalor) y en Node
 * (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades de examen: gramos, °C y calorías. Constantes por defecto (se pueden
 * cambiar con el argumento k de cada función):
 *   c del agua 1 cal/g°C, c del hielo 0,5, c del vapor 0,5,
 *   calor latente de fusión 80 cal/g, de vaporización 540 cal/g.
 *
 * Un cuerpo es uno de estos:
 *   { id:'h', sustancia:'agua', m:50, T:-10 }            // la fase sale de T
 *   { id:'h', sustancia:'agua', m:50, T:0, fase:'hielo' } // en 0 °C y 100 °C la fase es obligatoria
 *   { id:'met', m:300, c:0.2, T:120 }                     // sólido sin cambio de fase
 *   { id:'cal', C:40, T:20 }                              // capacidad calorífica (cal/°C), p. ej. el calorímetro
 * Fases del agua: 'hielo', 'liquido', 'vapor'.
 *
 * Método. Cada cuerpo tiene una energía H(T) medida desde un estado de
 * referencia (hielo a 0 °C para el agua; 0 °C para los demás). H crece con T y
 * es lineal por tramos: rampas (calor sensible, m·c) y, en el agua, dos
 * mesetas (a 0 °C, de ancho m·Lf, y a 100 °C, de ancho m·Lv) en las que entra
 * calor sin que cambie la temperatura. Sin pérdidas, la suma de H se conserva.
 * Para el equilibrio se mira si la energía total cae en una meseta (entonces
 * T = 0 °C o 100 °C, con dos fases juntas) o en una rampa (entonces T sale de
 * una ecuación lineal). No se itera: todo es exacto salvo el redondeo.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorCalor = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const CONSTANTES = Object.freeze({ cAgua: 1, cHielo: 0.5, cVapor: 0.5, Lf: 80, Lv: 540, Tf: 0, Te: 100 });
  const EPS = 1e-9;
  const kk = k => Object.assign({}, CONSTANTES, k || {});
  const esAgua = b => b.sustancia === 'agua';

  function capacidad(b) {
    if (b.C !== undefined) { const C = Number(b.C); if (!(C >= 0)) throw new Error(`${b.id}: capacidad inválida`); return C; }
    const m = Number(b.m), c = Number(b.c);
    if (!(m >= 0) || !(c >= 0)) throw new Error(`${b.id}: masa o calor específico inválido`);
    return m * c;
  }

  // Fase inicial del agua. En 0 °C y 100 °C se puede estar en dos fases: hay que decirla.
  function faseDe(b, k) {
    const T = Number(b.T);
    if (!Number.isFinite(T)) throw new Error(`${b.id}: temperatura inválida`);
    const f = b.fase;
    if (f !== undefined && !['hielo', 'liquido', 'vapor'].includes(f)) throw new Error(`${b.id}: fase desconocida "${f}"`);
    if (T < k.Tf - EPS) { if (f && f !== 'hielo') throw new Error(`${b.id}: a ${T} °C el agua es hielo`); return 'hielo'; }
    if (T > k.Te + EPS) { if (f && f !== 'vapor') throw new Error(`${b.id}: a ${T} °C el agua es vapor`); return 'vapor'; }
    if (Math.abs(T - k.Tf) <= EPS || Math.abs(T - k.Te) <= EPS) {
      if (!f) throw new Error(`${b.id}: a ${T} °C hay que decir la fase (hielo, liquido o vapor)`);
      if (Math.abs(T - k.Tf) <= EPS && f === 'vapor') throw new Error(`${b.id}: no hay vapor a 0 °C en este modelo`);
      if (Math.abs(T - k.Te) <= EPS && f === 'hielo') throw new Error(`${b.id}: no hay hielo a 100 °C`);
      return f;
    }
    if (f && f !== 'liquido') throw new Error(`${b.id}: a ${T} °C el agua es líquida`);
    return 'liquido';
  }

  // Energía por gramo de agua, desde hielo a 0 °C.
  function hAgua(T, fase, k) {
    if (fase === 'hielo') return k.cHielo * (T - k.Tf);
    if (fase === 'liquido') return k.Lf + k.cAgua * (T - k.Tf);
    return k.Lf + k.cAgua * (k.Te - k.Tf) + k.Lv + k.cVapor * (T - k.Te);
  }
  // Bordes de las mesetas, por gramo.
  function bordes(k) {
    const a = 0, b = k.Lf, c = k.Lf + k.cAgua * (k.Te - k.Tf), d = c + k.Lv;
    return { a, b, c, d };
  }
  // Estado de un gramo de agua con energía h: temperatura y fracciones de cada fase.
  function deH(h, k) {
    const { a, b, c, d } = bordes(k);
    if (h < a - EPS) return { T: k.Tf + h / k.cHielo, hielo: 1, liquido: 0, vapor: 0 };
    if (h <= b + EPS) { const x = clamp01((h - a) / (b - a || 1)); return { T: k.Tf, hielo: 1 - x, liquido: x, vapor: 0 }; }
    if (h < c - EPS) return { T: k.Tf + (h - b) / k.cAgua, hielo: 0, liquido: 1, vapor: 0 };
    if (h <= d + EPS) { const y = clamp01((h - c) / (d - c || 1)); return { T: k.Te, hielo: 0, liquido: 1 - y, vapor: y }; }
    return { T: k.Te + (h - d) / k.cVapor, hielo: 0, liquido: 0, vapor: 1 };
  }
  const clamp01 = x => Math.max(0, Math.min(1, x));

  // Energía de un cuerpo en su estado inicial.
  function energia(b, k) {
    k = kk(k);
    if (esAgua(b)) { masa(b); return b.m * hAgua(Number(b.T), faseDe(b, k), k); }
    return capacidad(b) * Number(b.T);
  }
  function masa(b) { const m = Number(b.m); if (!(m >= 0)) throw new Error(`${b.id}: masa inválida`); return m; }

  // Estado de un cuerpo con energía H (inversa de energia).
  function estadoDe(b, H, k) {
    if (esAgua(b)) {
      if (b.m === 0) return { T: NaN, hielo: 0, liquido: 0, vapor: 0 };
      const s = deH(H / b.m, k);
      return { T: s.T, hielo: s.hielo * b.m, liquido: s.liquido * b.m, vapor: s.vapor * b.m };
    }
    const C = capacidad(b);
    return { T: C > 0 ? H / C : NaN };
  }

  // Agrega Q calorías a un cuerpo (Q negativo: lo enfría). Devuelve su nuevo estado.
  function agregarCalor(b, Q, k) {
    k = kk(k);
    return estadoDe(b, energia(b, k) + Number(Q), k);
  }

  // Calor que hay que darle a un cuerpo para llevarlo a la temperatura T y la fase dada
  // (negativo si hay que quitárselo). La fase solo hace falta en 0 °C y 100 °C.
  function calorNecesario(b, T, fase, k) {
    k = kk(k);
    const fin = Object.assign({}, b, { T, fase });
    if (!esAgua(b)) delete fin.fase;
    return energia(fin, k) - energia(b, k);
  }

  // Equilibrio térmico de una lista de cuerpos aislados del ambiente.
  function equilibrio(cuerpos, k) {
    k = kk(k);
    if (!Array.isArray(cuerpos) || !cuerpos.length) throw new Error('hace falta al menos un cuerpo');
    const ids = new Set();
    for (const b of cuerpos) { if (!b.id || ids.has(b.id)) throw new Error(`id repetido o vacío: ${b.id}`); ids.add(b.id); }
    const H0 = cuerpos.map(b => energia(b, k));
    const total = H0.reduce((s, x) => s + x, 0);
    const agua = cuerpos.filter(esAgua), otros = cuerpos.filter(b => !esAgua(b));
    const M = agua.reduce((s, b) => s + b.m, 0), Cotros = otros.reduce((s, b) => s + capacidad(b), 0);
    const { b: hb, c: hc, d: hd } = bordes(k);
    // Energía total si todos estuvieran a T, con el agua en el borde bajo (min) o alto (max) de una meseta.
    const Hmin0 = Cotros * k.Tf, Hmax0 = M * hb + Cotros * k.Tf;
    const Hmin100 = M * hc + Cotros * k.Te, Hmax100 = M * hd + Cotros * k.Te;
    const tol = EPS * Math.max(1, Math.abs(total));
    let T, meseta = null;
    if (total < Hmin0 - tol) T = k.Tf + (total - Hmin0) / (M * k.cHielo + Cotros);
    else if (total <= Hmax0 + tol) { T = k.Tf; meseta = 'fusion'; }
    else if (total < Hmin100 - tol) T = k.Tf + (total - Hmax0) / (M * k.cAgua + Cotros);
    else if (total <= Hmax100 + tol) { T = k.Te; meseta = 'ebullicion'; }
    else T = k.Te + (total - Hmax100) / (M * k.cVapor + Cotros);
    if (!Number.isFinite(T)) throw new Error('no se puede hallar el equilibrio (capacidad total cero)');

    // Energía final de cada cuerpo. En una meseta, cada cuerpo cambia de fase lo menos posible:
    // primero todos llegan a la temperatura de la meseta sin cambiar de fase y luego la energía
    // que sobra (o falta) funde (o congela) a los que estaban en la fase que cambia.
    const Hf = cuerpos.map(b => {
      if (!esAgua(b)) return capacidad(b) * T;
      if (!meseta) return b.m * hAgua(T, T < k.Tf ? 'hielo' : T > k.Te ? 'vapor' : 'liquido', k);
      return null;
    });
    if (meseta) {
      const Tm = meseta === 'fusion' ? k.Tf : k.Te;
      const [lo, hi] = meseta === 'fusion' ? [0, hb] : [hc, hd];
      const fria = b => (meseta === 'fusion' ? faseDe(b, k) === 'hielo' : faseDe(b, k) !== 'vapor');
      cuerpos.forEach((b, j) => { if (esAgua(b)) Hf[j] = b.m * (fria(b) ? lo : hi); });
      let resto = total - cuerpos.reduce((s, b, j) => s + (esAgua(b) ? Hf[j] : capacidad(b) * Tm), 0);
      const grupo = cuerpos.map((b, j) => j).filter(j => esAgua(cuerpos[j]) && (resto >= 0 ? fria(cuerpos[j]) : !fria(cuerpos[j])));
      const mg = grupo.reduce((s, j) => s + cuerpos[j].m, 0);
      for (const j of grupo) Hf[j] += mg > 0 ? resto * cuerpos[j].m / mg : 0;
    }
    const salida = { T, meseta, hielo: 0, liquido: 0, vapor: 0, intercambiado: 0, cuerpos: {} };
    cuerpos.forEach((b, j) => {
      const s = estadoDe(b, Hf[j], k);
      if (!esAgua(b)) s.T = T;
      s.Q = Hf[j] - H0[j];
      if (s.Q > 0) salida.intercambiado += s.Q;
      if (esAgua(b)) { salida.hielo += s.hielo; salida.liquido += s.liquido; salida.vapor += s.vapor; }
      salida.cuerpos[b.id] = s;
    });
    return salida;
  }

  // Tramos que recorre un cuerpo de agua entre su estado inicial y uno final (dado por su energía o
  // por un estado {T, fase}): calentar hielo, fundir, calentar agua, hervir, calentar vapor (o al revés).
  // Cada tramo: { tipo:'sensible'|'latente', fase, nombre, desde, hasta, Q } con Q con signo.
  function tramos(b, final, k) {
    k = kk(k);
    const H1 = typeof final === 'number' ? final : energia(Object.assign({}, b, final), k);
    const H0 = energia(b, k);
    if (!esAgua(b)) {
      const C = capacidad(b);
      return Math.abs(H1 - H0) < EPS ? [] : [{ tipo: 'sensible', fase: 'solido', nombre: H1 > H0 ? 'calentar' : 'enfriar', desde: H0 / C, hasta: H1 / C, Q: H1 - H0 }];
    }
    const m = b.m, { a, b: hb, c, d } = bordes(k);
    const segs = [
      { lo: -Infinity, hi: a, tipo: 'sensible', fase: 'hielo', sube: 'calentar el hielo', baja: 'enfriar el hielo' },
      { lo: a, hi: hb, tipo: 'latente', fase: 'fusion', sube: 'fundir', baja: 'congelar' },
      { lo: hb, hi: c, tipo: 'sensible', fase: 'liquido', sube: 'calentar el agua', baja: 'enfriar el agua' },
      { lo: c, hi: d, tipo: 'latente', fase: 'ebullicion', sube: 'hervir', baja: 'condensar' },
      { lo: d, hi: Infinity, tipo: 'sensible', fase: 'vapor', sube: 'calentar el vapor', baja: 'enfriar el vapor' },
    ];
    const h0 = H0 / m, h1 = H1 / m, sube = h1 >= h0, lo = Math.min(h0, h1), hi = Math.max(h0, h1);
    const lista = [];
    for (const s of segs) {
      const x = Math.max(lo, s.lo), y = Math.min(hi, s.hi);
      if (y - x <= EPS) continue;
      const [p, q] = sube ? [x, y] : [y, x];
      lista.push({ tipo: s.tipo, fase: s.fase, nombre: sube ? s.sube : s.baja,
        desde: deH(p, k).T, hasta: deH(q, k).T, Q: m * (q - p) });
    }
    return sube ? lista : lista.reverse();
  }

  // Curva de calentamiento (o enfriamiento): puntos [Q, T] al agregar de 0 a Q calorías,
  // con un punto en cada cambio de tramo. Q negativo: calor que se quita.
  function curva(b, Q, k) {
    k = kk(k);
    const H0 = energia(b, k), pts = [[0, estadoDe(b, H0, k).T]];
    let q = 0;
    for (const t of tramos(b, H0 + Q, k)) { q += t.Q; pts.push([q, t.hasta]); }
    if (pts.length === 1 && Q !== 0) pts.push([Q, estadoDe(b, H0 + Q, k).T]);
    return pts;
  }

  // Punto de ebullición del agua según la altitud (modelo aproximado, para comparar lugares):
  // presión de la atmósfera estándar (ISA, troposfera) y ecuación de Antoine para el agua
  // (constantes en mmHg y °C, válidas entre 1 °C y 100 °C).
  function presionAltitud(h) { return 101325 * Math.pow(1 - 2.25577e-5 * h, 5.25588); }
  function ebullicion(altitud) {
    const P = presionAltitud(Number(altitud) || 0), mmHg = P / 133.322;
    const A = 8.07131, B = 1730.63, C = 233.426;
    return { P, mmHg, T: B / (A - Math.log10(mmHg)) - C };
  }

  // Temperatura de contacto entre la piel y un objeto: la que siente la mano al tocarlo.
  // Sale de las efusividades e = √(k·ρ·c) (W·s^½/m²K): mientras más alta, más calor saca de la mano.
  // Valores aproximados de tablas de propiedades; sirven para comparar, no para medir.
  const EFUSIVIDAD = Object.freeze({ piel: 1100, aluminio: 24000, acero: 14000, vidrio: 1500, madera: 400, lana: 60, aire: 6 });
  function contacto(T1, e1, T2, e2) { return (e1 * T1 + e2 * T2) / (e1 + e2); }
  // Calor que pasa por segundo de la mano al objeto, por unidad de "facilidad" (proporcional, sin unidades):
  // sirve para dibujar el grosor de la flecha. Positivo: sale de la mano.
  function flujoDesdeMano(Tmano, Tobj, eObj, eMano) {
    eMano = eMano || EFUSIVIDAD.piel;
    return (Tmano - Tobj) * eMano * eObj / (eMano + eObj);
  }

  return { CONSTANTES, EFUSIVIDAD, energia, agregarCalor, calorNecesario, equilibrio, tramos, curva,
    presionAltitud, ebullicion, contacto, flujoDesdeMano };
});
