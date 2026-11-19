/*
 * Teoría de «Movimiento rectilíneo uniforme» (fisica.movimiento-rectilineo), para 5.º de secundaria y
 * preuniversitario. Molde: docs/teoria.md y docs/molde-unidad.md. Fuente del contenido: docs/teoria/matriz/fisica.json
 * (unidad 2) y docs/etapa4/propuesta-fisica.md (aprobada por Gerson con todas sus recomendaciones; docs/etapa4/decisiones.md).
 *
 * Partición (18 nov, Gerson; propuesta §1 y §9, pregunta 1): «MRU, MRUV y caída libre» se partió en dos, como
 * Magnitudes y Vectores. Esta unidad conserva el id (el avance de los alumnos se guarda con él) y sus ideas `mru` (A1),
 * `desplazamiento-distancia` (A3) y `encuentro` (A4), con la mesa `encuentro-libre`; estrena `grafica-xt` (A2) y
 * `velocidad-relativa` (A5). La aceleración, la gráfica v–t y la caída libre pasaron tal cual a
 * contenido/teoria/fisica/mruv-y-caida-libre.js (fisica.mruv-y-caida-libre), con las mesas `pista-libre`, `ida-vuelta` y
 * `recta-vt` y la historia de Galileo; Avance.migrar (nucleo/avance.js) mueve el avance de esas ideas, mesas y palabras.
 *
 * Etapa 4 del plan de calidad: la idea A1 tuvo el visto bueno de Gerson (fase 2, 18 nov) y las ideas A2 a A5 se
 * escribieron con su mismo estilo (fase 3, 18 nov). Con las cinco rehechas, la unidad declara calidad: 2.
 *   A1 `mru` «Velocidad constante: el MRU» ............ la combi en la avenida (fis-combi, vista avenida).
 *   A2 `grafica-xt` «La gráfica posición–tiempo» ...... la gráfica x–t que se dibuja junto a la combi (fis-xt).
 *   A3 `desplazamiento-distancia` «Velocidad media y rapidez media» ... la recta de la pista atlética (fis-pista).
 *   A4 `encuentro` «Encuentros y alcances» ............ la combi y el mototaxi entre el paradero y el mercado
 *                                                       (fis-combi con `segundo`); «Mira» con la gráfica x–t (fis-xt).
 *   A5 `velocidad-relativa` «Velocidad relativa» ...... la ventana de tu combi (fis-ventana) y el río en una recta (fis-rio).
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
 * Errores de A2 a A5: G2 (Beichner 1994) partido en G2-altura-entre-tiempo, G2-ultimo-punto y G2-pendiente-es-altura;
 *   K1 (Trowbridge y McDermott 1980); MED-PROMEDIO (trampa 10) y REL-SENTIDO (trampa 12) de las alternativas de San
 *   Marcos; los demás son hipótesis de diseño, en la sección «MRU (18 nov)» del informe de cinemática: XT-SIN-DIVIDIR,
 *   XT-SIGNO, XT-INVERSA, XT-LEIDO · DX-RAPIDEZ, DX-DISTANCIA, DX-IDA, MED-SUMA, MED-UN-TIEMPO, MED-CRUZADO, MED-TRAMO,
 *   MED-PROMEDIO-MITADES · VR-SUMA, VR-RESTA, VR-UNO, VR-POSICION, VR-RELOJ, VR-VENTAJA · REL-SIN-MARCO, REL-PITAGORAS,
 *   REL-SUMA, REL-SIGNO, REL-SOLO-A, REL-SOLO-RIO, REL-IDA.
 * Letras de A2 a A5 (propuesta §5): Δx el desplazamiento y Δt el intervalo; d la distancia recorrida, en tinta, con su
 *   aviso en «Lee» de A3 (en Vectores, la d con flecha era el desplazamiento en el plano); v_m la velocidad media y la
 *   rapidez media en palabras; x_A, x_B, v_A, v_B de cada móvil (A y B solo en las fórmulas: en un ejercicio con alternativas los
 *   móviles van con nombre, auditoría M4); D la separación; tₑ el instante del encuentro, también del alcance (la regla con
 *   signo de A4 es una sola); v_B/A la velocidad de B vista desde A; u la velocidad del bote respecto al agua y c la de la corriente, las dos
 *   con signo (+ río abajo) y nunca como rapidez: la línea de la academia va en palabras (cabos, 19 nov); L el
 *   largo de una combi o de una columna (violeta, como toda longitud sobre la recta). Dos móviles en la gráfica x–t: el
 *   mismo violeta, trazo continuo y discontinuo (Gerson, 18 nov).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
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
  // «x₀ = 90 m» con el subíndice de verdad, como en los datos (lector en frío, ronda 2: el «₀» del texto parecía una «o»).
  const x0v = s => [Mx0, ' = ', px(s)];
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
    eco: 'Eco: el sonido que se oye después de rebotar en el cerro.',
    luz: 'La luz del rayo llega casi de inmediato.',
    Dcerro: ['D: la distancia de la alumna al cerro.'],
    Drayo: ['D: la distancia de ti al lugar donde cayó el rayo.'],
  };
  // La letra de la alternativa en negrita (molde §3): la de `alt` en la lista `alts`, para que la respuesta y el resuelto
  // sigan a la alternativa aunque cambie de lugar. La correcta se reparte entre la A y la E (auditoría, 18 nov, M10).
  const letra = (alts, alt) => { const k = alts.indexOf(alt); if (k < 0) throw new Error(`«${alt}» no es alternativa`); return neg('ABCDE'[k]); };

  // Ejemplos resueltos de A1 (pestaña «Ejemplos»). Cuentas rehechas con un script aparte que no usa este archivo
  // (scratchpad e4-fis/cuentas-a1.js, 18 nov): 0 + 15·4; −30 + 10·6; 90 − 15·4; (30 − 100)/5; 84/12; 54/3,6 y 15·8;
  // (61 − 25)/3 y 25 + 12·10; 120/15 y 120 − 15·10; 2·60 y 12·120; 10 + 14·2, 10 + 14·5 y 80 − 38; 340·3/2;
  // 340·4; 72/3,6, 1,5·60 y 20·90; 12·10 y 120 − 8·5; 40 − 8·7 (18 nov, correcciones: las mismas cuentas; solo cambió
  // el lugar de la correcta entre las alternativas, recontado con letra()). Las figuras muestran lo que cada dato marca por sí solo
  // (la salida, la flecha de la velocidad dada, un lugar con nombre), nunca lo que sale de juntarlos (molde §3, 18 nov).
  const ALT_A1 = {
    eco: ['1020 m', '340 m', '113 m', '255 m', '510 m'],
    trueno: ['85 m', '680 m', '1360 m', '2720 m'],
    kmh: ['1,8 km', '108 m', '30 m', '6,48 km', '1,08 km'],
    regresa: ['En x = 160 m', 'En x = 40 m', 'En x = 120 m', 'En x = 80 m', 'En x = 20 m'],
    ecuacion: ['En x = 16 m, hacia la derecha', 'En x = −16 m, hacia la izquierda', 'En x = 96 m, hacia la derecha', 'En x = −56 m, hacia la izquierda', 'En x = 16 m, hacia la izquierda'],
  };
  const EJEMPLOS_MRU = [
    { nivel: 1, titulo: 'Desde el paradero',
      figura: avenida(Object.assign(regla(0, 80), { x0: 0, v: 15, segundos: 0, rotulos: false, lugares: PARADERO })),
      enunciado: ['Una combi sale del paradero hacia la derecha a ', pv('15 m/s'), ' y no cambia de velocidad. ¿Dónde está a los ', pt('4 s'), '?'],
      datos: [DM.pos, DM.eje],
      solucion: [{ texto: ['Sale de ', Mx0, ' = 0 y suma 15 m en cada uno de los 4 segundos.'], ecuacion: [Mx, ' = 0 + ', pv('15'), ' · ', pt('4'), ' = ', px('60 m')] }],
      respuesta: ['En ', px('x = 60 m'), ', a 60 m del paradero'] },
    { nivel: 1, titulo: 'Antes del paradero',
      figura: avenida(Object.assign(regla(-40, 60), { x0: -30, v: 10, segundos: 0, rotulos: false, signo: true, lugares: PARADERO, posiciones: [{ en: -30, texto: 'x₀', color: 'f' }] })),
      enunciado: ['Una combi está 30 m antes del paradero, en ', x0v('−30 m'), ', y avanza hacia la derecha a ', pv('10 m/s'), '. ¿Dónde está a los ', pt('6 s'), '?'],
      datos: [DM.pos, DM.eje],
      solucion: [{ texto: 'La salida es negativa: está a la izquierda del cero. Se le suma lo que avanza.', ecuacion: [Mx, ' = ', px('−30'), ' + ', pv('10'), ' · ', pt('6'), ' = ', px('30 m')] }],
      respuesta: ['En ', px('x = 30 m'), ': ya pasó el paradero'] },
    { nivel: 1, titulo: 'Hacia el paradero',
      figura: avenida(Object.assign(regla(0, 100), { x0: 90, v: -15, segundos: 0, rotulos: false, signo: true, lugares: PARADERO, posiciones: [{ en: 90, texto: 'x₀', color: 'f' }] })),
      enunciado: ['Una combi está en ', x0v('90 m'), ' y va hacia el paradero a ', pv('15 m/s'), ', sin cambiar de velocidad. ¿Dónde está a los ', pt('4 s'), '?'],
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
      enunciado: ['Una combi está en ', x0v('120 m'), ' y va hacia el paradero a ', pv('15 m/s'), ', sin cambiar de velocidad. ¿Cuándo pasa por el paradero? ¿Dónde está ', pt('2 s'), ' después?'],
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
      enunciado: ['Una combi sale de ', x0v('10 m'), ' hacia la derecha a ', pv('14 m/s'), '. ¿Dónde está a los ', pt('2 s'), ' y a los ', pt('5 s'), '? ¿Cuánto avanzó entre esos dos momentos?'],
      datos: [DM.pos, DM.eje],
      solucion: [
        { texto: 'La regla da la posición a los 2 s y a los 5 s.', ecuacion: [Mx, ' = 10 + 14 · 2 = ', px('38 m'), ';   ', Mx, ' = 10 + 14 · 5 = ', px('80 m')] },
        { texto: 'Lo que avanzó entre los dos es la resta de las posiciones:', ecuacion: [px('80'), ' − ', px('38'), ' = ', pdx('42 m')] },
      ],
      respuesta: ['En ', px('38 m'), ' y en ', px('80 m'), '; avanzó ', pdx('42 m')] },
    { nivel: 3, titulo: 'El eco en el cerro',
      figura: { pieza: 'fis-sonido', datos: { objeto: 'eco', v: '340 m/s', t: '3 s', distancia: 'D = ?' }, estado: {} },
      enunciado: ['Una alumna grita frente a un cerro y oye el eco ', pt('3 s'), ' después. ¿A qué distancia de ella está el cerro?'],
      alternativas: ALT_A1.eco,
      datos: [DM.sonido, DM.eco, DM.recorre, DM.Dcerro],
      solucion: [
        { texto: 'En 3 s el sonido va hasta el cerro y vuelve: hace el camino dos veces.', ecuacion: [pv('340 m/s'), ' · ', pt('3 s'), ' = 1020 m'] },
        { texto: 'El cerro está a la mitad de ese recorrido.', ecuacion: [MD, ' = 1020 m ÷ 2 = ', pD('510 m')] },
        { texto: ['La ', letra(ALT_A1.eco, '1020 m'), ', 1020 m, olvida que el eco va y vuelve.'] },
      ],
      respuesta: [letra(ALT_A1.eco, '510 m'), ', ', pD('510 m')] },
    { nivel: 3, titulo: 'El rayo y el trueno',
      figura: { pieza: 'fis-sonido', datos: { objeto: 'trueno', v: '340 m/s', t: '4 s', distancia: 'D = ?' }, estado: {} },
      enunciado: ['En una tarde de tormenta ves un rayo y oyes su trueno ', pt('4 s'), ' después. ¿A qué distancia de ti cayó el rayo?'],
      alternativas: ALT_A1.trueno,
      datos: [DM.sonido, DM.luz, DM.recorre, DM.Drayo],
      solucion: [
        { texto: 'La luz llegó casi al caer el rayo: los 4 s son lo que tardó el sonido.' },
        { texto: 'El sonido recorre la distancia una sola vez:', ecuacion: [MD, ' = ', pv('340 m/s'), ' · ', pt('4 s'), ' = ', pD('1360 m')] },
        { texto: ['La ', letra(ALT_A1.trueno, '680 m'), ' divide entre 2, como si fuera un eco; aquí no hay vuelta. La ', letra(ALT_A1.trueno, '85 m'), ' divide 340 entre 4.'] },
      ],
      respuesta: [letra(ALT_A1.trueno, '1360 m'), ', ', pD('1360 m')] },
    { nivel: 3, titulo: 'La combi a 72 km/h',
      figura: avenida(Object.assign(regla(0, 2000), { x0: 0, v: 20, flechaTexto: '72 km/h', segundos: 0, rotulos: false, lugares: PARADERO })),
      enunciado: ['Una combi pasa por el paradero a ', pv('72 km/h'), ' y mantiene esa velocidad. ¿A qué distancia del paradero está ', pt('1,5 min'), ' después?'],
      alternativas: ALT_A1.kmh,
      datos: [DM.pos, DM.kmh, DM.min, DM.eje],
      solucion: [
        { texto: 'Todo a metros y segundos.', ecuacion: [pv('72 km/h'), ' = ', { frac: ['72 000 m', '3600 s'] }, ' = ', pv('20 m/s'), ';   ', pt('1,5 min'), ' = 1,5 · 60 s = ', pt('90 s')] },
        { texto: ['Desde el paradero, ', Mx0, ' = 0:'], ecuacion: [Mx, ' = 0 + ', pv('20'), ' · ', pt('90'), ' = ', px('1800 m'), ' = ', px('1,8 km')] },
        { texto: ['La ', letra(ALT_A1.kmh, '108 m'), ' multiplica 72 por 1,5 sin pasar a metros y segundos; la ', letra(ALT_A1.kmh, '30 m'), ' deja los minutos.'] },
      ],
      respuesta: [letra(ALT_A1.kmh, '1,8 km'), ', ', px('1,8 km')] },
    { nivel: 3, titulo: 'Va y regresa',
      figura: avenida(Object.assign(regla(0, 140), { x0: 0, v: 12, segundos: 0, rotulos: false, signo: true, lugares: PARADERO })),
      enunciado: ['Una combi sale del paradero y va ', pt('10 s'), ' hacia la derecha a ', pv('12 m/s'), '; después regresa ', pt('5 s'), ' a ', pv('8 m/s'), '. ¿Dónde termina?'],
      alternativas: ALT_A1.regresa,
      datos: [DM.pos, DM.eje],
      solucion: [
        { texto: 'Primer tramo, desde el paradero:', ecuacion: [Mx, ' = 0 + ', pv('12'), ' · ', pt('10'), ' = ', px('120 m')] },
        { texto: ['Segundo tramo: sale de 120 m y regresa, ', pv('v = −8 m/s'), '.'], ecuacion: [Mx, ' = ', px('120'), ' + (', pv('−8'), ') · ', pt('5'), ' = ', px('80 m')] },
        { texto: ['La ', letra(ALT_A1.regresa, 'En x = 160 m'), ', 160 m, suma lo que regresó como si siguiera avanzando.'] },
      ],
      respuesta: [letra(ALT_A1.regresa, 'En x = 80 m'), ', en ', px('x = 80 m')] },
    { nivel: 3, titulo: 'La ecuación de la posición',
      figura: avenida(Object.assign(regla(-40, 60), { vehiculo: false, signo: true, lugares: PARADERO })),
      enunciado: ['La posición de una combi en la avenida es ', Mx, ' = ', px('40'), ' − ', pv('8'), Mt, ', con ', Mx, ' en metros y ', Mt, ' en segundos. ¿Dónde está a los ', pt('7 s'), ' y hacia dónde va?'],
      alternativas: ALT_A1.ecuacion,
      datos: [DM.pos, DM.eje],
      solucion: [
        { texto: ['Se compara con ', Mx, ' = ', Mx0, ' + ', Mv, ' · ', Mt, ': sale de 40 m y su velocidad es −8 m/s.'], ecuacion: [Mx0, ' = ', px('40 m'), ';   ', Mv, ' = ', pv('−8 m/s')] },
        { texto: 'A los 7 s:', ecuacion: [Mx, ' = ', px('40'), ' − ', pv('8'), ' · ', pt('7'), ' = ', px('−16 m')] },
        { texto: ['v es negativa: va hacia la izquierda, y ya pasó el paradero. La ', letra(ALT_A1.ecuacion, ALT_A1.ecuacion[0]), ' pierde el signo.'] },
      ],
      respuesta: [letra(ALT_A1.ecuacion, ALT_A1.ecuacion[1]), ', ', px('x = −16 m'), ', hacia la izquierda'] },
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
        // Las manijas (ronda 2: «no sé qué es el círculo naranja»).
        { s: 'círculo lila', t: 'arrástralo: cambia de dónde sale' },
        { s: 'círculo naranja', t: 'arrástralo: dónde está a los 5 s' },
      ],
      controles: [
        { id: 'x0', etiqueta: 'Sale de, x₀', color: 'c-f', min: 0, max: 40, paso: 10, inicio: 0, unidad: 'm', decimales: 0 },
        { id: 'v', etiqueta: 'Velocidad, v', color: 'c-o', min: 2, max: 20, paso: 2, inicio: 8, unidad: 'm/s', decimales: 0 },
        { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: T_A1 + 0.5, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: juegoA1,
      // La lectura sigue al reloj (lector en frío, 18 nov: daba la posición a los 5 s con el reloj en 0,34 s).
      // El reloj se lee con dos decimales y la cuenta sale de ese mismo t (ronda 2: 8 · 0,32 se veía como 2,57).
      lectura: val => { const tt = Math.round(Math.max(0, Math.min(val.t, T_A1)) * 100) / 100; return ['A los ', pt(`${f(tt)} s`), ' está en ', px(`${f(val.x0 + val.v * tt)} m`), ': ', px(fm(val.x0)), ' + ', pv(fm(val.v)), ' · ', pt(f(tt))]; },
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
      datos: [DM.eje],
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
      texto: 'En el MRU, la posición cambia igual cada segundo; el signo de v da el sentido. La academia escribe x = x₀ ± v · t: igual, con el signo fuera de v.',
      ecuacion: [Mx, ' = ', { llave: [Mx0], nota: 'dónde estaba en t = 0', color: 'c-f' }, ' + ', { llave: [Mv, ' · ', Mt], nota: 'cuánto se movió, con su signo', color: 'c-f' }],
      condicion: 'v no cambia en todo el tramo, y t se cuenta desde que la combi estaba en x₀.',
      // Con los rótulos «0 s… 5 s» bajo las rayitas: cada una es lo que se mueve en un segundo (ronda 2: «no tienen rótulo»).
      dibujo: avenida(Object.assign(regla(-20, 100), { x0: 80, v: -12, segundos: 5, signo: true, rotulos: true,
        llaves: [{ de: 0, a: 80, texto: 'x₀', color: 'f', fila: 1 }, { de: 80, a: 20, texto: 'v · t = −60 m', color: 'f' }], posiciones: [{ en: 20, texto: 'x', color: 'f' }] })),
    },
    resuelve: {
      pieza: 'fis-combi',
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const xi = r.ent(0, 3) * 10, vi = r.ent(6, 15), T = r.ent(4, 9), xg = xi + vi * T;
          return {
            enunciado: ['La combi sale de ', x0v(`${fm(xi)} m`), ' hacia la derecha a ', pv(`${fm(vi)} m/s`), ', sin cambiar de velocidad. El grifo está en ', px(`x = ${fm(xg)} m`), '. ¿Cuánto tarda en llegar?'],
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
            pregunta: ['Una combi sale de ', x0v(`${fm(xi)} m`), ' hacia la derecha a ', pv(`${fm(vi)} m/s`), ', sin cambiar de velocidad. ¿Dónde está a los ', pt(`${fm(ti)} s`), '?'],
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
            pregunta: ['Una combi está en ', x0v(`${fm(xi)} m`), ' y va hacia el paradero a ', pv(`${fm(rr)} m/s`), ', sin cambiar de velocidad. ¿Dónde está ', pt(`${fm(ti)} s`), ' después?'],
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
            pregunta: ['Una combi pasa por ', x0v(`${fm(xi)} m`), ' a ', pv(`${fm(kmh)} km/h`), ' hacia la derecha y no cambia de velocidad. ¿Dónde está ', pt(`${fm(ti)} s`), ' después?'],
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

  // ---------- Fichas y datos de las ideas A2 a A5 (un color fijo por magnitud, como en A1) ----------
  const sub = (b, i) => ({ sub: [b, i] });
  const MDx = { v: 'c-f', t: 'Δx', m: 'desplazamiento' }, MDt = { v: 'c-i', t: 'Δt', m: 'tiempo' };
  const Mx1 = sub(Mx, '1'), Mx2 = sub(Mx, '2'), Mt1 = sub(Mt, '1'), Mt2 = sub(Mt, '2');
  const Mvm = sub(Mv, 'm'), Mrm = { v: 'c-o', t: 'rapidez media', m: 'velocidad' };
  const MxA = sub(Mx, 'A'), MxB = sub(Mx, 'B'), MvA = sub(Mv, 'A'), MvB = sub(Mv, 'B'), MvBA = sub(Mv, 'B/A');
  // tₑ, el instante del encuentro, sirve para el cruce y para el alcance (la regla con signo de A4 es una sola).
  const Mte = sub(Mt, 'e'), Mtalc = Mte;
  const Mu = { v: 'c-o', t: 'u', m: 'velocidad' }, Mc = { v: 'c-o', t: 'c', m: 'velocidad' }, ML = { v: 'c-f', t: 'L', m: 'largo' };
  const pL = s => ({ v: 'c-f', t: String(s), m: 'largo' });
  const frac = (a, b) => ({ frac: [a, b] });
  Object.assign(DM, {
    xt: ['Velocidad en la gráfica x–t: ', Mv, '\u00a0=\u00a0', frac([Mx2, ' − ', Mx1], [Mt2, ' − ', Mt1])],
    ejes: 'En la gráfica, x va en metros y t en segundos.',
    vm: ['Velocidad media: ', Mvm, '\u00a0=\u00a0', frac(MDx, MDt), ', con ', MDx, ' = posición final − posición inicial'],
    rm: ['Rapidez media\u00a0=\u00a0', frac('d', MDt), ', con d la distancia recorrida: todo el camino, sin signo'],
    tramo: 'Tiempo de un tramo con rapidez constante: distancia ÷ rapidez.',
    // Con tₑ dicho en palabras (ronda 2, ejemplo «En minutos»: «no sé qué significa la e»).
    encuentro: 'Dos móviles se encuentran cuando están en la misma posición en el mismo instante; tₑ es ese instante.',
    // La rapidez de acercamiento (auditoría, M9): el resuelto la usa, así que está en los datos y en la regla.
    cierre: 'Cada segundo, la separación cambia la suma de las rapideces si van de frente, y su diferencia si van al mismo lado.',
    // Un solo significado por letra en A5 (cabos de la Etapa 4, 19 nov): u y c son velocidades con signo, como en la
    // regla. En los problemas de dos viajes, u es la del viaje río abajo y la del viaje río arriba, remando igual, es −u.
    uc: [Mu, ': velocidad del bote respecto al agua, río abajo; río arriba, remando igual, es −', Mu, '. ', Mc, ': velocidad de la corriente.'],
    rel: ['Velocidad de B vista desde A: ', MvBA, ' = ', MvB, ' − ', MvA, ', cada una con su signo'],
    orilla: 'Velocidad desde la orilla = velocidad respecto al agua + velocidad del agua, con su signo.',
    rio: 'Río abajo es el sentido +; la corriente va río abajo.',
    ejeCarretera: 'En la carretera, + hacia la derecha y − hacia la izquierda.',
  });

  // ---------- Idea 2 (A2): la gráfica posición–tiempo (18 nov, contrato «se entiende sin profesor») ----------
  // Pieza fis-xt: la combi en la avenida y, debajo, su gráfica x–t que se dibuja sola, un punto por segundo.
  // Cambia: la velocidad de la combi (también negativa) · Permanece: la salida en el paradero (x₀ = 0) y el grifo
  // (4 s; 60 m) · Progresa: el reloj, que deja un punto por segundo · Se reserva: la recta que no sale del cero (solo en
  // Predice) · Debe verse: lo que sube la recta en cada segundo es lo que avanza la combi.
  const XT = () => Kit.piezas['fis-xt'];
  const xt = (d, estado = {}) => ({ pieza: 'fis-xt', datos: d, estado });
  // El plano de una figura: el eje del tiempo hasta tmax y el de la posición de lo a hi, con números legibles.
  const plano = (tmax, lo, hi) => {
    const R = hi - lo, numero = [5, 10, 20, 25, 50, 100, 200, 250, 500, 1000].find(k => R / k <= 5) || 2000;
    const tp = tmax <= 10 ? 1 : tmax <= 30 ? 5 : 10;
    return { t: { max: tmax, paso: tp }, x: { min: lo, max: hi, paso: numero / 2, numero } };
  };
  const T_A2 = 5, PLANO_A2 = { t: { max: 5, paso: 1 }, x: { min: -100, max: 100, paso: 25, numero: 50 } };
  const AV_A2 = Object.assign(regla(-100, 100), { signo: true, segundos: 0, rotulos: false, fantasmas: false,
    lugares: [{ en: 0, texto: 'Paradero', lado: 'izq' }, { en: 60, texto: 'Grifo' }] });
  const GRIFO = { t: 4, x: 60, texto: 'Grifo', marca: 'aro', lado: 'izq' };
  const juegoA2 = val => xt(Object.assign({ avenida: Object.assign({}, AV_A2, { x0: 0, v: val.v }) }, PLANO_A2, {
    lineas: [{ puntos: [[0, 0], [T_A2, T_A2 * val.v]], segundos: true }], puntos: [GRIFO], instante: Math.max(0, Math.min(val.t, T_A2)) }));
  // Predice y Mira: un ciclista cuya recta pasa por (2 s; 26 m) y (5 s; 38 m): no sale del cero (el juego no lo mostró).
  const CICLISTA = Object.assign({ t: { max: 7, paso: 1 }, x: { min: 0, max: 60, paso: 10, numero: 20 } }, {
    lineas: [{ puntos: [[0, 18], [7, 46]] }],
    puntos: [{ t: 2, x: 26, texto: '(2 s; 26 m)', lado: 'abajoDer' }, { t: 5, x: 38, texto: '(5 s; 38 m)', lado: 'arribaIzq' }],
  });
  // Con el escalón, los nombres de los dos puntos se van (en «Mira», después del primer paso): quedan Δt y Δx.
  const conEscalon = (d, desde = 0, desdeX = 0) => Object.assign({}, d, {
    puntos: [...d.puntos.map(p => ({ t: p.t, x: p.x })), ...(desde ? d.puntos.map(p => Object.assign({}, p, { hasta: 0 })) : [])],
    escalon: { de: [2, 26], a: [5, 38], dt: 'Δt = 3 s', dx: 'Δx = 12 m', desde, desdeX } });

  // Ejemplos resueltos de A2. Cuentas rehechas con un script aparte que no usa este archivo (scratchpad f3w/cuentas.js,
  // 18 nov): 48/4; (10 − 60)/5; (30 − 30)/6; 20 + 5·4; 20/2 y 30/5; (26 − 14)/3; (50 − 30)/4 y 30 − 5·2; 6000/600;
  // 40/4 y (10 − 40)/6; (34 − 10)/3 y (90 − 10)/8; 40/5 y (70 − 100)/5; (30 − 10)/4 y 5·10; (30 + 20)/5;
  // 300/20 y 15·3,6. Las figuras muestran lo que cada dato marca (los puntos dados, el tramo dado), nunca la recta
  // extendida hasta lo que se pide ni la pendiente calculada (molde §3, 18 nov).
  const ALT_A2 = {
    // Los móviles con nombre (auditoría, M4): «A» y «B» son las letras de las alternativas.
    dos: ['Combi: 8 m/s; mototaxi: 6 m/s', 'Combi: 8 m/s; mototaxi: 14 m/s', 'Combi: 40 m/s; mototaxi: 70 m/s', 'Combi: 8 m/s; mototaxi: −6 m/s', 'Combi: −8 m/s; mototaxi: 6 m/s'],
    sigue: ['50 m', '30 m', '60 m', '75 m', '20 m'],
    forma: ['Sube, queda horizontal y sube más', 'Una cuesta: sube y baja sin parar', 'Horizontal y después baja hasta x = 0', 'Baja, queda horizontal y sube', 'Sube, queda horizontal y baja hasta x = 0'],
    ecuacion: ['x = 30 + 10t', 'x = −20 + 6t', 'x = −20 + 10t', 'x = 20 + 10t', 'x = −20 − 10t'],
    kmh: ['15 km/h', '54 km/h', '4,17 km/h', '300 km/h', '1080 km/h'],
  };
  const EJEMPLOS_XT = [
    { nivel: 1, titulo: 'Desde el paradero',
      figura: xt(Object.assign(plano(5, 0, 60), { lineas: [{ puntos: [[0, 0], [4, 48]] }], puntos: [{ t: 4, x: 48, texto: '(4 s; 48 m)', lado: 'arribaIzq' }] })),
      enunciado: ['La gráfica x–t de una combi es una recta que sale de (0 s; 0 m) y pasa por (4 s; 48 m). ¿Qué velocidad lleva?'],
      datos: [DM.xt, DM.ejes],
      solucion: [{ texto: 'En 4 s la posición sube 48 m: lo que sube entre lo que tarda.', ecuacion: [Mv, ' = ', frac([px('48'), ' − ', px('0')], [pt('4'), ' − ', pt('0')]), ' = ', pv('12 m/s')] }],
      respuesta: [pv('v = 12 m/s')] },
    { nivel: 1, titulo: 'Una recta que baja',
      figura: xt(Object.assign(plano(5, 0, 80), { lineas: [{ puntos: [[0, 60], [5, 10]] }], puntos: [{ t: 0, x: 60, texto: '(0 s; 60 m)', lado: 'arribaDer' }, { t: 5, x: 10, texto: '(5 s; 10 m)', lado: 'abajoIzq' }] })),
      enunciado: ['La gráfica x–t de una combi baja en línea recta de (0 s; 60 m) a (5 s; 10 m). ¿Qué velocidad lleva, con su signo?'],
      datos: [DM.xt, DM.ejes],
      solucion: [{ texto: 'La posición baja: el cambio de x es negativo, y la velocidad también.', ecuacion: [Mv, ' = ', frac([px('10'), ' − ', px('60')], [pt('5'), ' − ', pt('0')]), ' = ', pv('−10 m/s')] }],
      respuesta: [pv('v = −10 m/s'), ': va hacia el paradero'] },
    { nivel: 1, titulo: 'Una recta horizontal',
      figura: xt(Object.assign(plano(6, 0, 60), { lineas: [{ puntos: [[0, 30], [6, 30]] }], puntos: [{ t: 0, x: 30, texto: '(0 s; 30 m)', lado: 'arribaDer' }, { t: 6, x: 30, texto: '(6 s; 30 m)', lado: 'arribaIzq' }] })),
      enunciado: ['La gráfica x–t de un mototaxi es una recta horizontal: a los 0 s y a los 6 s está en x = 30 m. ¿Qué velocidad tiene?'],
      datos: [DM.xt, DM.ejes],
      solucion: [{ texto: 'La recta no sube ni baja: en 6 s, x no cambia.', ecuacion: [Mv, ' = ', frac([px('30'), ' − ', px('30')], [pt('6'), ' − ', pt('0')]), ' = ', pv('0 m/s')] }],
      respuesta: [pv('v = 0 m/s'), ': está quieto en 30 m'] },
    { nivel: 1, titulo: 'Un escalón por segundo',
      figura: xt(Object.assign(plano(5, 0, 60), { puntos: [{ t: 0, x: 20, texto: 'x₀', color: 'f', lado: 'arribaDer' }], escalon: { de: [0, 20], a: [1, 25], dt: '1 s', dx: '5 m' } })),
      enunciado: ['La gráfica x–t de una combi sale de x₀ = 20 m y sube 5 m en cada segundo. ¿Dónde está a los 4 s?'],
      datos: [DM.pos, DM.ejes],
      solucion: [{ texto: 'Sube 5 m por segundo: su velocidad es 5 m/s. En 4 s sube 20 m desde 20 m.', ecuacion: [Mx, ' = ', px('20'), ' + ', pv('5'), ' · ', pt('4'), ' = ', px('40 m')] }],
      respuesta: ['En ', px('x = 40 m')] },
    { nivel: 1, titulo: 'La más inclinada',
      figura: xt(Object.assign(plano(5, 0, 40), { lineas: [{ puntos: [[0, 0], [2, 20]], rotulo: 'combi' }, { puntos: [[0, 0], [5, 30]], trazo: 'discontinua', rotulo: 'mototaxi' }] })),
      enunciado: ['Una combi y un mototaxi salen del paradero. La recta de la combi pasa por (2 s; 20 m) y la del mototaxi, por (5 s; 30 m). ¿Cuál va más rápido?'],
      datos: [DM.xt, DM.ejes],
      solucion: [{ texto: 'La pendiente de cada recta es su velocidad: combi y mototaxi.', ecuacion: [frac(px('20'), pt('2')), ' = ', pv('10 m/s'), ';   ', frac(px('30'), pt('5')), ' = ', pv('6 m/s')] },
        { texto: 'La recta de la combi está más inclinada: sube más por cada segundo.' }],
      respuesta: ['La combi, a ', pv('10 m/s')] },
    { nivel: 2, titulo: 'No sale del cero',
      figura: xt(Object.assign(plano(5, 0, 40), { lineas: [{ puntos: [[0, 10], [5, 30]] }], puntos: [{ t: 1, x: 14, texto: '(1 s; 14 m)', lado: 'abajoDer' }, { t: 4, x: 26, texto: '(4 s; 26 m)', lado: 'abajoDer' }] })),
      enunciado: ['La recta x–t de un mototaxi pasa por (1 s; 14 m) y (4 s; 26 m). ¿Qué velocidad lleva?'],
      datos: [DM.xt, DM.ejes],
      solucion: [
        { texto: 'Entre los dos puntos pasan 3 s y la posición sube 12 m.', ecuacion: [MDt, ' = ', pt('4'), ' − ', pt('1'), ' = ', pt('3 s'), ';   ', MDx, ' = ', px('26'), ' − ', px('14'), ' = ', pdx('12 m')] },
        { texto: 'La pendiente es lo que sube entre lo que tarda. 26 ÷ 4 no sirve: la recta no sale del cero.', ecuacion: [Mv, ' = ', frac(pdx('12 m'), pt('3 s')), ' = ', pv('4 m/s')] },
      ],
      respuesta: [pv('v = 4 m/s')] },
    { nivel: 2, titulo: '¿Dónde empezó?',
      figura: xt(Object.assign(plano(7, 0, 60), { lineas: [{ puntos: [[2, 30], [6, 50]] }], puntos: [{ t: 2, x: 30, texto: '(2 s; 30 m)', lado: 'abajoDer' }, { t: 6, x: 50, texto: '(6 s; 50 m)', lado: 'abajoDer' }] })),
      enunciado: ['La recta x–t de una combi pasa por (2 s; 30 m) y (6 s; 50 m). ¿Dónde estaba a los 0 s?'],
      datos: [DM.xt, DM.pos],
      solucion: [
        { texto: 'Primero la velocidad: en 4 s sube 20 m.', ecuacion: [Mv, ' = ', frac([px('50'), ' − ', px('30')], [pt('6'), ' − ', pt('2')]), ' = ', pv('5 m/s')] },
        { texto: 'Desde los 2 s hasta los 0 s se retroceden 2 s de recta: 10 m menos.', ecuacion: [px('30'), ' = ', Mx0, ' + ', pv('5'), ' · ', pt('2'), '  →  ', Mx0, ' = ', px('20 m')] },
      ],
      respuesta: [x0v('20 m')] },
    { nivel: 2, titulo: 'Leer en kilómetros',
      figura: xt({ t: { max: 11, paso: 2, nombre: 't (min)' }, x: { min: 0, max: 8, paso: 1, numero: 2, nombre: 'x (km)' }, lineas: [{ puntos: [[0, 0], [10, 6]] }], puntos: [{ t: 10, x: 6, texto: '(10 min; 6 km)', lado: 'arribaIzq' }] }),
      enunciado: ['La recta x–t de una combi sale de (0 min; 0 km) y pasa por (10 min; 6 km). ¿Qué velocidad lleva, en m/s?'],
      datos: [DM.xt, '1 km = 1000 m', DM.min],
      solucion: [
        { texto: 'A metros y segundos: 6 km = 6000 m y 10 min = 600 s.' },
        { texto: 'La pendiente:', ecuacion: [Mv, ' = ', frac(pdx('6000 m'), pt('600 s')), ' = ', pv('10 m/s')] },
      ],
      respuesta: [pv('v = 10 m/s')] },
    { nivel: 2, titulo: 'Dos tramos en la gráfica',
      figura: xt(Object.assign(plano(10, 0, 50), { lineas: [{ puntos: [[0, 0], [4, 40], [10, 10]] }], puntos: [{ t: 4, x: 40, texto: '(4 s; 40 m)', lado: 'arriba' }, { t: 10, x: 10, texto: '(10 s; 10 m)', lado: 'abajo' }] })),
      enunciado: ['La gráfica x–t de un mototaxi sube en recta de (0 s; 0 m) a (4 s; 40 m) y baja en recta hasta (10 s; 10 m). ¿Su velocidad en cada tramo?'],
      datos: [DM.xt, DM.ejes],
      solucion: [
        { texto: 'Primer tramo: sube 40 m en 4 s.', ecuacion: [Mv, ' = ', frac(px('40'), pt('4')), ' = ', pv('10 m/s')] },
        { texto: 'Segundo tramo: baja 30 m en 6 s; la velocidad es negativa, regresa.', ecuacion: [Mv, ' = ', frac([px('10'), ' − ', px('40')], [pt('10'), ' − ', pt('4')]), ' = ', pv('−5 m/s')] },
      ],
      respuesta: [pv('10 m/s'), ' y después ', pv('−5 m/s')] },
    { nivel: 2, titulo: '¿Cuándo llega?',
      figura: xt(Object.assign(plano(12, 0, 100), { lineas: [{ puntos: [[0, 10], [3, 34]] }], puntos: [{ t: 0, x: 10 }, { t: 3, x: 34, texto: '(3 s; 34 m)', lado: 'abajoDer' }] })),
      enunciado: ['La recta x–t de una combi pasa por (0 s; 10 m) y (3 s; 34 m). Si sigue igual, ¿a qué instante llega a x = 90 m?'],
      datos: [DM.xt, DM.pos],
      solucion: [
        { texto: 'La pendiente: sube 24 m en 3 s.', ecuacion: [Mv, ' = ', frac([px('34'), ' − ', px('10')], pt('3')), ' = ', pv('8 m/s')] },
        { texto: 'Con la regla de la posición, se despeja t.', ecuacion: [px('90'), ' = ', px('10'), ' + ', pv('8'), Mt, '  →  ', Mt, ' = ', frac(pdx('80'), pv('8')), ' = ', pt('10 s')] },
      ],
      respuesta: ['A los ', pt('10 s')] },
    { nivel: 3, titulo: 'Dos rectas con signo',
      figura: xt(Object.assign(plano(5, 0, 100), { lineas: [{ puntos: [[0, 0], [5, 40]], rotulo: 'combi' }, { puntos: [[0, 100], [5, 70]], trazo: 'discontinua', rotulo: 'mototaxi' }] })),
      enunciado: ['En la gráfica x–t, la recta de una combi va de (0 s; 0 m) a (5 s; 40 m) y la de un mototaxi, de (0 s; 100 m) a (5 s; 70 m). ¿Qué velocidades tienen?'],
      alternativas: ALT_A2.dos,
      datos: [DM.xt, DM.ejes],
      solucion: [
        { texto: 'Cada pendiente, con su signo: la combi y el mototaxi.', ecuacion: [frac(px('40'), pt('5')), ' = ', pv('8 m/s'), ';   ', frac([px('70'), ' − ', px('100')], pt('5')), ' = ', pv('−6 m/s')] },
        { texto: ['La recta del mototaxi baja: va hacia el lado −. La ', letra(ALT_A2.dos, ALT_A2.dos[0]), ' pierde ese signo; la ', letra(ALT_A2.dos, ALT_A2.dos[2]), ' lee las alturas.'] },
      ],
      respuesta: [letra(ALT_A2.dos, ALT_A2.dos[3]), ', ', pv('8 m/s'), ' y ', pv('−6 m/s')] },
    { nivel: 3, titulo: 'Si la recta sigue',
      figura: xt(Object.assign(plano(10, 0, 80), { lineas: [{ puntos: [[0, 10], [4, 30]] }], puntos: [{ t: 0, x: 10 }, { t: 4, x: 30, texto: '(4 s; 30 m)', lado: 'abajoDer' }] })),
      enunciado: ['La gráfica x–t de un mototaxi solo llega hasta (4 s; 30 m); empieza en (0 s; 10 m). Si sigue igual, ¿qué distancia recorre en los primeros 10 s?'],
      alternativas: ALT_A2.sigue,
      datos: [DM.xt, 'Distancia recorrida: todo el camino, sin signo.'],
      solucion: [
        { texto: 'La pendiente: sube 20 m en 4 s.', ecuacion: [Mv, ' = ', frac([px('30'), ' − ', px('10')], pt('4')), ' = ', pv('5 m/s')] },
        { texto: 'En 10 s avanza 5 m cada segundo:', ecuacion: [pv('5 m/s'), ' · ', pt('10 s'), ' = 50 m'] },
        { texto: ['La ', letra(ALT_A2.sigue, '30 m'), ' es el último punto de la gráfica; la ', letra(ALT_A2.sigue, '60 m'), ' es su posición, no lo recorrido.'] },
      ],
      respuesta: [letra(ALT_A2.sigue, '50 m'), ', 50 m'] },
    { nivel: 3, titulo: 'Elegir la gráfica',
      figura: avenida(Object.assign(regla(0, 100), { x0: 0, v: 10, segundos: 0, rotulos: false, lugares: PARADERO })),
      enunciado: ['Una combi sale del paradero hacia la derecha a 10 m/s durante 6 s, se detiene 4 s y regresa al paradero a 15 m/s. ¿Cómo es su gráfica x–t?'],
      alternativas: ALT_A2.forma,
      datos: ['En la gráfica x–t, x va hacia arriba y t hacia la derecha.', DM.eje],
      solucion: [
        { texto: 'Mientras va hacia +, x crece: la recta sube. Quieta, x no cambia: tramo horizontal.' },
        { texto: 'Al regresar, x baja hasta 0, el paradero. La avenida es plana: la gráfica no es el camino.' },
        { texto: ['La ', letra(ALT_A2.forma, ALT_A2.forma[1]), ' dibuja una cuesta; la ', letra(ALT_A2.forma, ALT_A2.forma[0]), ' no regresa.'] },
      ],
      respuesta: [letra(ALT_A2.forma, ALT_A2.forma[4]), ': sube, horizontal y baja hasta ', px('x = 0')] },
    { nivel: 3, titulo: 'La ecuación de la recta',
      figura: xt(Object.assign(plano(6, -40, 40), { lineas: [{ puntos: [[0, -20], [5, 30]] }], puntos: [{ t: 0, x: -20, texto: '(0 s; −20 m)', lado: 'abajoDer' }, { t: 5, x: 30, texto: '(5 s; 30 m)', lado: 'arribaIzq' }] })),
      enunciado: ['La recta x–t de una combi pasa por (0 s; −20 m) y (5 s; 30 m). ¿Cuál es su ecuación de posición?'],
      alternativas: ALT_A2.ecuacion,
      datos: [DM.xt, DM.pos],
      solucion: [
        { texto: 'A los 0 s está en −20 m: esa es su salida.', ecuacion: [Mx0, ' = ', px('−20 m')] },
        { texto: 'La pendiente: sube 50 m en 5 s.', ecuacion: [Mv, ' = ', frac([px('30'), ' − (', px('−20'), ')'], [pt('5'), ' − ', pt('0')]), ' = ', pv('10 m/s')] },
        { texto: ['La ', letra(ALT_A2.ecuacion, ALT_A2.ecuacion[1]), ' divide 30 entre 5; la ', letra(ALT_A2.ecuacion, ALT_A2.ecuacion[0]), ' toma el último punto como salida.'] },
      ],
      respuesta: [letra(ALT_A2.ecuacion, ALT_A2.ecuacion[2]), ', ', Mx, ' = ', px('−20'), ' + ', pv('10'), Mt] },
    { nivel: 3, titulo: 'De la gráfica a km/h',
      figura: xt(Object.assign(plano(25, 0, 400), { lineas: [{ puntos: [[0, 0], [20, 300]] }], puntos: [{ t: 20, x: 300, texto: '(20 s; 300 m)', lado: 'arribaIzq' }] })),
      enunciado: ['La recta x–t de una combi sale de (0 s; 0 m) y pasa por (20 s; 300 m). ¿Cuál es su velocidad en km/h?'],
      alternativas: ALT_A2.kmh,
      datos: [DM.xt, DM.kmh],
      solucion: [
        { texto: 'La pendiente, en m/s:', ecuacion: [Mv, ' = ', frac(pdx('300 m'), pt('20 s')), ' = ', pv('15 m/s')] },
        { texto: 'En una hora hay 3600 s: 15 m cada segundo son 54 000 m por hora.', ecuacion: [pv('15 m/s'), ' = ', frac('15 · 3600 m', '1000 · 1 h'), ' = ', pv('54 km/h')] },
        { texto: ['La ', letra(ALT_A2.kmh, ALT_A2.kmh[0]), ' no convierte; la ', letra(ALT_A2.kmh, ALT_A2.kmh[2]), ' divide entre 3,6 en vez de multiplicar.'] },
      ],
      respuesta: [letra(ALT_A2.kmh, '54 km/h'), ', ', pv('54 km/h')] },
  ];

  const graficaXt = {
    id: 'grafica-xt',
    titulo: 'La gráfica posición–tiempo',
    pregunta: '¿Qué dice la inclinación de la gráfica x–t?',
    temas: ['MRU y velocidad relativa', 'Posición, desplazamiento y distancia'],
    pieza: 'fis-xt',
    aprendizaje: 'En la gráfica x–t, la pendiente Δx/Δt es la velocidad, aunque la recta no salga del origen; si baja, v es negativa.',
    actividad: 'Inclinar la gráfica de la combi para que pase por el grifo.',
    lee: {
      tarjetas: [
        { titulo: 'La tabla hecha puntos', texto: ['Anota dónde está la combi en cada segundo: a los 0 s, a los 1 s, a los 2 s… Cada par (', Mt, '; ', Mx, ') es un punto de la gráfica x–t: el tiempo va hacia la derecha y la posición, hacia arriba.'],
          dibujo: xt(Object.assign({}, PLANO_A2, { lineas: [{ puntos: [[0, 0], [3, 30]], segundos: true }] })) },
        { titulo: 'La pendiente', texto: 'Si unes los puntos, sale una recta. Su pendiente es cuánto sube la recta por cada segundo que pasa. Una recta que baja tiene pendiente negativa: la posición disminuye.' },
        { titulo: 'La gráfica no es el camino', texto: 'La avenida es recta y plana aunque la gráfica suba. Subir en la gráfica quiere decir que x crece: la combi se aleja del paradero hacia el lado +.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cambiar la velocidad de la combi. Mira cómo se inclina la recta y cuánto sube en cada segundo.' },
      ],
    },
    ejemplos: EJEMPLOS_XT,
    juega: {
      pieza: 'fis-xt',
      consigna: 'La gráfica se dibuja sola, un punto por segundo, mientras la combi sale del paradero.',
      mision: {
        texto: 'Inclina la recta para que pase por el grifo: 60 m a los 4 s.',
        logrado: val => val.v === 15,
        bien: 'Listo: sube 15 m cada segundo; a los 4 s, 60 m.',
      },
      voz: 'Mira cuánto sube la recta en cada segundo.',
      leyenda: [
        { s: [Mx], t: 'posición, en el eje vertical' },
        { s: [Mt], t: 'tiempo, en el eje horizontal' },
        { s: 'punto', t: 'dónde estaba la combi en cada segundo' },
        { s: 'recta', t: 'los puntos, unidos' },
        { s: [Mv], t: 'metros que avanza en cada segundo' },
        { s: 'círculo naranja', t: 'arrástralo: el punto de los 4 s' },
      ],
      controles: [
        { id: 'v', etiqueta: 'Velocidad, v', color: 'c-o', min: -20, max: 20, paso: 5, inicio: 5, unidad: 'm/s', decimales: 0 },
        { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: T_A2 + 0.5, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: juegoA2,
      lectura: val => (val.v > 0 ? ['La recta sube ', pv(`${fm(val.v)} m`), ' por cada segundo: ', Mv, ' = ', pv(`${fm(val.v)} m/s`)]
        : val.v < 0 ? ['La recta baja ', pv(`${fm(-val.v)} m`), ' por cada segundo: ', Mv, ' = ', pv(`${fm(val.v)} m/s`)]
          : ['La recta no sube ni baja: ', Mv, ' = ', pv('0 m/s')]),
      resumen: { v: 10, t: 5 },
      minimo: 3,
      // Gesto directo: se arrastra el punto de los 4 s de la recta, hacia arriba o hacia abajo.
      arrastres: [
        { id: 'punto-4', etiqueta: 'punto de los 4 segundos', color: 'c-o',
          donde: val => { const g = XT().geometria(juegoA2(val).datos); return { x: g.X(4), y: g.Y(4 * val.v) }; },
          mover: (p, val) => ({ v: XT().geometria(juegoA2(val).datos).Yi(p.y) / 4 }) },
      ],
    },
    predice: {
      pregunta: 'La gráfica x–t de un ciclista es una recta que pasa por (2 s; 26 m) y (5 s; 38 m). ¿Qué velocidad lleva?',
      datos: [DM.ejes],
      opciones: [
        { id: 'c', texto: '4 m/s', correcta: true },
        { id: 'altura', texto: '13 m/s', error: 'G2-altura-entre-tiempo', siFuera: '26 ÷ 2 sería cierto si la recta saliera del cero. Aquí no sale de ahí.' },
        { id: 'ultimo', texto: '7,6 m/s', error: 'G2-ultimo-punto', siFuera: 'Bien que dividas posición entre tiempo. Pero 38 ÷ 5 supone que salió del cero.' },
        { id: 'eje', texto: '38 m/s', error: 'G2-pendiente-es-altura', siFuera: '38 m es una posición, la altura del punto. La velocidad es lo que sube por segundo.' },
      ],
      dibujo: xt(CICLISTA),
      revelar: xt(conEscalon(CICLISTA)),
      coincide: 'Coincide: entre los dos puntos sube 12 m en 3 s, 4 m cada segundo.',
    },
    mira: {
      pieza: 'fis-xt',
      datos: (e => Object.assign(e, { puntos: [...e.puntos, { t: 0, x: 18, texto: 'x₀ = 18 m', color: 'f', lado: 'abajoDer', desde: 3 }] }))(conEscalon(CICLISTA, 1, 2)),
      pasos: [
        { estado: { corte: 0 }, texto: 'Dos puntos de la recta: (2 s; 26 m) y (5 s; 38 m).' },
        { estado: { corte: 1 }, texto: 'Del primer punto al segundo pasan 3 s: Δt, «cambio de t».', ecuacion: [MDt, ' = ', pt('5'), ' − ', pt('2'), ' = ', pt('3 s')] },
        { estado: { corte: 2 }, texto: 'En esos 3 s, la posición sube 12 m.', ecuacion: [MDx, ' = ', px('38'), ' − ', px('26'), ' = ', pdx('12 m')] },
        { estado: { corte: 2 }, texto: 'La pendiente: lo que sube entre lo que tarda.', ecuacion: [Mv, ' = ', frac(pdx('12 m'), pt('3 s')), ' = ', pv('4 m/s')] },
        { estado: { corte: 3 }, texto: 'A los 0 s estaba en 18 m: la recta no sale del cero.', ecuacion: [Mx0, ' = ', px('26'), ' − ', pv('4'), ' · ', pt('2'), ' = ', px('18 m')] },
        { estado: { corte: 3 }, texto: 'Por eso 26 ÷ 2 no da la velocidad: supone que salió del cero.' },
      ],
    },
    regla: {
      texto: 'La pendiente es cuánto sube la recta por cada segundo: Δx entre Δt, y es la velocidad. Δ (delta) se lee «cambio de». Si la recta baja, v es negativa.',
      ecuacion: [Mv, ' = ', frac(MDx, MDt), ' = ', frac([Mx2, ' − ', Mx1], [Mt2, ' − ', Mt1])],
      condicion: 'la gráfica es una recta (velocidad constante); sirve cualquier par de sus puntos. Horizontal: v = 0, está quieta.',
      // Con una recta que baja, discontinua (ronda 2: «dice "si baja, v es negativa", pero no hay ninguna recta que baje»).
      dibujo: xt(Object.assign(conEscalon(CICLISTA), { lineas: [...CICLISTA.lineas, { puntos: [[0, 58], [2.5, 38]], trazo: 'discontinua', rotulo: 'baja: v < 0', rotuloEn: 1.8 }] })),
    },
    resuelve: {
      pieza: 'fis-xt',
      generar(s) {
        const r = azar(s + 900), t1 = r.ent(1, 3), dt = r.ent(2, 4), vv = r.ent(3, 8), x0 = r.ent(2, 8) * 5;
        const t2 = t1 + dt, x1 = x0 + vv * t1, x2 = x0 + vv * t2, hi = Math.ceil((x2 + 15) / 20) * 20;
        const fig = xt(Object.assign(plano(t2 + 2, 0, hi), { lineas: [{ puntos: [[t1, x1], [t2, x2]] }], puntos: [{ t: t1, x: x1 }, { t: t2, x: x2 }] }));
        const puntos = ['La recta x–t de una combi pasa por (', pt(`${t1} s`), '; ', px(`${x1} m`), ') y (', pt(`${t2} s`), '; ', px(`${x2} m`), ').'];
        const vCuenta = { tipo: 'cuentas', texto: 'Primero la pendiente: lo que sube entre lo que tarda.', ecuacion: [Mv, ' = ', frac([px(x2), ' − ', px(x1)], [pt(t2), ' − ', pt(t1)]), ' = ', frac(pdx(x2 - x1), pt(dt)), ' = ', pv(`${vv} m/s`)] };
        if (s % 2 === 0) {
          return {
            enunciado: [...puntos, ' ¿Dónde estaba a los 0 s?'],
            datos: [DM.xt, DM.pos],
            dibujo: fig,
            pasos: [
              { tipo: 'pide', texto: ['Piden ', Mx0, ': dónde estaba cuando el reloj marcaba 0.'] },
              { tipo: 'datos', texto: ['Dos puntos de la recta: a los ', pt(`${t1} s`), ', ', px(`${x1} m`), '; a los ', pt(`${t2} s`), ', ', px(`${x2} m`), '.'] },
              { tipo: 'regla', texto: ['La pendiente da la velocidad; con ella, la regla de la posición ', Mx, ' = ', Mx0, ' + ', Mv, ' · ', Mt, ' da la salida.'] },
              vCuenta,
              { tipo: 'cuentas', texto: `Del punto de los ${t1} s se retroceden ${t1} s de recta.`, ecuacion: [px(x1), ' = ', Mx0, ' + ', pv(vv), ' · ', pt(t1), '  →  ', Mx0, ' = ', px(`${x0} m`)] },
              { tipo: 'sentido', texto: `Comprobación: ${x0} + ${vv} · ${t2} = ${x2} m, el otro punto. 0 no era la salida.` },
            ],
            respuesta: ['Estaba en ', x0v(`${x0} m`)],
          };
        }
        const X = x2 + vv * r.ent(2, 5), T = (X - x0) / vv;
        return {
          enunciado: [...puntos, ' Si sigue igual, ¿a qué instante pasa por ', px(`x = ${X} m`), '?'],
          datos: [DM.xt, DM.pos],
          dibujo: fig,
          pasos: [
            { tipo: 'pide', texto: ['Piden el instante ', Mt, ' en que la combi llega a ', px(`${X} m`), '.'] },
            { tipo: 'datos', texto: ['Dos puntos de la recta: (', pt(`${t1} s`), '; ', px(`${x1} m`), ') y (', pt(`${t2} s`), '; ', px(`${x2} m`), ').'] },
            { tipo: 'regla', texto: ['La pendiente es la velocidad; con ella y la salida, ', Mx, ' = ', Mx0, ' + ', Mv, ' · ', Mt, ' da el instante.'] },
            vCuenta,
            { tipo: 'cuentas', texto: `La salida: ${x1} − ${vv} · ${t1} = ${x0} m. Se despeja t.`, ecuacion: [px(X), ' = ', px(x0), ' + ', pv(vv), Mt, '  →  ', Mt, ' = ', frac(pdx(X - x0), pv(vv)), ' = ', pt(`${f(T)} s`)] },
            { tipo: 'sentido', texto: `Comprobación: a los ${f(T)} s, ${x1} + ${vv} · ${f(T - t1)} = ${X} m.` },
          ],
          respuesta: ['A los ', pt(`${f(T)} s`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-xt',
      generar(s) {
        const r = azar(s + 37), k = s % 4, ms = n => `${fm(n)} m/s`;
        const cuatro = (bien, ds, fmt = ms) => opciones(bien, ds, fmt).slice(0, 4);
        if (k === 0 || k === 1) {
          const t1 = r.ent(1, 3), dt = r.ent(2, 5), vv = (k === 0 ? 1 : -1) * r.ent(2, 9), x1a = k === 0 ? r.ent(2, 6) * 5 : r.ent(10, 16) * 5;
          const x1 = x1a === vv * t1 ? x1a + 5 : x1a;   // la recta nunca sale del cero: así se ve el error G2
          const t2 = t1 + dt, x2 = x1 + vv * dt, lo = Math.min(0, Math.floor(Math.min(x1, x2) / 20) * 20), hi = Math.ceil((Math.max(x1, x2) + 10) / 20) * 20;
          const ds = k === 0 ? [
            { id: 'ultimo', valor: x2 / t2, error: 'G2-ultimo-punto', siFuera: `Bien que dividas posición entre tiempo. Pero ${fm(x2)} ÷ ${t2} supone que salió del cero.` },
            { id: 'altura', valor: x1 / t1, error: 'G2-altura-entre-tiempo', siFuera: 'Eso sería si la recta saliera del cero. Usa lo que sube entre los dos puntos.' },
            { id: 'eje', valor: x2, error: 'G2-pendiente-es-altura', siFuera: `${fm(x2)} m es la altura de un punto. La velocidad es lo que sube por segundo.` },
            { id: 'delta', valor: x2 - x1, error: 'XT-SIN-DIVIDIR', siFuera: `Bien: sube ${fm(x2 - x1)} m. Pero en ${dt} s; falta dividir entre el tiempo.` },
          ] : [
            { id: 'signo', valor: -vv, error: 'XT-SIGNO', siFuera: 'Bien la cuenta. Pero la recta baja: x disminuye y la velocidad es negativa.' },
            { id: 'ultimo', valor: x2 / t2, error: 'G2-ultimo-punto', siFuera: 'Eso divide una posición entre su tiempo. Usa el cambio entre los dos puntos.' },
            { id: 'inversa', valor: dt / (x2 - x1), error: 'XT-INVERSA', siFuera: 'Eso divide el tiempo entre lo que cambió x. Es al revés: x entre t.' },
            { id: 'delta', valor: x2 - x1, error: 'XT-SIN-DIVIDIR', siFuera: `Bien: x cambia ${fm(x2 - x1)} m. Pero en ${dt} s; falta dividir.` },
          ];
          return {
            // «Con su signo» solo cuando baja (lector en frío: con la recta que sube, ninguna opción lleva signo).
            pregunta: ['La recta x–t de un mototaxi pasa por (', pt(`${t1} s`), '; ', px(`${x1} m`), ') y (', pt(`${t2} s`), '; ', px(`${x2} m`), k === 0 ? '). ¿Qué velocidad lleva?' : '). ¿Qué velocidad lleva, con su signo?'],
            datos: [DM.xt, DM.ejes],
            dibujo: xt(Object.assign(plano(t2 + 1, lo, hi), { lineas: [{ puntos: [[t1, x1], [t2, x2]] }], puntos: [{ t: t1, x: x1 }, { t: t2, x: x2 }] })),
            opciones: cuatro(vv, ds),
            solucion: { texto: k === 0 ? 'La pendiente entre los dos puntos.' : 'La recta baja: la pendiente es negativa.', ecuacion: [Mv, ' = ', frac([px(fm(x2)), ' − ', px(fm(x1))], [pt(t2), ' − ', pt(t1)]), ' = ', pv(ms(vv))] },
          };
        }
        if (k === 2) {
          const x0 = r.ent(1, 4) * 10, vv = r.ent(2, 6), t1 = r.ent(3, 5), T = t1 + r.ent(3, 6), x1 = x0 + vv * t1, xf = x0 + vv * T;
          return {
            pregunta: ['La gráfica x–t de una combi es una recta de (0 s; ', px(`${x0} m`), ') a (', pt(`${t1} s`), '; ', px(`${x1} m`), '), y ahí se corta. Si sigue igual, ¿dónde estará a los ', pt(`${T} s`), '?'],
            datos: [DM.xt, DM.pos],
            dibujo: xt(Object.assign(plano(T + 1, 0, Math.ceil((xf + 10) / 20) * 20), { lineas: [{ puntos: [[0, x0], [t1, x1]] }], puntos: [{ t: 0, x: x0 }, { t: t1, x: x1 }] })),
            opciones: cuatro(xf, [
              { id: 'leido', valor: x1, error: 'XT-LEIDO', siFuera: `${fm(x1)} m es el último punto dibujado. Pero la combi sigue avanzando después.` },
              { id: 'sin-x0', valor: vv * T, error: 'MRU-X0', siFuera: `Bien: avanza ${fm(vv * T)} m. Pero salió de ${fm(x0)} m: falta sumar esa salida.` },
              { id: 'altura', valor: x1 / t1 * T, error: 'G2-altura-entre-tiempo', siFuera: 'Eso divide la altura entre el tiempo, como si saliera del cero. No sale de ahí.' },
              { id: 'uno-mas', valor: x0 + vv * (T + 1), error: 'MRU-CONTEO', siFuera: `Eso cuenta ${T + 1} segundos. Reemplaza t = ${T} s.` },
            ], n => `En x = ${fm(n)} m`),
            solucion: { texto: `Pendiente: ${fm(x1 - x0)} m en ${t1} s, ${vv} m/s. Salida: ${x0} m.`, ecuacion: [Mx, ' = ', px(x0), ' + ', pv(vv), ' · ', pt(T), ' = ', px(`${fm(xf)} m`)] },
          };
        }
        // Nivel examen (San Marcos 2019-I): dos móviles en sentidos opuestos, leídos como dos pendientes con signo.
        const T = r.ent(4, 6), a = r.ent(3, 8), b = r.ent(2, 7), X = Math.ceil((b * T + 20) / 10) * 10;
        const par = (va, vb) => `Combi: ${ms(va)}; mototaxi: ${ms(vb)}`;
        const ops = [{ id: 'c', texto: par(a, -b), correcta: true }];
        for (const d of [
          { id: 'signo', texto: par(a, b), error: 'XT-SIGNO', siFuera: 'Bien las dos pendientes. Pero la recta del mototaxi baja: su velocidad es negativa.' },
          { id: 'alturas', texto: par(a, (X - b * T) / T), error: 'G2-ultimo-punto', siFuera: 'La de la combi está bien. La del mototaxi divide su última altura entre el tiempo.' },
          { id: 'cambio', texto: par(-a, b), error: 'XT-SIGNO', siFuera: 'Los signos van al revés: la recta de la combi sube y la del mototaxi baja.' },
          { id: 'alturas-ab', texto: par(a * T, X - b * T), error: 'G2-pendiente-es-altura', siFuera: 'Esas son las alturas de los puntos finales. La velocidad es lo que sube por segundo.' },
        ]) if (ops.length < 4 && !ops.some(o => o.texto === d.texto)) ops.push(d);
        return {
          pregunta: ['En la gráfica x–t, la recta de una combi va de (0 s; 0 m) a (', pt(`${T} s`), '; ', px(`${a * T} m`), ') y la de un mototaxi, de (0 s; ', px(`${X} m`), ') a (', pt(`${T} s`), '; ', px(`${X - b * T} m`), '). ¿Qué velocidades tienen?'],
          datos: [DM.xt, DM.ejes],
          dibujo: xt(Object.assign(plano(T + 1, 0, Math.max(X, a * T) + 10), { lineas: [{ puntos: [[0, 0], [T, a * T]], rotulo: 'combi' }, { puntos: [[0, X], [T, X - b * T]], trazo: 'discontinua', rotulo: 'mototaxi' }] })),
          opciones: ops,
          solucion: { texto: 'Cada pendiente, con su signo: la de la combi sube y la del mototaxi baja.', ecuacion: [frac(px(a * T), pt(T)), ' = ', pv(ms(a)), ';   ', frac([px(X - b * T), ' − ', px(X)], pt(T)), ' = ', pv(ms(-b))] },
        };
      },
    },
  };

  // ---------- Idea 3 (A3): velocidad media y rapidez media (18 nov, contrato «se entiende sin profesor») ----------
  // Pieza fis-pista: la recta de la pista atlética, con la ida hasta la valla y la vuelta por el mismo carril.
  // Cambia: cuánto vuelves · Permanece: la valla a 60 m y la rapidez de 2 m/s, a la ida y a la vuelta · Progresa: el
  // cronómetro, que alarga el camino · Se reserva: volver más rápido de lo que fuiste (solo en Predice) · Debe verse: la
  // distancia recorrida crece siempre; el desplazamiento crece a la ida y se achica a la vuelta.
  const PISTA_A3 = () => Kit.piezas['fis-pista'];
  const pista = (d, estado = {}) => ({ pieza: 'fis-pista', datos: d, estado });
  const VALLA = 60, V_A3 = 2;
  // El paseo del juego a los t segundos: lo recorrido, dónde estás y si ya diste la vuelta.
  const paseo = (r, t) => {
    const T = (VALLA + r) / V_A3, tt = Math.max(0, Math.min(t, T)), s = V_A3 * tt;
    const vuelta = Math.max(0, s - VALLA), pos = s <= VALLA ? s : VALLA - vuelta;
    return { T, tt, s, vuelta, pos };
  };
  // El cronómetro se lee con un decimal: la distancia sale del mismo tiempo que se ve (lector en frío: 7,1 contra 7,2 m).
  const t1d = t => Math.round(t * 10) / 10;
  const juegoA3 = val => {
    const q = paseo(val.r, t1d(val.t));
    return pista({ largo: VALLA, valla: VALLA, corredor: q.pos, mira: q.vuelta > 0 ? 'izq' : 'der',
      tramos: [{ de: 0, a: Math.min(q.s, VALLA), texto: `${V_A3} m/s`, color: 'o' }, q.vuelta > 0 ? { de: VALLA, a: q.pos, texto: `${V_A3} m/s`, color: 'o' } : null],
      dx: q.pos > 0 ? { a: q.pos, texto: 'Δx', color: 'f' } : null, reloj: { texto: `t = ${f(q.tt, 1)} s`, color: 'i' } });
  };
  const XP = m => PISTA_A3().geometria({ largo: VALLA }).X(m);
  // Predice y Mira: ida a 2 m/s y vuelta a la partida a 6 m/s (el juego solo volvía igual de rápido).
  const PRED_A3 = { largo: VALLA, valla: VALLA, corredor: 0, mira: 'der', tramos: [{ de: 0, a: VALLA, texto: '2 m/s', color: 'o' }, { de: VALLA, a: 0, texto: '6 m/s', color: 'o' }] };

  // Ejemplos resueltos de A3. Cuentas rehechas con un script aparte que no usa este archivo (scratchpad f3w/cuentas.js,
  // 18 nov): 50 + 20 y 50 − 20; 100/9,58; 120/48; (0 − 60)/15; 0/40; 60/3 + 60/6 y 120/30; 6 km/0,5 h; 150/40;
  // (100 − 0)/50 y (300 + 200)/50; 120/4; 12/(6/2 + 6/6) con el camino de 6 km; 1/(1/(2·4) + 1/(2·12)) con 12 = (10 + 14)/2;
  // (24 + 16)/8 y 8/8; 36·(20/60) + 54·(10/60) y 21/0,5; 60/30 y (120 + 60)/30. Correcciones (18 nov, cuentas en el
  // scratchpad cor-mru/cuentas.js): 12/24 + 0,5 + 1 = 2 h y 30/2 = 15 km/h (con 30/1,5 = 20 sin la parada y (24 + 18)/2
  // = 21); mitad a 3 m/s y el resto a (4 + 8)/2 = 6 m/s: 2·3·6/(3 + 6) = 4 m/s. Las figuras muestran cada tramo dado
  // (su rapidez o su tiempo), nunca la llave del desplazamiento ni el tiempo total cuando se piden (molde §3, 18 nov).
  const ALT_A3 = {
    parada: ['21 km/h', '15 km/h', '20 km/h', '14 km/h'],
    mitad: ['5 m/s', '4,5 m/s', '6 m/s', '4 m/s', '9 m/s'],
    tabla: ['5 m/s y 1 m/s', '1 m/s y 5 m/s', '3 m/s y 1 m/s', '5 m/s y 5 m/s', '7,5 m/s y 1 m/s'],
    combi: ['45 km/h', '90 km/h', '21 km/h', '40 km/h', '42 km/h'],
    ciclista: ['6 m/s y 2 m/s', '4 m/s y 6 m/s', '2 m/s y 6 m/s', '2 m/s y 2 m/s', '1,33 m/s y 6 m/s'],
  };
  const EJEMPLOS_MEDIAS = [
    { nivel: 1, titulo: 'Ida y vuelta corta',
      figura: pista({ largo: 50, valla: 50, corredor: 0, tramos: [{ de: 0, a: 50 }, { de: 50, a: 30 }] }),
      enunciado: ['Corres 50 m hasta la valla y vuelves 20 m por el mismo carril. ¿Qué distancia recorriste? ¿Cuál fue tu desplazamiento?'],
      datos: ['Distancia recorrida d: todo el camino, sin signo.', ['Desplazamiento: ', MDx, ' = posición final − posición inicial']],
      solucion: [
        { texto: 'La distancia suma los dos tramos, sin mirar hacia dónde.', ecuacion: ['d = 50 m + 20 m = 70 m'] },
        { texto: 'Terminaste en la marca de 30 m; empezaste en 0.', ecuacion: [MDx, ' = ', px('30'), ' − ', px('0'), ' = ', pdx('30 m')] },
      ],
      respuesta: ['d = 70 m y ', pdx('Δx = 30 m')] },
    { nivel: 1, titulo: 'Los 100 m planos',
      figura: pista({ largo: 100, paso: 10, numero: 20, valla: null, corredor: 0, tramos: [{ de: 0, a: 100, texto: '9,58 s', color: 'i' }] }),
      enunciado: ['El récord mundial de los 100 m planos es 9,58 s. ¿Cuál fue la velocidad media del recordista?'],
      datos: [DM.vm],
      fuente: 'World Athletics, récord mundial de 100 m: Usain Bolt, Berlín, 2009.',
      solucion: [{ texto: 'Corre en línea recta hacia la meta: su desplazamiento es 100 m.', ecuacion: [Mvm, ' = ', frac(pdx('100 m'), pt('9,58 s')), ' = ', pv('10,44 m/s')] }],
      respuesta: [pv('10,44 m/s')] },
    { nivel: 1, titulo: 'Rapidez de una vuelta',
      figura: pista({ largo: 60, valla: 60, corredor: 0, tramos: [{ de: 0, a: 60 }, { de: 60, a: 0 }] }),
      enunciado: ['Corres los 60 m hasta la valla y vuelves a la partida. Todo el paseo te toma 48 s. ¿Cuál es tu rapidez media?'],
      datos: [DM.rm],
      solucion: [{ texto: 'Todo el camino: 60 m de ida y 60 m de vuelta, en 48 s.', ecuacion: [Mrm, ' = ', frac('120 m', pt('48 s')), ' = ', pv('2,5 m/s')] }],
      respuesta: [pv('2,5 m/s')] },
    { nivel: 1, titulo: 'Hacia la partida',
      figura: pista({ largo: 60, valla: 60, corredor: 60, mira: 'izq', tramos: [{ de: 60, a: 0, texto: '15 s', color: 'i' }] }),
      enunciado: ['Sales de la valla, en x = 60 m, y corres hasta la partida, en x = 0, en 15 s. ¿Cuál es tu velocidad media, con su signo?'],
      datos: [DM.vm, DM.eje.replace('El paradero', 'La partida')],
      solucion: [{ texto: 'Vas hacia el lado −: el desplazamiento es negativo.', ecuacion: [Mvm, ' = ', frac([px('0'), ' − ', px('60')], pt('15')), ' = ', pv('−4 m/s')] }],
      respuesta: [pv('−4 m/s'), ': 4 m/s hacia la partida'] },
    { nivel: 1, titulo: 'Volver al mismo sitio',
      figura: pista({ largo: 60, valla: 60, corredor: 0, mira: 'izq', tramos: [{ de: 0, a: 60 }, { de: 60, a: 0 }], reloj: { texto: 't = 40 s', color: 'i' } }),
      enunciado: ['Corres hasta la valla y vuelves a la partida en 40 s en total. ¿Cuál es tu velocidad media en el paseo?'],
      datos: [DM.vm],
      solucion: [{ texto: 'Terminas donde empezaste: el desplazamiento es 0.', ecuacion: [Mvm, ' = ', frac(pdx('0 m'), pt('40 s')), ' = ', pv('0 m/s')] }],
      respuesta: [pv('0 m/s')] },
    { nivel: 2, titulo: 'Dos tramos hacia adelante',
      figura: pista({ largo: 120, paso: 10, numero: 20, valla: null, corredor: 0, tramos: [{ de: 0, a: 60, texto: '3 m/s', color: 'o' }, { de: 60, a: 120, texto: '6 m/s', color: 'o' }] }),
      enunciado: ['En la pista corres 60 m a 3 m/s y después otros 60 m a 6 m/s, siempre hacia adelante. ¿Cuál es tu rapidez media?'],
      datos: [DM.rm, DM.tramo],
      solucion: [
        { texto: 'El tiempo de cada tramo: el primero dura el doble.', ecuacion: [frac('60 m', pv('3 m/s')), ' = ', pt('20 s'), ';   ', frac('60 m', pv('6 m/s')), ' = ', pt('10 s')] },
        { texto: 'Todo el camino entre todo el tiempo. No es (3 + 6) ÷ 2.', ecuacion: [Mrm, ' = ', frac('120 m', pt('30 s')), ' = ', pv('4 m/s')] },
      ],
      respuesta: [pv('4 m/s')] },
    { nivel: 2, titulo: 'La combi al mercado',
      figura: avenida(Object.assign({ min: 0, max: 3000, paso: 250, numero: 1000 }, { x0: 0, v: 5, flecha: false, segundos: 0, rotulos: false, lugares: [{ en: 0, texto: 'Paradero', lado: 'der' }, { en: 3000, texto: 'Mercado', lado: 'izq' }] })),
      enunciado: ['Una combi va 3 km del paradero al mercado en 10 min, espera 5 min y regresa en 15 min. ¿Cuál es su rapidez media en todo el viaje, en km/h?'],
      datos: [DM.rm, '1 h = 60 min'],
      solucion: [
        { texto: 'Todo el camino: 3 km de ida y 3 km de vuelta. Todo el tiempo, con la espera: 30 min = 0,5 h.' },
        { texto: 'Rapidez media:', ecuacion: [Mrm, ' = ', frac('6 km', pt('0,5 h')), ' = ', pv('12 km/h')] },
      ],
      respuesta: [pv('12 km/h')] },
    { nivel: 2, titulo: 'Con un descanso',
      figura: pista({ largo: 150, paso: 10, numero: 50, valla: null, corredor: 0, tramos: [{ de: 0, a: 100, texto: '20 s', color: 'i' }, { de: 100, a: 150, texto: '10 s', color: 'i' }], parada: { en: 100, texto: 'descansa 10 s', color: 'i' } }),
      enunciado: ['Corres 100 m en 20 s, descansas 10 s y corres 50 m más en 10 s, hacia el mismo lado. ¿Cuál es tu rapidez media en los 40 s?'],
      datos: [DM.rm],
      solucion: [
        { texto: 'El descanso también cuenta en el tiempo: 20 s + 10 s + 10 s = 40 s.' },
        { texto: 'Todo el camino, 150 m, entre los 40 s.', ecuacion: [Mrm, ' = ', frac('150 m', pt('40 s')), ' = ', pv('3,75 m/s')] },
      ],
      respuesta: [pv('3,75 m/s')] },
    { nivel: 2, titulo: 'Ida, vuelta y signo',
      figura: avenida(Object.assign(regla(0, 300), { x0: 0, v: 10, flecha: false, segundos: 0, rotulos: false, lugares: PARADERO })),
      enunciado: ['Una combi va del paradero, en x = 0, hasta x = 300 m y vuelve hasta x = 100 m. Todo le toma 50 s. ¿Su velocidad media y su rapidez media?'],
      datos: [DM.vm, DM.rm],
      solucion: [
        { texto: 'Desplazamiento: de 0 a 100 m. Distancia: 300 m de ida y 200 m de vuelta.', ecuacion: [MDx, ' = ', pdx('100 m'), ';   d = 300 m + 200 m = 500 m'] },
        { texto: 'Las dos medias, con el mismo tiempo:', ecuacion: [Mvm, ' = ', frac(pdx('100 m'), pt('50 s')), ' = ', pv('2 m/s'), ';   ', Mrm, ' = ', frac('500 m', pt('50 s')), ' = ', pv('10 m/s')] },
      ],
      respuesta: [pv('2 m/s'), ' y ', pv('10 m/s')] },
    { nivel: 2, titulo: '¿Cuánto tardaste?',
      figura: pista({ largo: 60, valla: 60, corredor: 0, tramos: [{ de: 0, a: 60 }, { de: 60, a: 0 }] }),
      enunciado: ['Corres hasta la valla, a 60 m, y vuelves a la partida con una rapidez media de 4 m/s. ¿Cuánto tardaste?'],
      datos: [DM.rm],
      solucion: [
        { texto: 'Todo el camino: 60 m + 60 m = 120 m.' },
        { texto: 'Se despeja el tiempo de la rapidez media.', ecuacion: [MDt, ' = ', frac('120 m', pv('4 m/s')), ' = ', pt('30 s')] },
      ],
      respuesta: ['Tardaste ', pt('30 s')] },
    { nivel: 3, titulo: 'Dos tramos y una parada',
      enunciado: ['Un ciclista recorre 12 km a ', pv('24 km/h'), ', descansa ', pt('30 min'), ' y luego hace 18 km en ', pt('1 h'), ', siempre hacia el mismo lado. ¿Cuál es su rapidez media en todo el viaje?'],
      alternativas: ALT_A3.parada,
      datos: [DM.rm, DM.tramo, '1 h = 60 min'],
      solucion: [
        { texto: 'El primer tramo dura 12 km ÷ 24 km/h = 0,5 h. Todo el tiempo, con la parada:', ecuacion: [MDt, ' = ', pt('0,5 h'), ' + ', pt('0,5 h'), ' + ', pt('1 h'), ' = ', pt('2 h')] },
        { texto: 'Todo el camino, 12 km + 18 km = 30 km, entre todo el tiempo:', ecuacion: [Mrm, ' = ', frac('30 km', pt('2 h')), ' = ', pv('15 km/h')] },
        { texto: ['La ', letra(ALT_A3.parada, '21 km/h'), ' promedia 24 y 18 km/h; la ', letra(ALT_A3.parada, '20 km/h'), ' olvida la parada; la ', letra(ALT_A3.parada, '14 km/h'), ' promedia también la parada como si fuera un tramo.'] },
      ],
      respuesta: [letra(ALT_A3.parada, '15 km/h'), ', ', pv('15 km/h')] },
    { nivel: 3, titulo: 'Mitad y mitad',
      enunciado: ['Un ciclista hace la mitad de su recorrido a 3 m/s. Del resto, la mitad del tiempo va a 4 m/s y la otra mitad, a 8 m/s. ¿Cuál es su rapidez media?'],
      alternativas: ALT_A3.mitad,
      datos: [DM.rm, DM.tramo, 'Distancia de un tramo con rapidez constante: rapidez · tiempo.'],
      solucion: [
        { texto: 'En la segunda mitad, los dos tramos duran lo mismo: ahí sí vale el promedio, 6 m/s.', ecuacion: [frac([pv('4'), ' + ', pv('8')], '2'), ' = ', pv('6 m/s')] },
        { texto: 'Sirve cualquier largo: con 36 m, cada mitad mide 18 m y dura 18 ÷ 3 = 6 s y 18 ÷ 6 = 3 s.', ecuacion: [Mrm, ' = ', frac('36 m', [pt('6 s'), ' + ', pt('3 s')]), ' = ', pv('4 m/s')] },
        { texto: ['La ', letra(ALT_A3.mitad, '5 m/s'), ' promedia las tres; la ', letra(ALT_A3.mitad, '4,5 m/s'), ' promedia 3 y 6 sin ver los tiempos; la ', letra(ALT_A3.mitad, '6 m/s'), ' es solo el resto.'] },
      ],
      respuesta: [letra(ALT_A3.mitad, '4 m/s'), ', ', pv('4 m/s')] },
    { nivel: 3, titulo: 'La tabla de posiciones',
      figura: xt(Object.assign(plano(8, 0, 30), { puntos: [0, 12, 24, 16, 8].map((x, k) => ({ t: 2 * k, x })) })),
      enunciado: ['Un mototaxi va y vuelve por una avenida recta, con velocidad constante entre lectura y lectura. Cada 2 s, desde t = 0, está en 0, 12, 24, 16 y 8 m. ¿Rapidez media y velocidad media?'],
      alternativas: ALT_A3.tabla,
      datos: [DM.rm, DM.vm],
      solucion: [
        { texto: 'Hasta los 4 s avanza 24 m; después regresa 16 m. Todo el camino: 40 m.', ecuacion: ['d = 24 m + 16 m = 40 m;   ', MDx, ' = ', px('8'), ' − ', px('0'), ' = ', pdx('8 m')] },
        { texto: 'Las dos medias, en 8 s:', ecuacion: [Mrm, ' = ', frac('40 m', pt('8 s')), ' = ', pv('5 m/s'), ';   ', Mvm, ' = ', frac(pdx('8 m'), pt('8 s')), ' = ', pv('1 m/s')] },
        { texto: ['La ', letra(ALT_A3.tabla, '3 m/s y 1 m/s'), ' divide entre 8 solo lo más lejos que llegó, sin la vuelta.'] },
      ],
      respuesta: [letra(ALT_A3.tabla, '5 m/s y 1 m/s'), ', ', pv('5 m/s'), ' y ', pv('1 m/s')] },
    { nivel: 3, titulo: 'Dos tramos de tiempo',
      enunciado: ['Una combi va 20 min a 36 km/h y después 10 min a 54 km/h, por la misma avenida y hacia el mismo lado. ¿Cuál es su rapidez media en los 30 min?'],
      alternativas: ALT_A3.combi,
      datos: [DM.rm, 'Distancia de un tramo con rapidez constante: rapidez · tiempo.', '1 h = 60 min'],
      solucion: [
        { texto: 'Lo recorrido en cada tramo: 20 min es 1/3 h y 10 min, 1/6 h.', ecuacion: [pv('36 km/h'), ' · ', pt('1/3 h'), ' = 12 km;   ', pv('54 km/h'), ' · ', pt('1/6 h'), ' = 9 km'] },
        { texto: '21 km en media hora:', ecuacion: [Mrm, ' = ', frac('21 km', pt('0,5 h')), ' = ', pv('42 km/h')] },
        { texto: ['La ', letra(ALT_A3.combi, '45 km/h'), ' promedia 36 y 54: el primer tramo dura el doble y pesa más. La ', letra(ALT_A3.combi, '90 km/h'), ' suma las rapideces; la ', letra(ALT_A3.combi, '21 km/h'), ' es la distancia, 21 km.'] },
      ],
      respuesta: [letra(ALT_A3.combi, '42 km/h'), ', ', pv('42 km/h')] },
    { nivel: 3, titulo: 'Velocidad y rapidez con signo',
      enunciado: ['Un ciclista va de x = −20 m a x = 100 m en 20 s y vuelve hasta x = 40 m en 10 s. ¿Cuáles son su velocidad media y su rapidez media?'],
      alternativas: ALT_A3.ciclista,
      datos: [DM.vm, DM.rm],
      solucion: [
        { texto: 'Desplazamiento: de −20 m a 40 m. Distancia: 120 m de ida y 60 m de vuelta.', ecuacion: [MDx, ' = ', px('40'), ' − (', px('−20'), ') = ', pdx('60 m'), ';   d = 120 m + 60 m = 180 m'] },
        { texto: 'Las dos medias, en 30 s:', ecuacion: [Mvm, ' = ', frac(pdx('60 m'), pt('30 s')), ' = ', pv('2 m/s'), ';   ', Mrm, ' = ', frac('180 m', pt('30 s')), ' = ', pv('6 m/s')] },
        { texto: ['La ', letra(ALT_A3.ciclista, '1,33 m/s y 6 m/s'), ' toma la posición final, 40 m, como desplazamiento.'] },
      ],
      respuesta: [letra(ALT_A3.ciclista, '2 m/s y 6 m/s'), ', ', pv('2 m/s'), ' y ', pv('6 m/s')] },
  ];

  const medias = {
    id: 'desplazamiento-distancia',
    titulo: 'Velocidad media y rapidez media',
    pregunta: 'Si das la vuelta y regresas al mismo sitio, ¿cuál fue tu velocidad media?',
    temas: ['Posición, desplazamiento y distancia', 'Velocidad y rapidez media'],
    pieza: 'fis-pista',
    aprendizaje: 'La velocidad media es el desplazamiento entre el tiempo; la rapidez media, la distancia recorrida entre el tiempo. No es el promedio de las rapideces.',
    actividad: 'Correr por la recta de la pista, volver y medir el paseo.',
    lee: {
      tarjetas: [
        { titulo: 'Dos maneras de medir', texto: ['Como en Vectores, el desplazamiento ', MDx, ' va de donde empezaste a donde terminaste. La distancia recorrida es todo el camino: la ida más la vuelta.'],
          dibujo: pista({ largo: VALLA, valla: VALLA, corredor: 20, mira: 'izq', tramos: [{ de: 0, a: VALLA, texto: 'ida' }, { de: VALLA, a: 20, texto: 'vuelta' }], dx: { a: 20, texto: 'Δx', color: 'f' } }) },
        { titulo: 'La letra d', texto: ['Aquí la distancia recorrida se escribe d, sin flecha: es todo el camino y nunca es negativa. En Vectores, la d con flecha era el desplazamiento en el plano; en una recta, el desplazamiento es ', MDx, '.'] },
        { titulo: 'Dos medias', texto: 'La velocidad media es el desplazamiento entre el tiempo. La rapidez media es la distancia recorrida entre el tiempo.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a correr hasta la valla y volver un tramo. Mira cuánto recorres y a qué distancia de la partida quedas.' },
      ],
    },
    ejemplos: EJEMPLOS_MEDIAS,
    juega: {
      pieza: 'fis-pista',
      consigna: 'Corres 60 m hasta la valla a 2 m/s y vuelves por el mismo carril, igual de rápido.',
      mision: {
        texto: 'Vuelve hasta que tu rapidez media sea el doble de tu velocidad media.',
        // Con lo que vuelves, r: rapidez media (60 + r)/T y velocidad media (60 − r)/T; el doble solo con r = 20 m.
        logrado: val => val.r === 20,
        bien: 'Listo: rapidez media 2 m/s y velocidad media 1 m/s.',
      },
      voz: 'Mira lo que recorres y a qué distancia quedas.',
      leyenda: [
        { s: 'flecha de arriba', t: 'la ida, hasta la valla' },
        // La de abajo sale recién al volver (ronda 2: «la leyenda nombra dos flechas y se ve una»).
        { s: 'flecha de abajo', t: 'la vuelta: sale cuando regresas' },
        { s: 'círculo', t: 'arrástralo: hasta dónde vuelves' },
        { s: 'd', t: 'todo el camino: ida más vuelta' },
        { s: [MDx], t: 'de la partida a donde quedaste' },
        { s: [Mt], t: 'el cronómetro, desde que sales' },
        { s: 'r', t: 'los metros que vuelves desde la valla' },
      ],
      controles: [
        { id: 'r', etiqueta: 'Vuelves, r', min: 0, max: VALLA, paso: 10, inicio: 0, unidad: 'm', decimales: 0 },
        { id: 't', etiqueta: 'Cronómetro, t', color: 'c-i', min: 0, max: VALLA + 1, paso: 0.05, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 6, modo: 'repite' } },
      ],
      dibujo: juegoA3,
      lectura: val => { const q = paseo(val.r, t1d(val.t)); return ['En ', pt(`${f(q.tt, 1)} s`), ' recorriste ', `d = ${f(q.s, 1)} m`, '; quedaste a ', MDx, ' = ', pdx(`${f(q.pos, 1)} m`)]; },
      resumen: { r: 20, t: VALLA + 1 },
      minimo: 3,
      // Gesto directo: se arrastra hasta dónde vuelves, sobre la flecha de la vuelta.
      arrastres: [
        { id: 'vuelta', etiqueta: 'hasta dónde vuelves',
          donde: val => ({ x: XP(VALLA - val.r), y: PISTA_A3().constantes.Y.VUELTA }),
          mover: p => ({ r: VALLA - inversa(XP, 0, VALLA)(p.x) }) },
      ],
    },
    predice: {
      pregunta: 'Corres los 60 m hasta la valla a 2 m/s y vuelves a la partida a 6 m/s, por el mismo carril. ¿Cuál es tu rapidez media en todo el paseo?',
      datos: ['La ida y la vuelta miden lo mismo: 60 m cada una.'],
      opciones: [
        { id: 'c', texto: '3 m/s', correcta: true },
        { id: 'promedio', texto: '4 m/s', error: 'MED-PROMEDIO', siFuera: '(2 + 6) ÷ 2 serviría si los dos tramos duraran lo mismo. La ida dura más.' },
        { id: 'velocidad', texto: '0 m/s', error: 'DX-RAPIDEZ', siFuera: 'Bien: volviste a la partida, la velocidad media es 0. La rapidez media usa todo el camino.' },
        { id: 'suma', texto: '8 m/s', error: 'MED-SUMA', siFuera: 'Sumar las rapideces da algo que nunca llevaste: corriste a 2 y a 6 m/s.' },
      ],
      dibujo: pista(PRED_A3),
      revelar: pista(Object.assign({}, PRED_A3, { mira: 'izq', reloj: { texto: 't = 30 s + 10 s = 40 s', color: 'i' } })),
      coincide: 'Coincide: 120 m en 30 s + 10 s = 40 s. La ida, más lenta, dura más.',
    },
    mira: {
      pieza: 'fis-pista',
      datos: Object.assign({}, PRED_A3, { mira: 'izq', tramos: PRED_A3.tramos.map((x, k) => Object.assign({}, x, { desde: k + 1 })), reloj: { texto: 'Δt = 40 s', color: 'i', desde: 3 } }),
      pasos: [
        { estado: { corte: 1 }, texto: 'La ida: 60 m a 2 m/s toman 30 s.', ecuacion: [sub(MDt, '1'), ' = ', frac('60 m', pv('2 m/s')), ' = ', pt('30 s')] },
        { estado: { corte: 2 }, texto: 'La vuelta: los mismos 60 m a 6 m/s toman 10 s.', ecuacion: [sub(MDt, '2'), ' = ', frac('60 m', pv('6 m/s')), ' = ', pt('10 s')] },
        { estado: { corte: 3 }, texto: 'Todo el camino: 120 m, en 40 s.', ecuacion: ['d = 60 m + 60 m = 120 m;   ', MDt, ' = ', pt('30 s'), ' + ', pt('10 s'), ' = ', pt('40 s')] },
        { estado: { corte: 3 }, texto: 'La rapidez media: todo el camino entre todo el tiempo.', ecuacion: [Mrm, ' = ', frac('120 m', pt('40 s')), ' = ', pv('3 m/s')] },
        { estado: { corte: 3 }, texto: 'Volviste a la partida: el desplazamiento y la velocidad media son 0.', ecuacion: [Mvm, ' = ', frac(pdx('0 m'), pt('40 s')), ' = ', pv('0 m/s')] },
        { estado: { corte: 3 }, texto: 'No es (2 + 6) ÷ 2 = 4: la ida dura más.' },
      ],
    },
    regla: {
      texto: 'Velocidad media: desplazamiento entre tiempo. Rapidez media: distancia recorrida entre tiempo. No es el promedio de las rapideces, salvo que los tramos duren lo mismo.',
      ecuacion: [Mvm, ' = ', frac(MDx, MDt), '   ;   ', Mrm, ' = ', frac('d', MDt)],
      condicion: 'Δt es el tiempo de todo el paseo, con las paradas; d suma cada tramo y Δx resta lo que regresas.',
      dibujo: pista({ largo: VALLA, valla: VALLA, corredor: 20, mira: 'izq', tramos: [{ de: 0, a: VALLA, texto: 'ida' }, { de: VALLA, a: 20, texto: 'vuelta' }], dx: { a: 20, texto: 'Δx', color: 'f' }, reloj: { texto: 'Δt: ida + vuelta', color: 'i' } }),
    },
    resuelve: {
      pieza: 'fis-xt',
      generar(s) {
        const r = azar(s + 900), T = [2, 4, 5, 10][r.ent(0, 3)], a = T * r.ent(3, 6), b = a + T * r.ent(1, 4), c = b - T * r.ent(1, 6);
        const xs = [0, a, b, c], d = b + (b - c), dt = 3 * T, rm = d / dt, vm = c / dt;
        const hi = Math.ceil((b + 5) / 10) * 10, lo = Math.min(0, Math.floor(c / 10) * 10);
        return {
          enunciado: ['Una combi va y vuelve por una avenida recta, con velocidad constante entre lectura y lectura. A los 0, ', `${T}, ${2 * T} y ${3 * T} s`, ' está en 0, ', `${a}, ${b} y ${fm(c)} m`, '. ¿Su rapidez media y su velocidad media?'],
          datos: [DM.rm, DM.vm],
          dibujo: xt(Object.assign(plano(3 * T, lo, hi), { puntos: xs.map((x, k) => ({ t: k * T, x })) })),
          pasos: [
            { tipo: 'pide', texto: ['Piden la ', Mrm, ' y la velocidad media ', Mvm, ' en los ', pt(`${dt} s`), '.'] },
            { tipo: 'datos', texto: `Avanza hasta ${b} m y después regresa hasta ${fm(c)} m: la vuelta empieza a los ${2 * T} s.` },
            { tipo: 'regla', texto: ['Rapidez media: todo el camino d entre el tiempo. Velocidad media: ', MDx, ' entre el tiempo.'] },
            { tipo: 'cuentas', texto: `Camino: ${b} m de ida y ${b - c} m de vuelta. Desplazamiento: de 0 a ${fm(c)} m.`, ecuacion: [`d = ${b} m + ${b - c} m = ${d} m;   `, MDx, ' = ', pdx(`${fm(c)} m`)] },
            { tipo: 'cuentas', texto: 'Las dos medias, con el mismo tiempo:', ecuacion: [Mrm, ' = ', frac(`${d} m`, pt(`${dt} s`)), ' = ', pv(`${fm(rm)} m/s`), ';   ', Mvm, ' = ', frac(pdx(`${fm(c)} m`), pt(`${dt} s`)), ' = ', pv(`${fm(vm)} m/s`)] },
            { tipo: 'sentido', texto: 'La rapidez media sale mayor: la vuelta suma al camino y resta al desplazamiento.' },
          ],
          respuesta: [pv(`${fm(rm)} m/s`), ' y ', pv(`${fm(vm)} m/s`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-pista',
      generar(s) {
        const r = azar(s + 53), k = s % 4, ms = n => `${fm(n)} m/s`;
        const cuatro = (bien, ds) => opciones(bien, ds, ms).slice(0, 4);
        if (k === 0 || k === 1) {
          const v1 = r.ent(2, 5), t1 = r.ent(4, 10) * 2, L = v1 * t1;
          const v2 = r.ent(v1 + 1, 8), t2 = r.ent(1, Math.floor(L / v2)), L2 = v2 * t2, T = t1 + t2, largo = Math.ceil(L / 10) * 10;
          const dib = pista({ largo, paso: 10, numero: largo > 60 ? 20 : 10, numeros: [L], valla: L, corredor: 0, tramos: [{ de: 0, a: L, texto: ms(v1), color: 'o' }, { de: L, a: L - L2, texto: ms(v2), color: 'o' }] });
          const preg = ['Corres ', `${L} m`, ' hasta la valla a ', pv(ms(v1)), ' y vuelves ', `${L2} m`, ' a ', pv(ms(v2)), ', por el mismo carril. '];
          if (k === 0) return {
            pregunta: [...preg, '¿Cuál es tu rapidez media?'],
            datos: [DM.rm, DM.tramo],
            dibujo: dib,
            opciones: cuatro((L + L2) / T, [
              { id: 'promedio', valor: (v1 + v2) / 2, error: 'MED-PROMEDIO', siFuera: 'Promediar las rapideces serviría si los tramos duraran lo mismo. Aquí no.' },
              { id: 'velocidad', valor: (L - L2) / T, error: 'DX-RAPIDEZ', siFuera: 'Eso es la velocidad media: resta la vuelta. La rapidez media la suma.' },
              { id: 'suma', valor: v1 + v2, error: 'MED-SUMA', siFuera: 'Sumar las rapideces da algo que nunca llevaste.' },
              { id: 'un-tiempo', valor: (L + L2) / t1, error: 'MED-UN-TIEMPO', siFuera: `Bien el camino, ${L + L2} m. Pero el tiempo es el de todo el paseo.` },
            ]),
            solucion: { texto: `Tiempos: ${t1} s y ${t2} s. Todo el camino entre todo el tiempo.`, ecuacion: [Mrm, ' = ', frac(`${L} m + ${L2} m`, pt(`${T} s`)), ' = ', pv(ms((L + L2) / T))] },
          };
          return {
            pregunta: [...preg, '¿Cuál es tu velocidad media?'],
            datos: [DM.vm, DM.tramo],
            dibujo: dib,
            opciones: cuatro((L - L2) / T, [
              { id: 'rapidez', valor: (L + L2) / T, error: 'DX-DISTANCIA', siFuera: 'Eso es la rapidez media: suma la vuelta. La velocidad media usa el desplazamiento.' },
              { id: 'promedio', valor: (v1 - v2) / 2, error: 'MED-PROMEDIO', siFuera: 'Promediar velocidades no da la media: los tramos no duran lo mismo.' },
              { id: 'ida', valor: L / T, error: 'DX-IDA', siFuera: `Bien el tiempo total. Pero volviste ${L2} m: el desplazamiento es menor.` },
              { id: 'un-tiempo', valor: (L - L2) / t1, error: 'MED-UN-TIEMPO', siFuera: 'Bien el desplazamiento. Pero el tiempo es el de todo el paseo.' },
            ]),
            solucion: { texto: `Quedaste a ${L - L2} m de la partida, en ${T} s.`, ecuacion: [Mvm, ' = ', frac(pdx(`${L - L2} m`), pt(`${T} s`)), ' = ', pv(ms((L - L2) / T))] },
          };
        }
        if (k === 2) {
          const v1 = r.ent(4, 10), v2 = r.ent(11, 20), t1 = r.ent(2, 6) * 10, t2 = [10, 15, 25, 35][r.ent(0, 3)];   // nunca igual a t1: con tiempos iguales, el promedio sí valdría
          const rm = (v1 * t1 + v2 * t2) / (t1 + t2);
          return {
            pregunta: ['Una combi va ', pt(`${t1} s`), ' a ', pv(ms(v1)), ' y después ', pt(`${t2} s`), ' a ', pv(ms(v2)), ', hacia el mismo lado. ¿Cuál es su rapidez media en todo el viaje?'],
            datos: [DM.rm, 'Distancia de un tramo con rapidez constante: rapidez · tiempo.'],
            opciones: cuatro(rm, [
              { id: 'promedio', valor: (v1 + v2) / 2, error: 'MED-PROMEDIO', siFuera: 'Eso valdría con tramos de igual duración. Aquí duran distinto.' },
              { id: 'suma', valor: v1 + v2, error: 'MED-SUMA', siFuera: 'Sumar las rapideces da algo que la combi nunca llevó.' },
              { id: 'un-tiempo', valor: (v1 * t1 + v2 * t2) / t1, error: 'MED-UN-TIEMPO', siFuera: 'Bien el camino. Pero el tiempo es el de los dos tramos.' },
              { id: 'tiempos', valor: (v1 * t2 + v2 * t1) / (t1 + t2), error: 'MED-CRUZADO', siFuera: 'Bien la idea, pero cruzaste los tiempos: cada rapidez va con el suyo.' },
              { id: 'tramo', valor: v2, error: 'MED-TRAMO', siFuera: `${fm(v2)} m/s es la rapidez del segundo tramo solo, no la de todo el viaje.` },
            ]),
            solucion: { texto: `Camino: ${v1 * t1} m + ${v2 * t2} m, en ${t1 + t2} s.`, ecuacion: [Mrm, ' = ', frac(`${v1 * t1 + v2 * t2} m`, pt(`${t1 + t2} s`)), ' = ', pv(ms(rm))] },
          };
        }
        // Nivel examen (San Marcos 2022): mitad del recorrido a v1; del resto, mitad del tiempo a v2 y mitad a v3.
        // Un ciclista va a 12 m/s como mucho (unos 43 km/h; auditoría, 18 nov, M1). Ninguno es el del ejemplo (3, 4 y 8).
        const [v1, v2, v3] = [[2, 4, 8], [4, 6, 10], [6, 8, 12], [10, 4, 8], [6, 2, 4], [12, 4, 8], [4, 10, 12], [9, 2, 4]][r.ent(0, 7)];
        const w = (v2 + v3) / 2, rm = 2 * v1 * w / (v1 + w);
        return {
          pregunta: ['Un ciclista hace la mitad de su recorrido a ', pv(ms(v1)), '. Del resto, la mitad del tiempo va a ', pv(ms(v2)), ' y la otra mitad a ', pv(ms(v3)), '. ¿Cuál es su rapidez media?'],
          datos: [DM.rm, DM.tramo, 'Distancia de un tramo con rapidez constante: rapidez · tiempo.'],
          opciones: cuatro(rm, [
            { id: 'promedio', valor: (v1 + v2 + v3) / 3, error: 'MED-PROMEDIO', siFuera: 'Promediar las tres no sirve: los tramos no duran lo mismo.' },
            { id: 'parcial', valor: (v1 + w) / 2, error: 'MED-PROMEDIO-MITADES', siFuera: `Bien los ${fm(w)} m/s del resto. Pero las dos mitades del camino no duran lo mismo.` },
            { id: 'tramo', valor: w, error: 'MED-TRAMO', siFuera: `${fm(w)} m/s es la rapidez media de la segunda mitad sola.` },
            { id: 'suma', valor: v1 + w, error: 'MED-SUMA', siFuera: 'Sumar rapideces da algo que el ciclista nunca llevó.' },
          ]),
          solucion: { texto: `El resto va a ${fm(w)} m/s. Con mitades de ${fm(v1 * w)} m, duran ${fm(w)} s y ${fm(v1)} s.`, ecuacion: [Mrm, ' = ', frac(`${fm(2 * v1 * w)} m`, [pt(`${fm(w)} s`), ' + ', pt(`${fm(v1)} s`)]), ' = ', pv(ms(rm))] },
        };
      },
    },
  };

  // ---------- Idea 4 (A4): encuentros y alcances (18 nov, contrato «se entiende sin profesor») ----------
  // Pieza fis-combi, vista «avenida» con `segundo`: la combi sale del paradero y el mototaxi del mercado, de frente.
  // Cambia: las dos rapideces · Permanece: la separación de 240 m y el colegio a 150 m · Progresa: el reloj, que los
  // acerca hasta que se cruzan · Se reserva: los dos hacia el mismo lado (el alcance, solo en Predice) · Debe verse: en el
  // cruce coinciden las posiciones, no las velocidades.
  const D_A4 = 240, COLEGIO = 150, T_A4 = 60;
  const AV_A4 = { min: 0, max: D_A4, paso: 10, numero: 30, segundos: 0, rotulos: false,
    lugares: [{ en: 0, texto: 'Paradero', lado: 'der' }, { en: COLEGIO, texto: 'Colegio', lado: 'izq' }, { en: D_A4, texto: 'Mercado', lado: 'izq' }] };
  const cruceA4 = val => { const te = D_A4 / (val.va + val.vb); return { te, xe: val.va * te }; };
  const juegoA4 = val => {
    const { te, xe } = cruceA4(val), tt = Math.max(0, Math.min(val.t, te));
    return avenida(Object.assign({}, AV_A4, { x0: 0, v: val.va, t: tt, segundo: { tipo: 'mototaxi', x0: D_A4, v: -val.vb },
      posiciones: val.t >= te ? [{ en: xe, texto: 'cruce', color: 'f' }] : [] }));
  };
  const escA4 = () => COMBI().escala(Object.assign({ vista: 'avenida' }, AV_A4));
  // Una figura de dos vehículos al empezar el reloj (los ejemplos, «Así se resuelve» y «Ahora tú»).
  const dos = (min, max, combi, moto, extra = {}) => avenida(Object.assign(regla(min, max), { x0: combi[0], v: combi[1], t: 0, segundos: 0, rotulos: false,
    segundo: Object.assign({ tipo: 'mototaxi', x0: moto[0], v: moto[1] }, moto[2] ? { flechaTexto: moto[2] } : {}) }, combi[2] ? { flechaTexto: combi[2] } : {}, extra));
  const PRED_A4 = { combi: [0, 10], moto: [60, 6] };

  // Ejemplos resueltos de A4. Cuentas rehechas con un script aparte que no usa este archivo (scratchpad f3w/cuentas.js,
  // 18 nov; correcciones del mismo día, las mismas cuentas con la letra recontada): 100/(6 + 4); 30/(8 − 5); (12 + 8)·5; 9·12; 40 − 8·t constante; 180/18 y 10·10; 54/3,6 − 36/3,6 y 100/5;
  // 3000/(15 + 10) y 120/60; 120/16; 40/4 y 10·10; 6·10 y 60/4; 80/4 y 5·20; 1500/(20 + 10) y 1500/(72 + 36);
  // (200 ∓ 50)/10; (40 + 20)/5. Las figuras muestran a los dos al empezar el reloj (dónde sale cada uno y su flecha),
  // nunca el lugar del encuentro (molde §3, 18 nov).
  const ALT_A4 = {
    antes: ['6 s', '25 s', '15 s', '3,75 s', '10 s'],
    huye: ['180 m', '80 m', '20 m', '28,6 m', '100 m'],
    kmh: ['50 s', '13,9 s', '150 s', '83,3 s', '25 s'],
    dosVeces: ['15 s', '15 s y 25 s', '25 s', '5 s y 25 s', '20 s'],
    ventaja: ['8 s', '4 s', '3,16 s', '12 s', '5 s'],
  };
  const EJEMPLOS_ENCUENTRO = [
    { nivel: 1, titulo: 'De frente',
      figura: dos(0, 100, [0, 6], [100, -4], { lugares: PARADERO }),
      enunciado: ['Una combi sale del paradero a 6 m/s y, a la vez, un mototaxi viene de frente desde 100 m a 4 m/s. ¿Cuándo se cruzan?'],
      datos: [DM.encuentro, DM.cierre],
      solucion: [{ texto: 'Van uno hacia el otro: la separación baja 6 + 4 = 10 m cada segundo.', ecuacion: [Mte, ' = ', frac(pD('100 m'), [pv('6'), ' + ', pv('4 m/s')]), ' = ', pt('10 s')] }],
      respuesta: ['A los ', pt('10 s')] },
    { nivel: 1, titulo: 'Persiguiéndose',
      figura: dos(0, 100, [0, 8], [30, 5]),
      enunciado: ['Un mototaxi va 30 m delante de una combi, a 5 m/s; la combi lo sigue a 8 m/s, hacia el mismo lado. ¿Cuándo lo alcanza?'],
      datos: [DM.encuentro, DM.cierre],
      solucion: [{ texto: 'Van al mismo lado: cada segundo la combi gana 8 − 5 = 3 m.', ecuacion: [Mtalc, ' = ', frac(pD('30 m'), [pv('8'), ' − ', pv('5 m/s')]), ' = ', pt('10 s')] }],
      respuesta: ['A los ', pt('10 s')] },
    { nivel: 1, titulo: '¿Cuánto se acercan?',
      figura: dos(0, 300, [0, 12], [300, -8]),
      enunciado: ['Una combi a 12 m/s y un mototaxi a 8 m/s van de frente, separados 300 m. ¿Cuánto se achica su separación en 5 s?'],
      datos: ['Cada uno avanza rapidez · tiempo.', DM.cierre],
      solucion: [{ texto: 'Cada segundo se acercan 12 m + 8 m = 20 m; en 5 s, cinco veces eso.', ecuacion: ['(', pv('12 m/s'), ' + ', pv('8 m/s'), ') · ', pt('5 s'), ' = ', pD('100 m')] }],
      respuesta: ['Se acercan ', pD('100 m'), ': quedan a 200 m'] },
    { nivel: 1, titulo: '¿Dónde se cruzan?',
      figura: avenida(Object.assign(regla(0, 200), { x0: 0, v: 9, segundos: 0, rotulos: false, lugares: PARADERO })),
      enunciado: ['Una combi sale del paradero a 9 m/s y se cruza con un mototaxi a los 12 s. ¿A qué distancia del paradero se cruzan?'],
      datos: [DM.pos],
      solucion: [{ texto: 'En el cruce, la combi está donde la deja su regla de posición.', ecuacion: [MxA, ' = 0 + ', pv('9'), ' · ', pt('12'), ' = ', px('108 m')] }],
      respuesta: ['A ', px('108 m'), ' del paradero'] },
    { nivel: 1, titulo: 'Igual de rápido',
      figura: dos(0, 100, [0, 8], [40, 8]),
      enunciado: ['Un mototaxi va 40 m delante de una combi. Los dos van a 8 m/s hacia el mismo lado. ¿Cuándo lo alcanza la combi?'],
      datos: [DM.encuentro, DM.cierre],
      solucion: [{ texto: 'Cada segundo los dos avanzan 8 m: la combi gana 8 − 8 = 0 m. La separación no cambia.', ecuacion: [MD, ' = ', pD('40 m'), ' siempre'] }],
      respuesta: ['Nunca: siguen a ', pD('40 m')] },
    { nivel: 2, titulo: 'El punto de cruce',
      figura: dos(0, 180, [0, 10], [180, -8], { lugares: PARADERO }),
      enunciado: ['Una combi sale del paradero a 10 m/s y un mototaxi, a la vez, viene de frente desde 180 m a 8 m/s. ¿Cuándo y dónde se cruzan?'],
      datos: [DM.encuentro, DM.cierre, DM.pos],
      solucion: [
        { texto: 'Se acercan 10 + 8 = 18 m cada segundo.', ecuacion: [Mte, ' = ', frac(pD('180 m'), pv('18 m/s')), ' = ', pt('10 s')] },
        { texto: 'Dónde: lo que avanzó la combi desde el paradero.', ecuacion: [MxA, ' = ', pv('10'), ' · ', pt('10'), ' = ', px('100 m')] },
      ],
      respuesta: ['A los ', pt('10 s'), ', en ', px('x = 100 m')] },
    { nivel: 2, titulo: 'Alcance en km/h',
      figura: dos(0, 200, [0, 15, '54 km/h'], [100, 10, '36 km/h']),
      enunciado: ['Un mototaxi a 36 km/h va 100 m delante de una combi a 54 km/h, los dos hacia el mismo lado. ¿Cuánto tarda la combi en alcanzarlo?'],
      datos: [DM.encuentro, DM.cierre, DM.kmh],
      solucion: [
        { texto: 'A m/s: 54 km/h = 15 m/s y 36 km/h = 10 m/s.' },
        { texto: 'Cada segundo la combi gana 5 m.', ecuacion: [Mtalc, ' = ', frac(pD('100 m'), [pv('15'), ' − ', pv('10 m/s')]), ' = ', pt('20 s')] },
      ],
      respuesta: ['Tarda ', pt('20 s')] },
    { nivel: 2, titulo: 'En minutos',
      figura: dos(0, 3000, [0, 15], [3000, -10], { numero: 1000 }),
      enunciado: ['Una combi y un mototaxi van de frente por una carretera recta, separados 3 km, a 15 m/s y 10 m/s. ¿En cuántos minutos se cruzan?'],
      datos: [DM.encuentro, DM.cierre, '1 km = 1000 m y 1 min = 60 s'],
      solucion: [
        { texto: 'Se acercan 25 m cada segundo; la separación es 3 000 m.', ecuacion: [Mte, ' = ', frac(pD('3 000 m'), pv('25 m/s')), ' = ', pt('120 s')] },
        { texto: '120 s son 2 min.' },
      ],
      respuesta: ['En ', pt('2 min')] },
    { nivel: 2, titulo: 'Después de cruzarse',
      figura: dos(0, 200, [100, 10], [100, -6]),
      enunciado: ['Una combi a 10 m/s y un mototaxi a 6 m/s van de frente y se cruzan. ¿Cuánto tiempo después del cruce estarán a 120 m uno del otro?'],
      datos: ['Cada uno avanza rapidez · tiempo.', DM.cierre],
      solucion: [
        { texto: 'Después del cruce siguen de frente y se separan 10 + 6 = 16 m cada segundo.' },
        { texto: 'Para separarse 120 m:', ecuacion: [Mt, ' = ', frac(pD('120 m'), pv('16 m/s')), ' = ', pt('7,5 s')] },
      ],
      respuesta: [pt('7,5 s'), ' después del cruce'] },
    { nivel: 2, titulo: 'Alcance y lugar',
      figura: dos(0, 120, [0, 10], [40, 6]),
      enunciado: ['Un mototaxi va 40 m delante de una combi, a 6 m/s; la combi lo sigue a 10 m/s. ¿Cuándo lo alcanza y a qué distancia de donde salió la combi?'],
      datos: [DM.encuentro, DM.cierre, DM.pos],
      solucion: [
        { texto: 'La combi gana 4 m cada segundo.', ecuacion: [Mtalc, ' = ', frac(pD('40 m'), [pv('10'), ' − ', pv('6 m/s')]), ' = ', pt('10 s')] },
        { texto: 'En 10 s la combi avanza 100 m; el mototaxi, 60 m desde 40 m: los dos en 100 m.', ecuacion: [MxA, ' = ', pv('10'), ' · ', pt('10'), ' = ', px('100 m')] },
      ],
      respuesta: ['A los ', pt('10 s'), ', a ', px('100 m')] },
    { nivel: 3, titulo: 'El que salió antes',
      // Solo el mototaxi en el paradero: el instante de los dos juntos en x = 0 no existe (auditoría, M6).
      figura: avenida(Object.assign(regla(0, 200), { vehiculo: false, x0: 0, v: 10, t: 0, segundos: 0, rotulos: false, lugares: PARADERO,
        segundo: { tipo: 'mototaxi', x0: 0, v: 6 }, nota: 'La combi sale 10 s después.' })),
      enunciado: ['Un mototaxi sale del paradero a 6 m/s. 10 s después sale la combi del mismo paradero, a 10 m/s, por el mismo camino. ¿Cuánto tarda la combi en alcanzarlo?'],
      alternativas: ALT_A4.antes,
      datos: [DM.encuentro, DM.cierre, DM.recorre],
      solucion: [
        { texto: 'Cuando sale la combi, el mototaxi ya avanzó 6 · 10 = 60 m: esa es la separación.', ecuacion: [MD, ' = ', pv('6 m/s'), ' · ', pt('10 s'), ' = ', pD('60 m')] },
        { texto: 'Desde ahí, la combi gana 4 m cada segundo.', ecuacion: [Mtalc, ' = ', frac(pD('60 m'), [pv('10'), ' − ', pv('6 m/s')]), ' = ', pt('15 s')] },
        { texto: ['La ', letra(ALT_A4.antes, '25 s'), ' cuenta desde que salió el mototaxi; la ', letra(ALT_A4.antes, '6 s'), ' supone que el mototaxi se detiene.'] },
      ],
      respuesta: [letra(ALT_A4.antes, '15 s'), ', ', pt('15 s')] },
    { nivel: 3, titulo: 'Lo que avanza el que huye',
      figura: dos(0, 200, [0, 9], [80, 5]),
      enunciado: ['Un mototaxi a 5 m/s va 80 m delante de una combi a 9 m/s, hacia el mismo lado. ¿Qué distancia recorre el mototaxi hasta que la combi lo alcanza?'],
      alternativas: ALT_A4.huye,
      datos: [DM.encuentro, DM.cierre, DM.recorre],
      solucion: [
        { texto: 'La combi gana 4 m cada segundo.', ecuacion: [Mtalc, ' = ', frac(pD('80 m'), [pv('9'), ' − ', pv('5 m/s')]), ' = ', pt('20 s')] },
        { texto: 'En esos 20 s, el mototaxi recorre:', ecuacion: [pv('5 m/s'), ' · ', pt('20 s'), ' = 100 m'] },
        { texto: ['La ', letra(ALT_A4.huye, '180 m'), ' es lo que recorre la combi, el perseguidor.'] },
      ],
      respuesta: [letra(ALT_A4.huye, '100 m'), ', 100 m'] },
    { nivel: 3, titulo: 'De frente en km/h',
      figura: dos(0, 1500, [0, 20, '72 km/h'], [1500, -10, '36 km/h']),
      enunciado: ['Una combi a 72 km/h y un mototaxi a 36 km/h van de frente por una carretera recta, separados 1,5 km. ¿Cuándo se cruzan?'],
      alternativas: ALT_A4.kmh,
      datos: [DM.encuentro, DM.cierre, DM.kmh],
      solucion: [
        { texto: 'Todo a metros y segundos: 20 m/s y 10 m/s; la separación, 1500 m.' },
        { texto: 'Se acercan 30 m cada segundo.', ecuacion: [Mte, ' = ', frac(pD('1500 m'), [pv('20'), ' + ', pv('10 m/s')]), ' = ', pt('50 s')] },
        { texto: ['La ', letra(ALT_A4.kmh, '13,9 s'), ' divide 1500 entre 108 sin pasar a m/s; la ', letra(ALT_A4.kmh, '150 s'), ' resta las rapideces.'] },
      ],
      respuesta: [letra(ALT_A4.kmh, '50 s'), ', ', pt('50 s')] },
    { nivel: 3, titulo: 'Dos veces a 50 m',
      figura: dos(0, 200, [0, 6], [200, -4]),
      enunciado: ['Una combi a 6 m/s y un mototaxi a 4 m/s van de frente, separados 200 m. ¿En qué instantes están a 50 m uno del otro?'],
      alternativas: ALT_A4.dosVeces,
      datos: [DM.cierre, 'Separación: la distancia entre los dos, sin signo.'],
      solucion: [
        { texto: 'Se acercan 10\u00a0m cada segundo. Están a 50\u00a0m cuando ya se acercaron 200\u00a0m − 50\u00a0m = 150\u00a0m:', ecuacion: [Mt, ' = ', frac(pD('150 m'), pv('10 m/s')), ' = ', pt('15 s')] },
        { texto: 'Se cruzan a los 20\u00a0s y se alejan. Vuelven a estar a 50\u00a0m cuando entre los dos avanzaron 200\u00a0m + 50\u00a0m = 250\u00a0m:', ecuacion: [Mt, ' = ', frac(pD('250 m'), pv('10 m/s')), ' = ', pt('25 s')] },
        { texto: ['La ', letra(ALT_A4.dosVeces, '15 s'), ' olvida que, tras cruzarse, vuelven a estar a 50 m; la ', letra(ALT_A4.dosVeces, '5 s y 25 s'), ' divide 50 m entre 10 m/s.'] },
      ],
      respuesta: [letra(ALT_A4.dosVeces, '15 s y 25 s'), ', a los ', pt('15 s'), ' y a los ', pt('25 s')] },
    { nivel: 3, titulo: 'Le saca ventaja',
      figura: dos(0, 120, [0, 12], [40, 7]),
      enunciado: ['Una combi a 12 m/s va 40 m detrás de un mototaxi a 7 m/s, hacia el mismo lado. ¿A los cuántos segundos la combi le lleva 20 m de ventaja?'],
      alternativas: ALT_A4.ventaja,
      datos: [DM.cierre, 'Ventaja: cuánto va delante la combi del mototaxi.'],
      solucion: [
        { texto: 'La combi gana 5 m cada segundo. Tiene que descontar 40 m y sacar 20 m: 60 m en total.' },
        { texto: 'El tiempo:', ecuacion: [Mt, ' = ', frac(pD('60 m'), [pv('12'), ' − ', pv('7 m/s')]), ' = ', pt('12 s')] },
        { texto: ['La ', letra(ALT_A4.ventaja, '8 s'), ' es el alcance: ahí van juntos, sin ventaja.'] },
      ],
      respuesta: [letra(ALT_A4.ventaja, '12 s'), ', a los ', pt('12 s')] },
  ];

  const encuentro = {
    id: 'encuentro',
    titulo: 'Encuentros y alcances',
    pregunta: '¿Cuándo se cruzan una combi y un mototaxi que van de frente?',
    temas: ['MRU y velocidad relativa'],
    pieza: 'fis-combi',
    aprendizaje: 'Se encuentran si están en el mismo lugar a la vez. De frente, D se cierra con la suma de rapideces; persiguiéndose, con la resta.',
    actividad: 'Elegir las rapideces de la combi y del mototaxi para que se crucen.',
    lee: {
      tarjetas: [
        { titulo: 'Encontrarse', texto: 'Dos móviles se encuentran cuando están en la misma posición en el mismo instante: los dos en la misma marca de la regla, cuando el reloj marca lo mismo.',
          dibujo: juegoA4({ va: 6, vb: 6, t: 0 }) },
        { titulo: 'La separación D', texto: ['Al empezar, entre los dos hay una separación ', MD, '. Si se acercan, ', MD, ' se achica; cuando llega a 0, es el encuentro.'] },
        { titulo: 'Dos reglas, un reloj', texto: ['Cada uno tiene su regla ', Mx, ' = ', Mx0, ' + ', Mv, ' · ', Mt, ', con el mismo reloj. El que va hacia el lado − lleva su velocidad negativa.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir qué tan rápido va cada uno. Mira cuánto se achica la separación en cada segundo.' },
      ],
    },
    ejemplos: EJEMPLOS_ENCUENTRO,
    juega: {
      pieza: 'fis-combi',
      consigna: 'La combi sale del paradero y el mototaxi del mercado, a 240 m, a la vez y de frente.',
      mision: {
        texto: 'Haz que se crucen justo frente al colegio, a 150 m del paradero.',
        // Se cruzan en x = 240·va/(va + vb): frente al colegio si va : vb = 5 : 3 (5 y 3, o 10 y 6 m/s).
        logrado: val => COLEGIO * (val.va + val.vb) === D_A4 * val.va,
        bien: 'Listo: se cruzan frente al colegio. ¿Hay otra pareja de rapideces?',
      },
      voz: 'Mira cuánto se achica la separación en cada segundo.',
      leyenda: [
        { s: 'combi', t: 'sale del paradero hacia el lado +' },
        { s: 'mototaxi', t: 'sale del mercado hacia el lado −' },
        { s: [Mt], t: 'segundos desde que salen los dos' },
        { s: 'm', t: 'metros de la regla, desde el paradero' },
      ],
      controles: [
        { id: 'va', etiqueta: 'Rapidez de la combi', color: 'c-o', min: 2, max: 12, paso: 1, inicio: 6, unidad: 'm/s', decimales: 0 },
        { id: 'vb', etiqueta: 'Rapidez del mototaxi', color: 'c-o', min: 2, max: 12, paso: 1, inicio: 6, unidad: 'm/s', decimales: 0 },
        { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: T_A4, paso: 0.05, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 5, modo: 'repite' } },
      ],
      dibujo: juegoA4,
      lectura: val => {
        const { te, xe } = cruceA4(val);
        if (val.t >= te) return ['Se cruzaron a los ', pt(`${f(te, 2)} s`), ', en ', px(`x = ${f(xe, 2)} m`)];
        return ['Se acercan ', pv(fm(val.va)), ' + ', pv(fm(val.vb)), ' = ', pv(`${fm(val.va + val.vb)} m`), ' cada segundo'];
      },
      resumen: { va: 6, vb: 6, t: 0 },
      minimo: 3,
      // Gesto directo: se arrastra dónde estará cada uno al primer segundo (lo que avanza en 1 s es su rapidez).
      arrastres: [
        { id: 'marca-combi', etiqueta: 'combi al primer segundo', color: 'c-o',
          donde: val => ({ x: escA4()(val.va), y: COMBI().constantes.AV.CARRIL - 10 }),
          mover: p => ({ va: inversa(escA4(), 0, D_A4)(p.x) }) },
        { id: 'marca-moto', etiqueta: 'mototaxi al primer segundo', color: 'c-o',
          donde: val => ({ x: escA4()(D_A4 - val.vb), y: COMBI().constantes.AV2.CARRIL2 - 10 }),
          mover: p => ({ vb: D_A4 - inversa(escA4(), 0, D_A4)(p.x) }) },
      ],
    },
    predice: {
      pregunta: 'Ahora el mototaxi va 60 m delante de la combi y los dos van hacia el lado +: el mototaxi a 6 m/s y la combi a 10 m/s. ¿Cuándo lo alcanza?',
      datos: ['Salen a la vez.'],
      opciones: [
        { id: 'c', texto: 'A los 15 s', correcta: true },
        { id: 'suma', texto: 'A los 3,75 s', error: 'VR-SUMA', siFuera: 'Sumar las rapideces sirve si van de frente. Aquí el mototaxi también se aleja.' },
        { id: 'quieto', texto: 'A los 6 s', error: 'VR-UNO', siFuera: 'Eso sería si el mototaxi estuviera quieto. También avanza, 6 m cada segundo.' },
        { id: 'igual', texto: 'Cuando los dos vayan igual de rápido', error: 'K1', siFuera: 'Ir igual de rápido no los junta. Alcanzarlo es estar en el mismo lugar.' },
      ],
      dibujo: dos(0, 200, PRED_A4.combi, PRED_A4.moto, { lugares: PARADERO }),
      revelar: dos(0, 200, PRED_A4.combi, PRED_A4.moto, { lugares: PARADERO, t: 15, posiciones: [{ en: 150, texto: 'alcance', color: 'f' }] }),
      coincide: 'Coincide: la combi gana 10 − 6 = 4 m cada segundo, y había 60 m.',
    },
    // «Mira» con la gráfica x–t de A2: cada vehículo es una recta (el mismo violeta, trazo distinto) y el alcance es el
    // cruce; en el cruce las pendientes son distintas.
    mira: {
      pieza: 'fis-xt',
      datos: Object.assign(plano(20, 0, 200), {
        lineas: [{ puntos: [[0, 0], [20, 200]], rotulo: 'combi', rotuloEn: 6, rotuloLado: 'abajo' }, { puntos: [[0, 60], [20, 180]], trazo: 'discontinua', rotulo: 'mototaxi', rotuloEn: 6 }],
        puntos: [{ t: 0, x: 60, color: 'f', desde: 1 }, { t: 15, x: 150, texto: '(15 s; 150 m)', color: 'f', lado: 'arribaIzq', desde: 2 }],
      }),
      pasos: [
        { estado: { corte: 0 }, texto: 'La combi es A; el mototaxi, B. Cada recta es la posición de uno.', ecuacion: [MxA, ' = ', pv('10'), Mt, ';   ', MxB, ' = ', px('60'), ' + ', pv('6'), Mt] },
        { estado: { corte: 1 }, texto: 'Al salir, el mototaxi está 60 m delante.', ecuacion: [MD, ' = ', pD('60 m')] },
        { estado: { corte: 1 }, texto: 'Cada segundo la combi gana 10 − 6 = 4 m.', ecuacion: [pv('10'), ' − ', pv('6'), ' = ', pv('4 m/s')] },
        { estado: { corte: 2 }, texto: 'La alcanza donde las rectas se cruzan: misma x, mismo t.', ecuacion: [pv('10'), Mt, ' = ', px('60'), ' + ', pv('6'), Mt, '  →  ', Mt, ' = ', frac(pD('60'), pv('4')), ' = ', pt('15 s')] },
        { estado: { corte: 2 }, texto: 'Los dos están en 150 m, pero no van igual de rápido.', ecuacion: [MxA, ' = ', pv('10'), ' · ', pt('15'), ' = ', px('150 m')] },
      ],
    },
    regla: {
      // Con el eje con signo de la unidad (auditoría, A2): A empieza a la izquierda de B y cada v lleva su signo, así que
      // una sola fórmula sirve de frente (v_B < 0) y al alcance. La línea de la academia la traduce a rapideces, como la
      // idea 1 traduce x₀ ± v · t.
      // Ronda 2: el lector no veía cómo «la academia suma de frente» cuadra con la resta; se dice que v_B es negativa.
      texto: 'A empieza a la izquierda; cada v lleva signo. De frente, v de B es negativa: la resta suma. Con rapideces, la academia suma de frente y resta al alcance.',
      ecuacion: [MxA, ' = ', MxB, '   ;   ', Mte, ' = ', frac(MD, [MvA, ' − ', MvB])],
      condicion: 'tₑ: instante del encuentro; D: separación al empezar. Ambos en MRU; si uno sale antes, D se mide al salir el otro.',
    },
    resuelve: {
      pieza: 'fis-combi',
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const va = r.ent(6, 14), vb = r.ent(3, 9), te = r.ent(4, 12), D = (va + vb) * te, xe = va * te;
          return {
            enunciado: ['Una combi sale del paradero a ', pv(`${va} m/s`), ' y, a la vez, un mototaxi viene de frente desde ', pD(`${D} m`), ' a ', pv(`${vb} m/s`), '. ¿A qué distancia del paradero se cruzan?'],
            datos: [DM.encuentro, DM.pos, DM.eje],
            dibujo: dos(0, D, [0, va], [D, -vb], { lugares: PARADERO, posiciones: [{ en: D, texto: `${D} m` }] }),
            pasos: [
              { tipo: 'pide', texto: ['Piden la posición del cruce, ', Mx, ', medida desde el paradero.'] },
              { tipo: 'datos', texto: ['La combi sale de 0 a ', pv(`${va} m/s`), '; el mototaxi sale de ', px(`${D} m`), ' hacia el lado −, a ', pv(`${vb} m/s`), '.'] },
              { tipo: 'regla', texto: ['Se cruzan cuando ', MxA, ' = ', MxB, ': las dos reglas de posición dan lo mismo en el mismo instante.'] },
              { tipo: 'cuentas', texto: 'Se igualan las posiciones y se despeja el instante.', ecuacion: [pv(va), Mt, ' = ', px(D), ' − ', pv(vb), Mt, '  →  ', Mt, ' = ', frac(pD(D), pv(va + vb)), ' = ', pt(`${te} s`)] },
              { tipo: 'cuentas', texto: 'Se reemplaza en la posición de la combi.', ecuacion: [MxA, ' = ', pv(va), ' · ', pt(te), ' = ', px(`${xe} m`)] },
              { tipo: 'sentido', texto: `Comprobación: el mototaxi está en ${D} − ${vb} · ${te} = ${D - vb * te} m. Coinciden.` },
            ],
            respuesta: ['A ', px(`${xe} m`), ' del paradero'],
          };
        }
        const vb = r.ent(3, 8), va = vb + r.ent(2, 5), t = r.ent(5, 15), D = (va - vb) * t, xe = va * t;
        return {
          enunciado: ['Un mototaxi va ', pD(`${D} m`), ' delante de una combi, a ', pv(`${vb} m/s`), '; la combi lo sigue a ', pv(`${va} m/s`), '. ¿A qué distancia de donde salió la combi lo alcanza?'],
          datos: [DM.encuentro, DM.pos],
          dibujo: dos(0, Math.ceil((xe + 20) / 50) * 50, [0, va], [D, vb]),
          pasos: [
            { tipo: 'pide', texto: ['Piden dónde la combi alcanza al mototaxi, ', Mx, ', medido desde donde salió la combi.'] },
            { tipo: 'datos', texto: ['La combi sale de 0 a ', pv(`${va} m/s`), '; el mototaxi, de ', px(`${D} m`), ' a ', pv(`${vb} m/s`), ', hacia el mismo lado.'] },
            { tipo: 'regla', texto: ['Lo alcanza cuando ', MxA, ' = ', MxB, ', en el mismo instante.'] },
            { tipo: 'cuentas', texto: 'Se igualan las posiciones y se despeja el instante.', ecuacion: [pv(va), Mt, ' = ', px(D), ' + ', pv(vb), Mt, '  →  ', Mt, ' = ', frac(pD(D), pv(va - vb)), ' = ', pt(`${t} s`)] },
            { tipo: 'cuentas', texto: 'Se reemplaza en la posición de la combi.', ecuacion: [MxA, ' = ', pv(va), ' · ', pt(t), ' = ', px(`${xe} m`)] },
            { tipo: 'sentido', texto: `Comprobación: el mototaxi está en ${D} + ${vb} · ${t} = ${D + vb * t} m. Coinciden.` },
          ],
          respuesta: ['A ', px(`${xe} m`), ' de donde salió'],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-combi',
      generar(s) {
        const r = azar(s + 71), k = s % 4, en = n => `A los ${fm(n)} s`, tarda = n => `Tarda ${fm(n)} s`;
        const cuatro = (bien, ds) => opciones(bien, ds, en).slice(0, 4);
        if (k === 0) {
          const va = r.ent(5, 12), vb0 = r.ent(3, 9), vb = vb0 === va ? vb0 - 1 : vb0, te = r.ent(4, 12), D = (va + vb) * te;
          return {
            pregunta: ['Una combi sale del paradero a ', pv(`${va} m/s`), ' y, a la vez, un mototaxi viene de frente desde ', pD(`${D} m`), ' a ', pv(`${vb} m/s`), '. ¿Cuándo se cruzan?'],
            datos: [DM.encuentro, DM.cierre, DM.eje],
            dibujo: dos(0, D, [0, va], [D, -vb], { lugares: PARADERO, posiciones: [{ en: D, texto: `${D} m` }] }),
            opciones: cuatro(te, [
              { id: 'resta', valor: va !== vb ? D / Math.abs(va - vb) : NaN, error: 'VR-RESTA', siFuera: 'Restar las rapideces sirve si van al mismo lado. Aquí van uno hacia el otro.' },
              { id: 'uno', valor: D / va, error: 'VR-UNO', siFuera: 'Eso sería si el mototaxi se quedara quieto. Él también se acerca.' },
              { id: 'pos', valor: va * te, error: 'VR-POSICION', siFuera: `${fm(va * te)} es dónde se cruzan, en metros, no cuándo.` },
              { id: 'otro', valor: D / vb, error: 'VR-UNO', siFuera: 'Eso sería si la combi se quedara quieta. Las dos se acercan.' },
            ]),
            solucion: { texto: `Se acercan ${va} + ${vb} = ${va + vb} m cada segundo.`, ecuacion: [Mte, ' = ', frac(pD(`${D} m`), pv(`${va + vb} m/s`)), ' = ', pt(`${te} s`)] },
          };
        }
        if (k === 1) {
          const vb = r.ent(3, 8), va = vb + r.ent(1, 5), t = r.ent(5, 15), D = (va - vb) * t;
          return {
            pregunta: ['Un mototaxi va ', pD(`${D} m`), ' delante de una combi, a ', pv(`${vb} m/s`), '; la combi lo sigue a ', pv(`${va} m/s`), ', hacia el mismo lado. ¿Cuándo lo alcanza?'],
            datos: [DM.encuentro, DM.cierre],
            dibujo: dos(0, Math.ceil((va * t + 20) / 50) * 50, [0, va], [D, vb]),
            opciones: cuatro(t, [
              { id: 'suma', valor: D / (va + vb), error: 'VR-SUMA', siFuera: 'Sumar las rapideces sirve si van de frente. Aquí el mototaxi también se aleja.' },
              { id: 'uno', valor: D / va, error: 'VR-UNO', siFuera: 'Eso sería si el mototaxi estuviera quieto. También avanza.' },
              { id: 'pos', valor: va * t, error: 'VR-POSICION', siFuera: `${fm(va * t)} es dónde lo alcanza, en metros, no cuándo.` },
            ]),
            solucion: { texto: `La combi gana ${va} − ${vb} = ${va - vb} m cada segundo.`, ecuacion: [Mtalc, ' = ', frac(pD(`${D} m`), pv(`${va - vb} m/s`)), ' = ', pt(`${t} s`)] },
          };
        }
        if (k === 2) {
          // San Marcos 2021: el que salió antes.
          const vb = r.ent(3, 8), va = vb + r.ent(2, 6), dt = r.ent(2, 6) * 5, D = vb * dt;
          const t = D / (va - vb);
          return {
            pregunta: ['Un mototaxi sale del paradero a ', pv(`${vb} m/s`), '. ', pt(`${dt} s`), ' después sale una combi del mismo paradero, a ', pv(`${va} m/s`), ', por el mismo camino. ¿Cuánto tarda la combi en alcanzarlo?'],
            datos: [DM.encuentro, DM.cierre, DM.recorre],
            // Solo el mototaxi en el paradero, como en el ejemplo (auditoría, M6): la ventaja D es el primer paso.
            dibujo: avenida(Object.assign(regla(0, Math.ceil((D + vb * t + 20) / 50) * 50), { vehiculo: false, x0: 0, v: va, t: 0, segundos: 0, rotulos: false,
              lugares: PARADERO, segundo: { tipo: 'mototaxi', x0: 0, v: vb }, nota: `La combi sale ${dt} s después.` })),
            opciones: opciones(t, [
              { id: 'reloj', valor: t + dt, error: 'VR-RELOJ', siFuera: `Bien el alcance. Pero eso cuenta desde que salió el mototaxi; la combi tarda ${dt} s menos.` },
              { id: 'uno', valor: D / va, error: 'VR-UNO', siFuera: `Bien los ${fm(D)} m de ventaja. Pero el mototaxi sigue avanzando.` },
              { id: 'suma', valor: D / (va + vb), error: 'VR-SUMA', siFuera: 'Sumar las rapideces sirve si van de frente. Aquí van al mismo lado.' },
              { id: 'sin-ventaja', valor: dt, error: 'VR-VENTAJA', siFuera: `${dt} s es cuánto salió antes el mototaxi, no lo que tarda el alcance.` },
            ], tarda).slice(0, 4),
            solucion: { texto: `Al salir la combi, el mototaxi lleva ${vb} · ${dt} = ${D} m de ventaja.`, ecuacion: [Mtalc, ' = ', frac(pD(`${D} m`), pv(`${va - vb} m/s`)), ' = ', pt(`${fm(t)} s`)] },
          };
        }
        // Nivel examen: el alcance con las rapideces en km/h.
        const kb = [18, 36][r.ent(0, 1)], ka = kb + [18, 36, 54][r.ent(0, 2)], va = ka / 3.6, vb = kb / 3.6, t = r.ent(4, 12) * 2, D = (va - vb) * t;
        return {
          pregunta: ['Un mototaxi a ', pv(`${kb} km/h`), ' va ', pD(`${fm(D)} m`), ' delante de una combi a ', pv(`${ka} km/h`), ', hacia el mismo lado. ¿Cuánto tarda la combi en alcanzarlo?'],
          datos: [DM.encuentro, DM.cierre, DM.kmh],
          dibujo: dos(0, Math.ceil((va * t + 20) / 50) * 50, [0, va, `${ka} km/h`], [D, vb, `${kb} km/h`]),
          opciones: opciones(t, [
            { id: 'kmh', valor: D / (ka - kb), error: 'U1-kmh', siFuera: 'Bien la resta. Pero en km/h: pasa las rapideces a m/s antes de dividir.' },
            { id: 'suma', valor: D / (va + vb), error: 'VR-SUMA', siFuera: 'Bien que pases a m/s. Pero van al mismo lado: se restan.' },
            { id: 'uno', valor: D / va, error: 'VR-UNO', siFuera: 'Eso sería si el mototaxi estuviera quieto. También avanza.' },
          ], tarda).slice(0, 4),
          solucion: { texto: `A m/s: ${fm(va)} y ${fm(vb)} m/s. La combi gana ${fm(va - vb)} m cada segundo.`, ecuacion: [Mtalc, ' = ', frac(pD(`${fm(D)} m`), pv(`${fm(va - vb)} m/s`)), ' = ', pt(`${t} s`)] },
        };
      },
    },
  };

  // ---------- Idea 5 (A5): velocidad relativa (18 nov, contrato «se entiende sin profesor») ----------
  // Pieza fis-ventana: tu combi A y la combi B en carriles vecinos, vistas desde la orilla de la carretera y desde tu
  // ventana. Cambia: la velocidad de B (también de frente) · Permanece: tu combi a 15 m/s · Progresa: el reloj, que mueve
  // los postes y a B · Se reserva: el río, que suma la corriente (solo en Predice) · Debe verse: desde A, B se mueve con la
  // diferencia de las velocidades; si es 0, parece quieta.
  const VA_A5 = 15, T_A5 = 4;
  const ventana = (d, estado = {}) => ({ pieza: 'fis-ventana', datos: d, estado });
  const rio = (d, estado = {}) => ({ pieza: 'fis-rio', datos: d, estado });
  const juegoA5 = val => ventana({ vA: VA_A5, vB: val.vb, t: Math.max(0, Math.min(val.t, T_A5)) });
  const PRED_A5 = { sentido: 'abajo', u: '5 m/s', c: '2 m/s' };

  // Ejemplos resueltos de A5. Cuentas rehechas con un script aparte que no usa este archivo (scratchpad f3w/cuentas.js,
  // 18 nov): 15 − 10; −8 − 12; 4 + 1,5; 4 − 1,5; 0 − 15; 120/(4 + 2); 72/3,6 − 54/3,6 y 100/5; (9 + 5)/2 y (9 − 5)/2;
  // 12 + (−4); 12/(15 − 10); 80/(5 + 3) + 80/(5 − 3); (4 + 6)·50 cm; 60/20 y 3 + 3; 40/(3 − 1) + 40/(3 + 1);
  // 54/3,6 + 36/3,6. Correcciones (18 nov, cuentas en el scratchpad cor-mru/cuentas.js): (7 + 3)/2 y (7 − 3)/2;
  // 60/40 = 1,5 y 2 + 1,5; (6 + 4)·50 cm con las placas del oeste y del este. Las figuras muestran las velocidades dadas; lo que se pide va con «?» y sin flecha (su sentido es
  // parte de la respuesta).
  const ALT_A5 = {
    ida: ['50 s', '32 s', '20 s', '10 s', '26,7 s'],
    placas: ['1 m', '2 m', '3 m', '5 m', '50 cm'],
    nino: ['1,5 m/s', '3,5 m/s', '0,5 m/s', '2 m/s', '0,75 m/s'],
    llamas: ['26,7 s', '20 s', '40 s', '13,3 s', '30 s'],
    frente: ['5 m/s', '18 m/s', '25 m/s', '90 m/s', '324 m/s'],
  };
  const EJEMPLOS_RELATIVA = [
    { nivel: 1, titulo: 'Se adelanta despacio',
      figura: ventana({ vA: 10, vB: 15, t: 0, rotuloRel: '?' }),
      enunciado: ['Tu combi va a 10 m/s y la del carril de al lado, a 15 m/s, hacia el mismo lado. ¿Con qué velocidad la ves desde tu ventana?'],
      datos: [DM.rel, DM.ejeCarretera],
      solucion: [{ texto: 'Tú eres A y la otra es B; las dos van hacia el lado +.', ecuacion: [MvBA, ' = ', pv('15'), ' − ', pv('10'), ' = ', pv('5 m/s')] }],
      respuesta: [pv('5 m/s'), ': se adelanta, hacia el lado +'] },
    { nivel: 1, titulo: 'Otra que viene de frente',
      figura: ventana({ vA: 12, vB: -8, t: 0, rotuloRel: '?' }),
      enunciado: ['Tu combi va a 12 m/s hacia el lado + y otra viene de frente a 8 m/s. ¿Con qué velocidad la ves desde tu ventana?'],
      datos: [DM.rel, DM.ejeCarretera],
      solucion: [{ texto: 'La otra va hacia el lado −: su velocidad es −8 m/s.', ecuacion: [MvBA, ' = ', pv('−8'), ' − ', pv('12'), ' = ', pv('−20 m/s')] }],
      respuesta: [pv('−20 m/s'), ': se te acerca a 20 m/s'] },
    { nivel: 1, titulo: 'Río abajo',
      figura: rio({ sentido: 'abajo', u: '4 m/s', c: '1,5 m/s' }),
      enunciado: ['Un bote avanza a 4 m/s respecto al agua, río abajo; la corriente va a 1,5 m/s. ¿Con qué rapidez lo ve pasar alguien en la orilla?'],
      datos: [DM.orilla, DM.rio],
      solucion: [{ texto: 'El agua lleva al bote hacia el mismo lado al que rema: se suman.', ecuacion: [Mv, ' = ', pv('4'), ' + ', pv('1,5'), ' = ', pv('5,5 m/s')] }],
      respuesta: [pv('5,5 m/s')] },
    { nivel: 1, titulo: 'Río arriba',
      figura: rio({ sentido: 'arriba', u: '4 m/s', c: '1,5 m/s' }),
      enunciado: ['El mismo bote rema río arriba, a 4 m/s respecto al agua; la corriente va a 1,5 m/s. ¿Con qué rapidez lo ve avanzar alguien en la orilla?'],
      datos: [DM.orilla, DM.rio],
      solucion: [{ texto: 'Ahora el bote va hacia el lado −, contra el agua que lo lleva hacia +.', ecuacion: [Mv, ' = ', pv('−4'), ' + ', pv('1,5'), ' = ', pv('−2,5 m/s')] }],
      respuesta: [pv('2,5 m/s'), ', río arriba'] },
    { nivel: 1, titulo: 'Los postes de la carretera',
      figura: ventana({ vA: 15, vB: 0, t: 0, sinB: true }),
      enunciado: ['Vas en una combi a 15 m/s por la carretera. ¿Con qué velocidad ves pasar los postes desde tu ventana?'],
      datos: [DM.rel, DM.ejeCarretera, 'Los postes están quietos en la carretera.'],
      solucion: [{ texto: 'Los postes son B, con velocidad 0 en la carretera.', ecuacion: [MvBA, ' = ', pv('0'), ' − ', pv('15'), ' = ', pv('−15 m/s')] }],
      respuesta: [pv('−15 m/s'), ': pasan hacia atrás, igual de rápido que tú'] },
    { nivel: 2, titulo: 'Un tramo río abajo',
      figura: rio({ sentido: 'abajo', u: '4 m/s', c: '2 m/s', cota: { de: 0.1, a: 0.9, texto: 'L = 120 m', color: 'f' } }),
      enunciado: ['Un bote rema río abajo a 4 m/s respecto al agua; la corriente va a 2 m/s. ¿Cuánto tarda en recorrer un tramo de 120 m de orilla?'],
      datos: [DM.orilla, DM.tramo, DM.rio],
      solucion: [
        { texto: 'Desde la orilla, la rapidez del bote:', ecuacion: [Mv, ' = ', pv('4'), ' + ', pv('2'), ' = ', pv('6 m/s')] },
        { texto: 'El tiempo del tramo:', ecuacion: [Mt, ' = ', frac(pL('120 m'), pv('6 m/s')), ' = ', pt('20 s')] },
      ],
      respuesta: ['Tarda ', pt('20 s')] },
    { nivel: 2, titulo: 'Sacar ventaja en km/h',
      figura: ventana({ vA: 15, vB: 20, t: 0, textoA: '54 km/h', textoB: '72 km/h', rotuloRel: '?' }),
      enunciado: ['Tu combi va a 54 km/h y la de al lado, a 72 km/h, hacia el mismo lado. ¿Cuánto tarda la otra en sacarte 100 m de ventaja?'],
      datos: [DM.rel, DM.kmh, DM.tramo],
      solucion: [
        { texto: 'A m/s: 54 km/h = 15 m/s y 72 km/h = 20 m/s. Desde tu ventana, la otra se adelanta:', ecuacion: [MvBA, ' = ', pv('20'), ' − ', pv('15'), ' = ', pv('5 m/s')] },
        { texto: 'Para alejarse 100 m a 5 m/s:', ecuacion: [Mt, ' = ', frac('100 m', pv('5 m/s')), ' = ', pt('20 s')] },
      ],
      respuesta: ['Tarda ', pt('20 s')] },
    { nivel: 2, titulo: 'La corriente desde dos viajes',
      figura: rio({ sentido: 'abajo', u: '?', c: '?' }),
      enunciado: ['Desde la orilla, un bote avanza a 7 m/s río abajo y a 3 m/s río arriba, remando siempre igual. ¿Cuánto valen su rapidez respecto al agua y la corriente?'],
      // Con el eje con signo de la regla (cabos de la Etapa 4, 19 nov): u es una velocidad, y río arriba vale −u. Antes
      // el resuelto usaba u y c como rapideces («u − c = 3»), el otro sentido de la letra.
      datos: [DM.orilla, DM.rio, DM.uc],
      solucion: [
        { texto: ['Desde la orilla va a 7 m/s río abajo y a −3 m/s río arriba, donde rema con −', Mu, '.'], ecuacion: [Mu, ' + ', Mc, ' = ', pv('7'), ';   −', Mu, ' + ', Mc, ' = ', pv('−3')] },
        { texto: ['Sumando las dos, 2', Mc, ' = 4; restándolas, 2', Mu, ' = 10.'], ecuacion: [Mu, ' = ', pv('5 m/s'), ';   ', Mc, ' = ', pv('2 m/s')] },
      ],
      respuesta: ['Rema a ', pv('5 m/s'), '; la corriente va a ', pv('2 m/s')] },
    { nivel: 2, titulo: 'Desde la combi rápida',
      figura: ventana({ vA: 12, vB: 8, t: 0, textoB: '?' }),
      enunciado: ['Desde tu combi, que va a 12 m/s, la del carril de al lado parece ir hacia atrás a 4 m/s. ¿Cuál es su velocidad, medida desde la carretera?'],
      datos: [DM.rel, DM.ejeCarretera],
      solucion: [
        { texto: 'Hacia atrás, desde ti, es el lado −:', ecuacion: [MvBA, ' = ', pv('−4 m/s')] },
        { texto: 'Se despeja la velocidad de B.', ecuacion: [MvB, ' = ', MvBA, ' + ', MvA, ' = ', pv('−4'), ' + ', pv('12'), ' = ', pv('8 m/s')] },
      ],
      respuesta: [pv('8 m/s'), ', hacia el mismo lado que tú'] },
    { nivel: 2, titulo: 'Pasar a otra combi',
      figura: ventana({ vA: 15, vB: 10, t: 0, rotuloRel: '?' }),
      enunciado: ['Tu combi, de 6 m, va a 15 m/s y pasa a otra de 6 m que va a 10 m/s. ¿Cuánto dura el adelanto, de tu frente en su cola a tu cola en su frente?'],
      datos: [DM.rel, DM.tramo],
      solucion: [
        { texto: 'Desde la otra combi, tú avanzas a 15 − 10 = 5 m/s y tienes que recorrer los dos largos.', ecuacion: [ML, ' = ', pL('6 m'), ' + ', pL('6 m'), ' = ', pL('12 m')] },
        { texto: 'El tiempo, con la velocidad vista desde ella:', ecuacion: [Mt, ' = ', frac(pL('12 m'), pv('5 m/s')), ' = ', pt('2,4 s')] },
      ],
      respuesta: ['Dura ', pt('2,4 s')] },
    { nivel: 3, titulo: 'El bote de ida y vuelta',
      figura: rio({ sentido: 'arriba', u: '5 m/s', c: '3 m/s', cota: { de: 0.1, a: 0.9, texto: 'L = 80 m', color: 'f' } }),
      enunciado: ['Un bote rema a 5 m/s respecto al agua en un río que corre a 3 m/s. Sube 80 m río arriba y vuelve. ¿Cuánto dura el viaje?'],
      alternativas: ALT_A5.ida,
      datos: [DM.orilla, DM.tramo, DM.rio],
      solucion: [
        { texto: 'Río arriba: −5 + 3 = −2 m/s, avanza a 2 m/s. Río abajo: 5 + 3 = 8 m/s.' },
        { texto: 'El tiempo de cada tramo, y la suma:', ecuacion: [frac(pL('80 m'), pv('2 m/s')), ' + ', frac(pL('80 m'), pv('8 m/s')), ' = ', pt('40 s'), ' + ', pt('10 s'), ' = ', pt('50 s')] },
        { texto: ['La ', letra(ALT_A5.ida, '32 s'), ' ignora la corriente: lo que gana a favor no compensa lo que pierde en contra.'] },
      ],
      respuesta: [letra(ALT_A5.ida, '50 s'), ', ', pt('50 s')] },
    { nivel: 3, titulo: 'Las placas que se acercan',
      enunciado: ['Respecto a una tercera placa, la placa del oeste avanza 4 cm por año hacia el este y la del este, 6 cm por año hacia el oeste, una hacia la otra. ¿Cuánto se acercan en 50 años?'],
      alternativas: ALT_A5.placas,
      datos: [DM.rel, 'Este es el sentido +; oeste, el −.', '1 m = 100 cm'],
      solucion: [
        { texto: 'Desde la placa del oeste, la otra se mueve con la diferencia de velocidades:', ecuacion: [pv('−6'), ' − ', pv('4'), ' = ', pv('−10 cm/año')] },
        { texto: 'En 50 años: 10 · 50 = 500 cm = 5 m.' },
        { texto: ['La ', letra(ALT_A5.placas, '1 m'), ' resta las rapideces: eso sería si fueran hacia el mismo lado.'] },
      ],
      respuesta: [letra(ALT_A5.placas, '5 m'), ', ', pD('5 m')] },
    { nivel: 3, titulo: 'Caminar sobre el bote',
      enunciado: ['Un bote de 30 m va río abajo a 2 m/s. Un niño camina de popa a proa y vuelve en 40 s, igual de rápido respecto al bote. ¿Su rapidez vista desde la orilla, hacia la proa?'],
      alternativas: ALT_A5.nino,
      datos: ['Proa: la punta de adelante; popa: la de atrás.', 'Los 2 m/s del bote se miden desde la orilla.', DM.orilla.replace('respecto al agua', 'respecto al bote').replace('del agua', 'del bote')],
      solucion: [
        { texto: 'Respecto al bote camina 60 m en 40 s:', ecuacion: [frac(pL('60 m'), pt('40 s')), ' = ', pv('1,5 m/s')] },
        { texto: 'Hacia la proa camina hacia donde va el bote: desde la orilla se suman.', ecuacion: [Mv, ' = ', pv('2'), ' + ', pv('1,5'), ' = ', pv('3,5 m/s')] },
        { texto: ['La ', letra(ALT_A5.nino, '1,5 m/s'), ' es su rapidez respecto al bote; la ', letra(ALT_A5.nino, '0,5 m/s'), ' sería al volver; la ', letra(ALT_A5.nino, '2 m/s'), ' es solo el bote.'] },
      ],
      respuesta: [letra(ALT_A5.nino, '3,5 m/s'), ', ', pv('3,5 m/s')] },
    { nivel: 3, titulo: 'El pastor y las llamas',
      // Ronda 2: «no tiene dibujo», «no dice quién es A y quién es B» y «solo explica la A». La figura marca lo que da
      // cada dato: la columna de 40 m que avanza a 1 m/s y el pastor que corre a 3 m/s, de ida y de vuelta.
      figura: pista({ largo: 50, paso: 10, numero: 20, valla: null, corredor: 0, mira: 'der', columna: { de: 0, a: 40, n: 4, v: '1 m/s', color: 'o' },
        tramos: [{ de: 0, a: 40, texto: '3 m/s', color: 'o' }, { de: 40, a: 0, texto: '3 m/s', color: 'o' }], dx: { a: 40, texto: 'L = 40 m', color: 'f' },
        lugares: [{ en: 0, texto: 'Cola' }, { en: 40, texto: 'Cabeza' }] }),
      enunciado: ['Una columna de llamas de 40 m avanza a 1 m/s. El pastor corre de la cola a la cabeza a 3 m/s y vuelve a la cola, también a 3 m/s. ¿Cuánto tarda?'],
      alternativas: ALT_A5.llamas,
      datos: [DM.rel, DM.tramo, 'Las rapideces se miden desde el suelo.', 'A: la columna; B: el pastor. + es hacia la cabeza.'],
      solucion: [
        { texto: 'Desde la columna, A, se mira al pastor, B. A la ida va hacia +, a 3 m/s; a la vuelta, hacia −.', ecuacion: [MvBA, ' = ', pv('3'), ' − ', pv('1'), ' = ', pv('2 m/s'), ';   ', MvBA, ' = ', pv('−3'), ' − ', pv('1'), ' = ', pv('−4 m/s')] },
        { texto: 'Recorre los 40 m de la columna dos veces, a 2 m/s y a 4 m/s:', ecuacion: [frac(pL('40 m'), pv('2 m/s')), ' + ', frac(pL('40 m'), pv('4 m/s')), ' = ', pt('20 s'), ' + ', pt('10 s'), ' = ', pt('30 s')] },
        { texto: ['La ', letra(ALT_A5.llamas, '26,7 s'), ' olvida que la columna avanza; la ', letra(ALT_A5.llamas, '20 s'), ' es solo la ida; la ', letra(ALT_A5.llamas, '40 s'), ' usa 2 m/s también al volver; la ', letra(ALT_A5.llamas, '13,3 s'), ' es 40 ÷ 3.'] },
      ],
      respuesta: [letra(ALT_A5.llamas, '30 s'), ', ', pt('30 s')] },
    { nivel: 3, titulo: 'De frente en km/h',
      figura: ventana({ vA: 15, vB: -10, t: 0, textoA: '54 km/h', textoB: '36 km/h', rotuloRel: '?' }),
      enunciado: ['Tu combi va a 54 km/h y otra viene de frente a 36 km/h. ¿Con qué rapidez la ves acercarse desde tu ventana, en m/s?'],
      alternativas: ALT_A5.frente,
      datos: [DM.rel, DM.kmh, DM.ejeCarretera],
      solucion: [
        { texto: 'A m/s: tú, 15 m/s; la otra, −10 m/s, porque viene en sentido contrario.' },
        { texto: 'Tú eres A y la otra es B:', ecuacion: [MvBA, ' = ', pv('−10'), ' − ', pv('15'), ' = ', pv('−25 m/s')] },
        { texto: ['Se acercan a 25 m/s. La ', letra(ALT_A5.frente, '5 m/s'), ' resta las rapideces; la ', letra(ALT_A5.frente, '90 m/s'), ' no pasa 90 km/h a m/s.'] },
      ],
      respuesta: [letra(ALT_A5.frente, '25 m/s'), ', ', pv('25 m/s')] },
  ];

  const relativa = {
    id: 'velocidad-relativa',
    titulo: 'Velocidad relativa',
    pregunta: '¿Qué tan rápido ves pasar otra combi desde tu ventana?',
    temas: ['MRU y velocidad relativa'],
    pieza: 'fis-ventana',
    aprendizaje: 'Un móvil ve a otro con la diferencia de velocidades: v_B/A = v_B − v_A. Desde la orilla, el bote suma la corriente.',
    actividad: 'Mirar desde tu combi otra que va por el carril de al lado.',
    lee: {
      tarjetas: [
        { titulo: 'Desde dónde se mira', texto: 'Una velocidad siempre se mide desde algo: desde la carretera, desde la orilla, desde tu asiento. Eso que tomas como quieto es el sistema de referencia.' },
        { titulo: 'Tu ventana', texto: 'Desde tu asiento, tu combi está quieta: no te alejas de ella. Los postes de la carretera, que están quietos, los ves pasar hacia atrás.',
          dibujo: ventana({ vA: VA_A5, vB: 0, t: 1, sinB: true, postes: true }) },
        { titulo: 'Cómo se escribe', texto: [MvBA, ' se lee «velocidad de B vista desde A»: es la velocidad relativa de B respecto a A. Cada velocidad lleva su signo, con + hacia la derecha.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Tú vas en la combi A a 15 m/s. Cambia la velocidad de la combi B y mira cómo la ves desde tu ventana.' },
      ],
    },
    ejemplos: EJEMPLOS_RELATIVA,
    juega: {
      pieza: 'fis-ventana',
      consigna: 'Vas en la combi A a 15 m/s por la carretera; por el carril de al lado va otra combi, B.',
      mision: {
        texto: 'Haz que, desde tu ventana, la combi B parezca quieta.',
        logrado: val => val.vb === VA_A5,
        bien: 'Listo: van igual de rápido y al mismo lado. Ninguna se aleja.',
      },
      voz: 'Compara las dos franjas: la de arriba y la de tu ventana.',
      leyenda: [
        { s: 'A', t: 'tu combi, la que te lleva' },
        { s: 'B', t: 'la otra combi, en el carril vecino' },
        { s: 'poste', t: 'quieto al borde de la carretera' },
        { s: [MvB], t: 'velocidad de B, medida desde la carretera' },
        { s: [MvBA], t: 'velocidad de B vista desde A' },
      ],
      controles: [
        { id: 'vb', etiqueta: 'Velocidad de B', color: 'c-o', min: -20, max: 20, paso: 5, inicio: 5, unidad: 'm/s', decimales: 0 },
        { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: T_A5 + 0.5, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 1, modo: 'repite' } },
      ],
      dibujo: juegoA5,
      lectura: val => ['Desde tu ventana: ', MvBA, ' = ', pv(fm(val.vb)), ' − ', pv(fm(VA_A5)), ' = ', pv(`${fm(val.vb - VA_A5)} m/s`)],
      resumen: { vb: 5, t: 2 },
      minimo: 3,
    },
    predice: {
      pieza: 'fis-rio',
      pregunta: 'Un bote va río abajo a 5 m/s respecto al agua; el río corre a 2 m/s. ¿Con qué rapidez lo ve pasar alguien parado en la orilla?',
      opciones: [
        { id: 'c', texto: '7 m/s', correcta: true },
        { id: 'sentido', texto: '3 m/s', error: 'REL-SENTIDO', siFuera: 'Restar serviría río arriba, contra la corriente. Aquí van hacia el mismo lado.' },
        { id: 'sin-marco', texto: '5 m/s', error: 'REL-SIN-MARCO', siFuera: 'Bien: el bote rema a 5 m/s. Pero eso es respecto al agua, y el agua también avanza.' },
        { id: 'pitagoras', texto: 'Unos 5,4 m/s', error: 'REL-PITAGORAS', siFuera: 'Pitágoras sirve si el bote cruza el río. Aquí todo va por la misma recta.' },
      ],
      dibujo: rio(PRED_A5),
      revelar: rio(Object.assign({}, PRED_A5, { total: { texto: '7 m/s' } })),
      coincide: 'Coincide: el agua lo lleva 2 m cada segundo, además de sus 5 m.',
    },
    mira: {
      pieza: 'fis-rio',
      datos: Object.assign({}, PRED_A5, { total: { texto: '7 m/s', desde: 2 } }),
      pasos: [
        { estado: { corte: 0 }, texto: 'u: la velocidad del bote respecto al agua, 5 m cada segundo.', ecuacion: [Mu, ' = ', pv('5 m/s'), ', respecto al agua'] },
        { estado: { corte: 1 }, texto: 'c: la velocidad de la corriente: el agua avanza 2 m cada segundo.', ecuacion: [Mc, ' = ', pv('2 m/s')] },
        { estado: { corte: 2 }, texto: 'Desde la orilla se suman: van hacia el mismo lado.', ecuacion: [Mv, ' = ', Mu, ' + ', Mc, ' = ', pv('5'), ' + ', pv('2'), ' = ', pv('7 m/s')] },
        { estado: { corte: 2 }, texto: 'Río arriba, u sería −5 m/s: desde la orilla, −5 + 2.', ecuacion: [Mv, ' = ', pv('−5'), ' + ', pv('2'), ' = ', pv('−3 m/s')] },
        { estado: { corte: 2 }, texto: 'Aquí no va Pitágoras: las dos velocidades están en la misma recta.' },
      ],
    },
    regla: {
      // Con el eje con signo de la unidad (auditoría, A2): u y c llevan su signo (+ río abajo) y la suma vale en los dos
      // sentidos. El dibujo es río arriba: u hacia −, más larga que u + c.
      // Ronda 2: «u + c sale más corta que u»: río arriba u es negativa, y la regla lo dice.
      // Cabos de la Etapa 4 (19 nov): la línea de la academia va en palabras, como la de A4 («suma de frente y resta al
      // alcance»): río abajo las dos cuentas son la misma suma; río arriba la academia resta. Antes decía «u ± c», con u
      // como rapidez: la misma letra con dos sentidos en una idea.
      texto: 'A ve a B con la diferencia de velocidades. Desde la orilla, v = u + c. Río arriba, u es negativa: v se acorta. Con rapideces, la academia resta río arriba: «±».',
      ecuacion: [MvBA, ' = ', MvB, ' − ', MvA, '   ;   ', 'desde la orilla: ', Mv, ' = ', Mu, ' + ', Mc],
      condicion: 'una misma recta, cada v con su signo (+ río abajo); u se mide desde el agua y c, desde la orilla.',
      dibujo: rio({ sentido: 'arriba', u: 'u', c: 'c', total: { texto: 'u + c' } }),
    },
    resuelve: {
      pieza: 'fis-rio',
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const vA = r.ent(8, 18), w = r.ent(2, 6), atras = r.ent(0, 1) === 1, vB = atras ? vA - w : vA + w;
          return {
            enunciado: ['Desde tu combi, que va a ', pv(`${vA} m/s`), ', la del carril de al lado parece ir hacia ', atras ? 'atrás' : 'adelante', ' a ', pv(`${w} m/s`), '. ¿Cuál es su velocidad, medida desde la carretera?'],
            datos: [DM.rel, DM.ejeCarretera],
            // Las dos combis (ronda 2: «es la única pantalla de "Así se resuelve" sin dibujo»). Lo que se pide, B desde la
            // carretera, va con «?» y sin flecha; abajo, lo que se ve desde la ventana, que es un dato.
            dibujo: ventana({ vA, vB, t: 0, textoB: '?' }),
            pasos: [
              { tipo: 'pide', texto: ['Piden ', MvB, ': la velocidad de la otra combi medida desde la carretera.'] },
              { tipo: 'datos', texto: ['Tú eres A: ', MvA, ' = ', pv(`${vA} m/s`), '. Desde ti, la otra va hacia ', atras ? 'atrás, el lado −' : 'adelante, el lado +', ': ', MvBA, ' = ', pv(`${fm(atras ? -w : w)} m/s`), '.'] },
              { tipo: 'regla', texto: ['La velocidad vista desde A: ', MvBA, ' = ', MvB, ' − ', MvA, '. Se despeja ', MvB, '.'] },
              { tipo: 'cuentas', texto: 'Se suma tu velocidad a lo que ves.', ecuacion: [MvB, ' = ', MvBA, ' + ', MvA, ' = ', pv(fm(atras ? -w : w)), ' + ', pv(vA), ' = ', pv(`${vB} m/s`)] },
              { tipo: 'sentido', texto: atras ? 'Va más lenta que tú, hacia el mismo lado: por eso la ves quedarse atrás.' : 'Va más rápido que tú: por eso la ves adelantarse.' },
            ],
            respuesta: [pv(`${vB} m/s`), ', hacia el mismo lado que tú'],
          };
        }
        // u ≤ 6 m/s: un bote a remo. Los dos tiempos salen enteros (t1 es múltiplo de u − c): con signo, −L/t2 se lee
        // exacto (antes podía salir «46,67 s»).
        const c = r.ent(1, 3), u = c + r.ent(2, 6 - c), t1 = (u - c) * r.ent(2, 5), L = (u + c) * t1, t2 = L / (u - c);
        return {
          enunciado: ['Remando igual, un bote recorre ', pL(`${L} m`), ' de orilla río abajo en ', pt(`${t1} s`), ' y los mismos ', pL(`${L} m`), ' río arriba en ', pt(`${fm(t2)} s`), '. ¿Cuánto vale la corriente?'],
          datos: [DM.orilla, DM.rio, DM.uc, DM.tramo],
          dibujo: rio({ sentido: 'abajo', u: '?', c: '?', cota: { de: 0.1, a: 0.9, texto: `L = ${L} m`, color: 'f' } }),
          pasos: [
            { tipo: 'pide', texto: ['Piden ', Mc, ', la velocidad de la corriente.'] },
            { tipo: 'datos', texto: ['Río abajo: ', pL(`${L} m`), ' en ', pt(`${t1} s`), '. Río arriba: lo mismo en ', pt(`${fm(t2)} s`), '.'] },
            // Con signo, como la regla (cabos de la Etapa 4, 19 nov): río arriba el bote va hacia el lado −, con −u
            // respecto al agua y con velocidad negativa desde la orilla. Antes: «u − c», con u como rapidez.
            { tipo: 'regla', texto: ['Desde la orilla, ', Mv, ' = ', Mu, ' + ', Mc, '. Río arriba el bote rema hacia el lado −: ', Mv, ' = −', Mu, ' + ', Mc, '.'] },
            // Las divisiones van en el texto y la ecuación queda corta: con las dos fracciones se partía a 390 px.
            { tipo: 'cuentas', texto: ['Río abajo: ', pL(L), ' ÷ ', pt(t1), ' = ', pv(`${u + c} m/s`), '. Río arriba, hacia el lado −: −', pL(L), ' ÷ ', pt(fm(t2)), ' = ', pv(`−${fm(u - c)} m/s`), '.'],
              ecuacion: [Mu, ' + ', Mc, ' = ', pv(u + c), ';   −', Mu, ' + ', Mc, ' = ', pv(`−${fm(u - c)}`)] },
            { tipo: 'cuentas', texto: ['Sumando las dos se va ', Mu, ' y queda 2', Mc, '.'], ecuacion: ['2', Mc, ' = ', pv(u + c), ' + (', pv(`−${fm(u - c)}`), ') = ', pv(2 * c), ';   ', Mc, ' = ', pv(`${c} m/s`)] },
            { tipo: 'sentido', texto: ['Comprobación: con ', Mu, ` = ${u} m/s, ${u} + ${c} = ${u + c} y −${u} + ${c} = −${u - c}: los dos viajes.`] },
          ],
          respuesta: ['La corriente va a ', pv(`${c} m/s`)],
        };
      },
    },
    ahoraTu: {
      pieza: 'fis-rio',
      generar(s) {
        const r = azar(s + 89), k = s % 4, ms = n => `${fm(n)} m/s`, seg = n => `${fm(n)} s`;
        const cuatro = (bien, ds, fmt = ms) => opciones(bien, ds, fmt).slice(0, 4);
        if (k === 0) {
          const vA = r.ent(6, 18), vB = r.ent(4, 20);
          const vB2 = vB === vA ? vB + 3 : vB;
          return {
            pregunta: ['Tu combi va a ', pv(ms(vA)), ' y la del carril de al lado, a ', pv(ms(vB2)), ', las dos hacia el lado +. ¿Con qué velocidad la ves desde tu ventana?'],
            datos: [DM.rel, DM.ejeCarretera],
            // Ronda 2: las dos combis, con lo que se pide en «?». vista: 'ventana' para que la prueba del tema, que dibuja
            // con ahoraTu.pieza (fis-rio), lo pase a fis-ventana (puente en fis-rio).
            dibujo: ventana({ vista: 'ventana', vA, vB: vB2, t: 0, rotuloRel: '?' }),
            opciones: cuatro(vB2 - vA, [
              { id: 'sentido', valor: vA - vB2, error: 'REL-SENTIDO', siFuera: 'Bien la resta. Pero al revés: es la velocidad de B menos la tuya.' },
              { id: 'suma', valor: vA + vB2, error: 'REL-SUMA', siFuera: 'Sumar sirve si van de frente. Aquí van hacia el mismo lado.' },
              { id: 'sin-marco', valor: vB2, error: 'REL-SIN-MARCO', siFuera: `Bien: B va a ${ms(vB2)}, pero medida desde la carretera, no desde ti.` },
              { id: 'solo-a', valor: -vA, error: 'REL-SOLO-A', siFuera: 'Así verías un poste, que está quieto. La otra combi también avanza.' },
            ]),
            solucion: { texto: vB2 > vA ? 'Va más rápido que tú: la ves adelantarse.' : 'Va más lenta que tú: la ves quedarse atrás.', ecuacion: [MvBA, ' = ', pv(vB2), ' − ', pv(vA), ' = ', pv(ms(vB2 - vA))] },
          };
        }
        if (k === 1) {
          const vA = r.ent(6, 16), w = r.ent(4, 16);
          return {
            pregunta: ['Tu combi va a ', pv(ms(vA)), ' hacia el lado + y otra viene de frente a ', pv(ms(w)), '. ¿Con qué velocidad la ves desde tu ventana?'],
            datos: [DM.rel, DM.ejeCarretera],
            dibujo: ventana({ vista: 'ventana', vA, vB: -w, t: 0, rotuloRel: '?' }),
            opciones: cuatro(-w - vA, [
              { id: 'signo', valor: w - vA, error: 'REL-SIGNO', siFuera: 'La otra va hacia el lado −: su velocidad es negativa antes de restar.' },
              { id: 'positivo', valor: w + vA, error: 'REL-SENTIDO', siFuera: `Bien: se acercan a ${ms(w + vA)}. Pero hacia ti es el lado −: lleva signo.` },
              { id: 'sin-marco', valor: -w, error: 'REL-SIN-MARCO', siFuera: 'Esa es su velocidad desde la carretera. Desde ti, se le resta la tuya.' },
              { id: 'solo-a', valor: -vA, error: 'REL-SOLO-A', siFuera: 'Así se verían los postes, que están quietos. La otra combi también se mueve.' },
            ]),
            solucion: { texto: `La otra va a −${fm(w)} m/s. Desde ti, se acerca más rápido.`, ecuacion: [MvBA, ' = ', pv(fm(-w)), ' − ', pv(vA), ' = ', pv(ms(-w - vA))] },
          };
        }
        // u ≤ 6 m/s respecto al agua y c ≤ 3 m/s (un bote a remo en un río de la sierra); u − c ≠ c: si no, dos errores dan lo mismo.
        const [u, c] = [[5, 3], [6, 2], [5, 1], [4, 1], [6, 1], [5, 2], [3, 1]][r.ent(0, 6)];
        if (k === 2) {
          const arriba = r.ent(0, 1) === 1, rap = arriba ? u - c : u + c, t = r.ent(2, 6) * 5, L = rap * t;
          return {
            pregunta: ['Un bote rema río ', arriba ? 'arriba' : 'abajo', ' a ', pv(ms(u)), ' respecto al agua; la corriente va a ', pv(ms(c)), '. ¿Cuánto tarda en recorrer ', pL(`${L} m`), ' de orilla?'],
            datos: [DM.orilla, DM.tramo, DM.rio],
            dibujo: rio({ sentido: arriba ? 'arriba' : 'abajo', u: ms(u), c: ms(c), cota: { de: 0.1, a: 0.9, texto: `L = ${L} m`, color: 'f' } }),
            opciones: cuatro(t, [
              { id: 'sin-marco', valor: L / u, error: 'REL-SIN-MARCO', siFuera: `Bien el tramo. Pero ${u} m/s es respecto al agua, y el agua también se mueve.` },
              { id: 'sentido', valor: L / (arriba ? u + c : u - c), error: 'REL-SENTIDO', siFuera: arriba ? 'Río arriba la corriente frena: se resta, no se suma.' : 'Río abajo la corriente ayuda: se suma, no se resta.' },
              { id: 'corriente', valor: L / c, error: 'REL-SOLO-RIO', siFuera: 'Eso sería un bote sin remar, llevado solo por el agua.' },
            ], seg),
            solucion: { texto: arriba ? `Río arriba, respecto al agua va a −${u} m/s: −${u} + ${c} = −${rap} m/s. Avanza a ${rap} m/s.` : `Desde la orilla, el bote va a ${u} + ${c} = ${rap} m/s.`, ecuacion: [Mt, ' = ', frac(pL(`${L} m`), pv(ms(rap))), ' = ', pt(seg(t))] },
          };
        }
        // Nivel examen: el bote sube un tramo y vuelve (la ida y la vuelta no se compensan).
        const L = (u + c) * (u - c) * r.ent(1, 3) * 2, t = L / (u - c) + L / (u + c);
        return {
          pregunta: ['Un bote rema a ', pv(ms(u)), ' respecto al agua en un río que corre a ', pv(ms(c)), '. Sube ', pL(`${L} m`), ' río arriba y vuelve. ¿Cuánto dura todo el viaje?'],
          datos: [DM.orilla, DM.tramo, DM.rio],
          dibujo: rio({ sentido: 'arriba', u: ms(u), c: ms(c), cota: { de: 0.1, a: 0.9, texto: `L = ${L} m`, color: 'f' } }),
          opciones: cuatro(t, [
            { id: 'sin-marco', valor: 2 * L / u, error: 'REL-SIN-MARCO', siFuera: 'Eso ignora la corriente: lo que gana a favor no compensa lo que pierde.' },
            { id: 'ida', valor: L / (u - c), error: 'REL-IDA', siFuera: 'Bien la subida. Falta sumar el tiempo de la vuelta, río abajo.' },
            { id: 'abajo', valor: 2 * L / (u + c), error: 'REL-SENTIDO', siFuera: 'Río abajo se suma, pero río arriba la corriente resta.' },
            { id: 'vuelta', valor: L / (u + c), error: 'REL-IDA', siFuera: 'Bien la bajada. Falta sumar el tiempo de la subida, contra la corriente.' },
          ], seg),
          solucion: { texto: `Sube: −${u} + ${c} = −${u - c} m/s, a ${u - c} m/s. Baja: ${u} + ${c} = ${u + c} m/s.`, ecuacion: [frac(pL(L), pv(u - c)), ' + ', frac(pL(L), pv(u + c)), ' = ', pt(seg(t))] },
        };
      },
    },
  };

  // Un color fijo por magnitud en las dos unidades del movimiento rectilíneo (cabecera; propuesta §6). L, el largo de
  // una combi o de una columna, es una longitud sobre la recta: violeta, como x y Δx.
  const COLORES = { velocidad: 'o', tiempo: 'i', posición: 'f', desplazamiento: 'f', separación: 'f', largo: 'f', aceleración: 'h' };

  // Laboratorio: el encuentro con todo libre (la separación, las dos rapideces y el sentido del mototaxi). Se queda el id
  // `encuentro-libre` (el avance de los alumnos lo guarda) y sus controles d, va y vb; ahora con la combi y el mototaxi.
  const D_MAX = 240;
  const libre = val => {
    const vr = val.va - val.vb, te = vr > 0 ? val.d / vr : Infinity, tt = Math.max(0, Math.min(val.t, te));
    return avenida(Object.assign(regla(0, D_MAX), { x0: 0, v: val.va, t: tt, segundos: 0, rotulos: false, lugares: PARADERO,
      segundo: { tipo: 'mototaxi', x0: val.d, v: val.vb }, posiciones: Number.isFinite(te) && val.t >= te ? [{ en: val.va * te, texto: 'encuentro', color: 'f' }] : [] }));
  };
  const escLibre = () => COMBI().escala(Object.assign({ vista: 'avenida' }, regla(0, D_MAX)));

  return {
    unidad: 'fisica.movimiento-rectilineo',
    version: '0.6.1',
    estado: 'completa',
    calidad: 2,
    requiere: ['/nucleo/kit/piezas/fis-combi.js', '/nucleo/kit/piezas/fis-sonido.js', '/nucleo/kit/piezas/fis-xt.js', '/nucleo/kit/piezas/fis-pista.js',
      '/nucleo/kit/piezas/fis-rio.js', '/nucleo/kit/piezas/fis-ventana.js'],
    colores: COLORES,
    // En una recta, las magnitudes con dirección son números con signo (decisiones, 18 nov): la unidad no escribe «⃗».
    notacion: { vectores: false, motivo: 'En una recta, v, a y Δx son números con signo sobre el eje: el signo hace de flecha. La flecha se dibuja sobre la combi y el eje lleva su «+».' },
    // Glosario del tema (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso. «desplazamiento» y
    // «distancia recorrida» se estrenan en Vectores; aquí el lector las marca igual, con «Viene de Vectores».
    // «aceleración», «caída libre» y «gravedad» se fueron con MRUV y caída libre. Ningún `simple` ni ejemplo afirma lo
    // que afirma un distractor de la idea que lo estrena.
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
      { termino: 'gráfica x–t', def: 'La gráfica de la posición x, hacia arriba, contra el tiempo t, hacia la derecha: un punto por cada instante.',
        simple: 'Un dibujo de dónde estaba en cada segundo, con el tiempo a lo ancho.',
        ejemplos: ['Una recta que sube: se aleja del cero hacia el lado +.', 'Una recta horizontal: está quieto.', 'Una recta que baja: va hacia el lado −.'],
        formas: ['gráfica x–t', 'gráficas x–t'], ver: ['pendiente', 'posición'] },
      { termino: 'pendiente', def: 'Cuánto sube una recta por cada paso hacia la derecha. En la gráfica x–t, es la velocidad.',
        simple: 'Cuánto sube una recta por cada paso hacia la derecha.',
        ejemplos: ['Una recta que sube 10 m por cada segundo tiene pendiente 10 m/s.', 'Una recta que baja tiene pendiente negativa.', 'Una recta horizontal tiene pendiente 0.'],
        formas: ['pendiente', 'pendientes'], ver: ['gráfica x–t'] },
      { termino: 'velocidad media', def: 'El desplazamiento dividido entre el tiempo que tomó: vₘ = Δx/Δt, con su signo.',
        simple: 'Cuánto te alejaste de donde empezaste, repartido en cada segundo.',
        ejemplos: ['Avanzar 100 m en 20 s: 5 m/s.', 'Retroceder 60 m en 15 s: −4 m/s.', 'Ir y volver al mismo sitio: velocidad media 0.'],
        formas: ['velocidad media', 'velocidades medias'], ver: ['rapidez media', 'velocidad'] },
      { termino: 'rapidez media', def: 'La distancia recorrida, todo el camino, dividida entre el tiempo que tomó. Nunca es negativa.',
        simple: 'Todo el camino que hiciste, repartido en cada segundo.',
        ejemplos: ['Correr 100 m en 20 s: 5 m/s.', 'Una combi que hace 30 km en media hora: 60 km/h.', 'Ir 60 m y volver 60 m en 30 s: 4 m/s.'],
        formas: ['rapidez media', 'rapideces medias'], ver: ['velocidad media', 'rapidez'] },
      { termino: 'encuentro', def: 'Cuando dos móviles están en la misma posición en el mismo instante.',
        simple: 'Cuando los dos están en el mismo lugar a la vez.',
        ejemplos: ['Una combi y un mototaxi que van de frente se encuentran al cruzarse.', 'En la gráfica x–t, el encuentro es donde se cortan las rectas.', 'Pasar por el mismo sitio a distinta hora no es encontrarse.'],
        formas: ['encuentro', 'encuentros'], ver: ['alcance'] },
      { termino: 'alcance', def: 'El encuentro de dos móviles que van hacia el mismo lado: el de atrás llega al de adelante.',
        simple: 'Cuando el que viene detrás llega al de adelante.',
        ejemplos: ['La combi a 10 m/s alcanza al mototaxi que va a 6 m/s.', 'Un atleta que llega al que corre delante de él.', 'Si el de atrás va más lento, la separación crece.'],
        formas: ['alcance', 'alcances'], ver: ['encuentro'] },
      { termino: 'instante', simbolo: 't', medida: 's', def: 'Un momento preciso del tiempo, como «a los 3 s».',
        simple: 'Un momento exacto: lo que marca el reloj.',
        ejemplos: ['A los 15 s: el instante del cruce.', 't = 0: el instante en que empezamos a contar.', 'Un intervalo, en cambio, va de un instante a otro.'],
        formas: ['instante', 'instantes'] },
      { termino: 'velocidad relativa', def: 'La velocidad de un móvil vista desde otro: la diferencia de sus velocidades, con signo.',
        simple: 'Qué tan rápido ves moverse algo desde donde tú estás.',
        ejemplos: ['Desde tu combi a 15 m/s, los postes pasan hacia atrás a 15 m/s.', 'Dos combis de frente se ven acercarse con la suma de sus rapideces.', 'Desde un bote, la orilla pasa hacia atrás.'],
        formas: ['velocidad relativa', 'velocidades relativas'], ver: ['sistema de referencia'] },
      { termino: 'sistema de referencia', def: 'Lo que se toma como quieto para medir posiciones y velocidades.',
        simple: 'Desde dónde miras: lo que tomas como quieto.',
        ejemplos: ['La carretera, para quien espera en el paradero.', 'Tu asiento, si vas dentro de la combi.', 'La orilla, para medir la velocidad de un bote.'],
        formas: ['sistema de referencia', 'sistemas de referencia'], ver: ['velocidad relativa'] },
    ],
    // Laboratorio: juego libre, sin preguntas. La pista con acelerador, «Ida y vuelta en v–t» y «La recta v–t» se fueron
    // con MRUV y caída libre (son de la aceleración y de la gráfica v–t). Las ideas sin mesa propia aportan su juego.
    laboratorio: [
      {
        id: 'encuentro-libre', titulo: 'Encuentro con todo libre', pieza: 'fis-combi',
        consigna: 'Elige dónde sale el mototaxi, qué tan rápido va cada uno y hacia dónde. Busca un encuentro a los 10 s.',
        controles: [
          { id: 'd', etiqueta: 'El mototaxi sale de', color: 'c-f', min: 60, max: D_MAX, paso: 20, inicio: 200, unidad: 'm', decimales: 0 },
          { id: 'va', etiqueta: 'Velocidad de la combi', color: 'c-o', min: 2, max: 12, paso: 1, inicio: 6, unidad: 'm/s', decimales: 0 },
          { id: 'vb', etiqueta: 'Velocidad del mototaxi', color: 'c-o', min: -12, max: 12, paso: 2, inicio: -4, unidad: 'm/s', decimales: 0 },
          { id: 't', etiqueta: 'Reloj, t', color: 'c-i', min: 0, max: 60, paso: 0.05, inicio: 0, unidad: 's', decimales: 1, auto: { velocidad: 5, modo: 'repite' } },
        ],
        dibujo: libre,
        lectura: val => {
          const vr = val.va - val.vb;
          return vr > 0 ? ['Se acercan ', pv(`${fm(vr)} m`), ' cada segundo: encuentro a los ', pt(`${f(val.d / vr, 2)} s`)] : ['La separación no se achica: no se encuentran'];
        },
        invitaciones: [
          { texto: 'Haz que se encuentren justo a los 10 s.', logrado: val => val.va - val.vb > 0 && Math.abs(val.d / (val.va - val.vb) - 10) < 1e-9 },
          { texto: 'Haz que la combi alcance al mototaxi, que va hacia el mismo lado.', logrado: val => val.vb > 0 && val.va > val.vb },
          { texto: 'Haz que nunca se encuentren.', logrado: val => val.va <= val.vb },
        ],
        arrastres: [
          { id: 'salida-moto', etiqueta: 'salida del mototaxi', color: 'c-f',
            donde: val => ({ x: escLibre()(val.d), y: COMBI().constantes.AV.EJE }),
            mover: p => ({ d: inversa(escLibre(), 0, D_MAX)(p.x) }) },
        ],
      },
    ],
    // A qué idea pertenece cada mesa (Gerson, 16 nov). La historia de Galileo se fue con la caída libre (propuesta §8).
    laboratorioIdeas: {
      'encuentro-libre': ['encuentro'],
    },
    ideas: [mru, graficaXt, medias, encuentro, relativa],
  };
});
