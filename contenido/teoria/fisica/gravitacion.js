/*
 * Teoría de «Gravitación universal» (fisica.gravitacion). Molde: docs/teoria.md y fisica.movimiento-rectilineo.
 * Fuente del contenido: docs/teoria/matriz/fisica.json (unidad 6): F = GMm/r² y g = GM/r² fuera de una masa
 * esférica, con r desde el centro; órbita circular v = √(GM/r); Kepler para elipses. Precisión del expediente: a un
 * radio dado hay una rapidez circular; otras rapideces dan elipses cerradas, no «órbitas que no cierran».
 * Colores (regla 4): distancias r y a turquesa (c-i); fuerza gravitatoria F naranja (c-o); campo g verde (c-d);
 * rapidez orbital v roja (c-h). El período T va en tinta.
 * Se trabaja en radios terrestres R y con g = 10 m/s² en la superficie, R ≈ 6400 km (redondeados, declarados).
 * Códigos de error: G1, G2, G3 y G6 de docs/investigacion/momento-gravitacion-ondas-ideas-erroneas.md (no son los G1–G4
 * de gráficas de cinemática). Nuevos (hipótesis, sin dato): GR-SUPERFICIE, GR-IGUAL, GR-POCA, GR-MASA, GR-LINEAL,
 * GR-CUAD, OR-ALTO, OR-IGUAL, OR-RAIZ, KP-LINEAL, KP-CUAD, KP-CUBO.
 * Estado: completa (14 nov 2026): cuatro ideas que cubren los cuatro temas del catálogo.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: cuatro relaciones de la gravedad, cada una jugada antes de preguntarla.
 *   Persona y condiciones: postulante de 4.º, celular de gama baja a 360 px, a veces sin conexión.
 *   Resultado observable: halla un peso a otra altura, g de otro planeta, la rapidez orbital y un período de Kepler.
 *   Orden de atención: 1.º el planeta y la flecha · 2.º la lectura en vivo · acción: el botón fijo · fondo: Tilo.
 *   Estados: juego sin tocar · predicción pendiente · coincide / no coincide · paso de mira · caso nuevo · «No sé».
 *   Duda que resuelve: ¿por qué flota un astronauta si la gravedad allá arriba casi no baja?
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const r_ = { v: 'c-i', t: 'r' }, a_ = { v: 'c-i', t: 'a' }, F = { v: 'c-o', t: 'F' }, g = { v: 'c-d', t: 'g' }, v = { v: 'c-h', t: 'v' };
  const G0 = 10, V0 = 8; // g en la superficie (m/s²) y rapidez orbital rasante (km/s), redondeadas
  const rad = d => d * Math.PI / 180;
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
  const en = (r, deg) => [r * Math.cos(rad(deg)), r * Math.sin(rad(deg))];
  const VISTA = { x0: -1.3, x1: 4.2, y0: -1.3, y1: 3.2 }, VISTA_C = { x0: -3.4, x1: 3.4, y0: -3.2, y1: 3.4 }, VISTA_O = { x0: -4.4, x1: 4.4, y0: -4.4, y1: 4.7 };
  const tierra = (rot = 'Tierra') => ({ c: [0, 0], r: 1, color: 'i', relleno: 0.12, rotulo: rot });
  const cuad = n => ({ sup: [n, '2'] });

  // Gesto directo (docs/teoria.md §4b): la manija vive en las coordenadas del lienzo (fis-lienzo.geometria, con los
  // mismos datos que dibuja la idea). El objeto se arrastra a lo largo de su radio: mover proyecta el dedo sobre él.
  const LZ = datos => Kit.piezas['fis-lienzo'].geometria(datos);
  const radial = (datos, deg) => {
    const g = LZ(datos);
    return {
      donde: rr => { const q = en(rr, deg); return { x: g.X(q[0]), y: g.Y(q[1]) }; },
      r: pt => g.Xi(pt.x) * Math.cos(rad(deg)) + g.Yi(pt.y) * Math.sin(rad(deg)),
    };
  };

  // ---------- Idea 1: la fuerza cae con el cuadrado de la distancia ----------
  // Cambia: la distancia al centro y la masa del objeto · Permanece: la Tierra · Progresa: la flecha de F, que se
  // achica a la cuarta parte al duplicar r · Se reserva: r medido desde el centro, no desde la superficie ·
  // Debe verse: a 2R el peso es la cuarta parte.
  const KF1 = 0.08, ANG1 = 40;
  function atraccion(rr, m, o = {}) {
    const Fv = m * G0 / (rr * rr), P = en(rr, ANG1);
    return {
      vista: VISTA, escalaF: KF1,
      alt: o.alt || `Objeto de ${m} kg a ${f(rr, 1)} R del centro de la Tierra: la atracción vale ${f(Fv, 1)} N, hacia el centro.`,
      discos: [tierra(), { c: P, r: 0.12 }],
      segmentos: [{ de: [0, 0], a: P, color: 'i', discontinua: true, texto: o.sinR ? undefined : `r = ${f(rr, 1)} R`, lado: -1 }],
      flechas: o.sinF ? [] : [{ de: P, d: [-Math.cos(rad(ANG1)) * Fv, -Math.sin(rad(ANG1)) * Fv], color: 'o', rotulo: `F = ${f(Fv, 0)} N`, lado: -1 }],
    };
  }
  const inversa = {
    id: 'cuadrado-inverso',
    titulo: 'Doble distancia, cuarta parte',
    temas: ['Ley de gravitación universal', 'Variación de g con la altura'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Aleja un objeto del centro de la Tierra (R es su radio) y elige su masa. Mira la atracción.',
      voz: 'Lleva el objeto de 1 R a 2 R. ¿Cuánto se achica F?',
      controles: [
        { id: 'r', etiqueta: 'r', color: 'c-i', min: 1, max: 4, paso: 0.5, inicio: 1, unidad: 'R', decimales: 1 },
        { id: 'm', etiqueta: 'm', min: 50, max: 150, paso: 50, inicio: 100, unidad: 'kg', decimales: 0 },
      ],
      dibujo: val => ({ datos: atraccion(val.r, val.m), estado: {} }),
      lectura: val => [F, ` = ${f(val.m * G0 / (val.r * val.r), 1)} N · `, g, ` = ${f(G0 / (val.r * val.r), 2)} m/s²`],
      minimo: 3,
      // Arrastra el objeto a lo largo de la línea discontinua: r cambia y la flecha F responde.
      arrastres: [{ id: 'objeto', etiqueta: 'distancia al centro de la Tierra', color: 'c-i',
        donde: val => radial(atraccion(val.r, val.m), ANG1).donde(val.r),
        mover: (pt, val) => ({ r: radial(atraccion(val.r, val.m), ANG1).r(pt) }) }],
    },
    predice: {
      pregunta: 'Un objeto pesa 800 N en la superficie. ¿Cuánto pesa a una altura igual al radio de la Tierra?',
      opciones: [
        { id: 'c', texto: '200 N', correcta: true },
        { id: 'mitad', texto: '400 N', error: 'G3', siFuera: 'Baja al alejarse, cierto. Pero baja con el cuadrado: a doble distancia, la cuarta parte.' },
        { id: 'cero', texto: '0 N: ya salió de la atmósfera', error: 'G2', siFuera: 'El aire no sostiene la gravedad: la Tierra atrae a través del vacío.' },
        { id: 'altura', texto: '800 N: la distancia no importa', error: 'GR-IGUAL', siFuera: 'Cerca del suelo casi no cambia. A miles de km sí, y mucho.' },
      ],
      dibujo: { datos: atraccion(2, 80, { sinF: true, sinR: true, alt: 'Objeto a una altura igual al radio terrestre; su peso no está dibujado.' }), estado: {} },
      revelar: { datos: atraccion(2, 80), estado: {} },
      coincide: 'Coincide: a una altura de un radio está a 2 R del centro; 800 N / 2² = 200 N.',
    },
    mira: {
      datos: {
        vista: VISTA, escalaF: KF1, alt: 'El mismo objeto de 100 kg a 1, 2 y 3 radios del centro: lo atraen 1000, 250 y 111 N.',
        discos: [tierra(), { c: en(1, ANG1), r: 0.1, paso: 1 }, { c: en(2, ANG1), r: 0.1, paso: 2 }, { c: en(3, ANG1), r: 0.1, paso: 3 }],
        segmentos: [{ de: [0, 0], a: en(3.3, ANG1), discontinua: true }],
        flechas: [1, 2, 3].map(k => ({ de: en(k, ANG1), tras: [0, 0], d: [-Math.cos(rad(ANG1)) * 1000 / (k * k), -Math.sin(rad(ANG1)) * 1000 / (k * k)], color: 'o', paso: k })),
        textos: [{ en: [1.75, 0.15], texto: '1000 N', color: 'o', paso: 1 }, { en: [2.4, 1.0], texto: '250 N', color: 'o', paso: 2 }, { en: [3.15, 1.65], texto: '111 N', color: 'o', paso: 3 }],
      },
      pasos: [
        { estado: { paso: 1 }, texto: 'En la superficie, a 1 R del centro, 100 kg pesan 1000 N.', ecuacion: [F, ' = ', { frac: ['G M m', { sup: ['R', '2'] }] }, ' = 1000 N'] },
        { estado: { paso: 2 }, texto: 'A 2 R del centro, r² es 4 veces mayor.', ecuacion: [F, ' = ', { frac: ['1000', cuad('2')] }, ' = 250 N'] },
        { estado: { paso: 3 }, texto: 'A 3 R, la novena parte. Se cuenta desde el centro.', ecuacion: [F, ' = ', { frac: ['1000', cuad('3')] }, ' ≈ 111 N'] },
      ],
    },
    regla: {
      texto: 'Dos masas se atraen con una fuerza proporcional a sus masas e inversa al cuadrado de la distancia entre sus centros.',
      ecuacion: [F, ' = G ', { frac: ['M m', { llave: [{ sup: [r_, '2'] }], nota: 'centro a centro', color: 'c-i' }] }, '   ·   ', 'G = 6,67 × ', { sup: ['10', '−11'] }, ' N·m²/kg²'],
      condicion: 'r va de centro a centro, fuera de un cuerpo esférico. Altura h sobre la superficie: r = R + h.',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), P0 = r.de([360, 450, 720, 900, 1800]), h = r.de([1, 2, 3, 0.5]), rr = 1 + h, Ph = P0 / (rr * rr);
        return {
          pregunta: ['Un satélite pesa ', `${P0} N en la superficie. ¿Cuánto pesa a una altura de ${f(h, 1)} radios terrestres sobre la superficie?`],
          opciones: opciones(Ph, [
            { id: 'sup', valor: P0 / (h * h), error: 'GR-SUPERFICIE', siFuera: 'Eso mide desde la superficie. r va desde el centro: r = R + h.' },
            { id: 'lineal', valor: P0 / rr, error: 'G3', siFuera: 'Eso divide una vez; la distancia va al cuadrado.' },
            { id: 'cero', valor: 0, error: 'G1', siFuera: 'Lejos de la Tierra igual la atrae: la gravedad no se apaga.' },
          ], n => `${f(n, 2)} N`),
          solucion: { texto: `Está a ${f(rr, 1)} R del centro.`, ecuacion: [F, ` = ${P0} / `, cuad(f(rr, 1)), ` = ${f(Ph, 2)} N`] },
        };
      },
    },
  };

  // ---------- Idea 2: el campo no depende de quién cae ----------
  // Cambia: la altura y la masa del objeto · Permanece: g en cada punto, igual para cualquier masa · Progresa: el mapa
  // de flechas, que se achican al alejarse · Se reserva: la estación espacial, con g casi igual que en el suelo ·
  // Debe verse: g = F/m es del lugar, no del objeto.
  const KG2 = 16;
  function campo(rr, m, o = {}) {
    const gv = G0 / (rr * rr), P = en(rr, 60), Fv = m * gv;
    const mapa = [];
    for (const k of [2, 3]) for (let d = 22.5; d < 360; d += 45) mapa.push({ de: en(k, d), d: [-Math.cos(rad(d)) * G0 / (k * k), -Math.sin(rad(d)) * G0 / (k * k)], color: 'd' });
    return {
      vista: VISTA_C, escalaF: KG2,
      alt: o.alt || `Campo gravitatorio: flechas hacia el centro, más cortas lejos. A ${f(rr, 1)} R, g = ${f(gv, 2)} m/s² para cualquier masa; sobre ${m} kg, F = ${f(Fv, 0)} N.`,
      discos: [tierra(''), { c: P, r: 0.13 }],
      flechas: [...mapa, { de: P, d: [-Math.cos(rad(60)) * gv, -Math.sin(rad(60)) * gv], color: 'd', rotulo: `g = ${f(gv, 2)}` }],
    };
  }
  // La estación a 400 km (r = 1,0625 R): a esta escala casi toca la Tierra. g allá contra g en el suelo, a la misma escala.
  function estacion(con) {
    const r = 1.0625, P = en(r, 60), gv = G0 / (r * r), S = en(1, 200);
    return {
      vista: VISTA_C, escalaF: 6,
      alt: con ? 'A 400 km de altura, g = 8,86 m/s², casi la del suelo (10 m/s²): la estación y los astronautas caen juntos.' : 'Estación espacial a 400 km de altura, muy cerca de la Tierra a esta escala.',
      discos: [tierra(), { c: P, r: 0.1 }],
      arcos: [{ c: [0, 0], r, de: 0, a: 360, grosor: 'fino', discontinua: true }],
      textos: [{ en: [0.9, 1.45], texto: 'estación' }],
      // Comparación arriba, fuera del planeta: dos flechas hacia abajo a la misma escala (8,86 contra 10).
      flechas: con ? [{ de: [-1.6, 3.1], d: [0, -G0], color: 'd', discontinua: true, rotulo: 'suelo: 10' }, { de: [1.6, 3.1], d: [0, -gv], color: 'd', rotulo: `estación: ${f(gv, 2)}` }] : [],
    };
  }
  const campoIdea = {
    id: 'campo-gravitatorio',
    titulo: 'El campo es del lugar',
    temas: ['Campo gravitatorio', 'Variación de g con la altura'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Las flechas verdes son el campo g alrededor de la Tierra. Mueve un objeto y cambia su masa.',
      voz: 'Cambia solo la masa. ¿La flecha verde del objeto cambia?',
      controles: [
        { id: 'r', etiqueta: 'r', color: 'c-i', min: 1.5, max: 3.5, paso: 0.5, inicio: 2, unidad: 'R', decimales: 1 },
        { id: 'm', etiqueta: 'm', min: 1, max: 100, paso: 33, inicio: 1, unidad: 'kg', decimales: 0 },
      ],
      dibujo: val => ({ datos: campo(val.r, val.m), estado: {} }),
      lectura: val => [g, ` = ${f(G0 / (val.r * val.r), 2)} m/s² · `, F, ` = ${f(val.m * G0 / (val.r * val.r), 1)} N`],
      minimo: 3,
      // Arrastra el objeto hacia afuera o hacia adentro, en su radio: su flecha g se ajusta a las del mapa.
      arrastres: [{ id: 'objeto', etiqueta: 'distancia al centro de la Tierra', color: 'c-i',
        donde: val => radial(campo(val.r, val.m), 60).donde(val.r),
        mover: (pt, val) => ({ r: radial(campo(val.r, val.m), 60).r(pt) }) }],
    },
    predice: {
      pregunta: 'La estación espacial gira a unos 400 km de altura, donde g vale cerca de 8,9 m/s². ¿Por qué los astronautas flotan dentro de ella?',
      opciones: [
        { id: 'c', texto: 'Caen junto con la estación, sin parar', correcta: true },
        { id: 'sin-g', texto: 'Allá arriba no hay gravedad', error: 'G1', siFuera: 'Parece que no la hay porque flotan. Pero g allá es casi la del suelo.' },
        { id: 'aire', texto: 'Están fuera de la atmósfera', error: 'G2', siFuera: 'El aire no hace la gravedad: la Tierra atrae también donde no hay aire.' },
        { id: 'poca', texto: 'La gravedad allá es muy pequeña', error: 'GR-POCA', siFuera: '400 km es poco frente a 6400 km de radio: g baja apenas un 11 %.' },
      ],
      dibujo: { datos: estacion(false), estado: {} },
      revelar: { datos: estacion(true), estado: {} },
      coincide: 'Coincide: todos caen con el mismo g, así que nada empuja a nadie contra el piso.',
    },
    mira: {
      datos: campo(2, 50),
      pasos: [
        { estado: {}, texto: 'En cada punto alrededor de la Tierra, la flecha verde apunta al centro.', ecuacion: [g, ' = ', { frac: [F, 'm'] }] },
        { estado: {}, texto: 'Depende de la masa de la Tierra y de r, no de quién cae.', ecuacion: [g, ' = ', { frac: ['G M', { sup: [r_, '2'] }] }] },
        { estado: {}, texto: 'A 2 R del centro, g es la cuarta parte del suelo.', ecuacion: [g, ' = ', { frac: ['10', cuad('2')] }, ' = 2,5 m/s²'] },
        { estado: {}, texto: 'Sobre 50 kg allí, la fuerza es m por g.', ecuacion: [F, ' = 50 · 2,5 = 125 N'] },
      ],
    },
    regla: {
      texto: 'El campo gravitatorio es la fuerza por cada kilogramo en un punto. Lo crea la masa que atrae y no depende del objeto que se pone allí.',
      ecuacion: [g, ' = ', { llave: [{ frac: [F, 'm'] }], nota: 'fuerza por kilogramo', color: 'c-d' }, ' = ', { frac: ['G M', { sup: [r_, '2'] }] }],
      condicion: 'fuera de un planeta esférico, con r desde su centro. En la superficie terrestre, g ≈ 10 m/s².',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), kM = r.de([2, 4, 8, 9, 0.5]), kR = r.de([2, 3, 0.5]), gp = G0 * kM / (kR * kR);
        return {
          pregunta: `Un planeta tiene ${f(kM, 1)} veces la masa de la Tierra y ${f(kR, 1)} veces su radio. Si en la Tierra g = 10 m/s², ¿cuánto vale g en su superficie?`,
          opciones: opciones(gp, [
            { id: 'lineal', valor: G0 * kM / kR, error: 'GR-LINEAL', siFuera: 'El radio va al cuadrado: divide entre su cuadrado.' },
            { id: 'solo-m', valor: G0 * kM, error: 'GR-MASA', siFuera: 'Eso olvida que la superficie está más lejos o más cerca del centro.' },
            { id: 'por', valor: G0 * kM * kR * kR, error: 'GR-CUAD', siFuera: 'Más radio aleja la superficie del centro: g baja, no sube.' },
          ], n => `${f(n, 2)} m/s²`),
          solucion: { texto: 'g crece con la masa y baja con el cuadrado del radio.', ecuacion: [g, ` = 10 · ${f(kM, 1)} / `, cuad(f(kR, 1)), ` = ${f(gp, 2)} m/s²`] },
        };
      },
    },
  };

  // ---------- Idea 3: la órbita circular tiene su rapidez ----------
  // Cambia: el radio de la órbita · Permanece: la Tierra y g(r) apuntando al centro · Progresa: v, que baja al subir ·
  // Se reserva: el período, que crece mucho más rápido que r · Debe verse: más lejos, más lento.
  const KV3 = 9, KG3 = 9;
  function orbita(rr, o = {}) {
    const vv = V0 / Math.sqrt(rr), gv = G0 / (rr * rr), P = en(rr, 90);
    return {
      vista: VISTA_O, escalaF: KG3,
      alt: o.alt || `Satélite en órbita circular a ${f(rr, 1)} R del centro: va a ${f(vv, 2)} km/s y su aceleración, g = ${f(gv, 2)} m/s², apunta al centro.`,
      discos: [tierra(), { c: P, r: 0.13 }],
      arcos: [{ c: [0, 0], r: rr, de: 0, a: 360, grosor: 'fino', discontinua: true }],
      flechas: [...(o.sinV ? [] : [{ de: P, d: [-vv, 0], escala: KV3, color: 'h', rotulo: `v = ${f(vv, 2)} km/s` }]), { de: P, d: [0, -gv], color: 'd', rotulo: 'g' }],
    };
  }
  const orbitaIdea = {
    id: 'orbita-circular',
    titulo: 'Más lejos, más lento',
    temas: ['Campo gravitatorio', 'Ley de gravitación universal'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Elige el radio de la órbita circular de un satélite, en radios terrestres. Mira su rapidez.',
      voz: 'Compara la rapidez a 1 R y a 4 R.',
      controles: [{ id: 'r', etiqueta: 'r', color: 'c-i', min: 1, max: 4, paso: 0.5, inicio: 2, unidad: 'R', decimales: 1 }],
      dibujo: val => ({ datos: orbita(val.r), estado: {} }),
      lectura: val => [v, ` = ${f(V0 / Math.sqrt(val.r), 2)} km/s · una vuelta en ${f(1.4 * val.r ** 1.5, 1)} h`],
      minimo: 3,
      // Arrastra el satélite hacia arriba o abajo: la órbita crece o se achica y la flecha v responde.
      arrastres: [{ id: 'satelite', etiqueta: 'radio de la órbita', color: 'c-i',
        donde: val => radial(orbita(val.r), 90).donde(val.r),
        mover: (pt, val) => ({ r: radial(orbita(val.r), 90).r(pt) }) }],
    },
    predice: {
      pregunta: 'Un satélite pasa de una órbita circular de 2 R a otra de 4 R del centro de la Tierra. ¿Qué pasa con su rapidez?',
      opciones: [
        { id: 'c', texto: 'Baja', correcta: true },
        { id: 'sube', texto: 'Sube: recorre una vuelta más grande', error: 'OR-ALTO', siFuera: 'La vuelta es más grande, cierto. Pero allá g es menor y basta menos rapidez para curvar.' },
        { id: 'igual', texto: 'No cambia', error: 'OR-IGUAL', siFuera: 'Cada radio tiene su propia rapidez circular: con menos g hace falta menos v.' },
      ],
      dibujo: { datos: orbita(2, { sinV: true }), estado: {} },
      revelar: { datos: orbita(4), estado: {} },
      coincide: 'Coincide: a 4 R va a 4 km/s; a 2 R iba a 5,66 km/s.',
    },
    mira: {
      datos: orbita(4),
      pasos: [
        { estado: {}, texto: 'En órbita solo actúa la gravedad: su aceleración es el g del lugar.', ecuacion: [g, ' = ', { frac: ['G M', { sup: [r_, '2'] }] }] },
        { estado: {}, texto: 'Para girar en círculo, esa aceleración debe ser v²/r.', ecuacion: [{ frac: [{ sup: [v, '2'] }, r_] }, ' = ', { frac: ['G M', { sup: [r_, '2'] }] }] },
        { estado: {}, texto: 'Despejando, la rapidez baja con la raíz de r.', ecuacion: [v, ' = ', { raiz: ['G M / ', r_] }] },
        { estado: {}, texto: 'A 4 R va a la mitad de la rapidez rasante.', ecuacion: [v, ' = 8 / ', { raiz: ['4'] }, ' = 4 km/s'] },
      ],
    },
    regla: {
      texto: 'En una órbita circular, la gravedad hace de fuerza centrípeta. Cuanto más lejos, menor rapidez y vuelta más larga.',
      ecuacion: [{ llave: [v], nota: 'en órbita', color: 'c-h' }, ' = ', { raiz: ['G M / ', r_] }, '   ·   ', 'T = ', { frac: [['2π ', r_], v] }],
      condicion: 'órbita circular alrededor de un planeta esférico. Con otra rapidez la órbita es una elipse, también cerrada.',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), k = r.de([4, 9, 16, 1.5625, 2.25, 6.25]), vv = V0 / Math.sqrt(k);
        return {
          pregunta: ['Rasante a la Tierra (1 R), un satélite va a 8 km/s. ¿Qué rapidez tiene en una órbita circular de ', r_, ` = ${f(k, 4)} R?`],
          opciones: opciones(vv, [
            { id: 'lineal', valor: V0 / k, error: 'OR-RAIZ', siFuera: 'Eso divide entre r; la rapidez baja con la raíz de r.' },
            { id: 'sube', valor: V0 * Math.sqrt(k), error: 'OR-ALTO', siFuera: 'Más lejos, la rapidez circular es menor, no mayor.' },
            { id: 'igual', valor: V0, error: 'OR-IGUAL', siFuera: 'Cada radio tiene su rapidez circular.' },
          ], n => `${f(n, 2)} km/s`),
          solucion: { texto: `r es ${f(k, 4)} veces mayor: v se divide entre √${f(k, 4)}.`, ecuacion: [v, ` = 8 / ${f(Math.sqrt(k), 2)} = ${f(vv, 2)} km/s`] },
        };
      },
    },
  };

  // ---------- Idea 4: las tres leyes de Kepler ----------
  // Cambia: la excentricidad de la órbita · Permanece: el Sol en un foco y doce marcas a tiempos iguales ·
  // Progresa: el amontonamiento de marcas lejos del Sol · Se reserva: dos áreas barridas iguales ·
  // Debe verse: cerca del Sol va más rápido; T² crece como a³.
  const A4 = 2.4;
  function kepler(e, k, a = A4) {
    // Posición a tiempo k/12 de vuelta (anomalía media M), con el Sol en el origen (un foco).
    const M = 2 * Math.PI * k / 12;
    let E = M;
    for (let i = 0; i < 40; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    return [a * (Math.cos(E) - e), a * Math.sqrt(1 - e * e) * Math.sin(E)];
  }
  function elipse(e, o = {}) {
    const pts = Array.from({ length: 73 }, (_, i) => { const E = 2 * Math.PI * i / 72; return [A4 * (Math.cos(E) - e), A4 * Math.sqrt(1 - e * e) * Math.sin(E)]; });
    const marcas = Array.from({ length: 12 }, (_, k) => kepler(e, k));
    const sector = (k0, k1) => [[0, 0], ...Array.from({ length: 9 }, (_, i) => kepler(e, k0 + (k1 - k0) * i / 8))];
    return {
      vista: { x0: -4.3, x1: 2.7, y0: -2.6, y1: 2.6 },
      alt: o.alt || `Órbita con excentricidad ${f(e, 1)}, el Sol en un foco y doce marcas a tiempos iguales: ${e > 0 ? 'se amontonan lejos del Sol, donde va más lento' : 'quedan parejas'}.`,
      poligonos: [{ puntos: pts, grosor: 'fino' }, ...(o.areas ? [{ puntos: sector(0, 1), cerrado: true, relleno: 0.3, color: 'i', paso: o.areas }, { puntos: sector(6, 7), cerrado: true, relleno: 0.3, color: 'i', paso: o.areas }] : [])],
      discos: [{ c: [0, 0], r: 0.22, color: 'o', relleno: 0.6 }],
      puntos: marcas.map(([x, y]) => ({ x, y, color: 'h', paso: o.marcas || 0 })),
      textos: o.textos || [],
    };
  }
  const afelio = e => { const g = LZ(elipse(e)); return { x: g.X(-A4 * (1 + e)), y: g.Y(0) }; };
  const keplerIdea = {
    id: 'leyes-de-kepler',
    titulo: 'Las tres leyes de Kepler',
    temas: ['Leyes de Kepler'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'Cambia qué tan alargada es la órbita. Los puntos rojos marcan dónde está el planeta cada mismo tiempo.',
      voz: 'Mira dónde se juntan los puntos: ¿cerca o lejos del Sol?',
      controles: [{ id: 'e', etiqueta: 'Forma', opciones: [{ valor: 0, texto: 'Círculo' }, { valor: 0.4, texto: 'e = 0,4' }, { valor: 0.7, texto: 'e = 0,7' }], inicio: 0.4 }],
      dibujo: val => ({ datos: elipse(val.e), estado: {} }),
      lectura: val => [val.e === 0 ? 'Marcas parejas: rapidez constante' : 'Lejos del Sol las marcas se juntan: va más lento'],
      minimo: 3,
      // Arrastra el punto más lejano del Sol hacia la izquierda: la órbita se estira (la forma más cercana).
      arrastres: [{ id: 'afelio', etiqueta: 'punto más lejano del Sol (forma de la órbita)',
        donde: val => afelio(val.e),
        mover: (pt, val) => {
          let mejor = val.e, dist = Infinity;
          for (const o of keplerIdea.juega.controles[0].opciones) { const dd = Math.abs(afelio(o.valor).x - pt.x); if (dd < dist - 1e-9) { dist = dd; mejor = o.valor; } }
          return { e: mejor };
        } }],
    },
    predice: {
      pregunta: 'La Tierra da una vuelta al Sol en 1 año a 1 UA (unidad astronómica). Otro planeta orbita a 4 UA. ¿Cuánto dura su año?',
      opciones: [
        { id: 'c', texto: '8 años', correcta: true },
        { id: 'lineal', texto: '4 años', error: 'KP-LINEAL', siFuera: 'Más lejos, más tiempo, cierto. Pero además va más lento: T crece más que la distancia.' },
        { id: 'cuad', texto: '16 años', error: 'KP-CUAD', siFuera: '16 es 4². La ley va así: T² crece como a³, y 8² = 4³.' },
        { id: 'cubo', texto: '64 años', error: 'KP-CUBO', siFuera: '64 es 4³, que es T², no T. Falta la raíz.' },
      ],
      dibujo: { datos: { vista: { x0: -4.3, x1: 4.3, y0: -3.3, y1: 3.3 }, alt: 'Dos órbitas circulares alrededor del Sol, de 1 y 4 UA.', arcos: [{ c: [0, 0], r: 0.75, de: 0, a: 360, grosor: 'fino' }, { c: [0, 0], r: 3, de: 0, a: 360, grosor: 'fino' }], discos: [{ c: [0, 0], r: 0.2, color: 'o', relleno: 0.6 }], textos: [{ en: [0, 1.05], texto: '1 UA' }, { en: [0, 3.15], texto: '4 UA' }] }, estado: {} },
      revelar: { datos: { vista: { x0: -4.3, x1: 4.3, y0: -3.3, y1: 3.3 }, alt: 'La órbita de 1 UA dura 1 año; la de 4 UA, 8 años.', arcos: [{ c: [0, 0], r: 0.75, de: 0, a: 360, grosor: 'fino' }, { c: [0, 0], r: 3, de: 0, a: 360, grosor: 'fino' }], discos: [{ c: [0, 0], r: 0.2, color: 'o', relleno: 0.6 }], textos: [{ en: [0, 1.05], texto: '1 año' }, { en: [0, 3.15], texto: '8 años', color: 'h' }] }, estado: {} },
      coincide: 'Coincide: 8² = 64 = 4³. El período al cuadrado crece como el radio al cubo.',
    },
    mira: {
      datos: elipse(0.6, { marcas: 2, areas: 3, textos: [{ en: [-3.4, 2.2], texto: 'lento', color: 'h', paso: 2 }, { en: [1.4, 1.8], texto: 'rápido', color: 'h', paso: 2 }] }),
      pasos: [
        { estado: { paso: 1 }, texto: 'Primera ley: una elipse con el Sol en un foco, no al centro.', ecuacion: ['Sol en un foco'] },
        { estado: { paso: 2 }, texto: 'Las marcas van a tiempos iguales: cerca del Sol, más separadas.', ecuacion: ['cerca: más rápido'] },
        { estado: { paso: 3 }, texto: 'Segunda ley: en tiempos iguales barre áreas iguales.', ecuacion: [{ sub: ['A', 'cerca'] }, ' = ', { sub: ['A', 'lejos'] }] },
        { estado: { paso: 3 }, texto: 'Tercera ley: T² entre a³ es igual para todos los planetas del Sol.', ecuacion: [{ frac: [{ sup: ['T', '2'] }, { sup: [a_, '3'] }] }, ' = constante'] },
      ],
    },
    regla: {
      texto: 'Los planetas giran en elipses con el Sol en un foco, barren áreas iguales en tiempos iguales, y T² crece como el cubo del semieje.',
      ecuacion: [{ frac: [{ sup: ['T', '2'] }, { llave: [{ sup: [a_, '3'] }], nota: 'semieje al cubo', color: 'c-i' }] }, ' = ', { frac: [['4', { sup: ['π', '2'] }], 'G M'] }],
      condicion: 'a es el semieje mayor; la constante vale para cuerpos que giran alrededor del mismo astro.',
    },
    ahoraTu: {
      generar(sm) {
        const r = azar(sm), pideT = sm % 2 === 0;
        if (pideT) {
          const aa = r.de([4, 9, 16, 25, 0.25]), T = aa ** 1.5;
          return {
            pregunta: ['Un cometa gira alrededor del Sol con semieje ', a_, ` = ${f(aa, 2)} UA. Si la Tierra (1 UA) tarda 1 año, ¿cuánto tarda el cometa?`],
            opciones: opciones(T, [
              { id: 'lineal', valor: aa, error: 'KP-LINEAL', siFuera: 'T no crece en proporción a a: va como a elevado a 3/2.' },
              { id: 'cuad', valor: aa * aa, error: 'KP-CUAD', siFuera: 'Eso eleva a al cuadrado; T² = a³.' },
              { id: 'cubo', valor: aa ** 3, error: 'KP-CUBO', siFuera: 'Eso es a³, que es T²; falta sacar la raíz.' },
            ], n => `${f(n, 3)} años`),
            solucion: { texto: 'Con años y UA, la constante vale 1: T² = a³.', ecuacion: ['T = ', { raiz: [{ sup: [f(aa, 2), '3'] }] }, ` = ${f(T, 3)} años`] },
          };
        }
        const T = r.de([8, 27, 64, 125]), aa = Math.cbrt(T * T);
        return {
          pregunta: `Un asteroide tarda ${T} años en dar una vuelta al Sol. Con la Tierra a 1 UA y 1 año, ¿cuál es su semieje mayor?`,
          opciones: opciones(aa, [
            { id: 'lineal', valor: T, error: 'KP-LINEAL', siFuera: 'El semieje no crece igual que el período.' },
            { id: 'cuad', valor: Math.sqrt(T), error: 'KP-CUAD', siFuera: 'Eso saca raíz cuadrada; a³ = T², así que va raíz cúbica de T².' },
            { id: 'cubo', valor: Math.cbrt(T), error: 'KP-CUBO', siFuera: 'Eso saca raíz cúbica de T; la ley usa T².' },
          ], n => `${f(n, 2)} UA`),
          solucion: { texto: 'Con años y UA: a³ = T².', ecuacion: [a_, ' = ', { raiz: [{ sup: [`${T}`, '2'] }], indice: '3' }, ` = ${f(aa, 2)} UA`] },
        };
      },
    },
  };

  // Laboratorio: dos satélites en órbitas circulares, para comparar rapidez y período al mismo tiempo.
  function dosOrbitas(r1, r2) {
    const P1 = en(r1, 90), P2 = en(r2, 20), v1 = V0 / Math.sqrt(r1), v2 = V0 / Math.sqrt(r2);
    return {
      vista: VISTA_O, escalaF: KG3,
      alt: `Dos satélites: A a ${f(r1, 1)} R va a ${f(v1, 2)} km/s; B a ${f(r2, 1)} R va a ${f(v2, 2)} km/s.`,
      discos: [tierra(), { c: P1, r: 0.13 }, { c: P2, r: 0.13 }],
      textos: [{ en: en(r1 + 0.45, 75), texto: 'A' }, { en: en(r2 + 0.45, 5), texto: 'B' }],
      arcos: [{ c: [0, 0], r: r1, de: 0, a: 360, grosor: 'fino', discontinua: true }, { c: [0, 0], r: r2, de: 0, a: 360, grosor: 'fino', discontinua: true }],
      flechas: [{ de: P1, d: [-v1, 0], escala: KV3, color: 'h', rotulo: `${f(v1, 1)} km/s` },
        { de: P2, d: [-Math.sin(rad(20)) * v2, Math.cos(rad(20)) * v2], escala: KV3, color: 'h', rotulo: `${f(v2, 1)} km/s`, lado: -1 }],
    };
  }
  const DOS = [
    { id: 'r1', etiqueta: 'r de A', color: 'c-i', min: 1, max: 4, paso: 0.25, inicio: 1, unidad: 'R', decimales: 2 },
    { id: 'r2', etiqueta: 'r de B', color: 'c-i', min: 1, max: 4, paso: 0.25, inicio: 4, unidad: 'R', decimales: 2 },
  ];
  const ELIPSE_LIBRE = { id: 'e', etiqueta: 'e', min: 0, max: 0.75, paso: 0.05, inicio: 0.5, unidad: '', decimales: 2 };

  return {
    unidad: 'fisica.gravitacion',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/fis-lienzo.js'],
    // Laboratorio: juego libre, sin preguntas. Dos órbitas a la vez para comparar (la idea muestra una sola); la
    // elipse libre deja cualquier excentricidad de 0 a 0,75 y cuenta cuánto más lento va lejos del Sol.
    laboratorio: [
      {
        id: 'dos-orbitas', titulo: 'Dos satélites lado a lado', pieza: 'fis-lienzo',
        consigna: 'Arrastra los satélites A y B a órbitas distintas. Compara sus rapideces y cuánto tarda cada vuelta.',
        controles: DOS,
        dibujo: val => ({ datos: dosOrbitas(val.r1, val.r2), estado: {} }),
        lectura: val => [`A: ${f(V0 / Math.sqrt(val.r1), 2)} km/s, ${f(1.4 * val.r1 ** 1.5, 1)} h · B: ${f(V0 / Math.sqrt(val.r2), 2)} km/s, ${f(1.4 * val.r2 ** 1.5, 1)} h`],
        arrastres: [
          { id: 'sat-a', etiqueta: 'radio de la órbita de A', color: 'c-i',
            donde: val => radial(dosOrbitas(val.r1, val.r2), 90).donde(val.r1),
            mover: (pt, val) => ({ r1: radial(dosOrbitas(val.r1, val.r2), 90).r(pt) }) },
          { id: 'sat-b', etiqueta: 'radio de la órbita de B', color: 'c-i',
            donde: val => radial(dosOrbitas(val.r1, val.r2), 20).donde(val.r2),
            mover: (pt, val) => ({ r2: radial(dosOrbitas(val.r1, val.r2), 20).r(pt) }) },
        ],
      },
      {
        id: 'elipse-libre', titulo: 'Elipse de cualquier forma', pieza: 'fis-lienzo',
        consigna: 'Estira la órbita arrastrando su punto más lejano del Sol. Las marcas rojas van a tiempos iguales.',
        controles: [ELIPSE_LIBRE],
        dibujo: val => ({ datos: elipse(val.e), estado: {} }),
        lectura: val => [val.e === 0 ? 'e = 0: la misma rapidez en toda la vuelta' : `e = ${f(val.e, 2)}: cerca del Sol va ${f((1 + val.e) / (1 - val.e), 2)} veces más rápido que lejos`],
        arrastres: [{ id: 'afelio', etiqueta: 'punto más lejano del Sol (forma de la órbita)',
          donde: val => afelio(val.e),
          mover: (pt, val) => { const g = LZ(elipse(val.e)); return { e: -g.Xi(pt.x) / A4 - 1 }; } }],
      },
      Object.assign({ id: 'atraccion', titulo: 'Atracción y distancia', pieza: 'fis-lienzo' }, inversa.juega),
    ],
    historia: {
      texto: 'Kepler trabajó con años de registros de Tycho Brahe y publicó sus dos primeras leyes en 1609; la tercera, en 1619. Describían cómo se mueven los planetas sin explicar por qué. En 1687, Newton mostró que una sola atracción, que se debilita con el cuadrado de la distancia, explicaba las tres.',
      pregunta: '¿Por qué la Luna no se cae a la Tierra?',
      fuente: { titulo: 'NASA — Orbits and Kepler’s Laws', url: 'https://science.nasa.gov/solar-system/orbits-and-keplers-laws/' },
    },
    ideas: [inversa, campoIdea, orbitaIdea, keplerIdea],
  };
});
