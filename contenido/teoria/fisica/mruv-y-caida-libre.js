/*
 * Teoría de «MRUV y caída libre» (fisica.mruv-y-caida-libre), para 5.º de secundaria y preuniversitario. Unidad nueva
 * del 18 nov: sale de «MRU, MRUV y caída libre», que Gerson aprobó partir en dos (docs/etapa4/decisiones.md;
 * docs/etapa4/propuesta-fisica.md, parte B, con todas sus recomendaciones). La unidad vieja conserva su id como
 * «Movimiento rectilíneo uniforme» (contenido/teoria/fisica/movimiento-rectilineo.js). Avance.migrar (nucleo/avance.js,
 * partición partidoMRU) pasa a esta unidad lo hecho en `pendiente-aceleracion` y `caida-libre`, las mesas
 * `pista-libre`, `ida-vuelta` y `recta-vt`, la visita, «Ya la estudié» y las palabras «aceleración», «caída libre» y
 * «gravedad». Esos ids no cambian.
 *
 * Las seis ideas de la propuesta (B1–B6), en orden, todas con el método (B1 en la fase 2, con el visto bueno de Gerson;
 * B2 a B6 en la fase 3, 18 nov); la unidad declara calidad: 2:
 *   B1 `aceleracion` «La aceleración» ............ la combi que arranca del paradero (fis-combi).
 *   B2 `ecuaciones-mruv` «Las ecuaciones del MRUV»  la combi que frena frente al colegio (fis-combi).
 *   B3 `pendiente-aceleracion` «La gráfica velocidad–tiempo»: el atleta en los 100 m con su v–t (fis-mruv «pista»).
 *   B4 `graficas-xt-at` «Gráficas x–t y a–t» ...... el mototaxi y la combi que lo alcanza, y las tres gráficas (fis-mruv
 *      «alcance» y «tres»).
 *   B5 `caida-reposo` «Caída libre desde el reposo» la regla que se atrapa (fis-mruv «regla») y la canica y la piedra.
 *   B6 `caida-libre` «Lanzamiento vertical» ....... la pelota junto al pabellón (fis-mruv «pabellon»).
 * fis-mruv es una pieza de prueba nueva (data-prueba): Gerson decide después cuáles de sus dibujos reemplaza.
 *
 * Ficha de tarea (diseno-y-animacion), idea B1:
 *   Promesa: la flecha de la velocidad cambia lo mismo cada segundo; eso que cambia, con su signo, es la aceleración.
 *   Persona y condiciones: 5.º de secundaria o preuniversitario, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: calcula a = Δv/Δt con su signo, también si la combi frena sin cambiar de sentido.
 *   Orden de atención: 1.º la combi y su flecha · 2.º las combis tenues con sus flechas · acción: el botón fijo.
 *   Estados: juego sin tocar · misión cumplida · predicción pendiente · coincide / no coincide · caso nuevo · «No sé».
 *   Duda que resuelve: ¿la aceleración va hacia donde se mueve la combi? (No: va hacia donde cambia su velocidad.)
 * Objeto de la primera pantalla: la combi que arranca del paradero, con la flecha de su velocidad que crece cada segundo
 * y sus marcas que se abren; pieza fis-combi, vista «avenida» con `a`, `crece` y `flechaA` (dibujo de prueba, 18 nov).
 *
 * Letras (propuesta §5): x posición con signo desde el paradero; v la velocidad con signo y v₀ la del inicio («rapidez»
 * es v sin su signo); t el tiempo desde que arranca el reloj (Δt un intervalo); Δv = v − v₀ lo que cambió la velocidad;
 * a la aceleración con signo y a_m la aceleración media; g la gravedad (B5, B6); y, h la altura (B5, B6).
 * NOTACIÓN: SIN MAGNITUDES VECTORIALES (decisiones, 18 nov; propuesta, pregunta 3). En una recta, v, a y Δx son números
 *   con signo sobre el eje: el signo hace de flecha, así que no llevan «⃗». La flecha se dibuja sobre la combi (la de v
 *   con su rapidez, la de a con otra punta) y el eje siempre lleva su «+». Lo declara def.notacion.
 * REGLA DE COLORES (iguales en las dos unidades del movimiento rectilíneo; docs/molde-unidad.md §5b; tabla COLORES,
 *   def.colores): un color fijo por magnitud, el mismo en el juego, la figura, la fórmula, los datos, los ejemplos y
 *   «Ahora tú», y la respuesta en el color de su magnitud:
 *   - naranja (c-o): la velocidad y la rapidez (v, v₀, Δv, también en km/h), los tramos de cada segundo y su flecha;
 *   - turquesa (c-i): el tiempo (t, Δt, los rótulos «0 s, 1 s…» y el reloj);
 *   - violeta (c-f): la posición, el desplazamiento y la altura (x, Δx, y, h; el área bajo v–t);
 *   - carmín (c-h): la aceleración y g (a, a_m, su flecha de punta abierta, la línea a–t);
 *   - tinta: la distancia recorrida, la regla, la avenida, los vehículos y lo que se pide en una figura («?»).
 *   Sin verde: iría junto al naranja de v (protanopía: 0,010). El par naranja–carmín (v con a) es el más débil que el
 *   molde acepta (0,062): a siempre lleva su letra y su flecha de punta abierta.
 * Errores de B2 a B6 (los mismos informes; los nuevos son hipótesis de diseño): PR1-frenado, MRUV-FRENO-IGUAL, MRUV-VT,
 *   MRUV-TIEMPO, MRUV-SIGNO-D, DX-RECT, DX-SEMI, DX-INICIAL, MRUV-ACEL, MRU-X0, MRUV-MEDIO, MRUV-SIN-A, MRUV-MEDIO-A,
 *   MRUV-POSICION, MRUV-POSICION-FINAL, MRUV-DESDE-0 (B2); DX-SUMA, DX-IDA, DX-ALTURA, DX-RESTA, DX-TRIANGULO, G4,
 *   MRUV-MITAD, MRUV-SOLO-ACELERA, MRUV-DIVIDE, MRUV-LEE-PUNTO, MRUV-ORIGEN (B3); K1-a, K1-b, MRUV-NUNCA, G3, G-SENTIDO,
 *   G4-medio, DX-TRAMO, K-ALC-PERSEGUIDOR, K-ALC-D (B4); C2, C2-suave, C2-liviano, C-MEDIO, C-VELOCIDAD, C-LINEAL, C-RAIZ,
 *   C-TIEMPO, C-JUNTAS, C-RESTA-ALTURAS, C-SIN-SONIDO, C-SOLO-SONIDO, C-VUELTA, C-ENESIMO (B5); C1, K3, C-ALTURA, C-AREA,
 *   C-SOLTAR, C-SUBIDA, C-ENC-MITAD, C-ENC-CAIDA (B6). U1-kmh y K-SIGNO, K-TIEMPO, K-CUADRADO, K-SINDIV, K4 vienen de B1.
 * Errores de la idea B1 (docs/investigacion/cinematica-ideas-erroneas.md; los «nuevo» son hipótesis de diseño):
 *   K3 la aceleración va hacia donde se mueve · K4 divide la velocidad final entre el tiempo, sin restar la inicial ·
 *   K-A0 sin cambio de sentido no hay aceleración · K-SIGNO cambia el signo de a · K-TIEMPO (nuevo) da la velocidad
 *   después de un solo segundo · K-CUADRADO eleva t al cuadrado · K-SINDIV (nuevo) da Δv sin dividir entre Δt ·
 *   K-SUMA (nuevo) suma las velocidades · K-POR (nuevo) multiplica el cambio por el tiempo · MED-PROMEDIO-A (nuevo)
 *   promedia las aceleraciones de los tramos · MED-TRAMO (nuevo) da la aceleración de otro tramo · U1-kmh usa km/h como m/s
 *   (docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md).
 *
 * Molde: docs/teoria.md y docs/molde-unidad.md. Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 2),
 * docs/etapa4/propuesta-fisica.md y docs/teoria/fuentes/historia-ecuaciones.pdf.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const fm = n => f(n, 2);   // con «−» de verdad y coma decimal (Kit.formatear)
  // Azar con semilla para «Ahora tú» (el mismo de nucleo/azar.js, en corto).
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = l => l[r.ent(0, l.length - 1)];
    return r;
  }
  // Opciones distintas: la correcta primero; los distractores que repiten un valor se descartan.
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops;
  }

  // Gesto directo (docs/teoria.md §4): la manija vive en las coordenadas de la figura; mover la convierte en valores
  // con la inversa lineal de la escala de la pieza, y el lector los ajusta al paso y al rango de su control.
  const inversa = (escala, a, b) => px => a + (px - escala(a)) * (b - a) / (escala(b) - escala(a));
  const EJES = () => Kit.piezas.ejes;

  // Un color fijo por magnitud (cabecera y COLORES): cada ficha dice su magnitud en m; lo comprueba el .test.js.
  const Mv = { v: 'c-o', t: 'v', m: 'velocidad' }, Mt = { v: 'c-i', t: 't', m: 'tiempo' }, Ma = { v: 'c-h', t: 'a', m: 'aceleración' };
  const Mx = { v: 'c-f', t: 'x', m: 'posición' };
  const Mv0 = { sub: [Mv, '0'] }, Mam = { sub: [Ma, 'm'] }, Mdv = ['Δ', Mv], Mdt = ['Δ', Mt], Mdx = ['Δ', { v: 'c-f', t: 'x', m: 'desplazamiento' }];
  const pv = s => ({ v: 'c-o', t: String(s), m: 'velocidad' }), pt = s => ({ v: 'c-i', t: String(s), m: 'tiempo' });
  const pa = s => ({ v: 'c-h', t: String(s), m: 'aceleración' }), px = s => ({ v: 'c-f', t: String(s), m: 'posición' });
  const pdx = s => ({ v: 'c-f', t: String(s), m: 'desplazamiento' });
  const neg = l => ({ negrita: [l] });
  const COMBI = () => Kit.piezas['fis-combi'];
  const PARADERO = [{ en: 0, texto: 'Paradero' }];
  const avenida = (d, estado = {}) => ({ pieza: 'fis-combi', datos: Object.assign({ vista: 'avenida' }, d), estado });
  // La regla de metros de una figura: hasta dónde llega y cada cuánto lleva número (la misma de la unidad del MRU).
  const regla = (min, max) => { const L = max - min; return L <= 140 ? { min, max, paso: 10, numero: 20 } : L <= 200 ? { min, max, paso: 10, numero: 50 }
    : L <= 300 ? { min, max, paso: 25, numero: 50 } : L <= 600 ? { min, max, paso: 50, numero: 100 } : { min, max, paso: 250, numero: 500 }; };
  const ms = n => `${fm(n)} m/s`, ms2 = n => `${fm(n)} m/s²`;

  // Datos de cada ejercicio (contrato, punto 13): herramientas, nunca el paso hecho. La fórmula general (a = Δv/Δt, de
  // donde se despeja lo que se pide), el eje con su signo y las equivalencias; ningún atajo ni consejo.
  const DA = {
    acel: ['Aceleración: ', Ma, ' = ', { frac: [Mdv, Mdt] }, ', con ', Mdv, ' = ', Mv, ' − ', Mv0],
    eje: '+ hacia la derecha y − hacia la izquierda.',
    kmh: '1 km = 1000 m y 1 h = 3600 s',
    media: ['Aceleración media de un tramo: ', Mam, ' = ', { frac: [Mdv, Mdt] }, ', con el Δv y el Δt de ese tramo'],
    vt: ['Velocidad con aceleración constante: ', Mv, ' = ', Mv0, ' + ', Ma, ' · ', Mt],
  };

  // ---------- Idea 1 (B1): la aceleración (18 nov, contrato «se entiende sin profesor») ----------
  // Pieza fis-combi, vista «avenida» con aceleración: la combi que arranca del paradero y la flecha de su velocidad,
  // que crece cada segundo. Cambia: con qué velocidad sale y cuánto acelera · Permanece: el paradero en x = 0 y la regla ·
  // Progresa: el reloj, que deja una combi tenue con su flecha en cada segundo · Se reserva: frenar (a contra v), solo en
  // Predice y Mira · Debe verse: la flecha crece lo mismo cada segundo y los tramos se abren.
  const T_B1 = 4, REGLA_B1 = regla(0, 80);
  const juegoB1 = val => {
    const tt = Math.min(val.t, T_B1), vt = val.v0 + val.a * tt;
    return avenida(Object.assign({}, REGLA_B1, { x0: 0, v: val.v0, a: val.a, t: tt, segundos: T_B1, crece: true, lugares: PARADERO,
      flechaTexto: `${f(vt, 1)} m/s` }));
  };
  // Predice y Mira: la combi que va a 20 m/s y frena hasta 8 m/s en 4 s (a = −3 m/s²), lo que el juego no mostró.
  const PRED_B1 = Object.assign({}, REGLA_B1, { x0: 0, v: 20, signo: true, crece: true, lugares: PARADERO });
  const MIRA_B1 = Object.assign({}, PRED_B1, { a: -3, segundos: 4, flechaA: { texto: 'a' } });

  // Ejemplos resueltos de B1 (pestaña «Ejemplos»). Cuentas rehechas con un script aparte que no usa este archivo
  // (scratchpad e4-mruv/cuentas-b1.js, 18 nov): 10/5; 3 + 2·5; (0 − 15)/5; (10 − 0)/2,5; (7 − 4)/1 = (13 − 4)/3;
  // 54/3,6 y 15/5; 72/3,6, 36/3,6 y (10 − 20)/4; 18 − 2·6 y 18/2; 14 − 1,5·6; (−16 − (−10))/3;
  // 36/3,6, 72/3,6, 10/4, (20 − 10)/5 y 20/9; (0 − 0)/18, 15/18 y (3 + 0 − 5)/3; (−10 − (−25))/5; v = 18 − 3t con
  // v = 0; 90/3,6, 25/10, 2,5·4 y 10·3,6. Las figuras muestran lo que cada dato marca por sí solo (la velocidad de
  // partida, la aceleración dada, un lugar con nombre), nunca lo que sale de juntarlos (molde §3, 18 nov).
  // Al empezar, sin nada que comparar entre segundos: la flecha de v con su largo fijo, que se lee mejor que una corta.
  const fig = d => avenida(Object.assign({ x0: 0, segundos: 0, rotulos: false }, d));
  const EJEMPLOS_ACEL = [
    { nivel: 1, titulo: 'Arranca del paradero',
      figura: fig(Object.assign(regla(0, 60), { v: 0, lugares: PARADERO })),
      enunciado: ['Una combi arranca del paradero y acelera parejo: a los ', pt('5 s'), ' va a ', pv('10 m/s'), '. ¿Cuál es su aceleración?'],
      datos: [DA.acel, DA.eje],
      solucion: [{ texto: ['Sale del reposo, ', Mv0, ' = 0, y gana 10 m/s en 5 s.'], ecuacion: [Ma, ' = ', { frac: [[pv('10'), ' − 0'], pt('5')] }, ' = ', pa('2 m/s²')] }],
      respuesta: [pa('a = 2 m/s²'), ': gana 2 m/s cada segundo'] },
    { nivel: 1, titulo: 'La velocidad 5 s después',
      figura: fig(Object.assign(regla(0, 80), { v: 3, a: 2, flechaA: { texto: '2 m/s²' }, lugares: [{ en: 0, texto: 'Grifo' }] })),
      enunciado: ['Una combi pasa por el grifo a ', pv('3 m/s'), ' y acelera con ', pa('a = 2 m/s²'), '. ¿Qué velocidad tiene ', pt('5 s'), ' después?'],
      datos: [DA.acel, DA.eje],
      solucion: [{ texto: ['Cada segundo gana 2 m/s: en 5 s gana 10 m/s, que se suman a los 3 m/s del grifo.'], ecuacion: [Mv, ' = ', pv('3'), ' + ', pa('2'), ' · ', pt('5'), ' = ', pv('13 m/s')] }],
      respuesta: [pv('v = 13 m/s')] },
    { nivel: 1, titulo: 'Frena hasta parar',
      figura: fig(Object.assign(regla(0, 60), { v: 15, signo: true })),
      enunciado: ['Una combi va a ', pv('15 m/s'), ' hacia la derecha y frena parejo hasta detenerse en ', pt('5 s'), '. ¿Cuál es su aceleración?'],
      datos: [DA.acel, DA.eje],
      solucion: [{ texto: ['Termina quieta: ', Mv, ' = 0. El cambio es la final menos la inicial, y sale negativo.'], ecuacion: [Ma, ' = ', { frac: [['0 − ', pv('15')], pt('5')] }, ' = ', pa('−3 m/s²')] }],
      respuesta: [pa('a = −3 m/s²'), ': apunta hacia la izquierda'] },
    { nivel: 1, titulo: '¿Cuánto tarda?',
      figura: fig(Object.assign(regla(0, 60), { v: 0, a: 2.5, flechaA: { texto: '2,5 m/s²' }, lugares: PARADERO })),
      enunciado: ['Una combi arranca del paradero con ', pa('a = 2,5 m/s²'), '. ¿Cuánto tarda en llegar a ', pv('10 m/s'), '?'],
      datos: [DA.acel, DA.eje],
      solucion: [{ texto: ['Tiene que ganar 10 m/s y gana 2,5 m/s cada segundo. Se despeja ', Mdt, '.'], ecuacion: [Mdt, ' = ', { frac: [[pv('10'), ' − 0'], pa('2,5')] }, ' = ', pt('4 s')] }],
      respuesta: ['Tarda ', pt('4 s')] },
    { nivel: 1, titulo: 'Lo que marca el velocímetro',
      figura: fig(Object.assign(regla(0, 60), { v: 4, lugares: PARADERO })),
      enunciado: ['El velocímetro de una combi marca ', pv('4'), ', ', pv('7'), ', ', pv('10'), ' y ', pv('13 m/s'), ' a los ', pt('0'), ', ', pt('1'), ', ', pt('2'), ' y ', pt('3 s'), '. ¿Cuál es su aceleración?'],
      datos: [DA.acel, DA.eje],
      solucion: [{ texto: 'En cada segundo la velocidad sube lo mismo: 3 m/s. Con los extremos da igual:', ecuacion: [Ma, ' = ', { frac: [[pv('13'), ' − ', pv('4')], pt('3')] }, ' = ', pa('3 m/s²')] }],
      respuesta: [pa('a = 3 m/s²')] },
    { nivel: 2, titulo: 'Arranque en km/h',
      figura: fig(Object.assign(regla(0, 60), { v: 0, lugares: PARADERO })),
      enunciado: ['Una combi arranca del paradero y, ', pt('5 s'), ' después, su velocímetro marca ', pv('54 km/h'), '. ¿Cuál es su aceleración en m/s²?'],
      datos: [DA.acel, DA.kmh, DA.eje],
      solucion: [
        { texto: 'Primero, la velocidad en m/s:', ecuacion: [pv('54 km/h'), ' = ', { frac: ['54 000 m', '3600 s'] }, ' = ', pv('15 m/s')] },
        { texto: 'Después, el cambio entre el tiempo:', ecuacion: [Ma, ' = ', { frac: [[pv('15'), ' − 0'], pt('5')] }, ' = ', pa('3 m/s²')] },
      ],
      respuesta: [pa('a = 3 m/s²')] },
    { nivel: 2, titulo: 'Frenar en km/h',
      figura: fig(Object.assign(regla(0, 140), { v: 20, flechaTexto: '72 km/h', signo: true })),
      enunciado: ['Una combi va a ', pv('72 km/h'), ' hacia la derecha y frena parejo: ', pt('4 s'), ' después va a ', pv('36 km/h'), '. ¿Cuál es su aceleración?'],
      datos: [DA.acel, DA.kmh, DA.eje],
      solucion: [
        { texto: 'Las dos velocidades a m/s:', ecuacion: [pv('72 km/h'), ' = ', pv('20 m/s'), ';   ', pv('36 km/h'), ' = ', pv('10 m/s')] },
        { texto: 'La velocidad baja: el cambio es negativo.', ecuacion: [Ma, ' = ', { frac: [[pv('10'), ' − ', pv('20')], pt('4')] }, ' = ', pa('−2,5 m/s²')] },
      ],
      respuesta: [pa('a = −2,5 m/s²')] },
    { nivel: 2, titulo: '¿Cuándo se detiene?',
      figura: fig(Object.assign(regla(-20, 100), { v: 18, signo: true })),
      enunciado: ['Una combi va a ', pv('18 m/s'), ' hacia la derecha y frena perdiendo 2 m/s cada segundo. ¿Qué velocidad tiene a los ', pt('6 s'), '? ¿Cuándo se detiene?'],
      datos: [DA.acel, DA.eje],
      solucion: [
        { texto: ['Pierde 2 m/s cada segundo: ', pa('a = −2 m/s²'), '. A los 6 s:'], ecuacion: [Mv, ' = ', pv('18'), ' + (', pa('−2'), ') · ', pt('6'), ' = ', pv('6 m/s')] },
        { texto: ['Se detiene cuando ', Mv, ' = 0: tiene que perder los 18 m/s.'], ecuacion: [Mdt, ' = ', { frac: [['0 − ', pv('18')], pa('−2')] }, ' = ', pt('9 s')] },
      ],
      respuesta: [pv('6 m/s'), ' a los 6 s; se detiene a los ', pt('9 s')] },
    { nivel: 2, titulo: '¿A qué velocidad pasó?',
      // Solo el grifo, sin la regla de metros: en la unidad el 0 es el paradero, y dónde queda el grifo saldría de juntar
      // los datos (fase 3, 18 nov). Pieza fis-mruv, vista «combi».
      figura: { pieza: 'fis-mruv', datos: { vista: 'combi', lugar: 'Grifo', v: { texto: '14 m/s' }, a: { texto: '1,5 m/s²' } } },
      enunciado: ['Una combi acelera con ', pa('a = 1,5 m/s²'), ' y pasa por el grifo a ', pv('14 m/s'), '. ¿Con qué velocidad pasó por el paradero, ', pt('6 s'), ' antes?'],
      datos: [DA.acel, DA.eje],
      solucion: [
        { texto: ['En esos 6 s ganó lo mismo cada segundo:'], ecuacion: [Mdv, ' = ', pa('1,5'), ' · ', pt('6'), ' = ', pv('9 m/s')] },
        { texto: ['En el grifo iba a 14 m/s, así que antes iba 9 m/s más lento.'], ecuacion: [Mv0, ' = ', pv('14'), ' − ', pv('9'), ' = ', pv('5 m/s')] },
      ],
      respuesta: [pv('v₀ = 5 m/s')] },
    { nivel: 2, titulo: 'Más rápido hacia la izquierda',
      figura: fig(Object.assign(regla(-100, 20), { x0: 0, v: -10, signo: true, lugares: PARADERO })),
      enunciado: ['Una combi sale del paradero hacia la izquierda a ', pv('10 m/s'), ' y acelera parejo: ', pt('3 s'), ' después va a ', pv('16 m/s'), ', también hacia la izquierda. ¿Cuál es su aceleración?'],
      datos: [DA.acel, DA.eje],
      solucion: [
        { texto: ['Hacia la izquierda, las velocidades llevan signo −: ', Mv0, ' = ', pv('−10 m/s'), ' y ', Mv, ' = ', pv('−16 m/s'), '.'] },
        { texto: 'El cambio es la final menos la inicial:', ecuacion: [Ma, ' = ', { frac: [[pv('−16'), ' − (', pv('−10'), ')'], pt('3')] }, ' = ', pa('−2 m/s²')] },
        { texto: 'a es negativa y la combi va más rápido: a y v tienen el mismo signo.' },
      ],
      respuesta: [pa('a = −2 m/s²'), ', aunque va más rápido'] },
    { nivel: 3, titulo: 'Dos tramos en km/h',
      figura: fig(Object.assign(regla(0, 140), { v: 0, lugares: PARADERO })),
      enunciado: ['Una combi arranca del paradero y a los ', pt('4 s'), ' va a ', pv('36 km/h'), '; ', pt('5 s'), ' después va a ', pv('72 km/h'), '. ¿Cuál es su aceleración media en cada tramo?'],
      alternativas: ['2,5 m/s² y 4 m/s²', '9 m/s² y 7,2 m/s²', '2,5 m/s² y 2 m/s²', '2,22 m/s² en los dos', '2,5 m/s² y 2,22 m/s²'],
      datos: [DA.media, DA.kmh],
      solucion: [
        { texto: 'Las velocidades a m/s:', ecuacion: [pv('36 km/h'), ' = ', pv('10 m/s'), ';   ', pv('72 km/h'), ' = ', pv('20 m/s')] },
        { texto: 'Cada tramo con su cambio y su tiempo:', ecuacion: [{ frac: [[pv('10'), ' − 0'], pt('4')] }, ' = ', pa('2,5 m/s²'), ';   ', { frac: [[pv('20'), ' − ', pv('10')], pt('5')] }, ' = ', pa('2 m/s²')] },
        { texto: ['La ', neg('A'), ' divide 20 m/s entre 5 s sin restar los 10 m/s; la ', neg('B'), ' deja los km/h.'] },
      ],
      respuesta: [neg('C'), ', ', pa('2,5 m/s²'), ' y ', pa('2 m/s²')] },
    { nivel: 3, titulo: 'Todo el viaje',
      figura: fig(Object.assign(regla(0, 140), { v: 0, lugares: PARADERO })),
      enunciado: ['Una combi arranca del paradero y en ', pt('5 s'), ' llega a ', pv('15 m/s'), '; va así ', pt('10 s'), ' y frena hasta parar en ', pt('3 s'), '. ¿Cuál es su aceleración media en los ', pt('18 s'), '?'],
      alternativas: ['3 m/s²', '0,83 m/s²', '−5 m/s²', '0', '−0,67 m/s²'],
      datos: [DA.media, DA.eje],
      solucion: [
        { texto: 'En todo el viaje, la velocidad empieza en 0 y termina en 0: no cambió.', ecuacion: [Mam, ' = ', { frac: [['0 − 0'], pt('18')] }, ' = ', pa('0')] },
        { texto: ['La ', neg('A'), ' y la ', neg('C'), ' son de un solo tramo; la ', neg('B'), ' divide 15 entre 18; la ', neg('E'), ' promedia las tres aceleraciones.'] },
      ],
      respuesta: [neg('D'), ', ', pa('0')] },
    { nivel: 3, titulo: 'Frena yendo a la izquierda',
      figura: fig(Object.assign(regla(-140, 20), { v: -25, signo: true, lugares: PARADERO })),
      enunciado: ['Una combi pasa por el paradero hacia la izquierda a ', pv('25 m/s'), ' y frena: ', pt('5 s'), ' después va a ', pv('10 m/s'), ', todavía hacia la izquierda. ¿Cuál es su aceleración?'],
      alternativas: ['−3 m/s²', '+3 m/s²', '−7 m/s²', '+2 m/s²', '−2 m/s²'],
      datos: [DA.acel, DA.eje],
      solucion: [
        { texto: ['Hacia la izquierda: ', Mv0, ' = ', pv('−25 m/s'), ' y ', Mv, ' = ', pv('−10 m/s'), '.'], ecuacion: [Ma, ' = ', { frac: [[pv('−10'), ' − (', pv('−25'), ')'], pt('5')] }, ' = ', pa('+3 m/s²')] },
        { texto: 'Frena, así que a va contra v: v es negativa y a, positiva.' },
        { texto: ['La ', neg('A'), ' cree que frenar es siempre negativo; la ', neg('C'), ' pierde un signo; la ', neg('D'), ' divide 10 entre 5.'] },
      ],
      respuesta: [neg('B'), ', ', pa('+3 m/s²')] },
    { nivel: 3, titulo: 'La velocidad en una ecuación',
      enunciado: ['La velocidad de una combi es ', Mv, ' = ', pv('18'), ' − ', pa('3'), Mt, ', con ', Mv, ' en m/s y ', Mt, ' en segundos. ¿Cuál es su aceleración y cuándo se detiene?'],
      alternativas: ['3 m/s², a los 6 s', '18 m/s², a los 3 s', '−3 m/s², a los 18 s', '−3 m/s², nunca', '−3 m/s², a los 6 s'],
      datos: [DA.vt, DA.eje],
      solucion: [
        { texto: ['Se compara con ', Mv, ' = ', Mv0, ' + ', Ma, ' · ', Mt, ': sale a 18 m/s y lo que multiplica a t es a.'], ecuacion: [Mv0, ' = ', pv('18 m/s'), ';   ', Ma, ' = ', pa('−3 m/s²')] },
        { texto: ['Se detiene cuando ', Mv, ' = 0:'], ecuacion: ['0 = ', pv('18'), ' − ', pa('3'), Mt, '  →  ', Mt, ' = ', pt('6 s')] },
        { texto: ['La ', neg('A'), ' pierde el signo de a; la ', neg('B'), ' confunde los dos números.'] },
      ],
      respuesta: [neg('E'), ', ', pa('−3 m/s²'), ', a los ', pt('6 s')] },
    { nivel: 3, titulo: 'De 0 a 90 km/h',
      figura: fig(Object.assign(regla(0, 200), { v: 0, lugares: PARADERO })),
      enunciado: ['En la carretera, una combi arranca del paradero y llega a ', pv('90 km/h'), ' en ', pt('10 s'), ', acelerando parejo. ¿Qué marcaba su velocímetro, en km/h, a los ', pt('4 s'), '?'],
      alternativas: ['36 km/h', '10 km/h', '9 km/h', '2,5 km/h'],
      datos: [DA.acel, DA.kmh],
      solucion: [
        { texto: 'Todo a m/s y segundos:', ecuacion: [pv('90 km/h'), ' = ', pv('25 m/s'), ';   ', Ma, ' = ', { frac: [pv('25'), pt('10')] }, ' = ', pa('2,5 m/s²')] },
        { texto: 'A los 4 s, desde el reposo, y de vuelta a km/h:', ecuacion: [Mv, ' = ', pa('2,5'), ' · ', pt('4'), ' = ', pv('10 m/s'), ' = ', pv('36 km/h')] },
        { texto: ['La ', neg('B'), ' no vuelve a km/h; la ', neg('C'), ' divide 90 entre 10.'] },
      ],
      respuesta: [neg('A'), ', ', pv('36 km/h')] },
  ];

  const aceleracion = {
    id: 'aceleracion',
    titulo: 'La aceleración',
    pregunta: 'Si una combi frena mientras avanza, ¿hacia dónde apunta su aceleración?',
    temas: ['MRUV'],
    pieza: 'fis-combi',
    aprendizaje: 'La aceleración es cuánto cambia la velocidad cada segundo: a = Δv/Δt. Al frenar, a tiene signo contrario a v, aunque siga avanzando.',
    actividad: 'Hacer que la combi arranque del paradero más o menos rápido.',
    lee: {
      tarjetas: [
        { titulo: 'Cada segundo, más rápido', texto: ['Cuando una combi arranca, cada segundo va más rápido que el anterior. La flecha sobre la combi es su velocidad ', Mv, ': más larga, más rápido. Las combis tenues muestran dónde estaba en cada segundo.'],
          dibujo: avenida(Object.assign(regla(0, 40), { x0: 0, v: 3, a: 2, segundos: 3, crece: true, lugares: PARADERO })) },
        { titulo: 'Cuánto cambió la velocidad', texto: [Mdv, ' (delta ve) es cuánto cambió la velocidad: la del final menos la del inicio, ', Mv0, '. Si pasa de 3 m/s a 9 m/s, cambió ', pv('6 m/s'), '.'],
          ecuacion: [Mdv, ' = ', Mv, ' − ', Mv0, ' = ', pv('9'), ' − ', pv('3'), ' = ', pv('6 m/s')] },
        { titulo: 'Metros por segundo, cada segundo', texto: ['La aceleración ', Ma, ' dice cuántos m/s cambia la velocidad en cada segundo; se mide en m/s². Con ', pa('a = 2 m/s²'), ', la velocidad sube 2 m/s cada segundo. Si a no cambia, es un MRUV: movimiento rectilíneo uniformemente variado.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir con qué velocidad pasa la combi por el paradero y cuánto acelera. El reloj corre solo: mira cuánto crece la flecha en cada segundo.' },
      ],
    },
    ejemplos: EJEMPLOS_ACEL,
    juega: {
      pieza: 'fis-combi',
      consigna: 'La combi pasa por el paradero y acelera parejo: cada segundo su velocidad cambia lo mismo.',
      mision: {
        texto: 'Haz que la combi llegue a 12 m/s justo a los 4 s.',
        // Cinco salidas lo logran: de 0 m/s con 3 m/s², de 2 con 2,5… de 8 con 1. El reloj no cuenta.
        logrado: val => val.v0 + 4 * val.a === 12,
        bien: 'Listo: 12 m/s a los 4 s. ¿Lo logras saliendo con otra velocidad?',
      },
      voz: 'Mira cuánto crece la flecha en cada segundo.',
      leyenda: [
        { s: [Mv0], t: 'la velocidad al pasar por el paradero' },
        { s: [Ma], t: 'cuántos m/s gana en cada segundo' },
        { s: [Mt], t: 'segundos desde que arranca el reloj' },
        { s: 'flecha', t: 'la velocidad: más larga, más rápido' },
        { s: 'combi tenue', t: 'dónde estaba en cada segundo' },
        { s: 'm/s²', t: 'm/s que cambia en cada segundo' },
      ],
      controles: [
        { id: 'v0', etiqueta: 'Sale a, v₀', color: 'c-o', min: 0, max: 8, paso: 2, inicio: 0, unidad: 'm/s', decimales: 0 },
        { id: 'a', etiqueta: 'Acelera, a', color: 'c-h', min: 0.5, max: 3, paso: 0.5, inicio: 1, unidad: 'm/s²', decimales: 1 },
        { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: T_B1 + 0.5, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: juegoB1,
      lectura: val => ['Gana ', pv(ms(val.a)), ' cada segundo: en ', pt('4 s'), ', ', pv(ms(val.v0 + T_B1 * val.a))],
      resumen: { v0: 2, a: 1, t: 4 },
      minimo: 3,
    },
    predice: {
      pregunta: ['La combi va a ', pv('20 m/s'), ' hacia la derecha y frena: a los ', pt('4 s'), ' va a ', pv('8 m/s'), ', todavía hacia la derecha. ¿Cuánto vale su aceleración?'],
      datos: ['+ hacia la derecha: es el sentido positivo.', 'La combi frena parejo: pierde lo mismo en cada segundo.'],
      opciones: [
        { id: 'c', texto: '−3 m/s²', correcta: true },
        { id: 'adelante', texto: '+3 m/s²: apunta hacia adelante, porque avanza', error: 'K3', siFuera: 'Bien el 3: pierde 3 m/s cada segundo. Pero la velocidad baja: a apunta al revés que v.' },
        { id: 'sin-v0', texto: '+2 m/s²', error: 'K4', siFuera: 'Bien que dividas entre 4 s. Pero a usa el cambio de velocidad, 8 − 20, no solo el 8.' },
        { id: 'cero', texto: '0: sigue yendo hacia la derecha', error: 'K-A0', siFuera: 'Bien: no cambió de sentido. Pero su velocidad sí cambió, de 20 a 8 m/s.' },
      ],
      dibujo: avenida(Object.assign({}, PRED_B1, { segundos: 0 })),
      revelar: avenida(MIRA_B1, { corte: 4 }),
      coincide: 'Coincide: perdió 12 m/s en 4 s, 3 m/s cada segundo, y a apunta hacia la izquierda.',
    },
    mira: {
      datos: Object.assign({ vista: 'avenida' }, MIRA_B1),
      pasos: [
        { estado: { corte: 0, flechaA: false }, texto: 'Al arrancar el reloj, la combi va a 20 m/s hacia la derecha.', ecuacion: [Mv0, ' = ', pv('20 m/s')] },
        { estado: { corte: 4, flechaA: false }, texto: 'La flecha se achica: a los 4 s, va a 8 m/s.', ecuacion: [Mv, ' = ', pv('8 m/s')] },
        { estado: { corte: 4, flechaA: false }, texto: 'La velocidad cambió la final menos la inicial: perdió 12 m/s.', ecuacion: [Mdv, ' = ', Mv, ' − ', Mv0, ' = ', pv('8'), ' − ', pv('20'), ' = ', pv('−12 m/s')] },
        { estado: { corte: 4, flechaA: false }, texto: 'Ese cambio, repartido en los 4 s, es la aceleración.', ecuacion: [Ma, ' = ', { frac: [Mdv, Mdt] }, ' = ', { frac: [pv('−12 m/s'), pt('4 s')] }, ' = ', pa('−3 m/s²')] },
        { estado: { corte: 4 }, texto: 'El signo − dice que a apunta hacia la izquierda: contra v.', ecuacion: [Ma, ' = ', pa('−3 m/s²'), ';   ', Mv, ' = ', pv('+8 m/s')] },
        { estado: { corte: 4 }, texto: 'Por eso frena: pierde 3 m/s cada segundo, aunque siga avanzando.' },
      ],
    },
    regla: {
      texto: 'La aceleración es cuánto cambia la velocidad en cada segundo. Al frenar, a y v tienen signos contrarios. La academia escribe v = v₀ ± a·t: ese ± es el signo.',
      ecuacion: [Ma, ' = ', { frac: [Mdv, Mdt] }, ' = ', { frac: [[{ llave: [Mv], nota: 'al final', color: 'c-o' }, ' − ', { llave: [Mv0], nota: 'al inicio', color: 'c-o' }], Mdt] }, '   →   ', Mv, ' = ', Mv0, ' + ', Ma, ' · ', Mt],
      condicion: 'a no cambia en el tramo; t se cuenta desde que iba a v₀. Si a cambia, da la aceleración media.',
    },
    resuelve: {
      pieza: 'fis-combi',
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          let vi, ai, T, vf;
          do { vi = r.de([0, 2, 4, 6]); ai = r.de([0.5, 1, 1.5, 2, 2.5, 3]); T = r.ent(2, 8); vf = vi + ai * T; } while (vf > 20);
          const sale = vi ? ['La combi pasa por el paradero a ', pv(ms(vi)), ' y acelera con '] : ['La combi arranca del paradero y acelera con '];
          return {
            enunciado: [...sale, pa(`a = ${ms2(ai)}`), '. ¿Cuánto tarda en llegar a ', pv(ms(vf)), '?'],
            datos: [DA.acel, DA.eje],
            dibujo: avenida(Object.assign(regla(0, 80), { x0: 0, v: vi, a: ai, segundos: 0, rotulos: false, flechaA: { texto: ms2(ai) }, lugares: PARADERO })),
            pasos: [
              { tipo: 'pide', texto: ['Piden el tiempo ', Mdt, ' que tarda en llegar a esa velocidad.'] },
              { tipo: 'datos', texto: ['Sale a ', pv(ms(vi)), ', debe llegar a ', pv(ms(vf)), ' y gana ', pv(ms(ai)), ' cada segundo.'] },
              { tipo: 'regla', texto: ['La aceleración: ', Ma, ' = ', Mdv, ' ÷ ', Mdt, '. Se despeja ', Mdt, '.'] },
              { tipo: 'cuentas', texto: 'Se reemplaza lo que se sabe:', ecuacion: [Mdt, ' = ', { frac: [[pv(fm(vf)), ' − ', pv(fm(vi))], pa(fm(ai))] }, ' = ', pt(`${fm(T)} s`)] },
              { tipo: 'sentido', texto: `Comprobación: ${fm(vi)} + ${fm(ai)} · ${fm(T)} = ${fm(vf)} m/s. Sí llega.` },
            ],
            respuesta: ['Tarda ', pt(`${fm(T)} s`)],
          };
        }
        let ai, T, vf, vi;
        do { ai = r.de([-1, -1.5, -2, -2.5, -3]); T = r.ent(2, 5); vf = r.ent(2, 10); vi = vf - ai * T; } while (vi > 20);
        return {
          enunciado: ['La combi frena con ', pa(`a = ${ms2(ai)}`), ' y, ', pt(`${fm(T)} s`), ' después de pasar por el grifo, va a ', pv(ms(vf)), '. ¿A qué velocidad pasó por el grifo?'],
          datos: [DA.acel, DA.eje],
          pasos: [
            { tipo: 'pide', texto: ['Piden la velocidad ', Mv0, ' con que pasó por el grifo.'] },
            { tipo: 'datos', texto: ['Pierde ', pv(ms(-ai)), ' cada segundo durante ', pt(`${fm(T)} s`), ' y termina en ', pv(ms(vf)), '.'] },
            { tipo: 'regla', texto: ['La aceleración: ', Ma, ' = (', Mv, ' − ', Mv0, ') ÷ ', Mt, '. Se despeja ', Mv0, '.'] },
            { tipo: 'cuentas', texto: 'Se reemplaza lo que se sabe:', ecuacion: [Mv0, ' = ', Mv, ' − ', Ma, ' · ', Mt, ' = ', pv(fm(vf)), ' − (', pa(fm(ai)), ') · ', pt(fm(T)), ' = ', pv(ms(vi))] },
            { tipo: 'sentido', texto: 'Frenaba: antes iba más rápido que al final, como debe ser.' },
          ],
          respuesta: [pv(`v₀ = ${ms(vi)}`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-combi',
      generar(s) {
        const r = azar(s + 31), k = s % 4;
        const cuatro = (bien, ds, fmt) => opciones(bien, ds, fmt).slice(0, 4);
        if (k === 0) {
          // Rapideces de avenida: la combi no pasa de 20 m/s (72 km/h).
          let vi, ai, ti, vf;
          do { vi = r.de([0, 2, 4, 6, 8, 10]); ai = r.de([0.5, 1, 1.5, 2, 2.5, 3]); ti = r.ent(2, 6); vf = vi + ai * ti; } while (vf > 20);
          const sale = vi ? ['Una combi pasa por el paradero a ', pv(ms(vi)), ' y acelera parejo: '] : ['Una combi arranca del paradero y acelera parejo: '];
          return {
            pregunta: [...sale, pt(`${fm(ti)} s`), ' después va a ', pv(ms(vf)), '. ¿Cuál es su aceleración?'],
            datos: [DA.acel, DA.eje],
            dibujo: avenida(Object.assign(regla(0, 80), { x0: 0, v: vi, segundos: 0, rotulos: false, lugares: PARADERO })),
            opciones: cuatro(ai, [
              { id: 'sin-v0', valor: vf / ti, error: 'K4', siFuera: `Bien que dividas entre ${fm(ti)} s. Pero se divide el cambio: ${fm(vf)} − ${fm(vi)}.` },
              { id: 'sin-dividir', valor: vf - vi, error: 'K-SINDIV', siFuera: `Bien: ganó ${fm(vf - vi)} m/s. Pero eso fue en ${fm(ti)} s; a es por cada segundo.` },
              { id: 'suma', valor: (vf + vi) / ti, error: 'K-SUMA', siFuera: 'Bien que dividas entre el tiempo. Pero el cambio es la final menos la inicial.' },
              { id: 'signo', valor: -ai, error: 'K-SIGNO', siFuera: 'Bien el valor. Pero la velocidad sube y va hacia la derecha: a es positiva.' },
              { id: 'por', valor: (vf - vi) * ti, error: 'K-POR', siFuera: `Bien el cambio, ${fm(vf - vi)} m/s. Pero se reparte en ${fm(ti)} s: se divide, no se multiplica.` },
            ], ms2),
            solucion: { texto: `Ganó ${fm(vf - vi)} m/s en ${fm(ti)} s.`, ecuacion: [Ma, ' = ', { frac: [[pv(fm(vf)), ' − ', pv(fm(vi))], pt(fm(ti))] }, ' = ', pa(ms2(ai))] },
          };
        }
        if (k === 1) {
          let ai, ti, vf, vi;
          do { ai = r.de([-1, -1.5, -2, -2.5, -3, -4]); ti = r.ent(2, 5); vf = r.ent(2, 9); vi = vf - ai * ti; } while (vi > 20);
          return {
            pregunta: ['Una combi va a ', pv(ms(vi)), ' hacia la derecha y frena parejo: ', pt(`${fm(ti)} s`), ' después va a ', pv(ms(vf)), '. ¿Cuál es su aceleración?'],
            datos: [DA.acel, DA.eje],
            dibujo: avenida(Object.assign(regla(0, 80), { x0: 0, v: vi, segundos: 0, rotulos: false, signo: true })),
            opciones: cuatro(ai, [
              { id: 'adelante', valor: -ai, error: 'K3', siFuera: `Bien el ${fm(-ai)}. Pero la velocidad baja: a apunta al revés que v, hacia el −.` },
              { id: 'sin-v0', valor: vf / ti, error: 'K4', siFuera: `Bien que dividas entre ${fm(ti)} s. Pero se divide el cambio: ${fm(vf)} − ${fm(vi)}.` },
              { id: 'cero', valor: 0, error: 'K-A0', siFuera: 'Bien: no cambió de sentido. Pero su velocidad sí cambió: hay aceleración.' },
              { id: 'sin-dividir', valor: vf - vi, error: 'K-SINDIV', siFuera: `Bien el cambio, ${fm(vf - vi)} m/s. Pero fue en ${fm(ti)} s; a es por cada segundo.` },
            ], ms2),
            solucion: { texto: 'La velocidad baja: el cambio es negativo, y a apunta hacia el −.', ecuacion: [Ma, ' = ', { frac: [[pv(fm(vf)), ' − ', pv(fm(vi))], pt(fm(ti))] }, ' = ', pa(ms2(ai))] },
          };
        }
        if (k === 2) {
          const frena = r.ent(0, 1) === 1;
          let ti, ai, vi, vf;
          do {
            ti = r.ent(2, 6); ai = frena ? r.de([-1, -1.5, -2, -2.5]) : r.de([0.5, 1, 1.5, 2, 2.5, 3]);
            vi = frena ? -ai * ti + r.ent(1, 8) : r.de([2, 4, 6, 8, 10]); vf = vi + ai * ti;
          } while (Math.max(vi, vf) > 20);
          return {
            pregunta: ['Una combi pasa por el grifo a ', pv(ms(vi)), ' hacia la derecha, con ', pa(`a = ${ms2(ai)}`), '. ¿Qué velocidad tiene ', pt(`${fm(ti)} s`), ' después?'],
            datos: [DA.acel, DA.eje],
            dibujo: avenida(Object.assign(regla(0, 80), { x0: 0, v: vi, a: ai, segundos: 0, rotulos: false, signo: true, flechaA: { texto: ms2(Math.abs(ai)) }, lugares: [{ en: 0, texto: 'Grifo' }] })),
            opciones: cuatro(vf, [
              { id: 'signo', valor: vi - ai * ti, error: 'K-SIGNO', siFuera: `Bien que multipliques ${fm(ai)} por ${fm(ti)}. Pero ese cambio se suma con su signo.` },
              { id: 'sin-v0', valor: ai * ti, error: 'K4', siFuera: `Bien: cambia ${fm(ai * ti)} m/s. Pero ya iba a ${fm(vi)} m/s al pasar por el grifo.` },
              { id: 'un-seg', valor: vi + ai, error: 'K-TIEMPO', siFuera: `Esa es la velocidad después de un segundo. Faltan ${fm(ti - 1)} s más.` },
              { id: 'cuadrado', valor: vi + ai * ti * ti, error: 'K-CUADRADO', siFuera: 'Bien que partas de v₀. Pero v cambia a por cada segundo: a · t, sin elevar t.' },
            ], ms),
            solucion: { texto: `En ${fm(ti)} s la velocidad cambia ${fm(ai * ti)} m/s, con su signo.`, ecuacion: [Mv, ' = ', pv(fm(vi)), ' + (', pa(fm(ai)), ') · ', pt(fm(ti)), ' = ', pv(ms(vf))] },
          };
        }
        // Nivel examen (San Marcos 2021, la moto en dos intervalos): aceleración media de un tramo o del viaje, en km/h.
        // Una moto (como en el examen): de 0 a 18 o 36 km/h y después 18 o 36 km/h más, con aceleraciones de hasta unos
        // 3,3 m/s². Los dos tramos duran distinto, y lo bastante para que promediar las aceleraciones dé otro número.
        const todo = Math.floor(s / 4) % 2 === 1;
        let K1, K2, t1, t2, v1, v2, a1, a2, aT;
        do {
          K1 = r.de([18, 36]); K2 = K1 + r.de([18, 36]); t1 = r.ent(3, 6); t2 = r.ent(3, 8);
          v1 = K1 / 3.6; v2 = K2 / 3.6; a1 = v1 / t1; a2 = (v2 - v1) / t2; aT = v2 / (t1 + t2);
        } while (Math.abs((a1 + a2) / 2 - aT) < 0.2);
        const pre = ['Una moto arranca del semáforo y llega a ', pv(`${K1} km/h`), ' en ', pt(`${t1} s`), '; después, en ', pt(`${t2} s`), ' más, llega a ', pv(`${K2} km/h`), '. '];
        if (!todo) return {
          pregunta: [...pre, '¿Cuál es su aceleración media en el segundo tramo?'],
          datos: [DA.media, DA.kmh],
          opciones: cuatro(a2, [
            { id: 'sin-v1', valor: v2 / t2, error: 'K4', siFuera: `Bien los ${fm(v2)} m/s. Pero el tramo empieza en ${fm(v1)} m/s: se divide el cambio.` },
            { id: 'kmh', valor: (K2 - K1) / t2, error: 'U1-kmh', siFuera: 'Bien el cambio entre el tiempo. Pero en km/h: falta pasar a m/s.' },
            { id: 'todo', valor: aT, error: 'MED-TRAMO', siFuera: 'Esa es la aceleración media de todo el viaje. Piden solo el segundo tramo.' },
            { id: 'primero', valor: a1, error: 'MED-TRAMO', siFuera: 'Esa es la del primer tramo. El segundo va de la segunda velocidad a la tercera.' },
          ], ms2),
          solucion: { texto: `${K1} km/h = ${fm(v1)} m/s y ${K2} km/h = ${fm(v2)} m/s.`, ecuacion: [Mam, ' = ', { frac: [[pv(fm(v2)), ' − ', pv(fm(v1))], pt(`${t2}`)] }, ' = ', pa(ms2(a2))] },
        };
        return {
          pregunta: [...pre, '¿Cuál es su aceleración media en todo el viaje?'],
          datos: [DA.media, DA.kmh],
          opciones: cuatro(aT, [
            { id: 'promedio', valor: (a1 + a2) / 2, error: 'MED-PROMEDIO-A', siFuera: 'Bien las dos aceleraciones. Pero no se promedian: los tramos duran distinto.' },
            { id: 'kmh', valor: K2 / (t1 + t2), error: 'U1-kmh', siFuera: 'Bien el cambio entre el tiempo total. Pero en km/h: falta pasar a m/s.' },
            { id: 'segundo', valor: v2 / t2, error: 'K4', siFuera: `Bien los ${fm(v2)} m/s. Pero el viaje dura ${t1 + t2} s, no ${t2}.` },
            { id: 'suma', valor: a1 + a2, error: 'MED-PROMEDIO-A', siFuera: 'Bien las dos aceleraciones. Pero no se suman: se mira el cambio de todo el viaje.' },
          ], ms2),
          solucion: { texto: `De 0 a ${K2} km/h = ${fm(v2)} m/s, en ${t1 + t2} s.`, ecuacion: [Mam, ' = ', { frac: [[pv(fm(v2)), ' − 0'], pt(`${t1 + t2}`)] }, ' = ', pa(ms2(aT))] },
        };
      },
    },
  };
  // Colores aprobados: t turquesa en el eje, v naranja, el área (Δx) violeta, la pendiente (a) carmín.
  const EJE_VT = (vmin, vmax, tmax) => ({
    x: { min: 0, max: tmax, paso: 1, nombre: 't', unidad: 's', decimales: 0, color: 'i' },
    y: { min: vmin, max: vmax, paso: 2, nombre: 'v', unidad: 'm/s', decimales: 0, color: 'o' },
  });
  // Dos tramos: avanza a v1 durante t1 y retrocede a v2 durante t2.
  function idaVuelta(v1, t1, v2, t2, rotulos = true, corte = {}) {
    const A1 = v1 * t1, A2 = v2 * t2, T = t1 + t2;
    return Object.assign(EJE_VT(-6, 6, Math.max(6, T)), {
      curvas: [{ puntos: [[0, v1], [t1, v1], null, [t1, -v2], [T, -v2]], color: 'o' }],
      areas: [
        { puntos: [[0, v1], [t1, v1]], color: 'f', rotulo: rotulos ? `+${f(A1)} m` : undefined, desde: corte.a1 },
        { puntos: [[t1, -v2], [T, -v2]], color: 'f', rotulo: rotulos ? `−${f(A2)} m` : undefined, desde: corte.a2 },
      ],
    });
  }
  // La mesa «Ida y vuelta en v–t» (juego viejo de `desplazamiento-distancia`): el reloj recorre la ida y la vuelta a
  // velocidad real; Δx y d del momento salen de las mismas áreas (regla 1). Al terminar se queda quieto.
  const IDA_V = 4, IDA_T = 3;
  const tramo = (v2, t2, tt) => {
    const T = IDA_T + t2, tm = Math.max(0, Math.min(tt, T));
    const a1 = IDA_V * Math.min(tm, IDA_T), a2 = v2 * Math.max(0, tm - IDA_T);
    return { tm, a1, a2, vt: tm < IDA_T ? IDA_V : -v2 };
  };
  const idaVueltaT = (v2, t2, tt) => {
    const d = idaVuelta(IDA_V, IDA_T, v2, t2, false), q = tramo(v2, t2, tt);
    const ar = [];
    if (q.tm > 0) ar.push({ puntos: [[0, IDA_V], [Math.min(q.tm, IDA_T), IDA_V]], color: 'f', rotulo: q.tm >= 0.8 ? `+${f(q.a1, 1)} m` : undefined });
    if (q.tm > IDA_T) ar.push({ puntos: [[IDA_T, -v2], [q.tm, -v2]], color: 'f', rotulo: q.tm - IDA_T >= 0.8 ? `−${f(q.a2, 1)} m` : undefined });
    return Object.assign(d, { areas: ar, puntos: [{ x: q.tm, y: q.vt, color: 'o', guias: true }] });
  };
  const juegoIdaVuelta = {
    consigna: 'El carrito avanza a 4 m/s durante 3 s y después retrocede. Mira cómo se llenan las dos áreas mientras corre el reloj.',
    voz: 'La parte bajo el eje es cuando va hacia atrás.',
    controles: [
      { id: 'v2', etiqueta: 'Retrocede a', color: 'c-o', min: 1, max: 6, paso: 1, inicio: 2, unidad: 'm/s', decimales: 0 },
      { id: 't2', etiqueta: 'Durante', color: 'c-i', min: 1, max: 3, paso: 1, inicio: 2, unidad: 's', decimales: 0 },
      { id: 't', etiqueta: 't', color: 'c-i', min: 0, max: 7, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
    ],
    dibujo: val => ({ datos: idaVueltaT(val.v2, val.t2, val.t), estado: {} }),
    lectura: val => { const q = tramo(val.v2, val.t2, val.t); return ['A los ', pt(`${f(q.tm, 1)} s`), ', ', Mdx, ' = ', pdx(`${f(q.a1 - q.a2, 1)} m`), ' y d = ', `${f(q.a1 + q.a2, 1)} m`]; },
    minimo: 3,
    // Arrastra el tramo de abajo hacia arriba o abajo (qué tan rápido retrocede) y su borde derecho (cuánto tiempo).
    arrastres: [
      { id: 'retroceso', etiqueta: 'rapidez de retroceso', color: 'c-o',
        donde: val => { const g = EJES().geometria(idaVuelta(4, 3, val.v2, val.t2)); return { x: g.X(3 + val.t2 / 2), y: g.Y(-val.v2) }; },
        mover: (pt0, val) => { const g = EJES().geometria(idaVuelta(4, 3, val.v2, val.t2)); return { v2: -inversa(g.Y, -6, 6)(pt0.y) }; } },
      { id: 'duracion', etiqueta: 'fin del retroceso', color: 'c-i',
        donde: val => { const g = EJES().geometria(idaVuelta(4, 3, val.v2, val.t2)); return { x: g.X(3 + val.t2), y: g.Y(-val.v2) }; },
        mover: (pt0, val) => { const g = EJES().geometria(idaVuelta(4, 3, val.v2, val.t2)); return { t2: inversa(g.X, 0, 6)(pt0.x) - 3 }; } },
    ],
  };

  const rectaVT = (vi, ai, tmax, extra = {}) => Object.assign({
    x: { min: 0, max: tmax, paso: 1, nombre: 't', unidad: 's', decimales: 0, color: 'i' },
    y: { min: 0, max: 16, paso: 4, nombre: 'v', unidad: 'm/s', decimales: 0, color: 'o' },
    curvas: [{ puntos: [[0, vi], [tmax, vi + ai * tmax]], color: 'o' }],
  }, extra);
  // Animación: el reloj corre de 0 a 4 s a velocidad real. La recta se pinta hasta t, el punto naranja la recorre y el
  // área (lo que avanzó) se llena debajo. Si frena hasta v = 0, se queda ahí: no retrocede.
  const T_VT = 4;
  const ejeVT = (vi, ai, extra = {}) => rectaVT(vi, ai, T_VT, Object.assign({ y: { min: 0, max: 20, paso: 4, nombre: 'v', unidad: 'm/s', decimales: 0, color: 'o' } }, extra));
  const altoVT = val => (val.a < 0 ? Math.min(T_VT, val.v0 / -val.a) : T_VT);
  const momentoVT = val => {
    const tm = Math.max(0, Math.min(val.t, altoVT(val)));
    return { tm, vt: val.v0 + val.a * tm, dx: val.v0 * tm + val.a * tm * tm / 2, quieto: val.a < 0 && val.t >= altoVT(val) };
  };
  const rectaVTt = val => {
    const tf = altoVT(val), q = momentoVT(val), fin = [tf, val.v0 + val.a * tf];
    return ejeVT(val.v0, val.a, {
      curvas: [{ puntos: [[0, val.v0], fin], color: 'o', discontinua: true }, { puntos: [[0, val.v0], [q.tm, q.vt]], color: 'o' }],
      areas: q.tm > 0 ? [{ puntos: [[0, val.v0], [q.tm, q.vt]], color: 'f', rotulo: q.tm >= 1 && q.dx >= 4 ? `${f(q.dx, 1)} m` : undefined }] : [],
      puntos: [{ x: q.tm, y: q.vt, color: 'o', guias: true }],
    });
  };
  // La mesa «La recta v–t» (el juego viejo de esta idea): se queda en el laboratorio con su id.
  const juegoRectaVT = {
      consigna: 'Elige la velocidad inicial y cuánto cambia cada segundo. Mira el punto: sube o baja lo mismo en cada segundo.',
      voz: 'Prueba también un cambio negativo.',
      controles: [
        { id: 'v0', etiqueta: 'v₀', color: 'c-o', min: 0, max: 12, paso: 2, inicio: 4, unidad: 'm/s', decimales: 0 },
        { id: 'a', etiqueta: 'a', color: 'c-h', min: -2, max: 2, paso: 1, inicio: 1, unidad: 'm/s²', decimales: 0 },
        { id: 't', etiqueta: 't', color: 'c-i', min: 0, max: T_VT + 0.5, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      // La recta se corta donde v llegaría a 0: aquí el móvil frena hasta detenerse, no retrocede.
      dibujo: val => ({ datos: rectaVTt(val), estado: {} }),
      lectura: val => {
        const q = momentoVT(val);
        return q.quieto ? ['A los ', pt(`${f(q.tm, 1)} s`), ' se detuvo: ', Mv, ' = 0'] : ['A los ', pt(`${f(q.tm, 1)} s`), ', ', Mv, ' = ', pv(`${f(q.vt, 1)} m/s`)];
      },
      minimo: 3,
      // Arrastra el punto de partida (v₀) o el punto de t = 1 s, que inclina la recta (a).
      arrastres: [
        { id: 'inicio', etiqueta: 'velocidad inicial', color: 'c-o',
          donde: val => { const g = EJES().geometria(ejeVT(val.v0, val.a)); return { x: g.X(0), y: g.Y(val.v0) }; },
          mover: (pt0, val) => { const g = EJES().geometria(ejeVT(val.v0, val.a)); return { v0: g.Yi(pt0.y) }; } },
        { id: 'pendiente', etiqueta: 'inclinación de la recta', color: 'c-h',
          donde: val => { const g = EJES().geometria(ejeVT(val.v0, val.a)); return { x: g.X(1), y: g.Y(val.v0 + val.a) }; },
          mover: (pt0, val) => { const g = EJES().geometria(ejeVT(val.v0, val.a)); return { a: g.Yi(pt0.y) - val.v0 }; } },
      ],
  };
  // Motor de la pista con acelerador (lo mismo que dibuja): frena hasta detenerse, sin retroceder.
  const marcasPista = val => { const alto = val.a < 0 ? val.v0 / -val.a : Infinity; return [0, 1, 2, 3, 4, 5].map(k => { const tk = Math.min(k, alto); return val.v0 * tk + val.a * tk * tk / 2; }); };
  const ultima = val => marcasPista(val)[5];
  const frenado = val => (val.a < 0 ? val.v0 * val.v0 / (-2 * val.a) : Infinity);
  // Animación de la mesa: el carrito avanza a velocidad real con x = v₀t + ½at² (el mismo motor de las marcas) y deja la
  // marca del segundo k cuando t llega a k. Si frena hasta v = 0, se queda ahí. A los 5 s espera medio segundo y repite.
  const T_PISTA = 5;
  const momentoPista = val => {
    const alto = val.a < 0 ? val.v0 / -val.a : Infinity, tm = Math.max(0, Math.min(val.t, T_PISTA, alto));
    return { x: val.v0 * tm + val.a * tm * tm / 2, v: val.v0 + val.a * tm, quieto: val.t >= alto };
  };


  // ---------- Ayudantes de las ideas 2 a 6 (fase 3, 18 nov) ----------
  const Mx0 = { sub: [Mx, '0'] }, Mg = { v: 'c-h', t: 'g', m: 'aceleración' };
  const Mh = { v: 'c-f', t: 'h', m: 'posición' }, My = { v: 'c-f', t: 'y', m: 'posición' }, MH = { v: 'c-f', t: 'H', m: 'posición' };
  const Mvm = { sub: [Mv, 'm'] }, Mt2 = { sup: [Mt, '2'] };
  const ph = s => ({ v: 'c-f', t: String(s), m: 'posición' });
  const MEDIA = { frac: [[Mv0, ' + ', Mv], '2'] };
  // Las cuatro ecuaciones del MRUV, una por línea (la idea 2 practica elegir entre ellas: van las cuatro).
  const DB = {
    media: ['Desplazamiento: ', Mdx, ' = ', MEDIA, ' · ', Mt],
    horaria: ['Posición: ', Mx, ' = ', Mx0, ' + ', Mv0, ' · ', Mt, ' + ½ · ', Ma, ' · ', Mt2],
    v2: ['Velocidad y desplazamiento: ', { sup: [Mv, '2'] }, ' = ', { sup: [Mv0, '2'] }, ' + 2 · ', Ma, ' · ', Mdx],
  };
  const DATOS_B2 = [DA.vt, DB.media, DB.horaria, DB.v2, DA.eje];
  const MRP = () => Kit.piezas['fis-mruv'];
  const mruv = (datos, estado = {}) => ({ pieza: 'fis-mruv', datos, estado });
  const cuatro = (bien, ds, fmt) => opciones(bien, ds, fmt).slice(0, 4);

  // ---------- Idea 2 (B2): las ecuaciones del MRUV ----------
  // Pieza fis-combi, vista «avenida»: la combi que llega a 10 m/s frente al colegio y frena parejo hasta parar; el paso
  // de cebra a 25 m. Cambia: cuánto frena · Permanece: la velocidad con que llega y el colegio en x = 0 · Progresa: el
  // reloj, con una combi tenue por segundo (los tramos se achican) · Se reserva: llegar con otra rapidez (la predicción:
  // al doble, cuatro veces la distancia) · Debe verse: dónde se detiene y cuánto tarda.
  // En esta idea el 0 de la regla es el colegio, donde empieza a frenar (la consigna y el letrero lo dicen).
  const V0_B2 = 10, REGLA_B2 = regla(0, 60), COLEGIO = { en: 0, texto: 'Colegio' }, CEBRA = { en: 25, texto: 'Paso de cebra' };
  const paraB2 = a => V0_B2 / -a, dxB2 = a => V0_B2 * V0_B2 / (-2 * a);
  const juegoB2 = val => {
    const tp = paraB2(val.a), tt = Math.min(val.t, tp), vt = Math.max(0, V0_B2 + val.a * tt);
    return avenida(Object.assign({}, REGLA_B2, { x0: 0, v: V0_B2, a: val.a, t: tt, segundos: Math.ceil(tp - 1e-9), crece: true,
      lugares: [COLEGIO, CEBRA], flechaTexto: `${f(vt, 1)} m/s` }));
  };
  const MIRA_B2 = Object.assign({ vista: 'avenida' }, regla(0, 120), { x0: 0, v: 20, a: -2, segundos: 10, crece: true, rotulos: false, lugares: [COLEGIO] });

  // Ejemplos de B2. Cuentas rehechas con un script aparte que no usa este archivo (scratchpad f3/cuentas.js, 18 nov):
  // (6 + 14)/2·5; 12²/(2·3); ½·2·6²; √(5² + 2·2·36); 2·45/15; 54/3,6 y 15²/(2·2,5); 20²/(2·50) y 20/4;
  // 10 + 8·3 + 3² y 8 + 2·3; ½·2·(5² − 2²); 2t + ½t² = 30; 8·(72/36)²; (72/3,6)²/(2·5); 6 − 2·2; x(4) − x(1) con
  // x = 4 + 6t − t²; ½·2·(5² − 4²).
  const EJEMPLOS_ECU = [
    { nivel: 1, titulo: 'La distancia con la media',
      figura: fig(Object.assign(regla(0, 80), { v: 6, lugares: PARADERO })),
      enunciado: ['Una combi pasa por el paradero a ', pv('6 m/s'), ' y acelera parejo: ', pt('5 s'), ' después va a ', pv('14 m/s'), '. ¿Cuánto avanzó en ese tiempo?'],
      datos: DATOS_B2,
      solucion: [{ texto: 'La velocidad sube pareja: la media es la mitad de la suma, 10 m/s. Por el tiempo:', ecuacion: [Mdx, ' = ', { frac: [[pv('6'), ' + ', pv('14')], '2'] }, ' · ', pt('5'), ' = ', pdx('50 m')] }],
      respuesta: [pdx('Δx = 50 m')] },
    { nivel: 1, titulo: 'Distancia de frenado',
      figura: fig(Object.assign(regla(0, 40), { v: 12, a: -3, signo: true, flechaA: { texto: '3 m/s²' }, lugares: [COLEGIO] })),
      enunciado: ['Frente al colegio, una combi va a ', pv('12 m/s'), ' y frena con ', pa('a = −3 m/s²'), ' hasta parar. ¿Cuánto recorre hasta detenerse?'],
      datos: DATOS_B2,
      solucion: [{ texto: ['No hay tiempo en los datos: se usa la que no lo tiene, con ', Mv, ' = 0 al parar.'], ecuacion: ['0 = ', pv('12'), '² + 2 · (', pa('−3'), ') · ', Mdx, '   →   ', Mdx, ' = ', { frac: ['144', '6'] }, ' = ', pdx('24 m')] }],
      respuesta: ['Recorre ', pdx('24 m')] },
    { nivel: 1, titulo: 'Desde el paradero',
      figura: fig(Object.assign(regla(0, 60), { v: 0, a: 2, flechaA: { texto: '2 m/s²' }, lugares: PARADERO })),
      enunciado: ['Una combi arranca del paradero (', Mx, ' = 0) con ', pa('a = 2 m/s²'), '. ¿En qué posición está a los ', pt('6 s'), '?'],
      datos: DATOS_B2,
      solucion: [{ texto: ['Sale del 0 y del reposo: ', Mx0, ' = 0 y ', Mv0, ' = 0. Queda solo el término de la aceleración.'], ecuacion: [Mx, ' = ½ · ', pa('2'), ' · ', pt('6'), '² = ', px('36 m')] }],
      respuesta: [px('x = 36 m')] },
    { nivel: 1, titulo: 'La velocidad sin el tiempo',
      figura: fig(Object.assign(regla(0, 60), { v: 5, a: 2, flechaA: { texto: '2 m/s²' }, lugares: [PARADERO[0], { en: 36, texto: 'Grifo' }] })),
      enunciado: ['Una combi pasa por el paradero a ', pv('5 m/s'), ' y acelera con ', pa('a = 2 m/s²'), '. ¿Qué velocidad lleva al llegar al grifo, ', pdx('36 m'), ' más adelante?'],
      datos: DATOS_B2,
      solucion: [{ texto: 'Se conoce Δx y no el tiempo: la ecuación sin el tiempo.', ecuacion: [{ sup: [Mv, '2'] }, ' = ', pv('5'), '² + 2 · ', pa('2'), ' · ', pdx('36'), ' = 169   →   ', Mv, ' = ', pv('13 m/s')] }],
      respuesta: [pv('v = 13 m/s')] },
    { nivel: 1, titulo: '¿Cuánto tarda en parar?',
      figura: fig(Object.assign(regla(0, 60), { v: 15, lugares: [COLEGIO, { en: 45, texto: 'Para aquí' }] })),
      enunciado: ['Una combi va a ', pv('15 m/s'), ' frente al colegio, frena parejo y se detiene ', pdx('45 m'), ' más adelante. ¿Cuánto tarda en detenerse?'],
      datos: DATOS_B2,
      solucion: [{ texto: 'Sin la aceleración, sirve la velocidad media: de 15 a 0, la media es 7,5 m/s.', ecuacion: [pdx('45'), ' = ', { frac: [[pv('15'), ' + 0'], '2'] }, ' · ', Mt, '   →   ', Mt, ' = ', pt('6 s')] }],
      respuesta: ['Tarda ', pt('6 s')] },
    { nivel: 2, titulo: 'Frenar en km/h',
      figura: fig(Object.assign(regla(0, 60), { v: 15, flechaTexto: '54 km/h', a: -2.5, signo: true, flechaA: { texto: '2,5 m/s²' }, lugares: [COLEGIO] })),
      enunciado: ['Una combi va a ', pv('54 km/h'), ' y frena con ', pa('a = −2,5 m/s²'), ' hasta parar. ¿Cuál es su distancia de frenado?'],
      datos: [...DATOS_B2, DA.kmh],
      solucion: [
        { texto: 'Primero, la velocidad en m/s:', ecuacion: [pv('54 km/h'), ' = ', { frac: ['54 000 m', '3600 s'] }, ' = ', pv('15 m/s')] },
        { texto: ['Al parar, ', Mv, ' = 0:'], ecuacion: ['0 = ', pv('15'), '² + 2 · (', pa('−2,5'), ') · ', Mdx, '   →   ', Mdx, ' = ', { frac: ['225', '5'] }, ' = ', pdx('45 m')] },
      ],
      respuesta: [pdx('45 m')] },
    { nivel: 2, titulo: 'El freno que falta',
      figura: fig(Object.assign(regla(0, 60), { v: 20, lugares: [COLEGIO, { en: 50, texto: 'Paso de cebra' }] })),
      enunciado: ['Frente al colegio, una combi va a ', pv('20 m/s'), ' y frena parejo hasta parar justo en el paso de cebra, a ', pdx('50 m'), '. ¿Cuál es su aceleración y cuánto tarda?'],
      datos: DATOS_B2,
      solucion: [
        { texto: 'Sin el tiempo, se despeja a:', ecuacion: ['0 = ', pv('20'), '² + 2 · ', Ma, ' · ', pdx('50'), '   →   ', Ma, ' = ', { frac: ['−400', '100'] }, ' = ', pa('−4 m/s²')] },
        { texto: 'Con la aceleración, el tiempo:', ecuacion: ['0 = ', pv('20'), ' + (', pa('−4'), ') · ', Mt, '   →   ', Mt, ' = ', pt('5 s')] },
      ],
      respuesta: [pa('a = −4 m/s²'), '; tarda ', pt('5 s')] },
    { nivel: 2, titulo: 'La ecuación horaria',
      enunciado: ['La posición de una combi es ', Mx, ' = 10 + ', pv('8'), Mt, ' + ', Mt2, ', con ', Mx, ' en metros y ', Mt, ' en segundos. ¿Dónde está y qué velocidad tiene a los ', pt('3 s'), '?'],
      datos: DATOS_B2,
      solucion: [
        { texto: ['Se reemplaza ', Mt, ' = 3 en la ecuación:'], ecuacion: [Mx, ' = 10 + ', pv('8'), ' · ', pt('3'), ' + ', pt('3'), '² = ', px('43 m')] },
        { texto: ['Se compara con la general: ', Mx0, ' = 10 m, ', Mv0, ' = 8 m/s y ½ · a = 1, así que a = 2 m/s².'], ecuacion: [Mv, ' = ', pv('8'), ' + ', pa('2'), ' · ', pt('3'), ' = ', pv('14 m/s')] },
      ],
      respuesta: [px('x = 43 m'), ' y ', pv('v = 14 m/s')] },
    { nivel: 2, titulo: 'Entre dos instantes',
      figura: fig(Object.assign(regla(0, 60), { v: 0, a: 2, flechaA: { texto: '2 m/s²' }, lugares: PARADERO })),
      enunciado: ['Una combi arranca del paradero con ', pa('a = 2 m/s²'), '. ¿Cuánto avanza entre los ', pt('2 s'), ' y los ', pt('5 s'), '?'],
      datos: DATOS_B2,
      solucion: [
        { texto: 'Su posición en cada instante, desde el paradero:', ecuacion: [Mx, '(', pt('2'), ') = ½ · ', pa('2'), ' · ', pt('2'), '² = ', px('4 m'), ';   ', Mx, '(', pt('5'), ') = ½ · ', pa('2'), ' · ', pt('5'), '² = ', px('25 m')] },
        { texto: 'Lo que avanzó es la resta de las dos posiciones:', ecuacion: [Mdx, ' = ', px('25'), ' − ', px('4'), ' = ', pdx('21 m')] },
      ],
      respuesta: ['Avanza ', pdx('21 m')] },
    { nivel: 2, titulo: '¿Cuándo llega al grifo?',
      figura: fig(Object.assign(regla(0, 40), { v: 2, a: 1, flechaA: { texto: '1 m/s²' }, lugares: [PARADERO[0], { en: 30, texto: 'Grifo' }] })),
      enunciado: ['Una combi pasa por el paradero a ', pv('2 m/s'), ' y acelera con ', pa('a = 1 m/s²'), '. El grifo está ', pdx('30 m'), ' más adelante. ¿Cuánto tarda en llegar?'],
      datos: [...DATOS_B2, 'Una ecuación de segundo grado puede tener dos raíces; aquí t no es negativo.'],
      solucion: [
        { texto: 'La posición, con el paradero en el 0:', ecuacion: [pdx('30'), ' = ', pv('2'), Mt, ' + ½ · ', pa('1'), ' · ', Mt2, '   →   ', Mt2, ' + 4', Mt, ' − 60 = 0'] },
        { texto: 'Sale (t − 6)(t + 10) = 0. El tiempo no es negativo:', ecuacion: [Mt, ' = ', pt('6 s')] },
      ],
      respuesta: ['Llega a los ', pt('6 s')] },
    { nivel: 3, titulo: 'El doble de rápido',
      figura: fig(Object.assign(regla(0, 60), { v: 20, flechaTexto: '72 km/h', lugares: [COLEGIO] })),
      enunciado: ['Una combi a ', pv('36 km/h'), ' necesita ', pdx('8 m'), ' para frenar hasta parar. Con el mismo freno, ¿cuántos metros necesita si va a ', pv('72 km/h'), '?'],
      alternativas: ['16 m', '8 m', '24 m', '32 m', '64 m'],
      datos: [...DATOS_B2, DA.kmh],
      solucion: [
        { texto: ['Al parar, ', Mv, ' = 0: con el mismo a, la distancia va con el cuadrado de la velocidad.'], ecuacion: [Mdx, ' = ', { frac: [{ sup: [Mv0, '2'] }, ['2 · |', Ma, '|']] }] },
        { texto: 'La velocidad se duplica: la distancia se multiplica por 2² = 4.', ecuacion: [pdx('8 m'), ' · 4 = ', pdx('32 m')] },
        { texto: ['La ', neg('A'), ' duplica la distancia; la ', neg('B'), ' cree que el mismo freno da la misma distancia.'] },
      ],
      respuesta: [neg('D'), ', ', pdx('32 m')] },
    { nivel: 3, titulo: 'Frenar a 72 km/h',
      figura: fig(Object.assign(regla(0, 60), { v: 20, flechaTexto: '72 km/h', a: -5, signo: true, flechaA: { texto: '5 m/s²' } })),
      enunciado: ['Una combi va a ', pv('72 km/h'), ' cuando un perro cruza y frena con ', pa('a = −5 m/s²'), ' hasta detenerse. ¿Qué distancia recorre mientras frena?'],
      alternativas: ['40 m', '4 m', '20 m', '80 m', '518,4 m'],
      datos: [...DATOS_B2, DA.kmh],
      solucion: [
        { texto: 'A m/s:', ecuacion: [pv('72 km/h'), ' = ', pv('20 m/s')] },
        { texto: ['Al parar, ', Mv, ' = 0:'], ecuacion: ['0 = ', pv('20'), '² + 2 · (', pa('−5'), ') · ', Mdx, '   →   ', Mdx, ' = ', { frac: ['400', '10'] }, ' = ', pdx('40 m')] },
        { texto: ['La ', neg('B'), ' es el tiempo de frenado; la ', neg('D'), ' olvida el 2; la ', neg('E'), ' deja los km/h.'] },
      ],
      respuesta: [neg('A'), ', ', pdx('40 m')] },
    { nivel: 3, titulo: 'La velocidad en la ecuación',
      enunciado: ['La posición de una combi es ', Mx, ' = 4 + ', pv('6'), Mt, ' − ', Mt2, ', con ', Mx, ' en metros y ', Mt, ' en segundos. ¿Qué velocidad tiene a los ', pt('2 s'), '?'],
      alternativas: ['4 m/s', '12 m/s', '2 m/s', '10 m/s', '6 m/s'],
      datos: DATOS_B2,
      solucion: [
        { texto: ['Se compara con la general: ', Mv0, ' = 6 m/s y ½ · a = −1, así que a = −2 m/s².'], ecuacion: [Mv, ' = ', pv('6'), ' + (', pa('−2'), ') · ', pt('2'), ' = ', pv('2 m/s')] },
        { texto: ['La ', neg('A'), ' toma el −1 como a, sin duplicarlo; la ', neg('B'), ' es la posición a los 2 s; la ', neg('E'), ' es v₀.'] },
      ],
      respuesta: [neg('C'), ', ', pv('2 m/s')] },
    { nivel: 3, titulo: 'Desplazamiento entre instantes',
      enunciado: ['Un carrito sube por un riel inclinado y vuelve a bajar. Su posición es ', Mx, ' = 4 + ', pv('6'), Mt, ' − ', Mt2, ' (en m y s). ¿Cuál es su desplazamiento entre ', pt('t = 1 s'), ' y ', pt('t = 4 s'), '?'],
      alternativas: ['12 m', '5 m', '8 m', '9 m', '3 m'],
      datos: DATOS_B2,
      solucion: [
        { texto: 'Las dos posiciones:', ecuacion: [Mx, '(', pt('1'), ') = 4 + 6 − 1 = ', px('9 m'), ';   ', Mx, '(', pt('4'), ') = 4 + 24 − 16 = ', px('12 m')] },
        { texto: 'El desplazamiento es la final menos la inicial:', ecuacion: [Mdx, ' = ', px('12'), ' − ', px('9'), ' = ', pdx('3 m')] },
        { texto: ['La ', neg('A'), ' es la posición final; la ', neg('B'), ' es la distancia recorrida: a los 3 s llega a 13 m y vuelve.'] },
      ],
      respuesta: [neg('E'), ', ', pdx('3 m')] },
    { nivel: 3, titulo: 'El quinto segundo',
      figura: fig(Object.assign(regla(0, 60), { v: 0, a: 2, flechaA: { texto: '2 m/s²' }, lugares: PARADERO })),
      enunciado: ['Una combi arranca del paradero con ', pa('a = 2 m/s²'), '. ¿Cuánto avanza durante el quinto segundo, entre ', pt('t = 4 s'), ' y ', pt('t = 5 s'), '?'],
      alternativas: ['25 m', '9 m', '10 m', '16 m', '2 m'],
      datos: DATOS_B2,
      solucion: [
        { texto: 'Las posiciones a los 4 s y a los 5 s:', ecuacion: [Mx, '(', pt('4'), ') = ½ · ', pa('2'), ' · 16 = ', px('16 m'), ';   ', Mx, '(', pt('5'), ') = ½ · ', pa('2'), ' · 25 = ', px('25 m')] },
        { texto: 'En el quinto segundo avanza la resta:', ecuacion: [Mdx, ' = ', px('25'), ' − ', px('16'), ' = ', pdx('9 m')] },
        { texto: ['La ', neg('A'), ' es lo de los 5 s enteros; la ', neg('C'), ' es la velocidad a los 5 s.'] },
      ],
      respuesta: [neg('B'), ', ', pdx('9 m')] },
  ];

  const ecuaciones = {
    id: 'ecuaciones-mruv',
    titulo: 'Las ecuaciones del MRUV',
    pregunta: 'Si vas al doble de rápido, ¿cuánto más necesitas para frenar?',
    temas: ['MRUV'],
    pieza: 'fis-combi',
    aprendizaje: 'Con a constante, Δx = (v₀ + v)/2 · t y v² = v₀² + 2a·Δx: al doble de rapidez, frenar toma cuatro veces la distancia.',
    actividad: 'Elegir cuánto frena la combi para parar antes del paso de cebra.',
    lee: {
      tarjetas: [
        { titulo: 'Frenar parejo', texto: ['Una combi que frena parejo pierde la misma velocidad cada segundo: con el + hacia adelante, su ', Ma, ' es negativa. Las combis tenues muestran dónde estaba cada segundo: los tramos se achican.'],
          dibujo: avenida(Object.assign(regla(0, 40), { x0: 0, v: 12, a: -3, segundos: 4, crece: true, lugares: [COLEGIO] })) },
        { titulo: 'Distancia de frenado', texto: ['La distancia de frenado es lo que avanza la combi desde que pisa el freno hasta que se detiene. Al detenerse, ', Mv, ' = 0 y se queda ahí: no retrocede.'] },
        { titulo: 'Qué mirar al jugar', texto: 'La combi llega a 10 m/s frente al colegio y tú eliges qué tan fuerte frena. Mira cuántos segundos tarda en parar y en qué marca de la regla se detiene.' },
      ],
    },
    ejemplos: EJEMPLOS_ECU,
    juega: {
      pieza: 'fis-combi',
      consigna: 'Frente al colegio (x = 0), la combi va a 10 m/s y empieza a frenar parejo. El paso de cebra está a 25 m.',
      mision: {
        texto: 'Elige el freno para que pare justo en el paso de cebra.',
        logrado: val => val.a === -2,
        bien: 'Listo: para en el paso de cebra. ¿Cuántos segundos tardó? Mira el reloj.',
      },
      voz: 'Mira dónde se detiene y cuánto tarda.',
      leyenda: [
        { s: [Mv0], t: 'la velocidad al empezar a frenar' },
        { s: [Ma], t: 'cuánto pierde por segundo, con su signo' },
        { s: [Mdx], t: 'lo que avanza hasta parar' },
        { s: [Mt], t: 'segundos desde que empieza a frenar' },
        { s: 'media', t: 'la velocidad media mientras frena' },
        { s: 'combi tenue', t: 'dónde estaba en cada segundo' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Frena, a', color: 'c-h', min: -5, max: -1, paso: 0.5, inicio: -1, unidad: 'm/s²', decimales: 1 },
        { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: 10.5, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: juegoB2,
      lectura: val => ['Para en ', pt(`${fm(paraB2(val.a))} s`), ' y ', pdx(`${fm(dxB2(val.a))} m`), ': media de ', pv(ms(dxB2(val.a) / paraB2(val.a)))],
      resumen: { a: -2.5, t: 4 },
      minimo: 3,
    },
    predice: {
      pregunta: ['Otra combi, con el mismo freno del juego, llega al doble de rápido: ', pv('20 m/s'), '. ¿Cuánto recorre hasta parar?'],
      datos: ['En el juego, con 2 m/s² de freno, la combi que llegó a 10 m/s paró en 25 m.'],
      opciones: [
        { id: 'c', texto: '100 m', correcta: true },
        { id: 'doble', texto: '50 m', error: 'PR1-frenado', siFuera: 'Bien que crezca: tarda el doble en parar. Pero en cada segundo también va más rápido.' },
        { id: 'igual', texto: '25 m', error: 'MRUV-FRENO-IGUAL', siFuera: 'Bien: el freno es el mismo. Pero tiene que quitar el doble de velocidad.' },
        { id: 'sin-medio', texto: '200 m', error: 'MRUV-VT', siFuera: 'Bien los 10 s de frenado. Pero no va a 20 m/s todo el tiempo: su media es 10.' },
      ],
      dibujo: avenida(Object.assign(regla(0, 120), { x0: 0, v: 20, segundos: 0, crece: true, lugares: [COLEGIO] })),
      revelar: avenida(Object.assign({}, MIRA_B2, { posiciones: [{ en: 100, texto: 'para', color: 'f' }] }), { corte: 10 }),
      coincide: 'Coincide: tarda el doble en parar y su media es el doble: cuatro veces.',
    },
    mira: {
      datos: MIRA_B2,
      pasos: [
        { estado: { corte: 0 }, texto: 'Llega a 20 m/s y pierde 2 m/s cada segundo.', ecuacion: [Mv0, ' = ', pv('20 m/s'), ';   ', Ma, ' = ', pa('−2 m/s²')] },
        { estado: { corte: 10 }, texto: 'Tarda 10 s en parar: el doble que a 10 m/s.', ecuacion: ['0 = ', pv('20'), ' + (', pa('−2'), ') · ', Mt, '   →   ', Mt, ' = ', pt('10 s')] },
        { estado: { corte: 10 }, texto: 'Su velocidad baja pareja: la media es la mitad de 20 + 0.', ecuacion: [MEDIA, ' = ', { frac: [[pv('20'), ' + 0'], '2'] }, ' = ', pv('10 m/s')] },
        { estado: { corte: 10 }, texto: 'Lo que avanza es la media por el tiempo.', ecuacion: [Mdx, ' = ', MEDIA, ' · ', Mt, ' = ', pv('10'), ' · ', pt('10'), ' = ', pdx('100 m')] },
        { estado: { corte: 10 }, texto: 'Doble rapidez: doble tiempo y doble media. Cuatro veces la distancia.', ecuacion: ['2 · 2 = 4;   4 · ', pdx('25 m'), ' = ', pdx('100 m')] },
        { estado: { corte: 10 }, texto: 'Sin el tiempo, la cuarta ecuación da lo mismo.', ecuacion: ['0 = ', pv('20'), '² + 2 · (', pa('−2'), ') · ', Mdx, '   →   ', Mdx, ' = ', pdx('100 m')] },
        { estado: { corte: 10 }, texto: 'La ecuación horaria da la posición en cada instante.', ecuacion: [Mx, ' = 0 + ', pv('20'), ' · ', pt('10'), ' − ½ · ', pa('2'), ' · ', pt('10'), '² = ', px('100 m')] },
      ],
    },
    regla: {
      texto: 'Con aceleración constante valen cuatro ecuaciones; cada una deja fuera una magnitud. La academia escribe d = v₀t ± ½at²: ese ± es el signo de a.',
      ecuacion: [Mv, ' = ', Mv0, ' + ', Ma, Mt, '   ·   ', Mdx, ' = ', MEDIA, ' · ', Mt, '   ·   ', Mx, ' = ', Mx0, ' + ', Mv0, Mt, ' + ½', Ma, Mt2,
        '   ·   ', { sup: [Mv, '2'] }, ' = ', { sup: [Mv0, '2'] }, ' + 2', Ma, Mdx],
      condicion: 'a no cambia en el tramo. Al frenar hasta v = 0, la combi se detiene: no retrocede.',
    },
    resuelve: {
      pieza: 'fis-combi',
      generar(s) {
        const r = azar(s + 900);
        let vi, ai, D, T;
        do { vi = r.de([8, 10, 12, 15, 16, 18, 20]); ai = -r.de([1, 2, 2.5, 4, 5]); D = vi * vi / (-2 * ai); T = vi / -ai; } while (D > 80 || D < 20 || !Number.isInteger(D * 4));
        const enun = ['Frente al colegio, una combi va a ', pv(ms(vi)), ' y frena parejo hasta detenerse ', pdx(`${fm(D)} m`), ' más adelante. '];
        const dib = avenida(Object.assign(regla(0, D <= 40 ? 40 : 80), { x0: 0, v: vi, segundos: 0, rotulos: false, lugares: [COLEGIO, { en: D, texto: 'Para aquí' }] }));
        if (s % 2 === 0) return {
          enunciado: [...enun, '¿Cuál es su aceleración?'], datos: DATOS_B2, dibujo: dib,
          pasos: [
            { tipo: 'pide', texto: ['Piden la aceleración ', Ma, ' mientras frena.'] },
            { tipo: 'datos', texto: ['Sale a ', pv(ms(vi)), ', termina en ', Mv, ' = 0 y avanza ', pdx(`${fm(D)} m`), '. No dan el tiempo.'] },
            { tipo: 'regla', texto: ['La ecuación que no usa el tiempo: ', { sup: [Mv, '2'] }, ' = ', { sup: [Mv0, '2'] }, ' + 2', Ma, Mdx, '. Se despeja ', Ma, '.'] },
            { tipo: 'cuentas', texto: 'Se reemplaza:', ecuacion: ['0 = ', pv(fm(vi)), '² + 2 · ', Ma, ' · ', pdx(fm(D)), '   →   ', Ma, ' = ', { frac: [`−${fm(vi * vi)}`, fm(2 * D)] }, ' = ', pa(ms2(ai))] },
            { tipo: 'sentido', texto: 'Negativa: va contra la velocidad, porque frena. Es lo esperado.' },
          ],
          respuesta: [pa(`a = ${ms2(ai)}`)],
        };
        return {
          enunciado: [...enun, '¿Cuánto tarda en detenerse?'], datos: DATOS_B2, dibujo: dib,
          pasos: [
            { tipo: 'pide', texto: ['Piden el tiempo ', Mt, ' que tarda en parar.'] },
            { tipo: 'datos', texto: ['Sale a ', pv(ms(vi)), ', termina en ', Mv, ' = 0 y avanza ', pdx(`${fm(D)} m`), '. No dan la aceleración.'] },
            { tipo: 'regla', texto: ['La ecuación sin aceleración: ', Mdx, ' = ', MEDIA, ' · ', Mt, '. Se despeja ', Mt, '.'] },
            { tipo: 'cuentas', texto: `La media es la mitad de ${fm(vi)} + 0:`, ecuacion: [pdx(fm(D)), ' = ', { frac: [[pv(fm(vi)), ' + 0'], '2'] }, ' · ', Mt, '   →   ', Mt, ' = ', pt(`${fm(T)} s`)] },
            { tipo: 'sentido', texto: `Comprobación: ${fm(vi / 2)} m/s de media durante ${fm(T)} s son ${fm(D)} m.` },
          ],
          respuesta: ['Tarda ', pt(`${fm(T)} s`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-combi',
      generar(s) {
        const r = azar(s + 47), k = s % 4, m = n => `${fm(n)} m`;
        if (k === 0) {
          let vi, ai, D;
          do { vi = r.de([10, 12, 14, 15, 16, 18, 20]); ai = -r.de([1, 2, 2.5, 4, 5]); D = vi * vi / (-2 * ai); } while (D > 120);
          return {
            pregunta: ['Una combi va a ', pv(ms(vi)), ' y frena con ', pa(`a = ${ms2(ai)}`), ' hasta parar. ¿Cuántos metros recorre hasta detenerse?'],
            datos: DATOS_B2,
            dibujo: avenida(Object.assign(regla(0, D <= 60 ? 60 : 120), { x0: 0, v: vi, segundos: 0, rotulos: false, lugares: [COLEGIO] })),
            opciones: cuatro(D, [
              { id: 'sin-2', valor: 2 * D, error: 'MRUV-VT', siFuera: `Bien el ${fm(vi)}². Pero se divide entre 2 · ${fm(-ai)}, no solo entre ${fm(-ai)}.` },
              { id: 'tiempo', valor: vi / -ai, error: 'MRUV-TIEMPO', siFuera: `Bien: tarda ${fm(vi / -ai)} s en parar. Pero piden metros, no segundos.` },
              { id: 'signo', valor: -D, error: 'MRUV-SIGNO-D', siFuera: 'Bien el valor. Pero avanza hacia adelante: Δx es positivo; la negativa es a.' },
            ], m),
            solucion: { texto: ['Al parar, ', Mv, ' = 0; sin el tiempo, se despeja Δx.'], ecuacion: [Mdx, ' = ', { frac: [`${fm(vi)}²`, `2 · ${fm(-ai)}`] }, ' = ', pdx(m(D))] },
          };
        }
        if (k === 1) {
          const sube = r.ent(0, 1) === 1;
          let vi, vf, ti;
          do { vi = r.de([2, 4, 6, 8, 10, 12, 14]); vf = r.de([2, 4, 6, 8, 10, 12, 14, 16]); ti = r.ent(2, 6); } while (sube ? vf <= vi : vf >= vi);
          const D = (vi + vf) / 2 * ti;
          return {
            pregunta: ['Una combi pasa por el grifo a ', pv(ms(vi)), ' y ', sube ? 'acelera' : 'frena', ' parejo: ', pt(`${fm(ti)} s`), ' después va a ', pv(ms(vf)), '. ¿Cuánto avanzó en ese tiempo?'],
            datos: DATOS_B2,
            opciones: cuatro(D, [
              { id: 'final', valor: vf * ti, error: 'DX-RECT', siFuera: `Bien que multipliques por ${fm(ti)} s. Pero no fue a ${fm(vf)} m/s todo el tiempo.` },
              { id: 'sin-medio', valor: (vi + vf) * ti, error: 'DX-SEMI', siFuera: 'Bien la suma de las velocidades. Pero la media es la mitad de esa suma.' },
              { id: 'inicial', valor: vi * ti, error: 'DX-INICIAL', siFuera: `Bien que multipliques por ${fm(ti)} s. Pero su velocidad cambió desde ${fm(vi)} m/s.` },
              { id: 'acel', valor: Math.abs(vf - vi) / ti, error: 'MRUV-ACEL', siFuera: 'Ese número es cuánto cambia v por segundo: la aceleración, no lo que avanzó.' },
            ], m),
            solucion: { texto: 'La velocidad cambia pareja: la media por el tiempo.', ecuacion: [Mdx, ' = ', { frac: [[pv(fm(vi)), ' + ', pv(fm(vf))], '2'] }, ' · ', pt(fm(ti)), ' = ', pdx(m(D))] },
          };
        }
        if (k === 2) {
          const x0 = r.de([40, 50, 60]), vi = r.de([2, 4, 6]), ai = r.de([1, 2, 3]), ti = r.ent(2, 6), X = x0 + vi * ti + ai * ti * ti / 2;
          const dib = avenida(Object.assign(regla(0, X <= 140 ? 140 : X <= 200 ? 200 : 300), { x0, v: vi, segundos: 0, rotulos: false, lugares: [PARADERO[0], { en: x0, texto: 'Grifo' }] }));
          return {
            pregunta: ['El grifo está a ', px(`${x0} m`), ' del paradero. Una combi pasa por el grifo a ', pv(ms(vi)), ' y acelera con ', pa(`a = ${ms2(ai)}`), '. ¿A qué distancia del paradero está ', pt(`${ti} s`), ' después?'],
            datos: DATOS_B2, dibujo: dib,
            opciones: cuatro(X, [
              { id: 'sin-x0', valor: X - x0, error: 'MRU-X0', siFuera: `Bien lo que avanzó desde el grifo. Pero el grifo ya estaba a ${x0} m del paradero.` },
              { id: 'sin-medio', valor: x0 + vi * ti + ai * ti * ti, error: 'MRUV-MEDIO', siFuera: 'Bien que partas del grifo. Pero el término de a lleva un ½.' },
              { id: 'sin-cuadrado', valor: x0 + vi * ti + ai * ti / 2, error: 'K-CUADRADO', siFuera: 'Bien que partas del grifo. Pero el tiempo va al cuadrado en ½ · a · t².' },
              { id: 'sin-a', valor: x0 + vi * ti, error: 'MRUV-SIN-A', siFuera: 'Eso sería sin acelerar. Va cada vez más rápido: falta ½ · a · t².' },
            ], m),
            solucion: { texto: 'La ecuación horaria, con el paradero en el 0:', ecuacion: [Mx, ' = ', px(fm(x0)), ' + ', pv(fm(vi)), ' · ', pt(fm(ti)), ' + ½ · ', pa(fm(ai)), ' · ', pt(fm(ti)), '² = ', px(m(X))] },
          };
        }
        // Nivel examen (San Marcos 2019-II, 2026-I, 2025-II y 2026-II): frenado en km/h, la distancia con otra rapidez y la
        // ecuación horaria (velocidad en un instante o desplazamiento entre dos).
        const e = Math.floor(s / 4) % 4;
        if (e === 0) {
          const K = r.de([36, 54, 72, 90]), ai = -r.de([2.5, 5]), vi = K / 3.6, D = vi * vi / (-2 * ai);
          return {
            pregunta: ['Una combi va a ', pv(`${K} km/h`), ' y frena con ', pa(`a = ${ms2(ai)}`), ' hasta detenerse. ¿Cuál es su distancia de frenado?'],
            datos: [...DATOS_B2, DA.kmh],
            opciones: cuatro(D, [
              { id: 'kmh', valor: K * K / (-2 * ai), error: 'U1-kmh', siFuera: 'Bien la ecuación sin tiempo. Pero con los km/h: falta pasar a m/s.' },
              { id: 'sin-2', valor: 2 * D, error: 'MRUV-VT', siFuera: `Bien los ${fm(vi)} m/s. Pero se divide entre 2 · ${fm(-ai)}.` },
              { id: 'tiempo', valor: vi / -ai, error: 'MRUV-TIEMPO', siFuera: `Bien los ${fm(vi)} m/s. Ese número es el tiempo de frenado, en segundos.` },
            ], m),
            solucion: { texto: `${K} km/h = ${fm(vi)} m/s; al parar, v = 0.`, ecuacion: [Mdx, ' = ', { frac: [`${fm(vi)}²`, `2 · ${fm(-ai)}`] }, ' = ', pdx(m(D))] },
          };
        }
        if (e === 1) {
          const [K1, K2] = r.de([[36, 72], [36, 54], [30, 90], [18, 54], [40, 60], [36, 108]]), k = K2 / K1, D1 = r.de([4, 6, 8, 10, 12]), D2 = D1 * k * k;
          return {
            pregunta: ['Una combi a ', pv(`${K1} km/h`), ' necesita ', pdx(`${D1} m`), ' para frenar hasta parar. Con el mismo freno, ¿cuánto necesita a ', pv(`${K2} km/h`), '?'],
            datos: [...DATOS_B2, DA.kmh],
            opciones: cuatro(D2, [
              { id: 'doble', valor: D1 * k, error: 'PR1-frenado', siFuera: `Bien que crezca ${fm(k)} veces el tiempo de frenado. Pero también la media crece ${fm(k)} veces.` },
              { id: 'igual', valor: D1, error: 'MRUV-FRENO-IGUAL', siFuera: 'Bien: el freno es el mismo. Pero hay que quitar más velocidad.' },
              { id: 'vt', valor: 2 * k * D1, error: 'MRUV-VT', siFuera: `Eso usa ${K2} km/h durante todo el frenado; mientras frena, la media es la mitad.` },
            ], m),
            solucion: { texto: `Con el mismo a, la distancia va con v²: (${K2}/${K1})² = ${fm(k * k)}.`, ecuacion: [pdx(`${D1} m`), ` · ${fm(k * k)} = `, pdx(m(D2))] },
          };
        }
        let x0, b, c, t1, t2;
        do { x0 = r.de([2, 4, 5, 8]); b = r.de([6, 8, 10, 12]); c = r.de([1, 2]); t1 = r.ent(1, 3); t2 = t1 + r.ent(1, 3); } while (b - 2 * c * t2 <= 0);
        const xe = t => x0 + b * t - c * t * t, ecu = [Mx, ` = ${x0} + `, pv(String(b)), Mt, ' − ', c === 1 ? '' : String(c), Mt2];
        if (e === 2) {
          const vq = b - 2 * c * t1;
          return {
            pregunta: ['La posición de una combi es ', ...ecu, ' (en m y s). ¿Qué velocidad tiene a los ', pt(`${t1} s`), '?'],
            datos: DATOS_B2,
            opciones: cuatro(vq, [
              { id: 'medio', valor: b - c * t1, error: 'MRUV-MEDIO-A', siFuera: `Bien la idea de v = v₀ + a·t. Pero −${c} es ½ · a: a = −${2 * c} m/s².` },
              { id: 'posicion', valor: xe(t1), error: 'MRUV-POSICION', siFuera: 'Ese es el valor de x a ese instante: una posición, no una velocidad.' },
              { id: 'v0', valor: b, error: 'MRUV-SIN-A', siFuera: `Bien: sale a ${b} m/s. Pero frena: su velocidad cambia con el tiempo.` },
              { id: 'signo', valor: b + 2 * c * t1, error: 'K-SIGNO', siFuera: `Bien el ${2 * c} · ${t1}. Pero a es negativa: se resta.` },
            ], ms),
            solucion: { texto: ['Comparando: ', Mv0, ` = ${b} m/s y ½ · a = −${c}, así que a = −${2 * c} m/s².`], ecuacion: [Mv, ` = ${b} − ${2 * c} · `, pt(String(t1)), ' = ', pv(ms(vq))] },
          };
        }
        const D = xe(t2) - xe(t1);
        return {
          pregunta: ['La posición de una combi es ', ...ecu, ' (en m y s). ¿Cuál es su desplazamiento entre ', pt(`t = ${t1} s`), ' y ', pt(`t = ${t2} s`), '?'],
          datos: DATOS_B2,
          opciones: cuatro(D, [
            { id: 'final', valor: xe(t2), error: 'MRUV-POSICION-FINAL', siFuera: `Esa es su posición a los ${t2} s. El desplazamiento resta la de los ${t1} s.` },
            { id: 'desde-0', valor: xe(t2) - x0, error: 'MRUV-DESDE-0', siFuera: `Bien la resta. Pero desde t = ${t1} s, no desde t = 0.` },
            { id: 'sin-a', valor: b * (t2 - t1), error: 'MRUV-SIN-A', siFuera: `Bien los ${t2 - t1} s. Pero no va siempre a ${b} m/s: frena.` },
          ], m),
          solucion: { texto: `x(${t2}) = ${fm(xe(t2))} m y x(${t1}) = ${fm(xe(t1))} m.`, ecuacion: [Mdx, ` = ${fm(xe(t2))} − ${fm(xe(t1))} = `, pdx(m(D))] },
        };
      },
    },
  };

  // ---------- Idea 3 (B3): la gráfica velocidad–tiempo ----------
  // Pieza fis-mruv, vista «pista»: el atleta en los 100 m y, debajo, su gráfica v–t que se dibuja con el reloj. Cambia:
  // cuánto tiempo acelera y su rapidez tope · Permanece: la meta a 100 m · Progresa: el reloj; el área bajo la línea se
  // llena mientras corre · Se reserva: ir hacia atrás (v negativa, área bajo el eje), solo en Predice y Mira · Debe verse:
  // el área violeta crece justo lo que avanza el atleta.
  const ejT = (max, paso = 1, o = {}) => Object.assign({ min: 0, max, paso, nombre: 't', unidad: 's', color: 'i' }, o);
  const ejV = (min, max, paso = 2, o = {}) => Object.assign({ min, max, paso, nombre: 'v', unidad: 'm/s', color: 'o' }, o);
  const ejX = (min, max, paso, o = {}) => Object.assign({ min, max, paso, nombre: 'x', unidad: 'm', color: 'f' }, o);
  const ejA = (min, max, paso, o = {}) => Object.assign({ min, max, paso, nombre: 'a', unidad: 'm/s²', color: 'h' }, o);
  const graf = (spec, estado = {}) => mruv(Object.assign({ vista: 'grafica' }, spec), estado);
  const T_B3 = 14, META = 100;
  const atletaEn = (ta, vt, t) => Math.min(META, t <= ta ? vt / ta * t * t / 2 : vt * ta / 2 + vt * (t - ta));
  const llegaB3 = (ta, vt) => ta / 2 + META / vt;
  const momentoB3 = val => {
    const fin = llegaB3(val.ta, val.vt), tt = Math.max(0, Math.min(val.t, fin)), t1 = Math.min(tt, val.ta);
    const A1 = val.vt / val.ta * t1 * t1 / 2, A2 = val.vt * Math.max(0, tt - val.ta);
    return { fin, tt, t1, A1, A2, llego: val.t >= fin - 1e-9 };
  };
  const juegoB3 = val => {
    const q = momentoB3(val), a = val.vt / val.ta, v1 = a * q.t1;
    const curva = [[0, 0], [q.t1, v1]]; if (q.tt > val.ta) curva.push([q.tt, val.vt]);
    const areas = [];
    if (q.t1 > 0) areas.push({ puntos: [[0, 0], [q.t1, v1]], color: 'f', rotulo: q.tt > val.ta && q.A1 >= 8 ? `${fm(q.A1)} m` : undefined });
    if (q.tt > val.ta) areas.push({ puntos: [[val.ta, val.vt], [q.tt, val.vt]], color: 'f', rotulo: q.tt - val.ta >= 2.5 ? `${fm(q.A2)} m` : undefined });
    // El escalón de la pendiente se ve mientras acelera; después, el rótulo del triángulo ocupa ese lugar.
    const t0 = val.ta / 2 - 0.5, esc = val.ta >= 2 && q.tt >= t0 + 1 && q.tt <= val.ta + 1e-9;
    const marcas = []; for (let k = 1; k <= Math.floor(q.tt + 1e-9); k++) marcas.push(atletaEn(val.ta, val.vt, k));
    return mruv({ vista: 'pista', largo: META, x: atletaEn(val.ta, val.vt, q.tt), marcas,
      grafica: { x: ejT(T_B3, 1, { cada: 2 }), y: ejV(0, 12, 2), alto: 120, curvas: [{ puntos: curva, color: 'o' }], areas,
        escalones: esc ? [{ t: t0, dt: 1, v: a * t0, a }] : [], textos: esc ? [{ en: [t0, a * t0 + a], texto: 'a', color: 'h', ancla: 'end', dx: -3, dy: -2 }] : [] } });
  };
  // El mototaxi que avanza y retrocede (la predicción): rectángulos sobre y bajo el eje.
  const idaVueltaB3 = (rot, desde = {}) => ({ x: ejT(8, 1), y: ejV(-2, 5, 1), alto: 150,
    curvas: [{ puntos: [[0, 4], [3, 4], null, [3, -1.5], [7, -1.5]], color: 'o' }],
    areas: [{ puntos: [[0, 4], [3, 4]], color: 'f', rotulo: rot ? '+12 m' : undefined, desde: desde.a1 }, { puntos: [[3, -1.5], [7, -1.5]], color: 'f', rotulo: rot ? '−6 m' : undefined, desde: desde.a2 }] });
  // Una recta v–t de (0; vi) a (ti; vf), con su área si se pide.
  const rectaB3 = (vi, vf, ti, o = {}) => {
    const lo = Math.min(0, vi, vf), hi = Math.max(vi, vf), paso = hi - lo > 14 ? 4 : 2;
    return graf({ x: ejT(Math.max(ti, 2) + (o.extra || 0), 1), y: ejV(Math.floor(lo / paso) * paso, Math.ceil((hi + 1) / paso) * paso, paso), alto: 140,
      curvas: [{ puntos: [[0, vi], [ti, vf]], color: 'o' }], areas: o.area ? [{ puntos: [[0, vi], [ti, vf]], color: 'f', rotulo: o.area === true ? undefined : o.area }] : [] });
  };
  const DB3 = [
    ['Pendiente de la gráfica v–t: ', Ma, ' = ', { frac: [Mdv, Mdt] }],
    ['Área bajo la gráfica v–t: ', Mdx, ', con su signo (bajo el eje, negativa).'],
    'La distancia recorrida suma las áreas sin signo.',
    'Rectángulo: base · altura. Triángulo: base · altura ÷ 2. Trapecio: (base 1 + base 2) ÷ 2 · altura.',
    '+ hacia adelante; v negativa: va hacia atrás.',
  ];

  // Ejemplos de B3. Cuentas rehechas aparte (scratchpad f3/cuentas.js, 18 nov): (14 − 2)/4; 5·8; 8·4/2; (0 − 12)/6;
  // −2·5; (4 + 10)/2·6 y (10 − 4)/6; 9·3/2 + 9·5; 6·4 − 3·2 y 6·4 + 3·2; (12·4/2 + 12·2)/6; (−4 − 8)/6, 8·4/2 y 4·2/2;
  // 2·√(400/1); (18 − 10)/(6 − 2), 10 − 2·2 y (6 + 18)/2·6; 2·36/12 y −12/6; 6·3/2 y 4·2/2; 100 = 10·(12 − tₐ/2).
  const EJEMPLOS_VT = [
    { nivel: 1, titulo: 'Leer la pendiente',
      figura: rectaB3(2, 14, 4),
      enunciado: ['La gráfica v–t de una combi es una recta que va de ', pv('2 m/s'), ' a ', pv('14 m/s'), ' en ', pt('4 s'), '. ¿Cuál es su aceleración?'],
      datos: DB3,
      solucion: [{ texto: 'La pendiente es cuánto sube v por cada segundo:', ecuacion: [Ma, ' = ', { frac: [[pv('14'), ' − ', pv('2')], pt('4')] }, ' = ', pa('3 m/s²')] }],
      respuesta: [pa('a = 3 m/s²')] },
    { nivel: 1, titulo: 'Área de un rectángulo',
      figura: graf({ x: ejT(10, 1, { cada: 2 }), y: ejV(0, 6, 2), alto: 120, curvas: [{ puntos: [[0, 5], [8, 5]], color: 'o' }], areas: [{ puntos: [[0, 5], [8, 5]], color: 'f' }] }),
      enunciado: ['Una ciclista va a ', pv('5 m/s'), ' durante ', pt('8 s'), ': su gráfica v–t es una horizontal. ¿Cuánto avanza?'],
      datos: DB3,
      solucion: [{ texto: 'Lo que avanza es el área bajo la línea: un rectángulo.', ecuacion: [Mdx, ' = ', pv('5'), ' · ', pt('8'), ' = ', pdx('40 m')] }],
      respuesta: ['Avanza ', pdx('40 m')] },
    { nivel: 1, titulo: 'Área de un triángulo',
      figura: rectaB3(0, 8, 4, { area: true }),
      enunciado: ['Un atleta sale del reposo y llega a ', pv('8 m/s'), ' en ', pt('4 s'), ', acelerando parejo. ¿Cuánto avanza en esos 4 s?'],
      datos: DB3,
      solucion: [{ texto: 'El área bajo la recta es un triángulo de base 4 s y altura 8 m/s.', ecuacion: [Mdx, ' = ', { frac: [[pt('4'), ' · ', pv('8')], '2'] }, ' = ', pdx('16 m')] }],
      respuesta: ['Avanza ', pdx('16 m')] },
    { nivel: 1, titulo: 'Una recta que baja',
      figura: rectaB3(12, 0, 6),
      enunciado: ['La gráfica v–t de una combi que frena es una recta de ', pv('12 m/s'), ' a 0 en ', pt('6 s'), '. ¿Cuál es su aceleración?'],
      datos: DB3,
      solucion: [{ texto: 'La recta baja: la pendiente es negativa.', ecuacion: [Ma, ' = ', { frac: [['0 − ', pv('12')], pt('6')] }, ' = ', pa('−2 m/s²')] }],
      respuesta: [pa('a = −2 m/s²')] },
    { nivel: 1, titulo: 'Bajo el eje',
      figura: graf({ x: ejT(6, 1), y: ejV(-4, 2, 1), alto: 120, curvas: [{ puntos: [[0, -2], [5, -2]], color: 'o' }], areas: [{ puntos: [[0, -2], [5, -2]], color: 'f' }] }),
      enunciado: ['Un mototaxi retrocede a ', pv('2 m/s'), ' durante ', pt('5 s'), ': en su gráfica v–t, la línea está en ', pv('−2 m/s'), '. ¿Cuál es su desplazamiento?'],
      datos: DB3,
      solucion: [{ texto: 'El área está bajo el eje: cuenta negativa.', ecuacion: [Mdx, ' = (', pv('−2'), ') · ', pt('5'), ' = ', pdx('−10 m')] }],
      respuesta: [pdx('Δx = −10 m'), ': 10 m hacia atrás'] },
    { nivel: 2, titulo: 'Un trapecio',
      figura: rectaB3(4, 10, 6, { area: true }),
      enunciado: ['La velocidad de una combi sube en línea recta de ', pv('4 m/s'), ' a ', pv('10 m/s'), ' en ', pt('6 s'), '. ¿Cuál es su aceleración y cuánto avanza?'],
      datos: DB3,
      solucion: [
        { texto: 'La pendiente:', ecuacion: [Ma, ' = ', { frac: [[pv('10'), ' − ', pv('4')], pt('6')] }, ' = ', pa('1 m/s²')] },
        { texto: 'El área bajo la recta es un trapecio de bases 4 y 10 y altura 6 s:', ecuacion: [Mdx, ' = ', { frac: [[pv('4'), ' + ', pv('10')], '2'] }, ' · ', pt('6'), ' = ', pdx('42 m')] },
      ],
      respuesta: [pa('a = 1 m/s²'), ' y ', pdx('Δx = 42 m')] },
    { nivel: 2, titulo: 'Acelera y sigue parejo',
      figura: graf({ x: ejT(9, 1), y: ejV(0, 10, 2), alto: 130, curvas: [{ puntos: [[0, 0], [3, 9], [8, 9]], color: 'o' }], areas: [{ puntos: [[0, 0], [3, 9], [8, 9]], color: 'f' }] }),
      enunciado: ['Un atleta acelera desde el reposo hasta ', pv('9 m/s'), ' en ', pt('3 s'), ' y sigue a esa rapidez ', pt('5 s'), ' más. ¿Cuánto avanza en total?'],
      datos: DB3,
      solucion: [
        { texto: 'El área se parte en un triángulo y un rectángulo:', ecuacion: [{ frac: [[pt('3'), ' · ', pv('9')], '2'] }, ' = ', pdx('13,5 m'), ';   ', pv('9'), ' · ', pt('5'), ' = ', pdx('45 m')] },
        { texto: 'Se suman:', ecuacion: [Mdx, ' = ', pdx('13,5'), ' + ', pdx('45'), ' = ', pdx('58,5 m')] },
      ],
      respuesta: ['Avanza ', pdx('58,5 m')] },
    { nivel: 2, titulo: 'Ida y vuelta',
      figura: graf({ x: ejT(7, 1), y: ejV(-4, 8, 2), alto: 140, curvas: [{ puntos: [[0, 6], [4, 6], null, [4, -3], [6, -3]], color: 'o' }],
        areas: [{ puntos: [[0, 6], [4, 6]], color: 'f' }, { puntos: [[4, -3], [6, -3]], color: 'f' }] }),
      enunciado: ['Un mototaxi va a ', pv('6 m/s'), ' durante ', pt('4 s'), ' y retrocede a ', pv('3 m/s'), ' durante ', pt('2 s'), '. ¿Cuál es su desplazamiento y cuánto recorrió?'],
      datos: DB3,
      solucion: [
        { texto: 'Las dos áreas, con su signo:', ecuacion: [pv('6'), ' · ', pt('4'), ' = ', pdx('+24 m'), ';   (', pv('−3'), ') · ', pt('2'), ' = ', pdx('−6 m')] },
        { texto: 'El desplazamiento las suma con signo; la distancia recorrida, sin signo:', ecuacion: [Mdx, ' = 24 − 6 = ', pdx('18 m'), ';   d = 24 + 6 = 30 m'] },
      ],
      respuesta: [pdx('Δx = 18 m'), '; recorrió 30 m'] },
    { nivel: 2, titulo: 'La velocidad media',
      figura: graf({ x: ejT(7, 1), y: ejV(0, 14, 2), alto: 130, curvas: [{ puntos: [[0, 0], [4, 12], [6, 12]], color: 'o' }], areas: [{ puntos: [[0, 0], [4, 12], [6, 12]], color: 'f' }] }),
      enunciado: ['Una combi arranca y llega a ', pv('12 m/s'), ' en ', pt('4 s'), '; después va así ', pt('2 s'), '. ¿Cuál es su velocidad media en los ', pt('6 s'), '?'],
      datos: [...DB3.slice(0, 2), DB3[3], ['Velocidad media: ', Mvm, ' = ', { frac: [Mdx, Mdt] }]],
      solucion: [
        { texto: 'Lo que avanzó, con el área: triángulo más rectángulo.', ecuacion: [Mdx, ' = ', { frac: [[pt('4'), ' · ', pv('12')], '2'] }, ' + ', pv('12'), ' · ', pt('2'), ' = 24 + 24 = ', pdx('48 m')] },
        { texto: 'Entre el tiempo total:', ecuacion: [Mvm, ' = ', { frac: [pdx('48'), pt('6')] }, ' = ', pv('8 m/s')] },
      ],
      respuesta: [pv('8 m/s')] },
    { nivel: 2, titulo: 'La recta cruza el eje',
      figura: rectaB3(8, -4, 6),
      enunciado: ['La velocidad de un mototaxi baja en línea recta de ', pv('8 m/s'), ' a ', pv('−4 m/s'), ' en ', pt('6 s'), ': frena y sigue en reversa. ¿Cuál es su desplazamiento?'],
      datos: DB3,
      solucion: [
        { texto: ['La pendiente es (−4 − 8) ÷ 6 = −2 m/s²: v llega a 0 a los 8 ÷ 2 = ', pt('4 s'), '.'] },
        { texto: 'Dos triángulos: uno sobre el eje y otro bajo el eje.', ecuacion: [{ frac: [[pt('4'), ' · ', pv('8')], '2'] }, ' = ', pdx('+16 m'), ';   ', { frac: [[pt('2'), ' · ', pv('4')], '2'] }, ' = ', pdx('4 m'), ' bajo el eje'] },
        { texto: 'Con su signo:', ecuacion: [Mdx, ' = 16 − 4 = ', pdx('12 m')] },
      ],
      respuesta: [pdx('Δx = 12 m')] },
    { nivel: 3, titulo: 'El tiempo mínimo',
      enunciado: ['Un tren sale del reposo y acelera con ', pa('1 m/s²'), '; después frena con ', pa('1 m/s²'), ' y para en la estación siguiente, a ', pdx('400 m'), '. ¿Cuál es el menor tiempo del viaje?'],
      alternativas: ['20 s', '28,28 s', '40 s', '80 s', '400 s'],
      datos: DB3,
      solucion: [
        { texto: 'Lo más rápido es acelerar hasta la mitad del tiempo y frenar el resto: la gráfica v–t es un triángulo.' },
        { texto: ['Si el viaje dura ', Mt, ', la velocidad tope es ', pv('vₘₐₓ'), ' = 1 · t/2, y el área es el camino:'], ecuacion: [pdx('400'), ' = ', { frac: [[Mt, ' · ', { frac: [Mt, '2'] }], '2'] }, '   →   ', Mt2, ' = 1600   →   ', Mt, ' = ', pt('40 s')] },
        { texto: ['La ', neg('A'), ' es solo la subida; la ', neg('B'), ' es como si acelerara todo el camino.'] },
      ],
      respuesta: [neg('C'), ', ', pt('40 s')] },
    { nivel: 3, titulo: 'Leer v₀ en la gráfica',
      figura: graf({ x: ejT(7, 1), y: ejV(0, 20, 4), alto: 140, curvas: [{ puntos: [[2, 10], [6, 18]], color: 'o' }],
        puntos: [{ x: 2, y: 10, color: 'o', guias: true }, { x: 6, y: 18, color: 'o', guias: true }] }),
      enunciado: ['La gráfica v–t de una combi es una recta que pasa por (', pt('2 s'), '; ', pv('10 m/s'), ') y (', pt('6 s'), '; ', pv('18 m/s'), '). ¿Cuánto valía v en t = 0 y cuánto avanzó de 0 a 6 s?'],
      alternativas: ['10 m/s y 84 m', '0 y 54 m', '6 m/s y 144 m', '6 m/s y 72 m', '8 m/s y 78 m'],
      datos: DB3,
      solucion: [
        { texto: 'La pendiente, con los dos puntos:', ecuacion: [Ma, ' = ', { frac: [[pv('18'), ' − ', pv('10')], [pt('6'), ' − ', pt('2')]] }, ' = ', pa('2 m/s²')] },
        { texto: 'Desde t = 2 s hacia atrás pierde 2 m/s por segundo; el área es un trapecio.', ecuacion: [Mv0, ' = 10 − 2 · 2 = ', pv('6 m/s'), ';   ', Mdx, ' = ', { frac: [[pv('6'), ' + ', pv('18')], '2'] }, ' · ', pt('6'), ' = ', pdx('72 m')] },
        { texto: ['La ', neg('A'), ' toma el primer punto como v₀; la ', neg('B'), ' cree que la recta sale de 0.'] },
      ],
      respuesta: [neg('D'), ', ', pv('6 m/s'), ' y ', pdx('72 m')] },
    { nivel: 3, titulo: 'La aceleración desde el área',
      enunciado: ['Una ciclista va a ', pv('12 m/s'), ' y frena parejo hasta detenerse. En su gráfica v–t, el área bajo la recta es ', pdx('36 m'), '. ¿Cuál es su aceleración?'],
      alternativas: ['−2 m/s²', '+2 m/s²', '−4 m/s²', '−0,33 m/s²', '−6 m/s²'],
      datos: DB3,
      solucion: [
        { texto: 'El área es un triángulo de altura 12 m/s: se despeja su base, el tiempo.', ecuacion: [pdx('36'), ' = ', { frac: [[Mt, ' · ', pv('12')], '2'] }, '   →   ', Mt, ' = ', pt('6 s')] },
        { texto: 'La pendiente, de 12 a 0 en 6 s:', ecuacion: [Ma, ' = ', { frac: [['0 − ', pv('12')], pt('6')] }, ' = ', pa('−2 m/s²')] },
        { texto: ['La ', neg('B'), ' pierde el signo; la ', neg('C'), ' olvida dividir el área del triángulo entre 2.'] },
      ],
      respuesta: [neg('A'), ', ', pa('−2 m/s²')] },
    { nivel: 3, titulo: 'Frena y retrocede',
      figura: rectaB3(6, -4, 5),
      enunciado: ['La velocidad de un mototaxi baja en línea recta de ', pv('6 m/s'), ' a ', pv('−4 m/s'), ' en ', pt('5 s'), '. ¿A qué distancia de donde empezó termina, y cuánto recorrió?'],
      alternativas: ['13 m y 13 m', '5 m y 5 m', '9 m y 13 m', '2,5 m y 13 m', '5 m y 13 m'],
      datos: DB3,
      solucion: [
        { texto: ['Pendiente: (−4 − 6) ÷ 5 = −2 m/s². Llega a v = 0 a los 6 ÷ 2 = ', pt('3 s'), '.'] },
        { texto: 'Triángulo sobre el eje y triángulo bajo el eje:', ecuacion: [{ frac: [[pt('3'), ' · ', pv('6')], '2'] }, ' = ', pdx('9 m'), ';   ', { frac: [[pt('2'), ' · ', pv('4')], '2'] }, ' = ', pdx('4 m'), ' bajo el eje'] },
        { texto: ['Con signo, 9 − 4 = 5 m; sin signo, 9 + 4 = 13 m. La ', neg('C'), ' es solo la ida.'] },
      ],
      respuesta: [neg('E'), ', ', pdx('5 m'), ' y 13 m'] },
    { nivel: 3, titulo: 'La meta del atleta',
      enunciado: ['Un atleta acelera parejo desde la salida hasta ', pv('10 m/s'), ' y sigue a esa rapidez. Llega a la meta de ', pdx('100 m'), ' a los ', pt('12 s'), '. ¿Cuánto tiempo aceleró?'],
      alternativas: ['2 s', '4 s', '10 s', '8 s', '6 s'],
      datos: DB3,
      solucion: [
        { texto: ['Si acelera ', { sub: [Mt, 'a'] }, ' segundos, el área es un triángulo y un rectángulo que suman 100 m:'], ecuacion: [{ frac: [[{ sub: [Mt, 'a'] }, ' · ', pv('10')], '2'] }, ' + ', pv('10'), ' · (', pt('12'), ' − ', { sub: [Mt, 'a'] }, ') = ', pdx('100')] },
        { texto: 'Queda 120 − 5 · tₐ = 100:', ecuacion: [{ sub: [Mt, 'a'] }, ' = ', pt('4 s')] },
        { texto: ['La ', neg('C'), ' divide 100 entre 10, como si corriera parejo desde el inicio.'] },
      ],
      respuesta: [neg('B'), ', ', pt('4 s')] },
  ];

  const vt = {
    id: 'pendiente-aceleracion',
    titulo: 'La gráfica velocidad–tiempo',
    pregunta: '¿Dónde se ve, en la gráfica v–t, cuánto avanzó el atleta?',
    temas: ['Gráficas x-t, v-t y a-t'],
    pieza: 'fis-mruv',
    aprendizaje: 'En la gráfica v–t, la pendiente es la aceleración y el área es el desplazamiento: sobre el eje suma y bajo el eje resta.',
    actividad: 'Elegir cuánto acelera un atleta en los 100 metros.',
    lee: {
      tarjetas: [
        { titulo: 'Una gráfica de la velocidad', texto: ['La gráfica v–t dice qué tan rápido va el atleta en cada instante: el tiempo ', Mt, ' en el eje de abajo y la velocidad ', Mv, ' hacia arriba. No es el camino: la pista es recta.'],
          dibujo: graf({ x: ejT(8, 1), y: ejV(0, 10, 2), alto: 120, curvas: [{ puntos: [[0, 0], [3, 9], [7, 9]], color: 'o' }] }) },
        { titulo: 'La pendiente', texto: ['Si la línea sube, el atleta acelera. Cuánto sube ', Mv, ' en cada segundo es la pendiente de la línea: el escalón carmín. Si la línea es horizontal, va parejo.'] },
        { titulo: 'El área bajo la gráfica', texto: 'El área bajo la gráfica es la zona entre la línea y el eje del tiempo. Para un rectángulo, base por altura; para un triángulo, la mitad.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir cuántos segundos acelera el atleta y hasta qué rapidez. Mira cómo crece la zona violeta mientras corre, y dónde llega a la meta.' },
      ],
    },
    ejemplos: EJEMPLOS_VT,
    juega: {
      pieza: 'fis-mruv',
      consigna: 'El atleta del colegio acelera unos segundos y después corre parejo hasta la meta de los 100 m.',
      mision: {
        texto: 'Haz que llegue a la meta justo a los 12,5 s.',
        logrado: val => val.vt === 10 && val.ta === 5,
        bien: 'Listo: 100 m en 12,5 s. El área bajo la línea es lo que avanzó.',
      },
      voz: 'Mira cómo crece la zona violeta mientras corre.',
      leyenda: [
        { s: [Mv], t: 'la velocidad del atleta' },
        { s: [Mt], t: 'segundos desde la salida' },
        { s: 'zona violeta', t: 'el área bajo la línea de v' },
        { s: 'escalón carmín', t: 'lo que sube v en 1 s' },
        { s: 'rayitas naranjas', t: 'dónde estaba en cada segundo' },
      ],
      controles: [
        { id: 'ta', etiqueta: 'Acelera durante', color: 'c-i', min: 1, max: 6, paso: 0.5, inicio: 3, unidad: 's', decimales: 1 },
        { id: 'vt', etiqueta: 'Rapidez tope', color: 'c-o', min: 6, max: 10, paso: 1, inicio: 8, unidad: 'm/s', decimales: 0 },
        { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: T_B3, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: juegoB3,
      lectura: val => {
        const q = momentoB3(val);
        if (q.llego) return ['Llegó a la meta a los ', pt(`${fm(q.fin)} s`), ': ', px(`${fm(q.A1)} m`), ' + ', px(`${fm(q.A2)} m`)];
        if (q.tt > val.ta) return ['Triángulo ', px(`${fm(q.A1)} m`), ' + rectángulo ', px(`${fm(q.A2)} m`), ' = ', px(`${fm(q.A1 + q.A2)} m`)];
        return ['Área del triángulo: ', px(`${fm(q.A1)} m`), ', lo que avanzó'];
      },
      resumen: { ta: 4, vt: 8, t: 9 },
      minimo: 3,
    },
    predice: {
      pregunta: 'Un mototaxi avanza 3 s a 4 m/s y después retrocede 4 s a 1,5 m/s para estacionarse. ¿A qué distancia de donde empezó termina?',
      datos: ['El área de un rectángulo es base por altura.', 'Hacia adelante es + y hacia atrás, −.'],
      opciones: [
        { id: 'c', texto: '6 m', correcta: true },
        { id: 'suma', texto: '18 m', error: 'DX-SUMA', siFuera: 'Bien las dos áreas. Pero la de abajo es hacia atrás: se resta.' },
        { id: 'ida', texto: '12 m', error: 'DX-IDA', siFuera: 'Bien el tramo de ida: 12 m. Pero después retrocedió.' },
        { id: 'altura', texto: '5,5 m', error: 'DX-ALTURA', siFuera: 'Bien que uses las dos velocidades. Pero lo que avanza es el área, no la altura.' },
      ],
      dibujo: graf(idaVueltaB3(false)),
      revelar: graf(idaVueltaB3(true)),
      coincide: 'Coincide: avanzó 12 m y retrocedió 6 m; termina a 6 m de donde empezó.',
    },
    mira: {
      datos: Object.assign({ vista: 'grafica' }, idaVueltaB3(true, { a1: 1, a2: 2 })),
      pasos: [
        { estado: { corte: 0 }, texto: 'Primero 3 s a 4 m/s; después, 4 s a −1,5 m/s.', ecuacion: [Mv, ' = ', pv('+4 m/s'), ' y luego ', Mv, ' = ', pv('−1,5 m/s')] },
        { estado: { corte: 1 }, texto: 'Al ir hacia adelante, el área sobre el eje es lo que avanza.', ecuacion: [pv('4'), ' · ', pt('3'), ' = ', pdx('+12 m')] },
        { estado: { corte: 2 }, texto: 'Al retroceder, v es negativa: su área queda bajo el eje.', ecuacion: [pv('(−1,5)'), ' · ', pt('4'), ' = ', pdx('−6 m')] },
        { estado: { corte: 2 }, texto: 'El desplazamiento suma las áreas con su signo.', ecuacion: [Mdx, ' = 12 + (−6) = ', pdx('6 m')] },
        { estado: { corte: 2 }, texto: 'La distancia recorrida las suma sin signo: todo el camino.', ecuacion: ['d = 12 + 6 = 18 m'] },
        { estado: { corte: 2 }, texto: 'En cada tramo la línea es horizontal: pendiente 0, va parejo.', ecuacion: [Ma, ' = 0 en cada tramo'] },
      ],
    },
    regla: {
      texto: 'En la gráfica v–t, la pendiente es la aceleración y el área, el desplazamiento: sobre el eje suma, bajo el eje resta. La distancia recorrida las suma sin signo.',
      ecuacion: [Ma, ' = ', { frac: [Mdv, Mdt] }, ' = ', { llave: ['pendiente'], nota: 'de v–t', color: 'c-h' }, '   ·   ', Mdx, ' = ', { llave: ['área'], nota: 'con signo', color: 'c-f' }, '   ·   ', 'd = área sobre el eje + área bajo el eje'],
      condicion: 'la línea es v, no el camino. Las áreas se miden en m/s por s: en metros.',
      dibujo: graf({ x: ejT(6, 1), y: ejV(-4, 8, 2), alto: 150, curvas: [{ puntos: [[0, 6], [6, -3]], color: 'o' }],
        areas: [{ puntos: [[0, 6], [4, 0]], color: 'f', rotulo: 'área +' }, { puntos: [[4, 0], [6, -3]], color: 'f', rotulo: 'área −' }],
        escalones: [{ t: 0.5, dt: 1, v: 5.25, a: -1.5, rotulo: 'pendiente: a' }] }),
    },
    resuelve: {
      pieza: 'fis-mruv',
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const v = r.de([6, 8, 9, 10]), ta = r.de([2, 3, 4]), tc = r.ent(3, 6), A1 = v * ta / 2, A2 = v * tc;
          return {
            enunciado: ['Un atleta acelera parejo desde el reposo hasta ', pv(ms(v)), ' en ', pt(`${ta} s`), ' y sigue a esa rapidez ', pt(`${tc} s`), ' más. ¿Cuánto avanza en total?'],
            datos: DB3, dibujo: graf({ x: ejT(ta + tc + 1, 1), y: ejV(0, 12, 2), alto: 130, curvas: [{ puntos: [[0, 0], [ta, v], [ta + tc, v]], color: 'o' }] }),
            pasos: [
              { tipo: 'pide', texto: ['Piden lo que avanza, ', Mdx, ', en todo el tiempo.'] },
              { tipo: 'datos', texto: ['La gráfica v–t sube de 0 a ', pv(ms(v)), ' en ', pt(`${ta} s`), ' y después es horizontal durante ', pt(`${tc} s`), '.'] },
              { tipo: 'regla', texto: ['Lo que avanza es el área bajo la gráfica v–t: un triángulo y un rectángulo.'] },
              { tipo: 'cuentas', texto: 'Las dos áreas y su suma:', ecuacion: [{ frac: [[pt(String(ta)), ' · ', pv(String(v))], '2'] }, ' + ', pv(String(v)), ' · ', pt(String(tc)), ' = ', pdx(fm(A1)), ' + ', pdx(fm(A2)), ' = ', pdx(`${fm(A1 + A2)} m`)] },
              { tipo: 'sentido', texto: `Menos que ${fm(v * (ta + tc))} m, lo que haría a ${v} m/s desde el inicio: al salir iba más lento.` },
            ],
            respuesta: ['Avanza ', pdx(`${fm(A1 + A2)} m`)],
          };
        }
        const v = r.de([6, 8, 10, 12, 14]), ti = r.ent(2, 6), D = v * ti / 2;
        return {
          enunciado: ['La gráfica v–t de una ciclista que frena es una recta de ', pv(ms(v)), ' a 0 en ', pt(`${ti} s`), '. ¿Qué distancia recorre mientras frena?'],
          datos: DB3, dibujo: rectaB3(v, 0, ti),
          pasos: [
            { tipo: 'pide', texto: ['Piden lo que avanza mientras frena, ', Mdx, '.'] },
            { tipo: 'datos', texto: ['La recta baja de ', pv(ms(v)), ' a 0 en ', pt(`${ti} s`), ': todo sobre el eje.'] },
            { tipo: 'regla', texto: 'Lo que avanza es el área bajo la gráfica v–t: aquí, un triángulo.' },
            { tipo: 'cuentas', texto: 'Base por altura, entre 2:', ecuacion: [Mdx, ' = ', { frac: [[pt(String(ti)), ' · ', pv(String(v))], '2'] }, ' = ', pdx(`${fm(D)} m`)] },
            { tipo: 'sentido', texto: `Es la mitad de ${fm(v * ti)} m: frenando, su media es la mitad de ${v} m/s.` },
          ],
          respuesta: ['Recorre ', pdx(`${fm(D)} m`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-mruv',
      generar(s) {
        const r = azar(s + 61), k = s % 4, m = n => `${fm(n)} m`;
        if (k === 0) {
          let vi, vf, ti; do { vi = r.ent(1, 6) * 2; vf = r.ent(1, 6) * 2; ti = r.ent(2, 6); } while (vi === vf);
          const D = (vi + vf) / 2 * ti;
          return {
            pregunta: ['En la gráfica v–t, la velocidad de una combi pasa en línea recta de ', pv(ms(vi)), ' a ', pv(ms(vf)), ' en ', pt(`${fm(ti)} s`), '. ¿Cuánto avanzó?'],
            datos: DB3, dibujo: rectaB3(vi, vf, ti, { area: true }),
            opciones: cuatro(D, [
              { id: 'pendiente', valor: (vf - vi) / ti, error: 'G4', siFuera: 'Ese número es la pendiente: la aceleración. Lo que avanzó es el área.' },
              { id: 'rect', valor: vf * ti, error: 'DX-RECT', siFuera: `Bien que multipliques por ${fm(ti)} s. Pero no fue a ${fm(vf)} m/s todo el tiempo.` },
              { id: 'semi', valor: (vi + vf) * ti, error: 'DX-SEMI', siFuera: 'Bien las dos bases del trapecio. Pero su suma se divide entre 2.' },
            ], m),
            solucion: { texto: 'Es el área del trapecio bajo la recta.', ecuacion: [Mdx, ' = ', { frac: [[pv(fm(vi)), ' + ', pv(fm(vf))], '2'] }, ' · ', pt(fm(ti)), ' = ', pdx(m(D))] },
          };
        }
        if (k === 1) {
          let vi, vf, ti; do { vi = r.ent(0, 7) * 2; vf = r.ent(0, 7) * 2; ti = r.de([2, 4]); } while (vi === vf);
          const a = (vf - vi) / ti;
          return {
            pregunta: ['La gráfica v–t de una combi es una recta de ', pv(ms(vi)), ' a ', pv(ms(vf)), ' en ', pt(`${ti} s`), '. ¿Cuál es su aceleración?'],
            datos: DB3, dibujo: rectaB3(vi, vf, ti),
            opciones: cuatro(a, [
              { id: 'area', valor: (vi + vf) / 2 * ti, error: 'G4', siFuera: 'Ese número es el área: lo que avanzó. La aceleración es la pendiente.' },
              { id: 'final', valor: vf / ti, error: 'K4', siFuera: `Bien que dividas entre ${ti} s. Pero se divide el cambio, ${fm(vf)} − ${fm(vi)}.` },
              { id: 'signo', valor: -a, error: 'K-SIGNO', siFuera: `Bien el ${fm(Math.abs(a))}. Pero la recta ${a > 0 ? 'sube: a es positiva' : 'baja: a es negativa'}.` },
              { id: 'sin-dividir', valor: vf - vi, error: 'K-SINDIV', siFuera: `Bien el cambio de v. Pero fue en ${ti} s: se divide entre el tiempo.` },
            ], ms2),
            solucion: { texto: 'La pendiente: cuánto cambia v por segundo.', ecuacion: [Ma, ' = ', { frac: [[pv(fm(vf)), ' − ', pv(fm(vi))], pt(String(ti))] }, ' = ', pa(ms2(a))] },
          };
        }
        if (k === 2) {
          let v1, t1, v2, t2; do { v1 = r.ent(2, 6); t1 = r.ent(2, 5); v2 = r.ent(1, 4); t2 = r.ent(1, 4); } while (v1 * t1 === v2 * t2 || v1 + v2 === v1 * t1 - v2 * t2);
          const A1 = v1 * t1, A2 = v2 * t2, pideD = Math.floor(s / 4) % 2 === 1, bien = pideD ? A1 + A2 : A1 - A2;
          const dib = graf({ x: ejT(t1 + t2 + 1, 1), y: ejV(-4, 6, 2), alto: 140, curvas: [{ puntos: [[0, v1], [t1, v1], null, [t1, -v2], [t1 + t2, -v2]], color: 'o' }],
            areas: [{ puntos: [[0, v1], [t1, v1]], color: 'f' }, { puntos: [[t1, -v2], [t1 + t2, -v2]], color: 'f' }] });
          return {
            pregunta: ['Un mototaxi va a ', pv(ms(v1)), ' durante ', pt(`${t1} s`), ' y retrocede a ', pv(ms(v2)), ' durante ', pt(`${t2} s`), '. ', pideD ? '¿Qué distancia recorrió en total?' : '¿Cuál es su desplazamiento?'],
            datos: DB3, dibujo: dib,
            opciones: cuatro(bien, pideD ? [
              { id: 'resta', valor: A1 - A2, error: 'DX-RESTA', siFuera: 'Ese es el desplazamiento. La distancia recorrida cuenta todo el camino, sin signo.' },
              { id: 'ida', valor: A1, error: 'DX-IDA', siFuera: `Bien el tramo de ida, ${A1} m. Falta sumar lo que retrocedió.` },
              { id: 'altura', valor: v1 + v2, error: 'DX-ALTURA', siFuera: 'Bien que uses las dos velocidades. Pero lo que avanza es el área.' },
            ] : [
              { id: 'suma', valor: A1 + A2, error: 'DX-SUMA', siFuera: 'Bien las dos áreas. Pero la de abajo es hacia atrás: se resta.' },
              { id: 'ida', valor: A1, error: 'DX-IDA', siFuera: `Bien el tramo de ida, ${A1} m. Pero después retrocedió.` },
              { id: 'altura', valor: v1 + v2, error: 'DX-ALTURA', siFuera: 'Bien que uses las dos velocidades. Pero lo que avanza es el área.' },
            ], m),
            solucion: { texto: pideD ? 'La distancia suma las dos áreas sin signo.' : 'El desplazamiento suma las áreas con su signo.', ecuacion: pideD ? [`d = ${A1} + ${A2} = ${m(bien)}`] : [Mdx, ` = ${A1} + (−${A2}) = `, pdx(m(bien))] },
          };
        }
        // Nivel examen (San Marcos 2020-I y 2021): el tiempo mínimo, leer v₀ en una gráfica y la aceleración desde el área.
        const e = Math.floor(s / 4) % 3;
        if (e === 0) {
          const [a, T] = r.de([[1, 40], [2, 20], [0.5, 60], [1, 30], [2, 30], [0.5, 40]]), D = a * T * T / 4;
          return {
            pregunta: ['Un tren sale del reposo y acelera con ', pa(ms2(a)), '; después frena con ', pa(ms2(a)), ' y para en la estación siguiente, a ', pdx(m(D)), '. ¿Cuál es el menor tiempo del viaje?'],
            datos: DB3,
            opciones: cuatro(T, [
              { id: 'mitad', valor: T / 2, error: 'MRUV-MITAD', siFuera: 'Bien el triángulo. Pero ese es solo el tiempo de subida; falta frenar.' },
              { id: 'solo-acelera', valor: Math.sqrt(2 * D / a), error: 'MRUV-SOLO-ACELERA', siFuera: 'Eso sería si acelerara todo el camino. También tiene que frenar.' },
              { id: 'divide', valor: D / a, error: 'MRUV-DIVIDE', siFuera: 'Bien que uses la distancia y a. Pero el área del triángulo es la distancia.' },
            ], n => `${fm(n)} s`),
            solucion: { texto: `La v–t es un triángulo de base t y altura ${fm(a)} · t/2; su área es ${m(D)}.`, ecuacion: [pdx(fm(D)), ` = ${fm(a)} · `, Mt2, ' ÷ 4   →   ', Mt, ' = ', pt(`${fm(T)} s`)] },
          };
        }
        if (e === 1) {
          let a, v0, t1, t2; do { a = r.de([1, 2, 3]); v0 = r.de([2, 4, 6, 8]); t1 = r.ent(1, 3); t2 = t1 + r.ent(2, 4); } while (v0 + a * t2 > 24);
          const v1 = v0 + a * t1, v2 = v0 + a * t2;
          return {
            pregunta: ['La gráfica v–t de una combi es una recta que pasa por (', pt(`${t1} s`), '; ', pv(ms(v1)), ') y (', pt(`${t2} s`), '; ', pv(ms(v2)), '). ¿Cuánto valía su velocidad en t = 0?'],
            datos: DB3,
            dibujo: graf({ x: ejT(t2 + 1, 1), y: ejV(0, Math.ceil((v2 + 2) / 4) * 4, 4), alto: 140, curvas: [{ puntos: [[t1, v1], [t2, v2]], color: 'o' }],
              puntos: [{ x: t1, y: v1, color: 'o', guias: true }, { x: t2, y: v2, color: 'o', guias: true }] }),
            opciones: cuatro(v0, [
              { id: 'punto', valor: v1, error: 'MRUV-LEE-PUNTO', siFuera: `Bien la velocidad a los ${t1} s. Pero piden la de t = 0, antes.` },
              { id: 'origen', valor: 0, error: 'MRUV-ORIGEN', siFuera: 'La recta no tiene por qué salir de 0: hay que seguirla hacia atrás.' },
              { id: 'un-seg', valor: v1 - a, error: 'K-TIEMPO', siFuera: `Bien la pendiente, ${fm(a)} m/s². Pero desde t = ${t1} s hay ${t1} s hasta 0.` },
            ], ms),
            solucion: { texto: `La pendiente es ${fm(a)} m/s²; desde t = ${t1} s se retrocede ${t1} s.`, ecuacion: [Mv0, ` = ${fm(v1)} − ${fm(a)} · ${t1} = `, pv(ms(v0))] },
          };
        }
        const v0 = r.de([8, 10, 12, 16, 20]), ti = r.de([2, 4, 5, 8]), D = v0 * ti / 2, a = -v0 / ti;
        return {
          pregunta: ['Una ciclista va a ', pv(ms(v0)), ' y frena parejo hasta detenerse. En su gráfica v–t, el área bajo la recta es ', pdx(m(D)), '. ¿Cuál es su aceleración?'],
          datos: DB3,
          opciones: cuatro(a, [
            { id: 'modulo', valor: -a, error: 'K-SIGNO', siFuera: `Bien el ${fm(-a)}. Pero frena: la recta baja y a es negativa.` },
            { id: 'sin-medio', valor: -v0 * v0 / D, error: 'DX-TRIANGULO', siFuera: 'Bien la idea. Pero el área del triángulo es base por altura entre 2.' },
            { id: 'divide', valor: -v0 / D, error: 'G4', siFuera: 'El área no es el tiempo: primero se despeja la base del triángulo.' },
          ], ms2),
          solucion: { texto: `El área es un triángulo: ${m(D)} = t · ${v0} ÷ 2, así que t = ${fm(ti)} s.`, ecuacion: [Ma, ` = (0 − ${v0}) ÷ ${fm(ti)} = `, pa(ms2(a))] },
        };
      },
    },
  };

  // ---------- Idea 4 (B4): gráficas x–t y a–t ----------
  // Pieza fis-mruv, vista «alcance»: el mototaxi pasa por el paradero a 10 m/s justo cuando la combi arranca de ahí; arriba
  // la avenida, debajo la gráfica x–t de los dos. Cambia: cuánto acelera la combi · Permanece: el mototaxi a 10 m/s ·
  // Progresa: el reloj, que dibuja las dos gráficas · Se reserva: cuándo tienen la misma velocidad (la predicción) y las
  // gráficas v–t y a–t (en «Mira») · Debe verse: la curva de la combi corta la recta del mototaxi donde la alcanza.
  // Mismo color para los dos (la posición, violeta): la combi en trazo continuo y el mototaxi en discontinuo.
  const VM_B4 = 10, T_B4 = 12, XMAX_B4 = 200;
  const parabola = (a, v0, x0, hasta, ymax) => {
    const pts = [], tope = hasta;
    for (let k = 0; k <= 48; k++) { const tk = tope * k / 48, xk = x0 + v0 * tk + a * tk * tk / 2; if (xk > ymax + 1e-9) break; pts.push([tk, xk]); }
    if (pts.length && pts[pts.length - 1][0] < tope - 1e-9) {
      // el último punto, justo en el borde de arriba
      const tb = (-v0 + Math.sqrt(v0 * v0 + 2 * a * (ymax - x0))) / a; if (tb < tope) pts.push([tb, ymax]);
    }
    return pts;
  };
  const xtB4 = (a, t, o = {}) => ({ x: ejT(T_B4, 1, { cada: 2 }), y: ejX(0, XMAX_B4, 50), alto: o.alto || 110,
    curvas: [{ puntos: [[0, 0], [Math.min(t, XMAX_B4 / VM_B4), Math.min(VM_B4 * t, XMAX_B4)]], color: 'f', discontinua: true, rotulo: o.rotulos ? 'mototaxi' : undefined, en: [7.5, 75], ancla: 'end', dx: -4, dy: -6 },
      { puntos: parabola(a, 0, 0, t, XMAX_B4), color: 'f', rotulo: o.rotulos ? 'combi' : undefined, en: [6, a * 18], ancla: 'start', dx: 6, dy: 16 }] });
  const juegoB4 = val => {
    const tt = Math.min(val.t, T_B4);
    return mruv({ vista: 'alcance', regla: { min: 0, max: XMAX_B4, paso: 25, numero: 50 }, lugares: [{ en: 0, texto: 'Paradero' }],
      combi: { x: Math.min(XMAX_B4, val.a * tt * tt / 2) }, mototaxi: { x: Math.min(XMAX_B4, VM_B4 * tt) }, grafica: xtB4(val.a, tt) });
  };
  // Las tres gráficas de la combi (continua) y el mototaxi (discontinua), con a = 2 m/s²: «Mira».
  const TRES_B4 = { vista: 'tres', x: ejT(T_B4, 1, { cada: 2 }), graficas: [
    { y: ejX(0, 150, 50), curvas: [{ puntos: [[0, 0], [12, 120]], color: 'f', discontinua: true, rotulo: 'mototaxi', en: [4, 40], ancla: 'end', dx: -4, dy: -8 },
      { puntos: parabola(2, 0, 0, 12, 150), color: 'f', rotulo: 'combi', en: [10, 100], ancla: 'start', dx: 8, dy: 14 }],
      tangentes: [{ t: 5, y: 25, m: 10, ancho: 2.5, color: 'o', desde: 2 }], puntos: [{ x: 10, y: 100, color: 'f', guias: true, desde: 6 }] },
    { y: ejV(0, 24, 8), curvas: [{ puntos: [[0, 10], [12, 10]], color: 'o', discontinua: true, desde: 3 }, { puntos: [[0, 0], [12, 24]], color: 'o', desde: 3 }],
      puntos: [{ x: 5, y: 10, color: 'o', guias: true, desde: 4 }] },
    { y: ejA(-1, 3, 1), curvas: [{ puntos: [[0, 0], [12, 0]], color: 'h', discontinua: true, desde: 5 }, { puntos: [[0, 2], [12, 2]], color: 'h', desde: 5 }],
      areas: [{ puntos: [[0, 2], [10, 2]], color: 'o', rotulo: 'Δv = 20 m/s', desde: 6 }] },
  ] };
  const DB4 = [
    'x–t: posición contra tiempo; v–t: velocidad contra tiempo; a–t: aceleración contra tiempo.',
    DB.horaria, DA.vt,
    ['Inclinación de x–t en un instante: ', Mv, '. Área bajo a–t: ', Mdv, '.'],
    'Se alcanzan cuando están en la misma posición a la vez.',
  ];
  const DB4b = [...DB4.slice(0, 3), ['Área bajo v–t: ', Mdx, '. Área bajo a–t: ', Mdv, '.'], 'Rectángulo: base · altura. Triángulo: base · altura ÷ 2.'];
  const at = (tramos, o = {}) => {
    // tramos: [[a, dt], …] desde t = 0
    let t = 0; const pts = [], areas = [];
    for (const [a, dt] of tramos) { pts.push([t, a], [t + dt, a], null); areas.push({ puntos: [[t, a], [t + dt, a]], color: 'o' }); t += dt; }
    const amin = Math.min(0, ...tramos.map(x => x[0])), amax = Math.max(...tramos.map(x => x[0]), 1);
    return graf({ x: ejT(t + 1, 1), y: ejA(Math.floor(amin) - (amin < 0 ? 1 : 0), Math.ceil(amax) + 1, 1), alto: 120, curvas: [{ puntos: pts.slice(0, -1), color: 'h' }], areas: o.area === false ? [] : areas });
  };

  // Ejemplos de B4. Cuentas rehechas aparte (scratchpad f3/cuentas.js, 18 nov): 3·4; a = 0; (0 − 12)/4; 12/3;
  // 4 + 2·5; 2·3 + 0·4; 2·6/1,5 y 6·8; 2·24/4² y 3·4; 10 + (−2)·3; 8·6 − ½·2·6²; 8 + 24 + 16 con v = 4·2;
  // ½·2·t² = 20 + 8t; t = 12/2, 12·6 − ½·2·6²; frena: x se aplana, v baja, a < 0; x = 2t² → a = 4.
  const EJEMPLOS_GR = [
    { nivel: 1, titulo: 'El área bajo a–t',
      figura: at([[3, 4]]),
      enunciado: ['La gráfica a–t de una combi es una horizontal en ', pa('3 m/s²'), ' durante ', pt('4 s'), '. ¿Cuánto cambió su velocidad?'],
      datos: DB4,
      solucion: [{ texto: 'El cambio de velocidad es el área bajo a–t: un rectángulo.', ecuacion: [Mdv, ' = ', pa('3'), ' · ', pt('4'), ' = ', pv('12 m/s')] }],
      respuesta: [pv('Δv = 12 m/s')] },
    { nivel: 1, titulo: 'La a–t sin acelerar',
      figura: graf({ x: ejT(6, 1), y: ejV(0, 20, 5), alto: 110, curvas: [{ puntos: [[0, 15], [6, 15]], color: 'o' }] }),
      enunciado: ['Una combi va siempre a ', pv('15 m/s'), ': su gráfica v–t es esta horizontal. ¿Cómo es su gráfica a–t?'],
      datos: DB4,
      solucion: [{ texto: ['La velocidad no cambia: la pendiente de v–t es 0 en todo instante.'], ecuacion: [Ma, ' = ', { frac: [Mdv, Mdt] }, ' = ', { frac: ['0', Mdt] }, ' = ', pa('0')] }],
      respuesta: [pa('a = 0'), ': una horizontal sobre el mismo eje t'] },
    { nivel: 1, titulo: 'La a–t al frenar',
      figura: rectaB3(12, 0, 4),
      enunciado: ['Una combi frena parejo: su velocidad baja en línea recta de ', pv('12 m/s'), ' a 0 en ', pt('4 s'), '. ¿Cómo es su gráfica a–t?'],
      datos: DB4,
      solucion: [{ texto: 'La pendiente de v–t es la misma en todo el tramo, y negativa:', ecuacion: [Ma, ' = ', { frac: [['0 − ', pv('12')], pt('4')] }, ' = ', pa('−3 m/s²')] }],
      respuesta: ['Una horizontal bajo el eje, en ', pa('−3 m/s²')] },
    { nivel: 1, titulo: 'La misma velocidad',
      figura: mruv({ vista: 'alcance', regla: { min: 0, max: 200, paso: 25, numero: 50 }, lugares: [{ en: 0, texto: 'Paradero' }], combi: { x: 0 }, mototaxi: { x: 0 } }),
      enunciado: ['Un mototaxi pasa por el paradero a ', pv('12 m/s'), ' justo cuando una combi arranca de ahí con ', pa('3 m/s²'), '. ¿Cuándo tienen la misma velocidad?'],
      datos: DB4,
      solucion: [{ texto: 'La combi gana 3 m/s cada segundo hasta llegar a 12 m/s:', ecuacion: [pv('12'), ' = ', pa('3'), ' · ', Mt, '   →   ', Mt, ' = ', pt('4 s')] }],
      respuesta: ['A los ', pt('4 s')] },
    { nivel: 1, titulo: 'La velocidad desde a–t',
      figura: at([[2, 5]]),
      enunciado: ['Una combi va a ', pv('4 m/s'), ' y su gráfica a–t es una horizontal en ', pa('2 m/s²'), ' durante ', pt('5 s'), '. ¿Qué velocidad tiene al final?'],
      datos: DB4,
      solucion: [{ texto: 'El área bajo a–t es lo que ganó; se suma a la que tenía.', ecuacion: [Mv, ' = ', pv('4'), ' + ', pa('2'), ' · ', pt('5'), ' = ', pv('14 m/s')] }],
      respuesta: [pv('v = 14 m/s')] },
    { nivel: 2, titulo: 'a–t en dos tramos',
      figura: at([[2, 3], [0, 4]]),
      enunciado: ['Una combi arranca del reposo. Su gráfica a–t vale ', pa('2 m/s²'), ' durante ', pt('3 s'), ' y después 0 durante ', pt('4 s'), '. ¿Qué velocidad tiene a los ', pt('7 s'), '?'],
      datos: DB4,
      solucion: [
        { texto: 'Primer tramo: el área es lo que gana.', ecuacion: [Mdv, ' = ', pa('2'), ' · ', pt('3'), ' = ', pv('6 m/s')] },
        { texto: 'Segundo tramo: a = 0, el área es 0 y la velocidad no cambia.', ecuacion: [Mv, ' = 0 + ', pv('6'), ' + 0 = ', pv('6 m/s')] },
      ],
      respuesta: [pv('v = 6 m/s')] },
    { nivel: 2, titulo: 'Alcance desde el mismo punto',
      figura: mruv({ vista: 'alcance', regla: { min: 0, max: 100, paso: 10, numero: 50 }, lugares: [{ en: 0, texto: 'Paradero' }], combi: { x: 0 }, mototaxi: { x: 0 } }),
      enunciado: ['Un mototaxi pasa por el paradero a ', pv('6 m/s'), ' justo cuando una combi arranca de ahí con ', pa('1,5 m/s²'), '. ¿Cuándo y dónde lo alcanza?'],
      datos: DB4,
      solucion: [
        { texto: 'Se alcanzan cuando están en la misma posición:', ecuacion: [pv('6'), Mt, ' = ½ · ', pa('1,5'), ' · ', Mt2, '   →   ', Mt, ' = ', { frac: [['2 · ', pv('6')], pa('1,5')] }, ' = ', pt('8 s')] },
        { texto: 'Su posición en ese instante:', ecuacion: [Mx, ' = ', pv('6'), ' · ', pt('8'), ' = ', px('48 m')] },
      ],
      respuesta: ['A los ', pt('8 s'), ', en ', px('48 m')] },
    { nivel: 2, titulo: 'Leer la parábola',
      figura: graf({ x: ejT(6, 1), y: ejX(0, 50, 10), alto: 130, curvas: [{ puntos: parabola(3, 0, 0, 5.5, 50), color: 'f' }], puntos: [{ x: 4, y: 24, color: 'f', guias: true }] }),
      enunciado: ['La gráfica x–t de una combi que arranca del reposo en el paradero es una parábola que pasa por (', pt('4 s'), '; ', px('24 m'), '). ¿Cuál es su aceleración?'],
      datos: DB4,
      solucion: [
        { texto: ['Desde el reposo y el 0, ', Mx, ' = ½ · ', Ma, ' · ', Mt2, '. Se reemplaza el punto:'], ecuacion: [px('24'), ' = ½ · ', Ma, ' · ', pt('4'), '²   →   ', Ma, ' = ', { frac: ['48', '16'] }, ' = ', pa('3 m/s²')] },
        { texto: 'Con eso, su velocidad a los 4 s es la inclinación de la curva ahí: 3 · 4 = 12 m/s.' },
      ],
      respuesta: [pa('a = 3 m/s²')] },
    { nivel: 2, titulo: 'a–t al frenar',
      figura: at([[-2, 3]]),
      enunciado: ['Una combi va a ', pv('10 m/s'), ' y su gráfica a–t es una horizontal en ', pa('−2 m/s²'), ' durante ', pt('3 s'), '. ¿Qué velocidad tiene al final?'],
      datos: DB4,
      solucion: [
        { texto: 'El área está bajo el eje: la velocidad baja.', ecuacion: [Mdv, ' = (', pa('−2'), ') · ', pt('3'), ' = ', pv('−6 m/s')] },
        { texto: 'Se suma a la que tenía:', ecuacion: [Mv, ' = ', pv('10'), ' + (', pv('−6'), ') = ', pv('4 m/s')] },
      ],
      respuesta: [pv('v = 4 m/s')] },
    { nivel: 2, titulo: '¿Quién va adelante?',
      figura: mruv({ vista: 'alcance', regla: { min: 0, max: 100, paso: 10, numero: 50 }, lugares: [{ en: 0, texto: 'Paradero' }], combi: { x: 0 }, mototaxi: { x: 0 } }),
      enunciado: ['Un mototaxi pasa por el paradero a ', pv('8 m/s'), ' justo cuando una combi arranca de ahí con ', pa('2 m/s²'), '. A los ', pt('6 s'), ', ¿quién va adelante y por cuánto?'],
      datos: DB4,
      solucion: [
        { texto: 'Las dos posiciones a los 6 s:', ecuacion: ['mototaxi: ', pv('8'), ' · ', pt('6'), ' = ', px('48 m'), ';   combi: ½ · ', pa('2'), ' · ', pt('6'), '² = ', px('36 m')] },
        { texto: 'La separación es la resta:', ecuacion: [px('48'), ' − ', px('36'), ' = ', { v: 'c-f', t: '12 m', m: 'separación' }] },
      ],
      respuesta: ['El mototaxi, por ', { v: 'c-f', t: '12 m', m: 'separación' }] },
    { nivel: 3, titulo: 'a–t por tramos',
      figura: at([[4, 2], [0, 3], [-2, 4]], { area: true }),
      enunciado: ['Una combi parte del reposo y su gráfica a–t es esta: ', pa('4 m/s²'), ' durante ', pt('2 s'), ', 0 durante ', pt('3 s'), ' y ', pa('−2 m/s²'), ' durante ', pt('4 s'), '. ¿Qué distancia recorre?'],
      alternativas: ['0 m', '72 m', '48 m', '40 m', '24 m'],
      datos: DB4b,
      solucion: [
        { texto: 'Con el área de a–t, la velocidad en cada instante: sube a 8 m/s, sigue en 8 y baja a 0.', ecuacion: [pa('4'), ' · ', pt('2'), ' = ', pv('8 m/s'), ';   ', pv('8'), ' − ', pa('2'), ' · ', pt('4'), ' = 0'] },
        { texto: 'La distancia es el área de v–t: triángulo, rectángulo y triángulo.', ecuacion: [{ frac: [[pt('2'), ' · ', pv('8')], '2'] }, ' + ', pv('8'), ' · ', pt('3'), ' + ', { frac: [[pt('4'), ' · ', pv('8')], '2'] }, ' = 8 + 24 + 16 = ', pdx('48 m')] },
        { texto: ['La ', neg('A'), ' toma el área de a–t como distancia; la ', neg('B'), ' usa 8 m/s los 9 s.'] },
      ],
      respuesta: [neg('C'), ', ', pdx('48 m')] },
    { nivel: 3, titulo: 'Alcance desde atrás',
      figura: mruv({ vista: 'alcance', regla: { min: 0, max: 60, paso: 10, numero: 20 }, lugares: [{ en: 0, texto: 'Paradero' }, { en: 20, texto: 'Grifo' }], combi: { x: 0 }, mototaxi: { x: 20 } }),
      enunciado: ['Un mototaxi pasa por el grifo a ', pv('8 m/s'), '. En ese instante, una combi arranca del paradero, ', px('20 m'), ' detrás, con ', pa('2 m/s²'), '. ¿Qué distancia recorre el mototaxi hasta que lo alcanzan?'],
      alternativas: ['100 m', '80 m', '20 m', '64 m', '40 m'],
      datos: [...DB4, 'Una ecuación de segundo grado puede tener dos raíces; aquí t no es negativo.'],
      solucion: [
        { texto: 'Con el paradero en el 0, se igualan las posiciones:', ecuacion: ['½ · ', pa('2'), ' · ', Mt2, ' = ', px('20'), ' + ', pv('8'), Mt, '   →   ', Mt2, ' − 8', Mt, ' − 20 = 0   →   ', Mt, ' = ', pt('10 s')] },
        { texto: 'En 10 s, el mototaxi avanza:', ecuacion: [pv('8'), ' · ', pt('10'), ' = ', pdx('80 m')] },
        { texto: ['La ', neg('A'), ' es lo que recorre la combi: salió 20 m más atrás.'] },
      ],
      respuesta: [neg('B'), ', ', pdx('80 m')] },
    { nivel: 3, titulo: 'La mayor separación',
      figura: mruv({ vista: 'alcance', regla: { min: 0, max: 200, paso: 25, numero: 50 }, lugares: [{ en: 0, texto: 'Paradero' }], combi: { x: 0 }, mototaxi: { x: 0 } }),
      enunciado: ['Un mototaxi pasa por el paradero a ', pv('12 m/s'), ' justo cuando una combi arranca de ahí con ', pa('2 m/s²'), '. Antes del alcance, ¿cuál es la mayor separación entre los dos?'],
      alternativas: ['144 m', '72 m', '0 m', '18 m', '36 m'],
      datos: DB4b,
      solucion: [
        { texto: 'Mientras el mototaxi va más rápido, se aleja; la separación es mayor cuando las velocidades se igualan:', ecuacion: [pv('12'), ' = ', pa('2'), ' · ', Mt, '   →   ', Mt, ' = ', pt('6 s')] },
        { texto: 'A los 6 s:', ecuacion: [pv('12'), ' · ', pt('6'), ' − ½ · ', pa('2'), ' · ', pt('6'), '² = 72 − 36 = ', { v: 'c-f', t: '36 m', m: 'separación' }] },
        { texto: ['La ', neg('A'), ' es dónde se alcanzan, a los 12 s; la ', neg('B'), ' es solo dónde va el mototaxi a los 6 s.'] },
      ],
      respuesta: [neg('E'), ', ', { v: 'c-f', t: '36 m', m: 'separación' }] },
    { nivel: 3, titulo: 'Las tres gráficas al frenar',
      enunciado: 'Una combi frena parejo hasta detenerse, sin retroceder. ¿Cómo son sus gráficas x–t, v–t y a–t mientras frena?',
      alternativas: ['x–t se aplana; v–t baja; a–t horizontal bajo el eje', 'x–t se aplana; v–t horizontal; a–t baja', 'Las tres bajan', 'x–t se empina; v–t sube; a–t sobre el eje', 'x–t recta; v–t baja; a–t en cero'],
      datos: DB4,
      solucion: [
        { texto: 'Sigue avanzando cada vez menos: x sube, pero la curva x–t se aplana.' },
        { texto: 'v baja pareja: v–t es una recta que baja. Su pendiente, a, es la misma y negativa: a–t es una horizontal bajo el eje.' },
        { texto: ['La ', neg('C'), ' dibuja las tres con la misma forma; la ', neg('D'), ' es la de una combi que acelera.'] },
      ],
      respuesta: [neg('A')] },
    { nivel: 3, titulo: 'De la ecuación a la gráfica',
      enunciado: ['La posición de una combi es ', Mx, ' = 2', Mt2, ', con ', Mx, ' en metros y ', Mt, ' en segundos. ¿Cuánto vale su aceleración y cómo es su gráfica a–t?'],
      alternativas: ['2 m/s², horizontal', '0, horizontal', '4 m/s², recta que sube', '4 m/s², horizontal', '2 m/s², parábola'],
      datos: DB4,
      solucion: [
        { texto: ['Se compara con ', Mx, ' = ', Mx0, ' + ', Mv0, Mt, ' + ½', Ma, Mt2, ': ½ · a = 2.'], ecuacion: [Ma, ' = ', pa('4 m/s²')] },
        { texto: 'a no cambia: la gráfica a–t es una horizontal en 4 m/s².' },
        { texto: ['La ', neg('A'), ' toma el 2 como a, sin duplicarlo; la ', neg('E'), ' confunde a–t con x–t.'] },
      ],
      respuesta: [neg('D'), ', ', pa('4 m/s²')] },
  ];

  // Las formas de las tres gráficas (para «Ahora tú»): qué dibuja cada movimiento en cada gráfica.
  const FORMA = {
    'parabola-sube': 'Una curva que se empina cada vez más', 'parabola-aplana': 'Una curva que se va aplanando',
    'recta-sube': 'Una recta inclinada que sube', 'recta-baja': 'Una recta inclinada que baja',
    'horiz-arriba': 'Una horizontal sobre el eje t', 'horiz-abajo': 'Una horizontal bajo el eje t', 'horiz-cero': 'Una horizontal sobre el mismo eje t, en 0',
  };
  const MOVS = {
    acelera: { texto: 'arranca del paradero y acelera parejo', xt: 'parabola-sube', vt: 'recta-sube', at: 'horiz-arriba', otro: { xt: 'parabola-aplana', vt: 'recta-baja', at: 'horiz-abajo' } },
    frena: { texto: 'va hacia adelante y frena parejo, sin llegar a parar', xt: 'parabola-aplana', vt: 'recta-baja', at: 'horiz-abajo', otro: { xt: 'parabola-sube', vt: 'recta-sube', at: 'horiz-arriba' } },
    pareja: { texto: 'va siempre a la misma velocidad, hacia adelante', xt: 'recta-sube', vt: 'horiz-arriba', at: 'horiz-cero', otro: { xt: 'parabola-sube', vt: 'recta-sube', at: 'horiz-arriba' } },
  };
  const NOMBRE_G = { xt: 'x–t', vt: 'v–t', at: 'a–t' };

  const graficas = {
    id: 'graficas-xt-at',
    titulo: 'Gráficas x–t y a–t',
    pregunta: '¿Por qué la gráfica x–t de la combi que acelera es una curva?',
    temas: ['Gráficas x-t, v-t y a-t', 'La recta y la parábola como gráficas'],
    pieza: 'fis-mruv',
    aprendizaje: 'En el MRUV, x–t es una parábola cuya inclinación es la velocidad; a–t es horizontal y su área es cuánto cambió v.',
    actividad: 'Hacer que la combi alcance al mototaxi que pasó por el paradero.',
    lee: {
      tarjetas: [
        { titulo: 'La gráfica x–t', texto: ['En la gráfica x–t, cada punto dice dónde está el móvil, ', Mx, ', en cada instante ', Mt, '. Un móvil que va parejo dibuja una recta: su inclinación es la velocidad.'],
          dibujo: graf({ x: ejT(8, 1), y: ejX(0, 80, 20), alto: 110, curvas: [{ puntos: [[0, 0], [8, 80]], color: 'f', discontinua: true, rotulo: 'mototaxi', en: [6, 60], ancla: 'end', dx: -4, dy: -6 }] }) },
        { titulo: 'Una parábola', texto: 'Una parábola es la curva de un chorro de agua o de una pelota lanzada: se empina cada vez más (o se aplana). La de x = t² es una.' },
        { titulo: 'La gráfica a–t', texto: ['La gráfica a–t dice cuánto acelera el móvil en cada instante. Su área, la zona entre la línea y el eje, es cuánto cambió su velocidad, ', Mdv, '.'] },
        { titulo: 'Qué mirar al jugar', texto: 'El mototaxi pasa por el paradero a 10 m/s y la combi arranca de ahí. Vas a elegir cuánto acelera la combi. Mira dónde se cortan sus dos gráficas.' },
      ],
    },
    ejemplos: EJEMPLOS_GR,
    juega: {
      pieza: 'fis-mruv',
      consigna: 'El mototaxi pasa por el paradero a 10 m/s justo cuando la combi arranca de ahí. Elige cuánto acelera la combi.',
      mision: {
        texto: 'Haz que la combi alcance al mototaxi justo a los 10 s.',
        logrado: val => val.a === 2,
        bien: 'Listo: a los 10 s, los dos en 100 m. Ahí se cortan las gráficas.',
      },
      voz: 'Mira dónde se cortan la curva y la recta.',
      leyenda: [
        { s: [Mx], t: 'la posición, desde el paradero' },
        { s: [Mt], t: 'segundos desde que la combi arranca' },
        { s: [Ma], t: 'cuánto acelera la combi' },
        { s: 'curva continua', t: 'la gráfica x–t de la combi' },
        { s: 'recta discontinua', t: 'la gráfica x–t del mototaxi' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Acelera, a', color: 'c-h', min: 1, max: 4, paso: 0.5, inicio: 1, unidad: 'm/s²', decimales: 1 },
        { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: T_B4, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: juegoB4,
      lectura: val => {
        const tt = Math.min(val.t, T_B4), xc = val.a * tt * tt / 2, xm = VM_B4 * tt;
        if (tt > 0 && Math.abs(xc - xm) < 1e-6) return ['A los ', pt(`${fm(tt)} s`), ': los dos en ', px(`${fm(xm)} m`)];
        return ['A los ', pt(`${fm(tt)} s`), ': combi en ', px(`${fm(xc)} m`), ', mototaxi en ', px(`${fm(xm)} m`)];
      },
      resumen: { a: 3, t: 8 },
      minimo: 3,
    },
    predice: {
      pregunta: 'En el juego, con 2 m/s², la combi alcanza al mototaxi a los 10 s. ¿En qué instante tenían la misma velocidad?',
      datos: ['El mototaxi va siempre a 10 m/s.', 'La combi arranca del reposo y gana 2 m/s en cada segundo.'],
      opciones: [
        { id: 'c', texto: 'A los 5 s', correcta: true },
        { id: 'alcance', texto: 'A los 10 s, cuando lo alcanza', error: 'K1-a', siFuera: 'Bien: a los 10 s están en el mismo lugar. Pero ahí la combi ya va más rápido.' },
        { id: 'salida', texto: 'Al salir, porque los dos estaban en el paradero', error: 'K1-b', siFuera: 'Bien: al salir están juntos. Pero la combi estaba quieta y el mototaxi no.' },
        { id: 'nunca', texto: 'Nunca: una acelera y la otra no', error: 'MRUV-NUNCA', siFuera: 'Bien: sus gráficas son distintas. Pero la combi pasa por todas las rapideces, también por 10.' },
      ],
      dibujo: graf(Object.assign(xtB4(2, 12, { rotulos: true, alto: 150 }), { y: ejX(0, 150, 50), puntos: [{ x: 10, y: 100, color: 'f', guias: true }] })),
      revelar: graf(Object.assign(xtB4(2, 12, { rotulos: true, alto: 150 }), { y: ejX(0, 150, 50), puntos: [{ x: 10, y: 100, color: 'f', guias: true }, { x: 5, y: 25, color: 'o', guias: true }],
        tangentes: [{ t: 5, y: 25, m: 10, ancho: 2.5, color: 'o' }] })),
      coincide: 'Coincide: a los 5 s la combi va a 2 · 5 = 10 m/s, como el mototaxi.',
    },
    mira: {
      datos: TRES_B4,
      pasos: [
        { estado: { corte: 1 }, texto: 'En x–t, la combi dibuja una parábola: cada segundo avanza más.', ecuacion: [Mx, ' = ½ · ', pa('2'), ' · ', Mt2, ' = ', Mt2] },
        { estado: { corte: 2 }, texto: 'A los 5 s, la curva está igual de inclinada que la recta.', ecuacion: [Mv, ' = ', pa('2'), ' · ', pt('5'), ' = ', pv('10 m/s')] },
        { estado: { corte: 3 }, texto: 'En v–t, la combi es una recta que sube; el mototaxi, una horizontal.', ecuacion: [Mv, ' = ', pa('2'), Mt, ';   ', Mv, ' = ', pv('10 m/s')] },
        { estado: { corte: 4 }, texto: 'Se cortan en v–t a los 5 s: misma velocidad, no mismo lugar.' },
        { estado: { corte: 5 }, texto: 'En a–t: la combi, horizontal en 2 m/s²; el mototaxi, en 0.', ecuacion: [Ma, ' = ', pa('2 m/s²'), ' y ', Ma, ' = 0'] },
        { estado: { corte: 6 }, texto: 'El área bajo a–t es cuánto cambió v en 10 s.', ecuacion: [Mdv, ' = ', pa('2'), ' · ', pt('10'), ' = ', pv('20 m/s')] },
        { estado: { corte: 6 }, texto: 'A los 10 s se alcanzan: mismo lugar; la combi va al doble.', ecuacion: [Mx, ' = ', px('100 m'), ';   ', Mv, ' = ', pv('20 m/s')] },
      ],
    },
    regla: {
      texto: 'En el MRUV, la gráfica x–t es una parábola: su inclinación en cada instante es la velocidad. La gráfica a–t es horizontal; su área es Δv.',
      ecuacion: [Mx, ' = ', Mx0, ' + ', Mv0, Mt, ' + ½', Ma, Mt2, '   ·   ', Mv, ' = ', { llave: ['inclinación'], nota: 'de x–t', color: 'c-o' }, '   ·   ', Mdv, ' = ', { llave: ['área'], nota: 'bajo a–t', color: 'c-o' }],
      condicion: 'a no cambia en el tramo. Se alcanzan donde se cortan las x–t; igual velocidad, donde se cortan las v–t.',
    },
    resuelve: {
      pieza: 'fis-mruv',
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const vm = r.de([4, 6, 8, 10, 12]), a = r.de([1, 2, 4]), ta = 2 * vm / a, xa = vm * ta;
          return {
            enunciado: ['Un mototaxi pasa por el paradero a ', pv(ms(vm)), ' justo cuando una combi arranca de ahí con ', pa(`a = ${ms2(a)}`), '. ¿Cuándo y dónde la combi lo alcanza?'],
            datos: DB4,
            pasos: [
              { tipo: 'pide', texto: ['Piden el instante ', Mt, ' del alcance y la posición ', Mx, ' donde ocurre.'] },
              { tipo: 'datos', texto: ['Los dos salen del paradero (x = 0) a la vez: el mototaxi a ', pv(ms(vm)), ' parejo; la combi del reposo con ', pa(ms2(a)), '.'] },
              { tipo: 'regla', texto: ['Se alcanzan cuando sus x son iguales: donde se cortan sus gráficas x–t.'] },
              { tipo: 'cuentas', texto: 'Se igualan y se despeja t (t = 0 es la salida):', ecuacion: [pv(String(vm)), Mt, ' = ½ · ', pa(fm(a)), ' · ', Mt2, '   →   ', Mt, ' = ', pt(`${fm(ta)} s`), ';   ', Mx, ' = ', pv(String(vm)), ' · ', pt(fm(ta)), ' = ', px(`${fm(xa)} m`)] },
              { tipo: 'sentido', texto: `A los ${fm(ta)} s la combi va a ${fm(a * ta)} m/s: el doble que el mototaxi.` },
            ],
            respuesta: ['A los ', pt(`${fm(ta)} s`), ', en ', px(`${fm(xa)} m`)],
          };
        }
        const v0 = r.de([0, 2, 4, 6]), a1 = r.de([1, 2, 3]), t1 = r.ent(2, 4), a2 = -r.de([1, 2]), t2 = r.ent(1, 3), vf = v0 + a1 * t1 + a2 * t2;
        return {
          enunciado: ['Una combi va a ', pv(ms(v0)), '. Su gráfica a–t vale ', pa(ms2(a1)), ' durante ', pt(`${t1} s`), ' y luego ', pa(ms2(a2)), ' durante ', pt(`${t2} s`), '. ¿Qué velocidad tiene al final?'],
          datos: DB4, dibujo: at([[a1, t1], [a2, t2]]),
          pasos: [
            { tipo: 'pide', texto: ['Piden la velocidad final, ', Mv, '.'] },
            { tipo: 'datos', texto: ['Sale a ', pv(ms(v0)), '; la gráfica a–t tiene un tramo sobre el eje y otro bajo el eje.'] },
            { tipo: 'regla', texto: ['El área bajo a–t es cuánto cambió la velocidad, ', Mdv, ', con su signo.'] },
            { tipo: 'cuentas', texto: 'Las dos áreas, sumadas a la velocidad de salida:', ecuacion: [Mv, ` = ${fm(v0)} + ${fm(a1)} · ${t1} + (${fm(a2)}) · ${t2} = `, pv(ms(vf))] },
            { tipo: 'sentido', texto: `Subió a ${fm(v0 + a1 * t1)} m/s y después bajó: termina en ${fm(vf)} m/s.` },
          ],
          respuesta: [pv(`v = ${ms(vf)}`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-mruv',
      generar(s) {
        const r = azar(s + 71), k = s % 4;
        if (k === 0) {
          const v0 = r.de([2, 4, 6, 8, 10]), a = r.de([1, 1.5, 2, 2.5, 3]), ti = r.ent(2, 6), vf = v0 + a * ti;
          return {
            pregunta: ['Una combi va a ', pv(ms(v0)), ' y su gráfica a–t es una horizontal en ', pa(ms2(a)), ' durante ', pt(`${ti} s`), '. ¿Qué velocidad tiene al final?'],
            datos: DB4, dibujo: at([[a, ti]]),
            opciones: cuatro(vf, [
              { id: 'sin-v0', valor: a * ti, error: 'K4', siFuera: `Bien el área, ${fm(a * ti)} m/s. Pero ya iba a ${fm(v0)} m/s: se suman.` },
              { id: 'un-seg', valor: v0 + a, error: 'K-TIEMPO', siFuera: `Esa es la velocidad después de 1 s. El área dura ${ti} s.` },
              { id: 'medio', valor: v0 + a * ti / 2, error: 'G4-medio', siFuera: 'Bien que sumes el área. Pero es un rectángulo entero, sin dividir entre 2.' },
              { id: 'cuadrado', valor: v0 + a * ti * ti, error: 'K-CUADRADO', siFuera: 'Bien que partas de v₀. Pero el área es base por altura: a · t.' },
            ], ms),
            solucion: { texto: 'El área bajo a–t es lo que ganó.', ecuacion: [Mv, ' = ', pv(fm(v0)), ' + ', pa(fm(a)), ' · ', pt(String(ti)), ' = ', pv(ms(vf))] },
          };
        }
        if (k === 1) {
          const mov = r.de(['acelera', 'frena', 'pareja']), g = r.de(['xt', 'vt', 'at']), M = MOVS[mov];
          const otras = ['xt', 'vt', 'at'].filter(x => x !== g);
          const ops = [{ id: 'c', texto: FORMA[M[g]], correcta: true }];
          const usados = new Set([M[g]]);
          for (const o of otras) if (!usados.has(M[o])) { usados.add(M[o]); ops.push({ id: `como-${o}`, texto: FORMA[M[o]], error: 'G3', siFuera: `Esa forma es la de su gráfica ${NOMBRE_G[o]}. Cada gráfica tiene la suya.` }); }
          if (!usados.has(M.otro[g])) ops.push({ id: 'sentido', texto: FORMA[M.otro[g]], error: 'G-SENTIDO', siFuera: `Esa forma sería la ${NOMBRE_G[g]} de una combi que ${mov === 'acelera' ? 'frena' : 'acelera'}.` });
          return {
            pregunta: ['Una combi ', M.texto, '. ¿Cómo es su gráfica ', NOMBRE_G[g], '?'],
            datos: DB4,
            opciones: ops.slice(0, 4),
            solucion: { texto: `${{ acelera: 'v sube pareja y a es constante y positiva', frena: 'v baja pareja y a es constante y negativa', pareja: 'v no cambia y a = 0' }[mov]}.`, ecuacion: [NOMBRE_G[g], ': ', FORMA[M[g]].toLowerCase()] },
          };
        }
        if (k === 2) {
          const vm = r.de([6, 8, 10, 12, 15]), a = r.de([1, 1.5, 2, 3]), ti = vm / a;
          return {
            pregunta: ['Un mototaxi pasa por el paradero a ', pv(ms(vm)), ' justo cuando una combi arranca de ahí con ', pa(ms2(a)), '. ¿Cuándo tienen la misma velocidad?'],
            datos: DB4,
            opciones: cuatro(ti, [
              { id: 'alcance', valor: 2 * ti, error: 'K1-a', siFuera: 'Bien: ahí se alcanzan, en el mismo lugar. Pero la combi ya va al doble.' },
              { id: 'salida', valor: 0, error: 'K1-b', siFuera: 'Bien: al salir están juntos. Pero la combi está quieta y el mototaxi no.' },
              { id: 'mitad', valor: ti / 2, error: 'MRUV-MITAD', siFuera: `Bien la idea. Pero a esa hora la combi va a ${fm(a * ti / 2)} m/s, no a ${fm(vm)}.` },
            ], n => `${fm(n)} s`),
            solucion: { texto: `La combi gana ${fm(a)} m/s cada segundo hasta ${fm(vm)} m/s.`, ecuacion: [Mt, ' = ', { frac: [pv(fm(vm)), pa(fm(a))] }, ' = ', pt(`${fm(ti)} s`)] },
          };
        }
        // Nivel examen (San Marcos 2022 y 2024-II): a–t por tramos desde el reposo y el alcance desde atrás.
        if (Math.floor(s / 4) % 2 === 0) {
          let a1, t1, t2, t3, vmax, a3;
          do { a1 = r.de([2, 3, 4]); t1 = r.ent(2, 4); t2 = r.ent(2, 5); t3 = r.de([2, 3, 4, 6]); vmax = a1 * t1; a3 = vmax / t3; } while (!Number.isInteger(a3 * 2) || a3 > 6);
          const d = vmax * (t1 / 2 + t2 + t3 / 2);
          return {
            pregunta: ['Una combi parte del reposo. Su gráfica a–t vale ', pa(ms2(a1)), ' durante ', pt(`${t1} s`), ', 0 durante ', pt(`${t2} s`), ' y ', pa(ms2(-a3)), ' durante ', pt(`${t3} s`), '. ¿Qué distancia recorre?'],
            datos: DB4b, dibujo: at([[a1, t1], [0, t2], [-a3, t3]]),
            opciones: cuatro(d, [
              { id: 'area-at', valor: 0, error: 'G4', siFuera: 'Ese 0 es el área de a–t: cuánto cambió v. La distancia es el área de v–t.' },
              { id: 'rect', valor: vmax * (t1 + t2 + t3), error: 'DX-RECT', siFuera: `Bien la velocidad tope, ${fm(vmax)} m/s. Pero solo la tuvo en el tramo del medio.` },
              { id: 'tramo', valor: vmax * t2, error: 'DX-TRAMO', siFuera: 'Bien el tramo parejo. Falta lo que avanzó mientras aceleraba y mientras frenaba.' },
            ], n => `${fm(n)} m`),
            solucion: { texto: `Con a–t, v sube a ${fm(vmax)} m/s, sigue y baja a 0. El área de v–t:`, ecuacion: [`${fm(vmax * t1 / 2)} + ${fm(vmax * t2)} + ${fm(vmax * t3 / 2)} = `, pdx(`${fm(d)} m`)] },
          };
        }
        let a, ta, vm, D;
        do { a = r.de([1, 2, 4]); ta = r.ent(4, 12); vm = r.de([4, 6, 8, 10]); D = a * ta * ta / 2 - vm * ta; } while (D <= 0 || D > 60 || !Number.isInteger(D));
        return {
          pregunta: ['Un mototaxi pasa por el grifo a ', pv(ms(vm)), '. En ese instante, una combi arranca del paradero, ', px(`${D} m`), ' detrás, con ', pa(ms2(a)), '. ¿Qué distancia recorre el mototaxi hasta que lo alcanzan?'],
          datos: [...DB4, 'Una ecuación de segundo grado puede tener dos raíces; aquí t no es negativo.'],
          opciones: cuatro(vm * ta, [
            { id: 'perseguidor', valor: vm * ta + D, error: 'K-ALC-PERSEGUIDOR', siFuera: `Esa es la distancia de la combi: salió ${D} m más atrás.` },
            { id: 'separacion', valor: D, error: 'K-ALC-D', siFuera: 'Esa es la separación al empezar. Mientras tanto, el mototaxi sigue avanzando.' },
            { id: 'igual-v', valor: vm * vm / a, error: 'K1-a', siFuera: 'Eso es lo que avanza hasta que van igual de rápido; ahí la combi aún va atrás.' },
          ], n => `${fm(n)} m`),
          solucion: { texto: `Con el paradero en el 0: ½ · ${fm(a)} · t² = ${D} + ${vm} t, de donde t = ${ta} s.`, ecuacion: [pv(String(vm)), ' · ', pt(String(ta)), ' = ', pdx(`${fm(vm * ta)} m`)] },
        };
      },
    },
  };

  // ---------- Ideas 5 y 6 (B5, B6): caída libre ----------
  const G = 10; // convención del examen (g ≈ 9,8 m/s² medido)
  const DG = 'g = 10 m/s² (convención del examen); sin aire.';

  // ---------- Idea 5 (B5): caída libre desde el reposo ----------
  // Pieza fis-mruv, vista «regla»: tu compañero suelta una regla de 30 cm entre tus dedos y tú cierras los dedos cuando
  // quieres. Cambia: cuándo cierras los dedos · Permanece: la regla, que sale del reposo · Progresa: el reloj, en cámara
  // lenta, con una rayita donde estaba el 0 cada 0,05 s · Se reserva: soltar dos cosas de distinta masa (la predicción) ·
  // Debe verse: en tiempos iguales cae cada vez más (las rayitas se separan).
  const caeCm = t => 100 * G * t * t / 2;   // ½·g·t², en cm
  const juegoB5 = val => {
    const cierra = val.t >= val.tc - 1e-9, h = caeCm(val.tc), esc = cierra && h > 30, tt = cierra && !esc ? val.tc : val.t;
    const marcas = [];
    for (let k = 0; k * 0.05 <= tt + 1e-9; k++) marcas.push({ cm: caeCm(k * 0.05), texto: `${f(k * 0.05, 2)} s` });
    return mruv({ vista: 'regla', cae: caeCm(tt), soltada: val.t > 0, cerrada: cierra, escapo: esc, marcas, atrapa: cierra && !esc ? `${fm(h)} cm` : undefined });
  };
  // La canica y la piedra desde la ventana del segundo piso, a 5 m del patio: cada 0,2 s, la altura y la velocidad.
  const PASOS_B5 = [0, 1, 2, 3, 4, 5].map(k => 5 - G * (k * 0.2) ** 2 / 2), VEL_B5 = [0, -2, -4, -6, -8, 0];
  const PAB_B5 = { vista: 'pabellon', alto: 6, paso: 0.5, numero: 1, edificio: { techo: 6, pisos: 2, ventana: 5 }, g: false };
  const DB5 = [DG,
    ['Desde el reposo: ', Mv, ' = ', Mg, ' · ', Mt, ' y ', Mh, ' = ½ · ', Mg, ' · ', Mt2],
    ['Velocidad y lo que cayó: ', { sup: [Mv, '2'] }, ' = 2 · ', Mg, ' · ', Mh],
    'h se mide hacia abajo, desde donde se suelta.'];

  // Ejemplos de B5. Cuentas rehechas aparte (scratchpad f3/cuentas.js, 18 nov): ½·10·3²; 10·1; √(2·3,2/10);
  // ½·10·0,1² (en cm); √(2·1,8/10); √(2·0,2/10); √(2·10·20); √(2·10·45) y ·3,6; 45 − 20; √(2·40/10);
  // √(2·45/10) − √(2·20/10); √(2·45/10) + 45/340; √(2·10·40); 5·(2n − 1) = 25; ½·10·2².
  const EJEMPLOS_CAIDA = [
    { nivel: 1, titulo: 'La piedra del puente',
      enunciado: ['Sueltas una piedra desde un puente y llega al río en ', pt('3 s'), '. ¿Desde qué altura cayó?'],
      datos: DB5,
      solucion: [{ texto: 'Sale del reposo: lo que cae es ½ g t².', ecuacion: [Mh, ' = ½ · ', pa('10'), ' · ', pt('3'), '² = ', ph('45 m')] }],
      respuesta: [ph('h = 45 m')] },
    { nivel: 1, titulo: 'Desde el techo',
      figura: mruv(Object.assign({}, PAB_B5, { alto: 6, edificio: { techo: 5, pisos: 2 }, pelotas: [{ y: 5 }] })),
      enunciado: ['Sueltas una pelota desde el techo del pabellón y llega al patio en ', pt('1 s'), '. ¿Con qué velocidad llega?'],
      datos: DB5,
      solucion: [{ texto: 'Desde el reposo, gana 10 m/s en cada segundo.', ecuacion: [Mv, ' = ', pa('10'), ' · ', pt('1'), ' = ', pv('10 m/s')] }],
      respuesta: [pv('10 m/s'), ', hacia abajo'] },
    { nivel: 1, titulo: '¿Cuánto tarda?',
      figura: mruv(Object.assign({}, PAB_B5, { alto: 6, edificio: { techo: 6, pisos: 2, ventana: 3.2 }, pelotas: [{ y: 3.2 }] })),
      enunciado: ['Sueltas un borrador desde la ventana del segundo piso, a ', ph('3,2 m'), ' del patio. ¿Cuánto tarda en llegar?'],
      datos: DB5,
      solucion: [{ texto: 'Se despeja t de lo que cae:', ecuacion: [ph('3,2'), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt2, ' = 0,64   →   ', Mt, ' = ', pt('0,8 s')] }],
      respuesta: ['Tarda ', pt('0,8 s')] },
    { nivel: 1, titulo: 'La regla a los 0,1 s',
      figura: mruv({ vista: 'regla', cae: 0 }),
      enunciado: ['Tu compañero suelta una regla entre tus dedos y la atrapas ', pt('0,1 s'), ' después. ¿Cuántos centímetros cayó?'],
      datos: [...DB5, '1 m = 100 cm'],
      solucion: [{ texto: 'Lo que cae, en metros, y después a centímetros:', ecuacion: [Mh, ' = ½ · ', pa('10'), ' · ', pt('0,1'), '² = ', ph('0,05 m'), ' = ', ph('5 cm')] }],
      respuesta: [ph('5 cm')] },
    { nivel: 1, titulo: 'La canica y la plastilina',
      figura: mruv(Object.assign({}, PAB_B5, { alto: 3, paso: 0.5, numero: 1, edificio: { techo: 3, pisos: 1, ventana: 1.8 }, pelotas: [{ y: 1.8, chica: true, rotulo: 'canica' }, { y: 1.8, grande: true, rotulo: 'plastilina' }] })),
      enunciado: ['Desde una ventana a ', ph('1,8 m'), ' del suelo sueltas a la vez una canica y una bola de plastilina cinco veces más pesada. ¿Cuánto tarda cada una?'],
      datos: DB5,
      solucion: [
        { texto: 'Sin aire, las dos caen con la misma g: la masa no entra en la cuenta.', ecuacion: [ph('1,8'), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt, ' = ', pt('0,6 s')] },
      ],
      respuesta: ['Las dos, ', pt('0,6 s')] },
    { nivel: 2, titulo: 'Tu tiempo de reacción',
      figura: mruv({ vista: 'regla', cae: 20, soltada: true, cerrada: true, atrapa: '20 cm' }),
      enunciado: ['Atrapas la regla cuando ya cayó ', ph('20 cm'), '. ¿Cuánto tardaste en cerrar los dedos?'],
      datos: [...DB5, '1 m = 100 cm'],
      solucion: [
        { texto: 'Primero, lo que cayó en metros:', ecuacion: [ph('20 cm'), ' = ', ph('0,2 m')] },
        { texto: 'Después se despeja t:', ecuacion: [ph('0,2'), ' = ½ · ', pa('10'), ' · ', Mt2, '   →   ', Mt2, ' = 0,04   →   ', Mt, ' = ', pt('0,2 s')] },
      ],
      respuesta: ['Tardaste ', pt('0,2 s')] },
    { nivel: 2, titulo: 'La velocidad sin el tiempo',
      enunciado: ['Una maceta cae desde una azotea a ', ph('20 m'), ' de la vereda. ¿Con qué velocidad llega a la vereda?'],
      datos: DB5,
      solucion: [
        { texto: 'Sin el tiempo, sirve la ecuación de velocidad y altura:', ecuacion: [{ sup: [Mv, '2'] }, ' = 2 · ', pa('10'), ' · ', ph('20'), ' = 400'] },
        { texto: 'Se saca la raíz:', ecuacion: [Mv, ' = ', pv('20 m/s')] },
      ],
      respuesta: [pv('20 m/s'), ', hacia abajo'] },
    { nivel: 2, titulo: 'En km/h',
      enunciado: ['Una piedra se suelta desde un puente a ', ph('45 m'), ' del río. ¿Con qué rapidez llega al agua, en km/h?'],
      datos: [...DB5, DA.kmh],
      solucion: [
        { texto: 'La velocidad al llegar, en m/s:', ecuacion: [{ sup: [Mv, '2'] }, ' = 2 · ', pa('10'), ' · ', ph('45'), ' = 900   →   ', Mv, ' = ', pv('30 m/s')] },
        { texto: 'A km/h, por 3600 s en 1 h y 1000 m en 1 km:', ecuacion: [pv('30 m/s'), ' = ', { frac: ['30 · 3600', '1000'] }, ' = ', pv('108 km/h')] },
      ],
      respuesta: [pv('108 km/h')] },
    { nivel: 2, titulo: 'El tercer segundo',
      enunciado: ['Una piedra se suelta desde un acantilado alto. ¿Cuánto cae durante el tercer segundo, entre ', pt('t = 2 s'), ' y ', pt('t = 3 s'), '?'],
      datos: DB5,
      solucion: [
        { texto: 'Lo que cayó hasta los 2 s y hasta los 3 s:', ecuacion: [Mh, '(', pt('2'), ') = ½ · 10 · 4 = ', ph('20 m'), ';   ', Mh, '(', pt('3'), ') = ½ · 10 · 9 = ', ph('45 m')] },
        { texto: 'En el tercer segundo, la resta:', ecuacion: [ph('45'), ' − ', ph('20'), ' = ', ph('25 m')] },
      ],
      respuesta: [ph('25 m')] },
    { nivel: 2, titulo: 'El doble de altura',
      enunciado: ['Una piedra tarda ', pt('2 s'), ' en caer desde una altura. ¿Cuánto tarda desde el doble de esa altura?'],
      datos: DB5,
      solucion: [
        { texto: 'La primera altura:', ecuacion: [Mh, ' = ½ · ', pa('10'), ' · ', pt('2'), '² = ', ph('20 m'), ';   el doble: ', ph('40 m')] },
        { texto: 'Desde 40 m: no es el doble de tiempo, porque h va con t².', ecuacion: [ph('40'), ' = 5', Mt2, '   →   ', Mt, ' = √8 = ', pt('2,83 s')] },
      ],
      respuesta: ['Unos ', pt('2,83 s'), ', no 4 s'] },
    { nivel: 3, titulo: 'Dos esferas a la vez',
      enunciado: ['Se sueltan a la vez una esfera de 2 kg desde ', ph('20 m'), ' y otra de 5 kg desde ', ph('45 m'), '. ¿Cuántos segundos después de la primera llega la segunda al suelo?'],
      alternativas: ['0 s', '1 s', '2,5 s', '3 s', '5 s'],
      datos: DB5,
      solucion: [
        { texto: 'Sin aire, la masa no cuenta: cada una tarda lo que su altura dice.', ecuacion: [ph('20'), ' = 5', Mt2, ' → ', pt('2 s'), ';   ', ph('45'), ' = 5', Mt2, ' → ', pt('3 s')] },
        { texto: 'La diferencia:', ecuacion: [pt('3'), ' − ', pt('2'), ' = ', pt('1 s')] },
        { texto: ['La ', neg('A'), ' cree que llegan juntas; la ', neg('C'), ' divide la diferencia de alturas entre g.'] },
      ],
      respuesta: [neg('B'), ', ', pt('1 s')] },
    { nivel: 3, titulo: 'El pozo y el eco',
      enunciado: ['Sueltas una piedra en un pozo seco de ', ph('45 m'), '. ¿Cuánto después de soltarla oyes el golpe en el fondo?'],
      alternativas: ['3 s', '6 s', '0,13 s', '3,13 s', '4,5 s'],
      datos: [...DB5, 'Sonido en el aire: unos 340 m/s, sin aceleración.'],
      solucion: [
        { texto: 'La piedra baja:', ecuacion: [ph('45'), ' = 5', Mt2, '   →   ', pt('3 s')] },
        { texto: 'El sonido sube parejo:', ecuacion: [{ frac: ['45 m', '340 m/s'] }, ' = ', pt('0,13 s'), ';   en total, ', pt('3,13 s')] },
        { texto: ['La ', neg('A'), ' olvida que el sonido también tarda; la ', neg('C'), ' es solo el sonido.'] },
      ],
      respuesta: [neg('D'), ', ', pt('3,13 s')] },
    { nivel: 3, titulo: 'A media altura',
      enunciado: ['Una piedra se suelta desde ', ph('80 m'), '. ¿Qué rapidez tiene cuando ya cayó la mitad, ', ph('40 m'), '?'],
      alternativas: ['28,28 m/s', '20 m/s', '40 m/s', '14,14 m/s', '10 m/s'],
      datos: DB5,
      solucion: [
        { texto: 'Con lo que cayó hasta ahí, 40 m:', ecuacion: [{ sup: [Mv, '2'] }, ' = 2 · ', pa('10'), ' · ', ph('40'), ' = 800   →   ', Mv, ' = ', pv('28,28 m/s')] },
        { texto: ['Al llegar al suelo va a 40 m/s; la ', neg('B'), ' supone que a media altura va a la mitad. No: v crece con √h.'] },
      ],
      respuesta: [neg('A'), ', ', pv('28,28 m/s')] },
    { nivel: 3, titulo: 'El último segundo',
      enunciado: ['Una piedra soltada desde lo alto de un cerro cae ', ph('25 m'), ' en su último segundo de caída. ¿Desde qué altura se soltó?'],
      alternativas: ['25 m', '30 m', '45 m', '50 m', '20 m'],
      datos: DB5,
      solucion: [
        { texto: 'Si cae n segundos, en el último cae h(n) − h(n − 1):', ecuacion: ['5', { sup: ['n', '2'] }, ' − 5', { sup: ['(n − 1)', '2'] }, ' = 5(2n − 1) = ', ph('25'), '   →   n = 3'] },
        { texto: 'En 3 s cae:', ecuacion: [Mh, ' = ½ · ', pa('10'), ' · ', pt('3'), '² = ', ph('45 m')] },
        { texto: ['La ', neg('A'), ' toma los 25 m del último segundo como toda la altura.'] },
      ],
      respuesta: [neg('C'), ', ', ph('45 m')] },
    { nivel: 3, titulo: 'A la mitad del tiempo',
      enunciado: ['Una piedra tarda ', pt('4 s'), ' en caer desde un acantilado. ¿Cuánto había caído a los ', pt('2 s'), '?'],
      alternativas: ['40 m', '60 m', '10 m', '80 m', '20 m'],
      datos: DB5,
      solucion: [
        { texto: 'Lo que cae va con t²: a la mitad del tiempo, la cuarta parte.', ecuacion: [Mh, '(', pt('2'), ') = ½ · ', pa('10'), ' · ', pt('2'), '² = ', ph('20 m'), ';   ', Mh, '(', pt('4'), ') = ', ph('80 m')] },
        { texto: ['La ', neg('A'), ' toma la mitad de la altura, como si cayera parejo; la ', neg('D'), ' es toda la caída.'] },
      ],
      respuesta: [neg('E'), ', ', ph('20 m')] },
  ];

  const caidaReposo = {
    id: 'caida-reposo',
    titulo: 'Caída libre desde el reposo',
    pregunta: 'Si sueltas a la vez una canica y una piedra, ¿cuál llega primero?',
    temas: ['Caída libre'],
    pieza: 'fis-mruv',
    aprendizaje: 'Sin aire, todo lo que se suelta cae con la misma g, pese lo que pese: v = g·t y h = ½·g·t².',
    actividad: 'Atrapar una regla que suelta tu compañero.',
    lee: {
      tarjetas: [
        { titulo: 'Caída libre', texto: 'Si sueltas algo y el aire casi no lo frena, cae solo: eso es una caída libre. La Tierra lo jala hacia abajo; ese jalón es la gravedad.',
          dibujo: mruv({ vista: 'regla', cae: 0 }) },
        { titulo: 'Una aceleración hacia abajo', texto: ['Mientras cae, su velocidad crece cada segundo: tiene aceleración. Sin aire, vale unos 9,8 m/s²; en los problemas se usa ', Mg, ' = 10 m/s². ', Mh, ' es lo que cae desde donde se soltó.'] },
        { titulo: 'El aire sí estorba', texto: 'Una hoja extendida baja despacio, meciéndose; la misma hoja hecha bolita cae rápido. La diferencia es el aire, que frena más a la hoja extendida. En esta idea, el aire no cuenta.' },
        { titulo: 'Qué mirar al jugar', texto: 'Tu compañero sostiene una regla de 30 cm entre tus dedos, con el 0 abajo, y la suelta. Tú eliges cuándo cierras los dedos. Mira en qué marca la atrapas.' },
      ],
    },
    ejemplos: EJEMPLOS_CAIDA,
    juega: {
      pieza: 'fis-mruv',
      consigna: 'Tu compañero suelta la regla de 30 cm y tú cierras los dedos. El reloj va en cámara lenta.',
      mision: {
        texto: 'Atrápala justo en la marca de 20 cm.',
        logrado: val => val.tc === 0.2,
        bien: 'Listo: la atrapas en esa marca. Prueba la mitad de tiempo: ¿cae la mitad?',
      },
      voz: 'Mira cómo se separan las rayitas.',
      leyenda: [
        { s: [Mh], t: 'lo que cae la regla, en cm' },
        { s: [Mt], t: 'segundos desde que la suelta' },
        { s: 'rayitas', t: 'dónde estaba el 0 cada 0,05 s' },
        { s: 'cm', t: 'centímetro: 100 caben en un metro' },
      ],
      controles: [
        { id: 'tc', etiqueta: 'Cierras los dedos a los', color: 'c-i', min: 0.05, max: 0.25, paso: 0.05, inicio: 0.1, unidad: 's', decimales: 2 },
        { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: 0.3, paso: 0.01, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: juegoB5,
      lectura: val => {
        const cierra = val.t >= val.tc - 1e-9, h = caeCm(val.tc);
        if (cierra && h > 30) return ['A los ', pt(`${fm(val.tc)} s`), ' ya cayó ', ph(`${fm(h)} cm`), ': se escapó'];
        if (cierra) return ['La atrapas a los ', pt(`${fm(val.tc)} s`), ': cayó ', ph(`${fm(h)} cm`)];
        return ['A los ', pt(`${fm(val.t)} s`), ' de soltarla cayó ', ph(`${fm(caeCm(val.t))} cm`)];
      },
      resumen: { tc: 0.15, t: 0.3 },
      minimo: 3,
    },
    predice: {
      pregunta: 'Desde la ventana del segundo piso sueltas a la vez una canica y una piedra diez veces más pesada. ¿Cuál llega primero al patio?',
      datos: ['Sin resistencia del aire.', 'La ventana está a 5 m del patio.'],
      opciones: [
        { id: 'c', texto: 'Llegan a la vez', correcta: true },
        { id: 'decima', texto: 'La piedra, en la décima parte del tiempo', error: 'C2', siFuera: 'Bien que pienses en el peso: la Tierra jala más a la piedra. Pero también cuesta más moverla.' },
        { id: 'suave', texto: 'La piedra, un poco antes', error: 'C2-suave', siFuera: 'Bien: con aire pasa con cosas livianas, como una hoja. Sin aire, caen igual.' },
        { id: 'liviano', texto: 'La canica, porque es más liviana', error: 'C2-liviano', siFuera: 'Bien que compares. Pero lo liviano no cae más rápido: sin aire, todo cae con la misma g.' },
      ],
      dibujo: mruv(Object.assign({}, PAB_B5, { pelotas: [{ y: 5, chica: true, rotulo: 'canica' }, { y: 5, grande: true, rotulo: 'piedra' }] })),
      revelar: mruv(Object.assign({}, PAB_B5, { pelotas: [{ y: 0, chica: true, rotulo: 'canica', marcas: PASOS_B5.slice(0, 5) }, { y: 0, grande: true, rotulo: 'piedra', marcas: PASOS_B5.slice(0, 5) }] })),
      coincide: 'Coincide: sin aire, la gravedad acelera igual a las dos; llegan juntas al segundo.',
    },
    mira: {
      datos: Object.assign({}, PAB_B5, { pelotas: [{ chica: true, rotulo: 'canica', pasos: PASOS_B5, pasosV: VEL_B5 }, { grande: true, rotulo: 'piedra', pasos: PASOS_B5, pasosV: VEL_B5, texto: '' }] }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Se sueltan juntas desde 5 m, sin velocidad.', ecuacion: [Mv0, ' = 0'] },
        { estado: { corte: 1 }, texto: 'En 0,2 s, las dos ganan lo mismo: 2 m/s hacia abajo.', ecuacion: [Mv, ' = ', Mg, ' · ', Mt, ' = 10 · ', pt('0,2'), ' = ', pv('2 m/s')] },
        { estado: { corte: 3 }, texto: 'Van juntas: en cada instante, la misma velocidad y la misma altura.' },
        { estado: { corte: 4 }, texto: 'En cada 0,2 s caen más: 0,2 m, 0,6 m, 1 m…', ecuacion: [ph('0,2'), ' + ', ph('0,6'), ' + ', ph('1'), ' + ', ph('1,4'), ' + ', ph('1,8'), ' = ', ph('5 m')] },
        { estado: { corte: 5 }, texto: 'En 1 s cayeron los 5 m: lo que cae crece con t².', ecuacion: [Mh, ' = ½ · ', Mg, ' · ', Mt2, ' = ½ · 10 · ', pt('1'), '² = ', ph('5 m')] },
        { estado: { corte: 5 }, texto: 'Llegan a la vez: g no depende de la masa.', ecuacion: [Ma, ' = ', Mg, ' = ', pa('10 m/s²'), ' para las dos'] },
      ],
    },
    regla: {
      texto: 'Sin aire, todo lo que se suelta cae con la misma aceleración g, pese lo que pese. Desde el reposo, v crece con t y lo que cae, con t².',
      ecuacion: [Mv, ' = ', Mg, Mt, '   ·   ', Mh, ' = ½', Mg, Mt2, '   ·   ', { sup: [Mv, '2'] }, ' = 2', Mg, Mh],
      condicion: 'desde el reposo, sin aire y cerca del suelo; h se mide hacia abajo desde donde se suelta. g = 10 m/s².',
    },
    resuelve: {
      pieza: 'fis-mruv',
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const v = r.de([10, 20, 30, 40]), H = v * v / (2 * G);
          return {
            enunciado: ['Una piedra soltada desde un puente llega al río a ', pv(ms(v)), '. ¿Desde qué altura cayó?'],
            datos: DB5,
            pasos: [
              { tipo: 'pide', texto: ['Piden la altura ', Mh, ' desde donde cayó.'] },
              { tipo: 'datos', texto: ['Sale del reposo y llega a ', pv(ms(v)), '. No dan el tiempo.'] },
              { tipo: 'regla', texto: ['Sin el tiempo: ', { sup: [Mv, '2'] }, ' = 2 · ', Mg, ' · ', Mh, '. Se despeja ', Mh, '.'] },
              { tipo: 'cuentas', texto: 'Se reemplaza:', ecuacion: [Mh, ' = ', { frac: [`${v}²`, '2 · 10'] }, ' = ', ph(`${fm(H)} m`)] },
              { tipo: 'sentido', texto: `Comprobación: tarda ${fm(v / G)} s y ½ · 10 · ${fm(v / G)}² = ${fm(H)} m.` },
            ],
            respuesta: [ph(`h = ${fm(H)} m`)],
          };
        }
        const cm = r.de([5, 11.25, 20, 31.25, 45]), tr = Math.sqrt(2 * cm / 100 / G);
        return {
          enunciado: ['Atrapas una regla que suelta tu compañero cuando ya cayó ', ph(`${fm(cm)} cm`), '. ¿Cuál es tu tiempo de reacción?'],
          datos: [...DB5, '1 m = 100 cm'],
          dibujo: mruv({ vista: 'regla', cae: Math.min(cm, 29), soltada: true, cerrada: cm <= 30, escapo: cm > 30 }),
          pasos: [
            { tipo: 'pide', texto: ['Piden el tiempo ', Mt, ' que tardas en cerrar los dedos.'] },
            { tipo: 'datos', texto: ['La regla sale del reposo y cae ', ph(`${fm(cm)} cm`), ' = ', ph(`${fm(cm / 100)} m`), '.'] },
            { tipo: 'regla', texto: ['Desde el reposo: ', Mh, ' = ½ · ', Mg, ' · ', Mt2, '. Se despeja ', Mt, '.'] },
            { tipo: 'cuentas', texto: 'Se reemplaza, en metros:', ecuacion: [ph(fm(cm / 100)), ' = 5', Mt2, '   →   ', Mt, ' = ', pt(`${fm(tr)} s`)] },
            { tipo: 'sentido', texto: 'Un tiempo de reacción de unas décimas de segundo es lo normal.' },
          ],
          respuesta: ['Unos ', pt(`${fm(tr)} s`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-mruv',
      generar(s) {
        const r = azar(s + 83), k = s % 4, m = n => `${fm(n)} m`, sg = n => `${fm(n)} s`;
        if (k === 0) {
          const ti = r.de([1.5, 2, 2.5, 3, 4, 5]), H = G * ti * ti / 2;
          return {
            pregunta: ['Sueltas una piedra desde un puente y llega al río en ', pt(sg(ti)), '. ¿Desde qué altura cayó?'],
            datos: DB5,
            opciones: cuatro(H, [
              { id: 'sin-medio', valor: 2 * H, error: 'C-MEDIO', siFuera: 'Bien g · t². Pero lo que cae lleva un ½: ½ · g · t².' },
              { id: 'v', valor: G * ti, error: 'C-VELOCIDAD', siFuera: `Ese número es la velocidad al llegar, ${fm(G * ti)} m/s. Piden la altura.` },
              { id: 'lineal', valor: G * ti / 2, error: 'C-LINEAL', siFuera: 'Bien el ½ · g. Pero el tiempo va al cuadrado.' },
            ], m),
            solucion: { texto: 'Desde el reposo, lo que cae es ½ g t².', ecuacion: [Mh, ` = ½ · 10 · ${fm(ti)}² = `, ph(m(H))] },
          };
        }
        if (k === 1) {
          const H = r.de([5, 20, 45, 80, 125, 1.25, 11.25]), ti = Math.sqrt(2 * H / G);
          return {
            pregunta: ['Sueltas una pelota desde ', ph(m(H)), ' de altura. ¿Cuánto tarda en llegar al suelo?'],
            datos: DB5,
            opciones: cuatro(ti, [
              { id: 'divide', valor: H / G, error: 'C-LINEAL', siFuera: 'Bien que uses h y g. Pero lo que cae va con t²: hay que sacar raíz.' },
              { id: 'sin-2', valor: Math.sqrt(H / G), error: 'C-MEDIO', siFuera: 'Bien la raíz. Pero h = ½ g t²: queda t² = 2h ÷ g.' },
              { id: 'sin-raiz', valor: 2 * H / G, error: 'C-RAIZ', siFuera: `Bien el 2h ÷ g. Pero eso es t²: falta la raíz.` },
            ], sg),
            solucion: { texto: 'Se despeja t de h = ½ g t².', ecuacion: [Mt, ' = √(2 · ', ph(fm(H)), ' ÷ 10) = ', pt(sg(ti))] },
          };
        }
        if (k === 2) {
          const H = r.de([5, 20, 45, 80, 125]), v = Math.sqrt(2 * G * H);
          return {
            pregunta: ['Una maceta cae desde una azotea a ', ph(m(H)), ' de la vereda. ¿Con qué rapidez llega a la vereda?'],
            datos: DB5,
            opciones: cuatro(v, [
              { id: 'sin-raiz', valor: 2 * G * H, error: 'C-RAIZ', siFuera: 'Bien 2 · g · h. Pero eso es v²: falta sacar la raíz.' },
              { id: 'sin-2', valor: Math.sqrt(G * H), error: 'C-MEDIO', siFuera: 'Bien la raíz. Pero v² = 2 · g · h: falta el 2.' },
              { id: 'tiempo', valor: Math.sqrt(2 * H / G), error: 'C-TIEMPO', siFuera: 'Ese número es el tiempo de caída, en segundos.' },
            ], ms),
            solucion: { texto: 'Sin el tiempo: v² = 2 g h.', ecuacion: [Mv, ` = √(2 · 10 · ${fm(H)}) = `, pv(ms(v))] },
          };
        }
        // Nivel examen (San Marcos 2019-II y banco): dos esferas de distinta masa y altura, el pozo con eco y el n-ésimo
        // segundo.
        const e = Math.floor(s / 4) % 3;
        if (e === 0) {
          let h1, h2; do { h1 = r.de([5, 20, 45, 80]); h2 = r.de([20, 45, 80, 125]); } while (h2 <= h1);
          const m1 = r.de([1, 2, 3]), m2 = m1 + r.ent(1, 4), dt = Math.sqrt(h2 / 5) - Math.sqrt(h1 / 5);
          return {
            pregunta: ['Se sueltan a la vez una esfera de ', `${m1} kg`, ' desde ', ph(m(h1)), ' y otra de ', `${m2} kg`, ' desde ', ph(m(h2)), '. ¿Cuántos segundos después de la primera llega la segunda?'],
            datos: DB5,
            opciones: cuatro(dt, [
              { id: 'juntas', valor: 0, error: 'C-JUNTAS', siFuera: 'Bien: la masa no cuenta. Pero salen de alturas distintas.' },
              { id: 'lineal', valor: (h2 - h1) / G, error: 'C-LINEAL', siFuera: 'Bien que compares las alturas. Pero h va con t²: se calcula cada tiempo.' },
              { id: 'resta', valor: Math.sqrt(2 * (h2 - h1) / G), error: 'C-RESTA-ALTURAS', siFuera: 'Ese es el tiempo de caer la diferencia desde el reposo. Cada una sale del reposo.' },
            ], sg),
            solucion: { texto: `Tardan ${fm(Math.sqrt(h1 / 5))} s y ${fm(Math.sqrt(h2 / 5))} s: la masa no cuenta.`, ecuacion: [pt(fm(Math.sqrt(h2 / 5))), ' − ', pt(fm(Math.sqrt(h1 / 5))), ' = ', pt(sg(dt))] },
          };
        }
        if (e === 1) {
          const H = r.de([20, 45, 80, 125]), tc = Math.sqrt(2 * H / G), ts = H / 340;
          return {
            pregunta: ['Sueltas una piedra en un pozo seco de ', ph(m(H)), '. ¿Cuánto después de soltarla oyes el golpe en el fondo?'],
            datos: [...DB5, 'Sonido en el aire: unos 340 m/s, sin aceleración.'],
            opciones: cuatro(tc + ts, [
              { id: 'sin-sonido', valor: tc, error: 'C-SIN-SONIDO', siFuera: 'Bien la caída. Pero el sonido también tarda en subir.' },
              { id: 'solo-sonido', valor: ts, error: 'C-SOLO-SONIDO', siFuera: 'Bien la subida del sonido. Falta lo que tarda la piedra en bajar.' },
              { id: 'doble', valor: 2 * tc, error: 'C-VUELTA', siFuera: 'Bien la caída. Pero el sonido sube a 340 m/s, no como la piedra.' },
            ], sg),
            solucion: { texto: `La piedra tarda ${fm(tc)} s y el sonido ${fm(H)} ÷ 340 = ${fm(ts)} s.`, ecuacion: [pt(fm(tc)), ' + ', pt(fm(ts)), ' = ', pt(sg(tc + ts))] },
          };
        }
        const nn = r.ent(2, 7), dn = G / 2 * (2 * nn - 1), ord = ['', 'primer', 'segundo', 'tercer', 'cuarto', 'quinto', 'sexto', 'séptimo'][nn];
        return {
          pregunta: ['Se suelta una piedra desde un acantilado alto. ¿Cuánto cae durante el ', ord, ' segundo, entre ', pt(`t = ${nn - 1} s`), ' y ', pt(`t = ${nn} s`), '?'],
          datos: DB5,
          opciones: cuatro(dn, [
            { id: 'total', valor: G / 2 * nn * nn, error: 'C-ENESIMO', siFuera: `Eso es lo que cae en los ${nn} s enteros. Piden solo el último de ellos.` },
            { id: 'v', valor: G * nn, error: 'C-VELOCIDAD', siFuera: `Ese número es su velocidad a los ${nn} s, en m/s.` },
            { id: 'lineal', valor: G / 2 * nn, error: 'C-LINEAL', siFuera: 'Bien el ½ · g. Pero en cada segundo cae más que en el anterior.' },
          ], m),
          solucion: { texto: `h(${nn}) − h(${nn - 1}) = ${fm(5 * nn * nn)} − ${fm(5 * (nn - 1) ** 2)}.`, ecuacion: [Mh, ' = ', ph(m(dn))] },
        };
      },
    },
  };

  // ---------- Idea 6 (B6): lanzamiento vertical ----------
  // Pieza fis-mruv, vista «pabellon»: pateas la pelota hacia arriba junto al pabellón del colegio (techo a 5 m). Cambia:
  // con qué rapidez la pateas · Permanece: la regla de alturas · Progresa: el reloj, con un círculo tenue cada 0,5 s ·
  // Se reserva: la flecha de g y su valor (la predicción: en la cima, a sigue siendo g) · Debe verse: la flecha de v se
  // achica al subir, desaparece en la cima y crece al bajar.
  const T_B6 = 4.5, PAB_B6 = { vista: 'pabellon', alto: 20, paso: 1, numero: 5, edificio: { techo: 5, pisos: 2 } };
  const alturaB6 = (v0, t) => Math.max(0, v0 * t - G * t * t / 2);
  const pelotaB6 = (v0, t, o = {}) => {
    const tv = 2 * v0 / G, tt = Math.min(t, tv), marcas = [];
    for (let k = 0; k * 0.5 <= tt + 1e-9; k++) marcas.push(alturaB6(v0, k * 0.5));
    return mruv(Object.assign({}, PAB_B6, { g: o.g || false, pelotas: [{ y: alturaB6(v0, tt), v: tt >= tv - 1e-9 ? 0 : v0 - G * tt, marcas: o.marcas === false ? [] : marcas }] }));
  };
  const VT_B6 = { vista: 'grafica', x: ejT(4, 1), y: ejV(-20, 20, 10), alto: 150,
    curvas: [{ puntos: [[0, 20], [4, -20]], color: 'o', desde: 1 }],
    areas: [{ puntos: [[0, 20], [2, 0]], color: 'f', rotulo: '+20 m', desde: 4 }, { puntos: [[2, 0], [4, -20]], color: 'f', rotulo: '−20 m', desde: 5 }],
    escalones: [{ t: 0, dt: 1, v: 20, a: -10, desde: 3 }],
    puntos: [{ x: 0, y: 20, color: 'o', desde: 1 }, { x: 2, y: 0, color: 'o', rotulo: 'cima', guias: true, desde: 2 }] };
  const DB6 = [DG, 'Eje hacia arriba: + al subir, − al bajar; y se mide desde donde sale.',
    ['Velocidad: ', Mv, ' = ', Mv0, ' − ', Mg, ' · ', Mt],
    ['Altura: ', My, ' = ', Mv0, ' · ', Mt, ' − ½ · ', Mg, ' · ', Mt2],
    ['Velocidad y altura: ', { sup: [Mv, '2'] }, ' = ', { sup: [Mv0, '2'] }, ' − 2 · ', Mg, ' · ', My]];
  const patea = (v0, o = {}) => mruv(Object.assign({}, PAB_B6, { alto: o.alto || 20, numero: o.numero || 5, g: false, edificio: o.edificio || PAB_B6.edificio, alt: o.alt,
    pelotas: [{ y: o.y || 0, v: v0, texto: `${fm(v0)} m/s` }].concat(o.otra ? [o.otra] : []) }));

  // Ejemplos de B6. Cuentas rehechas aparte (scratchpad f3/cuentas.js, 18 nov): 15/10; 12²/20; 20 − 10·3; 2·8/10;
  // a = −g; √(2·10·20); 20·3 − 5·3²; √(20² − 2·10·15) con signo −; 15 − 10·3; 72/3,6 y 20²/20; −15 = 10t − 5t²;
  // 40 = 20t → 2 s, 40 − 5·2²; a = −g en la cima; 4/2·10 y 20²/20; 30 = 25t − 5t².
  const EJEMPLOS_LANZA = [
    { nivel: 1, titulo: 'Tiempo de subida',
      figura: patea(15),
      enunciado: ['Pateas una pelota hacia arriba con ', Mv0, ' = ', pv('15 m/s'), '. ¿Cuánto tarda en llegar a lo más alto?'],
      datos: DB6,
      solucion: [{ texto: ['Pierde 10 m/s cada segundo hasta ', Mv, ' = 0:'], ecuacion: ['0 = ', pv('15'), ' − ', pa('10'), ' · ', Mt, '   →   ', Mt, ' = ', pt('1,5 s')] }],
      respuesta: ['Tarda ', pt('1,5 s')] },
    { nivel: 1, titulo: 'La altura máxima',
      figura: patea(12),
      enunciado: ['Lanzas una pelota hacia arriba con ', Mv0, ' = ', pv('12 m/s'), '. ¿Qué altura máxima alcanza?'],
      datos: DB6,
      solucion: [{ texto: ['En la cima, ', Mv, ' = 0; sin el tiempo, se despeja la altura:'], ecuacion: ['0 = ', pv('12'), '² − 2 · ', pa('10'), ' · ', MH, '   →   ', MH, ' = ', { frac: ['144', '20'] }, ' = ', ph('7,2 m')] }],
      respuesta: [ph('H = 7,2 m')] },
    { nivel: 1, titulo: 'Después de la cima',
      figura: patea(20),
      enunciado: ['Pateas una pelota hacia arriba con ', Mv0, ' = ', pv('20 m/s'), '. Con el eje hacia arriba, ¿qué velocidad tiene a los ', pt('3 s'), '?'],
      datos: DB6,
      solucion: [{ texto: 'Pierde 10 m/s cada segundo, también después de la cima:', ecuacion: [Mv, ' = ', pv('20'), ' − ', pa('10'), ' · ', pt('3'), ' = ', pv('−10 m/s')] }],
      respuesta: [pv('v = −10 m/s'), ': ya baja'] },
    { nivel: 1, titulo: 'Vuelve a tu mano',
      figura: patea(8, { alto: 6, numero: 1, edificio: { techo: 5, pisos: 2 } }),
      enunciado: ['Lanzas una pelota hacia arriba con ', pv('8 m/s'), ' y la atrapas a la misma altura. ¿Cuánto tiempo estuvo en el aire?'],
      datos: DB6,
      solucion: [{ texto: ['Vuelve cuando ', My, ' = 0 otra vez:'], ecuacion: ['0 = ', pv('8'), Mt, ' − 5', Mt2, '   →   ', Mt, ' = ', { frac: [pv('8'), '5'] }, ' = ', pt('1,6 s')] }],
      respuesta: [pt('1,6 s')] },
    { nivel: 1, titulo: 'La aceleración en la cima',
      figura: patea(12),
      enunciado: ['Lanzas una pelota hacia arriba con ', pv('12 m/s'), '. A los ', pt('1,2 s'), ' está en la cima. Con el eje hacia arriba, ¿cuál es su aceleración ahí?'],
      datos: DB6,
      solucion: [{ texto: 'En la cima v = 0 un instante, pero sigue cambiando: la gravedad no se apaga.', ecuacion: [Ma, ' = −', Mg, ' = ', pa('−10 m/s²')] }],
      respuesta: [pa('a = −10 m/s²'), ', hacia abajo'] },
    { nivel: 2, titulo: '¿Con qué rapidez pateó?',
      figura: mruv(Object.assign({}, PAB_B6, { g: false, pelotas: [{ y: 20 }] })),
      enunciado: ['Una pelota pateada hacia arriba sube hasta ', ph('20 m'), ' sobre el patio. ¿Con qué rapidez salió y cuánto tardó en subir?'],
      datos: DB6,
      solucion: [
        { texto: ['En la cima, ', Mv, ' = 0:'], ecuacion: ['0 = ', { sup: [Mv0, '2'] }, ' − 2 · ', pa('10'), ' · ', ph('20'), '   →   ', Mv0, ' = ', pv('20 m/s')] },
        { texto: 'Pierde 10 m/s cada segundo:', ecuacion: [Mt, ' = ', { frac: [pv('20'), pa('10')] }, ' = ', pt('2 s')] },
      ],
      respuesta: [pv('20 m/s'), '; sube en ', pt('2 s')] },
    { nivel: 2, titulo: 'La altura a los 3 s',
      figura: patea(20),
      enunciado: ['Pateas una pelota hacia arriba con ', pv('20 m/s'), '. ¿A qué altura está a los ', pt('3 s'), ', y va subiendo o bajando?'],
      datos: DB6,
      solucion: [
        { texto: 'La altura:', ecuacion: [My, ' = ', pv('20'), ' · ', pt('3'), ' − ½ · ', pa('10'), ' · ', pt('3'), '² = 60 − 45 = ', ph('15 m')] },
        { texto: 'La velocidad, para saber hacia dónde va:', ecuacion: [Mv, ' = ', pv('20'), ' − ', pa('10'), ' · ', pt('3'), ' = ', pv('−10 m/s'), ':  baja'] },
      ],
      respuesta: [ph('15 m'), ', bajando'] },
    { nivel: 2, titulo: 'Pasa por 15 m al bajar',
      figura: patea(20),
      enunciado: ['Pateas una pelota hacia arriba con ', pv('20 m/s'), '. Con el eje hacia arriba, ¿qué velocidad tiene cuando pasa por ', ph('15 m'), ' al bajar?'],
      datos: DB6,
      solucion: [
        { texto: 'Sin el tiempo:', ecuacion: [{ sup: [Mv, '2'] }, ' = ', pv('20'), '² − 2 · ', pa('10'), ' · ', ph('15'), ' = 100   →   ', Mv, ' = ±', pv('10 m/s')] },
        { texto: 'Pasa dos veces por 15 m: subiendo, +10 m/s; bajando, −10 m/s.' },
      ],
      respuesta: [pv('v = −10 m/s')] },
    { nivel: 2, titulo: 'De vuelta al patio',
      figura: patea(15),
      enunciado: ['Pateas una pelota hacia arriba con ', pv('15 m/s'), '. ¿Cuándo vuelve al patio y con qué velocidad?'],
      datos: DB6,
      solucion: [
        { texto: ['Vuelve cuando ', My, ' = 0:'], ecuacion: ['0 = ', pv('15'), Mt, ' − 5', Mt2, '   →   ', Mt, ' = ', pt('3 s')] },
        { texto: 'La velocidad ahí:', ecuacion: [Mv, ' = ', pv('15'), ' − ', pa('10'), ' · ', pt('3'), ' = ', pv('−15 m/s')] },
      ],
      respuesta: ['A los ', pt('3 s'), ', con ', pv('−15 m/s')] },
    { nivel: 2, titulo: 'Una patada en km/h',
      figura: mruv(Object.assign({}, PAB_B6, { g: false, pelotas: [{ y: 0, v: 20, texto: '72 km/h' }] })),
      enunciado: ['Pateas una pelota hacia arriba a ', pv('72 km/h'), '. ¿Qué altura máxima alcanza?'],
      datos: [...DB6, DA.kmh],
      solucion: [
        { texto: 'A m/s:', ecuacion: [pv('72 km/h'), ' = ', pv('20 m/s')] },
        { texto: ['En la cima, ', Mv, ' = 0:'], ecuacion: [MH, ' = ', { frac: [`${'20'}²`, '20'] }, ' = ', ph('20 m')] },
      ],
      respuesta: [ph('H = 20 m')] },
    { nivel: 3, titulo: 'Desde la azotea',
      // Sin la regla de alturas: el resuelto pone el 0 en la azotea, no en el patio (solo la cota de 15 m).
      figura: mruv(Object.assign({}, PAB_B6, { g: false, regla: false, cota: { de: 0, a: 15, texto: '15 m' }, edificio: { techo: 15, pisos: 5 },
        alt: 'Un edificio de 15 m con una pelota en el borde de la azotea; su flecha de velocidad apunta hacia arriba.', pelotas: [{ y: 15, v: 10, texto: '10 m/s' }] })),
      enunciado: ['Desde una azotea a ', ph('15 m'), ' del patio, lanzas una pelota hacia arriba con ', pv('10 m/s'), '. ¿Cuánto tarda en llegar al patio?'],
      alternativas: ['1 s', '2 s', '1,73 s', '3 s', '−1 s y 3 s'],
      datos: [...DB6, 'Una ecuación de segundo grado puede tener dos raíces; aquí t no es negativo.'],
      solucion: [
        { texto: ['Con el 0 en la azotea, el patio está en ', My, ' = −15 m:'], ecuacion: [ph('−15'), ' = ', pv('10'), Mt, ' − 5', Mt2, '   →   ', Mt2, ' − 2', Mt, ' − 3 = 0'] },
        { texto: 'Sale (t − 3)(t + 1) = 0, y el tiempo no es negativo:', ecuacion: [Mt, ' = ', pt('3 s')] },
        { texto: ['La ', neg('B'), ' es cuando vuelve a la azotea; la ', neg('C'), ' es como si la soltaras.'] },
      ],
      respuesta: [neg('D'), ', ', pt('3 s')] },
    { nivel: 3, titulo: 'El encuentro en el aire',
      figura: patea(20, { alto: 40, numero: 10, edificio: { techo: 40, pisos: 10 }, otra: { y: 40, grande: true },
        alt: 'Un edificio de 40 m: una piedra en lo alto y una pelota abajo, en la misma vertical, con su flecha hacia arriba.' }),
      enunciado: ['Desde lo alto de un edificio de ', ph('40 m'), ' sueltas una piedra y, a la vez, desde el suelo lanzan una pelota hacia arriba con ', pv('20 m/s'), ', en la misma vertical. ¿Cuándo y dónde se encuentran?'],
      alternativas: ['1 s, a 35 m', '2 s, a 20 m', '2 s, a 40 m', '4 s, en el suelo', '1 s, a 15 m'],
      datos: DB6,
      solucion: [
        { texto: ['Con el 0 en el suelo: piedra ', My, ' = 40 − 5', Mt2, '; pelota ', My, ' = 20', Mt, ' − 5', Mt2, '. Se igualan:'], ecuacion: [ph('40'), ' = ', pv('20'), Mt, '   →   ', Mt, ' = ', pt('2 s')] },
        { texto: 'La altura del encuentro:', ecuacion: [My, ' = 40 − 5 · ', pt('2'), '² = ', ph('20 m')] },
        { texto: ['La ', neg('C'), ' olvida que la piedra también baja.'] },
      ],
      respuesta: [neg('B'), ', ', pt('2 s'), ', a ', ph('20 m')] },
    { nivel: 3, titulo: 'La moneda en la cima',
      enunciado: 'Lanzas una moneda hacia arriba. Sin aire, ¿qué pasa justo en el punto más alto?',
      alternativas: ['v = 0 y a = 0', 'v = 10 m/s y a = 0', 'v = 0 y a hacia arriba', 'Depende de la masa de la moneda', 'v = 0 y a = 10 m/s², hacia abajo'],
      datos: DB6,
      solucion: [
        { texto: 'En la cima se detiene un instante: v = 0. Pero un instante después ya baja: su velocidad sigue cambiando.' },
        { texto: 'Lo que la hace cambiar es g, hacia abajo, igual al subir, en la cima y al bajar.', ecuacion: [Ma, ' = −', Mg, ' = ', pa('−10 m/s²')] },
        { texto: ['La ', neg('A'), ' cree que, si está quieta, no acelera; la ', neg('D'), ' olvida que sin aire la masa no cuenta.'] },
      ],
      respuesta: [neg('E')] },
    { nivel: 3, titulo: 'Cuatro segundos en el aire',
      enunciado: ['Una pelota lanzada hacia arriba vuelve a tu mano ', pt('4 s'), ' después. ¿Con qué rapidez salió y qué altura alcanzó?'],
      alternativas: ['40 m/s y 80 m', '10 m/s y 5 m', '20 m/s y 20 m', '20 m/s y 40 m', '40 m/s y 20 m'],
      datos: DB6,
      solucion: [
        { texto: 'Sube y baja en tiempos iguales: 2 s de subida.', ecuacion: ['0 = ', Mv0, ' − ', pa('10'), ' · ', pt('2'), '   →   ', Mv0, ' = ', pv('20 m/s')] },
        { texto: 'La altura máxima:', ecuacion: [MH, ' = ', { frac: [`${'20'}²`, '20'] }, ' = ', ph('20 m')] },
        { texto: ['La ', neg('A'), ' usa los 4 s como si fueran solo de subida.'] },
      ],
      respuesta: [neg('C'), ', ', pv('20 m/s'), ' y ', ph('20 m')] },
    { nivel: 3, titulo: 'Dos veces a 30 m',
      figura: patea(25, { alto: 35, numero: 5 }),
      enunciado: ['Pateas una pelota hacia arriba con ', pv('25 m/s'), '. ¿En qué instantes está a ', ph('30 m'), ' del patio?'],
      alternativas: ['2 s y 3 s', '2,5 s', '3 s', '1 s y 6 s', '1,2 s'],
      datos: DB6,
      solucion: [
        { texto: ['Se iguala la altura a 30 m:'], ecuacion: [ph('30'), ' = ', pv('25'), Mt, ' − 5', Mt2, '   →   ', Mt2, ' − 5', Mt, ' + 6 = 0'] },
        { texto: 'Sale (t − 2)(t − 3) = 0: pasa al subir y al bajar.', ecuacion: [Mt, ' = ', pt('2 s'), ' y ', Mt, ' = ', pt('3 s')] },
        { texto: ['La ', neg('B'), ' es el tiempo de la cima; la ', neg('E'), ' divide 30 entre 25.'] },
      ],
      respuesta: [neg('A'), ', ', pt('2 s'), ' y ', pt('3 s')] },
  ];

  const caida = {
    id: 'caida-libre',
    titulo: 'Lanzamiento vertical',
    pregunta: 'En el punto más alto, ¿la pelota tiene aceleración?',
    temas: ['Caída libre'],
    pieza: 'fis-mruv',
    aprendizaje: 'Al lanzar hacia arriba, g apunta hacia abajo todo el tiempo, también en la cima, donde v = 0; sube y baja en tiempos iguales.',
    actividad: 'Patear una pelota hacia arriba junto al pabellón del colegio.',
    lee: {
      tarjetas: [
        { titulo: 'Hacia arriba es +', texto: ['En un lanzamiento vertical, la pelota sube y baja por la misma recta. Ahora el eje apunta hacia arriba: subir es + y bajar es −. La altura ', My, ' se cuenta desde donde sale.'],
          dibujo: pelotaB6(15, 0) },
        { titulo: 'La cima', texto: ['La pelota sube cada vez más lento, se detiene un instante y vuelve a bajar. Ese punto más alto es la cima; su altura, ', MH, ', es la mayor del viaje.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir con qué rapidez pateas la pelota junto al pabellón. Mira la flecha de su velocidad: cómo se achica al subir y cómo crece al bajar.' },
      ],
    },
    ejemplos: EJEMPLOS_LANZA,
    juega: {
      pieza: 'fis-mruv',
      consigna: 'Pateas la pelota hacia arriba junto al pabellón del colegio. El techo está a 5 m del patio.',
      mision: {
        texto: 'Patéala para que llegue justo al techo, ni más ni menos.',
        logrado: val => val.v0 === 10,
        bien: 'Listo: llega al techo, se detiene un instante y vuelve a bajar.',
      },
      voz: 'Mira la flecha de la velocidad en la cima.',
      leyenda: [
        { s: [Mv0], t: 'la rapidez del puntapié, hacia arriba' },
        { s: [My], t: 'la altura sobre el patio' },
        { s: [Mt], t: 'segundos desde el puntapié' },
        { s: 'flecha naranja', t: 'la velocidad: más larga, más rápido' },
        { s: 'círculos tenues', t: 'dónde estaba cada 0,5 s' },
      ],
      controles: [
        { id: 'v0', etiqueta: 'Patea a, v₀', color: 'c-o', min: 5, max: 20, paso: 5, inicio: 15, unidad: 'm/s', decimales: 0 },
        { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: T_B6, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: val => pelotaB6(val.v0, val.t),
      lectura: val => ['Sale a ', pv(ms(val.v0)), ' y sube hasta ', ph(`${fm(val.v0 * val.v0 / (2 * G))} m`)],
      resumen: { v0: 15, t: 1 },
      minimo: 3,
    },
    predice: {
      pregunta: ['Una pelota sube con ', Mv0, ' = ', pv('20 m/s'), ' y llega a su punto más alto. Justo ahí, ¿cuánto vale su aceleración?'],
      datos: ['Sin resistencia del aire.'],
      opciones: [
        { id: 'c', texto: '10 m/s², hacia abajo', correcta: true },
        { id: 'cero', texto: '0: está detenida', error: 'C1', siFuera: 'Bien: en la cima v = 0. Pero a mide cómo cambia v, y un instante después ya baja.' },
        { id: 'arriba', texto: '10 m/s², hacia arriba', error: 'K3', siFuera: 'Bien el 10. Pero hacia arriba iba la velocidad; la gravedad tira hacia abajo.' },
        { id: 'masa', texto: 'Depende de la masa de la pelota', error: 'C2', siFuera: 'Bien que pienses en el aire: con aire, la forma y la masa importan. Sin aire, no.' },
      ],
      dibujo: pelotaB6(20, 1.5, { marcas: false }),
      revelar: pelotaB6(20, 2, { g: { texto: 'g' } }),
      coincide: 'Coincide: en la cima v = 0, pero la velocidad sigue cambiando 10 m/s cada segundo.',
    },
    // El juego muestra la pelota y «Mira» pasa a v–t a propósito: la flecha de v que se vio achicarse es la altura de la
    // recta, y la g que no cambia es su pendiente, la misma también en la cima.
    mira: {
      pieza: 'fis-mruv',
      datos: VT_B6,
      pasos: [
        { estado: { corte: 1 }, texto: 'Sale a 20 m/s y pierde 10 m/s cada segundo.', ecuacion: [Mv, ' = ', pv('20'), ' − ', pa('10'), Mt] },
        { estado: { corte: 2 }, texto: 'A los 2 s, v = 0: es la cima. La recta no se quiebra.', ecuacion: [Mt, ' = ', { frac: [Mv0, Mg] }, ' = ', pt('2 s')] },
        { estado: { corte: 3 }, texto: 'La pendiente es la misma antes, en y después de la cima.', ecuacion: [Ma, ' = −', Mg, ' = ', pa('−10 m/s²')] },
        { estado: { corte: 4 }, texto: 'El área hasta la cima es lo que subió: la altura máxima.', ecuacion: [MH, ' = ½ · ', pv('20'), ' · ', pt('2'), ' = ', ph('20 m')] },
        { estado: { corte: 5 }, texto: 'Bajando, el área es negativa: a los 4 s vuelve al patio.', ecuacion: [Mdx, ' = 20 − 20 = 0'] },
        { estado: { corte: 5 }, texto: 'Sube en 2 s y baja en 2 s: tiempos iguales.' },
      ],
    },
    regla: {
      texto: 'En caída libre la única aceleración es g, hacia abajo, también en la cima. Con el eje hacia arriba, a = −g; sube y baja en tiempos iguales.',
      ecuacion: [Mv, ' = ', Mv0, ' − ', { llave: [Mg, Mt], nota: 'lo que pierde', color: 'c-h' }, '   ·   ', My, ' = ', Mv0, Mt, ' − ½', Mg, Mt2, '   ·   ', { sup: [Mv, '2'] }, ' = ', { sup: [Mv0, '2'] }, ' − 2', Mg, My],
      condicion: 'sin aire y cerca del suelo; y se mide desde donde sale, hacia arriba. Aquí g = 10 m/s².',
      dibujo: pelotaB6(20, 2, { g: { texto: 'g' } }),
    },
    resuelve: {
      pieza: 'fis-mruv',
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          let v0, y0, v; do { v0 = r.de([10, 15, 20, 25]); y0 = r.de([5, 10, 15, 20, 30]); v = Math.sqrt(v0 * v0 - 2 * G * y0); } while (!(v > 0) || !Number.isInteger(v));
          return {
            enunciado: ['Pateas una pelota hacia arriba con ', pv(ms(v0)), '. ¿Qué rapidez tiene cuando pasa por ', ph(`${y0} m`), ' al subir?'],
            datos: DB6, dibujo: patea(v0, { alto: v0 > 20 ? 35 : 20 }),
            pasos: [
              { tipo: 'pide', texto: ['Piden la velocidad ', Mv, ' al pasar por ', My, ' = ', ph(`${y0} m`), ', subiendo.'] },
              { tipo: 'datos', texto: ['Sale con ', Mv0, ' = ', pv(ms(v0)), ' hacia arriba. No dan el tiempo.'] },
              { tipo: 'regla', texto: ['Sin el tiempo: ', { sup: [Mv, '2'] }, ' = ', { sup: [Mv0, '2'] }, ' − 2 · ', Mg, ' · ', My, '. Al subir, v es positiva.'] },
              { tipo: 'cuentas', texto: 'Se reemplaza:', ecuacion: [{ sup: [Mv, '2'] }, ` = ${v0}² − 2 · 10 · ${y0} = ${fm(v * v)}   →   `, Mv, ' = ', pv(ms(v))] },
              { tipo: 'sentido', texto: `Menos que ${v0} m/s: al subir se frena. Al bajar pasará por ahí con −${fm(v)} m/s.` },
            ],
            respuesta: [pv(`v = ${ms(v)}`)],
          };
        }
        let v0, t; do { v0 = r.de([10, 15, 20, 25, 30]); t = r.de([1.5, 2, 2.5, 3, 3.5, 4, 5]); } while (!(t > v0 / G && t < 2 * v0 / G));
        const y = v0 * t - G * t * t / 2;
        return {
          enunciado: ['Pateas una pelota hacia arriba con ', pv(ms(v0)), '. ¿A qué altura está a los ', pt(`${fm(t)} s`), '?'],
          datos: DB6, dibujo: patea(v0, { alto: v0 * v0 / 20 > 20 ? 50 : 20, numero: v0 * v0 / 20 > 20 ? 10 : 5 }),
          pasos: [
            { tipo: 'pide', texto: ['Piden la altura ', My, ' en ', Mt, ' = ', pt(`${fm(t)} s`), '.'] },
            { tipo: 'datos', texto: ['Sale con ', pv(ms(v0)), '. Llega a la cima a los ', pt(`${fm(v0 / G)} s`), ': a los ', pt(`${fm(t)} s`), ' ya baja.'] },
            { tipo: 'regla', texto: ['La altura: ', My, ' = ', Mv0, Mt, ' − ½', Mg, Mt2, ', antes y después de la cima.'] },
            { tipo: 'cuentas', texto: 'Se reemplaza:', ecuacion: [My, ` = ${v0} · ${fm(t)} − 5 · ${fm(t)}² = `, ph(`${fm(y)} m`)] },
            { tipo: 'sentido', texto: `Positiva y menor que la altura máxima, ${fm(v0 * v0 / 20)} m: todavía está en el aire.` },
          ],
          respuesta: [ph(`y = ${fm(y)} m`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-mruv',
      generar(s) {
        const r = azar(s), k = s % 4, sg = n => `${fm(n)} s`, m = n => `${fm(n)} m`;
        const vi = [10, 15, 20, 25, 30][r.ent(0, 4)], ts = vi / G, hm = vi * vi / (2 * G);
        const dib = patea(vi, { alto: hm > 20 ? 50 : 20, numero: hm > 20 ? 10 : 5 });
        if (k === 0) return {
          pregunta: ['Se lanza una pelota hacia arriba con ', Mv0, ' = ', pv(ms(vi)), '. ¿Cuánto tarda en llegar a la cima?'],
          datos: DB6, dibujo: dib,
          opciones: cuatro(ts, [
            { id: 'ida-vuelta', valor: 2 * ts, error: 'C-VUELTA', siFuera: 'Bien la idea. Pero ese es el tiempo de subir y volver a bajar.' },
            { id: 'altura', valor: hm / 10, error: 'C-ALTURA', siFuera: 'Bien que uses g. Pero el tiempo sale de v₀ entre g, no de la altura.' },
            { id: 'por', valor: vi * G, error: 'K4', siFuera: 'Bien v₀ y g. Pero v baja g cada segundo: se divide, no se multiplica.' },
          ], sg),
          solucion: { texto: 'Pierde 10 m/s cada segundo hasta llegar a v = 0.', ecuacion: [Mt, ` = ${vi} ÷ 10 = `, pt(sg(ts))] },
        };
        if (k === 1) return {
          pregunta: ['Se lanza una pelota hacia arriba con ', Mv0, ' = ', pv(ms(vi)), '. ¿Qué altura máxima alcanza?'],
          datos: DB6, dibujo: dib,
          opciones: cuatro(hm, [
            { id: 'sin-medio', valor: 2 * hm, error: 'C-MEDIO', siFuera: 'Bien v₀². Pero se divide entre 2g: mientras sube, su media es la mitad de v₀.' },
            { id: 'area', valor: vi * ts / 4, error: 'C-AREA', siFuera: 'Bien la idea del área. Pero el triángulo es base por altura entre 2.' },
            { id: 'tiempo', valor: ts, error: 'C-TIEMPO', siFuera: 'Ese número es el tiempo de subida, en segundos. Piden la altura.' },
          ], m),
          solucion: { texto: 'En la cima v = 0: se despeja la altura.', ecuacion: [MH, ` = ${vi}² ÷ 20 = `, ph(m(hm))] },
        };
        if (k === 2) {
          const tq = ts + [0.5, 1][r.ent(0, 1)], vq = vi - G * tq;
          return {
            pregunta: ['Se lanza una pelota hacia arriba con ', Mv0, ' = ', pv(ms(vi)), '. Con el eje hacia arriba, ¿qué velocidad tiene en ', Mt, ' = ', pt(sg(tq)), '?'],
            datos: DB6, dibujo: dib,
            opciones: cuatro(vq, [
              { id: 'sin-signo', valor: -vq, error: 'K-SIGNO', siFuera: 'Bien el valor de la rapidez. Pero ya pasó la cima: va hacia abajo.' },
              { id: 'cima', valor: 0, error: 'C1', siFuera: 'Bien: en la cima v = 0. Pero la cima fue antes, a los ' + sg(ts) + '.' },
              { id: 'suma', valor: vi + G * tq, error: 'K3', siFuera: 'Bien que uses g · t. Pero g tira hacia abajo: se resta.' },
            ], ms),
            solucion: { texto: 'Pierde 10 m/s cada segundo, también después de la cima.', ecuacion: [Mv, ` = ${vi} − 10 · ${fm(tq)} = `, pv(ms(vq))] },
          };
        }
        // Nivel examen (banco de academia y papel p9): desde una azotea (dos raíces), el encuentro en el aire y el tiempo de
        // vuelo.
        const e = Math.floor(s / 4) % 3;
        if (e === 0) {
          let v0, tt, h; do { v0 = r.de([5, 10, 15, 20]); tt = r.ent(2, 6); h = G / 2 * tt * tt - v0 * tt; } while (h <= 0 || h > 60);
          return {
            pregunta: ['Desde una azotea a ', ph(m(h)), ' del patio, lanzas una pelota hacia arriba con ', pv(ms(v0)), '. ¿Cuánto tarda en llegar al patio?'],
            datos: [...DB6, 'Una ecuación de segundo grado puede tener dos raíces; aquí t no es negativo.'],
            opciones: cuatro(tt, [
              { id: 'vuelve', valor: 2 * v0 / G, error: 'C-VUELTA', siFuera: 'Ese es cuando vuelve a la altura de la azotea. Todavía le falta bajar hasta el patio.' },
              { id: 'soltar', valor: Math.sqrt(2 * h / G), error: 'C-SOLTAR', siFuera: 'Eso sería si la soltaras desde la azotea. Primero sube.' },
              { id: 'subida', valor: v0 / G, error: 'C-SUBIDA', siFuera: 'Ese es el tiempo de subida hasta la cima. Después baja todo.' },
            ], sg),
            solucion: { texto: `Con el 0 en la azotea, el patio está en y = −${fm(h)} m.`, ecuacion: [`−${fm(h)} = ${v0}`, Mt, ' − 5', Mt2, '   →   ', Mt, ' = ', pt(sg(tt))] },
          };
        }
        if (e === 1) {
          const [H, v0] = r.de([[20, 20], [40, 20], [60, 20], [80, 40], [45, 30], [30, 15]]), te = H / v0;
          return {
            pregunta: ['Desde lo alto de un edificio de ', ph(m(H)), ' sueltas una piedra y, a la vez, desde el suelo lanzan una pelota hacia arriba con ', pv(ms(v0)), ', en la misma vertical. ¿Cuándo se encuentran?'],
            datos: DB6,
            opciones: cuatro(te, [
              { id: 'mitad', valor: H / (2 * v0), error: 'C-ENC-MITAD', siFuera: 'Bien que se acerquen. Pero se acercan a la rapidez de la pelota, sin dividir.' },
              { id: 'caida', valor: Math.sqrt(2 * H / G), error: 'C-ENC-CAIDA', siFuera: 'Ese es el tiempo que la piedra tardaría en caer todo, sin encontrarse.' },
              { id: 'subida', valor: v0 / G, error: 'C-SUBIDA', siFuera: 'Ese es el tiempo de subida de la pelota. Se encuentran antes o después.' },
            ], sg),
            solucion: { texto: `Las dos caen igual: se acercan a ${v0} m/s. Igualando: ${H} − 5t² = ${v0}t − 5t².`, ecuacion: [Mt, ` = ${H} ÷ ${v0} = `, pt(sg(te))] },
          };
        }
        return {
          pregunta: ['Lanzas una pelota hacia arriba con ', pv(ms(vi)), ' y la atrapas a la misma altura. ¿Cuánto tiempo estuvo en el aire?'],
          datos: DB6, dibujo: dib,
          opciones: cuatro(2 * ts, [
            { id: 'subida', valor: ts, error: 'C-SUBIDA', siFuera: 'Ese es solo el tiempo de subida. Baja en el mismo tiempo.' },
            { id: 'altura', valor: hm, error: 'C-ALTURA', siFuera: 'Ese número es la altura máxima, en metros.' },
            { id: 'por', valor: vi * G / 10, error: 'K4', siFuera: `Bien la idea. Pero el tiempo de subida es ${vi} ÷ 10, y la bajada dura igual.` },
          ], sg),
          solucion: { texto: 'Sube hasta v = 0 y baja en el mismo tiempo.', ecuacion: [Mt, ` = 2 · ${vi} ÷ 10 = `, pt(sg(2 * ts))] },
        };
      },
    },
  };

  // Un color fijo por magnitud en las dos unidades del movimiento rectilíneo (cabecera; propuesta §6).
  const COLORES = { velocidad: 'o', tiempo: 'i', posición: 'f', desplazamiento: 'f', separación: 'f', largo: 'f', aceleración: 'h' };

  return {
    unidad: 'fisica.mruv-y-caida-libre',
    version: '0.3.0',
    estado: 'completa',
    calidad: 2,
    requiere: ['/nucleo/kit/piezas/pista.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/fis-combi.js', '/nucleo/kit/piezas/fis-mruv.js'],
    colores: COLORES,
    // En una recta, las magnitudes con dirección son números con signo (decisiones, 18 nov): la unidad no escribe «⃗».
    notacion: { vectores: false, motivo: 'En una recta, v, a y Δx son números con signo sobre el eje: el signo hace de flecha. La flecha se dibuja sobre la combi y el eje lleva su «+».' },
    // Glosario del tema (docs/teoria.md, 4d): cada idea estrena dos o tres palabras (propuesta §1). «posición»,
    // «velocidad», «rapidez», «MRU» y «pendiente» se definen en Movimiento rectilíneo uniforme; «desplazamiento» y
    // «distancia recorrida», en Vectores: el lector las marca solas.
    glosario: [
      { termino: 'aceleración', simbolo: 'a', medida: 'm/s²', def: 'Cuánto cambia la velocidad en cada segundo, con su signo.',
        simple: 'Cuántos m/s cambia tu velocidad en cada segundo.',
        ejemplos: ['De 0 a 10 m/s en 5 s: a = 2 m/s².', 'Una combi que pierde 3 m/s cada segundo, yendo hacia el +: a = −3 m/s².', 'Una combi que va siempre a 15 m/s: a = 0.'],
        ver: ['velocidad', 'pendiente'] },
      { termino: 'MRUV', def: 'Movimiento rectilíneo uniformemente variado: en línea recta, con aceleración constante.',
        simple: 'Ir en línea recta ganando o perdiendo la misma velocidad cada segundo.',
        ejemplos: ['Una combi que arranca y gana 2 m/s cada segundo.', 'Una combi que frena parejo hasta el paso de cebra.', 'No es MRUV: una combi que va siempre a 15 m/s (eso es MRU).'],
        ver: ['aceleración', 'MRU'] },
      { termino: 'frenar', def: 'Bajar la rapidez: la aceleración tiene el signo contrario al de la velocidad.',
        simple: 'Ir cada vez más lento, aunque sigas avanzando.',
        ejemplos: ['Una combi que pasa de 20 m/s a 8 m/s hacia la derecha: a = −3 m/s².', 'Hacia la izquierda, de −25 m/s a −10 m/s: a = +3 m/s².', 'Al frenar hasta parar, la combi no retrocede: se queda quieta.'],
        formas: ['frenar', 'frena', 'frenan', 'frenaba', 'frenando', 'frenó', 'frenada'], ver: ['aceleración'] },
      { termino: 'distancia de frenado', medida: 'm', def: 'Lo que avanza un vehículo desde que empieza a frenar hasta que se detiene.',
        simple: 'Lo que avanzas desde que pisas el freno hasta quedarte quieto.',
        ejemplos: ['A 12 m/s, con un freno de 3 m/s², la combi avanza 24 m antes de parar.', 'Al doble de rapidez, con el mismo freno, cuatro veces más metros.', 'Con piso mojado el freno es menor: más metros para parar.'],
        formas: ['distancia de frenado', 'distancias de frenado'], ver: ['frenar', 'MRUV'] },
      { termino: 'ecuación horaria', def: 'La fórmula que da la posición en cada instante; en el MRUV, x = x₀ + v₀t + ½at².',
        simple: 'Una receta que dice dónde estará el móvil a cada hora del reloj.',
        ejemplos: ['x = 10 + 8t + t²: a los 3 s, x = 43 m.', 'x = 4 + 6t − t²: sale de 4 m a 6 m/s y frena.', 'En el MRU no hay término con t²: x = x₀ + v·t.'],
        formas: ['ecuación horaria', 'ecuaciones horarias'], ver: ['posición', 'MRUV'] },
      { termino: 'gráfica v–t', def: 'El dibujo de la velocidad contra el tiempo. Su pendiente es la aceleración y su área, el desplazamiento.',
        simple: 'Un dibujo que muestra qué tan rápido iba el móvil en cada instante.',
        ejemplos: ['Una horizontal en 5 m/s: va siempre a 5 m/s.', 'Una recta que sube de 0 a 8 m/s en 4 s: acelera con 2 m/s².', 'Una línea bajo el eje: va hacia atrás.'],
        formas: ['gráfica v–t', 'gráficas v–t', 'gráfica velocidad–tiempo'], ver: ['pendiente', 'área bajo la gráfica'] },
      { termino: 'área bajo la gráfica', def: 'La región entre la línea de una gráfica y el eje del tiempo. En v–t mide el desplazamiento.',
        simple: 'Lo que pintarías entre la línea y el eje de abajo.',
        ejemplos: ['5 m/s durante 8 s: un rectángulo de 40 m.', 'De 0 a 8 m/s en 4 s: un triángulo de 16 m.', 'Bajo el eje cuenta negativa: fue hacia atrás.'],
        formas: ['área bajo la gráfica', 'áreas bajo la gráfica', 'área bajo la recta', 'área bajo la línea'], ver: ['gráfica v–t', 'desplazamiento'] },
      { termino: 'parábola', def: 'Curva como la de x = t²: cada vez más empinada. La gráfica x–t del MRUV tiene esa forma.',
        simple: 'La curva que dibuja el chorro de una manguera.',
        ejemplos: ['x = t²: a los 1, 2 y 3 s, x vale 1, 4 y 9 m.', 'La combi que arranca dibuja en x–t una curva que se empina.', 'La que frena dibuja una que se aplana.'],
        formas: ['parábola', 'parábolas'], ver: ['ecuación horaria'] },
      { termino: 'gráfica a–t', def: 'El dibujo de la aceleración contra el tiempo. En el MRUV es una horizontal; su área es Δv.',
        simple: 'Un dibujo que muestra cuánto acelera el móvil en cada instante.',
        ejemplos: ['Una horizontal en 2 m/s² durante 10 s: v sube 20 m/s.', 'Una horizontal en 0: va parejo (MRU).', 'Una horizontal bajo el eje: frena, si va hacia el +.'],
        formas: ['gráfica a–t', 'gráficas a–t'], ver: ['aceleración', 'área bajo la gráfica'] },
      { termino: 'caída libre', def: 'Movimiento de algo que solo cae por el jalón de la Tierra, sin que el aire lo frene.',
        simple: 'Caer solito, sin que nada te empuje ni te sostenga.',
        ejemplos: ['Una piedra que sueltas desde un puente.', 'La regla que tu compañero suelta entre tus dedos.', 'No lo es: una hoja de papel que baja meciéndose (el aire la frena).'],
        formas: ['caída libre', 'caídas libres'], ver: ['gravedad'] },
      { termino: 'gravedad', simbolo: 'g', medida: 'm/s²', def: 'Aceleración hacia abajo que da la Tierra: cerca del suelo, unos 9,8 m/s². En los problemas se usa 10.',
        simple: 'El jalón de la Tierra hacia abajo, que acelera lo que cae.',
        ejemplos: ['Con g = 10 m/s², lo que cae gana 10 m/s cada segundo.', 'En 2 s desde el reposo cae ½ · 10 · 2² = 20 m.', 'Una canica y una piedra, sin aire, caen con la misma g.'],
        ver: ['caída libre', 'aceleración'] },
      { termino: 'lanzamiento vertical', def: 'Movimiento de algo lanzado hacia arriba o hacia abajo en línea recta, con solo la gravedad.',
        simple: 'Tirar algo derecho hacia arriba y verlo subir y bajar.',
        ejemplos: ['Una pelota pateada hacia arriba junto al pabellón.', 'Una moneda lanzada al aire para un «cara o sello».', 'Una pelota lanzada desde una azotea que después cae al patio.'],
        formas: ['lanzamiento vertical', 'lanzamientos verticales'], ver: ['gravedad', 'cima'] },
      { termino: 'cima', def: 'El punto más alto de un lanzamiento hacia arriba: ahí v = 0 un instante.',
        simple: 'Lo más alto que llega una pelota antes de empezar a bajar.',
        ejemplos: ['A 10 m/s, la pelota llega a su cima a 5 m.', 'A 20 m/s, a 20 m: el doble de rapidez, cuatro veces la altura.', 'En la cima v = 0, pero a sigue siendo −10 m/s².'],
        formas: ['cima', 'cimas'], ver: ['lanzamiento vertical'] },
    ],
    // Laboratorio: juego libre, sin preguntas. La pista con acelerador va primera (nucleo/teoria-retos.test.js la usa).
    laboratorio: [
      {
        id: 'pista-libre', titulo: 'Pista con acelerador', pieza: 'pista',
        consigna: 'El carrito corre solo y marca cada segundo. Elige la salida y la aceleración, y mira cómo se abren o se juntan las marcas.',
        controles: [
          { id: 'v0', etiqueta: 'v₀', color: 'c-o', min: 0, max: 6, paso: 1, inicio: 2, unidad: 'm/s', decimales: 0 },
          { id: 'a', etiqueta: 'a', color: 'c-h', min: -2, max: 2, paso: 1, inicio: 1, unidad: 'm/s²', decimales: 0 },
          { id: 't', etiqueta: 't', color: 'c-i', min: 0, max: T_PISTA + 0.5, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
        ],
        dibujo: val => {
          // Frena hasta detenerse, sin retroceder: después de parar, las marcas se quedan en el mismo sitio.
          const q = momentoPista(val), ms0 = marcasPista(val).filter((_, k) => k <= Math.min(val.t, T_PISTA) + 1e-9);
          return { datos: { largo: 60, cada: 10, carriles: [{ x: q.x, marcas: ms0, flecha: val.a && !q.quieto ? { a: val.a } : undefined }] }, estado: {} };
        },
        lectura: val => { const q = momentoPista(val); return ['A los ', pt(`${f(Math.min(val.t, T_PISTA), 1)} s`), ': ', Mv, ' = ', pv(`${f(q.v, 1)} m/s`), ' y ', Mx, ' = ', px(`${f(q.x, 1)} m`)]; },
        // Invitaciones: cada una trae logrado(valores, guardados), que comprueba el motor de la mesa (no el texto).
        invitaciones: [
          { texto: 'Haz que el carrito se detenga justo antes de la marca de 10 m.',
            logrado: val => val.a < 0 && val.v0 > 0 && frenado(val) >= 8 && frenado(val) < 10,
            bien: 'Frenó antes de los 10 m. ¿Qué pasa si sales un poco más rápido?' },
          { texto: 'Busca la salida más lenta que igual llegue a 30 m en 5 s.',
            // La más lenta de la grilla: v₀ = 1 con a = 2 llega a 35 m (con v₀ = 0 no pasa de 25 m).
            logrado: val => ultima(val) >= 30 && val.v0 === 1,
            bien: 'Con v₀ = 1 m/s ya alcanza: la aceleración hizo el resto.' },
          { texto: 'Consigue marcas que se junten como un acordeón.',
            logrado: val => val.a < 0 && val.v0 > 0,
            bien: 'Las marcas se juntan porque cada segundo avanza menos.' },
          { texto: 'Pausa el carrito justo sobre la marca de 20 m de la regla.',
            logrado: val => Math.abs(momentoPista(val).x - 20) <= 0.3,
            bien: 'Ahí está: x = 20 m en ese instante. ¿Cuánto marcaba el reloj?',
            pista: 'Pausa cuando pase por 20 m; afina t con − y +.' },
          { texto: 'Guarda dos casos con la misma última marca y distinta aceleración.',
            logrado: (val, guardados) => guardados.some(g0 => g0.a !== val.a && Math.abs(ultima(g0) - ultima(val)) < 1e-9)
              && guardados.some(g0 => g0.a === val.a && g0.v0 === val.v0),
            bien: 'El mismo lugar a los 5 s, por dos caminos distintos.' },
        ],
      },
      Object.assign({ id: 'ida-vuelta', titulo: 'Ida y vuelta en v–t', pieza: 'ejes' }, juegoIdaVuelta),
      Object.assign({ id: 'recta-vt', titulo: 'La recta v–t', pieza: 'ejes' }, juegoRectaVT),
    ],
    historia: {
      texto: 'Una caída es demasiado rápida para medirla con relojes de agua. En el siglo XVII, Galileo usó planos inclinados para frenar el movimiento y comparar distancias con tiempos iguales. Nuestras gráficas y ecuaciones son la forma moderna de escribir esas comparaciones.',
      pregunta: '¿Cómo medirías algo que pasa demasiado rápido?',
      fuente: { titulo: 'Museo Galileo — Science of Motion', url: 'https://catalogue.museogalileo.it/section/ScienceOfMotion.html' },
    },
    // A qué idea pertenece cada mesa (Gerson, 16 nov): la pista con acelerador es de la aceleración y de las ecuaciones
    // (propuesta §7); la ida y vuelta y la recta v–t, de la gráfica v–t.
    laboratorioIdeas: {
      'pista-libre': ['aceleracion', 'ecuaciones-mruv'],
      'ida-vuelta': ['pendiente-aceleracion'],
      'recta-vt': ['pendiente-aceleracion'],
    },
    ideas: [aceleracion, ecuaciones, vt, graficas, caidaReposo, caida],
  };
});
