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
 *
 * ---- Desde la versión 0.2.0 (dilatación y transferencia de calor) ----
 * Unidades: las de cada enunciado en dilatación (cm, cm², cm³ o m; °C); SI en transferencia (W, m, m², K
 * o °C para diferencias). Ninguna función de arriba cambió. Cada función que alimenta una predicción
 * devuelve `errores`: lo que daría cada error típico (código del informe o de la escena → valor).
 * Tablas, de examen y redondeadas (no son de laboratorio):
 *   MATERIALES: α (1/°C) y k (W/(m·K)): acero α 1,2e-5 k 50; aluminio 2,4e-5 k 200 (la tabla real da 237;
 *     el examen usa 200); cobre 1,7e-5 k 400; latón 2,0e-5 k 110; vidrio 9e-6 k 0,8; pyrex 3,2e-6;
 *     cuarzo 5e-7; invar 1,2e-6; madera k 0,12; lana k 0,04; aire k 0,026.
 *   LIQUIDOS: γ (1/°C): mercurio 1,8e-4; gasolina 9,5e-4.  SIGMA = 5,67e-8 W/(m²·K⁴).
 *   EFUSIVIDAD.hielo = 2000 (se suma a la tabla de efusividades de abajo).
 * Dilatación (n = 1, 2 o 3 según tipo 'lineal', 'superficial' o 'volumetrica'):
 *   dilatacion({ tipo, inicial, alfa, dT })  (o T0 y Tf en lugar de dT; opcionales lados:[a, b] y ref)
 *     → { n, coef = n·α, delta = inicial·n·α·ΔT, final = inicial + delta, exacta = inicial·(1 + αΔT)^n,
 *         deltaExacta = exacta − inicial, errores }. errores: 'DL-usa-T-final' = inicial·n·α·Tf (si hay Tf);
 *     n = 1 con ref (largo de otro objeto): 'DL1-no-depende-de-l0' = ref·α·ΔT, 'DL1-cuadrado' = esa misma
 *     cifra por (inicial/ref)²; n = 2: 'D2-alfa-para-area' = inicial·α·ΔT, 'D2-tres-alfa-para-area' =
 *     inicial·3α·ΔT y, con lados, 'D2-producto-de-estiramientos' = (a·α·ΔT)(b·α·ΔT); n = 3:
 *     'D2-alfa-para-volumen' = inicial·α·ΔT.
 *   ajusteAnillo({ D0, Dobjetivo, alfa, T0 }) → { dT = (Dobjetivo − D0)/(D0·α), T = T0 + dT, Dagujero(T),
 *     errores: 'DL-da-dT-como-T' = dT, 'DL-divide-entre-final' = T0 + (Dobjetivo − D0)/(Dobjetivo·α),
 *     'Q11-agujero-se-achica' = D0·(1 − α·dT) }.
 *   agujero({ D0, alfa, dT }) → { D = D0(1 + αΔT), disco (un disco del mismo metal: el mismo D),
 *     errores: 'Q11-agujero-se-achica' = D0(1 − αΔT), 'DL3-no-cambia' = D0 }.
 *   bimetalica({ alfaA, alfaB, ell, espesor, dT }): dos láminas pegadas, A arriba y B abajo, de igual
 *     espesor y rigidez (Timoshenko); espesor es el total. kappa = 3(αA − αB)ΔT/(2·espesor) (1/m;
 *     positivo: se curva hacia B), R = 1/|kappa|, theta = ell·kappa (rad), flecha = (1 − cos θ)/kappa (con
 *     signo; 0 si kappa = 0), convexa ('A' o 'B': la que queda por fuera), haciaLado (la otra),
 *     punto(s, factor) = { x, y } a lo largo s de la tira, con la curvatura multiplicada por factor
 *     (y positivo hacia B). errores: 'DL4-hacia-mayor-alfa' = el lado contrario, 'DL4-sigue-recta' = 0,
 *     'DL4-depende-del-fuego' = 'depende'.
 *   densidadAgua(T): agua líquida entre 0 y 100 °C, kg/m³, fórmula de Kell (1975):
 *     (999,83952 + 16,945176T − 7,9870401e-3T² − 46,170461e-6T³ + 105,56302e-9T⁴ − 280,54253e-12T⁵)
 *     /(1 + 16,879850e-3T); fuera de [0, 100] lanza un error. DENSIDAD_HIELO = 917 kg/m³.
 *     volumenAgua(m, T) = m/(ρ/1000), m en g y el volumen en cm³. TEMPERATURA_MAXIMA_DENSIDAD (≈ 3,98 °C,
 *     búsqueda ternaria); maximoDensidad() → { T, densidad }. densidadIgual(T): la otra temperatura de
 *     [0, 100] con la misma densidad (la misma cantidad de agua vuelve a ocupar el mismo volumen).
 *   nivelFrasco({ V0 o m, liquido, alfaFrasco, T0, T, gamma }): cuánto sube (+) o baja (−), en cm³, el
 *     líquido sobre la marca. Agua: m/ρ(T) − V0(1 + 3α(T − T0)), con m = V0·ρ(T0) (o la m dada, en g, y
 *     V0 = m/ρ(T0)); errores 'DL5-sube-siempre' = V0·2,1e-4·(T − T0), 'DL5-no-cambia' = 0. Otro
 *     líquido: V0(γ − 3α)(T − T0). minimoFrasco({ ...lo mismo, Tmax }) → { T, nivel }: el nivel más bajo
 *     entre T0 y Tmax.
 *   derrame({ V0, gamma, alfaRecipiente, dT }) → { derrame = V0(γ − 3α)ΔT (negativo: el nivel baja),
 *     errores: 'DL-ignora-recipiente' = V0γΔT, 'D2-alfa-para-volumen' = V0(γ − α)ΔT,
 *     'DL-suma-recipiente' = V0(γ + 3α)ΔT }.
 * Transferencia:
 *   conduccion({ k, A, ell, T1, T2, ref:{ ell } }) → { flujo = kA(T1 − T2)/ell (W, de 1 a 2),
 *     resistencia = ell/(kA), gradiente = (T1 − T2)/ell, errores: 'TC-multiplica-por-l' = kAΔT·ell,
 *     'TC-sin-area' = kΔT/ell y, con ref (la misma barra con otro largo ref.ell, flujo de referencia F0):
 *     'TC2-mas-largo-mas-calor' = F0·ell/ref.ell, 'TC2-no-depende-de-l' = F0, 'TC2-cuadrado' =
 *     F0·(ref.ell/ell)² }.
 *   serie({ capas:[{ k, ell }], A, T1, T2 }) → { R = Σ ell_i/(k_i A), resistencias, flujo = (T1 − T2)/R,
 *     uniones (T en cada unión, de 1 a 2), caidas (flujo·R_i), perfil(x) (T a x metros del extremo 1),
 *     errores (dos capas): 'TC3-union-en-el-promedio' = (T1 + T2)/2, 'TC3-al-reves' = la unión con las
 *     resistencias intercambiadas, 'TC3-toda-la-caida-en-el-peor' = T1, 'TC-suma-k' = (k1 + k2)A(T1 −
 *     T2)/(ell1 + ell2), 'TC-ignora-largos' = (k1T1 + k2T2)/(k1 + k2) }.
 *   hieloSobre(material, Taula): modelo de contacto para comparar, no para medir: flujo = e_m·e_h/(e_m +
 *     e_h)·(Taula − 0), con e de EFUSIVIDAD (hielo 2000); Tcontacto = contacto(Taula, e_m, 0, e_h);
 *     tiempoRelativo = flujo del aluminio / flujo (1 en el aluminio). errores (textos): 'Q2-madera-primero'
 *     y 'Q6-calor-guardado' = 'madera', 'TC1-al-mismo-tiempo' = 'igual'.
 *   enfriamiento({ T0, Tamb, tau, t, otra }) (Newton; t y tau en min): T = Tamb + (T0 − Tamb)e^(−t/τ),
 *     ritmo = (T − Tamb)/τ (°C/min); con otra (T0 de otra taza igual): errores 'Q10-mismo-ritmo' = el
 *     ritmo de la otra, 'TC4-la-tibia-primero' = la menor de las dos T0, 'TC4-primero-calienta-la-taza' = 0.
 *     curvaEnfriamiento(T0, Tamb, tau, tmax, n) = n + 1 puntos [t, T]; tiempoHasta({ T0, Tamb, tau, T }).
 *   conveccion(x, y, W, H): velocidad { vx, vy } de dos celdas en una olla de ancho W y alto H (y hacia
 *     arriba desde el fondo): ψ = sin(2πx/W)·sin(πy/H), vx = ∂ψ/∂y, vy = −∂ψ/∂x (sube por el centro).
 *   radiacion({ e, A, Tc, k:{ Kelvin } }) → P = e·σ·A·(Tc + Kelvin)⁴ (Kelvin 273,15 por defecto).
 *     razonRadiacion(T1c, T2c) → { razon = ((T2c + 273)/(T1c + 273))⁴, errores: 'TR7-lineal-kelvin' =
 *     T2K/T1K, 'TR7-lineal-celsius' = T2c/T1c, 'TR7-cuarta-celsius' = (T2c/T1c)⁴ }.
 *     perdidaNocturna({ Tsuelo, Tcielo, e }) = e·σ·(Ts⁴ − Tc⁴) en W/m², temperaturas en K (cielo despejado
 *     del altiplano: «cielo efectivo» de −40 °C; nublado: base de la nube a −10 °C; suposiciones del modelo).
 * Calorimetría, para las predicciones:
 *   prediccionMezcla(hielo, agua, k) → { T, meseta, hielo, liquido, errores: 'Q7-olvida-calor-latente' =
 *     T con Lf = 0, 'Q4-promedio-simple' = (Th + Ta)/2, 'Q8-no-revisa-si-alcanza' = el régimen equivocado
 *     (si todo se funde, 0 °C; si no alcanza, la ecuación de siempre con todo líquido), 'ecuacion-de-siempre'
 *     = esa ecuación (todo líquido al final), 'funde-todo-justo' = 0 }.
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
  const EFUSIVIDAD = Object.freeze({ piel: 1100, aluminio: 24000, acero: 14000, vidrio: 1500, madera: 400, lana: 60, aire: 6, hielo: 2000 });
  function contacto(T1, e1, T2, e2) { return (e1 * T1 + e2 * T2) / (e1 + e2); }
  // Calor que pasa por segundo de la mano al objeto, por unidad de "facilidad" (proporcional, sin unidades):
  // sirve para dibujar el grosor de la flecha. Positivo: sale de la mano.
  function flujoDesdeMano(Tmano, Tobj, eObj, eMano) {
    eMano = eMano || EFUSIVIDAD.piel;
    return (Tmano - Tobj) * eMano * eObj / (eMano + eObj);
  }


  /* ================= 0.2.0: dilatación ================= */
  const MATERIALES = Object.freeze({
    acero: Object.freeze({ alfa: 1.2e-5, k: 50 }), aluminio: Object.freeze({ alfa: 2.4e-5, k: 200 }),
    cobre: Object.freeze({ alfa: 1.7e-5, k: 400 }), laton: Object.freeze({ alfa: 2.0e-5, k: 110 }),
    vidrio: Object.freeze({ alfa: 9e-6, k: 0.8 }), pyrex: Object.freeze({ alfa: 3.2e-6 }),
    cuarzo: Object.freeze({ alfa: 5e-7 }), invar: Object.freeze({ alfa: 1.2e-6 }),
    madera: Object.freeze({ k: 0.12 }), lana: Object.freeze({ k: 0.04 }), aire: Object.freeze({ k: 0.026 }) });
  const LIQUIDOS = Object.freeze({ mercurio: Object.freeze({ gamma: 1.8e-4 }), gasolina: Object.freeze({ gamma: 9.5e-4 }) });
  const SIGMA = 5.67e-8;
  const num = (x, que) => { const v = Number(x); if (!Number.isFinite(v)) throw new Error(`${que} inválido`); return v; };
  const N_TIPO = { lineal: 1, superficial: 2, volumetrica: 3 };

  function dilatacion(o) {
    const n = N_TIPO[o.tipo || 'lineal'];
    if (!n) throw new Error(`tipo de dilatación desconocido "${o.tipo}"`);
    const ini = num(o.inicial, 'inicial'), a = num(o.alfa, 'alfa');
    const dT = o.dT !== undefined ? num(o.dT, 'dT') : num(o.Tf, 'Tf') - num(o.T0, 'T0');
    const delta = ini * n * a * dT, exacta = ini * Math.pow(1 + a * dT, n);
    const errores = {};
    if (o.Tf !== undefined) errores['DL-usa-T-final'] = ini * n * a * Number(o.Tf);
    if (n === 1 && o.ref !== undefined) {
      const dref = num(o.ref, 'ref') * a * dT;
      errores['DL1-no-depende-de-l0'] = dref;
      errores['DL1-cuadrado'] = dref * Math.pow(ini / o.ref, 2);
    }
    if (n === 2) {
      errores['D2-alfa-para-area'] = ini * a * dT;
      errores['D2-tres-alfa-para-area'] = ini * 3 * a * dT;
      if (Array.isArray(o.lados)) errores['D2-producto-de-estiramientos'] = (o.lados[0] * a * dT) * (o.lados[1] * a * dT);
    }
    if (n === 3) errores['D2-alfa-para-volumen'] = ini * a * dT;
    return { n, coef: n * a, dT, delta, final: ini + delta, exacta, deltaExacta: exacta - ini, errores };
  }

  function ajusteAnillo(o) {
    const D0 = num(o.D0, 'D0'), Dobj = num(o.Dobjetivo, 'Dobjetivo'), a = num(o.alfa, 'alfa'), T0 = num(o.T0, 'T0');
    const dT = (Dobj - D0) / (D0 * a);
    return { dT, T: T0 + dT, Dagujero: T => D0 * (1 + a * (T - T0)),
      errores: { 'DL-da-dT-como-T': dT, 'DL-divide-entre-final': T0 + (Dobj - D0) / (Dobj * a), 'Q11-agujero-se-achica': D0 * (1 - a * dT) } };
  }

  function agujero(o) {
    const D0 = num(o.D0, 'D0'), a = num(o.alfa, 'alfa'), dT = num(o.dT, 'dT');
    const D = D0 * (1 + a * dT);
    return { D, disco: D0 * (1 + a * dT), errores: { 'Q11-agujero-se-achica': D0 * (1 - a * dT), 'DL3-no-cambia': D0 } };
  }

  function bimetalica(o) {
    const aA = num(o.alfaA, 'alfaA'), aB = num(o.alfaB, 'alfaB'), ell = num(o.ell, 'ell'), e = num(o.espesor, 'espesor'), dT = num(o.dT, 'dT');
    if (!(e > 0)) throw new Error('espesor inválido');
    const kappa = 3 * (aA - aB) * dT / (2 * e) + 0;
    const theta = ell * kappa;
    const flecha = kappa === 0 ? 0 : (1 - Math.cos(theta)) / kappa;
    const convexa = kappa > 0 ? 'A' : kappa < 0 ? 'B' : null, haciaLado = kappa > 0 ? 'B' : kappa < 0 ? 'A' : null;
    // Punto a lo largo s de la tira (desde el extremo sujeto), con la curvatura exagerada por factor.
    const punto = (s, factor) => {
      const kk2 = kappa * (factor === undefined ? 1 : factor);
      if (Math.abs(kk2) < 1e-12) return { x: s, y: 0, angulo: 0 };
      return { x: Math.sin(kk2 * s) / kk2, y: (1 - Math.cos(kk2 * s)) / kk2, angulo: kk2 * s };
    };
    return { kappa, R: kappa === 0 ? Infinity : 1 / Math.abs(kappa), theta, flecha, convexa, haciaLado, punto,
      errores: { 'DL4-hacia-mayor-alfa': convexa, 'DL4-sigue-recta': 0, 'DL4-depende-del-fuego': 'depende' } };
  }

  // Densidad del agua líquida (Kell, 1975), en kg/m³.
  function densidadAgua(T) {
    T = Number(T);
    if (!(T >= 0 && T <= 100)) throw new Error(`densidadAgua: ${T} °C fuera de 0 a 100 °C`);
    return (999.83952 + 16.945176 * T - 7.9870401e-3 * T * T - 46.170461e-6 * T ** 3 + 105.56302e-9 * T ** 4 - 280.54253e-12 * T ** 5)
      / (1 + 16.879850e-3 * T);
  }
  const DENSIDAD_HIELO = 917;
  const volumenAgua = (m, T) => Number(m) / (densidadAgua(T) / 1000);
  // Búsqueda ternaria del máximo de una función unimodal en [a, b] (o del mínimo, con signo −1).
  function ternaria(f, a, b, signo) {
    for (let j = 0; j < 200; j++) {
      const m1 = a + (b - a) / 3, m2 = b - (b - a) / 3;
      if (signo * f(m1) < signo * f(m2)) a = m1; else b = m2;
    }
    return (a + b) / 2;
  }
  const TEMPERATURA_MAXIMA_DENSIDAD = ternaria(densidadAgua, 0, 20, 1);
  const maximoDensidad = () => ({ T: TEMPERATURA_MAXIMA_DENSIDAD, densidad: densidadAgua(TEMPERATURA_MAXIMA_DENSIDAD) });
  // La otra temperatura con la misma densidad que T (al otro lado del máximo).
  function densidadIgual(T) {
    const r = densidadAgua(T), Tm = TEMPERATURA_MAXIMA_DENSIDAD;
    let a, b;
    if (T <= Tm) { a = Tm; b = 100; } else { a = 0; b = Tm; }
    if (T <= Tm && densidadAgua(100) > r) return NaN;
    for (let j = 0; j < 200; j++) {
      const m = (a + b) / 2, bajo = densidadAgua(m) < r;
      // A la derecha del máximo la densidad baja con T; a la izquierda, sube.
      if ((T <= Tm) === bajo) b = m; else a = m;
    }
    return (a + b) / 2;
  }

  function nivelFrasco(o) {
    const T0 = num(o.T0, 'T0'), T = num(o.T, 'T'), a = num(o.alfaFrasco || 0, 'alfaFrasco');
    if ((o.liquido || 'agua') === 'agua') {
      const m = o.m !== undefined ? num(o.m, 'm') : num(o.V0, 'V0') * densidadAgua(T0) / 1000;
      const V0 = o.V0 !== undefined ? num(o.V0, 'V0') : volumenAgua(m, T0);
      const nivel = volumenAgua(m, T) - V0 * (1 + 3 * a * (T - T0));
      return { nivel, V0, volumen: volumenAgua(m, T), frasco: V0 * (1 + 3 * a * (T - T0)),
        errores: { 'DL5-sube-siempre': V0 * 2.1e-4 * (T - T0), 'DL5-no-cambia': 0 } };
    }
    const g = o.gamma !== undefined ? num(o.gamma, 'gamma') : LIQUIDOS[o.liquido].gamma, V0 = num(o.V0, 'V0');
    return { nivel: V0 * (g - 3 * a) * (T - T0), V0, errores: {} };
  }
  function minimoFrasco(o) {
    const f = T => nivelFrasco(Object.assign({}, o, { T })).nivel;
    const T = ternaria(f, num(o.T0, 'T0'), num(o.Tmax, 'Tmax'), -1);
    return { T, nivel: f(T) };
  }

  function derrame(o) {
    const V0 = num(o.V0, 'V0'), g = num(o.gamma, 'gamma'), a = num(o.alfaRecipiente, 'alfaRecipiente'), dT = num(o.dT, 'dT');
    return { derrame: V0 * (g - 3 * a) * dT, liquido: V0 * g * dT, recipiente: V0 * 3 * a * dT,
      errores: { 'DL-ignora-recipiente': V0 * g * dT, 'D2-alfa-para-volumen': V0 * (g - a) * dT, 'DL-suma-recipiente': V0 * (g + 3 * a) * dT } };
  }

  /* ================= 0.2.0: transferencia de calor ================= */
  function conduccion(o) {
    const k = num(o.k, 'k'), A = num(o.A, 'A'), ell = num(o.ell, 'ell'), dT = num(o.T1, 'T1') - num(o.T2, 'T2');
    if (!(ell > 0) || !(k > 0) || !(A > 0)) throw new Error('conducción: k, A y ell deben ser positivos');
    const errores = { 'TC-multiplica-por-l': k * A * dT * ell, 'TC-sin-area': k * dT / ell };
    if (o.ref && o.ref.ell !== undefined) {
      const F0 = k * A * dT / num(o.ref.ell, 'ref.ell');
      errores['TC2-mas-largo-mas-calor'] = F0 * ell / o.ref.ell;
      errores['TC2-no-depende-de-l'] = F0;
      errores['TC2-cuadrado'] = F0 * Math.pow(o.ref.ell / ell, 2);
    }
    return { flujo: k * A * dT / ell, resistencia: ell / (k * A), gradiente: dT / ell, errores };
  }

  function serie(o) {
    const A = num(o.A, 'A'), T1 = num(o.T1, 'T1'), T2 = num(o.T2, 'T2');
    if (!Array.isArray(o.capas) || !o.capas.length) throw new Error('serie: hacen falta capas');
    const capas = o.capas.map((c, j) => ({ k: num(c.k, `capa ${j} k`), ell: num(c.ell, `capa ${j} ell`) }));
    const resistencias = capas.map(c => c.ell / (c.k * A));
    const R = resistencias.reduce((s, r) => s + r, 0), flujo = (T1 - T2) / R;
    const caidas = resistencias.map(r => flujo * r);
    const uniones = []; let acum = 0;
    for (let j = 0; j < capas.length - 1; j++) { acum += resistencias[j]; uniones.push(T1 - flujo * acum); }
    const bordes = [0]; capas.forEach(c => bordes.push(bordes[bordes.length - 1] + c.ell));
    const temps = [T1, ...uniones, T2];
    const perfil = x => {
      if (x <= 0) return T1;
      for (let j = 0; j < capas.length; j++) if (x <= bordes[j + 1]) return temps[j] - (temps[j] - temps[j + 1]) * (x - bordes[j]) / capas[j].ell;
      return T2;
    };
    const errores = {};
    if (capas.length === 2) {
      const [c1, c2] = capas, [r1, r2] = resistencias;
      errores['TC3-union-en-el-promedio'] = (T1 + T2) / 2;
      errores['TC3-al-reves'] = T1 - (T1 - T2) * r2 / (r1 + r2);
      errores['TC3-toda-la-caida-en-el-peor'] = r1 > r2 ? T2 : T1;
      errores['TC-suma-k'] = (c1.k + c2.k) * A * (T1 - T2) / (c1.ell + c2.ell);
      errores['TC-ignora-largos'] = (c1.k * T1 + c2.k * T2) / (c1.k + c2.k);
    }
    return { R, resistencias, flujo, uniones, caidas, bordes, perfil, errores };
  }

  function hieloSobre(material, Taula) {
    const em = EFUSIVIDAD[material], eh = EFUSIVIDAD.hielo;
    if (!em) throw new Error(`material sin efusividad: ${material}`);
    const T = num(Taula, 'Taula');
    const f = m => EFUSIVIDAD[m] * eh / (EFUSIVIDAD[m] + eh) * T;
    const flujo = f(material);
    return { flujo, Tcontacto: contacto(T, em, 0, eh), tiempoRelativo: flujo === 0 ? Infinity : f('aluminio') / flujo,
      errores: { 'Q2-madera-primero': 'madera', 'TC1-al-mismo-tiempo': 'igual', 'Q6-calor-guardado': 'madera' } };
  }

  function enfriamiento(o) {
    const T0 = num(o.T0, 'T0'), Ta = num(o.Tamb, 'Tamb'), tau = num(o.tau, 'tau'), t = num(o.t || 0, 't');
    if (!(tau > 0)) throw new Error('tau inválido');
    const T = Ta + (T0 - Ta) * Math.exp(-t / tau), ritmo = (T - Ta) / tau;
    const r = { T, ritmo, errores: {} };
    if (o.otra !== undefined) {
      const otra = num(o.otra, 'otra');
      r.errores['Q10-mismo-ritmo'] = (Ta + (otra - Ta) * Math.exp(-t / tau) - Ta) / tau;
      r.errores['TC4-la-tibia-primero'] = Math.min(T0, otra);
      r.errores['TC4-primero-calienta-la-taza'] = 0;
    }
    return r;
  }
  function curvaEnfriamiento(T0, Tamb, tau, tmax, n) {
    n = n || 60; const pts = [];
    for (let j = 0; j <= n; j++) { const t = tmax * j / n; pts.push([t, enfriamiento({ T0, Tamb, tau, t }).T]); }
    return pts;
  }
  function tiempoHasta(o) { return -num(o.tau, 'tau') * Math.log((o.T - o.Tamb) / (o.T0 - o.Tamb)); }

  // Dos celdas de convección en una olla de ancho W y alto H (y hacia arriba desde el fondo); sube por el centro.
  function conveccion(x, y, W, H) {
    const kx = 2 * Math.PI / W, ky = Math.PI / H;
    return { vx: Math.sin(kx * x) * ky * Math.cos(ky * y), vy: -kx * Math.cos(kx * x) * Math.sin(ky * y) };
  }

  function radiacion(o) {
    const K = o.k && o.k.Kelvin !== undefined ? o.k.Kelvin : 273.15;
    return { P: num(o.e, 'e') * SIGMA * num(o.A, 'A') * Math.pow(num(o.Tc, 'Tc') + K, 4), TK: o.Tc + K };
  }
  function razonRadiacion(T1c, T2c) {
    const K1 = T1c + 273, K2 = T2c + 273;
    return { razon: Math.pow(K2 / K1, 4), T1K: K1, T2K: K2,
      errores: { 'TR7-lineal-kelvin': K2 / K1, 'TR7-lineal-celsius': T2c / T1c, 'TR7-cuarta-celsius': Math.pow(T2c / T1c, 4) } };
  }
  function perdidaNocturna(o) {
    const e = o.e === undefined ? 1 : num(o.e, 'e');
    return { perdida: e * SIGMA * (Math.pow(num(o.Tsuelo, 'Tsuelo'), 4) - Math.pow(num(o.Tcielo, 'Tcielo'), 4)),
      emite: e * SIGMA * Math.pow(o.Tsuelo, 4), vuelve: e * SIGMA * Math.pow(o.Tcielo, 4),
      errores: { 'Q12-nubes-tapan': 'tapan el aire', 'TR6-sin-radiacion': 'sin radiación' } };
  }

  /* ================= 0.2.0: distractores de las mezclas ================= */
  function prediccionMezcla(hielo, agua, k) {
    const s = equilibrio([hielo, agua], k), sinL = equilibrio([hielo, agua], Object.assign({}, k || {}, { Lf: 0 }));
    const c = kk(k);
    // La ecuación de siempre: el hielo sube a 0 °C, se funde entero y el total termina líquido a T.
    const pide = hielo.m * c.cHielo * (c.Tf - hielo.T) + hielo.m * c.Lf;
    const siempre = (agua.m * c.cAgua * agua.T - pide + hielo.m * c.cAgua * c.Tf) / (agua.m * c.cAgua + hielo.m * c.cAgua);
    const todoLiquido = s.meseta === null && s.T > c.Tf;
    return { T: s.T, meseta: s.meseta, hielo: s.hielo, liquido: s.liquido,
      errores: { 'Q7-olvida-calor-latente': sinL.T, 'Q4-promedio-simple': (hielo.T + agua.T) / 2,
        'Q8-no-revisa-si-alcanza': todoLiquido ? c.Tf : siempre, 'ecuacion-de-siempre': siempre, 'funde-todo-justo': c.Tf } };
  }

  return { CONSTANTES, EFUSIVIDAD, energia, agregarCalor, calorNecesario, equilibrio, tramos, curva,
    presionAltitud, ebullicion, contacto, flujoDesdeMano,
    MATERIALES, LIQUIDOS, SIGMA, DENSIDAD_HIELO, TEMPERATURA_MAXIMA_DENSIDAD,
    dilatacion, ajusteAnillo, agujero, bimetalica, densidadAgua, volumenAgua, maximoDensidad, densidadIgual, nivelFrasco, minimoFrasco, derrame,
    conduccion, serie, hieloSobre, enfriamiento, curvaEnfriamiento, tiempoHasta, conveccion, radiacion, razonRadiacion,
    perdidaNocturna, prediccionMezcla };
});
