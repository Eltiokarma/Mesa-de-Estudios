/*
 * Teoría de «Movimiento circular» (fisica.movimiento-circular), para 5.º de secundaria y preuniversitario. Unidad nueva
 * del 19 nov 2026: sale de «Movimiento parabólico y circular», que se partió en dos (docs/etapa5/propuesta-fisica.md §1 y
 * §9, decisión 1; Gerson delegó el criterio y revisa después). La unidad vieja conserva su id como «Movimiento parabólico»
 * (contenido/teoria/fisica/movimiento-parabolico-y-circular.js). Avance.migrar (nucleo/avance.js, partición partidoPC)
 * pasa a esta unidad lo hecho en `arco-y-radian`, `rapidez-constante-acelera` y `dos-aceleraciones`, las mesas `rueda` y
 * `giro`, la visita, «Ya la estudié» y las once palabras del giro. Esos ids no cambian. `arco-y-radian` y
 * `dos-aceleraciones` estrenan otra Predice: sus predicciones viejas sin huella se borran una vez (prediccionPC);
 * `rapidez-constante-acelera` conserva su pregunta con los mismos ids de opción (c, cero, afuera, adelante).
 *
 * Las seis ideas de la propuesta (parte B), en orden, todas con el método (fase 3, 19 nov): Lee, Juega con misión,
 * Predice, Mira, La regla, Así se resuelve, Ahora tú, glosario y 15 ejemplos.
 *   B1 `arco-y-radian` «El ángulo girado y el arco» ........................ la rueda de la fortuna de la feria.
 *   B2 `periodo-y-frecuencia` «Período, frecuencia y velocidad angular» ... la misma rueda, con un cronómetro.
 *   B3 `velocidad-tangencial` «Velocidad tangencial y transmisión» ........ el carrusel de la plaza, con Ana y Beto.
 *   B4 `rapidez-constante-acelera` «Aceleración centrípeta» ............... la moto que da vueltas al óvalo.
 *   B5 `mcuv` «MCUV: el giro que acelera» ................................. el ventilador de techo del aula.
 *   B6 `dos-aceleraciones` «Aceleración tangencial y total» ............... el carrusel que arranca.
 * Objetos: pieza fis-giro (nucleo/kit/piezas/fis-giro.js), dibujos de prueba (data-prueba) que Gerson decide si
 * reemplaza. La unidad lleva calidad: 2 desde el 19 nov (después del lector en frío y el auditor); su
 * prueba propia la simula.
 *
 * Letras (propuesta §5; campo `letras`): s el arco que recorre un punto; θ el ángulo girado, en radianes; r el radio, del
 * eje al punto; N las vueltas; T el período; f la frecuencia; t el tiempo; ω y ω₀ la velocidad angular (al final y al
 * empezar); v la rapidez del punto que gira (v⃗, con flecha, desde B4: en una curva sí es un vector); α la aceleración
 * angular; a_T, a_c y a las aceleraciones tangencial, centrípeta y total (a_T con T mayúscula, para no leerla «a por t»;
 * la T sola es el período). R, el radio de la Tierra; λ, la latitud; φ, el ángulo entre a⃗ y v⃗.
 * REGLA DE COLORES (los de MRU, MRUV y Movimiento parabólico; docs/molde-unidad.md §5b; tabla COLORES): un color fijo
 *   por magnitud, el mismo en el juego, la figura, la fórmula, los datos, los ejemplos y «Ahora tú»:
 *   - naranja (c-o): la velocidad: v, v⃗ y ω (la velocidad del giro), en m/s, rad/s o rpm, y sus flechas;
 *   - turquesa (c-i): el tiempo: t, T y el cronómetro;
 *   - violeta (c-f): lo que gira o se recorre: el arco s, el ángulo girado θ y las vueltas N;
 *   - carmín (c-h): la aceleración: α, a_T, a_c y a, y sus flechas (de punta abierta, como en MRUV);
 *   - tinta: el radio r, R, la frecuencia f, la latitud, los objetos y lo que se pide en una figura («?»).
 *   Sin verde: iría junto al naranja de v (protanopía: 0,010). Cambio respecto de la propuesta: N (las vueltas) va en
 *   violeta, como θ, porque es el mismo ángulo contado en vueltas (propuesta, «Cambios de la parte B»).
 * Errores (docs/investigacion/cinematica-ideas-erroneas.md, K3; dinámica, D9; los demás son hipótesis de diseño):
 *   AN-GRADOS usa grados como radianes · AN-MEDIA una vuelta es π · AN-VUELTA una vuelta es 1 rad · AN-SIN-R olvida el
 *   radio · AN-POR multiplica arco por radio · AN-INV divide al revés · PR6-diametro usa el diámetro · U-cm no pasa cm a m ·
 *   MC-T-F da la frecuencia como período · MC-LEE lee el número del enunciado · U-MIN no pasa el minuto a segundos ·
 *   MC-W-SIN-2PI olvida el 2π · MC-W-PI olvida el 2 · MC-TR-W cree que la faja iguala ω · MC-TR-INV la proporción al
 *   revés · PR-CUADRADO eleva al cuadrado · MC-V-IGUAL cree que en un disco todos van igual de rápido · MC-A0 rapidez
 *   constante, aceleración cero · MC-VR da v/r · MC-V2R multiplica por r · U1-kmh deja los km/h · PR1 proporción directa ·
 *   K4 divide la ω final y no el cambio · MC-ENESIMO da lo de un solo segundo · MC-W-ANGULO toma ω como ángulo ·
 *   MC-SIN-MEDIO olvida el ½ · MC-SOLO-AT, MC-SOLO-AC una sola de las dos · MC-SUMA suma perpendiculares · MC-DOS no ve
 *   que a_T mide el cambio de rapidez · MC-A0-b va parejo, sin aceleración · MC-2PI-DE-MAS otro 2π a una ω en rad/s ·
 *   PR-INV hace bajar lo que sube · MC-V-W toma v por ω · MC-SIN-W0, MC-SIN-ALFA, MC-W-MEDIA, MC-SIN-RAIZ, K-TIEMPO y K-MITAD
 *   (descritos con los demás en el informe de cinemática, «Movimiento circular (19 nov)»).
 *
 * Molde: docs/teoria.md y docs/molde-unidad.md. Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 3),
 * docs/etapa5/propuesta-fisica.md (parte B) y docs/clasificacion/compendio-movimiento-circunferencial.md.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
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
  // Opciones distintas: la correcta primero; los distractores que repiten un texto se descartan. Un distractor puede
  // traer su propio texto (una respuesta sin π entre otras con π, por ejemplo).
  function opciones(correcta, distractores, fmt, textoBien) {
    const bien = textoBien || fmt(correcta), vistos = new Set([bien]);
    const ops = [{ id: 'c', texto: bien, correcta: true }];
    for (const d of distractores) {
      if (!d || (d.texto === undefined && !Number.isFinite(d.valor))) continue;
      const txt = d.texto !== undefined ? d.texto : fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Un múltiplo de π escrito como en el examen, con su fracción exacta: 2π, π/2, 8π/3, π/40 (auditoría del 19 nov, M4:
  // antes redondeaba el coeficiente, «2π/3 · 4 = 2,67π m», y la igualdad escrita era falsa). Solo un coeficiente sin
  // fracción corta (denominador mayor que 60) se redondea; no sale en ningún caso de la unidad (lo comprueba el .test.js).
  function enPi(k) {
    for (let q = 1; q <= 60; q++) {
      const p = Math.round(k * q);
      if (p > 0 && Math.abs(k * q - p) < 1e-9) return `${p === 1 ? '' : p}π${q === 1 ? '' : `/${q}`}`;
    }
    return `${f(k, 2)}π`;
  }

  // Un color fijo por magnitud (cabecera y COLORES): cada ficha dice su magnitud en m; lo comprueba el .test.js.
  const Mv = { v: 'c-o', t: 'v', m: 'velocidad' }, Mw = { v: 'c-o', t: 'ω', m: 'velocidad' };
  const Mt = { v: 'c-i', t: 't', m: 'tiempo' }, MT = { v: 'c-i', t: 'T', m: 'tiempo' };
  const Ms = { v: 'c-f', t: 's', m: 'giro' }, Mth = { v: 'c-f', t: 'θ', m: 'giro' }, MN = { v: 'c-f', t: 'N', m: 'giro' };
  const Mal = { v: 'c-h', t: 'α', m: 'aceleración' }, Ma = { v: 'c-h', t: 'a', m: 'aceleración' };
  const Mac = { sub: [Ma, 'c'] }, MaT = { sub: [Ma, 'T'] }, Mw0 = { sub: [Mw, '0'] }, Mt2 = { sup: [Mt, '2'] };
  const vVec = { vec: [Mv] }, aVec = { vec: [Ma] };
  const pv = s => ({ v: 'c-o', t: String(s), m: 'velocidad' }), pt = s => ({ v: 'c-i', t: String(s), m: 'tiempo' });
  const ps = s => ({ v: 'c-f', t: String(s), m: 'giro' }), pa = s => ({ v: 'c-h', t: String(s), m: 'aceleración' });
  const neg = l => ({ negrita: [l] });
  // Al cuadrado. Una base que no es un solo número ni una sola letra va entre paréntesis: (2π)², no «2π²», que se lee
  // 2 · π² (igualdad-falsa, Etapa 6, 19 nov: «2π² · 0,25 = π²» era falsa). Con { par }, { frac } u otra pieza, la
  // llamada decide.
  const BASE_SOLA = /^(\d+(,\d+)?|\p{L})$/u;
  const cuad = q => {
    const t = typeof q === 'string' ? q : q && typeof q.t === 'string' ? q.t : null;
    return { sup: [t !== null && !BASE_SOLA.test(t) ? { par: [q] } : q, '2'] };
  };
  const sub = (x, i) => ({ sub: [x, i] });
  const COLORES = { velocidad: 'o', tiempo: 'i', giro: 'f', aceleración: 'h' };
  // «a_c» y «a_T» escritos en un texto pasan a ser fichas con subíndice de verdad (molde §5): sx('… a_c …').
  const sx = t => String(t).split(/(a_c|a_T)/).filter(Boolean).map(x => (x === 'a_c' ? Mac : x === 'a_T' ? MaT : x));
  const giroF = (d, estado = {}) => ({ pieza: 'fis-giro', datos: d, estado });

  // ======================= B1: el ángulo girado y el arco (la rueda de la fortuna) =======================
  // Cambia: cuánto gira la rueda · Permanece: el radio de 8 m y la cabina que parte de abajo · Progresa: el arco violeta
  // que deja la cabina · Se reserva: la vuelta entera (el juego llega a 6 rad, no a 2π) · Debe verse: el arco mide θ
  // radios.
  // La rueda: eje en (150; 116), 80 px de radio = 8 m (10 px por metro). La cabina parte de abajo (270°) y gira contra
  // las agujas del reloj.
  const RUEDA = { tipo: 'rueda', c: [150, 116], R: 80, cabinas: 8 };
  // El rótulo del radio va afuera de la rueda, a la izquierda, junto a la punta del radio punteado: adentro lo tachaban
  // los rayos (lector en frío A, 19 nov).
  const RADIO_RUEDA = t => ({ x: 8, y: 110, texto: t, ancla: 'start' });
  const R_B1 = 8;
  const deg = th => th * 180 / PI;
  function ruedaB1(th, o = {}) {
    const a = 270 + deg(th);
    return {
      alto: 238, cuerpos: [Object.assign({}, RUEDA, { giro: deg(th) })],
      puntos: [{ ang: a, tipo: 'cabina' }],
      arcos: [th > 0 ? { de: 270, a, texto: o.sinArco ? undefined : (o.arco || `s = ${f(R_B1 * th)} m`), afuera: 26 } : null,
        th > 0 && !o.sinAngulo ? { tipo: 'angulo', de: 270, a, rpx: 20, texto: o.angulo || 'θ' } : null].filter(Boolean),
      radios: [{ ang: 270 }, { ang: a }, { ang: 180, discontinuo: true }], textos: [RADIO_RUEDA('r = 8 m')],
      alt: o.alt || `Rueda de la fortuna de 8 m de radio. Tu cabina partió de abajo y la rueda giró ${f(th)} rad.`,
    };
  }
  const juegoB1 = val => giroF(ruedaB1(val.th));
  // Gesto directo (docs/teoria.md §4b): la cabina se arrastra por el aro; el ángulo desde abajo es lo que giró.
  const cabinaB1 = val => { const a = rad(270 + deg(val.th)); return { x: RUEDA.c[0] + RUEDA.R * Math.cos(a), y: RUEDA.c[1] - RUEDA.R * Math.sin(a) }; };
  function giroDeCabina(pt0, val) {
    let a = Math.atan2(-(pt0.y - RUEDA.c[1]), pt0.x - RUEDA.c[0]) * 180 / PI - 270;
    while (a < 0) a += 360;
    while (a >= 360) a -= 360;
    if (deg(val.th) > 300 && a < 60) a = 359;     // pasar por abajo no salta de 6 rad a 0
    return { th: Math.min(6, Math.max(0.25, rad(a))) };
  }
  // Predice: la vuelta completa, que el juego no alcanzó; Mira: 1 rad, 3 rad, media vuelta y la vuelta entera.
  const PRED_B1 = { alto: 238, cuerpos: [Object.assign({}, RUEDA)], puntos: [{ ang: 270, tipo: 'cabina' }],
    arcos: [{ de: 270, a: 630, discontinuo: true, color: 'tinta', texto: 'una vuelta: θ = ? rad', medio: 90, afuera: 20 }], radios: [{ ang: 180, discontinuo: true }], textos: [RADIO_RUEDA('r = 8 m')],
    alt: 'Rueda de la fortuna de 8 m de radio; una línea punteada marca la vuelta completa de tu cabina.' };
  const corteB1 = (th, o) => { const d = ruedaB1(th, o); return { cuerpos: d.cuerpos, puntos: d.puntos, arcos: d.arcos, radios: d.radios, textos: d.textos }; };
  const MIRA_B1 = { alto: 238, cuerpos: [RUEDA], alt: 'Rueda de la fortuna de 8 m de radio: tu cabina da la vuelta y su camino se mide en radios.',
    cortes: [corteB1(1, { arco: 's = 8 m', angulo: '1 rad' }), corteB1(3, { arco: 's = 24 m', angulo: '3 rad' }), corteB1(PI, { arco: 's = 25,13 m', angulo: 'π rad' }),
      corteB1(2 * PI - 1e-6, { arco: 's = 50,27 m', angulo: '2π rad' }), corteB1(2 * PI - 1e-6, { arco: 's = 50,27 m', angulo: '360°' })] };

  // Datos de cada ejercicio (contrato, punto 13): herramientas, nunca el paso hecho; ningún atajo ni consejo.
  const D1 = {
    arco: ['Arco que recorre un punto a r del eje: ', Ms, ' = ', Mth, ' · r, con ', Mth, ' en radianes'],
    vuelta: '1 vuelta = 2π rad = 360°',
    grado: '180° = π rad',
    pi: 'π vale unos 3,14',
    rueda: 'Al rodar sin resbalar, la rueda avanza lo mismo que el arco que recorre su borde',
    cm: '1 m = 100 cm',
    min: 'El minutero da una vuelta en 60 min; el horario, en 12 h',
    minutero: 'El minutero da una vuelta en 60 min',
  };
  // Figuras de los ejemplos y de los casos generados: lo que cada dato marca por sí solo; lo pedido, con «?» en tinta.
  const figRueda = (o = {}) => giroF({ alto: 238, cuerpos: [Object.assign({}, RUEDA, { giro: o.giro || 0 })],
    puntos: [{ ang: 270 + (o.giro || 0), tipo: 'cabina' }],
    arcos: [o.arco ? { de: 270, a: 270 + (o.giro || 0), texto: o.arco, color: o.arco === '?' ? 'tinta' : undefined, afuera: 26 } : null,
      o.angulo ? { tipo: 'angulo', de: 270, a: 270 + (o.giro || 0), rpx: 20, texto: o.angulo, color: o.angulo === '?' ? 'tinta' : undefined } : null].filter(Boolean),
    radios: [{ ang: 270 }, { ang: 270 + (o.giro || 0) }, { ang: 180, discontinuo: true }], textos: o.radio === false ? [] : [RADIO_RUEDA(o.radio || 'r = 8 m')], alt: o.alt });
  const CARRUSEL = { tipo: 'carrusel', c: [160, 118], R: 100 };
  const figCarrusel = (o = {}) => giroF({ alto: 240, cuerpos: [Object.assign({}, CARRUSEL, { giro: o.giro0 || 0 })],
    puntos: (o.caballos || [{ f: 0.8, ang: (o.de || 0) + (o.giro || 0) }]).map(c => ({ ang: c.ang, f: c.f, tipo: 'caballo', texto: c.texto, lado: c.lado })),
    arcos: (o.arcos || []).map(x => Object.assign({ afuera: 20 }, x, { color: x.texto === '?' ? 'tinta' : x.color })),
    radios: o.radios || [], flechas: o.flechas || [], sentido: o.sentido || [{ f: 1.12, de: 100, a: 150 }], textos: o.textos || [], alt: o.alt });
  const VENT = { tipo: 'ventilador', c: [165, 112], R: 92 };
  const figVent = (o = {}) => giroF({ alto: 228, cuerpos: [Object.assign({}, VENT, { giro: o.giro || 20 })], sentido: [{ f: 1.1, de: 30, a: 80 }],
    reloj: o.reloj, textos: o.textos || [], arcos: o.arcos || [], radios: o.radios || [], flechas: o.flechas || [], alt: o.alt });
  const LLANTA = { tipo: 'llanta', c: [160, 98], R: 74, piso: true };
  // El rótulo del radio, afuera a la derecha, junto a la punta del radio (adentro lo tachaban los rayos; lector B, 5.14).
  const figLlanta = (o = {}) => giroF({ alto: 200, cuerpos: [Object.assign({}, LLANTA, { giro: o.giro || 0 })], radios: [{ ang: 0 }],
    sentido: [{ f: 1.15, de: 110, a: 160, horario: false }], textos: [...(o.textos || []), ...(o.radio ? [{ x: 312, y: 116, texto: o.radio, ancla: 'end' }] : [])], alt: o.alt });
  const RELOJ = { tipo: 'reloj', c: [160, 110], R: 88 };
  const figReloj = (o = {}) => giroF({ alto: 238, cuerpos: [Object.assign({}, RELOJ, { agujas: o.agujas || [{ ang: 90, f: 0.85, grosor: 2.5 }] })],
    arcos: o.arcos || [], textos: o.textos || [], alt: o.alt });

  // Ejemplos resueltos de B1 (pestaña «Ejemplos»). Cuentas rehechas con un script aparte que no usa este archivo
  // (scratchpad e5-fisica-b/cuentas-b.js, 19 nov: mide cada arco sumando trocitos de cuerda, sin s = θ·r): 2·8; 3·2π;
  // 90·π/180; 6/4; (π/3)·(180/π); π/2·8; 6π/0,3 y 20π/2π; (1/3)·2π·15; 7/3,5 y 2·2; 10π/(5π/6); 2π·0,35·100;
  // 2π·0,1·15; 15/0,3; 3·2π − 2π/4; 20/8 y 2,5·180/π; y el valor de cada alternativa equivocada con el error que dice
  // el resuelto.
  const EJEMPLOS_ARCO = [
    { nivel: 1, titulo: 'El camino de tu cabina',
      figura: figRueda({ giro: deg(2), angulo: '2 rad', arco: '?' }),
      enunciado: ['La rueda de la fortuna tiene 8 m de radio y gira ', ps('2 rad'), '. ¿Qué camino recorre tu cabina?'],
      datos: [D1.arco],
      solucion: [{ texto: 'Cada radián de giro, la cabina recorre un radio, 8 m; con 2 rad recorre dos radios.', ecuacion: [Ms, ' = ', ps('2'), ' · 8 = ', ps('16 m')] }],
      respuesta: ['Recorre ', ps('16 m')] },
    { nivel: 1, titulo: 'De vueltas a radianes',
      figura: figVent({ textos: [{ x: 8, y: 220, texto: '3 vueltas', color: 'f', ancla: 'start' }] }),
      enunciado: ['Las aspas de un ventilador dan ', ps('3 vueltas'), '. ¿Cuántos radianes giran?'],
      datos: [D1.vuelta],
      solucion: [{ texto: 'Cada vuelta completa son 2π rad, así que se multiplican las 3 vueltas por 2π.', ecuacion: [Mth, ' = ', ps('3'), ' · 2π = ', ps('6π rad')] }],
      respuesta: ['Giran ', ps('6π rad'), ', unos ', ps('18,85 rad')] },
    { nivel: 1, titulo: 'Un cuarto de vuelta',
      figura: figRueda({ giro: 90, angulo: '90°', radio: false }),
      enunciado: ['La rueda de la fortuna gira ', ps('90°'), ' desde que subiste. ¿Cuántos radianes son?'],
      datos: [D1.grado],
      solucion: [{ texto: 'Media vuelta son 180° o π rad, así que cada grado vale π/180 rad.', ecuacion: [Mth, ' = ', ps('90'), ' · ', { frac: ['π', '180'] }, ' = ', ps('π/2 rad')] }],
      respuesta: [ps('π/2 rad'), ', unos ', ps('1,57 rad')] },
    { nivel: 1, titulo: 'El ángulo del caballo',
      figura: figCarrusel({ caballos: [{ f: 1, ang: 30 + deg(1.5), texto: 'caballo' }], arcos: [{ de: 30, a: 30 + deg(1.5), texto: '6 m', f: 1 }, { tipo: 'angulo', de: 30, a: 30 + deg(1.5), rpx: 24, texto: '?' }],
        radios: [{ ang: 30, texto: 'r = 4 m', lado: -1 }, { ang: 30 + deg(1.5) }], sentido: [] }),
      enunciado: ['Un caballo del borde del carrusel, a 4 m del eje, recorre ', ps('6 m'), '. ¿Qué ángulo gira el carrusel?'],
      datos: [D1.arco],
      solucion: [{ texto: 'El ángulo dice cuántos radios mide el arco, así que se divide el arco entre el radio.', ecuacion: [Mth, ' = ', { frac: [Ms, 'r'] }, ' = ', { frac: [ps('6'), '4'] }, ' = ', ps('1,5 rad')] }],
      respuesta: ['Gira ', ps('1,5 rad')] },
    { nivel: 1, titulo: 'De radianes a grados',
      figura: figReloj({ agujas: [{ ang: 30, f: 0.85, grosor: 2.5 }], arcos: [{ tipo: 'angulo', de: 30, a: 90, rpx: 30, texto: 'π/3 rad' }] }),
      enunciado: ['El minutero del reloj de la plaza gira ', ps('π/3 rad'), '. ¿Cuántos grados son?'],
      datos: [D1.grado],
      solucion: [{ texto: 'Como π rad son 180°, cada radián vale 180°/π, y la π se cancela.', ecuacion: [{ frac: [ps('π'), '3'] }, ' · ', { frac: ['180°', 'π'] }, ' = ', ps('60°')] }],
      respuesta: ['Son ', ps('60°'), ': diez minutos'] },
    { nivel: 2, titulo: 'Un cuarto de vuelta, en metros',
      figura: figRueda({ giro: 90, angulo: '90°', arco: '?' }),
      enunciado: ['La rueda de la fortuna, de 8 m de radio, gira ', ps('90°'), '. ¿Qué camino recorre tu cabina?'],
      datos: [D1.arco, D1.grado],
      solucion: [
        { texto: 'La fórmula del arco pide el ángulo en radianes, así que primero se pasan los 90°:', ecuacion: [Mth, ' = ', ps('90'), ' · ', { frac: ['π', '180'] }, ' = ', ps('π/2 rad')] },
        { texto: 'Con el ángulo en radianes, el arco es ese ángulo por el radio de 8 m:', ecuacion: [Ms, ' = ', { frac: [ps('π'), '2'] }, ' · 8 = ', ps('4π m'), ' ≈ ', ps('12,57 m')] },
      ],
      respuesta: ['Recorre ', ps('4π m'), ', unos ', ps('12,57 m')] },
    { nivel: 2, titulo: '¿Cuántas vueltas da la llanta?',
      figura: figLlanta({ radio: 'r = 30 cm', textos: [{ x: 8, y: 22, texto: 's = 6π m', color: 'f' }] }),
      enunciado: ['Un punto del borde de una llanta de 30 cm de radio recorre ', ps('6π m'), ', unos 18,85 m. ¿Cuántas vueltas da la llanta?'],
      datos: [D1.arco, D1.vuelta, D1.cm],
      solucion: [
        { texto: 'El ángulo es el arco entre el radio, los dos en metros; 30 cm son 0,3 m:', ecuacion: [Mth, ' = ', { frac: [ps('6π'), '0,3'] }, ' = ', ps('20π rad')] },
        { texto: 'Cada vuelta son 2π rad, así que para contar vueltas se divide el ángulo entre 2π:', ecuacion: [MN, ' = ', { frac: [ps('20π'), '2π'] }, ' = ', ps('10 vueltas')] },
      ],
      respuesta: ['Da ', ps('10 vueltas')] },
    { nivel: 2, titulo: 'La punta del minutero',
      // El camino de la punta en 20 min (de las 12 a las 4), punteado y con «?» (lector B, tarjeta 02).
      figura: figReloj({ agujas: [{ ang: 90, f: 0.85, grosor: 2.5 }], arcos: [{ de: -30, a: 90, f: 0.85, texto: '?', color: 'tinta' }],
        textos: [{ x: 8, y: 22, texto: 'minutero: 15 cm', ancla: 'start' }, { x: 312, y: 22, texto: '20 min', color: 'i', ancla: 'end' }],
        alt: 'Un reloj con el minutero en las 12; una línea punteada marca el camino de su punta hasta las 4.' }),
      enunciado: ['El minutero de un reloj mide 15 cm. ¿Qué camino recorre su punta en ', pt('20 min'), '?'],
      datos: [D1.arco, D1.vuelta, D1.minutero],
      solucion: [
        { texto: 'El minutero da la vuelta en 60 min, así que en 20 min gira un tercio de vuelta:', ecuacion: [Mth, ' = ', { frac: ['1', '3'] }, ' · 2π = ', ps('2π/3 rad')] },
        { texto: 'La punta está a 15 cm del eje, así que su arco es ese ángulo por 15 cm:', ecuacion: [Ms, ' = ', { frac: [ps('2π'), '3'] }, ' · 15 = ', ps('10π cm'), ' ≈ ', ps('31,42 cm')] },
      ],
      respuesta: ['Recorre ', ps('10π cm'), ', unos ', ps('31,42 cm')] },
    { nivel: 2, titulo: 'Ana recorre, Beto también',
      figura: figCarrusel({ caballos: [{ f: 0.875, ang: 20, texto: 'Ana' }, { f: 0.5, ang: 200, texto: 'Beto', lado: 1 }],
        radios: [{ ang: 20, f: 0.875, texto: '3,5 m', lado: -1 }, { ang: 200, f: 0.5, texto: '2 m', lado: 1 }], sentido: [] }),
      enunciado: ['En el carrusel, Ana va a 3,5 m del eje y Beto, a 2 m. Mientras el carrusel gira, Ana recorre ', ps('7 m'), '. ¿Cuánto recorre Beto?'],
      datos: [D1.arco],
      solucion: [
        { texto: 'Ana y Beto van en el mismo carrusel, así que giran el mismo ángulo. Con los datos de Ana:', ecuacion: [Mth, ' = ', { frac: [ps('7'), '3,5'] }, ' = ', ps('2 rad')] },
        { texto: 'Beto gira esos mismos 2 rad, pero más cerca del eje, a 2 m, así que recorre menos:', ecuacion: [Ms, ' = ', ps('2'), ' · 2 = ', ps('4 m')] },
      ],
      respuesta: ['Beto recorre ', ps('4 m')] },
    { nivel: 2, titulo: '¿Qué radio tiene la rueda?',
      figura: figRueda({ giro: 150, angulo: '150°', arco: '10π m', radio: 'r = ?' }),
      enunciado: ['Cuando una rueda de la fortuna gira ', ps('150°'), ', tu cabina recorre ', ps('10π m'), ', unos 31,4 m. ¿Qué radio tiene la rueda?'],
      datos: [D1.arco, D1.grado],
      solucion: [
        { texto: 'Primero se pasan los 150° a radianes:', ecuacion: [Mth, ' = ', ps('150'), ' · ', { frac: ['π', '180'] }, ' = ', ps('5π/6 rad')] },
        { texto: 'De s = θ · r se despeja el radio: es el arco dividido entre el ángulo.', ecuacion: ['r = ', { frac: [ps('10π'), ps('5π/6')] }, ' = 12 m'] },
      ],
      respuesta: [neg('r = 12 m')] },
    { nivel: 3, titulo: 'La bicicleta que avanza',
      figura: figLlanta({ radio: 'r = 35 cm', textos: [{ x: 312, y: 22, texto: '100 vueltas', color: 'f', ancla: 'end' }] }),
      enunciado: ['La llanta de una bicicleta tiene 35 cm de radio y da ', ps('100 vueltas'), ' sin resbalar. ¿Cuánto avanza la bicicleta?'],
      alternativas: ['35 m', '35π m', '70π m', '140π m', '7000π m'],
      datos: [D1.arco, D1.vuelta, D1.rueda, D1.cm],
      solucion: [
        { texto: 'Sin resbalar, la bicicleta avanza lo mismo que el arco del borde. Primero, el ángulo:', ecuacion: [Mth, ' = ', ps('100'), ' · 2π = ', ps('200π rad')] },
        { texto: 'El arco es ese ángulo por el radio, pasado a metros: 35 cm son 0,35 m.', ecuacion: [Ms, ' = ', ps('200π'), ' · 0,35 = ', ps('70π m'), ' ≈ ', ps('219,9 m')] },
        { texto: ['La ', neg('A'), ' cuenta cada vuelta como 1 rad, y una vuelta son 2π rad. La ', neg('B'), ' olvida el 2 de 2π, como si cada vuelta fuera media. La ', neg('D'), ' multiplica por el diámetro, 70 cm, en vez del radio. La ', neg('E'), ' deja el radio en centímetros.'] },
      ],
      respuesta: [neg('C'), ', ', ps('70π m'), ', unos ', ps('220 m')] },
    { nivel: 3, titulo: 'El balde del pozo',
      figura: giroF({ alto: 200, cuerpos: [{ tipo: 'polea', c: [160, 90], R: 60 }], radios: [{ ang: 150, texto: 'r = 10 cm', lado: 1 }],
        sentido: [{ f: 1.2, de: 20, a: 80 }], textos: [{ x: 8, y: 22, texto: '15 vueltas', color: 'f' }, { x: 222, y: 186, texto: 'el balde: ?', ancla: 'middle' }],
        alt: 'El torno de un pozo, de 10 cm de radio, que da 15 vueltas; la soga se enrolla y sube el balde.' }),
      enunciado: ['El torno de un pozo tiene 10 cm de radio. La soga del balde se enrolla en él sin resbalar. Si el torno da ', ps('15 vueltas'), ', ¿cuánto sube el balde?'],
      alternativas: ['1,5 m', '1,5π m', '300π m', '6π m', '3π m'],
      datos: [D1.arco, D1.vuelta, D1.cm],
      solucion: [
        { texto: 'La soga que se enrolla mide lo mismo que el arco del borde del torno. Primero, el ángulo:', ecuacion: [Mth, ' = ', ps('15'), ' · 2π = ', ps('30π rad')] },
        { texto: 'El arco es ese ángulo por el radio, en metros: 10 cm son 0,1 m.', ecuacion: [Ms, ' = ', ps('30π'), ' · 0,1 = ', ps('3π m'), ' ≈ ', ps('9,42 m')] },
        { texto: ['La ', neg('A'), ' cuenta cada vuelta como 1 rad, y son 2π rad. La ', neg('B'), ' olvida el 2 de 2π, como si cada vuelta fuera media. La ', neg('C'), ' deja los 10 cm sin pasar a metros. La ', neg('D'), ' usa el diámetro, 20 cm, en vez del radio.'] },
      ],
      respuesta: [neg('E'), ', sube ', ps('3π m'), ', unos ', ps('9,42 m')] },
    { nivel: 3, titulo: 'La llanta que rueda 15 m',
      figura: figLlanta({ radio: 'r = 30 cm', textos: [{ x: 312, y: 22, texto: 'avanza 15 m', color: 'f', ancla: 'end' }] }),
      enunciado: ['Una llanta de 30 cm de radio rueda sin resbalar y avanza ', ps('15 m'), '. ¿Cuántos radianes gira?'],
      alternativas: ['50 rad', '0,5 rad', '4,5 rad', '25 rad', '8 rad'],
      datos: [D1.arco, D1.rueda, D1.cm],
      solucion: [
        { texto: 'Sin resbalar, el borde recorre un arco igual a lo que avanza, 15 m. El ángulo es ese arco entre el radio, en metros:', ecuacion: [Mth, ' = ', { frac: [ps('15'), '0,3'] }, ' = ', ps('50 rad')] },
        { texto: ['La ', neg('B'), ' divide entre 30 sin pasar los centímetros a metros. La ', neg('C'), ' multiplica el arco por el radio, cuando hay que dividir. La ', neg('D'), ' divide entre el diámetro, 0,6 m. La ', neg('E'), ' da las vueltas, unas 8, como si fueran radianes.'] },
      ],
      respuesta: [neg('A'), ', gira ', ps('50 rad')] },
    { nivel: 3, titulo: 'Minutero contra horario',
      figura: figReloj({ agujas: [{ ang: 90, f: 0.85, grosor: 2.5 }, { ang: 90, f: 0.55, grosor: 4 }], textos: [{ x: 312, y: 22, texto: '3 h', color: 'i', ancla: 'end' }] }),
      enunciado: ['A las 12:00, el minutero y el horario de un reloj están juntos. Hasta las 3:00, ¿cuántos radianes más gira el minutero que el horario?'],
      alternativas: ['6π rad', '990 rad', '13π/2 rad', '11π/2 rad', '2,75 rad'],
      datos: [D1.vuelta, D1.min],
      solucion: [
        { texto: 'En 3 h, el minutero da 3 vueltas, una por hora; el horario tarda 12 h en dar la suya, así que da solo un cuarto:', ecuacion: [ps('3'), ' · 2π = ', ps('6π rad'), ';   ', { frac: ['3', '12'] }, ' · 2π = ', ps('π/2 rad')] },
        { texto: 'Lo que gira de más el minutero es la diferencia de los dos ángulos:', ecuacion: [ps('6π'), ' − ', { frac: [ps('π'), '2'] }, ' = ', ps('11π/2 rad')] },
        { texto: ['La ', neg('A'), ' olvida que el horario también gira. La ', neg('C'), ' suma los dos ángulos, cuando piden cuánto gira uno de más. La ', neg('B'), ' resta en grados, 1080° − 90°, y no pasa a radianes. La ', neg('E'), ' resta vueltas, 3 − 0,25, y las da como radianes.'] },
      ],
      respuesta: [neg('D'), ', ', ps('11π/2 rad')] },
    { nivel: 3, titulo: 'Tu cabina, en grados',
      figura: figRueda({ giro: deg(2.5), angulo: '?', arco: '20 m' }),
      enunciado: ['En la rueda de la fortuna, de 8 m de radio, tu cabina recorre ', ps('20 m'), '. ¿Cuántos grados giró la rueda?'],
      alternativas: ['2,5°', '143°', '450°', '160°', '0,4°'],
      datos: [D1.arco, D1.grado, D1.pi],
      solucion: [
        { texto: 'Primero el ángulo en radianes, que dice cuántos radios mide el arco:', ecuacion: [Mth, ' = ', { frac: [ps('20'), '8'] }, ' = ', ps('2,5 rad')] },
        { texto: 'Después se pasa a grados: se multiplica por 180° y se divide entre π.', ecuacion: [ps('2,5'), ' · ', { frac: ['180°', '3,14'] }, ' ≈ ', ps('143°')] },
        { texto: ['La ', neg('A'), ' deja los 2,5 rad como si fueran grados. La ', neg('C'), ' multiplica por 180 y olvida dividir entre π. La ', neg('D'), ' multiplica el arco por el radio, 20 · 8. La ', neg('E'), ' divide al revés, 8 entre 20.'] },
      ],
      respuesta: [neg('B'), ', unos ', ps('143°')] },
  ];

  // Casos de «Ahora tú» y «Así se resuelve» de B1. Ninguno es el de Predice (la vuelta entera de la rueda).
  const OBJ_B1 = [
    { quien: 'tu cabina', donde: 'La rueda de la fortuna', r: [6, 8, 12], fig: (giro, o) => figRueda(Object.assign({ giro }, o)) },
    { quien: 'un caballo del borde', donde: 'El carrusel de la plaza', r: [2, 3, 4], fig: (giro, o) => figCarrusel({ caballos: [{ f: 1, ang: 30 + giro }],
      arcos: [o.arco ? { de: 30, a: 30 + giro, texto: o.arco, f: 1 } : null, o.angulo ? { tipo: 'angulo', de: 30, a: 30 + giro, rpx: 24, texto: o.angulo, color: o.angulo === '?' ? 'tinta' : undefined } : null].filter(Boolean),
      radios: [{ ang: 30, texto: o.radio, lado: -1 }, { ang: 30 + giro }], sentido: [] }) },
  ];
  const GRADOS_B1 = [30, 45, 60, 120, 135, 150, 270];
  const arcoB1 = {
    id: 'arco-y-radian',
    titulo: 'El ángulo girado y el arco',
    pregunta: '¿Cuántos radianes tiene una vuelta completa?',
    temas: ['Magnitudes angulares'],
    pieza: 'fis-giro',
    aprendizaje: 'Un radián abarca un arco de un radio. Una vuelta son 2π rad, y el arco es s = θ·r, con θ en radianes.',
    actividad: 'Girar la rueda de la fortuna y medir el camino de tu cabina.',
    lee: {
      tarjetas: [
        { titulo: 'La rueda de la fortuna', texto: ['Subes a la rueda de la fortuna de la feria y tu cabina parte de abajo. Al girar la rueda, la cabina recorre un camino curvo: un arco, ', Ms, '. Lo que giró la rueda se mide con el ángulo ', Mth, ', que se llama desplazamiento angular.'],
          dibujo: figRueda({ giro: 120, angulo: 'θ', arco: 's' }) },
        { titulo: 'El radio como regla', texto: 'Del eje a tu cabina hay 8 m: ese es el radio de la rueda, r. Los ángulos también se miden en radianes, con el radio como regla: un ángulo de 1 rad es el que hace recorrer a la cabina un arco tan largo como el radio. Si llevaste Trigonometría, es la pita que se enrolla en su rueda.' },
        { titulo: 'Qué mirar al jugar', texto: 'Gira la rueda de a cuarto de radián y mira cómo crece el camino de tu cabina. Compáralo cada vez con el radio: ¿cuántos radios mide el arco cuando la rueda giró 1 rad, 2 rad o 3 rad?' },
      ],
    },
    ejemplos: EJEMPLOS_ARCO,
    juega: {
      pieza: 'fis-giro',
      consigna: 'La rueda de la fortuna de la feria tiene 8 m de radio. Tu cabina parte de abajo; tú decides cuánto gira la rueda.',
      mision: {
        texto: 'Gira la rueda hasta que el camino de tu cabina mida igual que el radio.',
        // Una sola posición lo logra: 1 rad (8 m de arco).
        logrado: val => Math.abs(val.th - 1) < 1e-9,
        bien: 'Eso es un radián: el arco mide un radio, 8 m; la rueda giró unos 57°.',
      },
      voz: '¿Cuántos radios mide el camino de tu cabina?',
      leyenda: [
        { s: [Ms], t: 'el camino de tu cabina, en metros' },
        { s: [Mth], t: 'lo que giró la rueda, en radianes' },
        { s: 'r', t: 'del eje a la cabina: 8 m' },
        { s: 'cabina pintada', t: 'tu cabina' },
      ],
      controles: [{ id: 'th', etiqueta: 'Gira, θ', color: 'c-f', min: 0.25, max: 6, paso: 0.25, inicio: 0.5, unidad: 'rad', decimales: 2 }],
      dibujo: juegoB1,
      // La lectura dice cuántos radios mide el arco; no llega a la vuelta entera (eso queda para Predice y Mira).
      lectura: val => ['Giró ', ps(`${f(val.th)} rad`), ': el arco mide ', `${f(val.th)} ${Math.abs(val.th - 1) < 1e-9 ? 'radio' : 'radios'}`, ', ', ps(`${f(R_B1 * val.th)} m`)],
      resumen: { th: 1.5 },
      minimo: 3,
      arrastres: [{ id: 'cabina', etiqueta: 'tu cabina (cuánto gira la rueda)', color: 'c-f', donde: cabinaB1, mover: giroDeCabina }],
    },
    predice: {
      pregunta: 'La rueda da una vuelta completa: tu cabina vuelve abajo. ¿Cuántos radianes giró?',
      // Sin «el juego llegó a 6 rad sin completar la vuelta»: dejaba solo dos opciones mayores que 6 (lector en frío A).
      datos: ['Un radián: el ángulo cuyo arco mide un radio.', 'π vale unos 3,14.'],
      opciones: [
        { id: 'c', texto: '2π rad, unos 6,28 rad', correcta: true },
        { id: 'grados', texto: '360 rad', error: 'AN-GRADOS', siFuera: 'Una vuelta sí son 360, pero 360 grados, no radianes. Un radián es mucho más grande que un grado, unos 57°, así que en una vuelta caben muchos menos radianes que grados.' },
        { id: 'media', texto: 'π rad, unos 3,14 rad', error: 'AN-MEDIA', siFuera: 'Con π rad la rueda da solo media vuelta: el arco mide π radios, unos 25 m, y la cabina queda arriba, no abajo. Para volver abajo falta otra media vuelta igual.' },
        { id: 'vuelta', texto: '1 rad', error: 'AN-VUELTA', siFuera: 'Un radián es el ángulo cuyo arco mide un radio, 8 m, y la vuelta entera es mucho más larga. En el juego, con 6 rad la cabina todavía no había vuelto abajo.' },
      ],
      dibujo: giroF(PRED_B1),
      revelar: giroF(MIRA_B1, { corte: 3 }),
      coincide: 'Coincide: la vuelta mide 2π radios, unos 6,28 radios, así que son 2π rad.',
    },
    mira: {
      pieza: 'fis-giro',
      datos: MIRA_B1,
      pasos: [
        { estado: { corte: 0 }, texto: 'Con un radián, tu cabina recorre un arco igual al radio, 8 m. Por eso el radián sirve de regla: cuenta cuántos radios mide el camino.', ecuacion: [Ms, ' = ', ps('1'), ' · 8 = ', ps('8 m')] },
        { estado: { corte: 1 }, texto: 'Con 3 rad, el arco mide tres radios, 24 m, y la cabina ya está cerca de arriba: le falta poco para la media vuelta.', ecuacion: [Ms, ' = ', ps('3'), ' · 8 = ', ps('24 m')] },
        { estado: { corte: 2 }, texto: 'La media vuelta mide π radios, unos 3,14 radios de 8 m. Por eso media vuelta son π rad, y no un número redondo.', ecuacion: [Ms, ' = ', ps('π'), ' · 8 ≈ ', ps('25,13 m')] },
        { estado: { corte: 3 }, texto: 'La vuelta entera es el doble de la media: mide 2π radios, así que una vuelta son 2π rad, unos 6,28 rad.', ecuacion: [Ms, ' = ', ps('2π'), ' · 8 ≈ ', ps('50,27 m')] },
        { estado: { corte: 4 }, texto: 'En grados, la misma vuelta son 360°. Si 2π rad valen 360°, un radián vale 360° entre 2π, unos 57,3°.', ecuacion: [ps('2π rad'), ' = ', ps('360°'), '   →   ', ps('1 rad'), ' = ', { frac: ['180°', 'π'] }, ' ≈ ', ps('57,3°')] },
      ],
    },
    regla: {
      texto: 'El ángulo girado θ, medido en radianes, dice cuántos radios mide el arco que recorre un punto. Por eso el camino de un punto a r del eje es s = θ · r: en la rueda de 8 m, girar 2 rad son 16 m. Una vuelta entera mide 2π radios, así que son 2π rad, lo mismo que 360°.',
      // Una igualdad por renglón (lectores en frío, 19 nov): la de la vuelta va en la condición.
      ecuacion: [Ms, ' = ', { llave: [Mth, ' · r'], nota: 'θ en radianes', color: 'c-f' }],
      condicion: 'θ está en radianes: con grados, θ · r sale unas 57 veces más grande. Si una rueda rueda sin resbalar, avanza lo que mide el arco de su borde; si patina, avanza menos.',
    },
    // Así se resuelve: dos preguntas que «Ahora tú» no hace (el radio con el arco, y de radianes a grados).
    resuelve: {
      pieza: 'fis-giro',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 0) {
          const g = r.de([60, 90, 120, 180]), ra = r.de([4, 6, 8, 12]), k = ra * g / 180;
          return {
            enunciado: ['Cuando la rueda de la fortuna gira ', ps(`${g}°`), ', tu cabina recorre ', ps(`${enPi(k)} m`), '. ¿Qué radio tiene la rueda?'],
            datos: [D1.arco, D1.grado],
            dibujo: figRueda({ giro: g, angulo: `${g}°`, arco: `${enPi(k)} m`, radio: 'r = ?' }),
            pasos: [
              { tipo: 'pide', texto: 'Piden el radio r: la distancia del eje a tu cabina.' },
              { tipo: 'datos', texto: ['La rueda gira ', ps(`${g}°`), ' y la cabina recorre ', ps(`${enPi(k)} m`), '.'] },
              { tipo: 'regla', texto: 'El arco es el ángulo por el radio, con el ángulo en radianes.', ecuacion: [Ms, ' = ', Mth, ' · r'] },
              { tipo: 'cuentas', texto: 'Paso los grados a radianes, porque la fórmula del arco solo vale en radianes. Después despejo r: el arco dividido entre el ángulo.',
                ecuacion: [Mth, ' = ', ps(`${g}`), ' · ', { frac: ['π', '180'] }, ' = ', ps(`${enPi(g / 180)} rad`), '   →   r = ', { frac: [ps(enPi(k)), ps(enPi(g / 180))] }, ` = ${f(ra)} m`] },
              { tipo: 'sentido', texto: `Compruebo: un radio de ${f(ra)} m por ${enPi(g / 180)} rad da ${enPi(k)} m, el arco del enunciado, así que el radio está bien.` },
            ],
            respuesta: [neg(`r = ${f(ra)} m`)],
          };
        }
        const [k, txt, g] = r.de([[1 / 6, 'π/6', 30], [1 / 4, 'π/4', 45], [2 / 3, '2π/3', 120], [3 / 4, '3π/4', 135], [5 / 6, '5π/6', 150], [3 / 2, '3π/2', 270], [5 / 3, '5π/3', 300]]);
        return {
          enunciado: ['El carrusel de la plaza gira ', ps(`${txt} rad`), '. ¿Cuántos grados son?'],
          datos: [D1.grado],
          dibujo: figCarrusel({ caballos: [{ f: 1, ang: 30 + g }], arcos: [{ tipo: 'angulo', de: 30, a: 30 + g, rpx: 24, texto: `${txt} rad` }], radios: [{ ang: 30 }, { ang: 30 + g }], sentido: [] }),
          pasos: [
            { tipo: 'pide', texto: 'Piden el mismo ángulo, medido en grados.' },
            { tipo: 'datos', texto: ['El carrusel gira ', ps(`${txt} rad`), '.'] },
            { tipo: 'regla', texto: 'Media vuelta mide 180° y también π rad, así que cada radián vale 180°/π, unos 57,3°.', ecuacion: ['180° = π rad'] },
            { tipo: 'cuentas', texto: 'Multiplico por 180°/π para cambiar de unidad: la π del ángulo se cancela con la de abajo y quedan grados.', ecuacion: [ps(`${txt}`), ' · ', { frac: ['180°', 'π'] }, ' = ', ps(`${g}°`)] },
            { tipo: 'sentido', texto: `Tiene sentido: ${g}° es el ${f(g / 360 * 100, 1)} % de la vuelta de 360°, y ${txt} es esa misma parte de 2π.` },
          ],
          respuesta: ['Son ', ps(`${g}°`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-giro',
      generar(sm) {
        const r = azar(sm), k = sm % 4;
        if (k === 0) {
          const ob = r.de(OBJ_B1), ra = r.de(ob.r), g = r.de(GRADOS_B1), kk = ra * g / 180;
          return {
            pregunta: [ob.donde, ` tiene ${f(ra)} m de radio y gira `, ps(`${g}°`), `. ¿Qué camino recorre ${ob.quien}?`],
            datos: [D1.arco, D1.grado],
            dibujo: ob.fig(g, { angulo: `${g}°`, arco: '?', radio: `r = ${f(ra)} m` }),
            opciones: opciones(kk, [
              { id: 'grados', texto: `${f(ra * g)} m`, error: 'AN-GRADOS', siFuera: 'Multiplicar el ángulo por el radio está bien, pero con el ángulo en grados el camino sale unas 57 veces más largo. La fórmula del arco pide radianes: primero pasa los grados.' },
              { id: 'sin-r', texto: `${enPi(g / 180)} m`, error: 'AN-SIN-R', siFuera: 'Pasaste bien los grados a radianes, pero ese número es el ángulo θ, no el camino. El arco cuenta cuántos radios se recorren, así que falta multiplicar θ por el radio.' },
              { id: 'vuelta', texto: `${enPi(2 * ra)} m`, error: 'AN-VUELTA', siFuera: `2π · r es el camino de una vuelta entera. Aquí el giro es de ${g}°, solo una parte de la vuelta, así que el arco también es solo esa parte.` },
              { id: 'diam', texto: `${enPi(2 * kk)} m`, error: 'PR6-diametro', siFuera: 'El ángulo en radianes está bien, pero lo multiplicaste por el diámetro. El radián se mide con el radio, del eje al punto, así que el arco es θ por el radio.' },
            ], n => `${enPi(n)} m`),
            solucion: { texto: `Primero se pasan los ${g}° a radianes: son ${enPi(g / 180)} rad. El arco mide esa cantidad de radios, así que se multiplica por el radio.`, ecuacion: [Ms, ' = ', ps(enPi(g / 180)), ` · ${f(ra)} = `, ps(`${enPi(kk)} m`)] },
          };
        }
        if (k === 1) {
          const ob = r.de(OBJ_B1), ra = r.de(ob.r), th = r.de([0.5, 1.5, 2, 2.5, 3, 4]), sv = th * ra;
          return {
            pregunta: [ob.donde, ` tiene ${f(ra)} m de radio. Si ${ob.quien} recorre `, ps(`${f(sv)} m`), ', ¿qué ángulo gira?'],
            datos: [D1.arco],
            dibujo: ob.fig(deg(th), { angulo: '?', arco: `${f(sv)} m`, radio: `r = ${f(ra)} m` }),
            opciones: opciones(th, [
              { id: 'por', valor: sv * ra, error: 'AN-POR', siFuera: 'Usaste el arco y el radio, pero los multiplicaste. θ cuenta cuántos radios caben en el arco, y eso se averigua dividiendo el arco entre el radio.' },
              { id: 'inv', valor: ra / sv, error: 'AN-INV', siFuera: 'Dividiste, pero al revés: el radio entre el arco. Para saber cuántos radios caben en el arco, el arco va arriba y el radio abajo.' },
              { id: 'vueltas', valor: th / (2 * PI), error: 'AN-VUELTA', siFuera: 'El arco entre el radio ya da θ en radianes; al dividir además entre 2π, convertiste el ángulo en vueltas. Piden radianes.' },
              // De reserva (auditoría del 19 nov, M5): si dos errores dan el mismo texto, «Ahora tú» sigue con 4 opciones.
              { id: 'grados', valor: th * 180 / PI, error: 'AN-GRADOS', siFuera: 'El arco entre el radio ya es θ en radianes; al multiplicar por 180/π lo pasaste a grados. Piden el ángulo en radianes.' },
            ], n => `${f(n)} rad`),
            solucion: { texto: 'El ángulo en radianes dice cuántos radios mide el arco, así que se divide el arco entre el radio.', ecuacion: [Mth, ' = ', { frac: [ps(f(sv)), f(ra)] }, ' = ', ps(`${f(th)} rad`)] },
          };
        }
        if (k === 2) {
          const n = r.de([4, 5, 8, 10, 12, 15, 20, 25]), quien = r.de(['Las aspas de un ventilador', 'Una rueda de la fortuna', 'El tambor de una lavadora', 'Una llanta']);
          return {
            pregunta: [quien, ' da ', ps(`${n} vueltas`), '. ¿Cuántos radianes gira?'],
            datos: [D1.vuelta],
            dibujo: figVent({ textos: [{ x: 8, y: 220, texto: `${n} vueltas`, color: 'f', ancla: 'start' }], alt: `Las aspas de un ventilador que dan ${n} vueltas.` }),
            opciones: opciones(2 * n, [
              { id: 'vuelta', texto: `${n} rad`, error: 'AN-VUELTA', siFuera: 'Contar las vueltas está bien, pero una vuelta no es 1 rad: es 2π rad, unos 6,28 rad. Cada vuelta le suma 2π al ángulo.' },
              { id: 'media', texto: `${enPi(n)} rad`, error: 'AN-MEDIA', siFuera: 'π rad es solo media vuelta. La vuelta entera mide el doble, 2π rad, así que el resultado también es el doble.' },
              { id: 'grados', texto: `${f(360 * n)} rad`, error: 'AN-GRADOS', siFuera: 'Cada vuelta son 360, pero 360 grados. En radianes, cada vuelta son 2π rad, así que las vueltas se multiplican por 2π.' },
            ], n2 => `${enPi(n2)} rad`),
            solucion: { texto: 'Cada vuelta le suma 2π rad al ángulo, así que se multiplican las vueltas por 2π.', ecuacion: [Mth, ' = ', ps(`${n}`), ' · 2π = ', ps(`${enPi(2 * n)} rad`)] },
          };
        }
        // Nivel examen: la rueda que rueda sin resbalar avanza lo que mide el arco de su borde.
        const rc = r.de([25, 30, 35, 40]), n = r.de([10, 20, 50, 100]), kk = 2 * rc / 100 * n;
        return {
          pregunta: ['La llanta de una bicicleta tiene ', `${rc} cm de radio y da `, ps(`${n} vueltas`), ' sin resbalar. ¿Cuánto avanza la bicicleta?'],
          datos: [D1.arco, D1.vuelta, D1.rueda, D1.cm],
          dibujo: figLlanta({ radio: `r = ${rc} cm`, textos: [{ x: 312, y: 22, texto: `${n} vueltas`, color: 'f', ancla: 'end' }] }),
          opciones: opciones(kk, [
            { id: 'vuelta', texto: `${f(n * rc / 100)} m`, error: 'AN-VUELTA', siFuera: 'Multiplicar las vueltas por el radio supone que cada vuelta es 1 rad. Una vuelta son 2π rad: el borde recorre en cada vuelta unas seis veces el radio.' },
            { id: 'sin-2', texto: `${enPi(kk / 2)} m`, error: 'MC-W-PI', siFuera: 'La idea es buena: lo que avanza es el arco del borde. Pero cada vuelta son 2π rad, y tu cuenta usó solo π, como si cada vuelta fuera media.' },
            { id: 'cm', texto: `${enPi(kk * 100)} m`, error: 'U-cm', siFuera: 'La cuenta del arco está bien, pero el radio estaba en centímetros y la respuesta va en metros. Pasa el radio a metros antes de multiplicar.' },
            { id: 'diam', texto: `${enPi(kk * 2)} m`, error: 'PR6-diametro', siFuera: 'El ángulo está bien, pero el arco es θ por el radio, la distancia del eje al borde, y no por el diámetro, que es el doble.' },
          ], n2 => `${enPi(n2)} m`),
          solucion: { texto: `La llanta gira ${n} · 2π rad. Sin resbalar, la bicicleta avanza lo que recorre el borde, θ · r, con el radio en metros: ${f(rc / 100)} m.`, ecuacion: [Ms, ' = ', ps(enPi(2 * n)), ` · ${f(rc / 100)} = `, ps(`${enPi(kk)} m`)] },
        };
      },
    },
  };

  // ======================= B2: período, frecuencia y velocidad angular (la rueda con un cronómetro) =======================
  // Cambia: lo que tarda cada vuelta · Permanece: la rueda de 8 m, que gira pareja · Progresa: el cronómetro y las
  // vueltas que lleva tu cabina · Se reserva: el período de algo que da muchas vueltas por minuto (el ventilador, en
  // Predice) · Debe verse: más período, menos vueltas por minuto; f = 1/T.
  const vueltasDe = (t, T) => Math.floor(t / T + 1e-9);
  function ruedaB2(T, t) {
    const giro = 360 * t / T, n = vueltasDe(t, T), resto = giro - 360 * n;
    return {
      alto: 252, cuerpos: [Object.assign({}, RUEDA, { giro })],
      puntos: [{ ang: 270 + giro, tipo: 'cabina' }],
      arcos: resto > 0.5 ? [{ de: 270, a: 270 + resto }] : [],
      radios: [{ ang: 270 + giro }],
      reloj: { x: 26, y: 30, frac: (t % 60) / 60, texto: `${f(t, 1)} s` },
      textos: [{ x: 312, y: 246, texto: `N = ${n} ${n === 1 ? 'vuelta' : 'vueltas'}`, color: 'f', ancla: 'end' }],
      alt: `Rueda de la fortuna que da una vuelta cada ${f(T, 0)} s; el cronómetro marca ${f(t, 1)} s y tu cabina lleva ${n} vueltas.`,
    };
  }
  const juegoB2 = val => giroF(ruedaB2(val.T, val.t));
  // Predice y Mira: el ventilador del aula, a 120 vueltas por minuto (el juego no tuvo nada tan rápido).
  const ventB2 = (o = {}) => ({ alto: 228, cuerpos: [Object.assign({}, VENT, { giro: o.giro === undefined ? 20 : o.giro })], sentido: [{ f: 1.1, de: 30, a: 80 }],
    reloj: o.reloj, textos: o.textos || [], arcos: o.arcos || [], alt: o.alt || 'Ventilador de techo que da 120 vueltas por minuto.' });
  const PRED_B2 = ventB2({ textos: [{ x: 312, y: 220, texto: '120 vueltas por minuto', ancla: 'end' }] });
  const MIRA_B2 = Object.assign(ventB2(), { cortes: [
    { reloj: { x: 26, y: 30, frac: 0.999, texto: '60 s' }, textos: [{ x: 312, y: 220, texto: 'N = 120 vueltas', color: 'f', ancla: 'end' }] },
    { reloj: { x: 26, y: 30, frac: 1 / 60, texto: '1 s' }, textos: [{ x: 312, y: 220, texto: 'N = 2 vueltas', color: 'f', ancla: 'end' }] },
    { reloj: { x: 26, y: 30, frac: 0.5 / 60, texto: '0,5 s' }, textos: [{ x: 312, y: 220, texto: 'N = 1 vuelta: 2π rad', color: 'f', ancla: 'end' }],
      arcos: [{ tipo: 'angulo', de: 20, a: 379.99, rpx: 26 }] },
    { reloj: { x: 26, y: 30, frac: 0.999, texto: '60 s' }, textos: [{ x: 312, y: 220, texto: '120 vueltas: 240π rad', color: 'f', ancla: 'end' }] },
  ] });

  const D2 = {
    f: ['Frecuencia: f = ', { frac: [MN, Mt] }, ', vueltas entre tiempo (en Hz)'],
    T: ['Período: ', MT, ' = ', { frac: ['1', 'f'] }],
    w: ['Velocidad angular: ', Mw, ' = ', { frac: [Mth, Mt] }, ' = ', { frac: ['2π', MT] }],
    th: ['Con ω constante: ', Mth, ' = ', Mw, ' · ', Mt],
    vuelta: '1 vuelta = 2π rad',
    min: '1 min = 60 s',
    hz: '1 Hz = 1 vuelta por segundo; 1 rpm = 1 vuelta por minuto',
    h: '1 h = 3600 s',
    reloj: 'El minutero da una vuelta en 60 min; el horario, en 12 h',
  };
  const figPista = (o = {}) => giroF({ alto: 232, cuerpos: [{ tipo: 'pista', c: [160, 116], R: 90 }],
    puntos: o.puntos || [], textos: o.textos || [], sentido: o.sentido || [], alt: o.alt });

  // Ejemplos resueltos de B2. Cuentas rehechas aparte (cuentas-b.js: cuenta vueltas con un reloj que avanza de a poco, sin
  // f = 1/T): 1/40; 15/3; 2π/20; 2π/60; 3·4; 300/60 y 1/5; 90/60 y 2π·1,5; 6π/2π y 3·60; 24·3600 y 2π/86 400;
  // 2π/3600 y 1200·π/1800; 1/(1/40 + 1/60); 1/(1/30 − 1/40); 720/11; 45/60·2π; mcm(30, 45)/30; y el valor de cada
  // alternativa equivocada con el error que dice el resuelto.
  const EJEMPLOS_PERIODO = [
    { nivel: 1, titulo: 'La frecuencia de la rueda',
      figura: giroF(Object.assign(ruedaB2(40, 0), { reloj: { x: 26, y: 30, frac: 40 / 60, texto: '40 s' }, textos: [{ x: 312, y: 246, texto: 'N = 1 vuelta', color: 'f', ancla: 'end' }] })),
      enunciado: ['Tu rueda de la fortuna da una vuelta cada ', pt('40 s'), '. ¿Cuál es su frecuencia?'],
      datos: [D2.f, D2.hz],
      solucion: [{ texto: 'La frecuencia cuenta vueltas por segundo: se divide la vuelta entre los 40 s que tarda.', ecuacion: ['f = ', { frac: [ps('1'), pt('40 s')] }, ' = 0,025 Hz'] }],
      respuesta: [neg('f = 0,025 Hz'), ': un cuarentavo de vuelta por segundo'] },
    { nivel: 1, titulo: 'Vueltas en cada segundo',
      figura: giroF(ventB2({ reloj: { x: 26, y: 30, frac: 3 / 60, texto: '3 s' }, textos: [{ x: 312, y: 220, texto: 'N = 15 vueltas', color: 'f', ancla: 'end' }] })),
      enunciado: ['Las aspas de un ventilador dan ', ps('15 vueltas'), ' en ', pt('3 s'), '. ¿Cuál es su frecuencia?'],
      datos: [D2.f, D2.hz],
      solucion: [{ texto: 'La frecuencia es el número de vueltas dividido entre el tiempo que tardan:', ecuacion: ['f = ', { frac: [ps('15'), pt('3 s')] }, ' = 5 Hz'] }],
      respuesta: [neg('f = 5 Hz'), ': cinco vueltas por segundo'] },
    { nivel: 1, titulo: 'La ω de la rueda',
      figura: giroF(Object.assign(ruedaB2(20, 0), { reloj: { x: 26, y: 30, frac: 20 / 60, texto: 'T = 20 s' }, textos: [] })),
      enunciado: ['La rueda de la fortuna gira pareja y da una vuelta cada ', pt('20 s'), '. ¿Cuál es su velocidad angular?'],
      datos: [D2.w, D2.vuelta],
      solucion: [{ texto: 'En un período, la rueda gira una vuelta, que son 2π rad; ω es ese ángulo entre ese tiempo:', ecuacion: [Mw, ' = ', { frac: ['2π', pt('20')] }, ' = ', pv('π/10 rad/s')] }],
      respuesta: [pv('π/10 rad/s'), ', unos ', pv('0,31 rad/s')] },
    { nivel: 1, titulo: 'El segundero',
      figura: figReloj({ agujas: [{ ang: 90, f: 0.9, grosor: 1.5 }], textos: [{ x: 312, y: 22, texto: 'T = 60 s', color: 'i', ancla: 'end' }] }),
      enunciado: ['El segundero de un reloj da una vuelta en ', pt('60 s'), '. ¿Cuál es su velocidad angular?'],
      datos: [D2.w, D2.vuelta],
      solucion: [{ texto: 'El segundero gira una vuelta, 2π rad, en 60 s; ω es el ángulo entre el tiempo:', ecuacion: [Mw, ' = ', { frac: ['2π', pt('60')] }, ' = ', pv('π/30 rad/s')] }],
      respuesta: [pv('π/30 rad/s'), ', unos ', pv('0,1 rad/s')] },
    { nivel: 1, titulo: 'Cuánto gira en 4 s',
      figura: giroF(ventB2({ reloj: { x: 26, y: 30, frac: 4 / 60, texto: '4 s' }, textos: [{ x: 312, y: 220, texto: 'ω = 3 rad/s', color: 'o', ancla: 'end' }] })),
      enunciado: ['Un ventilador gira parejo con ', pv('ω = 3 rad/s'), '. ¿Qué ángulo gira en ', pt('4 s'), '?'],
      datos: [D2.th],
      solucion: [{ texto: 'Con ω constante, gira 3 rad en cada segundo; en 4 s gira cuatro veces eso:', ecuacion: [Mth, ' = ', pv('3'), ' · ', pt('4'), ' = ', ps('12 rad')] }],
      respuesta: ['Gira ', ps('12 rad')] },
    { nivel: 2, titulo: 'De rpm a período',
      figura: giroF(ventB2({ textos: [{ x: 312, y: 220, texto: '300 rpm', ancla: 'end' }] })),
      enunciado: ['Un ventilador gira a 300 rpm. ¿Cuánto tarda en dar una vuelta?'],
      datos: [D2.f, D2.T, D2.min, D2.hz],
      solucion: [
        { texto: 'Las rpm son vueltas por minuto: 300 vueltas en 60 s dan la frecuencia en hertz.', ecuacion: ['f = ', { frac: [ps('300'), pt('60 s')] }, ' = 5 Hz'] },
        { texto: 'Si da 5 vueltas en cada segundo, cada vuelta tarda un quinto de segundo: el período es el inverso de f.', ecuacion: [MT, ' = ', { frac: ['1', '5'] }, ' = ', pt('0,2 s')] },
      ],
      respuesta: [MT, ' = ', pt('0,2 s')] },
    { nivel: 2, titulo: 'De rpm a rad/s',
      figura: giroF({ alto: 200, cuerpos: [{ tipo: 'disco', c: [160, 98], R: 80 }], sentido: [{ f: 1.15, de: 30, a: 80 }], textos: [{ x: 312, y: 190, texto: '90 rpm', ancla: 'end' }],
        alt: 'Un disco que gira a 90 vueltas por minuto.' }),
      enunciado: ['Un disco gira a 90 rpm. ¿Cuál es su velocidad angular, en rad/s?'],
      datos: [D2.f, D2.w, D2.min, D2.hz],
      solucion: [
        { texto: 'Primero las vueltas por segundo: 90 vueltas en 60 s.', ecuacion: ['f = ', { frac: [ps('90'), pt('60 s')] }, ' = 1,5 Hz'] },
        { texto: 'Cada vuelta son 2π rad, así que los radianes por segundo son 2π veces las vueltas por segundo:', ecuacion: [Mw, ' = 2π · 1,5 = ', pv('3π rad/s'), ' ≈ ', pv('9,42 rad/s')] },
      ],
      respuesta: [pv('3π rad/s'), ', unos ', pv('9,42 rad/s')] },
    { nivel: 2, titulo: 'Vueltas en un minuto',
      figura: giroF({ alto: 200, cuerpos: [{ tipo: 'disco', c: [160, 98], R: 80 }], sentido: [{ f: 1.15, de: 30, a: 80 }], textos: [{ x: 312, y: 190, texto: 'ω = 6π rad/s', color: 'o', ancla: 'end' }],
        alt: 'Un esmeril que gira con 6π radianes por segundo.' }),
      enunciado: ['Un esmeril gira con ', pv('ω = 6π rad/s'), '. ¿Cuántas vueltas da en un minuto?'],
      datos: [D2.w, D2.vuelta, D2.min],
      solucion: [
        { texto: 'Cada vuelta son 2π rad, así que las vueltas por segundo son ω entre 2π:', ecuacion: ['f = ', { frac: [pv('6π'), '2π'] }, ' = 3 Hz'] },
        { texto: 'Un minuto tiene 60 s, así que da 60 veces esas vueltas:', ecuacion: [MN, ' = 3 · ', pt('60'), ' = ', ps('180 vueltas')] },
      ],
      respuesta: ['Da ', ps('180 vueltas')] },
    { nivel: 2, titulo: 'La Tierra que gira',
      figura: giroF({ alto: 230, cuerpos: [{ tipo: 'tierra', c: [160, 112], R: 90 }], sentido: [{ f: 1.12, de: 60, a: 120 }], textos: [{ x: 312, y: 224, texto: 'T = 24 h', color: 'i', ancla: 'end' }],
        alt: 'La Tierra, que da una vuelta sobre su eje en 24 horas.' }),
      enunciado: ['La Tierra da una vuelta sobre su eje en unas ', pt('24 h'), '. ¿Cuál es su velocidad angular, en rad/s?'],
      datos: [D2.w, D2.vuelta, D2.h],
      solucion: [
        { texto: 'ω va en rad/s, así que primero se pasa el período a segundos:', ecuacion: [MT, ' = ', pt('24'), ' · 3600 = ', pt('86 400 s')] },
        { texto: 'En ese período gira una vuelta, 2π rad; ω es ese ángulo entre ese tiempo:', ecuacion: [Mw, ' = ', { frac: ['2π', pt('86 400')] }, ' = ', pv('π/43 200 rad/s')] },
      ],
      respuesta: [pv('π/43 200 rad/s'), ', unos ', pv('0,000073 rad/s')] },
    { nivel: 2, titulo: 'El minutero en 20 min',
      figura: figReloj({ agujas: [{ ang: 90, f: 0.85, grosor: 2.5 }], textos: [{ x: 312, y: 22, texto: '20 min', color: 'i', ancla: 'end' }] }),
      enunciado: ['¿Cuál es la velocidad angular del minutero, en rad/s, y qué ángulo gira en ', pt('20 min'), '?'],
      datos: [D2.w, D2.th, D2.vuelta, D2.reloj, D2.min],
      solucion: [
        { texto: 'El minutero da una vuelta, 2π rad, en 60 min, que son 3600 s:', ecuacion: [Mw, ' = ', { frac: ['2π', pt('3600')] }, ' = ', pv('π/1800 rad/s')] },
        { texto: 'El ángulo es ω por el tiempo, también en segundos: 20 min son 1200 s.', ecuacion: [Mth, ' = ', { frac: [pv('π'), pv('1800')] }, ' · ', pt('1200'), ' = ', ps('2π/3 rad')] },
      ],
      respuesta: [pv('π/1800 rad/s'), '; gira ', ps('2π/3 rad')] },
    { nivel: 3, titulo: 'Se cruzan en la pista',
      figura: figPista({ puntos: [{ ang: 270, tipo: 'punto', texto: 'salen', lado: 1 }], sentido: [{ en: 0, f: 1.2, de: 280, a: 330 }, { en: 0, f: 1.2, de: 210, a: 260, horario: true }],
        textos: [{ x: 8, y: 22, texto: 'Ana: 40 s', color: 'i' }, { x: 312, y: 22, texto: 'Beto: 60 s', color: 'i', ancla: 'end' }],
        alt: 'Pista circular; Ana y Beto salen juntos del mismo punto, en sentidos contrarios.' }),
      enunciado: ['Ana y Beto salen juntos del mismo punto de una pista circular, en sentidos contrarios. Ana da una vuelta cada ', pt('40 s'), ' y Beto, cada ', pt('60 s'), '. ¿Cuándo se cruzan por primera vez?'],
      alternativas: ['50 s', '24 s', '120 s', '20 s', '100 s'],
      datos: [D2.w, D2.th],
      solucion: [
        { texto: 'Como van en sentidos contrarios, se cruzan cuando los ángulos de los dos suman una vuelta:', ecuacion: [{ frac: ['2π', pt('40')] }, ' · ', Mt, ' + ', { frac: ['2π', pt('60')] }, ' · ', Mt, ' = 2π'] },
        { texto: 'Se divide todo entre 2π y se despeja el tiempo:', ecuacion: [Mt, ' · ', { par: [{ frac: ['1', '40'] }, ' + ', { frac: ['1', '60'] }] }, ' = 1   →   ', Mt, ' = ', pt('24 s')] },
        { texto: ['La ', neg('A'), ' promedia los períodos, pero el cruce llega antes que la vuelta de cualquiera de los dos. La ', neg('C'), ' busca cuándo vuelven juntos a la salida, que es otra pregunta. La ', neg('D'), ' resta los períodos y la ', neg('E'), ' los suma: lo que se suma son los ángulos.'] },
      ],
      respuesta: [neg('B'), ', a los ', pt('24 s')] },
    { nivel: 3, titulo: 'Lo alcanza otra vez',
      figura: figPista({ puntos: [{ ang: 270, tipo: 'punto', texto: 'salen', lado: 1 }], sentido: [{ en: 0, f: 1.2, de: 280, a: 330 }],
        textos: [{ x: 8, y: 22, texto: 'rápido: 30 s', color: 'i' }, { x: 312, y: 22, texto: 'lento: 40 s', color: 'i', ancla: 'end' }],
        alt: 'Pista circular; dos ciclistas salen juntos del mismo punto y en el mismo sentido.' }),
      enunciado: ['Dos ciclistas salen juntos y en el mismo sentido en una pista circular. Uno da una vuelta cada ', pt('30 s'), ' y el otro, cada ', pt('40 s'), '. ¿Cuándo vuelve a alcanzarlo el más rápido?'],
      alternativas: ['70 s', '10 s', '17,14 s', '35 s', '120 s'],
      datos: [D2.w, D2.th],
      solucion: [
        { texto: 'Van en el mismo sentido, así que el rápido lo alcanza cuando le saca una vuelta entera, 2π rad:', ecuacion: [{ frac: ['2π', pt('30')] }, ' · ', Mt, ' − ', { frac: ['2π', pt('40')] }, ' · ', Mt, ' = 2π'] },
        { texto: 'Se divide todo entre 2π y se despeja el tiempo:', ecuacion: [Mt, ' · ', { par: [{ frac: ['1', '30'] }, ' − ', { frac: ['1', '40'] }] }, ' = 1   →   ', Mt, ' = ', pt('120 s')] },
        { texto: ['La ', neg('A'), ' suma los períodos y la ', neg('B'), ' los resta: lo que se resta son los ángulos. La ', neg('C'), ' suma los ángulos, como si fueran en sentidos contrarios. La ', neg('D'), ' promedia los períodos.'] },
      ],
      respuesta: [neg('E'), ', a los ', pt('120 s')] },
    { nivel: 3, titulo: 'Las agujas se juntan',
      figura: figReloj({ agujas: [{ ang: 90, f: 0.85, grosor: 2.5 }, { ang: 90, f: 0.55, grosor: 4 }], textos: [{ x: 312, y: 22, texto: '12:00', ancla: 'end' }] }),
      enunciado: ['A las 12:00, el minutero y el horario están juntos. ¿Cuántos minutos después vuelven a juntarse por primera vez?'],
      alternativas: ['60 min', '55,38 min', '65,45 min', '720 min', '30 min'],
      datos: [D2.w, D2.th, D2.reloj],
      solucion: [
        { texto: 'Con el tiempo en minutos, ω del minutero es 2π/60 y la del horario, 2π/720. Se juntan cuando el minutero le saca una vuelta:', ecuacion: [{ frac: ['2π', pt('60')] }, ' · ', Mt, ' − ', { frac: ['2π', pt('720')] }, ' · ', Mt, ' = 2π'] },
        { texto: 'Se divide entre 2π y se despeja el tiempo:', ecuacion: [Mt, ' = ', { frac: ['720', '11'] }, ' ≈ ', pt('65,45 min')] },
        { texto: ['La ', neg('A'), ' olvida que el horario también avanza mientras el minutero da su vuelta. La ', neg('B'), ' suma las ω, como si giraran en sentidos contrarios. La ', neg('D'), ' es lo que tarda el horario en dar su vuelta. La ', neg('E'), ' cree que se juntan a la media hora.'] },
      ],
      respuesta: [neg('C'), ', unos ', pt('65,45 min'), ' (la 1:05 y algo)'] },
    { nivel: 3, titulo: 'El tocadiscos',
      figura: giroF({ alto: 200, cuerpos: [{ tipo: 'disco', c: [160, 98], R: 80 }], sentido: [{ f: 1.15, de: 30, a: 80 }], textos: [{ x: 312, y: 190, texto: '45 rpm', ancla: 'end' }],
        alt: 'El disco de un tocadiscos, que gira a 45 vueltas por minuto.' }),
      enunciado: ['El disco de un tocadiscos gira a 45 rpm. ¿Cuál es su velocidad angular?'],
      alternativas: ['1,5π rad/s', '90π rad/s', '0,75 rad/s', '0,75π rad/s', '5400π rad/s'],
      datos: [D2.f, D2.w, D2.min, D2.hz],
      solucion: [
        { texto: 'Primero las vueltas por segundo: 45 vueltas en 60 s.', ecuacion: ['f = ', { frac: [ps('45'), pt('60 s')] }, ' = 0,75 Hz'] },
        { texto: 'Cada vuelta son 2π rad, así que ω es 2π veces las vueltas por segundo:', ecuacion: [Mw, ' = 2π · 0,75 = ', pv('1,5π rad/s'), ' ≈ ', pv('4,71 rad/s')] },
        { texto: ['La ', neg('B'), ' no pasa el minuto a segundos. La ', neg('C'), ' da las vueltas por segundo sin pasarlas a radianes. La ', neg('D'), ' usa π por vuelta, que es media vuelta. La ', neg('E'), ' multiplica por 60 en vez de dividir.'] },
      ],
      respuesta: [neg('A'), ', ', pv('1,5π rad/s')] },
    { nivel: 3, titulo: 'Juntos otra vez en la salida',
      figura: figPista({ puntos: [{ ang: 270, tipo: 'punto', texto: 'salida', lado: 1 }], sentido: [{ en: 0, f: 1.2, de: 280, a: 330 }],
        textos: [{ x: 8, y: 22, texto: 'rápido: 30 s', color: 'i' }, { x: 312, y: 22, texto: 'lento: 45 s', color: 'i', ancla: 'end' }],
        alt: 'Pista circular; dos corredores salen juntos de la salida.' }),
      enunciado: ['Dos corredores salen juntos de la salida de una pista circular. Uno da una vuelta cada ', pt('30 s'), ' y el otro, cada ', pt('45 s'), '. Cuando vuelvan a pasar juntos por la salida, ¿cuántas vueltas habrá dado el más rápido?'],
      alternativas: ['2 vueltas', '90 vueltas', '5 vueltas', '3 vueltas', '1,5 vueltas'],
      datos: [D2.f, D2.T],
      solucion: [
        { texto: 'Cada uno pasa por la salida cada vez que completa una vuelta: el rápido a los 30, 60, 90 s, y el lento a los 45, 90 s. El primer tiempo común es el mcm de 30 y 45.', ecuacion: [Mt, ' = mcm(', pt('30'), '; ', pt('45'), ') = ', pt('90 s')] },
        { texto: 'En esos 90 s, el rápido da una vuelta cada 30 s:', ecuacion: [MN, ' = ', { frac: [pt('90'), pt('30')] }, ' = ', ps('3 vueltas')] },
        { texto: ['La ', neg('A'), ' da las vueltas del lento, no las del rápido. La ', neg('B'), ' da los 90 s como si fueran vueltas. La ', neg('C'), ' suma las vueltas de los dos. La ', neg('E'), ' divide 45 entre 30, pero eso no dice cuándo coinciden en la salida.'] },
      ],
      respuesta: [neg('D'), ', ', ps('3 vueltas')] },
  ];

  const COSAS_B2 = [['Un ventilador', 'ventilador'], ['El tambor de una lavadora', 'disco'], ['Una licuadora', 'disco'], ['Un tocadiscos', 'disco']];
  const figCosa = (tipo, texto, colorTexto) => (tipo === 'ventilador' ? giroF(ventB2({ textos: [{ x: 312, y: 220, texto, color: colorTexto, ancla: 'end' }], alt: `Un ventilador: ${texto}.` }))
    : giroF({ alto: 200, cuerpos: [{ tipo: 'disco', c: [160, 98], R: 80 }], sentido: [{ f: 1.15, de: 30, a: 80 }], textos: [{ x: 312, y: 190, texto, color: colorTexto, ancla: 'end' }], alt: `Un disco que gira: ${texto}.` }));
  const periodo = {
    id: 'periodo-y-frecuencia',
    titulo: 'Período, frecuencia y velocidad angular',
    pregunta: 'Si un ventilador da 120 vueltas por minuto, ¿cuánto tarda en cada una?',
    temas: ['Magnitudes angulares', 'MCU'],
    pieza: 'fis-giro',
    aprendizaje: 'En el MCU cada vuelta tarda lo mismo: el período T. La frecuencia es f = 1/T, y la velocidad angular, ω = 2π/T.',
    actividad: 'Elegir cuánto tarda cada vuelta de la rueda de la fortuna.',
    lee: {
      tarjetas: [
        { titulo: 'Una rueda que gira pareja', texto: ['La rueda de la fortuna gira siempre igual de rápido: es un movimiento circular uniforme, un MCU. Uniforme quiere decir que en cada segundo gira lo mismo; por eso cada vuelta tarda lo mismo, y ese tiempo se llama período, ', MT, '.'],
          dibujo: juegoB2({ T: 30, t: 30 }) },
        { titulo: 'Vueltas por segundo', texto: 'La frecuencia, f, cuenta cuántas vueltas da algo en cada segundo. Se mide en hertz (Hz): 1 Hz es una vuelta por segundo, y 3 Hz, tres. En el examen también aparecen las rpm, que cuentan vueltas por minuto: un disco a 60 rpm da una vuelta por segundo.' },
        { titulo: 'Radianes por segundo', texto: ['La velocidad angular, ', Mw, ', dice cuántos radianes gira algo en cada segundo, así como la rapidez dice cuántos metros avanza. Se mide en rad/s: con ω = 2 rad/s, la rueda gira 2 rad en cada segundo.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Elige cuánto tarda cada vuelta y deja correr el cronómetro un minuto. Cuenta las vueltas que da tu cabina, y fíjate qué pasa con esa cuenta cuando cada vuelta tarda más.' },
      ],
    },
    ejemplos: EJEMPLOS_PERIODO,
    juega: {
      pieza: 'fis-giro',
      consigna: 'La rueda de la fortuna gira pareja. Tú eliges cuánto tarda cada vuelta, T. El cronómetro corre solo; con su control lo detienes.',
      mision: {
        texto: 'Haz que la rueda dé justo 3 vueltas en un minuto.',
        logrado: val => val.T === 20,
        bien: 'Cada vuelta tarda 20 s, y en 60 s caben 3: más período, menos vueltas.',
      },
      voz: 'Si cada vuelta tarda más, ¿da más o menos vueltas por minuto?',
      leyenda: [
        { s: [MT], t: 'período: lo que tarda una vuelta' },
        { s: [Mt], t: 'lo que marca el cronómetro, que corre' },
        { s: [MN], t: 'vueltas que lleva tu cabina' },
        { s: 'cronómetro', t: 'cuenta los segundos' },
      ],
      controles: [
        { id: 'T', etiqueta: 'Una vuelta tarda, T', color: 'c-i', min: 10, max: 60, paso: 5, inicio: 30, unidad: 's', decimales: 0 },
        { id: 't', etiqueta: 'Cronómetro, t', color: 'c-i', min: 0, max: 60, paso: 0.5, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 6, modo: 'repite' } },
      ],
      dibujo: juegoB2,
      lectura: val => ['Una vuelta cada ', pt(`${f(val.T, 0)} s`), `: ${f(60 / val.T)} vueltas por minuto`],
      resumen: { T: 30, t: 40 },
      minimo: 3,
    },
    predice: {
      pregunta: 'El ventilador del aula da 120 vueltas por minuto, siempre parejo. ¿Cuánto tarda en dar una vuelta?',
      datos: ['1 min = 60 s.', 'Gira parejo: cada vuelta tarda lo mismo.'],
      opciones: [
        { id: 'c', texto: '0,5 s', correcta: true },
        { id: 'tf', texto: '2 s', error: 'MC-T-F', siFuera: 'Dividir 120 entre 60 está bien, pero da las vueltas por segundo, que es la frecuencia: 2 vueltas en cada segundo. Piden lo que tarda una sola vuelta, y si caben dos en un segundo, cada una tarda menos.' },
        { id: 'lee', texto: '120 s', error: 'MC-LEE', siFuera: '120 es el número de vueltas que da en un minuto, no un tiempo. Si da tantas vueltas en solo 60 s, cada una tiene que durar mucho menos que un minuto.' },
        { id: 'min', texto: '1/120 s', error: 'U-MIN', siFuera: 'Repartir el tiempo entre las vueltas es la idea correcta, pero lo que se reparte es un minuto, y un minuto son 60 s, no 1 s. Divide 60 s entre las 120 vueltas.' },
      ],
      dibujo: giroF(PRED_B2),
      revelar: giroF(MIRA_B2, { corte: 2 }),
      coincide: 'Coincide: dos vueltas en cada segundo, así que cada una dura medio segundo.',
    },
    mira: {
      pieza: 'fis-giro',
      datos: MIRA_B2,
      pasos: [
        { estado: { corte: 0 }, texto: 'El ventilador da 120 vueltas en 60 s, así que da dos vueltas en cada segundo: su frecuencia es 2 Hz, porque un hertz es una vuelta por segundo.', ecuacion: ['f = ', { frac: [ps('120 vueltas'), pt('60 s')] }, ' = 2 Hz'] },
        { estado: { corte: 1 }, texto: 'Si caben dos vueltas en un segundo, cada una dura medio segundo. Por eso el período es el inverso de la frecuencia.', ecuacion: [MT, ' = ', { frac: ['1', 'f'] }, ' = ', { frac: ['1', '2'] }, ' = ', pt('0,5 s')] },
        { estado: { corte: 2 }, texto: 'En cada período, el ventilador gira una vuelta, que son 2π rad. ω es ese ángulo dividido entre lo que tarda, 0,5 s.', ecuacion: [Mw, ' = ', { frac: ['2π', MT] }, ' = ', { frac: ['2π', pt('0,5')] }, ' = ', pv('4π rad/s')] },
        { estado: { corte: 3 }, texto: 'Con el minuto entero sale lo mismo, porque gira parejo: 120 vueltas son 240π rad, repartidos en 60 s.', ecuacion: [Mw, ' = ', { frac: [Mth, Mt] }, ' = ', { frac: [ps('240π'), pt('60')] }, ' = ', pv('4π rad/s'), ' ≈ ', pv('12,57 rad/s')] },
      ],
    },
    regla: {
      texto: 'En el MCU, algo gira lo mismo en cada segundo. El período T es lo que tarda una vuelta; la frecuencia f cuenta las vueltas por segundo, N/t, y es el inverso de T. La velocidad angular ω cuenta los radianes por segundo, θ/t: como una vuelta son 2π rad, ω es 2π entre T.',
      ecuacion: ['f = ', { frac: ['1', MT] }, ';   ', Mw, ' = ', { llave: [{ frac: ['2π', MT] }], nota: 'una vuelta en un período', color: 'c-o' }],
      condicion: 'el giro es parejo, con el tiempo en segundos: 1 Hz es una vuelta por segundo y 1 rpm, una vuelta por minuto. Si el giro se acelera, cada vuelta tarda distinto y no hay un solo período.',
    },
    // Así se resuelve: de la frecuencia al período (en Hz, no en rpm) y de ω a rpm; «Ahora tú» va de rpm o de T.
    resuelve: {
      pieza: 'fis-giro',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 0) {
          const fr = r.de([4, 5, 8, 10, 20, 25, 50]);
          return {
            enunciado: ['El motor de una licuadora gira parejo con una frecuencia de ', `${fr} Hz. ¿Cuál es su período?`],
            datos: [D2.T, D2.hz],
            dibujo: figCosa('disco', `f = ${fr} Hz`),
            pasos: [
              { tipo: 'pide', texto: ['Piden el período ', MT, ': lo que tarda una vuelta.'] },
              { tipo: 'datos', texto: `El motor da ${fr} vueltas en cada segundo.` },
              { tipo: 'regla', texto: 'El período y la frecuencia son inversos: mientras más vueltas da en un segundo, menos tarda cada una.', ecuacion: [MT, ' = ', { frac: ['1', 'f'] }] },
              { tipo: 'cuentas', texto: `Reparto un segundo entre las ${fr} vueltas que caben en él.`, ecuacion: [MT, ' = ', { frac: ['1', `${fr}`] }, ' = ', pt(`${f(1 / fr, 3)} s`)] },
              { tipo: 'sentido', texto: `Compruebo: ${fr} vueltas de ${f(1 / fr, 3)} s cada una llenan justo un segundo, así que el período está bien.` },
            ],
            respuesta: [MT, ' = ', pt(`${f(1 / fr, 3)} s`)],
          };
        }
        const k = r.de([2, 4, 5, 6, 10, 20, 40]), rpm = 30 * k;
        return {
          enunciado: ['Un esmeril gira con ', pv(`ω = ${enPi(k)} rad/s`), '. ¿A cuántas rpm gira?'],
          datos: [D2.w, D2.vuelta, D2.min],
          dibujo: figCosa('disco', `ω = ${enPi(k)} rad/s`, 'o'),
          pasos: [
            { tipo: 'pide', texto: 'Piden las rpm: cuántas vueltas da en un minuto.' },
            { tipo: 'datos', texto: ['Gira ', pv(`${enPi(k)} rad`), ' en cada segundo.'] },
            { tipo: 'regla', texto: 'Cada vuelta son 2π rad, así que para contar las vueltas por segundo se divide ω entre 2π.', ecuacion: ['f = ', { frac: [Mw, '2π'] }] },
            { tipo: 'cuentas', texto: 'Primero saco las vueltas por segundo; después las multiplico por 60, porque un minuto tiene 60 s.', ecuacion: ['f = ', { frac: [pv(enPi(k)), '2π'] }, ` = ${f(k / 2)} Hz   →   ${f(k / 2)} · 60 = ${f(rpm)} rpm`] },
            { tipo: 'sentido', texto: `Tiene sentido: un esmeril gira rápido, y ${f(rpm)} vueltas en un minuto es un número creíble para él.` },
          ],
          respuesta: [neg(`${f(rpm)} rpm`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-giro',
      generar(sm) {
        const r = azar(sm + 41), k = sm % 4;
        if (k === 0) {
          const [quien, tipo] = r.de(COSAS_B2), rpm = r.de([30, 60, 90, 150, 180, 240, 300, 600]);   // sin 120: es la de Predice
          const T = 60 / rpm;
          return {
            pregunta: [quien, ` gira parejo a ${rpm} rpm. ¿Cuánto tarda en dar una vuelta?`],
            datos: [D2.f, D2.T, D2.min, D2.hz],
            dibujo: figCosa(tipo, `${rpm} rpm`),
            opciones: opciones(T, [
              { id: 'tf', valor: rpm / 60, error: 'MC-T-F', siFuera: 'Dividir las rpm entre 60 da las vueltas por segundo, que es la frecuencia, no el período. El período es lo que tarda una vuelta, el inverso de la frecuencia.' },
              { id: 'min', texto: `1/${rpm} s`, error: 'U-MIN', siFuera: 'La idea del inverso es buena, pero las rpm cuentan vueltas por minuto. Un minuto son 60 s, así que se reparten 60 s entre las vueltas, no 1 s.' },
              { id: 'lee', valor: rpm, error: 'MC-LEE', siFuera: 'Ese número cuenta las vueltas de un minuto, no es un tiempo. Una vuelta dura menos que el minuto en que caben todas.' },
              { id: 'por', valor: 60 * rpm, error: 'AN-POR', siFuera: 'Usar los 60 s del minuto está bien, pero esos segundos se reparten entre las vueltas, así que se dividen, no se multiplican.' },
            ], n => `${f(n, 3)} s`),
            solucion: { texto: `Da ${rpm} vueltas en 60 s, así que f = ${f(rpm / 60)} Hz. El período es el inverso: 60 s repartidos entre las vueltas.`, ecuacion: [MT, ' = ', { frac: [pt('60'), `${rpm}`] }, ' = ', pt(`${f(T, 3)} s`)] },
          };
        }
        if (k === 1) {
          const [quien, T] = r.de([['La rueda de la fortuna', 20], ['La rueda de la fortuna', 30], ['La rueda de la fortuna', 40], ['El carrusel de la plaza', 10], ['El carrusel de la plaza', 12], ['El segundero', 60], ['Un trompo', 0.5], ['Un ventilador', 0.25]]);
          const kk = 2 / T;
          return {
            pregunta: [quien, ' da una vuelta cada ', pt(`${f(T)} s`), ', siempre parejo. ¿Cuál es su velocidad angular?'],
            datos: [D2.w, D2.vuelta],
            dibujo: quien.includes('rueda') ? juegoB2({ T, t: 0 }) : quien.includes('segundero') ? figReloj({ agujas: [{ ang: 90, f: 0.9, grosor: 1.5 }], textos: [{ x: 312, y: 22, texto: `T = ${f(T)} s`, color: 'i', ancla: 'end' }] })
              : figCosa(quien.includes('carrusel') ? 'disco' : 'ventilador', `T = ${f(T)} s`, 'i'),
            opciones: opciones(kk, [
              { id: 'sin-2pi', valor: 1 / T, texto: `${f(1 / T, 3)} rad/s`, error: 'MC-W-SIN-2PI', siFuera: 'Dividir 1 entre el período da la frecuencia, en vueltas por segundo. ω cuenta radianes por segundo, y cada vuelta son 2π rad: falta multiplicar por 2π.' },
              { id: 'sin-2', valor: 1 / T, texto: `${enPi(1 / T)} rad/s`, error: 'MC-W-PI', siFuera: 'La idea es buena: el ángulo de una vuelta entre el período. Pero usaste π rad, que es media vuelta; la vuelta entera son 2π rad.' },
              { id: 'por', texto: `${enPi(2 * T)} rad/s`, error: 'AN-POR', siFuera: 'Usaste 2π y el período, pero los multiplicaste. ω es el ángulo dividido entre el tiempo que tarda en girarlo, así que 2π va entre T.' },
            ], n => `${enPi(n)} rad/s`),
            solucion: { texto: 'En un período gira una vuelta, 2π rad, así que ω es 2π dividido entre el período.', ecuacion: [Mw, ' = ', { frac: ['2π', pt(f(T))] }, ' = ', pv(`${enPi(kk)} rad/s`)] },
          };
        }
        if (k === 2) {
          const [quien, tipo] = r.de(COSAS_B2), rpm = r.de([30, 60, 90, 150, 180, 240, 300, 450, 600]), kk = rpm / 30;
          return {
            pregunta: [quien, ` gira a ${rpm} rpm. ¿Cuál es su velocidad angular, en rad/s?`],
            datos: [D2.f, D2.w, D2.min, D2.hz],
            dibujo: figCosa(tipo, `${rpm} rpm`),
            opciones: opciones(kk, [
              { id: 'sin-min', texto: `${enPi(2 * rpm)} rad/s`, error: 'U-MIN', siFuera: 'Multiplicar por 2π por cada vuelta está bien, pero las rpm cuentan vueltas por minuto, y ω va por segundo. Falta dividir entre 60.' },
              { id: 'sin-2pi', texto: `${f(rpm / 60)} rad/s`, error: 'MC-W-SIN-2PI', siFuera: 'Las vueltas por segundo están bien, pero ω cuenta radianes, no vueltas. Cada vuelta son 2π rad, así que falta multiplicar por 2π.' },
              { id: 'sin-2', texto: `${enPi(rpm / 60)} rad/s`, error: 'MC-W-PI', siFuera: 'Las vueltas por segundo están bien, pero cada vuelta son 2π rad. Con π contaste media vuelta por cada vuelta.' },
            ], n => `${enPi(n)} rad/s`),
            solucion: { texto: `${rpm} vueltas en 60 s son ${f(rpm / 60)} vueltas por segundo. Cada vuelta son 2π rad, así que se multiplica por 2π.`, ecuacion: [Mw, ` = 2π · ${f(rpm / 60)} = `, pv(`${enPi(kk)} rad/s`)] },
          };
        }
        // Nivel examen: las vueltas en minutos, y ω en rad/s (unidades mezcladas).
        const [n, tm] = r.de([[90, 1], [180, 2], [360, 3], [600, 5], [240, 2], [450, 3], [900, 5], [300, 2]]), kk = 2 * n / (60 * tm);
        return {
          pregunta: ['Una rueda dentada da ', ps(`${n} vueltas`), ' en ', pt(`${tm} ${tm === 1 ? 'minuto' : 'minutos'}`), ', siempre pareja. ¿Cuál es su velocidad angular, en rad/s?'],
          datos: [D2.w, D2.vuelta, D2.min],
          dibujo: giroF({ alto: 200, cuerpos: [{ tipo: 'engranaje', c: [160, 98], R: 74, dientes: 16 }], sentido: [{ f: 1.18, de: 30, a: 80 }], textos: [{ x: 312, y: 190, texto: `${n} vueltas`, color: 'f', ancla: 'end' }],
            alt: `Una rueda dentada que da ${n} vueltas en ${tm} minutos.` }),
          opciones: opciones(kk, [
            { id: 'sin-min', texto: `${enPi(2 * n / tm)} rad/s`, error: 'U-MIN', siFuera: 'El ángulo está bien, 2π por cada vuelta, pero lo dividiste entre minutos. ω se pide en rad/s, así que el tiempo va en segundos.' },
            { id: 'sin-2pi', texto: `${f(n / (60 * tm))} rad/s`, error: 'MC-W-SIN-2PI', siFuera: 'Las vueltas por segundo están bien, pero ω cuenta radianes. Falta pasar las vueltas a radianes: cada una son 2π rad.' },
            { id: 'periodo', texto: `${f(60 * tm / n, 3)} rad/s`, error: 'MC-T-F', siFuera: 'Ese número es el período, lo que tarda una vuelta, en segundos. ω es otra cosa: el ángulo girado dividido entre el tiempo.' },
          ], n2 => `${enPi(n2)} rad/s`),
          solucion: { texto: `${n} vueltas son ${enPi(2 * n)} rad, y los ${tm} min son ${tm * 60} s. ω es el ángulo entre el tiempo.`, ecuacion: [Mw, ' = ', { frac: [ps(enPi(2 * n)), pt(`${tm * 60}`)] }, ' = ', pv(`${enPi(kk)} rad/s`)] },
        };
      },
    },
  };

  // ======================= B3: velocidad tangencial y transmisión (el carrusel con dos caballos) =======================
  // Cambia: a qué distancia del eje va cada amigo · Permanece: la vuelta de 12 s, la misma para los dos · Progresa: el
  // camino de cada caballo, más largo el de afuera · Se reserva: dos ruedas unidas por una cadena (el plato y el piñón,
  // en Predice) · Debe verse: misma ω, distinta v; v = ω · r.
  // El carrusel: eje en (160; 118), 100 px = 4 m (25 px por metro). Las flechas de la velocidad, 20 px por cada m/s.
  const T_B3 = 12, KV3 = 20;
  const vB3 = r => 2 * PI * r / T_B3;
  function carruselB3(ra, rb, t) {
    const g = 360 * t / T_B3, aA = 90 + g, aB = 270 + g;
    return {
      alto: 240, cuerpos: [Object.assign({}, CARRUSEL, { giro: g })],
      arcos: g > 0.5 ? [{ de: 90, a: aA, f: ra / 4 }, { de: 270, a: aB, f: rb / 4 }] : [],
      radios: [{ ang: aA, f: ra / 4, discontinuo: true }, { ang: aB, f: rb / 4, discontinuo: true }],
      puntos: [{ ang: aA, f: ra / 4, tipo: 'caballo', texto: 'Ana', lado: -1 }, { ang: aB, f: rb / 4, tipo: 'caballo', texto: 'Beto', lado: 1 }],
      flechas: [{ ang: aA, f: ra / 4, largo: vB3(ra) * KV3 }, { ang: aB, f: rb / 4, largo: vB3(rb) * KV3 }],
      alt: `Carrusel visto desde arriba, que da una vuelta cada 12 s. Ana va a ${f(ra, 1)} m del eje y Beto, a ${f(rb, 1)} m; la flecha de cada uno es su velocidad.`,
    };
  }
  const juegoB3 = val => giroF(carruselB3(val.ra, val.rb, val.t));
  // Predice y Mira: el plato y el piñón de una bicicleta, unidos por la cadena (el plato con el doble de radio).
  const PLATO = { tipo: 'engranaje', c: [96, 104], R: 60, dientes: 20 }, PINON = { tipo: 'engranaje', c: [244, 104], R: 30, dientes: 10 };
  const bici = (o = {}) => ({ alto: 214, cuerpos: [Object.assign({}, PLATO, { giro: o.g1 || 0 }), Object.assign({}, PINON, { giro: o.g2 || 0 })], correas: [{ de: 0, a: 1, tipo: 'cadena' }],
    radios: o.radios || [], arcos: o.arcos || [], sentido: o.sentido || [{ en: 0, f: 1.22, de: 100, a: 150 }],
    textos: o.textos || [{ x: 96, y: 206, texto: 'plato', ancla: 'middle' }, { x: 244, y: 206, texto: 'piñón', ancla: 'middle' }],
    alt: o.alt || 'El plato y el piñón de una bicicleta, unidos por la cadena; el plato tiene el doble de radio.' });
  const PRED_B3 = bici({ textos: [{ x: 96, y: 206, texto: 'plato: 1 vuelta', ancla: 'middle', color: 'f' }, { x: 244, y: 206, texto: 'piñón: ?', ancla: 'middle' }] });
  const MIRA_B3 = Object.assign(bici(), { cortes: [
    { arcos: [{ en: 0, de: 0, a: 359.99 }], textos: [{ x: 96, y: 206, texto: 'plato: 1 vuelta', ancla: 'middle', color: 'f' }, { x: 244, y: 206, texto: 'piñón', ancla: 'middle' }] },
    { arcos: [{ en: 0, de: 0, a: 359.99 }, { en: 1, de: 0, a: 359.99 }], textos: [{ x: 96, y: 206, texto: 'plato: 1 vuelta', ancla: 'middle', color: 'f' }, { x: 244, y: 206, texto: 'piñón: 2 vueltas', ancla: 'middle', color: 'f' }] },
    { flechas: [{ en: 0, ang: 90, largo: 44, texto: 'v' }, { en: 1, ang: 90, largo: 44, texto: 'v' }], textos: [{ x: 96, y: 206, texto: 'plato: ω', ancla: 'middle', color: 'o' }, { x: 244, y: 206, texto: 'piñón: 2ω', ancla: 'middle', color: 'o' }] },
  ] });

  const D3 = {
    v: ['Velocidad tangencial: ', Mv, ' = ', Mw, ' · r'],
    w: ['Velocidad angular: ', Mw, ' = ', { frac: ['2π', MT] }],
    faja: ['Faja, cadena o contacto: ', sub(Mw, '1'), ' · ', sub('r', '1'), ' = ', sub(Mw, '2'), ' · ', sub('r', '2'), ' (la misma v en el borde)'],
    eje: 'Ruedas en un mismo eje: giran con la misma ω',
    disco: 'Todos los puntos de un mismo disco giran con la misma ω',
    rpm: '1 rpm = 1 vuelta por minuto; 1 vuelta = 2π rad; 1 min = 60 s',
    cm: '1 m = 100 cm',
    tierra: ['λ es la latitud: un lugar a latitud λ gira alrededor del eje de la Tierra con radio r = R · cos λ'],
    datosTierra: 'R = 6400 km (radio de la Tierra); una vuelta en 24 h; π = 3; cos 60° = 1/2 y sen 60° ≈ 0,87',
  };

  // Ejemplos resueltos de B3. Cuentas rehechas aparte (cuentas-b.js: mide el camino de cada punto en un tiempo corto, sin
  // v = ω·r): 0,5·3; 4/0,2; 6/2; 30·0,1; 1,2/0,06; 2π/12 y π/6·3; 120 rpm = 4π y 4π·0,3; 60·0,1 y 6/0,3; 4/0,5 y
  // 8·0,2; 300·6/15; 6400·cos 60° y 2·3·3200/24; la bicicleta (2π, 0,4π, 5π, 1,75π); 60·10/5; 40·5/20 y 10·0,1;
  // (6 − 2)/0,2; y el valor de cada alternativa equivocada con el error que dice el resuelto.
  const figPoleas = (cs, o = {}) => giroF({ alto: o.alto || 200, cuerpos: cs, correas: o.correas || [{ de: 0, a: 1, tipo: 'faja' }], radios: o.radios || [], textos: o.textos || [],
    puntos: o.puntos || [], sentido: o.sentido || [{ en: 0, f: 1.25, de: 100, a: 150 }], flechas: o.flechas || [], alt: o.alt });
  const CUERPO_B3 = q => (q.includes('aspa') ? 'ventilador' : q.includes('llanta') ? 'llanta' : q.includes('carrusel') ? 'carrusel' : q.includes('polea') ? 'polea' : 'disco');
  const EJEMPLOS_TANGENCIAL = [
    { nivel: 1, titulo: 'La rapidez del caballo',
      figura: figCarrusel({ caballos: [{ f: 0.75, ang: 40, texto: 'caballo' }], radios: [{ ang: 40, f: 0.75, texto: 'r = 3 m', lado: -1 }], flechas: [{ ang: 40, f: 0.75, largo: 40, texto: '?' }],
        textos: [{ x: 8, y: 236, texto: 'ω = 0,5 rad/s', color: 'o' }] }),
      enunciado: ['El carrusel gira con ', pv('ω = 0,5 rad/s'), '. ¿Con qué rapidez va un caballo a 3 m del eje?'],
      datos: [D3.v],
      solucion: [{ texto: 'En cada segundo, el carrusel gira 0,5 rad. A 3 m del eje, ese ángulo es un arco de 0,5 · 3 = 1,5 m, y eso recorre el caballo por segundo.', ecuacion: [Mv, ' = ', pv('0,5'), ' · 3 = ', pv('1,5 m/s')] }],
      respuesta: ['Va a ', pv('1,5 m/s')] },
    { nivel: 1, titulo: 'La ω con la rapidez',
      figura: figPoleas([{ tipo: 'polea', c: [160, 96], R: 70 }], { correas: [], radios: [{ ang: 150, texto: 'r = 0,2 m', lado: 1 }], flechas: [{ en: 0, ang: 60, largo: 44, texto: '4 m/s' }], sentido: [{ f: 1.2, de: 110, a: 160 }] }),
      enunciado: ['El borde de una polea, de 0,2 m de radio, va a ', pv('4 m/s'), '. ¿Cuál es su velocidad angular?'],
      datos: [D3.v],
      solucion: [{ texto: 'Si v = ω · r, la ω es la rapidez del borde dividida entre su radio:', ecuacion: [Mw, ' = ', { frac: [pv('4'), '0,2'] }, ' = ', pv('20 rad/s')] }],
      respuesta: [pv('ω = 20 rad/s')] },
    { nivel: 1, titulo: '¿A qué distancia del eje?',
      figura: figCarrusel({ caballos: [{ f: 0.75, ang: 40, texto: 'Ana' }], radios: [{ ang: 40, f: 0.75, texto: 'r = ?', lado: -1 }], flechas: [{ ang: 40, f: 0.75, largo: 50, texto: '6 m/s' }],
        textos: [{ x: 8, y: 236, texto: 'ω = 2 rad/s', color: 'o' }] }),
      enunciado: ['En un juego que gira con ', pv('ω = 2 rad/s'), ', Ana va a ', pv('6 m/s'), '. ¿A qué distancia del eje está?'],
      datos: [D3.v],
      solucion: [{ texto: 'Si v = ω · r, la distancia al eje es la rapidez dividida entre ω:', ecuacion: ['r = ', { frac: [pv('6'), pv('2')] }, ' = 3 m'] }],
      respuesta: [neg('r = 3 m')] },
    { nivel: 1, titulo: 'La rapidez de la faja',
      figura: figPoleas([{ tipo: 'polea', c: [90, 100], R: 34 }, { tipo: 'polea', c: [234, 100], R: 64 }], { radios: [{ ang: 270, texto: 'r = 0,1 m', lado: -1 }],
        textos: [{ x: 90, y: 22, texto: 'ω = 30 rad/s', color: 'o', ancla: 'middle' }, { x: 234, y: 196, texto: 'faja: ?', ancla: 'middle' }] }),
      enunciado: ['Una polea de 0,1 m de radio gira con ', pv('ω = 30 rad/s'), ' y mueve una faja que no resbala. ¿Con qué rapidez avanza la faja?'],
      datos: [D3.v, D3.faja],
      solucion: [{ texto: 'Como la faja no resbala, avanza igual de rápido que el borde de la polea, que va a ω · r:', ecuacion: [Mv, ' = ', pv('30'), ' · 0,1 = ', pv('3 m/s')] }],
      respuesta: ['La faja avanza a ', pv('3 m/s')] },
    { nivel: 1, titulo: 'El piñón con la cadena',
      figura: giroF(bici({ textos: [{ x: 96, y: 206, texto: 'cadena: 1,2 m/s', ancla: 'middle', color: 'o' }, { x: 244, y: 206, texto: 'piñón: 6 cm', ancla: 'middle' }] })),
      enunciado: ['La cadena de una bicicleta avanza a ', pv('1,2 m/s'), ' y mueve el piñón, de 0,06 m de radio. ¿Con qué velocidad angular gira el piñón?'],
      datos: [D3.v, D3.faja],
      solucion: [{ texto: 'La cadena no resbala, así que el borde del piñón va a 1,2 m/s, como ella; ω es esa rapidez entre el radio:', ecuacion: [Mw, ' = ', { frac: [pv('1,2'), '0,06'] }, ' = ', pv('20 rad/s')] }],
      respuesta: ['Gira con ', pv('20 rad/s')] },
    { nivel: 2, titulo: 'Con el período',
      figura: figCarrusel({ caballos: [{ f: 0.75, ang: 40, texto: 'caballo' }], radios: [{ ang: 40, f: 0.75, texto: 'r = 3 m', lado: -1 }], flechas: [{ ang: 40, f: 0.75, largo: 40, texto: '?' }],
        textos: [{ x: 8, y: 236, texto: 'T = 12 s', color: 'i' }] }),
      enunciado: ['El carrusel de la plaza da una vuelta cada ', pt('12 s'), '. ¿Con qué rapidez va un caballo a 3 m del eje?'],
      datos: [D3.w, D3.v],
      solucion: [
        { texto: 'Primero la ω del carrusel: una vuelta, 2π rad, en 12 s.', ecuacion: [Mw, ' = ', { frac: ['2π', pt('12')] }, ' = ', pv('π/6 rad/s')] },
        { texto: 'Después, la rapidez del caballo: ω por su distancia al eje, 3 m.', ecuacion: [Mv, ' = ', { frac: [pv('π'), '6'] }, ' · 3 = ', pv('π/2 m/s'), ' ≈ ', pv('1,57 m/s')] },
      ],
      respuesta: ['Va a ', pv('π/2 m/s'), ', unos ', pv('1,57 m/s')] },
    { nivel: 2, titulo: 'La llanta en rpm',
      figura: figLlanta({ radio: 'r = 0,3 m', textos: [{ x: 312, y: 22, texto: '120 rpm', ancla: 'end' }] }),
      enunciado: ['Una llanta de 0,3 m de radio gira a 120 rpm. ¿Con qué rapidez va un punto de su borde?'],
      datos: [D3.v, D3.rpm],
      solucion: [
        { texto: '120 vueltas en 60 s son 2 vueltas por segundo, y cada vuelta son 2π rad:', ecuacion: [Mw, ' = 2 · 2π = ', pv('4π rad/s')] },
        { texto: 'El punto del borde está a 0,3 m del eje, así que va a ω por 0,3 m:', ecuacion: [Mv, ' = ', pv('4π'), ' · 0,3 = ', pv('1,2π m/s'), ' ≈ ', pv('3,77 m/s')] },
      ],
      respuesta: ['Va a ', pv('1,2π m/s'), ', unos ', pv('3,77 m/s')] },
    { nivel: 2, titulo: 'Dos poleas con faja',
      figura: figPoleas([{ tipo: 'polea', c: [86, 100], R: 30 }, { tipo: 'polea', c: [226, 100], R: 80 }], { alto: 206,
        textos: [{ x: 86, y: 22, texto: 'ω₁ = 60 rad/s', color: 'o', ancla: 'middle' }, { x: 86, y: 160, texto: '10 cm', ancla: 'middle' }, { x: 226, y: 200, texto: '30 cm: ω₂ = ?', ancla: 'middle' }] }),
      enunciado: ['Una faja une una polea de 10 cm de radio, que gira con ', pv('60 rad/s'), ', con otra de 30 cm. ¿Con qué velocidad angular gira la grande?'],
      datos: [D3.v, D3.faja, D3.cm],
      solucion: [
        { texto: 'La faja va como el borde de la polea chica: ω por su radio, pasado a metros.', ecuacion: [Mv, ' = ', pv('60'), ' · 0,1 = ', pv('6 m/s')] },
        { texto: 'El borde de la grande va igual de rápido que la faja, así que su ω es esa rapidez entre su radio:', ecuacion: [sub(Mw, '2'), ' = ', { frac: [pv('6'), '0,3'] }, ' = ', pv('20 rad/s')] },
      ],
      respuesta: ['La grande gira con ', pv('20 rad/s')] },
    { nivel: 2, titulo: 'Dos puntos de un disco',
      figura: giroF({ alto: 200, cuerpos: [{ tipo: 'disco', c: [160, 98], R: 85 }], radios: [{ ang: 0, texto: '0,5 m', lado: 1 }, { ang: 120, f: 0.4, texto: '0,2 m', lado: -1 }],
        puntos: [{ ang: 0, tipo: 'punto', texto: 'A' }, { ang: 120, f: 0.4, tipo: 'punto', texto: 'B' }], flechas: [{ ang: 0, largo: 48, texto: '4 m/s' }], sentido: [{ f: 1.12, de: 30, a: 80 }],
        alt: 'Un disco: el punto A del borde, a 0,5 m del eje, va a 4 m/s; el punto B está a 0,2 m del eje.' }),
      enunciado: ['En un disco que gira, el punto A del borde, a 0,5 m del eje, va a ', pv('4 m/s'), '. ¿Con qué rapidez va el punto B, a 0,2 m del eje?'],
      datos: [D3.v, D3.disco],
      solucion: [
        { texto: 'Todo el disco gira con una sola ω, y A permite calcularla:', ecuacion: [Mw, ' = ', { frac: [pv('4'), '0,5'] }, ' = ', pv('8 rad/s')] },
        { texto: 'B gira con esa misma ω, pero más cerca del eje, así que va más lento:', ecuacion: [sub(Mv, 'B'), ' = ', pv('8'), ' · 0,2 = ', pv('1,6 m/s')] },
      ],
      respuesta: ['B va a ', pv('1,6 m/s')] },
    { nivel: 2, titulo: 'Dos ruedas dentadas',
      figura: figPoleas([{ tipo: 'engranaje', c: [104, 100], R: 36, dientes: 12 }, { tipo: 'engranaje', c: [200, 100], R: 54, dientes: 18 }], { correas: [], alto: 196,
        textos: [{ x: 104, y: 22, texto: 'A: 6 cm', ancla: 'middle' }, { x: 8, y: 188, texto: '300 rpm', color: 'o' }, { x: 220, y: 22, texto: 'B: 15 cm', ancla: 'middle' }, { x: 312, y: 188, texto: '? rpm', ancla: 'end' }], sentido: [{ en: 0, f: 1.3, de: 110, a: 160 }] }),
      enunciado: ['La rueda dentada A, de 6 cm de radio, gira a ', pv('300 rpm'), ' y empuja a la rueda B, de 15 cm, que está en contacto con ella. ¿A cuántas rpm gira B?'],
      datos: [D3.v, D3.faja],
      solucion: [
        { texto: 'Las ruedas en contacto no resbalan, así que sus bordes van igual de rápido: ω por r es igual en las dos.', ecuacion: [pv('300'), ' · 6 = ', sub(Mw, 'B'), ' · 15'] },
        { texto: 'Se despeja la de B; las rpm sirven, porque las dos ω van en la misma unidad.', ecuacion: [sub(Mw, 'B'), ' = ', { frac: [pv('1800'), '15'] }, ' = ', pv('120 rpm')] },
      ],
      respuesta: ['B gira a ', pv('120 rpm')] },
    { nivel: 3, titulo: 'Una ciudad a 60° de latitud',
      figura: giroF({ alto: 236, cuerpos: [{ tipo: 'tierra', c: [150, 116], R: 92, latitud: 60 }], radios: [{ ang: 60, texto: 'R', lado: -1 }],
        arcos: [{ tipo: 'angulo', de: 0, a: 60, rpx: 26, texto: '60°', color: 'tinta' }], puntos: [{ ang: 60, tipo: 'punto', texto: 'ciudad' }], sentido: [{ f: 1.12, de: 100, a: 150 }],
        alt: 'La Tierra con el paralelo de 60° de latitud y una ciudad sobre él.' }),
      enunciado: ['La Tierra da una vuelta sobre su eje en 24 h. ¿Con qué rapidez la lleva su giro a una ciudad que está a 60° de latitud?'],
      alternativas: ['1600 km/h', '800 km/h', '1392 km/h', '400 km/h', '3200 km/h'],
      datos: [D3.v, D3.w, D3.tierra, D3.datosTierra],
      solucion: [
        { texto: 'La ciudad no gira con el radio de la Tierra: da vueltas en su paralelo, un círculo más chico, alrededor del eje.', ecuacion: ['r = 6400 · cos 60° = 6400 · ', { frac: ['1', '2'] }, ' = 3200 km'] },
        { texto: 'En 24 h recorre una vuelta de ese paralelo, 2πr:', ecuacion: [Mv, ' = ', { frac: ['2 · 3 · 3200', pt('24')] }, ' = ', pv('800 km/h')] },
        { texto: ['La ', neg('A'), ' usa el radio de la Tierra, que solo vale en el ecuador. La ', neg('C'), ' usa el seno de la latitud en vez del coseno. La ', neg('D'), ' olvida el 2 de 2π y cuenta media vuelta. La ', neg('E'), ' da el radio del paralelo como si fuera una rapidez.'] },
      ],
      respuesta: [neg('B'), ', ', pv('800 km/h')] },
    { nivel: 3, titulo: 'La rapidez de la bicicleta',
      figura: giroF(bici({ textos: [{ x: 96, y: 206, texto: 'plato: 20 cm', ancla: 'middle' }, { x: 244, y: 206, texto: 'piñón: 8 cm', ancla: 'middle' }, { x: 8, y: 20, texto: '1 vuelta cada segundo', color: 'o' }],
        alt: 'El plato de 20 cm y el piñón de 8 cm de una bicicleta, unidos por la cadena; el piñón comparte eje con la rueda de 35 cm.' })),
      enunciado: ['En una bicicleta, el plato mide 20 cm de radio y el piñón, 8 cm; la rueda de atrás, en el eje del piñón, mide 35 cm. Si pedaleas una vuelta cada segundo, ¿con qué rapidez avanza la bicicleta?'],
      alternativas: ['2,2 m/s', '0,88 m/s', '1,26 m/s', '5,5 m/s', '13,74 m/s'],
      datos: [D3.v, D3.faja, D3.eje, D3.cm],
      solucion: [
        { texto: 'Una vuelta por segundo son 2π rad/s para el plato, y la cadena avanza como su borde:', ecuacion: [Mv, ' = ', pv('2π'), ' · 0,2 = ', pv('0,4π m/s')] },
        { texto: 'El borde del piñón va como la cadena, y la rueda de atrás, en el mismo eje, gira con la ω del piñón:', ecuacion: [Mw, ' = ', { frac: [pv('0,4π'), '0,08'] }, ' = ', pv('5π rad/s'), ';   ', pv('5π'), ' · 0,35 ≈ ', pv('5,5 m/s')] },
        { texto: ['La ', neg('A'), ' le da a la rueda la ω del plato, pero el piñón, más chico, gira más rápido. La ', neg('B'), ' invierte la razón de los radios. La ', neg('C'), ' da la rapidez de la cadena, no la de la rueda. La ', neg('E'), ' eleva la razón al cuadrado.'] },
      ],
      respuesta: [neg('D'), ', unos ', pv('5,5 m/s')] },
    { nivel: 3, titulo: 'Tres ruedas en contacto',
      figura: figPoleas([{ tipo: 'engranaje', c: [64, 104], R: 28, dientes: 10 }, { tipo: 'engranaje', c: [161, 104], R: 64, dientes: 22 }, { tipo: 'engranaje', c: [252, 104], R: 22, dientes: 8 }], { correas: [], alto: 206,
        textos: [{ x: 64, y: 22, texto: 'A: 10 cm', ancla: 'middle' }, { x: 161, y: 200, texto: 'B: 30 cm', ancla: 'middle' }, { x: 252, y: 22, texto: 'C: 5 cm', ancla: 'middle' }, { x: 8, y: 196, texto: 'A: 60 rpm', color: 'o' }],
        sentido: [{ en: 0, f: 1.4, de: 120, a: 170 }] }),
      enunciado: ['Tres ruedas dentadas están en fila, cada una en contacto con la siguiente: A, de 10 cm de radio; B, de 30 cm, y C, de 5 cm. Si A gira a ', pv('60 rpm'), ', ¿a cuántas rpm gira C?'],
      alternativas: ['20 rpm', '360 rpm', '30 rpm', '60 rpm', '120 rpm'],
      datos: [D3.v, D3.faja],
      solucion: [
        { texto: 'En cada contacto los bordes van igual de rápido, así que todos los bordes tienen la misma v:', ecuacion: [pv('60'), ' · 10 = ', sub(Mw, 'B'), ' · 30 = ', sub(Mw, 'C'), ' · 5'] },
        { texto: 'Se despeja la de C. La rueda del medio solo pasa la misma rapidez de borde, así que no cambia la cuenta.', ecuacion: [sub(Mw, 'C'), ' = ', { frac: [pv('600'), '5'] }, ' = ', pv('120 rpm')] },
        { texto: ['La ', neg('A'), ' se queda en B y da sus rpm. La ', neg('B'), ' usa el radio de B donde iba el de A. La ', neg('C'), ' invierte la razón: la rueda chica gira más rápido, no más lento. La ', neg('D'), ' cree que todas giran igual, pero solo sus bordes van igual.'] },
      ],
      respuesta: [neg('E'), ', ', pv('120 rpm')] },
    { nivel: 3, titulo: 'El balde y la polea doble',
      figura: figPoleas([{ tipo: 'polea', c: [70, 92], R: 26 }, { tipo: 'polea', c: [220, 92], R: 80 }, { tipo: 'polea', c: [220, 92], R: 40 }], { alto: 210,
        // Qué garganta lleva la faja y cuál la soga del balde (lector en frío B, tarjeta 09).
        textos: [{ x: 70, y: 22, texto: 'motor: 5 cm', ancla: 'middle' }, { x: 70, y: 150, texto: '40 rad/s', color: 'o', ancla: 'middle' },
          { x: 312, y: 22, texto: 'faja: la de 20 cm', ancla: 'end' }, { x: 312, y: 204, texto: 'soga del balde: la de 10 cm', ancla: 'end' }],
        flechas: [{ en: 2, ang: 0, dir: [0, -1], largo: 30, color: 'o', texto: '?' }] }),
      enunciado: ['Una polea de 5 cm de radio gira con ', pv('40 rad/s'), ' y con una faja mueve la garganta de 20 cm de una polea doble. La soga del balde va en la de 10 cm. ¿Qué rapidez lleva?'],
      alternativas: ['1 m/s', '2 m/s', '4 m/s', '16 m/s', '10 m/s'],
      datos: [D3.v, D3.faja, D3.eje, D3.cm],
      solucion: [
        { texto: 'La faja no resbala, así que va como el borde del motor y como la garganta grande:', ecuacion: [pv('40'), ' · 0,05 = ', sub(Mw, '2'), ' · 0,2   →   ', sub(Mw, '2'), ' = ', pv('10 rad/s')] },
        { texto: 'La garganta chica está en el mismo eje, así que gira con la misma ω, y la soga sube como su borde:', ecuacion: [Mv, ' = ', pv('10'), ' · 0,1 = ', pv('1 m/s')] },
        { texto: ['La ', neg('B'), ' da la rapidez de la faja, pero la soga va en la garganta chica. La ', neg('C'), ' usa la ω del motor para la polea doble. La ', neg('D'), ' invierte la razón de los radios. La ', neg('E'), ' da la ω, en rad/s, como si fuera la rapidez.'] },
      ],
      respuesta: [neg('A'), ', ', pv('1 m/s')] },
    { nivel: 3, titulo: 'Dos puntos en el mismo radio',
      figura: giroF({ alto: 200, cuerpos: [{ tipo: 'disco', c: [160, 98], R: 85 }], radios: [{ ang: 0 }], puntos: [{ ang: 0, f: 0.95, tipo: 'punto', texto: 'A', lado: 1 }, { ang: 0, f: 0.45, tipo: 'punto', texto: 'B', lado: -1 }],
        flechas: [{ ang: 0, f: 0.95, largo: 54, texto: '6 m/s' }, { ang: 0, f: 0.45, largo: 18, texto: '2 m/s' }], sentido: [{ f: 1.12, de: 30, a: 80 }],
        alt: 'Un disco que gira; A y B están sobre el mismo radio, A más afuera que B, separados 20 cm.' }),
      enunciado: ['En un disco que gira, los puntos A y B están sobre un mismo radio, separados 20 cm. A va a ', pv('6 m/s'), ' y B, a ', pv('2 m/s'), '. ¿Cuál es la velocidad angular del disco?'],
      alternativas: ['40 rad/s', '0,2 rad/s', '20 rad/s', '30 rad/s', '10 rad/s'],
      datos: [D3.v, D3.disco, D3.cm],
      solucion: [
        { texto: 'A y B están en el mismo disco, así que tienen la misma ω; A está 0,2 m más afuera:', ecuacion: [pv('6'), ' = ', Mw, ' · (', sub('r', 'B'), ' + 0,2);   ', pv('2'), ' = ', Mw, ' · ', sub('r', 'B')] },
        { texto: 'Al restar las dos ecuaciones, el radio de B desaparece y queda solo ω:', ecuacion: [pv('6'), ' − ', pv('2'), ' = ', Mw, ' · 0,2   →   ', Mw, ' = ', pv('20 rad/s')] },
        { texto: ['La ', neg('A'), ' suma las rapideces, cuando hay que restarlas. La ', neg('B'), ' deja los 20 cm sin pasar a metros. La ', neg('D'), ' divide solo la rapidez de A entre 0,2 m, y la ', neg('E'), ' solo la de B, pero 0,2 m no es el radio de ninguno.'] },
      ],
      respuesta: [neg('C'), ', ', pv('20 rad/s')] },
  ];

  const tangencial = {
    id: 'velocidad-tangencial',
    titulo: 'Velocidad tangencial y transmisión',
    pregunta: 'En un carrusel, ¿quién va más rápido: el caballo de adentro o el de afuera?',
    temas: ['MCU'],
    pieza: 'fis-giro',
    aprendizaje: 'En un mismo disco todos giran con la misma ω, pero el de afuera va más rápido: v = ω·r. Una faja iguala v.',
    actividad: 'Sentar a dos amigos en caballos distintos del carrusel.',
    lee: {
      tarjetas: [
        { titulo: 'Dos amigos en el carrusel', texto: ['Ana y Beto suben al carrusel de la plaza, cada uno a su caballo. El carrusel da una vuelta cada 12 s, y los dos dan esa vuelta juntos: giran con la misma ', Mw, '.'],
          dibujo: juegoB3({ ra: 3.5, rb: 1.5, t: 2 }) },
        { titulo: 'Velocidad tangencial', texto: ['La velocidad de cada caballo apunta a lo largo del giro, tangente al círculo, es decir, rozándolo sin entrar. Por eso se llama velocidad tangencial, ', Mv, ': dice cuántos metros de su círculo recorre el caballo en cada segundo.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Elige a qué distancia del eje va cada uno y deja correr el reloj. Compara el camino que deja cada caballo en el mismo tiempo, y el largo de su flecha: ¿quién recorre más?' },
      ],
    },
    ejemplos: EJEMPLOS_TANGENCIAL,
    juega: {
      pieza: 'fis-giro',
      consigna: 'El carrusel de la plaza da una vuelta cada 12 s. Tus amigos Ana y Beto eligen a qué distancia del eje van.',
      mision: {
        texto: 'Haz que Ana vaya justo al doble de rápido que Beto.',
        logrado: val => Math.abs(val.ra - 2 * val.rb) < 1e-9,
        bien: 'Giran juntos, pero el círculo de Ana es el doble: va al doble de rápido.',
      },
      voz: '¿Quién recorre más camino en el mismo tiempo?',
      leyenda: [
        { s: 'flecha', t: 'la velocidad de cada caballo' },
        { s: 'camino', t: 'lo que recorrió cada caballo' },
        { s: [Mt], t: 'segundos en el reloj' },
        { s: 'Ana, Beto', t: 'tus dos amigos' },
      ],
      controles: [
        { id: 'ra', etiqueta: 'Ana, del eje', min: 1, max: 4, paso: 0.5, inicio: 3, unidad: 'm', decimales: 1 },
        { id: 'rb', etiqueta: 'Beto, del eje', min: 1, max: 4, paso: 0.5, inicio: 2, unidad: 'm', decimales: 1 },
        { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: 12, paso: 0.25, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 2, modo: 'repite' } },
      ],
      dibujo: juegoB3,
      lectura: val => ['Ana va a ', pv(`${f(vB3(val.ra))} m/s`), ' y Beto, a ', pv(`${f(vB3(val.rb))} m/s`)],
      resumen: { ra: 3, rb: 2, t: 3 },
      minimo: 3,
    },
    predice: {
      pregunta: 'En una bicicleta, la cadena une el plato con el piñón; el plato tiene el doble de radio. Cuando el plato da una vuelta, ¿cuántas da el piñón?',
      datos: ['La cadena no resbala: avanza lo mismo sobre las dos ruedas dentadas.'],
      opciones: [
        { id: 'c', texto: 'Dos vueltas', correcta: true },
        { id: 'igual', texto: 'Una vuelta', error: 'MC-TR-W', siFuera: 'En el carrusel todo da la vuelta junto porque es un solo cuerpo. El plato y el piñón son dos ruedas distintas: la cadena solo hace que sus bordes avancen lo mismo, no que den las mismas vueltas.' },
        { id: 'media', texto: 'Media vuelta', error: 'MC-TR-INV', siFuera: 'Es cierto que giran distinto, pero al revés. La cadena avanza lo mismo en las dos ruedas, y en la rueda chica ese largo alcanza para más vueltas, no para menos.' },
        { id: 'cuatro', texto: 'Cuatro vueltas', error: 'PR-CUADRADO', siFuera: 'Es cierto que da más vueltas, pero el contorno de una rueda crece igual que su radio, no como su cuadrado. Con el doble de radio, el contorno es el doble, no el cuádruple.' },
      ],
      dibujo: giroF(PRED_B3),
      revelar: giroF(MIRA_B3, { corte: 1 }),
      coincide: 'Coincide: el borde del piñón mide la mitad, y la cadena lo recorre dos veces.',
    },
    mira: {
      pieza: 'fis-giro',
      datos: MIRA_B3,
      pasos: [
        { estado: { corte: 0 }, texto: 'El plato, de radio r, gira una vuelta, y la cadena avanza lo que mide su contorno.', ecuacion: ['cadena = 2π · r'] },
        { estado: { corte: 1 }, texto: 'Ese mismo largo de cadena pasa por el piñón, que tiene la mitad de radio y la mitad de contorno: le alcanza para dos vueltas.', ecuacion: [MN, ' = ', { frac: ['2π · r', '2π · r/2'] }, ' = ', ps('2 vueltas')] },
        { estado: { corte: 2 }, texto: 'Los dos bordes van igual de rápido, porque los une la cadena. Para ir a la misma v con la mitad de radio, el piñón tiene que girar con el doble de ω.', ecuacion: [Mv, ' = ', sub(Mw, 'plato'), ' · r = ', sub(Mw, 'piñón'), ' · ', { frac: ['r', '2'] }, '   →   ', sub(Mw, 'piñón'), ' = 2', sub(Mw, 'plato')] },
      ],
    },
    regla: {
      texto: 'En un mismo cuerpo, todos los puntos giran con la misma ω, pero cada uno va a v = ω · r: el de afuera recorre un círculo más grande en el mismo tiempo, así que va más rápido. Una faja o una cadena que no resbala iguala la v de los bordes, y la rueda chica gira más rápido.',
      ecuacion: [Mv, ' = ', Mw, ' · r;   ', { llave: [sub(Mw, '1'), ' · ', sub('r', '1'), ' = ', sub(Mw, '2'), ' · ', sub('r', '2')], nota: 'faja, cadena o contacto', color: 'c-o' }],
      condicion: 'la faja, la cadena o el contacto no resbalan: así los bordes van a la misma v. Las ruedas en un mismo eje, en cambio, comparten la ω. Si la faja patina, el borde de la segunda va más lento.',
    },
    // Así se resuelve: con el período (el carrusel) y con dos ruedas en contacto en rpm; «Ahora tú» va con ω, con dos
    // puntos de un disco, con fajas en rad/s y con tres ruedas.
    resuelve: {
      pieza: 'fis-giro',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 0) {
          const [T, ra] = r.de([[10, 2], [10, 3], [12, 2], [12, 3], [12, 4], [20, 4], [15, 3], [8, 2]]), kw = 2 / T, kv = kw * ra;
          return {
            enunciado: ['El carrusel de la plaza da una vuelta cada ', pt(`${T} s`), `. ¿Con qué rapidez va un caballo a ${f(ra)} m del eje?`],
            datos: [D3.w, D3.v],
            dibujo: figCarrusel({ caballos: [{ f: ra / 4, ang: 40, texto: 'caballo' }], radios: [{ ang: 40, f: ra / 4, texto: `r = ${f(ra)} m`, lado: -1 }], flechas: [{ ang: 40, f: ra / 4, largo: 36, texto: '?' }],
              textos: [{ x: 8, y: 236, texto: `T = ${T} s`, color: 'i' }] }),
            pasos: [
              { tipo: 'pide', texto: ['Piden la rapidez ', Mv, ' del caballo.'] },
              { tipo: 'datos', texto: ['El carrusel da una vuelta cada ', pt(`${T} s`), ` y el caballo va a ${f(ra)} m del eje.`] },
              { tipo: 'regla', texto: 'Primero saco la ω de todo el carrusel, que es la misma para todos los caballos; después, la rapidez del caballo a su distancia del eje.', ecuacion: [Mw, ' = ', { frac: ['2π', MT] }, ';   ', Mv, ' = ', Mw, ' · r'] },
              { tipo: 'cuentas', texto: 'Una vuelta, 2π rad, en un período da ω; después la multiplico por la distancia al eje.', ecuacion: [Mw, ' = ', { frac: ['2π', pt(`${T}`)] }, ' = ', pv(`${enPi(kw)} rad/s`), '   →   ', Mv, ' = ', pv(enPi(kw)), ` · ${f(ra)} = `, pv(`${enPi(kv)} m/s`), ' ≈ ', pv(`${f(kv * PI)} m/s`)] },
              { tipo: 'sentido', texto: `Compruebo de otra forma: el caballo recorre una vuelta de 2π · ${f(ra)} ≈ ${f(2 * PI * ra)} m en ${T} s, y eso da la misma rapidez.` },
            ],
            respuesta: ['Va a ', pv(`${enPi(kv)} m/s`), ', unos ', pv(`${f(kv * PI)} m/s`)],
          };
        }
        const [r1, w1, r2] = r.de([[4, 300, 12], [5, 240, 15], [6, 200, 10], [8, 150, 12], [10, 90, 6], [12, 60, 4], [3, 400, 8], [9, 100, 15]]), w2 = w1 * r1 / r2;
        return {
          enunciado: [`Una rueda dentada de ${r1} cm de radio gira a `, pv(`${w1} rpm`), ` y empuja a otra de ${r2} cm, en contacto con ella. ¿A cuántas rpm gira la segunda?`],
          datos: [D3.v, D3.faja],
          dibujo: figPoleas([{ tipo: 'engranaje', c: [110, 100], R: 20 + 3 * r1, dientes: 8 + r1 }, { tipo: 'engranaje', c: [110 + 20 + 3 * r1 + 20 + 3 * r2 + 6, 100], R: 20 + 3 * r2, dientes: 8 + r2 }], { correas: [], alto: 200,
            textos: [{ x: 8, y: 20, texto: `${r1} cm` }, { x: 8, y: 194, texto: `${w1} rpm`, color: 'o' }, { x: 312, y: 20, texto: `${r2} cm`, ancla: 'end' }, { x: 312, y: 194, texto: '? rpm', ancla: 'end' }], sentido: [] }),
          pasos: [
            { tipo: 'pide', texto: 'Piden las rpm de la segunda rueda.' },
            { tipo: 'datos', texto: [`La primera, de ${r1} cm, gira a `, pv(`${w1} rpm`), `; la segunda mide ${r2} cm.`] },
            { tipo: 'regla', texto: 'Las ruedas en contacto no resbalan, así que sus bordes van igual de rápido: ω por r es igual en las dos.', ecuacion: [sub(Mw, '1'), ' · ', sub('r', '1'), ' = ', sub(Mw, '2'), ' · ', sub('r', '2')] },
            { tipo: 'cuentas', texto: 'No hace falta pasar a rad/s: si las dos ω van en rpm, la igualdad sigue valiendo y la respuesta sale en rpm.', ecuacion: [pv(`${w1}`), ` · ${r1} = `, sub(Mw, '2'), ` · ${r2}   →   `, sub(Mw, '2'), ' = ', pv(`${f(w2)} rpm`)] },
            { tipo: 'sentido', texto: r2 > r1 ? 'Tiene sentido: la segunda es más grande, así que necesita menos vueltas para que su borde avance lo mismo.' : 'Tiene sentido: la segunda es más chica, así que da más vueltas para que su borde avance lo mismo.' },
          ],
          respuesta: ['Gira a ', pv(`${f(w2)} rpm`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-giro',
      generar(sm) {
        const r = azar(sm + 77), k = sm % 4;
        if (k === 0) {
          const [quien, w, ra] = r.de([['Un punto de una llanta', 10, 0.3], ['Un punto de una llanta', 20, 0.35], ['Un caballo del carrusel', 0.5, 4], ['Un caballo del carrusel', 0.25, 2],
            ['El borde de un esmeril', 100, 0.08], ['La punta de un aspa del ventilador', 15, 0.6], ['El borde de una polea', 40, 0.15]]);
          const vv = w * ra;
          return {
            pregunta: [quien, ` está a ${f(ra)} m del eje y gira con `, pv(`ω = ${f(w)} rad/s`), '. ¿Con qué rapidez va?'],
            datos: [D3.v],
            // El cuerpo que nombra el texto (el aspa, la llanta, el carrusel…), y la flecha en la punta del radio dibujado
            // (lector en frío A: la flecha iba en otro lugar del borde y el ventilador era un disco).
            dibujo: figPoleas([{ tipo: CUERPO_B3(quien), c: [160, 98], R: 80, giro: 40 }], { correas: [], radios: [{ ang: 40, texto: `r = ${f(ra)} m`, lado: -1 }],
              puntos: [{ ang: 40, tipo: quien.includes('caballo') ? 'caballo' : 'punto' }], flechas: [{ ang: 40, largo: 40, texto: '?' }],
              textos: [{ x: 8, y: 194, texto: `ω = ${f(w)} rad/s`, color: 'o' }], sentido: [{ f: 1.15, de: 160, a: 210 }], alt: `${quien}, a ${f(ra)} m del eje.` }),
            opciones: opciones(vv, [
              { id: 'div', valor: w / ra, error: 'MC-VR', siFuera: 'Usaste ω y r, pero los dividiste. Más lejos del eje, el punto recorre un círculo más grande en el mismo tiempo, así que va más rápido: la rapidez es ω por r.' },
              { id: 'inv', valor: ra / w, error: 'AN-INV', siFuera: 'Juntaste ω y r, pero dividiste el radio entre ω. En cada segundo el punto recorre ω radios, así que se multiplican.' },
              { id: 'sin-r', valor: w, error: 'AN-SIN-R', siFuera: 'Ese número es la ω, en rad/s, y es la misma para todo el cuerpo. La rapidez del punto depende también de su distancia al eje: falta multiplicar por r.' },
              { id: '2pi', valor: 2 * PI * w * ra, error: 'MC-2PI-DE-MAS', siFuera: 'ω · r está bien, pero agregaste un 2π. ω ya está en rad/s, con las vueltas pasadas a radianes, así que otro 2π hace la respuesta unas 6,28 veces más grande.' },
            ], n => `${f(n)} m/s`),
            solucion: { texto: 'En cada segundo el punto gira ω radianes y recorre ω radios, así que su rapidez es ω por su distancia al eje.', ecuacion: [Mv, ' = ', pv(f(w)), ` · ${f(ra)} = `, pv(`${f(vv)} m/s`)] },
          };
        }
        if (k === 1) {
          const [ra, va, rb] = r.de([[4, 2, 1.5], [4, 2, 3], [3, 1.5, 1], [3.5, 2.1, 1.5], [2, 1.2, 0.5], [4, 3, 1], [2.5, 1, 1.5]]), vb = va * rb / ra;
          return {
            pregunta: ['En el carrusel, Ana va a ', `${f(ra)} m del eje y a `, pv(`${f(va)} m/s`), `. ¿Con qué rapidez va Beto, a ${f(rb)} m del eje?`],
            datos: [D3.v, D3.disco],
            dibujo: figCarrusel({ caballos: [{ f: ra / 4, ang: 30, texto: 'Ana' }, { f: rb / 4, ang: 210, texto: 'Beto', lado: 1 }],
              radios: [{ ang: 30, f: ra / 4, texto: `${f(ra)} m`, lado: -1 }, { ang: 210, f: rb / 4, texto: `${f(rb)} m`, lado: 1 }], flechas: [{ ang: 30, f: ra / 4, largo: va * KV3, texto: `${f(va)} m/s` }], sentido: [] }),
            opciones: opciones(vb, [
              { id: 'igual', valor: va, error: 'MC-V-IGUAL', siFuera: 'Es cierto que giran juntos, con la misma ω. Pero Beto va más cerca del eje y recorre un círculo más chico en el mismo tiempo, así que va más lento.' },
              { id: 'inv', valor: va * ra / rb, error: 'MC-TR-INV', siFuera: 'Es cierto que la rapidez cambia con el radio, pero al revés. Más cerca del eje, el círculo es más chico, así que Beto va más lento que Ana, no más rápido.' },
              { id: 'resta', valor: va - (ra - rb) > 0 ? va - (ra - rb) : NaN, error: 'PR1', siFuera: 'Es cierto que Beto va más lento, pero no por una resta. La rapidez es proporcional al radio: si su radio es una fracción del de Ana, su rapidez es esa misma fracción de la de Ana.' },
              { id: 'cuad', valor: va * (rb / ra) ** 2, error: 'PR-CUADRADO', siFuera: 'La razón de los radios está bien, pero va una sola vez. La rapidez crece igual que el radio, no como su cuadrado.' },
              { id: 'v-como-w', valor: va * rb, error: 'MC-V-W', siFuera: 'Multiplicar por el radio de Beto está bien, pero antes hay que sacar la ω que comparten, dividiendo la rapidez de Ana entre su radio.' },
            ], n => `${f(n)} m/s`),
            solucion: { texto: `Los dos giran con la misma ω, que sale de Ana: ${f(va)} ÷ ${f(ra)} = ${f(va / ra, 3)} rad/s. Beto va a esa ω por su radio.`, ecuacion: [sub(Mv, 'B'), ' = ', pv(f(va / ra, 3)), ` · ${f(rb)} = `, pv(`${f(vb)} m/s`)] },
          };
        }
        if (k === 2) {
          const [r1, w1, r2] = r.de([[10, 60, 30], [5, 40, 20], [8, 30, 24], [12, 20, 4], [15, 10, 5], [6, 50, 15], [20, 12, 8]]), w2 = w1 * r1 / r2;
          return {
            pregunta: [`Una faja une una polea de ${r1} cm de radio, que gira con `, pv(`${w1} rad/s`), `, con otra de ${r2} cm. ¿Con qué velocidad angular gira la segunda?`],
            datos: [D3.v, D3.faja],
            dibujo: figPoleas([{ tipo: 'polea', c: [86, 100], R: 14 + 2 * r1 }, { tipo: 'polea', c: [226, 100], R: 14 + 2 * r2 }], { alto: 210,
              textos: [{ x: 8, y: 20, texto: `${r1} cm` }, { x: 8, y: 204, texto: `${w1} rad/s`, color: 'o' }, { x: 312, y: 20, texto: `${r2} cm`, ancla: 'end' }, { x: 312, y: 204, texto: 'ω₂ = ?', ancla: 'end' }] }),
            opciones: opciones(w2, [
              { id: 'igual', valor: w1, error: 'MC-TR-W', siFuera: 'Dos ruedas en un mismo eje sí giran igual. Con una faja, lo que se iguala es la rapidez de los bordes, y la polea de otro radio gira con otra ω.' },
              { id: 'inv', valor: w1 * r2 / r1, error: 'MC-TR-INV', siFuera: 'La proporción con los radios está bien, pero al revés. Para que su borde vaya igual de rápido, la polea chica tiene que girar más rápido, no más lento.' },
              { id: 'cuad', valor: w1 * (r1 / r2) ** 2, error: 'PR-CUADRADO', siFuera: 'La razón de los radios está bien, pero va una sola vez. ω · r es igual en las dos poleas, y ahí el radio no está al cuadrado.' },
            ], n => `${f(n)} rad/s`),
            solucion: { texto: 'La faja no resbala, así que los dos bordes van igual de rápido: ω por r es igual en las dos poleas.', ecuacion: [pv(`${w1}`), ` · ${r1} = `, sub(Mw, '2'), ` · ${r2}   →   `, sub(Mw, '2'), ' = ', pv(`${f(w2)} rad/s`)] },
          };
        }
        // Nivel examen: tres ruedas; A mueve a B con una faja, y C está en el eje de B.
        const [ra, wa, rbb, rc] = r.de([[5, 40, 20, 10], [4, 30, 12, 6], [6, 20, 24, 12], [5, 60, 15, 6], [10, 12, 30, 15], [3, 50, 15, 9]]), wb = wa * ra / rbb, vc = wb * rc / 100;
        return {
          pregunta: [`La polea A, de ${ra} cm de radio, gira con `, pv(`${wa} rad/s`), ` y con una faja mueve a B, de ${rbb} cm. En el eje de B va C, de ${rc} cm. ¿Qué rapidez tiene el borde de C?`],
          datos: [D3.v, D3.faja, D3.eje, D3.cm],
          dibujo: figPoleas([{ tipo: 'polea', c: [70, 96], R: 14 + 2 * ra }, { tipo: 'polea', c: [216, 96], R: 14 + 2 * rbb }, { tipo: 'disco', c: [216, 96], R: 10 + 2 * rc }], { alto: 206,
            textos: [{ x: 8, y: 20, texto: `A: ${ra} cm` }, { x: 8, y: 200, texto: `${wa} rad/s`, color: 'o' }, { x: 312, y: 20, texto: `B: ${rbb} cm; C: ${rc} cm`, ancla: 'end' }] }),
          opciones: opciones(vc, [
            { id: 'faja', valor: wa * ra / 100, error: 'MC-TR-W', siFuera: 'Ese número es la rapidez de la faja, que es la del borde de B. C no toca la faja: gira con la ω de B, pero con su propio radio.' },
            { id: 'w-a', valor: wa * rc / 100, error: 'MC-TR-W', siFuera: 'v = ω · r para C está bien, pero usaste la ω de A. C va en el eje de B, así que gira con la ω de B.' },
            { id: 'inv', valor: wa * rbb / ra * rc / 100, error: 'MC-TR-INV', siFuera: 'Los pasos están bien, pero la proporción va al revés. La faja iguala la rapidez de los bordes, así que la polea grande gira más lento que la chica.' },
          ], n => `${f(n)} m/s`),
          solucion: { texto: `La faja iguala los bordes de A y B, así que B gira con ${wa} · ${ra} ÷ ${rbb} = ${f(wb)} rad/s. C, en su eje, gira con esa ω.`, ecuacion: [sub(Mv, 'C'), ' = ', pv(f(wb)), ` · ${f(rc / 100)} = `, pv(`${f(vc)} m/s`)] },
        };
      },
    },
  };

  // ======================= B4: aceleración centrípeta (la moto que da vueltas al óvalo) =======================
  // Cambia: el instante · Permanece: la rapidez, 10 m/s, y el óvalo de 20 m de radio · Progresa: la flecha de la
  // velocidad, que gira con la moto · Se reserva: la aceleración hacia el centro (el juego no la dibuja; sale en Predice
  // y en Mira) · Debe verse: la rapidez no cambia, pero la flecha sí; ese cambio apunta al centro.
  // El óvalo (una pista circular, como el de una plaza): eje en (160; 124), 86 px = 20 m. La moto parte del sur y gira
  // contra las agujas del reloj: ω = 10/20 = 0,5 rad/s, una vuelta en 4π s.
  const V_B4 = 10, R_B4 = 20, T_B4 = 2 * PI * R_B4 / V_B4;
  const OVALO = { tipo: 'pista', c: [160, 124], R: 86 };
  const RUMBOS = [{ x: 160, y: 22, texto: 'N', ancla: 'middle' }, { x: 312, y: 129, texto: 'E', ancla: 'end' }, { x: 160, y: 240, texto: 'S', ancla: 'middle' }, { x: 8, y: 129, texto: 'O' }];
  const angB4 = t => 270 + 360 * t / T_B4;
  const NOMBRE_RUMBO = ['este', 'noreste', 'norte', 'noroeste', 'oeste', 'suroeste', 'sur', 'sureste'];
  const rumboDe = a => NOMBRE_RUMBO[((Math.round((((a + 90) % 360) + 360) % 360 / 45)) % 8)];
  function ovalo(o = {}) {
    return { alto: 248, cuerpos: [OVALO], textos: [...RUMBOS, ...(o.textos || [])], puntos: o.puntos || [], flechas: o.flechas || [],
      radios: o.radios || [{ ang: 180, texto: 'r = 20 m', lado: 1, discontinuo: true }], alt: o.alt };
  }
  const motoB4 = (a, o = {}) => ovalo(Object.assign({ puntos: [{ ang: a, tipo: 'moto' }], flechas: [{ ang: a, largo: 50, texto: 'v⃗' }],
    alt: `Una moto da vueltas a un óvalo de 20 m de radio, siempre a 10 m/s; su velocidad apunta hacia el ${rumboDe(a)}.` }, o));
  const juegoB4 = val => giroF(motoB4(angB4(val.t)));
  const PRED_B4 = motoB4(300);
  const REV_B4 = motoB4(300, { flechas: [{ ang: 300, largo: 50, texto: 'v⃗' }, { ang: 300, dir: 'centro', largo: 40, color: 'h', texto: 'a⃗_c' }] });
  const C4 = OVALO.c;
  const MIRA_B4 = Object.assign(ovalo(), { alt: 'La moto en dos instantes: un cuarto de vuelta después, su velocidad mide lo mismo y apunta al norte; el cambio apunta al centro.', cortes: [
    { puntos: [{ ang: 270, tipo: 'moto' }], flechas: [{ ang: 270, largo: 50, texto: 'v⃗_1' }] },
    { puntos: [{ ang: 270, tipo: 'moto', tenue: true }, { ang: 0, tipo: 'moto' }], flechas: [{ ang: 270, largo: 50, texto: 'v⃗_1' }, { ang: 0, largo: 50, texto: 'v⃗_2', lado: -1 }] },
    { puntos: [{ ang: 270, tipo: 'moto', tenue: true }, { ang: 0, tipo: 'moto', tenue: true }],
      flechas: [{ desde: C4, dir: [1, 0], largo: 50, texto: 'v⃗_1', discontinua: true }, { desde: C4, dir: [0, -1], largo: 50, texto: 'v⃗_2', discontinua: true }] },
    { puntos: [{ ang: 270, tipo: 'moto', tenue: true }, { ang: 0, tipo: 'moto', tenue: true }],
      flechas: [{ desde: C4, dir: [1, 0], largo: 50, texto: 'v⃗_1', discontinua: true }, { desde: C4, dir: [0, -1], largo: 50, texto: 'v⃗_2', discontinua: true },
        { desde: [C4[0] + 50, C4[1]], dir: [-1, -1], largo: 50 * Math.SQRT2, texto: 'Δv⃗', lado: -1, corre: 6 }] },
    { puntos: [{ ang: 315, tipo: 'moto' }], flechas: [{ ang: 315, largo: 50, texto: 'v⃗' }, { ang: 315, dir: 'centro', largo: 40, color: 'h', texto: 'a⃗_c' }] },
  ] });

  const D4 = {
    ac: [Mac, ' = ', { frac: [cuad(Mv), 'r'] }, ' = ', cuad(Mw), ' · r: la aceleración centrípeta'],
    w: [Mw, ' = ', { frac: ['2π', MT] }, ' y ', Mv, ' = ', Mw, ' · r, con ω la velocidad angular'],
    kmh: '1 km = 1000 m y 1 h = 3600 s',
    rpm: '1 rpm = 1 vuelta por minuto; 1 vuelta = 2π rad; 1 min = 60 s',
    pit: 'Dos flechas perpendiculares de largos p y q: su resta mide √(p² + q²)',
    vec: 'La posición es r⃗ = x · î + y · ĵ, con î y ĵ los vectores unitarios de los ejes',
    cm: '1 m = 100 cm',
  };
  // Ejemplos resueltos de B4. Cuentas rehechas aparte (cuentas-b.js: resta dos velocidades muy cercanas y divide entre el
  // tiempo, sin a = v²/r): 10²/25; 3²·2; 12²/6; √(8·2); √(4² + 4²); 36/3,6 y 10²/50; 60 rpm y (2π)²·0,25; 2π·5/10 y
  // π²/5; 6/2 y 6·2; 0,5²·4 y 0,5²·2; el V o F; 4·(20/10)²; 1200 rpm = 40π y (40π)²·0,25; 10 − (−10); (3; 4) y 5²/5;
  // y el valor de cada alternativa equivocada con el error que dice el resuelto.
  const EJEMPLOS_CENTRIPETA = [
    { nivel: 1, titulo: 'La moto en el óvalo',
      figura: giroF(motoB4(300, { flechas: [{ ang: 300, largo: 50, texto: '10 m/s' }], radios: [{ ang: 180, texto: 'r = 25 m', lado: 1, discontinuo: true }] })),
      enunciado: ['Una moto da vueltas a un óvalo de 25 m de radio, siempre a ', pv('10 m/s'), '. ¿Cuánto vale su aceleración centrípeta?'],
      datos: [D4.ac],
      solucion: [{ texto: 'La moto va siempre a la misma rapidez, así que su aceleración es solo la centrípeta: la rapidez al cuadrado, entre el radio.', ecuacion: [Mac, ' = ', { frac: [cuad(pv('10')), '25'] }, ' = ', pa('4 m/s²')] }],
      respuesta: [Mac, ' = ', pa('4 m/s²'), ', hacia el centro'] },
    { nivel: 1, titulo: 'Con la velocidad angular',
      figura: giroF({ alto: 200, cuerpos: [{ tipo: 'disco', c: [160, 98], R: 80 }], puntos: [{ ang: 40, tipo: 'punto' }], radios: [{ ang: 40, texto: 'r = 2 m', lado: -1 }], sentido: [{ f: 1.15, de: 60, a: 110 }],
        textos: [{ x: 8, y: 192, texto: 'ω = 3 rad/s', color: 'o' }], alt: 'Un disco que gira con 3 rad/s; un punto a 2 m del eje.' }),
      enunciado: ['Un punto de una plataforma que gira con ', pv('ω = 3 rad/s'), ' está a 2 m del eje. ¿Cuánto vale su aceleración centrípeta?'],
      datos: [D4.ac],
      solucion: [{ texto: 'Como dan ω y no v, se usa la otra forma: ω al cuadrado por la distancia al eje.', ecuacion: [Mac, ' = ', cuad(pv('3')), ' · 2 = ', pa('18 m/s²')] }],
      respuesta: [Mac, ' = ', pa('18 m/s²')] },
    { nivel: 1, titulo: 'El radio de la curva',
      figura: giroF(motoB4(300, { flechas: [{ ang: 300, largo: 50, texto: '12 m/s' }, { ang: 300, dir: 'centro', largo: 36, color: 'h', texto: '6 m/s²' }], radios: [{ ang: 180, texto: 'r = ?', lado: 1, discontinuo: true }] })),
      enunciado: ['Un auto da la vuelta a un óvalo a ', pv('12 m/s'), ' con una aceleración centrípeta de ', pa('6 m/s²'), '. ¿Qué radio tiene el óvalo?'],
      datos: [D4.ac],
      solucion: [{ texto: sx('De a_c = v²/r se despeja el radio: la rapidez al cuadrado, entre la aceleración.'), ecuacion: ['r = ', { frac: [cuad(pv('12')), pa('6')] }, ' = ', { frac: ['144', '6'] }, ' = 24 m'] }],
      respuesta: [neg('r = 24 m')] },
    { nivel: 1, titulo: 'La rapidez con la aceleración',
      figura: giroF(motoB4(300, { flechas: [{ ang: 300, largo: 40, texto: '?' }], radios: [{ ang: 180, texto: 'r = 2 m', lado: 1, discontinuo: true }], textos: [{ x: 312, y: 240, texto: 'a_c = 8 m/s²', color: 'h', ancla: 'end' }],
        alt: 'Un carrito de juguete en una pista circular de 2 m de radio.' })),
      enunciado: ['Un carrito de juguete recorre una pista circular de 2 m de radio con una aceleración centrípeta de ', pa('8 m/s²'), '. ¿Con qué rapidez va?'],
      datos: [D4.ac],
      solucion: [{ texto: sx('De a_c = v²/r sale v² = a_c · r, y la rapidez es la raíz de ese producto.'), ecuacion: [Mv, ' = ', { raiz: [pa('8'), ' · 2'] }, ' = ', { raiz: ['16'] }, ' = ', pv('4 m/s')] }],
      respuesta: ['Va a ', pv('4 m/s')] },
    { nivel: 1, titulo: 'Lo que cambia en un cuarto',
      figura: giroF(ovalo({ puntos: [{ ang: 270, tipo: 'moto' }, { ang: 0, tipo: 'moto' }], flechas: [{ ang: 270, largo: 40, texto: '4 m/s' }, { ang: 0, largo: 40, texto: '4 m/s', lado: -1 }], radios: [],
        alt: 'Una moto en dos instantes, un cuarto de vuelta aparte: va a 4 m/s hacia el este y después a 4 m/s hacia el norte.' })),
      enunciado: ['Una moto va a ', pv('4 m/s'), ' hacia el este y, un cuarto de vuelta después, a ', pv('4 m/s'), ' hacia el norte. ¿Cuánto mide el cambio de su velocidad, Δv⃗?'],
      datos: [D4.pit],
      solucion: [{ texto: 'Se llevan las dos flechas a un mismo punto, sin girarlas. Una apunta al este y la otra al norte, así que son perpendiculares y su resta se mide con Pitágoras:', ecuacion: ['|Δv⃗| = ', { raiz: [cuad(pv('4')), ' + ', cuad(pv('4'))] }, ' = ', pv('4√2 m/s'), ' ≈ ', pv('5,66 m/s')] }],
      respuesta: ['Mide ', pv('4√2 m/s'), ', unos ', pv('5,66 m/s'), ': no es cero'] },
    { nivel: 2, titulo: 'El bus en la curva',
      figura: giroF(motoB4(300, { flechas: [{ ang: 300, largo: 50, texto: '36 km/h' }], radios: [{ ang: 180, texto: 'r = 50 m', lado: 1, discontinuo: true }], alt: 'Un bus toma una curva circular de 50 m de radio a 36 km/h.' })),
      enunciado: ['Un bus toma una curva circular de 50 m de radio a ', pv('36 km/h'), ', sin frenar ni acelerar. ¿Cuánto vale su aceleración centrípeta?'],
      datos: [D4.ac, D4.kmh],
      solucion: [
        { texto: 'El radio está en metros, así que primero se pasa la rapidez a m/s:', ecuacion: [pv('36 km/h'), ' = ', { frac: ['36 000 m', '3600 s'] }, ' = ', pv('10 m/s')] },
        { texto: 'Con todo en metros y segundos, la aceleración es v² entre r:', ecuacion: [Mac, ' = ', { frac: [cuad(pv('10')), '50'] }, ' = ', pa('2 m/s²')] },
      ],
      respuesta: [Mac, ' = ', pa('2 m/s²')] },
    { nivel: 2, titulo: 'El tambor de la lavadora',
      figura: giroF({ alto: 200, cuerpos: [{ tipo: 'disco', c: [160, 98], R: 80 }], puntos: [{ ang: 40, tipo: 'punto' }], radios: [{ ang: 150, texto: 'r = 0,25 m', lado: 1 }], sentido: [{ f: 1.15, de: 60, a: 110 }],
        textos: [{ x: 8, y: 192, texto: '60 rpm', color: 'o' }], alt: 'El tambor de una lavadora, de 0,25 m de radio, que gira a 60 vueltas por minuto.' }),
      enunciado: ['El tambor de una lavadora, de 0,25 m de radio, gira a ', pv('60 rpm'), '. ¿Cuánto vale la aceleración centrípeta de una media pegada a su pared?'],
      datos: [D4.ac, D4.rpm],
      solucion: [
        { texto: '60 vueltas en 60 s son una vuelta por segundo, es decir, 2π rad en cada segundo.', ecuacion: [Mw, ' = ', pv('2π rad/s')] },
        { texto: 'Con ω y el radio, la aceleración es ω² por r:', ecuacion: [Mac, ' = ', cuad(pv('2π')), ' · 0,25 = ', pa('π² m/s²'), ' ≈ ', pa('9,87 m/s²')] },
      ],
      respuesta: [Mac, ' = ', pa('π² m/s²'), ', unos ', pa('9,87 m/s²')] },
    { nivel: 2, titulo: 'Con el período',
      figura: figCarrusel({ caballos: [{ f: 1, ang: 40, texto: 'caballo' }], radios: [{ ang: 40, texto: 'r = 5 m', lado: -1 }], textos: [{ x: 8, y: 236, texto: 'T = 10 s', color: 'i' }] }),
      enunciado: ['Un carrusel de 5 m de radio da una vuelta cada ', pt('10 s'), '. ¿Cuánto vale la aceleración centrípeta de un caballo del borde?'],
      datos: [D4.ac, D4.w],
      solucion: [
        { texto: 'Primero la rapidez del caballo: recorre una vuelta, 2π · 5 m, en 10 s.', ecuacion: [Mv, ' = ', { frac: ['2π · 5', pt('10')] }, ' = ', pv('π m/s')] },
        { texto: 'Después, la aceleración: v² entre el radio del carrusel.', ecuacion: [Mac, ' = ', { frac: [cuad(pv('π')), '5'] }, ' ≈ ', pa('1,97 m/s²')] },
      ],
      respuesta: [Mac, ' = ', pa('π²/5 m/s²'), ', unos ', pa('1,97 m/s²')] },
    { nivel: 2, titulo: 'Con v y con ω',
      figura: giroF({ alto: 200, cuerpos: [{ tipo: 'disco', c: [160, 98], R: 80 }], puntos: [{ ang: 40, tipo: 'punto' }], flechas: [{ ang: 40, largo: 44, texto: '6 m/s' }], sentido: [{ f: 1.15, de: 60, a: 110 }],
        textos: [{ x: 8, y: 192, texto: 'ω = 2 rad/s', color: 'o' }], alt: 'Un punto de una rueda que gira con 2 rad/s y va a 6 m/s.' }),
      enunciado: ['Un punto de una rueda va a ', pv('6 m/s'), ' y la rueda gira con ', pv('ω = 2 rad/s'), '. ¿Cuánto vale su aceleración centrípeta?'],
      datos: [D4.ac, D4.w],
      solucion: [
        { texto: 'Falta el radio, pero sale de v = ω · r: la rapidez entre ω.', ecuacion: ['r = ', { frac: [pv('6'), pv('2')] }, ' = 3 m'] },
        { texto: 'Con el radio, la aceleración es v² entre r:', ecuacion: [Mac, ' = ', { frac: [cuad(pv('6')), '3'] }, ' = ', pa('12 m/s²')] },
      ],
      respuesta: [Mac, ' = ', pa('12 m/s²')] },
    { nivel: 2, titulo: 'Dos caballos, dos aceleraciones',
      figura: figCarrusel({ caballos: [{ f: 1, ang: 30, texto: 'Ana' }, { f: 0.5, ang: 210, texto: 'Beto', lado: -1 }], radios: [{ ang: 30, texto: '4 m', lado: -1 }, { ang: 210, f: 0.5, texto: '2 m', lado: 1 }],
        textos: [{ x: 8, y: 236, texto: 'ω = 0,5 rad/s', color: 'o' }] }),
      enunciado: ['El carrusel gira con ', pv('ω = 0,5 rad/s'), '. Ana va a 4 m del eje y Beto, a 2 m. ¿Cuánto vale la aceleración centrípeta de cada uno?'],
      datos: [D4.ac],
      solucion: [
        { texto: 'Los dos giran con la misma ω, así que se usa ω² por la distancia al eje. Ana, a 4 m:', ecuacion: [sub(Ma, 'Ana'), ' = ', cuad(pv('0,5')), ' · 4 = ', pa('1 m/s²')] },
        { texto: 'Beto va a la mitad del radio, así que su aceleración es la mitad:', ecuacion: [sub(Ma, 'Beto'), ' = ', cuad(pv('0,5')), ' · 2 = ', pa('0,5 m/s²')] },
      ],
      respuesta: ['Ana: ', pa('1 m/s²'), '; Beto: ', pa('0,5 m/s²')] },
    { nivel: 3, titulo: '¿Verdadero o falso?',
      figura: giroF(motoB4(300)),
      enunciado: ['Una moto da vueltas a un óvalo con rapidez constante. Indica si es verdadero (V) o falso (F): I. Su velocidad es constante. II. Su velocidad es tangente a su camino. III. Su aceleración es cero.'],
      alternativas: ['VVF', 'FVF', 'FFF', 'VVV', 'FVV'],
      fuente: 'Parecida a la de San Marcos 2020-I (pregunta 102)',
      datos: ['Rapidez constante: el velocímetro marca siempre lo mismo'],
      solucion: [
        { texto: 'I es falsa: la rapidez no cambia, pero la dirección sí, y la velocidad es la flecha entera, con largo y dirección. II es verdadera: en cada instante, la flecha va a lo largo del camino.' },
        { texto: 'III es falsa: la aceleración mide cualquier cambio de la velocidad, también el de dirección. Como la flecha gira, hay aceleración, y apunta hacia el centro.' },
        { texto: ['La ', neg('A'), ' y la ', neg('D'), ' toman la rapidez por la velocidad y dan I por verdadera. La ', neg('C'), ' niega que la flecha sea tangente. La ', neg('E'), ' cree que, si la rapidez no cambia, no hay aceleración.'] },
      ],
      respuesta: [neg('B'), ', FVF'] },
    { nivel: 3, titulo: 'Al doble de rapidez',
      figura: giroF(motoB4(300, { flechas: [{ ang: 300, largo: 50, texto: '10 m/s' }], textos: [{ x: 312, y: 240, texto: 'a_c = 4 m/s²', color: 'h', ancla: 'end' }] })),
      enunciado: ['A ', pv('10 m/s'), ', una moto en el óvalo tiene una aceleración centrípeta de ', pa('4 m/s²'), '. Si da vueltas al mismo óvalo a ', pv('20 m/s'), ', ¿cuánto vale su aceleración centrípeta?'],
      alternativas: ['8 m/s²', '4 m/s²', '16 m/s²', '2 m/s²', '32 m/s²'],
      datos: [D4.ac],
      solucion: [
        { texto: sx('Con el mismo radio, a_c crece con el cuadrado de la rapidez: el doble de rapidez da 2² = 4 veces más.'), ecuacion: [{ frac: [sub(Ma, '2'), sub(Ma, '1')] }, ' = ', cuad({ par: [{ frac: [pv('20'), pv('10')] }] }), ' = 4'] },
        { texto: 'Entonces la nueva aceleración es cuatro veces la de antes:', ecuacion: [sub(Ma, '2'), ' = 4 · ', pa('4'), ' = ', pa('16 m/s²')] },
        { texto: ['La ', neg('A'), ' la hace crecer como la rapidez, pero la rapidez va al cuadrado. La ', neg('B'), ' cree que no cambia porque el óvalo es el mismo. La ', neg('D'), ' la hace bajar, cuando ir más rápido acelera más. La ', neg('E'), ' multiplica por 8, que sería 2³.'] },
      ],
      respuesta: [neg('C'), ', ', pa('16 m/s²')] },
    { nivel: 3, titulo: 'La centrifugadora',
      figura: giroF({ alto: 200, cuerpos: [{ tipo: 'disco', c: [160, 98], R: 80 }], puntos: [{ ang: 40, tipo: 'punto' }], radios: [{ ang: 150, texto: 'r = 25 cm', lado: 1 }], sentido: [{ f: 1.15, de: 60, a: 110 }],
        textos: [{ x: 8, y: 192, texto: '1200 rpm', color: 'o' }], alt: 'El tambor de una centrifugadora, de 25 cm de radio, que gira a 1200 vueltas por minuto.' }),
      enunciado: ['El tambor de una centrifugadora, de 25 cm de radio, gira a ', pv('1200 rpm'), '. ¿Cuánto vale la aceleración centrípeta de su pared?'],
      alternativas: ['400π² m/s²', '360 000 m/s²', '10π m/s²', '40 000π² m/s²', '800π² m/s²'],
      datos: [D4.ac, D4.rpm, D4.cm],
      solucion: [
        { texto: '1200 vueltas en 60 s son 20 vueltas por segundo, y cada una son 2π rad:', ecuacion: [Mw, ' = 20 · 2π = ', pv('40π rad/s')] },
        { texto: 'Con el radio en metros, 0,25 m, la aceleración es ω² por r:', ecuacion: [Mac, ' = ', cuad(pv('40π')), ' · 0,25 = ', pa('400π² m/s²'), ' ≈ ', pa('3948 m/s²')] },
        { texto: ['La ', neg('B'), ' usa las rpm como si fueran rad/s. La ', neg('C'), ' da ω · r, que es la rapidez de la pared, no su aceleración. La ', neg('D'), ' deja los 25 cm sin pasar a metros. La ', neg('E'), ' usa el diámetro en vez del radio.'] },
      ],
      respuesta: [neg('A'), ', ', pa('400π² m/s²'), ', unos ', pa('3948 m/s²')] },
    { nivel: 3, titulo: 'En media vuelta',
      figura: giroF(ovalo({ puntos: [{ ang: 270, tipo: 'moto' }, { ang: 90, tipo: 'moto' }], flechas: [{ ang: 270, largo: 44, texto: '10 m/s' }, { ang: 90, largo: 44, texto: '10 m/s', lado: -1 }],
        alt: 'Una moto en un óvalo de 20 m de radio, en dos instantes, media vuelta aparte: va a 10 m/s hacia el este y después a 10 m/s hacia el oeste.' })),
      enunciado: ['Una moto va a ', pv('10 m/s'), ' en un óvalo de 20 m de radio. Pasa por el sur hacia el este y, media vuelta después, por el norte hacia el oeste. ¿Cuánto mide el cambio de su velocidad, Δv⃗?'],
      alternativas: ['0 m/s', '10 m/s', '14,14 m/s', '5 m/s', '20 m/s'],
      datos: ['El cambio de velocidad es Δv⃗ = v⃗₂ − v⃗₁ (la resta de las dos flechas)'],
      solucion: [
        { texto: 'Las dos flechas miden 10 m/s y apuntan en sentidos contrarios. Restar una flecha hacia el este es lo mismo que sumar una igual hacia el oeste, así que los largos se suman:', ecuacion: ['|Δv⃗| = ', pv('10'), ' + ', pv('10'), ' = ', pv('20 m/s')] },
        { texto: ['La ', neg('A'), ' resta las rapideces, pero lo que se resta son las flechas. La ', neg('B'), ' toma una sola flecha. La ', neg('C'), ' usa Pitágoras, que vale para un cuarto de vuelta, no para media. La ', neg('D'), ' da v²/r, que es la aceleración centrípeta, no el cambio de velocidad.'] },
      ],
      respuesta: [neg('E'), ', ', pv('20 m/s'), ', hacia el oeste'] },
    { nivel: 3, titulo: 'La aceleración con î y ĵ',
      figura: giroF({ alto: 248, cuerpos: [OVALO], radios: [{ ang: deg(Math.atan2(4, 3)), texto: '(3; 4) m', lado: -1 }], puntos: [{ ang: deg(Math.atan2(4, 3)), tipo: 'punto' }],
        flechas: [{ ang: deg(Math.atan2(4, 3)), largo: 46, texto: '5 m/s' }], textos: RUMBOS, alt: 'Una partícula en una circunferencia de centro en el origen, en el punto (3; 4) m, con rapidez de 5 m/s.' }),
      enunciado: ['Una partícula gira con rapidez constante de ', pv('5 m/s'), ' en una circunferencia con centro en el origen. ¿Cuál es su aceleración cuando pasa por el punto (3; 4) m?'],
      alternativas: ['3î + 4ĵ m/s²', '−0,6î − 0,8ĵ m/s²', '−4î + 3ĵ m/s²', '−3î − 4ĵ m/s²', '−15î − 20ĵ m/s²'],
      datos: [D4.ac, D4.vec, D4.pit],
      solucion: [
        { texto: sx('El radio es la distancia del punto al origen, y con él se calcula cuánto mide a_c:'), ecuacion: ['r = ', { raiz: [cuad('3'), ' + ', cuad('4')] }, ' = 5 m;   ', Mac, ' = ', { frac: [cuad(pv('5')), '5'] }, ' = ', pa('5 m/s²')] },
        { texto: 'La aceleración apunta del punto al centro, es decir, contra r⃗. Dividir r⃗ entre su largo, 5 m, da su dirección, y el signo menos la da vuelta:', ecuacion: [aVec, ' = −', pa('5'), ' · ', { frac: ['3î + 4ĵ', '5'] }, ' = ', pa('−3î − 4ĵ m/s²')] },
        { texto: ['La ', neg('A'), ' apunta hacia afuera, en el sentido de r⃗. La ', neg('B'), ' da solo la dirección, con largo 1, y no 5 m/s². La ', neg('C'), ' va tangente, como la velocidad. La ', neg('E'), ' usa v² sin dividir entre el radio.'] },
      ],
      respuesta: [neg('D'), ', ', pa('−3î − 4ĵ m/s²')] },
  ];

  const centripeta = {
    id: 'rapidez-constante-acelera',
    titulo: 'Aceleración centrípeta',
    pregunta: 'Si una moto da vueltas siempre con la misma rapidez, ¿tiene aceleración?',
    temas: ['MCU', 'Aceleración tangencial y centrípeta'],
    pieza: 'fis-giro',
    aprendizaje: 'En el MCU la rapidez no cambia, pero la velocidad sí, porque gira: hay una aceleración hacia el centro, de v²/r = ω²·r.',
    actividad: 'Dar vueltas al óvalo en moto y mirar la flecha de la velocidad.',
    lee: {
      tarjetas: [
        { titulo: 'La moto en el óvalo', texto: ['Una moto da vueltas al óvalo, siempre a 10 m/s: la aguja de su velocímetro no se mueve, así que es un MCU. La flecha del dibujo es su velocidad, ', vVec, ', y apunta hacia donde va la moto en ese instante.'],
          dibujo: juegoB4({ t: 0 }) },
        { titulo: 'La velocidad es una flecha', texto: ['En una recta, la velocidad era un número con signo, porque solo podía ir hacia adelante o hacia atrás. En una curva, la dirección cambia, así que hace falta la flecha entera: su largo es la rapidez ', Mv, ', y además tiene una dirección. Por eso aquí se escribe ', vVec, '.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Avanza el reloj de a un octavo de vuelta. En cada paso, mira si cambia el largo de la flecha, hacia dónde apunta, o las dos cosas.' },
      ],
    },
    ejemplos: EJEMPLOS_CENTRIPETA,
    juega: {
      pieza: 'fis-giro',
      consigna: 'La moto da vueltas al óvalo, siempre a 10 m/s. Pasa por el sur yendo hacia el este; tú avanzas el reloj.',
      mision: {
        texto: 'Detén el reloj cuando la velocidad de la moto apunte justo hacia el norte.',
        logrado: val => rumboDe(angB4(val.t)) === 'norte',
        bien: 'Sigue a 10 m/s: misma rapidez, pero la flecha giró un cuarto de vuelta.',
      },
      voz: 'Mira la flecha: ¿cambia su largo, su dirección o las dos cosas?',
      leyenda: [
        { s: [vVec], t: 'la velocidad de la moto' },
        { s: [Mt], t: 'segundos desde que pasó por el sur' },
        { s: 'r', t: 'radio del óvalo: 20 m' },
        { s: 'N, E, S, O', t: 'norte, este, sur y oeste' },
      ],
      controles: [{ id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: T_B4, paso: T_B4 / 8, inicio: 0, unidad: 's', decimales: 2 }],
      dibujo: juegoB4,
      lectura: val => ['Va a ', pv('10 m/s'), ` hacia el ${rumboDe(angB4(val.t))}`],
      resumen: { t: T_B4 / 8 },
      minimo: 3,
    },
    // La pregunta de antes, con los mismos ids de opción (una predicción guardada sigue valiendo); ahora el juego ya no
    // dibuja la aceleración.
    predice: {
      pregunta: 'La moto da vueltas al óvalo, siempre a 10 m/s. ¿Tiene aceleración?',
      datos: ['Su velocímetro marca siempre lo mismo: 10 m/s.'],
      opciones: [
        { id: 'c', texto: 'Sí, hacia el centro del óvalo', correcta: true },
        { id: 'cero', texto: 'No: su rapidez no cambia', error: 'MC-A0', siFuera: 'Su rapidez no cambia, es cierto. Pero la velocidad es una flecha, y su dirección gira todo el tiempo. Cambiar la dirección también es cambiar la velocidad, y todo cambio de velocidad es una aceleración.' },
        { id: 'afuera', texto: 'Sí, hacia afuera del óvalo', error: 'D9', siFuera: 'Quien va en la moto se siente empujado hacia afuera, pero eso es su cuerpo, que tiende a seguir en línea recta. La aceleración de la moto es lo que la saca de esa recta, y apunta al otro lado.' },
        { id: 'adelante', texto: 'Sí, hacia adelante, como su velocidad', error: 'K3', siFuera: 'Una aceleración que apunta como la velocidad hace ir cada vez más rápido, como al acelerar en una recta. Aquí la rapidez no cambia, así que la aceleración no puede apuntar hacia adelante.' },
      ],
      dibujo: giroF(PRED_B4),
      revelar: giroF(REV_B4),
      coincide: 'Coincide: la velocidad cambia de dirección todo el tiempo, y ese cambio apunta al centro.',
    },
    mira: {
      pieza: 'fis-giro',
      datos: MIRA_B4,
      pasos: [
        { estado: { corte: 0 }, texto: 'La moto pasa por el sur yendo hacia el este, a 10 m/s.', ecuacion: [sub(vVec, '1'), ': ', pv('10 m/s'), ' hacia el este'] },
        { estado: { corte: 1 }, texto: 'Un cuarto de vuelta después sigue a 10 m/s, pero ahora va hacia el norte: la flecha tiene el mismo largo y otra dirección.', ecuacion: [sub(vVec, '2'), ': ', pv('10 m/s'), ' hacia el norte'] },
        { estado: { corte: 2 }, texto: 'Para compararlas, se llevan las dos flechas a un mismo punto, sin girarlas ni cambiarles el largo.' },
        { estado: { corte: 3 }, texto: 'La flecha que va de una punta a la otra es el cambio de velocidad. No es cero, aunque la rapidez sea la misma.', ecuacion: [{ vec: ['Δ', Mv] }, ' = ', sub(vVec, '2'), ' − ', sub(vVec, '1')] },
        { estado: { corte: 4 }, texto: 'Entre los dos instantes, ese cambio apunta al centro del óvalo. Es la aceleración centrípeta, que quiere decir «que va hacia el centro».', ecuacion: [Mac, ' = ', { frac: [cuad(Mv), 'r'] }, ' = ', { frac: [cuad(pv('10')), '20'] }, ' = ', pa('5 m/s²')] },
      ],
    },
    regla: {
      texto: 'En el MCU la rapidez no cambia, pero la dirección de la velocidad sí, porque la flecha gira con el movimiento. Ese cambio es una aceleración centrípeta, que apunta siempre al centro del giro. Es mayor si se va más rápido o si la curva es más cerrada: en la misma curva, el doble de rapidez da cuatro veces más.',
      ecuacion: [{ llave: [Mac], nota: 'hacia el centro', color: 'c-h' }, ' = ', { frac: [cuad(Mv), 'r'] }, ' = ', cuad(Mw), ' · r'],
      condicion: 'la rapidez es constante y v⃗ va tangente al círculo; si la rapidez cambia, hay además otra aceleración. Con ω, la velocidad angular, se usa v = ω · r y sale ω² · r, en m/s².',
    },
    // Así se resuelve: la rapidez con a_c y r, y a_c con el período; «Ahora tú» va con v, con ω, con km/h y con razones.
    resuelve: {
      pieza: 'fis-giro',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 0) {
          const [acc, ra] = r.de([[5, 45], [4, 25], [2, 50], [8, 18], [3, 27], [6, 24], [2, 32]]), vv = Math.sqrt(acc * ra);
          return {
            enunciado: ['Una moto da vueltas a un óvalo de ', `${ra} m de radio con una aceleración centrípeta de `, pa(`${acc} m/s²`), '. ¿Con qué rapidez va?'],
            datos: [D4.ac],
            dibujo: giroF(motoB4(300, { flechas: [{ ang: 300, largo: 44, texto: '?' }, { ang: 300, dir: 'centro', largo: 36, color: 'h', texto: `${acc} m/s²` }], radios: [{ ang: 180, texto: `r = ${ra} m`, lado: 1, discontinuo: true }] })),
            pasos: [
              { tipo: 'pide', texto: ['Piden la rapidez ', Mv, ' de la moto.'] },
              { tipo: 'datos', texto: ['La moto gira en un óvalo de ', `${ra} m de radio con `, Mac, ' = ', pa(`${acc} m/s²`), '.'] },
              { tipo: 'regla', texto: 'La aceleración centrípeta es la rapidez al cuadrado entre el radio; de ahí se puede despejar la rapidez.', ecuacion: [Mac, ' = ', { frac: [cuad(Mv), 'r'] }] },
              { tipo: 'cuentas', texto: 'Paso el radio al otro lado para tener v², y saco la raíz para quedarme con v.', ecuacion: [cuad(Mv), ' = ', pa(`${acc}`), ` · ${ra} = ${acc * ra}   →   `, Mv, ' = ', pv(`${f(vv)} m/s`)] },
              { tipo: 'sentido', texto: `Compruebo: ${f(vv)}² ÷ ${ra} da ${acc} m/s², la aceleración del enunciado, así que la rapidez está bien.` },
            ],
            respuesta: ['Va a ', pv(`${f(vv)} m/s`)],
          };
        }
        const [T, ra] = r.de([[10, 5], [12, 4], [8, 2], [20, 10], [6, 3], [10, 2.5]]), kv = 2 * ra / T, acc = kv * kv * PI * PI / ra;
        return {
          enunciado: [`Un carrusel de ${f(ra)} m de radio da una vuelta cada `, pt(`${T} s`), '. ¿Cuánto vale la aceleración centrípeta de un caballo del borde?'],
          datos: [D4.ac, D4.w],
          dibujo: figCarrusel({ caballos: [{ f: 1, ang: 40, texto: 'caballo' }], radios: [{ ang: 40, texto: `r = ${f(ra)} m`, lado: -1 }], textos: [{ x: 8, y: 236, texto: `T = ${T} s`, color: 'i' }] }),
          pasos: [
            { tipo: 'pide', texto: ['Piden ', Mac, ' de un caballo del borde.'] },
            { tipo: 'datos', texto: ['El carrusel da una vuelta cada ', pt(`${T} s`), `, y el caballo va a ${f(ra)} m del eje.`] },
            { tipo: 'regla', texto: 'Dan el período y no la rapidez, así que conviene la forma con ω: con el período sale ω, y con ω y el radio, la aceleración.', ecuacion: [Mw, ' = ', { frac: ['2π', MT] }, ';   ', Mac, ' = ', cuad(Mw), ' · r'] },
            { tipo: 'cuentas', texto: 'Primero ω, una vuelta en un período; después ω² por el radio.', ecuacion: [Mw, ' = ', { frac: ['2π', pt(`${T}`)] }, ' = ', pv(`${enPi(2 / T)} rad/s`), '   →   ', Mac, ' = ', cuad({ par: [pv(enPi(2 / T))] }), ` · ${f(ra)} ≈ `, pa(`${f(acc)} m/s²`)] },
            { tipo: 'sentido', texto: 'Tiene sentido: un carrusel gira despacio, y una aceleración de menos de 2 m/s² es pequeña, menor que la de un auto que arranca.' },
          ],
          respuesta: [Mac, ' ≈ ', pa(`${f(acc)} m/s²`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-giro',
      generar(sm) {
        const r = azar(sm + 63), k = sm % 4;
        if (k === 0) {
          const [vv, ra] = r.de([[10, 25], [10, 50], [15, 45], [20, 40], [12, 36], [8, 16], [6, 12], [15, 25]]), acc = vv * vv / ra;
          return {
            pregunta: ['Una moto da vueltas a un óvalo de ', `${ra} m de radio, siempre a `, pv(`${vv} m/s`), '. ¿Cuánto vale su aceleración centrípeta?'],
            datos: [D4.ac],
            dibujo: giroF(motoB4(300, { flechas: [{ ang: 300, largo: 50, texto: `${vv} m/s` }], radios: [{ ang: 180, texto: `r = ${ra} m`, lado: 1, discontinuo: true }] })),
            opciones: opciones(acc, [
              { id: 'cero', valor: 0, error: 'MC-A0', siFuera: 'La rapidez no cambia, es cierto, pero la dirección de la velocidad gira todo el tiempo. Ese cambio de dirección es una aceleración, la centrípeta, y no vale cero.' },
              { id: 'v-r', valor: vv / ra, error: 'MC-VR', siFuera: 'Dividir entre el radio está bien, pero la rapidez va al cuadrado: v²/r. Con v sola, la aceleración no queda en m/s².' },
              { id: 'sin-cuad', valor: 2 * vv / ra, error: 'MC-VR', siFuera: 'La idea de v entre r está bien, pero v va al cuadrado, es decir, multiplicada por sí misma, no por 2.' },
              { id: 'por-r', valor: vv * vv * ra, error: 'MC-V2R', siFuera: 'La rapidez al cuadrado está bien, pero se divide entre r, no se multiplica. Una curva más cerrada, de radio menor, hace girar más rápido la flecha y acelera más.' },
            ], n => `${f(n)} m/s²`),
            solucion: { texto: 'La rapidez no cambia, así que la aceleración es la centrípeta: apunta al centro y vale v² entre r.', ecuacion: [Mac, ' = ', { frac: [cuad(pv(`${vv}`)), `${ra}`] }, ' = ', pa(`${f(acc)} m/s²`)] },
          };
        }
        if (k === 1) {
          const w = r.de([2, 3, 4, 5, 0.5]), ra = r.de([0.5, 1.5, 2, 3, 4]), acc = w * w * ra;   // sin r = 1: ω² · r y ω² ÷ r darían lo mismo
          return {
            pregunta: [`Un punto a ${f(ra)} m del eje gira con `, pv(`ω = ${f(w)} rad/s`), ' constante. ¿Cuánto vale su aceleración centrípeta?'],
            datos: [D4.ac],
            dibujo: giroF({ alto: 200, cuerpos: [{ tipo: 'disco', c: [160, 98], R: 80 }], puntos: [{ ang: 40, tipo: 'punto' }], radios: [{ ang: 40, texto: `r = ${f(ra)} m`, lado: -1 }], sentido: [{ f: 1.15, de: 60, a: 110 }],
              textos: [{ x: 8, y: 192, texto: `ω = ${f(w)} rad/s`, color: 'o' }], alt: `Un disco que gira con ${f(w)} rad/s; un punto a ${f(ra)} m del eje.` }),
            opciones: opciones(acc, [
              { id: 'w-r', valor: w * ra, error: 'MC-VR', siFuera: 'ω · r es la rapidez del punto, en m/s, no su aceleración. La aceleración centrípeta es ω² · r: falta multiplicar otra vez por ω.' },
              { id: 'w2-r', valor: w * w / ra, error: 'MC-V2R', siFuera: 'ω al cuadrado está bien, pero con ω el radio multiplica. Lo que va dividido entre r es v², en la otra forma de la fórmula.' },
              { id: 'cero', valor: 0, error: 'MC-A0', siFuera: 'Que ω sea constante no quita la aceleración. El punto gira, así que su velocidad cambia de dirección todo el tiempo, y eso es una aceleración hacia el centro.' },
              { id: 'w2', valor: w * w, error: 'AN-SIN-R', siFuera: 'ω al cuadrado está bien, pero falta multiplicar por la distancia al eje. Un punto más lejos del eje va más rápido y tiene más aceleración.' },
            ], n => `${f(n)} m/s²`),
            solucion: { texto: 'Como dan ω y no v, la aceleración centrípeta se calcula con ω² por la distancia al eje.', ecuacion: [Mac, ' = ', cuad(pv(f(w))), ` · ${f(ra)} = `, pa(`${f(acc)} m/s²`)] },
          };
        }
        if (k === 2) {
          const [kmh, ra] = r.de([[36, 50], [36, 25], [54, 75], [72, 100], [18, 25], [54, 45], [72, 80], [90, 125]]), vv = kmh / 3.6, acc = vv * vv / ra;
          return {
            pregunta: ['Un bus toma una curva circular de ', `${ra} m de radio a `, pv(`${kmh} km/h`), ', sin frenar ni acelerar. ¿Cuánto vale su aceleración centrípeta?'],
            datos: [D4.ac, D4.kmh],
            dibujo: giroF(motoB4(300, { flechas: [{ ang: 300, largo: 50, texto: `${kmh} km/h` }], radios: [{ ang: 180, texto: `r = ${ra} m`, lado: 1, discontinuo: true }], alt: `Un bus en una curva de ${ra} m de radio, a ${kmh} km/h.` })),
            opciones: opciones(acc, [
              { id: 'kmh', valor: kmh * kmh / ra, error: 'U1-kmh', siFuera: 'La fórmula está bien, pero la rapidez estaba en km/h y el radio en metros. Para que salga en m/s², pasa la rapidez a m/s antes de elevarla al cuadrado.' },
              { id: 'v-r', valor: vv / ra, error: 'MC-VR', siFuera: 'El paso a m/s está bien, pero la rapidez va al cuadrado en v²/r. Con v sola, el resultado no es una aceleración.' },
              { id: 'cero', valor: 0, error: 'MC-A0', siFuera: 'Sin frenar ni acelerar, la rapidez no cambia, pero el bus dobla: la dirección de su velocidad cambia, y ese cambio es una aceleración hacia el centro de la curva.' },
            ], n => `${f(n)} m/s²`),
            solucion: { texto: `Primero se pasan los ${kmh} km/h a m/s: son ${f(vv)} m/s. Después, la rapidez al cuadrado entre el radio.`, ecuacion: [Mac, ' = ', { frac: [cuad(pv(f(vv))), `${ra}`] }, ' = ', pa(`${f(acc)} m/s²`)] },
          };
        }
        // Nivel examen: razones. Cambia la rapidez en el mismo óvalo, o el radio con la misma rapidez.
        const a1 = r.de([2, 3, 4, 5, 6]);
        if (r() < 0.5) {
          const kx = r.de([2, 3]), a2 = a1 * kx * kx;
          return {
            pregunta: ['Una moto da vueltas al óvalo con una aceleración centrípeta de ', pa(`${a1} m/s²`), `. Si va al ${kx === 2 ? 'doble' : 'triple'} de rapidez en el mismo óvalo, ¿cuánto vale su aceleración centrípeta?`],
            datos: [D4.ac],
            dibujo: giroF(motoB4(300, { radios: [], textos: [{ x: 312, y: 240, texto: `a_c = ${a1} m/s²`, color: 'h', ancla: 'end' }] })),
            opciones: opciones(a2, [
              { id: 'pr1', valor: a1 * kx, error: 'PR1', siFuera: 'Es cierto que crece con la rapidez, pero la rapidez va al cuadrado en v²/r. Al multiplicar la rapidez, la aceleración se multiplica por ese número al cuadrado.' },
              { id: 'igual', valor: a1, error: 'MC-A0', siFuera: 'El óvalo es el mismo, es cierto, pero la aceleración centrípeta depende también de la rapidez. Más rápido, la flecha de la velocidad gira más rápido y hay más aceleración.' },
              { id: 'baja', valor: a1 / kx, error: 'PR-INV', siFuera: 'Es cierto que cambia con la rapidez, pero al revés. Ir más rápido en la misma curva da más aceleración, no menos.' },
            ], n => `${f(n)} m/s²`),
            solucion: { texto: sx(`Con el mismo radio, a_c crece con el cuadrado de la rapidez: ${kx}² = ${kx * kx} veces.`), ecuacion: [sub(Ma, '2'), ` = ${kx * kx} · `, pa(`${a1}`), ' = ', pa(`${f(a2)} m/s²`)] },
          };
        }
        const kx = r.de([2, 3]), a2 = a1 * kx;
        return {
          pregunta: ['Una moto da vueltas a un óvalo con una aceleración centrípeta de ', pa(`${a1} m/s²`), `. Con la misma rapidez, en otro óvalo de ${kx === 2 ? 'la mitad' : 'un tercio'} del radio, ¿cuánto vale su aceleración centrípeta?`],
          datos: [D4.ac],
          dibujo: giroF(motoB4(300, { radios: [], textos: [{ x: 312, y: 240, texto: `a_c = ${a1} m/s²`, color: 'h', ancla: 'end' }] })),
          opciones: opciones(a2, [
            { id: 'baja', valor: a1 / kx, error: 'PR-INV', siFuera: 'Es cierto que cambia con el radio, pero al revés. En un óvalo más chico la curva es más cerrada, la dirección cambia más rápido y la aceleración es mayor.' },
            { id: 'cuad', valor: a1 * kx * kx, error: 'PR-CUADRADO', siFuera: `Es cierto que crece, pero en v²/r el radio va una sola vez, sin elevar. Con ${kx === 2 ? 'la mitad' : 'un tercio'} del radio, la aceleración es ${kx === 2 ? 'el doble' : 'el triple'}, no ${kx === 2 ? 'cuatro' : 'nueve'} veces más.` },
            { id: 'igual', valor: a1, error: 'MC-A0', siFuera: 'La rapidez es la misma, es cierto, pero la aceleración centrípeta depende también del radio. En una curva más cerrada, la dirección cambia más rápido.' },
          ], n => `${f(n)} m/s²`),
          solucion: { texto: sx(`Con la misma rapidez, a_c es inversa al radio: si el radio se divide entre ${kx}, a_c se multiplica por ${kx}.`), ecuacion: [sub(Ma, '2'), ` = ${kx} · `, pa(`${a1}`), ' = ', pa(`${f(a2)} m/s²`)] },
        };
      },
    },
  };

  // ======================= B5: MCUV, el giro que acelera (el ventilador del aula) =======================
  // Cambia: con qué ω empieza y cuánto gana cada segundo · Permanece: el ventilador y los 4 s de la misión · Progresa: ω,
  // que sube parejo con el reloj · Se reserva: cuánto gira en total (el juego muestra ω, no el ángulo) · Debe verse:
  // α = Δω/Δt y las ecuaciones del MRUV con otras letras.
  const T_B5 = 4;
  function ventB5(w0, al, t) {
    const th = w0 * t + al * t * t / 2, w = w0 + al * t;
    return { alto: 228, cuerpos: [Object.assign({}, VENT, { giro: 20 + deg(th) })], sentido: [{ f: 1.1, de: 30, a: 80 }],
      reloj: { x: 26, y: 30, frac: t / 60, texto: `${f(t)} s` }, textos: [{ x: 312, y: 220, texto: `ω = ${f(w)} rad/s`, color: 'o', ancla: 'end' }],
      alt: `Ventilador de techo que se prende: a los ${f(t)} s gira con ${f(w)} rad/s.` };
  }
  const juegoB5 = val => giroF(ventB5(val.w0, val.alfa, val.t));
  // Predice y Mira: arranca del reposo y en el primer segundo gira 2 rad (α = 4 rad/s²).
  const PRED_B5 = ventB2({ reloj: { x: 26, y: 30, frac: 1 / 60, texto: '1 s' }, textos: [{ x: 312, y: 220, texto: 'primer segundo: θ = 2 rad', color: 'f', ancla: 'end' }],
    alt: 'Ventilador que arranca del reposo; en el primer segundo gira 2 rad.' });
  const corteB5 = t => ({ cuerpos: [Object.assign({}, VENT, { giro: 20 + deg(2 * t * t) })], reloj: { x: 26, y: 30, frac: t / 60, texto: `${t} s` },
    textos: [{ x: 312, y: 196, texto: `ω = ${4 * t} rad/s`, color: 'o', ancla: 'end' }, { x: 312, y: 220, texto: `θ = ${2 * t * t} rad`, color: 'f', ancla: 'end' }] });
  const MIRA_B5 = Object.assign(ventB2({ alt: 'Ventilador que arranca del reposo: a los 1, 2 y 3 s.' }), { cortes: [corteB5(1), corteB5(2), corteB5(3), corteB5(3)] });

  const D5 = {
    alfa: ['Aceleración angular: ', Mal, ' = ', { frac: [['Δ', Mw], ['Δ', Mt]] }],
    w: ['Con α constante: ', Mw, ' = ', Mw0, ' + ', Mal, ' · ', Mt],
    th: ['Con α constante: ', Mth, ' = ', Mw0, ' · ', Mt, ' + ½ · ', Mal, ' · ', Mt2],
    med: ['Con α constante: ', Mth, ' = ', { frac: [[Mw0, ' + ', Mw], '2'] }, ' · ', Mt],
    w2: ['Sin el tiempo: ', cuad(Mw), ' = ', cuad(Mw0), ' + 2 · ', Mal, ' · ', Mth],
    vuelta: '1 vuelta = 2π rad',
    rpm: '1 rpm = 1 vuelta por minuto; 1 vuelta = 2π rad; 1 min = 60 s',
    reposo: ['Desde el reposo, ', Mw0, ' = 0'],
  };
  // Ejemplos resueltos de B5. Cuentas rehechas aparte (cuentas-b.js: integra el giro paso a paso con α constante, sin
  // las ecuaciones): (12 − 4)/4; 3 + 2·5; ½·2·5²; (10 + 20)/2·4; 30/5; 600 rpm = 20π y 20π/10; ½·π·4² y 8π/2π;
  // −20/5 y ½·20·5; (30² − 10²)/(2·100); ½·2·(3² − 2²); (60 − 20)/8; 10 vueltas a 4π rad/s; ½·6·5²; ½·2·5² y 25·0,4;
  // 14 = ½·α·(4² − 3²); y el valor de cada alternativa equivocada con el error que dice el resuelto.
  const figV5 = (o = {}) => giroF(ventB2({ reloj: o.reloj, textos: o.textos || [], alt: o.alt }));
  const tx = (texto, color, y = 220) => ({ x: 312, y, texto, color, ancla: 'end' });
  const EJEMPLOS_MCUV = [
    { nivel: 1, titulo: 'La aceleración angular',
      figura: figV5({ reloj: { x: 26, y: 30, frac: 4 / 60, texto: '4 s' }, textos: [tx('de 4 a 12 rad/s', 'o')] }),
      enunciado: ['Un ventilador pasa de ', pv('4 rad/s'), ' a ', pv('12 rad/s'), ' en ', pt('4 s'), ', acelerando parejo. ¿Cuál es su aceleración angular?'],
      datos: [D5.alfa],
      solucion: [{ texto: 'α es lo que gana ω en cada segundo: el cambio de ω, de 4 a 12 rad/s, dividido entre los 4 s.', ecuacion: [Mal, ' = ', { frac: [[pv('12'), ' − ', pv('4')], pt('4')] }, ' = ', pa('2 rad/s²')] }],
      respuesta: [Mal, ' = ', pa('2 rad/s²')] },
    { nivel: 1, titulo: 'La ω a los 5 s',
      figura: figV5({ reloj: { x: 26, y: 30, frac: 5 / 60, texto: '5 s' }, textos: [tx('ω₀ = 3 rad/s', 'o', 196), tx('α = 2 rad/s²', 'h')] }),
      enunciado: ['Un esmeril gira con ', pv('3 rad/s'), ' y acelera parejo con ', pa('α = 2 rad/s²'), '. ¿Con qué ω gira a los ', pt('5 s'), '?'],
      datos: [D5.w],
      solucion: [{ texto: 'Ya giraba con 3 rad/s, y gana 2 rad/s en cada uno de los 5 s; lo ganado se suma a lo que tenía:', ecuacion: [Mw, ' = ', pv('3'), ' + ', pa('2'), ' · ', pt('5'), ' = ', pv('13 rad/s')] }],
      respuesta: [Mw, ' = ', pv('13 rad/s')] },
    { nivel: 1, titulo: 'El giro desde el reposo',
      figura: figV5({ reloj: { x: 26, y: 30, frac: 5 / 60, texto: '5 s' }, textos: [tx('α = 2 rad/s²', 'h')] }),
      enunciado: ['Un ventilador arranca del reposo con ', pa('α = 2 rad/s²'), '. ¿Qué ángulo gira en los primeros ', pt('5 s'), '?'],
      datos: [D5.th, D5.reposo],
      solucion: [{ texto: 'Arranca del reposo, así que ω₀ = 0 y el término ω₀ · t vale cero. Queda solo el término de α:', ecuacion: [Mth, ' = ½ · ', pa('2'), ' · ', cuad(pt('5')), ' = ', ps('25 rad')] }],
      respuesta: ['Gira ', ps('25 rad')] },
    { nivel: 1, titulo: 'Con la ω media',
      figura: figV5({ reloj: { x: 26, y: 30, frac: 4 / 60, texto: '4 s' }, textos: [tx('de 10 a 20 rad/s', 'o')] }),
      enunciado: ['Una polea pasa de ', pv('10 rad/s'), ' a ', pv('20 rad/s'), ' en ', pt('4 s'), ', acelerando parejo. ¿Qué ángulo gira en ese tiempo?'],
      datos: [D5.med],
      solucion: [{ texto: 'Con α constante, ω sube parejo, y el giro es el mismo que si fuera todo el tiempo a la ω media, 15 rad/s:', ecuacion: [Mth, ' = ', { frac: [[pv('10'), ' + ', pv('20')], '2'] }, ' · ', pt('4'), ' = ', ps('60 rad')] }],
      respuesta: ['Gira ', ps('60 rad')] },
    { nivel: 1, titulo: '¿Cuánto tarda en llegar?',
      figura: figV5({ textos: [tx('de 0 a 30 rad/s', 'o', 196), tx('α = 5 rad/s²', 'h')] }),
      enunciado: ['Un ventilador arranca del reposo con ', pa('α = 5 rad/s²'), '. ¿Cuánto tarda en llegar a ', pv('30 rad/s'), '?'],
      datos: [D5.w, D5.reposo],
      solucion: [{ texto: 'Gana 5 rad/s en cada segundo, así que para juntar 30 rad/s necesita 30 entre 5 segundos:', ecuacion: [Mt, ' = ', { frac: [pv('30'), pa('5')] }, ' = ', pt('6 s')] }],
      respuesta: ['Tarda ', pt('6 s')] },
    { nivel: 2, titulo: 'De rpm a rad/s²',
      figura: figV5({ reloj: { x: 26, y: 30, frac: 10 / 60, texto: '10 s' }, textos: [tx('de 0 a 600 rpm', 'o')] }),
      enunciado: ['Una licuadora arranca del reposo y llega a ', pv('600 rpm'), ' en ', pt('10 s'), ', acelerando parejo. ¿Cuál es su aceleración angular?'],
      datos: [D5.alfa, D5.rpm],
      solucion: [
        { texto: 'Primero la ω final en rad/s: 600 vueltas en 60 s son 10 vueltas por segundo, y cada una son 2π rad.', ecuacion: [Mw, ' = 10 · 2π = ', pv('20π rad/s')] },
        { texto: 'Arranca de cero, así que el cambio de ω es 20π rad/s, y α es ese cambio entre los 10 s:', ecuacion: [Mal, ' = ', { frac: [pv('20π'), pt('10')] }, ' = ', pa('2π rad/s²'), ' ≈ ', pa('6,28 rad/s²')] },
      ],
      respuesta: [Mal, ' = ', pa('2π rad/s²'), ', unos ', pa('6,28 rad/s²')] },
    { nivel: 2, titulo: 'Vueltas al arrancar',
      figura: figV5({ reloj: { x: 26, y: 30, frac: 4 / 60, texto: '4 s' }, textos: [tx('α = π rad/s²', 'h')] }),
      enunciado: ['Un ventilador arranca del reposo con ', pa('α = π rad/s²'), '. ¿Cuántas vueltas da en los primeros ', pt('4 s'), '?'],
      datos: [D5.th, D5.reposo, D5.vuelta],
      solucion: [
        { texto: 'Arranca del reposo, así que el ángulo girado es solo el término de α:', ecuacion: [Mth, ' = ½ · ', pa('π'), ' · ', cuad(pt('4')), ' = ', ps('8π rad')] },
        { texto: 'Cada vuelta son 2π rad, así que las vueltas son el ángulo entre 2π:', ecuacion: [MN, ' = ', { frac: [ps('8π'), '2π'] }, ' = ', ps('4 vueltas')] },
      ],
      respuesta: ['Da ', ps('4 vueltas')] },
    { nivel: 2, titulo: 'El ventilador que frena',
      figura: figV5({ reloj: { x: 26, y: 30, frac: 5 / 60, texto: '5 s' }, textos: [tx('de 20 rad/s a 0', 'o')] }),
      enunciado: ['Un ventilador gira con ', pv('20 rad/s'), '. Lo apagan y frena parejo hasta detenerse en ', pt('5 s'), '. ¿Cuál es su aceleración angular y cuánto gira hasta detenerse?'],
      datos: [D5.alfa, D5.med],
      solucion: [
        { texto: 'Pierde 20 rad/s en 5 s. α sale negativa porque ω baja:', ecuacion: [Mal, ' = ', { frac: [[pv('0'), ' − ', pv('20')], pt('5')] }, ' = ', pa('−4 rad/s²')] },
        { texto: 'Como frena parejo, gira lo mismo que si fuera todo el tiempo a la ω media, 10 rad/s:', ecuacion: [Mth, ' = ', { frac: [[pv('20'), ' + ', pv('0')], '2'] }, ' · ', pt('5'), ' = ', ps('50 rad')] },
      ],
      respuesta: [Mal, ' = ', pa('−4 rad/s²'), '; gira ', ps('50 rad')] },
    { nivel: 2, titulo: 'Sin el tiempo',
      figura: figV5({ textos: [tx('de 10 a 30 rad/s', 'o'), tx('θ = 100 rad', 'f', 196)] }),
      enunciado: ['Una rueda pasa de ', pv('10 rad/s'), ' a ', pv('30 rad/s'), ' mientras gira ', ps('100 rad'), ', acelerando parejo. ¿Cuál es su aceleración angular?'],
      datos: [D5.w2],
      solucion: [
        { texto: 'No dan el tiempo, así que sirve la ecuación de ω², que une ω con el ángulo girado:', ecuacion: [cuad(pv('30')), ' = ', cuad(pv('10')), ' + 2 · ', Mal, ' · ', ps('100')] },
        { texto: 'Se pasa 10² al otro lado y se divide entre 2 · 100:', ecuacion: [Mal, ' = ', { frac: ['900 − 100', '200'] }, ' = ', pa('4 rad/s²')] },
      ],
      respuesta: [Mal, ' = ', pa('4 rad/s²')] },
    { nivel: 2, titulo: 'Lo que gira el tercer segundo',
      figura: figV5({ reloj: { x: 26, y: 30, frac: 3 / 60, texto: 'de 2 s a 3 s' }, textos: [tx('α = 2 rad/s²', 'h')] }),
      enunciado: ['Un ventilador arranca del reposo con ', pa('α = 2 rad/s²'), '. ¿Qué ángulo gira solo durante el tercer segundo?'],
      datos: [D5.th, D5.reposo, 'El tercer segundo va de t = 2 s a t = 3 s'],
      solucion: [
        { texto: 'La ecuación da lo girado desde que arrancó. Se calcula lo girado hasta los 3 s y hasta los 2 s:', ecuacion: [Mth, '(3) = ½ · ', pa('2'), ' · ', cuad(pt('3')), ' = ', ps('9 rad'), ';   ', Mth, '(2) = ', ps('4 rad')] },
        { texto: 'Lo del tercer segundo es lo que se agregó entre los 2 s y los 3 s, la diferencia:', ecuacion: [ps('9'), ' − ', ps('4'), ' = ', ps('5 rad')] },
      ],
      respuesta: ['Gira ', ps('5 rad')] },
    { nivel: 3, titulo: 'La ω que aumenta',
      figura: figV5({ reloj: { x: 26, y: 30, frac: 8 / 60, texto: '8 s' }, textos: [tx('de 20 a 60 rad/s', 'o')] }),
      enunciado: ['La velocidad angular de una rueda aumenta de manera uniforme de ', pv('20 rad/s'), ' a ', pv('60 rad/s'), ' en ', pt('8 s'), '. ¿Cuál es su aceleración angular?'],
      alternativas: ['7,5 rad/s²', '10 rad/s²', '5 rad/s²', '320 rad/s²', '2,5 rad/s²'],
      fuente: 'Parecida a la de San Marcos 2026-I (pregunta 82)',
      datos: [D5.alfa],
      solucion: [
        { texto: 'α mide cuánto gana ω en cada segundo, así que se divide el cambio de ω, no la ω final, entre el tiempo:', ecuacion: [Mal, ' = ', { frac: [[pv('60'), ' − ', pv('20')], pt('8')] }, ' = ', pa('5 rad/s²')] },
        { texto: ['La ', neg('A'), ' divide la ω final, como si empezara del reposo. La ', neg('B'), ' suma las dos ω, cuando lo que importa es cuánto cambió. La ', neg('D'), ' multiplica el cambio por el tiempo, en vez de dividir. La ', neg('E'), ' divide la ω inicial.'] },
      ],
      respuesta: [neg('C'), ', ', pa('5 rad/s²')] },
    { nivel: 3, titulo: 'El ventilador que se apaga',
      figura: figV5({ textos: [tx('4π rad/s', 'o', 196), tx('10 vueltas', 'f')] }),
      enunciado: ['Un ventilador gira con ', pv('4π rad/s'), '. Al apagarlo, frena parejo y da ', ps('10 vueltas'), ' hasta detenerse. ¿Cuánto tarda en detenerse?'],
      alternativas: ['10 s', '5 s', '1,59 s', '0,5 s', '572,96 s'],
      fuente: 'Parecida a la de San Marcos 2024-II (pregunta 82)',
      datos: [D5.med, D5.vuelta],
      solucion: [
        { texto: 'ω está en rad/s, así que primero se pasan las 10 vueltas a radianes:', ecuacion: [Mth, ' = ', ps('10'), ' · 2π = ', ps('20π rad')] },
        { texto: 'Frena parejo de 4π a 0, así que gira como si fuera todo el tiempo a la ω media, 2π rad/s.', ecuacion: [ps('20π'), ' = ', { frac: [[pv('4π'), ' + 0'], '2'] }, ' · ', Mt, '   →   ', Mt, ' = ', pt('10 s')] },
        { texto: ['La ', neg('B'), ' usa 4π rad/s todo el tiempo, como si no frenara. La ', neg('C'), ' toma las 10 vueltas como si fueran 10 rad. La ', neg('D'), ' da lo que tarda una vuelta al principio. La ', neg('E'), ' pasa las vueltas a grados, y ω está en rad/s.'] },
      ],
      respuesta: [neg('A'), ', ', pt('10 s')] },
    { nivel: 3, titulo: 'El primer segundo y el quinto',
      figura: figV5({ reloj: { x: 26, y: 30, frac: 1 / 60, texto: '1 s' }, textos: [tx('primer segundo: 3 rad', 'f')] }),
      enunciado: ['Un ventilador arranca del reposo y acelera parejo; en el primer segundo gira ', ps('3 rad'), '. ¿Qué ángulo gira en los primeros ', pt('5 s'), '?'],
      alternativas: ['15 rad', '27 rad', '45 rad', '75 rad', '150 rad'],
      fuente: 'Parecida a la de San Marcos 2025-II (pregunta 81)',
      datos: [D5.th, D5.reposo],
      solucion: [
        { texto: 'Arranca del reposo, así que lo girado en el primer segundo es ½ · α · 1², y de ahí sale α:', ecuacion: [ps('3'), ' = ½ · ', Mal, ' · ', cuad(pt('1')), '   →   ', Mal, ' = ', pa('6 rad/s²')] },
        { texto: 'Con α, el ángulo de los primeros 5 s; como crece con t², es 5² = 25 veces lo del primer segundo:', ecuacion: [Mth, ' = ½ · ', pa('6'), ' · ', cuad(pt('5')), ' = ', ps('75 rad'), ': 25 veces lo del primer segundo'] },
        { texto: ['La ', neg('A'), ' cree que gira 3 rad en cada segundo, como si no acelerara. La ', neg('B'), ' da solo lo del quinto segundo. La ', neg('C'), ' suma 3, 6, 9, 12 y 15, pero cada segundo suma 6 rad más que el anterior, no 3. La ', neg('E'), ' olvida el ½.'] },
      ],
      respuesta: [neg('D'), ', ', ps('75 rad')] },
    { nivel: 3, titulo: 'La bicicleta que arranca',
      figura: figLlanta({ radio: 'r = 0,4 m', textos: [{ x: 8, y: 22, texto: 'α = 2 rad/s²', color: 'h' }, { x: 312, y: 22, texto: '5 s', color: 'i', ancla: 'end' }] }),
      enunciado: ['Una bicicleta arranca del reposo. Sus ruedas, de 0,4 m de radio, ruedan sin resbalar con ', pa('α = 2 rad/s²'), '. ¿Qué distancia avanza en ', pt('5 s'), '?'],
      alternativas: ['25 m', '10 m', '62,5 m', '20 m', '4 m'],
      fuente: 'Parecida a la de San Marcos 2023-II (pregunta 82)',
      datos: [D5.th, D5.reposo, D1.arco, D1.rueda],
      solucion: [
        { texto: 'Primero, lo que gira la rueda desde el reposo en 5 s:', ecuacion: [Mth, ' = ½ · ', pa('2'), ' · ', cuad(pt('5')), ' = ', ps('25 rad')] },
        { texto: 'Sin resbalar, la bicicleta avanza lo que mide el arco del borde: el ángulo por el radio.', ecuacion: [Ms, ' = ', ps('25'), ' · 0,4 = ', ps('10 m')] },
        { texto: ['La ', neg('A'), ' da los 25 rad como si fueran metros. La ', neg('C'), ' divide el ángulo entre el radio, cuando hay que multiplicar. La ', neg('D'), ' olvida el ½. La ', neg('E'), ' multiplica la ω final por el radio, y eso da la rapidez final, no la distancia.'] },
      ],
      respuesta: [neg('B'), ', ', ps('10 m')] },
    { nivel: 3, titulo: 'Lo del cuarto segundo',
      figura: figV5({ reloj: { x: 26, y: 30, frac: 4 / 60, texto: 'de 3 s a 4 s' }, textos: [tx('cuarto segundo: 14 rad', 'f')] }),
      enunciado: ['Un ventilador arranca del reposo y acelera parejo. Solo durante el cuarto segundo gira ', ps('14 rad'), '. ¿Cuál es su aceleración angular?'],
      alternativas: ['1,75 rad/s²', '2 rad/s²', '3,5 rad/s²', '28 rad/s²', '4 rad/s²'],
      datos: [D5.th, D5.reposo, 'El cuarto segundo va de t = 3 s a t = 4 s'],
      solucion: [
        { texto: 'Lo que gira solo en el cuarto segundo es lo girado hasta los 4 s menos lo girado hasta los 3 s:', ecuacion: [ps('14'), ' = ½ · ', Mal, ' · ', cuad(pt('4')), ' − ½ · ', Mal, ' · ', cuad(pt('3')), ' = ½ · ', Mal, ' · 7'] },
        { texto: 'Se despeja α: se multiplica por 2 y se divide entre 7.', ecuacion: [Mal, ' = ', { frac: ['2 · 14', '7'] }, ' = ', pa('4 rad/s²')] },
        { texto: ['La ', neg('A'), ' toma los 14 rad como lo girado en los 4 s enteros. La ', neg('B'), ' olvida el ½. La ', neg('C'), ' divide entre 4, como si girara parejo. La ', neg('D'), ' usa (4 − 3)², cuando lo que se resta es 4² − 3².'] },
      ],
      respuesta: [neg('E'), ', ', pa('4 rad/s²')] },
  ];

  const mcuvIdea = {
    id: 'mcuv',
    titulo: 'MCUV: el giro que acelera',
    pregunta: '¿Cuánto gira un ventilador mientras arranca?',
    temas: ['MCUV'],
    pieza: 'fis-giro',
    aprendizaje: 'Si ω cambia lo mismo cada segundo, α = Δω/Δt; ω = ω₀ + α·t y θ = ω₀·t + ½·α·t², como en el MRUV.',
    actividad: 'Prender el ventilador del aula y ver cómo sube su ω.',
    lee: {
      tarjetas: [
        { titulo: 'El ventilador del aula', texto: ['Al prenderlo, el ventilador del techo no llega de golpe a su rapidez: cada segundo gira más rápido que el anterior. Por eso su velocidad angular, ', Mw, ', no es fija como en el MCU: crece mientras arranca.'],
          dibujo: juegoB5({ w0: 0, alfa: 2, t: 1.5 }) },
        { titulo: 'Lo que gana cada segundo', texto: ['Si ', Mw, ' aumenta lo mismo en cada segundo, el giro es un MCUV, un movimiento circular uniformemente variado: varía, pero de manera pareja. Lo que gana ω en cada segundo es su aceleración angular, ', Mal, ', y se mide en rad/s², es decir, rad/s ganados por segundo.'] },
        { titulo: 'Como una combi que acelera', texto: 'Es lo mismo que una combi que acelera parejo en una recta, pero girando. En vez de contar metros recorridos se cuentan radianes girados, y en vez de m/s se usan rad/s; por eso las cuentas del MRUV sirven con otras letras.' },
        { titulo: 'Qué mirar al jugar', texto: ['Elige con qué ', Mw0, ' empieza y cuánto gana en cada segundo. Mira el número de ', Mw, ' mientras corre el reloj, y fíjate cuánto sube entre un segundo y el siguiente.'] },
      ],
    },
    ejemplos: EJEMPLOS_MCUV,
    juega: {
      pieza: 'fis-giro',
      consigna: 'Se prende el ventilador del aula: cada segundo gira más rápido que el anterior. Tú eliges con qué ω empieza y cuánto gana cada segundo.',
      mision: {
        texto: 'Haz que el ventilador llegue a 12 rad/s justo a los 4 s.',
        // Cinco maneras: ω₀ + 4α = 12 (0 y 3; 2 y 2,5; 4 y 2; 6 y 1,5; 8 y 1), como en la idea 1 de MRUV.
        logrado: val => Math.abs(val.w0 + T_B5 * val.alfa - 12) < 1e-9,
        bien: 'Son 12 rad/s a los 4 s: lo ganado entre 4 s es su α.',
      },
      voz: '¿Cuánto gana ω en cada segundo?',
      leyenda: [
        { s: [Mw], t: 'qué tan rápido gira en ese instante' },
        { s: [Mw0], t: 'la ω con que empieza' },
        { s: [Mal], t: 'lo que gana ω cada segundo' },
        { s: [Mt], t: 'segundos desde que se prende' },
        { s: 'aspa pintada', t: 'para seguir el giro' },
      ],
      controles: [
        { id: 'w0', etiqueta: 'Empieza con, ω₀', color: 'c-o', min: 0, max: 8, paso: 2, inicio: 2, unidad: 'rad/s', decimales: 0 },
        { id: 'alfa', etiqueta: 'Gana cada segundo, α', color: 'c-h', min: 0.5, max: 3, paso: 0.5, inicio: 1, unidad: 'rad/s²', decimales: 1 },
        { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: T_B5, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: juegoB5,
      lectura: val => ['Gana ', pa(`${f(val.alfa)} rad/s`), ' por segundo: a 4 s, ', pv(`${f(val.w0 + T_B5 * val.alfa)} rad/s`)],
      resumen: { w0: 2, alfa: 1, t: 2 },
      minimo: 3,
    },
    predice: {
      pregunta: 'El ventilador arranca del reposo y acelera parejo: en el primer segundo gira 2 rad. ¿Cuánto gira en los primeros 3 s?',
      datos: ['Cada segundo, su velocidad angular aumenta lo mismo.', 'Arranca del reposo: empieza sin girar.'],
      opciones: [
        { id: 'c', texto: '18 rad', correcta: true },
        { id: 'triple', texto: '6 rad', error: 'PR1', siFuera: 'Triple de tiempo daría triple de giro si girara parejo, siempre igual de rápido. Pero acelera, así que el segundo y el tercer segundo giran más de 2 rad cada uno.' },
        { id: 'enesimo', texto: '10 rad', error: 'MC-ENESIMO', siFuera: '10 rad es lo que gira solo durante el tercer segundo, el más rápido. Piden todo lo girado en los primeros 3 s, así que faltan el primer segundo y el segundo.' },
        { id: 'w', texto: '12 rad', error: 'MC-W-ANGULO', siFuera: 'Es cierto que cada segundo gira más, pero no 2 rad más cada vez: 2, 4 y 6 suponen que lo girado sube de 2 en 2. Sube de 4 en 4, porque ω gana 4 rad/s cada segundo.' },
      ],
      dibujo: giroF(PRED_B5),
      revelar: giroF(MIRA_B5, { corte: 2 }),
      coincide: 'Coincide: 2, 6 y 10 rad, segundo a segundo, suman 18 rad. Con el triple de tiempo, gira nueve veces más.',
    },
    mira: {
      pieza: 'fis-giro',
      datos: MIRA_B5,
      pasos: [
        // Segundo a segundo, sin la fórmula de la regla hasta el último paso (lector en frío B, 19 nov).
        { estado: { corte: 0 }, texto: 'En el primer segundo gira 2 rad y ω sube de 0 a 4 rad/s: gana 4 rad/s en cada segundo.', ecuacion: [Mal, ' = ', { frac: [pv('4'), pt('1')] }, ' = ', pa('4 rad/s²')] },
        { estado: { corte: 1 }, texto: 'En el segundo segundo, ω va de 4 a 8 rad/s. Como ya parte más rápido, gira 6 rad, el triple que en el primero.', ecuacion: [ps('2'), ' + ', ps('6'), ' = ', ps('8 rad')] },
        { estado: { corte: 2 }, texto: 'En el tercer segundo, ω va de 8 a 12 rad/s y gira 10 rad. Lo girado en cada segundo crece de 4 en 4.', ecuacion: [ps('2'), ' + ', ps('6'), ' + ', ps('10'), ' = ', ps('18 rad')] },
        { estado: { corte: 3 }, texto: 'Con el triple de tiempo, gira nueve veces más: desde el reposo, θ crece con el cuadrado del tiempo, como la distancia en el MRUV.', ecuacion: [Mth, ' = ½ · ', pa('4'), ' · ', cuad(pt('3')), ' = ', ps('18 rad'), ' = 9 · ', ps('2 rad')] },
      ],
    },
    regla: {
      texto: 'En el MCUV, ω cambia lo mismo en cada segundo, y ese cambio por segundo es α. Valen las ecuaciones del MRUV, con θ, ω y α en lugar de x, v y a, porque es el mismo movimiento contado en radianes. Desde el reposo, θ crece con t²: el doble de tiempo, cuatro veces el giro.',
      ecuacion: [Mal, ' = ', { frac: [['Δ', Mw], ['Δ', Mt]] }, ';   ', Mw, ' = ', Mw0, ' + ', Mal, ' · ', Mt, ';   ', Mth, ' = ', Mw0, ' · ', Mt, ' + ', { llave: ['½ · ', Mal, ' · ', Mt2], nota: 'lo que suma α', color: 'c-h' }],
      condicion: 'α es constante y θ va en radianes; si α cambia, estas ecuaciones no sirven. Sin el tiempo vale ω² = ω₀² + 2α · θ. Si frena, α es negativa.',
    },
    // Así se resuelve: α sin el tiempo (con ω²) y el ángulo con la ω media; «Ahora tú» pide α con el tiempo, ω, θ con t²
    // y el frenado con vueltas.
    resuelve: {
      pieza: 'fis-giro',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 0) {
          const [w0, w, th] = r.de([[10, 30, 100], [0, 20, 50], [4, 12, 16], [5, 15, 25], [0, 12, 36], [6, 10, 8], [10, 20, 75]]), al = (w * w - w0 * w0) / (2 * th);
          return {
            enunciado: ['Una rueda pasa de ', pv(`${w0} rad/s`), ' a ', pv(`${w} rad/s`), ' mientras gira ', ps(`${th} rad`), ', acelerando parejo. ¿Cuál es su aceleración angular?'],
            datos: [D5.w2, D5.w],
            dibujo: figV5({ textos: [tx(`de ${w0} a ${w} rad/s`, 'o'), tx(`θ = ${th} rad`, 'f', 196)] }),
            pasos: [
              { tipo: 'pide', texto: ['Piden ', Mal, ': cuánto gana ω cada segundo.'] },
              { tipo: 'datos', texto: ['La rueda pasa de ', pv(`${w0}`), ' a ', pv(`${w} rad/s`), ' mientras gira ', ps(`${th} rad`), '. No dan el tiempo.'] },
              { tipo: 'regla', texto: 'Como no dan el tiempo, uso la ecuación que une ω con el ángulo girado, sin t.', ecuacion: [cuad(Mw), ' = ', cuad(Mw0), ' + 2 · ', Mal, ' · ', Mth] },
              { tipo: 'cuentas', texto: 'Reemplazo los datos, paso ω₀² al otro lado y divido entre 2θ para despejar α.', ecuacion: [Mal, ' = ', { frac: [`${w * w} − ${w0 * w0}`, `2 · ${th}`] }, ' = ', pa(`${f(al)} rad/s²`)] },
              { tipo: 'sentido', texto: `Compruebo: con esa α tarda (${w} − ${w0}) ÷ ${f(al)} = ${f((w - w0) / al)} s, y a la ω media gira ${f((w0 + w) / 2 * (w - w0) / al)} rad, los del enunciado.` },
            ],
            respuesta: [Mal, ' = ', pa(`${f(al)} rad/s²`)],
          };
        }
        const [w0, w, t] = r.de([[10, 30, 5], [0, 20, 4], [6, 14, 3], [8, 0, 4], [20, 0, 5], [12, 18, 2], [5, 25, 6]]), th = (w0 + w) / 2 * t;
        return {
          enunciado: ['Una polea pasa de ', pv(`${w0} rad/s`), ' a ', pv(`${w} rad/s`), ' en ', pt(`${t} s`), `, ${w < w0 ? 'frenando' : 'acelerando'} parejo. ¿Qué ángulo gira en ese tiempo?`],
          datos: [D5.med, D5.th],
          dibujo: figV5({ reloj: { x: 26, y: 30, frac: t / 60, texto: `${t} s` }, textos: [tx(`de ${w0} a ${w} rad/s`, 'o')] }),
          pasos: [
            { tipo: 'pide', texto: ['Piden el ángulo girado ', Mth, '.'] },
            { tipo: 'datos', texto: ['La polea pasa de ', pv(`${w0}`), ' a ', pv(`${w} rad/s`), ' en ', pt(`${t} s`), ', con α constante.'] },
            { tipo: 'regla', texto: 'Con α constante, ω cambia parejo, así que gira lo mismo que si fuera todo el tiempo a la ω media, el promedio de la inicial y la final.', ecuacion: [Mth, ' = ', { frac: [[Mw0, ' + ', Mw], '2'] }, ' · ', Mt] },
            { tipo: 'cuentas', texto: `La ω media es ${f((w0 + w) / 2)} rad/s; la multiplico por el tiempo.`, ecuacion: [Mth, ' = ', { frac: [[pv(`${w0}`), ' + ', pv(`${w}`)], '2'] }, ' · ', pt(`${t}`), ' = ', ps(`${f(th)} rad`)] },
            { tipo: 'sentido', texto: `Compruebo con la otra ecuación: α = ${f((w - w0) / t)} rad/s², y ${w0} · ${t} + ½ · ${f((w - w0) / t)} · ${t}² da también ${f(th)} rad.` },
          ],
          respuesta: ['Gira ', ps(`${f(th)} rad`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-giro',
      generar(sm) {
        const r = azar(sm + 17), k = sm % 4;
        if (k === 0) {
          const w1 = r.de([4, 6, 8, 10, 12, 20]), dt = r.de([2, 4, 5]), al = r.de([1, 2, 3, 4, 5]), w2 = w1 + al * dt;
          return {
            pregunta: ['La velocidad angular de un esmeril aumenta de manera uniforme de ', pv(`${w1} rad/s`), ' a ', pv(`${w2} rad/s`), ' en ', pt(`${dt} s`), '. ¿Cuál es su aceleración angular?'],
            datos: [D5.alfa],
            dibujo: figV5({ reloj: { x: 26, y: 30, frac: dt / 60, texto: `${dt} s` }, textos: [tx(`de ${w1} a ${w2} rad/s`, 'o')] }),
            opciones: opciones(al, [
              { id: 'final', valor: w2 / dt, error: 'K4', siFuera: 'Dividir entre el tiempo está bien, pero lo que se divide es el cambio de ω. La ω final incluye lo que ya giraba al empezar, y eso no lo ganó en esos segundos.' },
              { id: 'suma', valor: (w1 + w2) / dt, error: 'K4', siFuera: 'Dividir entre el tiempo está bien, pero las dos ω se restan, no se suman. α mide cuánto cambió ω, y el cambio es la final menos la inicial.' },
              { id: 'por', valor: (w2 - w1) * dt, error: 'AN-POR', siFuera: 'El cambio de ω está bien, pero α es lo que gana en cada segundo, así que ese cambio se reparte entre los segundos: se divide, no se multiplica.' },
              { id: 'inicial', valor: w1 / dt, error: 'K4', siFuera: 'Dividir entre el tiempo está bien, pero la ω inicial no dice cuánto aceleró. Lo que se divide es el cambio de ω, la final menos la inicial.' },
            ], n => `${f(n)} rad/s²`),
            solucion: { texto: 'α es lo que gana ω en cada segundo: el cambio de ω, la final menos la inicial, dividido entre el tiempo.', ecuacion: [Mal, ' = ', { frac: [`${w2} − ${w1}`, pt(`${dt}`)] }, ' = ', pa(`${f(al)} rad/s²`)] },
          };
        }
        if (k === 1) {
          const w0 = r.de([2, 4, 5, 10]), al = r.de([0.5, 1.5, 2, 3]), t = r.de([2, 4, 5, 6]), w = w0 + al * t;
          return {
            pregunta: ['Una rueda gira con ', pv(`${w0} rad/s`), ' y acelera parejo con ', pa(`α = ${f(al)} rad/s²`), '. ¿Con qué velocidad angular gira a los ', pt(`${t} s`), '?'],
            datos: [D5.w],
            dibujo: figV5({ reloj: { x: 26, y: 30, frac: t / 60, texto: `${t} s` }, textos: [tx(`ω₀ = ${w0} rad/s`, 'o', 196), tx(`α = ${f(al)} rad/s²`, 'h')] }),
            opciones: opciones(w, [
              { id: 'sin-w0', valor: al * t, error: 'MC-SIN-W0', siFuera: 'Lo que gana, α · t, está bien, pero la rueda ya giraba al empezar. Lo ganado se suma a la ω inicial: falta sumar ω₀.' },
              { id: 'un-seg', valor: w0 + al, error: 'K-TIEMPO', siFuera: 'Sumaste lo que gana en un solo segundo. En todo el tiempo gana α una vez por cada segundo, así que α se multiplica por t.' },
              { id: 'por', valor: w0 * al * t, error: 'AN-POR', siFuera: 'Usaste los tres datos, pero los multiplicaste todos. ω₀ es lo que ya tenía, y lo ganado, α · t, se le suma.' },
              { id: 'mitad', valor: w0 + al * t / 2, error: 'K-MITAD', siFuera: 'Sumar ω₀ está bien, pero en ese tiempo gana α · t entero, no la mitad. El ½ va en la ecuación del ángulo, no en la de ω.' },
            ], n => `${f(n)} rad/s`),
            solucion: { texto: `Gana ${f(al)} rad/s en cada uno de los ${t} s, y eso se suma a la ω con que empezó.`, ecuacion: [Mw, ' = ', pv(`${w0}`), ' + ', pa(f(al)), ' · ', pt(`${t}`), ' = ', pv(`${f(w)} rad/s`)] },
          };
        }
        if (k === 2) {
          let w0 = r.de([0, 2, 4]), al = r.de([1, 2, 4]), t = r.de([2, 3, 4, 5]);
          if (w0 === 0 && al === 4 && t === 3) t = 4;   // es la de Predice
          const th = w0 * t + al * t * t / 2;
          return {
            pregunta: [w0 ? 'Un ventilador gira con ' : 'Un ventilador arranca del reposo', w0 ? pv(`${w0} rad/s`) : '', w0 ? ' y acelera parejo con ' : ' y acelera parejo con ', pa(`α = ${al} rad/s²`), '. ¿Qué ángulo gira en ', pt(`${t} s`), '?'],
            datos: w0 ? [D5.th] : [D5.th, D5.reposo],
            dibujo: figV5({ reloj: { x: 26, y: 30, frac: t / 60, texto: `${t} s` }, textos: [tx(`ω₀ = ${w0} rad/s`, 'o', 196), tx(`α = ${al} rad/s²`, 'h')] }),
            opciones: opciones(th, [
              { id: 'sin-medio', valor: w0 * t + al * t * t, error: 'MC-SIN-MEDIO', siFuera: 'Los dos términos están bien, pero el de α lleva ½. Como ω sube desde ω₀, el ángulo que suma α es la mitad de α · t².' },
              { id: 'solo-w0', valor: w0 ? w0 * t : NaN, error: 'MC-SIN-ALFA', siFuera: 'ω₀ · t sería el giro si siguiera siempre a ω₀. Pero acelera y cada segundo gira más rápido, así que falta sumar el término de α.' },
              { id: 'w-angulo', valor: w0 + al * t, error: 'MC-W-ANGULO', siFuera: 'Ese número es la ω al final, en rad/s: dice cuánto gira en un segundo al terminar, no cuánto giró en total.' },
              { id: 'lineal', valor: w0 * t + al * t / 2, error: 'PR1', siFuera: '½ · α está bien, pero va con t², no con t. Lo girado crece más rápido que el tiempo, porque cada segundo gira más que el anterior.' },
              { id: 'vueltas', valor: th / (2 * PI), error: 'AN-VUELTA', siFuera: 'La ecuación del ángulo está bien, y ya da radianes. Al dividir entre 2π lo pasaste a vueltas, y piden el ángulo en radianes.' },
            ], n => `${f(n)} rad`),
            solucion: { texto: 'Con α constante, el ángulo es lo que giraría a ω₀ más lo que suma α, ½ · α · t².', ecuacion: [Mth, ' = ', pv(`${w0}`), ' · ', pt(`${t}`), ' + ½ · ', pa(`${al}`), ' · ', cuad(pt(`${t}`)), ' = ', ps(`${f(th)} rad`)] },
          };
        }
        // Nivel examen: el frenado con vueltas (San Marcos 2024-II).
        const kk = r.de([2, 4, 6, 8, 10]), n = r.de([5, 10, 15, 20]), t = 4 * n / kk;
        return {
          pregunta: ['Un ventilador gira con ', pv(`${enPi(kk)} rad/s`), '. Al apagarlo, frena parejo y da ', ps(`${n} vueltas`), ' hasta detenerse. ¿Cuánto tarda en detenerse?'],
          datos: [D5.med, D5.vuelta],
          dibujo: figV5({ textos: [tx(`${enPi(kk)} rad/s`, 'o', 196), tx(`${n} vueltas`, 'f')] }),
          opciones: opciones(t, [
            { id: 'sin-media', valor: 2 * n / kk, error: 'MC-W-MEDIA', siFuera: `Las vueltas a radianes están bien, pero no gira siempre a ${enPi(kk)} rad/s: frena parejo hasta cero, así que su ω media es la mitad.` },
            { id: 'vueltas', valor: 2 * n / (kk * PI), error: 'AN-VUELTA', siFuera: 'La ω media está bien, pero las vueltas no son radianes. ω va en rad/s, así que cada vuelta se cuenta como 2π rad.' },
            { id: 'grados', valor: 2 * 360 * n / (kk * PI), error: 'AN-GRADOS', siFuera: 'La ω media está bien, pero pasaste las vueltas a grados. ω está en rad/s, así que el ángulo tiene que ir en radianes.' },
            { id: 'periodo', valor: 2 / kk, error: 'MC-T-F', siFuera: 'Ese es el tiempo de una sola vuelta al principio, cuando gira más rápido. Da varias vueltas y además frena, así que tarda mucho más.' },
          ], n2 => `${f(n2)} s`),
          solucion: { texto: `${n} vueltas son ${enPi(2 * n)} rad. Frena parejo hasta cero, así que gira a una ω media de ${enPi(kk / 2)} rad/s; el tiempo es el ángulo entre esa ω.`, ecuacion: [Mt, ' = ', { frac: [ps(enPi(2 * n)), pv(enPi(kk / 2))] }, ' = ', pt(`${f(t)} s`)] },
        };
      },
    },
  };

  // ======================= B6: aceleración tangencial y total (el carrusel que arranca) =======================
  // Cambia: el instante del arranque · Permanece: α = 1 rad/s² y el caballo a 2 m del eje (a_T = 2 m/s², fija) ·
  // Progresa: la rapidez y, con ella, la aceleración hacia el centro · Se reserva: el carrusel que ya gira parejo (en
  // Predice) · Debe verse: a_T no cambia, a_c crece con v²; son perpendiculares.
  // El carrusel: eje en (160; 118), 100 px = 2,5 m (40 px por metro); el caballo a 2 m (80 px). Flechas: 12 px por m/s;
  // 9 px por m/s² (las dos aceleraciones con la misma escala).
  const R_B6 = 2, AT_B6 = 2, KV6 = 12, KA6 = 10, F6 = 0.9;
  const angB6 = t => 20 + deg(AT_B6 / R_B6 * t * t / 2);
  const tg6 = a => [-Math.sin(rad(a)), -Math.cos(rad(a))], ce6 = a => [-Math.cos(rad(a)), Math.sin(rad(a))];
  // La flecha de la velocidad va en la misma línea que a_T: se dibuja solo cuando a_T no está (al girar parejo); si no,
  // la rapidez va escrita arriba.
  function carruselB6(t, o = {}) {
    const a = o.ang === undefined ? angB6(t) : o.ang, v = o.v === undefined ? AT_B6 * t : o.v, at = o.at === undefined ? AT_B6 : o.at, ac = v * v / R_B6;
    const fl = [];
    if (v > 0.05 && at < 0.05) fl.push({ ang: a, f: F6, largo: v * KV6, texto: 'v' });
    if (at > 0.05) fl.push({ ang: a, f: F6, largo: at * KA6, color: 'h', discontinua: !!o.total, texto: 'a_T', lado: -1 });
    if (ac > 0.05 && !o.sinC) fl.push({ ang: a, f: F6, dir: 'centro', largo: ac * KA6, color: 'h', discontinua: !!o.total, texto: 'a_c' });
    if (o.total && at > 0.05 && ac > 0.05) { const u = tg6(a), w = ce6(a); fl.push({ ang: a, f: F6, dir: [u[0] * at + w[0] * ac, u[1] * at + w[1] * ac], largo: Math.hypot(at, ac) * KA6, color: 'h', texto: 'a⃗', lado: -1 }); }
    const textos = [{ x: 8, y: 20, texto: `v = ${f(v)} m/s`, color: 'o' }, ...(o.textos || [])];
    return { alto: 240, cuerpos: [Object.assign({}, CARRUSEL, { R: 100, giro: a - 20 })], puntos: [{ ang: a, f: F6, tipo: 'caballo' }], flechas: fl,
      radios: [{ ang: a, f: F6, discontinuo: true }], sentido: [{ f: 1.12, de: a + 30, a: a + 75 }], textos,
      alt: o.alt || `Carrusel que arranca; a los ${f(t)} s el caballo, a 2 m del eje, va a ${f(v)} m/s.` };
  }
  const juegoB6 = val => giroF(carruselB6(val.t));
  const PRED_B6 = carruselB6(0, { ang: 60, v: 4, at: 0, sinC: true, textos: [{ x: 8, y: 236, texto: 'gira parejo: siempre 4 m/s', color: 'o' }],
    alt: 'Carrusel que ya gira parejo: el caballo, a 2 m del eje, va siempre a 4 m/s.' });
  const REV_B6 = carruselB6(0, { ang: 60, v: 4, at: 0, textos: [{ x: 8, y: 236, texto: 'solo a_c = 8 m/s²', color: 'h' }] });
  const MIRA_B6 = Object.assign(carruselB6(0.5), { alt: 'El carrusel arranca: el caballo gana rapidez y aparece la aceleración hacia el centro; después gira parejo.', cortes: [
    carruselB6(0.5), carruselB6(1), carruselB6(2), carruselB6(2, { total: true }), carruselB6(2, { at: 0, textos: [{ x: 8, y: 236, texto: 'ya no gana rapidez', color: 'o' }] }),
  ].map(d => ({ cuerpos: d.cuerpos, puntos: d.puntos, flechas: d.flechas, radios: d.radios, sentido: d.sentido, textos: d.textos })) });

  const D6 = {
    aT: ['Aceleración tangencial: ', MaT, ' = ', Mal, ' · r'],
    ac: [Mac, ' = ', { frac: [cuad(Mv), 'r'] }, ' = ', cuad(Mw), ' · r: la aceleración centrípeta'],
    a: [Ma, ' = ', { raiz: [cuad(MaT), ' + ', cuad(Mac)] }, ': la aceleración total (las dos partes son perpendiculares)'],
    v: ['Desde el reposo, con ', MaT, ' constante: ', Mv, ' = ', MaT, ' · ', Mt],
    w: ['Con α constante: ', Mw, ' = ', Mw0, ' + ', Mal, ' · ', Mt],
    w2: ['Sin el tiempo: ', cuad(Mw), ' = ', cuad(Mw0), ' + 2 · ', Mal, ' · ', Mth],
    ang: ['Ángulo φ entre a⃗ y v⃗: tan φ = ', { frac: [Mac, MaT] }],
    notables: 'tan 37° = 3/4 y tan 53° = 4/3 (convención del examen)',
  };
  // Ejemplos resueltos de B6. Cuentas rehechas aparte (cuentas-b.js: resta velocidades vecinas en un arranque simulado
  // paso a paso y separa lo que va a lo largo de lo que va al centro): 3·2; 6²/4; √(3² + 4²); 1,5/0,5; 2·3; 2·4 y 8²/8;
  // 4²/2 y √(6² + 8²); 3·0,5, 2²·0,5 y √(1,5² + 2²); √(13² − 12²); tan φ = 3/4; t = √(r/a_T); θ = ½ a_c/a_T;
  // 6²/3 y 12/(4/3); α·t, ω²·r y √(1² + 8²); 0,5·4 y 2²·4; y el valor de cada alternativa equivocada con su error.
  // Las figuras de los ejemplos no van a escala: muestran qué flechas hay (a_T a lo largo, a_c al centro, la total en
  // diagonal) y sus datos escritos; lo que se pide va con «?». La velocidad, que va en la misma línea que a_T, se dibuja
  // solo si a_T no está.
  function figB6(o = {}) {
    const a = 50, m = o.muestra || {}, fl = [], u = tg6(a), w = ce6(a);
    if (m.v && !m.aT) fl.push({ ang: a, f: 0.9, largo: 42, texto: m.v, color: 'o' });
    if (m.aT) fl.push({ ang: a, f: 0.9, largo: 34, color: 'h', discontinua: !!m.a, texto: m.aT, lado: -1 });
    if (m.ac) fl.push({ ang: a, f: 0.9, dir: 'centro', largo: 46, color: 'h', discontinua: !!m.a, texto: m.ac });
    if (m.a) fl.push({ ang: a, f: 0.9, dir: [u[0] * 34 + w[0] * 46, u[1] * 34 + w[1] * 46], largo: Math.hypot(34, 46), color: 'h', texto: m.a, lado: -1 });
    const POS = [{ x: 8, y: 236 }, { x: 312, y: 236, ancla: 'end' }, { x: 8, y: 20 }, { x: 312, y: 20, ancla: 'end' }];
    const textos = (o.lineas || []).map(([texto, color], k) => Object.assign({ texto, color }, POS[k]));
    const cuerpo = o.ventilador ? { tipo: 'ventilador', c: CARRUSEL.c, R: 100, giro: a } : Object.assign({}, CARRUSEL, { R: 100, giro: 30 });
    return giroF({ alto: 240, cuerpos: [cuerpo], puntos: [{ ang: a, f: 0.9, tipo: o.objeto || 'caballo' }], flechas: fl,
      radios: [{ ang: a, f: 0.9, discontinuo: true }], sentido: [{ f: 1.12, de: a + 30, a: a + 75 }], textos, alt: o.alt || 'Un punto que gira, con las flechas de su aceleración.' });
  }
  const EJEMPLOS_TOTAL = [
    { nivel: 1, titulo: 'La aceleración tangencial',
      figura: figB6({ muestra: { aT: '?' }, lineas: [['α = 3 rad/s²', 'h'], ['r = 2 m']] }),
      enunciado: ['Un carrusel arranca con ', pa('α = 3 rad/s²'), '. ¿Cuánto vale la aceleración tangencial de un caballo a 2 m del eje?'],
      datos: [D6.aT],
      solucion: [{ texto: 'La tangencial es lo que gana la rapidez del caballo en cada segundo: α por su distancia al eje.', ecuacion: [MaT, ' = ', pa('3'), ' · 2 = ', pa('6 m/s²')] }],
      respuesta: [MaT, ' = ', pa('6 m/s²')] },
    { nivel: 1, titulo: 'La centrípeta en un instante',
      figura: figB6({ muestra: { v: '6 m/s', ac: '?' }, lineas: [['r = 4 m']] }),
      enunciado: ['Un caballo, a 4 m del eje de un carrusel que arranca, va en un instante a ', pv('6 m/s'), '. ¿Cuánto vale su aceleración centrípeta en ese instante?'],
      datos: [D6.ac],
      solucion: [{ texto: 'La rapidez cambia, así que la centrípeta se calcula con la rapidez de ese instante:', ecuacion: [Mac, ' = ', { frac: [cuad(pv('6')), '4'] }, ' = ', pa('9 m/s²')] }],
      respuesta: [Mac, ' = ', pa('9 m/s²')] },
    { nivel: 1, titulo: 'La aceleración total',
      figura: figB6({ muestra: { aT: 'a_T', ac: 'a_c', a: '?' }, lineas: [['a_T = 3 m/s²', 'h'], ['a_c = 4 m/s²', 'h']] }),
      enunciado: ['En un instante, un punto que gira tiene ', MaT, ' = ', pa('3 m/s²'), ' y ', Mac, ' = ', pa('4 m/s²'), '. ¿Cuánto vale su aceleración total?'],
      datos: [D6.a],
      solucion: [{ texto: 'Una va a lo largo del giro y la otra hacia el centro, así que son perpendiculares y se juntan con Pitágoras:', ecuacion: [Ma, ' = ', { raiz: [cuad(pa('3')), ' + ', cuad(pa('4'))] }, ' = ', pa('5 m/s²')] }],
      respuesta: [Ma, ' = ', pa('5 m/s²')] },
    { nivel: 1, titulo: 'La α con la tangencial',
      figura: figB6({ objeto: 'punto', ventilador: true, muestra: { aT: '1,5 m/s²' }, lineas: [['α = ?'], ['r = 0,5 m']] }),
      enunciado: ['La punta de un aspa, a 0,5 m del eje, tiene ', MaT, ' = ', pa('1,5 m/s²'), '. ¿Cuál es la aceleración angular del ventilador?'],
      datos: [D6.aT],
      solucion: [{ texto: sx('De a_T = α · r se despeja α: la tangencial entre la distancia al eje.'), ecuacion: [Mal, ' = ', { frac: [pa('1,5'), '0,5'] }, ' = ', pa('3 rad/s²')] }],
      respuesta: [Mal, ' = ', pa('3 rad/s²')] },
    { nivel: 1, titulo: 'La rapidez al arrancar',
      figura: figB6({ muestra: { aT: '2 m/s²' }, lineas: [['v = ?'], ['t = 3 s', 'i']] }),
      enunciado: ['Un caballo del carrusel arranca del reposo con ', MaT, ' = ', pa('2 m/s²'), '. ¿Con qué rapidez va a los ', pt('3 s'), '?'],
      datos: [D6.v],
      solucion: [{ texto: 'Parte del reposo y gana 2 m/s en cada segundo, así que en 3 s junta tres veces eso:', ecuacion: [Mv, ' = ', pa('2'), ' · ', pt('3'), ' = ', pv('6 m/s')] }],
      respuesta: ['Va a ', pv('6 m/s')] },
    { nivel: 2, titulo: 'Al arrancar, la centrípeta',
      figura: figB6({ objeto: 'punto', muestra: { aT: '2 m/s²', ac: '?' }, lineas: [['r = 8 m'], ['t = 4 s', 'i']] }),
      enunciado: ['Un juego que gira arranca del reposo; un asiento a 8 m del eje tiene ', MaT, ' = ', pa('2 m/s²'), '. ¿Cuánto vale su aceleración centrípeta a los ', pt('4 s'), '?'],
      datos: [D6.v, D6.ac],
      solucion: [
        { texto: 'La centrípeta depende de la rapidez, así que primero se calcula la de los 4 s:', ecuacion: [Mv, ' = ', pa('2'), ' · ', pt('4'), ' = ', pv('8 m/s')] },
        { texto: 'Con esa rapidez, la centrípeta es v² entre el radio:', ecuacion: [Mac, ' = ', { frac: [cuad(pv('8')), '8'] }, ' = ', pa('8 m/s²')] },
      ],
      respuesta: [Mac, ' = ', pa('8 m/s²')] },
    { nivel: 2, titulo: 'La total con la rapidez',
      figura: figB6({ objeto: 'punto', muestra: { aT: '6 m/s²', ac: 'a_c', a: '?' }, lineas: [['v = 4 m/s', 'o'], ['r = 2 m']] }),
      enunciado: ['En un instante, un punto a 2 m del eje va a ', pv('4 m/s'), ' y tiene ', MaT, ' = ', pa('6 m/s²'), '. ¿Cuánto vale su aceleración total?'],
      datos: [D6.ac, D6.a],
      solucion: [
        { texto: 'Falta la parte hacia el centro, que sale de la rapidez de ese instante:', ecuacion: [Mac, ' = ', { frac: [cuad(pv('4')), '2'] }, ' = ', pa('8 m/s²')] },
        { texto: 'Las dos partes son perpendiculares, así que la total sale con Pitágoras:', ecuacion: [Ma, ' = ', { raiz: [cuad(pa('6')), ' + ', cuad(pa('8'))] }, ' = ', pa('10 m/s²')] },
      ],
      respuesta: [Ma, ' = ', pa('10 m/s²')] },
    { nivel: 2, titulo: 'Con α y con ω',
      figura: figB6({ objeto: 'punto', ventilador: true, muestra: { aT: 'a_T', ac: 'a_c', a: '?' }, lineas: [['ω = 2 rad/s', 'o'], ['α = 3 rad/s²', 'h'], ['r = 0,5 m']] }),
      enunciado: ['En un instante, un ventilador gira con ', pv('ω = 2 rad/s'), ' y ', pa('α = 3 rad/s²'), '. ¿Cuánto vale la aceleración total de un punto a 0,5 m del eje?'],
      datos: [D6.aT, D6.ac, D6.a],
      solucion: [
        { texto: 'Con α sale la tangencial, y con ω, la centrípeta; las dos usan la misma distancia al eje:', ecuacion: [MaT, ' = ', pa('3'), ' · 0,5 = ', pa('1,5 m/s²'), ';   ', Mac, ' = ', cuad(pv('2')), ' · 0,5 = ', pa('2 m/s²')] },
        { texto: 'Son perpendiculares, así que la total sale con Pitágoras:', ecuacion: [Ma, ' = ', { raiz: [cuad(pa('1,5')), ' + ', cuad(pa('2'))] }, ' = ', pa('2,5 m/s²')] },
      ],
      respuesta: [Ma, ' = ', pa('2,5 m/s²')] },
    { nivel: 2, titulo: 'La tangencial que falta',
      figura: figB6({ objeto: 'punto', muestra: { aT: '?', ac: '12 m/s²', a: '13 m/s²' } }),
      enunciado: ['Un punto que gira tiene una aceleración total de ', pa('13 m/s²'), ', y su parte hacia el centro mide ', pa('12 m/s²'), '. ¿Cuánto vale su aceleración tangencial?'],
      datos: [D6.a],
      solucion: [
        { texto: sx('La total es la hipotenusa del triángulo que forman sus dos partes, así que de Pitágoras se despeja a_T²:'), ecuacion: [cuad(MaT), ' = ', cuad(pa('13')), ' − ', cuad(pa('12')), ' = 169 − 144 = 25'] },
        { texto: 'La raíz da la tangencial:', ecuacion: [MaT, ' = ', { raiz: ['25'] }, ' = ', pa('5 m/s²')] },
      ],
      respuesta: [MaT, ' = ', pa('5 m/s²')] },
    { nivel: 2, titulo: 'El ángulo entre a⃗ y v⃗',
      figura: figB6({ objeto: 'punto', muestra: { aT: '4 m/s²', ac: '3 m/s²', a: 'a⃗' }, lineas: [['φ = ?']] }),
      enunciado: ['En un instante, un punto que gira tiene ', MaT, ' = ', pa('4 m/s²'), ' y ', Mac, ' = ', pa('3 m/s²'), '. ¿Qué ángulo forma su aceleración total con su velocidad?'],
      datos: [D6.ang, D6.notables, D6.a],
      solucion: [
        { texto: sx('v⃗ va a lo largo del giro, igual que a_T, y a_c es perpendicular. En ese triángulo, la tangente de φ es el lado opuesto entre el contiguo:'), ecuacion: ['tan φ = ', { frac: [pa('3'), pa('4')] }] },
        { texto: 'El ángulo cuya tangente vale 3/4 es el notable de 37°:', ecuacion: ['φ = 37°'] },
      ],
      respuesta: [neg('φ = 37°')] },
    { nivel: 3, titulo: '¿Cuándo miden lo mismo?',
      figura: figB6({ muestra: { aT: '1 m/s²', ac: 'a_c' }, lineas: [['r = 4 m'], ['t = ?']] }),
      enunciado: ['Un juego que gira arranca del reposo. Un asiento a 4 m del eje tiene ', MaT, ' = ', pa('1 m/s²'), '. ¿En qué instante su aceleración centrípeta mide lo mismo que la tangencial?'],
      alternativas: ['4 s', '0,25 s', '2,83 s', '2 s', '16 s'],
      datos: [D6.v, D6.ac],
      solucion: [
        { texto: 'Parte del reposo, así que a los t segundos va a 1 · t m/s. Su centrípeta es v² entre 4, y se iguala a la tangencial:', ecuacion: [{ frac: [cuad({ par: ['1 · ', Mt] }), '4'] }, ' = ', pa('1')] },
        { texto: 'Se multiplica por 4 y se saca la raíz:', ecuacion: [Mt2, ' = 4   →   ', Mt, ' = ', pt('2 s')] },
        { texto: ['La ', neg('A'), ...sx(' divide r entre a_T y se queda en t², sin sacar la raíz. La '), neg('B'), ' divide al revés. La ', neg('C'), ' pone 2r en vez de r. La ', neg('E'), ' eleva el radio al cuadrado.'] },
      ],
      respuesta: [neg('D'), ', a los ', pt('2 s')] },
    { nivel: 3, titulo: 'Cuánto giró hasta igualarse',
      figura: figB6({ objeto: 'punto', muestra: { aT: 'a_T', ac: 'a_c' }, lineas: [['α = 2 rad/s²', 'h'], ['r = 3 m'], ['θ = ?']] }),
      enunciado: ['Una rueda arranca del reposo con ', pa('α = 2 rad/s²'), ...sx('. Para un punto a 3 m del eje, ¿qué ángulo ha girado la rueda cuando a_c y a_T miden lo mismo?')],
      alternativas: ['1 rad', '0,5 rad', '2 rad', '0,25 rad', '3 rad'],
      datos: [D6.aT, D6.ac, D6.w2],
      solucion: [
        { texto: 'Miden lo mismo cuando ω² · r = α · r; el radio se cancela y queda ω² = α = 2. Como piden un ángulo y no un tiempo, sirve la ecuación sin t:', ecuacion: [cuad(Mw), ' = 0 + 2 · ', pa('2'), ' · ', Mth, ' = 2'] },
        { texto: 'Se despeja θ. Sale 0,5 rad para cualquier α y cualquier radio, porque los dos se cancelan.', ecuacion: [Mth, ' = ', { frac: ['2', '4'] }, ' = ', ps('0,5 rad')] },
        { texto: ['La ', neg('A'), ' supone que pasa 1 s, pero nada lo dice. La ', neg('C'), ' iguala θ con α. La ', neg('D'), ' divide otra vez entre 2. La ', neg('E'), ' da el radio, que ni siquiera entra en la cuenta.'] },
      ],
      respuesta: [neg('B'), ', ', ps('0,5 rad')] },
    { nivel: 3, titulo: 'Con el ángulo de 53°',
      figura: figB6({ objeto: 'punto', muestra: { aT: 'a_T', ac: 'a_c', a: '?' }, lineas: [['v = 6 m/s', 'o'], ['r = 3 m'], ['φ = 53°']] }),
      enunciado: ['Un punto gira en una circunferencia de 3 m de radio. En un instante va a ', pv('6 m/s'), ' y su aceleración total forma 53° con su velocidad. ¿Cuánto mide esa aceleración total?'],
      alternativas: ['12 m/s²', '9 m/s²', '21 m/s²', '20 m/s²', '15 m/s²'],
      datos: [D6.ac, D6.ang, D6.notables, D6.a],
      solucion: [
        { texto: 'Con la rapidez y el radio sale la centrípeta; con tan 53° = 4/3, que es a_c entre a_T, sale la tangencial:', ecuacion: [Mac, ' = ', { frac: [cuad(pv('6')), '3'] }, ' = ', pa('12 m/s²'), ';   ', { frac: [pa('12'), MaT] }, ' = ', { frac: ['4', '3'] }, '   →   ', MaT, ' = ', pa('9 m/s²')] },
        { texto: 'Las dos partes son perpendiculares, así que la total sale con Pitágoras:', ecuacion: [Ma, ' = ', { raiz: [cuad(pa('9')), ' + ', cuad(pa('12'))] }, ' = ', pa('15 m/s²')] },
        { texto: ['La ', neg('A'), ...sx(' da solo a_c y la '), neg('B'), ...sx(', solo a_T: falta juntarlas. La '), neg('C'), ' las suma, pero son perpendiculares. La ', neg('D'), ' usa tan 53° al revés, como 3/4.'] },
      ],
      respuesta: [neg('E'), ', ', pa('15 m/s²')] },
    { nivel: 3, titulo: 'La punta del aspa',
      figura: figV5({ reloj: { x: 26, y: 30, frac: 2 / 60, texto: '2 s' }, textos: [tx('α = 2 rad/s²', 'h', 196), tx('r = 0,5 m')] }),
      enunciado: ['Un ventilador arranca del reposo con ', pa('α = 2 rad/s²'), '. ¿Cuánto vale la aceleración total de la punta de un aspa, a 0,5 m del eje, a los ', pt('2 s'), '?'],
      alternativas: ['8,06 m/s²', '9 m/s²', '8 m/s²', '1 m/s²', '2,24 m/s²'],
      datos: [D6.w, D6.aT, D6.ac, D6.a],
      solucion: [
        { texto: 'Arranca del reposo, así que a los 2 s gira con ω = 2 · 2 = 4 rad/s. Con α sale la tangencial, y con ω, la centrípeta:', ecuacion: [MaT, ' = ', pa('2'), ' · 0,5 = ', pa('1 m/s²'), ';   ', Mac, ' = ', cuad(pv('4')), ' · 0,5 = ', pa('8 m/s²')] },
        { texto: 'Son perpendiculares, así que la total sale con Pitágoras:', ecuacion: [Ma, ' = ', { raiz: [cuad(pa('1')), ' + ', cuad(pa('8'))] }, ' = ', { raiz: ['65'] }, ' ≈ ', pa('8,06 m/s²')] },
        { texto: ['La ', neg('B'), ' suma las dos, pero son perpendiculares. La ', neg('C'), ...sx(' da solo a_c y la '), neg('D'), ...sx(', solo a_T. La '), neg('E'), ' usa α como si fuera ω para la centrípeta.'] },
      ],
      respuesta: [neg('A'), ', unos ', pa('8,06 m/s²')] },
    { nivel: 3, titulo: 'Después del arranque',
      figura: figB6({ muestra: { v: 'v', ac: '?' }, lineas: [['α = 0,5 rad/s² por 4 s', 'h'], ['r = 4 m']] }),
      enunciado: ['Un carrusel arranca del reposo con ', pa('α = 0,5 rad/s²'), ' durante ', pt('4 s'), ' y desde ahí gira parejo. Ya girando parejo, ¿cuánto vale la aceleración de un caballo a 4 m del eje?'],
      alternativas: ['16,12 m/s²', '2 m/s²', '16 m/s²', '0 m/s²', '18 m/s²'],
      datos: [D6.w, D6.aT, D6.ac, D6.a],
      solucion: [
        { texto: sx('Al terminar el arranque gira con ω = 0,5 · 4 = 2 rad/s. Desde ahí gira parejo y ya no gana rapidez, así que a_T = 0.'), ecuacion: [Mac, ' = ', cuad(pv('2')), ' · 4 = ', pa('16 m/s²')] },
        { texto: ['Queda la centrípeta, porque sigue girando. La ', neg('A'), ...sx(' sigue contando a_T, que ya no existe. La '), neg('B'), ...sx(' da solo a_T, la del arranque. La '), neg('D'), ' cree que sin cambio de rapidez no acelera. La ', neg('E'), ' suma las dos.'] },
      ],
      respuesta: [neg('C'), ', ', pa('16 m/s²'), ', hacia el centro'] },
  ];

  const total = {
    id: 'dos-aceleraciones',
    titulo: 'Aceleración tangencial y total',
    pregunta: '¿Hacia dónde apunta la aceleración de algo que gira cada vez más rápido?',
    temas: ['MCUV', 'Aceleración tangencial y centrípeta'],
    pieza: 'fis-giro',
    aprendizaje: 'En el MCUV hay dos aceleraciones perpendiculares: la tangencial, α·r, cambia la rapidez; la centrípeta, v²/r, la dirección. La total, con Pitágoras.',
    actividad: 'Arrancar el carrusel y mirar las dos flechas de la aceleración.',
    lee: {
      tarjetas: [
        { titulo: 'El carrusel que arranca', texto: 'El carrusel de la plaza arranca: un caballo a 2 m del eje gana 2 m/s de rapidez en cada segundo. Su rapidez cambia y, como además da vueltas, la dirección de su velocidad también cambia.',
          dibujo: juegoB6({ t: 1.5 }) },
        { titulo: 'Dos aceleraciones', texto: ['Por eso tiene dos aceleraciones, una por cada cambio. La que va a lo largo del giro es la aceleración tangencial, ', MaT, ', y la que apunta al centro es la centrípeta, ', Mac, ', que ya viste con la moto.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Avanza el reloj de a un cuarto de segundo desde que arranca. Compara el largo de las dos flechas de la aceleración: ¿cuál se queda igual y cuál cambia?' },
      ],
    },
    ejemplos: EJEMPLOS_TOTAL,
    juega: {
      pieza: 'fis-giro',
      consigna: 'El carrusel arranca: un caballo a 2 m del eje gana 2 m/s de rapidez cada segundo. Tú avanzas el reloj.',
      mision: {
        texto: 'Detén el reloj cuando sus dos aceleraciones midan lo mismo.',
        logrado: val => Math.abs(val.t - 1) < 1e-9,
        bien: 'A 1 s miden igual: la del centro crece con la rapidez, la otra no.',
      },
      voz: '¿Cuál de las dos flechas de la aceleración crece?',
      leyenda: [
        { s: [MaT], t: 'la aceleración a lo largo del giro' },
        { s: [Mac], t: 'la aceleración hacia el centro' },
        { s: [Mv], t: 'la rapidez del caballo' },
        { s: [Mt], t: 'segundos desde que arrancó' },
      ],
      controles: [{ id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: 2, paso: 0.25, inicio: 0.25, unidad: 's', decimales: 2 }],
      dibujo: juegoB6,
      lectura: val => ['A lo largo, ', pa('2 m/s²'), '; hacia el centro, ', pa(`${f(AT_B6 * AT_B6 * val.t * val.t / R_B6)} m/s²`)],
      resumen: { t: 1.5 },
      minimo: 3,
    },
    predice: {
      pregunta: 'Después de arrancar, el carrusel gira parejo, sin ir más rápido ni más lento. ¿Qué aceleración le queda a un caballo?',
      datos: ['Su rapidez ya no cambia: va siempre a 4 m/s.', 'Sigue dando vueltas.'],
      opciones: [
        { id: 'c', texto: 'Solo la que va hacia el centro', correcta: true },
        { id: 'solo-at', texto: 'Solo la que va a lo largo del giro', error: 'MC-SOLO-AT', siFuera: 'La aceleración a lo largo del giro es la que cambia la rapidez, y aquí la rapidez ya no cambia: esa vale cero. Lo que sigue cambiando es la dirección, porque el caballo da vueltas.' },
        { id: 'dos', texto: 'Las dos, como al arrancar', error: 'MC-DOS', siFuera: 'Al arrancar sí tenía las dos. Pero la de a lo largo del giro mide cuánto cambia la rapidez, y ahora va siempre a 4 m/s, así que esa parte desaparece.' },
        { id: 'ninguna', texto: 'Ninguna: va parejo', error: 'MC-A0-b', siFuera: 'Su rapidez no cambia, es cierto. Pero sigue dando vueltas, así que la flecha de su velocidad gira todo el tiempo, y ese cambio de dirección es una aceleración.' },
      ],
      dibujo: giroF(PRED_B6),
      revelar: giroF(REV_B6),
      coincide: 'Coincide: sin cambio de rapidez, la tangencial vale cero; queda la que cambia la dirección.',
    },
    mira: {
      pieza: 'fis-giro',
      datos: MIRA_B6,
      pasos: [
        { estado: { corte: 0 }, texto: sx('El caballo gana 2 m/s en cada segundo, así que a_T = 2 m/s². Como está a 2 m del eje, α es a_T entre r:'), ecuacion: [Mal, ' = ', { frac: [MaT, 'r'] }, ' = ', { frac: [pa('2'), '2'] }, ' = ', pa('1 rad/s²')] },
        { estado: { corte: 1 }, texto: 'A 1 s ya va a 2 m/s, y con esa rapidez la centrípeta mide lo mismo que la tangencial.', ecuacion: [Mac, ' = ', { frac: [cuad(pv('2')), '2'] }, ' = ', pa('2 m/s²')] },
        { estado: { corte: 2 }, texto: sx('A 2 s va a 4 m/s. La centrípeta creció cuatro veces, porque va con v²; a_T no cambió.'), ecuacion: [Mac, ' = ', { frac: [cuad(pv('4')), '2'] }, ' = ', pa('8 m/s²')] },
        { estado: { corte: 3 }, texto: 'Las dos partes son perpendiculares, así que la aceleración total es la diagonal del rectángulo que forman, y se mide con Pitágoras.', ecuacion: [Ma, ' = ', { raiz: [cuad(pa('2')), ' + ', cuad(pa('8'))] }, ' ≈ ', pa('8,25 m/s²')] },
        { estado: { corte: 4 }, texto: sx('Cuando deja de ganar rapidez, a_T = 0. Como sigue girando, la aceleración total es solo la centrípeta.'), ecuacion: [Ma, ' = ', Mac, ' = ', pa('8 m/s²')] },
      ],
    },
    regla: {
      texto: 'Si la rapidez cambia mientras gira, hay dos aceleraciones perpendiculares. La tangencial va a lo largo del giro y cambia la rapidez: mide α · r. La centrípeta va hacia el centro y cambia la dirección. Como forman un ángulo recto, la total no es su suma: es la diagonal del rectángulo, y sale con Pitágoras.',
      ecuacion: [{ llave: [MaT, ' = ', Mal, ' · r'], nota: 'cambia la rapidez', color: 'c-h' }, ';   ', Ma, ' = ', { raiz: [cuad(MaT), ' + ', cuad(Mac)] }],
      condicion: 'en la centrípeta, v²/r, se usa la rapidez de ese instante, que cambia al acelerar. Si la rapidez no cambia, la tangencial vale cero y la total es la centrípeta.',
      // La figura de la regla muestra las dos partes y la total (lector en frío B: la de Mira era el caso sin a_T).
      dibujo: giroF(carruselB6(2, { total: true, alt: 'El carrusel que arranca, a los 2 s: la aceleración tangencial a lo largo del giro, la centrípeta hacia el centro y la total en diagonal.' })),
    },
    // Así se resuelve: el ángulo entre a⃗ y v⃗ y la a_T que falta; «Ahora tú» pide a_T, la total, el arranque y el instante.
    resuelve: {
      pieza: 'fis-giro',
      generar(sm) {
        const r = azar(sm + 900);
        if (sm % 2 === 0) {
          const [at, ac, phi] = r.de([[4, 3, 37], [3, 4, 53], [8, 6, 37], [6, 8, 53], [12, 9, 37], [9, 12, 53], [16, 12, 37]]);
          return {
            enunciado: ['En un instante, un punto que gira tiene ', MaT, ' = ', pa(`${at} m/s²`), ' y ', Mac, ' = ', pa(`${ac} m/s²`), '. ¿Qué ángulo forma su aceleración total con su velocidad?'],
            datos: [D6.ang, D6.notables, D6.a],
            dibujo: figB6({ objeto: 'punto', muestra: { aT: `${at} m/s²`, ac: `${ac} m/s²`, a: 'a⃗' }, lineas: [['φ = ?']] }),
            pasos: [
              { tipo: 'pide', texto: 'Piden el ángulo φ entre la aceleración total y la velocidad.' },
              { tipo: 'datos', texto: ['A lo largo del giro, la aceleración mide ', pa(`${at} m/s²`), '; hacia el centro, ', pa(`${ac} m/s²`), '.'] },
              { tipo: 'regla', texto: sx('La velocidad va a lo largo del giro, igual que a_T, y a_c es perpendicular. En el triángulo que forman, la tangente de φ es a_c entre a_T.'), ecuacion: ['tan φ = ', { frac: [Mac, MaT] }] },
              { tipo: 'cuentas', texto: 'Reemplazo los datos y busco qué ángulo notable tiene esa tangente.', ecuacion: ['tan φ = ', { frac: [pa(`${ac}`), pa(`${at}`)] }, ` = ${ac / at > 1 ? '4/3' : '3/4'}   →   φ = ${phi}°`] },
              { tipo: 'sentido', texto: ac > at ? 'Tiene sentido: la parte hacia el centro es la mayor, así que la total se inclina hacia el centro, más de 45°.' : 'Tiene sentido: la parte hacia el centro es la menor, así que la total queda más cerca de la velocidad, a menos de 45°.' },
            ],
            respuesta: [neg(`φ = ${phi}°`)],
          };
        }
        const [a, ac] = r.de([[5, 4], [5, 3], [10, 8], [10, 6], [13, 12], [13, 5], [25, 24], [17, 15]]), at = Math.sqrt(a * a - ac * ac);
        return {
          enunciado: ['Un punto que gira tiene una aceleración total de ', pa(`${a} m/s²`), ', y su parte hacia el centro mide ', pa(`${ac} m/s²`), '. ¿Cuánto vale su aceleración tangencial?'],
          datos: [D6.a],
          dibujo: figB6({ objeto: 'punto', muestra: { aT: '?', ac: `${ac} m/s²`, a: `${a} m/s²` } }),
          pasos: [
            { tipo: 'pide', texto: ['Piden ', MaT, ', la parte de la aceleración a lo largo del giro.'] },
            { tipo: 'datos', texto: ['La total mide ', pa(`${a} m/s²`), ' y la parte hacia el centro, ', pa(`${ac} m/s²`), '.'] },
            { tipo: 'regla', texto: 'Las dos partes son perpendiculares, así que la total es la hipotenusa del triángulo que forman.', ecuacion: [cuad(Ma), ' = ', cuad(MaT), ' + ', cuad(Mac)] },
            { tipo: 'cuentas', texto: sx('Paso a_c² al otro lado para tener a_T², y saco la raíz.'), ecuacion: [cuad(MaT), ` = ${a * a} − ${ac * ac} = ${a * a - ac * ac}   →   `, MaT, ' = ', pa(`${f(at)} m/s²`)] },
            { tipo: 'sentido', texto: `Tiene sentido: cada parte es menor que la total, como cada cateto es menor que la hipotenusa; ${f(at)} y ${ac} son menores que ${a}.` },
          ],
          respuesta: [MaT, ' = ', pa(`${f(at)} m/s²`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-giro',
      generar(sm) {
        const r = azar(sm + 29), k = sm % 4;
        if (k === 0) {
          const al = r.de([0.5, 1, 2, 3, 4]), ra = r.de([0.5, 1.5, 2, 3, 4]), at = al * ra;
          return {
            pregunta: ['Un juego que gira arranca con ', pa(`α = ${f(al)} rad/s²`), `. ¿Cuánto vale la aceleración tangencial de un asiento a ${f(ra)} m del eje?`],
            datos: [D6.aT],
            dibujo: figB6({ muestra: { aT: '?' }, lineas: [[`α = ${f(al)} rad/s²`, 'h'], [`r = ${f(ra)} m`]] }),
            opciones: opciones(at, [
              { id: 'div', valor: al / ra, error: 'MC-VR', siFuera: 'Usaste α y r, pero los dividiste. Un asiento más lejos del eje gana más rapidez en cada segundo, así que la tangencial es α por r.' },
              { id: 'cuad', valor: al * ra * ra, error: 'PR-CUADRADO', siFuera: 'α por r está bien, pero el radio va una sola vez. La tangencial crece igual que la distancia al eje, no como su cuadrado.' },
              { id: 'sin-r', valor: al, error: 'AN-SIN-R', siFuera: 'Ese número es α, en rad/s², y es el mismo para todo el juego. La tangencial de un asiento depende de su distancia al eje: falta multiplicar por r.' },
            ], n => `${f(n)} m/s²`),
            solucion: { texto: 'Cada segundo, ω gana α, y el asiento gana α radios de rapidez: la tangencial es α por la distancia al eje.', ecuacion: [MaT, ' = ', pa(f(al)), ` · ${f(ra)} = `, pa(`${f(at)} m/s²`)] },
          };
        }
        if (k === 1) {
          const CASOS = [[3, 4, 2, 1], [3, 4, 4, 4], [6, 8, 4, 2], [6, 8, 8, 8], [5, 12, 6, 3], [12, 5, 5, 5], [8, 6, 6, 6], [4, 3, 3, 3], [9, 12, 6, 3], [12, 16, 8, 4]];
          const [at, ac, vv, ra] = r.de(CASOS), tot = Math.hypot(at, ac);
          return {
            pregunta: ['Un punto gira en una circunferencia de ', `${ra} m de radio. En un instante va a `, pv(`${vv} m/s`), ' y tiene ', MaT, ' = ', pa(`${at} m/s²`), '. ¿Cuánto vale su aceleración total?'],
            datos: [D6.ac, D6.a],
            dibujo: figB6({ objeto: 'punto', muestra: { aT: `${at} m/s²`, ac: 'a_c', a: '?' }, lineas: [[`v = ${vv} m/s`, 'o'], [`r = ${ra} m`]] }),
            opciones: opciones(tot, [
              { id: 'suma', valor: at + ac, error: 'MC-SUMA', siFuera: 'Las dos partes están bien, pero son perpendiculares, así que no se suman sus largos. Se juntan con Pitágoras, como los catetos de un triángulo rectángulo.' },
              { id: 'solo-ac', valor: ac, error: 'MC-SOLO-AC', siFuera: 'Ese número es solo la parte hacia el centro. También gana rapidez, así que falta juntarla con la tangencial.' },
              { id: 'solo-at', valor: at, error: 'MC-SOLO-AT', siFuera: 'Ese número es solo la tangencial. El punto ya tiene rapidez y da vueltas, así que también hay centrípeta, v² entre r.' },
            ], n => `${f(n)} m/s²`),
            solucion: { texto: sx(`Primero la centrípeta: a_c = ${vv}² ÷ ${ra} = ${ac} m/s². Es perpendicular a a_T, así que se juntan con Pitágoras.`), ecuacion: [Ma, ' = ', { raiz: [cuad(pa(`${at}`)), ' + ', cuad(pa(`${ac}`))] }, ' = ', pa(`${f(tot)} m/s²`)] },
          };
        }
        if (k === 2) {
          const [at, ra, t] = r.de([[2, 8, 4], [3, 9, 2], [1, 2, 2], [2, 4, 2], [4, 8, 1], [1, 4, 4], [3, 3, 1], [2, 2, 3]]), vv = at * t, ac = vv * vv / ra, tot = Math.hypot(at, ac);
          return {
            pregunta: ['Un juego que gira arranca del reposo. Un asiento a ', `${ra} m del eje tiene `, MaT, ' = ', pa(`${at} m/s²`), t === 1 ? '. ¿Cuánto vale su aceleración total al cabo de ' : '. ¿Cuánto vale su aceleración total a los ', pt(`${t} s`), '?'],
            datos: [D6.v, D6.ac, D6.a],
            dibujo: figB6({ muestra: { aT: `${at} m/s²`, ac: 'a_c', a: '?' }, lineas: [[`r = ${ra} m`], [`t = ${t} s`, 'i']] }),
            opciones: opciones(tot, [
              { id: 'solo-at', valor: at, error: 'MC-SOLO-AT', siFuera: 'Ese número es la tangencial. A esa hora el asiento ya tiene rapidez, y con ella aparece la aceleración hacia el centro, que hay que juntar con la tangencial.' },
              { id: 'solo-ac', valor: ac, error: 'MC-SOLO-AC', siFuera: 'La centrípeta está bien, pero el juego sigue ganando rapidez, así que la tangencial sigue ahí. Falta juntar las dos con Pitágoras.' },
              { id: 'suma', valor: at + ac, error: 'MC-SUMA', siFuera: 'Las dos partes están bien, pero son perpendiculares, así que no se suman. La total es la diagonal y sale con Pitágoras.' },
              { id: 'v-r', valor: Math.hypot(at, vv / ra), error: 'MC-VR', siFuera: 'Pitágoras y la rapidez de ese instante están bien, pero la centrípeta lleva la rapidez al cuadrado: es v² ÷ r, no v ÷ r.' },
            ], n => `${f(n)} m/s²`),
            solucion: { texto: sx(`Desde el reposo, a los ${t} s va a ${f(vv)} m/s, así que a_c = ${f(vv)}² ÷ ${ra} = ${f(ac)} m/s². Con a_T, Pitágoras.`), ecuacion: [Ma, ' = ', { raiz: [cuad(pa(`${at}`)), ' + ', cuad(pa(f(ac)))] }, ' = ', pa(`${f(tot)} m/s²`)] },
          };
        }
        // Nivel examen: el instante en que a_c iguala a a_T, desde el reposo.
        const [ra, at] = r.de([[4, 1], [9, 1], [8, 2], [18, 2], [16, 1], [12, 3], [1, 4]]), t = Math.sqrt(ra / at);
        return {
          pregunta: ['Un juego que gira arranca del reposo. Un asiento a ', `${ra} m del eje tiene `, MaT, ' = ', pa(`${at} m/s²`), '. ¿En qué instante su aceleración centrípeta mide lo mismo que la tangencial?'],
          datos: [D6.v, D6.ac],
          dibujo: figB6({ muestra: { aT: `${at} m/s²`, ac: 'a_c' }, lineas: [[`r = ${ra} m`], ['t = ?']] }),
          opciones: opciones(t, [
            { id: 'div', valor: ra / at, error: 'MC-SIN-RAIZ', siFuera: 'El despeje está bien, pero ese número es t², no t. Falta sacar la raíz cuadrada para tener el tiempo.' },
            { id: 'inv', valor: at / ra, error: 'AN-INV', siFuera: 'Usaste el radio y la tangencial, pero al revés: t² es el radio entre la tangencial. Después, además, falta sacar la raíz.' },
            { id: 'dos-r', valor: Math.sqrt(2 * ra / at), error: 'MC-SIN-MEDIO', siFuera: 'Ese tiempo saldría con 2r. La centrípeta es v² entre r, sin el 2; el 2 aparece en otras ecuaciones, no en esta.' },
          ], n => `${f(n)} s`),
          solucion: { texto: `Desde el reposo, a los t s va a ${at}t m/s. Su centrípeta, (${at}t)² ÷ ${ra}, se iguala a la tangencial, ${at}, y se despeja t.`, ecuacion: [Mt2, ' = ', { frac: [`${ra}`, `${at}`] }, '   →   ', Mt, ' = ', pt(`${f(t)} s`)] },
        };
      },
    },
  };
  // ======================= Laboratorio: la rueda y el giro, rehechos con fis-giro =======================
  // Las dos mesas vienen de la unidad vieja y conservan sus ids y sus controles (r y deg; v, r y t), para que un caso
  // guardado en la colección siga abriendo igual. Juego libre, sin preguntas: solo retos.
  const MESA_RUEDA_CTRL = [
    { id: 'r', etiqueta: 'Radio, r', min: 1, max: 4, paso: 0.5, inicio: 2, unidad: 'm', decimales: 1 },
    { id: 'deg', etiqueta: 'Gira, θ', color: 'c-f', min: 30, max: 360, paso: 30, inicio: 90, unidad: '°', decimales: 0, auto: { velocidad: 60, modo: 'repite' } },
  ];
  const DISCO_MESA = { tipo: 'disco', c: [160, 112], R: 80 };
  const arcoDe = val => val.r * rad(val.deg);
  function mesaRueda(val) {
    const cu = Object.assign({}, DISCO_MESA, { R: 20 * val.r, giro: val.deg }), a = val.deg;
    return { alto: 224, cuerpos: [cu], puntos: [{ ang: a, tipo: 'punto' }],
      arcos: [{ de: 0, a, texto: `s = ${f(arcoDe(val))} m`, afuera: 18 }, { tipo: 'angulo', de: 0, a, rpx: 16, texto: `${f(a, 0)}°` }],
      radios: [{ ang: 0, texto: `r = ${f(val.r, 1)} m`, lado: -1 }, { ang: a }],
      alt: `Rueda de ${f(val.r, 1)} m de radio que gira ${f(a, 0)}°: el punto del borde recorre ${f(arcoDe(val))} m.` };
  }
  // El menor giro de la grilla cuyo arco pasa de s (el reto pide justo el de la grilla).
  const menorGiro = (r, s) => { const c = MESA_RUEDA_CTRL[1]; for (let d = c.min; d <= c.max; d += c.paso) if (arcoDe({ r, deg: d }) > s) return d; return NaN; };
  const MESA_GIRO_CTRL = [
    { id: 'v', etiqueta: 'Rapidez, v', color: 'c-o', min: 2, max: 4, paso: 0.5, inicio: 3, unidad: 'm/s', decimales: 1 },
    { id: 'r', etiqueta: 'Radio, r', min: 2, max: 4, paso: 1, inicio: 2, unidad: 'm', decimales: 0 },
    { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: 60, paso: 0.1, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1, modo: 'repite' } },
  ];
  const acDe = val => val.v * val.v / val.r;
  const periodoDe = val => 2 * PI * val.r / val.v;
  function mesaGiro(val) {
    const a = 60 + deg(val.v / val.r * val.t);
    return { alto: 240, cuerpos: [{ tipo: 'pista', c: [160, 118], R: 22 * val.r }], puntos: [{ ang: a, tipo: 'moto' }],
      flechas: [{ ang: a, largo: 15 * val.v, texto: 'v⃗' }, { ang: a, dir: 'centro', largo: 5 * acDe(val), color: 'h', texto: 'a⃗_c' }],
      alt: `Una moto da vueltas en un círculo de ${f(val.r, 0)} m a ${f(val.v, 1)} m/s; su aceleración, de ${f(acDe(val))} m/s², apunta al centro.` };
  }

  // Tabla de letras (propuesta §5): un solo significado en la unidad.
  const LETRAS = { s: 'arco que recorre un punto', 'θ': 'ángulo girado, en radianes', r: 'radio: del eje al punto', r_1: 'radio de la primera rueda', r_2: 'radio de la segunda rueda',
    r_B: 'distancia del punto B al eje', R: 'radio de la Tierra', N: 'número de vueltas', T: 'período', f: 'frecuencia', t: 'tiempo',
    'ω': 'velocidad angular', 'ω_0': 'velocidad angular al empezar', 'ω_1': 'velocidad angular de la primera rueda', 'ω_2': 'velocidad angular de la segunda rueda',
    'ω_B': 'velocidad angular de la rueda B', 'ω_C': 'velocidad angular de la rueda C', v: 'rapidez del punto que gira', v_B: 'rapidez del punto B', v_C: 'rapidez del borde de C',
    x: 'coordenada hacia el este', y: 'coordenada hacia el norte',
    'α': 'aceleración angular', a_c: 'aceleración centrípeta', a_T: 'aceleración tangencial', a: 'aceleración total', 'λ': 'latitud', 'φ': 'ángulo entre a⃗ y v⃗' };

  return {
    unidad: 'fisica.movimiento-circular',
    version: '0.3.0',
    // Pasó el lector en frío y el auditor (19 nov): calidad 2, y el validador común lo exige.
    calidad: 2,
    estado: 'completa',
    colores: COLORES,
    // En una curva la velocidad es un vector: desde la idea B4 se escribe v⃗ (y a⃗, Δv⃗). v sin flecha es la rapidez.
    notacion: { vectores: true, motivo: 'En una curva la velocidad es un vector, v⃗, que gira con el cuerpo; v sin flecha es la rapidez, su largo.' },
    letras: LETRAS,
    requiere: ['/nucleo/kit/piezas/fis-giro.js'],
    // Glosario del giro (docs/teoria.md, 4d): las once palabras que vinieron de «Movimiento parabólico y circular»
    // (partición partidoPC) y cuatro nuevas (arco, transmisión, cambio de velocidad y aceleración total). Velocidad,
    // rapidez y MRU vienen de Movimiento rectilíneo uniforme; aceleración y MRUV, de MRUV y caída libre; vector, de
    // Vectores; tangente, de Movimiento parabólico: el lector las marca «se explica en…». El radián se presenta también en
    // Trigonometría (Ángulo trigonométrico), que es otro curso: aquí va como herramienta del giro.
    // Ningún ejemplo responde una Predice: ninguno da los radianes de la vuelta entera (B1), los 0,5 s del ventilador
    // (B2), las vueltas del piñón (B3), hacia dónde apunta la aceleración del MCU (B4), los 18 rad (B5) ni qué
    // aceleración le queda al carrusel que gira parejo (B6).
    glosario: [
      { termino: 'radián', simbolo: 'rad', formas: ['radián', 'radianes'],
        def: 'Unidad de ángulo: el ángulo cuyo arco mide lo mismo que el radio.',
        simple: 'Girar hasta que el borde recorra un camino tan largo como el radio.',
        ejemplos: ['Un ángulo de 2 rad abarca un arco de dos radios.', 'Un radián son unos 57°.', 'Con radio 8 m, un arco de 4 m abarca medio radián.'],
        ver: ['desplazamiento angular', 'arco'] },
      { termino: 'desplazamiento angular', simbolo: 'θ', medida: 'rad', formas: ['desplazamiento angular', 'desplazamientos angulares'],
        def: 'Cuánto gira un cuerpo alrededor de su eje. En radianes, es el arco dividido entre el radio.',
        simple: 'Cuánto ha girado algo, como la aguja de un reloj.',
        ejemplos: ['La aguja que pasa de las 12 a las 3 gira un cuarto de vuelta.', 'Tu cabina, que sube del piso a lo más alto, gira media vuelta.', 'Un ventilador que gira 10 rad.'],
        ver: ['radián'] },
      { termino: 'arco', simbolo: 's', medida: 'm', formas: ['arco', 'arcos'],
        def: 'Trozo de circunferencia entre dos puntos. En un giro, es el camino que recorre un punto.',
        simple: 'El camino curvo de un punto que gira, como la punta de una aguja.',
        ejemplos: ['El camino de tu cabina en la rueda de la fortuna.', 'La soga que se enrolla en un torno mide lo que el arco de su borde.', 'Un punto a 3 m del eje que gira 2 rad recorre un arco de 6 m.'],
        ver: ['radián'] },
      { termino: 'MCU', formas: ['MCU'],
        def: 'Movimiento circular uniforme: gira siempre igual de rápido, así que cada vuelta tarda lo mismo.',
        simple: 'Dar vueltas siempre igual de rápido, como el segundero de un reloj.',
        ejemplos: ['La rueda de la fortuna que gira pareja.', 'El segundero de un reloj.', 'Un ventilador ya prendido, que no cambia de velocidad.'],
        ver: ['período', 'velocidad angular'] },
      { termino: 'período', simbolo: 'T', medida: 's', formas: ['período', 'períodos', 'periodo', 'periodos'],
        def: 'Tiempo que tarda una vuelta completa, o un ciclo que se repite.',
        simple: 'Lo que tarda una vuelta: el segundero tarda un minuto.',
        ejemplos: ['Una rueda que da una vuelta cada 20 s: T = 20 s.', 'El segundero: 60 s.', 'La Tierra sobre su eje: unas 24 h.'],
        ver: ['frecuencia'] },
      { termino: 'frecuencia', simbolo: 'f', medida: 'Hz', formas: ['frecuencia', 'frecuencias'],
        def: 'Cuántas vueltas o ciclos se completan en cada segundo. Se mide en hertz (Hz).',
        simple: 'Cuántas vueltas da algo en cada segundo, como las aspas de un ventilador.',
        ejemplos: ['Un ventilador que da 5 vueltas por segundo: 5 Hz.', 'Un tocadiscos a 45 rpm da 0,75 vueltas por segundo.', '60 rpm es 1 Hz.'],
        ver: ['período'] },
      { termino: 'velocidad angular', simbolo: 'ω', medida: 'rad/s', formas: ['velocidad angular', 'velocidades angulares'],
        def: 'Cuánto ángulo gira un cuerpo en cada segundo, en radianes por segundo.',
        simple: 'Qué tan rápido gira algo, en radianes por segundo, como una licuadora.',
        ejemplos: ['Una rueda que gira 3 rad cada segundo: ω = 3 rad/s.', 'El segundero gira π/30 rad/s.', 'Todos los puntos de un mismo disco tienen la misma ω.'],
        ver: ['velocidad tangencial', 'aceleración angular'] },
      { termino: 'velocidad tangencial', simbolo: 'v', medida: 'm/s', formas: ['velocidad tangencial', 'velocidades tangenciales'],
        def: 'La velocidad de un punto que gira: apunta a lo largo del círculo y mide ω · r.',
        simple: 'Qué tan rápido avanza un punto que da vueltas, como un caballo del carrusel.',
        ejemplos: ['ω = 2 rad/s a 3 m del eje: v = 6 m/s.', 'La punta del aspa de un ventilador va más rápido que el centro.', 'El barro sale de la llanta en la dirección de su velocidad tangencial.'],
        ver: ['velocidad angular', 'transmisión'] },
      { termino: 'transmisión', formas: ['transmisión', 'transmisiones'],
        def: 'Pasar el giro de una rueda a otra con una faja, una cadena, un contacto o un mismo eje.',
        simple: 'Cómo una rueda hace girar a otra, como la cadena de la bicicleta.',
        ejemplos: ['La cadena de la bicicleta lleva el giro de los pedales a la rueda.', 'La faja del motor de un auto mueve otras poleas.', 'Dos ruedas dentadas en contacto giran en sentidos contrarios.'],
        ver: ['velocidad tangencial'] },
      { termino: 'cambio de velocidad', simbolo: 'Δv⃗', medida: 'm/s', formas: ['cambio de velocidad', 'cambios de velocidad'],
        def: 'La resta de dos velocidades, como flechas: Δv⃗ = v⃗₂ − v⃗₁.',
        simple: 'Cuánto y hacia dónde cambió la velocidad, como al rebotar una pelota.',
        ejemplos: ['Una combi que pasa de 10 m/s a 14 m/s, en línea recta: 4 m/s.', 'Una pelota que llega a 5 m/s y rebota a 5 m/s: 10 m/s.', 'Se dibuja de la punta de v⃗₁ a la punta de v⃗₂.'],
        ver: ['aceleración centrípeta'] },
      { termino: 'aceleración centrípeta', simbolo: 'a_c', medida: 'm/s²', formas: ['aceleración centrípeta', 'aceleraciones centrípetas', 'centrípeta'],
        def: 'La aceleración que cambia la dirección de la velocidad de algo que gira. Mide v²/r, u ω² · r.',
        simple: 'La aceleración que hace doblar a un auto en una curva.',
        // Sin el caso de Predice de B4 (una moto que da vueltas siempre a la misma rapidez): auditoría del 19 nov, A1.
        ejemplos: ['En las sillas voladoras, a 6 m/s y a 9 m del eje: 4 m/s².', 'Más rapidez, o una curva más cerrada, la hacen mayor.', 'El tambor de una lavadora que centrifuga la tiene muy grande.'],
        ver: ['cambio de velocidad', 'aceleración tangencial'] },
      { termino: 'MCUV', formas: ['MCUV'],
        def: 'Movimiento circular uniformemente variado: la velocidad angular cambia lo mismo en cada segundo.',
        simple: 'Girar cada vez más rápido, o más lento, como un ventilador que arranca.',
        ejemplos: ['Un ventilador que arranca parejo.', 'Una licuadora que frena pareja al apagarla.', 'Un carrusel que arranca.'],
        ver: ['aceleración angular'] },
      { termino: 'aceleración angular', simbolo: 'α', medida: 'rad/s²', formas: ['aceleración angular', 'aceleraciones angulares'],
        def: 'Cuánto cambia la velocidad angular en cada segundo.',
        simple: 'Cuánto más rápido gira algo en cada segundo, como un ventilador al prenderlo.',
        ejemplos: ['De 0 a 6 rad/s en 3 s: α = 2 rad/s².', 'Si frena, α es negativa.', 'Un esmeril que gana 5 rad/s cada segundo: α = 5 rad/s².'],
        ver: ['MCUV', 'aceleración tangencial'] },
      { termino: 'aceleración tangencial', simbolo: 'a_T', medida: 'm/s²', formas: ['aceleración tangencial', 'aceleraciones tangenciales'],
        // Sin la clave de Predice de B6 (lo que queda si la rapidez ya no cambia): auditoría del 19 nov, A1.
        def: 'La parte de la aceleración que va a lo largo del giro, tangente al círculo. Mide α · r.',
        simple: 'La aceleración a lo largo del giro, como la del carrusel que arranca.',
        ejemplos: ['α = 1 rad/s² a 2 m del eje: la tangencial mide 2 m/s².', 'Al arrancar un carrusel, apunta hacia adelante.', 'Al frenar, apunta hacia atrás.'],
        ver: ['aceleración total', 'aceleración centrípeta'] },
      { termino: 'aceleración total', simbolo: 'a', medida: 'm/s²', formas: ['aceleración total', 'aceleraciones totales'],
        def: 'La aceleración entera de un punto que gira: junta la tangencial y la centrípeta, que son perpendiculares.',
        simple: 'Las dos aceleraciones juntas como flechas: la diagonal de su rectángulo.',
        ejemplos: ['Con 3 m/s² de tangencial y 4 m/s² de centrípeta, la total mide 5 m/s².', 'Es la diagonal del rectángulo que forman sus dos partes.', 'Se halla con Pitágoras, no sumando.'],
        ver: ['aceleración tangencial'] },
    ],
    // Laboratorio: juego libre, sin preguntas.
    laboratorio: [
      { id: 'rueda', titulo: 'El arco de la rueda', pieza: 'fis-giro',
        consigna: 'La rueda gira sola. Cambia el radio y mira el arco que recorre el punto del borde.',
        voz: 'Duplica el radio sin cambiar el ángulo. ¿Qué pasa con el arco?',
        controles: MESA_RUEDA_CTRL,
        dibujo: val => giroF(mesaRueda(val)),
        lectura: val => ['Gira ', ps(`${f(rad(val.deg))} rad`), ': el arco mide ', ps(`${f(arcoDe(val))} m`)],
        minimo: 3,
        invitaciones: [
          { texto: 'Consigue un arco de justo 2π m, unos 6,28 m.',
            logrado: val => Math.abs(arcoDe(val) - 2 * PI) < 1e-9,
            bien: 'Radio 2 y media vuelta, o radio 4 y un cuarto: s = θ · r.' },
          { texto: 'Con radio 4 m, busca el menor giro que recorra más de 10 m.',
            logrado: val => val.r === 4 && Math.abs(val.deg - menorGiro(4, 10)) < 1e-9,
            bien: 'Con 150°, el arco ya mide más de dos radios y medio, unos 10,5 m.' },
          { texto: 'Guarda dos casos con el mismo arco y distinto radio.',
            logrado: (val, guardados) => guardados.some(x => x.r !== val.r && Math.abs(arcoDe(x) - arcoDe(val)) < 1e-9)
              && guardados.some(x => x.r === val.r && x.deg === val.deg),
            bien: 'Mismo arco: la rueda grande gira menos. ¿Cuánto menos, si el radio es el doble?' },
          { texto: 'Haz que el ángulo girado pase de 6 radianes.',
            logrado: val => rad(val.deg) > 6,
            bien: 'Una vuelta entera son 2π radianes: un poco más de 6,28.' },
        ] },
      { id: 'giro', titulo: 'Rapidez fija, flecha que gira', pieza: 'fis-giro',
        consigna: 'La moto gira sola, con rapidez fija. Elige la rapidez y el radio, y mira hacia dónde apuntan sus dos flechas.',
        voz: 'Prueba la misma rapidez en un círculo más chico.',
        controles: MESA_GIRO_CTRL,
        dibujo: val => giroF(mesaGiro(val)),
        lectura: val => ['Siempre a ', pv(`${f(val.v, 1)} m/s`), '; hacia el centro, ', pa(`${f(acDe(val))} m/s²`)],
        minimo: 3,
        invitaciones: [
          { texto: 'Haz que la aceleración centrípeta valga justo 2 m/s².',
            logrado: val => Math.abs(acDe(val) - 2) < 1e-9,
            bien: 'v² entre r da justo 2. ¿Qué pasa si duplicas la rapidez?' },
          { texto: 'Consigue una aceleración centrípeta de más de 7 m/s².',
            logrado: val => acDe(val) > 7,
            bien: 'Mucha rapidez en un giro cerrado da mucha aceleración, porque v² entre r crece rápido.' },
          { texto: 'Haz que una vuelta completa dure menos de 3,2 s.',
            logrado: val => periodoDe(val) < 3.2,
            bien: 'Ese tiempo de una vuelta es el período: 2πr entre v.' },
          { texto: 'Guarda dos casos con la misma rapidez y distinta aceleración.',
            logrado: (val, guardados) => guardados.some(x => x.v === val.v && Math.abs(acDe(x) - acDe(val)) > 1e-9)
              && guardados.some(x => x.v === val.v && x.r === val.r),
            bien: 'La rapidez no cambia y aun así acelera: lo decide qué tan cerrado es el giro.' },
        ] },
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov).
    laboratorioIdeas: {
      'rueda': ['arco-y-radian'],
      'giro': ['rapidez-constante-acelera'],
    },
    ideas: [arcoB1, periodo, tangencial, centripeta, mcuvIdea, total],
  };
});
