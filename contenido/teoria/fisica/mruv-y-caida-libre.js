/*
 * Teoría de «MRUV y caída libre» (fisica.mruv-y-caida-libre), para 5.º de secundaria y preuniversitario. Unidad nueva
 * del 18 nov: sale de «MRU, MRUV y caída libre», que Gerson aprobó partir en dos (docs/etapa4/decisiones.md;
 * docs/etapa4/propuesta-fisica.md, parte B, con todas sus recomendaciones). La unidad vieja conserva su id como
 * «Movimiento rectilíneo uniforme» (contenido/teoria/fisica/movimiento-rectilineo.js). Avance.migrar (nucleo/avance.js,
 * partición partidoMRU) pasa a esta unidad lo hecho en `pendiente-aceleracion` y `caida-libre`, las mesas
 * `pista-libre`, `ida-vuelta` y `recta-vt`, la visita, «Ya la estudié» y las palabras «aceleración», «caída libre» y
 * «gravedad». Esos ids no cambian.
 *
 * Las seis ideas de la propuesta (B1–B6), en orden:
 *   B1 `aceleracion` «La aceleración» ............ REHECHA con el método (fase 2, 18 nov), para el visto bueno de Gerson.
 *   B2 `ecuaciones-mruv` «Las ecuaciones del MRUV» ESQUELETO: pasa el validador; se escribe en la fase 3.
 *   B3 `pendiente-aceleracion` «La gráfica velocidad–tiempo»: el juego viejo de la recta v–t, reacomodado, con la
 *      predicción de la propuesta (la del sentido de a se fue a B1) y un «Ahora tú» del área. Se rehace en la fase 3.
 *   B4 `graficas-xt-at` «Gráficas x–t y a–t» ...... ESQUELETO.
 *   B5 `caida-reposo` «Caída libre desde el reposo» ESQUELETO.
 *   B6 `caida-libre` «Lanzamiento vertical»: el contenido viejo («En la cima, g sigue»), reacomodado. Fase 3.
 * Todas usan ya los colores aprobados (abajo); por eso la unidad no declara todavía calidad: 2.
 * mruv-y-caida-libre.test.js corre la idea B1 sola con calidad 2.
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
  const EJES = () => Kit.piezas.ejes, TORRE = () => Kit.piezas.torre;

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
      // Solo el grifo: dónde queda el paradero saldría de juntar los datos.
      figura: fig(Object.assign(regla(0, 80), { v: 14, a: 1.5, flechaA: { texto: '1,5 m/s²' }, lugares: [{ en: 0, texto: 'Grifo' }] })),
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
  // ---------- Idea 2 (B2): las ecuaciones del MRUV — ESQUELETO (fase 3) ----------
  // Pasa el validador con la predicción de la propuesta (B2: el doble de rapidez, cuatro veces la distancia de frenado).
  // Falta: Lee, misión, leyenda, «Así se resuelve», ejemplos y el nivel examen de «Ahora tú».
  const REGLA_B2 = regla(0, 60), CEBRA = [{ en: 25, texto: 'Paso de cebra' }];
  const altoB2 = val => 10 / -val.a;
  const juegoB2 = val => avenida(Object.assign({}, REGLA_B2, { x0: 0, v: 10, a: val.a, t: Math.min(val.t, altoB2(val)), segundos: Math.ceil(altoB2(val) - 1e-9),
    crece: true, lugares: CEBRA, flechaTexto: `${f(Math.max(0, 10 + val.a * Math.min(val.t, altoB2(val))), 1)} m/s` }));
  const ecuaciones = {
    id: 'ecuaciones-mruv',
    titulo: 'Las ecuaciones del MRUV',
    pregunta: 'Si vas al doble de rápido, ¿cuánto más necesitas para frenar?',
    temas: ['MRUV'],
    pieza: 'fis-combi',
    juega: {
      pieza: 'fis-combi',
      consigna: 'La combi llega a 10 m/s y frena parejo hasta detenerse. El paso de cebra está a 25 m.',
      voz: 'Mira dónde se detiene la combi.',
      controles: [
        { id: 'a', etiqueta: 'Frena, a', color: 'c-h', min: -5, max: -1, paso: 0.5, inicio: -1, unidad: 'm/s²', decimales: 1 },
        { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: 10.5, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: juegoB2,
      lectura: val => ['Para en ', pt(`${f(altoB2(val), 2)} s`), ' y ', pdx(`${f(50 / -val.a, 2)} m`), ': media ', pv('5 m/s')],
      minimo: 3,
    },
    predice: {
      pregunta: ['Otra combi, con el mismo freno, llega al doble de rápido: ', pv('20 m/s'), '. ¿Cuánto recorre hasta parar?'],
      datos: ['Con 2 m/s² de freno, a 10 m/s la combi paró en 25 m.'],
      opciones: [
        { id: 'c', texto: '100 m', correcta: true },
        { id: 'doble', texto: '50 m', error: 'PR1-frenado', siFuera: 'Sería cierto si tardara lo mismo en parar. Al doble de rapidez, tarda el doble.' },
        { id: 'igual', texto: '25 m', error: 'MRUV-FRENO-IGUAL', siFuera: 'El freno es el mismo, pero tiene que quitar el doble de velocidad.' },
        { id: 'sin-medio', texto: '200 m', error: 'MRUV-VT', siFuera: 'Eso usa 20 m/s durante los 10 s. Mientras frena, su velocidad media es 10 m/s.' },
      ],
      dibujo: avenida(Object.assign(regla(0, 120), { x0: 0, v: 20, segundos: 0, crece: true })),
      revelar: avenida(Object.assign(regla(0, 120), { x0: 0, v: 20, a: -2, segundos: 10, crece: true, rotulos: false })),
      coincide: 'Coincide: tarda el doble en parar y va al doble de rápido: cuatro veces.',
    },
    mira: {
      datos: Object.assign({ vista: 'avenida' }, regla(0, 120), { x0: 0, v: 20, a: -2, segundos: 10, crece: true, rotulos: false }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Llega a 20 m/s y pierde 2 m/s cada segundo.', ecuacion: [Mv0, ' = ', pv('20 m/s'), ';   ', Ma, ' = ', pa('−2 m/s²')] },
        { estado: { corte: 10 }, texto: 'Tarda 10 s en parar, con velocidad media de 10 m/s.', ecuacion: [Mdx, ' = ', { frac: [[Mv0, ' + ', Mv], '2'] }, ' · ', Mt, ' = 10 · 10 = ', pdx('100 m')] },
      ],
    },
    regla: {
      texto: 'Con aceleración constante, el desplazamiento es la velocidad media por el tiempo; sin el tiempo, se usa v² = v₀² + 2a·Δx.',
      ecuacion: [Mdx, ' = ', { frac: [[Mv0, ' + ', Mv], '2'] }, ' · ', Mt, '   ·   ', { sup: [Mv, '2'] }, ' = ', { sup: [Mv0, '2'] }, ' + 2', Ma, Mdx],
      condicion: 'a no cambia; después de detenerse, la combi no retrocede.',
    },
    ahoraTu: {
      pieza: 'fis-combi',
      generar(s) {
        const r = azar(s + 47), vi = r.de([10, 12, 14, 16, 20, 24]), ai = r.de([-1, -2, -4]), D = vi * vi / (-2 * ai);
        return {
          pregunta: ['Una combi va a ', pv(ms(vi)), ' y frena con ', pa(`a = ${ms2(ai)}`), '. ¿Cuántos metros recorre hasta detenerse?'],
          datos: [['Sin el tiempo: ', { sup: [Mv, '2'] }, ' = ', { sup: [Mv0, '2'] }, ' + 2', Ma, Mdx]],
          opciones: opciones(D, [
            { id: 'sin-2', valor: 2 * D, error: 'MRUV-VT', siFuera: 'Eso olvida el 2 de 2a·Δx.' },
            { id: 'lineal', valor: vi / -ai, error: 'PR1-frenado', siFuera: 'Ese es el tiempo de frenado, en segundos.' },
            { id: 'vt', valor: vi * vi / -ai, error: 'MRUV-VT', siFuera: 'Eso usa v₀ durante todo el frenado; la media es la mitad.' },
          ], n => `${fm(n)} m`),
          solucion: { texto: 'Al parar, v = 0: se despeja Δx.', ecuacion: [Mdx, ` = ${fm(vi)}² ÷ (2 · ${fm(-ai)}) = `, pdx(`${fm(D)} m`)] },
        };
      },
    },
  };

  // ---------- Idea 3 (B3): la gráfica velocidad–tiempo — juego viejo, reacomodado (fase 3) ----------
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
  const vt = {
    id: 'pendiente-aceleracion',
    titulo: 'La gráfica velocidad–tiempo',
    pregunta: '¿Dónde se ve, en la gráfica v–t, cuánto avanzó el móvil?',
    temas: ['Gráficas x-t, v-t y a-t'],
    pieza: 'ejes',
    juega: {
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
    },
    // La predicción de la propuesta (B3): el área bajo el eje resta. La del sentido de a se fue a la idea 1.
    predice: {
      pregunta: 'Un mototaxi avanza 3 s a 4 m/s y después retrocede 4 s a 1,5 m/s para estacionarse. ¿A qué distancia de donde empezó termina?',
      datos: ['El área de un rectángulo es base por altura.'],
      opciones: [
        { id: 'c', texto: '6 m', correcta: true },
        { id: 'suma', texto: '18 m', error: 'DX-SUMA', siFuera: 'Bien las dos áreas. Pero la de abajo es hacia atrás: se resta.' },
        { id: 'ida', texto: '12 m', error: 'DX-IDA', siFuera: 'Ese es solo el tramo de ida. Después retrocedió.' },
        { id: 'altura', texto: '5,5 m', error: 'DX-ALTURA', siFuera: 'Eso suma las alturas. Lo que avanzó es el área.' },
      ],
      dibujo: { datos: idaVuelta(4, 3, 1.5, 4, false), estado: {} },
      revelar: { datos: idaVuelta(4, 3, 1.5, 4, true), estado: {} },
      coincide: 'Coincide: avanzó 12 m y retrocedió 6 m; termina a 6 m de donde empezó.',
    },
    mira: {
      datos: rectaVT(8, -2, 3, {
        puntos: [{ x: 0, y: 8, color: 'o', rotulo: '8 m/s', guias: true, desde: 1 }, { x: 3, y: 2, color: 'o', rotulo: '2 m/s', guias: true, desde: 1 }],
        areas: [{ puntos: [[0, 8], [3, 2]], color: 'f', rotulo: '15 m', desde: 3 }],
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Empieza a 8 m/s; a los 3 s, va a 2 m/s.', ecuacion: [Mv0, ' = ', pv('8 m/s')] },
        { estado: { corte: 2 }, texto: 'La inclinación de la recta es la aceleración.', ecuacion: [Ma, ' = ', { frac: [Mdv, Mdt] }, ' = ', { frac: [pv('−6'), pt('3')] }, ' = ', pa('−2 m/s²')] },
        { estado: { corte: 3 }, texto: 'El área bajo la recta es lo que avanzó.', ecuacion: [Mdx, ' = ', { frac: [[pv('8'), ' + ', pv('2')], '2'] }, ' · ', pt('3'), ' = ', pdx('15 m')] },
      ],
    },
    regla: {
      texto: 'En la gráfica v–t, la pendiente es la aceleración y el área es el desplazamiento: sobre el eje suma y bajo el eje resta.',
      ecuacion: [Ma, ' = ', { llave: ['pendiente'], nota: 'de v–t', color: 'c-h' }, '   ·   ', Mdx, ' = ', { llave: ['área'], nota: 'bajo v–t, con signo', color: 'c-f' }],
      condicion: 'el área bajo el eje cuenta negativa: es cuando el móvil va hacia atrás.',
    },
    ahoraTu: {
      pieza: 'ejes',
      generar(s) {
        const r = azar(s), vi = r.ent(1, 6) * 2, vf = r.ent(1, 6) * 2, ti = r.ent(2, 6), D = (vi + vf) / 2 * ti;
        return {
          pregunta: ['En la gráfica v–t, la velocidad de un móvil pasa en línea recta de ', pv(ms(vi)), ' a ', pv(ms(vf)), ' en ', pt(`${fm(ti)} s`), '. ¿Cuánto avanzó?'],
          datos: ['El área de un trapecio es la semisuma de las bases por la altura.'],
          dibujo: { datos: rectaVT(vi, (vf - vi) / ti, ti), estado: {} },
          opciones: opciones(D, [
            { id: 'pendiente', valor: (vf - vi) / ti, error: 'G4', siFuera: 'Esa es la pendiente: la aceleración. Lo que avanzó es el área.' },
            { id: 'rect', valor: vf * ti, error: 'DX-RECT', siFuera: 'Eso usa solo la velocidad final en todo el tramo.' },
            { id: 'suma', valor: (vi + vf) * ti, error: 'DX-SEMI', siFuera: 'Eso olvida dividir entre 2 la suma de las bases.' },
          ], n => `${fm(n)} m`),
          solucion: { texto: 'Es el área del trapecio bajo la recta.', ecuacion: [Mdx, ` = (${fm(vi)} + ${fm(vf)}) ÷ 2 · ${fm(ti)} = `, pdx(`${fm(D)} m`)] },
        };
      },
    },
  };

  // ---------- Idea 4 (B4): gráficas x–t y a–t — ESQUELETO (fase 3) ----------
  const ejeXT = val => {
    const pts = [], tf = 12;
    for (let k = 0; k <= 24; k++) { const tk = k / 2; pts.push([tk, val.a * tk * tk / 2]); }
    return {
      x: { min: 0, max: tf, paso: 2, nombre: 't', unidad: 's', decimales: 0, color: 'i' },
      y: { min: 0, max: 200, paso: 50, nombre: 'x', unidad: 'm', decimales: 0, color: 'f' },
      curvas: [{ puntos: pts.filter(p => p[1] <= 200), color: 'f', rotulo: 'combi' }, { puntos: [[0, 0], [12, 120]], color: 'f', discontinua: true, rotulo: 'mototaxi' }],
    };
  };
  const graficas = {
    id: 'graficas-xt-at',
    titulo: 'Gráficas x–t y a–t',
    pregunta: '¿Por qué la gráfica x–t de la combi que acelera es una curva?',
    temas: ['Gráficas x-t, v-t y a-t', 'La recta y la parábola como gráficas'],
    pieza: 'ejes',
    juega: {
      consigna: 'El mototaxi pasa por el paradero a 10 m/s justo cuando la combi arranca de ahí. Elige cuánto acelera la combi.',
      controles: [{ id: 'a', etiqueta: 'Acelera, a', color: 'c-h', min: 1, max: 4, paso: 0.5, inicio: 1, unidad: 'm/s²', decimales: 1 }],
      dibujo: val => ({ datos: ejeXT(val), estado: {} }),
      lectura: val => ['A los ', pt('10 s'), ': combi en ', px(`${f(val.a * 50, 1)} m`), ', mototaxi en ', px('100 m')],
      minimo: 3,
    },
    predice: {
      pregunta: 'En el juego, con 2 m/s², la combi alcanza al mototaxi a los 10 s. ¿En qué instante tenían la misma velocidad?',
      datos: ['El mototaxi va a 10 m/s.', 'La combi arranca del reposo con 2 m/s².'],
      opciones: [
        { id: 'c', texto: 'A los 5 s', correcta: true },
        { id: 'alcance', texto: 'A los 10 s, cuando lo alcanza', error: 'K1-a', siFuera: 'Ahí están en el mismo lugar. Las velocidades ya son distintas: la combi va más rápido.' },
        { id: 'salida', texto: 'Al salir, porque los dos estaban en el paradero', error: 'K1-b', siFuera: 'Al salir están juntos, pero la combi estaba quieta.' },
        { id: 'nunca', texto: 'Nunca: una acelera y la otra no', error: 'MRUV-NUNCA', siFuera: 'La combi pasa por todas las rapideces de 0 hacia arriba; también por 10 m/s.' },
      ],
      dibujo: { datos: ejeXT({ a: 2 }), estado: {} },
      revelar: { datos: Object.assign(ejeXT({ a: 2 }), { puntos: [{ x: 5, y: 25, color: 'f', guias: true }] }), estado: {} },
      coincide: 'Coincide: a los 5 s la combi va a 2 · 5 = 10 m/s, como el mototaxi.',
    },
    mira: {
      datos: Object.assign(ejeXT({ a: 2 }), { puntos: [{ x: 5, y: 25, color: 'f', guias: true, desde: 1 }, { x: 10, y: 100, color: 'f', guias: true, desde: 2 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'A los 5 s la inclinación de la curva es la de la recta.', ecuacion: [Mv, ' = ', pa('2'), ' · ', pt('5'), ' = ', pv('10 m/s')] },
        { estado: { corte: 2 }, texto: 'A los 10 s se cruzan: mismo lugar, velocidades distintas.' },
      ],
    },
    regla: {
      texto: 'En el MRUV, la gráfica x–t es una parábola: su inclinación en cada instante es la velocidad. La gráfica a–t es horizontal.',
      ecuacion: [Mx, ' = ', { sub: [Mx, '0'] }, ' + ', Mv0, Mt, ' + ½', Ma, { sup: [Mt, '2'] }],
      condicion: 'a no cambia en el tramo. El área bajo a–t es cuánto cambió la velocidad.',
    },
    ahoraTu: {
      pieza: 'ejes',
      generar(s) {
        const r = azar(s + 61), ai = r.de([1, 1.5, 2, 2.5, 3, 4]), ti = r.ent(2, 8), dv = ai * ti;
        return {
          pregunta: ['La gráfica a–t de una combi es una recta horizontal en ', pa(ms2(ai)), ' durante ', pt(`${fm(ti)} s`), '. ¿Cuánto cambió su velocidad?'],
          datos: ['El área de un rectángulo es base por altura.'],
          opciones: opciones(dv, [
            { id: 'div', valor: ai / ti, error: 'G4', siFuera: 'Eso divide. El cambio de velocidad es el área: base por altura.' },
            { id: 'medio', valor: ai * ti / 2, error: 'G4-medio', siFuera: 'Eso es medio rectángulo; el área bajo a–t es entera.' },
            { id: 'cuadrado', valor: ai * ti * ti, error: 'K-CUADRADO', siFuera: 'Eso eleva t al cuadrado.' },
          ], n => `${fm(n)} m/s`),
          solucion: { texto: 'El área bajo a–t es cuánto cambió v.', ecuacion: [Mdv, ` = ${fm(ai)} · ${fm(ti)} = `, pv(ms(dv))] },
        };
      },
    },
  };

  // ---------- Ideas 5 y 6 (B5, B6): caída libre ----------
  const G = 10; // convención del examen (g ≈ 9,8 m/s² medido en el Perú)
  const g = { v: 'c-h', t: 'g', m: 'aceleración' }, y = { v: 'c-f', t: 'y', m: 'posición' }, h = { v: 'c-f', t: 'h', m: 'posición' };
  const COL_TORRE = { y: 'f', v: 'o', a: 'h' };

  // B5 — ESQUELETO (fase 3): la pelota que se suelta desde 20 m.
  const caidaEn = (H, ti) => { const tc = Math.sqrt(2 * H / G), tt = Math.min(ti, tc), marcas = [];
    for (let k = 0; k * 0.5 <= tt + 1e-9; k++) marcas.push(H - G * (k * 0.5) * (k * 0.5) / 2);
    return { datos: { alto: H, colores: COL_TORRE, pelotas: [{ y: Math.max(0, H - G * tt * tt / 2), v: -G * tt, marcas }] }, estado: {} }; };
  const caidaReposo = {
    id: 'caida-reposo',
    titulo: 'Caída libre desde el reposo',
    pregunta: 'Si sueltas a la vez una canica y una piedra, ¿cuál llega primero?',
    temas: ['Caída libre'],
    pieza: 'torre',
    juega: {
      consigna: 'Sueltas una pelota desde 20 m de alto y cae sola, sin aire. Mira cuánto cae en cada medio segundo.',
      controles: [{ id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: 2, paso: 0.5, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 1, modo: 'repite' } }],
      dibujo: val => caidaEn(20, val.t),
      lectura: val => ['A los ', pt(`${f(val.t, 1)} s`), ' cayó ', px(`${f(G * val.t * val.t / 2, 2)} m`)],
      minimo: 3,
    },
    predice: {
      pregunta: 'Desde la ventana del segundo piso sueltas a la vez una canica y una piedra diez veces más pesada. ¿Cuál llega primero al patio?',
      datos: ['Sin resistencia del aire.'],
      opciones: [
        { id: 'c', texto: 'Llegan a la vez', correcta: true },
        { id: 'decima', texto: 'La piedra, en la décima parte del tiempo', error: 'C2', siFuera: 'Sería cierto si la gravedad empujara más a lo pesado sin costarle moverlo. Sin aire, caen igual.' },
        { id: 'suave', texto: 'La piedra, un poco antes', error: 'C2-suave', siFuera: 'Con aire puede pasar con cosas muy livianas. Sin aire, caen igual.' },
        { id: 'liviano', texto: 'La canica, porque es más liviana', error: 'C2-liviano', siFuera: 'Lo liviano no cae más rápido: sin aire, todo cae con la misma g.' },
      ],
      dibujo: { datos: { alto: 10, colores: COL_TORRE, pelotas: [{ y: 7, v: 0, marcas: [] }, { y: 7, v: 0, marcas: [], grande: true }] }, estado: {} },
      revelar: { datos: { alto: 10, colores: COL_TORRE, pelotas: [{ y: 2, v: -10, marcas: [7] }, { y: 2, v: -10, marcas: [7], grande: true }] }, estado: {} },
      coincide: 'Coincide: sin aire, la gravedad acelera igual a todo.',
    },
    mira: {
      datos: caidaEn(20, 2).datos,
      pasos: [
        { texto: 'Cada segundo gana 10 m/s hacia abajo, pese lo que pese.', ecuacion: [Mv, ' = ', g, Mt] },
        { texto: 'En 2 s cae 20 m: cuatro veces lo que cae en 1 s.', ecuacion: [h, ' = ½', g, { sup: [Mt, '2'] }, ' = ½ · 10 · 4 = ', px('20 m')] },
      ],
    },
    regla: {
      texto: 'Sin aire, todo lo que se suelta cae con la misma aceleración g, pese lo que pese.',
      ecuacion: [Mv, ' = ', g, Mt, '   ·   ', h, ' = ½', g, { sup: [Mt, '2'] }],
      condicion: 'se suelta desde el reposo, sin aire y cerca del suelo; aquí g = 10 m/s².',
    },
    ahoraTu: {
      pieza: 'torre',
      generar(s) {
        const ti = [1, 1.5, 2, 2.5, 3, 4][s % 6], H = G * ti * ti / 2;
        return {
          pregunta: ['Sueltas una piedra desde un puente y llega al río en ', pt(`${f(ti, 1)} s`), '. ¿Desde qué altura cayó?'],
          datos: ['g = 10 m/s² (convención del examen); sin aire.', ['Desde el reposo: ', h, ' = ½', g, { sup: [Mt, '2'] }]],
          opciones: opciones(H, [
            { id: 'sin-medio', valor: 2 * H, error: 'C-MEDIO', siFuera: 'Eso olvida el ½.' },
            { id: 'v', valor: G * ti, error: 'C-VELOCIDAD', siFuera: 'Esa es la velocidad al llegar, en m/s.' },
            { id: 'lineal', valor: G * ti / 2, error: 'C-LINEAL', siFuera: 'Eso no eleva t al cuadrado.' },
          ], n => `${fm(n)} m`),
          solucion: { texto: 'Desde el reposo, h = ½ g t².', ecuacion: [h, ` = ½ · 10 · ${f(ti, 1)}² = `, px(`${fm(H)} m`)] },
        };
      },
    },
  };

  // B6 — contenido viejo («En la cima, g sigue»), reacomodado con los colores aprobados (fase 3).
  // Cambia: la altura y la flecha de v de la pelota · Permanece: la flecha de g, igual en todo instante ·
  // Progresa: el tiempo, con marcas cada 0,5 s · Se reserva: la cima, donde v = 0 y g sigue.
  const alturaEn = (vi, ti) => Math.max(0, vi * ti - G * ti * ti / 2);
  const torreEn = (vi, ti, alto = 25) => {
    const tv = 2 * vi / G, tt = Math.min(ti, tv);
    const marcas = [];
    for (let k = 0; k * 0.5 <= tt + 1e-9; k++) marcas.push(alturaEn(vi, k * 0.5));
    return { datos: { alto, colores: COL_TORRE, pelotas: [{ y: alturaEn(vi, tt), v: tt >= tv ? 0 : vi - G * tt, marcas }] }, estado: {} };
  };
  const caida = {
    id: 'caida-libre',
    titulo: 'Lanzamiento vertical',
    pregunta: 'En el punto más alto, ¿la pelota tiene aceleración?',
    temas: ['Caída libre'],
    pieza: 'torre',
    juega: {
      consigna: 'La pelota sube y baja sola, a velocidad real, y deja una marca cada medio segundo. Mira las dos flechas, también en la cima.',
      voz: 'Fíjate en las dos flechas: una cambia y la otra no.',
      controles: [
        { id: 'v0', etiqueta: 'v₀', color: 'c-o', min: 10, max: 20, paso: 5, inicio: 15, unidad: 'm/s', decimales: 0 },
        { id: 't', etiqueta: 't', color: 'c-i', min: 0, max: 4, paso: 0.5, inicio: 0.5, unidad: 's', decimales: 1, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: val => torreEn(val.v0, val.t),
      lectura: val => {
        const tv = 2 * val.v0 / G, tt = Math.min(val.t, tv);
        return tt >= tv ? ['En el suelo; ', g, ' = 10 m/s² hacia abajo'] : [Mv, ' = ', pv(`${f(val.v0 - G * tt, 1)} m/s`), ' y ', g, ' = 10 m/s² hacia abajo'];
      },
      minimo: 3,
      // Arrastra la pelota: el reloj salta al instante del medio segundo cuya altura queda más cerca del dedo.
      arrastres: [
        { id: 'pelota', etiqueta: 'pelota', color: 'c-f',
          donde: val => ({ x: TORRE().constantes.COLUMNAS[0], y: TORRE().escala(torreEn(val.v0, val.t).datos, alturaEn(val.v0, Math.min(val.t, 2 * val.v0 / G))) - 8 }),
          mover: (pt0, val) => {
            const d = torreEn(val.v0, val.t).datos, py = pt0.y + 8, tv = 2 * val.v0 / G;
            let mejor = val.t, dm = Infinity;
            for (let k = 0; k <= 8; k++) {
              const tk = k * 0.5, dy = Math.abs(TORRE().escala(d, alturaEn(val.v0, Math.min(tk, tv))) - py);
              const peor = dy > dm + 1e-6 || (Math.abs(dy - dm) <= 1e-6 && (Math.abs(tk - val.t) > Math.abs(mejor - val.t) + 1e-9 || (Math.abs(Math.abs(tk - val.t) - Math.abs(mejor - val.t)) <= 1e-9 && tk < mejor)));
              if (!peor) { mejor = tk; dm = dy; }
            }
            return { t: mejor };
          } },
      ],
    },
    predice: {
      pregunta: ['Una pelota sube con ', Mv0, ' = ', pv('20 m/s'), ' y llega a su punto más alto. Justo ahí, ¿cuánto vale su aceleración?'],
      datos: ['Sin resistencia del aire.'],
      opciones: [
        { id: 'c', texto: '10 m/s², hacia abajo', correcta: true },
        { id: 'cero', texto: '0: está detenida', error: 'C1', siFuera: 'v = 0 en la cima es cierto. Pero a mide cómo cambia v, y un instante después ya baja.' },
        { id: 'arriba', texto: '10 m/s², hacia arriba', error: 'K3', siFuera: 'Hacia arriba iba la velocidad al subir. La gravedad tira hacia abajo todo el tiempo.' },
        { id: 'masa', texto: 'Depende de la masa de la pelota', error: 'C2', siFuera: 'Con aire, la forma y la masa importan. Sin aire, todas caen con el mismo g.' },
      ],
      dibujo: torreEn(20, 1.5),
      revelar: torreEn(20, 2),
      coincide: 'Coincide: en la cima v = 0, pero la velocidad sigue cambiando 10 m/s cada segundo.',
    },
    // El juego muestra la torre y «Mira» pasa a v–t a propósito: la flecha de v que se vio achicarse es la altura de la
    // recta, y la flecha de g, que no cambia, es su pendiente, la misma también en la cima.
    mira: {
      pieza: 'ejes',
      datos: {
        x: { min: 0, max: 4, paso: 1, nombre: 't', unidad: 's', decimales: 0, color: 'i' },
        y: { min: -20, max: 20, paso: 10, nombre: 'v', unidad: 'm/s', decimales: 0, color: 'o' },
        curvas: [{ puntos: [[0, 20], [4, -20]], color: 'o', desde: 1 }],
        areas: [{ puntos: [[0, 20], [2, 0]], color: 'f', rotulo: '+20 m', desde: 3 }, { puntos: [[2, 0], [4, -20]], color: 'f', rotulo: '−20 m', desde: 4 }],
        puntos: [{ x: 0, y: 20, color: 'o', desde: 1 }, { x: 2, y: 0, color: 'o', rotulo: 'cima', guias: true, desde: 2 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Sale a 20 m/s y pierde 10 m/s cada segundo.', ecuacion: [Mv, ' = ', pv('20'), ' − ', pa('10'), Mt] },
        { estado: { corte: 2 }, texto: 'A los 2 s, v = 0: es la cima. La recta no se quiebra.', ecuacion: [Mt, ' = ', { frac: [Mv0, g] }, ' = ', pt('2 s')] },
        { estado: { corte: 2 }, texto: 'La pendiente es la misma antes, en y después de la cima.', ecuacion: [Ma, ' = −', g, ' = ', pa('−10 m/s²')] },
        { estado: { corte: 3 }, texto: 'El área hasta la cima es lo que subió.', ecuacion: [{ sub: [y, 'máx'] }, ' = ½ · 20 · 2 = ', px('20 m')] },
        { estado: { corte: 4 }, texto: 'Bajando, el área es negativa: vuelve al punto de partida a los 4 s.', ecuacion: [Mdx, ' = 20 − 20 = 0'] },
      ],
    },
    regla: {
      texto: 'En caída libre la única aceleración es g, hacia abajo, al subir, en la cima y al bajar. Con el eje hacia arriba:',
      ecuacion: [Mv, ' = ', Mv0, ' − ', { llave: [g, Mt], nota: 'lo que pierde', color: 'c-h' }, '   ·   ', y, ' = ', Mv0, Mt, ' − ½ ', g, { sup: [Mt, '2'] }],
      condicion: 'sin resistencia del aire y cerca del suelo. Aquí g = 10 m/s²; el valor medido es cercano a 9,8 m/s².',
    },
    ahoraTu: {
      pieza: 'torre',
      generar(s) {
        const r = azar(s), vi = [10, 15, 20, 25, 30][r.ent(0, 4)], pide = ['tiempo', 'altura', 'velocidad'][s % 3];
        const ts = vi / G, hm = vi * vi / (2 * G), alto = Math.ceil(hm / 10) * 10;
        const dib = { datos: { alto, colores: COL_TORRE, pelotas: [{ y: 0, v: vi, marcas: [] }] }, estado: {} };
        const DG = ['g = 10 m/s² (convención del examen); sin aire.', ['Con el eje hacia arriba: ', Mv, ' = ', Mv0, ' − ', g, Mt]];
        if (pide === 'tiempo') return {
          pregunta: ['Se lanza una pelota hacia arriba con ', Mv0, ' = ', pv(ms(vi)), '. ¿Cuánto tarda en llegar a la cima?'],
          datos: DG, dibujo: dib,
          opciones: opciones(ts, [
            { id: 'ida-vuelta', valor: 2 * ts, error: 'C-VUELTA', siFuera: 'Ese es el tiempo de subir y volver a bajar.' },
            { id: 'altura', valor: hm / 10, error: 'C-ALTURA', siFuera: 'Eso divide la altura entre 10; el tiempo sale de v₀ entre g.' },
            { id: 'por', valor: vi * G, error: 'K4', siFuera: 'Eso multiplica v₀ por g. v baja g cada segundo: se divide.' },
          ], n => `${f(n, 1)} s`),
          solucion: { texto: 'Pierde 10 m/s cada segundo hasta llegar a v = 0.', ecuacion: [Mt, ` = ${f(vi)} / 10 = `, pt(`${f(ts, 1)} s`)], dibujo: { datos: Object.assign({}, dib.datos, { pelotas: [{ y: hm, v: 0, marcas: [] }] }), estado: {} } },
        };
        if (pide === 'altura') return {
          pregunta: ['Se lanza una pelota hacia arriba con ', Mv0, ' = ', pv(ms(vi)), '. ¿Qué altura máxima alcanza?'],
          datos: [DG[0], ['Con el eje hacia arriba: ', { sup: [Mv, '2'] }, ' = ', { sup: [Mv0, '2'] }, ' − 2', g, y]], dibujo: dib,
          opciones: opciones(hm, [
            { id: 'sin-medio', valor: 2 * hm, error: 'C-MEDIO', siFuera: 'Eso olvida el ½: la rapidez media al subir es la mitad de v₀.' },
            { id: 'vt', valor: vi * ts / 4, error: 'C-AREA', siFuera: 'Esa área usa la mitad del tiempo de subida.' },
            { id: 'v-g', valor: vi / G, error: 'C-TIEMPO', siFuera: 'Ese número es el tiempo de subida, no la altura.' },
          ], n => `${f(n, 2)} m`),
          solucion: { texto: 'En la cima v = 0: se despeja la altura.', ecuacion: [{ sub: [y, 'máx'] }, ` = ${f(vi)}² ÷ 20 = `, px(`${f(hm, 2)} m`)], dibujo: { datos: Object.assign({}, dib.datos, { pelotas: [{ y: hm, v: 0, marcas: [] }] }), estado: {} } },
        };
        const tq = ts + [0.5, 1][r.ent(0, 1)], vq = vi - G * tq;
        return {
          pregunta: ['Se lanza una pelota hacia arriba con ', Mv0, ' = ', pv(ms(vi)), '. Con el eje hacia arriba, ¿qué velocidad tiene en ', Mt, ' = ', pt(`${f(tq, 1)} s`), '?'],
          datos: DG, dibujo: dib,
          opciones: opciones(vq, [
            { id: 'sin-signo', valor: -vq, error: 'K-SIGNO', siFuera: 'Ese es el valor de la rapidez, pero ya pasó la cima: va hacia abajo.' },
            { id: 'cima', valor: 0, error: 'C1', siFuera: 'v = 0 solo en la cima, que fue antes.' },
            { id: 'suma', valor: vi + G * tq, error: 'K3', siFuera: 'Eso suma g, como si la gravedad empujara hacia arriba.' },
          ], n => `${f(n, 1)} m/s`),
          solucion: { texto: 'Pierde 10 m/s cada segundo, también después de la cima.', ecuacion: [Mv, ` = ${f(vi)} − 10 · ${f(tq, 1)} = `, pv(`${f(vq, 1)} m/s`)] },
        };
      },
    },
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

  // Un color fijo por magnitud en las dos unidades del movimiento rectilíneo (cabecera; propuesta §6).
  const COLORES = { velocidad: 'o', tiempo: 'i', posición: 'f', desplazamiento: 'f', separación: 'f', aceleración: 'h' };

  return {
    unidad: 'fisica.mruv-y-caida-libre',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/pista.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/torre.js', '/nucleo/kit/piezas/fis-combi.js'],
    colores: COLORES,
    // En una recta, las magnitudes con dirección son números con signo (decisiones, 18 nov): la unidad no escribe «⃗».
    notacion: { vectores: false, motivo: 'En una recta, v, a y Δx son números con signo sobre el eje: el signo hace de flecha. La flecha se dibuja sobre la combi y el eje lleva su «+».' },
    // Glosario del tema (docs/teoria.md, 4d). «aceleración», «MRUV» y «frenar» se estrenan en la idea 1; «caída libre»
    // y «gravedad» vinieron de la unidad vieja (sin rehacer: se completan en la fase 3). «posición», «velocidad»,
    // «rapidez» y «pendiente» se definen en Movimiento rectilíneo uniforme y el lector las marca solas.
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
      { termino: 'caída libre', def: 'Movimiento de algo que solo cae por la atracción de la Tierra, sin que el aire lo frene.',
        ver: ['gravedad'] },
      { termino: 'gravedad', simbolo: 'g', medida: 'm/s²', def: 'Aceleración hacia abajo que da la Tierra: cerca del suelo, unos 9,8 m/s². En los problemas se usa 10.',
        ver: ['caída libre'] },
    ],
    // Laboratorio: juego libre, sin preguntas. La pista con acelerador va primero (nucleo/teoria-retos.test.js la usa).
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
      Object.assign({ id: 'recta-vt', titulo: 'La recta v–t', pieza: 'ejes' }, vt.juega),
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
