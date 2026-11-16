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
  // El caso de la fila: lo usan «Ahora tú» (semilla s) y «Así se resuelve» (semilla s + 900), con las mismas cuentas.
  function casoLineal(r) {
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
    return { gente, usadas, puesto, vivos, quien };
  }
  const lineal = {
    id: 'orden-lineal',
    titulo: 'Antes no es junto',
    temas: ['Ordenamiento lineal'],
    pieza: 'rm-tablero',
    // Lee (fase 2): contexto y vocabulario; no dice si «a la izquierda» obliga a estar juntos (eso lo decide Predice).
    lee: {
      tarjetas: [
        { titulo: 'Una fila para la foto', texto: 'En la promoción de un colegio de Juliaca, cuatro amigos posan en fila para la foto. Las pistas dicen algo de dónde va cada uno, pero casi nunca lo dicen todo de una vez.' },
        { titulo: 'Los puestos', texto: 'Los puestos se cuentan de izquierda a derecha: 1.º, 2.º, 3.º y 4.º. Izquierda y derecha se miran siempre desde el mismo lado de la fila.' },
        { titulo: 'Un orden', texto: 'Cada manera de ubicar a los cuatro es un orden. Sin pistas hay 24. Cada pista tacha los órdenes que no la cumplen.',
          ecuacion: ['4 · 3 · 2 · 1 = 24 órdenes'] },
        { titulo: 'Qué mirar al jugar', texto: 'Agrega las pistas una a una. Cuenta cuántos órdenes quedan en el tablero y fíjate qué puesto se pinta de verde.' },
      ],
    },
    juega: {
      consigna: 'Cuatro amigos en una fila de cuatro puestos: las columnas del tablero. Agrega pistas una a una y mira los órdenes que todavía cumplen todo.',
      voz: 'En verde, el puesto que ya es igual en todos los órdenes.',
      controles: [{ id: 'n', etiqueta: 'Pistas', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 }],
      dibujo: val => ({ datos: filaOrdenes(ordenesL(val.n)), estado: {} }),
      lectura: val => [`Pista ${val.n}: ${PISTAS_L[val.n - 1].t}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'Otra fila: solo se sabe que Eva está a la izquierda de Fito, en una fila de cinco puestos. ¿Eva y Fito están juntos?',
      opciones: [
        { id: 'si', texto: 'Sí, siempre', error: 'RMT-ORD-1', siFuera: 'Sería cierto si dijera «inmediatamente a la izquierda». «A la izquierda» deja puestos de por medio.' },
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
        { estado: { corte: 1 }, texto: 'Ordenamiento lineal: un orden en fila que cumple las pistas 1, 2 y 3.' },
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
    // Así se resuelve (fase 2): el mismo caso de «Ahora tú», con otra semilla, resuelto paso a paso.
    resuelve: {
      generar(s) {
        const { gente, usadas, puesto, vivos, quien } = casoLineal(azar(s + 900));
        const todos = vivos.length === 1 ? 'el único orden que queda' : `los ${vivos.length} órdenes que quedan`;
        return {
          enunciado: `Cuatro amigos en fila. ${usadas.map(c => c.t).join('. ')}. ¿Quién está en el puesto ${puesto + 1} desde la izquierda?`,
          dibujo: { datos: filaOrdenes([], { nota: 'Escribe los órdenes posibles' }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden quién ocupa el puesto ${puesto + 1}, contando desde la izquierda.` },
            { tipo: 'datos', texto: `Son cuatro: ${gente.join(', ')}. Hay ${plural(usadas.length, 'pista', 'pistas')}. Sin pistas caben ${permutaciones(gente).length} órdenes.` },
            { tipo: 'regla', texto: 'Escribo todos los órdenes que cumplen todas las pistas. Solo es seguro lo que se repite en todos ellos.' },
            { tipo: 'aplica', texto: `Tacho cada orden que falla alguna pista. ${vivos.length === 1 ? 'Queda un solo orden, el del tablero' : `Quedan ${vivos.length} órdenes, los del tablero`}.`,
              dibujo: { datos: filaOrdenes(vivos), estado: {} } },
            { tipo: 'sentido', texto: `En ${todos}, el puesto ${puesto + 1} es de ${quien}. Si cambiara de un orden a otro, no se podría saber.` },
          ],
          respuesta: `${quien}, en el puesto ${puesto + 1}`,
        };
      },
    },
    ahoraTu: {
      voz: 'Escribe los órdenes posibles y tacha con cada pista.',
      generar(s) {
        const { gente, usadas, puesto, vivos, quien } = casoLineal(azar(s));
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
  // El caso de la mesa redonda: lo usan «Ahora tú» (semilla s) y «Así se resuelve» (r de s + 900); n sale de s.
  function casoCircular(s, r) {
    const n = s % 2 ? 6 : 5;
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
    return { n, gente, ref, P, usadas, blanco, vivos, bien, mal };
  }
  const circular = {
    id: 'orden-circular',
    titulo: 'En la mesa redonda, una referencia',
    temas: ['Ordenamiento circular'],
    pieza: 'rm-plano',
    // Lee (fase 2): vocabulario de la mesa redonda; no cuenta cuántos órdenes distintos hay (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'Alrededor de la mesa', texto: 'En un almuerzo familiar en Puno, cinco personas se sientan alrededor de una mesa redonda. Todos miran hacia el centro de la mesa.' },
        { titulo: 'Derecha e izquierda', texto: 'Si miras al centro, tu derecha va en sentido contrario a las agujas del reloj, visto desde arriba. Tu izquierda va en el sentido del reloj.' },
        { titulo: 'Junto a y frente a', texto: '«Junto a» es la silla pegada, de un lado o del otro. Cuando las sillas son pares, «frente a» es la que queda cruzando la mesa.' },
        { titulo: 'Qué mirar al jugar', texto: 'Gira a todos juntos arrastrando la silla de Ana. Fíjate si alguien cambia de vecino.' },
      ],
    },
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
        { estado: { corte: 0 }, texto: 'En un ordenamiento circular, se sienta a Ana abajo: es la referencia.' },
        { estado: { corte: 0 }, texto: 'Mirando al centro, su derecha va en sentido contrario al reloj.' },
        { estado: { corte: 0 }, texto: 'Ubicada Ana, el resto se ordena como en una fila.', ecuacion: ['órdenes en la mesa = ', { llave: ['(n − 1)!'], nota: 'sin la referencia', color: 'c-i' }] },
      ],
    },
    regla: {
      texto: 'En una mesa redonda no hay primer asiento: se fija a una persona como referencia y los demás se ubican respecto de ella. Girar a todos no cambia el orden.',
      ecuacion: ['n personas en círculo: ', { llave: ['(n − 1)!'], nota: 'una queda fija', color: 'c-i' }, ' órdenes'],
      condicion: 'todos miran al centro; así, la derecha de cada uno va en sentido antihorario visto desde arriba.',
    },
    // Así se resuelve (fase 2): el mismo caso de «Ahora tú», con otra semilla, resuelto paso a paso.
    resuelve: {
      pieza: 'rm-plano',
      generar(s) {
        const { n, ref, P, usadas, blanco, vivos, bien, mal } = casoCircular(s, azar(s + 900));
        return {
          enunciado: `Mesa redonda de ${n}, todos miran al centro. ${usadas.map(c => c.t).join('. ')}. ¿Quién está a la derecha de ${blanco}?`,
          dibujo: { datos: mesa(n, [ref].concat(Array(n - 1).fill('')), { colores: { 0: 'i' }, flecha: true }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden quién está a la derecha de ${blanco}, con todos mirando al centro.` },
            { tipo: 'datos', texto: `Son ${n} en la mesa y ${plural(usadas.length, 'pista', 'pistas')}. Siento a ${ref} en la silla de abajo.` },
            { tipo: 'regla', texto: 'En la mesa redonda no hay primera silla: dejo a una persona fija y ubico a los demás desde ella. Mirando al centro, la derecha va contra el reloj.' },
            { tipo: 'aplica', texto: `Pruebo dónde va cada uno y tacho lo que falla una pista. ${vivos.length === 1 ? 'Queda una sola mesa' : `Quedan ${vivos.length} mesas, y en todas ${bien} sigue a ${blanco}`}.`,
              dibujo: { datos: mesa(n, vivos[0], { colores: { [P(vivos[0], blanco)]: 'i', [P(vivos[0], bien)]: 'o' } }), estado: {} } },
            { tipo: 'sentido', texto: `${bien} está en la silla que sigue a ${blanco} contra el reloj. ${vivos.length === 1 ? `${mal}, al otro lado, es su izquierda` : `La silla del otro lado es su izquierda`}: no confundirlas.` },
          ],
          respuesta: `${bien} está a la derecha de ${blanco}`,
        };
      },
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Sienta primero a quien tenga más pistas.',
      generar(s) {
        const { n, gente, ref, P, usadas, blanco, vivos, bien, mal } = casoCircular(s, azar(s));
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
    // Lee (fase 2): qué cambia con una mesa con lados; no dice qué silla queda frente a la 1 (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'Mesas con lados', texto: 'En un compartir del aula, juntan carpetas y forman una mesa cuadrada. Así, cada silla queda en un borde: arriba, abajo, a la izquierda o a la derecha.' },
        { titulo: 'Numerar primero', texto: 'Antes de ubicar a nadie, se numeran las sillas en orden, dando la vuelta a la mesa. Con dos sillas por lado, la mesa cuadrada tiene ocho.' },
        { titulo: 'Qué mirar al jugar', texto: 'En el juego, la mesa todavía es redonda, con 8 sillas. Mueve a Ana y mira qué número tiene la silla que queda frente a ella.' },
      ],
    },
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
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (frente o mismo lado), con otra semilla.
    resuelve: {
      pieza: 'rm-plano',
      generar(s) {
        const r = azar(s + 900), i = r.ent(0, 7), pide = s % 2 ? 'frente' : 'lado';
        const bien = pide === 'frente' ? frente(i) : mismoLado(i);
        const vueltaEsq = i % 2 ? (i + 1) % 8 : (i + 7) % 8;
        const BORDE = ['de arriba', 'de la derecha', 'de abajo', 'de la izquierda'], borde = k => BORDE[Math.floor(k / 2)];
        return {
          enunciado: pide === 'frente' ? `Mesa cuadrada, dos sillas por lado, numeradas del 1 al 8. ¿Qué silla queda frente a la ${i + 1}?` : `Mesa cuadrada, dos sillas por lado, numeradas del 1 al 8. ¿Qué silla comparte lado con la ${i + 1}?`,
          dibujo: { datos: cuadrada({ [i]: 'i' }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: pide === 'frente' ? `Piden la silla que mira a la ${i + 1} cruzando la mesa.` : `Piden la otra silla que está en el mismo borde que la ${i + 1}.` },
            { tipo: 'datos', texto: 'Dos sillas por borde, numeradas en orden: 1 y 2 arriba, 3 y 4 a la derecha, 5 y 6 abajo, 7 y 8 a la izquierda.' },
            { tipo: 'regla', texto: 'En una mesa con lados, primero miro en qué borde está la silla. Frente a ella está el borde opuesto; a su lado, el mismo borde.' },
            { tipo: 'aplica', texto: pide === 'frente' ? `La ${i + 1} está en el borde ${borde(i)}. Cruzo al borde ${borde(bien)} y tomo la silla alineada con ella: la ${bien + 1}.` : `La ${i + 1} está en el borde ${borde(i)}. La otra silla de ese borde es la ${bien + 1}.`,
              dibujo: { datos: cuadrada({ [i]: 'i', [bien]: 'o' }, { aristas: [{ de: 'q' + i, a: 'q' + bien, color: 'o', grosor: 'variable' }] }), estado: {} } },
            { tipo: 'sentido', texto: pide === 'frente' ? `La ${OPU(i) + 1}, cuatro sillas más allá, sería frente en una mesa redonda. Aquí no queda alineada con la ${i + 1}.` : `La ${vueltaEsq + 1} también está pegada a la ${i + 1}, pero al doblar la esquina: es otro borde.` },
          ],
          respuesta: `La silla ${bien + 1}`,
        };
      },
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
  const derechaDe = val => (ronda(val).nodos.find(x => x.color === 'o') || {}).etiqueta;
  const mesaRonda = {
    id: 'mesa-redonda', titulo: 'Mesa redonda libre', pieza: 'rm-plano',
    consigna: 'Elige cuántos se sientan y arrastra a Ana. Mira quién queda a su derecha y quién enfrente.',
    controles: [
      { id: 'n', etiqueta: 'Personas', min: 4, max: 8, paso: 1, inicio: 6, decimales: 0 },
      { id: 'g', etiqueta: 'Silla de Ana', min: 0, max: 7, paso: 1, inicio: 0, decimales: 0, color: 'c-i' },
    ],
    dibujo: val => ({ datos: ronda(val), estado: {} }),
    lectura: val => [`Derecha de Ana: ${NOM8[1]} · enfrente: `, val.n % 2 ? 'nadie (son impares)' : NOM8[val.n / 2]],
    // Retos: leen las sillas que pinta ronda(): Ana en turquesa (i), su derecha en naranja (o), enfrente en verde (d).
    invitaciones: [
      { texto: 'Gira la mesa hasta que Ana quede en la silla de más arriba.',
        logrado: val => { const ns = ronda(val).nodos, ana = ns.find(x => x.color === 'i'); return ns.every(x => x.y >= ana.y - 1e-9); },
        bien: 'Ana cambió de silla, pero su vecino de la derecha es el mismo.' },
      { texto: 'Haz que Eva quede enfrente de Ana.',
        logrado: val => ronda(val).nodos.some(x => x.color === 'd' && x.etiqueta === 'Eva'),
        bien: 'Con 8 personas, enfrente queda a media vuelta: cuatro sillas más allá.' },
      { texto: 'Sienta a tanta gente que nadie quede justo enfrente de Ana.',
        logrado: val => !ronda(val).nodos.some(x => x.color === 'd'),
        bien: 'Con un número impar, la media vuelta cae entre dos sillas.' },
      { texto: 'Guarda dos casos con Ana en sillas distintas. ¿Quién queda a su derecha?',
        logrado: (val, guardados) => guardados.some(x => guardados.some(y => x.g % x.n !== y.g % y.n
          && derechaDe(x) === derechaDe(y))),
        bien: 'El mismo vecino en los dos: girar a todos no cambia el orden.' },
    ],
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
  const anaCuad = val => (val.s - 1) % (4 * val.k);
  const frenteCuad = val => cuadradaK(val.k, anaCuad(val)).frente + 1;
  const vecinosCuad = val => cuadradaK(val.k, anaCuad(val)).nodos.filter(x => x.color === 'd').length;
  const MAX_VECINOS = Math.max(...[1, 2, 3].map(k => vecinosCuad({ k, s: 1 })));
  const mesaCuad = {
    id: 'mesa-cuadrada-libre', titulo: 'Mesa cuadrada libre', pieza: 'rm-plano',
    consigna: 'Elige cuántas sillas hay por lado y arrastra a Ana. En naranja, quien está enfrente; en verde, quien comparte su lado.',
    controles: [
      { id: 'k', etiqueta: 'Sillas por lado', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0 },
      { id: 's', etiqueta: 'Silla de Ana', min: 1, max: 12, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
    ],
    dibujo: val => ({ datos: datosCuad(val), estado: {} }),
    lectura: val => { const a = (val.s - 1) % (4 * val.k); return [`Silla ${a + 1}: enfrente la ${cuadradaK(val.k, a).frente + 1}`, val.k > 1 ? ` · su lado: ${plural(val.k - 1, 'silla', 'sillas')} más` : ' · sola en su lado']; },
    // Retos: usan cuadradaK(), la misma que numera las sillas y marca frente (o) y lado (d).
    invitaciones: [
      { texto: 'Con dos sillas por lado, sienta a Ana frente a la silla 3.',
        logrado: val => val.k === 2 && frenteCuad(val) === 3,
        bien: 'Frente a la 3 está la 8: se cruza la mesa, no se cuentan sillas.' },
      { texto: 'Deja a Ana sola en su lado de la mesa.',
        logrado: val => vecinosCuad(val) === 0,
        bien: 'Con una silla por lado, la cuadrada se parece a la redonda de 4.' },
      { texto: 'Busca la mesa con más gente compartiendo el lado de Ana.',
        logrado: val => vecinosCuad(val) === MAX_VECINOS,
        bien: 'Más sillas por lado, más vecinos de lado. Frente sigue siendo una sola.' },
      { texto: 'Guarda dos mesas distintas con Ana en la silla 1 y compara quién queda enfrente.',
        logrado: (val, guardados) => guardados.some(x => guardados.some(y => x.k !== y.k && anaCuad(x) === 0 && anaCuad(y) === 0)),
        bien: 'Frente a la 1 cambia con la mesa: depende de cuántas sillas hay por lado.' },
    ],
    arrastres: [{ id: 'ana', etiqueta: 'silla de Ana', color: 'c-i',
      donde: val => enSilla(datosCuad(val), (val.s - 1) % (4 * val.k)),
      mover: (pt, val) => { const k = sillaCercana(datosCuad(val), pt); return k === (val.s - 1) % (4 * val.k) ? {} : { s: k + 1 }; } }],
  };
  // Mesa 3: las cuatro pistas de la fila, cada una se pone o se quita: ¿cuántos órdenes deja cada combinación?
  // Sin arrastre: las pistas son frases.
  const SINO = [{ valor: 1, texto: 'Sí' }, { valor: 0, texto: 'No' }];
  const ordenesSel = val => permutaciones(GENTE).filter(p => PISTAS_L.every((c, k) => !val['p' + k] || c.ok(p)));
  const nPistas = val => PISTAS_L.filter((_, k) => val['p' + k]).length;
  const TODAS = Object.fromEntries(PISTAS_L.map((_, k) => ['p' + k, 1]));
  // Lo menos que dejan dos pistas juntas, buscado entre todos los pares.
  const MIN_DOS = Math.min(...PISTAS_L.flatMap((_, i) => PISTAS_L.map((_, j) => (i < j ? ordenesSel({ ['p' + i]: 1, ['p' + j]: 1 }).length : Infinity))));
  const mesaPistas = {
    id: 'pistas-a-elegir', titulo: 'Pistas a elegir', pieza: 'rm-tablero',
    consigna: 'Pon o quita cada pista de la fila de cuatro. ¿Qué pistas sobran y cuáles hacen falta?',
    controles: PISTAS_L.map((c, k) => ({ id: 'p' + k, etiqueta: c.t, opciones: SINO })),
    dibujo: val => ({ datos: filaOrdenes(ordenesSel(val)), estado: {} }),
    lectura: val => { const n = PISTAS_L.filter((_, k) => val['p' + k]).length, o = ordenesSel(val).length; return [`${plural(n, 'pista', 'pistas')}: `, plural(o, 'orden posible', 'órdenes posibles')]; },
    // Retos: cuentan con ordenesSel(), el mismo filtro que llena el tablero de órdenes.
    invitaciones: [
      { texto: 'Quita una pista sin que cambie el número de órdenes posibles.',
        logrado: val => nPistas(val) === PISTAS_L.length - 1 && ordenesSel(val).length === ordenesSel(TODAS).length,
        bien: 'Esa pista sobraba: lo que tacha ya lo tachaban las otras.' },
      { texto: 'Quita todas las pistas y mira cuántos órdenes caben en la fila.',
        logrado: val => nPistas(val) === 0,
        bien: `Sin pistas, ${permutaciones(GENTE).length} órdenes: 4 · 3 · 2 · 1. Cada pista va tachando.` },
      { texto: 'Deja solo dos pistas que juntas dejen la menor cantidad de órdenes.',
        logrado: val => nPistas(val) === 2 && ordenesSel(val).length === MIN_DOS,
        bien: 'Dos pistas que tachan cosas distintas rinden más que dos parecidas.' },
      { texto: 'Guarda dos casos con una sola pista cada uno, distintas, y compara sus órdenes.',
        logrado: (val, guardados) => guardados.some(x => guardados.some(y => nPistas(x) === 1 && nPistas(y) === 1
          && PISTAS_L.some((_, k) => x['p' + k] !== y['p' + k]))),
        bien: `Cada una sola deja ${ordenesSel({ p0: 1 }).length} de ${permutaciones(GENTE).length}. Ninguna basta: hacen falta juntas.` },
    ],
  };

  return {
    unidad: 'razonamiento-matematico.ordenamiento-de-informacion',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-tablero.js', '/nucleo/kit/piezas/rm-plano.js'],
    // Glosario (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso.
    glosario: [
      { termino: 'ordenamiento lineal', def: 'Ubicar personas o cosas en una fila, de un extremo al otro, según unas pistas.',
        formas: ['ordenamiento lineal'], ver: ['a la izquierda de', 'junto a'] },
      { termino: 'ordenamiento circular', def: 'Ubicar personas alrededor de una mesa redonda, donde no hay primer ni último lugar.',
        formas: ['ordenamiento circular'], ver: ['referencia', 'sentido antihorario'] },
      { termino: 'referencia', def: 'Persona o lugar fijo desde el que se ubica a todos los demás.',
        ejemplo: 'Con Ana fija abajo, «a su derecha» ya señala una sola silla.', ver: ['ordenamiento circular'] },
      { termino: 'a la izquierda de', def: 'En una fila, en algún lugar antes, sin decir cuántos lugares hay de por medio.',
        formas: ['a la izquierda de'], ejemplo: 'Eva en el 1.º y Fito en el 4.º: Eva está a la izquierda de Fito.', ver: ['inmediatamente', 'junto a'] },
      { termino: 'a la derecha de', def: 'Del lado de la mano derecha de quien mira. En la mesa redonda, mirando al centro, va contra el reloj.',
        formas: ['a la derecha de'], ver: ['sentido antihorario'] },
      { termino: 'inmediatamente', def: 'Sin nadie en medio: en el lugar de al lado.',
        ejemplo: 'Eva inmediatamente a la izquierda de Fito: Eva en el 2.º, Fito en el 3.º.', ver: ['junto a'] },
      { termino: 'junto a', def: 'Al lado, sin nadie en medio, sea a la izquierda o a la derecha.',
        formas: ['junto a'], ver: ['inmediatamente'] },
      { termino: 'frente a', def: 'En una mesa, en la silla del otro lado: la que se mira cruzando la mesa.',
        formas: ['frente a', 'enfrente'], ejemplo: 'En una mesa redonda de 8 sillas, frente a la 1 está la 5.' },
      { termino: 'sentido antihorario', def: 'Giro contrario al de las agujas del reloj.',
        formas: ['sentido antihorario', 'antihorario', 'sentido contrario al reloj'], ver: ['a la derecha de'] },
      { termino: 'giro', def: 'Vuelta de una ronda o de una figura alrededor de su centro, sin cambiar su forma.',
        formas: ['giro', 'giros'], ejemplo: 'En una mesa de 5, correr a todos una silla es un giro: el orden no cambia.' },
    ],
    // Laboratorio: la mesa redonda de 4 a 8 con derecha y frente, la cuadrada con 1 a 3 sillas por lado y las pistas
    // de la fila puestas o quitadas una a una.
    laboratorio: [mesaRonda, mesaCuad, mesaPistas],
    historia: {
      texto: 'En 1854, George Boole publicó Las leyes del pensamiento, donde trató el razonamiento como un cálculo con clases. No inventó los acertijos de asientos, pero ayudó a escribir con precisión cómo una frase reduce las posibilidades. Ordenar es eso: ver qué opciones deja en pie cada pista.',
      pregunta: '¿Cuántos órdenes deja vivos una sola pista?',
      fuente: { titulo: 'George Boole · Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/archives/sum2021/entries/boole/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'mesa-redonda': ['orden-circular', 'mesa-cuadrada'],
      'mesa-cuadrada-libre': ['mesa-cuadrada'],
      'pistas-a-elegir': ['orden-lineal'],
    },
    ideas: [lineal, circular, poligonal],
  };
});
