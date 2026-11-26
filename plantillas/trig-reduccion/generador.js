/*
 * Generador «Reducción al primer cuadrante»: la práctica de las cinco ideas de trigonometria.reduccion-al-primer-cuadrante
 * (contenido/teoria/trigonometria/reduccion-al-primer-cuadrante.js). Formato "predicciones" (docs/arquitectura.md).
 * Funciona en el navegador (window.Generadores['trig-reduccion']) y en Node (require). No usa ningún motor: los valores
 * salen de la tabla de ángulos notables (30°, 45°, 60°, 37° y 53°, con la convención del examen) y del signo del cuadrante.
 *
 * Propuesta: docs/etapa9/propuesta-trigonometria.md §7 (Gerson delegó el criterio).
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los de
 * esa idea; generar(semilla, { tipo }) uno solo; sin nada, las cinco ideas con el mismo peso.
 *   angulo-referencia  referencia (1) α de un θ · theta-desde-alfa (2) θ con su α y su cuadrante · suma-referencias (3)
 *                      θ + β con el mismo α en dos cuadrantes
 *   misma-razon        valor (1) una razón con α notable · dos-razones (2) sen θ ± cos θ, sec θ + tan θ… con 37° o 53° ·
 *                      expresion (3) c₁ f₁(θ₁) ± c₂ f₂(θ₂), con números enteros (San Marcos 2024-I: el signo)
 *   opuestos           opuesto (1) una razón de −α · opuesto-grande (2) una razón de −θ con θ de 90° a 360° ·
 *                      cociente-opuestos (3) f₁(−θ)/f₁ θ ± f₂(−θ)/f₂ θ
 *   mayores-negativos  vueltas (1) una razón de un θ de varias vueltas · negativo-grande (2) una razón de −θ con vueltas ·
 *                      radianes (3) una razón de kπ/d de más de una vuelta (San Marcos 2025-I: ángulos de varias vueltas)
 *   cofuncion          cofuncion (1) la expresión reducida de K ± φ · cofuncion-valor (2) con sen φ y cos φ dados ·
 *                      expresion-cof (3) dos productos de cofunciones (San Marcos 2024-I: la co-razón)
 *
 * Notación y colores (cabecera de la teoría): los ángulos en carmín (ang, h) y el ángulo de referencia α en violeta
 * (alfa, f); la respuesta, en tinta. Letras: θ, α, β, φ, n. Datos (punto 13): la definición de α, las cuentas por cuadrante,
 * los signos, las reglas de −θ, de las vueltas y de la cofunción, y los valores notables; nunca el valor con su signo.
 * Errores: TR11, TR12, TR14 y TR15 son de docs/investigacion/trigonometria-ideas-erroneas.md (parciales); TRNEG-TODO-NEG,
 * de «Ángulos en posición normal»; los TRRD-* son hipótesis (propuesta, decisión 12). Cada explicación empieza por lo
 * que el alumno hizo bien y dice el valor que da su error.
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'trig-reduccion';
  const TRF = 'docs/investigacion/trigonometria-ideas-erroneas.md';
  const v = P.v;
  const mod360 = g => ((g % 360) + 360) % 360;
  const gr = g => `${String(g).replace('-', '−')}°`;
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const ROM = ['un eje', 'I', 'II', 'III', 'IV'];
  const cuad = g => { const m = mod360(g); return m % 90 === 0 ? 0 : Math.ceil(m / 90); };
  const refDe = g => { const m = mod360(g); return m <= 90 ? m : m <= 180 ? 180 - m : m <= 270 ? m - 180 : 360 - m; };
  const deAlfa = (a, q) => (q === 1 ? a : q === 2 ? 180 - a : q === 3 ? 180 + a : 360 - a);
  const FNS = ['sen', 'cos', 'tan', 'cot', 'sec', 'csc'];
  const COF = { sen: 'cos', cos: 'sen', tan: 'cot', cot: 'tan', sec: 'csc', csc: 'sec' };
  // La razón dicha en palabras: «el seno es negativo», «la tangente es positiva», «el signo del coseno».
  const NOMBRE = { sen: 'seno', cos: 'coseno', tan: 'tangente', cot: 'cotangente', sec: 'secante', csc: 'cosecante' };
  const FEM = { tan: true, cot: true, sec: true, csc: true };
  const elN = fn => `${FEM[fn] ? 'la' : 'el'} ${NOMBRE[fn]}`;
  const delN = fn => `${FEM[fn] ? 'de la' : 'del'} ${NOMBRE[fn]}`;
  const sgTxt = (fn, s) => (s < 0 ? (FEM[fn] ? 'negativa' : 'negativo') : (FEM[fn] ? 'positiva' : 'positivo'));
  const RECIP = { sen: 'csc', cos: 'sec', tan: 'cot', cot: 'tan', sec: 'cos', csc: 'sen' };
  const POSITIVAS = { 1: FNS, 2: ['sen', 'csc'], 3: ['tan', 'cot'], 4: ['cos', 'sec'] };
  const signo = (fn, q) => (POSITIVAS[q].includes(fn) ? 1 : -1);
  const PAR = { sen: -1, cos: 1, tan: -1, cot: -1, sec: 1, csc: -1 };
  const VAL = {
    30: { sen: '1/2', cos: '√3/2', tan: '√3/3', cot: '√3', sec: '2√3/3', csc: '2' },
    45: { sen: '√2/2', cos: '√2/2', tan: '1', cot: '1', sec: '√2', csc: '√2' },
    60: { sen: '√3/2', cos: '1/2', tan: '√3', cot: '√3/3', sec: '2', csc: '2√3/3' },
    37: { sen: '3/5', cos: '4/5', tan: '3/4', cot: '4/3', sec: '5/4', csc: '5/3' },
    53: { sen: '4/5', cos: '3/5', tan: '4/3', cot: '3/4', sec: '5/3', csc: '5/4' },
  };
  const ALFAS = [30, 45, 60, 37, 53];
  const conSigno = (s, t) => (s < 0 ? `−${t}` : t);
  const opuesto = t => (t === '0' ? t : t[0] === '−' ? t.slice(1) : `−${t}`);
  const valorDe = (fn, g) => conSigno(signo(fn, cuad(g)), VAL[refDe(g)][fn]);
  // Fracciones (37° y 53° dan números racionales).
  const fr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const m = gcd(n, d) || 1; return [n / m, d / m]; };
  const frTxt = ([n, d]) => (n === 0 ? '0' : `${n < 0 ? '−' : ''}${Math.abs(n)}${d === 1 ? '' : '/' + d}`);
  const frDe = t => { const m = t.replace('−', '-').match(/^(-?\d+)(?:\/(\d+))?$/); return fr(+m[1], m[2] ? +m[2] : 1); };
  const frSuma = (a, b) => fr(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const frPor = (a, b) => fr(a[0] * b[0], a[1] * b[1]);
  const ent = n => String(n).replace('-', '−');

  const TH = v('ang', 'θ'), AL = v('alfa', 'α'), FI = v('ang', 'φ');
  const VARS = {
    ang: { nombre: 'el ángulo', color: 'h' },
    alfa: { nombre: 'el ángulo de referencia', color: 'f' },
  };
  const resp = id => (/^TR(11|12|14|15)$/.test(id) ? { respaldo: 'parcial', fuente: TRF } : { respaldo: 'hipotesis', fuente: null });
  const err = (id, texto, explicacion) => Object.assign({ id, clave: texto, texto, explicacion }, resp(id));

  // ---- Datos (una línea cada uno; herramientas, no el paso hecho) ----
  const CONV = ' (convención del examen)';
  const D = {
    alfa: 'Ángulo de referencia α: el ángulo agudo entre el lado final de θ y el eje x.',
    formulas: 'Cuenta de α: en el II, 180° − θ; en el III, θ − 180°; en el IV, 360° − θ.',
    cuad: 'Cuadrantes: I, de 0° a 90°; II, de 90° a 180°; III, de 180° a 270°; IV, de 270° a 360°.',
    signos: 'Positivas: I, todas; II, sen y csc; III, tan y cot; IV, cos y sec. Las demás son negativas.',
    reduce: 'Una razón de θ vale ± la misma razón de α; el signo es el de esa razón en el cuadrante de θ.',
    par: 'Con −θ, cambian de signo sen, tan, cot y csc; cos y sec quedan igual.',
    vueltas: 'Una razón de θ vale lo mismo que esa razón de θ − 360° · n, con n entero.',
    pi: 'π rad = 180°.',
    cof: 'Con 90° ± φ o 270° ± φ, la razón cambia a su cofunción; con 180° ± φ o 360° − φ, se queda.',
    parejas: 'Cofunciones: sen y cos; tan y cot; sec y csc. φ es agudo.',
    rec: 'cot = 1/tan; sec = 1/cos; csc = 1/sen.',
    cocientes: 'tan φ = sen φ/cos φ; cot φ = cos φ/sen φ.',
  };
  const notab = pares => `${pares.map(([fn, a]) => `${fn} ${a}° = ${VAL[a][fn]}`).join('; ')}${pares.some(([, a]) => a === 37 || a === 53) ? CONV : ''}.`;
  const notabDe = (fn, a) => notab([[fn, a], [COF[fn], a]]);

  // ===================== Idea 1: el ángulo de referencia =====================
  const ejeY = g => Math.abs(mod360(g) - (mod360(g) < 180 ? 90 : 270));
  function referencia(rng) {
    const q = rng.entero(2, 4), a = rng.entero(11, 79), g = deAlfa(a, q);
    const otra = q === 4 ? g - 180 : 360 - g;
    return {
      enunciado: [TH, ` = ${gr(g)} está en posición normal.`], pregunta: ['¿Cuánto mide su ángulo de referencia ', AL, '?'],
      datos: [D.alfa, D.cuad, D.formulas],
      correcta: { clave: gr(a), texto: gr(a) },
      errores: [
        err('TRRD-EJE-Y', gr(ejeY(g)), `Buscar un ángulo agudo está bien, pero ${gr(ejeY(g))} se mide hasta el eje y; α se mide hasta el eje x.`),
        err('TRRD-FORMULA', gr(otra), `Restar está bien, pero ${gr(otra)} sale de la cuenta de otro cuadrante, y ${gr(g)} está en el ${ROM[q]}.`),
        err('TRRD-THETA', gr(g), `${gr(g)} es θ, el giro completo; α es solo el ángulo agudo entre su lado final y el eje x.`),
      ],
      solucion: [[`${gr(g)} está en el ${ROM[q]}, así que α es ${q === 2 ? 'lo que le falta para llegar a 180°' : q === 3 ? 'lo que pasa de 180°' : 'lo que le falta para completar 360°'}.`], [AL, ' = ', v('alfa', gr(a))]],
      _datos: { g, a, q, expr: `ref(${g})` },
    };
  }
  function thetaDesdeAlfa(rng) {
    const q = rng.entero(2, 4), a = rng.entero(11, 79), g = deAlfa(a, q), otros = [2, 3, 4].filter(k => k !== q);
    const desdeY = q === 2 ? 90 + a : q === 3 ? 270 - a : 270 + a;
    return {
      enunciado: [`Un ángulo `, TH, ` del cuadrante ${ROM[q]}, entre 0° y 360°, tiene ángulo de referencia `, AL, ` = ${gr(a)}.`], pregunta: ['¿Cuánto mide ', TH, '?'],
      datos: [D.alfa, D.cuad, D.formulas],
      correcta: { clave: gr(g), texto: gr(g) },
      errores: otros.map(k => err('TRRD-FORMULA', gr(deAlfa(a, k)), `Usar α está bien, pero ${gr(deAlfa(a, k))} es el ángulo del ${ROM[k]} con ese α, y piden el del ${ROM[q]}.`))
        .concat([err('TRRD-EJE-Y', gr(desdeY), `Sumar o restar α está bien, pero desde el eje y y no desde el eje x: así sale ${gr(desdeY)}.`)]),
      solucion: [[`En el ${ROM[q]}, ${{ 2: 'α = 180° − θ; al despejar, θ = 180° − α', 3: 'α = θ − 180°; al despejar, θ = 180° + α', 4: 'α = 360° − θ; al despejar, θ = 360° − α' }[q]}.`], [TH, ' = ', v('ang', gr(g))]],
      _datos: { a, q, expr: `${g}`, g },
    };
  }
  function sumaReferencias(rng) {
    const [q1, q2] = rng.elegir([[2, 3], [2, 4], [3, 4], [1, 2], [1, 3]]), a = rng.entero(12, 78), g1 = deAlfa(a, q1), g2 = deAlfa(a, q2), ok = g1 + g2;
    const mal2 = q2 === 4 ? 180 + a : 360 - a, desdeY = q => (q === 1 ? 90 - a : q === 2 ? 90 + a : q === 3 ? 270 - a : 270 + a);
    return {
      enunciado: [TH, ` está en el cuadrante ${ROM[q1]} y β en el ${ROM[q2]}, entre 0° y 360°; los dos tienen ángulo de referencia ${gr(a)}.`], pregunta: ['¿Cuánto vale ', TH, ' + β?'],
      datos: [D.alfa, D.formulas],
      correcta: { clave: gr(ok), texto: gr(ok) },
      errores: [
        err('TRRD-THETA', gr(2 * a), `${gr(a)} es el α de los dos ángulos, y ${gr(2 * a)} suma solo sus α; θ + β suma los giros completos.`),
        err('TRRD-FORMULA', gr(g1 + mal2), `θ = ${gr(g1)} está bien, pero β = ${gr(mal2)} sale de la cuenta de otro cuadrante, no de la del ${ROM[q2]}.`),
        err('TRRD-EJE-Y', gr(desdeY(q1) + desdeY(q2)), `Sumar los giros está bien, pero se midieron desde el eje y: ${gr(desdeY(q1))} + ${gr(desdeY(q2))}.`),
      ],
      solucion: [[`θ = ${gr(g1)} y β = ${gr(g2)}, cada uno con la cuenta de su cuadrante.`], [TH, ' + β = ', v('ang', gr(ok))]],
      _datos: { a, q1, q2, expr: `${ok}` },
    };
  }

  // ===================== Idea 2: misma razón, signo del cuadrante =====================
  function errValor(fn, a, q, ok) {
    const s = signo(fn, q), cof = conSigno(s, VAL[a][COF[fn]]), y = conSigno(s, VAL[90 - a] ? VAL[90 - a][fn] : VAL[a][fn]);
    return [
      err(s < 0 ? 'TR12' : 'TRRD-SIGNO-REF', opuesto(ok), `El tamaño, ${VAL[a][fn]}, está bien, pero en el ${ROM[q]} ${elN(fn)} es ${sgTxt(fn, s)}: sale ${ok}.`),
      err('TR14', cof, `El signo está bien, pero ${cof} usa ${COF[fn]} ${gr(a)}; al reducir con 180° o con 360°, la razón no cambia.`),
      err('TR14', opuesto(cof), `${opuesto(cof)} cambia la razón a ${COF[fn]} y además el signo; aquí se queda ${fn}.`),
      err('TRRD-EJE-Y', y, `El signo está bien, pero ${y} usa ${gr(90 - a)}, que se mide hasta el eje y; α mide ${gr(a)}.`),
    ];
  }
  function valor(rng) {
    const fn = rng.elegir(FNS), a = rng.elegir(ALFAS), q = rng.entero(2, 4), g = deAlfa(a, q), ok = valorDe(fn, g);
    return {
      enunciado: [`El ángulo ${gr(g)} no es agudo.`], pregunta: [`¿Cuánto vale ${fn} ${gr(g)}?`],
      datos: [D.formulas, D.signos, notabDe(fn, a)],
      correcta: { clave: ok, texto: ok }, errores: errValor(fn, a, q, ok),
      solucion: [[`${gr(g)} está en el ${ROM[q]}, con `, AL, ` = ${gr(a)}, y ahí ${elN(fn)} es ${sgTxt(fn, signo(fn, q))}.`], [`${fn} ${gr(g)} = ${signo(fn, q) < 0 ? '−' : '+'}${fn} ${gr(a)} = ${ok}`]],
      _datos: { fn, g, expr: `${fn} ${g}°` },
    };
  }
  function dosRazones(rng) {
    const [f1, f2, op] = rng.elegir([['sen', 'cos', 1], ['sen', 'cos', -1], ['sec', 'tan', 1], ['csc', 'cot', 1], ['tan', 'cot', -1]]), a = rng.elegir([37, 53]), q = rng.entero(2, 4), g = deAlfa(a, q);
    const vv = (fn, s) => frDe(conSigno(s, VAL[a][fn])), t = (s1, s2) => frTxt(frSuma(vv(f1, s1), frPor(fr(op), vv(f2, s2))));
    const s1 = signo(f1, q), s2 = signo(f2, q), ok = t(s1, s2), E = `${f1} θ ${op > 0 ? '+' : '−'} ${f2} θ`;
    return {
      enunciado: [TH, ` = ${gr(g)}.`], pregunta: [`Calcula E = ${E}.`],
      datos: [D.formulas, D.signos, notab([[f1, a], [f2, a]])],
      correcta: { clave: ok, texto: ok },
      errores: [
        err('TR12', t(1, 1), `Los tamaños están bien, pero en el ${ROM[q]} las dos razones no son positivas; con las dos positivas sale ${t(1, 1)}.`),
        err('TR12', t(-s1, s2), `${f2} θ está bien, pero el signo de ${f1} θ quedó cambiado: en el ${ROM[q]}, ${elN(f1)} es ${sgTxt(f1, s1)}.`),
        err('TR12', t(s1, -s2), `${f1} θ está bien, pero el signo de ${f2} θ quedó cambiado: en el ${ROM[q]}, ${elN(f2)} es ${sgTxt(f2, s2)}.`),
        err('TRNEG-TODO-NEG', t(-1, -1), `Los tamaños están bien, pero fuera del I no todas son negativas; con las dos negativas sale ${t(-1, -1)}.`),
      ],
      solucion: [[`${gr(g)} está en el ${ROM[q]}, con `, AL, ` = ${gr(a)}.`], [`E = ${ok}`]],
      _datos: { g, expr: `${f1} ${g}° ${op > 0 ? '+' : '-'} ${f2} ${g}°` },
    };
  }
  const RACIONAL = [[37, FNS], [53, FNS], [45, ['tan', 'cot']], [30, ['sen', 'csc']], [60, ['cos', 'sec']]];
  function expresion(rng) {
    const termino = () => { const [a, fns] = rng.elegir(RACIONAL), fn = rng.elegir(fns), q = rng.entero(2, 4); return { a, fn, q, g: deAlfa(a, q), c: frDe(VAL[a][fn])[1] }; };
    const t1 = termino(), t2 = termino(), op = rng.entero(0, 1) ? 1 : -1;
    if (t1.g === t2.g) return null;
    const val = (t, s) => frPor(fr(t.c), frDe(conSigno(s, VAL[t.a][t.fn]))), E = (x, y) => frTxt(frSuma(x, frPor(fr(op), y)));
    const s1 = signo(t1.fn, t1.q), s2 = signo(t2.fn, t2.q), ok = E(val(t1, s1), val(t2, s2));
    const tx = t => `${t.c === 1 ? '' : t.c + ' '}${t.fn} ${gr(t.g)}`;
    return {
      enunciado: ['Los dos ángulos de la expresión no son agudos.'], pregunta: [`Calcula E = ${tx(t1)} ${op > 0 ? '+' : '−'} ${tx(t2)}.`],
      datos: [D.formulas, D.signos, notab([[t1.fn, t1.a], [t2.fn, t2.a]])],
      correcta: { clave: ok, texto: ok },
      errores: [
        err('TR12', E(val(t1, 1), val(t2, 1)), `Las razones están bien elegidas, pero fuera del I no todas son positivas; con todo positivo sale ${E(val(t1, 1), val(t2, 1))}.`),
        err('TR12', E(val(t1, -s1), val(t2, s2)), `El segundo término está bien, pero a ${t1.fn} ${gr(t1.g)} se le puso el signo contrario al de su cuadrante.`),
        err('TR12', E(val(t1, s1), val(t2, -s2)), `El primer término está bien, pero a ${t2.fn} ${gr(t2.g)} se le puso el signo contrario al de su cuadrante.`),
      ],
      solucion: [[`${t1.fn} ${gr(t1.g)} = ${conSigno(s1, VAL[t1.a][t1.fn])} y ${t2.fn} ${gr(t2.g)} = ${conSigno(s2, VAL[t2.a][t2.fn])}, cada una con el signo de su cuadrante.`], [`E = ${ok}`]],
      _datos: { expr: `${t1.c}*${t1.fn} ${t1.g}° ${op > 0 ? '+' : '-'} ${t2.c}*${t2.fn} ${t2.g}°` },
    };
  }

  // ===================== Idea 3: giros opuestos =====================
  function opuestoA(rng) {
    const fn = rng.elegir(FNS), a = rng.elegir(ALFAS), p = PAR[fn], ok = conSigno(p, VAL[a][fn]), cof = conSigno(p, VAL[a][COF[fn]]);
    return {
      enunciado: [`El ángulo −${gr(a)} gira en sentido horario.`], pregunta: [`¿Cuánto vale ${fn}(−${gr(a)})?`],
      datos: [D.par, notabDe(fn, a)],
      correcta: { clave: ok, texto: ok },
      errores: [
        p < 0 ? err('TR15', VAL[a][fn], `El tamaño, ${VAL[a][fn]}, está bien, pero ${elN(fn)} usa la y, así que cambia de signo con −θ.`)
          : err('TRNEG-TODO-NEG', opuesto(ok), `El tamaño está bien, pero ${fn}(−θ) = ${fn} θ: ${elN(fn)} usa x y r, que no cambian con el reflejo.`),
        err('TR11', cof, `El signo está bien, pero ${cof} usa ${COF[fn]} ${gr(a)}; con −θ la razón no cambia a su cofunción.`),
        err('TR11', opuesto(cof), `${opuesto(cof)} usa ${COF[fn]} y otro signo; con −θ la razón se queda ${fn}.`),
      ],
      solucion: [[`Con −θ, ${elN(fn)} ${p < 0 ? 'cambia de signo' : 'no cambia'}: ${fn}(−θ) = ${p < 0 ? '−' : ''}${fn} θ.`], [`${fn}(−${gr(a)}) = ${ok}`]],
      _datos: { expr: `${fn}(-${a}°)` },
    };
  }
  function opuestoGrande(rng) {
    const fn = rng.elegir(FNS), a = rng.elegir(ALFAS), q = rng.entero(2, 4), g = deAlfa(a, q), p = PAR[fn], ok = conSigno(p * signo(fn, q), VAL[a][fn]);
    const cof = conSigno(p * signo(fn, q), VAL[a][COF[fn]]);
    return {
      enunciado: [`El ángulo −${gr(g)} gira en sentido horario.`], pregunta: [`¿Cuánto vale ${fn}(−${gr(g)})?`],
      datos: [D.par, D.formulas, D.signos, notabDe(fn, a)],
      correcta: { clave: ok, texto: ok },
      errores: [
        err(p < 0 ? 'TR15' : 'TRNEG-TODO-NEG', opuesto(ok), `${fn} ${gr(g)} se reduce bien, ${p < 0 ? `pero falta el menos de ${fn}(−θ) = −${fn} θ` : `pero ${fn}(−θ) = ${fn} θ y no lleva otro menos`}.`),
        err('TR14', cof, `Los signos están bien, pero ${cof} usa ${COF[fn]}; como ${gr(g)} se reduce con 180° o 360°, se queda ${fn}.`),
        err('TR14', opuesto(cof), `${opuesto(cof)} usa ${COF[fn]} y otro signo; aquí se queda ${fn}.`),
      ],
      solucion: [[`Primero el menos: ${fn}(−${gr(g)}) = ${p < 0 ? '−' : ''}${fn} ${gr(g)}. Después, ${gr(g)} está en el ${ROM[q]}, con α = ${gr(a)}.`], [`${fn}(−${gr(g)}) = ${ok}`]],
      _datos: { expr: `${fn}(-${g}°)` },
    };
  }
  // E = f₁(−θ)/f₁ θ ± 2 · f₂(−θ)/f₂ θ (o con productos por la recíproca): cada pieza vale ±1, y los cuatro signos dan
  // cuatro valores distintos.
  function cocienteOpuestos(rng) {
    const f1 = rng.elegir(FNS), f2 = rng.elegir(FNS.filter(x => x !== f1)), op = rng.entero(0, 1) ? 1 : -1, prod = rng.entero(0, 1);
    const pieza = fn => (prod ? `${fn}(−θ) · ${RECIP[fn]} θ` : `${fn}(−θ)/${fn} θ`), E = (a, b) => ent(a + 2 * op * b), P1 = PAR[f1], P2 = PAR[f2], ok = E(P1, P2);
    return {
      enunciado: [TH, ' no está sobre un eje.'], pregunta: [`Simplifica E = ${pieza(f1)} ${op > 0 ? '+' : '−'} 2 · ${pieza(f2)}.`],
      datos: [D.par].concat(prod ? [D.rec] : []),
      correcta: { clave: ok, texto: ok },
      errores: [
        err(P1 < 0 ? 'TR15' : 'TRNEG-TODO-NEG', E(-P1, P2), `La segunda pieza está bien, pero la primera vale ${ent(P1)}, porque ${elN(f1)} ${P1 < 0 ? 'cambia' : 'no cambia'} de signo con −θ.`),
        err(P2 < 0 ? 'TR15' : 'TRNEG-TODO-NEG', E(P1, -P2), `La primera pieza está bien, pero la segunda vale ${ent(P2)}, porque ${elN(f2)} ${P2 < 0 ? 'cambia' : 'no cambia'} de signo con −θ.`),
        err('TR15', E(-P1, -P2), 'Ver que cada pieza vale 1 o −1 está bien, pero los signos quedaron al revés en las dos piezas.'),
      ],
      solucion: [[`${f1}(−θ) = ${P1 < 0 ? '−' : ''}${f1} θ y ${f2}(−θ) = ${P2 < 0 ? '−' : ''}${f2} θ, así que las piezas valen ${ent(P1)} y ${ent(P2)}.`], [`E = ${ent(P1)} ${op > 0 ? '+' : '−'} 2 · (${ent(P2)}) = ${ok}`]],
      _datos: { expr: `${prod ? `${f1}(-θ)*${RECIP[f1]} θ` : `${f1}(-θ)/${f1} θ`} ${op > 0 ? '+' : '-'} 2*${prod ? `${f2}(-θ)*${RECIP[f2]} θ` : `${f2}(-θ)/${f2} θ`}` },
    };
  }

  // ===================== Idea 4: primero se quitan las vueltas =====================
  function vueltas(rng) {
    const fn = rng.elegir(FNS), a = rng.elegir(ALFAS), q = rng.entero(2, 4), n = rng.entero(1, 3), g0 = deAlfa(a, q), g = g0 + 360 * n, ok = valorDe(fn, g0);
    const cof = conSigno(signo(fn, q), VAL[a][COF[fn]]), medias = valorDe(fn, g0 + 180);
    return {
      enunciado: [`El ángulo ${gr(g)} da más de una vuelta.`], pregunta: [`¿Cuánto vale ${fn} ${gr(g)}?`],
      datos: [D.vueltas, D.formulas, D.signos, notabDe(fn, a)],
      correcta: { clave: ok, texto: ok },
      errores: [
        err('TR12', opuesto(ok), `${gr(g)} − ${360 * n}° = ${gr(g0)} está bien, pero falta el signo ${delN(fn)} en el ${ROM[q]}.`),
        err('TRRD-VUELTAS', medias, `Quitar vueltas está bien, pero se quitan de 360° en 360°; con 180° de más queda ${gr(mod360(g0 + 180))}, otro cuadrante.`),
        err('TR14', cof, `El signo está bien, pero ${cof} usa ${COF[fn]} ${gr(a)}; al quitar vueltas y reducir, la razón no cambia.`),
        err('TR14', opuesto(cof), `${opuesto(cof)} usa ${COF[fn]} ${gr(a)} y otro signo; aquí se queda ${fn}.`),
      ],
      solucion: [[`${gr(g)} − ${360 * n}° = ${gr(g0)}, que está en el ${ROM[q]}, con `, AL, ` = ${gr(a)}.`], [`${fn} ${gr(g)} = ${ok}`]],
      _datos: { expr: `${fn} ${g}°` },
    };
  }
  function negativoGrande(rng) {
    const fn = rng.elegir(FNS), a = rng.elegir(ALFAS), q = rng.entero(1, 4), n = rng.entero(1, 3), g0 = deAlfa(a, q), g = g0 + 360 * n, p = PAR[fn];
    const v0 = valorDe(fn, g0), ok = p < 0 ? opuesto(v0) : v0, cof = conSigno(ok[0] === '−' ? -1 : 1, VAL[a][COF[fn]]);
    return {
      enunciado: [`El ángulo −${gr(g)} da más de una vuelta en sentido horario.`], pregunta: [`¿Cuánto vale ${fn}(−${gr(g)})?`],
      datos: [D.par, D.vueltas, D.formulas, D.signos, notabDe(fn, a)],
      correcta: { clave: ok, texto: ok },
      errores: [
        err(p < 0 ? 'TR15' : 'TRNEG-TODO-NEG', opuesto(ok), `${fn} ${gr(g)} = ${v0} está bien, ${p < 0 ? `pero falta el menos de ${fn}(−θ)` : `pero ${fn}(−θ) = ${fn} θ y no lleva otro menos`}.`),
        err('TR14', cof, `Los signos están bien, pero ${cof} usa ${COF[fn]} ${gr(a)}; al quitar vueltas y reducir, la razón no cambia.`),
        err('TR14', opuesto(cof), `${opuesto(cof)} usa ${COF[fn]} ${gr(a)} y otro signo; aquí se queda ${fn}.`),
      ],
      solucion: [[`Primero el menos: ${fn}(−${gr(g)}) = ${p < 0 ? '−' : ''}${fn} ${gr(g)}. Después se quitan las vueltas: ${gr(g)} − ${360 * n}° = ${gr(g0)}.`], [`${fn}(−${gr(g)}) = ${ok}`]],
      _datos: { expr: `${fn}(-${g}°)` },
    };
  }
  function radianes(rng) {
    const d = rng.elegir([6, 4, 3]), k = rng.entero(2 * d + 1, 6 * d), g = 180 * k / d;
    if (gcd(k, d) !== 1 || !cuad(g) || mod360(g) < 90) return null;
    const fn = rng.elegir(['sen', 'cos', 'tan']), a = refDe(g), q = cuad(g), ok = valorDe(fn, g), cof = conSigno(signo(fn, q), VAL[a][COF[fn]]);
    return {
      enunciado: [`El ángulo ${k}π/${d} está en radianes.`], pregunta: [`¿Cuánto vale ${fn}(${k}π/${d})?`],
      datos: [D.pi, D.vueltas, D.formulas, D.signos, notabDe(fn, a)],
      correcta: { clave: ok, texto: ok },
      errores: [
        err('TR12', opuesto(ok), `${k}π/${d} = ${gr(g)} está bien, pero falta el signo ${delN(fn)} en el ${ROM[q]}.`),
        err('TR14', cof, `El signo está bien, pero ${cof} usa ${COF[fn]} ${gr(a)}; al quitar vueltas y reducir, la razón no cambia.`),
        err('TR14', opuesto(cof), `${opuesto(cof)} usa ${COF[fn]} ${gr(a)} y otro signo; aquí se queda ${fn}.`),
      ],
      solucion: [[`${k}π/${d} = ${gr(g)}, que sin las vueltas es ${gr(mod360(g))}, en el ${ROM[q]}, con `, AL, ` = ${gr(a)}.`], [`${fn}(${k}π/${d}) = ${ok}`]],
      _datos: { expr: `${fn}(${k}π/${d})` },
    };
  }

  // ===================== Idea 5: con 90° y 270°, la cofunción =====================
  const sgCof = (fn, K, s) => signo(fn, cuad(K + s * 30));
  const cofDe = (fn, K) => (K % 180 ? COF[fn] : fn);
  const angTxt = (K, s) => `${K}° ${s > 0 ? '+' : '−'} φ`;
  function cofuncion(rng) {
    const K = rng.elegir([90, 90, 270, 270, 180, 360]), s = K === 360 ? -1 : rng.entero(0, 1) ? 1 : -1, fn = rng.elegir(FNS);
    const nueva = cofDe(fn, K), sg = sgCof(fn, K, s), otra = K % 180 ? fn : COF[fn], t = (g, f2) => `${g < 0 ? '−' : ''}${f2} φ`, ok = t(sg, nueva);
    return {
      enunciado: [FI, ' es agudo.'], pregunta: [`¿A qué es igual ${fn}(${angTxt(K, s)})?`],
      datos: [D.cof, D.parejas, D.signos],
      correcta: { clave: ok, texto: ok },
      errores: [
        err('TR14', t(sg, otra), `El signo está bien, pero con ${K}° la razón ${K % 180 ? 'cambia a su cofunción' : 'se queda'}, así que queda ${ok}.`),
        err('TR12', t(-sg, nueva), `La razón está bien elegida, pero ${angTxt(K, s)} está en el ${ROM[cuad(K + s * 30)]}, donde ${elN(fn)} es ${sgTxt(fn, sg)}.`),
        err('TR14', t(-sg, otra), `${t(-sg, otra)} se equivoca en la razón y en el signo; la forma correcta es ${ok}.`),
      ],
      solucion: [[`Con ${K}°, la razón ${K % 180 ? 'cambia a su cofunción' : 'se queda'}, y en el ${ROM[cuad(K + s * 30)]} ${elN(fn)} es ${sgTxt(fn, sg)}.`], [`${fn}(${angTxt(K, s)}) = ${ok}`]],
      _datos: { expr: `${fn}(${K}° ${s > 0 ? '+' : '-'} φ)`, simbolica: true },
    };
  }
  const TERNAS = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
  function cofuncionValor(rng) {
    const [a, b, c] = rng.elegir(TERNAS), K = rng.elegir([90, 270]), s = rng.entero(0, 1) ? 1 : -1, fn = rng.elegir(['sen', 'cos', 'tan', 'cot']);
    const val = { sen: fr(a, c), cos: fr(b, c), tan: fr(a, b), cot: fr(b, a) }, nueva = cofDe(fn, K), sg = sgCof(fn, K, s), con = (g, f2) => frTxt(frPor(fr(g), val[f2])), ok = con(sg, nueva);
    return {
      enunciado: [FI, ` es agudo, sen φ = ${a}/${c} y cos φ = ${b}/${c}.`], pregunta: [`¿Cuánto vale ${fn}(${angTxt(K, s)})?`],
      datos: [D.cof, D.parejas, D.signos, D.cocientes],
      correcta: { clave: ok, texto: ok },
      errores: [
        err('TR14', con(sg, fn), `El signo está bien, pero con ${K}° ${fn} cambia a ${nueva}: sale ${ok}.`),
        err('TR12', con(-sg, nueva), `Cambiar a ${nueva} está bien, pero el signo es el ${delN(fn)} en el ${ROM[cuad(K + s * 30)]}, donde es ${sgTxt(fn, sg)}.`),
        err('TR14', con(-sg, fn), `${con(-sg, fn)} se queda con ${fn} y cambia el signo; es ${ok}.`),
      ],
      solucion: [[`${fn}(${angTxt(K, s)}) = ${sg < 0 ? '−' : ''}${nueva} φ: cambia a la cofunción, con el signo del ${ROM[cuad(K + s * 30)]}.`], [`${fn}(${angTxt(K, s)}) = ${ok}`]],
      _datos: { expr: `${fn}(${K}° ${s > 0 ? '+' : '-'} φ)`, phi: Math.atan2(a, b) * 180 / Math.PI },
    };
  }
  const BASES = [[90, 1], [90, -1], [180, 1], [180, -1], [270, 1], [270, -1], [360, -1]];
  function expresionCof(rng) {
    const pz = g => { const [K, s] = rng.elegir(BASES), fn = K % 180 ? COF[g] : g; return { K, s, fn, sg: sgCof(fn, K, s) }; };
    const g1 = rng.elegir(['sen', 'cos', 'tan']), g2 = rng.elegir(['sen', 'cos', 'tan']), op = rng.entero(0, 1) ? 1 : -1;
    const a1 = pz(g1), b1 = pz(RECIP[g1]), a2 = pz(g2), b2 = pz(RECIP[g2]);
    if (a1.K === b1.K && a1.s === b1.s) return null;
    const P1 = a1.sg * b1.sg, P2 = a2.sg * b2.sg, E = (p, q) => ent(p + 2 * op * q), ok = E(P1, P2);
    const tx = (x, y) => `${x.fn}(${angTxt(x.K, x.s)}) · ${y.fn}(${angTxt(y.K, y.s)})`, ex = (x, y) => `${x.fn}(${x.K}° ${x.s > 0 ? '+' : '-'} φ)*${y.fn}(${y.K}° ${y.s > 0 ? '+' : '-'} φ)`;
    return {
      enunciado: [FI, ' es agudo.'], pregunta: [`Calcula E = ${tx(a1, b1)} ${op > 0 ? '+' : '−'} 2 · ${tx(a2, b2)}.`],
      datos: [D.cof, D.parejas, D.signos, D.rec],
      correcta: { clave: ok, texto: ok },
      errores: [
        err('TR12', E(-P1, P2), `El segundo producto está bien, pero el primero vale ${ent(P1)} por los signos de sus cuadrantes.`),
        err('TR12', E(P1, -P2), `El primer producto está bien, pero el segundo vale ${ent(P2)} por los signos de sus cuadrantes.`),
        err('TR12', E(-P1, -P2), `Ver que cada producto vale 1 o −1 está bien, pero los dos quedaron con el signo contrario: sale ${E(-P1, -P2)}.`),
      ],
      solucion: [['Al reducir, cada producto queda como una razón de φ por su recíproca, con su signo.'], [`E = ${ok}`]],
      _datos: { expr: `${ex(a1, b1)} ${op > 0 ? '+' : '-'} 2*${ex(a2, b2)}` },
    };
  }

  const CONSTRUIR = { referencia, 'theta-desde-alfa': thetaDesdeAlfa, 'suma-referencias': sumaReferencias, valor, 'dos-razones': dosRazones, expresion,
    opuesto: opuestoA, 'opuesto-grande': opuestoGrande, 'cociente-opuestos': cocienteOpuestos, vueltas, 'negativo-grande': negativoGrande, radianes,
    cofuncion, 'cofuncion-valor': cofuncionValor, 'expresion-cof': expresionCof };
  const TIPOS_POR_IDEA = {
    'angulo-referencia': ['referencia', 'theta-desde-alfa', 'suma-referencias'],
    'misma-razon': ['valor', 'dos-razones', 'expresion'],
    opuestos: ['opuesto', 'opuesto-grande', 'cociente-opuestos'],
    'mayores-negativos': ['vueltas', 'negativo-grande', 'radianes'],
    cofuncion: ['cofuncion', 'cofuncion-valor', 'expresion-cof'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map((t, k) => [t, k + 1])));
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»): de menos a más, las cinco ideas.
  const PAPEL = { 'papel-1': 'referencia', 'papel-2': 'valor', 'papel-3': 'opuesto', 'papel-4': 'vueltas', 'papel-5': 'cofuncion',
    'papel-6': 'expresion', 'papel-7': 'radianes', 'papel-8': 'cofuncion-valor' };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const forzado = !o.idea && !o.tipo && PAPEL[String(semilla)];
    const tipo = o.tipo && CONSTRUIR[o.tipo] ? o.tipo : forzado || rng.elegir(TIPOS_POR_IDEA[TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS)]);
    for (let intento = 0; intento < 500; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      if (!pr) continue;
      const errores = pr.errores.filter(e => e && e.clave !== pr.correcta.clave);
      for (let i = errores.length - 1; i > 0; i--) { const j = rng.entero(0, i); [errores[i], errores[j]] = [errores[j], errores[i]]; }
      let alternativas;
      try { alternativas = P.armarTexto({ correcta: pr.correcta, errores, rng, total: 4 }); } catch (e) { continue; }
      if (alternativas.length < 4) continue;
      const usadas = new Set();
      for (const linea of [pr.enunciado, pr.pregunta, ...pr.solucion]) for (const x of linea) if (x && typeof x === 'object' && x.v) usadas.add(x.v);
      return {
        id: `${ID}#${semilla}`, variables: Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k])])),
        enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos, alternativas, solucion: pr.solucion,
        respuesta: { valor: pr.correcta.clave, unidad: '' },
        _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, pr._datos),
      };
    }
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo} con alternativas distintas`);
  }

  return { id: ID, titulo: 'Reducción al primer cuadrante', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
