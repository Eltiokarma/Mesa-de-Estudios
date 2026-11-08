/*
 * Generador: certezas, el mínimo de extracciones a ciegas para estar seguro (el peor caso).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['rm-certezas']) y en Node (require).
 *
 * Idea que se repite en todos los tipos: la respuesta es (el mayor grupo que se puede sacar SIN lograr lo
 * pedido) + 1. Ese grupo es el «peor caso»: la mala suerte saca primero todo lo que no sirve.
 *
 * Tipos y sus _datos:
 *   colores        { tipo, urna: { color: cantidad }, pide: 'mismo' | 'uno-de-cada' | 'de-color', k, color }
 *   guantes        { tipo, pares: { color: pares }, color }       color null: un par usable de cualquier color
 *   divisibilidad  { tipo, N, a, b, k }                           fichas 1..N; k múltiplos de a o de b
 *   suma-supera    { tipo, valores, S }                           cartas boca abajo; que la suma pase de S
 *   pareja-suma    { tipo, N, copias, S }                         discos 1..N, «copias» de cada número; dos que sumen S
 *   trio-suma      { tipo, N, S }                                 fichas 1..N; tres distintas que sumen S
 *   consecutivos   { tipo, N, k }                                 fichas 1..N; k números consecutivos (k = 2 o 3)
 *   paridad        { tipo, desde, hasta, pide: 'producto-par' | 'suma-impar' | 'suma-par' }
 *   diferencia     { tipo, desde, hasta, d, pide: 'mayor' | 'igual' }   dos con diferencia mayor que d o igual a d
 *   division       { tipo, N }                                    fichas 1..N; dos tales que el mayor entre el menor sea entero
 *   primos         { tipo, N, S }                                 bolos 1..N; dos primos cuya suma pase de S
 *   billetes       { tipo, billetes: { valor: cantidad }, M }     dos billetes que sumen exactamente M
 *   cumpleanos     { tipo, casilla: 'fecha' | 'mes' | 'semana' | 'dia-mes', k }
 *   suma-cifras    { tipo, desde, hasta, k }                      k fichas con la misma suma de cifras
 *   llaves         { tipo, n }                                    n llaves y n candados
 *   cajas          { tipo, pide: 'cual' | 'contenido', etiquetas, sale, rotulo }   tres cajas con rótulos todos errados
 *
 * calc (funciones puras; cada una devuelve { respuesta, peor, ... }, peor = un grupo del peor caso cuando aplica):
 *   colores, guantes, divisibilidad, sumaSupera, parejaSuma, trioSuma, consecutivos, paridad, diferencia,
 *   division, primos, billetes, cumpleanos, sumaCifras, llaves, cajas, esPrimo, sumaDeCifras.
 *
 * Errores (todos hipótesis; RM6 es hipótesis en docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md):
 *   RM6-favorable            el caso favorable (la buena suerte) en vez del peor caso
 *   RMP30-…                  olvidar en el peor caso lo que no sirve (sin pareja, no primos, el 1, otros colores)
 *   RMP31-…                  armar mal el peor caso (tomar los mayores, un solo color, ignorar izquierdo y derecho…)
 *   RMP32-…                  contar mal el conjunto (sin restar los comunes, contar los que sí sirven)
 *   RMP33-…                  palomar con casillas mal contadas (sin el 29 de febrero, sumas con pocos casos)
 *   RMP34-…                  el paso final: sin el +1, un +1 de más, el último intento que ya se sabe
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'rm-certezas';
  const FUENTE = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: id.startsWith('RM6') ? FUENTE : null });
  const v = P.v;
  const f = x => P.formatear(x, 0);
  const rango = (a, b) => { const r = []; for (let x = a; x <= b; x++) r.push(x); return r; };
  const suma = l => l.reduce((s, x) => s + x, 0);
  const SINGULAR = { canicas: 'canica', bolas: 'bola', fichas: 'ficha', guantes: 'guante', zapatos: 'zapato', cartas: 'carta', tarjetas: 'tarjeta', discos: 'disco', pesas: 'pesa', bolos: 'bolo', billetes: 'billete', personas: 'persona', intentos: 'intento' };
  const singular = u => SINGULAR[u] || u;
  const cuantos = (n, u) => `${n} ${n === 1 ? singular(u) : u}`;
  const lista = l => l.length <= 1 ? l.join('') : l.slice(0, -1).join(', ') + ' y ' + l[l.length - 1];
  const listaN = l => lista(l.map(String));

  // ======================= cálculo (regla 1) =======================
  function esPrimo(n) { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; }
  function sumaDeCifras(n) { let s = 0; while (n > 0) { s += n % 10; n = Math.floor(n / 10); } return s; }

  function colores({ urna, pide, k, color }) {
    const cs = Object.keys(urna), n = cs.map(c => urna[c]), total = suma(n);
    if (pide === 'mismo') { const malo = suma(n.map(x => Math.min(x, k - 1))); return { respuesta: malo + 1, malo }; }
    if (pide === 'uno-de-cada') { const mn = Math.min(...n); return { respuesta: total - mn + 1, malo: total - mn }; }
    const otros = total - urna[color]; return { respuesta: otros + k, malo: otros + k - 1 };
  }
  // Cada par: un guante izquierdo y uno derecho. Peor caso: todos los de los otros colores y, del pedido, solo izquierdos.
  function guantes({ pares, color }) {
    const cs = Object.keys(pares);
    if (!color) { const malo = suma(cs.map(c => pares[c])); return { respuesta: malo + 1, malo }; }
    const otros = 2 * suma(cs.filter(c => c !== color).map(c => pares[c]));
    return { respuesta: otros + pares[color] + 1, malo: otros + pares[color], otros };
  }
  function divisibilidad({ N, a, b, k }) {
    const A = Math.floor(N / a), B = Math.floor(N / b), l = a * b / mcd(a, b), AB = Math.floor(N / l);
    const sirven = A + B - AB, noSirven = N - sirven;
    return { respuesta: noSirven + k, A, B, AB, mcm: l, sirven, noSirven };
  }
  function mcd(a, b) { while (b) [a, b] = [b, a % b]; return a; }
  // Peor caso: salen primero las más chicas. Se busca la primera cantidad cuya suma de las m menores pase de S.
  function sumaSupera({ valores, S }) {
    const ord = valores.slice().sort((x, y) => x - y);
    let s = 0;
    for (let m = 1; m <= ord.length; m++) { s += ord[m - 1]; if (s > S) return { respuesta: m, peor: ord.slice(0, m - 1), sumaPeor: s - ord[m - 1] }; }
    return { respuesta: null };
  }
  // Discos 1..N con «copias» de cada número. Parejas complementarias x + y = S (x < y), el número S/2 consigo mismo.
  function parejaSuma({ N, copias, S }) {
    const parejas = [], solos = [];
    let mitad = null;
    for (let x = 1; x <= N; x++) {
      const y = S - x;
      if (y === x) mitad = x;
      else if (y >= 1 && y <= N) { if (x < y) parejas.push([x, y]); }
      else solos.push(x);
    }
    const malo = copias * solos.length + copias * parejas.length + (mitad ? 1 : 0);
    return { respuesta: malo + 1, malo, parejas, solos, mitad };
  }
  // Tres fichas distintas de 1..N que sumen S. Sin fórmula: búsqueda exhaustiva del mayor grupo sin un trío así.
  function trioSuma({ N, S }) {
    const trios = [];
    for (let a = 1; a <= N; a++) for (let b = a + 1; b <= N; b++) { const c = S - a - b; if (c > b && c <= N) trios.push([a, b, c]); }
    let mejor = [];
    const elegido = new Array(N + 1).fill(false);
    (function busca(x, tomados) {
      if (tomados.length + (N - x + 1) <= mejor.length) return;
      if (x > N) { mejor = tomados.slice(); return; }
      // ¿Se puede tomar x sin cerrar un trío?
      const cierra = trios.some(t => t.includes(x) && t.every(y => y === x || elegido[y]));
      if (!cierra) { elegido[x] = true; tomados.push(x); busca(x + 1, tomados); tomados.pop(); elegido[x] = false; }
      busca(x + 1, tomados);
    })(1, []);
    const enTrio = new Set(trios.flat());
    return { respuesta: mejor.length + 1, peor: mejor, trios, fuera: rango(1, N).filter(x => !enTrio.has(x)) };
  }
  // Sin k consecutivos en 1..N: se toman k − 1 y se salta uno.
  function consecutivos({ N, k }) {
    const peor = rango(1, N).filter(x => x % k !== 0);
    return { respuesta: peor.length + 1, peor };
  }
  function paridad({ desde, hasta, pide }) {
    const nums = rango(desde, hasta), imp = nums.filter(x => x % 2), par = nums.filter(x => x % 2 === 0);
    if (pide === 'producto-par') return { respuesta: imp.length + 1, impares: imp.length, pares: par.length };
    if (pide === 'suma-impar') return { respuesta: Math.max(imp.length, par.length) + 1, impares: imp.length, pares: par.length };
    return { respuesta: 3, impares: imp.length, pares: par.length };
  }
  function diferencia({ desde, hasta, d, pide }) {
    if (pide === 'mayor') return { respuesta: d + 2, peor: rango(desde, desde + d) };
    // Cadenas x, x + d, x + 2d…: de cada cadena de largo L se toman ⌈L/2⌉ (una sí y una no).
    const cadenas = [];
    for (let r = desde; r < desde + d && r <= hasta; r++) { const c = []; for (let x = r; x <= hasta; x += d) c.push(x); cadenas.push(c); }
    const peor = cadenas.flatMap(c => c.filter((_, i) => i % 2 === 0));
    return { respuesta: peor.length + 1, peor, cadenas };
  }
  // 1..N: el 1 divide a todos; de N/2 para arriba ninguno divide a otro.
  function division({ N }) {
    const peor = rango(Math.floor(N / 2) + 1, N);
    return { respuesta: peor.length + 1, peor };
  }
  function primos({ N, S }) {
    const ps = rango(1, N).filter(esPrimo), noPrimos = N - ps.length;
    // El grupo de primos sin dos que sumen más de S: basta que sus dos mayores sumen S o menos.
    let mejor = ps.length && ps[0] <= S ? [ps[0]] : [];
    for (let j = 0; j < ps.length; j++) {
      const g = ps.filter((p, i) => i < j && p + ps[j] <= S).concat([ps[j]]);
      if (g.length > mejor.length) mejor = g;
    }
    return { respuesta: noPrimos + mejor.length + 1, primos: ps, noPrimos, peorPrimos: mejor };
  }
  function billetes({ billetes: B, M }) {
    const vs = Object.keys(B).map(Number).sort((a, b) => a - b);
    let malo = 0; const detalle = [];
    for (const x of vs) {
      const y = M - x;
      if (y === x) { const t = Math.min(B[x], 1); malo += t; detalle.push({ valores: [x], toma: t }); }
      else if (B[y] !== undefined) { if (x < y) { const t = Math.max(B[x], B[y]); malo += t; detalle.push({ valores: [x, y], toma: t }); } }
      else { malo += B[x]; detalle.push({ valores: [x], toma: B[x], solo: true }); }
    }
    return { respuesta: malo + 1, malo, detalle };
  }
  const CASILLAS = { fecha: 366, mes: 12, semana: 7, 'dia-mes': 31 };
  function cumpleanos({ casilla, k }) { const c = CASILLAS[casilla]; return { respuesta: c * (k - 1) + 1, casillas: c }; }
  function sumaCifras({ desde, hasta, k }) {
    const cuenta = {};
    for (let x = desde; x <= hasta; x++) { const s = sumaDeCifras(x); cuenta[s] = (cuenta[s] || 0) + 1; }
    const sumas = Object.keys(cuenta).map(Number).sort((a, b) => a - b);
    const malo = suma(sumas.map(s => Math.min(cuenta[s], k - 1)));
    return { respuesta: malo + 1, malo, cuenta, sumas, escasas: sumas.filter(s => cuenta[s] < k - 1) };
  }
  function llaves({ n }) { return { respuesta: n * (n - 1) / 2, porCandado: rango(1, n - 1).reverse() }; }
  // Tres cajas: «A», «B» y «mezcla», todos los rótulos errados. Se enumeran los contenidos posibles.
  const CONTENIDOS = ['A', 'B', 'mezcla'];
  function cajas({ pide, sale, rotulo }) {
    const perms = [];
    for (const a of CONTENIDOS) for (const b of CONTENIDOS) for (const c of CONTENIDOS) {
      const p = [a, b, c];
      if (new Set(p).size === 3 && p.every((x, i) => x !== CONTENIDOS[i])) perms.push(p);
    }
    // ¿De qué caja (por su rótulo) basta sacar una sola cosa para saberlo todo? Para cada cosa que podría salir de
    // ella, deben quedar compatibles a lo más un reparto (sale «A» si la caja tiene solo A o la mezcla).
    const sirve = CONTENIDOS.map((_, i) => ['A', 'B'].every(visto =>
      perms.filter(p => p[i] === visto || p[i] === 'mezcla').length <= 1));
    if (pide === 'cual') return { respuesta: CONTENIDOS[sirve.indexOf(true)], sirve, perms };
    // Se sacó «sale» (A o B) de la caja rotulada «mezcla»: ¿qué tiene la caja con el rótulo pedido?
    const compat = perms.filter(p => p[2] === sale);
    const opciones = new Set(compat.map(p => p[CONTENIDOS.indexOf(rotulo)]));
    return { respuesta: opciones.size === 1 ? [...opciones][0] : 'no-se-sabe', perms: compat };
  }

  const calc = { colores, guantes, divisibilidad, sumaSupera, parejaSuma, trioSuma, consecutivos, paridad, diferencia,
    division, primos, billetes, cumpleanos, sumaCifras, llaves, cajas, esPrimo, sumaDeCifras };

  // ======================= redacción =======================
  const TIPOS = ['colores', 'guantes', 'divisibilidad', 'suma-supera', 'pareja-suma', 'trio-suma', 'consecutivos', 'paridad',
    'diferencia', 'division', 'primos', 'billetes', 'cumpleanos', 'suma-cifras', 'llaves', 'cajas'];
  const COLORES = ['rojas', 'azules', 'verdes', 'amarillas', 'blancas', 'negras'];
  const SING = { rojas: 'roja', azules: 'azul', verdes: 'verde', amarillas: 'amarilla', blancas: 'blanca', negras: 'negra' };
  const SING_M = { negros: 'negro', marrones: 'marrón', blancos: 'blanco', azules: 'azul', grises: 'gris' };
  const RECIPIENTES = ['una caja', 'una bolsa', 'un ánfora', 'una urna'];
  const SEGURO = 'para estar seguro de';

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 60; intento++) {
      const p = construir(rng, semilla, tipo);
      if (p && p.alternativas.length >= 4) return p;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function cerrar(rng, semilla, o) {
    const unidad = o.unidad || '';
    const alternativas = o.texto
      ? P.armarTexto({ correcta: o.correcta, errores: o.errores, rng })
      : P.armar({ correcta: o.correcta, errores: o.errores, rng, decimales: 0, texto: x => f(x) + (unidad ? ' ' + (x === 1 ? singular(unidad) : unidad) : '') });
    return {
      id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.texto ? o.correcta.clave : o.correcta, unidad }, _datos: o.datos,
    };
  }
  const masUno = (r, que) => h('RMP34-sin-mas-uno', r - 1, `Armaste bien el peor caso, pero te quedaste ahí: con ${f(r - 1)} todavía puede fallar. Hace falta ${que} más para estar seguro.`);
  const masDos = r => h('RMP34-mas-uno', r + 1, `Sumaste uno de más. Después del peor caso basta una extracción más: con ${f(r)} ya es seguro.`);

  function construir(rng, semilla, tipo) {
    const fn = { colores: tColores, guantes: tGuantes, divisibilidad: tDivisibilidad, 'suma-supera': tSumaSupera, 'pareja-suma': tParejaSuma,
      'trio-suma': tTrioSuma, consecutivos: tConsecutivos, paridad: tParidad, diferencia: tDiferencia, division: tDivision, primos: tPrimos,
      billetes: tBilletes, cumpleanos: tCumpleanos, 'suma-cifras': tSumaCifras, llaves: tLlaves, cajas: tCajas }[tipo];
    return fn(rng, semilla);
  }

  // ---------- colores ----------
  function tColores(rng, semilla) {
    const nc = rng.entero(3, 4), cs = rng.barajar(COLORES).slice(0, nc), urna = {};
    for (const c of cs) urna[c] = rng.entero(3, 12);
    const pide = rng.elegir(['mismo', 'uno-de-cada', 'de-color']);
    const k = pide === 'mismo' ? rng.entero(2, 5) : pide === 'de-color' ? rng.entero(1, 3) : null;
    const color = pide === 'de-color' ? rng.elegir(cs) : null;
    if (pide === 'mismo' && !cs.some(c => urna[c] >= k)) return null;
    if (pide === 'de-color' && urna[color] < k) return null;
    const datos = { tipo: 'colores', urna, pide, k, color };
    const { respuesta: r } = colores(datos);
    const total = suma(cs.map(c => urna[c])), rec = rng.elegir(RECIPIENTES), obj = rng.elegir(['canicas', 'bolas', 'fichas']);
    const variables = { u: { nombre: 'contenido de la urna', color: 'o' }, k: { nombre: 'cuántas se piden', color: 'i' } };
    const enunciado = [`En ${rec} hay `, v('u', lista(cs.map(c => `${urna[c]} ${obj} ${c}`))), '. Se sacan al azar, una por una y sin mirar.'];
    let pregunta, errores, solucion;
    if (pide === 'mismo') {
      pregunta = [`¿Cuántas hay que sacar como mínimo ${SEGURO} tener `, v('k', `${k} del mismo color`), '?'];
      errores = [
        h('RM6-favorable', k, `Ese es el caso con suerte: que las primeras ${k} salgan del mismo color. Para estar seguro hay que pensar en la peor suerte.`),
        masUno(r, 'una'),
        h('RMP31-todo-un-color', Math.max(...cs.map(c => urna[c])) + 1, 'Pensaste que en el peor caso sale todo un color, pero eso ya te daría lo pedido. El peor caso reparte: saca de cada color lo más posible sin llegar a lo pedido.'),
        h('RMP31-k-de-cada', k * nc + 1, `Sacaste ${k} de cada color en el peor caso, pero con ${k} de un mismo color ya lo lograste. Lo más que se puede sacar sin lograrlo es ${k - 1} de cada color (o todas, si hay menos).`),
        masDos(r),
      ];
      solucion = [
        ['Peor caso: la mala suerte saca de cada color lo más posible sin llegar a ', v('k', `${k}`), ' iguales: ', lista(cs.map(c => Math.min(urna[c], k - 1) === 1 ? `1 ${SING[c]}` : `${Math.min(urna[c], k - 1)} ${c}`)), cs.some(c => urna[c] < k - 1) ? ` (de un color con menos de ${k - 1} salen todas las que hay).` : '.'],
        [`Eso suma ${f(r - 1)} ${obj} sin lograrlo.`],
        [`La siguiente, sea del color que sea, completa ${k} de un color: ${f(r - 1)} + 1 = ${f(r)}.`],
      ];
    } else if (pide === 'uno-de-cada') {
      const mn = Math.min(...cs.map(c => urna[c])), cmn = cs.find(c => urna[c] === mn);
      pregunta = [`¿Cuántas hay que sacar como mínimo ${SEGURO} tener `, v('k', 'al menos una de cada color'), '?'];
      errores = [
        h('RM6-favorable', nc, `Ese es el caso con suerte: que salga justo una de cada color. Para estar seguro hay que pensar en la peor suerte.`),
        masUno(r, 'una'),
        h('RMP31-solo-el-mayor', Math.max(...cs.map(c => urna[c])) + 1, 'En el peor caso no sale solo el color más abundante: pueden salir todos los colores menos uno, completos.'),
        h('RMP31-deja-el-mayor', total - Math.max(...cs.map(c => urna[c])) + 1, 'Dejaste para el final el color más abundante, pero la peor suerte deja para el final el color que menos hay: así saca más sin lograrlo.'),
        masDos(r),
      ];
      solucion = [
        ['Peor caso: salen completos todos los colores menos el que tiene menos ', obj, ` (${cmn}): ${total} − ${mn} = ${f(r - 1)} ${obj}.`],
        [`Todavía falta el color ${cmn}. La siguiente tiene que ser ${SING[cmn]}: ${f(r - 1)} + 1 = ${f(r)}.`],
      ];
    } else {
      const otros = total - urna[color];
      pregunta = [`¿Cuántas hay que sacar como mínimo ${SEGURO} tener `, v('k', k === 1 ? `${obj === 'bolas' ? 'una bola' : obj === 'fichas' ? 'una ficha' : 'una canica'} ${SING[color]}` : `${k} ${obj} ${color}`), '?'];
      const otrosCs = cs.filter(c => c !== color);
      errores = [
        h('RM6-favorable', k, `Ese es el caso con suerte: que salgan ${k === 1 ? 'la pedida' : 'las pedidas'} de frente. Para estar seguro hay que pensar en la peor suerte.`),
        masUno(r, k === 1 ? 'esa' : 'la última'),
        h('RMP30-solo-un-color', Math.max(...otrosCs.map(c => urna[c])) + k, `Pusiste en el peor caso solo un color de los que no sirven. La mala suerte puede sacar todas las ${lista(otrosCs)} antes.`),
        h('RMP31-mismo-color', colores({ urna, pide: 'mismo', k: Math.max(k, 2) }).respuesta, `Resolviste «${Math.max(k, 2)} del mismo color», que es otra pregunta: aquí el color está fijado (${color}), así que no sirve ninguna de otro color.`),
        masDos(r),
      ];
      solucion = [
        ['Peor caso: salen primero todas las que no son ', color, ': ', lista(otrosCs.map(c => `${urna[c]} ${c}`)), ` = ${otros}.`],
        ['Después ya solo quedan ', color, ': hay que sacar ', v('k', `${k}`), ` más. Total: ${otros} + ${k} = ${f(r)}.`],
      ];
    }
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: obj });
  }

  // ---------- guantes ----------
  function tGuantes(rng, semilla) {
    const cosa = rng.elegir([{ n: 'guantes', g: 'guante' }, { n: 'zapatos', g: 'zapato' }]);
    const cs = rng.barajar(['negros', 'marrones', 'blancos', 'azules', 'grises']).slice(0, rng.entero(2, 4)), pares = {};
    for (const c of cs) pares[c] = rng.entero(2, 9);
    const color = rng.moneda() ? rng.elegir(cs) : null;
    const datos = { tipo: 'guantes', pares, color };
    const R = guantes(datos), r = R.respuesta;
    const variables = { u: { nombre: 'pares en el cajón', color: 'o' }, k: { nombre: 'lo que se pide', color: 'i' } };
    const enunciado = [`En un cajón oscuro hay `, v('u', lista(cs.map(c => `${pares[c]} pares de ${cosa.n} ${c}`))),
      `, todos sueltos y mezclados. Cada par tiene un ${cosa.g} izquierdo y uno derecho.`];
    const pregunta = [`¿Cuántos ${cosa.n} hay que sacar como mínimo ${SEGURO} tener `, v('k', color ? `un par ${SING_M[color]} que se pueda usar` : 'un par que se pueda usar (izquierdo y derecho del mismo color)'), '?'];
    let errores, solucion;
    if (!color) {
      const nc = cs.length;
      errores = [
        h('RM6-favorable', 2, 'Ese es el caso con suerte: que los dos primeros formen un par. Para estar seguro hay que pensar en la peor suerte.'),
        h('RMP31-sin-izq-der', nc + 1, `Contaste solo colores, como si dos del mismo color ya fueran un par. Pero dos izquierdos del mismo color no se pueden usar: el peor caso saca puros izquierdos.`),
        masUno(r, 'uno'),
        h('RMP31-un-color', 2 * Math.max(...cs.map(c => pares[c])) + 1, 'Pusiste en el peor caso todos los del color más abundante, pero entre ellos ya hay pares. El peor caso saca de cada color solo un lado.'),
        masDos(r),
      ];
      solucion = [
        [`Peor caso: salen solo ${cosa.n} izquierdos (de cada color, todos los izquierdos que hay): `, lista(cs.map(c => `${pares[c]}`)), ` = ${f(r - 1)}. Ninguno forma par con otro.`],
        [`El siguiente tiene que ser derecho, y su izquierdo del mismo color ya salió: ${f(r - 1)} + 1 = ${f(r)}.`],
      ];
    } else {
      const otrosCs = cs.filter(c => c !== color);
      errores = [
        h('RM6-favorable', 2, 'Ese es el caso con suerte: que salgan de frente el izquierdo y el derecho pedidos. Para estar seguro hay que pensar en la peor suerte.'),
        h('RMP30-solo-izquierdos', pares[color] + 1, `Pensaste solo en los ${cosa.n} ${color}, pero antes pueden salir todos los de otros colores, que no sirven.`),
        h('RMP31-sin-izq-der', R.otros + 2, `Contaste dos ${cosa.n} ${color} como un par, pero pueden ser los dos izquierdos. Del color pedido pueden salir todos los de un lado antes del otro.`),
        masUno(r, 'uno'),
        masDos(r),
      ];
      solucion = [
        [`Peor caso: primero salen todos los ${cosa.n} que no son ${color}: 2 × (`, lista(otrosCs.map(c => `${pares[c]}`)), `) = ${R.otros}.`],
        [`Luego salen todos los ${color} de un solo lado: ${pares[color]}. Van ${f(r - 1)} sin par usable.`],
        [`El siguiente es ${SING_M[color]} del otro lado y completa el par: ${f(r - 1)} + 1 = ${f(r)}.`],
      ];
    }
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: cosa.n });
  }

  // ---------- divisibilidad ----------
  function tDivisibilidad(rng, semilla) {
    const [a, b] = rng.elegir([[3, 5], [2, 5], [3, 7], [4, 6], [2, 3], [4, 5], [5, 7], [6, 9], [3, 4], [2, 7]]);
    const N = rng.entero(25, 80), k = rng.elegir([1, 1, 2, 3]);
    const datos = { tipo: 'divisibilidad', N, a, b, k };
    const R = divisibilidad(datos), r = R.respuesta;
    const variables = { N: { nombre: 'fichas', color: 'o' }, a: { nombre: 'primer divisor', color: 'i' }, b: { nombre: 'segundo divisor', color: 'h' }, k: { nombre: 'cuántas se piden', color: 'd' } };
    const enunciado = ['En una bolsa hay ', v('N', `${N} fichas numeradas del 1 al ${N}`), ', una de cada número. Se sacan sin mirar.'];
    const pregunta = [`¿Cuántas hay que sacar como mínimo ${SEGURO} tener `, v('k', k === 1 ? 'una ficha' : `${k} fichas`), k === 1 ? ' cuyo número sea múltiplo de ' : ' cuyos números sean múltiplos de ', v('a', `${a}`), ' o de ', v('b', `${b}`), '?'];
    const errores = [
      h('RMP32-comunes-dos-veces', N - (R.A + R.B) + k, `Contaste los múltiplos de ${a} y los de ${b} por separado y los sumaste, pero los múltiplos de ${R.mcm} están en las dos listas: los contaste dos veces.`),
      h('RMP32-los-que-sirven', R.sirven + k, 'Contaste las fichas que sí sirven. En el peor caso salen primero las que NO son múltiplo de ninguno de los dos.'),
      h('RM6-favorable', k, `Ese es el caso con suerte: que salga${k > 1 ? 'n' : ''} de frente. Para estar seguro hay que pensar en la peor suerte.`),
      masUno(r, 'una'),
      h('RMP32-sin-mcm', N - (R.A + R.B - Math.floor(N / (a * b))) + k, `Restaste los múltiplos de ${a * b}, pero los comunes a ${a} y ${b} son los múltiplos de su MCM, ${R.mcm}.`),
      masDos(r),
    ];
    const solucion = [
      ['Múltiplos de ', v('a', `${a}`), ` hasta ${N}: ${R.A}. Múltiplos de `, v('b', `${b}`), `: ${R.B}. De los dos a la vez (múltiplos de ${R.mcm}): ${R.AB}.`],
      [`Sirven ${R.A} + ${R.B} − ${R.AB} = ${R.sirven} fichas; no sirven `, v('N', `${N}`), ` − ${R.sirven} = ${R.noSirven}.`],
      [`Peor caso: salen primero las ${R.noSirven} que no sirven. Luego ${k === 1 ? 'hace' : 'hacen'} falta `, v('k', `${k}`), ` más: ${R.noSirven} + ${k} = ${f(r)}.`],
    ];
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: 'fichas' });
  }

  // ---------- suma que supera ----------
  function tSumaSupera(rng, semilla) {
    const n = rng.entero(7, 11);
    let valores;
    if (rng.moneda()) { const a = rng.entero(1, 5); valores = rango(a, a + n - 1); }
    else { const s = new Set(); while (s.size < n) s.add(rng.entero(1, 30)); valores = [...s].sort((x, y) => x - y); }
    const ord = valores.slice().sort((x, y) => x - y);
    const m0 = rng.entero(3, n - 2), S = suma(ord.slice(0, m0)) + rng.entero(0, ord[m0] - 1);
    const datos = { tipo: 'suma-supera', valores, S };
    const R = sumaSupera(datos), r = R.respuesta;
    if (!r) return null;
    const desc = ord.slice().reverse();
    let s = 0, mM = 0; while (s <= S) s += desc[mM++];
    const cosa = rng.elegir(['cartas', 'tarjetas']);
    const variables = { x: { nombre: 'números de las cartas', color: 'o' }, S: { nombre: 'suma que hay que pasar', color: 'i' } };
    const enunciado = [`Sobre la mesa hay ${n} ${cosa} boca abajo con los números `, v('x', listaN(rng.barajar(valores))), ' (uno en cada una). Se voltean una por una, sin saber cuál es cuál.'];
    const pregunta = [`¿Cuántas hay que voltear como mínimo ${SEGURO} que la suma de los números volteados sea mayor que `, v('S', `${S}`), '?'];
    const errores = [
      h('RMP31-los-mayores', mM, 'Sumaste los números más grandes: ese es el caso con suerte. En el peor caso salen primero los más chicos.'),
      masUno(r, 'una'),
      masDos(r),
      h('RMP34-igual', (() => { let t = 0; for (let m = 1; m <= ord.length; m++) { t += ord[m - 1]; if (t >= S) return m; } return NaN; })(), `Buscaste que la suma llegue a ${S}, pero se pide que sea mayor que ${S}: igualarlo no basta.`),
    ];
    const solucion = [
      ['Peor caso: salen primero los números más chicos: ', listaN(R.peor), '.'],
      [`Con esas ${R.peor.length} la suma es ${R.sumaPeor}, que no pasa de `, v('S', `${S}`), '.'],
      [`La siguiente es como mínimo ${ord[r - 1]}, y la suma llega por lo menos a ${R.sumaPeor + ord[r - 1]} > ${S}. Hacen falta ${f(r)}.`],
    ];
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: cosa });
  }

  // ---------- dos que sumen S ----------
  function tParejaSuma(rng, semilla) {
    const N = rng.entero(9, 16), copias = rng.elegir([1, 1, 2, 3]);
    const S = rng.entero(Math.floor(N / 2) + 3, N + 4);
    const datos = { tipo: 'pareja-suma', N, copias, S };
    const R = parejaSuma(datos), r = R.respuesta;
    if (!R.solos.length || R.parejas.length < 2) return null;
    const cosa = copias === 1 ? 'fichas' : 'discos';
    const variables = { N: { nombre: 'números', color: 'o' }, S: { nombre: 'suma pedida', color: 'i' } };
    const enunciado = ['En una caja hay ', v('N', copias === 1 ? `${N} fichas numeradas del 1 al ${N}` : `${copias * N} discos: ${copias} con cada número del 1 al ${N}`), '. Se sacan sin mirar.'];
    const pregunta = [`¿Cuántos ${copias === 1 ? 'fichas' : 'discos'} hay que sacar como mínimo ${SEGURO} tener dos cuyos números sumen `, v('S', `${S}`), '?'];
    if (copias === 1) pregunta[0] = `¿Cuántas fichas hay que sacar como mínimo ${SEGURO} tener dos cuyos números sumen `;
    const errores = [
      h('RMP30-sin-pareja', copias * R.parejas.length + (R.mitad ? 1 : 0) + 1, `Tomaste uno de cada pareja que suma ${S}, pero olvidaste ${R.solos.length === 1 ? 'el número que no tiene' : 'los números que no tienen'} pareja (${listaN(R.solos)}): también pueden salir antes.`),
      h('RM6-favorable', 2, 'Ese es el caso con suerte: que los dos primeros sumen lo pedido. Para estar seguro hay que pensar en la peor suerte.'),
      masUno(r, 'uno'),
      R.mitad && copias > 1 ? h('RMP30-la-mitad', r - 1 + copias, `Pusiste en el peor caso todos los ${R.mitad}, pero dos ${R.mitad} ya suman ${S}. De ese número solo puede salir uno.`) : null,
      masDos(r),
    ].filter(Boolean);
    const solucion = [
      ['Parejas que suman ', v('S', `${S}`), ': ', R.parejas.map(p => `${p[0]} y ${p[1]}`).join('; '), R.mitad ? `; además, el ${R.mitad} con otro ${R.mitad}.` : '.'],
      [`Sin pareja: ${listaN(R.solos)}.`],
      [`Peor caso: todos los que no tienen pareja (${copias * R.solos.length}), de cada pareja un solo número${copias > 1 ? ` con todas sus copias (${copias * R.parejas.length})` : ` (${R.parejas.length})`}${R.mitad ? `, y un solo ${R.mitad}` : ''}: ${f(r - 1)} sin lograrlo.`],
      [`El siguiente completa una pareja: ${f(r - 1)} + 1 = ${f(r)}.`],
    ];
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: copias === 1 ? 'fichas' : 'discos' });
  }

  // ---------- tres que sumen S ----------
  function tTrioSuma(rng, semilla) {
    const N = rng.entero(8, 11), S = rng.entero(2 * N - 2, 3 * N - 6);
    const datos = { tipo: 'trio-suma', N, S };
    const R = trioSuma(datos), r = R.respuesta;
    if (R.trios.length < 3 || r >= N) return null;
    const variables = { N: { nombre: 'pesas', color: 'o' }, S: { nombre: 'suma pedida', color: 'i' } };
    const enunciado = ['En una caja hay ', v('N', `${N} pesas de 1, 2, 3, … y ${N} kg`), ' (una de cada peso). Se sacan sin mirar.'];
    const pregunta = [`¿Cuántas hay que sacar como mínimo ${SEGURO} tener tres que juntas pesen `, v('S', `${S} kg`), '?'];
    const errores = [
      h('RM6-favorable', 3, 'Ese es el caso con suerte: que las tres primeras sumen lo pedido. Para estar seguro hay que pensar en la peor suerte.'),
      masUno(r, 'una'),
      masDos(r),
      h('RMP30-solo-las-que-no-entran', R.fuera.length + 3, `Pusiste en el peor caso solo las pesas que no entran en ningún trío (${R.fuera.length ? listaN(R.fuera) : 'ninguna'}) y luego tres más. Pero también pueden salir varias que sí entran en tríos sin completar ninguno.`),
      h('RMP31-un-trio', N - 2, 'Dejaste fuera solo dos pesas, como si hubiera un único trío. Hay varios tríos y el peor caso puede esquivarlos todos con más pesas.'),
    ];
    const solucion = [
      ['Tríos de pesas distintas que suman ', v('S', `${S}`), ': ', lista(R.trios.map(t => t.join(' + '))), '.'],
      [`Peor caso: se puede sacar este grupo de ${R.peor.length} pesas sin que tres sumen ${S}: ${listaN(R.peor)} (revisa cada trío: a cada uno le falta una pesa). No hay grupo más grande así.`],
      [`Con una más, la que sea, ya se completa un trío: ${f(r - 1)} + 1 = ${f(r)}.`],
    ];
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: 'pesas' });
  }

  // ---------- consecutivos ----------
  function tConsecutivos(rng, semilla) {
    const k = rng.elegir([2, 3, 3]), N = rng.entero(10, 30);
    const datos = { tipo: 'consecutivos', N, k };
    const R = consecutivos(datos), r = R.respuesta;
    const variables = { N: { nombre: 'bolos', color: 'o' }, k: { nombre: 'consecutivos pedidos', color: 'i' } };
    const enunciado = ['En una bolsa hay ', v('N', `${N} bolos numerados del 1 al ${N}`), '. Se sacan sin mirar y sin devolverlos.'];
    const pregunta = [`¿Cuántos hay que sacar como mínimo ${SEGURO} tener `, v('k', k === 2 ? 'dos números consecutivos' : 'tres números consecutivos'), '?'];
    const errores = [
      h('RM6-favorable', k, 'Ese es el caso con suerte: que salgan seguidos de frente. Para estar seguro hay que pensar en la peor suerte.'),
      masUno(r, 'uno'),
      masDos(r),
      k === 3 ? h('RMP31-uno-si-uno-no', Math.ceil(N / 2) + 1, 'Armaste el peor caso saltando uno sí y uno no, pero sin tres seguidos se pueden sacar más: dos seguidos, se salta uno, dos seguidos…') :
        h('RMP31-los-pares', Math.floor(N / 2) + 1, `Tomaste los pares en el peor caso; con ${N} bolos hay más impares que pares, y la mala suerte saca los impares.`),
      h('RMP31-la-mitad', Math.floor(N / k) + 1, `Dividiste ${N} entre ${k}, pero el peor caso no saca un número por cada grupo de ${k}: saca todos menos uno de cada grupo.`),
    ];
    const solucion = [
      [k === 2 ? 'Peor caso: salen solo números que no son vecinos: ' : 'Peor caso: salen de dos en dos, saltando uno: ', R.peor.length > 12 ? R.peor.slice(0, 8).join(', ') + ', …' : listaN(R.peor) + '.'],
      [`Así salen ${R.peor.length} bolos sin `, v('k', `${k}`), ` consecutivos (quedan fuera solo los múltiplos de ${k}).`],
      [`Con uno más ya no se puede: agrupa los números en bloques seguidos de ${k} (${k === 2 ? '1-2, 3-4, …' : '1-2-3, 4-5-6, …'}). Para no tener ${k} consecutivos falta al menos uno de cada bloque completo, y ${N - R.peor.length} bloques completos piden ${N - R.peor.length} fuera. Por eso: ${f(r - 1)} + 1 = ${f(r)}.`],
    ];
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: 'bolos' });
  }

  // ---------- paridad ----------
  function tParidad(rng, semilla) {
    const desde = rng.entero(1, 12), hasta = desde + rng.entero(10, 25), pide = rng.elegir(['producto-par', 'producto-par', 'suma-impar', 'suma-par']);
    const datos = { tipo: 'paridad', desde, hasta, pide };
    const R = paridad(datos), r = R.respuesta;
    const variables = { x: { nombre: 'números de las fichas', color: 'o' }, c: { nombre: 'condición', color: 'i' } };
    const enunciado = ['En una caja hay fichas con los números ', v('x', `del ${desde} al ${hasta}`), ', una de cada número. Se sacan sin mirar.'];
    const cond = { 'producto-par': 'cuyo producto sea par', 'suma-impar': 'cuya suma sea impar', 'suma-par': 'cuya suma sea par' }[pide];
    const pregunta = [`¿Cuántas hay que sacar como mínimo ${SEGURO} tener dos `, v('c', cond), '?'];
    let errores, solucion;
    if (pide === 'producto-par') {
      errores = [
        h('RM6-favorable', 2, 'Ese es el caso con suerte. Para estar seguro hay que pensar en la peor suerte.'),
        h('RMP32-al-reves', R.pares + 1, 'Pusiste en el peor caso los pares, pero un par ya hace par el producto. Los que no sirven son los impares: impar por impar da impar.'),
        h('RMP34-sin-mas-uno', R.impares, `Contaste los ${R.impares} impares, pero con ellos todavía no hay producto par: falta uno más.`),
        h('RMP31-como-suma', 3, 'Usaste la regla de la suma par (tres fichas bastan). Con el producto es distinto: puede salir una larga fila de impares.'),
        masDos(r),
      ];
      solucion = [
        ['Un producto es par si al menos uno de los dos es par. Impar × impar es impar.'],
        [`Del ${desde} al ${hasta} hay ${R.impares} impares y ${R.pares} pares. Peor caso: salen los ${R.impares} impares.`],
        [`La siguiente es par, y por cualquiera de las anteriores da producto par: ${R.impares} + 1 = ${f(r)}.`],
      ];
    } else if (pide === 'suma-impar') {
      const mx = Math.max(R.impares, R.pares), mn = Math.min(R.impares, R.pares), cual = R.impares >= R.pares ? 'impares' : 'pares';
      errores = [
        h('RM6-favorable', 2, 'Ese es el caso con suerte. Para estar seguro hay que pensar en la peor suerte.'),
        h('RMP31-el-menor', mn + 1, `Pusiste en el peor caso el grupo más chico, pero la mala suerte saca el más grande: los ${mx} ${cual}.`),
        masUno(r, 'una'),
        h('RMP31-como-suma-par', 3, 'Usaste la regla de la suma par (tres bastan). Para que la suma sea impar hace falta un par y un impar, y pueden salir muchas del mismo tipo seguidas.'),
        masDos(r),
      ];
      solucion = [
        ['Una suma es impar solo si junta un par con un impar.'],
        [`Hay ${R.impares} impares y ${R.pares} pares. Peor caso: salen todas las del grupo más grande, los ${mx} ${cual}; entre ellas toda suma es par.`],
        [`La siguiente es del otro tipo: ${mx} + 1 = ${f(r)}.`],
      ];
    } else {
      errores = [
        h('RM6-favorable', 2, 'Ese es el caso con suerte: que las dos primeras sean del mismo tipo. Pueden salir un par y un impar.'),
        h('RMP32-solo-impares', R.impares + 1, 'Pensaste que hay que esperar todos los impares, pero dos impares también suman par. Lo que importa es tener dos del mismo tipo.'),
        h('RMP32-solo-pares', R.pares + 1, 'Pensaste que hay que esperar a que salgan los pares, pero dos impares también suman par. Lo que importa es tener dos del mismo tipo.'),
        masDos(r),
      ];
      solucion = [
        ['La suma de dos es par si los dos son pares o los dos son impares (del mismo tipo).'],
        ['Hay solo dos tipos. Peor caso: sale una par y una impar, y todavía no hay suma par.'],
        ['La tercera es par o impar y repite tipo con una de las anteriores: 2 + 1 = 3.'],
      ];
    }
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: 'fichas' });
  }

  // ---------- diferencia ----------
  function tDiferencia(rng, semilla) {
    const pide = rng.elegir(['mayor', 'igual']);
    const desde = rng.entero(1, 10), hasta = desde + rng.entero(14, 30), d = pide === 'mayor' ? rng.entero(4, 12) : rng.entero(2, 6);
    const datos = { tipo: 'diferencia', desde, hasta, d, pide };
    const R = diferencia(datos), r = R.respuesta;
    const variables = { x: { nombre: 'números', color: 'o' }, d: { nombre: 'diferencia', color: 'i' } };
    const enunciado = ['En un ánfora hay bolos con los números ', v('x', `del ${desde} al ${hasta}`), ', uno de cada número. Se sacan sin mirar.'];
    let pregunta, errores, solucion;
    if (pide === 'mayor') {
      pregunta = [`¿Cuántos hay que sacar como mínimo ${SEGURO} tener dos cuya diferencia sea mayor que `, v('d', `${d}`), '?'];
      errores = [
        h('RM6-favorable', 2, 'Ese es el caso con suerte: que salgan dos lejanos de frente. Para estar seguro hay que pensar en la peor suerte.'),
        h('RMP1-intervalos', d + 1, `Contaste ${d} números en el peor caso, pero del ${desde} al ${desde + d} hay ${d + 1} números (${d} saltos y ${d + 1} números), y luego falta uno más.`),
        masDos(r),
      ];
      solucion = [
        ['Peor caso: salen números todos cercanos, en un tramo donde ninguna diferencia pasa de ', v('d', `${d}`), `; por ejemplo, del ${desde} al ${desde + d}: ${d + 1} números.`],
        [`Con ${d + 2} números distintos, el mayor y el menor se separan por lo menos ${d + 1}, que ya es más que ${d}: ${d + 1} + 1 = ${f(r)}.`],
      ];
    } else {
      pregunta = [`¿Cuántos hay que sacar como mínimo ${SEGURO} tener dos cuya diferencia sea exactamente `, v('d', `${d}`), '?'];
      const n = hasta - desde + 1;
      errores = [
        h('RM6-favorable', 2, 'Ese es el caso con suerte. Para estar seguro hay que pensar en la peor suerte.'),
        h('RMP31-la-mitad', Math.ceil(n / 2) + 1, `Tomaste la mitad de los bolos, como si cada uno tuviera una sola pareja. Pero en una cadena como ${desde}, ${desde + d}, ${desde + 2 * d}… se toma uno sí y uno no, y en cadenas impares sale uno más.`),
        h('RMP31-una-por-cadena', R.cadenas.length + 1, 'Tomaste un número por cadena, pero de cada cadena se pueden sacar varios que no estén pegados (uno sí y uno no).'),
        masUno(r, 'uno'),
        masDos(r),
      ];
      solucion = [
        ['Los números se agrupan en cadenas que avanzan de ', v('d', `${d}`), ' en ', v('d', `${d}`), ': ', R.cadenas.slice(0, 3).map(c => c.join(', ')).join('; '), R.cadenas.length > 3 ? '; …' : '', '.'],
        [`En cada cadena, dos vecinos tienen diferencia ${d}. Peor caso: de cada cadena salen uno sí y uno no (empezando por el primero): ${R.peor.length} bolos.`],
        [`El siguiente queda junto a uno ya sacado en su cadena: ${f(r - 1)} + 1 = ${f(r)}.`],
      ];
    }
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: 'bolos' });
  }

  // ---------- división entera ----------
  function tDivision(rng, semilla) {
    const N = rng.entero(10, 40);
    const datos = { tipo: 'division', N };
    const R = division(datos), r = R.respuesta;
    const nPrimos = rango(1, N).filter(esPrimo).length;
    const variables = { N: { nombre: 'fichas', color: 'o' } };
    const enunciado = ['En una bolsa hay ', v('N', `${N} fichas numeradas del 1 al ${N}`), '. Se sacan sin mirar.'];
    const pregunta = [`¿Cuántas hay que sacar como mínimo ${SEGURO} tener dos fichas tales que el número mayor dividido entre el menor dé un resultado entero?`];
    const errores = [
      h('RM6-favorable', 2, 'Ese es el caso con suerte. Para estar seguro hay que pensar en la peor suerte.'),
      h('RMP30-el-uno', r + 1, 'Pusiste el 1 en el peor caso, pero el 1 sirve con cualquier ficha: todo número dividido entre 1 da entero.'),
      h('RMP31-los-primos', nPrimos + 1, 'Tomaste los primos en el peor caso. Entre ellos ninguno divide a otro, pero hay un grupo más grande así: los de la mitad para arriba.'),
      masUno(r, 'una'),
      h('RMP31-mitad-menor', Math.floor(N / 2) + 1, `Tomaste la mitad de abajo, pero ahí unos dividen a otros (el 2 divide al 4). El peor caso toma la mitad de arriba.`),
    ];
    const solucion = [
      ['Entre los números de ', `${Math.floor(N / 2) + 1}`, ' a ', v('N', `${N}`), ' ninguno divide a otro: el doble del menor ya pasa de ', `${N}`, '.'],
      [`Peor caso: salen esos ${R.peor.length}. No sale el 1, que con cualquiera da entero.`],
      [`Por qué no se puede más: agrupa las fichas por su parte impar (12 = 4 × 3 va con el 3, el 6 y el 24). Dentro de un grupo, el menor divide al mayor. Hay tantos grupos como impares hasta ${N}: ${R.peor.length}. Con ${f(r)} fichas, dos caen en el mismo grupo.`],
    ];
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: 'fichas' });
  }

  // ---------- primos ----------
  function tPrimos(rng, semilla) {
    const N = rng.entero(15, 30), ps = rango(1, N).filter(esPrimo);
    const S = rng.entero(ps[ps.length - 1] + 2, ps[ps.length - 1] + ps[ps.length - 2] - 1);
    const datos = { tipo: 'primos', N, S };
    const R = primos(datos), r = R.respuesta;
    if (R.peorPrimos.length < 2) return null;
    const variables = { N: { nombre: 'bolos', color: 'o' }, S: { nombre: 'suma que hay que pasar', color: 'i' } };
    const enunciado = ['En un ánfora hay ', v('N', `${N} bolos numerados del 1 al ${N}`), '. Se sacan sin mirar.'];
    const pregunta = [`¿Cuántos hay que sacar como mínimo ${SEGURO} tener dos bolos con números primos cuya suma sea mayor que `, v('S', `${S}`), '?'];
    const errores = [
      h('RMP30-primos-chicos', R.noPrimos + 2, `Pensaste que bastan dos primos cualesquiera, pero dos primos chicos (como ${R.peorPrimos[0]} y ${R.peorPrimos[1]}) no suman más de ${S}.`),
      h('RMP30-sin-no-primos', R.peorPrimos.length + 1, `Olvidaste los ${R.noPrimos} bolos que no son primos (el 1 tampoco es primo): en el peor caso salen todos antes.`),
      h('RM6-favorable', 2, 'Ese es el caso con suerte. Para estar seguro hay que pensar en la peor suerte.'),
      masUno(r, 'uno'),
      masDos(r),
    ];
    const solucion = [
      ['Primos hasta ', v('N', `${N}`), `: ${listaN(R.primos)}. No primos (con el 1): ${R.noPrimos}.`],
      ['Peor caso: salen todos los no primos y el grupo más grande de primos en el que ningún par suma más de ', v('S', `${S}`), `: ${listaN(R.peorPrimos)} (sus dos mayores suman ${R.peorPrimos.slice(-2).reduce((a, b) => a + b, 0)}).`],
      [`Van ${R.noPrimos} + ${R.peorPrimos.length} = ${f(r - 1)}. Cualquier primo que falta, junto con el mayor ya sacado, pasa de ${S}: ${f(r - 1)} + 1 = ${f(r)}.`],
    ];
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: 'bolos' });
  }

  // ---------- billetes ----------
  function tBilletes(rng, semilla) {
    const vals = rng.elegir([[10, 20, 50, 100], [10, 20, 50, 100, 200], [10, 20, 50], [20, 50, 100, 200]]);
    const B = {}; for (const x of vals) B[x] = rng.entero(2, 7);
    const sumas = []; for (const x of vals) for (const y of vals) if (x <= y && (x < y || B[x] >= 2)) sumas.push(x + y);
    const M = rng.elegir(sumas);
    const datos = { tipo: 'billetes', billetes: B, M };
    const R = billetes(datos), r = R.respuesta;
    if (!R.detalle.some(x => x.solo)) return null;
    const variables = { b: { nombre: 'billetes en la bolsa', color: 'o' }, M: { nombre: 'monto', color: 'i' } };
    const enunciado = ['En una bolsa de tela hay ', v('b', lista(vals.map(x => `${B[x]} billetes de S/ ${x}`))), '. Se sacan sin mirar.'];
    const pregunta = [`¿Cuántos billetes hay que sacar como mínimo ${SEGURO} tener dos que juntos sumen exactamente `, v('M', `S/ ${M}`), '?'];
    const solos = R.detalle.filter(x => x.solo), pares = R.detalle.filter(x => !x.solo);
    const sinSolos = R.malo - suma(solos.map(x => x.toma)) + 1;
    const conMin = 1 + suma(R.detalle.map(x => x.valores.length === 2 ? Math.min(B[x.valores[0]], B[x.valores[1]]) : x.toma));
    const errores = [
      h('RMP30-sin-pareja', sinSolos, `No pusiste en el peor caso los billetes que no sirven para S/ ${M} (${lista(solos.map(x => `los de S/ ${x.valores[0]}`))}); la mala suerte los saca primero.`),
      h('RM6-favorable', 2, 'Ese es el caso con suerte: que los dos primeros sumen lo pedido. Para estar seguro hay que pensar en la peor suerte.'),
      h('RMP31-el-menor', conMin, 'De cada pareja de billetes que suma el monto, tomaste el grupo con menos billetes. La mala suerte saca el grupo que tiene más.'),
      masUno(r, 'uno'),
      masDos(r),
    ];
    const paso = pares.map(x => x.valores.length === 2 ? `de S/ ${x.valores[0]} y S/ ${x.valores[1]}, solo los del grupo más grande (${x.toma})` : `de S/ ${x.valores[0]}, uno solo (dos ya suman S/ ${M})`);
    const solucion = [
      ['Formas de juntar ', v('M', `S/ ${M}`), ' con dos billetes: ', lista(pares.map(x => x.valores.length === 2 ? `${x.valores[0]} + ${x.valores[1]}` : `${x.valores[0]} + ${x.valores[0]}`)), '.'],
      [`Peor caso: todos los que no sirven (${lista(solos.map(x => `${x.toma} de S/ ${x.valores[0]}`))}) y ${lista(paso)}. Total: ${f(r - 1)}.`],
      [`El siguiente completa alguna de las formas: ${f(r - 1)} + 1 = ${f(r)}.`],
    ];
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: 'billetes' });
  }

  // ---------- cumpleaños ----------
  function tCumpleanos(rng, semilla) {
    const casilla = rng.elegir(['fecha', 'fecha', 'mes', 'semana', 'dia-mes']);
    const k = casilla === 'fecha' ? rng.entero(2, 3) : rng.entero(2, 6);
    const datos = { tipo: 'cumpleanos', casilla, k };
    const R = cumpleanos(datos), r = R.respuesta, C = R.casillas;
    const que = { fecha: 'el mismo día (el mismo día y mes)', mes: 'el mismo mes', semana: 'el mismo día de la semana', 'dia-mes': 'el mismo número de día del mes (por ejemplo, ambos un día 14)' }[casilla];
    const variables = { k: { nombre: 'personas que coinciden', color: 'o' }, C: { nombre: 'casillas', color: 'i' } };
    const enunciado = casilla === 'semana'
      ? ['En la feria del colegio se pregunta a cada visitante qué día de la semana nació.']
      : ['En la feria del colegio se pregunta a cada visitante su fecha de cumpleaños.'];
    const pregunta = [`¿A cuántas personas como mínimo hay que preguntar ${SEGURO} que `, v('k', `${k}`), ` de ellas ${casilla === 'semana' ? 'hayan nacido' : 'cumplan años'} ${que}?`];
    const errores = [
      casilla === 'fecha' ? h('RMP33-sin-bisiesto', 365 * (k - 1) + 1, 'Olvidaste el 29 de febrero: alguien puede haber nacido ese día. Hay 366 fechas posibles.') : null,
      h('RM6-favorable', k, 'Ese es el caso con suerte: que coincidan de frente. Para estar seguro hay que pensar en la peor suerte.'),
      h('RMP34-sin-mas-uno', C * (k - 1), `Con ${f(C * (k - 1))} personas puede haber justo ${k - 1} en cada casilla: todavía no coinciden ${k}. Falta una más.`),
      h('RMP31-k-por-casilla', C * k, `Pusiste ${k} personas en cada casilla en el peor caso, pero ahí ya coinciden ${k}. El peor caso llena cada casilla con ${k - 1}.`),
      h('RMP34-mas-uno', C * (k - 1) + 2, `Sumaste uno de más: con ${f(r)} ya es seguro.`),
      casilla === 'dia-mes' ? h('RMP33-treinta', 30 * (k - 1) + 1, 'Contaste 30 días por mes, pero hay meses con día 31: los números posibles son del 1 al 31.') : null,
    ].filter(Boolean);
    const solucion = [
      ['Casillas posibles: ', v('C', `${C}`), { fecha: ' fechas (365 días y el 29 de febrero).', mes: ' meses.', semana: ' días de la semana.', 'dia-mes': ' números de día (del 1 al 31).' }[casilla]],
      ['Peor caso: en cada casilla caen ', `${k - 1}`, ' personas y no más: ', v('C', `${C}`), ` × ${k - 1} = ${f(C * (k - 1))}.`],
      ['La siguiente cae en una casilla que ya tiene ', `${k - 1}`, ` y completa `, v('k', `${k}`), `: ${f(C * (k - 1))} + 1 = ${f(r)}.`],
    ];
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: 'personas' });
  }

  // ---------- suma de cifras ----------
  function tSumaCifras(rng, semilla) {
    const desde = rng.elegir([1, 1, 10, 20]), hasta = desde + rng.entero(25, 70), k = rng.elegir([3, 3, 4]);
    const datos = { tipo: 'suma-cifras', desde, hasta, k };
    const R = sumaCifras(datos), r = R.respuesta;
    if (!R.escasas.length) return null;
    const nS = R.sumas.length;
    const variables = { x: { nombre: 'fichas', color: 'o' }, k: { nombre: 'fichas que coinciden', color: 'i' } };
    const enunciado = ['En una caja hay fichas numeradas ', v('x', `del ${desde} al ${hasta}`), ', una de cada número. Se sacan sin mirar.'];
    const pregunta = [`¿Cuántas hay que sacar como mínimo ${SEGURO} tener `, v('k', `${k}`), ' fichas cuyos números tengan la misma suma de cifras?'];
    const errores = [
      h('RMP33-casos-escasos', nS * (k - 1) + 1, `Pusiste ${k - 1} fichas por cada suma posible, pero algunas sumas tienen menos fichas (${lista(R.escasas.map(s => `suma ${s}: ${R.cuenta[s]}`))}); de ellas solo salen las que hay.`),
      h('RM6-favorable', k, 'Ese es el caso con suerte. Para estar seguro hay que pensar en la peor suerte.'),
      masUno(r, 'una'),
      masDos(r),
      h('RMP31-k-por-suma', suma(R.sumas.map(s => Math.min(R.cuenta[s], k))) + 1, `Pusiste ${k} fichas por suma en el peor caso, pero con ${k} de la misma suma ya se logró. Son ${k - 1} por suma como máximo.`),
    ];
    const solucion = [
      [`Las sumas de cifras posibles van de ${R.sumas[0]} a ${R.sumas[nS - 1]} (${nS} sumas). Con pocas fichas: ${lista(R.escasas.map(s => `la suma ${s} tiene ${R.cuenta[s]}`))}.`],
      ['Peor caso: de cada suma salen ', `${k - 1}`, ' fichas, o todas las que hay si tiene menos. ', `Total: ${f(r - 1)}.`],
      ['La siguiente repite una suma que ya tiene ', `${k - 1}`, ': ', `${f(r - 1)} + 1 = ${f(r)}.`],
    ];
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: 'fichas' });
  }

  // ---------- llaves ----------
  function tLlaves(rng, semilla) {
    const n = rng.entero(4, 12), cosa = rng.elegir([['candados', 'candado'], ['puertas', 'puerta'], ['casilleros', 'casillero']]);
    const datos = { tipo: 'llaves', n };
    const r = llaves(datos).respuesta;
    const variables = { n: { nombre: 'llaves y ' + cosa[0], color: 'o' } };
    const enunciado = ['Un portero tiene ', v('n', `${n} llaves`), ' mezcladas y ', v('n', `${n} ${cosa[0]}`), `; cada llave abre un solo ${cosa[1]} y cada ${cosa[1]} se abre con una sola llave. Un intento es probar una llave en un ${cosa[1]}.`];
    const pregunta = [`¿Cuántos intentos como mínimo debe hacer ${SEGURO} saber qué llave abre cada ${cosa[1]}?`];
    const errores = [
      h('RMP34-ultimo-intento', n * (n + 1) / 2, `Contaste un intento de más en cada ${cosa[1]}: si ${n - 1} llaves no abren el primero, la que queda lo abre sin probarla. Igual con los demás.`),
      h('RM6-favorable', n - 1, 'Ese es el caso con suerte: que cada llave abra al primer intento. Para estar seguro hay que pensar en la peor suerte.'),
      h('RMP31-todas-con-todos', n * (n - 1), `Probaste cada llave en todos los demás ${cosa[0]}, pero una llave que ya abrió uno se aparta: el siguiente ${cosa[1]} tiene una llave menos que probar.`),
      h('RMP31-n-por-n', n * n, `Multiplicaste ${n} × ${n}, como si cada ${cosa[1]} necesitara probar todas las llaves. Las llaves que ya abrieron se apartan, y la última de cada vez no se prueba.`),
    ];
    const solucion = [
      [`Primer ${cosa[1]}: en el peor caso fallan `, v('n', `${n - 1}`), ' llaves; la que queda es la buena y no hace falta probarla.'],
      [`Segundo ${cosa[1]}: quedan ${n - 1} llaves, fallan ${n - 2}. Y así hasta el último, que ya no necesita intentos.`],
      [`Total: ${rango(1, n - 1).reverse().join(' + ')} = ${f(r)}.`],
    ];
    return cerrar(rng, semilla, { correcta: r, errores, enunciado, pregunta, solucion, variables, datos, unidad: 'intentos' });
  }

  // ---------- cajas mal rotuladas ----------
  const PRODUCTOS = [
    { A: 'manzanas', B: 'naranjas', ambos: 'una mezcla de manzanas y naranjas', uA: 'una manzana', uB: 'una naranja', cosa: 'fruta', mezcla: 'mezcla' },
    { A: 'caramelos de fresa', B: 'caramelos de limón', ambos: 'una mezcla de caramelos de fresa y de limón', uA: 'un caramelo de fresa', uB: 'un caramelo de limón', cosa: 'golosina', mezcla: 'mezcla' },
    { A: 'canicas rojas', B: 'canicas azules', ambos: 'una mezcla de canicas rojas y azules', uA: 'una canica roja', uB: 'una canica azul', cosa: 'canica', mezcla: 'mezcla' },
    { A: 'papas blancas', B: 'papas amarillas', ambos: 'una mezcla de papas blancas y amarillas', uA: 'una papa blanca', uB: 'una papa amarilla', cosa: 'papa', mezcla: 'mezcla' },
  ];
  function tCajas(rng, semilla) {
    const pr = rng.elegir(PRODUCTOS), pide = rng.elegir(['cual', 'contenido']);
    const sale = rng.elegir(['A', 'B']), rotulo = rng.elegir(['A', 'B']);
    const datos = { tipo: 'cajas', pide, etiquetas: [pr.A, pr.B, pr.mezcla], sale: pide === 'contenido' ? sale : null, rotulo: pide === 'contenido' ? rotulo : null };
    const R = cajas(datos);
    const variables = { r: { nombre: 'rótulos', color: 'o' }, s: { nombre: 'lo que salió', color: 'i' } };
    const enunciado = ['Hay tres cajas cerradas con los rótulos ', v('r', `«${pr.A}», «${pr.B}» y «${pr.mezcla}»`),
      `. Se sabe que una caja tiene solo ${pr.A}, otra solo ${pr.B} y otra ${pr.ambos}, y que los tres rótulos están equivocados. Se puede sacar una ${pr.cosa} de una caja sin mirar dentro.`];
    let pregunta, correcta, errores, solucion;
    const t = (clave, texto) => ({ clave, texto });
    if (pide === 'cual') {
      pregunta = [`¿De qué caja hay que sacar una sola ${pr.cosa} para poder poner bien los tres rótulos?`];
      if (R.respuesta !== 'mezcla') throw new Error('cajas: la caja que sirve debía ser la rotulada mezcla');
      correcta = t(R.respuesta, `De la rotulada «${pr.mezcla}»`);
      errores = [
        { id: 'RM6-favorable', clave: 'A', texto: `De la rotulada «${pr.A}»`, explicacion: `Si de «${pr.A}» sale ${pr.uB}, esa caja puede tener solo ${pr.B} o la mezcla: no se sabe. Contaste con la suerte de que la ${pr.cosa} lo diga todo.`, respaldo: 'hipotesis', fuente: FUENTE },
        { id: 'RM6-favorable', clave: 'B', texto: `De la rotulada «${pr.B}»`, explicacion: `Si de «${pr.B}» sale ${pr.uA}, esa caja puede tener solo ${pr.A} o la mezcla: no se sabe. Contaste con la suerte de que la ${pr.cosa} lo diga todo.`, respaldo: 'hipotesis', fuente: FUENTE },
        { id: 'RMP31-cualquiera', clave: 'cualquiera', texto: 'De cualquiera de las tres', explicacion: `No da igual: solo en la caja rotulada «${pr.mezcla}» se sabe que no hay mezcla, así que la ${pr.cosa} que sale dice qué tiene.`, respaldo: 'hipotesis', fuente: null },
        { id: 'RMP34-una-de-mas', clave: 'dos', texto: 'Una sola no basta: hay que sacar de dos cajas', explicacion: 'Basta una: al saber qué tiene la caja rotulada como mezcla, las otras dos quedan obligadas porque sus rótulos también están errados.', respaldo: 'hipotesis', fuente: null },
      ];
      solucion = [
        [`La caja rotulada `, v('r', `«${pr.mezcla}»`), ` no tiene mezcla (su rótulo está errado): tiene solo ${pr.A} o solo ${pr.B}.`],
        [`Si de ella sale ${pr.uA}, tiene ${pr.A}. La rotulada «${pr.B}» no puede tener ${pr.B}: tiene la mezcla. La rotulada «${pr.A}» tiene ${pr.B}.`],
        [`Si sale ${pr.uB}, es al revés. En las otras cajas, en cambio, una ${pr.cosa} no distingue entre lo puro y la mezcla.`],
      ];
    } else {
      pregunta = [`Se saca una ${pr.cosa} de la caja rotulada «${pr.mezcla}» y sale `, v('s', sale === 'A' ? pr.uA : pr.uB), `. ¿Qué tiene la caja rotulada «${pr[rotulo]}»?`];
      const txt = x => (x === 'mezcla' ? `${pr.ambos[0].toUpperCase() + pr.ambos.slice(1)}` : `Solo ${pr[x]}`);
      correcta = t(R.respuesta, txt(R.respuesta));
      const malas = ['A', 'B', 'mezcla'].filter(x => x !== R.respuesta);
      errores = malas.map(x => x === rotulo
        ? { id: 'RMP31-rotulo-cierto', clave: x, texto: txt(x), explicacion: 'Todos los rótulos están errados: esa caja no puede tener lo que dice su rótulo.', respaldo: 'hipotesis', fuente: null }
        : x === sale
          ? { id: 'RMP31-lo-que-salio', clave: x, texto: txt(x), explicacion: `Lo que salió ya está en la caja rotulada «${pr.mezcla}»: esa caja tiene solo ${pr[sale]}, así que ninguna otra lo tiene puro.`, respaldo: 'hipotesis', fuente: null }
          : { id: 'RMP31-al-reves', clave: x, texto: txt(x), explicacion: 'Cambiaste las dos cajas que quedan. Revisa qué contenido le queda a cada una sin repetir su rótulo.', respaldo: 'hipotesis', fuente: null });
      errores.push({ id: 'RM6-no-se-sabe', clave: 'no-se-sabe', texto: 'No se puede saber con una sola extracción', explicacion: `Sí se puede: la caja rotulada «${pr.mezcla}» no tiene mezcla, así que lo que salió dice su contenido, y las otras dos quedan obligadas.`, respaldo: 'hipotesis', fuente: null });
      const queda = ['A', 'B', 'mezcla'].filter(x => x !== sale);
      solucion = [
        [`La rotulada «${pr.mezcla}» no tiene mezcla; como salió `, v('s', sale === 'A' ? pr.uA : pr.uB), `, tiene solo ${pr[sale]}.`],
        [`Quedan para las otras dos: ${lista(queda.map(x => x === 'mezcla' ? 'la mezcla' : `solo ${pr[x]}`))}. La rotulada «${pr[queda.find(x => x !== 'mezcla')]}» no puede tener lo que dice: tiene la mezcla.`],
        [`Por eso la rotulada «${pr[rotulo]}» tiene: ${txt(R.respuesta).toLowerCase()}.`],
      ];
    }
    return cerrar(rng, semilla, { correcta, errores, enunciado, pregunta, solucion, variables, datos, texto: true });
  }

  return { id: ID, titulo: 'Sacar a ciegas: ¿cuántas para estar seguro?', generar, calc };
});
