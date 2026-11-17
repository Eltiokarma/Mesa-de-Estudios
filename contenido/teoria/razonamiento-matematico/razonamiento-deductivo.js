/*
 * Teoría de «Razonamiento deductivo y parentesco» (razonamiento-matematico.razonamiento-deductivo). Molde: docs/teoria.md
 * y docs/molde-unidad.md. Etapa 3 del plan de calidad (docs/plan-calidad.md §7), fase 2 del método: se rehace idea por
 * idea con lo aprobado por Gerson (docs/etapa3/propuesta-razonamiento-matematico.md; manda docs/etapa3/decisiones.md).
 * Orden aprobado (17 nov): 1. doble-entrada «El cuadro que descarta» (rehecha, 17 nov) · 2. dos-atributos (nueva, por
 * escribir) · 3. conclusion-necesaria · 4. si-entonces · 5. parentesco. Las ideas 3 a 5 siguen como en la v0.2.0
 * (pendientes de rehacer: sus colores, símbolos y códigos RMT-DED-* todavía son los viejos); los ids no cambian.
 * Público: 5.º de secundaria y preuniversitario. La unidad no declara calidad: 2 hasta que todas las ideas pasen el
 * contrato (el validador exigiría misión, leyenda y datos también en las ideas viejas).
 *
 * Paleta de deducción (decisión de Gerson, 17 nov; el equivalente de molde §5b en un curso sin magnitudes): un papel fijo
 * por color en toda la unidad, en la teoría, los ejemplos, la escena y la práctica.
 *   o naranja ... lo primero: el primer dato o grupo (A en los aros, p en el condicional, quien habla en el árbol)
 *   i turquesa .. lo segundo: el segundo dato o grupo (C en los aros, q en el condicional)
 *   tinta ....... lo que amarra: personas, cosas, filas, columnas, pistas, el grupo del medio, las líneas del árbol
 *   f violeta ... lo seguro y lo pedido: la ✓, la conclusión necesaria, la respuesta (antes de comprobar, en tinta o «?»)
 *   gris ........ lo descartado: la ✗ y el reparto tachado (tinta al 55 %, con su forma: no depende del color)
 *   sin verde ni carmín (naranja–verde y rojo–verde no se distinguen con protanopía y deuteranopía; el carmín es de los
 *   ángulos). La idea 1 usa tinta, violeta y gris; la pieza rm-objeto fija esos papeles (rm-objeto.PAPELES) y
 *   razonamiento-deductivo.test.js falla si un papel cambia de color en cualquier figura o texto de la idea.
 * Letras y símbolos: ✓ seguro, ✗ imposible; «reparto» es una manera de cumplir todos los datos. Las personas nunca se
 * abrevian por su inicial (A, B y C quedan para los grupos de la idea de los aros). La letra de una alternativa que
 * nombra un resuelto va en negrita y en violeta solo si es la respuesta; las descartadas se nombran por su texto.
 * Errores: códigos RMP de docs/investigacion/codigos-rm-procesos.md, todos hipótesis (no hay datos de alumnos): RMP63
 * ignorar una pista, RMP72 quedarse con un reparto que choca con una pista, RMP77 elegir lo posible y no lo necesario,
 * RMP78 creer que no se deduce nada.
 * Historia: Aristóteles (SEP). Compañero: Faro (zorro).
 *
 * Ficha de tarea (diseno-y-animacion), idea 1:
 *   Promesa: saber cuándo una casilla del cuadro ya es segura, aunque no se sepa todo.
 *   Persona y condiciones: postulante de 5.º o preuniversitario, celular de gama baja, sin conexión en el aula.
 *   Resultado observable: dice qué es seguro con unas pistas y por qué (vale en todos los repartos que quedan).
 *   Orden de atención: 1.º el campeonato y el cuadro · 2.º los repartos que se tachan · acción: − y + de las pistas.
 *   Estados: sin pistas · repartos tachados · primera ✓ · reparto único · predicción · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «¿tengo que saberlo todo para poner una ✓?».
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

  // ---------- Idea 1: el cuadro que descarta (etapa 3, 17 nov; docs/etapa3/propuesta-razonamiento-matematico.md) ----------
  // Objeto de la primera pantalla: tres amigos inscritos en el campeonato del aniversario del colegio (rm-objeto, escena
  // «campeonato», dibujo de prueba). Cambia: cuántas pistas se usan. · Permanece: los 6 repartos, alineados con las filas
  // del cuadro. · Progresa: los repartos tachados. · Se reserva: una ✓ que sale por columna (la predicción; el juego la da
  // por fila). · Debe verse: la ✓ aparece antes de saberlo todo, cuando todos los repartos que quedan coinciden.
  // Todo lo que se ve sale de contar repartos (perms, cumple, marcasDe): ningún ✓ ni ✗ se escribe a mano (regla 1).
  const OB = 'rm-objeto';
  const perms = k => {
    const out = [], ir = (pre, resto) => { if (!resto.length) { out.push(pre); return; } resto.forEach((x, i) => ir(pre.concat(x), resto.slice(0, i).concat(resto.slice(i + 1)))); };
    ir([], Array.from({ length: k }, (_, i) => i));
    return out;
  };
  const PERM3 = perms(3);
  // Una pista prohíbe una casilla ({ q, c }: q no hace c) o la obliga ({ q, c, si: true }: q hace c).
  const cumple = (p, ps) => ps.every(x => (x.si ? p[x.q] === x.c : p[x.q] !== x.c));
  const quedanR = (k, ps) => perms(k).filter(p => cumple(p, ps));
  // ✓ si la casilla vale en todos los repartos que quedan; ✗ si en ninguno (la regla de la idea, contada).
  function marcasDe(k, ps) {
    const v = quedanR(k, ps), m = {};
    if (!v.length) return m;
    for (let q = 0; q < k; q++) for (let c = 0; c < k; c++) {
      const n = v.filter(p => p[q] === c).length;
      if (n === 0) m[`${q},${c}`] = 'no'; else if (n === v.length) m[`${q},${c}`] = 'si';
    }
    return m;
  }
  const segurosDe = (k, ps) => Object.entries(marcasDe(k, ps)).filter(([, x]) => x === 'si').map(([key]) => key.split(',').map(Number));
  const F = t => ({ v: 'c-f', t });   // lo seguro y lo pedido, en violeta (paleta de deducción)
  const lista = (xs, y = 'y') => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} ${y} ${xs[xs.length - 1]}` : xs.join(''));
  const P3 = ['Ana', 'Beto', 'Ciro'], D3 = ['fútbol', 'vóley', 'ajedrez'], I3 = ['futbol', 'voley', 'ajedrez'];
  const R3 = 'Cada uno juega un solo deporte, y ningún deporte se repite.';
  const pista = (q, c, si) => ({ q, c, si, t: `${P3[q]}${si ? '' : ' no'} juega ${D3[c]}.` });
  // La figura del campeonato: la escena, el cuadro, los 6 repartos y las pistas. o.sinMarcas: el planteamiento (Predice).
  function campeonato(ps, o = {}) {
    const marcas = o.sinMarcas ? {} : marcasDe(3, ps);
    const ult = ps[ps.length - 1];
    if (o.nueva && ult && !ult.si && marcas[`${ult.q},${ult.c}`]) marcas[`${ult.q},${ult.c}`] = { m: 'no', nueva: true };
    return { escena: 'campeonato', filas: P3, columnas: D3, iconos: I3, marcas,
      repartos: PERM3.map(a => (o.sinMarcas || cumple(a, ps) ? { a } : { a, fuera: true })),
      pistas: ps.map((p, k) => ({ t: p.t, nueva: !!o.nueva && k === ps.length - 1 })), lineas: 3,
      manos: o.sinMarcas ? [] : segurosDe(3, ps).map(([f, c]) => ({ f, c })) };
  }
  // El juego: tres pistas, en este orden (propuesta aprobada, §3). La misión es encontrar con cuántas sale la primera ✓.
  const PJ = [pista(0, 1), pista(0, 2), pista(2, 1)];
  const PRIMERA = Array.from({ length: PJ.length + 1 }, (_, k) => k).find(k => segurosDe(3, PJ.slice(0, k)).length > 0);
  const quedanJ = n => quedanR(3, PJ.slice(0, n)).length;
  const segJ = segurosDe(3, PJ.slice(0, PRIMERA))[0];
  // La predicción: otras dos pistas; la ✓ sale por la columna del ajedrez (el juego la mostró por fila).
  const PP = [pista(0, 2), pista(1, 2)];
  const QP = quedanR(3, PP), SP = segurosDe(3, PP)[0];
  const quienJuega = (ps, c) => P3[segurosDe(3, ps).find(([, x]) => x === c)[0]];
  // Un caso posible pero no seguro de la predicción (RMP77): vale en un reparto de los que quedan y no en el otro.
  const POSIBLE_P = (() => { for (let q = 0; q < 3; q++) for (let c = 0; c < 3; c++) { const n = QP.filter(p => p[q] === c).length; if (n > 0 && n < QP.length) return [q, c]; } return null; })();
  const otroDe = (q, c) => QP.find(p => p[q] !== c)[q];
  // Mira: las marcas de la predicción, paso a paso (corte 1: las ✗ de las pistas; 2: repartos tachados; 3: la ✓;
  // 4: lo que esa ✓ tacha). Todo sale de marcasDe y cumple.
  const MIRA_P = (() => {
    const d = campeonato(PP), directas = new Set(PP.map(p => `${p.q},${p.c}`));
    d.marcas = Object.fromEntries(Object.entries(marcasDe(3, PP)).map(([k, x]) => [k, { m: x, desde: x === 'si' ? 3 : directas.has(k) ? 1 : 4 }]));
    d.repartos = PERM3.map(a => (cumple(a, PP) ? { a } : { a, fuera: 2 }));
    d.manos = segurosDe(3, PP).map(([f, c]) => ({ f, c, desde: 3 }));
    return d;
  })();

  // ---------- Contextos de «Así se resuelve» y «Ahora tú» (situaciones del colegio; los nombres no se abrevian) ----------
  // Cabeceras de 8 letras o menos: en un cuadro de 4 columnas caben a 14 px (prueba de la pieza).
  const CTX = [
    { cosas: ['fútbol', 'vóley', 'ajedrez', 'básquet'], hace: 'juega', ni: 'ni', que: p => `¿Qué juega ${p}?`, todo: '¿Quién juega qué?', intro: 'se inscribieron en el campeonato del colegio, cada uno en un deporte',
      regla: 'Cada uno juega un solo deporte, y ningún deporte se repite.' },
    { cosas: ['danza', 'teatro', 'dibujo', 'banda'], hace: 'está en', ni: 'ni en', que: p => `¿En qué taller está ${p}?`, todo: '¿Quién está en qué taller?', intro: 'están cada uno en un taller distinto del colegio',
      regla: 'Cada uno está en un solo taller, y ningún taller se repite.' },
    { cosas: ['tamales', 'jugos', 'choclo', 'queso'], hace: 'vende', ni: 'ni', que: p => `¿Qué vende ${p}?`, todo: '¿Quién vende qué?', intro: 'venden cada uno algo distinto en la kermés del aniversario',
      regla: 'Cada uno vende una sola cosa, y ninguna se repite.' },
    { cosas: ['adornos', 'música', 'juegos', 'limpieza'], hace: 'está en', ni: 'ni en', que: p => `¿En qué comisión está ${p}?`, todo: '¿Quién está en qué comisión?', intro: 'están cada uno en una comisión distinta del aniversario',
      regla: 'Cada uno está en una sola comisión, y ninguna se repite.' },
  ];
  const GENTE = ['Ana', 'Beto', 'Ciro', 'Dina', 'Eva', 'Fito', 'Gaby', 'Hugo'];
  const REL = ['conversa con', 'almuerza con', 'estudia con', 'viaja con'];
  const D_DOS = 'Si una pista nombra a dos personas, son personas distintas.';
  // Las líneas de pista posibles. Cada una dice qué casillas prohíbe u obliga (items) y cómo se lee (t).
  function lineaPista(r, ctx, ps, sol, tipo) {
    const k = ps.length, fal = [];
    for (let q = 0; q < k; q++) for (let c = 0; c < k; c++) if (sol[q] !== c) fal.push([q, c]);
    const [q, c] = r.elegir(fal), co = ctx.cosas;
    if (tipo === 'si') { const q2 = r.ent(0, k - 1); return { items: [{ q: q2, c: sol[q2], si: true }], t: `${ps[q2]} ${ctx.hace} ${co[sol[q2]]}.` }; }
    if (tipo === 'rel') return { items: [{ q, c }], t: `${ps[q]} ${r.elegir(REL)} quien ${ctx.hace} ${co[c]}.`, rel: true };
    if (tipo === 'dos') {
      // Dos ✗ en la misma fila («X no hace a ni b») o en la misma columna («Quien hace c … con X y con Y»).
      const misma = fal.filter(([a, b]) => a === q && b !== c), col = fal.filter(([a, b]) => b === c && a !== q);
      if (r() < 0.5 && misma.length) { const [, c2] = r.elegir(misma); return { items: [{ q, c }, { q, c: c2 }], t: `${ps[q]} no ${ctx.hace} ${co[c]} ${ctx.ni} ${co[c2]}.` }; }
      if (col.length) { const [q2] = r.elegir(col); return { items: [{ q, c }, { q: q2, c }], t: `Quien ${ctx.hace} ${co[c]} ${r.elegir(REL)} ${ps[q]} y con ${ps[q2]}.`, rel: true }; }
    }
    return { items: [{ q, c }], t: `${ps[q]} no ${ctx.hace} ${co[c]}.` };
  }
  const itemsDe = lineas => lineas.flatMap(l => l.items);
  // Resolver como se enseña: una fila o una columna con una sola casilla libre lleva la ✓, y la ✓ tacha su fila y su
  // columna. Devuelve las ✓ en el orden en que salen (con por qué: 'fila' o 'columna') y si llegó al reparto completo.
  function propagar(k, items) {
    const no = new Set(), si = new Map(), orden = [];
    const poner = (q, c, por) => { if (si.has(q)) return; si.set(q, c); orden.push({ q, c, por }); for (let x = 0; x < k; x++) { if (x !== c) no.add(`${q},${x}`); if (x !== q) no.add(`${x},${c}`); } };
    for (const it of items) if (!it.si) no.add(`${it.q},${it.c}`);
    for (const it of items) if (it.si) poner(it.q, it.c, 'pista');
    for (let vuelta = 0; vuelta < 3 * k; vuelta++) {
      let cambio = false;
      for (let q = 0; q < k; q++) { if (si.has(q)) continue; const libres = [...Array(k).keys()].filter(c => !no.has(`${q},${c}`)); if (libres.length === 1) { poner(q, libres[0], 'fila'); cambio = true; } }
      for (let c = 0; c < k; c++) { if ([...si.values()].includes(c)) continue; const libres = [...Array(k).keys()].filter(q => !no.has(`${q},${c}`)); if (libres.length === 1) { poner(libres[0], c, 'columna'); cambio = true; } }
      if (!cambio) break;
    }
    return { orden, completo: si.size === k };
  }
  // Arma un caso: personas, contexto, pistas (líneas), los repartos que quedan. o.quedan: 1 (reparto único que se
  // resuelve con filas y columnas) o 2; o.tipos: qué líneas se usan; o.max: tope de líneas (los datos llevan 6 o menos).
  function armar(r, o) {
    const k = o.k, ctx = o.ctx || r.elegir(CTX), ps = r.barajar(GENTE).slice(0, k);
    for (let intento = 0; intento < 400; intento++) {
      const sol = r.elegir(perms(k));
      let lineas = [];
      for (let j = 0; j < 12 && quedanR(k, itemsDe(lineas)).length > o.quedan; j++) lineas.push(lineaPista(r, ctx, ps, sol, r.elegir(o.tipos)));
      if (quedanR(k, itemsDe(lineas)).length !== o.quedan) continue;
      // Sin líneas que sobren: se quita cada una que no cambia lo que queda.
      for (let i = lineas.length - 1; i >= 0; i--) { const sin = lineas.slice(0, i).concat(lineas.slice(i + 1)); if (quedanR(k, itemsDe(sin)).length === o.quedan) lineas = sin; }
      if (lineas.length > o.max || lineas.length < 2) continue;
      if (o.quedan === 1 && !propagar(k, itemsDe(lineas)).completo) continue;
      if (o.conRel && !lineas.some(l => l.rel)) continue;
      if (o.conSi && !lineas.some(l => l.items.some(x => x.si))) continue;
      const q = quedanR(k, itemsDe(lineas));
      if (o.quedan === 2 && !segurosDe(k, itemsDe(lineas)).length) continue;
      return { k, ctx, ps, sol: q[0], lineas, items: itemsDe(lineas), quedan: q };
    }
    return null;
  }
  // Caso de respaldo (si el azar no arma uno): el de la predicción, con su contexto.
  const RESPALDO = { k: 3, ctx: CTX[0], ps: P3, lineas: [{ items: [{ q: 0, c: 2 }], t: 'Ana no juega ajedrez.' }, { items: [{ q: 1, c: 2 }], t: 'Beto no juega ajedrez.' }, { items: [{ q: 0, c: 1 }], t: 'Ana no juega vóley.' }] };
  function caso(r, o) {
    const c = armar(r, o) || Object.assign({}, RESPALDO, { items: itemsDe(RESPALDO.lineas) });
    c.quedan = quedanR(c.k, c.items); c.sol = c.quedan[0];
    return c;
  }
  const datosDe = c => [c.ctx.regla, ...(c.lineas.some(l => l.rel) ? [D_DOS] : []), ...c.lineas.map((l, i) => `Pista ${i + 1}: ${l.t}`)];
  const introDe = c => `${lista(c.ps)} ${c.ctx.intro}: ${lista(c.ctx.cosas.slice(0, c.k), 'o')}.`;
  const figCuadro = (c, marcas) => ({ datos: { filas: c.ps, columnas: c.ctx.cosas.slice(0, c.k), marcas: marcas || {} }, estado: {} });
  const hace = (c, q, x) => `${c.ps[q]} ${c.ctx.hace} ${c.ctx.cosas[x]}`;
  // Por qué no vale una casilla (q, x) que ningún reparto permite: la primera pista sin la cual sí cabría.
  function sinLaPista(c, q, x) {
    for (let i = 0; i < c.lineas.length; i++) {
      const otras = c.lineas.filter((_, j) => j !== i);
      if (quedanR(c.k, itemsDe(otras)).some(p => p[q] === x)) return i;
    }
    return -1;
  }
  function porQueNo(c, q, x) {
    const i = sinLaPista(c, q, x);
    return i >= 0 ? { error: 'RMP72', siFuera: `Valdría sin la pista ${i + 1}. Con todas, en ningún reparto ${hace(c, q, x)}.` }
      : { error: 'RMP63', siFuera: `Tendrías que saltarte dos pistas: con todas, en ningún reparto ${hace(c, q, x)}.` };
  }

  const ideaCuadro = {
    id: 'doble-entrada',
    titulo: 'El cuadro que descarta',
    pregunta: '¿Cuándo es segura una casilla del cuadro?',
    temas: ['Cuadros de doble entrada'],
    pieza: OB,
    aprendizaje: 'Una ✓ es segura cuando vale en todos los repartos que quedan; cada ✓ tacha el resto de su fila y de su columna.',
    actividad: 'Agregar pistas una a una y mirar qué repartos quedan en pie.',
    // Lee: el campeonato, qué es un reparto, el cuadro y sus dos marcas. No dice cuándo sale una ✓ (eso se descubre).
    lee: {
      tarjetas: [
        { titulo: 'El campeonato del aniversario', texto: 'Ana, Beto y Ciro se inscribieron en el campeonato del aniversario del colegio. Cada uno juega un deporte distinto: fútbol, vóley o ajedrez. Sus fichas de inscripción siguen en blanco: todavía no se sabe quién juega qué.',
          pieza: OB, dibujo: { datos: { escena: 'campeonato', cuadro: false, filas: P3, columnas: D3, iconos: I3 }, estado: {} } },
        { titulo: `${PERM3.length} repartos`, texto: `Un reparto dice quién juega qué: por ejemplo, Ana fútbol, Beto vóley y Ciro ajedrez. Sin pistas hay ${PERM3.length}: Ana puede tener 3 deportes; Beto, los 2 que quedan, y Ciro, el último. En el panel, cada columna es un reparto.`,
          ecuacion: [`3 × 2 × 1 = ${PERM3.length} repartos`],
          pieza: OB, dibujo: { datos: Object.assign(campeonato([]), { pistas: undefined }), estado: {} } },
        { titulo: 'El cuadro y sus marcas', texto: 'En el cuadro de doble entrada, las personas van en las filas y los deportes en las columnas. Cada casilla pregunta: ¿esta persona juega esto? ✗ quiere decir imposible; ✓, seguro. Una pista como «Ana no juega vóley» descarta los repartos donde Ana juega vóley.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a agregar las pistas una a una. Mira cuántos repartos quedan en pie después de cada una y en qué momento aparece la primera ✓.' },
      ],
    },
    juega: {
      pieza: OB,
      consigna: 'Ana, Beto y Ciro se inscribieron en el campeonato del colegio. Cada uno juega un deporte distinto: fútbol, vóley o ajedrez.',
      mision: {
        texto: 'Agrega pistas una a una: ¿con cuántas pistas aparece la primera ✓?',
        logrado: v => v.n === PRIMERA,
        bien: [`Con ${PRIMERA} pistas, antes de saberlo todo: ${P3[segJ[0]]} juega ${D3[segJ[1]]} en los ${quedanJ(PRIMERA)} repartos.`],
      },
      voz: 'Mira qué repartos quedan en pie con cada pista.',
      leyenda: [
        { s: F('✓'), t: 'seguro: coincide en todos los repartos que quedan' },
        { s: '✗', t: 'imposible: ningún reparto que queda lo tiene' },
        { s: 'Repartos', t: 'cada columna dice quién juega qué' },
        { s: 'gris tachado', t: 'reparto que una pista descarta' },
      ],
      controles: [{ id: 'n', etiqueta: 'Pistas', min: 0, max: PJ.length, paso: 1, inicio: 0, decimales: 0 }],
      dibujo: v => ({ datos: campeonato(PJ.slice(0, v.n), { nueva: true }), estado: {} }),
      // La lectura dice la relación: cuántos repartos quedan y si alguna casilla coincide en todos.
      lectura: v => {
        const ps = PJ.slice(0, v.n), q = quedanR(3, ps), seg = segurosDe(3, ps);
        if (q.length === 1) return [`Queda 1 reparto: ${P3.map((p, f) => `${p} ${D3[q[0][f]]}`).join(', ')}`];
        if (seg.length) return [`Quedan ${q.length} repartos; en ${q.length === 2 ? 'ambos' : 'todos'}, ${P3[seg[0][0]]} juega ${D3[seg[0][1]]}: `, F('✓ segura')];
        return [`${v.n ? PJ[v.n - 1].t.replace(/\.$/, '') : 'Sin pistas'}: ${q.length} repartos; ninguna casilla coincide en todos`];
      },
      minimo: PJ.length + 1,
    },
    predice: {
      pregunta: `Otras pistas para los mismos tres: ${PP[0].t.replace(/\.$/, '')} y ${PP[1].t.replace(/\.$/, '')}. ¿Qué es seguro?`,
      datos: [R3],
      voz: 'Revisa qué repartos quedan en pie con estas dos pistas.',
      opciones: [
        { id: 'c', texto: `${P3[SP[0]]} juega ${D3[SP[1]]}`, correcta: true },
        { id: 'nada', texto: `Nada todavía: ninguna pista habla de ${P3[SP[0]]}`, error: 'RMP78',
          siFuera: `Es cierto que ninguna lo nombra, pero la columna del ${D3[SP[1]]} le deja una sola casilla.` },
        { id: 'posible', texto: `${P3[POSIBLE_P[0]]} juega ${D3[POSIBLE_P[1]]}`, error: 'RMP77',
          siFuera: `Pasa en uno de los ${QP.length} repartos que quedan; en el otro, ${P3[POSIBLE_P[0]]} juega ${D3[otroDe(...POSIBLE_P)]}.` },
        { id: 'choca', texto: `${P3[SP[0]]} juega ${D3[0]}`, error: 'RMP72',
          siFuera: `Sin pistas sería posible; con estas dos, nadie podría jugar ${D3[SP[1]]}.` },
      ],
      // El planteamiento: las pistas y los 6 repartos, sin marcas ni tachados (no delata la columna).
      dibujo: { datos: campeonato(PP, { sinMarcas: true }), estado: {} },
      revelar: { datos: campeonato(PP), estado: {} },
      coincide: `Coincide: la columna del ${D3[SP[1]]} dejó una sola casilla libre, la de ${P3[SP[0]]}.`,
      noCoincide: `Revisemos: en los ${QP.length} repartos que quedan, el ${D3[SP[1]]} es de ${P3[SP[0]]}.`,
    },
    mira: {
      pieza: OB,
      datos: MIRA_P,
      voz: 'Primero tachan las pistas; después se mira qué coincide.',
      pasos: [
        { estado: { corte: 1 }, texto: `Cada pista pone una ✗ en la columna del ${D3[SP[1]]}.` },
        { estado: { corte: 2 }, texto: `Y descarta los repartos donde pasa lo que prohíbe: quedan ${QP.length} de ${PERM3.length}.`,
          ecuacion: [`${PERM3.length} − ${PERM3.length - QP.length} = ${QP.length} repartos`] },
        { estado: { corte: 3 }, texto: ['En los ', String(QP.length), ` que quedan, el ${D3[SP[1]]} es de ${P3[SP[0]]}: `, F('✓ segura'), '.'] },
        { estado: { corte: 4 }, texto: `Esa ✓ tacha el resto de la fila de ${P3[SP[0]]}: ni ${D3.filter((_, c) => c !== SP[1]).join(' ni ')}.` },
        { estado: { corte: 4 }, texto: `${lista(P3.filter((_, q) => q !== SP[0]))} se reparten ${lista(D3.filter((_, c) => c !== SP[1]))} de ${QP.length} maneras: ahí no hay ✓.` },
      ],
    },
    regla: {
      texto: 'Una casilla es segura (✓) si vale en todos los repartos que quedan; imposible (✗), si no vale en ninguno. Cada ✓ tacha el resto de su fila y columna.',
      ecuacion: [{ llave: [F('✓')], nota: 'seguro' }, ': en todos los repartos', '   ·   ', { llave: ['✗'], nota: 'imposible' }, ': en ninguno'],
      condicion: 'cada fila y cada columna lleva una sola ✓. Si una pista nombra a dos personas, son distintas: ahí va una ✗.',
      voz: 'Una ✓ no espera a que se sepa todo.',
    },
    ejemplos: null,   // se completa abajo (EJEMPLOS_CUADRO)
    // Así se resuelve: el reparto completo, con la cadena de ✓ contada por propagar(). «Ahora tú» no pide el reparto
    // completo: pide qué hace una persona, qué es seguro o cuál afirmación es verdadera.
    resuelve: {
      pieza: OB,
      generar(s) {
        const r = azar(s + 900), k = s % 3 === 2 ? 4 : 3;
        const c = caso(r, { k, quedan: 1, tipos: k === 4 ? ['no', 'no', 'dos', 'rel', 'si'] : ['no', 'no', 'rel'], max: 4 });
        const pr = propagar(c.k, c.items), co = c.ctx.cosas;
        const directas = Object.fromEntries(c.items.map(x => [`${x.q},${x.c}`, x.si ? 'si' : 'no']));
        const nX = c.items.filter(x => !x.si).length, nSi = c.items.filter(x => x.si).length;
        const cuenta = ({ q, c: x, por }) => (por === 'pista' ? `La pista da la ✓ de ${c.ps[q]} en ${co[x]}.` : por === 'fila' ? `En la fila de ${c.ps[q]} solo queda ${co[x]}: ✓.` : `En la columna de ${co[x]} solo queda ${c.ps[q]}: ✓.`);
        const primeras = pr.orden.slice(0, 2).map(cuenta).join(' ');
        const repartoTxt = c.ps.map((p, q) => `${p} ${co[c.sol[q]]}`).join(', ');
        return {
          enunciado: `${introDe(c)} ${c.ctx.todo}`,
          datos: datosDe(c),
          dibujo: figCuadro(c),
          pasos: [
            { tipo: 'pide', texto: `Piden el reparto completo: ${c.ctx.todo.replace(/[¿?]/g, '').toLowerCase()}.` },
            { tipo: 'datos', texto: `Son ${c.k} personas y ${c.k} opciones, una para cada una. Las pistas ponen ${nX} ✗${nSi ? ` y ${nSi} ✓` : ''} directas.` },
            { tipo: 'regla', texto: 'Si una fila o una columna queda con una sola casilla libre, ahí va la ✓: vale en todos los repartos. Cada ✓ tacha su fila y su columna.' },
            { tipo: 'aplica', texto: `Marco lo que dice cada pista${c.lineas.some(l => l.rel) ? ': si nombra a dos personas, son distintas' : ''}.`, dibujo: figCuadro(c, directas) },
            { tipo: 'aplica', texto: `${primeras}${pr.orden.length > 2 ? ' Las demás salen igual.' : ''}`, ecuacion: [repartoTxt], dibujo: figCuadro(c, marcasDe(c.k, c.items)) },
            { tipo: 'sentido', texto: 'Compruebo cada pista con el reparto: ninguna se rompe y nadie repite.' },
          ],
          respuesta: [F(repartoTxt)],
        };
      },
    },
    // Ahora tú, por tipos (semilla % 4): 0 qué es seguro con dos repartos en pie; 1 qué hace una persona (3 × 3, cadena);
    // 2 qué hace una persona (4 × 4, con una ✓ en la pista o una pista de dos personas); 3 nivel examen (4 × 4, «¿cuál es
    // necesariamente verdadera?», como los cuadros de San Marcos). Las ✓, las ✗ y cada opción salen de contar repartos.
    ahoraTu: {
      pieza: OB,
      voz: 'Marca las ✗ en tu cuadro y busca la fila o columna con una sola casilla.',
      generar(s) {
        const r = azar(s), tipo = s % 4;
        if (tipo === 0) {
          const c = caso(r, { k: r() < 0.5 ? 3 : 4, quedan: 2, tipos: ['no', 'no', 'dos', 'rel'], max: 4 });
          const seg = segurosDe(c.k, c.items), [q, x] = r.elegir(seg), co = c.ctx.cosas;
          const ops = [{ id: 'c', texto: hace(c, q, x), correcta: true },
            { id: 'nada', texto: 'Nada todavía: faltan pistas', error: 'RMP78', siFuera: `Faltan para saberlo todo, pero en los ${c.quedan.length} repartos que quedan, ${hace(c, q, x)}.` }];
          const posibles = [], imposibles = [];
          for (let a = 0; a < c.k; a++) for (let b = 0; b < c.k; b++) { const n = c.quedan.filter(p => p[a] === b).length; if (n > 0 && n < c.quedan.length) posibles.push([a, b]); else if (n === 0 && a !== q) imposibles.push([a, b]); }
          if (posibles.length) { const [a, b] = r.elegir(posibles); ops.push({ id: 'posible', texto: hace(c, a, b), error: 'RMP77', siFuera: `Pasa en uno de los ${c.quedan.length} repartos que quedan; en el otro, ${hace(c, a, c.quedan.find(p => p[a] !== b)[a])}.` }); }
          if (imposibles.length) { const [a, b] = r.elegir(imposibles); ops.push(Object.assign({ id: 'choca', texto: hace(c, a, b) }, porQueNo(c, a, b))); }
          return { pregunta: `${introDe(c)} ¿Qué es seguro?`, datos: datosDe(c), dibujo: figCuadro(c), opciones: ops,
            solucion: { texto: `Quedan ${c.quedan.length} repartos y en los dos ${hace(c, q, x)}: es la única casilla que coincide.`, dibujo: figCuadro(c, marcasDe(c.k, c.items)) } };
        }
        if (tipo === 1 || tipo === 2) {
          const k = tipo === 1 ? 3 : 4;
          const c = caso(r, { k, quedan: 1, tipos: k === 3 ? ['no', 'no', 'rel'] : ['no', 'dos', 'rel', 'si'], max: 4, conRel: k === 4 });
          // Se pregunta por la persona cuya ✓ sale al final de la cadena (no la da ninguna pista sola).
          const pr = propagar(c.k, c.items), ult = pr.orden[pr.orden.length - 1], q = ult.q, co = c.ctx.cosas.slice(0, c.k);
          const ops = co.map((t, x) => (x === c.sol[q] ? { id: 'c', texto: t, correcta: true } : Object.assign({ id: `x${x}`, texto: t }, porQueNo(c, q, x))));
          ops.push({ id: 'nose', texto: 'Faltan datos', error: 'RMP78', siFuera: 'Parece que faltan, pero cada ✓ tacha su fila y su columna, y al final queda una casilla.' });
          return { pregunta: `${introDe(c)} ${c.ctx.que(c.ps[q])}`, datos: datosDe(c), dibujo: figCuadro(c), opciones: ops,
            solucion: { texto: `Con las ✗ y las ✓ que tachan, a ${c.ps[q]} le queda una sola casilla: ${co[c.sol[q]]}.`, dibujo: figCuadro(c, marcasDe(c.k, c.items)) } };
        }
        // Nivel examen: «¿Cuál es necesariamente verdadera?» con uno o dos repartos en pie.
        const quedan = 1 + (Math.floor(s / 4) % 2);
        const c = caso(r, { k: 4, quedan, tipos: ['no', 'dos', 'rel', 'rel'], max: 4, conRel: true });
        const seg = segurosDe(c.k, c.items), [q, x] = r.elegir(seg);
        const ops = [{ id: 'c', texto: hace(c, q, x), correcta: true }], usados = new Set([q]);
        const posibles = [], imposibles = [];
        for (let a = 0; a < c.k; a++) for (let b = 0; b < c.k; b++) { const n = c.quedan.filter(p => p[a] === b).length; if (n > 0 && n < c.quedan.length) posibles.push([a, b]); else if (n === 0) imposibles.push([a, b]); }
        if (posibles.length) { const [a, b] = r.elegir(posibles); usados.add(a); ops.push({ id: 'posible', texto: hace(c, a, b), error: 'RMP77', siFuera: `Pasa en uno de los ${c.quedan.length} repartos que quedan, no en los dos.` }); }
        for (const [a, b] of r.barajar(imposibles)) {
          if (ops.length >= 4 || usados.has(a)) continue;
          usados.add(a); ops.push(Object.assign({ id: `x${a}${b}`, texto: hace(c, a, b) }, porQueNo(c, a, b)));
        }
        return { pregunta: `${introDe(c)} ¿Cuál es necesariamente verdadera?`, datos: datosDe(c), dibujo: figCuadro(c), opciones: ops,
          solucion: { texto: `${quedan === 1 ? 'Queda un solo reparto' : 'Quedan 2 repartos'}, y en ${quedan === 1 ? 'él' : 'los dos'} ${hace(c, q, x)}.`, dibujo: figCuadro(c, marcasDe(c.k, c.items)) } };
      },
    },
  };

  // ---------- Ejemplos resueltos de «El cuadro que descarta» (pestaña «Ejemplos»; molde §3) ----------
  // Cada uno se resolvió aparte con un script que no usa el código de la unidad (scratchpad e3-rm/ejemplos.py): prueba
  // todos los repartos y comprueba que lo que se pregunta tiene una sola respuesta (1 y 2: Beto vóley e Iván teatro con 2
  // repartos en pie; 3: 4 casillas tachadas; 4: quedan 4 de 6, se tachan el 2 y el 5; 5: 2 repartos, Gino cambia y Sara
  // adornos; 6, 7, 9, 10, 11, 12 y 14: un solo reparto; 8: 2 repartos, seguros Dina y Ana; 13: 2 repartos y solo la E vale
  // en los dos; 15: 2 repartos y la música es de Pía en los dos). También rehace el juego (6 → 4 → 2 → 1, primera ✓ con 2
  // pistas) y la predicción (Ciro ajedrez). La figura es el planteamiento: el cuadro sin marcas, nunca la respuesta.
  // Las pistas van en los datos, una por línea (contrato, punto 13); la respuesta, en violeta, con la letra en negrita.
  const T3 = ['danza', 'teatro', 'dibujo'], K3 = ['picarones', 'emoliente', 'choclo'], C3 = ['adornos', 'música', 'juegos'];
  const R_TALLER = 'Cada uno está en un solo taller, y ningún taller se repite.', R_KERMES = 'Cada uno vende una sola cosa, y ninguna se repite.';
  const R_COMISION = 'Cada uno está en una sola comisión, y ninguna se repite.';
  const figC = (filas, columnas) => ({ pieza: OB, datos: { filas, columnas }, estado: {} });
  const figCamp = { pieza: OB, datos: { escena: 'campeonato', filas: P3, columnas: D3, iconos: I3 }, estado: {} };
  const PIS = (...xs) => xs.map((t, i) => `Pista ${i + 1}: ${t}`);
  // Ejemplo 4: los repartos del panel en los que Ciro juega vóley (se cuentan con PERM3, el mismo orden del dibujo).
  const CON_CIRO_VOLEY = PERM3.map((p, i) => [p, i + 1]).filter(([p]) => p[2] === 1).map(([, i]) => i);
  const EJEMPLOS_CUADRO = [
    { nivel: 1, titulo: 'La ficha de Beto', figura: figCamp,
      enunciado: 'Ana, Beto y Ciro se inscribieron en el campeonato: cada uno juega fútbol, vóley o ajedrez, sin repetir. ¿Qué juega Beto?',
      datos: [R3, ...PIS('Beto no juega fútbol.', 'Beto no juega ajedrez.')],
      solucion: [
        { texto: 'Las dos pistas caen en la fila de Beto: ✗ en fútbol y ✗ en ajedrez.' },
        { texto: ['A Beto le queda una sola casilla, vóley. En todos los repartos que quedan, Beto juega vóley: ', F('✓'), '.'] },
      ],
      respuesta: [F('Beto juega vóley')] },
    { nivel: 1, titulo: 'La columna del teatro', figura: figC(['Rosa', 'Iván', 'Nora'], T3),
      enunciado: 'Rosa, Iván y Nora están cada uno en un taller distinto del colegio: danza, teatro o dibujo. ¿Quién está en teatro?',
      datos: [R_TALLER, ...PIS('Rosa no está en teatro.', 'Nora no está en teatro.')],
      solucion: [
        { texto: 'Las dos pistas caen en la columna de teatro: ✗ para Rosa y ✗ para Nora.' },
        { texto: ['En esa columna queda una sola casilla libre, la de Iván. Alguien tiene que estar en teatro: es Iván, ', F('✓'), '.'] },
      ],
      respuesta: [F('Iván está en teatro')] },
    { nivel: 1, titulo: 'Una pista que dice sí', figura: figC(['Lucho', 'Maru', 'Teo'], K3),
      enunciado: 'En la kermés del aniversario, Lucho, Maru y Teo venden cada uno algo distinto: picarones, emoliente o choclo. Si solo se sabe la pista de abajo, ¿cuántas casillas se tachan?',
      datos: [R_KERMES, 'Pista: Maru vende emoliente.'],
      solucion: [
        { texto: ['La pista pone una ', F('✓'), ' en Maru y emoliente: es seguro.'] },
        { texto: 'Maru no vende nada más: ✗ en picarones y en choclo. Nadie más vende emoliente: ✗ para Lucho y para Teo.' },
      ],
      respuesta: [F('4 casillas'), ': 2 en la fila de Maru y 2 de emoliente'] },
    { nivel: 1, titulo: '¿Cuántos repartos quedan?', figura: { pieza: OB, datos: Object.assign(campeonato([]), { pistas: undefined }), estado: {} },
      enunciado: 'Ana, Beto y Ciro juegan cada uno fútbol, vóley o ajedrez, sin repetir. Se sabe que Ciro no juega vóley. ¿Cuántos repartos quedan?',
      datos: [R3, `Sin pistas hay ${PERM3.length} repartos: los ${PERM3.length} del panel.`],
      solucion: [
        { texto: `En ${CON_CIRO_VOLEY.length} de los ${PERM3.length} repartos del panel, Ciro juega vóley: el ${lista(CON_CIRO_VOLEY.map(String))}.` },
        { texto: 'La pista descarta esos repartos; los demás la cumplen.', ecuacion: [`${PERM3.length} − ${CON_CIRO_VOLEY.length} = `, F(String(PERM3.length - CON_CIRO_VOLEY.length))] },
      ],
      respuesta: [F(`Quedan ${PERM3.length - CON_CIRO_VOLEY.length} repartos`)] },
    { nivel: 1, titulo: '¿Seguro o solo posible?', figura: figC(['Sara', 'Gino', 'Pía'], C3),
      enunciado: 'Sara, Gino y Pía están cada uno en una comisión distinta del aniversario: adornos, música o juegos. Gino dice: «Yo estoy en música, seguro». ¿Es seguro?',
      datos: [R_COMISION, ...PIS('Sara no está en música.', 'Sara no está en juegos.')],
      solucion: [
        { texto: ['A Sara solo le queda adornos: ', F('✓'), '.'] },
        { texto: 'Gino y Pía se reparten música y juegos. Quedan 2 repartos: en uno Gino está en música; en el otro, en juegos.' },
        { texto: 'Lo de Gino es posible, pero no seguro: no vale en los dos repartos.' },
      ],
      respuesta: [F('No es seguro'), ': solo es seguro que Sara está en adornos'] },
    { nivel: 2, titulo: 'Una ✓ que tacha', figura: figCamp,
      enunciado: 'Ana, Beto y Ciro juegan cada uno fútbol, vóley o ajedrez en el campeonato, sin repetir. ¿Quién juega qué?',
      datos: [R3, ...PIS('Ana no juega fútbol.', 'Beto no juega fútbol.', 'Beto no juega vóley.')],
      solucion: [
        { texto: ['En la columna de fútbol solo queda Ciro: ', F('✓'), '. Esa ✓ tacha el resto de la fila de Ciro.'] },
        { texto: ['En la fila de Beto ya hay ✗ en fútbol y en vóley: le queda ajedrez, ', F('✓'), '.'] },
        { texto: 'A Ana le queda lo único libre de su fila: vóley.' },
      ],
      respuesta: [F('Ana vóley, Beto ajedrez, Ciro fútbol')] },
    { nivel: 2, titulo: 'De la columna a la fila', figura: figC(['Rosa', 'Iván', 'Nora'], T3),
      enunciado: 'Rosa, Iván y Nora están cada uno en un taller distinto: danza, teatro o dibujo. ¿En qué taller está Nora?',
      datos: [R_TALLER, ...PIS('Iván no está en dibujo.', 'Nora no está en dibujo.', 'Iván no está en teatro.')],
      solucion: [
        { texto: ['En la columna de dibujo solo queda Rosa: ', F('✓'), '. Esa ✓ tacha el resto de la fila de Rosa.'] },
        { texto: ['A Iván le quedan danza y teatro, y la pista 3 tacha teatro: Iván está en danza, ', F('✓'), '.'] },
        { texto: 'Esa ✓ tacha danza para Nora. A Nora le queda una sola casilla: teatro.' },
      ],
      respuesta: [F('Nora está en teatro')] },
    { nivel: 2, titulo: 'Cuatro amigos: ¿qué es seguro?', figura: figC(['Ana', 'Beto', 'Ciro', 'Dina'], CTX[0].cosas),
      enunciado: 'Ana, Beto, Ciro y Dina juegan cada uno fútbol, vóley, ajedrez o básquet, sin repetir. ¿Qué es seguro y qué no?',
      datos: [R3, ...PIS('Dina juega básquet.', 'Ana no juega vóley.', 'Ana no juega ajedrez.')],
      solucion: [
        { texto: ['La pista 1 es una ', F('✓'), ': tacha el resto de la fila de Dina y de la columna de básquet.'] },
        { texto: ['A Ana le quedan fútbol, vóley y ajedrez; las pistas 2 y 3 tachan dos: Ana juega fútbol, ', F('✓'), '.'] },
        { texto: 'Beto y Ciro se reparten vóley y ajedrez de 2 maneras: en esas casillas no hay ✓.' },
      ],
      respuesta: [F('Seguro: Dina básquet y Ana fútbol'), '; Beto y Ciro, no'] },
    { nivel: 2, titulo: 'Quien conversa no es', figura: figC(['Lucho', 'Maru', 'Teo'], K3),
      enunciado: 'En la kermés, Lucho, Maru y Teo venden cada uno algo distinto: picarones, emoliente o choclo. ¿Qué vende Lucho?',
      datos: [R_KERMES, D_DOS, ...PIS('Lucho conversa con quien vende emoliente.', 'Teo no vende emoliente.', 'Quien vende picarones es primo de Teo.')],
      solucion: [
        { texto: 'La pista 1 nombra a dos personas: Lucho no vende emoliente. La pista 3 también: Teo no vende picarones.' },
        { texto: ['En la columna de emoliente solo queda Maru: ', F('✓'), '. A Teo, con dos ✗, le queda choclo: ', F('✓'), '.'] },
        { texto: 'A Lucho le queda la única casilla libre de su fila: picarones.' },
      ],
      respuesta: [F('Lucho vende picarones')] },
    { nivel: 2, titulo: 'Una ✓ que viene en la pista', figura: figC(['Rosa', 'Iván', 'Nora', 'Leo'], CTX[1].cosas),
      enunciado: 'Rosa, Iván, Nora y Leo están cada uno en un taller distinto: danza, teatro, dibujo o banda. ¿Quién está en teatro?',
      datos: [R_TALLER, ...PIS('Ni Rosa ni Iván están en teatro.', 'Leo está en banda.', 'Rosa no está en danza.')],
      solucion: [
        { texto: 'La pista 1 pone dos ✗ en la columna de teatro: Rosa e Iván.' },
        { texto: ['La pista 2 es una ', F('✓'), ' para Leo y tacha el resto de su fila: Leo no está en teatro.'] },
        { texto: ['En la columna de teatro solo queda Nora: ', F('✓'), '. La pista 3 sirve para el resto del cuadro.'] },
      ],
      respuesta: [F('Nora está en teatro')] },
    { nivel: 3, titulo: 'Las cuatro de la posta', figura: figC(['Carla', 'Delia', 'Elsa', 'Flor'], ['médica', 'obstetra', 'dentista', 'técnica']),
      enunciado: 'Carla, Delia, Elsa y Flor trabajan en la posta de salud: una es médica; otra, obstetra; otra, dentista, y otra, técnica. ¿Qué es Carla? A) médica B) dentista C) obstetra D) técnica E) no se puede saber',
      datos: ['Cada una tiene una sola profesión, y ninguna se repite.', D_DOS, ...PIS('La médica almuerza con Carla y con Delia.', 'Delia vive con la dentista y es hermana de la obstetra.', 'La dentista se turna con Carla y con Elsa.')],
      solucion: [
        { texto: 'Cada pista nombra a dos personas distintas. Pista 1: ✗ médica para Carla y Delia. Pista 2: ✗ dentista y obstetra para Delia. Pista 3: ✗ dentista para Carla y Elsa.' },
        { texto: ['A Delia solo le queda técnica: ', F('✓'), '. En la columna de dentista solo queda Flor: ', F('✓'), '.'] },
        { texto: ['A Carla, con médica y dentista tachadas y técnica tomada, le queda obstetra: ', F('✓'), '.'] },
      ],
      respuesta: [F('C'), ': Carla es obstetra'] },
    { nivel: 3, titulo: 'Papás e hijas', figura: figC(['Raúl', 'Saúl', 'Tito', 'Uriel'], ['Gaby', 'Hilda', 'Inés', 'Julia']),
      enunciado: 'Raúl, Saúl, Tito y Uriel son los papás de Gaby, Hilda, Inés y Julia, una hija cada uno. ¿Quién es el papá de Julia? A) Saúl B) Tito C) Uriel D) Raúl E) no se puede saber',
      datos: ['Cada papá tiene una sola hija, y ninguna se repite.', ...PIS('Gaby no es hija de Raúl ni de Saúl.', 'Inés no es hija de Raúl ni de Saúl.', 'El papá de Hilda es Saúl o Tito.', 'Tito no es el papá de Gaby.')],
      solucion: [
        { texto: ['Gaby: las pistas 1 y 4 tachan a Raúl, Saúl y Tito. Su papá es Uriel: ', F('✓'), '.'] },
        { texto: ['Inés: la pista 2 tacha a Raúl y a Saúl, y Uriel ya está tomado. Su papá es Tito: ', F('✓'), '.'] },
        { texto: 'Hilda: Saúl o Tito, y Tito ya está tomado: Saúl. A Julia le queda Raúl.' },
        { texto: 'Ninguna pista nombra a Julia, pero las otras tres casillas de su columna quedaron tachadas: sí se sabe.' },
      ],
      respuesta: [F('D'), ': Raúl es el papá de Julia'] },
    { nivel: 3, titulo: '¿Cuál es necesariamente verdadera?', figura: figC(['Ana', 'Beto', 'Ciro', 'Dina'], CTX[0].cosas),
      enunciado: 'Ana, Beto, Ciro y Dina juegan cada uno fútbol, vóley, ajedrez o básquet, sin repetir. ¿Cuál es necesariamente verdadera? A) Beto juega vóley B) Dina juega básquet C) Ana juega vóley D) Dina juega fútbol E) Ciro juega ajedrez',
      datos: ['Cada uno juega un solo deporte; si una pista nombra a dos personas, son distintas.', 'Fútbol, vóley y básquet se juegan con pelota; el ajedrez, no.',
        ...PIS('Ana y quien juega vóley son vecinos.', 'Beto y Dina juegan con pelota.', 'Ciro no juega fútbol ni básquet.', 'Quien juega fútbol entrena con Beto y con Dina.')],
      solucion: [
        { texto: 'Las pistas tachan: vóley para Ana; ajedrez para Beto y Dina; fútbol y básquet para Ciro; fútbol para Beto y Dina.' },
        { texto: ['En la columna de fútbol solo queda Ana: ', F('✓'), '. En la de ajedrez, solo Ciro: ', F('✓'), '.'] },
        { texto: 'Beto y Dina se reparten vóley y básquet de 2 maneras: «Beto juega vóley» es posible, pero no seguro.' },
      ],
      respuesta: [F('E'), ': Ciro juega ajedrez'] },
    { nivel: 3, titulo: 'Los puestos de la kermés', figura: figC(['Lucho', 'Maru', 'Teo', 'Vilma'], CTX[2].cosas),
      enunciado: 'En la kermés, Lucho, Maru, Teo y Vilma venden cada uno algo distinto: tamales, jugos, choclo o queso. ¿Qué vende Maru? A) jugos B) choclo C) tamales D) queso E) no se puede saber',
      datos: [R_KERMES, D_DOS, ...PIS('Quien vende jugos le presta su olla a Lucho y a Teo.', 'Maru no vende jugos ni queso.', 'Teo y Lucho le compran choclo a la misma persona.', 'Lucho no vende tamales.')],
      solucion: [
        { texto: 'Las pistas 1 y 3 nombran a dos personas: ✗ jugos y ✗ choclo para Lucho y para Teo.' },
        { texto: ['En la columna de jugos solo queda Vilma, porque la pista 2 tacha a Maru: ', F('✓'), '.'] },
        { texto: ['A Lucho le quedan tamales y queso; la pista 4 tacha tamales: queso, ', F('✓'), '. Teo: tamales. Maru: choclo.'] },
      ],
      respuesta: [F('B'), ': Maru vende choclo'] },
    { nivel: 3, titulo: 'Las comisiones del aniversario', figura: figC(['Sara', 'Gino', 'Pía', 'Omar'], CTX[3].cosas),
      enunciado: 'Sara, Gino, Pía y Omar están cada uno en una comisión distinta: adornos, música, juegos o limpieza. ¿Quién está en música? A) Pía B) Sara C) Gino D) Omar E) no se puede saber',
      datos: [R_COMISION, D_DOS, ...PIS('Sara está en juegos o en limpieza.', 'Gino también está en juegos o en limpieza.', 'Quien está en música le presta parlantes a Omar.')],
      solucion: [
        { texto: 'Las pistas 1 y 2 tachan adornos y música para Sara y Gino. Entre los dos ocupan juegos y limpieza: esas columnas quedan tachadas para Pía y Omar.' },
        { texto: 'La pista 3 tacha música para Omar.' },
        { texto: ['En la columna de música solo queda Pía: ', F('✓'), '. De Sara y Gino no se sabe cuál es cuál, pero no hace falta.'] },
      ],
      respuesta: [F('A'), ': Pía está en música'] },
  ];
  ideaCuadro.ejemplos = EJEMPLOS_CUADRO;

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
  // Mesa de la idea 1: las cuatro pistas del reparto, cada una prendida o apagada: el orden no importa, importa cuáles.
  // Conserva su id y los de sus controles (p0 a p3: la colección guarda { mesa, valores }).
  const SINO = [{ valor: 1, texto: 'Sí' }, { valor: 0, texto: 'No' }];
  const PL = [pista(0, 1), pista(1, 0), pista(2, 2), pista(0, 2)];
  const activas = val => PL.filter((_, k) => val['p' + k]);
  const nRep = val => quedanR(3, activas(val)).length;
  // El grupo más chico de pistas que deja un solo reparto (contado, no escrito a mano).
  const MIN_PISTAS = Math.min(...Array.from({ length: 1 << PL.length }, (_, m) => PL.filter((_, k) => (m >> k) & 1))
    .filter(ps => quedanR(3, ps).length === 1).map(ps => ps.length));
  const mesaCuadro = {
    id: 'pistas-a-eleccion', titulo: 'Pistas a elección', pieza: OB,
    consigna: 'Prende y apaga cada pista. Busca el grupo más chico de pistas que deja un solo reparto.',
    controles: PL.map((p, k) => ({ id: 'p' + k, etiqueta: p.t.replace(/\.$/, ''), opciones: SINO, inicio: k < 3 ? 1 : 0 })),
    dibujo: val => ({ datos: Object.assign(campeonato(activas(val)), { lineas: PL.length }), estado: {} }),
    lectura: val => { const k = activas(val).length, n = nRep(val); return [`${k} ${k === 1 ? 'pista' : 'pistas'}: ${n} ${n === 1 ? 'reparto queda' : 'repartos quedan'}`]; },
    // Retos: cuentan con quedanR() y segurosDe(), lo mismo que pone las ✗, las ✓ y los repartos tachados.
    invitaciones: [
      { texto: 'Prende y apaga pistas hasta que quede un solo reparto posible.',
        logrado: val => nRep(val) === 1,
        bien: 'Un solo reparto: cada fila y cada columna quedó con su ✓.' },
      { texto: 'Deja un solo reparto con el menor número de pistas. ¿Cuál sobraba?',
        logrado: val => nRep(val) === 1 && activas(val).length === MIN_PISTAS,
        bien: 'Una pista no aportaba nada: lo que tachaba ya lo tachaban las otras.' },
      { texto: 'Consigue una ✓ segura aunque todavía quede más de un reparto.',
        logrado: val => nRep(val) > 1 && segurosDe(3, activas(val)).length > 0,
        bien: 'Esa casilla coincide en todos los repartos que quedan: es seguro sin saberlo todo.' },
      { texto: 'Apaga todas las pistas y cuenta cuántos repartos son posibles sin datos.',
        logrado: val => activas(val).length === 0,
        bien: `Sin pistas quedan los ${PERM3.length} repartos. Cada pista va descartando algunos.` },
      { texto: 'Guarda dos grupos de pistas distintos que dejen un solo reparto.',
        logrado: (val, guardados) => new Set(guardados.filter(g => nRep(g) === 1).map(g => activas(g).map(p => p.t).join('|'))).size >= 2,
        bien: 'Dos caminos distintos llegan al mismo reparto. ¿Cuál usa menos pistas?' },
    ],
  };
  // Mesa nueva de la idea 1: el cuadro se marca a mano, tocando cada casilla (vacía → ✗ → ✓). Las pistas están fijas y
  // el motor dice si cada marca cuadra con ellas (data-toque en rm-objeto; Gerson, 17 nov: marcar tocando el cuadro).
  const PM = [pista(1, 0), pista(2, 0), pista(2, 2)];
  const SOL_M = quedanR(3, PM)[0];
  const MARCAS = [{ valor: 'vacia', texto: 'Vacía' }, { valor: 'no', texto: '✗' }, { valor: 'si', texto: '✓' }];
  const celdas = [];
  for (let q = 0; q < 3; q++) for (let c = 0; c < 3; c++) celdas.push({ q, c, id: `m${q}${c}` });
  // Una marca choca si pone ✓ donde el único reparto no lo tiene, o ✗ donde sí lo tiene.
  const choca = (val, x) => (val[x.id] === 'si' && SOL_M[x.q] !== x.c) || (val[x.id] === 'no' && SOL_M[x.q] === x.c);
  const malas = val => celdas.filter(x => choca(val, x));
  const puestas = (val, m) => celdas.filter(x => val[x.id] === m);
  const mesaMarca = {
    id: 'marca-tu-cuadro', titulo: 'Marca tú el cuadro', pieza: OB,
    consigna: 'Toca una casilla para marcarla: una vez ✗, otra vez ✓, otra vez vacía. Las pistas no cambian.',
    controles: celdas.map(x => ({ id: x.id, etiqueta: `${P3[x.q]} y ${D3[x.c]}`, opciones: MARCAS })),
    dibujo: val => ({ datos: { escena: 'campeonato', filas: P3, columnas: D3, iconos: I3,
      marcas: Object.fromEntries(celdas.filter(x => val[x.id] !== 'vacia').map(x => [`${x.q},${x.c}`, val[x.id]])),
      toques: Object.fromEntries(celdas.map(x => [`${x.q},${x.c}`, x.id])),
      manos: celdas.filter(x => val[x.id] === 'si' && !choca(val, x)).map(x => ({ f: x.q, c: x.c })),
      pistas: PM.map(p => ({ t: p.t })), lineas: PM.length }, estado: {} }),
    lectura: val => {
      const m = malas(val);
      if (m.length) return [`${P3[m[0].q]} y ${D3[m[0].c]}: esa marca choca con las pistas`];
      const n = celdas.filter(x => val[x.id] !== 'vacia').length;
      if (n === celdas.length) return ['Cuadro completo: una ', F('✓'), ' por fila y por columna'];
      return [n ? `${n} ${n === 1 ? 'marca' : 'marcas'}, todas de acuerdo con las pistas` : 'Sin marcas: toca una casilla'];
    },
    // Retos: todos leen choca(), lo mismo que decide la lectura y qué cosa pasa a la mano de su dueño.
    invitaciones: [
      { texto: 'Marca las ✗ que ponen las pistas, sin poner ninguna ✓.',
        logrado: val => PM.every(p => val[`m${p.q}${p.c}`] === 'no') && !puestas(val, 'si').length && !malas(val).length,
        bien: 'Esas tres ✗ salen directo de las pistas. ¿Alguna fila o columna quedó con una sola casilla?' },
      { texto: 'Pon una ✓ que sea segura, sin ninguna marca que choque.',
        logrado: val => puestas(val, 'si').length > 0 && !malas(val).length,
        bien: 'Segura: vale en el único reparto que dejan las pistas. Mira la mano de su dueño.' },
      { texto: 'Completa el cuadro: una ✓ en cada fila y ✗ en todo lo demás.',
        logrado: val => puestas(val, 'si').length === 3 && puestas(val, 'no').length === 6 && !malas(val).length,
        bien: 'Cuadro completo: cada ✓ tachó su fila y su columna.' },
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
    laboratorio: [mesaCuadro, mesaMarca, mesaVenn, mesaFamilia],
    version: '0.3.0',
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
      // Idea 1 (etapa 3): las palabras que estrena, con su aproximación de todos los días (simple) y 3 ejemplos.
      { termino: 'cuadro de doble entrada', def: 'Tabla con un grupo en las filas y otro en las columnas, para marcar qué va con qué.',
        simple: 'Una tabla para marcar quién va con qué.',
        formas: ['cuadro de doble entrada', 'cuadro'], ejemplos: [
          'Personas en las filas y deportes en las columnas: cada casilla pregunta «¿esta persona juega esto?».',
          'Papás en las filas e hijas en las columnas: cada casilla pregunta «¿es su hija?».',
          'Vendedores en las filas y productos en las columnas, para una kermés.'], ver: ['reparto'] },
      { termino: 'reparto', formas: ['reparto', 'repartos'], def: 'Forma de asignar a cada persona una sola cosa distinta, sin que dos personas compartan la misma.',
        simple: 'Una manera de darle a cada uno una cosa distinta.', ejemplos: [
          'Ana fútbol, Beto vóley y Ciro ajedrez es un reparto de tres deportes.',
          'Con tres personas y tres cosas hay 6 repartos: 3 × 2 × 1.',
          'Con cuatro personas y cuatro cosas hay 24 repartos: 4 × 3 × 2 × 1.'], ver: ['cuadro de doble entrada'] },
      { termino: 'descartar', formas: ['descartar', 'descarta', 'descartan', 'descartado', 'descartada', 'descartados', 'descartadas'],
        def: 'Dejar de lado una posibilidad porque choca con un dato.',
        simple: 'Tachar lo que ya no puede ser.', ejemplos: [
          '«Beto no juega fútbol» descarta los repartos donde Beto juega fútbol.',
          'Si Ana ya tiene el fútbol, se descarta el fútbol para todos los demás.',
          'Un reparto que choca con una sola pista también queda descartado.'], ver: ['reparto'] },
      { termino: 'parentesco', def: 'Relación de familia entre dos personas, como padre, tío o primo.',
        formas: ['parentesco', 'parentescos'], ejemplo: 'El hijo de tu tío es tu primo.', ver: ['árbol genealógico'] },
      { termino: 'árbol genealógico', def: 'Dibujo de una familia: cada línea une a un padre o una madre con un hijo o una hija.',
        formas: ['árbol genealógico', 'árbol', 'árboles'], ejemplo: 'De Ana a su primo Iván: el camino sube 2 líneas y baja 2.', ver: ['parentesco'] },
      { termino: 'radio', def: 'Distancia del centro de un círculo a su borde. Es la mitad del diámetro.',
        formas: ['radio', 'radios'], ver: ['diámetro'] },
    ],
    requiere: ['/nucleo/kit/piezas/rm-plano.js', '/nucleo/kit/piezas/rm-tablero.js', '/nucleo/kit/piezas/rm-objeto.js'],
    historia: {
      texto: 'En el siglo IV a. C., Aristóteles estudió qué conclusiones se siguen necesariamente de unas premisas. Separó dos cosas: que las premisas sean verdaderas y que el paso hacia la conclusión sea válido. Los acertijos de familias y repartos de hoy son otra aplicación de esa misma pregunta.',
      pregunta: '¿Cuándo una conclusión no puede fallar?',
      fuente: { titulo: 'Aristotle’s Logic · Stanford Encyclopedia of Philosophy', url: 'https://plato.stanford.edu/entries/aristotle-logic/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'venn-libre': ['conclusion-necesaria'],
      'cualquier-pariente': ['parentesco'],
      'pistas-a-eleccion': ['doble-entrada'],
      'marca-tu-cuadro': ['doble-entrada'],
    },
    // Orden aprobado (docs/etapa3/decisiones.md): el cuadro primero; los ids no cambian (guardan el avance).
    ideas: [ideaCuadro, ideaVenn, ideaSi, ideaFamilia],
  };
});
