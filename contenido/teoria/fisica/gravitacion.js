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
  const nodo = typeof module === 'object' && module.exports;
  // nucleo/fisica3d.js arma la mesa 3D «Órbitas en cualquier plano» con el motor de plantillas/gravitacion (regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../nucleo/fisica3d.js')) : fabrica(root.Kit, root.Fisica3D);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, F3) {
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
  // Lo que miden las ideas y las mesas (las mismas cuentas de orbita, elipse y atraccion); lo usan dibujo, lectura y retos.
  const vOrb = rr => V0 / Math.sqrt(rr);                  // km/s
  const tOrb = rr => 1.4 * rr ** 1.5;                     // h (vuelta rasante ≈ 1,4 h)

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
      segmentos: [{ de: [0, 0], a: P, color: 'i', discontinua: true, texto: o.sinR ? undefined : `r = ${f(rr, 1)} R`, lado: 1 }],
      flechas: o.sinF ? [] : [{ de: P, d: [-Math.cos(rad(ANG1)) * Fv, -Math.sin(rad(ANG1)) * Fv], color: 'o', rotulo: `F = ${f(Fv, 0)} N`, lado: -1, rotuloEn: 'cola' }],
    };
  }
  const inversa = {
    id: 'cuadrado-inverso',
    titulo: 'Doble distancia, cuarta parte',
    temas: ['Ley de gravitación universal', 'Variación de g con la altura'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'El objeto se aleja y se acerca solo (R es el radio terrestre). Mira la flecha F. Arrástralo o elige su masa.',
      voz: 'Lleva el objeto de 1 R a 2 R. ¿Cuánto se achica F?',
      controles: [
        { id: 'r', etiqueta: 'r', color: 'c-i', min: 1, max: 4, paso: 0.5, inicio: 1, unidad: 'R', decimales: 1,
          auto: { velocidad: 0.75, modo: 'rebota' } },          // de 1 R a 4 R en 4 s, ida y vuelta
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
        { estado: { paso: 1 }, texto: 'G: constante de gravitación universal. A 1 R, 100 kg pesan 1000 N.', ecuacion: [F, ' = ', { frac: ['G M m', { sup: ['R', '2'] }] }, ' = 1000 N'] },
        { estado: { paso: 2 }, texto: 'A 2 R del centro, r² es 4 veces mayor.', ecuacion: [F, ' = ', { frac: ['1000', cuad('2')] }, ' = 250 N'] },
        { estado: { paso: 3 }, texto: 'A 3 R, la novena parte. Se cuenta desde el centro.', ecuacion: [F, ' = ', { frac: ['1000', cuad('3')] }, ' ≈ 111 N'] },
      ],
    },
    regla: {
      texto: 'Ley de gravitación universal: dos masas se atraen con una fuerza proporcional a sus masas e inversa al cuadrado de la distancia entre sus centros.',
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
    const gv = G0 / (rr * rr), P = en(rr, 60), Fv = m * gv, rm = 0.07 + 0.1 * Math.cbrt(m / 100); // la bolita crece con m
    const mapa = [];
    for (const k of [2, 3]) for (let d = 22.5; d < 360; d += 45) mapa.push({ de: en(k, d), d: [-Math.cos(rad(d)) * G0 / (k * k), -Math.sin(rad(d)) * G0 / (k * k)], color: 'd' });
    return {
      vista: VISTA_C, escalaF: KG2,
      alt: o.alt || `Campo gravitatorio: flechas hacia el centro, más cortas lejos. A ${f(rr, 1)} R, g = ${f(gv, 2)} m/s² para cualquier masa; sobre ${m} kg, F = ${f(Fv, 0)} N.`,
      discos: [tierra(''), { c: P, r: rm }],
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
      consigna: 'Las flechas verdes son el campo g. La masa del objeto crece y se achica sola: ¿cambia su flecha verde? Arrástralo para cambiar r.',
      voz: 'Cambia solo la masa. ¿La flecha verde del objeto cambia?',
      controles: [
        { id: 'r', etiqueta: 'r', color: 'c-i', min: 1.5, max: 3.5, paso: 0.5, inicio: 2, unidad: 'R', decimales: 1 },
        { id: 'm', etiqueta: 'm', min: 1, max: 100, paso: 33, inicio: 1, unidad: 'kg', decimales: 0,
          auto: { velocidad: 25, modo: 'rebota' } },            // de 1 a 100 kg en 4 s, ida y vuelta: g no se mueve
      ],
      dibujo: val => ({ datos: campo(val.r, val.m), estado: {} }),
      lectura: val => [`m = ${f(val.m, 0)} kg · `, g, ` = ${f(G0 / (val.r * val.r), 2)} m/s² · `, F, ` = ${f(val.m * G0 / (val.r * val.r), 0)} N`],
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
  // Ángulo del satélite a la hora t (en h): parte de arriba (90°) y da una vuelta cada tOrb(r), en sentido antihorario.
  const angOrb = (rr, t) => 90 + 360 * ((t || 0) / tOrb(rr) % 1);
  function orbita(rr, o = {}) {
    const vv = vOrb(rr), gv = G0 / (rr * rr), th = angOrb(rr, o.t), P = en(rr, th), c = Math.cos(rad(th)), s = Math.sin(rad(th));
    return {
      vista: VISTA_O, escalaF: KG3,
      alt: o.alt || `Satélite en órbita circular a ${f(rr, 1)} R del centro: va a ${f(vv, 2)} km/s y su aceleración, g = ${f(gv, 2)} m/s², apunta al centro.`,
      discos: [tierra(), { c: P, r: 0.13 }],
      arcos: [{ c: [0, 0], r: rr, de: 0, a: 360, grosor: 'fino', discontinua: true }],
      flechas: [...(o.sinV ? [] : [{ de: P, d: [-s * vv, c * vv], escala: KV3, color: 'h', rotulo: `v = ${f(vv, 2)} km/s` }]), { de: P, d: [-c * gv, -s * gv], color: 'd', rotulo: 'g' }],
    };
  }
  const orbitaIdea = {
    id: 'orbita-circular',
    titulo: 'Más lejos, más lento',
    temas: ['Campo gravitatorio', 'Ley de gravitación universal'],
    pieza: 'fis-lienzo',
    juega: {
      consigna: 'El satélite gira solo, en tiempo acelerado. Arrástralo o elige el radio de su órbita, en radios terrestres. Mira su rapidez.',
      voz: 'Compara la rapidez a 1 R y a 4 R.',
      controles: [
        { id: 'r', etiqueta: 'r', color: 'c-i', min: 1, max: 4, paso: 0.5, inicio: 2, unidad: 'R', decimales: 1 },
        // t en horas, en tiempo acelerado: 1,5 h por segundo (a 2 R, una vuelta en unos 2,6 s). T va en tinta.
        { id: 't', etiqueta: 't', min: 0, max: 24, paso: 0.1, inicio: 0, unidad: 'h', decimales: 1, auto: { velocidad: 1.5, modo: 'repite' } },
      ],
      dibujo: val => ({ datos: orbita(val.r, { t: val.t }), estado: {} }),
      lectura: val => [`t = ${f(val.t, 1)} h · `, v, ` = ${f(vOrb(val.r), 2)} km/s · T = ${f(tOrb(val.r), 1)} h`],
      minimo: 3,
      // Arrastra el satélite hacia afuera o hacia adentro por su radio: la órbita crece o se achica y la flecha v
      // responde. El satélite se queda en el mismo ángulo (t se ajusta al nuevo período), y tocarlo pausa la vuelta.
      arrastres: [{ id: 'satelite', etiqueta: 'radio de la órbita', color: 'c-i',
        donde: val => radial(orbita(val.r, { t: val.t }), angOrb(val.r, val.t)).donde(val.r),
        mover: (pt, val) => {
          const [cr, ct] = orbitaIdea.juega.controles, th = angOrb(val.r, val.t);
          const r = Math.min(cr.max, Math.max(cr.min, cr.min + Math.round((radial(orbita(val.r, { t: val.t }), th).r(pt) - cr.min) / cr.paso) * cr.paso));
          // Mismas vueltas completas y mismo ángulo, con el período del nuevo radio (sin pasarse del tope de t).
          let n = Math.floor(val.t / tOrb(val.r)), t = (n + (th - 90) / 360) * tOrb(r);
          while (t > ct.max && n > 0) { n--; t = (n + (th - 90) / 360) * tOrb(r); }
          return { r, t: Math.round(t * 1e4) / 1e4 };
        } }],
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
      texto: 'En una órbita circular, la gravedad hace de fuerza centrípeta. Cuanto más lejos, menor velocidad orbital y vuelta más larga.',
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
  // Ecuación de Kepler M = E − e sen E, resuelta por Newton con 40 iteraciones fijas (determinista).
  function anomalia(e, k) {
    const M = 2 * Math.PI * k / 12;
    let E = M;
    for (let i = 0; i < 40; i++) E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    return E;
  }
  function kepler(e, k, a = A4) {
    // Posición a tiempo k/12 de vuelta (anomalía media M), con el Sol en el origen (un foco).
    const E = anomalia(e, k);
    return [a * (Math.cos(E) - e), a * Math.sqrt(1 - e * e) * Math.sin(E)];
  }
  // El planeta al mes t (0 a 12) de una órbita de semieje a = 1 UA y un año, como la Tierra. Rapidez por vis viva:
  // v = 30 km/s · √(2/r − 1), con r en UA (30 km/s es la rapidez circular a 1 UA, redondeada).
  const V_UA = 30, KV4 = 1;
  function planetaEn(e, t) {
    const E = anomalia(e, t), P = kepler(e, t), rUA = Math.hypot(P[0], P[1]) / A4;
    const dx = -Math.sin(E), dy = Math.sqrt(1 - e * e) * Math.cos(E), u = Math.hypot(dx, dy);
    const vv = V_UA * Math.sqrt(2 / rUA - 1);
    return { P, rUA, v: vv, d: [dx / u * vv, dy / u * vv] };
  }
  function elipse(e, o = {}) {
    const pts = Array.from({ length: 73 }, (_, i) => { const E = 2 * Math.PI * i / 72; return [A4 * (Math.cos(E) - e), A4 * Math.sqrt(1 - e * e) * Math.sin(E)]; });
    const marcas = Array.from({ length: 12 }, (_, k) => kepler(e, k));
    const sector = (k0, k1) => [[0, 0], ...Array.from({ length: 9 }, (_, i) => kepler(e, k0 + (k1 - k0) * i / 8))];
    // Con o.t (mes): el planeta, la línea Sol–planeta, el área barrida desde la última marca y la flecha v.
    const pl = o.t === undefined ? null : planetaEn(e, o.t), k0 = pl ? Math.floor(o.t) : 0;
    return {
      vista: { x0: -4.3, x1: 2.7, y0: -2.6, y1: 2.6 },
      alt: o.alt || `Órbita con excentricidad ${f(e, 1)}, el Sol en un foco y doce marcas a tiempos iguales: ${e > 0 ? 'se amontonan lejos del Sol, donde va más lento' : 'quedan parejas'}.`,
      poligonos: [{ puntos: pts, grosor: 'fino' }, ...(pl ? [{ puntos: sector(k0, o.t), cerrado: true, relleno: 0.3, color: 'i' }] : []), ...(o.areas ? [{ puntos: sector(0, 1), cerrado: true, relleno: 0.3, color: 'i', paso: o.areas }, { puntos: sector(6, 7), cerrado: true, relleno: 0.3, color: 'i', paso: o.areas }] : [])],
      discos: [{ c: [0, 0], r: 0.22, color: 'o', relleno: 0.6 }, ...(pl ? [{ c: pl.P, r: 0.12 }] : [])],
      puntos: marcas.map(([x, y]) => ({ x, y, color: 'h', paso: o.marcas || 0 })),
      segmentos: pl ? [{ de: [0, 0], a: pl.P, color: 'i' }] : [],
      flechas: pl ? [{ de: pl.P, d: pl.d, escala: KV4, color: 'h', rotulo: 'v' }] : [],
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
      consigna: 'El planeta recorre su órbita solo, un año en seis segundos; los puntos rojos marcan cada mes. Cambia la forma: ¿dónde corre más?',
      voz: 'Mira dónde se juntan los puntos: ¿cerca o lejos del Sol?',
      controles: [
        { id: 'e', etiqueta: 'Forma', opciones: [{ valor: 0, texto: 'Círculo' }, { valor: 0.4, texto: 'e = 0,4' }, { valor: 0.7, texto: 'e = 0,7' }], inicio: 0.4 },
        // t en meses de una órbita de un año (tiempo acelerado: 2 meses por segundo). T va en tinta.
        { id: 't', etiqueta: 't', min: 0, max: 12, paso: 0.1, inicio: 0, unidad: 'meses', decimales: 1, auto: { velocidad: 2, modo: 'repite' } },
      ],
      dibujo: val => ({ datos: elipse(val.e, { t: val.t }), estado: {} }),
      lectura: val => { const p = planetaEn(val.e, val.t); return [r_, ` = ${f(p.rUA, 2)} UA · `, v, ` = ${f(p.v, 1)} km/s`]; },
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
        { estado: { paso: 1 }, texto: 'Primera ley de Kepler: elipse con el Sol en un foco, no al centro.', ecuacion: ['Sol en un foco'] },
        { estado: { paso: 2 }, texto: 'Las marcas van a tiempos iguales: cerca del Sol, más separadas.', ecuacion: ['cerca: más rápido'] },
        { estado: { paso: 3 }, texto: 'Segunda ley de Kepler: en tiempos iguales barre áreas iguales.', ecuacion: [{ sub: ['A', 'cerca'] }, ' = ', { sub: ['A', 'lejos'] }] },
        { estado: { paso: 3 }, texto: 'Tercera ley de Kepler: T² entre a³ es igual para los planetas del Sol.', ecuacion: [{ frac: [{ sup: ['T', '2'] }, { sup: [a_, '3'] }] }, ' = constante'] },
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
  const cercaLejos = e => (1 + e) / (1 - e);              // cuántas veces más rápido cerca del Sol que lejos
  const fAtraccion = val => val.m * G0 / (val.r * val.r);  // N

  // Órbitas en cualquier plano (laboratorio 3D de contexto, 15 nov: exploración libre, sin predicciones). El satélite
  // avanza solo (t con auto, en tiempo acelerado: 1,5 h por segundo; la órbita de un día da su vuelta en 16 s); el
  // número de objetos de la escena no cambia con t, así que fis-espacio-3d solo los mueve. Período, rapidez y g los calcula el motor de plantillas/gravitacion (orbita y
  // geoestacionario) a través de nucleo/fisica3d.js. Lo que el 3D muestra: toda órbita rodea el centro de la Tierra.
  const orb3 = val => F3.orbita(val);
  const RADIOS3 = [{ valor: 1.1, texto: '1,1 R' }, { valor: 2, texto: '2 R' }, { valor: 4, texto: '4 R' }, { valor: 'dia', texto: '6,6 R' }];
  const mesaPlano = {
    id: 'orbita-plano-3d', titulo: 'Órbitas en cualquier plano', pieza: 'fis-espacio-3d',
    consigna: 'Gira la Tierra con el dedo. El satélite avanza solo, en tiempo acelerado. Elige el radio e inclina el plano: mira cuánto tarda cada vuelta.',
    controles: [
      { id: 'r', etiqueta: 'Radio de la órbita', color: 'c-i', opciones: RADIOS3, inicio: 2 },
      { id: 'inc', etiqueta: 'Inclinación del plano', min: 0, max: 90, paso: 15, inicio: 30, unidad: '°', decimales: 0 },
      { id: 't', etiqueta: 't', min: 0, max: 24, paso: 0.5, inicio: 0, unidad: 'h', decimales: 1, auto: { velocidad: 1.5, modo: 'repite' } },
    ],
    dibujo: val => ({ datos: orb3(val).datos, estado: {} }),
    lectura: val => { const o = orb3(val); return [`t = ${f(val.t, 1)} h · T = ${f(o.T, 1)} h · `, v, ` = ${f(o.v / 1000, 1)} km/s`]; },
    invitaciones: [
      { texto: 'Busca la órbita que da una vuelta en un día justo.',
        logrado: val => Math.abs(orb3(val).T - 24) < 1e-9,
        bien: 'A 6,6 radios del centro, tarda lo mismo que la Tierra en girar.',
        pista: 'Más lejos, más lenta. Prueba la órbita más alta.' },
      { texto: 'Haz que la órbita pase sobre los dos polos.',
        logrado: val => val.inc === 90,
        bien: 'Por los polos o por el ecuador: el plano siempre pasa por el centro.' },
      { texto: 'Con la órbita más baja, deja que el satélite dé más de dos vueltas.',
        logrado: (val, g, mesa) => val.r === mesa.controles[0].opciones[0].valor && orb3(val).vueltas > 2,
        bien: 'Abajo va a casi 8 km/s: una vuelta en hora y media.',
        pista: 'Cuando t pase de 3,3 h, pausa y elige 1,1 R.' },
      { texto: 'Guarda dos órbitas del mismo radio y distinta inclinación.',
        logrado: (val, guardados) => guardados.some(a => guardados.some(b => a.r === b.r && a.inc !== b.inc
          && Math.abs(orb3(a).T - orb3(b).T) < 1e-9)),
        bien: 'Inclinar el plano no cambia T ni v: solo cuenta r.' },
    ],
  };

function construirGr1(Kit) {
  'use strict';
  const G = 6.67e-11;
  const f = x => Kit.formatear(Math.abs(x) < 1e-10 ? 0 : x, 3);
  const exacto = x => Number.isFinite(x) && Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-7;
  const superindice = x => String(x).split('').map(c => ({ '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' })[c]).join('');
  const numero = x => {
    if (x !== 0 && (Math.abs(x) >= 1e6 || Math.abs(x) < 0.001)) {
      const e = Math.floor(Math.log10(Math.abs(x)));
      return `${f(x / 10 ** e)} × 10${superindice(e)}`;
    }
    return f(x);
  };
  const n = x => x < 0 || numero(x).includes('×') ? `(${numero(x)})` : numero(x);
  const q = (color, t) => ({ v: `c-${color}`, t: String(t) });
  const sub = (a, b) => ({ sub: [a, b] });
  const M = q('f', 'M'), m = q('f', 'm'), r = q('i', 'r'), F = q('h', 'F'), Fx = sub(F, 'x');
  const Fr = sub(F, 'ref'), Fn = sub(F, 'nueva'), mr = sub(m, 'ref'), mn = sub(m, 'nueva');
  const leyRazones = [{ frac: [Fn, Fr] }, ' = ', { frac: [sub(M, 'nueva'), sub(M, 'ref')] }, ' · ', { frac: [mn, mr] }, ' · ', { sup: [{ par: [{ frac: [sub(r, 'ref'), sub(r, 'nuevo')] }] }, '2'] }];
  const lit = (color, x) => q(color, numero(x));
  const cuadrado = (color, x) => ({ sup: [{ par: [lit(color, x)] }, '2'] });
  const valor = (x, unidad, color) => q(color, `${numero(x)}${unidad ? ` ${unidad}` : ''}`);
  const textoValor = (x, unidad, aprox) => `${aprox || !exacto(x) ? '≈ ' : ''}${numero(x)}${unidad ? ` ${unidad}` : ''}`;
  const factor = x => `${numero(x)} ${x === 1 ? 'vez' : 'veces'}`;
  const dm = c => c.gramos == null ? c.m : c.gramos / 1000;
  const dr = c => c.rKm == null ? c.r : c.rKm * 1000;
  const datoG = 'G ≈ 6,67 × 10⁻¹¹ N·m²/kg²: valor aproximado para este ejercicio.';
  const ley = [F, ' = G · ', M, ' · ', m, ' / ', r, '²'];
  const modelo = 'Las fuentes son esféricas con distribución radial de masa; el cuerpo estudiado está fuera de ellas.';
  const ref = { M: 6e24, m: 600, r: 12e6 }, fuerza = (fuente, prueba, distancia) => G * fuente * prueba / distancia ** 2;
  const Fref = fuerza(ref.M, ref.m, ref.r);

  function figura(c, revelar = false) {
    const tipo = c.tipo, paneles = [], notas = [];
    const esSuma = tipo === 'superposicion' || tipo === 'equilibrio';
    const resultado = c.resultado;
    if (esSuma) {
      const fuera = tipo === 'superposicion' && c.x < 0;
      const origenA = fuera ? 2 : 0, origenB = 6;
      const sonda = tipo === 'equilibrio' ? 3 : fuera ? 0 : 2.5;
      const planetas = [{ c: [origenA, 0], R: 0.48, rotulo: 'A', colorRotulo: 'f' }, { c: [origenB, 0], R: 0.48, rotulo: 'B', colorRotulo: 'f' }];
      notas.push({ texto: `M_A = ${numero(c.MA)} kg`, color: 'f' }, { texto: `M_B = ${numero(c.MB)} kg`, color: 'f' });
      if (c.m != null) notas.push({ texto: `m = ${numero(c.m)} kg`, color: 'f' });
      notas.push({ texto: 'Derecha positiva. Esquema sin escala.' });
      if (revelar) notas.push({ texto: `${tipo === 'equilibrio' ? 'r_A' : 'F_x'} ${c.aproximado ? '≈' : '='} ${numero(resultado)} ${c.unidad}`, color: tipo === 'equilibrio' ? 'i' : 'h' });
      paneles.push({ titulo: tipo === 'equilibrio' ? 'La ubicación está por hallar' : 'Dos fuentes y una sonda', modo: 'radial', planetas,
        satelite: { c: [sonda, 0], rotulo: 'm', colorRotulo: 'f', tam: 9 },
        cotas: [{ de: [origenA, 0], a: [origenB, 0], texto: `D = ${numero(c.D / 1000)} km`, color: 'i' },
          { de: [origenA, 0], a: [sonda, 0], texto: tipo === 'equilibrio' ? 'r_A = ?' : `r_A = ${numero(Math.abs(c.x) / 1000)} km`, color: 'i' }], notas });
    } else {
      const masasConocidas = c.M != null || c.m != null || c.gramos != null;
      if (c.M != null) notas.push({ texto: `M = ${numero(c.M)} kg`, color: 'f' });
      if (c.m != null || c.gramos != null) notas.push({ texto: `m = ${numero(c.gramos == null ? c.m : c.gramos)} ${c.gramos == null ? 'kg' : 'g'}`, color: 'f' });
      if (c.F != null) notas.push({ texto: `F = ${numero(c.F)} N`, color: 'h' });
      if (c.F0 != null) notas.push({ texto: `F_ref = ${numero(c.F0)} N`, color: 'h' });
      if (tipo === 'mutua') notas.push({ texto: `M_A = ${numero(c.ma)} kg; M_B = ${numero(c.mb)} kg`, color: 'f' });
      if (c.kM != null) notas.push({ texto: `M_nueva = ${numero(c.kM)} · M_ref`, color: 'f' });
      if (c.km != null) notas.push({ texto: `m_nueva = ${numero(c.km)} · m_ref`, color: 'f' });
      notas.push({ texto: 'Esquema sin escala de distancias.' });
      if (revelar) notas.push({ texto: `${c.simboloTexto || 'F'} ${c.aproximado ? '≈' : '='} ${numero(resultado)} ${c.unidad}`, color: c.color || 'h' });
      paneles.push({ titulo: masasConocidas ? 'Planeta y sonda' : 'Comparación de ensayos', modo: 'radial',
        planeta: { c: [0, 0], R: 0.7, rotulo: tipo === 'mutua' ? 'A' : 'M', colorRotulo: 'f' },
        satelite: { c: [4, 0], rotulo: tipo === 'mutua' ? 'B' : 'm', colorRotulo: 'f', tam: 9 },
        cotas: [{ de: [0, 0], a: [4, 0], texto: c.r != null || c.rKm != null ? `r = ${numero(dr(c) / 1000)} km` : c.kr != null ? `r_nuevo = ${numero(c.kr)} · r_ref` : 'r = ?', color: 'i' }], notas });
    }
    return { pieza: 'fis-gravitacion', datos: { vista: { x0: -1.25, x1: 7, y0: -1.4, y1: 1.4 }, altoGrafico: 132, paneles,
      alt: esSuma ? 'Dos fuentes A y B y una sonda. Las cotas y notas muestran los datos; el esquema no está a escala y la respuesta no aparece.' : 'Un planeta y una sonda con paneles solares. Las notas muestran los datos conocidos; la separación une sus centros. Esquema sin escala.' }, estado: {} };
  }

  function figuraJuego(k, mostrar = true) {
    const ensayos = [{ titulo: 'Referencia', k: 1 }, { titulo: 'Ensayo elegido', k }];
    return { pieza: 'fis-gravitacion', datos: { vista: { x0: -1.3, x1: 7, y0: -1.4, y1: 1.4 }, altoGrafico: 128, escalas: { F: 40 / Fref },
      paneles: ensayos.map(e => { const distancia = ref.r * e.k, fz = fuerza(ref.M, ref.m, distancia); return {
        titulo: e.titulo, modo: 'radial', planeta: { c: [0, 0], R: 0.65, rotulo: 'M', colorRotulo: 'f' },
        satelite: { c: [2 * e.k, 0], rotulo: 'm', colorRotulo: 'f', tam: 9 },
        cotas: [{ de: [0, 0], a: [2 * e.k, 0], texto: `r ${exacto(distancia / 1000) ? '=' : '≈'} ${numero(distancia / 1000)} km`, color: 'i' }],
        flechas: mostrar ? [{ de: [2 * e.k, 0], d: [-fz, 0], familia: 'F', color: 'h', rotulo: 'F' }] : [],
        notas: [{ texto: 'M = 6 × 10²⁴ kg; m = 600 kg', color: 'f' },
          { texto: mostrar ? `F ≈ ${numero(fz)} N` : 'La fuerza está por medir.', color: mostrar ? 'h' : 'tinta' },
          { texto: 'Separaciones a escala.' }],
      }; }), alt: 'Un planeta y una sonda en dos ensayos. Las masas son las mismas; cambia la separación entre centros. Se comparan dos ensayos didácticos.' }, estado: {} };
  }

  function caso(c) {
    let resultado, unidad = 'N', color = 'h', simbolo = F, simboloTexto = 'F', enunciado;
    const datos = [], solucion = [], errores = [];
    const aproximadoG = c.G != null;
    const error = (id, valorError, causa) => errores.push({ id, valor: valorError, causa });
    const masas = ['El planeta tiene ', valor(c.M, 'kg', 'f'), ' y la sonda, ', valor(c.gramos == null ? c.m : c.gramos, c.gramos == null ? 'kg' : 'g', 'f'), '. '];
    const descR = c.rKm != null ? valor(c.rKm, 'km', 'i') : valor(c.r, 'm', 'i');
    const eq = (s, cuenta, respuesta, u = unidad, col = color, aprox = aproximadoG || !exacto(respuesta)) => [s, aprox ? ' ≈ ' : ' = ', cuenta, aprox ? ' ≈ ' : ' = ', valor(respuesta, u, col)];
    if (['directa', 'masa', 'distancia'].includes(c.tipo)) {
      const distancia = dr(c), masa = dm(c);
      datos.push(modelo, datoG, ley);
      if (c.rKm != null || c.gramos != null) datos.push('1 km = 1000 m; 1 kg = 1000 g.');
      if (c.rKm != null) solucion.push({ texto: 'La separación entre centros se expresa en metros.', ecuacion: [r, ` = ${numero(c.rKm)} · 1000 = ${numero(distancia)} m`] });
      if (c.gramos != null) solucion.push({ texto: 'La masa de la sonda se expresa en kilogramos.', ecuacion: [m, ` = ${numero(c.gramos)} ÷ 1000 = ${numero(masa)} kg`] });
      if (c.tipo === 'directa') {
        resultado = c.G * c.M * masa / distancia ** 2;
        enunciado = [...masas, 'La separación entre centros es ', descR, '. ¿Cuál es el módulo de la fuerza gravitatoria sobre la sonda?'];
        solucion.push({ texto: 'Sustituimos las dos masas y la separación entre centros en la ley de gravitación.', ecuacion: eq(F, { frac: [[numero(c.G), ' · ', lit('f', c.M), ' · ', lit('f', masa)], cuadrado('i', distancia)] }, resultado) });
        error('lineal', c.G * c.M * masa / distancia, 'Bien incluir la distancia; faltó elevarla al cuadrado.');
        error('sin-sonda', c.G * c.M / distancia ** 2, 'Bien usar la fuente; omitiste la masa de la sonda.');
        error('doble', 2 * resultado, 'Bien calcular una fuerza; sumaste las dos fuerzas mutuas.');
        error('signo', -resultado, 'Bien el tamaño; diste signo negativo a un módulo.');
        error('mitad', resultado / 2, 'Bien hallar la atracción; repartiste su módulo entre ambos cuerpos.');
        error('distancia-doble', resultado / 4, 'Bien cuadrar la distancia; antes duplicaste la separación dada.');
        if (c.gramos != null) error('sin-gramos', resultado * 1000, 'Bien convertir la distancia; dejaste la masa en gramos.');
        if (c.rKm != null) error('sin-km', resultado * 1e6, 'Bien usar ambas masas; trataste kilómetros como metros.');
      } else if (c.tipo === 'masa') {
        resultado = c.F * distancia ** 2 / (c.G * c.M); unidad = 'kg'; color = 'f'; simbolo = m; simboloTexto = 'm';
        enunciado = ['Una sonda está a ', descR, ' del centro de un planeta de ', valor(c.M, 'kg', 'f'), '. La atracción vale ', valor(c.F, 'N', 'h'), '. ¿Qué masa tiene la sonda?'];
        solucion.push({ texto: 'Multiplicamos la fuerza por el cuadrado de la distancia y dividimos entre G por M.', ecuacion: eq(m, { frac: [[lit('h', c.F), ' · ', cuadrado('i', distancia)], [numero(c.G), ' · ', lit('f', c.M)]] }, resultado) });
        error('lineal', c.F * distancia / (c.G * c.M), 'Bien despejar la masa; usaste la distancia sin cuadrar.');
        error('inversa', (c.G * c.M) / (c.F * distancia ** 2), 'Bien reunir los datos; invertiste el cociente completo.');
        error('doble', 2 * resultado, 'Bien despejar; contaste dos veces la fuerza dada.');
        error('mitad', resultado / 2, 'Bien usar el módulo; repartiste la fuerza entre dos.');
        error('signo', -resultado, 'Bien el tamaño; una masa no lleva signo negativo.');
      } else {
        resultado = Math.sqrt(c.G * c.M * masa / c.F) / 1000; unidad = 'km'; color = 'i'; simbolo = r; simboloTexto = 'r';
        enunciado = [...masas, 'La atracción tiene módulo ', valor(c.F, 'N', 'h'), '. ¿Cuál es la separación entre centros, en kilómetros?'];
        datos.push('1 km = 1000 m.');
        solucion.push({ texto: 'Despejamos el cuadrado de la separación. La raíz positiva da una distancia.', ecuacion: eq(r, [{ raiz: [{ frac: [[numero(c.G), ' · ', lit('f', c.M), ' · ', lit('f', masa)], lit('h', c.F)] }] }, ' ÷ 1000'], resultado) });
        error('sin-raiz', (c.G * c.M * masa / c.F) / 1000, 'Bien despejar el cuadrado; faltó sacar la raíz.');
        error('sin-km', resultado * 1000, 'Bien hallar metros; faltó convertirlos a kilómetros.');
        error('doble', 2 * resultado, 'Bien hallar la separación; la confundiste con un diámetro.');
        error('mitad', resultado / 2, 'Bien la raíz; dividiste otra vez entre dos.');
        error('signo', -resultado, 'Bien el tamaño; una separación no es negativa.');
      }
    } else if (c.tipo === 'mutua') {
      resultado = c.F0;
      enunciado = ['Un planeta A tiene ', valor(c.ma, 'kg', 'f'), ' y una sonda B, ', valor(c.mb, 'kg', 'f'), '. A atrae a B con ', valor(c.F0, 'N', 'h'), '. ¿Con qué módulo de fuerza B atrae a A?'];
      datos.push('Las fuerzas gravitatorias mutuas tienen igual módulo y sentidos opuestos; actúan sobre cuerpos distintos.');
      solucion.push({ texto: 'La tercera ley de Newton iguala los módulos de estas dos fuerzas, aunque las masas sean distintas.', ecuacion: [sub(F, 'sobre A'), ' = ', sub(F, 'sobre B'), ` = ${numero(resultado)} N`] });
      error('por-masas', c.F0 * c.mb / c.ma, 'Bien comparar masas; aumentaste una de las fuerzas mutuas.');
      error('inversa-masas', c.F0 * c.ma / c.mb, 'Bien distinguir cuerpos; redujiste una de las fuerzas mutuas.');
      error('doble', 2 * c.F0, 'Bien reconocer dos fuerzas; sumaste sus módulos.');
      error('cero', 0, 'Bien notar sentidos opuestos; cancelaste fuerzas sobre cuerpos distintos.');
      error('mitad', c.F0 / 2, 'Bien reconocer dos cuerpos; repartiste la fuerza entre ambos.');
      error('signo', -c.F0, 'Bien invertir el sentido; un módulo no es negativo.');
    } else if (['razon', 'masa-razon', 'distancia-razon'].includes(c.tipo)) {
      datos.push('Los subíndices ref y nuevo distinguen el ensayo de referencia del ensayo modificado.', leyRazones);
      if (c.tipo === 'razon') {
        resultado = c.F0 * c.kM * c.km / c.kr ** 2;
        enunciado = ['La atracción de referencia es ', valor(c.F0, 'N', 'h'), '. La masa fuente pasa a ', q('f', factor(c.kM)), ', la masa atraída a ', q('f', factor(c.km)), ' y la separación a ', q('i', factor(c.kr)), ' sus valores originales. ¿Cuál es la nueva fuerza?'];
        solucion.push({ texto: 'Las dos masas multiplican la fuerza; el factor de separación aparece elevado al cuadrado.', ecuacion: eq(Fn, [lit('h', c.F0), ' · ', lit('f', c.kM), ' · ', lit('f', c.km), ' ÷ ', cuadrado('i', c.kr)], resultado) });
        error('lineal', c.F0 * c.kM * c.km / c.kr, 'Bien cambiar las masas; dividiste solo una vez por distancia.');
        error('sin-distancia', c.F0 * c.kM * c.km, 'Bien multiplicar las masas; omitiste el cambio de separación.');
        error('sin-masas', c.F0 / c.kr ** 2, 'Bien cuadrar la separación; omitiste los cambios de masa.');
        error('sin-fuente', c.F0 * c.km / c.kr ** 2, 'Bien cambiar la sonda; omitiste la masa fuente.');
        error('sin-sonda', c.F0 * c.kM / c.kr ** 2, 'Bien cambiar la fuente; omitiste la otra masa.');
        error('multiplica-distancia', c.F0 * c.kM * c.km * c.kr ** 2, 'Bien cuadrar la separación; multiplicaste en vez de dividir.');
        error('signo', -resultado, 'Bien el tamaño; un módulo de fuerza no es negativo.');
      } else if (c.tipo === 'masa-razon') {
        resultado = c.F1 / c.F0 * c.kr ** 2 / c.km; unidad = 'veces'; color = 'f'; simbolo = [sub(M, 'nueva'), '/', sub(M, 'ref')]; simboloTexto = 'M_nueva/M_ref';
        enunciado = ['La atracción pasa de ', valor(c.F0, 'N', 'h'), ' a ', valor(c.F1, 'N', 'h'), '. La masa atraída pasa a ', q('f', factor(c.km)), ' y la separación a ', q('i', factor(c.kr)), ' las originales. ¿Por qué factor cambió la masa fuente?'];
        solucion.push({ texto: 'Aislamos el factor de masa fuente; compensamos el cambio de la otra masa y de la separación.', ecuacion: eq(simbolo, [{ frac: [lit('h', c.F1), lit('h', c.F0)] }, ' · ', cuadrado('i', c.kr), ' ÷ ', lit('f', c.km)], resultado) });
        error('lineal', c.F1 / c.F0 * c.kr / c.km, 'Bien comparar fuerzas; compensaste la distancia sin cuadrar.');
        error('sin-distancia', c.F1 / c.F0 / c.km, 'Bien comparar masas; omitiste el cambio de separación.');
        error('inversa', 1 / resultado, 'Bien reunir factores; invertiste el cociente pedido.');
        error('multiplica-sonda', c.F1 / c.F0 * c.kr ** 2 * c.km, 'Bien cuadrar la distancia; multiplicaste el factor de sonda.');
        error('doble', 2 * resultado, 'Bien aislar el factor; duplicaste el resultado.');
      } else {
        resultado = Math.sqrt(c.F0 * c.kM * c.km / c.F1); unidad = 'veces'; color = 'i'; simbolo = [sub(r, 'nuevo'), '/', sub(r, 'ref')]; simboloTexto = 'r_nuevo/r_ref';
        enunciado = ['La atracción pasa de ', valor(c.F0, 'N', 'h'), ' a ', valor(c.F1, 'N', 'h'), '. La fuente pasa a ', q('f', factor(c.kM)), ' su masa y la sonda a ', q('f', factor(c.km)), '. ¿Por qué factor cambió la separación?'];
        solucion.push({ texto: 'El balance de factores da el cuadrado del factor de distancia; tomamos su raíz positiva.', ecuacion: eq(simbolo, { raiz: [{ frac: [[lit('h', c.F0), ' · ', lit('f', c.kM), ' · ', lit('f', c.km)], lit('h', c.F1)] }] }, resultado) });
        error('sin-raiz', resultado ** 2, 'Bien hallar el cuadrado; faltó sacar la raíz.');
        error('inversa', 1 / resultado, 'Bien sacar una raíz; invertiste el factor pedido.');
        error('sin-masas', Math.sqrt(c.F0 / c.F1), 'Bien comparar fuerzas; omitiste los cambios de masa.');
        error('sin-sonda', Math.sqrt(c.F0 * c.kM / c.F1), 'Bien cambiar la fuente; omitiste la masa de la sonda.');
        error('doble', 2 * resultado, 'Bien despejar la distancia; duplicaste el factor hallado.');
      }
    } else if (c.tipo === 'superposicion') {
      const a = c.G * c.MA * c.m / c.x ** 2, b = c.G * c.MB * c.m / (c.D - c.x) ** 2;
      const sa = Math.sign(-c.x), sb = Math.sign(c.D - c.x);
      resultado = sa * a + sb * b; simbolo = Fx; simboloTexto = 'F_x';
      enunciado = ['A y B tienen ', valor(c.MA, 'kg', 'f'), ' y ', valor(c.MB, 'kg', 'f'), '. Sus centros están separados ', valor(c.D / 1000, 'km', 'i'), '. Una sonda de ', valor(c.m, 'kg', 'f'), ' está ', valor(Math.abs(c.x) / 1000, 'km', 'i'), c.x < 0 ? ' a la izquierda de A.' : ' a la derecha de A, entre ambas.', ' ¿Cuál es la fuerza horizontal neta?'];
      datos.push(modelo, datoG, 'A está a la izquierda de B. Derecha positiva; r_A y r_B son separaciones entre centros.',
        'F_A = G·M_A·m/r_A²; F_B = G·M_B·m/r_B². Cada fuerza apunta hacia su fuente.',
        '1 km = 1000 m. La componente neta es la suma de componentes de las dos fuerzas.');
      solucion.push({ texto: 'Determinamos las dos separaciones; cada atracción apunta desde la sonda hacia su fuente.', ecuacion: [sub(r, 'A'), ` = ${numero(Math.abs(c.x))} m; `, sub(r, 'B'), ` = ${numero(c.D - c.x)} m`] });
      solucion.push({ texto: 'Calculamos por separado los módulos de las fuerzas gravitatorias.', ecuacion: [sub(F, 'A'), ` ≈ ${numero(a)} N; `, sub(F, 'B'), ` ≈ ${numero(b)} N`] });
      solucion.push({ texto: 'Sumamos sus componentes sin redondear los valores intermedios. El signo identifica el sentido.', ecuacion: [Fx, ' = ', `${sa < 0 ? '−' : ''}F_A ${sb < 0 ? '−' : '+'} F_B ≈ `, valor(resultado, 'N', 'h')] });
      error('modulos', a + b, 'Bien hallar ambas fuerzas; sumaste módulos sin sus sentidos.');
      error('signo', -resultado, 'Bien combinar fuerzas; invertiste el sentido resultante.');
      error('solo-a', sa * a, 'Bien calcular A; omitiste la atracción de B.');
      error('solo-b', sb * b, 'Bien calcular B; omitiste la atracción de A.');
      error('resta-modulos', a - b, 'Bien hallar módulos; restaste sin identificar los sentidos.');
      error('doble', 2 * resultado, 'Bien sumar componentes; contaste dos veces la resultante.');
    } else if (c.tipo === 'equilibrio') {
      resultado = c.D * Math.sqrt(c.MA) / (Math.sqrt(c.MA) + Math.sqrt(c.MB)) / 1000;
      unidad = 'km'; color = 'i'; simbolo = sub(r, 'A'); simboloTexto = 'r_A';
      enunciado = ['Dos fuentes A y B tienen masas ', valor(c.MA, 'kg', 'f'), ' y ', valor(c.MB, 'kg', 'f'), ', separadas ', valor(c.D / 1000, 'km', 'i'), '. Entre sus centros, ¿a qué distancia de A se anula la fuerza neta sobre una sonda?'];
      datos.push(modelo, 'Entre las fuentes, las atracciones tienen sentidos opuestos; la fuerza neta nula exige módulos iguales.',
        'F_A = G·M_A·m/r_A²; F_B = G·M_B·m/r_B²; r_A + r_B = D.', '1 km = 1000 m. D es la separación entre los centros de A y B.');
      const razon = Math.sqrt(c.MB / c.MA);
      solucion.push({ texto: 'Igualamos los módulos. La constante G y la masa de la sonda se cancelan.', ecuacion: [{ frac: [sub(r, 'B'), sub(r, 'A')] }, ' = ', { raiz: [{ frac: [lit('f', c.MB), lit('f', c.MA)] }] }, exacto(razon) ? ' = ' : ' ≈ ', numero(razon)] });
      solucion.push({ texto: 'Las dos separaciones suman D; despejamos la distancia desde A.', ecuacion: eq(simbolo, { frac: [lit('i', c.D / 1000), ['1 + ', { raiz: [{ frac: [lit('f', c.MB), lit('f', c.MA)] }] }]] }, resultado) });
      error('mitad', c.D / 2000, 'Bien buscar entre ambas; supusiste masas iguales.');
      error('lineal', c.D * c.MA / (c.MA + c.MB) / 1000, 'Bien comparar masas; usaste la proporción sin raíz.');
      error('desde-b', c.D / 1000 - resultado, 'Bien hallar el punto; mediste desde B en vez de A.');
      error('sin-suma', c.D * Math.sqrt(c.MA / c.MB) / 1000, 'Bien obtener una razón; omitiste sumar las dos separaciones.');
      error('doble', 2 * resultado, 'Bien ubicar el punto; duplicaste la distancia desde A.');
    } else throw new Error(`Tipo desconocido en ley universal: ${c.tipo}`);
    const aproximado = aproximadoG || !exacto(resultado);
    const vistos = new Set([textoValor(resultado, unidad, aproximadoG)]);
    const distintos = errores.filter(e => {
      if (!Number.isFinite(e.valor)) return false;
      const k = textoValor(e.valor, unidad, aproximadoG);
      if (vistos.has(k)) return false; vistos.add(k); return true;
    }).sort((a, b) => {
      const prioridad = e => Math.abs(e.valor / resultado) >= 0.05 && Math.abs(e.valor / resultado) <= 20 ? 0 : 1;
      return prioridad(a) - prioridad(b);
    }).map(e => ({ ...e, texto: textoValor(e.valor, unidad, aproximadoG), error: `GR1-${e.id.toUpperCase()}`, siFuera: `${e.causa} Así sale ${textoValor(e.valor, unidad, aproximadoG)}.` }));
    return { enunciado, datos, solucion, resultado, unidad, color, simbolo, aproximado, errores: distintos,
      respuesta: [simbolo, aproximado ? ' ≈ ' : ' = ', valor(resultado, unidad, color)],
      dibujo: figura({ ...c, resultado, unidad, color, simboloTexto, aproximado }),
      verificacion: { ...c, respuesta: { valor: resultado, unidad, aproximado }, errores: distintos.map(e => ({ id: e.id, valor: e.valor })) } };
  }

  const casosEjemplo = [
    { tipo: 'razon', nivel: 1, titulo: 'Cambia una masa', F0: 54, kM: 3, km: 1, kr: 1 },
    { tipo: 'razon', nivel: 1, titulo: 'Cambia la separación', F0: 81, kM: 1, km: 1, kr: 3 },
    { tipo: 'directa', nivel: 1, titulo: 'La atracción sobre una sonda', G, M: 4e24, m: 500, r: 1e7 },
    { tipo: 'directa', nivel: 1, titulo: 'Una sonda más lejana', G, M: 8e24, m: 300, r: 2e7 },
    { tipo: 'mutua', nivel: 1, titulo: 'La fuerza sobre el otro cuerpo', F0: 75, ma: 2e24, mb: 500 },
    { tipo: 'directa', nivel: 2, titulo: 'Gramos y kilómetros', G, M: 3e24, gramos: 75000, rKm: 9000 },
    { tipo: 'directa', nivel: 2, titulo: 'Todas las magnitudes en el SI', G, M: 5e24, gramos: 160000, rKm: 20000 },
    { tipo: 'masa', nivel: 2, titulo: 'La masa desconocida', G, M: 4e24, F: 667, r: 1e7 },
    { tipo: 'distancia', nivel: 2, titulo: 'Una separación en kilómetros', G, M: 6e24, m: 800, F: 800.4 },
    { tipo: 'masa-razon', nivel: 2, titulo: 'Reconstruir el cambio de masa', F0: 32, F1: 72, km: 1, kr: 2 },
    { tipo: 'razon', nivel: 3, titulo: 'Tres cambios en un mismo ensayo', F0: 450, kM: 3, km: 0.5, kr: 1.5 },
    { tipo: 'distancia-razon', nivel: 3, titulo: 'La separación que explica el resultado', F0: 180, F1: 80, kM: 2, km: 2 },
    { tipo: 'superposicion', nivel: 3, titulo: 'Una sonda entre dos fuentes', G, MA: 2e24, MB: 3e24, m: 100, D: 1e7, x: 4e6 },
    { tipo: 'equilibrio', nivel: 3, titulo: 'El punto de fuerza nula', MA: 16e24, MB: 9e24, D: 1e7 },
    { tipo: 'superposicion', nivel: 3, titulo: 'La sonda queda a la izquierda', G, MA: 4e24, MB: 2e24, m: 120, D: 9e6, x: -3e6 },
  ];
  const causasCortas = {
    lineal: 'usa la distancia sin elevarla al cuadrado', 'sin-distancia': 'omite la separación', 'sin-masas': 'omite las masas',
    'sin-fuente': 'omite la fuente', 'sin-sonda': 'omite la sonda', 'multiplica-distancia': 'multiplica por distancia cuadrada',
    signo: 'invierte el signo', 'sin-raiz': 'omite la raíz', inversa: 'invierte el cociente',
    doble: 'duplica el resultado', modulos: 'suma módulos', 'solo-a': 'solo cuenta A', 'solo-b': 'solo cuenta B',
    'resta-modulos': 'resta módulos', mitad: 'supone masas iguales', 'desde-b': 'mide desde B', 'sin-suma': 'omite sumar separaciones',
  };
  let indiceLetra = 0;
  const ejemplos = casosEjemplo.map(c => {
    const b = caso(c), e = { nivel: c.nivel, titulo: c.titulo, enunciado: b.enunciado, datos: b.datos, figura: b.dibujo,
      solucion: b.solucion.slice(), respuesta: b.respuesta, verificacion: b.verificacion };
    if (c.nivel === 3) {
      const incorrectas = b.errores.slice(0, 4);
      if (incorrectas.length !== 4) throw new Error(`Faltan errores distintos en ${c.titulo}`);
      e.alternativas = incorrectas.map(x => x.texto);
      e.alternativas.splice(indiceLetra++, 0, textoValor(b.resultado, b.unidad, c.G != null));
      e.solucion.push({ texto: incorrectas.map(x => `${textoValor(x.valor, '', c.G != null)}: ${causasCortas[x.id]}.`).join(' ') });
    }
    return e;
  });

  function entrada(semilla, resuelto) {
    const s = Math.abs(Math.trunc(semilla));
    const tipos = ['razon', 'directa', 'masa', 'distancia', 'masa-razon', 'superposicion', 'equilibrio', 'mutua', 'distancia-razon'];
    const tipo = tipos[s % tipos.length], k = 1 + Math.floor(s / tipos.length) % 9, z = Math.floor(s / 81) % 8;
    const fuente = (resuelto ? 12 + z : 2 + z) * 1e24;
    if (tipo === 'razon') return { tipo, F0: (resuelto ? 810 : 310) + 10 * k + z, kM: 2 + z % 3, km: 1 + (k % 3) / 2, kr: 1.5 + (k % 3) / 2 };
    if (tipo === 'directa') return { tipo, G, M: fuente, m: (resuelto ? 410 : 110) + 10 * k, r: (7 + k) * 1e6 };
    if (tipo === 'masa') { const radio = resuelto ? 2e7 : 1e7, masa = (resuelto ? 400 : 80) + 40 * k; return { tipo, G, M: fuente, r: radio, F: Math.round(G * fuente * masa / radio ** 2 * 1000) / 1000 }; }
    if (tipo === 'distancia') { const masa = (500 + 20 * z) * k ** 2, radio = (resuelto ? 2e7 : 1e7) * k; return { tipo, G, M: fuente, m: masa, F: Math.round(G * fuente * masa / radio ** 2 * 1000) / 1000 }; }
    if (tipo === 'masa-razon') return { tipo, F0: resuelto ? 420 + 10 * z : 210 + 10 * z, F1: (resuelto ? 180 : 90) + 6 * k, km: 1.5, kr: 2 + z % 2 };
    if (tipo === 'mutua') return { tipo, F0: (resuelto ? 220 : 95) + 7 * k + 5 * z, ma: (resuelto ? 10 + z : 1 + z) * 2e24, mb: (resuelto ? 1600 : 1000) + 50 * k };
    if (tipo === 'distancia-razon') {
      const F0 = (resuelto ? 36000 : 3600) + 3600 * z, kM = 2 + k % 3, km = 1 + k % 2, kr = 2 + k % 4;
      return { tipo, F0, F1: F0 * kM * km / kr ** 2, kM, km };
    }
    if (tipo === 'superposicion') return { tipo, G, MA: (resuelto ? 5 : 3) * 1e24, MB: (2 + z) * 1e24, m: (resuelto ? 45 : 15) + 5 * k, D: 12e6, x: (resuelto ? -1 : 1) * (2 + k % 3) * 1e6 };
    return { tipo, MA: (resuelto ? 2.25 : 4) * 1e24, MB: (k + 3) ** 2 * 1e24, D: (9 + z) * 1e6 };
  }
  function generar(semilla, resuelto) {
    const b = caso(entrada(semilla, resuelto));
    if (b.errores.length < 3) throw new Error(`Faltan alternativas en semilla ${semilla}: ${b.verificacion.tipo}`);
    if (resuelto) return { enunciado: b.enunciado, datos: b.datos, dibujo: b.dibujo, respuesta: b.respuesta, verificacion: b.verificacion,
      pasos: [{ tipo: 'pide', texto: 'Identificamos la magnitud pedida y a qué cuerpo o separación pertenece.' },
        { tipo: 'regla', texto: b.verificacion.tipo === 'superposicion' ? 'Calculamos cada fuerza y sumamos sus componentes sobre la misma sonda.' : 'La ley usa ambas masas y la separación entre centros al cuadrado.' },
        ...b.solucion.map(x => ({ tipo: 'cuentas', ...x })),
        { tipo: 'sentido', texto: b.verificacion.tipo === 'superposicion' ? 'El signo señala el sentido de la fuerza neta sobre la sonda.' : 'Comprobamos la unidad pedida. Los módulos, las masas y las separaciones son no negativos.' }] };
    return { pregunta: b.enunciado, datos: b.datos, dibujo: b.dibujo, verificacion: b.verificacion,
      opciones: [{ id: 'c', texto: textoValor(b.resultado, b.unidad, b.verificacion.G != null), correcta: true }, ...b.errores.slice(0, 3).map(x => ({ id: x.id, texto: x.texto, error: x.error, siFuera: x.siFuera }))],
      solucion: { texto: b.verificacion.tipo === 'superposicion' ? 'Cada atracción apunta hacia su fuente. Sumamos las componentes sin redondear los pasos intermedios.' : 'Aplicamos la ley a las mismas masas y separaciones que da el problema.', ecuacion: b.solucion.at(-1).ecuacion } };
  }
  const pred = { tipo: 'razon', F0: 160, kM: 2, km: 3, kr: 2 };
  const predCaso = caso(pred);
  const predErrores = ['lineal', 'sin-distancia', 'sin-masas'].map(id => predCaso.errores.find(e => e.id === id));
  const idea = {
    id: 'cuadrado-inverso', titulo: 'Ley de gravitación universal',
    pregunta: '¿Cómo cambia la atracción cuando cambian las masas y la separación?',
    aprendizaje: 'Calculas la atracción entre cuerpos y distingues el efecto de cada masa y de la distancia entre centros.',
    actividad: 'Comparar dos ensayos con las mismas masas y distinta separación entre centros.',
    temas: ['Ley de gravitación universal'], pieza: 'fis-gravitacion',
    lee: { tarjetas: [
      { titulo: 'Un planeta y una sonda', texto: ['La ley de gravitación universal describe una atracción entre cuerpos con masa. En estos ensayos didácticos comparamos un planeta y una sonda con paneles solares. La fuerza sobre la sonda apunta hacia el planeta.'], dibujo: figuraJuego(1.5, false) },
      { titulo: 'De centro a centro', texto: ['La distancia entre centros se escribe ', r, '. La cota une el centro del planeta con el centro de la sonda. No mide desde la superficie. Las masas se escriben ', M, ' y ', m, ', en kilogramos.'] },
      { titulo: 'Qué medimos en cada ensayo', texto: ['El módulo de la fuerza ', F, ' se mide en newtons. La constante de gravitación universal se escribe G. Usaremos G ≈ 6,67 × 10⁻¹¹ N·m²/kg². El subíndice ref identifica el ensayo de referencia.'] },
    ] },
    juega: {
      consigna: 'Compara ensayos con las mismas masas. Cambia la separación entre centros y observa cómo cambia la atracción sobre la sonda.',
      voz: 'La referencia queda fija. El ensayo elegido cambia de separación.',
      controles: [{ id: 'k', etiqueta: 'Separación respecto de la referencia', min: 1, max: 3, paso: 0.5, inicio: 1, unidad: 'veces', decimales: 1, color: 'c-i', auto: { velocidad: 0.25, modo: 'rebota' } }],
      mision: { texto: 'Haz que la fuerza sea la cuarta parte de la referencia.',
        logrado: a => Math.abs(fuerza(ref.M, ref.m, ref.r * a.k) / Fref - 0.25) < 1e-10,
        testigo: [{ k: 2 }], bien: 'La fuerza del ensayo coincide con la fracción que buscabas.' },
      dibujo: a => figuraJuego(a.k),
      lectura: a => { const proporcion = fuerza(ref.M, ref.m, ref.r * a.k) / Fref; return a.k === 1 ? 'Ahora atrae lo mismo que en la referencia.' : ['Ahora atrae ', q('h', `${exacto(proporcion) ? '' : '≈ '}${numero(proporcion)}`), ' veces lo que atraía en la referencia.']; },
      leyenda: [{ s: M, t: 'masa de la fuente, en kilogramos' }, { s: m, t: 'masa de la sonda, en kilogramos' },
        { s: r, t: 'distancia entre centros, en kilómetros en la figura' }, { s: F, t: 'módulo de fuerza gravitatoria, en newtons' }], minimo: 2,
    },
    predice: {
      pregunta: 'Ahora cambian las dos masas y la separación. ¿Cuál es el nuevo módulo de la fuerza gravitatoria?',
      datos: ['La fuerza de referencia es 160 N.', 'La masa fuente se duplica y la masa de la sonda se triplica.', 'La separación entre centros también se duplica.'],
      dibujo: figura(pred), revelar: figura({ ...pred, resultado: predCaso.resultado, unidad: 'N', color: 'h', simboloTexto: 'F_nueva', aproximado: false }, true),
      opciones: [{ id: 'c', texto: textoValor(predCaso.resultado, 'N', false), correcta: true }, ...predErrores.map(e => ({ id: e.id, texto: e.texto, error: e.error, siFuera: e.siFuera }))],
      coincide: 'Las dos masas aumentan la atracción; la mayor separación la reduce. Hay que combinar los tres cambios.',
      verificacion: predCaso.verificacion,
    },
    mira: {
      pieza: 'fis-gravitacion', datos: { ...figura(pred).datos, cortes: [figura(pred).datos, figura({ ...pred, resultado: predCaso.resultado, unidad: 'N', color: 'h', simboloTexto: 'F_nueva' }, true).datos] },
      pasos: [
        { estado: { corte: 0 }, texto: 'Comparamos con la referencia: G es la misma constante en ambos ensayos.', ecuacion: leyRazones },
        { estado: { corte: 0 }, texto: 'Las dos masas multiplican juntas el numerador.', ecuacion: ['Factor de masas = 2 · 3 = 6'] },
        { estado: { corte: 0 }, texto: 'La separación duplicada aparece al cuadrado en el denominador.', ecuacion: ['Factor de separación = 2² = 4'] },
        { estado: { corte: 1 }, texto: 'Multiplicamos la fuerza de referencia por el factor combinado.', ecuacion: [Fn, ` = 160 · 6 ÷ 4 = ${numero(predCaso.resultado)} N`] },
      ],
    },
    regla: {
      texto: 'La atracción depende de ambas masas y del cuadrado de su separación. Las fuerzas mutuas tienen igual módulo y sentidos opuestos; actúan sobre cuerpos distintos.',
      ecuacion: [F, ' = ', { frac: [['G · ', M, ' · ', m], { sup: [r, '2'] }] }],
      condicion: 'Cuerpos puntuales o fuentes esféricas con distribución radial; se evalúa fuera de ellas y se mide desde sus centros.',
      voz: 'Con varias fuentes, calcula cada atracción y suma sus componentes sobre el mismo cuerpo.',
      dibujo: figura({ tipo: 'directa', M: 5e24, m: 200, r: 1.5e7, G }),
    },
    ejemplos,
    resuelve: { pieza: 'fis-gravitacion', generar: s => generar(s, true) },
    ahoraTu: { pieza: 'fis-gravitacion', generar: s => generar(s, false) },
  };
  const glosario = [
    { termino: 'ley de gravitación universal', simple: 'La descripción de la atracción entre cuerpos con masa.',
      def: 'Ley que relaciona la atracción entre cuerpos con sus masas y la separación entre sus centros.',
      ejemplos: ['La Tierra atrae una sonda.', 'Una sonda también atrae a la Tierra.', 'Dos esferas con masa se atraen aunque no se toquen.'] },
    { termino: 'distancia entre centros', simbolo: 'r', medida: 'm', simple: 'La longitud que une los centros de los dos cuerpos.',
      def: 'Longitud del segmento entre los centros de los cuerpos; no empieza en la superficie del planeta.',
      ejemplos: ['La cota puede partir del centro dibujado de un planeta.', 'La distancia entre dos centros se expresa en metros.', 'La altura sobre una superficie y la distancia entre centros son medidas distintas.'] },
    { termino: 'constante de gravitación universal', simbolo: 'G', medida: 'N·m²/kg²', simple: 'Una constante medida que aparece en la ley de gravitación.',
      def: 'Constante medida experimentalmente que relaciona masas, separación y fuerza en la ley gravitacional.',
      ejemplos: ['G se distingue de una masa.', 'El ejercicio indica qué aproximación de G utiliza.', 'Cambiar la sonda no significa cambiar G.'] },
  ];
  const letras = { G: 'constante de gravitación universal', M: 'masa de la fuente', m: 'masa del cuerpo atraído',
    r: 'distancia entre centros', F: 'módulo de fuerza gravitatoria', F_x: 'componente horizontal de fuerza gravitatoria',
    k: 'factor de separación respecto de la referencia', A: 'primera fuente o primer cuerpo', B: 'segunda fuente o segundo cuerpo',
    D: 'distancia entre los centros de las fuentes A y B', x: 'coordenada horizontal de la sonda medida desde A',
    r_A: 'separación entre A y la sonda', r_B: 'separación entre B y la sonda',
    F_ref: 'fuerza de referencia', F_nueva: 'fuerza del ensayo modificado', M_ref: 'masa fuente de referencia', M_nueva: 'masa fuente modificada',
    m_ref: 'masa de la sonda de referencia', m_nueva: 'masa de la sonda modificada', r_ref: 'separación de referencia', r_nuevo: 'separación modificada' };
  return { idea, glosario, letras };
}

  const gr1 = construirGr1(Kit);
  return {
    unidad: 'fisica.gravitacion',
    version: '0.3.0',
    estado: 'completa',
    letras: gr1.letras,
    requiere: ['/nucleo/kit/piezas/fis-gravitacion.js', '/nucleo/kit/piezas/fis-lienzo.js', '/plantillas/gravitacion/motor.js', '/nucleo/fisica3d.js', '/nucleo/kit/piezas/fis-espacio-3d.js'],
    // Glosario del tema (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso. Período, MCU y
    // aceleración centrípeta vienen del movimiento circular; fuerza centrípeta, de dinámica.
    glosario: [...gr1.glosario, ...[
      { termino: 'ley de gravitación universal', def: 'Dos masas se atraen con una fuerza proporcional a ellas e inversa al cuadrado de su distancia.',
        ejemplo: 'A doble distancia del centro, la cuarta parte: 800 N pasan a 200 N.', ver: ['constante de gravitación universal', 'campo gravitatorio'] },
      { termino: 'constante de gravitación universal', simbolo: 'G', medida: 'N·m²/kg²',
        def: 'Número fijo de la ley de atracción entre masas; vale lo mismo en todo el universo.',
        ejemplo: 'G ≈ 6,67 × 10⁻¹¹ N·m²/kg²: por eso dos personas casi no se atraen.', ver: ['ley de gravitación universal'] },
      { termino: 'campo gravitatorio', simbolo: 'g', medida: 'N/kg', def: 'Fuerza de gravedad por cada kilogramo en un punto; lo crea la masa que atrae.',
        ejemplo: 'A 2 R del centro de la Tierra: g = 10 / 2² = 2,5 N/kg.', ver: ['gravedad', 'peso'] },
      { termino: 'órbita', def: 'Camino cerrado que sigue un cuerpo alrededor de otro que lo atrae.',
        ejemplo: 'La Luna da una vuelta a la Tierra en unos 27 días.', ver: ['satélite', 'elipse'] },
      { termino: 'satélite', def: 'Cuerpo que gira alrededor de un planeta, atraído por él, como la Luna o una estación espacial.',
        ver: ['órbita', 'velocidad orbital'] },
      { termino: 'velocidad orbital', simbolo: 'v', medida: 'km/s', formas: ['velocidad orbital', 'rapidez orbital'],
        def: 'Rapidez que necesita un satélite para girar en círculo a cierta distancia del centro: v = √(GM/r).',
        ejemplo: 'Rasante a la Tierra, 8 km/s; a 4 R del centro, 4 km/s.', ver: ['fuerza centrípeta'] },
      { termino: 'elipse', def: 'Curva cerrada y ovalada; la suma de las distancias de cada punto a dos puntos fijos es constante.',
        ver: ['primera ley de Kepler', 'semieje mayor'] },
      { termino: 'semieje mayor', simbolo: 'a', def: 'La mitad del diámetro más largo de una elipse; en un círculo, es el radio.',
        ejemplo: 'Órbita de la Tierra alrededor del Sol: a = 1 UA.', ver: ['tercera ley de Kepler'] },
      { termino: 'unidad astronómica', simbolo: 'UA', def: 'Distancia media entre la Tierra y el Sol, unos 150 millones de km; sirve para medir órbitas.',
        ejemplo: 'Un planeta a 4 UA está cuatro veces más lejos del Sol que la Tierra.' },
      { termino: 'primera ley de Kepler', def: 'Cada planeta gira en una elipse con el Sol en uno de sus dos puntos especiales, no al centro.',
        ejemplo: 'Con e = 0 la elipse es un círculo y el Sol queda al centro.', ver: ['elipse'] },
      { termino: 'segunda ley de Kepler', def: 'La línea Sol–planeta barre áreas iguales en tiempos iguales: cerca del Sol, el planeta va más rápido.',
        ejemplo: 'Con e = 0,4, cerca del Sol va 1,4 / 0,6 ≈ 2,33 veces más rápido.', ver: ['primera ley de Kepler'] },
      { termino: 'tercera ley de Kepler', def: 'El período al cuadrado es proporcional al cubo del semieje mayor, igual para todo lo que gira al mismo astro.',
        ejemplo: 'A 4 UA: T² = 4³ = 64, así que T = 8 años.', ver: ['semieje mayor', 'período'] },
    ].filter(g => !gr1.glosario.some(n => n.termino === g.termino))],
    // Laboratorio: juego libre, sin preguntas. Dos órbitas a la vez para comparar (la idea muestra una sola); la
    // elipse libre deja cualquier excentricidad de 0 a 0,75 y cuenta cuánto más lento va lejos del Sol.
    laboratorio: [
      mesaPlano,
      {
        id: 'dos-orbitas', titulo: 'Dos satélites lado a lado', pieza: 'fis-lienzo',
        consigna: 'Arrastra los satélites A y B a órbitas distintas. Compara sus rapideces y cuánto tarda cada vuelta.',
        controles: DOS,
        dibujo: val => ({ datos: dosOrbitas(val.r1, val.r2), estado: {} }),
        lectura: val => [`A: ${f(vOrb(val.r1), 2)} km/s, ${f(tOrb(val.r1), 1)} h · B: ${f(vOrb(val.r2), 2)} km/s, ${f(tOrb(val.r2), 1)} h`],
        invitaciones: [
          { texto: 'Haz que los dos satélites vayan igual de rápido.',
            logrado: val => Math.abs(vOrb(val.r1) - vOrb(val.r2)) < 1e-9,
            bien: 'Misma órbita, misma rapidez: la masa del satélite no entra en la cuenta.' },
          { texto: 'Haz que B sea lo más rápido posible.',
            logrado: val => vOrb(val.r2) >= vOrb(DOS[1].min) - 1e-9,
            bien: 'A 1 R va a 8 km/s: la órbita más baja es la más rápida.' },
          { texto: 'Haz que una vuelta de A dure 8 veces lo que una de B.',
            logrado: val => Math.abs(tOrb(val.r1) / tOrb(val.r2) - 8) < 1e-9,
            bien: 'Cuatro veces más lejos, ocho veces más tiempo: T² crece como r³.' },
        ],
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
        lectura: val => [val.e === 0 ? 'e = 0: la misma rapidez en toda la vuelta' : `e = ${f(val.e, 2)}: cerca del Sol va ${f(cercaLejos(val.e), 2)} veces más rápido que lejos`],
        invitaciones: [
          { texto: 'Haz que cerca del Sol vaya justo 4 veces más rápido que lejos.',
            logrado: val => Math.abs(cercaLejos(val.e) - 4) < 1e-9,
            bien: 'Con e = 0,6 corre cuatro veces más cerca del Sol: la segunda ley de Kepler.' },
          { texto: 'Deja las marcas rojas igual de separadas en toda la vuelta.',
            logrado: val => Math.abs(cercaLejos(val.e) - 1) < 1e-9,
            bien: 'Sin estirar, la elipse es un círculo: rapidez constante, como en el MCU.' },
          { texto: 'Estira la órbita todo lo que se pueda.',
            logrado: val => val.e >= ELIPSE_LIBRE.max - 1e-9,
            bien: 'Al máximo, cerca del Sol va siete veces más rápido que lejos.' },
          { texto: 'Guarda dos órbitas de distinta forma y compara dónde se juntan las marcas.',
            logrado: (val, guardados) => guardados.some(x => Math.abs(x.e - val.e) > 1e-9) && guardados.some(x => Math.abs(x.e - val.e) < 1e-9),
            bien: 'Cuanto más alargada, más se juntan lejos del Sol: allá va más lento.' },
        ],
        arrastres: [{ id: 'afelio', etiqueta: 'punto más lejano del Sol (forma de la órbita)',
          donde: val => afelio(val.e),
          mover: (pt, val) => { const g = LZ(elipse(val.e)); return { e: -g.Xi(pt.x) / A4 - 1 }; } }],
      },
      Object.assign({ id: 'atraccion', titulo: 'Atracción y distancia', pieza: 'fis-lienzo',
        invitaciones: [
          { texto: 'Haz que la atracción sea la cuarta parte de la que hay en la superficie.',
            logrado: val => Math.abs(fAtraccion(val) - fAtraccion({ r: 1, m: val.m }) / 4) < 1e-9,
            bien: 'Doble distancia, cuarta parte: la atracción baja con el cuadrado de r.' },
          { texto: 'Busca la menor atracción que permiten los controles.',
            logrado: val => { const [cr, cm] = inversa.juega.controles; return fAtraccion(val) <= fAtraccion({ r: cr.max, m: cm.min }) + 1e-9; },
            bien: 'Lejos y con poca masa: la Tierra igual lo atrae, nunca llega a 0.' },
          { texto: 'Guarda dos casos a la misma distancia y con distinta masa.',
            logrado: (val, guardados) => guardados.some(x => x.r === val.r && x.m !== val.m) && guardados.some(x => x.r === val.r && x.m === val.m),
            bien: 'La fuerza cambió con la masa, pero g no: el campo es del lugar.' },
        ] }, inversa.juega),
    ],
    historia: {
      texto: 'Kepler trabajó con años de registros de Tycho Brahe y publicó sus dos primeras leyes en 1609; la tercera, en 1619. Describían cómo se mueven los planetas sin explicar por qué. En 1687, Newton mostró que una sola atracción, que se debilita con el cuadrado de la distancia, explicaba las tres.',
      pregunta: '¿Por qué la Luna no se cae a la Tierra?',
      fuente: { titulo: 'NASA — Orbits and Kepler’s Laws', url: 'https://science.nasa.gov/solar-system/orbits-and-keplers-laws/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'orbita-plano-3d': ['orbita-circular'],
      'dos-orbitas': ['orbita-circular'],
      'elipse-libre': ['leyes-de-kepler'],
      'atraccion': ['cuadrado-inverso'],
    },
    ideas: [gr1.idea, campoIdea, orbitaIdea, keplerIdea],
  };
});
