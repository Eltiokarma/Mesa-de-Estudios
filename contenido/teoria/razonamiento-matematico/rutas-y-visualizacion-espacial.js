/*
 * Teoría de «Rutas y visualización espacial» (razonamiento-matematico.rutas-y-visualizacion-espacial).
 * Fuente: docs/teoria/matriz/razonamiento-matematico.json (unidad 17); historia: el juego icosiano de Hamilton (1857).
 * Precisión: las rutas que llegan a un cruce se suman desde los cruces anteriores; dos o tres vistas no siempre fijan
 * el sólido.
 * Colores (regla 4): rutas que llegan naranja (c-o), el cruce cerrado rojo (c-h), la vista de frente turquesa (c-i),
 * la vista de lado verde (c-d).
 * Compañero: Faro (zorro). Códigos: RME30, RME32, RME5 (existentes); RMT-RUT-* nuevos (hipótesis).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: contar rutas sin dibujarlas todas y leer qué dicen (y qué no dicen) las vistas de un sólido.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja, sin conexión.
 *   Resultado observable: cuenta rutas en cuadrículas y cajas, y halla el máximo de cubos compatible con dos vistas.
 *   Orden de atención: 1.º la cuadrícula o el cubo · 2.º la lectura · acción principal fija.
 *   Estados: juego sin tocar · casos probados · predicción respondida · paso de Mira · caso nuevo resuelto o «No sé».
 *   Duda que resuelve: «¿cuántos caminos hay sin dibujarlos todos?».
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
    return r;
  }
  function opcionesNum(correcta, distractores) {
    const vistos = new Set([correcta]);
    const ops = [{ id: 'c', texto: f(correcta), correcta: true }];
    for (const x of distractores) { if (vistos.has(x.valor) || !Number.isFinite(x.valor) || x.valor < 0 || ops.length >= 4) continue; vistos.add(x.valor); ops.push({ id: x.id, texto: f(x.valor), error: x.error, siFuera: x.siFuera }); }
    return ops;
  }
  const fact = n => (n <= 1 ? 1 : n * fact(n - 1));
  // Gesto directo (docs/teoria.md §4b): las manijas usan la geometría que exportan rm-tablero y rm-plano.
  const TAB = () => Kit.piezas['rm-tablero'], PLANO = () => Kit.piezas['rm-plano'];
  const plural = (n, uno, varios) => `${f(n)} ${n === 1 ? uno : varios}`;

  // ---------- Idea 1: rutas en el plano ----------
  // Cambia: el tamaño de la cuadrícula · Permanece: solo se avanza a la derecha o hacia arriba · Progresa: el número de
  // cada cruce · Se reserva: un cruce cerrado · Debe verse: cada número es la suma del de la izquierda y el de abajo.
  function rutas(m, n, cerrado = null) {
    // T[i][j]: rutas hasta el cruce de i pasos a la derecha y j hacia arriba.
    const T = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) for (let j = 0; j <= n; j++) {
      const cierres = cerrado && Array.isArray(cerrado[0]) ? cerrado : cerrado ? [cerrado] : [];
      if (cierres.some(q => q[0] === i && q[1] === j)) { T[i][j] = 0; continue; }
      T[i][j] = i === 0 && j === 0 ? 1 : (i ? T[i - 1][j] : 0) + (j ? T[i][j - 1] : 0);
    }
    return T;
  }
  function cuadricula(m, n, extra = {}) {
    const T = rutas(m, n, extra.cerrado);
    return {
      columnas: null, filas: null, ancho: 46,
      celdas: Array.from({ length: n + 1 }, (_, fila) => {
        const j = n - fila;   // la fila de arriba es j = n
        return Array.from({ length: m + 1 }, (_, i) => {
          const cierres = extra.cerrado && Array.isArray(extra.cerrado[0]) ? extra.cerrado : extra.cerrado ? [extra.cerrado] : [];
          const esCerrado = cierres.some(q => q[0] === i && q[1] === j);
          if (esCerrado) return { marca: 'no', color: 'h' };
          if (extra.vacio && !(i === 0 && j === 0)) return '';
          const fin = i === m && j === n;
          return { t: String(T[i][j]), color: fin ? 'o' : undefined, resalto: fin ? 'o' : i === 0 && j === 0 ? 'i' : undefined, desde: extra.paso ? i + j : 0 };
        });
      }),
      notas: [{ t: extra.nota || `Rutas hasta la esquina: ${T[m][n]}` }],
    };
  }
  const plano = {
    id: 'rutas-en-el-plano',
    titulo: 'Sumar las rutas que llegan',
    temas: ['Rutas en el plano'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'Solo se puede avanzar a la derecha o hacia arriba. Cada casilla es un cruce y dice cuántas rutas llegan a él. Cambia el tamaño.',
      voz: 'Compara cada número con el de su izquierda y el de abajo.',
      controles: [
        { id: 'm', etiqueta: 'Derecha', min: 1, max: 5, paso: 1, inicio: 2, decimales: 0 },
        { id: 'n', etiqueta: 'Arriba', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: val => ({ datos: cuadricula(val.m, val.n), estado: {} }),
      lectura: val => [`${rutas(val.m, val.n)[val.m][val.n]} rutas de ${val.m + val.n} pasos`],
      minimo: 4,
      // Se estira la cuadrícula: el borde derecho de la fila de salida da los pasos a la derecha; el borde de abajo de la
      // columna de salida, los pasos hacia arriba (la cuadrícula crece hacia abajo, desde arriba fija).
      arrastres: [
        { id: 'derecha', etiqueta: 'pasos a la derecha', color: 'c-o',
          donde: val => { const g = TAB().geometria(cuadricula(val.m, val.n)); return { x: g.x0 + g.cw * g.nc, y: g.centro(val.n, 0).y }; },
          mover: (pt, val) => { const g = TAB().geometria(cuadricula(val.m, val.n)); return { m: 2 * (pt.x - (g.x0 + g.cw * g.nc / 2)) / g.cw - 1 }; } },
        { id: 'arriba', etiqueta: 'pasos hacia arriba', color: 'c-o',
          donde: val => { const g = TAB().geometria(cuadricula(val.m, val.n)); return { x: g.centro(0, 0).x, y: g.y0 + (val.n + 1) * g.altoFila }; },
          mover: (pt, val) => { const g = TAB().geometria(cuadricula(val.m, val.n)); return { n: (pt.y - g.y0) / g.altoFila - 1 }; } },
      ],
    },
    predice: {
      pregunta: 'En una cuadrícula de 3 pasos a la derecha y 3 hacia arriba, el cruce del centro (1 a la derecha, 1 arriba) está cerrado. ¿Cuántas rutas quedan?',
      opciones: [
        { id: 'todas', texto: '20', error: 'RMT-RUT-1', siFuera: '20 son las rutas sin el cruce cerrado; las que pasan por él ya no sirven.' },
        { id: 'c', texto: String(rutas(3, 3, [1, 1])[3][3]), correcta: true },
        { id: 'menos1', texto: '19', error: 'RMT-RUT-2', siFuera: 'El cruce cerrado no quita una ruta: quita todas las que pasan por él.' },
      ],
      dibujo: { datos: cuadricula(3, 3, { cerrado: [1, 1], vacio: true, nota: 'El cruce con ✗ está cerrado' }), estado: {} },
      revelar: { datos: cuadricula(3, 3, { cerrado: [1, 1] }), estado: {} },
      coincide: `Coincide: por el cruce cerrado pasaban 2 · 6 = 12 rutas; quedan ${rutas(3, 3, [1, 1])[3][3]}.`,
    },
    mira: {
      datos: cuadricula(3, 2, { paso: true }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Los cruces del borde tienen una sola ruta: todo derecho.' },
        { estado: { corte: 2 }, texto: 'A un cruce se llega desde su izquierda o desde abajo.', ecuacion: ['1 + 1 = 2'] },
        { estado: { corte: 4 }, texto: 'Se suma así hasta la esquina de arriba.', ecuacion: ['rutas = izquierda + abajo'] },
        { estado: { corte: 5 }, texto: 'Sin cruces cerrados, es elegir cuáles pasos van hacia arriba.', ecuacion: [{ frac: ['5!', '3! · 2!'] }, ' = 10'] },
      ],
    },
    regla: {
      texto: 'Las rutas que llegan a un cruce son la suma de las que llegan a los cruces desde donde se puede entrar. Un cruce cerrado vale 0.',
      ecuacion: ['sin cierres: ', { frac: ['(m + n)!', [{ llave: ['m!'], nota: 'a la derecha', color: 'c-o' }, ' · ', { llave: ['n!'], nota: 'hacia arriba', color: 'c-o' }]] }],
      condicion: 'solo se avanza en dos sentidos (derecha y arriba), sin volver; con otros movimientos, cambian los cruces de entrada.',
    },
    ahoraTu: {
      pieza: 'rm-tablero',
      voz: 'Escribe en cada cruce la suma de los de entrada.',
      generar(s) {
        const r = azar(s), m = r.ent(2, 5), n = r.ent(2, 4), conCierre = s % 2 === 1;
        const cerr = conCierre ? [r.ent(1, m - 1), r.ent(1, n - 1)] : null;
        const T = rutas(m, n, cerr), bien = T[m][n], sin = rutas(m, n)[m][n];
        return {
          pregunta: `Solo se avanza a la derecha o hacia arriba: ${m} pasos a la derecha y ${n} hacia arriba${conCierre ? ', sin pasar por el cruce marcado con ✗' : ''}. ¿Cuántas rutas hay?`,
          dibujo: { datos: cuadricula(m, n, { cerrado: cerr, vacio: true, nota: conCierre ? 'Cruce ✗ cerrado' : 'Cuadrícula' }), estado: {} },
          opciones: opcionesNum(bien, [
            { id: 'sin', valor: conCierre ? sin : sin * 2, error: conCierre ? 'RMT-RUT-1' : 'RMT-RUT-3', siFuera: conCierre ? 'Esas son todas, contando las que pasan por el cruce cerrado.' : 'Cuenta solo derecha y arriba, sin volver.' },
            { id: 'suma', valor: m + n, error: 'RME30', siFuera: 'Eso cuenta pasos, no rutas.' },
            { id: 'prod', valor: m * n, error: 'RME30', siFuera: 'Multiplicar los lados no cuenta las rutas.' },
          ]),
          solucion: { texto: 'Cada cruce suma los de su izquierda y de abajo.', ecuacion: [`rutas = ${bien}`], dibujo: { datos: cuadricula(m, n, { cerrado: cerr }), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 2: rutas en el espacio ----------
  // Cambia: cuál de las rutas se resalta · Permanece: el cubo y los vértices A y B opuestos · Progresa: las rutas vistas ·
  // Se reserva: la caja de 2 × 1 × 1 · Debe verse: una ruta mínima es un orden de pasos x, y, z.
  const PROY = ([x, y, z], e = 2.6) => [2.2 + e * x + 1.3 * z, 5 - e * y - 1.1 * z];
  function caja(a, b, c, ruta = null, extra = {}) {
    const lineas = [];
    const arista = (p, q, o = {}) => lineas.push(Object.assign({ de: PROY(p, extra.e), a: PROY(q, extra.e), grosor: 'cuadricula' }, o));
    for (let x = 0; x <= a; x++) for (let y = 0; y <= b; y++) for (let z = 0; z <= c; z++) {
      if (x < a) arista([x, y, z], [x + 1, y, z]);
      if (y < b) arista([x, y, z], [x, y + 1, z]);
      if (z < c) arista([x, y, z], [x, y, z + 1]);
    }
    if (ruta) {
      let p = [0, 0, 0];
      for (const d of ruta) { const q = p.slice(); q['xyz'.indexOf(d)]++; arista(p, q, { color: 'o', grosor: 'variable' }); p = q; }
    }
    const A = PROY([0, 0, 0], extra.e), B = PROY([a, b, c], extra.e);
    return { ancho: 10, alto: 6, lineas, nodos: [{ id: 'A', x: A[0], y: A[1], t: 'A', r: 12, color: 'i' }, { id: 'B', x: B[0], y: B[1], t: 'B', r: 12, color: 'o' }], pie: extra.pie };
  }
  const ORDENES = ['xyz', 'xzy', 'yxz', 'yzx', 'zxy', 'zyx'];
  // Vértice tras h pasos de la ruta k en el cubo (e = 3), en coordenadas de la figura.
  const verticeRuta = (orden, h) => { const q = [0, 0, 0]; for (const d of orden.slice(0, h)) q['xyz'.indexOf(d)] = 1; return q; };
  const aFigura = (val, q) => { const g = PLANO().geometria(caja(1, 1, 1, ORDENES[val.k - 1], { e: 3 })), [x, y] = PROY(q, 3); return { x: g.X(x), y: g.Y(y) }; };
  const puntoCubo = (val, h) => aFigura(val, verticeRuta(ORDENES[val.k - 1], h));
  // El dedo elige el vértice más cercano con h pasos dados; la ruta nueva conserva lo que pueda de la anterior.
  function ordenPorVertice(pt, val, h) {
    const antes = ORDENES[val.k - 1];
    // Para cada vértice posible, la ruta que pasa por él y cambia lo menos posible: h = 1 fija el primer paso y deja
    // los otros dos en su orden; h = 2 fija cuál paso queda al final y deja primero el que ya iba primero, si se puede.
    const preferida = o => {
      if (h === 1) return o[0] + antes.replace(o[0], '');
      const ultimo = o[2], dos = antes.replace(ultimo, '');
      return dos + ultimo;
    };
    let mejor = antes, dmin = Infinity;
    for (const o of ORDENES) {
      const r = preferida(o), p = puntoCubo({ k: ORDENES.indexOf(r) + 1 }, h), d = Math.hypot(p.x - pt.x, p.y - pt.y);
      if (d < dmin - 1e-9) { dmin = d; mejor = r; }
    }
    return ORDENES.indexOf(mejor) + 1;
  }

  const espacio = {
    id: 'rutas-en-el-espacio',
    titulo: 'Rutas por las aristas',
    temas: ['Rutas en el espacio'],
    pieza: 'rm-plano',
    juega: {
      consigna: 'Una hormiga va de A a B por las aristas del cubo, por el camino más corto. Cambia la ruta y mira sus tres pasos.',
      voz: 'Cada ruta usa un paso a lo ancho, uno a lo alto y uno al fondo.',
      controles: [{ id: 'k', etiqueta: 'Ruta', min: 1, max: 6, paso: 1, inicio: 1, decimales: 0, color: 'c-o' }],
      dibujo: val => ({ datos: caja(1, 1, 1, ORDENES[val.k - 1], { e: 3 }), estado: {} }),
      lectura: val => [`Ruta ${val.k} de 6: orden ${ORDENES[val.k - 1].split('').join(', ')}`],
      minimo: 4,
      // La hormiga se lleva por los vértices: el primero elige el primer paso; el segundo, cuál paso queda para el final.
      arrastres: [
        { id: 'primer-paso', etiqueta: 'primer vértice de la ruta', color: 'c-o',
          donde: val => puntoCubo(val, 1), mover: (pt, val) => ({ k: ordenPorVertice(pt, val, 1) }) },
        { id: 'segundo-paso', etiqueta: 'segundo vértice de la ruta', color: 'c-o',
          donde: val => puntoCubo(val, 2), mover: (pt, val) => ({ k: ordenPorVertice(pt, val, 2) }) },
      ],
    },
    predice: {
      pregunta: 'Ahora es una caja de 2 × 1 × 1 cubitos. ¿Cuántas rutas mínimas por las aristas van de A a B?',
      opciones: [
        { id: 'doble', texto: '12', correcta: true },
        { id: 'seis', texto: '6', error: 'RMT-RUT-4', siFuera: '6 es el cubo; ahora hay dos pasos a lo ancho.' },
        { id: 'dos', texto: '24', error: 'RMT-RUT-5', siFuera: '24 = 4! trata como distintos los dos pasos a lo ancho, que son iguales.' },
        { id: 'suma', texto: '8', error: 'RME30', siFuera: 'Sumar no cuenta los órdenes posibles de los pasos.' },
      ].map(o => (o.id === 'doble' ? Object.assign(o, { id: 'c' }) : o)),
      dibujo: { datos: caja(2, 1, 1, null, { e: 2.6 }), estado: {} },
      revelar: { datos: caja(2, 1, 1, 'xyxz', { e: 2.6, pie: '4 pasos: x, x, y, z en cualquier orden: 12' }), estado: {} },
      coincide: 'Coincide: 4 pasos donde dos son iguales: 4! / 2! = 12 órdenes.',
    },
    mira: {
      datos: caja(2, 1, 1, 'xxyz', { e: 2.6 }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Toda ruta mínima usa 2 pasos en x, uno en y, uno en z.', ecuacion: ['4 pasos'] },
        { estado: { corte: 0 }, texto: 'Una ruta es un orden de esos pasos.', ecuacion: ['x x y z, x y x z, …'] },
        { estado: { corte: 0 }, texto: 'Los dos pasos en x son iguales: se divide entre 2!.', ecuacion: [{ frac: ['4!', '2! · 1! · 1!'] }, ' = 12'] },
      ],
    },
    regla: {
      texto: 'En una caja de a × b × c cubitos, una ruta mínima de esquina a esquina es un orden de a pasos en x, b en y y c en z.',
      ecuacion: ['rutas = ', { frac: ['(a + b + c)!', [{ llave: ['a!'], nota: 'pasos en x', color: 'c-o' }, ' · ', { llave: ['b!'], nota: 'en y', color: 'c-o' }, ' · ', { llave: ['c!'], nota: 'en z', color: 'c-o' }]] }],
      condicion: 'se va por las aristas, siempre acercándose a B; si se permite retroceder, ya no son rutas mínimas.',
    },
    ahoraTu: {
      pieza: 'rm-plano',
      voz: 'Cuenta los pasos de cada dirección.',
      generar(s) {
        const r = azar(s), a = r.ent(1, 3), b = r.ent(1, 2), c = r.ent(1, 2), bien = fact(a + b + c) / (fact(a) * fact(b) * fact(c));
        return {
          pregunta: `Una hormiga va de A a B por las aristas de una caja de ${a} × ${b} × ${c} cubitos, por el camino más corto. ¿Cuántas rutas puede seguir?`,
          dibujo: { datos: caja(a, b, c, null, { e: 2.6 / Math.max(a, 1.4) }), estado: {} },
          opciones: opcionesNum(bien, [
            { id: 'fact', valor: fact(a + b + c), error: 'RMT-RUT-5', siFuera: 'Los pasos de la misma dirección son iguales: hay que dividir.' },
            { id: 'prod', valor: a * b * c * 6, error: 'RMT-RUT-6', siFuera: 'Multiplicar por 6 sirve solo en un cubito.' },
            { id: 'suma', valor: a + b + c, error: 'RME30', siFuera: 'Eso cuenta pasos, no rutas.' },
          ]),
          solucion: { texto: `${a + b + c} pasos: ${a} en x, ${b} en y, ${c} en z.`, ecuacion: [{ frac: [`${a + b + c}!`, `${a}! · ${b}! · ${c}!`] }, ` = ${bien}`] },
        };
      },
    },
  };

  // ---------- Idea 3: vistas de un sólido de cubitos ----------
  // Cambia: cómo se apilan los cubitos · Permanece: la vista de frente y la de lado · Progresa: el número de cubitos ·
  // Se reserva: el máximo compatible · Debe verse: las mismas vistas admiten pilas distintas.
  const FR = [2, 3, 1], LA = [3, 2, 1];   // frente: altura máxima por columna; lado: por fila
  const PILAS = [
    [[2, 3, 1], [1, 2, 1], [1, 1, 1]],
    [[2, 3, 1], [2, 2, 0], [1, 1, 1]],
    [[2, 3, 1], [2, 1, 0], [0, 1, 0]],
    [[1, 3, 1], [2, 1, 0], [0, 0, 1]],
  ];
  const maxCubos = (fr, la) => la.reduce((m, h) => m + fr.reduce((mm, g) => mm + Math.min(h, g), 0), 0);
  const suma = M => M.flat().reduce((m, x) => m + x, 0);
  const vistaDe = M => ({ fr: M[0].map((_, c) => Math.max(...M.map(r => r[c]))), la: M.map(r => Math.max(...r)) });
  function planta(M, fr, la, extra = {}) {
    return {
      columnas: ['', '', '', 'Lado'], filas: ['Fondo', 'Medio', 'Adelante', 'Frente'], ancho: 52,
      celdas: M.map((r, i) => r.map(h => (h ? { t: String(h), color: 'o', resalto: 'o' } : { t: '·', tenue: true })).concat([{ t: String(la[i]), color: 'd' }]))
        .concat([fr.map(h => ({ t: String(h), color: 'i' })).concat([''])]),
      notas: [{ t: extra.nota || `Cubitos: ${suma(M)}` }],
    };
  }
  const vistas = {
    id: 'vistas',
    titulo: 'Dos vistas, varias pilas',
    temas: ['Proyecciones principales de un sólido'],
    pieza: 'rm-tablero',
    juega: {
      consigna: 'Cada casilla dice cuántos cubitos hay apilados ahí. Abajo, lo que se ve de frente; a la derecha, de lado. Cambia de pila.',
      voz: 'Mira si las vistas cambian cuando cambias la pila.',
      controles: [{ id: 'p', etiqueta: 'Pila', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0, color: 'c-o' }],
      dibujo: val => { const M = PILAS[val.p - 1], v = vistaDe(M); return { datos: planta(M, v.fr, v.la), estado: {} }; },
      lectura: val => { const M = PILAS[val.p - 1]; return [`Pila ${val.p}: ${suma(M)} cubitos, mismas vistas`]; },
      minimo: 4,
    },
    predice: {
      pregunta: 'Con esa vista de frente (2, 3, 1) y de lado (3, 2, 1), ¿cuál es el mayor número de cubitos posible?',
      opciones: [
        { id: 'frente', texto: '6', error: 'RME5', siFuera: '6 suma solo la vista de frente; detrás de cada columna puede haber más cubitos.' },
        { id: 'c', texto: String(maxCubos(FR, LA)), correcta: true },
        { id: 'prod', texto: '27', error: 'RMT-RUT-7', siFuera: '27 llenaría todo hasta 3; las vistas limitan la altura de cada casilla.' },
        { id: 'unico', texto: '12', error: 'RME5', siFuera: '12 es una pila posible, pero no la mayor.' },
      ],
      dibujo: { datos: planta([[0, 0, 0], [0, 0, 0], [0, 0, 0]], FR, LA, { nota: '¿Cuántos cubitos como máximo?' }), estado: {} },
      revelar: { datos: planta(LA.map(h => FR.map(g => Math.min(h, g))), FR, LA, { nota: `Máximo: ${maxCubos(FR, LA)} cubitos` }), estado: {} },
      coincide: 'Coincide: en cada casilla cabe hasta el menor de sus dos límites.',
    },
    mira: {
      datos: planta(LA.map(h => FR.map(g => Math.min(h, g))), FR, LA),
      pasos: [
        { estado: { corte: 0 }, texto: 'De frente se ve la pila más alta de cada columna.' },
        { estado: { corte: 0 }, texto: 'De lado, la más alta de cada fila.' },
        { estado: { corte: 0 }, texto: 'Una casilla no puede pasar ninguno de sus dos límites.', ecuacion: ['altura ≤ mín(frente, lado)'] },
        { estado: { corte: 0 }, texto: 'Las vistas no fijan los cubitos ocultos: hay varias pilas posibles.' },
      ],
    },
    regla: {
      texto: 'La vista de frente da la altura mayor de cada columna; la de lado, la de cada fila. Muchas pilas comparten esas vistas; el máximo usa el menor límite.',
      ecuacion: ['máximo = Σ ', { llave: ['mín(frente, lado)'], nota: 'en cada casilla', color: 'c-o' }],
      condicion: 'las vistas muestran alturas, sin transparencias; con la vista de planta se sabe además qué casillas están ocupadas.',
    },
    ahoraTu: {
      pieza: 'rm-tablero',
      voz: 'Pon en cada casilla el menor de sus dos límites.',
      generar(s) {
        const r = azar(s);
        const fr = [r.ent(1, 4), r.ent(1, 4), r.ent(1, 4)], la = [r.ent(1, 4), r.ent(1, 4), r.ent(1, 4)];
        la[r.ent(0, 2)] = Math.max(...fr); fr[r.ent(0, 2)] = Math.max(...la);   // las dos vistas tienen la misma altura mayor
        const bien = maxCubos(fr, la), sf = fr.reduce((m, x) => m + x, 0), sl = la.reduce((m, x) => m + x, 0);
        return {
          pregunta: `Un sólido de cubitos sobre una base de 3 × 3 se ve de frente con alturas ${fr.join(', ')} y de lado con alturas ${la.join(', ')}. ¿Cuántos cubitos tiene, como máximo?`,
          dibujo: { datos: planta([[0, 0, 0], [0, 0, 0], [0, 0, 0]], fr, la, { nota: 'Límites de frente y de lado' }), estado: {} },
          opciones: opcionesNum(bien, [
            { id: 'fr', valor: sf, error: 'RME5', siFuera: 'Eso suma una sola vista.' },
            { id: 'ambas', valor: sf + sl, error: 'RMT-RUT-8', siFuera: 'Sumar las dos vistas cuenta cubitos dos veces.' },
            { id: 'todo', valor: 9 * Math.max(...fr), error: 'RMT-RUT-7', siFuera: 'No todas las casillas pueden tener la altura mayor.' },
          ]),
          solucion: { texto: 'Cada casilla lleva el menor de sus dos límites.', ecuacion: [`máximo = ${bien}`], dibujo: { datos: planta(la.map(h => fr.map(g => Math.min(h, g))), fr, la), estado: {} } },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1: la cuadrícula grande con dos cruces cerrados que se arrastran (la idea solo deja uno, y fijo). Casos raros:
  // cerrar la salida o la llegada, o cerrar los dos únicos pasos de un borde.
  const LM = 5, LN = 4;
  const cierresDe = val => [[val.i1, val.j1], [val.i2, val.j2]];
  const datosCierres = val => {
    const T = rutas(LM, LN, cierresDe(val)), todas = rutas(LM, LN)[LM][LN];
    return cuadricula(LM, LN, { cerrado: cierresDe(val), nota: `Rutas: ${f(T[LM][LN])} de ${f(todas)}` });
  };
  const manijaCierre = (k, ci, cj) => ({ id: `cierre-${k}`, etiqueta: `cruce cerrado ${k}`, color: 'c-h',
    donde: val => { const g = TAB().geometria(datosCierres(val)), p = g.centro(LN - val[cj], val[ci]); return { x: p.x + 12, y: p.y + 10 }; },
    mover: (pt, val) => { const g = TAB().geometria(datosCierres(val)), q = g.casilla(pt.x - 12, pt.y - 10); return { [ci]: q.c, [cj]: LN - q.f }; } });
  const mesaCierres = {
    id: 'dos-cierres', titulo: 'Dos cruces cerrados', pieza: 'rm-tablero',
    consigna: 'Cuadrícula de 5 a la derecha y 4 hacia arriba. Arrastra las dos ✗ y mira cuántas rutas sobreviven.',
    controles: [
      { id: 'i1', etiqueta: 'Cierre 1 →', min: 0, max: LM, paso: 1, inicio: 1, decimales: 0, color: 'c-h' },
      { id: 'j1', etiqueta: 'Cierre 1 ↑', min: 0, max: LN, paso: 1, inicio: 1, decimales: 0, color: 'c-h' },
      { id: 'i2', etiqueta: 'Cierre 2 →', min: 0, max: LM, paso: 1, inicio: 3, decimales: 0, color: 'c-h' },
      { id: 'j2', etiqueta: 'Cierre 2 ↑', min: 0, max: LN, paso: 1, inicio: 2, decimales: 0, color: 'c-h' },
    ],
    dibujo: val => ({ datos: datosCierres(val), estado: {} }),
    lectura: val => [`Cierres en (${val.i1}; ${val.j1}) y (${val.i2}; ${val.j2}): `, plural(rutas(LM, LN, cierresDe(val))[LM][LN], 'ruta', 'rutas')],
    arrastres: [manijaCierre(1, 'i1', 'j1'), manijaCierre(2, 'i2', 'j2')],
  };
  // Mesa 2: la caja que se estira en sus tres direcciones; el pie trae la cuenta con los números de la caja.
  const PL = ([x, y, z]) => [1.2 + 1.8 * x + 1.2 * z, 6.4 - 1.8 * y - 1.0 * z];
  function cajaLab(a, b, c) {
    const lineas = [];
    const ar = (p, q) => lineas.push({ de: PL(p), a: PL(q), grosor: 'cuadricula' });
    for (let x = 0; x <= a; x++) for (let y = 0; y <= b; y++) for (let z = 0; z <= c; z++) {
      if (x < a) ar([x, y, z], [x + 1, y, z]);
      if (y < b) ar([x, y, z], [x, y + 1, z]);
      if (z < c) ar([x, y, z], [x, y, z + 1]);
    }
    const A = PL([0, 0, 0]), B = PL([a, b, c]), n = fact(a + b + c) / (fact(a) * fact(b) * fact(c));
    return { ancho: 10, alto: 7, lineas, nodos: [{ id: 'A', x: A[0], y: A[1], t: 'A', r: 12, color: 'i' }, { id: 'B', x: B[0], y: B[1], t: 'B', r: 12, color: 'o' }],
      pie: `${a + b + c}! / (${a}! · ${b}! · ${c}!) = ${f(n)}` };
  }
  const datosCaja = val => cajaLab(val.a, val.b, val.c);
  const mesaCaja = {
    id: 'caja-que-crece', titulo: 'La caja que se estira', pieza: 'rm-plano',
    consigna: 'Arrastra B para cambiar el ancho y el alto; la esquina del fondo, para la profundidad. Compara las rutas mínimas.',
    controles: [
      { id: 'a', etiqueta: 'Ancho (x)', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
      { id: 'b', etiqueta: 'Alto (y)', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
      { id: 'c', etiqueta: 'Fondo (z)', min: 1, max: 2, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
    ],
    dibujo: val => ({ datos: datosCaja(val), estado: {} }),
    lectura: val => [`Caja ${val.a} × ${val.b} × ${val.c}: `, plural(fact(val.a + val.b + val.c) / (fact(val.a) * fact(val.b) * fact(val.c)), 'ruta mínima', 'rutas mínimas')],
    arrastres: [
      { id: 'esquina-b', etiqueta: 'esquina B: ancho y alto', color: 'c-o',
        donde: val => { const g = PLANO().geometria(datosCaja(val)), [x, y] = PL([val.a, val.b, val.c]); return { x: g.X(x), y: g.Y(y) }; },
        mover: (pt, val) => { const g = PLANO().geometria(datosCaja(val)), x = (pt.x - g.X(0)) / g.k, y = (pt.y - g.Y(0)) / g.k;
          return { a: (x - 1.2 - 1.2 * val.c) / 1.8, b: (6.4 - 1.0 * val.c - y) / 1.8 }; } },
      { id: 'fondo', etiqueta: 'profundidad de la caja', color: 'c-o',
        donde: val => { const g = PLANO().geometria(datosCaja(val)), [x, y] = PL([0, 0, val.c]); return { x: g.X(x), y: g.Y(y) }; },
        mover: (pt, val) => { const g = PLANO().geometria(datosCaja(val)), x = (pt.x - g.X(0)) / g.k, y = (pt.y - g.Y(0)) / g.k;
          // Proyección sobre la diagonal del fondo, (1,2; −1,0) por paso.
          return { c: ((x - 1.2) * 1.2 - (y - 6.4) * 1.0) / (1.2 * 1.2 + 1.0 * 1.0) }; } },
    ],
  };
  // Mesa 3: armar la pila casilla por casilla; las vistas se calculan solas. Casos raros: una casilla vacía que no
  // cambia ninguna vista, o una torre escondida detrás de otra más alta.
  const CASILLAS = [0, 1, 2].flatMap(i => [0, 1, 2].map(c => [i, c]));
  const pilaDe = val => [0, 1, 2].map(i => [0, 1, 2].map(c => val[`h${i}${c}`]));
  const datosPila = val => { const M = pilaDe(val), v = vistaDe(M); return planta(M, v.fr, v.la); };
  const mesaPila = {
    id: 'arma-la-pila', titulo: 'Arma la pila', pieza: 'rm-tablero',
    consigna: 'Sube o baja cada casilla de la planta. Abajo y a la derecha salen solas las vistas de frente y de lado.',
    controles: CASILLAS.map(([i, c]) => ({ id: `h${i}${c}`, etiqueta: `${['Fondo', 'Medio', 'Adelante'][i]} ${c + 1}`, min: 0, max: 3, paso: 1, inicio: PILAS[0][i][c], decimales: 0, color: 'c-o' })),
    dibujo: val => ({ datos: datosPila(val), estado: {} }),
    lectura: val => { const M = pilaDe(val), v = vistaDe(M); return [`${plural(suma(M), 'cubito', 'cubitos')} · frente ${v.fr.join(' ')} · lado ${v.la.join(' ')}`]; },
    // Cada casilla tiene su manija a la derecha del número: arriba es 3 cubitos; abajo, ninguno.
    arrastres: CASILLAS.map(([i, c]) => ({ id: `casilla-${i}-${c}`, etiqueta: `altura de ${['fondo', 'medio', 'adelante'][i]} ${c + 1}`, color: 'c-o',
      donde: val => { const g = TAB().geometria(datosPila(val)), p = g.centro(i, c); return { x: p.x + 15, y: p.y + 13 - 26 * val[`h${i}${c}`] / 3 }; },
      mover: (pt, val) => { const g = TAB().geometria(datosPila(val)), p = g.centro(i, c); return { [`h${i}${c}`]: (p.y + 13 - pt.y) * 3 / 26 }; } })),
  };

  return {
    unidad: 'razonamiento-matematico.rutas-y-visualizacion-espacial',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/rm-tablero.js', '/nucleo/kit/piezas/rm-plano.js'],
    // Laboratorio: dos cruces cerrados que se arrastran, la caja que se estira en tres direcciones y la pila que se
    // arma casilla por casilla con sus vistas calculadas.
    laboratorio: [mesaCierres, mesaCaja, mesaPila],
    historia: {
      texto: 'En 1857, William Hamilton presentó el juego icosiano: recorrer las aristas de un dodecaedro visitando cada vértice una vez y volver al inicio. Es otra pregunta que la de Euler, que pide pasar una vez por cada arista. Leer qué prohíbe repetir una consigna cambia el problema.',
      pregunta: '¿Qué no se puede repetir: puntos o caminos?',
      fuente: { titulo: 'Hamilton, The Icosian Calculus · Trinity College Dublin', url: 'https://www.maths.tcd.ie/pub/HistMath/People/Hamilton/Icosian/' },
    },
    ideas: [plano, espacio, vistas],
  };
});
