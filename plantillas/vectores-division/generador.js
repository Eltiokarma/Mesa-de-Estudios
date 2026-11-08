/*
 * Generador G6: un vector en función de otros dentro de una figura (T4 de docs/clasificacion/compendio-vectores.md).
 * Formato "predicciones" con alternativas de texto (armarTexto de nucleo/predicciones.js).
 * Funciona en el navegador (window.Generadores['vectores-division']) y en Node (require).
 *
 * Tipos (la respuesta es una expresión como (2a + b)/3, con fracciones exactas):
 *   division        OA = a, OB = b y P en AB con AP : PB = m : n → OP = (n·a + m·b)/(m + n) (pesos cruzados)
 *   baricentro      en el triángulo ABC, AB = u y AC = w → AG = (u + w)/3
 *   trapecio        AB = a y DC = b paralelas: entre los puntos medios de las diagonales, (a − b)/2;
 *                   entre los puntos medios de los lados no paralelos, (a + b)/2
 *   paralelogramo   ABCD con AB = a y AD = b; M punto medio de un lado (o que lo divide en 1 : 2)
 * Internamente cada vector es una combinación [coef de a, coef de b] con fracciones exactas, y la
 * respuesta sale de restar posiciones (final menos inicio). Errores: hipótesis nuestras.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const h = (id, r, explicacion) => (r ? { id, clave: r.clave, texto: r.texto, explicacion, respaldo: 'hipotesis', fuente: null } : null);
  const TIPOS = ['division', 'baricentro', 'trapecio', 'paralelogramo'];
  // Aritmética de combinaciones: [p, q] con p, q fracciones { n, d }.
  const F = (n, d = 1) => P.frac(n, d);
  const sumF = (x, y) => F(x.n * y.d + y.n * x.d, x.d * y.d);
  const mulF = (x, k) => F(x.n * k.n, x.d * k.d);
  const comb = (p, q) => [F(...[].concat(p)), F(...[].concat(q))];
  const mas = (u, w) => [sumF(u[0], w[0]), sumF(u[1], w[1])];
  const por = (k, u) => [mulF(u[0], k), mulF(u[1], k)];
  const menos = (u, w) => mas(u, por(F(-1), w));
  const expr = (c, n) => P.combinacion(c, n);

  function generar(semilla) {
    const rng = Azar.crear('vectores-division|' + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 200; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo) {
    const v = P.v;
    const variables = { a: { nombre: 'vector a', color: 'o' }, b: { nombre: 'vector b', color: 'i' }, r: { nombre: 'razón o punto', color: 'h' }, X: { nombre: 'lo que se pide', color: 'd' } };
    let enunciado, pregunta, correcta, errores, solucion, datos;
    const N = ['a', 'b'];

    if (tipo === 'division') {
      const [m, n] = rng.elegir([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [1, 4], [3, 4], [1, 1]]);
      const s = m + n;
      // Posiciones desde O: A = a, B = b, P = A + (m/s)·(B − A).
      const A = comb(1, 0), B = comb(0, 1);
      const Pp = mas(A, por(F(m, s), menos(B, A)));
      correcta = expr(Pp, N);
      enunciado = ['Desde un punto O salen ', v('a', 'OA = a'), ' y ', v('b', 'OB = b'), '. El punto P está en el segmento AB y cumple ', v('r', `AP : PB = ${m} : ${n}`), '.'];
      pregunta = ['¿Cuánto vale OP en función de a y b?'];
      errores = [
        h('VE-pesos-derechos', m !== n ? expr([F(m, s), F(n, s)], N) : null, `Pusiste a cada extremo el peso de su propio trozo. P está más cerca de ${m < n ? 'A' : 'B'}, así que ${m < n ? 'a' : 'b'} pesa más: los pesos van cruzados.`),
        h('VE-pesos-mitades', m !== n ? expr([F(1, 2), F(1, 2)], N) : null, `(a + b)/2 es el punto medio. P divide AB en ${m} : ${n}, no en partes iguales.`),
        h('VE-pesos-sin-dividir', expr([F(n), F(m)], N), `Faltó dividir entre ${s}: los pesos de a y de b tienen que sumar 1.`),
        h('VE-vector-equivocado', expr(menos(Pp, A), N), 'Ese es AP (desde A), no OP (desde O). OP = OA + AP.'),
        h('VE-sentido-opuesto', expr(por(F(-1), Pp), N), 'Ese es PO: apunta al revés.'),
        h('VE-pesos-derechos', m === n ? expr([F(1, 3), F(2, 3)], N) : null, 'Repartiste el segmento en tercios, pero AP : PB = 1 : 1 pone P en el medio.'),
      ];
      solucion = [
        [`AP es ${m}/${s} de AB, y AB = OB − OA = b − a.`],
        [`OP = OA + AP = a + (${m}/${s})(b − a).`],
        ['OP = ', v('X', correcta.texto), `. Los pesos van cruzados: ${n}/${s} para a y ${m}/${s} para b.`],
      ];
      datos = { tipo, m, n };
    } else if (tipo === 'baricentro') {
      const variante = rng.elegir(['AG', 'GM', 'AM']);
      const u = comb(1, 0), w = comb(0, 1);
      const M = por(F(1, 2), mas(u, w));          // desde A
      const G = por(F(2, 3), M);
      const pide = variante === 'AG' ? G : variante === 'GM' ? menos(M, G) : M;
      const n2 = ['u', 'w'];
      correcta = expr(pide, n2);
      variables.a.nombre = 'vector u = AB'; variables.b.nombre = 'vector w = AC';
      enunciado = ['En el triángulo ABC, ', v('a', 'AB = u'), ' y ', v('b', 'AC = w'), '. M es el punto medio de BC y ', v('r', 'G'), ' es el baricentro.'];
      pregunta = [variante === 'AG' ? '¿Cuánto vale AG en función de u y w?' : variante === 'GM' ? '¿Cuánto vale GM en función de u y w?' : '¿Cuánto vale AM en función de u y w?'];
      errores = [
        h('VE-baricentro-invertido', expr(variante === 'AG' ? por(F(1, 3), M) : variante === 'GM' ? por(F(2, 3), M) : G, n2), variante === 'AM' ? 'Ese es AG. M es el punto medio de BC: AM es la mediana entera.' : 'Cambiaste 2/3 por 1/3. El baricentro está a 2/3 de la mediana contando desde el vértice: AG = (2/3)AM y GM = (1/3)AM.'),
        h('VE-baricentro-mitad', variante !== 'AM' ? expr(M, n2) : null, 'Esa es la mediana AM entera. G no está en M: está a 2/3 del camino desde A.'),
        h('VE-baricentro-sin-mitad', expr(por(F(variante === 'AG' ? 2 : variante === 'GM' ? 1 : 3, 3), mas(u, w)), n2), 'Aplicaste la fracción a u + w, que es el doble de la mediana. AM = (u + w)/2.'),
        h('VE-sin-mitad', expr(mas(u, w), n2), 'u + w es la diagonal del paralelogramo de lados u y w, que es el doble de la mediana.'),
        h('VE-sentido-opuesto', expr(por(F(-1), pide), n2), 'Ese vector apunta al revés.'),
        h('VE-diferencia-por-suma', expr(por(F(1, 2), menos(w, u)), n2), '(w − u)/2 es la mitad de BC, que va de B a C. La mediana va de A al punto medio de BC.'),
      ];
      solucion = [
        ['M es el punto medio de BC: AM = (AB + AC)/2 = (u + w)/2.'],
        ['El baricentro está a 2/3 de la mediana desde el vértice: AG = (2/3)AM y GM = (1/3)AM.'],
        [`${variante} = `, v('X', correcta.texto), '.'],
      ];
      datos = { tipo, variante };
    } else if (tipo === 'trapecio') {
      // A en el origen, AB = a, AD = d, DC = b (paralela a a, más corta). Nombres del alumno: a, b.
      const diagonales = rng.moneda();
      // Posiciones con tres "letras" internas [a, d, b]; d se cancela.
      const P3 = (x, y, z) => [F(x), F(y), F(z)];
      const s3 = (p, q) => p.map((x, i) => sumF(x, q[i]));
      const k3 = (k, p) => p.map(x => mulF(x, k));
      const A = P3(0, 0, 0), B = P3(1, 0, 0), D = P3(0, 1, 0), C = P3(0, 1, 1);
      const medio = (p, q) => k3(F(1, 2), s3(p, q));
      const [M, Nn] = diagonales ? [medio(A, C), medio(B, D)] : [medio(A, D), medio(B, C)];
      const MN = s3(Nn, k3(F(-1), M));
      if (MN[1].n !== 0) throw new Error('el vector auxiliar no se canceló');
      const res = [MN[0], MN[2]];
      correcta = expr(res, N);
      enunciado = ['En el trapecio ABCD, las bases son ', v('a', 'AB = a'), ' y ', v('b', 'DC = b'), ' (paralelas y del mismo sentido, con AB más larga). ',
        diagonales ? 'M y N son los puntos medios de las diagonales AC y BD.' : 'M y N son los puntos medios de los lados no paralelos AD y BC.'];
      pregunta = ['¿Cuánto vale MN en función de a y b?'];
      const otro = diagonales ? [F(1, 2), F(1, 2)] : [F(1, 2), F(-1, 2)];
      errores = [
        h('VE-semisuma-por-semidiferencia', expr(otro, N), diagonales ? '(a + b)/2 es la base media, que une los puntos medios de los lados no paralelos. Entre los puntos medios de las diagonales queda la semidiferencia.' : '(a − b)/2 es el segmento entre los puntos medios de las diagonales. La base media es la semisuma.'),
        h('VE-sin-mitad', expr(res.map(x => mulF(x, F(2))), N), 'Faltó la mitad: el teorema de los puntos medios da la mitad del lado paralelo.'),
        h('VE-sentido-opuesto', expr(res.map(x => mulF(x, F(-1))), N), 'Ese es NM: apunta al revés.'),
        h('VE-mitad-de-una-base', expr([F(1, 2), F(0)], N), 'Usaste solo la mitad de la base mayor. Hay que considerar las dos bases.'),
      ];
      solucion = diagonales
        ? [['Con A como origen y AD = d: M = (AC)/2 = (d + b)/2 y N = (AB + AD)/2 = (a + d)/2.'], ['MN = N − M = (a + d)/2 − (d + b)/2: d se cancela.'], ['MN = ', v('X', correcta.texto), ': la semidiferencia de las bases.']]
        : [['Con A como origen y AD = d: M = d/2 y N = (AB + AC)/2 = (a + d + b)/2.'], ['MN = N − M = (a + d + b)/2 − d/2: d se cancela.'], ['MN = ', v('X', correcta.texto), ': la base media es la semisuma de las bases.']];
      datos = { tipo, diagonales };
    } else {
      // Paralelogramo ABCD (A abajo a la izquierda, B, C, D en sentido antihorario): AB = a, AD = b.
      const caso = rng.elegir(['AM-CD', 'AM-BC', 'BM-CD', 'DM-BC', 'AM-tercio']);
      const A = comb(0, 0), B = comb(1, 0), D = comb(0, 1), C = comb(1, 1);
      let pide, texto, M;
      if (caso === 'AM-CD') { M = por(F(1, 2), mas(C, D)); pide = menos(M, A); texto = ['M es el punto medio de CD.', 'AM']; }
      else if (caso === 'AM-BC') { M = por(F(1, 2), mas(B, C)); pide = menos(M, A); texto = ['M es el punto medio de BC.', 'AM']; }
      else if (caso === 'BM-CD') { M = por(F(1, 2), mas(C, D)); pide = menos(M, B); texto = ['M es el punto medio de CD.', 'BM']; }
      else if (caso === 'DM-BC') { M = por(F(1, 2), mas(B, C)); pide = menos(M, D); texto = ['M es el punto medio de BC.', 'DM']; }
      else { M = mas(B, por(F(1, 3), menos(C, B))); pide = menos(M, A); texto = ['M está en BC y cumple BM : MC = 1 : 2.', 'AM']; }
      correcta = expr(pide, N);
      enunciado = ['En el paralelogramo ABCD (los vértices en ese orden), ', v('a', 'AB = a'), ' y ', v('b', 'AD = b'), '. ', v('r', texto[0])];
      pregunta = [`¿Cuánto vale ${texto[1]} en función de a y b?`];
      const sw = [pide[1], pide[0]];
      errores = [
        h('VE-mitad-equivocada', expr(sw, N), 'Pusiste la fracción en el vector equivocado. Mira qué lado del paralelogramo se recorre entero y cuál solo en parte.'),
        h('VE-sentido-opuesto', expr(por(F(-1), pide), N), `Ese vector va al revés: es el que llega al punto de partida de ${texto[1]}.`),
        h('VE-signo-de-un-coeficiente', expr([pide[0], mulF(pide[1], F(-1))], N), 'Un tramo tiene el sentido cambiado. Recorre la figura siguiendo las flechas: si vas contra una, lleva signo menos.'),
        h('VE-pesos-mitades', expr([F(1, 2), F(1, 2)], N), '(a + b)/2 es la mitad de la diagonal AC (llega al centro del paralelogramo), no a M.'),
        h('VE-sin-mitad', expr(pide.map(x => (x.d === 1 ? x : F(x.n > 0 ? 1 : -1))), N), 'Recorriste el lado entero donde solo va una parte.'),
      ];
      solucion = [
        ['Se va de un punto al otro siguiendo los lados: en un paralelogramo, BC = AD = b y DC = AB = a.'],
        [`${texto[1]} = `, v('X', correcta.texto), '.'],
        ['Comprobación: final menos inicio, con A en el origen, B = a, D = b y C = a + b.'],
      ];
      datos = { tipo, caso };
    }
    const alternativas = P.armarTexto({ correcta, errores: errores.filter(Boolean), rng });
    return {
      id: `vectores-division#${semilla}`, variables, enunciado, pregunta, datos: '', alternativas, solucion,
      respuesta: { valor: correcta.clave, texto: correcta.texto, unidad: '' },
      _datos: datos,
    };
  }

  return { id: 'vectores-division', titulo: 'Un vector en función de otros', generar };
});
