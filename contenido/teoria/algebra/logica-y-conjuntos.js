/*
 * Teoría de «Lógica, conjuntos y juegos lógicos» (algebra.logica-y-conjuntos). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 1), expediente teoria-152-unidades (Álgebra) y
 * historia-ecuaciones (pp. 57–68). Errores: códigos TAL-* nuevos, hipótesis de diseño (rutinas/teoria-algebra.md).
 * Colores (regla 4): p y A naranja (c-o), q y B turquesa (c-i), resultado verdadero o «cumple» verde (c-d),
 * falso, contraejemplo o «no cumple» rojo (c-h).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · decidir si una conclusión vale siempre revisando todos los casos (filas, regiones, elementos, órdenes).
 * Persona y condiciones · 3.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · traduce necesaria y suficiente, niega un cuantificador y justifica una certeza en todos los casos.
 * Orden de atención · 1.º la figura (tabla, Venn, recta) · 2.º la fila o región que cambia · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · arrastrando una manija · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué «si p, entonces q» no permite concluir p cuando q es verdadera.
 *
 * Ronda 2 (14 nov 2026): gesto directo en tres ideas (la fila de la tabla de verdad, la ficha de un número dentro
 * del Venn y el testigo x sobre la recta). Sin arrastre: «equivalencias» (lo que cambia es la fórmula elegida),
 * «potencia» (n es un conteo y la tabla crece al doble) y «certezas» (las pistas se prenden o apagan; las filas son
 * resultados, no entradas). Llaves en las reglas y laboratorio con tres mesas: dos fórmulas fila por fila, tres
 * conjuntos con una ficha, y el contraejemplo con todas las propiedades.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const p = { v: 'c-o', t: 'p' }, q = { v: 'c-i', t: 'q' };
  const A = { v: 'c-o', t: 'A' }, B = { v: 'c-i', t: 'B' };
  const VF = b => (b ? 'V' : 'F');
  const FILAS = [[true, true], [true, false], [false, true], [false, false]];
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    r.mezclar = l => { const x = l.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
    return r;
  }
  // Opciones distintas por su texto: la correcta primero; un distractor que repite un texto se descarta.
  function distintas(ops) {
    const vistos = new Set(), out = [];
    for (const o of ops) { const t = Kit.plano(o.texto); if (vistos.has(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }

  // ---------- Fórmulas de dos variables: texto y valor en cada fila ----------
  const FORMULAS = {
    'p ∧ q': (a, b) => a && b, 'p ∨ q': (a, b) => a || b, 'p → q': (a, b) => !a || b, 'p ↔ q': (a, b) => a === b,
    'q → p': (a, b) => !b || a, '~q → ~p': (a, b) => b || !a, '~p → ~q': (a, b) => a || !b, '~p ∨ q': (a, b) => !a || b,
    'p ∨ ~p': a => a || !a, 'p ∧ ~p': a => a && !a, 'p ∧ ~q': (a, b) => a && !b, '~(p ∧ q)': (a, b) => !(a && b),
    '(p ∧ q) → p': (a, b) => !(a && b) || a, 'p → (p ∨ q)': (a, b) => !a || a || b, '~(p ∧ ~p)': a => !(a && !a),
    '(p ∧ (p → q)) → q': (a, b) => !(a && (!a || b)) || b, '(p ∨ q) → p': (a, b) => !(a || b) || a,
    '(p → q) → p': (a, b) => !(!a || b) || a, 'q → (p ∧ q)': (a, b) => !b || (a && b), 'p → p': a => !a || a,
    '~p ∨ ~q': (a, b) => !a || !b,
  };
  // Gesto directo (docs/teoria.md §4b): la manija vive en coordenadas de la figura; la pieza da la escala.
  const TABLA = () => Kit.piezas['alg-tabla'], VENN = () => Kit.piezas['alg-venn'], RECTA = () => Kit.piezas.recta;
  // Fila de la tabla más cercana a un punto (0 a n − 1).
  const filaDe = (g, py, n) => Math.max(0, Math.min(n - 1, Math.round((py - g.cy(0)) / (g.cy(1) - g.cy(0)))));
  // La manija de una fila va en el borde izquierdo de la tabla, para no tapar sus valores.
  const manijaFila = (datosDe, etiqueta) => ({
    id: 'fila', etiqueta, color: 'c-d',
    donde: val => { const g = TABLA().geometria(datosDe(val)); return { x: g.xs[0], y: g.cy(FILAS.findIndex(([a, b]) => VF(a) === val.p && VF(b) === val.q)) }; },
    mover: (pt, val) => { const [a, b] = FILAS[filaDe(TABLA().geometria(datosDe(val)), pt.y, 4)]; return { p: VF(a), q: VF(b) }; },
  });
  const valor = (txt, a, b) => !!FORMULAS[txt](a, b);
  const columna = txt => FILAS.map(([a, b]) => valor(txt, a, b));
  const tautologia = txt => columna(txt).every(Boolean);
  // Pinta una fórmula con p y q en su color (regla 4).
  const pinta = txt => txt.split(/([pq])/).filter(Boolean).map(x => (x === 'p' ? p : x === 'q' ? q : x));
  const celdaVF = (v, o = {}) => Object.assign({ t: VF(v), color: v ? 'd' : 'h', fuerte: !v }, o);

  // ---------- Idea 1: el condicional solo falla con V → F ----------
  // Cambia: los valores de p y q (se arrastra la fila) y el conector · Permanece: las cuatro filas y sus colores · Progresa: la fila
  // marcada · Se reserva: la única fila F de p → q · Debe verse: con q verdadera, p puede ser V o F.
  const CONECTORES = ['p ∧ q', 'p ∨ q', 'p → q', 'p ↔ q'];
  const tablaConector = (con, filaMarcada, oculto = false) => ({
    datos: {
      columnas: ['p', 'q', con], colorCol: ['o', 'i', null],
      filas: FILAS.map(([a, b]) => [VF(a), VF(b), celdaVF(valor(con, a, b), { desde: oculto ? 1 : 0 })]),
      resaltes: filaMarcada === null ? [] : [{ f: filaMarcada, c: 0, ancho: 3, color: 'd' }],
      alt: `Tabla de verdad de ${con}`,
    }, estado: {},
  });
  // Condiciones sobre n: «múltiplo de k» o «múltiplo de a y de b». Todo se decide revisando n = 1 … 600.
  // La usan «Ahora tú» y «Así se resuelve» (regla 1: las mismas cuentas). X → Y falla en nXY; Y → X falla en nYX.
  const contraN = (U, V) => { for (let n = 1; n <= 600; n++) if (U.f(n) && !V.f(n)) return n; return null; };
  function parCondiciones(r, s) {
    const mult = k => ({ texto: `múltiplo de ${k}`, f: n => n % k === 0, divisores: [k] });
    const tipo = s % 4;
    let X, Y;
    if (tipo === 0 || tipo === 1) { const k = r.uno([2, 3, 4, 5]), m = r.uno([2, 3, 5]); X = mult(k * m); Y = mult(k); if (tipo === 1) [X, Y] = [Y, X]; }
    else if (tipo === 2) { const [k, m] = r.uno([[4, 6], [6, 9], [4, 10], [6, 10], [9, 12], [10, 15]]); X = mult(k); Y = mult(m); }
    else { const [k, m] = r.uno([[2, 3], [3, 5], [2, 5], [3, 4], [4, 5]]); X = mult(k * m); Y = { texto: `múltiplo de ${k} y de ${m}`, f: n => n % k === 0 && n % m === 0, divisores: [k, m] }; if (s % 8 === 7) [X, Y] = [Y, X]; }
    const nXY = contraN(X, Y), nYX = contraN(Y, X);
    return { X, Y, nXY, nYX, suf: nXY === null, nec: nYX === null };
  }
  const TEXTOS_COND = { suf: 'suficiente, pero no necesaria', nec: 'necesaria, pero no suficiente', ambas: 'necesaria y suficiente', ninguna: 'ni necesaria ni suficiente' };
  const condicional = {
    id: 'condicional',
    titulo: 'El condicional solo falla una vez',
    temas: ['Proposiciones y conectores', 'Condición necesaria y suficiente'],
    pieza: 'alg-tabla',
    // Lee (fase 2): vocabulario y qué mirar; no dice qué pasa con p cuando q es verdadera (eso lo pregunta «Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Frases que se juzgan', texto: ['«Hoy llueve en Juliaca» puede ser verdadera o falsa, según el día. Una frase así es una proposición. Se nombra con una letra, como ', p, ' o ', q, ', y vale V o F.'] },
        { titulo: 'Los conectores', texto: 'Las proposiciones se unen con conectores: ∧ se lee «y»; ∨, «o»; → , «si…, entonces»; y ↔, «si y solo si». Cada conector tiene su tabla de verdad.' },
        { titulo: 'Qué mirar al jugar', texto: ['La tabla tiene cuatro filas: una por cada par de valores de ', p, ' y ', q, '. Prueba los cuatro conectores y cuenta en cuántas filas da F cada uno.'] },
      ],
    },
    juega: {
      consigna: 'Elige el valor de p y de q, y un conector. La fila marcada es tu caso; la última columna dice si es verdadera.',
      voz: 'Prueba el mismo par con los cuatro conectores.',
      controles: [
        { id: 'p', etiqueta: 'p', opciones: [{ valor: 'V', texto: 'V' }, { valor: 'F', texto: 'F' }] },
        { id: 'q', etiqueta: 'q', opciones: [{ valor: 'V', texto: 'V' }, { valor: 'F', texto: 'F' }] },
        { id: 'con', etiqueta: 'Conector', opciones: CONECTORES.map(c => ({ valor: c, texto: c })) },
      ],
      dibujo: val => tablaConector(val.con, FILAS.findIndex(([a, b]) => VF(a) === val.p && VF(b) === val.q)),
      lectura: val => [p, ` = ${val.p}, `, q, ` = ${val.q}: `, ...pinta(val.con), ` = ${VF(valor(val.con, val.p === 'V', val.q === 'V'))}`],
      minimo: 4,
      // Arrastra la fila marcada hacia arriba o abajo: cada fila es un par de valores de p y q.
      arrastres: [manijaFila(val => tablaConector(val.con, FILAS.findIndex(([a, b]) => VF(a) === val.p && VF(b) === val.q)).datos, 'fila de la tabla: valores de p y q')],
    },
    predice: {
      pregunta: ['Sabemos que ', ...pinta('p → q'), ' es verdadera y que ', q, ' es verdadera. ¿Qué se puede decir de ', p, '?'],
      opciones: [
        { id: 'c', texto: 'Puede ser V o F', correcta: true },
        { id: 'p-v', texto: ['Que ', p, ' es verdadera'], error: 'TAL-RECIPROCA', siFuera: 'Sería cierto si también valiera q → p. El condicional no afirma esa recíproca.' },
        { id: 'p-f', texto: ['Que ', p, ' es falsa'], error: 'TAL-INVERSA', siFuera: 'p falsa con q verdadera es una fila posible, pero p verdadera también lo es.' },
      ],
      dibujo: tablaConector('p → q', null, true),
      revelar: { datos: Object.assign(tablaConector('p → q', null).datos, { resaltes: [{ f: 0, c: 0, ancho: 3, color: 'i' }, { f: 2, c: 0, ancho: 3, color: 'i' }] }), estado: {} },
      coincide: 'Coincide: en las dos filas con q verdadera, p vale V en una y F en la otra.',
    },
    mira: {
      datos: {
        columnas: ['p', 'q', 'p → q'], colorCol: ['o', 'i', null],
        filas: FILAS.map(([a, b], k) => [VF(a), VF(b), celdaVF(valor('p → q', a, b), { desde: k === 0 ? 1 : k === 1 ? 2 : 3 })]),
        resaltes: [{ f: 1, c: 0, ancho: 3, color: 'h', desde: 2 }, { f: 0, c: 0, ancho: 3, color: 'i', desde: 4 }, { f: 2, c: 0, ancho: 3, color: 'i', desde: 4 }],
        alt: 'Tabla de verdad de p → q: solo la fila p verdadera, q falsa da F',
      },
      voz: 'Creo que la fila F es la clave. Comprobemos las cuatro.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Se cumple p y se cumple q: la promesa se cumplió.', ecuacion: ['V → V = V'] },
        { estado: { corte: 2 }, texto: 'Se cumple p y no q: la promesa se rompió. Es la única F.', ecuacion: ['V → F = F'] },
        { estado: { corte: 3 }, texto: 'Si p es falsa, la promesa no se pone a prueba: queda V.', ecuacion: ['F → V = V', '   ·   ', 'F → F = V'] },
        { estado: { corte: 4 }, texto: 'Con q verdadera hay dos filas: en una p es V; en otra, F.', ecuacion: [q, ' = V no decide el valor de ', p] },
      ],
    },
    regla: {
      texto: 'p → q solo es falsa cuando p es verdadera y q es falsa. Por eso p es suficiente para q, y q es necesaria para p.',
      ecuacion: [{ llave: [p], nota: 'suficiente', color: 'c-o' }, ' → ', { llave: [q], nota: 'necesaria', color: 'c-i' }, '   ·   ', '≡  ', ...pinta('~p ∨ q')],
      condicion: 'se lee «si p, entonces q»; no afirma la recíproca q → p, que es otra proposición.',
      voz: 'Suficiente va antes de la flecha; necesaria, después.',
    },
    // Así se resuelve (fase 2): el problema de «Ahora tú» con otras semillas; los contraejemplos los busca contraN.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        const { X, Y, nXY, nYX, suf, nec } = parCondiciones(r, s);
        const bien = suf && nec ? 'ambas' : suf ? 'suf' : nec ? 'nec' : 'ninguna';
        const PX = { v: 'c-o', t: X.texto }, PY = { v: 'c-i', t: Y.texto };
        let ambos = 1; while (!(X.f(ambos) && Y.f(ambos))) ambos++;
        let ninguno = 2; while (X.f(ninguno) || Y.f(ninguno)) ninguno++;
        const filasN = [...new Set([ninguno, ambos, nXY, nYX].filter(n => n !== null))].sort((u, w) => u - w);
        const tabla = ver => ({
          datos: {
            columnas: ['n', 'p', 'q', 'p → q', 'q → p'], colorCol: [null, 'o', 'i'],
            filas: filasN.map(n => [String(n), ...[X.f(n), Y.f(n), !X.f(n) || Y.f(n), !Y.f(n) || X.f(n)].map(v => (ver ? celdaVF(v) : '?'))]),
            resaltes: ver ? [nXY, nYX].filter(n => n !== null).map(n => ({ f: filasN.indexOf(n), c: 0, ancho: 5, color: 'h' })) : [],
            alt: `Números ${filasN.join(', ')}: si cumplen p (${X.texto}) y q (${Y.texto})`,
          }, estado: {},
        });
        // Prueba de pertenencia con divisiones: «8 ÷ 4 = 2» o «8 ÷ 6 no es exacta».
        const prueba = (n, C) => C.divisores.map(d => (n % d === 0 ? `${n} ÷ ${d} = ${n / d}` : `${n} ÷ ${d} no es exacta`)).join(' y ');
        let sentido;
        if (nXY !== null) sentido = `Compruebo ${nXY}: ${prueba(nXY, X)}, pero ${prueba(nXY, Y)}.${nYX !== null ? ` Con ${nYX} pasa al revés.` : ''}`;
        else if (nYX !== null) sentido = `Compruebo ${nYX}: ${prueba(nYX, Y)}, pero ${prueba(nYX, X)}. Por eso falla la segunda flecha.`;
        else { const [k, m] = (X.divisores.length === 2 ? X : Y).divisores; sentido = `Comprueba: ${k} y ${m} no tienen divisores comunes, así que ser múltiplo de los dos es ser múltiplo de ${k * m}.`; }
        return {
          enunciado: ['Ser ', PX, ' es una condición ___ para ser ', PY, '. ¿Qué completa el espacio?'],
          dibujo: tabla(false),
          pasos: [
            { tipo: 'pide', texto: ['Piden qué clase de condición es ser ', PX, ' para ser ', PY, ': suficiente, necesaria, las dos o ninguna.'] },
            { tipo: 'datos', texto: ['Llamo ', p, ' a «n es ', PX, '» y ', q, ' a «n es ', PY, '». Hay que revisar las dos flechas.'], ecuacion: [p, ' → ', q, '   ·   ', q, ' → ', p] },
            { tipo: 'regla', texto: ['Si ', p, ' → ', q, ' vale para todo n, ', p, ' es suficiente. Si ', q, ' → ', p, ' vale, es necesaria. Una flecha cae con un solo contraejemplo.'] },
            { tipo: 'cuentas', texto: ['Busco desde n = 1 un número con ', p, ' verdadera y ', q, ' falsa, y otro con ', q, ' verdadera y ', p, ' falsa.'],
              ecuacion: [p, ' → ', q, nXY === null ? ' vale' : ` falla con n = ${nXY}`, '   ·   ', q, ' → ', p, nYX === null ? ' vale' : ` falla con n = ${nYX}`], dibujo: tabla(true) },
            { tipo: 'sentido', texto: sentido },
          ],
          respuesta: bien === 'ninguna' ? 'No es necesaria ni suficiente.' : `Es una condición ${TEXTOS_COND[bien]}.`,
        };
      },
    },
    ahoraTu: {
      voz: 'Un caso nuevo. Busca un número que sirva de contraejemplo.',
      generar(s) {
        const r = azar(s);
        const { X, Y, nXY, nYX, suf, nec } = parCondiciones(r, s);
        const TEXTOS = {
          'suf': 'suficiente, pero no necesaria', 'nec': 'necesaria, pero no suficiente', 'ambas': 'necesaria y suficiente', 'ninguna': 'ni necesaria ni suficiente',
        };
        const bien = suf && nec ? 'ambas' : suf ? 'suf' : nec ? 'nec' : 'ninguna';
        const por = {
          suf: suf ? null : `Sería así si todo ${X.texto} fuera ${Y.texto}; ${nXY} no lo es.`,
          nec: nec ? null : `Sería así si todo ${Y.texto} fuera ${X.texto}; ${nYX} no lo es.`,
        };
        const siFuera = id => (suf && nec && id === 'suf' ? `También es necesaria: todo ${Y.texto} es ${X.texto}.` : suf && nec && id === 'nec' ? `También es suficiente: todo ${X.texto} es ${Y.texto}.` : id === 'suf' ? por.suf || por.nec : id === 'nec' ? por.nec || por.suf : id === 'ambas' ? por.suf || por.nec : `Sería así si ninguna implicación valiera; ${suf ? `todo ${X.texto} es ${Y.texto}` : `todo ${Y.texto} es ${X.texto}`}.`);
        const ERR = { suf: 'TAL-SUF', nec: 'TAL-NEC', ambas: 'TAL-AMBAS', ninguna: 'TAL-NINGUNA' };
        const ops = ['suf', 'nec', 'ambas', 'ninguna'].map(id => (id === bien ? { id, texto: TEXTOS[id], correcta: true } : { id, texto: TEXTOS[id], error: ERR[id], siFuera: siFuera(id) }));
        const PX = { v: 'c-o', t: X.texto }, PY = { v: 'c-i', t: Y.texto };
        const texto = suf && nec ? `Las dos implicaciones valen: son la misma condición.`
          : suf ? `Todo ${X.texto} es ${Y.texto}; ${nYX} es ${Y.texto} y no ${X.texto}.`
            : nec ? `Todo ${Y.texto} es ${X.texto}; ${nXY} es ${X.texto} y no ${Y.texto}.`
              : `${nXY} es ${X.texto} y no ${Y.texto}; ${nYX}, al revés.`;
        return {
          pregunta: ['Ser ', PX, ' es una condición ___ para ser ', PY, '. ¿Qué completa el espacio?'],
          opciones: [ops.find(o => o.correcta), ...ops.filter(o => !o.correcta)],
          solucion: { texto, ecuacion: [p, ' → ', q, suf ? ' vale' : ' falla', '   ·   ', q, ' → ', p, nec ? ' vale' : ' falla'] },
        };
      },
    },
  };

  // ---------- Idea 2: misma columna, misma proposición ----------
  // Sin arrastre: lo que cambia es la fórmula elegida, y ninguna parte de la tabla la representa.
  // Cambia: la fórmula elegida · Permanece: las cuatro filas de p y q · Progresa: las columnas que se llenan
  // · Se reserva: la columna de ~q → ~p que copia a p → q · Debe verse: dos columnas idénticas fila por fila.
  const JUEGO2 = ['p ∧ q', 'p ∨ q', 'p → q', 'p ↔ q', 'p ∨ ~p', 'p ∧ ~p'];
  const tablaFormulas = (lista, ocultas = []) => ({
    columnas: ['p', 'q', ...lista], colorCol: ['o', 'i'],
    filas: FILAS.map(([a, b]) => [VF(a), VF(b), ...lista.map(t => celdaVF(valor(t, a, b), { desde: ocultas.includes(t) ? 1 : 0 }))]),
    alt: `Tabla de verdad de ${lista.join(', ')}`,
  });
  // Fórmulas para «Ahora tú» y «Así se resuelve»: tautologías y no tautologías, y la primera fila donde una da F.
  const TAUTO_SI = ['p ∨ ~p', '(p ∧ q) → p', 'p → (p ∨ q)', '~(p ∧ ~p)', '(p ∧ (p → q)) → q', 'p → p'];
  const TAUTO_NO = ['p → q', 'q → p', 'p ∧ ~q', '(p ∨ q) → p', '(p → q) → p', 'q → (p ∧ q)', 'p ↔ q', 'p ∨ q'];
  const falloTauto = t => { const [a, b] = FILAS.find(([x, y]) => !valor(t, x, y)); return `con p = ${VF(a)}, q = ${VF(b)}`; };
  const equivalencias = {
    id: 'equivalencias',
    titulo: 'Misma columna, misma proposición',
    temas: ['Tautología y equivalencias'],
    pieza: 'alg-tabla',
    // Lee (fase 2): qué es una columna, tautología y contradicción; no dice qué fórmula copia a p → q.
    lee: {
      tarjetas: [
        { titulo: 'Una columna por fórmula', texto: 'En una tabla de verdad, cada fórmula tiene su columna: cuatro valores, uno por fila. Esa columna es como su huella: dice cuánto vale la fórmula en cada caso.' },
        { titulo: 'Dos nombres', texto: 'Si la columna tiene V en las cuatro filas, la fórmula es una tautología, como «o llueve en Puno o no llueve». Si tiene F en las cuatro, es una contradicción.' },
        { titulo: 'Qué mirar al jugar', texto: ['El signo ~ niega: ~', p, ' es V cuando ', p, ' es F. Elige cada fórmula y cuenta sus V. Busca una columna con cuatro V y otra con cuatro F.'] },
      ],
    },
    juega: {
      consigna: 'Elige una fórmula y mira su columna en las cuatro filas. Busca una verdadera en todas y otra falsa en todas.',
      voz: 'Cuenta cuántas V tiene cada columna.',
      controles: [{ id: 'f', etiqueta: 'Fórmula', opciones: JUEGO2.map(t => ({ valor: t, texto: t })) }],
      dibujo: val => ({ datos: tablaFormulas([val.f]), estado: {} }),
      lectura: val => {
        const n = columna(val.f).filter(Boolean).length;
        return [...pinta(val.f), `: V en ${n} de 4 filas`, n === 4 ? ' · tautología' : n === 0 ? ' · contradicción' : ''];
      },
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuál de estas fórmulas tiene la misma columna que ', ...pinta('p → q'), ' en las cuatro filas?'],
      opciones: (() => {
        const base = columna('p → q');
        const fila = t => FILAS.findIndex(([a, b], k) => valor(t, a, b) !== base[k]);
        const dif = t => { const [a, b] = FILAS[fila(t)]; return `con p = ${VF(a)}, q = ${VF(b)}`; };
        return [
          { id: 'c', texto: pinta('~q → ~p'), correcta: true },
          { id: 'reciproca', texto: pinta('q → p'), error: 'TAL-RECIPROCA', siFuera: `La recíproca coincide en dos filas, pero ${dif('q → p')} da otro valor.` },
          { id: 'inversa', texto: pinta('~p → ~q'), error: 'TAL-INVERSA', siFuera: `Negar ambos lados sin invertir el orden falla ${dif('~p → ~q')}.` },
          { id: 'conj', texto: pinta('p ∧ q'), error: 'TAL-CONJ', siFuera: `Coincidiría si p → q fuera F cuando p es F; ${dif('p ∧ q')} difieren.` },
        ];
      })(),
      dibujo: { datos: tablaFormulas(['p → q', '~q → ~p', 'q → p'], ['~q → ~p', 'q → p']), estado: { corte: 0 } },
      revelar: { datos: Object.assign(tablaFormulas(['p → q', '~q → ~p', 'q → p']), { resaltes: [{ f: 0, c: 2, alto: 4, ancho: 2, color: 'd' }] }), estado: {} },
      coincide: 'Coincide: la contrarrecíproca repite la columna de p → q fila por fila.',
    },
    mira: {
      datos: {
        columnas: ['p', 'q', '~q', '~p', '~q → ~p', 'p → q'], colorCol: ['o', 'i', 'i', 'o'],
        filas: FILAS.map(([a, b]) => [VF(a), VF(b), { t: VF(!b), desde: 1 }, { t: VF(!a), desde: 1 }, celdaVF(valor('~q → ~p', a, b), { desde: 2 }), celdaVF(valor('p → q', a, b), { desde: 3 })]),
        resaltes: [{ f: 0, c: 4, alto: 4, ancho: 2, color: 'd', desde: 4 }],
        alt: 'Tabla de ~q → ~p y p → q: las dos columnas son iguales',
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Primero se niegan q y p en cada fila.', ecuacion: ['~V = F', '   ·   ', '~F = V'] },
        { estado: { corte: 2 }, texto: 'Con esas columnas se calcula el condicional ~q → ~p.', ecuacion: pinta('~q → ~p') },
        { estado: { corte: 3 }, texto: 'Al lado va p → q, calculado aparte.', ecuacion: pinta('p → q') },
        { estado: { corte: 4 }, texto: 'Las dos columnas coinciden en las cuatro filas: son equivalentes.', ecuacion: [...pinta('p → q'), '  ≡  ', ...pinta('~q → ~p')] },
      ],
    },
    regla: {
      texto: 'Dos fórmulas son equivalentes si tienen la misma columna en todas las filas. Una tautología es verdadera en todas; una contradicción, falsa en todas.',
      ecuacion: [...pinta('~(p ∧ q)'), '  ≡  ', ...pinta('~p ∨ ~q')],
      condicion: 'se revisan las cuatro filas de p y q; una sola fila distinta basta para que no sean equivalentes.',
    },
    // Así se resuelve (fase 2): el problema de «Ahora tú» (¿cuál es tautología?) con otras semillas y tres fórmulas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        const buena = TAUTO_SI[(s + 3) % TAUTO_SI.length], malas = r.mezclar(TAUTO_NO).slice(0, 2);
        const lista = r.mezclar([buena, ...malas]), k = lista.indexOf(buena);
        const sep = (l, f) => l.flatMap((t, i) => [...(i ? ['   ·   '] : []), ...f(t)]);
        return {
          enunciado: ['¿Cuál de estas fórmulas es una tautología: ', ...pinta(lista[0]), ', ', ...pinta(lista[1]), ' o ', ...pinta(lista[2]), '?'],
          dibujo: { datos: tablaFormulas(lista, lista), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden la fórmula que da V en las cuatro filas de ', p, ' y ', q, ', pase lo que pase.'] },
            { tipo: 'datos', texto: ['Tengo tres fórmulas con ', p, ' y ', q, ', y cuatro filas: VV, VF, FV y FF.'], ecuacion: sep(lista, pinta) },
            { tipo: 'regla', texto: 'Una tautología no tiene ninguna F en su columna. Para descartar una fórmula me basta una fila donde dé F.' },
            { tipo: 'cuentas', texto: 'Calculo cada fórmula fila por fila, en el orden VV, VF, FV y FF.',
              ecuacion: sep(lista, t => [...pinta(t), ': ', columna(t).map(VF).join(' ')]),
              dibujo: { datos: Object.assign(tablaFormulas(lista), { resaltes: [{ f: 0, c: 2 + k, alto: 4, color: 'd' }] }), estado: {} } },
            { tipo: 'sentido', texto: ['Compruebo las descartadas: ', ...malas.flatMap((t, i) => [...(i ? ['; '] : []), ...pinta(t), ` da F ${falloTauto(t)}`]), '.'] },
          ],
          respuesta: [...pinta(buena), ' es la tautología.'],
        };
      },
    },
    ahoraTu: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s);
        const SI = TAUTO_SI, NO = TAUTO_NO, fallo = falloTauto;
        const buena = SI[s % SI.length], malas = r.mezclar(NO).slice(0, 3);
        return {
          pregunta: '¿Cuál de estas fórmulas es una tautología, es decir, verdadera en las cuatro filas?',
          opciones: [{ id: 'c', texto: pinta(buena), correcta: true }, ...malas.map((t, k) => ({ id: `m${k}`, texto: pinta(t), error: 'TAL-TAUTO', siFuera: `Sería tautología si no tuviera filas F, pero ${fallo(t)} da F.` }))],
          solucion: { texto: 'Su columna tiene V en las cuatro filas.', ecuacion: [...pinta(buena), ': V, V, V, V'], dibujo: { datos: tablaFormulas([buena]), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: una operación es un grupo de regiones ----------
  // Cambia: la operación y el número que se sigue (su ficha se arrastra de región en región) · Permanece: U, A y B con sus elementos · Progresa: las regiones sombreadas
  // · Se reserva: (A ∩ B)′ y A′ ∪ B′ que terminan iguales · Debe verse: cada elemento en una sola región.
  const U3 = [1, 2, 3, 4, 5, 6, 7, 8, 9], A3 = [2, 4, 6, 8], B3 = [3, 6, 9];
  const OPS = {
    'A ∪ B': (a, b) => a || b, 'A ∩ B': (a, b) => a && b, 'A − B': (a, b) => a && !b, 'B − A': (a, b) => b && !a,
    'A Δ B': (a, b) => a !== b, '(A ∪ B)′': (a, b) => !(a || b), '(A ∩ B)′': (a, b) => !(a && b),
    'A′ ∪ B′': (a, b) => !a || !b, 'A′ ∩ B′': (a, b) => !a && !b, 'A′ ∩ B': (a, b) => !a && b, 'A′': a => !a, 'B′': (a, b) => !b,
  };
  const COD = { '10': [true, false], '11': [true, true], '01': [false, true], '00': [false, false] };
  const regiones = op => Object.keys(COD).filter(c => OPS[op](...COD[c]));
  const conjunto = (op, U, Aa, Bb) => U.filter(x => OPS[op](Aa.includes(x), Bb.includes(x)));
  const llaves = l => (l.length ? `{${l.join(', ')}}` : '∅');
  const pintaC = txt => txt.split(/([AB])/).filter(Boolean).map(x => (x === 'A' ? A : x === 'B' ? B : x));
  const vennDe = (U, Aa, Bb, extra = {}) => ({
    conjuntos: [{ t: 'A', color: 'o' }, { t: 'B', color: 'i' }], universo: 'U',
    regiones: Object.fromEntries(Object.entries(COD).map(([c, [a, b]]) => [c, { t: U.filter(x => Aa.includes(x) === a && Bb.includes(x) === b).join(', ') }])),
    ...extra,
  });
  // Ficha de un número en el Venn: va a su región (alg-venn.ficha) y, al soltarla en otra, toma el número de esa
  // región más cercano al actual. pertenece(n) da [en A, en B, (en C)].
  const codigoDe = l => l.map(b => (b ? '1' : '0')).join('');
  const fichaVenn = (datos, U, pertenece) => ({
    id: 'ficha', etiqueta: 'ficha del número n', color: 'c-o',
    donde: val => VENN().ficha(datos, codigoDe(pertenece(val.n))),
    mover: (pt, val) => {
      const cod = VENN().codigo(datos, pt.x, pt.y);
      if (cod === codigoDe(pertenece(val.n))) return { n: val.n };
      const ahi = U.filter(m => codigoDe(pertenece(m)) === cod).sort((u, w) => Math.abs(u - val.n) - Math.abs(w - val.n));
      return { n: ahi.length ? ahi[0] : val.n };
    },
  });
  const operaciones = {
    id: 'operaciones',
    titulo: 'Cada operación junta regiones',
    temas: ['Conjuntos y operaciones'],
    pieza: 'alg-venn',
    // Lee (fase 2): universo, regiones y nombres de las operaciones; no dice a qué es igual (A ∩ B)′.
    lee: {
      tarjetas: [
        { titulo: 'Conjuntos de cerca', texto: ['En un aula de Juliaca, ', A, ' pueden ser los que juegan fútbol y ', B, ' los que juegan vóley. El universo U es todo lo que se está mirando: el aula entera.'] },
        { titulo: 'Cuatro regiones', texto: ['Dos círculos dentro de U dejan cuatro regiones: solo ', A, ', solo ', B, ', los dos a la vez y ninguno. Cada elemento vive en una sola región.'] },
        { titulo: 'Las operaciones', texto: ['La unión ', ...pintaC('A ∪ B'), ' junta los dos. La intersección ', ...pintaC('A ∩ B'), ' deja lo común. ', ...pintaC('A − B'), ' es lo de A que no está en B. El complemento ', ...pintaC('A′'), ' es lo de U que no está en A.'] },
        { titulo: 'Qué mirar al jugar', texto: ['En el juego, ', A, ' son los pares y ', B, ' los múltiplos de 3. Elige una operación y mira qué regiones se llenan de puntitos.'] },
      ],
    },
    juega: {
      consigna: 'U = {1, …, 9}, A son los pares y B los múltiplos de 3. Elige una operación y lleva la ficha a otra región.',
      voz: 'Fíjate en qué región vive cada número.',
      controles: [
        { id: 'op', etiqueta: 'Operación', opciones: ['A ∪ B', 'A ∩ B', 'A − B', 'B − A', 'A Δ B', '(A ∪ B)′'].map(t => ({ valor: t, texto: t })) },
        { id: 'n', etiqueta: 'Número de la ficha', min: 1, max: 9, paso: 1, inicio: 4, decimales: 0 },
      ],
      dibujo: val => ({ datos: vennDe(U3, A3, B3), estado: { sombra: regiones(val.op) } }),
      lectura: val => { const c = conjunto(val.op, U3, A3, B3); return [...pintaC(val.op), ` = ${llaves(c)} · el ${val.n} ${c.includes(val.n) ? 'entra' : 'no entra'}`]; },
      minimo: 4,
      // Arrastra la ficha a otra región: pasa a seguir al número de esa región más cercano al actual.
      arrastres: [fichaVenn(vennDe(U3, A3, B3), U3, n => [A3.includes(n), B3.includes(n)])],
    },
    predice: {
      pregunta: ['¿Qué expresión da el mismo conjunto que ', ...pintaC('(A ∩ B)′'), ', el complemento de la intersección?'],
      opciones: [
        { id: 'c', texto: pintaC('A′ ∪ B′'), correcta: true },
        { id: 'morgan', texto: pintaC('A′ ∩ B′'), error: 'TAL-MORGAN', siFuera: `A′ ∩ B′ solo deja lo que está fuera de los dos: ${llaves(conjunto('A′ ∩ B′', U3, A3, B3))}.` },
        { id: 'resta', texto: pintaC('A′ ∩ B'), error: 'TAL-COMPLEMENTO', siFuera: `A′ ∩ B es ${llaves(conjunto('A′ ∩ B', U3, A3, B3))}: deja fuera los pares que no son múltiplos de 3.` },
        { id: 'union', texto: pintaC('A ∪ B'), error: 'TAL-COMPLEMENTO', siFuera: 'A ∪ B incluye al 6, que está en A ∩ B y por eso no está en su complemento.' },
      ],
      dibujo: { datos: vennDe(U3, A3, B3), estado: {} },
      revelar: { datos: vennDe(U3, A3, B3), estado: { sombra: regiones('(A ∩ B)′') } },
      coincide: 'Coincide: queda todo menos el 6, que es justo A′ ∪ B′.',
    },
    mira: {
      datos: vennDe(U3, A3, B3),
      voz: 'Creo que conviene sombrear una parte por vez.',
      pasos: [
        { estado: { sombra: regiones('A ∩ B') }, texto: 'A ∩ B: lo que está en los dos. Solo el 6.', ecuacion: [...pintaC('A ∩ B'), ` = ${llaves(conjunto('A ∩ B', U3, A3, B3))}`] },
        { estado: { sombra: regiones('(A ∩ B)′') }, texto: 'Su complemento: todo U salvo esa región.', ecuacion: [...pintaC('(A ∩ B)′'), ` = ${llaves(conjunto('(A ∩ B)′', U3, A3, B3))}`] },
        { estado: { sombra: regiones('A′') }, texto: 'Ahora, por separado: A′, lo que no es par.', ecuacion: [...pintaC('A′'), ` = ${llaves(conjunto('A′', U3, A3, B3))}`] },
        { estado: { sombra: regiones('B′') }, texto: 'B′: lo que no es múltiplo de 3.', ecuacion: [...pintaC('B′'), ` = ${llaves(conjunto('B′', U3, A3, B3))}`] },
        { estado: { sombra: regiones('A′ ∪ B′') }, texto: 'Juntas, A′ ∪ B′ cubre las mismas regiones que (A ∩ B)′.', ecuacion: [...pintaC('(A ∩ B)′'), ' = ', ...pintaC('A′ ∪ B′')] },
      ],
    },
    regla: {
      texto: 'Cada operación es un grupo de regiones del diagrama. El complemento de una intersección es la unión de los complementos, y al revés (De Morgan).',
      ecuacion: [...pintaC('(A ∩ B)′'), ' = ', ...pintaC('A′ ∪ B′')],
      condicion: 'los complementos se toman respecto del mismo universo U; A − B es lo de A que no está en B.',
    },
    // Así se resuelve (fase 2): el problema de «Ahora tú» con otras semillas; conjunto() y regiones() hacen la cuenta.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        const n = r.ent(7, 9), U = Array.from({ length: n }, (_, k) => k + 1);
        let Aa, Bb;
        do { Aa = U.filter(() => r() < 0.45); Bb = U.filter(() => r() < 0.45); } while (Aa.length < 2 || Bb.length < 2 || !Aa.some(v => Bb.includes(v)) || Aa.every(v => Bb.includes(v)));
        const op = ['A − B', 'B − A', 'A Δ B', '(A ∪ B)′', '(A ∩ B)′', 'A ∩ B'][(s + 3) % 6];
        const bien = conjunto(op, U, Aa, Bb);
        const QUE = {
          'A − B': 'se queda con lo que está en A y no está en B: la región «solo A».',
          'B − A': 'se queda con lo que está en B y no está en A: la región «solo B».',
          'A Δ B': 'junta lo que está en uno solo de los dos: «solo A» y «solo B», sin lo común.',
          '(A ∪ B)′': 'es lo de U que no está en ninguno de los dos: la región de afuera.',
          '(A ∩ B)′': 'es todo U menos lo común: todas las regiones salvo la del centro.',
          'A ∩ B': 'es lo que está en los dos a la vez: la región del centro.',
        };
        const zona = c => U.filter(v => Aa.includes(v) === COD[c][0] && Bb.includes(v) === COD[c][1]);
        const desc = v => `${Aa.includes(v) ? 'está en A' : 'no está en A'} y ${Bb.includes(v) ? 'está en B' : 'no está en B'}`;
        const fuera = U.find(v => !bien.includes(v));
        const sentido = bien.length
          ? `Compruebo: el ${bien[0]} ${desc(bien[0])}, y entra.${fuera !== undefined ? ` El ${fuera} ${desc(fuera)}, y no entra.` : ''}`
          : `Compruebo: ningún número de U cae en las regiones que pide ${op}, así que queda vacío.`;
        return {
          enunciado: [`U = {1, …, ${n}}, `, A, ` = ${llaves(Aa)} y `, B, ` = ${llaves(Bb)}. ¿Cuál es `, ...pintaC(op), '?'],
          dibujo: { datos: vennDe(U, Aa, Bb), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden los elementos de ', ...pintaC(op), ', dentro de U.'] },
            { tipo: 'datos', texto: [`U tiene los números del 1 al ${n}. Conozco `, A, ' y ', B, '; lo demás de U queda fuera de los dos.'], ecuacion: [A, ` = ${llaves(Aa)}`, '   ·   ', B, ` = ${llaves(Bb)}`] },
            { tipo: 'regla', texto: [...pintaC(op), ' ', ...pintaC(QUE[op])] },
            { tipo: 'cuentas', texto: 'Ubico cada número en su región del diagrama y me quedo con las regiones que pide la operación.',
              ecuacion: [`solo A: ${llaves(zona('10'))} · los dos: ${llaves(zona('11'))} · solo B: ${llaves(zona('01'))} · fuera: ${llaves(zona('00'))}`],
              dibujo: { datos: vennDe(U, Aa, Bb), estado: { sombra: regiones(op) } } },
            { tipo: 'sentido', texto: sentido },
          ],
          respuesta: [...pintaC(op), ` = ${llaves(bien)}`],
        };
      },
    },
    ahoraTu: {
      pieza: 'alg-venn',
      generar(s) {
        const r = azar(s);
        const n = r.ent(7, 9), U = Array.from({ length: n }, (_, k) => k + 1);
        let Aa, Bb;
        do { Aa = U.filter(() => r() < 0.45); Bb = U.filter(() => r() < 0.45); } while (Aa.length < 2 || Bb.length < 2 || !Aa.some(x => Bb.includes(x)) || Aa.every(x => Bb.includes(x)));
        const op = ['A − B', 'B − A', 'A Δ B', '(A ∪ B)′', '(A ∩ B)′', 'A ∩ B'][s % 6];
        const bien = conjunto(op, U, Aa, Bb);
        const ERR = { 'A − B': 'TAL-RESTA', 'B − A': 'TAL-RESTA', 'A Δ B': 'TAL-DELTA', '(A ∪ B)′': 'TAL-MORGAN', '(A ∩ B)′': 'TAL-MORGAN', 'A ∩ B': 'TAL-INTER', 'A ∪ B': 'TAL-UNION', '(A ∪ B)′ ': 'TAL-MORGAN' };
        const otros = ['A − B', 'B − A', 'A Δ B', 'A ∩ B', 'A ∪ B', '(A ∪ B)′', '(A ∩ B)′'].filter(o => o !== op);
        const ops = distintas([{ id: 'c', texto: llaves(bien), correcta: true }, ...otros.map((o, k) => ({ id: `d${k}`, texto: llaves(conjunto(o, U, Aa, Bb)), error: ERR[o], siFuera: `Ese conjunto sería ${o}. Revisa qué regiones pide ${op}.` }))]).slice(0, 4);
        return {
          pregunta: [`U = {1, …, ${n}}, `, A, ` = ${llaves(Aa)} y `, B, ` = ${llaves(Bb)}. ¿Cuál es `, ...pintaC(op), '?'],
          opciones: ops,
          solucion: { texto: `Se toman las regiones de ${op} y sus elementos.`, ecuacion: [...pintaC(op), ` = ${llaves(bien)}`], dibujo: { datos: vennDe(U, Aa, Bb), estado: { sombra: regiones(op) } } },
        };
      },
    },
  };

  // ---------- Idea 4: con o sin cada elemento (potencia y cardinal) ----------
  // Sin arrastre: n es un conteo y la tabla crece al doble (no hay un borde fijo que agarrar).
  // Hallazgo 9: el juego muestra los subconjuntos y «Mira» la tabla de cuentas; es la misma pieza, y la cuenta
  // resume lo que el juego dejó ver fila por fila.
  // Cambia: cuántos elementos tiene el conjunto · Permanece: la tabla «está o no está» · Progresa: el número de
  // filas, que se duplica · Se reserva: el elemento repetido que no suma · Debe verse: cada elemento nuevo duplica.
  const LETRAS = ['a', 'b', 'c'];
  const subconjuntos = n => {
    const filas = [];
    for (let m = 0; m < 2 ** n; m++) filas.push(LETRAS.slice(0, n).map((_, k) => (m >> (n - 1 - k)) & 1 ? '✓' : '·'));
    return filas;
  };
  const tablaPotencia = n => ({
    columnas: n ? LETRAS.slice(0, n) : ['∅'],
    filas: n ? subconjuntos(n) : [[{ t: 'el vacío', fuerte: true }]],
    alt: `Los ${2 ** n} subconjuntos de un conjunto de ${n} elementos: cada uno decide si está o no está`,
  });
  const potencia = {
    id: 'potencia',
    titulo: 'Con o sin cada elemento',
    temas: ['Conjunto potencia y cardinalidad'],
    pieza: 'alg-tabla',
    // Lee (fase 2): qué es un subconjunto y el conjunto potencia; no dice cómo contarlos ni qué pasa con un repetido.
    lee: {
      tarjetas: [
        { titulo: 'Elegir qué llevar', texto: 'En una feria de Puno venden papa, chuño y queso. Cada grupo que se puede formar con esos productos es un subconjunto de {papa, chuño, queso}.' },
        { titulo: 'El conjunto potencia', texto: ['El conjunto potencia de ', A, ', que se escribe P(', A, '), reúne todos los subconjuntos de ', A, '. Contarlos es una pregunta frecuente en el examen de admisión.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Cada fila de la tabla es un subconjunto: ✓ si el elemento está y un punto si no está. Agrega elementos de uno en uno y cuenta cuántas filas hay cada vez.' },
      ],
    },
    juega: {
      consigna: 'Elige el cardinal: cuántos elementos tiene el conjunto. Cada fila es un subconjunto: ✓ si el elemento está, punto si no está.',
      voz: 'Cuenta las filas cada vez que agregas un elemento.',
      controles: [{ id: 'n', etiqueta: 'Elementos', min: 0, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-o' }],
      dibujo: val => ({ datos: tablaPotencia(val.n), estado: {} }),
      lectura: val => [{ v: 'c-o', t: 'n' }, ` = ${val.n}: ${2 ** val.n} subconjuntos`],
      minimo: 3,
    },
    predice: {
      pregunta: ['A = {2, 3, 3, 5}. ¿Cuántos subconjuntos tiene ', A, '?'],
      opciones: [
        { id: 'c', texto: '8', correcta: true },
        { id: 'repetido', texto: '16', error: 'TAL-REPETIDO', siFuera: '16 sería cierto con cuatro elementos distintos. El 3 repetido es un solo elemento.' },
        { id: 'sin-vacio', texto: '7', error: 'TAL-SIN-VACIO', siFuera: '7 son los subconjuntos sin el vacío. El vacío también es subconjunto.' },
        { id: 'cuadrado', texto: '9', error: 'TAL-CUADRADO', siFuera: '9 sería 3². Cada elemento duplica: 2 · 2 · 2.' },
      ],
      dibujo: { datos: { columnas: ['2', '3', '3', '5'], filas: [['?', '?', '?', '?']], alt: 'Los elementos escritos de A: 2, 3, 3 y 5' }, estado: {} },
      revelar: { datos: Object.assign(tablaPotencia(3), { columnas: ['2', '3', '5'], alt: 'Los 8 subconjuntos de {2, 3, 5}' }), estado: {} },
      coincide: 'Coincide: A tiene 3 elementos distintos, así que 2 · 2 · 2 = 8 subconjuntos.',
    },
    mira: {
      datos: {
        columnas: ['n', 'subconjuntos', 'cuenta'], colorCol: ['o', 'd'],
        filas: [0, 1, 2, 3].map(n => [{ t: String(n), desde: n + 1 }, { t: String(2 ** n), desde: n + 1, fuerte: true }, { t: n ? `${2 ** (n - 1)} · 2` : '∅', desde: n + 1 }]),
        alt: 'Con 0, 1, 2 y 3 elementos hay 1, 2, 4 y 8 subconjuntos',
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Sin elementos hay un subconjunto: el vacío.', ecuacion: ['n(P(∅)) = 1'] },
        { estado: { corte: 2 }, texto: 'Un elemento: con él o sin él.', ecuacion: ['2'] },
        { estado: { corte: 3 }, texto: 'Cada subconjunto anterior sigue, con el nuevo o sin él.', ecuacion: ['2 · 2 = 4'] },
        { estado: { corte: 4 }, texto: 'Cada elemento nuevo duplica la cuenta.', ecuacion: [{ sup: ['2', '3'] }, ' = 8'] },
      ],
    },
    regla: {
      texto: 'Cada elemento distinto se pone o no se pone. Con n elementos distintos hay 2ⁿ subconjuntos, contando el vacío y el propio conjunto: juntos forman el conjunto potencia.',
      ecuacion: [{ llave: ['n(P(', A, '))'], nota: 'subconjuntos', color: 'c-d' }, ' = ', { llave: [{ sup: ['2', { v: 'c-o', t: 'n' }] }], nota: 'n distintos', color: 'c-o' }],
      condicion: 'n cuenta elementos distintos: {2, 3, 3, 5} tiene n = 3. En una unión, lo común se cuenta una sola vez.',
    },
    // Así se resuelve (fase 2): los dos tipos de «Ahora tú» (subconjuntos con un repetido, y la unión que no cuenta
    // dos veces lo común) con otras semillas. La figura es una tabla (la pieza de la idea), no el Venn de «Ahora tú».
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 0) {
          const k = r.ent(3, 5), base = r.mezclar([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, k).sort((u, w) => u - w);
          const rep = r.uno(base), lista = [...base, rep].sort((u, w) => u - w);
          const propios = s % 4 === 2, total = 2 ** k, bien = total - (propios ? 1 : 0);
          const dos = Array.from({ length: k }, () => '2').join(' · ');
          return {
            enunciado: [A, ` = {${lista.join(', ')}}. ¿Cuántos subconjuntos ${propios ? 'propios (distintos de A) ' : ''}tiene `, A, '?'],
            dibujo: { datos: { columnas: lista.map(String), filas: [lista.map(() => '?')], alt: `Los elementos escritos de A: ${lista.join(', ')}` }, estado: {} },
            pasos: [
              { tipo: 'pide', texto: propios ? 'Piden los subconjuntos propios: todos los subconjuntos de A, menos el mismo A.' : 'Piden cuántos subconjuntos tiene A, contando el vacío y el mismo A.' },
              { tipo: 'datos', texto: `A está escrito con ${k + 1} números, pero el ${rep} aparece dos veces y es un solo elemento.`, ecuacion: ['n(', A, `) = ${k}`] },
              { tipo: 'regla', texto: `Cada elemento distinto tiene dos opciones: está o no está en el subconjunto. Las opciones se multiplican${propios ? '; después quito el mismo A' : ''}.` },
              { tipo: 'cuentas', texto: `Multiplico un 2 por cada uno de los ${k} elementos distintos${propios ? ' y resto 1' : ''}.`,
                ecuacion: [{ sup: ['2', String(k)] }, ` = ${dos} = ${total}`, propios ? `   →   ${total} − 1 = ${bien}` : ''],
                dibujo: { datos: { columnas: base.map(String), filas: [base.map(() => ({ t: '✓ o ·', color: 'd' }))], pie: `${dos} = ${total}`, alt: `Los ${k} elementos distintos de A, cada uno con dos opciones: ${total} subconjuntos` }, estado: {} } },
              { tipo: 'sentido', texto: `Comprueba con pocos: un elemento da 2 subconjuntos, el vacío y él mismo. Cada elemento nuevo duplica: ${Array.from({ length: k }, (_, i) => 2 ** (i + 1)).join(', ')}.` },
            ],
            respuesta: `${bien} subconjuntos${propios ? ' propios' : ''}`,
          };
        }
        const nA = r.ent(8, 20), nB = r.ent(6, 18), nI = r.ent(2, Math.min(nA, nB) - 2);
        const bien = nA + nB - nI;
        const partes = ver => ({ datos: { columnas: ['solo A', 'A y B', 'solo B'], colorCol: ['o', 'd', 'i'], filas: [ver ? [String(nA - nI), String(nI), String(nB - nI)] : ['?', String(nI), '?']], pie: ver ? `${nA - nI} + ${nI} + ${nB - nI} = ${bien}` : '', alt: `Fútbol ${nA}, vóley ${nB}, ambos ${nI}` }, estado: {} });
        return {
          enunciado: ['En un aula, ', `${nA} alumnos juegan fútbol (`, A, `), ${nB} juegan vóley (`, B, `) y ${nI} juegan ambos. ¿Cuántos juegan al menos uno?`],
          dibujo: partes(false),
          pasos: [
            { tipo: 'pide', texto: ['Piden cuántos juegan al menos un deporte: el cardinal de ', A, ' ∪ ', B, '.'] },
            { tipo: 'datos', texto: `Juegan fútbol ${nA}, vóley ${nB}, y ${nI} están en los dos grupos.`, ecuacion: ['n(', A, `) = ${nA}   ·   n(`, B, `) = ${nB}   ·   n(`, A, ' ∩ ', B, `) = ${nI}`] },
            { tipo: 'regla', texto: 'Si sumo los dos grupos, los que juegan ambos quedan contados dos veces. Por eso resto lo común una sola vez.' },
            { tipo: 'cuentas', texto: 'Sumo los dos grupos y resto una vez a los que están en los dos.', ecuacion: ['n(', A, ' ∪ ', B, `) = ${nA} + ${nB} − ${nI} = ${bien}`], dibujo: partes(true) },
            { tipo: 'sentido', texto: `Comprueba por regiones: solo fútbol ${nA - nI}, ambos ${nI} y solo vóley ${nB - nI}. Sumados dan ${bien}, sin contar a nadie dos veces.` },
          ],
          respuesta: `${bien} alumnos juegan al menos uno.`,
        };
      },
    },
    ahoraTu: {
      pieza: 'alg-venn',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const k = r.ent(3, 5), base = r.mezclar([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, k).sort((x, y) => x - y);
          const rep = r.uno(base), lista = [...base, rep].sort((x, y) => x - y);
          const propios = s % 4 === 2;
          const bien = 2 ** k - (propios ? 1 : 0);
          return {
            pregunta: [A, ` = {${lista.join(', ')}}. ¿Cuántos subconjuntos ${propios ? 'propios (distintos de A) ' : ''}tiene `, A, '?'],
            opciones: distintas([
              { id: 'c', texto: f(bien), correcta: true },
              { id: 'rep', texto: f(2 ** (k + 1) - (propios ? 1 : 0)), error: 'TAL-REPETIDO', siFuera: `Sería cierto con ${k + 1} elementos distintos; el ${rep} se repite.` },
              { id: 'vacio', texto: f(propios ? 2 ** k : 2 ** k - 1), error: propios ? 'TAL-PROPIO' : 'TAL-SIN-VACIO', siFuera: propios ? 'Ese total incluye al mismo A, que no es propio.' : 'Ese total deja fuera al vacío, que también es subconjunto.' },
              { id: 'cuad', texto: f(k * k), error: 'TAL-CUADRADO', siFuera: `Eso es ${k}². Cada elemento duplica: 2 multiplicado ${k} veces.` },
            ]),
            solucion: { texto: `A tiene ${k} elementos distintos.`, ecuacion: [{ sup: ['2', String(k)] }, propios ? ` − 1 = ${bien}` : ` = ${bien}`] },
          };
        }
        const nA = r.ent(8, 20), nB = r.ent(6, 18), nI = r.ent(2, Math.min(nA, nB) - 2);
        const bien = nA + nB - nI;
        return {
          pregunta: ['En un aula, ', `${nA} alumnos juegan fútbol (`, A, `), ${nB} juegan vóley (`, B, `) y ${nI} juegan ambos. ¿Cuántos juegan al menos uno?`],
          opciones: distintas([
            { id: 'c', texto: f(bien), correcta: true },
            { id: 'suma', texto: f(nA + nB), error: 'TAL-DOBLE', siFuera: `Sería cierto si nadie jugara ambos; los ${nI} se contaron dos veces.` },
            { id: 'doble', texto: f(nA + nB - 2 * nI), error: 'TAL-DELTA', siFuera: 'Eso quita a los de ambos deportes; ellos también juegan al menos uno.' },
            { id: 'mas', texto: f(nA + nB + nI), error: 'TAL-SUMA', siFuera: 'Lo común se resta una vez, no se suma.' },
          ]),
          solucion: {
            texto: 'Sumar A y B cuenta dos veces a los de ambos.', ecuacion: ['n(', A, ' ∪ ', B, `) = ${nA} + ${nB} − ${nI} = ${bien}`],
            dibujo: { datos: { conjuntos: [{ t: 'A', color: 'o' }, { t: 'B', color: 'i' }], universo: 'U', regiones: { '10': { t: String(nA - nI) }, '11': { t: String(nI), sombra: true }, '01': { t: String(nB - nI) } } }, estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 5: un contraejemplo basta ----------
  // Cambia: la propiedad, el dominio y el testigo x (se arrastra) · Permanece: la recta con los elementos del dominio · Progresa: los puntos
  // que cumplen (verde) y los que no (rojo, huecos) · Se reserva: el único contraejemplo · Debe verse: ∀ cae con uno.
  const PRED = {
    'x > 0': x => x > 0, 'x es par': x => x % 2 === 0, 'x² ≥ x': x => x * x >= x, 'x + 1 > x': () => true,
    'x² > 0': x => x * x > 0, 'x < 4': x => x < 4, '2x > x': x => 2 * x > x, 'x² ≠ 4': x => x * x !== 4,
  };
  const DOMS = { '{−2, …, 3}': [-2, -1, 0, 1, 2, 3], '{1, …, 5}': [1, 2, 3, 4, 5] };
  const DOMS3 = Object.assign({ '{−3, …, 6}': [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6], '{2, 4, 6}': [2, 4, 6] }, DOMS);
  const x = { v: 'c-o', t: 'x' };
  // rango: { min, max } fijo para el juego (la recta no cambia de escala bajo la manija).
  const rectaDominio = (D, pr, ver = true, extra = [], rango) => ({
    min: rango ? rango.min : D[0] - 1, max: rango ? rango.max : D[D.length - 1] + 1, paso: 1, decimales: 0, variable: 'x', color: 'o', filas: 1,
    elementos: [...D.map(v => (ver ? { tipo: 'punto', x: v, color: PRED[pr](v) ? 'd' : 'h', abierto: !PRED[pr](v) } : { tipo: 'punto', x: v })), ...extra],
    alt: `Dominio ${D.join(', ')}: ${ver ? `cumplen ${pr}: ${D.filter(PRED[pr]).join(', ') || 'ninguno'}` : 'sin marcar'}`,
  });
  // El testigo: un número que el alumno pone sobre la recta (fila 1) para buscar un contraejemplo.
  const estadoTestigo = (val, doms) => (!doms[val.dom].includes(val.t) ? 'fuera' : PRED[val.pr](val.t) ? 'cumple' : 'falla');
  const rectaTestigo = (val, doms, rango) => {
    const e = estadoTestigo(val, doms);
    return rectaDominio(doms[val.dom], val.pr, true, [{ tipo: 'punto', x: val.t, fila: 1, color: e === 'cumple' ? 'd' : e === 'falla' ? 'h' : null, abierto: e !== 'cumple', rotulo: e === 'fuera' ? 'fuera del dominio' : e }], rango);
  };
  const lecturaTestigo = (val, doms) => {
    const D = doms[val.dom], k = D.filter(PRED[val.pr]).length, e = estadoTestigo(val, doms);
    // Espacios duros: la línea solo se parte en los «·», nunca dentro de «x = 2: cumple».
    return [`Cumplen ${k} de ${D.length}: ∀\u00a0${k === D.length ? 'V' : 'F'} · ∃\u00a0${k ? 'V' : 'F'} · `, x, `\u00a0=\u00a0${f(val.t)}:\u00a0${e}`];
  };
  const manijaTestigo = (doms, rango) => ({
    id: 'testigo', etiqueta: 'testigo x', color: 'c-o',
    donde: val => { const g = RECTA().geometria(rectaTestigo(val, doms, rango)); return { x: g.x(val.t), y: g.filaY(1) }; },
    mover: (pt, val) => ({ t: RECTA().geometria(rectaTestigo(val, doms, rango)).v(pt.x) }),
  });
  // Cómo se comprueba la propiedad con un número dado (para «Así se resuelve»); los números negativos van entre paréntesis.
  const fpar = v => (v < 0 ? `(${f(v)})` : f(v));
  const EXPLICA = {
    'x > 0': v => `${f(v)} ${v > 0 ? '>' : '≤'} 0`,
    'x es par': v => `${f(v)} ${v % 2 === 0 ? 'es par' : 'es impar'}`,
    'x² ≥ x': v => `${fpar(v)}² = ${f(v * v)} ${v * v >= v ? '≥' : '<'} ${f(v)}`,
    'x + 1 > x': v => `${f(v)} + 1 = ${f(v + 1)} > ${f(v)}`,
    'x² > 0': v => `${fpar(v)}² = ${f(v * v)} ${v * v > 0 ? '> 0' : 'no es mayor que 0'}`,
    'x < 4': v => `${f(v)} ${v < 4 ? '<' : '≥'} 4`,
    '2x > x': v => `2 · ${fpar(v)} = ${f(2 * v)} ${2 * v > v ? '>' : '≤'} ${f(v)}`,
    'x² ≠ 4': v => `${fpar(v)}² = ${f(v * v)} ${v * v !== 4 ? '≠ 4' : '= 4'}`,
  };
  const cuantificadores = {
    id: 'cuantificadores',
    titulo: 'Un contraejemplo basta',
    temas: ['Cuantificadores'],
    pieza: 'recta',
    // Lee (fase 2): «para todo», «existe» y dominio; no dice cómo se niega un «para todo».
    lee: {
      tarjetas: [
        { titulo: 'Todos o alguno', texto: '«Todos los alumnos del aula viven en Juliaca» habla de cada uno. «Algún alumno vive en Puno» habla de al menos uno. Esas palabras, «todos» y «alguno», son cuantificadores.' },
        { titulo: 'Los signos', texto: ['∀ se lee «para todo» y ∃ se lee «existe». Así, «∀', x, ': ', x, ' + 1 > ', x, '» dice que cada número, sumado con 1, da uno mayor.'] },
        { titulo: 'El dominio', texto: ['El dominio es el conjunto de valores que puede tomar ', x, '. La misma propiedad puede ser cierta en un dominio y falsa en otro, porque cambian los números que se revisan.'] },
        { titulo: 'Qué mirar al jugar', texto: ['En la recta, verde es que el número cumple la propiedad; rojo y hueco, que no. Arrastra el testigo ', x, ' y mira cómo cambian ∀ y ∃ en la lectura.'] },
      ],
    },
    juega: {
      consigna: 'Elige una propiedad y un dominio. En verde, los números que la cumplen; en rojo y huecos, los que no. Arrastra el testigo x.',
      voz: 'Busca una propiedad que cumplan todos.',
      controles: [
        { id: 'pr', etiqueta: 'Propiedad', opciones: ['x > 0', 'x es par', 'x² ≥ x', 'x + 1 > x'].map(t => ({ valor: t, texto: t })) },
        { id: 'dom', etiqueta: 'Dominio', opciones: Object.keys(DOMS).map(t => ({ valor: t, texto: t })) },
        { id: 't', etiqueta: 'Testigo x', color: 'c-o', min: -2, max: 5, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: val => ({ datos: rectaTestigo(val, DOMS, { min: -3, max: 6 }), estado: {} }),
      lectura: val => lecturaTestigo(val, DOMS),
      minimo: 4,
      // Arrastra el testigo por la recta: dice si ese número cumple la propiedad.
      arrastres: [manijaTestigo(DOMS, { min: -3, max: 6 })],
    },
    predice: {
      pregunta: 'En el dominio {−2, …, 3}, ¿cuál es la negación de «todo número del dominio es positivo»?',
      opciones: [
        { id: 'c', texto: 'Algún número del dominio no es positivo', correcta: true },
        { id: 'ninguno', texto: 'Ningún número del dominio es positivo', error: 'TAL-NEG-TODO', siFuera: 'Esa frase exige que todos fallen. Para negar basta que uno falle.' },
        { id: 'opuesto', texto: 'Todo número del dominio es negativo', error: 'TAL-NEG-OPUESTO', siFuera: 'El 0 no es positivo ni negativo, y basta con uno que falle.' },
        { id: 'existe', texto: 'Algún número del dominio es positivo', error: 'TAL-NEG-EXISTE', siFuera: 'Esa puede ser verdadera junto con la original; una negación nunca lo es.' },
      ],
      dibujo: { datos: rectaDominio(DOMS['{−2, …, 3}'], 'x > 0', false), estado: {} },
      revelar: { datos: rectaDominio(DOMS['{−2, …, 3}'], 'x > 0', true, [{ tipo: 'intervalo', a: -2, b: 0, ca: true, cb: true, color: 'h', rotulo: 'no positivos', fila: 1 }]), estado: {} },
      coincide: 'Coincide: −2, −1 y 0 no son positivos; con uno basta para negar el «todo».',
    },
    mira: {
      datos: rectaDominio(DOMS['{−2, …, 3}'], 'x² > 0', false, [
        ...[-2, -1, 1, 2, 3].map(v => ({ tipo: 'punto', x: v, color: 'd', desde: 2 })),
        { tipo: 'punto', x: 0, color: 'h', abierto: true, rotulo: 'falla', desde: 3, fila: 1 },
      ]),
      pasos: [
        { estado: { corte: 1 }, texto: 'Cuantificador «para todo»: cada x de {−2, …, 3} cumple x² > 0.', ecuacion: ['∀', x, ' ∈ {−2, …, 3}: ', x, '² > 0'] },
        { estado: { corte: 2 }, texto: 'Cinco números la cumplen. Eso todavía no prueba el «todo».', ecuacion: ['(−2)² = 4 > 0', '   ·   ', '…', '   ·   ', '3² = 9 > 0'] },
        { estado: { corte: 3 }, texto: 'Con x = 0: 0² = 0, que no es mayor que 0.', ecuacion: ['0² = 0'] },
        { estado: { corte: 3 }, texto: 'Un solo contraejemplo hace falsa la afirmación universal.', ecuacion: ['∃', x, ': ', x, '² ≤ 0   (', x, ' = 0)'] },
      ],
    },
    regla: {
      texto: 'Para negar «todo x cumple P» basta un x del dominio que no la cumpla. Negar «existe x que cumple P» exige que ninguno la cumpla.',
      ecuacion: ['~(∀', x, ': P(', x, '))  ≡  ', { llave: ['∃', x, ': ~P(', x, ')'], nota: 'un contraejemplo', color: 'c-h' }],
      condicion: 'el dominio es el que se declara: cambiar el dominio puede cambiar la verdad de la afirmación.',
    },
    // Así se resuelve (fase 2): el problema de «Ahora tú» con otras semillas; PRED decide cada número del dominio.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        const nombres = Object.keys(PRED), todo = s % 3 !== 2, quiere = s % 2 === 1;
        let pr, a, b, D, fallan, cumplen, verdad;
        for (let k = 0; k < 100; k++) {
          pr = nombres[(s + 3 + k) % nombres.length]; a = r.ent(-3, 1); b = a + r.ent(3, 5);
          D = Array.from({ length: b - a + 1 }, (_, i) => a + i);
          fallan = D.filter(v => !PRED[pr](v)); cumplen = D.filter(PRED[pr]);
          verdad = todo ? fallan.length === 0 : cumplen.length > 0;
          if (verdad === quiere) break;
        }
        const dom = `{${a}, …, ${b}}`.replace(/-/g, '−');
        const prop = pr.split('x').reduce((acc, t, i) => (i ? [...acc, x, t] : [t]), []);
        const lista = l => (l.length ? l.map(v => f(v)).join(', ') : 'ninguno');
        const sentido = todo
          ? (verdad ? `Compruebo los dos bordes: ${EXPLICA[pr](a)} y ${EXPLICA[pr](b)}. Los del medio también la cumplen.` : `Compruebo el contraejemplo: ${EXPLICA[pr](fallan[0])}. Con uno basta para que el «para todo» caiga.`)
          : (verdad ? `Compruebo el testigo: ${EXPLICA[pr](cumplen[0])}. Con uno basta para el «existe».` : `Compruebo los bordes: ${EXPLICA[pr](a)} y ${EXPLICA[pr](b)}. Ninguno del dominio la cumple.`);
        const resp = todo ? (verdad ? 'Verdadera: todos la cumplen.' : `Falsa: falla con x = ${f(fallan[0])}.`) : (verdad ? `Verdadera: la cumple x = ${f(cumplen[0])}.` : 'Falsa: ninguno la cumple.');
        return {
          enunciado: [todo ? '«Para todo ' : '«Existe un ', x, ` de ${dom}: `, ...prop, '». ¿Es verdadera o falsa?'],
          dibujo: { datos: rectaDominio(D, pr, false), estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden decidir si la afirmación es verdadera o falsa, revisando solo los números del dominio dado.' },
            { tipo: 'datos', texto: [`El dominio tiene ${D.length} números, del ${f(a)} al ${f(b)}. La propiedad es `, ...prop, '.'], ecuacion: [x, ` ∈ {${D.map(v => f(v)).join(', ')}}`] },
            { tipo: 'regla', texto: todo ? 'Un «para todo» es verdadero solo si ningún número del dominio falla. Un único contraejemplo lo vuelve falso.' : 'Un «existe» es verdadero si al menos un número del dominio cumple. Es falso solo si fallan todos.' },
            { tipo: 'cuentas', texto: 'Reviso los números uno por uno y separo los que cumplen de los que fallan.',
              ecuacion: [`Cumplen: ${lista(cumplen)}`, '   ·   ', `Fallan: ${lista(fallan)}`], dibujo: { datos: rectaDominio(D, pr, true), estado: {} } },
            { tipo: 'sentido', texto: sentido },
          ],
          respuesta: resp,
        };
      },
    },
    ahoraTu: {
      pieza: 'recta',
      generar(s) {
        const r = azar(s);
        // Se busca un caso cuya respuesta alterne con la semilla: así «Verdadera» y «Falsa» salen parejas.
        const nombres = Object.keys(PRED), todo = s % 3 !== 1, quiere = s % 2 === 0;
        let pr, a, b, D, fallan, cumplen, verdad;
        for (let k = 0; k < 100; k++) {
          pr = nombres[(s + k) % nombres.length]; a = r.ent(-3, 1); b = a + r.ent(3, 5);
          D = Array.from({ length: b - a + 1 }, (_, i) => a + i);
          fallan = D.filter(v => !PRED[pr](v)); cumplen = D.filter(PRED[pr]);
          verdad = todo ? fallan.length === 0 : cumplen.length > 0;
          if (verdad === quiere) break;
        }
        const dom = `{${a}, …, ${b}}`.replace(/-/g, '−');
        const porque = todo ? (verdad ? 'Todos los números del dominio la cumplen.' : `Falla con x = ${f(fallan[0])}.`) : (verdad ? `La cumple x = ${f(cumplen[0])}.` : 'Ningún número del dominio la cumple.');
        const prop = pr.split('x').reduce((acc, t, i) => (i ? [...acc, x, t] : [t]), []);
        return {
          pregunta: [todo ? '«Para todo ' : '«Existe un ', x, ` de ${dom}: `, ...prop, '». ¿Es verdadera o falsa?'],
          dibujo: { datos: rectaDominio(D, pr, false), estado: {} },
          opciones: [
            { id: 'c', texto: verdad ? 'Verdadera' : 'Falsa', correcta: true },
            { id: 'otra', texto: verdad ? 'Falsa' : 'Verdadera', error: todo ? (verdad ? 'TAL-CONTRA' : 'TAL-UNCASO') : 'TAL-EXISTE', siFuera: verdad ? `Sería falsa si ${todo ? 'algún número fallara' : 'ningún número la cumpliera'}. ${porque}` : `Sería verdadera si ${todo ? 'todos la cumplieran' : 'alguno la cumpliera'}. ${porque}` },
          ],
          solucion: { texto: porque, ecuacion: [`Cumplen: ${cumplen.length ? cumplen.map(v => f(v)).join(', ') : 'ninguno'}`], dibujo: { datos: rectaDominio(D, pr, true), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 6: seguro es «en todos los casos» ----------
  // Sin arrastre: las pistas se prenden o se apagan; las filas que quedan son resultados, no entradas.
  // Cambia: las pistas activas · Permanece: los cuatro puestos y las cuatro personas · Progresa: los órdenes que
  // sobreviven · Se reserva: la pista 3, que deja dos órdenes · Debe verse: lo seguro coincide en todas las filas.
  const PERS = ['Ana', 'Beto', 'Ciro', 'Dina'];
  const perms = l => (l.length <= 1 ? [l] : l.flatMap((y, i) => perms([...l.slice(0, i), ...l.slice(i + 1)]).map(z => [y, ...z])));
  const pos = (o, nombre) => o.indexOf(nombre);
  const PISTAS = [
    o => pos(o, 'Ana') < pos(o, 'Beto'),                    // 1: Ana va antes que Beto
    o => Math.abs(pos(o, 'Ciro') - pos(o, 'Dina')) === 1,   // 2: Ciro y Dina van juntos
    o => pos(o, 'Ana') !== 0,                               // 3: Ana no va primera
  ];
  const ordenes = act => perms(PERS).filter(o => act.every((on, k) => !on || PISTAS[k](o)));
  const MAX_FILAS = 6;
  const tablaOrdenes = (lista, extra = {}) => {
    const filas = lista.slice(0, MAX_FILAS).map(o => o.slice());
    return Object.assign({ columnas: ['1.º', '2.º', '3.º', '4.º'], filas, pie: lista.length > MAX_FILAS ? `y ${lista.length - MAX_FILAS} órdenes más` : '', alt: `${lista.length} órdenes posibles de Ana, Beto, Ciro y Dina` }, extra);
  };
  const certezas = {
    id: 'certezas',
    titulo: 'Seguro es en todos los casos',
    temas: ['Juegos lógicos: ordenamientos, parentescos y certezas'],
    pieza: 'alg-tabla',
    // Lee (fase 2): de qué tratan los juegos lógicos y cómo leer las pistas; no dice quién va último.
    lee: {
      tarjetas: [
        { titulo: 'Juegos de orden', texto: 'En el examen aparecen filas, mesas redondas y parentescos. Se dan pistas y se pregunta qué se puede asegurar. Aquí, cada fila de la tabla es un orden posible de cuatro nombres.' },
        { titulo: 'Leer bien las pistas', texto: '«Ana va antes que Beto» no dice que vaya justo antes: puede haber otros entre los dos. «Ciro y Dina van juntos» sí pide dos puestos seguidos.' },
        { titulo: 'Qué mirar al jugar', texto: 'Activa una pista y cuenta cuántos órdenes quedan. Después activa la otra. Fíjate qué puestos cambian de una fila a otra y cuáles no.' },
      ],
    },
    juega: {
      consigna: 'Cuatro amigos hacen fila. Pista 1: Ana va antes que Beto. Pista 2: Ciro y Dina van juntos. Activa pistas y mira qué órdenes quedan.',
      voz: '«Antes» no dice «justo antes». Mira las filas.',
      controles: [
        { id: 'p1', etiqueta: 'Pista 1', opciones: [{ valor: 'no', texto: 'apagada' }, { valor: 'si', texto: 'activa' }] },
        { id: 'p2', etiqueta: 'Pista 2', opciones: [{ valor: 'no', texto: 'apagada' }, { valor: 'si', texto: 'activa' }] },
      ],
      dibujo: val => ({ datos: tablaOrdenes(ordenes([val.p1 === 'si', val.p2 === 'si', false])), estado: {} }),
      lectura: val => [`Quedan ${ordenes([val.p1 === 'si', val.p2 === 'si', false]).length} órdenes posibles`],
      minimo: 3,
    },
    predice: (() => {
      const quedan = ordenes([true, true, true]);
      const seguro = af => quedan.every(af), alguna = af => quedan.some(af);
      const AF = {
        c: { texto: 'Beto va último', f: o => pos(o, 'Beto') === 3 },
        ciro: { texto: 'Ciro va primero', f: o => pos(o, 'Ciro') === 0 },
        dina: { texto: 'Dina va segunda', f: o => pos(o, 'Dina') === 1 },
        junto: { texto: 'Ana va junto a Ciro', f: o => Math.abs(pos(o, 'Ana') - pos(o, 'Ciro')) === 1 },
      };
      const contra = af => quedan.find(o => !af(o)).join(', ');
      const ops = Object.entries(AF).map(([id, a]) => (seguro(a.f) ? { id, texto: a.texto, correcta: true }
        : { id, texto: a.texto, error: alguna(a.f) ? 'TAL-UNCASO' : 'TAL-IMPOSIBLE', siFuera: `Pasa en algún orden, pero no en ${contra(a.f)}.` }));
      return {
        pregunta: 'Con las pistas 1 y 2 activas, se agrega la pista 3: Ana no va primera. ¿Qué afirmación es segura?',
        opciones: ops,
        dibujo: { datos: tablaOrdenes(ordenes([true, true, false])), estado: {} },
        revelar: { datos: tablaOrdenes(quedan, { resaltes: quedan.map((_, k) => ({ f: k, c: 3, color: 'd' })) }), estado: {} },
        coincide: `Coincide: quedan ${quedan.length} órdenes, y en todos Beto va al final.`,
      };
    })(),
    mira: (() => {
      const seis = ordenes([true, true, false]);
      const filas = seis.map(o => [...o, { t: PISTAS[2](o) ? '✓' : '✗', desde: 2, color: PISTAS[2](o) ? 'd' : 'h', fuerte: true }]);
      const vivas = seis.map((o, k) => (PISTAS[2](o) ? k : -1)).filter(k => k >= 0);
      return {
        datos: {
          columnas: ['1.º', '2.º', '3.º', '4.º', 'p3'], filas,
          resaltes: [...vivas.map(k => ({ f: k, c: 3, color: 'd', desde: 3 })), { f: vivas[0], c: 0, color: 'h', desde: 4 }],
          alt: 'Seis órdenes; la pista 3 deja dos, y en los dos Beto va cuarto',
        },
        pasos: [
          { estado: { corte: 1 }, texto: `Con las pistas 1 y 2 quedan ${seis.length} órdenes.`, ecuacion: [`${perms(PERS).length} → ${ordenes([true, false, false]).length} → ${seis.length}`] },
          { estado: { corte: 2 }, texto: 'La pista 3 descarta los órdenes con Ana primera.', ecuacion: [`${seis.length} → ${vivas.length}`] },
          { estado: { corte: 3 }, texto: 'En los que quedan, el 4.º puesto es siempre Beto: eso es seguro.', ecuacion: ['Beto 4.º en todos'] },
          { estado: { corte: 4 }, texto: 'Ciro primero pasa en un orden, no en todos: es posible, no seguro.', ecuacion: ['posible ≠ seguro'] },
        ],
      };
    })(),
    regla: {
      texto: 'Una afirmación es segura si se cumple en todos los casos que respetan las pistas. Un solo caso válido que la contradiga la descarta.',
      condicion: 'se usan solo las pistas dadas: «antes» no es «justo antes», y ningún parentesco se supone sin decirlo.',
      voz: 'Yo había mirado un solo orden. Hay que mirarlos todos.',
    },
    // Así se resuelve (fase 2): los dos tipos de «Ahora tú» con otras semillas. Parentescos: la misma cuenta de
    // generaciones (sube, baja). Ordenamientos: los 24 órdenes filtrados por las pistas, como en «Ahora tú».
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        if (s % 2 === 1) {
          const REL = { padre: [1, 0], hermano: [1, 1], hijo: [0, 1] };
          const NOMBRE = { '1,0': 'padre', '2,0': 'abuelo', '3,0': 'bisabuelo', '0,1': 'hijo', '0,2': 'nieto', '1,1': 'hermano', '2,1': 'tío', '3,1': 'tío abuelo', '2,2': 'primo', '1,2': 'sobrino' };
          const ES = { padre: 'quien te dio la vida', abuelo: 'el padre de tu padre', bisabuelo: 'el padre de tu abuelo', hijo: 'alguien a quien diste la vida', nieto: 'el hijo de tu hijo', hermano: 'otro hijo de tus padres', tío: 'el hermano de tu padre', 'tío abuelo': 'el hermano de tu abuelo', primo: 'el hijo de tu tío', sobrino: 'el hijo de tu hermano' };
          const CADENAS = [['padre', 'padre'], ['padre', 'hermano'], ['padre', 'hermano', 'hijo'], ['hermano', 'hijo'], ['hijo', 'hijo'], ['padre', 'padre', 'padre'], ['padre', 'padre', 'hermano'], ['padre', 'padre', 'hijo', 'hijo']];
          const cad = CADENAS[(Math.floor(s / 2) + 3) % CADENAS.length];
          let [u, d] = [0, 0];
          const filas = [];
          for (const k of cad) { const [ur, dr] = REL[k]; if (ur <= d) d = d - ur + dr; else { u += ur - d; d = dr; } filas.push([k, String(u), String(d)]); }
          const bien = NOMBRE[`${u},${d}`];
          const gen = k => `${k} generaci${k === 1 ? 'ón' : 'ones'}`;
          const frase = [...cad].reverse().map((k, i) => (i === 0 ? `el ${k}` : `del ${k}`)).join(' ').replace(/del (\w+)$/, 'de tu $1');
          const extra = cad.join() === 'padre,padre,hijo,hijo' ? ', si no es hijo de tus padres' : '';
          const tabla = ver => ({ datos: { columnas: ['relación', 'sube', 'baja'], colorCol: [null, 'o', 'i'], filas: ver ? filas : filas.map(([k]) => [k, '?', '?']), alt: `Cadena ${cad.join(', ')}: sube ${u} y baja ${d} generaciones` }, estado: {} });
          return {
            enunciado: `¿Qué es de ti ${frase}${extra}?`,
            dibujo: tabla(false),
            pasos: [
              { tipo: 'pide', texto: `Piden el parentesco que tiene contigo ${frase}.` },
              { tipo: 'datos', texto: `La frase se lee de atrás hacia adelante: empiezo en ti y aplico ${cad.length} relaciones en orden.`, ecuacion: [cad.join(' → ')] },
              { tipo: 'regla', texto: 'Cuento generaciones desde mí: padre sube una, hijo baja una y hermano sube una y baja una. Subir después de bajar deshace la bajada.' },
              { tipo: 'cuentas', texto: 'Anoto, relación por relación, cuántas generaciones subí y cuántas bajé en total.', ecuacion: [`sube ${u}, baja ${d}   →   ${bien}`], dibujo: tabla(true) },
              { tipo: 'sentido', texto: `Comprueba: tu ${bien} sube ${gen(u)} y baja ${gen(d)} desde ti, porque es ${ES[bien]}.` },
            ],
            respuesta: `Es tu ${bien}.`,
          };
        }
        for (let intento = 0; intento < 200; intento++) {
          const [a, b, c, dd] = r.mezclar(PERS);
          const cand = [
            { t: `${a} va antes que ${b}`, f: o => pos(o, a) < pos(o, b) },
            { t: `${c} va justo detrás de ${a}`, f: o => pos(o, c) === pos(o, a) + 1 },
            { t: `${dd} no va al final`, f: o => pos(o, dd) !== 3 },
            { t: `${b} no va al inicio`, f: o => pos(o, b) !== 0 },
            { t: `${c} y ${dd} no van juntos`, f: o => Math.abs(pos(o, c) - pos(o, dd)) !== 1 },
          ];
          const pistas = r.mezclar(cand).slice(0, 3);
          const quedan = perms(PERS).filter(o => pistas.every(pi => pi.f(o)));
          if (quedan.length < 2 || quedan.length > 4) continue;
          const afs = [];
          for (const nombre of PERS) for (let k = 0; k < 4; k++) afs.push({ t: `${nombre} va ${['1.º', '2.º', '3.º', '4.º'][k]}`, nombre, k, f: o => pos(o, nombre) === k });
          const seguras = afs.filter(af => quedan.every(af.f)), posibles = afs.filter(af => quedan.some(af.f) && !quedan.every(af.f));
          if (!seguras.length || posibles.length < 2) continue;
          const buena = r.uno(seguras), otra = r.uno(posibles), sin = quedan.find(o => !otra.f(o));
          return {
            enunciado: `Fila de cuatro: Ana, Beto, Ciro y Dina. Pistas: ${pistas.map(pi => pi.t).join('; ')}. ¿Qué puesto es seguro?`,
            dibujo: { datos: tablaOrdenes(perms(PERS)), estado: {} },
            pasos: [
              { tipo: 'pide', texto: 'Piden algo que se cumpla en todos los órdenes que respetan las tres pistas, no solo en uno.' },
              { tipo: 'datos', texto: `Con cuatro personas hay ${perms(PERS).length} órdenes posibles. Las tres pistas van descartando los que no sirven.`, ecuacion: [pistas.map(pi => pi.t).join('   ·   ')] },
              { tipo: 'regla', texto: 'Seguro quiere decir que pasa en todos los órdenes válidos. Si un orden válido lo contradice, solo es posible.' },
              { tipo: 'cuentas', texto: `Pruebo los ${perms(PERS).length} órdenes con las tres pistas y quedan ${quedan.length}. Miro cada puesto, columna por columna.`,
                ecuacion: [`${perms(PERS).length} → ${quedan.length} órdenes   ·   ${buena.t} en todos`],
                dibujo: { datos: tablaOrdenes(quedan, { resaltes: quedan.map((_, k) => ({ f: k, c: buena.k, color: 'd' })) }), estado: {} } },
              { tipo: 'sentido', texto: `Comprueba la diferencia: «${otra.t}» pasa en algún orden, pero no en ${sin.join(', ')}. Es posible, no seguro.` },
            ],
            respuesta: `Es seguro que ${buena.t}.`,
          };
        }
        throw new Error('sin ordenamiento válido');
      },
    },
    ahoraTu: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s);
        if (s % 2 === 1) {
          // Parentescos: cada relación sube u y baja d generaciones desde una persona.
          const REL = { padre: [1, 0], hermano: [1, 1], hijo: [0, 1] };
          const NOMBRE = { '1,0': 'padre', '2,0': 'abuelo', '3,0': 'bisabuelo', '0,1': 'hijo', '0,2': 'nieto', '1,1': 'hermano', '2,1': 'tío', '3,1': 'tío abuelo', '2,2': 'primo', '1,2': 'sobrino' };
          const CADENAS = [['padre', 'padre'], ['padre', 'hermano'], ['padre', 'hermano', 'hijo'], ['hermano', 'hijo'], ['hijo', 'hijo'], ['padre', 'padre', 'padre'], ['padre', 'padre', 'hermano'], ['padre', 'padre', 'hijo', 'hijo']];
          const cad = CADENAS[Math.floor(s / 2) % CADENAS.length];
          // Desde mí: sube u, baja d. Aplicar una relación (ur, dr): si ur ≤ d, sube por la misma rama; si no, por encima.
          let [u, d] = [0, 0];
          for (const k of cad) { const [ur, dr] = REL[k]; if (ur <= d) d = d - ur + dr; else { u += ur - d; d = dr; } }
          // «el hijo del hijo del padre de mi padre» puede ser yo o un primo: se pide «que no es hijo de mi padre».
          const bien = NOMBRE[`${u},${d}`];
          const gen = k => `${k} generaci${k === 1 ? 'ón' : 'ones'}`;
          const frase = [...cad].reverse().map((k, i) => (i === 0 ? `el ${k}` : `del ${k}`)).join(' ').replace(/del (\w+)$/, 'de tu $1');
                    const malos = r.mezclar(Object.entries(NOMBRE).filter(([, nm]) => nm !== bien)).slice(0, 3);
          return {
            pregunta: `¿Qué es de ti ${frase}${cad.join() === 'padre,padre,hijo,hijo' ? ', si no es hijo de tus padres' : ''}?`,
            opciones: [{ id: 'c', texto: `tu ${bien}`, correcta: true }, ...malos.map(([k, nm], i) => { const [uu, dd] = k.split(',').map(Number); return { id: `m${i}`, texto: `tu ${nm}`, error: 'TAL-PARENTESCO', siFuera: `Tu ${nm} sube ${gen(uu)} y baja ${gen(dd)} desde ti; esta cadena sube ${u} y baja ${d}.` }; })],
            solucion: { texto: `Desde ti, la cadena sube ${gen(u)} y baja ${gen(d)}.`, ecuacion: [cad.map(k => k).join(' → '), ` = ${bien}`] },
          };
        }
        // Ordenamientos: pistas al azar hasta que queden de 2 a 4 órdenes y haya una afirmación segura no dada.
        for (let intento = 0; intento < 200; intento++) {
          const [a, b, c, dd] = r.mezclar(PERS);
          const cand = [
            { t: `${a} va antes que ${b}`, f: o => pos(o, a) < pos(o, b) },
            { t: `${c} va justo detrás de ${a}`, f: o => pos(o, c) === pos(o, a) + 1 },
            { t: `${dd} no va al final`, f: o => pos(o, dd) !== 3 },
            { t: `${b} no va al inicio`, f: o => pos(o, b) !== 0 },
            { t: `${c} y ${dd} no van juntos`, f: o => Math.abs(pos(o, c) - pos(o, dd)) !== 1 },
          ];
          const pistas = r.mezclar(cand).slice(0, 3);
          const quedan = perms(PERS).filter(o => pistas.every(pi => pi.f(o)));
          if (quedan.length < 2 || quedan.length > 4) continue;
          const afs = [];
          for (const nombre of PERS) for (let k = 0; k < 4; k++) afs.push({ t: `${nombre} va ${['1.º', '2.º', '3.º', '4.º'][k]}`, f: o => pos(o, nombre) === k });
          const seguras = afs.filter(af => quedan.every(af.f)), posibles = afs.filter(af => quedan.some(af.f) && !quedan.every(af.f));
          const imposibles = afs.filter(af => !quedan.some(af.f));
          if (!seguras.length || posibles.length < 2) continue;
          const buena = r.uno(seguras), dist = [...r.mezclar(posibles).slice(0, 2), r.uno(imposibles)];
          return {
            pregunta: `Fila de cuatro. Pistas: ${pistas.map(pi => pi.t).join('; ')}. ¿Qué es seguro?`,
            opciones: [{ id: 'c', texto: buena.t, correcta: true }, ...dist.map((af, i) => ({ id: `m${i}`, texto: af.t, error: quedan.some(af.f) ? 'TAL-UNCASO' : 'TAL-IMPOSIBLE', siFuera: quedan.some(af.f) ? `Pasa en un orden válido, pero no en ${quedan.find(o => !af.f(o)).join(', ')}.` : 'No pasa en ningún orden que respete las pistas.' }))],
            solucion: { texto: `Quedan ${quedan.length} órdenes y en todos ${buena.t.replace(/ va /, ' va ')}.`, ecuacion: [`${quedan.length} órdenes válidos`], dibujo: { datos: tablaOrdenes(quedan), estado: {} } },
          };
        }
        throw new Error('sin ordenamiento válido');
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1, más rica que las ideas 1 y 2: dos fórmulas lado a lado, fila por fila, con la fila que se arrastra.
  const LISTA2 = ['p → q', 'q → p', '~q → ~p', '~p → ~q', '~p ∨ q', 'p ↔ q', 'p ∧ q', 'p ∨ q', '~(p ∧ q)', '~p ∨ ~q', 'p ∧ ~q'];
  const filaPQ = val => FILAS.findIndex(([a, b]) => VF(a) === val.p && VF(b) === val.q);
  const tablaDos = val => Object.assign(tablaFormulas([val.f1, val.f2]), { resaltes: [{ f: filaPQ(val), c: 0, ancho: 4, color: 'd' }] });
  // Mesa 2: tres conjuntos en U = {1, …, 12} y la ficha de un número que se lleva de región en región.
  const U12 = Array.from({ length: 12 }, (_, k) => k + 1);
  const en3 = n => [n % 2 === 0, n % 3 === 0, n > 6];
  const OPS3 = {
    'A ∩ B ∩ C': (a, b, c) => a && b && c, 'A ∪ B ∪ C': (a, b, c) => a || b || c, '(A ∪ B) ∩ C': (a, b, c) => (a || b) && c,
    'A ∩ (B ∪ C)': (a, b, c) => a && (b || c), 'A − (B ∪ C)': (a, b, c) => a && !(b || c), '(A ∩ B)′ ∩ C': (a, b, c) => !(a && b) && c,
  };
  const COD3 = ['000', '100', '010', '001', '110', '101', '011', '111'];
  const venn3 = () => ({
    conjuntos: [{ t: 'A', color: 'o' }, { t: 'B', color: 'i' }, { t: 'C', color: 'f' }], universo: 'U',
    regiones: Object.fromEntries(COD3.map(c => [c, { t: U12.filter(n => codigoDe(en3(n)) === c).join(', ') }])),
    alt: 'U = {1, …, 12}: A los pares, B los múltiplos de 3 y C los mayores que 6',
  });
  const LABORATORIO = [
    {
      id: 'dos-formulas', titulo: 'Dos fórmulas, fila por fila', pieza: 'alg-tabla',
      consigna: 'Elige dos fórmulas y arrastra la fila marcada. Busca dos que coincidan en las cuatro filas y dos que solo coincidan en algunas.',
      controles: [
        { id: 'f1', etiqueta: 'Fórmula 1', opciones: LISTA2.map(t => ({ valor: t, texto: t })) },
        { id: 'f2', etiqueta: 'Fórmula 2', opciones: ['~q → ~p', ...LISTA2.filter(t => t !== '~q → ~p')].map(t => ({ valor: t, texto: t })) },
        { id: 'p', etiqueta: 'p', opciones: [{ valor: 'V', texto: 'V' }, { valor: 'F', texto: 'F' }] },
        { id: 'q', etiqueta: 'q', opciones: [{ valor: 'V', texto: 'V' }, { valor: 'F', texto: 'F' }] },
      ],
      dibujo: val => ({ datos: tablaDos(val), estado: {} }),
      lectura: val => {
        const a = val.p === 'V', b = val.q === 'V', igual = FILAS.filter(([u, w]) => valor(val.f1, u, w) === valor(val.f2, u, w)).length;
        return [`Fila ${val.p}, ${val.q}: ${VF(valor(val.f1, a, b))} y ${VF(valor(val.f2, a, b))} · coinciden en ${igual} de 4`];
      },
      arrastres: [manijaFila(tablaDos, 'fila marcada: valores de p y q')],
      // Retos comprobados (docs/teoria.md §4d): cuentan con valor(), la misma tabla que pinta la pieza.
      invitaciones: [
        { texto: 'Marca la única fila donde p → q es falsa.',
          logrado: val => [val.f1, val.f2].includes('p → q') && !valor('p → q', val.p === 'V', val.q === 'V'),
          bien: 'Solo falla si prometes y no cumples: p verdadera, q falsa.' },
        { texto: 'Junta p → q y q → p, y marca una fila donde dan distinto.',
          logrado: val => [val.f1, val.f2].sort().join() === ['p → q', 'q → p'].sort().join()
            && valor(val.f1, val.p === 'V', val.q === 'V') !== valor(val.f2, val.p === 'V', val.q === 'V'),
          bien: 'La recíproca no dice lo mismo. ¿Y la contrarrecíproca, falla alguna vez?' },
        { texto: 'Busca dos fórmulas que no coincidan en ninguna fila.',
          logrado: val => FILAS.every(([a, b]) => valor(val.f1, a, b) !== valor(val.f2, a, b)),
          bien: 'Una es la negación de la otra: donde una dice V, la otra dice F.' },
        { texto: 'Junta dos fórmulas distintas, iguales en las cuatro filas, sin ninguna flecha.',
          logrado: val => val.f1 !== val.f2 && !/→|↔/.test(val.f1 + val.f2)
            && FILAS.every(([a, b]) => valor(val.f1, a, b) === valor(val.f2, a, b)),
          bien: 'Negar un «y» da un «o» de negaciones: eso es De Morgan.' },
      ],
    },
    {
      id: 'tres-conjuntos', titulo: 'Tres conjuntos y una ficha', pieza: 'alg-venn',
      consigna: 'U = {1, …, 12}: A pares, B múltiplos de 3 y C mayores que 6. Elige una operación y lleva la ficha por las regiones.',
      controles: [
        { id: 'op', etiqueta: 'Operación', opciones: Object.keys(OPS3).map(t => ({ valor: t, texto: t })) },
        { id: 'n', etiqueta: 'Número de la ficha', min: 1, max: 12, paso: 1, inicio: 6, decimales: 0 },
      ],
      dibujo: val => ({ datos: venn3(), estado: { sombra: COD3.filter(c => OPS3[val.op](...c.split('').map(d => d === '1'))) } }),
      lectura: val => {
        const S = U12.filter(n => OPS3[val.op](...en3(n)));
        return [`${val.op}: ${S.length} ${S.length === 1 ? "elemento" : "elementos"} · el ${val.n} ${S.includes(val.n) ? 'entra' : 'no entra'}`];
      },
      arrastres: [fichaVenn(venn3(), U12, en3)],
      invitaciones: [
        { texto: 'Pon la ficha en el único número que está en los tres conjuntos.',
          logrado: val => en3(val.n).every(Boolean),
          bien: 'El 12: par, múltiplo de 3 y mayor que 6 a la vez.' },
        { texto: 'Elige A − (B ∪ C) y deja la ficha dentro de la región sombreada.',
          logrado: val => val.op === 'A − (B ∪ C)' && OPS3[val.op](...en3(val.n)),
          bien: 'Pares que no son múltiplos de 3 ni pasan de 6. ¿Cuántos quedan?' },
        { texto: 'Busca la operación con más elementos y una ficha que quede fuera.',
          logrado: val => {
            const cuenta = op => U12.filter(n => OPS3[op](...en3(n))).length;
            return cuenta(val.op) === Math.max(...Object.keys(OPS3).map(cuenta)) && !OPS3[val.op](...en3(val.n));
          },
          bien: 'Ni par, ni múltiplo de 3, ni mayor que 6: queda fuera de todo.' },
        { texto: 'Guarda dos casos con la misma ficha: dentro con una operación, fuera con otra.',
          logrado: (val, guardados) => guardados.some(g => g.n === val.n && g.op !== val.op && OPS3[g.op](...en3(g.n)) !== OPS3[val.op](...en3(val.n)))
            && guardados.some(g => g.n === val.n && g.op === val.op),
          bien: 'El número no cambia de lugar; cambia qué región pinta la operación.' },
      ],
    },
    {
      id: 'contraejemplo', titulo: 'Busca el contraejemplo', pieza: 'recta',
      consigna: 'Elige una propiedad y un dominio, y arrastra el testigo x hasta encontrar un número que la rompa, si existe.',
      controles: [
        { id: 'pr', etiqueta: 'Propiedad', opciones: Object.keys(PRED).map(t => ({ valor: t, texto: t })) },
        { id: 'dom', etiqueta: 'Dominio', opciones: Object.keys(DOMS3).map(t => ({ valor: t, texto: t })) },
        { id: 't', etiqueta: 'Testigo x', color: 'c-o', min: -3, max: 6, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: val => ({ datos: rectaTestigo(val, DOMS3, { min: -4, max: 7 }), estado: {} }),
      lectura: val => lecturaTestigo(val, DOMS3),
      arrastres: [manijaTestigo(DOMS3, { min: -4, max: 7 })],
      invitaciones: [
        { texto: 'Rompe «2x > x» con un testigo del dominio.',
          logrado: val => val.pr === '2x > x' && estadoTestigo(val, DOMS3) === 'falla',
          bien: 'Con x ≤ 0 el doble no supera. Un caso basta para negar el «todo».' },
        { texto: 'Rompe «x² ≠ 4» con un testigo del dominio.',
          logrado: val => val.pr === 'x² ≠ 4' && estadoTestigo(val, DOMS3) === 'falla',
          bien: '¿Encontraste el 2 o el −2? El cuadrado esconde el signo.' },
        { texto: 'En {1, …, 5}, pon el menor testigo que rompe «x < 4».',
          logrado: val => val.pr === 'x < 4' && val.dom === '{1, …, 5}' && estadoTestigo(val, DOMS3) === 'falla'
            && val.t === Math.min(...DOMS3[val.dom].filter(v => !PRED[val.pr](v))),
          bien: 'Desde el 4 ya no se cumple. ¿Y en {−2, …, 3}?' },
        { texto: 'Halla una propiedad y un dominio donde ningún número falle, sin usar «x + 1 > x».',
          logrado: val => val.pr !== 'x + 1 > x' && DOMS3[val.dom].every(PRED[val.pr]),
          bien: 'Ahí el «para todo» es verdadero. Cambia el dominio y puede caer.' },
      ],
    },
  ];

  return {
    unidad: 'algebra.logica-y-conjuntos',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/alg-venn.js', '/nucleo/kit/piezas/recta.js'],
    laboratorio: LABORATORIO,
    // Glosario por tema (docs/teoria.md §4d): las palabras que esta unidad estrena en álgebra.
    glosario: [
      { termino: 'proposición', def: 'Frase que solo puede ser verdadera o falsa, nunca las dos cosas a la vez.',
        ejemplo: '«7 es primo» es verdadera; «¿qué hora es?» no es una proposición.', ver: ['conector', 'tabla de verdad'] },
      { termino: 'conector', def: 'Palabra o signo que une frases para formar otra: y (∧), o (∨), si… entonces (→).',
        ver: ['condicional', 'negación'] },
      { termino: 'tabla de verdad', formas: ['tabla de verdad', 'tablas de verdad'],
        def: 'Lista de cada caso de V y F de las letras, con lo que vale la fórmula en ese caso.',
        ejemplo: 'Con p y q hay 4 filas: VV, VF, FV y FF.', ver: ['tautología', 'equivalencia'] },
      { termino: 'condicional', simbolo: 'p → q', def: 'La frase «si p, entonces q». Solo es falsa cuando p es verdadera y q es falsa.',
        ejemplo: 'p = V y q = F: p → q da F.', ver: ['recíproca', 'contrarrecíproca'] },
      { termino: 'negación', simbolo: '~p', def: 'Lo que cambia la verdad de una frase: si era verdadera pasa a falsa, y al revés.',
        ver: ['contraejemplo'] },
      { termino: 'recíproca', def: 'Cambiar de lugar las dos partes de un «si…, entonces»: de p → q a q → p.',
        ver: ['contrarrecíproca'] },
      { termino: 'contrarrecíproca', def: 'Cambiar de lugar las dos partes y negarlas: de p → q a ~q → ~p. Vale siempre lo mismo.',
        ver: ['recíproca', 'equivalencia'] },
      { termino: 'contradicción', formas: ['contradicción', 'contradicciones'],
        def: 'Fórmula que da falso en todas las filas de su tabla, pase lo que pase con las letras.',
        ejemplo: 'p ∧ ~p: llueve y no llueve a la vez.', ver: ['tautología'] },
      { termino: 'tautología', def: 'Fórmula que da verdadero en todas las filas de su tabla, pase lo que pase con las letras.',
        ejemplo: 'p ∨ ~p: o llueve o no llueve.', ver: ['tabla de verdad'] },
      { termino: 'equivalencia', simbolo: '≡', formas: ['equivalencia', 'equivalencias', 'equivalente', 'equivalentes'],
        def: 'Relación entre dos fórmulas que dan el mismo valor en cada fila de la tabla.',
        ejemplo: 'p → q ≡ ~p ∨ q: coinciden en las cuatro filas.', ver: ['contrarrecíproca'] },
      { termino: 'condición suficiente', formas: ['condición suficiente', 'suficiente'],
        def: 'Lo que, si ocurre, ya asegura otra cosa. En p → q, que ocurra p basta para q.', ver: ['condición necesaria'] },
      { termino: 'condición necesaria', formas: ['condición necesaria', 'necesaria'],
        def: 'Lo que tiene que ocurrir para que ocurra otra cosa. En p → q, sin q no hay p.', ver: ['condición suficiente'] },
      { termino: 'conjunto', def: 'Grupo de objetos bien definido: siempre se puede decir si algo está o no está en él.',
        ver: ['subconjunto', 'cardinal'] },
      { termino: 'subconjunto', simbolo: '⊂', def: 'Grupo cuyos elementos están todos dentro de otro. El vacío y el mismo grupo también cuentan.',
        ejemplo: '{2, 5} está dentro de {2, 3, 5}.', ver: ['conjunto potencia'] },
      { termino: 'intersección', simbolo: '∩', def: 'Los elementos que están en los dos conjuntos a la vez.',
        ejemplo: '{1, 2, 3} ∩ {2, 3, 4} = {2, 3}.', ver: ['unión'] },
      { termino: 'unión', simbolo: '∪', def: 'Los elementos que están en un conjunto, en el otro o en ambos, contados una sola vez.',
        ejemplo: '{1, 2} ∪ {2, 3} = {1, 2, 3}.', ver: ['intersección'] },
      { termino: 'complemento', simbolo: 'A′', def: 'Lo que está en el universo pero no en el conjunto dado.',
        ejemplo: 'U = {1, …, 6} y A = {1, 2}: A′ = {3, 4, 5, 6}.', ver: ['conjunto'] },
      { termino: 'conjunto potencia', simbolo: 'P(A)', def: 'El conjunto de todos los subconjuntos de A, con el vacío y el propio A.',
        ejemplo: 'A = {2, 5}: P(A) = {∅, {2}, {5}, {2, 5}}.', ver: ['subconjunto', 'cardinal'] },
      { termino: 'cardinal', simbolo: 'n(A)', def: 'Cuántos elementos distintos tiene un conjunto.',
        ejemplo: 'n({2, 3, 3, 5}) = 3: el 3 repetido cuenta una vez.', ver: ['conjunto potencia'] },
      { termino: 'cuantificador', simbolo: '∀, ∃', def: 'Expresión que dice a cuántos del dominio les toca: «para todo» (∀) o «existe al menos uno» (∃).',
        ver: ['contraejemplo', 'dominio'] },
      { termino: 'contraejemplo', def: 'Un caso del dominio que no cumple lo afirmado. Uno solo hace falsa una frase con «para todo».',
        ejemplo: 'x = 0 hace falsa «todo x cumple x² > 0».', ver: ['cuantificador'] },
      { termino: 'dominio', def: 'El conjunto de valores que puede tomar la variable.', ejemplo: 'Dominio {1, …, 5}: x solo vale 1, 2, 3, 4 o 5.' },
    ],
    historia: {
      texto: 'En 1854, George Boole publicó Las leyes del pensamiento: trató las condiciones con un álgebra, con reglas para combinarlas. Las letras, los conectores y las tablas de verdad que usamos hoy son una presentación moderna. La idea de fondo sigue igual: revisar todos los casos posibles antes de aceptar una conclusión, aunque suene convincente.',
      pregunta: '¿Cómo sabrías que una conclusión vale siempre?',
      fuente: { titulo: 'O’Connor y Robertson, George Boole — MacTutor, Universidad de St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Boole/' },
    },
    ideas: [condicional, equivalencias, operaciones, potencia, cuantificadores, certezas],
  };
});
