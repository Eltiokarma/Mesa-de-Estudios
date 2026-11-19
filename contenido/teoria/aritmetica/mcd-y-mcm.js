/*
 * Teoría de «MCD y MCM» (aritmetica.mcd-y-mcm), para 5.º de secundaria y preuniversitario. Fuente del contenido:
 * docs/teoria/matriz/aritmetica.json (unidad 15).
 *
 * Etapa 7 del plan de calidad (19 nov), EN PROCESO: la propuesta es docs/etapa7/propuesta-aritmetica.md (Gerson delegó
 * el criterio y la revisa después). Seis ideas, rehechas contra el contrato con sus 15 ejemplos: 1 `mcd-cintas` (MCD),
 * 2 `mcm-coinciden` (MCM), 3 `mcd-por-mcm` (relación entre MCD y MCM y los cocientes PESI), 4 `mismo-resto` (nueva: el
 * mismo resto con varios divisores, N = MCM̊ + r; vino de Divisibilidad, docs/etapa5/decisiones.md), 5 `multiplos-tramo`
 * (nueva: múltiplos de uno o de otro, con inclusión y exclusión; también de Divisibilidad) y 6 `euclides` (el algoritmo
 * de Euclides y la fracción continua, que antes era la idea `fraccion-continua`). Hilo de la rama: los rollos de cinta
 * de la fiesta de la promoción (pieza arit-cintas), la rifa de la promoción con dos premios (arit-boletos, bloque
 * «premios») y el paquete de caramelos de doña Juana (arit-reparto); los tres, dibujos de prueba. Práctica por idea:
 * plantillas/mcd-mcm. Sin calidad: 2 todavía (falta el cierre: lector en frío y auditor).
 *
 * Letras (propuesta §6; def.letras): A, B y C son los números que se dan (un largo, un periodo, una bolsita); N, el número
 * que se busca (como en Divisibilidad); k, un entero; r, el resto (lo que sobra) y rₑ, lo que falta para otro grupo (el
 * resto por exceso de Las cuatro operaciones). p y q son los cocientes A ÷ MCD y B ÷ MCD, que son PESI (aviso: en Números
 * primos, p y q eran primos; aquí no tienen que serlo). L, hasta dónde se cuenta en un tramo. MCD(A, B) y MCM(A, B), como
 * en el examen; Å, «múltiplo de A», con el circulito del examen ({ mult } de nucleo/ecuacion.js). × para multiplicar,
 * nunca «·» (el «   ·   » solo separa dos relaciones en una regla). No hay cifras ocultas: a, b, c no se usan.
 *
 * REGLA DE COLORES DE LA UNIDAD: un color fijo por magnitud (docs/molde-unidad.md §5b; propuesta §7), en la tabla
 * COLORES (def.colores). Es el criterio de la rama (el envase turquesa, lo que sobra naranja, lo que se busca violeta),
 * leído para separar las dos cosas que el alumno confunde (AR13):
 *   - turquesa (c-i), «divisor»: un divisor común y el MCD, lo que entra exacto en todos (el trozo de cinta);
 *   - violeta (c-f), «multiplo»: un múltiplo común y el MCM, donde todos entran exacto (el boleto con los dos premios,
 *     la hora en que vuelven a coincidir; es lo que la unidad busca casi siempre);
 *   - naranja (c-o), «sobra»: lo que sobra (un resto, un pedazo de cinta) y lo que falta;
 *   - tinta: A, B, C y N, los cocientes p y q, los exponentes, k, cuántos (trozos, boletos, veces) y «?». Una respuesta
 *     que es un MCD va en turquesa; un MCM o un múltiplo común, en violeta; un resto, en naranja; una cantidad, en tinta.
 *   - ni verde ni carmín (la caja 3D del laboratorio pinta con estos mismos papeles).
 *   La letra de una alternativa va en negrita y en tinta ({ negrita }). Cada ficha de color dice su magnitud (m);
 *   contenido/teoria/aritmetica/mcd-y-mcm.test.js falla si una cambia de color.
 * Errores: AR13 (MCD por MCM, con respaldo parcial) y los AT-* como hipótesis de aula (tabla «MCD y MCM (19 nov)» de
 * docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md); ver el bloque de cada idea.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver el MCD como el trozo que entra en las dos cintas y el MCM como el boleto donde caen los dos premios.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de 360 px de gama baja, sin audio, con lápiz al lado.
 *   Resultado observable: elige MCD o MCM según el problema, los halla con primos o con Euclides, usa MCD × MCM = A × B
 *     solo con dos números, resuelve «el mismo resto» con el MCM, cuenta múltiplos de uno o de otro y arma la fracción
 *     continua con los cocientes.
 *   Orden de atención: 1.º el objeto (las cintas, la plancha, el paquete) · 2.º la lectura · acción: el botón fijo.
 *   Estados: juego sin tocar · casos probados · misión lograda · predicción · coincide / no coincide · paso a paso ·
 *     caso nuevo · «No sé».
 *   Duda que resuelve: «¿cuándo es MCD y cuándo MCM, si los dos dicen “común”?».
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El motor de plantillas/fracciones llena la caja (MCD) y arma el cubo de ladrillos (MCM) de las mesas 3D (regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/fracciones/motor.js'))
    : fabrica(root.Kit, root.MotorFracciones);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MF) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = x => String(x).split('').map(c => SUPD[+c]).join('');
  const mcd = (x, y) => (y ? mcd(y, x % y) : Math.abs(x));
  const mcm = (x, y) => x / mcd(x, y) * y;
  const mcdL = xs => xs.reduce((u, v) => mcd(u, v));
  const mcmL = xs => xs.reduce((u, v) => mcm(u, v));
  const esPrimo = x => { if (x < 2) return false; for (let k = 2; k * k <= x; k++) if (x % k === 0) return false; return true; };
  const factores = x => { const out = []; for (let k = 2; x > 1; k++) { let e = 0; while (x % k === 0) { x /= k; e++; } if (e) out.push([k, e]); } return out; };
  // «2³ × 3 × 5»: la descomposición canónica en texto, con los exponentes como superíndice.
  const canon = x => factores(x).map(([p, e]) => (e > 1 ? `${p}${sup(e)}` : String(p))).join(' × ');
  const canonDe = fs => fs.filter(([, e]) => e > 0).map(([p, e]) => (e > 1 ? `${p}${sup(e)}` : String(p))).join(' × ') || '1';
  const yLista = xs => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : String(xs[0]));
  // Las divisiones sucesivas de Euclides: [{ a, b, q, r }] hasta resto 0.
  const euclides = (a, b) => { const out = []; while (b) { out.push({ a, b, q: Math.floor(a / b), r: a % b }); [a, b] = [b, a % b]; } return out; };
  const plural = (k, uno, varios) => `${k} ${k === 1 ? uno : varios}`;
  function azar(s) {
    let z0 = (s * 2654435761 + 12345) >>> 0;
    const g = () => { z0 = (z0 + 0x6D2B79F5) >>> 0; let z = z0; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    g.ent = (lo, hi) => lo + Math.floor(g() * (hi - lo + 1));
    g.de = xs => xs[Math.floor(g() * xs.length)];
    return g;
  }
  function opciones(correcta, distractores, fmt = x => String(x)) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const x of distractores) {
      if (!x || x.valor === null || x.valor === undefined || (typeof x.valor === 'number' && (!Number.isFinite(x.valor) || x.valor < 0))) continue;
      const txt = fmt(x.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }
  function conCuatro(caso, r) {
    for (let i = 0; i < 4000; i++) { const c = caso(r); if (c && c.opciones.length >= 4) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }

  // ---------- Colores de la unidad: un color fijo por magnitud (cabecera; lo comprueba la prueba de la unidad) ----------
  const COLORES = { divisor: 'i', multiplo: 'f', sobra: 'o' };
  const ficha = mg => t => ({ v: `c-${COLORES[mg]}`, t: typeof t === 'number' ? f(t, 0) : String(t), m: mg });
  const dv = ficha('divisor'), ml = ficha('multiplo'), sb = ficha('sobra');
  // «Múltiplo de A», como en el examen: el número con su circulito ({ mult } de nucleo/ecuacion.js).
  const MU = x => ({ mult: [x] });
  // rₑ: lo que falta para otro grupo (el resto por exceso), en naranja como lo que sobra.
  const RE = { sub: [sb('r'), 'e'] };
  // La letra de una alternativa, en negrita y en tinta: sin color, para que una trampa no parezca la respuesta.
  const letra = L => ({ negrita: [L] });
  // Entre dos relaciones de una misma ecuación (en la regla, cada una en su línea).
  const SEP = '   ·   ';
  // El circulito dicho en palabras en los Datos de todo ejercicio que lo usa (auditoría de Divisibilidad, M4).
  const usaMu = x => (x === null || x === undefined || typeof x !== 'object' ? false : Array.isArray(x) ? x.some(usaMu) : x.mult ? true : Object.values(x).some(usaMu));
  const GLOSA_MU = [MU('A'), ' (A con un circulito): un múltiplo de A, es decir, A por un entero'];
  const conMu = c => (usaMu([c.pregunta, c.enunciado, c.opciones, c.solucion, c.pasos, c.respuesta, c.datos]) && !(c.datos || []).includes(GLOSA_MU)
    ? Object.assign({}, c, { datos: [...(c.datos || []), GLOSA_MU] }) : c);

  // ---------- Idea 1 (rehecha, 19 nov): el MCD es el trozo más largo que entra en las dos cintas ----------
  // Propuesta: docs/etapa7/propuesta-aritmetica.md §1 a §7. Conserva el id `mcd-cintas` (y la mesa `cintas-libres`).
  // Objeto: los rollos de cinta de la fiesta de la promoción (pieza arit-cintas, dibujo de prueba), cortados en trozos
  // iguales. Cambia: el largo del trozo y el par de rollos. · Permanece: los dos rollos a una sola escala. · Progresa:
  // trozos que dejan sobrante → trozos que entran exacto → el más largo. · Se reserva: los rollos de 24 y 36 (la
  // predicción). · Debe verse: un trozo sirve si no sobra nada en ninguno de los dos rollos.
  // Errores (AR13, parcial: Indonesia y Taiwán, sin cifra; los demás, hipótesis de aula): AR13 usa el MCM donde va el
  // MCD · AT-NOMAX toma un divisor común que no es el mayor · AT-MENOR toma el rollo menor como trozo · AT-PREGUNTA
  // responde el trozo cuando se piden cuántos · AT-TROZOS-PRODUCTO multiplica los trozos de cada rollo · AT-MCD-DOS usa
  // solo dos de los tres números · AT-MCD-MAYOR toma el mayor exponente · AT-MCD-TODOS mete primos que no son comunes ·
  // AT-MCD-SIN-EXP toma los comunes sin exponente · AT-MCD-UNIDAD no pasa los dos largos a la misma unidad ·
  // AT-PARCELA-SUMA suma las parcelas de cada lado en vez de multiplicar · AT-ESTACA-BORDE cuenta solo las estacas del
  // borde · AT-ESTACA-UNA pone una estaca de más en un solo lado.
  const CI = 'arit-cintas';
  const D1 = {
    comun: 'Un divisor común de A y B divide exacto a los dos: no deja resto en ninguno',
    mcd: 'MCD(A, B): el mayor divisor común de A y B',
    fac: 'Con primos: el MCD lleva los primos que todos comparten, cada uno con su menor exponente',
    trozos: 'Trozos que salen de una cinta: el largo de la cinta ÷ el largo del trozo',
    tres: 'El MCD de tres números es el mayor que divide exacto a los tres',
    pesi: 'Dos números son PESI si no comparten ningún primo',
    exp: 'El exponente dice cuántas veces entra el primo: 2³ = 2 × 2 × 2',
    cm: '1 m = 100 cm',
    lado: 'Cuadrados que caben en un lado: el largo de ese lado ÷ el lado del cuadrado',
  };
  // La nota bajo una cinta cortada: cuántos trozos y lo que sobra (en naranja).
  const notaCorte = (L, t, u = 'm') => {
    const q = Math.floor(L / t), r = L - q * t;
    return r ? [[`${plural(q, 'trozo', 'trozos')} y ${r === 1 ? 'sobra' : 'sobran'} `], [`${f(r, 0)} ${u}`, 'o', 700]] : [[`${plural(q, 'trozo', 'trozos')}, no sobra nada`]];
  };
  // Rollos a una sola escala; con trozo, cortados (los trozos en turquesa: el trozo es la medida que se prueba).
  const rollos = (xs, t, o = {}) => ({
    max: o.max || Math.max(...xs), filas: o.filas || xs.length,
    cintas: xs.map((L, k) => Object.assign({ largo: L, rotulo: [[`Rollo de ${o.rotulo ? o.rotulo(L, k) : `${f(L, 0)} ${o.u || 'm'}`}`]] },
      t ? { trozo: t, colorTrozo: 'i', marca: true, nota: notaCorte(L, t, o.u) } : {})),
    ...(o.letrero ? { letrero: o.letrero } : {}), ...(o.pie ? { pie: o.pie } : {}),
  });
  const cintasDe = (xs, t, o) => ({ pieza: CI, datos: rollos(xs, t, o), estado: {} });
  // Pares que ya usan el juego, la predicción y los ejemplos: «Ahora tú» y «Así se resuelve» no los repiten.
  const USADOS1 = new Set(['14-20', '16-40', '18-30', '20-28', '24-36', '12-18', '20-30', '40-100', '8-15', '9-36', '42-56', '60-84',
    '36-48', '48-60', '36-60', '150-225', '60-84', '72-120', '96-126', '100-130', '240-300', '300-420']);
  const par = (a, b) => `${Math.min(a, b)}-${Math.max(a, b)}`;
  // Dos números con MCD g y cocientes PESI m < n (de 2 a 9): ningún de los dos divide al otro.
  function dosConMcd(r, gs, tope = 150) {
    for (;;) {
      const g = r.de(gs), m = r.ent(2, 8), n = r.ent(m + 1, 9);
      if (mcd(m, n) !== 1 || g * n > tope || USADOS1.has(par(g * m, g * n))) continue;
      return r() < 0.5 ? { g, m, n, A: g * m, B: g * n } : { g, m: n, n: m, A: g * n, B: g * m };
    }
  }
  const menorPrimo = x => factores(x)[0][0];

  // Ahora tú · tipo 0: el trozo más largo para dos rollos.
  function casoTrozo(r) {
    const { g, m, n, A, B } = dosConMcd(r, [4, 6, 8, 9, 10, 12, 14, 15]), M = mcm(A, B), s = menorPrimo(g);
    const lo = Math.min(A, B), hi = Math.max(A, B);
    return {
      pregunta: `Dos rollos de cinta miden ${A} m y ${B} m. Se cortan en trozos iguales, lo más largos posible, sin que sobre nada. ¿Cuánto mide cada trozo?`,
      datos: [D1.comun, D1.mcd, D1.fac],
      opciones: opciones(g, [
        { id: 'mcm', valor: M, error: 'AR13', siFuera: `Buscar algo común está bien. Pero ${M} m es más largo que los rollos: ese número junta, no corta.` },
        { id: 'menor', valor: g / s, error: 'AT-NOMAX', siFuera: `Bien: ${g / s} m entra exacto en los dos. Pero ${g} m también entra, y es más largo.` },
        { id: 'rollo', valor: lo, error: 'AT-MENOR', siFuera: `Bien para el rollo de ${lo} m. Pero en el de ${hi} m sobran ${hi % lo} m.` },
      ], x => `${f(x, 0)} m`),
      solucion: { texto: `${m} y ${n} son PESI: ningún trozo más largo que ${g} m entra en los dos.`, ecuacion: [`${A} = ${m} × `, dv(g), SEP, `${B} = ${n} × `, dv(g)] },
    };
  }
  // Ahora tú · tipo 1: cuántos trozos salen en total.
  function casoTotal(r) {
    const { g, m, n, A, B } = dosConMcd(r, [4, 6, 8, 9, 10, 12, 15]), s = menorPrimo(g);
    return {
      pregunta: `Dos rollos de cinta miden ${A} m y ${B} m. Se cortan en trozos iguales, lo más largos posible, sin que sobre nada. ¿Cuántos trozos salen en total?`,
      datos: [D1.mcd, D1.fac, D1.trozos],
      opciones: opciones(m + n, [
        { id: 'largo', valor: g, error: 'AT-PREGUNTA', siFuera: `Hallar el trozo de ${g} m está bien. Pero se pide cuántos trozos salen.` },
        { id: 'menor', valor: s * (m + n), error: 'AT-NOMAX', siFuera: `Contar los trozos de cada rollo está bien. Pero con trozos de ${g / s} m no son los más largos.` },
        { id: 'producto', valor: m * n, error: 'AT-TROZOS-PRODUCTO', siFuera: `Bien los ${m} y ${n} trozos de cada rollo. Pero se suman: ${m} × ${n} = ${m * n} no.` },
      ]),
      solucion: { texto: `El trozo mide ${g} m: ${m} trozos en un rollo y ${n} en el otro.`, ecuacion: [`${A} ÷ ${g} + ${B} ÷ ${g} = ${m} + ${n} = ${m + n}`] },
    };
  }
  // Ahora tú · tipo 2: el MCD de tres rollos (los dos primeros comparten más que los tres).
  function casoTres(r) {
    const g = r.de([2, 3, 4, 5, 6]), xs = [];
    for (let i = 0; i < 60 && xs.length < 3; i++) { const k = r.ent(2, 15); if (!xs.includes(k)) xs.push(k); }
    if (xs.length < 3 || mcdL(xs) !== 1) return null;
    const [A, B, C] = xs.map(k => g * k);
    if (Math.max(A, B, C) > 120) return null;
    const d2 = mcd(A, B), M = mcmL([A, B, C]);
    if (d2 === g || C % d2 === 0 || g === 1) return null;
    const s = esPrimo(g) ? null : menorPrimo(g);
    return {
      pregunta: `Tres rollos miden ${A} m, ${B} m y ${C} m. Se cortan en trozos iguales, lo más largos posible, sin que sobre nada. ¿Cuánto mide cada trozo?`,
      datos: [D1.comun, D1.fac, D1.tres],
      opciones: opciones(g, [
        { id: 'dos', valor: d2, error: 'AT-MCD-DOS', siFuera: `Bien para los rollos de ${A} y ${B} m. Pero en el de ${C} m sobran ${C % d2} m.` },
        { id: 'mcm', valor: M, error: 'AR13', siFuera: `Buscar algo común está bien. Pero ${M} m es más largo que los rollos: ese número junta, no corta.` },
        s ? { id: 'menor', valor: g / s, error: 'AT-NOMAX', siFuera: `Bien: ${g / s} m entra exacto en los tres. Pero ${g} m también entra, y es más largo.` }
          : { id: 'uno', valor: 1, error: 'AT-NOMAX', siFuera: `Bien: 1 m entra exacto en los tres. Pero ${g} m también entra, y es más largo.` },
      ], x => `${f(x, 0)} m`),
      solucion: { texto: `Los tres son ${g} por ${yLista(xs)}, que no tienen un primo en los tres.`, ecuacion: [`${A} = ${xs[0]} × `, dv(g), SEP, `${B} = ${xs[1]} × `, dv(g), SEP, `${C} = ${xs[2]} × `, dv(g)] },
    };
  }
  // Ahora tú · tipo 3: el MCD de dos números dados en primos.
  function casoFac(r) {
    const e = [r.ent(1, 4), r.ent(1, 4), r.ent(1, 4), r.ent(1, 4)];
    if (Math.min(e[0], e[1]) < 2 && Math.min(e[2], e[3]) < 2) return null;
    if (e[0] === e[1] && e[2] === e[3]) return null;
    const [x, y] = r.de([[5, 7], [5, 11], [7, 11], [5, 13]]);
    const A = [[2, e[0]], [3, e[2]], [x, r.ent(1, 2)]], B = [[2, e[1]], [3, e[3]], [y, 1]];
    const min = [[2, Math.min(e[0], e[1])], [3, Math.min(e[2], e[3])]], max = [[2, Math.max(e[0], e[1])], [3, Math.max(e[2], e[3])]];
    const mcdN = 2 ** min[0][1] * 3 ** min[1][1];
    return {
      pregunta: `A = ${canonDe(A)} y B = ${canonDe(B)}. ¿Cuál es el MCD de A y B?`,
      datos: [D1.fac, D1.exp],
      opciones: opciones(canonDe(min), [
        { id: 'mayor', valor: canonDe(max), error: 'AT-MCD-MAYOR', siFuera: 'Bien los primos comunes, el 2 y el 3. Pero de cada uno se toma el menor exponente.' },
        { id: 'todos', valor: canonDe([...min, [x, 1], [y, 1]]), error: 'AT-MCD-TODOS', siFuera: `Bien los menores exponentes. Pero el ${x} y el ${y} no están en los dos: no son comunes.` },
        { id: 'sinexp', valor: '2 × 3', error: 'AT-MCD-SIN-EXP', siFuera: 'Bien, el 2 y el 3 son los comunes. Pero entran con su menor exponente, no una sola vez.' },
      ]),
      solucion: { texto: `Comparten el 2 y el 3; el ${x} y el ${y} están en uno solo.`, ecuacion: ['MCD = ', canonDe(min), ' = ', dv(mcdN)] },
    };
  }
  // Ahora tú · tipo 4 (San Marcos 2024-II): dos largos en metros con distinta cantidad de decimales.
  function casoUnidades(r) {
    const g = r.de([15, 25, 35, 45, 75]), m = r.ent(2, 9), n = r.ent(2, 9);
    if (mcd(m, n) !== 1 || m === n) return null;
    const A = g * m, B = g * n;   // en centímetros
    if (A % 10 !== 0 || A % 100 === 0 || B % 10 === 0 || A > 900 || B > 900) return null;
    const escA = A / 10;           // como se lee sin pasar a cm: 1,5 → 15; 2,25 → 225
    const mal = mcd(escA, B);
    if (mal === g) return null;
    const M = mcm(A, B), s = menorPrimo(g);
    return {
      pregunta: `Un rollo de cinta mide ${f(A / 100, 2)} m y otro, ${f(B / 100, 2)} m. Se cortan en trozos iguales, lo más largos posible, sin que sobre nada. ¿Cuánto mide cada trozo?`,
      datos: [D1.cm, D1.mcd, D1.fac],
      opciones: opciones(g, [
        { id: 'unidad', valor: mal, error: 'AT-MCD-UNIDAD', siFuera: `Bien quitar las comas. Pero ${f(A / 100, 2)} m son ${A} cm, no ${escA}: los dos largos van en centímetros.` },
        { id: 'menor', valor: g / s, error: 'AT-NOMAX', siFuera: `Bien: ${g / s} cm entra exacto en los dos. Pero ${g} cm también entra, y es más largo.` },
        { id: 'mcm', valor: M, error: 'AR13', siFuera: `Buscar algo común está bien. Pero ${M} cm es más largo que los rollos: ese número junta.` },
      ], x => `${f(x, 0)} cm`),
      solucion: { texto: `En centímetros: ${A} y ${B}.`, ecuacion: [`${A} = ${m} × `, dv(g), SEP, `${B} = ${n} × `, dv(g)] },
    };
  }
  // Ahora tú · tipo 5 (nivel examen): parcelas cuadradas iguales, lo más grandes posible.
  function casoParcelas(r) {
    const { g, m, n, A, B } = dosConMcd(r, [4, 6, 8, 10, 12, 15, 20], 180), s = menorPrimo(g);
    return {
      pregunta: `Un terreno rectangular de ${A} m por ${B} m se divide en parcelas cuadradas iguales, lo más grandes posible. ¿Cuántas parcelas salen?`,
      datos: [D1.mcd, D1.fac, D1.lado],
      opciones: opciones(m * n, [
        { id: 'suma', valor: m + n, error: 'AT-PARCELA-SUMA', siFuera: `Bien las ${m} y ${n} parcelas de cada lado. Pero son filas por columnas: se multiplican.` },
        { id: 'lado', valor: g, error: 'AT-PREGUNTA', siFuera: `Bien el lado de ${g} m. Pero se pide cuántas parcelas salen.` },
        { id: 'menor', valor: s * s * m * n, error: 'AT-NOMAX', siFuera: `Bien que no sobre terreno. Pero con lado ${g / s} m las parcelas no son las más grandes.` },
      ]),
      solucion: { texto: `El lado de cada parcela es el MCD, ${g} m: caben ${m} por ${n}.`, ecuacion: [`${A} ÷ ${g} = ${m}`, SEP, `${B} ÷ ${g} = ${n}`, SEP, `${m} × ${n} = ${m * n}`] },
    };
  }

  // Ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h): 5 de nivel 1, 5 de nivel 2 y 5 de nivel 3, estos con
  // cinco alternativas (A a E). Cuentas rehechas aparte, sin este archivo (scratchpad de la sesión, e7-aritmetica/
  // cuentas.py, con gcd y lcm de Python y fuerza bruta): divisores comunes de 12 y 18: 1, 2, 3, 6; MCD(20, 30) = 10;
  // MCD(40, 100) = 20; MCD(8, 15) = 1; MCD(9, 36) = 9; MCD(42, 56) = 14 y 3 + 4 = 7 trozos; MCD(36, 48, 60) = 12;
  // MCD(60, 84) = 12; MCD(2⁴ × 3² × 7, 2² × 3⁵ × 5) = 36; MCD(60, 36) = 12 y 5 × 3 = 15 cuadrados; MCD(150, 225) = 75
  // (MCD(15, 225) = 15, 25 divide a los dos, MCM = 450); MCD(84, 60) = 12, 7 × 5 parcelas y 8 × 6 = 48 estacas (24 en el
  // borde, 8 × 5 = 40); MCD(240, 300, 420) = 60 y 4 + 5 + 7 = 16 trozos (con 30 cm: 8 + 10 + 14 = 32); MCD(72, 120) = 24
  // paquetes, 120 ÷ 24 = 5 lápices (con 12 paquetes, 10); MCD(96, 126) = 6, mayor que 4 (MCD(100, 130) = 10, 126 − 96 = 30).
  // Ningún ejemplo usa la predicción (24 y 36) ni la misión (18 y 30). Las figuras muestran los rollos sin cortar.
  const EJEMPLOS_MCD = [
    { nivel: 1, titulo: 'Divisores comunes de 12 y 18',
      enunciado: '¿Cuáles son los divisores comunes de 12 y 18?',
      datos: [D1.comun],
      solucion: [{ texto: 'Los divisores de 12 son 1, 2, 3, 4, 6 y 12.' }, { texto: 'De esos, dividen exacto a 18 el 1, el 2, el 3 y el 6; con el 4 y el 12 sobra algo.' }],
      respuesta: [dv('1, 2, 3 y 6')] },
    { nivel: 1, titulo: 'El MCD de 20 y 30',
      enunciado: '¿Cuál es el MCD de 20 y 30?',
      datos: [D1.comun, D1.mcd],
      solucion: [{ texto: 'Los divisores comunes de 20 y 30 son 1, 2, 5 y 10. El mayor es 10.', ecuacion: ['20 = 2 × ', dv(10), SEP, '30 = 3 × ', dv(10)] }],
      respuesta: ['MCD(20, 30) = ', dv(10)] },
    { nivel: 1, titulo: 'Con primos: 40 y 100',
      enunciado: '¿Cuál es el MCD de 40 y 100, con sus primos?',
      datos: ['40 = 2³ × 5', '100 = 2² × 5²', D1.fac],
      solucion: [{ texto: 'Los dos tienen el 2 y el 5. Del 2, el menor exponente es 2; del 5, es 1.', ecuacion: ['MCD = 2² × 5 = ', dv(20)] }],
      respuesta: ['MCD = ', dv(20)] },
    { nivel: 1, titulo: 'Dos números PESI',
      enunciado: '¿Cuál es el MCD de 8 y 15?',
      datos: [D1.mcd, D1.pesi],
      solucion: [{ texto: '8 = 2³ y 15 = 3 × 5 no comparten ningún primo: son PESI. Solo el 1 divide exacto a los dos.' }],
      respuesta: ['MCD(8, 15) = ', dv(1)] },
    { nivel: 1, titulo: 'Uno divide al otro',
      enunciado: '¿Cuál es el MCD de 9 y 36?',
      datos: [D1.comun, D1.mcd],
      solucion: [{ texto: '9 divide exacto a 36 y a sí mismo. Ningún número mayor que 9 divide a 9.', ecuacion: ['36 = 4 × ', dv(9), SEP, '9 = 1 × ', dv(9)] }],
      respuesta: ['MCD(9, 36) = ', dv(9)] },
    { nivel: 2, titulo: 'Dos rollos sin sobrante',
      enunciado: 'Dos rollos de cinta miden 42 m y 56 m. Se cortan en trozos iguales, lo más largos posible, sin que sobre nada. ¿Cuántos trozos salen?',
      datos: [D1.mcd, D1.fac, D1.trozos],
      figura: cintasDe([42, 56]),
      solucion: [
        { texto: 'El trozo más largo que entra exacto en los dos es su MCD.', ecuacion: ['42 = 2 × 3 × 7', SEP, '56 = 2³ × 7', SEP, 'MCD = 2 × 7 = ', dv(14)] },
        { texto: 'Cuento los trozos de cada rollo y los sumo.', ecuacion: ['42 ÷ 14 + 56 ÷ 14 = 3 + 4 = 7'] },
      ],
      respuesta: ['Salen 7 trozos de ', dv('14 m')] },
    { nivel: 2, titulo: 'El MCD de tres',
      enunciado: '¿Cuál es el MCD de 36, 48 y 60?',
      datos: [D1.fac, D1.tres],
      solucion: [
        { texto: 'Descompongo los tres en primos.', ecuacion: ['36 = 2² × 3²', SEP, '48 = 2⁴ × 3', SEP, '60 = 2² × 3 × 5'] },
        { texto: 'Los tres comparten el 2 y el 3; el 5 está solo en el 60. Del 2, el menor exponente es 2; del 3, es 1.', ecuacion: ['MCD = 2² × 3 = ', dv(12)] },
      ],
      respuesta: ['MCD = ', dv(12)] },
    { nivel: 2, titulo: 'Bolsitas de dos sabores',
      enunciado: 'Doña Juana tiene 60 caramelos de fresa y 84 de limón. Los empaca en bolsitas iguales, sin mezclar sabores, con la mayor cantidad posible en cada una. ¿Cuántos caramelos lleva cada bolsita?',
      datos: [D1.comun, D1.mcd, D1.fac],
      solucion: [
        { texto: 'Lo que lleva una bolsita divide exacto a 60 y a 84: es un divisor común, y se quiere el mayor.' },
        { texto: 'Con primos: los comunes, con su menor exponente.', ecuacion: ['60 = 2² × 3 × 5', SEP, '84 = 2² × 3 × 7', SEP, 'MCD = 2² × 3 = ', dv(12)] },
      ],
      respuesta: [dv(12), ' caramelos por bolsita'] },
    { nivel: 2, titulo: 'Con exponentes grandes',
      enunciado: '¿Cuál es el MCD de los números A y B de los Datos?',
      datos: ['A = 2⁴ × 3² × 7', 'B = 2² × 3⁵ × 5', D1.fac, D1.exp],
      solucion: [
        { texto: 'A y B comparten el 2 y el 3. El 7 solo está en A y el 5 solo en B: no entran.' },
        { texto: 'Del 2, el menor exponente es 2; del 3, también 2.', ecuacion: ['MCD = 2² × 3² = ', dv(36)] },
      ],
      respuesta: ['MCD = ', dv(36)] },
    { nivel: 2, titulo: 'El cartón en cuadrados',
      enunciado: 'Un cartón de 60 cm por 36 cm se corta en cuadrados iguales, lo más grandes posible, sin que sobre cartón. ¿Cuántos cuadrados salen?',
      datos: [D1.mcd, D1.fac, D1.lado],
      solucion: [
        { texto: 'El lado del cuadrado divide exacto a 60 y a 36: es su MCD.', ecuacion: ['60 = 2² × 3 × 5', SEP, '36 = 2² × 3²', SEP, 'MCD = 2² × 3 = ', dv(12)] },
        { texto: 'Caben 60 ÷ 12 = 5 cuadrados a lo largo y 36 ÷ 12 = 3 a lo ancho.', ecuacion: ['5 × 3 = 15'] },
      ],
      respuesta: ['Salen 15 cuadrados de ', dv('12 cm')] },
    { nivel: 3, titulo: 'Metros con decimales',
      enunciado: 'Un rollo de cinta mide 1,5 m y otro, 2,25 m. Se cortan en trozos iguales, lo más largos posible, sin que sobre nada. ¿Cuánto mide cada trozo?',
      alternativas: ['15 cm', '75 cm', '25 cm', '450 cm', '0,75 cm'],
      datos: [D1.cm, D1.mcd, D1.fac],
      figura: cintasDe([150, 225], null, { rotulo: L => `${f(L / 100, 2)} m` }),
      solucion: [
        { texto: 'Paso los dos a centímetros, para trabajar con enteros: 150 cm y 225 cm.', ecuacion: ['150 = 2 × 3 × 5²', SEP, '225 = 3² × 5²', SEP, 'MCD = 3 × 5² = ', dv(75)] },
        { texto: ['Las trampas: ', letra('A'), ' no pasa 1,5 m a centímetros; ', letra('C'), ' es un divisor común más chico; ', letra('D'), ' es el menor múltiplo de los dos; ', letra('E'), ' deja 0,75, en metros.'] },
      ],
      respuesta: [letra('B'), ': ', dv('75 cm')] },
    { nivel: 3, titulo: 'Estacas en el terreno',
      enunciado: 'Un terreno rectangular de 84 m por 60 m se divide en parcelas cuadradas iguales, lo más grandes posible. Se pone una estaca en cada esquina de cada parcela. ¿Cuántas estacas se usan?',
      alternativas: ['35', '12', '24', '48', '40'],
      datos: [D1.mcd, D1.fac, D1.lado],
      solucion: [
        { texto: 'El lado de la parcela es el MCD de 84 y 60.', ecuacion: ['84 = 2² × 3 × 7', SEP, '60 = 2² × 3 × 5', SEP, 'MCD = 2² × 3 = ', dv(12)] },
        { texto: 'Van 84 ÷ 12 = 7 parcelas a lo largo y 60 ÷ 12 = 5 a lo ancho. Las estacas van en las rayas: una más por lado, 8 y 6.', ecuacion: ['8 × 6 = 48'] },
        { texto: ['Las trampas: ', letra('A'), ' cuenta las parcelas, 7 × 5; ', letra('B'), ' es el lado; ', letra('C'), ' son solo las del borde; ', letra('E'), ' olvida una fila de estacas, 8 × 5.'] },
      ],
      respuesta: [letra('D'), ': 48 estacas'] },
    { nivel: 3, titulo: 'Tres tablas',
      enunciado: 'Un carpintero tiene tres tablas de 2,4 m, 3 m y 4,2 m. Las corta en trozos iguales, lo más largos posible, sin que sobre madera. ¿Cuántos trozos obtiene?',
      alternativas: ['16', '60', '9', '32', '140'],
      datos: [D1.cm, D1.fac, D1.tres, D1.trozos],
      solucion: [
        { texto: 'En centímetros: 240, 300 y 420. El trozo es su MCD.', ecuacion: ['240 = 2⁴ × 3 × 5', SEP, '300 = 2² × 3 × 5²', SEP, '420 = 2² × 3 × 5 × 7', SEP, 'MCD = 2² × 3 × 5 = ', dv(60)] },
        { texto: 'Trozos de 60 cm: 4, 5 y 7.', ecuacion: ['4 + 5 + 7 = 16'] },
        { texto: ['Las trampas: ', letra('B'), ' es el largo del trozo; ', letra('C'), ' olvida la tabla de 4,2 m; ', letra('D'), ' usa trozos de 30 cm, más cortos; ', letra('E'), ' multiplica 4 × 5 × 7.'] },
      ],
      respuesta: [letra('A'), ': 16 trozos'] },
    { nivel: 3, titulo: 'Paquetes iguales',
      enunciado: 'Se reparten 72 cuadernos y 120 lápices en paquetes iguales, todos con lo mismo, y se arma la mayor cantidad posible de paquetes. ¿Cuántos lápices lleva cada paquete?',
      alternativas: ['24', '3', '5', '360', '10'],
      datos: [D1.comun, D1.mcd, D1.fac],
      solucion: [
        { texto: 'La cantidad de paquetes divide exacto a 72 y a 120, y se quiere la mayor: es el MCD.', ecuacion: ['72 = 2³ × 3²', SEP, '120 = 2³ × 3 × 5', SEP, 'MCD = 2³ × 3 = ', dv(24)] },
        { texto: 'Son 24 paquetes; cada uno lleva 120 ÷ 24 = 5 lápices y 72 ÷ 24 = 3 cuadernos.' },
        { texto: ['Las trampas: ', letra('A'), ' son los paquetes; ', letra('B'), ', los cuadernos de cada paquete; ', letra('D'), ' es el menor múltiplo de los dos; ', letra('E'), ' arma solo 12 paquetes.'] },
      ],
      respuesta: [letra('C'), ': 5 lápices'] },
    { nivel: 3, titulo: 'Sobran 4 en los dos',
      enunciado: 'Al dividir 100 y 130 entre un mismo número, en los dos sobran 4. ¿Cuál es el mayor número posible?',
      alternativas: ['10', '3', '4', '30', '6'],
      datos: [D1.mcd, D1.fac, 'Si al dividir un número entre otro sobra r, el número menos r es múltiplo del divisor', 'El resto es menor que el divisor'],
      solucion: [
        { texto: 'Si sobran 4, el divisor divide exacto a 100 − 4 = 96 y a 130 − 4 = 126. El mayor que lo hace es su MCD.', ecuacion: ['96 = 2⁵ × 3', SEP, '126 = 2 × 3² × 7', SEP, 'MCD = 2 × 3 = ', dv(6)] },
        { texto: '6 es mayor que 4, así que el resto 4 sí puede quedar: 100 = 6 × 16 + 4 y 130 = 6 × 21 + 4.' },
        { texto: ['Las trampas: ', letra('A'), ' no quita el 4; ', letra('B'), ' divide a 96 y a 126, pero no es el mayor; ', letra('C'), ' es el resto; ', letra('D'), ' es 130 − 100.'] },
      ],
      respuesta: [letra('E'), ': ', dv(6)] },
  ];

  const trozo = {
    id: 'mcd-cintas',
    titulo: 'MCD: el trozo más largo',
    pregunta: '¿Qué trozo corta dos cintas sin que sobre nada?',
    temas: ['Máximo común divisor', 'Problemas de aplicación'],
    pieza: CI,
    aprendizaje: 'El MCD es el mayor que divide exacto a dos números: el trozo más largo sin sobrante. Lleva los primos comunes con su menor exponente.',
    actividad: 'Cambiar el largo del trozo y ver cuánto sobra en cada rollo de cinta.',
    // Lee: los rollos, el divisor común con un caso que no es la predicción (14 y 20) y qué mirar. No dice cuál es el
    // trozo más largo de ningún par del juego ni de la predicción.
    lee: {
      tarjetas: [
        { titulo: 'Los rollos de la fiesta', texto: 'Para la fiesta de la promoción hay dos rollos de cinta, uno de 14 m y otro de 20 m. Se van a cortar en trozos iguales, todos del mismo largo, para hacer moños.',
          pieza: CI, dibujo: { datos: rollos([14, 20]), estado: {} } },
        { titulo: 'Un trozo para los dos', texto: ['Un trozo de ', dv('2 m'), ' entra exacto en los dos: 7 veces en 14 y 10 veces en 20. Por eso 2 es un divisor común de 14 y 20. Uno de 3 m no sirve: en los dos sobran 2 m.'],
          ecuacion: ['14 = 7 × ', dv(2), SEP, '20 = 10 × ', dv(2)],
          pieza: CI, dibujo: { datos: rollos([14, 20], 3), estado: {} } },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cambiar el largo del trozo. Mira cuánto sobra en cada rollo: un trozo puede entrar exacto en uno y dejar un pedazo en el otro.' },
      ],
    },
    ejemplos: EJEMPLOS_MCD,
    juega: {
      pieza: CI,
      consigna: 'La promoción corta dos rollos de cinta en trozos iguales para los moños. No quiere que sobre cinta en ningún rollo.',
      mision: {
        // Una sola manera en la grilla: con 18 y 30, solo el trozo de 6 m (la prueba lo recorre).
        texto: 'Con los rollos de 18 m y 30 m, busca el trozo más largo sin sobrante.',
        logrado: v => v.par === '18-30' && v.t === 6,
        bien: '6 m: 3 trozos en un rollo y 5 en el otro. Ninguno más largo sirve.',
      },
      voz: 'Mira lo que sobra en los dos rollos, no solo en uno.',
      leyenda: [
        { s: dv('trozo'), t: 'el largo de cada trozo' },
        { s: sb('sobra'), t: 'lo que queda, más corto que un trozo' },
      ],
      controles: [
        { id: 'par', etiqueta: 'Rollos', opciones: [{ valor: '16-40', texto: '16 m y 40 m' }, { valor: '18-30', texto: '18 m y 30 m' }, { valor: '20-28', texto: '20 m y 28 m' }] },
        { id: 't', etiqueta: 'Trozo', color: 'c-i', min: 1, max: 12, paso: 1, inicio: 5, unidad: 'm', decimales: 0 },
      ],
      // Una sola escala para los tres pares (el más largo mide 40 m): cambiar de par no cambia la regla.
      dibujo: v => { const [a, b] = v.par.split('-').map(Number); return { datos: rollos([a, b], v.t, { max: 40 }), estado: {} }; },
      lectura: v => {
        const [a, b] = v.par.split('-').map(Number), ra = a % v.t, rb = b % v.t;
        if (!ra && !rb) return ['Trozos de ', dv(`${v.t} m`), ': no sobra nada en ninguno'];
        return ['Trozos de ', dv(`${v.t} m`), ': sobran ', sb(`${ra} m`), ' y ', sb(`${rb} m`)];
      },
      minimo: 3,
    },
    predice: {
      pieza: CI,
      pregunta: 'Otros dos rollos miden 24 m y 36 m. Se cortan en trozos iguales, lo más largos posible, sin que sobre nada. ¿Cuánto mide cada trozo?',
      datos: ['Rollos de 24 m y de 36 m; cada trozo, un número entero de metros'],
      voz: 'Piensa qué trozo entra exacto en los dos rollos.',
      opciones: [
        { id: 'c', texto: '12 m', correcta: true },
        { id: 'mcm', texto: '72 m', error: 'AR13', siFuera: 'Buscar un número común está bien. Pero 72 m es más largo que los rollos: ese número junta, no corta.' },
        { id: 'menor', texto: '6 m', error: 'AT-NOMAX', siFuera: 'Bien: 6 m entra exacto en los dos. Pero 12 m también entra, y es más largo.' },
        { id: 'rollo', texto: '24 m', error: 'AT-MENOR', siFuera: 'Bien para el rollo de 24 m. Pero en el de 36 m sobran 12 m.' },
      ],
      dibujo: { datos: rollos([24, 36]), estado: {} },
      revelar: { datos: rollos([24, 36], 12), estado: {} },
      coincide: 'Coincide: 12 m entra 2 veces en 24 y 3 veces en 36, y ningún trozo más largo lo hace.',
      noCoincide: 'Revisemos qué trozos entran exacto en los dos rollos.',
    },
    mira: {
      pieza: CI,
      datos: Object.assign(rollos([24, 36]), { pasos: [6, 12, 18, 12, 12].map(t => ({ cintas: rollos([24, 36], t).cintas })) }),
      voz: 'Prueba trozos y mira si sobra algo.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Un trozo de 6 m entra exacto en los dos: es un divisor común.', ecuacion: ['24 = 4 × ', dv(6), SEP, '36 = 6 × ', dv(6)] },
        { estado: { paso: 1 }, texto: 'Uno de 12 m también entra, y es más largo.', ecuacion: ['24 = 2 × ', dv(12), SEP, '36 = 3 × ', dv(12)] },
        { estado: { paso: 2 }, texto: 'Con 18 m ya sobra: en el rollo de 24 quedan 6 m.', ecuacion: ['24 = 1 × 18 + ', sb(6)] },
        { estado: { paso: 3 }, texto: 'Los divisores comunes de 24 y 36: 1, 2, 3, 4, 6 y 12.', ecuacion: ['MCD(24, 36) = ', dv(12)] },
        { estado: { paso: 4 }, texto: 'Con primos: los que comparten, cada uno con su menor exponente.', ecuacion: ['24 = 2³ × 3', SEP, '36 = 2² × 3²', SEP, 'MCD = 2² × 3 = ', dv(12)] },
      ],
    },
    regla: {
      texto: 'El MCD de dos números, A y B, o de tres, es el mayor que divide exacto a todos. Con primos: los comunes, cada uno con su menor exponente.',
      ecuacion: ['24 = 2³ × 3', SEP, '36 = 2² × 3²', SEP, { llave: ['MCD(24, 36) = 2² × 3'], nota: 'menor exponente' }, ' = ', dv(12)],
      condicion: 'enteros positivos. Si no comparten ningún primo (son PESI), el MCD es 1; si A divide a B, el MCD es A.',
      voz: 'El que entra en todos, y el más grande.',
      dibujo: { pieza: CI, datos: rollos([24, 36], 12), estado: {} },
    },
    // Así se resuelve: cuántas bolsitas arma doña Juana con dos sabores. «Ahora tú» pide el trozo de dos o de tres rollos,
    // cuántos trozos salen, el MCD de dos números en primos, largos con decimales y parcelas cuadradas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), { g, m, n, A, B } = dosConMcd(r, [4, 6, 8, 9, 10, 12]);
        const cA = String(A), cB = String(B);
        return {
          enunciado: `Doña Juana tiene ${A} caramelos de fresa y ${B} de limón. Los empaca en bolsitas iguales, sin mezclar sabores, con la mayor cantidad posible en cada una. ¿Cuántas bolsitas arma en total?`,
          datos: [D1.comun, D1.mcd, D1.fac],
          pasos: [
            { tipo: 'pide', texto: 'Piden cuántas bolsitas arma en total, no cuántos caramelos lleva cada una.' },
            { tipo: 'datos', texto: `Hay ${cA} de fresa y ${cB} de limón. Todas las bolsitas llevan lo mismo y no se mezclan sabores.` },
            { tipo: 'regla', texto: 'Lo que lleva una bolsita divide exacto a los dos montones: es un divisor común. Como se quiere lo más posible, es el MCD.' },
            { tipo: 'cuentas', texto: 'Descompongo en primos y tomo los comunes, cada uno con su menor exponente.',
              ecuacion: [`${A} = ${canon(A)}`, SEP, `${B} = ${canon(B)}`, SEP, `MCD = ${canon(g)}${factores(g).length > 1 || factores(g)[0][1] > 1 ? ` = ${g}` : ''}`] },
            { tipo: 'cuentas', texto: 'Cuento las bolsitas de cada sabor y las sumo.', ecuacion: [`${A} ÷ ${g} + ${B} ÷ ${g} = ${m} + ${n} = ${m + n}`] },
            { tipo: 'sentido', texto: `Comprueba: ${m} y ${n} son PESI, así que no hay bolsitas con más caramelos que ${g}.` },
          ],
          respuesta: `Arma ${m + n} bolsitas de ${g} caramelos.`,
        };
      },
    },
    ahoraTu: {
      voz: '¿Te piden el trozo o cuántos trozos?',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 6;
        return conCuatro([casoTrozo, casoTotal, casoTres, casoFac, casoUnidades, casoParcelas][tipo], r);
      },
    },
  };

  // ---------- Idea 2 (rehecha, 19 nov): el MCM es el primer boleto con los dos premios ----------
  // Propuesta §1 a §7. Conserva el id `mcm-coinciden` (y las mesas `ladrillos-cubo` y `tres-combis`).
  // Objeto: la plancha de la rifa de la promoción con dos premios (arit-boletos, bloque «premios», de prueba): caramelo
  // para los múltiplos de un número y gaseosa para los de otro. Cambia: cada cuántos boletos va cada premio. ·
  // Permanece: la plancha del 1 al 60. · Progresa: los de caramelo → los de gaseosa → los que tienen los dos. · Se
  // reserva: 12 y 18 (la predicción, en la rifa grande). · Debe verse: los boletos con los dos premios son los múltiplos
  // del primero de ellos.
  // Errores (AR13, parcial; los demás, hipótesis): AR13 usa el MCD donde va el MCM · AT-PRODUCTO multiplica los dos
  // números · AT-SUMA suma los dos periodos · AT-MCM-DOS deja fuera al tercero · AT-MCM-MENOR toma el menor exponente ·
  // AT-MCM-COMUNES deja fuera los primos que no comparten · AT-CUENTA-HOY no cuenta la coincidencia de partida (llega una
  // tarde) · AT-PRIMERA responde la segunda coincidencia cuando se pide otra · AT-SIN-INICIAL no cuenta las tomas del
  // comienzo.
  const BO = 'arit-boletos';
  const D2 = {
    comun: 'Un múltiplo común de A y B es múltiplo de los dos: A y B lo dividen exacto',
    mcm: 'MCM(A, B): el menor múltiplo común de A y B, sin contar el 0',
    fac: 'Con primos: el MCM lleva todos los primos que aparecen, cada uno con su mayor exponente',
    otros: 'Los múltiplos comunes de A y B son los múltiplos de su MCM',
    tres: 'El MCM de tres números es el menor múltiplo de los tres',
    exp: 'El exponente dice cuántas veces entra el primo: 2³ = 2 × 2 × 2',
    hora: '1 h = 60 min',
    partida: 'Si coinciden al empezar, esa es la primera vez que coinciden',
    tomas: 'Tomas de una medicina, contando la primera: las horas ÷ cada cuántas horas, más 1',
  };
  // La plancha con dos premios: caramelo (círculo) cada a, gaseosa (cuadrito) cada b; con los dos, violeta.
  const plancha = (a, b, o = {}) => Object.assign({ desde: 1, hasta: o.hasta || 60, columnas: 10, premios: [a, b], cordeles: false,
    letrero: [['Caramelo cada '], [String(a), null, 700], [' · gaseosa cada '], [String(b), null, 700]] }, o.extra || {});
  const comunesHasta = (a, b, n) => { const m = mcm(a, b), out = []; for (let x = m; x <= n; x += m) out.push(x); return out; };
  const hora = (h0, min) => { const t = h0 * 60 + min, h = Math.floor(t / 60) % 24, mm = t % 60; return `${h}:${String(mm).padStart(2, '0')}`; };
  // Pares que ya usan el juego, la predicción y los ejemplos.
  const USADOS2 = new Set(['4-6', '12-18', '4-10', '8-12', '5-7', '6-18', '10-12', '15-20', '10-15', '6-15', '9-12']);

  // Ahora tú · tipo 0: el primer boleto con los dos premios (dos números que comparten un primo).
  function casoBoleto(r) {
    const a = r.ent(4, 16), b = r.ent(a + 1, 20), g = mcd(a, b), M = mcm(a, b);
    if (g === 1 || b % a === 0 || USADOS2.has(`${a}-${b}`)) return null;
    return {
      pregunta: `En una rifa, ganan caramelo los boletos múltiplos de ${a} y gaseosa los múltiplos de ${b}. ¿Cuál es el primer boleto que gana los dos premios?`,
      datos: [D2.comun, D2.mcm, D2.fac],
      opciones: opciones(M, [
        { id: 'mcd', valor: g, error: 'AR13', siFuera: `Buscar lo que comparten está bien. Pero el ${g} no es múltiplo de ${a}: no gana caramelo.` },
        { id: 'producto', valor: a * b, error: 'AT-PRODUCTO', siFuera: `Bien: el ${a * b} es múltiplo de los dos. Pero el ${M} también lo es, y llega antes.` },
        { id: 'suma', valor: a + b, error: 'AT-SUMA', siFuera: `Juntar los dos números está bien, pero sumarlos no: ${a + b} no es múltiplo de ${a}.` },
      ]),
      solucion: { texto: `Todos los primos de ${a} y de ${b}, cada uno con su mayor exponente.`, ecuacion: [`${a} = ${canon(a)}`, SEP, `${b} = ${canon(b)}`, SEP, `MCM = ${canon(M)} = `, ml(M)] },
    };
  }
  // Ahora tú · tipo 1: dos alarmas que vuelven a sonar juntas, en horas y minutos.
  function casoHora(r) {
    const xs = [6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 40, 45], a = r.de(xs), b = r.de(xs.filter(x => x > a)), g = mcd(a, b), M = mcm(a, b);
    if (!b || g === 1 || b % a === 0 || M > 180 || a * b > 600 || USADOS2.has(`${a}-${b}`)) return null;
    const h0 = r.de([6, 7, 8, 9]);
    return {
      pregunta: `Dos alarmas sonaron juntas a las ${h0}:00. Una suena cada ${a} minutos y la otra cada ${b}. ¿A qué hora vuelven a sonar juntas?`,
      datos: [D2.mcm, D2.fac, D2.hora],
      opciones: opciones(hora(h0, M), [
        { id: 'mcd', valor: hora(h0, g), error: 'AR13', siFuera: `Buscar lo común está bien. Pero ${g} min divide a los dos: a esa hora no suena ninguna.` },
        { id: 'producto', valor: hora(h0, a * b), error: 'AT-PRODUCTO', siFuera: `Bien: a esa hora suenan juntas. Pero ya lo hicieron antes, a los ${M} min.` },
        { id: 'suma', valor: hora(h0, a + b), error: 'AT-SUMA', siFuera: `Juntar los dos tiempos está bien, pero sumarlos no: ${a + b} min no es múltiplo de ${a}.` },
      ]),
      solucion: { texto: `Vuelven a sonar juntas a los ${M} min, el MCM.`, ecuacion: [`${a} = ${canon(a)}`, SEP, `${b} = ${canon(b)}`, SEP, `MCM = ${canon(M)} = `, ml(`${M} min`)] },
    };
  }
  // Ahora tú · tipo 2: tres pastillas que se toman juntas otra vez.
  function casoTresP(r) {
    const xs = [2, 3, 4, 6, 8, 12], a = r.de(xs), b = r.de(xs), c = r.de(xs);
    if (!(a < b && b < c)) return null;
    const M = mcmL([a, b, c]), M2 = mcm(a, b);
    if (M === c || M2 % c === 0 || a * b * c === M) return null;
    return {
      pregunta: `Tres pastillas se toman cada ${a}, cada ${b} y cada ${c} horas. Hoy a las 6:00 se tomaron las tres juntas. ¿Dentro de cuántas horas vuelven a tomarse juntas?`,
      datos: [D2.comun, D2.fac, D2.tres],
      opciones: opciones(M, [
        { id: 'producto', valor: a * b * c, error: 'AT-PRODUCTO', siFuera: `Bien: a las ${a * b * c} h coinciden las tres. Pero ya lo hicieron antes, a las ${M} h.` },
        { id: 'dos', valor: M2, error: 'AT-MCM-DOS', siFuera: `Bien para las dos primeras. Pero a las ${M2} h no toca la de cada ${c} horas.` },
        { id: 'mcd', valor: mcdL([a, b, c]), error: 'AR13', siFuera: `Pensar en lo común está bien. Pero ${mcdL([a, b, c])} divide a los tres: no es múltiplo de ellos.` },
      ], x => `${x} h`),
      solucion: { texto: `El menor múltiplo de ${a}, ${b} y ${c}.`, ecuacion: [`${a} = ${canon(a)}`, SEP, `${b} = ${canon(b)}`, SEP, `${c} = ${canon(c)}`, SEP, `MCM = ${canon(M)} = `, ml(M)] },
    };
  }
  // Ahora tú · tipo 3: el MCM de dos números dados en primos.
  function casoFacM(r) {
    const e = [r.ent(1, 4), r.ent(1, 4), r.ent(1, 4), r.ent(1, 4)];
    if (e[0] === e[1] && e[2] === e[3]) return null;
    const [x, y] = r.de([[5, 7], [5, 11], [7, 11], [5, 13]]);
    const ex = r.ent(1, 2);
    const A = [[2, e[0]], [3, e[2]], [x, ex]], B = [[2, e[1]], [3, e[3]], [y, 1]];
    const mx = [[2, Math.max(e[0], e[1])], [3, Math.max(e[2], e[3])], [x, ex], [y, 1]];
    const mn = [[2, Math.min(e[0], e[1])], [3, Math.min(e[2], e[3])], [x, ex], [y, 1]];
    const suma = [[2, e[0] + e[1]], [3, e[2] + e[3]], [x, ex], [y, 1]];
    return {
      pregunta: `A = ${canonDe(A)} y B = ${canonDe(B)}. ¿Cuál es el MCM de A y B?`,
      datos: [D2.fac, D2.exp],
      opciones: opciones(canonDe(mx), [
        { id: 'menor', valor: canonDe(mn), error: 'AT-MCM-MENOR', siFuera: 'Bien todos los primos. Pero de cada uno el MCM toma el mayor exponente, no el menor.' },
        { id: 'comunes', valor: canonDe(mx.slice(0, 2)), error: 'AT-MCM-COMUNES', siFuera: `Bien los mayores exponentes. Pero el MCM también lleva el ${x} y el ${y}, aunque estén en uno solo.` },
        { id: 'suma', valor: canonDe(suma), error: 'AT-PRODUCTO', siFuera: 'Bien juntar todos los primos. Pero sumar los exponentes es multiplicar A × B: el MCM toma el mayor.' },
      ]),
      solucion: { texto: `Entran el 2, el 3, el ${x} y el ${y}, cada uno con su mayor exponente.`, ecuacion: ['MCM = ', ml(canonDe(mx))] },
    };
  }
  // Ahora tú · tipo 4 (San Marcos 2026-II): la tercera coincidencia, contando la de hoy.
  function casoTercera(r) {
    const a = r.ent(4, 15), b = r.ent(a + 1, 18), g = mcd(a, b), M = mcm(a, b);
    if (g === 1 || b % a === 0 || M > 90 || USADOS2.has(`${a}-${b}`)) return null;
    const k = r.de([3, 4]);
    const ord = { 3: 'tercera', 4: 'cuarta' }[k];
    return {
      pregunta: `Dos camiones de reparto llegan juntos hoy al mercado. Uno llega cada ${a} días y el otro cada ${b}. ¿Dentro de cuántos días llegan juntos por ${ord} vez, contando la de hoy?`,
      datos: [D2.mcm, D2.otros, D2.partida],
      opciones: opciones((k - 1) * M, [
        { id: 'hoy', valor: k * M, error: 'AT-CUENTA-HOY', siFuera: `Bien: coinciden cada ${M} días. Pero la de hoy ya es la primera vez: faltan ${k - 1} más.` },
        { id: 'primera', valor: M, error: 'AT-PRIMERA', siFuera: `Bien: a los ${M} días vuelven a coincidir. Pero esa es la segunda vez, contando la de hoy.` },
        { id: 'producto', valor: (k - 1) * a * b, error: 'AT-PRODUCTO', siFuera: `Bien contar ${k - 1} coincidencias más. Pero coinciden cada ${M} días, no cada ${a * b}.` },
      ], x => `${x} días`),
      solucion: { texto: `Hoy es la primera vez; después coinciden cada ${M} días, el MCM.`, ecuacion: [`${k - 1} × ${M} = `, ml(`${(k - 1) * M} días`)] },
    };
  }
  // Ahora tú · tipo 5 (San Marcos 2025-I): las tomas de tres medicinas hasta la tercera coincidencia.
  function casoTomas(r) {
    const xs = [2, 3, 4, 6, 8, 12], a = r.de(xs), b = r.de(xs), c = r.de(xs);
    if (!(a < b && b < c)) return null;
    const M = mcmL([a, b, c]);
    if (M > 24 || M === c) return null;
    const T = 2 * M, tomas = h => h / a + h / b + h / c + 3;
    const h0 = r.de([6, 7, 8]);
    return {
      pregunta: `Un paciente toma tres medicinas: cada ${a}, cada ${b} y cada ${c} horas. A las ${h0}:00 tomó las tres. Hasta la tercera vez que las toma juntas, contando esa, ¿cuántas tomas hace?`,
      datos: [D2.tres, D2.otros, D2.partida, D2.tomas],
      opciones: opciones(tomas(T), [
        { id: 'inicial', valor: tomas(T) - 3, error: 'AT-SIN-INICIAL', siFuera: `Bien las ${T} horas y contar cada medicina. Pero falta la toma de las ${h0}:00 de cada una.` },
        { id: 'hoy', valor: tomas(3 * M), error: 'AT-CUENTA-HOY', siFuera: `Bien contar las tomas. Pero ${3 * M} horas llega a la cuarta vez juntas.` },
        { id: 'segunda', valor: tomas(M), error: 'AT-PRIMERA', siFuera: `Bien contar las de las ${h0}:00. Pero con ${M} horas llegas solo a la segunda vez juntas.` },
      ]),
      solucion: { texto: `Juntas cada ${M} h: la tercera vez es ${T} h después. Tomas de cada una: horas ÷ periodo + 1.`,
        ecuacion: [`${T / a + 1} + ${T / b + 1} + ${T / c + 1} = ${tomas(T)}`] },
    };
  }

  // Ejemplos resueltos (idea 2). Cuentas rehechas aparte (cuentas.py): múltiplos comunes de 4 y 6 menores que 40: 12,
  // 24, 36; MCM(8, 12) = 24; MCM(5, 7) = 35; MCM(6, 18) = 18; MCM(12, 10) = 60; MCM(15, 20) = 60 → 10:00; MCM(6, 8, 10) =
  // 120; MCM(10, 15) = 30 y 3 × 2 = 6 losetas; MCM(2³ × 3² × 5, 2 × 3⁴) = 3 240; del 1 al 100, múltiplos de 30: 3;
  // MCM(9, 12) = 36, tercera vez 72 (108, 216 = 2 × 9 × 12, MCD 3); MCM(4, 6, 8) = 24, 48 h: 13 + 9 + 7 = 29 tomas (26 sin
  // las iniciales; 7 + 5 + 4 = 16 hasta la segunda; 19 + 13 + 10 = 42 hasta la cuarta); MCM(60, 80, 90) = 720 s: 12, 9 y
  // 8 vueltas (MCM(60, 80) = 240: 4); MCM(6, 9, 12) = 36 y 6 × 4 × 3 = 72 ladrillos (6 + 4 + 3 = 13, 6 × 9 × 12 = 648);
  // MCM(10, 12, 15) = 60: 6:00, 7:00, 8:00 y 9:00 (MCM(10, 15) = 30: 7 veces; cada 10: 19). Ninguno usa la predicción
  // (12 y 18) ni la misión (4 y 10).
  const EJEMPLOS_MCM = [
    { nivel: 1, titulo: 'Múltiplos comunes de 4 y 6',
      enunciado: '¿Cuáles son los múltiplos comunes de 4 y 6 menores que 40?',
      datos: [D2.comun],
      solucion: [{ texto: 'Los múltiplos de 6 menores que 40 son 6, 12, 18, 24, 30 y 36. De esos, son múltiplos de 4 el 12, el 24 y el 36.' }],
      respuesta: [ml('12, 24 y 36')] },
    { nivel: 1, titulo: 'El MCM de 8 y 12',
      enunciado: '¿Cuál es el MCM de 8 y 12?',
      datos: [D2.comun, D2.mcm],
      solucion: [{ texto: 'Los múltiplos de 12 son 12, 24, 36… El 12 no es múltiplo de 8; el 24 sí.', ecuacion: [ml(24), ' = 3 × 8 = 2 × 12'] }],
      respuesta: ['MCM(8, 12) = ', ml(24)] },
    { nivel: 1, titulo: 'Dos primos distintos',
      enunciado: '¿Cuál es el MCM de 5 y 7?',
      datos: [D2.mcm, D2.fac],
      solucion: [{ texto: '5 y 7 son primos distintos: el MCM lleva los dos, cada uno una vez.', ecuacion: ['MCM = 5 × 7 = ', ml(35)] }],
      respuesta: ['MCM(5, 7) = ', ml(35)] },
    { nivel: 1, titulo: 'Uno es múltiplo del otro',
      enunciado: '¿Cuál es el MCM de 6 y 18?',
      datos: [D2.comun, D2.mcm],
      solucion: [{ texto: '18 ya es múltiplo de 6 y de sí mismo. Ningún número menor que 18 es múltiplo de 18.', ecuacion: [ml(18), ' = 3 × 6 = 1 × 18'] }],
      respuesta: ['MCM(6, 18) = ', ml(18)] },
    { nivel: 1, titulo: 'Con primos: 12 y 10',
      enunciado: '¿Cuál es el MCM de 12 y 10, con sus primos?',
      datos: ['12 = 2² × 3', '10 = 2 × 5', D2.fac],
      solucion: [{ texto: 'Entran el 2, el 3 y el 5. Del 2, el mayor exponente es 2.', ecuacion: ['MCM = 2² × 3 × 5 = ', ml(60)] }],
      respuesta: ['MCM = ', ml(60)] },
    { nivel: 2, titulo: 'Las dos alarmas',
      enunciado: 'Dos alarmas sonaron juntas a las 9:00. Una suena cada 15 minutos y la otra cada 20. ¿A qué hora vuelven a sonar juntas?',
      datos: [D2.mcm, D2.fac, D2.hora],
      solucion: [
        { texto: 'Vuelven a sonar juntas cuando pasa un múltiplo de 15 y de 20: el primero es el MCM.', ecuacion: ['15 = 3 × 5', SEP, '20 = 2² × 5', SEP, 'MCM = 2² × 3 × 5 = ', ml('60 min')] },
        { texto: '60 min es 1 h después de las 9:00.' },
      ],
      respuesta: ['A las ', ml('10:00')] },
    { nivel: 2, titulo: 'El MCM de tres',
      enunciado: '¿Cuál es el MCM de 6, 8 y 10?',
      datos: [D2.fac, D2.tres],
      solucion: [
        { texto: 'Descompongo los tres en primos.', ecuacion: ['6 = 2 × 3', SEP, '8 = 2³', SEP, '10 = 2 × 5'] },
        { texto: 'Entran el 2, el 3 y el 5; del 2, el mayor exponente es 3.', ecuacion: ['MCM = 2³ × 3 × 5 = ', ml(120)] },
      ],
      respuesta: ['MCM = ', ml(120)] },
    { nivel: 2, titulo: 'El cuadrado de losetas',
      enunciado: 'Con losetas de 10 cm por 15 cm, todas en la misma posición, se arma el cuadrado más pequeño posible. ¿Cuántas losetas se usan?',
      datos: [D2.mcm, D2.fac],
      solucion: [
        { texto: 'El lado del cuadrado es múltiplo de 10, a lo largo, y de 15, a lo ancho: es el MCM.', ecuacion: ['10 = 2 × 5', SEP, '15 = 3 × 5', SEP, 'MCM = 2 × 3 × 5 = ', ml('30 cm')] },
        { texto: 'Caben 30 ÷ 10 = 3 losetas a lo largo y 30 ÷ 15 = 2 a lo ancho.', ecuacion: ['3 × 2 = 6'] },
      ],
      respuesta: ['6 losetas; el lado mide ', ml('30 cm')] },
    { nivel: 2, titulo: 'Con exponentes grandes',
      enunciado: '¿Cuál es el MCM de los números A y B de los Datos?',
      datos: ['A = 2³ × 3² × 5', 'B = 2 × 3⁴', D2.fac, D2.exp],
      solucion: [
        { texto: 'Entran el 2, el 3 y el 5, aunque el 5 esté solo en A.' },
        { texto: 'Del 2, el mayor exponente es 3; del 3, es 4.', ecuacion: ['MCM = 2³ × 3⁴ × 5', SEP, '8 × 81 × 5 = ', ml(3240)] },
      ],
      respuesta: ['MCM = ', ml(3240)] },
    { nivel: 2, titulo: 'Boletos con los dos premios',
      enunciado: 'En una rifa de 100 boletos, ganan caramelo los múltiplos de 6 y gaseosa los múltiplos de 15. ¿Cuántos boletos ganan los dos premios?',
      datos: [D2.mcm, D2.otros, 'Del 1 al 100, los múltiplos de un número son tantos como el cociente entero de 100 ÷ ese número'],
      figura: { pieza: BO, datos: plancha(6, 15, { hasta: 100, extra: { marcarPremios: false } }), estado: {} },
      solucion: [
        { texto: 'Los que ganan los dos son los múltiplos comunes de 6 y 15: los múltiplos de su MCM.', ecuacion: ['6 = 2 × 3', SEP, '15 = 3 × 5', SEP, 'MCM = 2 × 3 × 5 = ', ml(30)] },
        { texto: 'Del 1 al 100 son el 30, el 60 y el 90.', ecuacion: ['100 = 3 × ', ml(30), ' + ', sb(10)] },
      ],
      respuesta: ['Ganan 3 boletos'] },
    { nivel: 3, titulo: 'La tercera llegada',
      enunciado: 'Dos camiones llegan juntos hoy al mercado de Juliaca. Uno llega cada 9 días y el otro cada 12. ¿Dentro de cuántos días llegarán juntos por tercera vez, contando la de hoy?',
      alternativas: ['72', '36', '108', '216', '3'],
      datos: [D2.mcm, D2.otros, D2.partida],
      solucion: [
        { texto: 'Coinciden cada MCM(9, 12) días.', ecuacion: ['9 = 3²', SEP, '12 = 2² × 3', SEP, 'MCM = 2² × 3² = ', ml(36)] },
        { texto: 'Hoy es la primera vez; la segunda, a los 36 días; la tercera, a los 72.', ecuacion: ['2 × 36 = ', ml(72)] },
        { texto: ['Las trampas: ', letra('B'), ' es la segunda vez; ', letra('C'), ' no cuenta la de hoy; ', letra('D'), ' usa 9 × 12 en vez del MCM; ', letra('E'), ' es el MCD.'] },
      ],
      respuesta: [letra('A'), ': ', ml('72 días')] },
    { nivel: 3, titulo: 'Tomas de tres medicinas',
      enunciado: 'Un paciente toma tres medicinas: cada 4, cada 6 y cada 8 horas. A las 7:00 tomó las tres. Hasta la tercera vez que las toma juntas, contando la de las 7:00, ¿cuántas tomas hace?',
      alternativas: ['26', '16', '29', '42', '48'],
      datos: [D2.tres, D2.otros, D2.partida, D2.tomas],
      solucion: [
        { texto: 'Las toma juntas cada MCM(4, 6, 8) = 24 horas. La tercera vez es 48 horas después de las 7:00.', ecuacion: ['MCM = 2³ × 3 = ', ml(24), SEP, '2 × 24 = ', ml(48)] },
        { texto: 'En 48 horas, contando la primera: 48 ÷ 4 + 1 = 13, 48 ÷ 6 + 1 = 9 y 48 ÷ 8 + 1 = 7.', ecuacion: ['13 + 9 + 7 = 29'] },
        { texto: ['Las trampas: ', letra('A'), ' olvida las tres tomas de las 7:00; ', letra('B'), ' llega solo a la segunda vez; ', letra('D'), ' llega a la cuarta; ', letra('E'), ' son las horas.'] },
      ],
      respuesta: [letra('C'), ': 29 tomas'] },
    { nivel: 3, titulo: 'Vueltas en la pista',
      enunciado: 'Tres corredores salen juntos de la meta. Dan una vuelta en 60, 80 y 90 segundos. ¿Cuántas vueltas da el más rápido hasta que los tres vuelven a pasar juntos por la meta?',
      alternativas: ['720', '9', '8', '4', '12'],
      datos: [D2.tres, D2.fac],
      solucion: [
        { texto: 'Pasan juntos cuando han pasado segundos que son múltiplo de los tres: el MCM.', ecuacion: ['60 = 2² × 3 × 5', SEP, '80 = 2⁴ × 5', SEP, '90 = 2 × 3² × 5', SEP, 'MCM = 2⁴ × 3² × 5 = ', ml('720 s')] },
        { texto: 'El más rápido tarda 60 s por vuelta: 720 ÷ 60 = 12 vueltas.' },
        { texto: ['Las trampas: ', letra('A'), ' son los segundos; ', letra('B'), ' y ', letra('C'), ' son las vueltas de los otros dos; ', letra('D'), ' usa solo 60 y 80.'] },
      ],
      respuesta: [letra('E'), ': 12 vueltas'] },
    { nivel: 3, titulo: 'Ladrillos para un cubo',
      enunciado: 'Con ladrillos de 6 cm × 9 cm × 12 cm, todos en la misma posición, se arma el cubo más pequeño posible. ¿Cuántos ladrillos se usan?',
      alternativas: ['36', '72', '13', '648', '3'],
      datos: [D2.tres, D2.fac],
      solucion: [
        { texto: 'El lado del cubo es múltiplo de 6, de 9 y de 12: el MCM.', ecuacion: ['6 = 2 × 3', SEP, '9 = 3²', SEP, '12 = 2² × 3', SEP, 'MCM = 2² × 3² = ', ml('36 cm')] },
        { texto: 'A lo largo van 36 ÷ 6 = 6, a lo ancho 36 ÷ 9 = 4 y a lo alto 36 ÷ 12 = 3.', ecuacion: ['6 × 4 × 3 = 72'] },
        { texto: ['Las trampas: ', letra('A'), ' es el lado del cubo; ', letra('C'), ' suma 6 + 4 + 3; ', letra('D'), ' multiplica las medidas del ladrillo; ', letra('E'), ' es el MCD.'] },
      ],
      respuesta: [letra('B'), ': 72 ladrillos'] },
    { nivel: 3, titulo: 'Combis hasta las nueve',
      enunciado: 'Tres combis salen juntas del paradero a las 6:00. Salen cada 10, cada 12 y cada 15 minutos. ¿Cuántas veces salen juntas desde las 6:00 hasta las 9:00, contando las dos?',
      alternativas: ['3', '7', '19', '4', '1'],
      datos: [D2.tres, D2.otros, D2.partida, D2.hora],
      solucion: [
        { texto: 'Salen juntas cada MCM(10, 12, 15) minutos.', ecuacion: ['10 = 2 × 5', SEP, '12 = 2² × 3', SEP, '15 = 3 × 5', SEP, 'MCM = 2² × 3 × 5 = ', ml('60 min')] },
        { texto: 'Cada hora: a las 6:00, 7:00, 8:00 y 9:00.' },
        { texto: ['Las trampas: ', letra('A'), ' no cuenta la de las 6:00; ', letra('B'), ' usa solo 10 y 15; ', letra('C'), ' cuenta las salidas de una combi; ', letra('E'), ' usa 10 × 12 × 15 min.'] },
      ],
      respuesta: [letra('D'), ': 4 veces'] },
  ];

  const coinciden = {
    id: 'mcm-coinciden',
    titulo: 'MCM: la primera coincidencia',
    pregunta: '¿Cuándo vuelven a coincidir dos cosas que se repiten?',
    temas: ['Mínimo común múltiplo', 'Problemas de aplicación'],
    pieza: BO,
    aprendizaje: 'El MCM es el menor múltiplo de los dos números: el primer boleto con los dos premios. Lleva todos los primos con su mayor exponente.',
    actividad: 'Elegir cada cuántos boletos hay caramelo y gaseosa, y buscar los que ganan los dos.',
    // Lee: la rifa con dos premios y la palabra «múltiplo común» con 4 y 6. No dice el primer boleto de la rifa grande
    // (12 y 18).
    lee: {
      tarjetas: [
        { titulo: 'Dos premios en la rifa', texto: 'En la rifa de la promoción hay dos premios. Cada boleto múltiplo de 4 gana un caramelo y cada boleto múltiplo de 6, una gaseosa. Algunos boletos ganan los dos.',
          pieza: BO, dibujo: { datos: plancha(4, 6, { hasta: 30 }), estado: {} } },
        { titulo: 'Múltiplo común', texto: ['Un múltiplo común de 4 y 6 está en las dos listas: los múltiplos de 4 son 4, 8, 12, 16…, y los de 6, 6, 12, 18… El ', ml(12), ' está en las dos.'],
          ecuacion: ['4, 8, ', ml(12), ', 16, 20, ', ml(24), ', …', SEP, '6, ', ml(12), ', 18, ', ml(24), ', 30, …'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cambiar cada cuántos boletos hay caramelo y cada cuántos hay gaseosa. Busca el primer boleto con los dos premios, y mira cada cuánto se repite.' },
      ],
    },
    ejemplos: EJEMPLOS_MCM,
    juega: {
      pieza: BO,
      consigna: 'En la rifa, los múltiplos de un número ganan caramelo y los de otro, gaseosa. Mira qué boletos ganan los dos.',
      mision: {
        // Una sola manera en la grilla: solo 4 y 10 dan 20 (la prueba lo recorre).
        texto: 'Elige los premios para que el primer boleto con los dos sea el 20.',
        logrado: v => mcm(v.a, v.b) === 20,
        bien: '4 y 10: primero el 20. El 40, que es 4 × 10, llega después.',
      },
      voz: 'Busca el primer boleto con las dos marcas.',
      leyenda: [
        { s: '●', t: 'caramelo: múltiplo del primer número' },
        { s: '■', t: 'gaseosa: múltiplo del segundo número' },
        { s: ml('borde violeta'), t: 'los dos premios: un múltiplo común' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Caramelo cada', opciones: [3, 4, 5, 6].map(x => ({ valor: x, texto: String(x) })) },
        { id: 'b', etiqueta: 'Gaseosa cada', opciones: [7, 8, 10, 15].map(x => ({ valor: x, texto: String(x) })) },
      ],
      dibujo: v => ({ datos: plancha(v.a, v.b), estado: {} }),
      lectura: v => {
        const xs = comunesHasta(v.a, v.b, 60);
        return xs.length ? ['Los dos premios: ', ml(yLista(xs)), ` (cada ${mcm(v.a, v.b)})`] : ['Ningún boleto del 1 al 60 gana los dos'];
      },
      minimo: 3,
    },
    predice: {
      pieza: BO,
      pregunta: 'En la rifa grande, de 300 boletos, ganan caramelo los múltiplos de 12 y gaseosa los múltiplos de 18. ¿Cuál es el primer boleto que gana los dos premios?',
      datos: ['Caramelo: los boletos múltiplos de 12', 'Gaseosa: los boletos múltiplos de 18'],
      voz: 'Piensa en qué boleto caen los dos premios.',
      opciones: [
        { id: 'c', texto: '36', correcta: true },
        { id: 'mcd', texto: '6', error: 'AR13', siFuera: 'Buscar lo que comparten está bien. Pero el 6 no es múltiplo de 12: no gana caramelo.' },
        { id: 'producto', texto: '216', error: 'AT-PRODUCTO', siFuera: 'Bien: el 216 es múltiplo de los dos. Pero el 36 también lo es, y llega antes.' },
        { id: 'suma', texto: '30', error: 'AT-SUMA', siFuera: 'Juntar los dos números está bien, pero sumarlos no: 30 no es múltiplo de 12.' },
      ],
      dibujo: { datos: plancha(12, 18, { hasta: 40, extra: { marcarPremios: false } }), estado: {} },
      revelar: { datos: plancha(12, 18, { hasta: 40, extra: { pie: [['El primero con los dos premios: '], ['36', 'f', 700]] } }), estado: {} },
      coincide: 'Coincide: 36 es múltiplo de 12 y de 18, y ninguno menor lo es.',
      noCoincide: 'Revisemos los múltiplos de cada número.',
    },
    mira: {
      pieza: BO,
      datos: plancha(12, 18, { hasta: 40, extra: { pasos: [{ marcarPremios: 'a' }, { marcarPremios: true }, { marcarPremios: true }, { marcarPremios: 'ambos' }] } }),
      voz: 'Primero un premio, después el otro.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Los múltiplos de 12 ganan caramelo: 12, 24, 36…', ecuacion: ['12, 24, 36, 48, …'] },
        { estado: { paso: 1 }, texto: 'Los de 18 ganan gaseosa. El 36 es el primero en las dos listas.', ecuacion: ['18, ', ml(36), ', 54, …'] },
        { estado: { paso: 2 }, texto: 'Con primos: todos los que aparecen, cada uno con su mayor exponente.', ecuacion: ['12 = 2² × 3', SEP, '18 = 2 × 3²', SEP, 'MCM = 2² × 3² = ', ml(36)] },
        { estado: { paso: 3 }, texto: 'Los siguientes con los dos premios son múltiplos de 36.', ecuacion: [ml(36), ', ', ml(72), ', ', ml(108), ', …'] },
      ],
    },
    regla: {
      texto: 'El MCM de dos números, A y B, es el menor que es múltiplo de los dos: la primera vez que coinciden. Con primos: todos, con su mayor exponente.',
      ecuacion: ['12 = 2² × 3', SEP, '18 = 2 × 3²', SEP, { llave: ['MCM(12, 18) = 2² × 3²'], nota: 'mayor exponente' }, ' = ', ml(36)],
      condicion: 'sin contar el 0. Los demás múltiplos comunes son múltiplos del MCM. Si coinciden al empezar, esa es la primera vez.',
      voz: 'El primero que está en las dos listas.',
      dibujo: { pieza: BO, datos: plancha(12, 18, { hasta: 40 }), estado: {} },
    },
    // Así se resuelve: el cuadrado más pequeño con losetas. «Ahora tú» pide el primer boleto con los dos premios, la hora
    // en que dos alarmas vuelven a sonar, tres pastillas, el MCM en primos, la tercera coincidencia y las tomas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const a = r.ent(6, 20), b = r.ent(a + 1, 24), M = mcm(a, b);
          if (mcd(a, b) === 1 || b % a === 0 || M > 120 || USADOS2.has(`${a}-${b}`)) continue;
          return {
            enunciado: `Con losetas de ${a} cm por ${b} cm, todas en la misma posición, se arma el cuadrado más pequeño posible. ¿Cuánto mide su lado y cuántas losetas se usan?`,
            datos: [D2.comun, D2.mcm, D2.fac],
            pasos: [
              { tipo: 'pide', texto: 'Piden el lado del cuadrado más pequeño que se arma con losetas enteras, y cuántas son.' },
              { tipo: 'datos', texto: `Cada loseta mide ${a} cm por ${b} cm, y todas van en la misma posición.` },
              { tipo: 'regla', texto: `El lado es múltiplo de ${a}, para las losetas a lo largo, y de ${b}, a lo ancho: es un múltiplo común, y se quiere el menor.` },
              { tipo: 'cuentas', texto: 'Descompongo en primos y tomo todos, cada uno con su mayor exponente.', ecuacion: [`${a} = ${canon(a)}`, SEP, `${b} = ${canon(b)}`, SEP, `MCM = ${canon(M)} = `, ml(M)] },
              { tipo: 'cuentas', texto: `Caben ${M} ÷ ${a} = ${M / a} a lo largo y ${M} ÷ ${b} = ${M / b} a lo ancho.`, ecuacion: [`${M / a} × ${M / b} = ${(M / a) * (M / b)}`] },
              { tipo: 'sentido', texto: `Comprueba: un lado más corto que ${M} cm no es múltiplo de ${a} y de ${b} a la vez.` },
            ],
            respuesta: ['Lado de ', ml(`${M} cm`), `, con ${(M / a) * (M / b)} losetas`],
          };
        }
      },
    },
    ahoraTu: {
      voz: '¿Se junta o se corta? Si se junta, es el MCM.',
      generar(sem) {
        const r = azar(sem + 37), tipo = sem % 6;
        return conCuatro([casoBoleto, casoHora, casoTresP, casoFacM, casoTercera, casoTomas][tipo], r);
      },
    },
  };

  // ---------- Idea 3 (rehecha, 19 nov): MCD, MCM y los cocientes PESI ----------
  // Propuesta §1 a §7. Conserva el id `mcd-por-mcm`, con otra Predice (antes, 4, 6 y 10 en Sí o No; ahora cuánto da).
  // Objeto: los rollos de la promoción otra vez (arit-cintas): cada rollo cortado con el MCD y la cinta del MCM medida
  // con cada rollo. Cambia: los dos rollos. · Permanece: una sola escala en la figura. · Progresa: los cocientes p y q →
  // la cinta del MCM → MCD × MCM. · Se reserva: tres números (la predicción). · Debe verse: A = MCD × p, B = MCD × q y
  // MCM = A × q = B × p.
  // Errores (hipótesis de aula): AT-TRES extiende MCD × MCM = A × B a tres números (el error que nombra la matriz) ·
  // AT-MCM-PRODUCTO toma el producto por MCM · AT-OLVIDA-TERCERO deja un número fuera · AT-REL-SIN-MCD divide el MCM solo
  // · AT-REL-MULTIPLICA no divide al final · AT-REL-COCIENTE da p × q por el otro número · AT-REL-DOS-VECES divide dos
  // veces entre el MCD · AT-REL-PRODUCTO da MCD × MCM por el MCM · AT-K-NO-CAMBIA cree que el MCD no cambia al
  // multiplicar · AT-K-MCM responde el MCM · AT-K-DOBLE multiplica dos veces · AT-COC-SIN-MCD da p + q sin el MCD ·
  // AT-RESPONDE-OTRA responde uno de los números · AT-SUMA-DATOS suma los datos · AT-PARES-SIN-PESI cuenta cocientes que
  // no son PESI · AT-PARES-ORDEN cuenta (A, B) y (B, A) · AT-PARES-UNO cuenta solo el par obvio.
  const TA = 'arit-tabla';
  const D3 = {
    coc: 'A = MCD × p y B = MCD × q: p y q son los cocientes, y son PESI',
    mcm: 'MCM(A, B) = MCD × p × q',
    prod: 'Con dos números: MCD(A, B) × MCM(A, B) = A × B',
    pesi: 'p y q PESI: no comparten ningún primo (no tienen que ser primos)',
    fac: 'Con primos: el MCD toma el menor exponente de cada primo y el MCM, el mayor',
    raiz: 'Raíz cuadrada: el número positivo que, multiplicado por sí mismo, da el número dado',
  };
  // Los dos rollos cortados con su MCD y la cinta del MCM medida con cada uno.
  function cuatroCintas(A, B) {
    const g = mcd(A, B), M = mcm(A, B), p = A / g, q = B / g;
    return {
      max: M, filas: 4,
      cintas: [
        { largo: A, rotulo: [[`Rollo A: ${A} m`]], trozo: g, colorTrozo: 'i', marca: true, nota: [['p = '], [String(p), null, 700], [' trozos de '], [`${g} m`, 'i', 700]] },
        { largo: B, rotulo: [[`Rollo B: ${B} m`]], trozo: g, colorTrozo: 'i', marca: true, nota: [['q = '], [String(q), null, 700], [' trozos de '], [`${g} m`, 'i', 700]] },
        { largo: M, color: 'f', rotulo: [['Cinta del MCM: '], [`${M} m`, 'f', 700]], trozo: A, colorTrozo: null, nota: [[`${plural(q, 'rollo A', 'rollos A')} (q)`]] },
        { largo: M, color: 'f', rotulo: [['La misma cinta, con rollos B']], trozo: B, colorTrozo: null, nota: [[`${plural(p, 'rollo B', 'rollos B')} (p)`]] },
      ],
    };
  }
  // La tabla de exponentes de 4, 6 y 10 (Predice y Mira): una fila por primo; el MCD toma el menor y el MCM el mayor.
  const TRES3 = [4, 6, 10];
  const expDe = (n, p) => { let e = 0; while (n % p === 0) { n /= p; e++; } return e; };
  const tablaTres = {
    columnas: [{ t: 'primo' }, ...TRES3.map(n => ({ t: String(n) })), { t: 'MCD', color: 'i' }, { t: 'MCM', color: 'f' }],
    filas: [2, 3, 5].map(p => {
      const es = TRES3.map(n => expDe(n, p));
      return [p, ...es, { t: String(Math.min(...es)), color: 'i', paso: 1 }, { t: String(Math.max(...es)), color: 'f', paso: 2 }];
    }),
    cabeza: true, filasMax: 3,
    alt: 'Tabla de exponentes de 4, 6 y 10: una fila por cada primo (2, 3 y 5); al final, el menor exponente de cada fila (MCD) y el mayor (MCM)',
  };
  const USADOS3 = new Set(['24-40', '12-16', '18-30', '12-20', '8-12', '4-60', '6-24', '6-42', '8-96', '9-36', '9-63', '4-24', '12-24', '24-36', '6-180', '4-144', '15-105', '12-360']);

  // Ahora tú · tipo 0: el otro número, con MCD × MCM = A × B.
  function casoOtro(r) {
    const g = r.de([2, 3, 4, 5, 6, 8, 9, 12]), p = r.ent(2, 9), q = r.ent(2, 11);
    if (p === q || mcd(p, q) !== 1) return null;
    const A = g * p, B = g * q, M = g * p * q;
    if (M > 400 || USADOS3.has(par(A, B))) return null;
    return {
      pregunta: `El MCD de dos números es ${g} y su MCM es ${M}. Uno de ellos es ${A}. ¿Cuál es el otro?`,
      datos: [D3.prod],
      opciones: opciones(B, [
        { id: 'sinmcd', valor: M / A, error: 'AT-REL-SIN-MCD', siFuera: `Bien dividir entre ${A}. Pero se divide MCD × MCM = ${g * M}; ${M} ÷ ${A} = ${M / A} olvida el MCD.` },
        { id: 'multiplica', valor: g * M, error: 'AT-REL-MULTIPLICA', siFuera: `Bien: MCD × MCM = ${g * M}. Pero eso es A × B: falta dividir entre ${A}.` },
        { id: 'cociente', valor: M / g, error: 'AT-REL-COCIENTE', siFuera: `Bien usar el MCD y el MCM. Pero ${M} ÷ ${g} = ${M / g} es p × q, no el otro número.` },
      ]),
      solucion: { texto: `${A} × B = ${g} × ${M} = ${g * M}, y B = ${g * M} ÷ ${A}.`, ecuacion: [`B = ${g * M} ÷ ${A} = ${B}`] },
    };
  }
  // Ahora tú · tipo 1: el MCM a partir del producto y del MCD.
  function casoProd(r) {
    const g = r.de([2, 3, 4, 5, 6, 7, 8]), p = r.ent(1, 7), q = r.ent(p + 1, 12);
    if (mcd(p, q) !== 1) return null;
    const P = g * g * p * q, M = g * p * q;
    if (P > 2000 || p * q < 4) return null;
    return {
      pregunta: `Dos números multiplicados dan ${f(P, 0)} y su MCD es ${g}. ¿Cuál es su MCM?`,
      datos: [D3.prod],
      opciones: opciones(M, [
        { id: 'multiplica', valor: P * g, error: 'AT-REL-MULTIPLICA', siFuera: `Bien usar el producto y el MCD. Pero el MCM sale de dividir: ${f(P * g, 0)} es multiplicar.` },
        { id: 'dos', valor: p * q, error: 'AT-REL-DOS-VECES', siFuera: `Bien dividir entre el MCD, pero una sola vez: dos veces da ${p * q}, que es p × q.` },
        { id: 'producto', valor: P, error: 'AT-REL-PRODUCTO', siFuera: `Bien: ${f(P, 0)} es MCD × MCM. Pero falta quitarle el MCD.` },
      ], x => f(x, 0)),
      solucion: { texto: `MCD × MCM = A × B: ${g} × MCM = ${f(P, 0)}.`, ecuacion: ['MCM = ', `${f(P, 0)} ÷ ${g} = `, ml(M)] },
    };
  }
  // Ahora tú · tipo 2: el MCD de k × A y k × B.
  function casoK(r) {
    const g = r.de([2, 3, 4, 5, 6, 8]), p = r.ent(2, 7), q = r.ent(p + 1, 9), k = r.de([2, 3, 4, 5]);
    if (mcd(p, q) !== 1) return null;
    const M = g * p * q, pideMcm = r() < 0.4;
    const pide = pideMcm ? 'MCM' : 'MCD';
    const correcta = pideMcm ? k * M : k * g;
    return {
      pregunta: `MCD(A, B) = ${g} y MCM(A, B) = ${M}. ¿Cuánto vale el ${pide} de ${k} × A y ${k} × B?`,
      datos: [D3.coc, D3.mcm],
      opciones: opciones(correcta, [
        { id: 'igual', valor: pideMcm ? M : g, error: 'AT-K-NO-CAMBIA', siFuera: `Bien que los cocientes p y q no cambian. Pero el ${pide} queda multiplicado por ${k}.` },
        { id: 'otro', valor: pideMcm ? k * g : k * M, error: 'AT-K-MCM', siFuera: `Bien multiplicar por ${k}. Pero eso es el ${pideMcm ? 'MCD' : 'MCM'} nuevo; se pide el ${pide}.` },
        { id: 'doble', valor: k * correcta, error: 'AT-K-DOBLE', siFuera: `Bien multiplicar. Pero se multiplica una vez por ${k}, no por ${k} × ${k}.` },
      ]),
      solucion: { texto: `${k} × A = ${k * g} × p y ${k} × B = ${k * g} × q, con p y q PESI.`,
        ecuacion: pideMcm ? ['MCM = ', `${k} × ${M} = `, ml(k * M)] : ['MCD = ', `${k} × ${g} = `, dv(k * g)] },
    };
  }
  // Ahora tú · tipo 3 (San Marcos 2019-II): la diferencia y el MCM dados; se pide la suma (un solo par, por fuerza bruta).
  function casoDif(r) {
    const g = r.de([2, 3, 4, 5, 6, 7, 8, 9, 10, 12]), p = r.ent(2, 6), q = r.ent(p + 1, 8);
    if (mcd(p, q) !== 1) return null;
    const A = g * p, B = g * q, Dd = B - A, M = g * p * q;
    if (M > 400 || USADOS3.has(par(A, B))) return null;
    const sol = []; for (let x = 1; x + Dd <= M; x++) if (mcm(x, x + Dd) === M) sol.push(x);
    if (sol.length !== 1) return null;
    return {
      pregunta: `Dos números se diferencian en ${Dd} y su MCM es ${M}. ¿Cuánto suman?`,
      datos: [D3.coc, D3.mcm, 'La diferencia de los dos: MCD × q − MCD × p = MCD × (q − p)'],
      opciones: opciones(A + B, [
        { id: 'datos', valor: Dd + M, error: 'AT-SUMA-DATOS', siFuera: `Bien usar los dos datos. Pero ${Dd} + ${M} no son los números: hay que hallarlos.` },
        { id: 'coc', valor: p + q, error: 'AT-COC-SIN-MCD', siFuera: `Bien los cocientes ${p} y ${q}. Pero los números son MCD × ${p} y MCD × ${q}.` },
        { id: 'mayor', valor: B, error: 'AT-RESPONDE-OTRA', siFuera: `Bien hallar el ${B}. Pero se pide la suma de los dos números.` },
      ]),
      solucion: { texto: `Con MCD = ${g}: q − p = ${q - p} y p × q = ${p * q}, así que p = ${p} y q = ${q}.`, ecuacion: [`${A} + ${B} = ${A + B}`] },
    };
  }
  // Ahora tú · tipo 4 (nivel examen): cuántos pares tienen un MCD y un MCM dados.
  function casoPares(r) {
    const g = r.de([2, 3, 4, 5, 6]), c = r.de([12, 18, 20, 24, 30, 36, 40, 45, 60, 72]), M = g * c;
    if (M > 400) return null;
    let pesi = 0, todos = 0;
    for (let p = 1; p * p < c; p++) if (c % p === 0) { todos++; if (mcd(p, c / p) === 1) pesi++; }
    if (todos === pesi) return null;
    return {
      pregunta: `¿Cuántos pares de números (A, B), con A menor que B, tienen MCD ${g} y MCM ${M}?`,
      datos: [D3.coc, D3.mcm, D3.pesi],
      opciones: opciones(pesi, [
        { id: 'sinpesi', valor: todos, error: 'AT-PARES-SIN-PESI', siFuera: `Bien buscar p × q = ${c}. Pero p y q tienen que ser PESI: así salen ${todos}, y no todos sirven.` },
        { id: 'orden', valor: 2 * pesi, error: 'AT-PARES-ORDEN', siFuera: `Bien los cocientes PESI. Pero con A menor que B, ${g * 1} y ${M} es un solo par, no dos.` },
        { id: 'uno', valor: 1, error: 'AT-PARES-UNO', siFuera: `Bien: ${g} y ${M} es un par. Pero hay más cocientes PESI con p × q = ${c}.` },
      ]),
      solucion: { texto: `p × q = ${M} ÷ ${g} = ${c}, con p y q PESI y p menor que q.`, ecuacion: [`${pesi} ${pesi === 1 ? 'par' : 'pares'}`] },
    };
  }

  // Ejemplos resueltos (idea 3). Cuentas rehechas aparte (cuentas.py): MCD(24, 40) = 8, cocientes 3 y 5; 6 × 4 × 7 = 168;
  // 4 × 60 ÷ 12 = 20 (MCD(12, 20) = 4, MCM 60); MCD(8, 12) × MCM(8, 12) = 4 × 24 = 96; MCD(30, 45) = 15; 864 ÷ 6 = 144
  // (pares (6, 144) y (18, 48)); MCD(6, 10, 15) = 1, MCM 30, 6 × 10 × 15 = 900; MCD 24 y MCM 288 con 3 × A y 3 × B; 36 + 63
  // = 99; MCD 4 y MCM 24: pares (4, 24) y (8, 12); diferencia 12 y MCM 72: solo (24, 36), suma 60; MCD 4 y MCM 144: 2 pares
  // PESI de 4 cocientes; suma 120 y MCD 15: (15, 105) y (45, 75), 3 con (30, 90); MCM = 30 × MCD y producto 1080: MCD 6;
  // MCD 12 y MCM 360 sin que uno divida al otro: (24, 180), (36, 120), (60, 72), el más cercano suma 132.
  const EJEMPLOS_REL = [
    { nivel: 1, titulo: 'Los cocientes de 24 y 40',
      enunciado: 'El MCD de 24 y 40 es 8. ¿Cuáles son los cocientes p y q?',
      datos: [D3.coc],
      solucion: [{ texto: 'Divido cada número entre el MCD. 3 y 5 no comparten ningún primo: son PESI, como tiene que ser.', ecuacion: ['24 = ', dv(8), ' × 3', SEP, '40 = ', dv(8), ' × 5'] }],
      respuesta: ['p = 3 y q = 5'] },
    { nivel: 1, titulo: 'El MCM con los cocientes',
      enunciado: 'A = 6 × 4 y B = 6 × 7, y su MCD es 6. ¿Cuál es el MCM de A y B?',
      datos: [D3.mcm, D3.pesi],
      solucion: [{ texto: '4 y 7 son PESI: son los cocientes. El MCM es el MCD por los dos cocientes.', ecuacion: ['MCM = 6 × 4 × 7 = ', ml(168)] }],
      respuesta: ['MCM = ', ml(168)] },
    { nivel: 1, titulo: 'El otro número',
      enunciado: 'El MCD de dos números es 4 y su MCM es 60. Uno de ellos es 12. ¿Cuál es el otro?',
      datos: [D3.prod],
      solucion: [{ texto: 'Con dos números, MCD × MCM da el producto de los dos.', ecuacion: ['12 × B = 4 × 60 = 240', SEP, 'B = 240 ÷ 12 = 20'] }],
      respuesta: ['El otro es 20'] },
    { nivel: 1, titulo: 'Comprobar con 8 y 12',
      enunciado: '¿Se cumple MCD × MCM = 8 × 12 con los números 8 y 12?',
      datos: [D3.prod, D3.fac],
      solucion: [{ texto: '8 = 2³ y 12 = 2² × 3: el MCD es 2² = 4 y el MCM es 2³ × 3 = 24.', ecuacion: ['4 × 24 = 96 = 8 × 12'] }],
      respuesta: ['Sí: los dos lados dan 96'] },
    { nivel: 1, titulo: '¿Pueden ser los cocientes?',
      enunciado: 'El MCD de A y B es 5 y A = 5 × 6. ¿Puede ser B = 5 × 9?',
      datos: [D3.coc, D3.pesi],
      solucion: [{ texto: '6 y 9 comparten el 3: no son PESI. Con A = 30 y B = 45, el MCD sería 5 × 3 = 15, no 5.' }],
      respuesta: ['No: 6 y 9 no son PESI'] },
    { nivel: 2, titulo: 'El producto y el MCD',
      enunciado: 'Dos números multiplicados dan 864 y su MCD es 6. ¿Cuál es su MCM?',
      datos: [D3.prod],
      solucion: [
        { texto: 'MCD × MCM es el producto de los dos números.', ecuacion: ['6 × MCM = 864'] },
        { texto: 'Despejo el MCM.', ecuacion: ['MCM = 864 ÷ 6 = ', ml(144)] },
      ],
      respuesta: ['MCM = ', ml(144)] },
    { nivel: 2, titulo: 'Con tres números no',
      enunciado: 'Con los números 6, 10 y 15, ¿da MCD × MCM lo mismo que 6 × 10 × 15?',
      datos: [D3.fac, D3.prod],
      solucion: [
        { texto: '6 = 2 × 3, 10 = 2 × 5 y 15 = 3 × 5. Ningún primo está en los tres: el MCD es 1. El MCM es 2 × 3 × 5 = 30.' },
        { texto: 'Con tres números la regla no vale: cada primo está dos veces y el MCM lo toma una sola.', ecuacion: ['1 × 30 = 30', SEP, '6 × 10 × 15 = 900'] },
      ],
      respuesta: ['No: 30 contra 900'] },
    { nivel: 2, titulo: 'Multiplicar por 3',
      enunciado: 'MCD(A, B) = 8 y MCM(A, B) = 96. ¿Cuánto valen el MCD y el MCM de 3 × A y 3 × B?',
      datos: [D3.coc, D3.mcm],
      solucion: [
        { texto: '3 × A = 24 × p y 3 × B = 24 × q, con los mismos cocientes PESI.' },
        { texto: 'El MCD y el MCM quedan multiplicados por 3.', ecuacion: ['MCD = 3 × 8 = ', dv(24), SEP, 'MCM = 3 × 96 = ', ml(288)] },
      ],
      respuesta: ['MCD = ', dv(24), ' y MCM = ', ml(288)] },
    { nivel: 2, titulo: 'Los dos números',
      enunciado: 'El MCD de dos números es 9 y sus cocientes son 4 y 7. ¿Cuánto suman los dos números?',
      datos: [D3.coc],
      solucion: [
        { texto: 'Cada número es el MCD por su cociente.', ecuacion: ['A = 9 × 4 = 36', SEP, 'B = 9 × 7 = 63'] },
        { texto: '4 y 7 son PESI, así que el MCD sí es 9.', ecuacion: ['36 + 63 = 99'] },
      ],
      respuesta: ['Suman 99'] },
    { nivel: 2, titulo: 'Pares con MCD 4, MCM 24',
      enunciado: '¿Cuántos pares de números (A, B), con A menor que B, tienen MCD 4 y MCM 24?',
      datos: [D3.coc, D3.mcm, D3.pesi],
      solucion: [
        { texto: 'MCD × p × q = 24, así que p × q = 24 ÷ 4 = 6. Con p menor que q y PESI: 1 y 6, o 2 y 3.' },
        { texto: 'Los pares son 4 × 1 y 4 × 6, y 4 × 2 y 4 × 3.', ecuacion: ['(4, 24)', SEP, '(8, 12)'] },
      ],
      respuesta: ['2 pares: 4 y 24, y 8 y 12'] },
    { nivel: 3, titulo: 'Diferencia y MCM',
      enunciado: 'Dos números se diferencian en 12 y su MCM es 72. ¿Cuánto suman?',
      alternativas: ['84', '5', '36', '60', '864'],
      datos: [D3.coc, D3.mcm, 'La diferencia de los dos: MCD × q − MCD × p = MCD × (q − p)'],
      solucion: [
        { texto: 'La diferencia es MCD × (q − p) = 12 y el MCM es MCD × p × q = 72.' },
        { texto: 'Pruebo con el MCD = 12: q − p = 1 y p × q = 6, así que p = 2 y q = 3.' },
        { texto: 'Los números son 12 × 2 = 24 y 12 × 3 = 36. Otro MCD no da cocientes enteros y PESI.', ecuacion: ['24 + 36 = 60'] },
        { texto: ['Las trampas: ', letra('A'), ' suma 12 + 72; ', letra('B'), ' suma los cocientes; ', letra('C'), ' es el mayor solo; ', letra('E'), ' multiplica 24 × 36.'] },
      ],
      respuesta: [letra('D'), ': suman 60'] },
    { nivel: 3, titulo: 'Pares con MCD 4, MCM 144',
      enunciado: '¿Cuántos pares de números (A, B), con A menor que B, tienen MCD 4 y MCM 144?',
      alternativas: ['4', '2', '1', '36', '9'],
      datos: [D3.coc, D3.mcm, D3.pesi],
      solucion: [
        { texto: 'p × q = 144 ÷ 4 = 36. Con p menor que q: 1 y 36, 2 y 18, 3 y 12, 4 y 9.' },
        { texto: 'Solo 1 y 36, y 4 y 9, son PESI.' },
        { texto: 'Los pares son (4, 144) y (16, 36).' },
        { texto: ['Las trampas: ', letra('A'), ' cuenta también los cocientes que comparten primos; ', letra('C'), ' solo ve 4 y 144; ', letra('D'), ' es p × q; ', letra('E'), ' cuenta los divisores de 36.'] },
      ],
      respuesta: [letra('B'), ': 2 pares'] },
    { nivel: 3, titulo: 'Suma 120 y MCD 15',
      enunciado: 'Dos números suman 120 y su MCD es 15. ¿Cuántos pares (A, B), con A menor que B, cumplen?',
      alternativas: ['3', '8', '1', '4', '2'],
      datos: [D3.coc, D3.pesi],
      solucion: [
        { texto: '15 × p + 15 × q = 120, así que p + q = 8. Con p menor que q: 1 y 7, 2 y 6, 3 y 5. 2 y 6 comparten el 2.' },
        { texto: 'Quedan dos: (15, 105) y (45, 75).' },
        { texto: ['Las trampas: ', letra('A'), ' cuenta 2 y 6, que no son PESI; ', letra('B'), ' es p + q; ', letra('C'), ' solo ve 15 y 105; ', letra('D'), ' cuenta cada par dos veces.'] },
      ],
      respuesta: [letra('E'), ': 2 pares'] },
    { nivel: 3, titulo: 'El MCM, 30 veces el MCD',
      enunciado: 'El MCM de dos números es 30 veces su MCD, y los dos números multiplicados dan 1080. ¿Cuál es el MCD?',
      alternativas: ['6', '36', '180', '30', '1080'],
      datos: [D3.prod, D3.raiz],
      solucion: [
        { texto: 'MCD × MCM = 1080 y MCM = 30 × MCD: MCD × MCD × 30 = 1080, así que MCD × MCD = 36.' },
        { texto: 'El número que por sí mismo da 36 es 6.', ecuacion: ['6 × 6 = 36', SEP, '6 × 180 = 1080'] },
        { texto: ['Las trampas: ', letra('B'), ' olvida sacar la raíz; ', letra('C'), ' es el MCM; ', letra('D'), ' son las veces; ', letra('E'), ' es el producto.'] },
      ],
      respuesta: [letra('A'), ': ', dv(6)] },
    { nivel: 3, titulo: 'Los números más cercanos',
      enunciado: 'El MCD de dos números es 12 y su MCM es 360. Ninguno es múltiplo del otro. ¿Cuánto suman los dos números del par más cercano entre sí?',
      alternativas: ['372', '204', '132', '11', '156'],
      datos: [D3.coc, D3.mcm, D3.pesi],
      solucion: [
        { texto: 'p × q = 360 ÷ 12 = 30, con p y q PESI y ninguno igual a 1: 2 y 15, 3 y 10, 5 y 6.' },
        { texto: 'Los más cercanos son 5 y 6: los números son 60 y 72.', ecuacion: ['60 + 72 = 132'] },
        { texto: ['Las trampas: ', letra('A'), ' usa 1 y 30; ', letra('B'), ' usa 2 y 15; ', letra('D'), ' suma los cocientes; ', letra('E'), ' usa 3 y 10.'] },
      ],
      respuesta: [letra('C'), ': suman 132'] },
  ];

  const relacion = {
    id: 'mcd-por-mcm',
    titulo: 'MCD, MCM y los cocientes',
    pregunta: '¿Qué tienen que ver el MCD y el MCM de dos números?',
    temas: ['Relación entre MCD y MCM'],
    pieza: CI,
    aprendizaje: 'A = MCD × p y B = MCD × q, con p y q PESI. El MCM es MCD × p × q, y MCD × MCM = A × B.',
    actividad: 'Elegir dos rollos, cortarlos con su MCD y armar con ellos la cinta del MCM.',
    // Lee: los rollos de 18 y 30 (la misión de la idea 1, ya hecha) cortados con su MCD, y por qué los cocientes son PESI.
    // No dice nada de tres números (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Los rollos otra vez', texto: 'Volvemos a los rollos de la promoción. Si dos rollos se cortan con su MCD, cada uno queda en un número entero de trozos. Esos números son los cocientes.',
          pieza: CI, dibujo: { datos: rollos([18, 30], 6), estado: {} } },
        { titulo: 'Los cocientes no comparten nada', texto: 'Con 18 y 30 el MCD es 6: el rollo de 18 m queda en 3 trozos y el de 30 m, en 5. 3 y 5 son PESI: si compartieran un primo, habría un trozo más largo.',
          ecuacion: ['18 = ', dv(6), ' × 3', SEP, '30 = ', dv(6), ' × 5'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir dos rollos. Mira sus cocientes p y q, su MCD y la cinta del MCM, y compara MCD × MCM con el producto de los dos largos.' },
      ],
    },
    ejemplos: EJEMPLOS_REL,
    juega: {
      pieza: CI,
      consigna: 'Arriba, los dos rollos cortados con su MCD. Abajo, la cinta del MCM, medida una vez con cada rollo.',
      mision: {
        // Una sola manera en la grilla: solo 12 y 16 tienen MCD 4 y MCM 48 (la prueba lo recorre).
        texto: 'Elige dos rollos cuyo MCD sea 4 y su MCM, 48.',
        logrado: v => mcd(v.a, v.b) === 4 && mcm(v.a, v.b) === 48,
        bien: '12 y 16: MCD 4 y MCM 48. Mira: 4 × 48 = 192, y 12 × 16 = 192.',
      },
      voz: 'Compara MCD por MCM con el producto de los rollos.',
      leyenda: [
        { s: dv('MCD'), t: 'el trozo que entra exacto en los dos' },
        { s: ml('MCM'), t: 'la cinta que los dos rollos miden exacto' },
        { s: 'p, q', t: 'los cocientes: cuántos trozos del MCD' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Rollo A', opciones: [12, 18, 20].map(x => ({ valor: x, texto: `${x} m` })) },
        { id: 'b', etiqueta: 'Rollo B', opciones: [8, 15, 16, 30].map(x => ({ valor: x, texto: `${x} m` })) },
      ],
      dibujo: v => ({ datos: cuatroCintas(v.a, v.b), estado: {} }),
      lectura: v => { const g = mcd(v.a, v.b), M = mcm(v.a, v.b); return [dv(g), ' × ', ml(M), ` = ${g * M} = ${v.a} × ${v.b}`]; },
      minimo: 3,
    },
    predice: {
      pieza: TA,
      pregunta: 'Con dos rollos, MCD × MCM da el producto de los dos largos. Con tres números, 4, 6 y 10, ¿cuánto da MCD × MCM?',
      datos: ['Los tres números: 4, 6 y 10'],
      voz: 'Piensa qué exponentes toma el MCD y cuáles el MCM.',
      opciones: [
        { id: 'c', texto: '120', correcta: true },
        { id: 'tres', texto: '240', error: 'AT-TRES', siFuera: 'Con dos números, sí. Con tres no: el MCD es 2, el MCM es 60, y 2 × 60 = 120.' },
        { id: 'producto', texto: '480', error: 'AT-MCM-PRODUCTO', siFuera: 'Bien el MCD, 2. Pero el MCM no es 240, el producto: es 60, el menor múltiplo de los tres.' },
        { id: 'olvida', texto: '24', error: 'AT-OLVIDA-TERCERO', siFuera: 'Bien el MCD, 2. Pero 12 es el MCM de 4 y 6; con el 10, el MCM es 60.' },
      ],
      dibujo: { datos: tablaTres, estado: { paso: 0 } },
      revelar: { datos: tablaTres, estado: { paso: 2 } },
      coincide: 'Coincide: el MCD es 2, el MCM es 60, y 2 × 60 = 120, la mitad de 240.',
      noCoincide: 'Revisemos qué exponente toma cada uno, fila por fila.',
    },
    mira: {
      pieza: TA,
      datos: tablaTres,
      voz: 'Fila por fila: el menor al MCD, el mayor al MCM.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Cada número con sus exponentes: una fila por primo.', ecuacion: ['4 = 2²', SEP, '6 = 2 × 3', SEP, '10 = 2 × 5'] },
        { estado: { paso: 1 }, texto: 'El MCD toma el menor exponente de cada fila.', ecuacion: ['MCD = 2'] },
        { estado: { paso: 2 }, texto: 'El MCM toma el mayor de cada fila.', ecuacion: ['MCM = 2² × 3 × 5 = 60'] },
        { estado: { paso: 2, fila: 0 }, texto: 'En la fila del 2 hay tres exponentes: uno no entra en ninguno.', ecuacion: ['2 × 60 = 120', SEP, '4 × 6 × 10 = 240'] },
        { estado: { paso: 2 }, texto: 'Con dos números hay dos por fila: uno al MCD y otro al MCM.', ecuacion: ['MCD × MCM = A × B'] },
      ],
    },
    regla: {
      texto: 'Con dos números, A = MCD × p y B = MCD × q, con p y q PESI. Entonces MCM = MCD × p × q, y MCD × MCM = A × B.',
      ecuacion: ['A = ', dv('MCD'), ' × p', SEP, 'B = ', dv('MCD'), ' × q', SEP, ml('MCM'), ' = ', dv('MCD'), ' × ', { llave: ['p × q'], nota: 'p y q PESI' }, SEP, dv('MCD'), ' × ', ml('MCM'), ' = A × B'],
      condicion: 'solo con dos números: 4, 6 y 10 son un contraejemplo. p y q no tienen que ser primos, solo PESI.',
      voz: 'Dos números: MCD por MCM es su producto.',
      dibujo: { pieza: CI, datos: cuatroCintas(12, 16), estado: {} },
    },
    // Así se resuelve: la suma de dos números con su MCD y su MCM, desde los cocientes. «Ahora tú» pide el otro número,
    // el MCM desde el producto, el MCD o el MCM de k × A y k × B, la suma desde la diferencia y cuántos pares hay.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const g = r.de([3, 4, 5, 6, 7, 8]), p = r.ent(2, 6), q = r.ent(p + 1, 9);
          if (mcd(p, q) !== 1 || USADOS3.has(par(g * p, g * q)) || g * p * q > 400) continue;
          const M = g * p * q, c = p * q;
          // Un solo par sin que uno divida al otro: p × q con un solo reparto en dos PESI mayores que 1.
          let otros = 0; for (let x = 2; x * x < c; x++) if (c % x === 0 && mcd(x, c / x) === 1) otros++;
          if (otros !== 1) continue;
          return {
            enunciado: `El MCD de dos números es ${g} y su MCM es ${M}. Ninguno de los dos es múltiplo del otro. ¿Cuánto suman?`,
            datos: [D3.coc, D3.mcm, D3.pesi],
            pasos: [
              { tipo: 'pide', texto: 'Piden la suma de los dos números, que no se conocen.' },
              { tipo: 'datos', texto: `MCD = ${g} y MCM = ${M}. Si uno fuera múltiplo del otro, uno de los cocientes sería 1.` },
              { tipo: 'regla', texto: 'Los números son MCD × p y MCD × q, con p y q PESI, y el MCM es MCD × p × q.' },
              { tipo: 'cuentas', texto: `p × q = ${M} ÷ ${g} = ${c}. Los únicos PESI mayores que 1 con ese producto son ${p} y ${q}.`, ecuacion: [`A = ${g} × ${p} = ${g * p}`, SEP, `B = ${g} × ${q} = ${g * q}`] },
              { tipo: 'sentido', texto: `Comprueba: MCD × MCM = ${g} × ${M} = ${g * M}, y ${g * p} × ${g * q} = ${g * g * p * q}.`, ecuacion: [`${g * p} + ${g * q} = ${g * (p + q)}`] },
            ],
            respuesta: `Suman ${g * (p + q)}.`,
          };
        }
      },
    },
    ahoraTu: {
      voz: 'Primero los cocientes p y q.',
      generar(sem) {
        const r = azar(sem + 41), tipo = sem % 5;
        return conCuatro([casoOtro, casoProd, casoK, casoDif, casoPares][tipo], r);
      },
    },
  };

  // ---------- Idea 4 (nueva, 19 nov): el mismo resto con varios divisores ----------
  // Propuesta §1 a §7 (vino de Divisibilidad: docs/etapa5/decisiones.md, 8 de sus 15 preguntas de San Marcos). Objeto: el
  // paquete de caramelos de doña Juana empacado en bolsitas de 4 y de 6 (pieza arit-reparto, dibujo de prueba). Cambia:
  // cuántos caramelos hay. · Permanece: las dos formas de empacar. · Progresa: un suelto con 4 → un suelto con 6 → los
  // dos a la vez. · Se reserva: la bolsita de 10 (la predicción). · Debe verse: si sobra lo mismo con las dos bolsitas,
  // sin ese suelto el paquete se empaca justo de las dos formas.
  // Errores (hipótesis de aula; dos con trampa deducida de San Marcos, CSV de admisión): AT-RESTO-PRODUCTO usa el producto
  // en vez del MCM (San Marcos 2024-II) · AT-RESTO-DOS deja fuera un divisor · AT-RESTO-OLVIDA no suma el resto ·
  // AT-RESTO-RESTA resta el resto · AT-RESTO-PRIMERO usa uno de los restos cuando son distintos (San Marcos 2026-II:
  // homogeneizar) · AT-FALTA-SUMA suma lo que falta · AT-COTA-OLVIDA no mira el tramo pedido · AT-COTA-PASA se pasa del
  // tramo · AT-TERCERO-OLVIDA no prueba el tercer divisor · AT-TERCERO-MULTIPLICA multiplica por el tercero.
  const RP = 'arit-reparto';
  const D4 = {
    forma: ['N = ', MU('A'), ' + ', sb('r'), ': al dividir N entre A sobran ', sb('r')],
    comun: 'Si N − r es múltiplo de A y de B, también es múltiplo de MCM(A, B)',
    lista: 'Los que dejan resto r con A y con B: MCM(A, B) × k + r, con k = 0, 1, 2…',
    falta: ['Si a N le faltan ', RE, ' para otro grupo de A: N = ', MU('A'), ' − ', RE],
    resto: 'El resto es menor que el divisor',
    fac: D2.fac,
    tres: 'Los números de tres cifras van del 100 al 999',
  };
  const empaca = (n, ds, o = {}) => Object.assign({ n, repartos: ds.map(d => ({ d })) }, o);
  const cerrado = (ds, o = {}) => Object.assign({ cerrado: true, repartos: ds.map(d => (typeof d === 'object' ? d : { d, sobran: o.sobran === undefined ? 1 : o.sobran })) }, o.extra || {});
  // El alto del juego: el de la figura más alta de n = 10 a 60 (así no salta).
  let alto4 = null;
  const altoJuego4 = () => { if (alto4) return alto4; let h = 0; for (let n = 10; n <= 60; n++) h = Math.max(h, Kit.piezas[RP].geometria(empaca(n, [4, 6])).H); return (alto4 = h); };
  const USADOS4 = new Set(['4-6-1', '4-6-10-1', '2-3-1', '3-5-2', '6-8-5', '4-6-3', '6-9-2', '2-3-5-1', '6-8-9-5', '4-5-6-3', '2-3-4-1', '30-40-5', '8-10-12-7']);
  const clave4 = (ds, r) => `${ds.join('-')}-${r}`;
  const sobranTxt = k => (k === 1 ? 'sobra 1' : `sobran ${k}`);
  const loQue = k => (k === 1 ? 'el caramelo que sobra' : `los ${k} que sobran`);

  // Ahora tú · tipo 0: el menor N, más grande que los divisores, que deja el mismo resto con A y con B.
  function casoMismo(r) {
    const a = r.ent(3, 10), b = r.ent(a + 1, 15), M = mcm(a, b), rr = r.ent(1, a - 1);
    if (mcd(a, b) === 1 || b % a === 0 || M > 90 || USADOS4.has(clave4([a, b], rr)) || M - rr <= 0) return null;
    return conMu({
      pregunta: `Un paquete de caramelos tiene más de ${b}. En bolsitas de ${a} ${sobranTxt(rr)}, y en bolsitas de ${b} también ${sobranTxt(rr)}. ¿Cuál es la menor cantidad posible?`,
      datos: [D4.forma, D4.comun, D4.fac],
      opciones: opciones(M + rr, [
        { id: 'producto', valor: a * b + rr, error: 'AT-RESTO-PRODUCTO', siFuera: `Bien sumar ${loQue(rr)}. Pero ${a * b} es ${a} × ${b}; el primer múltiplo de los dos es ${M}.` },
        { id: 'olvida', valor: M, error: 'AT-RESTO-OLVIDA', siFuera: `Bien: ${M} es múltiplo de ${a} y de ${b}. Pero así no sobra nada: falta sumar ${loQue(rr)}.` },
        { id: 'resta', valor: M - rr, error: 'AT-RESTO-RESTA', siFuera: `Bien el MCM, ${M}. Pero ${loQue(rr)} se suma, no se resta.` },
      ]),
      solucion: { texto: `Sin ${loQue(rr)}, es múltiplo de ${a} y de ${b}: de MCM(${a}, ${b}) = ${M}.`, ecuacion: ['N = ', MU(ml(M)), ' + ', sb(rr), SEP, `${M} + ${rr} = ${M + rr}`] },
    });
  }
  // Ahora tú · tipo 1: restos distintos, pero falta lo mismo (homogeneizar; San Marcos 2026-II).
  function casoFalta(r) {
    const tres = r() < 0.5, ds = [];
    for (let i = 0; i < 30 && ds.length < (tres ? 3 : 2); i++) { const d = r.ent(3, 12); if (!ds.includes(d)) ds.push(d); }
    ds.sort((x, y) => x - y);
    const fa = r.ent(1, 2), M = mcmL(ds);
    if (ds.length < (tres ? 3 : 2) || M > 180 || ds.some(d => d <= fa + 1) || ds.some((d, i) => ds.some((e, j) => j > i && e % d === 0)) || USADOS4.has(clave4(ds, -fa))) return null;
    const restos = ds.map(d => d - fa), P = ds.reduce((x, y) => x * y, 1);
    const frase = ds.map((d, i) => `${i === 0 ? 'en bolsitas de' : 'de'} ${d} sobran ${restos[i]}`);
    return conMu({
      pregunta: `Doña Juana empaca un paquete de caramelos: ${frase.slice(0, -1).join(', ')} y ${frase[frase.length - 1]}. ¿Cuál es la menor cantidad posible?`,
      datos: [D4.forma, D4.falta, D4.comun, D4.fac],
      opciones: opciones(M - fa, [
        { id: 'primero', valor: M + restos[0], error: 'AT-RESTO-PRIMERO', siFuera: `Bien usar el MCM, ${M}. Pero los restos son distintos: lo que se repite es lo que falta, ${fa}.` },
        { id: 'suma', valor: M + fa, error: 'AT-FALTA-SUMA', siFuera: `Bien ver que falta ${fa} en todas. Pero si falta, se resta: ${M} − ${fa}.` },
        { id: 'producto', valor: P - fa, error: 'AT-RESTO-PRODUCTO', siFuera: `Bien restar lo que falta. Pero ${P} es el producto; el primer múltiplo común es ${M}.` },
      ]),
      solucion: { texto: `A cada bolsita le falta ${fa} para llenarse: N + ${fa} es múltiplo de MCM = ${M}.`, ecuacion: ['N = ', MU(ml(M)), ' − ', sb(fa), SEP, `${M} − ${fa} = ${M - fa}`] },
    });
  }
  // Ahora tú · tipo 2 (San Marcos 2024-II): el menor de tres cifras con el mismo resto entre tres divisores.
  function casoTresCifras(r) {
    const ds = [r.ent(3, 8), r.ent(6, 12), r.ent(9, 15)];
    if (!(ds[0] < ds[1] && ds[1] < ds[2])) return null;
    const M = mcmL(ds), rr = r.ent(1, ds[0] - 1), P = ds[0] * ds[1] * ds[2];
    if (M >= 100 || M < 20 || P === M || USADOS4.has(clave4(ds, rr))) return null;
    let k = 0; while (M * k + rr < 100) k++;
    const N = M * k + rr, sin = M * k;
    let kp = 0; while (P * kp + rr < 100) kp++;
    return conMu({
      pregunta: `¿Cuál es el menor número de tres cifras que deja resto ${rr} al dividirlo entre ${ds[0]}, entre ${ds[1]} y entre ${ds[2]}?`,
      datos: [D4.forma, D4.lista, D4.fac, D4.tres],
      opciones: opciones(N, [
        { id: 'cota', valor: M + rr, error: 'AT-COTA-OLVIDA', siFuera: `Bien: ${M + rr} deja resto ${rr} con los tres. Pero no tiene tres cifras.` },
        { id: 'olvida', valor: sin, error: 'AT-RESTO-OLVIDA', siFuera: `Bien llegar a tres cifras con un múltiplo de ${M}. Pero ${sin} no deja resto: falta sumar ${rr}.` },
        { id: 'producto', valor: P * kp + rr, error: 'AT-RESTO-PRODUCTO', siFuera: `Bien sumar ${rr}. Pero se usan los múltiplos de ${M}, el MCM, no de ${P}.` },
      ]),
      solucion: { texto: `MCM = ${M}; los que dejan ${rr} son ${M} × k + ${rr}. El primero de tres cifras tiene k = ${k}.`, ecuacion: [`${M} × ${k} + ${rr} = ${N}`] },
    });
  }
  // Ahora tú · tipo 3 (nivel examen): el mayor de tres cifras con el mismo resto.
  function casoMayor(r) {
    const a = r.ent(4, 12), b = r.ent(a + 1, 18), M = mcm(a, b), rr = r.ent(1, a - 1);
    if (mcd(a, b) === 1 || b % a === 0 || M < 30 || M > 150 || USADOS4.has(clave4([a, b], rr))) return null;
    let k = Math.floor((999 - rr) / M); const N = M * k + rr;
    const sin = M * Math.floor(999 / M), pasa = M * (k + 1) + rr;
    if (sin === N || pasa <= 999) return null;
    return conMu({
      pregunta: `¿Cuál es el mayor número de tres cifras que deja resto ${rr} al dividirlo entre ${a} y entre ${b}?`,
      datos: [D4.forma, D4.lista, D4.fac, D4.tres],
      opciones: opciones(N, [
        { id: 'pasa', valor: pasa, error: 'AT-COTA-PASA', siFuera: `Bien: ${pasa} deja resto ${rr} con los dos. Pero tiene cuatro cifras.` },
        { id: 'olvida', valor: sin, error: 'AT-RESTO-OLVIDA', siFuera: `Bien el mayor múltiplo de ${M} de tres cifras. Pero ${sin} no deja resto: falta el ${rr}.` },
        { id: 'antes', valor: N - M, error: 'AT-COTA-OLVIDA', siFuera: `Bien: ${N - M} deja resto ${rr} con los dos. Pero hay uno mayor de tres cifras.` },
      ]),
      solucion: { texto: `MCM = ${M}: sirven ${M} × k + ${rr}. El último que no pasa de 999 tiene k = ${k}.`, ecuacion: [`${M} × ${k} + ${rr} = ${N}`] },
    });
  }
  // Ahora tú · tipo 4 (San Marcos 2023-I): el mismo resto con dos divisores y múltiplo de un tercero.
  function casoTercero(r) {
    const a = r.ent(2, 6), b = r.ent(a + 1, 9), c = r.de([5, 7, 11]), rr = 1, M = mcm(a, b);
    if (b % a === 0 || mcd(M, c) !== 1 || M > 40 || USADOS4.has(clave4([a, b, c], rr))) return null;
    let N = M + rr; while (N % c) N += M;
    if (N === M + rr || N > 400) return null;
    const M3 = mcmL([a, b, c]);
    return conMu({
      pregunta: `Un paquete deja 1 caramelo suelto con bolsitas de ${a} y con bolsitas de ${b}, y ninguno con bolsitas de ${c}. ¿Cuál es la menor cantidad posible?`,
      datos: [D4.forma, D4.lista, D4.fac],
      opciones: opciones(N, [
        { id: 'olvida', valor: M + rr, error: 'AT-TERCERO-OLVIDA', siFuera: `Bien: ${M + rr} deja 1 con ${a} y con ${b}. Pero con ${c} sobran ${(M + rr) % c}.` },
        { id: 'multiplica', valor: M * c + rr, error: 'AT-TERCERO-MULTIPLICA', siFuera: `Bien juntar los tres números. Pero ${M * c + rr} deja ${(M * c + rr) % c} con bolsitas de ${c}.` },
        { id: 'mcm3', valor: M3, error: 'AT-RESTO-OLVIDA', siFuera: `Bien que sea múltiplo de ${c}. Pero ${M3} no deja 1 con ${a}: no sobra nada.` },
      ]),
      solucion: { texto: `Sirven ${M} × k + 1. Pruebo k = 1, 2, 3… hasta que salga un múltiplo de ${c}.`, ecuacion: [`${M} × ${(N - 1) / M} + 1 = ${N} = ${c} × ${N / c}`] },
    });
  }

  // Ejemplos resueltos (idea 4). Cuentas rehechas aparte (cuentas.py, por fuerza bruta): resto 1 con 2 y 3: 7; 5̊ + 3;
  // 25 y 37 dejan 1 con 4 y 6 (30 no); 7 × k + 5 = 7 × (k + 1) − 2; resto 2 con 3 y 5: 17; resto 5 con 6 y 8, más de 10:
  // 29; sobran 3 con 4 y 5 con 6: 11; resto 2 con 6 y 9 entre 100 y 150: 110, 128 y 146; resto 1 con 2, 3 y 5: 31; resto 3
  // con 4 y 6, de dos cifras: 99; resto 5 con 6, 8 y 9, de tres cifras: 149 (77, 144, 437, 221); resto 3, 4 y 5 con 4, 5 y
  // 6 entre 200 y 280: 239 (241, 243, 240, 59); 1 con 2, 3 y 4 y múltiplo de 7: 49 (13, 84, 85, 25); resto 5 con 30 y 40
  // entre 300 y 400: 365 (360, 1205, 125, 245); resto 7 con 8, 10 y 12, mayor de tres cifras: 967 (960, 1087, 847, 127).
  // Ninguno usa la predicción (4, 6 y 10 con resto 1) ni la misión (49).
  const EJEMPLOS_RESTO = [
    { nivel: 1, titulo: 'Sobra 1 con 2 y 3',
      enunciado: '¿Cuál es el menor número mayor que 1 que deja resto 1 al dividirlo entre 2 y entre 3?',
      datos: [D4.forma, D4.comun],
      solucion: [{ texto: 'Sin el resto, el número es múltiplo de 2 y de 3, y por eso de MCM(2, 3) = 6. El primero es 6 + 1.', ecuacion: ['N = ', MU(ml(6)), ' + ', sb(1), SEP, '6 + 1 = 7'] }],
      respuesta: ['El 7'] },
    { nivel: 1, titulo: 'Con el circulito',
      enunciado: 'Escribe con el circulito: «al dividir N entre 5 sobran 3».',
      datos: [D4.forma],
      solucion: [{ texto: 'N es un múltiplo de 5 más los 3 que sobran.' }],
      respuesta: ['N = ', MU('5'), ' + ', sb(3)] },
    { nivel: 1, titulo: 'Cuáles sirven con 4 y 6',
      enunciado: '¿Cuáles de estos números dejan resto 1 al dividirlos entre 4 y también entre 6: 25, 30 o 37?',
      datos: [D4.forma, D4.comun],
      solucion: [{ texto: 'Sin el resto quedan 24, 29 y 36. Solo 24 y 36 son múltiplos de 4 y de 6, es decir, de 12.', ecuacion: ['25 = 12 × 2 + ', sb(1), SEP, '37 = 12 × 3 + ', sb(1)] }],
      respuesta: ['El 25 y el 37'] },
    { nivel: 1, titulo: 'Lo que falta',
      enunciado: 'Al dividir N entre 7 sobran 5. ¿Cuánto le falta a N para el siguiente múltiplo de 7?',
      datos: [D4.forma, D4.falta, D4.resto],
      solucion: [{ texto: 'Si sobran 5, faltan 7 − 5 = 2 para llenar otro grupo de 7.', ecuacion: ['N = ', MU('7'), ' + ', sb(5), ' = ', MU('7'), ' − ', sb(2)] }],
      respuesta: ['Le faltan ', sb(2)] },
    { nivel: 1, titulo: 'Resto 2 con 3 y 5',
      enunciado: '¿Cuál es el menor número mayor que 2 que deja resto 2 al dividirlo entre 3 y entre 5?',
      datos: [D4.forma, D4.comun],
      solucion: [{ texto: 'Sin el resto, es múltiplo de MCM(3, 5) = 15.', ecuacion: ['N = ', MU(ml(15)), ' + ', sb(2), SEP, '15 + 2 = 17'] }],
      respuesta: ['El 17'] },
    { nivel: 2, titulo: 'Bolsitas de 6 y de 8',
      enunciado: 'Doña Juana empaca un paquete de más de 10 caramelos. En bolsitas de 6 le sobran 5, y en bolsitas de 8 también le sobran 5. ¿Cuántos tiene, como mínimo?',
      datos: [D4.forma, D4.comun, D4.fac],
      figura: { pieza: RP, datos: cerrado([6, 8], { sobran: 5 }), estado: {} },
      solucion: [
        { texto: 'Sin los 5 sueltos, el paquete es múltiplo de 6 y de 8: de su MCM.', ecuacion: ['6 = 2 × 3', SEP, '8 = 2³', SEP, 'MCM = 2³ × 3 = ', ml(24)] },
        { texto: 'El menor, de más de 10, es 24 + 5.', ecuacion: ['N = ', MU(ml(24)), ' + ', sb(5), SEP, '24 + 5 = 29'] },
      ],
      respuesta: ['29 caramelos'] },
    { nivel: 2, titulo: 'Falta lo mismo en las dos',
      enunciado: 'Con bolsitas de 4 le sobran 3 caramelos, y con bolsitas de 6 le sobran 5. ¿Cuál es la menor cantidad de caramelos posible?',
      datos: [D4.forma, D4.falta, D4.comun],
      figura: { pieza: RP, datos: cerrado([{ d: 4, sobran: 3 }, { d: 6, sobran: 5 }]), estado: {} },
      solucion: [
        { texto: 'Los restos son distintos, pero en las dos falta 1 para otra bolsita: 4 − 3 = 1 y 6 − 5 = 1.' },
        { texto: 'Con 1 caramelo más, el paquete sería múltiplo de 4 y de 6, es decir, de 12.', ecuacion: ['N = ', MU(ml(12)), ' − ', sb(1), SEP, '12 − 1 = 11'] },
      ],
      respuesta: ['11 caramelos'] },
    { nivel: 2, titulo: 'Entre 100 y 150',
      enunciado: '¿Cuántos números entre 100 y 150 dejan resto 2 al dividirlos entre 6 y entre 9?',
      datos: [D4.forma, D4.lista, D4.fac],
      solucion: [
        { texto: 'Los que dejan 2 con 6 y con 9 son MCM × k + 2, con MCM(6, 9) = 18.', ecuacion: ['6 = 2 × 3', SEP, '9 = 3²', SEP, 'MCM = 2 × 3² = ', ml(18)] },
        { texto: 'Entre 100 y 150: 18 × 6 + 2 = 110, 18 × 7 + 2 = 128 y 18 × 8 + 2 = 146.' },
      ],
      respuesta: ['3 números: 110, 128 y 146'] },
    { nivel: 2, titulo: 'Tres bolsitas',
      enunciado: '¿Cuál es el menor número mayor que 1 que deja resto 1 al dividirlo entre 2, entre 3 y entre 5?',
      datos: [D4.forma, D4.comun, D4.fac],
      solucion: [
        { texto: 'Sin el resto, es múltiplo de 2, de 3 y de 5: de su MCM.', ecuacion: ['MCM(2, 3, 5) = 2 × 3 × 5 = ', ml(30)] },
        { texto: 'El primero mayor que 1 es 30 + 1.', ecuacion: ['N = ', MU(ml(30)), ' + ', sb(1), SEP, '30 + 1 = 31'] },
      ],
      respuesta: ['El 31'] },
    { nivel: 2, titulo: 'El mayor de dos cifras',
      enunciado: '¿Cuál es el mayor número de dos cifras que deja resto 3 al dividirlo entre 4 y entre 6?',
      datos: [D4.forma, D4.lista, D4.fac],
      solucion: [
        { texto: 'Los que dejan 3 son 12 × k + 3, porque MCM(4, 6) = 12.' },
        { texto: 'Con k = 8 da 99, que tiene dos cifras; con k = 9 ya pasa de 99.', ecuacion: ['12 × 8 + 3 = 99', SEP, '12 × 9 + 3 = 111'] },
      ],
      respuesta: ['El 99'] },
    { nivel: 3, titulo: 'El menor de tres cifras',
      enunciado: '¿Cuál es el menor número de tres cifras que deja resto 5 al dividirlo entre 6, entre 8 y entre 9?',
      alternativas: ['77', '144', '149', '437', '221'],
      datos: [D4.forma, D4.lista, D4.fac, D4.tres],
      solucion: [
        { texto: 'Los que dejan 5 con los tres son MCM × k + 5.', ecuacion: ['6 = 2 × 3', SEP, '8 = 2³', SEP, '9 = 3²', SEP, 'MCM = 2³ × 3² = ', ml(72)] },
        { texto: 'Con k = 1 da 77, de dos cifras; con k = 2 da 149.', ecuacion: ['72 × 2 + 5 = 149'] },
        { texto: ['Las trampas: ', letra('A'), ' no tiene tres cifras; ', letra('B'), ' olvida el resto; ', letra('D'), ' usa 6 × 8 × 9 + 5; ', letra('E'), ' es el siguiente, no el menor.'] },
      ],
      respuesta: [letra('C'), ': el 149'] },
    { nivel: 3, titulo: 'Le falta uno',
      enunciado: 'Una cantidad entre 200 y 280 deja resto 3 al dividirla entre 4, resto 4 entre 5 y resto 5 entre 6. ¿Cuál es?',
      alternativas: ['241', '243', '240', '59', '239'],
      datos: [D4.forma, D4.falta, D4.comun, D4.fac],
      solucion: [
        { texto: 'Los restos son distintos, pero a los tres les falta 1. Con 1 más, la cantidad es múltiplo de MCM(4, 5, 6) = 60.', ecuacion: ['N = ', MU(ml(60)), ' − ', sb(1)] },
        { texto: 'Entre 200 y 280 está 60 × 4 − 1 = 239; 60 × 5 − 1 = 299 ya pasa.' },
        { texto: ['Las trampas: ', letra('A'), ' suma lo que falta; ', letra('B'), ' usa el primer resto, 3; ', letra('C'), ' no resta nada; ', letra('D'), ' es el menor posible, fuera del rango pedido.'] },
      ],
      respuesta: [letra('E'), ': el 239'] },
    { nivel: 3, titulo: 'Y sin sobrante con 7',
      enunciado: 'Un paquete deja 1 caramelo suelto con bolsitas de 2, de 3 y de 4, y ninguno con bolsitas de 7. ¿Cuál es la menor cantidad posible?',
      alternativas: ['49', '13', '84', '85', '25'],
      datos: [D4.forma, D4.lista, D4.fac],
      solucion: [
        { texto: 'Los que dejan 1 con 2, 3 y 4 son MCM × k + 1, con MCM(2, 3, 4) = 12: 13, 25, 37, 49…' },
        { texto: 'El primero de esa lista que es múltiplo de 7 es 49.', ecuacion: ['12 × 4 + 1 = 49 = 7 × 7'] },
        { texto: ['Las trampas: ', letra('B'), ' no prueba el 7 (13 deja 6); ', letra('C'), ' es el MCM de los cuatro, sin sobrante; ', letra('D'), ' deja 1 con 7; ', letra('E'), ' deja 4 con 7.'] },
      ],
      respuesta: [letra('A'), ': 49 caramelos'] },
    { nivel: 3, titulo: 'Aulas con sobrante',
      enunciado: 'Si los alumnos de un colegio se sientan en aulas de 30, sobran 5; en aulas de 40, también sobran 5. Son entre 300 y 400. ¿Cuántos alumnos son?',
      alternativas: ['360', '1205', '125', '365', '245'],
      datos: [D4.forma, D4.lista, D4.fac],
      solucion: [
        { texto: 'Sin los 5 que sobran, son múltiplo de 30 y de 40: de MCM(30, 40) = 120.', ecuacion: ['30 = 2 × 3 × 5', SEP, '40 = 2³ × 5', SEP, 'MCM = 2³ × 3 × 5 = ', ml(120)] },
        { texto: 'Entre 300 y 400 solo está 120 × 3 + 5 = 365.' },
        { texto: ['Las trampas: ', letra('A'), ' olvida los 5; ', letra('B'), ' usa 30 × 40 + 5; ', letra('C'), ' y ', letra('E'), ' dejan 5, pero están fuera del rango pedido.'] },
      ],
      respuesta: [letra('D'), ': 365 alumnos'] },
    { nivel: 3, titulo: 'El mayor de tres cifras',
      enunciado: '¿Cuál es el mayor número de tres cifras que deja resto 7 al dividirlo entre 8, entre 10 y entre 12?',
      alternativas: ['960', '967', '1087', '847', '127'],
      datos: [D4.forma, D4.lista, D4.fac, D4.tres],
      solucion: [
        { texto: 'Los que dejan 7 son MCM × k + 7.', ecuacion: ['8 = 2³', SEP, '10 = 2 × 5', SEP, '12 = 2² × 3', SEP, 'MCM = 2³ × 3 × 5 = ', ml(120)] },
        { texto: 'Con k = 8 da 967; con k = 9 da 1087, de cuatro cifras.', ecuacion: ['120 × 8 + 7 = 967'] },
        { texto: ['Las trampas: ', letra('A'), ' olvida el resto; ', letra('C'), ' tiene cuatro cifras; ', letra('D'), ' deja 7, pero no es el mayor; ', letra('E'), ' es el menor de tres cifras.'] },
      ],
      respuesta: [letra('B'), ': el 967'] },
  ];

  const mismoResto = {
    id: 'mismo-resto',
    titulo: 'El mismo resto con varios divisores',
    pregunta: '¿Qué cantidad deja el mismo resto con bolsitas de distinto tamaño?',
    temas: ['Restos con varios divisores', 'Problemas de aplicación'],
    pieza: RP,
    aprendizaje: 'Si N deja el mismo resto con A y con B, N menos ese resto es múltiplo del MCM.',
    actividad: 'Cambiar cuántos caramelos tiene el paquete y empacarlos en bolsitas de 4 y de 6.',
    // Lee: el paquete cerrado y el circulito de Divisibilidad. No dice cuántos caramelos tiene el paquete de la predicción
    // (con bolsitas de 4, 6 y 10).
    lee: {
      tarjetas: [
        { titulo: 'El paquete de doña Juana', texto: 'Doña Juana tiene un paquete de caramelos y no sabe cuántos son. Si los empaca en bolsitas de 4, le sobra 1. Si los empaca en bolsitas de 6, también le sobra 1.',
          pieza: RP, dibujo: { datos: cerrado([4, 6]), estado: {} } },
        { titulo: 'Con el circulito', texto: ['Como en Divisibilidad, «con bolsitas de 4 sobra 1» se escribe N = ', MU('4'), ' + ', sb(1), ': un múltiplo de 4, más 1. N es la cantidad de caramelos del paquete.'],
          ecuacion: ['N = ', MU('4'), ' + ', sb(1), SEP, 'N = ', MU('6'), ' + ', sb(1)] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cambiar cuántos caramelos hay. Busca las cantidades que dejan 1 suelto con bolsitas de 4 y también con bolsitas de 6.' },
      ],
    },
    ejemplos: EJEMPLOS_RESTO.map(conMu),
    juega: {
      pieza: RP,
      consigna: 'Doña Juana empaca los mismos caramelos de dos formas: arriba en bolsitas de 4, abajo en bolsitas de 6.',
      mision: {
        // Una sola manera en la grilla: de 40 a 55, solo 49 deja 1 con 4 y con 6 (la prueba lo recorre).
        texto: 'Busca entre 40 y 55 caramelos una cantidad que deje 1 suelto en las dos formas.',
        logrado: v => v.n >= 40 && v.n <= 55 && v.n % 4 === 1 && v.n % 6 === 1,
        bien: '49: sobra 1 con 4 y con 6. Sin ese suelto, 48 se empaca justo.',
      },
      voz: 'Mira los sueltos de las dos filas.',
      leyenda: [
        { s: 'N', t: 'cuántos caramelos tiene el paquete' },
        { s: sb('sueltos'), t: 'los que no llenan otra bolsita' },
      ],
      controles: [{ id: 'n', etiqueta: 'Caramelos', min: 10, max: 60, paso: 1, inicio: 30, decimales: 0 }],
      dibujo: v => ({ datos: empaca(v.n, [4, 6], { alto: altoJuego4() }), estado: {} }),
      lectura: v => [`N = ${v.n}: sobran `, sb(v.n % 4), ' con 4 y ', sb(v.n % 6), ' con 6'],
      minimo: 3,
    },
    predice: {
      pieza: RP,
      pregunta: 'Doña Juana prueba ahora con bolsitas de 4, de 6 y de 10, y en las tres le sobra 1 caramelo. El paquete tiene más de 10. ¿Cuál es la menor cantidad que puede tener?',
      datos: ['Bolsitas de 4, de 6 y de 10', 'Con cada una sobra 1 caramelo; el paquete tiene más de 10'],
      voz: 'Piensa en el caramelo que sobra en las tres.',
      opciones: [
        { id: 'c', texto: '61', correcta: true },
        { id: 'producto', texto: '241', error: 'AT-RESTO-PRODUCTO', siFuera: 'Bien sumar el 1 que sobra. Pero 240 es 4 × 6 × 10; el primer múltiplo de los tres es 60.' },
        { id: 'dos', texto: '13', error: 'AT-RESTO-DOS', siFuera: 'Bien con bolsitas de 4 y de 6: 13 = 12 + 1. Pero con bolsitas de 10 sobran 3.' },
        { id: 'olvida', texto: '60', error: 'AT-RESTO-OLVIDA', siFuera: 'Bien: 60 se empaca justo con las tres. Pero así no sobra nada: falta el caramelo suelto.' },
      ],
      dibujo: { datos: cerrado([4, 6, 10]), estado: {} },
      revelar: { datos: empaca(61, [4, 6, 10]), estado: {} },
      coincide: 'Coincide: 61 − 1 = 60, el primer múltiplo de 4, de 6 y de 10.',
      noCoincide: 'Revisemos qué queda si se quita el caramelo suelto.',
    },
    mira: {
      pieza: RP,
      datos: Object.assign(empaca(61, [4, 6, 10]), { pasos: [{ repartos: [{ d: 4 }] }, { repartos: [{ d: 4 }, { d: 6 }] }, { repartos: [{ d: 4 }, { d: 6 }, { d: 10 }] }, {}, {}] }),
      voz: 'Quita el suelto y mira qué queda.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Con bolsitas de 4: 15 llenas y sobra 1.', ecuacion: ['61 = 4 × 15 + ', sb(1)] },
        { estado: { paso: 1 }, texto: 'Con bolsitas de 6: 10 llenas y sobra 1.', ecuacion: ['61 = 6 × 10 + ', sb(1)] },
        { estado: { paso: 2 }, texto: 'Con bolsitas de 10: 6 llenas y sobra 1.', ecuacion: ['61 = 10 × 6 + ', sb(1)] },
        { estado: { paso: 3 }, texto: 'Sin el suelto quedan 60: múltiplo de 4, de 6 y de 10.', ecuacion: ['MCM(4, 6, 10) = 2² × 3 × 5 = ', ml(60)] },
        { estado: { paso: 4 }, texto: 'Sirven todos los múltiplos de 60 más 1: 61, 121, 181…', ecuacion: ['N = ', MU(ml(60)), ' + ', sb(1)] },
      ],
    },
    regla: {
      texto: 'Si N deja el mismo resto r con A y con B, N − r es múltiplo de su MCM. Si les falta lo mismo, rₑ, N + rₑ lo es.',
      ecuacion: ['N = ', MU('4'), ' + ', sb(1), SEP, 'N = ', MU('6'), ' + ', sb(1), SEP, { llave: ['N = ', MU(ml(12)), ' + ', sb(1)], nota: 'MCM(4, 6) = 12' }, SEP, 'N = ', MU(ml('MCM')), ' − ', RE],
      condicion: 'el resto es menor que el divisor. Si los restos son distintos y falta lo mismo, se homogeneiza con lo que falta.',
      voz: 'Sin lo que sobra, es un múltiplo común.',
      dibujo: { pieza: RP, datos: empaca(61, [4, 6, 10]), estado: {} },
    },
    // Así se resuelve: el mayor de dos cifras con el mismo resto. «Ahora tú» pide el menor con el mismo resto, restos
    // distintos con lo mismo que falta, el menor y el mayor de tres cifras, y un tercer divisor sin sobrante.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const a = r.ent(3, 8), b = r.ent(a + 1, 12), M = mcm(a, b), rr = r.ent(1, a - 1);
          if (mcd(a, b) === 1 || b % a === 0 || M < 12 || M > 45 || USADOS4.has(clave4([a, b], rr))) continue;
          const k = Math.floor((99 - rr) / M), N = M * k + rr;
          return conMu({
            enunciado: `¿Cuál es el mayor número de dos cifras que deja resto ${rr} al dividirlo entre ${a} y entre ${b}?`,
            datos: [D4.forma, D4.lista, D4.fac],
            pasos: [
              { tipo: 'pide', texto: `Piden el mayor número de dos cifras, es decir, hasta 99, que deja ${rr} con ${a} y con ${b}.` },
              { tipo: 'datos', texto: `El resto es el mismo, ${rr}, con los dos divisores.` },
              { tipo: 'regla', texto: `Sin el resto, el número es múltiplo de ${a} y de ${b}, y por eso de su MCM: N = MCM × k + ${rr}.` },
              { tipo: 'cuentas', texto: 'Hallo el MCM con primos.', ecuacion: [`${a} = ${canon(a)}`, SEP, `${b} = ${canon(b)}`, SEP, `MCM = ${canon(M)} = `, ml(M)] },
              { tipo: 'cuentas', texto: `Pruebo el k más grande que no pasa de 99: k = ${k}.`, ecuacion: [`${M} × ${k} + ${rr} = ${N}`, SEP, `${M} × ${k + 1} + ${rr} = ${M * (k + 1) + rr}`] },
              { tipo: 'sentido', texto: `Comprueba: ${N} = ${a} × ${(N - rr) / a} + ${rr} y ${N} = ${b} × ${(N - rr) / b} + ${rr}.` },
            ],
            respuesta: `El ${N}.`,
          });
        }
      },
    },
    ahoraTu: {
      voz: 'Quita lo que sobra y busca un múltiplo común.',
      generar(sem) {
        const r = azar(sem + 43), tipo = sem % 5;
        return conCuatro([casoMismo, casoFalta, casoTresCifras, casoMayor, casoTercero][tipo], r);
      },
    },
  };

  // ---------- Idea 5 (nueva, 19 nov): múltiplos de uno o de otro (inclusión y exclusión) ----------
  // Propuesta §1 a §7 (vino de Divisibilidad: docs/etapa5/decisiones.md, San Marcos 2026-II). Objeto: la plancha de la
  // rifa con dos premios (arit-boletos, bloque «premios»), del 1 al 60. Cambia: cada cuántos boletos va cada premio. ·
  // Permanece: la plancha del 1 al 60. · Progresa: los de caramelo → los de gaseosa → los que tienen los dos, que se
  // cuentan dos veces. · Se reserva: la rifa de 120 boletos (la predicción). · Debe verse: los boletos con algún premio
  // son menos que la suma de las dos cuentas: los de los dos premios están en las dos.
  // Errores (hipótesis de aula; una con trampa deducida de San Marcos 2026-II): AT-IE-SUMA suma las dos cuentas sin
  // quitar los repetidos (la trampa de San Marcos) · AT-IE-DOBLE quita dos veces los repetidos · AT-IE-SOLO-AMBOS responde
  // solo los de los dos · AT-PRODUCTO cuenta los múltiplos de A × B · AR13 cuenta los múltiplos del MCD · AT-NINGUNO-
  // ALGUNO responde los que sí tienen premio · AT-SOLO-INCLUYE deja dentro a los de los dos premios · AT-SOLO-UNO cuenta
  // solo un premio · AT-CONTEO-SIN-QUITAR cuenta desde 1 en un tramo (de Divisibilidad) · AT-IE-TRES-OLVIDA no suma los
  // de los tres · AT-OLVIDA-TERCERO deja fuera un número.
  const D5 = {
    cuantos: L => `Del 1 al ${f(L, 0)} hay tantos múltiplos de un número como el cociente entero de ${f(L, 0)} ÷ ese número`,
    ambos: 'Los múltiplos de A y de B a la vez son los múltiplos de MCM(A, B)',
    ie: 'Múltiplos de A o de B: los de A + los de B − los de los dos',
    ninguno: 'Los que no son de A ni de B: el total menos los de A o de B',
    tramo: 'En un tramo que no empieza en 1, se restan los múltiplos que hay antes del tramo',
    tres: 'De A, de B o de C: los de cada uno − los de cada par + los de los tres',
    fac: D2.fac,
  };
  const cuenta = (L, d) => Math.floor(L / d);
  const deUnoU = (L, a, b) => cuenta(L, a) + cuenta(L, b) - cuenta(L, mcm(a, b));
  const USADOS5 = new Set(['4-6-120', '3-10-60', '4-6-60', '4-6-30', '7-100', '4-6-50', '3-5-30', '5-6-60', '2-3-20', '8-12-200', '4-10-100', '6-9-90', '4-6-50', '6-15-999', '6-10-150', '10-15-240']);

  // Ahora tú · tipo 0: múltiplos de A y de B a la vez.
  function casoAmbos(r) {
    const a = r.ent(4, 12), b = r.ent(a + 1, 18), g = mcd(a, b), M = mcm(a, b), L = r.de([100, 120, 150, 200, 300]);
    if (g === 1 || b % a === 0 || cuenta(L, M) < 2 || a * b > L || USADOS5.has(`${a}-${b}-${L}`)) return null;
    return {
      pregunta: `Del 1 al ${L}, ¿cuántos números son múltiplos de ${a} y de ${b} a la vez?`,
      datos: [D5.cuantos(L), D5.ambos, D5.fac],
      opciones: opciones(cuenta(L, M), [
        { id: 'producto', valor: cuenta(L, a * b), error: 'AT-PRODUCTO', siFuera: `Bien buscar los de los dos. Pero son los múltiplos de MCM = ${M}, no de ${a} × ${b}.` },
        { id: 'suma', valor: cuenta(L, a) + cuenta(L, b), error: 'AT-IE-SUMA', siFuera: `Bien contar los de cada uno, ${cuenta(L, a)} y ${cuenta(L, b)}. Pero «a la vez» es estar en las dos cuentas.` },
        { id: 'mcd', valor: cuenta(L, g), error: 'AR13', siFuera: `Bien buscar lo común. Pero los múltiplos comunes son de MCM = ${M}, no de MCD = ${g}.` },
      ]),
      solucion: { texto: `Son los múltiplos de MCM(${a}, ${b}) = ${M}.`, ecuacion: [`${L} = `, ml(M), ` × ${cuenta(L, M)} + `, sb(L % M)] },
    };
  }
  // Ahora tú · tipo 1: múltiplos de A o de B.
  function casoAlguno(r) {
    const a = r.ent(3, 10), b = r.ent(a + 1, 15), g = mcd(a, b), M = mcm(a, b), L = r.de([60, 80, 100, 120, 150, 200]);
    if (g === 1 || b % a === 0 || cuenta(L, M) < 2 || USADOS5.has(`${a}-${b}-${L}`)) return null;
    const cA = cuenta(L, a), cB = cuenta(L, b), cM = cuenta(L, M);
    return {
      pregunta: `Del 1 al ${L}, ¿cuántos números son múltiplos de ${a} o de ${b}?`,
      datos: [D5.cuantos(L), D5.ambos, D5.ie],
      opciones: opciones(cA + cB - cM, [
        { id: 'suma', valor: cA + cB, error: 'AT-IE-SUMA', siFuera: `Bien: ${cA} de ${a} y ${cB} de ${b}. Pero los ${cM} múltiplos de ${M} se contaron dos veces.` },
        { id: 'doble', valor: cA + cB - 2 * cM, error: 'AT-IE-DOBLE', siFuera: `Bien quitar los repetidos. Pero se quitan una sola vez: ${cA + cB} − ${cM}, no ${cA + cB} − ${2 * cM}.` },
        { id: 'ambos', valor: cM, error: 'AT-IE-SOLO-AMBOS', siFuera: `Esos ${cM} son múltiplos de los dos. Pero también cuentan los que son de uno solo.` },
      ]),
      solucion: { texto: `${cA} de ${a}, ${cB} de ${b} y ${cM} de los dos (múltiplos de ${M}).`, ecuacion: [`${cA} + ${cB} − ${cM} = ${cA + cB - cM}`] },
    };
  }
  // Ahora tú · tipo 2: los boletos que no ganan nada.
  function casoNinguno(r) {
    const a = r.ent(3, 10), b = r.ent(a + 1, 15), g = mcd(a, b), M = mcm(a, b), L = r.de([60, 90, 100, 120, 150]);
    if (g === 1 || b % a === 0 || cuenta(L, M) < 2 || USADOS5.has(`${a}-${b}-${L}`)) return null;
    const cA = cuenta(L, a), cB = cuenta(L, b), cM = cuenta(L, M), al = cA + cB - cM;
    return {
      pregunta: `En una rifa de ${L} boletos, ganan caramelo los múltiplos de ${a} y gaseosa los múltiplos de ${b}. ¿Cuántos boletos no ganan ningún premio?`,
      datos: [D5.cuantos(L), D5.ambos, D5.ie, D5.ninguno],
      opciones: opciones(L - al, [
        { id: 'suma', valor: L - cA - cB, error: 'AT-IE-SUMA', siFuera: `Bien restar del total. Pero los ${cM} de los dos premios se restaron dos veces.` },
        { id: 'alguno', valor: al, error: 'AT-NINGUNO-ALGUNO', siFuera: `Esos ${al} ganan algún premio. Se piden los que no ganan nada.` },
        { id: 'doble', valor: L - (cA + cB - 2 * cM), error: 'AT-IE-DOBLE', siFuera: `Bien quitar los repetidos. Pero una sola vez: con algún premio hay ${al}, no ${cA + cB - 2 * cM}.` },
      ]),
      solucion: { texto: `Con algún premio: ${cA} + ${cB} − ${cM} = ${al}. Los demás no ganan nada.`, ecuacion: [`${L} − ${al} = ${L - al}`] },
    };
  }
  // Ahora tú · tipo 3: los que ganan exactamente un premio.
  function casoSolo(r) {
    const a = r.ent(3, 10), b = r.ent(a + 1, 15), g = mcd(a, b), M = mcm(a, b), L = r.de([60, 90, 100, 120, 150]);
    if (g === 1 || b % a === 0 || cuenta(L, M) < 2 || USADOS5.has(`${a}-${b}-${L}`)) return null;
    const cA = cuenta(L, a), cB = cuenta(L, b), cM = cuenta(L, M);
    return {
      pregunta: `En una rifa de ${L} boletos, ganan caramelo los múltiplos de ${a} y gaseosa los múltiplos de ${b}. ¿Cuántos boletos ganan exactamente un premio?`,
      datos: [D5.cuantos(L), D5.ambos, D5.ie],
      opciones: opciones(cA + cB - 2 * cM, [
        { id: 'incluye', valor: cA + cB - cM, error: 'AT-SOLO-INCLUYE', siFuera: `Bien quitar los repetidos. Pero los ${cM} de los dos premios no ganan uno solo: se quitan del todo.` },
        { id: 'suma', valor: cA + cB, error: 'AT-IE-SUMA', siFuera: `Bien contar los de cada premio. Pero ahí están los ${cM} que ganan los dos.` },
        { id: 'uno', valor: cA - cM, error: 'AT-SOLO-UNO', siFuera: `Bien: ${cA - cM} ganan solo caramelo. Faltan los que ganan solo gaseosa.` },
      ]),
      solucion: { texto: `Solo caramelo: ${cA} − ${cM}; solo gaseosa: ${cB} − ${cM}.`, ecuacion: [`${cA - cM} + ${cB - cM} = ${cA + cB - 2 * cM}`] },
    };
  }
  // Ahora tú · tipo 4 (nivel examen): en un tramo que no empieza en 1.
  function casoTramo(r) {
    const a = r.ent(4, 12), b = r.ent(a + 1, 18), g = mcd(a, b), M = mcm(a, b);
    if (g === 1 || b % a === 0 || M > 60) return null;
    const lo = r.de([50, 100, 200]), hi = lo + r.de([100, 150, 200]);
    const n = L => deUnoU(L, a, b), bien = n(hi) - n(lo - 1);
    const soloA = (cuenta(hi, a) - cuenta(lo - 1, a)) + (cuenta(hi, b) - cuenta(lo - 1, b));
    return {
      pregunta: `¿Cuántos números del ${lo} al ${hi} son múltiplos de ${a} o de ${b}?`,
      datos: [D5.cuantos(hi), D5.ambos, D5.ie, D5.tramo],
      opciones: opciones(bien, [
        { id: 'desde1', valor: n(hi), error: 'AT-CONTEO-SIN-QUITAR', siFuera: `Bien contar con el MCM. Pero ${n(hi)} cuenta desde el 1: faltan quitar los ${n(lo - 1)} de antes del ${lo}.` },
        { id: 'suma', valor: soloA, error: 'AT-IE-SUMA', siFuera: `Bien quitar los de antes del ${lo}. Pero los múltiplos de ${M} se contaron dos veces.` },
        { id: 'ambos', valor: cuenta(hi, M) - cuenta(lo - 1, M), error: 'AT-IE-SOLO-AMBOS', siFuera: `Esos son los de los dos a la vez. También cuentan los que son de uno solo.` },
      ]),
      solucion: { texto: `Del 1 al ${hi} hay ${n(hi)}; del 1 al ${lo - 1}, ${n(lo - 1)}.`, ecuacion: [`${n(hi)} − ${n(lo - 1)} = ${bien}`] },
    };
  }
  // Ahora tú · tipo 5 (San Marcos 2026-II): tachar los múltiplos de tres primos, uno tras otro.
  function casoTachar(r) {
    const [a, b, c] = r.de([[2, 3, 5], [2, 3, 7], [2, 5, 7], [3, 5, 7]]), L = r.de([60, 70, 84, 90, 100, 105, 120]);
    if (USADOS5.has(`${a}-${b}-${c}-${L}`)) return null;
    const k = d => cuenta(L, d), todos = k(a) + k(b) + k(c) - k(a * b) - k(a * c) - k(b * c) + k(a * b * c);
    return {
      pregunta: `En una lista del 1 al ${L} se tachan primero los múltiplos de ${a}, después los múltiplos de ${b} que quedan y al final los de ${c} que quedan. ¿Cuántos números se tachan?`,
      datos: [D5.cuantos(L), D5.ie, D5.tres],
      opciones: opciones(todos, [
        { id: 'suma', valor: k(a) + k(b) + k(c), error: 'AT-IE-SUMA', siFuera: `Bien contar los de cada número. Pero muchos ya estaban tachados: así se cuentan dos veces.` },
        { id: 'olvida', valor: todos - k(a * b * c), error: 'AT-IE-TRES-OLVIDA', siFuera: `Bien restar los de cada par. Pero los múltiplos de ${a * b * c} se restaron de más: falta sumarlos.` },
        { id: 'quedan', valor: L - todos, error: 'AT-NINGUNO-ALGUNO', siFuera: `Esos ${L - todos} son los que quedan sin tachar. Se piden los tachados.` },
      ]),
      solucion: { texto: `${k(a)} + ${k(b)} + ${k(c)} − ${k(a * b)} − ${k(a * c)} − ${k(b * c)} + ${k(a * b * c)}.`, ecuacion: [`${k(a) + k(b) + k(c)} − ${k(a * b) + k(a * c) + k(b * c)} + ${k(a * b * c)} = ${todos}`] },
    };
  }

  // Ejemplos resueltos (idea 5). Cuentas rehechas aparte (cuentas.py, contando uno por uno): múltiplos de 7 hasta 100:
  // 14; de 4 y 6 hasta 50: 4; de 3 o 5 hasta 30: 14; de 5 y 6 hasta 60: 2; ni de 2 ni de 3 hasta 20: 7; de 8 o 12 hasta
  // 200: 33; un solo premio: 25; ni de 4 ni de 10 hasta 100: 70; de 6 o 9 hasta 90: 20; de 4 y 6 entre 50 y 100: 4;
  // tachados con 2, 3 y 5 hasta 60: 44 (62, 16, 42, 30); de 6 o 15 de tres cifras: 180 (210, 199, 150, 30); un solo
  // premio con 6 y 10 hasta 150: 30 (35, 40, 5, 115); ni de 2, 3 ni 5 hasta 100: 26 (29, 74, 3, 33); ninguno con 10 y 15
  // hasta 240: 208 (200, 32, 232, 8). Ninguno usa la predicción (4 y 6 hasta 120) ni la misión (3 y 10 hasta 60).
  const EJEMPLOS_TRAMO = [
    { nivel: 1, titulo: 'Múltiplos de 7 hasta 100',
      enunciado: '¿Cuántos múltiplos de 7 hay del 1 al 100?',
      datos: [D5.cuantos(100)],
      solucion: [{ texto: 'El cociente entero de 100 ÷ 7: los múltiplos son 7, 14, …, 98.', ecuacion: ['100 = 7 × 14 + ', sb(2)] }],
      respuesta: ['14 múltiplos'] },
    { nivel: 1, titulo: 'Comunes de 4 y 6',
      enunciado: '¿Cuántos números del 1 al 50 son múltiplos de 4 y de 6 a la vez?',
      datos: [D5.cuantos(50), D5.ambos],
      solucion: [{ texto: 'Son los múltiplos de MCM(4, 6) = 12: 12, 24, 36 y 48.', ecuacion: ['50 = ', ml(12), ' × 4 + ', sb(2)] }],
      respuesta: ['4 números'] },
    { nivel: 1, titulo: 'De 3 o 5 hasta 30',
      enunciado: '¿Cuántos números del 1 al 30 son múltiplos de 3 o de 5?',
      datos: [D5.cuantos(30), D5.ambos, D5.ie],
      solucion: [{ texto: 'Hay 10 de 3 y 6 de 5. El 15 y el 30, múltiplos de 15, están en las dos cuentas.', ecuacion: ['10 + 6 − 2 = 14'] }],
      respuesta: ['14 números'] },
    { nivel: 1, titulo: 'Los de los dos premios',
      enunciado: 'En una rifa de 60 boletos, ganan caramelo los múltiplos de 5 y gaseosa los múltiplos de 6. ¿Cuántos boletos ganan los dos premios?',
      datos: [D5.cuantos(60), D5.ambos],
      figura: { pieza: BO, datos: plancha(5, 6, { extra: { marcarPremios: false } }), estado: {} },
      solucion: [{ texto: 'Los dos premios caen en los múltiplos de MCM(5, 6) = 30: el 30 y el 60.', ecuacion: ['60 = ', ml(30), ' × 2'] }],
      respuesta: ['2 boletos'] },
    { nivel: 1, titulo: 'Ni de 2 ni de 3',
      enunciado: '¿Cuántos números del 1 al 20 no son múltiplos de 2 ni de 3?',
      datos: [D5.cuantos(20), D5.ie, D5.ninguno],
      solucion: [{ texto: 'De 2 o de 3 hay 10 + 6 − 3 = 13 (el 6, el 12 y el 18 están en las dos cuentas). Quedan 20 − 13.', ecuacion: ['20 − 13 = 7'] }],
      respuesta: ['7 números'] },
    { nivel: 2, titulo: 'La rifa de 200 boletos',
      enunciado: 'En una rifa de 200 boletos, ganan caramelo los múltiplos de 8 y gaseosa los múltiplos de 12. ¿Cuántos boletos ganan algún premio?',
      datos: [D5.cuantos(200), D5.ambos, D5.ie],
      solucion: [
        { texto: 'Con caramelo, 25; con gaseosa, 16. Los dos: múltiplos de MCM(8, 12) = 24.', ecuacion: ['200 = 8 × 25', SEP, '200 = 12 × 16 + ', sb(8), SEP, '200 = ', ml(24), ' × 8 + ', sb(8)] },
        { texto: 'Los 8 de los dos premios están en las dos cuentas: se restan una vez.', ecuacion: ['25 + 16 − 8 = 33'] },
      ],
      respuesta: ['33 boletos'] },
    { nivel: 2, titulo: 'Un solo premio',
      enunciado: 'En la misma rifa de 200 boletos (caramelo para los múltiplos de 8, gaseosa para los de 12), ¿cuántos boletos ganan un solo premio?',
      datos: [D5.cuantos(200), D5.ambos, D5.ie],
      solucion: [
        { texto: 'Ganan algún premio 25 + 16 − 8 = 33; de esos, 8 ganan los dos.' },
        { texto: 'Los de un solo premio son los demás.', ecuacion: ['33 − 8 = 25'] },
      ],
      respuesta: ['25 boletos'] },
    { nivel: 2, titulo: 'Ni de 4 ni de 10',
      enunciado: '¿Cuántos números del 1 al 100 no son múltiplos de 4 ni de 10?',
      datos: [D5.cuantos(100), D5.ambos, D5.ie, D5.ninguno],
      solucion: [
        { texto: 'De 4 hay 25 y de 10 hay 10. De los dos: múltiplos de MCM(4, 10) = 20, que son 5.', ecuacion: ['25 + 10 − 5 = 30'] },
        { texto: 'Los que no son de ninguno.', ecuacion: ['100 − 30 = 70'] },
      ],
      respuesta: ['70 números'] },
    { nivel: 2, titulo: 'De 6 o 9 hasta 90',
      enunciado: '¿Cuántos números del 1 al 90 son múltiplos de 6 o de 9?',
      datos: [D5.cuantos(90), D5.ambos, D5.ie],
      solucion: [
        { texto: 'De 6 hay 15 y de 9 hay 10. Los dos a la vez son los múltiplos de MCM(6, 9) = 18: son 5.', ecuacion: ['90 = ', ml(18), ' × 5'] },
        { texto: 'Se restan una vez.', ecuacion: ['15 + 10 − 5 = 20'] },
      ],
      respuesta: ['20 números'] },
    { nivel: 2, titulo: 'De 12, entre 50 y 100',
      enunciado: '¿Cuántos números del 50 al 100 son múltiplos de 4 y de 6 a la vez?',
      datos: [D5.cuantos(100), D5.ambos, D5.tramo],
      solucion: [
        { texto: 'Son los múltiplos de MCM(4, 6) = 12. Del 1 al 100 hay 8; del 1 al 49, 4.', ecuacion: ['100 = ', ml(12), ' × 8 + ', sb(4), SEP, '49 = ', ml(12), ' × 4 + ', sb(1)] },
        { texto: 'Se quitan los de antes del 50: quedan el 60, el 72, el 84 y el 96.', ecuacion: ['8 − 4 = 4'] },
      ],
      respuesta: ['4 números'] },
    { nivel: 3, titulo: 'Tachar uno tras otro',
      enunciado: 'En una lista del 1 al 60 se tachan primero los múltiplos de 2, después los múltiplos de 3 que quedan y al final los múltiplos de 5 que quedan. ¿Cuántos números se tachan?',
      alternativas: ['62', '44', '16', '42', '30'],
      datos: [D5.cuantos(60), D5.ie, D5.tres],
      solucion: [
        { texto: 'Se tachan los que son de 2, de 3 o de 5. De cada uno hay 30, 20 y 12.' },
        { texto: 'De cada par (6, 10 y 15) hay 10, 6 y 4; de los tres (30), 2.' },
        { texto: 'Los de cada par se contaron dos veces; los de 30, tres veces y se restaron tres.', ecuacion: ['30 + 20 + 12 − 10 − 6 − 4 + 2 = 44'] },
        { texto: ['Las trampas: ', letra('A'), ' suma 30 + 20 + 12 sin quitar los ya tachados; ', letra('C'), ' son los que quedan; ', letra('D'), ' olvida sumar los de 30; ', letra('E'), ' cuenta solo los de 2.'] },
      ],
      respuesta: [letra('B'), ': 44 números'] },
    { nivel: 3, titulo: 'Tres cifras, de 6 o 15',
      enunciado: '¿Cuántos números de tres cifras son múltiplos de 6 o de 15?',
      alternativas: ['210', '199', '150', '180', '30'],
      datos: [D5.cuantos(999), D5.ambos, D5.ie, D5.tramo],
      solucion: [
        { texto: 'Del 1 al 999: 166 de 6, 66 de 15 y 33 de MCM(6, 15) = 30. Del 1 al 99: 16, 6 y 3.' },
        { texto: 'De tres cifras: 150 de 6, 60 de 15 y 30 de los dos.', ecuacion: ['150 + 60 − 30 = 180'] },
        { texto: ['Las trampas: ', letra('A'), ' no resta los de los dos; ', letra('B'), ' cuenta desde el 1; ', letra('C'), ' son solo los de 6; ', letra('E'), ' son los de los dos.'] },
      ],
      respuesta: [letra('D'), ': 180 números'] },
    { nivel: 3, titulo: 'Ganan exactamente uno',
      enunciado: 'En una rifa de 150 boletos, ganan caramelo los múltiplos de 6 y gaseosa los múltiplos de 10. ¿Cuántos boletos ganan exactamente un premio?',
      alternativas: ['35', '40', '5', '115', '30'],
      datos: [D5.cuantos(150), D5.ambos, D5.ie],
      solucion: [
        { texto: 'Caramelo: 25. Gaseosa: 15. Los dos: múltiplos de MCM(6, 10) = 30, que son 5.' },
        { texto: 'Solo caramelo, 25 − 5; solo gaseosa, 15 − 5.', ecuacion: ['20 + 10 = 30'] },
        { texto: ['Las trampas: ', letra('A'), ' son los que ganan algún premio; ', letra('B'), ' suma sin quitar los repetidos; ', letra('C'), ' son los de los dos; ', letra('D'), ' son los que no ganan nada.'] },
      ],
      respuesta: [letra('E'), ': 30 boletos'] },
    { nivel: 3, titulo: 'Ni de 2, 3 ni 5',
      enunciado: '¿Cuántos números del 1 al 100 no son múltiplos de 2, ni de 3, ni de 5?',
      alternativas: ['26', '29', '74', '3', '33'],
      datos: [D5.cuantos(100), D5.ie, D5.tres, D5.ninguno],
      solucion: [
        { texto: 'Son de 2, de 3 o de 5: 50 + 33 + 20 − 16 − 10 − 6 + 3 = 74 (de 6, de 10, de 15 y de 30).' },
        { texto: 'No son de ninguno los demás.', ecuacion: ['100 − 74 = 26'] },
        { texto: ['Las trampas: ', letra('B'), ' olvida sumar los 3 de 30; ', letra('C'), ' son los que sí son múltiplos; ', letra('D'), ' son los de 30; ', letra('E'), ' quita solo los de 2 y de 3.'] },
      ],
      respuesta: [letra('A'), ': 26 números'] },
    { nivel: 3, titulo: 'Los que no ganan nada',
      enunciado: 'En una rifa de 240 boletos, ganan caramelo los múltiplos de 10 y gaseosa los múltiplos de 15. ¿Cuántos boletos no ganan ningún premio?',
      alternativas: ['200', '32', '208', '232', '8'],
      datos: [D5.cuantos(240), D5.ambos, D5.ie, D5.ninguno],
      solucion: [
        { texto: 'Caramelo: 24. Gaseosa: 16. Los dos: múltiplos de MCM(10, 15) = 30, que son 8.', ecuacion: ['24 + 16 − 8 = 32'] },
        { texto: 'Ganan algo 32; no ganan nada los demás.', ecuacion: ['240 − 32 = 208'] },
        { texto: ['Las trampas: ', letra('A'), ' resta 24 + 16 sin quitar los repetidos; ', letra('B'), ' son los que ganan; ', letra('D'), ' solo quita los de los dos premios; ', letra('E'), ' son los de los dos premios.'] },
      ],
      respuesta: [letra('C'), ': 208 boletos'] },
  ];

  const tramo = {
    id: 'multiplos-tramo',
    titulo: 'Múltiplos de uno o de otro',
    pregunta: '¿Cuántos boletos ganan al menos un premio?',
    temas: ['Conteo de múltiplos', 'Problemas de aplicación'],
    pieza: BO,
    aprendizaje: 'Múltiplos de A o de B: los de A más los de B, menos los de los dos, que son los múltiplos del MCM.',
    actividad: 'Cambiar cada cuántos boletos hay premio y contar los que ganan algo.',
    // Lee: la plancha del 1 al 30 con caramelo cada 4 y gaseosa cada 6, y las dos cuentas. No dice cuántos ganan algo en la
    // rifa de 120 (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Premios en la plancha', texto: 'Volvemos a la rifa: caramelo para los múltiplos de 4 y gaseosa para los múltiplos de 6. Ahora la pregunta es otra: cuántos boletos ganan algo.',
          pieza: BO, dibujo: { datos: plancha(4, 6, { hasta: 30 }), estado: {} } },
        { titulo: 'Contar los de cada premio', texto: ['Del 1 al 30 hay 7 múltiplos de 4: el cociente entero de 30 ÷ 4. Y hay 5 múltiplos de 6. Pero algunos boletos están en las dos cuentas.'],
          ecuacion: ['30 = 4 × 7 + ', sb(2), SEP, '30 = 6 × 5'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cambiar cada cuántos boletos hay caramelo y gaseosa. Cuenta los boletos con algún premio y compáralo con la suma de las dos cuentas.' },
      ],
    },
    ejemplos: EJEMPLOS_TRAMO,
    juega: {
      pieza: BO,
      consigna: 'La plancha va del 1 al 60. Mira cuántos boletos ganan caramelo, cuántos gaseosa y cuántos algún premio.',
      mision: {
        // Una sola manera en la grilla: solo caramelo cada 3 y gaseosa cada 10 dejan 24 boletos con premio (la prueba lo
        // recorre).
        texto: 'Elige los premios para que exactamente 24 boletos ganen algún premio.',
        logrado: v => deUnoU(60, v.a, v.b) === 24,
        bien: '3 y 10: 20 + 6, menos el 30 y el 60, que estaban dos veces.',
      },
      voz: 'Lo que tiene los dos premios, ¿cuántas veces lo contaste?',
      leyenda: [
        { s: '●', t: 'caramelo' },
        { s: '■', t: 'gaseosa' },
        { s: ml('borde violeta'), t: 'los dos premios: está en las dos cuentas' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Caramelo cada', opciones: [3, 4, 5].map(x => ({ valor: x, texto: String(x) })) },
        { id: 'b', etiqueta: 'Gaseosa cada', opciones: [6, 10, 15].map(x => ({ valor: x, texto: String(x) })) },
      ],
      dibujo: v => ({ datos: plancha(v.a, v.b), estado: {} }),
      lectura: v => { const cA = cuenta(60, v.a), cB = cuenta(60, v.b), cM = cuenta(60, mcm(v.a, v.b)); return [`${cA} caramelos, ${cB} gaseosas, `, ml(`${cM} con los dos`), `: ganan ${cA + cB - cM}`]; },
      minimo: 3,
    },
    predice: {
      pieza: BO,
      pregunta: 'La rifa grande tiene 120 boletos. Ganan caramelo los múltiplos de 4 y gaseosa los múltiplos de 6. ¿Cuántos boletos ganan al menos un premio?',
      datos: ['Boletos del 1 al 120', 'Caramelo: múltiplos de 4; gaseosa: múltiplos de 6'],
      voz: 'Piensa en los que ganan los dos premios.',
      opciones: [
        { id: 'c', texto: '40', correcta: true },
        { id: 'suma', texto: '50', error: 'AT-IE-SUMA', siFuera: 'Bien contar 30 con caramelo y 20 con gaseosa. Pero los múltiplos de 12 se contaron dos veces.' },
        { id: 'doble', texto: '30', error: 'AT-IE-DOBLE', siFuera: 'Bien quitar los repetidos, que son 10. Pero se quitan una vez: 50 − 10, no 50 − 20.' },
        { id: 'ambos', texto: '10', error: 'AT-IE-SOLO-AMBOS', siFuera: 'Esos 10 ganan los dos premios. Pero también ganan los que tienen uno solo.' },
      ],
      dibujo: { datos: plancha(4, 6, { hasta: 120, extra: { marcarPremios: false } }), estado: {} },
      revelar: { datos: plancha(4, 6, { hasta: 120, extra: { pie: [['Ganan algún premio '], ['40', null, 700], [' boletos']] } }), estado: {} },
      coincide: 'Coincide: 30 + 20 − 10 = 40. Los 10 de los dos premios se cuentan una vez.',
      noCoincide: 'Revisemos cuántas veces se contó cada boleto.',
    },
    mira: {
      pieza: BO,
      datos: plancha(4, 6, { hasta: 120, extra: { pasos: [{ marcarPremios: 'a' }, { marcarPremios: 'b' }, { marcarPremios: 'ambos' }, { marcarPremios: true }] } }),
      voz: 'Cuenta cada premio por separado.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Caramelo: 30 boletos, los múltiplos de 4.', ecuacion: ['120 = 4 × 30'] },
        { estado: { paso: 1 }, texto: 'Gaseosa: 20 boletos, los múltiplos de 6.', ecuacion: ['120 = 6 × 20'] },
        { estado: { paso: 2 }, texto: 'Los dos premios: los múltiplos de MCM(4, 6) = 12. Son 10.', ecuacion: ['120 = ', ml(12), ' × 10'] },
        { estado: { paso: 3 }, texto: 'Esos 10 están en las dos cuentas: se restan una vez (inclusión y exclusión).', ecuacion: ['30 + 20 − 10 = 40'] },
      ],
    },
    regla: {
      texto: 'Los múltiplos de A o de B se cuentan así: los de A, más los de B, menos los de los dos, que son los múltiplos del MCM.',
      ecuacion: [{ llave: ['de A o de B'], nota: 'al menos un premio' }, ' = de A + de B − ', ml('de MCM'), SEP, '30 + 20 − 10 = 40', SEP, 'de A, B o C = cada uno − cada par + los tres'],
      condicion: 'hasta L, los de A son el cociente entero de L ÷ A. De ninguno: total menos los de A o de B.',
      voz: 'Lo que se cuenta dos veces se resta una vez.',
      dibujo: { pieza: BO, datos: plancha(4, 6, { hasta: 120 }), estado: {} },
    },
    // Así se resuelve: cuántos números de un tramo desde 1 no son de A ni de B, sin premios de por medio. «Ahora tú» pide
    // los de los dos a la vez, los de uno o de otro, los boletos sin premio, los de un solo premio, un tramo que no
    // empieza en 1 y tachar con tres primos.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const a = r.ent(3, 9), b = r.ent(a + 1, 12), M = mcm(a, b), L = r.de([50, 70, 80, 100]);
          if (mcd(a, b) === 1 || b % a === 0 || cuenta(L, M) < 2 || USADOS5.has(`${a}-${b}-${L}`)) continue;
          const cA = cuenta(L, a), cB = cuenta(L, b), cM = cuenta(L, M), al = cA + cB - cM;
          return {
            enunciado: `¿Cuántos números del 1 al ${L} no son múltiplos de ${a} ni de ${b}?`,
            datos: [D5.cuantos(L), D5.ambos, D5.ie, D5.ninguno],
            pasos: [
              { tipo: 'pide', texto: `Piden los números del 1 al ${L} que no son de ${a} ni de ${b}.` },
              { tipo: 'regla', texto: 'Primero cuento los que son de uno o de otro: los de cada uno, menos los de los dos, que son múltiplos del MCM. Después los resto del total.' },
              { tipo: 'cuentas', texto: `De ${a} hay ${cA}; de ${b}, ${cB}; de los dos, múltiplos de MCM = ${M}, hay ${cM}.`, ecuacion: [`${cA} + ${cB} − ${cM} = ${al}`] },
              { tipo: 'cuentas', texto: 'Los que no son de ninguno son los demás.', ecuacion: [`${L} − ${al} = ${L - al}`] },
              { tipo: 'sentido', texto: `Comprueba: ${L - al} + ${al} = ${L}, todos los números de la lista, cada uno una sola vez.` },
            ],
            respuesta: `${L - al} números.`,
          };
        }
      },
    },
    ahoraTu: {
      voz: 'Los que están en las dos cuentas se restan una vez.',
      generar(sem) {
        const r = azar(sem + 47), tipo = sem % 6;
        return conCuatro([casoAmbos, casoAlguno, casoNinguno, casoSolo, casoTramo, casoTachar][tipo], r);
      },
    },
  };

  // ---------- Idea 6 (rehecha, 19 nov): Euclides y la fracción continua ----------
  // Propuesta §1 a §7. Conserva el id `euclides` (y la mesa `euclides`), con otra Predice; la idea vieja
  // `fraccion-continua` entra aquí (los cocientes de Euclides son sus términos). Objeto: los rollos de la promoción
  // (arit-cintas, filas compactas): un rollo se mide con otro, después con lo que sobró, hasta que no sobre nada.
  // Cambia: los dos rollos. · Permanece: una sola escala en la figura. · Progresa: cada fila mide lo de la fila de arriba
  // con lo que sobró. · Se reserva: 91 y 35 (la predicción). · Debe verse: la última pieza que mide sin sobrante entra
  // exacto en todas las filas, también en los dos rollos.
  // Errores (hipótesis de aula; una con trampa deducida de San Marcos 2027-I): AT-EUC-COCIENTE cree que el cociente mide
  // a los dos · AT-EUC-ACHICA cree que el MCD baja con los números · AT-EUC-NOSE cree que hay que calcular los dos MCD ·
  // AT-EUC-PRIMER-RESTO se queda en el primer resto · AR13 da el MCM · AT-EUC-DIVIDENDO conserva el dividendo · AT-FC-
  // RESTOS pone los restos como términos · AT-FC-ORDEN invierte el orden · AT-FC-CORTA deja fuera el último cociente ·
  // AT-FC-SUMA suma las partes sueltas · AT-FC-INVIERTE da la fracción al revés · AT-EUC-SIN-MCD reconstruye sin
  // multiplicar por el MCD (San Marcos 2027-I) · AT-EUC-PRODUCTO multiplica los cocientes · AT-RESPONDE-OTRA responde uno
  // de los números.
  const D6 = {
    div: 'Al dividir A entre B: A = B × cociente + resto, con el resto menor que B',
    euc: 'Si al dividir A entre B sobra r, A y B tienen los mismos divisores comunes que B y r',
    fin: 'Se divide hasta que el resto sea 0: el último divisor es el MCD',
    fc: 'Fracción continua: A/B = cociente + 1/(B/r), y se sigue igual con B/r',
    fcNot: 'Se anota [2; 1, 3]: primero la parte entera y, después, los demás cocientes',
    atras: 'Hacia atrás: cada dividendo es su divisor × el cociente + el resto',
    mcm: D2.mcm,
  };
  // Las divisiones sucesivas como filas de cintas: cada fila mide su rollo con el de abajo; la última pieza, en
  // turquesa (es el MCD).
  function filasEuclides(a, b, hasta) {
    const ps = euclides(a, b), n = ps.length;
    const cintas = ps.map((p, k) => ({
      largo: p.a, trozo: p.b, colorTrozo: k === n - 1 ? 'i' : null, marca: k === n - 1,
      rotulo: [[`${p.a} = ${p.q} × `], [String(p.b), k === n - 1 ? 'i' : null, k === n - 1 ? 700 : 400], ...(p.r ? [[' + '], [String(p.r), 'o', 700]] : [])],
    }));
    return { max: a, compacta: true, filas: Math.max(n, hasta || 0), cintas: hasta === undefined ? cintas : cintas.slice(0, hasta) };
  }
  const fcTexto = qs => `[${qs[0]}; ${qs.slice(1).join(', ')}]`;
  // La fracción continua escrita en escalera ({ frac } anidadas): 91/35 = 2 + 1/(1 + 1/(1 + 1/2)).
  const escalera = qs => (qs.length === 1 ? [String(qs[0])] : [String(qs[0]), ' + ', { frac: ['1', escalera(qs.slice(1))] }]);
  const valorFC = qs => { let num = qs[qs.length - 1], den = 1; for (let i = qs.length - 2; i >= 0; i--) [num, den] = [qs[i] * num + den, num]; const g = mcd(num, den); return [num / g, den / g]; };
  const fr = ([u, w]) => (w === 1 ? String(u) : `${u}/${w}`);
  const USADOS6 = new Set(['15-50', '35-91', '12-45', '24-64', '21-84', '3-7', '198-252', '30-43', '55-89', '323-391', '68-157', '24-60', '38-60']);

  // Ahora tú · tipo 0: el MCD por divisiones sucesivas (tres divisiones o más).
  function casoMcdE(r) {
    const g = r.de([3, 4, 6, 7, 8, 9, 11, 12]), m = r.ent(5, 14), n = r.ent(2, m - 1);
    if (mcd(m, n) !== 1) return null;
    const A = g * m, B = g * n, ps = euclides(A, B);
    if (ps.length < 3 || USADOS6.has(par(A, B))) return null;
    return {
      pregunta: `Usa divisiones sucesivas para hallar el MCD de ${A} y ${B}.`,
      datos: [D6.div, D6.euc, D6.fin, D6.mcm],
      opciones: opciones(g, [
        { id: 'resto', valor: ps[0].r, error: 'AT-EUC-PRIMER-RESTO', siFuera: `Bien empezar dividiendo. Pero ${ps[0].r} es el primer resto: hay que seguir hasta que no sobre nada.` },
        { id: 'cociente', valor: ps[0].q, error: 'AT-EUC-COCIENTE', siFuera: `Bien la división. Pero el cociente ${ps[0].q} cuenta veces: no entra exacto en los dos.` },
        { id: 'mcm', valor: mcm(A, B), error: 'AR13', siFuera: `Bien buscar lo común. Pero ${mcm(A, B)} es el MCM: los dos entran en él, no él en ellos.` },
      ]),
      solucion: { texto: `El último divisor, el que deja resto 0, es ${g}.`, ecuacion: ps.flatMap((p, i) => [...(i ? [SEP] : []), `${p.a} = ${p.q} × `, ...(p.r ? [`${p.b} + `, sb(p.r)] : [dv(p.b)])]) },
    };
  }
  // Ahora tú · tipo 1: la división que sigue.
  function casoSigue(r) {
    const A = r.ent(60, 200), B = r.ent(20, A - 10), ps = euclides(A, B);
    if (ps.length < 3 || ps[0].q < 2 || ps[0].r < 3 || USADOS6.has(par(A, B))) return null;
    const { q, r: rr } = ps[0];
    if (new Set([B, q, rr, A]).size < 4) return null;
    return {
      pregunta: `Al dividir ${A} entre ${B}, el cociente es ${q} y sobran ${rr}. Para seguir con el algoritmo de Euclides, ¿qué división se hace después?`,
      datos: [D6.div, D6.euc, D6.fin],
      opciones: opciones(`${B} entre ${rr}`, [
        { id: 'cociente', valor: `${B} entre ${q}`, error: 'AT-EUC-COCIENTE', siFuera: `Bien dejar el ${B}. Pero el cociente ${q} cuenta veces; lo que sigue midiendo es lo que sobró.` },
        { id: 'dividendo', valor: `${A} entre ${rr}`, error: 'AT-EUC-DIVIDENDO', siFuera: `Bien usar lo que sobró, ${rr}. Pero se mide el divisor, ${B}, no el ${A}.` },
        { id: 'q-r', valor: `${rr} entre ${q}`, error: 'AT-FC-RESTOS', siFuera: `Bien seguir con el resto. Pero el par nuevo es divisor y resto, no resto y cociente.` },
      ]),
      solucion: { texto: `El divisor pasa a dividirse y el resto pasa a dividir.`, ecuacion: [`${B} = ${ps[1].q} × ${ps[1].b} + `, sb(ps[1].r)] },
    };
  }
  // Ahora tú · tipo 2: la fracción continua de A/B.
  function casoFC(r) {
    const A = r.ent(20, 160), B = r.ent(7, A - 3), ps = euclides(A, B);
    if (ps.length < 3 || ps.length > 5 || mcd(A, B) !== 1 || ps[0].q < 1 || USADOS6.has(par(A, B))) return null;
    const qs = ps.map(p => p.q), rs = [qs[0], ...ps.slice(0, -1).map(p => p.r)];
    return {
      pregunta: `¿Cuál es la fracción continua de ${A}/${B}?`,
      datos: [D6.div, D6.fc, D6.fcNot],
      opciones: opciones(fcTexto(qs), [
        { id: 'restos', valor: fcTexto(rs), error: 'AT-FC-RESTOS', siFuera: 'Bien las divisiones sucesivas. Pero los términos son los cocientes, no lo que sobra.' },
        { id: 'orden', valor: fcTexto(qs.slice().reverse()), error: 'AT-FC-ORDEN', siFuera: 'Bien los cocientes. Pero van en el orden en que salen: primero la parte entera.' },
        { id: 'corta', valor: fcTexto(qs.slice(0, -1)), error: 'AT-FC-CORTA', siFuera: `Bien los primeros cocientes. Pero falta el último, el de la división que no deja resto.` },
      ]),
      solucion: { texto: `Los cocientes de las divisiones sucesivas, en orden: ${yLista(qs)}.`, ecuacion: [{ frac: [String(A), String(B)] }, ' = ', ...escalera(qs)] },
    };
  }
  // Ahora tú · tipo 3: el valor de una fracción continua de tres términos.
  function casoValor(r) {
    const qs = [r.ent(1, 4), r.ent(1, 4), r.ent(2, 5)];
    const v = valorFC(qs), corta = valorFC(qs.slice(0, 2)), suelta = (() => { const num = qs[0] * qs[1] * qs[2] + qs[2] + qs[1], den = qs[1] * qs[2], g = mcd(num, den); return [num / g, den / g]; })();
    return {
      pregunta: `¿Qué número es la fracción continua ${fcTexto(qs)}?`,
      datos: [D6.fcNot, `${fcTexto(qs)} = ${qs[0]} + 1/(${qs[1]} + 1/${qs[2]})`],
      opciones: opciones(fr(v), [
        { id: 'suma', valor: fr(suelta), error: 'AT-FC-SUMA', siFuera: `Bien empezar con ${qs[0]}. Pero no es ${qs[0]} + 1/${qs[1]} + 1/${qs[2]}: el 1/${qs[2]} va dentro, sumado al ${qs[1]}.` },
        { id: 'corta', valor: fr(corta), error: 'AT-FC-CORTA', siFuera: `Bien ${qs[0]} + 1/${qs[1]}. Pero falta el último término, ${qs[2]}.` },
        { id: 'invierte', valor: fr([v[1], v[0]]), error: 'AT-FC-INVIERTE', siFuera: `Bien la cuenta. Pero esa es la fracción al revés: la parte entera es ${qs[0]}.` },
      ]),
      solucion: { texto: `De abajo hacia arriba: ${qs[1]} + 1/${qs[2]} = ${fr(valorFC(qs.slice(1)))}, y después ${qs[0]} + ${fr([valorFC(qs.slice(1))[1], valorFC(qs.slice(1))[0]])}.`, ecuacion: [...escalera(qs), ' = ', fr(v)] },
    };
  }
  // Ahora tú · tipo 4 (San Marcos 2027-I): reconstruir los dos números desde los cocientes y el MCD.
  function casoReconstruir(r) {
    const qs = [r.ent(1, 4), r.ent(1, 4), r.ent(2, 5)], d = r.de([2, 3, 4, 5, 6, 7, 8]);
    const atras = (cs, g) => { let x = cs[cs.length - 1] * g, y = g; for (let i = cs.length - 2; i >= 0; i--) [x, y] = [cs[i] * x + y, x]; return [x, y]; };
    const [A, B] = atras(qs, d), [A1, B1] = atras(qs, 1), [Ar, Br] = atras(qs.slice().reverse(), d);
    if (A + B > 400 || Ar + Br === A + B) return null;
    return {
      pregunta: `Al hallar el MCD de dos números con divisiones sucesivas, los cocientes fueron ${yLista(qs)}, en ese orden, y el MCD es ${d}. ¿Cuánto suman los dos números?`,
      datos: [D6.div, D6.fin, D6.atras],
      opciones: opciones(A + B, [
        { id: 'sinmcd', valor: A1 + B1, error: 'AT-EUC-SIN-MCD', siFuera: `Bien ir hacia atrás. Pero la última división es ${qs[2]} × ${d}, no ${qs[2]} × 1: empieza en el MCD.` },
        { id: 'orden', valor: Ar + Br, error: 'AT-FC-ORDEN', siFuera: `Bien ir hacia atrás. Pero el último cociente, ${qs[2]}, es el de la última división, la primera que se rehace.` },
        { id: 'mayor', valor: A, error: 'AT-RESPONDE-OTRA', siFuera: `Bien hallar el ${A}. Pero se pide la suma con el otro, ${B}.` },
      ]),
      solucion: { texto: `Desde abajo: ${qs[2] * d} = ${qs[2]} × ${d}; después ${B} y ${A}.`, ecuacion: [`${A} + ${B} = ${A + B}`] },
    };
  }

  // Ejemplos resueltos (idea 6). Cuentas rehechas aparte (cuentas.py, con divisiones sucesivas de Python): 50 = 3 × 15 +
  // 5; MCD(45, 12) = 3; MCD(64, 24) = MCD(24, 16) = 8; MCD(84, 21) = 21; 7/3 = [2; 3]; MCD(252, 198) = 18; 43/30 = [1; 2,
  // 3, 4]; [1; 2, 2] = 7/5; 89 y 55: 9 divisiones, MCD 1; MCD(391, 323) = 17; cocientes 3, 2, 4 y MCD 6: 186 y 54, suman
  // 240 (sin MCD: 31 y 9); cocientes 1, 3, 2 y A − B = 30: 135 y 105, MCD 15; 157/68 = [2; 3, 4, 5]; [2; 1, 3] = 11/4
  // ([2; 1] = 3, [3; 1, 2] = 11/3, 2 + 1 + 1/3 = 10/3); cocientes 1, 1, 3 y MCD 14: 98 y 56. Ninguno usa la predicción
  // (91 y 35) ni la misión (60 y 38).
  const EJEMPLOS_EUC = [
    { nivel: 1, titulo: 'Una división',
      enunciado: 'Al dividir 50 entre 15, ¿cuánto es el cociente y cuánto el resto?',
      datos: [D6.div],
      solucion: [{ texto: '15 entra 3 veces en 50 (3 × 15 = 45) y sobran 5, que es menor que 15.', ecuacion: ['50 = 3 × 15 + ', sb(5)] }],
      respuesta: ['Cociente 3 y resto ', sb(5)] },
    { nivel: 1, titulo: 'El MCD de 45 y 12',
      enunciado: 'Con divisiones sucesivas, halla el MCD de 45 y 12.',
      datos: [D6.div, D6.euc, D6.fin],
      solucion: [{ texto: 'Cada resto pasa a dividir; el último divisor, el que deja resto 0, es el MCD.', ecuacion: ['45 = 3 × 12 + ', sb(9), SEP, '12 = 1 × 9 + ', sb(3), SEP, '9 = 3 × ', dv(3)] }],
      respuesta: ['MCD(45, 12) = ', dv(3)] },
    { nivel: 1, titulo: 'El par que sigue',
      enunciado: 'Al dividir 64 entre 24 sobran 16. ¿Qué par de números tiene el mismo MCD que 64 y 24?',
      datos: [D6.euc],
      solucion: [{ texto: 'El divisor y el resto tienen los mismos divisores comunes que 64 y 24.', ecuacion: ['64 = 2 × 24 + ', sb(16)] }],
      respuesta: ['El par 24 y 16'] },
    { nivel: 1, titulo: 'Cuando divide exacto',
      enunciado: '¿Cuál es el MCD de 84 y 21?',
      datos: [D6.div, D6.fin],
      solucion: [{ texto: 'La primera división ya no deja resto: el divisor es el MCD.', ecuacion: ['84 = 4 × ', dv(21)] }],
      respuesta: ['MCD(84, 21) = ', dv(21)] },
    { nivel: 1, titulo: 'Una fracción continua corta',
      enunciado: '¿Cuál es la fracción continua de 7/3?',
      datos: [D6.div, D6.fc, D6.fcNot],
      solucion: [{ texto: '7 = 2 × 3 + 1 y 3 = 3 × 1: los cocientes son 2 y 3.', ecuacion: [{ frac: ['7', '3'] }, ' = 2 + ', { frac: ['1', '3'] }] }],
      respuesta: ['[2; 3]'] },
    { nivel: 2, titulo: 'El MCD de 252 y 198',
      enunciado: 'Con divisiones sucesivas, halla el MCD de 252 y 198.',
      datos: [D6.div, D6.euc, D6.fin],
      solucion: [
        { texto: 'Divido el mayor entre el menor, y después cada divisor entre su resto.', ecuacion: ['252 = 1 × 198 + ', sb(54), SEP, '198 = 3 × 54 + ', sb(36)] },
        { texto: 'Sigo hasta que no sobre nada.', ecuacion: ['54 = 1 × 36 + ', sb(18), SEP, '36 = 2 × ', dv(18)] },
      ],
      respuesta: ['MCD(252, 198) = ', dv(18)] },
    { nivel: 2, titulo: 'La fracción continua de 43/30',
      enunciado: '¿Cuál es la fracción continua de 43/30?',
      datos: [D6.div, D6.fc, D6.fcNot],
      solucion: [
        { texto: 'Hago las divisiones sucesivas de 43 entre 30.', ecuacion: ['43 = 1 × 30 + ', sb(13), SEP, '30 = 2 × 13 + ', sb(4), SEP, '13 = 3 × 4 + ', sb(1), SEP, '4 = 4 × 1'] },
        { texto: 'Los cocientes, en orden, son 1, 2, 3 y 4.', ecuacion: [{ frac: ['43', '30'] }, ' = ', ...escalera([1, 2, 3, 4])] },
      ],
      respuesta: ['[1; 2, 3, 4]'] },
    { nivel: 2, titulo: 'El valor de [1; 2, 2]',
      enunciado: '¿Qué número es la fracción continua [1; 2, 2]?',
      datos: [D6.fcNot, '[1; 2, 2] = 1 + 1/(2 + 1/2)'],
      solucion: [
        { texto: 'Empiezo por abajo: 2 + 1/2 = 5/2.' },
        { texto: 'Después, 1 sobre eso es 2/5, y se suma la parte entera.', ecuacion: ['1 + ', { frac: ['2', '5'] }, ' = ', { frac: ['7', '5'] }] },
      ],
      respuesta: ['7/5'] },
    { nivel: 2, titulo: 'Cuántas divisiones',
      enunciado: 'Para hallar el MCD de 89 y 55 con divisiones sucesivas, ¿cuántas divisiones hacen falta?',
      datos: [D6.div, D6.fin],
      solucion: [
        { texto: 'Cada cociente es 1 hasta el final: cada número es el siguiente más el resto.', ecuacion: ['89 = 55 + 34', SEP, '55 = 34 + 21', SEP, '34 = 21 + 13', SEP, '21 = 13 + 8', SEP, '13 = 8 + 5', SEP, '8 = 5 + 3', SEP, '5 = 3 + 2', SEP, '3 = 2 + 1'] },
        { texto: 'La novena ya no deja resto.', ecuacion: ['2 = 2 × ', dv(1)] },
      ],
      respuesta: ['9 divisiones (y el MCD es ', dv(1), ')'] },
    { nivel: 2, titulo: 'Dos rollos difíciles',
      enunciado: 'Dos rollos miden 391 cm y 323 cm. ¿Cuál es el trozo más largo que entra exacto en los dos?',
      datos: [D6.div, D6.euc, D6.fin],
      figura: { pieza: CI, datos: rollos([391, 323], null, { u: 'cm' }), estado: {} },
      solucion: [
        { texto: 'Factorizar 391 y 323 cuesta; con divisiones sucesivas es más corto.', ecuacion: ['391 = 1 × 323 + ', sb(68), SEP, '323 = 4 × 68 + ', sb(51)] },
        { texto: 'Sigo con los restos.', ecuacion: ['68 = 1 × 51 + ', sb(17), SEP, '51 = 3 × ', dv(17)] },
      ],
      respuesta: ['Un trozo de ', dv('17 cm')] },
    { nivel: 3, titulo: 'Reconstruir con los cocientes',
      enunciado: 'Al hallar el MCD de dos números con divisiones sucesivas, los cocientes fueron 3, 2 y 4, en ese orden, y el MCD fue 6. ¿Cuánto suman los dos números?',
      alternativas: ['40', '144', '54', '186', '240'],
      datos: [D6.div, D6.fin, D6.atras],
      solucion: [
        { texto: 'Hacia atrás. En la última división el divisor es el MCD: 4 × 6 = 24. Después, 2 × 24 + 6 = 54, y 3 × 54 + 24 = 186.', ecuacion: ['186 = 3 × 54 + ', sb(24), SEP, '54 = 2 × 24 + ', sb(6), SEP, '24 = 4 × ', dv(6)] },
        { texto: 'Los números son 186 y 54.', ecuacion: ['186 + 54 = 240'] },
        { texto: ['Las trampas: ', letra('A'), ' arma los números con 1 en vez del MCD; ', letra('B'), ' multiplica 3 × 2 × 4 × 6; ', letra('C'), ' es el menor solo; ', letra('D'), ' es el mayor solo.'] },
      ],
      respuesta: [letra('E'), ': suman 240'] },
    { nivel: 3, titulo: 'La diferencia y los cocientes',
      enunciado: 'Las divisiones sucesivas de A entre B dieron los cocientes 1, 3 y 2, en ese orden, y A − B = 30. ¿Cuál es el MCD de A y B?',
      alternativas: ['15', '30', '5', '135', '105'],
      datos: [D6.div, D6.fin, D6.atras],
      solucion: [
        { texto: 'Con el MCD como d, hacia atrás: el último divisor es 2 × d; B = 3 × 2d + d = 7d; A = 1 × 7d + 2d = 9d.' },
        { texto: 'A − B = 9d − 7d = 2d = 30, así que d = 15: A = 135 y B = 105.', ecuacion: ['135 = 1 × 105 + ', sb(30), SEP, '105 = 3 × 30 + ', sb(15), SEP, '30 = 2 × ', dv(15)] },
        { texto: ['Las trampas: ', letra('B'), ' es A − B, el primer resto; ', letra('C'), ' divide 30 entre 1 + 3 + 2; ', letra('D'), ' es A; ', letra('E'), ' es B.'] },
      ],
      respuesta: [letra('A'), ': ', dv(15)] },
    { nivel: 3, titulo: 'La fracción continua de 157/68',
      enunciado: '¿Cuál es la fracción continua de 157/68?',
      alternativas: ['[2; 21, 5, 1]', '[5; 4, 3, 2]', '[2; 3, 4, 5]', '[2; 3, 4]', '[0; 2, 3, 4, 5]'],
      datos: [D6.div, D6.fc, D6.fcNot],
      solucion: [
        { texto: 'Divisiones sucesivas de 157 entre 68.', ecuacion: ['157 = 2 × 68 + ', sb(21), SEP, '68 = 3 × 21 + ', sb(5), SEP, '21 = 4 × 5 + ', sb(1), SEP, '5 = 5 × 1'] },
        { texto: 'Los cocientes, en orden: 2, 3, 4 y 5.' },
        { texto: ['Las trampas: ', letra('A'), ' pone los restos; ', letra('B'), ' invierte el orden; ', letra('D'), ' olvida el último cociente; ', letra('E'), ' es la de 68/157.'] },
      ],
      respuesta: [letra('C'), ': [2; 3, 4, 5]'] },
    { nivel: 3, titulo: 'El valor de [2; 1, 3]',
      enunciado: '¿Qué número es la fracción continua [2; 1, 3]?',
      alternativas: ['10/3', '11/4', '11/3', '4/11', '3'],
      datos: [D6.fcNot, '[2; 1, 3] = 2 + 1/(1 + 1/3)'],
      solucion: [
        { texto: 'De abajo hacia arriba: 1 + 1/3 = 4/3; 1 sobre eso es 3/4.', ecuacion: ['2 + ', { frac: ['3', '4'] }, ' = ', { frac: ['11', '4'] }] },
        { texto: ['Las trampas: ', letra('A'), ' suma 2 + 1 + 1/3 sin escalera; ', letra('C'), ' es la de [3; 1, 2], al revés; ', letra('D'), ' es la fracción invertida; ', letra('E'), ' olvida el 3, [2; 1].'] },
      ],
      respuesta: [letra('B'), ': 11/4'] },
    { nivel: 3, titulo: 'El mayor de los dos',
      enunciado: 'Dos números tienen MCD 14, y en sus divisiones sucesivas los cocientes fueron 1, 1 y 3, en ese orden. ¿Cuál es el mayor de los dos?',
      alternativas: ['56', '70', '42', '98', '14'],
      datos: [D6.div, D6.fin, D6.atras],
      solucion: [
        { texto: 'Hacia atrás: 3 × 14 = 42; 1 × 42 + 14 = 56; 1 × 56 + 42 = 98.', ecuacion: ['98 = 1 × 56 + ', sb(42), SEP, '56 = 1 × 42 + ', sb(14), SEP, '42 = 3 × ', dv(14)] },
        { texto: ['Las trampas: ', letra('A'), ' es el menor; ', letra('B'), ' multiplica 14 por 1 + 1 + 3; ', letra('C'), ' es el primer resto; ', letra('E'), ' es el MCD.'] },
      ],
      respuesta: [letra('D'), ': el 98'] },
  ];

  const euclidesIdea = {
    id: 'euclides',
    titulo: 'Euclides y la fracción continua',
    pregunta: '¿Cómo se halla el MCD sin descomponer en primos?',
    temas: ['Algoritmo de Euclides', 'Fracciones continuas'],
    pieza: CI,
    aprendizaje: 'Si al dividir A entre B sobra r, MCD(A, B) = MCD(B, r). Se sigue hasta resto 0; los cocientes dan la fracción continua.',
    actividad: 'Medir un rollo con otro, y después con lo que sobró, hasta que no sobre nada.',
    // Lee: medir un rollo con otro (50 y 15, no la predicción) y seguir con lo que sobró. No dice qué pasa con el MCD de
    // cada par (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Medir un rollo con otro', texto: 'Con los rollos de la promoción: el de 15 m se pone sobre el de 50 m tantas veces como entra. Entra 3 veces y sobran 5 m.',
          ecuacion: ['50 = 3 × 15 + ', sb(5)], pieza: CI, dibujo: { datos: filasEuclides(50, 15, 1), estado: {} } },
        { titulo: 'Seguir con lo que sobró', texto: 'Ahora el pedazo que sobró, de 5 m, se pone sobre el rollo de 15 m. Entra 3 veces y ya no sobra nada. Ese pedazo entra exacto en los dos rollos.',
          ecuacion: ['15 = 3 × ', dv(5)], pieza: CI, dibujo: { datos: filasEuclides(50, 15), estado: {} } },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir dos rollos. Cada fila mide el rollo de arriba con lo que sobró. Mira cuántas filas hacen falta y qué pieza queda al final.' },
      ],
    },
    ejemplos: EJEMPLOS_EUC,
    juega: {
      pieza: CI,
      consigna: 'La promoción mide un rollo con otro, y después con lo que sobró, hasta que no sobre nada.',
      mision: {
        // Una sola manera en la grilla: solo 60 y 38 piden seis mediciones (la prueba lo recorre).
        texto: 'Busca los dos rollos que necesitan seis mediciones para que no sobre nada.',
        logrado: v => euclides(v.a, v.b).length === 6,
        bien: '60 y 38: seis mediciones. La última pieza, de 2 m, entra exacto en todas.',
      },
      voz: 'Lo que sobra pasa a medir en la fila de abajo.',
      leyenda: [
        { s: sb('sobra'), t: 'lo que sobra: mide en la fila siguiente' },
        { s: dv('pieza exacta'), t: 'la última, que mide sin sobrante' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Rollo largo', opciones: [84, 48, 60, 90].map(x => ({ valor: x, texto: `${x} m` })) },
        { id: 'b', etiqueta: 'Rollo corto', opciones: [26, 24, 35, 38].map(x => ({ valor: x, texto: `${x} m` })) },
      ],
      dibujo: v => ({ datos: filasEuclides(v.a, v.b, 6), estado: {} }),
      lectura: v => { const ps = euclides(v.a, v.b), n = ps.length; return ['Pieza exacta: ', dv(`${ps[n - 1].b} m`), `, en ${plural(n, 'medición', 'mediciones')}`]; },
      minimo: 3,
    },
    predice: {
      pieza: CI,
      pregunta: 'Al medir un rollo de 91 m con uno de 35 m, entra 2 veces y sobran 21 m. Sin hacer más cuentas, ¿qué se puede decir del MCD de 91 y 35, y del de 35 y 21?',
      datos: ['Rollos de 91 m y de 35 m', '91 = 2 × 35 + 21'],
      voz: 'Piensa qué trozos entran en 91, en 35 y en 21.',
      opciones: [
        { id: 'c', texto: 'Son iguales', correcta: true },
        { id: 'doble', texto: 'El de 91 y 35 es el doble', error: 'AT-EUC-COCIENTE', siFuera: 'Bien mirar el cociente, 2. Pero cuenta veces, no cambia el MCD: los dos MCD valen 7.' },
        { id: 'menor', texto: 'El de 35 y 21 es más chico', error: 'AT-EUC-ACHICA', siFuera: 'Los números bajan, sí. Pero lo que entra en 91 y en 35 entra en 21: los dos valen 7.' },
        { id: 'nose', texto: 'No se sabe sin calcular los dos', error: 'AT-EUC-NOSE', siFuera: 'Calcularlos comprueba: dan 7. Pero no hace falta: lo que mide a 91 y a 35 mide a 21.' },
      ],
      dibujo: { datos: filasEuclides(91, 35, 1), estado: {} },
      revelar: { datos: filasEuclides(91, 35), estado: {} },
      coincide: 'Coincide: un trozo que entra en 91 y en 35 entra también en 91 − 2 × 35 = 21. Los dos MCD valen 7.',
      noCoincide: 'Revisemos qué trozos entran en los tres largos.',
    },
    mira: {
      pieza: CI,
      datos: Object.assign(filasEuclides(91, 35), { pasos: [1, 1, 3, 4, 4].map(h => ({ cintas: filasEuclides(91, 35).cintas.slice(0, h) })) }),
      voz: 'Cada fila mide con lo que sobró en la de arriba.',
      pasos: [
        { estado: { paso: 0 }, texto: '35 entra 2 veces en 91 y sobran 21.', ecuacion: ['91 = 2 × 35 + ', sb(21)] },
        { estado: { paso: 1 }, texto: 'Lo que entra en 91 y en 35 entra también en lo que sobra.', ecuacion: ['21 = 91 − 2 × 35'] },
        { estado: { paso: 2 }, texto: 'Se sigue con 35 y 21, y después con 21 y 14.', ecuacion: ['35 = 1 × 21 + ', sb(14), SEP, '21 = 1 × 14 + ', sb(7)] },
        { estado: { paso: 3 }, texto: '7 mide a 14 sin sobrante: es el MCD de todos los pares.', ecuacion: ['14 = 2 × ', dv(7), SEP, 'MCD(91, 35) = ', dv(7)] },
        { estado: { paso: 4 }, texto: 'Los cocientes 2, 1, 1 y 2 arman la fracción continua.', ecuacion: [{ frac: ['91', '35'] }, ' = ', ...escalera([2, 1, 1, 2])] },
      ],
    },
    regla: {
      texto: 'Si al dividir A entre B sobra r, MCD(A, B) = MCD(B, r). Se sigue hasta que no sobre nada: el último divisor es el MCD.',
      ecuacion: ['91 = 2 × 35 + ', sb(21), SEP, 'MCD(91, 35) = MCD(35, 21)', SEP, 'MCD = ', dv(7), SEP, { llave: ['[2; 1, 1, 2]'], nota: 'fracción continua de 91/35' }],
      condicion: 'el resto es menor que el divisor. Los cocientes, en orden, son los términos de la fracción continua de A/B.',
      voz: 'Lo que sobra pasa a medir.',
      dibujo: { pieza: CI, datos: filasEuclides(91, 35), estado: {} },
    },
    // Así se resuelve: el MCD de dos números grandes por divisiones sucesivas, con la fracción continua al final. «Ahora
    // tú» pide el MCD, la división que sigue, la fracción continua, el valor de una fracción continua y la suma de dos
    // números desde sus cocientes.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const g = r.de([7, 11, 13, 17, 19]), m = r.ent(8, 25), n = r.ent(5, m - 2);
          if (mcd(m, n) !== 1) continue;
          const A = g * m, B = g * n, ps = euclides(A, B);
          if (ps.length < 3 || ps.length > 5 || A > 400 || USADOS6.has(par(A, B))) continue;
          const qs = ps.map(p => p.q);
          return {
            enunciado: `Dos rollos miden ${A} cm y ${B} cm. ¿Cuál es el trozo más largo que entra exacto en los dos, y cuál es la fracción continua de ${A}/${B}?`,
            datos: [D6.div, D6.euc, D6.fin, D6.fcNot],
            pasos: [
              { tipo: 'pide', texto: `Piden el MCD de ${A} y ${B}, y la fracción continua de ${A}/${B}.` },
              { tipo: 'regla', texto: 'Con divisiones sucesivas: cada divisor pasa a dividirse y cada resto pasa a dividir, hasta que no sobre nada.' },
              { tipo: 'cuentas', texto: `Hago ${ps.length} divisiones.`, ecuacion: ps.flatMap((p, i) => [...(i ? [SEP] : []), `${p.a} = ${p.q} × ${p.b}`, ...(p.r ? [' + ', sb(p.r)] : [])]) },
              { tipo: 'aplica', texto: `El último divisor es el MCD, ${g}. Los cocientes, en orden, son ${yLista(qs)}.` },
              { tipo: 'sentido', texto: `Comprueba: ${A} = ${g} × ${m} y ${B} = ${g} × ${n}, y ${m} y ${n} son PESI.` },
            ],
            respuesta: [dv(`${g} cm`), `; la fracción continua es ${fcTexto(qs)}.`],
          };
        }
      },
    },
    ahoraTu: {
      voz: 'Lo que sobra pasa a medir.',
      generar(sem) {
        const r = azar(sem + 53), tipo = sem % 5;
        return conCuatro([casoMcdE, casoSigue, casoFC, casoValor, casoReconstruir][tipo], r);
      },
    },
  };

  // ---------- Laboratorio (sin misión ni predicción: se explora; las invitaciones invitan a un reto) ----------
  // Las cinco mesas de antes conservan su id y los de sus controles (por la colección); cambian sus colores, al mapa de la
  // unidad: el MCD en turquesa, el MCM en violeta, lo que sobra en naranja, los números dados en tinta.
  const mismo = (g, v, ks) => g.some(x => ks.every(k => x[k] === v[k]));
  // Mesa «tres combis»: tres filas de salidas de 0 a 120 minutos y el primer encuentro de las tres (violeta), si cae en
  // la recta. Las tres filas van en tinta: son números dados.
  const mcm3 = (a, b, c) => mcmL([a, b, c]);
  const TRES = []; for (let a = 2; a <= 8; a++) for (let b = a + 1; b <= 8; b++) for (let c = b + 1; c <= 8; c++) TRES.push(mcm3(a, b, c));
  const MIN3 = Math.min(...TRES);
  const rectaTres = (a, b, c) => {
    const m = mcm3(a, b, c);
    return {
      min: 0, max: 120, paso: 5, cada: 4, decimales: 0, variable: 'minutos', filas: 4,
      elementos: [
        { tipo: 'enteros', a, b: 120, cada: a, fila: 3, rotulo: `cada ${a}` },
        { tipo: 'enteros', a: b, b: 120, cada: b, fila: 2, rotulo: `cada ${b}` },
        { tipo: 'enteros', a: c, b: 120, cada: c, fila: 1, rotulo: `cada ${c}` },
        ...(m <= 120 ? [{ tipo: 'punto', x: m, color: 'f', fila: 4, rotulo: `las tres: ${m}` }] : []),
      ],
    };
  };
  const RECTA = () => Kit.piezas.recta;
  const enRecta = (datos, fila, valor) => { const g = RECTA().geometria(datos); return { x: g.x(valor), y: g.filaY(fila) }; };
  const deRecta = (datos, px) => { const g = RECTA().geometria(datos), x0 = g.x(datos.min), x1 = g.x(datos.max); return datos.min + (px - x0) * (datos.max - datos.min) / (x1 - x0); };

  // Mesas 3D (ronda 4, docs/3d.md): el MCD y el MCM de tres números, que en las cintas no se ven juntos. La caja y los
  // ladrillos los calcula el motor de plantillas/fracciones (MF.llenarCaja, MF.cuboDeLadrillos).
  // Caja · Cambia: los lados y el cubo de prueba · Permanece: la caja punteada · Progresa: de sobrar a llenar justo ·
  //   Se reserva: el turquesa, solo para cubos que llenan justo (dividen a los tres lados) · Debe verse: el cubo más
  //   grande que llena es el MCD.
  // Ladrillos · Cambia: el ladrillo y el lado del cubo · Permanece: el cubo de alambre, en violeta (un múltiplo común) ·
  //   Progresa: los ladrillos de cada lado · Se reserva: el cierre justo · Debe verse: el cubo más chico es el MCM.
  const llena = v => MF.llenarCaja(v.a, v.b, v.c, v.m);
  const cierra = v => MF.cuboDeLadrillos(v.a, v.b, v.c, v.L);
  const ladosCaja = [
    { id: 'a', etiqueta: 'largo', min: 2, max: 12, paso: 1, inicio: 12, unidad: 'cm', decimales: 0 },
    { id: 'b', etiqueta: 'ancho', min: 2, max: 12, paso: 1, inicio: 8, unidad: 'cm', decimales: 0 },
    { id: 'c', etiqueta: 'alto', min: 2, max: 8, paso: 1, inicio: 6, unidad: 'cm', decimales: 0 },
  ];
  function datosLlena(v) {
    const r = llena(v);
    return {
      bloques: r.cubos.map(q => ({ x: q.x, y: q.y, z: q.z, w: r.m, h: r.m, d: r.m, g: 0 })),
      grupos: [{ nombre: `cubos de ${r.m} cm`, color: r.justo ? 'c-i' : null, dice: `${r.cantidad} cubos de ${r.m} cm${r.justo ? ', llenan justo' : ''}` }],
      marco: { x: 0, y: 0, z: 0, w: v.a, h: v.b, d: v.c },
      // Cada medida junto a su lado, afuera de la caja (el margen crece con la caja, para no caer encima).
      marcas: (o => [
        { p: [v.a / 2, -o, 0], texto: `${v.a}` },
        { p: [v.a + o, v.b * 0.6, 0], texto: `${v.b}` },
        { p: [v.a + o, -o, v.c / 2], texto: `${v.c}` },
      ])(0.6 + 0.12 * Math.max(v.a, v.b, v.c)),
      hueco: 0.15 * Math.min(1, r.m / 2),
      alt: `Caja de ${v.a} por ${v.b} por ${v.c} cm con cubos de ${r.m} cm: caben ${r.cantidad}` + (r.justo ? ' y la llenan justo.' : ' y sobra espacio.'),
    };
  }
  function datosLadrillos(v) {
    const r = cierra(v);
    return {
      bloques: r.aristas.map(q => ({ x: q.x, y: q.y, z: q.z, w: v.a, h: v.b, d: v.c, g: q.eje + 1 })),
      grupos: [
        { nombre: 'ladrillo de la esquina', dice: 'El ladrillo de la esquina cuenta en los tres lados.' },
        ...[0, 1, 2].map(k => ({ nombre: `ladrillos a lo ${['largo', 'ancho', 'alto'][k]}`, dice: `${r.porArista[k]} ladrillos de ${r.lados[k]} cm a lo ${['largo', 'ancho', 'alto'][k]}` })),
      ],
      marco: { x: 0, y: 0, z: 0, w: v.L, h: v.L, d: v.L, color: 'c-f' },
      marcas: [
        { p: [v.L / 2, -0.25 * v.L, 0], texto: `×${r.porArista[0]}` },
        { p: [-0.25 * v.L, v.L / 2, 0], texto: `×${r.porArista[1]}` },
        { p: [-0.15 * v.L, 0, 0.75 * v.L], texto: `×${r.porArista[2]}` },
      ],
      hueco: 0.12,
      alt: `Cubo de lado ${v.L} con ladrillos de ${v.a} por ${v.b} por ${v.c}: ` + (r.justo ? `cierra justo con ${f(r.ladrillos, 0)} ladrillos.` : `${r.sobra.map((x, k) => (x ? `${v.L} no es múltiplo de ${r.lados[k]}` : '')).filter(Boolean).join(' y ')}.`),
    };
  }
  const mesaLlena = {
    id: 'caja-que-se-llena', titulo: 'La caja que se llena', pieza: 'ari-cubitos-3d',
    consigna: 'Gira la caja con el dedo. Cambia sus lados y el lado de los cubos: busca cubos que la llenen sin dejar hueco.',
    controles: ladosCaja.concat([{ id: 'm', etiqueta: 'Lado del cubo', color: 'c-i', min: 1, max: 12, paso: 1, inicio: 5, unidad: 'cm', decimales: 0 }]),
    dibujo: v => ({ datos: datosLlena(v), estado: {} }),
    lectura: v => { const r = llena(v); return [`Cubos de ${r.m}: caben ${r.porLado.join(' × ')} = ${r.cantidad}` + (r.esMcd ? ', justo: es el MCD' : r.justo ? ', llenan justo' : ', sobra espacio')]; },
    invitaciones: [
      { texto: 'Llena la caja de 12 × 8 × 6 con los cubos más grandes posibles.',
        logrado: v => v.a === 12 && v.b === 8 && v.c === 6 && llena(v).esMcd,
        bien: 'Lado 2: el mayor que divide a 12, a 8 y a 6. Es el MCD.',
        pista: 'Prueba lados que dividan a 12, a 8 y a 6. ¿Cuál es el mayor?' },
      { texto: 'Arma una caja cuyo MCD sea 4 y llénala con cubos de 4.',
        logrado: v => llena(v).esMcd && v.m === 4,
        bien: 'Cubos de 4 dividen a los tres lados, y ninguno más grande lo hace.',
        pista: 'Usa lados que sean múltiplos de 4, como 8, 12 y 4.' },
      { texto: 'Llena justo una caja que no sea cubo usando solo dos cubos.',
        logrado: v => llena(v).justo && llena(v).cantidad === 2 && !(v.a === v.b && v.b === v.c),
        bien: 'Dos cubos: un lado mide el doble y los otros dos, justo el cubo.',
        pista: 'Busca lados como 12, 6 y 6, con cubos de 6.' },
      { texto: 'Haz que el cubo divida a dos lados y deje hueco solo en el tercero.',
        logrado: v => llena(v).cantidad > 0 && llena(v).sobra.filter(x => x > 0).length === 1,
        bien: 'Basta un lado que el cubo no divida para que la caja no se llene.',
        pista: 'Mira cuál lado deja hueco y cambia solo ese.' },
      { texto: 'Guarda dos llenados justos de una caja: con el MCD y con cubos más chicos.',
        testigo: [{ a: 12, b: 8, c: 6, m: 2 }, { a: 12, b: 8, c: 6, m: 1 }],
        logrado: (v, g) => g.some(x => g.some(y => x.a === y.a && x.b === y.b && x.c === y.c && llena(x).esMcd && llena(y).justo && !llena(y).esMcd)),
        bien: 'Todo divisor común llena; el MCD lo hace con menos cubos.',
        pista: 'Con 12, 8 y 6, guarda cubos de 2 y después de 1.' },
    ],
  };
  const mesaLadrillos = {
    id: 'ladrillos-cubo', titulo: 'Ladrillos que arman un cubo', pieza: 'ari-cubitos-3d',
    consigna: 'Gira el cubo con el dedo. Elige el ladrillo y el lado del cubo: cada lado tiene que llevar ladrillos enteros.',
    controles: [
      { id: 'a', etiqueta: 'largo', min: 2, max: 6, paso: 1, inicio: 2, unidad: 'cm', decimales: 0 },
      { id: 'b', etiqueta: 'ancho', min: 2, max: 6, paso: 1, inicio: 3, unidad: 'cm', decimales: 0 },
      { id: 'c', etiqueta: 'alto', min: 2, max: 6, paso: 1, inicio: 4, unidad: 'cm', decimales: 0 },
      { id: 'L', etiqueta: 'Lado del cubo', color: 'c-f', min: 2, max: 60, paso: 1, inicio: 10, unidad: 'cm', decimales: 0 },
    ],
    dibujo: v => ({ datos: datosLadrillos(v), estado: {} }),
    lectura: v => { const r = cierra(v); return r.justo ? [`Cubo de ${v.L}: ${r.porArista.join(' × ')} = ${f(r.ladrillos, 0)} ladrillos` + (r.esMcm ? ' (MCM)' : '')] : [`Lado ${v.L}: no cierra, ${r.sobra.filter(x => x).length === 1 ? 'un lado sobra' : 'sobran lados'}`]; },
    invitaciones: [
      { texto: 'Arma el cubo más chico con ladrillos de 2 × 3 × 4.',
        logrado: v => v.a === 2 && v.b === 3 && v.c === 4 && cierra(v).esMcm,
        bien: 'Lado 12, el MCM: 6 × 4 × 3 = 72 ladrillos.',
        pista: 'El lado del cubo tiene que ser múltiplo de 2, de 3 y de 4.' },
      { texto: 'Cierra un cubo justo que no sea el más chico posible.',
        logrado: v => cierra(v).justo && !cierra(v).esMcm,
        bien: 'Cualquier múltiplo común cierra; el MCM es solo el primero.',
        pista: 'Encuentra el cubo más chico y duplica su lado.' },
      { texto: 'Elige un ladrillo cuyo cubo más chico mida 60 cm, y ármalo.',
        logrado: v => cierra(v).esMcm && v.L === 60,
        bien: '60 = 2² × 3 × 5: cada primo con su exponente mayor.',
        pista: 'Prueba un ladrillo de 3 × 4 × 5.' },
      { texto: 'Haz que dos lados cierren y uno no.',
        logrado: v => cierra(v).sobra.filter(x => x > 0).length === 1,
        bien: 'Basta un lado que no divida al cubo para que no cierre.',
        pista: 'Con 2 × 3 × 4, prueba un lado de 6 o de 18.' },
      { texto: 'Guarda dos ladrillos distintos con el mismo cubo más chico, ya armado.',
        logrado: (v, g) => g.some(x => g.some(y => cierra(x).esMcm && cierra(y).esMcm && x.L === y.L
          && [x.a, x.b, x.c].sort().join() !== [y.a, y.b, y.c].sort().join())),
        bien: 'El cubo depende de los tres lados juntos, no de un ladrillo en especial.',
        pista: 'Prueba 2 × 3 × 4 y 3 × 4 × 6: los dos cierran en 12.' },
    ],
  };
  const mesaCintas = {
    id: 'cintas-libres', titulo: 'Rollos de cualquier largo', pieza: CI,
    consigna: 'Cambia el largo de los dos rollos y el del trozo. Busca el trozo más largo que no deje sobrante.',
    controles: [
      { id: 'a', etiqueta: 'Rollo A', min: 6, max: 40, paso: 1, inicio: 24, unidad: 'm', decimales: 0 },
      { id: 'b', etiqueta: 'Rollo B', min: 6, max: 40, paso: 1, inicio: 36, unidad: 'm', decimales: 0 },
      { id: 't', etiqueta: 'Trozo', color: 'c-i', min: 1, max: 20, paso: 1, inicio: 5, unidad: 'm', decimales: 0 },
    ],
    dibujo: v => ({ datos: rollos([v.a, v.b], v.t, { max: 40 }), estado: {} }),
    lectura: v => [`${v.a} y ${v.b} m, trozo de `, dv(`${v.t}`), ': sobran ', sb(v.a % v.t), ' y ', sb(v.b % v.t)],
    invitaciones: [
      { texto: 'Con dos rollos distintos, busca el trozo más largo que no deje sobrante.',
        logrado: v => v.a !== v.b && v.t === mcd(v.a, v.b),
        bien: 'Ese trozo es el MCD: ninguno más largo entra exacto en los dos rollos.' },
      { texto: 'Elige dos rollos que solo compartan el trozo de 1 m, y córtalos con él.',
        logrado: v => mcd(v.a, v.b) === 1 && v.t === 1,
        bien: 'Solo el 1 entra en los dos: no comparten ningún primo, son PESI.' },
      { texto: 'Haz que el trozo entre exacto en un rollo y en el otro sobre algo.',
        logrado: v => v.t > 1 && (v.a % v.t === 0) !== (v.b % v.t === 0),
        bien: 'Entrar en un rollo no basta: el trozo común tiene que entrar en los dos.' },
      { texto: 'Guarda dos pares de rollos distintos, sin sobrante, con el mismo trozo más largo.',
        logrado: (v, g) => v.t === mcd(v.a, v.b) && mismo(g, v, ['a', 'b', 't'])
          && g.some(x => (x.a !== v.a || x.b !== v.b) && x.t === mcd(x.a, x.b) && x.t === v.t),
        bien: 'Rollos distintos, el mismo MCD: deciden los primos que comparten.' },
    ],
  };
  const mesaCombis = {
    id: 'tres-combis', titulo: 'Tres combis en el paradero', pieza: 'recta',
    consigna: 'Tres combis salen juntas, cada a, b y c minutos. Arrastra la quinta salida de cada una. ¿Cuándo vuelven a coincidir las tres?',
    controles: [
      { id: 'a', etiqueta: 'a', min: 2, max: 8, paso: 1, inicio: 4, unidad: 'min', decimales: 0 },
      { id: 'b', etiqueta: 'b', min: 2, max: 8, paso: 1, inicio: 6, unidad: 'min', decimales: 0 },
      { id: 'c', etiqueta: 'c', min: 2, max: 8, paso: 1, inicio: 5, unidad: 'min', decimales: 0 },
    ],
    dibujo: v => ({ datos: rectaTres(v.a, v.b, v.c), estado: {} }),
    invitaciones: [
      { texto: 'Elige tres periodos distintos que vuelvan a coincidir lo antes posible.',
        logrado: v => v.a !== v.b && v.b !== v.c && v.a !== v.c && mcm3(v.a, v.b, v.c) === MIN3,
        bien: 'Un periodo es múltiplo de los otros dos: el encuentro llega con él.' },
      { texto: 'Haz que las tres combis vuelvan a coincidir justo a los 24 minutos.',
        logrado: v => mcm3(v.a, v.b, v.c) === 24,
        bien: '24 = 2³ × 3: el MCM toma cada primo con su mayor exponente.' },
      { texto: 'Consigue que el encuentro de las tres caiga fuera de la recta de 120 minutos.',
        logrado: v => mcm3(v.a, v.b, v.c) > 120,
        bien: 'Con pocos factores comunes, el MCM se acerca al producto y crece rápido.' },
      { texto: 'Guarda dos casos con periodos distintos y el mismo encuentro de las tres.',
        logrado: (v, g) => mismo(g, v, ['a', 'b', 'c']) && g.some(x => [x.a, x.b, x.c].sort().join() !== [v.a, v.b, v.c].sort().join()
          && mcm3(x.a, x.b, x.c) === mcm3(v.a, v.b, v.c)),
        bien: 'El encuentro solo depende de cada primo con su mayor exponente.' },
    ],
    lectura: v => {
      const m = mcm3(v.a, v.b, v.c);
      return [`Cada ${v.a}, ${v.b} y ${v.c} min: juntas a los `, ml(`${m} min`), m > 120 ? ', fuera de la recta' : ''];
    },
    arrastres: ['a', 'b', 'c'].map((k, i) => ({
      id: `salida-${k}`, etiqueta: `quinta salida de la combi ${k}`,
      donde: v => enRecta(rectaTres(v.a, v.b, v.c), 3 - i, 5 * v[k]),
      mover: (pt, v) => ({ [k]: deRecta(rectaTres(v.a, v.b, v.c), pt.x) / 5 }),
    })),
  };
  // Mesa «Euclides»: el juego de la idea 6 con más rollos (deslizadores).
  let filasMaxE = 0; for (let a = 30; a <= 90; a += 6) for (let b = 10; b <= 28; b += 2) filasMaxE = Math.max(filasMaxE, euclides(a, b).length);
  const mesaEuclides = {
    id: 'euclides', titulo: 'Euclides: medir con lo que sobra', pieza: CI,
    consigna: 'Elige los dos rollos. Cada fila mide el rollo de arriba con lo que sobró, hasta que no sobra nada.',
    controles: [
      { id: 'a', etiqueta: 'Rollo largo', min: 30, max: 90, paso: 6, inicio: 84, unidad: 'm', decimales: 0 },
      { id: 'b', etiqueta: 'Rollo corto', min: 10, max: 28, paso: 2, inicio: 24, unidad: 'm', decimales: 0 },
    ],
    dibujo: v => ({ datos: filasEuclides(v.a, v.b, filasMaxE), estado: {} }),
    lectura: v => { const n = euclides(v.a, v.b).length; return ['MCD(', `${v.a}, ${v.b}) = `, dv(mcd(v.a, v.b)), `, en ${plural(n, 'división', 'divisiones')}`]; },
    invitaciones: [
      { texto: 'Busca un par que necesite cinco divisiones o más.',
        // En esta mesa, 7 de los 110 pares; el más largo, (42, 26), pide 6.
        logrado: v => euclides(v.a, v.b).length >= 5,
        bien: 'Restos que bajan despacio alargan el camino. ¿Cuál es su MCD?' },
      { texto: 'Haz que Euclides termine en una sola división.',
        logrado: v => euclides(v.a, v.b).length === 1,
        bien: 'Si el rollo corto entra exacto en el largo, el MCD es el corto.' },
      { texto: 'Busca un par cuyo último divisor, el MCD, sea 2.',
        logrado: v => mcd(v.a, v.b) === 2,
        bien: 'Aquí los dos rollos siempre son pares: el MCD nunca baja de 2.' },
      { texto: 'Guarda dos pares con el mismo MCD y distinta cantidad de divisiones.',
        logrado: (v, g) => mismo(g, v, ['a', 'b']) && g.some(x => mcd(x.a, x.b) === mcd(v.a, v.b) && euclides(x.a, x.b).length !== euclides(v.a, v.b).length),
        bien: 'Caminos de distinto largo, mismo MCD: lo que cuenta es el último divisor.' },
    ],
  };

  return {
    unidad: 'aritmetica.mcd-y-mcm',
    version: '0.3.0',
    estado: 'completa',
    colores: COLORES,
    letras: { A: 'un número dado: un largo, un periodo o una bolsita', B: 'otro número dado', C: 'un tercer número dado',
      N: 'el número que se busca (los caramelos del paquete)', k: 'un entero', p: 'el cociente A ÷ MCD (con q, son PESI)',
      q: 'el cociente B ÷ MCD', r: 'el resto: lo que sobra', r_e: 'lo que falta para otro grupo (el resto por exceso)',
      L: 'hasta dónde se cuenta: el último número del tramo' },
    requiere: ['/nucleo/kit/piezas/arit-cintas.js', '/nucleo/kit/piezas/arit-boletos.js', '/nucleo/kit/piezas/arit-reparto.js', '/nucleo/kit/piezas/arit-tabla.js',
      '/nucleo/kit/piezas/recta.js', '/plantillas/fracciones/motor.js', '/nucleo/kit/piezas/ari-cubitos-3d.js'],
    glosario: [
      // De 2 a 4 palabras por idea, con su aproximación y tres ejemplos. «divisor», «múltiplo» y «resto» son de Las cuatro
      // operaciones; «PESI» y «factor primo», de Números primos: aquí no se definen. «máximo común divisor» se mudó aquí
      // desde Divisibilidad (19 nov). Ningún ejemplo resuelve una predicción ni una misión.
      // Idea 1.
      { termino: 'divisor común', formas: ['divisor común', 'divisores comunes'], def: 'Número que divide exacto a dos o más números.',
        simple: 'Un trozo que entra exacto en las dos cintas, sin que sobre.', ver: ['máximo común divisor'],
        ejemplos: ['3 lo es de 9 y de 15.', '2 lo es de 10 y de 14.', 'El 1 lo es de cualquier par de números.'] },
      { termino: 'máximo común divisor', simbolo: 'MCD', formas: ['máximo común divisor', 'MCD'], def: 'El mayor de los divisores comunes de dos o más números.',
        simple: 'El trozo más largo que corta las dos cintas sin sobrante.', ver: ['divisor común', 'mínimo común múltiplo'],
        ejemplos: ['MCD(8, 20) = 4.', 'MCD(9, 20) = 1: no comparten ningún primo.', 'MCD(5, 15) = 5.'] },
      // Idea 2.
      { termino: 'múltiplo común', formas: ['múltiplo común', 'múltiplos comunes'], def: 'Número que es múltiplo de dos o más números a la vez.',
        simple: 'Un boleto que gana los dos premios.', ver: ['mínimo común múltiplo'],
        ejemplos: ['12 lo es de 3 y de 4.', '30 lo es de 5 y de 6.', 'El 0 lo es de todos; no se cuenta.'] },
      { termino: 'mínimo común múltiplo', simbolo: 'MCM', formas: ['mínimo común múltiplo', 'MCM'], def: 'El menor múltiplo común, sin contar el 0, de dos o más números.',
        simple: 'La primera vez que dos cosas que se repiten coinciden.', ver: ['múltiplo común', 'máximo común divisor'],
        ejemplos: ['MCM(4, 6) = 12.', 'MCM(3, 5) = 15: son PESI.', 'MCM(4, 8) = 8.'] },
      // Idea 3.
      { termino: 'cocientes PESI', formas: ['cocientes PESI', 'cocientes'], def: 'A ÷ MCD(A, B) y B ÷ MCD(A, B): cuántas veces entra el MCD en cada número. Siempre son PESI.',
        simple: 'Cuántos trozos del MCD tiene cada número; nunca comparten primos.', ver: ['máximo común divisor'],
        ejemplos: ['20 y 30, con MCD 10: cocientes 2 y 3.', '9 y 21, con MCD 3: cocientes 3 y 7.', 'Si compartieran un primo, el MCD sería mayor.'] },
      { termino: 'contraejemplo', formas: ['contraejemplo', 'contraejemplos'], def: 'Un caso que cumple las condiciones de una regla pero no su conclusión: muestra que la regla no vale siempre.',
        simple: 'Un solo caso que muestra que una regla no vale siempre.', ver: [],
        ejemplos: ['9 lo es de «todo impar es primo».', '2 lo es de «todo primo es impar».', 'Uno solo basta para descartar una regla.'] },
      // Idea 4.
      { termino: 'resto común', formas: ['resto común', 'restos comunes', 'mismo resto'], def: 'Lo que sobra, igual en todos, al dividir un número entre varios divisores.',
        simple: 'Los mismos caramelos sueltos con bolsitas de distinto tamaño.', ver: ['mínimo común múltiplo'],
        ejemplos: ['25 deja 1 con 3 y con 4.', '17 deja 2 con 3 y con 5.', '23 deja 3 con 4 y con 5.'] },
      { termino: 'homogeneizar', formas: ['homogeneizar', 'homogeneiza', 'homogeneizan'], def: 'Volver iguales los restos mirando lo que falta para otro grupo, en vez de lo que sobra.',
        simple: 'Pasar de sobrantes distintos a un mismo «falta».', ver: ['resto común'],
        ejemplos: ['Sobran 2 con 3 y 3 con 4: falta 1 en los dos.', 'Sobran 4 con 5 y 5 con 6: falta 1.', 'Entonces el número más 1 es múltiplo común.'] },
      // Idea 5.
      { termino: 'inclusión y exclusión', formas: ['inclusión y exclusión', 'inclusión-exclusión'], def: 'Contar lo que está en un grupo o en otro: se suman los dos y se resta lo común.',
        simple: 'Sumar los grupos y quitar lo que se contó dos veces.', ver: ['múltiplo común'],
        ejemplos: ['Del 1 al 10, de 2 o de 3: 5 + 3 − 1 = 7.', 'Del 1 al 20, de 2 o de 5: 10 + 4 − 2 = 12.', 'Lo de los dos grupos se resta una sola vez.'] },
      { termino: 'tramo', formas: ['tramo', 'tramos'], def: 'Los números enteros seguidos que van de un número a otro.',
        simple: 'Un pedazo de la lista de números, como del 50 al 100.', ver: [],
        ejemplos: ['Del 1 al 30 es un tramo de 30 números.', 'Del 10 al 19 hay 10 números.', 'Los de tres cifras van del 100 al 999.'] },
      // Idea 6.
      { termino: 'algoritmo de Euclides', formas: ['algoritmo de Euclides', 'divisiones sucesivas'], def: 'Método para hallar el MCD: el divisor pasa a dividirse y el resto a dividir, hasta resto 0.',
        simple: 'Medir un rollo con otro, después con lo que sobra, hasta que no sobre.', ver: ['máximo común divisor', 'fracción continua'],
        ejemplos: ['Con 50 y 15: sobran 5, y 5 mide exacto a 15.', 'Con 30 y 12: sobran 6, y 6 mide exacto a 12.', 'Sirve cuando descomponer en primos cuesta.'] },
      { termino: 'fracción continua', formas: ['fracción continua', 'fracciones continuas'], def: 'Un número escrito como entero más 1 sobre otro número, que a su vez se escribe igual.',
        simple: 'Una escalera de fracciones hecha con los cocientes de Euclides.', ver: ['algoritmo de Euclides'],
        ejemplos: ['9/4 = 2 + 1/4: se anota [2; 4].', '30/18 = [1; 1, 2].', 'El primer término es la parte entera.'] },
      // «término» se queda aquí: Sucesiones y series lo nombra en su glosario («ver»).
      { termino: 'término', formas: ['término', 'términos'], def: 'Cada número de una lista ordenada o de una suma, con su lugar fijo: primero, segundo…',
        simple: 'Cada número de una lista, con su lugar: el primero, el segundo…', ver: ['fracción continua'],
        ejemplos: ['[2; 1, 3] tiene tres términos: 2, 1 y 3.', 'En 5, 10, 15, el segundo término es 10.', 'En una fracción continua, el primero es la parte entera.'] },
    ],
    laboratorio: [mesaLlena, mesaLadrillos, mesaCintas, mesaCombis, mesaEuclides],
    historia: {
      texto: 'En el libro VII de los Elementos, el máximo común divisor aparece como la mayor medida común de dos números. Euclides lo busca quitando de una cantidad lo que cabe de la otra, con segmentos y restas. La división con resto de hoy comprime esas restas repetidas. El mínimo común múltiplo responde a la pregunta contraria: la primera cantidad que se arma entera con ambas medidas.',
      pregunta: '¿Qué medida cabe exacta en dos cintas distintas?',
      fuente: { titulo: 'Euclides, Elementos VII.2; edición y comentario de David E. Joyce — Clark University', url: 'https://mathcs.clarku.edu/~djoyce/elements/bookVII/propVII2.html' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov). Las ideas sin mesa propia aportan su juego.
    laboratorioIdeas: {
      'caja-que-se-llena': ['mcd-cintas'],
      'ladrillos-cubo': ['mcm-coinciden'],
      'cintas-libres': ['mcd-cintas'],
      'tres-combis': ['mcm-coinciden'],
      'euclides': ['euclides'],
    },
    ideas: [trozo, coinciden, relacion, mismoResto, tramo, euclidesIdea],
  };
});
