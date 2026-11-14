/*
 * Teoría de «Dinámica» (fisica.dinamica). Molde: docs/teoria.md y fisica.movimiento-rectilineo.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 5): ΣF = ma con masa constante en un marco inercial;
 * peso es fuerza y masa es inercia; N y T dependen de las restricciones; la centrípeta nombra una resultante radial,
 * no una fuerza más. Historia: Principia (1687); Newton no escribió allí F = ma en esa forma escolar.
 * Colores (regla 4): fuerza aplicada F y resultante ΣF naranja (c-o); peso P verde (c-d); normal N y tensión T
 * turquesa (c-i); aceleración a rojo (c-h). Rozamiento f, velocidad v y tiempo t van en tinta en esta unidad.
 * g = 10 m/s² en la Tierra, declarado en cada condición; Luna 1,6 y Marte 3,7 m/s² (valores redondeados).
 * Códigos de error: D1, D3, D5, D9 (dinamica-ideas-erroneas) y W5 (estatica-energia). Nuevos (hipótesis, sin dato):
 * DN-SUMA, DN-UNA, DN-POR, DN-SENTIDO, MP-PESO, MP-LIVIANO, MP-POR, MP-DIV, RM-MAYOR, RM-PESO, RM-SIN-ROCE, RM-SUMA,
 * PL-SISTEMA, PL-TPESO, PL-M1, DC-IGUAL, DC-MAYOR, DC-SIGNO, AS-SIGNO, AS-MA, N-MG.
 * Estado: completa (14 nov 2026): seis ideas que cubren los seis temas del catálogo.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: seis usos de ΣF = ma, cada uno jugado antes de preguntarlo.
 *   Persona y condiciones: postulante de 4.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: halla a, N, T y el peso en otro lugar; decide el sentido de a sin mirar el de v.
 *   Orden de atención: 1.º el cuerpo y sus flechas · 2.º la lectura en vivo · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿la fuerza va hacia donde se mueve el cuerpo o hacia donde cambia su velocidad?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const F = { v: 'c-o', t: 'F' }, P = { v: 'c-d', t: 'P' }, N = { v: 'c-i', t: 'N' }, T = { v: 'c-i', t: 'T' }, a = { v: 'c-h', t: 'a' };
  const SF = ['Σ', F];
  const G = 10;
  const rad = g => g * Math.PI / 180;
  function azar(sm) {
    let q = (sm * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = arr => arr[Math.floor(r() * arr.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const o of distractores) {
      if (!Number.isFinite(o.valor)) continue;
      const txt = fmt(o.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: o.id, texto: txt, error: o.error, siFuera: o.siFuera });
    }
    return ops.slice(0, 4);
  }
  const caja = (cx, y0, w, h) => ({ puntos: [[cx - w / 2, y0], [cx + w / 2, y0], [cx + w / 2, y0 + h], [cx - w / 2, y0 + h]], cerrado: true });
  const piso = (x0, x1) => ({ puntos: [[x0, 0], [x1, 0]], rayado: true });

  // ---------- Idea 1: la aceleración sigue a la fuerza neta ----------
  // Cambia: F y m · Permanece: el carrito y su piso sin roce · Progresa: la flecha de a, que crece con F y se achica
  // con m · Se reserva: un carrito que avanza mientras F lo frena · Debe verse: a apunta como ΣF, no como v.
  const VISTA1 = { x0: -2, x1: 2, y0: -0.5, y1: 1.7 }, S1 = 70, KF1 = 8, KA1 = 8;
  function carrito(Fv, m, o = {}) {
    const av = Fv / m, w = 0.9, izq = -w / 2;
    const fl = [];
    if (Fv > 0) fl.push({ de: [izq - Fv * KF1 / S1, 0.3], d: [Fv, 0], escala: KF1, color: 'o', rotulo: `F = ${f(Fv, 0)} N`, rotuloEn: 'cola' });
    if (Fv < 0) fl.push({ de: [-izq - Fv * KF1 / S1, 0.3], d: [Fv, 0], escala: KF1, color: 'o', rotulo: `F = ${f(-Fv, 0)} N`, rotuloEn: 'cola' });
    if (o.v) fl.push({ de: [0, 0.95], d: [o.v, 0], escala: 12, rotulo: 'v', paso: 0 });
    if (!o.sinA && Fv !== 0) fl.push({ de: [0, o.v ? 1.35 : 0.95], d: [av, 0], escala: KA1, color: 'h', rotulo: `a = ${f(Math.abs(av), 2)} m/s²`, paso: o.pA || 0 });
    return {
      vista: VISTA1, alt: o.alt || `Carrito de ${f(m, 0)} kg empujado con ${f(Math.abs(Fv), 0)} N sin rozamiento; acelera ${f(Math.abs(av), 2)} m/s² hacia donde apunta la fuerza.`,
      poligonos: [piso(-1.95, 1.95), caja(0, 0.12, w, 0.5)],
      discos: [{ c: [-0.28, 0.08], r: 0.08 }, { c: [0.28, 0.08], r: 0.08 }],
      flechas: fl,
      textos: [{ en: [0, 0.32], texto: `${f(m, 0)} kg` }],
    };
  }
  const segunda = {
    id: 'fuerza-neta-acelera',
    titulo: 'La aceleración sigue a la fuerza',
    temas: ['Segunda ley de Newton'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Empuja un carrito sin rozamiento. Elige la fuerza y la masa, y mira la flecha roja de la aceleración.',
      voz: 'Duplica la masa con la misma fuerza. ¿Qué le pasa a a?',
      controles: [
        { id: 'F', etiqueta: 'F', color: 'c-o', min: 2, max: 12, paso: 2, inicio: 6, unidad: 'N', decimales: 0 },
        { id: 'm', etiqueta: 'm', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'kg', decimales: 0 },
      ],
      dibujo: val => ({ datos: carrito(val.F, val.m), estado: {} }),
      lectura: val => [a, ` = ${f(val.F / val.m, 2)} m/s² hacia la derecha`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un carrito avanza hacia la derecha. Una fuerza constante de 6 N lo empuja hacia la izquierda. ¿Hacia dónde apunta su aceleración ahora?',
      opciones: [
        { id: 'c', texto: 'Hacia la izquierda, como la fuerza', correcta: true },
        { id: 'v', texto: 'Hacia la derecha, como se mueve', error: 'D1', siFuera: 'Así sería si nada lo frenara y alguien lo empujara adelante. Aquí la única fuerza va a la izquierda.' },
        { id: 'cero', texto: 'No acelera: la fuerza es constante', error: 'D3', siFuera: 'Fuerza constante da aceleración constante, no cero. Su velocidad cambia cada segundo.' },
      ],
      dibujo: { datos: carrito(-6, 3, { v: 6, sinA: true, alt: 'Carrito que avanza a la derecha mientras una fuerza de 6 N lo empuja a la izquierda.' }), estado: {} },
      revelar: { datos: carrito(-6, 3, { v: 6 }), estado: {} },
      coincide: 'Coincide: la aceleración va con la fuerza neta, aunque el carrito siga avanzando.',
    },
    mira: {
      pieza: 'ejes',
      datos: {
        x: { min: 0, max: 5, paso: 1, nombre: 't', unidad: 's', decimales: 0 },
        y: { min: -4, max: 6, paso: 2, nombre: 'v', unidad: 'm/s', decimales: 0 },
        curvas: [{ puntos: [[0, 6], [5, -4]], color: 'h', desde: 1 }],
        puntos: [{ x: 0, y: 6, color: 'h', desde: 1 }, { x: 3, y: 0, color: 'h', rotulo: 'se detiene', guias: true, desde: 3 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Carrito de 3 kg a 6 m/s; 6 N lo frenan.', ecuacion: [a, ' = ', { frac: [SF, 'm'] }, ' = ', { frac: ['−6', '3'] }, ' = −2 m/s²'] },
        { estado: { corte: 2 }, texto: 'La velocidad baja 2 m/s cada segundo: la pendiente es a.', ecuacion: ['v = 6 − 2t'] },
        { estado: { corte: 3 }, texto: 'A los 3 s se detiene, pero la fuerza sigue: empieza a volver.', ecuacion: ['v(3) = 0   ·   ', a, ' = −2 m/s²'] },
      ],
    },
    regla: {
      texto: 'La fuerza neta no dice hacia dónde va el cuerpo: dice cómo cambia su velocidad. La aceleración apunta como la fuerza neta.',
      ecuacion: [SF, ' = m ', a],
      condicion: 'masa constante y medida desde un marco inercial (el piso). ΣF suma todas las fuerzas sobre el cuerpo, con signo.',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), m = r.ent(1, 5), F1 = r.de([4, 6, 8, 10, 12, 15, 20]);
        let F2; do { F2 = r.de([2, 3, 5, 6, 9, 12, 16]); } while (F2 === F1);
        const av = (F1 - F2) / m;
        const fmt = n => `${f(Math.abs(n), 2)} m/s² hacia la ${n >= 0 ? 'derecha' : 'izquierda'}`;
        return {
          pregunta: [`Sobre un bloque de ${m} kg, sin rozamiento, actúan `, F, ` = ${F1} N hacia la derecha y `, F, ` = ${F2} N hacia la izquierda. ¿Cuál es su aceleración?`],
          opciones: opciones(av, [
            { id: 'suma', valor: (F1 + F2) / m, error: 'DN-SUMA', siFuera: 'Sumar sirve si las dos empujan al mismo lado. Aquí se oponen.' },
            { id: 'una', valor: Math.max(F1, F2) * Math.sign(av) / m, error: 'DN-UNA', siFuera: 'Eso usa solo la fuerza mayor; la otra también actúa.' },
            { id: 'sentido', valor: -av, error: 'DN-SENTIDO', siFuera: 'El valor está bien; el sentido es el de la fuerza mayor.' },
          ], fmt),
          solucion: { texto: 'Se restan porque se oponen; manda la mayor.', ecuacion: [a, ` = (${F1} − ${F2}) / ${m} = ${f(av, 2)} m/s²`] },
        };
      },
    },
  };

  // ---------- Idea 2: la masa no cambia, el peso sí ----------
  // Cambia: la masa y el lugar (Tierra, Marte, Luna) · Permanece: la masa del cuerpo en cualquier lugar ·
  // Progresa: la flecha del peso, que sigue a g · Se reserva: el empujón horizontal, que acelera igual en todas partes ·
  // Debe verse: P = mg cambia con el lugar; la inercia, no.
  const LUGAR = { 10: 'Tierra', 3.7: 'Marte', 1.6: 'Luna' };
  const KP2 = 0.12;
  function persona(m, g, o = {}) {
    const Pv = m * g;
    return {
      vista: { x0: -2, x1: 2, y0: -1.2, y1: 1.6 }, escalaF: KP2,
      alt: o.alt || `Cuerpo de ${f(m, 0)} kg en ${LUGAR[g]}: pesa ${f(Pv, 0)} N.`,
      poligonos: [piso(-1.9, 1.9), caja(0, 0, 0.8, 1)],
      textos: [{ en: [0, 0.55], texto: `${f(m, 0)} kg` }, { en: [-1.2, 1.35], texto: LUGAR[g] }],
      flechas: [{ de: [0.1, 0.5], d: [0, -Pv], color: 'd', rotulo: `P = ${f(Pv, 0)} N` },
        ...(o.empuje ? [{ de: [-0.4 - o.empuje * 0.5 / 70, 0.5], d: [o.empuje, 0], escala: 0.5, color: 'o', rotulo: `${o.empuje} N`, rotuloEn: 'cola' },
          { de: [0, 1.2], d: [o.empuje / m, 0], escala: 25, color: 'h', rotulo: `a = ${f(o.empuje / m, 1)} m/s²` }] : [])],
    };
  }
  const masaPeso = {
    id: 'masa-y-peso',
    titulo: 'La masa viaja, el peso cambia',
    temas: ['Masa y peso'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Elige una masa y llévala a la Tierra, a Marte o a la Luna. Mira el peso.',
      voz: 'La masa escrita en la caja no cambia. ¿Y la flecha?',
      controles: [
        { id: 'm', etiqueta: 'm', min: 20, max: 80, paso: 20, inicio: 60, unidad: 'kg', decimales: 0 },
        { id: 'g', etiqueta: 'Lugar', opciones: [{ valor: 10, texto: 'Tierra' }, { valor: 3.7, texto: 'Marte' }, { valor: 1.6, texto: 'Luna' }], inicio: 10 },
      ],
      dibujo: val => ({ datos: persona(val.m, val.g), estado: {} }),
      lectura: val => [P, ` = ${f(val.m * val.g, 0)} N · m = ${f(val.m, 0)} kg en todo lugar`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un astronauta de 70 kg flota quieto junto a su nave en la Luna, sin rozamiento. Lo empujas 140 N horizontalmente. ¿Cuánto acelera, comparado con la Tierra?',
      opciones: [
        { id: 'c', texto: 'Igual: 2 m/s² en los dos lugares', correcta: true },
        { id: 'mas', texto: 'Más en la Luna: allá pesa menos', error: 'MP-PESO', siFuera: 'Allá pesa menos, cierto. Pero para acelerarlo de lado cuenta su masa, que es la misma.' },
        { id: 'menos', texto: 'Menos en la Luna', error: 'MP-LIVIANO', siFuera: 'Con la misma fuerza y la misma masa, la aceleración no cambia de lugar.' },
      ],
      dibujo: { datos: persona(70, 1.6, { alt: 'Astronauta de 70 kg en la Luna, con su peso de 112 N.' }), estado: {} },
      revelar: { datos: persona(70, 1.6, { empuje: 140 }), estado: {} },
      coincide: 'Coincide: 140 N entre 70 kg da 2 m/s² en la Luna y en la Tierra.',
    },
    mira: {
      datos: {
        vista: { x0: -2.4, x1: 2.4, y0: -1.5, y1: 1.6 }, escalaF: KP2,
        alt: 'El mismo cuerpo de 70 kg en la Tierra pesa 700 N y en la Luna 112 N; empujado con 140 N acelera 2 m/s² en los dos.',
        poligonos: [{ puntos: [[-2.3, 0], [-0.2, 0]], rayado: true }, { puntos: [[0.2, 0], [2.3, 0]], rayado: true }, caja(-1.25, 0, 0.7, 0.9), caja(1.25, 0, 0.7, 0.9)],
        textos: [{ en: [-1.25, 1.35], texto: 'Tierra' }, { en: [1.25, 1.35], texto: 'Luna' }, { en: [-1.25, 0.5], texto: '70 kg' }, { en: [1.25, 0.5], texto: '70 kg' },
          { en: [0.1, -1.35], texto: 'a = 2 m/s² en los dos', color: 'h', paso: 3 }],
        flechas: [{ de: [-1.15, 0.45], d: [0, -700], color: 'd', rotulo: '700 N', paso: 1 }, { de: [1.35, 0.45], d: [0, -112], color: 'd', rotulo: '112 N', paso: 2 }],
      },
      pasos: [
        { estado: { paso: 1 }, texto: 'En la Tierra, 70 kg pesan 700 N.', ecuacion: [P, ' = 70 · 10 = 700 N'] },
        { estado: { paso: 2 }, texto: 'En la Luna, la misma masa pesa mucho menos.', ecuacion: [P, ' = 70 · 1,6 = 112 N'] },
        { estado: { paso: 3 }, texto: 'Para acelerarlo de lado cuenta la masa, no el peso.', ecuacion: [a, ' = ', { frac: [F, 'm'] }, ' = ', { frac: ['140', '70'] }, ' = 2 m/s²'] },
      ],
    },
    regla: {
      texto: 'La masa mide cuánto cuesta cambiar la velocidad de un cuerpo y no depende del lugar. El peso es la fuerza con que lo atrae el astro.',
      ecuacion: [P, ' = m g'],
      condicion: 'g depende del lugar (Tierra ≈ 10, Marte ≈ 3,7, Luna ≈ 1,6 m/s²). En ΣF = ma va la masa, en kg.',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), m = r.de([40, 50, 60, 70, 80, 90]), g2 = r.de([3.7, 1.6]), PT = m * G, P2 = m * g2;
        return {
          pregunta: ['Un cuerpo pesa ', P, ` = ${PT} N en la Tierra (g = 10 m/s²). ¿Cuánto pesa en ${LUGAR[g2]}, donde g = ${f(g2, 1)} m/s²?`],
          opciones: opciones(P2, [
            { id: 'igual', valor: PT, error: 'MP-PESO', siFuera: 'Igual es la masa. El peso cambia con g.' },
            { id: 'por', valor: PT * g2, error: 'MP-POR', siFuera: 'Eso multiplica el peso por g: primero saca la masa.' },
            { id: 'div', valor: PT / g2, error: 'MP-DIV', siFuera: 'Dividir el peso entre el nuevo g no da su masa ni su peso.' },
          ], n => `${f(n, 2)} N`),
          solucion: { texto: `Su masa es ${PT} / 10 = ${m} kg, en todo lugar.`, ecuacion: [P, ` = ${m} · ${f(g2, 1)} = ${f(P2, 2)} N`] },
        };
      },
    },
  };

  // ---------- Idea 3: el rozamiento resta en la fuerza neta ----------
  // Cambia: F y μk · Permanece: el bloque de 5 kg (N = 50 N) · Progresa: la fuerza neta F − fk y con ella a ·
  // Se reserva: velocidad constante con fuerza (F = fk, a = 0) · Debe verse: lo que acelera es lo que sobra.
  const KF3 = 3, S3 = 82.35, KA3 = 20;
  function bloque(Fv, mu, o = {}) {
    const m = o.m || 5, Nv = m * G, fk = mu * Nv, neta = Math.max(0, Fv - fk), av = neta / m;
    return {
      vista: { x0: -1.7, x1: 1.7, y0: -0.4, y1: 1.3 }, escalaF: KF3,
      alt: o.alt || `Bloque de ${m} kg jalado con ${f(Fv, 0)} N; el rozamiento es ${f(fk, 0)} N y acelera ${f(av, 2)} m/s².`,
      poligonos: [piso(-1.65, 1.65), caja(0, 0, 0.9, 0.6)],
      textos: [{ en: [0, 0.35], texto: `${m} kg` }],
      flechas: [{ de: [-0.45 - Fv * KF3 / S3, 0.4], d: [Fv, 0], color: 'o', rotulo: `F = ${f(Fv, 0)} N`, rotuloEn: 'cola' },
        ...(fk > 0 && !o.sinF ? [{ de: [-0.45, 0.1], d: [-fk, 0], rotulo: `f = ${f(fk, 0)} N` }] : []),
        ...(o.sinA ? [] : [{ de: [0, 0.85], d: [av, 0], escala: KA3, color: 'h', rotulo: av > 0 ? `a = ${f(av, 2)} m/s²` : undefined }])],
    };
  }
  const roceMov = {
    id: 'rozamiento-en-movimiento',
    titulo: 'Acelera lo que sobra',
    temas: ['Rozamiento en movimiento'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Jala un bloque de 5 kg que ya desliza. Elige la fuerza y el coeficiente de rozamiento cinético μk.',
      voz: 'Busca la fuerza con la que no acelera.',
      controles: [
        { id: 'F', etiqueta: 'F', color: 'c-o', min: 10, max: 30, paso: 5, inicio: 20, unidad: 'N', decimales: 0 },
        { id: 'mu', etiqueta: 'μk', opciones: [{ valor: 0, texto: '0' }, { valor: 0.2, texto: '0,2' }, { valor: 0.4, texto: '0,4' }], inicio: 0.2 },
      ],
      dibujo: val => ({ datos: bloque(val.F, val.mu), estado: {} }),
      lectura: val => { const fk = val.mu * 50; return [`f = ${f(fk, 0)} N · `, a, ` = ${f(Math.max(0, val.F - fk) / 5, 2)} m/s²`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Un bloque de 5 kg se jala con 20 N y desliza con velocidad constante. ¿Cuánto vale el rozamiento?',
      opciones: [
        { id: 'c', texto: '20 N', correcta: true },
        { id: 'menos', texto: 'Menos de 20 N: si no, no avanzaría', error: 'W5', siFuera: 'Para arrancar, sí hace falta ganar. Para seguir a velocidad constante basta que se cancelen.' },
        { id: 'peso', texto: '50 N, su peso', error: 'RM-PESO', siFuera: 'El peso es vertical. El rozamiento depende de N y de μ, no es el peso.' },
        { id: 'cero', texto: '0 N: ya está en movimiento', error: 'RM-SIN-ROCE', siFuera: 'Sin rozamiento, 20 N lo acelerarían 4 m/s². Si no acelera, algo cancela.' },
      ],
      dibujo: { datos: bloque(20, 0.4, { sinF: true, sinA: true, alt: 'Bloque de 5 kg jalado con 20 N que desliza a velocidad constante; el rozamiento no está dibujado.' }), estado: {} },
      revelar: { datos: bloque(20, 0.4), estado: {} },
      coincide: 'Coincide: velocidad constante es a = 0, y entonces las fuerzas se cancelan.',
    },
    mira: {
      datos: bloque(30, 0.4, { alt: 'Bloque de 5 kg jalado con 30 N con rozamiento de 20 N: le sobran 10 N y acelera 2 m/s².' }),
      pasos: [
        { estado: {}, texto: 'El piso empuja hacia arriba lo mismo que el peso.', ecuacion: [N, ' = m g = 50 N'] },
        { estado: {}, texto: 'Deslizando, el rozamiento vale μk por N.', ecuacion: ['f = 0,4 · 50 = 20 N'] },
        { estado: {}, texto: 'La fuerza neta es lo que sobra.', ecuacion: [SF, ' = 30 − 20 = 10 N'] },
        { estado: {}, texto: 'Eso, entre la masa, es la aceleración.', ecuacion: [a, ' = ', { frac: ['10', '5'] }, ' = 2 m/s²'] },
      ],
    },
    regla: {
      texto: 'Al deslizar, el rozamiento cinético se resta de la fuerza que jala. Solo lo que sobra acelera al bloque.',
      ecuacion: [F, ' − ', { sub: ['μ', 'k'] }, N, ' = m ', a],
      condicion: 'el bloque ya desliza sobre piso horizontal; f apunta contra el deslizamiento.',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), m = r.ent(2, 8), mu = r.de([0.1, 0.2, 0.25, 0.3, 0.5]), Nv = m * G, fk = mu * Nv;
        const Fv = Math.round(fk + m * r.de([0.5, 1, 1.5, 2, 3]));
        const av = (Fv - fk) / m;
        return {
          pregunta: ['Un bloque de ', `${m} kg desliza sobre el piso (μk = ${f(mu, 2)}) jalado con `, F, ` = ${Fv} N horizontal. Con g = 10 m/s², ¿cuál es su aceleración?`],
          opciones: opciones(av, [
            { id: 'sin-roce', valor: Fv / m, error: 'RM-SIN-ROCE', siFuera: 'Eso ignora el rozamiento; resta μk N antes de dividir.' },
            { id: 'suma', valor: (Fv + fk) / m, error: 'RM-SUMA', siFuera: 'El rozamiento va en contra: se resta, no se suma.' },
            { id: 'mu-m', valor: (Fv - mu * m) / m, error: 'RM-PESO', siFuera: 'Eso usa μk por la masa; el rozamiento es μk por N = mg.' },
          ], n => `${f(n, 2)} m/s²`),
          solucion: { texto: `El rozamiento es ${f(mu, 2)} · ${Nv} = ${f(fk, 1)} N.`, ecuacion: [a, ` = (${Fv} − ${f(fk, 1)}) / ${m} = ${f(av, 2)} m/s²`] },
        };
      },
    },
  };

  // ---------- Idea 4: plano inclinado y sistemas con polea ----------
  // Cambia: el ángulo y la masa del bloque · Permanece: el plano sin roce · Progresa: la parte del peso a lo largo
  // del plano · Se reserva: la masa, que no cambia a · Debe verse: a = g sen θ; en un sistema, ΣF entre masa total.
  const KP4 = 1.5, KA4 = 12;
  function plano(m, ang, o = {}) {
    const L = 3, c = Math.cos(rad(ang)), s = Math.sin(rad(ang)), H = L * s, B = L * c;
    const u = [-c, -s], nrm = [-s, c]; // a lo largo (hacia abajo) y normal
    const pc = [B * 0.55, H * 0.55], C = [pc[0] + nrm[0] * 0.25, pc[1] + nrm[1] * 0.25];
    const w = 0.5, h = 0.5;
    const esq = [[-w / 2, 0], [w / 2, 0], [w / 2, h], [-w / 2, h]].map(([p, q]) => [pc[0] - u[0] * p * -1 + nrm[0] * q, pc[1] - u[1] * p * -1 + nrm[1] * q]);
    const Pv = m * G, av = G * s;
    return {
      vista: { x0: -0.6, x1: 3.2, y0: -0.6, y1: 2.9 }, escalaF: KP4,
      alt: o.alt || `Bloque de ${m} kg en un plano sin roce a ${ang}°: baja con a = ${f(av, 2)} m/s², sin importar su masa.`,
      poligonos: [{ puntos: [[0, 0], [B, 0], [B, H]], cerrado: true }, { puntos: esq, cerrado: true }],
      arcos: [{ c: [0, 0], rpx: 30, de: 0, a: ang, rotulo: `${ang}°` }],
      flechas: [
        { de: C, d: [0, -Pv], color: 'd', rotulo: `P = ${Pv} N` },
        { de: C, d: [u[0] * Pv * s, u[1] * Pv * s], color: 'd', discontinua: true, rotulo: 'P sen θ', paso: o.pC || 0 },
        { de: C, d: [nrm[0] * Pv * c, nrm[1] * Pv * c], color: 'i', rotulo: 'N', paso: o.pC || 0 },
        ...(o.sinA ? [] : [{ de: [C[0] + nrm[0] * 0.55, C[1] + nrm[1] * 0.55], d: [u[0] * av, u[1] * av], escala: KA4, color: 'h', rotulo: 'a' }]),
      ],
    };
  }
  function mesaPolea(m1, m2, o = {}) {
    const av = m2 * G / (m1 + m2), Tv = m1 * av;
    return {
      vista: { x0: -2, x1: 2, y0: -2.2, y1: 1.6 }, escalaF: 2.2,
      alt: `Bloque de ${m1} kg sobre una mesa sin roce, unido por una cuerda a uno de ${m2} kg que cuelga: a = ${f(av, 2)} m/s², T = ${f(Tv, 1)} N.`,
      poligonos: [{ puntos: [[-1.9, 0], [1.2, 0], [1.2, -2.1]] }, caja(-0.6, 0, 0.8, 0.5), { puntos: [[-0.2, 0.25], [1.2, 0.25]] }, { puntos: [[1.45, 0], [1.45, -0.7]] }, caja(1.45, -1.15, 0.5, 0.45)],
      discos: [{ c: [1.2, 0], r: 0.25 }],
      textos: [{ en: [-0.6, 0.18], texto: `${m1} kg` }, { en: [1.45, -1.0], texto: `${m2} kg` }],
      flechas: [
        { de: [1.6, -1.15], d: [0, -m2 * G], color: 'd', rotulo: `${m2 * G} N`, paso: o.p1 || 0 },
        { de: [-0.6, 0.8], d: [av, 0], escala: 14, color: 'h', rotulo: `a = ${f(av, 0)} m/s²`, paso: o.p2 || 0 },
        { de: [-0.2, 0.25], d: [Tv, 0], color: 'i', rotulo: `T = ${f(Tv, 0)} N`, paso: o.p3 || 0 },
        { de: [1.3, -0.7], d: [0, Tv], color: 'i', rotulo: 'T', lado: -1, paso: o.p4 || 0 },
      ],
    };
  }
  const planoIdea = {
    id: 'plano-y-polea',
    titulo: 'Planos y poleas',
    temas: ['Bloques, poleas y planos inclinados'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Un bloque baja por un plano sin rozamiento. Elige el ángulo y la masa del bloque.',
      voz: 'Cambia solo la masa. ¿Cambia la flecha roja?',
      controles: [
        { id: 'ang', etiqueta: 'Ángulo', opciones: [30, 37, 53].map(k => ({ valor: k, texto: `${k}°` })), inicio: 30 },
        { id: 'm', etiqueta: 'm', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'kg', decimales: 0 },
      ],
      dibujo: val => ({ datos: plano(val.m, val.ang), estado: {} }),
      lectura: val => [a, ` = ${f(G * ({ 30: 0.5, 37: 0.6, 53: 0.8 })[val.ang], 2)} m/s² · `, P, ` = ${val.m * G} N`],
      minimo: 4,
    },
    predice: {
      pregunta: 'En un plano sin rozamiento se sueltan un bloque de 2 kg y otro de 6 kg. ¿Cuál baja con más aceleración?',
      opciones: [
        { id: 'c', texto: 'Los dos igual', correcta: true },
        { id: 'pesado', texto: 'El de 6 kg: lo jala más fuerza', error: 'D5', siFuera: 'Lo jala tres veces más fuerza, cierto. Pero tiene tres veces más masa que mover.' },
        { id: 'liviano', texto: 'El de 2 kg: es más fácil de mover', error: 'D5', siFuera: 'Es más fácil de mover, pero lo jala menos fuerza. Las dos cosas se compensan.' },
      ],
      dibujo: { datos: plano(2, 30, { sinA: true }), estado: {} },
      revelar: { datos: plano(6, 30), estado: {} },
      coincide: 'Coincide: con el triple de masa, la fuerza también se triplica. a = g sen θ.',
    },
    mira: {
      datos: mesaPolea(3, 2, { p1: 1, p2: 2, p3: 3, p4: 4 }),
      pasos: [
        { estado: { paso: 1 }, texto: 'Sin roce, lo único que mueve al sistema es el peso que cuelga.', ecuacion: [P, ' = 2 · 10 = 20 N'] },
        { estado: { paso: 2 }, texto: 'Esa fuerza mueve las dos masas juntas.', ecuacion: [a, ' = ', { frac: ['20', '3 + 2'] }, ' = 4 m/s²'] },
        { estado: { paso: 3 }, texto: 'Al bloque de la mesa solo lo jala la cuerda.', ecuacion: [T, ' = 3 · 4 = 12 N'] },
        { estado: { paso: 4 }, texto: 'Comprobación con el que cuelga: la tensión no es su peso.', ecuacion: ['20 − 12 = 2 · 4 ✓'] },
      ],
    },
    regla: {
      texto: 'En un plano sin roce, el bloque baja con la parte del peso a lo largo del plano. Cuerpos unidos aceleran con la fuerza neta externa entre la masa total.',
      ecuacion: [a, ' = g sen θ   ·   ', a, ' = ', { frac: [['Σ', { sub: [F, 'ext'] }], 'Σm'] }],
      condicion: 'sin rozamiento, cuerdas que no se estiran y poleas sin masa. θ se mide desde la horizontal.',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), m1 = r.ent(1, 8), m2 = r.ent(1, 6), av = m2 * G / (m1 + m2), Tv = m1 * av, pide = sm % 2 ? 'T' : 'a';
        const pre = `Un bloque de ${m1} kg sobre una mesa sin roce está unido por una cuerda, a través de una polea, a otro de ${m2} kg que cuelga. Con g = 10 m/s², `;
        return pide === 'a' ? {
          pregunta: pre + '¿cuánto acelera el sistema?',
          opciones: opciones(av, [
            { id: 'g', valor: G, error: 'PL-SISTEMA', siFuera: 'g sería si el que cuelga cayera solo. También arrastra al de la mesa.' },
            { id: 'm1', valor: m2 * G / m1, error: 'PL-M1', siFuera: 'Eso divide entre una sola masa; se mueven las dos juntas.' },
            { id: 'm2', valor: m1 * G / (m1 + m2), error: 'PL-M1', siFuera: 'Eso usa el peso del bloque de la mesa, que el piso cancela.' },
          ], n => `${f(n, 2)} m/s²`),
          solucion: { texto: 'El peso del que cuelga mueve las dos masas.', ecuacion: [a, ` = ${m2 * G} / (${m1} + ${m2}) = ${f(av, 2)} m/s²`] },
        } : {
          pregunta: pre + '¿cuánto vale la tensión de la cuerda?',
          opciones: opciones(Tv, [
            { id: 'peso', valor: m2 * G, error: 'PL-TPESO', siFuera: 'T igual al peso sería si el bloque que cuelga estuviera quieto.' },
            { id: 'cero', valor: 0, error: 'PL-SISTEMA', siFuera: 'Sin tensión, el bloque de la mesa no se movería.' },
            { id: 'm2a', valor: m2 * av, error: 'PL-M1', siFuera: 'Esa es la fuerza neta del que cuelga, no la tensión.' },
          ], n => `${f(n, 2)} N`),
          solucion: { texto: `Primero a = ${f(av, 2)} m/s²; al de la mesa solo lo jala T.`, ecuacion: [T, ` = ${m1} · ${f(av, 2)} = ${f(Tv, 2)} N`] },
        };
      },
    },
  };

  // ---------- Idea 5: la centrípeta es una resultante ----------
  // Cambia: la rapidez del auto en lo alto de la loma · Permanece: el peso y el radio · Progresa: N, que baja al ir
  // más rápido · Se reserva: la rapidez con la que N llega a cero · Debe verse: P − N = mv²/r; no hay fuerza extra.
  const M5 = 1000, R5 = 10, KF5 = 0.008, KA5 = 8;
  function loma(vv, o = {}) {
    const acv = vv * vv / R5, Nv = Math.max(0, M5 * (G - acv)), top = [0, R5 + 0.55];
    return {
      vista: { x0: -5.5, x1: 5.5, y0: 6.2, y1: 14.6 }, escalaF: KF5,
      alt: o.alt || `Auto de 1000 kg en lo alto de una loma de radio 10 m, a ${f(vv, 1)} m/s: el piso empuja con ${f(Nv, 0)} N, menos que su peso.`,
      arcos: [{ c: [0, 0], r: R5, de: 55, a: 125 }],
      poligonos: [caja(0, R5, 1.8, 0.6)],
      discos: [{ c: [-0.55, R5 + 0.05], r: 0.2 }, { c: [0.55, R5 + 0.05], r: 0.2 }],
      segmentos: [{ de: [0, R5 - 3.5], a: [0, 6.2], discontinua: true, texto: 'al centro', lado: -1 }],
      flechas: [
        { de: [-0.3, top[1]], d: [0, -M5 * G], color: 'd', rotulo: '10 000 N', lado: -1, paso: o.pP || 0 },
        ...(o.sinN ? [] : [{ de: [0.3, top[1]], d: [0, Nv], color: 'i', rotulo: `N = ${f(Nv, 0)} N`, lado: -1, paso: o.pN || 0 }]),
        ...(o.sinA || acv === 0 ? [] : [{ de: [3, 13.2], d: [0, -acv], escala: KA5, color: 'h', rotulo: `${f(acv, 2)} m/s²`, paso: o.pA || 0 }]),
      ],
    };
  }
  const circular = {
    id: 'centripeta-es-resultante',
    titulo: 'La centrípeta es una resultante',
    temas: ['Dinámica circular'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Un auto de 1000 kg pasa por lo alto de una loma de 10 m de radio. Elige su rapidez y mira la normal.',
      voz: 'Sube la rapidez de a poco. ¿Qué flecha se achica?',
      controles: [{ id: 'v', etiqueta: 'v', min: 0, max: 10, paso: 2.5, inicio: 5, unidad: 'm/s', decimales: 1 }],
      dibujo: val => ({ datos: loma(val.v), estado: {} }),
      lectura: val => [N, ` = ${f(Math.max(0, M5 * (G - val.v * val.v / R5)), 0)} N · `, P, ' = 10 000 N'],
      minimo: 3,
    },
    predice: {
      pregunta: 'En lo alto de una loma de radio 10 m, un auto de 1000 kg va a 5 m/s. ¿Cómo es la normal comparada con su peso?',
      opciones: [
        { id: 'c', texto: 'Menor que el peso', correcta: true },
        { id: 'igual', texto: 'Igual al peso: está apoyado', error: 'DC-IGUAL', siFuera: 'Igual sería en un piso plano. En la loma, parte del peso dobla su camino hacia abajo.' },
        { id: 'mayor', texto: 'Mayor: hay que sumar la centrípeta', error: 'D9', siFuera: 'La centrípeta no es otra fuerza que se suma: es lo que resulta de P y N juntas.' },
      ],
      dibujo: { datos: loma(5, { sinN: true, sinA: true, alt: 'Auto de 1000 kg en lo alto de una loma, a 5 m/s; solo está dibujado su peso.' }), estado: {} },
      revelar: { datos: loma(5), estado: {} },
      coincide: 'Coincide: la resultante debe apuntar al centro, hacia abajo, así que N < P.',
    },
    mira: {
      datos: loma(5, { pP: 1, pA: 2, pN: 3 }),
      pasos: [
        { estado: { paso: 1 }, texto: 'Sobre el auto actúan el peso, hacia abajo…', ecuacion: [P, ' = 1000 · 10 = 10 000 N'] },
        { estado: { paso: 2 }, texto: 'Para curvar su camino, necesita una aceleración hacia el centro.', ecuacion: [{ sub: [a, 'c'] }, ' = ', { frac: ['5²', '10'] }, ' = 2,5 m/s²'] },
        { estado: { paso: 3 }, texto: '…y la normal: la resultante de las dos da esa aceleración.', ecuacion: [P, ' − ', N, ' = m ', { sub: [a, 'c'] }, '   →   ', N, ' = 7500 N'] },
      ],
    },
    regla: {
      texto: 'En un giro, la suma de las fuerzas hacia el centro vale m v²/r. «Centrípeta» es el nombre de esa resultante, no una fuerza nueva.',
      ecuacion: ['Σ', { sub: [F, 'radial'] }, ' = m ', { frac: [{ sup: ['v', '2'] }, 'r'] }],
      condicion: 'se toma positivo hacia el centro. Si N llegara a ser negativa, el auto ya se despegó del piso.',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), m = r.de([500, 800, 1000, 1200]), rr = r.de([10, 20, 40]), vv = r.de([4, 5, 6, 8, 10]), arriba = sm % 2 === 0;
        const acv = vv * vv / rr, Nv = arriba ? m * (G - acv) : m * (G + acv);
        if (arriba && Nv < 0) return this.generar(sm + 1000);
        return {
          pregunta: `Un auto de ${m} kg pasa a ${vv} m/s por ${arriba ? 'lo alto de una loma' : 'lo más bajo de una hondonada'} de radio ${rr} m. Con g = 10 m/s², ¿cuánto vale la normal?`,
          opciones: opciones(Nv, [
            { id: 'mg', valor: m * G, error: 'DC-IGUAL', siFuera: 'mg sería en un piso plano; aquí el camino se curva.' },
            { id: 'signo', valor: arriba ? m * (G + acv) : m * (G - acv), error: 'DC-SIGNO', siFuera: arriba ? 'Eso suma: valdría en una hondonada, con el centro arriba.' : 'Eso resta: valdría en una loma, con el centro abajo.' },
            { id: 'solo', valor: m * acv, error: 'DC-MAYOR', siFuera: 'Esa es la resultante hacia el centro, no la normal.' },
          ], n => `${f(n, 0)} N`),
          solucion: { texto: arriba ? 'El centro está abajo: P − N = mv²/r.' : 'El centro está arriba: N − P = mv²/r.', ecuacion: [N, ` = ${m} · (10 ${arriba ? '−' : '+'} ${f(acv, 2)}) = ${f(Nv, 0)} N`] },
        };
      },
    },
  };

  // ---------- Idea 6: el ascensor y los marcos inerciales ----------
  // Cambia: la aceleración del ascensor · Permanece: la persona de 60 kg y su peso · Progresa: la lectura de la
  // balanza, N · Se reserva: el ascensor a velocidad constante, que marca igual que en reposo ·
  // Debe verse: la balanza mide N, y N depende de a, no de v.
  const M6 = 60, KF6 = 0.12, KA6 = 10;
  function ascensor(av, o = {}) {
    const Nv = M6 * (G + av);
    return {
      vista: { x0: -2, x1: 2, y0: -1.1, y1: 3.2 }, escalaF: KF6,
      alt: o.alt || `Persona de 60 kg sobre una balanza en un ascensor con aceleración ${f(av, 0)} m/s² (positiva hacia arriba): la balanza marca ${f(Nv, 0)} N.`,
      poligonos: [caja(0, 0, 2.4, 3), caja(-0.3, 0, 0.9, 0.12), caja(-0.3, 0.12, 0.5, 1.4)],
      textos: [{ en: [-0.3, 0.85], texto: '60 kg' }, { en: [0, 2.65], texto: `balanza: ${f(Nv, 0)} N`, paso: o.pN || 0 }],
      flechas: [
        { de: [-0.15, 0.82], d: [0, -M6 * G], color: 'd', rotulo: '600 N', paso: o.pP || 0 },
        { de: [-0.45, 0.82], d: [0, Nv], color: 'i', rotulo: 'N', lado: -1, paso: o.pN || 0 },
        ...(av !== 0 ? [{ de: [1.6, 1.5], d: [0, av], escala: KA6, color: 'h', rotulo: `a = ${f(Math.abs(av), 0)}`, paso: o.pA || 0 }] : []),
      ],
    };
  }
  const ascensorIdea = {
    id: 'ascensor-y-marcos',
    titulo: 'La balanza del ascensor',
    temas: ['Movimiento relativo y sistemas inerciales'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Una persona de 60 kg está sobre una balanza en un ascensor. Elige la aceleración del ascensor: positiva es hacia arriba.',
      voz: 'Prueba a = 0. ¿Importa si el ascensor sube o baja?',
      controles: [{ id: 'a', etiqueta: 'a', color: 'c-h', min: -4, max: 4, paso: 2, inicio: 2, unidad: 'm/s²', decimales: 0 }],
      dibujo: val => ({ datos: ascensor(val.a), estado: {} }),
      lectura: val => [`La balanza marca `, N, ` = ${f(M6 * (G + val.a), 0)} N`],
      minimo: 3,
    },
    predice: {
      pregunta: 'El ascensor sube a velocidad constante de 3 m/s. ¿Qué marca la balanza de la persona de 60 kg?',
      opciones: [
        { id: 'c', texto: '600 N, como en reposo', correcta: true },
        { id: 'mas', texto: 'Más de 600 N: está subiendo', error: 'D1', siFuera: 'Marca más mientras el ascensor acelera hacia arriba. Con velocidad constante, a = 0.' },
        { id: 'menos', texto: 'Menos de 600 N', error: 'AS-SIGNO', siFuera: 'Marca menos si acelera hacia abajo. Aquí la velocidad no cambia.' },
      ],
      dibujo: { datos: Object.assign(ascensor(0, { pN: 9 }), { alt: 'Persona de 60 kg en un ascensor que sube a velocidad constante; la lectura de la balanza no se muestra.' }), estado: {} },
      revelar: { datos: ascensor(0), estado: {} },
      coincide: 'Coincide: un ascensor a velocidad constante es un marco inercial; todo pasa como en reposo.',
    },
    mira: {
      datos: ascensor(2, { pP: 1, pA: 2, pN: 3 }),
      pasos: [
        { estado: { paso: 1 }, texto: 'Sobre la persona actúan su peso y la balanza, que empuja hacia arriba.', ecuacion: [P, ' = 600 N'] },
        { estado: { paso: 2 }, texto: 'El ascensor acelera hacia arriba: la persona acelera con él.', ecuacion: [a, ' = +2 m/s²'] },
        { estado: { paso: 3 }, texto: 'La balanza empuja más que el peso para darle esa aceleración.', ecuacion: [N, ' − 600 = 60 · 2   →   ', N, ' = 720 N'] },
        { estado: { paso: 3 }, texto: 'Si el cable se cortara, a = −10 y la balanza marcaría 0.', ecuacion: [N, ' = 60 · (10 − 10) = 0'] },
      ],
    },
    regla: {
      texto: 'Las leyes de Newton valen igual en todo marco que se mueve con velocidad constante. Si el ascensor acelera, la balanza ya no marca el peso.',
      ecuacion: [N, ' − m g = m ', a, '   →   ', N, ' = m (g + ', a, ')'],
      condicion: 'a positiva hacia arriba, medida desde el piso del edificio (marco inercial). La balanza mide N, no el peso.',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), m = r.de([50, 60, 70, 80]), am = r.de([1, 2, 3, 4]);
        const CASOS = [['sube y va cada vez más rápido', 1], ['sube y está frenando', -1], ['baja y va cada vez más rápido', -1], ['baja y está frenando', 1]];
        const [txt, sg] = CASOS[sm % 4], av = sg * am, Nv = m * (G + av);
        return {
          pregunta: `Una persona de ${m} kg está sobre una balanza en un ascensor que ${txt}, con aceleración de ${am} m/s². Con g = 10 m/s², ¿qué marca la balanza?`,
          opciones: opciones(Nv, [
            { id: 'signo', valor: m * (G - av), error: 'AS-SIGNO', siFuera: 'El signo de a no lo da el sentido del viaje, sino si la velocidad hacia arriba crece o baja.' },
            { id: 'mg', valor: m * G, error: 'N-MG', siFuera: 'mg marcaría con velocidad constante; aquí acelera.' },
            { id: 'ma', valor: m * am, error: 'AS-MA', siFuera: 'Eso es solo la fuerza neta; falta sostener el peso.' },
          ], n => `${f(n, 0)} N`),
          solucion: { texto: `La aceleración apunta hacia ${sg > 0 ? 'arriba' : 'abajo'}.`, ecuacion: [N, ` = ${m} · (10 ${sg > 0 ? '+' : '−'} ${am}) = ${f(Nv, 0)} N`] },
        };
      },
    },
  };

  return {
    unidad: 'fisica.dinamica',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/fis-lienzo.js'],
    historia: {
      texto: 'En el siglo XVII, explicar el movimiento obligó a conectar choques, caídas y órbitas. Las conversaciones entre Halley, Hooke, Wren y Newton sobre órbitas forman parte del origen de los Principia, de 1687. Newton escribió allí sus leyes del movimiento, aunque no con la fórmula escolar F = ma: esa forma llegó después.',
      pregunta: '¿Qué dice una fuerza: hacia dónde vas o cómo cambias?',
      fuente: { titulo: 'The Newton Project — introducción', url: 'https://newtonproject.ox.ac.uk/texts/introduction' },
    },
    ideas: [segunda, masaPeso, roceMov, planoIdea, circular, ascensorIdea],
  };
});
