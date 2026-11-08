/*
 * Generador: relaciones métricas en la circunferencia (geometria.circunferencia y
 * geometria.relaciones-metricas). Formato "predicciones" (docs/arquitectura.md).
 * Funciona en el navegador (window.Generadores['geo-circunferencia-metrica']) y en Node (require).
 *
 * Tipos y campos de _datos (longitudes en la unidad u del enunciado, 'm' o 'cm'):
 *   tangente   P es exterior; PT es tangente en T; una secante desde P corta la circunferencia en
 *              A y B, con A entre P y B.
 *       sub 'pt':      dados PA = a y AB = c, se pide PT.                          { a, c }
 *       sub 'secante': dados PT = t y PA = a, se pide AB.                          { t, a }
 *       sub 'razon':   dados PT = t (se guarda t2 = PT²) y la razón PA : AB = p : q, se pide AB.
 *                                                                                   { t2, p, q }
 *       sub 'centro':  la secante pasa por el centro; dados PT = t y PA = a, se pide el radio.
 *                                                                                   { t, a }
 *       sub 'semicirculo': rectángulo ABCD con AB = w (base) y BC = h; una semicircunferencia con
 *                      el diámetro sobre AB es tangente a BC (en B) y a la diagonal AC. Se pide la
 *                      longitud del arco de la semicircunferencia (π·r, con π indicado). { w, h }
 *   secantes   Desde P exterior, dos secantes: P, A, B y P, C, D (A y C son los cortes más
 *              cercanos a P). Dados PA, AB y PC, se pide CD.                       { PA, AB, PC }
 *   cuerdas    Las cuerdas AB y CD se cortan en E.
 *       sub 'cuarto':  dados AE, EB y CE, se pide ED.                              { AE, EB, CE }
 *       sub 'partes':  dados AB = L, CE y ED, y que AE > EB, se pide AE.           { L, CE, ED }
 *   tangentes-iguales
 *       sub 'incirculo': triángulo de lados BC = a, CA = b, AB = c; la circunferencia inscrita toca
 *                      BC en D. Se pide BD.                                        { a, b, c }
 *       sub 'esquina': cuadrado ABCD de lado L con la circunferencia inscrita; una recta tangente a
 *                      ella corta AB en M y AD en N, cerca de A. Dados L y AM, se pide MN. { L, AM }
 *   pitot
 *       sub 'general': cuadrilátero ABCD circunscrito; dados AB, BC y CD, se pide DA. { AB, BC, CD }
 *       sub 'isosceles': trapecio isósceles circunscrito de bases B y b; se pide el radio. { B, b }
 *       sub 'rectangulo': trapecio rectángulo ABCD (BC ∥ AD, rectos en A y B) circunscrito a una
 *                      circunferencia de radio r, con ∠ADC = ang (53 o 37, cos 37° = 4/5); se pide
 *                      la base mayor AD.                                           { r, ang }
 *   poncelet   Triángulo rectángulo de catetos a, b e hipotenusa c; r = radio de la inscrita.
 *       sub 'radio':     dados a y b, se pide r.                                   { a, b }
 *       sub 'perimetro': dados c y r, se pide el perímetro.                        { c, r }
 *   arcos-cuerdas  Circunferencia de radio R; B es el punto medio del arco menor AC.
 *       sub 'cuerda':  dados R y AC, se pide AB.                                   { R, AC }
 *       sub 'al-reves': dados R y AB (= BC), se pide AC.                           { R, AB2 } (AB2 = AB²)
 *   inscriptible  Cuadrado ABCD de lado L; M en BC con BM = m; N en CD con CN = m; P = AM ∩ BN.
 *                 pide 'MPC' o 'NPC': se pide ese ángulo (en grados; puede ser la mitad de un
 *                 notable, escrita «53°/2»).                                       { L, m, pide }
 *
 * Errores: GE11 (parcial) y GE15, GE19 (hipótesis) de docs/investigacion/geometria-ideas-erroneas.md;
 * los CM-* son hipótesis nuestras.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'geo-circunferencia-metrica';
  const GE = 'docs/investigacion/geometria-ideas-erroneas.md';
  const h = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const pa = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'parcial', fuente: GE });
  const v = P.v, R = P.radical, f = x => P.formatear(x, 2);
  const sq = Math.sqrt;
  const esCuadrado = n => Number.isInteger(n) && n > 0 && Math.round(sq(n)) ** 2 === n;
  const limpio = x => {
    if (!Number.isFinite(x) || x <= 1e-9 || x >= 1e5) return false;
    const t = R(x), r = t.match(/√(\d+)/);
    return !/[,/]/.test(t) && (!r || Number(r[1]) < 1000);
  };
  const igualRaiz = n2 => { const t = R(sq(n2)); return t === `√${n2}` ? t : `√${n2} = ${t}`; };
  const L = (x, u) => `${R(x)} ${u}`;
  // Ángulo: entero «37°» o mitad de un entero «53°/2».
  const grados = x => Number.isInteger(x) ? `${x}°` : `${Math.round(2 * x)}°/2`;
  const esAngulo = x => Number.isFinite(x) && x > 0 && x < 180 && Number.isInteger(Math.round(2 * x * 1e6) / 1e6);

  // ---------- Cálculos puros (los usa papel.json) ----------
  const calc = {
    tangente: (pa_, ab) => sq(pa_ * (pa_ + ab)),                 // PT con PA y AB
    cuerdaDesdeTangente: (pt, pa_) => pt * pt / pa_ - pa_,       // AB con PT y PA
    radioDesdeTangente: (pt, pa_) => (pt * pt - pa_ * pa_) / (2 * pa_), // secante por el centro
    radioSemicirculo: (w, hh) => (w * w - (Math.hypot(w, hh) - hh) ** 2) / (2 * w),
    secantes: (pa_, ab, pc) => pa_ * (pa_ + ab) / pc - pc,       // CD
    cuerdas: (ae, eb, ce) => ae * eb / ce,                       // ED
    parteMayor: (l, ce, ed) => (l + sq(l * l - 4 * ce * ed)) / 2,
    tangenciaIncirculo: (a, b, c) => (a + b + c) / 2 - b,        // BD
    esquinaCuadrado: (l, am) => { const p = l - am; return (p * p + am * am) / (2 * p); },
    pitot: (ab, bc, cd) => ab + cd - bc,
    radioTrapecioIsosceles: (B, b) => sq(B * b) / 2,
    baseMayorTrapecioRectangulo: (r, ang) => { const [s, c] = ang === 53 ? [0.8, 0.6] : [0.6, 0.8]; const lado = 2 * r / s, dif = 2 * r * c / s; return (2 * r + lado + dif) / 2; },
    poncelet: (a, b) => (a + b - Math.hypot(a, b)) / 2,
    perimetroPoncelet: (c, r) => 2 * c + 2 * r,
    cuerdaArcoMitad: (r, ac) => sq(2 * r * (r - sq(r * r - ac * ac / 4))),
    anguloInscriptible: (l, m) => { const t = (l - m) / m; const T = { 1: 45, 2: 63.5, 0.5: 26.5, 3: 71.5 }; for (const [k, a] of Object.entries(T)) if (Math.abs(t - k) < 1e-9) return a; if (Math.abs(t - 1 / 3) < 1e-9) return 18.5; if (Math.abs(t - 4 / 3) < 1e-9) return 53; if (Math.abs(t - 0.75) < 1e-9) return 37; return NaN; },
  };

  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [6, 8, 10], [9, 12, 15], [12, 16, 20]];

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(TIPOS);
    for (let intento = 0; intento < 200; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  const TIPOS = ['tangente', 'secantes', 'cuerdas', 'tangentes-iguales', 'pitot', 'poncelet', 'arcos-cuerdas', 'inscriptible'];

  function construir(rng, semilla, tipo) {
    const u = rng.elegir(['m', 'cm']);
    const r = CONSTRUCTORES[tipo](rng, u);
    if (!r) return null;
    let forma, texto;
    if (r.angular) { forma = esAngulo; texto = grados; }
    else if (r.pi) { forma = x => P.pi(x, '', 12) !== null; texto = x => P.pi(x, r.unidad); }
    else { forma = limpio; texto = x => `${R(x)} ${r.unidad}`; }
    if (!forma(r.correcta)) return null;
    const errores = r.errores.filter(e => forma(e.valor));
    const alternativas = P.armar({ correcta: r.correcta, errores, rng, texto });
    return {
      id: `${ID}#${semilla}`, variables: r.variables, enunciado: r.enunciado, pregunta: r.pregunta, datos: '',
      alternativas, solucion: r.solucion,
      respuesta: { valor: r.correcta, unidad: r.angular ? '°' : r.unidad },
      _datos: { tipo, ...r.datos },
    };
  }

  const SECANTE = 'Desde un punto P exterior a una circunferencia se traza la tangente PT (T es el punto de tangencia) y una secante que corta a la circunferencia en A y en B, con A entre P y B.';

  const CONSTRUCTORES = {
    tangente(rng, u) {
      const sub = rng.elegir(['pt', 'secante', 'razon', 'centro', 'semicirculo']);
      if (sub === 'pt') {
        const a = rng.entero(2, 12), c = rng.entero(2, 20);
        const t2 = a * (a + c);
        const variables = { a: { nombre: 'PA', color: 'o' }, c: { nombre: 'cuerda AB', color: 'i' }, b: { nombre: 'PB', color: 'h' }, x: { nombre: 'tangente PT', color: 'd' } };
        const ctx = rng.moneda();
        return {
          variables, unidad: u, correcta: sq(t2), datos: { sub, a, c },
          enunciado: ctx
            ? ['Una plaza tiene un jardín circular. Desde la caseta P sale un camino recto que entra al jardín en A y sale en B, con PA = ', v('a', L(a, u)), ' y AB = ', v('c', L(c, u)), '. Otro camino recto PT, también desde P, solo roza el jardín en el punto T (es tangente).']
            : [SECANTE, ' PA = ', v('a', L(a, u)), ' y AB = ', v('c', L(c, u)), '.'],
          pregunta: [ctx ? '¿Cuánto mide el camino PT?' : '¿Cuánto mide PT?'],
          errores: [
            h('CM-tangente-cuerda', sq(a * c), `Multiplicaste PA por la cuerda AB. El teorema de la tangente usa la secante entera: PT² = PA·PB.`),
            h('CM-tangente-parte-interior', sq(c * (a + c)), `Multiplicaste PB por AB. Va la parte exterior por la secante entera: PT² = PA·PB.`),
            h('CM-tangente-promedio', (a + a + c) / 2, `Promediaste PA y PB. PT es la media geométrica de PA y PB (PT² = PA·PB), no su promedio.`),
            h('CM-sin-raiz', t2, `Calculaste PT² = ${t2} y olvidaste sacar la raíz cuadrada.`),
          ],
          solucion: [
            ['Teorema de la tangente: PT² = PA·PB, con PB la secante entera.'],
            ['PB = ', v('a', `${a}`), ' + ', v('c', `${c}`), ' = ', v('b', `${a + c}`), '.'],
            [`PT² = ${a}·${a + c} = ${t2}, así que PT = `, v('x', `${igualRaiz(t2)} ${u}`), '.'],
          ],
        };
      }
      if (sub === 'secante') {
        let t, a, pb;
        for (;;) { t = rng.entero(4, 16); a = rng.entero(2, t - 1); pb = t * t / a; if (Number.isInteger(pb) && pb - a >= 2 && pb <= 60) break; }
        const ab = pb - a;
        const variables = { t: { nombre: 'tangente PT', color: 'o' }, a: { nombre: 'PA', color: 'i' }, b: { nombre: 'PB', color: 'h' }, x: { nombre: 'cuerda AB', color: 'd' } };
        return {
          variables, unidad: u, correcta: ab, datos: { sub, t, a },
          enunciado: [SECANTE, ' PT = ', v('t', L(t, u)), ' y PA = ', v('a', L(a, u)), '.'],
          pregunta: ['¿Cuánto mide la cuerda AB?'],
          errores: [
            h('CM-secante-da-PB', pb, `Ese es PB, la secante entera. Se pide la cuerda: AB = PB − PA.`),
            h('CM-tangente-lineal', t - a, `Restaste PT − PA sin cuadrados. La relación es PT² = PA·PB.`),
            pa('GE11-pitagoras-sin-angulo-recto', sq(t * t - a * a), `Usaste Pitágoras en el triángulo PTA, pero ese triángulo no tiene ángulo recto en A.`),
            h('CM-secante-suma', pb + a, `Sumaste PA a PB. La cuerda es lo que queda de PB al quitarle PA.`),
            h('CM-tangente-media', (t * t / a + a) / 2 - a, `Tomaste PT como el promedio de PA y PB. PT es su media geométrica: PT² = PA·PB.`),
          ],
          solucion: [
            ['Teorema de la tangente: PT² = PA·PB.'],
            [v('t', `${t}`), '² = ', v('a', `${a}`), '·PB, así que PB = ', `${t * t}/${a} = `, v('b', `${pb}`), '.'],
            ['AB = PB − PA = ', `${pb} − ${a} = `, v('x', L(ab, u)), '.'],
          ],
        };
      }
      if (sub === 'razon') {
        const [p, q, k] = rng.elegir([[1, 3, 2], [4, 5, 6], [1, 8, 3], [1, 15, 4], [9, 16, 15], [4, 21, 10]]);
        const s = rng.elegir(k > 6 ? [1] : [1, 2, 3]);
        const t = k * s, PA = p * s, AB = q * s, PB = PA + AB;
        const variables = { t: { nombre: 'tangente PT', color: 'o' }, a: { nombre: 'PA', color: 'i' }, c: { nombre: 'cuerda AB', color: 'd' }, k: { nombre: 'parte que se repite', color: 'h' } };
        const ctx = rng.moneda();
        return {
          variables, unidad: u, correcta: AB, datos: { sub, t2: t * t, p, q },
          enunciado: ctx
            ? ['Una varilla PT se apoya tangente a un tubo circular en T. Desde el mismo extremo P, otra varilla recta atraviesa el tubo: entra en A y sale en B, con A entre P y B. La varilla tangente mide PT = ', v('t', L(t, u)), ` y los tramos cumplen PA : AB = ${p} : ${q}.`]
            : [SECANTE, ' PT = ', v('t', L(t, u)), ` y PA : AB = ${p} : ${q}.`],
          pregunta: ['¿Cuánto mide AB?'],
          errores: [
            h('CM-razon-da-PA', PA, `Ese es PA. Se pide la cuerda AB.`),
            h('CM-secante-da-PB', PB, `Ese es PB, la secante entera. Se pide la cuerda: AB = PB − PA.`),
            h('CM-tangente-cuerda', q * t / sq(p * q), `Usaste PT² = PA·AB (la cuerda). El teorema usa la secante entera: PT² = PA·PB.`),
            h('CM-razon-reparte-tangente', t * q / (p + q), `Repartiste PT en la razón ${p} : ${q}. PT no está sobre la secante; la razón es entre PA y AB.`),
            h('CM-razon-lineal', q * t / p, `Supusiste PA = PT. La tangente es más larga que PA: PT² = PA·PB.`),
          ],
          solucion: [
            [`Sea PA = ${p}k y AB = ${q}k; entonces PB = ${p + q}k.`],
            ['Teorema de la tangente: PT² = PA·PB → ', v('t', `${t}`), `² = ${p}k·${p + q}k = ${p * (p + q)}k².`],
            [`k² = ${t * t}/${p * (p + q)} = ${s * s}, así que `, v('k', `k = ${s}`), ` y PA = `, v('a', `${PA}`), '.'],
            ['AB = ', `${q}·${s} = `, v('c', L(AB, u)), '.'],
          ],
        };
      }
      if (sub === 'centro') {
        let t, a, r;
        for (;;) { t = rng.entero(4, 20); a = rng.entero(1, t - 1); r = (t * t - a * a) / (2 * a); if (Number.isInteger(r) && r >= 2 && r <= 40) break; }
        const variables = { t: { nombre: 'tangente PT', color: 'o' }, a: { nombre: 'PA', color: 'i' }, b: { nombre: 'PB', color: 'h' }, x: { nombre: 'radio', color: 'd' } };
        const ctx = rng.moneda();
        return {
          variables, unidad: u, correcta: r, datos: { sub, t, a },
          enunciado: ctx
            ? ['Un dron P vuela a la altura de una antena parabólica circular, vista de perfil como una circunferencia de centro O. La línea de vista PT es tangente a la circunferencia en T y mide ', v('t', L(t, u)), '. La recta PO corta la circunferencia primero en A, con PA = ', v('a', L(a, u)), '.']
            : ['Desde un punto P exterior a una circunferencia de centro O se traza la tangente PT, con PT = ', v('t', L(t, u)), '. La recta PO corta a la circunferencia en A y en B (A entre P y O), con PA = ', v('a', L(a, u)), '.'],
          pregunta: ['¿Cuánto mide el radio de la circunferencia?'],
          errores: [
            h('GE19-diametro-por-radio', 2 * r, `Ese es el diámetro AB. El radio es la mitad.`),
            h('CM-tangente-cuerda', t * t / (2 * a), `Usaste PT² = PA·AB (con AB el diámetro). El teorema usa la secante entera: PT² = PA·PB = PA·(PA + 2r).`),
            h('CM-tangente-lineal', t - a, `Restaste PT − PA. La relación es entre cuadrados: PT² = PA·(PA + 2r).`),
            h('CM-centro-da-PB', a + 2 * r, `Ese es PB, la secante entera (PA + 2r). Se pide el radio.`),
            h('CM-centro-da-PO', a + r, `Ese es PO, la distancia de P al centro. Se pide el radio.`),
          ].filter((e, i, arr) => arr.findIndex(o => o.valor === e.valor) === i),
          solucion: [
            ['La secante pasa por el centro: PB = PA + AB = PA + 2r.'],
            ['Teorema de la tangente: PT² = PA·PB → ', v('t', `${t}`), '² = ', v('a', `${a}`), `·(${a} + 2r).`],
            [`${t * t} = ${a * a} + ${2 * a}r → r = ${t * t - a * a}/${2 * a} = `, v('x', L(r, u)), '. (Comprobación: PO = ', `${a + r}`, ' y PO² = PT² + r² = ', `${t * t} + ${r * r} = ${(a + r) ** 2}.)`],
          ],
        };
      }
      // semicirculo: rectángulo 8k × 6k; diagonal 10k; r = 3k.
      const k = rng.elegir([1, 2, 3, 4]);
      const w = 8 * k, hh = 6 * k, dg = 10 * k, r = 3 * k;
      const variables = { w: { nombre: 'base AB', color: 'o' }, hh: { nombre: 'lado BC', color: 'i' }, t: { nombre: 'tangente AT', color: 'h' }, x: { nombre: 'arco de la semicircunferencia', color: 'd' } };
      const rMal = (w * w - hh * hh) / (2 * w);
      return {
        variables, unidad: u, pi: true, correcta: Math.PI * r, datos: { sub, w, h: hh },
        enunciado: ['En el rectángulo ABCD, AB = ', v('w', L(w, u)), ' y BC = ', v('hh', L(hh, u)), '. Una semicircunferencia tiene su diámetro sobre AB, es tangente al lado BC en B y es tangente a la diagonal AC.'],
        pregunta: ['¿Cuánto mide el arco de la semicircunferencia?'],
        errores: [
          h('GE19-circunferencia-entera', 2 * Math.PI * r, `Usaste 2πr, la circunferencia entera. El arco de una semicircunferencia mide πr.`),
          h('GE19-area-por-longitud', Math.PI * r * r / 2, `Calculaste πr²/2, el área del semicírculo. Se pide la longitud del arco: πr.`),
          h('CM-tangentes-mal-tomadas', Math.PI * rMal, `Tomaste AT = BC. La tangente igual a CB es CT, la que sale de C; desde A queda AT = AC − CB.`),
          h('CM-semicirculo-mitad-de-AB', Math.PI * w / 4, `Supusiste que el diámetro es la mitad de AB. El radio sale de las tangentes: desde C, CT = CB; desde A, AT² = AE·AB.`),
        ],
        solucion: [
          ['Diagonal: AC = √(', v('w', `${w}`), '² + ', v('hh', `${hh}`), `²) = ${dg}.`],
          ['Desde C, las tangentes CB y CT miden lo mismo: CT = ', v('hh', `${hh}`), '. Entonces ', v('t', `AT = ${dg} − ${hh} = ${dg - hh}`), '.'],
          [`Desde A, la recta AB pasa por el centro y corta la semicircunferencia en E (AE = ${w} − 2r) y en B. Teorema de la tangente: AT² = AE·AB → ${(dg - hh) ** 2} = (${w} − 2r)·${w}.`],
          [`${w} − 2r = ${(dg - hh) ** 2 / w}, así que r = ${r}. Arco = πr = `, v('x', P.pi(Math.PI * r, u)), '.'],
        ],
      };
    },

    secantes(rng, u) {
      let PA, AB, PC, PB, PD;
      for (let i = 0; ; i++) {
        PA = rng.entero(2, 12); AB = rng.entero(2, 16); PC = rng.entero(2, 15); PB = PA + AB; PD = PA * PB / PC;
        if (!Number.isInteger(PD) || PD - PC < 2 || PC === PA || PD > 60) continue;
        if (i < 50 && !Number.isInteger(PA * AB / PC)) continue; // mejor si la trampa también da entera
        break;
      }
      const CD = PD - PC;
      const variables = { PA: { nombre: 'PA', color: 'o' }, AB: { nombre: 'AB', color: 'i' }, PC: { nombre: 'PC', color: 'h' }, x: { nombre: 'CD', color: 'd' } };
      const ctx = rng.moneda();
      return {
        variables, unidad: u, correcta: CD, datos: { PA, AB, PC },
        enunciado: ctx
          ? ['Desde un poste P, fuera de una pista circular, salen dos cables rectos que atraviesan la pista. El primero la corta en A y en B (A más cerca de P), con PA = ', v('PA', L(PA, u)), ' y AB = ', v('AB', L(AB, u)), '. El segundo la corta en C y en D (C más cerca de P), con PC = ', v('PC', L(PC, u)), '.']
          : ['Desde un punto P exterior a una circunferencia se trazan dos secantes: una corta a la circunferencia en A y B, y la otra en C y D (A y C son los puntos más cercanos a P). PA = ', v('PA', L(PA, u)), ', AB = ', v('AB', L(AB, u)), ' y PC = ', v('PC', L(PC, u)), '.'],
        pregunta: [ctx ? '¿Cuánto mide el tramo CD del segundo cable dentro de la pista?' : '¿Cuánto mide CD?'],
        errores: [
          h('CM-secantes-partes-interiores', PA * AB / PC, `Usaste PA·AB = PC·CD. Se multiplica la parte exterior por la secante entera: PA·PB = PC·PD.`),
          h('CM-secante-da-PD', PD, `Ese es PD, la secante entera. Se pide CD = PD − PC.`),
          h('CM-secantes-proporcion', AB * PC / PA, `Planteaste una proporción directa (PA : AB = PC : CD). La relación es un producto: PA·PB = PC·PD.`),
          h('CM-secantes-mezcla', PA * AB / PC - PC, `Mezclaste: PA·AB = PC·PD. A cada lado va la parte exterior por su secante entera.`),
          h('CM-secantes-suma', PB - PC, `Igualaste las secantes enteras (PB = PD). Lo que se conserva es el producto PA·PB = PC·PD.`),
        ],
        solucion: [
          ['Teorema de las secantes: PA·PB = PC·PD (parte exterior por secante entera, en las dos).'],
          ['PB = ', v('PA', `${PA}`), ' + ', v('AB', `${AB}`), ` = ${PB}, así que ${PA}·${PB} = `, v('PC', `${PC}`), `·PD → PD = ${PA * PB}/${PC} = ${PD}.`],
          [`CD = PD − PC = ${PD} − ${PC} = `, v('x', L(CD, u)), '.'],
        ],
      };
    },

    cuerdas(rng, u) {
      const sub = rng.elegir(['cuarto', 'partes']);
      if (sub === 'cuarto') {
        let AE, EB, CE, ED;
        for (;;) { AE = rng.entero(2, 15); EB = rng.entero(2, 15); CE = rng.entero(2, 15); ED = AE * EB / CE; if (Number.isInteger(ED) && CE !== AE && CE !== EB && ED <= 40) break; }
        const variables = { AE: { nombre: 'AE', color: 'o' }, EB: { nombre: 'EB', color: 'i' }, CE: { nombre: 'CE', color: 'h' }, x: { nombre: 'ED', color: 'd' } };
        const ctx = rng.moneda();
        return {
          variables, unidad: u, correcta: ED, datos: { sub, AE, EB, CE },
          enunciado: ctx
            ? ['En una ventana redonda se colocan dos listones rectos que van de borde a borde, AB y CD, y se cruzan en E. AE = ', v('AE', L(AE, u)), ', EB = ', v('EB', L(EB, u)), ' y CE = ', v('CE', L(CE, u)), '.']
            : ['En una circunferencia, las cuerdas AB y CD se cortan en el punto E. AE = ', v('AE', L(AE, u)), ', EB = ', v('EB', L(EB, u)), ' y CE = ', v('CE', L(CE, u)), '.'],
          pregunta: ['¿Cuánto mide ED?'],
          errores: [
            h('CM-cuerdas-sumas', AE + EB - CE, `Igualaste las cuerdas (AE + EB = CE + ED). Lo que se conserva es el producto de los trozos: AE·EB = CE·ED.`),
            h('CM-cuerdas-proporcion', CE * EB / AE, `Planteaste AE : EB = CE : ED. La relación correcta es AE·EB = CE·ED.`),
            h('CM-cuerdas-cuerda-entera', AE * (AE + EB) / CE, `Usaste la cuerda entera AB, como en el teorema de las secantes. Con las cuerdas que se cortan dentro, van los dos trozos: AE·EB = CE·ED.`),
            h('CM-cuerdas-sin-dividir', AE * EB, `Calculaste AE·EB y no dividiste entre CE.`),
          ],
          solucion: [
            ['Teorema de las cuerdas: si dos cuerdas se cortan, el producto de los trozos de una es igual al de la otra: AE·EB = CE·ED.'],
            [v('AE', `${AE}`), '·', v('EB', `${EB}`), ' = ', v('CE', `${CE}`), `·ED → ED = ${AE * EB}/${CE} = `, v('x', L(ED, u)), '.'],
          ],
        };
      }
      let x, y, CE, ED;
      for (;;) {
        x = rng.entero(3, 20); y = rng.entero(1, x - 1);
        const pr = x * y;
        const divs = []; for (let d = 2; d * d < pr; d++) if (pr % d === 0 && d !== y && pr / d !== x) divs.push(d);
        if (!divs.length) continue;
        CE = rng.elegir(divs); ED = pr / CE;
        if (rng.moneda()) [CE, ED] = [ED, CE];
        break;
      }
      const Lc = x + y;
      const variables = { L: { nombre: 'cuerda AB', color: 'o' }, CE: { nombre: 'CE', color: 'i' }, ED: { nombre: 'ED', color: 'h' }, x: { nombre: 'AE', color: 'd' } };
      return {
        variables, unidad: u, correcta: x, datos: { sub, L: Lc, CE, ED },
        enunciado: ['En una circunferencia, las cuerdas AB y CD se cortan en E. La cuerda AB mide ', v('L', L(Lc, u)), ', CE = ', v('CE', L(CE, u)), ' y ED = ', v('ED', L(ED, u)), '. Además, AE es mayor que EB.'],
        pregunta: ['¿Cuánto mide AE?'],
        errores: [
          h('CM-cuerdas-otra-raiz', y, `Esa es la otra raíz de la ecuación: corresponde a EB, el trozo menor. Se pide AE, que es el mayor.`),
          h('CM-cuerdas-punto-medio', Lc / 2, `Supusiste que E es el punto medio de AB. No lo es: los trozos salen de AE·EB = CE·ED.`),
          h('CM-cuerdas-proporcion', Lc * Math.max(CE, ED) / (CE + ED), `Repartiste AB en la razón CE : ED. Los trozos de AB no son proporcionales a los de CD; se conserva el producto.`),
          h('CM-cuerdas-sumas', CE + ED - y, `Igualaste las cuerdas enteras (AB = CD). Lo que se conserva es el producto de los trozos.`),
        ],
        solucion: [
          [`Sea AE = x; entonces EB = ${Lc} − x.`],
          ['Teorema de las cuerdas: AE·EB = CE·ED → x(', v('L', `${Lc}`), ' − x) = ', v('CE', `${CE}`), '·', v('ED', `${ED}`), ` = ${CE * ED}.`],
          [`x² − ${Lc}x + ${CE * ED} = 0 → (x − ${x})(x − ${y}) = 0: x = ${x} o x = ${y}.`],
          ['Como AE > EB, AE = ', v('x', L(x, u)), ` y EB = ${y} ${u}.`],
        ],
      };
    },

    'tangentes-iguales'(rng, u) {
      const sub = rng.elegir(['incirculo', 'esquina']);
      if (sub === 'incirculo') {
        let a, b, c;
        for (;;) {
          a = rng.entero(5, 20); b = rng.entero(5, 20); c = rng.entero(5, 20);
          if ((a + b + c) % 2 || a >= b + c || b >= a + c || c >= a + b || new Set([a, b, c]).size < 3) continue;
          break;
        }
        const s = (a + b + c) / 2, BD = s - b;
        const variables = { a: { nombre: 'lado BC', color: 'o' }, b: { nombre: 'lado CA', color: 'i' }, c: { nombre: 'lado AB', color: 'h' }, x: { nombre: 'BD', color: 'd' } };
        const ctx = rng.moneda();
        return {
          variables, unidad: u, correcta: BD, datos: { sub, a, b, c },
          enunciado: ctx
            ? ['Un banderín triangular ABC tiene bordes BC = ', v('a', L(a, u)), ', CA = ', v('b', L(b, u)), ' y AB = ', v('c', L(c, u)), '. Tiene cosido un círculo que toca los tres bordes; toca el borde BC en el punto D.']
            : ['En el triángulo ABC, BC = ', v('a', L(a, u)), ', CA = ', v('b', L(b, u)), ' y AB = ', v('c', L(c, u)), '. La circunferencia inscrita es tangente a BC en D.'],
          pregunta: ['¿Cuánto mide BD?'],
          errores: [
            h('CM-tangencia-punto-medio', a / 2, `Supusiste que D es el punto medio de BC. Solo pasa si AB = AC.`),
            h('CM-tangencia-intercambia', s - c, `Ese es CD, el otro trozo de BC. Desde B, las dos tangentes miden p − CA.`),
            h('CM-tangencia-otro-vertice', s - a, `Esa es la tangente desde A (p − BC). Se pide la que sale de B.`),
            h('CM-tangencia-semiperimetro', s, `Ese es el semiperímetro p. Falta restarle el lado opuesto a B.`),
          ],
          solucion: [
            ['Desde cada vértice, las dos tangentes a la circunferencia miden lo mismo: x desde A, y desde B, z desde C.'],
            ['Así, AB = x + y, BC = y + z y CA = z + x; sumando, x + y + z = p, el semiperímetro: p = (', v('a', `${a}`), ' + ', v('b', `${b}`), ' + ', v('c', `${c}`), `)/2 = ${s}.`],
            ['BD = y = p − CA = ', `${s} − `, v('b', `${b}`), ' = ', v('x', L(BD, u)), '.'],
          ],
        };
      }
      const [p0, q0, r0] = rng.elegir([[3, 4, 5], [5, 12, 13], [8, 15, 17]]);
      const k = p0 === 3 ? rng.elegir([1, 2, 3]) : 1;
      let [AM, AN] = [p0 * k, q0 * k];
      if (rng.moneda()) [AM, AN] = [AN, AM];
      const MN = r0 * k, Ld = (p0 + q0 + r0) * k;
      const variables = { L: { nombre: 'lado del cuadrado', color: 'o' }, AM: { nombre: 'AM', color: 'i' }, AN: { nombre: 'AN', color: 'h' }, x: { nombre: 'MN', color: 'd' } };
      const ctx = rng.moneda();
      const pp = Ld - AM;
      return {
        variables, unidad: u, correcta: MN, datos: { sub, L: Ld, AM },
        enunciado: ctx
          ? ['Una mesa cuadrada ABCD mide ', v('L', L(Ld, u)), ' de lado y tiene pintado un círculo que toca los cuatro bordes. Una regla recta, apoyada en la mesa, toca el círculo en un solo punto y corta la esquina A: cruza el borde AB en M y el borde AD en N, con AM = ', v('AM', L(AM, u)), '.']
          : ['El cuadrado ABCD tiene lado ', v('L', L(Ld, u)), ' y una circunferencia inscrita. Una recta tangente a esa circunferencia corta a AB en M y a AD en N, de modo que el triángulo AMN queda en la esquina A, fuera de la circunferencia. AM = ', v('AM', L(AM, u)), '.'],
        pregunta: [ctx ? '¿Cuánto mide el tramo MN de la regla?' : '¿Cuánto mide MN?'],
        errores: [
          h('CM-esquina-da-AN', AN, `Ese es AN, el otro cateto. Se pide MN, la hipotenusa del triángulo AMN.`),
          h('CM-esquina-sin-AN', Ld - AM, `Usaste AM + MN = L y te olvidaste de AN. Lo que mide L es el perímetro entero de AMN.`),
          h('CM-esquina-mitad', Ld / 2, `Tomaste MN igual a la mitad del lado. Eso es lo que miden AE y AF, las tangentes desde A.`),
          h('CM-esquina-N-en-medio', sq(AM * AM + Ld * Ld / 4), `Supusiste que N es el punto medio de AD. N está más cerca de A: el punto de tangencia de AD es su punto medio, no N.`),
          h('CM-esquina-pitagoras-lado', sq(AM * AM + pp * pp), `Usaste AN = L − AM. Así no queda sitio para MN: el perímetro de AMN (AM + AN + MN) es el que vale L.`),
        ],
        solucion: [
          ['La circunferencia toca AB y AD en sus puntos medios E y F: AE = AF = ', v('L', `${Ld}`), `/2 = ${Ld / 2}. Si la recta MN la toca en T, ME = MT y NF = NT (tangentes iguales).`],
          [`Perímetro de AMN = AM + MT + TN + NA = AM + ME + NF + NA = AE + AF = ${Ld}.`],
          ['Con AN = ', `${Ld} − `, v('AM', `${AM}`), ' − MN = ', `${pp} − MN y Pitágoras: ${AM}² + (${pp} − MN)² = MN² → ${pp * pp + AM * AM} = ${2 * pp}·MN.`],
          ['MN = ', v('x', L(MN, u)), ' (y ', v('AN', `AN = ${AN}`), `: el triángulo ${Math.min(AM, AN)}-${Math.max(AM, AN)}-${MN}).`],
        ],
      };
    },

    pitot(rng, u) {
      const sub = rng.elegir(['general', 'isosceles', 'rectangulo']);
      if (sub === 'general') {
        let AB, BC, CD, DA;
        for (;;) {
          AB = rng.entero(5, 20); BC = rng.entero(4, 20); CD = rng.entero(5, 20); DA = AB + CD - BC;
          const lados = [AB, BC, CD, DA], per = AB + BC + CD + DA;
          if (DA < 3 || new Set(lados).size < 4 || lados.some(x => 2 * x >= per)) continue;
          break;
        }
        const variables = { AB: { nombre: 'AB', color: 'o' }, BC: { nombre: 'BC', color: 'i' }, CD: { nombre: 'CD', color: 'h' }, x: { nombre: 'DA', color: 'd' } };
        const ctx = rng.moneda();
        return {
          variables, unidad: u, correcta: DA, datos: { sub, AB, BC, CD },
          enunciado: ctx
            ? ['Un marco de madera con forma de cuadrilátero ABCD (vértices en ese orden) rodea un espejo redondo que toca los cuatro lados. AB = ', v('AB', L(AB, u)), ', BC = ', v('BC', L(BC, u)), ' y CD = ', v('CD', L(CD, u)), '.']
            : ['El cuadrilátero ABCD (vértices en ese orden) está circunscrito a una circunferencia. AB = ', v('AB', L(AB, u)), ', BC = ', v('BC', L(BC, u)), ' y CD = ', v('CD', L(CD, u)), '.'],
          pregunta: ['¿Cuánto mide DA?'],
          errores: [
            h('CM-pitot-vecinos', AB + BC - CD, `Sumaste lados vecinos (AB + BC = CD + DA). El teorema de Pitot junta los lados opuestos: AB + CD = BC + DA.`),
            h('CM-pitot-opuestos-iguales', BC, `Supusiste que los lados opuestos son iguales, como en un paralelogramo. Lo que es igual es la suma de cada par de opuestos.`),
            h('CM-pitot-promedio', (AB + BC + CD) / 3, `Promediaste los tres lados. DA sale de AB + CD = BC + DA.`),
            h('CM-pitot-vecinos', BC + CD - AB, `Sumaste lados vecinos. El teorema de Pitot junta los lados opuestos: AB + CD = BC + DA.`),
          ],
          solucion: [
            ['Desde cada vértice, las dos tangentes a la circunferencia miden lo mismo. Cada lado es la suma de dos tangentes, y los lados opuestos usan las cuatro una vez: AB + CD = BC + DA (teorema de Pitot).'],
            [v('AB', `${AB}`), ' + ', v('CD', `${CD}`), ' = ', v('BC', `${BC}`), ' + DA → DA = ', v('x', L(DA, u)), '.'],
          ],
        };
      }
      if (sub === 'isosceles') {
        const [B, b] = rng.elegir([[8, 2], [18, 2], [32, 2], [16, 4], [36, 4], [24, 6], [12, 3], [18, 8], [50, 2], [48, 3]]);
        const r = sq(B * b) / 2;
        const variables = { B: { nombre: 'base mayor', color: 'o' }, b: { nombre: 'base menor', color: 'i' }, l: { nombre: 'lado no paralelo', color: 'h' }, x: { nombre: 'radio', color: 'd' } };
        return {
          variables, unidad: u, correcta: r, datos: { sub, B, b },
          enunciado: ['Un trapecio isósceles está circunscrito a una circunferencia (sus cuatro lados son tangentes a ella). Sus bases miden ', v('B', L(B, u)), ' y ', v('b', L(b, u)), '.'],
          pregunta: ['¿Cuánto mide el radio de la circunferencia?'],
          errores: [
            h('GE19-diametro-por-radio', 2 * r, `Ese es el diámetro, igual a la altura del trapecio. El radio es la mitad.`),
            h('CM-pitot-promedio-bases', (B + b) / 4, `Tomaste como altura el promedio de las bases. La altura sale de Pitágoras con el lado no paralelo: h² = B·b.`),
            h('CM-pitot-lado-como-altura', (B + b) / 2, `Ese es el lado no paralelo, (B + b)/2. La altura es más corta: es el cateto, no la hipotenusa.`),
            h('CM-pitot-diferencia-bases', (B - b) / 2, `Usaste (B − b)/2: ese es el cateto horizontal del triángulo rectángulo, no la altura.`),
          ],
          solucion: [
            ['Pitot: la suma de bases es igual a la suma de los lados no paralelos. Con lados iguales: ', v('l', `lado = (${B} + ${b})/2 = ${(B + b) / 2}`), '.'],
            [`Al bajar una altura desde la base menor queda un triángulo rectángulo de hipotenusa ${(B + b) / 2} y cateto horizontal (${B} − ${b})/2 = ${(B - b) / 2}.`],
            [`Altura² = ${(B + b) / 2}² − ${(B - b) / 2}² = ${B * b} (= B·b), así que la altura mide ${sq(B * b)}.`],
            ['La altura es el diámetro: r = ', `${sq(B * b)}/2 = `, v('x', L(r, u)), '.'],
          ],
        };
      }
      const ang = rng.elegir([53, 37]);
      const r = ang === 53 ? rng.elegir([2, 4, 6, 8]) : rng.elegir([3, 6, 9]);
      const [sn, cs] = ang === 53 ? [4 / 5, 3 / 5] : [3 / 5, 4 / 5];
      const CD = 2 * r / sn, dif = 2 * r * cs / sn, suma = 2 * r + CD, AD = (suma + dif) / 2, BC = (suma - dif) / 2;
      const variables = { r: { nombre: 'radio', color: 'o' }, CD: { nombre: 'lado oblicuo CD', color: 'i' }, s: { nombre: 'suma de bases', color: 'h' }, x: { nombre: 'base mayor AD', color: 'd' } };
      return {
        variables, unidad: u, correcta: AD, datos: { sub, r, ang },
        enunciado: ['El trapecio rectángulo ABCD (BC ∥ AD, con ángulos rectos en A y en B) está circunscrito a una circunferencia de radio ', v('r', L(r, u)), `. El ángulo ADC mide ${ang}°.`],
        pregunta: ['¿Cuánto mide la base mayor AD?'],
        errores: [
          h('CM-pitot-suma-como-base', suma, `Esa es la suma de las dos bases (AD + BC). Falta separarla con la diferencia de bases.`),
          h('CM-pitot-mitad', suma / 2, `Partiste la suma de bases en dos mitades iguales. Las bases son distintas: difieren en ${f(dif)}.`),
          h('CM-pitot-da-BC', BC, `Esa es la base menor BC.`),
          h('CM-pitot-altura-radio', AD / 2, `Tomaste la altura AB igual al radio. Las bases son paralelas y tangentes a la circunferencia: la distancia entre ellas es el diámetro, 2r.`),
          h('CM-pitot-da-CD', CD, `Ese es el lado oblicuo CD.`),
        ],
        solucion: [
          ['La circunferencia toca AD y BC, que son paralelas: la altura AB es el diámetro, ', `2·`, v('r', `${r}`), ` = ${2 * r}.`],
          [`Desde C se baja CH ⊥ AD: CH = ${2 * r} y el triángulo CHD es el notable de ${ang}° (3-4-5): `, v('CD', `CD = ${f(CD)}`), ` y HD = ${f(dif)} = AD − BC.`],
          ['Pitot: AD + BC = AB + CD = ', `${2 * r} + ${f(CD)} = `, v('s', `${f(suma)}`), '.'],
          [`AD = (${f(suma)} + ${f(dif)})/2 = `, v('x', L(AD, u)), ` (y BC = ${f(BC)}).`],
        ],
      };
    },

    poncelet(rng, u) {
      const sub = rng.elegir(['radio', 'perimetro']);
      let [a, b, c] = rng.elegir(TRIPLES);
      const k = c <= 13 ? rng.elegir([1, 2, 3]) : 1;
      a *= k; b *= k; c *= k;
      if (rng.moneda()) [a, b] = [b, a];
      const r = (a + b - c) / 2;
      if (sub === 'radio') {
        const variables = { a: { nombre: 'cateto BC', color: 'o' }, b: { nombre: 'cateto AB', color: 'i' }, c: { nombre: 'hipotenusa AC', color: 'h' }, x: { nombre: 'radio inscrito', color: 'd' } };
        const ctx = rng.moneda();
        return {
          variables, unidad: u, correcta: r, datos: { sub, a, b },
          enunciado: ctx
            ? ['Una escuadra de cartón tiene forma de triángulo rectángulo ABC (recto en B), con AB = ', v('b', L(b, u)), ' y BC = ', v('a', L(a, u)), '. Se recorta dentro el círculo más grande posible, que toca los tres bordes.']
            : ['En el triángulo ABC, recto en B, los catetos miden AB = ', v('b', L(b, u)), ' y BC = ', v('a', L(a, u)), '.'],
          pregunta: [ctx ? '¿Cuánto mide el radio de ese círculo?' : '¿Cuánto mide el radio de la circunferencia inscrita?'],
          errores: [
            h('CM-poncelet-sin-mitad', 2 * r, `Ese es AB + BC − AC, el diámetro. El teorema de Poncelet dice AB + BC = AC + 2r: falta dividir entre 2.`),
            h('CM-inscrita-circunscrita', c / 2, `Ese es el radio de la circunferencia circunscrita (la mitad de la hipotenusa). Se pide la inscrita, que toca los tres lados por dentro.`),
            h('CM-poncelet-semiperimetro', (a + b + c) / 2, `Ese es el semiperímetro. El radio inscrito es p − AC.`),
            h('CM-poncelet-signo', (a + c - b) / 2, `Pusiste la hipotenusa con el signo cambiado. Poncelet: catetos = hipotenusa + 2r.`),
          ],
          solucion: [
            ['Pitágoras: AC = √(', v('b', `${b}`), '² + ', v('a', `${a}`), '²) = ', v('c', `${c}`), '.'],
            ['Las tangentes desde B miden r (el ángulo recto forma un cuadradito con el centro). Por eso AB + BC = AC + 2r (teorema de Poncelet).'],
            [`${a} + ${b} = ${c} + 2r → r = `, v('x', L(r, u)), '.'],
          ],
        };
      }
      const variables = { c: { nombre: 'hipotenusa', color: 'h' }, r: { nombre: 'radio inscrito', color: 'o' }, s: { nombre: 'suma de catetos', color: 'i' }, x: { nombre: 'perímetro', color: 'd' } };
      return {
        variables, unidad: u, correcta: 2 * c + 2 * r, datos: { sub, c, r },
        enunciado: ['En un triángulo rectángulo, la hipotenusa mide ', v('c', L(c, u)), ' y la circunferencia inscrita tiene radio ', v('r', L(r, u)), '.'],
        pregunta: ['¿Cuál es el perímetro del triángulo?'],
        errores: [
          h('CM-poncelet-da-catetos', c + 2 * r, `Esa es la suma de los catetos. Falta sumar la hipotenusa.`),
          h('CM-poncelet-sin-doble-r', 2 * c + r, `Pusiste catetos = hipotenusa + r. Poncelet suma el diámetro: + 2r.`),
          h('CM-poncelet-signo', 2 * c - 2 * r, `Restaste 2r. Los catetos juntos son más largos que la hipotenusa: catetos = hipotenusa + 2r.`),
          h('CM-poncelet-r-por-hipotenusa', c + r, `Sumaste solo hipotenusa y radio. Perímetro = catetos + hipotenusa = (hipotenusa + 2r) + hipotenusa.`),
        ],
        solucion: [
          ['Teorema de Poncelet: suma de catetos = hipotenusa + 2r = ', v('c', `${c}`), ' + 2·', v('r', `${r}`), ' = ', v('s', `${c + 2 * r}`), '.'],
          ['Perímetro = catetos + hipotenusa = ', `${c + 2 * r} + ${c} = `, v('x', L(2 * c + 2 * r, u)), '.'],
        ],
      };
    },

    'arcos-cuerdas'(rng, u) {
      const sub = rng.elegir(['cuerda', 'al-reves']);
      const [Rr, hm, om] = rng.elegir([[5, 4, 3], [5, 3, 4], [10, 8, 6], [10, 6, 8], [13, 12, 5], [13, 5, 12], [17, 15, 8], [17, 8, 15], [25, 24, 7], [25, 20, 15], [25, 15, 20], [25, 7, 24]]);
      const AC = 2 * hm, BM = Rr - om, AB2 = hm * hm + BM * BM;
      const variables = { R: { nombre: 'radio', color: 'o' }, ac: { nombre: 'cuerda AC', color: 'i' }, bm: { nombre: 'flecha BM', color: 'h' }, ab: { nombre: 'cuerda AB', color: 'd' } };
      const ctx = rng.moneda();
      const intro = ctx
        ? ['Un arco de puerta tiene forma de arco de circunferencia de radio ', v('R', L(Rr, u)), '. Sus extremos A y C están en el piso y B es el punto más alto del arco (el punto medio del arco AC).']
        : ['En una circunferencia de radio ', v('R', L(Rr, u)), ', B es el punto medio del arco menor AC.'];
      if (sub === 'cuerda') {
        return {
          variables, unidad: u, correcta: sq(AB2), datos: { sub, R: Rr, AC },
          enunciado: [...intro, ' La cuerda AC mide ', v('ac', L(AC, u)), '.'],
          pregunta: [ctx ? '¿Cuánto mide la viga recta que va de A a B?' : '¿Cuánto mide la cuerda AB?'],
          errores: [
            h('CM-arco-mitad-cuerda-mitad', hm, `Tomaste AB como la mitad de AC porque el arco AB es la mitad del arco AC. Los arcos iguales dan cuerdas iguales (AB = BC), pero la cuerda no es proporcional al arco: AB es más larga que AC/2.`),
            h('CM-arco-mayor', sq(hm * hm + (Rr + om) ** 2), `Ese es el punto medio del arco mayor: tomaste BM = R + OM. B está en el arco menor, del mismo lado de AC que la flecha corta.`),
            h('CM-cuerda-radio', Rr, `Tomaste AB igual al radio. Eso solo pasa si el arco AB mide 60°.`),
            h('CM-sin-raiz', AB2, `Calculaste AB² = ${AB2} y olvidaste sacar la raíz cuadrada.`),
          ],
          solucion: [
            ['Como el arco AB es igual al arco BC, las cuerdas AB y BC son iguales; el radio OB es perpendicular a AC y la corta en su punto medio M: AM = ', `${hm}.`],
            ['OM = √(', v('R', `${Rr}`), `² − ${hm}²) = ${om}, y la flecha `, v('bm', `BM = ${Rr} − ${om} = ${BM}`), '.'],
            ['AB² = AM² + BM² = ', `${hm * hm} + ${BM * BM} = ${AB2}`, ', así que AB = ', v('ab', `${igualRaiz(AB2)} ${u}`), `. (Cuerda² = diámetro × proyección: ${2 * Rr}·${BM} = ${AB2}.)`],
          ],
        };
      }
      return {
        variables, unidad: u, correcta: AC, datos: { sub, R: Rr, AB2 },
        enunciado: [...intro, ' La cuerda AB mide ', v('ab', L(sq(AB2), u)), '.'],
        pregunta: [ctx ? '¿Qué distancia hay entre A y C?' : '¿Cuánto mide la cuerda AC?'],
        errores: [
          h('CM-arco-doble-cuerda-doble', 2 * sq(AB2), `Duplicaste AB porque el arco AC es el doble del arco AB. La cuerda no crece en proporción al arco: AC es más corta que AB + BC.`),
          h('CM-arco-da-mitad', hm, `Ese es AM, la mitad de la cuerda. Falta duplicar.`),
          h('CM-arco-flecha-por-semicuerda', 2 * BM, `Duplicaste la flecha BM. Lo que se duplica es la semicuerda AM, que sale de AM² = AB² − BM².`),
          h('CM-cuerda-radio', 2 * Rr, `Ese es el diámetro. AC es una cuerda que no pasa por el centro.`),
        ],
        solucion: [
          ['Como B es el punto medio del arco AC, OB es perpendicular a AC y la corta en su punto medio M. Sea BB′ el diámetro que pasa por B: el ángulo BAB′ es recto y AM es su altura, así que AB² = BB′·BM = 2R·BM (cuerda² = diámetro × proyección).'],
          ['AB² = 2R·BM → ', `${AB2} = ${2 * Rr}·BM, `, v('bm', `BM = ${BM}`), '.'],
          ['AM² = AB² − BM² = ', `${AB2} − ${BM * BM} = ${hm * hm}, AM = ${hm}.`],
          ['AC = 2·AM = ', v('ac', L(AC, u)), '.'],
        ],
      };
    },

    inscriptible(rng, u) {
      const [base, m0] = rng.elegir([[2, 1], [3, 1], [3, 2], [4, 1], [4, 3], [7, 3], [7, 4]]);
      const s = rng.elegir([1, 2, 3, 4]);
      const Ld = base * s, m = m0 * s;
      const pide = rng.elegir(['MPC', 'NPC']);
      const aMNC = calc.anguloInscriptible(Ld, m); // ∠MNC = ∠MPC
      const ang = pide === 'MPC' ? aMNC : 90 - aMNC;
      const variables = { L: { nombre: 'lado del cuadrado', color: 'o' }, m: { nombre: 'BM = CN', color: 'i' }, mc: { nombre: 'MC', color: 'h' }, x: { nombre: `ángulo ${pide}`, color: 'd' } };
      const ctx = rng.moneda();
      const inscr = pide === 'MPC' ? ['MNC', 'MC', 'CN', 'MC/CN'] : ['NMC', 'NC', 'MC', 'CN/MC'];
      return {
        variables, unidad: '°', angular: true, correcta: ang, datos: { L: Ld, m, pide },
        enunciado: ctx
          ? ['Una baldosa cuadrada ABCD tiene ', v('L', L(Ld, u)), ' de lado. M está en el lado BC y N en el lado CD, con BM = CN = ', v('m', L(m, u)), '. Se pintan dos rayas rectas, una de A a M y otra de B a N, que se cruzan en P.']
          : ['En el cuadrado ABCD de lado ', v('L', L(Ld, u)), ', M está en BC y N en CD, con BM = CN = ', v('m', L(m, u)), '. Los segmentos AM y BN se cortan en P.'],
        pregunta: [`¿Cuánto mide el ángulo ${pide}?`],
        errores: [
          h('CM-inscriptible-complemento', 90 - ang, `Ese es el ángulo ${pide === 'MPC' ? 'NPC' : 'MPC'}, su complemento. Los dos juntos forman el ángulo recto MPN.`),
          h('CM-inscriptible-45', 45, `Supusiste que PC parte el ángulo recto en dos mitades iguales. Solo pasa si M y N son puntos medios.`),
          h('CM-inscriptible-recto', 90, `90° es el ángulo MPN (AM ⊥ BN). El ángulo ${pide} es solo una parte.`),
          h('GE15-inscrito-por-arco', 2 * ang, `Ese es el arco ${inscr[1]} de la circunferencia que pasa por P, M, C y N. El ángulo inscrito mide la mitad.`),
          h('CM-inscriptible-suplemento', 180 - ang, `Tomaste el suplemento. En un cuadrilátero inscriptible, los ángulos que suman 180° son los opuestos, no estos.`),
        ],
        solucion: [
          ['Los triángulos ABM y BCN son congruentes (AB = BC, BM = CN y ángulo recto en B y en C). Por eso ∠BAM = ∠CBN, y AM resulta perpendicular a BN: ∠MPN = 90°.'],
          ['En el cuadrilátero PMCN, los ángulos opuestos P y C miden 90° cada uno y suman 180°: es inscriptible (sus cuatro vértices están en una circunferencia).'],
          [`Los ángulos ${pide} y ${inscr[0]} abarcan el mismo arco ${inscr[1]}: son iguales.`],
          ['MC = ', v('L', `${Ld}`), ' − ', v('m', `${m}`), ' = ', v('mc', `${Ld - m}`), `. En el triángulo rectángulo ${pide === 'MPC' ? 'MCN' : 'NCM'}, tan ∠${inscr[0]} = ${inscr[3]} = ${pide === 'MPC' ? P.textoFraccion(P.frac(Ld - m, m)) : P.textoFraccion(P.frac(m, Ld - m))}`, Number.isInteger(ang) ? '.' : ' (la mitad de un notable).'],
          [`∠${pide} = `, v('x', grados(ang)), '.'],
        ],
      };
    },
  };

  return { id: ID, titulo: 'Relaciones métricas en la circunferencia', generar, calc };
});
