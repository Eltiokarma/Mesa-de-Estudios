/*
 * Generador: cubitos que se cuentan (razonamiento matemático, rutas y visualización espacial).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['cubitos-conteo']) y en Node (require). Todo se cuenta por fuerza bruta,
 * cubito por cubito y cara por cara, sobre una grilla de cubitos (ninguna fórmula en el generador).
 *
 * Coordenadas: x = largo (de izquierda a derecha), y = ancho o fondo (del frente hacia atrás),
 * z = alto (de abajo hacia arriba); un bloque a × b × c tiene a de largo, b de fondo y c de alto.
 *
 * Tipos (_datos.tipo):
 *   pintados   bloque a × b × c pintado por fuera; cubitos con exactamente k caras pintadas.
 *              _datos: { a, b, c, k, apoyo }. apoyo: 'todo' (se pinta todo, base incluida),
 *              'mesa' (la base queda sin pintar), 'pared' (base y cara trasera sin pintar),
 *              'rincon' (base, cara trasera y cara izquierda sin pintar).
 *   caras      el mismo bloque; total de caras de cubito pintadas. _datos: { a, b, c, apoyo }.
 *   tuneles    cubo n × n × n con túneles rectos de un cubito de sección, de cara a cara;
 *              cubitos que quedan. _datos: { n, tuneles: [{ eje, p, q }] }, con eje 'x'
 *              (de izquierda a derecha; p = capa desde el frente, q = fila desde abajo), 'y'
 *              (de frente a fondo; p = columna desde la izquierda, q = fila desde abajo) o 'z'
 *              (de arriba abajo; p = columna desde la izquierda, q = capa desde el frente); p y q de 1 a n.
 *   completar  bloque a × b × c al que se agregan cubitos hasta el cubo compacto más pequeño
 *              que lo contiene; cubitos que faltan. _datos: { a, b, c }.
 *   copias     ladrillos iguales de a × b × c (en cm) con que se arma el menor cubo compacto,
 *              todos en la misma posición; cuántos ladrillos. _datos: { a, b, c }.
 *   escalera   término N de una sucesión de sólidos de cubitos apoyados en la mesa; área exterior
 *              en cuadraditos (caras de cubito a la vista). _datos: { regla, d, N, base }, con regla
 *              'escalera' (columnas de 1, 2, …, N cubitos de alto, d cubitos de fondo) o 'piramide'
 *              (N pisos cuadrados centrados de 1, 3, 5, … cubitos de lado, de arriba abajo); base
 *              true si se cuenta la cara apoyada en la mesa.
 * Errores: RME1 a RME4 (docs/investigacion/razonamiento-espacial-ideas-erroneas.md), RM2 (lineal
 * supuesto, docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md) y RME170 a RME177, nuevos.
 * Respuesta: p.respuesta.valor, un entero (cubitos, caras, ladrillos o cuadraditos) según _datos.tipo.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const RM = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const h = (id, valor, explicacion, fuente = null) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const v = P.v;
  const f = x => P.formatear(x, 0);
  const entero = x => Number.isInteger(x) && x > 0;
  const cant = (x, u) => `${f(x)} ${x === 1 ? u.replace(/s$/, '') : u}`;

  // ---------- La grilla de cubitos ----------
  const DIRS = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
  const clave = (x, y, z) => `${x},${y},${z}`;
  function bloque(a, b, c) {
    const s = new Set();
    for (let x = 0; x < a; x++) for (let y = 0; y < b; y++) for (let z = 0; z < c; z++) s.add(clave(x, y, z));
    return s;
  }
  // Caras sin pintar por el apoyo: base (z = 0, hacia abajo), trasera (y = máximo, hacia atrás),
  // izquierda (x = 0, hacia la izquierda). El resto de caras a la vista se pinta.
  function sinPintar(apoyo, maxY) {
    const base = apoyo !== 'todo', tras = apoyo === 'pared' || apoyo === 'rincon', izq = apoyo === 'rincon';
    return (x, y, z, d) => (base && d[2] === -1 && z === 0) || (tras && d[1] === 1 && y === maxY) || (izq && d[0] === -1 && x === 0);
  }
  // Para cada cubito, cuántas de sus caras están a la vista y pintadas.
  function carasPintadas(celdas, tapada) {
    const res = new Map();
    for (const k of celdas) {
      const [x, y, z] = k.split(',').map(Number);
      let n = 0;
      for (const d of DIRS) if (!celdas.has(clave(x + d[0], y + d[1], z + d[2])) && !tapada(x, y, z, d)) n++;
      res.set(k, n);
    }
    return res;
  }
  const contar = (mapa, pred) => [...mapa.values()].filter(pred).length;
  const sumar = mapa => [...mapa.values()].reduce((s, n) => s + n, 0);

  function generar(semilla) {
    const rng = Azar.crear('cubitos-conteo|' + semilla);
    const tipo = rng.elegir(['pintados', 'pintados', 'caras', 'tuneles', 'tuneles', 'completar', 'copias', 'escalera', 'escalera']);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = ({ pintados, caras, tuneles, completar, copias, escalera })[tipo](rng, semilla);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  const VARS = {
    a: { nombre: 'largo', color: 'o' }, b: { nombre: 'fondo', color: 'i' }, c: { nombre: 'alto', color: 'h' }, k: { nombre: 'caras pintadas', color: 'd' },
  };
  const dims = (a, b, c) => [v('a', `${a}`), ' × ', v('b', `${b}`), ' × ', v('c', `${c}`), ' (', v('a', `${a} de largo`), ', ', v('b', `${b} de fondo`), ' y ', v('c', `${c} de alto`), ')'];
  const TEXTO_APOYO = {
    todo: 'Se pinta todo el bloque por fuera, incluida la base, y luego se separan los cubitos.',
    mesa: 'El bloque está apoyado en la mesa y se pinta todo lo que queda a la vista; la base, que toca la mesa, queda sin pintar. Luego se separan los cubitos.',
    pared: 'El bloque está en el piso, con su cara trasera pegada a una pared. Se pinta todo lo que queda a la vista; la base y la cara pegada a la pared quedan sin pintar. Luego se separan los cubitos.',
    rincon: 'El bloque está en el rincón de un cuarto: apoyado en el piso, con su cara trasera pegada a una pared y su cara izquierda pegada a la otra. Se pinta todo lo que queda a la vista; la base y las dos caras pegadas a las paredes quedan sin pintar. Luego se separan los cubitos.',
  };
  const QUE_TAPA = { mesa: 'la base', pared: 'la base y la cara de la pared', rincon: 'la base y las caras de las dos paredes' };
  const NOMBRE_K = ['ninguna cara pintada', 'exactamente una cara pintada', 'exactamente dos caras pintadas', 'exactamente tres caras pintadas'];
  const POSICION = ['el interior (no tocan ninguna cara pintada)', 'el centro de las caras pintadas', 'las aristas, sin las esquinas', 'las esquinas'];

  function elegirBloque(rng) {
    const cubo = rng.sig() < 0.3;
    const a = rng.entero(3, 7), b = cubo ? a : rng.entero(2, 6), c = cubo ? a : rng.entero(2, 6);
    return { a, b, c };
  }

  // ---------- pintados ----------
  function pintados(rng, semilla) {
    const { a, b, c } = elegirBloque(rng);
    const apoyo = rng.elegir(['todo', 'todo', 'mesa', 'pared', 'rincon']);
    const k = rng.entero(0, 3);
    const celdas = bloque(a, b, c);
    const mapa = carasPintadas(celdas, sinPintar(apoyo, b - 1));
    const correcta = contar(mapa, n => n === k);
    if (correcta <= 0 || (apoyo === 'todo' && k === 3)) return null;
    const todo = carasPintadas(celdas, sinPintar('todo', b - 1));
    const errores = [];
    if (apoyo !== 'todo') errores.push(h('RME1', contar(todo, n => n === k),
      `Contaste como pintada ${QUE_TAPA[apoyo]}, como si el bloque se pintara entero. Lo que toca la mesa o la pared no recibe pintura: un cubito de esa zona tiene una cara pintada menos.`));
    if (k >= 1) errores.push(h('RME4', contar(mapa, n => n >= k),
      `Contaste también los cubitos que tienen más de ${k === 1 ? 'una cara' : k + ' caras'} pintadas. «Exactamente» deja fuera a los que tienen más: cada cubito se cuenta solo en un grupo.`));
    if (k <= 2) errores.push(h('RME4', contar(mapa, n => n === k + 1),
      `Contaste los cubitos que tienen ${k + 1} ${k + 1 === 1 ? 'cara pintada' : 'caras pintadas'}. Cada posición tiene su número: esquina 3, arista 2, centro de cara 1 e interior 0 (menos las caras que no se pintaron).`));
    if (k >= 1) errores.push(h('RME4', contar(mapa, n => n === k - 1),
      `Contaste los cubitos que tienen ${k - 1 === 0 ? 'ninguna cara pintada' : k - 1 === 1 ? 'una cara pintada' : (k - 1) + ' caras pintadas'}. Cada posición tiene su número: esquina 3, arista 2, centro de cara 1 e interior 0 (menos las caras que no se pintaron).`));
    if (apoyo === 'todo') {
      // Quitar una sola capa por medida: n − 1 en vez de n − 2.
      const m = [a - 1, b - 1, c - 1];
      const val = [m[0] * m[1] * m[2], 2 * (m[0] * m[1] + m[1] * m[2] + m[0] * m[2]), 4 * (m[0] + m[1] + m[2])][k];
      errores.splice(0, 0, h('RME170', val, `En cada medida quitaste un solo cubito, como si el borde estuviera de un solo lado. Una fila del bloque tiene dos extremos pintados: lo que queda adentro es n − 2, no n − 1.`));
    }
    const variables = { ...VARS };
    const enunciado = ['Un bloque de ', ...dims(a, b, c), ` está armado con ${a * b * c} cubitos iguales. `, TEXTO_APOYO[apoyo]];
    const pregunta = ['¿Cuántos cubitos tienen ', v('k', NOMBRE_K[k]), '?'];
    const solucion = [
      ['Cada cubito tiene tantas caras pintadas como caras a la vista que recibieron pintura. Sin apoyo, las esquinas tienen 3, las aristas 2, el centro de cada cara 1 y el interior 0.'],
      ...(apoyo !== 'todo' ? [[`Aquí ${QUE_TAPA[apoyo]} no se pintan: los cubitos que tocan esa zona pierden una cara pintada y pasan al grupo de abajo.`]] : []),
      ['Contando cubito por cubito: ', ...[0, 1, 2, 3].map(j => `${contar(mapa, n => n === j)} con ${j}`).flatMap((t, i, arr) => [t, i < arr.length - 1 ? ', ' : '.'])],
      ['Respuesta: ', v('k', cant(correcta, 'cubitos')), ` (están en ${apoyo === 'todo' ? POSICION[k] : 'las posiciones que quedan con ' + k + ' caras pintadas'}).`],
    ];
    return cerrar(rng, semilla, { variables, enunciado, pregunta, solucion, correcta, errores, unidad: 'cubitos', _datos: { tipo: 'pintados', a, b, c, k, apoyo } });
  }

  // ---------- caras ----------
  function caras(rng, semilla) {
    const { a, b, c } = elegirBloque(rng);
    const apoyo = rng.elegir(['todo', 'mesa', 'mesa', 'pared', 'rincon']);
    const celdas = bloque(a, b, c);
    const mapa = carasPintadas(celdas, sinPintar(apoyo, b - 1));
    const correcta = sumar(mapa);
    const errores = [
      h('RME1', 6 * a * b * c, 'Contaste las seis caras de cada cubito. Las caras pegadas entre cubitos quedan adentro y no reciben pintura: solo se pinta la superficie de afuera.'),
      h('RME171', contar(mapa, n => n > 0), 'Contaste cuántos cubitos tienen pintura, no cuántas caras. Un cubito de esquina aporta 3 caras pintadas; uno de arista, 2.'),
      h('RME3', a * b + b * c + a * c, 'Contaste solo las tres caras del bloque que se ven desde una esquina. La pintura llega también a las caras de atrás, del otro costado y (si no está apoyado) a la base.'),
    ];
    if (apoyo !== 'todo') errores.unshift(h('RME1', sumar(carasPintadas(celdas, sinPintar('todo', b - 1))), `Contaste como pintada ${QUE_TAPA[apoyo]}. Esas caras tocan la mesa o la pared y no reciben pintura.`));
    const variables = { a: VARS.a, b: VARS.b, c: VARS.c, k: { nombre: 'caras pintadas', color: 'd' } };
    const enunciado = ['Un bloque de ', ...dims(a, b, c), ` está armado con ${a * b * c} cubitos iguales. `, TEXTO_APOYO[apoyo]];
    const pregunta = ['¿Cuántas ', v('k', 'caras de cubito'), ' quedaron pintadas en total?'];
    const solucion = [
      ['Las caras pintadas son los cuadraditos de la superficie del bloque que recibieron pintura; las caras pegadas entre cubitos quedan adentro.'],
      [`Caras del bloque: dos de ${a} × ${c} (frente y atrás), dos de ${b} × ${c} (costados) y dos de ${a} × ${b} (arriba y abajo).`],
      ...(apoyo !== 'todo' ? [[`Se quitan las que no se pintan: ${QUE_TAPA[apoyo]}.`]] : []),
      ['Respuesta: ', v('k', cant(correcta, 'caras')), '.'],
    ];
    return cerrar(rng, semilla, { variables, enunciado, pregunta, solucion, correcta, errores, unidad: 'caras', _datos: { tipo: 'caras', a, b, c, apoyo } });
  }

  // ---------- tuneles ----------
  function celdasTunel(t, n) {
    const r = [];
    for (let i = 0; i < n; i++) {
      if (t.eje === 'x') r.push(clave(i, t.p - 1, t.q - 1));
      else if (t.eje === 'y') r.push(clave(t.p - 1, i, t.q - 1));
      else r.push(clave(t.p - 1, t.q - 1, i));
    }
    return r;
  }
  function textoTunel(t, n) {
    const c = (n + 1) / 2, centro = t.p === c && t.q === c;
    if (t.eje === 'y') return centro ? 'uno que va de la cara frontal a la trasera por el centro de la cara frontal'
      : `uno que va de la cara frontal a la trasera por la columna ${t.p} (contando desde la izquierda) y la fila ${t.q} (contando desde abajo)`;
    if (t.eje === 'x') return centro ? 'uno que va de la cara izquierda a la derecha por el centro de la cara izquierda'
      : `uno que va de la cara izquierda a la derecha por la fila ${t.q} (contando desde abajo) y la capa ${t.p} (contando desde el frente)`;
    return centro ? 'uno que va de la cara de arriba a la de abajo por el centro de la cara de arriba'
      : `uno que va de la cara de arriba a la de abajo por la columna ${t.p} (contando desde la izquierda) y la capa ${t.q} (contando desde el frente)`;
  }
  function tuneles(rng, semilla) {
    const n = rng.elegir([3, 4, 5, 5, 6]);
    let lista;
    if (n % 2 === 1 && rng.sig() < 0.35) {
      const c = (n + 1) / 2;
      lista = rng.barajar(['x', 'y', 'z']).slice(0, rng.elegir([2, 3])).map(eje => ({ eje, p: c, q: c }));
    } else {
      const T = rng.entero(2, Math.min(5, n));
      lista = [];
      for (let i = 0; i < T; i++) {
        const t = { eje: rng.elegir(['x', 'y', 'z']), p: rng.entero(1, n), q: rng.entero(1, n) };
        if (lista.some(u => u.eje === t.eje && u.p === t.p && u.q === t.q)) return null;
        lista.push(t);
      }
    }
    const quitados = new Set(lista.flatMap(t => celdasTunel(t, n)));
    const suma = lista.length * n;
    if (quitados.size === suma) return null; // sin cruces no hay nada que pensar
    // Restar por pares: cada par de túneles que comparte un cubito se resta una vez.
    let pares = 0;
    for (let i = 0; i < lista.length; i++) for (let j = i + 1; j < lista.length; j++) {
      const A = new Set(celdasTunel(lista[i], n));
      pares += celdasTunel(lista[j], n).filter(k => A.has(k)).length;
    }
    const correcta = n ** 3 - quitados.size;
    const errores = [
      h('RME2', n ** 3 - suma, `Restaste ${n} cubitos por cada túnel sin fijarte en los cruces. Donde dos túneles se cruzan hay un solo cubito, y se quita una sola vez.`),
      h('RME173', n ** 3 - (suma - pares), 'Restaste los cruces de dos en dos, pero en un mismo cubito se cruzan tres túneles. Ese cubito estaba contado tres veces: hay que descontarlo dos, no tres.'),
      h('RME172', quitados.size, 'Esos son los cubitos que se quitan para abrir los túneles. La pregunta es cuántos quedan: hay que restarlos del total.'),
      h('RME3', n ** 3 - 2 * lista.length, 'Contaste solo los agujeros que se ven en las caras. Cada túnel atraviesa el cubo entero: quita una fila completa de cubitos, también los de adentro.'),
    ];
    const variables = { n: { nombre: 'lado del cubo', color: 'o' }, T: { nombre: 'túneles', color: 'i' }, r: { nombre: 'cubitos que quedan', color: 'd' } };
    const enunciado = ['Un cubo de ', v('n', `${n} × ${n} × ${n}`), ` está armado con ${n ** 3} cubitos iguales. Se le abren `, v('T', `${lista.length} túneles`),
      ' rectos, cada uno de un cubito de sección, que lo atraviesan de cara a cara: ', lista.map(t => textoTunel(t, n)).join('; '), '. Se retiran todos los cubitos de los túneles.'];
    const pregunta = ['¿Cuántos ', v('r', 'cubitos quedan'), '?'];
    const solucion = [
      [`Cada túnel quita una fila de ${n} cubitos: ${lista.length} · ${n} = ${suma}, si no se cruzaran.`],
      [`Pero hay cubitos compartidos por varios túneles: contados uno por uno, se quitan ${quitados.size} cubitos distintos (${suma - quitados.size} se habían contado de más).`],
      [`Quedan ${n ** 3} − ${quitados.size} = `, v('r', cant(correcta, 'cubitos')), '.'],
    ];
    return cerrar(rng, semilla, { variables, enunciado, pregunta, solucion, correcta, errores, unidad: 'cubitos', _datos: { tipo: 'tuneles', n, tuneles: lista } });
  }

  // ---------- completar ----------
  function completar(rng, semilla) {
    const a = rng.entero(2, 7), b = rng.entero(2, 7), c = rng.entero(2, 7);
    const m = Math.max(a, b, c);
    if (a === b && b === c) return null;
    // Por fuerza bruta: se recorre el cubo de lado m y se cuentan las celdas que no están en el bloque.
    const blq = bloque(a, b, c);
    let faltan = 0;
    for (let x = 0; x < m; x++) for (let y = 0; y < m; y++) for (let z = 0; z < m; z++) if (!blq.has(clave(x, y, z))) faltan++;
    const correcta = faltan;
    const losas = a * b * (m - c) + a * (m - b) * c + (m - a) * b * c;
    const losasLlenas = m * m * (m - c) + m * (m - b) * m + (m - a) * m * m;
    const errores = [
      h('RME3', losas, 'Completaste cada lado por separado, pegando una capa al costado, otra atrás y otra arriba, y olvidaste los cubitos de las esquinas donde esas capas no llegan. Faltan también los ocultos.'),
      h('RME2', losasLlenas, 'Completaste cada lado con una capa del ancho del cubo entero, y los cubitos donde dos capas se cruzan los contaste dos veces.'),
      h('RME172', m ** 3, `Ese es el total de cubitos del cubo de lado ${m}. Lo que se pregunta es cuántos faltan: hay que restar los ${a * b * c} que ya están.`),
      h('RME3', m * m - a * c, 'Completaste solo la cara que se ve de frente. El cubo tiene fondo: faltan también los cubitos de atrás y de adentro.'),
    ];
    const variables = { ...VARS, m: { nombre: 'lado del cubo', color: 'd' } };
    delete variables.k;
    const enunciado = ['Un bloque compacto de ', ...dims(a, b, c), ` está armado con ${a * b * c} cubitos iguales. Se le agregan cubitos iguales, sin quitar ninguno, hasta formar el cubo compacto más pequeño posible.`];
    const pregunta = ['¿Cuántos ', v('m', 'cubitos'), ' hay que agregar como mínimo?'];
    const solucion = [
      ['El cubo tiene que contener al bloque, así que su lado es la mayor de las tres medidas: ', v('m', `${m}`), '.'],
      [`El cubo tiene ${m}³ = ${m ** 3} cubitos y el bloque ya tiene ${a} · ${b} · ${c} = ${a * b * c}.`],
      ['Faltan ', `${m ** 3} − ${a * b * c} = `, v('m', cant(correcta, 'cubitos')), '.'],
    ];
    return cerrar(rng, semilla, { variables, enunciado, pregunta, solucion, correcta, errores, unidad: 'cubitos', _datos: { tipo: 'completar', a, b, c } });
  }

  // ---------- copias ----------
  const mcd = (x, y) => (y ? mcd(y, x % y) : x);
  const mcm = (x, y) => x / mcd(x, y) * y;
  function copias(rng, semilla) {
    const a = rng.entero(2, 12), b = rng.entero(2, 12), c = rng.entero(2, 12);
    const L = mcm(mcm(a, b), c);
    if (L > 30 || (a === b && b === c) || L === Math.max(a, b, c)) return null;
    // Por fuerza bruta: el menor lado L tal que a, b y c lo dividen.
    let lado = 1;
    while (lado % a || lado % b || lado % c) lado++;
    const correcta = (lado / a) * (lado / b) * (lado / c);
    const m = Math.max(a, b, c);
    const errores = [
      h('RME174', (a * b * c) ** 2, `Tomaste como lado del cubo el producto ${a} · ${b} · ${c}. Sirve, pero no es el menor: el lado más pequeño que contiene un número entero de ladrillos en cada dirección es el MCM de las medidas.`),
      h('RME174', m ** 3 / (a * b * c), `Tomaste como lado la mayor medida, ${m} cm. Con ese lado los ladrillos no encajan justo en las otras direcciones: el lado tiene que ser múltiplo de las tres medidas (el MCM).`),
      h('RME175', lado / a + lado / b + lado / c, 'Sumaste cuántos ladrillos van en cada dirección. El cubo es un bloque lleno: los ladrillos de cada dirección se multiplican (largo · ancho · alto).'),
      h('RME172', lado ** 3, `Ese es el volumen del cubo en cm³ (${lado}³). Para saber cuántos ladrillos entran, se divide entre el volumen de un ladrillo.`),
    ];
    const variables = { a: VARS.a, b: VARS.b, c: VARS.c, L: { nombre: 'ladrillos', color: 'd' } };
    const enunciado = ['Se tienen muchos ladrillos iguales de ', v('a', `${a} cm`), ' de largo, ', v('b', `${b} cm`), ' de ancho y ', v('c', `${c} cm`),
      ' de alto. Se apilan todos en la misma posición, sin dejar huecos, hasta formar un cubo compacto.'];
    const pregunta = ['¿Cuántos ', v('L', 'ladrillos'), ' tiene el menor cubo que se puede formar?'];
    const solucion = [
      ['El lado del cubo tiene que contener un número entero de largos, de anchos y de altos: es un múltiplo común de las tres medidas. El menor es el MCM: ',
        `MCM(${a}, ${b}, ${c}) = ${lado} cm.`],
      [`Van ${lado}/${a} = ${lado / a} ladrillos a lo largo, ${lado}/${b} = ${lado / b} a lo ancho y ${lado}/${c} = ${lado / c} a lo alto.`],
      [`${lado / a} · ${lado / b} · ${lado / c} = `, v('L', cant(correcta, 'ladrillos')), '.'],
    ];
    return cerrar(rng, semilla, { variables, enunciado, pregunta, solucion, correcta, errores, unidad: 'ladrillos', _datos: { tipo: 'copias', a, b, c } });
  }

  // ---------- escalera ----------
  function solidoEscalera(regla, d, N) {
    const s = new Set();
    if (regla === 'escalera') {
      for (let x = 0; x < N; x++) for (let z = 0; z <= x; z++) for (let y = 0; y < d; y++) s.add(clave(x, y, z));
    } else {
      // Piso j (desde arriba, j = 1..N) de lado 2j − 1, centrado; el piso de abajo está en z = 0.
      for (let j = 1; j <= N; j++) {
        const lado = 2 * j - 1, ini = N - j, z = N - j;
        for (let x = ini; x < ini + lado; x++) for (let y = ini; y < ini + lado; y++) s.add(clave(x, y, z));
      }
    }
    return s;
  }
  function area(regla, d, N, base, sinCostados = false) {
    const s = solidoEscalera(regla, d, N);
    let t = 0;
    for (const k of s) {
      const [x, y, z] = k.split(',').map(Number);
      for (const dd of DIRS) {
        if (s.has(clave(x + dd[0], y + dd[1], z + dd[2]))) continue;
        if (!base && dd[2] === -1 && z === 0) continue;
        if (sinCostados && dd[0] !== 0) continue;
        t++;
      }
    }
    return { area: t, cubos: s.size };
  }
  function escalera(rng, semilla) {
    const regla = rng.elegir(['escalera', 'escalera', 'piramide']);
    const d = regla === 'escalera' ? rng.elegir([1, 1, 2, 3]) : 1;
    const N = rng.entero(regla === 'escalera' ? 8 : 6, regla === 'escalera' ? 30 : 15);
    const base = rng.moneda();
    const { area: correcta, cubos } = area(regla, d, N, base);
    const A1 = area(regla, d, 1, base).area, A2 = area(regla, d, 2, base).area, A3 = area(regla, d, 3, base).area;
    const errores = [
      h('RM2', A1 + (N - 1) * (A2 - A1), `Supusiste que el área crece siempre lo mismo que del término 1 al 2 (${A2 - A1} cuadraditos). Del 2 al 3 ya crece ${A3 - A2}: no es lineal. Hay que contar el término ${N} con su regla.`, RM),
      h('RM2', A2 * N / 2, `Tomaste el término ${N} como ${N / 2} veces el término 2 (objeto entero). Al crecer el sólido, cambian sus caras escondidas y su forma: el área no es proporcional al número del término.`, RM),
      h('RME1', 6 * cubos, `Contaste las seis caras de cada uno de los ${cubos} cubitos. Las caras pegadas entre cubitos quedan adentro y no son parte del área exterior.`),
      base
        ? h('RME177', area(regla, d, N, false).area, 'Olvidaste la base. Aquí se cuenta también la cara apoyada en la mesa.')
        : h('RME1', area(regla, d, N, true).area, 'Contaste la cara apoyada en la mesa. La pregunta pide el área que queda a la vista, sin la base.'),
      h('RME177', area(regla, d, N, base, true).area, regla === 'escalera'
        ? 'Olvidaste las caras de los costados: el lado más bajo, el más alto y los escalones que dan hacia la derecha. Cada escalón tiene su cara vertical.'
        : 'Olvidaste las caras que dan a la izquierda y a la derecha de cada piso. Cada piso tiene caras verticales en sus cuatro lados.'),
    ];
    const variables = { N: { nombre: 'término', color: 'o' }, A: { nombre: 'área exterior', color: 'd' } };
    if (regla === 'escalera') variables.d = { nombre: 'fondo', color: 'i' };
    const regTexto = regla === 'escalera'
      ? ['Una sucesión de escaleras de cubitos iguales está apoyada en la mesa. El término n tiene n columnas pegadas en fila, de 1, 2, 3, …, n cubitos de alto, y cada columna tiene ', v('d', d === 1 ? 'un cubito de fondo' : `${d} cubitos de fondo`), '. ']
      : ['Una sucesión de pirámides escalonadas de cubitos iguales está apoyada en la mesa. El término n tiene n pisos cuadrados: el de arriba es un solo cubito y cada piso tiene 2 cubitos más de lado que el de encima, con todos los pisos centrados. '];
    const queCuenta = base ? 'contando también la cara apoyada en la mesa' : 'sin contar la cara apoyada en la mesa';
    const enunciado = [...regTexto, `El área exterior se mide en cuadraditos (caras de cubito), ${queCuenta}: el término 1 tiene ${A1}, el término 2 tiene ${A2} y el término 3 tiene ${A3}.`];
    const pregunta = ['¿Cuántos cuadraditos tiene el área exterior del ', v('N', `término ${N}`), '?'];
    const solucion = regla === 'escalera' ? [
      [`El frente y la parte de atrás son escaleras de 1 + 2 + … + ${N} = ${N * (N + 1) / 2} cuadraditos cada una: ${N * (N + 1)}.`],
      [`Arriba se ve un escalón por columna, de ${d} de fondo: ${N * d}.${base ? ` La base es igual: ${N * d}.` : ''}`],
      [`Costados: a la izquierda ${d}, cada uno de los ${N - 1} escalones ${d} y a la derecha la columna entera, ${N} · ${d}: ${2 * N * d} en total.`],
      ['Suma: ', v('A', cant(correcta, 'cuadraditos')), '.'],
    ] : [
      [`Vista desde arriba, la pirámide es un cuadrado de ${2 * N - 1} × ${2 * N - 1}: ${(2 * N - 1) ** 2} cuadraditos arriba${base ? ' y otros tantos en la base' : ''}.`],
      [`Cada piso de lado 2j − 1 tiene 4(2j − 1) caras verticales a la vista; sumando los ${N} pisos: 4 · ${N}² = ${4 * N * N}.`],
      ['Suma: ', v('A', cant(correcta, 'cuadraditos')), '.'],
    ];
    return cerrar(rng, semilla, { variables, enunciado, pregunta, solucion, correcta, errores, unidad: 'cuadraditos', _datos: { tipo: 'escalera', regla, d, N, base } });
  }

  function cerrar(rng, semilla, { variables, enunciado, pregunta, solucion, correcta, errores, unidad, _datos }) {
    if (!entero(correcta)) return null;
    const texto = x => cant(x, unidad);
    const alternativas = P.armar({ correcta, errores: errores.filter(e => entero(e.valor)), rng, texto });
    return {
      id: `cubitos-conteo#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad }, _datos,
    };
  }

  return { id: 'cubitos-conteo', titulo: 'Cubitos que se cuentan', generar, _interno: { area, carasPintadas, bloque, sinPintar } };
});
