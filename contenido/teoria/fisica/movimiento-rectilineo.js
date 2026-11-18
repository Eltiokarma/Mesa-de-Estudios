/*
 * Teoría de «Movimiento rectilíneo uniforme» (fisica.movimiento-rectilineo), para 5.º de secundaria y
 * preuniversitario. Molde: docs/teoria.md y docs/molde-unidad.md. Fuente del contenido: docs/teoria/matriz/fisica.json
 * (unidad 2) y docs/etapa4/propuesta-fisica.md (aprobada por Gerson con todas sus recomendaciones; docs/etapa4/decisiones.md).
 *
 * Partición (18 nov, Gerson; propuesta §1 y §9, pregunta 1): «MRU, MRUV y caída libre» se partió en dos, como
 * Magnitudes y Vectores. Esta unidad conserva el id (el avance de los alumnos se guarda con él) y se queda con `mru` (A1),
 * `desplazamiento-distancia` (A3) y `encuentro` (A4); vendrán `grafica-xt` (A2) y `velocidad-relativa` (A5), nuevas.
 * La aceleración, la gráfica v–t y la caída libre pasaron tal cual a contenido/teoria/fisica/mruv-y-caida-libre.js
 * (fisica.mruv-y-caida-libre), con las mesas `pista-libre`, `ida-vuelta` y `recta-vt` y la historia de Galileo;
 * Avance.migrar (nucleo/avance.js) mueve el avance de esas ideas, mesas y palabras.
 *
 * Etapa 4 del plan de calidad, fase 2 del método: por ahora está rehecha SOLO la idea A1, «Velocidad constante: el MRU»
 * (`mru`), para el visto bueno de Gerson; `desplazamiento-distancia`, `encuentro` y la mesa `encuentro-libre` siguen
 * como estaban, con sus colores viejos (x turquesa, a verde, t rojo), hasta que les toque. Por eso la unidad no declara
 * todavía calidad: 2; movimiento-rectilineo.test.js corre la idea A1 sola con calidad 2.
 *
 * Ficha de tarea (diseno-y-animacion), idea A1:
 *   Promesa: la combi avanza lo mismo en cada segundo, y el signo de v dice hacia dónde.
 *   Persona y condiciones: 5.º de secundaria o preuniversitario, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: dice dónde estará un móvil con velocidad constante, también si va hacia el lado −.
 *   Orden de atención: 1.º la combi y la regla · 2.º las combis tenues de cada segundo · acción: el botón fijo.
 *   Estados: juego sin tocar · misión cumplida · predicción pendiente · coincide / no coincide · caso nuevo · «No sé».
 *   Duda que resuelve: ¿la posición es lo que avanzó? (No: es x₀ más lo que se movió, con su signo.)
 * Objeto de la primera pantalla: la combi en una avenida recta con la regla de metros pintada desde el paradero (x = 0);
 * pieza fis-combi, vista «avenida» (dibujo de prueba). Eco y trueno de los ejemplos: pieza fis-sonido (dibujo de prueba).
 *
 * Letras (propuesta §5): x posición con signo desde el paradero; x₀ la posición en t = 0; Δx lo que se movió; v la
 * velocidad con signo («rapidez» es v sin su signo); t el tiempo desde que arranca el reloj; D la separación entre dos
 * cosas (el cerro, el rayo). d queda para la distancia recorrida (A3).
 * NOTACIÓN: SIN MAGNITUDES VECTORIALES (decisiones, 18 nov; propuesta, pregunta 3). En una recta, v, a y Δx son números
 *   con signo sobre el eje: el signo hace de flecha, así que no llevan «⃗». La flecha se dibuja sobre la combi, con su
 *   rapidez, y el eje siempre lleva su «+». Lo declara def.notacion y lo comprueba movimiento-rectilineo.test.js.
 * REGLA DE COLORES (iguales en las dos unidades del movimiento rectilíneo; docs/molde-unidad.md §5b; tabla COLORES,
 *   def.colores): un color fijo por magnitud, el mismo en el juego, la figura, la fórmula, los datos, los ejemplos y
 *   «Ahora tú», y la respuesta en el color de su magnitud:
 *   - naranja (c-o): la velocidad y la rapidez (v, también en km/h), los tramos de cada segundo y la flecha de la combi;
 *   - turquesa (c-i): el tiempo (t, los rótulos «0 s, 1 s…» y el reloj);
 *   - violeta (c-f): la posición (x, x₀, la marca en la regla), lo que se movió (Δx, v · t) y la separación D;
 *   - carmín (c-h): la aceleración y g (en MRUV y caída libre; aquí no aparece);
 *   - tinta: la distancia recorrida, la regla, la avenida, los vehículos y lo que se pide en una figura («?»).
 *   Sin verde: iría junto al naranja de v (protanopía: 0,010).
 * Errores de la idea A1 (hipótesis de diseño, sin dato propio; docs/investigacion/cinematica-ideas-erroneas.md):
 *   MRU-X0 olvida la salida (da lo que se movió) · MRU-SIGNO suma aunque vaya hacia el lado − · MRU-CONTEO cuenta un
 *   segundo de más (la marca de t = 0) · MRU-SUMA suma los datos sueltos · MRU-ECUACION (nuevo) multiplica también x₀
 *   por t · U1-kmh usa km/h como m/s · U1-inversa multiplica por 3,6 (docs/investigacion/fisica-calculo-transversal-ideas-erroneas.md).
 *   Límites de velocidad del reglamento: no se usan (no se pudieron confirmar; propuesta, pregunta 10).
 *
 * Ideas viejas (sin rehacer): colores de la regla vieja: x turquesa (c-i, el de la pista), v naranja (c-o), t rojo (c-h).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const x = { v: 'c-i', t: 'x' }, v = { v: 'c-o', t: 'v' }, a = { v: 'c-d', t: 'a' }, t = { v: 'c-h', t: 't' };
  const x0 = { sub: [x, '0'] }, v0 = { sub: [v, '0'] };
  const dx = ['Δ', x], dv = ['Δ', v], dt = ['Δ', t];
  // Azar con semilla para «Ahora tú» (el mismo de nucleo/azar.js, en corto).
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
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
  const PISTA = () => Kit.piezas.pista, EJES = () => Kit.piezas.ejes, TORRE = () => Kit.piezas.torre;
  const MARCA_Y = 56;   // las marcas de la pista van 6 px bajo el piso del primer carril (pista.js)

  // ---------- Idea 1 (A1): velocidad constante, el MRU (18 nov, contrato «se entiende sin profesor») ----------
  // Pieza fis-combi, vista «avenida»: la combi en una avenida recta con la regla de metros desde el paradero.
  // Cambia: de dónde sale y qué tan rápido va · Permanece: el paradero en x = 0 y la regla · Progresa: el reloj, que deja
  // una combi tenue en cada segundo · Se reserva: la velocidad negativa (solo en Predice) · Debe verse: tramos iguales.
  // Un color fijo por magnitud (cabecera y COLORES): cada ficha dice su magnitud en m; lo comprueba el .test.js.
  const Mv = { v: 'c-o', t: 'v', m: 'velocidad' }, Mt = { v: 'c-i', t: 't', m: 'tiempo' }, Mx = { v: 'c-f', t: 'x', m: 'posición' };
  const Mx0 = { sub: [Mx, '0'] }, MD = { v: 'c-f', t: 'D', m: 'separación' };
  const pv = s => ({ v: 'c-o', t: String(s), m: 'velocidad' }), pt = s => ({ v: 'c-i', t: String(s), m: 'tiempo' });
  const px = s => ({ v: 'c-f', t: String(s), m: 'posición' }), pdx = s => ({ v: 'c-f', t: String(s), m: 'desplazamiento' });
  const pD = s => ({ v: 'c-f', t: String(s), m: 'separación' });
  const neg = l => ({ negrita: [l] });
  const fm = n => f(n, 2);   // con «−» de verdad y coma decimal (Kit.formatear)
  const COMBI = () => Kit.piezas['fis-combi'];
  const PARADERO = [{ en: 0, texto: 'Paradero' }];
  const avenida = (d, estado = {}) => ({ pieza: 'fis-combi', datos: Object.assign({ vista: 'avenida' }, d), estado });
  // La regla de metros de una figura: hasta dónde llega y cada cuánto lleva número.
  const regla = (min, max) => { const L = max - min; return L <= 140 ? { min, max, paso: 10, numero: 20 } : L <= 200 ? { min, max, paso: 10, numero: 50 }
    : L <= 300 ? { min, max, paso: 25, numero: 50 } : L <= 600 ? { min, max, paso: 50, numero: 100 } : { min, max, paso: 250, numero: 500 }; };

  // Datos de cada ejercicio (contrato, punto 13): herramientas, nunca el paso hecho. La fórmula general, el eje con su
  // signo y las equivalencias; ningún atajo («se resta si va hacia el paradero») ni consejo.
  const DM = {
    pos: ['Posición con velocidad constante: ', Mx, ' = ', Mx0, ' + ', Mv, ' · ', Mt],
    eje: 'El paradero está en x = 0; + hacia la derecha y − hacia la izquierda.',
    kmh: '1 km = 1000 m y 1 h = 3600 s',
    min: '1 min = 60 s',
    sonido: 'Rapidez del sonido en el aire: unos 340 m/s.',
    recorre: ['Lo que recorre algo con rapidez constante: rapidez · tiempo.'],
    eco: 'Eco: el sonido que rebota en el cerro y vuelve hasta quien grita.',
    luz: 'La luz del rayo llega casi de inmediato.',
  };

  // Ejemplos resueltos de A1 (pestaña «Ejemplos»). Cuentas rehechas con un script aparte que no usa este archivo
  // (scratchpad e4-fis/cuentas-a1.js, 18 nov): 0 + 15·4; −30 + 10·6; 90 − 15·4; (30 − 100)/5; 84/12; 54/3,6 y 15·8;
  // (61 − 25)/3 y 25 + 12·10; 120/15 y 120 − 15·10; 2·60 y 12·120; 10 + 14·2, 10 + 14·5 y 80 − 38; 340·3/2;
  // 340·4; 72/3,6, 1,5·60 y 20·90; 12·10 y 120 − 8·5; 40 − 8·7. Las figuras muestran lo que cada dato marca por sí solo
  // (la salida, la flecha de la velocidad dada, un lugar con nombre), nunca lo que sale de juntarlos (molde §3, 18 nov).
  const EJEMPLOS_MRU = [
    { nivel: 1, titulo: 'Desde el paradero',
      figura: avenida(Object.assign(regla(0, 80), { x0: 0, v: 15, segundos: 0, rotulos: false, lugares: PARADERO })),
      enunciado: ['Una combi sale del paradero hacia la derecha a ', pv('15 m/s'), ' y no cambia de velocidad. ¿Dónde está a los ', pt('4 s'), '?'],
      datos: [DM.pos, DM.eje],
      solucion: [{ texto: ['Sale de ', Mx0, ' = 0 y suma 15 m en cada uno de los 4 segundos.'], ecuacion: [Mx, ' = 0 + ', pv('15'), ' · ', pt('4'), ' = ', px('60 m')] }],
      respuesta: ['En ', px('x = 60 m'), ', a 60 m del paradero'] },
    { nivel: 1, titulo: 'Antes del paradero',
      figura: avenida(Object.assign(regla(-40, 60), { x0: -30, v: 10, segundos: 0, rotulos: false, signo: true, lugares: PARADERO, posiciones: [{ en: -30, texto: 'x₀', color: 'f' }] })),
      enunciado: ['Una combi está 30 m antes del paradero, en ', px('x₀ = −30 m'), ', y avanza hacia la derecha a ', pv('10 m/s'), '. ¿Dónde está a los ', pt('6 s'), '?'],
      datos: [DM.pos, DM.eje],
      solucion: [{ texto: 'La salida es negativa: está a la izquierda del cero. Se le suma lo que avanza.', ecuacion: [Mx, ' = ', px('−30'), ' + ', pv('10'), ' · ', pt('6'), ' = ', px('30 m')] }],
      respuesta: ['En ', px('x = 30 m'), ': ya pasó el paradero'] },
    { nivel: 1, titulo: 'Hacia el paradero',
      figura: avenida(Object.assign(regla(0, 100), { x0: 90, v: -15, segundos: 0, rotulos: false, signo: true, lugares: PARADERO, posiciones: [{ en: 90, texto: 'x₀', color: 'f' }] })),
      enunciado: ['Una combi está en ', px('x₀ = 90 m'), ' y va hacia el paradero a ', pv('15 m/s'), ', sin cambiar de velocidad. ¿Dónde está a los ', pt('4 s'), '?'],
      datos: [DM.pos, DM.eje],
      solucion: [{ texto: ['Va hacia la izquierda: su velocidad es negativa, ', pv('v = −15 m/s'), '.'], ecuacion: [Mx, ' = ', px('90'), ' + (', pv('−15'), ') · ', pt('4'), ' = ', px('30 m')] }],
      respuesta: ['En ', px('x = 30 m'), ', a 30 m del paradero'] },
    { nivel: 1, titulo: '¿Hacia dónde va?',
      figura: avenida(Object.assign(regla(0, 120), { x0: 100, v: -14, segundos: 0, rotulos: false, flecha: false, signo: true, lugares: PARADERO,
        posiciones: [{ en: 100, texto: '0 s', color: 'i' }, { en: 30, texto: '5 s', color: 'i' }] })),
      enunciado: ['Una combi pasa por ', px('x = 100 m'), ' y, ', pt('5 s'), ' después, por ', px('x = 30 m'), ', siempre igual de rápido. ¿Cuál es su velocidad, con su signo?'],
      datos: [DM.pos, DM.eje],
      solucion: [{ texto: ['Con ', Mx0, ' = 100 m, la combi llega a 30 m cuando ', Mt, ' = 5 s. Se despeja ', Mv, '.'], ecuacion: [px('30'), ' = ', px('100'), ' + ', Mv, ' · ', pt('5'), '  →  ', Mv, ' = ', { frac: [[px('30'), ' − ', px('100')], pt('5')] }, ' = ', pv('−14 m/s')] }],
      respuesta: [pv('v = −14 m/s'), ': va hacia el paradero'] },
    { nivel: 1, titulo: '¿Cuándo llega al grifo?',
      figura: avenida(Object.assign(regla(0, 100), { x0: 0, v: 12, segundos: 0, rotulos: false, lugares: [{ en: 0, texto: 'Paradero' }, { en: 84, texto: 'Grifo' }] })),
      enunciado: ['Una combi sale del paradero hacia la derecha a ', pv('12 m/s'), ', sin cambiar de velocidad. El grifo está en ', px('x = 84 m'), '. ¿Cuánto tarda en llegar?'],
      datos: [DM.pos, DM.eje],
      solucion: [
        { texto: 'Se busca el tiempo con el que la posición llega a 84 m.', ecuacion: [px('84'), ' = 0 + ', pv('12'), ' · ', Mt] },
        { texto: 'Se divide entre 12.', ecuacion: [Mt, ' = 84 ÷ 12 = ', pt('7 s')] },
      ],
      respuesta: ['Tarda ', pt('7 s')] },
    { nivel: 2, titulo: 'Una combi en km/h',
      figura: avenida(Object.assign(regla(0, 160), { x0: 0, v: 15, flechaTexto: '54 km/h', segundos: 0, rotulos: false, lugares: PARADERO })),
      enunciado: ['Una combi pasa por el paradero a ', pv('54 km/h'), ' hacia la derecha, sin cambiar de velocidad. ¿Dónde está ', pt('8 s'), ' después?'],
      datos: [DM.pos, DM.kmh, DM.eje],
      solucion: [
        { texto: 'Primero, la velocidad en m/s: 54 km en una hora.', ecuacion: [pv('54 km/h'), ' = ', { frac: ['54 000 m', '3600 s'] }, ' = ', pv('15 m/s')] },
        { texto: 'Después, la posición, desde el paradero:', ecuacion: [Mx, ' = 0 + ', pv('15'), ' · ', pt('8'), ' = ', px('120 m')] },
      ],
      respuesta: ['En ', px('x = 120 m')] },
    { nivel: 2, titulo: 'Dos marcas en la regla',
      figura: avenida(Object.assign(regla(0, 160), { x0: 25, v: 12, segundos: 0, rotulos: false, flecha: false, lugares: PARADERO,
        posiciones: [{ en: 25, texto: '0 s', color: 'i' }, { en: 61, texto: '3 s', color: 'i' }] })),
      enunciado: ['Una combi pasa por ', px('x = 25 m'), ' cuando el reloj marca 0 y por ', px('x = 61 m'), ' a los ', pt('3 s'), ', siempre igual de rápido. ¿Dónde estará a los ', pt('10 s'), '?'],
      datos: [DM.pos, DM.eje],
      solucion: [
        { texto: 'En 3 s avanzó 61 − 25 = 36 m: su velocidad es 36 m entre 3 s.', ecuacion: [Mv, ' = ', { frac: [[px('61'), ' − ', px('25')], pt('3')] }, ' = ', pv('12 m/s')] },
        { texto: ['Desde ', Mx0, ' = 25 m, durante 10 s:'], ecuacion: [Mx, ' = ', px('25'), ' + ', pv('12'), ' · ', pt('10'), ' = ', px('145 m')] },
      ],
      respuesta: ['En ', px('x = 145 m')] },
    { nivel: 2, titulo: 'Pasa el paradero',
      figura: avenida(Object.assign(regla(-40, 140), { x0: 120, v: -15, segundos: 0, rotulos: false, signo: true, lugares: PARADERO, posiciones: [{ en: 120, texto: 'x₀', color: 'f' }] })),
      enunciado: ['Una combi está en ', px('x₀ = 120 m'), ' y va hacia el paradero a ', pv('15 m/s'), ', sin cambiar de velocidad. ¿Cuándo pasa por el paradero? ¿Dónde está ', pt('2 s'), ' después?'],
      datos: [DM.pos, DM.eje],
      solucion: [
        { texto: ['Va hacia el lado −: ', pv('v = −15 m/s'), '. En el paradero, x = 0.'], ecuacion: ['0 = ', px('120'), ' + (', pv('−15'), ') · ', Mt, '  →  ', Mt, ' = ', pt('8 s')] },
        { texto: 'Dos segundos después, a los 10 s, ya está del otro lado:', ecuacion: [Mx, ' = ', px('120'), ' + (', pv('−15'), ') · ', pt('10'), ' = ', px('−30 m')] },
      ],
      respuesta: ['A los ', pt('8 s'), '; 2 s después, en ', px('x = −30 m')] },
    { nivel: 2, titulo: 'Cuánto avanza en minutos',
      figura: avenida(Object.assign(regla(0, 1600), { x0: 0, v: 12, segundos: 0, rotulos: false })),
      enunciado: ['Una combi va por la avenida a ', pv('12 m/s'), ', sin cambiar de velocidad. ¿Cuántos metros avanza en ', pt('2 min'), '?'],
      datos: [DM.pos, DM.min],
      solucion: [
        { texto: 'El tiempo, en segundos:', ecuacion: [pt('2 min'), ' = 2 · 60 s = ', pt('120 s')] },
        { texto: ['Lo que avanza es la parte ', Mv, ' · ', Mt, ' de la regla:'], ecuacion: [pv('12 m/s'), ' · ', pt('120 s'), ' = ', pdx('1440 m')] },
      ],
      respuesta: [pdx('1440 m'), ', casi un kilómetro y medio'] },
    { nivel: 2, titulo: 'Dónde está y cuánto avanzó',
      figura: avenida(Object.assign(regla(0, 100), { x0: 10, v: 14, segundos: 0, rotulos: false, lugares: PARADERO, posiciones: [{ en: 10, texto: 'x₀', color: 'f' }] })),
      enunciado: ['Una combi sale de ', px('x₀ = 10 m'), ' hacia la derecha a ', pv('14 m/s'), '. ¿Dónde está a los ', pt('2 s'), ' y a los ', pt('5 s'), '? ¿Cuánto avanzó entre esos dos momentos?'],
      datos: [DM.pos, DM.eje],
      solucion: [
        { texto: 'La regla da la posición a los 2 s y a los 5 s.', ecuacion: [Mx, ' = 10 + 14 · 2 = ', px('38 m'), ';   ', Mx, ' = 10 + 14 · 5 = ', px('80 m')] },
        { texto: 'Lo que avanzó entre los dos es la resta de las posiciones:', ecuacion: [px('80'), ' − ', px('38'), ' = ', pdx('42 m')] },
      ],
      respuesta: ['En ', px('38 m'), ' y en ', px('80 m'), '; avanzó ', pdx('42 m')] },
    { nivel: 3, titulo: 'El eco en el cerro',
      figura: { pieza: 'fis-sonido', datos: { objeto: 'eco', v: '340 m/s', t: '3 s', distancia: 'D = ?' }, estado: {} },
      enunciado: ['Una alumna grita frente a un cerro y oye el eco ', pt('3 s'), ' después. ¿A qué distancia de ella está el cerro?'],
      alternativas: ['1020 m', '510 m', '340 m', '113 m', '255 m'],
      datos: [DM.sonido, DM.eco, DM.recorre],
      solucion: [
        { texto: 'En 3 s el sonido va hasta el cerro y vuelve: hace el camino dos veces.', ecuacion: [pv('340 m/s'), ' · ', pt('3 s'), ' = 1020 m'] },
        { texto: 'El cerro está a la mitad de ese recorrido.', ecuacion: [MD, ' = 1020 m ÷ 2 = ', pD('510 m')] },
        { texto: ['La ', neg('A'), ', 1020 m, olvida que el eco va y vuelve.'] },
      ],
      respuesta: [neg('B'), ', ', pD('510 m')] },
    { nivel: 3, titulo: 'El rayo y el trueno',
      figura: { pieza: 'fis-sonido', datos: { objeto: 'trueno', v: '340 m/s', t: '4 s', distancia: 'D = ?' }, estado: {} },
      enunciado: ['En una tarde de tormenta ves un rayo y oyes su trueno ', pt('4 s'), ' después. ¿A qué distancia de ti cayó el rayo?'],
      alternativas: ['85 m', '680 m', '1360 m', '2720 m'],
      datos: [DM.sonido, DM.luz, DM.recorre],
      solucion: [
        { texto: 'La luz llegó casi al caer el rayo: los 4 s son lo que tardó el sonido.' },
        { texto: 'El sonido recorre la distancia una sola vez:', ecuacion: [MD, ' = ', pv('340 m/s'), ' · ', pt('4 s'), ' = ', pD('1360 m')] },
        { texto: ['La ', neg('B'), ' divide entre 2, como si fuera un eco; aquí no hay vuelta. La ', neg('A'), ' divide 340 entre 4.'] },
      ],
      respuesta: [neg('C'), ', ', pD('1360 m')] },
    { nivel: 3, titulo: 'La combi a 72 km/h',
      figura: avenida(Object.assign(regla(0, 2000), { x0: 0, v: 20, flechaTexto: '72 km/h', segundos: 0, rotulos: false, lugares: PARADERO })),
      enunciado: ['Una combi pasa por el paradero a ', pv('72 km/h'), ' y mantiene esa velocidad. ¿A qué distancia del paradero está ', pt('1,5 min'), ' después?'],
      alternativas: ['108 m', '30 m', '1,8 km', '6,48 km', '1,08 km'],
      datos: [DM.pos, DM.kmh, DM.min, DM.eje],
      solucion: [
        { texto: 'Todo a metros y segundos.', ecuacion: [pv('72 km/h'), ' = ', { frac: ['72 000 m', '3600 s'] }, ' = ', pv('20 m/s'), ';   ', pt('1,5 min'), ' = 1,5 · 60 s = ', pt('90 s')] },
        { texto: ['Desde el paradero, ', Mx0, ' = 0:'], ecuacion: [Mx, ' = 0 + ', pv('20'), ' · ', pt('90'), ' = ', px('1800 m'), ' = ', px('1,8 km')] },
        { texto: ['La ', neg('A'), ' multiplica 72 por 1,5 sin pasar a metros y segundos; la ', neg('B'), ' deja los minutos.'] },
      ],
      respuesta: [neg('C'), ', ', px('1,8 km')] },
    { nivel: 3, titulo: 'Va y regresa',
      figura: avenida(Object.assign(regla(0, 140), { x0: 0, v: 12, segundos: 0, rotulos: false, lugares: PARADERO })),
      enunciado: ['Una combi sale del paradero y va ', pt('10 s'), ' hacia la derecha a ', pv('12 m/s'), '; después regresa ', pt('5 s'), ' a ', pv('8 m/s'), '. ¿Dónde termina?'],
      alternativas: ['En x = 160 m', 'En x = 80 m', 'En x = 40 m', 'En x = 120 m', 'En x = 20 m'],
      datos: [DM.pos, DM.eje],
      solucion: [
        { texto: 'Primer tramo, desde el paradero:', ecuacion: [Mx, ' = 0 + ', pv('12'), ' · ', pt('10'), ' = ', px('120 m')] },
        { texto: ['Segundo tramo: sale de 120 m y regresa, ', pv('v = −8 m/s'), '.'], ecuacion: [Mx, ' = ', px('120'), ' + (', pv('−8'), ') · ', pt('5'), ' = ', px('80 m')] },
        { texto: ['La ', neg('A'), ', 160 m, suma lo que regresó como si siguiera avanzando.'] },
      ],
      respuesta: [neg('B'), ', en ', px('x = 80 m')] },
    { nivel: 3, titulo: 'La ecuación de la posición',
      figura: avenida(Object.assign(regla(-40, 60), { vehiculo: false, signo: true, lugares: PARADERO })),
      enunciado: ['La posición de una combi en la avenida es ', Mx, ' = ', px('40'), ' − ', pv('8'), Mt, ', con ', Mx, ' en metros y ', Mt, ' en segundos. ¿Dónde está a los ', pt('7 s'), ' y hacia dónde va?'],
      alternativas: ['En x = 16 m, hacia la derecha', 'En x = −16 m, hacia la izquierda', 'En x = 96 m, hacia la derecha', 'En x = −56 m, hacia la izquierda', 'En x = 16 m, hacia la izquierda'],
      datos: [DM.pos, DM.eje],
      solucion: [
        { texto: ['Se compara con ', Mx, ' = ', Mx0, ' + ', Mv, ' · ', Mt, ': sale de 40 m y su velocidad es −8 m/s.'], ecuacion: [Mx0, ' = ', px('40 m'), ';   ', Mv, ' = ', pv('−8 m/s')] },
        { texto: 'A los 7 s:', ecuacion: [Mx, ' = ', px('40'), ' − ', pv('8'), ' · ', pt('7'), ' = ', px('−16 m')] },
        { texto: ['v es negativa: va hacia la izquierda, y ya pasó el paradero. La ', neg('A'), ' pierde el signo.'] },
      ],
      respuesta: [neg('B'), ', ', px('x = −16 m'), ', hacia la izquierda'] },
  ];

  // El juego: la combi sale de x₀ (0 a 40 m) a v (2 a 20 m/s) y el reloj corre solo hasta los 5 s.
  const T_A1 = 5, REGLA_A1 = regla(0, 140);
  const juegoA1 = val => avenida(Object.assign({}, REGLA_A1, { x0: val.x0, v: val.v, t: Math.min(val.t, T_A1), segundos: T_A1, lugares: PARADERO,
    posiciones: [{ en: val.x0, texto: 'x₀', color: 'f' }] }));
  const escA1 = () => COMBI().escala(Object.assign({ vista: 'avenida' }, REGLA_A1));
  const MANIJA_Y = () => COMBI().constantes.AV.TRAMO;
  // Predice y Mira: la combi en x = 80 m que va hacia el paradero a 12 m/s (v = −12 m/s), lo que el juego no mostró.
  const PRED = Object.assign(regla(0, 100), { x0: 80, v: -12, signo: true, lugares: PARADERO });

  const mru = {
    id: 'mru',
    titulo: 'Velocidad constante: el MRU',
    pregunta: '¿Dónde estará la combi dentro de 5 segundos?',
    temas: ['MRU y velocidad relativa'],
    pieza: 'fis-combi',
    aprendizaje: 'En el MRU se avanza lo mismo en cada segundo: x = x₀ + v · t. El signo de v dice hacia dónde va.',
    actividad: 'Elegir de dónde sale la combi y qué tan rápido va.',
    lee: {
      tarjetas: [
        { titulo: 'La regla de la avenida', texto: ['En una avenida recta pintamos una regla de metros que empieza en el paradero, el cero. La posición ', Mx, ' es la marca donde está la combi: ', px('x = 60 m'), ' dice que está 60\u00a0m más allá del paradero.'],
          dibujo: avenida(Object.assign(regla(0, 100), { x0: 60, v: 0, segundos: 0, rotulos: false, lugares: PARADERO, posiciones: [{ en: 60, texto: 'x', color: 'f' }] })) },
        { titulo: 'El signo, como en Vectores', texto: ['Como en Vectores, el eje tiene signo: + hacia la derecha y − hacia la izquierda. Una marca antes del paradero es negativa: ', px('x = −30 m'), '. En una recta, la flecha de un vector se resume en ese signo.'],
          dibujo: avenida(Object.assign(regla(-40, 60), { x0: -30, v: 0, segundos: 0, rotulos: false, signo: true, lugares: PARADERO, posiciones: [{ en: -30, texto: 'x', color: 'f' }] })) },
        { titulo: 'Cuándo empezamos a contar', texto: ['El reloj marca ', Mt, ' = 0 cuando empezamos a mirar. ', Mx0, ' (equis sub cero) es dónde estaba la combi en ese momento. La velocidad ', Mv, ' dice cuántos metros se mueve en cada segundo.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir de dónde sale la combi y qué tan rápido va. El reloj corre solo y deja una combi tenue en cada segundo: mira cómo quedan separadas.' },
      ],
    },
    ejemplos: EJEMPLOS_MRU,
    juega: {
      pieza: 'fis-combi',
      consigna: 'La combi va por la avenida con velocidad constante; el paradero es x = 0.',
      mision: {
        texto: 'Haz que la combi pase por la marca de 100 m justo a los 5 s.',
        // Cinco salidas lo logran: de 0 m a 20 m/s, de 10 m a 18 m/s… de 40 m a 12 m/s. El reloj no cuenta.
        logrado: val => val.x0 + 5 * val.v === 100,
        bien: 'Listo: a los 5 s está en 100 m. ¿Llegas también saliendo de otra marca?',
      },
      voz: 'Mira cuánto se separan las combis tenues.',
      leyenda: [
        { s: [Mx0], t: 'dónde está al arrancar el reloj' },
        { s: [Mv], t: 'metros que avanza en cada segundo' },
        { s: [Mt], t: 'segundos desde que arranca el reloj' },
        { s: 'combi tenue', t: 'dónde estaba en cada segundo' },
        { s: 'm', t: 'metros de la regla, desde el paradero' },
      ],
      controles: [
        { id: 'x0', etiqueta: 'Sale de, x₀', color: 'c-f', min: 0, max: 40, paso: 10, inicio: 0, unidad: 'm', decimales: 0 },
        { id: 'v', etiqueta: 'Velocidad, v', color: 'c-o', min: 2, max: 20, paso: 2, inicio: 8, unidad: 'm/s', decimales: 0 },
        { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: T_A1 + 0.5, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: juegoA1,
      lectura: val => ['Sale de ', px(`${fm(val.x0)} m`), ' y suma ', pv(`${fm(val.v)} m`), ' cada segundo: ', px(`${fm(val.x0 + T_A1 * val.v)} m`)],
      resumen: { x0: 0, v: 8, t: 5 },
      minimo: 3,
      // Gesto directo: se arrastra la marca de la salida (x₀) o la de los 5 s (qué tan rápido va).
      arrastres: [
        { id: 'salida', etiqueta: 'marca de la salida', color: 'c-f',
          donde: val => ({ x: escA1()(val.x0), y: MANIJA_Y() }),
          mover: pt => ({ x0: inversa(escA1(), REGLA_A1.min, REGLA_A1.max)(pt.x) }) },
        { id: 'marca-5', etiqueta: 'marca de los 5 segundos', color: 'c-o',
          donde: val => ({ x: escA1()(val.x0 + T_A1 * val.v), y: MANIJA_Y() }),
          mover: (pt, val) => ({ v: (inversa(escA1(), REGLA_A1.min, REGLA_A1.max)(pt.x) - val.x0) / T_A1 }) },
      ],
    },
    predice: {
      pregunta: ['La combi está en ', px('x = 80 m'), ' y va hacia el paradero a ', pv('12 m/s'), ', sin cambiar de velocidad. ¿Dónde está ', pt('5 s'), ' después?'],
      datos: ['El paradero está en x = 0.', 'Hacia el paradero es el sentido negativo.'],
      opciones: [
        { id: 'c', texto: 'En x = 20 m', correcta: true },
        { id: 'signo', texto: 'En x = 140 m', error: 'MRU-SIGNO', siFuera: 'Bien que sumes 12 m por segundo. Pero va hacia el paradero: su posición baja.' },
        { id: 'sin-x0', texto: 'En x = 60 m', error: 'MRU-X0', siFuera: 'Bien: en 5 s se mueve 60 m. Pero eso es lo que se movió; salió de 80 m.' },
        { id: 'seis', texto: 'En x = 8 m', error: 'MRU-CONTEO', siFuera: 'Eso cuenta seis tramos de 12 m. En t = 0 todavía no se movió.' },
      ],
      dibujo: avenida(Object.assign({}, PRED, { segundos: 0, posiciones: [{ en: 80, texto: 'x₀', color: 'f' }] })),
      revelar: avenida(Object.assign({}, PRED, { segundos: 5, posiciones: [{ en: 20, texto: 'x', color: 'f' }] })),
      coincide: 'Coincide: en 5 s se mueve 60 m hacia el paradero, y 80 − 60 = 20.',
    },
    mira: {
      datos: Object.assign({ vista: 'avenida' }, PRED, { segundos: 5, posiciones: [{ en: 80, texto: 'x₀', color: 'f' }] }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Al arrancar el reloj, la combi está en la marca de 80 m.', ecuacion: [Mx0, ' = ', px('80 m')] },
        { estado: { corte: 0 }, texto: 'Va hacia el paradero, el lado −: su velocidad es negativa.', ecuacion: [Mv, ' = ', pv('−12 m/s')] },
        { estado: { corte: 1 }, texto: 'Cada segundo, la posición baja 12 m: al primer segundo, 68 m.', ecuacion: [Mx, ' = 80 + (−12) · 1 = ', px('68 m')] },
        { estado: { corte: 5 }, texto: 'En 5 s se movió 60 m hacia el paradero.', ecuacion: [Mv, ' · ', Mt, ' = (', pv('−12'), ') · ', pt('5'), ' = ', pdx('−60 m')] },
        { estado: { corte: 5 }, texto: 'Se suma a donde estaba: queda en 20 m.', ecuacion: [Mx, ' = ', px('80'), ' + (', pdx('−60'), ') = ', px('20 m')] },
        { estado: { corte: 5 }, texto: 'Lo que se movió, 60 m, no es dónde está, 20 m.' },
      ],
    },
    regla: {
      texto: 'Con velocidad constante, la posición cambia lo mismo cada segundo; el signo de v dice hacia dónde va. La academia escribe x = x₀ ± v · t: ese ± es el signo.',
      ecuacion: [Mx, ' = ', { llave: [Mx0], nota: 'dónde estaba en t = 0', color: 'c-f' }, ' + ', { llave: [Mv, ' · ', Mt], nota: 'cuánto se movió, con su signo', color: 'c-f' }],
      condicion: 'v no cambia en todo el tramo, y t se cuenta desde que la combi estaba en x₀.',
      dibujo: avenida(Object.assign(regla(-20, 100), { x0: 80, v: -12, segundos: 5, signo: true, rotulos: false,
        llaves: [{ de: 0, a: 80, texto: 'x₀', color: 'f', fila: 1 }, { de: 80, a: 20, texto: 'v · t', color: 'f' }], posiciones: [{ en: 20, texto: 'x', color: 'f' }] })),
    },
    resuelve: {
      pieza: 'fis-combi',
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const xi = r.ent(0, 3) * 10, vi = r.ent(6, 15), T = r.ent(4, 9), xg = xi + vi * T;
          return {
            enunciado: ['La combi sale de ', px(`x₀ = ${fm(xi)} m`), ' hacia la derecha a ', pv(`${fm(vi)} m/s`), ', sin cambiar de velocidad. El grifo está en ', px(`x = ${fm(xg)} m`), '. ¿Cuánto tarda en llegar?'],
            datos: [DM.pos, DM.eje],
            dibujo: avenida(Object.assign(regla(0, Math.ceil((xg + 10) / 50) * 50), { x0: xi, v: vi, segundos: 0, rotulos: false, lugares: [{ en: 0, texto: 'Paradero' }, { en: xg, texto: 'Grifo' }], posiciones: [{ en: xi, texto: 'x₀', color: 'f' }] })),
            pasos: [
              { tipo: 'pide', texto: ['Piden el tiempo ', Mt, ' que tarda en llegar al grifo.'] },
              { tipo: 'datos', texto: ['Sale de ', px(`${fm(xi)} m`), ', va a ', pv(`${fm(vi)} m/s`), ' y debe llegar a ', px(`${fm(xg)} m`), '.'] },
              { tipo: 'regla', texto: ['La posición con velocidad constante: ', Mx, ' = ', Mx0, ' + ', Mv, ' · ', Mt, '. Se despeja ', Mt, '.'] },
              { tipo: 'cuentas', texto: 'Se reemplaza lo que se sabe y se despeja.', ecuacion: [px(fm(xg)), ' = ', px(fm(xi)), ' + ', pv(fm(vi)), ' · ', Mt, '  →  ', Mt, ' = ', { frac: [[px(fm(xg)), ' − ', px(fm(xi))], pv(fm(vi))] }, ' = ', pt(`${fm(T)} s`)] },
              { tipo: 'sentido', texto: `Comprobación: ${fm(xi)} + ${fm(vi)} · ${fm(T)} = ${fm(xg)} m. Sí llega al grifo.` },
            ],
            respuesta: ['Tarda ', pt(`${fm(T)} s`)],
          };
        }
        const a = r.ent(8, 14) * 10, T = r.ent(3, 8), vv = r.ent(6, 12), b = a - vv * T;
        return {
          enunciado: ['Una combi pasa por ', px(`x = ${fm(a)} m`), ' y, ', pt(`${fm(T)} s`), ' después, por ', px(`x = ${fm(b)} m`), ', sin cambiar de velocidad. ¿Cuál es su velocidad?'],
          datos: [DM.pos, DM.eje],
          pasos: [
            { tipo: 'pide', texto: ['Piden la velocidad ', Mv, ', con su signo.'] },
            { tipo: 'datos', texto: ['Al empezar, ', Mx0, ' = ', px(`${fm(a)} m`), '; a los ', pt(`${fm(T)} s`), ', ', Mx, ' = ', px(`${fm(b)} m`), '.'] },
            { tipo: 'regla', texto: ['La posición con velocidad constante: ', Mx, ' = ', Mx0, ' + ', Mv, ' · ', Mt, '. Se despeja ', Mv, '.'] },
            { tipo: 'cuentas', texto: 'Se reemplaza lo que se sabe y se despeja.', ecuacion: [px(fm(b)), ' = ', px(fm(a)), ' + ', Mv, ' · ', pt(fm(T)), '  →  ', Mv, ' = ', { frac: [[px(fm(b)), ' − ', px(fm(a))], pt(fm(T))] }, ' = ', pv(`${fm(-vv)} m/s`)] },
            { tipo: 'sentido', texto: 'El signo − dice que va hacia la izquierda, hacia el paradero: su posición bajó.' },
          ],
          respuesta: [pv(`v = ${fm(-vv)} m/s`), ', hacia el paradero'],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-combi',
      generar(s) {
        const r = azar(s + 31), k = s % 4, en = n => `En x = ${fm(n)} m`;
        // Cuatro opciones distintas: la correcta y los tres primeros distractores que no repiten un valor.
        const cuatro = (bien, ds) => opciones(bien, ds, en).slice(0, 4);
        if (k === 0) {
          const xi = r.ent(0, 5) * 10, vi = r.ent(4, 15), ti = r.ent(3, 9), xf = xi + vi * ti;
          return {
            pregunta: ['Una combi sale de ', px(`x₀ = ${fm(xi)} m`), ' hacia la derecha a ', pv(`${fm(vi)} m/s`), ', sin cambiar de velocidad. ¿Dónde está a los ', pt(`${fm(ti)} s`), '?'],
            datos: [DM.pos, DM.eje],
            dibujo: avenida(Object.assign(regla(0, 200), { x0: xi, v: vi, segundos: 0, rotulos: false, lugares: PARADERO, posiciones: [{ en: xi, texto: 'x₀', color: 'f' }] })),
            opciones: cuatro(xf, [
              { id: 'sin-x0', valor: vi * ti, error: 'MRU-X0', siFuera: `Bien: avanza ${fm(vi * ti)} m. Pero salió de ${fm(xi)} m: falta sumarle esa salida.` },
              { id: 'uno-mas', valor: xi + vi * (ti + 1), error: 'MRU-CONTEO', siFuera: `Eso cuenta ${fm(ti + 1)} segundos. En t = 0 la combi todavía no avanzó.` },
              { id: 'suma', valor: xi + vi + ti, error: 'MRU-SUMA', siFuera: 'Eso suma los datos. En cada segundo agrega v metros: se multiplica v por t.' },
              { id: 'signo', valor: xi - vi * ti, error: 'MRU-SIGNO', siFuera: 'Bien que multipliques v por t. Pero va hacia la derecha: la posición sube.' },
            ]),
            solucion: { texto: `Sale de ${fm(xi)} m y suma ${fm(vi)} m en cada segundo.`, ecuacion: [Mx, ' = ', px(fm(xi)), ' + ', pv(fm(vi)), ' · ', pt(fm(ti)), ' = ', px(`${fm(xf)} m`)] },
          };
        }
        if (k === 1) {
          const xi = r.ent(6, 12) * 10, rr = r.ent(8, 16), ti = r.ent(3, 9), xf = xi - rr * ti;
          return {
            pregunta: ['Una combi está en ', px(`x₀ = ${fm(xi)} m`), ' y va hacia el paradero a ', pv(`${fm(rr)} m/s`), ', sin cambiar de velocidad. ¿Dónde está ', pt(`${fm(ti)} s`), ' después?'],
            datos: [DM.pos, DM.eje],
            dibujo: avenida(Object.assign(regla(-40, 140), { x0: xi, v: -rr, segundos: 0, rotulos: false, signo: true, lugares: PARADERO, posiciones: [{ en: xi, texto: 'x₀', color: 'f' }] })),
            opciones: cuatro(xf, [
              { id: 'signo', valor: xi + rr * ti, error: 'MRU-SIGNO', siFuera: `Bien que avance ${fm(rr)} m por segundo. Pero va hacia el paradero: su posición baja.` },
              { id: 'sin-x0', valor: rr * ti, error: 'MRU-X0', siFuera: `Bien: se mueve ${fm(rr * ti)} m. Pero eso es lo que se movió, no dónde está.` },
              { id: 'uno-mas', valor: xi - rr * (ti + 1), error: 'MRU-CONTEO', siFuera: `Eso cuenta ${fm(ti + 1)} segundos. En t = 0 todavía no se movió.` },
              { id: 'suma', valor: xi - rr - ti, error: 'MRU-SUMA', siFuera: 'Eso resta los datos sueltos. En cada segundo se mueve v metros: v por t.' },
            ]),
            solucion: { texto: 'Va hacia el paradero, el lado −: su velocidad es negativa.', ecuacion: [Mx, ' = ', px(fm(xi)), ' + (', pv(fm(-rr)), ') · ', pt(fm(ti)), ' = ', px(`${fm(xf)} m`)] },
          };
        }
        if (k === 2) {
          const kmh = [18, 36, 54, 72, 90][r.ent(0, 4)], vi = kmh / 3.6, xi = r.ent(0, 4) * 10, ti = r.ent(6, 15), xf = xi + vi * ti;
          return {
            pregunta: ['Una combi pasa por ', px(`x₀ = ${fm(xi)} m`), ' a ', pv(`${fm(kmh)} km/h`), ' hacia la derecha y no cambia de velocidad. ¿Dónde está ', pt(`${fm(ti)} s`), ' después?'],
            datos: [DM.pos, DM.kmh, DM.eje],
            dibujo: avenida(Object.assign(regla(0, 500), { x0: xi, v: vi, flechaTexto: `${fm(kmh)} km/h`, segundos: 0, rotulos: false, lugares: PARADERO })),
            opciones: cuatro(xf, [
              { id: 'kmh', valor: xi + kmh * ti, error: 'U1-kmh', siFuera: `Bien la regla. Pero ${fm(kmh)} km/h no son ${fm(kmh)} m/s: falta pasar a m/s.` },
              { id: 'por-36', valor: xi + kmh * 3.6 * ti, error: 'U1-inversa', siFuera: 'Bien que conviertas. Pero de km/h a m/s se divide entre 3,6, no se multiplica.' },
              { id: 'uno-mas', valor: xi + vi * (ti + 1), error: 'MRU-CONTEO', siFuera: `Bien los ${fm(vi)} m/s. Pero eso cuenta ${fm(ti + 1)} segundos.` },
              { id: 'sin-x0', valor: vi * ti, error: 'MRU-X0', siFuera: `Bien los ${fm(vi)} m/s. Pero salió de ${fm(xi)} m: falta sumarle esa salida.` },
            ]),
            solucion: { texto: `${fm(kmh)} km/h son ${fm(vi)} m/s; después, la regla de la posición.`, ecuacion: [Mx, ' = ', px(fm(xi)), ' + ', pv(fm(vi)), ' · ', pt(fm(ti)), ' = ', px(`${fm(xf)} m`)] },
          };
        }
        const A = r.ent(2, 6) * 10, B = r.ent(4, 9), ti = r.ent(3, 9), xf = A - B * ti;
        return {
          pregunta: ['La posición de una combi en la avenida es ', Mx, ' = ', px(fm(A)), ' − ', pv(fm(B)), Mt, ', con ', Mx, ' en metros y ', Mt, ' en segundos. ¿Dónde está a los ', pt(`${fm(ti)} s`), '?'],
          datos: [DM.pos, DM.eje],
          opciones: cuatro(xf, [
            { id: 'signo', valor: A + B * ti, error: 'MRU-SIGNO', siFuera: `Bien que multipliques ${fm(B)} por ${fm(ti)}. Pero la ecuación resta: v es negativa.` },
            { id: 'todo', valor: (A - B) * ti, error: 'MRU-ECUACION', siFuera: `La t multiplica solo al ${fm(B)}. El ${fm(A)} es la salida, x₀, y no cambia.` },
            { id: 'sin-x0', valor: -B * ti, error: 'MRU-X0', siFuera: `Bien: se mueve ${fm(B * ti)} m hacia el −. Pero salió de ${fm(A)} m.` },
            { id: 'uno-mas', valor: A - B * (ti + 1), error: 'MRU-CONTEO', siFuera: `Eso usa t = ${fm(ti + 1)} s. Reemplaza t = ${fm(ti)} s.` },
          ]),
          solucion: { texto: `Es x = x₀ + v · t con x₀ = ${fm(A)} m y v = ${fm(-B)} m/s.`, ecuacion: [Mx, ' = ', px(fm(A)), ' − ', pv(fm(B)), ' · ', pt(fm(ti)), ' = ', px(`${fm(xf)} m`)] },
        };
      },
    },
  };

  // ---------- Idea 2: desplazamiento no es distancia ----------
  const EJE_VT = (vmin, vmax, tmax) => ({
    x: { min: 0, max: tmax, paso: 1, nombre: 't', unidad: 's', decimales: 0, color: 'h' },
    y: { min: vmin, max: vmax, paso: 2, nombre: 'v', unidad: 'm/s', decimales: 0, color: 'o' },
  });
  // Dos tramos: avanza a v1 durante t1 y retrocede a v2 durante t2.
  function idaVuelta(v1, t1, v2, t2, rotulos = true, corte = {}) {
    const A1 = v1 * t1, A2 = v2 * t2, T = t1 + t2;
    return Object.assign(EJE_VT(-6, 6, Math.max(6, T)), {
      curvas: [{ puntos: [[0, v1], [t1, v1], null, [t1, -v2], [T, -v2]], color: 'o' }],
      areas: [
        { puntos: [[0, v1], [t1, v1]], color: 'i', rotulo: rotulos ? `+${f(A1)} m` : undefined, desde: corte.a1 },
        { puntos: [[t1, -v2], [T, -v2]], color: 'i', rotulo: rotulos ? `−${f(A2)} m` : undefined, desde: corte.a2 },
      ],
    });
  }
  // Animación: el reloj recorre la ida y la vuelta a velocidad real. El punto naranja va sobre la gráfica y las dos
  // áreas se llenan hasta t; Δx y d del momento salen de esas mismas áreas (regla 1). Al terminar se queda quieto.
  const IDA_V = 4, IDA_T = 3;
  const tramo = (v2, t2, tt) => {
    const T = IDA_T + t2, tm = Math.max(0, Math.min(tt, T));
    const a1 = IDA_V * Math.min(tm, IDA_T), a2 = v2 * Math.max(0, tm - IDA_T);
    return { tm, a1, a2, vt: tm < IDA_T ? IDA_V : -v2 };
  };
  const idaVueltaT = (v2, t2, tt) => {
    const d = idaVuelta(IDA_V, IDA_T, v2, t2, false), q = tramo(v2, t2, tt);
    const ar = [];
    if (q.tm > 0) ar.push({ puntos: [[0, IDA_V], [Math.min(q.tm, IDA_T), IDA_V]], color: 'i', rotulo: q.tm >= 0.8 ? `+${f(q.a1, 1)} m` : undefined });
    if (q.tm > IDA_T) ar.push({ puntos: [[IDA_T, -v2], [q.tm, -v2]], color: 'i', rotulo: q.tm - IDA_T >= 0.8 ? `−${f(q.a2, 1)} m` : undefined });
    return Object.assign(d, { areas: ar, puntos: [{ x: q.tm, y: q.vt, color: 'o', guias: true }] });
  };
  const distancia = {
    id: 'desplazamiento-distancia',
    titulo: 'Desplazamiento no es distancia',
    temas: ['Posición, desplazamiento y distancia', 'Velocidad y rapidez media'],
    pieza: 'ejes',
    juega: {
      consigna: 'El carrito avanza a 4 m/s durante 3 s y después retrocede. Mira cómo se llenan las dos áreas mientras corre el reloj.',
      voz: 'La parte bajo el eje es cuando va hacia atrás.',
      controles: [
        { id: 'v2', etiqueta: 'Retrocede a', min: 1, max: 6, paso: 1, inicio: 2, unidad: 'm/s', decimales: 0 },
        { id: 't2', etiqueta: 'Durante', min: 1, max: 3, paso: 1, inicio: 2, unidad: 's', decimales: 0 },
        { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 7, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: val => ({ datos: idaVueltaT(val.v2, val.t2, val.t), estado: {} }),
      lectura: val => { const q = tramo(val.v2, val.t2, val.t); return [t, ` = ${f(q.tm, 1)} s · `, dx, ` = ${f(q.a1 - q.a2, 1)} m · d = ${f(q.a1 + q.a2, 1)} m`]; },
      minimo: 3,
      // Arrastra el tramo de abajo hacia arriba o abajo (qué tan rápido retrocede) y su borde derecho (cuánto tiempo).
      arrastres: [
        { id: 'retroceso', etiqueta: 'rapidez de retroceso', color: 'c-o',
          donde: val => { const g = EJES().geometria(idaVuelta(4, 3, val.v2, val.t2)); return { x: g.X(3 + val.t2 / 2), y: g.Y(-val.v2) }; },
          mover: (pt, val) => { const g = EJES().geometria(idaVuelta(4, 3, val.v2, val.t2)); return { v2: -inversa(g.Y, -6, 6)(pt.y) }; } },
        { id: 'duracion', etiqueta: 'fin del retroceso', color: 'c-h',
          donde: val => { const g = EJES().geometria(idaVuelta(4, 3, val.v2, val.t2)); return { x: g.X(3 + val.t2), y: g.Y(-val.v2) }; },
          mover: (pt, val) => { const g = EJES().geometria(idaVuelta(4, 3, val.v2, val.t2)); return { t2: inversa(g.X, 0, 6)(pt.x) - 3 }; } },
      ],
    },
    predice: {
      pregunta: 'Un carrito avanza 12 m en 3 s y regresa los mismos 12 m en otros 3 s. ¿Cuál es su velocidad media en los 6 s?',
      opciones: [
        { id: 'c', texto: '0 m/s', correcta: true },
        { id: 'rapidez', texto: '4 m/s', error: 'DX-RAPIDEZ', siFuera: '4 m/s es la rapidez media: distancia entre tiempo. La velocidad media usa el desplazamiento.' },
        { id: 'tramo', texto: '2 m/s', error: 'DX-TRAMO', siFuera: '2 m/s sería cierto si avanzara 12 m en 6 s sin volver.' },
        { id: 'ida', texto: '8 m/s', error: 'DX-SUMA', siFuera: '8 m/s suma las rapideces de ida y vuelta; la media no se obtiene así.' },
      ],
      dibujo: { datos: idaVuelta(4, 3, 4, 3, false), estado: {} },
      revelar: { datos: idaVuelta(4, 3, 4, 3, true), estado: {} },
      coincide: 'Coincide: terminó donde empezó, así que su desplazamiento es 0.',
    },
    mira: {
      datos: idaVuelta(4, 3, 2, 3, true, { a1: 1, a2: 2 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Área sobre el eje: avanzó 4 · 3 = 12 m.', ecuacion: [{ sub: ['A', '+'] }, ' = 12 m'] },
        { estado: { corte: 2 }, texto: 'Área bajo el eje: retrocedió 2 · 3 = 6 m.', ecuacion: [{ sub: ['A', '−'] }, ' = 6 m'] },
        { estado: { corte: 2 }, texto: 'Desplazamiento: lo de arriba menos lo de abajo.', ecuacion: [dx, ' = 12 − 6 = 6 m'] },
        { estado: { corte: 2 }, texto: 'Distancia recorrida: todo el camino, sumado.', ecuacion: ['d = 12 + 6 = 18 m'] },
        { estado: { corte: 2 }, texto: 'En 6 s: velocidad media 1 m/s; rapidez media 3 m/s.', ecuacion: [{ frac: [dx, dt] }, ' = 1 m/s', '   ·   ', { frac: ['d', dt] }, ' = 3 m/s'] },
      ],
    },
    regla: {
      texto: 'En la gráfica v–t, el área sobre el eje suma y la de abajo resta: eso es el desplazamiento. La distancia suma ambas.',
      ecuacion: [dx, ' = ', { llave: [{ sub: ['A', '+'] }], nota: 'sobre el eje', color: 'c-i' }, ' − ', { llave: [{ sub: ['A', '−'] }], nota: 'bajo el eje', color: 'c-i' }, '   ·   ', 'd = ', { sub: ['A', '+'] }, ' + ', { sub: ['A', '−'] }],
      condicion: 'se separa el área en cada cambio de sentido. Velocidad media = Δx/Δt; rapidez media = d/Δt.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), v1 = r.ent(2, 5), t1 = r.ent(2, 3), v2 = r.ent(1, 5), t2 = r.ent(1, 3);
        const A1 = v1 * t1, A2 = v2 * t2, pide = s % 2 ? 'distancia' : 'desplazamiento';
        const bien = pide === 'distancia' ? A1 + A2 : A1 - A2;
        const otro = pide === 'distancia' ? A1 - A2 : A1 + A2;
        return {
          pregunta: `Con esta gráfica v–t, ¿cuál es ${pide === 'distancia' ? 'la distancia recorrida' : 'el desplazamiento'} en los ${f(t1 + t2)} s?`,
          dibujo: { datos: idaVuelta(v1, t1, v2, t2, false), estado: {} },
          opciones: opciones(bien, [
            { id: 'cambio', valor: otro, error: pide === 'distancia' ? 'DX-RESTA' : 'DX-SUMA', siFuera: pide === 'distancia' ? 'Eso es el desplazamiento: la distancia no resta lo que retrocede.' : 'Eso es la distancia: el desplazamiento resta lo que retrocede.' },
            { id: 'solo-ida', valor: A1, error: 'DX-IDA', siFuera: 'Eso es solo el primer tramo. Falta el área bajo el eje.' },
            { id: 'alturas', valor: v1 + v2, error: 'DX-ALTURA', siFuera: 'Eso suma alturas de la gráfica, no áreas.' },
            { id: 'negativo', valor: A2 - A1, error: 'DX-SIGNO', siFuera: 'Eso invierte el signo: lo de arriba es avanzar.' },
          ], n => `${f(n)} m`).slice(0, 4),
          solucion: {
            texto: pide === 'distancia' ? 'Las dos áreas suman.' : 'El área de arriba menos la de abajo.',
            ecuacion: pide === 'distancia' ? [`d = ${f(A1)} + ${f(A2)} = ${f(A1 + A2)} m`] : [dx, ` = ${f(A1)} − ${f(A2)} = ${f(A1 - A2)} m`],
            dibujo: { datos: idaVuelta(v1, t1, v2, t2, true), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 5: encuentros y velocidad relativa ----------
  // Cambia: las rapideces de A y B · Permanece: la separación inicial (24 m) y el reloj común ·
  // Progresa: las marcas de cada segundo, que cierran la brecha · Se reserva: el cruce de las dos rectas x–t ·
  // Debe verse: en el encuentro coinciden las posiciones, no las velocidades.
  const SEP = 24, LARGO_E = 30;
  const vA = { v: 'c-o', t: 'v_A' };
  const tEnc = (va, vb, d = SEP) => (va - vb > 0 ? d / (va - vb) : Infinity);
  const pistaEnc = (va, vb, conEnc = true, d = SEP, largo = LARGO_E) => {
    const te = tEnc(va, vb, d), tm = Number.isFinite(te) ? Math.min(te, 6) : 6;
    const ks = Array.from({ length: Math.floor(tm + 1e-9) + 1 }, (_, k) => k);
    const ma = ks.map(k => va * k).filter(m => m >= 0 && m <= largo), mb = ks.map(k => d + vb * k).filter(m => m >= 0 && m <= largo);
    const xa = Math.min(largo, va * tm), xb = Math.max(0, Math.min(largo, d + vb * tm));
    return {
      datos: {
        largo, cada: 6,
        carriles: [{ x: xa, variante: 'a', marcas: ma, rotulo: 'A' }, { x: xb, variante: 'b', marcas: mb, rotulo: 'B' }],
        encuentro: conEnc && Number.isFinite(te) && va * te <= largo ? { x: va * te, rotulo: `${f(te, 2)} s` } : null,
      }, estado: {},
    };
  };
  // Animación: el reloj corre de 0 a 6 s a velocidad real. Cada carrito está en x = x₀ + v·t y deja la marca de cada
  // segundo; la línea del encuentro aparece cuando t llega a tₑ. Fuera de la pista, el carrito se queda en el borde.
  const T_ENC = 6;
  const momentoEnc = (va, vb, tt) => {
    const tm = Math.max(0, Math.min(tt, T_ENC)), xa = va * tm, xb = SEP + vb * tm;
    return { tm, xa, xb, te: tEnc(va, vb) };
  };
  const pistaEncT = (va, vb, tt) => {
    const q = momentoEnc(va, vb, tt), en = m => m >= 0 && m <= LARGO_E;
    const ks = Array.from({ length: Math.floor(q.tm + 1e-9) + 1 }, (_, k) => k);
    const llega = Number.isFinite(q.te) && q.te <= q.tm + 1e-9 && va * q.te <= LARGO_E;
    return {
      datos: {
        largo: LARGO_E, cada: 6,
        carriles: [
          { x: Math.max(0, Math.min(LARGO_E, q.xa)), variante: 'a', marcas: ks.map(k => va * k).filter(en), rotulo: 'A' },
          { x: Math.max(0, Math.min(LARGO_E, q.xb)), variante: 'b', marcas: ks.map(k => SEP + vb * k).filter(en), rotulo: 'B' },
        ],
        encuentro: llega ? { x: va * q.te, rotulo: `${f(q.te, 2)} s` } : null,
      }, estado: {},
    };
  };
  const encuentro = {
    id: 'encuentro',
    titulo: 'Encontrarse es estar juntos',
    temas: ['MRU y velocidad relativa', 'Posición, desplazamiento y distancia'],
    pieza: 'pista',
    juega: {
      consigna: 'A sale de 0 y B de 24 m a la vez. Elige sus velocidades (negativa: a la izquierda) y mira cerrarse la brecha.',
      voz: 'Mira cuánto se acorta la distancia entre ellos cada segundo.',
      controles: [
        { id: 'va', etiqueta: 'v de A', color: 'c-o', min: 1, max: 6, paso: 1, inicio: 3, unidad: 'm/s', decimales: 0 },
        { id: 'vb', etiqueta: 'v de B', min: -4, max: 4, paso: 1, inicio: -1, unidad: 'm/s', decimales: 0 },
        { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: T_ENC + 0.5, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: val => pistaEncT(val.va, val.vb, val.t),
      lectura: val => {
        const vr = val.va - val.vb, q = momentoEnc(val.va, val.vb, val.t), reloj = [t, ` = ${f(q.tm, 1)} s · `];
        if (vr <= 0) return [...reloj, `brecha ${f(Math.abs(q.xb - q.xa), 1)} m: no se acercan`];
        if (q.tm >= q.te) return [...reloj, `se cruzaron en ${f(q.te, 2)} s`];
        return [...reloj, `brecha ${f(q.xb - q.xa, 1)} m · se acercan ${f(vr)} m/s`];
      },
      minimo: 3,
      // Arrastra la marca de 1 s de cada carrito: lo que avanzó en ese segundo es su velocidad.
      arrastres: [
        { id: 'marca-a', etiqueta: 'marca de 1 s de A', color: 'c-o',
          donde: val => ({ x: PISTA().escala(pistaEnc(val.va, val.vb).datos, val.va), y: PISTA().geometria(pistaEnc(val.va, val.vb).datos).piso(0) + 6 }),
          mover: (pt, val) => ({ va: inversa(m => PISTA().escala(pistaEnc(val.va, val.vb).datos, m), 0, LARGO_E)(pt.x) }) },
        { id: 'marca-b', etiqueta: 'marca de 1 s de B',
          donde: val => ({ x: PISTA().escala(pistaEnc(val.va, val.vb).datos, SEP + val.vb), y: PISTA().geometria(pistaEnc(val.va, val.vb).datos).piso(1) + 6 }),
          mover: (pt, val) => ({ vb: inversa(m => PISTA().escala(pistaEnc(val.va, val.vb).datos, m), 0, LARGO_E)(pt.x) - SEP }) },
      ],
    },
    predice: {
      pregunta: 'A sale de x = 0 a 4 m/s hacia la derecha. B sale a la vez de x = 18 m a 2 m/s hacia la izquierda. ¿En qué instante se encuentran?',
      opciones: [
        { id: 'c', texto: '3 s', correcta: true },
        { id: 'resta', texto: '9 s', error: 'VR-RESTA', siFuera: 'Restar 4 − 2 sería cierto si fueran al mismo lado. Aquí van uno hacia el otro.' },
        { id: 'solo-a', texto: '4,5 s', error: 'VR-UNO', siFuera: 'Ese es el tiempo de A si B se quedara quieto en 18 m.' },
        { id: 'velocidad', texto: 'Cuando tengan la misma velocidad', error: 'K1', siFuera: 'Igual velocidad dice que no se acercan más. Encontrarse es tener la misma posición.' },
      ],
      dibujo: pistaEnc(4, -2, false, 18, 20),
      revelar: pistaEnc(4, -2, true, 18, 20),
      coincide: 'Coincide: se acercan 4 + 2 = 6 m cada segundo, y había 18 m entre ellos.',
    },
    // Hallazgo 9: el juego usa la pista y «Mira» la gráfica x–t: cada carrito es una recta y el encuentro de la pista es
    // el cruce; lo que en la pista se ve como marcas que se acercan, aquí se ve como la brecha entre las rectas.
    mira: {
      pieza: 'ejes',
      datos: {
        x: { min: 0, max: 5, paso: 1, nombre: 't', unidad: 's', decimales: 0, color: 'h' },
        y: { min: 0, max: 20, paso: 6, nombre: 'x', unidad: 'm', decimales: 0, color: 'i' },
        curvas: [{ puntos: [[0, 0], [5, 20]], color: 'o', rotulo: 'A', desde: 1 }, { puntos: [[0, 18], [5, 8]], color: 'h', rotulo: 'B', desde: 1 }],
        puntos: [{ x: 0, y: 18, color: 'h', rotulo: '18 m', desde: 1 }, { x: 3, y: 12, color: 'i', rotulo: '(3 s; 12 m)', guias: true, desde: 3 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada recta es la posición de un carrito en el tiempo.', ecuacion: [{ sub: [x, 'A'] }, ' = 4', t, '   ·   ', { sub: [x, 'B'] }, ' = 18 − 2', t] },
        { estado: { corte: 2 }, texto: 'Cada segundo la brecha baja 4 + 2 = 6 m.', ecuacion: [{ sub: [v, 'A/B'] }, ' = 4 − (−2) = 6 m/s'] },
        { estado: { corte: 3 }, texto: 'Se encuentran donde las rectas se cruzan: misma x, mismo t.', ecuacion: [t, ' = ', { frac: ['18', '6'] }, ' = 3 s', '   ·   ', x, ' = 12 m'] },
        { estado: { corte: 3 }, texto: 'En el cruce las pendientes son distintas: sus velocidades no son iguales.', ecuacion: [{ sub: [v, 'A'] }, ' = 4 m/s ≠ ', { sub: [v, 'B'] }, ' = −2 m/s'] },
      ],
    },
    regla: {
      texto: 'Dos móviles se encuentran cuando están en la misma posición en el mismo instante. La brecha se cierra con la velocidad relativa.',
      ecuacion: [{ sub: [t, 'e'] }, ' = ', { frac: ['d', { sub: [v, 'A/B'] }] }, '   ·   ', { sub: [v, 'A/B'] }, ' = ', { llave: [{ sub: [v, 'A'] }, ' − ', { sub: [v, 'B'] }], nota: 'con su signo', color: 'c-o' }],
      condicion: 'los dos salen a la vez, en MRU y sobre el mismo eje. Si la brecha no se achica, no se encuentran.',
    },
    ahoraTu: {
      pieza: 'pista',
      generar(s) {
        const r = azar(s), opuesto = s % 2 === 0;
        const va = r.ent(3, 7), vb = (opuesto ? -1 : 1) * r.ent(1, Math.min(4, va - 1));
        const vr = va - vb, te = r.ent(2, 5), d = vr * te, xe = va * te;
        const largo = Math.ceil(Math.max(d, xe) / 10) * 10 + 10;
        const cuenta = opuesto ? `${f(va)} + ${f(-vb)}` : `${f(va)} − ${f(vb)}`;
        return {
          pregunta: `A sale de x = 0 a ${f(va)} m/s hacia la derecha. B sale a la vez de x = ${f(d)} m a ${f(Math.abs(vb))} m/s hacia ${opuesto ? 'la izquierda' : 'la derecha'}. ¿Cuándo se encuentran?`,
          dibujo: { datos: { largo, cada: 10, carriles: [{ x: 0, variante: 'a', marcas: [], rotulo: 'A' }, { x: d, variante: 'b', marcas: [], rotulo: 'B' }] }, estado: {} },
          opciones: opciones(te, [
            { id: 'cambio', valor: d / (va + vb), error: opuesto ? 'VR-RESTA' : 'VR-SUMA', siFuera: opuesto ? 'Restar rapideces sirve si van al mismo lado.' : 'Sumar rapideces sirve si van uno hacia el otro.' },
            { id: 'solo-a', valor: d / va, error: 'VR-UNO', siFuera: 'Ese sería el tiempo si B se quedara quieto.' },
            { id: 'pos', valor: xe, error: 'VR-POSICION', siFuera: 'Ese número es la posición del encuentro, en metros.' },
          ], n => `${f(n, 2)} s`),
          solucion: {
            texto: opuesto ? 'Van uno hacia el otro: la brecha se cierra con la suma.' : 'Van al mismo lado: la brecha se cierra con la diferencia.',
            ecuacion: [{ sub: [t, 'e'] }, ` = ${f(d)} / (${cuenta}) = ${f(te)} s`],
            dibujo: { datos: { largo, cada: 10, carriles: [{ x: xe, variante: 'a', marcas: [], rotulo: 'A' }, { x: xe, variante: 'b', marcas: [], rotulo: 'B' }], encuentro: { x: xe, rotulo: `${f(xe)} m` } }, estado: {} },
          },
        };
      },
    },
  };

  // Un color fijo por magnitud en las dos unidades del movimiento rectilíneo (cabecera; propuesta §6).
  const COLORES = { velocidad: 'o', tiempo: 'i', posición: 'f', desplazamiento: 'f', separación: 'f', aceleración: 'h' };

  return {
    unidad: 'fisica.movimiento-rectilineo',
    version: '0.3.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/pista.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/fis-combi.js', '/nucleo/kit/piezas/fis-sonido.js'],
    colores: COLORES,
    // En una recta, las magnitudes con dirección son números con signo (decisiones, 18 nov): la unidad no escribe «⃗».
    notacion: { vectores: false, motivo: 'En una recta, v, a y Δx son números con signo sobre el eje: el signo hace de flecha. La flecha se dibuja sobre la combi y el eje lleva su «+».' },
    // Glosario del tema (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso. «desplazamiento» y
    // «distancia recorrida» se estrenan en Vectores; aquí el lector las marca igual, con «Viene de Vectores».
    // «aceleración», «caída libre» y «gravedad» se fueron con MRUV y caída libre.
    glosario: [
      { termino: 'posición', simbolo: 'x', medida: 'm', def: 'Dónde está el móvil sobre la recta, contado desde el cero, con su signo.',
        simple: 'En qué marca de la regla está, contando desde el cero.',
        ejemplos: ['x = 60 m: la combi está 60 m a la derecha del paradero.', 'x = −20 m: está 20 m a la izquierda del paradero.', 'x = 0: está justo en el paradero.'],
        ver: ['desplazamiento'] },
      { termino: 'velocidad', simbolo: 'v', medida: 'm/s', def: 'Cuánto cambia la posición en cada segundo. Su signo dice hacia dónde va.',
        simple: 'Cuántos metros se mueve en cada segundo, y hacia qué lado.',
        ejemplos: ['v = 15 m/s: cada segundo avanza 15 m hacia la derecha.', 'v = −8 m/s: cada segundo se mueve 8 m hacia la izquierda.', '54 km/h es lo mismo que 15 m/s.'],
        ver: ['rapidez'] },
      { termino: 'rapidez', medida: 'm/s', def: 'Qué tan rápido va, sin importar el sentido: la velocidad sin su signo.',
        simple: 'Qué tan rápido va, sin mirar hacia qué lado.',
        ejemplos: ['Con v = −8 m/s, la rapidez es 8 m/s.', 'Dos combis a 15 m/s en sentidos contrarios van con la misma rapidez.', 'El velocímetro de una combi marca su rapidez, en km/h.'],
        formas: ['rapidez', 'rapideces'], ver: ['velocidad'] },
      { termino: 'MRU', def: 'Movimiento rectilíneo uniforme: en línea recta y con velocidad constante, avanzando lo mismo cada segundo.',
        simple: 'Ir en línea recta sin acelerar ni frenar.',
        ejemplos: ['Una combi que va siempre a 15 m/s por una avenida recta.', 'Un ciclista que hace 5 m en cada segundo, sin parar.', 'No es MRU: una combi que frena al llegar al paradero.'],
        ver: ['velocidad'] },
      { termino: 'pendiente', def: 'Cuánto sube una recta por cada paso hacia la derecha. En la gráfica v–t es la aceleración.',
        ver: ['aceleración'] },
      { termino: 'instante', simbolo: 't', medida: 's', def: 'Un momento preciso del tiempo, como «a los 3 s».' },
      { termino: 'velocidad relativa', def: 'Cómo se mueve un móvil visto desde el otro: la diferencia de sus velocidades.',
        formas: ['velocidad relativa', 'velocidades relativas'], ver: ['velocidad'] },
    ],
    // Laboratorio: juego libre, sin preguntas. La pista con acelerador, «Ida y vuelta en v–t» y «La recta v–t» se fueron
    // con MRUV y caída libre (son de la aceleración y de la gráfica v–t).
    laboratorio: [
      {
        // Encuentro libre: además de las dos velocidades, la brecha inicial; las tres se arrastran sobre la pista.
        id: 'encuentro-libre', titulo: 'Encuentro con brecha libre', pieza: 'pista',
        consigna: 'Arrastra la salida de B (sobre la regla) y la marca de 1 s de cada carrito. Busca un encuentro a los 4 s.',
        controles: [
          { id: 'd', etiqueta: 'B sale de', min: 12, max: 26, paso: 2, inicio: 24, unidad: 'm', decimales: 0 },
          { id: 'va', etiqueta: 'v de A', color: 'c-o', min: 1, max: 6, paso: 1, inicio: 3, unidad: 'm/s', decimales: 0 },
          { id: 'vb', etiqueta: 'v de B', min: -4, max: 4, paso: 1, inicio: -1, unidad: 'm/s', decimales: 0 },
        ],
        dibujo: val => pistaEnc(val.va, val.vb, true, val.d),
        lectura: val => {
          const vr = val.va - val.vb;
          return vr > 0 ? [`Brecha ${f(val.d)}\u00a0m, cierra ${f(vr)}\u00a0m/s: ${f(val.d / vr, 2)}\u00a0s, `, x, ` = ${f(val.va * val.d / vr, 2)}\u00a0m`] : [`Brecha ${f(val.d)}\u00a0m: no se acercan`];
        },
        arrastres: [
          { id: 'salida-b', etiqueta: 'salida de B', color: 'c-i',
            donde: val => ({ x: PISTA().escala(pistaEnc(val.va, val.vb, true, val.d).datos, val.d), y: PISTA().geometria(pistaEnc(val.va, val.vb, true, val.d).datos).regla }),
            mover: (pt, val) => ({ d: inversa(m => PISTA().escala(pistaEnc(val.va, val.vb, true, val.d).datos, m), 0, LARGO_E)(pt.x) }) },
          { id: 'marca-a', etiqueta: 'marca de 1 s de A', color: 'c-o',
            donde: val => ({ x: PISTA().escala(pistaEnc(val.va, val.vb, true, val.d).datos, val.va), y: PISTA().geometria(pistaEnc(val.va, val.vb, true, val.d).datos).piso(0) + 6 }),
            mover: (pt, val) => ({ va: inversa(m => PISTA().escala(pistaEnc(val.va, val.vb, true, val.d).datos, m), 0, LARGO_E)(pt.x) }) },
          { id: 'marca-b', etiqueta: 'marca de 1 s de B',
            donde: val => ({ x: PISTA().escala(pistaEnc(val.va, val.vb, true, val.d).datos, val.d + val.vb), y: PISTA().geometria(pistaEnc(val.va, val.vb, true, val.d).datos).piso(1) + 6 }),
            mover: (pt, val) => ({ vb: inversa(m => PISTA().escala(pistaEnc(val.va, val.vb, true, val.d).datos, m), 0, LARGO_E)(pt.x) - val.d }) },
        ],
      },
    ],
    // A qué idea pertenece cada mesa (Gerson, 16 nov). La historia de Galileo se fue con la caída libre (propuesta §8).
    laboratorioIdeas: {
      'encuentro-libre': ['encuentro'],
    },
    ideas: [mru, distancia, encuentro],
  };
});
