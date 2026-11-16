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

  // Gesto directo (docs/teoria.md §4b): la manija vive en las coordenadas del lienzo (fis-lienzo.geometria, con los
  // mismos datos que dibuja la idea). Si la relación no es lineal (el ángulo del plano), mover elige el valor del
  // control cuya manija queda más cerca del dedo.
  const LZ = datos => Kit.piezas['fis-lienzo'].geometria(datos);
  const cercano = (c, donde, pt) => {
    let mejor = null, dist = Infinity;
    for (const v of c.opciones.map(o => o.valor)) { const q = donde(v), dd = Math.hypot(q.x - pt.x, q.y - pt.y); if (dd < dist - 1e-9) { dist = dd; mejor = v; } }
    return mejor;
  };

  // Animación (decisión de Gerson, 15 nov: física se mueve sola; docs/3d.md §6). Cada cuadro sale de la cinemática
  // de aceleración constante con la a que da ΣF = ma (regla 1): x = v0 t + ½ a t², v = v0 + a t, en fórmula cerrada.
  // Si a < 0, el cuerpo frena hasta v = 0 y ahí queda (el rozamiento estático lo sostiene); si llega al final de la
  // pista (D metros; el plano inclinado), se queda abajo hasta que t vuelve a empezar. Con D = Infinity no hay final.
  function recorrido(av, v0, D, tt) {
    if (av < 0) {
      const ts = v0 / -av, te = Math.min(tt, ts);
      return { x: v0 * te + av * te * te / 2, v: tt >= ts ? 0 : v0 + av * te, a: tt >= ts ? 0 : av, te, quieto: tt >= ts };
    }
    const tf = av > 0 ? (Math.sqrt(v0 * v0 + 2 * av * D) - v0) / av : (v0 > 0 ? D / v0 : Infinity);
    const te = Math.min(tt, tf);
    return { x: v0 * te + av * te * te / 2, v: v0 + av * te, a: av, te, fin: tt >= tf };
  }
  // Marcas cada dt segundos (estroboscopio): lo recorrido en cada instante k·dt hasta el momento actual.
  const marcasDe = (av, v0, D, tt, dt) => { const r = recorrido(av, v0, D, tt), out = []; for (let k = 0; k * dt <= r.te + 1e-9; k++) out.push(recorrido(av, v0, D, k * dt).x); return out; };
  // px por metro de fis-lienzo para una vista (la misma cuenta que su geometria: 280 × 260 px útiles).
  const escalaDe = v => Math.min(280 / (v.x1 - v.x0), 260 / (v.y1 - v.y0));
  // Cámara que sigue al cuerpo: avanza en pantalla hasta xMax y después el piso corre hacia atrás (postes cada 0,5 m,
  // fijos al piso), como una cámara que lo acompaña. xw es lo recorrido; X0, dónde empieza en pantalla.
  function camara(xw, X0, xMax, vista, marcas) {
    const off = Math.max(0, X0 + xw - xMax), L0 = vista.x0 + 0.05, L1 = vista.x1 - 0.05, POSTE = 0.5;
    const postes = [];
    for (let x = L0 + POSTE - (off % POSTE); x <= L1 + 1e-9; x += POSTE) postes.push({ de: [x, 0], a: [x, -0.14], grosor: 'fino' });
    return {
      xc: X0 + xw - off, off,
      poligonos: [{ puntos: [[L0, 0], [L1, 0]] }],
      segmentos: postes,
      puntos: marcas.map(x => X0 + x - off).filter(x => x >= L0).map(x => ({ x, y: -0.32, hueco: true })),
      textos: [{ en: [L0, vista.y1 - 0.12], texto: 'marcas cada 0,25 s', ancla: 'start', peso: 400 },
        ...(off > 0 ? [{ en: [L1, -0.7], texto: 'la cámara lo sigue', ancla: 'end', peso: 400 }] : [])],
    };
  }
  const tiempo = (max, paso, velocidad) => ({ id: 't', etiqueta: 't', min: 0, max, paso, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad, modo: 'repite' } });

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
  // El carrito animado: arranca del reposo en X01; pasado x = 0,9 m de pantalla, la cámara lo sigue (camara).
  const VISTA1T = { x0: -2, x1: 2.4, y0: -0.8, y1: 1.85 }, S1T = escalaDe(VISTA1T), KF1T = 5, KA1T = 5, KV1T = 4, X01 = -0.5;
  const carritoCam = (Fv, m, tt) => { const av = Fv / m, r = recorrido(av, 0, Infinity, tt); return Object.assign(camara(r.x, X01, 0.9, VISTA1T, marcasDe(av, 0, Infinity, tt, 0.25)), { r }); };
  function carritoT(Fv, m, tt) {
    const av = Fv / m, c = carritoCam(Fv, m, tt), r = c.r, xc = c.xc, izq = xc - 0.45, cola = izq - Fv * KF1T / S1T;
    return {
      vista: VISTA1T, alt: `Carrito de ${f(m, 0)} kg empujado con ${f(Fv, 0)} N sin rozamiento: acelera ${f(av, 2)} m/s²; a los ${f(r.te, 2)} s va a ${f(r.v, 1)} m/s.`,
      poligonos: [...c.poligonos, caja(xc, 0.12, 0.9, 0.5)],
      discos: [{ c: [xc - 0.28, 0.08], r: 0.08 }, { c: [xc + 0.28, 0.08], r: 0.08 }],
      segmentos: c.segmentos,
      flechas: [
        ...(Fv > 0 ? [{ de: [cola, 0.3], d: [Fv, 0], escala: KF1T, color: 'o' }] : []),
        ...(Fv > 0 ? [{ de: [xc - 0.3, 0.95], d: [av, 0], escala: KA1T, color: 'h', rotulo: 'a' }] : []),
        ...(r.v > 1e-9 ? [{ de: [xc - 0.3, 1.3], d: [r.v, 0], escala: KV1T, rotulo: 'v' }] : []),
      ],
      puntos: c.puntos,
      textos: [{ en: [xc, 0.32], texto: `${f(m, 0)} kg` },
        ...(Fv > 0 ? [{ en: [izq - 0.05, 0.72], texto: `F = ${f(Fv, 0)} N`, color: 'o', ancla: 'end' }] : []), ...c.textos],
    };
  }
  const segunda = {
    id: 'fuerza-neta-acelera',
    titulo: 'La aceleración sigue a la fuerza',
    temas: ['Segunda ley de Newton'],
    pieza: 'fis-lienzo',
    // Lee (fase 2): contexto y vocabulario. No dice hacia dónde apunta la aceleración del carrito de «Predice».
    lee: {
      tarjetas: [
        { titulo: 'Vacía o llena', texto: 'En la feria de Juliaca, arrancar una carretilla vacía cuesta poco; llena de papas, cuesta bastante más. Lo que cambia es la masa: cuánto se resiste un cuerpo a cambiar su velocidad.' },
        { titulo: 'Juntar las fuerzas', texto: ['Si varias fuerzas actúan a la vez, se juntan en una sola, la fuerza neta ', SF, '. Las que van al mismo lado se suman; las que se oponen, se restan.'],
          ecuacion: [SF, ' = ', { sub: [F, '1'] }, ' − ', { sub: [F, '2'] }] },
        { titulo: 'Qué mirar', texto: 'En el juego, el carrito arranca del reposo. Cambia la fuerza o la masa y mira el largo de la flecha roja y cómo se separan las marcas.' },
      ],
    },
    juega: {
      consigna: 'El carrito arranca del reposo, en cámara lenta. Elige la fuerza y la masa; mira la flecha roja y cómo se separan las marcas.',
      voz: 'Duplica la masa con la misma fuerza. ¿Qué le pasa a a?',
      controles: [
        { id: 'F', etiqueta: 'F', color: 'c-o', min: 2, max: 12, paso: 2, inicio: 6, unidad: 'N', decimales: 0 },
        { id: 'm', etiqueta: 'm', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'kg', decimales: 0 },
        tiempo(1.5, 0.05, 0.4),
      ],
      dibujo: val => ({ datos: carritoT(val.F, val.m, val.t), estado: {} }),
      lectura: val => { const r = recorrido(val.F / val.m, 0, Infinity, val.t); return [a, ` = ${f(val.F / val.m, 2)} m/s² · v = ${f(r.v, 1)} m/s · x = ${f(r.x, 2)} m`]; },
      minimo: 3,
      // Arrastra la cola de F hacia la izquierda: más fuerza. La flecha roja responde; el carrito sigue andando.
      arrastres: [{ id: 'empuje', etiqueta: 'cola de la fuerza F', color: 'c-o',
        donde: val => { const g = LZ(carritoT(val.F, val.m, val.t)); return { x: g.X(carritoCam(val.F, val.m, val.t).xc - 0.45) - val.F * KF1T, y: g.Y(0.3) }; },
        mover: (pt, val) => { const g = LZ(carritoT(val.F, val.m, val.t)); return { F: (g.X(carritoCam(val.F, val.m, val.t).xc - 0.45) - pt.x) / KF1T }; } }],
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
    // Hallazgo 9: «Mira» pasa del carrito a la gráfica v–t a propósito: el caso de la predicción (avanza mientras la
    // fuerza lo frena) solo se entiende siguiendo v en el tiempo, y la pendiente de esa recta es la flecha roja del juego.
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
        { estado: { corte: 3 }, texto: 'A los 3 s se detiene, pero la fuerza sigue: empieza a volver.', ecuacion: ['v(3) = 0', '   ·   ', a, ' = −2 m/s²'] },
      ],
    },
    regla: {
      texto: 'Segunda ley de Newton: la fuerza neta no dice hacia dónde va el cuerpo, sino cómo cambia su velocidad. La aceleración apunta como la fuerza neta.',
      ecuacion: [{ llave: [SF], nota: 'fuerza neta', color: 'c-o' }, ' = m ', a],
      condicion: 'masa constante y medida desde un marco inercial (el piso). ΣF suma todas las fuerzas sobre el cuerpo, con signo.',
    },
    // Así se resuelve: dos fuerzas opuestas sobre un bloque, calculado igual que «Ahora tú» (a = (F₁ − F₂) / m).
    resuelve: {
      generar(sm) {
        const r = azar(sm + 900), m = r.ent(1, 5), F1 = r.de([4, 6, 8, 10, 12, 15, 20]);
        let F2; do { F2 = r.de([2, 3, 5, 6, 9, 12, 16]); } while (F2 === F1);
        const neta = F1 - F2, av = neta / m, lado = av >= 0 ? 'derecha' : 'izquierda';
        return {
          enunciado: [`Sobre un bloque de ${m} kg, sin rozamiento, actúan `, { sub: [F, '1'] }, ` = ${F1} N hacia la derecha y `, { sub: [F, '2'] }, ` = ${F2} N hacia la izquierda. ¿Cuál es su aceleración?`],
          pasos: [
            { tipo: 'pide', texto: ['Piden la aceleración ', a, ' del bloque: cuánto vale y hacia dónde apunta.'] },
            { tipo: 'datos', texto: [`La masa es ${m} kg. Hay ${F1} N hacia la derecha y ${F2} N hacia la izquierda, sin rozamiento.`] },
            { tipo: 'regla', texto: 'La aceleración sale de la fuerza neta: junto todas las fuerzas con su signo y divido entre la masa.',
              ecuacion: [a, ' = ', { frac: [SF, 'm'] }] },
            { tipo: 'cuentas', texto: 'Tomo la derecha como positiva. Las dos fuerzas se oponen, así que se restan.',
              ecuacion: [SF, ` = ${F1} − ${F2} = ${f(neta, 0)} N   →   `, a, ` = ${f(neta, 0)} / ${m} = ${f(av, 2)} m/s²`] },
            { tipo: 'sentido', texto: `El signo ${av >= 0 ? 'positivo' : 'negativo'} dice que apunta a la ${lado}, como la fuerza mayor. Y N entre kg da m/s².` },
          ],
          respuesta: [a, ` = ${f(Math.abs(av), 2)} m/s² hacia la ${lado}`],
        };
      },
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
    // Lee (fase 2): contexto y vocabulario. No dice cuánto acelera el bloque empujado en la Luna de «Predice».
    lee: {
      tarjetas: [
        { titulo: 'Dos kilos de papa', texto: 'Cuando pides 2 kg de papa en el mercado, pides masa: cuánta materia hay. El peso es otra cosa: la fuerza con que la Tierra jala esas papas hacia abajo. Se mide en newtons, N.' },
        { titulo: 'Cada astro, su g', texto: 'Cada astro jala distinto. En la Tierra, g vale cerca de 10 m/s²; en Marte, 3,7; en la Luna, 1,6. El peso se calcula con la g del lugar.',
          ecuacion: [P, ' = m g'] },
        { titulo: 'Qué mirar', texto: 'En el juego, la masa sube y baja sola. Cambia de lugar y mira cuánto se alarga la flecha verde del peso por cada kilo.' },
      ],
    },
    juega: {
      consigna: 'La masa sube y baja sola. Llévala a la Tierra, a Marte o a la Luna, y mira cuánto crece el peso por cada kilo.',
      voz: 'Con la misma masa, ¿dónde es más corta la flecha del peso?',
      // La masa barre su rango (20 kg por segundo, ida y vuelta): P = m g crece con m, con la pendiente g del lugar.
      controles: [
        { id: 'm', etiqueta: 'm', min: 20, max: 80, paso: 20, inicio: 60, unidad: 'kg', decimales: 0, auto: { velocidad: 20, modo: 'rebota' } },
        { id: 'g', etiqueta: 'Lugar', opciones: [{ valor: 10, texto: 'Tierra' }, { valor: 3.7, texto: 'Marte' }, { valor: 1.6, texto: 'Luna' }], inicio: 10 },
      ],
      dibujo: val => ({ datos: persona(val.m, val.g), estado: {} }),
      lectura: val => [P, ` = ${f(val.m * val.g, 0)} N con m = ${f(val.m, 0)} kg: ${f(val.g, 1)} N por kilo`],
      minimo: 3,
      // Arrastra la punta del peso: cambias la masa (manija en tinta, como m). El lugar se elige con los botones.
      arrastres: [{ id: 'masa', etiqueta: 'masa (punta del peso)',
        donde: val => ({ x: LZ(persona(val.m, val.g)).X(0.1), y: LZ(persona(val.m, val.g)).Y(0.5) + val.m * val.g * KP2 }),
        mover: (pt, val) => ({ m: (pt.y - LZ(persona(val.m, val.g)).Y(0.5)) / (val.g * KP2) }) }],
    },
    predice: {
      pregunta: 'Un bloque de 70 kg descansa en la Luna sobre un piso sin rozamiento. Lo empujas con 140 N horizontales. ¿Cuánto acelera, comparado con la Tierra?',
      opciones: [
        { id: 'c', texto: 'Igual: 2 m/s² en los dos lugares', correcta: true },
        { id: 'mas', texto: 'Más en la Luna: allá pesa menos', error: 'MP-PESO', siFuera: 'Allá pesa menos, cierto. Pero para acelerarlo de lado cuenta su masa, que es la misma.' },
        { id: 'menos', texto: 'Menos en la Luna', error: 'MP-LIVIANO', siFuera: 'Con la misma fuerza y la misma masa, la aceleración no cambia de lugar.' },
      ],
      dibujo: { datos: persona(70, 1.6, { alt: 'Bloque de 70 kg en la Luna, con su peso de 112 N.' }), estado: {} },
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
      ecuacion: [P, ' = m ', { llave: ['g'], nota: 'según el lugar', color: 'c-d' }],
      condicion: 'g depende del lugar (Tierra ≈ 10, Marte ≈ 3,7, Luna ≈ 1,6 m/s²). En ΣF = ma va la masa, en kg.',
    },
    // Así se resuelve: el peso en otro lugar, calculado igual que «Ahora tú» (m = P / 10 y P = m g). La figura del
    // paso de las cuentas es la del juego (la función persona dibuja un bloque), con la masa y el lugar del ejercicio.
    resuelve: {
      pieza: 'fis-lienzo',
      generar(sm) {
        const r = azar(sm + 900), m = r.de([40, 50, 60, 70, 80, 90]), g2 = r.de([3.7, 1.6]), PT = m * G, P2 = m * g2;
        const astro = g2 === 1.6 ? 'la Luna' : 'Marte', Astro = g2 === 1.6 ? 'La Luna' : 'Marte';
        return {
          enunciado: ['Un cuerpo pesa ', P, ` = ${PT} N en la Tierra (g = 10 m/s²). ¿Cuánto pesa en ${astro}, donde g = ${f(g2, 1)} m/s²?`],
          pasos: [
            { tipo: 'pide', texto: ['Piden el peso ', P, ` en ${astro}: la fuerza con que ${astro} jala al cuerpo.`] },
            { tipo: 'datos', texto: [P, ` = ${PT} N en la Tierra, con g = 10 m/s². En ${astro}, g = ${f(g2, 1)} m/s².`] },
            { tipo: 'regla', texto: 'La masa es la misma en todo lugar; el peso es esa masa por la g del lugar.', ecuacion: [P, ' = m g'] },
            { tipo: 'cuentas', texto: 'Primero saco la masa con el dato de la Tierra. Después la multiplico por la g nueva.',
              ecuacion: [`m = ${PT} / 10 = ${m} kg   →   `, P, ` = ${m} · ${f(g2, 1)} = ${f(P2, 2)} N`],
              dibujo: { datos: persona(m, g2), estado: {} } },
            { tipo: 'sentido', texto: `${Astro} jala menos que la Tierra, así que pesa menos: ${f(P2, 2)} N contra ${PT} N. Y kg por m/s² da N.` },
          ],
          respuesta: [P, ` = ${f(P2, 2)} N en ${astro}`],
        };
      },
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
  // El bloque animado: ya desliza a V03 cuando t = 0. Si F supera al rozamiento acelera; si lo iguala va parejo; si
  // es menor, frena y se queda (el rozamiento estático iguala a F). Lo usan la idea y la mesa «bloque-libre».
  const VISTA3T = { x0: -1.9, x1: 2.3, y0: -0.8, y1: 1.85 }, S3T = escalaDe(VISTA3T), KA3T = 8, KV3T = 5, V03 = 1, X03 = -0.05;
  const deslizaDe = (Fv, mu, m, tt) => { const fk = mu * m * G, r = recorrido((Fv - fk) / m, V03, Infinity, tt); return Object.assign(r, { f: r.quieto ? Fv : fk }); };
  const bloqueCam = (Fv, mu, m, tt) => camara(deslizaDe(Fv, mu, m, tt).x, X03, 0.9, VISTA3T, marcasDe((Fv - mu * m * G) / m, V03, Infinity, tt, 0.25));
  function bloqueT(Fv, mu, m, tt) {
    const r = deslizaDe(Fv, mu, m, tt), c = bloqueCam(Fv, mu, m, tt), xc = c.xc, izq = xc - 0.45, cola = izq - Fv * KF3 / S3T;
    return {
      vista: VISTA3T, escalaF: KF3,
      alt: `Bloque de ${m} kg que desliza, jalado con ${f(Fv, 0)} N contra un rozamiento de ${f(r.f, 0)} N: a = ${f(r.a, 2)} m/s², v = ${f(r.v, 1)} m/s.`,
      poligonos: [...c.poligonos, caja(xc, 0, 0.9, 0.6)],
      segmentos: c.segmentos,
      flechas: [
        ...(Fv > 0 ? [{ de: [cola, 0.4], d: [Fv, 0], color: 'o' }] : []),
        ...(r.f > 0 ? [{ de: [izq, 0.1], d: [-r.f, 0], rotulo: 'f' }] : []),
        ...(Math.abs(r.a) > 1e-9 ? [{ de: [xc - 0.3, 1.0], d: [r.a, 0], escala: KA3T, color: 'h', rotulo: 'a' }] : []),
        ...(r.v > 1e-9 ? [{ de: [xc - 0.3, 1.32], d: [r.v, 0], escala: KV3T, rotulo: 'v' }] : []),
      ],
      puntos: c.puntos,
      textos: [{ en: [xc, 0.35], texto: `${m} kg` }, ...(Fv > 0 ? [{ en: [izq - 0.05, 0.72], texto: `F = ${f(Fv, 0)} N`, color: 'o', ancla: 'end' }] : []),
        ...(r.quieto ? [{ en: [xc, 1.0], texto: 'se detuvo' }] : []), ...c.textos],
    };
  }
  const lecturaRoce = (Fv, mu, m, tt) => { const r = deslizaDe(Fv, mu, m, tt); return [`f = ${f(r.f, 0)} N · `, a, ` = ${f(r.a, 2)} m/s² · v = ${f(r.v, 1)} m/s`]; };
  const roceMov = {
    id: 'rozamiento-en-movimiento',
    titulo: 'Acelera lo que sobra',
    temas: ['Rozamiento en movimiento'],
    pieza: 'fis-lienzo',
    // Lee (fase 2): contexto y vocabulario. No dice cuánto vale el rozamiento cuando el bloque va a velocidad constante.
    lee: {
      tarjetas: [
        { titulo: 'Se frena sola', texto: 'Empuja una caja por el piso de tu casa y suéltala: se detiene sola. La frena el rozamiento, una fuerza que el piso hace contra el deslizamiento.' },
        { titulo: 'Dos números', texto: ['Al deslizar, el rozamiento depende de qué tan áspero es el contacto, μk, y de cuánto aprieta el piso, la normal ', N, '. Un piso encerado tiene μk chico; uno de cemento, más grande.'],
          ecuacion: ['f = ', { sub: ['μ', 'k'] }, N] },
        { titulo: 'Qué mirar', texto: 'En el juego, el bloque ya va deslizando. Cambia la fuerza y μk, y mira hacia dónde apunta la flecha roja y cómo se separan las marcas.' },
      ],
    },
    juega: {
      consigna: 'Un bloque de 5 kg ya desliza, en cámara lenta. Elige la fuerza y el rozamiento μk; mira si acelera, va parejo o frena.',
      voz: 'Busca la fuerza con la que no acelera.',
      controles: [
        { id: 'F', etiqueta: 'F', color: 'c-o', min: 10, max: 30, paso: 5, inicio: 20, unidad: 'N', decimales: 0 },
        { id: 'mu', etiqueta: 'μk', opciones: [{ valor: 0, texto: '0' }, { valor: 0.2, texto: '0,2' }, { valor: 0.4, texto: '0,4' }], inicio: 0.2 },
        tiempo(1.5, 0.05, 0.4),
      ],
      dibujo: val => ({ datos: bloqueT(val.F, val.mu, 5, val.t), estado: {} }),
      lectura: val => lecturaRoce(val.F, val.mu, 5, val.t),
      minimo: 4,
      // Arrastra la cola de F hacia la izquierda: más fuerza. μk se elige con los botones.
      arrastres: [{ id: 'jalon', etiqueta: 'cola de la fuerza F', color: 'c-o',
        donde: val => { const g = LZ(bloqueT(val.F, val.mu, 5, val.t)), izq = bloqueCam(val.F, val.mu, 5, val.t).xc - 0.45; return { x: g.X(izq - val.F * KF3 / S3T), y: g.Y(0.4) }; },
        mover: (pt, val) => { const g = LZ(bloqueT(val.F, val.mu, 5, val.t)), izq = bloqueCam(val.F, val.mu, 5, val.t).xc - 0.45; return { F: (izq - g.Xi(pt.x)) * S3T / KF3 }; } }],
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
      ecuacion: [F, ' − ', { llave: [{ sub: ['μ', 'k'] }, N], nota: 'rozamiento', color: 'c-i' }, ' = m ', a],
      condicion: 'el bloque ya desliza sobre piso horizontal; f apunta contra el deslizamiento.',
    },
    // Así se resuelve: bloque que desliza con rozamiento, calculado igual que «Ahora tú» (fk = μk m g, a = (F − fk) / m).
    resuelve: {
      generar(sm) {
        const r = azar(sm + 900), m = r.ent(2, 8), mu = r.de([0.1, 0.2, 0.25, 0.3, 0.5]), Nv = m * G, fk = mu * Nv;
        const Fv = Math.round(fk + m * r.de([0.5, 1, 1.5, 2, 3]));
        const av = (Fv - fk) / m;
        return {
          enunciado: ['Un bloque de ', `${m} kg desliza sobre el piso (μk = ${f(mu, 2)}) jalado con `, F, ` = ${Fv} N horizontal. Con g = 10 m/s², ¿cuál es su aceleración?`],
          pasos: [
            { tipo: 'pide', texto: ['Piden la aceleración ', a, ' del bloque mientras desliza.'] },
            { tipo: 'datos', texto: [`m = ${m} kg, μk = ${f(mu, 2)} y `, F, ` = ${Fv} N. El piso es horizontal y g = 10 m/s².`] },
            { tipo: 'regla', texto: 'Al deslizar, el rozamiento va en contra: se lo resto a la fuerza que jala, y solo lo que sobra acelera.',
              ecuacion: [F, ' − ', { sub: ['μ', 'k'] }, N, ' = m ', a] },
            { tipo: 'cuentas', texto: 'En piso horizontal, la normal iguala al peso. Con ella saco el rozamiento y después lo que sobra, entre la masa.',
              ecuacion: [N, ` = ${m} · 10 = ${Nv} N   →   f = ${f(mu, 2)} · ${Nv} = ${f(fk, 1)} N   →   `, a, ` = (${Fv} − ${f(fk, 1)}) / ${m} = ${f(av, 2)} m/s²`] },
            { tipo: 'sentido', texto: `Sin rozamiento serían ${f(Fv / m, 2)} m/s²; con él sale menos, como debe ser. Y ${Fv} N le gana a ${f(fk, 1)} N: acelera hacia adelante.` },
          ],
          respuesta: [a, ` = ${f(av, 2)} m/s²`],
        };
      },
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
    const dd = o.d === undefined ? L * 0.55 : o.d;  // dónde está el bloque, medido sobre el plano desde abajo
    const pc = [c * dd, s * dd], C = [pc[0] + nrm[0] * 0.25, pc[1] + nrm[1] * 0.25];
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
        ...(o.sinA ? [] : [{ de: [C[0] + nrm[0] * 0.55, C[1] + nrm[1] * 0.55], d: [u[0] * av, u[1] * av], escala: o.KA || KA4, color: 'h', rotulo: 'a' }]),
      ],
      ...(o.marcas ? { puntos: o.marcas.map(q => ({ x: c * q - nrm[0] * 0.15, y: s * q - nrm[1] * 0.15, hueco: true })) } : {}),
      ...(o.textos ? { textos: o.textos } : {}),
    };
  }
  // El plano animado: el bloque se suelta en D04 y baja hasta D14 (medido sobre el plano), con s = ½ g sen θ t².
  // sen θ con los valores de los triángulos notables (30°, 37°, 53°), como en la lectura y en los exámenes.
  const D04 = 2.6, D14 = 0.7, KA4T = 6, SEN = { 30: 0.5, 37: 0.6, 53: 0.8 };
  const bajada = (ang, tt) => recorrido(G * SEN[ang], 0, D04 - D14, tt);
  const planoT = (m, ang, tt) => {
    const r = bajada(ang, tt), av = G * SEN[ang];
    return Object.assign(plano(m, ang, { d: D04 - r.x, KA: KA4T,
      marcas: marcasDe(av, 0, D04 - D14, tt, 0.1).map(x => D04 - x),
      textos: [{ en: [-0.5, 2.7], texto: 'marcas cada 0,1 s', ancla: 'start', peso: 400 }] }),
    { alt: `Bloque de ${m} kg que baja sin roce por un plano a ${ang}°: a = ${f(av, 2)} m/s²; a los ${f(r.te, 2)} s va a ${f(r.v, 1)} m/s.` });
  };
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
  const cimaPlano = (m, ang) => { const g = LZ(plano(m, ang)); return { x: g.X(3 * Math.cos(rad(ang))), y: g.Y(3 * Math.sin(rad(ang))) }; };
  const planoIdea = {
    id: 'plano-y-polea',
    titulo: 'Planos y poleas',
    temas: ['Bloques, poleas y planos inclinados'],
    pieza: 'fis-lienzo',
    // Lee (fase 2): contexto y vocabulario. No dice si la masa cambia la aceleración en el plano de «Predice».
    lee: {
      tarjetas: [
        { titulo: 'Máquinas viejas', texto: 'Una rampa para subir sacos a un camión y una polea para izar baldes en una obra son máquinas muy antiguas. En física se llaman plano inclinado y polea.' },
        { titulo: 'Unidos por la cuerda', texto: ['Una cuerda que no se estira obliga a dos bloques a moverse juntos: si uno avanza 1 m, el otro también. La fuerza con que jala la cuerda se llama tensión, ', T, '.'] },
        { titulo: 'Qué mirar', texto: 'En el juego, el bloque baja por el plano sin rozamiento. Cambia el ángulo, después la masa, y mira en cada caso la flecha roja y las marcas.' },
      ],
    },
    juega: {
      consigna: 'Un bloque baja por un plano inclinado sin rozamiento, en cámara lenta. Elige el ángulo y la masa; mira la flecha roja y las marcas.',
      voz: 'Cambia solo la masa. ¿Cambia la flecha roja?',
      controles: [
        { id: 'ang', etiqueta: 'Ángulo', opciones: [30, 37, 53].map(k => ({ valor: k, texto: `${k}°` })), inicio: 30 },
        { id: 'm', etiqueta: 'm', min: 1, max: 4, paso: 1, inicio: 2, unidad: 'kg', decimales: 0 },
        tiempo(1, 0.02, 0.25),
      ],
      dibujo: val => ({ datos: planoT(val.m, val.ang, val.t), estado: {} }),
      lectura: val => [a, ` = ${f(G * SEN[val.ang], 2)} m/s² · v = ${f(bajada(val.ang, val.t).v, 1)} m/s · `, P, ` = ${val.m * G} N`],
      minimo: 4,
      // Arrastra la cima del plano hacia arriba o abajo (cuenta solo la altura: el ángulo más cercano) o la punta del peso (la masa, en tinta como m).
      arrastres: [
        { id: 'cima', etiqueta: 'cima del plano (ángulo)',
          donde: val => cimaPlano(val.m, val.ang),
          mover: (pt, val) => ({ ang: cercano(planoIdea.juega.controles[0], ang => ({ x: pt.x, y: cimaPlano(val.m, ang).y }), pt) }) },
        { id: 'masa', etiqueta: 'masa del bloque (punta del peso)',
          donde: val => { const d = planoT(val.m, val.ang, val.t), g = LZ(d), C = d.flechas[0].de; return { x: g.X(C[0]), y: g.Y(C[1]) + val.m * G * KP4 }; },
          mover: (pt, val) => { const d = planoT(val.m, val.ang, val.t), g = LZ(d), C = d.flechas[0].de; return { m: (pt.y - g.Y(C[1])) / (G * KP4) }; } },
      ],
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
    // Hallazgo 9: «Mira» cambia del plano a la mesa con polea a propósito: la idea cubre los dos temas del catálogo y
    // la mesa lleva la misma regla (fuerza neta externa entre masa total) a dos cuerpos unidos. El plano ya se resolvió
    // en la predicción, con su revelado.
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
      ecuacion: [a, ' = g sen θ', '   ·   ', a, ' = ', { frac: [['Σ', { sub: [F, 'ext'] }], { llave: ['Σm'], nota: 'masa total', color: 'c-i' }] }],
      condicion: 'sin rozamiento, cuerdas que no se estiran y poleas sin masa. θ se mide desde la horizontal.',
    },
    // Así se resuelve: bloque en la mesa y otro que cuelga, calculado igual que «Ahora tú» (a = m₂g / (m₁ + m₂),
    // T = m₁a); pide a o T, alternando con la semilla.
    resuelve: {
      generar(sm) {
        const r = azar(sm + 900), m1 = r.ent(1, 8), m2 = r.ent(1, 6), av = m2 * G / (m1 + m2), Tv = m1 * av, pide = sm % 2 ? 'T' : 'a';
        const pre = `Un bloque de ${m1} kg sobre una mesa sin roce está unido por una cuerda, a través de una polea, a otro de ${m2} kg que cuelga. Con g = 10 m/s², `;
        const cuentaA = { tipo: 'cuentas', texto: 'La única fuerza externa que no se cancela es el peso del que cuelga; el peso del de la mesa lo cancela la normal.',
          ecuacion: [a, ` = ${m2 * G} / (${m1} + ${m2}) = ${f(av, 2)} m/s²`] };
        const comun = [
          { tipo: 'datos', texto: [`Sobre la mesa hay ${m1} kg; colgando, ${m2} kg, que pesan `, P, ` = ${m2 * G} N. No hay roce.`] },
          { tipo: 'regla', texto: 'Los bloques unidos se mueven como uno solo: la fuerza externa que los mueve, entre la masa total, da la aceleración.',
            ecuacion: [a, ' = ', { frac: [['Σ', { sub: [F, 'ext'] }], 'Σm'] }] },
          cuentaA,
        ];
        return pide === 'a' ? {
          enunciado: pre + '¿cuánto acelera el sistema?',
          pasos: [
            { tipo: 'pide', texto: ['Piden la aceleración ', a, ' del sistema: los dos bloques se mueven juntos, con la misma a.'] },
            ...comun,
            { tipo: 'sentido', texto: 'Sale menos que g = 10 m/s²: el que cuelga no cae solo, también arrastra al de la mesa. Y N entre kg da m/s².' },
          ],
          respuesta: [a, ` = ${f(av, 2)} m/s²`],
        } : {
          enunciado: pre + '¿cuánto vale la tensión de la cuerda?',
          pasos: [
            { tipo: 'pide', texto: ['Piden la tensión ', T, ': la fuerza con que la cuerda jala a cada bloque.'] },
            ...comun,
            { tipo: 'cuentas', texto: 'Al bloque de la mesa solo lo jala la cuerda: la tensión es su masa por la aceleración.',
              ecuacion: [T, ` = ${m1} · ${f(av, 2)} = ${f(Tv, 2)} N`] },
            { tipo: 'sentido', texto: `Compruebo con el que cuelga: su peso menos T es su masa por a. T sale menor que ${m2 * G} N porque baja acelerando.`,
              ecuacion: [`${m2 * G} − ${f(Tv, 2)} = ${f(m2 * G - Tv, 2)}   y   ${m2} · ${f(av, 2)} = ${f(m2 * av, 2)} ✓`] },
          ],
          respuesta: [T, ` = ${f(Tv, 2)} N`],
        };
      },
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
  const M5 = 1000, R5 = 10, KF5 = 0.008, KA5 = 8, KV5 = 5;
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
        // La flecha de v (tinta, escala propia) solo en el juego: es la que se arrastra.
        ...(o.conV ? [{ de: [0.9, R5 + 0.3], d: [vv, 0], escala: KV5, rotulo: 'v' }] : []),
      ],
    };
  }
  const circular = {
    id: 'centripeta-es-resultante',
    titulo: 'La centrípeta es una resultante',
    temas: ['Dinámica circular'],
    pieza: 'fis-lienzo',
    // Lee (fase 2): contexto y vocabulario. No dice si la normal en lo alto de la loma es mayor, igual o menor que el peso.
    lee: {
      tarjetas: [
        { titulo: 'Lomas y hondonadas', texto: 'En la carretera de Juliaca a Puno, el auto pasa por lomas, donde la pista sube y vuelve a bajar, y por hondonadas, donde baja y vuelve a subir. Cada tramo curvo es como un pedazo de círculo.' },
        { titulo: 'Centro y radio', texto: 'Ese círculo tiene su centro y su radio r. Una curva cerrada, de las que obligan a ir despacio, tiene r chico; una curva suave tiene r grande.' },
        { titulo: 'Qué mirar', texto: ['En el juego, el auto pasa por lo alto de una loma y su rapidez cambia sola. Compara el largo de la flecha turquesa, la normal ', N, ', con el de la verde, el peso ', P, '.'] },
      ],
    },
    juega: {
      consigna: 'Un auto de 1000 kg pasa por lo alto de una loma de radio 10 m. Su rapidez cambia sola: mira la normal.',
      voz: 'Mira cuando la rapidez sube. ¿Qué flecha se achica?',
      // La rapidez barre de 0 a 10 m/s y vuelve (2,5 m/s por segundo): N = m (g − v²/r) baja hasta 0.
      controles: [{ id: 'v', etiqueta: 'v', min: 0, max: 10, paso: 2.5, inicio: 5, unidad: 'm/s', decimales: 1, auto: { velocidad: 2.5, modo: 'rebota' } }],
      dibujo: val => ({ datos: loma(val.v, { conV: true }), estado: {} }),
      lectura: val => [N, ` = ${f(Math.max(0, M5 * (G - val.v * val.v / R5)), 0)} N · `, P, ' = 10 000 N'],
      minimo: 3,
      // Arrastra la punta de la flecha v hacia la derecha: más rápido. La normal (turquesa) responde.
      arrastres: [{ id: 'rapidez', etiqueta: 'rapidez del auto (punta de v)',
        donde: val => { const g = LZ(loma(val.v, { conV: true })); return { x: g.X(0.9) + val.v * KV5, y: g.Y(R5 + 0.3) }; },
        mover: (pt, val) => ({ v: (pt.x - LZ(loma(val.v, { conV: true })).X(0.9)) / KV5 }) }],
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
        { estado: { paso: 2 }, texto: 'Para curvar su camino, necesita una aceleración hacia el centro.', ecuacion: [{ sub: [a, 'c'] }, ' = ', { frac: [{ sup: ['5', '2'] }, '10'] }, ' = 2,5 m/s²'] },
        { estado: { paso: 3 }, texto: '…y la normal: la resultante de las dos da esa aceleración.', ecuacion: [P, ' − ', N, ' = m ', { sub: [a, 'c'] }, '   →   ', N, ' = 7500 N'] },
      ],
    },
    regla: {
      texto: 'En un giro, la suma de las fuerzas hacia el centro vale m v²/r. «Fuerza centrípeta» es el nombre de esa resultante, no una fuerza nueva.',
      ecuacion: ['Σ', { sub: [F, 'radial'] }, ' = m ', { llave: [{ frac: [{ sup: ['v', '2'] }, 'r'] }], nota: 'hacia el centro', color: 'c-h' }],
      condicion: 'se toma positivo hacia el centro. Si N llegara a ser negativa, el auto ya se despegó del piso.',
    },
    // Así se resuelve: la normal en una loma o una hondonada, calculado igual que «Ahora tú» (N = m (g ∓ v²/r));
    // las semillas pares van a la loma, como en «Ahora tú», y si el auto se despegaría se toma otra semilla.
    resuelve: {
      generar(sm) {
        const arriba = sm % 2 === 0;
        let m, rr, vv, acv, Nv;
        for (let k = 0; ; k++) {
          const r = azar(sm + 900 + 1000 * k);
          m = r.de([500, 800, 1000, 1200]); rr = r.de([10, 20, 40]); vv = r.de([4, 5, 6, 8, 10]);
          acv = vv * vv / rr; Nv = arriba ? m * (G - acv) : m * (G + acv);
          if (!(arriba && Nv < 0)) break;
        }
        const ac = { sub: [a, 'c'] }, v2r = { frac: [{ sup: ['v', '2'] }, 'r'] };
        const sentido = !arriba ? `En la hondonada la pista empuja más que el peso, ${f(m * G, 0)} N: además de sostener al auto, dobla su camino hacia arriba.`
          : Nv > 0 ? `En la loma la pista empuja menos que el peso, ${f(m * G, 0)} N: parte del peso se usa en doblar el camino hacia abajo.`
            : 'N = 0: el auto apenas toca la pista. Un poco más rápido y se despegaría.';
        return {
          enunciado: `Un auto de ${m} kg pasa a ${vv} m/s por ${arriba ? 'lo alto de una loma' : 'lo más bajo de una hondonada'} de radio ${rr} m. Con g = 10 m/s², ¿cuánto vale la normal?`,
          pasos: [
            { tipo: 'pide', texto: ['Piden la normal ', N, `: cuánto empuja la pista al auto en ${arriba ? 'lo alto de la loma' : 'lo más bajo de la hondonada'}.`] },
            { tipo: 'datos', texto: [`m = ${m} kg, v = ${vv} m/s y r = ${rr} m. Su peso es `, P, ` = ${f(m * G, 0)} N.`] },
            { tipo: 'regla', texto: `En un giro, las fuerzas juntas apuntan al centro y valen m v²/r. Aquí el centro está ${arriba ? 'abajo' : 'arriba'}.`,
              ecuacion: arriba ? [P, ' − ', N, ' = m ', v2r] : [N, ' − ', P, ' = m ', v2r] },
            { tipo: 'cuentas', texto: ['Primero la aceleración hacia el centro, ', ac, '; después despejo ', N, '.'],
              ecuacion: [ac, ' = ', { sup: [`${vv}`, '2'] }, ` / ${rr} = ${f(acv, 3)} m/s²   →   `, N, ` = ${m} · (10 ${arriba ? '−' : '+'} ${f(acv, 3)}) = ${f(Nv, 1)} N`] },
            { tipo: 'sentido', texto: sentido },
          ],
          respuesta: [N, ` = ${f(Nv, 1)} N`],
        };
      },
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
  // Cambia: la aceleración del ascensor · Permanece: el bloque de 60 kg y su peso · Progresa: la lectura de la
  // balanza, N · Se reserva: el ascensor a velocidad constante, que marca igual que en reposo ·
  // Debe verse: la balanza mide N, y N depende de a, no de v.
  const M6 = 60, KF6 = 0.12, KA6 = 10;
  // Animación: la velocidad del ascensor es v = V06 + a (t − 1), positiva hacia arriba (con a > 1 baja, se detiene y
  // sube). La cámara viaja con el ascensor: las marcas de la pared (una por metro) pasan con y = V06 t + ½ a (t² − 2t).
  const V06 = 1;
  const viaje = (av, tt) => ({ v: V06 + av * (tt - 1), y: V06 * tt + av * (tt * tt - 2 * tt) / 2 });
  function pared(y) {
    const out = [];
    for (let k = Math.ceil(y - 1); k <= y + 3.1; k++) out.push({ de: [-1.55, k - y], a: [-1.25, k - y], grosor: 'fino' });
    return out;
  }
  function ascensor(av, o = {}) {
    const Nv = M6 * (G + av), vj = o.t === undefined ? null : viaje(av, o.t);
    if (vj) {
      const base = ascensor(av, Object.assign({}, o, { t: undefined }));
      return Object.assign(base, {
        alt: `Bloque de 60 kg sobre una balanza en un ascensor con a = ${f(av, 0)} m/s² y v = ${f(vj.v, 1)} m/s (positivas hacia arriba): la balanza marca ${f(Nv, 0)} N.`,
        segmentos: pared(vj.y),
        flechas: base.flechas.concat(Math.abs(vj.v) > 0.05 ? [{ de: [-1.8, 1.5], d: [0, vj.v], escala: 8, rotulo: 'v', lado: -1 }] : []),
      });
    }
    return {
      vista: { x0: -2, x1: 2, y0: -1.1, y1: 3.2 }, escalaF: KF6,
      alt: o.alt || `Bloque de 60 kg sobre una balanza en un ascensor con aceleración ${f(av, 0)} m/s² (positiva hacia arriba): la balanza marca ${f(Nv, 0)} N.`,
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
    // Lee (fase 2): contexto y vocabulario. No dice qué marca la balanza con el ascensor a velocidad constante.
    lee: {
      tarjetas: [
        { titulo: 'Lo que mide la balanza', texto: ['Una balanza de baño no mide tu masa: mide cuánto la aprietas. Ella te empuja hacia arriba con esa misma fuerza, la normal ', N, '. Eso es lo que marca.'] },
        { titulo: 'Velocidad y aceleración', texto: 'En un ascensor conviene separar dos cosas: hacia dónde viaja, que es su velocidad, y si esa velocidad crece o baja, que es su aceleración. Aquí, hacia arriba es positivo.' },
        { titulo: 'Qué mirar', texto: 'En el juego, elige la aceleración del ascensor y mira la lectura de la balanza. Las rayitas de la pared muestran si sube o baja, y la flecha v, qué tan rápido.' },
      ],
    },
    juega: {
      consigna: 'Bloque de 60 kg sobre una balanza en un ascensor, en cámara lenta. Elige su aceleración (positiva, hacia arriba). ¿Cambia la balanza con v?',
      voz: 'Prueba a = 0. ¿Importa si el ascensor sube o baja?',
      controles: [{ id: 'a', etiqueta: 'a', color: 'c-h', min: -4, max: 4, paso: 2, inicio: 2, unidad: 'm/s²', decimales: 0 }, tiempo(2, 0.05, 0.5)],
      dibujo: val => ({ datos: ascensor(val.a, { t: val.t }), estado: {} }),
      lectura: val => [`v = ${f(viaje(val.a, val.t).v, 1)} m/s · la balanza marca `, N, ` = ${f(M6 * (G + val.a), 0)} N`],
      minimo: 3,
      // Arrastra la punta de la flecha roja: arriba, el ascensor acelera hacia arriba; abajo, hacia abajo.
      arrastres: [{ id: 'aceleracion', etiqueta: 'aceleración del ascensor', color: 'c-h',
        donde: val => { const g = LZ(ascensor(val.a)); return { x: g.X(1.6), y: g.Y(1.5) - val.a * KA6 }; },
        mover: (pt, val) => ({ a: (LZ(ascensor(val.a)).Y(1.5) - pt.y) / KA6 }) }],
    },
    predice: {
      pregunta: 'El ascensor sube a velocidad constante de 3 m/s. ¿Qué marca la balanza del bloque de 60 kg?',
      opciones: [
        { id: 'c', texto: '600 N, como en reposo', correcta: true },
        { id: 'mas', texto: 'Más de 600 N: está subiendo', error: 'D1', siFuera: 'Marca más mientras el ascensor acelera hacia arriba. Con velocidad constante, a = 0.' },
        { id: 'menos', texto: 'Menos de 600 N', error: 'AS-SIGNO', siFuera: 'Marca menos si acelera hacia abajo. Aquí la velocidad no cambia.' },
      ],
      dibujo: { datos: Object.assign(ascensor(0, { pN: 9 }), { alt: 'Bloque de 60 kg en un ascensor que sube a velocidad constante; la lectura de la balanza no se muestra.' }), estado: {} },
      revelar: { datos: ascensor(0), estado: {} },
      coincide: 'Coincide: un ascensor a velocidad constante es un marco inercial; todo pasa como en reposo.',
    },
    mira: {
      datos: ascensor(2, { pP: 1, pA: 2, pN: 3 }),
      pasos: [
        { estado: { paso: 1 }, texto: 'Sobre el bloque actúan su peso y la balanza, que empuja hacia arriba.', ecuacion: [P, ' = 600 N'] },
        { estado: { paso: 2 }, texto: 'El ascensor acelera hacia arriba: el bloque acelera con él.', ecuacion: [a, ' = +2 m/s²'] },
        { estado: { paso: 3 }, texto: 'La balanza empuja más que el peso para darle esa aceleración.', ecuacion: [N, ' − 600 = 60 · 2   →   ', N, ' = 720 N'] },
        { estado: { paso: 3 }, texto: 'Cable cortado: a = −10 y la balanza marca 0. Eso es ingravidez.', ecuacion: [N, ' = 60 · (10 − 10) = 0'] },
      ],
    },
    regla: {
      texto: 'Las leyes de Newton valen igual en todo marco que se mueve con velocidad constante. Si el ascensor acelera, la balanza marca un peso aparente, distinto del peso.',
      ecuacion: [{ llave: [N], nota: 'lo que marca', color: 'c-i' }, ' − m g = m ', a, '   ·   ', N, ' = m (g + ', a, ')'],
      condicion: 'a positiva hacia arriba, medida desde el piso del edificio (marco inercial). La balanza mide N, no el peso.',
    },
    // Así se resuelve: la balanza en un ascensor que acelera, calculado igual que «Ahora tú» (N = m (g + a), con el
    // signo de a según sm % 4). Sin figura, como «Ahora tú».
    resuelve: {
      generar(sm) {
        const r = azar(sm + 900), m = r.de([50, 60, 70, 80]), am = r.de([1, 2, 3, 4]);
        const CASOS = [['sube y va cada vez más rápido', 1], ['sube y está frenando', -1], ['baja y va cada vez más rápido', -1], ['baja y está frenando', 1]];
        const [txt, sg] = CASOS[sm % 4], av = sg * am, Nv = m * (G + av);
        const porque = ['sube y su velocidad crece', 'sube, pero su velocidad baja', 'baja y su velocidad crece', 'baja, pero su velocidad se achica'][sm % 4];
        return {
          enunciado: `Una persona de ${m} kg está sobre una balanza en un ascensor que ${txt}, con aceleración de ${am} m/s². Con g = 10 m/s², ¿qué marca la balanza?`,
          pasos: [
            { tipo: 'pide', texto: ['Piden lo que marca la balanza: la normal ', N, ' con que empuja a la persona hacia arriba.'] },
            { tipo: 'datos', texto: [`m = ${m} kg y la aceleración mide ${am} m/s². El ascensor ${porque}: `, a, ` apunta hacia ${sg > 0 ? 'arriba' : 'abajo'}.`] },
            { tipo: 'regla', texto: 'La balanza empuja hacia arriba y el peso jala hacia abajo; lo que sobra le da a la persona la aceleración del ascensor.',
              ecuacion: [N, ' − m g = m ', a, '   ·   ', N, ' = m (g + ', a, ')'] },
            { tipo: 'cuentas', texto: ['Con hacia arriba positivo, ', a, ` = ${sg > 0 ? '+' : '−'}${am} m/s².`],
              ecuacion: [N, ` = ${m} · (10 ${sg > 0 ? '+' : '−'} ${am}) = ${f(Nv, 0)} N`] },
            { tipo: 'sentido', texto: `Su peso es ${m * G} N. La balanza marca ${sg > 0 ? 'más' : 'menos'}, porque la aceleración apunta hacia ${sg > 0 ? 'arriba' : 'abajo'}, no por el sentido del viaje.` },
          ],
          respuesta: [N, ` = ${f(Nv, 0)} N`],
        };
      },
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

  // Lo que miden las mesas del laboratorio (las mismas cuentas de bloque, ascensor y loma); lo usan la lectura y los retos.
  const BLOQUE_LIBRE = [
    { id: 'F', etiqueta: 'F', color: 'c-o', min: 0, max: 35, paso: 5, inicio: 25, unidad: 'N', decimales: 0 },
    { id: 'm', etiqueta: 'm', min: 5, max: 8, paso: 1, inicio: 5, unidad: 'kg', decimales: 0 },
    { id: 'mu', etiqueta: 'μk', opciones: [{ valor: 0, texto: '0' }, { valor: 0.2, texto: '0,2' }, { valor: 0.4, texto: '0,4' }], inicio: 0.2 },
    tiempo(1.5, 0.05, 0.4),
  ];
  const rocBloque = val => val.mu * val.m * G;
  const netaBloque = val => Math.max(0, val.F - rocBloque(val));
  const aBloque = val => netaBloque(val) / val.m;
  // La mayor aceleración que dan los controles: se busca en su grilla (fuerza máxima, masa mínima, sin roce).
  const A_MAX_BLOQUE = Math.max(...[0, 0.2, 0.4].flatMap(mu => [5, 6, 7, 8].map(m => aBloque({ F: BLOQUE_LIBRE[0].max, m, mu }))));
  const balanzaDe = val => M6 * (G + val.a);
  const normalLoma = val => Math.max(0, M5 * (G - val.v * val.v / R5));

  return {
    unidad: 'fisica.dinamica',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/fis-lienzo.js'],
    // Glosario del tema (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso. Masa viene de
    // magnitudes y vectores; fuerza, peso, normal y rozamiento, de estática; aceleración centrípeta, del movimiento circular.
    glosario: [
      { termino: 'segunda ley de Newton',
        def: 'La aceleración de un cuerpo es la fuerza neta sobre él dividida entre su masa.',
        ejemplo: '6 N sobre 3 kg: a = 2 m/s².', ver: ['fuerza neta', 'masa'] },
      { termino: 'fuerza neta', simbolo: 'ΣF', medida: 'N', formas: ['fuerza neta', 'fuerzas netas'],
        def: 'Suma, con dirección y signo, de todas las fuerzas que actúan sobre un cuerpo.',
        ejemplo: '30 N hacia adelante y 20 N de rozamiento: ΣF = 10 N.', ver: ['segunda ley de Newton', 'resultante'] },
      { termino: 'fuerza centrípeta', medida: 'N', def: 'Nombre de la suma de fuerzas que apunta al centro de un giro: vale m v² / r.',
        ejemplo: 'Auto de 1000 kg a 5 m/s en una loma de 10 m: 2500 N.', ver: ['aceleración centrípeta'] },
      { termino: 'sistema inercial', formas: ['sistema inercial', 'sistemas inerciales', 'marco inercial', 'marcos inerciales'],
        def: 'Punto de vista que no acelera, como el piso; desde él valen las leyes de Newton.',
        ejemplo: 'Un ascensor que sube a velocidad constante también lo es.', ver: ['segunda ley de Newton'] },
      { termino: 'peso aparente', medida: 'N', def: 'Lo que marca una balanza: la fuerza con que te sostiene, que cambia si aceleras.',
        ejemplo: '60 kg en un ascensor que acelera 2 m/s² hacia arriba: 720 N.', ver: ['peso', 'ingravidez'] },
      { termino: 'plano inclinado', formas: ['plano inclinado', 'planos inclinados'],
        def: 'Superficie plana que forma un ángulo con la horizontal; sin roce, se baja con a = g sen θ.',
        ejemplo: 'A 30°, sin roce: a = 10 · 0,5 = 5 m/s².', ver: ['peso'] },
      { termino: 'polea', def: 'Rueda por la que pasa una cuerda; cambia la dirección del jalón y, si es móvil, lo reparte.',
        ejemplo: 'Polea móvil con 80 N colgados: la mano jala 40 N.', ver: ['tensión'] },
      { termino: 'ingravidez', def: 'Estado en que nada te sostiene y caes con g: la balanza marca 0, aunque la masa no cambie.',
        ejemplo: 'Ascensor con el cable cortado: a = −10 m/s² y N = 0.', ver: ['peso aparente', 'caída libre'] },
    ],
    // Laboratorio: juego libre, sin preguntas. El bloque libre junta fuerza, masa y rozamiento (en la idea, la masa
    // está fija); el ascensor llega hasta a = −10 m/s², el cable cortado; la loma es el juego de la idea 5.
    laboratorio: [
      {
        id: 'bloque-libre', titulo: 'Fuerza, masa y rozamiento', pieza: 'fis-lienzo',
        consigna: 'El bloque ya desliza, en cámara lenta. Cambia la fuerza, la masa y μk, y mira cuánto sobra para acelerar.',
        controles: BLOQUE_LIBRE,
        dibujo: val => ({ datos: bloqueT(val.F, val.mu, val.m, val.t), estado: {} }),
        lectura: val => lecturaRoce(val.F, val.mu, val.m, val.t),
        invitaciones: [
          { texto: 'Haz que el bloque deslice sin acelerar, aunque lo jales.',
            logrado: val => val.F > 0 && Math.abs(val.F - rocBloque(val)) < 1e-9,
            bien: 'Jalas y no acelera: el rozamiento lo cancela todo. Sigue a velocidad constante.' },
          { texto: 'Consigue una aceleración de justo 2 m/s².',
            logrado: val => Math.abs(aBloque(val) - 2) < 1e-9,
            bien: 'Lo que sobra, entre la masa, da 2. ¿Hay otra manera?' },
          { texto: 'Busca la mayor aceleración que permiten los controles.',
            logrado: val => aBloque(val) >= A_MAX_BLOQUE - 1e-9,
            bien: 'Fuerza máxima, masa mínima y nada de roce: sobra lo más posible.' },
          { texto: 'Guarda dos casos con la misma fuerza neta y distinta aceleración.',
            logrado: (val, guardados) => netaBloque(val) > 0 && guardados.some(x => Math.abs(netaBloque(x) - netaBloque(val)) < 1e-9 && Math.abs(aBloque(x) - aBloque(val)) > 1e-9)
              && guardados.some(x => x.F === val.F && x.m === val.m && x.mu === val.mu),
            bien: 'La misma fuerza neta acelera menos a la masa mayor.' },
          { texto: 'Haz que el bloque frene y páusalo justo cuando se detiene.',
            logrado: val => { const fk = rocBloque(val); return val.F < fk && Math.abs(val.t - V03 * val.m / (fk - val.F)) <= 0.025 + 1e-9; },
            bien: 'Frenó porque el rozamiento le ganaba a F. Quieto, el roce estático iguala a F.',
            pista: 'Usa F menor que el rozamiento y pausa cuando v llegue a 0; afina con − y +.' },
        ],
        arrastres: [{ id: 'jalon', etiqueta: 'cola de la fuerza F', color: 'c-o',
          donde: val => { const g = LZ(bloqueT(val.F, val.mu, val.m, val.t)), izq = bloqueCam(val.F, val.mu, val.m, val.t).xc - 0.45; return { x: g.X(izq - val.F * KF3 / S3T), y: g.Y(0.4) }; },
          mover: (pt, val) => { const g = LZ(bloqueT(val.F, val.mu, val.m, val.t)), izq = bloqueCam(val.F, val.mu, val.m, val.t).xc - 0.45; return { F: (izq - g.Xi(pt.x)) * S3T / KF3 }; } }],
      },
      Object.assign({}, ascensorIdea.juega, {
        id: 'ascensor-libre', titulo: 'Ascensor hasta la caída libre', pieza: 'fis-lienzo',
        consigna: 'En cámara lenta. Lleva la aceleración del ascensor de +6 a −10 m/s². ¿Qué marca la balanza si el cable se corta?',
        controles: [{ id: 'a', etiqueta: 'a', color: 'c-h', min: -10, max: 6, paso: 2, inicio: 2, unidad: 'm/s²', decimales: 0 }, tiempo(2, 0.05, 0.5)],
        lectura: val => [a, ` = ${f(val.a, 0)} m/s², v = ${f(viaje(val.a, val.t).v, 1)} m/s: balanza `, N, ` = ${f(balanzaDe(val), 0)} N`],
        minimo: undefined, voz: undefined,
        invitaciones: [
          { texto: 'Haz que la balanza marque justo el peso del bloque.',
            logrado: val => Math.abs(balanzaDe(val) - M6 * G) < 1e-9,
            bien: 'Con a = 0 marca el peso, suba o baje. ¿Importa la velocidad?' },
          { texto: 'Haz que la balanza marque más de 900 N.',
            logrado: val => balanzaDe(val) > 900,
            bien: 'Acelerar hacia arriba aprieta la balanza: el peso aparente crece.' },
          { texto: 'Consigue que la balanza marque 0.',
            logrado: val => Math.abs(balanzaDe(val)) < 1e-9,
            bien: 'Bloque y ascensor caen juntos: eso es ingravidez, con la misma masa.' },
          { texto: 'Guarda dos casos: uno que marque más que el peso y otro menos.',
            logrado: (val, guardados) => guardados.some(x => (balanzaDe(x) - M6 * G) * (balanzaDe(val) - M6 * G) < 0)
              && guardados.some(x => x.a === val.a),
            bien: 'El signo de a decide la balanza, no hacia dónde va el ascensor.' },
        ],
      }),
      Object.assign({ id: 'loma', titulo: 'El auto en la loma', pieza: 'fis-lienzo',
        invitaciones: [
          { texto: 'Busca la rapidez con la que el auto casi se despega.',
            logrado: val => normalLoma(val) < 1e-9,
            bien: 'Con N = 0, el peso solo da la fuerza centrípeta. ¿Y más rápido?' },
          { texto: 'Haz que la normal valga lo mismo que el peso.',
            logrado: val => Math.abs(normalLoma(val) - M5 * G) < 1e-9,
            bien: 'Sin rapidez no hay giro: la normal sostiene todo el peso.' },
          { texto: 'Guarda dos casos con distinta rapidez y compara sus normales.',
            logrado: (val, guardados) => guardados.some(x => x.v !== val.v && Math.abs(normalLoma(x) - normalLoma(val)) > 1e-9)
              && guardados.some(x => x.v === val.v),
            bien: 'Más rapidez, menos normal: hace falta más fuerza neta hacia el centro.' },
        ] }, circular.juega),
    ],
    historia: {
      texto: 'En el siglo XVII, explicar el movimiento obligó a conectar choques, caídas y órbitas. Las conversaciones entre Halley, Hooke, Wren y Newton sobre órbitas forman parte del origen de los Principia, de 1687. Newton escribió allí sus leyes del movimiento, aunque no con la fórmula escolar F = ma: esa forma llegó después.',
      pregunta: '¿Qué dice una fuerza: hacia dónde vas o cómo cambias?',
      fuente: { titulo: 'The Newton Project — introducción', url: 'https://newtonproject.ox.ac.uk/texts/introduction' },
    },
    ideas: [segunda, masaPeso, roceMov, planoIdea, circular, ascensorIdea],
  };
});
