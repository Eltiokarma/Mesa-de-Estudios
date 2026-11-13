/*
 * Generador: tanto por ciento, razones y conjuntos en problemas de planteo.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['porcentajes-planteo']) y en Node (require). No usa ningún motor.
 *
 * Tipos (entre paréntesis, el «falta» de las filas que cubre, en abstracto):
 *   dimensiones   (sub volumen | area) las medidas de una caja o de un terreno cambian en
 *                 porcentajes y fracciones; se pide la variación porcentual del volumen o del área
 *                 (variación porcentual de un producto de varias dimensiones)
 *   partes        (sub del-total | de-los-otros) varios aportes dados en fracción, porcentaje y
 *                 decimal del mismo precio; se pide el porcentaje que pone el último, del total o de
 *                 lo que pusieron los demás (convertir fracciones y decimales a porcentaje del mismo total)
 *   sistema       dos artículos con descuentos distintos; con los descuentos cruzados el total
 *                 cambia; se pide un precio de lista (porcentajes combinados con un sistema lineal)
 *   tramos        (sub partes) se vende un lote por partes (una fracción, una fracción del resto y el
 *                 resto) con ganancias o pérdidas sobre el costo; se pide el costo del lote
 *                 (ganancias y pérdidas porcentuales sobre el costo por partes vendidas);
 *                 (sub venta-costo) ganancia como porcentaje de la venta contra del costo
 *   encadenados   tres cantidades ligadas por porcentajes encadenados y una diferencia; se venden
 *                 porcentajes de cada una; se pide lo que queda (porcentajes encadenados entre
 *                 cantidades distintas y ventas parciales)
 *   doble-entrada (sub tabla) porcentajes de un grupo y de un subgrupo; se pide el porcentaje dentro
 *                 de otro subgrupo (porcentajes de subgrupos en tablas de doble entrada);
 *                 (sub carroll) porcentajes periódicos (33,333… %) de sexo y síntoma; se pide una
 *                 casilla (diagramas de Carroll con datos en porcentajes periódicos)
 *   sobrante      dos jarras iguales en litros, se sirve un porcentaje de cada una; con lo que sobra
 *                 se llenan vasos en mL o cm³ (porcentajes sobrantes con conversión de unidades de volumen)
 *   extracciones  (sub juntar) se saca el mismo volumen de dos mezclas con razones distintas y se
 *                 juntan; se pide la razón de la mezcla (extracciones de mezclas manteniendo la razón);
 *                 (sub sucesivas) se saca una fracción y se repone con agua n veces: queda V·(1 − f)ⁿ
 *   afin          costo fijo más costo por hora, km o m³; dos datos y se pide un tercero
 *                 (distinguir relación afín de proporcionalidad directa)
 *   llegadas      (sub parejas) la razón de varones a mujeres cambia al retirarse k parejas; se pide
 *                 el total inicial; (sub sucesivas) llegan mujeres y luego se van parejas, con las dos
 *                 razones; se pide un grupo inicial (razones que cambian por llegadas y salidas sucesivas)
 *   conjuntos     tres conjuntos con inclusiones y disjunciones dadas; se simplifica una expresión
 *                 (respuesta de texto con armarTexto; clave = regiones del diagrama que ocupa)
 *                 (simplificar expresiones de conjuntos usando inclusiones y disjunción)
 *
 * Todo se calcula con fracciones exactas (P.frac). Errores: los códigos AR del informe
 * docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md cuando el error es ese; el resto, hipótesis.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'porcentajes-planteo';
  const INF = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const RESP = { AR1: 'parcial', AR3: 'parcial', AR4: 'parcial', AR5: 'hipotesis', AR6: 'parcial', AR7: 'parcial', AR15: 'parcial' };
  // Error con nombre: si el id empieza con un código del informe, toma su respaldo y la fuente.
  function E(id, valor, explicacion, respaldo) {
    const cod = (id.match(/^(AR\d+)/) || [])[1];
    return { id, valor, explicacion, respaldo: respaldo || (cod ? RESP[cod] : 'hipotesis'), fuente: cod ? INF : null };
  }
  const v = P.v;
  const f = (x, d = 2) => P.formatear(x, d);
  // Soles con dos decimales cuando no es entero: «S/ 42,50».
  const soles = x => (Math.abs(x - Math.round(x)) < 1e-9 ? `S/ ${f(x)}` : `S/ ${f(x).replace(/,(\d)$/, ',$10')}`);
  const pc = x => `${f(x)} %`;

  // ---------- fracciones exactas ----------
  const Q = (n, d = 1) => P.frac(n, d);
  const sum = (...xs) => xs.reduce((a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d), Q(0));
  const res = (a, b) => Q(a.n * b.d - b.n * a.d, a.d * b.d);
  const mul = (...xs) => xs.reduce((a, b) => Q(a.n * b.n, a.d * b.d), Q(1));
  const div = (a, b) => Q(a.n * b.d, a.d * b.n);
  const val = q => q.n / q.d;
  const cien = q => mul(q, Q(100));
  const dec2 = q => (q.n * 100) % q.d === 0;                 // se escribe exacto con 2 decimales
  const entero = q => q.d === 1;
  const ftxt = q => P.textoFraccion(q);
  // Número exacto a lo más con 2 decimales (para los distractores: misma forma que la correcta).
  const corto = x => Number.isFinite(x) && x > 0 && Math.abs(x * 100 - Math.round(x * 100)) < 1e-7 && x < 1e7;

  // Porcentaje que puede ser periódico: «41,666… %» (el bloque que se repite, escrito varias veces).
  function pctPeriodico(q) {
    const x = cien(q);
    const ent = Math.floor(x.n / x.d);
    let r = x.n % x.d;
    if (r === 0) return `${f(ent)} %`;
    const cifras = [], vistos = new Map();
    while (r !== 0 && !vistos.has(r)) { vistos.set(r, cifras.length); r *= 10; cifras.push(Math.floor(r / x.d)); r %= x.d; }
    if (r === 0) return `${f(ent)},${cifras.join('')} %`;
    const i = vistos.get(r);
    const bloque = cifras.slice(i).join('');
    return `${f(ent)},${cifras.slice(0, i).join('')}${bloque.repeat(bloque.length === 1 ? 3 : 2)}… %`;
  }

  const SUBS = { dimensiones: ['volumen', 'volumen', 'area'], partes: ['del-total', 'de-los-otros'], tramos: ['partes', 'partes', 'venta-costo'],
    'doble-entrada': ['tabla', 'carroll'], extracciones: ['juntar', 'sucesivas'], llegadas: ['parejas', 'sucesivas'] };
  const TIPOS = ['dimensiones', 'partes', 'sistema', 'tramos', 'encadenados', 'doble-entrada', 'sobrante', 'extracciones', 'afin', 'llegadas', 'conjuntos'];

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(TIPOS);
    const sub = SUBS[tipo] ? rng.elegir(SUBS[tipo]) : null;
    for (let intento = 0; intento < 20000; intento++) {
      const pr = construir(rng, semilla, tipo, sub);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo, sub) {
    switch (tipo) {
      case 'dimensiones': return dimensiones(rng, semilla, sub);
      case 'partes': return partes(rng, semilla, sub);
      case 'sistema': return sistema(rng, semilla);
      case 'tramos': return tramos(rng, semilla, sub);
      case 'encadenados': return encadenados(rng, semilla);
      case 'doble-entrada': return dobleEntrada(rng, semilla, sub);
      case 'sobrante': return sobrante(rng, semilla);
      case 'extracciones': return extracciones(rng, semilla, sub);
      case 'afin': return afin(rng, semilla);
      case 'llegadas': return llegadas(rng, semilla, sub);
      default: return conjuntos(rng, semilla);
    }
  }

  function cerrar(rng, semilla, o) {
    const ok = o.enteros ? (x => Number.isInteger(x) && x > 0) : o.negativos ? Number.isFinite : corto;
    const errores = o.errores.filter(e => ok(e.valor));
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.texto, negativos: !!o.negativos });
    return {
      id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad }, _datos: o.datos,
    };
  }

  // ======================= dimensiones =======================
  const CAMBIOS = [
    { p: 10 }, { p: 20 }, { p: 25 }, { p: 30 }, { p: 40 }, { p: 50 },
    { p: -10 }, { p: -20 }, { p: -25 }, { p: -30 }, { p: -40 },
    { n: 1, d: 4 }, { n: 1, d: 5 }, { n: 1, d: 2 }, { n: 2, d: 5 }, { n: -1, d: 4 }, { n: -1, d: 5 }, { n: -2, d: 5 }, { n: -1, d: 2 },
  ];
  const cambioQ = c => (c.p !== undefined ? Q(c.p, 100) : Q(c.n, c.d));
  const cambioTxt = c => c.p !== undefined
    ? (c.p > 0 ? `aumenta en un ${c.p} %` : `disminuye en un ${-c.p} %`)
    : (c.n > 0 ? `aumenta en ${c.n}/${c.d} de su medida` : `disminuye en ${-c.n}/${c.d} de su medida`);
  const factorTxt = c => (c.p !== undefined ? f(1 + c.p / 100) : `${c.d + c.n}/${c.d}`);
  const variacionTxt = x => (Math.abs(x) < 1e-12 ? 'no varía' : x > 0 ? `aumenta en ${pc(x)}` : `disminuye en ${pc(-x)}`);

  function dimensiones(rng, semilla, sub) {
    const n = sub === 'volumen' ? 3 : 2;
    const idx = rng.barajar(CAMBIOS.map((c, i) => i)).slice(0, n);
    const cs = idx.map(i => CAMBIOS[i]);
    if (!cs.some(c => c.p === undefined) || !cs.some(c => (c.p ?? c.n) < 0) || !cs.some(c => (c.p ?? c.n) > 0)) return null;
    const qs = cs.map(cambioQ);
    const prod = mul(...qs.map(q => sum(Q(1), q)));
    const varQ = cien(res(prod, Q(1)));
    if (val(varQ) === 0 || !dec2(varQ)) return null;
    const correcta = val(varQ);
    const claves = ['L', 'A', 'H'];
    const nombres = sub === 'volumen' ? ['largo', 'ancho', 'alto'] : ['largo', 'ancho'];
    const variables = { X: { nombre: sub === 'volumen' ? 'variación del volumen' : 'variación del área', color: 'd' } };
    const colores = ['o', 'i', 'h'];
    nombres.forEach((nm, i) => { variables[claves[i]] = { nombre: `cambio del ${nm}`, color: colores[i] }; });
    const contexto = sub === 'volumen'
      ? rng.elegir(['Una fábrica de Juliaca cambia el diseño de sus cajas de cartón (con forma de paralelepípedo): ', 'En una caja de madera con forma de paralelepípedo se cambian las medidas: '])
      : rng.elegir(['Se cambia el diseño de un letrero rectangular: ', 'Un terreno rectangular se rediseña: ']);
    const enunciado = [contexto];
    nombres.forEach((nm, i) => {
      enunciado.push(`el ${nm} `, v(claves[i], cambioTxt(cs[i])));
      enunciado.push(i < n - 2 ? ', ' : i === n - 2 ? ' y ' : '.');
    });
    const obj = sub === 'volumen' ? 'el volumen de la caja' : (contexto.includes('letrero') ? 'el área del letrero' : 'el área del terreno');
    const pregunta = ['¿En qué porcentaje varía ', v('X', obj), '?'];
    const sumaVar = val(cien(sum(...qs)));
    const errores = [
      E('AR1-suma-de-variaciones', sumaVar, `Sumaste las variaciones de cada medida. Cada cambio multiplica la medida por un factor, y ${obj} es un producto de medidas: los factores se multiplican.`),
      E('AR4-factor-como-variacion', val(cien(prod)), `Con los cambios, ${obj} queda en el ${pc(val(cien(prod)))} del original; eso no es lo que varía. La variación es ese porcentaje menos el 100 %.`),
      E('AR3-variacion-sobre-el-final', val(div(cien(res(prod, Q(1))), prod)), 'Calculaste la variación tomando como base la medida final. La variación porcentual se mide sobre lo que había al inicio.'),
      E('disminucion-como-aumento', val(cien(res(mul(...qs.map(q => sum(Q(1), Q(Math.abs(q.n), q.d)))), Q(1)))), 'Tomaste las disminuciones como aumentos. Si una medida disminuye, su factor es menor que 1.'),
    ];
    const solucion = [
      ['Cada cambio multiplica la medida por un factor: ', ...nombres.flatMap((nm, i) => [i ? '; ' : '', v(claves[i], `${nm} × ${factorTxt(cs[i])}`)]), '.'],
      [`${obj[0].toUpperCase() + obj.slice(1)} se obtiene multiplicando ${sub === 'volumen' ? 'las tres medidas' : 'las dos medidas'}, así que queda multiplicado por `,
        nombres.map((nm, i) => factorTxt(cs[i])).join(' × '), ` = ${f(val(prod), 4)}.`],
      [`${f(val(prod), 4)} es el ${pc(val(cien(prod)))} del original: `, v('X', `${obj} ${variacionTxt(correcta)}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, negativos: true, texto: variacionTxt, unidad: '%', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'dimensiones', sub, cambios: cs.map(c => (c.p !== undefined ? { p: c.p } : { n: c.n, d: c.d })) } });
  }

  // ======================= partes =======================
  const NOMBRES = ['Ana', 'Beto', 'Carla', 'Dante', 'Elsa', 'Fito', 'Gina', 'Hugo', 'Rosa', 'Iván'];
  function partes(rng, semilla, sub) {
    const total = rng.elegir([1200, 1500, 1800, 2000, 2400, 3000, 3600, 4000, 4800, 6000]);
    const [an, ad] = rng.elegir([[1, 4], [1, 5], [1, 8], [1, 10], [3, 10], [2, 5], [3, 20], [1, 2]]);
    const bp = rng.elegir([10, 15, 20, 25, 30, 35, 40]);
    const cc = rng.elegir([5, 10, 12, 15, 20, 25, 30, 35]);
    const a = Q(an, ad), b = Q(bp, 100), c = Q(cc, 100);
    const r = res(Q(1), sum(a, b, c));
    if (val(r) < 0.1) return null;
    if (![a, b, c, r].every(q => entero(mul(q, Q(total))))) return null;
    const [n1, n2, n3, n4] = rng.barajar(NOMBRES).slice(0, 4);
    const obj = rng.elegir(['una laptop para el negocio familiar', 'una refrigeradora para la casa', 'una cocina para el comedor del barrio', 'una impresora para la librería']);
    const variables = { T: { nombre: 'precio total', color: 'o' }, O: { nombre: 'lo que ponen los otros tres', color: 'i' }, C: { nombre: `lo que pone ${n4}`, color: 'h' }, X: { nombre: 'porcentaje pedido', color: 'd' } };
    const ctxt = `0,${String(cc).padStart(2, '0')}`.replace(/0$/, '');
    const enunciado = [`Entre cuatro familiares compran ${obj}, que cuesta `, v('T', soles(total)), `. ${n1} pone ${an}/${ad} del precio; ${n2}, el ${bp} % del precio; y ${n3}, ${ctxt} del precio. ${n4} pone lo que falta.`];
    const seq = mul(res(Q(1), a), res(Q(1), b), res(Q(1), c));
    const literal = res(Q(1), sum(a, b, Q(cc, 10000)));
    let correcta, errores, pregunta, ultimo;
    if (sub === 'del-total') {
      correcta = val(cien(r));
      if (!dec2(cien(r))) return null;
      pregunta = ['¿Qué ', v('X', 'porcentaje del precio'), ' pone ', v('C', n4), '?'];
      errores = [
        E('AR3-cada-parte-sobre-el-resto', val(cien(seq)), 'Tomaste cada aporte sobre lo que faltaba pagar. El enunciado dice que cada aporte es parte del precio total: se suman y se restan del 100 %.'),
        E('decimal-como-porcentaje', val(cien(literal)), `Leíste ${ctxt} como ${ctxt} %. ${ctxt} del precio es ${f(cc)} centésimos del precio: el ${cc} %.`),
        E('AR5-lo-que-ponen-los-otros', val(cien(sum(a, b, c))), `Ese es el porcentaje que ponen entre ${n1}, ${n2} y ${n3}. La pregunta es por lo que pone ${n4}.`),
        E('AR3-ultima-parte-sobre-el-resto', val(cien(mul(res(Q(1), sum(a, b)), res(Q(1), c)))), `Tomaste lo de ${n3} sobre lo que faltaba después de ${n1} y ${n2}. Su aporte es ${ctxt} del precio total.`),
      ];
      ultimo = [v('C', n4), ' pone 100 % − ', `${pc(val(cien(sum(a, b, c))))} = `, v('X', pc(correcta)), ` del precio (`, v('C', soles(val(mul(r, Q(total))))), ').'];
    } else {
      const q = div(r, res(Q(1), r));
      if (!dec2(cien(q))) return null;
      correcta = val(cien(q));
      pregunta = ['Lo que pone ', v('C', n4), ', ¿qué ', v('X', 'porcentaje'), ' es de ', v('O', 'lo que pusieron entre los otros tres'), '?'];
      errores = [
        E('AR3-base-el-precio-total', val(cien(r)), `Ese es el porcentaje del precio total. La pregunta toma como base lo que pusieron entre los otros tres (${soles(val(mul(res(Q(1), r), Q(total))))}).`),
        E('razon-invertida', val(cien(div(res(Q(1), r), r))), `Dividiste al revés: eso es lo de los otros tres como porcentaje de lo de ${n4}.`),
        E('AR3-cada-parte-sobre-el-resto', val(cien(div(seq, res(Q(1), seq)))), 'Tomaste cada aporte sobre lo que faltaba pagar. Cada aporte es parte del precio total.'),
        E('decimal-como-porcentaje', val(cien(div(literal, res(Q(1), literal)))), `Leíste ${ctxt} como ${ctxt} %. ${ctxt} del precio es el ${cc} % del precio.`),
      ];
      ultimo = [v('C', soles(val(mul(r, Q(total))))), ' de ', v('O', soles(val(mul(res(Q(1), r), Q(total))))), ': ', `${f(val(mul(r, Q(total))))}/${f(val(mul(res(Q(1), r), Q(total))))} × 100 % = `, v('X', pc(correcta)), '.'];
    }
    if ([val(cien(a)), bp, cc].some(x => Math.abs(x - correcta) < 1e-9)) return null;   // que no coincida con otro aporte
    const solucion = [
      [`Todo como porcentaje del precio: ${an}/${ad} = ${pc(val(cien(a)))}; ${bp} %; ${ctxt} = ${cc} %.`],
      [`Entre ${n1}, ${n2} y ${n3}: ${pc(val(cien(a)))} + ${bp} % + ${cc} % = `, v('O', pc(val(cien(sum(a, b, c))))), ' del precio, es decir, ', v('O', soles(val(mul(sum(a, b, c), Q(total))))), '.'],
      ultimo,
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: pc, unidad: '%', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'partes', sub, total, a: [an, ad], b: bp, c: cc } });
  }

  // ======================= sistema =======================
  const PARES = [['una mochila', 'una casaca', 'la mochila', 'la casaca'], ['una licuadora', 'una plancha', 'la licuadora', 'la plancha'],
    ['un polo', 'un pantalón', 'el polo', 'el pantalón'], ['una olla', 'una sartén', 'la olla', 'la sartén'], ['un buzo', 'unas zapatillas', 'el buzo', 'las zapatillas']];
  function sistema(rng, semilla) {
    const [u1, u2, d1, d2] = rng.elegir(PARES);
    const m = 10 * rng.entero(4, 30), c = 10 * rng.entero(4, 30);
    const [ap, bp] = rng.barajar([10, 15, 20, 25, 30, 40]).slice(0, 2);
    if (m === c) return null;
    const a = Q(ap, 100), b = Q(bp, 100);
    const T1 = sum(mul(Q(m), res(Q(1), a)), mul(Q(c), res(Q(1), b)));
    const T2 = sum(mul(Q(m), res(Q(1), b)), mul(Q(c), res(Q(1), a)));
    if (!entero(T1) || !entero(T2)) return null;
    const pideSegundo = rng.moneda();
    const x = pideSegundo ? c : m, y = pideSegundo ? m : c;
    const dx = pideSegundo ? d2 : d1;
    const al = x => (x.startsWith('el ') ? 'al ' + x.slice(3) : 'a ' + x), del = x => (x.startsWith('el ') ? 'del ' + x.slice(3) : 'de ' + x);
    const variables = { A: { nombre: 'primer total', color: 'o' }, B: { nombre: 'segundo total', color: 'i' }, S: { nombre: 'suma de precios de lista', color: 'h' }, X: { nombre: `precio de lista ${del(dx)}`, color: 'd' } };
    const enunciado = [`En una tienda de Huancayo, si a ${u1} se le descuenta el ${ap} % y a ${u2} el ${bp} %, por los dos artículos se paga `, v('A', soles(val(T1))),
      `. Si los descuentos se cambian (${ap} % ${al(d2)} y ${bp} % ${al(d1)}), por los dos se paga `, v('B', soles(val(T2))), '.'];
    const pregunta = ['¿Cuál es el ', v('X', `precio de lista ${del(dx)}`), '?'];
    // a·m + b·c = T1, b·m + a·c = T2 con a y b como factores (error AR4).
    const det = res(mul(a, a), mul(b, b));
    const cF = div(res(mul(a, T2), mul(b, T1)), det), mF = div(res(mul(a, T1), mul(b, T2)), det);
    const errores = [
      E('AR5-el-otro-precio', y, `Ese es el precio de lista del otro artículo. La pregunta es por ${dx}.`),
      E('AR5-suma-de-precios', m + c, `Esa es la suma de los dos precios de lista. Falta separar: con la resta de las dos ecuaciones sale la diferencia de precios.`),
      E('AR5-precio-con-descuento', val(mul(Q(x), res(Q(1), pideSegundo ? b : a))), `Eso es lo que se paga por ${dx} con el descuento de la primera oferta. Se pide el precio de lista, antes de descontar.`),
      E('AR4-descuento-como-factor', val(pideSegundo ? cF : mF), `Multiplicaste cada precio por el porcentaje de descuento (${f(ap / 100)} y ${f(bp / 100)}). Lo que se paga es lo que queda: ${f(1 - ap / 100)} y ${f(1 - bp / 100)}.`),
    ];
    const S = (val(T1) + val(T2)) / (2 - (ap + bp) / 100);
    const D = (val(T1) - val(T2)) / ((bp - ap) / 100);
    const p1 = d1[0].toUpperCase() + d1.slice(1);
    const solucion = [
      [`Sea x el precio de lista ${del(d1)} e y el ${del(d2)}: `, v('A', `${f(1 - ap / 100)}x + ${f(1 - bp / 100)}y = ${f(val(T1))}`), ' y ', v('B', `${f(1 - bp / 100)}x + ${f(1 - ap / 100)}y = ${f(val(T2))}`), '.'],
      ['Sumando: ', `${f(2 - (ap + bp) / 100)}(x + y) = ${f(val(T1) + val(T2))}, así que `, v('S', `x + y = ${f(S)}`), '.'],
      ['Restando: ', `${f((bp - ap) / 100)}(x − y) = ${f(val(T1) - val(T2))}, así que x − y = ${f(D)}.`],
      [pideSegundo ? `y = (${f(S)} ${D >= 0 ? '−' : '+'} ${f(Math.abs(D))})/2 = ` : `x = (${f(S)} ${D >= 0 ? '+' : '−'} ${f(Math.abs(D))})/2 = `, v('X', soles(x)), `. (${p1}: ${soles(m)}; ${d2}: ${soles(c)}.)`],
    ];
    return cerrar(rng, semilla, { correcta: x, errores, texto: soles, unidad: 'soles', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'sistema', a: ap, b: bp, T1: val(T1), T2: val(T2), pideSegundo } });
  }

  // ======================= tramos =======================
  function tramos(rng, semilla, sub) {
    if (sub === 'venta-costo') return ventaCosto(rng, semilla);
    const C = rng.elegir([1200, 1500, 1800, 2400, 3000, 3600, 4000, 4800, 6000]);
    const [f1n, f1d] = rng.elegir([[1, 3], [1, 4], [2, 5], [1, 2], [1, 5], [3, 8]]);
    const [f2n, f2d] = rng.elegir([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]]);
    const RT = [-20, -15, -10, -5, 10, 15, 20, 25, 30, 40];
    const rs = [rng.elegir(RT), rng.elegir(RT), rng.elegir(RT)];
    if (!rs.some(r => r < 0) || !rs.some(r => r > 0)) return null;
    const f1 = Q(f1n, f1d), f2 = Q(f2n, f2d);
    if (val(sum(f1, f2)) >= 1) return null;           // así «f2 del resto» y «f2 del lote» dan cosas distintas
    const ps = [f1, mul(res(Q(1), f1), f2), mul(res(Q(1), f1), res(Q(1), f2))];
    if (!ps.every(p => entero(mul(p, Q(C))))) return null;
    const g = sum(...ps.map((p, i) => mul(p, Q(rs[i], 100))));
    const G = mul(g, Q(C));
    if (val(g) <= 0 || !entero(G)) return null;
    const prod = rng.elegir(['polos', 'casacas', 'mochilas', 'chompas de alpaca', 'pelotas']);
    const variables = { G: { nombre: 'ganancia total', color: 'o' }, R: { nombre: 'lo que le quedaba', color: 'i' }, X: { nombre: 'costo del lote', color: 'd' } };
    const gp = r => (r > 0 ? `ganando el ${r} %` : `perdiendo el ${-r} %`);
    const enunciado = [`Un comerciante compra un lote de ${prod}. Vende ${f1n}/${f1d} del lote ${gp(rs[0])}; luego vende ${f2n}/${f2d} de `, v('R', 'lo que le quedaba'), ` ${gp(rs[1])}, y el resto ${gp(rs[2])}. Cada porcentaje es sobre lo que le costó esa parte. En total gana `, v('G', soles(val(G))), '.'];
    const pregunta = ['¿Cuánto le costó ', v('X', 'el lote'), '?'];
    const Gv = val(G);
    const errores = [];
    const p3b = res(Q(1), sum(f1, f2));
    if (val(p3b) > 0) {
      const gb = sum(mul(f1, Q(rs[0], 100)), mul(f2, Q(rs[1], 100)), mul(p3b, Q(rs[2], 100)));
      if (val(gb) > 0) errores.push(E('AR3-fraccion-del-resto-sobre-el-total', Gv / val(gb), `Tomaste ${f2n}/${f2d} del lote entero. Es ${f2n}/${f2d} de lo que quedaba después de la primera venta: ${f2n}/${f2d} × ${ftxt(res(Q(1), f1))} = ${ftxt(ps[1])} del lote.`));
    }
    if (rs.every(r => r < 100)) {
      const gv = sum(...ps.map((p, i) => mul(p, Q(rs[i], 100 - rs[i]))));
      if (val(gv) > 0) errores.push(E('AR3-ganancia-sobre-la-venta', Gv / val(gv), 'Tomaste los porcentajes sobre el precio de venta. El enunciado los pone sobre el costo de cada parte.'));
    }
    const prom = (rs[0] + rs[1] + rs[2]) / 300;
    if (prom > 0) errores.push(E('AR15-promedio-de-porcentajes', Gv / prom, 'Promediaste los tres porcentajes como si cada uno pesara lo mismo. Cada porcentaje se aplica a una parte distinta del lote: hay que ponderar por el tamaño de cada parte.'));
    errores.push(E('AR5-costo-mas-ganancia', C + Gv, 'Eso es lo que recibió por todas las ventas (costo más ganancia). Se pide lo que le costó el lote.'));
    errores.push(E('perdida-como-ganancia', Gv / val(sum(...ps.map((p, i) => mul(p, Q(Math.abs(rs[i]), 100))))), 'Contaste la pérdida como si fuera ganancia. Lo que se pierde se resta.'));
    const parteTxt = i => `${ftxt(ps[i])} × ${rs[i] > 0 ? '' : '(−'}${Math.abs(rs[i])} %${rs[i] > 0 ? '' : ')'}`;
    const solucion = [
      [`Las partes del lote: ${ftxt(f1)}; luego ${f2n}/${f2d} de `, v('R', ftxt(res(Q(1), f1))), ` = ${ftxt(ps[1])}; y el resto, ${ftxt(ps[2])}.`],
      [`Ganancia como fracción del costo: ${[0, 1, 2].map(parteTxt).join(' + ')} = ${ftxt(g)} del costo.`],
      ['Si el costo es C: ', `${ftxt(g)} · C = `, v('G', soles(Gv)), ', así que C = ', v('X', soles(C)), '.'],
    ];
    return cerrar(rng, semilla, { correcta: C, errores, texto: soles, unidad: 'soles', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'tramos', sub, f1: [f1n, f1d], f2: [f2n, f2d], r: rs, G: Gv } });
  }

  function ventaCosto(rng, semilla) {
    const dir = rng.elegir(['venta-a-costo', 'costo-a-venta']);
    const prod = rng.elegir(['relojes', 'audífonos', 'termos', 'cuadernos', 'cargadores']);
    const variables = { r: { nombre: 'porcentaje dado', color: 'o' }, X: { nombre: 'porcentaje pedido', color: 'd' } };
    let correcta, errores, enunciado, pregunta, solucion, r;
    if (dir === 'venta-a-costo') {
      r = rng.elegir([20, 36, 60, 75, 80]);
      const venta = 100 * rng.entero(1, 6);
      const gan = venta * r / 100, costo = venta - gan;
      correcta = val(Q(100 * r, 100 - r));
      enunciado = [`Una tienda vende ${prod} a ${soles(venta)} cada uno y en cada venta gana el `, v('r', `${r} % del precio de venta`), '.'];
      pregunta = ['¿Qué ', v('X', 'porcentaje del precio de costo'), ' gana?'];
      errores = [
        E('AR3-misma-base', r, 'Dejaste el mismo porcentaje, pero cambió la base. La ganancia es la misma cantidad de soles; comparada con el costo, que es menor que la venta, es un porcentaje mayor.'),
        E('AR4-costo-como-porcentaje', 100 - r, `El costo es el ${100 - r} % de la venta; eso no es la ganancia. Se pide la ganancia como porcentaje del costo.`),
        E('base-sumada', val(Q(100 * r, 100 + r)), `Dividiste ${r} entre ${100 + r}. El costo no es el ${100 + r} % de la venta: es la venta menos la ganancia, el ${100 - r} %.`),
        E('AR4-venta-como-porcentaje', val(Q(10000, 100 - r)), 'Ese es el precio de venta como porcentaje del costo. La ganancia es eso menos el 100 %.'),
      ];
      solucion = [
        ['Ganancia: ', v('r', `${r} %`), ` de ${soles(venta)} = ${soles(gan)}. Costo: ${soles(venta)} − ${soles(gan)} = ${soles(costo)}.`],
        [`Sobre el costo: ${f(gan)}/${f(costo)} × 100 % = `, v('X', pc(correcta)), '.'],
      ];
    } else {
      r = rng.elegir([25, 60, 150]);
      const costo = 20 * rng.entero(1, 10);
      const gan = costo * r / 100, venta = costo + gan;
      correcta = val(Q(100 * r, 100 + r));
      enunciado = [`Un comerciante compra ${prod} a ${soles(costo)} cada uno y los vende ganando el `, v('r', `${r} % del costo`), '.'];
      pregunta = ['¿Qué ', v('X', 'porcentaje del precio de venta'), ' es su ganancia?'];
      errores = [
        E('AR3-misma-base', r, 'Dejaste el mismo porcentaje, pero cambió la base. La venta es mayor que el costo: la misma ganancia es un porcentaje menor de la venta.'),
        E('AR4-venta-como-porcentaje', 100 + r, `La venta es el ${100 + r} % del costo; eso no es la ganancia.`),
        ...(r < 100 ? [E('base-restada', val(Q(100 * r, 100 - r)), `Dividiste ${r} entre ${100 - r}. La venta es el costo más la ganancia: el ${100 + r} % del costo.`)] : []),
        E('AR4-costo-como-porcentaje', val(Q(10000, 100 + r)), 'Ese es el costo como porcentaje de la venta. La ganancia es el 100 % menos eso.'),
      ];
      solucion = [
        ['Ganancia: ', v('r', `${r} %`), ` de ${soles(costo)} = ${soles(gan)}. Venta: ${soles(costo)} + ${soles(gan)} = ${soles(venta)}.`],
        [`Sobre la venta: ${f(gan)}/${f(venta)} × 100 % = `, v('X', pc(correcta)), '.'],
      ];
    }
    return cerrar(rng, semilla, { correcta, errores, texto: pc, unidad: '%', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'tramos', sub: 'venta-costo', dir, r } });
  }

  // ======================= encadenados =======================
  function encadenados(rng, semilla) {
    const p = rng.elegir([80, 75, 60, 50, 40]), q = rng.elegir([50, 75, 80, 60, 40, 25]);
    const A = 20 * rng.entero(5, 40);
    const B = Q(A * p, 100), Cf = mul(B, Q(q, 100));
    if (!entero(B) || !entero(Cf)) return null;
    const D = A - val(Cf);
    const s = [rng.elegir([10, 20, 25, 40, 50]), rng.elegir([10, 20, 25, 40, 50]), rng.elegir([10, 20, 25, 40, 50])];
    const quedan = (a, b, c) => a * (1 - s[0] / 100) + b * (1 - s[1] / 100) + c * (1 - s[2] / 100);
    const R = quedan(A, val(B), val(Cf));
    if (!corto(R) || Math.abs(R - Math.round(R)) > 1e-9) return null;
    const variables = { A: { nombre: 'arroz', color: 'o' }, B: { nombre: 'azúcar', color: 'i' }, C: { nombre: 'fideos', color: 'h' }, X: { nombre: 'lo que queda', color: 'd' } };
    const enunciado = ['En una bodega de Juliaca, la cantidad de ', v('B', 'azúcar'), ` es el ${p} % de la de `, v('A', 'arroz'), ', y la de ', v('C', 'fideos'), ` es el ${q} % de la de `, v('B', 'azúcar'), '. Hay ',
      `${f(D)} kg más de `, v('A', 'arroz'), ' que de ', v('C', 'fideos'), `. En la semana se vende el ${s[0]} % del arroz, el ${s[1]} % del azúcar y el ${s[2]} % de los fideos.`];
    const pregunta = ['¿Cuántos kilogramos ', v('X', 'quedan en total'), ' de los tres productos?'];
    const pq = p * q / 10000;
    const A1 = D / (1 - q / 100), A2 = D / (1 - p / 100);
    const errores = [
      E('AR3-encadenado-sobre-la-misma-base', quedan(A1, A1 * p / 100, A1 * q / 100), `Tomaste el ${q} % sobre el arroz. Los fideos son el ${q} % del azúcar, que ya es el ${p} % del arroz: los fideos son el ${f(100 * pq)} % del arroz.`),
      E('diferencia-con-el-azucar', quedan(A2, A2 * p / 100, A2 * pq), `Usaste los ${f(D)} kg como si fueran la diferencia entre el arroz y el azúcar. Son la diferencia entre el arroz y los fideos.`),
      E('AR4-lo-vendido', A + val(B) + val(Cf) - R, 'Eso es lo que se vendió. La pregunta es por lo que queda.'),
      E('AR15-promedio-de-porcentajes', (A + val(B) + val(Cf)) * (1 - (s[0] + s[1] + s[2]) / 300), 'Promediaste los porcentajes vendidos y los aplicaste al total. Cada porcentaje es de un producto distinto, con cantidades distintas.'),
    ];
    const solucion = [
      ['Con el arroz como base: ', v('B', `azúcar = ${f(p / 100)}·arroz`), '; ', v('C', `fideos = ${f(q / 100)} · ${f(p / 100)}·arroz = ${f(pq, 4)}·arroz`), '.'],
      [`La diferencia: arroz − ${f(pq, 4)}·arroz = ${f(1 - pq, 4)}·arroz = ${f(D)} kg, así que `, v('A', `arroz = ${f(A)} kg`), '; ', v('B', `azúcar = ${f(val(B))} kg`), '; ', v('C', `fideos = ${f(val(Cf))} kg`), '.'],
      [`Quedan ${f(A)} × ${f(1 - s[0] / 100)} + ${f(val(B))} × ${f(1 - s[1] / 100)} + ${f(val(Cf))} × ${f(1 - s[2] / 100)} = `, v('X', `${f(R)} kg`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: R, errores, texto: x => `${f(x)} kg`, unidad: 'kg', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'encadenados', p, q, D, s } });
  }

  // ======================= doble entrada =======================
  function dobleEntrada(rng, semilla, sub) {
    return sub === 'tabla' ? tabla(rng, semilla) : carroll(rng, semilla);
  }

  function tabla(rng, semilla) {
    const N = rng.elegir([200, 400, 500, 600, 800, 1000]);
    const p = rng.elegir([20, 25, 30, 40, 60]), q = rng.elegir([20, 25, 40, 50, 60, 75]), vv = rng.elegir([40, 45, 50, 55, 60]);
    const auto = N * p / 100, vAuto = auto * (100 - q) / 100, mAuto = auto - vAuto;
    const varones = N * vv / 100, vNo = varones - vAuto, no = N - auto;
    if (![auto, vAuto, varones].every(Number.isInteger) || vNo <= 0 || vNo >= no) return null;
    const ans = Q(100 * vNo, no);
    if (!dec2(ans)) return null;
    const correcta = val(ans);
    const lugar = rng.elegir(['una empresa de Arequipa', 'una universidad de Cusco', 'un mercado de Lima']);
    const destino = lugar.includes('universidad') ? 'a su trabajo o estudio' : 'a su trabajo';
    const variables = { A: { nombre: 'los que van en auto', color: 'o' }, M: { nombre: 'mujeres entre los que van en auto', color: 'i' }, V: { nombre: 'varones del total', color: 'h' }, X: { nombre: 'porcentaje pedido', color: 'd' } };
    const enunciado = [`En una encuesta a ${N} personas de ${lugar}, el `, v('A', `${p} % va en auto`), ` ${destino}. De los que van en auto, el `, v('M', `${q} % son mujeres`), '. Del total de encuestados, el ', v('V', `${vv} % son varones`), '.'];
    const pregunta = ['De los que no van en auto, ¿qué ', v('X', 'porcentaje son varones'), '?'];
    const errores = [
      E('AR3-sobre-el-total', 100 * vNo / N, `Calculaste los varones que no van en auto como porcentaje de todos los encuestados. La pregunta toma como base solo a los que no van en auto (${no}).`),
      E('AR5-el-otro-grupo', 100 - correcta, 'Ese es el porcentaje de mujeres entre los que no van en auto.'),
      ...(N * q / 100 < auto ? [E('AR3-subgrupo-sobre-el-total', 100 * (varones - (auto - N * q / 100)) / no, `Tomaste el ${q} % de mujeres sobre todos los encuestados. Es el ${q} % de los que van en auto.`)] : []),
      ...(varones <= no ? [E('todos-los-varones-sin-auto', 100 * varones / no, 'Contaste a todos los varones como si ninguno fuera en auto. Primero hay que quitar a los varones que van en auto.')] : []),
    ];
    const solucion = [
      [v('A', `Van en auto: ${p} % de ${N} = ${auto}`), '; de ellos, varones: ', `${100 - q} % de ${auto} = ${vAuto} (`, v('M', `mujeres: ${mAuto}`), ').'],
      [v('V', `Varones en total: ${vv} % de ${N} = ${varones}`), `. Varones que no van en auto: ${varones} − ${vAuto} = ${vNo}.`],
      [`No van en auto: ${N} − ${auto} = ${no}. De ellos son varones ${vNo}/${no} × 100 % = `, v('X', pc(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: pc, unidad: '%', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'doble-entrada', sub: 'tabla', N, p, q, v: vv } });
  }

  function carroll(rng, semilla) {
    const a = Q(...rng.elegir([[1, 3], [2, 3], [5, 12], [7, 12], [4, 9], [5, 9], [3, 8], [5, 8], [1, 2], [2, 5], [3, 5], [7, 18], [11, 18]]));
    const b = Q(...rng.elegir([[1, 3], [2, 3], [1, 6], [5, 6], [1, 4], [3, 4], [1, 2], [1, 9], [2, 9], [1, 5], [2, 5], [1, 12], [5, 12]]));
    const c = Q(...rng.elegir([[1, 3], [1, 6], [2, 9], [5, 12], [1, 4], [3, 8], [5, 18], [1, 9], [7, 18], [1, 5], [3, 10], [1, 12], [7, 36]]));
    if (![a, b, c].some(x => !dec2(cien(x)))) return null;                  // al menos un periódico
    const N = rng.elegir([72, 108, 144, 180, 216, 240, 252, 288, 324, 360, 432, 480, 540]);
    const V = mul(a, Q(N)), Vf = mul(b, V), Tf = mul(c, Q(N));
    if (![V, Vf, Tf].every(entero)) return null;
    const M = N - val(V), Mf = val(Tf) - val(Vf), Ms = M - Mf;
    if (Mf < 1 || Ms < 1) return null;
    const sint = rng.elegir([['fiebre', 'con fiebre', 'sin fiebre'], ['tos', 'con tos', 'sin tos']]);
    const variables = { V: { nombre: 'varones', color: 'o' }, F: { nombre: `varones ${sint[1]}`, color: 'i' }, T: { nombre: `pacientes ${sint[1]}`, color: 'h' }, X: { nombre: `mujeres ${sint[2]}`, color: 'd' } };
    const lugar = rng.elegir(['Puno', 'Juliaca', 'Ayacucho', 'Huaraz']);
    const enunciado = [`En un centro de salud de ${lugar} se atendió a ${N} pacientes en un día. El `, v('V', `${pctPeriodico(a)} eran varones`), '; de los varones, el ', v('F', `${pctPeriodico(b)} llegó ${sint[1]}`),
      '; y del total de pacientes, el ', v('T', `${pctPeriodico(c)} llegó ${sint[1]}`), '.'];
    const pregunta = ['¿Cuántas ', v('X', `mujeres llegaron ${sint[2]}`), '?'];
    const errores = [
      ...(val(mul(b, Q(N))) <= val(Tf) && M - (val(Tf) - val(mul(b, Q(N)))) < M
        ? [E('AR3-subgrupo-sobre-el-total', M - (val(Tf) - val(mul(b, Q(N)))), `Tomaste el ${pctPeriodico(b)} sobre todos los pacientes. Es de los varones: ${ftxt(b)} de ${f(val(V))}.`)] : []),
      E('sin-quitar-a-los-varones', M - val(Tf), `Restaste a las mujeres todos los pacientes ${sint[1]} (${f(val(Tf))}). También hay varones ${sint[1]} (${f(val(Vf))}): a las mujeres solo les tocan ${f(val(Tf))} − ${f(val(Vf))} = ${f(Mf)}.`),
      E('otra-casilla', Mf, `Esas son las mujeres que llegaron ${sint[1]}. Se piden las que llegaron ${sint[2]}.`),
      E('sin-separar-por-sexo', N - val(Tf), `Ese es el total de pacientes ${sint[2]}, varones y mujeres juntos.`),
      E('otra-casilla-varones', val(V) - val(Vf), `Esos son los varones ${sint[2]}. Se piden las mujeres.`),
    ];
    const solucion = [
      ['Pasa cada porcentaje a fracción: ', v('V', `${pctPeriodico(a)} = ${ftxt(a)}`), '; ', v('F', `${pctPeriodico(b)} = ${ftxt(b)}`), '; ', v('T', `${pctPeriodico(c)} = ${ftxt(c)}`), '.'],
      [v('V', `Varones: ${ftxt(a)} de ${N} = ${f(val(V))}`), '; ', v('F', `${sint[1]}: ${ftxt(b)} de ${f(val(V))} = ${f(val(Vf))}`), `. Mujeres: ${N} − ${f(val(V))} = ${f(M)}.`],
      [v('T', `Pacientes ${sint[1]}: ${ftxt(c)} de ${N} = ${f(val(Tf))}`), `; mujeres ${sint[1]}: ${f(val(Tf))} − ${f(val(Vf))} = ${f(Mf)}.`],
      [`Mujeres ${sint[2]}: ${f(M)} − ${f(Mf)} = `, v('X', `${f(Ms)}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: Ms, errores, enteros: true, texto: x => `${f(x)}`, unidad: 'personas', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'doble-entrada', sub: 'carroll', N, a: [a.n, a.d], b: [b.n, b.d], c: [c.n, c.d] } });
  }

  // ======================= sobrante =======================
  function sobrante(rng, semilla) {
    const L = rng.elegir([1.5, 2, 2.5, 3, 4]);
    const s1 = rng.elegir([40, 45, 50, 60, 64, 70, 75, 80, 85, 90]), s2 = rng.elegir([40, 45, 50, 60, 64, 70, 75, 80, 85, 90]);
    const vaso = rng.elegir([150, 200, 250]);
    const cm3 = rng.moneda();
    const ml = L * 1000;
    const sobra = ml * (200 - s1 - s2) / 100;
    if (!Number.isInteger(sobra) || sobra % vaso !== 0 || sobra / vaso < 2) return null;
    const correcta = sobra / vaso;
    const u = cm3 ? 'cm³' : 'mL';
    const bebida = rng.elegir(['chicha morada', 'refresco de maracuyá', 'emoliente', 'limonada']);
    const variables = { L: { nombre: 'volumen de cada jarra', color: 'o' }, S: { nombre: 'lo que sobra', color: 'i' }, W: { nombre: 'volumen de un vaso', color: 'h' }, X: { nombre: 'número de vasos', color: 'd' } };
    const enunciado = [`Para una actuación del colegio se preparan dos jarras iguales de ${bebida}, de `, v('L', `${f(L)} L`), ` cada una. Se sirve el ${s1} % de la primera jarra y el ${s2} % de la segunda. Con `, v('S', 'lo que sobra'), ' se llenan vasos de ', v('W', `${vaso} ${u}`), '.'];
    const pregunta = ['¿Cuántos ', v('X', 'vasos'), ' se llenan por completo?'];
    const vasos = x => Math.floor(x / vaso + 1e-9);
    const errores = [
      E('AR4-lo-servido', vasos(ml * (s1 + s2) / 100), 'Usaste lo que se sirvió. Los vasos se llenan con lo que sobra: el 100 % menos lo servido en cada jarra.'),
      E('litro-como-100-ml', vasos(sobra / 10), `Pasaste los litros multiplicando por 100. Un litro tiene 1000 mL, que son 1000 cm³.`),
      E('una-sola-jarra', vasos(ml * (100 - s1) / 100), 'Contaste solo lo que sobra de la primera jarra. También sobra algo de la segunda.'),
      E('porcentajes-sobre-las-dos', vasos(2 * ml * (100 - Math.max(s1, s2)) / 100), `Aplicaste el ${Math.max(s1, s2)} % a las dos jarras. Cada jarra tiene su propio porcentaje servido.`),
      E('una-jarra-con-lo-servido', vasos(ml * (100 - s2) / 100), 'Contaste solo lo que sobra de la segunda jarra. También sobra algo de la primera.'),
    ];
    const solucion = [
      [`Cada jarra: `, v('L', `${f(L)} L = ${f(ml)} ${u}`), ` (1 L = 1000 ${u}).`],
      ['Sobra el ', `${100 - s1} % de la primera y el ${100 - s2} % de la segunda: `, v('S', `${f(ml)} × ${f((100 - s1) / 100)} + ${f(ml)} × ${f((100 - s2) / 100)} = ${f(sobra)} ${u}`), '.'],
      [v('S', `${f(sobra)} ${u}`), ' ÷ ', v('W', `${vaso} ${u}`), ' = ', v('X', `${correcta} vasos`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, enteros: true, texto: x => `${f(x)}`, unidad: 'vasos', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'sobrante', L, s1, s2, vaso, cm3 } });
  }

  // ======================= extracciones =======================
  const razon = (x, y) => { const q = Q(x, y); return { clave: `razon:${q.n}/${q.d}`, texto: `${q.n} : ${q.d}` }; };
  function extracciones(rng, semilla, sub) {
    if (sub === 'sucesivas') return sucesivas(rng, semilla);
    const RZ = [[3, 2], [1, 3], [2, 3], [1, 4], [3, 1], [4, 1], [2, 1], [1, 2], [3, 5], [5, 3], [1, 1], [4, 5], [5, 1], [7, 3]];
    const [a, b] = rng.elegir(RZ), [c, d] = rng.elegir(RZ);
    if (a + b === c + d || a * d === b * c) return null;
    const E1 = rng.elegir([10, 12, 15, 20, 24, 30, 36, 40]);
    if (E1 % (a + b) || E1 % (c + d)) return null;
    const x = E1 * a / (a + b) + E1 * c / (c + d), y = E1 * b / (a + b) + E1 * d / (c + d);
    const VA = E1 * rng.entero(2, 4), VB = E1 * rng.entero(2, 4);
    const [cosa, comp] = rng.elegir([['jugo concentrado', 'agua'], ['alcohol', 'agua'], ['leche', 'agua'], ['pintura blanca', 'pintura azul']]);
    const variables = { A: { nombre: 'razón del primer recipiente', color: 'o' }, B: { nombre: 'razón del segundo recipiente', color: 'i' }, E: { nombre: 'volumen extraído de cada uno', color: 'h' }, X: { nombre: 'razón de la mezcla', color: 'd' } };
    const enunciado = [`Un primer recipiente tiene ${VA} L de ${cosa} y ${comp} mezclados en la razón `, v('A', `${a} : ${b}`), `, y un segundo recipiente tiene ${VB} L de ${cosa} y ${comp} en la razón `,
      v('B', `${c} : ${d}`), '. Se sacan ', v('E', `${E1} L`), ' de cada recipiente y se juntan en un balde.'];
    const pregunta = [`¿En qué `, v('X', 'razón'), ` están el ${cosa} y el ${comp} en el balde?`];
    const correcta = razon(x, y);
    const H = (id, r, expl) => ({ id, clave: r.clave, texto: r.texto, explicacion: expl, respaldo: 'hipotesis', fuente: null });
    const errores = [
      H('suma-de-terminos-de-razones', razon(a + c, b + d), `Sumaste los términos de las razones (${a} + ${c} y ${b} + ${d}). Las razones no dicen litros: hay que pasar cada una a los litros que salen en los ${E1} L.`),
      H('razon-invertida', razon(y, x), `Esa es la razón de ${comp} a ${cosa}. Se pide ${cosa} a ${comp}.`),
      H('multiplica-razones', razon(a * c, b * d), 'Multiplicaste las razones. Al juntar se suman los litros de cada componente, no se multiplican las razones.'),
      H('volumenes-del-recipiente', razon(VA * a / (a + b) + VB * c / (c + d), VA * b / (a + b) + VB * d / (c + d)), 'Juntaste los recipientes completos. Solo se sacan los mismos litros de cada uno.'),
    ];
    const alternativas = P.armarTexto({ correcta, errores, rng });
    const solucion = [
      [`De los `, v('E', `${E1} L`), ` del primero (razón `, v('A', `${a} : ${b}`), `): ${f(E1 * a / (a + b))} L de ${cosa} y ${f(E1 * b / (a + b))} L de ${comp} (${a}/${a + b} y ${b}/${a + b} de ${E1}).`],
      [`De los `, v('E', `${E1} L`), ` del segundo (razón `, v('B', `${c} : ${d}`), `): ${f(E1 * c / (c + d))} L de ${cosa} y ${f(E1 * d / (c + d))} L de ${comp} (${c}/${c + d} y ${d}/${c + d} de ${E1}).`],
      [`En el balde: ${f(x)} L de ${cosa} y ${f(y)} L de ${comp}; la razón es `, v('X', correcta.texto), '.'],
    ];
    return { id: `${ID}#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta.clave, texto: correcta.texto, unidad: '' }, _datos: { tipo: 'extracciones', sub: 'juntar', a, b, c, d, E: E1, VA, VB } };
  }

  function sucesivas(rng, semilla) {
    const [fn, fd] = rng.elegir([[1, 2], [1, 3], [1, 4], [1, 5], [2, 5], [2, 3], [3, 4]]);
    const n = rng.elegir([2, 3]);
    const k = rng.entero(1, 4);
    const V = k * fd ** n;
    if (V > 400 || V < 20) return null;
    const qn = (fd - fn) ** n, correcta = V * qn / fd ** n;
    const cosa = rng.elegir(['alcohol puro', 'vinagre puro', 'jugo puro de naranja']);
    const variables = { V: { nombre: 'volumen inicial', color: 'o' }, F: { nombre: 'fracción que se saca', color: 'i' }, N: { nombre: 'veces', color: 'h' }, X: { nombre: 'lo que queda de lo puro', color: 'd' } };
    const enunciado = ['Un bidón tiene ', v('V', `${V} L de ${cosa}`), '. Se saca ', v('F', `${fn}/${fd}`), ' de lo que contiene y se completa con agua; luego se repite lo mismo, hasta hacerlo ', v('N', `${n} veces`), ' en total.'];
    const pregunta = ['¿Cuántos litros ', v('X', `de ${cosa.replace(' puro', '').replace(' puro de', ' de')}`), ' quedan en el bidón?'];
    const lineal = V * (1 - n * fn / fd);
    const errores = [
      E('extraccion-lineal', lineal, `Restaste lo mismo cada vez. Desde la segunda, se saca ${fn}/${fd} de una mezcla con agua: sale menos.`, 'parcial'),
      E('AR4-lo-que-se-quita', V - correcta, `Ese es el ${cosa.split(' ')[0]} que se sacó. La pregunta es por lo que queda.`),
      E('una-extraccion-menos', V * (fd - fn) ** (n - 1) / fd ** (n - 1), `Hiciste una extracción menos: el factor ${fd - fn}/${fd} va ${n} veces.`),
      E('AR4-queda-la-fraccion-sacada', V * fn ** n / fd ** n, `Multiplicaste por ${fn}/${fd}, que es lo que se saca. Cada vez queda ${fd - fn}/${fd}.`),
    ];
    // extraccion-lineal: lleva la fuente del informe (ilusión de linealidad, vecina de AR7).
    errores[0].fuente = INF;
    const solucion = [
      ['En cada vez queda ', `${fd - fn}/${fd}`, ` del ${cosa.split(' ')[0]} que había (el agua que entra no lo repone).`],
      [v('V', `${V} L`), ` × (${fd - fn}/${fd})`, v('N', ['', '', '²', '³'][n]), ' = ', `${V} × ${qn}/${fd ** n} = `, v('X', `${f(correcta)} L`), '.'],
    ];
    const p = cerrar(rng, semilla, { correcta, errores, texto: x => `${f(x)} L`, unidad: 'L', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'extracciones', sub: 'sucesivas', V, f: [fn, fd], n } });
    return Object.assign(p, escenaSucesivas({ V, fn, fd, n, correcta, cosa: cosa.split(' ')[0] }, p.alternativas));
  }

  /*
   * Escena viva (docs/escena-viva.md): la barra del bidón que pierde la misma fracción de lo que queda en cada
   * extracción (pieza «barra-porcentaje», sin cambios). Lo puro se responde arrastrando la marca. Los demás
   * tipos de este generador todavía no tienen pieza: siguen con el formato de siempre.
   */
  const ROTULOS_SUC = { 'extraccion-lineal': 'restando igual', 'AR4-lo-que-se-quita': 'lo que salió', 'una-extraccion-menos': 'una vez menos', 'AR4-queda-la-fraccion-sacada': 'lo que se saca' };
  const BONITOS = [0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 5, 10, 20, 25, 50, 100];
  const pasoBonito = tope => BONITOS.reduce((q, b) => (b <= tope + 1e-12 ? b : q), BONITOS[0]);
  function escenaSucesivas({ V, fn, fd, n, correcta, cosa }, alternativas) {
    const pct = 100 * fn / fd, L = x => `${f(x)} L`, fr = `${fn}/${fd}`, queda = `${fd - fn}/${fd}`;
    const tramos = Array.from({ length: n }, () => ({ tipo: 'descuento', pct, color: 'i' }));
    const datos = { total: V, prefijo: '', sufijo: ' L', decimales: 2, color: 'o', tramos, marca: 'queda' };
    const vals = [V]; for (let i = 0; i < n; i++) vals.push(vals[i] * (fd - fn) / fd);
    const pasos = [];
    for (let i = 1; i <= n; i++) pasos.push({ estado: { corte: i },
      texto: i === 1 ? ['Se saca ', v('F', fr), ` del ${cosa}: queda ${queda}.`] : ['Otra vez se saca ', v('F', fr), ', pero de lo que quedó.'],
      ecuacion: [i === 1 ? v('V', L(V)) : L(vals[i - 1]), ` × ${queda} = ${L(vals[i])}`] });
    pasos.push({ estado: { corte: n, final: true }, texto: ['Cada vez se multiplica por el mismo factor.'],
      ecuacion: [v('V', L(V)), ` × (${queda})`, v('N', ['', '', '²', '³'][n]), ' = ', v('X', L(correcta))] });
    let hueco = Infinity;
    for (let i = 0; i < alternativas.length; i++) for (let j = i + 1; j < alternativas.length; j++) hueco = Math.min(hueco, Math.abs(alternativas[i].valor - alternativas[j].valor));
    const paso = pasoBonito(Math.min(V / 150, hueco / 2));
    const fantasmas = {};
    for (const a of alternativas) if (a.error) fantasmas[a.error.id] = { marca: a.valor, rotulo: ROTULOS_SUC[a.error.id] || '' };
    const r = { escena: { pieza: 'barra-porcentaje', datos, alt: `Barra de ${f(V)} L que pierde ${n} veces ${fr} de lo que queda` }, pasos, fantasmas };
    if (alternativas.every(a => a.valor >= 0 && a.valor <= V)) r.respuesta = { valor: correcta, unidad: 'L', tipo: 'arrastrar', control: 'marca', paso, tolerancia: paso };
    return r;
  }

  // ======================= afín =======================
  const AFIN = [
    { txt: 'El alquiler de una cancha de fulbito tiene un pago fijo por la reserva más un pago por cada hora de juego', u: 'h', un: ['hora', 'horas'], F: [10, 15, 20, 25, 30], k: [20, 25, 30, 35, 40, 50], t: [1, 2, 3, 4, 5, 6, 8] },
    { txt: 'Un taxi por aplicativo cobra una tarifa fija por subir más un monto por cada kilómetro recorrido', u: 'km', un: ['km', 'km'], F: [3, 4, 5, 6], k: [1.5, 2, 2.5, 3], t: [2, 4, 5, 6, 8, 10, 12, 15] },
    { txt: 'El recibo de agua de una casa tiene un cargo fijo mensual más un monto por cada metro cúbico consumido', u: 'm³', un: ['m³', 'm³'], F: [5, 8, 10, 12, 15], k: [2, 2.5, 3, 4, 5], t: [5, 8, 10, 12, 15, 20, 25] },
  ];
  function afin(rng, semilla) {
    const ctx = rng.elegir(AFIN);
    const F = rng.elegir(ctx.F), k = rng.elegir(ctx.k);
    const ts = rng.barajar(ctx.t).slice(0, 3);
    const [t1, t2] = ts.slice(0, 2).sort((x, y) => x - y), t3 = ts[2];
    const C = t => F + k * t;
    const C1 = C(t1), C2 = C(t2), correcta = C(t3);
    const ut = t => `${f(t)} ${t === 1 ? ctx.un[0] : ctx.un[1]}`;
    const variables = { P: { nombre: 'primer dato', color: 'o' }, Q: { nombre: 'segundo dato', color: 'i' }, K: { nombre: 'costo por unidad', color: 'h' }, X: { nombre: 'costo pedido', color: 'd' } };
    const enunciado = [`${ctx.txt}. Por `, v('P', `${ut(t1)} se pagan ${soles(C1)}`), ' y por ', v('Q', `${ut(t2)}, ${soles(C2)}`), '.'];
    const pregunta = ['¿Cuánto ', v('X', `se paga por ${ut(t3)}`), '?'];
    const errores = [
      E('AR7-proporcional-al-primer-dato', C1 / t1 * t3, `Supusiste que el pago es proporcional: ${soles(C1)} entre ${f(t1)} y por ${f(t3)}. Pero hay un pago fijo que no crece: por eso los dos datos no dan la misma razón (${f(C1 / t1)} y ${f(C2 / t2)}).`),
      E('AR7-proporcional-al-segundo-dato', C2 / t2 * t3, `Supusiste que el pago es proporcional: ${soles(C2)} entre ${f(t2)} y por ${f(t3)}. Hay un pago fijo: los dos datos no dan la misma razón (${f(C1 / t1)} y ${f(C2 / t2)}).`),
      E('olvida-el-pago-fijo', k * t3, `Calculaste bien el costo por ${ctx.un[0]} (${soles(k)}), pero olvidaste sumar el pago fijo de ${soles(F)}.`),
      ...(t3 > t2 ? [E('AR6-repite-la-diferencia', C2 + (C2 - C1), `Sumaste otra vez la diferencia entre los dos pagos. Esa diferencia corresponde a ${f(t2 - t1)} ${ctx.un[1]} más, no a ${f(t3 - t2)}.`)] : []),
      E('pago-fijo-dos-veces', 2 * F + k * t3, 'Sumaste el pago fijo dos veces. Se paga una sola vez.'),
    ];
    const solucion = [
      [`De ${f(t1)} a ${f(t2)} ${ctx.un[1]} el pago sube ${soles(C2 - C1)}: `, v('K', `${soles(k)} por ${ctx.un[0]}`), ` (${f(C2 - C1)} ÷ ${f(t2 - t1)}).`],
      ['El pago fijo: ', v('P', soles(C1)), ` − ${f(t1)} × ${f(k)} = ${soles(F)}.`],
      [`Por ${ut(t3)}: ${soles(F)} + ${f(t3)} × ${f(k)} = `, v('X', soles(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: soles, unidad: 'soles', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'afin', contexto: ctx.u, t1, C1, t2, C2, t3 } });
  }

  // ======================= llegadas =======================
  // «k·x = m» con el signo y el 1 arreglados: «−1t = −14» se escribe «t = 14».
  const nv = n => (n === 1 ? '1 varón' : `${n} varones`), nm = n => (n === 1 ? '1 mujer' : `${n} mujeres`);
  function ecuacion(k, m, x) {
    if (k < 0) { k = -k; m = -m; }
    return `${k === 1 ? '' : k}${x} = ${f(m)}`;
  }
  function llegadas(rng, semilla, sub) {
    const variables = { R: { nombre: sub === 'parejas' ? 'razón inicial' : 'razón después de la llegada', color: 'o' }, S: { nombre: 'razón al final', color: 'i' }, K: { nombre: 'parejas que se van', color: 'h' }, X: { nombre: 'lo que se pide', color: 'd' } };
    const evento = rng.elegir(['una fiesta de promoción', 'una pollada del barrio', 'una reunión de exalumnos']);
    const entero2 = x => Number.isFinite(x) && x > 0 && Math.abs(x - Math.round(x)) < 1e-9;
    if (sub === 'parejas') {
      const [a, b] = rng.elegir([[3, 2], [4, 3], [5, 4], [2, 3], [3, 4], [5, 3], [7, 5], [4, 5], [3, 5]]);
      const t = rng.entero(4, 20), k = rng.entero(2, 15);
      const H = a * t, M = b * t;
      if (k >= Math.min(H, M) - 1) return null;
      const fin = Q(H - k, M - k);
      if (fin.n > 12 || fin.d > 12 || fin.n * b === fin.d * a) return null;
      const [c, d] = [fin.n, fin.d];
      const correcta = H + M;
      const enunciado = [`En ${evento}, por cada `, v('R', `${nv(a)} hay ${nm(b)}`), '. Se retiran ', v('K', `${k} parejas`), ' (cada pareja es un varón y una mujer) y ahora hay ', v('S', `${nv(c)} por cada ${nm(d)}`), '.'];
      const pregunta = ['¿Cuántas ', v('X', 'personas había al inicio'), '?'];
      // k restado solo de los varones: d(a·t − k) = c·b·t; solo de las mujeres: c(b·t − k) = d·a·t.
      const tV = d * k / (a * d - b * c), tM = c * k / (b * c - a * d);
      const errores = [
        E('parejas-de-un-solo-grupo', (a + b) * (entero2(tV) ? tV : tM), `Restaste las ${k} parejas de un solo grupo. Cada pareja que se va es un varón y una mujer: los dos grupos bajan en ${k}.`),
        E('AR5-personas-al-final', correcta - 2 * k, 'Esas son las personas que quedan. Se pide cuántas había al inicio.'),
        E('AR5-solo-los-varones', H, 'Esos son los varones del inicio. Se pide el total de personas.'),
        E('parejas-como-personas', (a + b) * (d - c) * k / 2 / (a * d - b * c), `Contaste ${k} personas en vez de ${k} parejas. Se van ${k} varones y ${k} mujeres: ${2 * k} personas.`),
        E('AR5-solo-las-mujeres', M, 'Esas son las mujeres del inicio. Se pide el total de personas.'),
      ];
      const solucion = [
        ['Al inicio: ', v('R', `varones = ${a}t, mujeres = ${b}t`), '.'],
        ['Después: ', v('S', `(${a}t − ${k}) : (${b}t − ${k}) = ${c} : ${d}`), `, o sea, ${d}(${a}t − ${k}) = ${c}(${b}t − ${k}): ${a * d}t − ${d * k} = ${b * c}t − ${c * k}.`],
        [`Entonces ${ecuacion(a * d - b * c, d * k - c * k, 't')}${Math.abs(a * d - b * c) === 1 ? '' : `, t = ${t}`}. Había ${H} varones y ${M} mujeres: `, v('X', `${correcta} personas`), '.'].map(x => (typeof x === 'string' ? x.replace(/-(\d)/g, '−$1') : x)),
      ];
      return cerrar(rng, semilla, { correcta, errores, enteros: true, texto: x => `${f(x)}`, unidad: 'personas', variables, enunciado, pregunta, solucion,
        datos: { tipo: 'llegadas', sub, a, b, k, c, d } });
    }
    const H = rng.entero(10, 60), M = rng.entero(8, 60), k1 = rng.entero(2, 20), k2 = rng.entero(2, 15);
    if (k2 >= Math.min(H, M + k1) - 1) return null;
    const r1 = Q(H, M + k1), r2 = Q(H - k2, M + k1 - k2);
    const [c, d] = [r1.n, r1.d], [e, g] = [r2.n, r2.d];
    if (Math.max(c, d, e, g) > 12 || c * g === d * e) return null;
    const pideH = rng.moneda();
    const correcta = pideH ? H : M;
    const s = H / c;
    const enunciado = [`En ${evento} llegan ${nm(k1)} y la razón de varones a mujeres queda en `, v('R', `${c} : ${d}`), '. Luego se retiran ', v('K', `${k2} parejas`), ' (cada pareja es un varón y una mujer) y la razón pasa a ', v('S', `${e} : ${g}`), '.'];
    const pregunta = ['¿Cuántos ', v('X', pideH ? 'varones' : 'mujeres'), ` había antes de que llegaran las ${k1} mujeres?`].map(x => (pideH || typeof x !== 'string' ? x : x.replace('Cuántos', 'Cuántas')));
    // k2 solo de los varones: (c·s − k2)·g = e·d·s; solo de las mujeres: c·s·g = e(d·s − k2).
    const sV = k2 * g / (c * g - e * d), sM = e * k2 / (e * d - c * g);
    const sErr = entero2(sV) ? sV : sM;
    const parejasExpl = `Restaste las ${k2} parejas de un solo grupo. Cada pareja que se va es un varón y una mujer: los dos grupos bajan en ${k2}.`;
    const errores = pideH ? [
      E('parejas-de-un-solo-grupo', c * sErr, parejasExpl),
      E('AR5-varones-al-final', H - k2, 'Esos son los varones que quedaron al final. Se piden los del inicio.'),
      E('AR5-el-otro-grupo', M, 'Ese es el número de mujeres del inicio. Se piden los varones.'),
      E('AR5-mujeres-tras-la-llegada', M + k1, 'Ese es el número de mujeres después de la llegada. Se piden los varones.'),
      E('AR5-mujeres-al-final', M + k1 - k2, 'Ese es el número de mujeres al final. Se piden los varones.'),
    ] : [
      E('parejas-de-un-solo-grupo', d * sErr - k1, parejasExpl),
      E('AR5-cuenta-las-que-llegaron', M + k1, `Ahí están contadas las ${k1} mujeres que llegaron. Se piden las que había antes.`),
      E('AR5-el-otro-grupo', H, 'Ese es el número de varones del inicio. Se piden las mujeres.'),
      E('AR5-mujeres-al-final', M + k1 - k2, 'Ese es el número de mujeres al final. Se piden las del inicio.'),
      E('AR5-varones-al-final', H - k2, 'Ese es el número de varones al final. Se piden las mujeres del inicio.'),
    ];
    const solucion = [
      ['Después de la llegada: ', v('R', `varones = ${c}s, mujeres = ${d}s`), '.'],
      ['Al irse las parejas: ', v('S', `(${c}s − ${k2}) : (${d}s − ${k2}) = ${e} : ${g}`), `, o sea, ${g}(${c}s − ${k2}) = ${e}(${d}s − ${k2}).`],
      [`${ecuacion(c * g - d * e, g * k2 - e * k2, 's')}${Math.abs(c * g - d * e) === 1 ? '' : `, s = ${f(s)}`}: después de la llegada había ${H} varones y ${M + k1} mujeres.`],
      [pideH ? 'Los varones no cambiaron con la llegada: ' : `Antes de que llegaran las ${k1}: ${M + k1} − ${k1} = `, v('X', `${correcta} ${pideH ? 'varones' : 'mujeres'}`), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, enteros: true, texto: x => `${f(x)}`, unidad: 'personas', variables, enunciado, pregunta, solucion,
      datos: { tipo: 'llegadas', sub, k1, c, d, k2, e, f: g, pideH } });
  }

  // ======================= conjuntos =======================
  // Las regiones del diagrama de tres conjuntos son 8 (dentro o fuera de cada uno). Una expresión
  // ocupa unas regiones; las condiciones (inclusiones y disjunciones) borran las regiones que no
  // pueden tener elementos. Dos expresiones son iguales si ocupan las mismas regiones posibles.
  const LET = ['A', 'B', 'C'];
  const dentro = (atomo, i) => (atomo >> i) & 1;
  function evalua(expr, atomo, pos) {
    if (typeof expr === 'string') return expr === 'U' ? 1 : expr === '∅' ? 0 : dentro(atomo, pos[expr]);
    if (expr[0] === "'") return 1 - evalua(expr[1], atomo, pos);
    const x = evalua(expr[1], atomo, pos), y = evalua(expr[2], atomo, pos);
    return expr[0] === '∪' ? x | y : expr[0] === '∩' ? x & y : x & (1 - y);
  }
  const POS = { A: 0, B: 1, C: 2 };
  const mascara = (expr, posibles) => posibles.reduce((m, at) => m | (evalua(expr, at, POS) << at), 0);
  function texto(expr, dentroDe = false) {
    if (typeof expr === 'string') return expr;
    if (expr[0] === "'") return typeof expr[1] === 'string' ? expr[1] + "'" : `(${texto(expr[1])})'`;
    const t = `${texto(expr[1], true)} ${expr[0]} ${texto(expr[2], true)}`;
    return dentroDe ? `(${t})` : t;
  }
  // Candidatas, de la más simple a la más larga.
  const CANDIDATAS = (() => {
    const l = ['∅', 'U', ...LET, ...LET.map(x => ["'", x])];
    for (const op of ['∪', '∩', '−']) for (const x of LET) for (const y of LET) if (x !== y && (op === '−' || x < y)) l.push([op, x, y]);
    return l;
  })();
  // Condiciones: [tipo, X, Y] con 'sub' (X ⊂ Y) o 'disj' (X ∩ Y = ∅).
  const prohibido = (at, [t, x, y]) => (t === 'sub' ? dentro(at, POS[x]) && !dentro(at, POS[y]) : dentro(at, POS[x]) && dentro(at, POS[y]));
  const posiblesCon = conds => [0, 1, 2, 3, 4, 5, 6, 7].filter(at => !conds.some(c => prohibido(at, c)));
  const simple = (expr, conds) => { const pos = posiblesCon(conds), m = mascara(expr, pos); return CANDIDATAS.find(c => mascara(c, pos) === m) || null; };
  const condTxt = ([t, x, y]) => (t === 'sub' ? `${x} ⊂ ${y}` : `${x} ∩ ${y} = ∅`);
  const cambiaOps = (e, de, a) => (typeof e === 'string' ? e : e[0] === "'" ? ["'", cambiaOps(e[1], de, a)] : [e[0] === de ? a : e[0] === a ? de : e[0], cambiaOps(e[1], de, a), cambiaOps(e[2], de, a)]);
  const restaAlReves = e => (typeof e === 'string' ? e : e[0] === "'" ? ["'", restaAlReves(e[1])] : e[0] === '−' ? ['−', restaAlReves(e[2]), restaAlReves(e[1])] : [e[0], restaAlReves(e[1]), restaAlReves(e[2])]);
  const atomoTxt = at => { const ins = LET.filter((x, i) => dentro(at, i)), outs = LET.filter((x, i) => !dentro(at, i));
    return ins.length === 0 ? 'fuera de los tres' : ins.length === 3 ? 'en los tres' : `en ${ins.join(' y ')} (fuera de ${outs.join(' y ')})`; };

  function conjuntos(rng, semilla) {
    const [X, Y, Z] = rng.barajar(LET);
    const patron = rng.elegir([
      [['sub', X, Y], ['disj', Y, Z]],
      [['sub', X, Y], ['disj', X, Z]],
      [['sub', X, Y], ['sub', Z, Y], ['disj', X, Z]],
      [['sub', X, Y], ['sub', Y, Z]],
    ]);
    const hoja = () => (rng.sig() < 0.15 ? ["'", rng.elegir(LET)] : rng.elegir(LET));
    const op = () => rng.elegir(['∪', '∩', '−', '∪', '∩']);
    const forma = rng.entero(0, 2);
    let expr;
    if (forma === 0) expr = [op(), [op(), hoja(), hoja()], hoja()];
    else if (forma === 1) expr = [op(), hoja(), [op(), hoja(), hoja()]];
    else expr = [op(), [op(), hoja(), hoja()], [op(), hoja(), hoja()]];
    const t = texto(expr);
    // Que use las tres letras y que ninguna operación junte dos cosas iguales («A ∪ A»).
    if (LET.some(l => !t.includes(l))) return null;
    const repetida = e => typeof e !== 'string' && (e[0] === "'" ? repetida(e[1]) : texto(e[1]) === texto(e[2]) || repetida(e[1]) || repetida(e[2]));
    if (repetida(expr)) return null;
    const pos = posiblesCon(patron);
    const correctaE = simple(expr, patron);
    if (!correctaE) return null;
    // La simplificación debe necesitar las condiciones: sin ellas, no son iguales.
    const todos = [0, 1, 2, 3, 4, 5, 6, 7];
    if (mascara(correctaE, todos) === mascara(expr, todos)) return null;
    if (texto(correctaE) === t) return null;
    const cl = e => ({ clave: `conj:${mascara(e, pos)}`, texto: texto(e) });
    const correcta = cl(correctaE);
    const H = (id, e, expl) => (e ? { id, ...cl(e), explicacion: expl, respaldo: 'hipotesis', fuente: null } : null);
    const subs = patron.filter(c => c[0] === 'sub'), disj = patron.filter(c => c[0] === 'disj');
    const reves = patron.map(c => (c === subs[0] ? ['sub', c[2], c[1]] : c));
    const errores = [
      H('inclusion-al-reves', simple(expr, reves), `Usaste la inclusión al revés. ${condTxt(subs[0])} dice que todo elemento de ${subs[0][1]} está en ${subs[0][2]}, no al revés.`),
      disj.length ? H('disjuncion-olvidada', simple(expr, patron.filter(c => c[0] !== 'disj')), `No usaste que ${condTxt(disj[0])}: esos conjuntos no tienen elementos comunes.`) : null,
      H('inclusion-olvidada', simple(expr, patron.filter(c => c !== subs[0])), `No usaste que ${condTxt(subs[0])}.`),
      H('union-por-interseccion', simple(cambiaOps(expr, '∪', '∩'), patron), 'Cambiaste unión por intersección (o al revés) al operar. La unión junta los elementos de los dos; la intersección deja solo los comunes.'),
      H('diferencia-al-reves', simple(restaAlReves(expr), patron), 'Hiciste una diferencia al revés. P − Q son los elementos de P que no están en Q, no los de Q que no están en P.'),
      H('igual-a-una-parte', simple(expr[1], patron), `Te quedaste con ${texto(expr[1])} y no hiciste la última operación (${expr[0]} con ${texto(expr[2])}).`),
    ].filter(Boolean);
    const alternativas = P.armarTexto({ correcta, errores, rng });
    const variables = { A: { nombre: 'conjunto A', color: 'o' }, B: { nombre: 'conjunto B', color: 'i' }, C: { nombre: 'conjunto C', color: 'h' }, X: { nombre: 'expresión simplificada', color: 'd' } };
    const pinta = s => [...s].map(ch => (POS[ch] !== undefined ? v(ch, ch) : ch));
    const enunciado = ['Los conjuntos ', v('A', 'A'), ', ', v('B', 'B'), ' y ', v('C', 'C'), ' cumplen ', ...patron.flatMap((c, i) => [i ? (i === patron.length - 1 ? ' y ' : ', ') : '', ...pinta(condTxt(c))]), '.'];
    const usaU = /'|U/.test(t) || /'|U/.test(correcta.texto) || alternativas.some(al => /'|U/.test(al.texto));
    if (usaU) enunciado.push(" U es el conjunto universal y X' es el complemento de X.");
    const pregunta = ['¿A qué es igual ', ...pinta(t), '?'];
    const regiones = m => pos.filter(at => (m >> at) & 1).map(atomoTxt);
    const lista = m => { const r = regiones(m); return r.length ? r.join('; ') : 'ninguna región (vacío)'; };
    const solucion = [
      ['Con las condiciones, las regiones del diagrama que pueden tener elementos son: ', pos.map(atomoTxt).join('; '), '.'],
      [`${texto(expr[1])} ocupa: ${lista(mascara(expr[1], pos))}. ${texto(expr[2])} ocupa: ${lista(mascara(expr[2], pos))}.`],
      [`Con ${expr[0]}, ${t} ocupa: ${lista(mascara(expr, pos))}. Esas son justo las regiones de `, v('X', correcta.texto), '.'],
    ];
    return { id: `${ID}#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta.clave, texto: correcta.texto, unidad: '' }, _datos: { tipo: 'conjuntos', condiciones: patron, expr } };
  }

  return { id: ID, titulo: 'Tanto por ciento, razones y conjuntos en problemas de planteo', generar, _pctPeriodico: pctPeriodico };
});
