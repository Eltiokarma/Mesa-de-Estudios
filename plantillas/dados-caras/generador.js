/*
 * Generador: dados y dominó (razonamiento matemático, juegos recreativos).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['dados-caras']) y en Node (require).
 *
 * Todo se resuelve por fuerza bruta: cada dado común se prueba en sus 24 orientaciones
 * (caras opuestas que suman 7), dado por dado, con una tabla que guarda la cara que toca al
 * dado siguiente (así se respetan las condiciones en los contactos). El dominó se recorre ficha
 * por ficha. Ninguna fórmula: las fórmulas están en las pruebas, como cálculo independiente.
 *
 * Caras de un dado: arriba, abajo, frente, atrás, izquierda, derecha.
 * Tipos (_datos.tipo):
 *   torre     k dados apilados sobre la mesa; suma máxima o mínima de los puntos visibles u ocultos.
 *             _datos: { k, pide, extremo, condicion }; pide 'ocultos' | 'visibles'; extremo 'max' | 'min';
 *             condicion: null, { tipo: 'valor', t } (la cara de arriba de la torre muestra t)
 *             o { tipo: 'paridad', par: true | false } (la cara de arriba muestra un número par o impar).
 *   fila      k dados pegados en fila sobre la mesa, de izquierda a derecha, con o sin pared atrás;
 *             _datos: { k, pared, pide, extremo }.
 *   contacto  torre de k dados en la que cada par de caras en contacto cumple una regla;
 *             _datos: { k, pide, extremo, regla }, regla { tipo: 'suma', S } o { tipo: 'iguales' }.
 *   producto  k dados sueltos (que no se tocan) sobre la mesa; el producto de las caras de arriba es P;
 *             suma máxima o mínima de las caras que tocan la mesa. _datos: { k, P, extremo }.
 *   domino    dominó del 0 al m (cada par de números una sola vez, dobles incluidos).
 *             _datos: { m, pide, cond }; pide 'cuantas' (fichas que cumplen cond), 'suma' (puntos de
 *             todo el juego) o 'fichas' (cuántas fichas tiene); cond { tipo, q } con tipo 'primo',
 *             'par', 'impar', 'multiplo', 'mayor', 'menor' o 'contiene' (la suma de la ficha, salvo en
 *             'contiene': la ficha tiene una mitad con q puntos).
 * Visible: lo que se ve caminando alrededor de la mesa; ocultas: las que tocan la mesa, otro dado o la pared.
 * Errores: RME10, RME11 y RME12 (docs/investigacion/razonamiento-espacial-ideas-erroneas.md), AR18
 * (docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md) y RME176, RME178 y RME179, nuevos.
 * Respuesta: p.respuesta.valor, un entero (puntos o fichas) según _datos.tipo.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const AR = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const v = P.v;
  const f = x => P.formatear(x, 0);
  const ARR = 0, ABA = 1, FRE = 2, ATR = 3, IZQ = 4, DER = 5;

  // ---------- Las 24 orientaciones de un dado común ----------
  // Una rotación es una permutación: la cara i nueva lleva el valor de la cara perm[i] vieja.
  const girar = (d, perm) => perm.map(i => d[i]);
  const ROT_VERTICAL = [ARR, ABA, DER, IZQ, FRE, ATR]; // gira sobre el eje vertical
  const ROT_ADELANTE = [ATR, FRE, ARR, ABA, IZQ, DER];  // vuelca hacia adelante
  function orientaciones() {
    const vistos = new Map(), cola = [[1, 6, 2, 5, 3, 4]];
    while (cola.length) {
      const d = cola.pop(), k = d.join('');
      if (vistos.has(k)) continue;
      vistos.set(k, d);
      cola.push(girar(d, ROT_VERTICAL), girar(d, ROT_ADELANTE));
    }
    return [...vistos.values()];
  }
  const DADO = orientaciones();
  // Un «dado libre» es el error RME10: cualquier reparto de 1 a 6 en las caras, sin la regla del 7.
  function permutaciones(l) {
    if (l.length <= 1) return [l];
    return l.flatMap((x, i) => permutaciones([...l.slice(0, i), ...l.slice(i + 1)]).map(p => [x, ...p]));
  }
  const LIBRE = permutaciones([1, 2, 3, 4, 5, 6]);

  /*
   * extremo(dados, { cuenta, propia, contacto, haciaSig, desdeAnt, libre, max })
   *   cuenta(i) → caras del dado i que se suman; propia(i, o) → si la orientación o cumple la
   *   condición del dado i; contacto(a, b) → si dos caras en contacto cumplen la regla;
   *   haciaSig / desdeAnt: la cara del dado i que toca al siguiente y la del siguiente que la toca.
   * Recorre todas las orientaciones de cada dado; la tabla guarda, por cada valor de la cara que
   * toca al siguiente, la mejor suma hasta ahí. Devuelve la suma extrema, o null si nada cumple.
   */
  function extremo(k, { cuenta, propia = () => true, contacto = null, haciaSig = ARR, desdeAnt = ABA, libre = false, max = true }) {
    const todas = libre ? LIBRE : DADO;
    const mejor = (x, y) => (x === undefined ? y : max ? Math.max(x, y) : Math.min(x, y));
    let tabla = new Map([[null, 0]]);
    for (let i = 0; i < k; i++) {
      const nueva = new Map();
      for (const [ant, acum] of tabla) for (const o of todas) {
        if (!propia(i, o)) continue;
        if (i > 0 && contacto && !contacto(ant, o[desdeAnt])) continue;
        const s = acum + cuenta(i).reduce((t, c) => t + o[c], 0);
        const clave = o[haciaSig];
        nueva.set(clave, mejor(nueva.get(clave), s));
      }
      tabla = nueva;
    }
    if (!tabla.size) return null;
    return [...tabla.values()].reduce((a, b) => mejor(a, b));
  }

  // Caras de la torre: el dado 0 toca la mesa; el último es el de arriba.
  const torreOcultas = k => i => (i < k - 1 ? [ARR, ABA] : [ABA]);
  const torreVisibles = k => i => (i < k - 1 ? [FRE, ATR, IZQ, DER] : [ARR, FRE, ATR, IZQ, DER]);
  const complemento = cuenta => i => [0, 1, 2, 3, 4, 5].filter(c => !cuenta(i).includes(c));

  function generar(semilla) {
    const rng = Azar.crear('dados-caras|' + semilla);
    const tipo = rng.elegir(['torre', 'torre', 'fila', 'fila', 'contacto', 'producto', 'domino', 'domino']);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = ({ torre, fila, contacto, producto, domino })[tipo](rng, semilla);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  const PALABRA = { max: 'máxima', min: 'mínima' };
  const COMUN = 'dados comunes (en cada dado, las caras opuestas suman 7 puntos)';
  const QUE_SE_VE = 'Se cuentan como visibles las caras que se ven caminando alrededor de la mesa; las que tocan la mesa u otro dado (o una pared, si la hay) no se ven.';
  const variablesDados = () => ({ k: { nombre: 'dados', color: 'o' }, c: { nombre: 'condición', color: 'i' }, s: { nombre: 'suma pedida', color: 'd' } });

  // Los errores comunes a torres y filas, calculados con el mismo recorrido y otro modelo.
  function erroresComunes(k, cfg, cuentaBien, cuentaRME11, explicRME11, extra = []) {
    const errores = [];
    errores.push(h('RME10', extremo(k, { ...cfg, cuenta: cuentaBien, libre: true }),
      'Elegiste los puntos de cada cara por separado, como si cualquier número pudiera ir en cualquier cara. En un dado común las caras opuestas suman 7: si una cara oculta tiene 6, la opuesta tiene 1.'));
    for (const [cuenta, explic] of [[cuentaRME11, explicRME11], ...extra]) errores.push(h('RME11', extremo(k, { ...cfg, cuenta }), explic));
    const otroLado = extremo(k, { ...cfg, cuenta: complemento(cuentaBien) });
    errores.push(h('RME178', 21 * k - otroLado,
      `Restaste del total (21 puntos por dado, ${21 * k} en total) el extremo equivocado. Para que lo pedido sea ${cfg.max ? 'máximo' : 'mínimo'}, lo otro tiene que ser ${cfg.max ? 'mínimo' : 'máximo'}.`));
    return errores;
  }

  // ---------- torre ----------
  function torre(rng, semilla) {
    const k = rng.entero(2, 5);
    const pide = rng.elegir(['ocultos', 'ocultos', 'visibles']);
    const max = rng.moneda();
    const tc = rng.elegir([null, 'valor', 'valor', 'paridad']);
    const condicion = tc === 'valor' ? { tipo: 'valor', t: rng.entero(1, 6) } : tc === 'paridad' ? { tipo: 'paridad', par: rng.moneda() } : null;
    const propia = (i, o) => i < k - 1 || !condicion || (condicion.tipo === 'valor' ? o[ARR] === condicion.t : (o[ARR] % 2 === 0) === condicion.par);
    const cfg = { propia, max };
    const cuentaBien = pide === 'ocultos' ? torreOcultas(k) : torreVisibles(k);
    const correcta = extremo(k, { ...cfg, cuenta: cuentaBien });
    // RME11: las caras en contacto como visibles (solo se oculta la de la mesa), o la de la mesa como visible.
    const soloMesa = i => (i === 0 ? [ABA] : []);
    const soloContactos = i => torreOcultas(k)(i).filter(c => !(i === 0 && c === ABA));
    const cuentaRME11 = pide === 'ocultos' ? soloMesa : complemento(soloMesa);
    const otra = pide === 'ocultos' ? soloContactos : complemento(soloContactos);
    const errores = erroresComunes(k, cfg, cuentaBien, cuentaRME11,
      pide === 'ocultos' ? 'Tomaste como oculta solo la cara que toca la mesa. Las caras en contacto entre dados tampoco se ven: cada dado tapa la cara de arriba del que tiene debajo.'
        : 'Contaste como visibles las caras en contacto entre dados. Entre dos dados apilados hay dos caras que se tocan y ninguna se ve.',
      [[otra, pide === 'ocultos' ? 'Contaste como visible la cara que toca la mesa. Esa cara está tapada por la mesa: también es oculta.'
        : 'Contaste como visible la cara que toca la mesa. Esa cara está tapada: no se ve.']]);
    if (condicion) errores.push(h('RME179', extremo(k, { max, cuenta: cuentaBien }),
      'No usaste el dato de la cara de arriba. Ese dato fija (o limita) también la cara opuesta, la de abajo del dado de arriba.'));
    const enunciado = [`Se apilan `, v('k', `${k} ${COMUN}`), ', uno encima de otro, sobre una mesa. ', QUE_SE_VE];
    if (condicion) enunciado.push(' ', v('c', condicion.tipo === 'valor' ? `La cara de arriba de la torre muestra ${condicion.t} ${condicion.t === 1 ? 'punto' : 'puntos'}.` : `La cara de arriba de la torre muestra un número ${condicion.par ? 'par' : 'impar'} de puntos.`));
    const pregunta = ['¿Cuál es la suma ', v('s', `${PALABRA[max ? 'max' : 'min']} de los puntos ${pide === 'ocultos' ? 'de las caras no visibles' : 'de las caras visibles'}`), '?'];
    const sol = [
      ['En cada dado, las cuatro caras de los costados se ven y suman 21 − 7 = 14, porque son dos pares de caras opuestas.'],
      [`Ocultas: en cada dado de abajo, la cara de arriba y la de abajo (un par opuesto: 7 puntos); en el dado de arriba, solo la de abajo. Eso da 7 · ${k - 1} = ${7 * (k - 1)} más la cara de abajo del último dado.`],
      ['La cara de abajo del dado de arriba es 7 menos la de arriba de la torre', condicion ? ', que está fijada o limitada por el dato.' : '; se elige la de arriba para que la suma pedida sea extrema.'],
      ['Respuesta: ', v('s', `${f(correcta)} puntos`), '.'],
    ];
    return cerrar(rng, semilla, { variables: variablesDados(), enunciado, pregunta, solucion: sol, correcta, errores, unidad: 'puntos', _datos: { tipo: 'torre', k, pide, extremo: max ? 'max' : 'min', condicion } });
  }

  // ---------- fila ----------
  function fila(rng, semilla) {
    const k = rng.entero(2, 5), pared = rng.moneda();
    const pide = rng.elegir(['ocultos', 'visibles']), max = rng.moneda();
    const vis = i => [ARR, FRE, ...(pared ? [] : [ATR]), ...(i === 0 ? [IZQ] : []), ...(i === k - 1 ? [DER] : [])];
    const cuentaBien = pide === 'visibles' ? vis : complemento(vis);
    const cfg = { max };
    const correcta = extremo(k, { ...cfg, cuenta: cuentaBien });
    const visRME11 = i => [ARR, FRE, ...(pared ? [] : [ATR]), IZQ, DER];
    const visPared = i => [...vis(i), ATR];
    const extra = pared ? [[pide === 'visibles' ? visPared : complemento(visPared), 'Contaste como visible la cara de atrás. Está pegada a la pared: no se ve.']] : [];
    const errores = erroresComunes(k, cfg, cuentaBien, pide === 'visibles' ? visRME11 : complemento(visRME11),
      'Contaste como visibles las caras de los costados que quedan pegadas al dado vecino. Entre dos dados pegados hay dos caras que se tocan y ninguna se ve: solo se ven el costado izquierdo del primero y el derecho del último.', extra);
    const enunciado = ['Sobre una mesa se colocan ', v('k', `${k} ${COMUN}`), ', en fila de izquierda a derecha y pegados uno al otro por sus caras',
      pared ? '. La fila está contra una pared: la cara de atrás de cada dado toca la pared. ' : '. La fila está en el centro de la mesa, lejos de las paredes. ', QUE_SE_VE];
    const pregunta = ['¿Cuál es la suma ', v('s', `${PALABRA[max ? 'max' : 'min']} de los puntos ${pide === 'ocultos' ? 'de las caras no visibles' : 'de las caras visibles'}`), '?'];
    const sol = [
      [`Visibles: en cada dado, la de arriba y la del frente${pared ? '' : ' y la de atrás'}; además, el costado izquierdo del primero y el derecho del último.`],
      ['Caras que se ven juntas y no son opuestas pueden tener los números más altos (o más bajos) a la vez: 6, 5 y 4 (o 1, 2 y 3). Dos caras opuestas suman siempre 7.'],
      [`Lo que no se ve es el total, 21 · ${k} = ${21 * k}, menos lo que se ve: para que una suma sea ${max ? 'máxima' : 'mínima'}, la otra tiene que ser ${max ? 'mínima' : 'máxima'}.`],
      ['Respuesta: ', v('s', `${f(correcta)} puntos`), '.'],
    ];
    return cerrar(rng, semilla, { variables: variablesDados(), enunciado, pregunta, solucion: sol, correcta, errores, unidad: 'puntos', _datos: { tipo: 'fila', k, pared, pide, extremo: max ? 'max' : 'min' } });
  }

  // ---------- contacto ----------
  function contacto(rng, semilla) {
    const k = rng.entero(2, 4), pide = rng.elegir(['ocultos', 'ocultos', 'visibles']), max = rng.moneda();
    const regla = rng.sig() < 0.7 ? { tipo: 'suma', S: rng.entero(3, 11) } : { tipo: 'iguales' };
    const rel = regla.tipo === 'suma' ? (a, b) => a + b === regla.S : (a, b) => a === b;
    const cfg = { max, contacto: rel };
    const cuentaBien = pide === 'ocultos' ? torreOcultas(k) : torreVisibles(k);
    const correcta = extremo(k, { ...cfg, cuenta: cuentaBien });
    if (correcta === null) return null;
    const sinRegla = extremo(k, { max, cuenta: cuentaBien });
    if (sinRegla === correcta) return null; // la regla no cambia nada: no hay qué pensar
    const soloMesa = i => (i === 0 ? [ABA] : []);
    const errores = [
      h('RME179', sinRegla, `No usaste la regla de las caras en contacto. ${regla.tipo === 'suma' ? `Cada par que se toca suma ${regla.S}` : 'Las caras que se tocan son iguales'}, y eso, junto con las caras opuestas que suman 7, encadena los números de un dado al siguiente.`),
      ...erroresComunes(k, cfg, cuentaBien, pide === 'ocultos' ? soloMesa : complemento(soloMesa),
        pide === 'ocultos' ? 'Tomaste como oculta solo la cara que toca la mesa. Las caras en contacto entre dados también están ocultas.'
          : 'Contaste como visibles las caras en contacto entre dados. Esas caras están tapadas.'),
    ];
    const enunciado = ['Se apilan ', v('k', `${k} ${COMUN}`), ', uno encima de otro, sobre una mesa, de modo que ',
      v('c', regla.tipo === 'suma' ? `en cada par de caras en contacto entre dos dados los puntos suman ${regla.S}` : 'en cada par de caras en contacto entre dos dados los puntos son iguales'), '. ', QUE_SE_VE];
    const pregunta = ['¿Cuál es la suma ', v('s', `${PALABRA[max ? 'max' : 'min']} de los puntos ${pide === 'ocultos' ? 'de las caras no visibles' : 'de las caras visibles'}`), '?'];
    const sol = [
      ['Si la cara de abajo del dado de arriba tiene x puntos, la regla da la de arriba del dado siguiente, y el 7 da su cara de abajo; así se baja dado por dado hasta la mesa.'],
      ['Solo sirven los x con los que todas las caras quedan entre 1 y 6. Se prueban todos y se elige el que hace la suma extrema.'],
      [`Las caras de los costados suman 14 en cada dado; ${pide === 'ocultos' ? 'las ocultas son los contactos y la cara de la mesa' : 'las visibles son los costados y la cara de arriba de la torre'}.`],
      ['Respuesta: ', v('s', `${f(correcta)} puntos`), '.'],
    ];
    return cerrar(rng, semilla, { variables: variablesDados(), enunciado, pregunta, solucion: sol, correcta, errores, unidad: 'puntos', _datos: { tipo: 'contacto', k, pide, extremo: max ? 'max' : 'min', regla } });
  }

  // ---------- producto ----------
  function producto(rng, semilla) {
    const k = rng.entero(2, 3), max = rng.moneda();
    // Los valores de arriba que puede mostrar cada dado salen de sus 24 orientaciones.
    const arriba = [...new Set(DADO.map(o => o[ARR]))];
    let tuplas = [[]];
    for (let i = 0; i < k; i++) tuplas = tuplas.flatMap(t => arriba.map(x => [...t, x]));
    const Pv = rng.elegir(tuplas).reduce((a, b) => a * b, 1);
    const sirven = tuplas.filter(t => t.reduce((a, b) => a * b, 1) === Pv);
    const sumas = sirven.map(t => t.reduce((s, x) => s + (7 - x), 0)); // caras de abajo
    const correcta = max ? Math.max(...sumas) : Math.min(...sumas);
    if (Math.max(...sumas) === Math.min(...sumas)) return null;
    const arr = sirven.map(t => t.reduce((s, x) => s + x, 0));
    // Lo que encuentra quien busca una sola forma, con el factor más grande primero.
    let resto = Pv; const primera = [];
    for (let i = 0; i < k; i++) { let x = 6; while (x > 1 && resto % x) x--; primera.push(x); resto /= x; }
    const errores = [
      h('RME10', max ? Math.max(...arr) : Math.min(...arr), 'Sumaste las caras de arriba como si fueran las de abajo. La cara que toca la mesa es la opuesta a la de arriba: tiene 7 menos esos puntos.'),
      h('RME178', max ? Math.min(...sumas) : Math.max(...sumas), `Elegiste el reparto que da la suma ${max ? 'mínima' : 'máxima'} abajo. Para que las caras de abajo sumen ${max ? 'lo más' : 'lo menos'}, las de arriba tienen que sumar ${max ? 'lo menos' : 'lo más'}.`),
      h('RME179', max ? 6 * k : k, `No usaste el producto. Con todas las caras de abajo en ${max ? 6 : 1}, las de arriba serían ${max ? 1 : 6} y su producto no sería ${Pv}.`),
    ];
    if (resto === 1) errores.push({ ...h('AR18', primera.reduce((s, x) => s + 7 - x, 0), `Te quedaste con la primera forma que encontraste (${primera.join(' · ')}). Hay que listar todas las formas de repartir el producto ${Pv} entre los dados y comparar.`), respaldo: 'parcial', fuente: AR });
    const enunciado = ['Sobre una mesa hay ', v('k', `${k} ${COMUN}`), ' separados, sin tocarse. ', v('c', `El producto de los puntos de las caras de arriba es ${Pv}`), '.'];
    const pregunta = ['¿Cuál es la suma ', v('s', `${PALABRA[max ? 'max' : 'min']} de los puntos de las caras que tocan la mesa`), '?'];
    const ej = sirven[(max ? sumas.indexOf(Math.max(...sumas)) : sumas.indexOf(Math.min(...sumas)))];
    const sol = [
      [`Se listan las formas de escribir ${Pv} como producto de ${k} números del 1 al 6 (el orden de los dados no cambia la suma).`],
      [`Cada cara de abajo es 7 menos la de arriba: la suma de abajo es ${7 * k} menos la suma de arriba. Para que sea ${max ? 'máxima' : 'mínima'}, la de arriba tiene que ser ${max ? 'mínima' : 'máxima'}.`],
      [`El mejor reparto es ${ej.join(' · ')}: abajo quedan ${ej.map(x => 7 - x).join(' + ')} = `, v('s', `${f(correcta)} puntos`), '.'],
    ];
    return cerrar(rng, semilla, { variables: variablesDados(), enunciado, pregunta, solucion: sol, correcta, errores, unidad: 'puntos', _datos: { tipo: 'producto', k, P: Pv, extremo: max ? 'max' : 'min' } });
  }

  // ---------- dominó ----------
  const esPrimo = n => n > 1 && [...Array(n).keys()].slice(2).every(d => n % d);
  const COND = {
    primo: { prueba: (a, b) => esPrimo(a + b), texto: () => 'la suma de sus puntos es un número primo' },
    par: { prueba: (a, b) => (a + b) % 2 === 0, texto: () => 'la suma de sus puntos es par' },
    impar: { prueba: (a, b) => (a + b) % 2 === 1, texto: () => 'la suma de sus puntos es impar' },
    multiplo: { prueba: (a, b, q) => (a + b) % q === 0 && a + b > 0, texto: q => `la suma de sus puntos es un múltiplo de ${q} (el 0 no cuenta como múltiplo)` },
    mayor: { prueba: (a, b, q) => a + b > q, texto: q => `la suma de sus puntos es mayor que ${q}` },
    menor: { prueba: (a, b, q) => a + b < q, texto: q => `la suma de sus puntos es menor que ${q}` },
    contiene: { prueba: (a, b, q) => a === q || b === q, texto: q => `tienen al menos una mitad con ${q} ${q === 1 ? 'punto' : 'puntos'}${q === 0 ? ' (el blanco)' : ''}` },
  };
  function fichas(m, { ordenadas = false, dobles = true, blanco = true } = {}) {
    const r = [];
    for (let a = blanco ? 0 : 1; a <= m; a++) for (let b = ordenadas ? (blanco ? 0 : 1) : a; b <= m; b++) {
      if (!dobles && a === b) continue;
      r.push([a, b]);
    }
    return r;
  }
  function domino(rng, semilla) {
    const m = rng.sig() < 0.65 ? 6 : rng.elegir([4, 5, 7, 8, 9]);
    const pide = rng.elegir(['cuantas', 'cuantas', 'cuantas', 'suma', ...(m === 6 ? [] : ['fichas'])]);
    let cond = null;
    if (pide === 'cuantas') {
      const t = rng.elegir(Object.keys(COND));
      const q = t === 'multiplo' ? rng.elegir([3, 4, 5]) : t === 'mayor' ? rng.entero(3, 2 * m - 3) : t === 'menor' ? rng.entero(3, 2 * m - 2) : t === 'contiene' ? rng.entero(0, m) : null;
      cond = { tipo: t, q };
    }
    const medir = opciones => {
      const l = fichas(m, opciones);
      if (pide === 'cuantas') return l.filter(([a, b]) => COND[cond.tipo].prueba(a, b, cond.q)).length;
      if (pide === 'suma') return l.reduce((s, [a, b]) => s + a + b, 0);
      return l.length;
    };
    const correcta = medir({});
    if (correcta <= 0) return null;
    const errores = [
      h('RME12', medir({ ordenadas: true }), 'Contaste (a, b) y (b, a) como fichas distintas. Una ficha de 2 y 5 es la misma que una de 5 y 2: cada par de números está una sola vez.'),
      h('RME176', medir({ dobles: false }), 'Olvidaste los dobles (0-0, 1-1, …). En el dominó cada número también va con sí mismo.'),
      { ...h('AR18', medir({ blanco: false }), 'Olvidaste las fichas que tienen el blanco (0). Al listar, conviene empezar por el 0 y seguir en orden para no saltarse ninguna.'), respaldo: 'parcial', fuente: AR },
      h('RME12', medir({ ordenadas: true, dobles: false }), 'Contaste (a, b) y (b, a) como fichas distintas y dejaste fuera los dobles. Cada par de números distintos está una sola vez, y los dobles también cuentan.'),
    ];
    const variables = { m: { nombre: 'mayor número del dominó', color: 'o' }, c: { nombre: 'condición', color: 'i' }, s: { nombre: 'respuesta', color: 'd' } };
    const juego = m === 6 ? ['un dominó común, ', v('m', 'del 0 (blanco) al 6'), ', que trae una ficha por cada par de números, dobles incluidos'] : ['un dominó ', v('m', `del 0 (blanco) al ${m}`), ', que trae una ficha por cada par de números, dobles incluidos'];
    const enunciado = ['Se tiene ', ...juego, '.'];
    let pregunta, unidad;
    if (pide === 'cuantas') {
      pregunta = cond.tipo === 'contiene' ? ['¿Cuántas ', v('s', 'fichas'), ' ', v('c', COND[cond.tipo].texto(cond.q)), '?']
        : ['¿En cuántas ', v('s', 'fichas'), ' ', v('c', COND[cond.tipo].texto(cond.q)), '?'];
      unidad = 'fichas';
    }
    else if (pide === 'suma') { pregunta = ['¿Cuántos ', v('s', 'puntos'), ' hay en total, sumando todas las fichas del juego?']; unidad = 'puntos'; }
    else { pregunta = ['¿Cuántas ', v('s', 'fichas'), ' tiene el juego?']; unidad = 'fichas'; }
    const N = (m + 1) * (m + 2) / 2;
    const sol = [[`Las fichas son los pares (a, b) con 0 ≤ a ≤ b ≤ ${m}: ${m + 1} dobles y ${m * (m + 1) / 2} con números distintos, ${N} en total.`]];
    if (pide === 'cuantas') {
      const ok = fichas(m).filter(([a, b]) => COND[cond.tipo].prueba(a, b, cond.q));
      sol.push(['Se recorren en orden, empezando por el blanco: ', ok.length <= 16 ? ok.map(([a, b]) => `${a}-${b}`).join(', ') : `${ok.slice(0, 12).map(([a, b]) => `${a}-${b}`).join(', ')}, …`, '.']);
    } else if (pide === 'suma') sol.push([`Cada número del 0 al ${m} aparece ${m + 2} veces en las mitades (una vez con cada número, y dos en su doble). Suma: ${m + 2} · (0 + 1 + … + ${m}) = ${m + 2} · ${m * (m + 1) / 2}.`]);
    sol.push(['Respuesta: ', v('s', `${f(correcta)} ${unidad}`), '.']);
    return cerrar(rng, semilla, { variables, enunciado, pregunta, solucion: sol, correcta, errores, unidad, _datos: { tipo: 'domino', m, pide, cond } });
  }

  function cerrar(rng, semilla, { variables, enunciado, pregunta, solucion, correcta, errores, unidad, _datos }) {
    if (!Number.isInteger(correcta) || correcta <= 0) return null;
    const cant = x => `${f(x)} ${x === 1 ? unidad.replace(/s$/, '') : unidad}`;
    const alternativas = P.armar({ correcta, errores: errores.filter(e => Number.isInteger(e.valor) && e.valor > 0), rng, texto: cant });
    return {
      id: `dados-caras#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta, unidad }, _datos,
    };
  }

  return { id: 'dados-caras', titulo: 'Dados y dominó', generar, _interno: { DADO, LIBRE, extremo } };
});
