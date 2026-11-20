/*
 * Teoría de «Ecuaciones polinomiales» (algebra.ecuaciones-polinomiales), sexta unidad de la rama «Expresiones
 * algebraicas», después de «Factorización»; la sigue «Binomio de Newton».
 *
 * Etapa 8 del método (19 nov 2026; docs/etapa8/propuesta-algebra.md, con sus «Decisiones tomadas»): seis ideas que
 * conservan los ids de la versión anterior, con otra Predice (el avance se ajusta en nucleo/avance.js, REHECHAS_E6,
 * marca prediccionEP). El hilo, como en la rama: el maestro Rubén, en Juliaca, ahora sabe cuánto debe medir algo y busca
 * la medida. 1 «Raíces y grado» (`grado-raices`: producto cero, raíz repetida y el teorema fundamental, con la curva de
 * una cúbica) · 2 «Raíces y coeficientes» (`viete`: la caja de cartón cuyas aristas son las raíces; pieza nueva
 * alg-caja) · 3 «Raíces racionales» (`raices-racionales`: candidatos p/q en la tabla de Ruffini) · 4 «Raíces en pareja»
 * (`conjugadas`: la compañera de 2 + √3 y de 2 + 3i) · 5 «Bicuadradas y recíprocas» (`cambio-de-variable`: los huertos
 * cuadrados, u = x² y t = x + 1/x) · 6 «Ecuaciones de dos términos» (`binomica`: xⁿ = a factorizando, sin el plano
 * complejo).
 *
 * Lo que se da por sabido de «Ecuaciones de primer y segundo grado» (otra rama, todavía sin rehacer; propuesta,
 * decisión 1): las palabras ecuación, raíz, ecuación cuadrática y discriminante. Como herramienta va SIEMPRE en los datos:
 * la fórmula general, Δ = b² − 4ac y lo que dice su signo, y la suma −b/a y el producto c/a de una cuadrática. La i va
 * como dato (i² = −1), sin módulo, plano ni forma polar (son de «Números complejos»; decisiones 2 y 3).
 *
 * Letras (la tabla entera va en `letras`): x la incógnita; x₁, x₂, x₃, x₄ las raíces (no r: es el resto en División);
 * a, b, c, d los coeficientes de ax³ + bx² + cx + d (a, el principal); en la idea 6, a es el número de xⁿ = a, y cada dato
 * lo dice; n el grado (en la idea 6, el exponente de xⁿ = a); p/q un candidato a raíz racional; k un número por hallar
 * en un enunciado; u = x² y t = x + 1/x las variables auxiliares; i el número con i² = −1; Δ el discriminante.
 * REGLA DE COLORES DE LA UNIDAD (docs/molde-unidad.md §5b; propuesta §6), en la tabla COLORES (def.colores):
 *   - tinta: el polinomio y la ecuación enteros, la incógnita x, y lo que se pide con «?»;
 *   - violeta (c-f): las raíces (lo que se busca): los puntos sobre el eje, las aristas de la caja, la raíz de la tabla,
 *     los lados x de los huertos;
 *   - naranja (c-o): los coeficientes que se leen (a, b, c, d; c en el juego 1);
 *   - turquesa (c-i): el número que se prueba en la tabla de Ruffini, la compañera que se elige y las variables
 *     auxiliares u y t;
 *   - ni carmín ni verde (ecuaciones-polinomiales.test.js lo comprueba en todas las fichas y figuras).
 * Nada antes de Predice de cada idea (título, Resumen, Lee, glosario, juego) dice su respuesta (prueba propia).
 * No se adelanta «Números complejos» (ni módulo, ni plano complejo, ni forma polar) ni «Binomio de Newton».
 *
 * Errores: AL8, AL14 y AL15 de docs/investigacion/algebra-funciones-ideas-erroneas.md y TAL-* (hipótesis de diseño; los
 * de cada idea en su comentario). Práctica: plantillas/ecuaciones-polinomiales-practica/ (formato «predicciones», tipos
 * por idea). La escena «La máquina de Ruffini» (polinomios) y el generador de admisión ecuaciones-polinomiales van a «Más
 * mesas del tema».
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r();
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    r.noCero = (lo, hi) => { let v = 0; while (v === 0) v = lo + Math.floor(r() * (hi - lo + 1)); return v; };
    r.mezclar = l => { const x = l.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
    return r;
  }
  function distintas(ops) {
    const vistos = new Set(), out = [];
    for (const o of ops) { if (!o || o.texto === null || o.texto === undefined || o.texto === '') continue; const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined|Infinity/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }
  // Las alternativas van en tinta, sin fichas de color (como en Factorización: con color se leían como términos del
  // glosario). El color queda en la solución.
  const ops = lista => distintas(lista).slice(0, 4).map(o => Object.assign({}, o, { texto: Kit.plano(o.texto) }));
  function conCuatro(caso, r) {
    for (let i = 0; i < 200; i++) { const c = caso(r); if (c && c.opciones.length >= 4) return c; }   // null: el caso no sirve, otro
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }

  // ---------- Números: enteros, fracciones exactas y polinomios ----------
  const mcdN = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  // Fracción reducida como texto: «3/2», «−1/3», «4».
  function fr(n, d = 1) {
    if (d < 0) { n = -n; d = -d; }
    const g = mcdN(n, d) || 1; n /= g; d /= g;
    return d === 1 ? f(n) : `${n < 0 ? '−' : ''}${Math.abs(n)}/${d}`;
  }
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = n => String(n).split('').map(c => SUP[c]).join('');
  const SUB = { 1: '₁', 2: '₂', 3: '₃', 4: '₄' };
  const pot = (v, e) => (e === 0 ? '' : e === 1 ? v : v + sup(e));
  // Polinomio con coeficientes de mayor a menor grado: [2, 0, −5, 1] → «2x³ − 5x + 1».
  function poli(cs, v = 'x') {
    const n = cs.length - 1, out = [];
    cs.forEach((c, k) => { if (c !== 0) out.push([c, n - k]); });
    if (!out.length) return '0';
    return out.map(([c, e], i) => {
      const abs = Math.abs(c), lit = pot(v, e), num = abs === 1 && lit ? '' : f(abs);
      return (c < 0 ? (i ? ' − ' : '−') : (i ? ' + ' : '')) + num + lit;
    }).join('');
  }
  const par = v => (v < 0 ? `(${f(v)})` : f(v));
  const menosDe = v => (v < 0 ? `−(${f(v)})` : `−${f(v)}`);   // −b con b a la vista: «−(−12)», «−10» (no «−(10)»)
  const evaluar = (cs, x) => cs.reduce((acc, c) => acc * x + c, 0);
  const mult = (A, B) => { const out = Array(A.length + B.length - 1).fill(0); A.forEach((u, i) => B.forEach((w, j) => { out[i + j] += u * w; })); return out; };
  // Producto de (x − r) por cada raíz, por el coeficiente principal a.
  const desdeRaices = (rs, a = 1) => rs.reduce((c, r) => mult(c, [1, -r]), [a]);
  const binx = v => (v === 0 ? 'x' : v > 0 ? `x − ${f(v)}` : `x + ${f(-v)}`);          // el factor x − v
  const conPot = (t, e) => (e === 1 ? `(${t})` : `(${t})${sup(e)}`);
  // P(p/q) · qⁿ: entero; vale 0 si p/q es raíz (aritmética exacta).
  const valorFrac = (cs, p, q) => { const n = cs.length - 1; return cs.reduce((acc, c, i) => acc + c * p ** (n - i) * q ** i, 0); };
  // Ruffini con un número p/q, en fracciones exactas: la fila de abajo como [num, den].
  function ruffiniFrac(cs, p, q) {
    const abajo = [], medio = [];
    let an = 0, ad = 1;
    cs.forEach((c, i) => {
      if (i === 0) { an = c; ad = 1; abajo.push([an, ad]); return; }
      const mn = an * p, md = ad * q;               // lo de arriba por p/q
      medio.push([mn, md]);
      an = c * md + mn; ad = md;
      const g = mcdN(an, ad) || 1; an /= g; ad /= g;
      abajo.push([an, ad]);
    });
    return { abajo, medio };
  }
  const divisores = n => { const m = Math.abs(n), out = []; for (let k = 1; k <= m; k++) if (m % k === 0) out.push(k); return out; };
  // Candidatos ±p/q reducidos, sin repetir, de menor a mayor valor absoluto.
  function candidatos(cs) {
    const ps = divisores(cs[cs.length - 1]), qs = divisores(cs[0]), vistos = new Set(), out = [];
    for (const q of qs) for (const p of ps) for (const s of [1, -1]) {
      const g = mcdN(p, q), k = `${s * p / g}/${q / g}`;
      if (!vistos.has(k)) { vistos.add(k); out.push([s * p / g, q / g]); }
    }
    return out.sort((u, w) => Math.abs(u[0] / u[1]) - Math.abs(w[0] / w[1]) || w[0] - u[0]);
  }
  // Una raíz con √ o con i, como texto: base ± coef·√r o base ± coef·i («2 + √3», «1 − 2i», «−3 + 3√3 i» no: ver binómica).
  const conRaiz = (base, coef, r, signo) => `${base === 0 ? (signo < 0 ? '−' : '') : `${f(base)} ${signo < 0 ? '−' : '+'} `}${coef === 1 ? '' : f(coef)}√${r}`;
  const conI = (base, coef, signo) => `${base === 0 ? (signo < 0 ? '−' : '') : `${f(base)} ${signo < 0 ? '−' : '+'} `}${coef === 1 ? '' : f(coef)}i`;

  // ---------- Colores de la unidad: un color fijo por magnitud (cabecera; lo comprueba la prueba propia) ----------
  const COLORES = { 'raíz': 'f', 'coeficiente': 'o', 'número que se prueba': 'i', 'variable auxiliar': 'i' };
  const ficha = mg => t => ({ v: `c-${COLORES[mg]}`, t: String(t), m: mg });
  const RA = ficha('raíz'), CO = ficha('coeficiente'), NP = ficha('número que se prueba'), VA = ficha('variable auxiliar');
  // La letra de una alternativa, en negrita y en tinta (Gerson, mesa del 17 nov). El U+2060 (invisible) queda para que la
  // letra no se lea como variable.
  const letra = L => ({ negrita: `${L}⁠` });
  const SEP = ';   ';   // separa dos igualdades (un «·» se leería como producto: molde §2)
  const xs = k => ({ sub: ['x', String(k)] });                      // x₁, x₂… en una ecuación
  const RX = k => ({ v: 'c-f', t: `x${SUB[k]}`, m: 'raíz' });          // la raíz x₁, en violeta
  const EJ = datos => ({ pieza: 'ejes', datos: Object.assign({ ajustado: true }, datos), estado: {} });
  const TB = datos => ({ pieza: 'alg-tabla', datos, estado: {} });
  const CJ = datos => ({ pieza: 'alg-caja', datos: Object.assign({ objeto: 'caja' }, datos), estado: {} });
  const RP = datos => ({ pieza: 'alg-reparto', datos, estado: {} });
  const OB = datos => ({ pieza: 'alg-objeto', datos, estado: {} });
  const RC = datos => ({ pieza: 'recta', datos, estado: {} });
  // La curva de un polinomio en los ejes: muestras entre a y b, cortadas donde se sale de [ymin, ymax].
  function curva(fn, a, b, ymin, ymax, n = 160) {
    const pts = []; let prev = null;
    for (let i = 0; i <= n; i++) {
      const xx = a + (b - a) * i / n, yy = fn(xx), dentro = yy >= ymin && yy <= ymax;
      if (prev && dentro !== prev[2]) {
        const borde = (dentro ? prev[1] : yy) > ymax ? ymax : ymin, k = (borde - prev[1]) / (yy - prev[1]);
        pts.push([prev[0] + (xx - prev[0]) * k, borde]);
        if (!dentro) pts.push(null);
      }
      if (dentro) pts.push([xx, yy]);
      prev = [xx, yy, dentro];
    }
    return pts;
  }

  // Datos que se repiten (herramientas, no el paso hecho). Lo de «Ecuaciones de primer y segundo grado» va siempre aquí.
  const DD = {
    prodCero: 'Producto cero: un producto vale 0 solo si alguno de sus factores vale 0',
    cuadrado: 'Un número real al cuadrado nunca da un número negativo',
    tfa: 'Un polinomio de grado n tiene n raíces, contando las repetidas y las no reales',
    mult: 'Una raíz cuyo factor tiene exponente m se cuenta m veces',
    delta: 'Δ = b² − 4ac decide: si Δ < 0, ax² + bx + c = 0 no tiene raíces reales',
    deltaTodo: 'Con Δ = b² − 4ac: Δ > 0, dos raíces reales; Δ = 0, una doble; Δ < 0, dos no reales',
    general: 'Fórmula general: x = (−b ± √Δ)/(2a)',
    deltaDef: 'Discriminante: Δ = b² − 4ac',
    sp2: 'En ax² + bx + c = 0, las dos raíces suman −b/a y multiplican c/a',
    indep: 'El término independiente de P es P(0)',
    vieta: 'En ax³ + bx² + cx + d = 0: x₁ + x₂ + x₃ = −b/a',
    vieta2: 'x₁x₂ + x₁x₃ + x₂x₃ = c/a',
    vieta3: 'x₁x₂x₃ = −d/a',
    cuadSuma: 'x₁² + x₂² + x₃² = (la suma)² − 2(los productos de a dos)',
    inversos: '1/x₁ + 1/x₂ + 1/x₃ = (x₁x₂ + x₁x₃ + x₂x₃)/(x₁x₂x₃)',
    racional: 'Si p/q (reducida) es raíz y los coeficientes son enteros, p divide al término independiente y q al principal',
    ruf: 'Ruffini: se baja el primero; cada casilla de abajo es el de arriba más (número que se prueba) · (la de abajo anterior)',
    resto: 'El último número de la fila de abajo es P del número que se prueba: si es 0, es raíz',
    baja: 'Con una raíz x₁, P = (x − x₁) · (la fila de abajo, sin su último número)',
    i: 'i: el número con i² = −1; así, √−9 = 3i',
    conjR: 'Con coeficientes enteros, una raíz con √ inexacta trae a su conjugada: 3 + √2 trae a 3 − √2',
    conjI: 'Con coeficientes reales, una raíz no real trae a su conjugada: 1 + 2i trae a 1 − 2i',
    parFactor: 'Dos raíces dan el factor x² − (su suma)x + (su producto)',
    bicuad: 'En ax⁴ + bx² + c = 0 se cambia x² por u: queda au² + bu + c = 0',
    vuelta: 'x² = u da x = ±√u si u > 0; si u < 0, dos raíces no reales',
    reciproca: 'Recíproca: se divide entre x² y se cambia x + 1/x por t',
    t2: 'x² + 1/x² = t² − 2, si t = x + 1/x',
    difCuad: 'A² − B² = (A + B)(A − B)',
    difCubos: 'A³ − B³ = (A − B)(A² + AB + B²)',
    sumCubos: 'A³ + B³ = (A + B)(A² − AB + B²)',
    binomica: 'Una ecuación de dos términos se resuelve pasando todo a un lado y factorizando',
    // Con «todo a un lado»: leída sobre x⁴ = 81, sin pasar el 81, daba la trampa 81 (lector B, tarjeta 18).
    prod4: 'Con la ecuación escrita como … = 0, en grado 4 el producto de las cuatro raíces es (término independiente)/a',
    agrupar: 'Agrupar: se juntan los términos de a dos y se saca el factor común de cada par',
  };

  // ---------- Idea 1: raíces y grado ----------
  // Propuesta: docs/etapa8/propuesta-algebra.md (§1 a §6, idea 1). Objeto: el pasadizo de 15 dm² de Rubén (Lee) y, en el
  // cuaderno, la curva de x³ − 3x + d (juego, pieza ejes; el control se llama c en el código y d en pantalla): las raíces reales son los puntos violeta sobre el eje.
  // Cambia: d, de 0 a 4. · Permanece: el grado 3. · Progresa: cuántas raíces reales hay y cuántas no reales. · Se reserva:
  // un grado mayor con raíces no reales (la predicción: grado 5 con 3 reales simples). · Debe verse: reales + no reales
  // = 3 en todas las posiciones, y la raíz doble que toca sin cruzar cuenta dos veces.
  // Errores (hipótesis de diseño): TAL-SOLO-REAL cree que la gráfica muestra todas las raíces · TAL-NOREAL-ESPEJO pone
  // una no real por cada real · TAL-GRADO toma el grado como lo que se pide · TAL-MULTIPLICIDAD no cuenta las repetidas
  // (o las cuenta cuando se piden distintas) · TAL-NOREAL-REAL cree que un trinomio con Δ < 0 da reales · TAL-CONJUGADA
  // cree que hay una sola no real · TAL-TRIPLE-UNA usa la raíz triple una sola vez · TAL-TRIPLE-SUMA multiplica la raíz
  // por 3 en vez de elevarla · TAL-SIGNO pierde el signo de (−a)³ · TAL-MEDIDA toma una raíz negativa como medida.
  const EJES1 = { x: { min: -3, max: 3, paso: 1, nombre: 'x', decimales: 0 }, y: { min: -8, max: 8, paso: 4, nombre: 'y', decimales: 0 } };
  function biseccion(fn, a, b) {
    let fa = fn(a);
    for (let i = 0; i < 60; i++) { const m = (a + b) / 2, fm = fn(m); if ((fm < 0) === (fa < 0)) { a = m; fa = fm; } else b = m; }
    return (a + b) / 2;
  }
  // x³ − 3x + d con d de 0 a 4: tres reales (c = 0, 1), una simple y una doble (c = 2) o una real y dos no reales (c = 3, 4).
  function cubica1(c) {
    const p = v => v * v * v - 3 * v + c;
    const reales = c === 2 ? [[-2, 1], [1, 2]] : c < 2 ? [[biseccion(p, -3, -1), 1], [biseccion(p, -1, 1), 1], [biseccion(p, 1, 3), 1]] : [[biseccion(p, -4, -1), 1]];
    const conRep = reales.reduce((s, [, m]) => s + m, 0);
    return { p, reales, conRep, noReales: 3 - conRep };
  }
  const grafica1 = c => {
    const q = cubica1(c);
    return EJ(Object.assign({}, EJES1, { curvas: [{ puntos: curva(q.p, -3, 3, -8, 8), color: null }],
      puntos: q.reales.map(([r, m]) => ({ x: r, y: 0, color: 'f', rotulo: m === 2 ? 'doble' : undefined })),
      alt: `Curva de x³ − 3x + ${c}: ${q.reales.length === 3 ? 'corta el eje x tres veces' : q.reales.length === 2 ? 'corta el eje x una vez y lo toca en otro punto' : 'corta el eje x una sola vez'}` }));
  };
  function lectura1(c) {
    const q = cubica1(c);
    if (c === 2) return ['1 simple y ', RA('1 doble'), ': 1 + 2 = 3, el grado'];
    const r = q.reales.length;
    return [RA(`${r} ${r === 1 ? 'real' : 'reales'}`), ` y ${q.noReales} no ${q.noReales === 1 ? 'real' : 'reales'}: ${r} + ${q.noReales} = 3, el grado`];
  }
  const GR5 = v => v * (v * v - 4) * (v * v + 1);   // la predicción: grado 5, raíces reales −2, 0 y 2
  const ejes5 = puntos => EJ(Object.assign({}, EJES1, { y: { min: -16, max: 16, paso: 8, nombre: 'y', decimales: 0 },
    curvas: [{ puntos: curva(GR5, -3, 3, -16, 16), color: null }], puntos,
    alt: puntos.length ? 'Curva de grado 5 que corta el eje x en −2, 0 y 2' : 'Curva de grado 5 que corta el eje x tres veces' }));

  // Ahora tú 1: P = (x − a)^m (x + b)^k (x² + c), ya factorizado.
  function factorizado1(r) {
    const a = r.ent(1, 5), b = r.ent(1, 5), m = r.ent(1, 3), k = r.ent(1, 2), c = r.uno([1, 4, 9, 16]);
    if (a === b || m + k < 3) return null;
    const P = `${conPot(binx(a), m)}${conPot(binx(-b), k)}(x² + ${c})`;
    return { a, b, m, k, c, P, total: m + k + 2 };
  }
  function casoTotal(r) {
    const q = factorizado1(r); if (!q) return null;
    return {
      pregunta: [`P(x) = ${q.P}. ¿Cuántas raíces tiene P, contando las repetidas y las no reales?`],
      datos: [DD.tfa, DD.mult, 'Grado de un producto: la suma de los grados de sus factores'],
      opciones: ops([
        { id: 'c', texto: f(q.total), correcta: true },
        { id: 'distintas', texto: '4', error: 'TAL-MULTIPLICIDAD', siFuera: `Bien las dos no reales de x² + ${q.c}. Pero las repetidas se cuentan cada vez: ${q.m} y ${q.k}.` },
        { id: 'reales', texto: f(q.m + q.k), error: 'TAL-SOLO-REAL', siFuera: `Bien las reales con sus repeticiones. Pero x² + ${q.c} aporta dos raíces no reales más.` },
        { id: 'mas', texto: f(q.total + 1), error: 'TAL-GRADO', siFuera: `Bien sumar los exponentes. Pero x² + ${q.c} es de grado 2: aporta dos, no tres.` },
        { id: 'dos', texto: '2', error: 'TAL-SOLO-REAL', siFuera: `Bien que hay dos valores reales, ${f(q.a)} y ${f(-q.b)}. Pero faltan las repeticiones y las no reales.` },
      ]),
      solucion: { texto: 'Se suman los grados de los factores: cada uno aporta tantas raíces como su grado.', ecuacion: [`${q.m} + ${q.k} + 2 = `, RA(f(q.total))] },
    };
  }
  function casoDistintas(r) {
    const q = factorizado1(r); if (!q) return null;
    return {
      pregunta: [`P(x) = ${q.P}. ¿Cuántas raíces reales distintas tiene P?`],
      datos: [DD.prodCero, DD.cuadrado],
      opciones: ops([
        { id: 'c', texto: '2', correcta: true },
        { id: 'rep', texto: f(q.m + q.k), error: 'TAL-MULTIPLICIDAD', siFuera: `Bien las raíces ${f(q.a)} y ${f(-q.b)}. Pero se piden distintas: una repetida cuenta una vez.` },
        { id: 'todas', texto: f(q.total), error: 'TAL-SOLO-REAL', siFuera: `Bien contar el grado. Pero x² + ${q.c} = 0 pide x² = −${q.c}: no hay real.` },
        { id: 'cuatro', texto: '4', error: 'TAL-NOREAL-REAL', siFuera: `Bien ${f(q.a)} y ${f(-q.b)}. Pero x² + ${q.c} no da reales: un real al cuadrado no es negativo.` },
        { id: 'tres', texto: '3', error: 'TAL-NOREAL-REAL', siFuera: `Bien ${f(q.a)} y ${f(-q.b)}. Pero x² + ${q.c} no aporta ninguna raíz real.` },
      ]),
      solucion: { texto: `Solo ${binx(q.a)} y ${binx(-q.b)} dan reales; x² + ${q.c} nunca vale 0 con x real.`, ecuacion: [RA(`x = ${f(q.a)}`), ' o ', RA(`x = ${f(-q.b)}`)] },
    };
  }
  // Ahora tú 3: (x − e)(x² + Bx + C) con Δ de cualquier signo: ¿cuántas no reales?
  function casoNoReales(r) {
    const e = r.noCero(-4, 4), B = r.noCero(-6, 6), C = r.noCero(-9, 12), D = B * B - 4 * C;
    if (D === 0) return null;
    const P = `(${binx(e)})(${poli([1, B, C])})`, bien = D < 0 ? 2 : 0;
    return {
      pregunta: [`¿Cuántas raíces no reales tiene ${P} = 0?`],
      datos: [DD.prodCero, DD.deltaTodo],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'otro', texto: f(2 - bien), error: bien ? 'TAL-NOREAL-REAL' : 'TAL-SOLO-REAL', siFuera: bien ? `Bien el ${f(e)}. Pero Δ = ${f(D)} es negativo: el trinomio no da reales.` : `Bien mirar el trinomio. Pero Δ = ${f(D)} es positivo: sus dos raíces son reales.` },
        { id: 'una', texto: '1', error: 'TAL-CONJUGADA', siFuera: 'Bien usar Δ. Pero un trinomio aporta dos raíces: las dos reales o las dos no reales.' },
        { id: 'tres', texto: '3', error: 'TAL-GRADO', siFuera: `Bien que el grado es 3. Pero ${binx(e)} da la raíz real ${f(e)}.` },
      ]),
      solucion: { texto: `${binx(e)} da la raíz real ${f(e)}. Del trinomio decide el signo de Δ.`, ecuacion: [`Δ = ${par(B)}² − 4 · 1 · ${par(C)} = ${f(D)}`] },
    };
  }
  // Ahora tú 4 (nivel examen, San Marcos 2027-I con otros números): (x − a)³(x − k) con el término independiente dado.
  function casoTriple(r) {
    const a = r.uno([1, 2, -1, -2, 3]), k = r.noCero(-6, 6);
    if (k === a || Math.abs(a ** 3 * k) > 200) return null;
    const d = a ** 3 * k;
    return {
      pregunta: [`P(x) = (${binx(a)})³(x − k) tiene la raíz triple ${f(a)} y su término independiente es ${f(d)}. ¿Cuánto vale k?`],
      datos: [DD.indep, 'P(0) es el producto de los factores con x = 0'],
      opciones: ops([
        { id: 'c', texto: f(k), correcta: true },
        { id: 'signo', texto: f(-k), error: 'TAL-SIGNO', siFuera: `Bien usar P(0). Pero ${par(-a)}³ · (−k) da ${f(a ** 3)}k: el signo de −k también cuenta.` },
        { id: 'una', texto: fr(d, a), error: 'TAL-TRIPLE-UNA', siFuera: `Bien igualar P(0) a ${f(d)}. Pero el factor ${binx(a)} va tres veces: ${par(-a)}³.` },
        { id: 'tres', texto: fr(d, 3 * a), error: 'TAL-TRIPLE-SUMA', siFuera: `Bien la raíz triple. Pero ${par(-a)}³ es ${par(-a)} · ${par(-a)} · ${par(-a)}, no 3 · ${par(-a)}.` },
      ]),
      solucion: { texto: 'Con x = 0, cada factor deja su número.', ecuacion: [`P(0) = ${par(-a)}³ · (−k) = ${f(a ** 3)}k = ${f(d)}  ⇒  k = `, RA(f(k))] },
    };
  }

  // Ejemplos resueltos de la idea 1 (pestaña «Ejemplos», docs/teoria.md 4h). Cuentas rehechas aparte con sympy (scratchpad
  // de la sesión, e8-algebra/scripts/cuentas-ejemplos.py), sin el código de la unidad. Cada distractor de nivel 3 rehace
  // su error. Las letras de las respuestas de nivel 3 van C, A, B, D, E (una vez cada una en la idea). Ninguna figura
  // muestra lo que se pide.
  const EJEMPLOS_GRADO = [
    { nivel: 1, titulo: 'Producto cero',
      enunciado: ['Resuelve (x − 4)(x + 1) = 0.'],
      datos: [DD.prodCero],
      solucion: [{ texto: 'Un producto vale 0 si alguno de sus factores vale 0. Se iguala cada factor a 0.', ecuacion: ['x − 4 = 0  o  x + 1 = 0'] }],
      respuesta: [RA('x = 4'), ' o ', RA('x = −1')] },
    { nivel: 1, titulo: 'Tres factores',
      enunciado: ['¿Cuáles son las raíces de x(x − 3)(2x + 1) = 0?'],
      datos: [DD.prodCero],
      solucion: [
        { texto: 'Cada factor da una raíz: x = 0, x − 3 = 0 y 2x + 1 = 0.' },
        { texto: '2x + 1 = 0 pide 2x = −1.', ecuacion: ['x = ', { frac: ['−1', '2'] }] },
      ],
      respuesta: [RA('0'), ', ', RA('3'), ' y ', RA('−1/2')] },
    { nivel: 1, titulo: 'Una raíz repetida',
      enunciado: ['En (x − 5)³(x + 2) = 0, ¿cuántas veces se cuenta la raíz 5?'],
      datos: [DD.mult],
      solucion: [{ texto: 'El factor x − 5 tiene exponente 3: está tres veces en el producto. Por eso 5 es una raíz triple.' }],
      respuesta: [RA('3 veces'), ' (raíz triple)'] },
    { nivel: 1, titulo: 'El grado cuenta',
      enunciado: ['¿Cuántas raíces tiene x⁴ − 3x + 1 = 0, contando las repetidas y las no reales?'],
      datos: [DD.tfa, 'Grado: el mayor exponente de x'],
      solucion: [{ texto: 'El mayor exponente es 4: el polinomio es de grado 4. Tiene 4 raíces, aunque no se sepa cuáles son.' }],
      respuesta: [RA('4 raíces')] },
    { nivel: 1, titulo: 'Un largo que no puede ser',
      enunciado: ['Un pasadizo mide x dm de ancho y (x + 3) dm de largo, y cubre 28 dm². Por eso (x + 7)(x − 4) = 0. ¿Cuánto mide x?'],
      datos: [DD.prodCero, 'Una medida es un número positivo'],
      figura: RP({ objeto: 'pasadizo', ancho: [1, 0], largo: [1, 3], sobran: false }),
      solucion: [
        { texto: 'Producto cero: x = −7 o x = 4.' },
        { texto: '−7 cumple la ecuación, pero no es un ancho: un ancho es positivo.' },
      ],
      respuesta: [RA('x = 4 dm')] },
    { nivel: 2, titulo: 'Factorizar primero',
      enunciado: ['Resuelve x³ − 9x = 0.'],
      datos: [DD.prodCero, 'Factor común: lo que se repite en todos los términos', DD.difCuad],
      solucion: [
        { texto: 'Se saca el factor común x y queda una diferencia de cuadrados.', ecuacion: ['x³ − 9x = x(x² − 9) = x(x + 3)(x − 3)'] },
        { texto: 'Cada factor da una raíz.', ecuacion: ['x = 0;   x = −3;   x = 3'] },
      ],
      respuesta: [RA('0'), ', ', RA('−3'), ' y ', RA('3')] },
    { nivel: 2, titulo: 'Reales y no reales',
      enunciado: ['¿Cuántas raíces reales y cuántas no reales tiene (x − 2)(x² + 9) = 0?'],
      datos: [DD.prodCero, DD.cuadrado],
      solucion: [
        { texto: 'x − 2 = 0 da la raíz real 2.' },
        { texto: 'x² + 9 = 0 pide x² = −9: ningún real al cuadrado da −9. Ese factor de grado 2 aporta dos raíces no reales.' },
      ],
      respuesta: [RA('1 real y 2 no reales')] },
    { nivel: 2, titulo: 'Con el discriminante',
      enunciado: ['¿Cuántas raíces no reales tiene (x + 1)(x² − 2x + 5) = 0?'],
      datos: [DD.prodCero, DD.deltaTodo],
      solucion: [
        { texto: 'x + 1 da la raíz real −1. Para el trinomio, a = 1, b = −2 y c = 5.', ecuacion: ['Δ = (−2)² − 4 · 1 · 5 = −16'] },
        { texto: 'Δ es negativo: el trinomio da dos raíces no reales.' },
      ],
      respuesta: [RA('2 no reales')] },
    { nivel: 2, titulo: 'Repetidas y distintas',
      enunciado: ['P(x) = (x − 1)²(x + 3)³. ¿Cuántas raíces tiene contando las repetidas, y cuántas distintas?'],
      datos: [DD.mult, DD.tfa],
      solucion: [
        { texto: 'El 1 se cuenta 2 veces y el −3, 3 veces: es el grado de P.', ecuacion: ['2 + 3 = 5'] },
        { texto: 'Distintas hay dos: 1 y −3.' },
      ],
      respuesta: [RA('5 contando repetidas; 2 distintas')] },
    { nivel: 2, titulo: 'Agrupar y resolver',
      enunciado: ['¿Cuáles son las raíces reales de x³ − 2x² + 4x − 8 = 0?'],
      datos: [DD.prodCero, 'Agrupar: se juntan los términos de a dos y se saca el factor común de cada par', DD.cuadrado],
      solucion: [
        { texto: 'Del primer par sale x²; del segundo, 4. Los dos dejan x − 2.', ecuacion: ['x²(x − 2) + 4(x − 2) = (x − 2)(x² + 4)'] },
        { texto: 'x − 2 = 0 da 2. x² + 4 = 0 no tiene raíces reales: aporta dos no reales.' },
      ],
      respuesta: [RA('solo x = 2'), ' (las otras dos no son reales)'] },
    { nivel: 3, titulo: 'La cuarta raíz',
      enunciado: ['P(x) = (x − 2)³(x − k) tiene la raíz triple 2, y su término independiente es −24. ¿Cuánto vale k?'],
      alternativas: ['3', '−12', '−3', '−4', '−24'],
      datos: [DD.indep, 'P(0) es el producto de los factores con x = 0'],
      solucion: [
        { texto: 'Con x = 0, el factor (x − 2)³ deja (−2)³ = −8 y el otro deja −k.', ecuacion: ['P(0) = (−8)(−k) = 8k = −24'] },
        { texto: 'Se divide entre 8.', ecuacion: ['k = −24 ÷ 8 = ', RA('−3')] },
        { texto: ['La ', letra('A'), ' pierde un signo: −8k = −24 da 3. La ', letra('B'), ' usa el 2 una sola vez: 2k = −24 da −12.'] },
        { texto: ['La ', letra('D'), ' multiplica 3 · 2 en vez de elevar: 6k = −24 da −4. La ', letra('E'), ' toma el término independiente como si fuera k.'] },
      ],
      respuesta: [letra('C'), ', ', RA('k = −3')] },
    { nivel: 3, titulo: '¿Cuántas reales distintas?',
      enunciado: ['¿Cuántas raíces reales distintas tiene (x² − 4)(x − 2)(x² + x + 1) = 0?'],
      alternativas: ['2', '3', '5', '4', '1'],
      datos: [DD.prodCero, DD.difCuad, DD.deltaTodo],
      solucion: [
        { texto: 'x² − 4 = (x + 2)(x − 2): dan −2 y 2. El factor x − 2 vuelve a dar 2, la misma raíz.' },
        { texto: 'El trinomio no da reales.', ecuacion: ['Δ = 1² − 4 · 1 · 1 = −3'] },
        { texto: ['La ', letra('B'), ' cuenta el 2 dos veces: 3. La ', letra('C'), ' da el grado, 5, como si todas fueran reales distintas.'] },
        { texto: ['La ', letra('D'), ' cree que el trinomio da dos reales: 2 + 2 = 4. La ', letra('E'), ' solo ve el 2 del factor x − 2.'] },
      ],
      respuesta: [letra('A'), ', ', RA('2')] },
    { nivel: 3, titulo: 'Las que no se ven',
      enunciado: ['¿Cuántas raíces no reales tiene x⁵ − x = 0?'],
      alternativas: ['0', '2', '4', '1', '5'],
      datos: [DD.prodCero, DD.difCuad, DD.cuadrado],
      solucion: [
        { texto: 'Factor común y dos diferencias de cuadrados.', ecuacion: ['x⁵ − x = x(x⁴ − 1) = x(x² + 1)(x + 1)(x − 1)'] },
        { texto: 'x, x + 1 y x − 1 dan las reales 0, −1 y 1. Solo x² + 1 aporta raíces no reales: dos.' },
        { texto: ['La ', letra('A'), ' mira solo las tres reales de la gráfica: 0. La ', letra('C'), ' cree que x⁴ − 1 da cuatro no reales.'] },
        { texto: ['La ', letra('D'), ' cuenta una sola por x² + 1. La ', letra('E'), ' da el grado, 5.'] },
      ],
      respuesta: [letra('B'), ', ', RA('2')] },
    { nivel: 3, titulo: 'El largo del pasadizo',
      enunciado: ['Un pasadizo mide x dm de ancho y (x + 1) dm de largo, y cubre 12 dm². ¿Cuánto mide el largo?'],
      alternativas: ['3 dm', '−4 dm', '−3 dm', '4 dm', '12 dm'],
      datos: [DD.prodCero, 'Área de un rectángulo: ancho · largo', 'Una medida es un número positivo'],
      figura: RP({ objeto: 'pasadizo', ancho: [1, 0], largo: [1, 1], piezas: false, rotuloLargo: '?', sobran: false }),
      solucion: [
        { texto: 'x(x + 1) = 12 se pasa todo a un lado y se factoriza con aspa.', ecuacion: ['x² + x − 12 = (x + 4)(x − 3) = 0'] },
        { texto: 'x = −4 o x = 3; un ancho no es negativo, así que x = 3 y el largo es 3 + 1.', ecuacion: ['3 + 1 = ', RA('4')] },
        { texto: ['La ', letra('A'), ' da el ancho, 3. La ', letra('B'), ' toma la raíz −4, que no es una medida.'] },
        { texto: ['La ', letra('C'), ' suma 1 a −4: −3. La ', letra('E'), ' copia el área.'] },
      ],
      respuesta: [letra('D'), ', ', RA('4 dm')] },
    { nivel: 3, titulo: 'Las que faltan',
      enunciado: ['P es de grado 6. Sus raíces reales son 1, que es doble, −2 y 3; no tiene otras reales. ¿Cuántas raíces no reales tiene?'],
      alternativas: ['6', '3', '0', '4', '2'],
      datos: [DD.tfa, DD.mult],
      solucion: [
        { texto: 'Las reales, contando la doble dos veces, son 4.', ecuacion: ['2 + 1 + 1 = 4'] },
        { texto: 'El grado cuenta 6 en total: las demás no son reales.', ecuacion: ['6 − 4 = ', RA('2')] },
        { texto: ['La ', letra('A'), ' da el grado. La ', letra('B'), ' cuenta el 1 una sola vez: 6 − 3 = 3.'] },
        { texto: ['La ', letra('C'), ' cree que la gráfica muestra todas. La ', letra('D'), ' resta solo los 2 valores 1 y −2: 6 − 2 = 4.'] },
      ],
      respuesta: [letra('E'), ', ', RA('2')] },
  ];

  const grado = {
    id: 'grado-raices',
    titulo: 'Raíces y grado',
    pregunta: '¿Cuántas raíces tiene un polinomio de grado n?',
    temas: ['Teorema fundamental del álgebra'],
    pieza: 'ejes',
    aprendizaje: 'Cada factor que vale 0 da una raíz; una repetida cuenta tantas veces como su exponente y, con las no reales, suman el grado.',
    actividad: 'Subir y bajar una curva y contar sus raíces reales y no reales.',
    // Lee: el pasadizo (una ecuación y una raíz que no sirve), producto cero y raíz repetida, raíces no reales y qué mirar.
    // No dice cuántas no reales tiene un polinomio de grado 5 (la predicción) ni con qué c la curva toca el eje (la misión).
    lee: {
      tarjetas: [
        { titulo: 'El pasadizo de 15 dm²', texto: 'Rubén quiere un pasadizo de x dm de ancho y (x + 2) dm de largo que cubra 15 dm². Escribe x(x + 2) = 15, una ecuación. Un número que la cumple es una raíz: 3 lo es, porque 3 · 5 = 15.',
          pieza: 'alg-reparto', dibujo: RP({ objeto: 'pasadizo', ancho: [1, 0], largo: [1, 2], sobran: false }) },
        { titulo: 'Producto cero', texto: 'Un producto vale 0 solo si uno de sus factores vale 0. Por eso las raíces de (x − 1)(x + 2)(x − 3) = 0 son 1, −2 y 3: una por cada factor.',
          ecuacion: ['(x − 1)(x + 2)(x − 3) = 0'] },
        { titulo: 'Raíces que no se ven', texto: 'x² + 4 = 0 pide un número que al cuadrado dé −4, y ningún real lo hace. Igual tiene dos raíces: son raíces no reales, y la gráfica no las muestra.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a subir y bajar la curva de una cúbica. En cada posición, cuenta los puntos violeta y lee cuántas raíces no reales hay.' },
      ],
    },
    ejemplos: EJEMPLOS_GRADO,
    juega: {
      pieza: 'ejes',
      consigna: 'En el cuaderno de Rubén está la curva de y = x³ − 3x + d. Corta el eje x donde el polinomio vale 0.',
      mision: {
        texto: 'Haz que la curva toque el eje x sin cruzarlo.',
        logrado: v => v.c === 2,
        bien: 'Listo: la curva toca el eje en x = 1 sin cruzarlo: es una raíz doble.',
      },
      voz: 'Cuenta los puntos y mira cuántas raíces faltan para llegar a 3.',
      leyenda: [
        { s: RA('●'), t: 'raíz real: donde la curva toca el eje' },
        { s: CO('d'), t: 'término independiente: sube o baja la curva' },
        { s: 'doble', t: 'raíz que se cuenta dos veces' },
      ],
      controles: [{ id: 'c', etiqueta: 'd', color: 'c-o', min: 0, max: 4, paso: 1, inicio: 0, decimales: 0 }],
      dibujo: v => grafica1(v.c),
      lectura: v => lectura1(v.c),
      minimo: 3,
    },
    predice: {
      pregunta: 'Un polinomio de grado 5 tiene 3 raíces reales distintas, y ninguna se repite. ¿Cuántas raíces no reales tiene?',
      datos: ['Grado del polinomio: 5', 'Raíces reales: 3, cada una una sola vez'],
      voz: 'Piensa en lo que pasaba en el juego con las raíces que no se veían.',
      opciones: [
        { id: 'c', texto: '2', correcta: true },
        { id: 'cero', texto: '0', error: 'TAL-SOLO-REAL', siFuera: 'Bien que la gráfica muestra 3. Pero solo muestra las reales; el grado las cuenta todas.' },
        { id: 'espejo', texto: '3', error: 'TAL-NOREAL-ESPEJO', siFuera: 'Bien que faltan raíces. Pero 3 reales y 3 no reales serían 6, y el grado es 5.' },
        { id: 'grado', texto: '5', error: 'TAL-GRADO', siFuera: 'Bien que el grado cuenta las raíces. Pero cuenta todas juntas: las reales y las no reales.' },
      ],
      dibujo: ejes5([]),
      revelar: ejes5([-2, 0, 2].map(v => ({ x: v, y: 0, color: 'f', rotulo: f(v) }))),
      coincide: 'Coincide: 5 raíces en total; se ven 3 y las otras 2 no son reales.',
      noCoincide: 'Revisemos: el grado cuenta todas las raíces, y la gráfica solo muestra las reales.',
    },
    mira: {
      pieza: 'ejes',
      datos: Object.assign({ ajustado: true }, EJES1, { y: { min: -12, max: 12, paso: 4, nombre: 'y', decimales: 0 },
        curvas: [{ puntos: curva(v => v * v * v - v * v + 4 * v - 4, -3, 3, -12, 12), color: null }],
        puntos: [{ x: 1, y: 0, color: 'f', rotulo: 'x = 1', desde: 3 }],
        alt: 'Curva de x³ − x² + 4x − 4: corta el eje x una sola vez, en x = 1' }),
      voz: 'Grado 3 y un solo corte: ¿dónde están las otras dos?',
      pasos: [
        { estado: { corte: 1 }, texto: 'Grado 3, pero la curva corta el eje una sola vez.', ecuacion: ['P(x) = x³ − x² + 4x − 4'] },
        { estado: { corte: 2 }, texto: 'Se agrupa de a dos: sale x − 1 común.', ecuacion: ['x²(x − 1) + 4(x − 1) = (x − 1)(x² + 4)'] },
        { estado: { corte: 3 }, texto: 'Producto cero: x − 1 = 0 da la raíz real 1.', ecuacion: ['x − 1 = 0  ⇒  ', RA('x = 1')] },
        { estado: { corte: 3 }, texto: 'x² + 4 = 0 no tiene raíces reales: su discriminante es negativo.', ecuacion: ['Δ = 0² − 4 · 1 · 4 = −16'] },
        { estado: { corte: 3 }, texto: 'Ese factor aporta dos raíces no reales: tres en total, como el grado.', ecuacion: ['1 + 2 = 3'] },
      ],
    },
    regla: {
      texto: 'Teorema fundamental del álgebra: un polinomio de grado n ≥ 1 tiene n raíces, si cada repetida se cuenta tantas veces como su exponente y se cuentan también las no reales.',
      ecuacion: ['P(x) = ', { llave: ['a(x − ', RX(1), ')…(x − ', { v: 'c-f', t: 'xₙ', m: 'raíz' }, ')'], nota: 'a: coeficiente principal; n factores' }],
      condicion: 'n ≥ 1; una raíz de multiplicidad 2 cuenta dos veces; un factor de grado 2 sin raíces reales da dos no reales.',
      // El dibujo de la regla junta lo de Mira (x³ − x² + 4x − 4) con la cuenta del teorema (notas de la sesión, 19 nov).
      dibujo: TB({ columnas: ['factor', 'raíces'], colorCol: [null, 'f'], filas: [['x − 1', '1 real: x = 1'], ['x² + 4', '2 no reales'], [{ t: 'grado 3', fuerte: true }, { t: '1 + 2 = 3', fuerte: true }]],
        alt: 'x³ − x² + 4x − 4 = (x − 1)(x² + 4): una raíz real y dos no reales; 1 + 2 = 3, el grado' }),
      voz: 'La gráfica solo muestra las reales; el grado las cuenta todas.',
    },
    // Así se resuelve: cuántas reales y cuántas no reales de un P factorizado. «Ahora tú» pide el total, las reales
    // distintas, las no reales con Δ y el número de una raíz triple.
    resuelve: {
      pieza: 'ejes',
      generar(s) {
        const r = azar(s + 900);
        let q = null; while (!q) q = factorizado1(r);
        const coefs = mult(mult(desdeRaices([...Array(q.m).fill(q.a), ...Array(q.k).fill(-q.b)]), [1]), [1, 0, q.c]);
        const p = v => evaluar(coefs, v), lo = -q.b - 1, hi = q.a + 1;
        // Escala fija (lector A, 20 nov): con la escala del mayor valor (2 808) los rótulos del eje se cortaban y la curva
        // iba pegada al eje cerca de las raíces. Lo que se sale de ±40 se corta.
        const ymax = 40, paso = 20;
        const graf = conPuntos => EJ({ x: { min: lo, max: hi, paso: 1, nombre: 'x', decimales: 0 }, y: { min: -ymax, max: ymax, paso, nombre: 'y', decimales: 0 },
          curvas: [{ puntos: curva(p, lo, hi, -ymax, ymax), color: null }],
          puntos: conPuntos ? [{ x: q.a, y: 0, color: 'f', rotulo: f(q.a) }, { x: -q.b, y: 0, color: 'f', rotulo: f(-q.b) }] : [],
          alt: conPuntos ? `Curva de P: corta o toca el eje x solo en ${f(q.a)} y ${f(-q.b)}` : 'Curva de P en el cuaderno, sin marcar dónde toca el eje x' });
        const reales = q.m + q.k;
        return {
          enunciado: [`P(x) = ${q.P}. ¿Cuántas raíces reales tiene, contando las repetidas, y cuántas no reales?`],
          datos: [DD.prodCero, DD.mult, DD.cuadrado],
          dibujo: graf(false),
          pasos: [
            { tipo: 'pide', texto: 'Piden dos números: las raíces reales, contando cada repetida, y las no reales.' },
            { tipo: 'datos', texto: `P ya está factorizado: ${binx(q.a)} con exponente ${q.m}, ${binx(-q.b)} con exponente ${q.k}, y x² + ${q.c}.` },
            { tipo: 'regla', texto: 'Producto cero: cada factor que vale 0 da raíces; un factor con exponente m las da m veces.' },
            { tipo: 'cuentas', texto: `${binx(q.a)} da ${f(q.a)}, contado ${q.m} ${q.m === 1 ? 'vez' : 'veces'}; ${binx(-q.b)} da ${f(-q.b)}, contado ${q.k} ${q.k === 1 ? 'vez' : 'veces'}.`, ecuacion: [`${q.m} + ${q.k} = `, RA(f(reales))], dibujo: graf(true) },
            { tipo: 'cuentas', texto: `x² + ${q.c} = 0 pide x² = −${q.c}: ningún real al cuadrado es negativo. Aporta dos raíces no reales.` },
            { tipo: 'sentido', texto: `El grado de P es ${q.m} + ${q.k} + 2 = ${q.total}: ${reales} reales y 2 no reales completan ${q.total}.` },
          ],
          respuesta: [RA(`${reales} reales`), ' y ', RA('2 no reales')],
        };
      },
    },
    ahoraTu: {
      voz: 'Cada factor aporta tantas raíces como su grado.',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoTotal, r);
        if (tipo === 1) return conCuatro(casoDistintas, r);
        if (tipo === 2) return conCuatro(casoNoReales, r);
        return conCuatro(casoTriple, r);
      },
    },
  };

  // ---------- Idea 2: raíces y coeficientes (Cardano-Vieta) ----------
  // Objeto: la caja de cartón de Rubén (pieza alg-caja, nueva): sus tres aristas son las raíces de
  // (x − largo)(x − ancho)(x − alto). Cambia: las tres aristas, de 1 a 5 dm. · Permanece: a = 1. · Progresa: los
  // coeficientes del polinomio. · Se reserva: a ≠ 1 y un producto negativo (la predicción: 2x³ − 6x² + 4x + 10). · Debe
  // verse: −b es la suma de las aristas y −d, el volumen.
  // Errores (hipótesis de diseño): TAL-SIGNO-VIETE no cambia el signo (toma b/a o d/a) · TAL-NORMALIZA no divide entre a
  // · TAL-PRODUCTO lee otro coeficiente · TAL-PIDE responde otra cosa (la tercera raíz) · TAL-VIETE-UNA usa una sola
  // pareja · TAL-INVERSOS-AL-REVES invierte la fracción · AL11 eleva la suma como si fuera la suma de cubos.
  const VJ = [1, 2, 3];
  const VJ0 = [1, 2, 4];   // el juego arranca aquí: suma 7 y producto 8 (con 1, 2 y 3 los dos valían 6; lector A)
  const cajaJ2 = v => CJ({ medidas: [v.l, v.w, v.h], color: 'f', tope: [5, 5, 5], arriba: [['volumen: ', null, 400], [`${v.l * v.w * v.h} dm³`, null, 700]] });
  function lectura2(v) {
    const rs = [v.l, v.w, v.h], c = desdeRaices(rs);
    return [`${poli(c)}: `, RA(rs.join(' + ')), ` = ${f(-c[1])};   `, RA(rs.join(' · ')), ` = ${f(-c[3])}`];
  }
  const tablaCoef = (cs, extra, fila) => TB({ columnas: ['a', 'b', 'c', 'd', ...extra], colorCol: ['o', 'o', 'o', 'o', null],
    filas: [[...cs.map(c => f(c)), ...fila]], alt: `Coeficientes a, b, c y d: ${cs.map(c => f(c)).join(', ')}` });
  // Una cúbica a(x − r₁)(x − r₂)(x − r₃) con raíces enteras chicas.
  function cubicaV(r, aOpc = [2, 3]) {
    const a = r.uno(aOpc), rs = [r.noCero(-4, 5), r.noCero(-4, 5), r.noCero(-4, 5)];
    const cs = desdeRaices(rs, a);
    if (cs.some(v => v === 0) || cs.some(v => Math.abs(v) > 90)) return null;
    const S = rs[0] + rs[1] + rs[2], M = rs[0] * rs[1] + rs[0] * rs[2] + rs[1] * rs[2], V = rs[0] * rs[1] * rs[2];
    return { a, rs, cs, S, M, V };
  }
  function casoSuma(r) {
    const q = cubicaV(r); if (!q || q.S === 0) return null;
    return {
      pregunta: [`¿Cuánto suman las tres raíces de ${poli(q.cs)} = 0?`],
      datos: [DD.vieta, DD.vieta2, DD.vieta3],
      opciones: ops([
        { id: 'c', texto: f(q.S), correcta: true },
        { id: 'sin-a', texto: f(q.a * q.S), error: 'TAL-NORMALIZA', siFuera: `Bien cambiar el signo de b. Pero falta dividir entre a = ${q.a}.` },
        { id: 'signo', texto: f(-q.S), error: 'TAL-SIGNO-VIETE', siFuera: `Bien dividir entre a = ${q.a}. Pero la suma es −b/a: el signo de b cambia.` },
        { id: 'otro', texto: f(q.M), error: 'TAL-PRODUCTO', siFuera: `Bien dividir entre a. Pero ${f(q.cs[2])}/${q.a} sale de c: es la suma de productos de a dos.` },
      ]),
      solucion: { texto: `La suma es −b/a, con b = ${f(q.cs[1])} y a = ${q.a}.`, ecuacion: [`${menosDe(q.cs[1])}/${q.a} = `, RA(f(q.S))] },
    };
  }
  function casoProducto(r) {
    const q = cubicaV(r); if (!q || q.V === 0 || q.S === q.V || q.S === -q.V) return null;
    return {
      pregunta: [`¿Cuánto vale el producto de las tres raíces de ${poli(q.cs)} = 0?`],
      datos: [DD.vieta, DD.vieta2, DD.vieta3],
      opciones: ops([
        { id: 'c', texto: f(q.V), correcta: true },
        { id: 'signo', texto: f(-q.V), error: 'TAL-SIGNO-VIETE', siFuera: `Bien dividir entre a = ${q.a}. Pero en grado 3 el producto es −d/a: el signo de d cambia.` },
        { id: 'sin-a', texto: f(q.a * q.V), error: 'TAL-NORMALIZA', siFuera: `Bien cambiar el signo de d. Pero falta dividir entre a = ${q.a}.` },
        { id: 'suma', texto: f(q.S), error: 'TAL-PRODUCTO', siFuera: `Bien dividir entre a. Pero ${f(-q.cs[1])}/${q.a} sale de b: es la suma de las raíces.` },
      ]),
      solucion: { texto: `El producto es −d/a, con d = ${f(q.cs[3])} y a = ${q.a}.`, ecuacion: [`${menosDe(q.cs[3])}/${q.a} = `, RA(f(q.V))] },
    };
  }
  function casoInversos(r) {
    const q = cubicaV(r, [1, 2]); if (!q || q.V === 0 || q.M === 0 || q.S === 0 || Math.abs(q.M) === Math.abs(q.V)) return null;
    return {
      pregunta: [`x₁, x₂ y x₃ son las raíces de ${poli(q.cs)} = 0. ¿Cuánto vale 1/x₁ + 1/x₂ + 1/x₃?`],
      datos: [DD.vieta, DD.vieta2, DD.vieta3, DD.inversos],
      opciones: ops([
        { id: 'c', texto: fr(q.M, q.V), correcta: true },
        { id: 'signo', texto: fr(-q.M, q.V), error: 'TAL-SIGNO-VIETE', siFuera: `Bien la fracción de a dos sobre el producto. Pero el producto es −d/a = ${f(q.V)}, con su signo.` },
        { id: 'reves', texto: fr(q.V, q.M), error: 'TAL-INVERSOS-AL-REVES', siFuera: `Bien usar los de a dos y el producto. Pero arriba va ${f(q.M)} y abajo ${f(q.V)}.` },
        { id: 'suma', texto: fr(1, q.S), error: 'TAL-PRODUCTO', siFuera: `Bien la suma, ${f(q.S)}. Pero la suma de los inversos no es el inverso de la suma.` },
      ]),
      solucion: { texto: 'Con denominador común, arriba quedan los productos de a dos y abajo el producto.', ecuacion: [{ frac: [f(q.M), par(q.V)] }, ' = ', RA(fr(q.M, q.V))] },
    };
  }
  // Ahora tú 4 (nivel examen, San Marcos 2027-I con otros números): dos raíces dadas, el coeficiente de x.
  function casoTercera(r) {
    const rs = r.mezclar([1, 2, 3, 4, 5, -1, -2, -3]).slice(0, 3), S = rs[0] + rs[1] + rs[2], V = rs[0] * rs[1] * rs[2];
    const M = rs[0] * rs[1] + rs[0] * rs[2] + rs[1] * rs[2];
    if (S === 0 || M === 0) return null;
    const ec = `x³ ${S > 0 ? '−' : '+'} ${Math.abs(S) === 1 ? '' : Math.abs(S)}x² + kx ${V > 0 ? '−' : '+'} ${Math.abs(V)} = 0`;
    return {
      pregunta: [`La ecuación ${ec} tiene las raíces ${f(rs[0])} y ${f(rs[1])}. ¿Cuánto vale k?`],
      datos: [DD.vieta, DD.vieta2, DD.vieta3],
      opciones: ops([
        { id: 'c', texto: f(M), correcta: true },
        { id: 'tercera', texto: f(rs[2]), error: 'TAL-PIDE', siFuera: `Bien la tercera raíz, ${f(rs[2])}, con la suma. Pero k es la suma de los productos de a dos.` },
        { id: 'signo', texto: f(-M), error: 'TAL-SIGNO-VIETE', siFuera: 'Bien los productos de a dos. Pero el de x es c/a, sin cambiar el signo.' },
        { id: 'una', texto: f(rs[0] * rs[1]), error: 'TAL-VIETE-UNA', siFuera: `Bien multiplicar ${f(rs[0])} por ${f(rs[1])}. Pero son tres parejas: falta la tercera raíz.` },
      ]),
      solucion: { texto: `La suma da la tercera: ${f(S)} − ${par(rs[0])} − ${par(rs[1])} = ${f(rs[2])}. k suma los productos de a dos.`,
        ecuacion: [`${par(rs[0])} · ${par(rs[1])} + ${par(rs[0])} · ${par(rs[2])} + ${par(rs[1])} · ${par(rs[2])} = `, RA(f(M))] },
    };
  }

  // Ejemplos de la idea 2. Cuentas rehechas aparte (cuentas-ejemplos.py). Letras de nivel 3: C, A, B, D, E.
  const EJEMPLOS_VIETE = [
    { nivel: 1, titulo: 'La suma de las raíces',
      enunciado: ['¿Cuánto suman las tres raíces de x³ − 7x² + 2x + 5 = 0?'],
      datos: [DD.vieta, DD.vieta2, DD.vieta3],
      solucion: [{ texto: 'Aquí a = 1 y b = −7. La suma es −b/a.', ecuacion: ['−(−7)/1 = 7'] }],
      respuesta: [RA('7')] },
    { nivel: 1, titulo: 'El producto',
      enunciado: ['¿Cuánto vale el producto de las tres raíces de x³ + 4x² − x − 6 = 0?'],
      datos: [DD.vieta, DD.vieta2, DD.vieta3],
      solucion: [{ texto: 'Aquí a = 1 y d = −6. El producto es −d/a: el signo de d cambia.', ecuacion: ['−(−6)/1 = 6'] }],
      respuesta: [RA('6')] },
    { nivel: 1, titulo: 'Los productos de a dos',
      enunciado: ['En x³ − 2x² − 5x + 6 = 0, ¿cuánto suman los productos de sus raíces de a dos?'],
      datos: [DD.vieta, DD.vieta2, DD.vieta3],
      solucion: [{ texto: 'Aquí a = 1 y c = −5. Los productos de a dos suman c/a, sin cambiar el signo.', ecuacion: ['−5/1 = −5'] }],
      respuesta: [RA('−5')] },
    { nivel: 1, titulo: 'Con a distinto de 1',
      enunciado: ['¿Cuánto suman las tres raíces de 3x³ − 12x² + x − 2 = 0?'],
      datos: [DD.vieta, DD.vieta2, DD.vieta3],
      solucion: [{ texto: 'Aquí a = 3 y b = −12: se cambia el signo de b y se divide entre a.', ecuacion: ['−(−12)/3 = 12/3 = 4'] }],
      respuesta: [RA('4')] },
    { nivel: 1, titulo: 'El volumen de una caja',
      enunciado: ['Las tres aristas de una caja, en dm, son las raíces de x³ − 10x² + 31x − 30 = 0. ¿Cuál es su volumen?'],
      datos: [DD.vieta, DD.vieta2, DD.vieta3, 'Volumen de una caja: largo · ancho · alto'],
      figura: CJ({ medidas: [2, 3, 5], rotulos: ['?', '?', '?'], arriba: [['volumen: ?', null, 700]] }),
      solucion: [{ texto: 'El volumen es el producto de las aristas, que son las raíces: −d/a.', ecuacion: ['−(−30)/1 = 30'] }],
      respuesta: [RA('30 dm³')] },
    { nivel: 2, titulo: 'La tercera raíz',
      enunciado: ['Dos raíces de x³ − 4x² + x + 6 = 0 son 2 y 3. ¿Cuál es la tercera?'],
      datos: [DD.vieta, DD.vieta2, DD.vieta3],
      solucion: [
        { texto: 'Las tres suman −b/a.', ecuacion: ['x₁ + x₂ + x₃ = −(−4)/1 = 4'] },
        { texto: 'Se restan las dos que se conocen.', ecuacion: ['4 − 2 − 3 = ', RA('−1')] },
      ],
      respuesta: [RA('−1')] },
    { nivel: 2, titulo: 'Suma de inversos',
      enunciado: ['x₁, x₂ y x₃ son las raíces de 2x³ − 3x² − 8x + 12 = 0. ¿Cuánto vale 1/x₁ + 1/x₂ + 1/x₃?'],
      datos: [DD.vieta, DD.vieta2, DD.vieta3, DD.inversos],
      solucion: [
        { texto: 'Los productos de a dos suman c/a y el producto es −d/a.', ecuacion: ['−8/2 = −4;   −12/2 = −6'] },
        { texto: 'Se dividen.', ecuacion: [{ frac: ['−4', '−6'] }, ' = ', RA('2/3')] },
      ],
      respuesta: [RA('2/3')] },
    { nivel: 2, titulo: 'Suma de cuadrados',
      enunciado: ['x₁, x₂ y x₃ son las raíces de x³ + x² − 10x + 8 = 0. ¿Cuánto vale x₁² + x₂² + x₃²?'],
      datos: [DD.vieta, DD.vieta2, DD.vieta3, DD.cuadSuma],
      solucion: [
        { texto: 'La suma es −1 y los productos de a dos suman −10.' },
        { texto: 'Se despeja la suma de cuadrados.', ecuacion: ['(−1)² − 2 · (−10) = 1 + 20 = ', RA('21')] },
      ],
      respuesta: [RA('21')] },
    { nivel: 2, titulo: 'El cartón de la caja',
      enunciado: ['Las aristas de una caja, en dm, son las raíces de x³ − 8x² + 19x − 12 = 0. ¿Cuántos dm² de cartón tienen sus seis caras?'],
      datos: [DD.vieta, DD.vieta2, DD.vieta3, 'Cartón de una caja: 2(largo · ancho + largo · alto + ancho · alto)'],
      figura: CJ({ medidas: [1, 3, 4], rotulos: ['?', '?', '?'] }),
      solucion: [
        { texto: 'Lo de adentro del paréntesis es la suma de los productos de a dos de las aristas: c/a = 19.' },
        { texto: 'Se multiplica por 2.', ecuacion: ['2 · 19 = ', RA('38')] },
      ],
      respuesta: [RA('38 dm²')] },
    { nivel: 2, titulo: 'Un producto fraccionario',
      enunciado: ['¿Cuánto vale el producto de las raíces de 2x³ + 5x² − 4x − 3 = 0?'],
      datos: [DD.vieta, DD.vieta2, DD.vieta3],
      solucion: [
        { texto: 'Aquí a = 2 y d = −3. Se cambia el signo de d: queda 3.' },
        { texto: 'Se divide entre a.', ecuacion: ['−(−3)/2 = ', RA('3/2')] },
      ],
      respuesta: [RA('3/2')] },
    { nivel: 3, titulo: 'El coeficiente de x',
      enunciado: ['La ecuación x³ − 9x² + kx − 15 = 0 tiene las raíces 1 y 3. ¿Cuánto vale k?'],
      alternativas: ['5', '3', '23', '−23', '15'],
      datos: [DD.vieta, DD.vieta2, DD.vieta3],
      solucion: [
        { texto: 'La suma de las tres es 9: la tercera es 9 − 1 − 3 = 5.' },
        { texto: 'k es c/a: la suma de los productos de a dos.', ecuacion: ['1 · 3 + 1 · 5 + 3 · 5 = 3 + 5 + 15 = ', RA('23')] },
        { texto: ['La ', letra('A'), ' da la tercera raíz, 5. La ', letra('B'), ' usa una sola pareja: 1 · 3 = 3.'] },
        { texto: ['La ', letra('D'), ' cambia el signo, como en la suma. La ', letra('E'), ' toma el producto de las tres, 15.'] },
      ],
      respuesta: [letra('C'), ', ', RA('k = 23')] },
    { nivel: 3, titulo: 'Suma de cubos',
      enunciado: ['x₁, x₂ y x₃ son las raíces de x³ − 5x² + 2x + 8 = 0. ¿Cuánto vale x₁³ + x₂³ + x₃³?'],
      alternativas: ['71', '125', '119', '95', '131'],
      datos: [DD.vieta, DD.vieta2, DD.vieta3, 'x₁³ + x₂³ + x₃³ = (x₁ + x₂ + x₃)³ − 3(x₁ + x₂ + x₃)(x₁x₂ + x₁x₃ + x₂x₃) + 3x₁x₂x₃'],
      solucion: [
        { texto: 'La suma es 5, los productos de a dos suman 2 y el producto es −8.' },
        { texto: 'Se reemplaza en la identidad.', ecuacion: ['5³ − 3 · 5 · 2 + 3 · (−8) = 125 − 30 − 24 = ', RA('71')] },
        { texto: ['La ', letra('B'), ' toma (5)³ como si fuera la suma de cubos. La ', letra('C'), ' usa el producto con signo +: 125 − 30 + 24 = 119.'] },
        { texto: ['La ', letra('D'), ' olvida el último término: 125 − 30 = 95. La ', letra('E'), ' cambia el signo de los de a dos: 125 + 30 − 24 = 131.'] },
      ],
      respuesta: [letra('A'), ', ', RA('71')] },
    { nivel: 3, titulo: 'Raíces en progresión',
      enunciado: ['Las raíces de x³ − 12x² + kx − 28 = 0 están en progresión aritmética: x₂ es el promedio de x₁ y x₃. ¿Cuánto vale k?'],
      alternativas: ['4', '39', '28', '−39', '35'],
      datos: [DD.vieta, DD.vieta2, DD.vieta3, 'Promedio de x₁ y x₃: (x₁ + x₃)/2'],
      solucion: [
        { texto: 'La suma es 12 y x₁ + x₃ = 2x₂, así que 3x₂ = 12 y x₂ = 4. El producto, 28, da x₁x₃ = 7; con x₁ + x₃ = 8 son 1 y 7.' },
        { texto: 'k es la suma de los productos de a dos.', ecuacion: ['1 · 4 + 1 · 7 + 4 · 7 = 4 + 7 + 28 = ', RA('39')] },
        { texto: ['La ', letra('A'), ' da la raíz del medio, 4. La ', letra('C'), ' da el producto de las tres, 28.'] },
        { texto: ['La ', letra('D'), ' cambia el signo. La ', letra('E'), ' olvida la pareja 1 · 4: 7 + 28 = 35.'] },
      ],
      respuesta: [letra('B'), ', ', RA('k = 39')] },
    { nivel: 3, titulo: 'La diagonal de la caja',
      enunciado: ['Las aristas de una caja, en dm, son las raíces de x³ − 12x² + 47x − 60 = 0. ¿Cuánto mide su diagonal?'],
      alternativas: ['√238 dm', '12 dm', '√97 dm', '5√2 dm', '50 dm'],
      datos: [DD.vieta, DD.vieta2, DD.vieta3, DD.cuadSuma, 'Diagonal de una caja: √(largo² + ancho² + alto²)', 'Una raíz se simplifica así: √(A² · B) = A√B, como √12 = √(4 · 3) = 2√3'],
      figura: CJ({ medidas: [3, 4, 5], rotulos: ['?', '?', '?'] }),
      solucion: [
        { texto: 'Las tres medidas suman 12 y sus productos de a dos suman 47. La suma de sus cuadrados:', ecuacion: ['12² − 2 · 47 = 144 − 94 = 50'] },
        { texto: 'La diagonal es su raíz cuadrada, simplificada.', ecuacion: ['√50 = √(25 · 2) = ', RA('5√2')] },
        { texto: ['La ', letra('A'), ' suma en vez de restar: √(144 + 94) = √238. La ', letra('B'), ' da la suma de las aristas.'] },
        { texto: ['La ', letra('C'), ' resta 47 una sola vez: √97. La ', letra('E'), ' olvida la raíz: 50.'] },
      ],
      respuesta: [letra('D'), ', ', RA('5√2 dm')] },
    { nivel: 3, titulo: 'Un coeficiente por la suma',
      enunciado: ['Las tres raíces de 2x³ + kx² − 3x + 5 = 0 suman 4. ¿Cuánto vale k?'],
      alternativas: ['8', '−4', '−2', '4', '−8'],
      datos: [DD.vieta, DD.vieta2, DD.vieta3],
      solucion: [
        { texto: 'La suma es −b/a, con b = k y a = 2.', ecuacion: ['−k/2 = 4'] },
        { texto: 'Se multiplica por −2.', ecuacion: ['k = 4 · (−2) = ', RA('−8')] },
        { texto: ['La ', letra('A'), ' olvida el signo: k/2 = 4. La ', letra('B'), ' olvida a: −k = 4.'] },
        { texto: ['La ', letra('C'), ' divide 4 entre −2 en vez de multiplicar. La ', letra('D'), ' copia la suma.'] },
      ],
      respuesta: [letra('E'), ', ', RA('k = −8')] },
  ];

  const viete = {
    id: 'viete',
    titulo: 'Raíces y coeficientes',
    pregunta: '¿Qué dicen los coeficientes sobre las raíces?',
    temas: ['Relaciones entre raíces y coeficientes'],
    pieza: 'alg-caja',
    aprendizaje: 'En ax³ + bx² + cx + d = 0, las raíces suman −b/a, sus productos de a dos suman c/a y su producto es −d/a.',
    actividad: 'Armar una caja de cartón y comparar su polinomio con sus aristas y su volumen.',
    // Lee: la caja cuyas aristas son raíces, los coeficientes, los productos de a dos y qué mirar. No dice qué pasa con
    // a ≠ 1 ni con el signo del producto (la predicción) ni qué caja da x³ − 9x² + 26x − 24 (la misión).
    lee: {
      tarjetas: [
        { titulo: 'La caja de Rubén', texto: 'Rubén arma cajas de cartón para guardar losetas. Esta mide 1 dm de largo, 2 dm de ancho y 3 dm de alto. El polinomio (x − 1)(x − 2)(x − 3) vale 0 justo cuando x es 1, 2 o 3, sus medidas.',
          pieza: 'alg-caja', dibujo: CJ({ medidas: VJ, color: 'f' }) },
        { titulo: 'Los coeficientes', texto: 'Ese polinomio, desarrollado, es x³ − 6x² + 11x − 6. En ax³ + bx² + cx + d, los números a, b, c y d son sus coeficientes; a es el coeficiente principal.',
          ecuacion: ['(x − 1)(x − 2)(x − 3) = x³ − 6x² + 11x − 6'] },
        { titulo: 'Productos de a dos', texto: 'Con tres raíces x₁, x₂ y x₃ se arman tres parejas: x₁x₂, x₁x₃ y x₂x₃. Al sumar esos tres productos sale la suma de productos de a dos.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia las aristas de la caja. Compara los números del polinomio con la suma de las aristas y con el volumen.' },
      ],
    },
    ejemplos: EJEMPLOS_VIETE,
    juega: {
      pieza: 'alg-caja',
      consigna: 'Rubén arma cajas de cartón. El polinomio (x − largo)(x − ancho)(x − alto) vale 0 cuando x es el largo, el ancho o el alto.',
      mision: {
        texto: 'Arma la caja cuyo polinomio es x³ − 9x² + 26x − 24.',
        logrado: v => [v.l, v.w, v.h].sort((p, q) => p - q).join() === '2,3,4',
        bien: 'Listo: aristas de 2, 3 y 4 dm. Suman 9 y el volumen es 24.',
      },
      voz: 'Mira qué número del polinomio cambia cuando agrandas una arista.',
      leyenda: [
        { s: RA('largo, ancho, alto'), t: 'las aristas, en dm: las raíces' },
        { s: 'volumen', t: 'largo · ancho · alto, en dm³' },
        { s: 'x', t: 'la incógnita del polinomio' },
      ],
      controles: [
        { id: 'l', etiqueta: 'Largo (dm)', color: 'c-f', min: 1, max: 5, paso: 1, inicio: VJ0[0], decimales: 0 },
        { id: 'w', etiqueta: 'Ancho (dm)', color: 'c-f', min: 1, max: 5, paso: 1, inicio: VJ0[1], decimales: 0 },
        { id: 'h', etiqueta: 'Alto (dm)', color: 'c-f', min: 1, max: 5, paso: 1, inicio: VJ0[2], decimales: 0 },
      ],
      dibujo: v => cajaJ2(v),
      lectura: v => lectura2(v),
      minimo: 3,
    },
    predice: {
      pregunta: 'En 2x³ − 6x² + 4x + 10 = 0, ¿cuánto vale el producto de sus tres raíces?',
      datos: ['2x³ − 6x² + 4x + 10 = 2(x³ − 3x² + 2x + 5)'],
      voz: 'Mira qué hay dentro del paréntesis.',
      opciones: [
        { id: 'c', texto: '−5', correcta: true },
        { id: 'signo', texto: '5', error: 'TAL-SIGNO-VIETE', siFuera: 'Bien mirar el paréntesis. Pero en la caja, el volumen era el último número con el signo cambiado.' },
        { id: 'normaliza', texto: '−10', error: 'TAL-NORMALIZA', siFuera: 'Bien el signo cambiado. Pero el 2 de adelante multiplica todo y no cambia las raíces.' },
        { id: 'suma', texto: '3', error: 'TAL-PRODUCTO', siFuera: 'Bien mirar el paréntesis. Pero 3 sale del −3 de x²: es la suma de las raíces.' },
      ],
      dibujo: tablaCoef([2, -6, 4, 10], ['producto'], [{ t: '?', hueco: true }]),
      revelar: Object.assign(tablaCoef([2, -6, 4, 10], ['producto'], [{ t: '−5', color: 'f', fuerte: true }]), { }),
      coincide: 'Coincide: dentro del paréntesis el producto es −5, y el 2 de adelante no cambia las raíces.',
      noCoincide: 'Revisemos: el 2 de adelante no cambia las raíces; dentro del paréntesis, el producto es el último número con el signo cambiado.',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: { columnas: ['cuenta', 'con las raíces', 'en P'], colorCol: [null, 'f', 'o'], filas: [
        [{ t: 'suma' }, { t: '1 + 2 + 3 = 6', desde: 2 }, { t: 'b = −6', desde: 2 }],
        [{ t: 'de a dos' }, { t: '2 + 3 + 6 = 11', desde: 3 }, { t: 'c = 11', desde: 3 }],
        [{ t: 'producto' }, { t: '1 · 2 · 3 = 6', desde: 4 }, { t: 'd = −6', desde: 4 }],
      ], alt: 'Suma, productos de a dos y producto de las raíces 1, 2 y 3, junto a b, c y d de x³ − 6x² + 11x − 6' },
      voz: 'Cada coeficiente guarda una cuenta de las raíces.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La caja de 1, 2 y 3 dm: su polinomio, desarrollado.', ecuacion: ['(x − 1)(x − 2)(x − 3) = x³ − 6x² + 11x − 6'] },
        { estado: { corte: 2 }, texto: 'La suma de las raíces es b con el signo cambiado.', ecuacion: [RA('1 + 2 + 3'), ' = 6 = −(−6)'] },
        { estado: { corte: 3 }, texto: 'Los productos de a dos suman c, sin cambiar el signo.', ecuacion: [RA('1 · 2 + 1 · 3 + 2 · 3'), ' = 11'] },
        { estado: { corte: 4 }, texto: 'El producto de las tres es d con el signo cambiado.', ecuacion: [RA('1 · 2 · 3'), ' = 6 = −(−6)'] },
        { estado: { corte: 4 }, texto: 'Con todo multiplicado por 2, las raíces no cambian: se divide entre a.', ecuacion: ['2x³ − 12x² + 22x − 12:   ', { frac: ['12', '2'] }, ' = 6'] },
      ],
    },
    regla: {
      texto: 'En ax³ + bx² + cx + d = 0, las raíces x₁, x₂ y x₃ suman −b/a, sus productos de a dos suman c/a y su producto es −d/a.',
      ecuacion: [RX(1), ' + ', RX(2), ' + ', RX(3), ' = ', { frac: [['−', CO('b')], CO('a')] }],
      condicion: 'a ≠ 0; vale con raíces repetidas o no reales. En grado 2, las raíces suman −b/a y multiplican c/a.',
      voz: 'Los signos alternan: menos, más, menos.',
      dibujo: TB({ columnas: ['de las raíces', 'se lee en P'], colorCol: ['f', 'o'], filas: [['suma', '−b/a'], ['productos de a dos', 'c/a'], ['producto', '−d/a']],
        alt: 'La suma de las raíces es −b/a; los productos de a dos suman c/a; el producto es −d/a' }),
    },
    // Así se resuelve: la suma de cuadrados de las raíces. «Ahora tú» pide la suma, el producto, la suma de inversos y el
    // coeficiente de x con dos raíces dadas.
    resuelve: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s + 900);
        let q = null; while (!q || q.S === 0) q = cubicaV(r, [1, 2]);
        const cuad = q.S * q.S - 2 * q.M;
        return {
          enunciado: [`x₁, x₂ y x₃ son las raíces de ${poli(q.cs)} = 0. Sin hallarlas, ¿cuánto vale x₁² + x₂² + x₃²?`],
          datos: [DD.vieta, DD.vieta2, DD.vieta3, DD.cuadSuma],
          dibujo: tablaCoef(q.cs, ['suma', 'de a dos'], [{ t: '?', hueco: true }, { t: '?', hueco: true }]),
          pasos: [
            { tipo: 'pide', texto: 'Piden la suma de los cuadrados de las raíces, sin hallar cada una.' },
            { tipo: 'datos', texto: `Los coeficientes: a = ${q.a}, b = ${f(q.cs[1])}, c = ${f(q.cs[2])} y d = ${f(q.cs[3])}.` },
            { tipo: 'regla', texto: 'Cardano-Vieta da la suma y los productos de a dos; el cuadrado de la suma los junta.' },
            { tipo: 'cuentas', texto: 'La suma es −b/a y los productos de a dos suman c/a.', ecuacion: [`${menosDe(q.cs[1])}/${q.a} = ${f(q.S)};   ${f(q.cs[2])}/${q.a} = ${f(q.M)}`],
              dibujo: tablaCoef(q.cs, ['suma', 'de a dos'], [f(q.S), f(q.M)]) },
            { tipo: 'cuentas', texto: 'Se despeja la suma de cuadrados del dato.', ecuacion: [`${par(q.S)}² − 2 · ${par(q.M)} = `, RA(f(cuad))] },
            { tipo: 'sentido', texto: `Este polinomio sale de las raíces ${q.rs.map(v => f(v)).join(', ')}: sus cuadrados suman ${q.rs.map(v => f(v * v)).join(' + ')} = ${f(cuad)}.` },
          ],
          respuesta: [RA(f(cuad))],
        };
      },
    },
    ahoraTu: {
      voz: 'Primero mira qué cuenta te piden; después, qué coeficientes usa.',
      generar(sem) {
        const r = azar(sem + 41), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoSuma, r);
        if (tipo === 1) return conCuatro(casoProducto, r);
        if (tipo === 2) return conCuatro(casoInversos, r);
        return conCuatro(casoTercera, r);
      },
    },
  };

  // ---------- Idea 3: raíces racionales ----------
  // Objeto: la caja de 60 dm³ (Lee, alg-caja) y la tabla de Ruffini del cuaderno de Rubén (juego, alg-reparto
  // 'cuaderno'). Cambia: el número que se prueba, de la lista ±1, ±3, ±1/2, ±3/2. · Permanece: P = 2x³ − 7x² + 2x + 3
  // (principal 2, independiente 3). · Progresa: la fila de abajo y el resto. · Se reserva: los papeles cambiados
  // (la predicción: principal 3 e independiente 2, donde 3/2 ya no puede ser). · Debe verse: solo 1, 3 y −1/2 dejan resto
  // 0; los números de la lista salen del 3 (arriba) y del 2 (abajo).
  // Errores (hipótesis de diseño): TAL-PQ-INVERTIDO arma la fracción al revés · TAL-PQ-SIGNO cree que un negativo no
  // puede ser · TAL-PQ-ENTERO cree que un entero no es p/q · TAL-CAND-SIGNO cuenta los candidatos sin los dos signos ·
  // TAL-CAND-REPITE cuenta fracciones repetidas sin reducir · TAL-OLVIDA-PRINC prueba solo los divisores del
  // independiente · TAL-FACTOR-SIGNO toma la raíz con el signo del factor · TAL-PIDE responde otra cosa · TAL-SUMA suma
  // aristas · TAL-NOES-CAND da un número que ni es candidato.
  const PJ3 = [2, -7, 2, 3];                                  // (x − 1)(x − 3)(2x + 1)
  const CANDS3 = candidatos(PJ3);
  function cuaderno3(cs, p, q, cabeza = true) {
    const { abajo, medio } = ruffiniFrac(cs, p, q), n = cs.length;
    return RP({ objeto: 'cuaderno', tipo: 'ruffini', coefs: cs.map(c => f(c)), a: { t: fr(p, q), c: 'i' },
      medio: medio.map(([u, w]) => fr(u, w)), abajo: abajo.map(([u, w], k) => ({ t: fr(u, w), c: null, fuerte: k === n - 1 })),
      flechas: false, cabeza: cabeza ? [[[`P(x) = ${poli(cs)}`, null, 400]]] : undefined });
  }
  const restoDe = (cs, p, q) => { const ab = ruffiniFrac(cs, p, q).abajo, [u, w] = ab[ab.length - 1]; return [u, w]; };
  function lectura3(k) {
    const [p, q] = CANDS3[k], [u, w] = restoDe(PJ3, p, q);
    return ['P(', NP(fr(p, q)), `) = ${fr(u, w)}`, u === 0 ? ': resto 0, es raíz' : ': el resto no es 0'];
  }
  const DR = {
    cand: 'Candidatos: ± (divisor del término independiente)/(divisor del coeficiente principal)',
    valor: 'Un número es raíz de P si P vale 0 en él',
    volumen: 'Volumen de una caja: largo · ancho · alto',
    medida: 'Una medida es un número positivo',
  };
  // Ahora tú 1: cuál NO puede ser raíz racional (otro principal y otro independiente que la predicción).
  function casoNoPuede(r) {
    const L = r.uno([2, 3, 4, 5]), C = r.uno([2, 3, 5, 6, 7]) * r.uno([1, -1]);
    if ((L === 3 && Math.abs(C) === 2) || mcdN(L, C) !== 1) return null;
    const validos = candidatos([L, 0, 0, C]).filter(([p, q]) => !(p === 1 && q === 1));
    const malas = [];
    for (const p of [L, 2 * L, L * 3]) for (const q of divisores(C)) if (mcdN(p, q) === 1 && Math.abs(C) % p !== 0) malas.push([p * (r.uno([1, -1])), q]);
    if (!malas.length) return null;
    const mala = r.uno(malas), [m1, m2, m3] = r.mezclar(validos).slice(0, 3);
    if (!m3) return null;
    const exp = ([p, q]) => (q === 1 ? `${fr(p, 1)} sí puede: es ${fr(p, 1)}/1, y ${Math.abs(p)} divide a ${Math.abs(C)}.` : `${fr(p, q)} sí puede: ${Math.abs(p)} divide a ${Math.abs(C)} y ${q} divide a ${L}.`);
    const cod = ([p, q]) => (q === 1 ? 'TAL-PQ-ENTERO' : p < 0 ? 'TAL-PQ-SIGNO' : 'TAL-PQ-INVERTIDO');
    return {
      pregunta: [`Un polinomio con coeficientes enteros tiene coeficiente principal ${L} y término independiente ${f(C)}. ¿Cuál de estos números NO puede ser una raíz suya?`],
      datos: [DD.racional, `Divisores de ${Math.abs(C)}: ${divisores(C).join(', ')}`, `Divisores de ${L}: ${divisores(L).join(', ')}`],
      opciones: ops([
        { id: 'c', texto: fr(mala[0], mala[1]), correcta: true },
        ...[m1, m2, m3].map((m, i) => ({ id: `v${i}`, texto: fr(m[0], m[1]), error: cod(m), siFuera: `Bien revisar la lista. Pero ${exp(m)}` })),
      ]),
      solucion: { texto: `Arriba va un divisor de ${Math.abs(C)}; ${Math.abs(mala[0])} no lo es.`, ecuacion: [RA(fr(mala[0], mala[1])), ' no es candidato'] },
    };
  }
  // Ahora tú 2: cuántos candidatos hay.
  function casoCuantos(r) {
    const L = r.uno([2, 3, 4]), C = r.uno([4, 6, 8, 9, 10, 12]) * r.uno([1, -1]), B = r.noCero(-5, 5), D = r.noCero(-6, 6);
    const cs = [L, B, D, C], n = candidatos(cs).length, dp = divisores(C).length, dq = divisores(L).length;
    if (mcdN(mcdN(L, B), mcdN(D, C)) !== 1) return null;
    return {
      pregunta: [`¿Cuántos candidatos a raíz racional tiene ${poli(cs)} = 0?`],
      datos: [DD.racional, DR.cand, 'Fracciones que valen lo mismo, como 2/2 y 1, son un solo candidato'],
      opciones: ops([
        { id: 'c', texto: f(n), correcta: true },
        { id: 'signo', texto: f(n / 2), error: 'TAL-CAND-SIGNO', siFuera: `Bien las fracciones de divisores. Pero cada una va con + y con −: son el doble.` },
        { id: 'repite', texto: f(2 * dp * dq), error: 'TAL-CAND-REPITE', siFuera: `Bien con los dos signos. Pero ${2 * dp * dq} cuenta fracciones que valen lo mismo, como 2/2 y 1.` },
        { id: 'enteros', texto: f(2 * dp), error: 'TAL-OLVIDA-PRINC', siFuera: `Bien los divisores de ${Math.abs(C)} con los dos signos. Pero faltan las fracciones entre divisores de ${L}.` },
      ]),
      solucion: { texto: `Divisores de ${Math.abs(C)} entre divisores de ${L}, reducidos y sin repetir, con los dos signos.`, ecuacion: [`2 · ${n / 2} = `, RA(f(n))] },
    };
  }
  // Ahora tú 3: una raíz entera dada; las otras dos (una puede ser fracción).
  function casoOtras(r) {
    const e = r.noCero(-4, 4), q = r.uno([1, 2, 2, 3]), p = r.noCero(-5, 5), s = r.noCero(-4, 4);
    if (mcdN(p, q) !== 1 || p === q * e || s === e || p === q * s || (q === 1 && Math.abs(p) === Math.abs(s))) return null;
    const cs = mult(mult([1, -e], [q, -p]), [1, -s]);
    if (cs.some(v => Math.abs(v) > 60)) return null;
    const par2 = (u, w) => (u === w ? null : `${u} y ${w}`);   // «−3 y −3» no es una pareja de raíces
    const bien = par2(fr(p, q), f(s));
    return {
      pregunta: [`x = ${f(e)} es raíz de ${poli(cs)} = 0. ¿Cuáles son las otras dos raíces?`],
      datos: [DD.ruf, DD.baja, DD.prodCero],
      opciones: ops([
        { id: 'c', texto: bien, correcta: true },
        { id: 'signo', texto: par2(fr(-p, q), f(-s)), error: 'TAL-FACTOR-SIGNO', siFuera: `Bien el trinomio de Ruffini. Pero ${binx(s)} = 0 da ${f(s)}: el signo cambia al despejar.` },
        q > 1 ? { id: 'principal', texto: par2(f(p), f(s)), error: 'TAL-OLVIDA-PRINC', siFuera: `Bien los factores. Pero ${poli([q, -p])} = 0 da x = ${fr(p, q)}: falta dividir entre ${q}.` }
          : { id: 'una', texto: par2(f(e), f(s)), error: 'TAL-PIDE', siFuera: `Bien ${f(s)}. Pero ${f(e)} ya se conocía: falta la otra.` },
        { id: 'reves', texto: par2(fr(q, p), f(s)), error: 'TAL-PQ-INVERTIDO', siFuera: `Bien ${f(s)}. Pero la otra es ${fr(p, q)}: arriba el número, abajo el ${q === 1 ? '1' : q}.` },
      ]),
      solucion: { texto: `Ruffini con ${f(e)} deja un trinomio; se abre con aspa.`, ecuacion: [`${poli(cs)} = (${binx(e)})(${poli(mult([q, -p], [1, -s]))})`] },
    };
  }
  // Ahora tú 4 (nivel examen, San Marcos 2019-I y 2024-II con otros números): la caja por tanteo.
  function casoCaja(r) {
    const x0 = r.ent(2, 6), al = r.ent(1, 4), be = r.ent(1, 5);
    if (al === be || (x0 === 3 && al + be === 3) || (x0 === 4 && al + be === 3)) return null;
    const V = x0 * (x0 + al) * (x0 + be), mayor = x0 + Math.max(al, be);
    return {
      pregunta: [`Una caja mide x dm de largo, (x + ${al}) dm de ancho y (x + ${be}) dm de alto, y guarda ${f(V)} dm³. ¿Cuánto mide su arista mayor?`],
      datos: [DR.volumen, 'Números por probar: los divisores del término independiente', DR.medida],
      opciones: ops([
        { id: 'c', texto: `${mayor} dm`, correcta: true },
        { id: 'x', texto: `${x0} dm`, error: 'TAL-PIDE', siFuera: `Bien x = ${x0}. Pero se pide la arista mayor: x + ${Math.max(al, be)}.` },
        { id: 'otra', texto: `${x0 + Math.min(al, be)} dm`, error: 'TAL-PIDE', siFuera: `Bien x = ${x0}. Pero x + ${Math.min(al, be)} es la arista del medio.` },
        { id: 'suma', texto: `${3 * x0 + al + be} dm`, error: 'TAL-SUMA', siFuera: `Bien las tres aristas. Pero ${3 * x0 + al + be} es su suma, no la mayor.` },
      ]),
      solucion: { texto: `Se prueba x = ${x0}: el producto da ${f(V)}. Las otras raíces no son positivas.`, ecuacion: [`${x0} · ${x0 + al} · ${x0 + be} = ${f(V)}`] },
    };
  }

  // Ejemplos de la idea 3. Cuentas rehechas aparte (cuentas-ejemplos.py). Letras de nivel 3: C, A, B, D, E.
  const EJEMPLOS_RACIONALES = [
    { nivel: 1, titulo: 'Los candidatos',
      enunciado: ['¿Cuáles son los candidatos a raíz racional de x³ − 2x² − x + 2 = 0?'],
      datos: [DD.racional, DR.cand],
      solucion: [{ texto: 'El principal es 1: abajo solo va 1. Arriba van los divisores de 2, con los dos signos.' }],
      respuesta: [RA('±1 y ±2')] },
    { nivel: 1, titulo: 'Con principal 2',
      enunciado: ['¿Cuáles son los candidatos a raíz racional de 2x³ + x² − 1 = 0?'],
      datos: [DD.racional, DR.cand],
      solucion: [{ texto: 'Arriba, divisores de 1: solo 1. Abajo, divisores de 2: 1 y 2. Con los dos signos.' }],
      respuesta: [RA('±1 y ±1/2')] },
    { nivel: 1, titulo: '¿Es raíz?',
      enunciado: ['¿Es 2 una raíz de x³ − 3x² + 4 = 0?'],
      datos: [DR.valor],
      solucion: [{ texto: 'Se reemplaza x por 2.', ecuacion: ['2³ − 3 · 2² + 4 = 8 − 12 + 4 = 0'] }],
      respuesta: [RA('Sí'), ': con x = 2, vale 0'] },
    { nivel: 1, titulo: 'Un número que no puede ser',
      enunciado: ['¿Puede 4 ser una raíz racional de x³ + 2x − 3 = 0?'],
      datos: [DD.racional],
      solucion: [{ texto: 'El principal es 1, así que una raíz racional tiene que ser un divisor de 3: 1 o 3, con su signo. 4 no divide a 3.' }],
      respuesta: [RA('No'), ': 4 no divide a 3'] },
    { nivel: 1, titulo: 'Una fracción que sí',
      enunciado: ['¿Es 1/2 una raíz de 2x² + 3x − 2 = 0?'],
      datos: [DR.valor],
      solucion: [{ texto: 'Se reemplaza x por 1/2: 2 · 1/4 = 1/2.', ecuacion: ['1/2 + 3/2 − 2 = 0'] }],
      respuesta: [RA('Sí'), ': vale 0'] },
    { nivel: 2, titulo: 'Bajar el grado',
      enunciado: ['x³ + 2x² − 5x − 6 = 0 tiene la raíz 2. ¿Cuáles son las otras dos?'],
      datos: [DD.ruf, DD.baja, DD.prodCero],
      figura: RP({ objeto: 'cuaderno', tipo: 'ruffini', coefs: ['1', '2', '−5', '−6'], a: { t: '2', c: 'i' }, medio: ['2', '8', '6'], abajo: [{ t: '1' }, { t: '4' }, { t: '3' }, { t: '0', fuerte: true }] }),
      solucion: [
        { texto: 'Ruffini con 2: la fila de abajo es 1, 4, 3 y el resto 0.', ecuacion: ['x³ + 2x² − 5x − 6 = (x − 2)(x² + 4x + 3)'] },
        { texto: 'El trinomio se abre con aspa.', ecuacion: ['x² + 4x + 3 = (x + 1)(x + 3)'] },
      ],
      respuesta: [RA('−1'), ' y ', RA('−3')] },
    { nivel: 2, titulo: 'Todas las raíces',
      enunciado: ['Resuelve x³ − 7x + 6 = 0.'],
      datos: [DD.racional, DD.ruf, DD.prodCero],
      solucion: [
        { texto: 'Candidatos: ±1, ±2, ±3, ±6. Con 1, el resto es 0.', ecuacion: ['1 − 7 + 6 = 0'] },
        { texto: 'Ruffini con 1 deja x² + x − 6, que se abre con aspa.', ecuacion: ['x³ − 7x + 6 = (x − 1)(x + 3)(x − 2)'] },
      ],
      respuesta: [RA('1'), ', ', RA('−3'), ' y ', RA('2')] },
    { nivel: 2, titulo: 'La raíz que no es entera',
      enunciado: ['¿Cuál es la raíz no entera de 2x³ − x² − 2x + 1 = 0?'],
      datos: [DD.agrupar, DD.prodCero],
      solucion: [
        { texto: 'Se agrupa de a dos: del primer par sale x², del segundo −1.', ecuacion: ['x²(2x − 1) − (2x − 1) = (2x − 1)(x² − 1)'] },
        { texto: 'x² − 1 da 1 y −1, enteras. 2x − 1 = 0 da la fracción.', ecuacion: ['x = ', RA('1/2')] },
      ],
      respuesta: [RA('1/2')] },
    { nivel: 2, titulo: 'Lo que queda, con la fórmula',
      enunciado: ['Resuelve x³ − 3x² + x + 1 = 0.'],
      datos: [DD.racional, DD.ruf, DD.general, DD.deltaDef],
      solucion: [
        { texto: 'Con 1 el resto es 0: 1 − 3 + 1 + 1 = 0. Ruffini deja x² − 2x − 1.' },
        { texto: 'Ese trinomio no se abre con aspa: se usa la fórmula general, con Δ = 4 + 4 = 8 y √8 = 2√2.', ecuacion: ['x = (2 ± 2√2)/2 = 1 ± √2'] },
      ],
      respuesta: [RA('1'), ', ', RA('1 + √2'), ' y ', RA('1 − √2')] },
    { nivel: 2, titulo: 'Un parámetro',
      enunciado: ['x³ + kx² − 4x + 12 = 0 tiene la raíz 2. ¿Cuánto vale k?'],
      datos: [DR.valor],
      solucion: [
        { texto: 'Con x = 2 el polinomio vale 0.', ecuacion: ['8 + 4k − 8 + 12 = 4k + 12 = 0'] },
        { texto: 'Se despeja k.', ecuacion: ['k = −12 ÷ 4 = ', RA('−3')] },
      ],
      respuesta: [RA('k = −3')] },
    { nivel: 3, titulo: 'La que no puede ser',
      enunciado: ['Un polinomio con coeficientes enteros empieza con 4x³ y termina en − 3. ¿Cuál de estos números NO puede ser una raíz suya?'],
      alternativas: ['3/4', '−1/2', '4/3', '3/2', '−1'],
      datos: [DD.racional, 'Divisores de 3: 1 y 3', 'Divisores de 4: 1, 2 y 4'],
      solucion: [
        { texto: 'Arriba va un divisor de 3 (1 o 3) y abajo uno de 4 (1, 2 o 4).' },
        { texto: '4/3 tiene un 4 arriba, que no divide a 3: no puede ser.', ecuacion: [RA('4/3'), ': 4 no divide a 3'] },
        { texto: ['La ', letra('A'), ' sí puede: 3 divide a 3 y 4 a 4. La ', letra('B'), ' también: el signo no cuenta, 1 divide a 3 y 2 a 4.'] },
        { texto: ['La ', letra('D'), ' sí puede: 3 y 2. La ', letra('E'), ' es −1/1: también puede.'] },
      ],
      respuesta: [letra('C'), ', ', RA('4/3')] },
    { nivel: 3, titulo: '¿Cuántos candidatos?',
      enunciado: ['¿Cuántos candidatos a raíz racional tiene 2x³ − x² + 5x + 6 = 0?'],
      alternativas: ['12', '6', '16', '8', '4'],
      datos: [DD.racional, DR.cand, 'Fracciones que valen lo mismo, como 2/2 y 1, son un solo candidato'],
      solucion: [
        { texto: 'Arriba, divisores de 6: 1, 2, 3, 6. Abajo, 1 o 2. Salen 1, 2, 3, 6, 1/2 y 3/2; 2/2 y 6/2 se repiten.' },
        { texto: 'Con los dos signos, el doble.', ecuacion: ['2 · 6 = ', RA('12')] },
        { texto: ['La ', letra('B'), ' olvida los negativos: 6. La ', letra('C'), ' cuenta 2/2 y 6/2 aparte: 2 · 4 · 2 = 16.'] },
        { texto: ['La ', letra('D'), ' prueba solo enteros: ±1, ±2, ±3, ±6. La ', letra('E'), ' cuenta solo los divisores de 6.'] },
      ],
      respuesta: [letra('A'), ', ', RA('12')] },
    { nivel: 3, titulo: 'Una caja de 120 dm³',
      enunciado: ['Una caja mide x dm por (x + 1) dm por (x + 2) dm, y guarda 120 dm³. ¿Cuánto mide su arista mayor?'],
      alternativas: ['4 dm', '6 dm', '5 dm', '15 dm', '120 dm'],
      datos: [DR.volumen, 'Números por probar: los divisores del término independiente', DR.medida, DD.ruf, DD.delta],
      figura: CJ({ medidas: [3, 3.6, 4.2], rotulos: ['x', 'x + 1', 'x + 2'], arriba: [['volumen: ', null, 400], ['120 dm³', null, 700]] }),
      solucion: [
        { texto: 'x(x + 1)(x + 2) = 120 se pasa todo a un lado: x³ + 3x² + 2x − 120 = 0. Se prueban divisores de 120.' },
        { texto: 'x = 4 cumple: 4 · 5 · 6 = 120. Ruffini deja x² + 7x + 30, con Δ = 49 − 120 < 0: no hay otra raíz real. La mayor es x + 2.', ecuacion: ['4 + 2 = ', RA('6')] },
        { texto: ['La ', letra('A'), ' da x = 4. La ', letra('C'), ' da la arista del medio, 5.'] },
        { texto: ['La ', letra('D'), ' suma las tres: 4 + 5 + 6 = 15. La ', letra('E'), ' copia el volumen.'] },
      ],
      respuesta: [letra('B'), ', ', RA('6 dm')] },
    { nivel: 3, titulo: 'Un parámetro y las raíces',
      enunciado: ['P(x) = x³ − 2x² + kx + 6 tiene la raíz 3. ¿Cuál es la menor raíz de P?'],
      alternativas: ['−5', '1', '−3', '−2', '2'],
      datos: [DR.valor, DD.ruf, DD.prodCero],
      solucion: [
        { texto: 'P(3) = 0 fija k.', ecuacion: ['27 − 18 + 3k + 6 = 3k + 15 = 0  ⇒  k = −5'] },
        { texto: 'Ruffini con 3 en x³ − 2x² − 5x + 6 deja x² + x − 2 = (x + 2)(x − 1). Las raíces son 3, −2 y 1.' },
        { texto: ['La ', letra('A'), ' da k. La ', letra('B'), ' da la menor positiva. La ', letra('C'), ' cambia el signo del 3.'] },
        { texto: ['La ', letra('E'), ' toma el 2 de x + 2 sin cambiar el signo.'] },
      ],
      respuesta: [letra('D'), ', ', RA('−2')] },
    { nivel: 3, titulo: 'La raíz fraccionaria',
      enunciado: ['¿Cuál es la raíz que no es entera de 3x³ + 2x² − 7x + 2 = 0?'],
      alternativas: ['3', '−1/3', '2/3', '1/2', '1/3'],
      datos: [DD.racional, DR.cand, DD.ruf],
      solucion: [
        { texto: 'Candidatos: ±1, ±2, ±1/3, ±2/3. Con 1 el resto es 0; Ruffini deja 3x² + 5x − 2 = (3x − 1)(x + 2).' },
        { texto: 'Las raíces son 1, −2 y la fracción.', ecuacion: ['3x − 1 = 0  ⇒  x = ', RA('1/3')] },
        { texto: ['La ', letra('A'), ' invierte la fracción. La ', letra('B'), ' cambia el signo. La ', letra('C'), ' es candidato, pero P(2/3) = 8/9 + 8/9 − 14/3 + 2 = −8/9.'] },
        { texto: ['La ', letra('D'), ' ni es candidato: 2 no divide a 3.'] },
      ],
      respuesta: [letra('E'), ', ', RA('1/3')] },
  ];

  const racionales = {
    id: 'raices-racionales',
    titulo: 'Raíces racionales',
    pregunta: '¿Qué fracciones pueden ser raíces de un polinomio con coeficientes enteros?',
    temas: ['Raíces racionales'],
    pieza: 'alg-reparto',
    aprendizaje: 'Si una fracción reducida es raíz de un polinomio con coeficientes enteros, su numerador divide al término independiente y su denominador, al principal.',
    actividad: 'Probar números en la tabla de Ruffini hasta hallar la raíz que no es entera.',
    // Lee: la caja de 60 dm³, fracciones reducidas, candidato no es raíz y qué mirar. No dice de dónde salen el numerador
    // y el denominador de un candidato (la predicción) ni cuál deja resto 0 (la misión).
    lee: {
      tarjetas: [
        { titulo: 'Una caja de 60 dm³', texto: 'Rubén quiere una caja de x dm por (x + 1) dm por (x + 2) dm que guarde 60 dm³. Tiene que resolver x(x + 1)(x + 2) = 60, o sea x³ + 3x² + 2x − 60 = 0.',
          pieza: 'alg-caja', dibujo: CJ({ medidas: [2.6, 3.2, 3.8], rotulos: ['x', 'x + 1', 'x + 2'], arriba: [['volumen: ', null, 400], ['60 dm³', null, 700]] }) },
        { titulo: 'Fracciones de enteros', texto: 'Un número racional se escribe como fracción de enteros: 1/2, −3 o 2/3. La fracción está reducida si arriba y abajo no tienen divisores comunes: 4/6 se reduce a 2/3.' },
        { titulo: 'Candidato no es raíz', texto: 'Probar todos los números no termina nunca: se arma una lista corta de candidatos. Un candidato es raíz solo si, en la tabla de Ruffini, el resto sale 0.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a probar candidatos en la tabla de Ruffini de 2x³ − 7x² + 2x + 3. Mira cuáles dejan resto 0 y de dónde salen los números de la lista.' },
      ],
    },
    ejemplos: EJEMPLOS_RACIONALES,
    juega: {
      pieza: 'alg-reparto',
      consigna: 'Rubén prueba números en la tabla de Ruffini de 2x³ − 7x² + 2x + 3. Su lista: arriba, divisores del 3; abajo, del 2.',
      mision: {
        texto: 'Encuentra la raíz que no es un número entero.',
        logrado: v => { const [p, q] = CANDS3[v.k]; return q === 2 && p === -1; },
        bien: 'Listo: −1/2 deja resto 0. Las otras dos raíces, 1 y 3, son enteras.',
      },
      voz: 'Prueba también las fracciones de la lista.',
      leyenda: [
        { s: NP('a la izquierda'), t: 'el número que se prueba: un candidato' },
        { s: 'resto', t: 'la última casilla: P de ese número' },
      ],
      controles: [{ id: 'k', etiqueta: 'Número que se prueba', opciones: CANDS3.map(([p, q], i) => ({ valor: i, texto: fr(p, q) })) }],
      dibujo: v => { const [p, q] = CANDS3[v.k]; return cuaderno3(PJ3, p, q); },
      lectura: v => lectura3(v.k),
      minimo: 3,
    },
    predice: {
      pregunta: 'Un polinomio con coeficientes enteros empieza con 3x³ y termina en + 2. ¿Cuál de estos números NO puede ser una raíz suya?',
      datos: ['Divisores de 2: 1 y 2', 'Divisores de 3: 1 y 3'],
      voz: 'Recuerda de dónde salían los números de la lista del juego.',
      opciones: [
        { id: 'c', texto: '3/2', correcta: true },
        { id: 'dos-tercios', texto: '2/3', error: 'TAL-PQ-INVERTIDO', siFuera: 'Bien buscar divisores. Pero 2/3 sí puede: 2 divide al 2 del final y 3 al 3 de adelante.' },
        { id: 'tercio', texto: '−1/3', error: 'TAL-PQ-SIGNO', siFuera: 'Bien mirar los divisores. Pero el signo no importa: 1 divide a 2 y 3 divide a 3.' },
        { id: 'dos', texto: '2', error: 'TAL-PQ-ENTERO', siFuera: 'Bien que 2 divide al 2 del final. Por eso sí puede: es 2/1, y 1 divide a 3.' },
      ],
      dibujo: TB({ columnas: ['número', '¿puede ser raíz?'], filas: [['3/2', { t: '?', hueco: true }], ['2/3', { t: '?', hueco: true }], ['−1/3', { t: '?', hueco: true }], ['2', { t: '?', hueco: true }]],
        alt: 'Cuatro números por revisar: 3/2, 2/3, −1/3 y 2' }),
      revelar: TB({ columnas: ['número', '¿puede ser raíz?'], filas: [[{ t: '3/2', color: 'f', fuerte: true }, { t: 'no: 3 no divide a 2', marca: 'no' }], ['2/3', { t: 'sí', marca: 'ok' }], ['−1/3', { t: 'sí', marca: 'ok' }], ['2', { t: 'sí', marca: 'ok' }]],
        alt: 'Solo 3/2 no puede: arriba va un divisor de 2 y abajo uno de 3' }),
      coincide: 'Coincide: arriba va un divisor de 2 y abajo uno de 3; 3/2 tiene un 3 arriba.',
      noCoincide: 'Revisemos: arriba va un divisor del término independiente, 2, y abajo uno del principal, 3.',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: { columnas: ['número', 'P(número)'], colorCol: ['i', null], filas: [
        [{ t: '1' }, { t: '0: es raíz', desde: 2 }],
        [{ t: '−1' }, { t: '−8', desde: 2 }],
        [{ t: '3' }, { t: '0: es raíz', desde: 4 }],
        [{ t: '−1/2' }, { t: '0: es raíz', desde: 4 }],
      ], alt: 'Candidatos de 2x³ − 7x² + 2x + 3 y el valor de P en cada uno: 1, 3 y −1/2 dan 0' },
      voz: 'Primero la lista; después, cada raíz baja el grado.',
      pasos: [
        { estado: { corte: 1 }, texto: 'En 2x³ − 7x² + 2x + 3: arriba, un divisor de 3; abajo, uno de 2.', ecuacion: ['±1;   ±3;   ±1/2;   ±3/2'] },
        { estado: { corte: 2 }, texto: 'Con 1 el resto es 0: 1 es raíz.', ecuacion: ['P(1) = 2 − 7 + 2 + 3 = 0'] },
        { estado: { corte: 3 }, texto: 'Ruffini con 1 baja el grado: queda un trinomio.', ecuacion: ['2x³ − 7x² + 2x + 3 = (x − 1)(2x² − 5x − 3)'] },
        { estado: { corte: 4 }, texto: 'El trinomio se abre con aspa.', ecuacion: ['2x² − 5x − 3 = (2x + 1)(x − 3)'] },
        { estado: { corte: 4 }, texto: 'Tres raíces para grado 3, y las tres estaban en la lista.', ecuacion: [RA('1'), ', ', RA('3'), ' y ', RA('−1/2')] },
      ],
    },
    regla: {
      texto: 'Si una fracción reducida p/q es raíz de un polinomio con coeficientes enteros, p divide al término independiente y q al coeficiente principal. Cada raíz hallada baja el grado.',
      ecuacion: ['candidatos = ± ', { frac: ['divisores del independiente', 'divisores del principal'] }],
      condicion: 'los coeficientes son enteros y la fracción está reducida; un candidato es raíz solo si el resto sale 0.',
      voz: 'La lista es corta, pero cada candidato se comprueba.',
      dibujo: cuaderno3(PJ3, -1, 2),
    },
    // Así se resuelve: la raíz no entera de una cúbica con principal 2 o 3. «Ahora tú» pide cuál no puede ser, cuántos
    // candidatos hay, las otras dos raíces y la arista mayor de una caja.
    resuelve: {
      pieza: 'alg-reparto',
      generar(s) {
        const r = azar(s + 900);
        let q, p, e, t, cs;
        do {
          q = r.uno([2, 3]); p = r.noCero(-5, 5); e = r.noCero(-3, 4); t = r.noCero(-4, 4);
          cs = mult(mult([q, -p], [1, -e]), [1, -t]);
        } while (mcdN(p, q) !== 1 || e === t || cs.some(v => v === 0 || Math.abs(v) > 60));
        const mala = candidatos(cs).find(([u, w]) => w > 1 && valorFrac(cs, u, w) !== 0);
        const [mu, mw] = restoDe(cs, mala[0], mala[1]);
        return {
          enunciado: [`¿Cuál es la raíz que no es entera de ${poli(cs)} = 0?`],
          datos: [DD.racional, DR.cand, DD.ruf],
          dibujo: RP({ objeto: 'cuaderno', tipo: 'ruffini', coefs: cs.map(c => f(c)), a: { hueco: true }, medio: ['', '', ''], abajo: ['', '', '', ''], cabeza: [[[`P(x) = ${poli(cs)}`, null, 400]]] }),
          pasos: [
            { tipo: 'pide', texto: 'Piden la raíz que es una fracción, no un entero.' },
            { tipo: 'datos', texto: `Los coeficientes son enteros: el principal es ${q} y el término independiente, ${f(cs[3])}.` },
            { tipo: 'regla', texto: `Una raíz racional p/q tiene p que divide a ${Math.abs(cs[3])} y q que divide a ${q}. La no entera lleva q = ${q}.` },
            { tipo: 'cuentas', texto: `Se prueba ${fr(mala[0], mala[1])}: el resto no es 0, así que no es raíz.`, ecuacion: [`P(${fr(mala[0], mala[1])}) = ${fr(mu, mw)}`], dibujo: cuaderno3(cs, mala[0], mala[1]) },
            { tipo: 'cuentas', texto: `Se prueba ${fr(p, q)}: el resto es 0.`, ecuacion: [`P(`, RA(fr(p, q)), ') = 0'], dibujo: cuaderno3(cs, p, q) },
            { tipo: 'sentido', texto: `La fila de abajo, entre ${q}, da (${binx(e)})(${binx(t)}): las otras dos raíces son ${f(e)} y ${f(t)}, enteras.` },
          ],
          respuesta: [RA(fr(p, q))],
        };
      },
    },
    ahoraTu: {
      voz: 'Arriba, un divisor del término independiente; abajo, uno del principal.',
      generar(sem) {
        const r = azar(sem + 51), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoNoPuede, r);
        if (tipo === 1) return conCuatro(casoCuantos, r);
        if (tipo === 2) return conCuatro(casoOtras, r);
        return conCuatro(casoCaja, r);
      },
    },
  };

  // ---------- Idea 4: raíces en pareja (paridad de raíces) ----------
  // Objeto: el huerto cuadrado de 2 m² del colegio (Lee, alg-objeto 'huertos') y la tabla de la raíz 2 + √3 con la
  // compañera que se elige (juego, alg-tabla). Cambia: la compañera. · Permanece: la raíz 2 + √3. · Progresa: la suma, el
  // producto y el factor (x − raíz)(x − compañera). · Se reserva: una raíz con i (la predicción: 2 + 3i). · Debe verse:
  // solo la conjugada da suma y producto enteros.
  // Errores (hipótesis de diseño): TAL-CONJ-REAL cambia el signo del número sin √ ni i (trampa de San Marcos 2027-I) ·
  // TAL-CONJ-OPUESTO toma el opuesto · TAL-CONJ-CRUZA cruza las dos partes · TAL-CONJ-PRODUCTO multiplica la pareja con i
  // como si fuera con √ (resta en vez de sumar) · TAL-CONJ-SUMA no duplica el número sin √ ni i en la suma · TAL-CONJ-SOLA no
  // cuenta la compañera · TAL-SIGNO-VIETE no cambia el signo · TAL-PRODUCTO usa la suma donde va el producto.
  const COMP4 = [
    { t: '2 − √3', suma: '4', prod: '1', pol: 'x² − 4x + 1', enteros: true },
    { t: '−2 + √3', suma: '2√3', prod: '−1', pol: 'x² − 2√3x − 1', enteros: false },
    { t: '−2 − √3', suma: '0', prod: '−7 − 4√3', pol: 'x² − 7 − 4√3', enteros: false },
    { t: '2 + √3', suma: '4 + 2√3', prod: '7 + 4√3', pol: 'x² − (4 + 2√3)x + 7 + 4√3', enteros: false },
  ];
  const tabla4 = k => { const c = COMP4[k]; return TB({ columnas: ['compañera', 'suma', 'producto'], colorCol: ['i', null, null],
    filas: [[{ t: c.t, color: 'i', fuerte: true }, c.suma, c.prod]], rotulosFila: ['2 + √3 y'],
    pie: c.enteros ? `${c.pol}: enteros` : 'coeficientes no enteros',
    alt: `La raíz 2 + √3 con la compañera ${c.t}: suman ${c.suma} y multiplican ${c.prod}` }); };
  // Una raíz m ± k√n (n sin raíz exacta) o m ± ki, con m y k enteros.
  const NOCUAD = [2, 3, 5, 6, 7, 10];
  function pareja(r, tipo) {
    const m = r.noCero(-5, 5), k = r.ent(1, 4), n = r.uno(NOCUAD), s = r.uno([1, -1]);
    if (tipo === 'i' && m === 2 && k === 3) return pareja(r, tipo);   // nunca la raíz de la predicción, 2 ± 3i
    if (tipo === 'i') return { tipo, m, k, s, txt: conI(m, k, s), conj: conI(m, k, -s), suma: 2 * m, prod: m * m + k * k };
    return { tipo, m, k, n, s, txt: conRaiz(m, k, n, s), conj: conRaiz(m, k, n, -s), suma: 2 * m, prod: m * m - k * k * n };
  }
  function casoCompanera(r) {
    const q = pareja(r, r.uno(['i', 'r']));
    const neg = q.tipo === 'i' ? conI(-q.m, q.k, q.s) : conRaiz(-q.m, q.k, q.n, q.s);
    const opu = q.tipo === 'i' ? conI(-q.m, q.k, -q.s) : conRaiz(-q.m, q.k, q.n, -q.s);
    const cruz = q.k !== Math.abs(q.m) ? (q.tipo === 'i' ? conI(q.k * Math.sign(q.m), Math.abs(q.m), q.s) : conRaiz(q.k * Math.sign(q.m), Math.abs(q.m), q.n, q.s)) : null;
    return {
      pregunta: [`${q.txt} es raíz de un polinomio con coeficientes enteros. ¿Cuál de estos números también es raíz, seguro?`],
      datos: [q.tipo === 'i' ? DD.conjI : DD.conjR, ...(q.tipo === 'i' ? [DD.i] : [])],
      opciones: ops([
        { id: 'c', texto: q.conj, correcta: true },
        { id: 'real', texto: neg, error: 'TAL-CONJ-REAL', siFuera: `Bien que llega otra raíz. Pero la conjugada conserva el ${f(q.m)} y cambia el signo del medio.` },
        { id: 'opuesto', texto: opu, error: 'TAL-CONJ-OPUESTO', siFuera: `Bien cambiar el signo del medio. Pero el ${f(q.m)} se queda: la suma tiene que salir entera.` },
        cruz ? { id: 'cruza', texto: cruz, error: 'TAL-CONJ-CRUZA', siFuera: 'Bien buscar una compañera parecida. Pero la conjugada conserva los dos números y solo cambia el signo del medio.' } : null,
      ]),
      solucion: { texto: 'La conjugada conserva el número sin √ ni i y cambia el signo de lo que lleva √ o i.', ecuacion: [RA(q.txt), ' y ', RA(q.conj)] },
    };
  }
  function casoFactor2(r) {
    const q = pareja(r, r.uno(['i', 'r'])), sp = `${q.tipo === 'i' ? DD.conjI : DD.conjR}`;
    const fac = (s, p) => poli([1, -s, p]);
    const otroP = q.tipo === 'i' ? q.m * q.m - q.k * q.k : q.m * q.m + q.k * q.k * q.n;
    return {
      pregunta: [`${q.txt} es raíz de P, que tiene coeficientes enteros. ¿Qué factor de grado 2 tiene P, seguro?`],
      datos: [sp, DD.parFactor, DD.difCuad, ...(q.tipo === 'i' ? [DD.i] : [])],
      opciones: ops([
        { id: 'c', texto: fac(q.suma, q.prod), correcta: true },
        { id: 'signo', texto: fac(-q.suma, q.prod), error: 'TAL-SIGNO-VIETE', siFuera: `Bien el producto, ${f(q.prod)}. Pero el término en x lleva la suma con el signo cambiado.` },
        { id: 'producto', texto: fac(q.suma, otroP), error: 'TAL-CONJ-PRODUCTO', siFuera: q.tipo === 'i' ? `Bien la suma. Pero ${q.k}i · (−${q.k}i) = ${q.k * q.k}: con i² = −1, el producto suma.` : `Bien la suma. Pero (${q.k === 1 ? '' : q.k}√${q.n})² se resta: es una diferencia de cuadrados.` },
        q.m !== 0 ? { id: 'suma', texto: fac(q.m, q.prod), error: 'TAL-CONJ-SUMA', siFuera: `Bien el producto. Pero la suma de la pareja es ${par(q.m)} + ${par(q.m)} = ${f(2 * q.m)}.` } : null,
      ]),
      solucion: { texto: `La pareja suma ${f(q.suma)} y multiplica ${f(q.prod)}.`, ecuacion: [`(x − (${q.txt}))(x − (${q.conj})) = `, RA(fac(q.suma, q.prod))] },
    };
  }
  function casoGrado(r) {
    const n = r.uno(NOCUAD), m = r.noCero(-3, 3), k = r.ent(1, 3), e = r.noCero(-5, 5), s = r.uno([1, -1]);
    const lista = r.mezclar([`√${n}`, conI(m, k, s), f(e)]);
    return {
      pregunta: [`P tiene coeficientes enteros y, entre sus raíces, ${lista[0]}, ${lista[1]} y ${lista[2]}. ¿Cuál es el menor grado que puede tener P?`],
      datos: [DD.conjR, DD.conjI, DD.tfa, DD.i],
      opciones: ops([
        { id: 'c', texto: '5', correcta: true },
        { id: 'sola', texto: '3', error: 'TAL-CONJ-SOLA', siFuera: 'Bien una raíz por cada número dado. Pero √ y i traen a su conjugada: dos más.' },
        { id: 'una', texto: '4', error: 'TAL-CONJ-SOLA', siFuera: 'Bien la pareja con i. Pero la raíz con √ también trae a su conjugada.' },
        { id: 'seis', texto: '6', error: 'TAL-CONJ-SOLA', siFuera: `Bien las dos parejas. Pero ${f(e)} es entero: no trae compañera.` },
      ]),
      solucion: { texto: `√${n} y ${conI(m, k, s)} traen a su conjugada; ${f(e)} no.`, ecuacion: ['2 + 2 + 1 = ', RA('5')] },
    };
  }
  // Ahora tú 4 (nivel examen, San Marcos 2027-I con otros números): la raíz real de la cúbica.
  function casoReal(r) {
    const m = r.noCero(-3, 3), k = r.ent(1, 3), e = r.noCero(-5, 5), s = r.uno([1, -1]);
    const N = m * m + k * k, d = -e * N, z = conI(m, k, s);
    if (Math.abs(d) > 99 || m * m === k * k || (m === 2 && k === 3)) return null;
    return {
      pregunta: [`La ecuación x³ + bx² + cx ${d < 0 ? '−' : '+'} ${Math.abs(d)} = 0, con b y c enteros, tiene la raíz ${z}. ¿Cuál es su raíz real?`],
      datos: [DD.conjI, DD.vieta, DD.vieta2, DD.vieta3, DD.i],
      opciones: ops([
        { id: 'c', texto: f(e), correcta: true },
        { id: 'signo', texto: f(-e), error: 'TAL-SIGNO-VIETE', siFuera: `Bien el producto de la pareja, ${N}. Pero el de las tres es −d: ${f(-d)}.` },
        { id: 'resta', texto: fr(-d, m * m - k * k), error: 'TAL-CONJ-PRODUCTO', siFuera: `Bien usar el producto. Pero con i² = −1 la pareja multiplica ${m * m} + ${k * k} = ${N}.` },
        { id: 'suma', texto: fr(-d, 2 * m), error: 'TAL-PRODUCTO', siFuera: `Bien la pareja. Pero ${f(2 * m)} es su suma; con d va el producto, ${N}.` },
        { id: 'par', texto: f(N), error: 'TAL-PIDE', siFuera: `Bien el producto de la pareja. Pero falta dividir ${f(-d)} entre ${N}.` },
      ]),
      solucion: { texto: `${conI(m, k, -s)} también es raíz. El producto de las tres es −d.`, ecuacion: [`(${m * m} + ${k * k}) · x₃ = ${f(-d)}  ⇒  x₃ = `, RA(f(e))] },
    };
  }

  // Ejemplos de la idea 4. Cuentas rehechas aparte (cuentas-ejemplos.py). Letras de nivel 3: C, A, B, D, E.
  const EJEMPLOS_PAREJA = [
    { nivel: 1, titulo: 'La compañera con √',
      enunciado: ['3 − √5 es raíz de un polinomio con coeficientes enteros. ¿Qué otra raíz tiene, seguro?'],
      datos: [DD.conjR],
      solucion: [{ texto: 'La conjugada conserva el 3 y cambia el signo del √5.' }],
      respuesta: [RA('3 + √5')] },
    { nivel: 1, titulo: 'La compañera con i',
      enunciado: ['−1 + 4i es raíz de un polinomio con coeficientes reales. ¿Qué otra raíz tiene, seguro?'],
      datos: [DD.conjI, DD.i],
      solucion: [{ texto: 'La conjugada conserva el −1 y cambia el signo de 4i.' }],
      respuesta: [RA('−1 − 4i')] },
    { nivel: 1, titulo: 'Escribir con i',
      enunciado: ['¿Cuáles son las raíces de x² + 25 = 0?'],
      datos: [DD.i],
      solucion: [{ texto: 'x² = −25. Ningún real sirve; con i, √−25 = √25 · i = 5i.', ecuacion: ['x = 5i  o  x = −5i'] }],
      respuesta: [RA('5i'), ' y ', RA('−5i')] },
    { nivel: 1, titulo: 'El producto de la pareja',
      enunciado: ['¿Cuánto vale (4 + √7)(4 − √7)?'],
      datos: [DD.difCuad],
      solucion: [{ texto: 'Es una diferencia de cuadrados, con A = 4 y B = √7.', ecuacion: ['4² − (√7)² = 16 − 7 = 9'] }],
      respuesta: [RA('9')] },
    { nivel: 1, titulo: '¿Una sola no real?',
      enunciado: ['Un polinomio de grado 3 con coeficientes reales, ¿puede tener exactamente una raíz no real?'],
      datos: [DD.conjI, DD.tfa],
      solucion: [{ texto: 'Las no reales llegan con su conjugada: van de a dos. Con grado 3 hay 3 reales, o 1 real y 2 no reales.' }],
      respuesta: [RA('No'), ': las no reales van de a dos'] },
    { nivel: 2, titulo: 'El factor de la pareja',
      enunciado: ['1 + √3 es raíz de P, que tiene coeficientes enteros. ¿Qué factor de grado 2 tiene P, seguro?'],
      datos: [DD.conjR, DD.parFactor, DD.difCuad],
      solucion: [
        { texto: '1 − √3 también es raíz. La pareja suma 2.' },
        { texto: 'Y multiplica una diferencia de cuadrados.', ecuacion: ['(1 + √3)(1 − √3) = 1 − 3 = −2'] },
      ],
      respuesta: [RA('x² − 2x − 2')] },
    { nivel: 2, titulo: 'El factor con i',
      enunciado: ['3 − 2i es raíz de P, que tiene coeficientes reales. ¿Qué factor de grado 2 tiene P, seguro?'],
      datos: [DD.conjI, DD.parFactor, DD.i],
      solucion: [
        { texto: '3 + 2i también es raíz. La pareja suma 6.' },
        { texto: '(3 − 2i)(3 + 2i) es una diferencia de cuadrados, con i² = −1:', ecuacion: ['9 − 4i² = 9 + 4 = 13'] },
      ],
      respuesta: [RA('x² − 6x + 13')] },
    { nivel: 2, titulo: 'Raíces no reales con la fórmula',
      enunciado: ['Resuelve x² + 2x + 5 = 0.'],
      datos: [DD.general, DD.deltaDef, DD.i],
      solucion: [
        { texto: 'Δ = 4 − 20 = −16, y √−16 = 4i.' },
        { texto: 'Se reemplaza en la fórmula.', ecuacion: ['x = (−2 ± 4i)/2 = −1 ± 2i'] },
      ],
      respuesta: [RA('−1 + 2i'), ' y ', RA('−1 − 2i')] },
    { nivel: 2, titulo: 'El menor grado',
      enunciado: ['P tiene coeficientes enteros y, entre sus raíces, 2, √3 y 1 − i. ¿Cuál es el menor grado que puede tener P?'],
      datos: [DD.conjR, DD.conjI, DD.tfa, DD.i],
      solucion: [
        { texto: '√3 trae a −√3 y 1 − i trae a 1 + i. El 2 es entero: no trae compañera.' },
        { texto: 'Se cuentan.', ecuacion: ['1 + 2 + 2 = ', RA('5')] },
      ],
      respuesta: [RA('5')] },
    { nivel: 2, titulo: 'Armar la ecuación',
      enunciado: ['Escribe la ecuación de grado 2, con coeficientes enteros y a = 1, que tiene la raíz 2 − √5.'],
      datos: [DD.conjR, DD.parFactor, DD.difCuad],
      solucion: [
        { texto: 'La otra raíz es 2 + √5. Suman 4.' },
        { texto: 'Multiplican una diferencia de cuadrados.', ecuacion: ['(2 − √5)(2 + √5) = 4 − 5 = −1'] },
      ],
      respuesta: [RA('x² − 4x − 1 = 0')] },
    { nivel: 3, titulo: 'La raíz real de la cúbica',
      enunciado: ['La ecuación x³ + bx² + cx − 20 = 0, con b y c enteros, tiene la raíz 1 + 2i. ¿Cuál es su raíz real?'],
      alternativas: ['−4', '5', '4', '−20/3', '10'],
      datos: [DD.conjI, DD.vieta, DD.vieta2, DD.vieta3, DD.i],
      solucion: [
        { texto: '1 − 2i también es raíz. La pareja multiplica 1 − 4i² = 1 + 4 = 5.' },
        { texto: 'El producto de las tres es −d/a = 20.', ecuacion: ['5 · x₃ = 20  ⇒  x₃ = ', RA('4')] },
        { texto: ['La ', letra('A'), ' usa d sin cambiar el signo: 5x₃ = −20. La ', letra('B'), ' da el producto de la pareja.'] },
        { texto: ['La ', letra('D'), ' multiplica la pareja como si fuera con √: 1 − 4 = −3, y −3x₃ = 20. La ', letra('E'), ' usa la suma de la pareja, 2: 2x₃ = 20.'] },
      ],
      respuesta: [letra('C'), ', ', RA('4')] },
    { nivel: 3, titulo: 'La trampa del signo',
      enunciado: ['−3 + i es raíz de una cúbica con coeficientes enteros. ¿Cuál de estos números también es raíz, seguro?'],
      alternativas: ['−3 − i', '3 + i', '3 − i', '1 − 3i', '−3'],
      datos: [DD.conjI, DD.i],
      solucion: [
        { texto: 'La conjugada conserva el −3 y cambia el signo de i.' },
        { texto: 'Con −3 − i, la suma es −6 y el producto 9 + 1 = 10: coeficientes enteros.' },
        { texto: ['La ', letra('B'), ' cambia el signo del −3, el número sin i: la suma sería 2i. La ', letra('C'), ' es el opuesto: el producto tendría i.'] },
        { texto: ['La ', letra('D'), ' cruza las partes. La ', letra('E'), ' puede ser raíz o no: nada lo asegura.'] },
      ],
      respuesta: [letra('A'), ', ', RA('−3 − i')] },
    { nivel: 3, titulo: 'Reconstruir la cúbica',
      enunciado: ['Una cúbica con coeficientes enteros, que empieza con x³, tiene las raíces 2 + i y 1. ¿Cuál es su término independiente?'],
      alternativas: ['5', '−5', '−3', '−4', '−1'],
      datos: [DD.conjI, DD.parFactor, DD.i, DD.indep],
      solucion: [
        { texto: '2 − i también es raíz. La pareja suma 4 y multiplica 4 − i² = 5: da x² − 4x + 5.' },
        { texto: 'La cúbica es (x² − 4x + 5)(x − 1). Con x = 0:', ecuacion: ['5 · (−1) = ', RA('−5')] },
        { texto: ['La ', letra('A'), ' olvida el signo de −1. La ', letra('C'), ' multiplica la pareja como con √: 4 − 1 = 3, y da −3.'] },
        { texto: ['La ', letra('D'), ' olvida el i²: 4 · (−1) = −4. La ', letra('E'), ' toma solo la raíz real: x − 1.'] },
      ],
      respuesta: [letra('B'), ', ', RA('−5')] },
    { nivel: 3, titulo: 'Una pareja con √',
      enunciado: ['P(x) = x³ + bx² + cx + d tiene coeficientes enteros y, entre sus raíces, 1 + √2 y 3. ¿Cuánto vale b?'],
      alternativas: ['5', '−2', '−4 − √2', '−5', '−3'],
      datos: [DD.conjR, DD.vieta, DD.vieta2, DD.vieta3],
      solucion: [
        { texto: '1 − √2 también es raíz: son las tres. Suman 1 + √2 + 1 − √2 + 3 = 5.' },
        { texto: 'La suma es −b/a, con a = 1.', ecuacion: ['−b = 5  ⇒  b = ', RA('−5')] },
        { texto: ['La ', letra('A'), ' no cambia el signo. La ', letra('B'), ' suma solo la pareja, 2, y da b = −2. La ', letra('C'), ' olvida la conjugada: −(1 + √2 + 3).'] },
        { texto: ['La ', letra('E'), ' toma solo la raíz entera.'] },
      ],
      respuesta: [letra('D'), ', ', RA('b = −5')] },
    { nivel: 3, titulo: '¿Cuántas reales?',
      enunciado: ['Un polinomio de grado 5 con coeficientes reales tiene, entre sus raíces, 2i y 1 − i. ¿Cuántas raíces reales tiene?'],
      alternativas: ['3', '2', '0', '5', '1'],
      datos: [DD.conjI, DD.tfa, DD.i],
      solucion: [
        { texto: '2i trae a −2i y 1 − i trae a 1 + i: son 4 no reales.' },
        { texto: 'El grado cuenta 5.', ecuacion: ['5 − 4 = ', RA('1')] },
        { texto: ['La ', letra('A'), ' resta solo las dos dadas: 5 − 2. La ', letra('B'), ' cuenta una sola pareja: 5 − 3.'] },
        { texto: ['La ', letra('C'), ' cree que todas son no reales. La ', letra('D'), ' da el grado.'] },
      ],
      respuesta: [letra('E'), ', ', RA('1')] },
  ];

  const conjugadas = {
    id: 'conjugadas',
    titulo: 'Raíces en pareja',
    pregunta: '¿Qué otra raíz llega con 2 + √3?',
    temas: ['Paridad de raíces irracionales y complejas'],
    pieza: 'alg-tabla',
    aprendizaje: 'Con coeficientes enteros, una raíz con √ inexacta o con i llega con su conjugada: 2 + √3 con 2 − √3, y 1 + 2i con 1 − 2i.',
    actividad: 'Elegir la compañera de una raíz y mirar si la suma y el producto salen enteros.',
    // Lee: el huerto de 2 m², las dos raíces de la fórmula general, el número i y qué mirar. No dice cuál es la compañera de
    // 2 + √3 (la misión) ni la de una raíz con i (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'El huerto de 2 m²', texto: 'El huerto cuadrado del colegio tiene 2 m². Su lado x cumple x² = 2, que tiene dos raíces: √2 y −√2. Para el huerto sirve √2, pero la ecuación las da juntas.',
          pieza: 'alg-objeto', dibujo: OB({ objeto: 'huertos', a: 2, b: 0, junto: false, ladoA: '?', nombreA: 'Huerto del colegio' }) },
        { titulo: 'Raíz irracional', texto: '√2 no es una fracción de enteros: es una raíz irracional. La fórmula general da raíces así, con un ± delante de la raíz cuadrada.' },
        { titulo: 'Un número nuevo: i', texto: 'x² = −4 no tiene raíz real. Para escribir sus raíces se usa i, un número con i² = −1: las raíces son 2i y −2i. Se explica en «Números complejos».' },
        { titulo: 'Qué mirar al jugar', texto: 'Un polinomio con coeficientes enteros tiene la raíz 2 + √3. Elige su compañera y mira si la suma y el producto salen enteros.' },
      ],
    },
    ejemplos: EJEMPLOS_PAREJA,
    juega: {
      pieza: 'alg-tabla',
      consigna: 'Una raíz de un polinomio con coeficientes enteros es 2 + √3. Hay que hallar la otra raíz de su factor de grado 2.',
      mision: {
        texto: 'Elige la compañera para que (x − raíz)(x − compañera) tenga coeficientes enteros.',
        logrado: v => v.k === 0,
        bien: 'Listo: con 2 − √3 suman 4 y multiplican 1: x² − 4x + 1.',
      },
      voz: 'La suma y el producto son los coeficientes del factor.',
      leyenda: [
        { s: NP('compañera'), t: 'la otra raíz que se elige' },
        { s: 'suma', t: 'raíz + compañera' },
        { s: 'producto', t: 'raíz · compañera' },
      ],
      controles: [{ id: 'k', etiqueta: 'Compañera', opciones: [3, 1, 2, 0].map(i => ({ valor: i, texto: COMP4[i].t })), inicio: 3 }],
      dibujo: v => tabla4(v.k),
      lectura: v => { const c = COMP4[v.k]; return [`suman ${c.suma} y multiplican ${c.prod}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: 'Un polinomio de grado 3 con coeficientes enteros tiene la raíz 2 + 3i. ¿Cuál de estos números también es raíz suya, seguro?',
      datos: ['i² = −1'],
      voz: 'Piensa en qué hizo la compañera de 2 + √3.',
      opciones: [
        { id: 'c', texto: '2 − 3i', correcta: true },
        { id: 'real', texto: '−2 + 3i', error: 'TAL-CONJ-REAL', siFuera: 'Bien que llega otra raíz. Pero con −2 + 3i la suma sería 6i, que no es entera.' },
        { id: 'opuesto', texto: '−2 − 3i', error: 'TAL-CONJ-OPUESTO', siFuera: 'Bien que la suma sale 0. Pero el producto, −(2 + 3i)², tiene i: no es entero.' },
        { id: 'cruza', texto: '3 + 2i', error: 'TAL-CONJ-CRUZA', siFuera: 'Bien buscar una compañera parecida. Pero se conserva el 2 y cambia el signo de 3i.' },
      ],
      dibujo: TB({ columnas: ['raíz', 'compañera'], colorCol: [null, 'i'], filas: [['2 + 3i', { t: '?', hueco: true }]], alt: 'La raíz 2 + 3i y su compañera, por hallar' }),
      revelar: TB({ columnas: ['raíz', 'compañera'], colorCol: [null, 'i'], filas: [['2 + 3i', { t: '2 − 3i', color: 'f', fuerte: true }]], pie: 'suman 4; multiplican 4 + 9 = 13', alt: 'La compañera de 2 + 3i es 2 − 3i: suman 4 y multiplican 13' }),
      coincide: 'Coincide: con 2 − 3i la suma es 4 y el producto 4 + 9 = 13: el factor x² − 4x + 13 tiene coeficientes enteros.',
      noCoincide: 'Revisemos: la compañera conserva el 2 y cambia el signo de 3i, como 2 − √3 con 2 + √3.',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: { columnas: ['pareja', 'suma', 'producto'], filas: [
        [{ t: '2 ± 3i', desde: 1 }, { t: '4', desde: 2 }, { t: '13', desde: 3 }],
        [{ t: '1 ± √2', desde: 5 }, { t: '2', desde: 5 }, { t: '−1', desde: 5 }],
      ], alt: 'Las parejas 2 más y menos 3i y 1 más y menos raíz de 2, con su suma y su producto enteros' },
      voz: 'Con la conjugada, lo que molesta se cancela.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Si 2 + 3i es raíz del polinomio P, x − (2 + 3i) es factor.', ecuacion: ['x − (2 + 3i)'] },
        { estado: { corte: 2 }, texto: 'Con su conjugada, la suma sale entera.', ecuacion: ['(2 + 3i) + (2 − 3i) = 4'] },
        { estado: { corte: 3 }, texto: 'El producto es una diferencia de cuadrados, con i² = −1.', ecuacion: ['(2 + 3i)(2 − 3i) = 4 − 9i² = 4 + 9 = 13'] },
        { estado: { corte: 4 }, texto: 'Juntas dan un factor con coeficientes enteros.', ecuacion: ['x² − 4x + 13'] },
        { estado: { corte: 5 }, texto: 'Con √ pasa igual: es la paridad de raíces.', ecuacion: ['(1 + √2)(1 − √2) = 1 − 2 = −1'] },
      ],
    },
    regla: {
      texto: 'Con coeficientes enteros, una raíz con √ inexacta llega con su conjugada, 2 + √3 con 2 − √3; con coeficientes reales, una raíz no real también, 1 + 2i con 1 − 2i.',
      ecuacion: ['1 ± 2i:   suma 2;   producto 1 + 4 = 5'],
      condicion: 'para la pareja con √, los coeficientes son enteros o fracciones; para la pareja con i, basta que sean reales.',
      voz: 'La conjugada conserva el número sin √ ni i y cambia el signo de lo que lleva √ o i.',
    },
    // Así se resuelve: la cúbica mónica con una raíz no real y una real. «Ahora tú» pide la compañera, el factor de grado
    // 2, el menor grado y la raíz real con el término independiente.
    resuelve: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s + 900);
        let m, k, e, sg;
        do { m = r.noCero(-3, 3); k = r.ent(1, 3); e = r.noCero(-4, 4); sg = r.uno([1, -1]); } while (m === e);
        const N = m * m + k * k, fac = [1, -2 * m, N], cub = mult(fac, [1, -e]), z = conI(m, k, sg), zc = conI(m, k, -sg);
        const tabla = (fila, pie) => TB({ columnas: ['pareja', 'suma', 'producto'], filas: [fila], pie, alt: `La pareja ${z} y ${zc}` });
        return {
          enunciado: [`Una cúbica con coeficientes enteros, que empieza con x³, tiene las raíces ${z} y ${f(e)}. ¿Cuál es la cúbica?`],
          datos: [DD.conjI, DD.parFactor, 'i² = −1'],
          dibujo: tabla([`${z} y ?`, '?', '?']),
          pasos: [
            { tipo: 'pide', texto: 'Piden el polinomio entero, desarrollado, con x³ adelante.' },
            { tipo: 'regla', texto: `Los coeficientes son enteros: ${z} llega con su conjugada, ${zc}. Son las tres raíces.` },
            { tipo: 'cuentas', texto: `La pareja suma ${f(2 * m)} y multiplica ${par(m)}² + ${k}² = ${N}.`, ecuacion: [`x² ${2 * m > 0 ? '−' : '+'} ${Math.abs(2 * m) === 1 ? '' : Math.abs(2 * m)}x + ${N}`], dibujo: tabla([`${z} y ${zc}`, f(2 * m), f(N)]) },
            { tipo: 'cuentas', texto: `Se multiplica por ${binx(e)}, el factor de la raíz real.`, ecuacion: [`(${poli(fac)})(${binx(e)}) = `, RA(poli(cub))] },
            { tipo: 'sentido', texto: `Con x = ${f(e)} vale 0, y sus coeficientes son enteros, como pide el enunciado.` },
          ],
          respuesta: [RA(`${poli(cub)}`)],
        };
      },
    },
    ahoraTu: {
      voz: 'La conjugada conserva el número sin √ ni i y cambia el signo de lo que lleva √ o i.',
      generar(sem) {
        const r = azar(sem + 61), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoCompanera, r);
        if (tipo === 1) return conCuatro(casoFactor2, r);
        if (tipo === 2) return conCuatro(casoGrado, r);
        return conCuatro(casoReal, r);
      },
    },
  };

  // ---------- Idea 5: bicuadradas y recíprocas ----------
  // Objeto: los dos huertos cuadrados de 1 m² y 4 m² del colegio (Lee, alg-objeto 'huertos') y la recta con las áreas u
  // y los lados x (juego, pieza recta). Cambia: u₁ y u₂, de −4 a 9. · Permanece: x² = u. · Progresa: la ecuación
  // (x² − u₁)(x² − u₂) = 0 y sus raíces. · Se reserva: contar raíces reales desde la ecuación (la predicción:
  // x⁴ + 3x² − 4 = 0). · Debe verse: cada u positivo da dos raíces opuestas; un u negativo no da ninguna real.
  // Errores (hipótesis de diseño): TAL-BICUAD-TODAS cree que cada u da dos reales · TAL-BICUAD-POSITIVA toma solo la raíz
  // positiva · TAL-BICUAD-NINGUNA descarta todo por un u negativo · TAL-BICUAD-U da el valor de u como raíz · TAL-T2-SIN
  // olvida el −2 de x² + 1/x² · TAL-T2-SUMA suma 2 · TAL-SIGNO cambia un signo · TAL-MEDIDA toma una raíz negativa como
  // precio o medida · TAL-SUMA suma donde se resta · TAL-BICUAD-SINRAIZ cree que sin reales no hay raíces (trampa de San
  // Marcos 2024-II).
  const xDeU = u => (u > 0 ? [Math.sqrt(u), -Math.sqrt(u)] : u === 0 ? [0] : []);
  const raizTxt = u => (Number.isInteger(Math.sqrt(u)) ? f(Math.sqrt(u)) : `√${u}`);
  const rotX = (u, sg) => (sg > 0 ? raizTxt(u) : `−${raizTxt(u)}`);
  // La recta es la de x: solo las raíces x van sobre ella (violeta). Cada u positivo se dibuja como la cota turquesa que
  // une sus dos raíces, ±√u, en su propia fila (la fila dice de qué u salen); un u negativo no pone nada en la recta (no
  // da raíces reales) y lo dice la lectura. Así u nunca se lee como un punto del eje x (lector en frío B, 20 nov).
  function recta5(us, o = {}) {
    const els = [];
    us.forEach((u, i) => {
      if (u === null) return;
      if (u > 0) {
        if (!o.soloX) els.push({ tipo: 'distancia', a: -Math.sqrt(u), b: Math.sqrt(u), color: 'i', rotulo: `u = ${f(u)}`, fila: 1 + i, desde: o.desdeU || 0 });
        [1, -1].forEach(sg => els.push({ tipo: 'punto', x: sg * Math.sqrt(u), color: 'f', rotulo: rotX(u, sg), fila: 0, desde: o.desdeX || 0 }));
      }
      if (u === 0) els.push({ tipo: 'punto', x: 0, color: 'f', rotulo: '0', fila: 0, desde: o.desdeX || 0 });
    });
    return RC({ min: o.min === undefined ? -4 : o.min, max: o.max === undefined ? 4 : o.max, paso: 1, cada: 1, decimales: 0, variable: 'x', filas: o.soloX ? 1 : 3, elementos: els,
      alt: o.alt || `Recta de x: ${us.filter(u => u !== null).map(u => (u > 0 ? `u = ${f(u)} da ±${raizTxt(u)}` : `u = ${f(u)} no da raíces reales`)).join('; ')}` });
  }
  const ec4 = (s, p) => `${poli([1, 0, -s, 0, p])} = 0`;   // (x² − u₁)(x² − u₂) = x⁴ − s·x² + p
  const daU = u => (u > 0 ? [VA(`u = ${f(u)}`), ' da ', RA(`±${raizTxt(u)}`)] : u === 0 ? [VA('u = 0'), ' da ', RA('0')] : [VA(`u = ${f(u)}`), ': ninguna real']);
  function lectura5(v) {
    return [`${ec4(v.u1 + v.u2, v.u1 * v.u2)}:   `, ...daU(v.u1), ';   ', ...daU(v.u2)];
  }
  // Ahora tú 1: cuántas raíces reales tiene x⁴ − (u₁ + u₂)x² + u₁u₂ = 0.
  function casoCuantasReales(r) {
    const u1 = r.noCero(-9, 9), u2 = r.noCero(-9, 9);
    if (u1 === u2 || u1 + u2 === 0 || (u1 === 1 && u2 === -4) || (u1 === -4 && u2 === 1)) return null;
    const pos = [u1, u2].filter(u => u > 0).length, bien = 2 * pos;
    const sol = [u1, u2].map(u => (u > 0 ? `u = ${f(u)} da ±${raizTxt(u)}` : `u = ${f(u)} no da reales`)).join('; ');
    return {
      pregunta: [`¿Cuántas raíces reales tiene ${ec4(u1 + u2, u1 * u2)}?`],
      datos: [DD.bicuad, DD.vuelta],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'todas', texto: '4', error: 'TAL-BICUAD-TODAS', siFuera: 'Bien los dos valores de u. Pero un u negativo no da raíces reales.' },
        { id: 'positiva', texto: f(pos), error: 'TAL-BICUAD-POSITIVA', siFuera: 'Bien descartar los u negativos. Pero cada u positivo da dos raíces: √u y −√u.' },
        { id: 'ninguna', texto: f(pos === 2 ? 2 : 0), error: 'TAL-BICUAD-NINGUNA', siFuera: 'Bien revisar el signo de cada u. Pero cuenta dos raíces por cada u positivo.' },
        // Con los dos u negativos (pos = 0) no hay «u positivo» que alabar (auditoría, 20 nov).
        { id: 'tres', texto: '3', error: 'TAL-BICUAD-POSITIVA', siFuera: pos ? 'Bien que salen raíces opuestas. Pero van de a dos: el total de reales es par.' : 'Bien buscar los valores de u. Pero los dos son negativos: ningún x² real vale eso.' },
        { id: 'una', texto: '1', error: 'TAL-BICUAD-POSITIVA', siFuera: pos ? 'Bien un u positivo. Pero da dos raíces opuestas, no una.' : 'Bien buscar los valores de u. Pero los dos son negativos: no dan ninguna raíz real.' },
      ]),
      solucion: { texto: `${poli([1, -(u1 + u2), u1 * u2], 'u')} = 0 da u = ${f(u1)} y u = ${f(u2)}. ${sol}.`, ecuacion: [RA(`${bien} reales`)] },
    };
  }
  // Ahora tú 2: la mayor raíz de x⁴ − (p² + q²)x² + p²q² = 0.
  function casoMayor(r) {
    const a = r.ent(1, 6), b = r.ent(1, 6);
    if (a >= b || ['2,3', '1,2', '1,3', '2,4', '3,5', '2,5'].includes(`${a},${b}`)) return null;
    return {
      pregunta: [`¿Cuál es la mayor raíz de ${ec4(a * a + b * b, a * a * b * b)}?`],
      datos: [DD.bicuad, DD.vuelta],
      opciones: ops([
        { id: 'c', texto: f(b), correcta: true },
        { id: 'u', texto: f(b * b), error: 'TAL-BICUAD-U', siFuera: `Bien u = ${b * b}. Pero u es x²: falta volver a x con x² = ${b * b}.` },
        { id: 'otra', texto: f(a), error: 'TAL-PIDE', siFuera: `Bien ${f(a)} es raíz. Pero ${f(b)} es mayor.` },
        { id: 'signo', texto: f(-a), error: 'TAL-SIGNO', siFuera: `Bien que hay raíces negativas. Pero −${a} es menor que ${b}.` },
      ]),
      solucion: { texto: `u = ${a * a} y u = ${b * b}: las raíces son ±${a} y ±${b}.`, ecuacion: ['la mayor: ', RA(f(b))] },
    };
  }
  // Ahora tú 3: la ecuación en t de una recíproca.
  function casoReciproca(r) {
    const B = r.noCero(-7, 7), C = r.ent(-6, 14);
    if (C === 2 || (B === -5 && C === 8) || (B === 1 && C === -4)) return null;
    const P = poli([1, B, C, B, 1]), en = k => `${poli([1, B, k], 't')} = 0`;
    return {
      pregunta: [`En ${P} = 0 se divide entre x² y se cambia x + 1/x por t. ¿Qué ecuación queda en t?`],
      datos: [DD.reciproca, DD.t2],
      opciones: ops([
        { id: 'c', texto: en(C - 2), correcta: true },
        { id: 'sin', texto: en(C), error: 'TAL-T2-SIN', siFuera: 'Bien el término en t. Pero x² + 1/x² es t² − 2: el −2 se junta con el número.' },
        { id: 'suma', texto: en(C + 2), error: 'TAL-T2-SUMA', siFuera: 'Bien que el número cambia. Pero x² + 1/x² = t² − 2: se resta 2, no se suma.' },
        { id: 'signo', texto: `${poli([1, -B, C - 2], 't')} = 0`, error: 'TAL-SIGNO', siFuera: `Bien el número. Pero ${f(B)}x³ y ${f(B)}x dan ${f(B)}(x + 1/x), con su signo.` },
      ]),
      solucion: { texto: `Entre x²: x² + 1/x² + ${par(B)}(x + 1/x) + ${par(C)} = 0, y x² + 1/x² = t² − 2.`, ecuacion: [RA(en(C - 2))] },
    };
  }
  // Ahora tú 4 (nivel examen, San Marcos 2023-I con otros números): el precio.
  function casoPrecio(r) {
    const a = r.ent(1, 6), b = r.ent(2, 9);
    if (a >= b || ['2,3', '1,2', '1,3', '2,4', '3,5', '2,5'].includes(`${a},${b}`)) return null;
    return {
      pregunta: [`Un precio de x soles cumple ${ec4(a * a + b * b, a * a * b * b)}. ¿Cuánto es la diferencia entre el mayor y el menor precio posibles?`],
      datos: [DD.bicuad, DD.vuelta, 'Un precio es un número positivo'],
      opciones: ops([
        { id: 'c', texto: `${b - a} soles`, correcta: true },
        { id: 'neg', texto: `${2 * b} soles`, error: 'TAL-MEDIDA', siFuera: `Bien x = ${b}. Pero −${b} no es un precio: el menor es ${a}.` },
        { id: 'u', texto: `${b * b - a * a} soles`, error: 'TAL-BICUAD-U', siFuera: `Bien u = ${a * a} y u = ${b * b}. Pero el precio es x, no x².` },
        { id: 'suma', texto: `${a + b} soles`, error: 'TAL-SUMA', siFuera: `Bien los precios ${a} y ${b}. Pero se pide su diferencia, no su suma.` },
      ]),
      solucion: { texto: `u = ${a * a} y u = ${b * b} dan x = ±${a} y ±${b}; solo ${a} y ${b} son precios.`, ecuacion: [`${b} − ${a} = `, RA(`${b - a}`)] },
    };
  }

  // Ejemplos de la idea 5. Cuentas rehechas aparte (cuentas-ejemplos.py). Letras de nivel 3: C, A, B, D, E.
  const EJEMPLOS_BICUAD = [
    { nivel: 1, titulo: 'El cambio de variable',
      enunciado: ['¿Qué ecuación queda si en x⁴ − 7x² + 12 = 0 se cambia x² por u?'],
      datos: [DD.bicuad],
      solucion: [{ texto: 'x⁴ = (x²)² = u², y x² = u.' }],
      respuesta: [VA('u² − 7u + 12 = 0')] },
    { nivel: 1, titulo: 'De u a x',
      enunciado: ['Al resolver una bicuadrada salió u = 9. ¿Qué raíces x da ese valor?'],
      datos: [DD.vuelta],
      solucion: [{ texto: 'x² = 9 se cumple con 3 y con −3.' }],
      respuesta: [RA('3'), ' y ', RA('−3')] },
    { nivel: 1, titulo: 'Un u negativo',
      enunciado: ['Al resolver una bicuadrada salió u = −16. ¿Qué raíces x da ese valor?'],
      datos: [DD.vuelta, DD.i],
      solucion: [{ texto: 'x² = −16 no tiene raíz real. Con i, √−16 = √16 · i = 4i.', ecuacion: ['x = 4i  o  x = −4i'] }],
      respuesta: [RA('4i'), ' y ', RA('−4i'), ' (no reales)'] },
    { nivel: 1, titulo: '¿Es bicuadrada?',
      enunciado: ['¿Es bicuadrada la ecuación x⁴ − 2x³ + 1 = 0?'],
      datos: ['Bicuadrada: ax⁴ + bx² + c = 0, solo con x⁴, x² y un número'],
      solucion: [{ texto: 'Tiene un término en x³: no es de la forma ax⁴ + bx² + c.' }],
      respuesta: [RA('No'), ': tiene x³'] },
    { nivel: 1, titulo: '¿Es recíproca?',
      enunciado: ['¿Es recíproca la ecuación x⁴ + 3x³ − 5x² + 3x + 1 = 0?'],
      datos: ['Recíproca: sus coeficientes se leen igual de izquierda a derecha que al revés'],
      solucion: [{ texto: 'Sus coeficientes son 1, 3, −5, 3, 1. Al revés: 1, 3, −5, 3, 1.' }],
      respuesta: [RA('Sí')] },
    { nivel: 2, titulo: 'Resolver una bicuadrada',
      enunciado: ['Resuelve x⁴ − 20x² + 64 = 0.'],
      datos: [DD.bicuad, DD.vuelta],
      solucion: [
        { texto: 'Con u = x²: u² − 20u + 64 = 0, que se abre con aspa.', ecuacion: [VA('(u − 4)(u − 16)'), ' = 0'] },
        { texto: 'u = 4 da ±2; u = 16 da ±4.' },
      ],
      respuesta: [RA('2'), ', ', RA('−2'), ', ', RA('4'), ' y ', RA('−4')] },
    { nivel: 2, titulo: 'Reales y no reales',
      enunciado: ['¿Cuáles son las raíces de x⁴ − 5x² − 36 = 0?'],
      datos: [DD.bicuad, DD.vuelta, DD.i],
      solucion: [
        { texto: 'Con u = x²: (u − 9)(u + 4) = 0, así que u = 9 o u = −4.' },
        { texto: 'u = 9 da ±3. u = −4 da x² = −4: 2i y −2i.' },
      ],
      respuesta: [RA('±3'), ' (reales) y ', RA('±2i'), ' (no reales)'] },
    { nivel: 2, titulo: 'El producto de las cuatro',
      enunciado: ['¿Cuánto vale el producto de las cuatro raíces de 2x⁴ − 9x² + 4 = 0?'],
      datos: [DD.bicuad, DD.vuelta, DD.prod4],
      solucion: [
        { texto: 'Se puede sin hallarlas: el término independiente es 4 y a = 2.', ecuacion: ['4/2 = ', RA('2')] },
        { texto: 'Se comprueba: (2u − 1)(u − 4) = 0 da u = 4 y u = 1/2; 2 · (−2) = −4; √(1/2) · (−√(1/2)) = −1/2; (−4) · (−1/2) = 2.' },
      ],
      respuesta: [RA('2')] },
    { nivel: 2, titulo: 'La ecuación en t',
      enunciado: ['En x⁴ − 6x³ + 10x² − 6x + 1 = 0 se divide entre x² y se cambia x + 1/x por t. ¿Qué ecuación queda?'],
      datos: [DD.reciproca, DD.t2],
      solucion: [
        { texto: 'Entre x² queda x² + 1/x² − 6(x + 1/x) + 10 = 0.' },
        { texto: 'Se cambia x² + 1/x² por t² − 2.', ecuacion: [VA('t² − 6t + 8 = 0')] },
      ],
      respuesta: [VA('t² − 6t + 8 = 0')] },
    { nivel: 2, titulo: 'Resolver una recíproca',
      enunciado: ['¿Cuáles son las raíces reales de x⁴ − 4x³ + 5x² − 4x + 1 = 0?'],
      datos: [DD.reciproca, DD.t2, DD.general, DD.deltaDef],
      solucion: [
        { texto: 'Con t = x + 1/x: t² − 4t + 3 = 0, así que t = 1 o t = 3.' },
        { texto: 't = 1 da x² − x + 1 = 0, con Δ = −3: no reales. t = 3 da x² − 3x + 1 = 0.', ecuacion: ['x = (3 ± √5)/2'] },
      ],
      respuesta: [RA('(3 + √5)/2'), ' y ', RA('(3 − √5)/2')] },
    { nivel: 3, titulo: 'Dos impares consecutivos',
      enunciado: ['Dos impares positivos consecutivos cumplen que la suma de sus cuartas potencias es 706. ¿Cuál es el mayor?'],
      alternativas: ['4', '3', '5', '16', '−5'],
      datos: ['Si los impares son x − 1 y x + 1, x es par', '(x − 1)⁴ + (x + 1)⁴ = 2x⁴ + 12x² + 2', DD.bicuad],
      solucion: [
        { texto: '2x⁴ + 12x² + 2 = 706, entre 2: x⁴ + 6x² − 352 = 0. Con u = x²: (u − 16)(u + 22) = 0.' },
        { texto: 'u = 16 da x = 4 (los impares son positivos); u = −22 no da reales. El mayor es x + 1.', ecuacion: ['4 + 1 = ', RA('5')] },
        { texto: ['La ', letra('A'), ' da x, que es par. La ', letra('B'), ' da el menor, x − 1.'] },
        { texto: ['La ', letra('D'), ' se queda en u = 16. La ', letra('E'), ' toma x = −4, que no da impares positivos.'] },
      ],
      respuesta: [letra('C'), ', ', RA('5')] },
    { nivel: 3, titulo: 'El precio',
      enunciado: ['Un precio de x soles cumple x⁴ − 29x² + 100 = 0. ¿Cuánto es la diferencia entre el mayor y el menor precio posibles?'],
      alternativas: ['3 soles', '10 soles', '21 soles', '7 soles', '4 soles'],
      datos: [DD.bicuad, DD.vuelta, 'Un precio es un número positivo'],
      solucion: [
        { texto: 'Con u = x²: (u − 4)(u − 25) = 0. Las raíces son ±2 y ±5; precios, solo 2 y 5.' },
        { texto: 'Se restan.', ecuacion: ['5 − 2 = ', RA('3')] },
        { texto: ['La ', letra('B'), ' toma −5 como precio: 5 − (−5). La ', letra('C'), ' resta los u: 25 − 4.'] },
        { texto: ['La ', letra('D'), ' suma 5 + 2. La ', letra('E'), ' toma 2 y −2: 2 − (−2).'] },
      ],
      respuesta: [letra('A'), ', ', RA('3 soles')] },
    { nivel: 3, titulo: 'Sin raíces reales',
      enunciado: ['¿Cuántas raíces reales y cuántas no reales tiene x⁴ + 13x² + 36 = 0?'],
      alternativas: ['4 reales y 0 no reales', '0 reales y 4 no reales', 'ninguna raíz', '2 reales y 2 no reales', '0 reales y 2 no reales'],
      datos: [DD.bicuad, DD.vuelta, DD.tfa, DD.i],
      solucion: [
        { texto: 'Con u = x²: (u + 4)(u + 9) = 0, así que u = −4 o u = −9. Los dos son negativos.' },
        { texto: 'Cada uno da dos raíces no reales: ±2i y ±3i. Son 4, como el grado.' },
        { texto: ['La ', letra('A'), ' cree que cada u da dos reales. La ', letra('C'), ' cree que sin reales no hay raíces.'] },
        { texto: ['La ', letra('D'), ' cree que uno de los u da reales. La ', letra('E'), ' cuenta una raíz por cada u.'] },
      ],
      respuesta: [letra('B'), ', ', RA('0 reales y 4 no reales')] },
    { nivel: 3, titulo: 'Las raíces positivas',
      enunciado: ['¿Cuánto suman las raíces positivas de x⁴ − 34x² + 225 = 0?'],
      alternativas: ['34', '0', '15', '8', '−8'],
      datos: [DD.bicuad, DD.vuelta],
      solucion: [
        { texto: 'Con u = x²: u² − 34u + 225 = 0. Dos números que multiplican 225 y suman 34 son 9 y 25: (u − 9)(u − 25) = 0. Las raíces son ±3 y ±5.' },
        { texto: 'Las positivas son 3 y 5.', ecuacion: ['3 + 5 = ', RA('8')] },
        { texto: ['La ', letra('A'), ' suma los u. La ', letra('B'), ' suma las cuatro raíces: 3 − 3 + 5 − 5 = 0.'] },
        { texto: ['La ', letra('C'), ' multiplica 3 · 5. La ', letra('E'), ' suma las negativas.'] },
      ],
      respuesta: [letra('D'), ', ', RA('8')] },
    { nivel: 3, titulo: 'La ecuación de t',
      enunciado: ['x⁴ + x³ − 4x² + x + 1 = 0 se resuelve con t = x + 1/x. ¿Qué ecuación cumple t?'],
      alternativas: ['t² + t − 4 = 0', 't² + t − 2 = 0', 't² − t − 6 = 0', 't² + 2t − 6 = 0', 't² + t − 6 = 0'],
      datos: [DD.reciproca, DD.t2],
      solucion: [
        { texto: 'Entre x²: x² + 1/x² + (x + 1/x) − 4 = 0.' },
        { texto: 'Con x² + 1/x² = t² − 2:', ecuacion: ['t² − 2 + t − 4 = ', VA('t² + t − 6'), ' = 0'] },
        { texto: ['La ', letra('A'), ' olvida el −2. La ', letra('B'), ' suma 2 en vez de restar. La ', letra('C'), ' cambia el signo de t.'] },
        { texto: ['La ', letra('D'), ' cuenta x³ y x como 2t: el 1 de los dos va una sola vez, con x + 1/x.'] },
      ],
      respuesta: [letra('E'), ', ', VA('t² + t − 6 = 0')] },
  ];

  const cambio = {
    id: 'cambio-de-variable',
    titulo: 'Bicuadradas y recíprocas',
    pregunta: '¿Cómo se resuelve una ecuación con x⁴, x² y un número?',
    temas: ['Ecuaciones bicuadradas y recíprocas'],
    pieza: 'recta',
    aprendizaje: 'En una bicuadrada se cambia x² por u: cada u positivo da dos raíces opuestas y cada u negativo, dos no reales.',
    actividad: 'Elegir las áreas de dos huertos cuadrados y mirar qué lados salen.',
    // Lee: los dos huertos, la ecuación bicuadrada con u, volver a x y qué mirar. No dice cuántas raíces reales tiene
    // x⁴ + 3x² − 4 = 0 (la predicción) ni qué u dan x⁴ − 13x² + 36 (la misión).
    lee: {
      tarjetas: [
        { titulo: 'Dos huertos cuadrados', texto: 'En el colegio hay dos huertos cuadrados, de 1 m² y 4 m². Si x es el lado de uno, x² vale 1 o 4: (x² − 1)(x² − 4) = 0, o sea x⁴ − 5x² + 4 = 0.',
          pieza: 'alg-objeto', dibujo: OB({ objeto: 'huertos', a: 1, b: 4, junto: false, escala: 38, ladoA: '?', ladoB: '?', nombreA: 'Huerto 1', nombreB: 'Huerto 2' }) },
        { titulo: 'Solo potencias pares', texto: 'x⁴ − 5x² + 4 = 0 solo tiene x⁴, x² y un número: es una ecuación bicuadrada. Como x⁴ = (x²)², al llamar u a x² queda u² − 5u + 4 = 0.',
          ecuacion: ['u = x²:   u² − 5u + 4 = 0'] },
        { titulo: 'Volver a x', texto: 'Cada valor de u se vuelve x con x² = u. Con u = 9: x = 3 o x = −3. Un huerto toma el 3; la ecuación tiene los dos.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir dos valores de u. Mira qué raíces x salen de cada uno, también cuando u es negativo.' },
      ],
    },
    ejemplos: EJEMPLOS_BICUAD,
    juega: {
      pieza: 'recta',
      consigna: 'La ecuación bicuadrada (x² − u₁)(x² − u₂) = 0 junta x² = u₁ y x² = u₂, como dos huertos. Aquí u también puede ser negativo.',
      mision: {
        texto: 'Haz que la ecuación sea x⁴ − 13x² + 36 = 0.',
        logrado: v => [v.u1, v.u2].sort((p, q) => p - q).join() === '4,9',
        bien: 'Listo: u = 4 y u = 9. Cada uno da dos raíces opuestas: ±2 y ±3.',
      },
      voz: 'Lleva un u por debajo de 0 y mira qué pasa con sus raíces.',
      leyenda: [
        { s: VA('u = …'), t: 'x²; la cota une sus dos raíces' },
        { s: RA('x'), t: 'una raíz: el lado, con + o con −' },
      ],
      controles: [
        { id: 'u1', etiqueta: 'u₁', color: 'c-i', min: -4, max: 9, paso: 1, inicio: 1, decimales: 0 },
        { id: 'u2', etiqueta: 'u₂', color: 'c-i', min: -4, max: 9, paso: 1, inicio: -1, decimales: 0 },
      ],
      dibujo: v => recta5([v.u1, v.u2]),
      lectura: v => lectura5(v),
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuántas raíces reales tiene x⁴ + 3x² − 4 = 0?',
      datos: ['x⁴ = (x²)²'],
      voz: 'Primero los dos valores de u; después, qué da cada uno.',
      opciones: [
        { id: 'c', texto: '2', correcta: true },
        { id: 'todas', texto: '4', error: 'TAL-BICUAD-TODAS', siFuera: 'Bien u = 1 y u = −4. Pero x² = −4 no tiene raíz real.' },
        { id: 'positiva', texto: '1', error: 'TAL-BICUAD-POSITIVA', siFuera: 'Bien u = 1. Pero x² = 1 se cumple con 1 y con −1.' },
        { id: 'ninguna', texto: '0', error: 'TAL-BICUAD-NINGUNA', siFuera: 'Bien que u = −4 no da reales. Pero u = 1 sí da dos.' },
      ],
      dibujo: recta5([], { alt: 'Recta vacía: los valores de u y las raíces, por hallar' }),
      revelar: recta5([1, -4], { alt: 'u = 1 da las raíces 1 y −1; u = −4 no da raíces reales' }),
      coincide: 'Coincide: u = 1 da 1 y −1; u = −4 da dos raíces no reales.',
      noCoincide: 'Revisemos: u² + 3u − 4 = (u + 4)(u − 1). u = 1 da dos raíces reales; u = −4, ninguna real.',
    },
    mira: {
      pieza: 'recta',
      datos: recta5([1, 9], { desdeU: 2, desdeX: 3, alt: 'u = 1 y u = 9 en la recta, con las raíces ±1 y ±3' }).datos,
      voz: 'Primero en u; al final se vuelve a x.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Solo hay x⁴, x² y un número: se cambia x² por u.', ecuacion: ['x⁴ − 10x² + 9 = 0  ⇒  ', VA('u² − 10u + 9 = 0')] },
        { estado: { corte: 2 }, texto: 'Aspa: u = 1 o u = 9.', ecuacion: [VA('(u − 1)(u − 9)'), ' = 0'] },
        { estado: { corte: 3 }, texto: 'Cada u da dos raíces opuestas.', ecuacion: [RA('x = ±1'), ';   ', RA('x = ±3')] },
        { estado: { corte: 3 }, texto: 'Una recíproca se lee igual al derecho y al revés.', ecuacion: ['x⁴ − 5x³ + 8x² − 5x + 1 = 0'] },
        { estado: { corte: 3 }, texto: 'Entre x², y con t = x + 1/x, queda de grado 2.', ecuacion: [VA('t² − 2'), ' − 5', VA('t'), ' + 8 = 0  ⇒  ', VA('t² − 5t + 6 = 0')] },
        { estado: { corte: 3 }, texto: 't = 2 da x = 1; t = 3 da x² − 3x + 1 = 0.', ecuacion: ['x = (3 ± √5)/2'] },
      ],
    },
    regla: {
      texto: 'En ax⁴ + bx² + c = 0, x² se cambia por u: cada u positivo da dos raíces opuestas; cada u negativo, dos no reales. Una ecuación recíproca usa t.',
      ecuacion: [VA('u'), ' = x²:   a', VA('u'), '² + b', VA('u'), ' + c = 0'],
      condicion: 't = x + 1/x sirve si la ecuación se lee igual al revés; entre x², x² + 1/x² = t² − 2.',
      voz: 'Al final, siempre se vuelve a x.',
    },
    // Así se resuelve: todas las raíces de una bicuadrada con u enteros cuadrados. «Ahora tú» pide cuántas son reales, la
    // mayor, la ecuación en t de una recíproca y la diferencia de precios.
    resuelve: {
      pieza: 'recta',
      generar(s) {
        const r = azar(s + 900);
        // Ni la misión (2 y 3), ni Lee (1 y 2), ni Mira (1 y 3), ni los ejemplos (2 y 4, 3 y 5, 2 y 5).
        const VETO = ['2,3', '1,2', '1,3', '2,4', '3,5', '2,5'];
        let a, b;
        do { a = r.ent(1, 4); b = r.ent(2, 6); } while (a >= b || VETO.includes(`${a},${b}`));
        const A = a * a, B = b * b;
        return {
          enunciado: [`Resuelve ${ec4(A + B, A * B)}.`],
          datos: [DD.bicuad, DD.vuelta],
          dibujo: recta5([], { min: -7, max: 7, soloX: true, alt: 'Recta vacía: las raíces, por hallar' }),
          pasos: [
            { tipo: 'pide', texto: 'Piden todas las raíces: los valores de x que hacen 0 la ecuación.' },
            { tipo: 'datos', texto: `Solo tiene x⁴, x² y un número: es bicuadrada, con a = 1, b = −${A + B} y c = ${A * B}.` },
            { tipo: 'regla', texto: 'Se cambia x² por u, se resuelve en u y cada u positivo da dos raíces opuestas.' },
            { tipo: 'cuentas', texto: 'En u queda una cuadrática que se abre con aspa.', ecuacion: [VA(`u² − ${A + B}u + ${A * B}`), ' = ', VA(`(u − ${A})(u − ${B})`), ' = 0'], dibujo: recta5([A, B], { min: -7, max: 7, soloX: true, desdeX: 9, alt: 'Recta vacía: las raíces, por hallar' }) },
            { tipo: 'cuentas', texto: `x² = ${A} y x² = ${B}.`, ecuacion: [RA(`x = ±${a}`), ';   ', RA(`x = ±${b}`)], dibujo: recta5([A, B], { min: -7, max: 7, soloX: true, alt: `Las raíces ±${a} y ±${b} en la recta` }) },
            { tipo: 'sentido', texto: `Son 4 raíces, como el grado. Se comprueba una: ${b}⁴ − ${A + B} · ${b}² + ${A * B} = ${b ** 4} − ${(A + B) * B} + ${A * B} = 0.` },
          ],
          respuesta: [RA(`±${a}`), ' y ', RA(`±${b}`)],
        };
      },
    },
    ahoraTu: {
      voz: 'Después de hallar u, revisa su signo.',
      generar(sem) {
        const r = azar(sem + 71), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoCuantasReales, r);
        if (tipo === 1) return conCuatro(casoMayor, r);
        if (tipo === 2) return conCuatro(casoReciproca, r);
        return conCuatro(casoPrecio, r);
      },
    },
  };

  // ---------- Idea 6: ecuaciones de dos términos (binómicas) ----------
  // Objeto: la caja cúbica de 8 dm³ (Lee, alg-objeto 'caja', la de Exponentes y radicales) y la recta con las raíces
  // reales de xⁿ = 1 o xⁿ = −1 (juego, pieza recta). Cambia: n (de 2 a 6) y el número del lado derecho (1 o −1). ·
  // Permanece: hay n raíces. · Progresa: cuántas son reales. · Se reserva: el valor de las no reales (la predicción: su
  // suma en x³ = 8). · Debe verse: con n impar, una real; con n par, dos o ninguna; las demás son no reales.
  // Decisión 2 de la propuesta: se resuelve factorizando, sin el plano complejo (De Moivre es de «Números complejos»).
  // Errores (hipótesis de diseño): TAL-BIN-OPUESTAS cree que las no reales son opuestas · TAL-BIN-SIGNO no cambia el signo
  // de la suma · TAL-BIN-PRODUCTO da el producto · TAL-BIN-TODAS cree que todas son reales · TAL-BIN-UNA toma solo la
  // positiva · TAL-BIN-NEG cree que un número negativo no tiene raíz real con n impar · TAL-SIGNO-VIETE · TAL-PIDE ·
  // TAL-SOLO-REAL.
  const reales6 = (n, s) => (n % 2 ? [s] : s > 0 ? [1, -1] : []);
  const recta6 = (n, s) => {
    const rs = reales6(n, s);
    return RC({ min: -2, max: 2, paso: 1, cada: 1, decimales: 0, variable: 'x', filas: 1,
      elementos: rs.map(v => ({ tipo: 'punto', x: v, color: 'f', rotulo: f(v), fila: 0 })),
      alt: `Raíces reales de x${sup(n)} = ${f(s)}: ${rs.length ? rs.map(v => f(v)).join(' y ') : 'ninguna'}` });
  };
  function lectura6(v) {
    const r = reales6(v.n, v.s).length, nr = v.n - r;
    return [`x${sup(v.n)} = ${f(v.s)}: `, RA(`${r} ${r === 1 ? 'real' : 'reales'}`), ` y ${nr} no ${nr === 1 ? 'real' : 'reales'}; ${r} + ${nr} = ${v.n}`];
  }
  // Las dos raíces no reales de x³ = ±k³: del trinomio x² ± kx + k², con la fórmula general.
  function noRealesCubo(k, signo) {
    // x³ − k³: x² + kx + k² → (−k ± k√3 i)/2;   x³ + k³: x² − kx + k² → (k ± k√3 i)/2.
    const b = signo > 0 ? -k : k;
    if (k % 2 === 0) { const h = k / 2; return [`${b < 0 ? '−' : ''}${Math.abs(b) / 2} + ${h === 1 ? '' : h}√3 i`, `${b < 0 ? '−' : ''}${Math.abs(b) / 2} − ${h === 1 ? '' : h}√3 i`]; }
    return [`(${b < 0 ? '−' : ''}${k} + ${k}√3 i)/2`, `(${b < 0 ? '−' : ''}${k} − ${k}√3 i)/2`];
  }
  function casoRealesBin(r) {
    const n = r.ent(3, 8), k = r.ent(2, 3), s = r.uno([1, -1]), c = s * k ** n;
    if (Math.abs(c) > 999 || (n === 3 && k === 2 && s > 0)) return null;   // x³ = 8 es la predicción
    const bien = n % 2 ? 1 : s > 0 ? 2 : 0;
    return {
      pregunta: [`¿Cuántas raíces reales tiene x${sup(n)} = ${f(c)}?`],
      datos: [DD.tfa, 'Un número real elevado a un exponente par nunca es negativo', `${k}${sup(n)} = ${f(Math.abs(c))}`],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'todas', texto: f(n), error: 'TAL-BIN-TODAS', siFuera: `Bien que hay ${n} raíces. Pero no todas son reales.` },
        n % 2 ? { id: 'neg', texto: s < 0 ? '0' : '2', error: s < 0 ? 'TAL-BIN-NEG' : 'TAL-BIN-UNA', siFuera: s < 0 ? `Bien que ${f(c)} es negativo. Pero n es impar: (−${k})${sup(n)} = ${f(c)}.` : `Bien ${k}. Pero n es impar: (−${k})${sup(n)} es negativo y no sirve.` }
          : { id: 'una', texto: s > 0 ? '1' : '2', error: s > 0 ? 'TAL-BIN-UNA' : 'TAL-BIN-TODAS', siFuera: s > 0 ? `Bien ${k}. Pero n es par: −${k} también, (−${k})${sup(n)} = ${f(c)}.` : `Bien buscar ±${k}. Pero ${k}${sup(n)} es positivo y el número es negativo.` },
        { id: 'otra', texto: f(bien === 1 ? 2 : bien === 2 ? 0 : 1), error: 'TAL-SOLO-REAL', siFuera: `Bien mirar el exponente ${n}. Pero cuenta qué números reales elevados a ${n} dan ${f(c)}.` },
        { id: 'tres', texto: '3', error: 'TAL-BIN-TODAS', siFuera: 'Bien que hay reales y no reales. Pero las reales son a lo más dos: una positiva y otra negativa.' },
      ]),
      solucion: { texto: n % 2 ? `n = ${n} es impar: solo ${f(s * k)} cumple.` : s > 0 ? `n = ${n} es par y ${f(c)} es positivo: cumplen ${k} y −${k}.` : `n = ${n} es par y ${f(c)} es negativo: ningún real cumple.`, ecuacion: [RA(`${bien} ${bien === 1 ? 'real' : 'reales'}`)] },
    };
  }
  function casoNoRealesBin(r) {
    const n = r.ent(3, 8), k = r.ent(2, 3), s = r.uno([1, -1]), c = s * k ** n;
    if (Math.abs(c) > 999 || (n === 3 && k === 2 && s > 0)) return null;   // x³ = 8 es la predicción
    const re = n % 2 ? 1 : s > 0 ? 2 : 0, bien = n - re;
    return {
      pregunta: [`¿Cuántas raíces no reales tiene x${sup(n)} = ${f(c)}?`],
      datos: [DD.tfa, 'Un número real elevado a un exponente par nunca es negativo', `${k}${sup(n)} = ${f(Math.abs(c))}`],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'grado', texto: f(n), error: 'TAL-GRADO', siFuera: `Bien que hay ${n} raíces. Pero ${re === 1 ? 'una es real' : `${k} y −${k} son reales`}.` },
        { id: 'menos', texto: f(n - (re === 2 ? 1 : re === 1 ? 2 : 2)), error: re === 2 ? 'TAL-BIN-UNA' : 'TAL-BIN-TODAS', siFuera: re === 2 ? `Bien ${k}. Pero −${k} también es real: se restan dos.` : re === 1 ? `Bien que hay una real. Pero solo una: ${f(s * k)}.` : 'Bien que el número es negativo. Pero entonces ningún real cumple: no se resta nada.' },
        { id: 'cero', texto: '0', error: 'TAL-SOLO-REAL', siFuera: `Bien buscar raíces. Pero un polinomio de grado ${n} tiene ${n}, y no todas son reales.` },
        { id: 'uno', texto: '1', error: 'TAL-CONJUGADA', siFuera: 'Bien que hay no reales. Pero llegan en pareja: su número es par.' },
      ]),
      solucion: { texto: `Son ${n} en total y ${re} ${re === 1 ? 'es real' : 'son reales'}.`, ecuacion: [`${n} − ${re} = `, RA(f(bien))] },
    };
  }
  function casoProductoNR(r) {
    const k = r.ent(2, 6), s = r.uno([1, -1]);
    if (k === 2 && s > 0) return null;   // x³ = 8 es la predicción
    const c = s * k ** 3, tri = poli([1, s * k, k * k]);
    return {
      pregunta: [`¿Cuánto vale el producto de las dos raíces no reales de x³ = ${f(c)}?`],
      datos: [s > 0 ? DD.difCubos : DD.sumCubos, DD.sp2],
      opciones: ops([
        { id: 'c', texto: f(k * k), correcta: true },
        { id: 'signo', texto: f(-k * k), error: 'TAL-SIGNO-VIETE', siFuera: `Bien el trinomio ${tri}. Pero el producto es c/a = ${k * k}, sin cambiar el signo.` },
        { id: 'suma', texto: f(-s * k), error: 'TAL-BIN-PRODUCTO', siFuera: `Bien el trinomio ${tri}. Pero ${f(-s * k)} es la suma; el producto es c/a.` },
        { id: 'todas', texto: f(c), error: 'TAL-PIDE', siFuera: `Bien con Cardano-Vieta. Pero ${f(c)} es el producto de las tres; falta quitar la real, ${f(s * k)}.` },
      ]),
      solucion: { texto: `x³ ${s > 0 ? '−' : '+'} ${k ** 3} = (x ${s > 0 ? '−' : '+'} ${k})(${tri}): las no reales son las del trinomio.`, ecuacion: ['producto = c/a = ', RA(f(k * k))] },
    };
  }
  // Ahora tú 4 (nivel examen): el producto de las cuatro raíces de x⁴ = k⁴.
  function casoProductoTodas(r) {
    const k = r.ent(2, 5);
    if (k === 3) return null;   // x⁴ = 81 está en los ejemplos
    return {
      pregunta: [`¿Cuánto vale el producto de las cuatro raíces de x⁴ = ${k ** 4}, contando las no reales?`],
      datos: [DD.difCuad, DD.i, DD.prod4],
      opciones: ops([
        { id: 'c', texto: f(-(k ** 4)), correcta: true },
        { id: 'signo', texto: f(k ** 4), error: 'TAL-SIGNO-VIETE', siFuera: `Bien con Cardano-Vieta. Pero el término independiente de x⁴ − ${k ** 4} es −${k ** 4}.` },
        { id: 'reales', texto: f(-k * k), error: 'TAL-SOLO-REAL', siFuera: `Bien ${k} · (−${k}). Pero faltan las no reales, ${k}i y −${k}i, que multiplican ${k * k}.` },
        { id: 'noreales', texto: f(k * k), error: 'TAL-PIDE', siFuera: `Bien ${k}i · (−${k}i) = ${k * k}. Pero faltan las reales, ${k} y −${k}.` },
      ]),
      solucion: { texto: `x⁴ − ${k ** 4} = (x² − ${k * k})(x² + ${k * k}): raíces ±${k} y ±${k}i.`, ecuacion: [`${k} · (−${k}) · ${k}i · (−${k}i) = (−${k * k}) · ${k * k} = `, RA(f(-(k ** 4)))] },
    };
  }

  // Ejemplos de la idea 6. Cuentas rehechas aparte (cuentas-ejemplos.py). Letras de nivel 3: C, A, B, D, E.
  const EJEMPLOS_BINOMICA = [
    { nivel: 1, titulo: 'Una sola real',
      enunciado: ['¿Cuál es la raíz real de x³ = −64?'],
      datos: ['Con n impar, xⁿ igual a un número tiene una sola raíz real, con el signo de ese número', '4³ = 64'],
      solucion: [{ texto: 'El exponente 3 es impar: la raíz real es negativa, como −64.', ecuacion: ['(−4)³ = −64'] }],
      respuesta: [RA('−4')] },
    { nivel: 1, titulo: 'Dos reales opuestas',
      enunciado: ['¿Cuáles son las raíces reales de x⁴ = 81?'],
      datos: ['81 = 3⁴', 'Con exponente par, un número y su opuesto dan la misma potencia'],
      solucion: [{ texto: '3⁴ = 81 y (−3)⁴ = 81: el exponente es par.' }],
      respuesta: [RA('3'), ' y ', RA('−3')] },
    { nivel: 1, titulo: 'Ninguna real',
      enunciado: ['¿Cuántas raíces reales tiene x⁶ = −1?'],
      datos: ['Un número real elevado a un exponente par nunca es negativo'],
      solucion: [{ texto: 'x⁶ es una potencia par: con x real nunca da −1.' }],
      respuesta: [RA('Ninguna'), ' (las seis son no reales)'] },
    { nivel: 1, titulo: 'Cuántas en total',
      enunciado: ['¿Cuántas raíces tiene x⁵ = 7, contando las no reales?'],
      datos: [DD.tfa],
      solucion: [{ texto: 'x⁵ − 7 = 0 es de grado 5: tiene 5 raíces.' }],
      respuesta: [RA('5 raíces')] },
    { nivel: 1, titulo: 'Factorizar para resolver',
      enunciado: ['Para resolver x³ = 1, ¿cómo se factoriza x³ − 1?'],
      datos: [DD.binomica, DD.difCubos],
      solucion: [{ texto: 'Es una diferencia de cubos, con A = x y B = 1.', ecuacion: ['x³ − 1 = (x − 1)(x² + x + 1)'] }],
      respuesta: [RA('(x − 1)(x² + x + 1)')] },
    { nivel: 2, titulo: 'Las cuatro de x⁴ = 1',
      enunciado: ['¿Cuáles son las raíces de x⁴ = 1?'],
      datos: [DD.binomica, DD.difCuad, DD.i],
      solucion: [
        { texto: 'Diferencia de cuadrados: x⁴ − 1 = (x² − 1)(x² + 1).' },
        { texto: 'x² = 1 da ±1. x² = −1 da i y −i.' },
      ],
      respuesta: [RA('1, −1, i y −i')] },
    { nivel: 2, titulo: 'Las no reales de x³ = 1',
      enunciado: ['¿Cuáles son las dos raíces no reales de x³ = 1?'],
      datos: [DD.difCubos, DD.general, DD.deltaDef, DD.i],
      solucion: [
        { texto: 'x³ − 1 = (x − 1)(x² + x + 1). Las no reales son las del trinomio, con Δ = 1 − 4 = −3.' },
        { texto: '√−3 = √3 i.', ecuacion: ['x = (−1 ± √3 i)/2'] },
      ],
      respuesta: [RA('(−1 + √3 i)/2'), ' y ', RA('(−1 − √3 i)/2')] },
    { nivel: 2, titulo: 'La suma de las tres',
      enunciado: ['x³ = 125 tiene tres raíces. ¿Cuánto suman?'],
      datos: [DD.vieta, DD.vieta2, DD.vieta3],
      solucion: [
        { texto: 'x³ − 125 = 0 no tiene término en x²: b = 0.' },
        { texto: 'La suma es −b/a.', ecuacion: ['−0/1 = ', RA('0')] },
        { texto: 'La real, 5, y las dos no reales, que suman −5, dan 0.' },
      ],
      respuesta: [RA('0')] },
    { nivel: 2, titulo: 'El producto de las no reales',
      enunciado: ['¿Cuánto vale el producto de las dos raíces no reales de x³ + 8 = 0?'],
      datos: [DD.sumCubos, DD.sp2],
      solucion: [
        { texto: 'Suma de cubos: x³ + 8 = (x + 2)(x² − 2x + 4). Las no reales son las del trinomio.' },
        { texto: 'Su producto es c/a.', ecuacion: ['4/1 = ', RA('4')] },
      ],
      respuesta: [RA('4')] },
    { nivel: 2, titulo: 'Las reales de x⁶ = 64',
      enunciado: ['¿Cuáles son las raíces reales de x⁶ = 64?'],
      datos: [DD.difCuad, DD.difCubos, DD.sumCubos, DD.delta],
      solucion: [
        { texto: 'Diferencia de cuadrados: x⁶ − 64 = (x³ − 8)(x³ + 8).' },
        { texto: 'x³ = 8 da la real 2; x³ = −8, la real −2. Los dos trinomios que quedan tienen Δ < 0.' },
      ],
      respuesta: [RA('2'), ' y ', RA('−2')] },
    { nivel: 3, titulo: 'Cuántas no reales',
      enunciado: ['¿Cuántas raíces no reales tiene x⁶ = 64?'],
      alternativas: ['6', '2', '4', '0', '5'],
      datos: [DD.tfa, DD.difCuad, 'Un número real elevado a un exponente par nunca es negativo'],
      solucion: [
        { texto: 'Son 6 raíces. Las reales son 2 y −2, porque el exponente es par y 64 es positivo.' },
        { texto: 'Las demás no son reales.', ecuacion: ['6 − 2 = ', RA('4')] },
        { texto: ['La ', letra('A'), ' cree que todas son no reales. La ', letra('B'), ' cuenta solo las de un trinomio.'] },
        { texto: ['La ', letra('D'), ' cree que todas son reales. La ', letra('E'), ' resta solo la real 2: 6 − 1.'] },
      ],
      respuesta: [letra('C'), ', ', RA('4')] },
    { nivel: 3, titulo: 'La trampa del exponente par',
      enunciado: ['¿Cuáles son las raíces reales de x⁴ + 16 = 0?'],
      alternativas: ['ninguna', '2 y −2', '−2', '2', '2i y −2i'],
      datos: ['Un número real elevado a un exponente par nunca es negativo', DD.i],
      solucion: [
        { texto: 'x⁴ + 16 = 0 pide x⁴ = −16. Una cuarta potencia de un real nunca es negativa: no hay raíz real.' },
        { texto: 'Las cuatro raíces son no reales.' },
        { texto: ['La ', letra('B'), ' resuelve x⁴ = 16. La ', letra('C'), ' cree que (−2)⁴ = −16, pero da 16.'] },
        { texto: ['La ', letra('D'), ' toma la positiva de x⁴ = 16. La ', letra('E'), ' no sirve: (2i)⁴ = 16, no −16.'] },
      ],
      respuesta: [letra('A'), ', ', RA('ninguna')] },
    { nivel: 3, titulo: 'La suma de las no reales',
      enunciado: ['¿Cuánto suman las dos raíces no reales de x³ = 27?'],
      alternativas: ['3', '−3', '0', '9', '−3/2'],
      datos: [DD.difCubos, DD.sp2, DD.i],
      solucion: [
        { texto: 'x³ − 27 = (x − 3)(x² + 3x + 9). Las no reales son las del trinomio.' },
        { texto: 'Su suma es −b/a.', ecuacion: ['−3/1 = ', RA('−3')] },
        { texto: ['La ', letra('A'), ' no cambia el signo. La ', letra('C'), ' cree que son opuestas. La ', letra('D'), ' da su producto, c/a.'] },
        { texto: ['La ', letra('E'), ' da la parte real de una sola: (−3 + 3√3 i)/2 tiene −3/2.'] },
      ],
      respuesta: [letra('B'), ', ', RA('−3')] },
    { nivel: 3, titulo: 'El producto de las cuatro',
      enunciado: ['¿Cuánto vale el producto de las cuatro raíces de x⁴ = 81, contando las no reales?'],
      alternativas: ['81', '−9', '9', '−81', '0'],
      datos: [DD.difCuad, DD.i, DD.prod4],
      solucion: [
        { texto: 'Todo a un lado: x⁴ − 81 = 0, con término independiente −81. Se factoriza: x⁴ − 81 = (x² − 9)(x² + 9), y las raíces son ±3 y ±3i.' },
        { texto: 'Se multiplican; también sale con Cardano-Vieta: −81/1.', ecuacion: ['3 · (−3) · 3i · (−3i) = (−9) · 9 = ', RA('−81')] },
        { texto: ['La ', letra('A'), ' olvida el signo del término independiente. La ', letra('B'), ' multiplica solo las reales.'] },
        { texto: ['La ', letra('C'), ' multiplica solo las no reales. La ', letra('E'), ' da la suma de las cuatro.'] },
      ],
      respuesta: [letra('D'), ', ', RA('−81')] },
    { nivel: 3, titulo: 'Las que no son arista',
      enunciado: ['Una caja cúbica guarda 343 dm³: su arista cumple x³ = 343. ¿Cuánto vale el producto de las dos raíces que no sirven como arista?'],
      alternativas: ['−49', '7', '343', '−7', '49'],
      datos: [DD.difCubos, DD.sp2, '7³ = 343'],
      figura: OB({ objeto: 'caja', V: 343, loseta: false, arista: '?' }),
      solucion: [
        { texto: 'x³ − 343 = (x − 7)(x² + 7x + 49). La arista es 7; las otras dos son no reales, las del trinomio.' },
        { texto: 'Su producto es c/a.', ecuacion: ['49/1 = ', RA('49')] },
        { texto: ['La ', letra('A'), ' cambia el signo. La ', letra('B'), ' da la arista. La ', letra('C'), ' da el producto de las tres.'] },
        { texto: ['La ', letra('D'), ' da la suma de las dos no reales, −b/a.'] },
      ],
      respuesta: [letra('E'), ', ', RA('49')] },
  ];

  const binomica = {
    id: 'binomica',
    titulo: 'Ecuaciones de dos términos',
    pregunta: '¿Cuántas raíces reales tiene xⁿ igual a un número?',
    temas: ['Ecuación binómica'],
    pieza: 'recta',
    aprendizaje: 'xⁿ igual a un número tiene n raíces: con n impar, una real; con n par, dos opuestas o ninguna; las demás, no reales.',
    actividad: 'Cambiar el exponente y el signo del número, y contar las raíces reales y no reales.',
    // Lee: la caja cúbica de 8 dm³, qué es una ecuación de dos términos, la diferencia de cubos y qué mirar. No dice
    // cuánto suman las no reales de x³ = 8 (la predicción) ni qué n da dos reales y cuatro no reales (la misión).
    lee: {
      tarjetas: [
        { titulo: 'Una caja cúbica', texto: 'Rubén quiere una caja cúbica que guarde 8 dm³. Su arista x, la raíz cúbica de 8, cumple x³ = 8: una ecuación con solo dos términos, x³ − 8 = 0.',
          pieza: 'alg-objeto', dibujo: OB({ objeto: 'caja', V: 8, loseta: false, arista: '?' }) },
        { titulo: 'Dos términos', texto: 'Una ecuación binómica tiene dos términos: una potencia de x y un número, como x⁴ − 81 = 0 o x³ + 27 = 0. Se resuelve factorizando.' },
        { titulo: 'Lo que ya sabes', texto: 'x³ − 8 es una diferencia de cubos. El trinomio que sale tiene discriminante Δ = 4 − 16 = −12: no da reales. La arista es 2, pero la ecuación tiene tres raíces.',
          ecuacion: ['x³ − 8 = (x − 2)(x² + 2x + 4)'] },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia el exponente n y el signo del número. Cuenta las raíces reales sobre la recta y lee cuántas no reales hay.' },
      ],
    },
    ejemplos: EJEMPLOS_BINOMICA,
    juega: {
      pieza: 'recta',
      consigna: 'La ecuación xⁿ igual a 1, o a −1, tiene n raíces. En la recta se ven solo las reales.',
      mision: {
        texto: 'Haz que la ecuación tenga dos raíces reales y cuatro no reales.',
        logrado: v => v.n === 6 && v.s === 1,
        bien: 'Listo: x⁶ = 1 tiene las reales 1 y −1, y cuatro no reales.',
      },
      voz: 'Prueba exponentes pares e impares con los dos signos.',
      leyenda: [
        { s: RA('●'), t: 'una raíz real de la ecuación' },
        { s: 'n', t: 'el exponente: el grado de la ecuación' },
      ],
      controles: [
        { id: 'n', etiqueta: 'n', min: 2, max: 6, paso: 1, inicio: 2, decimales: 0 },
        { id: 's', etiqueta: 'El número', opciones: [{ valor: 1, texto: '1' }, { valor: -1, texto: '−1' }] },
      ],
      dibujo: v => recta6(v.n, v.s),
      lectura: v => lectura6(v),
      minimo: 3,
    },
    predice: {
      pregunta: 'x³ = 8 tiene la raíz real 2. ¿Cuánto suman sus dos raíces no reales?',
      datos: ['x³ − 8 = (x − 2)(x² + 2x + 4)'],
      voz: 'Son las raíces de x² + 2x + 4: ¿qué suman las raíces de un trinomio (idea 2)?',
      opciones: [
        { id: 'c', texto: '−2', correcta: true },
        { id: 'opuestas', texto: '0', error: 'TAL-BIN-OPUESTAS', siFuera: 'Bien que salen del trinomio. Pero no son opuestas: suman lo que dice su coeficiente de x.' },
        { id: 'signo', texto: '2', error: 'TAL-BIN-SIGNO', siFuera: 'Bien usar el 2x del trinomio. Pero la suma es ese 2 con el signo cambiado.' },
        { id: 'producto', texto: '4', error: 'TAL-BIN-PRODUCTO', siFuera: 'Bien usar el trinomio. Pero 4 es el producto de las dos, no su suma.' },
      ],
      dibujo: TB({ columnas: ['raíz', 'sale de'], filas: [['2', 'x − 2'], [{ t: '?', hueco: true }, 'x² + 2x + 4'], [{ t: '?', hueco: true }, 'x² + 2x + 4']], alt: 'La raíz real 2 sale de x − 2; las otras dos, del trinomio x² + 2x + 4, por hallar' }),
      revelar: TB({ columnas: ['raíz', 'sale de'], filas: [['2', 'x − 2'], [{ t: '−1 + √3 i', color: 'f' }, 'x² + 2x + 4'], [{ t: '−1 − √3 i', color: 'f' }, 'x² + 2x + 4']], pie: 'las dos no reales suman −2',
        alt: 'Las raíces no reales son −1 + √3 i y −1 − √3 i: suman −2' }),
      coincide: 'Coincide: son −1 + √3 i y −1 − √3 i, y suman −2. Con la real 2, las tres suman 0.',
      noCoincide: 'Revisemos: en x² + 2x + 4 las dos raíces suman −b/a = −2.',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: { columnas: ['ecuación', 'reales', 'no reales'], filas: [
        [{ t: 'x⁴ = 16', desde: 1 }, { t: '2 y −2', desde: 2, color: 'f' }, { t: '2i y −2i', desde: 3 }],
        [{ t: 'x³ = −27', desde: 5 }, { t: '−3', desde: 5, color: 'f' }, { t: 'dos', desde: 5 }],
      ], alt: 'x⁴ = 16 tiene las reales 2 y −2 y las no reales 2i y −2i; x³ = −27 tiene la real −3 y dos no reales' },
      voz: 'Se pasa todo a un lado y se factoriza.',
      pasos: [
        { estado: { corte: 1 }, texto: 'x⁴ = 16: se pasa el 16 y se factoriza la diferencia de cuadrados.', ecuacion: ['x⁴ − 16 = (x² + 4)(x² − 4)'] },
        { estado: { corte: 2 }, texto: 'x² − 4 = 0 da dos raíces reales opuestas.', ecuacion: [RA('x = 2'), ';   ', RA('x = −2')] },
        { estado: { corte: 3 }, texto: 'x² + 4 = 0 da dos no reales.', ecuacion: ['x² = −4  ⇒  x = 2i;   x = −2i'] },
        { estado: { corte: 4 }, texto: 'Cuatro raíces para grado 4; las no reales, en pareja.', ecuacion: ['2 + 2 = 4'] },
        { estado: { corte: 5 }, texto: 'Con n impar hay una sola real: x³ = −27 da −3.', ecuacion: ['x³ + 27 = (x + 3)(x² − 3x + 9)'] },
      ],
    },
    regla: {
      texto: 'xⁿ igual a un número tiene n raíces. Con n impar, una es real; con n par, dos reales opuestas si el número es positivo y ninguna si es negativo.',
      ecuacion: ['x³ − 8 = (x − 2)(x² + 2x + 4)'],
      condicion: 'el número no es 0; se factoriza, y las no reales salen de un trinomio sin raíces reales.',
      voz: 'Factoriza: un trinomio con discriminante negativo (Δ = b² − 4ac < 0) no da raíces reales.',
      dibujo: TB({ columnas: ['n', 'número > 0', 'número < 0'], filas: [['impar', '1 real', '1 real'], ['par', '2 reales opuestas', 'ninguna real']], alt: 'Raíces reales de xⁿ igual a un número: con n impar, una; con n par, dos si el número es positivo y ninguna si es negativo' }),
    },
    // Así se resuelve: las tres raíces de x³ = ±k³. «Ahora tú» pide cuántas reales, cuántas no reales, el producto de
    // las no reales de x³ = ±k³ y el producto de las cuatro raíces de x⁴ = k⁴.
    resuelve: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s + 900);
        const k = r.ent(3, 5), sg = r.uno([1, -1]);
        const c = sg * k ** 3, tri = poli([1, sg * k, k * k]), D = -3 * k * k, [z1, z2] = noRealesCubo(k, sg);
        const tabla = filas => TB({ columnas: ['raíz', 'sale de'], filas, alt: `Raíces de x³ = ${f(c)}` });
        return {
          enunciado: [`¿Cuáles son las tres raíces de x³ = ${f(c)}?`],
          datos: [sg > 0 ? DD.difCubos : DD.sumCubos, DD.general, DD.deltaDef, DD.i],
          dibujo: tabla([[{ t: '?', hueco: true }, binx(sg * k)], [{ t: '?', hueco: true }, tri], [{ t: '?', hueco: true }, tri]]),
          pasos: [
            { tipo: 'pide', texto: 'Piden las tres raíces: la real y las dos no reales.' },
            { tipo: 'regla', texto: `Se pasa todo a un lado y se factoriza la ${sg > 0 ? 'diferencia' : 'suma'} de cubos.`, ecuacion: [`x³ ${sg > 0 ? '−' : '+'} ${k ** 3} = (${binx(sg * k)})(${tri})`] },
            { tipo: 'cuentas', texto: `${binx(sg * k)} = 0 da la raíz real.`, ecuacion: [RA(`x = ${f(sg * k)}`)], dibujo: tabla([[{ t: f(sg * k), color: 'f' }, binx(sg * k)], [{ t: '?', hueco: true }, tri], [{ t: '?', hueco: true }, tri]]) },
            { tipo: 'cuentas', texto: `En el trinomio, Δ = ${k * k} − ${4 * k * k} = ${f(D)}, y √${f(D)} = ${k}√3 i.`, ecuacion: [`x = (${f(-sg * k)} ± ${k}√3 i)/2`] },
            { tipo: 'cuentas', texto: 'Las dos no reales, una con + y otra con −.', ecuacion: [RA(z1), ';   ', RA(z2)], dibujo: tabla([[{ t: f(sg * k), color: 'f' }, binx(sg * k)], [{ t: z1, color: 'f' }, tri], [{ t: z2, color: 'f' }, tri]]) },
            { tipo: 'sentido', texto: `Tres raíces para grado 3, y las no reales son conjugadas. Suman ${f(sg * k)} + ${f(-sg * k)} = 0, como pide −b/a con b = 0.` },
          ],
          respuesta: [RA(f(sg * k)), ', ', RA(z1), ' y ', RA(z2)],
        };
      },
    },
    ahoraTu: {
      voz: 'Primero el signo del número y si n es par o impar.',
      generar(sem) {
        const r = azar(sem + 81), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoRealesBin, r);
        if (tipo === 1) return conCuatro(casoNoRealesBin, r);
        if (tipo === 2) return conCuatro(casoProductoNR, r);
        return conCuatro(casoProductoTodas, r);
      },
    },
  };

  // ---------- Laboratorio (mesas sin misión) ----------
  // Mesa 1 (idea 2): la cúbica con sus tres raíces y el coeficiente principal libres. Con a = 2 o a = −1 los coeficientes
  // cambian y las cuentas de las raíces no; la lectura las da como −b/a, c/a y −d/a.
  const EJES_L = { x: { min: -4, max: 4, paso: 1, nombre: 'x', decimales: 0 }, y: { min: -12, max: 12, paso: 4, nombre: 'y', decimales: 0 } };
  const cubicaLibre = v => {
    const cs = desdeRaices([v.r1, v.r2, v.r3], v.a);
    return EJ(Object.assign({}, EJES_L, { curvas: [{ puntos: curva(x => evaluar(cs, x), -4, 4, -12, 12), color: null }],
      puntos: [...new Set([v.r1, v.r2, v.r3])].map(r => ({ x: r, y: 0, color: 'f' })),
      alt: `Curva de ${poli(cs)}: raíces ${[v.r1, v.r2, v.r3].map(r => f(r)).join(', ')}` }));
  };
  // Mesa 2 (idea 1): grado 3, 4 o 5 que sube y baja. Raíces reales contadas con su repetición: los cambios de signo en una
  // malla fina (que no pasa por los puntos de tangencia) dan las simples; un mínimo o máximo que toca el eje, una doble.
  const FAMILIAS = { 3: [1, 0, -3, 0], 4: [1, 0, -4, 0, 0], 5: [1, 0, -5, 0, 4, 0] };
  const conD = (g, d) => { const k = FAMILIAS[g].slice(); k[k.length - 1] += d; return k; };
  function realesConRepeticion(cs) {
    const p = v => evaluar(cs, v), n = cs.length - 1;
    const der = cs.slice(0, -1).map((a, i) => a * (n - i)), dp = v => evaluar(der, v);
    let cuenta = 0;
    const N = 4000, a0 = -3.0001, h = 6 / N;
    for (let i = 0; i < N; i++) { const xa = a0 + i * h, xb = xa + h; if ((p(xa) < 0) !== (p(xb) < 0)) cuenta++; if ((dp(xa) < 0) !== (dp(xb) < 0)) { const xc = biseccion(dp, xa, xb); if (Math.abs(p(xc)) < 1e-6) cuenta += 2; } }
    return cuenta;
  }
  const cambiosDeSigno = cs => { let n = 0; for (let i = 0; i < 4000; i++) { const xa = -3.0001 + i * 6 / 4000; if ((evaluar(cs, xa) < 0) !== (evaluar(cs, xa + 6 / 4000) < 0)) n++; } return n; };
  const subeBaja = v => { const k = conD(v.g, v.d); return EJ(Object.assign({}, EJES1, { curvas: [{ puntos: curva(x => evaluar(k, x), -3, 3, -8, 8), color: null }], alt: `Curva de ${poli(k)}` })); };
  // El mayor término independiente de la cúbica libre (raíces de −3 a 3, a = 1, 2 o −1): se calcula, no se escribe.
  const MAX_D = (() => { let m = -Infinity; const R = [-3, -2, -1, 0, 1, 2, 3]; for (const a of [1, 2, -1]) for (const p of R) for (const q of R) for (const s of R) m = Math.max(m, desdeRaices([p, q, s], a)[3]); return m; })();
  const mesaCubica = {
    id: 'cubica-libre', titulo: 'Cúbica con raíces y a libres', pieza: 'ejes',
    consigna: 'Elige las tres raíces y el coeficiente principal a. Abajo, la suma, los productos de a dos y el producto, leídos en los coeficientes.',
    controles: [
      { id: 'r1', etiqueta: 'x₁', color: 'c-f', min: -3, max: 3, paso: 1, inicio: -2, decimales: 0 },
      { id: 'r2', etiqueta: 'x₂', color: 'c-f', min: -3, max: 3, paso: 1, inicio: 1, decimales: 0 },
      { id: 'r3', etiqueta: 'x₃', color: 'c-f', min: -3, max: 3, paso: 1, inicio: 3, decimales: 0 },
      { id: 'a', etiqueta: 'a', opciones: [{ valor: 1, texto: '1' }, { valor: 2, texto: '2' }, { valor: -1, texto: '−1' }] },
    ],
    dibujo: v => cubicaLibre(v),
    lectura: v => { const c = desdeRaices([v.r1, v.r2, v.r3], v.a); return [`−b/a = ${f(-c[1] / v.a)};   c/a = ${f(c[2] / v.a)};   −d/a = ${f(-c[3] / v.a)}`]; },
    invitaciones: [
      { texto: 'Haz que la suma de las raíces sea 0.',
        logrado: v => v.r1 + v.r2 + v.r3 === 0,
        bien: 'Suma cero: el polinomio queda sin término en x².' },
      { texto: 'Consigue que el producto de las raíces sea 6.',
        logrado: v => v.r1 * v.r2 * v.r3 === 6,
        bien: '−d/a = 6, con el a que elijas: el producto lo deciden las raíces.' },
      { texto: 'Busca el mayor término independiente d de la mesa.',
        logrado: v => desdeRaices([v.r1, v.r2, v.r3], v.a)[3] === MAX_D,
        bien: `d = ${MAX_D}: el más grande que da esta mesa.` },
      { texto: 'Guarda dos casos con la misma suma de raíces y distinto producto.',
        logrado: (v, guardados) => {
          const sp = w => [w.r1 + w.r2 + w.r3, w.r1 * w.r2 * w.r3], [s0, p0] = sp(v);
          return guardados.some(g => sp(g)[0] === s0 && sp(g)[1] !== p0) && guardados.some(g => ['r1', 'r2', 'r3', 'a'].every(k => g[k] === v[k]));
        },
        bien: 'Misma −b/a, distinto −d/a: la suma sola no decide el polinomio.' },
    ],
  };
  const mesaSubeBaja = {
    id: 'sube-baja', titulo: 'Tres grados que suben y bajan', pieza: 'ejes',
    consigna: 'Elige el grado y mueve d, el término independiente. Cuenta los cortes: una curva que solo toca el eje da una raíz doble.',
    controles: [
      { id: 'g', etiqueta: 'Grado', opciones: [{ valor: 3, texto: '3' }, { valor: 4, texto: '4' }, { valor: 5, texto: '5' }] },
      { id: 'd', etiqueta: 'd', color: 'c-o', min: -6, max: 6, paso: 1, inicio: 0, decimales: 0 },
    ],
    dibujo: v => subeBaja(v),
    lectura: v => { const m = realesConRepeticion(conD(v.g, v.d)); return [`Grado ${v.g}: ${m} ${m === 1 ? 'real' : 'reales'} y ${v.g - m} no ${v.g - m === 1 ? 'real' : 'reales'}`]; },
    invitaciones: [
      { texto: 'Con grado 4, haz que no haya ninguna raíz real.',
        logrado: v => v.g === 4 && realesConRepeticion(conD(v.g, v.d)) === 0,
        bien: 'Las cuatro raíces son no reales: dos parejas de conjugadas.' },
      { texto: 'Con grado 3, busca un d donde la curva solo toque el eje en un punto.',
        logrado: v => v.g === 3 && realesConRepeticion(conD(v.g, v.d)) > cambiosDeSigno(conD(v.g, v.d)),
        bien: 'Ahí hay una raíz doble: toca sin cruzar y cuenta dos veces.' },
      { texto: 'Con grado 5, consigue las cinco raíces reales.',
        logrado: v => v.g === 5 && realesConRepeticion(conD(v.g, v.d)) === 5,
        bien: 'Cinco reales para grado 5: ninguna no real.' },
      { texto: 'Guarda dos casos del mismo grado con distinto número de raíces reales.',
        logrado: (v, guardados) => guardados.some(g => g.g === v.g && realesConRepeticion(conD(g.g, g.d)) !== realesConRepeticion(conD(v.g, v.d)))
          && guardados.some(g => g.g === v.g && g.d === v.d),
        bien: 'El total sigue siendo el grado: las que faltan no son reales.' },
    ],
  };

  // ---------- Unidad ----------
  const LETRAS = {
    x: 'la incógnita; en Lee de las ideas 1 y 3, una medida en dm (x₁, x₂, x₃ y x₄ son las raíces)',
    a: 'el coeficiente principal de ax³ + bx² + cx + d (o de ax² + bx + c, o de ax⁴ + bx² + c)',
    b: 'el coeficiente de x² en ax³ + bx² + cx + d (el de x en ax² + bx + c)',
    c: 'el coeficiente de x en ax³ + bx² + cx + d (el término independiente en ax² + bx + c)',
    d: 'el término independiente de ax³ + bx² + cx + d',
    n: 'el grado de un polinomio (en xⁿ, el exponente)', m: 'el exponente de un factor repetido',
    p: 'el numerador de un candidato p/q', q: 'el denominador de un candidato p/q',
    k: 'un número por hallar en un enunciado', u: 'la variable auxiliar u = x²', t: 'la variable auxiliar t = x + 1/x',
    i: 'el número con i² = −1', P: 'el nombre de un polinomio en un enunciado',
    A: 'en una identidad, lo que va al cuadrado o al cubo en el primer término', B: 'en una identidad, lo que va al cuadrado o al cubo en el segundo término',
  };
  // Historia: la de la versión anterior (fuente comprobada, MacTutor), sin «números complejos».
  const HISTORIA = {
    texto: 'Durante siglos se buscaron fórmulas para hallar raíces, y se discutió si los números conocidos alcanzaban. Al aceptar números como i, se pudo afirmar que un polinomio de grado n tiene n raíces, contando las repetidas. Ese teorema tuvo propuestas, errores y demostraciones corregidas; no fue el logro de un solo día. Aquí se distingue hallar las raíces de saber cuántas hay.',
    pregunta: '¿Dónde están las raíces que la gráfica no muestra?',
    fuente: { titulo: 'O’Connor y Robertson, The fundamental theorem of algebra — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Fund_theorem_of_algebra/' },
  };
  const GLOSARIO = [
    // Idea 1: teorema fundamental, multiplicidad y raíz no real. Ninguno dice cuántas no reales tiene un polinomio de
    // grado 5 con 3 reales (la predicción) ni qué valor del término independiente hace tocar el eje (la misión).
    { termino: 'teorema fundamental del álgebra', def: 'Un polinomio de grado n ≥ 1 tiene n raíces, si se cuentan las repetidas y las no reales.',
      simple: 'El teorema que dice cuántas raíces tiene un polinomio.', ver: ['multiplicidad', 'raíz no real'],
      ejemplos: ['x³ − x tiene tres raíces: −1, 0 y 1.', '(x − 4)² tiene dos: el 4, contado dos veces.', 'Vale para grado 1 o más.'] },
    { termino: 'multiplicidad', local: true, def: 'Cuántas veces se repite una raíz: el exponente de su factor.',
      simple: 'Cuántas veces está repetida una raíz.',
      ejemplos: ['En (x − 1)²(x + 4), el 1 tiene multiplicidad 2.', 'Una raíz de multiplicidad 1 es simple.', 'En (x + 4)³, el −4 es una raíz triple.'] },
    { termino: 'raíz no real', formas: ['raíz no real', 'raíces no reales', 'no real', 'no reales'], def: 'Raíz de un polinomio que no es un número real; la gráfica no la muestra.',
      simple: 'Una raíz que no está en la recta numérica.', ver: ['raíz'],
      ejemplos: ['x² + 1 = 0 tiene dos: ningún real al cuadrado da −1.', 'Salen de un factor de grado 2 con Δ < 0, como x² + 1.', 'En la gráfica, la curva no corta el eje en ellas.'] },
    // Idea 2: coeficiente principal, suma de productos de a dos y Cardano-Vieta. Ninguno dice el producto de las raíces
    // de 2x³ − 6x² + 4x + 10 (la predicción) ni qué caja da x³ − 9x² + 26x − 24 (la misión).
    { termino: 'coeficiente principal', formas: ['coeficiente principal', 'coeficientes principales'], def: 'El coeficiente de la mayor potencia de x en un polinomio.',
      simple: 'El número que va con la mayor potencia de x.', ver: ['coeficiente'],
      ejemplos: ['En 2x³ − x + 5, es 2.', 'En x⁴ − 1, es 1.', 'En −3x² + x, es −3.'] },
    { termino: 'productos de a dos', formas: ['productos de a dos', 'producto de a dos'], def: 'Con tres raíces, x₁x₂ + x₁x₃ + x₂x₃: los productos de cada pareja, sumados.',
      simple: 'Multiplicar de a dos y sumar lo que sale.', ver: ['Cardano-Vieta'],
      ejemplos: ['Con 1, 2 y 4: 2 + 4 + 8 = 14.', 'Con 1, −1 y 3: −1 + 3 − 3 = −1.', 'En x³ + bx² + cx + d = 0, vale c.'] },
    { termino: 'Cardano-Vieta', formas: ['Cardano-Vieta', 'relaciones de Cardano-Vieta'], def: 'Las igualdades que unen las raíces de un polinomio con sus coeficientes.',
      simple: 'Lo que los coeficientes dicen de las raíces, sin hallarlas.', ver: ['productos de a dos'],
      ejemplos: ['En x² − 5x + 6 = 0, las raíces suman 5.', 'En x³ − 7x + 6 = 0, las raíces suman 0.', 'Valen también con raíces no reales.'] },
    // Idea 3: raíz racional, número racional y fracción reducida. Ninguno dice si 3/2 puede ser raíz de 3x³ + … + 2 (la
    // predicción) ni cuál deja resto 0 en el juego.
    { termino: 'raíz racional', formas: ['raíz racional', 'raíces racionales'], def: 'Raíz de un polinomio que es una fracción de enteros.',
      simple: 'Una raíz que se escribe como fracción.', ver: ['número racional'],
      ejemplos: ['2x − 1 = 0 tiene la raíz racional 1/2.', 'Un entero también: 3 = 3/1.', '√2 no lo es.'] },
    { termino: 'número racional', formas: ['número racional', 'números racionales'], def: 'Número que se escribe como fracción de dos enteros, con denominador distinto de 0.',
      simple: 'Un número que es una fracción de enteros.', ver: ['fracción reducida'],
      ejemplos: ['3/4, −2 y 0,5 lo son.', '0,5 = 1/2.', '√3 no lo es.'] },
    { termino: 'fracción reducida', formas: ['fracción reducida', 'fracciones reducidas'], def: 'Fracción cuyo numerador y denominador no tienen divisores comunes, salvo 1.',
      simple: 'Una fracción que ya no se simplifica.', ver: ['número racional'],
      ejemplos: ['2/3 lo es.', '4/6 no: se reduce a 2/3.', '−5/4 lo es.'] },
    // Idea 4: raíz irracional y paridad de raíces. Ninguno dice cuál es la compañera de 2 + √3 (la misión) ni la de
    // 2 + 3i (la predicción).
    { termino: 'raíz irracional', formas: ['raíz irracional', 'raíces irracionales'], def: 'Raíz que no se escribe como fracción de enteros, como √2.',
      simple: 'Una raíz con una raíz cuadrada que no es exacta.', ver: ['raíz racional'],
      ejemplos: ['x² = 2 tiene las raíces irracionales √2 y −√2.', '1 + √5 lo es.', '√9 no: es 3.'] },
    { termino: 'paridad de raíces', def: 'Con coeficientes enteros, las raíces con √ inexacta y las no reales van de a dos, con su conjugada.',
      simple: 'Algunas raíces siempre llegan en pareja.', ver: ['conjugado'],
      ejemplos: ['Si 1 + √5 es raíz, 1 − √5 también.', 'Si 4i es raíz, −4i también.', 'Por eso las no reales son un número par.'] },
    // «número complejo» se queda aquí (la definía la versión anterior y «Números complejos» manda a verlo): la idea 4 lo
    // nombra al decir dónde se explica la i.
    { termino: 'número complejo', formas: ['número complejo', 'números complejos'], def: 'Número como 3 + 2i, con i² = −1; los reales también lo son: 5 = 5 + 0i.',
      simple: 'Un número que puede tener una parte con i.', ver: ['raíz no real'],
      ejemplos: ['3 + 2i lo es.', '5 también: es 5 + 0i.', 'Las raíces no reales lo son.'] },
    // Idea 5: ecuación bicuadrada, cambio de variable y ecuación recíproca. Ninguno cuenta las raíces reales de
    // x⁴ + 3x² − 4 = 0 (la predicción).
    { termino: 'ecuación bicuadrada', formas: ['ecuación bicuadrada', 'ecuaciones bicuadradas', 'bicuadrada', 'bicuadradas'], def: 'Ecuación de la forma ax⁴ + bx² + c = 0: solo tiene x⁴, x² y un número.',
      simple: 'Una ecuación con x⁴, x² y un número, nada más.', ver: ['cambio de variable'],
      ejemplos: ['x⁴ − 5x² + 4 = 0 lo es.', 'x⁴ + x = 0 no: tiene x.', '2x⁴ − 8 = 0 también: le falta x², y vale.'] },
    { termino: 'cambio de variable', def: 'Llamar con una letra nueva a una expresión que se repite, para tener una ecuación más simple.',
      simple: 'Ponerle otro nombre a algo que se repite.', ver: ['ecuación bicuadrada'],
      ejemplos: ['En x⁴ − 5x² + 4 = 0, u = x² da u² − 5u + 4 = 0.', 'Al final se vuelve a x.', 'En (x + 1)² − 3(x + 1) = 0, sirve u = x + 1.'] },
    { termino: 'ecuación recíproca', formas: ['ecuación recíproca', 'ecuaciones recíprocas'], def: 'Ecuación cuyos coeficientes se leen igual de izquierda a derecha que al revés.',
      simple: 'Sus números se leen igual al derecho y al revés.', ver: ['cambio de variable'],
      ejemplos: ['x⁴ − 5x³ + 8x² − 5x + 1 = 0 lo es.', 'Sus coeficientes son 1, −5, 8, −5 y 1.', 'Si 3 es raíz, 1/3 también.'] },
    // Idea 6: ecuación binómica y raíz cúbica. Ninguno dice cuánto suman las no reales de x³ = 8 (la predicción).
    { termino: 'ecuación binómica', formas: ['ecuación binómica', 'ecuaciones binómicas', 'binómica', 'binómicas'], def: 'Ecuación de dos términos: una potencia de x igualada a un número.',
      simple: 'Una ecuación con solo dos términos.', ver: ['raíz cúbica'],
      ejemplos: ['x⁵ = 32 lo es.', 'x⁴ − 81 = 0 también.', 'x³ + x = 2 no: tiene tres términos.'] },
    { termino: 'raíz cúbica', formas: ['raíz cúbica', 'raíces cúbicas'], def: 'Número que, elevado al cubo, da el número dado.',
      simple: 'El número que, multiplicado tres veces por sí mismo, da otro.', ver: ['ecuación binómica'],
      ejemplos: ['La raíz cúbica de 27 es 3.', 'La de −125 es −5.', 'Es la arista de un cubo con ese volumen.'] },
  ];
  const IDEAS = [grado, viete, racionales, conjugadas, cambio, binomica];
  // «Ahora tú» y «Así se resuelve» no repiten el polinomio de un ejemplo, de la predicción, del juego ni de la misión de
  // su idea (etapa-delegada, reglas 8 y 15): si sale uno de esos, se prueba con otra semilla del mismo tipo
  // (+ 4 · 1999 · k, para que sem % 4 no cambie). La prueba propia lo comprueba en 400 semillas.
  const POLI = /(?:\d*x[⁰¹²³⁴⁵⁶⁷⁸⁹]*|\d+)(?: [+−] (?:\d*x[⁰¹²³⁴⁵⁶⁷⁸⁹]*|\d+))+/g;
  const polis = t => (Kit.plano(t).match(POLI) || []).filter(p => /x/.test(p) && (p.split(/ [+−] /).length >= 3 || /x[²³⁴⁵⁶]/.test(p)));
  for (const idea of IDEAS) {
    const vetados = new Set([...idea.ejemplos.flatMap(e => polis(e.enunciado)), ...polis(idea.predice.pregunta), ...polis(idea.juega.consigna), ...polis(idea.juega.mision.texto)]);
    const repite = c => polis(c.pregunta || c.enunciado).some(p => vetados.has(p));
    for (const m of [idea.ahoraTu, idea.resuelve]) {
      const base = m.generar.bind(m);
      m.generar = s => { for (let k = 0; k < 60; k++) { const c = base(s + 7996 * k); if (!repite(c)) return c; } throw new Error(`${idea.id}: sin caso nuevo`); };
    }
  }
  const LAB = [mesaCubica, mesaSubeBaja];
  // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea).
  const LAB_IDEAS = { 'cubica-libre': ['viete'], 'sube-baja': ['grado-raices'] };

  return {
    unidad: 'algebra.ecuaciones-polinomiales',
    version: '0.3.1',
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/alg-caja.js', '/nucleo/kit/piezas/alg-reparto.js', '/nucleo/kit/piezas/alg-objeto.js', '/nucleo/kit/piezas/recta.js'],
    colores: COLORES,
    // «recíproca» suelta es aquí una ecuación recíproca, no la recíproca de un condicional (Lógica y conjuntos).
    glosarioSin: ['recíproca'],
    letras: LETRAS,
    laboratorio: LAB,
    glosario: GLOSARIO,
    historia: HISTORIA,
    laboratorioIdeas: LAB_IDEAS,
    ideas: IDEAS,
  };
});
