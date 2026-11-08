/*
 * Generador: áreas de regiones poligonales (razones de áreas, triángulos entre paralelas, trapecio y
 * sus diagonales, cuadrado con punto medio, notables de 37° y 53°, equiláteros y alturas por Pitágoras).
 * Formato "predicciones" (docs/arquitectura.md). Funciona en el navegador
 * (window.Generadores['geo-areas-triangulares']) y en Node (require). No usa ningún motor.
 *
 * Todas las respuestas son exactas de la forma q + p·√3 (q y p enteros): «24 m²», «12√3 cm²»,
 * «(8 + 4√3) m²». respuesta.valor es una clave «q|p» con q y p como fracciones n/d.
 *
 * Tipos (campo _datos.tipo) y sus campos de _datos (longitudes en la unidad u, áreas en u²):
 *   misma-altura   sub 'rectangulo-razon': rectángulo ABCD; E en BC con BE : EC = m : n; T = área del
 *                  triángulo ABE → área del resto del rectángulo (el cuadrilátero AECD).
 *                  sub 'bisectriz': triángulo ABC con AB = c, AC = b, área S; la bisectriz del ángulo A
 *                  corta BC en D → área del triángulo ABD.
 *                  sub 'bisectriz-rectangulo': rectángulo ABCD con AB = a, AD = b; la bisectriz del
 *                  ángulo recto DAB corta la diagonal BD en P → área del triángulo ABP.
 *                  sub 'razon-segmentos': triángulo ABC de área S; D en BC con BD : DC = m : n; E punto
 *                  medio de AD → área del triángulo BED.
 *   paralelas      sub 'trapecio-punto': trapecio ABCD con AD ∥ BC, AD = B (base mayor), BC = b, altura h;
 *                  P punto cualquiera de BC; pide 'laterales' (ABP + PCD) o 'central' (APD).
 *                  sub 'diagonales': trapecio ABCD con AD ∥ BC; O = cruce de las diagonales; S1 = área
 *                  de ABD y S2 = área de AOD → área de COD. (B, b, h: el trapecio con que se armó.)
 *   trapecio       diagonales que forman cuatro triángulos; a : b = base menor : base mayor; t tal que
 *                  S1 = t·a² (triángulo sobre la base menor) y S2 = t·b² (sobre la base mayor).
 *                  sub 'total': dados S1 y S2 → área del trapecio. sub 'lateral': dados S1 y S2 → área de
 *                  uno de los triángulos laterales. sub 'desde-total': dados T (área del trapecio) y la
 *                  razón de bases a : b → S1.
 *   punto-medio    cuadrado ABCD de lado l; M punto medio de BC; P = cruce de DM con la diagonal AC;
 *                  pieza ∈ 'DPC', 'APD', 'ABMP' → área de esa pieza.
 *   notables       cuadrado ABCD de lado L = 7k; cuadrado interior EFGH con E en AB, F en BC, G en CD,
 *                  H en DA, y el ángulo FEB = 37° (los cuatro triángulos de las esquinas son iguales);
 *                  pide 'interior' (EFGH), 'esquina' (triángulo EBF) o 'AFG' (triángulo AFG).
 *   equilateros    sub 'estrella': cuadrado de lado l (o inscrito en una circunferencia de radio R, campo
 *                  R; entonces l² = 2R²) con un triángulo equilátero hacia afuera sobre cada lado → área
 *                  de la estrella. sub 'hexagono': hexágono ABCDEF de ángulos de 120° con
 *                  AB = x, BC = L − x − y, CD = y, DE = L − y − z, EF = z, FA = L − z − x (campos L, x, y, z;
 *                  el enunciado da los seis lados) → área del hexágono. sub 'pentagono': igual, y se
 *                  prolongan FA y CB hasta cortarse en Q → área del pentágono QCDEF.
 *                  sub 'isosceles-lados': triángulo isósceles con lados iguales l y 30° entre ellos → área.
 *                  sub 'isosceles-base': lo mismo pero se da la base b → área.
 *   pitagoras      sub 'mediatriz': triángulo ABC recto en B; la mediatriz de AC corta BC en P con PB = m,
 *                  PC = n; tasa = kg de fertilizante por u² (0 si se pide el área) → área (o kg).
 *                  sub 'semicircunferencia': semicírculo de diámetro AB = d; C en el arco con AC = a →
 *                  área del triángulo ACB.
 *   Todos llevan u (unidad de longitud).
 *
 * Errores: GE1 (razón lineal donde va k²), GE6 (área que «se ve» distinta), GE7 (lado inclinado como
 * altura), GE8 (la bisectriz parte el lado por la mitad) del informe
 * docs/investigacion/geometria-ideas-erroneas.md; los GE-tri-* y TR-* son hipótesis nuestras sacadas de
 * las trampas de admisión (olvidar el 1/2, escala lineal, tomar otra región).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  const api = fabrica(nodo ? require('../../nucleo/azar.js') : root.Azar,
                      nodo ? require('../../nucleo/predicciones.js') : root.Predicciones);
  if (nodo) module.exports = api;
  else (root.Generadores = root.Generadores || {})[api.id] = api;
})(typeof self !== 'undefined' ? self : this, function (Azar, P) {
  'use strict';
  const ID = 'geo-areas-triangulares';
  const GE = 'docs/investigacion/geometria-ideas-erroneas.md';
  const v = P.v;
  const e = (id, x, explicacion, respaldo = 'hipotesis', fuente = null) => ({ id, x, explicacion, respaldo, fuente });
  const gp = (id, x, explicacion) => e(id, x, explicacion, 'parcial', GE);
  const R3 = Math.sqrt(3);

  // ---------- Números exactos q + p·√3 ----------
  const X = (q, p = 0) => ({ q, p });
  const valor = x => x.q + x.p * R3;
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  function racional(x) {
    for (let d = 1; d <= 12; d++) { const n = Math.round(x * d); if (Math.abs(n - x * d) < 1e-9) return [n, d]; }
    return null;
  }
  const entero = x => Math.abs(x - Math.round(x)) < 1e-9;
  const nro = n => P.formatear(n, 0);
  function textoX(x, u = '') {
    const q = racional(x.q), p = racional(x.p);
    const D = q[1] * p[1] / mcd(q[1], p[1]);
    const Q = q[0] * D / q[1], N = p[0] * D / p[1];
    const kp = c => (c === 1 ? '' : nro(c)) + '√3';
    let t;
    if (N === 0) t = nro(Q) + (D > 1 ? '/' + D : '');
    else if (Q === 0) t = (N < 0 ? '−' : '') + kp(Math.abs(N)) + (D > 1 ? '/' + D : '');
    else {
      t = Q > 0 ? `${nro(Q)} ${N > 0 ? '+' : '−'} ${kp(Math.abs(N))}` : `${kp(N)} − ${nro(-Q)}`;
      t = D > 1 ? `(${t})/${D}` : (u ? `(${t})` : t);
    }
    return u ? `${t} ${u}` : t;
  }
  const clave = x => { const q = racional(x.q), p = racional(x.p); return `${q[0]}/${q[1]}|${p[0]}/${p[1]}`; };
  const clase = x => (Math.abs(x.q) > 1e-12 ? 1 : 0) + (Math.abs(x.p) > 1e-12 ? 2 : 0);
  const coefEnteros = x => entero(x.q) && entero(x.p);

  function generar(semilla) {
    const rng = Azar.crear(ID + '|' + semilla);
    const tipo = rng.elegir(['misma-altura', 'misma-altura', 'paralelas', 'trapecio', 'punto-medio', 'notables', 'equilateros', 'equilateros', 'pitagoras']);
    const sub = SUBS[tipo] ? rng.elegir(SUBS[tipo]) : null;
    for (let intento = 0; intento < 300; intento++) {
      const pr = CONSTRUIR[tipo](rng, semilla, sub);
      if (pr) return pr;
    }
    throw new Error('No se pudo generar un problema con 4 alternativas distintas');
  }

  // Solo entran errores positivos, con coeficientes enteros y con la misma forma que la correcta
  // (entero, k√3 o q + p√3); hacen falta al menos tres distintos.
  function cerrar(rng, semilla, o) {
    const u = o.unidad;
    const usar = o.errores.filter(er => valor(er.x) > 1e-9 && racional(er.x.q) && racional(er.x.p)
      && coefEnteros(er.x) && clase(er.x) === clase(o.correcta));
    if (new Set(usar.map(er => clave(er.x)).filter(k => k !== clave(o.correcta))).size < 3) return null;
    const alternativas = P.armarTexto({
      correcta: { clave: clave(o.correcta), texto: textoX(o.correcta, u) },
      errores: usar.map(er => ({ id: er.id, clave: clave(er.x), texto: textoX(er.x, u), explicacion: er.explicacion, respaldo: er.respaldo, fuente: er.fuente })),
      rng,
    });
    return {
      id: `${ID}#${semilla}`, variables: o.variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: '',
      alternativas, solucion: o.solucion, respuesta: { valor: clave(o.correcta), unidad: u }, _datos: o.datos,
    };
  }

  // Cuadrado ABCD con A(0, 0), B(l, 0), C(l, l), D(0, l); M = (l, l/2); P en AC: (px, py).
  const piezas = (l, px, py) => {
    const DPC = l * (l - py) / 2, PMC = (l / 2) * (l - px) / 2, APD = l * px / 2;
    return { DPC, PMC, APD, ABMP: l * l - DPC - PMC - APD };
  };

  // ---------- Cálculos puros (los usa papel.json) ----------
  const calc = {
    rectanguloResto: (T, m, n) => X(T * (2 * n + m) / m),
    bisectriz: (S, c, b) => X(S * c / (b + c)),
    bisectrizRectangulo: (a, b) => X(a * a * b / (2 * (a + b))),
    razonSegmentos: (S, m, n) => X(S * m / (2 * (m + n))),
    trapecioLaterales: (b, h) => X(b * h / 2),
    trapecioCentral: (B, h) => X(B * h / 2),
    diagonalesCOD: (S1, S2) => X(S1 - S2),
    trapecioTotal: (S1, S2) => X((Math.sqrt(S1) + Math.sqrt(S2)) ** 2),
    trapecioLateral: (S1, S2) => X(Math.sqrt(S1 * S2)),
    trapecioDesdeTotal: (T, a, b) => X(T * a * a / ((a + b) ** 2)),
    puntoMedio: (l, pieza) => X(piezas(l, 2 * l / 3, 2 * l / 3)[pieza]),
    notables: (L, pide) => { const k = L / 7; return X({ interior: 25, esquina: 6, AFG: 37 / 2 }[pide] * k * k); },
    estrella: l => X(l * l, l * l),
    hexagono: (L, x, y, z) => X(0, (L * L - x * x - y * y - z * z) / 4),
    pentagono: (L, x, y, z) => X(0, (L * L - y * y - z * z) / 4),
    isoscelesLados: l => X(l * l / 4),
    isoscelesBase: b => X(b * b / 2, b * b / 4),
    mediatriz: (m, n) => X((m + n) * Math.sqrt(n * n - m * m) / 2),
    semicircunferencia: (d, a) => X(a * Math.sqrt(d * d - a * a) / 2),
    valor,
  };

  // Rectángulos AB = a, AD = b (a ≠ b, hasta 15) en los que el triángulo ABP sale entero.
  const PARES_BISECTRIZ = [];
  for (let a = 2; a <= 15; a++) for (let b = 2; b <= 15; b++) if (a !== b && entero(a * a * b / (2 * (a + b)))) PARES_BISECTRIZ.push([a, b]);

  // ---------- misma-altura ----------
  function mismaAltura(rng, semilla, sub) {
    const u = rng.elegir(['m', 'cm']), u2 = u + '²';
    let variables, enunciado, pregunta, correcta, errores, solucion, datos;
    if (sub === 'rectangulo-razon') {
      const m = rng.entero(1, 4), n = rng.entero(1, 4), T = m * rng.entero(2, 9);
      if (m === n || mcd(m, n) > 1) return null;
      variables = { T: { nombre: 'área de ABE', color: 'o' }, k: { nombre: 'razón BE : EC', color: 'i' }, A: { nombre: 'área que falta', color: 'd' } };
      enunciado = [rng.elegir(['Se está enchapando el piso rectangular ABCD de una sala.', 'Se está pintando una pared rectangular ABCD.', 'Se está sembrando grass en un terreno rectangular ABCD.']),
        ' El punto E está en el lado BC, con ', v('k', `BE : EC = ${m} : ${n}`), '. Ya se cubrió la parte triangular ABE, que mide ', v('T', `${T} ${u2}`), '.'];
      pregunta = ['¿Cuántos ', u2, ' ', v('A', 'faltan cubrir'), ' (el resto del rectángulo)?'];
      correcta = X(T * (2 * n + m) / m);
      errores = [
        e('GE-tri-razon-al-resto', X(T * n / m), `Repartiste las áreas en la razón ${m} : ${n}, como si el resto fuera un triángulo con la misma altura que ABE. El resto es un cuadrilátero: primero halla el rectángulo entero.`),
        e('GE-tri-total', X(2 * T * (m + n) / m), `Ese es el área del rectángulo entero. Falta restar lo que ya se cubrió.`),
        gp('GE6-mitades', X(T), `Supusiste que AE parte el rectángulo en dos partes iguales. Solo pasaría si E fuera el vértice C; aquí BE es ${m}/${m + n} de BC.`),
        e('GE-tri-solo-ACD', X(T * (m + n) / m), `Contaste solo el triángulo ACD, la mitad del rectángulo. Lo que falta también incluye el triángulo AEC.`),
      ];
      solucion = [
        ['Área de ABE = AB·BE/2 y BE = ', v('k', `${m}/${m + n}`), ' de BC: ABE = (', v('k', `${m}`), `/${2 * (m + n)})·(AB·BC).`],
        ['Rectángulo = ', v('T', `${T}`), ` · ${2 * (m + n)}/${m} = ${2 * T * (m + n) / m} ${u2}.`],
        [v('A', 'Falta'), ` = ${2 * T * (m + n) / m} − ${T} = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'misma-altura', sub, u, m, n, T };
    } else if (sub === 'bisectriz') {
      const [p, q] = rng.elegir([[2, 3], [3, 4], [3, 5], [2, 5], [4, 5], [5, 7], [1, 2]]);
      const s = rng.entero(2, 4), c = p * s, b = q * s;
      const j = rng.entero(1, Math.max(1, Math.floor(b * c / 2 / (p + q)))), S = (p + q) * j;
      if (S > b * c / 2) return null;
      const alReves = rng.moneda();
      const [AB, AC] = alReves ? [b, c] : [c, b];
      variables = { c: { nombre: 'AB', color: 'o' }, b: { nombre: 'AC', color: 'i' }, S: { nombre: 'área de ABC', color: 'h' }, A: { nombre: 'área de ABD', color: 'd' } };
      enunciado = [rng.elegir(['Un terreno triangular ABC', 'Un triángulo ABC', 'Una plancha de triplay triangular ABC']), ' tiene ', v('c', `AB = ${AB} ${u}`), ', ', v('b', `AC = ${AC} ${u}`),
        ' y un área de ', v('S', `${S} ${u2}`), '. Un corte recto sale de A, divide el ángulo BAC en dos ángulos iguales y llega al lado BC en el punto D.'];
      pregunta = ['¿Cuál es el ', v('A', 'área del triángulo ABD'), '?'];
      correcta = X(S * AB / (AB + AC));
      errores = [
        gp('GE8-bisectriz-mitad', X(S / 2), `Supusiste que la bisectriz parte BC por la mitad. Eso solo pasa si AB = AC; la bisectriz divide BC en la razón AB : AC = ${AB} : ${AC}.`),
        e('GE-tri-razon-invertida', X(S * AC / (AB + AC)), `Cambiaste la razón: esa es el área de ADC. El lado BD está junto a AB, así que BD : DC = AB : AC.`),
        e('GE-tri-razon-parte-parte', X(S * AB / AC), `Usaste AB/AC como fracción del total. AB : AC compara las dos partes entre sí; la parte ABD es ${AB}/(${AB} + ${AC}) del total.`),
        e('GE-tri-diferencia', X(S * Math.abs(AC - AB) / (AB + AC)), `Esa es la diferencia entre las dos partes, ADC − ABD, no el área de ABD.`),
      ];
      solucion = [
        ['Teorema de la bisectriz: BD : DC = ', v('c', 'AB'), ' : ', v('b', 'AC'), ` = ${AB} : ${AC}.`],
        ['ABD y ADC tienen la misma altura desde A, así que sus áreas están en la misma razón que BD y DC.'],
        [v('A', 'ABD'), ' = ', v('S', `${S}`), `·${AB}/${AB + AC} = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'misma-altura', sub, u, c: AB, b: AC, S };
    } else if (sub === 'bisectriz-rectangulo') {
      const [a, b] = rng.elegir(PARES_BISECTRIZ);
      variables = { a: { nombre: 'AB', color: 'o' }, b: { nombre: 'AD', color: 'i' }, A: { nombre: 'área de ABP', color: 'd' } };
      enunciado = [rng.elegir(['Un jardín rectangular ABCD', 'Un rectángulo ABCD', 'Una mesa rectangular ABCD']), ' tiene ', v('a', `AB = ${a} ${u}`), ' y ', v('b', `AD = ${b} ${u}`),
        '. Se traza la diagonal BD y la bisectriz del ángulo recto DAB, que corta a la diagonal BD en P.'];
      pregunta = ['¿Cuál es el ', v('A', 'área del triángulo ABP'), '?'];
      correcta = X(a * a * b / (2 * (a + b)));
      errores = [
        gp('GE8-bisectriz-mitad', X(a * b / 4), `Supusiste que P es el punto medio de BD. La bisectriz divide BD en la razón AB : AD = ${a} : ${b}, no por la mitad.`),
        e('GE-tri-razon-invertida', X(a * b * b / (2 * (a + b))), `Cambiaste la razón: esa es el área de APD. BP está junto a AB, así que BP : PD = AB : AD.`),
        e('GE-tri-sin-mitad', X(a * a * b / (a + b)), `Usaste AB·AD como área del triángulo ABD, sin el 1/2. ABD es la mitad del rectángulo.`),
        e('GE-tri-bisectriz-al-lado', X(Math.min(a, b) ** 2 / 2), `Ese es el triángulo que forma la bisectriz al llegar al lado del rectángulo. P está donde la bisectriz corta a la diagonal BD, antes de llegar al lado.`),
      ];
      solucion = [
        ['En el triángulo ABD, AP es bisectriz del ángulo A: BP : PD = ', v('a', `${a}`), ' : ', v('b', `${b}`), '.'],
        [`Área de ABD = ${a}·${b}/2 = ${a * b / 2}. ABP y APD tienen la misma altura desde A.`],
        [v('A', 'ABP'), ` = ${a * b / 2}·${a}/${a + b} = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'misma-altura', sub, u, a, b };
    } else {
      const m = rng.entero(1, 5), n = rng.entero(1, 5);
      if (m === n || mcd(m, n) > 1) return null;
      const S = 2 * (m + n) * rng.entero(1, 6);
      variables = { S: { nombre: 'área de ABC', color: 'o' }, k: { nombre: 'razón BD : DC', color: 'i' }, A: { nombre: 'área de BED', color: 'd' } };
      enunciado = [rng.elegir(['Un triángulo ABC', 'Un banderín triangular ABC', 'Una parcela triangular ABC']), ' tiene un área de ', v('S', `${S} ${u2}`),
        '. El punto D está en el lado BC con ', v('k', `BD : DC = ${m} : ${n}`), ', y E es el punto medio del segmento AD.'];
      pregunta = ['¿Cuál es el ', v('A', 'área del triángulo BED'), '?'];
      correcta = X(S * m / (2 * (m + n)));
      errores = [
        e('GE-tri-sin-mediana', X(S * m / (m + n)), `Esa es el área de ABD. Falta un paso: E es el punto medio de AD, y BE parte a ABD en dos triángulos de igual área.`),
        e('GE-tri-razon-invertida', X(S * n / (2 * (m + n))), `Usaste la parte de DC. El triángulo BED está sobre BD, que es ${m}/${m + n} de BC.`),
        e('GE-tri-punto-medio', X(S / 4), `Supusiste que D es el punto medio de BC. D divide BC en la razón ${m} : ${n}.`),
        e('GE-tri-cuarto', X(S * m / (4 * (m + n))), `Dividiste entre 2 dos veces. Solo la mediana BE parte a ABD por la mitad.`),
      ];
      solucion = [
        ['ABD y ADC tienen la misma altura desde A: sus áreas están como BD : DC = ', v('k', `${m} : ${n}`), '.'],
        ['ABD = ', v('S', `${S}`), `·${m}/${m + n} = ${S * m / (m + n)} ${u2}.`],
        ['BE es mediana del triángulo ABD (E es punto medio de AD): ', v('A', 'BED'), ` = ${S * m / (m + n)}/2 = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'misma-altura', sub, u, S, m, n };
    }
    return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad: u2, datos });
  }

  // ---------- paralelas ----------
  function paralelas(rng, semilla, sub) {
    const u = rng.elegir(['m', 'dm']), u2 = u + '²';
    let variables, enunciado, pregunta, correcta, errores, solucion, datos;
    const B = rng.entero(6, 20), b = rng.entero(2, B - 2), h = rng.entero(2, 12);
    if (sub === 'trapecio-punto') {
      const pide = rng.elegir(['laterales', 'central']);
      if (!entero(b * h / 2) || !entero(B * h / 2) || !entero((B + b) * h / 4)) return null;
      variables = { B: { nombre: 'base mayor AD', color: 'o' }, b: { nombre: 'base menor BC', color: 'i' }, h: { nombre: 'altura', color: 'h' }, A: { nombre: 'área pedida', color: 'd' } };
      enunciado = [rng.elegir(['Un terreno tiene forma de trapecio ABCD', 'Se tiene un trapecio ABCD']), ' con AD paralelo a BC, ', v('B', `AD = ${B} ${u}`), ', ', v('b', `BC = ${b} ${u}`),
        ' y una distancia entre AD y BC (altura) de ', v('h', `${h} ${u}`), '. Desde un punto P cualquiera del lado BC se trazan los segmentos PA y PD, que dividen el trapecio en tres triángulos: ABP, APD y PCD. No se sabe dónde está P.'];
      pregunta = pide === 'laterales'
        ? ['¿Cuánto suman las ', v('A', 'áreas de los triángulos ABP y PCD'), '?']
        : ['¿Cuál es el ', v('A', 'área del triángulo APD'), '?'];
      const lat = X(b * h / 2), cen = X(B * h / 2), tot = X((B + b) * h / 2);
      correcta = pide === 'laterales' ? lat : cen;
      const otra = pide === 'laterales' ? cen : lat;
      errores = [
        e('GE-tri-otra-region', otra, pide === 'laterales' ? `Esa es el área de APD, el triángulo del centro. Se piden los dos de los costados.` : `Esa es la suma de ABP y PCD, los triángulos de los costados. Se pide el del centro.`),
        e('GE-tri-todo', tot, `Esa es el área del trapecio entero.`),
        e('GE-tri-sin-mitad', X(pide === 'laterales' ? b * h : B * h), `Olvidaste el 1/2 del área del triángulo: base por altura entre 2.`),
        gp('GE6-depende-de-P', X((B + b) * h / 4), `Supusiste que el triángulo es la mitad del trapecio, como si P estuviera en un lugar especial. Con P en cualquier punto de BC, la altura de los triángulos es siempre la del trapecio.`),
        e('GE-tri-resta-bases', X((B - b) * h / 2), `Restaste las bases. Los triángulos ABP y PCD tienen bases BP y PC sobre BC, que juntas suman BC.`),
      ];
      solucion = pide === 'laterales' ? [
        ['ABP tiene base BP y PCD tiene base PC, las dos sobre BC; su altura es la distancia de BC a AD, ', v('h', `${h}`), '.'],
        ['Suma = BP·h/2 + PC·h/2 = (BP + PC)·h/2 = ', v('b', `${b}`), '·', v('h', `${h}`), '/2.'],
        [v('A', 'Área'), ' = ', v('A', textoX(correcta, u2)), ', sin importar dónde esté P.'],
      ] : [
        ['APD tiene base AD = ', v('B', `${B}`), ' y su vértice P está sobre BC, paralela a AD.'],
        ['Su altura es la distancia entre las paralelas, ', v('h', `${h}`), ', esté donde esté P.'],
        [v('A', 'APD'), ` = ${B}·${h}/2 = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'paralelas', sub, u, B, b, h, pide };
    } else {
      const ABD = B * h / 2, AOD = ABD * B / (B + b);
      if (!entero(ABD) || !entero(AOD)) return null;
      const S1 = ABD, S2 = AOD;
      variables = { S1: { nombre: 'área de ABD', color: 'o' }, S2: { nombre: 'área de AOD', color: 'i' }, A: { nombre: 'área de COD', color: 'd' } };
      enunciado = [rng.elegir(['Un terreno con forma de trapecio ABCD', 'Un trapecio ABCD']), ', con AD paralelo a BC, se divide con sus dos diagonales AC y BD, que se cortan en O. El triángulo ABD mide ',
        v('S1', `${S1} ${u2}`), ' y el triángulo AOD mide ', v('S2', `${S2} ${u2}`), '.'];
      pregunta = ['¿Cuál es el ', v('A', 'área del triángulo COD'), '?'];
      correcta = X(S1 - S2);
      errores = [
        gp('GE6-se-ve', X(S2), `Igualaste COD con AOD. Los que tienen igual área son AOB y COD, los dos triángulos de los costados.`),
        e('GE-tri-todo', X(S1), `Ese es el área de ABD entero. COD es solo una parte de ACD.`),
        e('GE-tri-suma', X(S1 + S2), `Sumaste las dos áreas. ABD ya contiene a AOD: la parte que sobra es AOB.`),
        e('GE-tri-mitad', X((S1 - S2) / 2), `Dividiste entre 2 al final. AOB y COD son iguales, y AOB = ABD − AOD completo.`),
      ];
      solucion = [
        ['ABD y ACD tienen la misma base AD y su tercer vértice sobre BC, paralela a AD: tienen la misma altura y la misma área.'],
        ['Si a los dos se les quita AOD, queda AOB = COD.'],
        [v('A', 'COD'), ' = AOB = ', v('S1', `${S1}`), ' − ', v('S2', `${S2}`), ' = ', v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'paralelas', sub, u, S1, S2, B, b, h };
    }
    return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad: u2, datos });
  }

  // ---------- trapecio y sus diagonales ----------
  function trapecio(rng, semilla, sub) {
    const u = rng.elegir(['m', 'cm']), u2 = u + '²';
    const [a, b] = rng.elegir([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5]]);
    const t = rng.entero(1, 4), S1 = t * a * a, S2 = t * b * b, L = t * a * b, T = t * (a + b) ** 2;
    const base = 'Las diagonales de un trapecio ABCD (con BC paralelo a AD y BC < AD) se cortan en O y lo dividen en cuatro triángulos: BOC sobre la base menor, AOD sobre la base mayor y los laterales AOB y COD.';
    const ctx = rng.elegir(['', 'Un terreno se reparte así entre cuatro hermanos. ']);
    let variables, enunciado, pregunta, correcta, errores, solucion, datos;
    if (sub !== 'desde-total') {
      variables = { S1: { nombre: 'área de BOC', color: 'o' }, S2: { nombre: 'área de AOD', color: 'i' }, A: { nombre: 'área pedida', color: 'd' } };
      enunciado = [base, ' ', ctx, 'El triángulo BOC mide ', v('S1', `${S1} ${u2}`), ' y el triángulo AOD mide ', v('S2', `${S2} ${u2}`), '.'];
      if (sub === 'total') {
        pregunta = ['¿Cuál es el ', v('A', 'área del trapecio'), '?'];
        correcta = X(T);
        errores = [
          e('GE-tri-sin-laterales', X(S1 + S2), `Sumaste solo BOC y AOD. Faltan los dos triángulos laterales, AOB y COD.`),
          e('GE-tri-lateral-promedio', X(2 * (S1 + S2)), `Tomaste cada lateral como el promedio de BOC y AOD. Cada lateral es la media geométrica: √(${S1}·${S2}) = ${L}.`),
          e('GE-tri-una-lateral', X(S1 + S2 + L), `Contaste un solo triángulo lateral. Son dos, AOB y COD, y miden lo mismo.`),
          e('GE-tri-suma-raices', X(a * Math.sqrt(t) + b * Math.sqrt(t)), `Sumaste las raíces y no elevaste al cuadrado: el área total es (√${S1} + √${S2})².`),
        ];
        solucion = [
          ['BOC y AOD son semejantes (BC ∥ AD). Los laterales AOB y COD miden lo mismo, y cada uno es √(BOC·AOD).'],
          ['Cada lateral = √(', v('S1', `${S1}`), '·', v('S2', `${S2}`), `) = ${L} ${u2}.`],
          [v('A', 'Trapecio'), ` = ${S1} + ${S2} + 2·${L} = (√${S1} + √${S2})² = `, v('A', textoX(correcta, u2)), '.'],
        ];
      } else {
        pregunta = ['¿Cuál es el ', v('A', 'área del triángulo AOB'), '?'];
        correcta = X(L);
        errores = [
          e('GE-tri-lateral-promedio', X((S1 + S2) / 2), `Usaste el promedio de BOC y AOD. El lateral es la media geométrica, √(BOC·AOD).`),
          e('GE-tri-diferencia', X(S2 - S1), `Restaste las áreas. AOB comparte con BOC la altura desde B, y con AOD la altura desde A: su área es √(BOC·AOD).`),
          e('GE-tri-dos-laterales', X(2 * L), `Esa es la suma de los dos laterales, AOB + COD. Se pide uno solo.`),
          e('GE-tri-suma', X(S1 + S2), `Sumaste BOC y AOD. Ese no es un triángulo del trapecio.`),
        ];
        solucion = [
          ['BOC y AOB tienen la misma altura desde B: AOB/BOC = AO/OC. AOD y COD tienen la misma altura desde D: AOD/COD = AO/OC.'],
          ['Como COD = AOB, queda AOB² = BOC·AOD = ', v('S1', `${S1}`), '·', v('S2', `${S2}`), ` = ${S1 * S2}.`],
          [v('A', 'AOB'), ` = √${S1 * S2} = `, v('A', textoX(correcta, u2)), '.'],
        ];
      }
      datos = { tipo: 'trapecio', sub, u, S1, S2 };
    } else {
      variables = { T: { nombre: 'área del trapecio', color: 'o' }, k: { nombre: 'razón de bases', color: 'i' }, A: { nombre: 'área de BOC', color: 'd' } };
      enunciado = [base, ' ', ctx, 'El trapecio mide ', v('T', `${T} ${u2}`), ' y sus bases están en la razón ', v('k', `BC : AD = ${a} : ${b}`), '.'];
      pregunta = ['¿Cuál es el ', v('A', 'área del triángulo BOC'), ' (el de la base menor)?'];
      correcta = X(S1);
      errores = [
        gp('GE1-escala-lineal', X(T * a / (a + b)), `Usaste la razón lineal ${a}/(${a} + ${b}). En triángulos semejantes las áreas van con el cuadrado de la razón: las cuatro partes son ${a}², ${a}·${b}, ${a}·${b} y ${b}² veces lo mismo.`),
        e('GE-tri-sin-laterales', X(T * a * a / (a * a + b * b)), `Repartiste el trapecio solo entre BOC y AOD. Los laterales también ocupan área: ${a}·${b} partes cada uno.`),
        e('GE-tri-otro-triangulo', X(L), `Ese es el área de un triángulo lateral (AOB o COD), no la de BOC.`),
        e('GE-tri-base-mayor', X(S2), `Ese es el área de AOD, el triángulo de la base mayor.`),
      ];
      solucion = [
        ['BOC y AOD son semejantes con razón ', v('k', `${a} : ${b}`), `; si BOC = ${a}²·s, entonces AOD = ${b}²·s y cada lateral = ${a}·${b}·s.`],
        [`Trapecio = (${a * a} + ${b * b} + 2·${a * b})·s = ${(a + b) ** 2}·s = `, v('T', `${T}`), `, así s = ${t}.`],
        [v('A', 'BOC'), ` = ${a * a}·${t} = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'trapecio', sub, u, T, a, b };
    }
    return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad: u2, datos });
  }

  // ---------- punto-medio en el cuadrado ----------
  const PIEZAS = { DPC: 'del triángulo DPC', PMC: 'del triángulo PMC', APD: 'del triángulo APD', ABMP: 'del cuadrilátero ABMP' };
  function puntoMedio(rng, semilla) {
    const l = rng.elegir([6, 12, 18, 24]);
    const pieza = rng.elegir(['DPC', 'APD', 'APD', 'ABMP', 'ABMP']);
    const u = rng.elegir(['cm', 'dm']), u2 = u + '²';
    const ok = piezas(l, 2 * l / 3, 2 * l / 3), centro = piezas(l, l / 2, l / 2), inv = piezas(l, l / 3, l / 3);
    const variables = { l: { nombre: 'lado', color: 'o' }, A: { nombre: 'área de la pieza', color: 'd' } };
    const enunciado = [rng.elegir(['Un rompecabezas cuadrado ABCD', 'Una loseta cuadrada ABCD', 'Un cuadrado ABCD']), ' de lado ', v('l', `${l} ${u}`),
      ' se corta por la diagonal AC y por el segmento DM, donde M es el punto medio del lado BC. Los dos cortes se cruzan en P, y quedan cuatro piezas: los triángulos APD, DPC y PMC y el cuadrilátero ABMP.'];
    const pregunta = ['¿Cuál es el ', v('A', `área ${PIEZAS[pieza]}`), '?'];
    const correcta = X(ok[pieza]);
    const errores = [
      e('GE-tri-punto-centro', X(centro[pieza]), `Supusiste que P es el centro del cuadrado. P está sobre AC pero más cerca de C: los triángulos PMC y PAD son semejantes con razón MC : AD = 1 : 2, así que CP = AC/3.`),
      e('GE-tri-razon-invertida', X(inv[pieza]), `Pusiste P a un tercio de AC desde A. La razón 1 : 2 se cuenta desde C: CP : PA = MC : AD = 1 : 2.`),
      e('GE-tri-sin-mitad', X(2 * ok[pieza]), `Olvidaste el 1/2 en el área de un triángulo.`),
      ...(pieza === 'DPC' ? [e('GE-tri-otra-pieza', X(ok.PMC), `Esa es el área de PMC. DPC tiene base DC = ${l} y altura igual a la distancia de P a DC.`)] : []),
      ...(pieza === 'APD' ? [gp('GE1-escala-lineal', X(2 * ok.PMC), `PAD y PMC son semejantes con razón 2 : 1, pero sus áreas están en razón 4 : 1, no 2 : 1.`)] : []),
      ...(pieza === 'ABMP' ? [e('GE-tri-otra-region', X(l * l / 4 + ok.PMC), `Ese valor no descuenta bien las piezas: el cuadrilátero es el cuadrado menos APD, DPC y PMC.`)] : []),
    ];
    const solucion = [
      ['Los triángulos PMC y PAD son semejantes (MC ∥ AD) con razón MC : AD = 1 : 2, así que P está a 1/3 de AC desde C y a 2/3 desde A.'],
      [`La altura de P sobre AD es 2/3 de ${l} = ${2 * l / 3}, y sobre DC es ${l / 3}.`],
      [`APD = ${l}·${2 * l / 3}/2 = ${ok.APD}; DPC = ${l}·${l / 3}/2 = ${ok.DPC}; PMC = ${l / 2}·${l / 3}/2 = ${ok.PMC}; ABMP = ${l * l} − ${ok.APD} − ${ok.DPC} − ${ok.PMC} = ${ok.ABMP}.`],
      [v('A', `Área ${PIEZAS[pieza]}`), ' = ', v('A', textoX(correcta, u2)), '.'],
    ];
    return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad: u2, datos: { tipo: 'punto-medio', u, l, pieza } });
  }

  // ---------- notables 37° y 53° en el cuadrado ----------
  function notables(rng, semilla) {
    const pide = rng.elegir(['interior', 'interior', 'esquina', 'AFG']);
    const k = pide === 'AFG' ? 2 * rng.entero(1, 3) : rng.entero(1, 5), L = 7 * k;
    const u = rng.elegir(['cm', 'dm']), u2 = u + '²';
    const variables = { L: { nombre: 'lado de la loseta', color: 'o' }, t: { nombre: 'ángulo de 37°', color: 'h' }, A: { nombre: 'área pedida', color: 'd' } };
    const enunciado = [rng.elegir(['Una loseta cuadrada ABCD', 'Un pañuelo cuadrado ABCD', 'Un cuadrado ABCD']), ' de lado ', v('L', `${L} ${u}`),
      ' tiene dibujado un cuadrado EFGH con E en AB, F en BC, G en CD y H en DA. El lado EF forma con EB un ángulo ', v('t', 'FEB de 37°'),
      ', y los cuatro triángulos de las esquinas (EBF, FCG, GDH y HAE) son iguales. Usa el triángulo notable de 37° y 53° (lados 3, 4 y 5).'];
    const nombre = { interior: 'área del cuadrado EFGH', esquina: 'área del triángulo EBF', AFG: 'área del triángulo AFG' }[pide];
    const pregunta = ['¿Cuál es el ', v('A', nombre), '?'];
    const kk = k * k;
    const correcta = X({ interior: 25, esquina: 6, AFG: 37 / 2 }[pide] * kk);
    let errores;
    if (pide === 'interior') errores = [
      e('GE-tri-puntos-medios', X(L * L / 2), `Supusiste que E, F, G y H son puntos medios. Con el ángulo de 37°, cada lado de la loseta queda partido en 3 y 4 partes, no en dos mitades.`),
      e('GE-tri-complemento', X(24 * kk), `Esa es el área de los cuatro triángulos de las esquinas, no la del cuadrado EFGH.`),
      e('GE-tri-sin-mitad', X(kk), `Restaste los cuatro triángulos sin el 1/2: ${L}² − 4·(${3 * k}·${4 * k}).`),
      e('TR-cateto-por-hipotenusa', X(16 * kk), `Tomaste EB = ${4 * k} como lado del cuadrado EFGH. EB es un cateto; el lado EF es la hipotenusa, ${5 * k}.`),
    ];
    else if (pide === 'esquina') errores = [
      e('GE-tri-sin-mitad', X(12 * kk), `Multiplicaste los catetos y no dividiste entre 2.`),
      gp('GE7-lado-como-altura', X(10 * kk), `Usaste la hipotenusa EF = ${5 * k} como base y un cateto como altura. En el triángulo rectángulo, base y altura son los catetos.`),
      e('GE-tri-las-cuatro', X(24 * kk), `Esa es la suma de los cuatro triángulos de las esquinas.`),
      e('TR-cateto-por-hipotenusa', X(8 * kk), `Tomaste EB = ${4 * k} como hipotenusa. En EBF, EB es el cateto junto al ángulo de 37°: EB = 4k y BF = 3k con L = 7k.`),
    ];
    else errores = [
      e('GE-tri-mitad-cuadrado', X(25 * kk / 2), `Supusiste que AFG es la mitad del cuadrado EFGH. A no es un vértice de EFGH.`),
      e('GE-tri-sin-mitad', X(37 * kk), `Olvidaste dividir entre 2.`),
      e('GE-tri-mitad-loseta', X(49 * kk / 2), `Esa es la mitad de la loseta, el triángulo ACD o ABC. AFG no tiene sus vértices en C.`),
      e('GE-tri-falta-un-triangulo', X(49 * kk - 21 * kk / 2 - 14 * kk), `Olvidaste restar el triángulo FCG. Alrededor de AFG hay tres triángulos: ABF, FCG y GDA.`),
    ];
    const solucion = [
      ['En EBF, el ángulo en E es ', v('t', '37°'), ': si EF = 5k, entonces EB = 4k y BF = 3k. Por los triángulos iguales, AE = BF = 3k.'],
      ['El lado de la loseta es AE + EB = 7k = ', v('L', `${L}`), `, así k = ${k}: EB = ${4 * k}, BF = ${3 * k} y EF = ${5 * k}.`],
      ...(pide === 'interior' ? [[v('A', 'EFGH'), ` = ${5 * k}² = `, v('A', textoX(correcta, u2)), '.']]
        : pide === 'esquina' ? [[v('A', 'EBF'), ` = ${4 * k}·${3 * k}/2 = `, v('A', textoX(correcta, u2)), '.']]
        : [[`F está a ${3 * k} de B y G a ${4 * k} de D. AFG = loseta − ABF − FCG − GDA = ${L * L} − ${7 * k * 3 * k / 2} − ${3 * k * 4 * k / 2} − ${4 * k * 7 * k / 2}.`],
          [v('A', 'AFG'), ' = ', v('A', textoX(correcta, u2)), '.']]),
    ];
    return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad: u2, datos: { tipo: 'notables', u, L, pide } });
  }

  // ---------- equilateros e isósceles de 30° ----------
  function equilateros(rng, semilla, sub) {
    const u = rng.elegir(['cm', 'm']), u2 = u + '²';
    let variables, enunciado, pregunta, correcta, errores, solucion, datos;
    if (sub === 'estrella') {
      const conRadio = rng.moneda();
      const R = 2 * rng.entero(1, 5), l = 2 * rng.entero(1, 6);
      const l2 = conRadio ? 2 * R * R : l * l;
      variables = { l: { nombre: conRadio ? 'radio' : 'lado del cuadrado', color: 'o' }, A: { nombre: 'área de la estrella', color: 'd' } };
      enunciado = conRadio
        ? ['En una circunferencia de radio ', v('l', `${R} ${u}`), ' se inscribe un cuadrado, y sobre cada lado del cuadrado se dibuja, hacia afuera, un triángulo equilátero. El cuadrado y los cuatro triángulos forman una estrella.']
        : [rng.elegir(['Un adorno de papel', 'Un logo', 'Una estrella']), ' se arma con un cuadrado de lado ', v('l', `${l} ${u}`), ' y un triángulo equilátero pegado hacia afuera sobre cada uno de sus cuatro lados.'];
      pregunta = ['¿Cuál es el ', v('A', 'área de la estrella'), '?'];
      correcta = X(l2, l2);
      errores = [
        e('GE-tri-un-triangulo', X(l2, l2 / 4), `Sumaste un solo triángulo equilátero. Hay uno sobre cada lado: son cuatro.`),
        e('GE-tri-equilatero-sin-mitad', X(l2, 2 * l2), `Usaste l²√3/2 para cada triángulo: olvidaste el 1/2 de base por altura. El equilátero mide l²√3/4.`),
        e('GE-tri-dos-triangulos', X(l2, l2 / 2), `Sumaste solo dos triángulos. La estrella tiene uno sobre cada lado del cuadrado.`),
        ...(conRadio ? [
          e('GE-tri-radio-como-lado', X(R * R, R * R), `Usaste el radio como lado del cuadrado. El lado es la cuerda entre dos vértices: l = R√2, así l² = 2R² = ${2 * R * R}.`),
          e('GE-tri-diametro-como-lado', X(4 * R * R, 4 * R * R), `Usaste el diámetro como lado. El diámetro es la diagonal del cuadrado inscrito: l = R√2.`),
        ] : []),
      ];
      solucion = [
        ...(conRadio ? [['La diagonal del cuadrado es el diámetro, 2·', v('l', `${R}`), `; el lado es l = ${R}√2 y l² = ${l2}.`]] : []),
        [`Cuadrado: l² = ${l2}. Cada equilátero: l²√3/4 = ${l2 / 4}√3.`],
        [v('A', 'Estrella'), ` = ${l2} + 4·${l2 / 4}√3 = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'equilateros', sub, u, ...(conRadio ? { R } : { l }) };
    } else if (sub === 'hexagono' || sub === 'pentagono') {
      const L = 2 * rng.entero(6, 12), x = 2 * rng.entero(1, 4), y = 2 * rng.entero(1, 4), z = 2 * rng.entero(1, 4);
      if (x + y >= L || y + z >= L || z + x >= L) return null;
      const lados = { AB: x, BC: L - x - y, CD: y, DE: L - y - z, EF: z, FA: L - z - x };
      variables = { x: { nombre: 'AB', color: 'o' }, m: { nombre: 'BC', color: 'i' }, y: { nombre: 'CD', color: 'h' }, A: { nombre: 'área pedida', color: 'd' } };
      enunciado = [rng.elegir(['Una mesa', 'Una baldosa', 'Una placa']), ' tiene forma de hexágono ABCDEF con todos sus ángulos interiores de 120°. Sus lados miden ',
        v('x', `AB = ${x}`), ', ', v('m', `BC = ${lados.BC}`), ', ', v('y', `CD = ${y}`), `, DE = ${lados.DE}, EF = ${z} y FA = ${lados.FA}, en ${u}.`,
        ...(sub === 'pentagono' ? [' Se prolongan los lados FA y CB hasta que se cortan en el punto Q.'] : [])];
      pregunta = sub === 'hexagono' ? ['¿Cuál es el ', v('A', 'área del hexágono'), '?'] : ['¿Cuál es el ', v('A', 'área del pentágono QCDEF'), '?'];
      correcta = sub === 'hexagono' ? X(0, (L * L - x * x - y * y - z * z) / 4) : X(0, (L * L - y * y - z * z) / 4);
      errores = sub === 'hexagono' ? [
        e('GE-tri-sin-recortes', X(0, L * L / 4), `Ese es el triángulo equilátero grande de lado ${L} que se forma al prolongar AB, CD y EF. Falta quitarle los tres triángulos de las esquinas.`),
        e('GE-tri-equilatero-sin-mitad', X(0, (L * L - x * x - y * y - z * z) / 2), `Usaste l²√3/2 para cada equilátero: falta el 1/2 de base por altura.`),
        e('GE-tri-un-recorte', X(0, (L * L - x * x) / 4), `Quitaste un solo triángulo de esquina. Hay tres: de lados ${x}, ${y} y ${z}.`),
        e('GE-tri-resta-lados', X(0, (L * L - (x + y + z) ** 2 / 3) / 4), `Juntaste los tres recortes en uno solo. Cada esquina es un equilátero aparte: se restan ${x}², ${y}² y ${z}² por separado.`),
      ] : [
        e('GE-tri-sin-triangulo', X(0, (L * L - x * x - y * y - z * z) / 4), `Ese es el hexágono. El pentágono le agrega el triángulo equilátero QAB, de lado ${x}.`),
        e('GE-tri-sin-recortes', X(0, L * L / 4), `Ese es el triángulo grande de lado ${L}. Al pentágono todavía le faltan dos esquinas: las de lados ${y} y ${z}.`),
        e('GE-tri-equilatero-sin-mitad', X(0, (L * L - y * y - z * z) / 2), `Usaste l²√3/2 para cada equilátero: falta el 1/2 de base por altura.`),
        e('GE-tri-recorte-de-mas', X(0, (L * L - x * x - y * y) / 4), `Quitaste la esquina de lado ${x}, que el pentágono sí incluye, y dejaste la de lado ${z}.`),
      ];
      solucion = [
        ['Con ángulos de 120°, al prolongar AB, CD y EF se forma un triángulo equilátero; cada esquina que sobra es un equilátero (sus ángulos son de 60°).'],
        ['El lado del triángulo grande es ', v('x', `${x}`), ' + ', v('m', `${lados.BC}`), ' + ', v('y', `${y}`), ` = ${L}; las esquinas tienen lados ${x}, ${y} y ${z}.`],
        sub === 'hexagono'
          ? [`Hexágono = (√3/4)(${L}² − ${x}² − ${y}² − ${z}²) = (√3/4)·${L * L - x * x - y * y - z * z}.`]
          : [`El pentágono QCDEF es el triángulo grande sin las esquinas de lados ${y} y ${z} (la de lado ${x} es QAB): (√3/4)(${L}² − ${y}² − ${z}²).`],
        [v('A', 'Área'), ' = ', v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'equilateros', sub, u, L, x, y, z };
    } else if (sub === 'isosceles-lados') {
      const l = 4 * rng.entero(1, 6);
      variables = { l: { nombre: 'lados iguales', color: 'o' }, t: { nombre: 'ángulo del vértice', color: 'h' }, A: { nombre: 'área', color: 'd' } };
      enunciado = [rng.elegir(['Un terreno', 'Un banderín', 'Un triángulo']), ' tiene forma de triángulo isósceles ABC con ', v('l', `AB = AC = ${l} ${u}`), ' y un ángulo ', v('t', 'BAC de 30°'), '.'];
      pregunta = ['¿Cuál es su ', v('A', 'área'), '?'];
      correcta = X(l * l / 4);
      errores = [
        gp('GE7-lado-como-altura', X(l * l / 2), `Tomaste AC como altura sobre AB. La altura desde C cae perpendicular a AB y mide AC·sen 30° = ${l / 2}.`),
        e('GE-tri-sin-mitad', X(l * l), `Usaste lado por lado sin el 1/2 y sin la altura correcta.`),
        e('GE-tri-mitad-doble', X(l * l / 8), `Dividiste entre 2 una vez de más: la altura ya es ${l}/2, y el área es ${l}·${l / 2}/2.`),
      ];
      solucion = [
        ['Toma AB como base. Desde C baja la altura CH sobre AB: en el triángulo rectángulo AHC, el ángulo en A es ', v('t', '30°'), '.'],
        ['El cateto opuesto a 30° es la mitad de la hipotenusa: CH = ', v('l', `${l}`), `/2 = ${l / 2}.`],
        [v('A', 'Área'), ` = ${l}·${l / 2}/2 = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'equilateros', sub, u, l };
    } else {
      const b = 2 * rng.entero(1, 5);
      variables = { b: { nombre: 'base', color: 'i' }, t: { nombre: 'ángulo del vértice', color: 'h' }, A: { nombre: 'área', color: 'd' } };
      enunciado = [rng.elegir(['Un terreno', 'Una vela de barco', 'Un triángulo']), ' tiene forma de triángulo isósceles ABC, con AB = AC, un ángulo ', v('t', 'BAC de 30°'), ' y la base ', v('b', `BC = ${b} ${u}`), '. Los ángulos de la base miden 75°; usa tan 75° = 2 + √3.'];
      pregunta = ['¿Cuál es su ', v('A', 'área'), '?'];
      correcta = X(b * b / 2, b * b / 4);
      errores = [
        e('TR-tan15-por-tan75', X(b * b / 2, -b * b / 4), `Usaste tan 15° = 2 − √3. La altura AM forma con la base el ángulo de 75° en B: AM = BM·tan 75°.`),
        e('GE-tri-sin-mitad', X(b * b, b * b / 2), `Olvidaste el 1/2: área = BC·AM/2.`),
        e('TR-tan75-mal', X(b * b / 4, b * b / 4), `Usaste tan 75° = 1 + √3. Con el triángulo de 15° y 75°, tan 75° = 2 + √3.`),
        e('GE-tri-base-entera', X(b * b, b * b / 2), `Usaste toda la base en el triángulo rectángulo: AM = BC·tan 75°. La altura cae en el punto medio M, así BM = ${b / 2}.`),
        e('GE-tri-altura-doble', X(2 * b * b, b * b), `Tomaste AM = BC·tan 75° y además no dividiste entre 2.`),
      ];
      solucion = [
        ['La altura AM cae en el punto medio de BC: BM = ', v('b', `${b}`), `/2 = ${b / 2}, y el ángulo en B es 75°.`],
        [`AM = BM·tan 75° = ${b / 2}(2 + √3).`],
        [v('A', 'Área'), ` = BC·AM/2 = ${b}·${b / 2}(2 + √3)/2 = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'equilateros', sub, u, b };
    }
    return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad: u2, datos });
  }

  // ---------- pitagoras: altura que sale de Pitágoras ----------
  const TERNAS = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17], [15, 8, 17], [7, 24, 25], [24, 7, 25]];
  function pitagoras(rng, semilla, sub) {
    const [p0, q0, h0] = rng.elegir(TERNAS);
    const k = h0 !== 5 ? 1 : sub === 'semicircunferencia' ? 2 * rng.entero(1, 2) : rng.entero(1, 4);
    const u = rng.elegir(['m', 'dm']), u2 = u + '²';
    let variables, enunciado, pregunta, correcta, errores, solucion, datos, unidad = u2;
    if (sub === 'mediatriz') {
      const m = p0 * k, AB = q0 * k, n = h0 * k;
      const tasa = u === 'm' && rng.moneda() ? rng.entero(2, 4) : 0;
      const f = tasa || 1;
      if (!entero((m + n) * AB / 2)) return null;
      variables = { m: { nombre: 'PB', color: 'o' }, n: { nombre: 'PC', color: 'i' }, h: { nombre: 'AB', color: 'h' }, A: { nombre: tasa ? 'fertilizante' : 'área', color: 'd' } };
      const quien = rng.elegir(['Un terreno triangular ABC', 'Un triángulo ABC']);
      enunciado = [tasa ? 'Un terreno triangular ABC' : quien, ' tiene un ángulo recto en B. La mediatriz del lado AC corta al lado BC en el punto P, con ',
        v('m', `PB = ${m} ${u}`), ' y ', v('n', `PC = ${n} ${u}`), '.', ...(tasa ? [` Para abonarlo se usan ${tasa} kg de fertilizante por cada m².`] : [])];
      pregunta = tasa ? ['¿Cuántos ', v('A', 'kilogramos de fertilizante'), ' se necesitan?'] : ['¿Cuál es el ', v('A', 'área del triángulo ABC'), '?'];
      unidad = tasa ? 'kg' : u2;
      correcta = X(f * (m + n) * AB / 2);
      errores = [
        gp('GE7-lado-como-altura', X(f * (m + n) * n / 2), `Usaste PA = ${n} como altura. PA es inclinado; la altura sobre BC es el cateto AB, que sale de Pitágoras en el triángulo ABP.`),
        e('GE-tri-sin-mitad', X(f * (m + n) * AB), `Olvidaste el 1/2 del área del triángulo.`),
        e('GE-tri-base-incompleta', X(f * n * AB / 2), `Tomaste PC = ${n} como base. La base es todo BC = PB + PC = ${m + n}.`),
        e('GE-tri-solo-ABP', X(f * m * AB / 2), `Ese es solo el triángulo ABP. El terreno es todo ABC, con base BC = ${m + n}.`),
      ];
      solucion = [
        ['P está en la mediatriz de AC, así que equidista de A y de C: PA = PC = ', v('n', `${n}`), '.'],
        ['En el triángulo rectángulo ABP: ', v('h', 'AB'), ` = √(${n}² − ${m}²) = ${AB}.`],
        ['BC = ', v('m', `${m}`), ' + ', v('n', `${n}`), ` = ${m + n}; área = ${m + n}·${AB}/2 = ${(m + n) * AB / 2} ${u2}.`],
        ...(tasa ? [[v('A', 'Fertilizante'), ` = ${(m + n) * AB / 2}·${tasa} = `, v('A', textoX(correcta, 'kg')), '.']] : [[v('A', 'Área'), ' = ', v('A', textoX(correcta, u2)), '.']]),
      ];
      datos = { tipo: 'pitagoras', sub, u, m, n, tasa };
    } else {
      const a = p0 * k, c = q0 * k, d = h0 * k;
      if (!entero(a * c / 2)) return null;
      variables = { d: { nombre: 'diámetro AB', color: 'o' }, a: { nombre: 'AC', color: 'i' }, h: { nombre: 'BC', color: 'h' }, A: { nombre: 'área de ACB', color: 'd' } };
      enunciado = [rng.elegir(['Una ventana tiene forma de semicírculo', 'Un vitral tiene forma de semicírculo', 'Se dibuja un semicírculo']), ' de diámetro ', v('d', `AB = ${d} ${u}`),
        '. Dos listones rectos van de A y de B hasta un mismo punto C del arco, y el listón AC mide ', v('a', `${a} ${u}`), '.'];
      pregunta = ['¿Cuál es el ', v('A', 'área del triángulo ACB'), ' que forman los listones con el diámetro?'];
      correcta = X(a * c / 2);
      errores = [
        gp('GE7-lado-como-altura', X(a * d / 2), `Usaste AB como base y AC como altura. AC no es perpendicular a AB; el ángulo recto está en C, así que los catetos son AC y BC.`),
        e('GE-tri-sin-mitad', X(a * c), `Olvidaste el 1/2 del área del triángulo.`),
        e('GE-tri-altura-radio', X(d * d / 4), `Tomaste el radio ${d / 2} como altura sobre AB. Eso solo pasa si C está en lo más alto del arco.`),
        e('GE-tri-suma-catetos', X((a + c) * d / 4), `Promediaste los listones como altura. La altura sobre AB sale de AC·BC/AB.`),
        gp('GE7-lado-como-altura-BC', X(c * d / 2), `Usaste AB como base y BC como altura. BC no es perpendicular a AB; el ángulo recto está en C, así que los catetos son AC y BC.`),
        gp('GE4-area-perimetro', X(a + c + d), `Sumaste los tres lados: ese es el perímetro del triángulo, no su área.`),
      ];
      solucion = [
        ['C está en la semicircunferencia de diámetro AB: el ángulo ACB es recto.'],
        ['Pitágoras: ', v('h', 'BC'), ' = √(', v('d', `${d}`), '² − ', v('a', `${a}`), `²) = ${c}.`],
        [v('A', 'Área'), ` = AC·BC/2 = ${a}·${c}/2 = `, v('A', textoX(correcta, u2)), '.'],
      ];
      datos = { tipo: 'pitagoras', sub, u, d, a };
    }
    return cerrar(rng, semilla, { variables, enunciado, pregunta, correcta, errores, solucion, unidad, datos });
  }

  const SUBS = {
    'misma-altura': ['rectangulo-razon', 'bisectriz', 'bisectriz-rectangulo', 'razon-segmentos'],
    paralelas: ['trapecio-punto', 'trapecio-punto', 'diagonales'],
    trapecio: ['total', 'lateral', 'desde-total'],
    equilateros: ['estrella', 'hexagono', 'pentagono', 'isosceles-lados', 'isosceles-base'],
    pitagoras: ['mediatriz', 'mediatriz', 'semicircunferencia'],
  };
  const CONSTRUIR = { 'misma-altura': mismaAltura, paralelas, trapecio, 'punto-medio': puntoMedio, notables, equilateros, pitagoras };

  return { id: ID, titulo: 'Áreas de triángulos y polígonos por partes', generar, calc, textoX, clave, K: R3 };
});
