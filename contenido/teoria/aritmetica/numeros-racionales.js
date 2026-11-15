/*
 * Teoría de «Números racionales» (aritmetica.numeros-racionales). Molde: docs/teoria.md; forma de porcentajes.js.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 16) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: AR11 y AR12 de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: separar el número racional de sus escrituras (fracción, decimal, posición en la recta, otra base).
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: reconoce fracciones equivalentes, las ordena, decide si su decimal es exacto o periódico
 *     (también en otra base), halla la generatriz y distingue un irracional.
 *   Orden de atención: 1.º la tira o la recta · 2.º la tabla de la división, con el resto que se repite · acción: el botón fijo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué 0,999… o 0,2424… son fracciones y π no?».
 * Colores (regla 4): numerador naranja (c-o), denominador turquesa (c-i), el resto de la división rojo (c-h),
 * las cifras que salen verde (c-d).
 * Ronda 2 (14 nov 2026): gesto directo en las ideas 1 y 2 (tiras y recta); las ideas 3 a 5 son tablas de la cuenta
 * misma, sin nada que agarrar. Llaves en las reglas y laboratorio con tres mesas.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const a = { v: 'c-o', t: 'a' }, b = { v: 'c-i', t: 'b' }, c = { v: 'c-o', t: 'c' }, d = { v: 'c-i', t: 'd' };
  const fr = (x, y) => ({ frac: [{ v: 'c-o', t: String(x) }, { v: 'c-i', t: String(y) }] });
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
    for (const x of distractores) {
      const txt = fmt(x.valor);
      if (vistos.has(txt) || (typeof x.valor === 'number' && !Number.isFinite(x.valor))) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }
  const mcd = (x, y) => (y ? mcd(y, x % y) : Math.abs(x));
  const red = (x, y) => { const g = mcd(x, y); return [x / g, y / g]; };
  const txtFr = (x, y) => (y === 1 ? String(x) : `${x}/${y}`);
  const primos = n => { const out = []; for (let p = 2; p <= n; p++) if (n % p === 0) { out.push(p); while (n % p === 0) n /= p; } return out; };
  const DIG = '0123456789ABCDEF';
  // Gesto directo (docs/teoria.md §4b): la manija vive en las coordenadas de la pieza; mover la convierte en valores
  // con la inversa de su escala, y el lector ajusta al paso y al rango de cada control.
  const TIRAS = () => Kit.piezas['arit-tiras'], RECTA = () => Kit.piezas.recta;
  const inversa = (escala, lo, hi) => px => lo + (px - escala(lo)) * (hi - lo) / (escala(hi) - escala(lo));
  const diferencia = (x, y, z, w) => red(Math.abs(x * w - y * z), y * w);
  const cola = per => per.repeat(Math.ceil(4 / per.length));   // el período escrito hasta tener 4 cifras o más
  // División larga de x/y en base B: parte entera, cifras, dónde empieza el período (−1 si es exacto) y los restos.
  function division(x, y, B = 10, tope = 12) {
    const ent = Math.floor(x / y);
    let r = x % y;
    const cifras = [], restos = [], visto = new Map();
    while (r !== 0 && !visto.has(r) && cifras.length < tope) {
      visto.set(r, cifras.length); restos.push(r);
      cifras.push(Math.floor(r * B / y)); r = (r * B) % y;
    }
    return { ent, cifras, restos, inicio: r === 0 ? -1 : visto.has(r) ? visto.get(r) : -2, ultimo: r };
  }
  // Escritura: «0,25», «0,1666…» (el período se escribe dos veces y …).
  function decimal(x, y, B = 10) {
    const v = division(x, y, B);
    const ent = B === 10 ? String(v.ent) : v.ent.toString(B).toUpperCase();
    if (v.inicio === -1) return v.cifras.length ? `${ent},${v.cifras.map(k => DIG[k]).join('')}` : ent;
    const ante = v.cifras.slice(0, v.inicio).map(k => DIG[k]).join(''), per = v.cifras.slice(v.inicio).map(k => DIG[k]).join('');
    return `${ent},${ante}${per.length > 4 ? per : cola(per)}…`;
  }

  // ---------- Idea 1: partir distinto, misma cantidad ----------
  // Cambia: k, cuántas veces se parte cada pedazo. Permanece: el largo de la unidad y el de lo pintado.
  // Progresa: a/b → ka/kb, con más rayas y la misma longitud. Se reserva: la prueba ad = bc. Debe verse: el borde pintado no se mueve.
  const unidad = (x, y, rot, color = 'o', paso = 0) => ({
    rotulo: rot, color, paso, sinContorno: false,
    tramos: [{ valor: x / y, partes: x, color }, ...(x < y ? [{ valor: (y - x) / y, partes: y - x, color: 'i', relleno: 0.04 }] : [])],
  });
  // El juego acepta fracciones mayores que 1: la escala común llega al entero siguiente y la regla marca las unidades.
  const unidadM = (x, y, M, rot, color = 'o') => ({
    rotulo: rot, color,
    tramos: [{ valor: x / y, partes: x, color }, ...(x < M * y ? [{ valor: M - x / y, partes: M * y - x, color: 'i', relleno: 0.04 }] : [])],
  });
  const tirasEq = v => {
    const M = Math.max(1, Math.ceil(v.a / v.b));
    return { datos: { max: M, regla: { paso: 1, cada: 1 }, filas: 2, tiras: [unidadM(v.a, v.b, M, `${v.a}/${v.b}`), unidadM(v.a * v.k, v.b * v.k, M, `${v.a * v.k}/${v.b * v.k}`)] }, estado: {} };
  };
  const equivalentes = {
    id: 'equivalentes',
    titulo: 'Partir distinto, misma cantidad',
    temas: ['Racionales como clases de equivalencia'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Elige una fracción y en cuántas partes se vuelve a cortar cada pedazo. Compara las dos tiras.',
      voz: 'Mira dónde termina lo pintado en las dos tiras.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 1, max: 5, paso: 1, inicio: 2, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 2, max: 6, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'k', etiqueta: 'Cortar cada pedazo en', min: 1, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0 },
      ],
      dibujo: tirasEq,
      lectura: v => [fr(v.a, v.b), ' = ', fr(v.a * v.k, v.b * v.k), ': mismo largo pintado'],
      minimo: 3,
      // Arrastra el borde de lo pintado (a) o el primer corte de la tira de abajo (en cuántas se parte cada pedazo).
      arrastres: [
        { id: 'borde', etiqueta: 'borde de lo pintado', color: 'c-o',
          donde: v => { const g = TIRAS().geometria(tirasEq(v).datos); return { x: g.x(v.a / v.b), y: g.centroY(0) }; },
          mover: (pt, v) => ({ a: TIRAS().geometria(tirasEq(v).datos).deX(pt.x) * v.b }) },
        { id: 'corte', etiqueta: 'primer corte de la tira de abajo',
          donde: v => { const g = TIRAS().geometria(tirasEq(v).datos); return { x: g.x(1 / (v.b * v.k)), y: g.centroY(1) }; },
          mover: (pt, v) => ({ k: 1 / (Math.max(TIRAS().geometria(tirasEq(v).datos).deX(pt.x), 1e-3) * v.b) }) },
      ],
    },
    predice: {
      pregunta: ['¿Cuál de estas fracciones representa la misma cantidad que ', fr(6, 8), '?'],
      opciones: [
        { id: 'c', texto: '9/12', correcta: true },
        { id: 'suma', texto: '7/9', error: 'AT-SUMA-AMBOS', siFuera: 'Sumar 1 arriba y abajo cambia la cantidad; lo que se conserva es multiplicar o dividir.' },
        { id: 'invertida', texto: '8/6', error: 'AT-INVERTIR', siFuera: '8/6 es más que una unidad; 6/8 es menos.' },
        { id: 'resta', texto: '4/6', error: 'AT-SUMA-AMBOS', siFuera: 'Restar 2 arriba y abajo cambia la cantidad: 4/6 es menor que 6/8.' },
      ],
      dibujo: { datos: { max: 1, tiras: [unidad(6, 8, '6/8')], filas: 3 }, estado: {} },
      revelar: { datos: { max: 1, tiras: [unidad(6, 8, '6/8'), unidad(9, 12, '9/12', 'o'), unidad(7, 9, '7/9', 'h')], filas: 3 }, estado: {} },
      coincide: 'Coincide: 6/8 y 9/12 son 3/4 partido de dos maneras.',
    },
    mira: {
      datos: { max: 1, filas: 3, tiras: [unidad(6, 8, '6/8'), unidad(3, 4, '3/4', 'o', 1), unidad(9, 12, '9/12', 'o', 2)] },
      pasos: [
        { estado: { paso: 0 }, texto: '6/8: la unidad en 8 partes, 6 pintadas.', ecuacion: [fr(6, 8)] },
        { estado: { paso: 1 }, texto: 'Juntando de a dos: 4 partes, 3 pintadas. Mismo largo.', ecuacion: [fr(6, 8), ' = ', fr(3, 4)] },
        { estado: { paso: 2 }, texto: 'Partiendo cada cuarto en 3: 12 partes, 9 pintadas.', ecuacion: [fr(3, 4), ' = ', fr(9, 12)] },
        { estado: { paso: 2 }, texto: 'Prueba sin dibujo: los productos cruzados son iguales.', ecuacion: ['6 · 12 = 72 = 8 · 9'] },
      ],
    },
    regla: {
      texto: 'Dos fracciones equivalentes son el mismo número racional: sus productos cruzados son iguales. Multiplicar o dividir arriba y abajo por lo mismo no cambia la cantidad.',
      ecuacion: [{ frac: [a, b] }, ' = ', { frac: [c, d] }, '   ⇔   ', { llave: [a, ' · ', d, ' = ', b, ' · ', c], nota: 'productos cruzados' }],
      condicion: 'b y d no son cero. Sumar o restar lo mismo arriba y abajo sí cambia la cantidad.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let x = r.ent(1, 7), y = r.ent(x + 1, 9);
        [x, y] = red(x, y);
        const k = r.ent(2, 5), m = r.ent(2, 4);
        if (s % 2 === 0) return {
          pregunta: ['¿Qué número va en el recuadro? ', fr(x * m, y * m), ' = ', { frac: ['□', { v: 'c-i', t: String(y * k) }] }],
          opciones: opciones(x * k, [
            { id: 'suma', valor: x * m + (y * k - y * m), error: 'AT-SUMA-AMBOS', siFuera: 'Eso suma lo mismo que creció el denominador; hay que multiplicar.' },
            { id: 'cruz', valor: Number.isInteger(y * k * y * m / (x * m)) ? y * k * y * m / (x * m) : NaN, error: 'AT-INVERTIR', siFuera: 'Eso cruza al revés: el producto cruzado es numerador por denominador.' },
            { id: 'num', valor: x * m * k, error: 'AT-FACTOR', siFuera: 'Eso multiplica por k sin ver cuánto creció el denominador.' },
          ], n => (Number.isInteger(n) ? String(n) : f(n))),
          solucion: { texto: 'Arriba se multiplica por lo mismo que abajo.', ecuacion: [fr(x * m, y * m), ' = ', fr(x, y), ' = ', fr(x * k, y * k)] },
        };
        const [p, q] = [x * k, y * k], otra = r.de([[x + 1, y + 1], [x * k + 1, y * k], [y, x], [x * k, y * k + k]]);
        const iguales = s % 4 === 1;
        const der = iguales ? [x * m, y * m] : otra;
        return {
          pregunta: ['¿', fr(p, q), ' y ', fr(der[0], der[1]), ' representan la misma cantidad?'],
          opciones: opciones(iguales ? 'Sí' : 'No', [
            { id: 'contrario', valor: iguales ? 'No' : 'Sí', error: iguales ? 'AT-ESCRITURA' : 'AT-SUMA-AMBOS', siFuera: iguales ? 'Se escriben distinto, pero los productos cruzados coinciden.' : 'Se parecen, pero los productos cruzados no coinciden.' },
          ], String),
          solucion: { texto: 'Se comparan los productos cruzados.', ecuacion: [`${p} · ${der[1]} = ${p * der[1]}`, '   ·   ', `${q} · ${der[0]} = ${q * der[0]}`] },
        };
      },
    },
  };

  // ---------- Idea 2: clases de fracciones y orden en la recta ----------
  // Cambia: a y b, y con ellos dónde cae el punto. Permanece: la recta de 0 a 3 con sus enteros.
  // Progresa: propia (antes de 1) → aparente (en un entero) → impropia (después de 1). Se reserva: comparar dos puntos.
  // Debe verse: el orden lo dice el lugar en la recta, no el numerador.
  const clase = (x, y) => (x % y === 0 ? 'aparente' : x < y ? 'propia' : 'impropia');
  const mixta = (x, y) => (x > y && x % y ? `${Math.floor(x / y)} y ${x % y}/${y}` : '');
  // Recta con números en los enteros y, sobre ella, un punto turquesa en cada 1/partes: la unidad partida (el denominador).
  const rectaFr = (els, extra = {}, partes = 0) => Object.assign({ min: 0, max: 3, paso: 1, cada: 1, decimales: 2, variable: '', filas: 2,
    elementos: [...(partes ? [{ tipo: 'enteros', a: 0, b: extra.max || 3, cada: 1 / partes, color: 'i', fila: 0 }] : []), ...els] }, extra);
  const rectaOrden = v => ({ datos: rectaFr([{ tipo: 'punto', x: v.a / v.b, color: 'o', fila: 1, rotulo: `${v.a}/${v.b}` }], { max: 4 }, v.b), estado: {} });
  const clases = {
    id: 'orden-recta',
    titulo: 'Dónde cae la fracción',
    temas: ['Clases de fracciones', 'Orden entre fracciones'],
    pieza: 'recta',
    juega: {
      consigna: 'Elige numerador y denominador. Mira dónde cae la fracción en la recta y qué clase es.',
      voz: 'Prueba un numerador mayor que el denominador, y uno que sea múltiplo.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 1, max: 8, paso: 1, inicio: 2, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 2, max: 6, paso: 1, inicio: 3, unidad: '', decimales: 0 },
      ],
      dibujo: rectaOrden,
      lectura: v => [fr(v.a, v.b), `: ${clase(v.a, v.b)}${mixta(v.a, v.b) ? ` · ${mixta(v.a, v.b)}` : ''}`],
      minimo: 3,
      // Arrastra el punto por la recta (el numerador) o la primera parte de la unidad (el denominador).
      arrastres: [
        { id: 'punto', etiqueta: 'punto de la fracción', color: 'c-o',
          donde: v => { const g = RECTA().geometria(rectaOrden(v).datos); return { x: g.x(v.a / v.b), y: g.filaY(1) }; },
          mover: (pt, v) => ({ a: inversa(RECTA().geometria(rectaOrden(v).datos).x, 0, 4)(pt.x) * v.b }) },
        { id: 'parte', etiqueta: 'primera parte de la unidad', color: 'c-i',
          donde: v => { const g = RECTA().geometria(rectaOrden(v).datos); return { x: g.x(1 / v.b), y: g.filaY(0) }; },
          mover: (pt, v) => ({ b: 1 / Math.max(inversa(RECTA().geometria(rectaOrden(v).datos).x, 0, 4)(pt.x), 1e-3) }) },
      ],
    },
    predice: {
      pregunta: ['¿Cuál es mayor: ', fr(3, 5), ' o ', fr(4, 7), '?'],
      opciones: [
        { id: 'c', texto: '3/5', correcta: true },
        { id: 'num', texto: '4/7, porque 4 > 3', error: 'AT-NUMERADOR', siFuera: 'Sería cierto con el mismo denominador. Aquí los séptimos son más chicos que los quintos.' },
        { id: 'iguales', texto: 'Son iguales', error: 'AT-DIFERENCIA', siFuera: 'A las dos les faltan 2 y 3 partes, pero partes de distinto tamaño.' },
      ],
      dibujo: { datos: rectaFr([], { max: 1, paso: 0.1, cada: 5 }), estado: {} },
      revelar: { datos: rectaFr([{ tipo: 'punto', x: 3 / 5, color: 'o', fila: 1, rotulo: '3/5' }, { tipo: 'punto', x: 4 / 7, color: 'i', fila: 2, rotulo: '4/7' }], { max: 1, paso: 0.1, cada: 5 }), estado: {} },
      coincide: 'Coincide: 3/5 = 21/35 y 4/7 = 20/35.',
    },
    mira: {
      datos: rectaFr([{ tipo: 'punto', x: 3 / 5, color: 'o', fila: 1, rotulo: '3/5 = 21/35', desde: 1 }, { tipo: 'punto', x: 4 / 7, color: 'i', fila: 2, rotulo: '4/7 = 20/35', desde: 2 }], { max: 1 }, 35),
      pasos: [
        { estado: { corte: 0 }, texto: 'Se parte la unidad en 35: sirve para quintos y séptimos.', ecuacion: ['5 · 7 = 35'] },
        { estado: { corte: 1 }, texto: '3/5 son 21 de esas partes.', ecuacion: [fr(3, 5), ' = ', fr(21, 35)] },
        { estado: { corte: 2 }, texto: '4/7 son 20 partes: queda un poco antes.', ecuacion: [fr(4, 7), ' = ', fr(20, 35), ' < ', fr(21, 35)] },
      ],
    },
    regla: {
      texto: 'Con denominadores positivos, a/b < c/d cuando a · d < b · c. Fracción propia: menor que 1. Impropia: mayor que 1. Aparente: un entero.',
      ecuacion: [{ frac: [a, b] }, ' < ', { frac: [c, d] }, '   ⇔   ', a, ' · ', d, ' < ', b, ' · ', c],
      condicion: 'b y d positivos. Una impropia se escribe como número mixto: 7/3 = 2 y 1/3.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 3 === 2) {
          const y = r.ent(2, 7), x = r.de([r.ent(1, y - 1), y * r.ent(1, 3), y * r.ent(1, 2) + r.ent(1, y - 1)]);
          return {
            pregunta: ['¿Qué clase de fracción es ', fr(x, y), '?'],
            opciones: opciones(clase(x, y), ['propia', 'impropia', 'aparente'].filter(k => k !== clase(x, y)).map(k => ({ id: k, valor: k, error: 'AT-CLASE', siFuera: k === 'aparente' ? 'Aparente es cuando el denominador divide al numerador.' : k === 'propia' ? 'Propia es menor que 1: numerador menor que el denominador.' : 'Impropia es mayor que 1 sin ser un entero.' })), String),
            solucion: { texto: 'Se compara el numerador con el denominador.', ecuacion: [fr(x, y), ` = ${f(x / y, 3)}`] },
          };
        }
        let x1, y1, x2, y2;
        do { y1 = r.ent(3, 9); y2 = r.ent(3, 9); x1 = r.ent(1, y1 - 1); x2 = r.ent(1, y2 - 1); } while (y1 === y2 || x1 * y2 === x2 * y1 || (x1 > x2) === (x1 * y2 > x2 * y1));
        const mayor = x1 * y2 > x2 * y1 ? [x1, y1] : [x2, y2], menor = mayor[0] === x1 && mayor[1] === y1 ? [x2, y2] : [x1, y1];
        return {
          pregunta: ['¿Cuál es mayor: ', fr(x1, y1), ' o ', fr(x2, y2), '?'],
          opciones: opciones(txtFr(...mayor), [
            { id: 'num', valor: txtFr(...menor), error: 'AT-NUMERADOR', siFuera: 'Tiene el numerador mayor, pero sus partes son más chicas.' },
            { id: 'igual', valor: 'Son iguales', error: 'AT-DIFERENCIA', siFuera: 'Los productos cruzados no coinciden: no son iguales.' },
          ], String),
          solucion: { texto: 'Productos cruzados: gana el lado mayor.', ecuacion: [`${x1} · ${y2} = ${x1 * y2}`, '   ·   ', `${y1} · ${x2} = ${y1 * x2}`], dibujo: { datos: rectaFr([{ tipo: 'punto', x: x1 / y1, color: 'o', fila: 1, rotulo: `${x1}/${y1}` }, { tipo: 'punto', x: x2 / y2, color: 'i', fila: 2, rotulo: `${x2}/${y2}` }], { max: 1, paso: 0.1, cada: 5 }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: el resto se repite, el decimal se repite ----------
  // Cambia: a/b. Permanece: la tabla de la división (resto → cifra). Progresa: fila por fila hasta resto 0 o un resto repetido.
  // Se reserva: el resto que vuelve. Debe verse: con denominador b solo hay b − 1 restos posibles.
  const tablaDiv = (x, y, B = 10, pasoFin = 0) => {
    const v = division(x, y, B, 8);
    const filas = v.cifras.map((k, i) => [String(i + 1), { t: String(v.restos[i]), color: 'h', resalta: v.inicio >= 0 && v.restos[i] === v.ultimo }, `${v.restos[i]} · ${B} = ${v.restos[i] * B}`, { t: DIG[k], color: 'd' }]);
    return { columnas: [{ t: 'n.º' }, { t: 'resto', color: 'h' }, { t: `por ${B}` }, { t: 'cifra', color: 'd' }], filas, filasMax: 8 };
  };
  const tipoDec = (x, y) => { const v = division(x, y); return v.inicio === -1 ? 'exacto' : v.inicio === 0 ? 'periódico puro' : 'periódico mixto'; };
  const decimales = {
    id: 'exacto-periodico',
    titulo: 'Exacto o periódico',
    temas: ['Decimales exactos y periódicos', 'Racionales e irracionales'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Elige a y b. La tabla hace la división: cada resto por 10 da la cifra siguiente. Mira si un resto vuelve.',
      voz: 'Cuando un resto se repite, todo lo que sigue se repite.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 1, max: 12, paso: 1, inicio: 1, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 2, max: 15, paso: 1, inicio: 6, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaDiv(v.a, v.b), estado: {} }),
      lectura: v => [fr(v.a, v.b), ` = ${decimal(v.a, v.b)} · ${tipoDec(v.a, v.b)}`],
      minimo: 4,
    },
    predice: {
      pregunta: '¿Cuál de estas fracciones da un decimal exacto?',
      opciones: [
        { id: 'c', texto: '7/40', correcta: true },
        { id: 'par', texto: '1/6', error: 'AT-PAR', siFuera: 'Tener denominador par no basta: el 3 de 6 = 2 · 3 hace que se repita.' },
        { id: 'chico', texto: '2/7', error: 'AT-CHICO', siFuera: 'Un denominador chico no asegura nada: 7 no es 2 ni 5.' },
        { id: 'cinco', texto: '4/15', error: 'AT-PAR', siFuera: 'Tiene un 5, pero también un 3: 15 = 3 · 5.' },
      ],
      dibujo: { datos: { columnas: [{ t: 'fracción' }, { t: 'denominador' }], filas: [['7/40', '40'], ['1/6', '6'], ['2/7', '7'], ['4/15', '15']], filasMax: 4 }, estado: {} },
      revelar: { datos: { columnas: [{ t: 'fracción' }, { t: 'denominador' }, { t: 'decimal', color: 'd' }], filas: [['7/40', '2³ · 5', { t: decimal(7, 40), color: 'd', resalta: true }], ['1/6', '2 · 3', decimal(1, 6)], ['2/7', '7', decimal(2, 7)], ['4/15', '3 · 5', decimal(4, 15)]], filasMax: 4 }, estado: {} },
      coincide: 'Coincide: 40 = 2³ · 5 solo tiene los primos de 10.',
    },
    mira: {
      datos: tablaDiv(1, 6),
      pasos: [
        { estado: { fila: 0 }, texto: '1 entre 6: resto 1, por 10 da 10; cabe 1 vez.', ecuacion: ['10 = 1 · 6 + 4'] },
        { estado: { fila: 1 }, texto: 'Resto 4, por 10 da 40: cabe 6 veces y sobran 4.', ecuacion: ['40 = 6 · 6 + 4'] },
        { estado: { fila: 1 }, texto: 'El resto 4 volvió: la cifra 6 se repite para siempre.', ecuacion: [fr(1, 6), ' = 0,1666…'] },
        { estado: {}, texto: 'Con divisor 6 solo hay 5 restos posibles: o sale 0, o uno vuelve.', ecuacion: ['restos posibles: 1, 2, 3, 4, 5'] },
      ],
    },
    regla: {
      texto: 'Toda fracción da un decimal exacto o periódico. Es exacto si, ya simplificada, su denominador solo tiene los primos 2 y 5. Un decimal infinito sin período es irracional.',
      ecuacion: [{ frac: [a, b] }, ' exacto   ⇔   ', b, ' = ', { llave: [{ sup: ['2', 'm'] }, ' · ', { sup: ['5', 'n'] }], nota: 'solo 2 y 5', color: 'c-i' }],
      condicion: 'la fracción está simplificada. Irracionales como √2 o π no son cociente de enteros.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 3 === 2) {
          const irr = r.de(['0,1010010001…', '√2 = 1,4142…', 'π = 3,1415…', '0,123456789101112…']);
          return {
            pregunta: '¿Cuál de estos números NO se puede escribir como fracción de enteros?',
            opciones: opciones(irr, [
              { id: 'per', valor: r.de(['0,333…', '0,1212…', '2,0555…']), error: 'AT-INFINITO', siFuera: 'Es infinito, pero periódico: tiene generatriz.' },
              { id: 'exacto', valor: r.de(['1,25', '0,875', '3,04']), error: 'AT-INFINITO', siFuera: 'Es un decimal exacto: es una fracción con denominador 100 o 1000.' },
              { id: 'frac', valor: '22/7', error: 'AT-PI', siFuera: '22/7 es una fracción: se parece a π, pero no es π.' },
            ], String),
            solucion: { texto: 'Infinito y sin período: es irracional.', ecuacion: [irr] },
          };
        }
        let x, y;
        do { y = r.de([4, 6, 8, 9, 11, 12, 14, 15, 16, 20, 22, 24, 25, 30, 40]); x = r.ent(1, y - 1); } while (mcd(x, y) !== 1);
        const t = tipoDec(x, y);
        return {
          pregunta: ['¿Qué decimal da ', fr(x, y), '?'],
          opciones: opciones(t, ['exacto', 'periódico puro', 'periódico mixto'].filter(k => k !== t).map(k => ({ id: k.replace(' ', '-'), valor: k, error: 'AT-PAR', siFuera: k === 'exacto' ? 'Para ser exacto, el denominador solo puede tener 2 y 5.' : k === 'periódico puro' ? 'Si el denominador tiene 2 o 5 además de otros primos, el período no empieza enseguida.' : 'Sin 2 ni 5 en el denominador, el período empieza enseguida.' })), String),
          solucion: { texto: `El denominador es ${y} = ${primos(y).join(' · ')} en primos.`, ecuacion: [fr(x, y), ` = ${decimal(x, y)}`], dibujo: { datos: tablaDiv(x, y), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 4: la generatriz se obtiene alineando y restando ----------
  // Cambia: el período y si hay una cifra antes. Permanece: la tabla de dos filas que se restan.
  // Progresa: x → 10ᵏx → la resta deja un entero. Se reserva: la simplificación final. Debe verse: las colas iguales se cancelan.
  function generatriz(ante, per) {   // ante: cifras antes del período ('' o '1'), per: cifras del período
    const k = ante.length, p = per.length;
    const num = Number(ante + per) - (k ? Number(ante) : 0), den = Number('9'.repeat(p) + '0'.repeat(k));
    return { num, den, red: red(num, den), xs: `0,${ante}${cola(per)}…`, k, p };
  }
  const tablaGen = (ante, per) => {
    const g = generatriz(ante, per), cl = `${cola(per)}…`;
    const alto = `${ante}${per}`.replace(/^0+(?=\d)/, '') || '0';
    const filas = [[{ t: `${10 ** (g.k + g.p)} x` }, { t: `${alto},${cl}` }]];
    filas.push([{ t: g.k ? `${10 ** g.k} x` : 'x' }, { t: `${g.k ? Number(ante) : 0},${cl}` }]);
    filas.push([{ t: `${g.den} x`, color: 'd', paso: 1 }, { t: String(g.num), color: 'd', resalta: true, paso: 1 }]);
    return { columnas: [{ t: 'se multiplica' }, { t: 'queda' }], filas, filasMax: 3 };
  };
  // Si la cifra de antes es igual al período, el decimal es puro (0,555… = 0,5̄): se trata como puro.
  const anteDe = v => (v.ante === 'nada' || v.ante === String(v.p) ? '' : v.ante);
  const genIdea = {
    id: 'generatriz',
    titulo: 'Alinear las colas y restar',
    temas: ['Fracción generatriz'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Elige el período y si hay una cifra antes. Se multiplica x hasta que las dos colas queden alineadas.',
      voz: 'Las colas que se repiten se restan y desaparecen.',
      controles: [
        { id: 'p', etiqueta: 'Período', color: 'c-d', min: 1, max: 9, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'ante', etiqueta: 'Antes del período', opciones: [{ valor: 'nada', texto: 'nada' }, { valor: '1', texto: '1' }, { valor: '5', texto: '5' }] },
      ],
      dibujo: v => ({ datos: tablaGen(anteDe(v), String(v.p)), estado: { paso: 1 } }),
      lectura: v => { const g = generatriz(anteDe(v), String(v.p)); return [`x = ${g.xs} = ${g.num}/${g.den} = ${txtFr(...g.red)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: '¿Qué fracción es x = 0,242424…?',
      opciones: [
        { id: 'c', texto: '8/33', correcta: true },
        { id: 'corta', texto: '6/25', error: 'AT-CORTAR', siFuera: '6/25 = 0,24 exacto: sería cierto si el decimal terminara.' },
        { id: 'mixto', texto: '4/15', error: 'AT-GENERATRIZ', siFuera: '4/15 = 24/90 es la regla de un período mixto; aquí el período empieza enseguida.' },
        { id: 'nueve', texto: '8/3', error: 'AT-GENERATRIZ', siFuera: '24/9 usa un 9 por dos cifras de período; van dos nueves.' },
      ],
      dibujo: { datos: tablaGen('', '24'), estado: { paso: 0 } },
      revelar: { datos: tablaGen('', '24'), estado: { paso: 1 } },
      coincide: 'Coincide: 99x = 24, y 24/99 se simplifica a 8/33.',
    },
    mira: {
      datos: tablaGen('', '24'),
      pasos: [
        { estado: { paso: 0, fila: 1 }, texto: 'El período 24 tiene dos cifras.', ecuacion: ['x = 0,242424…'] },
        { estado: { paso: 0, fila: 0 }, texto: 'Por 100, la coma salta dos cifras y la cola queda igual.', ecuacion: ['100x = 24,2424…'] },
        { estado: { paso: 1, fila: 2 }, texto: 'Restando, las colas se cancelan: queda un entero.', ecuacion: ['100x − x = 99x = 24'] },
        { estado: { paso: 1, fila: 2 }, texto: 'Se despeja y se simplifica.', ecuacion: ['x = ', { frac: ['24', '99'] }, ' = ', { frac: ['8', '33'] }] },
      ],
    },
    regla: {
      texto: 'Periódico puro: el período sobre tantos 9 como cifras tiene. Periódico mixto: lo que hay hasta el período, menos lo de antes, sobre tantos 9 y tantos 0.',
      ecuacion: ['0,1666… = ', { llave: [{ frac: ['16 − 1', '90'] }], nota: 'nueves y ceros' }, ' = ', { frac: ['1', '6'] }],
      condicion: 'el decimal es periódico. Un período de 9 da un número exacto: 0,999… = 1.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), mixto = s % 2 === 1;
        let ante = mixto ? String(r.ent(1, 8)) : '';
        let per = String(r.ent(1, 8));
        if (s % 3 === 0) per = String(r.ent(10, 98)).replace(/(\d)\1/, '$12');
        if (ante && per[0] === ante) per = String((+per[0] % 8) + 1) + per.slice(1);
        if (ante && per.endsWith(ante)) ante = String((+ante % 8) + 1);   // si no, el período sería otro (puro)
        const g = generatriz(ante, per), [n, m] = g.red;
        const corta = red(Number(ante + per), 10 ** (ante.length + per.length));
        const otra = mixto ? red(Number(ante + per), Number('9'.repeat(per.length + ante.length))) : red(Number(per) - 0, Number('9'.repeat(per.length) + '0'));
        return {
          pregunta: `¿Qué fracción es x = ${g.xs}?`,
          opciones: opciones(txtFr(n, m), [
            { id: 'corta', valor: txtFr(...corta), error: 'AT-CORTAR', siFuera: 'Esa es la fracción del decimal cortado; el período sigue.' },
            { id: 'regla', valor: txtFr(...otra), error: 'AT-GENERATRIZ', siFuera: mixto ? 'Esa regla es de período puro; aquí hay una cifra antes del período.' : 'Esa regla es de período mixto; aquí el período empieza enseguida.' },
            { id: 'nueves', valor: txtFr(...red(g.num, Number('9'.repeat(Math.max(1, g.p - 1)) + '0'.repeat(g.k)) * (g.p > 1 ? 1 : 10))), error: 'AT-GENERATRIZ', siFuera: 'Va un 9 por cada cifra del período.' },
          ], String),
          solucion: { texto: 'Se alinean las colas y se restan.', ecuacion: [`x = ${g.num}/${g.den}${g.num === n ? '' : ` = ${txtFr(n, m)}`}`], dibujo: { datos: tablaGen(ante, per), estado: { paso: 1 } } },
        };
      },
    },
  };

  // ---------- Idea 5: en otra base, exacto depende de los primos de la base ----------
  // Cambia: la base. Permanece: la fracción 1/n y la tabla de la división. Progresa: resto por B → cifra en base B.
  // Se reserva: 1/3 en base 6, exacto. Debe verse: lo que decide es si los primos de n dividen a la base.
  const otras = {
    id: 'otras-bases',
    titulo: 'Exacto según la base',
    temas: ['Números en otras bases'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Elige la fracción 1/n y la base. La tabla multiplica cada resto por la base para sacar la cifra siguiente.',
      voz: 'Compara los primos de n con los primos de la base.',
      controles: [
        { id: 'n', etiqueta: 'n', color: 'c-i', min: 2, max: 12, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'B', etiqueta: 'Base', min: 2, max: 10, paso: 1, inicio: 10, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaDiv(1, v.n, v.B), estado: {} }),
      lectura: v => [`1/${v.n} en base ${v.B} = ${decimal(1, v.n, v.B)}`],
      minimo: 4,
    },
    predice: {
      pregunta: 'En base 10, 1/3 = 0,333… es periódico. ¿Cómo se escribe 1/3 en base 6?',
      opciones: [
        { id: 'c', texto: '0,2 exacto', correcta: true },
        { id: 'igual', texto: '0,333… igual que en base 10', error: 'AT-BASE10', siFuera: 'Sería cierto si la base fuera 10; en base 6 se multiplica por 6.' },
        { id: 'tres', texto: '0,3 exacto', error: 'AT-BASE10', siFuera: '0,3 en base 6 es 3/6 = 1/2, no 1/3.' },
        { id: 'uno', texto: '0,111… periódico', error: 'AT-BASE10', siFuera: '0,111… en base 6 es 1/5.' },
      ],
      dibujo: { datos: tablaDiv(1, 3, 10), estado: {} },
      revelar: { datos: tablaDiv(1, 3, 6), estado: { fila: 0 } },
      coincide: 'Coincide: 1 · 6 = 6 = 2 · 3, resto 0. Sale una sola cifra.',
    },
    mira: {
      datos: tablaDiv(1, 3, 6),
      pasos: [
        { estado: {}, texto: 'En base 6, cada resto se multiplica por 6.', ecuacion: ['1 · 6 = 6'] },
        { estado: { fila: 0 }, texto: '6 entre 3 cabe 2 veces y no sobra: la cifra es 2.', ecuacion: ['6 = 2 · 3 + 0'] },
        { estado: { fila: 0 }, texto: 'Es exacto porque el primo 3 divide a la base 6.', ecuacion: [{ frac: ['1', '3'] }, ' = ', { sub: ['0,2', '6'] }, ' = ', { frac: ['2', '6'] }] },
      ],
    },
    regla: {
      texto: 'Una fracción simplificada tiene expansión exacta en base B si cada primo de su denominador divide a B. Las cifras salen multiplicando el resto por B.',
      ecuacion: [{ sub: ['0,xy', 'B'] }, ' = ', { llave: [{ frac: ['x', 'B'] }], nota: 'cifra 1' }, ' + ', { llave: [{ frac: ['y', { sup: ['B', '2'] }] }], nota: 'cifra 2' }],
      condicion: 'la fracción está simplificada y B es un entero mayor que 1. En base 10 los primos son 2 y 5.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          const B = r.de([2, 3, 4, 5, 6, 8]), x = r.ent(1, B - 1), y = r.ent(0, B - 1);
          const [n, m] = red(x * B + y, B * B);
          return {
            pregunta: `¿Qué fracción es 0,${x}${y} en base ${B}?`,
            opciones: opciones(txtFr(n, m), [
              { id: 'b10', valor: txtFr(...red(10 * x + y, 100)), error: 'AT-BASE10', siFuera: 'Eso lee el número como si estuviera en base 10.' },
              { id: 'sin-cuadrado', valor: txtFr(...red(x + y, B)), error: 'AT-POSICION', siFuera: `La segunda cifra vale entre ${B}², no entre ${B}.` },
              { id: 'b', valor: txtFr(...red(x * B + y, B * B * B)), error: 'AT-POSICION', siFuera: 'Las posiciones son B y B², no una más.' },
            ], String),
            solucion: { texto: 'Cada cifra se divide entre su potencia de la base.', ecuacion: [`${x}/${B} + ${y}/${B * B} = ${x * B + y}/${B * B} = ${txtFr(n, m)}`] },
          };
        }
        const B = r.de([2, 3, 4, 5, 6, 7, 8, 9, 12]);
        let n;
        do { n = r.ent(2, 15); } while (n === B);
        const exacto = primos(n).every(p => B % p === 0);
        return {
          pregunta: `¿La fracción 1/${n} tiene expansión exacta en base ${B}?`,
          opciones: opciones(exacto ? 'Sí, exacta' : 'No, periódica', [
            { id: 'contrario', valor: exacto ? 'No, periódica' : 'Sí, exacta', error: 'AT-BASE10', siFuera: exacto ? `Los primos de ${n} dividen a ${B}: termina.` : `Algún primo de ${n} no divide a ${B}: se repite.` },
            { id: 'b10', valor: 'Igual que en base 10', error: 'AT-BASE10', siFuera: 'Lo que decide son los primos de la base, que cambió.' },
          ], String),
          solucion: { texto: `Primos de ${n}: ${primos(n).join(', ')}. Primos de ${B}: ${primos(B).join(', ')}.`, ecuacion: [`1/${n} = ${decimal(1, n, B)} en base ${B}`], dibujo: { datos: tablaDiv(1, n, B), estado: {} } },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Las ideas 1 y 2 muestran una fracción; aquí se ponen dos juntas para compararlas (en tiras y en la recta, con
  // fracciones mayores que 1). La división junta numerador, denominador y base, que las ideas 3 y 5 mueven por separado.
  const signo = v => (v.a * v.d === v.b * v.c ? '=' : v.a * v.d < v.b * v.c ? '<' : '>');
  const dosTiras = v => {
    const M = Math.max(1, Math.ceil(v.a / v.b), Math.ceil(v.c / v.d));
    return { datos: { max: M, regla: { paso: 1, cada: 1 }, filas: 2, tiras: [unidadM(v.a, v.b, M, `${v.a}/${v.b}`), unidadM(v.c, v.d, M, `${v.c}/${v.d}`)] }, estado: {} };
  };
  const dosPuntos = v => ({ datos: rectaFr([
    { tipo: 'punto', x: v.a / v.b, color: 'o', fila: 1, rotulo: `${v.a}/${v.b}` },
    { tipo: 'punto', x: v.c / v.d, color: 'o', fila: 2, rotulo: `${v.c}/${v.d}` },
  ], { max: 4 }), estado: {} });
  // Para los retos: la menor separación no nula entre dos fracciones de la recta (denominadores de 2 a 8), y si la
  // división en base B termina. Los calcula el motor.
  const sep = v => diferencia(v.a, v.b, v.c, v.d);
  let MINSEP = [1, 1];
  for (let b1 = 2; b1 <= 8; b1++) for (let b2 = 2; b2 <= 8; b2++) for (let a1 = 1; a1 <= 16; a1++) for (let a2 = 1; a2 <= 16; a2++) {
    const [n, m] = diferencia(a1, b1, a2, b2);
    if (n > 0 && n * MINSEP[1] < m * MINSEP[0]) MINSEP = [n, m];
  }
  const exacta = v => division(v.a, v.b, v.B).inicio === -1;
  const mismo = (g, v, ks) => g.some(x => ks.every(k => x[k] === v[k]));
  const laboratorio = [
    {
      id: 'dos-tiras', titulo: 'Dos fracciones en tiras', pieza: 'arit-tiras',
      consigna: 'Elige dos fracciones, también mayores que 1. Arrastra el borde pintado de cada tira y compara los largos.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 1, max: 9, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 2, max: 9, paso: 1, inicio: 4, unidad: '', decimales: 0 },
        { id: 'c', etiqueta: 'c', color: 'c-o', min: 1, max: 9, paso: 1, inicio: 2, unidad: '', decimales: 0 },
        { id: 'd', etiqueta: 'd', color: 'c-i', min: 2, max: 9, paso: 1, inicio: 3, unidad: '', decimales: 0 },
      ],
      dibujo: dosTiras,
      lectura: v => [fr(v.a, v.b), ` ${signo(v)} `, fr(v.c, v.d), ` · cruzados ${v.a * v.d} y ${v.b * v.c}`],
      invitaciones: [
        { texto: 'Arma dos fracciones escritas distinto que den el mismo largo.',
          logrado: v => signo(v) === '=' && (v.a !== v.c || v.b !== v.d),
          bien: 'Otra partición, el mismo número racional. Comprueba los productos cruzados.' },
        { texto: 'Haz que la fracción de numerador mayor sea la tira más corta.',
          logrado: v => (v.a > v.c && signo(v) === '<') || (v.c > v.a && signo(v) === '>'),
          bien: 'El numerador solo no decide: importa en cuántas partes se cortó.' },
        { texto: 'Haz que una tira pase de una unidad y la otra no llegue.',
          logrado: v => (v.a > v.b && v.c < v.d) || (v.c > v.d && v.a < v.b),
          bien: 'La impropia pasa de 1: se puede escribir como número mixto.' },
      ],
      arrastres: [
        { id: 'borde-1', etiqueta: 'borde pintado de la primera tira', color: 'c-o',
          donde: v => { const g = TIRAS().geometria(dosTiras(v).datos); return { x: g.x(v.a / v.b), y: g.centroY(0) }; },
          mover: (pt, v) => ({ a: TIRAS().geometria(dosTiras(v).datos).deX(pt.x) * v.b }) },
        { id: 'borde-2', etiqueta: 'borde pintado de la segunda tira', color: 'c-o',
          donde: v => { const g = TIRAS().geometria(dosTiras(v).datos); return { x: g.x(v.c / v.d), y: g.centroY(1) }; },
          mover: (pt, v) => ({ c: TIRAS().geometria(dosTiras(v).datos).deX(pt.x) * v.d }) },
      ],
    },
    {
      id: 'dos-puntos', titulo: 'Dos fracciones en la recta', pieza: 'recta',
      consigna: 'Ubica dos fracciones en la recta de 0 a 4. Arrastra cada punto y mira cuánto las separa.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 1, max: 16, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 2, max: 8, paso: 1, inicio: 5, unidad: '', decimales: 0 },
        { id: 'c', etiqueta: 'c', color: 'c-o', min: 1, max: 16, paso: 1, inicio: 4, unidad: '', decimales: 0 },
        { id: 'd', etiqueta: 'd', color: 'c-i', min: 2, max: 8, paso: 1, inicio: 7, unidad: '', decimales: 0 },
      ],
      dibujo: dosPuntos,
      lectura: v => [fr(v.a, v.b), ` ${signo(v)} `, fr(v.c, v.d), ` · las separa ${txtFr(...diferencia(v.a, v.b, v.c, v.d))}`],
      invitaciones: [
        { texto: 'Busca dos fracciones distintas, lo más cercanas posible sin ser iguales.',
          logrado: v => { const [n, m] = sep(v); return n > 0 && n * MINSEP[1] === m * MINSEP[0]; },
          bien: 'Más cerca no se puede con estos denominadores. ¿Y si partes en más?' },
        { texto: 'Ubica dos fracciones separadas justo por media unidad.',
          logrado: v => { const [n, m] = sep(v); return n === 1 && m === 2; },
          bien: 'Media unidad entre ellas: compruébalo con un denominador común.' },
        { texto: 'Pon las dos fracciones, escritas distinto, sobre el mismo entero.',
          logrado: v => v.a % v.b === 0 && v.c % v.d === 0 && sep(v)[0] === 0 && v.b !== v.d,
          bien: 'Dos fracciones aparentes: el mismo entero escrito de dos maneras.' },
        { texto: 'Guarda dos casos con la misma separación y fracciones distintas.',
          logrado: (v, g) => mismo(g, v, ['a', 'b', 'c', 'd']) && g.some(x => {
            const [n1, m1] = sep(x), [n2, m2] = sep(v);
            return n1 * m2 === n2 * m1 && (x.a * v.b !== x.b * v.a || x.c * v.d !== x.d * v.c);
          }),
          bien: 'La misma distancia en la recta con números distintos: cuenta la resta, no los números.' },
      ],
      arrastres: [
        { id: 'punto-1', etiqueta: 'punto de la primera fracción', color: 'c-o',
          donde: v => { const g = RECTA().geometria(dosPuntos(v).datos); return { x: g.x(v.a / v.b), y: g.filaY(1) }; },
          mover: (pt, v) => ({ a: inversa(RECTA().geometria(dosPuntos(v).datos).x, 0, 4)(pt.x) * v.b }) },
        { id: 'punto-2', etiqueta: 'punto de la segunda fracción', color: 'c-o',
          donde: v => { const g = RECTA().geometria(dosPuntos(v).datos); return { x: g.x(v.c / v.d), y: g.filaY(2) }; },
          mover: (pt, v) => ({ c: inversa(RECTA().geometria(dosPuntos(v).datos).x, 0, 4)(pt.x) * v.d }) },
      ],
    },
    {
      // Sin arrastre: la tabla es la cuenta misma (resto por base); lo que se elige son números, no lugares.
      id: 'division-base', titulo: 'La división en cualquier base', pieza: 'arit-tabla',
      consigna: 'Elige la fracción y la base. Cada resto se multiplica por la base: mira si sale 0 o si un resto vuelve.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 1, max: 30, paso: 1, inicio: 5, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 2, max: 30, paso: 1, inicio: 12, unidad: '', decimales: 0 },
        { id: 'B', etiqueta: 'Base', min: 2, max: 16, paso: 1, inicio: 10, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaDiv(v.a, v.b, v.B), estado: {} }),
      lectura: v => [fr(v.a, v.b), ` en base ${v.B} = ${decimal(v.a, v.b, v.B)}`],
      invitaciones: [
        { texto: 'Consigue un decimal exacto, que no sea entero, en una base distinta de 10.',
          logrado: v => v.B !== 10 && v.a % v.b !== 0 && exacta(v),
          bien: 'Termina porque cada primo del denominador simplificado divide a la base.' },
        { texto: 'Busca un periódico puro: que se repita desde la primera cifra.',
          logrado: v => division(v.a, v.b, v.B).inicio === 0,
          bien: 'Puro: el denominador simplificado no comparte primos con la base.' },
        { texto: 'Consigue un período de seis cifras o más.',
          // inicio −2: no se repitió en las 12 cifras de la tabla; aquí eso pasa solo con períodos de 8 o más.
          logrado: v => { const d = division(v.a, v.b, v.B); return d.inicio === -2 || (d.inicio >= 0 && d.cifras.length - d.inicio >= 6); },
          bien: 'Con divisor b caben a lo sumo b − 1 restos distintos antes de repetir.' },
        { texto: 'Guarda dos fracciones de igual denominador y base: una exacta y otra periódica.',
          logrado: (v, g) => mismo(g, v, ['a', 'b', 'B']) && g.some(x => x.b === v.b && x.B === v.B && exacta(x) !== exacta(v)),
          bien: 'Decide el denominador ya simplificado, no el que se escribe.' },
      ],
    },
  ];

  return {
    unidad: 'aritmetica.numeros-racionales',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-tiras.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/arit-tabla.js'],
    glosario: [
      { termino: 'numerador', def: 'Número de arriba de una fracción: cuántas partes iguales de la unidad se toman.',
        ejemplo: 'En 3/4 se toman 3 de las 4 partes.', ver: ['número racional'] },
      { termino: 'número racional', formas: ['número racional', 'números racionales'],
        def: 'Número que se puede escribir como cociente de dos enteros, con divisor distinto de 0.',
        ejemplo: '0,75 = 3/4 y −2 = −2/1 lo son; √2 no.', ver: ['fracciones equivalentes', 'número irracional'] },
      { termino: 'fracciones equivalentes', formas: ['fracciones equivalentes', 'fracción equivalente'],
        def: 'Fracciones escritas distinto que valen lo mismo: marcan el mismo punto de la recta.',
        ejemplo: '6/8 = 3/4 = 9/12, porque 6 · 4 = 8 · 3 = 24.', ver: ['fracción simplificada'] },
      { termino: 'fracción simplificada', formas: ['fracción simplificada', 'simplificada'],
        def: 'Fracción cuyo numerador y denominador solo tienen al 1 como divisor común.',
        ejemplo: '18/24 se simplifica dividiendo entre 6: queda 3/4.', ver: ['fracciones equivalentes', 'divisor común'] },
      { termino: 'fracción propia', formas: ['fracción propia', 'fracciones propias'],
        def: 'Fracción con numerador menor que el denominador: vale menos que 1.',
        ejemplo: '3/5 = 0,6.', ver: ['fracción impropia'] },
      { termino: 'fracción impropia', formas: ['fracción impropia', 'fracciones impropias', 'impropia'],
        def: 'Fracción con numerador mayor que el denominador: vale más que 1.',
        ejemplo: '7/3 = 2,333…', ver: ['número mixto', 'fracción propia'] },
      { termino: 'fracción aparente', formas: ['fracción aparente', 'fracciones aparentes', 'aparente', 'aparentes'],
        def: 'Fracción cuyo numerador es múltiplo del denominador: en realidad es un entero.',
        ejemplo: '12/4 = 3.', ver: ['fracción impropia'] },
      { termino: 'número mixto', formas: ['número mixto', 'números mixtos'],
        def: 'Un entero más una fracción propia, escritos juntos: otra forma de escribir una impropia.',
        ejemplo: '7/3 = 2 y 1/3, porque 7 = 2 · 3 + 1.', ver: ['fracción impropia'] },
      { termino: 'decimal exacto', formas: ['decimal exacto', 'decimales exactos'],
        def: 'Decimal con una cantidad finita de cifras después de la coma: la división termina con resto 0.',
        ejemplo: '7/40 = 0,175.', ver: ['decimal periódico'] },
      { termino: 'decimal periódico', formas: ['decimal periódico', 'decimales periódicos', 'periódico', 'periódicos'],
        def: 'Decimal infinito en que un bloque de cifras, el período, se repite sin fin.',
        ejemplo: '1/6 = 0,1666…: el 6 se repite porque vuelve el resto 4.', ver: ['periódico puro', 'periódico mixto'] },
      { termino: 'periódico puro', def: 'Decimal que se repite desde la primera cifra después de la coma.',
        ejemplo: '0,2424… = 24/99 = 8/33.', ver: ['periódico mixto', 'generatriz'] },
      { termino: 'periódico mixto', def: 'Decimal con cifras que no se repiten entre la coma y el bloque que sí se repite.',
        ejemplo: '0,1666… = (16 − 1)/90 = 1/6.', ver: ['periódico puro', 'generatriz'] },
      { termino: 'generatriz', def: 'La fracción de la que sale un decimal: al dividir sus dos números se obtiene ese decimal.',
        ejemplo: 'La de 0,333… es 1/3.', ver: ['decimal periódico'] },
      { termino: 'número irracional', formas: ['número irracional', 'números irracionales', 'irracional', 'irracionales'],
        def: 'Número con decimales infinitos que nunca repiten un bloque: no es cociente de dos enteros.',
        ejemplo: '√2 = 1,41421… y π = 3,14159…', ver: ['número racional'] },
    ],
    laboratorio,
    historia: {
      texto: 'Las fracciones decimales permitieron calcular con partes de la unidad casi como con enteros. Simon Stevin defendió su uso práctico en 1585. No fue el único inventor de los decimales y su notación era distinta de la nuestra. Esta unidad separa el número de sus escrituras: una fracción, un decimal exacto o periódico y un punto de la recta pueden ser el mismo valor.',
      pregunta: '¿Es 0,999… lo mismo que 1?',
      fuente: { titulo: 'O’Connor y Robertson, Simon Stevin — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Stevin/' },
    },
    ideas: [equivalentes, clases, decimales, genIdea, otras],
  };
});
