/*
 * Generador: situaciones de planteo con un paso clave que engaña (razonamiento matemático).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['rm-planteo']) y en Node (require). No usa ningún motor.
 *
 * Tipos y sus _datos:
 *   lotes        { tipo, ctx, n, g, s, k, pide: 'paquetes'|'costo', precio }
 *                n personas (o filas) con g unidades cada una; ya hay s; se venden en paquetes de k.
 *   promocion    { tipo, ctx, k, sub: 'total'|'comprar'|'dinero', C | T | (D, precio) }
 *                un regalo por cada k comprados; los regalos no dan más regalos.
 *   canje        { tipo, k, C }  k envases vacíos por una llena; se canjean también los envases
 *                de las que te dieron; no se prestan envases.
 *   votos        { tipo, sub: 'pueden'|'asegurar'|'minimo', ... }
 *                pueden / asegurar: { votos: [líder, ...], E } (E electores; faltan E − contados)
 *                minimo: { E, b, n } (b votos en blanco o nulos; n candidatos)
 *                Gana quien tiene más votos que cada uno de los demás; un empate no es ganar.
 *   progresion   { tipo, ctx, n, d, a, pide: 'agregado'|'cada'|'final' }  n recipientes con a, a + d, …
 *   pista        { tipo, L, p, q, mismo, n }  por cada p m de Ana, Beto corre q m; marca del n-ésimo
 *                encuentro medida desde la salida en el sentido de Ana (la salida no cuenta).
 *   diana        { tipo, w: [exterior, medio, centro], u: [[e, m, c] × 3], nombres }
 *   torneo       { tipo, n, vueltas: 1|2, E, pide: 'empates'|'ganados' }  3 por victoria, 1 por empate
 *   fichas       { tipo, caras: [[a1, a2], [b1, b2], (…)] }  suma de todos los números de las caras
 *   cortes       { tipo, q, c, delta: 2|3, pide: 'cuadrados'|'cortes' }  c cortes, cada uno sobre un
 *                cuadrado entero distinto; delta = vértices que se ganan con cada corte.
 *
 * calc expone las funciones puras: lotes, regalos, comprarMinimo, canje, puedenGanar, asegurar,
 * minimoGanar, progresion, pista, diana, torneo, empatesDesde, fichas, cortes, cuadradosDesde.
 *
 * Errores (todos hipótesis salvo donde se dice): RMP1 (puntos contra intervalos), RMP50 a RMP57 y RMP59,
 * AR5 (dato intermedio), AR17 (orden: cada partido contado dos veces, parcial), RM4 (móviles) de
 * docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md.
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
  const h = (id, valor, explicacion, respaldo = 'hipotesis', fuente = null) => ({ id, valor, explicacion, respaldo, fuente });
  const f = x => P.formatear(x, 2);
  const v = P.v;
  const corto = x => Number.isFinite(x) && x > 0 && Math.abs(x * 100 - Math.round(x * 100)) < 1e-7;
  const ent = x => Number.isInteger(x) && x > 0;
  const pl = (x, uno, varios) => `${f(x)} ${x === 1 ? uno : varios}`;
  const ORD = ['', 'primera', 'segunda', 'tercera', 'cuarta', 'quinta', 'sexta'];
  const ORDM = ['', 'primer', 'segundo', 'tercer', 'cuarto', 'quinto', 'sexto'];
  const LETRAS = 'ABCDEFG';

  // ------------------------------------------------------------------ cálculo puro
  const calc = {
    lotes({ n, g, s, k }) {
      const N = n * g, faltan = N - s;
      return { necesarios: N, faltan, paquetes: Math.ceil(faltan / k) };
    },
    regalos({ C, k }) { const r = Math.floor(C / k); return { regalos: r, total: C + r }; },
    // Menor cantidad comprada C con la que se reciben al menos T unidades en total (por enumeración).
    comprarMinimo({ T, k }) { for (let C = 0; ; C++) if (C + Math.floor(C / k) >= T) return C; },
    // Se toman las llenas, se juntan los envases y se canjean mientras alcance (sin préstamo).
    canje({ C, k }) {
      let llenas = C, vacios = 0, total = 0;
      while (llenas > 0) { total += llenas; vacios += llenas; llenas = Math.floor(vacios / k); vacios -= llenas * k; }
      return { total, canjeadas: total - C, sobran: vacios };
    },
    // votos[0] es el líder. Un candidato puede ganar si, con todos los votos que faltan, supera al líder.
    puedenGanar({ votos, R }) {
      const L = Math.max(...votos);
      return votos.filter(x => x === L || x + R > L).length;
    },
    // Menor x de los R que faltan para que el líder gane pase lo que pase con el resto.
    asegurar({ votos, R }) {
      const [L, ...otros] = votos;
      for (let x = 0; x <= R; x++) if (otros.every(o => o + (R - x) < L + x)) return x;
      return null;
    },
    // Menor número de votos con el que uno de n candidatos puede ganar entre V votos válidos.
    minimoGanar({ V, n }) { for (let x = 1; x <= V; x++) if (V - x <= (n - 1) * (x - 1)) return x; return null; },
    progresion({ n, d, a }) {
      const terminos = Array.from({ length: n }, (_, i) => a + i * d);
      const S = terminos.reduce((s, x) => s + x, 0), mayor = terminos[n - 1];
      return { terminos, S, mayor, agregado: n * mayor - S, final: n * mayor };
    },
    // Marca (m, en el sentido de Ana) del n-ésimo encuentro, sin contar la salida.
    pista({ L, p, q, mismo, n }) {
      const rel = mismo ? p - q : p + q;
      const recorrido = n * L * p / rel;
      return { recorrido, marca: ((recorrido % L) + L) % L };
    },
    diana({ w, u }) { return u.map(x => x[0] * w[0] + x[1] * w[1] + x[2] * w[2]); },
    torneo({ n, vueltas, E }) { const M = vueltas * n * (n - 1) / 2; return { partidos: M, puntos: 3 * (M - E) + 2 * E }; },
    empatesDesde({ n, vueltas, T }) { const M = vueltas * n * (n - 1) / 2; return 3 * M - T; },
    fichas(caras) {
      let sumas = [0];
      for (const c of caras) sumas = sumas.flatMap(s => c.map(x => s + x));
      const lista = [...new Set(sumas)].sort((a, b) => a - b);
      return { sumas: lista, total: caras.flat().reduce((s, x) => s + x, 0) };
    },
    cortes({ q, c, delta }) { return { piezas: q + c, vertices: 4 * q + delta * c }; },
    cuadradosDesde({ P: piezas, V, delta }) { return (V - delta * piezas) / (4 - delta); },
  };

  // ------------------------------------------------------------------ armado
  const TIPOS = ['lotes', 'promocion', 'promocion', 'canje', 'votos', 'votos', 'votos', 'progresion', 'pista', 'diana', 'torneo', 'fichas', 'cortes'];

  function generar(semilla) {
    const rng = Azar.crear('rm-planteo|' + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 3000; intento++) {
      const pr = CONSTRUIR[tipo](rng, semilla);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function cerrar(rng, semilla, o) {
    const errores = o.errores.filter(e => (o.decimal ? corto(e.valor) : ent(e.valor)));
    const alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.texto });
    const pr = {
      id: `rm-planteo#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: o.correcta, unidad: o.unidad || '' }, _datos: o.datos,
    };
    if (o.figura) pr.figura = o.figura;
    return pr;
  }

  // ---------------------------------------------------------------- lotes
  const CTX_LOTES = [
    { item: 'panes', cont: 'bolsas', uno: 'bolsa', frase: (n, g) => ['En la chocolatada del barrio se darán ', g, ' panes a cada uno de los ', n, ' niños. '] },
    { item: 'ladrillos', cont: 'paquetes', uno: 'paquete', frase: (n, g) => ['Un muro tendrá ', n, ' filas con ', g, ' ladrillos en cada fila. '] },
    { item: 'hojas', fem: true, cont: 'paquetes', uno: 'paquete', frase: (n, g) => ['Para un concurso, cada uno de los ', n, ' alumnos necesita ', g, ' hojas. '] },
    { item: 'botellas de agua', fem: true, cont: 'packs', uno: 'pack', frase: (n, g) => ['En una caminata a la laguna, cada uno de los ', n, ' participantes recibirá ', g, ' botellas de agua. '] },
  ];
  function lotes(rng, semilla) {
    const ci = rng.entero(0, CTX_LOTES.length - 1), cx = CTX_LOTES[ci];
    const n = rng.entero(12, 40), g = rng.entero(2, 6), k = rng.elegir([6, 8, 10, 12, 15, 20, 24, 25]);
    const N = n * g, s = rng.entero(3, Math.floor(N / 3));
    const { faltan: M, paquetes: Pq } = calc.lotes({ n, g, s, k });
    if (M % k === 0 || Pq < 3) return null;
    const pide = rng.elegir(['paquetes', 'paquetes', 'costo']);
    const precio = pide === 'costo' ? rng.elegir([3, 4, 5, 6, 8, 9, 12, 15]) : null;
    const fl = Math.floor(M / k);
    const enunciado = [...cx.frase(v('n', n), pide === 'paquetes' ? v('g', g) : String(g)).map(x => (typeof x === 'number' ? String(x) : x)),
      `${cx.fem ? 'Las' : 'Los'} ${cx.item} se venden en ${cx.cont} de `, v('k', k), `, y no se venden ${cx.fem ? 'sueltas' : 'sueltos'}. Ya tienen `, v('s', s), ` ${cx.item}.`,
      ...(pide === 'costo' ? [` Cada ${cx.uno} cuesta `, v('p', `S/ ${precio}`), '.'] : [])];
    const variables = { n: { nombre: ci === 1 ? 'filas' : 'personas', color: 'o' }, k: { nombre: 'unidades por paquete', color: 'i' }, s: { nombre: 'lo que ya tienen', color: 'h' } };
    if (pide === 'costo') variables.p = { nombre: 'precio del paquete', color: 'd' }; else variables.g = { nombre: 'unidades de cada uno', color: 'd' };
    const m = pide === 'costo' ? precio : 1;
    const base = [
      h('RMP50-hacia-abajo', fl * m, `Redondeaste hacia abajo: con ${pl(fl, cx.uno, cx.cont)} tienes ${fl * k} ${cx.item} y todavía ${M - fl * k === 1 ? 'falta' : 'faltan'} ${M - fl * k}. Como no se venden ${cx.fem ? 'sueltas' : 'sueltos'}, hay que comprar ${cx.uno === 'bolsa' ? 'una bolsa' : 'un ' + cx.uno} más: se redondea hacia arriba.`),
      h('RMP51-sin-lo-que-hay', Math.ceil(N / k) * m, `Calculaste para ${cx.fem ? 'las' : 'los'} ${N} ${cx.item} que se necesitan, sin restar ${cx.fem ? 'las' : 'los'} ${s} que ya tienen.`),
      h('RMP51-sin-lo-que-hay-y-abajo', Math.floor(N / k) * m, `No restaste ${cx.fem ? 'las' : 'los'} ${s} que ya tienen y, además, redondeaste hacia abajo.`),
      h('RMP50-sin-redondear', M / k * m, pide === 'costo' ? `Pagaste solo la parte de ${cx.uno} que se usa, como si se vendieran ${cx.fem ? 'sueltas' : 'sueltos'}. Se compran ${cx.cont} complet${cx.uno === 'bolsa' ? 'as' : 'os'}: ${Pq} en total.` : `Dejaste el cociente con decimales. No se puede comprar una parte de ${cx.uno}: hay que redondear hacia arriba.`),
      h('AR5-dato-intermedio', pide === 'costo' ? Pq : M, pide === 'costo' ? `Ese es el número de ${cx.cont}; la pregunta pide cuánto se gasta.` : `${cx.fem ? 'Esas son las' : 'Esos son los'} ${cx.item} que faltan; la pregunta pide cuánt${cx.uno === 'bolsa' ? 'as' : 'os'} ${cx.cont} comprar.`),
    ];
    const correcta = Pq * m;
    const texto = pide === 'costo' ? (x => `S/ ${f(x)}`) : (x => (Number.isInteger(x) ? pl(x, cx.uno, cx.cont) : `${f(x)} ${cx.cont}`));
    const solucion = [
      ['Se necesitan ', v('n', n), ' × ', pide === 'paquetes' ? v('g', g) : String(g), ` = ${N} ${cx.item}; ya hay `, v('s', s), `, así que faltan ${N} − ${s} = ${M}.`],
      [`${M} ÷ `, v('k', k), ` = ${fl} y ${M - fl * k === 1 ? 'sobra' : 'sobran'} ${M - fl * k}: con ${fl} ${cx.cont} no alcanza. Hay que comprar ${Pq}, porque se redondea hacia arriba.`],
      ...(pide === 'costo' ? [[`Costo: ${Pq} × `, v('p', `S/ ${precio}`), ` = S/ ${f(correcta)}.`]] : []),
    ];
    return cerrar(rng, semilla, { correcta, errores: base, decimal: true, texto, variables, enunciado, solucion,
      pregunta: [pide === 'costo' ? '¿Cuánto gastarán, como mínimo, en lo que falta?' : `¿${cx.uno === 'bolsa' ? 'Cuántas' : 'Cuántos'} ${cx.cont} deben comprar, como mínimo?`],
      datos: { tipo: 'lotes', ctx: ci, n, g, s, k, pide, precio } });
  }

  // ---------------------------------------------------------------- promoción
  const CTX_PROMO = [
    { item: 'cuadernos', uno: 'cuaderno', lugar: 'una librería de Puno' },
    { item: 'panetones', uno: 'panetón', lugar: 'un mercado' },
    { item: 'polos', uno: 'polo', lugar: 'una feria de Juliaca' },
    { item: 'bolsas de arroz', uno: 'bolsa de arroz', lugar: 'una bodega', fem: true },
  ];
  function promocion(rng, semilla) {
    const ci = rng.entero(0, CTX_PROMO.length - 1), cx = CTX_PROMO[ci];
    const k = rng.elegir([4, 5, 6, 8, 10, 12]);
    const sub = rng.elegir(['total', 'comprar', 'dinero']);
    const regla = [`En ${cx.lugar}, por cada `, v('k', k), ` ${cx.item} que compras te regalan ${cx.fem ? 'una' : 'uno'}. Los regalos no cuentan para recibir más regalos.`];
    const variables = { k: { nombre: 'comprados por regalo', color: 'i' } };
    if (sub === 'total' || sub === 'comprar') variables.C = { nombre: 'comprados', color: 'o' };
    if (sub === 'comprar') variables.T = { nombre: 'lo que se quiere recibir', color: 'h' };
    if (sub === 'dinero') variables.D = { nombre: 'dinero', color: 'd' };
    const tx = x => pl(x, cx.uno, cx.item);
    if (sub === 'total' || sub === 'dinero') {
      let C, D, precio;
      if (sub === 'total') { C = rng.entero(k * k, 160); }
      else { precio = rng.elegir([3, 4, 5, 6, 8, 12, 15]); D = rng.entero(k * k * precio, 1200); C = Math.floor(D / precio); if (D % precio === 0) return null; }
      if (C % k === 0 || C < k * k) return null;
      const { regalos: r, total } = calc.regalos({ C, k });
      let cadena = 0, b = r; while (b >= 1) { cadena += b; b = Math.floor(b / k); }
      const errores = [
        h('RMP52-regalo-de-regalo', C + cadena, `Hiciste que los regalos dieran más regalos. El enunciado dice que los regalos no cuentan: solo se cuentan los ${C} comprados.`),
        h('RMP50-hacia-arriba', C + Math.ceil(C / k), `Redondeaste hacia arriba los regalos. Con ${C} comprados se completan ${r} grupos de ${k}; ${C - r * k === 1 ? `${cx.fem ? 'la' : 'el'} 1 que sobra no alcanza` : `${cx.fem ? 'las' : 'los'} ${C - r * k} que sobran no alcanzan`} para otro regalo.`),
        h('AR5-solo-regalos', r, `Esos son solo los regalos. La pregunta pide todo lo que recibes: lo comprado más lo regalado.`),
        ...(sub === 'dinero' ? [h('RMP51-sin-regalos', C, 'Esos son los que alcanzas a comprar. Falta sumar los regalos.'),
          h('RMP50-dinero-hacia-arriba', Math.ceil(D / precio) + Math.floor(Math.ceil(D / precio) / k), `Redondeaste hacia arriba lo que alcanzas a comprar. Con S/ ${D} no completas ${Math.ceil(D / precio)} ${cx.item}: solo puedes comprar ${C}.`)] : []),
        h('RMP52-sobre-el-total', C + Math.floor((C + r) / k), 'Calculaste los regalos sobre el total que recibes. Los regalos se cuentan solo sobre lo comprado.'),
      ];
      const enunciado = sub === 'total'
        ? [...regla, ' Rosa compra ', v('C', C), ` ${cx.item}.`]
        : [...regla, ` Cada ${cx.uno} cuesta S/ ${precio}, y Rosa compra ${cx.fem ? 'todas las' : 'todos los'} ${cx.item} que le alcanzan con `, v('D', `S/ ${D}`), '.'];
      const solucion = [
        ...(sub === 'dinero' ? [['Con ', v('D', `S/ ${D}`), ` alcanza para ${D} ÷ ${precio} = ${f(D / precio)}, o sea, ${C} ${cx.item} (no se compra una parte).`]] : []),
        ['Regalos: ', sub === 'total' ? v('C', C) : String(C), ' ÷ ', v('k', k), ` = ${r} (${C - r * k === 1 ? 'sobra 1, que no completa' : `sobran ${C - r * k}, que no completan`} otro grupo).`],
        [`Recibe ${C} + ${r} = ${total} ${cx.item}. Los regalos no dan más regalos, así que ahí termina la cuenta.`],
      ];
      return cerrar(rng, semilla, { correcta: total, errores, texto: tx, variables, enunciado, solucion,
        pregunta: [`¿${cx.fem ? 'Cuántas' : 'Cuántos'} ${cx.item} recibe en total, contando ${cx.fem ? 'las regaladas' : 'los regalados'}?`],
        datos: sub === 'total' ? { tipo: 'promocion', ctx: ci, k, sub, C } : { tipo: 'promocion', ctx: ci, k, sub, D, precio } });
    }
    // comprar: se quiere recibir T en total
    const T = rng.entero(k * k, 180);
    const C = calc.comprarMinimo({ T, k });
    const sobreTotal = T - Math.floor(T / k);
    const errores = [
      h('RMP52-sobre-el-total', sobreTotal, `Calculaste los regalos sobre los ${T} que quieres recibir (${Math.floor(T / k)} regalos). Los regalos salen solo de lo comprado: con ${sobreTotal} comprados te regalan ${Math.floor(sobreTotal / k)}${sobreTotal + Math.floor(sobreTotal / k) > T ? ' y te pasas: podrías comprar menos' : ' y no llegas'}.`),
      h('RMP51-sin-regalos', T, 'Olvidaste los regalos: si compras todo, pagas de más.'),
      h('RMP50-hacia-abajo', Math.floor(T * k / (k + 1)), `Redondeaste hacia abajo: con ${Math.floor(T * k / (k + 1))} comprados recibes ${Math.floor(T * k / (k + 1)) + Math.floor(Math.floor(T * k / (k + 1)) / k)}, que no llega a ${T}.`),
      h('AR5-solo-regalos', T - C, `Esos son los regalos que recibes. La pregunta pide ${cx.fem ? 'cuántas' : 'cuántos'} compras.`),
      h('RMP52-sobre-el-total-arriba', T - Math.ceil(T / k), `Calculaste los regalos sobre los ${T} que quieres recibir y redondeaste hacia arriba. Los regalos salen solo de lo comprado.`),
    ].filter(e => !(e.id === 'RMP50-hacia-abajo' && e.valor + Math.floor(e.valor / k) >= T));
    const enunciado = [...regla, ' Rosa necesita tener ', v('T', T), ` ${cx.item} en total, contando ${cx.fem ? 'las regaladas' : 'los regalados'}.`];
    const rC = Math.floor(C / k);
    const solucion = [
      ['Si compra ', v('C', 'C'), `, recibe C + (regalos) = C + ⌊C ÷ ${k}⌋. Hay que buscar el menor C que llegue a `, v('T', T), '.'],
      [`Por cada ${k} comprados recibe ${k + 1}: ${T} × ${k} ÷ ${k + 1} = ${f(T * k / (k + 1))} es una primera estimación.`],
      [`Con C = ${C}: ${C} + ${rC} = ${C + rC} (llega). Con C = ${C - 1}: ${C - 1} + ${Math.floor((C - 1) / k)} = ${C - 1 + Math.floor((C - 1) / k)} (no llega). Compra `, v('C', C), '.'],
    ];
    return cerrar(rng, semilla, { correcta: C, errores, texto: tx, variables, enunciado, solucion,
      pregunta: [`¿${cx.fem ? 'Cuántas' : 'Cuántos'} ${cx.item} debe comprar, como mínimo?`],
      datos: { tipo: 'promocion', ctx: ci, k, sub, T } });
  }

  // ---------------------------------------------------------------- canje
  function canje(rng, semilla) {
    const k = rng.elegir([3, 4, 5, 6]), C = rng.entero(k * k + 1, 70);
    const { total, canjeadas } = calc.canje({ C, k });
    let cad = C, b = C; while (b >= k) { b = Math.floor(b / k); cad += b; }
    const errores = [
      h('RMP52-un-solo-canje', C + Math.floor(C / k), 'Canjeaste una sola vez. Las botellas que te dan también dejan envases, y esos envases se vuelven a canjear.'),
      h('RMP52-bota-sobrantes', cad, 'En cada canje botaste los envases que sobraban. Esos envases se guardan y se juntan con los de la siguiente ronda.'),
      h('RMP52-prestado', C + Math.floor(C / (k - 1)), 'Hiciste la cuenta como si te prestaran un envase al final. El enunciado dice que no te prestan envases.'),
      h('AR5-solo-canjeadas', canjeadas, 'Esas son solo las botellas que te dan por los envases. La pregunta pide todas las que tomas, también las compradas.'),
    ];
    const enunciado = ['En una bodega, por cada ', v('k', k), ' botellas vacías de chicha te dan una botella llena. Compras ', v('C', C),
      ' botellas llenas. Cada botella que tomas deja su envase, y también canjeas los envases de las botellas que te dan. No te prestan envases.'];
    // Rondas de canje para la solución.
    const rondas = []; let llenas = C, vac = 0;
    while (true) { vac += llenas; const nuevas = Math.floor(vac / k); if (!nuevas) break; rondas.push(`${vac} envases → ${nuevas} ${nuevas === 1 ? 'llena' : 'llenas'} (${vac - nuevas * k === 1 ? 'sobra' : 'sobran'} ${vac - nuevas * k})`); vac -= nuevas * k; llenas = nuevas; }
    const solucion = [
      ['Se toman las ', v('C', C), ' y quedan ', v('C', C), ' envases. Se canjea de ', v('k', k), ' en ', v('k', k), ', y lo que sobra se guarda para la ronda siguiente.'],
      [rondas.join('; ') + '.'],
      [`Al final quedan menos de ${k} envases y ya no se puede canjear. Tomas ${C} + ${canjeadas} = ${total} botellas.`],
    ];
    return cerrar(rng, semilla, { correcta: total, errores, texto: x => pl(x, 'botella', 'botellas'), enunciado, solucion,
      variables: { k: { nombre: 'envases por botella', color: 'i' }, C: { nombre: 'botellas compradas', color: 'o' } },
      pregunta: ['¿Cuántas botellas tomas en total, como máximo?'], datos: { tipo: 'canje', k, C } });
  }

  // ---------------------------------------------------------------- votos
  function tablaVotos(votos) {
    const partes = [];
    votos.forEach((x, i) => { partes.push(`${LETRAS[i]}: `, v('c', f(x))); partes.push(i < votos.length - 1 ? '; ' : '.'); });
    return partes;
  }
  function votos(rng, semilla) {
    const sub = rng.elegir(['pueden', 'asegurar', 'minimo']);
    if (sub === 'minimo') return votosMinimo(rng, semilla);
    const n = rng.entero(4, 6);
    const L = rng.entero(60, 300);
    const otros = new Set();
    while (otros.size < n - 1) otros.add(rng.entero(Math.floor(L * 0.3), L - 1));
    const vs = [L, ...[...otros].sort((a, b) => b - a)];
    const contados = vs.reduce((s, x) => s + x, 0);
    const v2 = vs[1];
    let R;
    if (sub === 'pueden') {
      // Que alguno quede justo empatado (para la trampa del empate) y que no todos puedan.
      const idx = rng.entero(2, n - 1);
      R = rng.moneda() ? L - vs[idx] : rng.entero(L - v2 + 1, L - vs[n - 1] - 1);
      if (R <= L - v2) return null;
    } else {
      R = rng.entero(L - v2 + 2, L - v2 + 120);
    }
    if (R < 2) return null;
    const E = contados + R;
    const enunciado = ['En la elección del municipio escolar votan ', v('E', E), ' alumnos y cada uno vota por uno de los candidatos. Hasta ahora se contaron estos votos: ',
      ...tablaVotos(vs), ' Gana quien tenga más votos que cada uno de los demás; si hay empate en el primer lugar, nadie gana.'];
    const variables = { E: { nombre: 'votantes', color: 'o' }, c: { nombre: 'votos contados', color: 'i' }, R: { nombre: 'votos por contar', color: 'h' }, x: { nombre: 'lo que se pide', color: 'd' } };
    const pasoR = ['Faltan contar ', v('E', E), ` − ${contados} = `, v('R', R), ' votos.'];
    if (sub === 'pueden') {
      const correcta = calc.puedenGanar({ votos: vs, R });
      const errores = [
        h('RMP53-empate-gana', vs.filter(x => x === L || x + R >= L).length, 'Contaste a quien, con todos los votos que faltan, solo empata con el líder. El enunciado dice que un empate no es ganar.'),
        h('RMP54-contra-segundo', 2 + vs.slice(2).filter(x => x + R > v2).length, `Comparaste a cada uno con el segundo (${LETRAS[1]}). Para ganar hay que superar al líder ${LETRAS[0]}, que ya tiene ${L}.`),
        h('RMP54-sin-lider', correcta - 1, `Olvidaste contar al líder ${LETRAS[0]}: él también puede ganar.`),
        h('RMP54-lider-recibe', 1, 'Le diste también al líder los votos que faltan. Para saber si alguien puede ganar, se imagina el caso más favorable para él: todos los votos que faltan para él y ninguno para los demás.'),
        h('RMP51-con-todos-los-votos', calc.puedenGanar({ votos: vs, R: E }), `Usaste los ${E} votantes como si faltara contarlos a todos. Solo faltan los que todavía no se contaron.`),
      ];
      const puede = vs.map((x, i) => `${LETRAS[i]}: ${i === 0 ? 'es el líder' : `${x} + ${R} = ${x + R} ${x + R > L ? '>' : x + R === L ? '=' : '<'} ${L}`}`);
      const solucion = [pasoR,
        [`Cada uno, en su mejor caso, se lleva todos los votos que faltan y el líder ${LETRAS[0]} ninguno. Tiene que pasar de ${L}, porque empatar no es ganar.`],
        [puede.join('; ') + '.'],
        ['Pueden ganar ', v('x', correcta), ` candidatos (el líder incluido).`],
      ];
      return cerrar(rng, semilla, { correcta, errores, texto: x => pl(x, 'candidato', 'candidatos'), variables, enunciado, solucion,
        pregunta: ['¿Cuántos candidatos todavía pueden ganar?'], datos: { tipo: 'votos', sub, votos: vs, E } });
    }
    // asegurar
    const correcta = calc.asegurar({ votos: vs, R });
    const dif = v2 + R - L;
    const R2 = E - L - v2;
    const errores = [
      h('RMP54-sin-descontar', dif + 1, `Hiciste que ${LETRAS[1]} se llevara todos los ${R} votos que faltan aunque ${LETRAS[0]} también recibe algunos. Los votos que se lleva ${LETRAS[0]} ya no pueden ir a ${LETRAS[1]}.`),
      h('RMP53-empate-gana', dif / 2, `Con esos votos, ${LETRAS[0]} puede quedar empatado con ${LETRAS[1]}. Un empate no es ganar: hace falta uno más.`),
      h('AR5-total-del-lider', L + correcta, `Ese es el total de votos que tendría ${LETRAS[0]}. La pregunta pide cuántos de los votos que faltan necesita.`),
      h('RMP51-sin-otros', Math.floor((v2 + R2 - L) / 2) + 1, `Calculaste los votos que faltan restando solo los de ${LETRAS[0]} y ${LETRAS[1]}. También hay que restar los votos ya contados de los demás candidatos.`),
      h('RMP54-contra-ultimo', Math.floor((vs[n - 1] + R - L) / 2) + 1, `Comparaste con el último candidato. El peligro es el que más votos tiene después del líder: ${LETRAS[1]}.`),
    ];
    const solucion = [pasoR,
      [`Si ${LETRAS[0]} recibe `, v('x', 'x'), ` de esos votos, en el peor caso los otros ${R} − x van todos a ${LETRAS[1]}, el más cercano.`],
      [`${LETRAS[0]} gana con seguridad si ${L} + x > ${v2} + (${R} − x), o sea, 2x > ${dif}, x > ${f(dif / 2)}.`],
      ['El menor entero es ', v('x', correcta), ` (con ${correcta - 1}, ${LETRAS[1]} podría ${2 * (correcta - 1) === dif ? 'empatar' : 'pasarlo'}).`],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => pl(x, 'voto', 'votos'), variables, enunciado, solucion,
      pregunta: [`¿Cuántos de los votos que faltan necesita ${LETRAS[0]}, como mínimo, para ganar con seguridad?`], datos: { tipo: 'votos', sub, votos: vs, E } });
  }
  function votosMinimo(rng, semilla) {
    const n = rng.entero(3, 7), E = rng.entero(80, 600), b = rng.entero(5, 40);
    const V = E - b;
    const correcta = calc.minimoGanar({ V, n });
    const errores = [
      h('RMP53-partes-iguales', Math.floor(V / n), `Repartiste los votos en partes iguales. Con ${Math.floor(V / n)} votos, otro candidato puede tener ${V % n === 0 ? 'los mismos y empatar' : 'tanto o más'}: hay que tener más que cada uno de los demás.`),
      h('RMP50-mas-uno-sin-revisar', Math.floor(V / n) + 1, `Sumaste uno al reparto en partes iguales sin comprobar: con ${Math.floor(V / n) + 1} votos, los demás tendrían a lo más ${Math.floor(V / n)} cada uno y juntos no llegan a los ${V - Math.floor(V / n) - 1} votos que quedan.`),
      h('RMP51-con-blancos', calc.minimoGanar({ V: E, n }), `Repartiste los ${E} votos, pero ${b} son blancos o nulos y no son de ningún candidato.`),
      h('RMP54-mitad', Math.floor(V / 2) + 1, 'Pediste más de la mitad de los votos. Para ganar no hace falta la mitad: basta tener más que cada uno de los otros candidatos.'),
    ];
    const enunciado = ['En una elección votan ', v('E', E), ' personas. De esos votos, ', v('b', b), ' son blancos o nulos y el resto se reparte entre ', v('n', n),
      ' candidatos. Gana quien tenga más votos que cada uno de los demás (un empate no es ganar).'];
    const solucion = [
      ['Votos válidos: ', v('E', E), ' − ', v('b', b), ` = ${V}.`],
      [`Si el ganador tiene `, v('x', 'x'), ` votos, cada uno de los otros ${n - 1} puede tener a lo más x − 1. Para que todos los votos quepan: x + ${n - 1}(x − 1) ≥ ${V}, o sea, ${n}x ≥ ${V + n - 1}.`],
      [`x ≥ ${f((V + n - 1) / n)}: el menor entero es `, v('x', correcta), `. Comprobación: ${correcta} + ${n - 1} × ${correcta - 1} = ${correcta + (n - 1) * (correcta - 1)} ≥ ${V}; con ${correcta - 1} votos, ${correcta - 1} + ${n - 1} × ${correcta - 2} = ${correcta - 1 + (n - 1) * (correcta - 2)} < ${V}.`],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: x => pl(x, 'voto', 'votos'), enunciado, solucion,
      variables: { E: { nombre: 'votantes', color: 'o' }, b: { nombre: 'blancos o nulos', color: 'h' }, n: { nombre: 'candidatos', color: 'i' }, x: { nombre: 'votos del ganador', color: 'd' } },
      pregunta: ['¿Con cuántos votos, como mínimo, puede ganar un candidato?'], datos: { tipo: 'votos', sub: 'minimo', E, b, n } });
  }

  // ---------------------------------------------------------------- progresión
  const CTX_PROG = [
    { cosa: 'mangos', uno: 'mango', donde: 'canastas', una: 'canasta', m: false, fc: false },
    { cosa: 'libros', uno: 'libro', donde: 'estantes', una: 'estante', m: true, fc: false },
    { cosa: 'sillas', uno: 'silla', donde: 'aulas', una: 'aula', m: false, fc: true },
  ];
  function progresion(rng, semilla) {
    const ci = rng.entero(0, CTX_PROG.length - 1), cx = CTX_PROG[ci];
    const n = rng.entero(4, 8), d = rng.entero(2, 7), a = rng.entero(3, 30);
    const pide = rng.elegir(['agregado', 'cada', 'final']);
    const pr = calc.progresion({ n, d, a });
    const prom = pr.S / n;
    const alProm = pr.terminos.filter(x => x < prom).reduce((s, x) => s + (prom - x), 0);
    const la = cx.m ? 'el' : 'la', todas = cx.m ? 'todos' : 'todas', cuantos = cx.fc ? 'Cuántas' : 'Cuántos';
    const enunciado = ['Hay ', v('n', n), ` ${cx.donde} con ${cx.cosa}. Cada ${cx.una} tiene `, v('d', d), ` ${cx.cosa} más que ${la} anterior, y entre ${todas} hay `, v('S', pr.S),
      ` ${cx.cosa}. Se agregan ${cx.cosa} (sin quitar ${cx.fc ? 'ninguna' : 'ninguno'}) para que ${todas} tengan la misma cantidad, agregando lo menos posible.`];
    const tx = x => pl(x, cx.uno, cx.cosa);
    let correcta, errores, pregunta;
    if (pide === 'agregado') {
      correcta = pr.agregado;
      errores = [
        h('RMP56-promedio', alProm, `Llevaste a cada una al promedio (${f(prom)}). Sin quitar nada, lo que ya pasa el promedio no baja: hay que llegar a la cantidad mayor.`),
        h('RMP1-n-diferencias', d * n * (n + 1) / 2, `Contaste ${n} saltos de ${d}. Entre ${n} ${cx.donde} hay ${n - 1} saltos: a la primera le faltan ${(n - 1) * d}, no ${n * d}.`),
        h('AR5-solo-la-primera', (n - 1) * d, `Eso es lo que le falta solo a la primera ${cx.una}. Hay que sumar lo que le falta a cada ${cx.una}.`),
      ];
      pregunta = [`¿${cuantos} ${cx.cosa} se agregan en total?`];
    } else if (pide === 'cada') {
      correcta = pr.mayor;
      errores = [
        h('RMP56-promedio', prom, `Ese es el promedio. Sin quitar nada, la cantidad mayor no baja: hay que llegar a ${pr.mayor} en cada ${cx.una}.`),
        h('RMP1-n-diferencias', a + n * d, `Contaste ${n} saltos de ${d} desde la primera. Entre ${n} ${cx.donde} hay ${n - 1} saltos.`),
        h('AR5-la-menor', a, `Esa es la cantidad menor. Se iguala a la mayor, no a la menor.`),
        h('AR5-lo-agregado', pr.agregado, `Eso es lo que se agrega en total. La pregunta pide cuánto queda en cada ${cx.una}.`),
      ];
      pregunta = [`¿${cuantos} ${cx.cosa} quedan en cada ${cx.una}?`];
    } else {
      correcta = pr.final;
      errores = [
        h('RMP56-promedio', pr.S, `Igualaste al promedio, como si se pudieran pasar ${cx.cosa} de un lado a otro. No se quita nada: cada ${cx.una} sube hasta la cantidad mayor, y el total crece.`),
        h('RMP1-n-diferencias', n * (a + n * d), `Contaste ${n} saltos de ${d} para la mayor. Entre ${n} ${cx.donde} hay ${n - 1} saltos.`),
        h('AR5-cada-una', pr.mayor, `Eso es lo que queda en cada ${cx.una}. La pregunta pide el total.`),
        h('AR5-lo-agregado', pr.agregado, `Eso es lo que se agrega. Falta sumarlo a los ${pr.S} que ya había.`),
      ];
      pregunta = [`¿${cuantos} ${cx.cosa} hay en total al final?`];
    }
    const solucion = [
      [`Si ${cx.m ? 'el primero' : 'la primera'} tiene a, ${cx.m ? 'los demás' : 'las demás'} tienen a + ${d}, a + ${2 * d}, …, a + ${(n - 1) * d}. Suman `, v('n', n), `a + ${d} × (0 + 1 + … + ${n - 1}) = ${n}a + ${d * n * (n - 1) / 2} = `, v('S', pr.S), `, así que a = ${a}.`],
      [`Sin quitar nada, cada ${cx.una} sube hasta la cantidad mayor: ${a} + ${n - 1} × `, v('d', d), ` = ${pr.mayor}.`],
      [`Se agrega ${(n - 1) * d} + ${(n - 2) * d} + … + ${d} + 0 = ${pr.agregado}; al final hay ${n} × ${pr.mayor} = ${pr.final}.`],
    ];
    return cerrar(rng, semilla, { correcta, errores, texto: tx, enunciado, solucion, pregunta,
      variables: { n: { nombre: cx.donde, color: 'o' }, d: { nombre: 'diferencia', color: 'i' }, S: { nombre: 'total inicial', color: 'h' } },
      datos: { tipo: 'progresion', ctx: ci, n, d, a, pide } });
  }

  // ---------------------------------------------------------------- pista
  const RAZONES = [[2, 1], [3, 1], [3, 2], [4, 1], [4, 3], [5, 2], [5, 3], [5, 4], [7, 3], [7, 5]];
  function figuraPista(mismo) {
    const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" font-size="15" fill="currentColor">`
      + `<circle cx="160" cy="105" r="80" fill="none" style="stroke:var(--c-o)" stroke-width="3"/>`
      + `<line x1="160" y1="175" x2="160" y2="197" stroke="currentColor" stroke-width="3"/>`
      + `<text x="168" y="214">salida (marca 0 m)</text>`
      // Ana: antihorario, flecha a la derecha de la salida subiendo
      + `<path d="M 205 170 A 80 80 0 0 0 236 132" fill="none" style="stroke:var(--c-i)" stroke-width="5"/>`
      + `<path d="M 236 132 l -12 4 l 10 8 z" style="fill:var(--c-i)"/>`
      + `<text x="246" y="160">Ana</text>`
      + (mismo
        // Beto: también antihorario, por fuera (r = 92), desde la salida
        ? `<path d="M 184 194 A 92 92 0 0 0 225 170" fill="none" style="stroke:var(--c-i)" stroke-width="5"/><path d="M 225 170 l -5 12 l -7 -7 z" style="fill:var(--c-i)"/><text x="238" y="192">Beto</text>`
        : `<path d="M 115 170 A 80 80 0 0 1 84 132" fill="none" style="stroke:var(--c-i)" stroke-width="5"/><path d="M 84 132 l 12 4 l -10 8 z" style="fill:var(--c-i)"/><text x="30" y="160">Beto</text>`)
      + '</svg>';
    const alt = mismo
      ? 'Pista circular con la salida abajo (marca 0 m). Ana y Beto parten de la salida y corren los dos en sentido antihorario.'
      : 'Pista circular con la salida abajo (marca 0 m). Ana parte de la salida en sentido antihorario y Beto, en sentido horario.';
    return { svg: s, alt };
  }
  function pista(rng, semilla) {
    const [p, q] = rng.elegir(RAZONES), mismo = rng.moneda();
    const rel = mismo ? p - q : p + q;
    const L = rng.elegir([120, 180, 200, 240, 300, 360, 400, 420, 480, 600].filter(x => x % rel === 0));
    if (!L) return null;
    const n = rng.entero(2, 6);
    const { recorrido, marca } = calc.pista({ L, p, q, mismo, n });
    if (!ent(marca)) return null;
    const otro = mismo ? p + q : p - q;
    const errores = [
      h('RMP1-salida-cuenta', calc.pista({ L, p, q, mismo, n: n - 1 }).marca, `Contaste la salida como el primer encuentro. La salida no cuenta: el ${ORDM[n]} encuentro es el ${n}.º después de partir.`),
      ...(n * L * p % otro === 0 ? [h('RM4-sentido', ((n * L * p / otro) % L), mismo
        ? 'Sumaste las rapideces, pero corren en el mismo sentido: se encuentran cuando Ana le saca una vuelta a Beto, y eso depende de la resta.'
        : 'Restaste las rapideces, pero corren en sentidos contrarios: se acercan los dos a la vez, y las rapideces se suman.', 'hipotesis', RM)] : []),
      h('RMP51-otro-sentido', (L - marca) % L, mismo
        ? 'Mediste la marca en sentido horario, al revés de como corre Ana. Las marcas se cuentan desde la salida en el sentido de Ana.'
        : 'Mediste la marca en el sentido en que corre Beto. Las marcas se cuentan desde la salida en el sentido de Ana.'),
      h('AR5-lo-que-corrio', recorrido, `Esos son los metros que corrió Ana en total. La pista mide ${L} m: la marca vuelve a 0 cada vez que Ana completa una vuelta.`),
      h('RMP1-un-encuentro-de-mas', calc.pista({ L, p, q, mismo, n: n + 1 }).marca, `Contaste un encuentro de más. Se pide el ${ORDM[n]} encuentro después de partir.`),
    ];
    const enunciado = ['Ana y Beto corren en una pista circular de ', v('L', `${L} m`), mismo ? ' en el mismo sentido' : ' en sentidos contrarios',
      '. Parten juntos de la salida (marca 0 m). Las marcas se miden en metros desde la salida, en el sentido en que corre Ana. Mientras Ana corre ',
      v('r', `${p} m`), ', Beto corre ', v('r', `${q} m`), '. La salida no cuenta como encuentro.'];
    const tramo = n * L * p / rel;
    const solucion = [
      mismo ? ['Corren en el mismo sentido: se encuentran cada vez que Ana le saca una vuelta completa (', v('L', `${L} m`), ') a Beto.']
        : ['Corren en sentidos contrarios: se encuentran cada vez que entre los dos completan una vuelta (', v('L', `${L} m`), ').'],
      [mismo ? `Por cada ${p} m de Ana, ella gana ${p} − ${q} = ${rel} m: Ana corre ${p}/${rel} de lo que gana.` : `De cada ${p} + ${q} = ${rel} m que recorren juntos, ${p} son de Ana: Ana corre ${p}/${rel} de cada vuelta conjunta.`],
      [`Hasta el encuentro `, v('n', n), `: Ana corre ${n} × ${L} × ${p}/${rel} = ${f(tramo)} m.`],
      [`${f(tramo)} m son ${Math.floor(tramo / L)} ${Math.floor(tramo / L) === 1 ? 'vuelta completa' : 'vueltas completas'} y ${f(marca)} m más: se encuentran en la marca ${f(marca)} m.`],
    ];
    return cerrar(rng, semilla, { correcta: marca, errores, texto: x => `marca ${f(x)} m`, enunciado, solucion, figura: figuraPista(mismo),
      variables: { L: { nombre: 'largo de la pista', color: 'o' }, r: { nombre: 'razón de rapideces', color: 'i' }, n: { nombre: 'número de encuentro', color: 'h' } },
      pregunta: ['¿En qué marca se encuentran por ', v('n', `${ORD[n]} vez`), '?'], unidad: 'm',
      datos: { tipo: 'pista', L, p, q, mismo, n } });
  }

  // ---------------------------------------------------------------- diana
  const NOMBRES = [['Luis', 'Rosa', 'Teo'], ['Inés', 'Pablo', 'Nora'], ['Juan', 'Elsa', 'Raúl']];
  const COMBOS = [[2, -1], [-1, 2], [0.5, 0.5], [3, -2], [-2, 3], [1.5, -0.5], [-0.5, 1.5]];
  function figuraDiana(u, nombres, puntos) {
    const cols = ['var(--c-o)', 'var(--c-i)', 'var(--c-h)'];
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 200" font-size="15" fill="currentColor">`;
    u.forEach((cnt, j) => {
      const cx = 65 + j * 130, cy = 80;
      for (const r of [56, 38, 19]) s += `<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:var(--card)" stroke="currentColor" stroke-width="2"/>`;
      // anillo 0 exterior (radio 38-56), 1 medio (19-38), 2 centro (0-19)
      const radios = [47, 28.5, 10];
      cnt.forEach((c, anillo) => {
        for (let i = 0; i < c; i++) {
          const ang = 2 * Math.PI * i / c + 0.5 + anillo * 0.7;
          const r = anillo === 2 && c === 1 ? 0 : radios[anillo];
          const x = cx + r * Math.cos(ang), y = cy + r * Math.sin(ang);
          s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" style="fill:${cols[j]}" stroke="currentColor" stroke-width="1"/>`;
        }
      });
      s += `<text x="${cx}" y="160" text-anchor="middle" style="fill:${cols[j]}">${P.xml(nombres[j])}</text>`;
      s += `<text x="${cx}" y="182" text-anchor="middle">${P.xml(puntos[j])}</text>`;
    });
    return s + '</svg>';
  }
  const flechasTxt = c => `${pl(c[2], 'flecha', 'flechas')} en el centro, ${c[1]} en el anillo medio y ${c[0]} en el anillo exterior`;
  function diana(rng, semilla) {
    const nombres = rng.elegir(NOMBRES);
    const m = rng.entero(4, 6);
    const vec = () => { const c = rng.entero(0, m), b = rng.entero(0, m - c); return [m - c - b, b, c]; };
    const u1 = vec(), u2 = vec();
    if (u1.join() === u2.join()) return null;
    const [al, be] = rng.elegir(COMBOS);
    const u3 = [0, 1, 2].map(i => al * u1[i] + be * u2[i]);
    if (u3.some(x => !Number.isInteger(x) || x < 0) || u3.join() === u1.join() || u3.join() === u2.join()) return null;
    const w0 = rng.entero(1, 4), w1 = w0 + rng.entero(1, 4), w2 = w1 + rng.entero(1, 5);
    const w = [w0, w1, w2];
    const [P1, P2, P3] = calc.diana({ w, u: [u1, u2, u3] });
    const coef = (c, X) => (Math.abs(c) === 1 ? X : Math.abs(c) === 0.5 ? `${X}/2` : `${f(Math.abs(c))}·${X}`);
    const combTxt = (a, b, X, Y) => `${a < 0 ? '−' : ''}${coef(a, X)} ${b < 0 ? '−' : '+'} ${coef(b, Y)}`;
    const errores = [
      h('RMP57-suma', P1 + P2, `Sumaste los dos puntajes. Las flechas de ${nombres[2]} no son las de ${nombres[0]} más las de ${nombres[1]}: compáralas anillo por anillo.`),
      h('RMP57-resta', Math.abs(P1 - P2), `Restaste los puntajes sin mirar las flechas. La resta de las flechas de ${nombres[0]} y ${nombres[1]} no da las de ${nombres[2]}.`),
      h('RMP57-promedio', (P1 + P2) / 2, `Promediaste los puntajes. Eso solo vale si las flechas de ${nombres[2]} son la mitad de las de los otros dos juntos, y aquí no es así.`),
      h('RMP57-coeficientes-cambiados', be * P1 + al * P2, `Armaste bien la combinación pero cambiaste los papeles: ${combTxt(be, al, nombres[0], nombres[1])}. Comprueba anillo por anillo qué combinación da las flechas de ${nombres[2]}.`),
      h('RMP57-despeje-a-medias', P2 + (P2 - P1), `Supusiste que el cambio de ${nombres[0]} a ${nombres[1]} se repite igual hasta ${nombres[2]}. Hay que comprobarlo con las flechas de cada anillo.`),
    ];
    const enunciado = ['En una diana, cada anillo vale una cantidad fija de puntos (el centro vale más que el anillo medio y este, más que el exterior), pero no se sabe cuánto. Cada uno lanzó ',
      String(m), ' flechas y todas dieron en la diana. ', nombres[0], ' hizo ', v('P1', `${P1} puntos`), ' y ', nombres[1], ' hizo ', v('P2', `${P2} puntos`), '. La figura muestra dónde cayeron las flechas de cada uno.'];
    const figura = { svg: figuraDiana([u1, u2, u3], nombres, [`${P1} puntos`, `${P2} puntos`, '¿?']),
      alt: `Tres dianas iguales, cada una con un centro, un anillo medio y un anillo exterior. ${nombres[0]}: ${flechasTxt(u1)}; obtuvo ${P1} puntos. ${nombres[1]}: ${flechasTxt(u2)}; obtuvo ${P2} puntos. ${nombres[2]}: ${flechasTxt(u3)}; su puntaje es lo que se pregunta.` };
    const vecTxt = c => `(${c[2]}, ${c[1]}, ${c[0]})`;
    const comb = al === 0.5 ? `la mitad de las de ${nombres[0]} y ${nombres[1]} juntas` : combTxt(al, be, nombres[0], nombres[1]);
    const solucion = [
      ['Llama c, m y e a lo que valen el centro, el medio y el exterior. Hay tres incógnitas y solo dos datos: no se puede hallar cada valor, pero no hace falta.'],
      [`Flechas (centro, medio, exterior): ${nombres[0]} ${vecTxt(u1)}, ${nombres[1]} ${vecTxt(u2)}, ${nombres[2]} ${vecTxt(u3)}.`],
      [`Anillo por anillo, las de ${nombres[2]} son ${comb}: ${[2, 1, 0].map(i => `${u3[i]} = ${f(al)}·${u1[i]} ${be < 0 ? '−' : '+'} ${f(Math.abs(be))}·${u2[i]}`).join('; ')}.`],
      [`Entonces su puntaje es la misma combinación: ${f(al)} × `, v('P1', P1), ` ${be < 0 ? '−' : '+'} ${f(Math.abs(be))} × `, v('P2', P2), ' = ', v('P3', `${P3} puntos`), '.'],
    ];
    return cerrar(rng, semilla, { correcta: P3, errores, texto: x => pl(x, 'punto', 'puntos'), enunciado, solucion, figura,
      variables: { P1: { nombre: `puntaje de ${nombres[0]}`, color: 'o' }, P2: { nombre: `puntaje de ${nombres[1]}`, color: 'i' }, P3: { nombre: `puntaje de ${nombres[2]}`, color: 'h' } },
      pregunta: [`¿Cuántos puntos hizo ${nombres[2]}?`], datos: { tipo: 'diana', w, u: [u1, u2, u3], nombres } });
  }

  // ---------------------------------------------------------------- torneo
  function torneo(rng, semilla) {
    const n = rng.entero(4, 10), vueltas = rng.elegir([1, 1, 2]);
    const M = vueltas * n * (n - 1) / 2;
    const E = rng.entero(1, M - 1), pide = rng.elegir(['empates', 'empates', 'ganados']);
    const { puntos: T } = calc.torneo({ n, vueltas, E });
    const Mmal = vueltas === 1 ? n * (n - 1) : n * (n - 1) / 2;
    const conv = x => (pide === 'empates' ? x : M - x);
    const errores0 = [
      h('RMP59-empate-un-punto', conv((3 * M - T) / 2), 'Contaste un solo punto por empate. En un empate cada equipo se lleva 1 punto: el partido reparte 2, uno menos que una victoria.'),
      h('RMP59-empate-cero', conv((3 * M - T) / 3), 'Hiciste que un empate no diera puntos. Cada empate reparte 2 puntos (1 para cada equipo): pierde solo 1 frente a los 3 de una victoria.'),
      h('AR17-partidos', conv(3 * Mmal - T), vueltas === 1
        ? `Contaste cada partido dos veces (A contra B y B contra A). Si juegan una vez entre sí, hay ${n} × ${n - 1} ÷ 2 = ${M} partidos.`
        : `Contaste los partidos como si se jugaran una sola vez. Con ida y vuelta, cada pareja juega dos partidos: ${n} × ${n - 1} = ${M}.`, 'parcial', RM),
      h('AR5-lo-otro', pide === 'empates' ? M - E : E, pide === 'empates' ? 'Esos son los partidos que tuvieron ganador. La pregunta pide los empates.' : 'Esos son los empates. La pregunta pide los partidos que tuvieron ganador.'),
      h('AR5-puntos-de-empates', 2 * E, pide === 'empates' ? 'Esos son los puntos que repartieron los empates (2 por empate). La pregunta pide cuántos empates hubo.' : 'Esos son los puntos que repartieron los empates, no un número de partidos.'),
    ];
    // Un error que da más partidos que los que el propio alumno contó no se ofrece: se vería imposible.
    const errores = errores0.filter(e => e.valor <= (e.id === 'AR17-partidos' ? Mmal : M));
    const enunciado = [v('n', n), ` equipos juegan un campeonato de fulbito en el que cada equipo juega ${vueltas === 1 ? 'una vez' : 'dos veces (ida y vuelta)'} contra cada uno de los demás. Una victoria da 3 puntos al ganador y 0 al perdedor; un empate da 1 punto a cada equipo. Al final, entre todos los equipos suman `, v('T', `${T} puntos`), '.'];
    const solucion = [
      ['Partidos: ', v('n', n), ` × ${n - 1}${vueltas === 1 ? ' ÷ 2' : ''} = `, v('M', M), vueltas === 1 ? ' (cada pareja juega una vez).' : ' (cada pareja juega dos veces).'],
      ['Un partido con ganador reparte 3 puntos; un empate reparte 1 + 1 = 2. Si todos hubieran tenido ganador, habría ', `3 × ${M} = ${3 * M} puntos.`],
      ['Cada empate quita 1 punto a esa cuenta: empates = ', `${3 * M} − `, v('T', T), ` = ${E}.`],
      ...(pide === 'ganados' ? [[`Partidos con ganador: ${M} − ${E} = ${M - E}.`]] : []),
    ];
    return cerrar(rng, semilla, { correcta: conv(E), errores, texto: x => pl(x, 'partido', 'partidos'), enunciado, solucion,
      variables: { n: { nombre: 'equipos', color: 'o' }, M: { nombre: 'partidos', color: 'i' }, T: { nombre: 'puntos en total', color: 'h' } },
      pregunta: [pide === 'empates' ? '¿Cuántos partidos terminaron empatados?' : '¿Cuántos partidos tuvieron un ganador?'], datos: { tipo: 'torneo', n, vueltas, E, pide } });
  }

  // ---------------------------------------------------------------- fichas
  function fichas(rng, semilla) {
    const nf = rng.elegir([2, 2, 3]);
    const caras = [];
    for (let i = 0; i < nf; i++) { const a = rng.entero(1, 12); let b = rng.entero(1, 12); if (b === a) b = a + rng.entero(1, 6); caras.push([Math.min(a, b), Math.max(a, b)]); }
    const { sumas, total } = calc.fichas(caras);
    if (nf === 2 && sumas.length < 4) return null;
    if (nf === 3 && sumas.length < 6) return null;
    const sumaTodas = sumas.reduce((s, x) => s + x, 0);
    const mayor = sumas[sumas.length - 1], menor = sumas[0];
    const errores = [
      h('RMP55-todas-las-sumas', sumaTodas, `Sumaste todas las sumas posibles. Cada número de una cara aparece en varias sumas, así que lo contaste más de una vez.`),
      h('RMP55-promedio', sumaTodas / sumas.length, 'Promediaste las sumas posibles: eso es lo que sale, en promedio, en un lanzamiento, con una sola cara de cada ficha. La pregunta pide todas las caras.'),
      h('RMP55-una-cara', mayor, `Esa es la mayor suma: usa solo una cara de cada ficha (la mayor). Faltan los números de las otras caras.`),
      h('RMP55-mitad', sumaTodas / 2, `Sumaste todas las sumas y dividiste entre 2. ${nf === 3 ? 'Con tres fichas, cada número aparece en más de dos sumas.' : 'Eso solo funciona si salen las cuatro sumas distintas.'}`),
      h('RMP55-mayor-mas-segunda', mayor + sumas[sumas.length - 2], 'Sumaste las dos sumas mayores: así cuentas dos veces casi todas las caras mayores y te faltan caras menores.'),
    ];
    const nom = ['A', 'B', 'C'].slice(0, nf);
    const enunciado = [`Hay ${nf} fichas (${nom.join(nf === 2 ? ' y ' : ', ').replace(', C', ' y C')}), cada una con un número entero positivo en cada una de sus dos caras; en cada ficha, los dos números son distintos. Se lanzan las ${nf} fichas y se suman los números que quedan arriba. Las sumas que pueden salir son, sin repetir: `,
      ...sumas.flatMap((x, i) => [v('s', x), i < sumas.length - 2 ? ', ' : i === sumas.length - 2 ? ' y ' : '.'])];
    const solucion = [
      [`La menor suma `, v('s', menor), ` sale con la cara menor de cada ficha, y la mayor `, v('s', mayor), ' con la cara mayor de cada ficha.'],
      [`Entre las dos usan cada cara exactamente una vez: ${menor} + ${mayor} = `, v('t', total), '.'],
      [`Comprobación con un ejemplo de fichas que cumplen: ${caras.map((c, i) => `${nom[i]} (${c[0]} y ${c[1]})`).join(', ')}. No se puede saber cada número, pero la suma de todos sí.`],
    ];
    return cerrar(rng, semilla, { correcta: total, errores, decimal: true, texto: x => f(x), enunciado, solucion,
      variables: { s: { nombre: 'sumas posibles', color: 'i' }, t: { nombre: 'suma de todas las caras', color: 'h' } },
      pregunta: ['¿Cuánto suman los números de todas las caras de las fichas?'], datos: { tipo: 'fichas', caras } });
  }

  // ---------------------------------------------------------------- cortes
  function figuraCorte(delta) {
    let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 170" font-size="15" fill="currentColor">`;
    s += `<rect x="30" y="20" width="110" height="110" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>`;
    if (delta === 2) s += `<line x1="30" y1="130" x2="140" y2="20" style="stroke:var(--c-d)" stroke-width="3" stroke-dasharray="7 5"/>`;
    else s += `<line x1="30" y1="130" x2="140" y2="75" style="stroke:var(--c-d)" stroke-width="3" stroke-dasharray="7 5"/><circle cx="140" cy="75" r="4" style="fill:var(--c-d)"/>`;
    s += `<text x="85" y="158" text-anchor="middle">un corte</text>`;
    s += `<path d="M 155 75 h 30 l -8 -6 m 8 6 l -8 6" fill="none" stroke="currentColor" stroke-width="2"/>`;
    if (delta === 2) s += `<polygon points="200,130 290,130 290,40" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/><polygon points="195,122 195,32 285,32" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>`;
    else s += `<polygon points="200,130 290,130 290,85" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/><polygon points="195,122 285,77 285,32 195,32" style="fill:var(--card)" stroke="currentColor" stroke-width="3"/>`;
    s += `<text x="242" y="158" text-anchor="middle">dos piezas</text>`;
    const alt = delta === 2
      ? 'Un cuadrado con un corte recto por una diagonal, de una esquina a la esquina opuesta; al lado, las dos piezas que resultan: dos triángulos.'
      : 'Un cuadrado con un corte recto desde una esquina hasta el punto medio de un lado que no toca esa esquina; al lado, las dos piezas que resultan: un triángulo y un trapecio.';
    return { svg: s + '</svg>', alt };
  }
  function cortes(rng, semilla) {
    const delta = rng.elegir([2, 3]), q = rng.entero(8, 30), c = rng.entero(2, q - 1);
    const pide = rng.elegir(['cuadrados', 'cuadrados', 'cortes']);
    const { piezas: Pz, vertices: V } = calc.cortes({ q, c, delta });
    const otro = delta === 2 ? 3 : 2;
    const qOtro = calc.cuadradosDesde({ P: Pz, V, delta: otro });
    const conv = x => (pide === 'cuadrados' ? x : Pz - x);
    const corteTxt = delta === 2 ? 'por una diagonal, de una esquina a la esquina opuesta' : 'desde una esquina hasta el punto medio de un lado que no toca esa esquina';
    const piezasTxt = delta === 2 ? 'dos triángulos' : 'un triángulo y un trapecio';
    const errores0 = [
      h('RMP1-piezas-como-cuadrados', Pz, pide === 'cuadrados' ? 'Tomaste las piezas como si fueran los cuadrados del inicio. Cada corte convierte una pieza en dos: hay más piezas que cuadrados.' : 'Tomaste cada pieza como un corte. Cada corte convierte una pieza en dos: las piezas son los cuadrados del inicio más los cortes.'),
      h('RMP51-todos-cuadrados', conv(V / 4), 'Dividiste los vértices entre 4, como si todas las piezas fueran cuadrados. Las piezas cortadas tienen otra cantidad de vértices.'),
      h('RMP51-otro-corte', conv(qOtro), delta === 3
        ? 'Contaste 2 vértices más por corte, como si el corte fuera por la diagonal. Este corte da un triángulo y un trapecio: 7 vértices, 3 más que el cuadrado.'
        : 'Contaste 3 vértices más por corte, como si salieran un triángulo y un trapecio. Por la diagonal salen dos triángulos: 6 vértices, 2 más que el cuadrado.'),
      h('AR5-lo-otro', pide === 'cuadrados' ? c : q, pide === 'cuadrados' ? 'Esos son los cortes. La pregunta pide los cuadrados del inicio.' : 'Esos son los cuadrados del inicio. La pregunta pide los cortes.'),
    ];
    // Un error que deja menos de 1 hoja o más cortes que hojas no se ofrece: se vería imposible.
    const posible = e => { const qq = pide === 'cuadrados' ? e.valor : Pz - e.valor; return qq >= 1 && Pz - qq <= qq; };
    const errores = errores0.filter(e => !e.id.startsWith('RMP51') || posible(e));
    const enunciado = ['Se tienen varias hojas cuadradas. Se escogen algunas y a cada una se le hace un solo corte recto ', corteTxt, ' (como en la figura); no se corta ninguna pieza más. Al final hay ',
      v('P', `${Pz} piezas`), ' y, contando los vértices de todas las piezas, ', v('V', `${V} vértices`), '.'];
    const solucion = [
      ['Si había ', v('q', 'q'), ' cuadrados y se hicieron ', v('c', 'c'), ' cortes: cada corte convierte una pieza en dos, así que q + c = ', v('P', Pz), '.'],
      [`Un cuadrado cortado da ${piezasTxt}: 4 + ${delta} = ${4 + delta} vértices, ${delta} más que antes. Entonces 4q + ${delta}c = `, v('V', V), '.'],
      [`Restando ${delta} veces la primera: (4 − ${delta})q = ${V} − ${delta} × ${Pz} = ${V - delta * Pz}, q = `, v('q', q), ' y c = ', v('c', c), '.'],
    ];
    return cerrar(rng, semilla, { correcta: pide === 'cuadrados' ? q : c, errores, texto: x => (pide === 'cuadrados' ? pl(x, 'hoja', 'hojas') : pl(x, 'corte', 'cortes')), enunciado, solucion,
      figura: figuraCorte(delta),
      variables: { P: { nombre: 'piezas', color: 'o' }, V: { nombre: 'vértices', color: 'i' }, q: { nombre: 'cuadrados', color: 'h' }, c: { nombre: 'cortes', color: 'd' } },
      pregunta: [pide === 'cuadrados' ? '¿Cuántas hojas cuadradas había al inicio?' : '¿Cuántos cortes se hicieron?'], datos: { tipo: 'cortes', q, c, delta, pide } });
  }

  const CONSTRUIR = { lotes, promocion, canje, votos, progresion, pista, diana, torneo, fichas, cortes };

  return { id: 'rm-planteo', titulo: 'Planteo de situaciones: compras, votos, pistas y torneos', generar, calc };
});
