/*
 * Generador «El puesto de los restos»: práctica de «Divisibilidad» (aritmetica.divisibilidad;
 * contenido/teoria/aritmetica/divisibilidad.js), con tipos separados por idea. Formato "predicciones"
 * (docs/arquitectura.md). Funciona en el navegador (window.Generadores['divisibilidad-restos']) y en Node (require). No
 * usa ningún motor: las cuentas son restos de enteros que se hacen aquí.
 *
 * Propuesta: docs/etapa5/propuesta-aritmetica.md §5 y §8 (Gerson delegó el criterio y la revisa después). Hilo, como en
 * la teoría: el puesto de caramelos de doña Juana (bolsitas de d, sueltos), la rifa de la promoción (boletos
 * numerados, uno con una cifra borrada por la lluvia) y las monedas de S/ 2 y S/ 5 del mostrador (denominaciones
 * vigentes del BCRP). Valores de problema, sin fuente.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 básico, 2 intermedio, 3 examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las seis con el mismo peso. La unidad es una sola: { unidad } no cambia nada.
 *   filas-de-m          es-multiplo (1) cuál de cuatro pedidos se empaca sin sueltos · cuantos-hasta (1) premios de
 *   (múltiplo)          una rifa del 1 al N · tramo (2) múltiplos de d de dos o de tres cifras · razon (3, San Marcos
 *                       2019-I) «p de cada d» con el total entre dos números
 *   restos-suman        suma (1) el resto de dos pedidos juntos · veces (1) de k pedidos iguales · faltan (2, trampa 18)
 *   (principios)        «le faltan f» como resto · expresion (3) el resto de a × N + b · triple (3, San Marcos 2023-II)
 *                       le falta f y compra k veces más
 *   criterios           nueve-tres (1) resto entre 9 o entre 3 · ultimas (1) entre 2, 4, 5, 8 o 25 · cifra-9 (2) la cifra
 *                       que hace un múltiplo de 9 · ocultas (3, San Marcos 2023-II) dos cifras ocultas con 5 y 9
 *   restos-potenciales  primeros (1) el resto de una potencia pequeña · resto-potencia (2) con el ciclo · ultima-cifra
 *                       (2) · dia (2) el día de la semana · potencia-mas (3) el resto de una potencia más un número
 *   criterios-pesos     once (1) resto entre 11 · siete (2) resto entre 7 · boleto-11 (2) la cifra borrada ·
 *                       oculta-7-13 (3, San Marcos 2023-II y 2027-I) una cifra oculta con el 7 o el 13
 *   diofanticas         completar (1) las monedas de S/ 2 que faltan · maneras (2) cuántas maneras de pagar ·
 *                       menos-monedas (2) · articulos (3, San Marcos 2023-II, RM) dos artículos con gasto fijo
 *
 * Notación (propuesta §6): N el número, d el divisor, d̊ «un múltiplo de d» (el circulito del examen, aquí como el
 * carácter d̊), r y s los restos; × para multiplicar, nunca «·»; a̅b̅c̅ con raya; ☐ una cifra borrada; las potencias con
 * superíndice (2⁵⁰). Las alternativas son texto plano.
 * Colores: un color fijo por magnitud, el de la teoría (def.colores): el envase en turquesa (e: el divisor, la bolsita,
 * el valor de una moneda), lo que sobra en naranja (r: el resto, los sueltos, también cuando es lo que se pide), lo
 * que se busca y no es un resto en violeta (b: cuántos, la cifra, las monedas, el día). Lo que se pide va en tinta en
 * la pregunta. Sin verde ni carmín.
 * Datos (docs/plan-calidad.md §3, punto 13): la definición de múltiplo, el conteo hasta N, los principios con d̊, los
 * criterios, el ciclo, los pesos y la ecuación de pago; nunca el paso hecho ni la respuesta.
 * Errores: los códigos AT-* de la teoría de la unidad (hipótesis de aula, sin medir; tabla «Divisibilidad (19 nov)» de
 * docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md). La trampa 18 de
 * docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md respalda los del resto por exceso.
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'divisibilidad-restos';
  const UNIDAD = 'aritmetica.divisibilidad';
  const TRAMPAS = 'docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md';
  const v = P.v;
  const f0 = x => P.formatear(x, 0);
  const mod = (x, k) => ((x % k) + k) % k;
  const SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = x => [...String(x)].map(c => SUPD[c]).join('');
  const pot = (b, e) => `${b}${sup(e)}`;
  const raya = s => [...String(s)].map(c => c + '̅').join('');
  const MU = 'd̊';
  const powmod = (b, e, k) => { let x = 1 % k; for (let i = 0; i < e; i++) x = (x * b) % k; return x; };
  // Los restos de b, b², b³… entre d hasta que uno se repite (los usados aquí empiezan en la primera potencia).
  const ciclo = (b, d) => { const xs = []; let x = b % d; while (!xs.includes(x)) { xs.push(x); x = (x * b) % d; } return { xs, ini: xs.indexOf(x) }; };
  const menos = x => (x < 0 ? `−${-x}` : String(x));
  const sueltos = k => (k === 1 ? ' suelto' : ' sueltos');
  const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  // Los tres colores de la unidad.
  const Ev = x => v('e', typeof x === 'number' ? f0(x) : String(x));   // envase, turquesa
  const Rv = x => v('r', typeof x === 'number' ? f0(x) : String(x));   // lo que sobra, naranja
  const Bv = x => v('b', typeof x === 'number' ? f0(x) : String(x));   // lo que se busca, violeta
  const VARS = { e: { nombre: 'el envase: el divisor, lo que lleva una bolsita, lo que vale una moneda', color: 'i' },
    r: { nombre: 'lo que sobra: el resto, los sueltos', color: 'o' },
    b: { nombre: 'lo que se busca: cuántos, la cifra, las monedas, el día', color: 'f' } };

  // Un error: la alternativa que ve el alumno (texto) y su explicación. Sin valor válido, no entra.
  const h = (id, valor, explicacion, fmt = f0, fuente = null) =>
    (valor === undefined || valor === null || (typeof valor === 'number' && (!Number.isFinite(valor) || valor < 0)) ? null
      : { id, clave: String(fmt(valor)), texto: String(fmt(valor)), explicacion, respaldo: 'hipotesis', fuente });

  // ---- Datos que se repiten (herramientas, no el paso hecho) ----
  const D = {
    def: 'N es múltiplo de d si N = d × k, con k un entero; d es la bolsita',
    conteo: 'Del 1 al N hay tantos múltiplos de d como el cociente entero de N ÷ d',
    dos: 'Los números de dos cifras van del 10 al 99',
    tres: 'Los números de tres cifras van del 100 al 999',
    razon: (p, d) => `«${p} de cada ${d}»: por cada grupo de ${d}, ${p} son de quinto`,
    mu: `${MU}: un múltiplo de d; r y s: los restos de cada número entre d`,
    suma: `(${MU} + r) + (${MU} + s) = ${MU} + (r + s)`,
    resta: `(${MU} + r) − (${MU} + s) = ${MU} + (r − s)`,
    prod: `(${MU} + r) × (${MU} + s) = ${MU} + r × s`,
    empaca: 'Un resto es menor que d: si llega a d, se divide otra vez',
    falta: `Si a N le faltan rₑ para ser múltiplo de d: N = ${MU} − rₑ (rₑ: el resto por exceso)`,
    veces: `k pedidos iguales: k × (${MU} + r) = ${MU} + k × r`,
    c93: 'Entre 9 y entre 3: N deja el mismo resto que la suma de sus cifras',
    c25: 'Entre 2 y entre 5: N deja el mismo resto que su última cifra',
    c4: 'Entre 4 y entre 25: N deja el mismo resto que el número de sus dos últimas cifras',
    c8: 'Entre 8: N deja el mismo resto que el número de sus tres últimas cifras',
    cifras: 'Cada letra es una cifra de 0 a 9; la primera cifra de un numeral no es 0',
    ciclo: 'Los restos de las potencias de un número se repiten en ciclo: se calculan hasta que uno se repite',
    sigue: 'Cada resto sale de multiplicar el anterior por la base y volver a dividir',
    lugar: 'Dos potencias cuyos exponentes dejan el mismo resto entre el largo del ciclo dejan el mismo resto',
    ultima: 'La última cifra de un número es su resto entre 10',
    semana: 'La semana se repite cada 7 días',
    pesos: 'Resto de N = resto de la suma de cada cifra por el peso de su lugar',
    p11: 'Pesos entre 11, desde las unidades: +1, −1, +1, −1…',
    p7: 'Pesos entre 7, desde las unidades: 1, 3, 2, −1, −3, −2',
    p13: 'Pesos entre 13, desde las unidades: 1, −3, −4, −1, 3, 4',
    negativo: 'Si el total sale negativo, se le suma el divisor hasta que deje de serlo',
    ec: (p, q, c, unaDeCada) => `${p} × x + ${q} × y = ${c}, con x e y enteros ${unaDeCada ? 'positivos' : 'que no son negativos'}`,
    xy: (a, b) => `x: ${a}; y: ${b}`,
    fila: 'Valor de una fila = lo que vale la moneda × cuántas hay',
  };
  const PESOS = { 7: [1, 3, 2, -1, -3, -2], 11: [1, -1, 1, -1, 1, -1], 13: [1, -3, -4, -1, 3, 4] };
  const pesar = (cifras, d) => [...String(cifras)].reverse().reduce((s, c, i) => s + Number(c) * PESOS[d][i % 6], 0);
  const sumaCifras = N => [...String(N)].reduce((s, c) => s + Number(c), 0);

  // ---- Tipos por idea (los id de las ideas de la teoría) ----
  const TIPOS_POR_IDEA = {
    'filas-de-m': ['es-multiplo', 'cuantos-hasta', 'tramo', 'razon'],
    'restos-suman': ['suma', 'veces', 'faltan', 'expresion', 'triple'],
    criterios: ['nueve-tres', 'ultimas', 'cifra-9', 'ocultas'],
    'restos-potenciales': ['primeros', 'resto-potencia', 'ultima-cifra', 'dia', 'potencia-mas'],
    'criterios-pesos': ['once', 'siete', 'boleto-11', 'oculta-7-13'],
    diofanticas: ['completar', 'maneras', 'menos-monedas', 'articulos'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const TIPOS_POR_UNIDAD = { [UNIDAD]: IDEAS.flatMap(i => TIPOS_POR_IDEA[i]) };
  const NIVEL = { 'es-multiplo': 1, 'cuantos-hasta': 1, tramo: 2, razon: 3,
    suma: 1, veces: 1, faltan: 2, expresion: 3, triple: 3,
    'nueve-tres': 1, ultimas: 1, 'cifra-9': 2, ocultas: 3,
    primeros: 1, 'resto-potencia': 2, 'ultima-cifra': 2, dia: 2, 'potencia-mas': 3,
    once: 1, siete: 2, 'boleto-11': 2, 'oculta-7-13': 3,
    completar: 1, maneras: 2, 'menos-monedas': 2, articulos: 3 };

  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8» y rotula 3 básicos, 3 intermedios y 2
  // avanzados): una pregunta de cada idea, y las dos de examen son de San Marcos (2023-II y 2019-I).
  const PAPEL = { 'papel-1': 'cuantos-hasta', 'papel-2': 'veces', 'papel-3': 'nueve-tres', 'papel-4': 'resto-potencia',
    'papel-5': 'siete', 'papel-6': 'maneras', 'papel-7': 'ocultas', 'papel-8': 'razon' };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const forzado = !o.idea && PAPEL[String(semilla)];
    let tipo;
    if (forzado) tipo = forzado;
    else {
      const idea = TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS);
      tipo = rng.elegir(TIPOS_POR_IDEA[idea]);
    }
    for (let intento = 0; intento < 500; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      const p = pr && cerrar(semilla, tipo, pr, rng);
      if (p) return p;
    }
    throw new Error(`No se pudo generar un problema de ${tipo} con 4 alternativas distintas`);
  }

  // Arma las alternativas y el problema. Todas las respuestas van como texto (un resto puede ser 0).
  function cerrar(semilla, tipo, o, rng) {
    const fmt = o.fmt || f0, ct = String(fmt(o.correcta));
    const errores = o.errores.filter(e => e && e.clave !== ct);
    const alternativas = P.armarTexto({ correcta: { clave: ct, texto: ct }, errores, rng });
    if (alternativas.length < 4) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object') usadas.add(x.v);
    const variables = Object.fromEntries([...usadas].map(k => [k, VARS[k]]));
    return {
      id: `${ID}#${semilla}`, unidadCatalogo: UNIDAD, variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos,
      alternativas, solucion: o.solucion, respuesta: { valor: ct, texto: ct, unidad: '' },
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos),
    };
  }

  // ======================= Idea 1: múltiplo =======================

  function esMultiplo(rng) {
    const d = rng.entero(6, 9), k = rng.entero(5, 11), N = d * k;
    if (N % 10 === d) return null;
    const termina = 10 * rng.entero(3, 9) + d;           // termina en la cifra de la bolsita
    const vecino = N + rng.elegir([-1, 1]);
    // Uno cuyas cifras suman d (o un múltiplo de d) y que no es múltiplo.
    let cifras = null;
    for (let x = 20; x <= 99 && !cifras; x++) if (x % d && sumaCifras(x) % d === 0 && x !== termina && x !== vecino) cifras = x;
    if ([termina, vecino, cifras].some(x => x % d === 0)) return null;
    return {
      enunciado: ['Doña Juana empaca sus pedidos en bolsitas de ', Ev(d), ' caramelos.'],
      pregunta: ['¿Cuál de estos pedidos se empaca sin que sobre ningún caramelo?'],
      datos: [D.def],
      correcta: N,
      errores: [
        h('AT-MULT-TERMINA', termina, `Bien buscar un múltiplo de ${d}. Pero ${termina} solo termina en ${d}: ${termina} = ${d} × ${Math.floor(termina / d)} + ${termina % d}.`),
        h('AT-MULT-VECINO', vecino, `Bien acercarse a un múltiplo de ${d}. Pero ${vecino} está a 1 de ${N}: deja ${mod(vecino, d)}${sueltos(mod(vecino, d))}.`),
        h('AT-MULT-CIFRAS', cifras, `Bien que sus cifras sumen ${sumaCifras(cifras)}. Pero eso sirve entre 3 y 9: ${cifras} deja ${cifras % d} entre ${d}.`),
      ],
      solucion: [[Bv(N), ' = ', Ev(d), ` × ${k}: llena ${k} bolsitas y no sobra ninguno (resto `, Rv(0), ').'], [`Los otros dejan sueltos: ${termina} deja ${termina % d}, ${vecino} deja ${mod(vecino, d)} y ${cifras} deja ${cifras % d}.`]],
      _datos: { d, opciones: [N, termina, vecino, cifras] },
    };
  }

  function cuantosHasta(rng) {
    const d = rng.entero(6, 13), N = rng.entero(5, 15) * 10 + rng.entero(0, 9), q = Math.floor(N / d), r = N % d;
    if (q < 4 || r === 0) return null;
    return {
      enunciado: ['La promoción vende los boletos del 1 al ', f0(N), '. Hay premio para cada boleto cuyo número es múltiplo de ', Ev(d), '.'],
      pregunta: ['¿Cuántos premios se entregan?'],
      datos: [D.conteo, `Los boletos van del 1 al ${N}, sin saltarse ninguno`],
      correcta: q,
      errores: [
        h('AT-CONTEO-ARRIBA', q + 1, `Bien dividir ${N} entre ${d}. Pero el último grupo no se completa: no termina en premio. Así salen ${q + 1}.`),
        h('AT-MULT-PROPIO', q - 1, `Bien contar grupos de ${d}. Pero el boleto ${d} también es múltiplo de ${d}: sin él salen ${q - 1}.`),
        h('AT-CONTEO-RESTO', r, `Bien la división: ${N} = ${d} × ${q} + ${r}. Pero ${r} son los boletos que sobran, no los premios.`),
      ],
      solucion: [[`${f0(N)} = `, Ev(d), ` × ${q} + `, Rv(r), `: hay ${q} grupos completos de ${d} boletos.`], ['Cada grupo completo termina en un premio: hay ', Bv(q), ' premios.']],
      _datos: { d, N },
    };
  }

  function tramo(rng) {
    const d = rng.entero(6, 19), tres = rng.elegir([false, true]);
    const lo = tres ? 100 : 10, hi = tres ? 999 : 99, ok = Math.floor(hi / d) - Math.floor((lo - 1) / d);
    if (ok < 4) return null;
    const sinQuitar = Math.floor(hi / d), poste = Math.floor((hi - lo) / d), quitaMal = Math.floor(hi / d) - Math.floor(lo / d) - 1;
    const primero = Math.ceil(lo / d) * d, ultimo = Math.floor(hi / d) * d;
    return {
      enunciado: [`Los boletos de una rifa llevan todos los números de ${tres ? 'tres' : 'dos'} cifras. Hay premio para cada múltiplo de `, Ev(d), '.'],
      pregunta: ['¿Cuántos premios hay?'],
      datos: [D.conteo, tres ? D.tres : D.dos],
      correcta: ok,
      errores: [
        h('AT-CONTEO-SIN-QUITAR', sinQuitar, `Bien contar hasta ${hi}: ${sinQuitar}. Pero también se cuentan los de menos de ${tres ? 'tres' : 'dos'} cifras: hay que quitarlos.`),
        h('AT-CONTEO-POSTE', poste, `Bien restar los extremos: (${hi} − ${lo}) ÷ ${d}. Pero así falta contar uno de los dos extremos: salen ${poste}.`),
        quitaMal !== ok && h('AT-CONTEO-QUITA-MAL', quitaMal, `Bien quitar los de antes. Pero hasta ${lo - 1} hay ${Math.floor((lo - 1) / d)} múltiplos, no ${Math.floor(lo / d) + 1}: así salen ${quitaMal}.`),
      ],
      solucion: [[`Hasta ${hi} hay ${sinQuitar} múltiplos de `, Ev(d), `; hasta ${lo - 1}, ${Math.floor((lo - 1) / d)}.`], [`Van del ${primero} al ${ultimo}: ${sinQuitar} − ${Math.floor((lo - 1) / d)} = `, Bv(ok), '.']],
      _datos: { d, lo, hi },
    };
  }

  function razon(rng) {
    const d = rng.entero(5, 9), p = rng.entero(2, d - 2), k = rng.entero(5, 12), T = d * k;
    const L = T - rng.entero(1, d - 1), U = L + d;   // un solo múltiplo de d entre L y U
    // p y d sin factor común (auditoría del 19 nov): «2 de cada 6» es «1 de cada 3», y entonces sirven otros totales.
    const mcd = (x, y) => (y ? mcd(y, x % y) : x);
    if (T <= L || T >= U || mcd(p, d) !== 1) return null;
    return {
      enunciado: [`En una rifa, ${p} de cada `, Ev(d), ` boletos vendidos los compraron alumnos de quinto. Se vendieron más de ${L} y menos de ${U} boletos.`],
      pregunta: ['¿Cuántos boletos compraron los de quinto?'],
      datos: [D.razon(p, d), D.def],
      correcta: p * k,
      errores: [
        h('AT-RAZON-TOTAL', T, `Bien hallar el total: ${T}, el único múltiplo de ${d} entre ${L} y ${U}. Pero se piden los de quinto.`),
        h('AT-RAZON-RESTO', (d - p) * k, `Bien los grupos. Pero en cada grupo de ${d}, ${p} son de quinto: ${(d - p) * k} son los demás.`),
        h('AT-RAZON-GRUPOS', k, `Bien: hay ${k} grupos de ${d}. Pero en cada grupo hay ${p} de quinto, no 1.`),
      ],
      solucion: [['El total va en grupos de ', Ev(d), `: es múltiplo de ${d}. Entre ${L} y ${U} solo está ${T} = ${d} × ${k}.`], [`En cada grupo hay ${p} de quinto: ${p} × ${k} = `, Bv(p * k), '.']],
      _datos: { d, p, L, U },
    };
  }

  // ======================= Idea 2: al operar, mandan los sueltos =======================

  function suma(rng) {
    const d = rng.entero(5, 12), r = rng.entero(1, d - 1), s = rng.entero(1, d - 1), ok = (r + s) % d;
    if (r + s < d) return null;
    return {
      enunciado: ['Un pedido deja ', Rv(r), r === 1 ? ' suelto' : ' sueltos', ' en bolsitas de ', Ev(d), ' y otro deja ', Rv(s), '.'],
      pregunta: ['Si doña Juana los junta, ¿cuántos sueltos quedan?'],
      datos: [D.mu, D.suma, D.empaca],
      correcta: ok,
      errores: [
        h('AT-RESTO-MAYOR', r + s, `Bien juntar los sueltos: ${r} + ${s} = ${r + s}. Pero con ${r + s} se llena otra bolsita de ${d}.`),
        h('AT-RESTO-OPERA', (r * s) % d, `Bien mirar solo los sueltos. Pero al juntar pedidos se suman: multiplicando salen ${(r * s) % d}.`),
        h('AT-RESTO-IGUAL', Math.max(r, s), `Bien partir de los sueltos. Pero ${Math.max(r, s)} deja uno solo: se juntan los dos.`),
      ],
      solucion: [['Las bolsitas llenas siguen llenas. Se juntan los sueltos: ', `${r} + ${s} = ${r + s}.`], [`${r + s} = `, Ev(d), ' + ', Rv(ok), ': ', ok === 1 ? 'queda ' : 'quedan ', Rv(ok), sueltos(ok), '.']],
      _datos: { d, rs: [r, s], op: '+' },
    };
  }

  function veces(rng) {
    const d = rng.entero(5, 11), r = rng.entero(2, d - 1), k = rng.entero(3, 9), b = k * r, ok = b % d;
    if (b < 2 * d) return null;
    return {
      enunciado: ['Un pedido deja ', Rv(r), ' sueltos al empacarlo en bolsitas de ', Ev(d), `. Doña Juana prepara ${k} pedidos iguales y los junta.`],
      pregunta: ['¿Cuántos sueltos quedan?'],
      datos: [D.mu, D.veces, D.empaca],
      correcta: ok,
      errores: [
        h('AT-RESTO-MAYOR', b, `Bien juntar ${k} × ${r} = ${b} sueltos. Pero con ${b} se llenan más bolsitas de ${d}.`),
        h('AT-RESTO-SUMA', (k + r) % d, `Bien mirar los sueltos. Pero son ${k} pedidos de ${r}: se multiplica; sumando salen ${(k + r) % d}.`),
        h('AT-RESTO-IGUAL', r, `Bien que cada pedido deja ${r}. Pero con ${k} pedidos se juntan ${k} veces esos sueltos.`),
        h('AT-DEPENDE', 'No se puede saber', 'Bien pensar en los pedidos. Pero las bolsitas llenas siguen llenas: basta con los sueltos.', x => x),
      ],
      solucion: [[`Cada pedido aporta ${r} sueltos: son ${k} × ${r} = ${b}.`], [`${b} = `, Ev(d), ` × ${Math.floor(b / d)} + `, Rv(ok), ': ', ok === 1 ? 'queda ' : 'quedan ', Rv(ok), sueltos(ok), '.']],
      _datos: { d, rs: Array(k).fill(r), op: '+' },
    };
  }

  function faltan(rng) {
    const d = rng.entero(6, 15), f = rng.entero(1, d - 2), ok = d - f;
    return {
      enunciado: ['A un pedido le ', f === 1 ? 'falta 1 caramelo' : `faltan ${f} caramelos`, ' para llenar justo bolsitas de ', Ev(d), '.'],
      pregunta: ['¿Qué resto deja el pedido al dividirlo entre ', Ev(d), '?'],
      datos: [D.mu, D.falta, `N = ${MU} + r: al dividir N entre d sobran r`],
      correcta: ok,
      errores: [
        h('AT-EXCESO-IGUAL', f, `Bien ver la última bolsita. Pero ${f} es lo que le falta; el resto es lo que ya tiene.`, f0, TRAMPAS),
        h('AT-EXCESO-DIVISOR', d, `Bien pensar en la bolsita de ${d}. Pero un resto es menor que ${d}.`),
        h('AT-EXCESO-CERO', 0, 'Bien que no sobra una bolsita entera. Pero la última está empezada: algo sobra.'),
      ],
      solucion: [['La última bolsita lleva ', Ev(d), ` y le ${f === 1 ? 'falta 1' : `faltan ${f}`}: tiene ${d} − ${f} = ${ok}.`], ['Esos son los que sobran: deja resto ', Rv(ok), '.']],
      _datos: { d, f },
    };
  }

  function expresion(rng) {
    const d = rng.entero(6, 13), r = rng.entero(2, d - 1), a = rng.entero(2, 5), b = rng.entero(1, 9), bruto = a * r + b, ok = bruto % d;
    if (bruto < d) return null;
    return {
      enunciado: ['Un número N deja resto ', Rv(r), ' al dividirlo entre ', Ev(d), '.'],
      pregunta: [`¿Qué resto deja ${a} × N + ${b} al dividirlo entre `, Ev(d), '?'],
      datos: [D.mu, D.prod, D.suma, D.empaca],
      correcta: ok,
      errores: [
        h('AT-RESTO-MAYOR', bruto, `Bien operar los restos: ${a} × ${r} + ${b} = ${bruto}. Pero un resto entre ${d} es menor que ${d}.`),
        h('AT-RESTO-OLVIDA', (a * r) % d, `Bien el resto de ${a} × N: ${(a * r) % d}. Pero falta sumar ${b}.`),
        h('AT-RESTO-SUMA', (a + r + b) % d, `Bien sumar ${b}. Pero ${a} × N son ${a} veces el resto: se multiplica, no se suma.`),
        h('AT-RESTO-IGUAL', r, `Bien partir del resto de N. Pero ${a} × N + ${b} ya no deja lo mismo.`),
      ],
      solucion: [[`Las bolsitas llenas de N siguen llenas: ${a} × N + ${b} deja lo que deja ${a} × ${r} + ${b} = ${bruto}.`], [`${bruto} = `, Ev(d), ` × ${Math.floor(bruto / d)} + `, Rv(ok), ': deja resto ', Rv(ok), '.']],
      _datos: { d, r, a, b },
    };
  }

  function triple(rng) {
    const d = rng.entero(6, 12), f = rng.entero(1, 3), k = rng.elegir([2, 3, 4]), ok = (k * (d - f)) % d;
    const veces = { 2: 'el doble', 3: 'el triple', 4: 'el cuádruple' }[k];
    return {
      enunciado: ['Doña Juana empaca sus caramelos de ', Ev(d), ' en ', Ev(d), ` y le ${f === 1 ? 'falta 1' : `faltan ${f}`} para llenar la última bolsita.`],
      pregunta: [`Si compra ${veces} de caramelos, ¿cuántos sueltos le quedan al empacar de `, Ev(d), ' en ', Ev(d), '?'],
      datos: [D.mu, D.falta, D.veces, D.empaca],
      correcta: ok,
      errores: [
        h('AT-EXCESO-IGUAL', (k * f) % d, `Bien multiplicar por ${k}. Pero «le ${f === 1 ? 'falta 1' : `faltan ${f}`}» no es «${f === 1 ? 'sobra 1' : `sobran ${f}`}»: así salen ${(k * f) % d}.`, f0, TRAMPAS),
        h('AT-RESTO-MAYOR', k * (d - f), `Bien: le sobran ${d - f} y se juntan ${k} veces. Pero con ${k * (d - f)} se llenan más bolsitas.`),
        h('AT-RESTO-IGUAL', d - f, `Bien el resto de lo que tenía: ${d - f}. Pero compra ${veces}: se multiplica.`),
      ],
      solucion: [[`Si le ${f === 1 ? 'falta 1' : `faltan ${f}`}, le sobran ${d} − ${f} = ${d - f}.`], [`${veces[0].toUpperCase()}${veces.slice(1)} deja ${k} × ${d - f} = ${k * (d - f)} = `, Ev(d), ` × ${Math.floor(k * (d - f) / d)} + `, Rv(ok), ': ', ok === 1 ? 'queda ' : 'quedan ', Rv(ok), '.']],
      _datos: { d, f, k },
    };
  }

  // ======================= Idea 3: criterios de las últimas cifras y de la suma =======================

  function nueveTres(rng) {
    const d = rng.elegir([9, 9, 3]), N = rng.entero(1000, 99999), S = sumaCifras(N), ok = N % d;
    if (S < 2 * d) return null;
    return {
      enunciado: ['Doña Juana reempaca ', f0(N), ' caramelos en bolsitas de ', Ev(d), '.'],
      pregunta: ['¿Cuántos sueltos quedan?'],
      datos: [D.c93, D.empaca],
      correcta: ok,
      errores: [
        h('AT-RESTO-MAYOR', S, `Bien sumar las cifras: ${S}. Pero un resto entre ${d} es menor que ${d}: falta dividir.`),
        h('AT-CRITERIO-ULTIMA', (N % 10) % d, `Bien mirar las cifras. Pero entre ${d} cuentan todas, no solo la última.`),
        d === 3 ? h('AT-CRITERIO-NUEVE', N % 9, `Bien la suma de cifras. Pero ${N % 9} es el resto entre 9; la bolsita es de 3.`)
          : h('AT-CRITERIO-SUMA', S % 10, `Bien sumar las cifras. Pero ${S} se divide entre 9, no se toma su última cifra.`),
      ],
      solucion: [[`Cada envase deja 1 por cifra: las cifras suman ${[...String(N)].join(' + ')} = ${S}.`], [`${S} = `, Ev(d), ` × ${Math.floor(S / d)} + `, Rv(ok), ': ', ok === 1 ? 'queda ' : 'quedan ', Rv(ok), sueltos(ok), '.']],
      _datos: { d, N },
    };
  }

  function ultimas(rng) {
    const d = rng.elegir([4, 4, 25, 8, 5]), N = rng.entero(1000, 99999), ok = N % d;
    const cola = d === 8 ? N % 1000 : d === 5 ? N % 10 : N % 100;
    const dos = Math.floor(N / 10) % 10 + N % 10;
    return {
      enunciado: ['Doña Juana tiene ', f0(N), ' caramelos y los reempaca en bolsitas de ', Ev(d), '.'],
      pregunta: ['¿Cuántos sueltos quedan?'],
      datos: [d === 8 ? D.c8 : d === 5 ? D.c25 : D.c4, d === 8 ? '1 000 = 8 × 125' : d === 5 ? '10 = 5 × 2' : '100 = 4 × 25'],
      correcta: ok,
      errores: [
        d !== 5 && h('AT-CRITERIO-ULTIMA', (N % 10) % d, `Bien mirar las últimas cifras. Pero entre ${d} no basta la última: ${d === 8 ? 'cuentan tres' : 'cuentan dos'}.`),
        h('AT-CRITERIO-SUMA', sumaCifras(N) % d, `Bien no dividir todo. Pero sumar las cifras sirve entre 3 y 9, no entre ${d}.`),
        h('AT-CRITERIO-MEZCLA', dos % d, `Bien mirar las dos últimas cifras. Pero se leen como el número ${N % 100}, no ${Math.floor(N / 10) % 10} + ${N % 10}.`),
        d === 8 && h('AT-CRITERIO-DECENA', (N % 100) % 8, 'Bien mirar las últimas cifras. Pero entre 8 cuentan las tres últimas, no dos.'),
        d === 5 && h('AT-CRITERIO-NUEVE', N % 9, 'Bien no dividir todo. Pero eso es el resto entre 9; entre 5 basta la última cifra.'),
      ],
      solucion: [[`Los envases más grandes son múltiplos de `, Ev(d), `: queda ${f0(cola)}.`], [`${f0(cola)} = `, Ev(d), ` × ${Math.floor(cola / d)} + `, Rv(ok), ': deja resto ', Rv(ok), '.']],
      _datos: { d, N },
    };
  }

  function cifra9(rng) {
    const k = rng.elegir([3, 4]), pos = rng.entero(1, k - 1);
    const cs = Array.from({ length: k }, (_, i) => (i === 0 ? rng.entero(1, 9) : rng.entero(0, 9)));
    const patron = cs.map((c, i) => (i === pos ? 'a' : String(c))).join('');
    const sirven = []; for (let a = 0; a <= 9; a++) if (Number(patron.replace('a', a)) % 9 === 0) sirven.push(a);
    if (sirven.length !== 1) return null;
    const ok = sirven[0], S = sumaCifras(patron.replace('a', '')), tres = [ok - 3, ok + 3, ok + 6, ok - 6].filter(x => x >= 0 && x <= 9);
    return {
      enunciado: ['El número ', raya(patron), ' es múltiplo de ', Ev(9), '.'],
      pregunta: ['¿Cuánto vale la cifra a?'],
      datos: [D.c93, `${raya(patron)}: numeral de cifras ${[...patron].join(', ').replace(/, ([^,]+)$/, ' y $1')}`, D.cifras],
      correcta: ok,
      errores: [
        h('AT-CRITERIO-RESTO', S % 9, `Bien sumar las cifras que se ven: ${S}. Pero ${S % 9} es lo que sobra; la cifra completa otro 9.`),
        ...tres.slice(0, 2).map(x => h('AT-CRITERIO-TRES', x, `Bien que la suma sea múltiplo de 3 con a = ${x}. Pero no lo es de 9.`)),
      ],
      solucion: [[`Las cifras que se ven suman ${S}.`], [`${S} + a tiene que ser múltiplo de 9: `, `${S} + `, Bv(ok), ` = ${S + ok}.`]],
      _datos: { patron, d: 9 },
    };
  }

  function ocultas(rng) {
    // Con el 5 y el 9 (San Marcos 2023-II, cifras ocultas con 9): b = 5 y a sale de la suma de cifras.
    const m = 5, m2 = 9;
    const pa = rng.entero(1, 2), cs = [rng.entero(1, 9), 0, rng.entero(0, 9), 0];
    const patron = cs.map((c, i) => (i === pa ? 'a' : i === 3 ? 'b' : String(c))).join('');
    const sols = []; for (let b = 1; b <= 9; b++) for (let a = 0; a <= 9; a++) { const n = Number(patron.replace('a', a).replace('b', b)); if (n % m === 0 && n % m2 === 0) sols.push([a, b]); }
    if (sols.length !== 1) return null;
    const [ok, bb] = sols[0], fijas = sumaCifras(patron.replace(/[ab]/g, ''));
    const conCero = []; for (let a = 0; a <= 9; a++) if ((fijas + a) % m2 === 0) conCero.push(a);
    return {
      enunciado: ['El número ', raya(patron), ' es múltiplo de ', Ev(m), ' y de ', Ev(m2), ', y b no es 0.'],
      pregunta: ['¿Cuánto vale a?'],
      datos: [D.c25, D.c93, `${raya(patron)}: numeral de cifras ${[...patron].join(', ').replace(/, ([^,]+)$/, ' y $1')}`],
      correcta: ok,
      errores: [
        conCero.length && h('AT-CRITERIO-CERO', conCero[0], `Bien la regla de ${m2}. Pero b no es 0: con b = 0 sale a = ${conCero[0]}.`),
        h('AT-RESPONDE-OTRA', bb, `Bien hallar la última cifra: b = ${bb}. Pero se pide a.`),
        h('AT-CRITERIO-RESTO', (fijas + bb) % m2, `Bien sumar las cifras: ${fijas + bb} sin a. Pero ${(fijas + bb) % m2} es lo que sobra; a completa el múltiplo.`),
        h('AT-CRITERIO-TRES', ok + 3 <= 9 ? ok + 3 : ok - 3, 'Bien la suma de cifras. Pero con esa cifra la suma es múltiplo de 3, no de 9.'),
      ],
      solucion: [['Por el 5, la última cifra es 0 o 5; no es 0: b = ', String(bb), '.'],
        [`Por el ${m2}, las cifras suman ${fijas + bb} + a, múltiplo de ${m2}: a = `, Bv(ok), '.']],
      _datos: { patron, m, m2 },
    };
  }

  // ======================= Idea 4: restos potenciales =======================
  const BASES = [[2, 7], [3, 7], [4, 7], [5, 7], [2, 9], [4, 9], [5, 9], [3, 11], [4, 11], [5, 11], [3, 13], [4, 13], [5, 13], [2, 5], [3, 5], [3, 10], [2, 10], [7, 10], [8, 10]];
  const conCiclo = (rng, filtro) => { for (;;) { const [b, d] = rng.elegir(BASES.filter(filtro)), c = ciclo(b, d); if (c.ini === 0 && c.xs.length >= 3 && c.xs.length <= 6) return { b, d, xs: c.xs, L: c.xs.length }; } };

  function primeros(rng) {
    const { b, d } = conCiclo(rng, x => x[1] !== 10), e = rng.entero(3, 4), B = b ** e, ok = B % d;
    if (B < d) return null;
    return {
      enunciado: [`Doña Juana empaca ${pot(b, e)} caramelos en bolsitas de `, Ev(d), '.'],
      pregunta: ['¿Cuántos sueltos quedan?'],
      datos: [D.sigue, `${pot(b, e)} = ${Array(e).fill(b).join(' × ')}`],
      correcta: ok,
      errores: [
        h('AT-POTENCIA-PRODUCTO', (b * e) % d, `Bien dividir entre ${d}. Pero ${pot(b, e)} es ${b} multiplicado ${e} veces, no ${b} × ${e}.`),
        h('AT-RESTO-MAYOR', B, `Bien la potencia: ${B}. Pero falta empacar: con ${B} se llenan bolsitas de ${d}.`),
        h('AT-CICLO-PRIMERO', b % d, `Bien empezar por ${b}. Pero ese es el resto de la primera potencia.`),
      ],
      solucion: [[`${pot(b, e)} = ${B}.`], [`${B} = `, Ev(d), ` × ${Math.floor(B / d)} + `, Rv(ok), ': ', ok === 1 ? 'queda ' : 'quedan ', Rv(ok), sueltos(ok), '.']],
      _datos: { b, e, d },
    };
  }

  function restoPotencia(rng) {
    const { b, d, xs, L } = conCiclo(rng, x => x[1] !== 10), n = rng.entero(21, 99), lugar = n % L, ok = powmod(b, n, d);
    return {
      enunciado: ['N = ', pot(b, n), ': un número de muchas cifras.'],
      pregunta: ['¿Qué resto deja N al dividirlo entre ', Ev(d), '?'],
      datos: [D.ciclo, D.sigue, D.lugar],
      correcta: ok,
      errores: [
        h('AT-CICLO-LUGAR', lugar, `Bien dividir ${n} entre el largo del ciclo, ${L}: el resto es ${lugar}. Pero ese es el lugar, no el resto de la potencia.`),
        h('AT-CICLO-FIN', xs[L - 1], `Bien el ciclo. Pero el último resto toca solo si ${n} es múltiplo de ${L}.`),
        h('AT-CICLO-PRIMERO', xs[0], `Bien el primer resto del ciclo. Pero el exponente ${n} cae en otro lugar.`),
        h('AT-EXP-DIVISOR', powmod(b, n % d || d, d), `Bien reducir el exponente. Pero se reduce entre el largo del ciclo, ${L}, no entre ${d}.`),
      ],
      solucion: [[`Los restos de las potencias de ${b} entre `, Ev(d), ` son ${xs.join(', ')}: el ciclo mide ${L}.`], [`${n} = ${L} × ${Math.floor(n / L)} + ${lugar}: toca el ${lugar ? `lugar ${lugar}` : 'último'}. Deja resto `, Rv(ok), '.']],
      _datos: { b, e: n, d },
    };
  }

  function ultimaCifra(rng) {
    const { b, xs, L } = conCiclo(rng, x => x[1] === 10), n = rng.entero(21, 99), lugar = n % L, ok = powmod(b, n, 10);
    if (!lugar) return null;
    return {
      enunciado: ['N = ', pot(b, n), ': un número de muchas cifras.'],
      pregunta: ['¿En qué cifra termina N?'],
      datos: [D.ultima, D.ciclo, D.lugar],
      correcta: ok,
      errores: [
        h('AT-CICLO-LUGAR', lugar, `Bien dividir ${n} entre ${L}: el resto es ${lugar}. Pero ese es el lugar en el ciclo, no la cifra.`),
        h('AT-CICLO-FIN', xs[L - 1], `Bien el ciclo ${xs.join(', ')}. Pero ${xs[L - 1]} toca solo si ${n} es múltiplo de ${L}.`),
        h('AT-EXP-DIVISOR', powmod(b, n % 10 || 10, 10), `Bien reducir el exponente. Pero entre el largo del ciclo, ${L}, no entre 10.`),
        h('AT-CICLO-PRIMERO', b % 10, 'Bien la primera potencia. Pero el exponente es mucho mayor.'),
      ],
      solucion: [[`Las potencias de ${b} terminan en ${xs.join(', ')} y se repiten: el ciclo mide ${L}.`], [`${n} = ${L} × ${Math.floor(n / L)} + ${lugar}: termina en `, Rv(ok), '.']],
      _datos: { b, e: n, d: 10 },
    };
  }

  function dia(rng) {
    const { b, xs, L } = conCiclo(rng, x => x[1] === 7), n = rng.entero(20, 90), hoy = rng.entero(0, 6), lugar = n % L, av = powmod(b, n, 7), ok = DIAS[(hoy + av) % 7];
    return {
      enunciado: [`Hoy es ${DIAS[hoy]}.`],
      pregunta: ['¿Qué día de la semana será dentro de ', pot(b, n), ' días?'],
      datos: [D.semana, D.ciclo, D.lugar],
      correcta: ok, fmt: x => x,
      errores: [
        h('AT-CICLO-LUGAR', DIAS[(hoy + lugar) % 7], `Bien buscar el lugar en el ciclo: ${lugar}. Pero se avanza el resto que hay en ese lugar.`, x => x),
        h('AT-POTENCIA-MULTIPLO', DIAS[hoy], `Bien que las semanas completas no cambian el día. Pero una potencia de ${b} no es múltiplo de 7.`, x => x),
        h('AT-CICLO-FIN', DIAS[(hoy + xs[L - 1]) % 7], `Bien el ciclo de restos. Pero el último solo toca si ${n} es múltiplo de ${L}.`, x => x),
      ],
      solucion: [[`Las potencias de ${b} dejan ${xs.join(', ')} entre `, Ev(7), `; ${n} = ${L} × ${Math.floor(n / L)} + ${lugar}: deja `, Rv(av), '.'], [`Se avanzan ${av} días desde el ${DIAS[hoy]}: será `, Bv(ok), '.']],
      _datos: { b, e: n, hoy },
    };
  }

  function potenciaMas(rng) {
    const { b, d } = conCiclo(rng, x => x[1] !== 10), n = rng.entero(21, 99), c = rng.entero(1, d - 1), pr = powmod(b, n, d), ok = (pr + c) % d;
    if (pr + c < d) return null;
    return {
      enunciado: ['N = ', pot(b, n), ` + ${c}.`],
      pregunta: ['¿Qué resto deja N al dividirlo entre ', Ev(d), '?'],
      datos: [D.ciclo, D.lugar, D.suma, D.empaca],
      correcta: ok,
      errores: [
        h('AT-RESTO-MAYOR', pr + c, `Bien sumar los restos: ${pr} + ${c} = ${pr + c}. Pero un resto entre ${d} es menor que ${d}.`),
        h('AT-RESTO-OLVIDA', pr, `Bien el resto de la potencia: ${pr}. Pero falta sumar ${c}.`),
        h('AT-POTENCIA-MULTIPLO', c, `Bien sumar ${c}. Pero la potencia no es múltiplo de ${d}: deja ${pr}.`),
      ],
      solucion: [[`${pot(b, n)} deja ${pr} entre `, Ev(d), ' (con su ciclo).'], [`${pr} + ${c} = ${pr + c} = `, Ev(d), ' + ', Rv(ok), ': deja resto ', Rv(ok), '.']],
      _datos: { b, e: n, d, c },
    };
  }

  // ======================= Idea 5: el 11, el 7 y el 13 =======================

  function once(rng) {
    const N = rng.entero(1000, 9999), w = pesar(N, 11), ok = mod(w, 11);
    return {
      enunciado: ['El boleto ganador de la rifa es el ', f0(N), '.'],
      pregunta: ['¿Qué resto deja al dividirlo entre ', Ev(11), '?'],
      datos: [D.pesos, D.p11, D.negativo],
      correcta: ok,
      errores: [
        h('AT-CRITERIO-SUMA-7', sumaCifras(N) % 11, 'Bien mirar las cifras. Pero sumarlas todas sirve entre 9; entre 11 se suman y se restan alternando.'),
        h('AT-PESO-SIGNO', mod(-w, 11), 'Bien alternar. Pero desde las unidades: las unidades se suman y las decenas se restan.'),
        h('AT-CRITERIO-ULTIMA', N % 10 % 11, 'Bien empezar por las unidades. Pero entre 11 cuentan todas las cifras.'),
      ],
      solucion: [[`Desde las unidades: ${[...String(N)].reverse().map((c, i) => (i ? (i % 2 ? ' − ' : ' + ') : '') + c).join('')} = ${menos(w)}.`], [w < 0 ? `Sale negativo: ${menos(w)} + ${11 * Math.ceil(-w / 11)} = ` : w >= 11 ? `${w} = 11 × ${Math.floor(w / 11)} + ` : 'Deja resto ', Rv(ok), '.']],
      _datos: { d: 11, N },
    };
  }

  function siete(rng) {
    const N = rng.entero(100, 9999), w = pesar(N, 7), ok = mod(w, 7);
    const s = String(N), orden = [...s].reduce((a, c, i) => a + Number(c) * PESOS[7][i % 6], 0);
    const alt = pesar(N, 11);
    if (w < 7) return null;
    return {
      enunciado: ['El boleto ganador de la rifa es el ', f0(N), '.'],
      pregunta: ['¿Qué resto deja al dividirlo entre ', Ev(7), '?'],
      datos: [D.pesos, D.p7, D.negativo],
      correcta: ok,
      errores: [
        h('AT-CRITERIO-SUMA-7', sumaCifras(N) % 7, 'Bien no dividir todo. Pero sumar las cifras sirve entre 9; entre 7 cada lugar pesa distinto.'),
        h('AT-PESO-ORDEN', mod(orden, 7), 'Bien los pesos 1, 3 y 2. Pero se cuentan desde las unidades, no desde la izquierda.'),
        h('AT-PESO-SIN-REDUCIR', w, `Bien los pesos: ${w}. Pero un resto entre 7 es menor que 7: falta reducir.`),
        h('AT-CRITERIO-ALTERNA', mod(alt, 7), 'Bien no dividir todo. Pero alternar signos es del 11; entre 7 los pesos son 1, 3, 2…'),
      ],
      solucion: [['Cada cifra por el peso de su lugar, desde las unidades: ', [...s].reverse().map((c, i) => `${c} × ${PESOS[7][i % 6]}`).join(' + ').replace(/\+ (\d) × -(\d)/g, '− $1 × $2'), ` = ${w}.`], [`${w} = `, Ev(7), ` × ${Math.floor(w / 7)} + `, Rv(ok), ': deja resto ', Rv(ok), '.']],
      _datos: { d: 7, N },
    };
  }

  function boleto11(rng) {
    const k = 4, pos = rng.entero(1, 2), cs = [rng.entero(1, 9), rng.entero(0, 9), rng.entero(0, 9), rng.entero(0, 9)];
    const patron = cs.map((c, i) => (i === pos ? 'a' : String(c))).join('');
    const sirven = []; for (let a = 0; a <= 9; a++) if (Number(patron.replace('a', a)) % 11 === 0) sirven.push(a);
    if (sirven.length !== 1) return null;
    const ok = sirven[0], pesoA = PESOS[11][k - 1 - pos], resto = mod(pesar(patron.replace('a', 0), 11), 11);
    let suma = null; for (let a = 0; a <= 9; a++) if ((sumaCifras(patron.replace('a', '')) + a) % 11 === 0) suma = a;
    // Con el peso de la cifra borrada cambiado de signo, sale la cifra que deja −ok (si es una cifra).
    const signo = mod(-ok, 11) <= 9 ? mod(-ok, 11) : null;
    const lleno = patron.replace('a', '☐');
    return {
      enunciado: ['La lluvia borró una cifra del boleto ', raya(lleno), ', que es múltiplo de ', Ev(11), '.'],
      pregunta: ['¿Qué cifra era?'],
      datos: [D.pesos, D.p11, `${raya(lleno)}: la cifra borrada ☐ va de 0 a 9`],
      correcta: ok,
      errores: [
        suma !== null && h('AT-CRITERIO-SUMA-7', suma, 'Bien que todo sume un múltiplo de 11. Pero entre 11 las cifras se suman y se restan alternando.'),
        h('AT-CRITERIO-RESTO', resto, `Bien la cuenta sin la cifra borrada: deja ${resto}. Pero la cifra tiene que compensarlo.`),
        h('AT-CONTEO', (ok + 1) % 10, 'Bien la regla del 11. Pero con esa cifra la cuenta no da 0 ni un múltiplo de 11.'),
        signo !== null && h('AT-PESO-SIGNO', signo, `Bien alternar. Pero la cifra borrada lleva peso ${pesoA > 0 ? '+1' : '−1'}: con el signo cambiado sale ${signo}.`),
      ],
      solucion: [['Con a la cifra borrada, desde las unidades: ', [...patron].reverse().map((c, i) => (i ? (i % 2 ? ' − ' : ' + ') : '') + c).join(''), '.'], ['La cuenta tiene que dar 0 o un múltiplo de 11: a = ', Bv(ok), '.']],
      _datos: { patron, d: 11 },
    };
  }

  function oculta713(rng) {
    const d = rng.elegir([7, 13]), pos = rng.entero(1, 2);
    const cs = [rng.entero(1, 9), rng.entero(0, 9), rng.entero(0, 9)];
    const patron = cs.map((c, i) => (i === pos ? 'a' : String(c))).join('');
    const unica = (f) => { const s = []; for (let a = 0; a <= 9; a++) if (f(a)) s.push(a); return s.length === 1 ? s[0] : null; };
    const ok = unica(a => Number(patron.replace('a', a)) % d === 0);
    if (ok === null) return null;
    const con = a => patron.replace('a', a);
    const otro = d === 7 ? 13 : 7;
    const izq = a => mod([...con(a)].reduce((x, c, i) => x + Number(c) * PESOS[d][i], 0), d) === 0;
    return {
      enunciado: ['El número ', raya(patron), ' es múltiplo de ', Ev(d), '.'],
      pregunta: ['¿Cuánto vale la cifra a?'],
      datos: [D.pesos, d === 7 ? D.p7 : D.p13, `${raya(patron)}: numeral de cifras ${[...patron].join(', ').replace(/, ([^,]+)$/, ' y $1')}`],
      correcta: ok,
      errores: [
        h('AT-CRITERIO-SUMA-7', unica(a => sumaCifras(con(a)) % d === 0), `Bien buscar un múltiplo de ${d}. Pero sumar las cifras sirve entre 9.`),
        h('AT-CRITERIO-ALTERNA', unica(a => mod(pesar(con(a), 11), d) === 0), `Bien usar pesos. Pero alternar signos es del 11; entre ${d} los pesos son otros.`),
        h('AT-PESO-ORDEN', unica(izq), 'Bien los pesos. Pero se cuentan desde las unidades, no desde la izquierda.'),
        h('AT-PESO-OTRO', unica(a => mod(pesar(con(a), otro), d) === 0), `Bien pesar cada lugar. Pero esos son los pesos del ${otro}, no los del ${d}.`),
      ],
      solucion: [['Cada cifra por su peso, desde las unidades: ', [...patron].reverse().map((c, i) => `${c} × ${PESOS[d][i]}`).join(' + ').replace(/\+ (\w) × -(\d)/g, '− $1 × $2'), '.'],
        [`Con a = `, Bv(ok), `: ${con(ok)} = `, Ev(d), ` × ${Number(con(ok)) / d}.`]],
      _datos: { patron, d },
    };
  }

  // ======================= Idea 6: pagar justo con dos monedas =======================
  const pagos = (p, q, c) => { const o = []; for (let y = 0; q * y <= c; y++) if ((c - q * y) % p === 0) o.push([(c - q * y) / p, y]); return o; };

  function completar(rng) {
    const y = rng.entero(1, 6), x = rng.entero(2, 9), c = 2 * x + 5 * y;
    return {
      enunciado: [`La cuenta es de S/ ${c}. Un cliente ya puso ${y} ${y === 1 ? 'moneda' : 'monedas'} de S/ `, Ev(5), '.'],
      pregunta: ['¿Cuántas monedas de S/ ', Ev(2), ' le faltan para pagar justo?'],
      datos: [D.ec(2, 5, c), D.xy('monedas de S/ 2', 'monedas de S/ 5')],
      correcta: x,
      errores: [
        h('AT-RESPONDE-OTRA', c - 5 * y, `Bien restar lo que ya puso: faltan S/ ${c - 5 * y}. Pero se piden las monedas de S/ 2.`),
        h('AT-DIOF-DIVIDE', Math.floor(c / 2), `Bien dividir entre 2. Pero primero se quita lo que pagan las monedas de S/ 5.`),
        h('AT-RESPONDE-OTRA', x + y, 'Bien hallar las de S/ 2. Pero esas son todas las monedas juntas.'),
      ],
      solucion: [[`Con las de S/ 5 ya pagó ${5 * y}; faltan ${c} − ${5 * y} = ${c - 5 * y}.`], [`${c - 5 * y} = `, Ev(2), ' × ', Bv(x), ': le faltan ', Bv(x), ' monedas.']],
      _datos: { p: 2, q: 5, c, y },
    };
  }

  function maneras(rng) {
    const [p, q, clase] = rng.elegir([[2, 5, 'monedas'], [2, 5, 'monedas'], [3, 5, 'bolsas'], [10, 20, 'billetes'], [20, 50, 'billetes']]);
    const c = clase === 'billetes' ? 10 * rng.entero(7, 20) : rng.entero(20, 60), ps = pagos(p, q, c), n = ps.length;
    if (n < 2 || n > 7) return null;
    const ambas = ps.filter(([x, y]) => x && y).length;
    const txt = clase === 'bolsas' ? ['¿De cuántas maneras se pueden gastar ', `S/ ${c} justos en bolsas de S/ `, Ev(p), ' y cajas de S/ ', Ev(q), '?']
      : ['¿De cuántas maneras se pueden pagar ', `S/ ${c} justos con ${clase} de S/ `, Ev(p), ' y de S/ ', Ev(q), '?'];
    return {
      enunciado: txt,
      pregunta: ['También vale usar una sola clase.'],
      datos: [D.ec(p, q, c), clase === 'bolsas' ? D.xy('las bolsas', 'las cajas') : D.xy(`${clase} de S/ ${p}`, `${clase} de S/ ${q}`)],
      correcta: n,
      errores: [
        h('AT-DIOF-TODAS', Math.floor(c / q) + 1, `Bien probar cada cantidad de S/ ${q}. Pero solo sirve si lo que falta es múltiplo de ${p}.`),
        h('AT-DIOF-CERO', ambas, 'Bien las que usan las dos clases. Pero también vale usar una sola.'),
        h('AT-DIOF-DIVIDE', Math.floor(c / q), `Bien: caben ${Math.floor(c / q)} de S/ ${q}. Pero se piden las maneras de pagar.`),
      ],
      solucion: [[`Con cada cantidad de S/ `, Ev(q), `, lo que falta tiene que ser múltiplo de ${p}.`], [`Sirven ${ps.map(([x, y]) => `(${x}, ${y})`).join(', ')}: son `, Bv(n), ' maneras.']],
      _datos: { p, q, c },
    };
  }

  function menosMonedas(rng) {
    const c = rng.entero(21, 69), ps = pagos(2, 5, c), ns = ps.map(([x, y]) => x + y);
    if (ps.length < 3) return null;
    const min = Math.min(...ns), max = Math.max(...ns), orden = [...new Set(ns)].sort((a, b) => a - b), best = ps[ns.indexOf(min)];
    return {
      enunciado: [`Un cliente paga S/ ${c} justos con monedas de S/ `, Ev(2), ' y de S/ ', Ev(5), '.'],
      pregunta: ['¿Cuál es la menor cantidad de monedas que puede usar?'],
      datos: [D.ec(2, 5, c), D.xy('monedas de S/ 2', 'monedas de S/ 5')],
      correcta: min,
      errores: [
        h('AT-DIOF-MAXIMO', max, 'Bien que pague justo. Pero esa es la manera con más monedas.'),
        h('AT-DIOF-PRIMERA', orden[1], 'Bien que pague justo. Pero con más monedas de S/ 5 se usan menos en total.'),
        h('AT-DIOF-DIVIDE', Math.floor(c / 5), `Bien usar muchas de S/ 5. Pero ${Math.floor(c / 5)} de S/ 5 no pagan justo: falta completar.`),
      ],
      solucion: [[`Las maneras: ${ps.map(([x, y]) => `(${x}, ${y})`).join(', ')}.`], [`La de más monedas de S/ 5 usa menos: ${best[0]} + ${best[1]} = `, Bv(min), '.']],
      _datos: { c },
    };
  }

  function articulos(rng) {
    const [p, q] = rng.elegir([[3, 7], [4, 7], [3, 5], [4, 9], [5, 7], [3, 8], [5, 8]]), c = rng.entero(40, 99);
    const ps = pagos(p, q, c).filter(([x, y]) => x && y);
    if (ps.length < 2) return null;
    const ult = ps[ps.length - 1], pri = ps[0];
    return {
      enunciado: [`Rosa gasta justo S/ ${c} en bolsas de S/ `, Ev(p), ' y cajas de S/ ', Ev(q), ', y lleva al menos una de cada una.'],
      pregunta: ['Si compra la mayor cantidad posible de cajas, ¿cuántas bolsas lleva?'],
      datos: [D.ec(p, q, c, true), D.xy('las bolsas', 'las cajas')],
      correcta: ult[0],
      errores: [
        h('AT-DIOF-PRIMERA', pri[0], `Bien una compra que gasta justo. Pero lleva ${pri[1] === 1 ? '1 caja' : `${pri[1]} cajas`}; se piden las más cajas posibles.`),
        h('AT-RESPONDE-OTRA', ult[1], 'Bien la compra. Pero ese número son las cajas; se piden las bolsas.'),
        h('AT-DIOF-DIVIDE', Math.floor(c / q), `Bien: caben ${Math.floor(c / q)} cajas. Pero lo que sobra no se completa con bolsas.`),
        h('AT-RESPONDE-OTRA', ult[0] + ult[1], 'Bien la compra. Pero esas son bolsas y cajas juntas.'),
      ],
      solucion: [[`Las compras con las dos: ${ps.map(([x, y]) => `(${x}, ${y})`).join(', ')}.`], [`La de más cajas: ${ult[1]} cajas y `, Bv(ult[0]), ' bolsas.']],
      _datos: { p, q, c },
    };
  }

  const CONSTRUIR = {
    'es-multiplo': esMultiplo, 'cuantos-hasta': cuantosHasta, tramo, razon,
    suma, veces, faltan, expresion, triple,
    'nueve-tres': nueveTres, ultimas, 'cifra-9': cifra9, ocultas,
    primeros, 'resto-potencia': restoPotencia, 'ultima-cifra': ultimaCifra, dia, 'potencia-mas': potenciaMas,
    once, siete, 'boleto-11': boleto11, 'oculta-7-13': oculta713,
    completar, maneras, 'menos-monedas': menosMonedas, articulos,
  };

  return { id: ID, titulo: 'El puesto de los restos', generar, TIPOS_POR_IDEA, TIPOS_POR_UNIDAD, NIVEL };
});
