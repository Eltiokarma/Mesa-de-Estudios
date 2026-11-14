/*
 * Teoría de «Reducción al primer cuadrante» (trigonometria.reduccion-al-primer-cuadrante), 4.º de secundaria.
 * Fuente del contenido: docs/teoria/matriz/trigonometria.json (unidad 7), docs/teoria/fuentes/historia-ecuaciones.pdf
 * (trigonometría, pp. 82–100) y las «Precisiones de Geometría y Trigonometría» del expediente: la reducción puede
 * cambiar a la co-razón además del signo (corrección 1). Forma: contenido/teoria/trigonometria/angulo-trigonometrico.js.
 * Ruta: seguir un ejemplo, con apoyo de recordar.
 * Compañera: Mara (coneja), cercana y rigurosa: el signo se decide con el ángulo original, antes de reducir.
 * Colores (regla 4): el ángulo original θ en naranja (c-o), el ángulo de referencia agudo α en verde (c-d), la
 * abscisa x en turquesa (c-i) y la ordenada y en rojo (c-h).
 * Errores: TR11 (cruza x e y), TR12 (sin signo), TR14 (cambia o no cambia a la co-razón cuando no corresponde),
 * TR15 (el signo de −θ) de docs/investigacion/trigonometria-ideas-erroneas.md; hipótesis nuevas: TRRD-SIGNO-REF (toma
 * el signo del ángulo de referencia, siempre positivo), TRRD-ANALOGIA (aplica la regla de los suplementarios a los
 * de una vuelta) y TRRD-IGUALES (cree que las razones de ángulos relacionados son siempre iguales).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: cualquier razón de cualquier ángulo se escribe como ± una razón de un ángulo agudo, con su porqué.
 *   Persona y condiciones: postulante de 4.º, celular de 360 px de gama baja, con o sin conexión, en el aula o en casa.
 *   Resultado observable: reduce un ángulo mayor de una vuelta o negativo y justifica signo y función.
 *   Orden de atención: 1.º el punto del ángulo original · 2.º su reflejo agudo · acción: cambiar el ángulo · fondo: los ejes.
 *   Estados: juego sin tocar · probando · predicción pendiente · coincide / no coincide · paso de «Mira» · caso nuevo.
 *   Duda que resuelve: ¿cuándo se cambia seno por coseno, y de dónde sale el signo?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const th = { v: 'c-o', t: 'θ' }, al = { v: 'c-d', t: 'α' }, X = { v: 'c-i', t: 'x' }, Y = { v: 'c-h', t: 'y' };
  const rad = g => g * Math.PI / 180;
  const mod360 = x => ((x % 360) + 360) % 360;
  const cuadrante = g => { const m = mod360(g); return m % 90 === 0 ? 0 : Math.ceil(m / 90); };
  const ROM = ['un eje', 'I', 'II', 'III', 'IV'];
  const refDe = g => { const m = mod360(g); return m <= 90 ? m : m <= 180 ? 180 - m : m <= 270 ? m - 180 : 360 - m; };
  const FN = { sen: g => Math.sin(rad(g)), cos: g => Math.cos(rad(g)), tan: g => (Math.abs(Math.cos(rad(g))) < 1e-9 ? NaN : Math.tan(rad(g))), cot: g => (Math.abs(Math.sin(rad(g))) < 1e-9 ? NaN : 1 / Math.tan(rad(g))) };
  const CO = { sen: 'cos', cos: 'sen', tan: 'cot', cot: 'tan' };
  // Valor exacto como texto (ángulos múltiplos de 30° o 45°): 0,866… → «√3/2».
  const EXACTOS = [[0, '0'], [0.5, '1/2'], [Math.SQRT2 / 2, '√2/2'], [Math.sqrt(3) / 2, '√3/2'], [1, '1'], [Math.sqrt(3) / 3, '√3/3'], [Math.sqrt(3), '√3']];
  function exacto(v) {
    if (!Number.isFinite(v)) return 'no está definida';
    const e = EXACTOS.find(([n]) => Math.abs(Math.abs(v) - n) < 1e-9);
    return (v < -1e-9 ? '−' : '') + (e ? e[1] : f(Math.abs(v)));
  }
  const opuesto = t => (t === '0' || t === 'no está definida' ? t : t[0] === '−' ? t.slice(1) : '−' + t);
  function azar(sem) {
    let q = (sem * 2654435761 + 12345) >>> 0;
    const rr = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    rr.ent = (lo, hi) => lo + Math.floor(rr() * (hi - lo + 1));
    rr.uno = xs => xs[Math.floor(rr() * xs.length)];
    return rr;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }

  // ---------- Idea 1: el ángulo de referencia y el signo del cuadrante ----------
  // Cambia: el ángulo θ en la primera vuelta. · Permanece: la circunferencia de radio 1 y el reflejo agudo α en el I.
  // Progresa: el arco verde α, que mide siempre hasta el eje x. · Se reserva: el valor de cos 210° (la predicción; la
  // lectura da α y el cuadrante, no valores). · Debe verse: que P y su reflejo tienen las mismas medidas, con otro signo.
  function referencia(g, extra = {}) {
    const m = mod360(g), a = refDe(m), x = Math.cos(rad(m)), y = Math.sin(rad(m));
    const eje = m <= 90 ? 0 : m <= 270 ? 180 : 360;
    const q = cuadrante(m);
    return Object.assign({
      circulos: [{ r: 1 }],
      rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: m, color: 'o' }].concat(q > 1 ? [{ ang: a, largo: 1, color: 'd', discontinua: true, punta: false }] : []),
      segmentos: [{ de: [0, 0], a: [x, 0], color: 'i' }, { de: [x, 0], a: [x, y], color: 'h' }],
      arcos: [{ de: 0, a: m, r: 0.2, color: 'o', rotulo: m ? `${f(m)}°` : undefined }].concat(q > 1 ? [{ de: eje, a: m, r: 0.55, espiral: 0, flecha: false, color: 'd', rotulo: `${f(a)}°` }] : []),
      puntos: [{ x, y, rotulo: 'P' }].concat(q > 1 ? [{ x: Math.cos(rad(a)), y: Math.sin(rad(a)), abierto: true, rotulo: 'α' }] : []),
      alt: `Ángulo de ${f(m)} grados en el cuadrante ${ROM[q]}; su ángulo de referencia mide ${f(a)} grados`,
    }, extra);
  }
  const referenciaIdea = {
    id: 'angulo-referencia',
    titulo: 'Mismo tamaño, otro signo',
    temas: ['Ángulos menores de una vuelta'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Gira θ. El arco verde mide α, el ángulo agudo entre el lado final y el eje x. El punto hueco lo copia.',
      voz: 'Compara las alturas de P y de su copia.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-o', min: 15, max: 345, paso: 15, inicio: 150, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: referencia(val.g), estado: {} }),
      lectura: val => {
        const q = cuadrante(val.g);
        return q ? [th, ` = ${f(val.g)}° · cuadrante ${ROM[q]} · `, al, ` = ${f(refDe(val.g))}°`] : [th, ` = ${f(val.g)}° · sobre un eje`];
      },
      minimo: 4,
    },
    predice: {
      pregunta: 'Sabemos que cos 30° = √3/2. ¿Cuánto vale cos 210°?',
      voz: 'Busca primero el ángulo agudo y el cuadrante.',
      opciones: [
        { id: 'c', texto: '−√3/2', correcta: true },
        { id: 'signo', texto: '√3/2', error: 'TRRD-SIGNO-REF', siFuera: 'El tamaño √3/2 es correcto. Pero 210° está en el III: x es negativa.' },
        { id: 'co', texto: '−1/2', error: 'TR14', siFuera: 'El signo es correcto. Pero con 180° se conserva el coseno: no cambia a seno.' },
        { id: 'co-signo', texto: '1/2', error: 'TR11', siFuera: '1/2 es sen 30°, la altura. El coseno mide la abscisa.' },
      ],
      dibujo: { datos: { circulos: [{ r: 1 }], rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: 210, color: 'o' }], arcos: [{ de: 0, a: 210, r: 0.2, color: 'o', rotulo: '210°' }], puntos: [{ x: Math.cos(rad(210)), y: Math.sin(rad(210)), rotulo: 'P' }], alt: 'Ángulo de 210 grados en el tercer cuadrante, con su punto P' }, estado: {} },
      revelar: { datos: referencia(210, { rotulos: [{ x: -0.45, y: -0.68, texto: 'x = −√3/2', color: 'i' }] }), estado: {} },
      coincide: 'Coincide: la misma abscisa que en 30°, pero hacia la izquierda.',
      noCoincide: 'Revisemos: el punto de 210° está a la izquierda del eje y.',
    },
    mira: {
      datos: {
        circulos: [{ r: 1 }],
        rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: 210, color: 'o', desde: 1 }, { ang: 30, color: 'd', discontinua: true, punta: false, desde: 2 }],
        arcos: [{ de: 0, a: 210, r: 0.2, color: 'o', rotulo: '210°', desde: 1, hasta: 2 }, { de: 0, a: 210, r: 0.2, color: 'o', desde: 3 }, { de: 180, a: 210, r: 0.55, espiral: 0, flecha: false, color: 'd', rotulo: '30°', desde: 2 }],
        segmentos: [{ de: [0, 0], a: [Math.cos(rad(210)), 0], color: 'i', rotulo: '−√3/2', desde: 3 }, { de: [0, 0], a: [Math.cos(rad(30)), 0], color: 'i', discontinua: true, rotulo: '√3/2', desde: 3 }],
        puntos: [{ x: Math.cos(rad(210)), y: Math.sin(rad(210)), rotulo: 'P', desde: 1 }, { x: Math.cos(rad(30)), y: Math.sin(rad(30)), abierto: true, rotulo: 'α', desde: 2 }],
        alt: 'Ángulo de 210 grados y su referencia de 30 grados: abscisas del mismo largo y signo contrario',
      },
      voz: 'Primero el tamaño; el signo viene después.',
      pasos: [
        { estado: { corte: 1 }, texto: '210° termina en el tercer cuadrante.', ecuacion: [th, ' = 210° = 180° + 30°'] },
        { estado: { corte: 2 }, texto: 'El ángulo agudo con el eje x mide 30°: su referencia.', ecuacion: [al, ' = 210° − 180° = 30°'] },
        { estado: { corte: 3 }, texto: 'Las abscisas miden lo mismo; la de P es negativa.', ecuacion: ['cos 210° = −cos 30° = −', { frac: [{ raiz: ['3'] }, '2'] }] },
      ],
    },
    regla: {
      texto: 'Cada razón de θ es igual, salvo el signo, a la misma razón de su ángulo de referencia α. El signo lo da el cuadrante de θ.',
      ecuacion: ['sen(180° − ', al, ') = sen ', al, ';  cos(180° + ', al, ') = −cos ', al, ';  tan(360° − ', al, ') = −tan ', al],
      condicion: 'α es el ángulo agudo entre el lado final de θ y el eje x. El signo se decide con θ.',
      voz: 'El signo sale del ángulo original; el tamaño, del agudo.',
    },
    ahoraTu: {
      voz: 'Cuadrante primero, después el ángulo agudo.',
      generar(sem) {
        const rr = azar(sem), ref = rr.uno([30, 45, 60]), g = rr.uno([180 - ref, 180 + ref, 360 - ref]);
        const fn = ['sen', 'cos', 'tan'][sem % 3], bien = exacto(FN[fn](g)), co = exacto(FN[CO[fn]](ref));
        const q = cuadrante(g), signo = bien[0] === '−' ? '−' : '+';
        return {
          pregunta: [`¿Cuánto vale ${fn} ${f(g)}°?`],
          opciones: opciones(bien, [
            { id: 'signo', valor: opuesto(bien), error: 'TRRD-SIGNO-REF', siFuera: `El tamaño es el de ${fn} ${ref}°. El signo sale del cuadrante ${ROM[q]}, donde ${fn} es ${signo === '−' ? 'negativa' : 'positiva'}.` },
            { id: 'co', valor: signo === '−' ? opuesto(co) : co, error: 'TR14', siFuera: `El signo es correcto. Con 180° o 360° se conserva ${fn}: no cambia a ${CO[fn]}.` },
            { id: 'co-signo', valor: signo === '−' ? co : opuesto(co), error: 'TR11', siFuera: `Ese es el valor de ${CO[fn]} con otro signo: cambia la razón y el cuadrante.` },
          ], v => v),
          solucion: {
            texto: `${f(g)}° está en el cuadrante ${ROM[q]} y su referencia es ${ref}°.`,
            ecuacion: [`${fn} ${f(g)}° = ${signo === '−' ? '−' : ''}${fn} ${ref}° = ${bien}`],
            dibujo: { datos: referencia(g), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 2: con 90° o 270°, la razón cambia a su co-razón ----------
  // Cambia: el ángulo agudo α y el giro de un cuarto de vuelta (90° + α o 90° − α). · Permanece: P en α y la escala.
  // Progresa: el punto Q, que intercambia las coordenadas de P. · Se reserva: cos(90° + 20°) (la predicción; el control
  // va de 15° en 15°). · Debe verse: que la altura de P pasa a ser la abscisa de Q.
  function cuarto(a, tipo, extra = {}) {
    const g = tipo === 'mas' ? 90 + a : 90 - a;
    const px = Math.cos(rad(a)), py = Math.sin(rad(a)), qx = Math.cos(rad(g)), qy = Math.sin(rad(g));
    return Object.assign({
      circulos: [{ r: 1 }],
      rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: a, color: 'd' }, { ang: g, color: 'o' }],
      arcos: [{ de: 0, a, r: 0.25, color: 'd', rotulo: 'α' }, { de: 0, a: g, r: 0.45, espiral: 0, color: 'o', rotulo: `${f(g)}°` }],
      segmentos: [{ de: [px, 0], a: [px, py], color: 'h' }, { de: [0, 0], a: [qx, 0], color: 'i', grosor: 'variable' }],
      puntos: [{ x: px, y: py, rotulo: 'P' }, { x: qx, y: qy, rotulo: 'Q', lado: qx < 0 ? 'no' : 'ne' }],
      alt: `P en ${f(a)} grados y Q en ${f(g)} grados: la abscisa de Q mide lo que la altura de P`,
    }, extra);
  }
  const cofuncion = {
    id: 'cofuncion',
    titulo: 'Un cuarto de vuelta intercambia',
    temas: ['Ángulos menores de una vuelta'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige α y el giro. Q está a un cuarto de vuelta de P. Compara la altura roja de P y la abscisa de Q.',
      voz: 'Mira qué coordenada de P reaparece en Q.',
      controles: [
        { id: 'a', etiqueta: 'α', color: 'c-d', min: 15, max: 75, paso: 15, inicio: 30, unidad: '°', decimales: 0 },
        { id: 't', etiqueta: 'Q en', opciones: [{ valor: 'mas', texto: '90° + α' }, { valor: 'menos', texto: '90° − α' }] },
      ],
      dibujo: val => ({ datos: cuarto(val.a, val.t), estado: {} }),
      lectura: val => {
        const g = val.t === 'mas' ? 90 + val.a : 90 - val.a;
        return [`P(${f(Math.cos(rad(val.a)))}; ${f(Math.sin(rad(val.a)))}) · Q(${f(Math.cos(rad(g)))}; ${f(Math.sin(rad(g)))})`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: '¿A qué es igual cos(90° + 20°)?',
      voz: 'Piensa en qué coordenada de P termina como abscisa de Q.',
      opciones: [
        { id: 'c', texto: '−sen 20°', correcta: true },
        { id: 'misma', texto: '−cos 20°', error: 'TR14', siFuera: 'El signo es correcto: 110° está en el II. Pero el cuarto de vuelta cambia coseno por seno.' },
        { id: 'sin-signo', texto: 'sen 20°', error: 'TRRD-SIGNO-REF', siFuera: 'El cambio a seno es correcto. Pero 110° está en el II: el coseno es negativo.' },
        { id: 'igual', texto: 'cos 20°', error: 'TRRD-IGUALES', siFuera: 'Sería cierto con una vuelta completa, 360°. Con 90° cambian la razón y el signo.' },
      ],
      dibujo: { datos: { circulos: [{ r: 1 }], rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: 20, color: 'd' }, { ang: 110, color: 'o' }], arcos: [{ de: 0, a: 20, r: 0.25, color: 'd', rotulo: '20°' }, { de: 0, a: 110, r: 0.45, espiral: 0, color: 'o', rotulo: '110°' }], alt: 'Rayos de 20 y 110 grados' }, estado: {} },
      revelar: { datos: cuarto(20, 'mas', { rotulos: [{ x: -0.2, y: -0.2, texto: '−sen 20°', color: 'i' }] }), estado: {} },
      coincide: 'Coincide: la altura de P se volvió la abscisa de Q, hacia la izquierda.',
      noCoincide: 'Revisemos: el tramo turquesa de Q mide lo que el rojo de P.',
    },
    mira: {
      datos: {
        circulos: [{ r: 1 }],
        rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: 30, color: 'd', desde: 1 }, { ang: 120, color: 'o', desde: 2 }],
        arcos: [{ de: 0, a: 30, r: 0.25, color: 'd', rotulo: 'α', desde: 1 }, { de: 30, a: 120, r: 0.6, espiral: 0, color: 'o', rotulo: '+90°', desde: 2 }],
        segmentos: [
          { de: [0, 0], a: [0.866, 0], color: 'i', rotulo: '0,87', desde: 1 }, { de: [0.866, 0], a: [0.866, 0.5], color: 'h', rotulo: '0,5', desde: 1 },
          { de: [0, 0], a: [-0.5, 0], color: 'i', rotulo: '−0,5', desde: 3 }, { de: [-0.5, 0], a: [-0.5, 0.866], color: 'h', rotulo: '0,87', desde: 4 },
        ],
        puntos: [{ x: 0.866, y: 0.5, rotulo: 'P', desde: 1 }, { x: -0.5, y: 0.866, rotulo: 'Q', lado: 'no', desde: 2 }],
        alt: 'P en 30 grados y Q en 120 grados: Q tiene por abscisa menos la altura de P y por altura la abscisa de P',
      },
      voz: 'Sigue cada tramo: cambia de eje al girar.',
      pasos: [
        { estado: { corte: 1 }, texto: 'P en 30°: abscisa 0,87 y altura 0,5.', ecuacion: ['P(cos 30°; sen 30°)'] },
        { estado: { corte: 2 }, texto: 'Un cuarto de vuelta lleva P a Q, en 120°.', ecuacion: [th, ' = 90° + 30° = 120°'] },
        { estado: { corte: 3 }, texto: 'La altura de P pasa a ser la abscisa de Q, hacia la izquierda.', ecuacion: ['cos 120° = −sen 30°'] },
        { estado: { corte: 4 }, texto: 'La abscisa de P pasa a ser la altura de Q.', ecuacion: ['sen 120° = cos 30°'] },
      ],
    },
    regla: {
      texto: 'Con 90° o 270° la razón cambia a su co-razón: seno y coseno, tangente y cotangente. Con 180° o 360° se conserva. El signo, siempre del cuadrante de θ.',
      ecuacion: ['cos(90° + ', al, ') = −sen ', al, ';  sen(270° − ', al, ') = −cos ', al],
      condicion: 'Para decidir el signo, α se trata como agudo. Las igualdades valen después para todo α.',
      voz: 'Un cuarto de vuelta intercambia x e y; media vuelta solo las voltea.',
    },
    ahoraTu: {
      voz: 'Primero el cuadrante; después, si cambia la razón.',
      generar(sem) {
        const rr = azar(sem), a = rr.uno([10, 20, 25, 35, 40, 50, 55, 70]), k = [1, 3, 1, 2, 3][sem % 5], mas = rr.ent(0, 1) === 1;
        const fn = ['sen', 'cos', 'tan', 'cot'][rr.ent(0, 3)], g = 90 * k + (mas ? a : -a);
        const s = Math.sign(FN[fn](g)), sg = s < 0 ? '−' : '';
        const nueva = k % 2 ? CO[fn] : fn, otra = k % 2 ? fn : CO[fn];
        const txt = (sgn, fx) => `${sgn}${fx} ${a}°`;
        return {
          pregunta: [`¿A qué es igual ${fn}(${90 * k}° ${mas ? '+' : '−'} ${a}°)?`],
          opciones: opciones(txt(sg, nueva), [
            { id: 'razon', valor: txt(sg, otra), error: 'TR14', siFuera: k % 2 ? `El signo es correcto. Con ${90 * k}° la razón cambia a su co-razón.` : 'El signo es correcto. Con 180° la razón se conserva.' },
            { id: 'signo', valor: txt(sg ? '' : '−', nueva), error: 'TRRD-SIGNO-REF', siFuera: `La razón es correcta. El signo sale de ${fn} en ${f(g)}°, cuadrante ${ROM[cuadrante(g)]}.` },
            { id: 'ambos', valor: txt(sg ? '' : '−', otra), error: 'TRRD-IGUALES', siFuera: 'Esa igualdad pide una vuelta completa. Aquí cambian el cuadrante y, quizá, la razón.' },
          ], v => v),
          solucion: {
            texto: `${f(g)}° está en el cuadrante ${ROM[cuadrante(g)]}; ${k % 2 ? `con ${90 * k}° cambia a ${nueva}` : 'con 180° se conserva la razón'}.`,
            ecuacion: [`${fn}(${90 * k}° ${mas ? '+' : '−'} ${a}°) = ${txt(sg, nueva)}`],
          },
        };
      },
    },
  };

  // ---------- Idea 3: más de una vuelta o negativo: primero quitar vueltas ----------
  // Cambia: el giro θ, de −720° a 1080°. · Permanece: el lado final cuando se quitan vueltas completas.
  // Progresa: la espiral, que se desenrolla hasta un ángulo de la primera vuelta. · Se reserva: sen(−1110°) (la
  // predicción; fuera del rango del control). · Debe verse: que las vueltas no cambian el punto y el signo del giro sí.
  const espiral = (g, extra = {}) => Object.assign({
    circulos: [{ r: 1 }],
    rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: g, color: 'o' }],
    arcos: g ? [{ de: 0, a: g, r: 0.18, espiral: 8, color: 'o', rotulo: `${f(g)}°` }] : [],
    segmentos: [{ de: [Math.cos(rad(g)), 0], a: [Math.cos(rad(g)), Math.sin(rad(g))], color: 'h' }],
    puntos: [{ x: Math.cos(rad(g)), y: Math.sin(rad(g)), rotulo: 'P' }],
    alt: `Giro de ${f(g)} grados: su lado final es el de ${f(mod360(g))} grados`,
  }, extra);
  const vueltas = {
    id: 'mayores-negativos',
    titulo: 'Primero se quitan las vueltas',
    temas: ['Ángulos mayores de una vuelta', 'Ángulos negativos'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Elige un giro grande, positivo o negativo. La lectura le quita vueltas completas hasta dejar un ángulo entre 0° y 360°.',
      voz: 'Cuenta las vueltas antes de mirar el cuadrante.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-o', min: -720, max: 1080, paso: 45, inicio: 855, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: espiral(val.g), estado: {} }),
      lectura: val => { const m = mod360(val.g), n = (val.g - m) / 360; return [th, ` = 360°·(${f(n)}) + ${f(m)}° · lado final de ${f(m)}°`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Sabemos que sen 30° = 1/2. ¿Cuánto vale sen(−1110°)?',
      voz: 'Quita vueltas; después decide el signo.',
      opciones: [
        { id: 'c', texto: '−1/2', correcta: true },
        { id: 'signo', texto: '1/2', error: 'TR15', siFuera: 'Quitar 3 vueltas da −30°, bien. Pero sen(−30°) = −sen 30°: el giro horario baja P.' },
        { id: 'cruza', texto: '−√3/2', error: 'TR11', siFuera: 'El signo es correcto. Pero √3/2 es el coseno de 30°: la abscisa.' },
        { id: 'vuelta', texto: '√3/2', error: 'TRRD-IGUALES', siFuera: '√3/2 sería sen 60°. Al quitar vueltas, −1110° queda en −30°, no en 60°.' },
      ],
      dibujo: { datos: { circulos: [{ r: 1 }], rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }], arcos: [{ de: 0, a: -1110, r: 0.18, espiral: 8, color: 'o', rotulo: '−1110°' }], alt: 'Giro de menos 1110 grados en espiral, sin su punto final' }, estado: {} },
      revelar: { datos: espiral(-1110, { rotulos: [{ x: 0.55, y: -0.75, texto: 'sen = −1/2', color: 'h' }] }), estado: {} },
      coincide: 'Coincide: tres vueltas horarias y 30° más, debajo del eje x.',
      noCoincide: 'Revisemos: el giro horario deja a P debajo del eje x.',
    },
    mira: {
      datos: {
        circulos: [{ r: 1 }],
        rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: -30, color: 'o', desde: 1 }],
        arcos: [{ de: 0, a: -1110, r: 0.18, espiral: 8, color: 'o', rotulo: '−1110°', desde: 1, hasta: 1 }, { de: 0, a: -30, r: 0.3, color: 'o', rotulo: '−30°', desde: 2 }, { de: 0, a: 330, r: 0.6, espiral: 0, color: 'o', rotulo: '330°', desde: 4 }],
        segmentos: [{ de: [0.866, 0], a: [0.866, -0.5], color: 'h', rotulo: '−1/2', desde: 3 }, { de: [0.866, 0], a: [0.866, 0.5], color: 'h', discontinua: true, rotulo: '1/2', desde: 3 }],
        puntos: [{ x: 0.866, y: -0.5, rotulo: 'P', lado: 'se', desde: 1 }],
        alt: 'Menos 1110 grados termina donde menos 30 grados y 330 grados: el seno es menos un medio',
      },
      voz: 'Desenrolla la espiral y mira dónde queda P.',
      pasos: [
        { estado: { corte: 1 }, texto: '−1110° son tres vueltas en sentido horario y 30° más.', ecuacion: ['−1110° = 360°·(−3) − 30°'] },
        { estado: { corte: 2 }, texto: 'Quitar las tres vueltas no mueve P.', ecuacion: ['sen(−1110°) = sen(−30°)'] },
        { estado: { corte: 3 }, texto: 'El giro horario refleja P: el seno cambia de signo.', ecuacion: ['sen(−30°) = −sen 30° = −', { frac: ['1', '2'] }] },
        { estado: { corte: 4 }, texto: 'También: −30° y 330° terminan igual, en el IV.', ecuacion: ['sen 330° = −sen 30°'] },
      ],
    },
    regla: {
      texto: 'Primero se quitan las vueltas completas: no cambian el lado final. Si queda un ángulo negativo, el seno y la tangente cambian de signo; el coseno no.',
      ecuacion: ['sen(360°·n + ', th, ') = sen ', th, ';  sen(−', th, ') = −sen ', th, ';  cos(−', th, ') = cos ', th],
      condicion: 'n es un entero. tan(−θ) = −tan θ donde exista.',
      voz: 'Vueltas fuera primero; el sentido del giro se conserva.',
    },
    ahoraTu: {
      voz: 'Quita las vueltas y, después, reduce lo que queda.',
      generar(sem) {
        const rr = azar(sem), m = rr.uno([30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330]), k = rr.ent(1, 3), neg = sem % 2 === 1;
        const g = neg ? -(360 * k + m) : 360 * k + m, fn = ['sen', 'cos', 'tan'][sem % 3];
        const bien = exacto(FN[fn](g)), sinSigno = exacto(FN[fn](360 * k + m)), ref = refDe(m);
        return {
          pregunta: [`¿Cuánto vale ${fn}(${f(g)}°)?`],
          opciones: opciones(bien, [
            { id: 'signo', valor: neg ? sinSigno : opuesto(bien), error: neg ? 'TR15' : 'TRRD-SIGNO-REF', siFuera: neg ? `Ese es ${fn}(${f(-g)}°). El giro es negativo: ${fn === 'cos' ? 'el coseno se conserva' : 'cambia el signo'}.` : `El tamaño es correcto. Revisa el signo de ${fn} en el cuadrante ${ROM[cuadrante(g)]}.` },
            { id: 'co', valor: exacto(FN[CO[fn]](g)), error: 'TR14', siFuera: `Quitar vueltas está bien. Pero no hay cuarto de vuelta: ${fn} no cambia a ${CO[fn]}.` },
            { id: 'opuesto', valor: opuesto(bien), error: 'TR12', siFuera: `El tamaño es correcto. El signo sale del cuadrante de ${f(g)}°.` },
          ], v => v),
          solucion: {
            texto: `Se quitan ${f(k)} vuelta${k > 1 ? 's' : ''}; la referencia es ${ref}°.`,
            ecuacion: [`${fn}(${f(g)}°) = ${fn}(${f(neg ? -m : m)}°) = ${bien}`],
            dibujo: { datos: espiral(g), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 4: suplementarios y ángulos que completan una vuelta ----------
  // Cambia: θ de 10° a 170°. · Permanece: la circunferencia y el eje de reflexión. · Progresa: P y su reflejo P′ en el
  // eje y (suplementario). · Se reserva: el reflejo en el eje x, θ y 360° − θ (la predicción). · Debe verse: qué
  // coordenada conserva cada reflejo.
  function espejo(g, eje, extra = {}) {
    const x = Math.cos(rad(g)), y = Math.sin(rad(g)), h = eje === 'y' ? 180 - g : 360 - g;
    const x2 = Math.cos(rad(h)), y2 = Math.sin(rad(h));
    return Object.assign({
      circulos: [{ r: 1 }],
      rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: g, color: 'o' }, { ang: h, color: 'o', discontinua: true }],
      arcos: [{ de: 0, a: g, r: 0.2, color: 'o', rotulo: 'θ' }],
      segmentos: [{ de: [x, 0], a: [x, y], color: 'h' }, { de: [x2, 0], a: [x2, y2], color: 'h', discontinua: true }, { de: [0, 0], a: [x, 0], color: 'i' }, { de: [0, 0], a: [x2, 0], color: 'i', discontinua: true }],
      puntos: [{ x, y, rotulo: 'P' }, { x: x2, y: y2, rotulo: 'P′', lado: y2 < 0 ? 'se' : x2 < 0 ? 'no' : 'ne' }],
      alt: `θ = ${f(g)} grados y ${eje === 'y' ? '180' : '360'} − θ = ${f(h)} grados: reflejos en el eje ${eje}`,
    }, extra);
  }
  const RAZONES = { 180: { sen: 1, cos: -1, tan: -1 }, 360: { sen: -1, cos: 1, tan: -1 } };
  const suplementarios = {
    id: 'suplementarios-vuelta',
    titulo: 'Suplementarios y de una vuelta',
    temas: ['Ángulos suplementarios y de una vuelta'],
    pieza: 'trig-plano',
    juega: {
      consigna: 'Mueve θ. El rayo punteado marca 180° − θ, su suplementario. Compara las alturas y las abscisas de P y P′.',
      voz: 'Fíjate qué coordenada se conserva en el reflejo.',
      controles: [{ id: 'g', etiqueta: 'θ', color: 'c-o', min: 10, max: 170, paso: 10, inicio: 40, unidad: '°', decimales: 0 }],
      dibujo: val => ({ datos: espejo(val.g, 'y'), estado: {} }),
      lectura: val => ['sen ', th, ` = ${f(Math.sin(rad(val.g)))}; sen ${f(180 - val.g)}° = ${f(Math.sin(rad(180 - val.g)))} · cos `, th, ` = ${f(Math.cos(rad(val.g)))}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Ahora el otro ángulo es 360° − θ: los dos suman una vuelta. ¿Qué relación tienen cos θ y cos(360° − θ)?',
      voz: 'Antes de responder, ubica dónde termina 360° − θ.',
      opciones: [
        { id: 'c', texto: 'Son iguales', correcta: true },
        { id: 'analogia', texto: 'Son opuestos, como en los suplementarios', error: 'TRRD-ANALOGIA', siFuera: 'Así pasa con 180° − θ, que refleja en el eje y. 360° − θ refleja en el eje x.' },
        { id: 'co', texto: 'cos(360° − θ) = sen θ', error: 'TR14', siFuera: 'Cambiaría a seno con 90° o 270°. Con 360° el coseno se conserva.' },
      ],
      dibujo: { datos: { circulos: [{ r: 1 }], rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: 40, color: 'o' }], arcos: [{ de: 0, a: 40, r: 0.2, color: 'o', rotulo: 'θ' }], puntos: [{ x: Math.cos(rad(40)), y: Math.sin(rad(40)), rotulo: 'P' }], alt: 'Ángulo θ de 40 grados con su punto P' }, estado: {} },
      revelar: { datos: espejo(40, 'x', { rotulos: [{ x: 0.42, y: -0.15, texto: 'x igual', color: 'i' }] }), estado: {} },
      coincide: 'Coincide: 360° − θ es el reflejo en el eje x, y la abscisa no cambia.',
      noCoincide: 'Revisemos: P′ quedó debajo de P, con la misma abscisa.',
    },
    mira: {
      datos: {
        circulos: [{ r: 1 }],
        rayos: [{ ang: 0, largo: 1, grosor: 'contorno' }, { ang: 40, color: 'o' }, { ang: 140, color: 'o', discontinua: true, desde: 1, hasta: 2 }, { ang: 320, color: 'o', discontinua: true, desde: 3 }],
        arcos: [{ de: 0, a: 40, r: 0.2, color: 'o', rotulo: 'θ' }],
        segmentos: [
          { de: [0.766, 0], a: [0.766, 0.643], color: 'h' }, { de: [-0.766, 0], a: [-0.766, 0.643], color: 'h', discontinua: true, rotulo: 'y igual', desde: 1, hasta: 2 },
          { de: [0, 0], a: [-0.766, 0], color: 'i', discontinua: true, rotulo: 'x opuesta', desde: 2, hasta: 2 },
          { de: [0.766, 0], a: [0.766, -0.643], color: 'h', discontinua: true, rotulo: 'y opuesta', desde: 3 }, { de: [0, 0], a: [0.766, 0], color: 'i', desde: 4 },
        ],
        puntos: [{ x: 0.766, y: 0.643, rotulo: 'P' }, { x: -0.766, y: 0.643, rotulo: 'P′', lado: 'no', desde: 1, hasta: 2 }, { x: 0.766, y: -0.643, rotulo: 'P″', lado: 'se', desde: 3 }],
        rotulos: [{ x: 0.42, y: -0.15, texto: 'x igual', color: 'i', desde: 4 }],
        alt: 'θ de 40 grados, su suplementario de 140 grados reflejado en el eje y y 320 grados reflejado en el eje x',
      },
      voz: 'Dos espejos distintos: uno vertical, otro horizontal.',
      pasos: [
        { estado: { corte: 1 }, texto: '180° − θ refleja P en el eje y: la altura se conserva.', ecuacion: ['sen(180° − ', th, ') = sen ', th] },
        { estado: { corte: 2 }, texto: 'La abscisa cambia de signo.', ecuacion: ['cos(180° − ', th, ') = −cos ', th] },
        { estado: { corte: 3 }, texto: '360° − θ refleja P en el eje x: la altura cambia de signo.', ecuacion: ['sen(360° − ', th, ') = −sen ', th] },
        { estado: { corte: 4 }, texto: 'Y la abscisa se conserva.', ecuacion: ['cos(360° − ', th, ') = cos ', th] },
      ],
    },
    regla: {
      texto: 'Si dos ángulos suman 180°, tienen el mismo seno y cosenos opuestos. Si suman 360°, tienen el mismo coseno y senos opuestos. En los dos casos, tangentes opuestas.',
      ecuacion: ['sen(180° − ', th, ') = sen ', th, ';  cos(360° − ', th, ') = cos ', th, ';  tan(180° − ', th, ') = tan(360° − ', th, ') = −tan ', th],
      condicion: 'Vale para todo θ donde las razones existan.',
      voz: 'Pregunta siempre en qué eje está el espejo.',
    },
    ahoraTu: {
      voz: 'Decide qué espejo es cada término antes de sumar.',
      generar(sem) {
        const rr = azar(sem), a = rr.ent(1, 4), b = rr.ent(1, 4);
        const c1 = rr.uno([180, 360]), c2 = sem % 2 ? 180 : 360, f1 = rr.uno(['sen', 'cos', 'tan']), f2 = rr.uno(['sen', 'cos', 'tan']);
        const s1 = RAZONES[c1][f1], s2 = RAZONES[c2][f2], bien = a * s1 + b * s2;
        const otro = c => (c === 180 ? 360 : 180);
        const termino = (k, c, fn) => [k > 1 ? `${k}·` : '', { frac: [`${fn}(${c}° − θ)`, `${fn} θ`] }];
        return {
          pregunta: ['Simplifica E = ', ...termino(a, c1, f1), ' + ', ...termino(b, c2, f2), '.'],
          opciones: opciones(bien, [
            { id: 'iguales', valor: a + b, error: 'TRRD-IGUALES', siFuera: 'Sería cierto si cada cociente valiera 1. Algunos reflejos cambian el signo.' },
            { id: 'analogia', valor: a * RAZONES[otro(c1)][f1] + b * RAZONES[otro(c2)][f2], error: 'TRRD-ANALOGIA', siFuera: 'Ese resultado usa el otro espejo: 180° refleja en el eje y; 360°, en el eje x.' },
            { id: 'opuesto', valor: -bien, error: 'TR12', siFuera: 'Los tamaños están bien. Revisa qué cociente vale +1 y cuál −1.' },
            { id: 'resta', valor: a - b, error: 'TRRD-IGUALES', siFuera: 'Ese resultado pone un signo fijo. Cada cociente se decide con su propio espejo.' },
          ], v => f(v)),
          solucion: {
            texto: `El primer cociente vale ${f(s1)} y el segundo ${f(s2)}.`,
            ecuacion: [`E = ${f(a)}·(${f(s1)}) + ${f(b)}·(${f(s2)}) = ${f(bien)}`],
          },
        };
      },
    },
  };

  return {
    unidad: 'trigonometria.reduccion-al-primer-cuadrante',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/trig-plano.js'],
    historia: {
      texto: 'En el siglo XVI, Rheticus se propuso tablas de las seis razones con muchas cifras. Murió sin terminarlas; sus colaboradores siguieron y Valentin Otho publicó el Opus Palatinum. Calcular cada ángulo por separado era enorme. Las simetrías ayudan: si dos ángulos se relacionan, basta calcular uno y revisar el otro. Reducir al primer cuadrante es usar esas simetrías, y a veces cambian seno por coseno.',
      pregunta: '¿Cuántos valores de seno necesitarías calcular para cubrir toda la vuelta?',
      fuente: { titulo: 'J. J. O’Connor y E. F. Robertson, «Georg Joachim Rheticus», MacTutor, University of St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Rheticus/' },
    },
    ideas: [referenciaIdea, cofuncion, vueltas, suplementarios],
  };
});
