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
  // Gesto directo (docs/teoria.md §4b): las manijas viven en el lienzo de rm-plano (geometria exportada).
  const PLANO = () => Kit.piezas['rm-plano'];
  const enPx = (datos, ux, uy) => { const g = PLANO().geometria(datos); return { x: g.X(ux), y: g.Y(uy) }; };
  const aU = (datos, pt) => { const g = PLANO().geometria(datos); return { x: (pt.x - g.X(0)) / g.k, y: (pt.y - g.Y(0)) / g.k }; };
  const cercano = (pares, p) => pares.reduce((m, q) => (Math.hypot(q[1] - p.x, q[2] - p.y) < Math.hypot(m[1] - p.x, m[2] - p.y) ? q : m))[0];

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
    // Lee (fase 2): vocabulario de premisa, Venn y «algunos», sin decir si A y C quedan amarrados (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'Datos para razonar', texto: 'Alguien en Juliaca dice: «Todos los mototaxistas conocen la plaza de Armas». Ese dato, que se acepta para razonar, es una premisa. Lo que se afirma a partir de las premisas es la conclusión.' },
        { titulo: 'Un círculo por grupo', texto: ['En un diagrama de Venn, cada grupo es un círculo. «Todos los ', A, ' son ', B, '» se dibuja con el círculo ', A, ' completo dentro del círculo ', B, '.'],
          ecuacion: [A, ' ⊂ ', B] },
        { titulo: 'Qué dice «algunos»', texto: ['«Algunos ', B, ' son ', C, '» quiere decir que al menos un ', B, ' es ', C, ', y quizás todos. En el dibujo, los círculos ', B, ' y ', C, ' tienen que tocarse.'] },
        { titulo: 'Qué mirar al jugar', texto: ['En el juego, ', C, ' puede ir en tres lugares. En cada uno, revisa si se cumplen las dos premisas y si ', C, ' toca a ', A, '.'] },
      ],
    },
    juega: {
      consigna: 'Las premisas: todos los A son B y algunos B son C. En este diagrama de Venn, prueba cada lugar de C: ¿toca a A?',
      voz: 'Cada lugar de C es un dibujo posible. Probemos todos.',
      controles: [{ id: 'c', etiqueta: 'C', opciones: [{ valor: 'lejos', texto: 'Lejos de A' }, { valor: 'cruza', texto: 'Cruza a A' }, { valor: 'cubre', texto: 'Cubre a A' }] }],
      dibujo: val => ({ datos: venn(POS_C[val.c]), estado: {} }),
      lectura: val => [`En este dibujo algún `, A, tocan(VA, POS_C[val.c]) ? ' es ' : ' no es ', C],
      minimo: 3,
      // Arrastra el borde derecho de C hacia A o lejos de él: cae en el lugar posible más cercano.
      arrastres: [{ id: 'circulo-c', etiqueta: 'lugar del círculo C', color: 'c-d',
        donde: val => enPx(venn(POS_C[val.c]), POS_C[val.c].x + POS_C[val.c].r, POS_C[val.c].y),
        mover: (pt, val) => ({ c: cercano(Object.entries(POS_C).map(([k, c]) => [k, c.x + c.r, c.y]), aU(venn(POS_C[val.c]), pt)) }) }],
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
    // Así se resuelve (fase 2): el mismo generador de «Ahora tú» (formas, opciones y dibujo compatible), con la semilla + 900.
    resuelve: {
      pieza: 'rm-plano',
      generar(s) {
        const c = ideaVenn.ahoraTu.generar(s + 900);
        const [p1, , p2] = c.pregunta;
        const ok = c.opciones.find(o => o.correcta), mal = c.opciones.find(o => !o.correcta);
        const modelo = c.solucion.dibujo;
        // El enunciado dibuja solo la primera premisa: un círculo por nombre, sin el tercer grupo (verde).
        const vistos = new Set(), primera = [];
        for (const k of modelo.datos.circulos) if (!vistos.has(k.rotulo)) { vistos.add(k.rotulo); primera.push(k); }
        const tercero = modelo.datos.circulos.find(k => k.color === 'd').rotulo;
        return {
          enunciado: c.pregunta,
          dibujo: { datos: { ancho: 10, alto: 6.4, circulos: primera.filter(k => k.rotulo !== tercero), pie: 'Primera premisa' }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden lo que se concluye con certeza: lo que vale en todo dibujo que cumpla las dos premisas.' },
            { tipo: 'datos', texto: ['Premisa 1: ', p1, ' Premisa 2: ', p2] },
            { tipo: 'regla', texto: 'Dibujo cada grupo como un círculo, tal como dicen las premisas, sin agregar nada. Es seguro solo lo que pasa en todos los dibujos posibles.' },
            { tipo: 'aplica', texto: `Lo dibujo: ${c.solucion.texto}`, dibujo: modelo },
            { tipo: 'sentido', texto: `¿Y «${mal.texto}»? ${mal.siFuera}` },
          ],
          respuesta: ok.texto,
        };
      },
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
          [K(6.2, 3.3, 2.5, 'd', c), Object.assign(K(6.6, 3.5, 1.3, 'o', b), { en: [6.9, 3.7] }), KA(4.1, 3.8, 1.6, a)],
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
    // Lee (fase 2): el condicional, sus dos partes y los cuatro casos; no dice qué pasa con «la pista está seca».
    lee: {
      tarjetas: [
        { titulo: 'Una regla con «si»', texto: '«Si llueve, la pista se moja» es un condicional. Tiene dos partes: lo que pasa primero, que se llama p, y lo que trae consigo, que se llama q.',
          ecuacion: ['si p, entonces q'] },
        { titulo: 'Cuatro casos', texto: 'Antes de saber nada, pueden pasar cuatro cosas: llueve o no llueve, y la pista queda mojada o seca. La tabla del juego pone cada caso en una fila.' },
        { titulo: 'Lo que la regla prohíbe', texto: 'La regla no dice qué pasará; prohíbe un caso: que llueva y la pista siga seca. En una tarde de lluvia en Juliaca, esa fila no puede ocurrir.' },
        { titulo: 'Qué mirar al jugar', texto: 'En el juego eliges qué se sabe. Cuenta cuántas filas quedan en pie: si queda una sola, ya se sabe todo lo que pasó.' },
      ],
    },
    // Sin arrastre: lo que se elige es un dato (una frase), no un lugar de la tabla; las filas son lo que resulta.
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
      texto: 'Del condicional «si p, entonces q» se concluye q cuando ocurre p (forma directa) y «no p» cuando no ocurre q (forma indirecta). Saber q o «no p» no basta.',
      ecuacion: [{ llave: ['(p ⇒ q)'], nota: 'la regla', color: 'c-i' }, ' y p ⇒ q', '   ·   ', '(p ⇒ q) y ', { llave: ['no q'], nota: 'el dato', color: 'c-o' }, ' ⇒ no p'],
      condicion: 'la regla se cumple siempre, sin excepciones, y p y q significan lo mismo en todo el razonamiento.',
    },
    // Así se resuelve (fase 2): las mismas plantillas y la misma tabla de cuatro casos de «Ahora tú», con la semilla + 900.
    resuelve: {
      pieza: 'rm-tablero',
      generar(s) {
        const t = s + 900, r = azar(t);
        const plantillas = [
          ['Luis estudia', 'Luis no estudia', 'aprueba', 'Luis aprueba', 'Luis no aprueba'],
          ['el foco está prendido', 'el foco no está prendido', 'hay corriente', 'hay corriente', 'no hay corriente'],
          ['un número termina en 0', 'el número no termina en 0', 'es par', 'el número es par', 'el número no es par'],
          ['una persona es de Juliaca', 'no es de Juliaca', 'es de Puno', 'es de Puno', 'no es de Puno'],
          ['el pan está en el horno', 'el pan no está en el horno', 'está caliente', 'el pan está caliente', 'el pan no está caliente'],
          ['la puerta está abierta', 'la puerta no está abierta', 'entra el gato', 'entra el gato', 'no entra el gato'],
        ];
        const [p, np, qCorta, q, nq] = r.elegir(plantillas);
        const tipo = (t + r.ent(0, 3)) % 4;
        const sabe = [p, nq, q, np][tipo];
        const correcta = ['Que ' + q, 'Que ' + np, 'Nada con certeza', 'Nada con certeza'][tipo];
        // El dato, en las llaves de la tabla del juego: p ↔ llueve, q ↔ mojada.
        const dato = ['llueve', 'seca', 'mojada', 'no-llueve'][tipo];
        const tabla = d => ({ datos: Object.assign(tablaSi(d), { columnas: ['p', 'q', 'Queda'], notas: [{ t: 'Regla: si p, entonces q' }] }), estado: {} });
        const filas = CASOS.map((c, k) => k).filter(k => k !== 1 && cumpleDato[dato](CASOS[k]));
        const caso = k => `${CASOS[k][0] === 'Sí' ? p : np} y ${CASOS[k][1] === 'Sí' ? q : nq}`;
        const una = filas.length === 1;
        return {
          enunciado: `Regla: si ${p}, ${qCorta}. Se sabe que ${sabe}. ¿Qué se concluye con certeza?`,
          dibujo: tabla(null),
          pasos: [
            { tipo: 'pide', texto: 'Piden lo que es seguro sabiendo la regla y el dato.' },
            { tipo: 'datos', texto: `p: ${p}. q: ${qCorta}. Dato: ${sabe}.` },
            { tipo: 'regla', texto: 'Armo los cuatro casos de p y q. La regla tacha «p sí, q no»; el dato tacha los que no lo cumplen. Si queda uno, se concluye.' },
            { tipo: 'aplica', texto: una ? `La regla tacha la fila 2 y el dato deja solo la fila ${filas[0] + 1}: ${caso(filas[0])}.` : `La regla tacha la fila 2, pero el dato deja dos filas en pie: la ${filas[0] + 1} y la ${filas[1] + 1}.`,
              ecuacion: [filas.map(k => `fila ${k + 1}: p ${CASOS[k][0].toLowerCase()}, q ${CASOS[k][1].toLowerCase()}`).join('   ·   ')], dibujo: tabla(dato) },
            { tipo: 'sentido', texto: una ? 'Compruebo: en esa fila se cumplen la regla y el dato a la vez, y en ninguna otra.' : 'Compruebo: las dos filas cumplen la regla y el dato, pero dicen cosas distintas. Nada vale en las dos.' },
          ],
          respuesta: correcta,
        };
      },
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
    // Lee (fase 2): reparto, cuadro de doble entrada y las dos marcas; no resuelve la cuarta pista (Predice).
    lee: {
      tarjetas: [
        { titulo: 'Un reparto', texto: 'Ana, Beto y Ciro juegan cada uno un deporte distinto: fútbol, vóley o ajedrez. Un reparto dice quién juega qué. Sin ninguna pista, hay 6 repartos posibles.' },
        { titulo: 'Filas y columnas', texto: 'En un cuadro de doble entrada, las personas van en las filas y los deportes en las columnas. Cada casilla responde una pregunta: ¿esta persona juega esto?' },
        { titulo: 'Dos marcas', texto: '✗ quiere decir que no puede ser. ✓ quiere decir que es seguro. Una pista como «Ana no juega vóley» pone una ✗ directa en su casilla.' },
        { titulo: 'Qué mirar al jugar', texto: 'En el juego, agrega las pistas una por una. Fíjate cuándo aparece la primera ✓ y cuántos repartos quedan después de cada pista.' },
      ],
    },
    // Sin arrastre: lo que cambia es cuántas pistas (frases) se usan; las ✗ y ✓ son su consecuencia, no se agarran.
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
      texto: 'En un cuadro de doble entrada, cada fila y cada columna tiene exactamente una ✓. Al poner una ✓, se tacha el resto de su fila y de su columna.',
      ecuacion: ['✓ seguro  ⇔  vale en todos los repartos que quedan'],
      condicion: 'cada persona tiene una sola cosa y cada cosa es de una sola persona; si no, el cuadro no es de reparto.',
    },
    // Así se resuelve (fase 2): las mismas pistas de «Ahora tú» (compatibles() y cuadro()), con la semilla + 900.
    resuelve: {
      pieza: 'rm-tablero',
      generar(s) {
        const r = azar(s + 900);
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
        // Los lugares conservan la mayúscula; lo demás va en minúscula dentro de la frase.
        const nom = c => (verbo === 'vive en' ? c : c.toLowerCase());
        const ancho = { ancho: 76 };   // columnas anchas: «Charango» no se monta con su vecina
        const soloX = { columnas: cosas, filas: personas, ancho: 76,
          celdas: personas.map((_, q) => cosas.map((_, i) => (pistas.some(([a, b]) => a === q && b === i) ? { marca: 'no', color: 'h' } : ''))),
          notas: [{ t: `${pistas.length} ✗ de las pistas` }] };
        return {
          enunciado: `Cada uno ${verbo} algo distinto. ${pistas.map(([q, i]) => `${personas[q]} no ${verbo} ${nom(cosas[i])}`).join('; ')}. ¿Qué ${verbo} ${personas[quien]}?`,
          dibujo: { datos: Object.assign(cuadro(personas, cosas, [], { nota: 'Sin marcas todavía' }), ancho), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden qué ${verbo} ${personas[quien]}.` },
            { tipo: 'datos', texto: `Tres personas y tres opciones, una para cada una. Hay ${pistas.length} pistas, todas dicen quién no.` },
            { tipo: 'regla', texto: 'Cada fila y cada columna lleva una sola ✓. Pongo una ✗ por pista; donde una fila o columna queda con una casilla libre, va la ✓.' },
            { tipo: 'aplica', texto: `Marco las ${pistas.length} ✗ que dicen las pistas.`, dibujo: { datos: soloX, estado: {} } },
            { tipo: 'aplica', texto: 'Cada ✓ que aparece tacha el resto de su fila y de su columna. Queda un solo reparto.',
              ecuacion: [personas.map((pp, q) => `${pp}: ${nom(cosas[sol[q]])}`).join(' · ')], dibujo: { datos: Object.assign(cuadro(personas, cosas, pistas), ancho), estado: {} } },
            { tipo: 'sentido', texto: 'Compruebo con cada pista: nadie quedó con lo que una pista le prohíbe, y nadie repite.' },
          ],
          respuesta: `${personas[quien]} ${verbo} ${nom(cosas[sol[quien]])}`,
        };
      },
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
  const NODO = Object.fromEntries(ARBOL_N.map(n => [n.id, n]));
  const FIN = { padre: 'pedro', abuelo: 'raul', tio: 'tomas', primo: 'ivan' };
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
    // Lee (fase 2): árbol, subir y bajar y los nombres de familia; no cuenta papeles (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'El árbol de una familia', texto: 'Un árbol genealógico dibuja una familia por generaciones: los abuelos arriba, los padres al medio y los nietos abajo. Cada línea une a un padre o una madre con un hijo.' },
        { titulo: 'Subir y bajar', texto: 'Ir de una persona a su padre es subir una línea. Ir a su hijo es bajar una. Para llegar a un hermano, se sube una línea y se baja otra.',
          ecuacion: ['hermano: sube 1, baja 1'] },
        { titulo: 'Tíos y primos', texto: 'El tío es el hermano de tu padre o de tu madre. El primo es el hijo de tu tío. En muchas familias de Puno, los primos crecen casi como hermanos.' },
        { titulo: 'Qué mirar al jugar', texto: 'En el juego eliges un parentesco para Ana. Sigue el camino naranja y cuenta cuántas líneas sube y cuántas baja.' },
      ],
    },
    juega: {
      consigna: 'Raúl tiene dos hijos, Pedro y Tomás. Elige un parentesco y sigue el camino desde Ana por las líneas del árbol.',
      voz: 'Subir es ir a los padres; bajar, a los hijos.',
      controles: [{ id: 'c', etiqueta: 'Para Ana', opciones: [{ valor: 'padre', texto: 'Padre' }, { valor: 'abuelo', texto: 'Abuelo' }, { valor: 'tio', texto: 'Tío' }, { valor: 'primo', texto: 'Primo' }] }],
      dibujo: val => ({ datos: arbol(val.c), estado: {} }),
      lectura: val => [`Para Ana, es ${CAMINOS[val.c].nombre}`],
      minimo: 3,
      // Lleva la manija desde el pariente marcado a otro: el camino desde Ana se redibuja hasta él.
      arrastres: [{ id: 'pariente', etiqueta: 'pariente de Ana', color: 'c-o',
        donde: val => { const n = NODO[FIN[val.c]]; return enPx(arbol(val.c), n.x + 0.55, n.y + 0.3); },
        mover: (pt, val) => ({ c: cercano(Object.entries(FIN).map(([k, id]) => [k, NODO[id].x + 0.55, NODO[id].y + 0.3]), aU(arbol(val.c), pt)) }) }],
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
      ecuacion: ['tío = hermano del padre', '   ·   ', 'primo = hijo del tío'],
      condicion: 'no se supone matrimonio, sexo ni que alguien sea hijo único si el enunciado no lo dice.',
    },
    // Así se resuelve (fase 2): las mismas relaciones (sube, baja) y la misma composición de «Ahora tú», con la semilla + 900.
    // La figura dibuja el camino: a la izquierda lo que sube, arriba el antepasado común, a la derecha lo que baja.
    resuelve: {
      pieza: 'rm-plano',
      generar(s) {
        const r = azar(s + 900);
        const REL = [['padre', 1, 0, 'm'], ['madre', 1, 0, 'f'], ['hermano', 1, 1, 'm'], ['hermana', 1, 1, 'f'], ['hijo', 0, 1, 'm'], ['hija', 0, 1, 'f'], ['abuelo', 2, 0, 'm'], ['tío', 2, 1, 'm'], ['tía', 2, 1, 'f']];
        const NOMBRE = { '1,0': ['padre', 'madre'], '2,0': ['abuelo', 'abuela'], '3,0': ['bisabuelo', 'bisabuela'], '0,1': ['hijo', 'hija'], '0,2': ['nieto', 'nieta'], '0,3': ['bisnieto', 'bisnieta'], '1,1': ['hermano', 'hermana'], '2,1': ['tío', 'tía'], '1,2': ['sobrino', 'sobrina'], '2,2': ['primo', 'prima'], '3,1': ['tío abuelo', 'tía abuela'], '1,3': ['sobrino nieto', 'sobrina nieta'] };
        let r1, r2, u, d;
        for (;;) {
          r1 = r.elegir(REL); r2 = r.elegir(REL);
          if (r1[2] > 0 && r2[1] > 0) continue;
          if (r1[2] === 0 && r2[1] === 0 && r2[2] > 0) continue;
          u = r1[1] + r2[1]; d = r1[2] + r2[2];
          if (NOMBRE[`${u},${d}`]) break;
        }
        const yo = r.elegir([['Ana', 'f'], ['Rosa', 'f'], ['Luis', 'm'], ['Iván', 'm']]);
        const de = r1[3] === 'f' ? 'de la' : 'del';
        const g2 = r2[3] === 'f' ? 1 : 0, gy = yo[1] === 'f' ? 1 : 0;
        const inversa = (s + 900) % 2 === 1;
        const nombre = inversa ? NOMBRE[`${d},${u}`][gy] : NOMBRE[`${u},${d}`][g2];
        const vuelta = inversa ? NOMBRE[`${u},${d}`][g2] : NOMBRE[`${d},${u}`][gy];
        const frase = `${r2[3] === 'f' ? 'la' : 'el'} ${r2[0]} ${de} ${r1[0]} de ${yo[0]}`;
        const otro = inversa ? 'Carmen' : undefined;
        // Camino: u0 = yo … u{u} = antepasado común; d1 … d{d} bajan desde él. El fin del primer tramo va en verde.
        const Y = lev => 0.7 + lev * 1.6;
        const nodoU = i => ({ id: 'u' + i, x: i === u ? 5 : 2.4, y: Y(u - i), lado: i === u ? 'arriba' : 'izq' });
        const nodoD = j => ({ id: 'd' + j, x: 7.6, y: Y(j), lado: 'der' });
        const medio = r1[2] === 0 ? 'u' + r1[1] : 'd' + r1[2], fin = d === 0 ? 'u' + u : 'd' + d;
        const todos = Array.from({ length: u + 1 }, (_, i) => nodoU(i)).concat(Array.from({ length: d }, (_, j) => nodoD(j + 1)));
        const aristas = Array.from({ length: u }, (_, i) => ['u' + (i + 1), 'u' + i]).concat(Array.from({ length: d }, (_, j) => [j === 0 ? 'u' + u : 'd' + j, 'd' + (j + 1)]));
        const enTramo1 = new Set(r1[2] === 0 ? aristas.slice(0, r1[1]).map(a => a.join()) : aristas.slice(0, u + r1[2]).map(a => a.join()));
        const viste = id => (id === 'u0' ? { t: yo[0][0], etiqueta: yo[0], color: 'i' } : id === fin ? { t: inversa ? 'C' : '?', etiqueta: otro, color: 'o' } : id === medio ? { t: '', etiqueta: r1[0], color: 'd' } : { t: '' });
        const camino = soloTramo1 => {
          const ids = new Set(['u0']);
          if (soloTramo1) for (const a of aristas) { if (enTramo1.has(a.join())) { ids.add(a[0]); ids.add(a[1]); } } else for (const n of todos) ids.add(n.id);
          return { datos: { ancho: 10, alto: 6.4,
            nodos: todos.filter(n => ids.has(n.id)).map(n => Object.assign(n, viste(n.id))),
            aristas: aristas.filter(a => ids.has(a[0]) && ids.has(a[1])).map(([x, y]) => ({ de: x, a: y, color: 'o', grosor: 'variable' })),
            pie: soloTramo1 ? `Primer tramo: ${r1[0]} de ${yo[0]}` : `Sube ${u} · baja ${d}` }, estado: {} };
        };
        const may = w => w[0].toUpperCase() + w.slice(1);
        const pasos = [
          { tipo: 'pide', texto: inversa ? `Carmen es ${frase}. Piden qué es ${yo[0]} para Carmen.` : `Piden qué es para ${yo[0]} ${frase}.` },
          { tipo: 'datos', texto: `La frase tiene dos tramos: primero «${r1[0]} de ${yo[0]}», y después «${r2[0]}» de esa persona.`, dibujo: camino(true) },
          { tipo: 'regla', texto: 'Cada parentesco es un camino en el árbol: subo una línea por cada padre o madre, y bajo una por cada hijo o hija.' },
          { tipo: 'cuentas', texto: `${may(r1[0])}: sube ${r1[1]}, baja ${r1[2]}. ${may(r2[0])}: sube ${r2[1]}, baja ${r2[2]}. Sumo los dos tramos.`,
            ecuacion: [`sube ${r1[1]} + ${r2[1]} = ${u}   ·   baja ${r1[2]} + ${r2[2]} = ${d}`], dibujo: camino(false) },
        ];
        if (inversa) pasos.push({ tipo: 'aplica', texto: `Desde Carmen, el camino se recorre al revés: sube ${d} y baja ${u}. Eso es ${nombre}.` });
        pasos.push({ tipo: 'sentido', texto: inversa ? `Compruebo al derecho: desde ${yo[0]}, sube ${u} y baja ${d}, y eso es ${vuelta}. Cuadra con la frase.` : `Compruebo al revés: desde esa persona se sube ${d} y se baja ${u}, y ${yo[0]} es su ${vuelta}. Cuadra.` });
        return {
          enunciado: inversa ? `Si Carmen es ${frase}, ¿qué es ${yo[0]} de Carmen?` : `¿Qué es de ${yo[0]} ${frase}?`,
          dibujo: { datos: { ancho: 10, alto: 6.4, nodos: [Object.assign(nodoU(0), viste('u0'))], pie: `Se parte de ${yo[0]}` }, estado: {} },
          pasos,
          respuesta: inversa ? `${yo[0]} es ${nombre} de Carmen` : `Es ${nombre} de ${yo[0]}`,
        };
      },
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

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1: C se mueve y crece libre (no solo tres lugares): se ve cuándo cumple «algunos B son C» y si toca a A.
  const cLibre = val => ({ x: val.cx, y: 3, r: val.cr });
  const vennLibre = val => venn(cLibre(val), { pie: tocan(VB, cLibre(val)) ? 'Cumple: algún B es C' : 'No cumple: C no toca a B', cDisc: !tocan(VB, cLibre(val)) });
  const mesaVenn = {
    id: 'venn-libre', titulo: 'C donde quieras', pieza: 'rm-plano',
    consigna: 'Todos los A son B. Mueve y agranda C. Busca dibujos que cumplan «algunos B son C» con A dentro y fuera.',
    controles: [
      { id: 'cx', etiqueta: 'Centro de C', min: 1, max: 8, paso: 0.1, inicio: 7.2, decimales: 1, color: 'c-d' },
      { id: 'cr', etiqueta: 'Radio de C', min: 0.5, max: 2, paso: 0.1, inicio: 1.5, decimales: 1, color: 'c-d' },
    ],
    dibujo: val => ({ datos: vennLibre(val), estado: {} }),
    lectura: val => !tocan(VB, cLibre(val)) ? ['C fuera de B: no vale como dibujo'] : ['Dibujo válido: algún ', A, tocan(VA, cLibre(val)) ? ' es ' : ' no es ', C],
    // Retos: cada logrado usa tocan(), la misma prueba que decide el pie y la línea punteada del dibujo.
    invitaciones: [
      { texto: 'Haz un dibujo que cumpla las premisas y donde algún A también sea C.',
        logrado: val => tocan(VB, cLibre(val)) && tocan(VA, cLibre(val)),
        bien: 'Este dibujo dice «sí». Falta ver si todos los dibujos dicen lo mismo.' },
      { texto: 'Pon C del lado izquierdo de A, cumpliendo las premisas y sin tocar a A.',
        logrado: val => val.cx < VA.x && tocan(VB, cLibre(val)) && !tocan(VA, cLibre(val)),
        bien: 'C puede tocar a B por cualquier lado. Las premisas no lo amarran a A.' },
      { texto: 'Mueve C a la derecha hasta el último lugar en que todavía toca a B.',
        // Un paso más (0,1) a la derecha y C ya no tocaría a B.
        logrado: val => tocan(VB, cLibre(val)) && !tocan(VB, cLibre({ cx: Math.round(val.cx * 10 + 1) / 10, cr: val.cr })),
        bien: 'Ese es el borde: un paso más y «algunos B son C» ya no se cumple.' },
      { texto: 'Guarda dos dibujos que cumplan las premisas: en uno algún A es C; en otro, ninguno.',
        logrado: (val, guardados) => guardados.some(g => tocan(VB, cLibre(g)) && tocan(VA, cLibre(g)))
          && guardados.some(g => tocan(VB, cLibre(g)) && !tocan(VA, cLibre(g))),
        bien: 'Los dos cumplen las premisas y dicen lo contrario: no hay conclusión sobre A y C.' },
    ],
    arrastres: [
      { id: 'centro-c', etiqueta: 'centro del círculo C', color: 'c-d',
        donde: val => enPx(vennLibre(val), val.cx, 3), mover: (pt, val) => ({ cx: aU(vennLibre(val), pt).x }) },
      { id: 'borde-c', etiqueta: 'tamaño del círculo C', color: 'c-d',
        donde: val => enPx(vennLibre(val), val.cx, 3 + val.cr), mover: (pt, val) => ({ cr: aU(vennLibre(val), pt).y - 3 }) },
    ],
  };
  // Mesa 2: las cuatro pistas del reparto, cada una prendida o apagada: el orden no importa, importa cuáles.
  const SINO = [{ valor: 1, texto: 'Sí' }, { valor: 0, texto: 'No' }];
  const activas = val => PISTAS.filter((_, k) => val['p' + k]);
  // Casillas ✓ (iguales en todos los repartos que quedan) y el grupo más chico de pistas que deja un solo reparto.
  const seguras = pistas => { const v = compatibles(pistas); let n = 0; for (let q = 0; q < 3; q++) for (let i = 0; i < 3; i++) if (v.length && v.every(p => p[q] === i)) n++; return n; };
  const MIN_PISTAS = Math.min(...Array.from({ length: 1 << PISTAS.length }, (_, m) => PISTAS.filter((_, k) => (m >> k) & 1))
    .filter(ps => compatibles(ps).length === 1).map(ps => ps.length));
  const mesaCuadro = {
    id: 'pistas-a-eleccion', titulo: 'Pistas a elección', pieza: 'rm-tablero',
    consigna: 'Prende y apaga cada pista. Busca el grupo más chico de pistas que deja un solo reparto.',
    controles: TXT.map((t, k) => ({ id: 'p' + k, etiqueta: t, opciones: SINO, inicio: k < 3 ? 1 : 0 })),
    dibujo: val => ({ datos: cuadro(P3, D3, activas(val)), estado: {} }),
    lectura: val => { const n = compatibles(activas(val)).length, k = activas(val).length; return [`${k} ${k === 1 ? 'pista' : 'pistas'}: ${n} ${n === 1 ? 'reparto posible' : 'repartos posibles'}`]; },
    // Retos: cuentan con compatibles(), lo mismo que pone las ✗ y las ✓ del cuadro.
    invitaciones: [
      { texto: 'Prende y apaga pistas hasta que quede un solo reparto posible.',
        logrado: val => compatibles(activas(val)).length === 1,
        bien: 'Un solo reparto: cada fila y cada columna quedó con su ✓.' },
      { texto: 'Deja un solo reparto con el menor número de pistas. ¿Cuál sobraba?',
        logrado: val => compatibles(activas(val)).length === 1 && activas(val).length === MIN_PISTAS,
        bien: 'Una pista no aportaba nada: lo que tachaba ya lo tachaban las otras.' },
      { texto: 'Consigue una ✓ segura aunque todavía quede más de un reparto.',
        logrado: val => compatibles(activas(val)).length > 1 && seguras(activas(val)) > 0,
        bien: 'Esa casilla coincide en todos los repartos que quedan: es seguro sin saberlo todo.' },
      { texto: 'Apaga todas las pistas y cuenta cuántos repartos son posibles sin datos.',
        logrado: val => activas(val).length === 0,
        bien: `Sin pistas quedan los ${PERMS.length} repartos. Cada pista va tachando algunos.` },
      { texto: 'Guarda dos grupos de pistas distintos que dejen un solo reparto.',
        logrado: (val, guardados) => new Set(guardados.filter(g => compatibles(activas(g)).length === 1).map(g => activas(g).join('|'))).size >= 2,
        bien: 'Dos caminos distintos llegan al mismo reparto. ¿Cuál usa menos pistas?' },
    ],
  };
  // Mesa 3: el parentesco entre dos personas cualesquiera del árbol, con el camino que sube y baja.
  const PADRE = { pedro: 'raul', tomas: 'raul', ana: 'pedro', luis: 'pedro', ivan: 'tomas' };
  const subir = id => { const xs = [id]; while (PADRE[xs[xs.length - 1]]) xs.push(PADRE[xs[xs.length - 1]]); return xs; };
  function camino(de, a) {
    const sa = subir(de), sb = subir(a), comun = sa.find(x => sb.includes(x));
    const u = sa.indexOf(comun), d = sb.indexOf(comun);
    const arriba = sa.slice(0, u + 1), abajo = sb.slice(0, d).reverse();
    const nodos = arriba.concat(abajo), pasos = nodos.slice(1).map((n, k) => [nodos[k], n]);
    return { u, d, pasos };
  }
  const NOMBRES = { '1,0': ['padre', 'madre'], '2,0': ['abuelo', 'abuela'], '0,1': ['hijo', 'hija'], '0,2': ['nieto', 'nieta'], '1,1': ['hermano', 'hermana'], '2,1': ['tío', 'tía'], '1,2': ['sobrino', 'sobrina'], '2,2': ['primo', 'prima'] };
  const PERSONAS = ARBOL_N.map(n => ({ valor: n.id, texto: n.etiqueta }));
  const largo = (de, a) => { const c = camino(de, a); return c.u + c.d; };
  const arbolPar = val => {
    const c = camino(val.de, val.a), on = new Set(c.pasos.map(p => [...p].sort().join('-')));
    return {
      ancho: 10, alto: 6.4,
      nodos: ARBOL_N.map(n => Object.assign({}, n, n.id === val.de ? { color: 'i' } : n.id === val.a ? { color: 'o' } : {})),
      aristas: ARBOL_A.map(([x, y]) => { const e = on.has([x, y].sort().join('-')); return { de: x, a: y, color: e ? 'o' : undefined, grosor: e ? 'variable' : 'contorno' }; }),
    };
  };
  const mesaFamilia = {
    id: 'cualquier-pariente', titulo: 'Dos personas cualesquiera', pieza: 'rm-plano',
    consigna: 'Arrastra los dos círculos a dos personas del árbol. El camino dice el parentesco: cuántas líneas sube y cuántas baja.',
    controles: [{ id: 'de', etiqueta: 'Para', opciones: PERSONAS, inicio: 'ivan' }, { id: 'a', etiqueta: 'Es su', opciones: PERSONAS, inicio: 'ana' }],
    dibujo: val => ({ datos: arbolPar(val), estado: {} }),
    lectura: val => {
      if (val.de === val.a) return ['Es la misma persona'];
      const c = camino(val.de, val.a), nom = NOMBRES[`${c.u},${c.d}`][val.a === 'ana' ? 1 : 0];
      return [`Para ${NODO[val.de].etiqueta}, ${NODO[val.a].etiqueta} es su ${nom}: sube ${c.u}, baja ${c.d}`];
    },
    // Retos: todos leen camino(), el mismo que pinta las líneas del árbol.
    invitaciones: [
      { texto: 'Busca a la persona que es tío de Ana.',
        logrado: val => val.de === 'ana' && val.a !== 'ana' && camino('ana', val.a).u === 2 && camino('ana', val.a).d === 1,
        bien: 'Tomás: sube dos líneas hasta Raúl y baja una. ¿Quién es sobrino de Tomás?' },
      { texto: 'Busca el pariente más lejano de Luis: el camino con más líneas.',
        logrado: val => val.de === 'luis' && val.a !== 'luis' && largo('luis', val.a) === Math.max(...ARBOL_N.map(n => largo('luis', n.id))),
        bien: 'Su primo Iván: sube dos y baja dos. Ningún camino desde Luis es más largo.' },
      { texto: 'Guarda dos casos donde la misma persona sea padre de alguien y también hijo.',
        logrado: (val, guardados) => guardados.some(x => { const c = camino(x.de, x.a); return c.u === 1 && c.d === 0
          && guardados.some(y => { const e = camino(y.de, y.a); return y.a === x.a && e.u === 0 && e.d === 1; }); }),
        bien: 'Una persona, dos papeles. Por eso dos padres y dos hijos pueden ser tres.' },
      { texto: 'Guarda un par y después el mismo par al revés, con otro nombre de parentesco.',
        logrado: (val, guardados) => guardados.some(x => x.de !== x.a && camino(x.de, x.a).u !== camino(x.de, x.a).d
          && guardados.some(y => y.de === x.a && y.a === x.de)),
        bien: 'Al voltear el par, lo que subía ahora baja: tío se vuelve sobrino.' },
    ],
    arrastres: [
      { id: 'desde', etiqueta: 'persona desde la que se mira', color: 'c-i',
        donde: val => enPx(arbolPar(val), NODO[val.de].x - 0.55, NODO[val.de].y + 0.3),
        mover: (pt, val) => ({ de: cercano(ARBOL_N.map(n => [n.id, n.x - 0.55, n.y + 0.3]), aU(arbolPar(val), pt)) }) },
      { id: 'hasta', etiqueta: 'pariente que se busca', color: 'c-o',
        donde: val => enPx(arbolPar(val), NODO[val.a].x + 0.55, NODO[val.a].y + 0.3),
        mover: (pt, val) => ({ a: cercano(ARBOL_N.map(n => [n.id, n.x + 0.55, n.y + 0.3]), aU(arbolPar(val), pt)) }) },
    ],
  };

  return {
    unidad: 'razonamiento-matematico.razonamiento-deductivo',
    // Laboratorio: C libre en el Venn, las cuatro pistas a elección y el parentesco entre dos personas cualesquiera.
    laboratorio: [mesaVenn, mesaFamilia, mesaCuadro],
    version: '0.2.0',
    estado: 'completa',
    // Glosario (docs/teoria.md, 4d): las palabras que esta unidad estrena en el curso.
    glosario: [
      { termino: 'premisa', def: 'Dato o afirmación que se acepta como punto de partida para razonar.',
        ejemplo: '«Todos los A son B» y «algunos B son C» son dos premisas.', ver: ['conclusión'] },
      { termino: 'conclusión', def: 'Lo que se afirma a partir de los datos. Es segura solo si vale en todos los casos posibles.',
        ejemplo: 'De «todo A es B» y «todo B es C» sale: todo A es C.', ver: ['premisa', 'certeza'] },
      { termino: 'algunos', def: 'En lógica: al menos uno, y quizás todos. No dice cuáles ni cuántos.',
        formas: ['algunos', 'algunas', 'algún'], ejemplo: '«Algunos B son C» se cumple aunque un solo B sea C.' },
      { termino: 'diagrama de Venn', def: 'Dibujo con un círculo por grupo: muestra qué grupos están dentro de otros, se cruzan o se separan.',
        formas: ['diagrama de Venn', 'diagramas de Venn'], ejemplo: '«Todos los A son B»: el círculo A queda dentro del círculo B.' },
      { termino: 'compatible', def: 'Que cumple a la vez todas las premisas o pistas. Puede haber varios casos así.', ver: ['premisa'] },
      { termino: 'certeza', def: 'Seguridad total: algo vale en todos los casos que permiten los datos, sin excepción.', ver: ['compatible'] },
      { termino: 'válido', def: 'Dicho de un razonamiento: si sus premisas son verdaderas, lo que concluye no puede ser falso.',
        formas: ['válido', 'válida', 'válidos', 'válidas'], ver: ['premisa', 'conclusión'] },
      { termino: 'condicional', def: 'Frase «si p, entonces q»: asegura que siempre que pasa p, también pasa q.',
        ejemplo: '«Si llueve, la pista se moja»: con lluvia, la pista no puede quedar seca.', ver: ['forma directa', 'forma indirecta'] },
      { termino: 'forma directa', def: 'Razonar desde «si p, entonces q» y «pasa p» hasta «pasa q».',
        ejemplo: 'Si llueve, se moja. Llueve. Entonces está mojada.', ver: ['condicional', 'forma indirecta'] },
      { termino: 'forma indirecta', def: 'Razonar desde «si p, entonces q» y «no pasa q» hasta «no pasa p».',
        ejemplo: 'Si llueve, se moja. Está seca. Entonces no llovió.', ver: ['condicional', 'forma directa'] },
      { termino: 'cuadro de doble entrada', def: 'Tabla con un grupo en las filas y otro en las columnas, para marcar qué va con qué.',
        formas: ['cuadro de doble entrada', 'cuadro'], ejemplo: 'Personas en filas y deportes en columnas: ✗ si no puede ser, ✓ si es seguro.' },
      { termino: 'reparto', formas: ['reparto', 'repartos'], def: 'Forma de asignar a cada persona una sola cosa distinta, sin que dos personas compartan la misma.',
        ejemplo: 'Ana fútbol, Beto ajedrez y Ciro vóley es un reparto de tres deportes.', ver: ['cuadro de doble entrada'] },
      { termino: 'parentesco', def: 'Relación de familia entre dos personas, como padre, tío o primo.',
        formas: ['parentesco', 'parentescos'], ejemplo: 'El hijo de tu tío es tu primo.', ver: ['árbol genealógico'] },
      { termino: 'árbol genealógico', def: 'Dibujo de una familia: cada línea une a un padre o una madre con un hijo o una hija.',
        formas: ['árbol genealógico', 'árbol', 'árboles'], ejemplo: 'De Ana a su primo Iván: el camino sube 2 líneas y baja 2.', ver: ['parentesco'] },
      { termino: 'radio', def: 'Distancia del centro de un círculo a su borde. Es la mitad del diámetro.',
        formas: ['radio', 'radios'], ver: ['diámetro'] },
    ],
    requiere: ['/nucleo/kit/piezas/rm-plano.js', '/nucleo/kit/piezas/rm-tablero.js'],
    historia: {
      texto: 'En el siglo IV a. C., Aristóteles estudió qué conclusiones se siguen necesariamente de unas premisas. Separó dos cosas: que las premisas sean verdaderas y que el paso hacia la conclusión sea válido. Los acertijos de familias y repartos de hoy son otra aplicación de esa misma pregunta.',
      pregunta: '¿Cuándo una conclusión no puede fallar?',
      fuente: { titulo: 'Aristotle’s Logic · Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/entries/aristotle-logic/' },
    },
    ideas: [ideaVenn, ideaSi, ideaCuadro, ideaFamilia],
  };
});
