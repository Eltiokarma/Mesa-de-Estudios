/*
 * Teoría de «Ondas mecánicas y sonido» (fisica.ondas-mecanicas). Molde de docs/teoria.md; forma copiada de
 * contenido/teoria/fisica/movimiento-rectilineo.js.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 10), precisiones de física del expediente y
 * docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md (códigos ON1–ON10).
 * Colores (regla 4): y desplazamiento turquesa (c-i), v rapidez de la onda naranja (c-o), λ longitud de onda
 * verde (c-d), f frecuencia y t tiempo rojo (c-h). A, k, ω, T (tensión), μ, I, P y β van en tinta.
 * Estado: completa (14 nov 2026): cinco ideas que cubren los seis temas del catálogo.
 * Códigos nuevos (hipótesis, sin fuente empírica): OND-AVANZA, OND-QUIETO, OND-OMEGA, OND-INV, OND-AMPLITUD,
 * OND-LAMBDA, OND-SIN-RAIZ, OND-NODOS, SO-SUMA, SO-IGUAL, SO-DOBLE, SO-LINEAL, SO-INV.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver que una onda lleva forma y energía, no materia, y que el medio decide su rapidez.
 *   Persona y condiciones: postulante de 5.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: lee v, λ y f de una función de onda; halla v en una cuerda, un armónico y un nivel en dB.
 *   Orden de atención: 1.º la gráfica de la cuerda · 2.º la lectura en vivo · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: si la cresta avanza, ¿por qué la cuerda no se va con ella?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const y = { v: 'c-i', t: 'y' }, v = { v: 'c-o', t: 'v' }, lam = { v: 'c-d', t: 'λ' }, fr = { v: 'c-h', t: 'f' }, t = { v: 'c-h', t: 't' };
  const PI = Math.PI;
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
  // Gesto directo (docs/teoria.md §4b): la manija vive en las coordenadas de ejes.geometria, con los mismos datos que
  // dibuja el juego; su inversa (Xi, Yi) da los valores y el lector los ajusta al paso y al rango de cada control.
  const EJ = () => Kit.piezas.ejes;
  const enEjes = (datos, xx, yy) => { const g = EJ().geometria(datos); return { x: g.X(xx), y: g.Y(yy) }; };
  const muestras = (fn, x0, x1, n = 81) => Array.from({ length: n }, (_, i) => { const u = x0 + (x1 - x0) * i / (n - 1); return [u, fn(u)]; });

  // ---------- Idea 1: la cresta avanza, la cuerda no ----------
  // Cambia: el instante · Permanece: la cuerda, su λ = 2 m y el punto P en x = 1,5 m ·
  // Progresa: la cresta, que avanza 2 m cada segundo · Se reserva: el camino completo de P en un período ·
  // Debe verse: P solo sube y baja; lo que viaja es la forma.
  const A1 = 2, L1 = 2, V1 = 2, XP = 1.5;
  const onda = (tt, A = A1, L = L1, V = V1) => xx => A * Math.sin(2 * PI * (xx - V * tt) / L);
  const crestaEn = tt => { let c = L1 / 4 + V1 * tt; while (c > 4) c -= L1; return c; };
  const ejeYx = (extra = {}) => Object.assign({
    x: { min: 0, max: 4, paso: 0.5, cada: 2, nombre: 'x', unidad: 'm', decimales: 1 },
    y: { min: -3, max: 3, paso: 1, nombre: 'y', unidad: 'cm', decimales: 0, color: 'i' },
  }, extra);
  const cuerda = tt => ejeYx({
    curvas: [{ puntos: muestras(onda(tt), 0, 4), color: 'i' }],
    puntos: [{ x: XP, y: onda(tt)(XP), color: 'i', rotulo: 'P', guias: true }, { x: crestaEn(tt), y: A1, color: 'o', rotulo: 'cresta' }],
  });
  const transversal = {
    id: 'la-cresta-avanza',
    titulo: 'La forma viaja, la cuerda no',
    temas: ['Ondas transversales y longitudinales'],
    pieza: 'ejes',
    juega: {
      // Animación (15 nov): el reloj corre solo, en cámara lenta (un período de 1 s dura 4 s en pantalla). Cada cuadro es
      // la misma función de onda y = A sen(2π(x − vt)/λ); al dar la vuelta (t = 1 s = T) la forma es la misma.
      consigna: 'Una onda recorre la cuerda hacia la derecha, en cámara lenta. Sigue a la vez la cresta y el punto P: ¿cuánto avanza cada uno?',
      voz: 'Compara cuánto avanza la cresta y cuánto avanza P.',
      controles: [{ id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 1, paso: 0.125, inicio: 0, unidad: 's', decimales: 3,
        auto: { velocidad: 0.25, modo: 'repite' } }],
      dibujo: val => ({ datos: cuerda(val.t), estado: {} }),
      lectura: val => ['Cresta: x = ', f(crestaEn(val.t), 2), ' m · P: ', y, ` = ${f(onda(val.t)(XP), 1)} cm`],
      minimo: 3,
      // Arrastra la cresta hacia la derecha: el reloj avanza lo que ella tarda en llegar ahí (2 m cada segundo).
      arrastres: [
        { id: 'cresta', etiqueta: 'cresta de la onda', color: 'c-h',
          donde: val => enEjes(cuerda(val.t), crestaEn(val.t), A1),
          mover: (pt, val) => ({ t: (EJ().geometria(cuerda(val.t)).Xi(pt.x) - L1 / 4) / V1 }) },
      ],
    },
    predice: {
      pregunta: 'Durante un período completo la cresta avanza 2 m hacia la derecha. En ese tiempo, ¿qué camino hace el punto P de la cuerda?',
      opciones: [
        { id: 'c', texto: 'Sube y baja en su lugar', correcta: true },
        { id: 'avanza', texto: 'Avanza 2 m con la cresta', error: 'OND-AVANZA', siFuera: 'La cresta sí avanza 2 m. Pero cada cresta está hecha de puntos distintos de la cuerda.' },
        { id: 'arco', texto: 'Hace un arco: sube y avanza un poco', error: 'ON5', siFuera: 'En una cuerda ideal no hay avance: si lo hubiera, la cuerda se iría acumulando.' },
        { id: 'quieto', texto: 'Se queda quieto hasta que llega la cresta', error: 'OND-QUIETO', siFuera: 'Antes de la cresta, P ya se movía: la onda tiene subidas y bajadas en todas partes.' },
      ],
      dibujo: { datos: cuerda(0), estado: {} },
      revelar: { datos: ejeYx({ curvas: [{ puntos: muestras(onda(0), 0, 4), color: 'i' }, { puntos: muestras(onda(0.25), 0, 4), color: 'i', discontinua: true }],
        puntos: [0, 0.25, 0.5, 0.75].map((tt, k) => ({ x: XP, y: onda(tt)(XP), color: 'i', rotulo: k === 0 ? 'P: arriba y abajo' : undefined })) }), estado: {} },
      coincide: 'Coincide: P se mueve solo en vertical entre +2 y −2 cm. Lo que avanza es la forma.',
    },
    mira: {
      datos: ejeYx({
        curvas: [{ puntos: muestras(onda(0), 0, 4), color: 'i', hasta: 1 }, { puntos: muestras(onda(0.25), 0, 4), color: 'i', desde: 2 }],
        puntos: [{ x: crestaEn(0), y: A1, color: 'o', rotulo: 'cresta', hasta: 1 }, { x: crestaEn(0.25), y: A1, color: 'o', rotulo: 'cresta, 0,5 m después', desde: 2 },
          { x: XP, y: onda(0)(XP), color: 'i', rotulo: 'P', hasta: 1 }, { x: XP, y: onda(0.25)(XP), color: 'i', rotulo: 'P', desde: 2 }],
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'En t = 0, P está abajo y la cresta en x = 0,5 m.', ecuacion: [t, ' = 0'] },
        { estado: { corte: 2 }, texto: 'Un cuarto de segundo después la cresta avanzó 0,5 m; P solo subió.', ecuacion: [v, ' = ', { frac: ['0,5 m', '0,25 s'] }, ' = 2 m/s'] },
        { estado: { corte: 3 }, texto: 'En una cuerda, cada punto oscila perpendicular al avance: onda transversal.', ecuacion: ['oscila ⊥ avance'] },
        { estado: { corte: 3 }, texto: 'En el sonido, el aire va y viene en la dirección del avance: longitudinal.', ecuacion: ['oscila ∥ avance'] },
      ],
    },
    regla: {
      texto: 'Una onda transporta energía y forma, no materia: cada punto del medio oscila en su lugar. Si oscila perpendicular al avance es transversal; si a lo largo, longitudinal.',
      ecuacion: ['transversal: cuerda, ola', '   ·   ', 'longitudinal: sonido, resorte comprimido'],
      condicion: 'onda mecánica en un medio elástico: necesita materia que oscile.',
    },
    ahoraTu: {
      generar(s) {
        const CASOS = [
          ['Una cuerda de guitarra pulsada: sus puntos suben y bajan mientras el pulso corre a lo largo.', 'transversal'],
          ['El sonido de una bocina: el aire se comprime y se estira en la dirección en que avanza.', 'longitudinal'],
          ['Un resorte largo empujado por un extremo: las espiras se juntan y se separan a lo largo.', 'longitudinal'],
          ['Una ola en el estadio: cada persona se para y se sienta en su sitio.', 'transversal'],
          ['Una soga agitada de arriba abajo desde un extremo.', 'transversal'],
          ['El golpe de un martillo en un riel, que se oye por el otro extremo.', 'longitudinal'],
          ['Un pulso en una cuerda tensa, sacudida hacia un lado.', 'transversal'],
        ];
        const [txt, tipo] = CASOS[s % CASOS.length], otro = tipo === 'transversal' ? 'longitudinal' : 'transversal';
        return {
          pregunta: `${txt} ¿Qué tipo de onda es?`,
          opciones: [
            { id: 'c', texto: tipo, correcta: true },
            { id: 'otro', texto: otro, error: 'OND-AVANZA', siFuera: otro === 'transversal' ? 'Sería transversal si el medio oscilara perpendicular al avance.' : 'Sería longitudinal si el medio oscilara a lo largo del avance.' },
            { id: 'materia', texto: 'No es onda: viaja la materia', error: 'ON6', siFuera: 'Algo viaja, cierto: la perturbación. El medio se queda en su lugar.' },
          ],
          solucion: { texto: tipo === 'transversal' ? 'El medio oscila perpendicular al avance.' : 'El medio oscila a lo largo del avance.', ecuacion: [tipo] },
        };
      },
    },
  };

  // ---------- Idea 2: la función de onda y v = λf ----------
  // Cambia: la frecuencia con que se agita la cuerda · Permanece: la cuerda, que decide v = 2 m/s ·
  // Progresa: λ, que se acorta · Se reserva: leer v, λ y f desde la ecuación y = A sen(kx − ωt) ·
  // Debe verse: en un mismo medio, más frecuencia da crestas más juntas, no una onda más rápida.
  // Animación (15 nov): la onda corre sola en cámara lenta (4 veces), y = A sen(2π(x/λ − f t)). Los puntos verdes van
  // sobre dos crestas seguidas (están a λ); P, en x = 1,5 m, solo sube y baja. t llega a 2 s: con f múltiplo de 0,5 Hz
  // la onda vuelve a su forma inicial y la vuelta no salta.
  // Crestas en x = λ(1/4 + f t − k): la primera dentro de la cuerda es la de k = ⌊1/4 + f t⌋.
  const kPrimera = (fq, tt) => Math.floor(0.25 + fq * tt + 1e-9);
  const primeraCresta = (vv, fq, tt) => (vv / fq) * (0.25 + fq * tt - kPrimera(fq, tt));
  // Arrastrar la primera cresta (con el reloj quieto) fija f: la misma cresta pasa por el dedo. Despeja f de
  // px = v t + (v/f)(1/4 − k); si el dedo sale de esa rama, f queda en el extremo del rango.
  const fDeCresta = (px, vv, fq, tt, fmin, fmax) => {
    const k = kPrimera(fq, tt), q = vv * (0.25 - k) / (px - vv * tt);
    return Number.isFinite(q) && q > 0 ? Math.min(fmax, Math.max(fmin, q)) : (k === 0 ? fmax : fmin);
  };
  const ondaF = (fq, tt) => xx => A1 * Math.sin(2 * PI * (xx * fq / V1 - fq * tt));
  const agita = (fq, tt = 0) => {
    const L = V1 / fq, x1 = primeraCresta(V1, fq, tt), cr = [x1, x1 + L].filter(c => c <= 4 + 1e-9);
    return ejeYx({ curvas: [{ puntos: muestras(ondaF(fq, tt), 0, 4, 161), color: 'i' }],
      puntos: [...cr.map((c, k) => ({ x: c, y: A1, color: 'd', rotulo: k === cr.length - 1 ? `λ = ${f(L, 2)} m` : '' })),
        { x: XP, y: ondaF(fq, tt)(XP), color: 'i', rotulo: 'P', guias: true }] });
  };
  const funcion = {
    id: 'funcion-de-onda',
    titulo: 'v = λf: el medio manda',
    temas: ['Función de onda'],
    pieza: 'ejes',
    juega: {
      consigna: 'Esta cuerda lleva la onda a 2 m/s, en cámara lenta. Cambia la frecuencia y mira cuánto se separan las crestas.',
      voz: 'Mira qué cambia en la cuerda cuando agitas más rápido.',
      controles: [
        { id: 'f', etiqueta: 'f', color: 'c-h', min: 0.5, max: 4, paso: 0.5, inicio: 1, unidad: 'Hz', decimales: 1 },
        { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 2, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 0.25, modo: 'repite' } },
      ],
      dibujo: val => ({ datos: agita(val.f, val.t), estado: {} }),
      lectura: val => [lam, ` = `, v, `/`, fr, ` = 2/${f(val.f, 1)} = ${f(V1 / val.f, 2)} m · P: `, y, ` = ${f(ondaF(val.f, val.t)(XP), 1)} cm`],
      minimo: 3,
      // Arrastra la primera cresta: detiene el reloj y, como v = 2 m/s no cambia, su lugar fija λ y con él f = v/λ.
      arrastres: [
        { id: 'primera-cresta', etiqueta: 'primera cresta', color: 'c-h',
          donde: val => enEjes(agita(val.f, val.t), primeraCresta(V1, val.f, val.t), A1),
          mover: (pt, val) => ({ t: val.t, f: fDeCresta(EJ().geometria(agita(val.f, val.t)).Xi(pt.x), V1, val.f, val.t, 0.5, 4) }) },
      ],
    },
    predice: {
      pregunta: ['Una onda en una cuerda sigue la ecuación ', y, ' = 3 sen(2π x − 4π ', t, '), con x en m y ', t, ' en s. ¿Con qué rapidez avanza?'],
      opciones: [
        { id: 'c', texto: '2 m/s', correcta: true },
        { id: 'omega', texto: '4π m/s ≈ 12,6 m/s', error: 'OND-OMEGA', siFuera: '4π es ω, cuánto gira la fase por segundo. La rapidez es ω entre k.' },
        { id: 'inv', texto: '0,5 m/s', error: 'OND-INV', siFuera: 'Ese cociente es k entre ω, al revés.' },
        { id: 'amp', texto: '3 m/s', error: 'OND-AMPLITUD', siFuera: '3 es la amplitud: cuánto sube la cuerda, no qué tan rápido avanza.' },
      ],
      dibujo: { datos: ejeYx({ curvas: [{ puntos: muestras(xx => 3 * Math.sin(2 * PI * xx), 0, 4, 161), color: 'i' }] }), estado: {} },
      revelar: { datos: ejeYx({ curvas: [{ puntos: muestras(xx => 3 * Math.sin(2 * PI * xx), 0, 4, 161), color: 'i' }], puntos: [{ x: 0.25, y: 3, color: 'd' }, { x: 1.25, y: 3, color: 'd', rotulo: 'λ = 1 m; f = 2 Hz' }] }), estado: {} },
      coincide: 'Coincide: k = 2π da λ = 1 m; ω = 4π da f = 2 Hz; v = λf = 2 m/s.',
    },
    mira: {
      datos: ejeYx({ curvas: [{ puntos: muestras(xx => 3 * Math.sin(2 * PI * xx), 0, 4, 161), color: 'i' }], puntos: [{ x: 0.25, y: 3, color: 'd', desde: 1 }, { x: 1.25, y: 3, color: 'd', rotulo: 'λ = 1 m', desde: 1 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'k es cuánto avanza la fase por metro: k = 2π/λ.', ecuacion: ['k = 2π   →   ', lam, ' = 1 m'] },
        { estado: { corte: 2 }, texto: 'ω es cuánto avanza la fase por segundo: ω = 2πf.', ecuacion: ['ω = 4π   →   ', fr, ' = 2 Hz'] },
        { estado: { corte: 2 }, texto: 'Cada segundo pasan 2 crestas separadas 1 m.', ecuacion: [v, ' = ', lam, fr, ' = ', { frac: ['ω', 'k'] }, ' = 2 m/s'] },
        { estado: { corte: 2 }, texto: 'El signo menos dice que avanza hacia +x.', ecuacion: [y, ' = A sen(kx − ω', t, ')'] },
      ],
    },
    regla: {
      texto: 'Función de onda armónica: y = A sen(kx − ωt). Su rapidez es v = λf = ω/k, y la decide el medio: la fuente solo fija la frecuencia.',
      ecuacion: [y, ' = A sen(kx − ω', t, ')', '   ·   ', 'k = ', { llave: [{ frac: ['2π', lam] }], nota: 'fase por metro', color: 'c-d' }, '   ·   ', 'ω = ', { llave: ['2π', fr], nota: 'fase por segundo', color: 'c-h' }, '   ·   ', v, ' = ', lam, fr],
      condicion: 'medio no dispersivo y amplitud pequeña; con (kx + ωt) la onda va hacia −x.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), kk = r.de([1, 2, 4, 0.5]), ww = r.de([2, 4, 6, 8, 10]), A = r.de([2, 3, 5]);
        if (s % 2 === 0) {
          const vv = ww / kk;
          return {
            pregunta: ['Una onda sigue ', y, ` = ${f(A)} sen(${f(kk)}π x − ${f(ww)}π `, t, '), en metros y segundos. ¿Cuál es su rapidez?'],
            opciones: opciones(vv, [
              { id: 'inv', valor: kk / ww, error: 'OND-INV', siFuera: 'Ese cociente es k/ω; la rapidez es ω/k.' },
              { id: 'omega', valor: ww, error: 'OND-OMEGA', siFuera: 'Eso toma ω sin π ni k; la rapidez es ω/k.' },
              { id: 'amp', valor: A, error: 'OND-AMPLITUD', siFuera: 'Esa es la amplitud.' },
            ], n => `${f(n)} m/s`),
            solucion: { texto: 'La rapidez es ω entre k: los π se cancelan.', ecuacion: [v, ` = ${f(ww)}π / ${f(kk)}π = ${f(vv)} m/s`] },
          };
        }
        const vv = r.de([2, 4, 340, 10]), ff = r.de([2, 5, 10, 20, 50]);
        return {
          pregunta: ['Una onda avanza a ', v, ` = ${f(vv)} m/s con frecuencia `, fr, ` = ${f(ff)} Hz. ¿Cuál es su longitud de onda?`],
          opciones: opciones(vv / ff, [
            { id: 'por', valor: vv * ff, error: 'OND-INV', siFuera: 'Eso multiplica; λ = v / f.' },
            { id: 'inv', valor: ff / vv, error: 'OND-INV', siFuera: 'Ese cociente está al revés.' },
            { id: 'periodo', valor: 1 / ff, error: 'OND-LAMBDA', siFuera: 'Ese es el período en segundos, no un largo.' },
          ], n => `${f(n, 3)} m`),
          solucion: { texto: 'En un período la onda avanza una longitud de onda.', ecuacion: [lam, ` = ${f(vv)} / ${f(ff)} = ${f(vv / ff, 3)} m`] },
        };
      },
    },
  };

  // ---------- Idea 3: la rapidez en una cuerda ----------
  // Cambia: la tensión y la cuerda (delgada o gruesa) · Permanece: la forma de la curva v–T ·
  // Progresa: el punto que sube con la tensión · Se reserva: una cuerda cuatro veces más pesada ·
  // Debe verse: la rapidez crece con la raíz de la tensión y baja con la raíz de la masa por metro.
  const velC = (T, mu) => Math.sqrt(T / mu);
  const ejeVT = (mu, extra = {}) => Object.assign({
    x: { min: 0, max: 100, paso: 20, nombre: 'tensión', unidad: 'N', decimales: 0 },
    y: { min: 0, max: 100, paso: 20, nombre: 'v', unidad: 'm/s', decimales: 0, color: 'o' },
    curvas: [{ puntos: muestras(T => velC(T, mu), 0, 100, 51), color: 'o', rotulo: mu === 0.01 ? 'delgada' : 'gruesa', en: [70, velC(70, mu) + 8] }],
  }, extra);
  // Animación (15 nov): dos pulsos salen juntos de x = 5 m, uno por cada cuerda, con la misma tensión; cada uno avanza
  // x = 5 + v t, con v = √(T/μ). Cámara lenta (4 veces): 1 s de pulso dura 4 s. El punto naranja es la meta de t = 1 s.
  const X0P = 5, ANCHO_P = 4;
  const pulso = x0 => xx => 2 * Math.exp(-(((xx - x0) / ANCHO_P) ** 2));
  const posP = (T, mu, tt) => X0P + velC(T, mu) * tt;
  const NOMBRE3 = mu => (mu === 0.01 ? 'delgada' : 'gruesa');
  const carrera = val => {
    const otro = val.mu === 0.01 ? 0.04 : 0.01, xa = posP(val.T, val.mu, val.t), xb = posP(val.T, otro, val.t);
    return {
      x: { min: 0, max: 100, paso: 20, nombre: 'x', unidad: 'm', decimales: 0 },
      y: { min: -1, max: 3, paso: 1, nombre: 'y', unidad: 'cm', decimales: 0, color: 'i' },
      curvas: [
        { puntos: muestras(pulso(xb), 0, 100, 201), color: 'i', discontinua: true, rotulo: NOMBRE3(otro), en: [xb, -0.55] },
        { puntos: muestras(pulso(xa), 0, 100, 201), color: 'i', rotulo: NOMBRE3(val.mu), en: [xa, 2.5] },
      ],
      puntos: [{ x: posP(val.T, val.mu, 1), y: 0, color: 'o', rotulo: 'en 1 s', abierto: true }],
    };
  };
  const rapidez = {
    id: 'rapidez-cuerda',
    titulo: 'Tensión y masa deciden v',
    temas: ['Rapidez de una onda en una cuerda'],
    pieza: 'ejes',
    juega: {
      consigna: 'Dos pulsos parten juntos, en cámara lenta: uno por la cuerda delgada (10 g/m), otro por la gruesa (40 g/m). Cambia la tensión.',
      voz: 'Mira cuánta tensión hace falta para duplicar la rapidez.',
      controles: [
        { id: 'T', etiqueta: 'tensión', min: 10, max: 90, paso: 10, inicio: 40, unidad: 'N', decimales: 0 },
        { id: 'mu', etiqueta: 'Cuerda', opciones: [{ valor: 0.01, texto: 'delgada' }, { valor: 0.04, texto: 'gruesa' }], inicio: 0.01 },
        { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 1, paso: 0.05, inicio: 0, unidad: 's', decimales: 2, auto: { velocidad: 0.25, modo: 'repite' } },
      ],
      dibujo: val => ({ datos: carrera(val), estado: {} }),
      lectura: val => [v, ` = √(${f(val.T)}/${f(val.mu)}) = ${f(velC(val.T, val.mu), 1)} m/s · x = ${f(posP(val.T, val.mu, val.t), 0)} m`],
      minimo: 3,
      // Arrastra la meta de 1 s de la cuerda elegida: más lejos pide más rapidez, y v = √(T/μ) da la tensión.
      arrastres: [
        { id: 'tension', etiqueta: 'tensión de la cuerda: meta del pulso en 1 s', color: 'c-o',
          donde: val => enEjes(carrera(val), posP(val.T, val.mu, 1), 0),
          mover: (pt, val) => { const vv = Math.max(0, EJ().geometria(carrera(val)).Xi(pt.x) - X0P); return { T: val.mu * vv * vv }; } },
      ],
    },
    predice: {
      pregunta: 'Una cuerda tensa lleva pulsos a 40 m/s. Se cambia por otra cuatro veces más pesada por metro, con la misma tensión. ¿A qué rapidez van los pulsos?',
      opciones: [
        { id: 'c', texto: '20 m/s', correcta: true },
        { id: 'diez', texto: '10 m/s', error: 'OND-SIN-RAIZ', siFuera: 'Dividir entre 4 sería cierto si v fuera proporcional a 1/μ. Va con la raíz.' },
        { id: 'mas', texto: '80 m/s', error: 'ON4', siFuera: 'Más pesada no es más rápida: cuesta más ponerla en movimiento.' },
        { id: 'igual', texto: '40 m/s', error: 'ON1', siFuera: 'Con la misma tensión, la masa por metro también cuenta.' },
      ],
      dibujo: { datos: ejeVT(0.01, { curvas: [] }), estado: {} },
      revelar: { datos: Object.assign(ejeVT(0.01), { curvas: [...ejeVT(0.01).curvas, ...ejeVT(0.04).curvas], puntos: [{ x: 16, y: 40, color: 'o', rotulo: '40', guias: true }, { x: 16, y: 20, color: 'o', rotulo: '20 m/s', guias: true }] }), estado: {} },
      coincide: 'Coincide: con 4 veces μ, la raíz da la mitad: 40 → 20 m/s.',
    },
    mira: {
      datos: ejeVT(0.01, { puntos: [{ x: 25, y: 50, color: 'o', rotulo: '50 m/s', guias: true, desde: 1 }, { x: 100, y: 100, color: 'o', rotulo: '100 m/s', guias: true, desde: 2 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Con 25 N en la cuerda de 0,01 kg/m: v = √2500.', ecuacion: [v, ' = √(25/0,01) = 50 m/s'] },
        { estado: { corte: 2 }, texto: 'Para duplicar la rapidez hay que cuadruplicar la tensión.', ecuacion: [v, ' = √(100/0,01) = 100 m/s'] },
        { estado: { corte: 2 }, texto: 'La amplitud y la frecuencia no están en la fórmula.', ecuacion: [v, ' = ', { raiz: [{ frac: ['T', 'μ'] }] }] },
      ],
    },
    regla: {
      texto: 'En una cuerda, la rapidez de la onda depende solo de la tensión y de la masa por metro, no de la amplitud ni de la frecuencia.',
      ecuacion: [v, ' = ', { raiz: [{ frac: ['T', 'μ'] }] }, '   ·   ', 'μ = ', { llave: [{ frac: ['m', 'L'] }], nota: 'masa por metro' }],
      condicion: 'cuerda flexible y uniforme, amplitud pequeña. T es la tensión en newtons; μ, en kg/m.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), mu = r.de([0.01, 0.02, 0.04, 0.05]), vv = r.de([10, 20, 30, 40, 50]), T = mu * vv * vv;
        if (s % 2 === 0) return {
          pregunta: `Una cuerda de μ = ${f(mu)} kg/m está tensada con ${f(T)} N. ¿Con qué rapidez viaja un pulso por ella?`,
          opciones: opciones(vv, [
            { id: 'sin-raiz', valor: T / mu, error: 'OND-SIN-RAIZ', siFuera: 'Eso es v²: falta la raíz.' },
            { id: 'inv', valor: Math.sqrt(mu / T), error: 'OND-INV', siFuera: 'Ese cociente está al revés.' },
            { id: 'por', valor: Math.sqrt(T * mu), error: 'ON4', siFuera: 'Eso multiplica por μ; una cuerda más pesada es más lenta.' },
          ], n => `${f(n, 2)} m/s`),
          solucion: { texto: 'Raíz de tensión entre masa por metro.', ecuacion: [v, ` = √(${f(T)} / ${f(mu)}) = ${f(vv)} m/s`] },
        };
        const q = r.de([4, 9, 16]);
        return {
          pregunta: `En una cuerda los pulsos van a ${f(vv)} m/s. Si la tensión se hace ${f(q)} veces mayor, ¿a qué rapidez van?`,
          opciones: opciones(vv * Math.sqrt(q), [
            { id: 'lineal', valor: vv * q, error: 'OND-SIN-RAIZ', siFuera: 'v crece con la raíz de la tensión, no en proporción.' },
            { id: 'inv', valor: vv / Math.sqrt(q), error: 'OND-INV', siFuera: 'Más tensión da más rapidez, no menos.' },
            { id: 'igual', valor: vv, error: 'ON1', siFuera: 'La tensión sí cambia la rapidez.' },
          ], n => `${f(n)} m/s`),
          solucion: { texto: 'v va con la raíz de la tensión.', ecuacion: [v, ` = ${f(vv)} · √${f(q)} = ${f(vv * Math.sqrt(q))} m/s`] },
        };
      },
    },
  };

  // ---------- Idea 4: reflexión y ondas estacionarias ----------
  // Cambia: el modo de vibrar · Permanece: la cuerda de 1 m fija en los dos extremos, con v = 100 m/s ·
  // Progresa: el número de vientres y de nodos · Se reserva: tensar más la cuerda ·
  // Debe verse: solo caben medias longitudes de onda enteras; cada modo tiene su frecuencia.
  const LC = 1, VC = 100;
  const modo = (n, o = {}) => {
    const fn = xx => 2 * Math.sin(n * PI * xx / LC);
    return {
      x: { min: 0, max: 1, paso: 0.25, nombre: 'x', unidad: 'm', decimales: 2 },
      y: { min: -3, max: 3, paso: 1, nombre: 'y', unidad: 'cm', decimales: 0, color: 'i' },
      curvas: [{ puntos: muestras(fn, 0, LC), color: 'i' }, { puntos: muestras(xx => -fn(xx), 0, LC), color: 'i', discontinua: true }],
      puntos: o.sinNodos ? [] : Array.from({ length: n + 1 }, (_, k) => ({ x: k * LC / n, y: 0, rotulo: k === 0 ? 'nodo' : undefined })),
    };
  };
  // Animación (15 nov): y = 2A sen(kx) cos(ωt), con 2A = 2 cm y f = n v / 2L. En cámara lenta (200 veces): t va en
  // milisegundos y 20 ms es un número entero de períodos para n = 1 a 4, así la vuelta no salta. La envolvente
  // (las dos curvas punteadas) y los nodos no se mueven; la curva llena y el vientre sí.
  const fModo = n => n * VC / (2 * LC);
  const yModo = (n, tms) => xx => 2 * Math.sin(n * PI * xx / LC) * Math.cos(2 * PI * fModo(n) * tms / 1000);
  const modoT = (n, tms) => {
    const base = modo(n), yy = yModo(n, tms);
    return Object.assign(base, {
      curvas: [...base.curvas.map(c => Object.assign({}, c, { discontinua: true })), { puntos: muestras(yy, 0, LC), color: 'i' }],
      puntos: [...base.puntos, { x: LC / (2 * n), y: yy(LC / (2 * n)), color: 'i', rotulo: 'vientre' }],
    });
  };
  const estacionarias = {
    id: 'ondas-estacionarias',
    titulo: 'Solo caben medias ondas',
    temas: ['Reflexión y ondas estacionarias'],
    pieza: 'ejes',
    juega: {
      consigna: 'Una cuerda de 1 m, fija en sus extremos, vibra en cámara lenta (200 veces). Las ondas reflejadas se superponen. Cambia el modo.',
      voz: 'Cuenta los nodos, los puntos que no se mueven.',
      controles: [
        { id: 'n', etiqueta: 'modo n', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
        { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 20, paso: 0.25, inicio: 0, unidad: 'ms', decimales: 2, auto: { velocidad: 5, modo: 'repite' } },
      ],
      dibujo: val => ({ datos: modoT(val.n, val.t), estado: {} }),
      lectura: val => [lam, ` = ${f(2 * LC / val.n, 2)} m · `, fr, ` = ${f(fModo(val.n))} Hz · vientre: `, y, ` = ${f(yModo(val.n, val.t)(LC / (2 * val.n)), 1)} cm`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Esa cuerda vibra en su modo fundamental, n = 1. Sin cambiar su largo, se le da más tensión. ¿Qué pasa con la frecuencia de ese modo?',
      opciones: [
        { id: 'c', texto: 'Sube', correcta: true },
        { id: 'baja', texto: 'Baja', error: 'ON8', siFuera: 'Más tensión no frena la onda: la acelera.' },
        { id: 'igual', texto: 'No cambia: λ sigue siendo 2 m', error: 'OND-LAMBDA', siFuera: 'λ sí sigue en 2 m. Pero la onda va más rápido, y f = v/λ.' },
      ],
      dibujo: { datos: modo(1), estado: {} },
      revelar: { datos: Object.assign(modo(1), { puntos: [{ x: 0.5, y: 2, color: 'h', rotulo: 'λ igual, v mayor: f sube' }, { x: 0, y: 0 }, { x: 1, y: 0 }] }), estado: {} },
      coincide: 'Coincide: la forma es la misma, λ = 2 m; con más tensión v crece, y f = v/λ también.',
    },
    mira: {
      datos: Object.assign(modo(3), { puntos: [0, 1, 2, 3].map(k => ({ x: k / 3, y: 0, rotulo: k === 1 ? 'nodos' : undefined, desde: 1 })) }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Los extremos fijos no se mueven: ahí siempre hay nodos.', ecuacion: ['nodos en x = 0 y x = L'] },
        { estado: { corte: 1 }, texto: 'En el modo 3 caben tres medias longitudes de onda.', ecuacion: ['L = 3 · ', { frac: [lam, '2'] }, '   →   ', lam, ' = 0,67 m'] },
        { estado: { corte: 1 }, texto: 'La frecuencia sale de la rapidez de la cuerda.', ecuacion: [fr, ' = ', { frac: [v, lam] }, ' = ', { frac: ['3 · 100', '2 · 1'] }, ' = 150 Hz'] },
      ],
    },
    regla: {
      texto: 'Una onda que se refleja en extremos fijos se superpone consigo misma: forma una onda estacionaria. Solo persisten los modos en que caben medias longitudes de onda enteras.',
      ecuacion: ['L = n ', { llave: [{ frac: [lam, '2'] }], nota: 'media onda', color: 'c-d' }, '   ·   ', { sub: [fr, 'n'] }, ' = ', { frac: [['n ', v], '2L'] }],
      condicion: 'cuerda con los dos extremos fijos; n = 1, 2, 3… es el número de vientres.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n = r.de([1, 2, 3, 4, 5]), L = r.de([0.5, 1, 2]), vv = r.de([80, 100, 200, 300]);
        const fn = n * vv / (2 * L);
        return {
          pregunta: ['Una cuerda de ', f(L), ' m, fija en sus extremos, transmite ondas a ', v, ` = ${f(vv)} m/s. ¿Cuál es la frecuencia de su modo n = ${f(n)}?`],
          opciones: opciones(fn, [
            { id: 'sin-2', valor: n * vv / L, error: 'OND-NODOS', siFuera: 'Eso toma λ = L/n; en una cuerda fija caben medias ondas: λ = 2L/n.' },
            { id: 'inv', valor: 2 * L * n / vv, error: 'OND-INV', siFuera: 'Ese cociente está al revés: f = v/λ.' },
            { id: 'fund', valor: vv / (2 * L), error: 'OND-LAMBDA', siFuera: 'Esa es la frecuencia fundamental, la del modo 1.' },
          ], n2 => `${f(n2, 1)} Hz`),
          solucion: { texto: 'Caben n medias ondas: λ = 2L/n, y f = v/λ.', ecuacion: [{ sub: [fr, String(n)] }, ` = ${f(n)} · ${f(vv)} / (2 · ${f(L)}) = ${f(fn, 1)} Hz`] },
        };
      },
    },
  };

  // ---------- Idea 5: energía, intensidad y decibeles ----------
  // Cambia: la distancia al parlante · Permanece: la potencia del parlante · Progresa: el nivel en dB, que baja ·
  // Se reserva: dos parlantes iguales juntos · Debe verse: la energía se reparte en una esfera; los dB no se suman.
  const P0 = 4 * PI * 1e-4;            // W: da 10⁻⁴ W/m² a 1 m
  const Ir = r => P0 / (4 * PI * r * r);
  const beta = I => 10 * Math.log10(I / 1e-12);
  const ejeB = (extra = {}) => Object.assign({
    x: { min: 0, max: 10, paso: 2, nombre: 'r', unidad: 'm', decimales: 0 },
    y: { min: 50, max: 90, paso: 10, nombre: 'β', unidad: 'dB', decimales: 0 },
    curvas: [{ puntos: muestras(r => beta(Ir(r)), 1, 10, 46) }],
  }, extra);
  const bJuego = val => ejeB({ puntos: [{ x: val.r, y: beta(Ir(val.r)), rotulo: `${f(beta(Ir(val.r)), 1)} dB`, guias: true }] });
  const sonido = {
    id: 'intensidad-decibeles',
    titulo: 'Los decibeles no se suman',
    temas: ['Energía transportada por una onda', 'Intensidad y nivel de intensidad sonora'],
    pieza: 'ejes',
    juega: {
      // Animación (15 nov): no hay reloj; tu distancia r va y viene sola entre 1 y 10 m y el punto recorre la curva β–r.
      consigna: 'Un parlante emite sonido por igual en todas direcciones. Tu distancia va y viene sola: mira cómo bajan la intensidad y los decibeles.',
      voz: 'Mira cuánto baja el nivel cada vez que la distancia se duplica.',
      controles: [{ id: 'r', etiqueta: 'distancia', min: 1, max: 10, paso: 1, inicio: 1, unidad: 'm', decimales: 0, auto: { velocidad: 2.25, modo: 'rebota' } }],
      dibujo: val => ({ datos: bJuego(val), estado: {} }),
      lectura: val => [`I = ${f(Ir(val.r) * 1e6, 2)} µW/m² · β = ${f(beta(Ir(val.r)), 1)} dB`],
      minimo: 3,
      // Arrastra el punto por la curva: su lugar en el eje horizontal es tu distancia al parlante.
      arrastres: [
        { id: 'distancia', etiqueta: 'distancia al parlante',
          donde: val => enEjes(bJuego(val), val.r, beta(Ir(val.r))),
          mover: (pt, val) => ({ r: EJ().geometria(bJuego(val)).Xi(pt.x) }) },
      ],
    },
    predice: {
      pregunta: 'Donde estás, un parlante da 60 dB. Se enciende a su lado otro parlante igual. ¿Qué nivel oyes ahora?',
      opciones: [
        { id: 'c', texto: 'Unos 63 dB', correcta: true },
        { id: 'suma', texto: '120 dB', error: 'SO-SUMA', siFuera: 'Lo que se duplica es la intensidad, la energía por segundo. Los dB miden su logaritmo.' },
        { id: 'igual', texto: '60 dB', error: 'SO-IGUAL', siFuera: 'Algo más fuerte sí suena: llega el doble de energía por segundo.' },
        { id: 'seis', texto: '66 dB', error: 'SO-DOBLE', siFuera: '+6 dB pasa al reducir la distancia a la mitad: eso cuadruplica la intensidad.' },
      ],
      dibujo: { datos: ejeB(), estado: {} },
      revelar: { datos: ejeB({ x: { min: 0, max: 10, paso: 2, nombre: 'r', unidad: 'm', decimales: 0 }, puntos: [{ x: 10, y: 60, guias: true }, { x: 10, y: 60 + 10 * Math.log10(2), rotulo: `60 → ${f(60 + 10 * Math.log10(2), 1)} dB` }] }), estado: {} },
      coincide: 'Coincide: el doble de intensidad suma 10 · log 2 ≈ 3 dB.',
    },
    mira: {
      datos: ejeB({ puntos: [{ x: 1, y: 80, rotulo: '80 dB', guias: true, desde: 1 }, { x: 2, y: beta(Ir(2)), rotulo: `${f(beta(Ir(2)), 0)} dB`, guias: true, desde: 2 }, { x: 10, y: 60, rotulo: '60 dB', guias: true, desde: 3 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'La energía de cada segundo se reparte en una esfera de área 4πr².', ecuacion: ['I = ', { frac: ['P', ['4π ', { sup: ['r', '2'] }]] }, ' = 100 µW/m² a 1 m'] },
        { estado: { corte: 1 }, texto: 'El nivel compara I con el sonido más débil que se oye.', ecuacion: ['β = 10 log ', { frac: ['I', { sub: ['I', '0'] }] }, ' = 10 log ', { sup: ['10', '8'] }, ' = 80 dB'] },
        { estado: { corte: 2 }, texto: 'Al doble de distancia, I es la cuarta parte: unos 6 dB menos.', ecuacion: ['10 log 4 ≈ 6 dB'] },
        { estado: { corte: 3 }, texto: 'A 10 m, I es cien veces menor: 20 dB menos.', ecuacion: ['10 log 100 = 20 dB'] },
      ],
    },
    regla: {
      texto: 'La intensidad de la onda es la potencia por unidad de área. El nivel de intensidad sonora, en decibeles, es su logaritmo: I por 10 suma 10 dB.',
      ecuacion: ['I = ', { frac: ['P', 'A'] }, '   ·   ', 'β = 10 log ', { frac: ['I', { sub: ['I', '0'] }] }, '   ·   ', { llave: [{ sub: ['I', '0'] }, ' = ', { sup: ['10', '−12'] }, ' W/m²'], nota: 'apenas se oye' }],
      condicion: 'fuente pequeña que emite igual en todas direcciones y sin absorción (A = 4πr²). El oído no percibe en proporción a I.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const e = r.de([-8, -7, -6, -5, -4, -3]), I = Math.pow(10, e), b = beta(I);
          return {
            pregunta: ['Un sonido llega con intensidad ', { sup: ['10', String(e).replace('-', '−')] }, ' W/m². ¿Cuál es su nivel en decibeles? (', { sub: ['I', '0'] }, ' = ', { sup: ['10', '−12'] }, ' W/m²)'],
            opciones: opciones(b, [
              { id: 'sin10', valor: b / 10, error: 'SO-LINEAL', siFuera: 'Eso es el logaritmo, en belios; falta multiplicar por 10.' },
              { id: 'exp', valor: -e * 10, error: 'SO-INV', siFuera: 'Eso usa el exponente de I sin compararla con I₀.' },
              { id: 'neg', valor: 10 * e, error: 'SO-INV', siFuera: 'Ese valor negativo sale de no dividir entre I₀.' },
            ], n => `${f(n)} dB`),
            solucion: { texto: 'Se divide entre I₀ y se toma el logaritmo, por 10.', ecuacion: ['β = 10 log ', { frac: [{ sup: ['10', String(e).replace('-', '−')] }, { sup: ['10', '−12'] }] }, ` = 10 · ${f(e + 12)} = ${f(b)} dB`] },
          };
        }
        const b0 = r.de([40, 50, 60, 70]), q = r.de([2, 10, 100, 1000]), b1 = b0 + 10 * Math.log10(q);
        return {
          pregunta: `Un sonido de ${f(b0)} dB aumenta su intensidad ${f(q)} veces. ¿Qué nivel tiene ahora?`,
          opciones: opciones(b1, [
            { id: 'por', valor: b0 * q, error: 'SO-LINEAL', siFuera: 'Los dB no se multiplican: son un logaritmo.' },
            { id: 'suma', valor: b0 + q, error: 'SO-SUMA', siFuera: 'Se suma 10 · log q, no q.' },
            { id: 'igual', valor: b0 + q / 10, error: 'SO-LINEAL', siFuera: 'Ese aumento no sale del logaritmo.' },
          ], n => `${f(n, 1)} dB`),
          solucion: { texto: 'Multiplicar I por q suma 10 · log q decibeles.', ecuacion: [`β = ${f(b0)} + 10 log ${f(q)} = ${f(b1, 1)} dB`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Cuerda de guitarra: la tensión y la cuerda fijan v (idea 3); la frecuencia, λ = v/f (idea 2). Juntas en una mesa.
  const MUS = [{ valor: 0.01, texto: 'delgada' }, { valor: 0.04, texto: 'gruesa' }];
  // Animación (15 nov): la onda corre en cámara lenta (200 veces), y = A sen(2π(x/λ − f t)), con t en milisegundos; 40 ms
  // es un número entero de períodos para f múltiplo de 25 Hz. P, en x = 1 m, sube y baja en su lugar.
  const XG = 1;
  const tG = val => (val.t || 0) / 1000;
  const yG = val => xx => A1 * Math.sin(2 * PI * (xx * val.f / velC(val.T, val.mu) - val.f * tG(val)));
  const crestaG = val => primeraCresta(velC(val.T, val.mu), val.f, tG(val));
  const guitarra = val => {
    const L = velC(val.T, val.mu) / val.f, xc = crestaG(val), cr = [xc, xc + L].filter(c => c <= 2 + 1e-9);
    return {
      x: { min: 0, max: 2, paso: 0.5, nombre: 'x', unidad: 'm', decimales: 1 },
      y: { min: -3, max: 3, paso: 1, nombre: 'y', unidad: 'cm', decimales: 0, color: 'i' },
      curvas: [{ puntos: muestras(yG(val), 0, 2, 481), color: 'i' }],
      // Dos crestas seguidas en verde (están a λ); el rótulo va en la segunda, o en la única que cabe.
      puntos: [...cr.map((c, k) => ({ x: c, y: A1, color: 'd', rotulo: k === cr.length - 1 ? `λ = ${f(L, 2)} m` : '' })),
        { x: XG, y: yG(val)(XG), color: 'i', rotulo: 'P', guias: true }],
    };
  };
  // Cuerda fija en los dos extremos, de largo variable (el extremo derecho se arrastra), con v = 100 m/s.
  const modoLibre = val => {
    const fn = xx => (xx <= val.L ? 2 * Math.sin(val.n * PI * xx / val.L) : 0);
    return {
      x: { min: 0, max: 2, paso: 0.5, nombre: 'x', unidad: 'm', decimales: 1 },
      y: { min: -3, max: 3, paso: 1, nombre: 'y', unidad: 'cm', decimales: 0, color: 'i' },
      curvas: [{ puntos: muestras(fn, 0, val.L, 121), color: 'i' }, { puntos: muestras(xx => -fn(xx), 0, val.L, 121), color: 'i', discontinua: true }],
      puntos: Array.from({ length: val.n + 1 }, (_, k) => ({ x: k * val.L / val.n, y: 0, rotulo: k === val.n ? `L = ${f(val.L, 2)} m` : undefined })),
    };
  };
  // Varios parlantes iguales juntos: la intensidad se multiplica por N; el nivel sube 10 log N.
  const NP = [{ valor: 1, texto: '1 parlante' }, { valor: 2, texto: '2 parlantes' }, { valor: 10, texto: '10 parlantes' }];
  const parlantes = val => ejeB({
    y: { min: 50, max: 100, paso: 10, nombre: 'β', unidad: 'dB', decimales: 0 },
    curvas: [
      { puntos: muestras(r => beta(Ir(r)), 1, 10, 46), discontinua: val.N !== 1, rotulo: val.N !== 1 ? '1' : undefined, en: [8, beta(Ir(8)) - 4] },
      ...(val.N !== 1 ? [{ puntos: muestras(r => beta(val.N * Ir(r)), 1, 10, 46), rotulo: String(val.N), en: [8, beta(val.N * Ir(8)) + 4] }] : []),
    ],
    puntos: [{ x: val.r, y: beta(val.N * Ir(val.r)), rotulo: `${f(beta(val.N * Ir(val.r)), 1)} dB`, guias: true }],
  });

  // Para los retos: las mismas cuentas que dibujan y leen las mesas. `guardado` dice si el caso actual ya se guardó.
  const lamG = val => velC(val.T, val.mu) / val.f;
  const crestasG = val => Math.floor((2 - lamG(val) / 4) / lamG(val) + 1e-9) + 1;   // crestas en λ/4 + kλ ≤ 2 m
  const lamFija = val => 2 * val.L / val.n;
  const frecFija = val => val.n * VC / (2 * val.L);
  const nivelP = val => beta(val.N * Ir(val.r));
  const guardado = (val, gs, claves) => gs.some(g => claves.every(c => g[c] === val[c]));

  return {
    unidad: 'fisica.ondas-mecanicas',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js'],
    // Glosario del tema (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso. «Medio» y «fase» a
    // secas no se definen (tienen otro sentido en otras unidades); «intensidad» va como «intensidad de la onda».
    glosario: [
      { termino: 'onda', def: 'Perturbación que viaja y lleva energía de un lugar a otro, sin llevar materia.',
        ver: ['onda mecánica', 'longitud de onda'] },
      { termino: 'onda mecánica', formas: ['onda mecánica', 'ondas mecánicas'], def: 'Onda que necesita un medio material que vibre, como una cuerda, el agua o el aire.',
        ejemplo: 'El sonido: en el vacío no se oye nada.', ver: ['onda'] },
      { termino: 'onda transversal', formas: ['onda transversal', 'ondas transversales', 'transversal', 'transversales'],
        def: 'Onda en la que cada punto del medio oscila perpendicular a la dirección en que avanza.',
        ejemplo: 'Una cuerda agitada: sus puntos suben y bajan mientras la onda avanza.', ver: ['onda longitudinal'] },
      { termino: 'onda longitudinal', formas: ['onda longitudinal', 'ondas longitudinales', 'longitudinal', 'longitudinales'],
        def: 'Onda en la que cada punto del medio oscila en la misma dirección en que avanza.',
        ejemplo: 'El sonido en el aire: las capas de aire van y vienen.', ver: ['onda transversal'] },
      { termino: 'longitud de onda', formas: ['longitud de onda', 'longitudes de onda'], simbolo: 'λ', medida: 'm',
        def: 'Distancia entre dos crestas seguidas: lo que avanza la onda en un período.',
        ejemplo: 'v = 2 m/s y f = 1 Hz: λ = 2 / 1 = 2 m.', ver: ['cresta'] },
      { termino: 'cresta', def: 'Punto más alto de una onda o de una curva que sube y baja; el más bajo es el valle.',
        ver: ['longitud de onda'] },
      { termino: 'función de onda', def: 'Fórmula que da la altura de cada punto del medio en cada instante.',
        ejemplo: 'y = 2 sen(2πx − 4πt): λ = 1 m y f = 2 Hz.', ver: ['longitud de onda'] },
      { termino: 'reflexión', formas: ['reflexión', 'reflexiones', 'se refleja', 'se reflejan'],
        def: 'Rebote de una onda al llegar al borde de su medio: vuelve hacia donde venía.', ver: ['onda estacionaria'] },
      { termino: 'onda estacionaria', formas: ['onda estacionaria', 'ondas estacionarias'],
        def: 'Vibración que no avanza: la forman dos ondas iguales que viajan en sentidos opuestos y se superponen.',
        ejemplo: 'Una cuerda de guitarra, fija en sus dos extremos, al sonar.', ver: ['nodo', 'vientre'] },
      { termino: 'nodo', def: 'Punto de una onda estacionaria que siempre está quieto.',
        ejemplo: 'En una cuerda fija, los dos extremos siempre están quietos.', ver: ['vientre'] },
      { termino: 'vientre', formas: ['vientre', 'vientres', 'antinodo', 'antinodos'], def: 'Punto de una onda estacionaria que oscila con la mayor amplitud.',
        ver: ['nodo'] },
      { termino: 'frecuencia fundamental', simbolo: 'f₁', medida: 'Hz', def: 'La frecuencia más baja con que puede vibrar una cuerda fija: la del modo 1.',
        ejemplo: 'Cuerda de 1 m con ondas a 100 m/s: f₁ = 100 / 2 = 50 Hz.', ver: ['onda estacionaria'] },
      { termino: 'intensidad de la onda', formas: ['intensidad de la onda', 'intensidad de una onda'], simbolo: 'I', medida: 'W/m²',
        def: 'Energía que lleva la onda en cada segundo por cada metro cuadrado que atraviesa.',
        ejemplo: 'Lejos de un parlante, al doble de distancia llega la cuarta parte.', ver: ['nivel de intensidad sonora'] },
      { termino: 'nivel de intensidad sonora', simbolo: 'β', medida: 'dB', def: 'Medida, en decibeles, de qué tan intenso es un sonido comparado con el más débil que se oye.',
        ejemplo: 'I = 10⁻⁴ W/m²: β = 10 log 10⁸ = 80 dB.', ver: ['decibel'] },
      { termino: 'decibel', formas: ['decibel', 'decibeles'], simbolo: 'dB', def: 'Unidad del nivel sonoro: cada vez que la intensidad se multiplica por 10, el nivel sube 10.',
        ejemplo: 'De 60 dB, con el doble de intensidad, a unos 63 dB.', ver: ['nivel de intensidad sonora'] },
    ],
    // Laboratorio: juego libre, sin preguntas. La guitarra junta las ideas 2 y 3 (tensión, cuerda y frecuencia); la
    // cuerda fija suelta el largo y llega al modo 6; los parlantes prueban lo que la idea 5 solo pregunta.
    laboratorio: [
      {
        id: 'guitarra', titulo: 'Tensión, cuerda y frecuencia', pieza: 'ejes',
        consigna: 'La onda corre en cámara lenta (200 veces). Tensa la cuerda, elige su grosor y su frecuencia. ¿Qué cambia λ sin cambiar v?',
        controles: [
          { id: 'T', etiqueta: 'tensión', min: 10, max: 90, paso: 10, inicio: 40, unidad: 'N', decimales: 0 },
          { id: 'mu', etiqueta: 'Cuerda', opciones: MUS, inicio: 0.01 },
          { id: 'f', etiqueta: 'f', color: 'c-h', min: 25, max: 200, paso: 25, inicio: 50, unidad: 'Hz', decimales: 0 },
          { id: 't', etiqueta: 't', color: 'c-h', min: 0, max: 40, paso: 0.5, inicio: 0, unidad: 'ms', decimales: 1, auto: { velocidad: 5, modo: 'repite' } },
        ],
        dibujo: val => ({ datos: guitarra(val), estado: {} }),
        lectura: val => [v, ` = ${f(velC(val.T, val.mu), 1)} m/s · `, lam, ` = ${f(lamG(val), 2)} m · P: `, y, ` = ${f(yG(val)(XG), 1)} cm`],
        arrastres: [
          { id: 'primera-cresta', etiqueta: 'primera cresta', color: 'c-h',
            donde: val => enEjes(guitarra(val), Math.min(2, crestaG(val)), A1),
            // Si la primera cresta todavía no entra en los 2 m, la manija espera en el borde: ahí no cambia nada.
            mover: (pt, val) => {
              const px = EJ().geometria(guitarra(val)).Xi(pt.x);
              if (crestaG(val) > 2 && px >= 2 - 1e-6) return { t: val.t };
              return { t: val.t, f: fDeCresta(px, velC(val.T, val.mu), val.f, tG(val), 25, 200) };
            } },
        ],
        invitaciones: [
          { texto: 'Guarda dos casos con la misma rapidez y distinta longitud de onda.',
            logrado: (val, guardados) => guardado(val, guardados, ['T', 'mu', 'f'])
              && guardados.some(g => Math.abs(velC(g.T, g.mu) - velC(val.T, val.mu)) < 1e-9 && Math.abs(lamG(g) - lamG(val)) > 1e-9),
            bien: 'Solo cambió f: la cuerda decide v, y la frecuencia reparte λ.' },
          { texto: 'Con la cuerda gruesa, iguala la rapidez de la delgada tensada a 20 N.',
            logrado: val => val.mu === 0.04 && Math.abs(velC(val.T, 0.04) - velC(20, 0.01)) < 1e-9,
            bien: 'Cuatro veces más pesada pidió cuatro veces la tensión.' },
          { texto: 'Busca la longitud de onda más larga posible.',
            logrado: val => lamG(val) >= lamG({ T: 90, mu: 0.01, f: 25 }) - 1e-9,
            bien: 'Cuerda tensa, liviana y frecuencia baja: las crestas se separan más.' },
          { texto: 'Haz que en los 2 m de cuerda quepan seis crestas o más.',
            logrado: val => crestasG(val) >= 6,
            bien: 'Crestas apretadas, λ chica. ¿Lo lograste con f o con la cuerda?' },
          { texto: 'Pausa la cuerda justo cuando P esté en lo más alto.',
            logrado: val => yG(val)(XG) >= 0.95 * A1,
            bien: 'P llegó arriba sin moverse de x = 1 m: sube y baja en su lugar.',
            pista: 'Mira subir a P y pausa en la cresta; ajusta t con − y +.' },
        ],
      },
      {
        id: 'cuerda-fija', titulo: 'Cuerda fija de largo libre', pieza: 'ejes',
        consigna: 'Arrastra el extremo derecho para cambiar el largo y elige el modo. Las ondas van a 100 m/s.',
        controles: [
          { id: 'L', etiqueta: 'L', min: 0.5, max: 2, paso: 0.25, inicio: 1, unidad: 'm', decimales: 2 },
          { id: 'n', etiqueta: 'modo n', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 },
        ],
        dibujo: val => ({ datos: modoLibre(val), estado: {} }),
        lectura: val => [`L = ${f(val.L, 2)} m, n = ${f(val.n)}: `, lam, ` = ${f(lamFija(val), 2)} m, `, fr, ` = ${f(frecFija(val), 1)} Hz`],
        arrastres: [
          { id: 'extremo', etiqueta: 'extremo derecho de la cuerda',
            donde: val => enEjes(modoLibre(val), val.L, 0),
            mover: (pt, val) => ({ L: EJ().geometria(modoLibre(val)).Xi(pt.x) }) },
        ],
        invitaciones: [
          { texto: 'Haz que la cuerda vibre justo a 150 Hz.',
            logrado: val => Math.abs(frecFija(val) - 150) < 1e-9,
            bien: 'Más modo o menos largo: dos caminos a la misma frecuencia.' },
          { texto: 'Consigue una cuerda con cinco nodos, contando los extremos.',
            logrado: val => modoLibre(val).puntos.length === 5,
            bien: 'Cinco nodos y cuatro vientres: siempre hay un nodo más.' },
          { texto: 'Busca la frecuencia fundamental más grave posible.',
            logrado: val => val.n === 1 && frecFija(val) <= frecFija({ L: 2, n: 1 }) + 1e-9,
            bien: 'Cuerda larga y modo 1: la nota más grave. Por eso el contrabajo es grande.' },
          { texto: 'Guarda dos cuerdas de distinto largo con la misma longitud de onda.',
            logrado: (val, guardados) => guardado(val, guardados, ['L', 'n'])
              && guardados.some(g => g.L !== val.L && Math.abs(lamFija(g) - lamFija(val)) < 1e-9),
            bien: 'Misma λ y misma f: la cuerda larga solo tiene más vientres.' },
        ],
      },
      {
        id: 'parlantes', titulo: 'Más parlantes, más decibeles', pieza: 'ejes',
        consigna: 'Elige cuántos parlantes iguales suenan juntos y arrastra tu distancia. Compara con la curva de uno solo.',
        controles: [
          { id: 'r', etiqueta: 'distancia', min: 1, max: 10, paso: 1, inicio: 2, unidad: 'm', decimales: 0 },
          { id: 'N', etiqueta: 'Parlantes', opciones: NP, inicio: 2 },
        ],
        dibujo: val => ({ datos: parlantes(val), estado: {} }),
        lectura: val => [`${NP.find(q => q.valor === val.N).texto} a ${f(val.r)} m: β = ${f(nivelP(val), 1)} dB`],
        arrastres: [
          { id: 'distancia', etiqueta: 'distancia a los parlantes',
            donde: val => enEjes(parlantes(val), val.r, beta(val.N * Ir(val.r))),
            mover: (pt, val) => ({ r: EJ().geometria(parlantes(val)).Xi(pt.x) }) },
        ],
        invitaciones: [
          { texto: 'Guarda 1 parlante y 10 parlantes a la misma distancia.',
            logrado: (val, guardados) => guardado(val, guardados, ['r', 'N'])
              && guardados.some(g => g.r === val.r && g.N * val.N === 10),
            bien: 'Diez veces la intensidad suma solo 10 dB: el nivel es un logaritmo.' },
          { texto: 'Haz que el nivel sea justo 80 dB.',
            logrado: val => Math.abs(nivelP(val) - 80) < 1e-9,
            bien: 'Un parlante a 1 m. ¿Dónde tendrías lo mismo con diez?' },
          { texto: 'Busca el nivel más bajo que puedes conseguir.',
            logrado: val => nivelP(val) <= nivelP({ r: 10, N: 1 }) + 1e-9,
            bien: 'Diez veces más lejos, cien veces menos intensidad: 20 dB menos.' },
        ],
      },
    ],
    historia: {
      texto: 'Una misma cuerda puede vibrar de varias formas y sonar distinto. En el siglo XVIII, d’Alembert, Euler y Daniel Bernoulli discutieron cómo describir con matemáticas una cuerda que cambia de forma en el tiempo. De esa discusión salen la función de onda y la idea de sumar modos.',
      pregunta: '¿Por qué una guitarra suena distinto si pisas la cuerda?',
      fuente: { titulo: 'MacTutor — Archibald: Mathematics and Music', url: 'https://mathshistory.st-andrews.ac.uk/Extras/Archibald_music/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'guitarra': ['rapidez-cuerda', 'funcion-de-onda'],
      'cuerda-fija': ['ondas-estacionarias'],
      'parlantes': ['intensidad-decibeles'],
    },
    ideas: [transversal, funcion, rapidez, estacionarias, sonido],
  };
});
