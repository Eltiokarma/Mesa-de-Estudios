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
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué «si p, entonces q» no permite concluir p cuando q es verdadera.
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
  };
  const valor = (txt, a, b) => !!FORMULAS[txt](a, b);
  const columna = txt => FILAS.map(([a, b]) => valor(txt, a, b));
  const tautologia = txt => columna(txt).every(Boolean);
  // Pinta una fórmula con p y q en su color (regla 4).
  const pinta = txt => txt.split(/([pq])/).filter(Boolean).map(x => (x === 'p' ? p : x === 'q' ? q : x));
  const celdaVF = (v, o = {}) => Object.assign({ t: VF(v), color: v ? 'd' : 'h', fuerte: !v }, o);

  // ---------- Idea 1: el condicional solo falla con V → F ----------
  // Cambia: los valores de p y q y el conector · Permanece: las cuatro filas y sus colores · Progresa: la fila
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
  const condicional = {
    id: 'condicional',
    titulo: 'El condicional solo falla una vez',
    temas: ['Proposiciones y conectores', 'Condición necesaria y suficiente'],
    pieza: 'alg-tabla',
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
        { estado: { corte: 3 }, texto: 'Si p es falsa, la promesa no se pone a prueba: queda V.', ecuacion: ['F → V = V   ·   F → F = V'] },
        { estado: { corte: 4 }, texto: 'Con q verdadera hay dos filas: en una p es V; en otra, F.', ecuacion: [q, ' = V no decide el valor de ', p] },
      ],
    },
    regla: {
      texto: 'p → q solo es falsa cuando p es verdadera y q es falsa. Por eso p es suficiente para q, y q es necesaria para p.',
      ecuacion: [...pinta('p → q'), '  ≡  ', ...pinta('~p ∨ q')],
      condicion: 'se lee «si p, entonces q»; no afirma la recíproca q → p, que es otra proposición.',
      voz: 'Suficiente va antes de la flecha; necesaria, después.',
    },
    ahoraTu: {
      voz: 'Un caso nuevo. Busca un número que sirva de contraejemplo.',
      generar(s) {
        const r = azar(s);
        // Condiciones sobre n: «múltiplo de k» o «múltiplo de a y de b». Todo se decide revisando n = 1 … 600.
        const mult = k => ({ texto: `múltiplo de ${k}`, f: n => n % k === 0 });
        const tipo = s % 4;
        let X, Y;
        if (tipo === 0 || tipo === 1) { const k = r.uno([2, 3, 4, 5]), m = r.uno([2, 3, 5]); X = mult(k * m); Y = mult(k); if (tipo === 1) [X, Y] = [Y, X]; }
        else if (tipo === 2) { const [k, m] = r.uno([[4, 6], [6, 9], [4, 10], [6, 10], [9, 12], [10, 15]]); X = mult(k); Y = mult(m); }
        else { const [k, m] = r.uno([[2, 3], [3, 5], [2, 5], [3, 4], [4, 5]]); X = mult(k * m); Y = { texto: `múltiplo de ${k} y de ${m}`, f: n => n % k === 0 && n % m === 0 }; if (s % 8 === 7) [X, Y] = [Y, X]; }
        const contra = (U, V) => { for (let n = 1; n <= 600; n++) if (U.f(n) && !V.f(n)) return n; return null; };
        const nXY = contra(X, Y), nYX = contra(Y, X);       // X → Y falla en nXY; Y → X falla en nYX
        const suf = nXY === null, nec = nYX === null;
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
  // Cambia: la fórmula elegida · Permanece: las cuatro filas de p y q · Progresa: las columnas que se llenan
  // · Se reserva: la columna de ~q → ~p que copia a p → q · Debe verse: dos columnas idénticas fila por fila.
  const JUEGO2 = ['p ∧ q', 'p ∨ q', 'p → q', 'p ↔ q', 'p ∨ ~p', 'p ∧ ~p'];
  const tablaFormulas = (lista, ocultas = []) => ({
    columnas: ['p', 'q', ...lista], colorCol: ['o', 'i'],
    filas: FILAS.map(([a, b]) => [VF(a), VF(b), ...lista.map(t => celdaVF(valor(t, a, b), { desde: ocultas.includes(t) ? 1 : 0 }))]),
    alt: `Tabla de verdad de ${lista.join(', ')}`,
  });
  const equivalencias = {
    id: 'equivalencias',
    titulo: 'Misma columna, misma proposición',
    temas: ['Tautología y equivalencias'],
    pieza: 'alg-tabla',
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
        { estado: { corte: 1 }, texto: 'Primero se niegan q y p en cada fila.', ecuacion: ['~V = F   ·   ~F = V'] },
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
    ahoraTu: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s);
        const SI = ['p ∨ ~p', '(p ∧ q) → p', 'p → (p ∨ q)', '~(p ∧ ~p)', '(p ∧ (p → q)) → q', 'p → p'];
        const NO = ['p → q', 'q → p', 'p ∧ ~q', '(p ∨ q) → p', '(p → q) → p', 'q → (p ∧ q)', 'p ↔ q', 'p ∨ q'];
        const buena = SI[s % SI.length], malas = r.mezclar(NO).slice(0, 3);
        const fallo = t => { const [a, b] = FILAS.find(([x, y]) => !valor(t, x, y)); return `con p = ${VF(a)}, q = ${VF(b)}`; };
        return {
          pregunta: '¿Cuál de estas fórmulas es una tautología, es decir, verdadera en las cuatro filas?',
          opciones: [{ id: 'c', texto: pinta(buena), correcta: true }, ...malas.map((t, k) => ({ id: `m${k}`, texto: pinta(t), error: 'TAL-TAUTO', siFuera: `Sería tautología si no tuviera filas F, pero ${fallo(t)} da F.` }))],
          solucion: { texto: 'Su columna tiene V en las cuatro filas.', ecuacion: [...pinta(buena), ': V, V, V, V'], dibujo: { datos: tablaFormulas([buena]), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: una operación es un grupo de regiones ----------
  // Cambia: la operación · Permanece: U, A y B con sus elementos · Progresa: las regiones sombreadas
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
  const operaciones = {
    id: 'operaciones',
    titulo: 'Cada operación junta regiones',
    temas: ['Conjuntos y operaciones'],
    pieza: 'alg-venn',
    juega: {
      consigna: 'U = {1, …, 9}, A son los pares y B los múltiplos de 3. Elige una operación y mira qué regiones quedan sombreadas.',
      voz: 'Fíjate en qué región vive cada número.',
      controles: [{ id: 'op', etiqueta: 'Operación', opciones: ['A ∪ B', 'A ∩ B', 'A − B', 'B − A', 'A Δ B', '(A ∪ B)′'].map(t => ({ valor: t, texto: t })) }],
      dibujo: val => ({ datos: vennDe(U3, A3, B3), estado: { sombra: regiones(val.op) } }),
      lectura: val => { const c = conjunto(val.op, U3, A3, B3); return [...pintaC(val.op), ` = ${llaves(c)}: ${c.length} elementos`]; },
      minimo: 4,
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
    juega: {
      consigna: 'Elige cuántos elementos tiene el conjunto. Cada fila es un subconjunto: ✓ si el elemento está, punto si no está.',
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
      texto: 'Cada elemento distinto se pone o no se pone. Con n elementos distintos hay 2ⁿ subconjuntos, contando el vacío y el propio conjunto.',
      ecuacion: ['n(P(', A, ')) = ', { sup: ['2', { v: 'c-o', t: 'n' }] }],
      condicion: 'n cuenta elementos distintos: {2, 3, 3, 5} tiene n = 3. En una unión, lo común se cuenta una sola vez.',
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
  // Cambia: la propiedad y el dominio · Permanece: la recta con los elementos del dominio · Progresa: los puntos
  // que cumplen (verde) y los que no (rojo, huecos) · Se reserva: el único contraejemplo · Debe verse: ∀ cae con uno.
  const PRED = {
    'x > 0': x => x > 0, 'x es par': x => x % 2 === 0, 'x² ≥ x': x => x * x >= x, 'x + 1 > x': () => true,
    'x² > 0': x => x * x > 0, 'x < 4': x => x < 4, '2x > x': x => 2 * x > x, 'x² ≠ 4': x => x * x !== 4,
  };
  const DOMS = { '{−2, …, 3}': [-2, -1, 0, 1, 2, 3], '{1, …, 5}': [1, 2, 3, 4, 5] };
  const x = { v: 'c-o', t: 'x' };
  const rectaDominio = (D, pr, ver = true, extra = []) => ({
    min: D[0] - 1, max: D[D.length - 1] + 1, paso: 1, decimales: 0, variable: 'x', color: 'o', filas: 1,
    elementos: [...D.map(v => (ver ? { tipo: 'punto', x: v, color: PRED[pr](v) ? 'd' : 'h', abierto: !PRED[pr](v) } : { tipo: 'punto', x: v })), ...extra],
    alt: `Dominio ${D.join(', ')}: ${ver ? `cumplen ${pr}: ${D.filter(PRED[pr]).join(', ') || 'ninguno'}` : 'sin marcar'}`,
  });
  const cuantificadores = {
    id: 'cuantificadores',
    titulo: 'Un contraejemplo basta',
    temas: ['Cuantificadores'],
    pieza: 'recta',
    juega: {
      consigna: 'Elige una propiedad y un dominio. En verde, los números que la cumplen; en rojo y huecos, los que no.',
      voz: 'Busca una propiedad que cumplan todos.',
      controles: [
        { id: 'pr', etiqueta: 'Propiedad', opciones: ['x > 0', 'x es par', 'x² ≥ x', 'x + 1 > x'].map(t => ({ valor: t, texto: t })) },
        { id: 'dom', etiqueta: 'Dominio', opciones: Object.keys(DOMS).map(t => ({ valor: t, texto: t })) },
      ],
      dibujo: val => ({ datos: rectaDominio(DOMS[val.dom], val.pr), estado: {} }),
      lectura: val => {
        const D = DOMS[val.dom], k = D.filter(PRED[val.pr]).length;
        return [`Cumplen ${k} de ${D.length}: ∀ ${k === D.length ? 'V' : 'F'} · ∃ ${k ? 'V' : 'F'}`];
      },
      minimo: 4,
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
        { estado: { corte: 1 }, texto: 'Afirmación: para todo x de {−2, …, 3}, x² > 0.', ecuacion: ['∀', x, ' ∈ {−2, …, 3}: ', x, '² > 0'] },
        { estado: { corte: 2 }, texto: 'Cinco números la cumplen. Eso todavía no prueba el «todo».', ecuacion: ['(−2)² = 4 > 0  ·  …  ·  3² = 9 > 0'] },
        { estado: { corte: 3 }, texto: 'Con x = 0: 0² = 0, que no es mayor que 0.', ecuacion: ['0² = 0'] },
        { estado: { corte: 3 }, texto: 'Un solo contraejemplo hace falsa la afirmación universal.', ecuacion: ['∃', x, ': ', x, '² ≤ 0   (', x, ' = 0)'] },
      ],
    },
    regla: {
      texto: 'Para negar «todo x cumple P» basta un x del dominio que no la cumpla. Negar «existe x que cumple P» exige que ninguno la cumpla.',
      ecuacion: ['~(∀', x, ': P(', x, '))  ≡  ∃', x, ': ~P(', x, ')'],
      condicion: 'el dominio es el que se declara: cambiar el dominio puede cambiar la verdad de la afirmación.',
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

  return {
    unidad: 'algebra.logica-y-conjuntos',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/alg-venn.js', '/nucleo/kit/piezas/recta.js'],
    historia: {
      texto: 'En 1854, George Boole publicó Las leyes del pensamiento: trató las condiciones con un álgebra, con reglas para combinarlas. Las letras, los conectores y las tablas de verdad que usamos hoy son una presentación moderna. La idea de fondo sigue igual: revisar todos los casos posibles antes de aceptar una conclusión, aunque suene convincente.',
      pregunta: '¿Cómo sabrías que una conclusión vale siempre?',
      fuente: { titulo: 'O’Connor y Robertson, George Boole — MacTutor, Universidad de St Andrews', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Boole/' },
    },
    ideas: [condicional, equivalencias, operaciones, potencia, cuantificadores, certezas],
  };
});
