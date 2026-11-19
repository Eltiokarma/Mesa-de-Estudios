/*
 * Generador «Polígonos y cuadriláteros»: la práctica de las seis ideas de geometria.poligonos-y-cuadrilateros
 * (contenido/teoria/geometria/poligonos-y-cuadrilateros.js). Formato "predicciones" (docs/arquitectura.md). Funciona en el
 * navegador (window.Generadores['geo-poligonos-cuadrilateros']) y en Node (require). Propuesta: docs/etapa6/propuesta-geometria.md §7a.
 *
 * Tipos por idea (nivel 1: un paso; 2: dos pasos; 3: de examen, con modelos de San Marcos):
 *   suma-de-angulos            suma (1) · lados (2): desde la suma (San Marcos 2023-I) · falta (2): el ángulo que falta ·
 *                              bisectrices (3): las de C y D en un cuadrilátero (San Marcos 2025-I)
 *   angulos-exteriores         cada (1): el ángulo de un equiángulo · n-interior (2): los lados desde el interior ·
 *                              hexagono (3): el hexágono equiángulo (San Marcos 2026-II)
 *   diagonales                 total (1) · n-diag (2): los lados desde el total · mas-lados (3): «si tuviera k lados más»
 *   paralelogramos             ang-par (1): ángulos opuestos y vecinos · diag-par (2): las mitades de una diagonal con x ·
 *                              bisectriz-par (3): la bisectriz que arma un isósceles
 *   rectangulo-rombo-cuadrado  rect-ang (2): el ángulo entre las diagonales del rectángulo · rombo-ang (2): la diagonal del
 *                              rombo parte su ángulo · cuad-eq (3): el cuadrado con un equilátero (San Marcos 2024-II)
 *   trapecios                  mediana (1) · pq (1) · base (2) · tres (3): tres paralelas (San Marcos 2027-I)
 * Todos se resuelven con el texto (sin figura): la práctica y el papel no llevan dibujo.
 *
 * Datos (punto 13; molde §4): una línea por dato, las mismas reglas de la teoría, nunca el paso hecho. Notación de la
 * unidad: m∠A; x sin «°»; «diagonales» sin letra; las bases del trapecio por su nombre. Colores: lo pedido y su resultado
 * en violeta (x), solo en la solución.
 * Errores (todos hipótesis de aula, salvo GE10 y GE23 del informe; docs/investigacion/geometria-ideas-erroneas.md,
 * «Polígonos y cuadriláteros»). Ninguna explicación nombra una alternativa por su letra; cada una empieza por lo que el
 * alumno hizo bien.
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'geo-poligonos-cuadrilateros';
  const v = P.v;
  const f = x => P.formatear(x, 2);
  const gr = x => `${f(x)}°`;
  const cm = x => `${f(x)} cm`;
  const n_ = x => f(x);
  const er = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: id === 'GE10' || id === 'GE23' ? 'parcial' : 'hipotesis', fuente: null });
  const exL = (p, q) => `${p === 1 ? '' : p}x${q ? ` ${q < 0 ? '−' : '+'} ${Math.abs(q)}` : ''}`;

  const D = {
    S: 'Los ángulos interiores de un polígono convexo de n lados suman (n − 2) · 180°.',
    cuad: 'Los ángulos interiores de un cuadrilátero convexo suman 360°.',
    tri: 'En todo triángulo, los tres ángulos interiores suman 180°.',
    bis: 'Bisectriz de un ángulo: la recta que lo parte en dos ángulos iguales.',
    ext: 'Los ángulos exteriores de un polígono convexo suman 360°, uno por vértice.',
    cada: 'En un polígono equiángulo de n lados, cada exterior mide 360° ÷ n.',
    ady: 'En cada vértice, el ángulo interior y el exterior forman 180°.',
    eql: 'Un triángulo con sus tres ángulos de 60° es equilátero: sus tres lados miden igual.',
    per: 'El perímetro de un polígono es la suma de todos sus lados.',
    nd: 'Un polígono convexo de n lados tiene n(n − 3) ÷ 2 diagonales.',
    prop: 'En un paralelogramo, los lados opuestos miden igual y los ángulos opuestos también.',
    vec: 'En un paralelogramo, dos ángulos vecinos (del mismo lado) suman 180°.',
    diagP: 'Las diagonales de un paralelogramo se cortan en su punto medio.',
    alt: 'Alternos internos entre paralelas: miden igual.',
    iso: 'En un triángulo isósceles, los ángulos de la base miden igual; y al revés: ángulos iguales, lados iguales.',
    rect: 'Rectángulo: paralelogramo con sus cuatro ángulos rectos. Sus diagonales miden igual.',
    rombo: 'Rombo: paralelogramo con sus cuatro lados iguales. Sus diagonales son perpendiculares y parten sus ángulos por la mitad.',
    cuadr: 'Cuadrado: es rectángulo y rombo a la vez.',
    med: 'Mediana del trapecio: el segmento que une los puntos medios de los lados no paralelos.',
    mn: 'La mediana del trapecio es paralela a las bases y mide su semisuma: (base mayor + base menor) ÷ 2.',
    pq: 'El tramo entre los puntos medios de las diagonales mide la semidiferencia de las bases: (mayor − menor) ÷ 2.',
    // (Auditoría, 19 nov: el enunciado dice que las diagonales cortan la mediana; faltaba que la cortan en sus puntos medios.)
    medios: 'La mediana del trapecio corta cada diagonal en su punto medio.',
  };

  // =============================== Idea 1: suma de ángulos interiores ===============================
  function suma(rng) {
    const n = rng.entero(5, 20), S = (n - 2) * 180;
    return { enunciado: [`Un polígono convexo tiene ${n} lados.`], pregunta: ['¿Cuánto suman sus ángulos interiores?'], datos: [D.S], correcta: S, fmt: gr,
      errores: [er('GE23', n * 180, `Multiplicar por 180° está bien; pero salen ${n} − 2 triángulos, no ${n}.`), er('GE-POL10', (n - 1) * 180, `Contar triángulos está bien; desde un vértice salen ${n - 2}.`),
        er('GE-POL11', (n - 3) * 180, `${n - 3} son las diagonales desde un vértice; los triángulos son uno más.`), er('GE-POL1', 360, '360° es la suma de los exteriores; aquí se piden los interiores.')],
      solucion: [[`Desde un vértice salen ${n} − 2 = ${n - 2} triángulos.`], [`S = ${n - 2} · 180° = `, v('x', gr(S)), '.']],
      _datos: { tipo: 'suma', idea: 'suma-de-angulos', nivel: 1, n } };
  }
  function lados(rng) {
    const n = rng.entero(6, 24), S = (n - 2) * 180;
    return { enunciado: [`Los ángulos interiores de un polígono convexo suman ${gr(S)}.`], pregunta: ['¿Cuántos lados tiene?'], datos: [D.S], correcta: n, fmt: n_,
      errores: [er('GE-POL12', n - 2, `Dividir entre 180° está bien: da ${n - 2}, los triángulos. Los lados son dos más.`), er('GE-POL13', n - 4, 'Despejar está bien; el 2 que resta en n − 2 pasa sumando.'),
        er('GE-POL10', n - 1, 'Dividir entre 180° está bien; falta sumar 2, no 1.'), er('GE-POL29', n + 1, `Con ${n + 1} lados, la suma sería ${gr((n - 1) * 180)}.`)],
      solucion: [[`(n − 2) · 180° = ${gr(S)}, así que n − 2 = ${n - 2}.`], ['n = ', v('x', n_(n)), '.']],
      _datos: { tipo: 'lados', idea: 'suma-de-angulos', nivel: 2, S } };
  }
  function falta(rng) {
    for (;;) {
      const n = rng.elegir([5, 6, 7]), S = (n - 2) * 180, base = S / n;
      const dados = Array.from({ length: n - 1 }, () => 5 * Math.round((base + rng.entero(-25, 25)) / 5)), s = dados.reduce((a, b) => a + b, 0), x = S - s;
      if (x < 60 || x > 170 || dados.some(d => d >= 175)) continue;
      return { enunciado: [`Un polígono convexo de ${n} lados tiene ${n - 1} ángulos interiores de ${dados.slice(0, -1).map(gr).join(', ')} y ${gr(dados[n - 2])}.`], pregunta: ['¿Cuánto mide el ángulo que falta?'],
        datos: [D.S], correcta: x, fmt: gr,
        errores: [er('GE-POL10', (n - 1) * 180 - s, `Restar los conocidos está bien; la suma es ${gr(S)}, no ${gr((n - 1) * 180)}.`), er('GE-POL8', S / n, `Repartir ${gr(S)} en ${n} sería si fueran iguales.`),
          er('GE23', n * 180 - s, `Restar está bien; la suma es (${n} − 2) · 180°, no ${n} · 180°.`)],
        solucion: [[`La suma es (${n} − 2) · 180° = ${gr(S)}; los conocidos suman ${gr(s)}.`], [`${gr(S)} − ${gr(s)} = `, v('x', gr(x)), '.']],
        _datos: { tipo: 'falta', idea: 'suma-de-angulos', nivel: 2, n, dados } };
    }
  }
  function bisectrices(rng) {
    for (;;) {
      const a = 5 * rng.entero(12, 24), b = 5 * rng.entero(12, 24);
      if ((a + b) % 2 || a === b || a + b > 240) continue;
      const x = (a + b) / 2;
      return { enunciado: [`En el cuadrilátero convexo ABCD, m∠A = ${a}° y m∠B = ${b}°. Las bisectrices de los ángulos C y D se cortan en E.`], pregunta: ['¿Cuánto mide m∠CED?'],
        datos: [D.cuad, D.tri, D.bis], correcta: x, fmt: gr,
        errores: [er('GE-POL14', a + b, 'Usar A y B está bien; el ángulo en E es la mitad de su suma.'), er('GE-POL15', 180 - x, `${gr(180 - x)} suman las mitades de C y D; m∠CED es lo que les falta para 180°.`),
          er('GE-POL15', 360 - a - b, `${gr(360 - a - b)} suman C y D enteros; en E entran sus mitades.`)],
        solucion: [[`m∠C + m∠D = 360° − ${a}° − ${b}° = ${gr(360 - a - b)}; sus mitades suman ${gr(180 - x)}.`], [`m∠CED = 180° − ${gr(180 - x)} = `, v('x', gr(x)), '.']],
        _datos: { tipo: 'bisectrices', idea: 'suma-de-angulos', nivel: 3, a, b } };
    }
  }

  // =============================== Idea 2: ángulos exteriores ===============================
  const NS = [5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36];
  function cada(rng) {
    const n = rng.elegir(NS), e = 360 / n, i = 180 - e, pideInt = rng.entero(0, 1) === 1, c = pideInt ? i : e;
    return { enunciado: [`Un polígono equiángulo tiene ${n} lados.`], pregunta: [`¿Cuánto mide cada ángulo ${pideInt ? 'interior' : 'exterior'}?`], datos: [D.cada, D.ady], correcta: c, fmt: gr,
      errores: [er('GE-POL9', pideInt ? e : i, pideInt ? 'Dividir 360° entre n está bien: da el exterior; el interior completa 180°.' : 'Ese es el interior; el exterior es lo que gira: 360° ÷ n.'),
        er('GE-POL18', 180 / n, 'Repartir en partes iguales está bien; se reparte una vuelta, 360°.'), er('GE-POL17', (n - 2) * 180, 'Esa es la suma de todos los interiores; se pide uno.'),
        er('GE-POL19', 360 / (n - 2), `Repartir 360° está bien; entre los ${n} vértices, no entre ${n - 2}.`)],
      solucion: [[`Cada exterior: 360° ÷ ${n} = ${gr(e)}.${pideInt ? ' El interior completa 180°.' : ''}`], [pideInt ? `180° − ${gr(e)} = ` : 'Cada exterior mide ', v('x', gr(c)), '.']],
      _datos: { tipo: 'cada', idea: 'angulos-exteriores', nivel: 1, n, pideInt } };
  }
  function nInterior(rng) {
    const n = rng.elegir(NS.filter(x => x >= 6)), e = 360 / n, i = 180 - e;
    return { enunciado: [`Cada ángulo interior de un polígono regular mide ${gr(i)}.`], pregunta: ['¿Cuántos lados tiene?'], datos: [D.cada, D.ady, 'Polígono regular: lados iguales y ángulos iguales.'], correcta: n, fmt: n_,
      errores: [er('GE-POL18', 180 / e, `Hallar el exterior, ${gr(e)}, está bien; los exteriores suman 360°, no 180°.`), er('GE-POL20', e, `${f(e)} es cada exterior, en grados; falta ver cuántos caben en 360°.`),
        er('GE-POL21', i / e, 'Hallar los dos ángulos está bien; los lados salen de 360° entre el exterior.')],
      solucion: [[`Cada exterior: 180° − ${gr(i)} = ${gr(e)}.`], [`n = 360° ÷ ${gr(e)} = `, v('x', n_(n)), '.']],
      _datos: { tipo: 'n-interior', idea: 'angulos-exteriores', nivel: 2, i } };
  }
  function hexagono(rng) {
    for (;;) {
      const l = [rng.entero(2, 8), rng.entero(2, 8), rng.entero(2, 8), rng.entero(2, 8)], de = l[0] + l[1] - l[3], fa = l[2] + de - l[0];
      if (de < 1 || fa < 1) continue;
      const per = l[0] + l[1] + l[2] + de + l[3] + fa, L = fa + l[0] + l[1];
      return { enunciado: [`El hexágono ABCDEF es equiángulo: AB = ${cm(l[0])}, BC = ${cm(l[1])}, CD = ${cm(l[2])} y EF = ${cm(l[3])}. Al prolongar AB, CD y EF se forma un triángulo.`], pregunta: ['¿Cuánto mide el perímetro del hexágono?'],
        datos: [D.cada, D.eql, D.per], correcta: per, fmt: cm,
        errores: [er('GE-POL23', 2 * l[0] + l[1] + 2 * l[2] + l[3], 'Sumar los seis lados está bien; pero aquí los lados opuestos no miden igual.'), er('GE-POL24', 3 * L, `Ver los equiláteros está bien; ${cm(3 * L)} es el perímetro del triángulo grande.`),
          er('GE-POL25', l.reduce((a, b) => a + b, 0), 'Sumar lados está bien; faltan DE y FA, que salen de los equiláteros.')],
        solucion: [[`Cada exterior mide 60°: el triángulo grande y los de las esquinas son equiláteros, de lado ${cm(L)} el grande.`], [`DE = ${cm(de)} y FA = ${cm(fa)}; perímetro = `, v('x', cm(per)), '.']],
        _datos: { tipo: 'hexagono', idea: 'angulos-exteriores', nivel: 3, l } };
    }
  }

  // =============================== Idea 3: número de diagonales ===============================
  const nd = n => n * (n - 3) / 2;
  function total(rng) {
    const n = rng.entero(5, 25);
    return { enunciado: [`Un polígono convexo tiene ${n} lados.`], pregunta: ['¿Cuántas diagonales tiene?'], datos: [D.nd], correcta: nd(n), fmt: n_,
      errores: [er('GE-POL4', n * (n - 3), `${n} · ${n - 3} cuenta cada diagonal dos veces, una por punta.`), er('GE23', n * (n - 1) / 2, `Dividir entre 2 está bien; n(n − 1) ÷ 2 cuenta también los ${n} lados.`),
        er('GE-POL5', n - 3, `${n - 3} salen de un solo vértice.`)],
      solucion: [[`De cada vértice salen ${n - 3}; cada diagonal tiene dos puntas.`], [`${n} · ${n - 3} ÷ 2 = `, v('x', n_(nd(n))), '.']],
      _datos: { tipo: 'total', idea: 'diagonales', nivel: 1, n } };
  }
  function nDiag(rng) {
    const n = rng.entero(6, 22), Dg = nd(n);
    return { enunciado: [`Un polígono convexo tiene ${Dg} diagonales.`], pregunta: ['¿Cuántos lados tiene?'], datos: [D.nd], correcta: n, fmt: n_,
      errores: [er('GE-POL29', n + 1, `Con ${n + 1} lados tendría ${nd(n + 1)} diagonales.`), er('GE-POL29', n - 1, `Con ${n - 1} lados tendría ${nd(n - 1)} diagonales.`),
        er('GE-POL5', n - 3, `${n - 3} son las diagonales de un vértice, no los lados.`)],
      solucion: [[`Se busca n con n(n − 3) = ${2 * Dg}: ${n} · ${n - 3} = ${2 * Dg}.`], ['n = ', v('x', n_(n)), '.']],
      _datos: { tipo: 'n-diag', idea: 'diagonales', nivel: 2, Dg } };
  }
  function masLados(rng) {
    const k = rng.elegir([1, 2, 3, 4]), n = rng.entero(5, 16), dlt = nd(n + k) - nd(n);
    return { enunciado: [`Si un polígono convexo tuviera ${k} lado${k > 1 ? 's' : ''} más, tendría ${dlt} diagonales más.`], pregunta: ['¿Cuántos lados tiene?'], datos: [D.nd], correcta: n, fmt: n_,
      errores: [er('GE-POL32', n + k, `Plantear la resta está bien; ${n + k} serían los lados con ${k} más.`), er('GE-POL27', dlt, `${dlt} son las diagonales que aumentan, no los lados.`),
        er('GE-POL29', n - 1, `Con ${n - 1} lados, al agregar ${k} aumentarían ${nd(n - 1 + k) - nd(n - 1)}.`)],
      solucion: [[`Se resta el total con ${k} lado${k > 1 ? 's' : ''} más y el de ahora: con n = ${n}, ${nd(n + k)} − ${nd(n)} = ${dlt}.`], ['n = ', v('x', n_(n)), '.']],
      _datos: { tipo: 'mas-lados', idea: 'diagonales', nivel: 3, k, dlt } };
  }

  // =============================== Idea 4: el paralelogramo ===============================
  function angPar(rng) {
    const A = 5 * rng.entero(8, 28), pide = rng.elegir(['B', 'C', 'D']), val = pide === 'C' ? A : 180 - A;
    if (A === 90) return angPar(rng);
    return { enunciado: [`En el paralelogramo ABCD, m∠A = ${A}°.`], pregunta: [`¿Cuánto mide m∠${pide}?`], datos: [D.prop, D.vec], correcta: val, fmt: gr,
      errores: [er('GE-PC5', 180 - val, pide === 'C' ? 'C es opuesto a A: mide igual, no lo que le falta para 180°.' : `${pide} es vecino de A: suman 180°, no miden igual.`),
        er('GE-PC7', 90, 'Cada ángulo mediría 90° solo en un rectángulo.'), er('GE-PC23', 360 - A, `Restar de 360° está bien para la suma de los cuatro; ${pide} es uno solo.`)],
      solucion: [[pide === 'C' ? 'A y C son opuestos: miden igual.' : `A y ${pide} son vecinos: suman 180°.`], [`m∠${pide} = `, v('x', gr(val)), '.']],
      _datos: { tipo: 'ang-par', idea: 'paralelogramos', nivel: 1, A, pide } };
  }
  function diagPar(rng) {
    for (;;) {
      const x = rng.entero(3, 15), p = rng.entero(2, 4), q = rng.entero(-8, 5), h = p * x + q, s = h - x;
      if (h < 4 || s === 0) continue;
      return { enunciado: [`En el paralelogramo ABCD, las diagonales se cortan en O; AO = ${exL(p, q)} y OC = ${exL(1, s)}, en centímetros.`], pregunta: ['¿Cuánto mide AC?'], datos: [D.diagP], correcta: 2 * h, fmt: cm,
        errores: [er('GE-PC10', h, `${cm(h)} es AO, la mitad; AC tiene dos mitades.`), er('GE-CON30', x, `x = ${x} está bien; falta reemplazarlo y duplicar.`), er('GE-PC11', 4 * h, `Duplicar una vez está bien; ${cm(2 * h)} ya es AC.`)],
        solucion: [[`O es el punto medio de AC: ${exL(p, q)} = ${exL(1, s)}, x = ${x} y AO = ${h}.`], [`AC = 2 · ${h} = `, v('x', cm(2 * h)), '.']],
        _datos: { tipo: 'diag-par', idea: 'paralelogramos', nivel: 2, p, q, s } };
    }
  }
  function bisectrizPar(rng) {
    const ab = rng.entero(4, 14), bc = ab + rng.entero(2, 10);
    return { enunciado: [`En el paralelogramo ABCD, AB = ${cm(ab)} y BC = ${cm(bc)}. La bisectriz del ángulo A corta BC en E.`], pregunta: ['¿Cuánto mide EC?'], datos: [D.bis, D.alt, D.iso], correcta: bc - ab, fmt: cm,
      errores: [er('GE-PC12', ab, `BE = ${cm(ab)} está bien (△ABE es isósceles); se pide EC.`), er('GE-PC13', bc / 2, 'La bisectriz parte el ángulo, no el lado BC.'), er('GE-PC14', ab + bc, 'EC es lo que queda de BC sin BE: se resta.'),
        er('GE-PC24', (bc - ab) / 2, `Restar está bien; EC no se parte: mide ${cm(bc - ab)} entero.`)],
      solucion: [['Por los alternos internos, m∠BAE = m∠AEB: △ABE es isósceles y BE = AB.'], [`EC = ${bc} − ${ab} = `, v('x', cm(bc - ab)), '.']],
      _datos: { tipo: 'bisectriz-par', idea: 'paralelogramos', nivel: 3, ab, bc } };
  }

  // =============================== Idea 5: rectángulo, rombo y cuadrado ===============================
  function rectAng(rng) {
    const th = 2 * rng.entero(25, 70);
    if (th === 90) return rectAng(rng);
    const val = (180 - th) / 2;
    return { enunciado: [`En el rectángulo ABCD, las diagonales se cortan en O y m∠AOB = ${th}°.`], pregunta: ['¿Cuánto mide m∠OAB?'], datos: [D.rect, D.diagP, D.iso], correcta: val, fmt: gr,
      errores: [er('GE-PC19', th / 2, `Partir está bien; se parte 180° − ${th}°, entre los dos ángulos iguales.`), er('GE-PC20', 180 - th, `${gr(180 - th)} es m∠BOC; falta repartirlo.`), er('GE-CON35', th, `${th}° está en O; en A va otro ángulo.`)],
      solucion: [['OA = OB (mitades de diagonales iguales): △AOB es isósceles.'], [`(180° − ${th}°) ÷ 2 = `, v('x', gr(val)), '.']],
      _datos: { tipo: 'rect-ang', idea: 'rectangulo-rombo-cuadrado', nivel: 2, th } };
  }
  function romboAng(rng) {
    const a = 2 * rng.entero(20, 60);
    if (a === 90) return romboAng(rng);
    const val = (180 - a) / 2;
    return { enunciado: [`En el rombo ABCD, m∠A = ${a}°.`], pregunta: ['¿Cuánto mide m∠ABD?'], datos: [D.rombo, D.vec], correcta: val, fmt: gr,
      errores: [er('GE-PC19', a / 2, `Partir por la mitad está bien; BD parte a B, que mide ${180 - a}°.`), er('GE-CON36', 180 - a, 'La diagonal BD parte a B en dos iguales: falta la mitad.'), er('GE-PC2', 90, '90° es el cruce de las diagonales, no un ángulo en B.')],
      solucion: [[`m∠B = 180° − ${a}° = ${180 - a}°, y BD lo parte por la mitad.`], [`${180 - a}° ÷ 2 = `, v('x', gr(val)), '.']],
      _datos: { tipo: 'rombo-ang', idea: 'rectangulo-rombo-cuadrado', nivel: 2, a } };
  }
  function cuadEq(rng) {
    const afuera = rng.entero(0, 1) === 1, val = afuera ? 15 : 75;
    return { enunciado: [`${afuera ? 'Fuera' : 'Dentro'} del cuadrado ABCD se dibuja el triángulo equilátero BCE.`], pregunta: ['¿Cuánto mide m∠BAE?'], datos: [D.cuadr, D.eql, D.iso, D.tri], correcta: val, fmt: gr,
      errores: [er('GE-CON35', 60, '60° es del equilátero; en A va un ángulo del triángulo ABE.'),
        // (Auditoría: afuera, «la mitad de 15°» no salía de ningún error; queda solo el suplemento, adentro.)
        ...(afuera ? [] : [er('GE-CON34', 180 - val, `${gr(180 - val)} es el suplemento; en A va el ángulo del triángulo ABE.`)]),
        er('GE-PC21', afuera ? 150 : 30, 'Ese es el ángulo en B del triángulo ABE, no en A.'), er('GE-PC22', 45, '45° es el ángulo de la diagonal; AE no es diagonal.'),
        er('GE-PC21', 90 - val, 'Ese es el otro pedazo de la esquina A.')],
      solucion: [[`BA = BE: △ABE es isósceles, con ${afuera ? '150°' : '30°'} en B.`], [`(180° − ${afuera ? 150 : 30}°) ÷ 2 = `, v('x', gr(val)), '.']],
      _datos: { tipo: 'cuad-eq', idea: 'rectangulo-rombo-cuadrado', nivel: 3, afuera } };
  }

  // =============================== Idea 6: el trapecio ===============================
  function mediana(rng) {
    const B = rng.entero(8, 32), b = rng.entero(3, B - 2);
    if ((B + b) % 2) return mediana(rng);
    return { enunciado: [`Las bases de un trapecio miden ${cm(B)} y ${cm(b)}.`], pregunta: ['¿Cuánto mide su mediana?'], datos: [D.med, D.mn], correcta: (B + b) / 2, fmt: cm,
      errores: [er('GE-TRP2', B + b, 'Sumar las bases está bien; la mediana es la mitad.'), er('GE-TRP1', (B - b) / 2, 'Esa es la semidiferencia: el tramo entre las diagonales.'), er('GE-TRP4', B / 2, 'La mediana promedia las dos bases, no solo la mayor.')],
      solucion: [['La mediana es la semisuma de las bases.'], [`(${B} + ${b}) ÷ 2 = `, v('x', cm((B + b) / 2)), '.']],
      _datos: { tipo: 'mediana', idea: 'trapecios', nivel: 1, B, b } };
  }
  function pq(rng) {
    const B = rng.entero(9, 32), b = rng.entero(3, B - 2);
    if ((B - b) % 2) return pq(rng);
    return { enunciado: [`En un trapecio de bases ${cm(B)} y ${cm(b)}, las diagonales cortan la mediana en P y Q.`], pregunta: ['¿Cuánto mide PQ?'], datos: [D.med, D.medios, D.pq], correcta: (B - b) / 2, fmt: cm,
      errores: [er('GE-TRP1', (B + b) / 2, 'Esa es la mediana entera; PQ es su tramo del medio.'), er('GE-TRP2', B - b, 'Restar las bases está bien; PQ es la mitad.'), er('GE-TRP3', b / 2, 'Esa es MP, la mitad de la base menor.')],
      solucion: [['PQ es la semidiferencia de las bases.'], [`(${B} − ${b}) ÷ 2 = `, v('x', cm((B - b) / 2)), '.']],
      _datos: { tipo: 'pq', idea: 'trapecios', nivel: 1, B, b } };
  }
  function base(rng) {
    const mn = rng.entero(6, 22), b = rng.entero(2, mn - 1), B = 2 * mn - b;
    return { enunciado: [`En el trapecio ABCD (BC ∥ AD), la mediana mide ${cm(mn)} y la base menor BC, ${cm(b)}.`], pregunta: ['¿Cuánto mide la base mayor AD?'], datos: [D.mn], correcta: B, fmt: cm,
      errores: [er('GE-TRP5', mn - b, 'Restar la base que se tiene está bien; primero se duplica la mediana.'), er('GE-TRP6', mn + b, `Las bases suman ${2 * mn}, no ${mn}.`), er('GE-TRP7', 2 * mn, `${cm(2 * mn)} suman las dos bases; falta quitar BC.`)],
      solucion: [[`Las bases suman 2 · ${mn} = ${2 * mn}.`], [`AD = ${2 * mn} − ${b} = `, v('x', cm(B)), '.']],
      _datos: { tipo: 'base', idea: 'trapecios', nivel: 2, mn, b } };
  }
  function tres(rng) {
    const b = rng.entero(2, 12), B = b + 4 * rng.entero(1, 5), k = (B - b) / 4, ls = [b + k, b + 2 * k, b + 3 * k], t = ls.reduce((a, c) => a + c, 0);
    return { enunciado: [`En el trapecio ABCD, las bases miden BC = ${cm(b)} y AD = ${cm(B)}. AB se parte en cuatro partes iguales y por los tres puntos se trazan paralelas a las bases hasta CD.`],
      pregunta: ['¿Cuánto suman las tres paralelas?'], datos: [D.mn], correcta: t, fmt: cm,
      errores: [er('GE-TRP9', b + 2 * k, 'Esa es la del medio, la mediana; faltan las otras dos.'), er('GE-TRP10', B + b, 'La suma de las bases da la mediana; aquí son tres paralelas.'),
        er('GE-TRP9', 4 * (b + 2 * k), 'Las tres paralelas miden distinto; la del medio no se repite.')],
      solucion: [[`La del medio es la mediana, ${b + 2 * k}; las otras, medianas de trapecios más chicos: ${ls[0]} y ${ls[2]}.`], [`${ls[0]} + ${ls[1]} + ${ls[2]} = `, v('x', cm(t)), '.']],
      _datos: { tipo: 'tres', idea: 'trapecios', nivel: 3, b, B } };
  }

  // =============================== Armado ===============================
  const TIPOS = { suma, lados, falta, bisectrices, cada, 'n-interior': nInterior, hexagono, total, 'n-diag': nDiag, 'mas-lados': masLados,
    'ang-par': angPar, 'diag-par': diagPar, 'bisectriz-par': bisectrizPar, 'rect-ang': rectAng, 'rombo-ang': romboAng, 'cuad-eq': cuadEq, mediana, pq, base, tres };
  const IDEAS = {
    'suma-de-angulos': ['suma', 'lados', 'falta', 'bisectrices'],
    'angulos-exteriores': ['cada', 'n-interior', 'hexagono'],
    diagonales: ['total', 'n-diag', 'mas-lados'],
    paralelogramos: ['ang-par', 'diag-par', 'bisectriz-par'],
    'rectangulo-rombo-cuadrado': ['rect-ang', 'rombo-ang', 'cuad-eq'],
    trapecios: ['mediana', 'pq', 'base', 'tres'],
  };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»): las seis ideas.
  const PAPEL = { 'papel-1': 'lados', 'papel-2': 'n-interior', 'papel-3': 'total', 'papel-4': 'bisectriz-par', 'papel-5': 'rombo-ang', 'papel-6': 'mediana', 'papel-7': 'bisectrices', 'papel-8': 'tres' };
  // Prueba del curso (reserva pc-01 y pc-02: catalogo/pruebas/geometria.json).
  const PRUEBA = { 'pc-01': 'bisectriz-par', 'pc-02': 'pq' };

  function generar(semilla, opciones = {}) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const fijo = PAPEL[String(semilla)] || PRUEBA[String(semilla)] || opciones.tipo;
    const idea = opciones.idea && IDEAS[opciones.idea] ? opciones.idea : rng.elegir(Object.keys(IDEAS));
    const tipo = fijo || rng.elegir(IDEAS[idea]);
    for (let intento = 0; intento < 200; intento++) {
      const pr = TIPOS[tipo](rng);
      const errores = pr.errores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && P.enEscala(e.valor, pr.correcta, e.id));
      const alternativas = P.armar({ correcta: pr.correcta, errores, rng, texto: pr.fmt });
      if (alternativas.length < 4) continue;
      return { id: `${ID}#${semilla}`, variables: { x: { nombre: 'lo que se pide', color: 'f' } },
        enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos, alternativas, solucion: pr.solucion,
        respuesta: { valor: pr.correcta, unidad: '' }, _datos: Object.assign({ valor: pr.correcta }, pr._datos) };
    }
    throw new Error(`${ID}: no se pudo generar un problema con 4 alternativas distintas (${tipo})`);
  }

  // TIPOS_POR_IDEA: lo que lee el catálogo para «Practicar por idea» (herramientas/construir-catalogo.js).
  return { id: ID, titulo: 'Polígonos y cuadriláteros', generar, TIPOS: Object.keys(TIPOS), IDEAS, TIPOS_POR_IDEA: IDEAS };
});
