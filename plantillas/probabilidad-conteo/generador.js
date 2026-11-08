/*
 * Generador «probabilidad-conteo»: probabilidad con árboles y conteo con bloques.
 * Formato "predicciones" (docs/arquitectura.md), con respuestas exactas (fracción irreducible o
 * entero) armadas con armarTexto de nucleo/predicciones.js. Funciona en el navegador
 * (window.Generadores['probabilidad-conteo']) y en Node (require). No usa ningún motor.
 *
 * Tipos (y la falta de las filas del grupo que cubre cada uno):
 *   bayes          (sub dos | tres) árbol con dos o tres causas (aula que estudió o no, rutas de combi,
 *                  máquinas, proveedores, institutos); se pide la probabilidad de la causa sabiendo que
 *                  ocurrió el efecto, o que no ocurrió.
 *                  Falta: «Árbol de probabilidades para Bayes (probabilidad de la causa)».
 *   exactamente    (sub distintas | binomial) tres eventos independientes con probabilidades distintas
 *                  (exactamente dos o exactamente uno), o n intentos iguales (exactamente k).
 *                  Falta: «Probabilidad de exactamente k de n eventos independientes».
 *   bloques-prob   (sub materias | pareja) libros de dos o tres cursos al azar en un estante (que cada
 *                  curso quede junto), o dos personas que quedan juntas en una fila o en una ronda.
 *                  Falta: «Permutaciones con bloques dentro de un cálculo de probabilidad».
 *   traspaso       (sub una | dos) se pasan una o dos bolas de una caja a otra y luego se saca una.
 *                  Falta: «Árbol de probabilidades al pasar objetos de una urna a otra».
 *   circular       (sub uno | dos) personas en una mesa redonda con uno o dos grupos que van juntos.
 *                  Falta: «Permutaciones circulares con un bloque (o bloques) que se permuta internamente».
 *   fila           (sub uno | dos) personas en fila con uno o dos grupos que van juntos.
 *                  Falta: «Permutaciones con bloques que se permutan internamente».
 *
 * Notación: probabilidades como fracción irreducible («3/14»); conteos como enteros («1 440»);
 * C(n, k) para las combinaciones y n! para el factorial, como en plantillas/probabilidad-dados/.
 * Errores: las trampas 11, 14, 15, 16 y 17 de docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md
 * (hipótesis) y AR17 y AR20 de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md (parcial).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'probabilidad-conteo';
  const INFORME = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const v = P.v;
  const TIPOS = ['bayes', 'bayes', 'exactamente', 'exactamente', 'bloques-prob', 'traspaso', 'circular', 'fila'];

  // ---------- Fracciones exactas ----------
  const Q = (n, d = 1) => P.frac(n, d);
  const suma = (a, b) => Q(a.n * b.d + b.n * a.d, a.d * b.d);
  const resta = (a, b) => Q(a.n * b.d - b.n * a.d, a.d * b.d);
  const prod = (a, b) => Q(a.n * b.n, a.d * b.d);
  const div = (a, b) => Q(a.n * b.d, a.d * b.n);
  const sumaDe = l => l.reduce(suma, Q(0));
  const prodDe = l => l.reduce(prod, Q(1));
  const uno = Q(1);
  const comp = a => resta(uno, a);
  const potQ = (a, k) => prodDe(Array(k).fill(a));
  const tf = P.textoFraccion;
  const clave = f => `num:${f.n}/${f.d}`;
  const prob = f => ({ clave: clave(f), texto: tf(f) });
  const entero = n => ({ clave: clave(Q(n)), texto: P.formatear(n) });
  const fact = n => (n <= 1 ? 1 : n * fact(n - 1));
  const C = (n, k) => (k < 0 || k > n ? 0 : fact(n) / (fact(k) * fact(n - k)));
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sup = n => String(n).split('').map(d => SUP[d]).join('');
  const pot = (f, k) => (k === 1 ? `(${tf(f)})` : `(${tf(f)})${sup(k)}`);
  const pc = x => `${x} %`;
  const lista = l => (l.length === 1 ? l[0] : l.slice(0, -1).join(', ') + ' y ' + l[l.length - 1]);

  // Error de probabilidad: solo si queda estrictamente entre 0 y 1 (así todas las opciones son fracciones).
  const eP = (id, f, explicacion, respaldo = 'hipotesis', fuente = null) =>
    (f && f.n > 0 && f.n < f.d ? { id, ...prob(f), explicacion, respaldo, fuente } : null);
  // Error de conteo: solo si es un entero positivo.
  const eN = (id, n, explicacion, respaldo = 'hipotesis', fuente = null) =>
    (Number.isInteger(n) && n > 0 ? { id, ...entero(n), explicacion, respaldo, fuente } : null);

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 2000; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo) {
    const o = { bayes, exactamente, 'bloques-prob': bloquesProb, traspaso, circular, fila }[tipo](rng);
    if (!o) return null;
    const alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores.filter(Boolean), rng });
    return {
      id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion,
      respuesta: { valor: o.correcta.clave, texto: o.correcta.texto, unidad: '' },
      _datos: o.datos,
    };
  }

  // =====================================================================================
  // bayes: probabilidad de la causa sabiendo el efecto
  // =====================================================================================
  const CTX_DOS = [
    { id: 'estudio', causas: ['los que estudiaron', 'los que no estudiaron'], piden: ['haya estudiado', 'no haya estudiado'],
      tasas: [[70, 95], [20, 50]], previas: [40, 80], si: 'aprobó', no: 'desaprobó', inf: ['aprobar', 'desaprobar'], siPlural: 'aprueba', noPlural: 'desaprueba',
      texto: (p, q) => ['En un aula, el ', v('p', pc(p[0])), ' de los alumnos estudió para el examen y el resto no. De los que estudiaron, aprueba el ',
        v('q', pc(q[0])), '; de los que no estudiaron, aprueba el ', v('q', pc(q[1])), '.'],
      eleccion: c => `Se elige al azar un alumno del aula y resulta que ${c}.` },
    { id: 'combi', causas: ['la ruta A', 'la ruta B'], piden: ['haya tomado la combi de la ruta A', 'haya tomado la combi de la ruta B'],
      tasas: [[5, 30], [10, 45]], previas: [30, 80], si: 'llegó tarde', no: 'llegó a tiempo', inf: ['llegar tarde', 'llegar a tiempo'], siPlural: 'llega tarde', noPlural: 'llega a tiempo',
      texto: (p, q) => ['Para ir al colegio, Rosa toma la combi de la ruta A el ', v('p', pc(p[0])), ' de los días y la de la ruta B los demás días. Con la ruta A llega tarde el ',
        v('q', pc(q[0])), ' de las veces; con la ruta B, el ', v('q', pc(q[1])), '.'],
      eleccion: c => `Se elige al azar uno de los días y ese día Rosa ${c}.` },
  ];
  const CTX_TRES = [
    { id: 'maquinas', causas: ['la máquina A', 'la máquina B', 'la máquina C'], piden: ['lo haya hecho la máquina A', 'lo haya hecho la máquina B', 'lo haya hecho la máquina C'],
      tasas: [1, 8], si: 'es defectuoso', no: 'no es defectuoso', inf: ['salir defectuoso', 'salir bien'], siPlural: 'sale defectuoso', noPlural: 'sale bien',
      texto: (p, q) => ['En un taller de Juliaca, tres máquinas, A, B y C, hacen el ', v('p', pc(p[0])), ', el ', v('p', pc(p[1])), ' y el ', v('p', pc(p[2])),
        ' de los pernos, respectivamente. Sale defectuoso el ', v('q', pc(q[0])), ' de los pernos de A, el ', v('q', pc(q[1])), ' de los de B y el ', v('q', pc(q[2])), ' de los de C.'],
      eleccion: c => `Se toma al azar un perno del taller y ${c}.` },
    { id: 'papas', causas: ['el proveedor A', 'el proveedor B', 'el proveedor C'], piden: ['venga del proveedor A', 'venga del proveedor B', 'venga del proveedor C'],
      tasas: [2, 10], si: 'está malograda', no: 'está sana', inf: ['estar malograda', 'estar sana'], siPlural: 'llega malogrado', noPlural: 'llega sano',
      texto: (p, q) => ['Un puesto del mercado compra papa a tres proveedores: el ', v('p', pc(p[0])), ' de las papas viene de A, el ', v('p', pc(p[1])), ' de B y el ',
        v('p', pc(p[2])), ' de C. De lo que manda A llega malogrado el ', v('q', pc(q[0])), '; de lo de B, el ', v('q', pc(q[1])), ', y de lo de C, el ', v('q', pc(q[2])), '.'],
      eleccion: c => `Se toma al azar una papa del puesto y ${c}.` },
    { id: 'institutos', causas: ['el instituto A', 'el instituto B', 'el instituto C'], piden: ['venga del instituto A', 'venga del instituto B', 'venga del instituto C'],
      tasas: [10, 60], si: 'fue contratada', no: 'no fue contratada', inf: ['ser contratada', 'no ser contratada'], siPlural: 'es contratado', noPlural: 'no es contratado',
      texto: (p, q) => ['Una empresa recibe postulantes de tres institutos: el ', v('p', pc(p[0])), ' viene del instituto A, el ', v('p', pc(p[1])), ' del B y el ',
        v('p', pc(p[2])), ' del C. La empresa contrata al ', v('q', pc(q[0])), ' de los postulantes de A, al ', v('q', pc(q[1])), ' de los de B y al ', v('q', pc(q[2])), ' de los de C.'],
      eleccion: c => `Se elige al azar a una de las personas que postularon y se sabe que ${c}.` },
  ];

  function bayes(rng) {
    const sub = rng.elegir(['dos', 'tres']);
    let ctx, p, q;
    if (sub === 'dos') {
      ctx = rng.elegir(CTX_DOS);
      const p0 = 10 * rng.entero(ctx.previas[0] / 10, ctx.previas[1] / 10);
      p = [p0, 100 - p0];
      q = ctx.tasas.map(([a, b]) => 5 * rng.entero(a / 5, b / 5));
    } else {
      ctx = rng.elegir(CTX_TRES);
      const a = 5 * rng.entero(3, 10), b = 5 * rng.entero(3, 10), c = 100 - a - b;
      if (c < 15) return null;
      p = [a, b, c];
      const [lo, hi] = ctx.tasas;
      const paso = hi > 10 ? 5 : 1;
      q = [0, 1, 2].map(() => paso * rng.entero(Math.ceil(lo / paso), Math.floor(hi / paso)));
    }
    if (new Set(q).size < q.length) return null;
    const sorteo = rng.sig();
    // En el aula, casi siempre se sabe que desaprobó; con máquinas y papas, siempre que salió el efecto.
    const condSi = ctx.id === 'estudio' ? sorteo < 0.3 : (ctx.id === 'maquinas' || ctx.id === 'papas' ? true : sorteo < 0.7);
    const i = rng.entero(0, p.length - 1);
    const datos = { tipo: 'bayes', sub, contexto: ctx.id, p, q, condicion: condSi ? 'si' : 'no', causa: i };
    const r = resolverBayes(datos);
    const { previas, tasas, ramas, total, x } = r;
    if (sub === 'tres' && !condSi && x.d > 200) return null;
    const evento = condSi ? ctx.si : ctx.no, inf = ctx.inf[condSi ? 0 : 1];
    const variables = {
      p: { nombre: 'probabilidades de cada causa (las partes de los casos)', color: 'o' },
      q: { nombre: `porcentajes de ${ctx.inf[0]} en cada causa`, color: 'i' },
      E: { nombre: `probabilidad total de ${inf}`, color: 'h' },
      X: { nombre: 'probabilidad pedida', color: 'd' },
    };
    const enunciado = [...ctx.texto(p, q), ' ', ctx.eleccion(evento)];
    const pregunta = ['¿Cuál es la ', v('X', `probabilidad de que ${ctx.piden[i]}`), '?'];
    // Las tasas «del efecto pedido»: si se condiciona en que no ocurrió, son los complementos.
    const tasasSi = q.map(t => Q(t, 100));
    const errores = [
      eP('bayes-condicional-directa', tasas[i], `Esa es la probabilidad del efecto dada la causa: la de ${inf} para ${ctx.causas[i]}. Se pide al revés: la causa sabiendo el efecto. Hay que dividir la rama de esa causa entre el total de casos en que ${evento}.`),
      !condSi ? eP('bayes-sin-complemento', div(prod(previas[i], tasasSi[i]), sumaDe(previas.map((pp, j) => prod(pp, tasasSi[j])))), `Usaste los porcentajes de ${ctx.inf[0]} que da el enunciado, pero se sabe que ${evento}. Para esa rama van los complementos: 100 % menos cada porcentaje.`) : null,
      eP('interseccion-por-condicional', ramas[i], `Esa es la probabilidad de que ocurran las dos cosas a la vez (la rama completa del árbol). Como ya se sabe que ${evento}, solo cuentan los casos en que ${evento}: hay que dividir esa rama entre la suma de todas.`),
      eP('bayes-probabilidad-total', total, `Esa es la probabilidad total de ${inf}, sin mirar la causa. Es el denominador del cálculo, no la respuesta: falta dividir la rama de la causa pedida entre ese total.`),
      eP('bayes-sin-pesos', div(tasas[i], sumaDe(tasas)), `Comparaste solo las probabilidades de ${inf} de cada causa, como si todas las causas tuvieran la misma parte de los casos. Cada rama pesa la parte de su causa por esa probabilidad: hay que multiplicar antes de comparar.`),
      eP('bayes-previa', previas[i], `Esa es la probabilidad de la causa antes de saber nada. El dato de que ${evento} cambia esa probabilidad: hay que quedarse solo con los casos en que ${evento}.`),
    ];
    const pasoTasas = !condSi
      ? [[`Se sabe que ${evento}: en cada causa, la probabilidad de ${inf} es 100 % menos el porcentaje dado: `, ...ctx.causas.map((c, j) => [`${c}, 100 % − `, v('q', pc(q[j])), ` = ${100 - q[j]} %`, j < q.length - 1 ? '; ' : '.']).flat()]]
      : [];
    const solucion = [
      [`Se arma el árbol: primero la causa; después, ${ctx.inf[0]} o no. Cada rama pesa (probabilidad de la causa) · (probabilidad de ${inf} en esa causa).`],
      ...pasoTasas,
      [`Ramas de ${inf}: `, ...ctx.causas.map((c, j) => [`${c}: `, v('p', tf(previas[j])), ' · ', condSi ? v('q', tf(tasas[j])) : tf(tasas[j]), ` = ${tf(ramas[j])}`, j < q.length - 1 ? '; ' : '.']).flat()],
      [`Probabilidad total de ${inf}: `, v('E', `${ramas.map(tf).join(' + ')} = ${tf(total)}`), '.'],
      [`De esos casos, la parte que corresponde ${('a ' + ctx.causas[i]).replace(/^a el /, 'al ')}: `, `${tf(ramas[i])} ÷ `, v('E', tf(total)), ' = ', v('X', tf(x)), '.'],
    ];
    return { correcta: prob(x), errores, variables, enunciado, pregunta, solucion, datos };
  }
  function resolverBayes(d) {
    const previas = d.p.map(t => Q(t, 100));
    const tasas = d.q.map(t => Q(d.condicion === 'si' ? t : 100 - t, 100));
    const ramas = previas.map((pp, j) => prod(pp, tasas[j]));
    const total = sumaDe(ramas);
    return { previas, tasas, ramas, total, x: div(ramas[d.causa], total) };
  }

  // =====================================================================================
  // exactamente: k de n eventos independientes
  // =====================================================================================
  const PROBS = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [1, 5], [4, 5]];
  const CTX_DIST = [
    { id: 'postulantes', nombres: ['Ana', 'Beto', 'Carla'], quien: k => (k === 2 ? 'dos de ellos ingresen' : 'uno de ellos ingrese'),
      texto: ps => ['Ana, Beto y Carla postulan a la universidad. Las probabilidades de que ingresen son ', v('p', tf(ps[0])), ', ', v('p', tf(ps[1])), ' y ', v('p', tf(ps[2])), ', respectivamente, y lo que le pase a uno no depende de lo que les pase a los otros.'] },
    { id: 'tiradores', nombres: ['el primero', 'el segundo', 'el tercero'], quien: k => (k === 2 ? 'dos de ellos acierten' : 'uno de ellos acierte'),
      texto: ps => ['Tres tiradores disparan una vez cada uno a un blanco, cada uno por su cuenta. Aciertan con probabilidades ', v('p', tf(ps[0])), ', ', v('p', tf(ps[1])), ' y ', v('p', tf(ps[2])), ', respectivamente.'] },
    { id: 'combis', nombres: ['la primera', 'la segunda', 'la tercera'], quien: k => (k === 2 ? 'dos de ellas lleguen a tiempo' : 'una de ellas llegue a tiempo'),
      texto: ps => ['Tres combis salen a la vez del paradero de Juliaca hacia Puno, por rutas distintas. Las probabilidades de que lleguen a tiempo son ', v('p', tf(ps[0])), ', ', v('p', tf(ps[1])), ' y ', v('p', tf(ps[2])), ', respectivamente, y lo que le pase a una no depende de las otras.'] },
  ];
  const CTX_BIN = [
    { id: 'penales', probs: [[1, 4], [1, 5]],
      texto: (n, p) => ['Un arquero ataja cada penal con probabilidad ', v('p', tf(p)), ', sin importar lo que pasó en los otros. En una tanda le patean ', v('n', `${n} penales`), '.'],
      pide: k => `ataje exactamente ${k === 1 ? 'uno' : k}` },
    { id: 'examen', probs: [[1, 4], [1, 5]],
      texto: (n, p) => ['Lucía responde al azar ', v('n', `${n} preguntas`), ` de ${p.d} alternativas cada una (en cada pregunta, una sola alternativa es correcta), así que acierta cada una con probabilidad `, v('p', tf(p)), '.'],
      pide: k => `acierte exactamente ${k === 1 ? 'una' : k}` },
    { id: 'semillas', probs: [[3, 4], [2, 3], [4, 5], [3, 5]],
      texto: (n, p) => ['Cada semilla de quinua de un lote germina con probabilidad ', v('p', tf(p)), ', sin depender de las demás. Se siembran ', v('n', `${n} semillas`), '.'],
      pide: k => (k === 1 ? 'germine exactamente una' : `germinen exactamente ${k}`) },
  ];

  function exactamente(rng) {
    const sub = rng.elegir(['distintas', 'distintas', 'binomial']);
    if (sub === 'distintas') {
      const ctx = rng.elegir(CTX_DIST);
      const ps = [rng.elegir(PROBS), rng.elegir(PROBS), rng.elegir(PROBS)];
      if (new Set(ps.map(String)).size < 3) return null;
      const k = rng.sig() < 0.75 ? 2 : 1;
      const datos = { tipo: 'exactamente', sub, contexto: ctx.id, p: ps, k };
      const f = ps.map(x => Q(x[0], x[1])), g = f.map(comp);
      const x = resolverExactamente(datos);
      const variables = { p: { nombre: 'probabilidades de que cada uno lo logre', color: 'o' }, qq: { nombre: 'probabilidades de que cada uno no lo logre', color: 'i' }, X: { nombre: 'probabilidad pedida', color: 'd' } };
      const enunciado = ctx.texto(f);
      const pregunta = ['¿Cuál es la ', v('X', `probabilidad de que exactamente ${ctx.quien(k)}`), '?'];
      const pares = [[0, 1], [0, 2], [1, 2]];
      const sumPares = sumaDe(pares.map(([a, b]) => prod(f[a], f[b])));
      const tres = prodDe(f);
      let errores, casos;
      if (k === 2) {
        errores = [
          eP('exactamente-dos-sin-quitar-tres', sumPares, 'Sumaste los productos de dos en dos, pero cada producto incluye también el caso en que lo logran todos. «Exactamente dos» pide que el que queda NO lo logre: en cada caso falta multiplicar por la probabilidad de que el que queda falle.'),
          eP('exactamente-dos-resta-una-vez', resta(sumPares, tres), 'Quitaste una sola vez el caso en que lo logran todos. Ese caso está metido en cada uno de los tres productos de dos en dos, así que sobra tres veces. Más seguro: en cada caso, multiplica por la probabilidad de que el que queda falle.'),
          eP('al-menos-dos-por-exactamente', suma(x, tres), 'Esa es la probabilidad de que por lo menos dos lo logren: incluye el caso en que lo logran todos. «Exactamente dos» lo deja fuera.'),
          eP('exactamente-un-solo-caso', prodDe([f[0], f[1], g[2]]), `Contaste un solo caso (${ctx.nombres[0]} y ${ctx.nombres[1]} sí, ${ctx.nombres[2]} no). Hay tres maneras de que sean exactamente dos: depende de cuál falla. Hay que sumar los tres casos.`),
        ];
        casos = pares.map(([a, b]) => [0, 1, 2].map(j => (j === a || j === b ? f[j] : g[j])));
      } else {
        errores = [
          eP('exactamente-uno-suma-simple', sumaDe(f), 'Sumaste las tres probabilidades. Así no se pide que los demás fallen, y se cuentan varias veces los casos en que lo logra más de uno. En cada caso, multiplica la probabilidad del que lo logra por las de los dos que fallan.'),
          eP('al-menos-uno-por-exactamente', comp(prodDe(g)), 'Esa es la probabilidad de que por lo menos uno lo logre (1 menos la de que fallen todos): incluye los casos en que lo logran dos o tres. «Exactamente uno» los deja fuera.'),
          eP('exactamente-un-solo-caso', prodDe([f[0], g[1], g[2]]), `Contaste un solo caso (solo ${ctx.nombres[0]}). Hay tres maneras de que sea exactamente uno: depende de cuál lo logra. Hay que sumar los tres casos.`),
          eP('ninguno-por-exactamente-uno', prodDe(g), 'Esa es la probabilidad de que fallen todos. Se pide que exactamente uno lo logre.'),
        ];
        casos = [0, 1, 2].map(a => [0, 1, 2].map(j => (j === a ? f[j] : g[j])));
      }
      const solucion = [
        ['La probabilidad de que cada uno no lo logre es 1 menos la suya: ', v('qq', g.map(tf).join(', ')), '.'],
        [`Exactamente ${k === 2 ? 'dos' : 'uno'}: hay tres casos, según ${k === 2 ? 'cuál falla' : 'cuál lo logra'}. Como son independientes, cada caso es un producto:`],
        [casos.map(c => c.map(tf).join(' · ')).join('  +  ') + ' = ' + casos.map(c => tf(prodDe(c))).join(' + ') + '.'],
        ['Probabilidad pedida = ', v('X', tf(x)), '.'],
      ];
      return { correcta: prob(x), errores, variables, enunciado, pregunta, solucion, datos };
    }
    // binomial
    const ctx = rng.elegir(CTX_BIN);
    const n = rng.entero(3, 5), k = rng.entero(1, n - 1);
    const pp = rng.elegir(ctx.probs);
    const datos = { tipo: 'exactamente', sub, contexto: ctx.id, n, p: pp, k };
    const p = Q(pp[0], pp[1]), q = comp(p);
    const x = resolverExactamente(datos);
    const variables = { n: { nombre: 'número de intentos', color: 'o' }, p: { nombre: 'probabilidad de éxito en cada intento', color: 'i' }, k: { nombre: 'éxitos pedidos', color: 'h' }, X: { nombre: 'probabilidad pedida', color: 'd' } };
    const enunciado = ctx.texto(n, p);
    const pregunta = ['¿Cuál es la ', v('X', 'probabilidad'), ' de que ', v('k', ctx.pide(k)), '?'];
    const una = prod(potQ(p, k), potQ(q, n - k));
    let alMenos = Q(0); for (let j = k; j <= n; j++) alMenos = suma(alMenos, prod(Q(C(n, j)), prod(potQ(p, j), potQ(q, n - j))));
    const errores = [
      eP('binomial-un-solo-orden', una, `Calculaste un solo orden (primero ${k === 1 ? 'el éxito' : `los ${k} éxitos`} y después ${n - k === 1 ? 'el fallo' : 'los fallos'}). ${k === 1 ? 'El éxito puede' : `Los ${k} éxitos pueden`} caer en cualquiera de los ${n} intentos: hay C(${n}, ${k}) = ${C(n, k)} órdenes, todos con la misma probabilidad.`),
      eP('binomial-sin-fallos', prod(Q(C(n, k)), potQ(p, k)), `Faltó pedir que ${n - k === 1 ? 'el otro intento falle' : `los otros ${n - k} intentos fallen`}: cada fallo multiplica por ${tf(q)}.`),
      eP('binomial-al-menos', alMenos, `Esa es la probabilidad de por lo menos ${k}: sumaste también los casos con más éxitos. Se pide exactamente ${k}.`),
      eP('AR20', Q(C(n, k), 2 ** n), `Contaste los casos favorables sobre los ${2 ** n} resultados posibles, como si éxito y fallo fueran igual de probables. Aquí el éxito tiene probabilidad ${tf(p)}, no 1/2: cada caso pesa ${pot(p, k)}·${pot(q, n - k)}.`, 'parcial', INFORME),
      eP('binomial-solo-exitos', potQ(p, k), `${k === 1 ? 'Tomaste solo la probabilidad del éxito' : `Multiplicaste solo los ${k} éxitos`}. Faltan los fallos de los otros intentos y los distintos órdenes.`),
    ];
    const solucion = [
      ['En cada intento, la probabilidad de fallo es 1 − ', v('p', tf(p)), ` = ${tf(q)}.`],
      ['Un orden concreto con ', v('k', k === 1 ? '1 éxito' : `${k} éxitos`), ` y ${n - k} ${n - k === 1 ? 'fallo' : 'fallos'} tiene probabilidad ${pot(p, k)}·${pot(q, n - k)} = ${tf(una)}.`],
      [`${k === 1 ? 'El éxito puede' : 'Los éxitos pueden'} caer en cualquiera de los `, v('n', `${n} intentos`), `: hay C(${n}, ${k}) = ${C(n, k)} órdenes.`],
      ['Probabilidad pedida = ', `${C(n, k)} · ${tf(una)} = `, v('X', tf(x)), '.'],
    ];
    return { correcta: prob(x), errores, variables, enunciado, pregunta, solucion, datos };
  }
  function resolverExactamente(d) {
    if (d.sub === 'distintas') {
      const f = d.p.map(x => Q(x[0], x[1])), g = f.map(comp);
      let s = Q(0);
      for (let m = 0; m < 8; m++) {
        const bits = [0, 1, 2].map(j => (m >> j) & 1);
        if (bits.reduce((a, b) => a + b) === d.k) s = suma(s, prodDe(bits.map((b, j) => (b ? f[j] : g[j]))));
      }
      return s;
    }
    const p = Q(d.p[0], d.p[1]);
    return prod(Q(C(d.n, d.k)), prod(potQ(p, d.k), potQ(comp(p), d.n - d.k)));
  }

  // =====================================================================================
  // bloques-prob: probabilidad con bloques
  // =====================================================================================
  const NOMBRES = ['Ana', 'Beto', 'Carla', 'Diego', 'Elena', 'Fabio', 'Gina', 'Hugo', 'Inés', 'Javier'];
  const CURSOS = ['Física', 'Química', 'Álgebra'];

  function bloquesProb(rng) {
    const sub = rng.elegir(['materias', 'materias', 'pareja']);
    if (sub === 'materias') {
      const m = rng.elegir([2, 3, 3]);
      const c = Array.from({ length: m }, () => rng.entero(m === 2 ? 2 : 1, m === 2 ? 4 : 3));
      const N = c.reduce((a, b) => a + b);
      if (N > 8 || N < 5 || c.filter(x => x >= 2).length < 2) return null;
      const datos = { tipo: 'bloques-prob', sub, libros: c };
      const x = resolverBloquesProb(datos);
      const pf = c.reduce((a, b) => a * fact(b), 1);
      const variables = { c: { nombre: 'cantidades de libros de cada curso', color: 'o' }, m: { nombre: 'bloques de cursos', color: 'i' }, N: { nombre: 'órdenes posibles', color: 'h' }, X: { nombre: 'probabilidad pedida', color: 'd' } };
      const cur = CURSOS.slice(0, m);
      const enunciado = ['En un estante se colocan al azar, uno al lado de otro, ', ...cur.map((cu, j) => [v('c', `${c[j]} libro${c[j] > 1 ? 's' : ''} de ${cu}`), j < m - 2 ? ', ' : (j === m - 2 ? ' y ' : '')]).flat(), ', todos distintos.'];
      const pregunta = ['¿Cuál es la ', v('X', 'probabilidad'), ' de que los libros de cada curso queden juntos?'];
      const errores = [
        eP('bloque-sin-permutar-dentro', Q(fact(m), fact(N)), 'Ordenaste los bloques, pero dentro de cada bloque los libros también se pueden ordenar (son distintos). Falta multiplicar por el factorial de cada bloque.'),
        eP('bloques-sin-ordenar', Q(pf, fact(N)), `Ordenaste los libros dentro de cada bloque, pero los ${m} bloques también pueden ir en cualquier orden en el estante: falta multiplicar por ${m}!.`),
        eP('suma-en-vez-de-producto', Q(fact(m) * c.reduce((a, b) => a + fact(b), 0), fact(N)), 'Sumaste los factoriales de los bloques. Cada orden de un bloque se combina con cada orden de los otros: se multiplican, no se suman.'),
        eP('bloques-sobre-bloques', Q(1, fact(m)), `Tomaste como casos posibles solo los ${m}! órdenes de los bloques y contaste uno solo como favorable, como si los libros ya vinieran agrupados en un orden de cursos fijo. Se ordenan al azar los ${N} libros: los casos posibles son ${N}!, y cualquier orden de los bloques sirve.`),
      ];
      const solucion = [
        [`Casos posibles: los ${N} libros se ordenan de `, v('N', `${N}! = ${P.formatear(fact(N))}`), ' maneras, todas igual de probables.'],
        ['Casos favorables: cada curso forma un bloque. Los ', v('m', `${m} bloques`), ` se ordenan de ${m}! = ${fact(m)} maneras, y dentro de cada uno los libros se ordenan de `, v('c', c.map(t => `${t}!`).join(', ')), ` maneras.`],
        [`Favorables = ${m}! · ${c.map(t => `${t}!`).join(' · ')} = ${fact(m)} · ${c.map(fact).join(' · ')} = ${P.formatear(fact(m) * pf)}.`],
        ['Probabilidad = ', `${P.formatear(fact(m) * pf)}/`, v('N', `${N}!`), ' = ', v('X', tf(x)), '.'],
      ];
      return { correcta: prob(x), errores, variables, enunciado, pregunta, solucion, datos };
    }
    // pareja: dos personas juntas, en fila o en ronda
    const lugar = rng.elegir(['fila', 'ronda']);
    const n = rng.entero(lugar === 'fila' ? 4 : 5, 8);
    const datos = { tipo: 'bloques-prob', sub, lugar, n };
    const x = resolverBloquesProb(datos);
    const variables = { n: { nombre: 'personas', color: 'o' }, b: { nombre: 'la pareja', color: 'i' }, X: { nombre: 'probabilidad pedida', color: 'd' } };
    const enunciado = lugar === 'fila'
      ? [v('n', `${n} amigos`), ', entre ellos ', v('b', 'Ana y Beto'), `, compran ${n} entradas seguidas para el cine y se reparten las butacas al azar.`]
      : [v('n', `${n} amigos`), ', entre ellos ', v('b', 'Ana y Beto'), `, se sientan al azar alrededor de una mesa redonda de ${n} sillas.`];
    const pregunta = ['¿Cuál es la ', v('X', 'probabilidad'), ' de que ', v('b', 'Ana y Beto'), ' queden uno al lado del otro?'];
    const errores = lugar === 'fila' ? [
      eP('bloque-sin-permutar-dentro', Q(1, n), `Contaste el bloque «Ana-Beto» en un solo orden. También puede ir «Beto-Ana»: los favorables son 2·${n - 1}!, no ${n - 1}!.`),
      eP('circulo-por-fila', Q(2, n - 1), `Ese resultado es el de una mesa redonda. En una fila de ${n} butacas hay solo ${n - 1} pares de butacas vecinas, porque las de los extremos tienen un solo vecino.`),
      eP('un-solo-par-de-asientos', Q(2, n * (n - 1)), `Esa es la probabilidad de que Ana y Beto ocupen dos butacas fijas. Hay ${n - 1} pares de butacas vecinas que les sirven.`),
    ] : [
      eP('AR17', Q(2, n), `Contaste como si fuera una fila (${n}! casos posibles). En una mesa redonda los giros no cambian la ubicación: los casos posibles son (${n} − 1)! = ${n - 1}!.`, 'parcial', INFORME),
      eP('bloque-sin-permutar-dentro', Q(1, n - 1), 'Contaste el bloque «Ana-Beto» en un solo orden. También puede ir «Beto-Ana»: falta multiplicar por 2.'),
      eP('un-solo-par-de-asientos', Q(2, n * (n - 1)), `Esa es la probabilidad de que Ana y Beto ocupen dos sillas fijas. En la mesa hay ${n} pares de sillas vecinas que les sirven.`),
      eP('pareja-sin-orden-ni-total', Q(1, n), `Contaste como si fuera una fila (${n}! casos posibles) y además el bloque en un solo orden: (${n} − 1)!/${n}! = 1/${n}. En la ronda los casos posibles son (${n} − 1)! y la pareja tiene 2 órdenes.`),
    ];
    const solucion = lugar === 'fila' ? [
      ['Casos posibles: las ', v('n', `${n} personas`), ` se ordenan de ${n}! = ${P.formatear(fact(n))} maneras.`],
      ['Favorables: ', v('b', 'Ana y Beto'), ` forman un bloque, que se ordena con los otros ${n - 2} como ${n - 1} piezas: ${n - 1}! maneras; y dentro del bloque, 2 órdenes (Ana-Beto o Beto-Ana).`],
      [`Favorables = 2 · ${n - 1}! = ${P.formatear(2 * fact(n - 1))}.`],
      ['Probabilidad = ', `${P.formatear(2 * fact(n - 1))}/${P.formatear(fact(n))} = `, v('X', tf(x)), '.'],
    ] : [
      ['En una mesa redonda, las ubicaciones que solo se diferencian por un giro son la misma: casos posibles = (', v('n', `${n}`), ` − 1)! = ${n - 1}! = ${P.formatear(fact(n - 1))}.`],
      ['Favorables: ', v('b', 'Ana y Beto'), ` forman un bloque; con los otros ${n - 2} son ${n - 1} piezas en ronda: (${n - 1} − 1)! = ${n - 2}! maneras; y dentro del bloque, 2 órdenes.`],
      [`Favorables = 2 · ${n - 2}! = ${P.formatear(2 * fact(n - 2))}.`],
      ['Probabilidad = ', `${P.formatear(2 * fact(n - 2))}/${P.formatear(fact(n - 1))} = `, v('X', tf(x)), '.'],
    ];
    return { correcta: prob(x), errores, variables, enunciado, pregunta, solucion, datos };
  }
  function resolverBloquesProb(d) {
    if (d.sub === 'materias') {
      const N = d.libros.reduce((a, b) => a + b);
      return Q(fact(d.libros.length) * d.libros.reduce((a, b) => a * fact(b), 1), fact(N));
    }
    return d.lugar === 'fila' ? Q(2 * fact(d.n - 1), fact(d.n)) : Q(2 * fact(d.n - 2), fact(d.n - 1));
  }

  // =====================================================================================
  // traspaso: de una caja a otra
  // =====================================================================================
  const CTX_URNA = [
    { id: 'canicas', obj: ['canica', 'canicas'], col: ['roja', 'rojas', 'azul', 'azules'], caja: 'bolsa', fem: true },
    { id: 'caramelos', obj: ['caramelo', 'caramelos'], col: ['de fresa', 'de fresa', 'de limón', 'de limón'], caja: 'bolsa', fem: false },
    { id: 'bolas', obj: ['bola', 'bolas'], col: ['blanca', 'blancas', 'negra', 'negras'], caja: 'caja', fem: true },
  ];

  function traspaso(rng) {
    const sub = rng.elegir(['una', 'una', 'dos']);
    const ctx = rng.elegir(CTX_URNA);
    const A = [rng.entero(2, 6), rng.entero(2, 6)], B = [rng.entero(1, 6), rng.entero(1, 6)];
    if (A[0] === A[1] && B[0] === B[1]) return null;
    if (A[0] + A[1] > 10 || B[0] + B[1] > 9) return null;
    const pasan = sub === 'una' ? 1 : 2;
    const datos = { tipo: 'traspaso', sub, contexto: ctx.id, A, B };
    const x = resolverTraspaso(datos);
    const nA = A[0] + A[1], nB = B[0] + B[1];
    const [o1, oN] = ctx.obj, [c1, cN, d1, dN] = ctx.col;
    const caja = ctx.caja;
    const lo = ctx.fem ? 'la' : 'el';
    const variables = { A: { nombre: `${caja} 1`, color: 'o' }, B: { nombre: `${caja} 2`, color: 'i' }, h: { nombre: `${caja} 2 después del traspaso`, color: 'h' }, X: { nombre: 'probabilidad pedida', color: 'd' } };
    const enunciado = [`La ${caja} 1 tiene `, v('A', `${A[0]} ${A[0] === 1 ? o1 : oN} ${A[0] === 1 ? c1 : cN} y ${A[1]} ${A[1] === 1 ? o1 : oN} ${A[1] === 1 ? d1 : dN}`), `; la ${caja} 2 tiene `,
      v('B', `${B[0]} ${B[0] === 1 ? o1 : oN} ${B[0] === 1 ? c1 : cN} y ${B[1]} ${B[1] === 1 ? o1 : oN} ${B[1] === 1 ? d1 : dN}`), '. ',
      pasan === 1 ? `Sin mirar, se saca ${ctx.fem ? 'una' : 'un'} ${o1} de la ${caja} 1 y se echa en la ${caja} 2. Luego se saca, también al azar, ${ctx.fem ? 'una' : 'un'} ${o1} de la ${caja} 2.`
        : `Sin mirar, se sacan ${ctx.fem ? 'dos' : 'dos'} ${oN} de la ${caja} 1, una tras otra y sin devolverlas, y se echan en la ${caja} 2. Luego se saca, al azar, ${ctx.fem ? 'una' : 'un'} ${o1} de la ${caja} 2.`.replace('una tras otra y sin devolverlas', ctx.fem ? 'una tras otra y sin devolverlas' : 'uno tras otro y sin devolverlos')];
    const pregunta = ['¿Cuál es la ', v('X', 'probabilidad'), ` de que ${lo} ${o1} que se saca de la ${caja} 2 sea ${c1}?`];
    let errores, solucion;
    if (pasan === 1) {
      const pR = Q(A[0], nA), pN = Q(A[1], nA);
      const rR = Q(B[0] + 1, nB + 1), rN = Q(B[0], nB + 1);
      errores = [
        eP('traspaso-ignora-la-pasada', Q(B[0], nB), `Calculaste con la ${caja} 2 como estaba al principio. Después del traspaso tiene ${nB + 1} ${oN}, y ${lo} ${o1} que llegó de la ${caja} 1 puede ser ${c1}.`),
        eP('traspaso-sin-aumentar-total', suma(prod(pR, Q(B[0] + 1, nB)), prod(pN, Q(B[0], nB))), `Sumaste ${lo} ${o1} que llega a los casos favorables, pero no al total: después del traspaso la ${caja} 2 tiene ${nB + 1} ${oN}, no ${nB}.`),
        eP('interseccion-por-total', prod(pR, rR), `Esa es solo una rama del árbol (que pase ${ctx.fem ? 'una' : 'un'} ${o1} ${c1} y luego salga ${c1}). También puede pasar ${ctx.fem ? 'una' : 'un'} ${o1} ${d1} y luego salir ${c1}: hay que sumar las dos ramas.`),
        eP('traspaso-ramas-sin-pesar', Q(2 * B[0] + 1, 2 * (nB + 1)), `Promediaste las dos ramas como si fueran igual de probables. Cada rama pesa la probabilidad de lo que pasó: ${tf(pR)} y ${tf(pN)}.`),
        eP('traspaso-junta-las-cajas', Q(A[0] + B[0], nA + nB), `Juntaste las dos ${caja}s. Solo pasa ${ctx.fem ? 'una' : 'un'} ${o1}; la extracción final es de la ${caja} 2.`),
      ];
      solucion = [
        ['Primero se pasa ', ctx.fem ? 'una' : 'un', ` ${o1} de la `, v('A', `${caja} 1`), ` (${nA} ${oN}): es ${c1} con probabilidad ${tf(pR)} y ${d1} con ${tf(pN)}.`],
        ['Después del traspaso, la ', v('h', `${caja} 2 tiene ${nB + 1} ${oN}`), `: si pasó ${ctx.fem ? 'una' : 'uno'} ${c1}, ${B[0] + 1} son ${cN}; si pasó ${ctx.fem ? 'una' : 'uno'} ${d1}, ${B[0]}.`],
        [`Rama ${c1}: ${tf(pR)} · ${tf(rR)} = ${tf(prod(pR, rR))}. Rama ${d1}: ${tf(pN)} · ${tf(rN)} = ${tf(prod(pN, rN))}.`],
        ['Probabilidad total = ', `${tf(prod(pR, rR))} + ${tf(prod(pN, rN))} = `, v('X', tf(x)), '.'],
      ];
    } else {
      const tot = C(nA, 2);
      const pk = [0, 1, 2].map(k => Q(C(A[0], k) * C(A[1], 2 - k), tot));
      const fin = k => Q(B[0] + k, nB + 2);
      errores = [
        eP('traspaso-ignora-la-pasada', Q(B[0], nB), `Calculaste con la ${caja} 2 como estaba al principio. Después del traspaso tiene ${nB + 2} ${oN}.`),
        eP('traspaso-sin-aumentar-total', sumaDe(pk.map((w, k) => prod(w, Q(B[0] + k, nB)))), `Sumaste a los favorables lo que llega, pero no al total: después del traspaso la ${caja} 2 tiene ${nB + 2} ${oN}, no ${nB}.`),
        eP('traspaso-junta-las-cajas', Q(A[0] + B[0], nA + nB), `Juntaste las dos ${caja}s. Solo pasan dos ${oN}; la extracción final es de la ${caja} 2.`),
        eP('interseccion-por-total', prod(pk[2], fin(2)), 'Esa es solo una rama del árbol (que pasen dos del color pedido). Hay que sumar las tres ramas: que pasen 0, 1 o 2 del color pedido.'),
      ];
      solucion = [
        ['De la ', v('A', `${caja} 1`), ` se sacan 2 de ${nA}, sin devolver: hay C(${nA}, 2) = ${tot} pares posibles.`],
        [`Pasan 0 ${cN}: C(${A[1]}, 2)/${tot} = ${C(A[1], 2)}/${tot}; pasa 1: ${A[0]}·${A[1]}/${tot} = ${A[0] * A[1]}/${tot}; pasan 2: C(${A[0]}, 2)/${tot} = ${C(A[0], 2)}/${tot}.`],
        ['Luego la ', v('h', `${caja} 2 tiene ${nB + 2} ${oN}`), `, de ${ctx.fem ? 'las' : 'los'} cuales ${B[0]}, ${B[0] + 1} o ${B[0] + 2} son ${cN}, según el caso.`],
        ['Probabilidad total = ', [0, 1, 2].map(k => `${C(A[0], k) * C(A[1], 2 - k)}/${tot} · ${tf(fin(k))}`).join(' + '), ' = ', v('X', tf(x)), '.'],
      ];
    }
    return { correcta: prob(x), errores, variables, enunciado, pregunta, solucion, datos };
  }
  function resolverTraspaso(d) {
    const { A, B } = d, nA = A[0] + A[1], nB = B[0] + B[1];
    if (d.sub === 'una') return suma(prod(Q(A[0], nA), Q(B[0] + 1, nB + 1)), prod(Q(A[1], nA), Q(B[0], nB + 1)));
    const tot = C(nA, 2);
    return sumaDe([0, 1, 2].map(k => prod(Q(C(A[0], k) * C(A[1], 2 - k), tot), Q(B[0] + k, nB + 2))));
  }

  // =====================================================================================
  // circular y fila: conteo con bloques
  // =====================================================================================
  function gruposTexto(n, a, b) {
    const g1 = NOMBRES.slice(0, a), g2 = b ? NOMBRES.slice(a, a + b) : [];
    return { g1: lista(g1), g2: lista(g2) };
  }

  function conteoBloques(rng, lugar) {
    const sub = rng.elegir(['uno', 'dos', 'dos']);
    const n = rng.entero(5, 8);
    const a = rng.entero(2, 3), b = sub === 'dos' ? rng.entero(2, 3) : 0;
    if (n - a - b < (lugar === 'circular' ? 1 : 1)) return null;
    const datos = { tipo: lugar, sub, n, a, ...(b ? { b } : {}) };
    const x = lugar === 'circular' ? resolverCircular(datos) : resolverFila(datos);
    const m = n - a - (b || 0) + (b ? 2 : 1);
    const fa = fact(a), fb = b ? fact(b) : 1;
    const { g1, g2 } = gruposTexto(n, a, b);
    const variables = { n: { nombre: 'personas', color: 'o' }, a: { nombre: 'primer grupo', color: 'i' }, ...(b ? { b: { nombre: 'segundo grupo', color: 'h' } } : {}), X: { nombre: 'número de maneras', color: 'd' } };
    const condicion = b ? [v('a', g1), ' quieren ir juntos, y también ', v('b', g2)] : [v('a', g1), ' quieren ir juntos'];
    const enunciado = lugar === 'circular'
      ? [v('n', `${n} amigos`), ' van a sentarse alrededor de una mesa redonda. ', ...condicion, '. Dos ubicaciones que solo se diferencian por un giro de la mesa cuentan como la misma.']
      : [v('n', `${n} amigos`), ` van a sentarse en ${n} butacas seguidas de una fila del cine. `, ...condicion, '.'];
    const pregunta = ['¿De cuántas ', v('X', 'maneras distintas'), ' pueden sentarse?'];
    const piezas = `${m} piezas (${b ? 'los dos bloques' : 'el bloque'}${n - a - b > 0 ? ` y ${n - a - b === 1 ? 'la persona suelta' : `las ${n - a - b} personas sueltas`}` : ''})`;
    const dentro = b ? [' y dentro de los bloques, ', v('a', `${a}! = ${fa}`), ' y ', v('b', `${b}! = ${fb}`), ' órdenes'] : [' y dentro del bloque, ', v('a', `${a}! = ${fa}`), ' órdenes'];
    let errores, solucion;
    if (lugar === 'circular') {
      errores = [
        eN('AR17', fact(m) * fa * fb, `Contaste las ${m} piezas como en una fila (${m}!). En una mesa redonda los giros no cambian la ubicación: se fija una pieza y se ordenan las demás, (${m} − 1)!.`, 'parcial', INFORME),
        eN('bloque-sin-permutar-dentro', fact(m - 1), `Ordenaste las piezas alrededor de la mesa, pero no a las personas ${b ? 'dentro de cada bloque' : 'dentro del bloque'}: ellas también pueden cambiar de lugar entre sí.`),
        b ? eN('un-bloque-sin-permutar', fact(m - 1) * fa, `Ordenaste por dentro el primer grupo, pero no el segundo: también se multiplica por ${b}!.`) : null,
        eN('sin-restriccion', fact(n - 1), `Esas son todas las maneras de sentar a ${n} personas en ronda, sin pedir que ${b ? 'los grupos' : 'el grupo'} vaya${b ? 'n' : ''} junto${b ? 's' : ''}.`),
        b ? eN('suma-en-vez-de-producto', fact(m - 1) * (fa + fb), 'Sumaste los órdenes de dentro de los bloques. Cada orden de un bloque se combina con cada orden del otro: se multiplican.') : null,
        !b && (fact(m - 1) * fa) % 2 === 0 ? eN('circular-como-collar', fact(m - 1) * fa / 2, 'Dividiste entre 2 como en un collar, que se puede voltear. En la mesa, ver la ronda en un sentido o en el otro da ubicaciones distintas: solo se descuentan los giros.') : null,
      ];
      solucion = [
        [`Cada grupo que va junto se cuenta como una sola pieza: quedan `, piezas, '.'],
        [`En ronda, ${m} piezas se ubican de (${m} − 1)! = ${fact(m - 1)} maneras`, ...dentro, '.'],
        ['Total = ', `${fact(m - 1)} · ${fa}${b ? ` · ${fb}` : ''} = `, v('X', P.formatear(x)), '.'],
      ];
    } else {
      errores = [
        eN('bloque-sin-permutar-dentro', fact(m), `Ordenaste las piezas en la fila, pero no a las personas ${b ? 'dentro de cada bloque' : 'dentro del bloque'}: ellas también pueden cambiar de lugar entre sí.`),
        b ? eN('un-bloque-sin-permutar', fact(m) * fa, `Ordenaste por dentro el primer grupo, pero no el segundo: también se multiplica por ${b}!.`) : null,
        eN('circulo-por-fila', fact(m - 1) * fa * fb, `Usaste (${m} − 1)!, que es para una mesa redonda. En una fila no hay giros que se repitan: las ${m} piezas se ordenan de ${m}! maneras.`),
        eN('sin-restriccion', fact(n), `Esas son todas las maneras de sentar a ${n} personas en fila, sin pedir que ${b ? 'los grupos' : 'el grupo'} vaya${b ? 'n' : ''} junto${b ? 's' : ''}.`),
        b ? eN('suma-en-vez-de-producto', fact(m) * (fa + fb), 'Sumaste los órdenes de dentro de los bloques. Cada orden de un bloque se combina con cada orden del otro: se multiplican.') : null,
        eN('bloques-sin-ordenar', fa * fb, `Ordenaste solo ${b ? 'dentro de los bloques' : 'dentro del bloque'}. Las ${m} piezas también se ordenan en la fila: falta multiplicar por ${m}!.`),
      ];
      solucion = [
        [`Cada grupo que va junto se cuenta como una sola pieza: quedan `, piezas, '.'],
        [`En fila, ${m} piezas se ordenan de ${m}! = ${P.formatear(fact(m))} maneras`, ...dentro, '.'],
        ['Total = ', `${P.formatear(fact(m))} · ${fa}${b ? ` · ${fb}` : ''} = `, v('X', P.formatear(x)), '.'],
      ];
    }
    return { correcta: entero(x), errores, variables, enunciado, pregunta, solucion, datos };
  }
  const circular = rng => conteoBloques(rng, 'circular');
  const fila = rng => conteoBloques(rng, 'fila');
  const unidades = d => d.n - d.a - (d.b || 0) + (d.b ? 2 : 1);
  const resolverCircular = d => fact(unidades(d) - 1) * fact(d.a) * fact(d.b || 1);
  const resolverFila = d => fact(unidades(d)) * fact(d.a) * fact(d.b || 1);

  // Respuesta exacta desde los datos (la usan papel.json y las pruebas como atajo, no como recálculo).
  function resolver(d) {
    if (d.tipo === 'bayes') return prob(resolverBayes(d).x);
    if (d.tipo === 'exactamente') return prob(resolverExactamente(d));
    if (d.tipo === 'bloques-prob') return prob(resolverBloquesProb(d));
    if (d.tipo === 'traspaso') return prob(resolverTraspaso(d));
    if (d.tipo === 'circular') return entero(resolverCircular(d));
    return entero(resolverFila(d));
  }

  return { id: ID, titulo: 'Probabilidad y conteo con condiciones', generar, resolver };
});
