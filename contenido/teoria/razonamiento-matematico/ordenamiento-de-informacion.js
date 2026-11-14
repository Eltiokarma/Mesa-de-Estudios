/*
 * Teoría de «Ordenamiento de información» (razonamiento-matematico.ordenamiento-de-informacion).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 3); historia: Boole, Laws of Thought (1854).
 * Precisión del curso: una disposición correcta no es la única; se concluye lo que vale en todos los órdenes posibles.
 * Colores (regla 4): la persona de referencia turquesa (c-i), lo que se pregunta naranja (c-o), lo seguro verde (c-d),
 * lo descartado rojo (c-h).
 * Compañero: Faro (zorro). Códigos: RMT-ORD-* nuevos (hipótesis).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ordenar personas con pistas y saber cuándo el orden todavía no está decidido.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: lista los órdenes posibles, fija una referencia en la mesa redonda y ubica «frente a» en una mesa cuadrada.
 *   Orden de atención: 1.º las filas de órdenes posibles o las sillas · 2.º la lectura «quedan n» · acción principal fija.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «"a la izquierda de" ¿quiere decir "junto a"?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    r.barajar = xs => { const y = xs.slice(); for (let i = y.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [y[i], y[j]] = [y[j], y[i]]; } return y; };
    return r;
  }
  function opcionesTexto(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const d of distractores) { if (vistos.has(d.texto) || ops.length >= 4) continue; vistos.add(d.texto); ops.push(d); }
    return ops;
  }
  function permutaciones(xs) {
    if (xs.length <= 1) return [xs.slice()];
    return xs.flatMap((x, i) => permutaciones(xs.slice(0, i).concat(xs.slice(i + 1))).map(p => [x].concat(p)));
  }

  const plural = (n, uno, varios) => `${f(n, 0)} ${n === 1 ? uno : varios}`;
  // Gesto directo (docs/teoria.md §4b): las manijas viven en la geometría que exporta rm-plano.
  const PLANO = () => Kit.piezas['rm-plano'];
  // La silla (de los nodos de la figura) más cercana al dedo.
  const sillaCercana = (datos, pt) => {
    const g = PLANO().geometria(datos);
    let mejor = 0, dm = Infinity;
    datos.nodos.forEach((n, k) => { const d = Math.hypot(g.X(n.x) - pt.x, g.Y(n.y) - pt.y); if (d < dm) { dm = d; mejor = k; } });
    return mejor;
  };
  const enSilla = (datos, k) => { const g = PLANO().geometria(datos), n = datos.nodos[k]; return { x: g.X(n.x), y: g.Y(n.y) }; };

  // ---------- Idea 1: ordenamiento lineal ----------
  // Sin arrastre: lo que cambia son las pistas, que son frases; el molde todavía no tiene el gesto «tocar la frase».
  // Cambia: las pistas usadas · Permanece: los cuatro puestos de izquierda a derecha · Progresa: las filas de órdenes que
  // se descartan · Se reserva: el orden donde Ana y Beto quedan separados · Debe verse: «a la izquierda» no es «junto».
  const GENTE = ['Ana', 'Beto', 'Ciro', 'Dina'];
  const pos = (p, x) => p.indexOf(x);
  const PISTAS_L = [
    { t: 'Ana está a la izquierda de Beto', ok: p => pos(p, 'Ana') < pos(p, 'Beto') },
    { t: 'Ciro está junto a Beto', ok: p => Math.abs(pos(p, 'Ciro') - pos(p, 'Beto')) === 1 },
    { t: 'Dina está en un extremo', ok: p => [0, 3].includes(pos(p, 'Dina')) },
    { t: 'Ana no está junto a Ciro', ok: p => Math.abs(pos(p, 'Ana') - pos(p, 'Ciro')) !== 1 },
  ];
  const ordenesL = n => permutaciones(GENTE).filter(p => PISTAS_L.slice(0, n).every(c => c.ok(p)));
  function filaOrdenes(ords, extra = {}) {
    const vis = ords.slice(0, 4);
    const seguro = k => ords.length > 0 && ords.every(p => p[k] === ords[0][k]);
    return {
      columnas: ['1.º', '2.º', '3.º', '4.º'], filas: vis.map((_, k) => `Orden ${k + 1}`).concat(vis.length ? [] : ['—']), ancho: 62,
      celdas: (vis.length ? vis : [['', '', '', '']]).map(p => p.map((x, k) => ({ t: x, color: seguro(k) && ords.length ? 'd' : x === 'Ana' || x === 'Beto' ? 'o' : undefined }))),
      notas: [{ t: extra.nota || (ords.length > 4 ? `Órdenes posibles: ${ords.length} (se ven 4)` : `Órdenes posibles: ${ords.length}`) }],
    };
  }
  const lineal = {
    id: 'orden-lineal',
    titulo: 'Antes no es junto',
    temas: ['Ordenamiento lineal'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'Cuatro amigos en una fila de cuatro asientos. Agrega pistas una a una: el tablero muestra los órdenes que todavía cumplen todo.',
      voz: 'En verde, el puesto que ya es igual en todos los órdenes.',
      controles: [{ id: 'n', etiqueta: 'Pistas', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: val => ({ datos: filaOrdenes(ordenesL(val.n)), estado: {} }),
      lectura: val => [`Pista ${val.n}: ${PISTAS_L[val.n - 1].t}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Otra fila: solo se sabe que Eva está a la izquierda de Fito, entre cinco asientos. ¿Eva y Fito están juntos?',
      opciones: [
        { id: 'si', texto: 'Sí, siempre', error: 'RMT-ORD-1', siFuera: 'Sería cierto si dijera «inmediatamente a la izquierda». «A la izquierda» deja asientos de por medio.' },
        { id: 'c', texto: 'Puede que sí o que no', correcta: true },
        { id: 'no', texto: 'No, nunca', error: 'RMT-ORD-2', siFuera: 'Hay órdenes donde sí quedan juntos; no se puede negar.' },
      ],
      dibujo: { datos: { columnas: ['1.º', '2.º', '3.º', '4.º', '5.º'], filas: ['Orden 1', 'Orden 2'], ancho: 50, celdas: [['', '', '', '', ''], ['', '', '', '', '']], notas: [{ t: 'Eva a la izquierda de Fito' }] }, estado: {} },
      revelar: { datos: { columnas: ['1.º', '2.º', '3.º', '4.º', '5.º'], filas: ['Orden 1', 'Orden 2'], ancho: 50, celdas: [[{ t: 'Eva', color: 'o' }, { t: 'Fito', color: 'o' }, '', '', ''], [{ t: 'Eva', color: 'o' }, '', '', { t: 'Fito', color: 'o' }, '']], notas: [{ t: 'Los dos cumplen la pista' }] }, estado: {} },
      coincide: 'Coincide: la pista solo ordena; no dice cuántos asientos hay en medio.',
    },
    mira: {
      datos: {
        columnas: ['1.º', '2.º', '3.º', '4.º'], filas: ['Orden 1', 'Orden 2', 'Orden 3'], ancho: 62,
        celdas: ordenesL(3).slice(0, 3).map((p, i) => p.map(x => ({ t: x, color: x === 'Dina' ? 'd' : undefined, desde: 1 + Math.min(i, 1) }))),
        marcos: [{ f: ordenesL(3).findIndex(p => !PISTAS_L[3].ok(p)), c: 0, ancho: 4, color: 'h', desde: 3 }],
        notas: [{ t: `Con 3 pistas: ${ordenesL(3).length} órdenes · con 4: ${ordenesL(4).length}`, desde: 3 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Un orden que cumple las pistas 1, 2 y 3.' },
        { estado: { corte: 2 }, texto: 'Hay otros que también las cumplen: falta información.' },
        { estado: { corte: 3 }, texto: 'La pista 4 tacha el orden con Ana junto a Ciro.' },
        { estado: { corte: 3 }, texto: 'Se concluye solo lo que se repite en todos los órdenes que quedan.' },
      ],
    },
    regla: {
      texto: 'Se escriben todos los órdenes que cumplen las pistas. «A la izquierda de» solo ordena; «junto a» o «inmediatamente» obliga a estar pegados. Se concluye lo común a todos.',
      ecuacion: [{ llave: ['a < b'], nota: 'a la izquierda', color: 'c-o' }, ' y b < c  ⇒  a < c'],
      condicion: 'izquierda y derecha se miran desde el mismo lado de la fila y cada asiento es para una sola persona.',
    },
    ahoraTu: {
      voz: 'Escribe los órdenes posibles y tacha con cada pista.',
      generar(s) {
        const r = azar(s);
        const gente = r.barajar(['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito']).slice(0, 4);
        const sol = r.barajar(gente), P = (p, x) => p.indexOf(x);
        const pool = [];
        for (const a of gente) for (const b of gente) if (a !== b) {
          if (P(sol, a) < P(sol, b)) pool.push({ t: `${a} está a la izquierda de ${b}`, ok: p => P(p, a) < P(p, b) });
          if (P(sol, a) + 1 === P(sol, b)) pool.push({ t: `${a} está inmediatamente a la izquierda de ${b}`, ok: p => P(p, a) + 1 === P(p, b) });
        }
        for (const a of gente) {
          if ([0, 3].includes(P(sol, a))) pool.push({ t: `${a} está en un extremo`, ok: p => [0, 3].includes(P(p, a)) });
          else pool.push({ t: `${a} no está en un extremo`, ok: p => ![0, 3].includes(P(p, a)) });
        }
        const puesto = r.ent(0, 3);
        let usadas = null;
        for (let t = 0; t < 40 && !usadas; t++) {
          const us = [];
          for (const c of r.barajar(pool)) {
            us.push(c);
            const v = permutaciones(gente).filter(p => us.every(x => x.ok(p)));
            if (v.every(p => p[puesto] === v[0][puesto])) break;
          }
          if (us.length <= 3 || t === 39) usadas = us;
        }
        const vivos = permutaciones(gente).filter(p => usadas.every(x => x.ok(p)));
        const quien = vivos[0][puesto];
        return {
          pregunta: `Cuatro amigos en fila. ${usadas.map(c => c.t).join('. ')}. ¿Quién está en el puesto ${puesto + 1} desde la izquierda?`,
          dibujo: { datos: filaOrdenes([], { nota: 'Escribe los órdenes posibles' }), estado: {} },
          opciones: gente.filter(x => x !== quien).slice(0, 2).map((x, k) => ({ id: 'g' + k, texto: x, error: 'RMT-ORD-3', siFuera: `${x} cabe en un orden que alguna pista tacha.` }))
            .concat([{ id: 'c', texto: quien, correcta: true }, { id: 'nose', texto: 'No se puede saber', error: 'RMT-ORD-4', siFuera: 'En todos los órdenes que quedan, ese puesto es el mismo.' }]),
          solucion: { texto: `Quedan ${vivos.length} órdenes y en todos el puesto ${puesto + 1} es de ${quien}.`, dibujo: { datos: filaOrdenes(vivos), estado: {} } },
        };
      },
    },
  };

  // ---------- Mesa redonda (sillas en círculo, la silla 0 abajo) ----------
  // La derecha de quien mira al centro es el sentido antihorario visto desde arriba.
  const silla = (k, n, R = 2.3) => [5 + R * Math.sin(2 * Math.PI * k / n), 3.1 + R * Math.cos(2 * Math.PI * k / n)];
  function mesa(n, nombres, extra = {}) {
    const nodos = Array.from({ length: n }, (_, k) => {
      const [x, y] = silla(k, n), [ex, ey] = silla(k, n, 3.05);
      return { id: 's' + k, x, y, r: 15, t: nombres[k] ? nombres[k][0] : '', color: (extra.colores || {})[k], etiqueta: nombres[k] || '', lado: ey > 4.6 ? 'abajo' : ey < 1.6 ? 'arriba' : ex > 5 ? 'der' : 'izq' };
    });
    return {
      ancho: 10, alto: 6.2,
      circulos: [{ x: 5, y: 3.1, r: 1.25, relleno: 0.06, grosor: 'cuadricula' }],
      nodos,
      lineas: extra.flecha ? [{ de: silla(0, n, 1.6), a: silla(0.75, n, 1.6), color: 'i', flecha: true }] : [],
      textos: extra.flecha ? [{ x: 5, y: 3.15, t: 'derecha →', color: 'i' }] : [],
      aristas: extra.aristas || [],
      pie: extra.pie,
    };
  }
  const NOM5 = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva'];
  const datosGiro = val => {
    const nombres = Array.from({ length: 5 }, (_, k) => NOM5[((k - val.g) % 5 + 5) % 5]);
    return mesa(5, nombres, { colores: { [val.g % 5]: 'i', [(val.g + 1) % 5]: 'o' } });
  };
  const circular = {
    id: 'orden-circular',
    titulo: 'En la mesa redonda, una referencia',
    temas: ['Ordenamiento circular'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Cinco amigos en una mesa redonda, mirando al centro. Gira a todos juntos y mira quién queda a la derecha de Ana.',
      voz: 'Girar la mesa entera no cambia quién está junto a quién.',
      controles: [{ id: 'g', etiqueta: 'Giro', min: 0, max: 4, paso: 1, inicio: 0, unidad: 'sillas', decimales: 0 }],
      dibujo: val => ({ datos: datosGiro(val), estado: {} }),
      lectura: () => ['A la derecha de Ana: Beto, en todos los giros'],
      minimo: 3,
      // Se arrastra a Ana alrededor de la mesa: todos giran con ella.
      arrastres: [{ id: 'ana', etiqueta: 'silla de Ana (gira la mesa)', color: 'c-i',
        donde: val => enSilla(datosGiro(val), val.g % 5), mover: (pt, val) => ({ g: sillaCercana(datosGiro(val), pt) }) }],
    },
    predice: {
      pregunta: '¿De cuántas maneras distintas se pueden sentar 4 personas en una mesa redonda, si solo importa quién está junto a quién y en qué sentido?',
      opciones: [
        { id: 'fila', texto: '24', error: 'RMT-ORD-5', siFuera: '24 sería en una fila. En la mesa, los 4 giros de un orden son el mismo orden.' },
        { id: 'c', texto: '6', correcta: true },
        { id: 'cuatro', texto: '4', error: 'RMT-ORD-6', siFuera: '4 son los giros de un mismo orden, no los órdenes distintos.' },
        { id: 'tres', texto: '3', error: 'RMT-ORD-7', siFuera: 'Eso trata como iguales un orden y su reflejo; aquí el sentido importa.' },
      ],
      dibujo: { datos: mesa(4, ['Ana', '', '', '']), estado: {} },
      revelar: { datos: mesa(4, ['Ana', '?', '?', '?'], { colores: { 0: 'i' }, pie: 'Ana fija: 3 · 2 · 1 = 6 órdenes' }), estado: {} },
      coincide: 'Coincide: se fija a Ana y se ordena a los otros tres: 3 · 2 · 1.',
    },
    mira: {
      datos: Object.assign(mesa(5, ['Ana', 'Beto', '', '', ''], { colores: { 0: 'i', 1: 'o' }, flecha: true }), {}),
      pasos: [
        { estado: { corte: 0 }, texto: 'Se sienta a Ana abajo: es la referencia.' },
        { estado: { corte: 0 }, texto: 'Mirando al centro, su derecha va en sentido contrario al reloj.' },
        { estado: { corte: 0 }, texto: 'Ubicada Ana, el resto se ordena como en una fila.', ecuacion: ['órdenes en la mesa = ', { llave: ['(n − 1)!'], nota: 'sin la referencia', color: 'c-i' }] },
      ],
    },
    regla: {
      texto: 'En una mesa redonda no hay primer asiento: se fija a una persona como referencia y los demás se ubican respecto de ella. Girar a todos no cambia el orden.',
      ecuacion: ['n personas en círculo: ', { llave: ['(n − 1)!'], nota: 'una queda fija', color: 'c-i' }, ' órdenes'],
      condicion: 'todos miran al centro; así, la derecha de cada uno va en sentido antihorario visto desde arriba.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Sienta primero a quien tenga más pistas.',
      generar(s) {
        const r = azar(s), n = s % 2 ? 6 : 5;
        const gente = r.barajar(['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito', 'Gina']).slice(0, n);
        const ref = gente[0], sol = [ref].concat(r.barajar(gente.slice(1)));
        const P = (p, x) => p.indexOf(x), der = (p, x) => p[(P(p, x) + 1) % n], izq = (p, x) => p[(P(p, x) + n - 1) % n];
        const pool = [];
        for (const a of gente) {
          pool.push({ t: `${der(sol, a)} está a la derecha de ${a}`, ok: p => der(p, a) === der(sol, a) });
          if (n === 6 && a < sol[(P(sol, a) + 3) % 6]) pool.push({ t: `${a} está frente a ${sol[(P(sol, a) + 3) % 6]}`, ok: p => p[(P(p, a) + 3) % 6] === sol[(P(sol, a) + 3) % 6] });
          for (const b of gente) if (a < b && der(sol, a) !== b && izq(sol, a) !== b) pool.push({ t: `${a} no está junto a ${b}`, ok: p => der(p, a) !== b && izq(p, a) !== b });
        }
        const todos = permutaciones(gente.slice(1)).map(q => [ref].concat(q));
        const palabras = t => (t.match(/[\p{L}\p{N}]+/gu) || []).length;
        let usadas = null, blanco = null;
        for (let t = 0; t < 300 && !usadas; t++) {
          const bl = r.elegir(gente.slice(1)), us = [];
          for (const c of r.barajar(pool)) {
            if (c.t === `${der(sol, bl)} está a la derecha de ${bl}`) continue;
            us.push(c);
            const v = todos.filter(p => us.every(x => x.ok(p)));
            if (v.every(p => der(p, bl) === der(v[0], bl))) break;
            if (us.length > 3) break;
          }
          const v = todos.filter(p => us.every(x => x.ok(p)));
          if (v.every(p => der(p, bl) === der(v[0], bl)) && palabras(us.map(c => c.t).join(" ")) <= 25) { usadas = us; blanco = bl; }
        }
        const vivos = todos.filter(p => usadas.every(x => x.ok(p)));
        const bien = der(vivos[0], blanco), mal = izq(vivos[0], blanco);
        return {
          pregunta: `Mesa redonda de ${n}, todos miran al centro. ${usadas.map(c => c.t).join('. ')}. ¿Quién está a la derecha de ${blanco}?`,
          dibujo: { datos: mesa(n, [ref].concat(Array(n - 1).fill('')), { colores: { 0: 'i' }, flecha: true }), estado: {} },
          opciones: opcionesTexto(bien, [
            { id: 'izq', texto: mal, error: 'RMT-ORD-8', siFuera: `${mal} está a su izquierda: la derecha de quien mira al centro va contra el reloj.` },
            ...gente.filter(x => x !== bien && x !== mal && x !== blanco).map((x, k) => ({ id: 'g' + k, texto: x, error: 'RMT-ORD-3', siFuera: `${x} cabe en una mesa que alguna pista tacha.` })),
          ]),
          solucion: { texto: `Con ${ref} abajo, ubica a cada uno; a la derecha de ${blanco} queda ${bien}.`, dibujo: { datos: mesa(n, vivos[0], { colores: { [P(vivos[0], blanco)]: 'i', [P(vivos[0], bien)]: 'o' } }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: mesa cuadrada (ordenamiento poligonal) ----------
  // Cambia: la silla elegida · Permanece: la mesa con dos sillas por lado · Progresa: frente y vecino que se marcan ·
  // Se reserva: «frente» en la cuadrada, que no es «cuatro sillas más allá» · Debe verse: frente se mira cruzando la mesa.
  // Sillas en sentido horario desde arriba a la izquierda: 1, 2 (arriba), 3, 4 (derecha), 5, 6 (abajo), 7, 8 (izquierda).
  const SQ = [[4, 0.5], [6, 0.5], [8.4, 2.1], [8.4, 4.1], [6, 5.7], [4, 5.7], [1.6, 4.1], [1.6, 2.1]];
  const frente = i => (i < 2 ? 5 - i : i < 4 ? 9 - i : i < 6 ? 5 - i : 9 - i);
  const mismoLado = i => (i % 2 ? i - 1 : i + 1);
  function cuadrada(marcas = {}, extra = {}) {
    return {
      ancho: 10, alto: 6.2,
      poligonos: [{ puntos: [[2.8, 1.5], [7.2, 1.5], [7.2, 4.7], [2.8, 4.7]], relleno: 0.06, grosor: 'contorno' }],
      nodos: SQ.map(([x, y], i) => ({ id: 'q' + i, x, y, r: 15, t: String(i + 1), color: marcas[i] })),
      aristas: extra.aristas || [],
      pie: extra.pie,
    };
  }
  const OPU = i => (i + 4) % 8;
  const idx8 = k => ((4 - (k - 1)) % 8 + 8) % 8;   // silla número k → posición en el círculo
  const datosOcho = val => {
    const nombres = Array.from({ length: 8 }, (_, k) => String(((4 - k) % 8 + 8) % 8 + 1));
    return Object.assign(mesa(8, Array(8).fill('')), { nodos: mesa(8, Array(8).fill('')).nodos.map((n, p) => Object.assign(n, { t: nombres[p], etiqueta: '', color: p === idx8(val.s) ? 'i' : p === idx8(OPU(val.s - 1) + 1) ? 'o' : undefined })) });
  };
  // Hallazgo 9: el juego usa la mesa redonda y Mira, la cuadrada. Es a propósito: la idea es el contraste entre las
  // dos (en la redonda, frente es media vuelta; en la cuadrada, cruzar al lado opuesto). La predicción hace el salto.
  const poligonal = {
    id: 'mesa-cuadrada',
    titulo: 'Frente a frente, mesa cuadrada',
    temas: ['Ordenamiento poligonal'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Mesa redonda de 8 sillas numeradas en orden. Elige la silla de Ana y mira quién queda frente a ella.',
      voz: 'En la redonda, frente es la silla que está a mitad de vuelta.',
      controles: [{ id: 's', etiqueta: 'Silla de Ana', min: 1, max: 8, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: val => ({ datos: datosOcho(val), estado: {} }),
      lectura: val => [`Frente a la silla ${val.s}: la silla ${OPU(val.s - 1) + 1}`],
      minimo: 3,
      // Se arrastra a Ana a otra silla de la mesa.
      arrastres: [{ id: 'ana', etiqueta: 'silla de Ana', color: 'c-i',
        donde: val => enSilla(datosOcho(val), idx8(val.s)), mover: (pt, val) => ({ s: ((4 - sillaCercana(datosOcho(val), pt)) % 8 + 8) % 8 + 1 }) }],
    },
    predice: {
      pregunta: 'Ahora la mesa es cuadrada, con dos sillas por lado, numeradas del 1 al 8 en orden. ¿Qué silla queda frente a la 1?',
      opciones: [
        { id: 'cinco', texto: 'La 5', error: 'RMT-ORD-9', siFuera: 'La 5 sería frente en la redonda. En la cuadrada, frente es cruzar al lado opuesto.' },
        { id: 'c', texto: 'La 6', correcta: true },
        { id: 'dos', texto: 'La 2', error: 'RMT-ORD-10', siFuera: 'La 2 está a su lado, en el mismo borde de la mesa.' },
        { id: 'ocho', texto: 'La 8', error: 'RMT-ORD-10', siFuera: 'La 8 está a la vuelta de la esquina, no enfrente.' },
      ],
      dibujo: { datos: cuadrada({ 0: 'i' }), estado: {} },
      revelar: { datos: cuadrada({ 0: 'i', 5: 'o', 4: 'h' }, { aristas: [{ de: 'q0', a: 'q5', color: 'o', grosor: 'variable' }], pie: 'Frente a la 1 está la 6, no la 5' }), estado: {} },
      coincide: 'Coincide: la 1 y la 6 se miran cruzando la mesa.',
    },
    mira: {
      datos: cuadrada({ 0: 'i', 1: 'd', 5: 'o', 7: 'h' }, { aristas: [
        { de: 'q0', a: 'q1', color: 'd', grosor: 'variable', desde: 1 },
        { de: 'q0', a: 'q7', color: 'h', grosor: 'variable', discontinua: true, desde: 2 },
        { de: 'q0', a: 'q5', color: 'o', grosor: 'variable', desde: 3 },
      ] }),
      pasos: [
        { estado: { corte: 1 }, texto: 'La 2 comparte el lado de arriba con la 1.' },
        { estado: { corte: 2 }, texto: 'La 8 está en otro lado, al doblar la esquina.' },
        { estado: { corte: 3 }, texto: 'Frente a la 1 está la 6: el lado opuesto, en la misma columna.' },
      ],
    },
    regla: {
      texto: 'En una mesa con lados, «frente a» y «a su lado» dependen de qué borde ocupa cada silla. Antes de ubicar, se dibuja la mesa y se numeran las sillas.',
      ecuacion: ['redonda: ', { llave: ['n/2'], nota: 'media vuelta', color: 'c-o' }, ' sillas más allá', '   ·   ', 'cuadrada: el lado opuesto'],
      condicion: 'se sabe cuántas sillas hay por lado y que todas miran hacia la mesa.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Ubica el lado de la silla antes de buscar su pareja.',
      generar(s) {
        const r = azar(s), i = r.ent(0, 7), pide = s % 2 ? 'frente' : 'lado';
        const bien = pide === 'frente' ? frente(i) : mismoLado(i);
        const otro = pide === 'frente' ? mismoLado(i) : frente(i);
        const vueltaEsq = i % 2 ? (i + 1) % 8 : (i + 7) % 8;
        return {
          pregunta: pide === 'frente' ? `Mesa cuadrada, dos sillas por lado, numeradas del 1 al 8. ¿Qué silla queda frente a la ${i + 1}?` : `Mesa cuadrada, dos sillas por lado, numeradas del 1 al 8. ¿Qué silla comparte lado con la ${i + 1}?`,
          dibujo: { datos: cuadrada({ [i]: 'i' }), estado: {} },
          opciones: opcionesTexto(`La ${bien + 1}`, [
            { id: 'red', texto: `La ${OPU(i) + 1}`, error: 'RMT-ORD-9', siFuera: 'Eso sería en una mesa redonda: a mitad de vuelta.' },
            { id: 'otro', texto: `La ${otro + 1}`, error: 'RMT-ORD-10', siFuera: pide === 'frente' ? 'Esa comparte el lado; frente es el lado opuesto.' : 'Esa está enfrente, cruzando la mesa.' },
            { id: 'esq', texto: `La ${vueltaEsq + 1}`, error: 'RMT-ORD-10', siFuera: 'Esa está al doblar la esquina, en otro lado.' },
          ]),
          solucion: { texto: pide === 'frente' ? 'Se cruza al lado opuesto, en la misma columna o fila.' : 'Es la otra silla del mismo borde.', dibujo: { datos: cuadrada({ [i]: 'i', [bien]: 'o' }, { aristas: [{ de: 'q' + i, a: 'q' + bien, color: 'o', grosor: 'variable' }] }), estado: {} } },
        };
      },
    },
  };
  void f;

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1: la mesa redonda de 4 a 8, con Ana que se arrastra; se marcan su derecha (naranja) y quien está enfrente (verde).
  const NOM8 = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito', 'Gina', 'Hugo'];
  const ronda = val => {
    const n = val.n, g = val.g % n;
    const nombres = Array.from({ length: n }, (_, k) => NOM8[((k - g) % n + n) % n]);
    const col = { [g]: 'i', [(g + 1) % n]: 'o' };
    if (n % 2 === 0) col[(g + n / 2) % n] = 'd';
    return mesa(n, nombres, { colores: col });
  };
  const mesaRonda = {
    id: 'mesa-redonda', titulo: 'Mesa redonda libre', pieza: 'rm-plano',
    consigna: 'Elige cuántos se sientan y arrastra a Ana. Mira quién queda a su derecha y quién enfrente.',
    controles: [
      { id: 'n', etiqueta: 'Personas', min: 4, max: 8, paso: 1, inicio: 6, decimales: 0 },
      { id: 'g', etiqueta: 'Silla de Ana', min: 0, max: 7, paso: 1, inicio: 0, decimales: 0, color: 'c-i' },
    ],
    dibujo: val => ({ datos: ronda(val), estado: {} }),
    lectura: val => [`Derecha de Ana: ${NOM8[1]} · enfrente: `, val.n % 2 ? 'nadie (son impares)' : NOM8[val.n / 2]],
    arrastres: [{ id: 'ana', etiqueta: 'silla de Ana', color: 'c-i',
      donde: val => enSilla(ronda(val), val.g % val.n),
      mover: (pt, val) => { const k = sillaCercana(ronda(val), pt); return k === val.g % val.n ? {} : { g: k }; } }],
  };
  // Mesa 2: la mesa cuadrada con 1, 2 o 3 sillas por lado; Ana se arrastra y se marcan frente y vecinos de lado.
  function cuadradaK(k, ana) {
    const N = 4 * k, x0 = 2.8, x1 = 7.2, y0 = 1.5, y1 = 4.7;
    const t = j => (j + 0.5) / k;
    const pos = i => {
      const lado = Math.floor(i / k), j = i % k;
      if (lado === 0) return [x0 + (x1 - x0) * t(j), 0.5];
      if (lado === 1) return [8.4, y0 + (y1 - y0) * t(j)];
      if (lado === 2) return [x1 - (x1 - x0) * t(j), 5.7];
      return [1.6, y1 - (y1 - y0) * t(j)];
    };
    const lado = i => Math.floor(i / k), j = i => i % k;
    const fr = ((lado(ana) + 2) % 4) * k + (k - 1 - j(ana));
    const nodos = Array.from({ length: N }, (_, i) => {
      const [x, y] = pos(i);
      return { id: 'q' + i, x, y, r: 15, t: String(i + 1), color: i === ana ? 'i' : i === fr ? 'o' : lado(i) === lado(ana) ? 'd' : undefined };
    });
    return { ancho: 10, alto: 6.2, poligonos: [{ puntos: [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], relleno: 0.06, grosor: 'contorno' }], nodos,
      aristas: [{ de: 'q' + ana, a: 'q' + fr, color: 'o', grosor: 'variable' }], frente: fr };
  }
  const datosCuad = val => { const d = cuadradaK(val.k, (val.s - 1) % (4 * val.k)); delete d.frente; return d; };
  const mesaCuad = {
    id: 'mesa-cuadrada-libre', titulo: 'Mesa cuadrada libre', pieza: 'rm-plano',
    consigna: 'Elige cuántas sillas hay por lado y arrastra a Ana. En naranja, quien está enfrente; en verde, quien comparte su lado.',
    controles: [
      { id: 'k', etiqueta: 'Sillas por lado', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0 },
      { id: 's', etiqueta: 'Silla de Ana', min: 1, max: 12, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
    ],
    dibujo: val => ({ datos: datosCuad(val), estado: {} }),
    lectura: val => { const a = (val.s - 1) % (4 * val.k); return [`Silla ${a + 1}: enfrente la ${cuadradaK(val.k, a).frente + 1}`, val.k > 1 ? ` · su lado: ${plural(val.k - 1, 'silla', 'sillas')} más` : ' · sola en su lado']; },
    arrastres: [{ id: 'ana', etiqueta: 'silla de Ana', color: 'c-i',
      donde: val => enSilla(datosCuad(val), (val.s - 1) % (4 * val.k)),
      mover: (pt, val) => { const k = sillaCercana(datosCuad(val), pt); return k === (val.s - 1) % (4 * val.k) ? {} : { s: k + 1 }; } }],
  };
  // Mesa 3: las cuatro pistas de la fila, cada una se pone o se quita: ¿cuántos órdenes deja cada combinación?
  // Sin arrastre: las pistas son frases.
  const SINO = [{ valor: 1, texto: 'Sí' }, { valor: 0, texto: 'No' }];
  const ordenesSel = val => permutaciones(GENTE).filter(p => PISTAS_L.every((c, k) => !val['p' + k] || c.ok(p)));
  const mesaPistas = {
    id: 'pistas-a-elegir', titulo: 'Pistas a elegir', pieza: 'rm-tablero',
    consigna: 'Pon o quita cada pista de la fila de cuatro. ¿Qué pistas sobran y cuáles hacen falta?',
    controles: PISTAS_L.map((c, k) => ({ id: 'p' + k, etiqueta: c.t, opciones: SINO })),
    dibujo: val => ({ datos: filaOrdenes(ordenesSel(val)), estado: {} }),
    lectura: val => { const n = PISTAS_L.filter((_, k) => val['p' + k]).length, o = ordenesSel(val).length; return [`${plural(n, 'pista', 'pistas')}: `, plural(o, 'orden posible', 'órdenes posibles')]; },
  };

  return {
    unidad: 'razonamiento-matematico.ordenamiento-de-informacion',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-tablero.js', '/nucleo/kit/piezas/rm-plano.js'],
    // Laboratorio: la mesa redonda de 4 a 8 con derecha y frente, la cuadrada con 1 a 3 sillas por lado y las pistas
    // de la fila puestas o quitadas una a una.
    laboratorio: [mesaRonda, mesaCuad, mesaPistas],
    historia: {
      texto: 'En 1854, George Boole publicó Las leyes del pensamiento, donde trató el razonamiento como un cálculo con clases. No inventó los acertijos de asientos, pero ayudó a escribir con precisión cómo una frase reduce las posibilidades. Ordenar es eso: ver qué opciones deja en pie cada pista.',
      pregunta: '¿Cuántos órdenes deja vivos una sola pista?',
      fuente: { titulo: 'George Boole · Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/archives/sum2021/entries/boole/' },
    },
    ideas: [lineal, circular, poligonal],
  };
});
