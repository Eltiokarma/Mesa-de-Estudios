/*
 * Teoría de «Análisis combinatorio» (aritmetica.analisis-combinatorio). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 9) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: AR17 (orden donde no importa, o al revés), AR18 (enumerar sin sistema), AR19 (repetición) de
 * docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: antes de elegir fórmula, decidir qué hace iguales a dos resultados.
 *   Persona y condiciones: postulante de 4.º y 5.º, celular de 360 px, sin audio.
 *   Resultado observable: cuenta menús, filas, rondas, anagramas y equipos, y dice por qué usó esa cuenta.
 *   Orden de atención: 1.º los casilleros o la lista de casos · 2.º el número que los resume · acción: el botón fijo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · casos que se agrupan · caso nuevo · «No sé».
 *   Duda que resuelve: «¿cuándo divido entre r! y cuándo no?».
 * Colores (regla 4): n (cuántos hay) naranja (c-o), r (cuántos se eligen o puestos) turquesa (c-i), el resultado
 * verde (c-d) y lo que se repite o se agrupa, rojo (c-h). Piezas: arit-tabla y arit-fichas.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (x, d = 0) => Kit.formatear(x, d);
  const N = { v: 'c-o', t: 'n' }, R = { v: 'c-i', t: 'r' };
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt = x => f(x)) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || !Number.isFinite(d.valor) || d.valor < 0) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const fact = k => (k <= 1 ? 1 : k * fact(k - 1));
  const V = (n, r) => (r > n ? 0 : fact(n) / fact(n - r));
  const C = (n, r) => (r > n ? 0 : fact(n) / (fact(r) * fact(n - r)));
  const LET = ['A', 'B', 'C', 'D', 'E', 'F'];
  function combinaciones(xs, r) {
    if (r === 0) return [[]];
    if (xs.length < r) return [];
    const [h, ...t] = xs;
    return [...combinaciones(t, r - 1).map(c => [h, ...c]), ...combinaciones(t, r)];
  }
  function anagramas(pal) {
    const out = new Set();
    const ir = (resto, pre) => { if (!resto.length) { out.add(pre); return; } for (let i = 0; i < resto.length; i++) ir(resto.slice(0, i) + resto.slice(i + 1), pre + resto[i]); };
    ir(pal, '');
    return [...out].sort();
  }
  const repes = pal => { const c = {}; for (const x of pal) c[x] = (c[x] || 0) + 1; return Object.values(c).filter(k => k > 1); };

  // Dos grupos de fichas, uno al lado del otro (sin multiplicar: eso es lo que se pregunta).
  const dos = (m, k, rot) => ({ bloques: [{ n: m, columnas: 1, color: 'o', rotulo: rot[0] }, { n: k, columnas: 1, color: 'i', rotulo: rot[1] }], ficha: 22, altoMax: 160 });

  // ---------- Idea 1: «y» multiplica, «o» suma ----------
  // Cambia: cuántas entradas y cuántos segundos. Permanece: una casilla por menú. Progresa: el rectángulo de casillas.
  // Se reserva: una elección con «o» (una sola cosa). Debe verse: «y» llena un rectángulo; «o» pone bloques lado a lado.
  const ENT = ['sopa', 'ceviche', 'papa', 'tamal'], SEG = ['lomo', 'ají', 'trucha', 'cuy'];
  const menu = (e, s) => ({ columnas: ['', ...SEG.slice(0, s).map(t => ({ t, color: 'i' }))], cabeza: true, filasMax: 4,
    filas: ENT.slice(0, e).map(t => [{ t, color: 'o' }, ...SEG.slice(0, s).map(() => ({ t: '●', color: 'd' }))]) });
  const principios = {
    id: 'principios',
    titulo: '«Y» multiplica, «o» suma',
    temas: ['Principios de adición y multiplicación'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Un menú tiene una entrada y un segundo. Elige cuántos hay de cada uno: cada punto es un menú distinto.',
      voz: 'Cuenta los puntos: filas por columnas.',
      controles: [
        { id: 'e', etiqueta: 'Entradas', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 's', etiqueta: 'Segundos', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 3, decimales: 0 },
      ],
      dibujo: v => ({ datos: menu(v.e, v.s), estado: {} }),
      lectura: v => [`${v.e} entradas y ${v.s} segundos: ${v.e * v.s} menús`],
      minimo: 3,
    },
    predice: {
      pregunta: 'De Juliaca a Puno puedes ir en una de 3 combis o en uno de 2 buses. ¿De cuántas formas puedes viajar?',
      opciones: [
        { id: 'c', texto: '5', correcta: true },
        { id: 'por', texto: '6', error: 'AT-Y-O', siFuera: '6 sería cierto si tomaras una combi Y un bus. Aquí tomas uno o el otro.' },
        { id: 'uno', texto: '3', error: 'AT-Y-O', siFuera: 'Faltan los buses: también son formas de viajar.' },
      ],
      pieza: 'arit-fichas',
      dibujo: { datos: { bloques: [{ n: 3, columnas: 3, color: 'o', rotulo: 'combis' }, { n: 2, columnas: 2, color: 'i', rotulo: 'buses' }], ficha: 26, altoMax: 60 }, estado: {} },
      revelar: { datos: { bloques: [{ n: 3, columnas: 3, color: 'o', rotulo: 'combis' }, { n: 2, columnas: 2, color: 'i', rotulo: 'buses' }], ficha: 26, altoMax: 60 }, estado: {} },
      coincide: 'Coincide: son 3 + 2 opciones que no se mezclan.',
    },
    mira: {
      pieza: 'arit-fichas',
      datos: { bloques: [
        { n: 3, columnas: 1, color: 'o', rotulo: '3' },
        { n: 2, columnas: 1, color: 'i', rotulo: '+ 2' },
        { n: 6, columnas: 2, color: 'd', rotulo: '3 · 2', marcoFilas: true, paso: 2 },
      ], ficha: 26, altoMax: 80 },
      pasos: [
        { estado: { paso: 1 }, texto: 'Una sola elección: o combi o bus. Se juntan las opciones.', ecuacion: ['3 + 2 = 5'] },
        { estado: { paso: 2 }, texto: 'Si vas en combi y vuelves en bus, cada combi va con cada bus.', ecuacion: ['3 · 2 = 6'] },
      ],
    },
    regla: {
      texto: 'Si se hace una etapa y después otra, las formas se multiplican. Si se elige una sola opción entre grupos que no se mezclan, se suman.',
      ecuacion: ['«y»: m · k   ·   «o»: m + k'],
      condicion: 'en «o», ninguna opción está en los dos grupos; si alguna se repite, se resta. En «y», las etapas son independientes.',
    },
    ahoraTu: {
      pieza: 'arit-fichas',
      generar(s) {
        const r = azar(s), m = r.ent(2, 7), k = r.ent(2, 6), y = s % 2 === 0;
        const t = r.ent(2, 4);
        if (s % 5 === 4) return {
          pregunta: `Un uniforme lleva un polo (${m} colores), un short (${k} colores) y unas medias (${t} colores). ¿Cuántos uniformes distintos hay?`,
          opciones: opciones(m * k * t, [
            { id: 'suma', valor: m + k + t, error: 'AT-Y-O', siFuera: 'Eso sería elegir una sola prenda. Aquí se elige una de cada.' },
            { id: 'dos', valor: m * k, error: 'AT-Y-O', siFuera: 'Falta la etapa de las medias.' },
            { id: 'pot', valor: (m + k + t) * 2, error: 'AT-Y-O', siFuera: 'Cada etapa multiplica las anteriores.' },
          ]),
          solucion: { texto: 'Tres etapas, una tras otra: se multiplican.', ecuacion: [`${m} · ${k} · ${t} = ${m * k * t}`] },
        };
        return {
          pregunta: y ? `Hay ${m} caminos de A a B y ${k} de B a C. ¿De cuántas formas se va de A a C pasando por B?` : `Para el almuerzo eliges un plato: ${m} de carne o ${k} vegetarianos. ¿Cuántas opciones tienes?`,
          dibujo: { datos: dos(m, k, [String(m), String(k)]), estado: {} },
          opciones: opciones(y ? m * k : m + k, [
            { id: 'otro', valor: y ? m + k : m * k, error: 'AT-Y-O', siFuera: y ? 'Sumar sería elegir un solo tramo. Aquí se recorren los dos.' : 'Multiplicar sería comer uno de cada. Aquí eliges uno solo.' },
            { id: 'mayor', valor: Math.max(m, k), error: 'AT-Y-O', siFuera: 'Eso cuenta solo uno de los grupos.' },
            { id: 'pot', valor: m ** k, error: 'AR19', siFuera: 'Eso sería repetir una elección de m opciones k veces.' },
          ]),
          solucion: { texto: y ? 'Dos etapas: cada camino del primer tramo sigue con cada uno del segundo.' : 'Una sola elección entre grupos que no se mezclan.', ecuacion: [y ? `${m} · ${k} = ${m * k}` : `${m} + ${k} = ${m + k}`], dibujo: y ? { datos: { bloques: [{ n: m * k, columnas: k, color: 'd', rotulo: `${m} · ${k}`, marcoFilas: true }], ficha: 22, altoMax: 160 }, estado: {} } : undefined },
        };
      },
    },
  };

  // ---------- Idea 2: casilleros que se van quedando sin opciones: factorial y variaciones ----------
  // Cambia: cuántos objetos hay y cuántos puestos se llenan. Permanece: un casillero por puesto, de izquierda a derecha.
  // Progresa: cada casillero tiene una opción menos. Se reserva: llenar todos los puestos (n!). Debe verse: n, n − 1, n − 2…
  const casilleros = (n, r, rep = false) => ({
    columnas: ['puesto', ...Array.from({ length: r }, (_, k) => ({ t: `${k + 1}.º`, color: 'i' }))], cabeza: true, filasMax: 1,
    filas: [[{ t: 'opciones', color: 'o' }, ...Array.from({ length: r }, (_, k) => ({ t: String(rep ? n : Math.max(0, n - k)), color: 'd', paso: k + 1 }))]],
  });
  const variaciones = {
    id: 'variaciones',
    titulo: 'Cada puesto, una opción menos',
    temas: ['Factorial', 'Variaciones', 'Permutaciones lineales y circulares'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Hay n personas distintas y r puestos en fila. Mira cuántas opciones quedan para cada puesto.',
      voz: 'Quien ya se sentó no vuelve a estar disponible.',
      controles: [
        { id: 'n', etiqueta: 'n', color: 'c-o', min: 2, max: 7, paso: 1, inicio: 5, decimales: 0 },
        { id: 'r', etiqueta: 'r', color: 'c-i', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => ({ datos: casilleros(v.n, v.r), estado: { paso: v.r } }),
      lectura: v => [`${Array.from({ length: v.r }, (_, k) => Math.max(0, v.n - k)).join(' · ')} = ${f(V(v.n, v.r))} filas`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿De cuántas formas se pueden ordenar 5 libros distintos en un estante?',
      opciones: [
        { id: 'c', texto: '120', correcta: true },
        { id: 'pot', texto: '3 125', error: 'AR19', siFuera: 'Sería cierto si un libro pudiera ir en dos lugares a la vez. Cada uno se usa una vez.' },
        { id: 'suma', texto: '15', error: 'AT-SUMA-PRODUCTO', siFuera: 'Eso suma 5 + 4 + 3 + 2 + 1; los puestos se llenan uno y otro: se multiplica.' },
        { id: 'cuad', texto: '25', error: 'AT-SUMA-PRODUCTO', siFuera: '5 · 5 cuenta dos puestos con repetición, no cinco.' },
      ],
      dibujo: { datos: casilleros(5, 5), estado: { paso: 0 } },
      revelar: { datos: casilleros(5, 5), estado: { paso: 5 } },
      coincide: 'Coincide: 5 · 4 · 3 · 2 · 1 = 120.',
    },
    mira: {
      datos: casilleros(5, 5),
      pasos: [
        { estado: { paso: 1 }, texto: 'Para el primer lugar hay 5 libros.', ecuacion: ['5'] },
        { estado: { paso: 2 }, texto: 'Para el segundo quedan 4: por cada primero, 4 segundos.', ecuacion: ['5 · 4 = 20'] },
        { estado: { paso: 5 }, texto: 'Así hasta el último, que ya no tiene opción.', ecuacion: ['5! = 5 · 4 · 3 · 2 · 1 = 120'] },
      ],
    },
    regla: {
      texto: 'Ordenar r de n objetos distintos da n(n − 1)… con r factores: es la variación. Si se ordenan todos, es n factorial.',
      ecuacion: [{ sub: ['V', [N, ',', R]] }, ' = ', { frac: [[N, '!'], ['(', N, ' − ', R, ')!']] }, '   ·   ', { sub: ['P', N] }, ' = ', N, '!'],
      condicion: 'objetos distintos, sin repetir y el orden importa. 0! = 1. Si se puede repetir, cada puesto tiene n opciones: nʳ.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n = r.ent(5, 9), k = r.ent(2, 4);
        if (s % 3 === 2) {
          const d = r.de([3, 4]);
          return {
            pregunta: `¿Cuántas claves de ${d} dígitos (del 0 al 9) hay si los dígitos se pueden repetir?`,
            dibujo: { datos: casilleros(10, d, true), estado: { paso: d } },
            opciones: opciones(10 ** d, [
              { id: 'sin', valor: V(10, d), error: 'AR19', siFuera: 'Eso no deja repetir dígitos; aquí sí se puede.' },
              { id: 'prod', valor: 10 * d, error: 'AT-SUMA-PRODUCTO', siFuera: 'Cada casillero multiplica: son d factores de 10.' },
              { id: 'comb', valor: C(10, d), error: 'AR17', siFuera: 'En una clave el orden importa: 123 no es 321.' },
            ]),
            solucion: { texto: 'Cada dígito tiene 10 opciones, aunque repita.', ecuacion: [{ sup: ['10', String(d)] }, ` = ${f(10 ** d)}`] },
          };
        }
        return {
          pregunta: `En un concurso con ${n} participantes, ¿de cuántas formas se reparten ${k === 2 ? 'el 1.º y el 2.º puesto' : k === 3 ? 'oro, plata y bronce' : 'los 4 primeros puestos'}?`,
          dibujo: { datos: casilleros(n, k), estado: { paso: 0 } },
          opciones: opciones(V(n, k), [
            { id: 'comb', valor: C(n, k), error: 'AR17', siFuera: 'Eso divide entre el orden, pero los puestos son distintos.' },
            { id: 'pot', valor: n ** k, error: 'AR19', siFuera: 'Eso deja que alguien gane dos puestos.' },
            { id: 'fact', valor: fact(n), error: 'AT-TODOS', siFuera: `Eso ordena a los ${n}; solo se reparten ${k} puestos.` },
          ]),
          solucion: { texto: `${k} casilleros, cada uno con una opción menos.`, ecuacion: [`${Array.from({ length: k }, (_, j) => n - j).join(' · ')} = ${f(V(n, k))}`], dibujo: { datos: casilleros(n, k), estado: { paso: k } } },
        };
      },
    },
  };

  // ---------- Idea 3: en ronda, los giros son la misma disposición ----------
  // Cambia: cuántas personas hay en la mesa. Permanece: una disposición y sus giros, fila por fila.
  // Progresa: las n filas de giros de una sola mesa. Se reserva: el total para 5 personas. Debe verse: n filas = 1 mesa.
  const giros = (n, porFila = false) => {
    const g = LET.slice(0, n);
    return { columnas: ['giro', ...g.map((_, k) => ({ t: `silla ${k + 1}`, color: 'i' }))], cabeza: true, filasMax: 5,
      filas: g.map((_, k) => [{ t: String(k + 1), color: 'h', paso: porFila ? k + 1 : 0 }, ...g.map((_, j) => ({ t: g[(j + k) % n], color: 'o', paso: porFila ? k + 1 : 0 }))]) };
  };
  const circular = {
    id: 'circular',
    titulo: 'En ronda, girar no cambia nada',
    temas: ['Permutaciones lineales y circulares'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'n amigos se sientan en una mesa redonda. Cada fila corre a todos una silla: los vecinos de cada uno no cambian.',
      voz: 'Fíjate: todas las filas son la misma ronda.',
      controles: [{ id: 'n', etiqueta: 'n', color: 'c-o', min: 3, max: 5, paso: 1, inicio: 4, decimales: 0 }],
      dibujo: v => ({ datos: giros(v.n), estado: {} }),
      lectura: v => [`${v.n} órdenes en fila, una sola ronda`],
      minimo: 2,
    },
    predice: {
      pregunta: '¿De cuántas formas distintas se pueden sentar 5 personas en una mesa redonda?',
      opciones: [
        { id: 'c', texto: '24', correcta: true },
        { id: 'fila', texto: '120', error: 'AT-CIRCULAR', siFuera: '120 cuenta filas. En la ronda, cada disposición aparece 5 veces girada.' },
        { id: 'collar', texto: '12', error: 'AT-CIRCULAR', siFuera: 'Sería cierto si también reflejar fuera lo mismo, como en un collar.' },
        { id: 'n', texto: '5', error: 'AT-CIRCULAR', siFuera: 'Eso cuenta los giros de una sola ronda.' },
      ],
      dibujo: { datos: giros(5), estado: {} },
      revelar: { datos: giros(5), estado: { columna: 1 } },
      coincide: 'Coincide: 120 órdenes en fila, agrupados de 5 en 5.',
    },
    mira: {
      datos: giros(4, true),
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: 'En fila, 4 personas se ordenan de 4! = 24 formas.', ecuacion: ['4! = 24'] },
        { estado: { paso: 4, fila: [0, 1, 2, 3] }, texto: 'En ronda, estos 4 giros son la misma mesa.', ecuacion: ['cada ronda = 4 filas'] },
        { estado: { paso: 4, columna: 1 }, texto: 'Fijamos a A en una silla y ordenamos al resto.', ecuacion: [{ frac: ['4!', '4'] }, ' = 3! = 6'] },
      ],
    },
    regla: {
      texto: 'En una ronda, girar a todos no cambia la disposición. Se fija a una persona y se ordenan las demás en fila.',
      ecuacion: [{ sub: ['P', ['c', '(', N, ')']] }, ' = (', N, ' − 1)!'],
      condicion: 'personas distintas y solo los giros se toman como iguales. Si también reflejar es igual (un collar), se divide entre 2.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n = r.ent(4, 8), ronda = s % 3 !== 2;
        return {
          pregunta: ronda ? `¿De cuántas formas se sientan ${n} personas alrededor de una mesa redonda?` : `¿De cuántas formas se sientan ${n} personas en una banca de ${n} asientos?`,
          dibujo: { datos: giros(Math.min(n, 5)), estado: {} },
          opciones: opciones(ronda ? fact(n - 1) : fact(n), [
            { id: 'otro', valor: ronda ? fact(n) : fact(n - 1), error: 'AT-CIRCULAR', siFuera: ronda ? 'Eso cuenta filas: en ronda, cada disposición aparece n veces girada.' : 'En una banca hay un primer asiento: girar sí cambia.' },
            { id: 'collar', valor: fact(n - 1) / 2, error: 'AT-CIRCULAR', siFuera: 'Dividir entre 2 vale si reflejar es igual, como en un collar.' },
            { id: 'n', valor: n * (n - 1), error: 'AT-TODOS', siFuera: 'Eso llena solo dos asientos.' },
          ]),
          solucion: { texto: ronda ? 'Se fija una persona y se ordenan las demás.' : 'Es una fila: se ordenan todos.', ecuacion: [ronda ? `(${n} − 1)! = ${f(fact(n - 1))}` : `${n}! = ${f(fact(n))}`] },
        };
      },
    },
  };

  // ---------- Idea 4: letras repetidas, órdenes que se ven iguales ----------
  // Cambia: la palabra. Permanece: la lista de anagramas distintos, de tres en tres. Progresa: cuántos hay.
  // Se reserva: una palabra con dos letras repetidas (BANANA). Debe verse: intercambiar dos A iguales no da otra palabra.
  const PAL = ['SOL', 'ANA', 'OSO', 'PAPA', 'CASA', 'LOLA'];
  const lista = (pal, extra = {}) => {
    const xs = anagramas(pal), filas = [];
    for (let i = 0; i < xs.length; i += 3) filas.push([xs[i], xs[i + 1] || '', xs[i + 2] || '']);
    return Object.assign({ columnas: [{ t: pal, color: 'o' }, '', ''], filas, filasMax: 4 }, extra);
  };
  const casa = { columnas: [{ t: 'con A₁ y A₂', color: 'o' }, { t: 'se lee', color: 'd' }], filasMax: 4,
    filas: [['C A₁ S A₂', { t: 'CASA', paso: 1 }], ['C A₂ S A₁', { t: 'CASA', paso: 1, resalta: true, color: 'd' }], ['A₁ C A₂ S', { t: 'ACAS', paso: 2 }], ['A₂ C A₁ S', { t: 'ACAS', paso: 2, resalta: true, color: 'd' }]] };
  const repeticion = {
    id: 'repeticion',
    titulo: 'Letras iguales, palabras iguales',
    temas: ['Permutaciones con repetición'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'Elige una palabra y mira todos sus ordenamientos distintos. Compara las que repiten una letra con las que no.',
      voz: 'Compara SOL con OSO: mismo largo, distinta cuenta.',
      controles: [{ id: 'p', etiqueta: 'Palabra', opciones: PAL.map(t => ({ valor: t, texto: t })), inicio: 'SOL' }],
      dibujo: v => ({ datos: lista(v.p), estado: {} }),
      lectura: v => [`${v.p}: ${anagramas(v.p).length} distintas de ${fact(v.p.length)} órdenes`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuántas palabras distintas (con o sin sentido) se forman con todas las letras de BANANA?',
      opciones: [
        { id: 'c', texto: '60', correcta: true },
        { id: 'todos', texto: '720', error: 'AT-REPETIDOS', siFuera: '720 = 6! sería cierto si las seis letras fueran distintas.' },
        { id: 'una', texto: '120', error: 'AT-REPETIDOS', siFuera: 'Eso descuenta las tres A, pero las dos N también se repiten.' },
        { id: 'resta', texto: '715', error: 'AT-REPETIDOS', siFuera: 'Lo repetido no se resta: cada palabra aparece repetida varias veces y se divide.' },
      ],
      dibujo: { datos: lista('ANA'), estado: {} },
      revelar: { datos: lista('ANA'), estado: {} },
      coincide: 'Coincide: 6! entre 3! (las A) y entre 2! (las N).',
    },
    mira: {
      datos: casa,
      pasos: [
        { estado: { paso: 0 }, texto: 'Si las dos A de CASA fueran distintas, habría 4! = 24 órdenes.', ecuacion: ['4! = 24'] },
        { estado: { paso: 1, fila: [0, 1] }, texto: 'Pero cambiar A₁ por A₂ da la misma palabra.', ecuacion: ['CASA = CASA'] },
        { estado: { paso: 2, fila: [2, 3] }, texto: 'Cada palabra aparece 2! veces: se divide.', ecuacion: [{ frac: ['4!', '2!'] }, ' = 12'] },
      ],
    },
    regla: {
      texto: 'Si de n objetos hay a iguales de un tipo, b de otro…, cada orden se repite a!·b!… veces. Se divide entre eso.',
      ecuacion: [{ frac: [[N, '!'], 'a! · b! ⋯'] }],
      condicion: 'se usan todos los objetos y los iguales no se distinguen. Si todos son distintos, queda n!.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), pal = r.de(['PERU', 'PUNO', 'LLAMA', 'CUSCO', 'COCA', 'PAPAYA', 'TACNA', 'CALLAO', 'AMAZONAS', 'ARRAS']);
        const rs = repes(pal), div = rs.reduce((x, k) => x * fact(k), 1), bien = fact(pal.length) / div;
        return {
          pregunta: `¿Cuántas palabras distintas se forman con todas las letras de ${pal}?`,
          opciones: opciones(bien, [
            { id: 'todos', valor: fact(pal.length), error: 'AT-REPETIDOS', siFuera: rs.length ? 'Eso trata como distintas a letras iguales.' : 'Revisa: sí hay que ordenar todas.' },
            rs.length > 1
              ? { id: 'una', valor: fact(pal.length) / fact(rs[0]), error: 'AT-REPETIDOS', siFuera: 'Eso descuenta una letra repetida; hay que dividir también por la otra.' }
              : rs.length === 1
                ? { id: 'una', valor: fact(pal.length) / rs[0], error: 'AT-REPETIDOS', siFuera: `Se divide entre ${rs[0]}!, los órdenes de las letras iguales, no entre ${rs[0]}.` }
                : { id: 'una', valor: fact(pal.length - 1), error: 'AT-REPETIDOS', siFuera: 'Se ordenan todas las letras, no todas menos una.' },
            { id: 'resta', valor: fact(pal.length) - div, error: 'AT-REPETIDOS', siFuera: 'Lo repetido no se resta; cada palabra aparece varias veces y se divide.' },
          ]),
          solucion: { texto: rs.length ? 'Se divide entre los factoriales de las letras repetidas.' : 'Todas las letras son distintas.', ecuacion: [rs.length ? { frac: [`${pal.length}!`, rs.map(k => `${k}!`).join(' · ')] } : `${pal.length}!`, ` = ${f(bien)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: combinaciones: el orden no importa ----------
  // Cambia: cuántas personas hay y cuántas se eligen. Permanece: una fila por grupo, con cuántos órdenes tiene.
  // Se reserva: cargos distintos (presidente y secretario). Debe verse: cada grupo de r junta r! órdenes.
  const equipos = (n, r) => ({ columnas: [{ t: 'grupo', color: 'd' }, { t: 'órdenes', color: 'h' }], filasMax: 10,
    filas: combinaciones(LET.slice(0, n), r).map(c => [c.join(' '), String(fact(r))]) });
  const combis = {
    id: 'combinaciones',
    titulo: 'Elegir no es ordenar',
    temas: ['Combinaciones y números combinatorios'],
    pieza: 'arit-tabla',
    juega: {
      consigna: 'De n amigos se elige un grupo de r, sin cargos. Cada fila es un grupo; al lado, cuántos órdenes junta.',
      voz: 'Un grupo es el mismo, lo nombres en el orden que sea.',
      controles: [
        { id: 'n', etiqueta: 'n', color: 'c-o', min: 3, max: 5, paso: 1, inicio: 4, decimales: 0 },
        { id: 'r', etiqueta: 'r', color: 'c-i', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => ({ datos: equipos(v.n, v.r), estado: {} }),
      lectura: v => [`${C(v.n, v.r)} grupos · ${V(v.n, v.r)} órdenes`],
      minimo: 3,
    },
    predice: {
      pregunta: 'De 5 personas se elige un presidente y un secretario. ¿De cuántas formas?',
      opciones: [
        { id: 'c', texto: '20', correcta: true },
        { id: 'comb', texto: '10', error: 'AR17', siFuera: '10 sería cierto si fueran dos cargos iguales. Presidente y secretario no se intercambian.' },
        { id: 'pot', texto: '25', error: 'AR19', siFuera: 'Eso deja que una persona tenga los dos cargos.' },
        { id: 'suma', texto: '9', error: 'AT-SUMA-PRODUCTO', siFuera: 'Las etapas se multiplican: 5 para presidente y 4 para secretario.' },
      ],
      dibujo: { datos: equipos(5, 2), estado: {} },
      revelar: { datos: equipos(5, 2), estado: { columna: 1 } },
      coincide: 'Coincide: 10 grupos de dos, y cada uno da 2 formas de repartir los cargos.',
    },
    mira: {
      datos: equipos(5, 2),
      pasos: [
        { estado: { fila: 0 }, texto: 'Con cargos: 5 · 4 = 20. «A presidente, B secretario» no es «B, A».', ecuacion: [{ sub: ['V', '5,2'] }, ' = 20'] },
        { estado: { fila: 0, columna: 1 }, texto: 'Sin cargos, A B y B A son el mismo grupo: 2! órdenes.', ecuacion: ['2! = 2'] },
        { estado: { fila: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }, texto: 'Grupos: los 20 órdenes entre 2.', ecuacion: [{ sub: ['C', '5,2'] }, ' = ', { frac: ['20', '2'] }, ' = 10'] },
      ],
    },
    regla: {
      texto: 'Una combinación es un grupo sin orden. Se cuentan los órdenes y se divide entre los r! órdenes de cada grupo.',
      ecuacion: [{ sub: ['C', [N, ',', R]] }, ' = ', { frac: [[N, '!'], [R, '! (', N, ' − ', R, ')!']] }, ' = ', { sub: ['C', [N, ',', N, ' − ', R]] }],
      condicion: 'objetos distintos y el orden no importa. Si los puestos tienen roles distintos, no se divide: es una variación.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n = r.ent(5, 10), k = r.ent(2, 4), cargos = s % 3 === 1;
        const bien = cargos ? V(n, k) : C(n, k);
        return {
          pregunta: cargos ? `De ${n} postulantes se eligen ${k} para ${k} cargos distintos. ¿De cuántas formas?` : `De ${n} postulantes se elige una comisión de ${k}, sin cargos. ¿De cuántas formas?`,
          opciones: opciones(bien, [
            { id: 'otro', valor: cargos ? C(n, k) : V(n, k), error: 'AR17', siFuera: cargos ? 'Dividir entre el orden vale si no hay cargos; aquí los hay.' : 'Eso cuenta con orden, pero una comisión no tiene cargos.' },
            { id: 'pot', valor: n ** k, error: 'AR19', siFuera: 'Eso deja repetir a una misma persona.' },
            { id: 'prod', valor: n * k, error: 'AT-SUMA-PRODUCTO', siFuera: `Eso multiplica n por k; hay que contar ${k} etapas.` },
          ]),
          solucion: {
            texto: cargos ? 'Hay orden: se cuentan las variaciones.' : 'Sin orden: las variaciones entre k!.',
            ecuacion: cargos ? [{ sub: ['V', `${n},${k}`] }, ` = ${f(bien)}`] : [{ sub: ['C', `${n},${k}`] }, ' = ', { frac: [`${f(V(n, k))}`, `${k}!`] }, ` = ${f(bien)}`],
          },
        };
      },
    },
  };

  return {
    unidad: 'aritmetica.analisis-combinatorio',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/arit-fichas.js'],
    historia: {
      texto: 'El triángulo aritmético, que reúne las cuentas de esta unidad, se conocía en varias tradiciones antes de Pascal. Su aporte fue estudiar con orden sus propiedades y usos. La dificultad de entonces es la de hoy: decidir qué resultados cuentan como distintos. El orden y la repetición cambian lo que se cuenta; la fórmula viene después.',
      pregunta: '¿Cuándo dos resultados son en realidad el mismo?',
      fuente: { titulo: 'O’Connor y Robertson, Blaise Pascal — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Pascal/' },
    },
    ideas: [principios, variaciones, circular, repeticion, combis],
  };
});
