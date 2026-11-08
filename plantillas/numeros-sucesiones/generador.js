/*
 * Generador: sucesiones, divisibilidad, primos, numeración y potencias (aritmética).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['numeros-sucesiones']) y en Node (require). No usa ningún motor.
 *
 * Tipos (y lo que cubre de las filas del grupo, por su campo «falta»):
 *   intercalada  (sub pa-pa, pa-pg) una sucesión con una ley en los lugares impares y otra en los
 *                pares; se pide el término de lugar k. Cubre «separar términos de posiciones pares e
 *                impares de una sucesión intercalada».
 *   pa-pg        tres enteros en progresión aritmética con suma dada; al sumarles tres números quedan
 *                en progresión geométrica; se pide el mayor. Cubre «problemas que enlazan una
 *                progresión aritmética con una geométrica».
 *   fracciones   sucesión de fracciones escritas irreducibles; el numerador y el denominador siguen
 *                cada uno su progresión; se pide el término k. Cubre «sucesiones de fracciones con ley
 *                distinta en numerador y denominador».
 *   comunes      dos progresiones aritméticas finitas; se pide cuántos términos tienen en común.
 *                Cubre «términos comunes entre dos progresiones aritméticas con MCM de razones».
 *   sumatoria    (sub cuadratica, producto, cubos) suma de ak² + bk + c, de k(k + p) o de cubos
 *                desde m hasta n. Cubre «sumatorias con fórmulas de suma de cuadrados».
 *   grupos       varias combis o secciones; de los que llegaron hay p varones por cada q mujeres; se
 *                pide el grupo que faltó. Cubre «elegir qué grupo falta usando que el total es
 *                múltiplo de cinco» (aquí, múltiplo de p + q).
 *   divisores    (sub cuenta, afirmaciones) N = 2ᵃ·3ᵇ·5ᶜ, directo o como producto de potencias
 *                (12³·45², …): cuántos divisores, múltiplos de m, impares, cuadrados perfectos,
 *                propios o compuestos; o cuántas de cuatro afirmaciones son verdaderas. Cubre
 *                «evaluar afirmaciones sobre divisores de expresiones factorizadas».
 *   primos-pa    m primos menores que L en progresión aritmética de razón r; se pide el mayor.
 *                Cubre «buscar primos que formen una progresión aritmética».
 *   cifras       (sub fraccion, suma-invertida) a̅a̅/b̅b̅b̅ = P/Q y el mayor a̅b̅; o cuántos a̅b̅
 *                cumplen a̅b̅ + b̅a̅ = N. Cubre «descomposición polinómica de numerales con cifras
 *                repetidas y relación entre ellos».
 *   grifos       tres tiempos (dos grifos que llenan y un desagüe) escritos en otras bases con
 *                cifras desconocidas que se acotan por la base; se pide el tiempo con los tres.
 *                Cubre «combinar acotación de cifras por base con trabajo conjunto».
 *   cubos        (sub cuenta, suma) cubos perfectos que tienen k cifras en base b: cuántos son o la
 *                suma de sus raíces. Cubre «combinar cubos perfectos con cifras en otra base».
 *
 * Notación: numerales con raya encima (a̅b̅) y base en subíndice entre paréntesis (2̅a̅₍₅₎), como
 * plantillas/numeracion; términos tₖ como plantillas/sucesiones. Respuestas enteras, salvo las
 * fracciones (fracciones y grifos), que van con armarTexto y clave canónica.
 * Errores: AR13 y AR7 del informe docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md
 * (parcial) y las trampas 20 a 25 de docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md
 * (hipótesis, sin datos de postulantes).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'numeros-sucesiones';
  const INF = 'docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md';
  const e = (id, valor, explicacion, respaldo = 'hipotesis', fuente = null) => ({ id, valor, explicacion, respaldo, fuente });
  const et = (id, r, explicacion, respaldo = 'hipotesis', fuente = null) => (r ? { id, clave: r.clave, texto: r.texto, explicacion, respaldo, fuente } : null);
  const v = P.v;
  const f = x => P.formatear(x, 2);
  const SUBD = '₀₁₂₃₄₅₆₇₈₉', SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const SUBL = { a: 'ₐ', n: 'ₙ', m: 'ₘ', k: 'ₖ' };
  const sub = x => [...String(x)].map(c => (c >= '0' && c <= '9' ? SUBD[c] : (SUBL[c] || c))).join('');
  const sup = x => [...String(x)].map(c => (c >= '0' && c <= '9' ? SUPD[c] : c)).join('');
  const raya = s => [...String(s)].map(c => c + '̅').join('');
  const enBase = (s, b) => `${raya(s)}₍${sub(b)}₎`;
  const t = k => 't' + sub(k);
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
  const mcm = (a, b) => a / mcd(a, b) * b;
  const signo = (c, primero) => (primero ? (c < 0 ? '−' : '') : (c < 0 ? ' − ' : ' + '));
  // «3k² − 2k + 5»: coeficientes con sus variables, sin términos nulos ni coeficientes 1.
  function poli(coefs, vars) {
    let s = '';
    coefs.forEach((c, i) => {
      if (!c) return;
      const abs = Math.abs(c), cuerpo = vars[i] ? (abs === 1 ? '' : abs) + vars[i] : String(abs);
      s += signo(c, s === '') + cuerpo;
    });
    return s || '0';
  }
  const fr = (n, d) => { const q = P.frac(n, d); return { clave: `frac:${q.n}/${q.d}`, texto: P.textoFraccion(q), n: q.n, d: q.d }; };
  const hrs = (n, d) => { const q = P.frac(n, d); return { clave: `h:${q.n}/${q.d}`, texto: P.textoFraccion(q) + ' h', n: q.n, d: q.d }; };
  const TIPOS = ['intercalada', 'pa-pg', 'fracciones', 'comunes', 'sumatoria', 'grupos', 'divisores', 'primos-pa', 'cifras', 'grifos', 'cubos'];
  const PESOS = ['intercalada', 'intercalada', 'pa-pg', 'fracciones', 'fracciones', 'comunes', 'comunes', 'sumatoria', 'sumatoria',
    'grupos', 'divisores', 'divisores', 'primos-pa', 'cifras', 'cifras', 'grifos', 'cubos'];

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(PESOS);
    for (let intento = 0; intento < 5000; intento++) {
      const pr = construir(rng, semilla, tipo);
      if (pr && pr.alternativas.length >= 4) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  function construir(rng, semilla, tipo) {
    if (tipo === 'intercalada') return intercalada(rng, semilla);
    if (tipo === 'pa-pg') return paPg(rng, semilla);
    if (tipo === 'fracciones') return fracciones(rng, semilla);
    if (tipo === 'comunes') return comunes(rng, semilla);
    if (tipo === 'sumatoria') return sumatoria(rng, semilla);
    if (tipo === 'grupos') return grupos(rng, semilla);
    if (tipo === 'divisores') return divisores(rng, semilla);
    if (tipo === 'primos-pa') return primosPa(rng, semilla);
    if (tipo === 'cifras') return cifras(rng, semilla);
    if (tipo === 'grifos') return grifos(rng, semilla);
    return cubos(rng, semilla);
  }

  function cerrar(rng, semilla, o) {
    let alternativas, respuesta;
    if (o.claves) {
      alternativas = P.armarTexto({ correcta: o.correcta, errores: o.errores.filter(Boolean), rng });
      respuesta = { valor: o.correcta.clave, texto: o.correcta.texto, unidad: o.unidad || '' };
    } else {
      const errores = o.errores.filter(x => x && Number.isInteger(x.valor) && x.valor <= 1e7);
      const texto = o.texto || (x => f(x) + (o.unidad ? ' ' + o.unidad : ''));
      alternativas = P.armar({ correcta: o.correcta, errores, rng, texto, negativos: !!o.negativos });
      respuesta = { valor: o.correcta, unidad: o.unidad || '' };
    }
    return { id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta, _datos: o.datos };
  }

  // ---------------- intercalada ----------------
  function intercalada(rng, semilla) {
    const sb = rng.elegir(['pa-pa', 'pa-pa', 'pa-pg']);
    const a1 = rng.entero(1, 15), r1 = rng.entero(2, 9);
    let b1, r2 = null, q = null;
    if (sb === 'pa-pa') { b1 = rng.entero(1, 30); r2 = rng.entero(2, 12); if (r2 === r1) return null; }
    else { b1 = rng.entero(1, 5); q = rng.elegir([2, 3]); }
    const par = rng.moneda();
    let k;
    if (sb === 'pa-pg' && par) k = 2 * rng.entero(5, q === 2 ? 9 : 7);
    else k = par ? 2 * rng.entero(12, 30) : 2 * rng.entero(12, 30) - 1;
    const impar = j => a1 + (j - 1) * r1;
    const parL = j => (sb === 'pa-pa' ? b1 + (j - 1) * r2 : b1 * q ** (j - 1));
    const term = i => (i % 2 ? impar((i + 1) / 2) : parL(i / 2));
    const vistos = [1, 2, 3, 4, 5, 6, 7, 8].map(term);
    const j = par ? k / 2 : (k + 1) / 2;
    const propia = par ? parL : impar, otra = par ? impar : parL;
    const correcta = propia(j);
    const lugares = par ? 'pares' : 'impares', otros = par ? 'impares' : 'pares';
    const [t1, t2, t3] = vistos;
    const variables = { imp: { nombre: 'términos de lugar impar', color: 'o' }, par: { nombre: 'términos de lugar par', color: 'i' },
      k: { nombre: 'lugar pedido', color: 'h' }, res: { nombre: 'término pedido', color: 'd' } };
    const enunciado = ['Observa la sucesión ', vistos.join(', ') + ', …'];
    const pregunta = ['¿Cuál es el término de lugar ', v('k', String(k)), '?'];
    const errores = [
      e('intercalada-una-sola-ley', t1 + (k - 1) * (t2 - t1), `Tomaste ${t2} − ${t1} = ${f(t2 - t1)} como la razón de toda la sucesión. Pero ${t3} − ${t2} = ${f(t3 - t2)}: no hay una sola progresión. Los términos de lugar impar siguen una ley y los de lugar par, otra.`),
      e('intercalada-lugar-sin-convertir', propia(k), `Usaste la ley de los lugares ${lugares} con ${k} como si fuera el lugar dentro de esa subsucesión. El término ${k} de la sucesión completa es el ${j}.º de los ${lugares}.`),
      e('intercalada-ley-cambiada', otra(j), `Usaste la ley de los lugares ${otros}. El lugar ${k} es ${par ? 'par' : 'impar'}: su término sale de la ley de los ${lugares}.`),
      e('saltos-n-en-vez-de-n-menos-1', propia(j + 1), `Ese es el término siguiente de la subsucesión: del 1.º al ${j}.º término hay ${j - 1} saltos, no ${j}.`, 'hipotesis', INF),
    ];
    if (!par) errores.push(e('lugar-mal-contado', impar(j - 1), `Contaste el lugar dentro de los impares como ${k} ÷ 2 redondeado hacia abajo (${j - 1}). Los lugares 1, 3, 5, … son el 1.º, 2.º, 3.º, …: el lugar ${k} es el (${k} + 1)/2 = ${j}.º.`));
    const leyPar = sb === 'pa-pa' ? `progresión aritmética de razón ${r2}` : `progresión geométrica de razón ${q}`;
    const solucion = [
      ['Lugares impares: ', v('imp', [1, 3, 5, 7].map(i => term(i)).join(', ')), `: progresión aritmética de razón ${r1}.`],
      ['Lugares pares: ', v('par', [2, 4, 6, 8].map(i => term(i)).join(', ')), `: ${leyPar}.`],
      ['El lugar ', v('k', String(k)), ` es ${par ? 'par' : 'impar'}: es el ${j}.º término de los ${lugares} (${par ? `${k}/2` : `(${k} + 1)/2`} = ${j}).`],
      par
        ? (sb === 'pa-pa'
          ? [v('par', `${t(k)} = ${b1} + (${j} − 1)·${r2}`), ' = ', v('res', f(correcta)), '.']
          : [v('par', `${t(k)} = ${b1}·${q}${sup(j - 1)}`), ' = ', v('res', f(correcta)), '.'])
        : [v('imp', `${t(k)} = ${a1} + (${j} − 1)·${r1}`), ' = ', v('res', f(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'intercalada', sub: sb, a1, r1, b1, r2, q, k } });
  }

  // ---------------- pa-pg ----------------
  function paPg(rng, semilla) {
    const a = rng.entero(2, 20), d = rng.entero(2, 12), g = rng.entero(2, 12), q = rng.elegir([2, 3]);
    const m = a + d;
    const al = g - a, be = g * q - m, ga = g * q * q - (m + d);
    if ([al, be, ga].some(x => x < 1 || x > 40)) return null;
    const sols = [];
    for (let D = 1; D < m; D++) if ((m + be) ** 2 === (m - D + al) * (m + D + ga)) sols.push(D);
    if (sols.length !== 1) return null;
    const S = 3 * m, correcta = m + d;
    const X = m + al, Y = m + be, Z = m + ga;
    const d2 = -(Z - X) - d;              // la otra raíz de d² + (Z − X)d − (XZ − Y²) = 0
    const variables = { S: { nombre: 'suma de los tres números', color: 'o' }, add: { nombre: 'lo que se suma a cada uno', color: 'i' },
      r: { nombre: 'razón de la progresión aritmética', color: 'h' }, res: { nombre: 'mayor de los tres números', color: 'd' } };
    const enunciado = ['Tres números enteros positivos están en progresión aritmética creciente y suman ', v('S', String(S)),
      '. Si al primero se le suma ', v('add', String(al)), ', al segundo ', v('add', String(be)), ' y al tercero ', v('add', String(ga)),
      ', los tres resultados, en ese orden, forman una progresión geométrica.'];
    const pregunta = ['¿Cuál es el ', v('res', 'mayor'), ' de los tres números?'];
    const errores = [
      e('responde-termino-de-la-pg', Z + d, `${Z + d} es el mayor término de la progresión geométrica (ya con ${ga} sumado). Se pide el mayor de los tres números de la progresión aritmética, antes de sumarles nada.`),
      e('suma-tercio-como-primero', m + 2 * d, `Tomaste ${S}/3 = ${m} como el primer número. ${S}/3 es el término central: los números son ${m} − d, ${m} y ${m} + d.`),
      e('responde-el-menor', m - d, `${m - d} es el menor de los tres números; se pide el mayor.`),
    ];
    if (d2 > 0 && d2 !== d) errores.push(e('raiz-sin-comprobar', m + d2, `Tomaste la otra raíz, d = ${d2}. Con ella el primer número sería ${m} − ${d2} = ${m - d2}, que no es positivo.`));
    if (d2 < 0 && m + d2 >= 1) errores.push(e('ignora-creciente', m - d2, `Tomaste la raíz d = −${-d2}: da la progresión ${m - d2}, ${m}, ${m + d2}, que es decreciente. El enunciado pide una progresión creciente.`));
    errores.push(e('responde-la-razon', d, `${d} es la razón de la progresión aritmética, no el mayor de los números.`));
    const C = X * Z - Y * Y, B = Z - X;
    if (C === 0) return null;
    const ecuacion = 'd²' + (B ? signo(B, false) + (Math.abs(B) === 1 ? '' : Math.abs(B)) + 'd' : '') + signo(-C, false) + Math.abs(C) + ' = 0';
    const solucion = [
      ['Los números son ', v('r', `${m} − d, ${m} y ${m} + d`), ', porque el central es la suma entre 3: ', v('S', String(S)), ` ÷ 3 = ${m}.`],
      ['Al sumar: ', `${m} − d + `, v('add', String(al)), ` = ${X} − d; ${m} + `, v('add', String(be)), ` = ${Y}; ${m} + d + `, v('add', String(ga)), ` = ${Z} + d.`],
      [`En una progresión geométrica, el central al cuadrado es el producto de los extremos: ${Y}² = (${X} − d)(${Z} + d).`],
      [`${Y * Y} = ${X * Z}${B ? signo(-B, false) + (Math.abs(B) === 1 ? '' : Math.abs(B)) + 'd' : ''} − d², es decir, ${ecuacion}. Sus raíces son d = ${d} y d = ${d2 < 0 ? '−' + -d2 : d2}${d2 === d ? '' : `; solo d = ${d} da una progresión creciente de enteros positivos`}.`],
      ['Los números son ', v('r', `${m - d}, ${m} y ${m + d}`), ` (y ${g}, ${g * q}, ${g * q * q} es geométrica de razón ${q}). El mayor es `, v('res', String(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'pa-pg', S, sumandos: [al, be, ga] } });
  }

  // ---------------- fracciones ----------------
  function fracciones(rng, semilla) {
    const a = rng.entero(1, 9), r = rng.entero(1, 6), b = rng.entero(a + 1, a + 12), s = rng.entero(1, 9);
    const num = i => a + (i - 1) * r, den = i => b + (i - 1) * s;
    const red = i => fr(num(i), den(i));
    const vistos = [1, 2, 3, 4, 5].map(red);
    if (vistos[0].n !== a) return null;                 // el primero ya es irreducible
    if (vistos[1].n === num(2)) return null;            // el segundo viene simplificado
    if (new Set(vistos.map(x => x.clave)).size < 5) return null;
    const esPA = l => l.every((x, i) => i < 2 || x - l[i - 1] === l[1] - l[0]);
    if (esPA(vistos.map(x => x.n)) || esPA(vistos.map(x => x.d))) return null;
    const k = rng.entero(15, 40);
    const correcta = red(k);
    const [u1, u2] = vistos;
    const N1 = u1.n + (k - 1) * (u2.n - u1.n), D1 = u1.d + (k - 1) * (u2.d - u1.d);
    // Se prefieren las sucesiones donde leer las fracciones simplificadas da una ley posible (la trampa se nota).
    if ((N1 <= 0 || D1 <= 0) && rng.sig() < 0.95) return null;
    // la sucesión de valores tomada como progresión: t₁ + (k − 1)(t₂ − t₁)
    const pn = u1.n * u2.d + (k - 1) * (u2.n * u1.d - u1.n * u2.d), pd = u1.d * u2.d;
    const variables = { num: { nombre: 'numeradores', color: 'o' }, den: { nombre: 'denominadores', color: 'i' },
      k: { nombre: 'lugar pedido', color: 'h' }, res: { nombre: 'término pedido', color: 'd' } };
    const enunciado = ['Los términos de la sucesión ', vistos.map(x => x.texto).join('; ') + '; …', ' están escritos como fracciones irreducibles.'];
    const pregunta = ['¿Cuál es el término de lugar ', v('k', String(k)), '?'];
    const errores = [
      et('sin-restituir-simplificadas', N1 > 0 && D1 > 0 ? fr(N1, D1) : null, `Armaste las leyes con ${u1.texto} y ${u2.texto} tal como están escritas. Pero ${u2.texto} viene simplificada: es ${num(2)}/${den(2)}. Con las fracciones sin simplificar, los numeradores y los denominadores sí avanzan con razón constante.`),
      et('saltos-n-en-vez-de-n-menos-1', red(k + 1), `Ese es el término ${k + 1}: del 1.º al ${k}.º término hay ${k - 1} saltos, no ${k}.`, 'hipotesis', INF),
      et('fracciones-en-progresion', pn > 0 ? fr(pn, pd) : null, 'Tomaste las fracciones mismas como una progresión aritmética (sumando siempre t₂ − t₁). La ley está en el numerador y en el denominador por separado, no en el valor de la fracción.'),
      et('leyes-cruzadas', r !== s ? fr(a + (k - 1) * s, b + (k - 1) * r) : null, `Cruzaste las razones: los numeradores avanzan de ${r} en ${r} y los denominadores de ${s} en ${s}.`),
      et('termino-anterior', red(k - 1), `Ese es el término ${k - 1}: con ${k - 2} saltos te quedaste un término antes.`),
    ];
    const restituidas = [2, 3, 4, 5].filter(i => vistos[i - 1].n !== num(i)).map(i => `${vistos[i - 1].texto} = ${num(i)}/${den(i)}`);
    const solucion = [
      [`Las fracciones simplificadas se devuelven a su forma: ${restituidas.join('; ')}.`],
      ['Numeradores: ', v('num', [1, 2, 3, 4, 5].map(num).join(', ')), ` (razón ${r}). Denominadores: `, v('den', [1, 2, 3, 4, 5].map(den).join(', ')), ` (razón ${s}).`],
      [`${t(k)} = [`, v('num', `${a} + (${k} − 1)·${r}`), ']/[', v('den', `${b} + (${k} − 1)·${s}`), `] = ${correcta.n === num(k) ? '' : `${num(k)}/${den(k)} = `}`, v('res', correcta.texto), '.'],
    ];
    return cerrar(rng, semilla, { claves: true, correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'fracciones', a, r, b, s, k } });
  }

  // ---------------- comunes ----------------
  function comunes(rng, semilla) {
    const r1 = rng.entero(4, 15), r2 = rng.entero(4, 15);
    const G = mcd(r1, r2), L = mcm(r1, r2);
    if (G === 1 || r1 === r2 || r1 % r2 === 0 || r2 % r1 === 0) return null;
    const a1 = rng.entero(1, 20), b1 = rng.entero(1, 20);
    if ((a1 - b1) % G !== 0) return null;
    const nA = rng.entero(30, 100), nB = rng.entero(30, 100);
    const LA = a1 + (nA - 1) * r1, LB = b1 + (nB - 1) * r2;
    let c0 = Math.max(a1, b1);
    while ((c0 - a1) % r1 !== 0 || (c0 - b1) % r2 !== 0) c0++;
    const lim = Math.min(LA, LB), tope = Math.max(LA, LB);
    if (c0 > lim) return null;
    const correcta = Math.floor((lim - c0) / L) + 1;
    if (correcta < 4 || correcta > 40) return null;
    const ultimo = c0 + (correcta - 1) * L;
    const variables = { A: { nombre: 'progresión A', color: 'o' }, B: { nombre: 'progresión B', color: 'i' },
      L: { nombre: 'razón de los términos comunes', color: 'h' }, res: { nombre: 'cantidad de términos comunes', color: 'd' } };
    const serie = (x, r, u) => `${x}, ${x + r}, ${x + 2 * r}, …, ${u}`;
    const enunciado = ['Se tienen dos progresiones aritméticas: ', v('A', `A: ${serie(a1, r1, LA)}`), ' y ', v('B', `B: ${serie(b1, r2, LB)}`), '.'];
    const pregunta = ['¿Cuántos ', v('res', 'términos comunes'), ' tienen?'];
    const errores = [
      e('poste-valla-sin-sumar-uno', correcta - 1, `Hiciste (${ultimo} − ${c0}) ÷ ${L} = ${correcta - 1}: eso cuenta los saltos entre términos comunes. Hay un término más que saltos: el primero, ${c0}.`, 'hipotesis', INF),
      e('AR13-producto-en-vez-de-mcm', Math.floor((lim - c0) / (r1 * r2)) + 1, `Tomaste ${r1}·${r2} = ${r1 * r2} como la razón de los comunes. Los comunes se repiten cada MCM(${r1}, ${r2}) = ${L}, que es menor que el producto porque ${r1} y ${r2} tienen el factor común ${G}.`, 'parcial', INF),
      e('AR13-mcd-en-vez-de-mcm', Math.floor((lim - c0) / G) + 1, `Usaste MCD(${r1}, ${r2}) = ${G} como razón de los comunes. Un término común tiene que avanzar a la vez un múltiplo de ${r1} y de ${r2}: el salto es el MCM, ${L}.`, 'parcial', INF),
      e('tope-de-la-mas-larga', Math.floor((tope - c0) / L) + 1, `Contaste hasta ${tope}, el final de la progresión más larga. Un término común debe estar en las dos: no puede pasar de ${lim}.`),
      e('sin-primer-comun', Math.floor(lim / L), `Dividiste ${lim} entre ${L}, como si los comunes empezaran en ${L}. Empiezan en ${c0}: hay que contar desde ahí.`),
    ];
    const solucion = [
      ['El primer término que está en ', v('A', 'A'), ' y en ', v('B', 'B'), ` es ${c0}.`],
      ['Desde ahí, los comunes se repiten cada ', v('L', `MCM(${r1}, ${r2}) = ${L}`), '.'],
      [`No pueden pasar de ${lim}, que es donde termina la más corta: el último común es ${ultimo}.`],
      [`Comunes: ${c0}, ${c0 + L}, …, ${ultimo}. Son (${ultimo} − ${c0})/`, v('L', String(L)), ' + 1 = ', v('res', String(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'comunes', a1, r1, LA, b1, r2, LB } });
  }

  // ---------------- sumatoria ----------------
  const T1 = n => n * (n + 1) / 2, T2 = n => n * (n + 1) * (2 * n + 1) / 6;
  function sumatoria(rng, semilla) {
    const sb = rng.elegir(['cuadratica', 'cuadratica', 'producto', 'cubos']);
    const variables = { cu: { nombre: 'suma de cuadrados (o de cubos)', color: 'o' }, li: { nombre: 'suma de los naturales', color: 'i' },
      n: { nombre: 'último valor de k', color: 'h' }, res: { nombre: 'valor de la suma', color: 'd' } };
    const pregunta = ['¿Cuánto vale ', v('res', 'S'), '?'];
    if (sb === 'cuadratica') {
      const p = rng.entero(1, 3), q = rng.entero(-4, 6), c = rng.entero(0, 9), n = rng.entero(10, 30);
      const correcta = p * T2(n) + q * T1(n) + c * n;
      if (correcta <= 0) return null;
      const enunciado = ['Sea S = ∑ (', poli([p, q, c], ['k²', 'k', '']), '), donde k toma los valores 1, 2, 3, …, ', v('n', String(n)), '.'];
      const errores = [
        e('suma-cuadrados-con-formula-de-naturales', p * T1(n) + q * T1(n) + c * n, `Para ∑k² usaste n(n + 1)/2 = ${f(T1(n))}, que es la suma de 1 + 2 + … + ${n}. La suma de los cuadrados es n(n + 1)(2n + 1)/6 = ${f(T2(n))}.`),
        c ? e('constante-una-sola-vez', p * T2(n) + q * T1(n) + c, `Sumaste el ${c} una sola vez. Aparece en cada uno de los ${n} términos: aporta ${c}·${n} = ${f(c * n)}.`) : null,
        e('cuadrados-como-cuadrado-de-la-suma', p * T1(n) ** 2 + q * T1(n) + c * n, `Tomaste ∑k² como (1 + 2 + … + ${n})² = ${f(T1(n) ** 2)}. El cuadrado de la suma no es la suma de los cuadrados: 1² + 2² = 5, pero (1 + 2)² = 9.`),
        e('formulas-con-n-menos-1', p * T2(n - 1) + q * T1(n - 1) + c * (n - 1), `Pusiste ${n - 1} en las fórmulas: así sumas de k = 1 a k = ${n - 1} y dejas fuera el último término. Hay ${n} términos.`),
      ];
      const solucion = [
        ['Se separa: S = ', p === 1 ? '' : `${p}·`, v('cu', '∑k²'), ...(q ? [signo(q, false) + (Math.abs(q) === 1 ? '' : `${Math.abs(q)}·`), v('li', '∑k')] : []), c ? ` + ${c}·${n}` : '', '.'],
        [v('cu', `∑k² = ${n}·${n + 1}·${2 * n + 1}/6 = ${f(T2(n))}`), '; ', v('li', `∑k = ${n}·${n + 1}/2 = ${f(T1(n))}`), '.'],
        ['S = ', `${p === 1 ? '' : p + '·'}${f(T2(n))}${q ? signo(q, false) + (Math.abs(q) === 1 ? '' : Math.abs(q) + '·') + f(T1(n)) : ''}${c ? ` + ${c * n}` : ''}`, ' = ', v('res', f(correcta)), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'sumatoria', sub: sb, p, q, c, n } });
    }
    if (sb === 'producto') {
      const p = rng.entero(1, 4), n = rng.entero(10, 25);
      const correcta = T2(n) + p * T1(n);
      const enunciado = ['Sea S = ', `1·${1 + p} + 2·${2 + p} + 3·${3 + p} + … + `, v('n', `${n}·${n + p}`), '.'];
      const N = n + p;
      const errores = [
        e('suma-cuadrados-con-formula-de-naturales', T1(n) + p * T1(n), `Para ∑k² usaste n(n + 1)/2 = ${f(T1(n))}. La suma de los cuadrados es n(n + 1)(2n + 1)/6 = ${f(T2(n))}.`),
        e('producto-de-sumas', T1(n) * (T1(n) + p * n), `Multiplicaste la suma de los primeros factores por la suma de los segundos. Una suma de productos no es el producto de las sumas: 1·2 + 2·3 = 8, pero (1 + 2)(2 + 3) = 15.`),
        e('olvida-el-termino-lineal', T2(n), `Cada término es k(k + ${p}) = k² + ${p}k: sumaste solo los k² y te faltó ${p}·∑k = ${f(p * T1(n))}.`),
        e('cuenta-mal-los-terminos', T2(N) + p * T1(N), `Tomaste ${N} (el último segundo factor) como número de términos. Los términos van de k = 1 a k = ${n}: son ${n}.`),
      ];
      const solucion = [
        [`Cada término es k(k + ${p}) = k² + ${p}k, con k = 1, 2, …, `, v('n', String(n)), ': S = ', v('cu', '∑k²'), ` + ${p}·`, v('li', '∑k'), '.'],
        [v('cu', `∑k² = ${n}·${n + 1}·${2 * n + 1}/6 = ${f(T2(n))}`), '; ', v('li', `∑k = ${n}·${n + 1}/2 = ${f(T1(n))}`), '.'],
        [`S = ${f(T2(n))} + ${p}·${f(T1(n))} = `, v('res', f(correcta)), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'sumatoria', sub: sb, p, n } });
    }
    const m = rng.entero(4, 12), n = rng.entero(m + 8, 25);
    const correcta = T1(n) ** 2 - T1(m - 1) ** 2;
    const enunciado = ['Sea S = ', `${m}³ + ${m + 1}³ + ${m + 2}³ + … + `, v('n', `${n}³`), '.'];
    const errores = [
      e('resta-hasta-m', T1(n) ** 2 - T1(m) ** 2, `Restaste la suma de 1³ a ${m}³, y así quitaste también ${m}³, que sí está en S. Hay que restar de 1³ a ${m - 1}³.`, 'hipotesis', INF),
      e('sin-restar-los-primeros', T1(n) ** 2, `Esa es la suma desde 1³. S empieza en ${m}³: falta restar 1³ + … + ${m - 1}³.`),
      e('reindexa-sin-trasladar', T1(n - m + 1) ** 2, `Contaste bien que hay ${n - m + 1} términos, pero sumaste 1³ + … + ${n - m + 1}³. Los términos son ${m}³, ${m + 1}³, …: no empiezan en 1³.`),
      e('cubos-con-formula-de-naturales', T1(n) - T1(m - 1), 'Usaste la suma de los naturales, n(n + 1)/2. La suma de los cubos es su cuadrado: [n(n + 1)/2]².'),
    ];
    const solucion = [
      ['S es la suma de 1³ a ', v('n', `${n}³`), ` menos la suma de 1³ a ${m - 1}³.`],
      [v('cu', `1³ + … + ${n}³ = (${n}·${n + 1}/2)² = ${T1(n)}² = ${f(T1(n) ** 2)}`), '; ', v('cu', `1³ + … + ${m - 1}³ = ${T1(m - 1)}² = ${f(T1(m - 1) ** 2)}`), '.'],
      [`S = ${f(T1(n) ** 2)} − ${f(T1(m - 1) ** 2)} = `, v('res', f(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'sumatoria', sub: sb, m, n } });
  }

  // ---------------- grupos ----------------
  const RAZONES = [[2, 3], [3, 4], [3, 5], [4, 5], [2, 5], [3, 2], [4, 3]];
  function grupos(rng, semilla) {
    const [pv, pm] = rng.elegir(RAZONES), s = pv + pm;
    const G = rng.elegir([5, 6]);
    const gs = [];
    while (gs.length < G) { const x = rng.entero(12, 45); if (!gs.includes(x)) gs.push(x); }
    const T = gs.reduce((a, b) => a + b, 0);
    const buenos = gs.filter(g => (T - g) % s === 0);
    if (buenos.length !== 1) return null;
    const correcta = buenos[0];
    const ctx = rng.elegir(['combis', 'secciones']);
    const nom = ['', 'Una', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis'];
    const lista = gs.slice(0, -1).join(', ') + ' y ' + gs[G - 1];
    const variables = { g: { nombre: ctx === 'combis' ? 'escolares en cada combi' : 'alumnos de cada sección', color: 'o' },
      raz: { nombre: 'razón entre varones y mujeres', color: 'i' }, T: { nombre: 'total de los grupos', color: 'h' },
      res: { nombre: ctx === 'combis' ? 'escolares de la combi que no llegó' : 'alumnos de la sección que no fue', color: 'd' } };
    const razTxt = `${pv} varones por cada ${pm} mujeres`;
    const enunciado = ctx === 'combis'
      ? [`${nom[G]} combis salieron de Juliaca hacia un desfile escolar con `, v('g', lista), ' escolares, respectivamente. Una de ellas se malogró en el camino y no llegó. Entre los escolares que llegaron hay ', v('raz', razTxt), '.']
      : [`${nom[G]} secciones de un colegio tienen `, v('g', lista), ' alumnos. Todas fueron de paseo, menos una sección completa. Entre los que fueron hay ', v('raz', razTxt), '.'];
    const pregunta = ctx === 'combis' ? ['¿Cuántos escolares iban en la ', v('res', 'combi que no llegó'), '?'] : ['¿Cuántos alumnos tiene la ', v('res', 'sección que no fue'), '?'];
    const usados = new Set([correcta]);
    const elige = cond => { const x = gs.find(g => !usados.has(g) && cond(g)); if (x !== undefined) usados.add(x); return x; };
    const errores = [];
    const x1 = elige(g => g % s === 0);
    if (x1 !== undefined) errores.push(e('grupo-multiplo-de-la-suma', x1, `Buscaste un grupo que sea múltiplo de ${s}. El que debe ser múltiplo de ${s} es el total de los que llegaron: sin ese grupo quedan ${T - x1}, que no se puede repartir en ${pv} varones por cada ${pm} mujeres.`));
    const x2 = elige(g => (T - g) % pm === 0 || (T - g) % pv === 0);
    if (x2 !== undefined) errores.push(e('multiplo-de-un-solo-termino', x2, `Sin ese grupo quedan ${T - x2}, que es múltiplo de ${(T - x2) % pm === 0 ? pm : pv}, pero no de ${s}. Si hay ${pv} varones por cada ${pm} mujeres, los que llegaron forman bloques de ${pv} + ${pm} = ${s}.`));
    const rT = T % s, rAlReves = (s - rT) % s;
    const x3 = elige(g => g % s === rAlReves);
    if (x3 !== undefined) errores.push(e('resto-al-reves', x3, `El total ${T} deja resto ${rT} al dividirlo entre ${s}; el grupo que se quita debe dejar ese mismo resto, no ${rAlReves}. Sin ese grupo quedan ${T - x3}, que no es múltiplo de ${s}.`));
    const x4 = elige(g => g === Math.max(...gs));
    if (x4 !== undefined) errores.push(e('elige-sin-comprobar', x4, `Sin ese grupo quedan ${T - x4}, que no es múltiplo de ${s}: no se puede tener ${pv} varones por cada ${pm} mujeres.`));
    const restos = gs.map(g => `${g} → ${g % s}`).join('; ');
    const solucion = [
      ['Con ', v('raz', razTxt), `, los que llegaron forman bloques de ${pv} + ${pm} = ${s} personas: su total es múltiplo de ${s}.`],
      ['Entre todos los grupos hay ', v('T', `${T}`), ` personas; ${T} = ${s}·${Math.floor(T / s)} + ${rT}.`],
      [`Para que quede un múltiplo de ${s}, el grupo que faltó debe dejar resto ${rT} al dividirlo entre ${s}. Restos: `, v('g', restos), '.'],
      ['Solo ', v('res', String(correcta)), ` deja resto ${rT}: llegaron ${T - correcta} = ${s}·${(T - correcta) / s}, es decir, ${pv * (T - correcta) / s} varones y ${pm * (T - correcta) / s} mujeres.`],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion,
      datos: { tipo: 'grupos', grupos: gs, varones: pv, mujeres: pm } });
  }

  // ---------------- divisores ----------------
  const BASES = { 6: [1, 1, 0], 10: [1, 0, 1], 12: [2, 1, 0], 15: [0, 1, 1], 18: [1, 2, 0], 20: [2, 0, 1], 45: [0, 2, 1], 50: [1, 0, 2], 75: [0, 1, 2] };
  const PRIMOS3 = [2, 3, 5];
  const prod = l => l.reduce((a, b) => a * b, 1);
  const cdDe = ex => prod(ex.map(x => x + 1));
  const CANT = {
    total: ex => cdDe(ex),
    mult: (ex, mm) => cdDe(ex.map((x, i) => x - mm[i])),
    impares: ex => (ex[1] + 1) * (ex[2] + 1),
    cuadrados: ex => prod(ex.map(x => Math.floor(x / 2) + 1)),
    propios: ex => cdDe(ex) - 1,
    compuestos: ex => cdDe(ex) - 4,
  };
  const MULTS = { 6: [1, 1, 0], 10: [1, 0, 1], 15: [0, 1, 1] };
  // Modelos de alumno: cada uno da su valor para una cantidad, o null si en esa cantidad no se equivoca.
  const MODELOS = [
    { id: 'exponentes-sin-sumar-uno', desc: 'Multiplicaste los exponentes sin sumarles 1.',
      val: (q, c) => ({ total: prod(c.ex), mult: prod(c.ex.map((x, i) => x - c.mm[i])), impares: c.ex[1] * c.ex[2], cuadrados: prod(c.ex.map(x => Math.floor(x / 2))), propios: prod(c.ex) - 1, compuestos: prod(c.ex) - 4 })[q],
      porque: 'Cada exponente e da e + 1 elecciones (de 0 a e): la cantidad de divisores es el producto de los (e + 1).' },
    { id: 'potencia-de-potencia-suma', desc: 'Al elevar cada base, sumaste los exponentes en vez de multiplicarlos.', solo: 'potencias',
      val: (q, c) => (c.exSuma ? (q === 'mult' ? CANT.mult(c.exSuma, c.mm) : CANT[q](c.exSuma)) : null),
      porque: 'Una potencia de potencia multiplica los exponentes: (2²)³ = 2⁶, no 2⁵.' },
    { id: 'divisores-propios-como-totales', desc: 'Contaste los divisores propios como si fueran todos.',
      val: (q, c) => (q === 'propios' ? cdDe(c.ex) : null), porque: 'Los propios son todos menos el mismo N: CD − 1.' },
    { id: 'unidad-como-compuesto', desc: 'Contaste el 1 entre los compuestos.',
      val: (q, c) => (q === 'compuestos' ? cdDe(c.ex) - 3 : null), porque: 'El 1 no es primo ni compuesto: compuestos = CD − (primos) − 1.' },
    { id: 'potencias-de-primo-como-primos', desc: 'Quitaste como primos también las potencias de primos (4, 8, 9, 25…).',
      val: (q, c) => (q === 'compuestos' ? cdDe(c.ex) - 1 - c.ex.reduce((a, b) => a + b, 0) : null), porque: 'Solo 2, 3 y 5 son divisores primos; 4, 8, 9 o 25 son compuestos.' },
    { id: 'impares-sin-la-unidad', desc: 'Dejaste fuera el 1 de los impares.',
      val: (q, c) => (q === 'impares' ? (c.ex[1] + 1) * (c.ex[2] + 1) - 1 : null), porque: 'El 1 es un divisor impar: los impares son (b + 1)(c + 1), con el 1 incluido.' },
    { id: 'multiplos-un-solo-primo', desc: 'Para los múltiplos sacaste un solo primo del producto.',
      val: (q, c) => (q === 'mult' ? cdDe(c.ex.map((x, i) => x - (i === c.mm.indexOf(1) ? 1 : 0))) : null), porque: 'Un múltiplo de m tiene que llevar todos los primos de m: se cuentan los divisores de N/m.' },
    { id: 'cuenta-el-complemento', desc: 'Restaste del total y contaste los que no cumplen la condición.',
      val: (q, c) => (q === 'mult' ? cdDe(c.ex) - CANT.mult(c.ex, c.mm) : q === 'impares' ? cdDe(c.ex) - CANT.impares(c.ex) : null), porque: 'Lo que se pide son los divisores que sí la cumplen: los múltiplos son los divisores de N/m, y los impares, los divisores de la parte sin el 2.' },
    { id: 'cuadrados-sin-el-cero', desc: 'Para los cuadrados no contaste el exponente 0.',
      val: (q, c) => (q === 'cuadrados' ? prod(c.ex.map(x => Math.floor(x / 2))) : null), porque: 'Un cuadrado perfecto lleva exponentes pares, y 0 también es par: hay ⌊e/2⌋ + 1 opciones por primo.' },
  ];
  function divisores(rng, semilla) {
    const sb = rng.elegir(['cuenta', 'afirmaciones']);
    const forma = rng.elegir(['directa', 'potencias', 'potencias']);
    let ex, exSuma = null, Ntxt, b1 = null, b2 = null, p = null, q2 = null;
    if (forma === 'directa') {
      ex = [rng.entero(1, 6), rng.entero(1, 5), rng.entero(1, 4)];
      Ntxt = potTxt(ex);
    } else {
      const ks = Object.keys(BASES).map(Number);
      b1 = rng.elegir(ks); b2 = rng.elegir(ks);
      if (b1 >= b2) return null;
      p = rng.entero(2, 4); q2 = rng.entero(2, 4);
      ex = [0, 1, 2].map(i => BASES[b1][i] * p + BASES[b2][i] * q2);
      exSuma = [0, 1, 2].map(i => (BASES[b1][i] ? BASES[b1][i] + p : 0) + (BASES[b2][i] ? BASES[b2][i] + q2 : 0));
      Ntxt = `${b1}${sup(p)}·${b2}${sup(q2)}`;
    }
    if (ex.some(x => x < 1)) return null;
    const CD = cdDe(ex);
    if (CD > 400 || CD < 12) return null;
    const m = rng.elegir([6, 10, 15]), mm = MULTS[m];
    const c = { ex, exSuma, mm };
    const valor = (q, mod) => { const x = mod ? mod.val(q, c) : null; return x === null || x === undefined ? (q === 'mult' ? CANT.mult(ex, mm) : CANT[q](ex)) : x; };
    const modelos = MODELOS.filter(M => !M.solo || M.solo === forma);
    const frase = {
      total: x => `N tiene ${x} divisores.`,
      mult: x => `${x} divisores de N son múltiplos de ${m}.`,
      impares: x => `N tiene ${x} divisores impares.`,
      cuadrados: x => `${x} divisores de N son cuadrados perfectos.`,
      propios: x => `N tiene ${x} divisores propios.`,
      compuestos: x => `N tiene ${x} divisores compuestos.`,
    };
    const nombreQ = { total: 'divisores', mult: `divisores múltiplos de ${m}`, impares: 'divisores impares', cuadrados: 'divisores que son cuadrados perfectos', propios: 'divisores propios', compuestos: 'divisores compuestos' };
    const variables = { N: { nombre: 'número N', color: 'o' }, ex: { nombre: 'exponentes de N', color: 'i' }, m: { nombre: 'condición del divisor', color: 'h' }, res: { nombre: 'lo que se pide', color: 'd' } };
    const desc = potTxt(ex);
    const pasoFactor = forma === 'directa' ? null
      : ['Se descompone cada base: ', `${b1} = ${factTxt(BASES[b1])} y ${b2} = ${factTxt(BASES[b2])}; al elevar se multiplican los exponentes y se juntan las bases iguales: `, v('N', `N = ${desc}`), '.'];
    const pasoQ = q => {
      const x = valor(q, null);
      if (q === 'total') return `CD(N) = ${ex.map(y => `(${y} + 1)`).join('')} = ${x}`;
      if (q === 'mult') { const r = ex.map((y, i) => y - mm[i]); return `múltiplos de ${m} = divisores de N/${m} = 2${sup(r[0])}·3${sup(r[1])}·5${sup(r[2])}: ${r.map(y => `(${y} + 1)`).join('')} = ${x}`; }
      if (q === 'impares') return `impares = divisores de 3${sup(ex[1])}·5${sup(ex[2])}: (${ex[1]} + 1)(${ex[2]} + 1) = ${x}`;
      if (q === 'cuadrados') return `cuadrados = exponentes pares: ${ex.map(y => `(${Math.floor(y / 2)} + 1)`).join('')} = ${x}`;
      if (q === 'propios') return `propios = CD − 1 = ${CD} − 1 = ${x}`;
      return `compuestos = CD − 3 primos − el 1 = ${CD} − 4 = ${x}`;
    };
    const defProp = q => (q === 'propios' ? ' (los divisores propios de N son todos sus divisores, menos el mismo N)' : '');
    if (sb === 'cuenta') {
      const q = rng.elegir(['total', 'mult', 'impares', 'cuadrados', 'propios', 'compuestos']);
      const correcta = valor(q, null);
      const errores = modelos.map(M => { const x = M.val(q, c); return x === null || x === undefined || x === correcta ? null : e(M.id, x, `${M.desc} ${M.porque}`); });
      if (q === 'total' || q === 'propios') {
        const ingenuo = forma === 'potencias' ? cdDe(ex.map((y, i) => (BASES[b1][i] ? BASES[b1][i] * p : 0))) * cdDe(ex.map((y, i) => (BASES[b2][i] ? BASES[b2][i] * q2 : 0))) - (q === 'propios' ? 1 : 0) : null;
        if (ingenuo !== null && ingenuo !== correcta && ex.some((y, i) => BASES[b1][i] && BASES[b2][i]))
          errores.push(e('sin-juntar-bases-iguales', ingenuo, `Contaste los divisores de ${b1}${sup(p)} y de ${b2}${sup(q2)} por separado y los multiplicaste. Las dos bases comparten un primo: hay que juntar sus exponentes antes de contar, porque si no un mismo divisor se cuenta varias veces.`));
        errores.push(e('suma-de-exponentes-mas-uno', ex.reduce((a, b) => a + b, 0) + (q === 'total' ? 1 : 0), 'Sumaste los exponentes. Las elecciones de cada primo se combinan entre sí: se multiplican los (e + 1), no se suman.'));
      }
      const enunciado = ['Sea ', v('N', `N = ${Ntxt}`), '.'];
      const pregunta = ['¿Cuántos ', v('res', nombreQ[q]), ` tiene N?${defProp(q) ? ' Los divisores propios de N son todos sus divisores, menos el mismo N.' : ''}`];
      const solucion = [
        ...(pasoFactor ? [pasoFactor] : [['Ya está descompuesto: ', v('N', `N = ${desc}`), '.']]),
        ...(q === 'propios' || q === 'compuestos' ? [[`CD(N) = ${ex.map(y => `(${y} + 1)`).join('')} = ${CD}.`]] : []),
        ['', v('res', pasoQ(q)), '.'],
      ];
      return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion,
        datos: { tipo: 'divisores', sub: sb, forma, b1, p, b2, q: q2, ex, pide: q, m } });
    }
    // afirmaciones
    const qs = rng.barajar(['total', 'mult', 'impares', 'cuadrados', 'propios', 'compuestos']).slice(0, 4);
    const afs = [];
    for (const q of qs) {
      const correcto = valor(q, null);
      const falsos = modelos.map(M => M.val(q, c)).filter(x => x !== null && x !== undefined && x !== correcto && x > 0);
      const verdad = falsos.length === 0 || rng.moneda();
      afs.push({ q, dice: verdad ? correcto : rng.elegir(falsos) });
    }
    const verdaderas = afs.filter(a => a.dice === valor(a.q, null)).length;
    const ROM = ['I', 'II', 'III', 'IV'];
    const juzga = M => afs.map((a, i) => (a.dice === valor(a.q, M) ? ROM[i] : null)).filter(Boolean);
    const errores = modelos.map(M => {
      const si = juzga(M);
      if (si.length === verdaderas) return null;
      const lista = si.length === 0 ? 'no te parece verdadera ninguna' : si.length === 1 ? `te parece verdadera solo la ${si[0]}` : `te parecen verdaderas la ${si.slice(0, -1).join(', la ')} y la ${si[si.length - 1]}`;
      return e(M.id, si.length, `${M.desc} Con eso ${lista}. ${M.porque}`);
    });
    const correcta = verdaderas;
    const usaProp = qs.includes('propios');
    const enunciado = ['Sea ', v('N', `N = ${Ntxt}`), '. Se afirma:', ...afs.map((a, i) => ` ${ROM[i]}. ${frase[a.q](a.dice)}`),
      usaProp ? ' (Los divisores propios de N son todos sus divisores, menos el mismo N.)' : ''].filter(Boolean);
    const pregunta = ['¿Cuántas de las afirmaciones son ', v('res', 'verdaderas'), '?'];
    const texto = x => String(x);
    const solucion = [
      ...(pasoFactor ? [pasoFactor] : [['Ya está descompuesto: ', v('N', `N = ${desc}`), '.']]),
      ...afs.map((a, i) => [`${ROM[i]}. `, v('m', pasoQ(a.q)), `: dice ${a.dice}, ${a.dice === valor(a.q, null) ? 'verdadera' : 'falsa'}.`]),
      ['Son verdaderas ', v('res', String(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion, texto, negativos: true,
      datos: { tipo: 'divisores', sub: sb, forma, b1, p, b2, q: q2, ex, m, afirmaciones: afs.map(a => [a.q, a.dice]) } });
  }
  function potTxt(e3) { return PRIMOS3.map((pr, i) => pr + (e3[i] > 1 ? sup(e3[i]) : '')).join('·'); }
  function factTxt(e3) { return PRIMOS3.map((pr, i) => (e3[i] ? pr + (e3[i] > 1 ? sup(e3[i]) : '') : null)).filter(Boolean).join('·'); }

  // ---------------- primos-pa ----------------
  const CRIBA = (() => { const N = 400, c = new Array(N + 1).fill(true); c[0] = c[1] = false; for (let i = 2; i * i <= N; i++) if (c[i]) for (let j = i * i; j <= N; j += i) c[j] = false; return c; })();
  const esPrimo = x => x >= 2 && x <= 400 && CRIBA[x];
  const FALSOS = [1, 49, 51, 57, 77, 87, 91, 119, 133, 143, 161, 187];
  const factorTxt = x => { if (x === 1) return 'el 1 no es primo ni compuesto'; for (let d = 2; d * d <= x; d++) if (x % d === 0) return `${x} = ${d}·${x / d}`; return String(x); };
  function primosPa(rng, semilla) {
    const m = rng.elegir([3, 4, 5, 5, 5]);
    const r = m === 5 ? rng.elegir([6, 12, 18, 24, 30, 36, 42]) : rng.elegir([2, 4, 6, 8, 10, 12, 14, 18, 20, 24, 30]);
    const L = rng.entero(15, 180);
    const sec = (x, conF) => { const l = []; for (let i = 0; i < m; i++) l.push(x + i * r); const ok = l.every(y => esPrimo(y) || (conF && FALSOS.includes(y))); return ok ? l : null; };
    const sols = [], libres = [];
    for (let x = 1; x + (m - 1) * r <= 400; x++) {
      const l = sec(x, false);
      if (l) { if (l[m - 1] < L) sols.push(l); else libres.push(l); }
    }
    if (sols.length !== 1) return null;
    const S = sols[0], correcta = S[m - 1], p0 = S[0];
    const variables = { L: { nombre: 'cota', color: 'o' }, r: { nombre: 'razón', color: 'i' }, m: { nombre: 'cantidad de primos', color: 'h' }, res: { nombre: 'mayor primo', color: 'd' } };
    const nom = { 3: 'Tres', 4: 'Cuatro', 5: 'Cinco' };
    const enunciado = [v('m', nom[m]), ' números primos, todos menores que ', v('L', String(L)), ', forman una progresión aritmética de razón ', v('r', String(r)), '.'];
    const pregunta = ['¿Cuál es el ', v('res', 'mayor'), ' de ellos?'];
    const errores = [
      e('saltos-n-en-vez-de-n-menos-1', p0 + m * r, `Sumaste ${m} veces la razón al menor. De ${p0} al último de ${m} términos hay ${m - 1} saltos: ${p0} + ${m - 1}·${r}.`, 'hipotesis', INF),
      e('responde-el-menor', p0, `${p0} es el menor de los primos; se pide el mayor.`),
    ];
    for (let x = 1; x + (m - 1) * r < L; x++) {
      const l = sec(x, true);
      if (!l || l[0] === p0) continue;
      const malos = l.filter(y => !esPrimo(y));
      if (malos.length !== 1) continue;
      errores.push(e(malos[0] === 1 ? 'unidad-como-primo' : 'compuesto-como-primo', l[m - 1], malos[0] === 1 ? `La progresión ${l.join(', ')} empieza en 1, y el 1 no es primo: un primo tiene exactamente dos divisores.` : `La progresión ${l.join(', ')} tiene a ${malos[0]}, que no es primo (${factorTxt(malos[0])}).`));
      break;
    }
    if (libres.length) errores.push(e('ignora-la-cota', libres[0][m - 1], `La progresión ${libres[0].join(', ')} es de primos, pero ${libres[0][m - 1]} no es menor que ${L}.`));
    errores.push(e('responde-la-suma', S.reduce((a, b) => a + b, 0), `${S.reduce((a, b) => a + b, 0)} es la suma de los ${m} primos; se pide el mayor.`));
    // un candidato descartado, para mostrar cómo se prueba
    let descarte = null;
    for (let x = 2; x + (m - 1) * r < L && !descarte; x++) {
      if (!esPrimo(x) || x === p0) continue;
      const malo = [...Array(m).keys()].map(i => x + i * r).find(y => !esPrimo(y));
      descarte = `con ${x}: ${factorTxt(malo)} no es primo`;
    }
    const solucion = [
      ['Si el menor es p, los primos son p, p + ', v('r', String(r)), `, …, p + ${m - 1}·${r}, y el último debe ser menor que `, v('L', String(L)), `: p < ${L - (m - 1) * r}.`],
      [`Se prueban los primos p uno por uno${descarte ? ` (por ejemplo, ${descarte})` : ''}. Solo p = ${p0} da todos primos: ${S.join(', ')}.`],
      ['El mayor es ', `${p0} + ${m - 1}·${r} = `, v('res', String(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'primos-pa', m, r, L } });
  }

  // ---------------- cifras ----------------
  function cifras(rng, semilla) {
    const sb = rng.elegir(['fraccion', 'suma-invertida']);
    if (sb === 'fraccion') {
      const u = rng.entero(1, 9), w = rng.entero(1, 9);
      if (u === w || mcd(u, w) !== 1) return null;
      const K = Math.floor(9 / Math.max(u, w));
      if (K < 2) return null;
      const F = P.frac(11 * u, 111 * w);
      const a = u * K, b = w * K, correcta = 10 * a + b;
      const variables = { aa: { nombre: 'numeral a̅a̅', color: 'o' }, bbb: { nombre: 'numeral b̅b̅b̅', color: 'i' }, ab: { nombre: 'numeral a̅b̅', color: 'd' }, F: { nombre: 'fracción dada', color: 'h' } };
      const enunciado = ['Las cifras a y b cumplen ', v('aa', raya('aa')), ' / ', v('bbb', raya('bbb')), ' = ', v('F', `${F.n}/${F.d}`), '.'];
      const pregunta = ['¿Cuál es el mayor valor que puede tomar el numeral ', v('ab', raya('ab')), '?'];
      const a2 = u * (K + 1), b2 = w * (K + 1);
      const errores = [
        e('solo-la-proporcion-reducida', 10 * u + w, `Tomaste a = ${u} y b = ${w}, la proporción más chica. También sirven sus múltiplos (a = ${u}k, b = ${w}k) mientras las cifras no pasen de 9: el mayor es con k = ${K}.`),
        e('cifras-invertidas', 10 * b + a, `Ese es ${raya('ba')}: pusiste b como cifra de las decenas. En ${raya('ab')} la a va primero.`),
        e('cifra-mayor-que-nueve', Number(`${a2}${b2}`), `Con k = ${K + 1} sale ${[a2 > 9 ? `a = ${a2}` : null, b2 > 9 ? `b = ${b2}` : null].filter(Boolean).join(' y ')}, y eso no es una cifra: en base 10 las cifras van de 0 a 9.`),
      ];
      if (K >= 3) errores.push(e('no-llega-al-mayor-multiplo', 10 * u * (K - 1) + w * (K - 1), `Te quedaste en k = ${K - 1}. Con k = ${K} las cifras (${a} y ${b}) todavía son menores que 10.`));
      const solucion = [
        ['Por descomposición: ', v('aa', `${raya('aa')} = 11a`), ' y ', v('bbb', `${raya('bbb')} = 111b`), '.'],
        [`11a/(111b) = `, v('F', `${F.n}/${F.d}`), ` → a/b = ${F.n}·111/(${F.d}·11) = ${u}/${w}.`],
        [`Entonces a = ${u}k y b = ${w}k; como las cifras no pasan de 9, k llega a lo más a ${K}: a = ${a}, b = ${b}.`],
        ['El mayor ', v('ab', `${raya('ab')} = ${correcta}`), '. Comprobación: ', `${11 * a}/${111 * b} = ${F.n}/${F.d}.`],
      ];
      return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'cifras', sub: sb, F: [F.n, F.d] } });
    }
    const s = rng.entero(4, 17);
    let correcta = 0; for (let a = 1; a <= 9; a++) { const b = s - a; if (b >= 1 && b <= 9) correcta++; }
    const N = 11 * s;
    const variables = { ab: { nombre: 'numeral a̅b̅', color: 'o' }, ba: { nombre: 'numeral b̅a̅', color: 'i' }, s: { nombre: 'suma de las cifras', color: 'h' }, res: { nombre: 'cantidad de numerales', color: 'd' } };
    const enunciado = ['Los numerales de dos cifras ', v('ab', raya('ab')), ' y ', v('ba', raya('ba')), ` suman ${N}.`];
    const pregunta = ['¿Cuántos valores puede tomar ', v('ab', raya('ab')), '?'];
    const amin = Math.max(1, s - 9), amax = Math.min(9, s - 1);
    const errores = [
      e('poste-valla-sin-sumar-uno', correcta - 1, `Hiciste ${amax} − ${amin} = ${correcta - 1}. Del ${amin} al ${amax} hay ${correcta} valores: se cuentan los dos extremos.`, 'hipotesis', INF),
      e('cuenta-sin-orden', Math.ceil(correcta / 2), `Contaste cada pareja de cifras una sola vez. Pero ${raya('ab')} y ${raya('ba')} son numerales distintos: si a ≠ b, cada pareja da dos valores de ${raya('ab')}.`),
    ];
    if (s <= 9) errores.push(e('primera-cifra-cero', correcta + 1, `Contaste b = 0. Entonces ${raya('ba')} empezaría con 0 y no sería un numeral de dos cifras.`));
    if (s > 10) errores.push(e('cifra-mayor-que-nueve', s - 1, `Dejaste que a vaya de 1 a ${s - 1}. Pero a y b son cifras: ninguna pasa de 9, así que a va de ${amin} a ${amax}.`));
    const solucion = [
      ['Por descomposición: ', v('ab', '(10a + b)'), ' + ', v('ba', '(10b + a)'), ` = 11(a + b) = ${N}, así que `, v('s', `a + b = ${s}`), '.'],
      [`a y b son cifras de 1 a 9 (ninguna puede ser 0, porque las dos van adelante en algún numeral): a va de ${amin} a ${amax}.`],
      ['Son ', `${amax} − ${amin} + 1 = `, v('res', String(correcta)), ' valores.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'cifras', sub: sb, N } });
  }

  // ---------------- grifos ----------------
  const LETRAS = ['a', 'n'];
  // Valor de un símbolo: cifra o letra.
  const val = (s, asg) => (typeof s === 'number' ? s : asg[s]);
  function valido(nums, asg, estricto = true) {
    for (const nm of nums) {
      const B = val(nm.base, asg);
      if (B < 2) return false;
      if (val(nm.c[0], asg) === 0) return false;
      for (const s of nm.c) { const x = val(s, asg); if (estricto ? x >= B : x > B) return false; }
    }
    return true;
  }
  function soluciones(nums, estricto = true) {
    const l = [];
    for (let a = 0; a <= 9; a++) for (let n = 0; n <= 9; n++) if (valido(nums, { a, n }, estricto)) l.push({ a, n });
    return l;
  }
  const decimal = (nm, asg) => val(nm.c[0], asg) * val(nm.base, asg) + val(nm.c[1], asg);
  const numTxt = nm => enBase(nm.c.join(''), nm.base);
  // Configuraciones que fuerzan a y n: un numeral en base a con la cifra α − 1 (a ≥ α), uno en base n
  // con la cifra a (n > a) y uno en base α + 2 con la cifra n (n ≤ α + 1). Queda a = α y n = α + 1.
  // Se guardan las que dan un tiempo conjunto entero (dos llenan, uno vacía).
  const CONFIGS = (() => {
    const l = [];
    for (let al = 3; al <= 7; al++) {
      const nu = al + 1, B = al + 2;
      const A = [], N = [], C = [];
      for (let d1 = 1; d1 < al; d1++) for (let d0 = 0; d0 < al; d0++) if (d1 === al - 1 || d0 === al - 1) A.push({ c: [d1, d0], base: 'a', t: d1 * al + d0 });
      for (let d = 0; d < nu; d++) { N.push({ c: ['a', d], base: 'n', t: al * nu + d }); if (d >= 1 && d !== al) N.push({ c: [d, 'a'], base: 'n', t: d * nu + al }); }
      for (let d = 0; d < B; d++) { C.push({ c: ['n', d], base: B, t: nu * B + d }); if (d >= 1 && d !== nu) C.push({ c: [d, 'n'], base: B, t: d * B + nu }); }
      for (const x of A) for (const y of N) for (const z of C) {
        const tr = [x, y, z];
        for (let dr = 0; dr < 3; dr++) {
          const [f1, f2] = tr.filter((_, i) => i !== dr), w = tr[dr];
          const den = f2.t * w.t + f1.t * w.t - f1.t * f2.t;
          if (den <= 0 || new Set(tr.map(q => q.t)).size < 3) continue;
          const num = f1.t * f2.t * w.t;
          if (num % den === 0 && num / den <= 60) l.push({ al, nums: [f1, f2, w], T: num / den });
        }
      }
    }
    return l;
  })();
  function grifos(rng, semilla) {
    const cfg = rng.elegir(CONFIGS);
    const orden = rng.moneda() ? [0, 1] : [1, 0];
    const nums = [cfg.nums[orden[0]], cfg.nums[orden[1]], cfg.nums[2]].map(q => ({ c: q.c, base: q.base }));
    const asg = { a: cfg.al, n: cfg.al + 1 };
    const [x, y, z] = nums.map(nm => decimal(nm, asg)), T = cfg.T;
    const sols = soluciones(nums);
    if (sols.length !== 1 || sols[0].a !== asg.a || sols[0].n !== asg.n) return null;
    const correcta = hrs(T, 1);
    const variables = { A: { nombre: 'tiempo del grifo A', color: 'o' }, B: { nombre: 'tiempo del grifo B', color: 'i' }, C: { nombre: 'tiempo del desagüe', color: 'h' }, res: { nombre: 'tiempo con los tres abiertos', color: 'd' } };
    const enunciado = ['Un tanque se llena con el grifo A en ', v('A', numTxt(nums[0])), ' horas y con el grifo B en ', v('B', numTxt(nums[1])),
      ' horas; lleno, se vacía por un desagüe en ', v('C', numTxt(nums[2])), ' horas. Los tres numerales están bien escritos.'];
    const pregunta = ['Si el tanque está vacío y se abren a la vez los dos grifos y el desagüe, ¿en cuánto ', v('res', 'tiempo'), ' se llena?'];
    const inv = (p, q, r) => { const d = q * r + p * r + p * q; return hrs(p * q * r, d); };
    const errores = [
      et('suma-el-que-vacia', inv(x, y, z), `Sumaste el desagüe como si también llenara. En una hora el desagüe saca 1/${z} del tanque: se resta, 1/${x} + 1/${y} − 1/${z}.`),
      et('AR7-suma-tiempos', x + y - z > 0 ? hrs(x + y - z, 1) : null, `Sumaste y restaste los tiempos (${x} + ${y} − ${z}). Lo que se suma es lo que hace cada uno en una hora: 1/${x} + 1/${y} − 1/${z}.`, 'parcial', INF),
      et('olvida-el-desague', hrs(x * y, x + y), 'Ese es el tiempo con los dos grifos y el desagüe cerrado. El desagüe está abierto: resta 1/' + z + ' por hora.'),
    ];
    const xs = nums.map(nm => Number(nm.c.map(s => val(s, asg)).join('')));
    if (xs[0] > 0 && xs[1] > 0 && xs[2] > 0) {
      const d = xs[1] * xs[2] + xs[0] * xs[2] - xs[0] * xs[1];
      if (d > 0 && P.frac(xs[0] * xs[1] * xs[2], d).d <= 30) errores.push(et('base-sin-convertir', hrs(xs[0] * xs[1] * xs[2], d), `Leíste los numerales como si estuvieran en base 10 (${xs.join(', ')} h). Primero hay que pasarlos a base 10 con su base.`));
    }
    const rel = soluciones(nums, false).filter(s => s.a !== asg.a || s.n !== asg.n);
    if (rel.length) {
      const s2 = rel[rel.length - 1], ts = nums.map(nm => decimal(nm, s2));
      const d = ts[1] * ts[2] + ts[0] * ts[2] - ts[0] * ts[1];
      if (d > 0 && P.frac(ts[0] * ts[1] * ts[2], d).d <= 30) errores.push(et('cifra-igual-a-la-base', hrs(ts[0] * ts[1] * ts[2], d), `Dejaste que una cifra sea igual a la base (a = ${s2.a}, n = ${s2.n}). En base B las cifras van de 0 a B − 1.`));
    }
    const cotas = nums.map(nm => {
      const B = typeof nm.base === 'string' ? nm.base : String(nm.base);
      const cs = nm.c.map(String);
      const partes = cs.filter(s => s !== '0').map(s => `${s} < ${B}`).filter(s => /[an]/.test(s));
      if (cs[0] === 'a' || cs[0] === 'n') partes.push(`${cs[0]} ≠ 0`);
      return partes.length ? `en ${numTxt(nm)}: ${[...new Set(partes)].join(', ')}` : null;
    }).filter(Boolean);
    const solucion = [
      [`Las cifras son menores que su base (y la primera no es 0): ${cotas.join('; ')}. La única opción es a = ${asg.a} y n = ${asg.n}.`],
      ['En base 10: ', v('A', `${numTxt(nums[0])} = ${x}`), ', ', v('B', `${numTxt(nums[1])} = ${y}`), ' y ', v('C', `${numTxt(nums[2])} = ${z}`), ' horas.'],
      [`En una hora: 1/${x} + 1/${y} − 1/${z} = 1/${T} del tanque. Se llena en `, v('res', correcta.texto), '.'],
    ];
    return cerrar(rng, semilla, { claves: true, correcta, errores, variables, enunciado, pregunta, solucion, unidad: 'h',
      datos: { tipo: 'grifos', numerales: nums.map(nm => ({ cifras: nm.c, base: nm.base })) } });
  }

  // ---------------- cubos ----------------
  function cubos(rng, semilla) {
    const sb = rng.elegir(['cuenta', 'suma']);
    const b = rng.entero(2, 9), k = rng.entero(2, 9);
    const lo = b ** (k - 1), hi = b ** k - 1;
    if (hi > 1e6) return null;
    const raices = (x, y) => { const l = []; for (let r = 1; r ** 3 <= y; r++) if (r ** 3 >= x) l.push(r); return l; };
    const R = raices(lo, hi);
    if (R.length < 3 || R.length > 15) return null;
    const suma = l => l.reduce((a, c) => a + c, 0);
    const correcta = sb === 'cuenta' ? R.length : suma(R);
    const R2 = raices(b ** k, b ** (k + 1) - 1), Rin = raices(lo, hi + 1), R1 = raices(1, hi);
    const cuad = []; for (let r = 1; r * r <= hi; r++) if (r * r >= lo) cuad.push(r);
    const variables = { b: { nombre: 'base', color: 'o' }, k: { nombre: 'cantidad de cifras', color: 'i' }, rango: { nombre: 'números con k cifras', color: 'h' }, res: { nombre: 'lo que se pide', color: 'd' } };
    const enunciado = ['Considera los cubos perfectos que, escritos en base ', v('b', String(b)), ', tienen exactamente ', v('k', String(k)), ' cifras.'];
    const pregunta = sb === 'cuenta' ? ['¿', v('res', 'Cuántos'), ' son?'] : ['¿Cuánto suman sus ', v('res', 'raíces cúbicas'), '?'];
    const elige = l => (sb === 'cuenta' ? l.length : suma(l));
    const errores = [
      e('cifras-con-exponente-corrido', elige(R2), `Tomaste los números de ${b}${sup(k)} a ${b}${sup(k + 1)} − 1. Esos tienen ${k + 1} cifras en base ${b}: el menor de ${k} cifras es 10…0₍${sub(b)}₎ = ${b}${sup(k - 1)}.`),
      Rin.length > R.length ? e('incluye-b-a-la-k', elige(Rin), `Contaste ${b}${sup(k)} = ${hi + 1}, que es cubo, pero en base ${b} se escribe 1 seguido de ${k} ceros: tiene ${k + 1} cifras.`) : null,
      e('sin-cota-inferior', elige(R1), `Contaste desde 1. Los números de ${k} cifras en base ${b} empiezan en ${b}${sup(k - 1)} = ${lo}.`),
    ];
    if (sb === 'cuenta') {
      errores.push(e('poste-valla-sin-sumar-uno', R.length - 1, `Restaste ${R[R.length - 1]} − ${R[0]}: así cuentas los saltos. Las raíces van de ${R[0]} a ${R[R.length - 1]}: son ${R.length}, con los dos extremos.`, 'hipotesis', INF));
      if (cuad.length) errores.push(e('cuenta-cuadrados', cuad.length, `Contaste los cuadrados perfectos (de ${cuad[0]}² a ${cuad[cuad.length - 1]}²). Se piden cubos.`));
    } else {
      errores.push(e('suma-los-cubos', R.reduce((a, c) => a + c ** 3, 0), 'Sumaste los cubos mismos. Se pide la suma de sus raíces cúbicas.'));
      errores.push(e('cuenta-en-vez-de-suma', R.length, `${R.length} es cuántos cubos hay; se pide la suma de sus raíces.`));
    }
    const solucion = [
      ['Con ', v('k', String(k)), ' cifras en base ', v('b', String(b)), ' se escriben los números de ', v('rango', `${b}${sup(k - 1)} = ${lo} a ${b}${sup(k)} − 1 = ${hi}`), '.'],
      [`Cubos en ese tramo: ${R[0]}³ = ${R[0] ** 3} hasta ${R[R.length - 1]}³ = ${R[R.length - 1] ** 3} (${R[0] - 1}³ = ${(R[0] - 1) ** 3} se queda corto y ${R[R.length - 1] + 1}³ = ${(R[R.length - 1] + 1) ** 3} se pasa).`],
      sb === 'cuenta'
        ? [`Raíces de ${R[0]} a ${R[R.length - 1]}: son ${R[R.length - 1]} − ${R[0]} + 1 = `, v('res', String(correcta)), '.']
        : [`${R.join(' + ')} = `, v('res', f(correcta)), '.'],
    ];
    return cerrar(rng, semilla, { correcta, errores, variables, enunciado, pregunta, solucion, datos: { tipo: 'cubos', sub: sb, b, k } });
  }

  return { id: ID, titulo: 'Sucesiones, divisores y numerales', TIPOS, generar };
});
