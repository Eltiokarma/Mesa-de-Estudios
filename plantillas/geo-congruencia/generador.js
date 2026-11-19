/*
 * Generador «Congruencia de triángulos»: la práctica de las seis ideas de geometria.congruencia
 * (contenido/teoria/geometria/congruencia.js). Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['geo-congruencia']) y en Node (require). Propuesta: docs/etapa5/propuesta-geometria.md §7a.
 *
 * Tipos por idea (nivel 1: un paso; 2: dos pasos; 3: de examen, con modelos de San Marcos):
 *   criterios               criterio (1): qué criterio asegura la congruencia con tres parejas de datos (o ninguno) ·
 *                           cuantos (2): cuántos triángulos da LLA con 30° · con-x (3): la medida que falta, con x
 *   partes-correspondientes orden (1): el lado que le toca por el orden de las letras · angulo-orden (2): el ángulo de la
 *                           copia que va con el tercero (suma de 180°) · cruce (3): dos segmentos que se cruzan, con x
 *                           (San Marcos 2021) · iso-de (3): un isósceles con BD = EC y el ángulo ADE (San Marcos 2022)
 *   mediatriz-bisectriz     iso-med (1): el ángulo de P en la mediatriz · igualar (2): las dos distancias con x ·
 *                           perimetro (3): la mediatriz de AC corta BC · perp-bis (3): la perpendicular a la bisectriz
 *                           (San Marcos 2027-I)
 *   base-media              mitad (1): la base media o el lado · reciproco (1): adónde llega la paralela · con-x (2) ·
 *                           medial (2): el triángulo de los puntos medios · dos-bases (3): dos bases medias seguidas
 *                           (San Marcos 2026-II)
 *   mediana-hipotenusa      mediana (1) · iso-ang (2): el ángulo que copia la mediana · med-x (2) · med-altura (3): el
 *                           ángulo entre la mediana y la altura · entero (3): el mayor cateto entero (San Marcos 2023-II)
 *   notables                n30 (1) · n37 (1): un cable o una escalera · n45 (2): con √2 · iso120 (3): el isósceles de
 *                           120° · altura (3): la altura que parte en dos notables (San Marcos 2024-II)
 * Todos se resuelven con el texto (sin figura): la práctica y el papel no llevan dibujo.
 *
 * Datos (punto 13; molde §4): una línea por dato, las mismas definiciones y reglas de la teoría (los criterios, el orden
 * de las letras, la mediatriz y la bisectriz, la base media, la mediana a la hipotenusa, los tres notables), nunca el
 * paso hecho. Notación de la unidad: m∠A; x sin «°»; el segundo triángulo es DEF; todo largo con su unidad.
 * Colores (regla de la unidad): lo pedido y su resultado en violeta (x), solo en la solución.
 * Errores (todos hipótesis de aula, sin medir; docs/investigacion/geometria-ideas-erroneas.md, «Congruencia»): GE-CON1 a
 * GE-CON73 de la teoría y GE-TRI5, GE-TRI15 y GE-DT15 de Triángulos. Ninguna explicación nombra una alternativa por su
 * letra (los problemas tienen puntos A a F); cada una empieza por lo que el alumno hizo bien.
 * Cuentas comprobadas con un script aparte (casos.json, «verificacion») y con el recálculo de generador.test.js.
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar, nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'geo-congruencia';
  const v = P.v;
  const f = x => P.formatear(x, 2);
  const gr = x => `${f(x)}°`;
  const cm = x => `${f(x)} cm`;
  const m = x => `${f(x)} m`;
  const RAD = Math.PI / 180;
  const er = (id, valor, explicacion) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente: null });
  const erT = (id, texto, explicacion) => Object.assign(er(id, null, explicacion), { clave: texto, texto });
  const tope = () => { let n = 0; return () => ++n < 500; };
  const rad = (a, r) => (r === 1 ? f(a) : `${a === 1 ? '' : f(a)}√${r}`);

  // ---------- Datos (una línea cada uno; los de la teoría) ----------
  const D = {
    crit: 'Criterios de congruencia: LAL (el ángulo entre los dos lados), ALA (el lado entre los dos ángulos) y LLL.',
    no: 'LLA (el ángulo no queda entre los dos lados) y AAA no aseguran la congruencia.',
    seis: 'En triángulos congruentes, las seis medidas coinciden, una por una.',
    orden: 'En una congruencia escrita, las letras van en orden: primera con primera, segunda con segunda, tercera con tercera.',
    par: 'En triángulos congruentes, frente a ángulos iguales hay lados iguales, y al revés.',
    suma: 'En todo triángulo, los tres ángulos interiores suman 180°.',
    opuestos: 'Opuestos por el vértice: miden igual.',
    iso: 'En un triángulo isósceles, los ángulos de la base miden igual.',
    med: 'Mediatriz de un segmento: la recta perpendicular a él por su punto medio.',
    bis: 'Bisectriz de un ángulo: la recta que lo parte en dos ángulos iguales.',
    dist: 'La distancia de un punto a una recta se mide por la perpendicular.',
    teo: 'Todo punto de la mediatriz de un segmento equidista de sus extremos; todo punto de la bisectriz, de los lados del ángulo.',
    rec: 'Y al revés: si un punto equidista de A y de B, está en la mediatriz de AB.',
    per: 'El perímetro de un triángulo es la suma de sus tres lados.',
    bm: 'Base media: el segmento que une los puntos medios de dos lados de un triángulo.',
    tbm: 'La base media es paralela al tercer lado y mide su mitad.',
    rbm: 'La paralela al tercer lado que sale de un punto medio llega al punto medio del otro lado.',
    mediana: 'Mediana: el segmento que va de un vértice al punto medio del lado de enfrente.',
    mh: 'En un triángulo rectángulo, la mediana relativa a la hipotenusa mide la mitad de ella: MA = MB = MC.',
    hip: 'En un triángulo rectángulo, la hipotenusa es el lado de enfrente del ángulo recto; es el lado mayor.',
    altura: 'Altura: el segmento perpendicular desde un vértice al lado de enfrente.',
    n30: 'Notable de 30° y 60°: catetos k (frente a 30°) y k√3; hipotenusa 2k.',
    n45: 'Notable de 45° y 45°: catetos k y k; hipotenusa k√2.',
    n37: 'Notable de 37° y 53° (convención del examen): catetos 3k (frente a 37°) y 4k; hipotenusa 5k.',
    raiz2: 'Dividir entre √2 es multiplicar por √2 y dividir entre 2: 10 ÷ √2 = 5√2.',
    isoAlt: 'En un isósceles, la altura desde el vértice de los lados iguales cae en el punto medio de la base.',
    recto: 'El ángulo de 90° está entre el piso y la vertical.',
  };
  const exL = (a, b) => `${a === 1 ? '' : a}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}`;

  // =============================== Idea 1: criterios ===============================
  const CRIT = ['LAL', 'ALA', 'LLL'], NING = 'Ninguno: esos datos no bastan';
  function criterio(rng) {
    const k = rng.elegir(['LAL', 'ALA', 'LLL', 'LLA', 'AAA']);
    let a = 5 * rng.entero(8, 14);
    const b = 5 * rng.entero(8, 14), c1 = rng.entero(5, 9);
    let c2 = rng.entero(4, 8);
    const c3 = rng.entero(4, 8);
    // LLA es «no basta» solo si salen dos triángulos: BC entre la distancia de B a la recta de AC (AB · sen A) y AB, sin
    // los extremos (auditoría del 19 nov, A1: con BC ≥ AB sale uno solo, y con BC menor que esa distancia, ninguno).
    if (k === 'LLA') {
      const dosDe = (ab, ang) => { const h = ab * Math.sin(ang * RAD), lo = Math.floor(h + 1e-9) + 1, hi = ab - 1; return lo <= hi ? [lo, hi] : null; };
      if (!(c2 > (c1 + 2) * Math.sin(a * RAD) + 1e-9 && c2 < c1 + 2)) {
        if (!dosDe(c1 + 2, a)) a = 30;
        const [lo, hi] = dosDe(c1 + 2, a); c2 = rng.entero(lo, hi);
      }
    }
    const datos = { LAL: [`AB = DE = ${cm(c1)}`, `m∠A = m∠D = ${a}°`, `AC = DF = ${cm(c2)}`], ALA: [`m∠A = m∠D = ${a}°`, `AB = DE = ${cm(c1)}`, `m∠B = m∠E = ${b}°`],
      LLL: [`AB = DE = ${cm(c1 + 2)}`, `BC = EF = ${cm(c2)}`, `AC = DF = ${cm(c3)}`], LLA: [`AB = DE = ${cm(c1 + 2)}`, `BC = EF = ${cm(c2)}`, `m∠A = m∠D = ${a}°`],
      AAA: [`m∠A = m∠D = 50°`, `m∠B = m∠E = 60°`, `m∠C = m∠F = 70°`] }[k];
    const bien = CRIT.includes(k) ? k : NING;
    const SF = {
      LAL: { ALA: ['GE-CON3', 'Ver dos medidas iguales está bien; ALA lleva dos ángulos y aquí hay uno.'], LLL: ['GE-CON25', 'Contar las medidas está bien; LLL son tres lados y aquí uno es un ángulo.'], no: ['GE-CON26', 'Dudar está bien con LLA; aquí el ángulo queda entre los dos lados.'] },
      ALA: { LAL: ['GE-CON3', 'Ver dos medidas iguales está bien; LAL lleva dos lados y aquí hay uno.'], LLL: ['GE-CON25', 'Contar las medidas está bien; LLL son tres lados.'], no: ['GE-CON26', 'Dudar está bien con AAA; aquí hay un lado, entre los dos ángulos.'] },
      LLL: { LAL: ['GE-CON25', 'Contar las medidas está bien; LAL lleva un ángulo y aquí no hay.'], ALA: ['GE-CON3', 'Ver tres datos está bien; ALA lleva dos ángulos.'], no: ['GE-CON26', 'Dudar está bien con dos lados; con los tres, el triángulo queda fijo.'] },
      LLA: { LAL: ['GE-CON1', 'Ver dos lados y un ángulo está bien; pero el ángulo A no queda entre AB y BC.'], ALA: ['GE-CON3', 'ALA lleva dos ángulos; aquí hay uno.'], LLL: ['GE-CON25', 'LLL son tres lados; aquí uno es un ángulo.'] },
      AAA: { ALA: ['GE-CON4', 'Ver ángulos iguales está bien; ALA pide además un lado igual.'], LAL: ['GE-CON25', 'LAL lleva dos lados; aquí no hay ninguno.'], LLL: ['GE-CON3', 'LLL son tres lados; aquí los tres datos son ángulos.'] } }[k];
    const errores = (CRIT.includes(k) ? CRIT.filter(x => x !== k).concat(['no']) : CRIT).map(x => erT(SF[x][0], x === 'no' ? NING : x, SF[x][1]));
    return { enunciado: [`En △ABC y △DEF se sabe: ${datos.join('; ')}.`], pregunta: ['¿Qué criterio asegura que son congruentes?'], datos: [D.crit, D.no],
      texto: { correcta: { clave: bien, texto: bien }, errores },
      solucion: [[{ LAL: 'El ángulo A queda entre los lados AB y AC: lado, ángulo, lado.', ALA: 'El lado AB va del ángulo A al ángulo B: ángulo, lado, ángulo.', LLL: 'Los tres lados, cada uno con su pareja: lado, lado, lado.', LLA: 'El ángulo A queda frente a BC, no entre AB y BC: es LLA. BC pasa de la distancia de B a la recta y es menor que AB: caben dos triángulos, y no basta.', AAA: 'Tres ángulos y ningún lado: la forma, sí; el tamaño, no.' }[k]], [v('x', bien), '.']],
      _datos: { tipo: 'criterio', idea: 'criterios', nivel: 1, caso: k } };
  }
  function cuantos(rng) {
    const c = 2 * rng.entero(4, 8), h = c / 2, cat = rng.entero(0, 2), bc = cat === 0 ? rng.entero(2, h - 1) : cat === 1 ? h : rng.entero(h + 1, c - 1);
    const T = ['Ninguno', 'Uno solo', 'Dos', 'Muchos'];
    const SF = [
      { 1: ['GE-CON1', `Comparar está bien; uno solo saldría con BC = ${h} cm justos.`], 2: ['GE-CON28', `Comparar está bien; dos saldrían con BC entre ${h} cm y ${c} cm.`], 3: ['GE-CON16', 'Girar BC está bien; pero C tiene que caer en la recta.'] },
      { 0: ['GE-CON2', `Comparar está bien; con BC = ${h} cm justos, BC sí llega a la recta.`], 2: ['GE-CON28', `Comparar está bien; con ${h} cm justos, apenas la toca: un punto.`], 3: ['GE-CON16', 'Girar BC está bien; pero C tiene que caer en la recta.'] },
      { 0: ['GE-CON2', `Comparar está bien; ${bc} cm pasa de ${h} cm: sí llega.`], 1: ['GE-CON1', 'Uno solo saldría con el ángulo entre los dos lados; aquí queda frente a BC.'], 3: ['GE-CON16', 'Girar BC está bien; pero C tiene que caer en la recta: dos lugares.'] }][cat];
    const errores = [0, 1, 2, 3].filter(x => x !== cat).map(x => erT(SF[x][0], T[x], SF[x][1]));
    return { enunciado: [`Se quiere armar un triángulo con AB = ${cm(c)}, m∠A = 30° y BC = ${cm(bc)}.`], pregunta: ['¿Cuántos triángulos distintos salen?'],
      datos: [`B queda a ${cm(h)} de la recta donde irá AC, medido en perpendicular.`, 'C es un punto de esa recta, a BC de B.'],
      texto: { correcta: { clave: T[cat], texto: T[cat] }, errores },
      solucion: [[cat === 0 ? `BC mide menos que ${cm(h)}: no llega a la recta.` : cat === 1 ? `BC mide justo ${cm(h)}: toca la recta en un punto.` : `BC pasa de ${cm(h)} y es menor que AB: corta la recta en dos puntos.`], [v('x', T[cat]), '.']],
      _datos: { tipo: 'cuantos', idea: 'criterios', nivel: 2, AB: c, BC: bc } };
  }
  function conX(rng) {
    for (const sigue = tope(); sigue();) {
      const k = rng.elegir(['LAL', 'ALA']), x = rng.entero(3, 9), p = rng.entero(2, 4), q = rng.entero(1, 9), val = p * x - q, s = val - x;
      if (val < 6 || s < 2 || q === s) continue;
      const [n1, n2] = k === 'LAL' ? ['BC', 'EF'] : ['AC', 'DF'], xMal = (s - q) / (p - 1);
      return { enunciado: [`En △ABC y △DEF: ${k === 'LAL' ? 'AB = DE, m∠A = m∠D y AC = DF' : 'm∠A = m∠D, AB = DE y m∠B = m∠E'}. Además, ${n1} = ${exL(p, -q)} y ${n2} = ${exL(1, s)}, en centímetros.`], pregunta: [`¿Cuánto mide ${n1}?`],
        datos: [D.crit, D.seis], correcta: val, fmt: cm,
        errores: [er('GE-CON30', x, `Hallar x = ${x} está bien; falta reemplazarlo para tener ${n1}.`), er('GE-CON31', 2 * val, `Igualar está bien; eso suma ${n1} y ${n2}.`),
          er('GE-TRI15', Number.isInteger(xMal) ? p * xMal - q : NaN, 'Igualar está bien; al pasar un número al otro lado cambia su signo.'), er('GE-CON25', val + p, 'Igualar está bien; revisa el despeje: con la x correcta, las dos dan lo mismo.')],
        solucion: [[`Por ${k}, los triángulos son congruentes: ${n1} = ${n2}.`], [`${exL(p, -q)} = ${exL(1, s)}, así x = ${x}.`], [`${n1} = `, v('x', cm(val)), '.']],
        _datos: { tipo: 'con-x', idea: 'criterios', nivel: 3, p, q, s, pide: n1 } };
    }
  }

  // =============================== Idea 2: partes correspondientes ===============================
  const PERM = ['DFE', 'EDF', 'EFD', 'FDE', 'FED'];
  const ordenar = L => L.split('').sort().join('');
  function orden(rng) {
    for (const sigue = tope(); sigue();) {
      const perm = rng.elegir(PERM), c = rng.entero(6, 12), a = rng.entero(5, 11), b = rng.entero(4, 10);
      if (new Set([a, b, c]).size < 3 || a + b <= c || a + c <= b || b + c <= a) continue;
      const med = { AB: c, BC: a, AC: b }, corr = { [ordenar(perm[0] + perm[1])]: 'AB', [ordenar(perm[1] + perm[2])]: 'BC', [ordenar(perm[0] + perm[2])]: 'AC' };
      const alfa = { DE: 'AB', EF: 'BC', DF: 'AC' }, pide = rng.elegir(['DE', 'EF', 'DF']);
      if (corr[pide] === alfa[pide]) continue;
      const tercero = ['AB', 'BC', 'AC'].find(L => L !== corr[pide] && L !== alfa[pide]);
      return { enunciado: [`△ABC ≅ △${perm}, con AB = ${cm(c)}, BC = ${cm(a)} y AC = ${cm(b)}.`], pregunta: [`¿Cuánto mide ${pide}?`], datos: [D.orden], correcta: med[corr[pide]], fmt: cm,
        errores: [er('GE-CON3', med[alfa[pide]], `Usar el orden está bien; ${pide} iría con ${alfa[pide]} si fuera △ABC ≅ △DEF.`), er('GE-CON32', med[tercero], `Buscar la pareja está bien; ${tercero} no está en el lugar de ${pide}.`),
          er('GE-CON31', a + b + c - med[corr[pide]], 'Sumar los otros dos lados no da un lado: se busca su pareja.'), er('GE-CON18', a + b + c, `Eso es el perímetro; ${pide} es un solo lado.`)],
        solucion: [[`Por el orden de las letras, ${pide} va con ${corr[pide]}.`], [`${pide} = ${corr[pide]} = `, v('x', cm(med[corr[pide]])), '.']],
        _datos: { tipo: 'orden', idea: 'partes-correspondientes', nivel: 1, perm, AB: c, BC: a, AC: b, pide } };
    }
  }
  function anguloOrden(rng) {
    for (const sigue = tope(); sigue();) {
      const perm = rng.elegir(PERM), A = 5 * rng.entero(8, 16), B = 5 * rng.entero(8, 16), C = 180 - A - B;
      if (C < 30 || new Set([A, B, C]).size < 3) continue;
      const pide = perm[2];   // la pareja de C
      return { enunciado: [`△ABC ≅ △${perm}, con m∠A = ${A}° y m∠B = ${B}°.`], pregunta: [`¿Cuánto mide el ángulo ${pide}?`], datos: [D.orden, D.suma], correcta: C, fmt: gr,
        errores: [er('GE-CON3', { D: A, E: B, F: C }[pide] === C ? NaN : { D: A, E: B, F: C }[pide], `Buscar la pareja está bien; pero ${pide} no va con la letra del mismo lugar en el abecedario.`), er('GE-TRI5', A + B, 'Sumar los dos está bien; el tercero es lo que falta para 180°.'),
          er('GE-CON34', 180 - C, 'Restar de 180° está bien; eso es la suma de los otros dos.'), er('GE-CON32', A, `${A}° es m∠A; ${pide} va con C.`), er('GE-CON33', B, `${B}° es m∠B; ${pide} va con C.`)],
        solucion: [[`${pide} es la tercera letra: va con C.`], [`m∠C = 180° − ${A}° − ${B}° = ${C}°.`], [`m∠${pide} = `, v('x', gr(C)), '.']],
        _datos: { tipo: 'angulo-orden', idea: 'partes-correspondientes', nivel: 2, perm, A, B } };
    }
  }
  function cruce(rng) {
    for (const sigue = tope(); sigue();) {
      const x = rng.entero(3, 9), p = rng.entero(2, 4), q = rng.entero(1, 9), val = p * x - q, s = val - x;
      if (val < 6 || s < 2 || q === s || val > 30) continue;
      const xMal = (s - q) / (p - 1);
      return { enunciado: [`AD y BC se cortan en O, con OA = OD y OB = OC. Además, AB = ${exL(p, -q)} y CD = ${exL(1, s)}, en centímetros.`], pregunta: ['¿Cuánto mide AB?'],
        datos: [D.crit, D.opuestos, D.par], correcta: val, fmt: cm,
        errores: [er('GE-CON30', x, `Hallar x = ${x} está bien; falta reemplazarlo en AB.`), er('GE-CON31', 2 * val, 'Igualar está bien; eso suma AB y CD.'),
          er('GE-TRI15', Number.isInteger(xMal) ? p * xMal - q : NaN, 'Igualar está bien; al pasar un número al otro lado cambia su signo.'), er('GE-CON29', val + p, 'Ver la congruencia está bien; revisa el despeje: AB y CD dan lo mismo.')],
        solucion: [['Los ángulos en O son opuestos: por LAL, △AOB ≅ △DOC, y AB = CD.'], [`${exL(p, -q)} = ${exL(1, s)}, así x = ${x}.`], ['AB = ', v('x', cm(val)), '.']],
        _datos: { tipo: 'cruce', idea: 'partes-correspondientes', nivel: 3, p, q, s } };
    }
  }
  function isoDE(rng) {
    const t = 10 * rng.entero(2, 8), val = (180 - t) / 2;
    return { enunciado: [`En el triángulo ABC, AB = AC. D y E están en BC, con BD = EC, y m∠DAE = ${t}°.`], pregunta: ['¿Cuánto mide el ángulo ADE?'],
      datos: [D.crit, D.iso, D.par, D.suma], correcta: val, fmt: gr,
      errores: [er('GE-CON35', t, `Ver D y E iguales está bien; ${t}° es el ángulo de A.`), er('GE-CON34', 180 - val, `Hallar ${val}° está bien; ${180 - val}° es su vecino ADB.`),
        er('GE-CON36', t / 2, 'Partir en dos está bien; se parte lo que falta para 180°, no el ángulo de A.'), er('GE-TRI5', 180 - t, 'Restar de 180° está bien; falta partirlo entre los dos iguales.')],
      solucion: [['Por LAL (AB = AC, m∠B = m∠C, BD = CE), △ABD ≅ △ACE: AD = AE.'], [`△ADE es isósceles: m∠ADE = (180° − ${t}°) ÷ 2 = `, v('x', gr(val)), '.']],
      _datos: { tipo: 'iso-de', idea: 'partes-correspondientes', nivel: 3, t } };
  }

  // =============================== Idea 3: mediatriz y bisectriz ===============================
  function isoMed(rng) {
    const th = 5 * rng.entero(7, 15), val = 180 - 2 * th;
    return { enunciado: [`P equidista de A y de B, y m∠PAB = ${th}°.`], pregunta: ['¿Cuánto mide el ángulo APB?'], datos: [D.rec, D.iso, D.suma], correcta: val, fmt: gr,
      errores: [er('GE-CON35', th, `Ver el isósceles está bien; ${th}° es un ángulo de la base.`), er('GE-TRI5', 180 - th, 'Restar de 180° está bien; falta restar también el ángulo B.'),
        er('GE-CON43', 90 - th, 'Eso mide el ángulo APM, la mitad: la mediatriz parte el ángulo de P.'), er('GE-CON34', 2 * th, 'Sumar los ángulos de la base está bien; el de P es lo que les falta para 180°.')],
      solucion: [[`PA = PB: △APB es isósceles y m∠PBA = ${th}°.`], [`m∠APB = 180° − 2 · ${th}° = `, v('x', gr(val)), '.']],
      _datos: { tipo: 'iso-med', idea: 'mediatriz-bisectriz', nivel: 1, th } };
  }
  function igualar(rng) {
    for (const sigue = tope(); sigue();) {
      const med = rng.entero(0, 1) === 0, x = rng.entero(2, 9), a1 = rng.entero(2, 5), a2 = rng.entero(1, 4), val = rng.entero(8, 20) + Math.max(a1, a2) * x;
      if (a1 === a2 || val > 60) continue;
      const b1 = val - a1 * x, b2 = val - a2 * x, e1 = exL(a1, b1), e2 = exL(a2, b2), [D1, D2] = med ? ['PA', 'PB'] : ['PH', 'PK'];
      const xm = (b2 + b1) / (a1 - a2);
      return { enunciado: [med ? `P está en la mediatriz de AB, con PA = ${e1} y PB = ${e2}, en centímetros.` : `P está en la bisectriz del ángulo O. Sus distancias a los lados son PH = ${e1} y PK = ${e2}, en centímetros.`], pregunta: [`¿Cuánto mide ${D1}?`],
        datos: [med ? D.med : D.bis, D.dist, D.teo], correcta: val, fmt: cm,
        errores: [er('GE-CON30', x, `Hallar x = ${x} está bien; falta reemplazarlo en ${D1}.`), er('GE-CON31', 2 * val, `Igualar está bien; eso suma ${D1} y ${D2}.`),
          er('GE-CON8', val + Math.abs(a1 - a2), 'Igualar está bien; revisa el despeje: las dos expresiones dan lo mismo.'), er('GE-TRI15', Number.isInteger(xm) ? a1 * xm + b1 : NaN, 'Igualar está bien; al pasar un número al otro lado cambia su signo.')],
        solucion: [[med ? 'En la mediatriz, PA = PB.' : 'En la bisectriz, las distancias a los lados son iguales.'], [`${e1} = ${e2}, así x = ${x}.`], [`${D1} = `, v('x', cm(val)), '.']],
        _datos: { tipo: 'igualar', idea: 'mediatriz-bisectriz', nivel: 2, med, a1, b1, a2, b2 } };
    }
  }
  function perimetro(rng) {
    for (const sigue = tope(); sigue();) {
      const c = rng.entero(5, 9), a = rng.entero(8, 13), b = rng.entero(6, 11);
      if (a + b <= c + 1 || a + c <= b + 1 || b + c <= a + 1 || new Set([a, b, c]).size < 3) continue;
      // La mediatriz de AC corta el lado BC solo si C no es el vértice más corto: PC = b ÷ (2 cos C) < a.
      const cosC = (a * a + b * b - c * c) / (2 * a * b);
      if (cosC <= 0 || b / (2 * cosC) >= a) continue;
      return { enunciado: [`En △ABC, AB = ${cm(c)}, BC = ${cm(a)} y AC = ${cm(b)}. La mediatriz de AC corta BC en P.`], pregunta: ['¿Cuánto mide el perímetro de △ABP?'],
        datos: [D.med, D.teo, D.per], correcta: a + c, fmt: cm,
        errores: [er('GE-CON37', a + b + c, 'Sumar lados está bien; AC no es lado de △ABP.'), er('GE-CON38', c + a / 2 + b / 2, 'Ver PA = PC está bien; P no es el punto medio de BC.'),
          er('GE-CON39', a, 'BP + PA = BC está bien; falta sumar AB.'), er('GE-CON40', c + a + b / 2, 'Sumar AB y BC está bien; PA no es la mitad de AC.')],
        solucion: [['P está en la mediatriz de AC: PA = PC. Así BP + PA = BC.'], [`Perímetro = AB + BC = ${c} + ${a} = `, v('x', cm(a + c)), '.']],
        _datos: { tipo: 'perimetro', idea: 'mediatriz-bisectriz', nivel: 3, AB: c, BC: a, AC: b } };
    }
  }
  function perpBis(rng) {
    const c = rng.entero(10, 16), b = rng.entero(5, c - 3), val = c - b;
    return { enunciado: [`En △ABC, AB = ${cm(c)} y AC = ${cm(b)}. Desde C se traza la perpendicular a la bisectriz del ángulo A: la corta en H y llega a AB en D.`], pregunta: ['¿Cuánto mide BD?'],
      datos: [D.bis, D.crit, D.suma, D.seis], correcta: val, fmt: cm,
      errores: [er('GE-CON41', b, `Ver AD = AC está bien; ${cm(b)} es AD, no BD.`), er('GE-CON42', val / 2, 'Restar está bien; H es el punto medio de CD, no de BD.'),
        er('GE-TRI15', c + b, 'Usar AB y AC está bien; BD es lo que le sobra a AB.'), er('GE-CON9', c / 2, 'D no es el punto medio de AB: está a AC de A.')],
      solucion: [['△AHD ≅ △AHC por ALA (mitades iguales, rectos en H, AH de los dos): AD = AC.'], [`BD = ${c} − ${b} = `, v('x', cm(val)), '.']],
      _datos: { tipo: 'perp-bis', idea: 'mediatriz-bisectriz', nivel: 3, AB: c, AC: b } };
  }

  // =============================== Idea 4: base media ===============================
  function mitad(rng) {
    const alReves = rng.entero(0, 1) === 1, bc = 2 * rng.entero(3, 14) + (alReves ? rng.elegir([0, 1]) : 0), mn = bc / 2, val = alReves ? bc : mn, dado = alReves ? mn : bc;
    return { enunciado: [`En △ABC, M y N son los puntos medios de AB y AC, y ${alReves ? `MN = ${cm(mn)}` : `BC = ${cm(bc)}`}.`], pregunta: [`¿Cuánto mide ${alReves ? 'BC' : 'MN'}?`],
      datos: [D.bm, D.tbm], correcta: val, fmt: cm,
      errores: [er('GE-CON10', dado, 'Ver que son paralelos está bien; no miden lo mismo: MN es la mitad.'), er('GE-CON11', alReves ? mn / 2 : bc * 2, 'Usar el doble o la mitad está bien; revisa cuál es cuál.'),
        er('GE-CON21', alReves ? mn * 3 : bc / 3, 'Los puntos medios dan la mitad, no un tercio.'), er('GE-CON44', alReves ? mn + 2 : bc - 2, 'Comparar está bien; la relación es la mitad, no una resta.')],
      solucion: [['MN es la base media: mide la mitad de BC.'], [`${alReves ? 'BC' : 'MN'} = `, v('x', cm(val)), '.']],
      _datos: { tipo: 'mitad', idea: 'base-media', nivel: 1, alReves, dado } };
  }
  function reciproco(rng) {
    const b = rng.entero(6, 15), c = rng.entero(5, 14), pideNC = rng.entero(0, 1) === 1, val = b / 2;
    return { enunciado: [`En △ABC, M es el punto medio de AB, AB = ${cm(c)} y AC = ${cm(b)}. Por M se traza una paralela a BC, que corta AC en N.`], pregunta: [`¿Cuánto mide ${pideNC ? 'NC' : 'AN'}?`],
      datos: [D.bm, D.rbm], correcta: val, fmt: cm,
      errores: [er('GE-CON20', c / 2, 'Ver que N es especial está bien; AN es la mitad de AC, no la de AB.'), er('GE-CON45', b, `${cm(b)} es AC entero; N lo parte en dos.`),
        er('GE-CON21', b / 3, 'Partir AC está bien; la paralela por el punto medio lo parte en mitades.'), er('GE-CON9', b - c / 2, 'La paralela no copia la medida AM: parte AC por la mitad.')],
      solucion: [['La paralela a BC por el punto medio de AB llega al punto medio de AC.'], [`${pideNC ? 'NC' : 'AN'} = ${b} ÷ 2 = `, v('x', cm(val)), '.']],
      _datos: { tipo: 'reciproco', idea: 'base-media', nivel: 1, AB: c, AC: b } };
  }
  function baseX(rng) {
    for (const sigue = tope(); sigue();) {
      const x = rng.entero(3, 12), p = rng.entero(1, 6), q = rng.entero(3, 4), mn = x + p, bc = 2 * mn, s = q * x - bc;
      if (s < 1 || s > 15) continue;
      const xMal = (s + p) / (q - 1);
      return { enunciado: [`En △ABC, M y N son los puntos medios de AB y AC. MN = ${exL(1, p)} y BC = ${exL(q, -s)}, en centímetros.`], pregunta: ['¿Cuánto mide MN?'],
        datos: [D.bm, D.tbm], correcta: mn, fmt: cm,
        errores: [er('GE-CON30', x, `Hallar x = ${x} está bien; falta reemplazarlo en MN.`), er('GE-CON11', bc, `${cm(bc)} es BC; MN es la mitad.`),
          er('GE-CON10', Number.isInteger(xMal) ? xMal + p : NaN, 'Igualar MN con BC olvida que MN es la mitad.'), er('GE-TRI15', mn + 1, 'Plantear 2·MN = BC está bien; revisa el despeje.')],
        solucion: [['BC mide el doble de MN.'], [`${exL(q, -s)} = 2(${exL(1, p)}), así x = ${x}.`], ['MN = ', v('x', cm(mn)), '.']],
        _datos: { tipo: 'con-x-bm', idea: 'base-media', nivel: 2, p, q, s } };
    }
  }
  function medial(rng) {
    for (const sigue = tope(); sigue();) {
      const a = rng.entero(4, 15), b = rng.entero(4, 15), c = rng.entero(4, 15);
      if (new Set([a, b, c]).size < 3 || a + b <= c || a + c <= b || b + c <= a) continue;
      const per = a + b + c, alReves = rng.entero(0, 2) === 2, val = alReves ? 2 * per : per / 2;
      return { enunciado: [alReves ? `Los puntos medios de los lados de △ABC forman un triángulo de lados ${cm(a)}, ${cm(b)} y ${cm(c)}.` : `△ABC tiene lados de ${cm(a)}, ${cm(b)} y ${cm(c)}. M, N y P son los puntos medios de sus lados.`],
        pregunta: [alReves ? '¿Cuánto mide el perímetro de △ABC?' : '¿Cuánto mide el perímetro de △MNP?'], datos: [D.bm, D.tbm, D.per], correcta: val, fmt: cm,
        errores: [er('GE-CON10', per, alReves ? 'Sumar está bien; ese es el perímetro del triángulo chico.' : 'Sumar está bien; ese es el perímetro de ABC.'), er('GE-CON11', alReves ? per / 2 : per / 4, 'Usar la mitad está bien; pero se aplica una sola vez, y en el sentido correcto.'),
          er('GE-CON21', alReves ? 3 * per : per / 3, 'Cada lado del chico es la mitad de un lado del grande, no un tercio.'), er('GE-CON46', alReves ? 4 * per : 2 * per, 'Relacionar los perímetros está bien; revisa cuál es el doble del otro.')],
        solucion: [['Cada lado del triángulo de los puntos medios es una base media: la mitad del lado de enfrente.'], ['Perímetro = ', v('x', cm(val)), '.']],
        _datos: { tipo: 'medial', idea: 'base-media', nivel: 2, lados: [a, b, c], alReves } };
    }
  }
  function dosBases(rng) {
    const bc = 4 * rng.entero(3, 12), val = bc / 4;
    return { enunciado: [`En △ABC, BC = ${cm(bc)}. M y N son los puntos medios de AB y AC; Q y R, los puntos medios de AM y AN.`], pregunta: ['¿Cuánto mide QR?'], datos: [D.bm, D.tbm], correcta: val, fmt: cm,
      errores: [er('GE-CON47', bc / 2, `${cm(bc / 2)} es MN; QR es la base media de △AMN.`), er('GE-CON21', bc / 3, 'Dos mitades seguidas dan la cuarta parte, no un tercio.'),
        er('GE-CON44', bc / 2 - 1, 'Usar MN está bien; QR es su mitad.'), er('GE-CON11', bc / 8, 'Ir de mitad en mitad está bien; son dos mitades, no tres.')],
      solucion: [[`MN = ${bc} ÷ 2 = ${cm(bc / 2)}.`], ['QR es la base media de △AMN: QR = ', v('x', cm(val)), '.']],
      _datos: { tipo: 'dos-bases', idea: 'base-media', nivel: 3, BC: bc } };
  }

  // =============================== Idea 5: mediana relativa a la hipotenusa ===============================
  function mediana(rng) {
    const alReves = rng.entero(0, 1) === 1, ab = 2 * rng.entero(3, 15) + (alReves ? rng.elegir([0, 1]) : 0), cmv = ab / 2, val = alReves ? ab : cmv, dado = alReves ? cmv : ab;
    return { enunciado: [alReves ? `En △ABC, recto en C, M es el punto medio de la hipotenusa AB y CM = ${cm(cmv)}.` : `En △ABC, recto en C, M es el punto medio de la hipotenusa AB = ${cm(ab)}.`], pregunta: [`¿Cuánto mide ${alReves ? 'AB' : 'CM'}?`],
      datos: [D.mediana, D.mh], correcta: val, fmt: cm,
      errores: [er('GE-CON13', dado, 'Ver que CM llega al punto medio está bien; no mide lo que AB.'), er('GE-CON11', alReves ? cmv / 2 : ab * 2, 'Usar la mitad o el doble está bien; revisa cuál es cuál.'),
        er('GE-CON53', alReves ? cmv * 3 : ab / 3, 'Un tercio es de otro tema; con el recto en C, CM es la mitad de AB.'), er('GE-CON44', alReves ? cmv + 2 : ab - 2, 'La relación es la mitad, no una resta.')],
      solucion: [['CM es la mediana relativa a la hipotenusa: mide la mitad de AB.'], [`${alReves ? 'AB' : 'CM'} = `, v('x', cm(val)), '.']],
      _datos: { tipo: 'mediana', idea: 'mediana-hipotenusa', nivel: 1, alReves, dado } };
  }
  function isoAng(rng) {
    for (const sigue = tope(); sigue();) {
      const a = rng.entero(20, 70), conA = rng.entero(0, 1) === 1, pide = rng.elegir(['ACM', 'BCM']);
      if (a === 45) continue;
      const val = pide === 'ACM' ? a : 90 - a, dV = conA ? 'A' : 'B', dVal = conA ? a : 90 - a;
      return { enunciado: [`En △ABC, recto en C, M es el punto medio de la hipotenusa AB, y m∠${dV} = ${dVal}°.`], pregunta: [`¿Cuánto mide el ángulo ${pide}?`], datos: [D.mh, D.iso, D.suma], correcta: val, fmt: gr,
        errores: [er('GE-CON54', 90 - val, `Ver un isósceles está bien; ${pide} copia el ángulo de ${pide[0]}.`), er('GE-CON55', 45, 'CM no es bisectriz: no parte el recto en dos iguales.'),
          er('GE-CON56', 2 * dVal, `${2 * dVal}° es un ángulo en M; se pide uno en C.`), er('GE-CON57', 180 - 2 * val, 'Eso mide el ángulo de M en el isósceles; se pide el de C.'), er('GE-CON36', val / 2, 'La mediana no parte ese ángulo en dos: lo copia entero.')],
        solucion: [[`MC = M${pide[0]}: el isósceles copia el ángulo de ${pide[0]}.`], [`m∠${pide} = `, v('x', gr(val)), '.']],
        _datos: { tipo: 'iso-ang', idea: 'mediana-hipotenusa', nivel: 2, a, conA, pide } };
    }
  }
  function medX(rng) {
    for (const sigue = tope(); sigue();) {
      const x = rng.entero(3, 12), p = rng.entero(1, 6), q = rng.entero(3, 4), mv = x + p, ab = 2 * mv, s = q * x - ab;
      if (s < 1 || s > 15) continue;
      const xMal = (s + p) / (q - 1);
      return { enunciado: [`En △ABC, recto en C, CM es la mediana relativa a la hipotenusa. CM = ${exL(1, p)} y AB = ${exL(q, -s)}, en centímetros.`], pregunta: ['¿Cuánto mide CM?'],
        datos: [D.mediana, D.mh], correcta: mv, fmt: cm,
        errores: [er('GE-CON30', x, `Hallar x = ${x} está bien; falta reemplazarlo en CM.`), er('GE-CON11', ab, `${cm(ab)} es AB; CM es la mitad.`),
          er('GE-CON13', Number.isInteger(xMal) ? xMal + p : NaN, 'Igualar CM con AB olvida que CM es la mitad.'), er('GE-TRI15', mv + 1, 'Plantear 2·CM = AB está bien; revisa el despeje.')],
        solucion: [['AB mide el doble de CM.'], [`${exL(q, -s)} = 2(${exL(1, p)}), así x = ${x}.`], ['CM = ', v('x', cm(mv)), '.']],
        _datos: { tipo: 'med-x', idea: 'mediana-hipotenusa', nivel: 2, p, q, s } };
    }
  }
  function medAltura(rng) {
    const a = rng.entero(15, 40), val = 90 - 2 * a;
    return { enunciado: [`En △ABC, recto en C, m∠A = ${a}°. CM es la mediana relativa a la hipotenusa y CH, la altura.`], pregunta: ['¿Cuánto mide el ángulo MCH?'],
      datos: [D.mh, D.iso, D.suma, D.altura], correcta: val, fmt: gr,
      errores: [er('GE-CON54', a, `${a}° es m∠ACM; MCH es lo que queda entre la mediana y la altura.`), er('GE-CON58', 90 - a, `${90 - a}° es m∠B; falta restarle lo que copia la mediana.`),
        er('GE-CON55', val / 2, 'Restar está bien; no se parte en dos.'), er('GE-CON56', 2 * a, `${2 * a}° es un ángulo en M; se pide uno en C.`)],
      solucion: [[`MC = MA: m∠ACM = ${a}°. En △ACH, m∠ACH = 90° − ${a}° = ${90 - a}°.`], [`m∠MCH = ${90 - a}° − ${a}° = `, v('x', gr(val)), '.']],
      _datos: { tipo: 'med-altura', idea: 'mediana-hipotenusa', nivel: 3, a } };
  }
  function entero(rng) {
    const k = rng.entero(4, 12), val = 2 * k - 1;
    return { enunciado: [`En △ABC, recto en C, la mediana relativa a la hipotenusa mide CM = ${cm(k)}. AC mide un número entero de centímetros.`], pregunta: ['¿Cuál es el mayor valor posible de AC?'],
      datos: [D.mh, D.hip], correcta: val, fmt: cm,
      errores: [er('GE-CON50', 2 * k, `${cm(2 * k)} es AB, la hipotenusa: un cateto es menor, no igual.`), er('GE-CON51', k, `${cm(k)} es CM; el cateto puede ser más largo.`),
        er('GE-CON52', k - 1, 'Usar «menor que» está bien; pero el tope es AB, no CM.'), er('GE-DT15', 3 * k - 1, 'Sumar lados da otro tope; el que manda es la hipotenusa.')],
      solucion: [[`AB = 2 · ${k} = ${cm(2 * k)}. AC es un cateto: menor que AB.`], ['AC = ', v('x', cm(val)), '.']],
      _datos: { tipo: 'entero', idea: 'mediana-hipotenusa', nivel: 3, CM: k } };
  }

  // =============================== Idea 6: notables ===============================
  function n30(rng) {
    const k = rng.entero(2, 15), alReves = rng.entero(0, 1) === 1, val = alReves ? 2 * k : k;
    return { enunciado: [alReves ? `En un triángulo rectángulo de 30° y 60°, el cateto frente a 30° mide ${cm(k)}.` : `En un triángulo rectángulo de 30° y 60°, la hipotenusa mide ${cm(2 * k)}.`],
      pregunta: [alReves ? '¿Cuánto mide la hipotenusa?' : '¿Cuánto mide el cateto frente a 30°?'], datos: [D.n30], correcta: val, fmt: cm,
      errores: [er('GE-CON61', alReves ? k : 2 * k, 'Ese es el lado dado; se pide el otro.'), er('GE-CON11', alReves ? 4 * k : k / 2, 'La relación es el doble o la mitad, una sola vez.'),
        er('GE-CON24', k * Math.sqrt(3), 'Eso es el cateto frente a 60°, k√3; frente a 30° va k.'), er('GE-CON60', alReves ? k + 2 : 2 * k - 2, 'Los lados de un notable no se suman ni se restan: guardan su razón.')],
      solucion: [['Frente a 30° va k; la hipotenusa es 2k.'], [alReves ? 'Hipotenusa = 2k = ' : 'Cateto = 2k ÷ 2 = ', v('x', cm(val)), '.']],
      _datos: { tipo: 'n30', idea: 'notables', nivel: 1, k, alReves } };
  }
  function n37(rng) {
    const k0 = rng.entero(2, 8), cosa = rng.elegir(['cable', 'rampa', 'escalera']), ang = rng.elegir([37, 53]), pide = rng.elegir(['alto', 'piso']);
    // Medidas creíbles (auditoría del 19 nov, M4): una escalera de 5 m o 10 m y una rampa de hasta 20 m; el cable, hasta 40 m.
    const k = cosa === 'escalera' ? 1 + (k0 % 2) : cosa === 'rampa' ? 1 + (k0 % 4) : k0, h = 5 * k;
    const alto = ang === 37 ? 3 * k : 4 * k, piso = ang === 37 ? 4 * k : 3 * k, val = pide === 'alto' ? alto : piso, otro = pide === 'alto' ? piso : alto;
    const sujeto = { cable: 'Un cable tenso va de la punta de un poste al piso', rampa: 'Una rampa recta sube desde el piso', escalera: 'Una escalera está apoyada en una pared' }[cosa];
    const preg = { cable: ['¿Cuánto mide el poste?', '¿A qué distancia del poste llega al piso?'], rampa: ['¿A qué altura llega?', '¿Cuánto avanza por el piso?'], escalera: ['¿A qué altura de la pared llega?', '¿A qué distancia de la pared queda su pie?'] }[cosa][pide === 'alto' ? 0 : 1];
    return { enunciado: [`${sujeto}, mide ${m(h)} y forma ${ang}° con el piso.`], pregunta: [preg],
      datos: [D.n37, D.recto], correcta: val, fmt: m,
      errores: [er('GE-CON63', otro, `${m(otro)} es el otro cateto: frente a 37° va 3k y frente a 53°, 4k.`), er('GE-CON64', h, `${m(h)} es el largo, la hipotenusa.`),
        er('GE-CON14', h / 2, 'La mitad vale frente a 30°, no frente a 37° ni 53°.'), er('GE-CON65', h - otro, 'Los lados no se restan: guardan la razón 3 : 4 : 5.')],
      solucion: [[`5k = ${h}: k = ${k}. Frente a ${pide === 'alto' ? ang : 90 - ang}° va ${val === 3 * k ? '3k' : '4k'}.`], ['Respuesta: ', v('x', m(val)), '.']],
      _datos: { tipo: 'n37', idea: 'notables', nivel: 1, k, ang, pide } };
  }
  function n45(rng) {
    const a = rng.entero(2, 12), deHip = rng.entero(0, 1) === 1;
    // deHip: la hipotenusa mide 2a y se pide el cateto (a√2); si no, el cateto mide a y se pide la hipotenusa (a√2).
    const ok = deHip ? rad(a, 2) : rad(a, 2), dado = deHip ? `la hipotenusa mide ${cm(2 * a)}` : `cada cateto mide ${cm(a)}`;
    const errores = deHip ? [erT('GE-CON14', `${f(a)} cm`, 'La mitad vale frente a 30°; en el de 45°, el cateto es la hipotenusa ÷ √2.'), erT('GE-CON15', `${rad(2 * a, 2)} cm`, 'Multiplicar por √2 da la hipotenusa desde un cateto; aquí se divide.'),
      erT('GE-CON24', `${rad(a, 3)} cm`, 'Con √3 es el de 30° y 60°; el de 45° tiene catetos iguales.'), erT('GE-CON59', `${f(2 * a)} cm`, 'Ese es el dato, la hipotenusa; se pide un cateto.')]
      : [erT('GE-CON59', `${f(a)} cm`, 'Ver los catetos iguales está bien; la hipotenusa es más larga: k√2.'), erT('GE-CON14', `${f(2 * a)} cm`, '2k es la hipotenusa del de 30° y 60°; en el de 45°, k√2.'),
        erT('GE-CON24', `${rad(a, 3)} cm`, 'k√3 es del de 30° y 60°.'), erT('GE-CON15', `${f(a / 2)} cm`, 'Dividir da un lado más corto; la hipotenusa es el mayor.')];
    return { enunciado: [`En un triángulo rectángulo de 45° y 45°, ${dado}.`], pregunta: [deHip ? '¿Cuánto mide cada cateto?' : '¿Cuánto mide la hipotenusa?'], datos: [D.n45, D.raiz2],
      texto: { correcta: { clave: `${ok} cm`, texto: `${ok} cm` }, errores },
      solucion: [[deHip ? `k√2 = ${2 * a}: k = ${2 * a} ÷ √2 = ${rad(a, 2)}.` : `k = ${a}: la hipotenusa es k√2.`], ['Respuesta: ', v('x', `${ok} cm`), '.']],
      _datos: { tipo: 'n45', idea: 'notables', nivel: 2, a, deHip } };
  }
  function iso120(rng) {
    const L = 2 * rng.entero(2, 12);
    return { enunciado: [`En el triángulo ABC, AB = AC = ${cm(L)} y m∠A = 120°.`], pregunta: ['¿Cuánto mide BC?'], datos: [D.iso, D.suma, D.n30, D.isoAlt],
      texto: { correcta: { clave: `${rad(L, 3)} cm`, texto: `${rad(L, 3)} cm` }, errores: [erT('GE-CON70', `${rad(L / 2, 3)} cm`, 'Eso es BH, la mitad de BC.'), erT('GE-CON71', `${f(2 * L)} cm`, 'Sumar AB y AC da más que BC: la desigualdad lo impide.'),
        erT('GE-CON60', `${rad(L, 2)} cm`, 'Con √2 es el de 45°; la altura deja dos de 30° y 60°.'), erT('GE-CON14', `${f(L)} cm`, 'BC no es igual a AB: frente a 120° va el lado mayor.')] },
      solucion: [[`La altura AH deja dos de 30° y 60°, con hipotenusa ${cm(L)}: BH = ${rad(L / 2, 3)} cm.`], ['BC = 2 · BH = ', v('x', `${rad(L, 3)} cm`), '.']],
      _datos: { tipo: 'iso120', idea: 'notables', nivel: 3, L } };
  }
  function altura(rng) {
    const aC = rng.elegir([37, 53]), k = rng.entero(2, 6), h = aC === 37 ? 3 * k : 4 * k, hc = aC === 37 ? 4 * k : 3 * k, val = h + hc;
    return { enunciado: [`En el triángulo ABC, m∠A = 45° y m∠C = ${aC}°. La altura BH mide ${cm(h)}.`], pregunta: ['¿Cuánto mide AC?'], datos: [D.n45, D.n37], correcta: val, fmt: cm,
      errores: [er('GE-CON72', hc, `${cm(hc)} es solo HC; falta AH, que mide lo que BH.`), er('GE-CON64', h + 5 * k, `Eso usa la hipotenusa BC, ${cm(5 * k)}, en vez de HC.`),
        er('GE-CON63', h + (aC === 37 ? 3 * h / 4 : 4 * h / 3), 'Frente a 37° va 3k y frente a 53°, 4k: revisa cuál es BH.'), er('GE-CON73', 2 * h, 'AH = BH está bien; pero HC no mide lo que BH.')],
      solucion: [[`△AHB es de 45°: AH = BH = ${cm(h)}. En △CHB, de 37° y 53°, HC = ${cm(hc)}.`], [`AC = ${h} + ${hc} = `, v('x', cm(val)), '.']],
      _datos: { tipo: 'altura', idea: 'notables', nivel: 3, aC, BH: h } };
  }

  // =============================== Armado ===============================
  const TIPOS = { criterio, cuantos, 'con-x': conX, orden, 'angulo-orden': anguloOrden, cruce, 'iso-de': isoDE, 'iso-med': isoMed, igualar, perimetro, 'perp-bis': perpBis,
    mitad, reciproco, 'con-x-bm': baseX, medial, 'dos-bases': dosBases, mediana, 'iso-ang': isoAng, 'med-x': medX, 'med-altura': medAltura, entero, n30, n37, n45, iso120, altura };
  const IDEAS = {
    criterios: ['criterio', 'cuantos', 'con-x'],
    'partes-correspondientes': ['orden', 'angulo-orden', 'cruce', 'iso-de'],
    'mediatriz-bisectriz': ['iso-med', 'igualar', 'perimetro', 'perp-bis'],
    'base-media': ['mitad', 'reciproco', 'con-x-bm', 'medial', 'dos-bases'],
    'mediana-hipotenusa': ['mediana', 'iso-ang', 'med-x', 'med-altura', 'entero'],
    notables: ['n30', 'n37', 'n45', 'iso120', 'altura'],
  };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8»): uno o dos por idea, las seis ideas.
  const PAPEL = { 'papel-1': 'criterio', 'papel-2': 'orden', 'papel-3': 'iso-med', 'papel-4': 'medial', 'papel-5': 'iso-ang', 'papel-6': 'perimetro', 'papel-7': 'cruce', 'papel-8': 'altura' };
  const PRUEBA = { 'entrada-1': 'orden', 'entrada-2': 'mitad', 'entrada-3': 'mediana', 'salida-1': 'orden', 'salida-2': 'mitad', 'salida-3': 'mediana' };

  function generar(semilla, opciones = {}) {
    const rng = Azar.crear(`${ID}|${semilla}`);
    const fijo = PAPEL[String(semilla)] || PRUEBA[String(semilla)] || opciones.tipo;
    const idea = opciones.idea && IDEAS[opciones.idea] ? opciones.idea : rng.elegir(Object.keys(IDEAS));
    const tipo = fijo || rng.elegir(IDEAS[idea]);
    for (let intento = 0; intento < 200; intento++) {
      const pr = TIPOS[tipo](rng);
      let alternativas, valor;
      if (pr.texto) { alternativas = P.armarTexto({ correcta: pr.texto.correcta, errores: pr.texto.errores, rng }); valor = pr.texto.correcta.clave; }
      else {
        const errores = pr.errores.filter(e => Number.isFinite(e.valor) && e.valor > 0 && P.enEscala(e.valor, pr.correcta, e.id));
        alternativas = P.armar({ correcta: pr.correcta, errores, rng, texto: pr.fmt });
        valor = pr.correcta;
      }
      if (alternativas.length < 4) continue;
      return { id: `${ID}#${semilla}`, variables: { x: { nombre: 'lo que se pide', color: 'f' } },
        enunciado: pr.enunciado, pregunta: pr.pregunta, datos: pr.datos, alternativas, solucion: pr.solucion,
        respuesta: { valor, unidad: '' }, _datos: Object.assign({ valor }, pr._datos) };
    }
    throw new Error(`${ID}: no se pudo generar un problema con 4 alternativas distintas (${tipo})`);
  }

  // TIPOS_POR_IDEA: lo que lee el catálogo para «Practicar por idea» (herramientas/construir-catalogo.js).
  return { id: ID, titulo: 'Congruencia de triángulos', generar, TIPOS: Object.keys(TIPOS), IDEAS, TIPOS_POR_IDEA: IDEAS };
});
