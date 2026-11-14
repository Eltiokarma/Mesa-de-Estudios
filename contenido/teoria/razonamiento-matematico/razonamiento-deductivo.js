/*
 * Teoría de «Razonamiento deductivo y parentesco» (razonamiento-matematico.razonamiento-deductivo).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 1) y su historia (Aristóteles, SEP).
 * Precisión del curso: una disposición correcta no es la solución única; la conclusión necesaria vale en todas
 * las configuraciones compatibles.
 * Colores (regla 4): A turquesa (c-i), B naranja (c-o), C verde (c-d); en la tabla, lo descartado en rojo (c-h).
 * Compañero: Faro (zorro). Códigos de error nuevos (hipótesis): RMT-DED-*.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: distinguir lo que se concluye siempre de lo que pasa en un dibujo posible.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión en el aula.
 *   Resultado observable: dice qué conclusión vale en todos los casos y cuándo «no se puede saber».
 *   Orden de atención: 1.º la figura (círculos, tabla, árbol) · 2.º la lectura en vivo · acción: Ya probé / Comprobar.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «si encontré un dibujo que cumple, ¿ya es la respuesta?».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const A = { v: 'c-i', t: 'A' }, B = { v: 'c-o', t: 'B' }, C = { v: 'c-d', t: 'C' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.elegir = xs => xs[Math.floor(r() * xs.length)];
    r.barajar = xs => { const y = xs.slice(); for (let i = y.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [y[i], y[j]] = [y[j], y[i]]; } return y; };
    return r;
  }
  // Opciones de texto: la correcta y los distractores que no repiten texto (máximo 4 en total).
  function opcionesTexto(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: correcta, correcta: true }];
    for (const d of distractores) { if (vistos.has(d.texto) || ops.length >= 4) continue; vistos.add(d.texto); ops.push(d); }
    return ops;
  }

  // ---------- Idea 1: conclusión necesaria con círculos de Venn-Euler ----------
  // Cambia: dónde cae C · Permanece: A dentro de B, las dos premisas · Progresa: los dibujos posibles se acumulan ·
  // Se reserva: el dibujo donde ningún A es C · Debe verse: que la premisa no obliga a A y C a tocarse.
  const VB = { x: 4, y: 3, r: 2.7 }, VA = { x: 3, y: 3, r: 1.2 };
  const POS_C = { lejos: { x: 7.2, y: 3, r: 1.5 }, cruza: { x: 4.7, y: 3, r: 1.3 }, cubre: { x: 3.1, y: 3, r: 1.7 } };
  const tocan = (p, q) => Math.hypot(p.x - q.x, p.y - q.y) < p.r + q.r - 1e-9;
  const venn = (c, extra = {}) => ({
    ancho: 10, alto: 6,
    circulos: [
      Object.assign({}, VB, { color: 'o', rotulo: 'B', en: [VB.x + 1.9, VB.y - 2.0] }),
      Object.assign({}, VA, { color: 'i', rotulo: 'A', en: [VA.x - 0.4, VA.y + 0.15] }),
      ...(c ? [Object.assign({}, c, { color: 'd', rotulo: 'C', en: [c.x + c.r * 0.45, c.y - c.r - 0.25], discontinua: !!extra.cDisc })] : []),
    ],
    pie: extra.pie,
  });
  const ideaVenn = {
    id: 'conclusion-necesaria',
    titulo: 'Lo que vale en todo dibujo',
    temas: ['Diagramas lineales y de Venn-Euler', 'Deductivo directo e indirecto'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Premisas: todos los A son B y algunos B son C. Prueba cada lugar posible de C y mira si toca a A.',
      voz: 'Cada lugar de C es un dibujo posible. Probemos todos.',
      controles: [{ id: 'c', etiqueta: 'C', opciones: [{ valor: 'lejos', texto: 'Lejos de A' }, { valor: 'cruza', texto: 'Cruza a A' }, { valor: 'cubre', texto: 'Cubre a A' }] }],
      dibujo: val => ({ datos: venn(POS_C[val.c]), estado: {} }),
      lectura: val => [`En este dibujo algún `, A, tocan(VA, POS_C[val.c]) ? ' es ' : ' no es ', C],
      minimo: 3,
    },
    predice: {
      pregunta: ['Con esas premisas, ¿se puede asegurar que algún ', A, ' es ', C, '?'],
      voz: 'Piensa en todos los dibujos, no solo en uno.',
      opciones: [
        { id: 'si', texto: 'Sí: A está dentro de B y B toca a C', error: 'RMT-DED-1', siFuera: 'Sería cierto si C tuviera que caer donde está A. Pero C puede tocar a B lejos de A.' },
        { id: 'no-nunca', texto: 'No: ningún A es C', error: 'RMT-DED-2', siFuera: 'Hay un dibujo así, pero en otro C cruza a A. Tampoco se asegura «ninguno».' },
        { id: 'c', texto: 'No se puede asegurar: hay un dibujo donde no se tocan', correcta: true },
      ],
      dibujo: { datos: venn(null), estado: {} },
      revelar: { datos: Object.assign(venn(POS_C.lejos), { pie: 'Cumple las premisas y ningún A es C' }), estado: {} },
      coincide: 'Coincide: basta un dibujo posible donde no pase para que no sea seguro.',
    },
    mira: {
      datos: {
        ancho: 10, alto: 6,
        circulos: [
          Object.assign({}, VB, { color: 'o', rotulo: 'B', en: [VB.x + 1.9, VB.y - 2.0] }),
          Object.assign({}, VA, { color: 'i', rotulo: 'A', en: [VA.x - 0.4, VA.y + 0.15], desde: 1 }),
          Object.assign({}, POS_C.cruza, { color: 'd', rotulo: 'C', en: [5.5, 1.5], desde: 2, hasta: 2 }),
          Object.assign({}, POS_C.lejos, { color: 'd', rotulo: 'C', en: [7.9, 1.25], desde: 3 }),
        ],
      },
      pasos: [
        { estado: { corte: 1 }, texto: '«Todos los A son B»: A queda dentro de B.', ecuacion: [A, ' ⊂ ', B] },
        { estado: { corte: 2 }, texto: 'Un dibujo posible: C cruza a A.', ecuacion: ['aquí algún ', A, ' es ', C] },
        { estado: { corte: 3 }, texto: 'Otro dibujo posible: C toca a B lejos de A.', ecuacion: ['aquí ningún ', A, ' es ', C] },
        { estado: { corte: 3 }, texto: 'Ambos cumplen las premisas y se contradicen: no hay conclusión sobre A y C.' },
      ],
    },
    regla: {
      texto: 'Una conclusión es necesaria solo si se cumple en todos los dibujos compatibles con las premisas. Un dibujo que la contradice basta para descartarla.',
      ecuacion: ['si todo ', A, ' es ', B, ' y todo ', B, ' es ', C, ', todo ', A, ' es ', C],
      condicion: 'cada premisa se dibuja tal como dice, sin agregar nada: «algunos» no dice cuáles.',
      voz: 'Una regla vale si resiste el dibujo que intenta romperla.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Dibuja las dos premisas y busca un caso que rompa cada opción.',
      generar(s) {
        const r = azar(s);
        const CAT = [['ajedrecistas', 'ajedrecista'], ['músicos', 'músico'], ['ciclistas', 'ciclista'], ['lectores', 'lector'], ['nadadores', 'nadador'], ['pintores', 'pintor'], ['cantantes', 'cantante']];
        const [[a, a1], [b, b1], [c, c1]] = r.barajar(CAT).slice(0, 3);
        const f = s % 5;
        const formas = [
          { p: [`Todos los ${a} son ${b}.`, `Todos los ${b} son ${c}.`], ok: `Todos los ${a} son ${c}`, sol: `${a} dentro de ${b} y ${b} dentro de ${c}.`,
            mal: [{ id: 'rec', texto: `Todos los ${c} son ${a}`, error: 'RMT-DED-3', siFuera: `Valdría si ${c} estuviera dentro de ${a}; las premisas dicen lo contrario.` }] },
          { p: [`Todos los ${a} son ${b}.`, `Algunos ${b} son ${c}.`], ok: `Nada seguro entre ${a} y ${c}`, sol: `${c} puede tocar a ${b} lejos de ${a} o cruzar a ${a}.`,
            mal: [{ id: 'uno', texto: `Algunos ${a} son ${c}`, error: 'RMT-DED-1', siFuera: 'Pasa en un dibujo, pero en otro ninguno lo es.' }] },
          { p: [`Ningún ${a1} es ${b1}.`, `Todos los ${c} son ${b}.`], ok: `Ningún ${c1} es ${a1}`, sol: `${c} está dentro de ${b}, y ${b} no toca a ${a}.`,
            mal: [{ id: 'uno', texto: `Algunos ${c} son ${a}`, error: 'RMT-DED-1', siFuera: `Haría falta que ${c} saliera de ${b}; las premisas lo impiden.` }] },
          { p: [`Todos los ${a} son ${b}.`, `Ningún ${b1} es ${c1}.`], ok: `Ningún ${a1} es ${c1}`, sol: `${a} está dentro de ${b}, y ${b} queda separado de ${c}.`,
            mal: [{ id: 'uno', texto: `Algunos ${a} son ${c}`, error: 'RMT-DED-1', siFuera: `Haría falta que ${a} saliera de ${b}.` }] },
          { p: [`Algunos ${a} son ${b}.`, `Todos los ${b} son ${c}.`], ok: `Algunos ${a} son ${c}`, sol: `Los ${a} que son ${b} están dentro de ${c}.`,
            mal: [{ id: 'todos', texto: `Todos los ${a} son ${c}`, error: 'RMT-DED-4', siFuera: `Valdría si todos los ${a} fueran ${b}; solo algunos lo son.` }] },
        ][f];
        const comunes = [
          { id: 'nada', texto: `Nada seguro entre ${a} y ${c}`, error: 'RMT-DED-2', siFuera: 'En todos los dibujos posibles pasa lo mismo: sí hay conclusión.' },
          { id: 'ning', texto: `Ningún ${a1} es ${c1}`, error: 'RMT-DED-2', siFuera: 'Es un dibujo posible, no el único.' },
          { id: 'todos2', texto: `Todos los ${a} son ${c}`, error: 'RMT-DED-4', siFuera: 'Es un dibujo posible, no el único.' },
          { id: 'alg2', texto: `Algunos ${a} son ${c}`, error: 'RMT-DED-1', siFuera: 'Es un dibujo posible, no el único.' },
        ];
        // Un dibujo compatible (dos en la forma sin conclusión), con el nombre de cada conjunto.
        const K = (x, y, r0, col, t) => ({ x, y, r: r0, color: col, rotulo: t, en: col === 'o' ? [x, y - r0 + 0.55] : [x, y - r0 - 0.3] });
        const KA = (x, y, r0, t) => ({ x, y, r: r0, color: 'i', rotulo: t, en: [x, y + 0.2] });
        const modelos = [
          [K(5, 3.3, 2.6, 'd', c), K(4.6, 3.6, 1.7, 'o', b), KA(4.3, 3.9, 0.8, a)],
          [K(2.4, 3.3, 1.9, 'o', b), KA(1.9, 3.6, 0.8, a), Object.assign(K(3.9, 3.9, 0.9, 'd', c), { en: [4.1, 5.4] }), K(7.6, 3.3, 1.9, 'o', b), KA(7.1, 3.6, 0.8, a), Object.assign(K(7.6, 3.9, 0.9, 'd', c), { en: [8.9, 5.4] })],
          [KA(2.2, 3.3, 1.4, a), K(6.8, 3.3, 2.3, 'o', b), Object.assign(K(6.8, 3.6, 1.1, 'd', c), { en: [6.8, 3.8] })],
          [K(3, 3.3, 2.2, 'o', b), KA(3, 3.6, 1.1, a), K(7.8, 3.3, 1.4, 'd', c)],
          [K(6.2, 3.3, 2.5, 'd', c), Object.assign(K(6.6, 3.5, 1.3, 'o', b), { en: [6.9, 3.7] }), KA(3.6, 3.8, 1.6, a)],
        ][f];
        return {
          pregunta: [formas.p[0], ' ', formas.p[1], ' ¿Qué se concluye con certeza?'],
          opciones: opcionesTexto(formas.ok, formas.mal.concat(comunes)),
          solucion: { texto: formas.sol, dibujo: { datos: { ancho: 10, alto: 6.4, circulos: modelos }, estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: «si p, entonces q»: directo e indirecto ----------
  // Cambia: el dato que se conoce · Permanece: la tabla de los cuatro casos y la regla que tacha uno ·
  // Progresa: los casos que sobreviven · Se reserva: el dato «la pista está seca» (indirecto) ·
  // Debe verse: se concluye solo si sobrevive una única fila.
  const CASOS = [['Sí', 'Sí'], ['Sí', 'No'], ['No', 'Sí'], ['No', 'No']];
  const cumpleDato = { llueve: c => c[0] === 'Sí', 'no-llueve': c => c[0] === 'No', mojada: c => c[1] === 'Sí', seca: c => c[1] === 'No' };
  function tablaSi(dato, corte = 0) {
    return {
      columnas: ['Llueve', 'Mojada', 'Queda'], filas: ['1', '2', '3', '4'], ancho: 80,
      celdas: CASOS.map((c, k) => {
        const reglaOk = k !== 1, ok = reglaOk && (!dato || cumpleDato[dato](c));
        const tenue = !ok;
        return [{ t: c[0], tenue }, { t: c[1], tenue }, { marca: ok ? 'si' : 'no', color: ok ? 'd' : 'h', desde: k === 1 ? 0 : corte }];
      }),
      notas: [{ t: 'Regla: si llueve, la pista se moja' }],
    };
  }
  const quedan = dato => CASOS.filter((c, k) => k !== 1 && cumpleDato[dato](c));
  const ideaSi = {
    id: 'si-entonces',
    titulo: 'Si llueve, la pista se moja',
    temas: ['Deductivo directo e indirecto'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'La regla tacha el caso «llueve y la pista sigue seca». Elige qué se sabe y mira qué casos quedan.',
      voz: 'Lo que quede en pie es todo lo que puede pasar.',
      controles: [{ id: 'dato', etiqueta: 'Se sabe', opciones: [{ valor: 'llueve', texto: 'Llueve' }, { valor: 'no-llueve', texto: 'No llueve' }, { valor: 'mojada', texto: 'Está mojada' }] }],
      dibujo: val => ({ datos: tablaSi(val.dato), estado: {} }),
      lectura: val => { const q = quedan(val.dato); return [q.length === 1 ? `Queda 1 caso: se concluye` : `Quedan ${q.length} casos: no se concluye`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Misma regla. Ahora se sabe que la pista está seca. ¿Qué se concluye con certeza?',
      opciones: [
        { id: 'nada', texto: 'Nada: la regla solo habla de cuando llueve', error: 'RMT-DED-5', siFuera: 'Es cierto que la regla empieza en la lluvia, pero tacha justo «llueve y seca».' },
        { id: 'c', texto: 'Que no llovió', correcta: true },
        { id: 'llovio', texto: 'Que llovió y ya se secó', error: 'RMT-DED-6', siFuera: 'Eso agrega tiempo a la regla. Tal como está, «llueve» obliga a «mojada».' },
      ],
      dibujo: { datos: tablaSi(null), estado: {} },
      revelar: { datos: tablaSi('seca'), estado: {} },
      coincide: 'Coincide: la única fila con pista seca que queda es la de «no llueve».',
    },
    mira: {
      datos: tablaSi('seca', 1),
      base: {},
      pasos: [
        { estado: { corte: 0 }, texto: 'La regla tacha la fila 2: llueve y la pista seca.', ecuacion: ['p ⇒ q'] },
        { estado: { corte: 1 }, texto: 'El dato «seca» tacha las filas 1 y 3.', ecuacion: ['no q'] },
        { estado: { corte: 1 }, texto: 'Solo queda la fila 4: no llovió. Es la forma indirecta.', ecuacion: ['(p ⇒ q) y no q  ⇒  no p'] },
        { estado: { corte: 1 }, texto: 'Con «mojada» quedaban dos filas: ahí no se concluye nada.', ecuacion: ['(p ⇒ q) y q  ⇏  p'] },
      ],
    },
    regla: {
      texto: 'De «si p, entonces q» se concluye q cuando ocurre p (directo) y «no p» cuando no ocurre q (indirecto). Saber q o «no p» no basta.',
      ecuacion: ['(p ⇒ q) y p ⇒ q   ·   (p ⇒ q) y no q ⇒ no p'],
      condicion: 'la regla se cumple siempre, sin excepciones, y p y q significan lo mismo en todo el razonamiento.',
    },
    ahoraTu: {
      voz: 'Arma la tabla de cuatro casos en la cabeza y tacha.',
      generar(s) {
        const r = azar(s);
        const plantillas = [
          ['Luis estudia', 'Luis no estudia', 'aprueba', 'Luis aprueba', 'Luis no aprueba'],
          ['el foco está prendido', 'el foco no está prendido', 'hay corriente', 'hay corriente', 'no hay corriente'],
          ['un número termina en 0', 'el número no termina en 0', 'es par', 'el número es par', 'el número no es par'],
          ['una persona es de Juliaca', 'no es de Juliaca', 'es de Puno', 'es de Puno', 'no es de Puno'],
          ['el pan está en el horno', 'el pan no está en el horno', 'está caliente', 'el pan está caliente', 'el pan no está caliente'],
          ['la puerta está abierta', 'la puerta no está abierta', 'entra el gato', 'entra el gato', 'no entra el gato'],
        ];
        const [p, np, qCorta, q, nq] = r.elegir(plantillas);
        const tipo = (s + r.ent(0, 3)) % 4;
        const sabe = [p, nq, q, np][tipo];
        const correcta = ['Que ' + q, 'Que ' + np, 'Nada con certeza', 'Nada con certeza'][tipo];
        return {
          pregunta: `Regla: si ${p}, ${qCorta}. Se sabe que ${sabe}. ¿Qué se concluye con certeza?`,
          opciones: opcionesTexto(correcta, [
            { id: 'nada', texto: 'Nada con certeza', error: 'RMT-DED-5', siFuera: 'Aquí sobrevive una sola fila de la tabla: sí hay conclusión.' },
            { id: 'q', texto: 'Que ' + q, error: 'RMT-DED-7', siFuera: 'Valdría si la regla también fuera al revés; quedan dos filas.' },
            { id: 'p', texto: 'Que ' + p, error: 'RMT-DED-7', siFuera: 'Valdría si la regla también fuera al revés; quedan dos filas.' },
            { id: 'nq', texto: 'Que ' + nq, error: 'RMT-DED-8', siFuera: 'Sería cierto si la regla dijera «solo si»; quedan dos filas.' },
            { id: 'np', texto: 'Que ' + np, error: 'RMT-DED-8', siFuera: 'Sería cierto si la regla dijera «solo si»; quedan dos filas.' },
          ].filter(o => o.texto !== correcta)),
          solucion: { texto: tipo < 2 ? 'Tachando con la regla y el dato, queda una sola fila.' : 'Quedan dos filas posibles: no se decide.' },
        };
      },
    },
  };

  // ---------- Idea 3: cuadro de doble entrada ----------
  // Cambia: cuántas pistas se usan · Permanece: el cuadro 3 × 3 · Progresa: las ✗ que se acumulan ·
  // Se reserva: la cuarta pista, que deja un solo reparto · Debe verse: ✓ solo donde todos los repartos coinciden.
  const PERMS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
  const compatibles = pistas => PERMS.filter(p => pistas.every(([q, i]) => p[q] !== i));
  function cuadro(personas, cosas, pistas, extra = {}) {
    const vivos = compatibles(pistas);
    return {
      columnas: cosas, filas: personas,
      celdas: personas.map((_, q) => cosas.map((_, i) => {
        const n = vivos.filter(p => p[q] === i).length;
        if (n === 0) return { marca: 'no', color: 'h' };
        if (n === vivos.length) return { marca: 'si', color: 'd' };
        return '';
      })),
      notas: [{ t: extra.nota || `Repartos posibles: ${vivos.length}` }],
    };
  }
  const P3 = ['Ana', 'Beto', 'Ciro'], D3 = ['Fútbol', 'Vóley', 'Ajedrez'];
  const PISTAS = [[0, 1], [1, 0], [2, 2], [0, 2]];   // Ana no vóley · Beto no fútbol · Ciro no ajedrez · Ana no ajedrez
  const TXT = ['Ana no juega vóley', 'Beto no juega fútbol', 'Ciro no juega ajedrez', 'Ana no juega ajedrez'];
  const ideaCuadro = {
    id: 'doble-entrada',
    titulo: 'El cuadro que descarta',
    temas: ['Cuadros de doble entrada'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'Cada uno juega un deporte distinto. Agrega las pistas una a una: ✗ es imposible y ✓ es seguro.',
      voz: 'Una ✓ sale cuando todos los repartos que quedan coinciden.',
      controles: [{ id: 'n', etiqueta: 'Pistas', min: 0, max: 3, paso: 1, inicio: 0, decimales: 0 }],
      dibujo: val => ({ datos: cuadro(P3, D3, PISTAS.slice(0, val.n)), estado: {} }),
      lectura: val => [val.n ? `Pista ${val.n}: ${TXT[val.n - 1]}` : 'Sin pistas todavía'],
      minimo: 4,
    },
    predice: {
      pregunta: 'Con las tres pistas quedan dos repartos. Se agrega: «Ana no juega ajedrez». ¿Qué juega Beto?',
      opciones: [
        { id: 'voley', texto: 'Vóley', error: 'RMT-DED-9', siFuera: 'Vóley era posible con tres pistas, en el reparto que la cuarta tacha.' },
        { id: 'nose', texto: 'No se puede saber', error: 'RMT-DED-2', siFuera: 'Antes no se sabía. La cuarta pista deja un solo reparto.' },
        { id: 'c', texto: 'Ajedrez', correcta: true },
        { id: 'futbol', texto: 'Fútbol', error: 'RMT-DED-10', siFuera: 'La pista 2 ya tachó fútbol para Beto.' },
      ],
      dibujo: { datos: cuadro(P3, D3, PISTAS.slice(0, 3)), estado: {} },
      revelar: { datos: cuadro(P3, D3, PISTAS), estado: {} },
      coincide: 'Coincide: Ana queda con fútbol, y en la columna de fútbol ya no cabe Beto.',
    },
    mira: {
      datos: {
        columnas: D3, filas: P3,
        celdas: [
          [{ marca: 'si', color: 'd', desde: 3 }, { marca: 'no', color: 'h', desde: 1 }, { marca: 'no', color: 'h', desde: 2 }],
          [{ marca: 'no', color: 'h', desde: 1 }, { marca: 'no', color: 'h', desde: 4 }, { marca: 'si', color: 'd', desde: 4 }],
          [{ marca: 'no', color: 'h', desde: 3 }, { marca: 'si', color: 'd', desde: 4 }, { marca: 'no', color: 'h', desde: 1 }],
        ],
        marcos: [{ f: 0, c: 0, ancho: 3, color: 'i', desde: 2, hasta: 3 }, { f: 0, c: 0, alto: 3, color: 'i', desde: 4 }],
        notas: [{ t: 'Un solo reparto: fútbol, ajedrez, vóley', desde: 4 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Las pistas 1, 2 y 3 ponen tres ✗.' },
        { estado: { corte: 2 }, texto: 'La pista 4 tacha ajedrez para Ana.' },
        { estado: { corte: 3 }, texto: 'A Ana solo le queda fútbol: ✓, y el resto de esa columna, ✗.' },
        { estado: { corte: 4 }, texto: 'A Beto solo le queda ajedrez; a Ciro, vóley.' },
      ],
    },
    regla: {
      texto: 'Cada fila y cada columna tiene exactamente una ✓. Al poner una ✓, se tacha el resto de su fila y de su columna.',
      ecuacion: ['✓ seguro  ⇔  vale en todos los repartos que quedan'],
      condicion: 'cada persona tiene una sola cosa y cada cosa es de una sola persona; si no, el cuadro no es de reparto.',
    },
    ahoraTu: {
      voz: 'Tacha en tu cuadro y busca la fila con una sola casilla libre.',
      generar(s) {
        const r = azar(s);
        const personas = r.barajar(['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito']).slice(0, 3);
        const [cosas, verbo] = r.elegir([[['Fútbol', 'Vóley', 'Ajedrez'], 'juega'], [['Flauta', 'Charango', 'Bombo'], 'toca'], [['Rojo', 'Azul', 'Verde'], 'viste'], [['Puno', 'Cusco', 'Lima'], 'vive en']]);
        let pistas = null;
        for (let t = 0; t < 30 && !pistas; t++) {
          const sol = r.elegir(PERMS), falsos = [];
          for (let q = 0; q < 3; q++) for (let i = 0; i < 3; i++) if (sol[q] !== i) falsos.push([q, i]);
          const orden = r.barajar(falsos), ps = [];
          for (const f of orden) { ps.push(f); if (compatibles(ps).length === 1) break; }
          if (ps.length <= 4) pistas = ps;
        }
        const sol = compatibles(pistas)[0], quien = r.ent(0, 2);
        const minus = c => c.toLowerCase();
        const correcta = cosas[sol[quien]];
        return {
          pregunta: `Cada uno ${verbo} algo distinto. ${pistas.map(([q, i]) => `${personas[q]} no ${verbo} ${minus(cosas[i])}`).join('; ')}. ¿Qué ${verbo} ${personas[quien]}?`,
          dibujo: { datos: cuadro(personas, cosas, [], { nota: 'Marca tus ✗ en la cabeza' }), estado: {} },
          opciones: opcionesTexto(correcta, [
            ...cosas.filter(c => c !== correcta).map((c, k) => ({ id: 'otra' + k, texto: c, error: 'RMT-DED-9', siFuera: `${c} cabe en un reparto que otra pista tacha.` })),
            { id: 'nose', texto: 'Faltan datos', error: 'RMT-DED-2', siFuera: 'Las pistas dejan un solo reparto.' },
          ]),
          solucion: { texto: `Con las ✗, a ${personas[quien]} le queda una sola casilla.`, dibujo: { datos: cuadro(personas, cosas, pistas), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 4: parentesco ----------
  // Cambia: el camino que se sigue en el árbol · Permanece: el árbol de tres generaciones · Progresa: las flechas que se
  // recorren · Se reserva: una persona con dos papeles (padre e hijo) · Debe verse: un papel no es una persona nueva.
  const ARBOL_N = [
    { id: 'raul', x: 5, y: 0.6, t: 'R', etiqueta: 'Raúl', lado: 'der' },
    { id: 'pedro', x: 2.6, y: 3, t: 'P', etiqueta: 'Pedro', lado: 'izq' },
    { id: 'tomas', x: 7.4, y: 3, t: 'T', etiqueta: 'Tomás', lado: 'der' },
    { id: 'ana', x: 1.6, y: 5.4, t: 'A', etiqueta: 'Ana', lado: 'abajo' },
    { id: 'luis', x: 3.8, y: 5.4, t: 'L', etiqueta: 'Luis', lado: 'abajo' },
    { id: 'ivan', x: 7.4, y: 5.4, t: 'I', etiqueta: 'Iván', lado: 'abajo' },
  ];
  const ARBOL_A = [['raul', 'pedro'], ['raul', 'tomas'], ['pedro', 'ana'], ['pedro', 'luis'], ['tomas', 'ivan']];
  const CAMINOS = {
    padre: { pasos: [['ana', 'pedro']], nombre: 'su padre, Pedro' },
    abuelo: { pasos: [['ana', 'pedro'], ['pedro', 'raul']], nombre: 'su abuelo, Raúl' },
    tio: { pasos: [['ana', 'pedro'], ['pedro', 'raul'], ['raul', 'tomas']], nombre: 'su tío, Tomás' },
    primo: { pasos: [['ana', 'pedro'], ['pedro', 'raul'], ['raul', 'tomas'], ['tomas', 'ivan']], nombre: 'su primo, Iván' },
  };
  function arbol(camino, extra = {}) {
    const on = new Set((camino ? CAMINOS[camino].pasos : []).map(p => p.join('-')));
    const marca = camino ? CAMINOS[camino].pasos[CAMINOS[camino].pasos.length - 1][1] : null;
    return {
      ancho: 10, alto: 6.4,
      nodos: ARBOL_N.map(n => Object.assign({}, n, n.id === 'ana' ? { color: 'i' } : n.id === marca ? { color: 'o' } : {}, extra.nodos && extra.nodos[n.id] ? extra.nodos[n.id] : {})),
      aristas: ARBOL_A.map(([a, b]) => ({ de: a, a: b, color: on.has(`${a}-${b}`) || on.has(`${b}-${a}`) ? 'o' : undefined, grosor: on.has(`${a}-${b}`) || on.has(`${b}-${a}`) ? 'variable' : 'contorno' }))
        .concat(extra.aristas || []),
      pie: extra.pie,
    };
  }
  const ideaFamilia = {
    id: 'parentesco',
    titulo: 'Un papel no es una persona',
    temas: ['Parentesco'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Raúl tiene dos hijos, Pedro y Tomás. Elige un parentesco y sigue el camino desde Ana por las líneas del árbol.',
      voz: 'Subir es ir a los padres; bajar, a los hijos.',
      controles: [{ id: 'c', etiqueta: 'Para Ana', opciones: [{ valor: 'padre', texto: 'Padre' }, { valor: 'abuelo', texto: 'Abuelo' }, { valor: 'tio', texto: 'Tío' }, { valor: 'primo', texto: 'Primo' }] }],
      dibujo: val => ({ datos: arbol(val.c), estado: {} }),
      lectura: val => [`Para Ana, es ${CAMINOS[val.c].nombre}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Dos padres y dos hijos fueron a pescar. ¿Cuántas personas son, como mínimo?',
      voz: 'Mira cuántos papeles tiene Pedro en el árbol.',
      opciones: [
        { id: 'c', texto: 'Tres', correcta: true },
        { id: 'cuatro', texto: 'Cuatro', error: 'RMT-DED-11', siFuera: 'Cuatro sería cierto si cada papel fuera otra persona. Uno puede ser padre e hijo.' },
        { id: 'dos', texto: 'Dos', error: 'RMT-DED-12', siFuera: 'Con dos personas hay un solo padre y un solo hijo.' },
      ],
      dibujo: { datos: arbol(null), estado: {} },
      revelar: { datos: arbol('abuelo', { nodos: { pedro: { color: 'd' }, raul: { color: 'o' }, ana: { color: 'i' } }, pie: 'Raúl, Pedro y Ana: 2 padres y 2 hijos' }), estado: {} },
      coincide: 'Coincide: Pedro es hijo de Raúl y padre de Ana a la vez.',
    },
    mira: {
      datos: {
        ancho: 10, alto: 6.4,
        nodos: ARBOL_N.filter(n => ['raul', 'pedro', 'ana'].includes(n.id)).map(n => Object.assign({}, n, n.id === 'pedro' ? { color: 'd' } : {})),
        aristas: [{ de: 'raul', a: 'pedro', color: 'o', grosor: 'variable', desde: 1 }, { de: 'pedro', a: 'ana', color: 'o', grosor: 'variable', desde: 2 }],
        textos: [{ x: 7.6, y: 1.9, t: 'Raúl: padre', color: 'o', desde: 1 }, { x: 4.4, y: 5.4, t: 'Ana: hija', color: 'o', desde: 2 }, { x: 6.4, y: 3.4, t: 'Pedro: hijo y padre', color: 'd', desde: 3 }],
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Raúl es padre; Pedro, su hijo.', ecuacion: ['1 padre · 1 hijo'] },
        { estado: { corte: 2 }, texto: 'Pedro también es padre de Ana; Ana es hija.', ecuacion: ['2 padres · 2 hijos'] },
        { estado: { corte: 3 }, texto: 'Pedro tiene dos papeles: cuatro papeles, tres personas.', ecuacion: ['personas = 3'] },
      ],
    },
    regla: {
      texto: 'Cada línea del árbol es una relación padre-hijo. Un parentesco es un camino: subir a los padres y bajar a los hijos. Una persona puede tener varios papeles.',
      ecuacion: ['tío = hermano del padre   ·   primo = hijo del tío'],
      condicion: 'no se supone matrimonio, sexo ni que alguien sea hijo único si el enunciado no lo dice.',
    },
    ahoraTu: {
      voz: 'Dibuja el árbol con los pasos que dice la frase.',
      generar(s) {
        const r = azar(s);
        // Cada relación es (sube, baja) en el árbol. Se componen solo las que no vuelven por la misma línea.
        const REL = [['padre', 1, 0, 'm'], ['madre', 1, 0, 'f'], ['hermano', 1, 1, 'm'], ['hermana', 1, 1, 'f'], ['hijo', 0, 1, 'm'], ['hija', 0, 1, 'f'], ['abuelo', 2, 0, 'm'], ['tío', 2, 1, 'm'], ['tía', 2, 1, 'f']];
        const NOMBRE = { '1,0': ['padre', 'madre'], '2,0': ['abuelo', 'abuela'], '3,0': ['bisabuelo', 'bisabuela'], '0,1': ['hijo', 'hija'], '0,2': ['nieto', 'nieta'], '0,3': ['bisnieto', 'bisnieta'], '1,1': ['hermano', 'hermana'], '2,1': ['tío', 'tía'], '1,2': ['sobrino', 'sobrina'], '2,2': ['primo', 'prima'], '3,1': ['tío abuelo', 'tía abuela'], '1,3': ['sobrino nieto', 'sobrina nieta'] };
        let r1, r2, u, d;
        for (;;) {
          r1 = r.elegir(REL); r2 = r.elegir(REL);
          if (r1[2] > 0 && r2[1] > 0) continue;              // bajar y volver a subir: no se sabe a quién se llega
          if (r1[2] === 0 && r2[1] === 0 && r2[2] > 0) continue; // subir y bajar por un hijo: puede volver a la misma rama
          u = r1[1] + r2[1]; d = r1[2] + r2[2];
          if (NOMBRE[`${u},${d}`]) break;
        }
        const yo = r.elegir([['Ana', 'f'], ['Rosa', 'f'], ['Luis', 'm'], ['Iván', 'm']]);
        const art = r1[3] === 'f' ? 'la' : 'el', de = r1[3] === 'f' ? 'de la' : 'del';
        const g2 = r2[3] === 'f' ? 1 : 0;
        const inversa = s % 2 === 1;
        const nombre = inversa ? NOMBRE[`${d},${u}`][yo[1] === 'f' ? 1 : 0] : NOMBRE[`${u},${d}`][g2];
        const frase = `${r2[3] === 'f' ? 'la' : 'el'} ${r2[0]} ${de} ${r1[0]} de ${yo[0]}`;
        void art;
        const pregunta = inversa ? `Si Carmen es ${frase}, ¿qué es ${yo[0]} de Carmen?` : `¿Qué es de ${yo[0]} ${frase}?`;
        const genero = inversa ? (yo[1] === 'f' ? 1 : 0) : g2;
        const vecinos = [`${u},${d}`, `${d},${u}`, `${u + 1},${d}`, `${u},${d + 1}`, `${Math.max(0, u - 1)},${d}`, `${u},${Math.max(0, d - 1)}`]
          .filter(k => NOMBRE[k]).map(k => NOMBRE[k][genero]);
        return {
          pregunta,
          opciones: opcionesTexto(nombre, vecinos.map((t, k) => ({ id: 'v' + k, texto: t, error: k === 1 ? 'RMT-DED-13' : 'RMT-DED-14', siFuera: k === 1 ? 'Ese es el parentesco visto desde la otra persona.' : 'Cuenta otra vez cuántas líneas sube y cuántas baja el camino.' }))),
          solucion: { texto: `El camino sube ${inversa ? d : u} y baja ${inversa ? u : d} líneas: ${nombre}.` },
        };
      },
    },
  };

  return {
    unidad: 'razonamiento-matematico.razonamiento-deductivo',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-plano.js', '/nucleo/kit/piezas/rm-tablero.js'],
    historia: {
      texto: 'En el siglo IV a. C., Aristóteles estudió qué conclusiones se siguen necesariamente de unas premisas. Separó dos cosas: que las premisas sean verdaderas y que el paso hacia la conclusión sea válido. Los acertijos de familias y repartos de hoy son otra aplicación de esa misma pregunta.',
      pregunta: '¿Cuándo una conclusión no puede fallar?',
      fuente: { titulo: 'Aristotle’s Logic · Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/entries/aristotle-logic/' },
    },
    ideas: [ideaVenn, ideaSi, ideaCuadro, ideaFamilia],
  };
});
