/*
 * Teoría de «Física moderna» (fisica.fisica-moderna). Molde: contenido/teoria/fisica/movimiento-rectilineo.js.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 20), precisiones de física del expediente («más brillo da
 * más electrones» solo por encima del umbral; no presentar fotones como pelotas clásicas) y
 * docs/investigacion/electromagnetismo-moderna-ideas-erroneas.md (FM1–FM5). El motor de plantillas/fisica-moderna
 * sirve solo para contrastar cuentas.
 * Colores (regla 4), uno por variable dentro de cada idea; entre ideas se repiten tokens sin coincidir en pantalla:
 *   fotoeléctrico y fotones: f rojo (c-h), K naranja (c-o), φ turquesa (c-i), N verde (c-d);
 *   cuerpo negro: T rojo (c-h), λmáx verde (c-d); rayos X y láser: V turquesa (c-i), λmín verde (c-d);
 *   relatividad: v rojo (c-h), Δt naranja (c-o), Δt₀ turquesa (c-i); incertidumbre: Δx turquesa (c-i), Δv naranja (c-o).
 * Estado: completa (14 nov 2026): seis ideas para los siete temas (rayos X y láser comparten una: el fotón que deja
 * un salto de energía).
 * Constantes: h = 6,63 × 10⁻³⁴ J·s, hc = 1240 eV·nm, ħ = 1,055 × 10⁻³⁴ J·s, e = 1,6 × 10⁻¹⁹ C, mₑ = 9,11 × 10⁻³¹ kg,
 * b de Wien = 2,9 × 10⁻³ m·K.
 * Códigos de error nuevos (hipótesis, sin dato propio): FE-ESPERA, FE-SUMA, FE-SIN-PHI, FT-AZUL, FT-IGUAL, FT-EV,
 * FT-SIN-F, CN-ROJO, CN-UV, CN-CELSIUS, CN-POR, RX-POR, RX-UNIDAD, LS-AZAR, LS-DOBLE, LS-ABSORBE, RE-OPINION,
 * RE-INVERSO, RE-CUADRADO, IN-INSTRUMENTO, IN-DIRECTA, IN-SIN-2, IN-H.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: seis relaciones de la física del siglo XX, jugadas antes de preguntarlas.
 *   Persona y condiciones: postulante de 5.º (San Marcos pide relatividad), celular de gama baja a 360 px, sin conexión a ratos.
 *   Resultado observable: separa color de brillo en el fotoeléctrico, usa E = hf y aplica γ y Δx·Δp a un caso nuevo.
 *   Orden de atención: 1.º la figura (placa, haz o gráfica) · 2.º la lectura en vivo · acción: botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿por qué una luz muy brillante puede no arrancar ni un electrón?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const H = 6.63e-34, EV = 1.6e-19, HC = 1240, HBAR = 1.055e-34, ME = 9.11e-31, WIEN = 2.9e6; // WIEN en nm·K
  const fr = { v: 'c-h', t: 'f' }, K = { sub: [{ v: 'c-o', t: 'K' }, 'máx'] }, phi = { v: 'c-i', t: 'φ' }, N = { v: 'c-d', t: 'N' };
  const T = { v: 'c-h', t: 'T' }, lmax = { sub: [{ v: 'c-d', t: 'λ' }, 'máx'] }, V = { v: 'c-i', t: 'V' }, lmin = { sub: [{ v: 'c-d', t: 'λ' }, 'mín'] };
  const vv = { v: 'c-h', t: 'v' }, dt = ['Δ', { v: 'c-o', t: 't' }], dt0 = ['Δ', { sub: [{ v: 'c-i', t: 't' }, '0'] }];
  const dx = ['Δ', { v: 'c-i', t: 'x' }], dv = ['Δ', { v: 'c-o', t: 'v' }];
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  function cient(x, dec = 2) {
    if (x === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(x)) + 1e-9), m = Math.round(x / Math.pow(10, e) * 100) / 100;
    if (e === 0) return f(m, dec);
    const pot = '10' + String(e).split('').map(ch => SUP[ch]).join('');
    return m === 1 ? pot : `${f(m, dec)} × ${pot}`;
  }
  // En las ecuaciones el exponente va con { sup } (en lecturas y rótulos queda el Unicode de cient: cabe en 12 palabras).
  const diez = e => ({ sup: ['10', String(e).replace('-', '−')] });
  function cientP(x, dec = 2) {
    if (x === 0) return ['0'];
    const e = Math.floor(Math.log10(Math.abs(x)) + 1e-9), m = Math.round(x / Math.pow(10, e) * 100) / 100;
    if (e === 0) return [f(m, dec)];
    return m === 1 ? [diez(e)] : [`${f(m, dec)} × `, diez(e)];
  }
  // Gesto directo en las gráficas: la manija es un punto de la curva; ejes.geometria da X, Y y sus inversas.
  const EJ = () => Kit.piezas.ejes;
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt, ok = x => x > 0) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      if (!Number.isFinite(d.valor) || !ok(d.valor)) continue;
      const txt = fmt(d.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const eV = f14 => H * f14 * 1e14 / EV;                 // energía de un fotón de f × 10¹⁴ Hz, en eV
  const ondaPx = lamNm => Math.max(6, Math.min(30, lamNm / 24)); // largo de onda del dibujo (más corta, más energía)

  // ---------- Idea 1: el efecto fotoeléctrico ----------
  // Cambia: el color (frecuencia) y el brillo de la lámpara · Permanece: la placa de sodio (φ = 2,3 eV) ·
  // Progresa: los paquetes, la placa y los electrones con su flecha · Se reserva: luz roja muy brillante (no saca nada) ·
  // Debe verse: el color fija la energía de cada electrón; el brillo, cuántos salen.
  // Hallazgo 9: el juego es la lámpara con la placa y «Mira» pasa a la recta Kmáx–f a propósito: cada caso que el
  // alumno probó es un punto de esa recta (la mesa «Dos metales, dos rectas» del laboratorio las junta con el dedo).
  // Sin arrastre en el juego: color y brillo son propiedades de la luz, no lugares de la figura; tomar la flecha del
  // electrón movería la respuesta y no la causa.
  const PHI = 2.3;
  const foto = (f14, brillo, o = {}) => {
    const E = eV(f14), Km = Math.max(0, E - PHI), sale = E > PHI;
    return { datos: { fotones: 3 * brillo, onda: ondaPx(3e8 / (f14 * 1e14) * 1e9), electrones: sale ? brillo : 0, k: Km / 2.7, rotulos: { foton: `hf = ${f(E, 2)} eV`, placa: 'sodio: φ = 2,3 eV', e: `Kmáx = ${f(Km, 2)} eV`, nota: 'no salen electrones' } }, estado: o.paso ? { paso: o.paso } : {} };
  };
  const fotoelectrico = {
    id: 'fotoelectrico',
    titulo: 'El color arranca, el brillo cuenta',
    temas: ['Efecto fotoeléctrico'],
    pieza: 'fis-fotones',
    juega: {
      consigna: 'Una lámpara ilumina una placa de sodio. Cambia la frecuencia de la luz y su brillo, y mira los electrones que salen.',
      voz: 'Fíjate qué control alarga las flechas y cuál suma electrones.',
      controles: [
        { id: 'f', etiqueta: 'f (× 10¹⁴ Hz)', color: 'c-h', min: 6, max: 12, paso: 1, inicio: 8, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'Brillo', color: 'c-d', min: 1, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0 },
      ],
      dibujo: val => foto(val.f, val.b),
      lectura: val => ['hf = ', f(eV(val.f), 2), ' eV · ', K, ` = ${f(eV(val.f) - PHI, 2)}\u00a0eV`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Luz roja de 4,5 × 10¹⁴ Hz (hf = 1,86 eV) no saca electrones del sodio. Pones una lámpara roja diez veces más brillante. ¿Qué pasa?',
      opciones: [
        { id: 'c', texto: 'Siguen sin salir electrones', correcta: true },
        { id: 'salen', texto: 'Salen: llega más energía', error: 'FM2', siFuera: 'Llega más energía en total, es cierto. Pero cada paquete sigue con 1,86 eV, menos que φ.' },
        { id: 'espera', texto: 'Salen si esperas un rato', error: 'FE-ESPERA', siFuera: 'Juntar energía de a pocos sería cierto con una onda continua. Cada electrón toma un solo paquete.' },
        { id: 'lentos', texto: 'Salen, pero muy lentos', error: 'FM3', siFuera: 'Saldrían lentos justo por encima del umbral. Por debajo, ninguno sale.' },
      ],
      dibujo: (() => { const d = foto(4.5, 4, { paso: 2 }); return d; })(),
      revelar: foto(4.5, 4),
      coincide: 'Coincide: por debajo de la frecuencia umbral, ningún brillo arranca electrones.',
    },
    mira: {
      pieza: 'ejes',
      datos: {
        x: { min: 0, max: 12, paso: 2, nombre: 'f', unidad: '×10¹⁴ Hz', decimales: 0, color: 'h' },
        y: { min: -2.5, max: 3, paso: 1, nombre: 'Kmáx', unidad: 'eV', decimales: 0, color: 'o' },
        curvas: [{ puntos: [[PHI / eV(1), 0], [12, eV(12) - PHI]], color: 'o', desde: 1 }, { puntos: [[0, -PHI], [PHI / eV(1), 0]], color: 'o', discontinua: true, desde: 4 }],
        puntos: [{ x: PHI / eV(1), y: 0, color: 'h', rotulo: `f₀ = ${f(PHI / eV(1), 2)}`, desde: 3 }, { x: 0, y: -PHI, color: 'i', rotulo: '−φ = −2,3 eV', desde: 4 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Kmáx crece en línea recta con la frecuencia.', ecuacion: [K, ' = h', fr, ' − ', phi] },
        { estado: { corte: 2 }, texto: 'La pendiente es la constante de Planck, la misma para todo metal.', ecuacion: ['h = 6,63 × ', diez(-34), ' J·s = ', ...cientP(H / EV), ' eV·s'] },
        { estado: { corte: 3 }, texto: 'Por debajo del umbral, hf no alcanza para pagar φ.', ecuacion: [{ sub: [fr, '0'] }, ' = ', { frac: [phi, 'h'] }, ' = ', ...cientP(PHI / eV(1) * 1e14, 1), ' Hz'] },
        { estado: { corte: 4 }, texto: 'Prolongada, la recta corta el eje vertical en −φ.', ecuacion: [phi, ' = 2,3 eV (sodio)'] },
      ],
    },
    regla: {
      texto: 'Cada electrón absorbe un fotón entero. Paga la función trabajo φ y le queda el resto como energía cinética.',
      ecuacion: [K, ' = ', { llave: ['h', fr], nota: 'lo que trae', color: 'c-h' }, ' − ', { llave: [phi], nota: 'lo que paga', color: 'c-i' }, '   ·   ', { sub: [fr, '0'] }, ' = ', { frac: [phi, 'h'] }],
      condicion: 'f es mayor que f₀. El brillo cambia cuántos fotones llegan y cuántos electrones salen, no Kmáx.',
    },
    ahoraTu: {
      pieza: 'fis-fotones',
      generar(s) {
        const r = azar(s), metales = [['sodio', 2.3], ['cesio', 2.1], ['calcio', 2.9], ['zinc', 4.3], ['potasio', 2.2]];
        const [met, ph] = metales[s % metales.length];
        const lam = r.de([150, 200, 250, 300, 400].filter(l => HC / l > ph + 0.2));
        const E = HC / lam, Km = E - ph;
        return {
          pregunta: ['Luz de ', `${f(lam, 0)} nm (hf = ${f(E, 2)} eV) ilumina ${met}, con `, phi, ` = ${f(ph, 1)} eV. ¿Cuánto vale `, K, '?'],
          dibujo: { datos: { fotones: 6, onda: ondaPx(lam), electrones: 3, k: Math.min(1, Km / 7), rotulos: { foton: `hf = ${f(E, 2)} eV`, placa: `φ = ${f(ph, 1)} eV` } }, estado: { paso: 2 } },
          opciones: opciones(Km, [
            { id: 'suma', valor: E + ph, error: 'FE-SUMA', siFuera: 'Eso suma φ; el electrón la gasta para salir.' },
            { id: 'sin', valor: E, error: 'FE-SIN-PHI', siFuera: 'Esa es la energía del fotón; falta pagar φ.' },
            { id: 'phi', valor: ph, error: 'FM3', siFuera: 'Esa es la función trabajo del metal.' },
          ], x => `${f(x, 2)} eV`),
          solucion: { texto: 'Energía del fotón menos la función trabajo.', ecuacion: [K, ` = ${f(E, 2)} − ${f(ph, 1)} = ${f(Km, 2)} eV`] },
        };
      },
    },
  };

  // ---------- Idea 2: potencia e intensidad, en fotones ----------
  // Cambia: la potencia de un láser verde · Permanece: el color (cada paquete con 2,33 eV) ·
  // Progresa: cuántos paquetes llegan cada segundo · Se reserva: rojo contra azul a igual potencia ·
  // Debe verse: a igual potencia, fotones de menos energía son más numerosos.
  const fotJ = lamNm => HC / lamNm * EV;
  const haz = (lamNm, n, rot) => ({ datos: { fotones: n, onda: ondaPx(lamNm), placa: false, rotulos: { foton: rot } }, estado: {} });
  const fotones = {
    id: 'fotones',
    titulo: 'La potencia es contar fotones',
    temas: ['Fotones: potencia e intensidad'],
    pieza: 'fis-fotones',
    juega: {
      consigna: 'Un láser verde de 532 nm apunta a un detector. Sube su potencia y mira cuántos paquetes de luz llegan.',
      voz: 'El tamaño de cada paquete no cambia; mira cuántos hay.',
      controles: [{ id: 'P', etiqueta: 'P', min: 1, max: 5, paso: 1, inicio: 2, unidad: 'mW', decimales: 0 }],
      dibujo: val => haz(532, 2 * val.P, `verde: ${f(HC / 532, 2)} eV cada uno`),
      lectura: val => [N, ` = ${cient(val.P * 1e-3 / fotJ(532))} fotones por segundo`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un láser rojo (650 nm) y uno azul (450 nm) tienen la misma potencia, 1 mW. ¿Cuál emite más fotones por segundo?',
      opciones: [
        { id: 'c', texto: 'El rojo', correcta: true },
        { id: 'azul', texto: 'El azul', error: 'FT-AZUL', siFuera: 'El azul lleva más energía por fotón, es cierto. Por eso necesita menos fotones para 1 mW.' },
        { id: 'igual', texto: 'Los dos igual', error: 'FT-IGUAL', siFuera: 'Igual número sería cierto con fotones de igual energía. Aquí difieren.' },
      ],
      dibujo: haz(450, 7, `azul, 1 mW: ${f(HC / 450, 2)} eV cada uno`),
      revelar: haz(650, 10, `rojo, 1 mW: ${f(HC / 650, 2)} eV cada uno`),
      coincide: `Coincide: el rojo manda unas ${f((HC / 450) / (HC / 650), 2)} veces más fotones por segundo.`,
    },
    mira: {
      datos: haz(650, 10, `rojo: ${f(HC / 650, 2)} eV`).datos,
      pasos: [
        { estado: {}, texto: 'Cada fotón rojo lleva hc/λ.', ecuacion: ['E = ', { frac: ['1240', '650'] }, ` = ${f(HC / 650, 2)} eV = `, ...cientP(fotJ(650)), ' J'] },
        { estado: {}, texto: '1 mW son 10⁻³ J cada segundo, repartidos en fotones.', ecuacion: [N, ' = ', { frac: ['P', 'E'] }, ' = ', ...cientP(1e-3 / fotJ(650)), ' por segundo'] },
        { estado: {}, texto: 'El azul lleva más por fotón: le bastan menos.', ecuacion: [N, ' azul = ', ...cientP(1e-3 / fotJ(450)), ' por segundo'] },
      ],
    },
    regla: {
      texto: 'La potencia de la luz es el número de fotones por segundo por la energía de cada uno. La intensidad reparte esa potencia en el área.',
      ecuacion: ['P = ', { llave: [N], nota: 'cuántos', color: 'c-d' }, ' ', { llave: ['h', fr], nota: 'cada fotón', color: 'c-h' }, '   ·   ', 'I = ', { frac: ['P', 'A'] }],
      condicion: 'luz de una sola frecuencia; N cuenta fotones por segundo. Con E en eV, se pasa a joules antes de dividir.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), P = r.de([1, 2, 5, 10, 50]), lam = r.de([405, 450, 532, 589, 650, 780]);
        const E = fotJ(lam), n = P * 1e-3 / E;
        return {
          pregunta: [`Un láser de ${f(lam, 0)} nm emite ${f(P, 0)} mW. ¿Cuántos fotones por segundo emite? (hc = 1240 eV·nm; 1 eV = 1,6 × 10⁻¹⁹ J)`],
          opciones: opciones(n, [
            { id: 'ev', valor: P * 1e-3 / (HC / lam), error: 'FT-EV', siFuera: 'Eso divide entre la energía en eV sin pasarla a joules.' },
            { id: 'por', valor: P * 1e-3 * E, error: 'FT-SIN-F', siFuera: 'Eso multiplica potencia por energía; se divide.' },
            { id: 'w', valor: P / E, error: 'FT-EV', siFuera: 'Eso usa mW como si fueran W: mil veces de más.' },
          ], x => `${cient(x)} por segundo`),
          solucion: { texto: 'Potencia entre la energía de un fotón, en joules.', ecuacion: [N, ' = ', ...cientP(P * 1e-3), ' / ', ...cientP(E), ' = ', ...cientP(n)] },
        };
      },
    },
  };

  // ---------- Idea 3: cuerpo negro y Planck ----------
  // Cambia: la temperatura · Permanece: la franja visible y la forma de campana asimétrica ·
  // Progresa: el pico que se corre hacia λ cortas al calentar · Se reserva: un horno a 1000 K (pico en infrarrojo) ·
  // Debe verse: λmáx · T es constante; y la curva cae a λ cortas porque la energía va en paquetes hf.
  const HCK = 1.4388e7; // hc/k en nm·K
  const planck = (l, Tk) => 1 / (Math.pow(l, 5) * (Math.exp(HCK / (l * Tk)) - 1));
  const curvaT = (Tk, desde) => {
    const lm = WIEN / Tk, pico = planck(lm, Tk), pts = [];
    for (let k = 1; k <= 90; k++) { const l = k * 3000 / 90; pts.push([l, planck(l, Tk) / pico]); }
    return { curva: { puntos: pts, color: 'h', desde }, punto: { x: lm, y: 1, color: 'd', rotulo: `λmáx = ${f(lm, 0)} nm`, guias: true, desde } };
  };
  const negro = (Tks, extra = {}) => {
    const cs = Tks.map(t => curvaT(t));
    return Object.assign({
      x: { min: 0, max: 3000, paso: 500, nombre: 'λ', unidad: 'nm', decimales: 0 },
      y: { min: 0, max: 1.2, paso: 0.4, nombre: 'I relativa', decimales: 1 },
      curvas: [{ puntos: [[400, 0], [400, 1.2]], color: 'tinta', discontinua: true, rotulo: 'visible', en: [720, 1.1] }, { puntos: [[700, 0], [700, 1.2]], color: 'tinta', discontinua: true }].concat(cs.map(c => c.curva)),
      puntos: cs.map(c => c.punto),
    }, extra);
  };
  const cuerpo = {
    id: 'cuerpo-negro',
    titulo: 'Más caliente, pico más corto',
    temas: ['Radiación del cuerpo negro y Planck'],
    pieza: 'ejes',
    juega: {
      consigna: 'La curva muestra cómo reparte su luz un cuerpo negro a cada temperatura, cada una relativa a su propio pico. Cambia la temperatura.',
      voz: 'Sigue al punto verde respecto de la franja visible.',
      controles: [{ id: 'T', etiqueta: 'T', color: 'c-h', min: 3000, max: 7000, paso: 1000, inicio: 5000, unidad: 'K', decimales: 0 }],
      dibujo: val => ({ datos: negro([val.T]), estado: {} }),
      lectura: val => [lmax, ` = 2,9 × 10⁶ / ${f(val.T, 0)} = ${f(WIEN / val.T, 0)}\u00a0nm`],
      minimo: 3,
      // Corre el pico a los lados: más a la izquierda (λ corta) pide más temperatura.
      arrastres: [{ id: 'pico', etiqueta: 'pico de la curva', color: 'c-h',
        donde: val => { const g = EJ().geometria(negro([val.T])); return { x: g.X(WIEN / val.T), y: g.Y(1) }; },
        mover: (pt, val) => ({ T: WIEN / Math.max(1, EJ().geometria(negro([val.T])).Xi(pt.x)) }) }],
    },
    predice: {
      pregunta: ['Un horno de cerámica está a ', T, ' = 1000 K. ¿En qué zona del espectro está el pico de su radiación?'],
      opciones: [
        { id: 'c', texto: 'En el infrarrojo', correcta: true },
        { id: 'rojo', texto: 'En el rojo visible: se ve rojizo', error: 'CN-ROJO', siFuera: 'El brillo rojizo que vemos es la cola visible. El pico está más allá, en λ larga.' },
        { id: 'uv', texto: 'En el ultravioleta', error: 'CN-UV', siFuera: 'El ultravioleta sería el pico de algo mucho más caliente que el Sol.' },
        { id: 'nada', texto: 'No emite: no está en llamas', error: 'CN-POR', siFuera: 'Todo cuerpo con temperatura emite. A 1000 K, casi todo en infrarrojo.' },
      ],
      dibujo: { datos: negro([]), estado: {} },
      revelar: { datos: negro([1000]), estado: {} },
      coincide: 'Coincide: 2,9 × 10⁶ / 1000 = 2900 nm, lejos de la franja visible.',
    },
    mira: {
      datos: negro([5800], { curvas: negro([5800]).curvas.map((c, i) => Object.assign({}, c, { desde: i < 2 ? 0 : 1 })), puntos: [Object.assign({}, curvaT(5800).punto, { desde: 2 })] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'El Sol se parece a un cuerpo negro a unos 5800 K.', ecuacion: [T, ' = 5800 K'] },
        { estado: { corte: 2 }, texto: 'Su pico cae en el visible: por eso vemos esa luz.', ecuacion: [lmax, ' = ', { frac: [['2,9 × ', diez(6), ' nm·K'], '5800 K'] }, ` = ${f(WIEN / 5800, 0)} nm`] },
        { estado: { corte: 2 }, texto: 'Planck: la energía va en paquetes hf; los de λ corta son escasos.', ecuacion: ['E = h', fr] },
      ],
    },
    regla: {
      texto: 'Un cuerpo negro más caliente emite con el pico a menor longitud de onda. La curva sale de suponer energía en paquetes hf.',
      ecuacion: [lmax, ' · ', T, ' = 2,9 × ', diez(-3), ' m·K', '   ·   ', 'E = ', { llave: ['h', fr], nota: 'un paquete', color: 'c-h' }],
      condicion: 'cuerpo ideal que absorbe toda la luz; T en kelvin. Los cuerpos reales se acercan a esta curva.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), casos = [['una estrella roja', 3000], ['el filamento de un foco', 2900], ['el Sol', 5800], ['una estrella azul', 10000], ['la piel humana', 310], ['una brasa', 1200]];
        const [que, Tk] = casos[s % casos.length], lm = WIEN / Tk, pide = r.de(['l', 'T']);
        if (pide === 'l') return {
          pregunta: ['¿En qué longitud de onda tiene su pico ', que, ', a ', T, ` = ${f(Tk, 0)} K?`],
          opciones: opciones(lm, [
            { id: 'celsius', valor: WIEN / (Tk - 273), error: 'CN-CELSIUS', siFuera: 'Eso usa la temperatura en °C; Wien pide kelvin.' },
            { id: 'por', valor: Tk * 2.9, error: 'CN-POR', siFuera: 'Eso multiplica; a más temperatura, el pico es más corto.' },
            { id: 'mil', valor: lm * 1000, error: 'ES-UNIDAD', siFuera: 'Eso tiene mil veces de más: revisa las unidades de b.' },
          ], x => `${f(x, 0)} nm`),
          solucion: { texto: 'b entre la temperatura absoluta.', ecuacion: [lmax, ' = 2,9 × ', diez(6), ` / ${f(Tk, 0)} = ${f(lm, 0)} nm`] },
        };
        return {
          pregunta: ['El pico de la radiación de ', que, ` está en `, lmax, ` = ${f(lm, 0)} nm. ¿A qué temperatura está?`],
          opciones: opciones(Tk, [
            { id: 'celsius', valor: Tk - 273, error: 'CN-CELSIUS', siFuera: 'Ese resultado está en °C; Wien da kelvin.' },
            { id: 'por', valor: lm * 2.9, error: 'CN-POR', siFuera: 'Eso multiplica; T y λmáx son inversos.' },
            { id: 'mil', valor: Tk * 1000, error: 'ES-UNIDAD', siFuera: 'Eso tiene mil veces de más.' },
          ], x => `${f(x, 0)} K`),
          solucion: { texto: 'b entre λmáx.', ecuacion: [T, ' = 2,9 × ', diez(6), ` / ${f(lm, 0)} = ${f(Tk, 0)} K`] },
        };
      },
    },
  };

  // ---------- Idea 4: rayos X y láser, un fotón por salto ----------
  // Cambia: el voltaje del tubo de rayos X · Permanece: hc = 1240 eV·nm · Progresa: el borde λmín que se corre ·
  // Se reserva: la emisión estimulada del láser (un fotón idéntico) · Debe verse: la energía de un fotón es la energía
  // del salto que lo produce: eV en el tubo, E₂ − E₁ en el láser.
  const espectroX = (kv, extra = {}) => {
    const lm = HC / kv, pts = [];
    let mx = 0;
    for (let k = 0; k <= 80; k++) { const l = k * 120 / 80; mx = Math.max(mx, l > lm ? (l / lm - 1) / (l * l) : 0); }
    for (let k = 0; k <= 80; k++) { const l = k * 120 / 80; pts.push([l, l > lm ? (l / lm - 1) / (l * l) / mx : 0]); }
    return Object.assign({
      x: { min: 0, max: 120, paso: 20, nombre: 'λ', unidad: 'pm', decimales: 0 },
      y: { min: 0, max: 1.2, paso: 0.4, nombre: 'I relativa', decimales: 1 },
      curvas: [{ puntos: pts, color: 'i' }],
      puntos: [{ x: lm, y: 0, color: 'd', rotulo: `λmín = ${f(lm, 1)} pm`, desde: extra.desdeMin || 0 }],
    }, extra.datos || {});
  };
  const niveles = (dos) => ({
    datos: {
      min: 0, max: 2.5, paso: 0.5, cada: 1, variable: 'E (eV)', color: 'd', filas: 3, decimales: 1,
      elementos: [{ tipo: 'punto', x: 0, color: 'tinta', rotulo: 'E₁', fila: 0 }, { tipo: 'punto', x: 1.96, color: 'tinta', rotulo: 'E₂', fila: 0 },
        { tipo: 'salto', a: 1.96, b: 0, color: 'd', rotulo: dos ? 'fotón que llega' : 'fotón que llega: 633 nm', fila: 1 }]
        .concat(dos ? [{ tipo: 'salto', a: 1.96, b: 0, color: 'd', rotulo: 'fotón copia: 633 nm, misma fase', fila: 2 }] : []),
    }, estado: {},
  });
  const rayosX = {
    id: 'rayos-x-laser',
    titulo: 'Un fotón por cada salto',
    temas: ['Rayos X', 'Láser'],
    pieza: 'ejes',
    juega: {
      consigna: 'En un tubo de rayos X, electrones acelerados por un voltaje frenan contra un metal. Cambia el voltaje y mira dónde empieza el espectro.',
      voz: 'Mira el borde izquierdo de la curva.',
      controles: [{ id: 'V', etiqueta: 'V', color: 'c-i', min: 20, max: 60, paso: 10, inicio: 30, unidad: 'kV', decimales: 0 }],
      dibujo: val => ({ datos: espectroX(val.V), estado: {} }),
      lectura: val => [lmin, ' = 1240 / ', V, ` = ${f(HC / val.V, 1)}\u00a0pm`],
      minimo: 3,
      // Corre el borde λmín: más cerca de 0 pide más voltaje.
      arrastres: [{ id: 'borde', etiqueta: 'borde λ mínima del espectro', color: 'c-i',
        donde: val => { const g = EJ().geometria(espectroX(val.V)); return { x: g.X(HC / val.V), y: g.Y(0) }; },
        mover: (pt, val) => ({ V: HC / Math.max(1, EJ().geometria(espectroX(val.V)).Xi(pt.x)) }) }],
    },
    predice: {
      pieza: 'recta',
      pregunta: 'En un láser de helio-neón, un fotón de 633 nm pasa junto a un átomo excitado y provoca que emita. ¿Cómo es el fotón nuevo?',
      opciones: [
        { id: 'c', texto: 'Idéntico: igual λ, dirección y fase', correcta: true },
        { id: 'azar', texto: 'De cualquier color y dirección', error: 'LS-AZAR', siFuera: 'Así es la emisión espontánea, la de un foco. La estimulada copia al fotón que llega.' },
        { id: 'doble', texto: 'Con el doble de energía', error: 'LS-DOBLE', siFuera: 'Se duplica la luz, no la energía de cada fotón: los dos llevan E₂ − E₁.' },
        { id: 'absorbe', texto: 'Ninguno: el átomo lo absorbe', error: 'LS-ABSORBE', siFuera: 'Lo absorbería un átomo en E₁. Este ya está arriba, en E₂.' },
      ],
      dibujo: niveles(false),
      revelar: niveles(true),
      coincide: 'Coincide: así se suman fotones iguales y el haz del láser crece.',
    },
    mira: {
      datos: espectroX(40, { desdeMin: 2 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Con 40 kV, cada electrón llega con 40 000 eV.', ecuacion: ['E = e', V, ' = 4 × ', diez(4), ' eV'] },
        { estado: { corte: 2 }, texto: 'Como máximo, da toda su energía a un solo fotón: ese es λmín.', ecuacion: [lmin, ' = ', { frac: ['1240 eV·nm', '40 000 eV'] }, ' = 31 pm'] },
        { estado: { corte: 2 }, texto: 'Al frenar de a pocos da fotones de menos energía: espectro continuo.', ecuacion: ['λ > ', lmin] },
        { estado: { corte: 2 }, texto: 'En el láser, el salto E₂ − E₁ fija una sola λ.', ecuacion: ['λ = ', { frac: ['hc', ['E₂ − E₁']] }] },
      ],
    },
    regla: {
      texto: 'Un fotón lleva la energía del salto que lo produce. En rayos X, como máximo eV; en un láser, exactamente E₂ − E₁, copiada por emisión estimulada.',
      ecuacion: [lmin, ' = ', { frac: ['hc', ['e', V]] }, '   ·   ', 'λ láser = ', { frac: ['hc', 'E₂ − E₁'] }],
      condicion: 'el láser necesita más átomos en E₂ que en E₁ (inversión de población); si no, absorbe más de lo que emite.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const kv = r.de([20, 25, 31, 40, 50, 62, 80, 100]), lm = HC / kv;
          return {
            pregunta: ['Un tubo de rayos X trabaja con ', V, ` = ${f(kv, 0)} kV. ¿Cuál es la longitud de onda mínima de sus rayos X? (hc = 1240 eV·nm)`],
            dibujo: { datos: espectroX(Math.min(kv, 100), { datos: { puntos: [] } }), estado: {} },
            opciones: opciones(lm, [
              { id: 'nm', valor: lm * 1000, error: 'RX-UNIDAD', siFuera: 'Eso olvida que son kilovoltios: mil veces de más.' },
              { id: 'por', valor: HC * kv / 1000, error: 'RX-POR', siFuera: 'Eso multiplica; a más voltaje, λ más corta.' },
              { id: 'mitad', valor: lm / 2, error: 'LS-DOBLE', siFuera: 'Eso duplica la energía del fotón; el máximo es eV.' },
            ], x => `${f(x, 1)} pm`),
            solucion: { texto: 'hc entre la energía del electrón.', ecuacion: [lmin, ` = 1240 / ${f(kv, 0)} = ${f(lm, 1)} pm`], dibujo: { datos: espectroX(Math.min(kv, 100)), estado: {} } },
          };
        }
        const dE = r.de([1.17, 1.55, 1.96, 2.33, 2.76, 3.1]), lam = HC / dE;
        return {
          pregunta: [`En un láser, el salto entre los niveles E₂ y E₁ es de ${f(dE, 2)} eV. ¿Qué longitud de onda emite? (hc = 1240 eV·nm)`],
          opciones: opciones(lam, [
            { id: 'doble', valor: lam / 2, error: 'LS-DOBLE', siFuera: 'Eso duplica la energía del fotón; cada uno lleva E₂ − E₁.' },
            { id: 'por', valor: HC * dE, error: 'RX-POR', siFuera: 'Eso multiplica; λ es hc entre la energía.' },
            { id: 'inv', valor: dE / HC * 1e6, error: 'ES-INVERSA', siFuera: 'Eso divide al revés.' },
          ], x => `${f(x, 0)} nm`),
          solucion: { texto: 'hc entre el salto de energía.', ecuacion: [`λ = 1240 / ${f(dE, 2)} = ${f(lam, 0)} nm`] },
        };
      },
    },
  };

  // ---------- Idea 5: relatividad, el tiempo propio ----------
  // Cambia: la rapidez de la nave · Permanece: el reloj de la nave y la curva de γ ·
  // Progresa: el punto que sube por la curva al acercarse a c · Se reserva: el reloj de la astronauta (para ella, normal) ·
  // Debe verse: γ casi no cambia a rapideces comunes y se dispara cerca de c; cada uno mide su tiempo propio.
  const gam = b => 1 / Math.sqrt(1 - b * b);
  const curvaG = (pts, extra = {}) => {
    const c = [];
    for (let k = 0; k <= 60; k++) { const b = k * 0.95 / 60; c.push([b, gam(b)]); }
    return Object.assign({
      x: { min: 0, max: 1, paso: 0.2, nombre: 'v/c', decimales: 1, color: 'h' },
      y: { min: 1, max: 3.4, paso: 0.4, nombre: 'γ', decimales: 1 },
      curvas: [{ puntos: c, color: 'tinta' }, { puntos: [[1, 1], [1, 3.4]], color: 'tinta', discontinua: true, rotulo: 'c', en: [0.93, 3.2] }],
      puntos: pts,
    }, extra);
  };
  const relatividad = {
    id: 'relatividad',
    titulo: 'Cada reloj mide su tiempo',
    temas: ['Relatividad especial (solo San Marcos)'],
    pieza: 'ejes',
    juega: {
      consigna: 'Una nave pasa junto a la Tierra. Cambia su rapidez y lee cuánto dura, para la Tierra, un segundo del reloj de la nave.',
      voz: 'Fíjate en lo poco que cambia γ hasta la mitad de c.',
      controles: [{ id: 'b', etiqueta: 'v', color: 'c-h', min: 0, max: 0.9, paso: 0.1, inicio: 0.5, unidad: 'c', decimales: 1 }],
      dibujo: val => ({ datos: curvaG([{ x: val.b, y: gam(val.b), color: 'o', rotulo: `γ = ${f(gam(val.b), 3)}`, guias: true }]), estado: {} }),
      lectura: val => ['1\u00a0s de la nave dura ', f(gam(val.b), 3), ' s para la Tierra'],
      minimo: 3,
      // Corre el punto por la curva de γ: a la derecha, más cerca de c.
      arrastres: [{ id: 'punto', etiqueta: 'punto sobre la curva de γ', color: 'c-h',
        donde: val => { const g = EJ().geometria(curvaG([])); return { x: g.X(val.b), y: g.Y(gam(val.b)) }; },
        mover: pt => ({ b: EJ().geometria(curvaG([])).Xi(pt.x) }) }],
    },
    predice: {
      pregunta: 'Una nave pasa a 0,6c. Para la Tierra, sus relojes van 1,25 veces más lento. ¿Qué nota la astronauta al mirar su propio reloj?',
      opciones: [
        { id: 'c', texto: 'Nada raro: para ella marcha normal', correcta: true },
        { id: 'lento', texto: 'Que va 1,25 veces más lento', error: 'RE-OPINION', siFuera: 'Ese es el resultado que mide la Tierra. Ella está quieta respecto de su reloj.' },
        { id: 'rapido', texto: 'Que va 1,25 veces más rápido', error: 'RE-INVERSO', siFuera: 'Rápido o lento se compara entre marcos; su reloj, en su marco, es el tiempo propio.' },
        { id: 'opinion', texto: 'Depende de cómo quiera verlo', error: 'RE-OPINION', siFuera: 'Cada marco mide algo distinto, pero con reglas fijas: no es opinión.' },
      ],
      dibujo: { datos: curvaG([{ x: 0.6, y: 1.25, color: 'o', rotulo: 'γ = 1,25', guias: true }]), estado: {} },
      revelar: { datos: curvaG([{ x: 0.6, y: 1.25, color: 'o', rotulo: 'Tierra: γ = 1,25', guias: true }], { curvas: curvaG([]).curvas.concat([{ puntos: [[0, 1], [0.01, 1]], color: 'i', rotulo: 'ella, con su reloj: γ = 1', en: [0.03, 2.9] }]) }), estado: {} },
      coincide: 'Coincide: en su marco, la astronauta está quieta y su reloj mide su tiempo propio.',
    },
    mira: {
      datos: curvaG([{ x: 0.6, y: 1.25, color: 'o', rotulo: 'γ = 1,25', guias: true, desde: 1 }]),
      pasos: [
        { estado: { corte: 1 }, texto: 'A 0,6c, el factor de Lorentz vale 1,25.', ecuacion: ['γ = ', { frac: ['1', { raiz: ['1 − ', { sup: ['0,6', '2'] }] }] }, ' = ', { frac: ['1', f(Math.sqrt(1 - 0.36), 1)] }, ` = ${f(gam(0.6), 2)}`] },
        { estado: { corte: 1 }, texto: 'El reloj de la nave marca 4 s: tiempo propio.', ecuacion: [dt0, ' = 4 s'] },
        { estado: { corte: 1 }, texto: 'Para la Tierra ese tramo dura más.', ecuacion: [dt, ' = γ ', dt0, ' = 5 s'] },
        { estado: { corte: 1 }, texto: 'La nave de 10 m se mide más corta en la dirección del viaje.', ecuacion: ['L = ', { frac: [{ sub: ['L', '0'] }, 'γ'] }, ' = 8 m'] },
      ],
    },
    regla: {
      texto: 'Un intervalo que no se mide en reposo con el reloj se alarga en el factor γ; una longitud en la dirección del viaje se acorta en γ.',
      ecuacion: [dt, ' = γ ', { llave: [dt0], nota: 'tiempo propio', color: 'c-i' }, '   ·   ', 'L = ', { frac: [{ sub: ['L', '0'] }, 'γ'] }, '   ·   ', 'γ = 1 / ', { raiz: ['1 − ', { sup: [vv, '2'] }, '/', { sup: ['c', '2'] }] }],
      condicion: 'marcos inerciales. Δt₀ y L₀ los mide quien viaja junto al reloj o a la regla.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), [b, bTxt] = r.de([[0.6, '0,6'], [0.8, '0,8'], [0.28, '0,28']]), g = gam(b);
        if (s % 2 === 0) {
          const t0 = r.de([2, 6, 12, 24, 48]);
          return {
            pregunta: ['Una nave viaja a ', vv, ` = ${bTxt}c. Su reloj marca `, dt0, ` = ${f(t0, 0)} min. ¿Cuánto dura ese viaje para la Tierra?`],
            opciones: opciones(t0 * g, [
              { id: 'inv', valor: t0 / g, error: 'RE-INVERSO', siFuera: 'Eso divide entre γ: así se acortan las longitudes, no los tiempos.' },
              { id: 'cuad', valor: t0 * g * g, error: 'RE-CUADRADO', siFuera: 'Eso multiplica dos veces por γ.' },
              { id: 'igual', valor: t0, error: 'RE-OPINION', siFuera: 'Ese es el tiempo propio, el que mide la nave.' },
            ], x => `${f(x, 2)} min`),
            solucion: { texto: `γ = ${f(g, 3)}; el tiempo se alarga.`, ecuacion: [dt, ` = ${f(g, 3)} · ${f(t0, 0)} = ${f(t0 * g, 2)} min`] },
          };
        }
        const L0 = r.de([10, 25, 50, 100]);
        return {
          pregunta: [`Una nave de ${f(L0, 0)} m (medida en reposo) pasa a `, vv, ` = ${bTxt}c. ¿Qué largo le mide la Tierra?`],
          opciones: opciones(L0 / g, [
            { id: 'inv', valor: L0 * g, error: 'RE-INVERSO', siFuera: 'Eso multiplica por γ: así se alargan los tiempos, no las longitudes.' },
            { id: 'cuad', valor: L0 / (g * g), error: 'RE-CUADRADO', siFuera: 'Eso divide dos veces entre γ.' },
            { id: 'igual', valor: L0, error: 'RE-OPINION', siFuera: 'Ese es el largo propio, medido en la nave.' },
          ], x => `${f(x, 2)} m`),
          solucion: { texto: `γ = ${f(g, 3)}; la longitud se acorta.`, ecuacion: [`L = ${f(L0, 0)} / ${f(g, 3)} = ${f(L0 / g, 2)} m`] },
        };
      },
    },
  };

  // ---------- Idea 6: el principio de incertidumbre ----------
  // Cambia: cuán bien se ubica al electrón (Δx) · Permanece: ħ y la masa del electrón ·
  // Progresa: la curva que se dispara al apretar Δx · Se reserva: una pelota, para la que Δv es despreciable ·
  // Debe verse: precisar la posición dispersa la velocidad; no es un defecto del instrumento.
  const dvMin = (dxNm, m = ME) => HBAR / (2 * m * dxNm * 1e-9);
  const curvaI = (pts, extra = {}) => {
    const c = [];
    for (let k = 0; k <= 60; k++) { const x = 0.18 + k * (2 - 0.18) / 60; c.push([x, dvMin(x) / 1000]); }
    return Object.assign({
      x: { min: 0, max: 2, paso: 0.4, nombre: 'Δx', unidad: 'nm', decimales: 1, color: 'i' },
      y: { min: 0, max: 350, paso: 50, nombre: 'Δv mín', unidad: 'km/s', decimales: 0, color: 'o' },
      curvas: [{ puntos: c, color: 'o' }],
      puntos: pts,
    }, extra);
  };
  const incertidumbre = {
    id: 'incertidumbre',
    titulo: 'Ubicar más es saber menos',
    temas: ['Principio de incertidumbre'],
    pieza: 'ejes',
    juega: {
      consigna: 'Un electrón está encerrado en una región de ancho Δx. Achica esa región y lee la menor dispersión posible de su velocidad.',
      voz: 'Mira qué pasa con la curva cuando Δx se acerca a cero.',
      controles: [{ id: 'x', etiqueta: 'Δx', color: 'c-i', min: 0.2, max: 2, paso: 0.2, inicio: 1, unidad: 'nm', decimales: 1 }],
      dibujo: val => ({ datos: curvaI([{ x: val.x, y: dvMin(val.x) / 1000, color: 'o', rotulo: `${f(dvMin(val.x) / 1000, 0)} km/s`, guias: true }]), estado: {} }),
      lectura: val => [dv, ` mín = ${f(dvMin(val.x) / 1000, 0)}\u00a0km/s`],
      minimo: 3,
      // Corre el punto por la curva: a la izquierda, el electrón está más encerrado.
      arrastres: [{ id: 'punto', etiqueta: 'punto sobre la curva (ancho Δx)', color: 'c-i',
        donde: val => { const g = EJ().geometria(curvaI([])); return { x: g.X(val.x), y: g.Y(dvMin(val.x) / 1000) }; },
        mover: pt => ({ x: EJ().geometria(curvaI([])).Xi(pt.x) }) }],
    },
    predice: {
      pregunta: 'Ubicas un electrón y una pelota de 0,1 kg, los dos con Δx = 1 nm. ¿En cuál importa la dispersión mínima de su velocidad?',
      opciones: [
        { id: 'c', texto: 'Solo en el electrón', correcta: true },
        { id: 'pelota', texto: 'En la pelota: es más grande', error: 'IN-DIRECTA', siFuera: 'Más masa da más cantidad de movimiento, pero Δv = Δp/m: la masa la hace diminuta.' },
        { id: 'igual', texto: 'En los dos por igual', error: 'IN-DIRECTA', siFuera: 'El mínimo de Δp es igual para los dos; Δv no, porque sus masas son muy distintas.' },
        { id: 'ninguno', texto: 'En ninguno, con un buen instrumento', error: 'IN-INSTRUMENTO', siFuera: 'Un mejor instrumento quita errores de medida. Este límite viene del propio estado.' },
      ],
      dibujo: { datos: curvaI([]), estado: {} },
      revelar: { datos: curvaI([{ x: 1, y: dvMin(1) / 1000, color: 'o', rotulo: `electrón: ${f(dvMin(1) / 1000, 0)} km/s`, guias: true }, { x: 1, y: 0, color: 'i', rotulo: `pelota: ${cient(dvMin(1, 0.1))} m/s` }]), estado: {} },
      coincide: 'Coincide: para la pelota la dispersión es tan chica que no se nota; para el electrón, enorme.',
    },
    mira: {
      datos: curvaI([{ x: 1, y: dvMin(1) / 1000, color: 'o', rotulo: `${f(dvMin(1) / 1000, 0)} km/s`, guias: true, desde: 2 }]),
      pasos: [
        { estado: { corte: 1 }, texto: 'El producto de las dos dispersiones tiene un piso.', ecuacion: [dx, ' · Δp ≥ ', { frac: ['ħ', '2'] }, ' = ', ...cientP(HBAR / 2, 1), ' J·s'] },
        { estado: { corte: 2 }, texto: 'Con Δx = 1 nm, el menor Δp posible:', ecuacion: ['Δp = ', { frac: [['1,055 × ', diez(-34)], ['2 · ', diez(-9)]] }, ' = ', ...cientP(HBAR / 2e-9, 1), ' kg·m/s'] },
        { estado: { corte: 2 }, texto: 'Para el electrón, eso es una dispersión enorme de velocidad.', ecuacion: [dv, ' = ', { frac: ['Δp', 'mₑ'] }, ` ≈ ${f(dvMin(1) / 1000, 0)} km/s`] },
      ],
    },
    regla: {
      texto: 'No se puede preparar un estado con posición y cantidad de movimiento tan definidas como uno quiera: el producto de sus dispersiones tiene un mínimo.',
      ecuacion: [dx, ' · Δp ≥ ', { llave: [{ frac: ['ħ', '2'] }], nota: 'el piso' }, '   ·   ', 'ħ = ', { frac: ['h', '2π'] }],
      condicion: 'Δx y Δp son dispersiones del estado de la partícula. Vale aunque el instrumento sea perfecto.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), [que, m, mTxt] = r.de([['un electrón', ME, '9,11 × 10⁻³¹ kg'], ['un protón', 1.67e-27, '1,67 × 10⁻²⁷ kg']]);
        const xs = r.de([0.1, 0.5, 1, 2, 5]), v = dvMin(xs, m);
        return {
          pregunta: [`Ubicas ${que} (m = ${mTxt}) con `, dx, ` = ${f(xs, 1)} nm. ¿Cuál es la menor dispersión posible de su velocidad? (ħ = 1,055 × 10⁻³⁴ J·s)`],
          opciones: opciones(v, [
            { id: 'sin2', valor: v * 2, error: 'IN-SIN-2', siFuera: 'Eso olvida el 2 de ħ/2.' },
            { id: 'h', valor: v * 2 * Math.PI, error: 'IN-H', siFuera: 'Eso usa h en vez de ħ = h/2π.' },
            { id: 'p', valor: v * m, error: 'IN-DIRECTA', siFuera: 'Ese es Δp; falta dividir entre la masa.' },
          ], x => `${cient(x)} m/s`),
          solucion: { texto: 'Δp mínimo entre la masa.', ecuacion: [dv, ' = 1,055 × ', diez(-34), ' / (2 · ', ...cientP(m), ' kg · ', ...cientP(xs * 1e-9), ' m) = ', ...cientP(v), ' m/s'] },
        };
      },
    },
  };

  // Mesas del laboratorio.
  const METALES = [['cesio', 2.1], ['potasio', 2.2], ['sodio', 2.3], ['calcio', 2.9], ['zinc', 4.3]];
  const phiDe = m => METALES.find(x => x[0] === m)[1];
  const dosRectas = val => {
    const f0 = m => phiDe(m) / eV(1), linea = (m, c, disc) => ({ puntos: [[f0(m), 0], [14, eV(14) - phiDe(m)]], color: c, discontinua: disc, rotulo: m, en: [Math.min(12.2, f0(m) + 0.6), Math.min(3.6, eV(Math.min(12.2, f0(m) + 0.6)) - phiDe(m)) + 0.5] });
    const ka = eV(val.f) - phiDe(val.a), kb = eV(val.f) - phiDe(val.b);
    return {
      x: { min: 0, max: 14, paso: 2, nombre: 'f', unidad: '×10¹⁴ Hz', decimales: 0, color: 'h' },
      y: { min: 0, max: 4, paso: 1, nombre: 'Kmáx', unidad: 'eV', decimales: 0, color: 'o' },
      curvas: [linea(val.a, 'o', false), linea(val.b, 'o', true), { puntos: [[val.f, 0], [val.f, 4]], color: 'h', discontinua: true }],
      puntos: [ka > 0 ? { x: val.f, y: ka, color: 'o' } : null, kb > 0 ? { x: val.f, y: kb, color: 'o' } : null].filter(Boolean),
    };
  };
  const lamparaLibre = val => {
    const E = eV(val.f), ph = phiDe(val.m), Km = Math.max(0, E - ph), sale = E > ph && val.b > 0;
    return { datos: { fotones: 3 * val.b, onda: ondaPx(3e8 / (val.f * 1e14) * 1e9), electrones: sale ? val.b : 0, k: Km / 4, rotulos: { foton: `hf = ${f(E, 2)} eV`, placa: `${val.m}: φ = ${f(ph, 1)} eV`, e: `Kmáx = ${f(Km, 2)} eV`, nota: 'no salen electrones' } }, estado: {} };
  };
  const hornoSol = Tk => {
    const d = negro([Tk]), sol = curvaT(5800).curva;
    d.curvas = d.curvas.concat([Object.assign({}, sol, { color: 'tinta', discontinua: true, rotulo: 'Sol', en: [90, 0.55] })]);
    return d;
  };

  return {
    unidad: 'fisica.fisica-moderna',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/fis-fotones.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/recta.js'],
    // Laboratorio: dos metales en la recta Kmáx–f (el umbral de cada uno y la misma pendiente h), la lámpara con el
    // metal a elección y el brillo en 0, y el horno que se vuelve estrella comparado con el Sol.
    laboratorio: [
      {
        id: 'dos-metales', titulo: 'Dos metales, dos rectas', pieza: 'ejes',
        consigna: 'Elige dos metales y corre la frecuencia con el punto. ¿De cuál salen electrones primero? Compara las pendientes.',
        controles: [
          { id: 'a', etiqueta: 'Metal 1', inicio: 'cesio', opciones: METALES.map(([m]) => ({ valor: m, texto: m })) },
          { id: 'b', etiqueta: 'Metal 2', inicio: 'zinc', opciones: METALES.map(([m]) => ({ valor: m, texto: m })) },
          { id: 'f', etiqueta: 'f (× 10¹⁴ Hz)', color: 'c-h', min: 2, max: 14, paso: 0.5, inicio: 8, unidad: '', decimales: 1 },
        ],
        dibujo: val => ({ datos: dosRectas(val), estado: {} }),
        lectura: val => { const k = m => eV(val.f) - phiDe(m); return [`${val.a}: ${k(val.a) > 0 ? f(k(val.a), 2) + ' eV' : 'nada'} · ${val.b}: ${k(val.b) > 0 ? f(k(val.b), 2) + ' eV' : 'nada'}`]; },
        arrastres: [{ id: 'frecuencia', etiqueta: 'marca de la frecuencia', color: 'c-h',
          donde: val => { const g = EJ().geometria(dosRectas(val)); return { x: g.X(val.f), y: g.Y(0) }; },
          mover: (pt, val) => ({ f: EJ().geometria(dosRectas(val)).Xi(pt.x) }) }],
      },
      {
        id: 'lampara-libre', titulo: 'Lámpara, metal y brillo', pieza: 'fis-fotones',
        consigna: 'Elige el metal, la frecuencia y el brillo, también brillo 0. Busca el color más bajo que todavía arranca electrones.',
        controles: [
          { id: 'm', etiqueta: 'Metal', inicio: 'sodio', opciones: METALES.map(([m]) => ({ valor: m, texto: m })) },
          { id: 'f', etiqueta: 'f (× 10¹⁴ Hz)', color: 'c-h', min: 4, max: 15, paso: 0.5, inicio: 7, unidad: '', decimales: 1 },
          { id: 'b', etiqueta: 'Brillo', color: 'c-d', min: 0, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0 },
        ],
        dibujo: val => lamparaLibre(val),
        lectura: val => { const km = eV(val.f) - phiDe(val.m); return [`${val.m}: hf = ${f(eV(val.f), 2)}\u00a0eV · `, K, km > 0 && val.b ? ` = ${f(km, 2)}\u00a0eV` : ': no salen']; },
      },
      {
        id: 'horno-estrella', titulo: 'Del horno a la estrella', pieza: 'ejes',
        consigna: 'Corre el pico de la curva desde 1000 K hasta 10 000 K. La curva gris es el Sol, para comparar.',
        controles: [{ id: 'T', etiqueta: 'T', color: 'c-h', min: 1000, max: 10000, paso: 500, inicio: 3000, unidad: 'K', decimales: 0 }],
        dibujo: val => ({ datos: hornoSol(val.T), estado: {} }),
        lectura: val => [T, ` = ${f(val.T, 0)}\u00a0K → `, lmax, ` = ${f(WIEN / val.T, 0)}\u00a0nm`],
        arrastres: [{ id: 'pico', etiqueta: 'pico de la curva', color: 'c-h',
          donde: val => { const g = EJ().geometria(hornoSol(val.T)); return { x: g.X(WIEN / val.T), y: g.Y(1) }; },
          mover: (pt, val) => ({ T: WIEN / Math.max(1, EJ().geometria(hornoSol(val.T)).Xi(pt.x)) }) }],
      },
    ],
    historia: {
      texto: 'A fines del siglo XIX, medir con precisión la luz de los cuerpos calientes mostró que los modelos fallaban. En 1900, Planck reprodujo las curvas suponiendo energía en paquetes. En 1905, Einstein llevó la idea a la luz misma para explicar el fotoeléctrico, y ese mismo año publicó la relatividad especial.',
      pregunta: '¿Qué experimento mostrarías para convencer a alguien de que la luz llega en paquetes?',
      fuente: { titulo: 'Max Planck Society — What did Max Planck discover?', url: 'https://www.mpg.de/19252749/what-did-max-planck-discover' },
    },
    ideas: [fotoelectrico, fotones, cuerpo, rayosX, relatividad, incertidumbre],
  };
});
