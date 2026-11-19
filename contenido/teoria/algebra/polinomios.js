/*
 * Teoría de «Polinomios» (algebra.polinomios), tercera unidad de la rama «Expresiones algebraicas».
 *
 * Etapa 5 del método (19 nov 2026; docs/etapa5/propuesta-algebra.md, con sus «Decisiones tomadas» y sus «Cambios»): seis
 * ideas, todas reescritas contra el contrato, con el pedido de losetas del maestro Rubén (pieza alg-losetas, dibujos de
 * prueba) como hilo: 1 «Términos semejantes» (`terminos-semejantes`, nueva: dos pedidos que se juntan), 2 «Valor
 * numérico» (`valor-numerico`: el mismo pedido con losetas de otro tamaño), 3 «Grado absoluto y relativo» (`grados`: las
 * piezas del depósito y las fichas de letras), 4 «Completo, ordenado y homogéneo» (`completo-ordenado`: el casillero de
 * la tienda), 5 «Polinomios idénticos» (`igualdad`: dos pedidos en el casillero) y 6 «Multiplicar polinomios»
 * (`operaciones`: el piso partido en tramos). Los ids de la ronda 2 no cambian; no hay avance que migrar. La unidad
 * lleva calidad: 2 desde el 19 nov (después del lector en frío y del auditor), y pasa el validador
 * con esa marca (polinomios.test.js, última prueba).
 *
 * REGLA DE COLORES DE LA UNIDAD (docs/molde-unidad.md §5b; propuesta §6), en la tabla COLORES (def.colores):
 *   - naranja (c-o): el primer polinomio de una suma, una resta, una comparación o un producto, y sus términos (el
 *     pedido 1, P, el largo del piso); el número que entra en lugar de x (idea 2); el exponente de x (ideas 3 y 4);
 *   - turquesa (c-i): el segundo polinomio y sus términos (el pedido 2, Q, el ancho del piso); el exponente de y;
 *   - violeta (c-f): el resultado, que es lo que casi siempre se pide (el polinomio reducido, P(k), el grado, el número
 *     hallado), y lo que se olvida (los 0 de las casillas vacías);
 *   - tinta: las letras x e y, los nombres de un polinomio que está solo y lo que se pide con «?»; la letra de una
 *     alternativa va en negrita y en tinta;
 *   - ni carmín ni verde (polinomios.test.js lo comprueba en todas las fichas y figuras). Dos magnitudes de un mismo
 *     problema no comparten color: donde hay P y Q, el valor de x y los exponentes van en tinta.
 * Nada antes de Predice de cada idea (título, Resumen, Lee, glosario, juego) dice su respuesta (polinomios.test.js).
 *
 * Molde: docs/teoria.md. Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 7), expediente
 * teoria-152-unidades (Álgebra) e historia-ecuaciones (pp. 57–68). Errores: PO1–PO35 de plantillas/polinomios/
 * (hipótesis del proyecto), AL3, AL7 y AL16 de docs/investigacion/algebra-funciones-ideas-erroneas.md y TAL-* (hipótesis
 * de diseño, rutinas/teoria-algebra.md; los nuevos de cada idea están en su comentario).
 * Práctica: plantillas/polinomios-practica/ (formato «predicciones», con los tipos de cada idea). La escena vieja
 * «La máquina de Ruffini» (plantillas/polinomios/) va a «Más mesas del tema» en esta unidad ("rehacer").
 * Laboratorio: las tres mesas de la ronda 2 (un cúbico que se arma y se evalúa, P contra Q en curvas y la cuadrícula del
 * producto), con los colores de la unidad.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    r();                                  // la primera salida se parece entre semillas vecinas: se descarta
    r.noCero = (lo, hi) => { let v = 0; while (v === 0) v = lo + Math.floor(r() * (hi - lo + 1)); return v; };
    return r;
  }
  function distintas(ops) {
    const vistos = new Set(), out = [];
    for (const o of ops) { const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }
  // ---------- Escritura de polinomios ----------
  const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = n => String(n).split('').map(c => SUP[c]).join('');
  const pot = (v, e) => (e === 0 ? '' : e === 1 ? v : v + sup(e));
  // Un monomio c·x^a·y^b con su signo; primero: sin «+» delante.
  function mono(c, partes, primero) {
    const lit = partes.map(([v, e]) => pot(v, e)).join('');
    const abs = Math.abs(c), num = abs === 1 && lit ? '' : f(abs);
    const signo = c < 0 ? (primero ? '−' : ' − ') : (primero ? '' : ' + ');
    return signo + num + lit;
  }
  // Polinomio en x con coeficientes de mayor a menor grado: [2, 0, −5, 1] → «2x³ − 5x + 1».
  function poli(cs, v = 'x') {
    const n = cs.length - 1, out = [];
    cs.forEach((c, k) => { if (c !== 0) out.push([c, n - k]); });
    if (!out.length) return '0';
    return out.map(([c, e], i) => mono(c, [[v, e]], i === 0)).join('');
  }
  const par = v => (v < 0 ? `(${f(v)})` : f(v));
  const evaluar = (cs, a) => cs.reduce((acc, c) => acc * a + c, 0);
  // Gesto directo: la manija vive en el viewBox de la pieza; la inversa lineal de su escala da el valor.
  const EJES = () => Kit.piezas.ejes;
  const inversa = (escala, p, q) => px => p + (px - escala(p)) * (q - p) / (escala(q) - escala(p));
  const multiplicar = (A, B) => { const out = Array(A.length + B.length - 1).fill(0); A.forEach((a, i) => B.forEach((b, j) => { out[i + j] += a * b; })); return out; };

  // ---------- Colores de la unidad: un color fijo por magnitud (cabecera; lo comprueba polinomios.test.js) ----------
  // El primer polinomio (o el primer factor) naranja y el segundo turquesa; el número que entra en lugar de x y el exponente
  // de x, naranja; el exponente de y, turquesa (nunca en un mismo problema con dos polinomios); el resultado y lo que se
  // olvida (los 0 de las casillas vacías), violeta.
  const COLORES = { 'primer polinomio': 'o', 'segundo polinomio': 'i', resultado: 'f', 'valor de x': 'o', 'exponente de x': 'o', 'exponente de y': 'i', 'lo que se olvida': 'f' };
  const ficha = mg => t => ({ v: `c-${COLORES[mg]}`, t: String(t), m: mg });
  const P1 = ficha('primer polinomio'), P2 = ficha('segundo polinomio'), RES = ficha('resultado'), OLV = ficha('lo que se olvida');
  const P = P1('P'), Q = P2('Q');
  // La letra de una alternativa, en negrita y en tinta (Gerson, mesa del 17 nov; Productos notables, ronda 2). El
  // U+2060 (invisible) queda para que la letra no se lea como variable.
  const letra = L => ({ negrita: `${L}⁠` });
  function conCuatro(caso, r) {
    for (let i = 0; i < 80; i++) { const c = caso(r); if (c.opciones.length >= 4) return c; }
    throw new Error(`${caso.name}: no salieron cuatro opciones distintas`);
  }
  const sgn = v => (v < 0 ? '−' : '+');

  // ---------- Idea 1 (nueva, 19 nov): términos semejantes ----------
  // Propuesta: docs/etapa5/propuesta-algebra.md (§1 a §6, idea 1). Objeto de la primera pantalla: el pedido de piezas del
  // maestro Rubén para un patio de Juliaca: losetas de x por x (cubren x²), tiras de x por 1 (cubren x) y cuadraditos de
  // 1 por 1 (pieza alg-losetas, dibujo de prueba). La letra es una medida, el lado de la loseta en dm, nunca la pieza
  // (contra AL3, «letra como objeto»).
  // Cambia: las piezas del pedido 2. · Permanece: el pedido 1 (2x² + 3x + 1) y las columnas por forma. · Progresa: los
  // montones de «Juntos» y sus tres términos. · Se reserva: los términos con dos letras y el orden de las letras (la
  // predicción: 2xy + 3yx). · Debe verse: solo se juntan las piezas de la misma forma, y de cada forma se suman las
  // cantidades; una tira y una loseta nunca caen en el mismo montón.
  // Nada antes de Predice dice que yx es xy: ni Lee, ni el glosario, ni el juego (una sola letra), ni los ejemplos de
  // nivel 1.
  // Errores (hipótesis de diseño, salvo AL7 y AL16, de docs/investigacion/algebra-funciones-ideas-erroneas.md):
  // TAL-NO-SEMEJ junta términos que no son semejantes (3x + 2x² = 5x³; es el error objetivo de la matriz y la falta de
  // cierre de AL7) · TAL-SUMA-POT al sumar semejantes también «suma» los exponentes (x² + x² = x⁴) · TAL-SUMA-MULT
  // multiplica los coeficientes · TAL-ORDEN cree que xy y yx son partes literales distintas · TAL-EXP-CRUZ junta x²y con
  // xy² · TAL-SIGNO pierde o cambia un signo · PO21 suma los coeficientes sin sus signos · TAL-RESTA-PRIMERO al restar
  // un polinomio cambia solo el signo del primer término · TAL-RESTA-ORDEN resta al revés · AL16 despeja con el signo
  // cambiado · TAL-EXP-DIRECTO toma el exponente del otro término sin despejar · TAL-PIDE responde otra cosa.
  const LO = datos => ({ pieza: 'alg-losetas', datos, estado: {} });
  const PED1 = [2, 3, 1];   // el pedido 1 del juego: 2x² + 3x + 1
  const TOPE_J = [4, 7, 5];   // lo más que juntan los dos pedidos del juego
  const pedido = (c1, c2, extra) => LO(Object.assign({ objeto: 'pedido', filas: [{ nombre: 'Pedido 1', cuenta: c1, color: 'o' }, { nombre: 'Pedido 2', cuenta: c2, color: 'i' }] }, extra));
  const aa = P1('a'), bb = P2('b');
  const SEP = '   ·   ';
  const DF = {
    sem: 'Términos semejantes: tienen las mismas letras con los mismos exponentes',
    suma: [aa, 'xⁿ + ', bb, 'xⁿ = (', aa, ' + ', bb, ')xⁿ'],
    resta: 'Al restar un polinomio, cambia el signo de cada término: −(p − q) = −p + q, con p, q términos cualesquiera',
    coef: 'Coeficiente: el número que multiplica a las letras de un término; el término sin letras es su propio coeficiente',
    lit: 'Parte literal: las letras de un término, con sus exponentes',
    uno: 'x = 1x: el coeficiente 1 no se escribe',
    xx: 'x · x = x²: la x multiplicada por sí misma',
    perim: 'Perímetro de un rectángulo = 2 · largo + 2 · ancho',
    area: 'Área de un rectángulo = largo · ancho',
  };
  const X2Y = [['x', 2], ['y', 1]], XY2 = [['x', 1], ['y', 2]], YX2 = [['y', 1], ['x', 2]];
  const sumaV = (A, B, k = 1) => A.map((a, i) => a + k * B[i]);
  const ops = lista => distintas(lista).slice(0, 4);

  // Ahora tú 1: reducir un polinomio con sus términos mezclados.
  function casoReduce(r) {
    let a1, b1, a2, b2;
    do { a1 = r.ent(2, 6); b1 = r.ent(2, 7); a2 = r.noCero(-4, 4); b2 = r.noCero(-5, 5); } while ((a2 > 0 && b2 > 0) || a1 + a2 === 0 || b1 + b2 === 0 || a1 + b1 + a2 + b2 === 0);
    const A = a1 + a2, B = b1 + b2, S = a1 + b1 + a2 + b2;
    const texto = mono(a1, [['x', 2]], true) + mono(b1, [['x', 1]], false) + mono(a2, [['x', 2]], false) + mono(b2, [['x', 1]], false);
    return {
      pregunta: `Reduce ${texto}.`,
      datos: [DF.sem, DF.suma],
      opciones: ops([
        { id: 'c', texto: poli([A, B, 0]), correcta: true },
        { id: 'todo', texto: mono(S, [['x', 3]], true), error: 'TAL-NO-SEMEJ', siFuera: 'Bien sumados los números. Pero x² y x no son semejantes: son piezas distintas y no se juntan.' },
        { id: 'signo', texto: poli([a1 + Math.abs(a2), b1 + Math.abs(b2), 0]), error: 'TAL-SIGNO', siFuera: 'Bien agrupados los semejantes. Pero revisa los signos: un término con − resta su coeficiente.' },
        { id: 'exp', texto: mono(A, [['x', 4]], true) + mono(B, [['x', 2]], false), error: 'TAL-SUMA-POT', siFuera: 'Bien los coeficientes. Pero al juntar semejantes la parte literal no cambia: x² + x² no es x⁴.' },
      ]),
      solucion: { texto: 'Los de x² con los de x², y los de x con los de x.',
        ecuacion: [`(${a1} ${sgn(a2)} ${Math.abs(a2)})x² + (${b1} ${sgn(b2)} ${Math.abs(b2)})x = `, RES(poli([A, B, 0]))] },
    };
  }
  // Ahora tú 2: sumar dos polinomios (dos pedidos, ahora con signos).
  function casoSuma(r) {
    let P, Q, T;
    do {
      P = [r.ent(1, 5), r.noCero(-6, 6), r.ent(1, 9)]; Q = [r.noCero(-4, 4), r.noCero(-6, 6), r.noCero(-9, 9)]; T = sumaV(P, Q);
    } while (Q.every(q => q > 0) || T.some(t => t === 0));
    const abs = sumaV(P, Q.map(Math.abs));
    return {
      pregunta: ['Suma: (', P1(poli(P)), ') + (', P2(poli(Q)), ').'],
      datos: [DF.suma],
      opciones: ops([
        { id: 'c', texto: poli(T), correcta: true },
        { id: 'resta', texto: poli(sumaV(P, Q, -1)), error: 'TAL-SIGNO', siFuera: 'Bien juntos los semejantes. Pero es una suma: los signos del segundo polinomio no cambian.' },
        { id: 'abs', texto: poli(abs), error: 'PO21', siFuera: 'Bien juntos los semejantes. Pero cada coeficiente va con su signo: uno negativo resta.' },
        { id: 'exp', texto: mono(T[0], [['x', 4]], true) + mono(T[1], [['x', 2]], false) + mono(T[2], [], false), error: 'TAL-SUMA-POT', siFuera: 'Bien los coeficientes. Pero al sumar, los exponentes no cambian: x² + x² sigue con x².' },
      ]),
      solucion: { texto: 'Se suman los coeficientes de cada clase de término, con su signo.',
        ecuacion: [`(${P[0]} ${sgn(Q[0])} ${Math.abs(Q[0])})x² + (${f(P[1])} ${sgn(Q[1])} ${Math.abs(Q[1])})x + (${P[2]} ${sgn(Q[2])} ${Math.abs(Q[2])}) = `, RES(poli(T))] },
    };
  }
  // Ahora tú 3: restar un polinomio (cambia el signo de cada término).
  function casoResta(r) {
    let P, Q, D;
    do {
      P = [r.ent(3, 8), r.noCero(-6, 6), r.noCero(-9, 9)]; Q = [r.ent(1, 5), r.noCero(-5, 5), r.noCero(-8, 8)]; D = sumaV(P, Q, -1);
    } while ((Q[1] > 0 && Q[2] > 0) || D.some(t => t === 0));
    return {
      pregunta: ['Resta: (', P1(poli(P)), ') − (', P2(poli(Q)), ').'],
      datos: [DF.suma, DF.resta],
      opciones: ops([
        { id: 'c', texto: poli(D), correcta: true },
        { id: 'primero', texto: poli([P[0] - Q[0], P[1] + Q[1], P[2] + Q[2]]), error: 'TAL-RESTA-PRIMERO', siFuera: 'Bien restado el primer término. Pero el − alcanza a todo el paréntesis: cambia cada término.' },
        { id: 'suma', texto: poli(sumaV(P, Q)), error: 'TAL-SIGNO', siFuera: 'Bien juntos los semejantes. Pero es una resta: cada término del segundo cambia de signo.' },
        { id: 'orden', texto: poli(sumaV(Q, P, -1)), error: 'TAL-RESTA-ORDEN', siFuera: 'Bien cambiados los signos. Pero se le quita el segundo al primero, no al revés.' },
      ]),
      solucion: { texto: 'Cada término del segundo cambia de signo; después se juntan los semejantes.',
        ecuacion: [P1(poli(P)), ' ', P2(mono(-Q[0], [['x', 2]], false).trim() + mono(-Q[1], [['x', 1]], false) + mono(-Q[2], [], false)), ' = ', RES(poli(D))] },
    };
  }
  // Ahora tú 4: dos letras; x²y y xy² no son semejantes, y yx² es x²y (el error de orden lo junta con xy²: una
  // opción que solo dejara yx² sin juntar valdría lo mismo que la correcta).
  function casoDosLetras(r) {
    let a, b, c, d;
    do { a = r.ent(2, 6); b = r.noCero(-5, 5); c = r.noCero(-4, 6); d = r.noCero(-5, 5); } while (a + c === 0 || b + d === 0 || a + b + c + d === 0 || b + c + d === 0);
    const A = a + c, B = b + d;
    const texto = mono(a, X2Y, true) + mono(b, XY2, false) + mono(c, YX2, false) + mono(d, XY2, false);
    const bien = mono(A, X2Y, true) + mono(B, XY2, false);
    return {
      pregunta: `Reduce ${texto}.`,
      datos: [DF.sem, DF.suma],
      opciones: ops([
        { id: 'c', texto: bien, correcta: true },
        { id: 'junta', texto: mono(a + b + c + d, X2Y, true), error: 'TAL-EXP-CRUZ', siFuera: 'Bien sumados los coeficientes. Pero x²y no es semejante a xy²: cada letra lleva otro exponente.' },
        { id: 'orden', texto: mono(a, X2Y, true) + mono(b + c + d, XY2, false), error: 'TAL-ORDEN', siFuera: 'Bien que juntes tres términos. Pero yx² es x²y, no xy²: en los dos la x lleva el 2.' },
        { id: 'exp', texto: mono(A, [['x', 4], ['y', 2]], true) + mono(B, [['x', 2], ['y', 4]], false), error: 'TAL-SUMA-POT', siFuera: 'Bien los coeficientes. Pero al juntar semejantes la parte literal no cambia.' },
      ]),
      solucion: { texto: 'yx² es x²y. Los de x²y se juntan entre sí; los de xy², también.',
        ecuacion: [`(${a} ${sgn(c)} ${Math.abs(c)})x²y + (${f(b)} ${sgn(d)} ${Math.abs(d)})xy² = `, RES(bien)] },
    };
  }
  // Ahora tú 5 (nivel examen): exponentes por hallar para que dos términos sean semejantes.
  function casoExponentes(r) {
    let p, s, m, n;
    do { p = r.ent(1, 4); s = r.ent(1, 4); m = r.ent(1, 5); n = r.ent(2, 8); } while (p === s || n - s < 2);
    const ex = m + p, ey = n - s, k1 = r.ent(2, 9), k2 = r.ent(2, 9);
    return {
      // «es semejante a», no «… y …»: la conjunción se leería como la letra y (lector de la tarjeta, 19 nov).
      pregunta: ['Si ', String(k1), { sup: ['x', `m + ${p}`] }, { sup: ['y', String(ey)] }, ' es semejante a −', String(k2), { sup: ['x', String(ex)] }, { sup: ['y', `n − ${s}`] }, ', ¿cuánto vale m + n?'],
      datos: [DF.sem],
      opciones: ops([
        { id: 'c', texto: f(m + n), correcta: true },
        { id: 'despeje', texto: f(ex + p + ey - s), error: 'AL16', siFuera: `Bien igualados los exponentes. Pero al despejar, el ${p} pasa restando y el ${s}, sumando.` },
        { id: 'directo', texto: f(ex + ey), error: 'TAL-EXP-DIRECTO', siFuera: `${ex} y ${ey} son los exponentes, bien leídos. Pero m + ${p} = ${ex}: falta despejar m, y también n.` },
        { id: 'pide', texto: f(m * n), error: 'TAL-PIDE', siFuera: `Bien hallados m = ${m} y n = ${n}. Pero piden la suma, no el producto.` },
        { id: 'coef', texto: f(k1 + k2), error: 'TAL-COEF-SEMEJ', siFuera: 'Esos son los coeficientes. Semejantes pide iguales los exponentes de cada letra, no los coeficientes.' },
      ]),
      solucion: { texto: 'Cada letra lleva el mismo exponente en los dos términos.',
        ecuacion: [`m = ${ex} − ${p} = ${m}`, ',   ', `n = ${ey} + ${s} = ${n}`, ',   m + n = ', RES(m + n)] },
    };
  }

  // Ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h). Cuentas rehechas aparte (scratchpad de la sesión,
  // e5-algebra/cuentas-idea1.py, con polinomios como diccionarios y sin el código de la unidad): 3x + 4x = 7x; x + x = 2x
  // contra x · x = x² (coinciden solo en x = 0 y x = 2); 9x² − 4x² = 5x²; 3x² + 5x − x² + 2x = 2x² + 7x;
  // (2x² + 3x + 4) + (x² + 2x + 1) = 3x² + 5x + 5; (5x² + 4x − 6) − (2x² − x + 3) = 3x² + 5x − 9; 4xy + 3x − xy + 2x =
  // 3xy + 5x; (5x² + 3x + 4) − (2x² + 3x + 1) = 3x² + 3; m + 2 = 6 y n − 1 = 5 → m + n = 10 (errores 12, 8, 11 y 24);
  // 5x − [2x − (3x − 4)] = 6x − 4 (errores 6x + 4, 4, −4 y 10x − 4); perímetro 2(3x + 2) + 2(x + 5) = 8x + 14 (errores
  // 4x + 7, 8x + 7, 22x y el área 3x² + 17x + 10); 2P − Q = 7x²y − 9xy² + 14 (errores 5x²y + xy² + 2, …+ 2, 4x²y − 7xy² +
  // 10 y …+ 10); 3(2x² + x + 4) − (x² + 3x + 5) = 5x² + 7 (errores 5x² + 6x + 17, x² − 2x − 1, 5x² − 2x − 1 y 12x²).
  // Ningún ejemplo de nivel 1 tiene dos letras en otro orden (es la predicción); ninguna figura muestra lo que se pide.
  const EJEMPLOS_SEMEJANTES = [
    { nivel: 1, titulo: 'Dos pedidos de tiras',
      enunciado: ['Rubén pide ', P1(3), ' tiras el lunes y ', P2(4), ' tiras el martes. Cada tira cubre x dm². ¿Cuánto cubren todas?'],
      datos: [DF.suma],
      figura: LO({ objeto: 'pedido', filas: [{ nombre: 'Lunes', cuenta: [0, 3, 0], color: 'o', rotulo: false }, { nombre: 'Martes', cuenta: [0, 4, 0], color: 'i', rotulo: false }] }),
      solucion: [{ texto: 'Son piezas de la misma forma: van al mismo montón. Se suman las cantidades, 3 + 4 = 7, y la x queda igual.', ecuacion: [P1('3x'), ' + ', P2('4x'), ' = ', RES('7x')] }],
      respuesta: [RES('7x'), ' dm²'] },
    { nivel: 1, titulo: 'Coeficiente y parte literal',
      enunciado: '¿Cuál es el coeficiente y cuál es la parte literal del término −7x²y?',
      datos: [DF.coef, DF.lit],
      solucion: [{ texto: 'El número de adelante, con su signo, es el coeficiente. Lo demás, las letras con sus exponentes, es la parte literal.', ecuacion: [{ llave: ['−7'], nota: 'coeficiente' }, { llave: ['x²y'], nota: 'parte literal' }] }],
      respuesta: 'Coeficiente: −7. Parte literal: x²y' },
    { nivel: 1, titulo: '¿Sumar o multiplicar?',
      enunciado: '¿Es x + x lo mismo que x · x?',
      datos: [DF.suma, DF.uno, DF.xx],
      figura: LO({ objeto: 'pedido', columnas: false, filas: [{ nombre: 'x + x', cuenta: [0, 2, 0], rotulo: false }, { nombre: 'x · x', cuenta: [1, 0, 0], rotulo: false }] }),
      solucion: [
        { texto: 'x + x son dos tiras: 1x + 1x = 2x. En cambio, x · x es una loseta: x².', ecuacion: ['x + x = ', RES('2x'), ', pero x · x = ', RES('x²')] },
        { texto: 'Valen igual solo en algunos x: con x = 2 dan 4 y 4, y con x = 0, 0 y 0. Con x = 3 ya no: 6 y 9.', ecuacion: ['2 · 3 = 6,   3 · 3 = 9'] },
      ],
      respuesta: ['No: x + x = ', RES('2x'), ' y x · x = ', RES('x²')] },
    { nivel: 1, titulo: '¿Cuáles son semejantes?',
      enunciado: '¿Son semejantes 4x³ y 4x²? ¿Y 4x³ y −9x³?',
      datos: [DF.sem],
      solucion: [{ texto: '4x³ y 4x² tienen el mismo coeficiente, pero la x lleva otro exponente: no lo son. 4x³ y −9x³ tienen la misma parte literal, x³: sí lo son.' }],
      respuesta: 'Solo 4x³ y −9x³ son semejantes' },
    { nivel: 1, titulo: 'Una resta de semejantes',
      enunciado: 'Reduce 9x² − 4x².',
      datos: [DF.suma],
      solucion: [{ texto: 'Los dos términos tienen la parte literal x²: son semejantes. Se restan los coeficientes, 9 − 4 = 5, y x² queda igual.', ecuacion: ['9x² − 4x² = (9 − 4)x² = ', RES('5x²')] }],
      respuesta: [RES('5x²')] },
    { nivel: 2, titulo: 'Reducir un polinomio',
      enunciado: 'Reduce 3x² + 5x − x² + 2x.',
      datos: [DF.sem, DF.suma, DF.uno],
      solucion: [
        { texto: 'Agrupo los términos semejantes: los de x² por un lado y los de x por otro. El término −x² lleva coeficiente −1.', ecuacion: [{ llave: ['3x² − x²'], nota: 'con x²' }, ' + ', { llave: ['5x + 2x'], nota: 'con x' }] },
        { texto: 'Opero los coeficientes de cada grupo: 3 − 1 = 2 y 5 + 2 = 7. Lo que queda ya no tiene semejantes.', ecuacion: [RES('2x² + 7x')] },
      ],
      respuesta: [RES('2x² + 7x')] },
    { nivel: 2, titulo: 'Juntar dos pedidos',
      enunciado: ['Rubén junta un pedido de ', P1('2x² + 3x + 4'), ' dm² con otro de ', P2('x² + 2x + 1'), ' dm². ¿Qué polinomio dice cuánto cubren juntos?'],
      datos: [DF.suma, DF.uno],
      figura: pedido([2, 3, 4], [1, 2, 1]),
      solucion: [
        { texto: 'Cada forma va a su montón: losetas con losetas, tiras con tiras y cuadraditos con cuadraditos.', ecuacion: ['(', P1(2), ' + ', P2(1), ')x² + (', P1(3), ' + ', P2(2), ')x + (', P1(4), ' + ', P2(1), ')'] },
        { texto: 'Sumo los coeficientes de cada montón.', ecuacion: [RES('3x² + 5x + 5')] },
      ],
      respuesta: [RES('3x² + 5x + 5'), ' dm²'] },
    { nivel: 2, titulo: 'Restar un polinomio',
      enunciado: ['Resta: (', P1('5x² + 4x − 6'), ') − (', P2('2x² − x + 3'), ').'],
      datos: [DF.suma, DF.resta],
      solucion: [
        { texto: 'El − de adelante cambia cada término del segundo polinomio: 2x² pasa a −2x², −x pasa a +x y 3 pasa a −3.', ecuacion: [P1('5x² + 4x − 6'), ' ', P2('− 2x² + x − 3')] },
        { texto: 'Junto los semejantes: 5 − 2 = 3, 4 + 1 = 5 y −6 − 3 = −9.', ecuacion: [RES('3x² + 5x − 9')] },
      ],
      respuesta: [RES('3x² + 5x − 9')] },
    { nivel: 2, titulo: 'Con dos letras',
      enunciado: 'Reduce 4xy + 3x − xy + 2x.',
      datos: [DF.sem, DF.suma, DF.uno],
      solucion: [
        { texto: 'Hay dos partes literales distintas: una es xy; la otra, x. Agrupo cada término con sus semejantes.', ecuacion: [{ llave: ['4xy − xy'], nota: 'con xy' }, ' + ', { llave: ['3x + 2x'], nota: 'con x' }] },
        { texto: 'Con xy: 4 − 1 = 3. Con x: 3 + 2 = 5. Un término con xy no se junta con uno que solo tiene x.', ecuacion: [RES('3xy + 5x')] },
      ],
      respuesta: [RES('3xy + 5x')] },
    { nivel: 2, titulo: 'El pedido que falta',
      enunciado: ['Rubén ya pidió piezas por ', P1('2x² + 3x + 1'), ' dm² y necesita cubrir 5x² + 3x + 4 dm². ¿Qué polinomio dice lo que falta pedir?'],
      datos: [DF.suma, DF.resta],
      figura: LO({ objeto: 'pedido', filas: [{ nombre: 'Necesita', cuenta: [5, 3, 4] }, { nombre: 'Ya pidió', cuenta: [2, 3, 1], color: 'o' }] }),
      solucion: [
        { texto: 'Lo que falta es lo que necesita menos lo que ya pidió. El − cambia el signo de cada término de lo pedido.', ecuacion: ['5x² + 3x + 4 ', P1('− 2x² − 3x − 1')] },
        { texto: 'Resto montón por montón: 5 − 2 = 3 losetas, 3 − 3 = 0 tiras y 4 − 1 = 3 cuadraditos.', ecuacion: [RES('3x² + 3')] },
      ],
      respuesta: [RES('3x² + 3'), ' dm²'] },
    { nivel: 3, titulo: 'Exponentes por hallar',
      enunciado: ['Si 3', { sup: ['x', 'm + 2'] }, 'y⁵ es semejante a −7x⁶', { sup: ['y', 'n − 1'] }, ', ¿cuánto vale m + n?'],
      alternativas: ['8', '10', '12', '11', '24'],
      datos: [DF.sem],
      solucion: [
        { texto: 'Semejantes quiere decir la misma parte literal: cada letra lleva el mismo exponente en los dos términos. Igualo los de x; después, los de la otra letra.', ecuacion: ['m + 2 = 6,   n − 1 = 5'] },
        { texto: 'Despejo: m = 6 − 2 = 4; n = 5 + 1 = 6. Piden la suma.', ecuacion: ['m + n = 4 + 6 = ', RES(10)] },
        { texto: ['La ', letra('C'), ' despeja al revés: m = 6 + 2 = 8, n = 5 − 1 = 4, que suman 12. La ', letra('A'), ' despeja mal solo n: 4 + 4 = 8.'] },
        { texto: ['La ', letra('D'), ' suma los exponentes sin despejar: 6 + 5 = 11. La ', letra('E'), ' multiplica m por n: 4 · 6 = 24.'] },
      ],
      respuesta: [letra('B'), ', ', RES(10)] },
    { nivel: 3, titulo: 'Signos de agrupación',
      enunciado: 'Reduce 5x − [2x − (3x − 4)].',
      alternativas: ['4', '−4', '6x + 4', '6x − 4', '10x − 4'],
      datos: [DF.suma, DF.resta],
      solucion: [
        { texto: 'Empiezo por el paréntesis de adentro: su − cambia a 3x y a −4.', ecuacion: ['2x − (3x − 4) = 2x − 3x + 4 = −x + 4'] },
        { texto: 'Ahora el corchete: su − cambia a −x y a 4. Junto los semejantes.', ecuacion: ['5x − [−x + 4] = 5x + x − 4 = ', RES('6x − 4')] },
        { texto: ['La ', letra('C'), ' no le cambia el signo al −4 de adentro: 6x + 4. La ', letra('A'), ' cambia solo el 2x del corchete: 5x − 2x − (3x − 4) = 4.'] },
        { texto: ['La ', letra('B'), ' quita los signos de agrupación sin cambiar nada: 5x − 2x − 3x − 4 = −4. La ', letra('E'), ' suma todas las x: 10x − 4.'] },
      ],
      respuesta: [letra('D'), ', ', RES('6x − 4')] },
    { nivel: 3, titulo: 'El perímetro de un terreno',
      enunciado: 'Un terreno rectangular mide (3x + 2) m de largo y (x + 5) m de ancho. ¿Qué polinomio da su perímetro, en metros?',
      alternativas: ['4x + 7', '8x + 14', '22x', '8x + 7', '3x² + 17x + 10'],
      datos: [DF.perim, DF.area, DF.suma],
      figura: LO({ objeto: 'lote', largo: '(3x + 2)', ancho: '(x + 5)' }),
      solucion: [
        { texto: 'El perímetro es el borde: dos largos y dos anchos. Dos veces un polinomio duplica cada uno de sus términos.', ecuacion: ['2 · (3x + 2) + 2 · (x + 5) = 6x + 4 + 2x + 10'] },
        { texto: 'Junto los semejantes: 6x + 2x = 8x y 4 + 10 = 14. Como 8x y 14 no son semejantes, ahí termina.', ecuacion: [RES('8x + 14')] },
        { texto: ['La ', letra('A'), ' suma un solo largo y un solo ancho: 4x + 7. La ', letra('D'), ' duplica las x pero no los números: 8x + 7.'] },
        { texto: ['La ', letra('C'), ' junta 8x con 14, que no son semejantes: 22x. La ', letra('E'), ' multiplica largo por ancho: eso es el área.'] },
      ],
      respuesta: [letra('B'), ', ', RES('8x + 14'), ' m'] },
    { nivel: 3, titulo: 'Dos polinomios con dos letras',
      enunciado: ['P = ', P1('3x²y − 2xy² + 4'), '; Q = ', P2('−x²y + 5xy² − 6'), '. ¿A qué es igual 2P − Q?'],
      alternativas: ['5x²y + xy² + 2', '7x²y − 9xy² + 2', '7x²y − 9xy² + 14', '4x²y − 7xy² + 10', '7x²y − 9xy² + 10'],
      datos: [DF.sem, DF.suma, DF.resta],
      solucion: [
        { texto: 'Duplico cada término de P, también el 4, y cambio el signo de cada término de Q.', ecuacion: ['2P − Q = ', P1('6x²y − 4xy² + 8'), ' ', P2('+ x²y − 5xy² + 6')] },
        { texto: 'Junto los semejantes. Con x²y: 6 + 1 = 7. Con xy²: −4 − 5 = −9. Sin letras: 8 + 6 = 14. Un término con x²y no se junta con uno de xy².', ecuacion: [RES('7x²y − 9xy² + 14')] },
        { texto: ['La ', letra('A'), ' suma Q sin cambiarle ningún signo: 5x²y + xy² + 2. La ', letra('B'), ' no le cambia el signo al −6: 8 − 6 = 2.'] },
        { texto: ['La ', letra('D'), ' olvida duplicar P: 4x²y − 7xy² + 10. La ', letra('E'), ' duplica todo menos el 4: 4 + 6 = 10.'] },
      ],
      respuesta: [letra('C'), ', ', RES('7x²y − 9xy² + 14')] },
    { nivel: 3, titulo: 'Tres pedidos y una devolución',
      enunciado: ['Rubén hace 3 pedidos iguales de ', P1('2x² + x + 4'), ' dm² y devuelve piezas por ', P2('x² + 3x + 5'), ' dm². ¿Qué polinomio dice cuánto cubre lo que le queda?'],
      alternativas: ['5x² + 6x + 17', '5x² + 7', 'x² − 2x − 1', '12x²', '5x² − 2x − 1'],
      datos: [DF.suma, DF.resta],
      figura: LO({ objeto: 'pedido', filas: [{ nombre: 'Cada pedido (son 3)', cuenta: [2, 1, 4], color: 'o', rotulo: false }, { nombre: 'Devuelve', cuenta: [1, 3, 5], color: 'i', rotulo: false }] }),
      solucion: [
        { texto: 'Tres pedidos iguales triplican cada término: 3 · 2 = 6, 3 · 1 = 3 y 3 · 4 = 12.', ecuacion: ['3 · (', P1('2x² + x + 4'), ') = ', P1('6x² + 3x + 12')] },
        { texto: 'Devolver es restar: cada término devuelto cambia de signo. Junto los semejantes; las tiras se anulan.', ecuacion: [P1('6x² + 3x + 12'), ' ', P2('− x² − 3x − 5'), ' = ', RES('5x² + 7')] },
        { texto: ['La ', letra('A'), ' resta solo las losetas y suma lo demás: 3x + 3x, 12 + 5. La ', letra('D'), ' junta 5x² con 7, que no son semejantes.'] },
        { texto: ['La ', letra('C'), ' no triplica el pedido: x² − 2x − 1. La ', letra('E'), ' triplica solo las losetas: 6x² + x + 4 − x² − 3x − 5.'] },
      ],
      respuesta: [letra('B'), ', ', RES('5x² + 7'), ' dm²'] },
  ];

  // «Mira»: la pieza de x por y, girada, y al final la tira y la loseta que no se juntan (la situación de la predicción).
  const MIRA_GIRO = { objeto: 'giro', a: 2, b: 3, pasos: [
    { a: 1, b: 0 }, { a: 1, b: 1, igual: true }, { a: 2, b: 3 }, { a: 2, b: 3, juntas: true },
    { objeto: 'pedido', filas: [{ nombre: 'Tiras', cuenta: [0, 3, 0], color: 'o', rotulo: '3x' }, { nombre: 'Losetas', cuenta: [2, 0, 0], color: 'i', rotulo: '2x²' }], juntos: true, terminos: true },
  ] };
  const semejantes = {
    id: 'terminos-semejantes',
    titulo: 'Términos semejantes',
    pregunta: '¿Qué términos de un polinomio se pueden juntar en uno solo?',
    temas: ['Operaciones con polinomios'],
    pieza: 'alg-losetas',
    aprendizaje: 'Solo se juntan los términos semejantes, los de la misma parte literal: se suman los coeficientes y la parte literal queda igual.',
    actividad: 'Juntar dos pedidos de losetas y contar las piezas de cada forma.',
    // Lee: las tres piezas, lo que cubre cada una y el vocabulario (polinomio, término, coeficiente, parte literal). No dice
    // qué se junta con qué (es el juego) ni nada de dos letras (es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'El pedido de Rubén', texto: 'El maestro Rubén pone el piso de un patio en Juliaca. La tienda vende tres piezas: la loseta cuadrada, la tira y el cuadradito. La loseta viene en varios tamaños; por eso su lado se escribe con una letra: mide x dm.',
          pieza: 'alg-losetas', dibujo: LO({ objeto: 'piezas' }) },
        { titulo: 'Lo que cubre cada pieza', texto: 'Una loseta cubre x · x = x² dm². Una tira, de x por 1, cubre x dm². Un cuadradito cubre 1 dm². Si x cambia, cambia lo que cubren la loseta y la tira, pero no el cuadradito.',
          pieza: 'alg-losetas', dibujo: LO({ objeto: 'piezas', areas: true }) },
        { titulo: 'Un pedido es un polinomio', texto: 'Un pedido de 2 losetas, 3 tiras y 4 cuadraditos cubre 2x² + 3x + 4 dm². Esa suma es un polinomio y cada sumando es un término. En 2x², el 2 es el coeficiente (cuántas piezas) y x² es la parte literal (qué pieza).',
          ecuacion: [{ llave: ['2'], nota: 'coeficiente' }, { llave: ['x²'], nota: 'parte literal' }, ' + 3x + 4'],
          pieza: 'alg-losetas', dibujo: LO({ objeto: 'pedido', filas: [{ nombre: 'Pedido', cuenta: [2, 3, 4] }] }) },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a juntar dos pedidos de Rubén en uno solo. Mira qué piezas terminan en el mismo montón y cuáles nunca se mezclan. Fíjate qué número cambia abajo cuando agregas una pieza.' },
      ],
    },
    ejemplos: EJEMPLOS_SEMEJANTES,
    juega: {
      pieza: 'alg-losetas',
      consigna: 'Rubén junta dos pedidos de piezas para el mismo patio.',
      mision: {
        texto: ['Completa el ', P2('pedido 2'), ' para que los dos juntos cubran 3x² + 7x + 5.'],
        logrado: v => v.l === 1 && v.t === 4 && v.c === 4,
        bien: 'Listo: losetas con losetas y tiras con tiras. Ningún montón se mezcla con otro.',
      },
      voz: 'Agrega piezas de una en una y mira dónde caen.',
      leyenda: [
        { s: 'x', t: 'lado de la loseta, en dm' },
        { s: P1('2x²'), t: 'lo que cubren 2 losetas' },
        { s: P1('3x'), t: 'lo que cubren 3 tiras' },
        { s: P1('1'), t: 'lo que cubre 1 cuadradito' },
        { s: P2('Pedido 2'), t: 'el que tú completas' },
        { s: 'Juntos', t: 'los dos pedidos en uno solo' },
      ],
      controles: [
        { id: 'l', etiqueta: 'Losetas del pedido 2', color: 'c-i', min: 0, max: 2, paso: 1, inicio: 0, decimales: 0 },
        { id: 't', etiqueta: 'Tiras del pedido 2', color: 'c-i', min: 0, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'c', etiqueta: 'Cuadraditos del pedido 2', color: 'c-i', min: 0, max: 4, paso: 1, inicio: 1, decimales: 0 },
      ],
      // tope: las columnas se reservan para el pedido más grande del juego (4 losetas, 7 tiras, 5 cuadraditos): al
      // agregar una pieza nada se corre ni cambia de escala.
      dibujo: v => pedido(PED1, [v.l, v.t, v.c], { juntos: true, terminos: true, tope: TOPE_J }),
      // La relación: pedido 1 más pedido 2 da los dos juntos, forma por forma.
      lectura: v => ['(', P1(poli(PED1)), ') + (', P2(poli([v.l, v.t, v.c])), ') = ', RES(poli(sumaV(PED1, [v.l, v.t, v.c])))],
      minimo: 3,
    },
    predice: {
      pregunta: ['En otro pedido hay piezas rectangulares de x dm por y dm. Rubén apunta 2 de ellas como ', P1('2xy'), '. Su ayudante apunta otras 3, giradas, como ', P2('3yx'), '. ¿A qué es igual 2xy + 3yx?'],
      datos: ['Cada pieza es un rectángulo de x dm por y dm', 'xy quiere decir x · y; yx quiere decir y · x'],
      voz: 'Piensa cuánto cubre cada pieza antes de elegir.',
      opciones: [
        { id: 'c', texto: '5xy', correcta: true },
        { id: 'orden', texto: 'No se pueden juntar', error: 'TAL-ORDEN', siFuera: 'Bien que no juntes términos distintos. Pero y · x cubre lo mismo que x · y: es la misma pieza.' },
        { id: 'potencia', texto: '5x²y²', error: 'TAL-SUMA-POT', siFuera: 'Bien el 5: 2 + 3. Pero al sumar, las letras no se multiplican: la pieza sigue siendo xy.' },
        { id: 'producto', texto: '6xy', error: 'TAL-SUMA-MULT', siFuera: 'Bien la parte literal, xy. Pero las piezas se cuentan: 2 más 3 son 5, no 2 · 3.' },
      ],
      dibujo: LO({ objeto: 'giro', a: 2, b: 3 }),
      revelar: LO({ objeto: 'giro', a: 2, b: 3, juntas: true }),
      coincide: 'Coincide: girada, la pieza cubre lo mismo. Son 2 + 3 = 5 piezas iguales: 5xy.',
      noCoincide: 'Revisemos: gira una pieza de y por x y compárala con una de x por y.',
    },
    mira: {
      pieza: 'alg-losetas',
      datos: MIRA_GIRO,
      voz: 'Giremos una pieza y veamos cuánto cubre.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Una pieza de x por y cubre x · y.', ecuacion: ['x · y = ', P1('xy')] },
        { estado: { paso: 1 }, texto: 'Girada mide y por x. Cubre lo mismo: es la misma pieza.', ecuacion: [P2('yx'), ' = y · x = x · y = ', P1('xy')] },
        { estado: { paso: 2 }, texto: 'Rubén apuntó 2 y su ayudante, 3. Todas son la misma pieza.', ecuacion: [P1('2xy'), ' + ', P2('3yx')] },
        { estado: { paso: 3 }, texto: 'Son términos semejantes: se suman los coeficientes y la parte literal queda igual.', ecuacion: [P1('2xy'), ' + ', P2('3yx'), ' = (', P1(2), ' + ', P2(3), ')xy = ', RES('5xy')] },
        { estado: { paso: 4 }, texto: 'Una tira y una loseta no son la misma pieza: no se juntan.', ecuacion: [P1('3x'), ' + ', P2('2x²'), ' no es 5x³'] },
        { estado: { paso: 4 }, texto: 'Restar un polinomio es quitar cada término: el − cambia el signo de todos.', ecuacion: ['(4x² + 3x) − (2x² − x) = 4x² + 3x − 2x² + x = ', RES('2x² + 4x')] },
      ],
    },
    regla: {
      texto: 'Son semejantes los términos con la misma parte literal: las mismas letras con los mismos exponentes, en cualquier orden. Solo ellos se juntan: se suman los coeficientes.',
      ecuacion: [aa, 'xᵐyⁿ + ', bb, 'xᵐyⁿ = ', { llave: ['(', aa, ' + ', bb, ')'], nota: 'se suman los coeficientes', color: 'c-f' }, 'xᵐyⁿ', SEP,
        '−(2x² − x) = ', { llave: ['−2x² + x'], nota: 'al restar, cambia cada signo', color: 'c-f' }],
      // La app antepone «Vale si».
      condicion: 'a y b son números cualesquiera, también negativos, y xᵐyⁿ es la misma parte literal en los dos (yx es xy).',
      voz: 'Misma parte literal, mismo montón. Las demás no se mezclan.',
      dibujo: pedido(PED1, [1, 4, 4], { juntos: true, terminos: true, tope: TOPE_J }),
    },
    // Así se resuelve: varios pedidos iguales y uno más (un número por un polinomio es una suma repetida). «Ahora tú»
    // pide otra cosa: reducir, sumar, restar, dos letras o exponentes por hallar.
    resuelve: {
      pieza: 'alg-losetas',
      generar(s) {
        const r = azar(s + 900), k = 2 + (s % 2);
        const A = [r.ent(1, 2), r.ent(1, 3), r.ent(1, 3)], B = [r.ent(0, 1), r.ent(1, 4), r.ent(1, 5)];
        const kA = A.map(a => k * a), T = sumaV(kA, B), suma = v => v.reduce((x, y) => x + y, 0);
        return {
          enunciado: ['Rubén hace ', String(k), ' pedidos iguales de ', P1(poli(A)), ' dm² y uno más de ', P2(poli(B)), ' dm². ¿Qué polinomio dice cuánto cubren todos juntos?'],
          datos: [DF.sem, DF.suma],
          // El pedido que se repite va dibujado k veces (lector A, 19 nov: con una sola fila se contaba una copia).
          dibujo: LO({ objeto: 'pedido', filas: [...Array.from({ length: k }, (_, i) => ({ nombre: `Pedido igual ${i + 1}`, cuenta: A, color: 'o', rotulo: false })), { nombre: 'Uno más', cuenta: B, color: 'i', rotulo: false }] }),
          pasos: [
            { tipo: 'pide', texto: 'Piden un solo polinomio: lo que cubren todos los pedidos juntos, con cada forma en su montón.' },
            { tipo: 'regla', texto: 'Solo se juntan los términos semejantes: los de x² entre sí, los de x entre sí y los números entre sí. De cada clase se suman los coeficientes.', ecuacion: DF.suma },
            { tipo: 'cuentas', texto: `${k} pedidos iguales son ${k} veces cada montón: se multiplica cada coeficiente por ${k}. Después sumo el otro pedido, clase por clase.`,
              ecuacion: [`${k} · (`, P1(poli(A)), ') + ', P2(poli(B)), ' = ', P1(poli(kA)), ' + ', P2(poli(B)), ' = ', RES(poli(T))] },
            { tipo: 'sentido', texto: `Lo reviso contando piezas: ${k} · ${suma(A)} + ${suma(B)} = ${k * suma(A) + suma(B)} piezas, y los coeficientes del resultado suman ${T.join(' + ')} = ${suma(T)}. Cuadra.` },
          ],
          respuesta: [RES(poli(T)), ' dm²'],
        };
      },
    },
    ahoraTu: {
      pieza: 'alg-losetas',
      voz: 'Primero mira la parte literal de cada término; después, los signos.',
      generar(sem) {
        const r = azar(sem + 31), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoReduce, r);
        if (tipo === 1) return conCuatro(casoSuma, r);
        if (tipo === 2) return conCuatro(casoResta, r);
        if (tipo === 3) return conCuatro(casoDosLetras, r);
        return conCuatro(casoExponentes, r);
      },
    },
  };

  // ---------- Idea 2 (fase 3, 19 nov): valor numérico ----------
  // Objeto: el mismo pedido de Rubén, 2x² + 3x + 4, con losetas de otro tamaño (alg-losetas, 'tamano'): la loseta y la
  // tira crecen con el lado; el cuadradito no. x es el lado elegido y P(x), lo que cubre el pedido.
  // Cambia: el lado de la loseta (2 a 6 dm) · Permanece: el pedido · Progresa: lo que cubre cada grupo y el total ·
  // Se reserva: x = 1 y x = 0 (la predicción: con losetas de 1 dm, cada pieza cubre 1 dm²) · Debe verse: cada x se cambia
  // por el mismo número; el término sin x no cambia.
  // Colores: el número que entra en lugar de x, naranja (valor de x); P(k) ya calculado, violeta; P y las letras, tinta.
  // Errores: PO12 confunde P(1) con P(0) (trampa 44 de San Marcos) · PO20 se queda con el coeficiente principal ·
  // TAL-INDEP-FUERA deja fuera el término independiente · PO15 lee una potencia par de un negativo como negativa ·
  // TAL-IMPAR-POS lee una potencia impar de un negativo como positiva · TAL-SIGNO-X evalúa en el opuesto · PO7 da la suma
  // de coeficientes · PO21 suma los coeficientes sin signo · TAL-PIDE responde otra cosa (el coeficiente hallado) ·
  // TAL-DATO-REPITE repite el valor dado · TAL-DESPLAZA evalúa P(x + h) como si fuera P(x) · TAL-DESPLAZA-SIGNO despeja x
  // al revés · TAL-FACTOR-SIGNO cambia los signos de los factores · TAL-SOLO-UNO evalúa solo una parte.
  const VX = t => ficha('valor de x')(typeof t === 'number' ? f(t) : t);   // −2 con el signo menos de verdad
  const PEDV = [2, 3, 4];   // el pedido del juego: 2x² + 3x + 4
  const TAM = (cuenta, lado, extra) => LO(Object.assign({ objeto: 'tamano', filas: [{ nombre: 'Pedido', cuenta }], lado }, extra));
  const DV = {
    eval: 'P(k) es el valor de P cuando x vale k: cada x se cambia por k',
    neg: 'Con un número negativo: (−2)² = 4 y (−2)³ = −8',
    pot: 'x² = x · x;  x³ = x · x · x',
    cubre: 'Una loseta de x dm de lado cubre x² dm²; una tira, x dm²; un cuadradito, 1 dm²',
    coef: 'Coeficiente: el número que multiplica a las letras de un término; el término sin letras es su propio coeficiente',
    indep: 'Término independiente: el término sin x',
    desplaza: 'Con P(x + h) dado, P(k) sale del x que cumple x + h = k',
    suma: 'Suma de coeficientes de P: P(1)',
    p0: 'Término independiente de P: P(0)',
  };
  // Lo que se escribe al reemplazar: «2 · (−2)³ − 1 · (−2) + 6».
  function reemplazo(cs, k) {
    const n = cs.length - 1, out = [];
    cs.forEach((c, i) => {
      if (c === 0) return;
      const e = n - i, sg = c < 0 ? (out.length ? ' − ' : '−') : (out.length ? ' + ' : ''), m = Math.abs(c);
      const base = par(k), cuerpo = e === 0 ? f(m) : `${m === 1 ? '' : f(m) + ' · '}${base}${e > 1 ? sup(e) : ''}`;
      out.push(sg + cuerpo);
    });
    return out.join('') || '0';
  }
  const cuentaV = (cs, k) => { const n = cs.length - 1; return cs.map((c, i) => c * k ** (n - i)).filter((v, i) => cs[i] !== 0); };
  const sumaTxt = vs => vs.map((v, i) => (i ? (v < 0 ? ` − ${f(-v)}` : ` + ${f(v)}`) : f(v))).join('');

  // Ahora tú 1: evaluar con un número negativo.
  function casoNegativo(r, grado = 3) {
    const cs = [grado === 3 ? r.noCero(-3, 3) : 0, grado === 3 ? r.ent(-4, 4) : r.noCero(-3, 3), r.noCero(-4, 4), r.ent(-6, 6)], k = r.uno([-1, -2, -3]);
    const bien = evaluar(cs, k);
    const parMal = cs.reduce((a, c, i) => { const e = 3 - i; return a + c * (e % 2 === 0 && e > 0 ? -((-k) ** e) : k ** e); }, 0);
    const imparMal = cs.reduce((a, c, i) => { const e = 3 - i; return a + c * (e % 2 === 1 ? (-k) ** e : k ** e); }, 0);
    return {
      pregunta: ['Si P(x) = ', poli(cs), ', ¿cuánto vale P(', VX(k), ')?'],
      datos: [DV.eval, DV.neg],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'par', texto: f(parMal), error: 'PO15', siFuera: `Bien el reemplazo. Pero una potencia par de un negativo es positiva: (${f(k)})² = ${k * k}.` },
        { id: 'impar', texto: f(imparMal), error: 'TAL-IMPAR-POS', siFuera: `Bien la potencia par. Pero una potencia impar de un negativo es negativa: (${f(k)})³ = ${f(k ** 3)}.` },
        { id: 'opuesto', texto: f(evaluar(cs, -k)), error: 'TAL-SIGNO-X', siFuera: `Ese es P(${f(-k)}). El número entra con su signo: x vale ${f(k)}.` },
        { id: 'p1', texto: f(evaluar(cs, 1)), error: 'PO7', siFuera: 'Esa es la suma de los coeficientes, P(1). Aquí x vale otro número.' },
      ]),
      solucion: { texto: `Cada x se cambia por ${f(k)}, entre paréntesis.`, ecuacion: ['P(', VX(k), `) = ${reemplazo(cs, k)} = `, RES(f(bien))] },
    };
  }
  // Ahora tú 2: P(1) y P(0) juntos (la trampa de San Marcos 2023-I).
  function casoUnoCero(r) {
    const cs = [r.noCero(-4, 5), r.noCero(-5, 5), r.ent(-5, 5), r.noCero(-7, 7)], suma = r.ent(0, 1) === 1;
    const p1 = evaluar(cs, 1), p0 = cs[3], bien = suma ? p1 + p0 : p1 - p0;
    const abs = cs.reduce((a, c) => a + Math.abs(c), 0);
    return {
      pregunta: ['Si P(x) = ', poli(cs), `, ¿cuánto vale P(1) ${suma ? '+' : '−'} P(0)?`],
      datos: [DV.eval, DV.indep],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'p1', texto: f(p1), error: 'TAL-SOLO-UNO', siFuera: `Bien P(1) = ${f(p1)}. Pero falta ${suma ? 'sumarle' : 'restarle'} P(0) = ${f(p0)}.` },
        { id: 'cruza', texto: f(suma ? 2 * p0 : 0), error: 'PO12', siFuera: `Bien P(0) = ${f(p0)}. Pero P(1) no es el término independiente: con x = 1 cuentan todos los coeficientes.` },
        { id: 'abs', texto: f(suma ? abs + p0 : abs - p0), error: 'PO21', siFuera: 'Bien P(0). Pero en P(1) cada coeficiente va con su signo: uno negativo resta.' },
      ]),
      solucion: { texto: 'Con x = 1 cada potencia vale 1; con x = 0 solo queda el término sin x.', ecuacion: [`P(1) = ${f(p1)},  P(0) = ${f(p0)},  `, `${par(p1)} ${suma ? '+' : '−'} ${par(p0)} = `, RES(f(bien))] },
    };
  }
  // Ahora tú 3: la forma factorizada, en dos valores (San Marcos 2026-II).
  function casoFactorizada(r) {
    let p, q, s, u, v;
    do { p = r.ent(1, 4); q = r.ent(1, 4); s = r.ent(1, 4); u = r.ent(-3, 4); v = r.ent(-3, 4); } while (u === v || u === 0 || v === 0 || new Set([p, -q, s]).size < 3);
    const F = x => (x - p) * (x + q) * (x - s), G = x => (x + p) * (x - q) * (x + s);
    const bien = F(u) + F(v);
    const fac = ['(x − ', String(p), ')(x + ', String(q), ')(x − ', String(s), ')'].join('');
    return {
      pregunta: ['Si P(x) = ', fac, ', ¿cuánto vale P(', VX(u), ') + P(', VX(v), ')?'],
      datos: [DV.eval, DV.neg],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'signos', texto: f(G(u) + G(v)), error: 'TAL-FACTOR-SIGNO', siFuera: `Bien el reemplazo. Pero en x − ${p} el número se resta: con x = ${f(u)} queda ${f(u)} − ${p}.` },
        { id: 'uno', texto: f(F(u)), error: 'TAL-SOLO-UNO', siFuera: `Bien P(${f(u)}) = ${f(F(u))}. Pero falta sumarle P(${f(v)}).` },
        { id: 'abs', texto: f(Math.abs(F(u)) + Math.abs(F(v))), error: 'PO21', siFuera: 'Bien cada producto. Pero cada valor va con su signo: uno negativo resta.' },
      ]),
      solucion: { texto: 'Se reemplaza x en cada factor y se multiplica.', ecuacion: [`P(${f(u)}) = ${f(F(u))},  P(${f(v)}) = ${f(F(v))},  suma `, RES(f(bien))] },
    };
  }
  // Ahora tú 4: un coeficiente desconocido que sale de un valor dado (San Marcos 2024-II: piden otra cosa).
  function casoCoeficiente(r) {
    let a, k, b, c, t, u;
    do { a = r.ent(1, 3); k = r.noCero(-4, 4); b = r.noCero(-4, 4); c = r.noCero(-6, 6); t = r.uno([1, 2, -1]); u = r.uno([-2, -1, 2, 3]); } while (t === u);
    const cs = [a, k, b, c], V = evaluar(cs, t), bien = evaluar(cs, u);
    const kMal = -k;   // despeje con el signo cambiado
    return {
      pregunta: [`P(x) = ${mono(a, [['x', 3]], true)} + kx²${mono(b, [['x', 1]], false)}${mono(c, [], false)} cumple P(`, VX(t), `) = ${f(V)}. ¿Cuánto vale P(`, VX(u), ')?'],
      datos: [DV.eval, DV.neg],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'k', texto: f(k), error: 'TAL-PIDE', siFuera: `Bien hallado k = ${f(k)}. Pero piden P(${f(u)}): falta evaluar con ese k.` },
        { id: 'signo', texto: f(evaluar([a, kMal, b, c], u)), error: 'AL16', siFuera: `Bien la ecuación de k. Pero al despejar, el número pasa con el signo cambiado: k = ${f(k)}.` },
        { id: 'dato', texto: f(V), error: 'TAL-DATO-REPITE', siFuera: `${f(V)} es P(${f(t)}), el dato. Con x = ${f(u)} el valor cambia.` },
      ]),
      solucion: { texto: `Con x = ${f(t)} sale una ecuación en k; con ese k se evalúa en ${f(u)}.`, ecuacion: [`k = ${f(k)},  P(`, VX(u), `) = ${reemplazo(cs, u)} = `, RES(f(bien))] },
    };
  }
  // Ahora tú 5 (examen): el argumento desplazado (San Marcos 2025-II).
  function casoDesplazado(r) {
    const h = r.noCero(-3, 3), A = r.ent(1, 3), B = r.noCero(-6, 6), C = r.noCero(-8, 8), pide = r.uno(['p1', 'p0', 'suma']);
    const Q = x => A * x * x + B * x + C;   // Q(x) = P(x + h)
    const P = k => Q(k - h);
    const bien = pide === 'p1' ? P(1) : pide === 'p0' ? P(0) : P(0) + P(1);
    const mal = pide === 'p1' ? Q(1) : pide === 'p0' ? Q(0) : Q(0) + Q(1);
    const rev = pide === 'p1' ? Q(1 + h) : pide === 'p0' ? Q(h) : Q(h) + Q(1 + h);
    const txtH = h > 0 ? `x + ${h}` : `x − ${-h}`;
    const que = pide === 'p1' ? 'la suma de los coeficientes de P' : pide === 'p0' ? 'el término independiente de P' : 'la suma de los coeficientes de P más su término independiente';
    return {
      pregunta: [`Si P(${txtH}) = ${poli([A, B, C])}, ¿cuánto vale ${que}?`],
      datos: [DV.desplaza, DV.suma, DV.p0],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'directo', texto: f(mal), error: 'TAL-DESPLAZA', siFuera: `Bien x = 1 o x = 0. Pero lo dado es P(${txtH}): falta despejar ese x.` },
        { id: 'reves', texto: f(rev), error: 'TAL-DESPLAZA-SIGNO', siFuera: pide === 'p0' ? `Bien la idea de cambiar x. Pero ${txtH} = 0 da x = ${f(-h)}: despejaste al revés.` : `Bien la idea de cambiar x. Pero ${txtH} = 1 da x = ${f(1 - h)}: despejaste al revés.` },
        pide === 'suma'
          ? { id: 'solo', texto: f(P(1)), error: 'TAL-SOLO-UNO', siFuera: `Bien P(1) = ${f(P(1))}. Pero falta sumarle el término independiente, P(0).` }
          : { id: 'solo', texto: f(pide === 'p1' ? P(0) : P(1)), error: 'PO12', siFuera: 'Ese valor es el otro: la suma de coeficientes es P(1) y el término independiente, P(0).' },
      ]),
      solucion: { texto: `${pide === 'p0' ? 'P(0)' : 'P(1)'} sale con el x que cumple ${txtH} = ${pide === 'p0' ? 0 : 1}.`,
        ecuacion: [pide === 'p0' ? `x = ${f(-h)}: P(0) = ` : pide === 'p1' ? `x = ${f(1 - h)}: P(1) = ` : `P(1) = ${f(P(1))},  P(0) = ${f(P(0))},  suma `, RES(f(bien))] },
    };
  }

  // Ejemplos resueltos de la idea 2. Cuentas rehechas aparte (e5-algebra/cuentas-fase3.py, que lee los textos y evalúa
  // por su cuenta): P(4) de 3x² + 2x + 5 = 61; x² − 3x + 2 en 5 = 12; 5x − 2 en 0 = −2; x² + 4 en −3 = 13; x³ − 2x en 2 =
  // 4; P(1) de 3x³ − 5x² + x − 4 = −5; 2x³ − x + 6 en −2 = −8; P(3) + P(0) de x² − 4x + 1 = −1; x² + 2x + 3: 38 − 18 = 20;
  // (x − 1)(x + 4) en 3 = 14; k = 3 y P(−2) = 1 (errores 3, −23, 33 y 7); P(x + 1) = x² + 4x + 6: P(1) = 6, P(0) = 3,
  // suma 9 (errores 17, 6, 3 y 29); (x − 1)(x + 2)(x − 3): P(2) + P(−1) = −4 + 8 = 4 (errores −4, 8, 12 y 0);
  // (2x − 1)³ + (x + 2)² − 3: 7 + 0 = 7 (errores 0, 1, 9 y 14); b = 6 y P(5) = 85 (errores 6, 45, 80 y 61).
  const EJEMPLOS_VALOR = [
    { nivel: 1, titulo: 'Losetas de 4 dm',
      enunciado: 'Un pedido de Rubén cubre 3x² + 2x + 5 dm², con x el lado de la loseta en dm. Compra losetas de 4 dm de lado. ¿Cuántos dm² cubre el pedido?',
      datos: [DV.eval, DV.cubre],
      figura: TAM([3, 2, 5], 4, { total: '?' }),
      solucion: [{ texto: 'Cada x se cambia por 4: las losetas cubren 3 · 4² = 48, las tiras 2 · 4 = 8 y los cuadraditos 5.', ecuacion: ['P(', VX(4), ') = 3 · 4² + 2 · 4 + 5 = 48 + 8 + 5 = ', RES('61')] }],
      respuesta: [RES('61'), ' dm²'] },
    { nivel: 1, titulo: 'Un valor positivo',
      enunciado: 'Si P(x) = x² − 3x + 2, ¿cuánto vale P(5)?',
      datos: [DV.eval],
      solucion: [{ texto: 'Se cambia cada x por 5. Primero la potencia, después el producto y al final la suma.', ecuacion: ['P(', VX(5), ') = 5² − 3 · 5 + 2 = 25 − 15 + 2 = ', RES('12')] }],
      respuesta: ['P(5) = ', RES('12')] },
    { nivel: 1, titulo: 'El valor en cero',
      enunciado: 'Si P(x) = 5x − 2, ¿cuánto vale P(0)?',
      datos: [DV.eval],
      solucion: [{ texto: 'Con x = 0, el término 5x vale 5 · 0 = 0. Queda solo el término sin x.', ecuacion: ['P(', VX(0), ') = 5 · 0 − 2 = ', RES('−2')] }],
      respuesta: ['P(0) = ', RES('−2')] },
    { nivel: 1, titulo: 'Un valor negativo',
      enunciado: 'Si P(x) = x² + 4, ¿cuánto vale P(−3)?',
      datos: [DV.eval, DV.neg],
      solucion: [{ texto: 'El −3 entra entre paréntesis: (−3)² = (−3) · (−3) = 9, que es positivo.', ecuacion: ['P(', VX(-3), ') = (−3)² + 4 = 9 + 4 = ', RES('13')] }],
      respuesta: ['P(−3) = ', RES('13')] },
    { nivel: 1, titulo: 'Con un cubo',
      enunciado: 'Si P(x) = x³ − 2x, ¿cuánto vale P(2)?',
      datos: [DV.eval, DV.pot],
      solucion: [{ texto: 'Con x = 2: x³ = 2 · 2 · 2 = 8 y 2x = 2 · 2 = 4.', ecuacion: ['P(', VX(2), ') = 2³ − 2 · 2 = 8 − 4 = ', RES('4')] }],
      respuesta: ['P(2) = ', RES('4')] },
    { nivel: 2, titulo: 'La suma de los coeficientes',
      enunciado: '¿Cuánto suman los coeficientes de P(x) = 3x³ − 5x² + x − 4?',
      datos: [DV.coef, DV.eval],
      solucion: [
        { texto: 'Con x = 1 cada potencia vale 1: P(1) deja solo los coeficientes, cada uno con su signo.', ecuacion: ['P(', VX(1), ') = 3 · 1 − 5 · 1 + 1 − 4'] },
        { texto: 'El término x lleva coeficiente 1. Sumo con los signos: 3 − 5 + 1 − 4.', ecuacion: ['3 − 5 + 1 − 4 = ', RES('−5')] },
      ],
      respuesta: [RES('−5')] },
    { nivel: 2, titulo: 'Un cubo negativo',
      enunciado: 'Si P(x) = 2x³ − x + 6, ¿cuánto vale P(−2)?',
      datos: [DV.eval, DV.neg],
      solucion: [
        { texto: 'Cambio cada x por (−2). La potencia impar de un negativo es negativa: (−2)³ = −8.', ecuacion: ['P(', VX(-2), ') = 2 · (−8) − (−2) + 6'] },
        { texto: 'Restar −2 es sumar 2.', ecuacion: ['−16 + 2 + 6 = ', RES('−8')] },
      ],
      respuesta: ['P(−2) = ', RES('−8')] },
    { nivel: 2, titulo: 'Dos valores juntos',
      enunciado: 'Si P(x) = x² − 4x + 1, ¿cuánto vale P(3) + P(0)?',
      datos: [DV.eval],
      solucion: [
        { texto: 'Con x = 3: 9 − 12 + 1. Con x = 0 solo queda el término sin x.', ecuacion: ['P(', VX(3), ') = 9 − 12 + 1 = −2,   P(', VX(0), ') = 1'] },
        { texto: 'Sumo los dos valores, cada uno con su signo.', ecuacion: ['−2 + 1 = ', RES('−1')] },
      ],
      respuesta: [RES('−1')] },
    { nivel: 2, titulo: 'Losetas más grandes',
      enunciado: 'Un pedido cubre x² + 2x + 3 dm², con x el lado de la loseta en dm. ¿Cuántos dm² más cubre con losetas de 5 dm que con losetas de 3 dm?',
      datos: [DV.eval, DV.cubre],
      figura: TAM([1, 2, 3], 'x'),
      solucion: [
        { texto: 'Evalúo el mismo pedido con los dos lados.', ecuacion: ['P(', VX(5), ') = 25 + 10 + 3 = 38,   P(', VX(3), ') = 9 + 6 + 3 = 18'] },
        { texto: 'La diferencia es lo que cubre de más. Los 3 cuadraditos cubren lo mismo con los dos lados.', ecuacion: ['38 − 18 = ', RES('20')] },
      ],
      respuesta: [RES('20'), ' dm²'] },
    { nivel: 2, titulo: 'Con factores',
      enunciado: 'Si P(x) = (x − 1)(x + 4), ¿cuánto vale P(3)?',
      datos: [DV.eval],
      solucion: [
        { texto: 'No hace falta desarrollar: se cambia x por 3 en cada paréntesis.', ecuacion: ['P(', VX(3), ') = (3 − 1)(3 + 4) = 2 · 7'] },
        { texto: 'Multiplico los dos factores.', ecuacion: ['2 · 7 = ', RES('14')] },
      ],
      respuesta: ['P(3) = ', RES('14')] },
    { nivel: 3, titulo: 'Un coeficiente que falta',
      enunciado: 'P(x) = 2x³ + kx² − x + 3 cumple P(1) = 7. ¿Cuánto vale P(−2)?',
      alternativas: ['1', '3', '−23', '33', '7'],
      datos: [DV.eval, DV.neg],
      solucion: [
        { texto: 'Con x = 1 sale una ecuación en k: 2 + k − 1 + 3 = 7.', ecuacion: ['4 + k = 7  →  k = 3'] },
        { texto: 'Con k = 3 evalúo en −2: (−2)³ = −8 y (−2)² = 4.', ecuacion: ['P(', VX(-2), ') = 2 · (−8) + 3 · 4 − (−2) + 3 = −16 + 12 + 2 + 3 = ', RES('1')] },
        { texto: ['La ', letra('B'), ' responde k = 3, que no es lo que piden. La ', letra('E'), ' repite el dato, P(1) = 7.'] },
        { texto: ['La ', letra('C'), ' toma (−2)² como −4: −16 − 12 + 2 + 3 = −23. La ', letra('D'), ' toma (−2)³ como 8: 16 + 12 + 2 + 3 = 33.'] },
      ],
      respuesta: [letra('A'), ', ', RES('1')] },
    { nivel: 3, titulo: 'El argumento desplazado',
      enunciado: 'Si P(x + 1) = x² + 4x + 6, ¿cuánto vale la suma de los coeficientes de P más su término independiente?',
      alternativas: ['17', '6', '3', '29', '9'],
      datos: [DV.desplaza, DV.suma, DV.p0],
      solucion: [
        { texto: 'P(1) pide x + 1 = 1, o sea x = 0. P(0) pide x + 1 = 0, o sea x = −1.', ecuacion: ['P(1) = 0 + 0 + 6 = 6,   P(0) = 1 − 4 + 6 = 3'] },
        { texto: 'Sumo los dos.', ecuacion: ['6 + 3 = ', RES('9')] },
        { texto: ['La ', letra('A'), ' evalúa x² + 4x + 6 en 1 y en 0, como si fuera P(x): 11 + 6. La ', letra('D'), ' despeja al revés, x = 2 y x = 1: 18 + 11.'] },
        { texto: ['La ', letra('B'), ' da solo P(1) y la ', letra('C'), ', solo P(0).'] },
      ],
      respuesta: [letra('E'), ', ', RES('9')] },
    { nivel: 3, titulo: 'Dos valores con factores',
      enunciado: 'Si P(x) = (x − 1)(x + 2)(x − 3), ¿cuánto vale P(2) + P(−1)?',
      alternativas: ['−4', '8', '4', '12', '0'],
      datos: [DV.eval],
      solucion: [
        { texto: 'Reemplazo en cada factor y multiplico, con los signos.', ecuacion: ['P(', VX(2), ') = 1 · 4 · (−1) = −4,   P(', VX(-1), ') = (−2) · 1 · (−4) = 8'] },
        { texto: 'Sumo los dos valores.', ecuacion: ['−4 + 8 = ', RES('4')] },
        { texto: ['La ', letra('A'), ' da solo P(2) y la ', letra('B'), ', solo P(−1). La ', letra('D'), ' suma sin los signos: 4 + 8 = 12.'] },
        { texto: ['La ', letra('E'), ' cambia los signos de los factores, (x + 1)(x − 2)(x + 3): con x = 2 y con x = −1 sale 0 las dos veces.'] },
      ],
      respuesta: [letra('C'), ', ', RES('4')] },
    { nivel: 3, titulo: 'Coeficientes sin desarrollar',
      enunciado: 'P(x) = (2x − 1)³ + (x + 2)² − 3. ¿Cuánto vale la suma de sus coeficientes más su término independiente?',
      alternativas: ['0', '1', '9', '7', '14'],
      datos: [DV.eval, DV.suma, DV.p0],
      solucion: [
        { texto: 'La suma de los coeficientes es P(1), y el término independiente es P(0): no hace falta desarrollar.', ecuacion: ['P(1) = 1³ + 3² − 3 = 7,   P(0) = (−1)³ + 2² − 3 = 0'] },
        { texto: 'Sumo los dos.', ecuacion: ['7 + 0 = ', RES('7')] },
        { texto: ['La ', letra('A'), ' da solo P(0). La ', letra('B'), ' suma los números que se ven: 2 − 1 + 1 + 2 − 3 = 1.'] },
        { texto: ['La ', letra('C'), ' toma (−1)³ como 1: P(0) = 1 + 4 − 3 = 2, y 7 + 2 = 9. La ', letra('E'), ' usa P(1) dos veces: 7 + 7.'] },
      ],
      respuesta: [letra('D'), ', ', RES('7')] },
    { nivel: 3, titulo: 'De un tamaño a otro',
      enunciado: 'Con losetas de 3 dm, el pedido 2x² + bx + 5 cubre 41 dm². ¿Cuántos dm² cubre el mismo pedido con losetas de 5 dm?',
      alternativas: ['85 dm²', '6 dm²', '45 dm²', '80 dm²', '61 dm²'],
      datos: [DV.eval, DV.cubre],
      solucion: [
        { texto: 'Con x = 3 sale una ecuación en b, el número de tiras.', ecuacion: ['2 · 9 + 3b + 5 = 41  →  3b = 18  →  b = 6'] },
        { texto: 'Con b = 6 evalúo en 5.', ecuacion: ['P(', VX(5), ') = 2 · 25 + 6 · 5 + 5 = 50 + 30 + 5 = ', RES('85')] },
        { texto: ['La ', letra('B'), ' responde b = 6. La ', letra('C'), ' no eleva el lado al cuadrado: 2 · 5 + 30 + 5 = 45.'] },
        { texto: ['La ', letra('D'), ' olvida los 5 cuadraditos: 50 + 30 = 80. La ', letra('E'), ' no multiplica b por x: 50 + 6 + 5 = 61.'] },
      ],
      respuesta: [letra('A'), ', ', RES('85'), ' dm²'] },
  ];

  const valor = {
    id: 'valor-numerico',
    titulo: 'Valor numérico',
    pregunta: '¿Cuánto vale un polinomio cuando x vale 3?',
    temas: ['Valor numérico'],
    pieza: 'alg-losetas',
    aprendizaje: 'Evaluar P(k) es cambiar cada x por k y operar; P(1) es la suma de los coeficientes y P(0), el término independiente.',
    actividad: 'Cambiar el tamaño de la loseta y ver cuánto cubre el pedido.',
    // Lee: qué es evaluar, cómo se lee P(3) y el signo de un negativo. No dice qué pasa con x = 1 (es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Losetas de otro tamaño', texto: 'El pedido de Rubén cubre 2x² + 3x + 4 dm². x es una variable: una letra que puede tomar distintos valores. Cuando Rubén elige el lado, x pasa a ser un número.',
          pieza: 'alg-losetas', dibujo: TAM(PEDV, 'x') },
        { titulo: 'Cómo se lee', texto: 'El polinomio se nombra con una letra: P(x) = 2x² + 3x + 4. P(3) se lee «P de 3»: es lo que vale P cuando x vale 3. No quiere decir P por 3.' },
        { titulo: 'Con números negativos', texto: 'Como número, x también puede ser negativo. Entonces se escribe entre paréntesis para no perder el signo: (−2)² = 4, pero (−2)³ = −8.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cambiar el lado de la loseta. Mira qué piezas crecen, cuál no cambia y cuánto cubre cada grupo.' },
      ],
    },
    ejemplos: EJEMPLOS_VALOR,
    juega: {
      pieza: 'alg-losetas',
      consigna: 'El pedido de Rubén es 2x² + 3x + 4. La loseta viene en cinco tamaños: de 2 a 6 dm de lado.',
      mision: {
        texto: 'Elige el lado de la loseta para que el pedido cubra exactamente 48 dm².',
        logrado: v => v.a === 4,
        bien: 'Listo: cada x se cambió por 4. Los cuadraditos cubren lo mismo con cualquier loseta.',
      },
      voz: 'Cambia el lado y mira qué piezas crecen.',
      leyenda: [
        { s: VX('x'), t: 'lado de la loseta, en dm' },
        { s: 'P(x)', t: 'lo que cubre el pedido, en dm²' },
        { s: 'P(2)', t: 'se lee «P de 2»' },
        { s: RES('dm²'), t: 'lo que cubre, ya calculado' },
      ],
      controles: [{ id: 'a', etiqueta: 'Lado de la loseta, x (dm)', color: 'c-o', min: 2, max: 6, paso: 1, inicio: 2, decimales: 0 }],
      dibujo: v => TAM(PEDV, v.a, { areas: true, ladoMax: 6 }),
      // La relación: cada x se cambia por el lado; el 4 de los cuadraditos no cambia.
      lectura: v => ['P(', VX(v.a), ') = 2 · ', VX(v.a), '² + 3 · ', VX(v.a), ` + 4 = ${2 * v.a * v.a} + ${3 * v.a} + 4 = `, RES(`${evaluar(PEDV, v.a)} dm²`)],
      minimo: 3,
    },
    predice: {
      pregunta: ['Si las losetas midieran 1 dm de lado, ¿cuántos dm² cubriría el pedido 2x² + 3x + 4?'],
      datos: ['1² = 1 · 1 = 1', DV.cubre],
      voz: 'Piensa qué cubre cada pieza con ese lado.',
      opciones: [
        { id: 'c', texto: '9 dm²', correcta: true },
        { id: 'indep', texto: '4 dm²', error: 'PO12', siFuera: 'Bien que los 4 cuadraditos cubran 4 dm². Pero con x = 1 las losetas y las tiras también cubren algo.' },
        { id: 'fuera', texto: '5 dm²', error: 'TAL-INDEP-FUERA', siFuera: 'Bien las 2 losetas y las 3 tiras. Pero faltan los 4 cuadraditos, que también cubren.' },
        { id: 'principal', texto: '2 dm²', error: 'PO20', siFuera: 'Bien las 2 losetas. Pero las tiras y los cuadraditos también cubren: cada pieza, 1 dm².' },
      ],
      dibujo: TAM(PEDV, 'x', { total: '?' }),
      revelar: TAM(PEDV, 1, { areas: true, total: true }),
      coincide: 'Coincide: con x = 1, cada pieza cubre 1 dm², y son 2 + 3 + 4 = 9 piezas.',
      noCoincide: 'Revisemos: con lado 1 dm, una loseta cubre 1 · 1 = 1 dm², igual que una tira y que un cuadradito.',
    },
    mira: {
      pieza: 'alg-losetas',
      datos: { objeto: 'tamano', filas: [{ nombre: 'Pedido', cuenta: PEDV }], areas: true, total: true, ladoMax: 3,
        pasos: [{ lado: 3 }, { lado: 1 }, { lado: 0 }, { lado: 'x', areas: false, total: false }, { lado: 1 }] },
      voz: 'El mismo pedido, con tres tamaños de loseta.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Con losetas de 3 dm, cada x se cambia por 3.', ecuacion: ['P(', VX(3), ') = 18 + 9 + 4 = ', RES('31')] },
        { estado: { paso: 1 }, texto: 'Con x = 1, cada pieza cubre 1 dm²: quedan solo los coeficientes, sumados.', ecuacion: ['P(', VX(1), ') = 2 + 3 + 4 = ', RES('9')] },
        { estado: { paso: 2 }, texto: 'Con x = 0, losetas y tiras no cubren nada: queda el término independiente.', ecuacion: ['P(', VX(0), ') = 0 + 0 + 4 = ', RES('4')] },
        { estado: { paso: 3 }, texto: 'Como número, x puede ser negativo: entra entre paréntesis, con su signo.', ecuacion: ['P(', VX(-1), ') = 2 · (−1)² + 3 · (−1) + 4 = 2 − 3 + 4 = ', RES('3')] },
        { estado: { paso: 4 }, texto: 'Si te dan P(x + 1), P(1) sale con x = 0.', ecuacion: ['P(0 + 1) = P(1) = ', RES('9')] },
      ],
    },
    regla: {
      // P(x + h) con un ejemplo y en su línea (lector A, 19 nov: «x cumple x + h = k» no se entendía).
      texto: 'Evaluar P(k) es cambiar cada x por k y operar. P(1) suma los coeficientes; P(0) es el término independiente.',
      ecuacion: ['P(x) = ax² + bx + c', SEP, 'P(1) = ', { llave: ['a + b + c'], nota: 'suma de coeficientes', color: 'c-f' }, SEP, 'P(0) = ', { llave: ['c'], nota: 'término independiente', color: 'c-f' }, SEP,
        'si te dan P(x + 1): P(1) sale con x = 0, porque 0 + 1 = 1'],
      // La app antepone «Vale si».
      condicion: 'cada x se cambia por el mismo número y un número negativo va entre paréntesis: (−2)² = 4, pero (−2)³ = −8.',
      voz: 'Cada x, el mismo número. Lo que no tiene x, no cambia.',
      dibujo: TAM(PEDV, 1, { areas: true, total: true }),
    },
    // Así se resuelve: un pedido de Rubén con un lado dado (el objeto). «Ahora tú» pide otra cosa: negativos, P(1) y P(0),
    // la forma factorizada, un coeficiente por hallar o el argumento desplazado.
    resuelve: {
      pieza: 'alg-losetas',
      generar(s) {
        const r = azar(s + 900), k = 2 + (s % 5);
        const cs = [r.ent(1, 2), r.ent(1, 4), r.ent(1, 5)], vs = cuentaV(cs, k), tot = evaluar(cs, k);
        return {
          enunciado: [`Un pedido de Rubén cubre ${poli(cs)} dm², con x el lado de la loseta en dm. Compra losetas de `, VX(k), ' dm de lado. ¿Cuántos dm² cubre?'],
          datos: [DV.eval, DV.cubre],
          dibujo: TAM(cs, 'x', { total: '?', ladoMax: 6 }),
          pasos: [
            { tipo: 'pide', texto: `Piden lo que cubre el pedido cuando la loseta mide ${k} dm: el valor del polinomio con x = ${k}.` },
            { tipo: 'regla', texto: `Evaluar es cambiar cada x por el mismo número, aquí ${k}, y operar: primero las potencias, después los productos y al final la suma.` },
            { tipo: 'cuentas', texto: `Las losetas cubren ${cs[0]} · ${k}², las tiras ${cs[1]} · ${k} y los cuadraditos ${cs[2]}.`,
              ecuacion: ['P(', VX(k), `) = ${reemplazo(cs, k)} = ${sumaTxt(vs)} = `, RES(f(tot))], dibujo: TAM(cs, k, { areas: true, total: true, ladoMax: 6 }) },
            { tipo: 'sentido', texto: k < 6 ? `Comprueba: los ${cs[2]} cuadraditos cubren ${cs[2]} dm² con cualquier loseta; lo demás crece con el lado. Con losetas de ${k + 1} dm cubriría ${f(evaluar(cs, k + 1))} dm², más que ${f(tot)}.`
              : `Comprueba: los ${cs[2]} cuadraditos cubren ${cs[2]} dm² con cualquier loseta; lo demás crece con el lado. Con losetas de 5 dm cubriría ${f(evaluar(cs, 5))} dm², menos que ${f(tot)}.` },
          ],
          respuesta: [RES(f(tot)), ' dm²'],
        };
      },
    },
    ahoraTu: {
      voz: 'Cada x, el mismo número, con su signo.',
      generar(sem) {
        const r = azar(sem + 47), tipo = sem % 5;
        // Las dos primeras veces, de grado 2: un negativo al cuadrado antes que al cubo (lector A, 19 nov).
        if (tipo === 0) return conCuatro(sem < 10 ? function casoNegativo2(q) { return casoNegativo(q, 2); } : casoNegativo, r);
        if (tipo === 1) return conCuatro(casoUnoCero, r);
        if (tipo === 2) return conCuatro(casoFactorizada, r);
        if (tipo === 3) return conCuatro(casoCoeficiente, r);
        return conCuatro(casoDesplazado, r);
      },
    },
  };

  // ---------- Idea 3 (fase 3, 19 nov): grado absoluto y relativo ----------
  // Objeto: las piezas del depósito de Rubén con dos medidas, x e y (varilla, plancha y bloque), y cada término como una
  // fila de fichas, una por cada letra que se multiplica (alg-losetas, 'deposito' y 'medidas').
  // Cambia: los exponentes del primer término · Permanece: los otros dos términos · Progresa: las fichas y el grado de
  // cada fila · Se reserva: el grado del polinomio entero (la predicción) · Debe verse: el grado de un término cuenta sus
  // fichas; el absoluto es el de la fila más larga y el relativo mira un solo color.
  // Colores: el exponente de x, naranja; el de y, turquesa; el grado hallado, violeta. Los términos, en tinta.
  // Errores: PO11 suma los grados de todos los términos (trampa 45 de San Marcos 2026-I) · PO9 toma el primer término ·
  // PO28 suma los dos grados relativos · PO10 da un grado relativo por el absoluto · TAL-GA-GR da el absoluto por el
  // relativo · TAL-LETRA mira la otra letra · TAL-SUMA-EXP suma los exponentes de una letra · TAL-COEF-GRADO cuenta el
  // exponente del coeficiente · TAL-GRADO-OTRO toma un término que no es el mayor · TAL-PIDE responde otra cosa ·
  // TAL-EXTREMO deja fuera un extremo · TAL-EXTREMOS deja fuera los dos · TAL-EXP-NEG acepta exponentes negativos ·
  // AL16 despeja con el signo cambiado.
  const EX = ficha('exponente de x'), EY = ficha('exponente de y');
  const ME = (terminos, extra) => LO(Object.assign({ objeto: 'medidas', terminos }, extra));
  const PRED3 = [[3, 2, 1], [-2, 1, 3], [1, 0, 0]];   // 3x²y − 2xy³ + 1
  const tXY = (c, a, b, primero = true) => mono(c, [['x', a], ['y', b]], primero) || (primero ? f(c) : ` ${c < 0 ? '−' : '+'} ${f(Math.abs(c))}`);
  const polXY = ts => ts.map(([c, a, b], i) => tXY(c, a, b, i === 0)).join('');
  const DG = {
    term: 'Grado de un término: la suma de los exponentes de sus letras',
    coefNo: 'El coeficiente es un número, aunque lleve exponente: no es una letra del término',
    ga: 'Grado absoluto (GA): el mayor de los grados de los términos',
    gr: 'Grado relativo a una letra, GR(x) o GR(y): el mayor exponente de esa letra',
    uno: 'x = x¹: una letra sin exponente lleva 1',
    poli: 'En un polinomio, cada exponente de una letra es un entero mayor o igual que 0',
  };
  // Un término con sus exponentes en color: 3, x con a naranja, y con b turquesa.
  const tColor = (c, a, b) => [mono(c, [], true).replace(/^$/, '') || '', a ? { sup: ['x', EX(a)] } : '', b ? { sup: ['y', EY(b)] } : ''];

  // Ahora tú 1: el grado absoluto de tres términos.
  function casoGA(r) {
    let ts;
    do { ts = [0, 1, 2].map(() => [r.noCero(-6, 7), r.ent(0, 5), r.ent(0, 5)]); } while (new Set(ts.map(t => t[1] + ',' + t[2])).size < 3 || ts.some(t => t[1] + t[2] === 0) || new Set(ts.map(t => t[1] + t[2])).size < 2);
    const gr = ts.map(t => t[1] + t[2]), GA = Math.max(...gr), GRx = Math.max(...ts.map(t => t[1])), GRy = Math.max(...ts.map(t => t[2]));
    return {
      pregunta: `¿Cuál es el grado absoluto de ${polXY(ts)}?`,
      datos: [DG.term, DG.ga],
      opciones: ops([
        { id: 'c', texto: f(GA), correcta: true },
        { id: 'todos', texto: f(gr.reduce((a, b) => a + b, 0)), error: 'PO11', siFuera: `Bien los grados: ${gr.join(', ')}. Pero el absoluto es el mayor de ellos, no su suma.` },
        { id: 'sumarel', texto: f(GRx + GRy), error: 'PO28', siFuera: `Bien GR(x) = ${GRx} y GR(y) = ${GRy}. Pero salen de términos distintos: no se suman.` },
        { id: 'primero', texto: f(gr[0]), error: 'PO9', siFuera: `Bien el grado del primer término, ${gr[0]}. Pero el absoluto es el mayor de los tres.` },
        { id: 'rel', texto: f(Math.max(GRx, GRy)), error: 'PO10', siFuera: 'Ese es el mayor exponente de una sola letra. El absoluto suma los exponentes dentro de cada término.' },
      ]),
      solucion: { texto: `Grados de los términos: ${gr.join(', ')}. El mayor es ${GA}.`, ecuacion: [`GA = máx(${gr.join('; ')}) = `, RES(f(GA))], dibujo: ME(ts, { grado: true, mayor: true, resaltar: gr.indexOf(GA) }) },
    };
  }
  // Ahora tú 2: un grado relativo.
  function casoGR(r) {
    let ts;
    do { ts = [0, 1, 2].map(() => [r.noCero(-6, 7), r.ent(0, 5), r.ent(0, 5)]); } while (new Set(ts.map(t => t[1] + ',' + t[2])).size < 3 || ts.some(t => t[1] + t[2] === 0));
    const enX = r.ent(0, 1) === 1, L = enX ? 'x' : 'y', k = enX ? 1 : 2, otra = enX ? 2 : 1;
    const bien = Math.max(...ts.map(t => t[k])), GA = Math.max(...ts.map(t => t[1] + t[2]));
    return {
      pregunta: `¿Cuál es el grado relativo a ${L} de ${polXY(ts)}?`,
      datos: [DG.gr, DG.uno],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'ga', texto: f(GA), error: 'TAL-GA-GR', siFuera: `${GA} es el grado absoluto. El relativo a ${L} mira solo los exponentes de ${L}.` },
        { id: 'otra', texto: f(Math.max(...ts.map(t => t[otra]))), error: 'TAL-LETRA', siFuera: `Bien tomar el mayor exponente. Pero ese es el de ${enX ? 'y' : 'x'}; piden el de ${L}.` },
        { id: 'suma', texto: f(ts.reduce((a, t) => a + t[k], 0)), error: 'TAL-SUMA-EXP', siFuera: `Bien mirar solo los exponentes de ${L}. Pero el relativo es el mayor de ellos, no su suma.` },
      ]),
      solucion: { texto: `Exponentes de ${L}: ${ts.map(t => t[k]).join(', ')}. El mayor es ${bien}.`, ecuacion: [`GR(${L}) = `, RES(f(bien))] },
    };
  }
  // Ahora tú 3 (examen): el grado absoluto dado, con un parámetro en los exponentes (San Marcos 2026-I).
  function casoParametro(r) {
    let ps, qs;
    do { ps = [r.ent(0, 4), r.ent(0, 4), r.ent(0, 4)]; qs = [r.ent(1, 5), r.ent(1, 5), r.ent(1, 5)]; } while (new Set(ps.map((p, i) => p + qs[i])).size < 3);
    const s = ps.map((p, i) => p + qs[i]), smax = Math.max(...s), n = r.ent(2, 7), G = n + smax;
    const cs = [1, r.noCero(-5, 5), r.noCero(-5, 5)];
    const term = (c, p, q, i) => [i === 0 ? (c === 1 ? '' : f(c)) : ` ${c < 0 ? '−' : '+'} ${Math.abs(c) === 1 ? '' : f(Math.abs(c))}`, { sup: ['x', p ? `n + ${p}` : 'n'] }, qs[i] === 1 ? 'y' : `y${sup(qs[i])}`];
    const otro = s.find(v => v !== smax), suma = (G - s.reduce((a, b) => a + b, 0)) / 3;
    return {
      pregunta: ['Si P(x, y) = ', ...cs.flatMap((c, i) => term(c, ps[i], qs[i], i)), ` tiene grado absoluto ${G}, ¿cuánto vale n?`],
      datos: [DG.term, DG.ga],
      opciones: ops([
        { id: 'c', texto: f(n), correcta: true },
        { id: 'otro', texto: f(G - otro), error: 'TAL-GRADO-OTRO', siFuera: `Bien igualar un grado a ${G}. Pero ese término no es el mayor: otro pasaría de ${G}.` },
        Number.isInteger(suma) ? { id: 'suma', texto: f(suma), error: 'PO11', siFuera: `Bien los grados con n. Pero el absoluto es el mayor, no la suma de los tres.` } : null,
        { id: 'ga', texto: f(G), error: 'TAL-PIDE', siFuera: `${G} es el grado absoluto, el dato. Piden n.` },
        { id: 'grx', texto: f(G - Math.max(...ps)), error: 'TAL-GA-GR', siFuera: `Eso iguala a ${G} el mayor exponente de x. El absoluto suma también el exponente de y.` },
      ].filter(Boolean)),
      solucion: { texto: `Los grados son ${s.map(v => `n + ${v}`).join(', ')}. El mayor es n + ${smax}.`, ecuacion: [`n + ${smax} = ${G}  →  n = `, RES(f(n))] },
    };
  }
  // Ahora tú 4: ¿para cuántos valores de n es un polinomio?
  function casoEsPolinomio(r) {
    const p = r.ent(1, 4), q = p + r.ent(2, 5), c = r.noCero(-5, 5);
    const bien = q - p + 1;
    return {
      pregunta: ['¿Para cuántos valores enteros de n es P(x) = 3', { sup: ['x', `n − ${p}`] }, ' + ', { sup: ['x', `${q} − n`] }, `${mono(c, [], false)} un polinomio?`],
      datos: [DG.poli],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'uno', texto: f(bien - 1), error: 'TAL-EXTREMO', siFuera: `Bien: n va de ${p} a ${q}. Pero los extremos cuentan: un exponente 0 vale.` },
        { id: 'dos', texto: f(bien - 2), error: 'TAL-EXTREMOS', siFuera: `Bien el rango de ${p} a ${q}. Pero un exponente 0 vale: n = ${p} y n = ${q} cuentan.` },
        { id: 'mayor', texto: f(q), error: 'TAL-PIDE', siFuera: `${q} es el mayor valor de n. Piden cuántos valores hay.` },
      ]),
      solucion: { texto: `n − ${p} ≥ 0 y ${q} − n ≥ 0: n va de ${p} a ${q}.`, ecuacion: [`${q} − ${p} + 1 = `, RES(f(bien))] },
    };
  }
  // Ahora tú 5 (examen): los dos grados relativos dados; piden el absoluto.
  function casoRelativos(r) {
    let p, q, m, n;
    do { p = r.ent(1, 4); q = r.ent(1, 4); m = r.ent(1, 6); n = r.ent(1, 6); } while (p === q);
    const A = m + p, B = n + q, GA = m + n + Math.max(p, q), c = r.noCero(-6, 6);
    return {
      pregunta: ['En P(x, y) = ', { sup: ['x', `m + ${p}`] }, { sup: ['y', 'n'] }, ` ${c < 0 ? '−' : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}`, { sup: ['x', 'm'] }, { sup: ['y', `n + ${q}`] }, `, GR(x) = ${A} y GR(y) = ${B}. ¿Cuál es el grado absoluto?`],
      datos: [DG.gr, DG.term, DG.ga],
      opciones: ops([
        { id: 'c', texto: f(GA), correcta: true },
        { id: 'suma', texto: f(A + B), error: 'PO28', siFuera: `Bien m = ${m} y n = ${n}. Pero ${A} y ${B} salen de términos distintos: no se suman.` },
        { id: 'otro', texto: f(m + n + Math.min(p, q)), error: 'TAL-GRADO-OTRO', siFuera: `Bien m y n. Pero ese es el grado del otro término; el absoluto es el mayor.` },
        { id: 'mn', texto: f(m + n), error: 'TAL-PIDE', siFuera: `Bien m + n = ${m + n}. Pero piden el grado absoluto del polinomio.` },
      ]),
      solucion: { texto: `m + ${p} = ${A} da m = ${m}; n + ${q} = ${B} da n = ${n}. Los grados: ${m + p + n} y ${m + n + q}.`, ecuacion: ['GA = ', RES(f(GA))] },
    };
  }

  // Ejemplos de la idea 3. Cuentas rehechas aparte (e5-algebra/cuentas-fase3.py): 4x³y² grado 5; x⁴y − 3x²y⁵: GR(x) =
  // 4, GR(y) = 5; 7 grado 0 y 7x grado 1; −2³x⁴y grado 5; 5x³ − 2x + 1 grado 3; x³y² + 4x⁴y − 2xy⁵: 5, 5, 6 → 6;
  // 2x⁵ − xy³ + 4y: GR(y) = 3; 100x²y + x³y³ − 9: 6; solo 3x² − x + 5 es polinomio; 5x^(n+2)y³ grado 9 → n = 4;
  // n + 5, n + 6, n + 4 con GA 11 → n = 5 (errores 6, 7, 11 y 8); m = 4, n = 6, GA 13 (errores 15, 10, 12 y 24); n de 2 a
  // 6: 5 valores (errores 3, 4, 6 e infinitos); 2a = 8, 3a + b = 13 → b = 1 (errores 4, 5, 9 y −11); m = 5, grados 9, 9
  // y 10 → 10 (errores 9, 7, 12 y 28).
  const EJEMPLOS_GRADOS = [
    { nivel: 1, titulo: 'El grado de un término',
      enunciado: '¿Qué grado tiene el término 4x³y²?',
      datos: [DG.term],
      figura: ME([[4, 3, 2]], { grado: '?' }),
      solucion: [{ texto: 'Se suman los exponentes de sus letras: x lleva 3 e y lleva 2. Son 5 letras multiplicadas.', ecuacion: [EX(3), ' + ', EY(2), ' = ', RES('5')] }],
      respuesta: ['Grado ', RES('5')] },
    { nivel: 1, titulo: 'Los dos grados relativos',
      enunciado: '¿Cuáles son GR(x) y GR(y) en x⁴y − 3x²y⁵?',
      datos: [DG.gr, DG.uno],
      solucion: [{ texto: 'Los exponentes de x son 4 y 2: el mayor es 4. Los de y son 1 y 5: el mayor es 5.', ecuacion: ['GR(x) = ', RES('4'), ',   GR(y) = ', RES('5')] }],
      respuesta: ['GR(x) = ', RES('4'), ' y GR(y) = ', RES('5')] },
    { nivel: 1, titulo: 'Un número y una letra',
      enunciado: '¿Qué grado tiene el término 7? ¿Y el término 7x?',
      datos: [DG.term, DG.uno],
      solucion: [{ texto: '7 no tiene letras: no se multiplica ninguna, y su grado es 0. En 7x, la x lleva exponente 1.', ecuacion: ['7: grado ', RES('0'), ',   7x: grado ', RES('1')] }],
      respuesta: ['7 tiene grado ', RES('0'), ' y 7x, grado ', RES('1')] },
    { nivel: 1, titulo: 'El coeficiente no cuenta',
      enunciado: '¿Qué grado tiene el término −2³x⁴y?',
      datos: [DG.term, DG.uno],
      solucion: [{ texto: '−2³ = −8 es el coeficiente, un número: su exponente no cuenta. Cuentan los de las letras, 4 y 1.', ecuacion: [EX(4), ' + ', EY(1), ' = ', RES('5')] }],
      respuesta: ['Grado ', RES('5')] },
    { nivel: 1, titulo: 'Con una sola letra',
      enunciado: '¿Cuál es el grado absoluto de 5x³ − 2x + 1?',
      datos: [DG.term, DG.ga],
      solucion: [{ texto: 'Los términos tienen grados 3, 1 y 0. El mayor es 3: con una sola letra, es el mayor exponente.', ecuacion: ['GA = máx(3; 1; 0) = ', RES('3')] }],
      respuesta: ['GA = ', RES('3')] },
    { nivel: 2, titulo: 'Tres términos con dos letras',
      enunciado: '¿Cuál es el grado absoluto de x³y² + 4x⁴y − 2xy⁵?',
      datos: [DG.term, DG.ga],
      figura: ME([[1, 3, 2], [4, 4, 1], [-2, 1, 5]], { grado: '?' }),
      solucion: [
        { texto: 'Sumo los exponentes dentro de cada término.', ecuacion: ['3 + 2 = 5,   4 + 1 = 5,   1 + 5 = 6'] },
        { texto: 'El grado absoluto es el mayor de los tres.', ecuacion: ['GA = máx(5; 5; 6) = ', RES('6')] },
      ],
      respuesta: ['GA = ', RES('6')] },
    { nivel: 2, titulo: 'Una letra que falta',
      enunciado: 'En 2x⁵ − xy³ + 4y, ¿cuánto valen GR(x) y GR(y)?',
      datos: [DG.gr, DG.uno],
      solucion: [
        { texto: 'Exponentes de x: 5 en 2x⁵, 1 en xy³ y 0 en 4y, porque ahí no hay x. El mayor es 5.', ecuacion: ['GR(x) = máx(5; 1; 0) = ', RES('5')] },
        { texto: 'Exponentes de y: 0, 3 y 1. El mayor es 3.', ecuacion: ['GR(y) = máx(0; 3; 1) = ', RES('3')] },
      ],
      respuesta: ['GR(x) = ', RES('5'), ' y GR(y) = ', RES('3')] },
    { nivel: 2, titulo: 'Un coeficiente grande',
      enunciado: '¿Cuál es el grado absoluto de 100x²y + x³y³ − 9?',
      datos: [DG.term, DG.ga],
      solucion: [
        { texto: 'El 100 es un coeficiente: no cambia el grado. Los grados son 2 + 1, 3 + 3 y 0.', ecuacion: ['3,   6,   0'] },
        { texto: 'El mayor es el de x³y³, aunque su coeficiente sea 1.', ecuacion: ['GA = ', RES('6')] },
      ],
      respuesta: ['GA = ', RES('6')] },
    { nivel: 2, titulo: '¿Es un polinomio?',
      enunciado: ['¿Cuál de estas expresiones es un polinomio: 3x² − x + 5, 2x⁻¹ + 4 o ', { sup: ['x', '1/2'] }, ' + 1?'],
      datos: [DG.poli, ['x⁻¹ = 1/x;  ', { sup: ['x', '1/2'] }, ' = √x']],
      solucion: [
        { texto: 'En 2x⁻¹ + 4 la x lleva exponente −1: está dividiendo, y eso no vale.', ecuacion: ['2x⁻¹ = 2/x'] },
        { texto: ['En ', { sup: ['x', '1/2'] }, ' + 1 el exponente es 1/2, que no es entero. Solo la primera tiene exponentes enteros y no negativos.'], ecuacion: [RES('3x² − x + 5')] },
      ],
      respuesta: ['Solo ', RES('3x² − x + 5')] },
    { nivel: 2, titulo: 'Un exponente por hallar',
      enunciado: ['El término 5', { sup: ['x', 'n + 2'] }, 'y³ tiene grado 9. ¿Cuánto vale n?'],
      datos: [DG.term],
      solucion: [
        { texto: 'El grado suma los dos exponentes: el de x, n + 2, y el de y, 3.', ecuacion: ['(n + 2) + 3 = 9'] },
        { texto: 'Despejo: n + 5 = 9.', ecuacion: ['n = 9 − 5 = ', RES('4')] },
      ],
      respuesta: ['n = ', RES('4')] },
    { nivel: 3, titulo: 'Exponentes con un parámetro',
      enunciado: ['Si P(x, y) = ', { sup: ['x', 'n + 3'] }, 'y² + 3', { sup: ['x', 'n + 1'] }, 'y⁵ − ', { sup: ['x', 'n'] }, 'y⁴ tiene grado absoluto 11, ¿cuánto vale n?'],
      alternativas: ['6', '7', '11', '8', '5'],
      datos: [DG.term, DG.ga],
      solucion: [
        { texto: 'Los grados de los términos son n + 5, n + 6 y n + 4. Para cualquier n, el mayor es n + 6.', ecuacion: ['n + 6 = 11'] },
        { texto: 'Despejo.', ecuacion: ['n = 11 − 6 = ', RES('5')] },
        { texto: ['La ', letra('A'), ' iguala a 11 el grado del primer término, n + 5. La ', letra('B'), ' iguala el del tercero, n + 4.'] },
        { texto: ['La ', letra('C'), ' responde el grado absoluto, el dato. La ', letra('D'), ' iguala a 11 el exponente de x del primer término, n + 3.'] },
      ],
      respuesta: [letra('E'), ', ', RES('5')] },
    { nivel: 3, titulo: 'Dos relativos y el absoluto',
      enunciado: ['En P(x, y) = ', { sup: ['x', 'm + 3'] }, { sup: ['y', 'n'] }, ' − 4', { sup: ['x', 'm'] }, { sup: ['y', 'n + 2'] }, ', GR(x) = 7 y GR(y) = 8. ¿Cuál es el grado absoluto?'],
      alternativas: ['13', '15', '10', '12', '24'],
      datos: [DG.gr, DG.term, DG.ga],
      solucion: [
        { texto: 'El mayor exponente de x es m + 3, y el de y, n + 2.', ecuacion: ['m + 3 = 7  →  m = 4,   n + 2 = 8  →  n = 6'] },
        { texto: 'Los grados de los términos: 4 + 3 + 6 = 13 y 4 + 6 + 2 = 12. El mayor es 13.', ecuacion: ['GA = ', RES('13')] },
        { texto: ['La ', letra('B'), ' suma los dos relativos, 7 + 8, que salen de términos distintos. La ', letra('C'), ' da m + n.'] },
        { texto: ['La ', letra('D'), ' toma el grado del segundo término, que no es el mayor. La ', letra('E'), ' multiplica m por n.'] },
      ],
      respuesta: [letra('A'), ', ', RES('13')] },
    { nivel: 3, titulo: '¿Para qué valores es polinomio?',
      enunciado: ['¿Para cuántos valores enteros de n es P(x) = 3', { sup: ['x', 'n − 2'] }, ' + ', { sup: ['x', '6 − n'] }, ' + 2 un polinomio?'],
      alternativas: ['3', '4', '6', '5', 'Infinitos'],
      datos: [DG.poli],
      solucion: [
        { texto: 'Los dos exponentes deben ser enteros mayores o iguales que 0.', ecuacion: ['n − 2 ≥ 0  →  n ≥ 2,   6 − n ≥ 0  →  n ≤ 6'] },
        { texto: 'n puede ser 2, 3, 4, 5 o 6: con n = 2 o n = 6 un exponente es 0, y 0 vale.', ecuacion: [RES('5'), ' valores'] },
        { texto: ['La ', letra('A'), ' deja fuera los dos extremos, 2 y 6. La ', letra('B'), ' deja fuera uno de ellos.'] },
        { texto: ['La ', letra('C'), ' responde el mayor valor de n. La ', letra('E'), ' mira solo n − 2 ≥ 0 y olvida el otro exponente.'] },
      ],
      respuesta: [letra('D'), ', ', RES('5'), ' valores'] },
    { nivel: 3, titulo: 'Un término con dos parámetros',
      enunciado: ['El término 5', { sup: ['x', '2a'] }, { sup: ['y', 'a + b'] }, ' tiene GR(x) = 8 y grado absoluto 13. ¿Cuánto vale b?'],
      alternativas: ['4', '5', '1', '9', '−11'],
      datos: [DG.gr, DG.term],
      solucion: [
        { texto: 'Con una sola x, GR(x) es su exponente: 2a = 8, y a = 4.', ecuacion: ['2a = 8  →  a = 4'] },
        { texto: 'El grado suma los dos exponentes: 2a + (a + b) = 3a + b.', ecuacion: ['12 + b = 13  →  b = ', RES('1')] },
        { texto: ['La ', letra('A'), ' responde a = 4. La ', letra('B'), ' responde el exponente de y, a + b = 5.'] },
        { texto: ['La ', letra('D'), ' olvida el 2a: 13 − 4 = 9. La ', letra('E'), ' no divide entre 2: a = 8, y 24 + b = 13.'] },
      ],
      respuesta: [letra('C'), ', b = ', RES('1')] },
    { nivel: 3, titulo: 'El relativo da el absoluto',
      enunciado: ['P(x, y) = ', { sup: ['x', 'm'] }, 'y⁴ + ', { sup: ['x', 'm + 2'] }, 'y² − 3x⁵', { sup: ['y', 'm'] }, ' tiene GR(x) = 7. ¿Cuál es su grado absoluto?'],
      alternativas: ['9', '7', '12', '28', '10'],
      datos: [DG.gr, DG.term, DG.ga],
      solucion: [
        { texto: 'Los exponentes de x son m, m + 2 y 5. Si m + 2 = 7, m = 5 y 5 no pasa de 7: cuadra.', ecuacion: ['m + 2 = 7  →  m = 5'] },
        { texto: 'Los grados: 5 + 4 = 9, 7 + 2 = 9 y 5 + 5 = 10.', ecuacion: ['GA = máx(9; 9; 10) = ', RES('10')] },
        { texto: ['La ', letra('A'), ' mira solo los dos primeros términos. La ', letra('B'), ' da GR(x), el dato.'] },
        { texto: ['La ', letra('C'), ' suma GR(x) = 7 y GR(y) = 5. La ', letra('D'), ' suma los tres grados: 9 + 9 + 10.'] },
      ],
      respuesta: [letra('E'), ', ', RES('10')] },
  ];

  const grados = {
    id: 'grados',
    titulo: 'Grado absoluto y relativo',
    pregunta: '¿Cómo se halla el grado de un polinomio con dos letras?',
    temas: ['Grado absoluto y relativo'],
    pieza: 'alg-losetas',
    aprendizaje: 'El grado de un término suma sus exponentes; el absoluto es el mayor de esos grados, y el relativo a x, su mayor exponente.',
    actividad: 'Armar términos con fichas de letras y contar cuántas se multiplican.',
    // Lee: el depósito (cuántas medidas se multiplican) y los nombres de los grados. No dice cómo se halla el absoluto.
    lee: {
      tarjetas: [
        { titulo: 'El depósito de Rubén', texto: 'En el depósito hay piezas con dos medidas, x dm e y dm. Una varilla mide x de largo. Una plancha cubre x · y = xy. Un bloque llena x · x · y = x²y.',
          pieza: 'alg-losetas', dibujo: LO({ objeto: 'deposito', medidas: false }) },
        { titulo: 'Cuántas medidas se multiplican', texto: 'En la plancha se multiplican dos medidas y en el bloque, tres. En un término, cada exponente dice cuántas veces se multiplica su letra, y esa cuenta se llama grado del término.',
          pieza: 'alg-losetas', dibujo: LO({ objeto: 'deposito' }) },
        { titulo: 'Dos clases de grado', texto: 'El grado relativo a una letra mira solo esa letra: GR(x) o GR(y). El grado absoluto, GA, mira el polinomio entero. En la academia verás G.A. y G.R.: son lo mismo.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cada ficha es una letra que se multiplica: naranja la x y turquesa la y. Cambia los exponentes del primer término y mira el número de la derecha de cada fila.' },
      ],
    },
    ejemplos: EJEMPLOS_GRADOS,
    juega: {
      pieza: 'alg-losetas',
      consigna: 'P = 3xᵃyᵇ − 2xy³ + 5x². Cada ficha es una letra que se multiplica.',
      mision: {
        // Una sola respuesta: con los controles de 0 a 5 y la y en 3 o menos, solo 5 + 3 da 8 (lector A, 19 nov: lo
        // decía sin el tope de 5, y 6 + 2 o 7 + 1 parecían valer).
        texto: ['Lleva el primer término a grado 8, con x hasta 5 e y hasta 3.'],
        logrado: v => v.a === 5 && v.b === 3,
        bien: 'Listo: el grado del término suma sus exponentes, 5 + 3. El relativo mira una sola letra.',
      },
      voz: 'Cuenta las fichas de cada fila.',
      leyenda: [
        { s: EX('a'), t: 'exponente de x en el primer término' },
        { s: EY('b'), t: 'exponente de y en el primer término' },
        { s: RES('grado'), t: 'cuántas letras se multiplican en el término' },
        { s: 'GR(x)', t: 'grado relativo a x: su mayor exponente' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Exponente de x, a', color: 'c-o', min: 0, max: 5, paso: 1, inicio: 2, decimales: 0 },
        { id: 'b', etiqueta: 'Exponente de y, b', color: 'c-i', min: 0, max: 5, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => ME([[3, v.a, v.b], [-2, 1, 3], [5, 2, 0]], { grado: true }),
      // La relación: el grado del término suma sus exponentes; los relativos miran una letra (el absoluto no se dice).
      lectura: v => ['3', v.a ? 'x' : '', v.a > 1 ? EX(sup(v.a)) : '', v.b ? 'y' : '', v.b > 1 ? EY(sup(v.b)) : '', ` tiene grado ${v.a} + ${v.b} = `, RES(f(v.a + v.b)), `; en P, GR(x) = ${Math.max(v.a, 1, 2)}`],
      minimo: 3,
    },
    predice: {
      // Sin los grados de los términos (lector A, 19 nov: con 3, 4 y 0 escritos solo quedaba elegir uno): el juego enseñó
      // el grado de un término; aquí se predice el del polinomio entero.
      pregunta: '¿Cuál es el grado absoluto de 3x²y − 2xy³ + 1, el grado del polinomio entero?',
      datos: ['En xy³, x lleva exponente 1 e y lleva 3', 'El término 1 no tiene letras'],
      voz: 'Piensa en el polinomio entero, no en un término.',
      opciones: [
        { id: 'c', texto: '4', correcta: true },
        { id: 'todos', texto: '7', error: 'PO11', siFuera: 'Bien los grados de los términos: 3, 4 y 0. Pero sumarlos no da el grado del polinomio.' },
        { id: 'primero', texto: '3', error: 'PO9', siFuera: 'Bien el grado del primer término, 3. Pero hay otro término con más letras multiplicadas.' },
        { id: 'relativos', texto: '5', error: 'PO28', siFuera: 'Bien los mayores exponentes, 2 y 3. Pero salen de términos distintos: ninguno tiene grado 5.' },
      ],
      dibujo: ME(PRED3, { mayor: '?' }),
      revelar: ME(PRED3, { grado: true, mayor: true, resaltar: 1 }),
      coincide: 'Coincide: el grado absoluto es el mayor grado de los términos, el de −2xy³: 4.',
      noCoincide: 'Revisemos: busca la fila con más fichas. Ese término da el grado del polinomio.',
    },
    mira: {
      pieza: 'alg-losetas',
      datos: { objeto: 'medidas', terminos: PRED3, pasos: [{}, { grado: true }, { grado: true, mayor: true, resaltar: 1 }, { grado: true, resaltar: 0 }, { grado: true, resaltar: 1 }] },
      voz: 'Primero dentro de cada término; después, entre términos.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Cada término con sus fichas: 3x²y tiene dos fichas x y una y.', ecuacion: ['3x²y = 3 · x · x · y'] },
        { estado: { paso: 1 }, texto: 'El grado de cada término es su número de fichas: suma sus exponentes.', ecuacion: ['2 + 1 = 3,   1 + 3 = 4,   0 + 0 = 0'] },
        { estado: { paso: 2 }, texto: 'El grado absoluto es el mayor de esos grados.', ecuacion: ['GA = máx(3; 4; 0) = ', RES('4')] },
        { estado: { paso: 3 }, texto: 'GR(x) mira solo las fichas x: el mayor exponente es 2.', ecuacion: ['GR(x) = máx(', EX(2), '; ', EX(1), '; ', EX(0), ') = ', RES('2')] },
        { estado: { paso: 4 }, texto: 'GR(y) = 3. El 2 y el 3 vienen de términos distintos.', ecuacion: ['GR(x) + GR(y) = 5, pero GA = ', RES('4')] },
      ],
    },
    regla: {
      texto: 'El grado de un término suma los exponentes de sus letras. El grado absoluto (GA) es el mayor de esos grados; GR(x), el mayor exponente de x.',
      ecuacion: ['GA = máx(', { llave: [{ sub: ['g', '1'] }, '; ', { sub: ['g', '2'] }, '; …'], nota: 'grado de cada término', color: 'c-f' }, ')', SEP, 'GR(x) = ', { llave: ['mayor exponente de x'], nota: 'una sola letra', color: 'c-f' }],
      condicion: 'los exponentes de las letras son enteros mayores o iguales que 0; el coeficiente no cuenta.',
      voz: 'Dentro del término se suma; entre términos, se elige el mayor.',
      dibujo: ME(PRED3, { grado: true, mayor: true, resaltar: 1 }),
    },
    // Así se resuelve: el grado de un solo término con un coeficiente elevado (el exponente del número no cuenta).
    // «Ahora tú» pide el grado de un polinomio, un relativo, un parámetro o cuándo es polinomio.
    resuelve: {
      pieza: 'alg-losetas',
      generar(s) {
        const r = azar(s + 900), base = r.ent(2, 5), e = r.ent(2, 3), a = r.ent(1, 5), b = r.ent(1, 4), neg = s % 2 === 1;
        const coef = `${neg ? '−' : ''}${base}${sup(e)}`, lit = pot('x', a) + pot('y', b);
        return {
          enunciado: `¿Qué grado tiene el término ${coef}${lit}?`,
          datos: [DG.term, DG.coefNo, DG.uno],
          // El término de la figura es el del enunciado, con su coeficiente elevado (lector A, 19 nov: decía 2x⁵y⁴).
          dibujo: ME([[neg ? -2 : 2, a, b, `${coef}${lit}`]], { grado: '?' }),
          pasos: [
            { tipo: 'pide', texto: 'Piden el grado de un solo término: cuántas letras se multiplican.' },
            { tipo: 'regla', texto: `El grado suma los exponentes de las letras. ${coef} es el coeficiente, un número: su exponente ${e} no cuenta.` },
            { tipo: 'cuentas', texto: `La x lleva ${a} y la y lleva ${b}.`, ecuacion: [EX(a), ' + ', EY(b), ' = ', RES(f(a + b))], dibujo: ME([[neg ? -2 : 2, a, b, `${coef}${lit}`]], { grado: true }) },
            { tipo: 'sentido', texto: `Comprueba: ${lit} multiplica x ${a} ${a === 1 ? 'vez' : 'veces'} e y ${b}: ${a + b} letras. Con el ${e} del coeficiente saldría ${a + b + e}, y el número de adelante no cuenta.` },
          ],
          respuesta: ['Grado ', RES(f(a + b))],
        };
      },
    },
    ahoraTu: {
      voz: 'Dentro del término, suma; entre términos, el mayor.',
      generar(sem) {
        const r = azar(sem + 61), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoGA, r);
        if (tipo === 1) return conCuatro(casoGR, r);
        if (tipo === 2) return conCuatro(casoParametro, r);
        if (tipo === 3) return conCuatro(casoEsPolinomio, r);
        return conCuatro(casoRelativos, r);
      },
    },
  };

  // ---------- Idea 4 (fase 3, 19 nov): completo, ordenado y homogéneo ----------
  // Objeto: el casillero de la tienda, con una casilla por potencia de x: el bloque (x³), la loseta (x²), la tira (x) y
  // el cuadradito (x⁰) (alg-losetas, 'casillero'). Homogéneo se ve con las fichas de la idea 3 ('medidas').
  // Cambia: el pedido y el orden de las casillas · Permanece: una casilla por potencia · Progresa: las casillas vacías y
  // el orden · Se reserva: cuántas casillas tiene un pedido de grado 5 (la predicción; el juego llega a grado 3) · Debe
  // verse: completo es ninguna casilla vacía; una casilla vacía lleva 0 y también cuenta.
  // Colores: el exponente de x (la casilla), naranja; los 0 de las casillas vacías y lo que se halla, violeta.
  // Errores: PO1 cuenta solo los términos escritos · PO9 olvida la casilla de x⁰ · TAL-COMPLETO agrega un solo término ·
  // TAL-FALTAN da los que faltan por el total · TAL-X0 olvida x⁰ al contar los que faltan · TAL-HOMOG da el grado común ·
  // TAL-HOMOG-EXP iguala exponentes en vez de grados · TAL-HOMOG-SIGNO suma en vez de restar · TAL-EXP-DIRECTO toma el
  // exponente sin despejar · TAL-ORDEN-INVERSO ordena al revés · AL16 despeja con el signo cambiado · TAL-PIDE.
  const CAS = (grado, coef, extra) => LO(Object.assign({ objeto: 'casillero', grado, filas: [{ coef }], colorPot: 'o' }, extra));
  const coefDe = ts => Object.fromEntries(ts.map(([c, e]) => [e, c]));
  // Los pedidos del juego, como Rubén los apunta (el orden en que se escribieron).
  const POLS4 = {
    '4x + x³ − 2 + 3x²': [[4, 1], [1, 3], [-2, 0], [3, 2]],
    '5 − x² + 2x³': [[5, 0], [-1, 2], [2, 3]],
    'x³ + 7': [[1, 3], [7, 0]],
    '3x − x² + 6': [[3, 1], [-1, 2], [6, 0]],
  };
  const MISION4 = '4x + x³ − 2 + 3x²';
  const escribir = ts => ts.map(([c, e], i) => mono(c, [['x', e]], i === 0)).join('');
  const DC = {
    completo: 'Completo: aparece cada potencia de x, desde la del grado hasta x⁰',
    ordenado: 'Ordenado: los exponentes de x solo bajan o solo suben',
    homog: 'Homogéneo: todos sus términos tienen el mismo grado',
    term: 'Grado de un término: la suma de los exponentes de sus letras',
    cero: 'Una potencia que falta se escribe con coeficiente 0',
    x0: 'x⁰ = 1: el término independiente es el de x⁰',
  };

  // Ahora tú 1: cuántos términos tiene al completarlo.
  function casoTotal(r) {
    const n = r.ent(3, 9), m = r.ent(2, Math.min(4, n));
    return {
      pregunta: `Un polinomio de grado ${n} tiene ${m} términos escritos. Si se completa, ¿cuántos términos tendrá?`,
      datos: [DC.completo, DC.cero],
      opciones: ops([
        { id: 'c', texto: f(n + 1), correcta: true },
        { id: 'n', texto: f(n), error: 'PO9', siFuera: `Bien contar de x${sup(n)} hacia abajo. Pero falta la casilla de x⁰: son ${n} + 1.` },
        { id: 'm', texto: f(m), error: 'PO1', siFuera: 'Esos son los términos escritos. Completar agrega los de coeficiente 0.' },
        { id: 'falta', texto: f(n + 1 - m), error: 'TAL-FALTAN', siFuera: 'Bien contar las casillas vacías. Pero piden el total: las vacías más las escritas.' },
        { id: 'uno', texto: f(m + 1), error: 'TAL-COMPLETO', siFuera: 'Completar no es agregar un término: va una casilla por cada potencia.' },
      ]),
      solucion: { texto: `Hay una casilla por cada potencia, de x${sup(n)} a x⁰.`, ecuacion: [`${n} + 1 = `, RES(f(n + 1))] },
    };
  }
  // Ahora tú 2: cuántos ceros hay que agregar a un polinomio escrito.
  function casoCeros(r) {
    const n = r.ent(4, 7), m = r.ent(2, Math.min(4, n - 1));
    const exps = [n]; while (exps.length < m) { const e = r.ent(0, n - 1); if (!exps.includes(e)) exps.push(e); }
    exps.sort((a, b) => b - a);
    const ts = exps.map(e => [r.noCero(-6, 7), e]), conX0 = exps.includes(0);
    return {
      pregunta: `¿Cuántos términos de coeficiente 0 hay que agregarle a ${escribir(ts)} para que quede completo?`,
      datos: [DC.completo, DC.cero, DC.x0],
      opciones: ops([
        { id: 'c', texto: f(n + 1 - m), correcta: true },
        { id: 'total', texto: f(n + 1), error: 'TAL-PIDE', siFuera: `Ese es el total de términos del polinomio completo. Piden cuántos ceros se agregan.` },
        conX0 ? { id: 'x0', texto: f(n - m), error: 'TAL-X0', siFuera: `Bien contar las potencias que faltan. Pero las casillas van de x${sup(n)} a x⁰: son ${n + 1} en total.` }
          : { id: 'x0', texto: f(n - m), error: 'TAL-X0', siFuera: 'Bien contar las potencias con x que faltan. Pero también falta la de x⁰, el término independiente.' },
        { id: 'escritos', texto: f(m), error: 'PO1', siFuera: 'Esos son los términos escritos, no los que faltan.' },
        { id: 'uno', texto: '1', error: 'TAL-COMPLETO', siFuera: 'Completar no es agregar un término: va un 0 por cada potencia que falta.' },
      ]),
      solucion: { texto: `De x${sup(n)} a x⁰ hay ${n + 1} casillas; ${m} tienen número.`, ecuacion: [`${n + 1} − ${m} = `, RES(f(n + 1 - m))], dibujo: CAS(n, coefDe(ts), { ceros: true }) },
    };
  }
  // Ahora tú 3: el exponente que hace homogéneo al polinomio.
  function casoHomogeneo(r) {
    let g, a1, b1, a2, b2, a3, b3;
    do { g = r.ent(5, 9); a2 = r.ent(1, g - 1); b2 = g - a2; a3 = r.ent(0, g); b3 = g - a3; b1 = r.ent(1, g - 1); a1 = g - b1; } while (a2 === a3 || a1 === a2 || a1 === a3);
    const t2 = mono(r.noCero(-5, 5), [['x', a2], ['y', b2]], false), t3 = mono(r.noCero(-5, 5), [['x', a3], ['y', b3]], false);
    return {
      pregunta: ['¿Qué valor de m hace homogéneo a 2', { sup: ['x', 'm'] }, `${pot('y', b1)}${t2}${t3}?`],
      datos: [DC.homog, DC.term],
      opciones: ops([
        { id: 'c', texto: f(a1), correcta: true },
        { id: 'g', texto: f(g), error: 'TAL-HOMOG', siFuera: `${g} es el grado común, bien hallado. Pero m es el exponente de x que lo completa: m + ${b1} = ${g}.` },
        { id: 'igual', texto: f(a2), error: 'TAL-HOMOG-EXP', siFuera: 'Homogéneo no pide exponentes iguales, sino grados iguales.' },
        { id: 'suma', texto: f(g + b1), error: 'TAL-HOMOG-SIGNO', siFuera: `Bien el grado común, ${g}. Pero el ${b1} de y se resta: m = ${g} − ${b1}.` },
      ]),
      solucion: { texto: `Los otros términos tienen grado ${g}; el primero tiene grado m + ${b1}.`, ecuacion: [`m + ${b1} = ${g}  →  m = `, RES(f(a1))],
        dibujo: ME([[2, a1, b1], [2, a2, b2], [3, a3, b3]], { grado: true }) },
    };
  }
  // Ahora tú 4 (examen): completo y ordenado con exponentes por hallar.
  function casoParametros(r) {
    const p = r.ent(0, 2), q = r.ent(0, 2), s = r.ent(1, 4), crec = r.ent(0, 1) === 1;
    // P(x) = 2x^(a+p) − x^(b+q) + 5x^(c−s) + 7, completo y ordenado de grado 3: a + p = 3, b + q = 2, c − s = 1.
    const a = 3 - p, b = 2 - q, c = 1 + s, bien = a * c;
    const ea = p ? `a + ${p}` : 'a', eb = q ? `b + ${q}` : 'b', ec = `c − ${s}`;
    const termsDec = [['2', { sup: ['x', ea] }], [' − ', { sup: ['x', eb] }], [' + 5', { sup: ['x', ec] }], [' + 7']];
    const termsCre = [['7 + 5', { sup: ['x', ec] }], [' − ', { sup: ['x', eb] }], [' + 2', { sup: ['x', ea] }]];
    const inv = (1 - p) * (3 + s);      // el 3 y el 1 cambiados de lugar: a + p = 1 y c − s = 3
    return {
      pregunta: ['P(x) = ', ...(crec ? termsCre : termsDec).flat(), ` es completo y está ordenado de forma ${crec ? 'creciente' : 'decreciente'}. ¿Cuánto vale a · c?`],
      datos: [DC.completo, DC.ordenado],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'directo', texto: '3', error: 'TAL-EXP-DIRECTO', siFuera: 'Bien los exponentes 3 y 1. Pero piden a y c: falta despejarlos.' },
        { id: 'suma', texto: f(a + c), error: 'TAL-PIDE', siFuera: `Bien a = ${a} y c = ${c}. Pero piden el producto, no la suma.` },
        { id: 'signo', texto: f((3 + p) * (1 - s)), error: 'AL16', siFuera: 'Bien igualar los exponentes. Pero al despejar, cada número pasa con el signo cambiado.' },
        { id: 'inverso', texto: f(inv), error: 'TAL-ORDEN-INVERSO', siFuera: `Bien una casilla por potencia. Pero ${crec ? 'creciente: el término con c, justo después del 7, es el de x¹' : 'decreciente: el primer término es el de x³'}.` },
      ]),
      solucion: { texto: 'Cuatro términos de grado 3: los exponentes son 3, 2, 1 y 0.', ecuacion: [`a = ${a},  c = ${c},  a · c = `, RES(f(bien))] },
    };
  }

  // Ejemplos de la idea 4. Cuentas rehechas aparte (e5-algebra/cuentas-fase3.py): x³ + 2x² − x + 4 completo; x³ − x + 4
  // no (falta x²); 5x⁴ − x² + x + 3 no completo (falta x³); grado 7 → 8 términos; x⁴ + 0x³ + 0x² − 2x + 3; x³ + 2x²y − y³
  // homogéneo de grado 3; grado 4 con 2 escritos: faltan 3; x²y³ − 4xy⁴ + y⁵ de grado 5; m + 3 = 6 → m = 3; 4 + x − 3x² +
  // 2x³ creciente y completo; a = 3, b = 2, c = 1 → 6; a = 4, c = 4: a · c = 16 (errores 5, −4, 3 y 8); a = 5, b = 3: 15
  // (errores 12, 8, 64 y 40); 2n + 1 = n + 8 → n = 7, grado 14 (errores 7, 15, 16 y 18); 3 escritos + 4 ceros = 7
  // términos → grado 6 (errores 7, 1, 12 y 8).
  const EJEMPLOS_COMPLETO = [
    { nivel: 1, titulo: '¿Está completo?',
      enunciado: '¿Es completo x³ + 2x² − x + 4? ¿Y x³ − x + 4?',
      datos: [DC.completo],
      figura: CAS(3, { 3: 1, 1: -1, 0: 4 }, { iconos: true }),
      solucion: [{ texto: 'x³ + 2x² − x + 4 tiene las cuatro potencias, de x³ a x⁰. En x³ − x + 4 la casilla de x² queda vacía.', ecuacion: [RES('Sí'), ' el primero;  ', RES('no'), ' el segundo: falta x²'] }],
      respuesta: ['El primero ', RES('sí'), '; el segundo ', RES('no'), ' (falta x²)'] },
    { nivel: 1, titulo: 'Ordenar de mayor a menor',
      enunciado: 'Escribe 3 − x² + 5x⁴ + x ordenado de mayor a menor exponente. ¿Queda completo?',
      datos: [DC.ordenado, DC.completo],
      solucion: [{ texto: 'Los exponentes son 0, 2, 4 y 1. De mayor a menor: 4, 2, 1 y 0. Falta el de x³.', ecuacion: [RES('5x⁴ − x² + x + 3'), ':  ordenado, pero no completo'] }],
      respuesta: [RES('5x⁴ − x² + x + 3'), '; no queda completo: falta x³'] },
    { nivel: 1, titulo: 'Contar las casillas',
      enunciado: '¿Cuántos términos tiene un polinomio completo de grado 7?',
      datos: [DC.completo],
      solucion: [{ texto: 'Hay una casilla por cada potencia, de x⁷ a x¹ y, además, la de x⁰.', ecuacion: ['7 + 1 = ', RES('8')] }],
      respuesta: [RES('8'), ' términos'] },
    { nivel: 1, titulo: 'Los ceros que faltan',
      enunciado: 'Escribe x⁴ − 2x + 3 completo y ordenado.',
      datos: [DC.completo, DC.cero],
      figura: CAS(4, { 4: 1, 1: -2, 0: 3 }),
      solucion: [{ texto: 'Faltan x³ y x²: van con coeficiente 0.', ecuacion: ['x⁴ + ', OLV('0'), 'x³ + ', OLV('0'), 'x² − 2x + 3'] }],
      respuesta: [RES('x⁴ + 0x³ + 0x² − 2x + 3')] },
    { nivel: 1, titulo: 'El mismo grado',
      enunciado: '¿Es homogéneo x³ + 2x²y − y³?',
      datos: [DC.homog, DC.term],
      figura: ME([[1, 3, 0], [2, 2, 1], [-1, 0, 3]], { grado: '?' }),
      solucion: [{ texto: 'Los grados de los términos son 3, 2 + 1 = 3 y 3: todos iguales.', ecuacion: [RES('Sí'), ': es homogéneo de grado 3'] }],
      respuesta: [RES('Sí'), ', de grado 3'] },
    { nivel: 2, titulo: 'Cuántos faltan',
      enunciado: 'Un polinomio de grado 4 tiene solo 2 términos escritos. ¿Cuántos términos de coeficiente 0 le faltan para estar completo?',
      datos: [DC.completo, DC.cero],
      solucion: [
        { texto: 'Completo, tendría una casilla por cada potencia, de x⁴ a x⁰.', ecuacion: ['4 + 1 = 5 casillas'] },
        { texto: 'Dos ya tienen número; las demás llevan 0.', ecuacion: ['5 − 2 = ', RES('3')] },
      ],
      respuesta: [RES('3'), ' términos'] },
    { nivel: 2, titulo: 'El grado de un homogéneo',
      enunciado: '¿Es homogéneo x²y³ − 4xy⁴ + y⁵? Si lo es, ¿de qué grado?',
      datos: [DC.homog, DC.term],
      solucion: [
        { texto: 'Sumo los exponentes de cada término.', ecuacion: ['2 + 3 = 5,   1 + 4 = 5,   0 + 5 = 5'] },
        { texto: 'Los tres tienen el mismo grado: es homogéneo, y ese es su grado.', ecuacion: ['Grado ', RES('5')] },
      ],
      respuesta: ['Sí, homogéneo de grado ', RES('5')] },
    { nivel: 2, titulo: 'Un exponente para ser homogéneo',
      enunciado: ['¿Qué valor de m hace homogéneo a 2', { sup: ['x', 'm'] }, 'y³ + 5x⁴y² − y⁶?'],
      datos: [DC.homog, DC.term],
      solucion: [
        { texto: 'Los dos últimos términos tienen grado 4 + 2 = 6 y 6. El primero tiene grado m + 3.', ecuacion: ['m + 3 = 6'] },
        { texto: 'Despejo m.', ecuacion: ['m = 6 − 3 = ', RES('3')] },
      ],
      respuesta: ['m = ', RES('3')] },
    { nivel: 2, titulo: 'Ordenado al revés',
      enunciado: '¿Está ordenado 4 + x − 3x² + 2x³? ¿En qué sentido? ¿Es completo?',
      datos: [DC.ordenado, DC.completo],
      figura: CAS(3, { 0: 4, 1: 1, 2: -3, 3: 2 }, { orden: 'sube' }),
      solucion: [
        { texto: 'Los exponentes, de izquierda a derecha, son 0, 1, 2 y 3: solo suben.', ecuacion: ['0 < 1 < 2 < 3'] },
        { texto: 'Están todas las potencias, de x⁰ a x³, sin casillas vacías: también es completo.', ecuacion: ['x⁰,  x,  x²,  x³'] },
      ],
      respuesta: [RES('Ordenado en forma creciente'), ' y ', RES('completo')] },
    { nivel: 2, titulo: 'Exponentes por hallar',
      enunciado: ['P(x) = ', { sup: ['x', 'a'] }, ' + 2', { sup: ['x', 'b'] }, ' − ', { sup: ['x', 'c'] }, ' + 5 es completo y está ordenado de mayor a menor. ¿Cuánto vale a + b + c?'],
      datos: [DC.completo, DC.ordenado],
      solucion: [
        { texto: 'Tiene cuatro términos y es completo: su grado es 3. Ordenado de mayor a menor, los exponentes son 3, 2, 1 y 0.', ecuacion: ['a = 3,   b = 2,   c = 1'] },
        { texto: 'Sumo.', ecuacion: ['3 + 2 + 1 = ', RES('6')] },
      ],
      respuesta: ['a + b + c = ', RES('6')] },
    { nivel: 3, titulo: 'Cuatro exponentes en orden',
      enunciado: ['P(x) = 4', { sup: ['x', 'a − 1'] }, ' + 3', { sup: ['x', 'b + 2'] }, ' − ', { sup: ['x', 'c − 3'] }, ' + 2', { sup: ['x', 'd'] }, ' es completo y está ordenado de forma decreciente. ¿Cuánto vale a · c?'],
      alternativas: ['16', '5', '−4', '3', '8'],
      datos: [DC.completo, DC.ordenado],
      solucion: [
        { texto: 'Cuatro términos, completo: grado 3. Decreciente: los exponentes son 3, 2, 1 y 0, en ese orden.', ecuacion: ['a − 1 = 3,   b + 2 = 2,   c − 3 = 1,   d = 0'] },
        { texto: 'Despejo a y c, y multiplico.', ecuacion: ['a = 4,   c = 4,   a · c = ', RES('16')] },
        { texto: ['La ', letra('B'), ' ordena de menor a mayor: a − 1 = 0 y c − 3 = 2, con a = 1 y c = 5. La ', letra('C'), ' despeja al revés: a = 2 y c = −2.'] },
        { texto: ['La ', letra('D'), ' multiplica los exponentes sin despejar, 3 · 1. La ', letra('E'), ' suma a + c en vez de multiplicar.'] },
      ],
      respuesta: [letra('A'), ', ', RES('16')] },
    { nivel: 3, titulo: 'Homogéneo con dos letras por hallar',
      enunciado: ['P(x, y) = ', { sup: ['x', 'a'] }, 'y³ + 2x⁵', { sup: ['y', 'b'] }, ' − x²y⁶ es homogéneo. ¿Cuánto vale a · b?'],
      alternativas: ['12', '8', '64', '40', '15'],
      datos: [DC.homog, DC.term],
      solucion: [
        { texto: 'El último término tiene grado 2 + 6 = 8: todos deben tener grado 8.', ecuacion: ['a + 3 = 8,   5 + b = 8'] },
        { texto: 'Despejo y multiplico.', ecuacion: ['a = 5,   b = 3,   a · b = ', RES('15')] },
        { texto: ['La ', letra('A'), ' copia los exponentes del último término, a = 2 y b = 6: se piden grados iguales. La ', letra('B'), ' da el grado común.'] },
        { texto: ['La ', letra('C'), ' pone 8 como cada exponente. La ', letra('D'), ' despeja a, pero toma b = 8.'] },
      ],
      respuesta: [letra('E'), ', ', RES('15')] },
    { nivel: 3, titulo: 'Términos que dependen de n',
      enunciado: ['Un polinomio completo P(x) tiene grado 2n y n + 8 términos. ¿Cuál es su grado?'],
      alternativas: ['7', '15', '16', '14', '18'],
      datos: [DC.completo, 'Completo de grado g: tiene g + 1 términos'],
      solucion: [
        { texto: 'Con grado 2n, completo, tiene 2n + 1 términos. Eso debe ser n + 8.', ecuacion: ['2n + 1 = n + 8  →  n = 7'] },
        { texto: 'El grado es 2n.', ecuacion: ['2 · 7 = ', RES('14')] },
        { texto: ['La ', letra('A'), ' responde n = 7, no el grado. La ', letra('B'), ' responde el número de términos, 7 + 8 = 15.'] },
        { texto: ['La ', letra('C'), ' olvida x⁰: 2n = n + 8, n = 8 y grado 16. La ', letra('E'), ' resta el 1: 2n − 1 = n + 8, n = 9 y grado 18.'] },
      ],
      respuesta: [letra('D'), ', grado ', RES('14')] },
    { nivel: 3, titulo: 'Las tres palabras a la vez',
      enunciado: '¿Cuál de estos polinomios es homogéneo, completo respecto a x y está ordenado de forma decreciente respecto a x?',
      alternativas: ['x³ + xy² − y³', 'x²y + 3x³ − y³', 'x³ − 2x²y + xy² + 4y³', 'x³ + x²y + y²', 'x² + xy + y² + x'],
      datos: [DC.homog, DC.completo, DC.ordenado],
      solucion: [
        { texto: 'En x³ − 2x²y + xy² + 4y³ los exponentes de x son 3, 2, 1 y 0: bajan y no falta ninguno. Cada término tiene grado 3.', ecuacion: ['3,   2 + 1,   1 + 2,   3: todos de grado 3'] },
        { texto: 'Cumple las tres.', ecuacion: [RES('x³ − 2x²y + xy² + 4y³')] },
        { texto: ['La ', letra('A'), ' no es completa respecto a x: falta x². La ', letra('B'), ' no está ordenada: el exponente de x sube de 2 a 3.'] },
        { texto: ['La ', letra('D'), ' no es homogénea: y² tiene grado 2. La ', letra('E'), ' tampoco: x tiene grado 1 y los demás, 2.'] },
      ],
      respuesta: [letra('C'), ', ', RES('x³ − 2x²y + xy² + 4y³')] },
    { nivel: 3, titulo: 'Los ceros dicen el grado',
      enunciado: 'Para completar un polinomio P(x) hubo que agregarle 4 términos de coeficiente 0. Antes tenía 3 términos escritos. ¿Cuál es su grado?',
      alternativas: ['6', '7', '1', '12', '8'],
      datos: [DC.completo, 'Completo de grado g: tiene g + 1 términos'],
      solucion: [
        { texto: 'Completo tiene los escritos más los ceros agregados.', ecuacion: ['3 + 4 = 7 términos'] },
        { texto: 'Con g + 1 = 7 términos, el grado es 6.', ecuacion: ['g = 7 − 1 = ', RES('6')] },
        { texto: ['La ', letra('B'), ' da el número de términos, no el grado. La ', letra('C'), ' resta 4 − 3.'] },
        { texto: ['La ', letra('D'), ' multiplica 3 · 4. La ', letra('E'), ' suma el 1 en vez de restarlo: 7 + 1.'] },
      ],
      respuesta: [letra('A'), ', grado ', RES('6')] },
  ];

  const especiales = {
    id: 'completo-ordenado',
    titulo: 'Completo, ordenado y homogéneo',
    pregunta: '¿Cuántos términos tiene un polinomio completo?',
    temas: ['Polinomios especiales'],
    pieza: 'alg-losetas',
    aprendizaje: 'Un polinomio completo de grado n tiene n + 1 términos, contando los de coeficiente 0; es homogéneo si todos sus términos tienen el mismo grado.',
    actividad: 'Acomodar un pedido en un casillero con una casilla por potencia.',
    // Lee: el casillero, ordenar y el término de x⁰. No dice cuántas casillas tiene un polinomio de grado n.
    lee: {
      tarjetas: [
        { titulo: 'El casillero de la tienda', texto: 'La tienda guarda cada pieza en su casilla: el bloque, que llena x³; la loseta, x²; la tira, x; y el cuadradito, x⁰. Un pedido se apunta con un número en cada casilla.',
          pieza: 'alg-losetas', dibujo: CAS(3, { 3: 1, 2: 3, 1: 4, 0: -2 }, { iconos: true }) },
        { titulo: 'Ordenado y homogéneo', texto: 'Está ordenado si sus exponentes solo bajan, como en 2x³ + x² − x + 4, o solo suben, como en 5 − x + x³. Es homogéneo si sus términos tienen igual grado: en x²y + xy², los dos tienen 3.' },
        { titulo: 'El término sin x', texto: 'x⁰ = 1, así que el término sin x es el de x⁰. Si una casilla no tiene piezas, el pedido no la nombra y la casilla queda vacía.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia el pedido y el orden. Mira cuántas casillas tiene el casillero y cuáles quedan vacías.' },
      ],
    },
    ejemplos: EJEMPLOS_COMPLETO,
    juega: {
      pieza: 'alg-losetas',
      consigna: 'Rubén apunta sus pedidos en desorden. El casillero tiene una casilla por potencia de x.',
      mision: {
        texto: ['Acomoda ', MISION4, ' en el casillero, de la potencia mayor a la menor.'],
        logrado: v => v.p === MISION4 && v.o === 'baja',
        bien: 'Listo: ordenado de mayor a menor y sin casillas vacías. ¿A otro pedido le queda alguna?',
      },
      voz: 'Cada número va a la casilla de su potencia.',
      leyenda: [
        { s: EX('x³'), t: 'casilla de los bloques' },
        { s: 'x⁰', t: 'casilla de los cuadraditos: el término sin x' },
        { s: 'casilla punteada', t: 'vacía, como en el pedido x³ + 7' },
      ],
      controles: [
        { id: 'p', etiqueta: 'Pedido', opciones: Object.keys(POLS4).map(t => ({ valor: t, texto: t })), inicio: MISION4 },
        { id: 'o', etiqueta: 'Orden del casillero', opciones: [{ valor: 'escrito', texto: 'Como lo apuntó' }, { valor: 'baja', texto: 'De mayor a menor' }, { valor: 'sube', texto: 'De menor a mayor' }], inicio: 'escrito' },
      ],
      dibujo: v => {
        const ts = POLS4[v.p], n = Math.max(...ts.map(t => t[1]));
        return CAS(n, coefDe(ts), { iconos: true, escrito: `Apuntó: ${v.p}`, orden: v.o === 'escrito' ? ts.map(t => t[1]) : v.o });
      },
      // La relación: lo que se lee en el casillero, en su orden, y cuántas casillas tiene y cuántas quedan vacías.
      lectura: v => {
        const ts = POLS4[v.p], n = Math.max(...ts.map(t => t[1])), vacias = n + 1 - ts.length;
        const orden = v.o === 'escrito' ? ts : [...ts].sort((a, b) => (v.o === 'baja' ? b[1] - a[1] : a[1] - b[1]));
        return [`${escribir(orden)}: de `, EX(`x${sup(n)}`), ` a x⁰, ${n + 1} casillas, ${vacias ? `${vacias} ${vacias === 1 ? 'vacía' : 'vacías'}` : 'ninguna vacía'}`];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'Si x⁵ − 3x² + 1 se escribe completo y ordenado, ¿cuántos términos tiene?',
      datos: [DC.cero, DC.x0],
      voz: 'Imagina el casillero entero, de la potencia mayor a x⁰.',
      opciones: [
        { id: 'c', texto: '6', correcta: true },
        { id: 'sin-ceros', texto: '3', error: 'PO1', siFuera: 'Bien los tres términos escritos. Pero completo pide también los de coeficiente 0.' },
        { id: 'sin-x0', texto: '5', error: 'PO9', siFuera: 'Bien contar de x⁵ a x¹. Pero falta la casilla de x⁰, la del término independiente.' },
        { id: 'cuatro', texto: '4', error: 'TAL-COMPLETO', siFuera: 'Bien agregar algo. Pero completar no es agregar un término: va una casilla por cada potencia.' },
      ],
      dibujo: CAS(5, { 5: 1, 2: -3, 0: 1 }, { solo: [5, 2, 0] }),
      revelar: CAS(5, { 5: 1, 2: -3, 0: 1 }, { ceros: true }),
      coincide: 'Coincide: de x⁵ a x⁰ hay 6 casillas, y tres llevan 0.',
      noCoincide: 'Revisemos: escribe una casilla por potencia, x⁵, x⁴, x³, x², x y x⁰, y cuéntalas.',
    },
    mira: {
      pieza: 'alg-losetas',
      datos: { objeto: 'casillero', grado: 5, filas: [{ coef: { 5: 1, 2: -3, 0: 1 } }], colorPot: 'o',
        pasos: [{ solo: [5, 2, 0] }, {}, { ceros: true }, { ceros: true }, { objeto: 'medidas', terminos: [[1, 2, 1], [3, 1, 2], [-1, 0, 3]], grado: true }] },
      voz: 'Una casilla por potencia, aunque esté vacía.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Los tres términos escritos, cada uno en la casilla de su potencia.', ecuacion: ['x⁵ − 3x² + 1'] },
        { estado: { paso: 1 }, texto: 'El casillero va de x⁵ a x⁰: entre ellas faltan x⁴, x³ y x.', ecuacion: ['x⁵ + □x⁴ + □x³ − 3x² + □x + 1'] },
        { estado: { paso: 2 }, texto: 'Las casillas vacías llevan 0. Así queda completo y ordenado.', ecuacion: ['x⁵ + ', OLV('0'), 'x⁴ + ', OLV('0'), 'x³ − 3x² + ', OLV('0'), 'x + 1'] },
        { estado: { paso: 3 }, texto: 'De x⁵ a x⁰ hay 5 + 1 casillas: grado n, n + 1 términos.', ecuacion: ['5 + 1 = ', RES('6'), ' términos'] },
        { estado: { paso: 4 }, texto: 'Homogéneo mira el grado de cada término: en x²y + 3xy² − y³, todos tienen 3.', ecuacion: ['2 + 1 = 1 + 2 = 0 + 3 = ', RES('3')] },
      ],
    },
    regla: {
      texto: 'Completo: tiene cada potencia de x, de su grado n a x⁰: n + 1 términos. Ordenado: sus exponentes solo bajan o solo suben. Homogéneo: sus términos tienen igual grado.',
      ecuacion: ['completo de grado n: ', { llave: ['n + 1 términos'], nota: 'con los de coeficiente 0', color: 'c-f' }],
      condicion: 'los términos que faltan se cuentan con coeficiente 0; para ser homogéneo se mira el grado de cada término, no sus exponentes.',
      voz: 'Ninguna casilla vacía: completo. Todos los términos del mismo grado: homogéneo.',
      dibujo: CAS(5, { 5: 1, 2: -3, 0: 1 }, { ceros: true }),
    },
    // Así se resuelve: completar y ordenar un pedido escrito en desorden (el objeto). «Ahora tú» pide contar términos,
    // contar ceros, un exponente para ser homogéneo o exponentes con parámetro.
    resuelve: {
      pieza: 'alg-losetas',
      generar(s) {
        const r = azar(s + 900), n = r.ent(3, 5), m = r.ent(2, n);
        const exps = [n, 0]; while (exps.length < m) { const e = r.ent(0, n - 1); if (!exps.includes(e)) exps.push(e); }
        const ts = r.ent(0, 1) ? [...exps].reverse().map(e => [r.noCero(-6, 7), e]) : exps.map(e => [r.noCero(-6, 7), e]);
        const desorden = [...ts.slice(1), ts[0]];
        const cs = Array(n + 1).fill(0); ts.forEach(([c, e]) => { cs[n - e] = c; });
        const conCeros = cs.map((c, k) => { const e = n - k, lit = e === 0 ? '' : e === 1 ? 'x' : `x${sup(e)}`; if (c === 0) return `${k ? ' + ' : ''}0${lit}`; return mono(c, [['x', e]], k === 0); }).join('');
        const faltan = n + 1 - m;
        return {
          enunciado: `Rubén apuntó el pedido ${escribir(desorden)}. ¿Cómo se escribe completo y ordenado de mayor a menor?`,
          datos: [DC.completo, DC.ordenado, DC.cero],
          dibujo: CAS(n, coefDe(ts), { iconos: n <= 3 }),
          pasos: [
            { tipo: 'pide', texto: 'Piden el mismo pedido con una casilla por potencia, de la mayor a x⁰.' },
            { tipo: 'regla', texto: `El grado es ${n}: el casillero va de x${sup(n)} a x⁰. Cada número va a la casilla de su potencia, y las vacías llevan 0.` },
            { tipo: 'cuentas', texto: `Acomodo los términos de mayor a menor exponente y pongo 0 en ${faltan === 1 ? 'la casilla que falta' : `las ${faltan} casillas que faltan`}.`,
              ecuacion: [RES(conCeros)], dibujo: CAS(n, coefDe(ts), { ceros: true, iconos: n <= 3 }) },
            { tipo: 'sentido', texto: `Comprueba: quedan ${n + 1} términos, ${m} con número y ${faltan} con 0, y los exponentes bajan de ${n} a 0. El valor no cambia: sumar 0 no agrega nada.` },
          ],
          respuesta: [RES(conCeros)],
        };
      },
    },
    ahoraTu: {
      voz: 'Una casilla por potencia, de la mayor a x⁰.',
      generar(sem) {
        const r = azar(sem + 73), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoTotal, r);
        if (tipo === 1) return conCuatro(casoCeros, r);
        if (tipo === 2) return conCuatro(casoHomogeneo, r);
        return conCuatro(casoParametros, r);
      },
    },
  };

  // ---------- Idea 5 (fase 3, 19 nov): polinomios idénticos ----------
  // Objeto: dos pedidos en el casillero, uno debajo del otro (alg-losetas, 'casillero', con ✓ o ✗ bajo cada potencia);
  // la predicción usa los dos pedidos con losetas de 1 dm y de 3 dm ('tamano').
  // Cambia: los coeficientes a y b de P · Permanece: Q · Progresa: las casillas que coinciden · Se reserva: dos pedidos
  // distintos que cubren lo mismo con una sola loseta (la predicción) · Debe verse: idénticos es el mismo número en cada
  // casilla, y entonces valen lo mismo con cualquier loseta.
  // Colores: P (el primero) naranja, Q (el segundo) turquesa, lo que se halla violeta.
  // Errores: TAL-UNVALOR un valor común basta · TAL-COEF no ve que los coeficientes ya deciden · TAL-CUENTA-PIEZAS compara
  // cuántas piezas hay y no cuáles · AL16 despeja con el signo cambiado · TAL-COEF-Q da los coeficientes de Q ·
  // TAL-DESPEJA-UNO despeja una sola letra · TAL-SIGNO pierde un signo · TAL-NULO pone 0 a las letras y no a los
  // coeficientes · TAL-PIDE responde otra cosa · TAL-SISTEMA-SIGNO arma el sistema con un signo cambiado.
  const DOS = (grado, cp, cq, extra) => LO(Object.assign({ objeto: 'casillero', grado, filas: [{ nombre: 'P', coef: cp, color: 'o' }, { nombre: 'Q', coef: cq, color: 'i' }], marcas: true }, extra));
  const DI = {
    ident: 'P ≡ Q (idénticos): el mismo coeficiente en cada potencia de x',
    nulo: 'Idénticamente nulo (≡ 0): todos sus coeficientes valen 0',
    semej: 'Antes de comparar, se juntan los términos semejantes',
    dist: 'k(x + p) = kx + kp, con k y p números',
  };
  const Qcs = [2, 5, 3];
  // Ahora tú 1: m y n por igualdad de coeficientes.
  function casoMN(r) {
    const p = r.ent(1, 5), q = r.ent(1, 5), A = r.noCero(-4, 6), B = r.noCero(-4, 8), c = r.noCero(-5, 5);
    const m = A + p, n = B - q, suma = r.ent(0, 1) === 1;
    const val = (mm, nn) => (suma ? mm + nn : mm * nn), pide = suma ? 'm + n' : 'm · n';
    return {
      pregunta: [P, `(x) = (m − ${p})x² + (n + ${q})x ${c < 0 ? '−' : '+'} ${Math.abs(c)} y `, Q, `(x) = ${poli([A, B, c])} son idénticos. ¿Cuánto vale ${pide}?`],
      datos: [DI.ident],
      opciones: ops([
        { id: 'c', texto: f(val(m, n)), correcta: true },
        { id: 'signos', texto: f(val(A - p, B + q)), error: 'AL16', siFuera: `Bien igualar casilla por casilla. Pero al despejar, el ${p} pasa sumando y el ${q}, restando.` },
        { id: 'coef', texto: f(val(A, B)), error: 'TAL-COEF-Q', siFuera: `Esos son los coeficientes de Q. m − ${p} es el coeficiente: falta despejar m, y también n.` },
        { id: 'uno', texto: f(val(m, B)), error: 'TAL-DESPEJA-UNO', siFuera: `Bien m = ${f(m)}. Pero n + ${q} = ${f(B)}: n vale ${f(B)} − ${q}.` },
      ]),
      solucion: { texto: 'Se iguala cada casilla: la de x² y la de x.', ecuacion: [`m − ${p} = ${f(A)} → m = ${f(m)},  n + ${q} = ${f(B)} → n = ${f(n)},  ${pide} = `, RES(f(val(m, n)))] },
    };
  }
  // Ahora tú 2: tres coeficientes, repartidos entre los dos lados.
  function casoTres(r) {
    const a = r.noCero(-5, 6), b = r.noCero(-6, 6), c = r.noCero(-7, 7);
    const bien = a + b + c;
    return {
      pregunta: ['Si ', P1(`ax² ${b < 0 ? '−' : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}x + c`), ' ≡ ', P2(`${mono(a, [['x', 2]], true)} + bx ${c < 0 ? '−' : '+'} ${Math.abs(c)}`), ', ¿cuánto vale a + b + c?'],
      datos: [DI.ident],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'signo', texto: f(a + b - c), error: 'TAL-SIGNO', siFuera: `Bien a = ${f(a)} y b = ${f(b)}. Pero c es el término sin x de la derecha, con su signo: ${f(c)}.` },
        { id: 'dos', texto: f(a + c), error: 'TAL-DESPEJA-UNO', siFuera: `Bien a y c. Pero b es el coeficiente de x a la izquierda: b = ${f(b)}.` },
        { id: 'abs', texto: f(Math.abs(a) + Math.abs(b) + Math.abs(c)), error: 'PO21', siFuera: 'Bien cada casilla. Pero cada coeficiente va con su signo.' },
      ]),
      solucion: { texto: 'Casilla por casilla: x², x y el término sin x.', ecuacion: [`a = ${f(a)},  b = ${f(b)},  c = ${f(c)},  a + b + c = `, RES(f(bien))] },
    };
  }
  // Ahora tú 3: idénticamente nulo.
  function casoNulo(r) {
    const p = r.noCero(-5, 6), q = r.noCero(-5, 6), s = r.noCero(-5, 6);
    const t = (L, k) => (k > 0 ? `(${L} − ${k})` : `(${L} + ${-k})`);
    const bien = p + q + s;
    return {
      pregunta: [`Si ${t('a', p)}x² + ${t('b', q)}x + ${t('c', s)} ≡ 0, ¿cuánto vale a + b + c?`],
      datos: [DI.nulo],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'signo', texto: f(-bien), error: 'AL16', siFuera: 'Bien que cada coeficiente valga 0. Pero al despejar, el número pasa con el signo cambiado.' },
        { id: 'cero', texto: '0', error: 'TAL-NULO', siFuera: 'Lo que vale 0 es cada coeficiente, no cada letra: a − algo = 0.' },
        { id: 'dos', texto: f(p + q), error: 'TAL-DESPEJA-UNO', siFuera: 'Bien a y b. Pero el término sin x también vale 0: falta c.' },
      ]),
      solucion: { texto: 'Cada coeficiente vale 0.', ecuacion: [`a = ${f(p)},  b = ${f(q)},  c = ${f(s)},  a + b + c = `, RES(f(bien))] },
    };
  }
  // Ahora tú 4 (examen): un sistema que sale de la identidad.
  function casoSistema(r) {
    let a, b, p, q;
    do { a = r.noCero(-4, 6); b = r.noCero(-4, 6); p = r.ent(1, 4); q = r.ent(1, 4); } while (a === b || a + b === 0 || p * a - q * b === 0);
    const S = a + b, T = p * a - q * b;
    // Con el signo de q cambiado: a + b = S y pa + qb = T.
    const den = p - q, bm = den !== 0 ? (T - p * S) / (q - p) : NaN, am = S - bm;
    const malo = Number.isInteger(bm) ? am * bm : null;
    return {
      pregunta: [`Si a(x + ${p}) + b(x − ${q}) ≡ ${poli([S, T])}, ¿cuánto vale a · b?`],
      datos: [DI.ident, DI.dist],
      opciones: ops([
        { id: 'c', texto: f(a * b), correcta: true },
        { id: 'suma', texto: f(S), error: 'TAL-PIDE', siFuera: `Bien: a + b = ${f(S)}. Pero piden a · b: falta resolver el sistema.` },
        { id: 'dato', texto: f(S * T), error: 'TAL-COEF-Q', siFuera: 'Esos son los coeficientes de la derecha, multiplicados. Antes hay que hallar a y b.' },
        malo !== null && malo !== a * b ? { id: 'signo', texto: f(malo), error: 'TAL-SISTEMA-SIGNO', siFuera: `Bien la casilla de x. Pero en el término sin x, b(x − ${q}) da −${q}b.` } : null,
        { id: 'uno', texto: f(a), error: 'TAL-DESPEJA-UNO', siFuera: `Bien a = ${f(a)}. Pero piden a · b.` },
      ].filter(Boolean)),
      solucion: { texto: `La casilla de x da a + b = ${f(S)}; la del término sin x, ${p === 1 ? '' : p}a − ${q === 1 ? '' : q}b = ${f(T)}.`, ecuacion: [`a = ${f(a)},  b = ${f(b)},  a · b = `, RES(f(a * b))] },
    };
  }

  // Ejemplos de la idea 5. Cuentas rehechas aparte (e5-algebra/cuentas-fase3.py, comparando los dos lados en cinco valores
  // de x): idénticos sí y no; a = 4, b = −3, c = 7; a = 7; x² y 3x − 2 coinciden en 1 y 2, no idénticos; m + n = 0;
  // a + b + c = 2; a + b + c = 4; a = 3, b = 4; a = 5, b = 3; a · b = 12 (errores 7, 35, −18 y 4); a + b + c = −2
  // (errores 6, 0, 2 y −4); a · b · c = 24 (errores 9, 20, −96 y 10); a · b + c = 25 (errores 9, 20, −85 y 29);
  // a + b − c = 9 (errores 3, 0, −3 y 6).
  const EJEMPLOS_IGUALDAD = [
    { nivel: 1, titulo: 'El mismo pedido en otro orden',
      enunciado: ['¿Son idénticos ', P1('3x² − x + 5'), ' y ', P2('5 − x + 3x²'), '?'],
      datos: [DI.ident],
      figura: DOS(2, { 2: 3, 1: -1, 0: 5 }, { 2: 3, 1: -1, 0: 5 }, { marcas: false }),
      solucion: [{ texto: 'En x² los dos tienen 3; en x, −1; sin x, 5. Solo cambió el orden en que se escribieron.', ecuacion: [P1('3x² − x + 5'), ' ≡ ', P2('5 − x + 3x²')] }],
      respuesta: [RES('Sí'), ': el mismo coeficiente en cada casilla'] },
    { nivel: 1, titulo: 'Los coeficientes cambiados',
      enunciado: ['¿Son idénticos ', P1('x² + 2x'), ' y ', P2('2x² + x'), '?'],
      datos: [DI.ident],
      solucion: [{ texto: 'En x², el primero tiene 1 y el segundo, 2. Basta una casilla distinta.', ecuacion: ['1 ≠ 2 en x²'] }],
      respuesta: [RES('No'), ': en x² tienen 1 y 2'] },
    { nivel: 1, titulo: 'Tres casillas, tres valores',
      enunciado: ['Si ', P1('ax² + bx + c'), ' ≡ ', P2('4x² − 3x + 7'), ', ¿cuánto valen a, b y c?'],
      datos: [DI.ident],
      solucion: [{ texto: 'Cada casilla de la izquierda vale lo que la misma casilla de la derecha, con su signo.', ecuacion: ['a = ', RES('4'), ',   b = ', RES('−3'), ',   c = ', RES('7')] }],
      respuesta: ['a = ', RES('4'), ', b = ', RES('−3'), ', c = ', RES('7')] },
    { nivel: 1, titulo: 'Un coeficiente con letra',
      enunciado: ['Si ', P1('(a − 1)x + 5'), ' ≡ ', P2('6x + 5'), ', ¿cuánto vale a?'],
      datos: [DI.ident],
      solucion: [{ texto: 'En la casilla de x: a − 1 debe valer 6.', ecuacion: ['a − 1 = 6  →  a = ', RES('7')] }],
      respuesta: ['a = ', RES('7')] },
    { nivel: 1, titulo: 'Coinciden en dos valores',
      enunciado: ['P(x) = x² y Q(x) = 3x − 2 valen lo mismo en x = 1 y en x = 2. ¿Son idénticos?'],
      datos: [DI.ident],
      solucion: [{ texto: 'En x = 1 valen 1 y 1; en x = 2, 4 y 4. Pero en x² uno tiene 1 y el otro, 0: con x = 0 valen 0 y −2.', ecuacion: ['P(0) = 0 ≠ −2 = Q(0)'] }],
      respuesta: [RES('No'), ': coincidir en dos valores no basta'] },
    { nivel: 2, titulo: 'Dos letras por hallar',
      enunciado: ['Si ', P1('(m − 2)x² + (n + 3)x − 1'), ' ≡ ', P2('5x² − 4x − 1'), ', ¿cuánto vale m + n?'],
      datos: [DI.ident],
      solucion: [
        { texto: 'Igualo la casilla de x² y la de x.', ecuacion: ['m − 2 = 5  →  m = 7,   n + 3 = −4  →  n = −7'] },
        { texto: 'Sumo.', ecuacion: ['7 + (−7) = ', RES('0')] },
      ],
      respuesta: ['m + n = ', RES('0')] },
    { nivel: 2, titulo: 'Idénticamente nulo',
      enunciado: 'Si (a − 3)x² + (b + 2)x + (c − 1) ≡ 0, ¿cuánto vale a + b + c?',
      datos: [DI.nulo],
      solucion: [
        { texto: 'Cada coeficiente vale 0.', ecuacion: ['a − 3 = 0,   b + 2 = 0,   c − 1 = 0'] },
        { texto: 'Despejo y sumo.', ecuacion: ['3 + (−2) + 1 = ', RES('2')] },
      ],
      respuesta: ['a + b + c = ', RES('2')] },
    { nivel: 2, titulo: 'Letras a los dos lados',
      enunciado: ['Si ', P1('ax² + 5x − 3'), ' ≡ ', P2('2x² + bx + c'), ', ¿cuánto vale a + b + c?'],
      datos: [DI.ident],
      solucion: [
        { texto: 'En x², a = 2. En x, b = 5. Sin x, c = −3.', ecuacion: ['a = 2,   b = 5,   c = −3'] },
        { texto: 'Sumo con los signos.', ecuacion: ['2 + 5 − 3 = ', RES('4')] },
      ],
      respuesta: ['a + b + c = ', RES('4')] },
    { nivel: 2, titulo: 'Primero se desarrolla',
      enunciado: ['Si ', P1('a(x + 1) + b'), ' ≡ ', P2('3x + 7'), ', ¿cuánto valen a y b?'],
      datos: [DI.ident, DI.dist],
      solucion: [
        { texto: 'Desarrollo la izquierda y junto lo que no tiene x.', ecuacion: ['ax + (a + b)'] },
        { texto: 'En x: a = 3. Sin x: a + b = 7.', ecuacion: ['a = ', RES('3'), ',   b = 7 − 3 = ', RES('4')] },
      ],
      respuesta: ['a = ', RES('3'), ' y b = ', RES('4')] },
    { nivel: 2, titulo: 'Una suma y una resta',
      enunciado: ['Si ', P1('(a + b)x² + (a − b)x'), ' ≡ ', P2('8x² + 2x'), ', ¿cuánto valen a y b?'],
      datos: [DI.ident],
      solucion: [
        { texto: 'Cada casilla da una ecuación.', ecuacion: ['a + b = 8,   a − b = 2'] },
        { texto: 'Sumo las dos: 2a = 10. Después, b = 8 − 5.', ecuacion: ['a = ', RES('5'), ',   b = ', RES('3')] },
      ],
      respuesta: ['a = ', RES('5'), ' y b = ', RES('3')] },
    { nivel: 3, titulo: 'Un sistema escondido',
      enunciado: ['Si ', P1('a(x + 2) + b(x − 1)'), ' ≡ ', P2('7x + 5'), ', ¿cuánto vale a · b?'],
      alternativas: ['7', '35', '−18', '4', '12'],
      datos: [DI.ident, DI.dist],
      solucion: [
        { texto: 'Desarrollo y junto: (a + b)x + (2a − b). Cada casilla da una ecuación.', ecuacion: ['a + b = 7,   2a − b = 5'] },
        { texto: 'Sumo las dos: 3a = 12, a = 4 y b = 3.', ecuacion: ['a · b = 4 · 3 = ', RES('12')] },
        { texto: ['La ', letra('A'), ' da a + b. La ', letra('B'), ' multiplica los coeficientes de la derecha, 7 · 5. La ', letra('D'), ' da solo a.'] },
        { texto: ['La ', letra('C'), ' pierde el signo de −b: con 2a + b = 5 sale a = −2 y b = 9.'] },
      ],
      respuesta: [letra('E'), ', ', RES('12')] },
    { nivel: 3, titulo: 'Nulo con letras encadenadas',
      enunciado: 'Si (a − 2)x² + (b + a)x + (c − b) ≡ 0, ¿cuánto vale a + b + c?',
      alternativas: ['−2', '6', '0', '2', '−4'],
      datos: [DI.nulo],
      solucion: [
        { texto: 'Cada coeficiente vale 0, en orden: primero a, después b y al final c.', ecuacion: ['a = 2,   b + 2 = 0 → b = −2,   c − (−2) = 0 → c = −2'] },
        { texto: 'Sumo.', ecuacion: ['2 − 2 − 2 = ', RES('−2')] },
        { texto: ['La ', letra('B'), ' toma b + a = 0 como b = a: b = 2 y c = 2. La ', letra('C'), ' pone 0 a las letras, no a los coeficientes.'] },
        { texto: ['La ', letra('D'), ' despeja a con el signo cambiado, a = −2: entonces b = 2, c = 2 y suman 2. La ', letra('E'), ' suma solo b y c.'] },
      ],
      respuesta: [letra('A'), ', ', RES('−2')] },
    { nivel: 3, titulo: 'Agrupar antes de comparar',
      enunciado: ['Si ', P1('ax² + b(x + 1) + c(x² − x)'), ' ≡ ', P2('5x² + x + 4'), ', ¿cuánto vale a · b · c?'],
      alternativas: ['9', '20', '24', '−96', '10'],
      datos: [DI.ident, DI.semej, DI.dist],
      solucion: [
        { texto: 'Desarrollo y junto los semejantes de la izquierda.', ecuacion: ['(a + c)x² + (b − c)x + b'] },
        { texto: 'Sin x: b = 4. En x: 4 − c = 1, c = 3. En x²: a + 3 = 5, a = 2.', ecuacion: ['a · b · c = 2 · 4 · 3 = ', RES('24')] },
        { texto: ['La ', letra('A'), ' suma a + b + c. La ', letra('B'), ' copia 5, 1 y 4 sin agrupar. La ', letra('E'), ' suma los coeficientes de la derecha.'] },
        { texto: ['La ', letra('D'), ' toma −cx como +cx: c = −3 y a = 8.'] },
      ],
      respuesta: [letra('C'), ', ', RES('24')] },
    { nivel: 3, titulo: 'Coeficientes con dos letras',
      enunciado: ['Si ', P1('(2a − b)x² + (a + b)x + 5'), ' ≡ ', P2('3x² + 9x + c'), ', ¿cuánto vale a · b + c?'],
      alternativas: ['9', '20', '−85', '25', '29'],
      datos: [DI.ident],
      solucion: [
        { texto: 'En x²: 2a − b = 3. En x: a + b = 9. Sin x: c = 5. Sumo las dos primeras: −b y b se anulan.', ecuacion: ['3a = 12  →  a = 4,   b = 9 − 4 = 5,   c = 5'] },
        { texto: 'Calculo lo que piden.', ecuacion: ['4 · 5 + 5 = ', RES('25')] },
        { texto: ['La ', letra('A'), ' da a + b. La ', letra('B'), ' da a · b y olvida c. La ', letra('E'), ' toma c = 9, el coeficiente de x.'] },
        { texto: ['La ', letra('C'), ' pierde el signo de −b: con 2a + b = 3 sale a = −6 y b = 15.'] },
      ],
      respuesta: [letra('D'), ', ', RES('25')] },
    { nivel: 3, titulo: 'Nulo y una resta al final',
      enunciado: 'Si (a − 3)x³ + (b − a)x + (c + b) ≡ 0, ¿cuánto vale a + b − c?',
      alternativas: ['3', '0', '−3', '6', '9'],
      datos: [DI.nulo],
      solucion: [
        { texto: 'Cada coeficiente vale 0: a = 3; b − a = 0, b = 3; c + b = 0, c = −3.', ecuacion: ['a = 3,   b = 3,   c = −3'] },
        { texto: 'Restar −3 es sumar 3.', ecuacion: ['3 + 3 − (−3) = ', RES('9')] },
        { texto: ['La ', letra('A'), ' calcula a + b + c. La ', letra('B'), ' pone 0 a las letras. La ', letra('D'), ' olvida c.'] },
        { texto: ['La ', letra('C'), ' toma b − a = 0 como b = −a: b = −3 y c = 3.'] },
      ],
      respuesta: [letra('E'), ', ', RES('9')] },
  ];

  const igualdad = {
    id: 'igualdad',
    titulo: 'Polinomios idénticos',
    pregunta: '¿Cuándo dos polinomios son el mismo polinomio?',
    temas: ['Igualdad de polinomios'],
    pieza: 'alg-losetas',
    aprendizaje: 'Dos polinomios son idénticos si tienen el mismo coeficiente en cada potencia; coincidir en un valor de x no basta.',
    actividad: 'Ajustar un pedido hasta que sea igual a otro, casilla por casilla.',
    // Lee: dos pedidos en el casillero y la palabra «idéntico». No dice si basta con un valor común (es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'Dos pedidos en el casillero', texto: 'Rubén apunta dos pedidos, P y Q, uno debajo del otro en el casillero. Así los compara casilla por casilla.',
          pieza: 'alg-losetas', dibujo: DOS(2, { 2: 2, 1: 1 }, { 2: 2, 1: 1 }, { marcas: false }) },
        { titulo: 'Escrito de otra forma', texto: 'x + 2x² y 2x² + x son el mismo pedido con los términos en otro orden. Dos polinomios que son el mismo se llaman idénticos, y se escribe P ≡ Q.',
          ecuacion: ['x + 2x² ≡ 2x² + x'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a mover dos coeficientes de P. Mira qué casillas cambian y cuántas coinciden con las de Q.' },
      ],
    },
    ejemplos: EJEMPLOS_IGUALDAD,
    juega: {
      pieza: 'alg-losetas',
      consigna: ['El pedido ', P1('P = mx² + (n − 1)x + 3'), ' tiene dos números que se pueden cambiar. El pedido ', P2('Q = 2x² + 5x + 3'), ' está fijo.'],
      mision: {
        texto: ['Ajusta m y n hasta que ', P1('P'), ' y ', P2('Q'), ' coincidan en las tres casillas.'],
        logrado: v => v.m === 2 && v.n === 6,
        bien: 'Listo: el mismo coeficiente en cada potencia. Son el mismo polinomio.',
      },
      voz: 'Una casilla a la vez. Las demás no se mueven.',
      leyenda: [
        { s: P1('P'), t: 'el pedido que ajustas' },
        { s: P2('Q'), t: 'el pedido fijo' },
        { s: '✓', t: 'el mismo número en P y en Q' },
        { s: '≡', t: 'idéntico: coinciden todas las casillas' },
      ],
      controles: [
        { id: 'm', etiqueta: 'm', min: -2, max: 5, paso: 1, inicio: 0, decimales: 0, color: 'c-o' },
        { id: 'n', etiqueta: 'n', min: -2, max: 8, paso: 1, inicio: 0, decimales: 0, color: 'c-o' },
      ],
      // Un coeficiente que el alumno puso en 0 es un número de P (naranja), no una casilla olvidada: va escrito «0».
      dibujo: v => DOS(2, { 2: v.m || '0', 1: (v.n - 1) || '0', 0: 3 }, { 2: 2, 1: 5, 0: 3 }),
      lectura: v => {
        const k = [v.m, v.n - 1, 3].filter((c, i) => c === Qcs[i]).length;
        return [`Coinciden ${k} de 3 casillas`, k === 3 ? ': ' : '', k === 3 ? P1('P') : '', k === 3 ? ' ≡ ' : '', k === 3 ? P2('Q') : ''];
      },
      minimo: 3,
    },
    predice: {
      pregunta: 'Con losetas de 1 dm de lado (x = 1), los pedidos x² + 1 y 2x cubren lo mismo: 2 dm². ¿Son el mismo polinomio?',
      datos: ['1² + 1 = 2', '2 · 1 = 2'],
      voz: 'Piensa en otro tamaño de loseta.',
      opciones: [
        { id: 'c', texto: 'No: con otra loseta cubren distinto', correcta: true },
        { id: 'un-valor', texto: 'Sí: valen lo mismo cuando x = 1', error: 'TAL-UNVALOR', siFuera: 'Bien: con x = 1 cubren 2 dm². Pero con losetas de 3 dm cubren 10 dm² y 6 dm².' },
        { id: 'piezas', texto: 'Sí: los dos tienen 2 piezas', error: 'TAL-CUENTA-PIEZAS', siFuera: 'Bien contadas: 2 piezas en cada pedido. Pero una loseta y un cuadradito no son dos tiras.' },
        { id: 'nose', texto: 'No se sabe sin probar más losetas', error: 'TAL-COEF', siFuera: 'Bien la duda. Pero los coeficientes ya deciden: en x² uno tiene 1 y el otro, 0.' },
      ],
      dibujo: LO({ objeto: 'tamano', filas: [{ nombre: 'P', cuenta: [1, 0, 1], color: 'o' }, { nombre: 'Q', cuenta: [0, 2, 0], color: 'i' }], lado: 1 }),
      revelar: LO({ objeto: 'tamano', filas: [{ nombre: 'P', cuenta: [1, 0, 1], color: 'o' }, { nombre: 'Q', cuenta: [0, 2, 0], color: 'i' }], lado: 3, areas: true }),
      coincide: 'Coincide: con losetas de 3 dm, x² + 1 cubre 10 dm² y 2x cubre 6 dm². Coincidir en un valor de x no basta.',
      noCoincide: 'Revisemos: prueba con losetas de 3 dm. Una loseta y un cuadradito cubren 9 + 1; dos tiras, 3 + 3.',
    },
    mira: {
      pieza: 'alg-losetas',
      datos: { objeto: 'tamano', filas: [{ nombre: 'P', cuenta: [1, 0, 1], color: 'o' }, { nombre: 'Q', cuenta: [0, 2, 0], color: 'i' }], areas: true, ladoMax: 3,
        pasos: [{ lado: 1 }, { lado: 3 },
          { objeto: 'casillero', grado: 2, filas: [{ nombre: 'P', coef: { 2: 1, 0: 1 }, color: 'o' }, { nombre: 'Q', coef: { 1: 2 }, color: 'i' }], ceros: true, marcas: true },
          { objeto: 'casillero', grado: 2, filas: [{ nombre: 'P', coef: { 2: 2, 1: 1 }, color: 'o' }, { nombre: 'Q', coef: { 2: 2, 1: 1 }, color: 'i' }], marcas: true },
          { objeto: 'casillero', grado: 2, filas: [{ nombre: 'P', coef: {}, color: 'o' }], ceros: true }] },
      voz: 'Primero con losetas; después, casilla por casilla.',
      pasos: [
        { estado: { paso: 0 }, texto: 'P(1): lo que cubre P con x = 1. Vale 2, como Q(1).', ecuacion: [P1('P'), '(1) = 2 = ', P2('Q'), '(1)'] },
        { estado: { paso: 1 }, texto: 'Con losetas de 3 dm ya no: la loseta creció más que las tiras.', ecuacion: [P1('P'), '(3) = 10,   ', P2('Q'), '(3) = 6'] },
        { estado: { paso: 2 }, texto: 'No coinciden: en x² hay 1 y 0; en x, 0 y 2.', ecuacion: ['x² + 0x + 1  ≢  0x² + 2x + 0'] },
        { estado: { paso: 3 }, texto: 'Si coinciden todas las casillas, cubren lo mismo con cualquier loseta: son idénticos.', ecuacion: [P1('2x² + x'), ' ≡ ', P2('x + 2x²')] },
        { estado: { paso: 4 }, texto: 'Con 0 en todas sus casillas, vale 0 para todo x: es idénticamente nulo.', ecuacion: ['0x² + 0x + 0 ≡ 0'] },
      ],
    },
    regla: {
      texto: 'Dos polinomios son idénticos (≡) si, juntos sus semejantes, tienen el mismo coeficiente en cada potencia de x: valen igual para todo x. Idénticamente nulo: todos sus coeficientes valen 0.',
      ecuacion: [{ sub: [aa, '2'] }, 'x² + ', { sub: [aa, '1'] }, 'x + ', { sub: [aa, '0'] }, ' ≡ ', { sub: [bb, '2'] }, 'x² + ', { sub: [bb, '1'] }, 'x + ', { sub: [bb, '0'] }, '  →  ',
        { llave: [{ sub: [aa, '2'] }, ' = ', { sub: [bb, '2'] }, ',  ', { sub: [aa, '1'] }, ' = ', { sub: [bb, '1'] }, ',  ', { sub: [aa, '0'] }, ' = ', { sub: [bb, '0'] }], nota: 'casilla por casilla', color: 'c-f' }],
      // a₂, a₁ y a₀ dichos en palabras (auditoría y lector B, 19 nov); el tope de la condición es de 22 palabras.
      condicion: 'a₂, a₁, a₀: coeficientes de x², x y x⁰ en el primero; b₂, b₁, b₀, del segundo. Un valor común no basta.',
      voz: 'Mismo número en cada casilla: mismo polinomio.',
      dibujo: DOS(2, { 2: 2, 1: 5, 0: 3 }, { 2: 2, 1: 5, 0: 3 }),
    },
    // Así se resuelve: comparar dos pedidos escritos en otro orden, casilla por casilla (el objeto). «Ahora tú» pide
    // hallar coeficientes: m y n, tres letras, idénticamente nulo o un sistema.
    resuelve: {
      pieza: 'alg-losetas',
      generar(s) {
        // Si no son iguales, cambia una sola casilla (antes se sorteaba casilla por casilla y cambiaban dos o tres, con
        // «una casilla es distinta» en la respuesta, y x = 2 a veces no los separaba; auditoría, 19 nov).
        const r = azar(s + 900), cs = [r.noCero(-5, 6), r.noCero(-6, 6), r.noCero(-7, 7)], iguales = s % 2 === 0, cambia = r.ent(0, 2);
        const qs = iguales ? cs.slice() : cs.map((c, k) => (k === cambia ? c + r.uno([-2, -1, 1, 2]) : c));
        const ord = [[qs[2], 0], [qs[0], 2], [qs[1], 1]].filter(t => t[0] !== 0);
        const qtxt = ord.map(([c, e], i) => mono(c, [['x', e]], i === 0)).join('');
        const dif = [2, 1, 0].filter((e, k) => cs[k] !== qs[k]);
        const cP = { 2: cs[0], 1: cs[1], 0: cs[2] }, cQ = { 2: qs[0], 1: qs[1], 0: qs[2] };
        return {
          enunciado: ['¿Son idénticos ', P1(poli(cs)), ' y ', P2(qtxt), '?'],
          datos: [DI.ident],
          // Al empezar, Q con «?»: con las dos filas ya escritas, la figura daba la respuesta (lector B, 19 nov).
          dibujo: LO({ objeto: 'casillero', grado: 2, filas: [{ nombre: 'P', coef: cP, color: 'o' }, { nombre: 'Q', coef: { 2: '?', 1: '?', 0: '?' }, color: 'i' }] }),
          pasos: [
            { tipo: 'pide', texto: 'Piden si son el mismo polinomio, aunque estén escritos en otro orden.' },
            { tipo: 'regla', texto: 'Son idénticos si cada potencia de x tiene el mismo coeficiente en los dos. Pongo cada coeficiente en su casilla.' },
            { tipo: 'cuentas', texto: dif.length ? `Las casillas no coinciden en ${dif.map(e => (e === 0 ? 'el término sin x' : `x${e === 1 ? '' : sup(e)}`)).join(' ni en ')}.` : 'Las tres casillas tienen el mismo número.',
              ecuacion: [RES(dif.length ? 'No son idénticos' : 'Sí son idénticos')], dibujo: DOS(2, cP, cQ, { ceros: true }) },
            { tipo: 'sentido', texto: `Comprueba con x = 2: el primero vale ${f(evaluar(cs, 2))} y el segundo, ${f(evaluar(qs, 2))}.${dif.length ? ' Ya ese valor los separa.' : ' Valen igual, como en cualquier otro x.'}` },
          ],
          respuesta: [RES(dif.length ? 'No' : 'Sí'), dif.length ? ': una casilla es distinta' : ': coinciden en todas las casillas'],
        };
      },
    },
    ahoraTu: {
      voz: 'Casilla por casilla, con los signos.',
      generar(sem) {
        const r = azar(sem + 89), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoMN, r);
        if (tipo === 1) return conCuatro(casoTres, r);
        if (tipo === 2) return conCuatro(casoNulo, r);
        return conCuatro(casoSistema, r);
      },
    },
  };

  // ---------- Idea 6 (fase 3, 19 nov): multiplicar polinomios ----------
  // Objeto: el piso rectangular de Rubén, de (2x + a) por (x + b) dm, partido en tramos de x dm y de 1 dm (alg-losetas,
  // 'piso'): cada tramo del largo por cada tramo del ancho es una pieza. «Mira» pasa a la cuadrícula del producto
  // (alg-tabla), que sirve también para factores de grado 2.
  // Cambia: los tramos de 1 dm del largo y del ancho · Permanece: 2x de largo y x de ancho · Progresa: las piezas y los
  // términos del producto · Se reserva: el grado de un producto de grado 2 por grado 3 (la predicción; el juego multiplica
  // grado 1 por grado 1) · Debe verse: cada tramo por cada tramo, y después se juntan las piezas de la misma forma.
  // Colores: el primer factor (el largo, P) naranja; el segundo (el ancho, Q) turquesa; el producto y las casillas que se
  // juntan, violeta.
  // Errores: PO5 multiplica los grados · PO23 se queda con el mayor, como en una suma · TAL-GRADO-RESTA resta los grados ·
  // TAL-UNA-CASILLA toma una sola casilla de las que dan esa potencia · TAL-OTRA-CASILLA toma la otra · TAL-COEF-MULT
  // multiplica dos coeficientes que no dan esa potencia · TAL-POT-GRADO olvida la potencia al sumar grados · TAL-SUMA-VISTOS
  // suma los coeficientes que se ven · TAL-POT-MULT multiplica por el exponente en vez de elevar · PO12 confunde P(1) con
  // P(0) · TAL-INDEP-SUMA suma los términos independientes · TAL-OLVIDA-FACTOR deja fuera un factor · AL16 · TAL-PIDE.
  const PISO = (p, q, r, s, extra) => LO(Object.assign({ objeto: 'piso', largo: [p, q], ancho: [r, s] }, extra));
  const tablaProducto = (pc, qc, cortes = {}) => {
    const pt = pc.map((c, i) => [c, pc.length - 1 - i]), qt = qc.map((c, j) => [c, qc.length - 1 - j]);
    const term = ([c, e], primero = true) => mono(c, [['x', e]], primero) || f(c);
    return {
      columnas: qt.map(t => term(t)), colorCol: qt.map(() => 'i'),
      rotulosFila: pt.map(t => term(t)), colorFila: pt.map(() => 'o'),
      filas: pt.map(([a, e], i) => qt.map(([b, g]) => ({ t: a * b === 0 ? '0' : term([a * b, e + g]), desde: cortes[`f${i}`] || 0 }))),
      resaltes: (cortes.resaltar || []).map(([fi, cj]) => ({ f: fi, c: cj, color: 'f', desde: cortes.desdeR || 0 })),
      alt: `Cuadrícula del producto (${poli(pc)})(${poli(qc)}): cada término del primero por cada término del segundo`,
    };
  };
  const TP = (pc, qc, cortes, estado) => ({ pieza: 'alg-tabla', datos: tablaProducto(pc, qc, cortes), estado: estado || {} });
  const DM = {
    dist: 'Cada término del primer polinomio multiplica a cada término del segundo',
    pot: 'xᵐ · xⁿ = xᵐ⁺ⁿ',
    grado: 'Grado de un polinomio de una letra: su mayor exponente de x',
    gpot: '(xᵐ)ᵏ = xᵐ·ᵏ',
    suma: 'Suma de coeficientes de un polinomio P: P(1)',
    indep: 'Término independiente de P: P(0)',
    semej: 'Después se juntan los términos semejantes',
  };

  // Ahora tú 1: un coeficiente de (x + a)(x² + bx + c).
  function casoCoefProducto(r) {
    const a = r.noCero(-4, 4), b = r.noCero(-4, 4), c = r.noCero(-5, 5), enX2 = r.ent(0, 1) === 1;
    const prod = multiplicar([1, a], [1, b, c]), bien = enX2 ? prod[1] : prod[2];
    const ds = enX2
      ? [{ id: 'una', v: b, e: 'TAL-UNA-CASILLA', s: `Bien x por ${mono(b, [['x', 1]], true)}. Falta ${f(a)} · x², que también da x².` },
        { id: 'otra', v: a, e: 'TAL-OTRA-CASILLA', s: `Bien ${f(a)} · x². Falta x · (${mono(b, [['x', 1]], true)}), que también da x².` },
        { id: 'mult', v: a * b, e: 'TAL-COEF-MULT', s: `${f(a)} · ${par(b)} da un término en x, no en x².` }]
      : [{ id: 'una', v: c, e: 'TAL-UNA-CASILLA', s: `Bien x por ${f(c)}. Falta ${f(a)} · ${mono(b, [['x', 1]], true)}, que también da x.` },
        { id: 'otra', v: a * b, e: 'TAL-OTRA-CASILLA', s: `Bien ${f(a)} · ${mono(b, [['x', 1]], true)}. Falta x · ${par(c)}, que también da x.` },
        { id: 'mult', v: a * c, e: 'TAL-COEF-MULT', s: `${f(a)} · ${par(c)} da el término sin x.` }];
    return {
      pregunta: ['¿Cuál es el coeficiente de ', enX2 ? 'x²' : 'x', ' en (', P1(poli([1, a])), ')(', P2(poli([1, b, c])), ')?'],
      datos: [DM.dist, DM.pot],
      opciones: ops([{ id: 'c', texto: f(bien), correcta: true }, ...ds.map(d => ({ id: d.id, texto: f(d.v), error: d.e, siFuera: d.s }))]),
      solucion: { texto: `Dos casillas dan ${enX2 ? 'x²' : 'x'}; se suman.`, ecuacion: [enX2 ? `${f(b)} + ${par(a)} = ` : `${f(c)} + ${par(a)} · ${par(b)} = `, RES(f(bien))],
        dibujo: TP([1, a], [1, b, c], { resaltar: enX2 ? [[0, 1], [1, 0]] : [[0, 2], [1, 1]] }) },
    };
  }
  // Ahora tú 2: el grado de un producto con una potencia.
  function casoGradoProducto(r) {
    const m = r.ent(2, 5), n = r.ent(1, 4), k = r.ent(2, 3), bien = k * m + n;
    return {
      pregunta: ['P tiene grado ', String(m), ' y Q tiene grado ', String(n), '. ¿Qué grado tiene ', P1('P'), sup(k), ' · ', P2('Q'), '?'],
      datos: [DM.grado, DM.pot, DM.gpot],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'sinpot', texto: f(m + n), error: 'TAL-POT-GRADO', siFuera: `Bien sumar los grados. Pero P${sup(k)} tiene grado ${k} · ${m} = ${k * m}: la potencia multiplica el grado.` },
        { id: 'mult', texto: f(m * n * k), error: 'PO5', siFuera: 'Los grados de dos factores no se multiplican: xᵐ · xⁿ = xᵐ⁺ⁿ.' },
        { id: 'max', texto: f(Math.max(k * m, n)), error: 'PO23', siFuera: 'Bien el grado de cada factor. Pero quedarse con el mayor es lo que pasa en una suma.' },
        { id: 'suma', texto: f(m + k + n), error: 'TAL-POT-MULT', siFuera: `Bien la idea de sumar. Pero P${sup(k)} no suma ${k} al grado: lo multiplica.` },
      ]),
      solucion: { texto: `P${sup(k)} tiene grado ${k} · ${m}; con Q se suma ${n}.`, ecuacion: [`${k} · ${m} + ${n} = `, RES(f(bien))] },
    };
  }
  // Ahora tú 3: la suma de los coeficientes de un producto, sin desarrollar.
  function casoSumaCoef(r) {
    let a, b, c, d, k;
    do { a = r.ent(1, 3); b = r.noCero(-3, 3); c = r.ent(1, 3); d = r.noCero(-4, 4); k = r.ent(2, 4); } while (a + b === 0 || c + d === 0 || Math.abs((a + b) ** k * (c + d)) > 300);
    const bien = (a + b) ** k * (c + d);
    return {
      pregunta: ['¿Cuánto suman los coeficientes de (', P1(poli([a, b])), ')', sup(k), '(', P2(poli([c, d])), ')?'],
      datos: [DM.suma],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'vistos', texto: f(a + b + c + d), error: 'TAL-SUMA-VISTOS', siFuera: 'Esos son los números que se ven, sumados. Los coeficientes del producto desarrollado son otros: P(1) los da.' },
        { id: 'pmult', texto: f((a + b) * k * (c + d)), error: 'TAL-POT-MULT', siFuera: `Bien P(1) en cada factor. Pero (${f(a + b)})${sup(k)} se eleva: no se multiplica por ${k}.` },
        { id: 'p0', texto: f(b ** k * d), error: 'PO12', siFuera: 'Ese es P(0), el término independiente. La suma de coeficientes es P(1).' },
        { id: 'suma', texto: f((a + b) ** k + (c + d)), error: 'TAL-SUMA-NO-MULT', siFuera: 'Bien P(1) en cada factor. Pero el polinomio es un producto: los dos valores se multiplican.' },
      ]),
      solucion: { texto: 'La suma de coeficientes es el valor con x = 1.', ecuacion: [`(${f(a + b)})${sup(k)} · (${f(c + d)}) = `, RES(f(bien))] },
    };
  }
  // Ahora tú 4 (examen): un producto por igualdad de polinomios.
  function casoProductoIgual(r) {
    let m, q, A;
    do { m = r.noCero(-5, 6); q = r.noCero(-4, 4); A = r.ent(1, 3); } while (m - A * q === 0);
    const n = m - A * q, T = m * q;   // (Ax + m)(x − q) = Ax² + (m − Aq)x − mq
    const qT = q > 0 ? `x − ${q}` : `x + ${-q}`;
    return {
      pregunta: ['Si (', P1(`${A === 1 ? '' : A}x + m`), ')(', P2(qT), `) ≡ ${A === 1 ? '' : A}x² + nx ${T > 0 ? '−' : '+'} ${Math.abs(T)}, ¿cuánto vale m + n?`],
      datos: [DM.dist, 'Idénticos: el mismo coeficiente en cada potencia de x'],
      opciones: ops([
        { id: 'c', texto: f(m + n), correcta: true },
        { id: 'signo', texto: f(-2 * m - A * q), error: 'AL16', siFuera: `Bien la casilla sin x. Pero m · ${par(-q)} = ${f(-T)} da m = ${f(m)}: revisa el signo.` },
        { id: 'olvida', texto: f(m - A * q), error: 'TAL-UNA-CASILLA', siFuera: `Bien m = ${f(m)}. Pero en x hay dos casillas: ${A === 1 ? 'x' : `${A}x`} · ${par(-q)} y m · x.` },
        { id: 'prod', texto: f(m * n), error: 'TAL-PIDE', siFuera: `Bien m = ${f(m)} y n = ${f(n)}. Pero piden la suma, no el producto.` },
      ]),
      solucion: { texto: `Sin x: m · ${par(-q)} = ${f(-T)}, y m = ${f(m)}. En x: ${f(-A * q)} + m = n.`, ecuacion: [`n = ${f(n)},  m + n = `, RES(f(m + n))] },
    };
  }
  // Ahora tú 5: el término independiente de un producto de tres factores.
  function casoIndepProducto(r) {
    const a = r.noCero(-4, 4), b = r.noCero(-5, 5), c = r.noCero(-4, 4), bien = a * b * c;
    return {
      pregunta: ['¿Cuál es el término independiente de (', P1(poli([1, 0, a])), ')(', P2(poli([2, b])), ')(', poli([1, c]), ')?'],
      datos: [DM.indep, DM.dist],
      opciones: ops([
        { id: 'c', texto: f(bien), correcta: true },
        { id: 'suma', texto: f(a + b + c), error: 'TAL-INDEP-SUMA', siFuera: 'Bien tomar los términos sin x. Pero el producto los multiplica, no los suma.' },
        { id: 'abs', texto: f(Math.abs(bien)), error: 'TAL-SIGNO', siFuera: 'Bien los tres números. Pero cada uno va con su signo.' },
        { id: 'dos', texto: f(a * b), error: 'TAL-OLVIDA-FACTOR', siFuera: `Bien ${f(a)} · ${par(b)}. Pero falta el tercer factor, ${par(c)}.` },
      ]),
      solucion: { texto: 'Con x = 0 cada factor deja su término sin x.', ecuacion: [`${par(a)} · ${par(b)} · ${par(c)} = `, RES(f(bien))] },
    };
  }

  // Ejemplos de la idea 6. Cuentas rehechas aparte (e5-algebra/cuentas-fase3.py, multiplicando polinomios en cinco valores
  // de x): 3x · 4x² = 12x³; 2x(x + 5) = 2x² + 10x; (x + 2)(x + 3) = x² + 5x + 6; grado 5; (x − 4)(x + 1) = x² − 3x − 4;
  // (2x + 1)(x² − x + 3) = 2x³ − x² + 5x + 3; coeficiente de x en (x + 3)(x² + 2x − 5): 1; suma 6; (2x + 3)(x + 2) =
  // 2x² + 7x + 6; grado 6; coeficiente de x² = −3 (errores −4, −6, 9 y −2); suma 16 (errores 5, 32, 9 y 1296; la B, 32, desde la auditoría del 19 nov); m = 4,
  // n = −2 → 2 (errores −2, −14, −8 y 14); grado 4 + término 15 = 19 (errores 15, 4, 5 y −11); n + 6 = 11 → 5 (errores
  // 6, 9, 11 y 4).
  const EJEMPLOS_PRODUCTO = [
    { nivel: 1, titulo: 'Dos monomios',
      enunciado: ['¿A qué es igual ', P1('3x'), ' · ', P2('4x²'), '?'],
      datos: [DM.pot],
      solucion: [{ texto: 'Se multiplican los coeficientes, 3 · 4 = 12, y se suman los exponentes de x, 1 + 2 = 3.', ecuacion: [P1('3x'), ' · ', P2('4x²'), ' = 12x¹⁺² = ', RES('12x³')] }],
      respuesta: [RES('12x³')] },
    { nivel: 1, titulo: 'Un tramo por dos',
      enunciado: ['Un piso mide ', P1('2x'), ' dm por ', P2('(x + 5)'), ' dm. ¿Qué polinomio da lo que cubre?'],
      datos: [DM.dist, DM.pot],
      figura: PISO(2, 0, 1, 5, { piezas: false }),
      solucion: [{ texto: 'El 2x multiplica a cada término del otro: 2x · x = 2x² (dos losetas) y 2x · 5 = 10x (diez tiras).', ecuacion: [P1('2x'), '(', P2('x + 5'), ') = ', RES('2x² + 10x')] }],
      respuesta: [RES('2x² + 10x'), ' dm²'] },
    { nivel: 1, titulo: 'Dos binomios',
      enunciado: ['Desarrolla (', P1('x + 2'), ')(', P2('x + 3'), ').'],
      datos: [DM.dist, DM.pot, DM.semej],
      figura: PISO(1, 2, 1, 3, { piezas: false }),
      solucion: [{ texto: 'Cuatro productos: x · x, x · 3, 2 · x y 2 · 3. Las tiras de 3x y las de 2x se juntan: 5x.', ecuacion: ['x² + 3x + 2x + 6 = ', RES('x² + 5x + 6')] }],
      respuesta: [RES('x² + 5x + 6')] },
    { nivel: 1, titulo: 'El grado de un producto',
      enunciado: ['¿Qué grado tiene (', P1('x³ + 1'), ')(', P2('x² − x'), ')?'],
      datos: [DM.grado, DM.pot],
      solucion: [{ texto: 'El término de mayor grado sale de x³ · x² = x⁵. Ningún otro producto llega a x⁵.', ecuacion: ['3 + 2 = ', RES('5')] }],
      respuesta: ['Grado ', RES('5')] },
    { nivel: 1, titulo: 'Con un signo menos',
      enunciado: ['Desarrolla (', P1('x − 4'), ')(', P2('x + 1'), ').'],
      datos: [DM.dist, DM.semej],
      solucion: [{ texto: 'Los productos son x², x, −4x y −4. Junto x − 4x = −3x.', ecuacion: ['x² + x − 4x − 4 = ', RES('x² − 3x − 4')] }],
      respuesta: [RES('x² − 3x − 4')] },
    { nivel: 2, titulo: 'Grado 1 por grado 2',
      enunciado: ['Desarrolla (', P1('2x + 1'), ')(', P2('x² − x + 3'), ').'],
      datos: [DM.dist, DM.pot, DM.semej],
      solucion: [
        { texto: '2x multiplica a cada término de la derecha; después, el 1.', ecuacion: [P1('2x'), ': 2x³ − 2x² + 6x,   ', P1('1'), ': x² − x + 3'] },
        { texto: 'Junto los semejantes: −2x² + x² = −x² y 6x − x = 5x.', ecuacion: [RES('2x³ − x² + 5x + 3')] },
      ],
      respuesta: [RES('2x³ − x² + 5x + 3')] },
    { nivel: 2, titulo: 'Un solo coeficiente',
      enunciado: ['¿Cuál es el coeficiente de x en (', P1('x + 3'), ')(', P2('x² + 2x − 5'), ')?'],
      datos: [DM.dist, DM.semej],
      figura: TP([1, 3], [1, 2, -5], { f0: 1, f1: 1 }, { corte: 0 }),
      solucion: [
        { texto: 'Dan x dos casillas: x por −5 y 3 por 2x. No hace falta desarrollar el resto.', ecuacion: ['x · (−5) = −5x,   3 · 2x = 6x'] },
        { texto: 'Sumo sus coeficientes.', ecuacion: ['−5 + 6 = ', RES('1')] },
      ],
      respuesta: [RES('1')] },
    { nivel: 2, titulo: 'Sumar sin desarrollar',
      enunciado: ['¿Cuánto suman los coeficientes de (', P1('x + 2'), ')(', P2('3x − 1'), ')?'],
      datos: [DM.suma],
      solucion: [
        { texto: 'La suma de coeficientes es el valor con x = 1, y el producto se evalúa factor por factor.', ecuacion: ['(1 + 2)(3 · 1 − 1) = 3 · 2'] },
        { texto: 'Multiplico.', ecuacion: ['3 · 2 = ', RES('6')] },
      ],
      respuesta: [RES('6')] },
    { nivel: 2, titulo: 'El piso de Rubén',
      enunciado: ['El piso mide ', P1('(2x + 3)'), ' dm por ', P2('(x + 2)'), ' dm. ¿Qué polinomio da lo que cubre?'],
      datos: [DM.dist, DM.semej],
      figura: PISO(2, 3, 1, 2, { piezas: false }),
      solucion: [
        { texto: 'Cada tramo por cada tramo: 2x · x = 2x², 2x · 2 = 4x, 3 · x = 3x y 3 · 2 = 6.', ecuacion: ['2x² + 4x + 3x + 6'] },
        { texto: 'Las tiras se juntan: 4x + 3x = 7x. Son 2 losetas, 7 tiras y 6 cuadraditos.', ecuacion: [RES('2x² + 7x + 6')] },
      ],
      respuesta: [RES('2x² + 7x + 6'), ' dm²'] },
    { nivel: 2, titulo: 'Una potencia',
      enunciado: ['¿Qué grado tiene (', P1('x² + 1'), ')³?'],
      datos: [DM.grado, DM.gpot],
      solucion: [
        { texto: 'Es el producto de tres factores iguales: (x² + 1)(x² + 1)(x² + 1). El término mayor sale de x² · x² · x².', ecuacion: ['(x²)³ = x²·³'] },
        { texto: 'Los grados se suman tres veces.', ecuacion: ['2 + 2 + 2 = ', RES('6')] },
      ],
      respuesta: ['Grado ', RES('6')] },
    { nivel: 3, titulo: 'Tres casillas de x²',
      enunciado: ['¿Cuál es el coeficiente de x² en (', P1('x² − 2x + 3'), ')(', P2('x² + x − 4'), ')?'],
      alternativas: ['−3', '−4', '−6', '9', '−2'],
      datos: [DM.dist, DM.pot, DM.semej],
      figura: TP([1, -2, 3], [1, 1, -4], { f0: 1, f1: 1, f2: 1 }, { corte: 0 }),
      solucion: [
        { texto: 'Dan x² tres casillas: x² · (−4), −2x · x y 3 · x².', ecuacion: ['−4x² − 2x² + 3x²'] },
        { texto: 'Sumo los coeficientes.', ecuacion: ['−4 − 2 + 3 = ', RES('−3')] },
        { texto: ['La ', letra('B'), ' toma solo x² · (−4). La ', letra('E'), ' toma solo −2x · x. La ', letra('C'), ' junta esas dos y olvida 3 · x².'] },
        { texto: ['La ', letra('D'), ' suma los tres sin sus signos: 4 + 2 + 3.'] },
      ],
      respuesta: [letra('A'), ', ', RES('−3')] },
    { nivel: 3, titulo: 'Coeficientes de una potencia',
      enunciado: ['¿Cuánto suman los coeficientes de (', P1('2x − 1'), ')⁴(', P2('x + 3'), ')²?'],
      alternativas: ['5', '32', '9', '1296', '16'],
      datos: [DM.suma],
      solucion: [
        { texto: 'Es el valor con x = 1. Cada factor se evalúa y se eleva.', ecuacion: ['(2 − 1)⁴ · (1 + 3)² = 1⁴ · 4²'] },
        { texto: 'Calculo.', ecuacion: ['1 · 16 = ', RES('16')] },
        { texto: ['La ', letra('A'), ' suma los números que se ven: 2 − 1 + 1 + 3. La ', letra('B'), ' multiplica por los exponentes en vez de elevar: (1 · 4) · (4 · 2) = 32.'] },
        { texto: ['La ', letra('C'), ' calcula P(0) = (−1)⁴ · 3², el término independiente. La ', letra('D'), ' pierde el signo: (2 + 1)⁴ · 4².'] },
      ],
      respuesta: [letra('E'), ', ', RES('16')] },
    { nivel: 3, titulo: 'Un producto idéntico',
      enunciado: ['Si (', P1('2x + m'), ')(', P2('x − 3'), ') ≡ 2x² + nx − 12, ¿cuánto vale m + n?'],
      alternativas: ['−2', '−14', '2', '−8', '14'],
      datos: [DM.dist, 'Idénticos: el mismo coeficiente en cada potencia de x'],
      solucion: [
        { texto: 'Desarrollo: 2x² − 6x + mx − 3m. Sin x: −3m = −12, así que m = 4.', ecuacion: ['−3m = −12  →  m = 4'] },
        { texto: 'En x: −6 + m = n.', ecuacion: ['n = −6 + 4 = −2,   m + n = ', RES('2')] },
        { texto: ['La ', letra('A'), ' olvida la casilla mx: n = −6. La ', letra('B'), ' toma m = −4: entonces n = −10.'] },
        { texto: ['La ', letra('D'), ' da m · n. La ', letra('E'), ' pierde el signo de −6x: n = 6 + 4 = 10, y m + n = 14.'] },
      ],
      respuesta: [letra('C'), ', ', RES('2')] },
    { nivel: 3, titulo: 'Grado y término independiente',
      enunciado: ['Para (', P1('x² − 3'), ')(', P2('2x + 5'), ')(x − 1), ¿cuánto vale su grado más su término independiente?'],
      alternativas: ['15', '4', '5', '19', '−11'],
      datos: [DM.grado, DM.indep, DM.pot],
      solucion: [
        { texto: 'El grado suma los grados de los factores: 2 + 1 + 1 = 4. El término independiente es el valor con x = 0.', ecuacion: ['(−3)(5)(−1) = 15'] },
        { texto: 'Sumo.', ecuacion: ['4 + 15 = ', RES('19')] },
        { texto: ['La ', letra('A'), ' da solo el término independiente y la ', letra('B'), ', solo el grado.'] },
        { texto: ['La ', letra('C'), ' suma −3 + 5 − 1 = 1 en vez de multiplicar: 4 + 1. La ', letra('E'), ' pierde el signo del −1: 4 − 15.'] },
      ],
      respuesta: [letra('D'), ', ', RES('19')] },
    { nivel: 3, titulo: 'Un exponente por hallar',
      enunciado: ['P(x) = (', { sup: ['x', 'n'] }, ' + 1)(', P2('x² − 3'), ')³ tiene grado 11. ¿Cuánto vale n?'],
      alternativas: ['6', '5', '9', '11', '4'],
      datos: [DM.grado, DM.gpot],
      solucion: [
        { texto: '(x² − 3)³ tiene grado 2 · 3 = 6. El grado del producto suma los grados.', ecuacion: ['n + 6 = 11'] },
        { texto: 'Despejo.', ecuacion: ['n = 11 − 6 = ', RES('5')] },
        { texto: ['La ', letra('A'), ' suma 2 + 3 en vez de multiplicar: n + 5 = 11. La ', letra('C'), ' olvida el cubo: n + 2 = 11.'] },
        { texto: ['La ', letra('D'), ' responde el grado, el dato. La ', letra('E'), ' cuenta el 1 como si tuviera grado 1: n + 1 + 6 = 11.'] },
      ],
      respuesta: [letra('B'), ', ', RES('5')] },
  ];

  const PRODP = [1, 2], PRODQ = [1, -3, 1];   // (x + 2)(x² − 3x + 1)
  const operaciones = {
    id: 'operaciones',
    titulo: 'Multiplicar polinomios',
    pregunta: '¿Cómo se multiplican dos polinomios sin perder ningún término?',
    temas: ['Operaciones con polinomios'],
    pieza: 'alg-losetas',
    aprendizaje: 'Multiplicar es cada término de uno por cada término del otro, y después juntar los semejantes; el grado del producto suma los grados.',
    actividad: 'Armar un piso rectangular y contar las piezas que salen.',
    // Lee: el piso partido en tramos y la cuadrícula. No dice qué grado tiene un producto (es la predicción).
    lee: {
      tarjetas: [
        // Otro piso que el de la misión (2x + 1 por x + 3): Lee no puede traerla resuelta (lector B, 19 nov).
        { titulo: 'El piso de Rubén', texto: 'Rubén enchapa un piso rectangular de (2x + 2) dm de largo por (x + 1) dm de ancho. Parte el largo en tramos de x dm y de 1 dm, y el ancho también.',
          pieza: 'alg-losetas', dibujo: PISO(2, 2, 1, 1) },
        { titulo: 'Cada tramo por cada tramo', texto: 'Cada tramo del largo por cada tramo del ancho da una pieza: x por x es una loseta, x por 1 es una tira y 1 por 1 es un cuadradito.' },
        { titulo: 'Como en el cuaderno', texto: 'Al multiplicar 23 · 14, cada cifra de un número multiplica a cada cifra del otro. Con polinomios se hace igual, término por término, y al final se juntan los semejantes. Así sale el producto de polinomios.' },
        { titulo: 'Qué mirar al jugar', texto: 'Cambia los tramos de 1 dm del largo y del ancho. Cuenta las piezas de cada forma y mira cuántos términos quedan al juntarlas.' },
      ],
    },
    ejemplos: EJEMPLOS_PRODUCTO,
    juega: {
      pieza: 'alg-losetas',
      consigna: ['El piso mide (', P1('2x + a'), ') dm de largo por (', P2('x + b'), ') dm de ancho.'],
      mision: {
        texto: 'Elige a y b para que el piso cubra 2x² + 7x + 3.',
        logrado: v => v.a === 1 && v.b === 3,
        bien: 'Listo: cuatro productos, y las tiras de dos de ellos se juntaron en 7x.',
      },
      voz: 'Cuenta las tiras: salen de dos lugares.',
      leyenda: [
        { s: P1('2x + a'), t: 'el largo, en dm: el primer polinomio' },
        { s: P2('x + b'), t: 'el ancho, en dm: el segundo polinomio' },
        { s: 'x', t: 'tramo de x dm' },
        { s: '1', t: 'tramo de 1 dm' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Tramos de 1 dm del largo, a', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'b', etiqueta: 'Tramos de 1 dm del ancho, b', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => PISO(2, v.a, 1, v.b, { tope: [2, 4, 1, 4] }),
      // La relación: cuatro productos, tramo por tramo, y las tiras se juntan.
      lectura: v => ['(', P1(`2x + ${v.a}`), ')(', P2(`x + ${v.b}`), `) = 2x² + ${2 * v.b}x + ${v.a === 1 ? '' : v.a}x + ${v.a * v.b} = `, RES(poli([2, 2 * v.b + v.a, v.a * v.b]))],
      minimo: 3,
    },
    predice: {
      pieza: 'alg-tabla',
      pregunta: 'P tiene grado 2 y Q tiene grado 3. ¿Qué grado tiene P · Q?',
      // La ley de los exponentes viene de Exponentes y radicales: es un valor que se usa, no la regla de la idea (lector B).
      datos: [DM.grado, DM.pot],
      voz: 'Piensa en el término más grande de cada uno.',
      opciones: [
        { id: 'c', texto: '5', correcta: true },
        { id: 'mult', texto: '6', error: 'PO5', siFuera: 'Bien que el grado crece. Pero x² · x³ = x · x · x · x · x: los exponentes se suman, no se multiplican.' },
        { id: 'max', texto: '3', error: 'PO23', siFuera: 'Bien el grado de Q, 3. Pero en un producto el término mayor de P también multiplica: el grado crece.' },
        { id: 'resta', texto: '1', error: 'TAL-GRADO-RESTA', siFuera: 'Restar grados es lo que pasa al dividir. Al multiplicar, el grado crece.' },
      ],
      dibujo: { pieza: 'alg-tabla', datos: { columnas: ['P', 'Q', 'P · Q'], colorCol: ['o', 'i', null], rotulosFila: ['grado'], filas: [['2', '3', { t: '?', hueco: true }]], alt: 'Grados: P 2, Q 3, P · Q por hallar' }, estado: {} },
      revelar: { pieza: 'alg-tabla', datos: { columnas: ['P', 'Q', 'P · Q'], colorCol: ['o', 'i', 'f'], rotulosFila: ['grado'], filas: [['2', '3', { t: '5', color: 'f', fuerte: true }]], alt: 'Grados: P 2, Q 3, P · Q 5' }, estado: {} },
      coincide: 'Coincide: el término mayor de P por el término mayor de Q da x² · x³ = x⁵.',
      noCoincide: 'Revisemos: x² · x³ = (x · x) · (x · x · x). Cuenta cuántas x se multiplican.',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: tablaProducto(PRODP, PRODQ, { f0: 1, f1: 2, resaltar: [[0, 1], [1, 0], [0, 2], [1, 1]], desdeR: 3 }),
      voz: 'Cada fila multiplica a todas las columnas.',
      pasos: [
        { estado: { corte: 1 }, texto: 'x multiplica a cada término de Q.', ecuacion: [P1('x'), ' · (', P2('x² − 3x + 1'), ') = x³ − 3x² + x'] },
        { estado: { corte: 2 }, texto: 'El 2 multiplica a cada término de Q.', ecuacion: [P1('2'), ' · (', P2('x² − 3x + 1'), ') = 2x² − 6x + 2'] },
        { estado: { corte: 3 }, texto: 'Las casillas con la misma potencia son semejantes: se juntan.', ecuacion: ['−3x² + 2x² = ', RES('−x²'), ',   x − 6x = ', RES('−5x')] },
        { estado: { corte: 3 }, texto: 'El producto tiene grado 3: grado 1 por grado 2, los grados se suman.', ecuacion: ['(', P1('x + 2'), ')(', P2('x² − 3x + 1'), ') = ', RES(poli(multiplicar(PRODP, PRODQ)))] },
      ],
    },
    regla: {
      texto: 'Cada término de un polinomio multiplica a cada término del otro; luego se juntan los semejantes. El grado del producto suma los grados; sus coeficientes suman P(1) · Q(1).',
      // Cada línea con su ejemplo (lector B, 19 nov): la potencia y la suma de coeficientes, con el producto del dibujo.
      ecuacion: ['grado(', P1('P'), ' · ', P2('Q'), ') = ', { llave: ['grado ', P1('P'), ' + grado ', P2('Q')], nota: 'se suman', color: 'c-f' }, SEP,
        'grado(', P1('P'), 'ᵏ) = k · grado ', P1('P'), SEP, 'por ejemplo, grado de (x² + 1)³ = 3 · 2 = 6', SEP,
        'suma de coeficientes = ', P1('P'), '(1) · ', P2('Q'), '(1) = 3 · (−1) = −3'],
      condicion: 'P y Q no son el polinomio cero; al juntar los semejantes, un término del medio puede anularse.',
      voz: 'Todos con todos; después, los semejantes juntos.',
      dibujo: TP(PRODP, PRODQ, { resaltar: [[0, 1], [1, 0], [0, 2], [1, 1]] }),
    },
    // Así se resuelve: desarrollar entero (x + a)(x² + bx + c) con la cuadrícula. «Ahora tú» pide un solo coeficiente,
    // grados, la suma de coeficientes, un producto por igualdad o el término independiente.
    resuelve: {
      pieza: 'alg-tabla',
      generar(s) {
        const r = azar(s + 900), a = r.noCero(-4, 4), b = r.noCero(-4, 4), c = r.noCero(-5, 5);
        const prod = multiplicar([1, a], [1, b, c]);
        const fila1 = poli([1, b, c, 0]), fila2 = poli([a, a * b, a * c]);
        return {
          enunciado: ['Desarrolla (', P1(poli([1, a])), ')(', P2(poli([1, b, c])), ').'],
          datos: [DM.dist, DM.pot, DM.semej],
          dibujo: TP([1, a], [1, b, c], { f0: 1, f1: 1 }, { corte: 0 }),
          pasos: [
            { tipo: 'pide', texto: 'Piden el producto entero, con los semejantes ya juntos.' },
            { tipo: 'regla', texto: 'Cada término del primero multiplica a cada término del segundo: 2 · 3 = 6 productos. Después se juntan los de la misma potencia de x.' },
            { tipo: 'cuentas', texto: `La fila de x da ${fila1}; la fila de ${f(a)} da ${fila2}. Junto x² con x² y x con x.`,
              ecuacion: [RES(poli(prod))], dibujo: TP([1, a], [1, b, c], { resaltar: [[0, 1], [1, 0], [0, 2], [1, 1]] }) },
            { tipo: 'sentido', texto: `Comprueba con x = 1: (1 ${sgn(a)} ${Math.abs(a)}) · (${f(1 + b + c)}) = ${f((1 + a) * (1 + b + c))}, y los coeficientes del producto suman lo mismo. Grado 1 por grado 2 da grado 3.` },
          ],
          respuesta: [RES(poli(prod))],
        };
      },
    },
    ahoraTu: {
      voz: 'Todos con todos; después, junta los semejantes.',
      generar(sem) {
        const r = azar(sem + 97), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoCoefProducto, r);
        if (tipo === 1) return conCuatro(casoGradoProducto, r);
        if (tipo === 2) return conCuatro(casoSumaCoef, r);
        if (tipo === 3) return conCuatro(casoProductoIgual, r);
        return conCuatro(casoIndepProducto, r);
      },
    },
  };

  // ---------- Ayudantes de las mesas del laboratorio (curvas de la ronda 2; colores de la unidad: sin verde) ----------
  const muestra = (cs, a, b) => Array.from({ length: Math.round((b - a) * 10) + 1 }, (_, k) => { const t = a + k / 10; return [Math.round(t * 10) / 10, evaluar(cs, t)]; });
  const rango = (cs, a, b, extra = []) => {
    const ys = [...muestra(cs, a, b).map(p => p[1]), ...extra, 0];
    const paso = Math.max(...ys.map(Math.abs)) > 40 ? 20 : 10;
    return { min: Math.floor(Math.min(...ys) / paso) * paso, max: Math.ceil(Math.max(...ys) / paso) * paso, paso };
  };
  const curvaP = (cs, a, b, puntos, rot) => {
    const rg = rango(cs, a, b);
    return {
      x: { min: a, max: b, paso: 1, nombre: 'x', decimales: 0, color: 'o' },
      y: { min: rg.min, max: rg.max, paso: rg.paso, nombre: 'P(x)', decimales: 0, color: 'f' },
      curvas: [{ puntos: muestra(cs, a, b), color: 'o', rotulo: rot }],
      puntos, alt: `Gráfica de P(x) = ${poli(cs)}${puntos.length ? ': ' + puntos.filter(p => p.rotulo).map(p => p.rotulo).join('; ') : ''}`,
    };
  };

  // ---------- Laboratorio ----------
  // Mesa 1: un polinomio cúbico que el alumno arma, con el punto que recorre la curva en pasos de medio.
  const cubica = v => [1, v.b, v.c, v.d];
  const dibujoCub = v => curvaP(cubica(v), -3, 3, [{ x: v.x, y: evaluar(cubica(v), v.x), color: 'f', guias: true, rotulo: f(evaluar(cubica(v), v.x)) }], 'P');
  const mesaCubica = {
    id: 'curva-cubica', titulo: 'Arma tu polinomio y evalúalo', pieza: 'ejes',
    consigna: 'P(x) = x³ + bx² + cx + d. Elige coeficientes y arrastra el punto por la curva: ¿qué altura tiene en x = 0 y en x = 1?',
    controles: [
      { id: 'x', etiqueta: 'x', min: -3, max: 3, paso: 0.5, inicio: 1, decimales: 1, color: 'c-o' },
      { id: 'b', etiqueta: 'b', min: -3, max: 3, paso: 1, inicio: 0, decimales: 0 },
      { id: 'c', etiqueta: 'c', min: -6, max: 6, paso: 1, inicio: -3, decimales: 0 },
      { id: 'd', etiqueta: 'd', min: -5, max: 5, paso: 1, inicio: 1, decimales: 0 },
    ],
    dibujo: v => ({ datos: dibujoCub(v), estado: {} }),
    lectura: v => [P, `(x) = ${poli(cubica(v))}:  `, P, `(${f(v.x, 1)}) = ${f(evaluar(cubica(v), v.x), 3)}`],
    arrastres: [{ id: 'punto', etiqueta: 'punto de la curva', color: 'c-o',
      donde: v => { const g = EJES().geometria(dibujoCub(v)); return { x: g.X(v.x), y: g.Y(evaluar(cubica(v), v.x)) }; },
      mover: (pt, v) => { const g = EJES().geometria(dibujoCub(v)); return { x: inversa(g.X, -3, 3)(pt.x) }; } }],
    // Retos comprobados (docs/teoria.md §4d): evalúan con evaluar(cubica(v), x), lo mismo que pone el punto.
    invitaciones: [
      { texto: 'Pon el punto en x = 1 y haz que caiga sobre el eje x.',
        logrado: v => v.x === 1 && evaluar(cubica(v), 1) === 0,
        bien: 'P(1) es la suma de los coeficientes: 1 + b + c + d = 0.' },
      { texto: 'Haz que la curva corte el eje y en −4.',
        logrado: v => evaluar(cubica(v), 0) === -4,
        bien: 'P(0) es el término independiente: se lee en el eje y.' },
      { texto: 'Pon el punto en x = 1 y haz que P(1) = P(−1).',
        logrado: v => v.x === 1 && evaluar(cubica(v), 1) === evaluar(cubica(v), -1),
        bien: 'P(1) − P(−1) = 2 + 2c: con c = −1 se empatan.' },
      { texto: 'Busca el punto más alto que se puede lograr en esta mesa.',
        logrado: v => evaluar(cubica(v), v.x) === MAX_CUBICA,
        bien: 'Todo al máximo y x = 3: 27 + 27 + 18 + 5 = 77.' },
      { texto: 'Guarda dos polinomios distintos con la misma altura en el mismo x.',
        logrado: (v, guardados) => guardados.some(g => g.x === v.x && (g.b !== v.b || g.c !== v.c || g.d !== v.d) && evaluar(cubica(g), g.x) === evaluar(cubica(v), v.x))
          && guardados.some(g => ['x', 'b', 'c', 'd'].every(k => g[k] === v[k])),
        bien: '¿Fue en x = 0? Ahí solo manda d: los demás términos se anulan.' },
    ],
  };
  // La mayor altura de la mesa del cúbico (x de −3 a 3 cada 0,5; b, c y d en sus rangos): se calcula, no se escribe.
  const MAX_CUBICA = (() => {
    let m = -Infinity;
    for (let x = -3; x <= 3; x += 0.5) for (let b = -3; b <= 3; b++) for (let c = -6; c <= 6; c++) for (let d = -5; d <= 5; d++) m = Math.max(m, evaluar([1, b, c, d], x));
    return m;
  })();
  // Mesa 2: P contra Q en curvas y en casillas a la vez; el cursor x mide las dos alturas.
  const QL = [1, 2, -1];   // Q(x) = x² + 2x − 1
  const dosLab = v => {
    const pc = [v.a, v.b, v.c], yp = evaluar(pc, v.t), yq = evaluar(QL, v.t);
    const ys = [...muestra(pc, -3, 2), ...muestra(QL, -3, 2)].map(z => z[1]);
    const lo = Math.floor(Math.min(0, ...ys) / 4) * 4, hi = Math.ceil(Math.max(0, ...ys) / 4) * 4;
    return {
      x: { min: -3, max: 2, paso: 1, nombre: 'x', decimales: 0, color: 'o' },
      y: { min: lo, max: hi, paso: hi - lo > 24 ? 8 : 4, nombre: 'y', decimales: 0 },
      curvas: [{ puntos: muestra(QL, -3, 2), color: 'i', rotulo: 'Q', en: [-3, evaluar(QL, -3)] }, { puntos: muestra(pc, -3, 2), color: 'o', rotulo: 'P', en: [2, evaluar(pc, 2)] }],
      puntos: [{ x: v.t, y: yq, color: 'i' }, { x: v.t, y: yp, color: 'o', guias: true }],
      alt: `P(x) = ${poli(pc)} y Q(x) = x² + 2x − 1; en x = ${f(v.t)}, P vale ${f(yp)} y Q vale ${f(yq)}`,
    };
  };
  const mesaDos = {
    id: 'dos-curvas', titulo: 'Dos curvas, tres casillas', pieza: 'ejes',
    consigna: 'P(x) = ax² + bx + c y Q(x) = x² + 2x − 1. Busca un x donde valgan igual sin que las casillas coincidan.',
    controles: [
      { id: 't', etiqueta: 'x', min: -3, max: 2, paso: 1, inicio: 1, decimales: 0, color: 'c-o' },
      { id: 'a', etiqueta: 'a', min: -1, max: 2, paso: 1, inicio: 0, decimales: 0 },
      { id: 'b', etiqueta: 'b', min: -2, max: 4, paso: 1, inicio: 2, decimales: 0 },
      { id: 'c', etiqueta: 'c', min: -3, max: 3, paso: 1, inicio: 0, decimales: 0 },
    ],
    dibujo: v => ({ datos: dosLab(v), estado: {} }),
    lectura: v => {
      const k = [v.a, v.b, v.c].filter((c, i) => c === QL[i]).length;
      return [P, ` = ${f(evaluar([v.a, v.b, v.c], v.t))}, `, Q, ` = ${f(evaluar(QL, v.t))}; casillas iguales: ${k} de 3`];
    },
    arrastres: [{ id: 'cursor', etiqueta: 'punto de P en la curva', color: 'c-o',
      donde: v => { const g = EJES().geometria(dosLab(v)); return { x: g.X(v.t), y: g.Y(evaluar([v.a, v.b, v.c], v.t)) }; },
      mover: (pt, v) => { const g = EJES().geometria(dosLab(v)); return { t: inversa(g.X, -3, 2)(pt.x) }; } }],
    invitaciones: [
      { texto: 'Haz que P y Q valgan igual en x = −2, con casillas distintas.',
        logrado: v => v.t === -2 && evaluar([v.a, v.b, v.c], -2) === evaluar(QL, -2) && [v.a, v.b, v.c].some((c, i) => c !== QL[i]),
        bien: 'Empatan en un punto, pero no son el mismo polinomio.' },
      { texto: 'Copia Q casilla por casilla.',
        logrado: v => [v.a, v.b, v.c].every((c, i) => c === QL[i]),
        bien: 'Mismos coeficientes: valen igual en todo x. Son idénticos.' },
      { texto: 'Haz que P sea constante y valga lo mismo que Q en el x marcado.',
        logrado: v => v.a === 0 && v.b === 0 && evaluar([v.a, v.b, v.c], v.t) === evaluar(QL, v.t),
        bien: 'Grado 0: una recta horizontal que corta a la parábola Q.' },
      { texto: 'Sin copiar Q, guarda dos x donde P y Q empaten sin cambiar los coeficientes.',
        logrado: (v, guardados) => {
          const empata = g => evaluar([g.a, g.b, g.c], g.t) === evaluar(QL, g.t), igual = g => g.a === v.a && g.b === v.b && g.c === v.c;
          return [v.a, v.b, v.c].some((c, i) => c !== QL[i]) && empata(v) && guardados.some(g => igual(g) && g.t !== v.t && empata(g)) && guardados.some(g => igual(g) && g.t === v.t);
        },
        bien: 'Dos empates no bastan para ser idénticos: en grado 2 hacen falta tres.' },
    ],
  };
  // Mesa 3: el producto con un control más (el término independiente de Q).
  const mesaProducto = {
    id: 'producto-libre', titulo: 'La cuadrícula del producto', pieza: 'alg-tabla',
    consigna: 'P = x + a y Q = x² + bx + c. ¿Con qué valores se cancela el término en x² o el término en x?',
    controles: [
      { id: 'a', etiqueta: 'a', min: -4, max: 4, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
      { id: 'b', etiqueta: 'b', min: -4, max: 4, paso: 1, inicio: -2, decimales: 0, color: 'c-i' },
      { id: 'c', etiqueta: 'c', min: -4, max: 4, paso: 1, inicio: 4, decimales: 0, color: 'c-i' },
    ],
    dibujo: v => ({ datos: tablaProducto([1, v.a], [1, v.b, v.c]), estado: {} }),
    lectura: v => [P, '·', Q, ` = ${poli(multiplicar([1, v.a], [1, v.b, v.c]))}`],
    invitaciones: [
      { texto: 'Consigue un producto sin término independiente.',
        logrado: v => multiplicar([1, v.a], [1, v.b, v.c])[3] === 0,
        bien: 'Basta que a o c sea 0: el término independiente es a · c.' },
      { texto: 'Haz que todos los coeficientes del producto sean positivos.',
        logrado: v => multiplicar([1, v.a], [1, v.b, v.c]).every(c => c > 0),
        bien: 'Con todo positivo, ningún término se resta al juntar los semejantes.' },
      { texto: 'Busca el producto con el mayor término independiente.',
        logrado: v => multiplicar([1, v.a], [1, v.b, v.c])[3] === Math.max(...[-4, 4].flatMap(a => [-4, 4].map(c => a * c))),
        bien: 'a · c = 16: dos signos iguales dan positivo.' },
      { texto: 'Haz que el producto sea x³ − 8.',
        logrado: v => poli(multiplicar([1, v.a], [1, v.b, v.c])) === poli([1, 0, 0, -8]),
        bien: '(x − 2)(x² + 2x + 4): los términos del medio se cancelan.' },
    ],
  };

  return {
    unidad: 'algebra.polinomios',
    version: '0.4.0',
    // Pasó el lector en frío y el auditor (19 nov): calidad 2, y el validador común lo exige.
    calidad: 2,
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/alg-losetas.js'],
    colores: COLORES,
    // Tabla de letras de la unidad (propuesta §5; docs/metodo/unidad/reglas-validador.md, letras-datos).
    letras: {
      x: 'la variable; en las ideas 1 y 2, el lado de la loseta en dm', y: 'la segunda variable',
      P: 'nombre de un polinomio; P(x) se lee «P de x»', Q: 'nombre de otro polinomio',
      a: 'un coeficiente de una forma general', b: 'otro coeficiente', c: 'otro coeficiente (el término sin x)', d: 'otro coeficiente',
      m: 'número por hallar', n: 'número por hallar o un exponente cualquiera; en la idea 4, el grado', k: 'un número cualquiera; en P(k), el valor de x',
      h: 'el número que se suma a x en P(x + h)', p: 'un número de un enunciado', q: 'otro número de un enunciado', g: 'el grado de un término',
    },
    laboratorio: [mesaCubica, mesaDos, mesaProducto],
    // Glosario por tema (docs/teoria.md §4d): las palabras que esta unidad estrena en álgebra.
    glosario: [
      // Los cuatro que estrena la idea 1 (19 nov), con su aproximación (simple) y tres ejemplos. Ninguno dice nada del
      // orden de las letras (es la predicción). «coeficiente» y «término independiente» siguen definidos en Ecuaciones
      // lineales y cuadráticas (propuesta, decisión 6): aquí el lector los marca con «Se explica en…».
      { termino: 'polinomio', formas: ['polinomio', 'polinomios'], def: 'Suma de términos con letras elevadas a exponentes enteros no negativos.',
        simple: 'Una suma de términos, como 2x² + 3x + 4.', ver: ['término', 'grado'],
        ejemplos: ['2x² + 3x + 4 es uno, de tres términos.', 'x³ − 3x + 1 es otro.', '1/x no lo es: la x está dividiendo.'] },
      { termino: 'término', formas: ['término', 'términos'], def: 'Cada sumando de una expresión: un número por letras con sus exponentes.',
        simple: 'Cada parte de una suma, con su signo.', ver: ['coeficiente', 'parte literal'],
        ejemplos: ['En 2x² − 5x + 3 hay tres: 2x², −5x y 3.', 'En 7xy hay uno solo.', 'En x² + x, el segundo es x: su coeficiente es 1.'] },
      { termino: 'parte literal', formas: ['parte literal', 'partes literales'], def: 'Las letras de un término con sus exponentes, sin el número que las multiplica.',
        simple: 'Las letras de un término, con sus exponentes.', ver: ['coeficiente'],
        ejemplos: ['En −7x²y es x²y.', 'En 5x es x.', 'El número 4 no tiene: no lleva letras.'] },
      // Idea 2 (19 nov, fase 3): variable, evaluar y valor numérico. Ninguno dice qué pasa con x = 1 (es la predicción).
      { termino: 'variable', formas: ['variable', 'variables'], def: 'Letra que puede tomar distintos valores numéricos.',
        simple: 'Una letra que guarda un número que cambia, como el lado de la loseta.',
        ejemplos: ['En P(x) = x² + 1, la variable es x.', 'Si la loseta mide 4 dm, x vale 4.', 'En 3xy hay dos variables: x e y.'] },
      { termino: 'evaluar', formas: ['evaluar', 'evalúa', 'evaluarlo', 'evalúo', 'evaluado'], def: 'Reemplazar la letra por un número y hacer las cuentas.',
        simple: 'Cambiar la letra por un número y calcular.',
        ejemplos: ['P(x) = x² − 1 en x = 3: P(3) = 9 − 1 = 8.', 'P(x) = 2x + 5 en x = −2: P(−2) = −4 + 5 = 1.', 'P(x) = x³ en x = 2: P(2) = 8.'] },
      { termino: 'valor numérico', formas: ['valor numérico', 'valores numéricos'], def: 'El número que da un polinomio al evaluarlo en un valor de su variable.',
        simple: 'Lo que vale el polinomio para un número dado.',
        ejemplos: ['El valor numérico de 2x + 1 en x = 3 es 7.', 'El de x² en x = −4 es 16.', 'El pedido 2x² + 3x + 4 con losetas de 2 dm vale 18 dm².'] },
      // Idea 3: grado, grado absoluto y grado relativo. Ningún ejemplo usa el polinomio de la predicción.
      { termino: 'grado', formas: ['grado', 'grados'], def: 'En un término, la suma de los exponentes de sus letras.',
        simple: 'Cuántas letras se multiplican en un término.', ver: ['grado absoluto', 'grado relativo'],
        ejemplos: ['3x²y⁴ tiene grado 2 + 4 = 6.', '5x tiene grado 1.', 'El número 7 tiene grado 0: no tiene letras.'] },
      // Sin la clave de la predicción de la idea 3 (que el absoluto es el mayor de los grados, no su suma): el def y los
      // ejemplos hablan de un polinomio de un solo término o de una sola letra (auditoría, 19 nov). La regla lo dice.
      { termino: 'grado absoluto', formas: ['grado absoluto'], simbolo: 'GA', def: 'El grado de un polinomio entero, que sale de los grados de todos sus términos.',
        simple: 'El grado del polinomio entero, no el de un solo término.',
        ejemplos: ['4x³y², de un solo término, tiene grado absoluto 5.', 'El polinomio 7 tiene grado absoluto 0.', 'En la academia se escribe G.A.'] },
      { termino: 'grado relativo', formas: ['grado relativo', 'grados relativos'], simbolo: 'GR', def: 'El mayor exponente que tiene una letra elegida en el polinomio.',
        simple: 'El mayor exponente de una sola letra.',
        ejemplos: ['En x³y + x²y⁴, respecto a x es 3.', 'En x³y + x²y⁴, respecto a y es 4.', 'En 2x⁵ + 3, respecto a x es 5.'] },
      // Idea 4: completo, ordenado y homogéneo. Ninguno cuenta las casillas de un polinomio de grado 5 (la predicción).
      { termino: 'completo', formas: ['completo', 'completos'], def: 'Así es un polinomio que tiene todas las potencias de la letra, desde su grado hasta x⁰.',
        simple: 'Sin casillas vacías: está cada potencia, hasta la de x⁰.',
        ejemplos: ['x³ + x − 1 no lo es: falta x².', 'x² + 4x − 3 sí lo es.', 'x³ − 2 no lo es: le faltan x² y x.'] },
      { termino: 'ordenado', formas: ['ordenado', 'ordenados', 'ordenada'], def: 'Así es un polinomio cuyos exponentes solo bajan, o solo suben, de un término al siguiente.',
        simple: 'Con los exponentes en fila, de mayor a menor o de menor a mayor.',
        ejemplos: ['2x³ + x² − x + 4 lo está: los exponentes bajan.', '5 − x + x³ también: suben.', 'x + x³ − 2 no lo está.'] },
      { termino: 'homogéneo', formas: ['homogéneo', 'homogéneos', 'homogénea'], def: 'Así es un polinomio cuyos términos tienen todos el mismo grado.',
        simple: 'Todos sus términos con el mismo número de letras multiplicadas.',
        ejemplos: ['x² + 3xy − y²: grado 2 en cada uno.', 'x³y + y⁴: grado 4 en los dos.', 'x² + y no lo es: grados 2 y 1.'] },
      // Idea 5: idéntico e idénticamente nulo. Ninguno dice si basta un valor común (la predicción).
      { termino: 'idéntico', formas: ['idéntico', 'idénticos', 'idénticas'], def: 'Dos polinomios lo son si son el mismo polinomio, aunque estén escritos en otro orden.',
        simple: 'El mismo pedido, aunque esté escrito en otro orden.',
        ejemplos: ['x + 2x² y 2x² + x lo son.', '3x − 1 y −1 + 3x lo son.', 'x² + 2x y 2x² + x no lo son.'] },
      { termino: 'idénticamente nulo', formas: ['idénticamente nulo', 'idénticamente nulos'], def: 'Polinomio cuyos coeficientes valen 0 en todas las potencias.',
        simple: 'Un pedido sin ninguna pieza: todas sus casillas en 0.',
        ejemplos: ['0x² + 0x + 0 lo es.', 'Si (a − 3)x + (b + 1) lo es, a = 3 y b = −1.', 'x − x lo es: al juntar queda 0.'] },
      // Idea 6: monomio y producto de polinomios. Ninguno dice el grado de un producto (la predicción).
      { termino: 'monomio', formas: ['monomio', 'monomios'], def: 'Polinomio de un solo término.',
        simple: 'Un término solo, como 3x o 4x².',
        ejemplos: ['3x · 4x² es un producto de dos monomios.', '−7x²y es un monomio.', 'x + 1 no lo es: tiene dos términos.'] },
      { termino: 'producto de polinomios', formas: ['producto de polinomios', 'productos de polinomios'], def: 'Polinomio que resulta de multiplicar cada término de un polinomio por cada término del otro.',
        simple: 'Lo que cubre un piso cuyos lados son polinomios.', ver: ['monomio'],
        ejemplos: ['(x + 2)(x + 3) = x² + 5x + 6.', '2x(x + 5) = 2x² + 10x.', '(x − 1)(x + 1) = x² − 1.'] },
      { termino: 'semejante', formas: ['semejante', 'semejantes'], def: 'Dos términos lo son si tienen la misma parte literal: solo esos se pueden juntar al sumar.',
        simple: 'Términos con las mismas letras y los mismos exponentes.', ver: ['parte literal'],
        ejemplos: ['3x² y 5x² lo son: 3x² + 5x² = 8x².', '3x² y 5x no lo son: no se juntan.', '4x³ y −9x³ lo son, aunque sus coeficientes sean distintos.'] },
    ],
    historia: {
      texto: 'En 1591, François Viète defendió usar letras para las cantidades conocidas y para las desconocidas. No era todavía nuestra escritura de polinomios, pero permitió razonar sobre familias enteras de problemas y no solo sobre ejemplos con números. Esa es la idea de esta unidad: coeficientes, exponentes y variables cumplen papeles distintos, y operar debe conservar el valor de la expresión.',
      pregunta: '¿Qué ganas al escribir una letra en vez de un número?',
      fuente: { titulo: 'O’Connor y Robertson, François Viète — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Viete/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'curva-cubica': ['valor-numerico'],
      'dos-curvas': ['igualdad', 'valor-numerico'],
      'producto-libre': ['operaciones'],
    },
    // Orden de la propuesta (docs/etapa5/propuesta-algebra.md §1): la idea nueva primero y el valor numérico antes de los grados.
    ideas: [semejantes, valor, grados, especiales, igualdad, operaciones],
  };
});
