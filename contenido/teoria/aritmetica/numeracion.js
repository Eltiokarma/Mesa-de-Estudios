/*
 * Teoría de «Numeración» (aritmetica.numeracion). Molde: docs/teoria.md; modelo de forma: porcentajes.js.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 11) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: los AT-* son hipótesis nuevas (la matriz marca «admitir la cifra b» y «leer el numeral como decimal»).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver que una base es una regla de canje (b sueltas = 1 del orden siguiente) y que el valor no cambia al cambiar de base.
 *   Persona y condiciones: postulante de 3.º, celular de 360 px, sin audio, con lápiz al lado.
 *   Resultado observable: pasa un numeral de base b a base 10 y al revés, detecta cifras imposibles y cuenta cifras por bloques.
 *   Orden de atención: 1.º las fichas o la tabla · 2.º la fila que se acaba de llenar · acción: el botón fijo de abajo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué en base 5 no existe la cifra 5, y por qué (132)₄ no es ciento treinta y dos?».
 * Colores (regla 4): la base b naranja (c-o), las cifras turquesa (c-i), los restos rojo (c-h), el valor en base 10 verde (c-d).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El motor de plantillas/numeracion dice cuánto valen las piezas y si ya forman un numeral (mesa 3D, regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/numeracion/motor.js'))
    : fabrica(root.Kit, root.MotorNumeracion);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MN) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const b = { v: 'c-o', t: 'b' }, d = { v: 'c-i', t: 'd' }, N = { v: 'c-d', t: 'N' }, r = { v: 'c-h', t: 'r' };
  const SUB = '₀₁₂₃₄₅₆₇₈₉';
  const subi = n => String(n).split('').map(c => SUB[+c]).join('');
  // Numeral en base b (cifras como texto) y su escritura «(132)₄».
  const enBase = (n, base) => { if (n === 0) return '0'; let s = ''; while (n > 0) { s = String(n % base) + s; n = Math.floor(n / base); } return s; };
  const nb = (cifras, base) => `(${cifras})${subi(base)}`;
  const valor = (cifras, base) => cifras.split('').reduce((v, c) => v * base + +c, 0);
  const sup = n => String(n).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('');
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const q = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    q.ent = (lo, hi) => lo + Math.floor(q() * (hi - lo + 1));
    q.de = xs => xs[Math.floor(q() * xs.length)];
    return q;
  }
  // Opciones distintas por su texto: la correcta primero; hasta 4.
  function opciones(correcta, distractores, fmt = x => String(x)) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const x of distractores) {
      const txt = fmt(x.valor);
      if (vistos.has(txt) || x.valor === null || x.valor === undefined || (typeof x.valor === 'number' && !Number.isFinite(x.valor))) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }

  // Gesto directo (docs/teoria.md §4b). En las fichas se tira del borde derecho de la primera fila: la fila se
  // alarga o se acorta y la base cambia. El bloque está centrado y la ficha no cambia de tamaño, así que el borde
  // está en centro + b · ficha / 2: de ahí sale b sin depender del estado (la manija no se dispara al soltar).
  // En la tira de páginas se arrastra el final del libro.
  const FICHAS = () => Kit.piezas['arit-fichas'], TIRAS = () => Kit.piezas['arit-tiras'];
  // (Con menos fichas que b, la manija marca dónde terminaría la fila llena.)
  const bordeFila = (datos, base) => { const g = FICHAS().geometria(datos), c = g.caja(0); return { x: c.x + c.ancho / 2 + base * g.paso / 2, y: c.y + g.paso / 2 }; };
  const baseEn = (datos, x) => { const g = FICHAS().geometria(datos), c = g.caja(0); return 2 * (x - (c.x + c.ancho / 2)) / g.paso; };

  // ---------- Idea 1: agrupar de b en b (base de un sistema) ----------
  // Cambia: cuántas fichas y de a cuántas se agrupan. Permanece: el tamaño de cada ficha (la cantidad no se estira).
  // Progresa: sueltas → fila llena → canje por una ficha del orden siguiente. Se reserva: la ficha número b, que nunca queda suelta.
  // Debe verse: con b sueltas ya hay un grupo; por eso la cifra b no existe en base b.
  const fichasBase = (n, base) => {
    const q = Math.floor(n / base), s = n % base;
    return { bloques: [{ n, columnas: base, color: 'i', marcoFilas: true, rotulo: `${n} = ${nb(enBase(n, base), base)}`, tramos: s ? [{ de: n - s, a: n - 1, color: 'h' }] : [] }], altoMax: 150, ficha: 30, alt: `${n} fichas en filas de ${base}: ${q} grupos completos y ${s} sueltas` };
  };
  // Las mismas fichas sin el numeral en el rótulo: el enunciado de «Así se resuelve» no regala la respuesta.
  const fichasSinNumeral = (n, base) => { const x = fichasBase(n, base); x.bloques[0].rotulo = `${n} fichas`; return x; };
  const agrupar = {
    id: 'agrupar',
    titulo: 'Agrupar de b en b',
    temas: ['Base de un sistema'],
    pieza: 'arit-fichas',
    // Lee (fase 2): contar por grupos y el nombre «base», sin decir qué cifra no existe (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'Contar de a montones', texto: 'En la feria de Juliaca nadie cuenta los huevos uno por uno: se venden por docenas. Hacer grupos iguales ayuda a contar rápido y a decir cuánto hay con pocas palabras.' },
        { titulo: 'La base', texto: 'El tamaño de cada grupo se llama base de numeración. Nosotros contamos en base 10: diez monedas de un sol se cambian por un billete de diez soles.' },
        { titulo: 'Qué mirar', texto: ['En el juego, cada fila llena es un grupo y las fichas rojas son las sueltas. Cambia la base ', b, ' y mira cómo cambia el numeral escrito debajo de las fichas.'] },
      ],
    },
    juega: {
      consigna: 'Elige cuántas fichas hay y la base de numeración. Cada fila llena es un grupo; las rojas quedan sueltas.',
      voz: 'Cuenta los grupos y las sueltas antes de leer el numeral.',
      controles: [
        { id: 'n', etiqueta: 'Fichas', min: 5, max: 24, paso: 1, inicio: 13, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-o', min: 5, max: 9, paso: 1, inicio: 5, decimales: 0 },
      ],
      dibujo: v => ({ datos: fichasBase(v.n, v.b), estado: {} }),
      lectura: v => { const q = Math.floor(v.n / v.b); return [`${q} ${q === 1 ? 'grupo' : 'grupos'} de ${v.b} y ${v.n % v.b} sueltas → ${nb(enBase(v.n, v.b), v.b)}`]; },
      minimo: 3,
      // La cantidad de fichas va con − y +: el bloque se apoya abajo, y su última ficha queda siempre en la fila de
      // abajo, así que arrastrarla no tiene una posición estable que leer.
      arrastres: [{ id: 'fila', etiqueta: 'largo de la fila (la base)', color: 'c-o',
        donde: v => bordeFila(fichasBase(v.n, v.b), v.b),
        mover: (pt, v) => ({ b: baseEn(fichasBase(v.n, v.b), pt.x) }) }],
    },
    predice: {
      pregunta: ['En base ', { v: 'c-o', t: '4' }, ', ¿cuál de estas cifras nunca aparece en un numeral?'],
      opciones: [
        { id: 'c', texto: '4', correcta: true },
        { id: 'cero', texto: '0', error: 'AT-CERO', siFuera: 'El 0 sí aparece: dice que en ese lugar no quedó nada, como en (10)₄.' },
        { id: 'tres', texto: '3', error: 'AT-CIFRA-B', siFuera: 'El 3 sí cabe: 3 sueltas todavía no completan un grupo de 4.' },
        { id: 'uno', texto: '1', error: 'AT-CIFRA-B', siFuera: 'El 1 sí aparece: un grupo completo se escribe con 1.' },
      ],
      dibujo: { datos: fichasBase(3, 4), estado: {} },
      revelar: { datos: fichasBase(4, 4), estado: {} },
      coincide: 'Coincide: con 4 sueltas ya hay un grupo, y se escribe (10)₄.',
    },
    mira: {
      datos: { bloques: [
        { n: 3, columnas: 4, color: 'h', rotulo: '(3)₄' },
        { n: 4, columnas: 4, color: 'i', marcoFilas: true, rotulo: '1 grupo', paso: 1 },
        { n: 1, columnas: 1, color: 'd', rotulo: '(10)₄', paso: 2 },
      ], altoMax: 36, ficha: 32, alt: 'Tres sueltas; cuatro fichas que forman un grupo; una ficha del orden siguiente' },
      pasos: [
        { estado: { paso: 0 }, texto: 'Tres fichas sueltas en base 4: se escribe 3.', ecuacion: ['3 < ', b, ' = 4'] },
        { estado: { paso: 1 }, texto: 'Con la cuarta ficha se completa un grupo.', ecuacion: ['4 sueltas = 1 grupo'] },
        { estado: { paso: 2 }, texto: 'El grupo se canjea por una ficha del orden siguiente.', ecuacion: ['4 = (10)₄'] },
      ],
    },
    regla: {
      texto: 'En base b, cada b unidades de un orden se canjean por una del orden siguiente. Por eso cada cifra va de 0 a b − 1.',
      ecuacion: ['0 ≤ ', d, ' ≤ ', { llave: [b, ' − 1'], nota: 'la cifra mayor', color: 'c-o' }],
      condicion: 'b es un entero de 2 o más. En un numeral de varias cifras, la primera no es 0.',
    },
    // Así se resuelve (fase 2): los dos tipos de «Ahora tú» (menor base y fichas a numeral), con otras semillas.
    resuelve: {
      generar(s) {
        const q = azar(s + 900);
        if (s % 2 === 0) {
          const base = q.ent(4, 9), c = [q.ent(1, base - 1), q.ent(0, base - 1), q.ent(0, base - 1)];
          c[q.ent(0, 2) || 1] = base - 1;
          const txt = c.join(''), mayor = Math.max(...c), min = mayor + 1;
          return {
            enunciado: ['¿Cuál es la menor base en la que el numeral ', { v: 'c-i', t: txt }, ' está bien escrito?'],
            pasos: [
              { tipo: 'pide', texto: ['Piden la base más chica en la que ', { v: 'c-i', t: txt }, ' se puede escribir.'] },
              { tipo: 'datos', texto: ['Las cifras son ', { v: 'c-i', t: c.join(', ') }, `. La mayor de ellas es ${mayor}.`] },
              { tipo: 'regla', texto: ['En base ', b, ', con ', b, ' fichas sueltas ya se arma un grupo. Por eso toda cifra tiene que ser menor que la base.'],
                ecuacion: ['0 ≤ ', d, ' ≤ ', b, ' − 1'] },
              { tipo: 'cuentas', texto: 'La base tiene que pasar a la cifra mayor. La más chica que lo logra es una más que ella.',
                ecuacion: [b, ` > ${mayor}   →   `, b, ` = ${mayor} + 1 = `, { v: 'c-o', t: String(min) }] },
              { tipo: 'sentido', texto: `En base ${min} la cifra más grande posible es ${min - 1}, justo la mayor del numeral. En base ${mayor}, la cifra ${mayor} ya no existiría.` },
            ],
            respuesta: ['La menor base es ', { v: 'c-o', t: String(min) }, '.'],
          };
        }
        const base = q.ent(3, 8), n = q.ent(base + 1, base * base - 1);
        const qq = Math.floor(n / base), ss = n % base, cifras = enBase(n, base), B = { v: 'c-o', t: String(base) };
        return {
          enunciado: [`Hay ${n} fichas. Se agrupan de `, B, ' en ', B, '. ¿Cómo se escribe la cantidad en esa base?'],
          dibujo: { datos: fichasSinNumeral(n, base), estado: {} },
          pasos: [
            { tipo: 'pide', texto: [`Piden escribir las ${n} fichas como un numeral en base `, B, '.'] },
            { tipo: 'datos', texto: [`Hay ${n} fichas, y cada fila llena tiene `, B, ' fichas: es un grupo.'] },
            { tipo: 'regla', texto: 'Los grupos completos van en el lugar de la izquierda. Las fichas que sobran van en el lugar de las unidades.' },
            { tipo: 'cuentas', texto: `Divido ${n} entre ${base}: salen ${qq} ${qq === 1 ? 'fila llena' : 'filas llenas'} y ${ss} ${ss === 1 ? 'ficha suelta' : 'fichas sueltas'}.`,
              ecuacion: [`${n} = ${qq} · `, B, ` + ${ss}   →   `, { sub: [{ v: 'c-i', t: `(${cifras})` }, B] }],
              dibujo: { datos: fichasBase(n, base), estado: {} } },
            { tipo: 'sentido', texto: `De vuelta: ${qq} ${qq === 1 ? 'grupo' : 'grupos'} de ${base} son ${qq * base} fichas, más ${ss} sueltas, dan ${qq * base + ss}. Y las dos cifras son menores que ${base}.` },
          ],
          respuesta: [`${n} = `, { sub: [{ v: 'c-i', t: `(${cifras})` }, B] }],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const q = azar(s);
        if (s % 2 === 0) {
          // La menor base posible para un numeral: la cifra mayor más uno.
          const base = q.ent(4, 9), c = [q.ent(1, base - 1), q.ent(0, base - 1), q.ent(0, base - 1)];
          c[q.ent(0, 2) || 1] = base - 1;
          const txt = c.join(''), mayor = Math.max(...c), min = mayor + 1;
          return {
            pregunta: ['¿Cuál es la menor base en la que el numeral ', { v: 'c-i', t: txt }, ' está bien escrito?'],
            opciones: opciones(min, [
              { id: 'igual', valor: mayor, error: 'AT-CIFRA-B', siFuera: `En base ${mayor} la cifra ${mayor} no existe: ${mayor} sueltas ya son un grupo.` },
              { id: 'diez', valor: 10, error: 'AT-DECIMAL', siFuera: 'Base 10 sirve, pero no es la menor posible.' },
              { id: 'cifras', valor: c.length, error: 'AT-LARGO', siFuera: 'La base no depende de cuántas cifras tiene el numeral.' },
            ], x => `base ${x}`),
            solucion: { texto: `La cifra mayor es ${mayor}; la base tiene que ser mayor que ella.`, ecuacion: [b, ` > ${mayor} → `, b, ` = ${min}`] },
          };
        }
        const base = q.ent(3, 8), n = q.ent(base + 1, base * base - 1);
        const qq = Math.floor(n / base), ss = n % base;
        return {
          pregunta: [`Hay ${n} fichas. Se agrupan de `, { v: 'c-o', t: String(base) }, ' en ', { v: 'c-o', t: String(base) }, '. ¿Cómo se escribe la cantidad en esa base?'],
          dibujo: { datos: fichasBase(n, base), estado: {} },
          opciones: opciones(nb(enBase(n, base), base), [
            { id: 'decimal', valor: nb(String(n), base), error: 'AT-DECIMAL', siFuera: 'Eso copia el número en base 10; en otra base las cifras cambian.' },
            { id: 'al-reves', valor: nb(`${ss}${qq}`, base), error: 'AT-ORDEN', siFuera: 'Los grupos van a la izquierda y las sueltas a la derecha.' },
            { id: 'uno-mas', valor: nb(`${qq + 1}${ss}`, base), error: 'AT-CONTEO', siFuera: `Cuenta otra vez las filas llenas: son ${qq}.` },
          ]),
          solucion: { texto: `${qq} grupos de ${base} y ${ss} sueltas.`, ecuacion: [`${n} = ${qq} · ${base} + ${ss} = ${nb(enBase(n, base), base)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: cada cifra vale según su lugar (descomposición polinómica) ----------
  // Cambia: la base, con el mismo numeral 132. Permanece: las tres cifras y sus lugares.
  // Progresa: fila por fila, cifra × su potencia de b. Se reserva: el total, que cambia aunque el numeral no.
  // Debe verse: el mismo numeral vale distinto en cada base.
  const tablaPolinomio = (cifras, base, con = 99) => {
    const k = cifras.length, filas = cifras.split('').map((c, i) => {
      const e = k - 1 - i, p = base ** e;
      return [{ t: c, color: 'i', paso: i + 1 > con ? 99 : 0 }, { t: e === 0 ? '1' : `${base}${sup(e)} = ${p}`, paso: i + 1 > con ? 99 : 0 }, { t: String(+c * p), paso: i + 1 > con ? 99 : 0 }];
    });
    filas.push(['', 'total', { t: String(valor(cifras, base)), color: 'd', resalta: true, paso: k + 1 > con ? 99 : 0 }]);
    return { columnas: [{ t: 'cifra', color: 'i' }, { t: 'lugar' }, { t: 'vale' }], filas, filasMax: 5 };
  };
  const tablaPasos = (cifras, base) => {
    const k = cifras.length, filas = cifras.split('').map((c, i) => {
      const e = k - 1 - i, p = base ** e;
      return [{ t: c, color: 'i' }, { t: e === 0 ? '1' : `${base}${sup(e)} = ${p}`, paso: i + 1 }, { t: String(+c * p), paso: i + 1 }];
    });
    filas.push(['', { t: 'total', paso: k + 1 }, { t: String(valor(cifras, base)), color: 'd', resalta: true, paso: k + 1 }]);
    return { columnas: [{ t: 'cifra', color: 'i' }, { t: 'lugar' }, { t: 'vale' }], filas, filasMax: 5 };
  };
  const descomposicion = {
    id: 'descomposicion',
    titulo: 'Cada cifra vale según su lugar',
    temas: ['Descomposición polinómica'],
    pieza: 'arit-tabla',
    // Lee (fase 2): valor posicional en base 10 y cómo se escribe la base, sin calcular (132)₄ (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'El lugar manda', texto: 'En 555 hay tres cincos, pero no valen igual: el de la izquierda vale quinientos, el del centro cincuenta y el de la derecha, cinco. A eso se le llama valor posicional.' },
        { titulo: 'Dónde va la base', texto: 'La base se escribe chiquita, abajo y a la derecha. (213)₅ se lee «dos, uno, tres en base cinco», no «doscientos trece». Si no lleva ese número chico, la base es 10.' },
        { titulo: 'Qué mirar', texto: 'En el juego, el numeral 132 no cambia; solo cambia la base. Mira la columna del lugar y el total cada vez que subes o bajas la base.' },
      ],
    },
    juega: {
      consigna: 'El numeral 132 se queda quieto. Cambia la base y mira cuánto vale cada cifra y el total.',
      voz: 'Las cifras no cambian; mira la columna del lugar.',
      controles: [{ id: 'b', etiqueta: 'b', color: 'c-o', min: 5, max: 9, paso: 1, inicio: 5, decimales: 0 }],
      dibujo: v => ({ datos: tablaPolinomio('132', v.b), estado: {} }),
      lectura: v => [{ sub: ['(132)', String(v.b)] }, ' = ', { v: 'c-d', t: String(valor('132', v.b)) }],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuánto vale ', { sub: ['(132)', { v: 'c-o', t: '4' }] }, ' en base 10?'],
      opciones: [
        { id: 'c', texto: '30', correcta: true },
        { id: 'decimal', texto: '132', error: 'AT-DECIMAL', siFuera: '132 sería cierto en base 10. Aquí el 1 vale 4², no 10².' },
        { id: 'al-reves', texto: '45', error: 'AT-ORDEN', siFuera: 'Eso da la potencia mayor a la última cifra. La de la izquierda lleva la mayor.' },
        { id: 'suma', texto: '24', error: 'AT-SUMA', siFuera: 'Eso multiplica la suma de cifras por 4. Cada cifra lleva su propia potencia.' },
      ],
      dibujo: { datos: tablaPolinomio('132', 4, 0), estado: {} },
      revelar: { datos: tablaPolinomio('132', 4), estado: {} },
      coincide: 'Coincide: 16 + 12 + 2 = 30.',
    },
    mira: {
      datos: tablaPasos('132', 4),
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: 'La primera cifra está en el lugar de 4².', ecuacion: ['1 · 4² = 16'] },
        { estado: { paso: 2, fila: 1 }, texto: 'La segunda, en el lugar de 4.', ecuacion: ['3 · 4 = 12'] },
        { estado: { paso: 3, fila: 2 }, texto: 'La última, en el lugar de las unidades.', ecuacion: ['2 · 1 = 2'] },
        { estado: { paso: 4, fila: 3 }, texto: 'El valor es la suma de los tres aportes.', ecuacion: [{ sub: ['(132)', '4'] }, ' = 16 + 12 + 2 = ', { v: 'c-d', t: '30' }] },
      ],
    },
    regla: {
      texto: 'Descomposición polinómica: cada cifra se multiplica por la potencia de la base de su lugar, contando desde 0 a la derecha, y se suma todo.',
      // A 360 px no cabe en una línea: el separador la parte en el «=» (sin él se partía entre «+» y d₀).
      ecuacion: [{ sub: [['(', { sub: [d, 'k'] }, '…', { sub: [d, '1'] }, { sub: [d, '0'] }, ')'], b] }, ' =', '   ·   ', { sub: [d, 'k'] }, ' ', { sup: [b, 'k'] }, ' + … + ', { sub: [d, '1'] }, ' ', b, ' + ', { sub: [d, '0'] }],
      condicion: 'cada cifra cumple 0 ≤ d < b. El lugar de la derecha es b⁰ = 1.',
    },
    // Así se resuelve (fase 2): el mismo numeral a base 10 de «Ahora tú», con otras semillas.
    resuelve: {
      generar(s) {
        const q = azar(s + 900), base = q.ent(2, 9), k = base === 2 ? q.ent(4, 5) : q.ent(3, 4);
        let c = String(q.ent(1, base - 1));
        for (let i = 1; i < k; i++) c += String(q.ent(0, base - 1));
        const v = valor(c, base), B = { v: 'c-o', t: String(base) }, num = { sub: [{ v: 'c-i', t: `(${c})` }, B] };
        const terminos = c.split('').map((x, i) => `${x}·${base}${sup(k - 1 - i)}`).join(' + ');
        const aportes = c.split('').map((x, i) => f(+x * base ** (k - 1 - i))).join(' + ');
        const desde = base ** (k - 1), hasta = base ** k;
        return {
          enunciado: ['¿Cuánto vale ', num, ' en base 10?'],
          dibujo: { datos: tablaPolinomio(c, base, 0), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden el valor en base 10 de ', num, ', un numeral escrito en base ', B, '.'] },
            { tipo: 'datos', texto: `Tiene ${k} cifras: ${c.split('').join(', ')}. La de la derecha está en el lugar de las unidades.` },
            { tipo: 'regla', texto: 'Cada cifra se multiplica por lo que vale su lugar: 1, la base, la base al cuadrado… contando desde la derecha. Después se suma todo.' },
            { tipo: 'cuentas', texto: 'Multiplico cada cifra por la potencia de su lugar y sumo los aportes.',
              ecuacion: [`${terminos} = ${aportes} = `, { v: 'c-d', t: f(v) }],
              dibujo: { datos: tablaPolinomio(c, base), estado: {} } },
            { tipo: 'sentido', texto: `Un numeral de ${k} cifras en base ${base} vale por lo menos ${f(desde)} y menos de ${f(hasta)}. El ${f(v)} está en ese rango.` },
          ],
          respuesta: [num, ' = ', { v: 'c-d', t: f(v) }],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const q = azar(s), base = q.ent(2, 9), k = base === 2 ? q.ent(4, 5) : q.ent(3, 4);
        let c = String(q.ent(1, base - 1));
        for (let i = 1; i < k; i++) c += String(q.ent(0, base - 1));
        const v = valor(c, base), rev = valor(c.split('').reverse().join(''), base);
        const suma = c.split('').reduce((a, x) => a + +x, 0);
        return {
          pregunta: ['¿Cuánto vale ', { sub: [`(${c})`, { v: 'c-o', t: String(base) }] }, ' en base 10?'],
          dibujo: { datos: tablaPolinomio(c, base, 0), estado: {} },
          opciones: opciones(v, [
            { id: 'decimal', valor: +c, error: 'AT-DECIMAL', siFuera: `Eso lee las cifras en base 10; aquí la base es ${base}.` },
            { id: 'al-reves', valor: rev, error: 'AT-ORDEN', siFuera: 'La potencia mayor va con la cifra de la izquierda.' },
            { id: 'suma', valor: suma * base, error: 'AT-SUMA', siFuera: 'Cada cifra lleva su propia potencia; no se multiplica la suma.' },
          ], x => f(x)),
          solucion: { texto: 'Cada cifra por la potencia de su lugar.', ecuacion: [c.split('').map((x, i) => `${x}·${base}${sup(k - 1 - i)}`).join(' + '), ` = ${f(v)}`], dibujo: { datos: tablaPolinomio(c, base), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: dividir entre b y leer los restos al revés (cambio de base) ----------
  // Cambia: el número y la base de llegada. Permanece: el formato de la tabla (dividendo, cociente, resto).
  // Progresa: una división por fila hasta cociente 0. Se reserva: el orden de lectura, de abajo hacia arriba.
  // Debe verse: el último resto es la primera cifra.
  const tablaDivisiones = (n, base, conPasos) => {
    const filas = [];
    let x = n, i = 0;
    while (x > 0) {
      const c = Math.floor(x / base), rr = x % base;
      i++;
      filas.push([{ t: `${x} ÷ ${base}`, paso: conPasos ? i : 0 }, { t: String(c), paso: conPasos ? i : 0 }, { t: String(rr), color: 'h', resalta: !!conPasos, paso: conPasos ? i : 0 }]);
      x = c;
    }
    return { columnas: [{ t: 'divide' }, { t: 'cociente' }, { t: 'resto', color: 'h' }], filas, filasMax: 6 };
  };
  const cambio = {
    id: 'cambio-base',
    titulo: 'Restos leídos de abajo arriba',
    temas: ['Cambio de base'],
    pieza: 'arit-tabla',
    // Lee (fase 2): misma cantidad con otra escritura y la división con resto, sin decir en qué orden se leen los
    // restos (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'La misma plata', texto: 'Treinta soles pueden ser tres billetes de diez o seis monedas de cinco. La plata es la misma; cambia cómo la juntas. En un cambio de base pasa igual: el número no cambia, su escritura sí.' },
        { titulo: 'Dividir con resto', texto: 'Si repartes 17 chuños en bolsas de 5, llenas 3 bolsas y te sobran 2. El 3 es el cociente y el 2 es el resto, que siempre es menor que 5.',
          ecuacion: ['17 = 5 · 3 + ', { v: 'c-h', t: '2' }] },
        { titulo: 'Qué mirar', texto: 'En la tabla, cada fila divide entre la base lo que salió de cociente en la fila anterior. Fíjate en la columna roja y en cuándo se detiene la tabla.' },
      ],
    },
    juega: {
      consigna: 'Elige un número y una base. La tabla lo divide entre la base hasta que el cociente es 0.',
      voz: 'Mira la columna roja: ahí están las cifras.',
      controles: [
        { id: 'n', etiqueta: 'N', color: 'c-d', min: 10, max: 60, paso: 1, inicio: 25, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-o', min: 4, max: 9, paso: 1, inicio: 4, decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaDivisiones(v.n, v.b, false), estado: {} }),
      lectura: v => [{ v: 'c-d', t: String(v.n) }, ' = ', { sub: [`(${enBase(v.n, v.b)})`, String(v.b)] }],
      minimo: 3,
    },
    predice: {
      pregunta: ['Al pasar ', { v: 'c-d', t: '19' }, ' a base ', { v: 'c-o', t: '3' }, ', los restos salen 1, 0 y 2, en ese orden. ¿Cómo se escribe 19 en base 3?'],
      opciones: [
        { id: 'c', texto: '(201)₃', correcta: true },
        { id: 'orden', texto: '(102)₃', error: 'AT-ORDEN', siFuera: 'Ese es el orden en que salen. Se leen del último resto al primero.' },
        { id: 'igual', texto: '(19)₃', error: 'AT-CIFRA-B', siFuera: 'La cifra 9 no existe en base 3: las cifras van de 0 a 2.' },
        { id: 'cocientes', texto: '(62)₃', error: 'AT-COCIENTE', siFuera: 'Esos son cocientes. Las cifras son los restos.' },
      ],
      dibujo: { datos: tablaDivisiones(19, 3, false), estado: { paso: 0, columna: 2 } },
      revelar: { datos: tablaDivisiones(19, 3, false), estado: { fila: 2 } },
      coincide: 'Coincide: 2·9 + 0·3 + 1 = 19.',
    },
    mira: {
      datos: tablaDivisiones(19, 3, true),
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: '19 entre 3: cociente 6, sobra 1. Es la cifra de las unidades.', ecuacion: ['19 = 3 · 6 + ', { v: 'c-h', t: '1' }] },
        { estado: { paso: 2, fila: 1 }, texto: 'Los 6 grupos se vuelven a agrupar de 3 en 3.', ecuacion: ['6 = 3 · 2 + ', { v: 'c-h', t: '0' }] },
        { estado: { paso: 3, fila: 2 }, texto: 'Quedan 2 grupos de 9; el cociente ya es 0.', ecuacion: ['2 = 3 · 0 + ', { v: 'c-h', t: '2' }] },
        { estado: { paso: 3, columna: 2 }, texto: 'Se leen los restos desde el último.', ecuacion: ['19 = ', { sub: ['(201)', '3'] }, ' = 2·9 + 0·3 + 1'] },
      ],
    },
    regla: {
      texto: 'Cambio de base: para pasar de base 10 a base b se divide entre b hasta que el cociente es 0. Los restos, del último al primero, son las cifras.',
      ecuacion: [N, ' = ', b, ' · q + ', { llave: [r], nota: 'una cifra', color: 'c-h' }, '   ·   ', '0 ≤ ', r, ' < ', b],
      condicion: 'el número no cambia, solo su escritura. Entre dos bases que no son 10, se pasa primero por base 10.',
    },
    // Así se resuelve (fase 2): los dos tipos de «Ahora tú» (de base 10 a base b, y entre dos bases), con otras semillas.
    resuelve: {
      generar(s) {
        const q = azar(s + 900);
        // Las divisiones sucesivas de n entre la base: el resto de cada una y la descomposición de vuelta.
        const divisiones = (n, base) => { const out = []; for (let x = n; x > 0; x = Math.floor(x / base)) out.push({ x, c: Math.floor(x / base), r: x % base }); return out; };
        const vuelta = (cifras, base) => cifras.split('').map((x, i) => `${x}·${base}${sup(cifras.length - 1 - i)}`).join(' + ');
        if (s % 3 === 2) {
          const a = q.de([3, 4, 5]), c = q.de([2, 6, 7].filter(x => x !== a)), n = q.ent(a * a, a * a * a - 1);
          const na = enBase(n, a), nc = enBase(n, c), C = { v: 'c-o', t: String(c) };
          const restos = divisiones(n, c).map(x => x.r);
          return {
            enunciado: ['Escribe ', { sub: [`(${na})`, String(a)] }, ' en base ', C, '.'],
            pasos: [
              { tipo: 'pide', texto: ['Piden escribir ', { sub: [`(${na})`, String(a)] }, ' en base ', C, '.'] },
              { tipo: 'datos', texto: `El numeral está en base ${a} y hay que llevarlo a base ${c}. Ninguna de las dos bases es 10.` },
              { tipo: 'regla', texto: 'Entre dos bases que no son 10, primero paso a base 10 con la descomposición. Después divido entre la nueva base.' },
              { tipo: 'cuentas', texto: `Primero a base 10. Luego divido ${n} entre ${c} hasta que el cociente sea 0: los restos salen ${restos.join(', ')}.`,
                ecuacion: [`${vuelta(na, a)} = `, { v: 'c-d', t: String(n) }, '   →   ', { sub: [`(${nc})`, C] }] },
              { tipo: 'sentido', texto: `Leo los restos desde el último y compruebo de vuelta: da ${valor(nc, c)} otra vez. Las dos escrituras valen lo mismo.`,
                ecuacion: [`${vuelta(nc, c)} = `, { v: 'c-d', t: String(valor(nc, c)) }] },
            ],
            respuesta: [{ sub: [`(${na})`, String(a)] }, ' = ', { sub: [`(${nc})`, C] }],
          };
        }
        const base = q.ent(2, 8), n = q.ent(base * base + 1, Math.min(200, base * base * base - 1));
        const cifras = enBase(n, base), B = { v: 'c-o', t: String(base) }, divs = divisiones(n, base);
        const cuentas = [];
        divs.forEach((x, i) => { if (i) cuentas.push('   ·   '); cuentas.push(`${x.x} = ${base} · ${x.c} + `, { v: 'c-h', t: String(x.r) }); });
        return {
          enunciado: ['Escribe ', { v: 'c-d', t: String(n) }, ' en base ', B, '.'],
          dibujo: { datos: tablaDivisiones(n, base, true), estado: { paso: 0 } },
          pasos: [
            { tipo: 'pide', texto: ['Piden escribir ', { v: 'c-d', t: String(n) }, ' en base ', B, '.'] },
            { tipo: 'datos', texto: `El número está en base 10. En base ${base} las cifras van de 0 a ${base - 1}.` },
            { tipo: 'regla', texto: 'Divido entre la base una y otra vez, hasta que el cociente sea 0. Los restos son las cifras, leídas desde el último.' },
            { tipo: 'cuentas', texto: `Cada fila divide entre ${base} el cociente de la fila anterior. Leo los restos rojos de abajo arriba.`,
              ecuacion: cuentas, dibujo: { datos: tablaDivisiones(n, base, true), estado: { paso: divs.length } } },
            { tipo: 'sentido', texto: `De vuelta, con la descomposición: da ${valor(cifras, base)}. Cuadra.`,
              ecuacion: [`${vuelta(cifras, base)} = `, { v: 'c-d', t: String(valor(cifras, base)) }] },
          ],
          respuesta: [{ v: 'c-d', t: String(n) }, ' = ', { sub: [`(${cifras})`, B] }],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const q = azar(s);
        if (s % 3 === 2) {
          // De base a a base c, pasando por base 10.
          const a = q.de([3, 4, 5]), c = q.de([2, 6, 7].filter(x => x !== a)), n = q.ent(a * a, a * a * a - 1);
          const na = enBase(n, a), nc = enBase(n, c);
          return {
            pregunta: ['Escribe ', { sub: [`(${na})`, String(a)] }, ' en base ', { v: 'c-o', t: String(c) }, '.'],
            opciones: opciones(nb(nc, c), [
              { id: 'copia', valor: nb(na, c), error: 'AT-DECIMAL', siFuera: 'Copiar las cifras cambia el número. Primero pásalo a base 10.' },
              { id: 'orden', valor: nb(nc.split('').reverse().join(''), c), error: 'AT-ORDEN', siFuera: 'Los restos se leen del último al primero.' },
              { id: 'diez', valor: nb(String(n), c), error: 'AT-DECIMAL', siFuera: `${n} es el valor en base 10; falta dividirlo entre ${c}.` },
            ]),
            solucion: { texto: `Primero a base 10: ${n}. Después, divisiones entre ${c}.`, ecuacion: [{ sub: [`(${na})`, String(a)] }, ` = ${n} = `, { sub: [`(${nc})`, String(c)] }] },
          };
        }
        const base = q.ent(2, 8), n = q.ent(base * base + 1, Math.min(200, base * base * base - 1));
        const cifras = enBase(n, base);
        const cocs = []; for (let x = Math.floor(n / base); x > 0; x = Math.floor(x / base)) cocs.push(x);
        return {
          pregunta: ['Escribe ', { v: 'c-d', t: String(n) }, ' en base ', { v: 'c-o', t: String(base) }, '.'],
          opciones: opciones(nb(cifras, base), [
            { id: 'orden', valor: nb(cifras.split('').reverse().join(''), base), error: 'AT-ORDEN', siFuera: 'Ese es el orden en que salen los restos; se leen al revés.' },
            { id: 'cocientes', valor: nb(cocs.reverse().join(''), base), error: 'AT-COCIENTE', siFuera: 'Esos son los cocientes. Las cifras son los restos.' },
            { id: 'sin-ultimo', valor: nb(cifras.slice(1), base), error: 'AT-CONTEO', siFuera: 'Falta la última división: se sigue hasta que el cociente es 0.' },
          ]),
          solucion: { texto: 'Restos del último al primero.', ecuacion: [`${n} = `, { sub: [`(${cifras})`, String(base)] }], dibujo: { datos: tablaDivisiones(n, base, false), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 4: contar por bloques de igual largo (conteo de números y cifras) ----------
  // Cambia: hasta qué página se numera. Permanece: los bloques de 1, 2 y 3 cifras.
  // Progresa: bloque por bloque, cantidad de números × cifras de cada uno. Se reserva: el bloque incompleto del final.
  // Debe verse: no todos los números tienen la misma cantidad de cifras.
  function bloques(P, base = 10) {
    const out = [];
    for (let k = 1; base ** (k - 1) <= P; k++) {
      const a = base ** (k - 1), z = Math.min(P, base ** k - 1), cuantos = z - a + 1;
      out.push({ k, a, z, cuantos, cifras: cuantos * k });
    }
    return out;
  }
  const tablaBloques = (P, con = 99) => {
    const bl = bloques(P);
    const filas = bl.map((x, i) => [{ t: `${x.a} a ${x.z}`, paso: i + 1 > con ? 99 : 0 }, { t: String(x.cuantos), paso: i + 1 > con ? 99 : 0 }, { t: String(x.k), paso: i + 1 > con ? 99 : 0 }, { t: String(x.cifras), color: 'i', paso: i + 1 > con ? 99 : 0 }]);
    filas.push([{ t: 'total' }, '', '', { t: String(bl.reduce((a, x) => a + x.cifras, 0)), color: 'd', resalta: true, paso: bl.length + 1 > con ? 99 : 0 }]);
    return { columnas: [{ t: 'páginas' }, { t: 'cuántas' }, { t: 'cifras c/u' }, { t: 'cifras', color: 'i' }], filas, filasMax: 5 };
  };
  const tablaBloquesPasos = P => {
    const bl = bloques(P);
    const filas = bl.map((x, i) => [{ t: `${x.a} a ${x.z}`, paso: i + 1 }, { t: String(x.cuantos), paso: i + 1 }, { t: String(x.k), paso: i + 1 }, { t: String(x.cifras), color: 'i', paso: i + 1 }]);
    filas.push([{ t: 'total', paso: bl.length + 1 }, '', '', { t: String(bl.reduce((a, x) => a + x.cifras, 0)), color: 'd', resalta: true, paso: bl.length + 1 }]);
    return { columnas: [{ t: 'páginas' }, { t: 'cuántas' }, { t: 'cifras c/u' }, { t: 'cifras', color: 'i' }], filas, filasMax: 5 };
  };
  const totalCifras = P => bloques(P).reduce((a, x) => a + x.cifras, 0);
  // Dos tiras a la misma escala: las páginas y las cifras que gastan, bloque por bloque (el relleno marca el bloque:
  // más oscuro, más cifras por página). Cada página de k cifras estira la tira de abajo k veces.
  const RELLENO = [0.08, 0.22, 0.4, 0.6];
  function tirasPaginas(P, max, conCifras = true) {
    const bl = bloques(P), cabe = (valor, txt) => 300 * valor / max >= 9 * txt.length + 14;
    const t1 = bl.map(x => ({ valor: x.cuantos, relleno: RELLENO[x.k - 1] }));   // sin rótulos: el final del libro lleva su número
    const t2 = bl.map(x => ({ valor: x.cifras, color: 'i', relleno: RELLENO[x.k - 1], texto: cabe(x.cifras, `${x.cuantos}·${x.k}`) ? `${x.cuantos}·${x.k}` : '' }));
    return { max, filas: 2, alt: `Páginas de 1 a ${P} en bloques de 1, 2 y más cifras; abajo, las cifras que gasta cada bloque: ${totalCifras(P)}`, tiras: [
      { rotulo: 'páginas', fin: String(P), tramos: t1 },
      { rotulo: 'cifras', color: 'i', fin: String(totalCifras(P)), paso: conCifras ? 0 : 99, tramos: t2 },
    ] };
  }
  const MAX_P = 1100;   // escala común del juego: las cifras de 1 a 400 (1092) caben a lo ancho
  const finLibro = (P, max) => ({ id: 'fin', etiqueta: 'final de la tira de páginas',
    donde: v => { const g = TIRAS().geometria(tirasPaginas(v[P], max)); return { x: g.x(v[P]), y: g.tiraY(0) }; },   // en el borde de arriba: no tapa el número del final
    mover: (pt, v) => ({ [P]: TIRAS().geometria(tirasPaginas(v[P], max)).deX(pt.x) }) });
  const conteo = {
    id: 'conteo-cifras',
    titulo: 'Contar cifras por bloques',
    temas: ['Conteo de números y cifras'],
    // Hallazgo 9: dos representaciones a propósito. El juego usa las dos tiras (se ve que el bloque de tres cifras se
    // estira el triple); «Mira» y «Ahora tú» usan la tabla, que es como se cuenta en papel, con los mismos bloques.
    pieza: 'arit-tiras',
    // Lee (fase 2): cuántas cifras tiene una página y cómo contar de a hasta z, sin sumar los bloques de 1 a 100
    // (eso lo pregunta Predice).
    lee: {
      tarjetas: [
        { titulo: 'Cifras de una página', texto: 'Al numerar un cuaderno de la feria se escribe cada número de página. La página 7 gasta una cifra; la 45, dos cifras, y la 300, tres cifras.' },
        { titulo: 'Contar de a hasta z', texto: 'Del 20 al 30, ¿cuántos números hay? No son 10 sino 11, porque se cuentan los dos de las puntas.',
          ecuacion: ['de a hasta z: z − a + 1   ·   30 − 20 + 1 = 11'] },
        { titulo: 'Qué mirar', texto: 'En el juego, la tira de arriba son las páginas y la de abajo, las cifras que gastan. Arrastra el final y compara cuánto se estira cada bloque abajo.' },
      ],
    },
    juega: {
      consigna: 'Las páginas de un libro se numeran desde la 1. Arrastra el final de la tira de páginas y mira cuántas cifras gasta cada bloque.',
      voz: 'Compara el bloque de dos cifras con el de tres.',
      controles: [{ id: 'P', etiqueta: 'Última página', min: 120, max: 400, paso: 20, inicio: 200, decimales: 0 }],
      dibujo: v => ({ datos: tirasPaginas(v.P, MAX_P), estado: {} }),
      lectura: v => [`De 1 a ${v.P} se usan `, { v: 'c-d', t: String(totalCifras(v.P)) }, ' cifras'],
      minimo: 3,
      arrastres: [finLibro('P', MAX_P)],
    },
    predice: {
      pregunta: '¿Cuántas cifras se usan para numerar las páginas de un libro de 1 a 100?',
      opciones: [
        { id: 'c', texto: '192', correcta: true },
        { id: 'todas-dos', texto: '200', error: 'AT-BLOQUE', siFuera: 'Sería cierto si todas tuvieran dos cifras. De 1 a 9 tienen una.' },
        { id: 'sin-cien', texto: '189', error: 'AT-CONTEO', siFuera: '189 llega hasta la página 99; falta la página 100, con 3 cifras.' },
        { id: 'tres', texto: '300', error: 'AT-BLOQUE', siFuera: 'Solo la página 100 tiene tres cifras.' },
      ],
      dibujo: { datos: tirasPaginas(100, 220, false), estado: {} },
      revelar: { datos: tirasPaginas(100, 220), estado: {} },
      coincide: 'Coincide: 9 + 180 + 3 = 192.',
    },
    mira: {
      pieza: 'arit-tabla',
      datos: tablaBloquesPasos(100),
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: 'De 1 a 9: nueve páginas de una cifra.', ecuacion: ['9 · 1 = 9'] },
        { estado: { paso: 2, fila: 1 }, texto: 'De 10 a 99: 90 páginas de dos cifras.', ecuacion: ['(99 − 10 + 1) · 2 = 180'] },
        { estado: { paso: 3, fila: 2 }, texto: 'La página 100 sola tiene tres cifras.', ecuacion: ['1 · 3 = 3'] },
        { estado: { paso: 4, fila: 3 }, texto: 'Se suman los bloques.', ecuacion: ['9 + 180 + 3 = ', { v: 'c-d', t: '192' }] },
      ],
    },
    regla: {
      texto: 'Los números de k cifras en base b van de bᵏ⁻¹ a bᵏ − 1. Se cuenta cada bloque por separado: cantidad por cifras.',
      ecuacion: [{ llave: ['(', b, ' − 1) · ', { sup: [b, 'k−1'] }], nota: 'los de k cifras', color: 'c-o' }, '   ·   ', 'de a hasta z: z − a + 1'],
      condicion: 'la primera cifra no es 0. Un bloque cortado se cuenta desde su primer número hasta la última página.',
    },
    // Así se resuelve (fase 2): los dos tipos de «Ahora tú» (cifras de un libro y numerales de k cifras), con otras
    // semillas y la misma tabla de bloques.
    resuelve: {
      pieza: 'arit-tabla',
      generar(s) {
        const q = azar(s + 900);
        if (s % 2 === 1) {
          const base = q.ent(2, 9), k = q.ent(2, 4), n = (base - 1) * base ** (k - 1), B = { v: 'c-o', t: String(base) };
          const menor = '1' + '0'.repeat(k - 1), mayor = String(base - 1).repeat(k), a = valor(menor, base), z = valor(mayor, base);
          return {
            enunciado: ['¿Cuántos números de ', `${k} cifras hay en base `, B, '?'],
            pasos: [
              { tipo: 'pide', texto: ['Piden cuántos numerales distintos de ', `${k} cifras se pueden escribir en base `, B, '.'] },
              { tipo: 'datos', texto: `En base ${base} las cifras van de 0 a ${base - 1}: hay ${base} cifras para elegir en cada lugar.` },
              { tipo: 'regla', texto: 'La primera cifra no puede ser 0; las demás sí. Multiplico cuántas opciones tiene cada lugar.' },
              { tipo: 'cuentas', texto: `La primera cifra tiene ${base - 1} ${base === 2 ? "opción" : "opciones"}, y ${k === 2 ? "la otra" : `cada una de las otras ${k - 1}`} tiene ${base}.`,
                ecuacion: ['(', B, ` − 1) · ${base}${sup(k - 1)} = ${base - 1} · ${f(base ** (k - 1))} = `, { v: 'c-d', t: f(n) }] },
              { tipo: 'sentido', texto: `De vuelta, contando de a hasta z: van de (${menor})${subi(base)} = ${f(a)} hasta (${mayor})${subi(base)} = ${f(z)}.`,
                ecuacion: [`${f(z)} − ${f(a)} + 1 = `, { v: 'c-d', t: f(z - a + 1) }] },
            ],
            respuesta: ['Hay ', { v: 'c-d', t: f(n) }, ` números de ${k} cifras.`],
          };
        }
        const P = q.ent(110, 600), bl = bloques(P), t = totalCifras(P);
        return {
          enunciado: `¿Cuántas cifras se usan para numerar las páginas de un libro de 1 a ${P}?`,
          dibujo: { datos: tablaBloques(P, 0), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden cuántas cifras se escriben en total al numerar de la página 1 a la ${P}.` },
            { tipo: 'datos', texto: `La última página, ${P}, tiene tres cifras. Entonces hay páginas de una, de dos y de tres cifras.` },
            { tipo: 'regla', texto: 'Separo las páginas en bloques según cuántas cifras tienen. En cada bloque multiplico cuántas páginas hay por las cifras de cada una.' },
            { tipo: 'cuentas', texto: bl.map(x => `de ${x.a} a ${x.z} hay ${x.cuantos}`).join('; ').replace(/^d/, 'D') + '.',
              ecuacion: [bl.map(x => `${x.cuantos}·${x.k}`).join(' + '), ' = ', bl.map(x => f(x.cifras)).join(' + '), ' = ', { v: 'c-d', t: f(t) }],
              dibujo: { datos: tablaBloques(P), estado: {} } },
            { tipo: 'sentido', texto: `Si todas tuvieran tres cifras serían 3 · ${P} = ${f(3 * P)}. Da menos porque las 99 primeras gastan menos. Cuadra.` },
          ],
          respuesta: ['Se usan ', { v: 'c-d', t: f(t) }, ' cifras.'],
        };
      },
    },
    ahoraTu: {
      pieza: 'arit-tabla',
      generar(s) {
        const q = azar(s);
        if (s % 2 === 1) {
          const base = q.ent(2, 9), k = q.ent(2, 4), n = (base - 1) * base ** (k - 1);
          return {
            pregunta: ['¿Cuántos números de ', `${k} cifras hay en base `, { v: 'c-o', t: String(base) }, '?'],
            opciones: opciones(n, [
              { id: 'todos', valor: base ** k, error: 'AT-CERO', siFuera: 'Eso admite el 0 como primera cifra.' },
              { id: 'sin-mas1', valor: n - 1, error: 'AT-CONTEO', siFuera: 'De a hasta z hay z − a + 1 números, no z − a.' },
              { id: 'diez', valor: 9 * 10 ** (k - 1), error: 'AT-DECIMAL', siFuera: 'Esa es la cuenta en base 10.' },
            ], x => f(x)),
            solucion: { texto: `La primera cifra tiene ${base - 1} opciones; las otras, ${base} cada una.`, ecuacion: [`(${base} − 1) · ${base}${sup(k - 1)} = ${f(n)}`] },
          };
        }
        const P = q.ent(110, 600), t = totalCifras(P);
        return {
          pregunta: `¿Cuántas cifras se usan para numerar las páginas de un libro de 1 a ${P}?`,
          dibujo: { datos: tablaBloques(P, 0), estado: {} },
          opciones: opciones(t, [
            { id: 'tres', valor: 3 * P, error: 'AT-BLOQUE', siFuera: 'No todas las páginas tienen tres cifras.' },
            { id: 'sin-mas1', valor: t - 3, error: 'AT-CONTEO', siFuera: `Del 100 al ${P} hay ${P - 99} páginas, no ${P - 100}.` },
            { id: 'sin-unidades', valor: t - 9, error: 'AT-BLOQUE', siFuera: 'Falta el bloque de 1 a 9.' },
          ], x => f(x)),
          solucion: { texto: 'Bloques de 1, 2 y 3 cifras.', ecuacion: [`9 + 180 + ${P - 99} · 3 = ${f(t)}`], dibujo: { datos: tablaBloques(P), estado: {} } },
        };
      },
    },
  };

  // Fichas del laboratorio: tamaño fijo de 16 (con 40 fichas en base 4 son 10 filas), para que el borde de la fila
  // quede en centro + b · 16 / 2 en todos los casos.
  const fichasLab = (n, base) => {
    const q = Math.floor(n / base), s = n % base;
    return { bloques: [{ n, columnas: base, color: 'i', marcoFilas: true, rotulo: `${n} = ${nb(enBase(n, base), base)}`, tramos: s ? [{ de: n - s, a: n - 1, color: 'h' }] : [] }], altoMax: 160, ficha: 16, alt: `${n} fichas en filas de ${base}: ${q} grupos completos y ${s} sueltas` };
  };

  // Mesa 3D (ronda 4, docs/3d.md, 3D de contexto): los bloques de base b. Una barra son b cubitos, una placa son b
  // barras y un cubo son b placas: el tercer lugar ya no cabe en el plano.
  // Cambia: la base y cuántas piezas hay de cada clase · Permanece: cada pieza armada con b piezas de la anterior ·
  // Progresa: el valor en base 10 · Se reserva: el naranja, para una clase con b piezas o más (se puede canjear) ·
  // Debe verse: un numeral es lo que queda cuando ya no se puede canjear nada. Cuánto vale y si es numeral: MN.estado.
  const sub = subi;
  const PIEZAS = [['u', 'unidades', 'unidad'], ['d', 'barras', 'barra'], ['c', 'placas', 'placa'], ['m', 'cubos', 'cubo']];
  const bloquesDe = v => MN.estado([v.u, v.d, v.c, v.m], v.b);
  function datosBloques(v) {
    const b = v.b, e = bloquesDe(v), bloques = [], grupos = [], rot = [];
    let x0 = 0;
    // De la clase más grande a la más chica, de izquierda a derecha; cada una en una pila.
    [3, 2, 1, 0].forEach(k => {
      const n = v[PIEZAS[k][0]];
      if (!n) return;
      const g = grupos.length, lleno = n >= b;
      grupos.push({ nombre: PIEZAS[k][1], color: lleno ? 'c-o' : 'c-i', rotulo: String(n), rotuloEn: [x0 + (k ? b : 1) / 2, -1.2, 0],
        dice: `${n} ${n === 1 ? PIEZAS[k][2] : PIEZAS[k][1]} de ${b ** k} cada ${k === 2 || k === 0 ? 'una' : 'uno'}` + (lleno ? `: con ${b} se canjea` : '') });
      for (let j = 0; j < n; j++) {
        if (k === 3) for (let t = 0; t < b; t++) bloques.push({ x: x0 + j * (b + 0.6), y: 0, z: t, w: b, h: b, d: 1, g });
        else if (k === 2) for (let t = 0; t < b; t++) bloques.push({ x: x0, y: t, z: j, w: b, h: 1, d: 1, g });
        else if (k === 1) for (let t = 0; t < b; t++) bloques.push({ x: x0 + t, y: 0, z: j, g });
        else bloques.push({ x: x0 + (j % 4) * 1.2, y: Math.floor(j / 4) * 1.2, z: 0, g });
      }
      x0 += (k === 3 ? n * (b + 0.6) : k === 0 ? 4.8 : b) + 1.2;
    });
    if (!bloques.length) { bloques.push({ x: 0, y: 0, z: 0, w: 0.2, h: 0.2, d: 0.2, g: 0 }); grupos.push({ nombre: 'nada', dice: 'No hay piezas' }); }
    return { bloques, grupos, hueco: 0.12,
      alt: `Bloques de base ${b}: ${PIEZAS.map(([id, pl]) => `${v[id]} ${pl}`).reverse().join(', ')}; valen ${e.fichas}` + (e.normal ? `, el numeral (${e.texto})${sub(b)}.` : '; todavía se puede canjear.') };
  }
  const mesaBloques = {
    id: 'bloques-base', titulo: 'Bloques de base b', pieza: 'ari-cubitos-3d',
    consigna: 'Una barra son b cubitos; una placa, b barras; un cubo, b placas. Gira las piezas y canjea las que lleguen a b.',
    // 9 · 3 · 9 · 9 · 9 = 19 683 casos: «Muéstrame» recorre toda la grilla (con más de 20 000 solo mira una muestra).
    controles: [
      { id: 'b', etiqueta: 'b', color: 'c-o', min: 2, max: 10, paso: 1, inicio: 4, decimales: 0 },
      { id: 'm', etiqueta: 'cubos', color: 'c-i', min: 0, max: 2, paso: 1, inicio: 0, decimales: 0 },
      { id: 'c', etiqueta: 'placas', color: 'c-i', min: 0, max: 8, paso: 1, inicio: 1, decimales: 0 },
      { id: 'd', etiqueta: 'barras', color: 'c-i', min: 0, max: 8, paso: 1, inicio: 2, decimales: 0 },
      { id: 'u', etiqueta: 'unidades', color: 'c-i', min: 0, max: 8, paso: 1, inicio: 5, decimales: 0 },
    ],
    dibujo: v => ({ datos: datosBloques(v), estado: {} }),
    lectura: v => { const e = bloquesDe(v); return e.normal ? [`(${e.texto})${sub(v.b)} = `, { v: 'c-d', t: String(e.fichas) }] : [`Valen `, { v: 'c-d', t: String(e.fichas) }, ': aún se puede canjear']; },
    invitaciones: [
      { texto: 'En base 4, arma 23 sin que ninguna clase llegue a 4 piezas.',
        logrado: v => v.b === 4 && bloquesDe(v).normal && bloquesDe(v).fichas === 23,
        testigo: [{ b: 4, m: 0, c: 1, d: 1, u: 3 }],
        bien: '23 = (113)₄: una placa, una barra y tres unidades.',
        pista: 'Junta 4 unidades en una barra y 4 barras en una placa.' },
      { texto: 'Arma el mayor número de tres cifras en base 5.',
        logrado: v => v.b === 5 && v.m === 0 && bloquesDe(v).texto === '444',
        bien: '(444)₅ = 124: con una unidad más se completa el cubo, 5³ = 125.',
        pista: 'En base 5 ninguna cifra llega a 5: pon 4 de cada pieza.' },
      { texto: 'En base 2, arma 13 con un cubo.',
        logrado: v => v.b === 2 && v.m === 1 && bloquesDe(v).normal && bloquesDe(v).fichas === 13,
        testigo: [{ b: 2, m: 1, c: 1, d: 0, u: 1 }],
        bien: '13 = 8 + 4 + 1 = (1101)₂: cada pieza va una vez o no va.',
        pista: 'El cubo vale 8. ¿Qué piezas de 4, 2 y 1 faltan para 13?' },
      { texto: 'En base 10, arma un numeral de tres cifras que copie la cantidad.',
        logrado: v => v.b === 10 && bloquesDe(v).normal && bloquesDe(v).fichas >= 100 && bloquesDe(v).texto === String(bloquesDe(v).fichas),
        bien: 'Solo en base 10 las cifras copian la cantidad: (100)₄ es apenas 16.',
        pista: 'Sube b a 10 y pon al menos una placa.' },
      { texto: 'Guarda la misma cantidad dos veces: como numeral y sin canjear.',
        logrado: (v, g) => g.some(x => g.some(y => x.b === y.b && bloquesDe(x).fichas === bloquesDe(y).fichas && bloquesDe(x).normal && !bloquesDe(y).normal)),
        testigo: [{ b: 4, m: 0, c: 1, d: 3, u: 1 }, { b: 4, m: 0, c: 1, d: 2, u: 5 }],
        bien: 'Canjear no cambia cuánto hay: cambia cuántas piezas lo dicen.',
        pista: 'Guarda un numeral; luego abre una barra en b unidades y guarda otra vez.' },
    ],
  };

  return {
    unidad: 'aritmetica.numeracion',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-fichas.js', '/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/arit-tiras.js', '/plantillas/numeracion/motor.js', '/nucleo/kit/piezas/ari-cubitos-3d.js'],
    // Glosario: las palabras que esta unidad estrena en el curso (docs/teoria.md §4d).
    glosario: [
      { termino: 'sistema de numeración', def: 'Conjunto de símbolos y reglas para escribir y leer cualquier número.',
        formas: ['sistema de numeración', 'sistemas de numeración'], ver: ['base de numeración', 'cifra'] },
      { termino: 'base de numeración', simbolo: 'b', def: 'Cuántas unidades de un orden se canjean por una del orden siguiente.',
        formas: ['base de numeración', 'bases de numeración'], ejemplo: 'En base 5, cinco sueltas forman un grupo: 5 = (10)₅.', ver: ['cifra', 'numeral'] },
      { termino: 'cifra', simbolo: 'd', def: 'Cada símbolo con que se escribe un número. En base b va de 0 a b − 1.',
        ejemplo: 'En base 4 solo hay cuatro: 0, 1, 2 y 3.', ver: ['numeral'] },
      { termino: 'numeral', def: 'La escritura de un número con cifras. Un mismo número tiene distinta escritura en cada base.',
        ejemplo: 'Treinta se escribe (30) en base 10 y (132)₄ en base 4.', ver: ['cifra', 'base de numeración'] },
      { termino: 'potencia', def: 'Resultado de multiplicar un número por sí mismo varias veces; el exponente dice cuántas.',
        ejemplo: '4² = 4 · 4 = 16 y 2³ = 2 · 2 · 2 = 8.' },
      { termino: 'descomposición polinómica', def: 'Escribir un numeral como suma de cada cifra por la potencia de la base de su lugar.',
        ejemplo: '(132)₄ = 1 · 16 + 3 · 4 + 2 = 30.', ver: ['potencia', 'numeral'] },
      { termino: 'resto', simbolo: 'r', def: 'Lo que sobra al dividir sin pasarse: es menor que el divisor y puede ser 0.',
        ejemplo: '19 entre 3: cociente 6 y sobra 1, porque 3 · 6 + 1 = 19.' },
      { termino: 'cambio de base', def: 'Escribir el mismo número en otra base: se divide entre la nueva base y se leen los restos.',
        ejemplo: '19 = (201)₃, porque los restos salen 1, 0 y 2.', ver: ['resto', 'base de numeración'] },
    ],
    // Laboratorio: juego libre, sin preguntas. «Canje amplio» abre la base de 4 a 10 (incluye base 10, el caso que
    // el juego no deja) y hasta 40 fichas; «Libros largos» llega a 1500 páginas, con el bloque de cuatro cifras.
    laboratorio: [
      mesaBloques,
      {
        id: 'canje-amplio', titulo: 'Canje amplio', pieza: 'arit-fichas',
        consigna: 'Hasta 40 fichas y bases de 4 a 10. Tira del borde de la fila para cambiar la base.',
        controles: [
          { id: 'n', etiqueta: 'Fichas', min: 3, max: 40, paso: 1, inicio: 30, decimales: 0 },
          { id: 'b', etiqueta: 'b', color: 'c-o', min: 4, max: 10, paso: 1, inicio: 7, decimales: 0 },
        ],
        dibujo: v => ({ datos: fichasLab(v.n, v.b), estado: {} }),
        lectura: v => [`${v.n} fichas en base ${v.b}: ${nb(enBase(v.n, v.b), v.b)}`],
        // Retos: cada uno lee el numeral con enBase, la misma función que rotula las fichas.
        invitaciones: [
          { texto: 'Consigue un numeral que termine en 0: ninguna ficha suelta.',
            logrado: v => enBase(v.n, v.b).endsWith('0'),
            bien: 'Sin sueltas, la cifra de las unidades es 0. ¿Pasa en otra base?' },
          { texto: 'Con 40 fichas, busca la base más chica que las escriba con dos cifras.',
            logrado: v => v.n === 40 && enBase(v.n, v.b).length === 2 && enBase(v.n, v.b - 1).length > 2,
            bien: 'Base 7: 40 = (55)₇. Con una base menos, ya hacen falta tres cifras.' },
          { texto: 'Arma un numeral de tres cifras iguales.',
            logrado: v => /^(\d)\1\1$/.test(enBase(v.n, v.b)),
            bien: 'Tres unos: un grupo de grupos, un grupo y una suelta.' },
          { texto: 'Haz que el numeral copie la cantidad de fichas, con dos cifras o más.',
            logrado: v => v.n >= 10 && enBase(v.n, v.b) === String(v.n),
            bien: 'Solo en base 10 el numeral copia la cantidad. Por eso (132)₄ no es 132.' },
          { texto: 'Guarda dos casos con las mismas cifras en bases distintas.',
            logrado: (v, guardados) => guardados.some(g => g.b !== v.b && enBase(g.n, g.b) === enBase(v.n, v.b)),
            bien: 'Mismas cifras, distinta cantidad: el numeral solo no dice cuánto es.' },
        ],
        arrastres: [{ id: 'fila', etiqueta: 'largo de la fila (la base)', color: 'c-o',
          donde: v => bordeFila(fichasLab(v.n, v.b), v.b),
          mover: (pt, v) => ({ b: baseEn(fichasLab(v.n, v.b), pt.x) }) }],
      },
      {
        id: 'libros-largos', titulo: 'Libros largos', pieza: 'arit-tiras',
        consigna: 'Libros de hasta 1500 páginas. Arrastra el final de la tira de páginas y mira el bloque de cuatro cifras.',
        controles: [{ id: 'P', etiqueta: 'Última página', min: 5, max: 1500, paso: 5, inicio: 1200, decimales: 0 }],
        dibujo: v => ({ datos: tirasPaginas(v.P, 4900), estado: {} }),
        lectura: v => [`De 1 a ${v.P}: `, { v: 'c-d', t: String(totalCifras(v.P)) }, ' cifras'],
        // Retos: bloques() y totalCifras() son las mismas que arman las tiras.
        invitaciones: [
          { texto: 'Encuentra el libro que usa justo 1002 cifras.',
            logrado: v => totalCifras(v.P) === 1002,
            bien: 'Página 370: 9 + 180 + 813. ¿Cuántas páginas tienen tres cifras?' },
          { texto: 'Busca el libro más corto que ya tenga una página de cuatro cifras.',
            logrado: v => { const u = bloques(v.P).pop(); return u.k === 4 && u.cuantos === 1; },
            bien: 'La página 1000 es la primera de cuatro cifras: 10³.' },
          { texto: 'Haz que la tira de cifras tenga solo dos bloques.',
            logrado: v => bloques(v.P).length === 2,
            bien: 'Hasta la página 99 solo hay números de una y de dos cifras.' },
          { texto: 'Guarda dos libros que se lleven 5 páginas y 15 cifras.',
            logrado: (v, guardados) => guardados.some(g => Math.abs(g.P - v.P) === 5 && Math.abs(totalCifras(g.P) - totalCifras(v.P)) === 15),
            bien: 'Cinco páginas de tres cifras: 15 cifras más. Cada bloque cobra distinto.' },
        ],
        arrastres: [finLibro('P', 4900)],
      },
    ],
    historia: {
      texto: 'El sistema de numeración que usamos se fue armando entre la India, las sociedades de lengua árabe y Europa, durante siglos y con sistemas que convivían. Nadie la inventó de una vez. Su idea clave es que un símbolo vale según el lugar que ocupa. Escribir un número en otra base cambia cómo se ve, no cuánto es.',
      pregunta: '¿Qué cambia si contamos de cinco en cinco?',
      fuente: { titulo: 'O’Connor y Robertson, Arabic numerals — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Arabic_numerals/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'bloques-base': ['agrupar', 'descomposicion'],
      'canje-amplio': ['agrupar'],
      'libros-largos': ['conteo-cifras'],
    },
    ideas: [agrupar, descomposicion, cambio, conteo],
  };
});
