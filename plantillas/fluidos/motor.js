/*
 * Motor de fluidos en reposo y en movimiento: presión hidrostática, recipientes de distintas formas, vasos
 * comunicantes, tubo en U con dos líquidos, barómetro, prensa hidráulica, empuje, flotación, el bloque que se hunde
 * colgado de un dinamómetro sobre una balanza, caudal, continuidad, Bernoulli, Torricelli y el tubo con estrechamiento
 * con sus dos tubitos (versión 0.2.0).
 *
 * Aquí vive toda la física de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorFluidos) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Unidades SI: kg, m, m², m³, N, Pa, J. Valores de academia: g = 10 m/s², agua 1000 kg/m³, P₀ = 100 000 Pa
 * (salvo que se dé otro). Las presiones "manométricas" son lo que se suma a la atmosférica; las "absolutas" la
 * incluyen. La profundidad h se mide hacia abajo desde la superficie libre del líquido, en vertical.
 *
 * Funciones:
 *   presion({ rho, h, P0, H })            presión a la profundidad h: manométrica ρgh y absoluta P₀ + ρgh. Con H (la
 *                                         altura del líquido) también da el error de medir h desde el fondo.
 *   recipiente({ forma | secciones, H, rho, P0 })  recipiente armado con tramos horizontales apilados desde el fondo,
 *                                         [{ alto, ancho }], todos centrados en el mismo eje y de 1 m de fondo (hacia
 *                                         dentro de la pantalla), lleno hasta H. Formas de academia: 'ancho', 'estrecho',
 *                                         'botella' (ancha abajo con techo y cuello angosto) y 'embudo'. Da el peso
 *                                         del agua, la presión y la fuerza en el fondo y la fuerza vertical de las
 *                                         paredes (paradoja hidrostática). presionEn(x, y) da la presión en un punto
 *                                         (x desde el eje, y desde el fondo), con su techo y los errores F2, F4, F7.
 *                                         Geometría de las formas (alto total 2,4 m; con H = 2 m de agua):
 *                                           'ancho'    un tramo de 1 m de ancho (área 1 m²).
 *                                           'estrecho' un tramo de 0,25 m de ancho (área 0,25 m²).
 *                                           'botella'  de y = 0 a 0,8 m, 1 m de ancho; de 0,8 a 2,4 m, cuello de 0,25 m.
 *                                                      El escalón en y = 0,8 m es un techo de 0,75 m² (a cada lado del
 *                                                      cuello, de |x| = 0,125 a 0,5 m) que empuja el agua hacia abajo.
 *                                           'embudo'   de y = 0 a 0,8 m, 0,25 m de ancho; de 0,8 a 2,4 m, 1 m: el
 *                                                      escalón en y = 0,8 m es una repisa que sostiene agua (fuerza < 0).
 *                                         errores.pesoEncima = peso del agua / área del fondo; errores.hHastaTecho usa
 *                                         la distancia vertical del punto al primer techo que tenga encima.
 *   presionEn(o, x, y)                    recipiente(o).presionEn(x, y), para casos.json.
 *   vasosComunicantes({ areas, volumen })  un líquido en dos ramas de distinta sección unidas abajo: el mismo nivel.
 *   tuboU({ rho1, h1, rho2 })             tubo en U parejo con el líquido 2 (más denso) abajo y una columna h1 del
 *                                         líquido 1 en la rama izquierda: desnivel x del líquido 2 = ρ1·h1/ρ2 (cuánto
 *                                         sube el líquido 2 de la derecha sobre la frontera de la izquierda).
 *                                         errores.mismaSuperficie = h1: el x que saldría si las dos superficies libres
 *                                         quedaran parejas, como con un solo líquido. densidadesInvertidas = ρ2·h1/ρ1.
 *   barometro({ rho, h })                 presión atmosférica que sostiene una columna h (Torricelli).
 *   prensa({ A1, A2 | D1, D2, F1, d1 })   prensa de Pascal: F2 = F1·A2/A1, el émbolo grande sube d2 = d1·A1/A2 y el
 *                                         trabajo es el mismo en los dos lados.
 *   empuje({ rho, Vsum })                 E = ρ·g·V sumergido.
 *   flotacion({ rhoC | m, V, rhoF })      qué hace un cuerpo suelto: flota (con su fracción sumergida ρC/ρF), queda a
 *                                         media agua o se va al fondo (con la normal del fondo y su peso aparente).
 *   sumergido({ rhoC | m, V, rhoF, mRef }) el cuerpo sumergido entero y sostenido por un hilo: desde arriba si pesa más
 *                                         que su empuje, amarrado al fondo si pesa menos. Con mRef, los errores de F10
 *                                         contra otro cuerpo del mismo volumen y masa mRef.
 *   bloques({ masas, V, rhoF })           varios cuerpos del mismo volumen soltados bajo el líquido: el destino de cada uno.
 *                                         errores.escalonado (F11) da, para cada bloque en el orden de 'masas', su
 *                                         puesto de arriba hacia abajo si cada uno "buscara su profundidad": 0 para el
 *                                         más liviano, n − 1 para el más pesado (rango por masa, empates por orden).
 *   balanza({ m, V, rhoF, mVaso, Avaso, hLiq, bajada })  un bloque cúbico colgado de un dinamómetro se baja dentro de
 *                                         un vaso con líquido que está sobre una balanza. 'bajada' es cuánto está el
 *                                         fondo del bloque bajo la superficie inicial (negativo: fuera). El nivel sube
 *                                         al hundirlo. Da lo que marcan el dinamómetro (T) y la balanza (N).
 *                                         El bloque es un cubo de lado a = ∛V; el vaso tiene sección Avaso y hLiq de
 *                                         líquido. Wvaso = (mVaso + ρF·Avaso·hLiq)·g es el peso del vaso más el del
 *                                         líquido (lo que marca la balanza sin el bloque). N = Wvaso + E y T = W − E
 *                                         (0 si el hilo queda flojo y el bloque flota).
 *   continuidad({ A1, v1, A2 | D1, D2 | r1, r2 })  caudal Q = A·v y la rapidez en la otra sección.
 *   bernoulli({ P1, v1, h1, v2 | A1, A2, h2, rho })  presión en el punto 2 de un tubo con líquido ideal.
 *   caudal({ A | D | r, v | Q, V, pi })   Q = A·v en m³/s (y en L/s y L/min), o la rapidez si se da Q; con V (m³), el
 *                                         tiempo de llenado. pi permite el π = 3 de la academia (por defecto, Math.PI).
 *                                         errores: diametroComoRadio (área 4 veces mayor: v/4, o Q·4), litrosEntre100
 *                                         (v·10, de pasar L a m³ entre 100), sinCuadrado (área π·r: el radio sin elevar).
 *   torricelli({ h | H, y })              chorro por un orificio a la profundidad h bajo la superficie: v = √(2gh). Con H
 *                                         (altura del agua sobre el piso) e y (altura del orificio sobre el piso), h = H − y,
 *                                         y el chorro horizontal cae al piso: tiempo, alcance x, vy, rapidez y ángulo de
 *                                         llegada (grados bajo la horizontal). errores: profundidadTotal (√(2gH)),
 *                                         alturaDelOrificio (√(2gy)), sinRaiz (2gh), alcanceConH (x con la H).
 *   estrechamiento({ r1, r2, v1, P1, rho })  tubo horizontal de radio r1 que se angosta a r2, con dos tubitos verticales
 *                                         abiertos (manómetros) en el ancho y en el angosto. P1 es la presión manométrica
 *                                         en el eje del tramo ancho; la de cada tubito sube hasta h = P/(ρg) sobre el eje.
 *                                         Da A1, A2, v2, Q, P2, h1, h2 y dP. errores: masRapidoMasPresion (P y h del angosto
 *                                         si la presión subiera con la rapidez), presionIgual, v2RadioLineal (v1·r1/r2),
 *                                         v2Invertida (v1·(r2/r1)²), v2Igual.
 *
 * Cada resultado trae 'errores': los números que salen de las ideas erróneas del informe
 * (docs/investigacion/fluidos-calor-termodinamica-ideas-erroneas.md, F1 a F15, y la tabla de errores de cálculo sin
 * estudio). La escena los usa para las opciones incorrectas.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorFluidos = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const G = 10, AGUA = 1000, P_ATM = 100000;
  const EPS = 1e-9;
  const num = (x, que) => { const n = Number(x); if (x === null || x === '' || x === undefined || !Number.isFinite(n)) throw new Error(`${que} inválido: ${x}`); return n; };
  const pos = (x, que) => { const n = num(x, que); if (!(n > 0)) throw new Error(`${que} debe ser mayor que cero: ${x}`); return n; };
  const noNeg = (x, que) => { const n = num(x, que); if (n < 0) throw new Error(`${que} no puede ser negativo: ${x}`); return n; };
  const limpio = x => (Math.abs(x) < EPS ? 0 : x);
  const gDe = o => (o.g === undefined ? G : pos(o.g, 'g'));
  const rhoDe = (o, k, defecto) => (o[k] === undefined ? defecto : pos(o[k], `densidad ${k}`));
  const P0De = o => (o.P0 === undefined ? P_ATM : noNeg(o.P0, 'presión atmosférica P0'));

  // ---------- Presión hidrostática ----------
  function presion(o) {
    o = o || {};
    const g = gDe(o), rho = rhoDe(o, 'rho', AGUA), h = noNeg(o.h, 'profundidad h'), P0 = P0De(o);
    const Pman = rho * g * h;
    const errores = {
      sinP0: Pman,                        // dar la manométrica cuando se pide la absoluta
      conP0: P0 + Pman,                   // dar la absoluta cuando se pide la manométrica
      haciaArriba: P0 - Pman,             // F8: la presión crece hacia arriba
      igualEnTodo: P0                     // F7 leído al revés: "la presión es igual en todo el líquido" (la de la superficie)
    };
    if (o.H !== undefined) {
      const H = pos(o.H, 'altura del líquido H');
      if (h > H + EPS) throw new Error('la profundidad no puede pasar la altura del líquido');
      errores.hDesdeFondo = rho * g * (H - h);     // medir h desde el fondo
    }
    return { rho, h, g, P0, Pman, Pabs: P0 + Pman, errores };
  }

  // ---------- Recipientes de distintas formas ----------
  // Tramos desde el fondo; ancho en m, con 1 m de fondo hacia dentro (el área de cada tramo vale su ancho).
  const FORMAS = {
    ancho: [{ alto: 2.4, ancho: 1 }],
    estrecho: [{ alto: 2.4, ancho: 0.25 }],
    botella: [{ alto: 0.8, ancho: 1 }, { alto: 1.6, ancho: 0.25 }],
    embudo: [{ alto: 0.8, ancho: 0.25 }, { alto: 1.6, ancho: 1 }]
  };
  function tramos(o) {
    let s = o.secciones;
    if (!s) {
      if (!o.forma || !Object.prototype.hasOwnProperty.call(FORMAS, o.forma)) throw new Error(`forma desconocida: ${o.forma}`);
      s = FORMAS[o.forma];
    }
    if (!Array.isArray(s) || !s.length) throw new Error('secciones debe ser una lista con al menos un tramo');
    let y = 0;
    return s.map((q, i) => { const alto = pos(q.alto, `alto del tramo ${i + 1}`), ancho = pos(q.ancho, `ancho del tramo ${i + 1}`);
      const t = { y0: y, y1: y + alto, ancho, area: ancho * (q.fondo === undefined ? 1 : pos(q.fondo, 'fondo')) }; y += alto; return t; });
  }
  function recipiente(o) {
    o = o || {};
    const g = gDe(o), rho = rhoDe(o, 'rho', AGUA), P0 = P0De(o), t = tramos(o);
    const alto = t[t.length - 1].y1, H = pos(o.H, 'altura del agua H');
    if (H > alto + EPS) throw new Error('el agua no puede pasar la altura del recipiente');
    const lleno = t.filter(q => q.y0 < H - EPS).map(q => Object.assign({}, q, { y1: Math.min(q.y1, H) }));
    const volumen = lleno.reduce((s, q) => s + q.area * (q.y1 - q.y0), 0);
    const pesoAgua = rho * g * volumen, areaFondo = t[0].area;
    const Pfondo = rho * g * H, fuerzaFondo = Pfondo * areaFondo;
    // Fuerza vertical de las paredes sobre el agua, positiva hacia abajo: en cada escalón, la presión de ahí por la
    // diferencia de áreas (un techo empuja hacia abajo; un ensanche hacia arriba, sostiene agua).
    const escalones = [];
    for (let i = 1; i < lleno.length; i++) {
      const y = lleno[i].y0, P = rho * g * (H - y), dA = lleno[i - 1].area - lleno[i].area;
      escalones.push({ y, profundidad: H - y, P, area: Math.abs(dA), tipo: dA > 0 ? 'techo' : 'repisa', F: P * dA });
    }
    const fuerzaParedes = escalones.reduce((s, q) => s + q.F, 0);
    const ancho = y => { const q = t.find(r => y >= r.y0 - EPS && y <= r.y1 + EPS); return q ? q.ancho : 0; };
    function presionEn(x, y) {
      x = num(x, 'x'); y = noNeg(y, 'altura y');
      if (y > H + EPS) throw new Error('el punto está sobre la superficie del agua');
      const q = t.find(r => y >= r.y0 - EPS && y < r.y1 - EPS) || t[t.length - 1];
      if (Math.abs(x) > q.ancho / 2 + EPS) throw new Error('el punto está fuera del recipiente');
      const h = H - y, P = rho * g * h;
      // Techo: el primer tramo encima del punto que ya no lo cubre.
      let techo = null;
      for (const r of t) if (r.y0 > y + EPS && r.y0 < H - EPS && Math.abs(x) > r.ancho / 2 + EPS) { techo = r.y0; break; }
      const errores = {
        hDesdeFondo: rho * g * y,                                   // h medida desde el fondo
        igualEnTodo: Pfondo,                                        // F7: "la misma presión en todo el líquido"
        hHastaTecho: techo === null ? P : rho * g * (techo - y),    // F4: h hasta lo que está justo encima
        pesoEncima: pesoAgua / areaFondo                            // F2: el peso del agua repartido en el fondo
      };
      return { x, y, h, P, Pabs: P0 + P, techo, bajoTecho: techo !== null, hTecho: techo === null ? null : techo - y, errores };
    }
    return { forma: o.forma || null, tramos: t, alto, H, rho, g, P0, volumen, pesoAgua, areaFondo, Pfondo, PfondoAbs: P0 + Pfondo,
      fuerzaFondo, fuerzaParedes: limpio(fuerzaParedes), escalones, ancho, presionEn,
      errores: { pesoEncima: pesoAgua / areaFondo, fuerzaIgualPeso: pesoAgua } };
  }

  const presionEn = (o, x, y) => recipiente(o).presionEn(x, y);

  // ---------- Vasos comunicantes con un solo líquido ----------
  function vasosComunicantes(o) {
    o = o || {};
    if (!Array.isArray(o.areas) || o.areas.length < 2) throw new Error('areas debe traer al menos dos ramas');
    const A = o.areas.map((a, i) => pos(a, `área de la rama ${i + 1}`)), V = noNeg(o.volumen, 'volumen');
    const suma = A.reduce((s, a) => s + a, 0), h = V / suma;
    // F1: "la rama ancha pesa más, así que baja": cada rama con el mismo peso (el mismo volumen) de agua.
    const mitad = V / A.length;
    return { niveles: A.map(() => h), nivel: h, areas: A, volumen: V,
      errores: { mismoPesoEnCadaRama: A.map(a => mitad / a), anchaMasAlta: A.map(a => mitad / a).reverse() } };
  }

  // ---------- Tubo en U con dos líquidos ----------
  function tuboU(o) {
    o = o || {};
    const rho1 = rhoDe(o, 'rho1', AGUA), rho2 = pos(o.rho2, 'densidad rho2'), h1 = pos(o.h1, 'columna h1'), g = gDe(o);
    if (!(rho2 > rho1)) throw new Error('el líquido de abajo (rho2) debe ser más denso que el que se echa (rho1)');
    // Misma presión a la altura de la frontera, en las dos ramas (mismo líquido 2, conectado): ρ1·g·h1 = ρ2·g·x.
    const x = rho1 * h1 / rho2;
    return { rho1, rho2, h1, x, desnivel: x, diferenciaSuperficies: h1 - x, bajaFrontera: x / 2, subeDerecha: x / 2,
      Pfrontera: rho1 * g * h1,
      errores: { mismaSuperficie: h1, densidadesInvertidas: rho2 * h1 / rho1, sinDesnivel: 0 } };
  }

  // ---------- Barómetro de Torricelli ----------
  function barometro(o) {
    o = o || {};
    const rho = pos(o.rho, 'densidad rho'), h = pos(o.h, 'altura h'), g = gDe(o);
    return { P0: rho * g * h, rho, h, errores: { sinG: rho * h } };
  }

  // ---------- Prensa hidráulica ----------
  function prensa(o) {
    o = o || {};
    let A1, A2, porDiametros = false;
    if (o.D1 !== undefined || o.D2 !== undefined) {
      const D1 = pos(o.D1, 'diámetro D1'), D2 = pos(o.D2, 'diámetro D2');
      A1 = Math.PI * D1 * D1 / 4; A2 = Math.PI * D2 * D2 / 4; porDiametros = true;
    } else { A1 = pos(o.A1, 'área A1'); A2 = pos(o.A2, 'área A2'); }
    const F1 = pos(o.F1, 'fuerza F1'), d1 = o.d1 === undefined ? 0 : noNeg(o.d1, 'recorrido d1');
    const r = A2 / A1, P = F1 / A1, F2 = F1 * r, d2 = d1 / r;
    return { A1, A2, razon: r, P, F1, F2, d1, d2, volumen: A1 * d1, trabajo1: F1 * d1, trabajo2: F2 * d2, porDiametros,
      errores: { fuerzaIgual: F1, razonInvertida: F1 / r, razonDiametros: F1 * Math.sqrt(r), mismoRecorrido: d1, trabajoMayor: F2 * d1 } };
  }

  // ---------- Empuje y flotación ----------
  function empuje(o) {
    o = o || {};
    const rho = rhoDe(o, 'rho', AGUA), V = noNeg(o.Vsum, 'volumen sumergido'), g = gDe(o);
    return { E: rho * g * V, rho, Vsum: V };
  }
  function cuerpo(o) {
    const V = pos(o.V, 'volumen V'), g = gDe(o), rhoF = rhoDe(o, 'rhoF', AGUA);
    let rhoC, m;
    if (o.rhoC !== undefined) { rhoC = pos(o.rhoC, 'densidad del cuerpo'); m = rhoC * V; }
    else { m = pos(o.m, 'masa m'); rhoC = m / V; }
    return { V, g, rhoF, rhoC, m, W: m * g, Eentero: rhoF * g * V };
  }
  function flotacion(o) {
    o = o || {};
    const c = cuerpo(o), rel = c.rhoC / c.rhoF;
    const destino = Math.abs(rel - 1) < 1e-12 ? 'media agua' : rel < 1 ? 'flota' : 'fondo';
    const fraccion = Math.min(1, rel), Vsum = fraccion * c.V, E = c.rhoF * c.g * Vsum;
    return { destino, flota: destino === 'flota', rhoC: c.rhoC, rhoF: c.rhoF, m: c.m, V: c.V, W: c.W, fraccion, sobresale: 1 - fraccion,
      Vsum, E, Eentero: c.Eentero, normalFondo: destino === 'fondo' ? c.W - c.Eentero : 0, pesoAparente: c.W - c.Eentero,
      errores: {
        fraccionInvertida: c.rhoF / c.rhoC,       // ρ_líquido/ρ_cuerpo
        fraccionQueSobresale: 1 - fraccion,       // dar la parte que sobresale
        empujeEntero: c.Eentero,                  // F13: el que flota recibe el empuje de todo su volumen
        empujeMasHondo: c.rhoF * c.g * Vsum       // F13 (25 %): "más empuje en el más sumergido": se ve al comparar
      } };
  }
  function sumergido(o) {
    o = o || {};
    const c = cuerpo(o), E = c.Eentero, T = Math.abs(c.W - E);
    const hilo = Math.abs(c.W - E) < EPS ? 'flojo' : c.W > E ? 'arriba' : 'abajo';
    return { W: c.W, E, T, hilo, m: c.m, rhoC: c.rhoC, rhoF: c.rhoF, V: c.V, pesoAparente: c.W - E,
      errores: Object.assign({ tensionIgualPeso: c.W, tensionSuma: c.W + E, empujeIgualPeso: c.W, sinEmpuje: 0 },
        // F10: comparado con otro cuerpo del mismo volumen y masa mRef, "más masa, más empuje" (o al revés).
        o.mRef === undefined ? {} : { empujeSegunMasa: E * c.m / pos(o.mRef, 'masa de referencia'), empujeInversoMasa: E * pos(o.mRef, 'masa de referencia') / c.m }) };
  }
  function bloques(o) {
    o = o || {};
    if (!Array.isArray(o.masas) || !o.masas.length) throw new Error('masas debe ser una lista');
    const V = pos(o.V, 'volumen V'), rhoF = rhoDe(o, 'rhoF', AGUA), g = gDe(o);
    const lista = o.masas.map(m => flotacion({ m, V, rhoF, g }));
    // F11: cada bloque "busca su profundidad": el más pesado más abajo (orden de arriba hacia abajo, 0 = el más alto).
    const orden = o.masas.map((m, i) => i).sort((i, j) => o.masas[i] - o.masas[j]);
    const escalon = o.masas.map((m, i) => orden.indexOf(i));
    return { lista, destinos: lista.map(b => b.destino), empujeSumergidos: rhoF * g * V,
      errores: { escalonado: escalon, todosAlFondo: lista.map(() => 'fondo'), quedanDondeSeSueltan: lista.map(() => 'media agua') } };
  }

  // ---------- El bloque que se hunde, con dinamómetro y balanza ----------
  function balanza(o) {
    o = o || {};
    const c = cuerpo(o), a = Math.cbrt(c.V), Ab = a * a;
    const Avaso = pos(o.Avaso, 'área del vaso'), hLiq = pos(o.hLiq, 'altura del líquido'), mVaso = noNeg(o.mVaso === undefined ? 0 : o.mVaso, 'masa del vaso');
    if (Ab >= Avaso) throw new Error('el bloque no cabe en el vaso');
    const y = num(o.bajada === undefined ? 0 : o.bajada, 'bajada');
    const k = Ab / Avaso;                                     // cuánto sube el nivel por metro hundido, en proporción
    const mLiq = c.rhoF * Avaso * hLiq, Wvaso = (mVaso + mLiq) * c.g;
    let s = y <= 0 ? 0 : Math.min(a, y / (1 - k));           // alto sumergido, con la subida del nivel
    const sFlota = c.W / (c.rhoF * c.g * Ab);                  // alto sumergido si flotara suelto
    let flojo = false;
    if (sFlota < a - EPS && s > sFlota) { s = sFlota; flojo = true; }
    else if (Math.abs(sFlota - a) < EPS && s >= a - EPS) flojo = true;
    const subida = Ab * s / Avaso;
    const fondoBloque = flojo ? s - subida : y;               // bajo la superficie inicial
    if (fondoBloque > hLiq + EPS) throw new Error('el bloque tocaría el fondo del vaso');
    const Vsum = Ab * s, E = c.rhoF * c.g * Vsum, T = flojo ? 0 : limpio(c.W - E), N = Wvaso + E;
    return { a, m: c.m, V: c.V, W: c.W, rhoF: c.rhoF, Wvaso, mLiq, s, fraccion: s / a, entero: s >= a - EPS, Vsum, E, T, N, total: T + N,
      subida, nivel: hLiq + subida, fondoBloque, profundidadFondo: fondoBloque + subida, flojo, enteroDesde: a * (1 - k),
      errores: {
        dinamometroSinCambio: c.W,          // el agua no cambia lo que sostiene el hilo
        dinamometroIgualEmpuje: E,          // confundir lo que marca con el empuje
        dinamometroSuma: c.W + E,           // el agua empuja hacia abajo y se suma
        balanzaSinCambio: Wvaso,            // el bloque cuelga del hilo: no se apoya
        balanzaPesoEntero: Wvaso + c.W,     // el bloque entero "está en el vaso"
        balanzaResta: Wvaso - E             // el empuje aligera todo lo que hay en la balanza
      } };
  }

  // ---------- Fluidos en movimiento ----------
  function areas(o) {
    if (o.D1 !== undefined || o.D2 !== undefined) {
      const D1 = pos(o.D1, 'diámetro D1'), D2 = pos(o.D2, 'diámetro D2');
      return { A1: Math.PI * D1 * D1 / 4, A2: Math.PI * D2 * D2 / 4, D1, D2 };
    }
    if (o.r1 !== undefined || o.r2 !== undefined) {
      const r1 = pos(o.r1, 'radio r1'), r2 = pos(o.r2, 'radio r2');
      return { A1: Math.PI * r1 * r1, A2: Math.PI * r2 * r2, r1, r2 };
    }
    return { A1: pos(o.A1, 'área A1'), A2: pos(o.A2, 'área A2') };
  }
  function continuidad(o) {
    o = o || {};
    const s = areas(o), v1 = noNeg(o.v1, 'rapidez v1'), Q = s.A1 * v1, v2 = Q / s.A2;
    const e = { invertido: v1 * s.A2 / s.A1, igual: v1 };
    if (s.D1 !== undefined) e.razonDiametros = v1 * s.D1 / s.D2;
    if (s.r1 !== undefined) e.razonRadios = v1 * s.r1 / s.r2;
    return { A1: s.A1, A2: s.A2, v1, v2, Q, errores: e };
  }
  function bernoulli(o) {
    o = o || {};
    const rho = rhoDe(o, 'rho', AGUA), g = gDe(o), P1 = noNeg(o.P1, 'presión P1'), v1 = noNeg(o.v1, 'rapidez v1');
    const h1 = o.h1 === undefined ? 0 : num(o.h1, 'altura h1'), h2 = o.h2 === undefined ? 0 : num(o.h2, 'altura h2');
    const v2 = o.v2 !== undefined ? noNeg(o.v2, 'rapidez v2') : continuidad(o).v2;
    const P2 = P1 + rho * (v1 * v1 - v2 * v2) / 2 + rho * g * (h1 - h2);
    return { P1, P2, v1, v2, h1, h2, rho,
      errores: { masRapidoMasPresion: P1 + rho * (v2 * v2 - v1 * v1) / 2 + rho * g * (h1 - h2), sinAltura: P1 + rho * (v1 * v1 - v2 * v2) / 2 } };
  }

  // ---------- Caudal, Torricelli y el tubo con estrechamiento ----------
  function caudal(o) {
    o = o || {};
    const pi = o.pi === undefined ? Math.PI : pos(o.pi, 'pi');
    let A, r = null;
    if (o.D !== undefined) r = pos(o.D, 'diámetro D') / 2;
    else if (o.r !== undefined) r = pos(o.r, 'radio r');
    A = r === null ? pos(o.A, 'área A') : pi * r * r;
    let v, Q;
    if (o.Q !== undefined) { Q = noNeg(o.Q, 'caudal Q'); v = Q / A; } else { v = noNeg(o.v, 'rapidez v'); Q = A * v; }
    const res = { A, r, v, Q, QLs: Q * 1000, QLmin: Q * 60000, errores: {} };
    if (o.V !== undefined) { const V = pos(o.V, 'volumen V'); if (!(Q > 0)) throw new Error('sin caudal no se llena'); res.V = V; res.t = V / Q; }
    const e = res.errores, dado = o.Q !== undefined;
    if (o.D !== undefined) e.diametroComoRadio = dado ? v / 4 : Q * 4;
    if (r !== null) e.sinCuadrado = dado ? Q / (pi * r) : pi * r * v;
    if (dado) e.litrosEntre100 = v * 10;
    return res;
  }
  function torricelli(o) {
    o = o || {};
    const g = gDe(o);
    let h, H = null, y = null;
    if (o.H !== undefined) {
      H = pos(o.H, 'altura del agua H'); y = noNeg(o.y, 'altura del orificio y');
      if (!(y < H)) throw new Error('el orificio debe estar bajo la superficie del agua');
      h = H - y;
    } else h = pos(o.h, 'profundidad del orificio h');
    const v = Math.sqrt(2 * g * h);
    const res = { h, v, H, y, errores: { sinRaiz: 2 * g * h } };
    if (H !== null) {
      const t = Math.sqrt(2 * y / g), vy = g * t, x = v * t;
      Object.assign(res, { t, x, vy, vLlegada: Math.hypot(v, vy), angulo: Math.atan2(vy, v) * 180 / Math.PI });
      Object.assign(res.errores, { profundidadTotal: Math.sqrt(2 * g * H), alturaDelOrificio: Math.sqrt(2 * g * y),
        alcanceConH: Math.sqrt(2 * g * H) * t, sumaEscalar: v + vy });
    }
    return res;
  }
  function estrechamiento(o) {
    o = o || {};
    const rho = rhoDe(o, 'rho', AGUA), g = gDe(o);
    const r1 = pos(o.r1, 'radio ancho r1'), r2 = pos(o.r2, 'radio angosto r2'), v1 = noNeg(o.v1, 'rapidez v1'), P1 = noNeg(o.P1, 'presión P1');
    if (r2 > r1 + EPS) throw new Error('la parte angosta no puede ser más ancha que el tubo');
    const A1 = Math.PI * r1 * r1, A2 = Math.PI * r2 * r2, Q = A1 * v1, v2 = Q / A2;
    const dP = rho * (v2 * v2 - v1 * v1) / 2, P2 = P1 - dP;
    if (P2 < -EPS) throw new Error('la presión en lo angosto quedaría bajo la atmosférica: el tubito chuparía aire');
    const h = P => P / (rho * g);
    return { r1, r2, A1, A2, Q, v1, v2, P1, P2: limpio(P2), dP, h1: h(P1), h2: limpio(h(P2)), rho, g,
      errores: { masRapidoMasPresion: P1 + dP, hMasRapidoMasPresion: h(P1 + dP), presionIgual: P1, hIgual: h(P1),
        v2RadioLineal: v1 * r1 / r2, v2Invertida: v1 * (r2 / r1) ** 2, v2Igual: v1 } };
  }

  return { G, AGUA, P_ATM, FORMAS, caudal, torricelli, estrechamiento, presion, recipiente, presionEn, vasosComunicantes, tuboU, barometro, prensa, empuje, flotacion, sumergido, bloques, balanza, continuidad, bernoulli };
});
