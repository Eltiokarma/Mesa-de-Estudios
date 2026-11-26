/*
 * Generador: arreglos numéricos y cuadrados mágicos, una práctica por idea (unidad
 * razonamiento-matematico.arreglos-numericos, etapa 9; propuesta: docs/etapa9/propuesta-razonamiento-matematico.md).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador (window.Generadores['rm-arreglos-ideas']) y en
 * Node. Los tipos de examen sueltos (cuadro latino, paridad, asientos…) siguen en plantillas/rm-arreglos.
 *
 * Tipos por idea (TIPOS_POR_IDEA; los id de las ideas de la teoría) y sus _datos:
 *   reparto-parejo      grupos { a, d, k, r } (suma común de k filas de r) · se-puede { nums } · falta { a, d, k, r, tiene }
 *   vertices-dos-veces  lado { nums, L, esq } · esquinas { nums, L, S } · cruz { nums, c }
 *   mayor-suma          mayor { nums, L } · menor { nums, L } · diferencia { nums, L }
 *   suma-magica         suma3 { nums } (la suma de un 3 × 3) · opuesta { c, a } · suma4 { a, d } (la de un 4 × 4)
 *   producto-magico     centro { P } · opuestaP { c, a } · filaP { P, a, b }
 *   piramide-de-sumas   cima { base } · base { base, j, cima } · mayorCima { nums } (la mayor cima con esos números)
 * Sin idea, el tipo sale de todos (las semillas de casos.json fijan el tipo y la idea).
 *
 * calc (funciones puras, por búsqueda completa): reparte(nums, k, r), mitad(nums), sumasMarco(nums, L, esq), cruz(nums, c),
 *   cima(base), resolver(_datos).
 *
 * Errores (docs/investigacion/codigos-rm-procesos.md, «Arreglos numéricos»; todos hipótesis): RMP1 lo compartido una sola
 *   vez · RMP2 la primera que se arma, sin buscar el extremo · RMP61 un paso intermedio (el total, la suma de una línea)
 *   · RMP63 una condición olvidada · RMP65 el multiplicativo como aditivo · RMP180 «par basta» · RMP181 un grupo mal
 *   sumado · RMP182 dos veces lo que no se comparte · RMP183 lo compartido en vez de la suma · RMP184 la cota sin armar
 *   · RMP186 el mayor al centro · RMP188 dividir entre las cuatro líneas del centro · RMP189 los pesos de un muro más chico
 *   · RMP190 el doble de la base · RMP191 la opuesta sin el centro · RMP192 dividir entre las tarjetas · RMP193 sin el
 *   «÷ 2» de los seguidos · RMP194 el centro por sí mismo dos veces.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'rm-arreglos-ideas';
  const UNIDAD = 'razonamiento-matematico.arreglos-numericos';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const ht = (id, clave, texto, explicacion) => ({ id, clave, texto, explicacion, respaldo: 'hipotesis', fuente: null });
  const f = x => P.formatear(x, 0);
  const v = P.v;
  const rango = (a, b, d = 1) => { const o = []; for (let x = a; x <= b; x += d) o.push(x); return o; };
  const suma = xs => xs.reduce((a, b) => a + b, 0);
  const prod = xs => xs.reduce((a, b) => a * b, 1);
  const lista = xs => (xs.length > 1 ? `${xs.slice(0, -1).map(f).join(', ')} y ${f(xs[xs.length - 1])}` : xs.map(f).join(''));
  const subs = (xs, k) => (k === 0 ? [[]] : xs.length < k ? [] : subs(xs.slice(1), k - 1).map(s => [xs[0]].concat(s)).concat(subs(xs.slice(1), k)));
  const perms = xs => (xs.length <= 1 ? [xs.slice()] : xs.flatMap((x, i) => perms(xs.slice(0, i).concat(xs.slice(i + 1))).map(p => [x].concat(p))));
  const PAL = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco'];
  const deA = (ns, d) => (d === 1 ? `del ${f(ns[0])} al ${f(ns[ns.length - 1])}` : `${ns[0] % 2 ? 'impares' : 'pares'} del ${f(ns[0])} al ${f(ns[ns.length - 1])}`);
  const NOMBRE = { 3: 'triangular', 4: 'cuadrado', 5: 'con forma de pentágono' };

  // ---------- Cálculos (búsqueda completa) ----------
  function reparte(nums, k, r) {
    const T = suma(nums); if (T % k) return null; const S = T / k;
    const ir = rest => { if (!rest.length) return []; const [p, ...q] = rest; for (const g of subs(q, r - 1)) if (suma(g) + p === S) { const o = ir(q.filter(x => !g.includes(x))); if (o) return [[p].concat(g)].concat(o); } return null; };
    return ir(nums.slice());
  }
  function mitad(nums) { const T = suma(nums); if (T % 2) return { tipo: 'impar' }; for (let k = 1; k < nums.length; k++) { const g = subs(nums, k).find(s => suma(s) === T / 2); if (g) return { tipo: 'si', g }; } return { tipo: 'par' }; }
  // Las sumas por lado que se arman en un polígono de L lados (esquinas y una tarjeta en medio de cada lado).
  function sumasMarco(nums, L, esq) {
    const out = new Set(), T = suma(nums);
    for (const e of esq ? [esq] : subs(nums, L)) {
      if ((T + suma(e)) % L) continue;
      const S = (T + suma(e)) / L, resto = nums.filter(x => !e.includes(x)).sort((a, b) => a - b).join();
      if (perms(e).some(p => p.map((a, k) => S - a - p[(k + 1) % L]).sort((a, b) => a - b).join() === resto)) out.add(S);
    }
    return [...out].sort((a, b) => a - b);
  }
  function cruz(nums, c) { const r = nums.filter(x => x !== c); return subs(r, 2).some(g => suma(g) * 2 === suma(r)) ? (suma(nums) + c) / 2 : null; }
  const cima = b => { while (b.length > 1) b = b.slice(1).map((x, i) => b[i] + x); return b[0]; };
  const pesos = k => { let p = [1]; for (let i = 1; i < k; i++) p = [1].concat(p.slice(1).map((q, j) => p[j] + q), [1]); return p; };

  // ---------- Datos (contrato, punto 13): herramientas, no el paso hecho ----------
  const D_TOTAL = 'El total es lo que suman todas las tarjetas del reto, contando cada una una sola vez.';
  const D_GRUPO = 'Si los grupos no comparten tarjetas y las usan todas, cada grupo suma el total ÷ el número de grupos.';
  const D_SEGUIDOS = 'Los números que van con un mismo salto suman (primero + último) × cuántos son ÷ 2.';
  const D_FALTA = 'La tarjeta que le falta a un grupo es la suma del grupo menos lo que ya tiene.';
  const D_LINEAS = 'Al sumar todas las líneas, cada número entra una vez por cada línea que lo tiene.';
  const D_LADO = 'Cada lado tiene sus dos esquinas y la tarjeta del medio.';
  const D_CRUZ = 'La fila y la columna comparten la tarjeta del centro.';
  const D_COTA = 'Cada lado suma (total + esquinas) ÷ el número de lados.';
  const D_ARMA = 'Una suma por lado vale si con esas esquinas las del medio salen de las tarjetas que quedan, sin repetir.';
  const D_MAGICO = 'En un cuadrado mágico, cada fila, cada columna y las dos diagonales suman lo mismo.';
  const D_CENTRO = 'Por el centro del 3 × 3 pasan cuatro líneas: la fila y la columna del medio y las dos diagonales.';
  const D_MULTI = 'En un cuadrado mágico multiplicativo, cada fila, columna y diagonal da el mismo producto P.';
  // El producto en factores primos, no una tabla de cubos: la tabla traía « 15 → 3375 », la respuesta (auditoría, 26 nov).
  const factores = n => { const o = []; for (let p = 2; n > 1; p++) while (n % p === 0) { o.push(p); n /= p; } return o; };
  const D_FACT = Pn => `${f(Pn)} = ${factores(Pn).map(f).join(' × ')}`;
  const D_MURO = 'Cada adobe vale la suma de los dos que tiene debajo.';
  const D_PESOS = 'Caminos de cada adobe: 1, 2, 1 (tres abajo); 1, 3, 3, 1 (cuatro); 1, 4, 6, 4, 1 (cinco).';
  function datosDe(d) {
    switch (d.tipo) {
      case 'grupos': return [D_TOTAL, D_GRUPO, D_SEGUIDOS];
      case 'se-puede': return [D_TOTAL, D_GRUPO, 'Una suma de números pares siempre da par.'];
      case 'falta': return [D_TOTAL, D_GRUPO, D_SEGUIDOS, D_FALTA];
      case 'lado': case 'esquinas': return [D_TOTAL, D_LADO, D_LINEAS, D_SEGUIDOS];
      case 'cruz': return [D_TOTAL, D_CRUZ, D_LINEAS];
      case 'mayor': case 'menor': case 'diferencia': return [D_TOTAL, D_LADO, D_COTA, D_ARMA];
      case 'suma3': return [D_MAGICO, 'Las filas no comparten casillas y las usan todas: cada fila suma el total ÷ número de filas.'];
      case 'opuesta': return [D_MAGICO, D_CENTRO, 'En el 3 × 3, la suma mágica es el triple del centro.'];
      case 'suma4': return [D_MAGICO, 'Las filas no comparten casillas y las usan todas: cada fila suma el total ÷ número de filas.', D_SEGUIDOS];
      case 'centro': return [D_MULTI, D_CENTRO, D_FACT(d.P)];
      case 'opuestaP': return [D_MULTI, 'En el 3 × 3 que multiplica, dos opuestas multiplican el centro por sí mismo.'];
      case 'filaP': return [D_MULTI];
      case 'cima': case 'base': case 'mayorCima': return [D_MURO, D_PESOS];
    }
    return [D_TOTAL];
  }
  function cerrar(rng, o) {
    const alternativas = o.textos ? P.armarTexto({ correcta: o.correcta, errores: o.errores, rng })
      : P.armar({ correcta: o.correcta, errores: o.errores, rng, decimales: 0, texto: x => f(x) });
    const resp = o.textos ? o.correcta.texto : f(o.correcta);
    return {
      id: ID, unidadCatalogo: UNIDAD, variables: { x: { nombre: 'lo pedido, ya comprobado', color: 'f' } },
      enunciado: o.enunciado, pregunta: o.pregunta, datos: datosDe(o.datos),
      alternativas, solucion: o.solucion.concat([['Respuesta: ', v('x', resp), '.']]),
      respuesta: { valor: o.textos ? o.correcta.clave : o.correcta, unidad: '' }, _datos: o.datos,
    };
  }
  const listaSeg = rng => { const d = rng.elegir([1, 1, 2]), a = rng.entero(1, 14); return { d, a }; };

  // ---------- Idea 1: el total se reparte parejo ----------
  function tGrupos(rng) {
    const { d, a } = listaSeg(rng), k = rng.elegir([2, 3, 4]), r = rng.elegir([3, 4]);
    if (k * r > 12) return null;
    const nums = rango(a, a + d * (k * r - 1), d), T = suma(nums);
    if (!reparte(nums, k, r)) return null;
    const S = T / k;
    return cerrar(rng, { datos: { tipo: 'grupos', a, d, k, r }, correcta: S,
      errores: [h('RMP61-el-total', T, 'Ese es el total de todas las tarjetas, y falta repartirlo entre las filas.'), h('RMP193-sin-mitad', 2 * S, 'La fórmula de los números seguidos lleva «÷ 2»; sin él, sale el doble.'),
        h('RMP192-entre-tarjetas', T / r, 'El total se reparte entre las filas, no entre las tarjetas de cada fila.'), h('RMP192-promedio', T / nums.length, 'Eso es lo que toca a cada tarjeta, no lo que suma cada fila.')],
      enunciado: [`Las tarjetas ${deA(nums, d)} van en ${PAL[k]} filas de ${PAL[r]}, una vez cada una, y todas las filas suman lo mismo.`],
      pregunta: ['¿Cuánto suma cada fila?'],
      solucion: [[`El total es (${f(nums[0])} + ${f(nums[nums.length - 1])}) × ${f(nums.length)} ÷ 2 = ${f(T)}.`], [`Las filas se reparten el total, así que cada una suma ${f(T)} ÷ ${f(k)} = ${f(S)}.`]] });
  }
  function tSePuede(rng) {
    const quiere = rng.elegir(['si', 'impar', 'par']);
    for (let i = 0; i < 400; i++) {
      const nums = rng.barajar(rango(1, 24)).slice(0, rng.entero(5, 7)).sort((x, y) => x - y), m = mitad(nums), T = suma(nums), mayor = nums[nums.length - 1];
      if (m.tipo !== quiere || (quiere === 'si' && 2 * mayor === T)) continue;
      const txt = { si: `Sí: cada grupo suma ${f(T / 2)}`, impar: 'No: el total es impar', par: 'No, aunque el total es par' };
      const errores = [
        ht('RMP180-par-basta', 'si-mal', `Sí: cada grupo suma ${P.formatear(T / 2, 1)}`, T % 2 ? 'Con tarjetas enteras no se llega a una mitad con coma.' : 'Que el total sea par no basta, porque ningún grupo llega justo a la mitad.'),
        ht('RMP181-suma-mal', 'impar', txt.impar, `Súmalas otra vez: dan ${f(T)}, que es par.`),
        ht('RMP180-par', 'par', txt.par, m.g ? `Sí se arma: ${m.g.map(f).join(' + ')} = ${f(T / 2)}.` : `El total, ${f(T)}, es impar y no tiene mitad entera.`),
        ht('RMP181-la-mayor', 'mayor', `Sí: cada grupo suma ${f(mayor)}`, `La tarjeta mayor sola no es la mitad de ${f(T)}.`),
      ].filter(e => !(quiere === 'si' && e.clave === 'si-mal') && e.clave !== quiere);
      return cerrar(rng, { datos: { tipo: 'se-puede', nums }, textos: true, correcta: { clave: quiere, texto: txt[quiere] }, errores,
        enunciado: [`Se tienen las tarjetas ${lista(nums)}.`], pregunta: ['¿Se pueden repartir en dos grupos que sumen lo mismo?'],
        solucion: [[`El total es ${f(T)}, y cada grupo tendría que sumar la mitad.`], [m.tipo === 'si' ? `El grupo ${m.g.map(f).join(' + ')} da justo ${f(T / 2)}, así que se arma.` : m.tipo === 'impar' ? 'Como el total es impar, no se parte en dos mitades enteras.' : `El total es par, pero la mitad, ${f(T / 2)}, no se arma con estas tarjetas.`]] });
    }
    return null;
  }
  function tFalta(rng) {
    const { d, a } = listaSeg(rng), k = rng.elegir([2, 3]), r = rng.elegir([3, 4]), nums = rango(a, a + d * (k * r - 1), d), g = reparte(nums, k, r);
    if (!g) return null;
    const T = suma(nums), S = T / k, G = rng.elegir(g).slice().sort((x, y) => x - y), x = rng.elegir(G), tiene = G.filter(y => y !== x);
    return cerrar(rng, { datos: { tipo: 'falta', a, d, k, r, tiene }, correcta: x,
      errores: [h('RMP61-la-suma', S, 'Esa es la suma de la fila, y falta quitarle lo que ya tiene.'), h('RMP61-del-total', T - suma(tiene), 'Lo que ya está se resta de la suma de una fila, no del total.'),
        h('RMP63-una-sola', S - tiene[0], 'Se restó una sola tarjeta, y faltó restar las demás de la fila.'), h('RMP61-lo-que-tiene', suma(tiene), 'Eso es lo que la fila ya tiene, no lo que le falta.')],
      enunciado: [`Las tarjetas ${deA(nums, d)} van en ${PAL[k]} filas de ${PAL[r]} que suman lo mismo. Una fila tiene ${lista(tiene)}.`],
      pregunta: ['¿Qué tarjeta le falta a esa fila?'],
      solucion: [[`Las filas se reparten el total, así que cada una suma ${f(T)} ÷ ${f(k)} = ${f(S)}.`], [`A esa fila le falta lo que necesita para llegar a ${f(S)}: ${f(S)} − ${f(suma(tiene))} = ${f(x)}.`]] });
  }

  // ---------- Idea 2: lo compartido cuenta dos veces ----------
  function marcoAzar(rng) {
    const L = rng.elegir([3, 3, 4, 5]), { d, a } = listaSeg(rng), nums = rango(a, a + d * (2 * L - 1), d);
    const esqs = subs(nums, L).filter(e => sumasMarco(nums, L, e).length);
    return esqs.length ? { L, d, nums, esq: rng.elegir(esqs) } : null;
  }
  function tLado(rng) {
    const z = marcoAzar(rng); if (!z) return null;
    const { L, d, nums, esq } = z, T = suma(nums), V = suma(esq), S = (T + V) / L;
    return cerrar(rng, { datos: { tipo: 'lado', nums, L, esq }, correcta: S,
      errores: [h('RMP1-una-vez', T / L, 'Cada esquina está en dos lados, así que entra dos veces.'), h('RMP182-los-del-medio', (2 * T - V) / L, 'Las que entran dos veces son las esquinas, no las tarjetas del medio.'),
        h('RMP183-las-esquinas', V, 'Eso suman las esquinas, no un lado.'), h('RMP61-todos-los-lados', L * S, 'Eso suman los lados juntos, y falta dividir entre el número de lados.')],
      enunciado: [`Las tarjetas ${deA(nums, d)} van en un marco ${NOMBRE[L]}, una por casilla. Las esquinas son ${lista(esq)} y los lados suman lo mismo.`],
      pregunta: ['¿Cuánto suma cada lado?'],
      solucion: [[`Los ${f(L)} lados juntos cuentan el total, ${f(T)}, y las esquinas otra vez, ${f(V)}: suman ${f(T + V)}.`], [`Cada lado se lleva la misma parte: ${f(T + V)} ÷ ${f(L)} = ${f(S)}.`]] });
  }
  function tEsquinas(rng) {
    const z = marcoAzar(rng); if (!z) return null;
    const { L, d, nums, esq } = z, T = suma(nums), V = suma(esq), S = (T + V) / L;
    return cerrar(rng, { datos: { tipo: 'esquinas', nums, L, S }, correcta: V,
      errores: [h('RMP182-los-del-medio', T - V, 'Eso suman las tarjetas del medio, no las esquinas.'), h('RMP61-todos-los-lados', L * S, 'Eso suman los lados juntos, y falta quitarles el total.'),
        h('RMP61-un-lado', S, 'Eso suma un lado, no las esquinas.'), h('RMP1-el-total', T, 'Ese es el total de las tarjetas, no lo que suman las esquinas.')],
      enunciado: [`Las tarjetas ${deA(nums, d)} van en un marco ${NOMBRE[L]}, una por casilla, y cada lado suma ${f(S)}.`],
      pregunta: ['¿Cuánto suman las esquinas?'],
      solucion: [[`Los lados juntos suman ${f(L)} × ${f(S)} = ${f(L * S)}.`], [`Lo que pasa del total es lo que se contó dos veces, las esquinas: ${f(L * S)} − ${f(T)} = ${f(V)}.`]] });
  }
  function tCruz(rng) {
    const { d, a } = listaSeg(rng), nums = rango(a, a + 4 * d, d), c = rng.elegir(nums), S = cruz(nums, c);
    if (S === null) return null;
    const T = suma(nums);
    return cerrar(rng, { datos: { tipo: 'cruz', nums, c }, correcta: S,
      errores: [h('RMP1-sin-centro', T / 2, 'Se repartió el total, pero el centro está en la fila y en la columna.'), h('RMP182-tres-veces', (T + 2 * c) / 2, 'El centro entra una vez de más, no dos.'),
        h('RMP61-las-dos', T + c, 'Eso suman la fila y la columna juntas, y falta repartirlo entre las dos.'), h('RMP183-el-centro', c, 'Ese es el centro, no lo que suma la fila.'), h('RMP63-sin-el-centro', S - c, 'Eso suman las dos tarjetas de los lados, pero la fila también tiene el centro.')],
      enunciado: [`Las tarjetas ${deA(nums, d)} van en una cruz: una fila de tres y una columna de tres, con el ${f(c)} en el centro. Fila y columna suman lo mismo.`],
      pregunta: ['¿Cuánto suma cada una?'],
      solucion: [[`Fila más columna da el total, ${f(T)}, más el centro otra vez: ${f(T + c)}.`], [`La fila y la columna se reparten esa suma: ${f(T + c)} ÷ 2 = ${f(S)}.`]] });
  }

  // ---------- Idea 3: la mayor suma tiene que armarse ----------
  function tExtremo(rng, tipo) {
    const L = rng.elegir([3, 4, 4, 5]), { d, a } = listaSeg(rng), nums = rango(a, a + d * (2 * L - 1), d), ss = sumasMarco(nums, L);
    if (!ss.length) return null;
    const T = suma(nums), alto = nums.slice(-L), bajo = nums.slice(0, L), cMax = (T + suma(alto)) / L, cMin = (T + suma(bajo)) / L;
    const max = ss[ss.length - 1], min = ss[0];
    const correcta = tipo === 'mayor' ? max : tipo === 'menor' ? min : max - min;
    const cota = tipo === 'mayor' ? cMax : cMin;
    const errores = tipo === 'diferencia'
      ? [h('RMP184-cotas', cMax - cMin, 'Las cuentas con las esquinas extremas no siempre se arman, así que no sirven para restar.'), h('RMP61-la-mayor', max, 'Esa es la mayor, y falta restarle la menor.'), h('RMP61-la-menor', min, 'Esa es la menor, y piden la mayor menos la menor.'), h('RMP61-las-suma', max + min, 'Eso suma las dos, y piden restarlas.')]
      : [h('RMP184-la-cota', cota, Number.isInteger(cota) ? 'Esa cuenta da entera, pero con esas esquinas las tarjetas no se arman.' : 'Esa cuenta no da un número entero.'), h('RMP1-una-vez', T / L, 'Se repartió el total, pero cada esquina está en dos lados.'), h('RMP183-las-esquinas', suma(tipo === 'mayor' ? alto : bajo), 'Eso suman las esquinas, no un lado.'),
        h('RMP2-otra', ss.length > 1 ? (tipo === 'mayor' ? ss[ss.length - 2] : ss[1]) : NaN, `Se arma, pero hay otra suma, ${tipo === 'mayor' ? 'más grande' : 'más chica'}, que también se arma.`)];
    return cerrar(rng, { datos: { tipo, nums, L }, correcta, errores,
      enunciado: [`Las tarjetas ${deA(nums, d)} van en un marco ${NOMBRE[L]}, una por casilla, y los lados suman lo mismo.`],
      pregunta: [tipo === 'diferencia' ? '¿Cuánto es la mayor suma por lado menos la menor?' : `¿Cuál es la ${tipo} suma por lado?`],
      solucion: [[`La cuenta con las esquinas ${tipo === 'menor' ? 'menores' : 'mayores'} da un tope, y desde ahí se ${tipo === 'menor' ? 'sube' : 'baja'} hasta el primer valor que se arma.`],
        [tipo === 'diferencia' ? `La mayor que se arma es ${f(max)} y la menor, ${f(min)}: ${f(max)} − ${f(min)} = ${f(max - min)}.` : `El primer valor que se arma es ${f(correcta)}.`]] });
  }

  // ---------- Idea 4: el cuadrado mágico y su centro ----------
  function tSuma3(rng) {
    const a = rng.entero(2, 20), d = rng.entero(1, 5), nums = rango(a, a + 8 * d, d), T = suma(nums), S = T / 3;
    return cerrar(rng, { datos: { tipo: 'suma3', nums }, correcta: S,
      errores: [h('RMP61-el-total', T, 'Ese es el total, y falta repartirlo entre las tres filas.'), h('RMP61-el-centro', S / 3, 'Ese es el centro, no lo que suma la fila.'), h('RMP185-la-mayor', 3 * nums[8], 'Las tres casillas de una fila no pueden ser todas la mayor.'), h('RMP63-extremos', nums[0] + nums[8], 'El primero más el último no reparte el total entre las filas.')],
      enunciado: [`Un cuadrado mágico 3 × 3 usa una vez cada número: ${lista(nums)}.`], pregunta: ['¿Cuánto suma cada fila?'],
      solucion: [[`El total es ${f(T)}.`], [`Las tres filas se reparten el total, así que cada una suma ${f(T)} ÷ 3 = ${f(S)}.`]] });
  }
  function tOpuesta(rng) {
    const d = rng.entero(1, 4), c = rng.entero(4 * d + 1, 4 * d + 20), a = c + rng.elegir([-1, 1]) * rng.elegir([1, 3]) * d, x = 2 * c - a;   // una esquina del Lo Shu llevado a centro c y salto d
    return cerrar(rng, { datos: { tipo: 'opuesta', c, a }, correcta: x,
      errores: [h('RMP191-sin-centro', 3 * c - a, 'Se restó la esquina de la suma mágica, pero falta restar también el centro.'), h('RMP191-diferencia', Math.abs(c - a), 'Dos casillas opuestas suman el doble del centro.'), h('RMP63-igual', a, `Las dos esquinas opuestas suman ${f(2 * c)}, el doble del centro, y ${f(a)} + ${f(a)} no da eso.`), h('RMP191-suma', c + a, `Eso junta el centro y la esquina, pero la línea completa suma ${f(3 * c)}.`)],
      enunciado: [`En un cuadrado mágico 3 × 3, el centro es ${f(c)} y una esquina es ${f(a)}.`], pregunta: ['¿Qué número va en la esquina opuesta?'],
      solucion: [[`En el 3 × 3, la diagonal suma el triple del centro, ${f(3 * c)}.`], [`A la diagonal le falta la esquina opuesta: ${f(3 * c)} − ${f(a)} − ${f(c)} = ${f(x)}.`]] });
  }
  function tSuma4(rng) {
    const a = rng.entero(2, 20), d = rng.elegir([1, 1, 2]), nums = rango(a, a + 15 * d, d), T = suma(nums), S = T / 4;
    return cerrar(rng, { datos: { tipo: 'suma4', a, d }, correcta: S,
      errores: [h('RMP61-el-total', T, 'Ese es el total, y falta repartirlo entre las 4 filas.'), h('RMP63-tres-filas', T / 3, 'Eso reparte entre tres filas, y el 4 × 4 tiene cuatro.'), h('RMP193-sin-mitad', T / 2, 'Eso reparte entre dos; entre 4 filas sale la mitad de eso.'), h('RMP63-el-34', 34, 'El 34 es la suma del 4 × 4 con los números del 1 al 16, no con estos.')],
      enunciado: [`Un cuadrado mágico 4 × 4 usa una vez cada uno de los números ${deA(nums, d)}.`], pregunta: ['¿Cuánto suma cada fila?'],
      solucion: [[`El total es (${f(nums[0])} + ${f(nums[15])}) × 16 ÷ 2 = ${f(T)}.`], [`Las cuatro filas se reparten el total, así que cada una suma ${f(T)} ÷ 4 = ${f(S)}.`]] });
  }

  // ---------- Idea 5: cuando las líneas multiplican ----------
  // Centros que no son primos: con 343 = 7 × 7 × 7, el dato de los factores daría la respuesta (auditoría, 26 nov).
  const CENTROS = [4, 6, 10, 12, 14, 15, 21];
  function tCentroP(rng) {
    const c = rng.elegir(CENTROS), Pc = c * c * c;
    return cerrar(rng, { datos: { tipo: 'centro', P: Pc }, correcta: c,
      errores: [h('RMP65-entre-tres', Pc / 3, 'Dividir entre 3 serviría en el cuadrado de sumas, pero aquí se multiplica.'), h('RMP188-entre-cuatro', Pc / 4, 'Dividir entre 4 no da el centro.'), h('RMP194-dos-veces', c * c, 'Eso multiplica el centro dos veces, y en cada línea va tres veces.'), h('RMP65-suma', 3 * c, 'El centro va tres veces, pero multiplicado, no sumado.')],
      enunciado: [`Un cuadrado mágico 3 × 3 multiplica: cada fila, columna y diagonal da ${f(Pc)} (puede repetir números).`], pregunta: ['¿Qué número va en el centro?'],
      solucion: [[`El centro multiplicado tres veces por sí mismo da ${f(Pc)}, el producto de cada línea.`], [`${f(c)} × ${f(c)} × ${f(c)} = ${f(Pc)}.`]] });
  }
  function tOpuestaP(rng) {
    const c = rng.elegir([6, 10, 12, 15, 18, 20]), divs = rango(2, c * c - 1).filter(q => (c * c) % q === 0 && q !== c), a = rng.elegir(divs), x = c * c / a;
    return cerrar(rng, { datos: { tipo: 'opuestaP', c, a }, correcta: x,
      errores: [h('RMP65-aditivo', 2 * c - a, 'Esa regla es del cuadrado de sumas, y aquí se multiplica.'), h('RMP61-sin-dividir', c * c, 'Eso multiplican las dos opuestas, y falta dividir entre la esquina que se conoce.'), h('RMP191-con-P', c * c * c / a, 'Se dividió entre la esquina, pero falta dividir también entre el centro.'), h('RMP63-igual', a, `Las dos esquinas opuestas multiplican ${f(c * c)}, el centro por sí mismo, y ${f(a)} × ${f(a)} no da eso.`)],
      enunciado: [`En un cuadrado mágico multiplicativo 3 × 3, el centro es ${f(c)} y una esquina es ${f(a)}.`], pregunta: ['¿Qué número va en la esquina opuesta?'],
      solucion: [[`Las dos esquinas opuestas multiplican lo mismo que el centro por sí mismo: ${f(c)} × ${f(c)} = ${f(c * c)}.`], [`La que falta es ${f(c * c)} ÷ ${f(a)} = ${f(x)}.`]] });
  }
  function tFilaP(rng) {
    const c = rng.elegir([6, 10, 15]), Pc = c * c * c, divs = rango(1, Pc).filter(q => Pc % q === 0), a = rng.elegir(divs.filter(q => q > 1 && q < Pc)), resto = Pc / a;
    const bs = divs.filter(q => resto % q === 0 && q > 1 && q !== a && resto / q !== q && resto / q !== a && resto / q > 1);
    if (!bs.length) return null;
    const b = rng.elegir(bs), x = Pc / (a * b);
    return cerrar(rng, { datos: { tipo: 'filaP', P: Pc, a, b }, correcta: x,
      errores: [h('RMP65-resta', Pc - a - b, 'Aquí no se resta: como la fila multiplica, se divide.'), h('RMP63-una-sola', Pc / a, 'Se dividió entre una sola casilla, y falta dividir también entre la otra.'), h('RMP61-las-dos', a * b, 'Eso es lo que ya multiplica la fila, no el número que falta.'), h('RMP186-el-centro', c, 'La casilla que falta no es el centro.')],
      enunciado: [`Un cuadrado mágico 3 × 3 multiplica ${f(Pc)} en cada línea. Una fila tiene ${f(a)} y ${f(b)}.`], pregunta: ['¿Qué número la completa?'],
      solucion: [[`Las dos casillas que ya están multiplican ${f(a * b)}.`], [`Como la fila multiplica, se divide: ${f(Pc)} ÷ ${f(a * b)} = ${f(x)}.`]] });
  }

  // ---------- Idea 6: la pirámide de sumas ----------
  function tCima(rng) {
    const k = rng.elegir([3, 4, 4, 5]), base = rng.barajar(rango(1, 12)).slice(0, k), c = cima(base), w = pesos(k);
    const dos = base.map((q, i) => q * (i === 0 || i === k - 1 ? 1 : 2)).reduce((a, b) => a + b, 0);
    return cerrar(rng, { datos: { tipo: 'cima', base }, correcta: c,
      errores: [h('RMP1-una-vez', suma(base), 'Eso cuenta cada adobe una vez, pero los del medio suben por más de un camino.'), h('RMP189-dos-veces', dos, `Con ${PAL[k].replace('una', 'uno')} abajo, los del medio no suben solo dos veces.`), h('RMP190-el-doble', 2 * suma(base), 'Cada fila suma más que la de abajo, pero no siempre el doble.')],
      enunciado: [`En un muro de adobes van ${PAL[k].replace('una', 'uno')} abajo: ${lista(base)}, en ese orden.`], pregunta: ['¿Cuánto vale la cima?'],
      solucion: [[`La cima cuenta cada adobe de abajo tantas veces como caminos tiene: ${w.join(', ')}.`], [`${base.map((q, i) => `${f(q)} × ${w[i]}`).join(' + ')} = ${f(c)}.`]] });
  }
  function tBase(rng) {
    const k = rng.elegir([3, 4]), base = rng.barajar(rango(1, 12)).slice(0, k), j = rng.entero(1, k - 2), c = cima(base), w = pesos(k), x = base[j];
    const otros = suma(base.map((q, i) => (i === j ? 0 : q * w[i]))), sumO = suma(base) - x;
    return cerrar(rng, { datos: { tipo: 'base', base, j, cima: c }, correcta: x,
      errores: [h('RMP61-sin-dividir', c - otros, `Se quitó lo de los otros, pero falta dividir entre sus ${w[j]} caminos.`), h('RMP1-una-vez', c - sumO, 'Se restaron los otros una sola vez, pero cada uno cuenta tantas veces como caminos tiene.'), h('RMP63-sin-restar', c / w[j], 'Antes de dividir hay que quitar lo que aportan los otros.')],
      enunciado: [`En un muro de adobes van ${PAL[k].replace('una', 'uno')} abajo y la cima vale ${f(c)}. Abajo están ${base.map((q, i) => (i === j ? '?' : f(q))).join(', ')}.`], pregunta: ['¿Qué número falta?'],
      solucion: [[`Los caminos son ${w.join(', ')}, así que los adobes conocidos aportan ${f(otros)}.`], [`Lo que queda se reparte entre los ${w[j]} caminos del que falta: (${f(c)} − ${f(otros)}) ÷ ${w[j]} = ${f(x)}.`]] });
  }
  function tMayorCima(rng) {
    const k = 4, nums = rng.barajar(rango(1, 12)).slice(0, k).sort((a, b) => a - b), w = pesos(k);
    const todas = perms(nums).map(cima), max = Math.max(...todas), min = Math.min(...todas);
    return cerrar(rng, { datos: { tipo: 'mayorCima', nums }, correcta: max,
      errores: [h('RMP2-en-orden', cima(nums), 'En el orden dado no es la mayor, porque los grandes van al medio.'), h('RMP2-al-reves', min, 'Esa es la menor: los grandes van al medio, no a las puntas.'), h('RMP1-una-vez', suma(nums), 'Eso cuenta cada tarjeta una vez, pero las del medio suben por tres caminos.')],
      enunciado: [`Las tarjetas ${lista(nums)} van abajo en un muro de adobes de cuatro, en el orden que quieras.`], pregunta: ['¿Cuál es la mayor cima posible?'],
      solucion: [[`Los caminos son ${w.join(', ')}, así que los dos números mayores van al medio, donde cuentan tres veces.`], [`La mayor cima es ${f(max)}.`]] });
  }

  const CONSTR = { grupos: tGrupos, 'se-puede': tSePuede, falta: tFalta, lado: tLado, esquinas: tEsquinas, cruz: tCruz,
    mayor: r => tExtremo(r, 'mayor'), menor: r => tExtremo(r, 'menor'), diferencia: r => tExtremo(r, 'diferencia'),
    suma3: tSuma3, opuesta: tOpuesta, suma4: tSuma4, centro: tCentroP, opuestaP: tOpuestaP, filaP: tFilaP, cima: tCima, base: tBase, mayorCima: tMayorCima };
  const TIPOS_POR_IDEA = {
    'reparto-parejo': ['grupos', 'se-puede', 'falta'],
    'vertices-dos-veces': ['lado', 'esquinas', 'cruz'],
    'mayor-suma': ['mayor', 'menor', 'diferencia'],
    'suma-magica': ['suma3', 'opuesta', 'suma4'],
    'producto-magico': ['centro', 'opuestaP', 'filaP'],
    'piramide-de-sumas': ['cima', 'base', 'mayorCima'],
  };
  const TIPOS = Object.values(TIPOS_POR_IDEA).flat();

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const idea = o.idea && TIPOS_POR_IDEA[o.idea] ? o.idea : null;
    const tipo = idea ? Azar.crear(ID + '+idea|' + idea + '|' + semilla).elegir(TIPOS_POR_IDEA[idea]) : rng.elegir(TIPOS);
    for (let intento = 0; intento < 300; intento++) {
      const p = CONSTR[tipo](rng);
      if (p && p.alternativas.length >= 4) {
        p.id = `${ID}#${semilla}`;
        p._datos = Object.assign({ idea: Object.keys(TIPOS_POR_IDEA).find(k => TIPOS_POR_IDEA[k].includes(tipo)) }, p._datos);
        return p;
      }
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  // resolver(_datos): la respuesta por búsqueda completa, para casos.json y las pruebas.
  function resolver(d) {
    switch (d.tipo) {
      case 'grupos': { const ns = rango(d.a, d.a + d.d * (d.k * d.r - 1), d.d); return suma(ns) / d.k; }
      case 'se-puede': return mitad(d.nums).tipo;
      case 'falta': { const ns = rango(d.a, d.a + d.d * (d.k * d.r - 1), d.d); return suma(ns) / d.k - suma(d.tiene); }
      case 'lado': return sumasMarco(d.nums, d.L, d.esq)[0];
      case 'esquinas': return d.L * d.S - suma(d.nums);
      case 'cruz': return cruz(d.nums, d.c);
      case 'mayor': { const s = sumasMarco(d.nums, d.L); return s[s.length - 1]; }
      case 'menor': return sumasMarco(d.nums, d.L)[0];
      case 'diferencia': { const s = sumasMarco(d.nums, d.L); return s[s.length - 1] - s[0]; }
      case 'suma3': return suma(d.nums) / 3;
      case 'opuesta': return 2 * d.c - d.a;
      case 'suma4': return suma(rango(d.a, d.a + 15 * d.d, d.d)) / 4;
      case 'centro': return Math.round(Math.cbrt(d.P));
      case 'opuestaP': return d.c * d.c / d.a;
      case 'filaP': return d.P / (d.a * d.b);
      case 'cima': return cima(d.base);
      case 'base': { for (let x = 1; x <= 60; x++) if (cima(d.base.map((q, i) => (i === d.j ? x : q))) === d.cima) return x; return null; }
      case 'mayorCima': return Math.max(...perms(d.nums).map(cima));
    }
    return null;
  }

  const calc = { reparte, mitad, sumasMarco, cruz, cima, pesos, resolver };
  return { id: ID, titulo: 'Repartos, marcos y cuadrados mágicos', generar, calc, TIPOS_POR_IDEA, tiposPorUnidad: { [UNIDAD]: TIPOS } };
});
