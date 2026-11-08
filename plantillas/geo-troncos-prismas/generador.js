/*
 * Generador: troncos de pirámide, pirámide menor por semejanza, prismas oblicuos y troncos de prisma.
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['geo-troncos-prismas']) y en Node (require).
 *
 * Convención de academia: sen 37° = 3/5, cos 37° = 4/5, tg 37° = 3/4; sen 53° = 4/5, cos 53° = 3/5,
 * tg 53° = 4/3; sen 30° = 1/2; tg 45° = 1; tg 60° = √3, cos 60° = 1/2.
 * «Diedro de la cara lateral» = ángulo entre una cara lateral y el plano de la base mayor.
 * «Apotema de la base» = distancia del centro de la base a un lado. «Apotema del tronco» = altura de
 * cada cara lateral (un trapecio isósceles).
 * Respuestas: racionales (p/q), múltiplos de π o k√3, según el tipo; longitudes en cm o m.
 *
 * Tipos y campos de _datos:
 *   tronco-piramide  volumen de un tronco de pirámide regular.
 *     sub 'cuadrada':  bases cuadradas de aristas L (mayor) y l (menor), altura h.
 *     sub 'bases-area': bases semejantes de áreas B y b (√(Bb) es entero), altura h.
 *     sub 'triangular-diedro': bases triángulos equiláteros de aristas L y l; cada cara lateral forma
 *                      60° con la base mayor (la altura no se da). V = h(B + b + √(Bb))/3.
 *   piramide-menor   semejanza: el volumen va con el cubo de la razón.
 *     sub 'corte':     pirámide de volumen V cortada por un plano paralelo a la base a la fracción p/q de
 *                      la altura medida desde el vértice; pide = 'menor' (la pirámide de arriba) o
 *                      'tronco' (la parte de abajo).
 *     sub 'desde-menor': tronco de pirámide con bases de aristas homólogas L y l; la pirámide que lo
 *                      completa (la de base l y el mismo vértice) tiene volumen vm. Pide el tronco.
 *   tronco-apotema   tronco de pirámide regular de bases cuadradas L y l; theta = diedro de las caras.
 *     sub 'lateral':   pide el área lateral 2(L + l)·apotema.
 *     sub 'chimenea':  encima del tronco hay un prisma recto de base cuadrada l y altura H; todo abierto
 *                      arriba y abajo. Pide el área de lata (caras laterales del tronco y del prisma).
 *     sub 'hueco':     se perfora a lo largo del eje un hueco cilíndrico de radio rho, de base a base.
 *                      dato 'bases': se dan los apotemas de las bases, A = L/2 y a = l/2;
 *                      dato 'lateral': se da el apotema del tronco ap (y no L ni l). Pide el volumen del hueco.
 *   prisma-oblicuo
 *     sub 'base-desde-recta': prisma hexagonal oblicuo; sección recta = hexágono regular de lado a;
 *                      las aristas laterales forman theta con el plano de la base. Pide el área de la base.
 *     sub 'cara-distancia': prisma triangular oblicuo; una cara lateral tiene área S y la arista lateral
 *                      opuesta está a distancia d de esa cara. Pide el volumen.
 *     sub 'volumen-arista': base de área B, aristas laterales de largo La que forman theta con la base.
 *                      Pide el volumen.
 *   tronco-prisma    prisma triangular recto cortado por un plano oblicuo; aristas laterales a, b, c.
 *     sub 'volumen':   la base es un triángulo rectángulo de catetos p y q. Pide el volumen.
 *     sub 'lateral':   la base es un triángulo equilátero de lado s. Pide el área lateral.
 *
 * Errores: GE2 (parcial) y GE20, GE21 de docs/investigacion/geometria-ideas-erroneas.md (los dos
 * últimos son hipótesis en el informe); los códigos GE-<nombre> son hipótesis nuestras.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const INF = 'docs/investigacion/geometria-ideas-erroneas.md';
  const PI = Math.PI, R3 = Math.sqrt(3);
  const h_ = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const par = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: INF });
  const v = P.v;
  const f = x => P.formatear(x, 2);

  // ---------- Cálculo puro (lo usan el generador y papel.json) ----------
  const calc = {
    troncoPiramide: (B, b, h) => h * (B + b + Math.sqrt(B * b)) / 3,
    areaEquilatero: l => R3 * l * l / 4,
    areaHexagono: a => 3 * R3 * a * a / 2,
    apotemaTronco: (L, l, cosTheta) => (L - l) / 2 / cosTheta,
    lateralTroncoCuadrado: (L, l, ap) => 2 * (L + l) * ap,
    piramideMenor: (V, k) => V * k ** 3,
    baseDesdeRecta: (Srecta, senTheta) => Srecta / senTheta,
    prismaCaraDistancia: (S, d) => S * d / 2,
    troncoPrisma: (A, a, b, c) => A * (a + b + c) / 3,
    lateralTroncoPrisma: (s, a, b, c) => s * (a + b + c),
    cilindro: (r, h) => PI * r * r * h,
  };

  // ---------- Cómo se escribe cada respuesta ----------
  const esEntero = x => Math.abs(x - Math.round(x)) < 1e-9 * Math.max(1, Math.abs(x));
  function racional(x, qmax = 12) {
    if (!Number.isFinite(x)) return null;
    for (let q = 1; q <= qmax; q++) if (esEntero(x * q)) return [Math.round(x * q), q];
    return null;
  }
  const conU = (t, u) => (u ? `${t} ${u}` : t);
  const textoQ = ([p, q]) => (q === 1 ? P.formatear(p) : `${P.formatear(p)}/${q}`);
  const FORMAS = {
    pi: u => x => P.pi(x, u),
    q: u => x => { const r = racional(x); return r && r[0] > 0 ? conU(textoQ(r), u) : null; },
    r3: u => x => {
      const r = racional(x / R3, 8); if (!r || r[0] <= 0) return null;
      const [p, q] = r, coef = p === 1 ? '' : P.formatear(p);
      return conU(q === 1 ? `${coef}√3` : `${coef}√3/${q}`, u);
    },
  };
  const tq = (x, u = '') => FORMAS.q(u)(x) || f(x);
  const tpi = (x, u = '') => P.pi(x, u) || f(x);
  const t3 = (x, u = '') => FORMAS.r3(u)(x) || f(x);

  const SEN = { 37: [3, 5], 53: [4, 5], 30: [1, 2] };
  const COS = { 37: [4, 5], 53: [3, 5] };
  const fr = ([a, b]) => a / b;

  function generar(semilla) {
    const rng = Azar.crear('geo-troncos-prismas|' + semilla);
    for (let intento = 0; intento < 200; intento++) {
      const pr = construir(rng, semilla);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  const TIPOS = ['tronco-piramide', 'piramide-menor', 'tronco-apotema', 'prisma-oblicuo', 'tronco-prisma'];

  function construir(rng, semilla) {
    const tipo = rng.elegir(TIPOS);
    const pr = HACER[tipo](rng);
    if (!pr) return null;
    const texto = FORMAS[pr.forma](pr.unidad);
    if (texto(pr.correcta) === null) return null;
    const errores = pr.errores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && texto(e.valor) !== null);
    const alternativas = P.armar({ correcta: pr.correcta, errores, rng, texto });
    return {
      id: `geo-troncos-prismas#${semilla}`, variables: pr.variables, enunciado: pr.enunciado, pregunta: pr.pregunta,
      datos: '', alternativas, solucion: pr.solucion,
      respuesta: { valor: pr.correcta, unidad: pr.unidad }, _datos: Object.assign({ tipo }, pr.datos),
    };
  }

  // Errores comunes del volumen del tronco de pirámide (B, b: áreas de las bases; h: altura).
  function erroresTronco(B, b, h, k = 1) {
    const m = Math.sqrt(B * b);
    return [
      h_('GE-tronco-semisuma-bases', k * h * (B + b) / 2, 'Promediaste las dos bases y multiplicaste por la altura, como en un prisma. El tronco se angosta de forma no lineal: V = h(B + b + √(Bb))/3.'),
      h_('GE20', k * h * (B + b + m), 'Olvidaste el factor 1/3: el tronco es una pirámide grande menos una chica, y cada una lleva 1/3.'),
      h_('GE-tronco-sin-media', k * h * (B + b) / 3, 'Te faltó el término √(Bb), la media geométrica de las bases.'),
      h_('GE-tronco-como-piramide', k * h * B / 3, 'Calculaste una pirámide con la base mayor y la altura del tronco. El tronco no tiene punta: tiene una base menor arriba.'),
    ];
  }

  // ---------- Tronco de pirámide: volumen ----------
  function troncoPiramide(rng) {
    const sub = rng.elegir(['cuadrada', 'bases-area', 'triangular-diedro']);
    const u = rng.elegir(['cm', 'm']), u3 = u + '³';
    const variables = { B: { nombre: 'base mayor', color: 'o' }, b: { nombre: 'base menor', color: 'i' }, h: { nombre: 'altura', color: 'h' }, V: { nombre: 'volumen', color: 'd' } };
    if (sub === 'cuadrada') {
      const L = rng.entero(4, 12), l = rng.entero(2, L - 1), h = rng.entero(2, 12);
      const B = L * L, b = l * l, V = calc.troncoPiramide(B, b, h);
      if (!esEntero(V)) return null;
      const errores = erroresTronco(B, b, h).concat([
        h_('GE-tronco-promedio-lados', h * ((L + l) / 2) ** 2, 'Usaste un prisma con el lado promedio (L + l)/2: el tronco no es un prisma.'),
      ]);
      const cosa = u === 'm' ? 'Un pedestal de piedra' : 'Una caja de regalo';
      const enunciado = [`${cosa} tiene forma de tronco de pirámide regular de bases cuadradas: la base mayor mide `, v('B', `${L} ${u}`), ' de lado, la menor ', v('b', `${l} ${u}`), ' de lado y la altura es ', v('h', `${h} ${u}`), '.'];
      const solucion = [
        ['Áreas de las bases: B = ', v('B', `${L}`), `² = ${B} y b = `, v('b', `${l}`), `² = ${b}; √(Bb) = ${L}·${l} = ${L * l}.`],
        ['V = h(B + b + √(Bb))/3 = ', v('h', `${h}`), `·(${B} + ${b} + ${L * l})/3 = `, v('V', tq(V, u3)), '.'],
      ];
      return { forma: 'q', unidad: u3, correcta: V, errores, variables, enunciado, pregunta: ['¿Cuál es su volumen?'], solucion, datos: { sub, L, l, h } };
    }
    if (sub === 'bases-area') {
      const m = rng.elegir([2, 3, 5, 6]), s = rng.entero(1, 3), t = rng.entero(s + 1, 5), h = rng.entero(2, 12);
      const b = m * s * s, B = m * t * t, V = calc.troncoPiramide(B, b, h);
      if (!esEntero(V)) return null;
      const errores = erroresTronco(B, b, h);
      errores[0] = h_('GE-tronco-media-aritmetica', h * (B + b) / 2, `Usaste la media aritmética (B + b)/2 = ${f((B + b) / 2)} donde va la media geométrica √(Bb) = ${m * s * t}. Con la aritmética, la fórmula se vuelve la de un prisma de base promedio, que no es el tronco.`);
      const enunciado = ['Un tronco de pirámide tiene bases paralelas y semejantes de áreas ', v('B', `${B} ${u}²`), ' y ', v('b', `${b} ${u}²`), ', y su altura es ', v('h', `${h} ${u}`), '.'];
      const solucion = [
        ['√(Bb) = √(', v('B', `${B}`), '·', v('b', `${b}`), `) = √${B * b} = ${m * s * t}.`],
        ['V = ', v('h', `${h}`), `·(${B} + ${b} + ${m * s * t})/3 = `, v('V', tq(V, u3)), '.'],
      ];
      return { forma: 'q', unidad: u3, correcta: V, errores, variables, enunciado, pregunta: ['¿Cuál es el volumen del tronco?'], solucion, datos: { sub, B, b, h } };
    }
    // triangular con diedro de 60°
    const l = rng.entero(1, 6), L = l + 2 * rng.entero(1, 4), h = (L - l) / 2;
    const B = calc.areaEquilatero(L), b = calc.areaEquilatero(l), V = calc.troncoPiramide(B, b, h);
    const S = L * L + l * l + L * l;
    const errores = erroresTronco(B, b, h).concat([
      h_('GE-diedro-circunradio', 2 * V, 'Mediste la diferencia de distancias del centro a los vértices (circunradios). El diedro se mide sobre la perpendicular a la arista de la base: va con los apotemas de las bases (los inradios).'),
    ]);
    variables.h = { nombre: 'diedro de 60°', color: 'h' };
    const enunciado = ['Un tronco de pirámide regular tiene por bases triángulos equiláteros de aristas ', v('B', `${L} ${u}`), ' y ', v('b', `${l} ${u}`), '. Cada cara lateral forma un ángulo diedro de ', v('h', '60°'), ' con la base mayor.'];
    const solucion = [
      ['Apotema (inradio) de un equilátero de lado x: x√3/6. Diferencia entre las dos bases: (', v('B', `${L}`), ' − ', v('b', `${l}`), `)√3/6 = ${t3((L - l) * R3 / 6)}.`],
      ['En el corte perpendicular a una arista: tg ', v('h', '60°'), ` = altura ÷ diferencia de apotemas → altura = √3·${t3((L - l) * R3 / 6)} = ${tq(h)} ${u}.`],
      [`Bases: ${t3(B)} y ${t3(b)}; √(Bb) = ${t3(L * l * R3 / 4)}. La suma es (√3/4)·${S}.`],
      [`V = ${tq(h)}·(√3/4)·${S}/3 = `, v('V', t3(V, u3)), '.'],
    ];
    return { forma: 'r3', unidad: u3, correcta: V, errores, variables, enunciado, pregunta: ['¿Cuál es el volumen del tronco?'], solucion, datos: { sub, L, l } };
  }

  // ---------- Pirámide menor por semejanza ----------
  const FRACS = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4]];
  function piramideMenor(rng) {
    const sub = rng.elegir(['corte', 'desde-menor']);
    const u3 = 'cm³';
    if (sub === 'corte') {
      const [p, q] = rng.elegir(FRACS), k = p / q, n = rng.entero(1, 4), V = q ** 3 * n * (q === 2 ? 3 : 1);
      const pide = rng.elegir(['menor', 'tronco']);
      const menor = calc.piramideMenor(V, k), tronco = V - menor;
      const correcta = pide === 'menor' ? menor : tronco;
      const variables = { V: { nombre: 'volumen de la pirámide', color: 'o' }, k: { nombre: 'razón de semejanza', color: 'i' }, X: { nombre: 'lo que se pide', color: 'd' } };
      const enunciado = ['Una pirámide de cartón tiene un volumen de ', v('V', `${V} ${u3}`), `. Se corta con un plano paralelo a la base que pasa a `, v('k', `${p}/${q} de la altura`), ', medida desde el vértice.'];
      const kk = `${p}/${q}`;
      const errores = pide === 'menor' ? [
        par('GE2', V * k, `Tomaste ${kk} del volumen: escalaste como si fuera una longitud. La pirámide de arriba es semejante con razón ${kk}, y su volumen va con k³.`),
        par('GE2', V * k * k, `Usaste k² (como para un área). Un volumen va con k³ = (${kk})³.`),
        h_('GE-menor-desde-base', V * (1 - k) ** 3, `Mediste la fracción desde la base. El enunciado la mide desde el vértice: la pirámide chica tiene altura ${kk} de la grande.`),
        h_('GE-menor-pide-otra', tronco, 'Ese es el volumen del tronco (la parte de abajo); se pide la pirámide de arriba.'),
      ] : [
        par('GE2', V * (1 - k), `Restaste ${kk} del volumen como si escalara en línea recta. La pirámide de arriba tiene (${kk})³ del volumen.`),
        par('GE2', V * (1 - k * k), `Usaste k² (como para un área). La pirámide de arriba tiene k³ = (${kk})³ del volumen.`),
        h_('GE-menor-desde-base', V * (1 - (1 - k) ** 3), 'Mediste la fracción desde la base y no desde el vértice.'),
        h_('GE-menor-pide-otra', menor, 'Ese es el volumen de la pirámide chica de arriba; se pide el tronco que queda abajo.'),
      ];
      const solucion = [
        ['La pirámide de arriba es semejante a la original con razón ', v('k', `k = ${kk}`), '.'],
        ['Los volúmenes van con k³: pirámide de arriba = (', v('k', kk), ')³·', v('V', `${V}`), ` = ${tq(menor)} ${u3}.`],
        pide === 'menor' ? ['Respuesta: ', v('X', tq(menor, u3)), '.'] : ['Tronco = ', `${V} − ${tq(menor)} = `, v('X', tq(tronco, u3)), '.'],
      ];
      return { forma: 'q', unidad: u3, correcta, errores, variables, enunciado, pregunta: [pide === 'menor' ? '¿Cuál es el volumen de la pirámide pequeña que queda arriba?' : '¿Cuál es el volumen del tronco que queda abajo?'], solucion, datos: { sub, V, p, q, pide } };
    }
    const [l, L] = rng.elegir([[2, 4], [3, 6], [2, 6], [4, 6], [6, 9], [3, 9], [4, 8], [6, 8]]);
    const k = L / l, vm = rng.entero(1, 6) * (Number.isInteger(k) ? 1 : (l / gcd(l, L)) ** 3);
    const correcta = vm * (k ** 3 - 1);
    const variables = { L: { nombre: 'arista de la base mayor', color: 'o' }, l: { nombre: 'arista de la base menor', color: 'i' }, v: { nombre: 'volumen de la pirámide menor', color: 'h' }, X: { nombre: 'volumen del tronco', color: 'd' } };
    const enunciado = ['Un tronco de pirámide triangular tiene bases semejantes: una arista de la base mayor mide ', v('L', `${L} cm`), ' y la arista correspondiente de la base menor ', v('l', `${l} cm`), '. Si se prolongan las aristas laterales hasta que se junten, se forma sobre la base menor una pirámide de ', v('v', `${vm} ${u3}`), '.'];
    const kk = textoQ(racional(k));
    const errores = [
      par('GE2', vm * (k - 1), `Escalaste el volumen con la razón lineal ${kk}. La pirámide grande es semejante a la chica, y su volumen es k³ veces el de la chica.`),
      par('GE2', vm * (k * k - 1), `Usaste k² (como para un área). Los volúmenes van con k³ = (${kk})³.`),
      h_('GE-menor-pide-total', vm * k ** 3, 'Ese es el volumen de la pirámide completa. El tronco es la pirámide completa menos la chica.'),
      h_('GE-menor-razon-diferencia', vm * ((L - l) / l) ** 3, `Usaste la razón (L − l)/l. La pirámide grande y la chica están en razón L/l = ${kk}.`),
    ];
    const solucion = [
      ['La pirámide completa (base mayor) y la chica (base menor) son semejantes con razón ', v('L', `${L}`), '/', v('l', `${l}`), ` = ${kk}.`],
      [`Pirámide completa: (${kk})³·`, v('v', `${vm}`), ` = ${tq(vm * k ** 3)} ${u3}.`],
      [`Tronco: ${tq(vm * k ** 3)} − ${vm} = `, v('X', tq(correcta, u3)), '.'],
    ];
    return { forma: 'q', unidad: u3, correcta, errores, variables, enunciado, pregunta: ['¿Cuál es el volumen del tronco?'], solucion, datos: { sub, L, l, vm } };
  }
  function gcd(a, b) { while (b) [a, b] = [b, a % b]; return a; }

  // ---------- Diedro y apotema del tronco ----------
  function troncoApotema(rng) {
    const sub = rng.elegir(['lateral', 'chimenea', 'hueco']);
    const u = rng.elegir(['cm', 'm']), u2 = u + '²';
    const variables = { L: { nombre: 'arista de la base mayor', color: 'o' }, l: { nombre: 'arista de la base menor', color: 'i' }, t: { nombre: 'diedro', color: 'h' }, X: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'lateral' || sub === 'chimenea') {
      const theta = rng.elegir([37, 53, 60]), k = rng.entero(1, 3);
      const [dif, ap, hh] = theta === 37 ? [4 * k, 5 * k, 3 * k] : theta === 53 ? [3 * k, 5 * k, 4 * k] : [k, 2 * k, k * R3];
      const l = rng.entero(2, 8), L = l + 2 * dif;
      const AL = calc.lateralTroncoCuadrado(L, l, ap);
      const H = rng.entero(2, 10), Ap = 4 * l * H;
      const total = sub === 'lateral' ? AL : AL + Ap;
      const enunciado = sub === 'lateral'
        ? ['Un tronco de pirámide regular tiene bases cuadradas de aristas ', v('L', `${L} ${u}`), ' y ', v('l', `${l} ${u}`), '. Cada cara lateral forma un ángulo diedro de ', v('t', `${theta}°`), ' con la base mayor.']
        : ['Una chimenea de lata, abierta arriba y abajo, tiene dos partes: abajo, un tronco de pirámide regular de bases cuadradas de aristas ', v('L', `${L} ${u}`), ' y ', v('l', `${l} ${u}`), ', cuyas caras laterales forman un diedro de ', v('t', `${theta}°`), ` con el piso; encima, un ducto con forma de prisma recto de base cuadrada de ${l} ${u} de lado y ${H} ${u} de altura.`];
      const extra = sub === 'lateral' ? 0 : Ap;
      const errores = [
        h_('GE21', calc.lateralTroncoCuadrado(L, l, hh) + extra, 'Usaste la altura del tronco como altura de cada trapecio. La altura de la cara lateral es el apotema del tronco, que está inclinado y es más largo.'),
        h_('GE-area-bases-que-no-tiene', total + L * L + l * l, sub === 'lateral' ? 'Sumaste las dos bases: se pide solo el área lateral.' : 'Sumaste los cuadrados de las bases: la chimenea está abierta, esas caras no existen.'),
        h_('GE-trapecio-sin-mitad', 2 * AL + extra, 'Calculaste cada trapecio como (B + b)·h sin dividir entre 2.'),
        h_('GE-tronco-apotema-base', calc.lateralTroncoCuadrado(L, l, dif) + extra, `Usaste la diferencia de apotemas de las bases (${dif}) como altura de la cara. Ese es el cateto horizontal; la altura de la cara es la hipotenusa.`),
      ];
      if (sub === 'chimenea') errores.push(h_('GE-chimenea-sin-prisma', AL, 'Calculaste solo el tronco: falta el ducto, 4·l·H.'));
      const cosT = theta === 60 ? '1/2' : `${COS[theta][0]}/${COS[theta][1]}`;
      const solucion = [
        ['Corte perpendicular a una arista de la base: la diferencia de apotemas de las bases es (', v('L', `${L}`), ' − ', v('l', `${l}`), `)/2 = ${dif}, y es el cateto adyacente al diedro.`],
        ['Apotema del tronco (altura de cada cara): ', `${dif} ÷ cos `, v('t', `${theta}°`), ` = ${dif} ÷ ${cosT} = ${ap} ${u}.`],
        ['Área lateral del tronco: 4 trapecios = 4·(', `${L} + ${l})/2·${ap} = ${f(AL)}.`],
        sub === 'lateral' ? ['Respuesta: ', v('X', tq(AL, u2)), '.'] : [`Ducto: 4·${l}·${H} = ${Ap}. Total: `, v('X', tq(total, u2)), '.'],
      ];
      return { forma: 'q', unidad: u2, correcta: total, errores, variables, enunciado, pregunta: [sub === 'lateral' ? '¿Cuál es el área lateral del tronco?' : '¿Cuánta lata se necesita?'], solucion, datos: sub === 'lateral' ? { sub, L, l, theta } : { sub, L, l, theta, H } };
    }
    // hueco cilíndrico
    const dato = rng.elegir(['bases', 'lateral']);
    const theta = rng.elegir([37, 53]);
    const k = rng.entero(1, 3);
    const [dif, ap, hh] = theta === 37 ? [4 * k, 5 * k, 3 * k] : [3 * k, 5 * k, 4 * k];
    const a = rng.entero(2, 5), A = a + dif, rho = rng.entero(1, a - 1);
    const V = calc.cilindro(rho, hh);
    const u3 = u + '³';
    const variables2 = dato === 'bases'
      ? { A: { nombre: 'apotemas de las bases', color: 'o' }, r: { nombre: 'radio del hueco', color: 'i' }, t: { nombre: 'diedro', color: 'h' }, X: { nombre: 'volumen del hueco', color: 'd' } }
      : { A: { nombre: 'apotema del tronco', color: 'o' }, r: { nombre: 'radio del hueco', color: 'i' }, t: { nombre: 'diedro', color: 'h' }, X: { nombre: 'volumen del hueco', color: 'd' } };
    const enunciado = dato === 'bases'
      ? ['Un bloque de concreto tiene forma de tronco de pirámide regular de bases cuadradas. El apotema de la base mayor (distancia del centro a un lado) mide ', v('A', `${A} ${u}`), ' y el de la base menor ', v('A', `${a} ${u}`), '; cada cara lateral forma un diedro de ', v('t', `${theta}°`), ' con la base mayor. A lo largo del eje se perfora, de base a base, un hueco cilíndrico de radio ', v('r', `${rho} ${u}`), '.']
      : ['Un bloque de concreto tiene forma de tronco de pirámide regular. El apotema del tronco (la altura de cada cara lateral) mide ', v('A', `${ap} ${u}`), ' y cada cara lateral forma un diedro de ', v('t', `${theta}°`), ' con la base mayor. A lo largo del eje se perfora, de base a base, un hueco cilíndrico de radio ', v('r', `${rho} ${u}`), '.'];
    const errores = [
      h_('GE21', calc.cilindro(rho, ap), 'Usaste el apotema del tronco como largo del hueco. El hueco va a lo largo de la altura, que es vertical y más corta.'),
      h_('GE-tronco-apotema-base', calc.cilindro(rho, dif), 'Usaste la diferencia de apotemas de las bases como altura. Ese es el cateto horizontal del triángulo del diedro.'),
      h_('GE20', V / 3, 'Pusiste un 1/3: el hueco es un cilindro, no un cono.'),
      h_('GE19', 2 * PI * rho * hh, 'Calculaste la pared del hueco (2πrh), no su volumen (πr²h).'),
    ];
    if (dato === 'lateral') errores.push(h_('GE-seno-coseno', calc.cilindro(rho, dif), `Multiplicaste el apotema por cos ${theta}° en vez de sen ${theta}°: así sale el cateto horizontal, no la altura.`));
    const tg = theta === 37 ? '3/4' : '4/3';
    const sn = theta === 37 ? '3/5' : '4/5';
    const solucion = dato === 'bases' ? [
      ['Corte perpendicular a una arista: el cateto horizontal es la diferencia de apotemas, ', v('A', `${A}`), ' − ', v('A', `${a}`), ` = ${dif}.`],
      ['Altura del tronco: ', `${dif}·tg `, v('t', `${theta}°`), ` = ${dif}·${tg} = ${hh} ${u}.`],
      ['Hueco: π·', v('r', `${rho}`), `²·${hh} = `, v('X', tpi(V, u3)), '.'],
    ] : [
      ['El apotema del tronco es la hipotenusa del triángulo del diedro; la altura es el cateto opuesto al ángulo.'],
      ['Altura: ', v('A', `${ap}`), '·sen ', v('t', `${theta}°`), ` = ${ap}·${sn} = ${hh} ${u}.`],
      ['Hueco: π·', v('r', `${rho}`), `²·${hh} = `, v('X', tpi(V, u3)), '.'],
    ];
    return { forma: 'pi', unidad: u3, correcta: V, errores, variables: variables2, enunciado, pregunta: ['¿Cuál es el volumen del hueco?'], solucion, datos: dato === 'bases' ? { sub, dato, A, a, theta, rho } : { sub, dato, ap, theta, rho } };
  }

  // ---------- Prisma oblicuo ----------
  function prismaOblicuo(rng) {
    const sub = rng.elegir(['base-desde-recta', 'cara-distancia', 'volumen-arista']);
    const u = rng.elegir(['cm', 'm']), u2 = u + '²', u3 = u + '³';
    if (sub === 'base-desde-recta') {
      const theta = rng.elegir([37, 53, 30]), s = fr(SEN[theta]);
      const a = rng.entero(1, 6), Sr = calc.areaHexagono(a), A = calc.baseDesdeRecta(Sr, s);
      if (!FORMAS.r3('')(A)) return null;
      const variables = { a: { nombre: 'lado del hexágono de la sección recta', color: 'o' }, t: { nombre: 'inclinación de las aristas', color: 'h' }, S: { nombre: 'sección recta', color: 'i' }, X: { nombre: 'área de la base', color: 'd' } };
      const enunciado = ['En un prisma hexagonal oblicuo, la sección recta (el corte perpendicular a las aristas laterales) es un hexágono regular de ', v('a', `${a} ${u}`), ' de lado. Las aristas laterales forman un ángulo de ', v('t', `${theta}°`), ' con el plano de la base.'];
      const errores = [
        h_('GE-oblicuo-multiplica', Sr * s, 'Multiplicaste por el seno. La base es más grande que la sección recta (la sección recta es su proyección), así que hay que dividir.'),
        theta === 30 ? null : h_('GE-seno-coseno', Sr / fr(COS[theta]), `Dividiste entre cos ${theta}°. El ángulo entre el plano de la base y el de la sección recta es el complemento de ${theta}°: va el seno.`),
        h_('GE-oblicuo-base-igual-recta', Sr, 'Tomaste la base igual a la sección recta. Solo pasa en el prisma recto.'),
        h_('GE-hexagono-area', 2 * A, 'El área del hexágono regular es 6·(lado²·√3/4) = 3√3·a²/2; usaste el doble.'),
      ].filter(Boolean);
      const solucion = [
        ['Sección recta: 6 equiláteros de lado ', v('a', `${a}`), `: `, v('S', `6·${a * a}√3/4 = ${t3(Sr)}`), '.'],
        ['La sección recta es la proyección de la base sobre un plano perpendicular a las aristas; los dos planos forman 90° − ', v('t', `${theta}°`), '.'],
        ['S = base·cos(90° − θ) = base·sen θ → base = ', v('S', t3(Sr)), ` ÷ ${SEN[theta][0]}/${SEN[theta][1]} = `, v('X', t3(A, u2)), '.'],
      ];
      return { forma: 'r3', unidad: u2, correcta: A, errores, variables, enunciado, pregunta: ['¿Cuál es el área de la base del prisma?'], solucion, datos: { sub, a, theta } };
    }
    if (sub === 'cara-distancia') {
      const S = rng.entero(4, 30), d = rng.entero(2, 10);
      const V = calc.prismaCaraDistancia(S, d);
      const variables = { S: { nombre: 'área de la cara', color: 'o' }, d: { nombre: 'distancia a la arista opuesta', color: 'i' }, X: { nombre: 'volumen', color: 'd' } };
      const enunciado = ['En un prisma triangular oblicuo, una de las caras laterales tiene ', v('S', `${S} ${u2}`), ' de área, y la arista lateral opuesta a esa cara está a ', v('d', `${d} ${u}`), ' de ella.'];
      const errores = [
        h_('GE-prisma-cara-sin-mitad', S * d, 'Multiplicaste el área de la cara por la distancia: eso da un prisma de sección recta paralelogramo, el doble del triangular.'),
        h_('GE20', S * d / 3, 'Pusiste 1/3 como en una pirámide. El prisma triangular es la mitad de un prisma con sección de paralelogramo: va 1/2.'),
        h_('GE-prisma-como-piramide-triangular', S * d / 6, 'Usaste 1/3·1/2, como si fuera una pirámide de base triangular. Es un prisma: solo va 1/2.'),
      ];
      const solucion = [
        ['Corta con un plano perpendicular a las aristas: la sección recta es un triángulo; el lado que está en la cara mide c y su altura es ', v('d', `${d}`), '.'],
        ['Volumen = sección recta·arista = (c·d/2)·arista = (c·arista)·d/2, y c·arista es el área de la cara.'],
        ['V = ', v('S', `${S}`), '·', v('d', `${d}`), '/2 = ', v('X', tq(V, u3)), '.'],
      ];
      return { forma: 'q', unidad: u3, correcta: V, errores, variables, enunciado, pregunta: ['¿Cuál es el volumen del prisma?'], solucion, datos: { sub, S, d } };
    }
    const theta = rng.elegir([37, 53, 30]), s = fr(SEN[theta]);
    const B = rng.entero(2, 20), La = SEN[theta][1] * rng.entero(1, 4);
    const V = B * La * s;
    const variables = { B: { nombre: 'área de la base', color: 'o' }, La: { nombre: 'arista lateral', color: 'i' }, t: { nombre: 'inclinación', color: 'h' }, X: { nombre: 'volumen', color: 'd' } };
    const enunciado = ['Un prisma oblicuo tiene una base de ', v('B', `${B} ${u2}`), '. Sus aristas laterales miden ', v('La', `${La} ${u}`), ' y forman ', v('t', `${theta}°`), ' con el plano de la base.'];
    const errores = [
      h_('GE-oblicuo-arista-como-altura', B * La, 'Usaste la arista lateral como altura. En el prisma oblicuo la arista está inclinada; la altura es la distancia entre las bases.'),
      theta === 30 ? null : h_('GE-seno-coseno', B * La * fr(COS[theta]), `Usaste cos ${theta}°: así sale la sombra horizontal de la arista, no la altura.`),
      h_('GE20', V / 3, 'Pusiste 1/3: es un prisma, no una pirámide.'),
      h_('GE-oblicuo-divide', B * La / s, 'Dividiste entre el seno: la altura es más corta que la arista, hay que multiplicar.'),
    ].filter(Boolean);
    const solucion = [
      ['La altura es el cateto opuesto al ángulo en el triángulo que forma la arista con su sombra en la base.'],
      ['h = ', v('La', `${La}`), '·sen ', v('t', `${theta}°`), ` = ${La}·${SEN[theta][0]}/${SEN[theta][1]} = ${tq(La * s)} ${u}.`],
      ['V = base·altura = ', v('B', `${B}`), `·${tq(La * s)} = `, v('X', tq(V, u3)), '.'],
    ];
    return { forma: 'q', unidad: u3, correcta: V, errores, variables, enunciado, pregunta: ['¿Cuál es el volumen del prisma?'], solucion, datos: { sub, B, La, theta } };
  }

  // ---------- Tronco de prisma triangular ----------
  function troncoPrisma(rng) {
    const sub = rng.elegir(['volumen', 'volumen', 'lateral']);
    const u = 'cm';
    const tres = () => { for (;;) { const a = rng.entero(2, 15), b = rng.entero(2, 15), c = rng.entero(2, 15); if (a !== b && b !== c && a !== c) return [a, b, c]; } };
    const [a, b, c] = tres();
    const mx = Math.max(a, b, c), mn = Math.min(a, b, c);
    const variables = { base: { nombre: 'base', color: 'o' }, ar: { nombre: 'aristas laterales', color: 'i' }, X: { nombre: 'lo que se pide', color: 'd' } };
    if (sub === 'volumen') {
      const p = rng.entero(2, 8), q = rng.entero(2, 8), A = p * q / 2;
      const V = calc.troncoPrisma(A, a, b, c);
      const enunciado = ['Un bloque de madera tiene forma de tronco de prisma triangular recto: su base es un triángulo rectángulo de catetos ', v('base', `${p} ${u} y ${q} ${u}`), ', sus tres aristas laterales son perpendiculares a la base y miden ', v('ar', `${a} ${u}, ${b} ${u} y ${c} ${u}`), ', y la cara de arriba es oblicua.'];
      const errores = [
        h_('GE-tronco-prisma-semisuma', A * (a + b + c) / 2, 'Dividiste la suma de las aristas entre 2, como en el tronco de cilindro. Con tres aristas, la altura media es su promedio: (a + b + c)/3.'),
        h_('GE-tronco-prisma-arista-mayor', A * mx, `Usaste la arista mayor (${mx}) como altura: cuentas un prisma completo que sobresale del bloque.`),
        h_('GE-tronco-prisma-sin-promedio', A * (a + b + c), 'Multiplicaste la base por la suma de las aristas sin dividir entre 3.'),
        h_('GE-tronco-prisma-dos-aristas', A * (mx + mn) / 2, 'Promediaste solo la mayor y la menor. Las tres aristas cuentan: (a + b + c)/3.'),
      ];
      const solucion = [
        ['Área de la base: ', v('base', `${p}·${q}/2`), ` = ${f(A)} ${u}².`],
        ['En el tronco de prisma triangular, la altura media es el promedio de las tres aristas laterales: (', v('ar', `${a} + ${b} + ${c}`), `)/3 = ${tq((a + b + c) / 3)}.`],
        [`V = ${f(A)}·${tq((a + b + c) / 3)} = `, v('X', tq(V, 'cm³')), '.'],
      ];
      return { forma: 'q', unidad: 'cm³', correcta: V, errores, variables, enunciado, pregunta: ['¿Cuál es el volumen del bloque?'], solucion, datos: { sub, p, q, a, b, c } };
    }
    const s = rng.entero(2, 10);
    const AL = calc.lateralTroncoPrisma(s, a, b, c);
    const enunciado = ['Un tronco de prisma triangular recto tiene por base un triángulo equilátero de ', v('base', `${s} ${u}`), ' de lado; sus aristas laterales, perpendiculares a la base, miden ', v('ar', `${a} ${u}, ${b} ${u} y ${c} ${u}`), '.'];
    const errores = [
      h_('GE-tronco-prisma-arista-mayor', 3 * s * mx, `Tomaste las tres caras como rectángulos de altura ${mx}: cada cara es un trapecio con las dos aristas que la limitan.`),
      h_('GE-tronco-prisma-cada-arista-una-vez', AL / 2, 'Contaste cada arista en una sola cara. Cada arista lateral es lado de dos caras.'),
      h_('GE-trapecio-sin-mitad', 2 * AL, 'Calculaste cada trapecio como (B + b)·h sin dividir entre 2.'),
      h_('GE-tronco-prisma-arista-menor', 3 * s * mn, `Tomaste las tres caras como rectángulos de altura ${mn}: dejas fuera la parte de arriba de cada trapecio.`),
    ];
    const solucion = [
      ['Cada cara lateral es un trapecio rectángulo de altura ', v('base', `${s}`), ' y lados paralelos iguales a dos de las aristas.'],
      [`Caras: ${s}·(${a} + ${b})/2 + ${s}·(${b} + ${c})/2 + ${s}·(${c} + ${a})/2.`],
      ['Cada arista aparece dos veces: AL = ', v('base', `${s}`), '·(', v('ar', `${a} + ${b} + ${c}`), ') = ', v('X', tq(AL, 'cm²')), '.'],
    ];
    return { forma: 'q', unidad: 'cm²', correcta: AL, errores, variables, enunciado, pregunta: ['¿Cuál es su área lateral?'], solucion, datos: { sub, s, a, b, c } };
  }

  const HACER = { 'tronco-piramide': troncoPiramide, 'piramide-menor': piramideMenor, 'tronco-apotema': troncoApotema, 'prisma-oblicuo': prismaOblicuo, 'tronco-prisma': troncoPrisma };

  return { id: 'geo-troncos-prismas', titulo: 'Troncos de pirámide, prismas oblicuos y troncos de prisma', generar, calc, TIPOS };
});
