/*
 * Generador: relaciones métricas en triángulos y cuadriláteros (geometria.relaciones-metricas).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['geo-relaciones-metricas']) y en Node (require). No usa ningún motor.
 *
 * Tipos y campos de _datos (todas las longitudes en la misma unidad, u = 'm' o 'cm'):
 *   altura-hipotenusa  Triángulo ABC recto en B, H = pie de la altura desde B sobre la hipotenusa AC.
 *       sub 'h':        dados AH = m y HC = n, se pide BH.                        { m, n }
 *       sub 'cateto':   dados AH = m y HC = n, se pide el cateto AB.              { m, n }
 *       sub 'h-catetos': dados los catetos AB = a y BC = b, se pide BH (pide 'BH')
 *                       o la proyección AH de AB sobre la hipotenusa (pide 'AH'). { a, b, pide }
 *       sub 'tangente': AB diámetro de una circunferencia de centro O; las tangentes en A y en B son
 *                       paralelas; una tercera tangente toca en T y corta a esas dos en P y Q (del
 *                       mismo lado de AB), con PA = m y QB = n. pide 'r' (radio) o 'AB' (diámetro).
 *                       (∠POQ = 90° y OT es la altura relativa a la hipotenusa PQ.) { m, n, pide }
 *   semicircunferencia  Semicircunferencia de diámetro AB = d; C en el arco; H = pie de la
 *                       perpendicular desde C a AB; AH = m.
 *       sub 'cuerda':   se pide la cuerda AC.                                     { d, m }
 *       sub 'area':     se pide el área del triángulo ACB (en u²).                { d, m }
 *   euclides           Triángulo ABC con AB = c, AC = b; obtuso dice si el ángulo BAC es obtuso
 *                      (true) o agudo (false); m = proyección de AC sobre la recta AB.
 *       sub 'lado':     dados b, c, m y el tipo de ángulo, se pide BC.            { b, c, m, obtuso }
 *       sub 'proyeccion': dados los tres lados BC = a, AC = b, AB = c (el alumno decide si A es
 *                       agudo u obtuso), se pide la proyección de AC sobre la recta AB. { a, b, c }
 *       sub 'corona':   corona circular de centro O y radios r (interior) y R (exterior); A en la
 *                       circunferencia interior, B en la exterior; H = pie de la perpendicular desde
 *                       O a la recta AB, que cae en la prolongación de BA más allá de A, con AH = m
 *                       (ángulo OAB obtuso). Se pide AB.                          { R, r, m }
 *   mediana            Triángulo ABC con BC = a, AC = b, AB = c; M = punto medio de BC.
 *       sub 'mediana':  dados a, b, c, se pide AM.                                 { a, b, c }
 *       sub 'lado':     dados b, c y AM = ma2 (se guarda AM², ma2), se pide BC.    { b, c, ma2 }
 *   marlen             Rectángulo ABCD (vértices en ese orden) y un punto P interior. Se dan las
 *                      distancias de P a tres vértices y se pide la distancia al cuarto (falta).
 *                      dist guarda los cuadrados conocidos {A: PA², B: PB², ...} sin el que falta.
 *                      (Las tres distancias dadas son enteras; siempre existe un rectángulo y un
 *                      punto interior con esas distancias si el cuadrado que falta sale positivo.)
 *                      { falta, dist }
 *   diferencia-cuadrados  Triángulo ABC del que se dan AB² = ab2, AC² = ac2 y BC = bc; se pide el
 *                      ángulo ABC (notables de academia 37°, 45°, 53°, 127°, 135°, 143°;
 *                      cos 37° = 4/5). { ab2, ac2, bc }
 *   heron              Triángulo de lados a = BC, b = AC, c = AB (enteros).
 *       sub 'area':     se pide el área (u²).                                     { a, b, c }
 *       sub 'altura':   se pide la altura relativa a BC.                          { a, b, c }
 *   ptolomeo
 *       sub 'trapecio': trapecio isósceles ABCD con bases AD = B y BC = b y lados AB = CD = l;
 *                       se pide la diagonal AC.                                   { B, b, l }
 *       sub 'heptagono': heptágono regular ABCDEFG con 1/AC + 1/AD = 1/k (longitudes en u);
 *                       se pide el perímetro.                                     { k }
 *   trapecio-perpendiculares  Trapecio ABCD (BC ∥ AD) con diagonales AC = d1 y BD perpendiculares.
 *       sub 'altura':   dados d1 y BD = d2, se pide la altura.                    { d1, d2 }
 *       sub 'area':     dados AD + BC = suma (con AD = B y BC = b) y d1, se pide el área (u²).
 *                                                                                 { B, b, d1 }
 *   figuras-compuestas
 *       sub 'cometa':   cometa ABCD con AC bisectriz del ángulo BAD y ángulos rectos en B y en D;
 *                       AB = a; M = punto medio de AC y BM = bm. pide 'perimetro' o 'BC'. { a, bm, pide }
 *       sub 'isosceles-bisectriz': triángulo ABC recto en B, AB = a, BC = b; H = pie de la altura
 *                       desde B sobre AC; D en HC con BD bisectriz del ángulo HBC. pide 'HD' o 'BD'.
 *                                                                                 { a, b, pide }
 *       sub 'equilatero': cuadrilátero ABCD con AB = AD = s, ∠BAD = 60°, ∠ADC = 150° y ∠BCD = 30°;
 *                       se pide AC.                                               { s }
 *
 * Respuestas: enteros o a√b. Las alternativas se escriben igual que la correcta (filtro limpio).
 * Errores: GE7, GE8 y GE11 (parcial) y GE18 (hipótesis) de docs/investigacion/geometria-ideas-erroneas.md;
 * los RM-* son hipótesis nuestras.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'geo-relaciones-metricas';
  const GE = 'docs/investigacion/geometria-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const pa = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: GE });
  const v = P.v, R = P.radical, f = x => P.formatear(x, 2);
  const sq = Math.sqrt;
  const esCuadrado = n => Number.isInteger(n) && n > 0 && Math.round(sq(n)) ** 2 === n;
  // Solo entran valores que se escriben como entero o a√b (sin coma ni /2).
  const limpio = x => {
    if (!Number.isFinite(x) || x <= 1e-9 || x >= 1e5) return false;
    const t = R(x), r = t.match(/√(\d+)/);
    return !/[,/]/.test(t) && (!r || Number(r[1]) < 1000);
  };
  // "√52 = 2√13"; si es exacta, "√169 = 13"; si no se simplifica, "√97".
  const igualRaiz = n2 => { const t = R(sq(n2)); return t === `√${n2}` ? t : `√${n2} = ${t}`; };

  // Cosenos de academia → ángulo notable (cos 37° = 4/5, cos 53° = 3/5).
  const NOTABLES = [[37, 0.8], [53, 0.6], [45, Math.SQRT1_2], [30, sq(3) / 2], [60, 0.5], [90, 0]];
  function notable(c) {
    for (const [t, co] of NOTABLES) {
      if (Math.abs(c - co) < 1e-9) return t;
      if (Math.abs(c + co) < 1e-9) return 180 - t;
    }
    return NaN;
  }

  // ---------- Cálculos puros (los usa papel.json) ----------
  const calc = {
    alturaHipotenusa: (m, n) => sq(m * n),
    catetoProyeccion: (m, n) => sq(m * (m + n)),
    alturaDesdeCatetos: (a, b) => a * b / Math.hypot(a, b),
    proyeccionDesdeCatetos: (a, b) => a * a / Math.hypot(a, b),
    cuerdaSemicircunferencia: (d, m) => sq(d * m),
    areaSemicircunferencia: (d, m) => d * sq(m * (d - m)) / 2,
    euclidesLado: (b, c, m, obtuso) => sq(b * b + c * c + (obtuso ? 2 : -2) * c * m),
    euclidesProyeccion: (a, b, c) => Math.abs(a * a - b * b - c * c) / (2 * c),
    mediana: (a, b, c) => sq((2 * b * b + 2 * c * c - a * a) / 4),
    ladoDesdeMediana: (b, c, ma2) => sq(2 * b * b + 2 * c * c - 4 * ma2),
    marlen: (pa2, pb2, pc2) => sq(pa2 + pc2 - pb2), // PD con PA², PB², PC²
    anguloDiferenciaCuadrados: (ab2, ac2, bc) => notable((bc * bc + ab2 - ac2) / (2 * bc) / sq(ab2)),
    heron: (a, b, c) => { const s = (a + b + c) / 2; return sq(s * (s - a) * (s - b) * (s - c)); },
    alturaHeron: (a, b, c) => 2 * calc.heron(a, b, c) / a,
    diagonalTrapecioIsosceles: (B, b, l) => sq(l * l + B * b),
    perimetroHeptagono: k => 7 * k,
    alturaTrapecioPerpendiculares: (d1, d2) => d1 * d2 / Math.hypot(d1, d2),
    areaTrapecioPerpendiculares: (suma, d1) => d1 * sq(suma * suma - d1 * d1) / 2,
    radioTangentesParalelas: (m, n) => sq(m * n),
    plataformaCorona: (R, r, m) => sq(m * m + R * R - r * r) - m,
    perimetroCometa: (a, bm) => 2 * (a + sq(4 * bm * bm - a * a)),
    tramoBisectriz: (a, b) => a - a * a / Math.hypot(a, b),          // HD
    diagonalEquilatero: s => s * sq(7),
  };

  // ---------- Tablas precalculadas ----------
  const EUCLIDES_ENTEROS = []; // b, c, m, obtuso con BC entero
  for (let b = 3; b <= 20; b++) for (let c = 3; c <= 20; c++) for (let m = 1; m < b; m++) for (const ob of [true, false]) {
    if (!ob && m >= c) continue;
    const a2 = b * b + c * c + (ob ? 2 : -2) * c * m;
    if (esCuadrado(a2) && sq(a2) <= 30 && b !== c) EUCLIDES_ENTEROS.push({ a: sq(a2), b, c, m, obtuso: ob });
  }
  const MEDIANAS = []; // a, b, c, ma²
  for (let a = 4; a <= 20; a += 2) for (let b = 3; b <= 18; b++) for (let c = b + 1; c <= 18; c++) {
    if (a >= b + c || b >= a + c || c >= a + b) continue;
    const n = 2 * b * b + 2 * c * c - a * a;
    if (n % 4) continue;
    const ma2 = n / 4;
    if (!limpio(sq(ma2)) || ma2 > 400) continue;
    MEDIANAS.push({ a, b, c, ma2 });
  }
  const HERON = [[13, 14, 15], [5, 5, 6], [5, 5, 8], [10, 13, 13], [9, 10, 17], [7, 15, 20], [11, 13, 20],
    [13, 20, 21], [10, 17, 21], [13, 13, 24], [12, 17, 25], [17, 25, 28], [15, 15, 24], [20, 37, 51], [25, 29, 36]];
  const SEMI_AREA = [];
  for (let d = 5; d <= 30; d++) for (let m = 1; m < d / 2; m++) {
    const ch2 = m * (d - m);
    if (esCuadrado(ch2) && Number.isInteger(d * sq(ch2) / 2)) SEMI_AREA.push({ d, m });
  }

  // Catetos (a, b) e hipotenusa c con a·b/c y a²/c enteros: ternas primitivas escaladas por su hipotenusa.
  const ESCALADAS = [[15, 20, 25], [30, 40, 50], [45, 60, 75], [65, 156, 169], [136, 255, 289]];
  const OPUESTO = { A: 'C', B: 'D', C: 'A', D: 'B' };
  const VECINOS = { A: ['B', 'D'], B: ['A', 'C'], C: ['B', 'D'], D: ['A', 'C'] };

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 200; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  const TIPOS = ['altura-hipotenusa', 'semicircunferencia', 'euclides', 'mediana', 'marlen',
    'diferencia-cuadrados', 'heron', 'ptolomeo', 'trapecio-perpendiculares', 'figuras-compuestas'];

  function construir(rng, semilla, tipo) {
    const u = rng.elegir(['m', 'cm']);
    const r = CONSTRUCTORES[tipo](rng, u);
    if (!r || !(r.angular ? r.correcta > 0 : limpio(r.correcta))) return null;
    const forma = r.angular ? (x => Number.isInteger(x) && x > 0 && x < 180) : limpio;
    const errores = r.errores.filter(e => forma(e.valor));
    const texto = r.angular ? (x => `${x}°`) : (x => `${R(x)} ${r.unidad}`);
    const alternativas = P.armar({ correcta: r.correcta, errores, rng, texto });
    return {
      id: `${ID}#${semilla}`, variables: r.variables, enunciado: r.enunciado, pregunta: r.pregunta, datos: '',
      alternativas, solucion: r.solucion,
      respuesta: { valor: r.correcta, unidad: r.angular ? '°' : r.unidad },
      _datos: { tipo, ...r.datos },
    };
  }

  const L = (x, u) => `${R(x)} ${u}`;

  const CONSTRUCTORES = {
    'altura-hipotenusa'(rng, u) {
      const sub = rng.elegir(['h', 'cateto', 'h-catetos', 'tangente']);
      if (sub === 'tangente') {
        let m, n;
        for (;;) { m = rng.entero(1, 16); n = rng.entero(1, 25); if (m !== n && m * n <= 400) break; }
        const pide = rng.elegir(['r', 'AB']), mn = m * n, k = pide === 'r' ? 1 : 2;
        const variables = { m: { nombre: 'PA', color: 'o' }, n: { nombre: 'QB', color: 'i' }, r: { nombre: 'radio', color: 'h' }, x: { nombre: pide === 'r' ? 'radio' : 'diámetro AB', color: 'd' } };
        if (pide === 'r') delete variables.r;
        const ctx = rng.moneda();
        if (ctx) u = 'cm';
        return {
          variables, unidad: u, correcta: k * sq(mn), datos: { sub, m, n, pide },
          enunciado: ctx
            ? ['Un vidrio redondo de centro O está entre dos marcos paralelos que lo tocan en A y en B, los extremos de un diámetro. Una varilla recta toca el vidrio en un solo punto T y se apoya en los marcos en P (del lado de A) y en Q (del lado de B), los dos del mismo lado de AB, con PA = ', v('m', L(m, u)), ' y QB = ', v('n', L(n, u)), '.']
            : ['AB es un diámetro de una circunferencia de centro O; las rectas tangentes en A y en B son paralelas. Una tercera recta tangente toca la circunferencia en T y corta a las dos anteriores en P y en Q (del mismo lado de AB), con PA = ', v('m', L(m, u)), ' y QB = ', v('n', L(n, u)), '.'],
          pregunta: [pide === 'r' ? (ctx ? '¿Cuánto mide el radio del vidrio?' : '¿Cuánto mide el radio?') : '¿Cuánto mide el diámetro AB?'],
          errores: [
            h('RM-tangente-da-PQ', m + n, `Esa es la longitud PQ = PT + TQ (la hipotenusa del triángulo POQ), no ${pide === 'r' ? 'el radio' : 'el diámetro'}.`),
            h('GE18-altura-promedio', k * (m + n) / 2, `Tomaste el radio como el promedio de PT y TQ. El radio OT es la altura del triángulo rectángulo POQ: su cuadrado es el producto PT·TQ, no un promedio.`),
            h('GE19-diametro-por-radio', pide === 'r' ? 2 * sq(mn) : sq(mn), pide === 'r' ? `Ese es el diámetro AB; el radio es la mitad.` : `Ese es el radio OT; el diámetro AB es el doble.`),
            h('RM-diferencia-proyecciones', k * Math.abs(n - m), `Restaste QB − PA. El radio no sale de una resta: OT es la altura del triángulo rectángulo POQ, con OT² = PT·TQ.`),
            h('RM-sin-raiz', mn, `Te quedaste con r² = ${mn}: falta sacar la raíz cuadrada${pide === 'AB' ? ' (y luego duplicar)' : ''}.`),
            pa('GE11-pitagoras-proyecciones', k * sq(m * m + n * n), `Aplicaste Pitágoras con PT y TQ, que están sobre la misma recta PQ: no forman un ángulo recto entre sí.`),
          ],
          solucion: [
            ['Tangentes iguales desde P y desde Q: PT = PA = ', v('m', `${m}`), ' y QT = QB = ', v('n', `${n}`), '.'],
            ['OP es bisectriz del ángulo APT y OQ es bisectriz del ángulo BQT. Esos dos ángulos suman 180° (las tangentes en A y B son paralelas), así que sus mitades suman 90°: el ángulo POQ es recto.'],
            ['OT ⊥ PQ es la altura del triángulo rectángulo POQ relativa a la hipotenusa: OT² = PT·TQ = ', `${m}·${n} = ${mn}.`],
            pide === 'r'
              ? ['r = OT = ', v('x', `${igualRaiz(mn)} ${u}`), '.']
              : ['r = ', v('r', `${R(sq(mn))}`), ' y AB = 2r = ', v('x', L(2 * sq(mn), u)), '.'],
          ],
        };
      }
      if (sub === 'h-catetos') {
        let [a, b] = rng.elegir(ESCALADAS);
        if (rng.moneda()) [a, b] = [b, a];
        const c = Math.hypot(a, b);
        const pide = rng.elegir(['BH', 'AH']);
        const variables = { a: { nombre: 'cateto AB', color: 'o' }, b: { nombre: 'cateto BC', color: 'i' },
          c: { nombre: 'hipotenusa AC', color: 'h' }, x: { nombre: pide === 'BH' ? 'altura BH' : 'proyección AH', color: 'd' } };
        const ctx = rng.moneda();
        const enunciado = ctx
          ? ['Una escuadra de madera tiene forma de triángulo ABC, con el ángulo recto en B y los bordes rectos AB = ', v('a', L(a, u)), ' y BC = ', v('b', L(b, u)),
             '. Desde B se pega un listón BH perpendicular al borde largo AC, con H sobre AC.']
          : ['En el triángulo ABC, recto en B, los catetos miden AB = ', v('a', L(a, u)), ' y BC = ', v('b', L(b, u)),
             '. Se traza la altura BH relativa a la hipotenusa (H está en AC).'];
        let correcta, errores, ultimo;
        if (pide === 'BH') {
          correcta = a * b / c;
          errores = [
            pa('GE8-mediana-por-altura', c / 2, `Tomaste la mitad de la hipotenusa: eso mide la mediana, que va al punto medio de AC. La altura cae perpendicular a AC y es más corta, salvo en el triángulo isósceles.`),
            h('RM-altura-semiproducto', a * b / 2, `Calculaste AB·BC/2: ese es el área del triángulo, no la altura. Falta usar AB·BC = AC·BH y dividir entre la hipotenusa.`),
            h('RM-altura-raiz-catetos', sq(a * b), `Usaste BH² = AB·BC. La altura al cuadrado es el producto de las proyecciones AH·HC, no el de los catetos.`),
            h('RM-altura-promedio-catetos', (a + b) / 2, `Promediaste los catetos. La altura sale de AB·BC = AC·BH, que no es un promedio.`),
            h('RM-altura-cateto-por-hipotenusa', a * b / (a + b), `Dividiste AB·BC entre AB + BC. En AB·BC = AC·BH el divisor es la hipotenusa AC, que sale con Pitágoras.`),
          ];
          ultimo = [['AB·BC = AC·BH (las dos formas de calcular el doble del área): ', `${a}·${b} = ${c}·BH, y BH = `, v('x', L(correcta, u)), '.']];
        } else {
          correcta = a * a / c;
          errores = [
            pa('GE8-pie-en-punto-medio', c / 2, `Supusiste que H es el punto medio de AC. Eso solo pasa si los catetos son iguales; aquí AB y BC son distintos.`),
            h('RM-proyeccion-por-altura', a * b / c, `Calculaste la altura BH, no la proyección AH.`),
            h('RM-proyeccion-cruzada', b * b / c, `Usaste BC² = AC·HC: esa es la proyección HC del otro cateto. Para AH va el cateto que toca a A: AB² = AC·AH.`),
            h('RM-proyeccion-diferencia', (b * b - a * a) / c, `Restaste las dos proyecciones (HC − AH). AH sale de AB² = AC·AH.`),
            h('RM-proyeccion-resta', c - a, `Restaste AC − AB. AB es inclinado respecto de AC; su proyección sale de AB² = AC·AH.`),
          ];
          ultimo = [['AB² = AC·AH: ', `${a}² = ${c}·AH, y AH = ${a * a}/${c} = `, v('x', L(correcta, u)), '.']];
        }
        return {
          variables, enunciado, correcta, errores, unidad: u, datos: { sub, a, b, pide },
          pregunta: [pide === 'BH' ? (ctx ? '¿Cuánto mide el listón BH?' : '¿Cuánto mide la altura BH?') : '¿Cuánto mide AH, la proyección del cateto AB sobre la hipotenusa?'],
          solucion: [
            ['Pitágoras: AC² = ', v('a', `${a}`), '² + ', v('b', `${b}`), `² = ${c * c}, así que AC = `, v('c', L(c, u)), '.'],
            ...ultimo,
          ],
        };
      }
      // sub h o cateto: proyecciones m y n
      let m, n;
      for (;;) {
        m = rng.entero(1, 12); n = rng.entero(2, 25);
        if (m === n || m * n > 300) continue;
        if (sub === 'h' && (m + n) % 2) continue;
        break;
      }
      const variables = { m: { nombre: 'proyección AH', color: 'o' }, n: { nombre: 'proyección HC', color: 'i' },
        x: { nombre: sub === 'h' ? 'altura BH' : 'cateto AB', color: 'd' } };
      const ctx = rng.elegir(['puro', 'terreno', 'techo']);
      const enunciado = ctx === 'terreno'
        ? ['Un terreno tiene forma de triángulo ABC, con la esquina B en ángulo recto. Desde B sale un camino recto BH, perpendicular al lindero AC, que lo parte en AH = ', v('m', L(m, u)), ' y HC = ', v('n', L(n, u)), '.']
        : ctx === 'techo'
          ? ['La sección de un toldo es un triángulo ABC con ángulo recto en B. Un soporte BH baja desde B perpendicular a la base AC y la divide en AH = ', v('m', L(m, u)), ' y HC = ', v('n', L(n, u)), '.']
          : ['En el triángulo ABC, recto en B, la altura BH relativa a la hipotenusa determina en ella los segmentos AH = ', v('m', L(m, u)), ' y HC = ', v('n', L(n, u)), '.'];
      if (sub === 'h') {
        const mn = m * n;
        return {
          variables, enunciado, unidad: u, datos: { sub, m, n }, correcta: sq(mn),
          pregunta: [ctx === 'terreno' ? '¿Cuánto mide el camino BH?' : ctx === 'techo' ? '¿Cuánto mide el soporte BH?' : '¿Cuánto mide la altura BH?'],
          errores: [
            h('GE18-altura-promedio', (m + n) / 2, `Promediaste las proyecciones. La altura no es su promedio sino su media geométrica: BH² = AH·HC.`),
            h('RM-sin-raiz', mn, `Calculaste BH² = ${m}·${n} = ${mn} y olvidaste sacar la raíz cuadrada.`),
            h('RM-diferencia-proyecciones', Math.abs(n - m), `Restaste las proyecciones. La altura es su media geométrica: BH² = AH·HC.`),
            h('GE18-cateto-por-altura', sq(m * (m + n)), `Usaste AC·AH: eso da el cateto AB al cuadrado, no la altura BH.`),
            pa('GE11-pitagoras-proyecciones', sq(m * m + n * n), `Aplicaste Pitágoras con AH y HC como catetos. Están sobre la misma recta AC: no forman un ángulo recto entre sí.`),
          ],
          solucion: [
            ['Los triángulos AHB y BHC son semejantes (los dos son rectángulos en H y comparten los ángulos agudos), y de ahí BH² = AH·HC.'],
            ['BH² = ', v('m', `${m}`), '·', v('n', `${n}`), ` = ${mn}.`],
            ['BH = ', v('x', `${igualRaiz(mn)} ${u}`), '.'],
          ],
        };
      }
      const ab2 = m * (m + n);
      return {
        variables, enunciado, unidad: u, datos: { sub, m, n }, correcta: sq(ab2),
        pregunta: [ctx === 'terreno' ? '¿Cuánto mide el lindero AB?' : ctx === 'techo' ? '¿Cuánto mide el lado AB del toldo?' : '¿Cuánto mide el cateto AB?'],
        errores: [
          h('GE18-cateto-producto-proyecciones', sq(m * n), `Usaste AB² = AH·HC: esa es la fórmula de la altura BH. El cateto cumple AB² = AC·AH, con la hipotenusa entera.`),
          h('RM-proyeccion-cruzada', sq(n * (m + n)), `Multiplicaste la hipotenusa por HC: así sale el otro cateto, BC. Para AB va su propia proyección, AH (la que toca a A).`),
          h('RM-sin-raiz', ab2, `Calculaste AB² = ${ab2} y olvidaste sacar la raíz cuadrada.`),
          pa('GE11-proyeccion-como-cateto', sq((m + n) ** 2 - m * m), `Hiciste AB² = AC² − AH², como si AH fuera un cateto del triángulo ABC. AH es la proyección de AB, no un lado del triángulo.`),
        ],
        solucion: [
          ['La hipotenusa es AC = ', v('m', `${m}`), ' + ', v('n', `${n}`), ` = ${m + n}.`],
          ['Cada cateto al cuadrado es la hipotenusa por su proyección: AB² = AC·AH = ', `${m + n}·`, v('m', `${m}`), ` = ${ab2}.`],
          ['AB = ', v('x', `${igualRaiz(ab2)} ${u}`), '.'],
        ],
      };
    },

    semicircunferencia(rng, u) {
      const sub = rng.elegir(['cuerda', 'area']);
      let d, m;
      if (sub === 'area') ({ d, m } = rng.elegir(SEMI_AREA));
      else for (;;) { d = rng.entero(6, 30); m = rng.entero(1, d - 1); if (2 * m !== d) break; }
      const variables = { d: { nombre: 'diámetro AB', color: 'o' }, m: { nombre: 'proyección AH', color: 'i' },
        ch: { nombre: 'altura CH', color: 'h' }, x: { nombre: sub === 'cuerda' ? 'cuerda AC' : 'área del triángulo ACB', color: 'd' } };
      if (sub === 'cuerda') delete variables.ch;
      const ctx = rng.moneda();
      const enunciado = ctx
        ? ['La fachada de un horno de barro tiene forma de semicircunferencia apoyada sobre su diámetro AB = ', v('d', L(d, u)),
           '. Desde un punto C del arco se baja una plomada CH perpendicular a AB, que cae a AH = ', v('m', L(m, u)), ' de A.']
        : ['AB es el diámetro de una semicircunferencia, con AB = ', v('d', L(d, u)), '. C es un punto de la semicircunferencia y H es el pie de la perpendicular trazada desde C a AB, con AH = ', v('m', L(m, u)), '.'];
      const ac2 = d * m;
      if (sub === 'cuerda') {
        return {
          variables, enunciado, unidad: u, datos: { sub, d, m }, correcta: sq(ac2),
          pregunta: [ctx ? '¿Cuánto mide la varilla recta que une A con C?' : '¿Cuánto mide la cuerda AC?'],
          errores: [
            h('RM-cuerda-por-altura', sq(m * (d - m)), `Calculaste CH² = AH·HB: esa es la altura CH, no la cuerda AC.`),
            h('RM-proyeccion-cruzada', sq(d * (d - m)), `Multiplicaste el diámetro por HB: así sale la otra cuerda, BC. Para AC va su propia proyección, AH.`),
            pa('GE11-proyeccion-como-cateto', sq(d * d - m * m), `Hiciste AC² = AB² − AH², como si AH fuera un lado del triángulo ACB. AH es la proyección de AC sobre el diámetro.`),
            h('RM-sin-raiz', ac2, `Calculaste AC² = ${ac2} y olvidaste sacar la raíz cuadrada.`),
          ],
          solucion: [
            ['El ángulo ACB está inscrito en la semicircunferencia: mide 90°. Entonces ACB es un triángulo rectángulo con hipotenusa AB, y AH es la proyección de AC.'],
            ['Cuerda al cuadrado = diámetro × proyección: AC² = ', v('d', `${d}`), '·', v('m', `${m}`), ` = ${ac2}.`],
            ['AC = ', v('x', `${igualRaiz(ac2)} ${u}`), '.'],
          ],
        };
      }
      const ch = sq(m * (d - m)), area = d * ch / 2;
      return {
        variables, enunciado, unidad: `${u}²`, datos: { sub, d, m }, correcta: area,
        pregunta: ['¿Cuál es el área del triángulo ACB?'],
        errores: [
          h('RM-area-sin-mitad', d * ch, `Multiplicaste base por altura y no dividiste entre 2.`),
          pa('GE7-proyeccion-como-altura', d * m / 2, `Usaste AH como altura. La altura del triángulo sobre AB es CH, la perpendicular desde C.`),
          pa('GE7-cuerda-como-altura', d * sq(ac2) / 2, `Usaste la cuerda AC como altura. AC es inclinada; la altura sobre AB es la perpendicular CH.`),
          h('RM-altura-radio', d * d / 4, `Tomaste la altura CH igual al radio. Eso solo pasa si C está en lo más alto del arco; aquí H no es el centro.`),
        ],
        solucion: [
          ['El ángulo ACB está inscrito en la semicircunferencia: mide 90°. Entonces CH es la altura relativa a la hipotenusa AB.'],
          ['HB = ', v('d', `${d}`), ' − ', v('m', `${m}`), ` = ${d - m}, y CH² = AH·HB = ${m}·${d - m} = ${m * (d - m)}, así que CH = `, v('ch', L(ch, u)), '.'],
          ['Área = AB·CH/2 = ', `${d}·${ch}/2 = `, v('x', `${f(area)} ${u}²`), '.'],
        ],
      };
    },

    euclides(rng, u) {
      const sub = rng.elegir(['lado', 'proyeccion', 'corona']);
      if (sub === 'corona') {
        let r, m, x, R2;
        for (;;) { r = rng.entero(3, 15); m = rng.entero(1, r - 1); x = rng.entero(2, 20); R2 = r * r + x * x + 2 * x * m; if (esCuadrado(R2) && sq(R2) <= 40) break; }
        const Rr = sq(R2), w = m * m + R2 - r * r;
        const variables = { r: { nombre: 'radio interior OA', color: 'o' }, R: { nombre: 'radio exterior OB', color: 'i' }, m: { nombre: 'AH', color: 'h' }, x: { nombre: 'plataforma AB', color: 'd' } };
        return {
          variables, unidad: u, correcta: x, datos: { sub, R: Rr, r, m },
          enunciado: ['Una pista tiene forma de corona circular: dos circunferencias concéntricas de centro O, la interior de radio ', v('r', L(r, u)), ' y la exterior de radio ', v('R', L(Rr, u)), '. Una plataforma recta AB va desde un punto A del borde interior hasta un punto B del borde exterior. Si se prolonga BA más allá de A, el pie H de la perpendicular trazada desde O a esa recta queda a AH = ', v('m', L(m, u)), ' de A.'],
          pregunta: ['¿Cuánto mide la plataforma AB?'],
          errores: [
            h('RM-corona-ancho', Rr - r, `Ese es el ancho de la corona (R − r). La plataforma va inclinada: no sigue un radio.`),
            pa('GE11-pitagoras-sin-angulo-recto', sq(R2 - r * r), `Usaste Pitágoras con OA y OB, como si el ángulo en A fuera recto. Es obtuso: H cae fuera, más allá de A.`),
            h('RM-euclides-signo', sq(w) + m, `Usaste el signo del ángulo agudo (OB² = OA² + AB² − 2·AB·AH). El ángulo OAB es obtuso: va + 2·AB·AH.`),
            h('RM-corona-sin-restar', sq(w), `Hallaste BH = √(OB² − OH²) y lo tomaste como AB. Falta quitarle AH: AB = BH − AH.`),
          ],
          solucion: [
            ['El pie H cae fuera del segmento, más allá de A: en el triángulo OAB el ángulo en A es obtuso y AH = ', v('m', `${m}`), ' es la proyección de OA sobre la recta AB.'],
            ['Teorema de Euclides (ángulo obtuso): OB² = OA² + AB² + 2·AB·AH → ', v('R', `${Rr}`), '² = ', v('r', `${r}`), `² + AB² + 2·${m}·AB.`],
            [`AB² + ${2 * m}·AB − ${R2 - r * r} = 0 → (AB + ${m})² = ${w} → AB + ${m} = ${R(sq(w))}.`],
            ['AB = ', v('x', L(x, u)), '. (Comprobación: OH² = ', `${r * r} − ${m * m} = ${r * r - m * m} y BH = ${x + m}; OH² + BH² = ${R2} = OB².)`],
          ],
        };
      }
      let a, b, c, m, obtuso;
      if (sub === 'proyeccion') ({ a, b, c, m, obtuso } = rng.elegir(EUCLIDES_ENTEROS));
      else for (;;) {
        b = rng.entero(3, 15); c = rng.entero(3, 15); m = rng.entero(1, b - 1); obtuso = rng.moneda();
        if (b === c || (!obtuso && m >= c)) continue;
        break;
      }
      const s = obtuso ? 1 : -1;
      if (sub === 'lado') {
        const a2 = b * b + c * c + s * 2 * c * m;
        const variables = { b: { nombre: 'lado AC', color: 'o' }, c: { nombre: 'lado AB', color: 'i' },
          m: { nombre: 'proyección de AC sobre AB', color: 'h' }, x: { nombre: 'lado BC', color: 'd' } };
        const donde = obtuso ? 'sobre la prolongación de BA, más allá de A,' : 'sobre el lado AB';
        const ctx = rng.moneda();
        const enunciado = ctx
          ? ['Dos tablones AB = ', v('c', L(c, u)), ' y AC = ', v('b', L(b, u)), ` salen del mismo punto A y forman un ángulo BAC ${obtuso ? 'obtuso' : 'agudo'}. La proyección perpendicular de AC ${donde} mide `, v('m', L(m, u)), '. Un cable tenso une B con C.']
          : ['En el triángulo ABC, el ángulo BAC es ', obtuso ? 'obtuso' : 'agudo', '. AB = ', v('c', L(c, u)), ', AC = ', v('b', L(b, u)), ` y la proyección de AC ${donde} mide `, v('m', L(m, u)), '.'];
        return {
          variables, enunciado, unidad: u, datos: { sub, b, c, m, obtuso }, correcta: sq(a2),
          pregunta: [ctx ? '¿Cuánto mide el cable BC?' : '¿Cuánto mide BC?'],
          errores: [
            h('RM-euclides-signo', sq(b * b + c * c - s * 2 * c * m), obtuso
              ? 'Usaste el signo menos, que va con el ángulo agudo. Con el ángulo obtuso en A, el lado opuesto es más largo que con Pitágoras: va + 2·AB·m.'
              : 'Usaste el signo más, que va con el ángulo obtuso. Con el ángulo agudo en A, el lado opuesto es más corto que con Pitágoras: va − 2·AB·m.'),
            pa('GE11-pitagoras-sin-angulo-recto', sq(b * b + c * c), `Usaste Pitágoras, pero el ángulo en A no es recto: falta el término 2·AB·m.`),
            h('RM-euclides-sin-lado', sq(b * b + c * c + s * 2 * m), `En el término 2·AB·m olvidaste multiplicar por AB: pusiste solo 2·m.`),
            h('RM-euclides-sin-doble', sq(b * b + c * c + s * c * m), `Olvidaste el 2 del término 2·AB·m.`),
            h('RM-euclides-doble-termino', sq(b * b + c * c + s * 4 * c * m), `Pusiste 4·AB·m: el término del teorema es 2·AB·m, una sola vez.`),
          ],
          solucion: [
            [`Teorema de Euclides (de la proyección): el lado opuesto a un ángulo ${obtuso ? 'obtuso' : 'agudo'} cumple BC² = AB² + AC² ${obtuso ? '+' : '−'} 2·AB·m, con m la proyección de AC sobre la recta AB.`],
            ['BC² = ', v('c', `${c}`), '² + ', v('b', `${b}`), `² ${obtuso ? '+' : '−'} 2·${c}·`, v('m', `${m}`), ` = ${c * c} + ${b * b} ${obtuso ? '+' : '−'} ${2 * c * m} = ${a2}.`],
            ['BC = ', v('x', `${igualRaiz(a2)} ${u}`), '.'],
          ],
        };
      }
      const variables = { a: { nombre: 'lado BC', color: 'o' }, b: { nombre: 'lado AC', color: 'i' },
        c: { nombre: 'lado AB', color: 'h' }, x: { nombre: 'proyección de AC sobre AB', color: 'd' } };
      const dif = a * a - b * b - c * c;
      return {
        variables, unidad: u, datos: { sub, a, b, c }, correcta: m,
        enunciado: ['Los lados de un triángulo ABC miden BC = ', v('a', L(a, u)), ', AC = ', v('b', L(b, u)), ' y AB = ', v('c', L(c, u)), '.'],
        pregunta: ['¿Cuánto mide la proyección de AC sobre la recta AB?'],
        errores: [
          h('RM-proyeccion-sin-mitad', Math.abs(dif) / c, `Despejaste sin el 2 del término 2·AB·m: dividiste entre AB y no entre 2·AB.`),
          h('RM-proyeccion-otro-lado', Math.abs(dif) / (2 * b), `Dividiste entre 2·AC: así sale la proyección de AB sobre AC, no la de AC sobre AB.`),
          h('RM-proyeccion-por-altura', sq(b * b - m * m), `Calculaste la altura desde C, no la proyección: la proyección es el cateto que queda sobre la recta AB.`),
          h('RM-proyeccion-sobre-BC', Math.abs(c * c - a * a - b * b) / (2 * a), `Calculaste la proyección de AC sobre BC (usaste el ángulo C). Se pide sobre la recta AB.`),
          h('RM-proyeccion-de-BC', dif > 0 ? c + m : c - m, `Esa es la proyección de BC sobre la recta AB (el tramo desde B hasta el pie de la altura), no la de AC.`),
          h('RM-proyeccion-doble-termino', Math.abs(dif) / (4 * c), `Usaste 4·AB·m en vez de 2·AB·m: el término del teorema de Euclides lleva un solo 2.`),
          h('RM-proyeccion-solo-entre-2', Math.abs(dif) / 2, `Al despejar dividiste solo entre 2: el término es 2·AB·m, así que se divide entre 2·AB.`),
        ],
        solucion: [
          ['Se compara BC² con AB² + AC²: ', v('a', `${a}`), `² = ${a * a} y `, v('c', `${c}`), '² + ', v('b', `${b}`), `² = ${c * c + b * b}. ${dif > 0 ? 'BC² es mayor: el ángulo en A es obtuso' : 'BC² es menor: el ángulo en A es agudo'}.`],
          [`Teorema de Euclides: BC² = AB² + AC² ${dif > 0 ? '+' : '−'} 2·AB·m.`],
          [`${a * a} = ${c * c + b * b} ${dif > 0 ? '+' : '−'} 2·${c}·m → m = ${Math.abs(dif)}/${2 * c} = `, v('x', L(m, u)), '.'],
        ],
      };
    },

    mediana(rng, u) {
      const sub = rng.elegir(['mediana', 'lado']);
      const { a, b, c, ma2 } = rng.elegir(MEDIANAS);
      const ctx = rng.moneda();
      const ma = sq(ma2);
      if (sub === 'mediana') {
        const variables = { a: { nombre: 'lado BC', color: 'o' }, b: { nombre: 'lado AC', color: 'i' }, c: { nombre: 'lado AB', color: 'h' }, x: { nombre: 'mediana AM', color: 'd' } };
        return {
          variables, unidad: u, datos: { sub, a, b, c }, correcta: ma,
          enunciado: ctx
            ? ['Un jardín triangular ABC tiene lados AB = ', v('c', L(c, u)), ', AC = ', v('b', L(b, u)), ' y BC = ', v('a', L(a, u)), '. Se tiende una manguera recta desde A hasta M, el punto medio de BC.']
            : ['En el triángulo ABC, AB = ', v('c', L(c, u)), ', AC = ', v('b', L(b, u)), ' y BC = ', v('a', L(a, u)), '. M es el punto medio de BC.'],
          pregunta: [ctx ? '¿Cuánto mide la manguera AM?' : '¿Cuánto mide la mediana AM?'],
          errores: [
            h('RM-mediana-sin-mitad', sq((b * b + c * c - a * a) / 2), `Usaste AB² + AC² = 2·AM² + BC². En el teorema de la mediana va la mitad del cuadrado del lado: BC²/2.`),
            h('RM-mediana-mitad-lado', a / 2, `Tomaste la mediana como la mitad de BC. Eso solo vale si el ángulo en A es recto; aquí no lo es.`),
            h('RM-mediana-promedio', (b + c) / 2, `Promediaste AB y AC. La mediana sale de los cuadrados de los lados, no de su promedio.`),
            h('RM-mediana-doble', sq(4 * ma2), `Te quedó 2·AM: despejaste AM² sin dividir entre 4.`),
            h('RM-sin-raiz', ma2, `Calculaste AM² = ${ma2} y olvidaste sacar la raíz cuadrada.`),
          ],
          solucion: [
            ['Teorema de la mediana: AB² + AC² = 2·AM² + BC²/2.'],
            [v('c', `${c}`), '² + ', v('b', `${b}`), `² = 2·AM² + `, v('a', `${a}`), `²/2 → ${c * c + b * b} = 2·AM² + ${a * a / 2}.`],
            [`AM² = ${c * c + b * b - a * a / 2}/2 = ${ma2}, y AM = `, v('x', `${igualRaiz(ma2)} ${u}`), '.'],
          ],
        };
      }
      const variables = { b: { nombre: 'lado AC', color: 'i' }, c: { nombre: 'lado AB', color: 'h' }, ma: { nombre: 'mediana AM', color: 'o' }, x: { nombre: 'lado BC', color: 'd' } };
      return {
        variables, unidad: u, datos: { sub, b, c, ma2 }, correcta: a,
        enunciado: ctx
          ? ['Dos cables, AB = ', v('c', L(c, u)), ' y AC = ', v('b', L(b, u)), ', bajan desde la punta A de un mástil hasta dos estacas B y C del suelo. Una cuerda va de A hasta M, el punto medio entre las estacas, y mide AM = ', v('ma', L(ma, u)), '.']
          : ['En el triángulo ABC, AB = ', v('c', L(c, u)), ' y AC = ', v('b', L(b, u)), '. La mediana AM, trazada al punto medio M de BC, mide ', v('ma', L(ma, u)), '.'],
        pregunta: [ctx ? '¿Qué distancia hay entre las estacas B y C?' : '¿Cuánto mide BC?'],
        errores: [
          h('RM-mediana-sin-mitad', sq(b * b + c * c - 2 * ma2), `Usaste AB² + AC² = 2·AM² + BC². En el teorema de la mediana va la mitad del cuadrado del lado: BC²/2.`),
          h('RM-mediana-mitad-lado', 2 * ma, `Tomaste BC como el doble de la mediana. Eso solo vale si el ángulo en A es recto.`),
          h('RM-sin-raiz', a * a, `Calculaste BC² = ${a * a} y olvidaste sacar la raíz cuadrada.`),
          h('RM-mediana-despeje', sq(2 * b * b + 2 * c * c - 2 * ma2), `Al despejar te quedó BC² = 2·AB² + 2·AC² − 2·AM². Al multiplicar todo por 2, el término de la mediana es 4·AM².`),
        ],
        solucion: [
          ['Teorema de la mediana: AB² + AC² = 2·AM² + BC²/2.'],
          [v('c', `${c}`), '² + ', v('b', `${b}`), '² = 2·', v('ma', R(ma).includes('√') ? `(${R(ma)})` : R(ma)), `² + BC²/2 → ${c * c + b * b} = ${2 * ma2} + BC²/2.`],
          [`BC²/2 = ${c * c + b * b - 2 * ma2}, BC² = ${a * a} y BC = `, v('x', L(a, u)), '.'],
        ],
      };
    },

    marlen(rng, u) {
      const X = rng.elegir(['A', 'B', 'C', 'D']), O = OPUESTO[X], [Y, Z] = VECINOS[X];
      const exacta = rng.moneda();
      let d;
      for (let i = 0; i < 60; i++) {
        d = { [Y]: rng.entero(2, 15) ** 2, [Z]: rng.entero(2, 15) ** 2, [O]: rng.entero(2, 15) ** 2 };
        d[X] = d[Y] + d[Z] - d[O];
        if (!exacta || esCuadrado(d[X])) break;
      }
      if (d[X] <= 0 || new Set([d[Y], d[Z], d[O]]).size < 3) return null;
      const dist = {}; for (const k of ['A', 'B', 'C', 'D']) if (k !== X) dist[k] = d[k];
      const variables = {
        [Y]: { nombre: `P${Y}`, color: 'o' }, [O]: { nombre: `P${O}`, color: 'i' }, [Z]: { nombre: `P${Z}`, color: 'h' }, x: { nombre: `P${X}`, color: 'd' },
      };
      const orden = ['A', 'B', 'C', 'D'].filter(k => k !== X);
      const lista = [];
      orden.forEach((k, i) => { lista.push(`P${k} = `, v(k, L(sq(d[k]), u))); lista.push(i === 0 ? ', ' : i === 1 ? ' y ' : ''); });
      const ctx = rng.moneda();
      const enunciado = ctx
        ? ['Una cancha tiene forma de rectángulo ABCD (las esquinas en ese orden). Un poste P, dentro de la cancha, está a estas distancias de tres esquinas: ', ...lista, '.']
        : ['ABCD es un rectángulo (vértices en ese orden) y P es un punto de su interior. Se sabe que ', ...lista, '.'];
      const x2 = d[Y] + d[Z] - d[O];
      const y = sq(d[Y]), z = sq(d[Z]), o = sq(d[O]);
      return {
        variables, enunciado, unidad: u, correcta: sq(x2),
        datos: { falta: X, dist },
        pregunta: [ctx ? `¿A qué distancia está el poste de la esquina ${X}?` : `¿Cuánto mide P${X}?`],
        errores: [
          h('RM-marlen-lineal', y + z - o, `Usaste la relación sin elevar al cuadrado (P${Y} + P${Z} − P${O}). El teorema junta los cuadrados de las distancias.`),
          h('RM-marlen-pareja-1', sq(d[O] + d[Y] - d[Z]), `Emparejaste vértices vecinos. La relación junta vértices opuestos: PA² + PC² = PB² + PD².`),
          h('RM-marlen-pareja-2', sq(d[O] + d[Z] - d[Y]), `Emparejaste vértices vecinos. La relación junta vértices opuestos: PA² + PC² = PB² + PD².`),
          h('RM-marlen-suma', sq(d[Y] + d[Z]), `Sumaste los cuadrados de P${Y} y P${Z} y no restaste el de P${O}.`),
          h('RM-sin-raiz', x2, `Calculaste P${X}² = ${x2} y olvidaste sacar la raíz cuadrada.`),
        ],
        solucion: [
          ['Por P se trazan paralelas a los lados. Cada distancia de P a un vértice es la hipotenusa de un triángulo rectángulo, y los catetos se repiten en vértices opuestos.'],
          ['De ahí el teorema (de Marlen): PA² + PC² = PB² + PD². Aquí: ', `P${X}² + `, v(O, `${R(o)}`), '² = ', v(Y, `${R(y)}`), '² + ', v(Z, `${R(z)}`), '².'],
          [`P${X}² = ${d[Y]} + ${d[Z]} − ${d[O]} = ${x2}.`],
          [`P${X} = `, v('x', `${igualRaiz(x2)} ${u}`), '.'],
        ],
      };
    },

    'diferencia-cuadrados'(rng, u) {
      // AH = 12k es la altura desde A. En ABH: BH = AH·cot B; en ACH: HC = AH·cot C.
      const COT = { 37: 16, 45: 12, 53: 9 }; // BH (o HC) con AH = 12
      const k = rng.elegir([1, 2]);
      const B = rng.elegir([37, 45, 53, 127, 135]), C = rng.elegir([37, 45, 53]);
      const agudoB = B < 90 ? B : 180 - B;
      const AH = 12 * k, BH = COT[agudoB] * k, HC = COT[C] * k;
      if (B > 90 && HC <= BH) return null;
      const bc = B < 90 ? BH + HC : HC - BH;
      const ab2 = AH * AH + BH * BH, ac2 = AH * AH + HC * HC;
      const A = 180 - B - C;
      const variables = { ab: { nombre: 'lado AB', color: 'o' }, ac: { nombre: 'lado AC', color: 'i' }, bc: { nombre: 'lado BC', color: 'h' }, x: { nombre: 'ángulo ABC', color: 'd' } };
      const ctx = rng.moneda();
      const enunciado = ctx
        ? ['Tres varillas rectas forman un triángulo ABC: AB = ', v('ab', L(sq(ab2), u)), ', AC = ', v('ac', L(sq(ac2), u)), ' y BC = ', v('bc', L(bc, u)), '.']
        : ['En el triángulo ABC, AB = ', v('ab', L(sq(ab2), u)), ', AC = ', v('ac', L(sq(ac2), u)), ' y BC = ', v('bc', L(bc, u)), '.'];
      const x = (bc * bc + ab2 - ac2) / (2 * bc); // BH con signo
      const errores = [
        h('RM-angulo-complemento', 90 - agudoB, `Ese es el ángulo BAH, en el vértice A del triángulo ABH. Se pide el ángulo en B.`),
        h(B > 90 ? 'RM-pie-fuera' : 'RM-angulo-suplemento', 180 - B, B > 90
          ? `Ese es el ángulo entre AB y la prolongación de CB. H cae fuera del lado, más allá de B: el ángulo del triángulo en B es el suplemento.`
          : `Tomaste el suplemento. Aquí H cae entre B y C, así que el ángulo en B es agudo y es el mismo del triángulo ABH.`),
        h('RM-angulo-otro-vertice', C, `Ese es el ángulo en C (del triángulo ACH). Se pide el ángulo en B.`),
        h('RM-angulo-en-A', A, `Ese es el ángulo en A. Se pide el ángulo en B.`),
        h('RM-angulo-exterior-C', 180 - C, `Ese es el ángulo exterior en C (180° − ∠ACB). Se pide el ángulo interior en B.`),
      ];
      const medio = notable((bc / 2) / sq(ab2));
      if (Number.isFinite(medio)) errores.splice(2, 0, pa('GE8-pie-en-punto-medio', medio, `Supusiste que la altura desde A cae en el punto medio de BC. Eso solo pasa si AB = AC.`));
      return {
        variables, enunciado, correcta: B, angular: true, unidad: '°', errores,
        datos: { ab2, ac2, bc },
        pregunta: ['¿Cuánto mide el ángulo ABC?'],
        solucion: [
          ['Se traza la altura AH sobre la recta BC. Por Pitágoras en ABH y en ACH, AH² = AB² − BH² = AC² − HC². Entonces AB² − AC² = BH² − HC² (diferencia de cuadrados).'],
          ['Con BH medido desde B hacia C: BH = (BC² + AB² − AC²)/(2·BC) = (', v('bc', `${bc}`), `² + ${ab2} − ${ac2})/${2 * bc} = ${f(x)}.`],
          x < 0 ? [`Sale negativo: H cae fuera del lado, en la prolongación de CB, a ${f(-x)} ${u} de B. El ángulo en B es obtuso.`]
                : ['Sale positivo y menor que BC: H cae entre B y C.'],
          [`AH² = ${ab2} − ${f(x * x)} = ${AH * AH}, AH = ${AH}. El triángulo ABH tiene catetos ${AH} y ${f(Math.abs(x))}: ${agudoB === 45 ? 'es isósceles (45°)' : 'es el notable 3-4-5'}, con ∠ABH = ${agudoB}°.`],
          ['∠ABC = ', v('x', `${B}°`), B > 90 ? ` (suplemento de ${agudoB}°).` : '.'],
        ],
      };
    },

    heron(rng, u) {
      const sub = rng.elegir(['area', 'altura']);
      let lados = rng.barajar(rng.elegir(HERON));
      let [a, b, c] = lados;
      const s = (a + b + c) / 2, S = calc.heron(a, b, c);
      if (sub === 'altura' && !limpio(2 * S / a)) {
        const ok = [0, 1, 2].map(i => [lados[i], ...lados.filter((_, j) => j !== i)]).filter(([x]) => limpio(2 * S / x));
        if (!ok.length) return null;
        [a, b, c] = rng.elegir(ok);
      }
      const variables = { a: { nombre: 'lado BC', color: 'o' }, b: { nombre: 'lado AC', color: 'i' }, c: { nombre: 'lado AB', color: 'h' },
        x: { nombre: sub === 'area' ? 'área' : 'altura relativa a BC', color: 'd' } };
      const ctx = rng.moneda();
      const enunciado = ctx
        ? ['Una vela de bote tiene forma de triángulo ABC, con bordes BC = ', v('a', L(a, u)), ', AC = ', v('b', L(b, u)), ' y AB = ', v('c', L(c, u)), '.']
        : ['Los lados de un triángulo ABC miden BC = ', v('a', L(a, u)), ', AC = ', v('b', L(b, u)), ' y AB = ', v('c', L(c, u)), '.'];
      const pasoHeron = [
        ['Semiperímetro: p = (', v('a', `${a}`), ' + ', v('b', `${b}`), ' + ', v('c', `${c}`), `)/2 = ${f(s)}.`],
        [`Herón: área = √(p(p − a)(p − b)(p − c)) = √(${f(s)}·${f(s - a)}·${f(s - b)}·${f(s - c)}) = √${Math.round(S * S)} = ${f(S)} ${u}².`],
      ];
      if (sub === 'area') {
        const Pm = a + b + c;
        return {
          variables, enunciado, unidad: `${u}²`, correcta: S, datos: { sub, a, b, c },
          pregunta: [ctx ? '¿Cuánta tela tiene la vela (su área)?' : '¿Cuál es el área del triángulo?'],
          errores: [
            pa('GE7-lado-como-altura-AC', a * b / 2, `Usaste el lado AC como si fuera la altura sobre BC. El triángulo no es rectángulo: la altura es otra.`),
            h('RM-heron-perimetro', sq(Pm * (Pm - a) * (Pm - b) * (Pm - c)), `Usaste el perímetro entero en la fórmula de Herón. Va el semiperímetro p, la mitad.`),
            h('RM-sin-raiz', S * S, `Calculaste p(p − a)(p − b)(p − c) = ${f(S * S)} y olvidaste sacar la raíz cuadrada.`),
            h('RM-heron-sin-p', sq((s - a) * (s - b) * (s - c)), `En la fórmula de Herón te faltó el factor p.`),
            pa('GE7-lado-como-altura-AB', b * c / 2, `Usaste un lado como si fuera la altura. El triángulo no es rectángulo: la altura es otra.`),
          ],
          solucion: [pasoHeron[0], [`Herón: área = √(p(p − a)(p − b)(p − c)) = √(${f(s)}·${f(s - a)}·${f(s - b)}·${f(s - c)}) = √${Math.round(S * S)} = `, v('x', `${f(S)} ${u}²`), '.']],
        };
      }
      const alt = 2 * S / a;
      return {
        variables, enunciado, unidad: u, correcta: alt, datos: { sub, a, b, c },
        pregunta: [ctx ? '¿Cuánto mide la altura de la vela desde A hasta la recta que contiene el borde BC?' : '¿Cuánto mide la altura relativa al lado BC?'],
        errores: [
          h('RM-altura-sin-doble', S / a, `Dividiste el área entre BC. Como área = BC·h/2, la altura es 2·área/BC.`),
          pa('GE8-pie-en-punto-medio-AC', sq(b * b - a * a / 4), `Supusiste que la altura cae en el punto medio de BC. Eso solo pasa si AB = AC.`),
          pa('GE8-pie-en-punto-medio-AB', sq(c * c - a * a / 4), `Supusiste que la altura cae en el punto medio de BC. Eso solo pasa si AB = AC.`),
          pa('GE7-lado-como-altura', Math.min(b, c), `Tomaste un lado como altura. La altura es la perpendicular desde A a BC, más corta que AB y que AC.`),
          h('RM-altura-con-semiperimetro', S / s, `Dividiste el área entre el semiperímetro: eso da el radio de la circunferencia inscrita. La altura es 2·área/BC.`),
        ],
        solucion: [...pasoHeron, ['Área = BC·h/2 → h = 2·', `${f(S)}/`, v('a', `${a}`), ' = ', v('x', L(alt, u)), '.']],
      };
    },

    ptolomeo(rng, u) {
      const sub = rng.elegir(['trapecio', 'trapecio', 'heptagono']);
      if (sub === 'heptagono') {
        const k = rng.entero(1, 15);
        const variables = { k: { nombre: 'k de la relación', color: 'o' }, a: { nombre: 'lado AB', color: 'i' }, x: { nombre: 'perímetro', color: 'd' } };
        return {
          variables, unidad: u, correcta: 7 * k, datos: { sub, k },
          enunciado: ['ABCDEFG es un heptágono regular. Sus diagonales AC y AD cumplen 1/AC + 1/AD = 1/', v('k', `${k}`), ` (con las longitudes en ${u}).`],
          pregunta: ['¿Cuál es el perímetro del heptágono?'],
          errores: [
            h('RM-heptagono-promedio', 14 * k, `Escribiste 1/AC + 1/AD = 2/AB, como si el lado fuera el promedio armónico de las diagonales. Ptolomeo da 1/AC + 1/AD = 1/AB.`),
            h('RM-heptagono-solo-lado', k, `Ese es el lado AB. Se pide el perímetro: son 7 lados iguales.`),
            h('RM-heptagono-promedio-lado', 2 * k, `Escribiste 1/AC + 1/AD = 2/AB (como si el lado fuera el promedio armónico de las diagonales) y te quedaste con el lado. Ptolomeo da 1/AC + 1/AD = 1/AB, y se pide el perímetro.`),
            h('RM-heptagono-mitad-lado', k / 2, `Escribiste 1/AC + 1/AD = 1/(2·AB) y te quedaste con el lado. Ptolomeo da 1/AC + 1/AD = 1/AB, y se pide el perímetro.`),
          ],
          solucion: [
            ['Llamemos a al lado, b = AC (diagonal corta) y c = AD (diagonal larga). El cuadrilátero ACDE está inscrito en la circunferencia del heptágono: AC = b, CD = a, DE = a, EA = c, y sus diagonales son AD = c y CE = b.'],
            ['Ptolomeo (producto de diagonales = suma de productos de lados opuestos): c·b = b·a + a·c.'],
            ['Dividiendo entre a·b·c: 1/a = 1/c + 1/b. Con 1/AC + 1/AD = 1/', v('k', `${k}`), ' sale ', v('a', `AB = ${k} ${u}`), '.'],
            ['Perímetro = 7·', `${k} = `, v('x', `${7 * k} ${u}`), '.'],
          ],
        };
      }
      let B, b, l;
      for (;;) {
        B = rng.entero(8, 24); b = rng.entero(2, B - 2); l = rng.entero(Math.floor((B - b) / 2) + 1, Math.floor((B - b) / 2) + 8);
        if (l === B || l === b) continue;
        break;
      }
      const d2 = l * l + B * b;
      const variables = { B: { nombre: 'base mayor AD', color: 'o' }, b: { nombre: 'base menor BC', color: 'i' }, l: { nombre: 'lados AB y CD', color: 'h' }, x: { nombre: 'diagonal AC', color: 'd' } };
      const ctx = rng.moneda();
      return {
        variables, unidad: u, correcta: sq(d2), datos: { sub, B, b, l },
        enunciado: ctx
          ? ['Un marco de ventana tiene forma de trapecio isósceles ABCD con las bases AD = ', v('B', L(B, u)), ' y BC = ', v('b', L(b, u)), ' y los lados iguales AB = CD = ', v('l', L(l, u)), '. Se refuerza con un listón en la diagonal AC.']
          : ['En el trapecio isósceles ABCD, las bases miden AD = ', v('B', L(B, u)), ' y BC = ', v('b', L(b, u)), ', y los lados no paralelos AB = CD = ', v('l', L(l, u)), '.'],
        pregunta: [ctx ? '¿Cuánto mide el listón AC?' : '¿Cuánto mide la diagonal AC?'],
        errores: [
          pa('GE11-pitagoras-sin-angulo-recto', sq(l * l + B * B), `Usaste Pitágoras con AB y AD, pero el ángulo entre ellos no es recto.`),
          h('RM-ptolomeo-sin-lados', sq(B * b), `Te olvidaste del producto de los lados no paralelos, AB·CD.`),
          h('RM-sin-raiz', d2, `Calculaste AC² = ${d2} y olvidaste sacar la raíz cuadrada.`),
          pa('GE11-pitagoras-base-menor', sq(l * l + b * b), `Usaste Pitágoras con AB y BC, pero el ángulo entre ellos no es recto.`),
          h('RM-ptolomeo-suma-lados', sq(2 * l * l + B * b), `Sumaste AB² y CD² por separado: el producto de lados opuestos es AB·CD = ${l}·${l}, una sola vez.`),
        ],
        solucion: [
          ['Todo trapecio isósceles se puede inscribir en una circunferencia (sus ángulos opuestos suman 180°). Por eso vale Ptolomeo: AC·BD = AB·CD + AD·BC.'],
          ['Las diagonales son iguales: AC² = ', v('l', `${l}`), '·', v('l', `${l}`), ' + ', v('B', `${B}`), '·', v('b', `${b}`), ` = ${l * l} + ${B * b} = ${d2}.`],
          ['AC = ', v('x', `${igualRaiz(d2)} ${u}`), '. (Se comprueba con la altura: Pitágoras en el triángulo que forma AC con la base.)'],
        ],
      };
    },

    'trapecio-perpendiculares'(rng, u) {
      const sub = rng.elegir(['altura', 'area']);
      if (sub === 'altura') {
        let [d1, d2] = rng.elegir(ESCALADAS);
        if (rng.moneda()) [d1, d2] = [d2, d1];
        const S = Math.hypot(d1, d2), alt = d1 * d2 / S;
        const variables = { d1: { nombre: 'diagonal AC', color: 'o' }, d2: { nombre: 'diagonal BD', color: 'i' }, S: { nombre: 'suma de bases', color: 'h' }, x: { nombre: 'altura', color: 'd' } };
        const ctx = rng.moneda();
        return {
          variables, unidad: u, correcta: alt, datos: { sub, d1, d2 },
          enunciado: ctx
            ? ['Una loseta tiene forma de trapecio ABCD, con BC paralelo a AD. Sus diagonales se cortan en ángulo recto y miden AC = ', v('d1', L(d1, u)), ' y BD = ', v('d2', L(d2, u)), '.']
            : ['En el trapecio ABCD (BC ∥ AD), las diagonales son perpendiculares y miden AC = ', v('d1', L(d1, u)), ' y BD = ', v('d2', L(d2, u)), '.'],
          pregunta: ['¿Cuánto mide la altura del trapecio?'],
          errores: [
            h('RM-trapecio-diferencia', Math.abs(d2 - d1), `Restaste las diagonales. La altura sale del triángulo rectángulo que se forma al trasladar una diagonal: catetos multiplicados entre hipotenusa.`),
            h('RM-trapecio-promedio', (d1 + d2) / 2, `Promediaste las diagonales. La altura sale del triángulo rectángulo que se forma al trasladar una diagonal.`),
            pa('GE8-mediana-por-altura', S / 2, `Tomaste la mitad de la hipotenusa (la mediana del triángulo ACE). La altura relativa a la hipotenusa es otra: catetos multiplicados entre hipotenusa.`),
            h('RM-trapecio-raiz-diagonales', sq(d1 * d2), `Usaste h² = AC·BD. En el triángulo rectángulo ACE, la altura al cuadrado es el producto de las proyecciones sobre la hipotenusa, no el de los catetos.`),
            h('RM-trapecio-mitad-de-mas', d1 * d2 / (2 * S), `Dividiste también entre 2, como si calcularas un área. La altura relativa a la hipotenusa es catetos multiplicados entre hipotenusa, sin el /2.`),
            h('RM-trapecio-suma-diagonales', d1 * d2 / (d1 + d2), `Tomaste AD + BC = AC + BD. La suma de bases es la hipotenusa del triángulo de catetos AC y BD: sale con Pitágoras.`),
          ],
          solucion: [
            ['Se traslada BD paralelamente hasta que pase por C: se obtiene CE, con E en la prolongación de AD, CE = BD y DE = BC.'],
            ['El triángulo ACE es rectángulo en C (AC ⊥ CE), con catetos ', v('d1', `${d1}`), ' y ', v('d2', `${d2}`), ' y la hipotenusa AE = AD + BC = ', v('S', `${S}`), ' (Pitágoras).'],
            ['La altura del trapecio es la altura de ACE relativa a la hipotenusa: h = AC·CE/AE = ', `${d1}·${d2}/${S} = `, v('x', L(alt, u)), '.'],
          ],
        };
      }
      const TRI = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25], [15, 20, 25], [10, 24, 26], [12, 16, 20]];
      const [p, q, S] = rng.elegir(TRI);
      const [d1, d2] = rng.moneda() ? [p, q] : [q, p];
      const b = rng.entero(1, Math.floor((S - 1) / 2));
      const area = d1 * d2 / 2;
      const variables = { B: { nombre: 'base AD', color: 'o' }, b: { nombre: 'base BC', color: 'i' }, d1: { nombre: 'diagonal AC', color: 'h' }, x: { nombre: 'área', color: 'd' } };
      const raro = sq(S * S + d1 * d1);
      return {
        variables, unidad: `${u}²`, correcta: area, datos: { sub, B: S - b, b, d1 },
        enunciado: ['En el trapecio ABCD, las bases miden AD = ', v('B', L(S - b, u)), ' y BC = ', v('b', L(b, u)), '. Las diagonales AC y BD son perpendiculares, y AC = ', v('d1', L(d1, u)), '.'],
        pregunta: ['¿Cuál es el área del trapecio?'],
        errores: [
          h('RM-trapecio-sin-mitad', d1 * d2, `Multiplicaste las diagonales y no dividiste entre 2.`),
          h('RM-trapecio-bases-por-diagonales', (S - b) * b / 2, `Usaste AD·BC/2: multiplicaste las bases en vez de las diagonales. Con diagonales perpendiculares, el área es AC·BD/2.`),
          h('RM-trapecio-triangulo-ACD', (S - b) * d1 * d2 / (2 * S), `Ese es el área del triángulo ACD (AD·h/2), una parte del trapecio. Con diagonales perpendiculares, el trapecio entero mide AC·BD/2.`),
          h('RM-trapecio-triangulo-ABC', b * d1 * d2 / (2 * S), `Ese es el área del triángulo ABC (BC·h/2), una parte del trapecio. Con diagonales perpendiculares, el trapecio entero mide AC·BD/2.`),
          pa('GE7-diagonal-como-altura', S * d1 / 2, `Usaste la diagonal AC como altura. AC es inclinada; la altura es perpendicular a las bases.`),
          h('RM-trapecio-diagonales-iguales', d1 * d1 / 2, `Supusiste que las diagonales son iguales. Solo lo son en el trapecio isósceles; BD sale del triángulo rectángulo con hipotenusa AD + BC.`),
          pa('GE11-pitagoras-suma', d1 * raro / 2, `Para BD sumaste los cuadrados en vez de restarlos. La hipotenusa es AD + BC; BD es un cateto.`),
        ],
        solucion: [
          ['Se traslada BD paralelamente hasta C: CE = BD, y AE = AD + BC = ', v('B', `${S - b}`), ' + ', v('b', `${b}`), ` = ${S}. El triángulo ACE es rectángulo en C.`],
          [`BD = CE = √(${S}² − `, v('d1', `${d1}`), `²) = √${S * S - d1 * d1} = ${d2}.`],
          ['Con diagonales perpendiculares, el área es AC·BD/2 = ', `${d1}·${d2}/2 = `, v('x', `${area} ${u}²`), '.'],
        ],
      };
    },
    'figuras-compuestas'(rng, u) {
      const sub = rng.elegir(['cometa', 'isosceles-bisectriz', 'equilatero']);
      if (sub === 'cometa') {
        const [p0, q0, c0] = rng.elegir([[6, 8, 10], [10, 24, 26], [12, 16, 20], [16, 30, 34], [18, 24, 30], [14, 48, 50], [24, 10, 26], [8, 6, 10], [16, 12, 20]]);
        const a = p0, b = q0, c = c0, bm = c / 2;
        const pide = rng.elegir(['perimetro', 'BC']);
        const variables = { a: { nombre: 'AB', color: 'o' }, bm: { nombre: 'BM', color: 'i' }, c: { nombre: 'diagonal AC', color: 'h' }, x: { nombre: pide === 'BC' ? 'BC' : 'perímetro', color: 'd' } };
        const mal = sq(bm * bm - a * a);
        const errores = pide === 'BC' ? [
          h('RM-cometa-mediana-como-diagonal', mal, `Usaste BM como si fuera la diagonal AC. M es el punto medio: AC = 2·BM.`),
          h('RM-cometa-da-AC', c, `Esa es la diagonal AC. BC es un cateto del triángulo ABC.`),
          h('RM-cometa-mediana-por-lado', bm, `Tomaste BC igual a BM. BM es la mediana a la hipotenusa; BC sale de Pitágoras.`),
          pa('GE11-pitagoras-sumando', sq(c * c + a * a), `Sumaste los cuadrados: así se halla una hipotenusa. BC es un cateto: BC² = AC² − AB².`),
        ] : [
          h('RM-cometa-mediana-como-diagonal', 2 * (a + mal), `Usaste BM como si fuera la diagonal AC. M es el punto medio: AC = 2·BM.`),
          h('RM-cometa-medio-perimetro', a + b, `Sumaste solo AB y BC. La cometa tiene cuatro lados: AD = AB y DC = BC.`),
          h('RM-cometa-con-diagonal', 2 * a + b + c, `Contaste la diagonal AC como si fuera un lado. El perímetro solo suma el borde: AB + BC + CD + DA.`),
          h('RM-cometa-mediana-por-lado', 2 * (a + bm), `Tomaste BC igual a BM. BM es la mediana a la hipotenusa; BC sale de Pitágoras.`),
        ];
        return {
          variables, unidad: u, correcta: pide === 'BC' ? b : 2 * (a + b), datos: { sub, a, bm, pide }, errores,
          enunciado: ['Una cometa ABCD tiene una varilla AC que es bisectriz del ángulo BAD, y los ángulos ABC y ADC son rectos. El borde AB mide ', v('a', L(a, u)), '. Si M es el punto medio de la varilla AC, la distancia de B a M es BM = ', v('bm', L(bm, u)), '.'],
          pregunta: [pide === 'BC' ? '¿Cuánto mide el borde BC?' : '¿Cuál es el perímetro de la cometa?'],
          solucion: [
            ['Los triángulos ABC y ADC son congruentes: comparten AC, tienen el ángulo en A partido en dos iguales y un ángulo recto. Así, AD = AB y DC = BC.'],
            ['En el triángulo rectángulo ABC, la mediana a la hipotenusa mide la mitad de la hipotenusa: AC = 2·', v('bm', `${bm}`), ' = ', v('c', `${c}`), '.'],
            ['Pitágoras: BC = √(', `${c}² − `, v('a', `${a}`), `²) = √${c * c - a * a} = ${b}.`],
            pide === 'BC' ? ['BC = ', v('x', L(b, u)), '.'] : ['Perímetro = 2·(AB + BC) = 2·(', `${a} + ${b}) = `, v('x', L(2 * (a + b), u)), '.'],
          ],
        };
      }
      if (sub === 'isosceles-bisectriz') {
        let [a, b] = rng.elegir(ESCALADAS.filter(t => t[2] <= 169));
        if (rng.moneda()) [a, b] = [b, a];
        const c = Math.hypot(a, b), AH = a * a / c, BH = a * b / c, HD = a - AH, HC = c - AH, DC = c - a, BD2 = BH * BH + HD * HD;
        const pide = rng.elegir(['HD', 'BD']);
        const variables = { a: { nombre: 'AB', color: 'o' }, b: { nombre: 'BC', color: 'i' }, ah: { nombre: 'AH', color: 'h' }, x: { nombre: pide, color: 'd' } };
        const errores = pide === 'HD' ? [
          h('RM-bisectriz-da-DC', DC, `Ese es DC, el otro tramo. Se pide HD.`),
          pa('GE8-bisectriz-punto-medio', HC / 2, `Supusiste que la bisectriz BD parte HC por la mitad. La bisectriz divide el lado opuesto en la razón de los lados vecinos (BH : BC), no en dos mitades.`),
          h('RM-bisectriz-da-AH', AH, `Ese es AH, la proyección de AB. Falta usar que AD = AB.`),
          h('RM-bisectriz-da-BH', BH, `Esa es la altura BH, no el tramo HD.`),
          h('RM-bisectriz-resta-altura', Math.min(Math.abs(a - BH), Math.abs(b - BH)), `Restaste un cateto menos la altura BH, como si fueran segmentos de una misma recta. HD sale de AD − AH, con AD = AB.`),
        ] : [
          h('RM-bisectriz-da-BH', BH, `Esa es la altura BH. La cerca BD va inclinada: BD² = BH² + HD².`),
          h('RM-isosceles-al-reves', a, `El triángulo isósceles es ABD con AB = AD, no con BD = AB.`),
          pa('GE8-bisectriz-punto-medio', sq(BH * BH + HC * HC / 4), `Supusiste que D es el punto medio de HC. La bisectriz no parte el lado opuesto por la mitad.`),
          h('RM-bisectriz-da-DC', sq(BH * BH + DC * DC), `Usaste DC en vez de HD como cateto del triángulo BHD.`),
        ];
        return {
          variables, unidad: u, correcta: pide === 'HD' ? HD : sq(BD2), datos: { sub, a, b, pide }, errores,
          enunciado: ['Un terreno tiene forma de triángulo ABC con el ángulo recto en la esquina B; AB = ', v('a', L(a, u)), ' y BC = ', v('b', L(b, u)), '. Desde B salen dos cercas rectas hasta el lindero AC: BH, perpendicular a AC, y BD (con D entre H y C), que es bisectriz del ángulo HBC.'],
          pregunta: [pide === 'HD' ? '¿Cuánto mide el tramo HD del lindero AC?' : '¿Cuánto mide la cerca BD?'],
          solucion: [
            ['∠ABD = 90° − ∠DBC y ∠ADB = 90° − ∠HBD (en el triángulo BHD). Como ∠HBD = ∠DBC (bisectriz), ∠ABD = ∠ADB: el triángulo ABD es isósceles y AD = AB = ', v('a', `${a}`), '.'],
            [`Hipotenusa: AC = √(${a}² + ${b}²) = ${c}. Relaciones métricas: AB² = AC·AH → `, v('ah', `AH = ${a * a}/${c} = ${AH}`), ` y BH = AB·BC/AC = ${BH}.`],
            ['HD = AD − AH = ', `${a} − ${AH} = ${HD}.`],
            pide === 'HD' ? ['HD = ', v('x', L(HD, u)), '.'] : ['BD² = BH² + HD² = ', `${BH * BH} + ${HD * HD} = ${BD2}, así que BD = `, v('x', `${igualRaiz(BD2)} ${u}`), '.'],
          ],
        };
      }
      const s = rng.elegir([2, 4, 6, 8, 10, 12, 14, 16]);
      const variables = { s: { nombre: 'AB = AD', color: 'o' }, dc: { nombre: 'DC', color: 'i' }, ae: { nombre: 'AE', color: 'h' }, x: { nombre: 'AC', color: 'd' } };
      const ctx = rng.moneda();
      return {
        variables, unidad: u, correcta: s * sq(7), datos: { sub, s },
        enunciado: [ctx ? 'Un terreno tiene forma de cuadrilátero ABCD, con ' : 'En el cuadrilátero ABCD, ', 'AB = AD = ', v('s', L(s, u)), ' y el ángulo BAD de 60°. El ángulo ADC mide 150° y el ángulo BCD mide 30°.', ctx ? ' Se quiere abrir un camino recto de A a C.' : ''],
        pregunta: [ctx ? '¿Cuánto mide el camino AC?' : '¿Cuánto mide la diagonal AC?'],
        errores: [
          pa('GE11-pitagoras-sin-angulo-recto', 2 * s, `Usaste Pitágoras con AD y DC, pero el ángulo ADC mide 150°, no 90°. El ángulo recto está en BDC.`),
          h('RM-equilatero-AD-mas-BC', 3 * s, `Sumaste AD + BC (${s} + ${2 * s}). AC no sigue el borde: es la diagonal, y sale de Pitágoras en el triángulo ACE.`),
          h('RM-equilatero-da-DC', s * sq(3), `Ese es DC. Falta llevarlo hasta A con el triángulo rectángulo de 30°.`),
          h('RM-proyeccion-al-reves', s, `Pusiste la proyección de DC hacia el lado de A (AE = AD − DE). El ángulo ADC es obtuso: C se proyecta sobre la prolongación de AD, más allá de D.`),
          h('RM-proyeccion-como-lado', 5 * s / 2, `Ese es AE, la proyección de AC sobre la recta AD. Falta Pitágoras con CE.`),
        ],
        solucion: [
          ['AB = AD y ∠BAD = 60°: el triángulo ABD es equilátero, BD = ', v('s', `${s}`), ' y ∠ADB = 60°. Entonces ∠BDC = 150° − 60° = 90°.'],
          ['En el triángulo rectángulo BDC, con ∠C = 30° (notable de 30° y 60°): ', v('dc', `DC = ${s}√3`), '.'],
          [`Se baja CE ⊥ a la prolongación de AD. ∠CDE = 180° − 150° = 30°, así que CE = DC/2 = ${s === 2 ? '' : s / 2}√3 y DE = DC·√3/2 = ${3 * s / 2}; `, v('ae', `AE = ${s} + ${3 * s / 2} = ${5 * s / 2}`), '.'],
          ['AC² = AE² + CE² = ', `${25 * s * s / 4} + ${3 * s * s / 4} = ${7 * s * s}, así que AC = `, v('x', `${R(s * sq(7))} ${u}`), '.'],
        ],
      };
    },
  };

  return { id: ID, titulo: 'Relaciones métricas en triángulos y cuadriláteros', generar, calc };
});
