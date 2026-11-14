/*
 * Teoría de «Impulso, cantidad de movimiento y choques» (fisica.impulso-y-choques). Molde de docs/teoria.md;
 * forma copiada de contenido/teoria/fisica/movimiento-rectilineo.js.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 8), precisiones de física del expediente y
 * docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md (códigos M1–M9).
 * Colores (regla 4): v naranja (c-o), p y Δp turquesa (c-i), F rojo (c-h), t verde (c-d). Masa, K y e van en tinta.
 * Estado: completa (14 nov 2026): cinco ideas que cubren los seis temas del catálogo.
 * Códigos nuevos (hipótesis, sin fuente empírica): IMP-PICO, IMP-TRI, IMP-M, IMP-MISMA, P-PESADO, P-INVERSA,
 * CH-MITAD, CH-REPOSO, CH-CUARTO, CH-E-ALTURA, CH-E-PERDIDA, CH-E-INV, CM-MEDIO, CM-PESADO, CM-SIN-PESO.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver que en un choque cambian las velocidades pero la suma de las flechas m·v se mantiene.
 *   Persona y condiciones: postulante de 4.º y 5.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: calcula un impulso como área, una velocidad tras un choque, e y un centro de masa.
 *   Orden de atención: 1.º las flechas o el área · 2.º la lectura en vivo · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿qué se conserva en un choque y qué se pierde?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const v = { v: 'c-o', t: 'v' }, p = { v: 'c-i', t: 'p' }, F = { v: 'c-h', t: 'F' }, t = { v: 'c-d', t: 't' };
  const dp = ['Δ', p], dt = ['Δ', t];
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }

  // ---------- Idea 1: el área de F–t es el impulso ----------
  // Cambia: el pico de la fuerza y su duración · Permanece: la pelota de 0,5 kg, en reposo al inicio ·
  // Progresa: el área bajo la curva, que se pinta · Se reserva: dos golpes de distinta forma con la misma área ·
  // Debe verse: que lo que cambia la velocidad es el área, no el pico.
  const M1 = 0.5;
  const ejeFt = (tmax, fmax) => ({
    x: { min: 0, max: tmax, paso: 0.1, cada: 1, nombre: 't', unidad: 's', decimales: 1, color: 'd' },
    y: { min: 0, max: fmax, paso: 10, nombre: 'F', unidad: 'N', decimales: 0, color: 'h' },
  });
  const pulso = (Fm, T, t0 = 0) => [[t0, 0], [t0 + T / 2, Fm], [t0 + T, 0]];
  const impulso = {
    id: 'impulso',
    titulo: 'El área de F–t empuja',
    temas: ['Impulso', 'Cantidad de movimiento'],
    pieza: 'ejes',
    juega: {
      consigna: 'Una raqueta golpea una pelota quieta de 0,5 kg. Elige el pico de la fuerza y cuánto dura el golpe.',
      voz: 'Mira el área sombreada y la rapidez con que sale la pelota.',
      controles: [
        { id: 'F', etiqueta: 'F máx', color: 'c-h', min: 10, max: 50, paso: 10, inicio: 30, unidad: 'N', decimales: 0 },
        { id: 'T', etiqueta: 'Δt', color: 'c-d', min: 0.1, max: 0.5, paso: 0.1, inicio: 0.2, unidad: 's', decimales: 1 },
      ],
      dibujo: val => ({ datos: Object.assign(ejeFt(0.6, 50), { curvas: [{ puntos: pulso(val.F, val.T), color: 'h' }], areas: [{ puntos: pulso(val.F, val.T), color: 'i', rotulo: `${f(val.F * val.T / 2)} N·s` }] }), estado: {} }),
      lectura: val => ['Impulso ', f(val.F * val.T / 2), ' N·s · sale a ', v, ` = ${f(val.F * val.T / 2 / M1)} m/s`],
      minimo: 3,
    },
    predice: {
      pregunta: 'La misma pelota llega igual de rápido y se detiene contra una pared dura o contra un colchón, que tarda más en frenarla. Con el colchón, la fuerza máxima…',
      opciones: [
        { id: 'c', texto: 'es menor: el mismo impulso repartido en más tiempo', correcta: true },
        { id: 'misma', texto: 'es la misma: el cambio de velocidad es igual', error: 'IMP-MISMA', siFuera: 'El cambio de p sí es igual. Pero ese cambio es el área: más ancho, menos alto.' },
        { id: 'menor-imp', texto: 'es menor porque el colchón da menos impulso', error: 'M7', siFuera: 'Que duela menos es cierto. Pero el impulso es el mismo: en los dos casos se detiene.' },
        { id: 'mayor', texto: 'es mayor, porque actúa durante más tiempo', error: 'IMP-PICO', siFuera: 'Más tiempo sí da más impulso si la fuerza no baja. Aquí el impulso está fijo.' },
      ],
      dibujo: { datos: Object.assign(ejeFt(0.6, 50), { curvas: [{ puntos: pulso(40, 0.15), color: 'h', rotulo: 'pared', en: [0.09, 40] }] }), estado: {} },
      revelar: { datos: Object.assign(ejeFt(0.6, 50), {
        curvas: [{ puntos: pulso(40, 0.15), color: 'h', rotulo: 'pared', en: [0.09, 40] }, { puntos: pulso(12, 0.5, 0.05), color: 'h', rotulo: 'colchón', en: [0.32, 16] }],
        areas: [{ puntos: pulso(40, 0.15), color: 'i', rotulo: '3 N·s' }, { puntos: pulso(12, 0.5, 0.05), color: 'i', rotulo: '3 N·s' }],
      }), estado: {} },
      coincide: 'Coincide: las dos áreas valen 3 N·s; la del colchón es más baja y más ancha.',
    },
    mira: {
      datos: Object.assign(ejeFt(0.6, 50), {
        curvas: [{ puntos: pulso(40, 0.3), color: 'h' }],
        puntos: [{ x: 0.15, y: 40, color: 'h', rotulo: '40 N', guias: true, desde: 1 }],
        areas: [{ puntos: pulso(40, 0.3), color: 'i', rotulo: '6 N·s', desde: 2 }],
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'El golpe sube hasta 40 N y dura 0,3 s.', ecuacion: [{ sub: [F, 'máx'] }, ' = 40 N   ·   ', dt, ' = 0,3 s'] },
        { estado: { corte: 2 }, texto: 'El impulso es el área del triángulo.', ecuacion: ['J = ½ · 40 · 0,3 = 6 N·s'] },
        { estado: { corte: 2 }, texto: 'Ese impulso es el cambio de la cantidad de movimiento.', ecuacion: [dp, ' = J = 6 kg·m/s'] },
        { estado: { corte: 2 }, texto: 'La pelota de 0,5 kg estaba quieta: sale a 12 m/s.', ecuacion: [v, ' = ', { frac: [dp, 'm'] }, ' = ', { frac: ['6', '0,5'] }, ' = 12 m/s'] },
      ],
    },
    regla: {
      texto: 'La cantidad de movimiento es p = m·v. El impulso de la fuerza neta es el área bajo F–t, y es igual al cambio de p.',
      ecuacion: [p, ' = m', v, '   ·   J = ', F, ' · ', dt, ' = ', dp],
      condicion: 'F es la fuerza neta. Si F cambia en el tiempo, se usa el área con signo, no el pico.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tri = s % 2 === 0, Fm = r.ent(2, 8) * 10, T = r.ent(1, 4) / 10, m = r.de([0.2, 0.4, 0.5, 1, 2]);
        const J = tri ? Fm * T / 2 : Fm * T, vf = J / m;
        const forma = tri ? [[0, 0], [T / 2, Fm], [T, 0]] : [[0, 0], [0, Fm], [T, Fm], [T, 0]];
        const datos = Object.assign(ejeFt(0.6, 80), { curvas: [{ puntos: forma, color: 'h' }], puntos: [{ x: tri ? T / 2 : T / 2, y: Fm, color: 'h', rotulo: `${f(Fm)} N` }] });
        return {
          pregunta: ['Un cuerpo de ', f(m), ` kg está quieto. Recibe el golpe de la gráfica, que dura ${f(T, 1)} s. ¿Con qué rapidez sale?`],
          dibujo: { datos, estado: {} },
          opciones: opciones(vf, [
            { id: 'tri', valor: tri ? Fm * T / m : Fm * T / 2 / m, error: tri ? 'IMP-TRI' : 'IMP-PICO', siFuera: tri ? 'Eso toma el rectángulo completo; el área del triángulo es la mitad.' : 'Eso toma la mitad del área, como si fuera un triángulo.' },
            { id: 'sin-m', valor: J, error: 'IMP-M', siFuera: 'Ese número es el impulso. Falta dividir entre la masa.' },
            { id: 'por-m', valor: J * m, error: 'IMP-M', siFuera: 'Eso multiplica por la masa; Δv = J / m.' },
          ], n => `${f(n)} m/s`),
          solucion: {
            texto: tri ? 'El área es un triángulo; luego se divide entre la masa.' : 'El área es un rectángulo; luego se divide entre la masa.',
            ecuacion: ['J = ', tri ? `½ · ${f(Fm)} · ${f(T, 1)}` : `${f(Fm)} · ${f(T, 1)}`, ` = ${f(J)} N·s   ·   `, v, ` = ${f(J)} / ${f(m)} = ${f(vf)} m/s`],
            dibujo: { datos: Object.assign({}, datos, { areas: [{ puntos: forma, color: 'i', rotulo: `${f(J)} N·s` }] }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 2: lo que uno gana, el otro lo pierde (conservación de p) ----------
  // Cambia: las masas de los dos carritos · Permanece: el resorte, que da 6 N·s a cada uno en sentidos opuestos ·
  // Progresa: las dos flechas de v, que crecen distinto · Se reserva: la suma con signo, que siempre da 0 ·
  // Debe verse: flechas de v distintas, pero m·v iguales y opuestas.
  const J0 = 6, LR = 12;
  const PEG = L => 48 * L / 270; // un carrito de la pieza fis-riel mide 46 px de 270: así se dibujan pegados
  const explosion = (mA, mB, conNotas = true) => {
    const vA = -J0 / mA, vB = J0 / mB;
    return {
      largo: LR, escalaV: 7, colores: { v: 'o' },
      filas: [
        { rotulo: 'Antes', nota: conNotas ? 'p total = 0' : '', carros: [{ x: 5, m: mA, v: 0, rotulo: 'A' }, { x: 5 + PEG(LR), m: mB, v: 0, rotulo: 'B', variante: 'b' }] },
        { rotulo: 'Después', desde: 1, nota: conNotas ? `${f(mA * vA)} + ${f(mB * vB)} = 0` : '', carros: [{ x: Math.max(1, 5 + vA * 0.6), m: mA, v: vA, rotulo: 'A' }, { x: Math.min(11, 5 + PEG(LR) + vB * 0.6), m: mB, v: vB, rotulo: 'B', variante: 'b' }] },
      ],
    };
  };
  const conservacion = {
    id: 'conservacion',
    titulo: 'Lo que uno gana, otro pierde',
    temas: ['Conservación de la cantidad de movimiento', 'Cantidad de movimiento'],
    pieza: 'fis-riel',
    juega: {
      consigna: 'Dos carritos quietos tienen un resorte apretado entre ellos. Se suelta y los separa. Elige sus masas.',
      voz: 'Compara las flechas de velocidad con las masas.',
      controles: [
        { id: 'mA', etiqueta: 'masa de A', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'kg', decimales: 0 },
        { id: 'mB', etiqueta: 'masa de B', min: 1, max: 4, paso: 1, inicio: 1, unidad: 'kg', decimales: 0 },
      ],
      dibujo: val => ({ datos: explosion(val.mA, val.mB), estado: { corte: 1 } }),
      lectura: val => [{ sub: [p, 'A'] }, ` = ${f(-J0)} · `, { sub: [p, 'B'] }, ` = +${f(J0)} · total 0 kg·m/s`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un carrito de 3 kg y otro de 1 kg, quietos, se separan con un resorte. El de 1 kg sale a 6 m/s hacia la derecha. ¿Y el de 3 kg?',
      opciones: [
        { id: 'c', texto: '2 m/s hacia la izquierda', correcta: true },
        { id: 'igual', texto: '6 m/s hacia la izquierda', error: 'M8', siFuera: 'El empujón sí es igual para los dos. Pero con 3 kg, el mismo empujón da menos rapidez.' },
        { id: 'por', texto: '18 m/s hacia la izquierda', error: 'P-INVERSA', siFuera: 'La masa sí entra en la cuenta. Pero más masa da menos velocidad: se divide.' },
        { id: 'quieto', texto: 'Se queda quieto: es más pesado', error: 'P-PESADO', siFuera: 'Se moverá menos, eso es cierto. Pero el resorte también lo empuja a él.' },
      ],
      dibujo: { datos: { largo: LR, escalaV: 7, colores: { v: 'o' }, filas: [{ rotulo: 'Antes', carros: [{ x: 5, m: 3, v: 0, rotulo: 'A' }, { x: 5 + PEG(LR), m: 1, v: 0, rotulo: 'B', variante: 'b' }] }, { rotulo: 'Después', desde: 1, carros: [{ x: 9, m: 1, v: 6, rotulo: 'B', variante: 'b' }] }] }, estado: { corte: 1 } },
      revelar: { datos: { largo: LR, escalaV: 7, colores: { v: 'o' }, filas: [{ rotulo: 'Antes', nota: 'p total = 0', carros: [{ x: 5, m: 3, v: 0, rotulo: 'A' }, { x: 5 + PEG(LR), m: 1, v: 0, rotulo: 'B', variante: 'b' }] }, { rotulo: 'Después', nota: '3·(−2) + 1·6 = 0', carros: [{ x: 3.7, m: 3, v: -2, rotulo: 'A' }, { x: 9, m: 1, v: 6, rotulo: 'B', variante: 'b' }] }] }, estado: { corte: 1 } },
      coincide: 'Coincide: 3 kg por 2 m/s hacia un lado es lo mismo que 1 kg por 6 m/s hacia el otro.',
    },
    mira: {
      pieza: 'fis-riel',
      datos: explosion(3, 1),
      pasos: [
        { estado: { corte: 0 }, texto: 'Antes, los dos están quietos: la cantidad de movimiento total es 0.', ecuacion: [{ sub: [p, 'total'] }, ' = 0'] },
        { estado: { corte: 1 }, texto: 'El resorte empuja a cada uno con el mismo impulso, en sentidos opuestos.', ecuacion: [{ sub: [p, 'A'] }, ' = −6   ·   ', { sub: [p, 'B'] }, ' = +6 kg·m/s'] },
        { estado: { corte: 1 }, texto: 'Cada velocidad sale de dividir entre su masa.', ecuacion: [{ sub: [v, 'A'] }, ' = −6/3 = −2 m/s   ·   ', { sub: [v, 'B'] }, ' = 6/1 = 6 m/s'] },
        { estado: { corte: 1 }, texto: 'La suma con signo sigue siendo 0.', ecuacion: ['3 · (−2) + 1 · 6 = 0'] },
      ],
    },
    regla: {
      texto: 'Si sobre el sistema no actúa impulso externo, la cantidad de movimiento total se conserva: la suma de m·v, con signo, es la misma antes y después.',
      ecuacion: [{ sub: ['m', 'A'] }, { sub: [v, 'A'] }, ' + ', { sub: ['m', 'B'] }, { sub: [v, 'B'] }, ' = ', { sub: ['m', 'A'] }, { sub: [v, "A'"] }, ' + ', { sub: ['m', 'B'] }, { sub: [v, "B'"] }],
      condicion: 'el impulso de las fuerzas externas es nulo o despreciable en ese intervalo. Las velocidades llevan signo.',
    },
    ahoraTu: {
      pieza: 'fis-riel',
      generar(s) {
        const r = azar(s), mA = r.ent(1, 4), mB = r.ent(1, 4), vA = r.de([2, 3, 4, 5, 6]);
        const vf = mA * vA / (mA + mB);
        const fila = (rot, cs, desde) => ({ rotulo: rot, desde, carros: cs });
        const antes = fila('Antes', [{ x: 2, m: mA, v: vA, rotulo: 'A' }, { x: 7, m: mB, v: 0, rotulo: 'B', variante: 'b' }], 0);
        return {
          pregunta: `El carrito A choca con B, que está quieto, y salen pegados. ¿Con qué velocidad se mueven juntos?`,
          dibujo: { datos: { largo: 10, escalaV: 8, colores: { v: 'o' }, filas: [antes] }, estado: {} },
          opciones: opciones(vf, [
            { id: 'mitad', valor: vA / 2, error: 'CH-MITAD', siFuera: 'La mitad sería cierta si las dos masas fueran iguales.' },
            { id: 'igual', valor: vA, error: 'M1', siFuera: 'Esa rapidez dejaría más cantidad de movimiento que la que había.' },
            { id: 'cociente', valor: mA * vA / mB, error: 'P-INVERSA', siFuera: 'Eso divide solo entre B; ahora se mueven las dos masas juntas.' },
            { id: 'cero', valor: 0, error: 'CH-REPOSO', siFuera: 'Pegarse no es detenerse: la cantidad de movimiento sigue ahí.' },
          ], n => `${f(n)} m/s`),
          solucion: {
            texto: 'La cantidad de movimiento de A se reparte entre las dos masas juntas.',
            ecuacion: [v, ` = ${f(mA)} · ${f(vA)} / (${f(mA)} + ${f(mB)}) = ${f(vf)} m/s`],
            dibujo: { datos: { largo: 10, escalaV: 8, colores: { v: 'o' }, filas: [antes, fila('Después', [{ x: 5, m: mA, v: vf, rotulo: 'A' }, { x: 5 + PEG(10), m: mB, v: vf, rotulo: 'B', variante: 'b' }], 1)] }, estado: { corte: 1 } },
          },
        };
      },
    },
  };

  // ---------- Idea 3: elástico e inelástico ----------
  // Cambia: qué tan elástico es el choque (e) y la masa de B · Permanece: A de 2 kg a 4 m/s; p total = 8 kg·m/s ·
  // Progresa: la energía cinética que queda · Se reserva: el choque en que salen pegados ·
  // Debe verse: p igual en todos los choques; K igual solo en el elástico.
  const MA = 2, VA = 4;
  const choque = (e, mB) => {
    const vA2 = (MA - e * mB) * VA / (MA + mB), vB2 = (1 + e) * MA * VA / (MA + mB);
    return { vA2, vB2, K0: MA * VA * VA / 2, K1: MA * vA2 * vA2 / 2 + mB * vB2 * vB2 / 2 };
  };
  const rielChoque = (e, mB, notas = true) => {
    const c = choque(e, mB);
    const pegados = e === 0;
    return {
      largo: 10, escalaV: 8, colores: { v: 'o' },
      filas: [
        { rotulo: 'Antes', nota: notas ? `K = ${f(c.K0)} J` : '', carros: [{ x: 2, m: MA, v: VA, rotulo: 'A' }, { x: 5.5, m: mB, v: 0, rotulo: 'B', variante: 'b' }] },
        { rotulo: 'Después', desde: 1, nota: notas ? `K = ${f(c.K1)} J` : '', carros: pegados
          ? [{ x: 6.4, m: MA, v: c.vA2, rotulo: 'A' }, { x: 6.4 + PEG(10), m: mB, v: c.vB2, rotulo: 'B', variante: 'b' }]
          : [{ x: 4.5 + c.vA2 * 0.3, m: MA, v: c.vA2, rotulo: 'A' }, { x: 6.5 + c.vB2 * 0.4, m: mB, v: c.vB2, rotulo: 'B', variante: 'b' }] },
      ],
    };
  };
  const elastico = {
    id: 'elastico-inelastico',
    titulo: 'La energía cinética puede perderse',
    temas: ['Choques elásticos e inelásticos', 'Conservación de la cantidad de movimiento'],
    pieza: 'fis-riel',
    juega: {
      consigna: 'A (2 kg, 4 m/s) choca con B, quieto. Elige la masa de B y qué tan elástico es el choque.',
      voz: 'Lee la energía cinética antes y después, y la suma de m·v.',
      controles: [
        { id: 'e', etiqueta: 'elástico (e)', min: 0, max: 1, paso: 0.25, inicio: 0.5, decimales: 2 },
        { id: 'mB', etiqueta: 'masa de B', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'kg', decimales: 0 },
      ],
      dibujo: val => ({ datos: rielChoque(val.e, val.mB), estado: { corte: 1 } }),
      lectura: val => { const c = choque(val.e, val.mB); return [p, ` = 8 antes y después · K: 16 → ${f(c.K1)} J`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Dos carritos iguales de 2 kg: A va a 4 m/s, choca con B quieto y salen pegados. ¿Cuánta energía cinética queda después del choque?',
      opciones: [
        { id: 'c', texto: '8 J', correcta: true },
        { id: 'toda', texto: '16 J, la misma de antes', error: 'M1', siFuera: 'Lo de antes y después sí se conserva para p. La energía cinética, aquí, no.' },
        { id: 'nada', texto: '0 J: quedan quietos', error: 'CH-REPOSO', siFuera: 'Se pierde energía, eso es cierto. Pero siguen moviéndose juntos a 2 m/s.' },
        { id: 'cuarto', texto: '4 J', error: 'CH-CUARTO', siFuera: 'Eso usa 2 m/s con una sola masa. Ahora se mueven los 4 kg.' },
      ],
      dibujo: { datos: rielChoque(0, 2, false), estado: { corte: 0 } },
      revelar: { datos: rielChoque(0, 2, true), estado: { corte: 1 } },
      coincide: 'Coincide: salen a 2 m/s los 4 kg; ½ · 4 · 2² = 8 J. La otra mitad se volvió calor y deformación.',
    },
    mira: {
      pieza: 'fis-riel',
      datos: rielChoque(0, 2),
      pasos: [
        { estado: { corte: 0 }, texto: 'Antes: 2 kg a 4 m/s.', ecuacion: [p, ' = 2 · 4 = 8 kg·m/s   ·   K = ½ · 2 · 4² = 16 J'] },
        { estado: { corte: 1 }, texto: 'Salen pegados: los 4 kg comparten la cantidad de movimiento.', ecuacion: [v, ' = 8 / 4 = 2 m/s'] },
        { estado: { corte: 1 }, texto: 'La energía cinética después es la mitad.', ecuacion: ['K = ½ · 4 · 2² = 8 J'] },
        { estado: { corte: 1 }, texto: 'Elástico (e = 1): A se detiene y B sale con los 16 J.', ecuacion: ['e = 1:   ', { sub: [v, "A'"] }, ' = 0   ·   ', { sub: [v, "B'"] }, ' = 4 m/s'] },
      ],
    },
    regla: {
      texto: 'En todo choque aislado se conserva p. La energía cinética se conserva solo en el choque elástico; en el inelástico, parte pasa a calor y deformación.',
      ecuacion: ['K = ½ m', { sup: [v, '2'] }, '   ·   ', { sub: [p, 'antes'] }, ' = ', { sub: [p, 'después'] }],
      condicion: 'el choque es breve y sin impulso externo. Salir pegados es el caso más inelástico, y no implica quedar quietos.',
    },
    ahoraTu: {
      pieza: 'fis-riel',
      generar(s) {
        const r = azar(s), mA = r.ent(1, 4), mB = r.ent(1, 4), vA = r.de([2, 4, 6]);
        const vf = mA * vA / (mA + mB), K0 = mA * vA * vA / 2, K1 = (mA + mB) * vf * vf / 2;
        return {
          pregunta: `A, de ${f(mA)} kg, va a ${f(vA)} m/s y choca con B, de ${f(mB)} kg, quieto. Salen pegados. ¿Cuánta energía cinética se pierde en el choque?`,
          dibujo: { datos: { largo: 10, escalaV: 8, colores: { v: 'o' }, filas: [{ rotulo: 'Antes', carros: [{ x: 2, m: mA, v: vA, rotulo: 'A' }, { x: 6, m: mB, v: 0, rotulo: 'B', variante: 'b' }] }] }, estado: {} },
          opciones: opciones(K0 - K1, [
            { id: 'nada', valor: 0, error: 'M1', siFuera: 'No perder nada sería cierto en un choque elástico. Pegados, sí se pierde.' },
            { id: 'toda', valor: K0, error: 'CH-REPOSO', siFuera: 'Perderla toda sería cierto si quedaran quietos; siguen moviéndose.' },
            { id: 'queda', valor: K1, error: 'CH-QUEDA', siFuera: 'Esa es la energía que queda, no la que se pierde.' },
          ], n => `${f(n)} J`),
          solucion: {
            texto: 'Primero la velocidad común con p; luego se restan las energías.',
            ecuacion: [v, ` = ${f(mA * vA)}/${f(mA + mB)} = ${f(vf)} m/s   ·   ${f(K0)} − ${f(K1)} = ${f(K0 - K1)} J`],
          },
        };
      },
    },
  };

  // ---------- Idea 4: el coeficiente de restitución ----------
  // Cambia: qué tan elástica es la pelota (e) · Permanece: la altura de 20 m desde la que cae y g ·
  // Progresa: la altura del rebote, que crece como e² · Se reserva: la comparación de rapideces en el suelo ·
  // Debe verse: e compara rapideces, no alturas; la altura cambia con e².
  const H = 20, G = 10, VH = Math.sqrt(2 * G * H);
  const torreRebote = e => ({
    datos: { alto: 20, colores: { y: 'i', v: 'o', a: 'd' }, g: false, pelotas: [
      { y: H, v: -VH, marcas: [H], rotulo: 'cae' },
      { y: e * e * H, v: e * VH, marcas: [e * e * H], rotulo: 'sube' },
    ] }, estado: {},
  });
  const restitucion = {
    id: 'restitucion',
    titulo: 'e compara rapideces',
    temas: ['Coeficiente de restitución'],
    pieza: 'torre',
    juega: {
      consigna: 'Una pelota cae desde 20 m y rebota en el suelo. Elige qué tan elástica es y mira hasta dónde sube.',
      voz: 'Compara las dos flechas de velocidad: la de llegada y la de salida.',
      controles: [{ id: 'e', etiqueta: 'e', min: 0.2, max: 1, paso: 0.1, inicio: 0.6, decimales: 1 }],
      dibujo: val => torreRebote(val.e),
      lectura: val => ['Llega: 20 m/s · sale: ', f(val.e * VH, 1), ' m/s · sube: ', f(val.e * val.e * H, 1), ' m'],
      minimo: 3,
    },
    predice: {
      pregunta: 'Una pelota cae desde 20 m y, después del rebote, sube solo hasta 5 m. ¿Cuál es su coeficiente de restitución e?',
      opciones: [
        { id: 'c', texto: '0,5', correcta: true },
        { id: 'altura', texto: '0,25', error: 'CH-E-ALTURA', siFuera: '5/20 compara alturas. e compara rapideces, y la altura va con la rapidez al cuadrado.' },
        { id: 'perdida', texto: '0,75', error: 'CH-E-PERDIDA', siFuera: 'Eso mide cuánta altura perdió, no cuánta rapidez conserva.' },
        { id: 'inv', texto: '4', error: 'CH-E-INV', siFuera: 'e compara la salida con la llegada, así que nunca pasa de 1.' },
      ],
      dibujo: { datos: { alto: 20, colores: { y: 'i', v: 'o', a: 'd' }, g: false, pelotas: [{ y: H, marcas: [H], rotulo: 'cae' }, { y: 5, marcas: [5], rotulo: 'sube' }] }, estado: {} },
      revelar: { datos: { alto: 20, colores: { y: 'i', v: 'o', a: 'd' }, g: false, pelotas: [{ y: H, v: -VH, marcas: [H], rotulo: 'llega' }, { y: 5, v: 10, marcas: [5], rotulo: 'sale' }] }, estado: {} },
      coincide: 'Coincide: llega a 20 m/s y sale a 10 m/s. La mitad de la rapidez da la cuarta parte de la altura.',
    },
    mira: {
      pieza: 'ejes',
      datos: {
        x: { min: 0, max: 3, paso: 0.5, cada: 2, nombre: 't', unidad: 's', decimales: 1, color: 'd' },
        y: { min: -20, max: 20, paso: 10, nombre: 'v', unidad: 'm/s', decimales: 0, color: 'o' },
        curvas: [{ puntos: [[0, 0], [2, -20]], color: 'o', desde: 1 }, { puntos: [[2, 10], [3, 0]], color: 'o', desde: 2 }],
        puntos: [{ x: 2, y: -20, color: 'o', rotulo: '−20 m/s', desde: 1 }, { x: 2, y: 10, color: 'o', rotulo: '+10 m/s', desde: 2 }],
        areas: [{ puntos: [[2, 10], [3, 0]], color: 'i', rotulo: '5 m', desde: 4 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Cae 20 m: llega al suelo a 20 m/s hacia abajo.', ecuacion: [v, ' = √(2 · 10 · 20) = 20 m/s'] },
        { estado: { corte: 2 }, texto: 'En el rebote la velocidad salta: sale a 10 m/s hacia arriba.', ecuacion: [{ sub: [v, 'sale'] }, ' = 10 m/s'] },
        { estado: { corte: 3 }, texto: 'e compara la rapidez con que se separa y con la que se acercaba.', ecuacion: ['e = ', { frac: ['10', '20'] }, ' = 0,5'] },
        { estado: { corte: 4 }, texto: 'Sube el área del triángulo: 5 m, la cuarta parte.', ecuacion: ['h = ½ · 10 · 1 = 5 m = ', { sup: ['e', '2'] }, ' · 20'] },
      ],
    },
    regla: {
      texto: 'El coeficiente de restitución compara la rapidez con que los cuerpos se separan con la rapidez con que se acercaban. En un rebote, la altura cambia con e².',
      ecuacion: ['e = ', { frac: [{ sub: [v, 'separación'] }, { sub: [v, 'acercamiento'] }] }, '   ·   ', { frac: ['h', 'H'] }, ' = ', { sup: ['e', '2'] }],
      condicion: '0 ≤ e ≤ 1: e = 1 es elástico y e = 0 salen juntos. Para la altura: suelo quieto y sin aire.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const e = r.de([0.4, 0.5, 0.6, 0.8, 0.9]), Hh = r.de([5, 10, 20, 25, 40]), h = e * e * Hh;
          return {
            pregunta: `Una pelota se suelta desde ${f(Hh)} m y rebota hasta ${f(h, 2)} m. ¿Cuál es el coeficiente de restitución?`,
            dibujo: { datos: { alto: Math.max(20, Math.ceil(Hh / 10) * 10), colores: { y: 'i', v: 'o', a: 'd' }, g: false, pelotas: [{ y: Hh, marcas: [Hh], rotulo: 'cae' }, { y: h, marcas: [h], rotulo: 'sube' }] }, estado: {} },
            opciones: opciones(e, [
              { id: 'altura', valor: h / Hh, error: 'CH-E-ALTURA', siFuera: 'Eso compara alturas; e compara rapideces: falta la raíz.' },
              { id: 'perdida', valor: 1 - h / Hh, error: 'CH-E-PERDIDA', siFuera: 'Eso es la fracción de altura que se perdió.' },
              { id: 'perd-raiz', valor: 1 - e, error: 'CH-E-PERDIDA', siFuera: 'Esa es la fracción de rapidez que se perdió, no la que queda.' },
            ], n => f(n, 2)),
            solucion: { texto: 'La altura va con e²: se saca la raíz del cociente.', ecuacion: ['e = √(', f(h, 2), ' / ', f(Hh), ') = ', f(e, 2)] },
          };
        }
        const vA = r.de([4, 5, 6, 8]), vB = r.de([1, 2]), e = r.de([0.25, 0.5, 0.75]);
        const ac = vA - vB, sep = e * ac;
        return {
          pregunta: `A va a ${f(vA)} m/s y alcanza a B, que va a ${f(vB)} m/s en el mismo sentido. Después del choque, B se aleja de A a ${f(sep, 2)} m/s más que A. ¿Cuánto vale e?`,
          opciones: opciones(e, [
            { id: 'sin-rel', valor: sep / vA, error: 'CH-E-REL', siFuera: 'Eso usa la rapidez de A sola; el acercamiento era vA − vB.' },
            { id: 'inv', valor: ac / sep, error: 'CH-E-INV', siFuera: 'Ese cociente está al revés: e no pasa de 1.' },
            { id: 'suma', valor: sep / (vA + vB), error: 'VR-SUMA', siFuera: 'Sumar sirve si iban uno hacia el otro; aquí iban al mismo lado.' },
          ], n => f(n, 2)),
          solucion: { texto: 'Se acercaban a vA − vB; se separan a lo que dice el enunciado.', ecuacion: ['e = ', f(sep, 2), ' / (', f(vA), ' − ', f(vB), ') = ', f(e, 2)] },
        };
      },
    },
  };

  // ---------- Idea 5: el centro de masa ----------
  // Cambia: las dos masas · Permanece: sus lugares (0 y 8 m) · Progresa: el punto del centro de masa, que se corre
  // hacia la mayor · Se reserva: la separación por un resorte, que mueve los carritos y no el centro ·
  // Debe verse: el centro de masa es un promedio pesado y no se mueve sin impulso externo.
  const rectaCM = (cs, xc, o = {}) => ({
    min: o.min !== undefined ? o.min : -2, max: o.max !== undefined ? o.max : 12, paso: 1, cada: 2, sufijo: ' m', decimales: 2, filas: 2,
    elementos: [
      ...cs.map(c => ({ tipo: 'punto', x: c.x, rotulo: `${f(c.m)} kg`, fila: 1, desde: c.desde || 0 })),
      ...(xc === null ? [] : [{ tipo: 'punto', x: xc, color: 'i', rotulo: o.rot || `centro ${f(xc)} m`, fila: 0, desde: o.desdeC || 0 }]),
    ],
  });
  const xcm = cs => cs.reduce((s, c) => s + c.m * c.x, 0) / cs.reduce((s, c) => s + c.m, 0);
  const centro = {
    id: 'centro-masa',
    titulo: 'El centro de masa queda',
    temas: ['Centro de masa', 'Conservación de la cantidad de movimiento'],
    pieza: 'recta',
    juega: {
      consigna: 'Hay una masa en x = 0 y otra en x = 8 m. Cambia las masas y mira dónde queda su centro de masa.',
      voz: 'Fíjate hacia cuál de las dos se corre el centro.',
      controles: [
        { id: 'm1', etiqueta: 'masa en 0', min: 1, max: 5, paso: 1, inicio: 1, unidad: 'kg', decimales: 0 },
        { id: 'm2', etiqueta: 'masa en 8 m', min: 1, max: 5, paso: 1, inicio: 3, unidad: 'kg', decimales: 0 },
      ],
      dibujo: val => { const cs = [{ x: 0, m: val.m1 }, { x: 8, m: val.m2 }]; return { datos: rectaCM(cs, xcm(cs)), estado: {} }; },
      lectura: val => [`Centro de masa en x = ${f(8 * val.m2 / (val.m1 + val.m2))} m`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un carrito de 3 kg en x = 0 y otro de 1 kg en x = 8 m, quietos, se separan empujados por un resorte entre ellos. Mientras se alejan, ¿dónde está su centro de masa?',
      opciones: [
        { id: 'c', texto: 'Sigue en x = 2 m', correcta: true },
        { id: 'medio', texto: 'En x = 4 m, el punto medio', error: 'CM-MEDIO', siFuera: 'El punto medio sería cierto con masas iguales. Aquí pesa más el de x = 0.' },
        { id: 'pesado', texto: 'Se mueve junto con el carrito pesado', error: 'CM-PESADO', siFuera: 'El pesado sí lo atrae hacia su lado. Pero el liviano se aleja más rápido.' },
        { id: 'liviano', texto: 'Se corre hacia el carrito liviano, que va más rápido', error: 'CM-SIN-PESO', siFuera: 'El liviano va más rápido, cierto. Pero pesa menos en el promedio.' },
      ],
      dibujo: { datos: rectaCM([{ x: 0, m: 3 }, { x: 8, m: 1 }], null), estado: {} },
      revelar: { datos: rectaCM([{ x: -1.5, m: 3 }, { x: 12, m: 1 }], 2, { rot: 'centro: sigue en 2 m', min: -2, max: 12 }), estado: {} },
      coincide: 'Coincide: el de 3 kg retrocede 1,5 m y el de 1 kg avanza 4,5 m; el promedio pesado no cambia.',
    },
    mira: {
      pieza: 'recta',
      datos: rectaCM([{ x: 0, m: 3 }, { x: 8, m: 1 }], 2, { desdeC: 3, rot: '2 m' }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada masa cuenta según cuánto pesa y dónde está.', ecuacion: ['3 · 0 = 0   ·   1 · 8 = 8'] },
        { estado: { corte: 2 }, texto: 'Se suman los productos y se divide entre la masa total.', ecuacion: [{ sub: ['x', 'cm'] }, ' = ', { frac: ['0 + 8', '3 + 1'] }] },
        { estado: { corte: 3 }, texto: 'El centro queda en 2 m: más cerca de la masa mayor.', ecuacion: [{ sub: ['x', 'cm'] }, ' = 2 m'] },
        { estado: { corte: 3 }, texto: 'El resorte es una fuerza interna: los carritos se mueven, el centro no.', ecuacion: [{ sub: [p, 'total'] }, ' = 0   →   ', { sub: [v, 'cm'] }, ' = 0'] },
      ],
    },
    regla: {
      texto: 'El centro de masa es el promedio de las posiciones pesado por las masas. Sin impulso externo, se mueve con velocidad constante, o sigue quieto.',
      ecuacion: [{ sub: ['x', 'cm'] }, ' = ', { frac: [[{ sub: ['m', '1'] }, { sub: ['x', '1'] }, ' + ', { sub: ['m', '2'] }, { sub: ['x', '2'] }], [{ sub: ['m', '1'] }, ' + ', { sub: ['m', '2'] }]] }],
      condicion: 'todas las posiciones se miden desde el mismo origen; cada cuerpo se ubica en su propio centro.',
    },
    ahoraTu: {
      pieza: 'recta',
      generar(s) {
        const r = azar(s);
        const cs = [{ x: 0, m: r.ent(1, 4) }, { x: r.ent(2, 4) * 2, m: r.ent(1, 4) }, { x: r.ent(5, 6) * 2, m: r.ent(1, 4) }];
        const xc = xcm(cs), med = (cs[0].x + cs[1].x + cs[2].x) / 3, M = cs.reduce((a, c) => a + c.m, 0);
        const suma = cs.reduce((a, c) => a + c.m * c.x, 0);
        return {
          pregunta: `Tres masas están sobre una regla: ${cs.map(c => `${f(c.m)} kg en x = ${f(c.x)} m`).join(', ')}. ¿Dónde está su centro de masa?`,
          dibujo: { datos: rectaCM(cs, null, { min: -1, max: 13 }), estado: {} },
          opciones: opciones(xc, [
            { id: 'medio', valor: med, error: 'CM-MEDIO', siFuera: 'El promedio simple sirve si las tres masas son iguales.' },
            { id: 'sin-div', valor: suma / 3, error: 'CM-SIN-PESO', siFuera: 'Eso divide entre 3 cuerpos; se divide entre la masa total.' },
            { id: 'suma', valor: suma, error: 'CM-SIN-PESO', siFuera: 'Esa es la suma de m·x; falta dividir entre la masa total.' },
          ], n => `${f(n)} m`),
          solucion: {
            texto: 'Suma de masa por posición, entre la masa total.',
            ecuacion: [{ sub: ['x', 'cm'] }, ` = ${f(suma)} / ${f(M)} = ${f(xc)} m`],
            dibujo: { datos: rectaCM(cs, xc, { min: -1, max: 13 }), estado: {} },
          },
        };
      },
    },
  };

  return {
    unidad: 'fisica.impulso-y-choques',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/fis-riel.js', '/nucleo/kit/piezas/torre.js', '/nucleo/kit/piezas/recta.js'],
    historia: {
      texto: 'En 1668 y 1669, la Royal Society de Londres recibió trabajos sobre choques de Wren y de Huygens. No todos los choques se comportaban igual, y había que separar lo que siempre se conserva de lo que a veces se pierde. Esa distinción es la de esta unidad.',
      pregunta: '¿Qué queda igual cuando dos cosas chocan?',
      fuente: { titulo: 'Royal Society — Picture Library (Wren y Huygens sobre choques)', url: 'https://pictures.royalsociety.org/image-rs-16018' },
    },
    ideas: [impulso, conservacion, elastico, restitucion, centro],
  };
});
