/*
 * Teoría de «Fluidos» (fisica.fluidos). Molde de docs/teoria.md; forma copiada de
 * contenido/teoria/fisica/movimiento-rectilineo.js.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 11), precisiones de física del expediente y
 * docs/investigacion/fluidos-calor-termodinamica-ideas-erroneas.md (códigos F1–F15).
 * Colores (regla 4): p presión turquesa (c-i), h profundidad verde (c-d), F fuerza y empuje rojo (c-h),
 * v velocidad naranja (c-o). ρ, A, V y γ van en tinta.
 * g = 10 m/s² en toda la unidad (lo dice cada regla).
 * Estado: completa (14 nov 2026): seis ideas que cubren los siete temas del catálogo.
 * Códigos nuevos (hipótesis, sin fuente empírica): FL-ANGOSTO, FL-SIN-G, FL-KPA, FL-OTRO-LADO, FL-MISMO-NIVEL,
 * FL-RESTA, FL-BARO-IGUAL, FL-BARO-INV, PA-IGUAL, PA-INV, PA-CUADRADO, AR-PESO, AR-FONDO, AR-TOTAL,
 * TS-UNA, TS-EMPUJE, TS-PESO, BE-APRIETA, BE-IGUAL, BE-DIAMETRO, BE-INV.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver que la presión de un líquido depende de la profundidad y que esa idea explica tubos, prensas y empuje.
 *   Persona y condiciones: postulante de 4.º y 5.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: calcula una presión, un desnivel, una fuerza de prensa, un empuje y una rapidez en un tubo.
 *   Orden de atención: 1.º el recipiente y sus puntos · 2.º la lectura en vivo · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿por qué la forma del recipiente no importa y la profundidad sí?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const p = { v: 'c-i', t: 'p' }, h = { v: 'c-d', t: 'h' }, F = { v: 'c-h', t: 'F' }, E = { v: 'c-h', t: 'E' }, v = { v: 'c-o', t: 'v' };
  const p0 = { sub: [p, '0'] };
  const G = 10, RHO_W = 1000;
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

  // ---------- Idea 1: igual profundidad, igual presión ----------
  // Cambia: la profundidad del punto y el líquido · Permanece: los tres vasos de formas distintas, llenos al mismo nivel ·
  // Progresa: la cota h, que crece hacia abajo desde la superficie · Se reserva: el fondo de los tres vasos ·
  // Debe verse: la misma presión en los tres puntos, aunque haya distinta cantidad de líquido encima.
  const NIV = 0.8;
  const LIQ = { 800: 'aceite', 1000: 'agua', 1200: 'salmuera', 13600: 'mercurio' };
  const tonoDe = rho => (rho >= 13600 ? 3 : rho >= 1100 ? 2 : 1);
  const tresVasos = (hh, rho, conRot = true, o = {}) => ({
    alto: 1, unidad: 'm',
    recipientes: ['embudo', 'recto', 'botella'].map((forma, k) => ({ tipo: 'vaso', forma, nivel: NIV, tono: tonoDe(rho), rotulo: 'ABC'[k] })),
    puntos: [0, 1, 2].map(k => ({ k, y: NIV - hh, color: 'i', rotulo: conRot ? `${f(rho * G * hh / 1000, 1)} kPa` : undefined, desde: o.desdeP || 0 })),
    cotas: [{ k: 0, y1: NIV - hh, y2: NIV, texto: 'h', color: 'd', desde: o.desdeC || 0 }],
  });
  const hidrostatica = {
    id: 'presion-profundidad',
    titulo: 'Igual profundidad, igual presión',
    temas: ['Densidad y presión', 'Presión hidrostática y atmosférica'],
    pieza: 'fis-vasos',
    juega: {
      consigna: 'Tres vasos de formas distintas tienen líquido hasta la misma altura. Baja el punto y cambia el líquido.',
      voz: 'Compara los tres puntos. ¿Qué número cambia y qué número se repite?',
      controles: [
        { id: 'h', etiqueta: 'h', color: 'c-d', min: 0.1, max: 0.8, paso: 0.1, inicio: 0.3, unidad: 'm', decimales: 1 },
        { id: 'rho', etiqueta: 'Líquido', opciones: [{ valor: 800, texto: 'aceite' }, { valor: 1000, texto: 'agua' }, { valor: 1200, texto: 'salmuera' }], inicio: 1000 },
      ],
      dibujo: val => ({ datos: tresVasos(val.h, val.rho), estado: {} }),
      lectura: val => [p, ` = ${f(val.rho * G * val.h / 1000, 1)} kPa en los tres, más la del aire`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Los tres vasos tienen agua hasta 0,8 m. El de la izquierda tiene mucha más agua. ¿En cuál es mayor la presión del agua en el fondo?',
      opciones: [
        { id: 'c', texto: 'Es la misma en los tres', correcta: true },
        { id: 'mas-agua', texto: 'En A: tiene más agua encima', error: 'F2', siFuera: 'A tiene más agua, cierto. Pero las paredes inclinadas sostienen parte de su peso.' },
        { id: 'angosto', texto: 'En C: el agua está más apretada', error: 'FL-ANGOSTO', siFuera: 'Lo angosto sí cambia algo: la fuerza total en la tapa. La presión, no.' },
        { id: 'ancho', texto: 'En C: su fondo es más ancho', error: 'F7', siFuera: 'Un fondo más ancho recibe más fuerza total, cierto. La fuerza por cada m² es igual.' },
      ],
      dibujo: { datos: tresVasos(0.8, 1000, false), estado: {} },
      revelar: { datos: tresVasos(0.8, 1000, true), estado: {} },
      coincide: 'Coincide: los tres puntos están 0,8 m por debajo de la superficie. Eso es lo que cuenta.',
    },
    mira: {
      pieza: 'fis-vasos',
      datos: Object.assign(tresVasos(0.5, 1000, true, { desdeC: 1, desdeP: 3 }), { recipientes: [{ tipo: 'vaso', forma: 'recto', nivel: NIV, tono: 1 }], puntos: [{ k: 0, y: 0.3, color: 'i', rotulo: '5 kPa', desde: 3 }], cotas: [{ k: 0, y1: 0.3, y2: NIV, texto: 'h = 0,5 m', color: 'd', desde: 1 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Sobre cada m² del punto hay una columna de agua de 0,5 m.', ecuacion: [h, ' = 0,5 m'] },
        { estado: { corte: 2 }, texto: 'Esa columna pesa ρ·g·h por cada m²: masa = densidad × volumen.', ecuacion: ['m = ρ · V = 1000 · 0,5 = 500 kg por m²'] },
        { estado: { corte: 3 }, texto: 'Presión es fuerza entre área: 5000 N sobre 1 m².', ecuacion: [p, ' = ', { frac: [F, 'A'] }, ' = ρ g ', h, ' = 5000 Pa = 5 kPa'] },
        { estado: { corte: 3 }, texto: 'Encima del agua está el aire, que también aprieta.', ecuacion: [p, ' = ', p0, ' + ρ g ', h] },
      ],
    },
    regla: {
      texto: 'En un líquido en reposo, la presión crece con la profundidad: p = p₀ + ρgh. Puntos a la misma profundidad tienen la misma presión, sea cual sea la forma del recipiente.',
      ecuacion: [p, ' = ', p0, ' + ρ g ', h, '   ·   ', p, ' = ', { frac: [F, 'A'] }, '   ·   ρ = ', { frac: ['m', 'V'] }],
      condicion: 'líquido homogéneo y quieto; h, en vertical desde la superficie. p₀ es la del aire: unos 100 kPa en Lima.',
    },
    ahoraTu: {
      pieza: 'fis-vasos',
      generar(s) {
        const r = azar(s), rho = r.de([800, 1000, 1200]), H = r.de([0.6, 0.8, 1]), y = r.de([0.1, 0.2, 0.3]), hh = H - y;
        const pk = rho * G * hh / 1000;
        const datos = { alto: 1, unidad: 'm', recipientes: [{ tipo: 'vaso', forma: r.de(['embudo', 'botella', 'ancho']), nivel: H, tono: tonoDe(rho) }], puntos: [{ k: 0, y, color: 'i', rotulo: 'P' }], cotas: [{ k: 0, y1: 0, y2: y, texto: `${f(y, 1)} m`, color: 'd' }] };
        return {
          pregunta: `Un recipiente tiene ${LIQ[rho]} (ρ = ${f(rho)} kg/m³) hasta ${f(H, 1)} m. El punto P está a ${f(y, 1)} m del fondo. ¿Cuánto vale la presión del líquido en P? (g = 10 m/s²)`,
          dibujo: { datos, estado: {} },
          opciones: opciones(pk, [
            { id: 'fondo', valor: rho * G * y / 1000, error: 'F4', siFuera: `Eso mide h desde el fondo. La profundidad se cuenta desde la superficie: ${f(hh, 1)} m.` },
            { id: 'todo', valor: rho * G * H / 1000, error: 'F4', siFuera: 'Esa es la presión en el fondo; P está más arriba.' },
            { id: 'sin-g', valor: rho * hh / 1000, error: 'FL-SIN-G', siFuera: 'Eso olvida multiplicar por g: ρ·h no es todavía una presión.' },
          ], n => `${f(n, 1)} kPa`),
          solucion: {
            texto: `P está ${f(hh, 1)} m por debajo de la superficie.`,
            ecuacion: [p, ` = ${f(rho)} · 10 · ${f(hh, 1)} = ${f(rho * G * hh)} Pa = ${f(pk, 1)} kPa`],
            dibujo: { datos: Object.assign({}, datos, { cotas: [{ k: 0, y1: y, y2: H, texto: `h = ${f(hh, 1)} m`, color: 'd' }] }), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 2: vasos comunicantes, manómetro y barómetro ----------
  // Cambia: la columna de aceite y la ciudad del barómetro · Permanece: el agua del tubo en U y el mercurio ·
  // Progresa: el desnivel del agua y la altura de la columna de mercurio · Se reserva: la comparación del aceite con el agua ·
  // Debe verse: dos puntos a la misma altura en el mismo líquido conectado tienen la misma presión.
  const RHO_AC = 800, H0 = 0.45;
  const CIUDAD = { 1: { n: 'Lima', p: 101 }, 2: { n: 'Arequipa', p: 77 }, 3: { n: 'Juliaca', p: 64 } };
  const tuboU = (ha, rhoA = RHO_AC, o = {}) => {
    const dif = ha * rhoA / RHO_W, hL = H0 - dif / 2, hR = H0 + dif / 2;
    return {
      recipiente: { tipo: 'u', izq: [{ h: hL, tono: 2 }, { h: ha, tono: 1 }], der: [{ h: hR, tono: 2 }], rotulo: o.rotulo },
      dif, hL, hR,
    };
  };
  const columnaHg = pk => 0.76 * pk / 101;   // 76 cm de mercurio con 101 kPa (convención de academia)
  const figuraU = (ha, ciudad, o = {}) => {
    const u = tuboU(ha);
    const rec = [u.recipiente];
    if (ciudad) rec.push({ tipo: 'barometro', columna: columnaHg(CIUDAD[ciudad].p), rotulo: CIUDAD[ciudad].n });
    return {
      alto: 0.85, unidad: 'm', recipientes: rec,
      puntos: o.puntos === false ? [] : [{ k: 0, y: u.hL, lado: 'izq', rotulo: 'A', color: 'i', desde: o.desdeP || 0 }, { k: 0, y: u.hL, lado: 'der', rotulo: 'B', color: 'i', desde: o.desdeP || 0 }],
      cotas: o.cotas === false ? [] : [{ k: 0, y1: u.hL, y2: u.hL + ha, texto: `${f(ha * 100)} cm`, color: 'd', lado: 'izq', desde: o.desdeC || 0 }, { k: 0, y1: u.hL, y2: u.hR, texto: `${f(u.dif * 100)} cm`, color: 'd', lado: 'der', desde: o.desdeC2 || 0 }],
    };
  };
  const comunicantes = {
    id: 'vasos-comunicantes',
    titulo: 'Misma altura, misma presión',
    temas: ['Manómetro, barómetro y vasos comunicantes'],
    pieza: 'fis-vasos',
    juega: {
      consigna: 'A la izquierda, un tubo en U con agua: echa aceite en una rama. A la derecha, un barómetro de mercurio: cámbialo de ciudad.',
      voz: 'Mira cuánto sube el agua del otro lado y cuánto mide el mercurio.',
      controles: [
        { id: 'ha', etiqueta: 'aceite', min: 0.1, max: 0.4, paso: 0.05, inicio: 0.2, unidad: 'm', decimales: 2 },
        { id: 'c', etiqueta: 'Ciudad', opciones: [{ valor: 1, texto: 'Lima' }, { valor: 2, texto: 'Arequipa' }, { valor: 3, texto: 'Juliaca' }], inicio: 1 },
      ],
      dibujo: val => ({ datos: figuraU(val.ha, val.c), estado: {} }),
      lectura: val => [`Desnivel del agua: ${f(val.ha * RHO_AC / RHO_W * 100)} cm · mercurio: ${f(columnaHg(CIUDAD[val.c].p) * 100, 0)} cm`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En un tubo en U con agua se echan 10 cm de aceite (ρ = 800 kg/m³) en una rama. ¿Cuánto más alta queda la superficie del aceite que la del agua en la otra rama?',
      opciones: [
        { id: 'c', texto: '2 cm', correcta: true },
        { id: 'igual', texto: '0 cm: quedan al mismo nivel', error: 'FL-MISMO-NIVEL', siFuera: 'El mismo nivel vale con un solo líquido. Con dos densidades, la columna liviana es más alta.' },
        { id: 'diez', texto: '10 cm', error: 'FL-OTRO-LADO', siFuera: 'Eso supone que el agua no se movió. El agua del otro lado sube 8 cm.' },
        { id: 'ocho', texto: '8 cm', error: 'FL-RESTA', siFuera: 'Ese es el desnivel del agua entre las dos ramas, no el del aceite.' },
      ],
      dibujo: { datos: Object.assign(figuraU(0.1, 0, { puntos: false, cotas: false }), {}), estado: {} },
      revelar: { datos: Object.assign(figuraU(0.1, 0, { cotas: false }), { cotas: [{ k: 0, y1: tuboU(0.1).hL, y2: tuboU(0.1).hL + 0.1, texto: '10 cm', color: 'd', lado: 'izq' }, { k: 0, y1: tuboU(0.1).hR, y2: tuboU(0.1).hL + 0.1, texto: '2 cm', color: 'd', lado: 'der' }] }), estado: {} },
      coincide: 'Coincide: 10 cm de aceite pesan como 8 cm de agua. El aceite sobresale 2 cm.',
    },
    mira: {
      pieza: 'fis-vasos',
      datos: figuraU(0.1, 1, { desdeP: 1, desdeC: 2, desdeC2: 3 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'A y B están a la misma altura y en el mismo líquido conectado.', ecuacion: [{ sub: [p, 'A'] }, ' = ', { sub: [p, 'B'] }] },
        { estado: { corte: 2 }, texto: 'Sobre A hay 10 cm de aceite.', ecuacion: [{ sub: [p, 'A'] }, ' = 800 · 10 · 0,10 = 800 Pa'] },
        { estado: { corte: 3 }, texto: 'Sobre B, el agua que subió: la misma presión pide 8 cm.', ecuacion: [h, ' = ', { frac: ['800', '1000 · 10'] }, ' = 0,08 m'] },
        { estado: { corte: 3 }, texto: 'El barómetro es lo mismo: el aire de afuera equilibra la columna.', ecuacion: [p0, ' = ', { sub: ['ρ', 'Hg'] }, ' g ', h, '   →   76 cm en Lima'] },
      ],
    },
    regla: {
      texto: 'En un líquido quieto y conectado, los puntos a la misma altura tienen la misma presión. Por eso las columnas se equilibran: la más densa queda más baja.',
      ecuacion: [{ sub: ['ρ', '1'] }, { sub: [h, '1'] }, ' = ', { sub: ['ρ', '2'] }, { sub: [h, '2'] }, '   ·   ', p0, ' = ', { sub: ['ρ', 'Hg'] }, ' g ', h],
      condicion: 'los dos puntos están en el mismo líquido, sin otro líquido entre ellos, y las ramas están abiertas al mismo aire.',
    },
    ahoraTu: {
      pieza: 'fis-vasos',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const ha = r.de([0.1, 0.15, 0.2, 0.25, 0.3]), rhoA = r.de([600, 700, 800, 900]), dif = ha * rhoA / RHO_W;
          const u = tuboU(ha, rhoA);
          return {
            pregunta: `En un tubo en U con agua se echan ${f(ha * 100)} cm de un líquido de ρ = ${f(rhoA)} kg/m³ en una rama. ¿Cuánto más alta queda el agua de la otra rama que la del lado del líquido?`,
            dibujo: { datos: { alto: 0.85, unidad: 'm', recipientes: [u.recipiente] }, estado: {} },
            opciones: opciones(dif * 100, [
              { id: 'igual', valor: ha * 100, error: 'FL-OTRO-LADO', siFuera: 'Ese desnivel sería cierto si el líquido tuviera la densidad del agua.' },
              { id: 'inv', valor: ha * RHO_W / rhoA * 100, error: 'FL-BARO-INV', siFuera: 'Ese cociente está al revés: la columna de agua, más densa, es más corta.' },
              { id: 'resta', valor: (ha - dif) * 100, error: 'FL-RESTA', siFuera: 'Esa es la parte que el líquido sobresale del agua.' },
            ], n => `${f(n)} cm`),
            solucion: { texto: 'Las dos columnas sobre el nivel de la interfaz pesan lo mismo por m².', ecuacion: [{ sub: [h, 'agua'] }, ` = ${f(ha * 100)} · ${f(rhoA)} / 1000 = ${f(dif * 100)} cm`] },
          };
        }
        const pk = r.de([60, 64, 70, 77, 85, 90, 101]), hc = pk * 1000 / (13600 * G);
        return {
          pregunta: `En una ciudad la presión del aire es ${f(pk)} kPa. ¿Qué altura alcanza la columna de un barómetro de mercurio (ρ = 13 600 kg/m³)? (g = 10 m/s²)`,
          dibujo: { datos: { alto: 1, unidad: 'm', recipientes: [{ tipo: 'barometro', columna: hc }] }, estado: {} },
          opciones: opciones(hc * 100, [
            { id: 'igual', valor: 76, error: 'FL-BARO-IGUAL', siFuera: '76 cm es la altura a nivel del mar; aquí el aire aprieta distinto.' },
            { id: 'sin-g', valor: pk * 1000 / 13600 * 100, error: 'FL-SIN-G', siFuera: 'Eso olvida dividir entre g.' },
            { id: 'inv', valor: 76 * 101 / pk, error: 'FL-BARO-INV', siFuera: 'Con menos presión del aire, la columna baja, no sube.' },
          ], n => `${f(n, 1)} cm`),
          solucion: { texto: 'El aire de afuera sostiene la columna: p₀ = ρgh.', ecuacion: [h, ` = ${f(pk * 1000)} / (13 600 · 10) = ${f(hc, 3)} m`] },
        };
      },
    },
  };

  // ---------- Idea 3: Pascal y la prensa ----------
  // Cambia: la razón de áreas y la fuerza en el émbolo chico · Permanece: el líquido encerrado ·
  // Progresa: la flecha de F₂, que crece con A₂ · Se reserva: cuánto baja el émbolo chico ·
  // Debe verse: la presión se transmite igual; la fuerza se multiplica, el recorrido se divide.
  const prensa = (F1, k, o = {}) => ({
    alto: 1, unidad: 'm',
    recipientes: [{ tipo: 'prensa', a1: 1, a2: k, nivel: 0.55, F1: { texto: o.sin1 ? '' : `${f(F1)} N`, largo: Math.max(14, F1 * 0.6) }, F2: o.sin2 ? undefined : { texto: `${f(F1 * k)} N`, largo: Math.min(120, Math.max(14, F1 * k * 0.6)) } }],
  });
  const pascal = {
    id: 'prensa-hidraulica',
    titulo: 'La prensa multiplica la fuerza',
    temas: ['Principio de Pascal'],
    pieza: 'fis-vasos',
    juega: {
      consigna: 'Empuja el émbolo chico. Elige la fuerza y cuántas veces más grande es el área del émbolo grande.',
      voz: 'Las dos flechas son fuerzas. ¿Qué tienen en común los dos émbolos?',
      controles: [
        { id: 'F1', etiqueta: 'F₁', color: 'c-h', min: 10, max: 40, paso: 10, inicio: 20, unidad: 'N', decimales: 0 },
        { id: 'k', etiqueta: 'A₂ / A₁', min: 2, max: 5, paso: 1, inicio: 3, decimales: 0 },
      ],
      dibujo: val => ({ datos: prensa(val.F1, val.k), estado: {} }),
      lectura: val => [{ sub: [F, '2'] }, ` = ${f(val.F1)} · ${f(val.k)} = ${f(val.F1 * val.k)} N`],
      minimo: 3,
    },
    predice: {
      pregunta: 'En una prensa, el émbolo grande tiene 5 veces el área del chico. Para que el grande suba 1 cm, ¿cuánto tiene que bajar el émbolo chico?',
      opciones: [
        { id: 'c', texto: '5 cm', correcta: true },
        { id: 'igual', texto: '1 cm, lo mismo', error: 'PA-IGUAL', siFuera: 'Sería cierto con áreas iguales. El líquido que baja se reparte en un área 5 veces mayor.' },
        { id: 'inv', texto: '0,2 cm', error: 'PA-INV', siFuera: 'Esa razón es la de las fuerzas al revés; el recorrido del chico es mayor.' },
        { id: 'cuad', texto: '25 cm', error: 'PA-CUADRADO', siFuera: 'Eso usa 5 dos veces. El volumen que se mueve es el mismo en los dos lados.' },
      ],
      dibujo: { datos: prensa(20, 5, { sin2: true }), estado: {} },
      revelar: { datos: prensa(20, 5), estado: {} },
      coincide: 'Coincide: el volumen que baja en el chico (A₁ · 5 cm) es el que sube en el grande (5A₁ · 1 cm).',
    },
    mira: {
      pieza: 'fis-vasos',
      datos: prensa(20, 5),
      pasos: [
        { estado: {}, texto: 'El émbolo chico aprieta el líquido: 20 N sobre A₁.', ecuacion: [p, ' = ', { frac: [{ sub: [F, '1'] }, { sub: ['A', '1'] }] }] },
        { estado: {}, texto: 'El líquido encerrado lleva esa presión a todas partes.', ecuacion: [p, ' = ', { frac: [{ sub: [F, '2'] }, { sub: ['A', '2'] }] }] },
        { estado: {}, texto: 'Con 5 veces el área, la fuerza es 5 veces mayor.', ecuacion: [{ sub: [F, '2'] }, ' = 20 · 5 = 100 N'] },
        { estado: {}, texto: 'El precio: el chico recorre 5 veces más. El trabajo no cambia.', ecuacion: ['20 N · 5 cm = 100 N · 1 cm'] },
      ],
    },
    regla: {
      texto: 'Un cambio de presión en un líquido encerrado llega igual a todos sus puntos. En la prensa, la fuerza crece con el área y el recorrido baja igual.',
      ecuacion: [{ frac: [{ sub: [F, '1'] }, { sub: ['A', '1'] }] }, ' = ', { frac: [{ sub: [F, '2'] }, { sub: ['A', '2'] }] }, '   ·   ', { sub: ['A', '1'] }, { sub: ['d', '1'] }, ' = ', { sub: ['A', '2'] }, { sub: ['d', '2'] }],
      condicion: 'líquido encerrado que no se comprime, émbolos a la misma altura y sin rozamiento.',
    },
    ahoraTu: {
      pieza: 'fis-vasos',
      generar(s) {
        const r = azar(s), k = r.de([4, 5, 8, 10]), F2 = r.de([800, 1000, 2000, 4000]), F1 = F2 / k;
        const fig = (t1, t2) => ({ datos: { alto: 1, unidad: 'm', recipientes: [{ tipo: 'prensa', a1: 1, a2: k, nivel: 0.55, F1: { texto: t1, largo: 20 }, F2: { texto: t2, largo: 60 } }] }, estado: {} });
        if (s % 2 === 0) return {
          pregunta: `Una prensa tiene émbolos de áreas A₁ y A₂ = ${f(k)}A₁. ¿Qué fuerza hay que hacer en el chico para levantar ${f(F2)} N en el grande?`,
          dibujo: fig('?', `${f(F2)} N`),
          opciones: opciones(F1, [
            { id: 'por', valor: F2 * k, error: 'PA-INV', siFuera: 'Eso multiplica por la razón de áreas: el chico necesita menos fuerza.' },
            { id: 'igual', valor: F2, error: 'PA-IGUAL', siFuera: 'La misma fuerza valdría con áreas iguales.' },
            { id: 'cuad', valor: F2 / (k * k), error: 'PA-CUADRADO', siFuera: 'Eso divide dos veces; el área ya es la razón que cuenta.' },
          ], n => `${f(n)} N`),
          solucion: { texto: 'La presión es la misma en los dos émbolos.', ecuacion: [{ sub: [F, '1'] }, ` = ${f(F2)} / ${f(k)} = ${f(F1)} N`] },
        };
        const dr = r.de([0.5, 1, 2, 3]);
        return {
          pregunta: `Una prensa tiene A₂ = ${f(k)}A₁. Si el émbolo grande sube ${f(dr)} cm, ¿cuánto baja el chico?`,
          dibujo: fig('', ''),
          opciones: opciones(dr * k, [
            { id: 'igual', valor: dr, error: 'PA-IGUAL', siFuera: 'Igual recorrido valdría con áreas iguales.' },
            { id: 'inv', valor: dr / k, error: 'PA-INV', siFuera: 'El chico recorre más, no menos: mueve el mismo volumen con menos área.' },
            { id: 'cuad', valor: dr * k * k, error: 'PA-CUADRADO', siFuera: 'Eso multiplica dos veces por la razón de áreas.' },
          ], n => `${f(n)} cm`),
          solucion: { texto: 'El volumen que baja en un lado sube en el otro.', ecuacion: [{ sub: ['d', '1'] }, ` = ${f(k)} · ${f(dr)} = ${f(dr * k)} cm`] },
        };
      },
    },
  };

  // ---------- Idea 4: Arquímedes ----------
  // Cambia: el material del bloque y el líquido · Permanece: el bloque, siempre de 1 litro ·
  // Progresa: la parte sumergida y la flecha de empuje · Se reserva: dos bloques de igual tamaño bajo el agua ·
  // Debe verse: el empuje es el peso del líquido desalojado; no depende de cuánto pesa el bloque.
  const VB = 0.001, LADO = 0.2;   // 1 litro: en la figura, un bloque de 0,2 de alto
  const MAT = { 250: 'corcho', 600: 'madera', 900: 'hielo', 2700: 'aluminio' };
  const flota = (rb, rl) => {
    const frac = Math.min(1, rb / rl), Wn = rb * VB * G, En = rl * G * VB * frac;
    return { frac, Wn, En, hunde: rb > rl };
  };
  const vasoBloque = (rb, rl, o = {}) => {
    const q = flota(rb, rl), niv = 0.62;
    const base = q.hunde ? 0 : niv - LADO * q.frac;
    const esc = 2.2;   // px por N en las dos flechas
    return {
      alto: 1, unidad: 'm',
      recipientes: [{ tipo: 'vaso', forma: 'ancho', nivel: niv, tono: tonoDe(rl), bloque: { ancho: 0.24, alto: LADO, base, rotulo: o.rot || MAT[rb], E: o.sinE ? undefined : { largo: q.En * esc, texto: `E = ${f(q.En, 1)} N` }, W: { largo: q.Wn * esc, texto: `W = ${f(q.Wn, 1)} N` } } }],
    };
  };
  const arquimedes = {
    id: 'empuje',
    titulo: 'El empuje es el líquido desalojado',
    temas: ['Principio de Arquímedes'],
    pieza: 'fis-vasos',
    juega: {
      consigna: 'Pon un bloque de 1 litro en el líquido. Cambia su material y el líquido, y compara el empuje E con el peso W.',
      voz: 'Fíjate qué parte del bloque queda bajo la superficie.',
      controles: [
        { id: 'rb', etiqueta: 'Bloque', opciones: [{ valor: 250, texto: 'corcho' }, { valor: 600, texto: 'madera' }, { valor: 900, texto: 'hielo' }, { valor: 2700, texto: 'aluminio' }], inicio: 600 },
        { id: 'rl', etiqueta: 'Líquido', opciones: [{ valor: 800, texto: 'aceite' }, { valor: 1000, texto: 'agua' }], inicio: 1000 },
      ],
      dibujo: val => ({ datos: vasoBloque(val.rb, val.rl), estado: {} }),
      lectura: val => { const q = flota(val.rb, val.rl); return q.hunde ? ['Se hunde · ', E, ` = ${f(q.En, 1)} N < W`] : [`Flota con ${f(q.frac * 100, 0)} % sumergido · `, E, ' = W']; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Un bloque de aluminio y uno de madera, del mismo tamaño, se mantienen bajo el agua, sumergidos por completo. ¿Cuál recibe más empuje?',
      opciones: [
        { id: 'c', texto: 'Los dos reciben el mismo empuje', correcta: true },
        { id: 'pesado', texto: 'El de aluminio, porque pesa más', error: 'F10', siFuera: 'El aluminio sí pesa más. Pero el agua empuja según el volumen que desaloja.' },
        { id: 'madera', texto: 'El de madera, porque flota', error: 'F13', siFuera: 'Suelta, la madera sube, cierto. Eso es porque pesa menos, no porque reciba más empuje.' },
        { id: 'fondo', texto: 'El que esté más abajo', error: 'F12', siFuera: 'Abajo la presión es mayor, pero en todas sus caras: la diferencia no cambia.' },
      ],
      dibujo: { datos: vasoBloque(2700, 1000, { sinE: true }), estado: {} },
      revelar: { datos: { alto: 1, unidad: 'm', recipientes: [{ tipo: 'vaso', forma: 'ancho', nivel: 0.62, tono: 1, bloque: { ancho: 0.24, alto: LADO, base: 0.3, rotulo: 'madera', E: { largo: 22, texto: 'E = 10 N' }, W: { largo: 13.2, texto: 'W = 6 N' } } }] }, estado: {} },
      coincide: 'Coincide: los dos desalojan 1 litro de agua, que pesa 10 N. Lo que cambia es su peso.',
    },
    mira: {
      pieza: 'fis-vasos',
      datos: vasoBloque(600, 1000),
      pasos: [
        { estado: {}, texto: 'El bloque de madera pesa 6 N: 0,6 kg por litro.', ecuacion: ['W = ρ V g = 600 · 0,001 · 10 = 6 N'] },
        { estado: {}, texto: 'Flota en equilibrio: el empuje iguala al peso.', ecuacion: [E, ' = W = 6 N'] },
        { estado: {}, texto: 'El empuje es el peso del agua desalojada.', ecuacion: [E, ' = ', { sub: ['ρ', 'agua'] }, ' g ', { sub: ['V', 'sum'] }] },
        { estado: {}, texto: 'Desaloja 0,6 litros: el 60 % del bloque está bajo el agua.', ecuacion: [{ sub: ['V', 'sum'] }, ' = ', { frac: ['6', '1000 · 10'] }, ' = 0,0006 m³'] },
      ],
    },
    regla: {
      texto: 'Un líquido empuja hacia arriba a lo que tiene dentro con una fuerza igual al peso del líquido desalojado. Si el cuerpo flota, el empuje iguala su peso.',
      ecuacion: [E, ' = ', { sub: ['ρ', 'líquido'] }, ' g ', { sub: ['V', 'sumergido'] }, '   ·   flota: ', E, ' = W'],
      condicion: 'V es solo el volumen bajo la superficie. Flota si su densidad media es menor que la del líquido.',
    },
    ahoraTu: {
      pieza: 'fis-vasos',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const rb = r.de([300, 400, 500, 600, 700, 900]), rl = r.de([1000, 1200]), fr = rb / rl;
          return {
            pregunta: `Un bloque de densidad ${f(rb)} kg/m³ flota en un líquido de ${f(rl)} kg/m³. ¿Qué fracción de su volumen queda sumergida?`,
            dibujo: { datos: vasoBloque(rb, rl, { rot: '?', sinE: true }), estado: {} },
            opciones: opciones(fr * 100, [
              { id: 'fuera', valor: (1 - fr) * 100, error: 'AR-TOTAL', siFuera: 'Esa es la parte que queda afuera del líquido.' },
              { id: 'inv', valor: rl / rb * 100, error: 'AR-PESO', siFuera: 'Ese cociente está al revés: nunca puede pasar de 100 %.' },
              { id: 'todo', valor: 100, error: 'AR-TOTAL', siFuera: 'Todo sumergido sería cierto si fuera igual de denso que el líquido.' },
            ], n => `${f(n, 1)} %`),
            solucion: { texto: 'Flotando, el empuje iguala al peso: las densidades dan la fracción.', ecuacion: [{ frac: [{ sub: ['V', 'sum'] }, 'V'] }, ` = ${f(rb)} / ${f(rl)} = ${f(fr * 100, 1)} %`] },
          };
        }
        const m = r.de([2, 3, 4, 5]), rb = r.de([2000, 2500, 4000, 5000]), V = m / rb, En = RHO_W * G * V, Ap = m * G - En;
        return {
          pregunta: `Una piedra de ${f(m)} kg y densidad ${f(rb)} kg/m³ cuelga de un dinamómetro, sumergida por completo en agua. ¿Cuánto marca el dinamómetro? (g = 10 m/s²)`,
          opciones: opciones(Ap, [
            { id: 'peso', valor: m * G, error: 'AR-PESO', siFuera: 'Ese es su peso en el aire; bajo el agua, el empuje ayuda a sostenerla.' },
            { id: 'empuje', valor: En, error: 'AR-TOTAL', siFuera: 'Ese es el empuje solo; el dinamómetro marca peso menos empuje.' },
            { id: 'suma', valor: m * G + En, error: 'F15', siFuera: 'El empuje va hacia arriba: se resta, no se suma.' },
          ], n => `${f(n, 1)} N`),
          solucion: { texto: 'Su volumen sale de m/ρ; el empuje es el peso de ese volumen de agua.', ecuacion: [E, ` = 1000 · 10 · ${f(V, 4)} = ${f(En, 1)} N   ·   ${f(m * G)} − ${f(En, 1)} = ${f(Ap, 1)} N`] },
        };
      },
    },
  };

  // ---------- Idea 5: tensión superficial ----------
  // Cambia: el largo del alambre y el líquido · Permanece: el marco con una película de dos caras ·
  // Progresa: la recta F–L · Se reserva: el clip que no se hunde · Debe verse: la superficie tira en proporción al largo del borde.
  const GAMMA = { 73: 'agua', 25: 'agua jabonosa' };
  const ejeTS = (lineas, extra = {}) => Object.assign({
    x: { min: 0, max: 10, paso: 2, nombre: 'L', unidad: 'cm', decimales: 0 },
    y: { min: 0, max: 16, paso: 4, nombre: 'F', unidad: 'mN', decimales: 0, color: 'h' },
    curvas: lineas.map(([g, rot, caras]) => ({ puntos: [[0, 0], [10, caras * g * 0.1]], color: 'h', rotulo: rot, discontinua: caras === 1 })),
  }, extra);
  const tension = {
    id: 'tension-superficial',
    titulo: 'La superficie tira como una piel',
    temas: ['Tensión superficial'],
    pieza: 'ejes',
    juega: {
      consigna: 'Un alambre deslizante cierra un marco con una película de líquido. Elige su largo y el líquido; la película tira de él.',
      voz: 'La película tiene dos caras, y las dos tiran del alambre.',
      controles: [
        { id: 'L', etiqueta: 'L', min: 2, max: 10, paso: 2, inicio: 4, unidad: 'cm', decimales: 0 },
        { id: 'g', etiqueta: 'Líquido', opciones: [{ valor: 73, texto: 'agua' }, { valor: 25, texto: 'jabonosa' }], inicio: 25 },
      ],
      dibujo: val => ({ datos: ejeTS([[val.g, GAMMA[val.g], 2]], { puntos: [{ x: val.L, y: 2 * val.g * val.L / 100, color: 'h', rotulo: `${f(2 * val.g * val.L / 100, 2)} mN`, guias: true }] }), estado: {} }),
      lectura: val => [F, ` = 2γL = ${f(2 * val.g * val.L / 100, 2)} mN`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Un clip de acero, más denso que el agua, puede quedar quieto sobre la superficie si se coloca con cuidado. ¿Qué lo sostiene?',
      opciones: [
        { id: 'c', texto: 'La superficie del agua, que tira como una piel', correcta: true },
        { id: 'empuje', texto: 'El empuje de Arquímedes', error: 'TS-EMPUJE', siFuera: 'El empuje existe, pero apenas desaloja agua: no alcanza para su peso.' },
        { id: 'liviano', texto: 'Es más liviano que el agua', error: 'TS-PESO', siFuera: 'Liviano sí es, pero más denso: si se hunde un poco, se va al fondo.' },
        { id: 'aire', texto: 'El aire que queda debajo', error: 'D7', siFuera: 'El aire no lo sostiene: sin la superficie intacta, el clip cae.' },
      ],
      dibujo: { datos: ejeTS([[73, 'agua', 2]]), estado: {} },
      revelar: { datos: ejeTS([[73, 'agua', 2]], { puntos: [{ x: 6, y: 2 * 73 * 6 / 100, color: 'h', rotulo: `${f(2 * 73 * 6 / 100, 2)} mN`, guias: true }], curvas: [{ puntos: [[0, 0], [10, 14.6]], color: 'h', rotulo: 'agua' }, { puntos: [[0, 5], [10, 5]], color: 'd', rotulo: 'peso del clip: 5 mN', discontinua: true }] }), estado: {} },
      coincide: 'Coincide: 6 cm de alambre tocan el agua por dos lados; la superficie tira hasta 8,76 mN, más que los 5 mN del clip.',
    },
    mira: {
      datos: ejeTS([], { y: { min: 0, max: 6, paso: 2, nombre: 'F', unidad: 'mN', decimales: 0, color: 'h' },
        curvas: [{ puntos: [[0, 0], [10, 2.5]], color: 'h', rotulo: 'una cara', discontinua: true, desde: 2 }, { puntos: [[0, 0], [10, 5]], color: 'h', rotulo: 'dos caras', en: [4, 2], desde: 3 }],
        puntos: [{ x: 8, y: 2, color: 'h', rotulo: '2 mN', guias: true, desde: 2, hasta: 2 }, { x: 8, y: 4, color: 'h', rotulo: '4 mN', guias: true, desde: 3 }] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Cada cara de la película tira del borde: γ newtons por metro.', ecuacion: ['γ = ', { frac: [F, 'L'] }, ' = 0,025 N/m'] },
        { estado: { corte: 2 }, texto: 'Una sola cara con 8 cm daría 2 mN: la línea discontinua.', ecuacion: [F, ' = 0,025 · 0,08 = 0,002 N'] },
        { estado: { corte: 3 }, texto: 'La película tiene dos caras: el doble.', ecuacion: [F, ' = 2 γ L = 4 mN'] },
      ],
    },
    regla: {
      texto: 'La superficie de un líquido tira de su borde con una fuerza proporcional al largo del borde. Ese cociente es la tensión superficial γ.',
      ecuacion: ['γ = ', { frac: [F, 'L'] }, '   ·   película de dos caras: ', F, ' = 2γL'],
      condicion: 'L es el largo del borde mojado; γ depende del líquido y de la temperatura (el jabón la baja).',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), g = r.de([25, 40, 50, 73]), L = r.de([3, 4, 5, 6, 8, 10]), dos = s % 2 === 0;
        const Fm = (dos ? 2 : 1) * g * L / 100;
        return {
          pregunta: dos
            ? `Un alambre de ${f(L)} cm cierra un marco con una película de líquido (γ = ${f(g / 1000, 3)} N/m). ¿Con qué fuerza tira la película del alambre?`
            : `Un aro de borde recto de ${f(L)} cm toca la superficie de un líquido (γ = ${f(g / 1000, 3)} N/m) por una sola cara. ¿Con qué fuerza tira la superficie?`,
          opciones: opciones(Fm, [
            { id: 'caras', valor: (dos ? 1 : 2) * g * L / 100, error: 'TS-UNA', siFuera: dos ? 'Eso cuenta una sola cara; la película tiene dos.' : 'Eso cuenta dos caras; aquí solo hay una.' },
            { id: 'cm', valor: Fm * 100, error: 'U1', siFuera: 'Eso usa L en cm sin pasar a metros.' },
            { id: 'div', valor: (dos ? 2 : 1) * g / 1000 / (L / 100) * 1000, error: 'TS-DIV', siFuera: 'Eso divide γ entre L; la fuerza es γ por L.' },
          ], n => `${f(n, 2)} mN`),
          solucion: { texto: dos ? 'Dos caras tiran del alambre.' : 'Una sola cara tira del borde.', ecuacion: [F, ` = ${dos ? '2 · ' : ''}${f(g / 1000, 3)} · ${f(L / 100, 2)} = ${f(Fm, 2)} mN`] },
        };
      },
    },
  };

  // ---------- Idea 6: caudal, continuidad y Bernoulli ----------
  // Cambia: cuánto se angosta el tubo y la rapidez de entrada · Permanece: el caudal que entra y el que sale ·
  // Progresa: la flecha de v en el tramo angosto y el desnivel de los tubitos · Se reserva: la presión en lo angosto ·
  // Debe verse: donde el agua va más rápido, la presión es menor.
  const tuboB = (v1, k, o = {}) => {
    const v2 = v1 * k, dp = 0.5 * RHO_W * (v2 * v2 - v1 * v1), h1 = 0.5, h2 = h1 - dp / (RHO_W * G);
    return { datos: { alto: 0.6, unidad: 'm', colores: { v: 'o' }, recipientes: [{ tipo: 'tubo', a1: k, a2: 1, v1: { texto: `${f(v1)} m/s`, largo: v1 * 20 }, v2: { texto: o.sinV2 ? '?' : `${f(v2)} m/s`, largo: v2 * 20 }, h1, h2: o.sinH2 ? h1 : h2 }] }, v2, dp, h2 };
  };
  const bernoulli = {
    id: 'bernoulli',
    titulo: 'Más rápido, menos presión',
    temas: ['Caudal, continuidad y Bernoulli (solo San Marcos)'],
    pieza: 'fis-vasos',
    juega: {
      consigna: 'El agua entra por la izquierda y pasa por un tramo angosto. Elige la rapidez de entrada y cuánto se angosta el tubo.',
      voz: 'Mira las dos flechas y la altura del agua en los tubitos.',
      controles: [
        { id: 'v1', etiqueta: 'v₁', color: 'c-o', min: 0.5, max: 1, paso: 0.25, inicio: 0.5, unidad: 'm/s', decimales: 2 },
        { id: 'k', etiqueta: 'A₁ / A₂', min: 1, max: 3, paso: 0.5, inicio: 2, decimales: 1 },
      ],
      dibujo: val => ({ datos: tuboB(val.v1, val.k).datos, estado: {} }),
      lectura: val => { const b = tuboB(val.v1, val.k); return [{ sub: [v, '2'] }, ` = ${f(b.v2)} m/s · Δp = ${f(b.dp / 1000, 2)} kPa`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Agua que fluye pasa de un tramo ancho a uno de la mitad del área. En el tramo angosto, ¿la presión del agua es mayor, igual o menor?',
      opciones: [
        { id: 'c', texto: 'Menor', correcta: true },
        { id: 'mayor', texto: 'Mayor: el agua va más apretada', error: 'BE-APRIETA', siFuera: 'Apretada parece, cierto. Pero el agua se acelera, y para acelerar la presión de atrás tiene que ser mayor.' },
        { id: 'igual', texto: 'Igual: pasa el mismo caudal', error: 'BE-IGUAL', siFuera: 'El caudal sí es el mismo. La presión cambia porque cambia la rapidez.' },
      ],
      dibujo: { datos: tuboB(1, 2, { sinV2: true, sinH2: true }).datos, estado: {} },
      revelar: { datos: tuboB(1, 2).datos, estado: {} },
      coincide: 'Coincide: el agua se acelera de 1 a 2 m/s, y la presión baja; el tubito de lo angosto queda más bajo.',
    },
    mira: {
      pieza: 'fis-vasos',
      datos: tuboB(1, 2).datos,
      pasos: [
        { estado: {}, texto: 'El agua no se acumula: el caudal que entra es el que pasa.', ecuacion: ['Q = ', { sub: ['A', '1'] }, { sub: [v, '1'] }, ' = ', { sub: ['A', '2'] }, { sub: [v, '2'] }] },
        { estado: {}, texto: 'Con la mitad del área, va al doble de rapidez.', ecuacion: [{ sub: [v, '2'] }, ' = 2 · 1 = 2 m/s'] },
        { estado: {}, texto: 'Ganar rapidez cuesta presión: Bernoulli.', ecuacion: [{ sub: [p, '1'] }, ' − ', { sub: [p, '2'] }, ' = ½ · 1000 · (2² − 1²) = 1500 Pa'] },
        { estado: {}, texto: 'Por eso el tubito del tramo angosto baja 15 cm.', ecuacion: [{ frac: ['1500', '1000 · 10'] }, ' = 0,15 m'] },
      ],
    },
    regla: {
      texto: 'El caudal se conserva: donde el tubo es angosto, el líquido va más rápido. Y a lo largo de la corriente, donde va más rápido, la presión es menor.',
      ecuacion: [{ sub: ['A', '1'] }, { sub: [v, '1'] }, ' = ', { sub: ['A', '2'] }, { sub: [v, '2'] }, '   ·   ', p, ' + ½ρ', { sup: [v, '2'] }, ' + ρg', h, ' = constante'],
      condicion: 'flujo estacionario, incompresible y sin viscosidad, siguiendo una misma línea de corriente. g = 10 m/s².',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), d1 = r.de([2, 3, 4, 6]), d2 = d1 / r.de([2, 3]), v1 = r.de([0.5, 1, 1.5, 2]);
        if (s % 2 === 0) {
          const v2 = v1 * (d1 / d2) ** 2;
          return {
            pregunta: `Agua entra a ${f(v1)} m/s por un tubo de ${f(d1)} cm de diámetro que se angosta a ${f(d2)} cm. ¿Con qué rapidez sale por el tramo angosto?`,
            opciones: opciones(v2, [
              { id: 'diam', valor: v1 * d1 / d2, error: 'BE-DIAMETRO', siFuera: 'Eso usa la razón de diámetros; el área va con el diámetro al cuadrado.' },
              { id: 'inv', valor: v1 * (d2 / d1) ** 2, error: 'BE-INV', siFuera: 'Eso la hace más lenta; en lo angosto va más rápido.' },
              { id: 'igual', valor: v1, error: 'BE-IGUAL', siFuera: 'La misma rapidez valdría si el tubo no se angostara.' },
            ], n => `${f(n)} m/s`),
            solucion: { texto: 'El caudal es igual; el área va con el diámetro al cuadrado.', ecuacion: [{ sub: [v, '2'] }, ` = ${f(v1)} · (${f(d1)}/${f(d2)})² = ${f(v2)} m/s`] },
          };
        }
        const k = r.de([2, 3]), v2 = v1 * k, dp = 0.5 * RHO_W * (v2 * v2 - v1 * v1);
        return {
          pregunta: `Agua pasa a ${f(v1)} m/s por un tramo ancho y a ${f(v2)} m/s por uno angosto, a la misma altura. ¿Cuánto menor es la presión en el tramo angosto?`,
          opciones: opciones(dp / 1000, [
            { id: 'sin-cuad', valor: 0.5 * RHO_W * (v2 - v1) / 1000, error: 'BE-IGUAL', siFuera: 'Eso resta rapideces sin elevarlas al cuadrado.' },
            { id: 'sin-medio', valor: RHO_W * (v2 * v2 - v1 * v1) / 1000, error: 'BE-INV', siFuera: 'Eso olvida el ½ de la energía cinética por volumen.' },
            { id: 'solo2', valor: 0.5 * RHO_W * v2 * v2 / 1000, error: 'BE-IGUAL', siFuera: 'Eso olvida que en el tramo ancho el agua ya se movía.' },
          ], n => `${f(n, 2)} kPa`),
          solucion: { texto: 'A la misma altura, lo que gana en ½ρv² lo pierde en presión.', ecuacion: [{ sub: [p, '1'] }, ' − ', { sub: [p, '2'] }, ` = ½ · 1000 · (${f(v2)}² − ${f(v1)}²) = ${f(dp)} Pa`] },
        };
      },
    },
  };

  return {
    unidad: 'fisica.fluidos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/fis-vasos.js', '/nucleo/kit/piezas/ejes.js'],
    historia: {
      texto: 'En 1644, Torricelli describió una columna de mercurio sostenida en un tubo invertido y la explicó por el peso del aire de afuera. En 1648, Pascal hizo comparar un barómetro al pie y en la cima de una montaña: arriba, la columna era más baja. La presión del aire se volvió algo que se mide.',
      pregunta: '¿Qué altura tendría la columna en Juliaca?',
      fuente: { titulo: 'Museo Galileo — Barometer', url: 'https://catalogue.museogalileo.it/indepth/Barometer.html' },
    },
    ideas: [hidrostatica, comunicantes, pascal, arquimedes, tension, bernoulli],
  };
});
