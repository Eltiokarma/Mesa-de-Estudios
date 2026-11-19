/*
 * Teoría de «Números primos y divisores» (aritmetica.numeros-primos-y-divisores), para 5.º de secundaria y
 * preuniversitario. Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 14).
 *
 * Etapa 6 del plan de calidad (19 nov), EN PROCESO: la propuesta es docs/etapa6/propuesta-aritmetica.md (Gerson delegó
 * el criterio y la revisa después). Seis ideas, con los id de antes (nadie pierde avance), rehechas contra el contrato
 * con sus 15 ejemplos: 1 `rectangulos` (primos y compuestos), 2 `criba`, 3 `factorizacion` (teorema fundamental y PESI),
 * 4 `divisores` (cantidad, suma y producto), 5 `euler` y 6 `fermat-wilson`. La unidad todavía NO lleva calidad: 2: la
 * marca la sesión después del lector en frío y del auditor. Hilo de la rama: el puesto de doña Juana (la bandeja de la
 * vitrina, pieza arit-bandejas; el pedido en bolsitas, arit-puesto) y la rifa de la promoción (la plancha de boletos,
 * arit-boletos, con el bloque «criba»), todos dibujos de prueba. Práctica por idea: plantillas/primos-divisores.
 *
 * Letras (propuesta §6; def.letras): N es el número que se estudia (como en Divisibilidad; antes era n, que en la rama
 * es la base), d un divisor de N y k un entero. p y q son dos primos distintos (aviso: en Divisibilidad q era el
 * cociente; aquí es un primo, como en los libros: N = pᵅ × qᵝ); α y β, sus exponentes. CD(N), SD(N) y PD(N): cantidad,
 * suma y producto de los divisores (notación de la academia). φ(N): la función de Euler. a: la base de una potencia
 * (solo en Fermat). p̊: «múltiplo de p», el circulito del examen ({ mult } de nucleo/ecuacion.js). × para multiplicar,
 * nunca «·» (el «   ·   » solo separa dos relaciones en una regla). No hay cifras ocultas: a, b, c no son cifras aquí.
 *
 * REGLA DE COLORES DE LA UNIDAD: un color fijo por magnitud (docs/molde-unidad.md §5b; propuesta §7), en la tabla
 * COLORES (def.colores). El criterio es el de la rama (envase turquesa, lo que se muda naranja, lo que se busca violeta):
 *   - turquesa (c-i), «envase»: los divisores (las filas de la bandeja y lo que lleva cada fila, las casillas de la
 *     tabla de divisores) y los primos con que se arma N (sus divisores primos); el primo que tacha en la criba;
 *   - naranja (c-o), «sobra»: lo que sobra: los sueltos de una forma que no cierra, el resto de una división de prueba,
 *     los restos de Fermat y Wilson (también cuando es lo que se pide);
 *   - violeta (c-f), «busca»: lo que se busca: cuántos primos o divisores, CD, SD, φ(N), el número que se pide;
 *   - tinta: N cuando se da, los exponentes, k, los números que se operan, «?»;
 *   - ni verde ni carmín (la caja 3D del laboratorio, pieza compartida, sigue con su verde).
 *   La letra de una alternativa va en negrita y en tinta ({ negrita }). Cada ficha de color dice su magnitud (m);
 *   contenido/teoria/aritmetica/numeros-primos-y-divisores.test.js falla si una cambia de color.
 * Errores: los AT-* son hipótesis de aula (tabla «Números primos y divisores (19 nov)» de
 * docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md); ver el bloque de cada idea.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver los divisores como las formas de acomodar caramelos, y los primos como lo que no se parte.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de 360 px de gama baja, sin audio, con lápiz al lado.
 *   Resultado observable: dice si un número es primo probando hasta su raíz, factoriza, reconoce dos PESI, cuenta y suma
 *     divisores (también con una condición), calcula φ(N) y usa Fermat y Wilson con su condición.
 *   Orden de atención: 1.º el objeto (la bandeja o la plancha de la rifa) · 2.º la lectura · acción: el botón fijo.
 *   Estados: juego sin tocar · casos probados · misión lograda · predicción · coincide / no coincide · paso a paso ·
 *     caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué el 1 no es primo, hasta dónde pruebo, y de dónde sale (α + 1)(β + 1)?».
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El motor de plantillas/divisores arma la caja 3D de divisores de la mesa «La caja de los divisores» (regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/divisores/motor.js'))
    : fabrica(root.Kit, root.MotorDivisores);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MD) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = x => String(x).split('').map(c => SUP[+c]).join('');
  const mcd = (x, y) => (y ? mcd(y, x % y) : Math.abs(x));
  const esPrimo = x => { if (x < 2) return false; for (let k = 2; k * k <= x; k++) if (x % k === 0) return false; return true; };
  const divisores = x => { const out = []; for (let k = 1; k <= x; k++) if (x % k === 0) out.push(k); return out; };
  const factores = x => { const out = []; for (let k = 2; x > 1; k++) { let e = 0; while (x % k === 0) { x /= k; e++; } if (e) out.push([k, e]); } return out; };
  const primosHasta = x => Array.from({ length: Math.max(0, x - 1) }, (_, i) => i + 2).filter(esPrimo);
  const powmod = (b, e, k) => { let x = 1 % k; for (let i = 0; i < e; i++) x = (x * b) % k; return x; };
  const parejas = N => { const out = []; for (let a = 1; a * a <= N; a++) if (N % a === 0) out.push([a, N / a]); return out; };
  const yLista = xs => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : String(xs[0]));
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
  const COLORES = { envase: 'i', sobra: 'o', busca: 'f' };
  const ficha = mg => t => ({ v: `c-${COLORES[mg]}`, t: String(t), m: mg });
  const bas = ficha('envase'), sob = ficha('sobra'), res = ficha('busca');
  // «Múltiplo de p», como en el examen: el número con su circulito ({ mult } de nucleo/ecuacion.js).
  const MU = d => ({ mult: [bas(d)] });
  // La letra de una alternativa, en negrita y en tinta: sin color, para que una trampa no parezca la respuesta.
  const letra = L => ({ negrita: [L] });
  // Entre dos relaciones de una misma ecuación (en la regla, cada una en su línea).
  const SEP = '   ·   ';
  // «24 = 1 × 24 = 2 × 12 = …»: las parejas de N con los divisores en turquesa.
  const formasEc = (N, ps = parejas(N)) => [String(N), ...ps.flatMap(([a, b]) => [' = ', bas(a), ' × ', bas(b)])];
  const plural = (k, uno, varios) => (k === 1 ? `1 ${uno}` : `${k} ${varios}`);

  // ---------- Idea 1 (rehecha, 19 nov): primo, una sola fila (primos y compuestos) ----------
  // Propuesta: docs/etapa6/propuesta-aritmetica.md §1 a §7. Conserva el id `rectangulos` y el control `n` (nadie
  // pierde avance); la mesa `filas-de-c` sigue con las fichas en filas (un intento a la vez).
  // Objeto: la bandeja de la vitrina de doña Juana (pieza arit-bandejas, dibujo de prueba), con los N caramelos en filas
  // iguales y todas llenas, todas las formas a la vez; en Predice, los boletos de la rifa (arit-boletos).
  // Cambia: cuántos caramelos hay. · Permanece: filas iguales y todas llenas; una sola escala. · Progresa: muchas formas
  // → pocas → una sola fila. · Se reserva: el 1 y el 2 (el juego empieza en 4): son de la predicción. · Debe verse: cada
  // forma es una pareja de divisores; un primo solo cabe en una fila.
  // Errores (hipótesis de aula, sin medir: el informe de aritmética no trae este tema): AT-PRIMO-UNO cuenta al 1 como
  // primo («se divide entre 1 y entre sí mismo») · AT-PRIMO-PAR deja fuera al 2 por ser par · AT-PRIMO-IMPAR cree que
  // todo impar es primo · AT-PRIMO-SIETE no prueba el 7 (49, 77, 91 parecen primos) · AT-PAREJA-FORMAS cuenta formas por
  // divisores · AT-DIV-EXTREMOS no cuenta el 1 ni N · AT-DIV-PROPIO no cuenta a N · AT-PAREJA-CUADRADO no cuenta la forma
  // del cuadrado (6 × 6) · AT-PAREJA-GIRA cuenta una forma y su giro como dos · AT-PAREJA-DOBLE cuenta el cuadrado dos
  // veces · AT-PRIMO-MITAD parte la suma en dos mitades · AT-RESPONDE-OTRA responde otra cantidad del problema ·
  // AT-PAREJA-CASI toma un número del rango sin ver si divide.
  const BA = 'arit-bandejas', BO = 'arit-boletos';
  const BANDEJAS = () => Kit.piezas[BA];
  const bandeja = datos => ({ pieza: BA, datos, estado: {} });
  // El alto del juego: el de la figura más alta de n = 4 a 30 (así no salta y no sobra lugar).
  let alto1 = null;
  const altoJuego1 = () => { if (alto1) return alto1; let h = 0; for (let n = 4; n <= 30; n++) h = Math.max(h, BANDEJAS().geometria({ n }).H); return (alto1 = h); };
  const PREDICE1 = [1, 2, 33, 35, 37];
  const D1 = {
    forma: 'Una forma: N caramelos en filas iguales, todas llenas; N = filas × caramelos por fila',
    pareja: 'Cada forma da una pareja de divisores; 3 filas de 8 y 8 filas de 3 son la misma forma',
    primo: 'Un número primo tiene exactamente dos divisores: 1 y él mismo',
    comp: 'Un número compuesto tiene más de dos divisores; el 1 no es primo ni compuesto',
    par: 'Un número par es 2 × un entero',
  };

  // Ahora tú · tipo 0: ¿cuál de cuatro boletos lleva un número primo?
  const SIETES = [49, 77, 91, 119, 133];
  const TRESES = [39, 51, 57, 69, 87, 93, 111];
  function casoCual(r) {
    const p = r.de(primosHasta(97).filter(x => x > 40)), t = r.de(TRESES), s = r.de(SIETES);
    const [a, b] = factores(t)[0][0] === 3 ? [3, t / 3] : [t, 1], [c] = [factores(s)[0][0]];
    return {
      pregunta: '¿Cuál de estos boletos de la rifa lleva un número primo?',
      datos: [D1.primo, D1.comp],
      opciones: opciones(p, [
        { id: 'uno', valor: 1, error: 'AT-PRIMO-UNO', siFuera: 'Buscar pocos divisores está bien. Pero el 1 tiene uno solo, y un primo necesita dos.' },
        { id: 'tres', valor: t, error: 'AT-PRIMO-IMPAR', siFuera: `Que sea impar está bien, pero no basta: ${t} = ${a} × ${b}, también va en ${a} filas.` },
        { id: 'siete', valor: s, error: 'AT-PRIMO-SIETE', siFuera: `No es múltiplo de 2, 3 ni 5, es cierto. Pero ${s} = ${c} × ${s / c}.` },
      ]),
      solucion: { texto: `${p} solo cabe en una fila: sus divisores son 1 y ${p}.`, ecuacion: [String(p), ' = ', bas(1), ' × ', bas(p)] },
    };
  }
  // Ahora tú · tipo 1: cuántos primos hay en una lista con el 1 y el 2.
  function casoLista(r) {
    const pr = r.de([[3, 5, 7, 11, 13, 17, 19, 23, 29, 31], [41, 43, 47, 53, 59, 61]][r.ent(0, 1)]);
    const comp = r.de([9, 15, 21, 25, 27, 39, 45, 49, 51, 55, 57]);
    const otro = r.de([29, 31, 37, 41, 43, 47, 53, 59, 61, 63, 65, 75, 77, 81, 85, 87]);
    const xs = [...new Set([1, 2, pr, comp, otro])].sort((x, y) => x - y);
    if (xs.length !== 5 || (xs[0] === 1 && xs.join() === PREDICE1.join())) return null;
    const c = xs.filter(esPrimo).length, impares = xs.filter(x => x % 2).length;
    const malos = xs.filter(x => x > 2 && !esPrimo(x));
    return {
      pregunta: `En la rifa quedan los boletos ${yLista(xs)}. Ganan los que llevan un número primo. ¿Cuántos ganan?`,
      datos: [D1.primo, D1.comp],
      opciones: opciones(c, [
        { id: 'uno', valor: c + 1, error: 'AT-PRIMO-UNO', siFuera: 'Contar los que tienen pocos divisores está bien. Pero el 1 tiene uno solo: no es primo.' },
        { id: 'par', valor: c - 1, error: 'AT-PRIMO-PAR', siFuera: 'Los primos impares están bien contados. El 2 también es primo: sus divisores son 1 y 2.' },
        { id: 'impar', valor: impares, error: 'AT-PRIMO-IMPAR', siFuera: `Ser impar no basta: ${malos.map(x => { const fx = factores(x)[0][0]; return `${x} = ${fx} × ${x / fx}`; }).join(' y ')}.` },
      ]),
      solucion: { texto: `Ganan ${yLista(xs.filter(esPrimo))}: tienen exactamente dos divisores.`, ecuacion: ['ganan ', res(c), ' boletos'] },
    };
  }
  // Ahora tú · tipo 2: cuántos divisores tiene N, por parejas.
  function casoDivisores(r) {
    const N = r.ent(20, 99), ps = parejas(N), k = ps.length;
    if (k < 3 || ps.some(([a, b]) => a === b)) return null;
    return {
      pregunta: `¿Cuántos divisores tiene ${N}?`,
      datos: [D1.forma, D1.pareja],
      opciones: opciones(2 * k, [
        { id: 'formas', valor: k, error: 'AT-PAREJA-FORMAS', siFuera: `Hallar las ${k} formas está bien. Pero cada forma da dos divisores.` },
        { id: 'extremos', valor: 2 * k - 2, error: 'AT-DIV-EXTREMOS', siFuera: `Las parejas están bien. El 1 y ${N} también dividen a ${N}: falta contarlos.` },
        { id: 'propio', valor: 2 * k - 1, error: 'AT-DIV-PROPIO', siFuera: `Contar desde el 1 está bien. ${N} también divide a ${N}: falta contarlo.` },
      ]),
      solucion: { texto: `${k} formas, y cada una da dos divisores distintos.`, ecuacion: formasEc(N, ps) },
    };
  }
  // Ahora tú · tipo 3 (nivel examen): las formas de un cuadrado (un divisor va con él mismo).
  function casoCuadrado(r) {
    const N = r.de([16, 36, 64, 81, 100, 144, 196, 225]), ps = parejas(N), k = ps.length, dv = 2 * k - 1, m = Math.sqrt(N);
    return {
      pregunta: `¿De cuántas formas distintas se acomodan ${N} caramelos en la bandeja, en filas iguales y todas llenas?`,
      datos: [D1.forma, D1.pareja],
      opciones: opciones(k, [
        { id: 'cuadrado', valor: k - 1, error: 'AT-PAREJA-CUADRADO', siFuera: `Las parejas están bien. ${m} filas de ${m} también es una forma: falta contarla.` },
        { id: 'gira', valor: dv, error: 'AT-PAREJA-GIRA', siFuera: `Esos son los ${dv} divisores. Una forma y su giro son la misma: se cuentan una vez.` },
        { id: 'doble', valor: k + 1, error: 'AT-PAREJA-DOBLE', siFuera: `Las parejas están bien. Pero ${m} filas de ${m} es una sola forma, no dos.` },
      ]),
      solucion: { texto: `Las parejas van de 1 × ${N} hasta ${m} × ${m}; el ${m} va con él mismo.`, ecuacion: [...formasEc(N, ps), ': ', res(k), ' formas'] },
    };
  }
  // Ahora tú · tipo 4 (nivel examen): dos primos que suman un impar (uno tiene que ser el 2).
  function casoDosPrimos(r) {
    const p = r.de(primosHasta(80).filter(x => x > 10)), S = p + 2;
    const m1 = (S - 1) / 2, m2 = (S + 1) / 2;
    return {
      pregunta: `Dos números primos suman ${S}. ¿Cuál es su producto?`,
      datos: [D1.primo, D1.par, 'Un impar más un impar da un par'],
      opciones: opciones(2 * p, [
        { id: 'mitad', valor: m1 * m2, error: 'AT-PRIMO-MITAD', siFuera: `${m1} + ${m2} = ${S}, es cierto. Pero ${esPrimo(m1) ? m2 : m1} no es primo.` },
        { id: 'tres', valor: 3 * (S - 3), error: 'AT-PRIMO-PAR', siFuera: `3 es primo, bien. Pero ${S - 3} es par y no es primo; el 2 sí lo es.` },
        { id: 'otra', valor: p, error: 'AT-RESPONDE-OTRA', siFuera: `${p} es uno de los dos primos. Se pide su producto con el otro, el 2.` },
      ]),
      solucion: { texto: `Dos impares suman un par; como ${S} es impar, uno es el 2 y el otro ${p}.`, ecuacion: [`2 × ${p} = `, res(2 * p)] },
    };
  }
  // Ahora tú · tipo 5 (San Marcos 2026-II): un solo divisor dentro de un rango.
  function casoRango(r) {
    const N = r.ent(60, 220), a = r.ent(8, 14), b = a + r.ent(6, 9);
    const dentro = divisores(N).filter(x => x > a && x < b);
    if (dentro.length !== 1 || N % b === 0) return null;
    const d = dentro[0], cerca = [d - 1, d + 1].find(x => x > a && x < b && N % x);
    if (!cerca) return null;
    return {
      pregunta: `Doña Juana empaca ${N} caramelos en cajas iguales, con más de ${a} y menos de ${b} caramelos por caja, sin que sobre ninguno. ¿Cuántos caramelos lleva cada caja?`,
      datos: [D1.forma, D1.pareja],
      opciones: opciones(d, [
        { id: 'cajas', valor: N / d, error: 'AT-RESPONDE-OTRA', siFuera: `Hallar la pareja ${N / d} × ${d} está bien. Pero ${N / d} son las cajas.` },
        { id: 'casi', valor: cerca, error: 'AT-PAREJA-CASI', siFuera: `Está en el rango, bien. Pero ${N} = ${cerca} × ${Math.floor(N / cerca)} + ${N % cerca}: sobran.` },
        { id: 'tope', valor: b, error: 'AT-PAREJA-CASI', siFuera: `Tiene que ser menos de ${b}; y con ${b} por caja sobran ${N % b}.` },
      ]),
      solucion: { texto: `Entre ${a} y ${b}, solo ${d} divide a ${N}.`, ecuacion: [`${N} = `, bas(N / d), ' × ', bas(d)] },
    };
  }

  // Ejemplos resueltos (pestaña «Ejemplos», docs/teoria.md 4h): 5 de nivel 1, 5 de nivel 2 y 5 de nivel 3, estos con
  // cinco alternativas (A a E). Cuentas rehechas aparte, sin este archivo (scratchpad de la sesión, e6-aritmetica/
  // cuentas-ideas.py, por fuerza bruta): 10 = 1 × 10 = 2 × 5; divisores de 15: 1, 3, 5, 15; 13 solo 1 × 13; 21 = 3 × 7;
  // el único par primo es 2; 28 = 1 × 28 = 2 × 14 = 4 × 7 (6 divisores); 25 = 1 × 25 = 5 × 5 (2 formas, 3 divisores);
  // primos entre 20 y 30: 23 y 29; 30 = 1 × 30 = 2 × 15 = 3 × 10 = 5 × 6 (3 formas además de 5 × 6); del 1 al 12 son
  // compuestos 4, 6, 8, 9, 10 y 12; 25 = 2 + 23 → 46 (12 × 13 = 156, 3 × 22 = 66); 64: 1 × 64, 2 × 32, 4 × 16, 8 × 8 (4
  // formas, 7 divisores); 119 = 7 × 17, de 11 a 19 solo divide el 17 (119 = 13 × 9 + 2); 25 es el único de 12, 18, 25,
  // 30 y 50 con cantidad impar de divisores (3; los otros 6, 6, 8 y 6); el mayor de dos cifras con dos formas y una de 3
  // filas: 93 = 3 × 31 (99 = 9 × 11 tiene tres; 96, seis). Ningún ejemplo usa la predicción (boletos 1, 2, 33, 35, 37) ni la
  // misión (23 entre 20 y 28) tal cual. Las figuras muestran el planteamiento (un intento, el montón), nunca las formas
  // que se piden.
  const EJEMPLOS_PRIMOS = [
    { nivel: 1, titulo: 'Las formas de 10',
      enunciado: '¿De cuántas formas distintas se acomodan 10 caramelos en la bandeja, en filas iguales y todas llenas?',
      datos: [D1.forma, D1.pareja],
      solucion: [{ texto: 'Pruebo cuántas filas: con 1 y con 2 se llenan; con 3 sobra 1. Con 4 filas ya habría menos de 4 por fila, y eso es una forma girada.', ecuacion: formasEc(10) }],
      respuesta: [res(2), ' formas'] },
    { nivel: 1, titulo: 'Los divisores de 15',
      enunciado: '¿Cuáles son todos los divisores de 15?',
      datos: [D1.forma, D1.pareja],
      solucion: [{ texto: '15 caramelos van en 1 fila de 15 o en 3 filas de 5. Cada forma da dos divisores.', ecuacion: formasEc(15) }],
      respuesta: [res('1, 3, 5 y 15')] },
    { nivel: 1, titulo: '¿Es 13 primo?',
      enunciado: '¿Es 13 un número primo?',
      datos: [D1.primo, D1.forma],
      figura: bandeja({ n: 13, formas: [], intento: 2 }),
      solucion: [{ texto: 'En filas de 2 sobra 1, en filas de 3 sobra 1, y en filas de 4, 5 o 6 también sobran: 13 solo cabe en una fila.', ecuacion: ['13 = ', bas(1), ' × ', bas(13)] }],
      respuesta: [res('Sí'), ': sus divisores son 1 y 13'] },
    { nivel: 1, titulo: '¿Es 21 primo?',
      enunciado: '¿Es 21 un número primo o compuesto?',
      datos: [D1.primo, D1.comp],
      solucion: [{ texto: '21 caramelos llenan 3 filas de 7. Tiene más de dos divisores: 1, 3, 7 y 21.', ecuacion: formasEc(21) }],
      respuesta: ['Es ', res('compuesto')] },
    { nivel: 1, titulo: 'El único primo par',
      enunciado: '¿Cuántos números pares son primos?',
      datos: [D1.primo, D1.par],
      solucion: [
        { texto: 'El 2 tiene dos divisores, 1 y 2: es primo.', ecuacion: ['2 = ', bas(1), ' × ', bas(2)] },
        { texto: 'Todo otro par es 2 × un entero mayor que 1: también cabe en 2 filas, y ya tiene más de dos divisores.', ecuacion: ['14 = ', bas(2), ' × ', bas(7)] },
      ],
      respuesta: ['Solo ', res('uno'), ': el 2'] },
    { nivel: 2, titulo: 'Todos los divisores de 28',
      enunciado: '¿Cuántos divisores tiene 28 y cuáles son?',
      datos: [D1.forma, D1.pareja],
      solucion: [
        { texto: 'Pruebo filas de 1 en adelante: se llenan con 1, 2 y 4; con 3, 5 y 6 sobran. Con 6 filas ya me paso de la mitad.', ecuacion: formasEc(28) },
        { texto: 'Son 3 formas y cada una da dos divisores distintos: 1, 2, 4, 7, 14 y 28.' },
      ],
      respuesta: [res(6), ' divisores'] },
    { nivel: 2, titulo: 'Un cuadrado en la bandeja',
      enunciado: '¿De cuántas formas se acomodan 25 caramelos en la bandeja, y cuántos divisores tiene 25?',
      datos: [D1.forma, D1.pareja],
      solucion: [
        { texto: 'Con 1 fila y con 5 filas se llena; con 2, 3 y 4 sobran.', ecuacion: formasEc(25) },
        { texto: 'En 5 filas de 5, el 5 va con él mismo: esa forma da un solo divisor nuevo. Los divisores son 1, 5 y 25.' },
      ],
      respuesta: [res(2), ' formas y ', res(3), ' divisores'] },
    { nivel: 2, titulo: 'Primos entre 20 y 30',
      enunciado: '¿Cuántos números primos hay entre 20 y 30?',
      datos: [D1.primo, D1.par],
      solucion: [
        { texto: 'Los pares no sirven: van en 2 filas. Quedan 21, 23, 25, 27 y 29.' },
        { texto: '21 = 3 × 7, 25 = 5 × 5 y 27 = 3 × 9 son compuestos. 23 y 29 solo caben en una fila.', ecuacion: ['23 = ', bas(1), ' × ', bas(23), SEP, '29 = ', bas(1), ' × ', bas(29)] },
      ],
      respuesta: [res(2), ' primos: el 23 y el 29'] },
    { nivel: 2, titulo: 'La caja de huevos',
      enunciado: 'Una bandeja de 30 huevos los lleva en 5 filas de 6. ¿De cuántas otras formas, en filas iguales y todas llenas, se acomodan 30 huevos?',
      datos: [D1.forma, D1.pareja],
      figura: bandeja({ n: 30, formas: [[5, 6]] }),
      solucion: [
        { texto: 'Pruebo filas de 1 en 1: se llenan con 1, 2, 3 y 5; con 4 sobran 2. Con 5 filas ya llegué a la forma del dibujo.', ecuacion: formasEc(30) },
        { texto: 'Son 4 formas en total; sin la de 5 filas de 6 quedan 3.' },
      ],
      respuesta: [res(3), ' formas más'] },
    { nivel: 2, titulo: 'Los compuestos hasta 12',
      enunciado: '¿Cuántos números del 1 al 12 son compuestos?',
      datos: [D1.primo, D1.comp],
      solucion: [
        { texto: 'El 1 no es primo ni compuesto. Los primos son 2, 3, 5, 7 y 11: solo caben en una fila.' },
        { texto: 'Los demás tienen otra forma: 4 = 2 × 2, 6 = 2 × 3, 8 = 2 × 4, 9 = 3 × 3, 10 = 2 × 5 y 12 = 3 × 4.', ecuacion: ['12 − 1 − 5 = ', res(6)] },
      ],
      respuesta: [res(6), ' compuestos'] },
    { nivel: 3, titulo: 'Dos primos que suman 25',
      enunciado: 'Dos números primos suman 25. ¿Cuál es su producto?',
      alternativas: ['46', '156', '66', '23', '25'],
      datos: [D1.primo, D1.par, 'Un impar más un impar da un par'],
      solucion: [
        { texto: 'Si los dos fueran impares, su suma sería par. 25 es impar: uno de los dos es el 2, el único primo par.' },
        { texto: 'El otro es 23, que es primo.', ecuacion: ['2 × 23 = ', res(46)] },
        { texto: ['Las trampas: ', letra('B'), ' usa 12 + 13, y 12 no es primo; ', letra('C'), ' usa 3 + 22, y 22 no es primo; ', letra('D'), ' es un primo solo; ', letra('E'), ' es la suma.'] },
      ],
      respuesta: [letra('A'), ': ', res(46)] },
    { nivel: 3, titulo: 'Las formas de 64',
      enunciado: '¿De cuántas formas distintas se acomodan 64 caramelos en la bandeja, en filas iguales y todas llenas?',
      alternativas: ['3', '4', '7', '5', '6'],
      datos: [D1.forma, D1.pareja],
      solucion: [
        { texto: 'Se llenan 1, 2, 4 y 8 filas; con 3, 5, 6 y 7 sobran. En 8 filas de 8 llego al cuadrado.', ecuacion: formasEc(64) },
        { texto: ['Las trampas: ', letra('A'), ' olvida la de 8 filas de 8; ', letra('C'), ' son los 7 divisores; ', letra('D'), ' cuenta el 8 × 8 dos veces; ', letra('E'), ' cuenta los divisores sin el 1.'] },
      ],
      respuesta: [letra('B'), ': ', res(4), ' formas'] },
    { nivel: 3, titulo: 'Cajas sin sueltos',
      enunciado: 'Doña Juana empaca 119 caramelos en cajas iguales, con más de 10 y menos de 20 caramelos por caja, sin que sobre ninguno. ¿Cuántas cajas arma?',
      alternativas: ['17', '9', '119', '7', '1'],
      datos: [D1.forma, D1.pareja],
      solucion: [
        { texto: 'Busco un divisor de 119 entre 10 y 20. Con 11, 13 o 19 sobran; con 17 no sobra nada.', ecuacion: ['119 = ', bas(7), ' × ', bas(17)] },
        { texto: 'Cada caja lleva 17 caramelos, y son 7 cajas.' },
        { texto: ['Las trampas: ', letra('A'), ' es lo que lleva cada caja; ', letra('B'), ' usa cajas de 13, y sobran 2; ', letra('C'), ' son cajas de 1 caramelo; ', letra('E'), ', una sola caja de 119.'] },
      ],
      respuesta: [letra('D'), ': ', res(7), ' cajas'] },
    { nivel: 3, titulo: 'Divisores en cantidad impar',
      enunciado: '¿Cuál de estos números tiene una cantidad impar de divisores?',
      alternativas: ['12', '18', '25', '30', '50'],
      datos: [D1.forma, D1.pareja],
      solucion: [
        { texto: 'Los divisores van en parejas. Solo queda uno sin pareja cuando un número va con él mismo: 25 = 5 × 5.', ecuacion: formasEc(25) },
        { texto: 'Por eso 25 tiene 3 divisores: 1, 5 y 25.' },
        { texto: ['Los demás solo tienen parejas de números distintos: ', letra('A'), ' y ', letra('B'), ' tienen 6, ', letra('D'), ' tiene 8 y ', letra('E'), ' tiene 6.'] },
      ],
      respuesta: [letra('C'), ': ', res(25)] },
    { nivel: 3, titulo: 'Dos formas, una de 3 filas',
      enunciado: 'Un número de dos cifras de caramelos se acomoda de exactamente dos formas en la bandeja, y una de ellas es de 3 filas. ¿Cuál es el mayor número posible?',
      alternativas: ['99', '96', '93', '33', '31'],
      datos: [D1.forma, D1.pareja, D1.primo],
      solucion: [
        { texto: 'Las dos formas son 1 fila y 3 filas. Si lo de cada fila no fuera primo, habría una tercera forma: el número es 3 × un primo.' },
        { texto: 'Con dos cifras, el primo más grande que sirve es 31.', ecuacion: formasEc(93) },
        { texto: ['Las trampas: ', letra('A'), ' también va en 9 filas de 11; ', letra('B'), ' va en 2, 4, 6 y 8 filas; ', letra('D'), ' es menor; ', letra('E'), ' es lo que lleva cada fila.'] },
      ],
      respuesta: [letra('C'), ': ', res(93)] },
  ];

  const primos = {
    id: 'rectangulos',
    titulo: 'Primo: una sola fila',
    pregunta: '¿Por qué el 7 es primo y el 1 no?',
    temas: ['Primos y compuestos'],
    pieza: BA,
    aprendizaje: 'Un primo tiene exactamente dos divisores: sus caramelos solo se acomodan en una fila. El 1 tiene uno solo: no es primo ni compuesto.',
    actividad: 'Cambiar cuántos caramelos hay y ver de cuántas formas se acomodan en la bandeja.',
    // Lee: la bandeja, las formas como parejas de divisores, y las dos palabras. No dice qué pasa con el 1 ni con el 2:
    // eso lo pregunta Predice.
    lee: {
      tarjetas: [
        { titulo: 'La bandeja de la vitrina', texto: 'Doña Juana acomoda 12 caramelos en la bandeja de la vitrina, en filas iguales y todas llenas. Puede poner 1 fila de 12, 2 filas de 6 o 3 filas de 4.',
          pieza: BA, dibujo: { datos: { n: 12 }, estado: {} } },
        { titulo: 'Una forma, dos divisores', texto: ['En 3 filas de 4, el ', bas(3), ' y el ', bas(4), ' dividen a 12 sin que sobre nada: son una pareja de divisores. 12 filas de 1 es la bandeja de 1 fila girada: la misma forma. Con filas de 5 sobran 2.'],
          ecuacion: ['12 = ', bas(3), ' × ', bas(4)],
          pieza: BA, dibujo: { datos: { n: 12, formas: [[3, 4]], intento: 5 }, estado: {} } },
        { titulo: 'Primos y compuestos', texto: 'Un número que solo se acomoda en una fila (o, girada, en una columna) es un número primo: sus divisores son el 1 y él mismo. Si se acomoda de más formas, como el 12, es un número compuesto.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cambiar cuántos caramelos hay. Cuenta las formas de cada número y busca los que solo caben en una fila.' },
      ],
    },
    ejemplos: EJEMPLOS_PRIMOS,
    juega: {
      pieza: BA,
      consigna: 'Doña Juana acomoda caramelos en la bandeja, en filas iguales y todas llenas. Mira todas las formas de cada cantidad.',
      mision: {
        // Una sola respuesta en la grilla: de 20 a 28, solo el 23 es primo (la prueba lo comprueba).
        texto: 'Busca entre 20 y 28 caramelos la cantidad que solo se acomoda en una fila.',
        logrado: v => v.n >= 20 && v.n <= 28 && esPrimo(v.n),
        bien: '23 = 1 × 23: una sola fila. Sus únicos divisores son 1 y 23.',
      },
      voz: 'Cambia los caramelos y cuenta las formas.',
      leyenda: [
        { s: bas('2 filas de 6'), t: 'una forma: da los divisores 2 y 6' },
        { s: 'divisores', t: 'los que lo dividen sin que sobre' },
      ],
      controles: [{ id: 'n', etiqueta: 'Caramelos', min: 4, max: 30, paso: 1, inicio: 12, decimales: 0 }],
      dibujo: v => ({ datos: { n: v.n, alto: altoJuego1() }, estado: {} }),
      // La relación: todas las parejas, y cuántos divisores dan.
      // Cada forma da dos divisores (sesión, 19 nov: con «12 = 1 × 12 = …: 6 divisores» y tres bandejas, el alumno
      // contaba 3); en el cuadrado, una da uno solo.
      lectura: v => {
        const ps = parejas(v.n), dv = divisores(v.n).length, k = ps.length, m = Math.round(Math.sqrt(v.n));
        if (k === 1) return ['1 forma: ', res(2), ' divisores, el ', bas(1), ' y el ', bas(v.n)];
        if (m * m === v.n) return [`${k} formas: `, res(dv), ' divisores (el ', bas(m), ' va con él mismo)'];
        return [`${k} formas, 2 divisores cada una: `, res(dv), ' divisores'];
      },
      minimo: 3,
    },
    predice: {
      pieza: BO,
      pregunta: 'En la rifa quedan los boletos 1, 2, 33, 35 y 37. Ganan los que llevan un número primo. ¿Cuántos ganan?',
      datos: ['Los boletos que quedan: 1, 2, 33, 35 y 37'],
      voz: 'Piensa cuántos divisores tiene cada boleto.',
      opciones: [
        { id: 'c', texto: '2', correcta: true },
        { id: 'uno', texto: '3', error: 'AT-PRIMO-UNO', siFuera: 'El 2 y el 37 están bien. Pero el 1 tiene un solo divisor, y un primo tiene dos.' },
        { id: 'par', texto: '1', error: 'AT-PRIMO-PAR', siFuera: 'El 37 sí es primo. El 2 también: sus divisores son 1 y 2, aunque sea par.' },
        { id: 'impar', texto: '4', error: 'AT-PRIMO-IMPAR', siFuera: 'El 37 es primo, bien. Pero 33 = 3 × 11 y 35 = 5 × 7, y el 1 no es primo.' },
      ],
      dibujo: { datos: { numeros: PREDICE1, columnas: 5, letrero: [['Gana un número primo']], pie: [['Boletos que quedan en la rifa']] }, estado: {} },
      revelar: { datos: { numeros: PREDICE1, columnas: 5, criba: { primos: [3, 5], uno: true, quedan: true }, letrero: [['Gana un número primo']], pie: [['Ganan '], ['2', 'f', 700], [' boletos: el 2 y el 37']] }, estado: {} },
      coincide: 'Coincide: ganan el 2 y el 37. El 1 tiene un solo divisor.',
      noCoincide: 'Revisemos cuántos divisores tiene cada boleto.',
    },
    mira: {
      pieza: BA,
      datos: { n: 1, pasos: PREDICE1.map(n => ({ n })).concat([{ n: 37 }]) },
      voz: 'Cuenta los divisores de cada boleto.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Un caramelo: una sola forma, que da un solo divisor.', ecuacion: ['1 = ', bas(1), ' × ', bas(1)] },
        { estado: { paso: 1 }, texto: 'Dos caramelos: 1 fila de 2. Dos divisores: es primo.', ecuacion: ['2 = ', bas(1), ' × ', bas(2)] },
        { estado: { paso: 2 }, texto: '33 también va en 3 filas de 11: es compuesto.', ecuacion: formasEc(33) },
        { estado: { paso: 3 }, texto: '35 también va en 5 filas de 7: es compuesto.', ecuacion: formasEc(35) },
        { estado: { paso: 4 }, texto: '37 solo cabe en una fila: dos divisores, es primo.', ecuacion: formasEc(37) },
        { estado: { paso: 5 }, texto: 'Ganan el 2 y el 37. El 1 no es primo ni compuesto.', ecuacion: ['ganan ', res(2), ' boletos'] },
      ],
    },
    regla: {
      texto: 'Un número primo tiene exactamente dos divisores: 1 y él mismo. Un compuesto tiene más. El 1 tiene uno solo: no es primo ni compuesto. Cada forma da dos divisores.',
      ecuacion: [{ llave: formasEc(37), nota: 'una forma: primo' }, SEP, { llave: formasEc(35), nota: 'más formas: compuesto' }],
      condicion: 'Primos y compuestos son enteros mayores que 1. El 2 es el único primo par: los demás pares van en 2 filas.',
      voz: 'Dos divisores, primo. Más de dos, compuesto.',
      dibujo: { pieza: BA, datos: { n: 35 }, estado: {} },
    },
    // Así se resuelve: cuántas formas tiene un número que no es cuadrado. «Ahora tú» pide otra cosa: cuál es primo,
    // cuántos primos hay en una lista, cuántos divisores, las formas de un cuadrado, dos primos que suman un impar y un
    // divisor en un rango.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const N = r.ent(40, 99), ps = parejas(N);
          if (ps.length < 3 || ps.some(([a, b]) => a === b)) continue;
          const llenas = ps.map(x => x[0]), sobran = [];
          for (let a = 2; a <= ps[ps.length - 1][0]; a++) if (N % a) sobran.push(a);
          return {
            enunciado: `Doña Juana tiene ${N} caramelos. ¿De cuántas formas distintas los acomoda en la bandeja, en filas iguales y todas llenas?`,
            datos: [D1.forma, D1.pareja],
            pasos: [
              { tipo: 'pide', texto: `Piden cuántas parejas filas × caramelos por fila dan ${N}.` },
              { tipo: 'regla', texto: 'Cada forma es una pareja de divisores. Pruebo cuántas filas, de 1 en 1, hasta que las filas pasen a ser más que los caramelos de cada fila.' },
              { tipo: 'cuentas', texto: `Se llenan ${yLista(llenas)} ${llenas.length === 1 ? 'fila' : 'filas'}${sobran.length ? `; con ${yLista(sobran)} sobran` : ''}.`, ecuacion: formasEc(N, ps) },
              { tipo: 'sentido', texto: `Cada forma da dos divisores distintos: ${N} tiene ${2 * ps.length} divisores, el doble de las formas.` },
            ],
            respuesta: [res(ps.length), ' formas'],
          };
        }
      },
    },
    ahoraTu: {
      voz: 'Cuenta los divisores, no solo las formas.',
      generar(sem) {
        const r = azar(sem + 53), tipo = sem % 6;
        if (tipo === 0) return conCuatro(casoCual, r);
        if (tipo === 1) return conCuatro(casoLista, r);
        if (tipo === 2) return conCuatro(casoDivisores, r);
        if (tipo === 3) return conCuatro(casoCuadrado, r);
        if (tipo === 4) return conCuatro(casoDosPrimos, r);
        return conCuatro(casoRango, r);
      },
    },
  };

  // ---------- Idea 2 (rehecha, 19 nov): la criba tacha múltiplos (criba de Eratóstenes) ----------
  // Propuesta §1 a §7. Conserva el id `criba` y el control `p`; la mesa `criba-100` sigue con la plancha hasta 100.
  // Objeto: la plancha de boletos de la rifa (arit-boletos, bloque «criba», de prueba), donde doña Juana tacha los que
  // no son primos. Cambia: hasta qué primo se tacha. · Permanece: la plancha del 1 al 30. · Progresa: múltiplos de 2,
  // de 3, de 5. · Se reserva: la plancha del 1 al 100 (la predicción). · Debe verse: cada primo empieza a tachar en su
  // cuadrado; cuando p × p pasa del último boleto, ya no tacha nada nuevo.
  // Errores (hipótesis de aula): AT-CRIBA-MISMO usa el tope de otra plancha · AT-CRIBA-PASA cree que hay que pasar la
  // raíz · AT-CRIBA-MITAD prueba hasta la mitad · AT-CRIBA-CORTA se queda corto (prueba solo 2, 3, 5 y 7) · AT-CRIBA-RAIZ
  // prueba con la raíz aunque no sea primo · AT-CRIBA-OTRO responde el otro primo de la pareja · AT-CRIBA-SIETE no tacha
  // con el 7 (77 y 91 parecen primos) · AT-PRIMO-TERMINA cree que terminar en 1, 3, 7 o 9 basta · AT-PA-UNO-MAS cuenta un
  // término de más.
  const PRIMOS20 = primosHasta(20);
  const cribaDe = (hasta, p, extra = {}) => Object.assign({ desde: 1, hasta, columnas: 10, criba: { primos: primosHasta(p), uno: true } }, extra);
  const LETRERO2 = p => [['Tachar con los primos hasta el '], [String(p), 'i', 700]];
  const quedanComp = (hasta, p) => { const out = []; for (let x = 2; x <= hasta; x++) if (!esPrimo(x) && !primosHasta(p).some(q => x % q === 0)) out.push(x); return out; };
  const menorPrimo = N => factores(N)[0][0];
  const D2 = {
    raiz: 'N es primo si no es múltiplo de ningún primo p con p × p ≤ N',
    pareja: 'Si N = d × k y d pasa de la raíz cuadrada de N, entonces k no llega',
    criba: 'La criba tacha el 1 y los múltiplos de cada primo, sin tachar al primo mismo',
    p20: 'Los primos menores que 20: 2, 3, 5, 7, 11, 13, 17 y 19',
    p40: 'Los primos menores que 40: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31 y 37',
  };

  // Ahora tú · tipo 0: el mayor primo con el que hay que probar.
  function casoHasta(r) {
    const N = r.de(primosHasta(999).filter(x => x > 120));
    const ps = primosHasta(40), i = ps.filter(p => p * p <= N).length - 1, p = ps[i], sig = ps[i + 1], ant = ps[i - 1], rz = Math.floor(Math.sqrt(N));
    const mitad = primosHasta(Math.floor(N / 2)).pop();
    return {
      pregunta: `Para asegurarse de que ${N} es primo, ¿cuál es el mayor primo con el que hay que probar?`,
      datos: [D2.raiz, D2.p40],
      opciones: opciones(p, [
        { id: 'pasa', valor: sig, error: 'AT-CRIBA-PASA', siFuera: `Probar cerca de la raíz está bien. Pero ${sig} × ${sig} = ${sig * sig} pasa de ${N}.` },
        { id: 'corta', valor: ant, error: 'AT-CRIBA-CORTA', siFuera: `Te quedas corto: ${p} × ${p} = ${p * p} todavía no pasa de ${N}.` },
        { id: 'raiz', valor: esPrimo(rz) ? null : rz, error: 'AT-CRIBA-RAIZ', siFuera: `${rz} × ${rz} no pasa de ${N}, bien. Pero ${rz} no es primo: se prueba con primos.` },
        { id: 'mitad', valor: mitad, error: 'AT-CRIBA-MITAD', siFuera: 'Hasta la mitad también sirve, pero sobra: después de la raíz no hay parejas nuevas.' },
      ]),
      solucion: { texto: `${p} × ${p} = ${p * p} no pasa de ${N}; ${sig} × ${sig} = ${sig * sig} ya pasa.`, ecuacion: ['el mayor es ', res(p)] },
    };
  }
  // Ahora tú · tipo 1: el menor primo que divide a N = p × q, con los dos primos mayores que 7.
  function casoMenor(r) {
    const p = r.de([11, 13, 17, 19, 23]), q = r.de(primosHasta(80).filter(x => x > p)), N = p * q;
    if (N > 999) return null;
    return {
      pregunta: `¿Cuál es el menor primo que divide a ${N}?`,
      datos: [D2.raiz, D2.p40],
      opciones: opciones(p, [
        { id: 'otro', valor: q, error: 'AT-CRIBA-OTRO', siFuera: `${q} también divide a ${N}: ${N} = ${p} × ${q}. Pero ${p} es menor.` },
        { id: 'ninguno', valor: `Ninguno: ${N} es primo`, error: 'AT-CRIBA-CORTA', siFuera: `Probar 2, 3, 5 y 7 está bien, pero no basta: ${p} × ${p} = ${p * p} no pasa de ${N}.` },
        { id: 'uno', valor: 1, error: 'AT-PRIMO-UNO', siFuera: 'El 1 divide a todos los números, es cierto. Pero no es primo.' },
      ]),
      solucion: { texto: `Con 2, 3, 5, 7${p > 11 ? ' y los primos hasta el anterior' : ''} siempre sobra algo; con ${p} no.`, ecuacion: [`${N} = `, bas(p), ' × ', bas(q)] },
    };
  }
  // Ahora tú · tipo 2: cuántos primos hay en un tramo.
  function casoTramo(r) {
    const a = r.ent(50, 160), b = a + r.ent(18, 30);
    if (esPrimo(a) || esPrimo(b)) return null;
    const xs = []; for (let x = a + 1; x < b; x++) xs.push(x);
    const pr = xs.filter(esPrimo), falsos = xs.filter(x => !esPrimo(x) && [2, 3, 5].every(k => x % k));
    if (!falsos.length) return null;
    const impares = xs.filter(x => x % 2).length, terminan = xs.filter(x => [1, 3, 7, 9].includes(x % 10)).length;
    const f0 = falsos[0], m0 = menorPrimo(f0);
    return {
      pregunta: `¿Cuántos números primos hay entre ${a} y ${b}?`,
      datos: [D2.raiz, D2.criba, 'Los primos menores que 17: 2, 3, 5, 7, 11 y 13'],
      opciones: opciones(pr.length, [
        { id: 'siete', valor: pr.length + falsos.length, error: 'AT-CRIBA-SIETE', siFuera: `Tachar los múltiplos de 2, 3 y 5 está bien. Pero ${f0} = ${m0} × ${f0 / m0} también se tacha.` },
        { id: 'impar', valor: impares, error: 'AT-PRIMO-IMPAR', siFuera: 'Quitar los pares está bien, pero no basta: muchos impares son múltiplos de 3, 5 o 7.' },
        { id: 'termina', valor: terminan, error: 'AT-PRIMO-TERMINA', siFuera: `Terminar en 1, 3, 7 o 9 no basta: ${f0} = ${m0} × ${f0 / m0}.` },
      ]),
      solucion: { texto: `Quedan sin tachar ${yLista(pr)}.`, ecuacion: ['hay ', res(pr.length), pr.length === 1 ? ' primo' : ' primos'] },
    };
  }
  // Ahora tú · tipo 3 (San Marcos 2026-I): primos en progresión aritmética.
  const progresion = (p, n, d) => Array.from({ length: n }, (_, i) => p + i * d);
  function casoPA(r) {
    const n = r.de([3, 4, 5]), d = r.de([6, 10, 12, 14, 18, 30]), B = r.ent(40, 110);
    const sirve = [], fallan = [];
    for (const p of primosHasta(B)) { const t = progresion(p, n, d); if (t[n - 1] >= B) continue; (t.every(esPrimo) ? sirve : fallan).push(t); }
    if (sirve.length !== 1 || !fallan.length) return null;
    const t = sirve[0], mal = fallan.find(x => x.some(y => !esPrimo(y) && y % 2 && y % 3 && y % 5)) || fallan[fallan.length - 1];
    const comp = mal.find(y => !esPrimo(y)), mc = menorPrimo(comp);
    const NUM = { 3: 'Tres', 4: 'Cuatro', 5: 'Cinco' };
    return {
      pregunta: `${NUM[n]} números primos, todos menores que ${B}, forman una progresión aritmética: cada uno es el anterior más ${d}. ¿Cuál es el mayor?`,
      datos: [D2.raiz, `Progresión de razón ${d}: cada término es el anterior más ${d}`],
      opciones: opciones(t[n - 1], [
        { id: 'falla', valor: mal[n - 1], error: 'AT-CRIBA-CORTA', siFuera: `Esa progresión empieza en ${mal[0]}, un primo. Pero ${comp} = ${mc} × ${comp / mc} no es primo.` },
        { id: 'menor', valor: t[0], error: 'AT-RESPONDE-OTRA', siFuera: `La progresión ${t.join(', ')} está bien. Pero ${t[0]} es el menor; se pide el mayor.` },
        { id: 'mas', valor: t[n - 1] + d, error: 'AT-PA-UNO-MAS', siFuera: `Sumar ${d} está bien, pero son ${n} primos: ${t[n - 1] + d} sería uno de más.` },
      ]),
      solucion: { texto: `Solo empezando en ${t[0]} los ${n} son primos: ${t.join(', ')}.`, ecuacion: ['el mayor es ', res(t[n - 1])] },
    };
  }

  // Ejemplos resueltos de la idea 2. Cuentas rehechas aparte (cuentas-ideas.py): 7 × 7 = 49 < 50 y 11 × 11 = 121; 53 no es
  // múltiplo de 2, 3, 5 ni 7; primos hasta 20: 8; 91 = 7 × 13; el 7 empieza a tachar en 49; 221 = 13 × 17; 199 es primo
  // (13 × 13 = 169, 17 × 17 = 289); primos entre 70 y 90: 71, 73, 79, 83 y 89; del 1 al 60, tras 2, 3 y 5 queda el 49; el 7
  // tacha 49, 77 y 91 del 1 al 100; 17 × 17 = 289 ≤ 300 < 361 = 19 × 19 (149, el mayor primo hasta 150); con razón 6 y menos
  // de 60 solo 5, 11, 17, 23, 29 (11…35, 31…49 fallan); 323 = 17 × 19; primos de dos cifras que terminan en 7: 17, 37, 47,
  // 67, 97 (27 = 3 × 9, 57 = 3 × 19, 77 = 7 × 11, 87 = 3 × 29); el menor compuesto sin 2, 3, 5 ni 7: 121.
  const EJEMPLOS_CRIBA = [
    { nivel: 1, titulo: 'Probar hasta el 7',
      enunciado: 'Para saber si un número menor que 50 es primo, ¿hasta qué primo basta probar?',
      datos: [D2.raiz, D2.p20],
      solucion: [{ texto: 'El 7 sirve: 7 × 7 = 49 no pasa de 50. El siguiente primo, 11, ya da 11 × 11 = 121.', ecuacion: ['7 × 7 = 49 ≤ 50'] }],
      respuesta: ['Hasta el ', res(7)] },
    { nivel: 1, titulo: '¿Es 53 primo?',
      enunciado: '¿Es 53 un número primo?',
      datos: [D2.raiz, D2.p20],
      solucion: [{ texto: 'Pruebo 2, 3, 5 y 7, porque 7 × 7 = 49 no pasa de 53 y 11 × 11 sí. Con los cuatro sobra algo.', ecuacion: ['53 = ', bas(7), ' × 7 + ', sob(4)] }],
      respuesta: [res('Sí'), ', 53 es primo'] },
    { nivel: 1, titulo: 'Los primos hasta 20',
      enunciado: '¿Cuántos primos hay del 1 al 20?',
      datos: [D2.criba, D1.primo],
      figura: { pieza: BO, datos: { desde: 1, hasta: 20, columnas: 10 }, estado: {} },
      solucion: [
        { texto: 'Tacho el 1, los múltiplos de 2 desde el 4 y los de 3 desde el 9. El 5 empezaría en 25: no hace falta.' },
        { texto: 'Quedan 2, 3, 5, 7, 11, 13, 17 y 19.' },
      ],
      respuesta: [res(8), ' primos'] },
    { nivel: 1, titulo: '¿Es 91 primo?',
      enunciado: '¿Es 91 un número primo?',
      datos: [D2.raiz, D2.p20],
      solucion: [{ texto: 'No es múltiplo de 2, 3 ni 5. Pero con 7 no sobra nada.', ecuacion: ['91 = ', bas(7), ' × ', bas(13)] }],
      respuesta: [res('No'), ': es compuesto'] },
    { nivel: 1, titulo: 'Lo primero que tacha el 7',
      enunciado: 'En la criba, ¿cuál es el primer número que tacha el 7 y que ningún primo menor había tachado?',
      datos: [D2.criba],
      solucion: [{ texto: '14, 21, 28, 35 y 42 ya caían con el 2, el 3 o el 5: son 7 × un número menor que 7. El primero nuevo es 7 × 7.', ecuacion: ['7 × 7 = ', res(49)] }],
      respuesta: [res(49)] },
    { nivel: 2, titulo: '¿Es 221 primo?',
      enunciado: '¿Es 221 un número primo?',
      datos: [D2.raiz, D2.p20],
      solucion: [
        { texto: 'Pruebo los primos hasta 13, porque 13 × 13 = 169 no pasa de 221 y 17 × 17 = 289 sí.' },
        { texto: 'Con 2, 3, 5, 7 y 11 sobra algo. Con 13 no sobra nada.', ecuacion: ['221 = ', bas(13), ' × ', bas(17)] },
      ],
      respuesta: [res('No'), ': 221 = 13 × 17'] },
    { nivel: 2, titulo: '¿Es 199 primo?',
      enunciado: '¿Es 199 un número primo?',
      datos: [D2.raiz, D2.p20],
      solucion: [
        { texto: 'Basta probar hasta 13: 13 × 13 = 169 no pasa de 199 y 17 × 17 = 289 sí.' },
        { texto: 'Con 2, 3, 5, 7, 11 y 13 siempre sobra algo.', ecuacion: ['199 = ', bas(13), ' × 15 + ', sob(4)] },
      ],
      respuesta: [res('Sí'), ', 199 es primo'] },
    { nivel: 2, titulo: 'Primos entre 70 y 90',
      enunciado: '¿Cuántos números primos hay entre 70 y 90?',
      datos: [D2.raiz, D2.criba, D2.p20],
      solucion: [
        { texto: 'Sin pares ni múltiplos de 3 y 5 quedan 71, 73, 77, 79, 83 y 89. Basta probar hasta 7: 11 × 11 pasa de 90.' },
        { texto: '77 = 7 × 11 se tacha. Los otros cinco son primos.' },
      ],
      respuesta: [res(5), ' primos'] },
    { nivel: 2, titulo: 'Lo que deja el 5',
      enunciado: 'En la plancha del 1 al 60 se tachan el 1 y los múltiplos de 2, de 3 y de 5. ¿Qué número que no es primo queda sin tachar?',
      datos: [D2.criba, D2.raiz],
      solucion: [
        { texto: 'Un compuesto que no es múltiplo de 2, 3 ni 5 tiene que ser múltiplo de 7 o de un primo mayor.' },
        { texto: 'El primero es 7 × 7; el siguiente, 7 × 11 = 77, ya pasa de 60.', ecuacion: ['7 × 7 = ', res(49)] },
      ],
      respuesta: ['Queda el ', res(49)] },
    { nivel: 2, titulo: 'Lo que tacha el 7',
      enunciado: 'En la criba del 1 al 100, ¿cuántos números nuevos tacha el 7?',
      datos: [D2.criba],
      solucion: [
        { texto: 'El 7 tacha desde 7 × 7: 49, 56, 63, 70, 77, 84, 91 y 98.' },
        { texto: 'Los pares y el 63 ya estaban tachados. Quedan nuevos 49, 77 y 91.', ecuacion: ['49 = 7 × 7 ; 77 = 7 × 11 ; 91 = 7 × 13'] },
      ],
      respuesta: [res(3), ' números'] },
    { nivel: 3, titulo: 'Probar hasta 300',
      enunciado: 'Para saber si un número menor que 300 es primo, ¿cuál es el mayor primo con el que hace falta probar?',
      alternativas: ['17', '13', '19', '149', '300'],
      datos: [D2.raiz, D2.p40],
      solucion: [
        { texto: 'Busco el mayor primo cuyo cuadrado no pase de 300.', ecuacion: ['17 × 17 = 289 ≤ 300 ; 19 × 19 = 361 > 300'] },
        { texto: ['Las trampas: ', letra('B'), ' se queda corto (13 × 13 = 169); ', letra('C'), ' ya pasa; ', letra('D'), ' prueba hasta la mitad; ', letra('E'), ' prueba hasta el número mismo.'] },
      ],
      respuesta: [letra('A'), ': ', res(17)] },
    { nivel: 3, titulo: 'Cinco primos en fila',
      enunciado: 'Cinco números primos, todos menores que 60, forman una progresión aritmética: cada uno es el anterior más 6. ¿Cuál es el mayor?',
      alternativas: ['5', '35', '29', '49', '24'],
      datos: [D2.raiz, 'Progresión de razón 6: cada término es el anterior más 6'],
      solucion: [
        { texto: 'Pruebo cada primo de inicio. 7 da 25 = 5 × 5; 11 da 35 = 5 × 7; 13 da 25; 31 da 49 = 7 × 7.' },
        { texto: 'Solo 5, 11, 17, 23 y 29 son todos primos.' },
        { texto: ['Las trampas: ', letra('A'), ' es el menor; ', letra('B'), ' sale de empezar en 11; ', letra('D'), ', de empezar en 31; ', letra('E'), ' es 4 × 6, lo que se sumó.'] },
      ],
      respuesta: [letra('C'), ': ', res(29)] },
    { nivel: 3, titulo: 'El menor divisor primo',
      enunciado: '¿Cuál es el menor primo que divide a 323?',
      alternativas: ['19', '17', '7', '1', 'Ninguno: 323 es primo'],
      datos: [D2.raiz, D2.p20],
      solucion: [
        { texto: 'Hay que probar hasta 17: 17 × 17 = 289 no pasa de 323. Con 2, 3, 5, 7, 11 y 13 sobra algo.', ecuacion: ['323 = ', bas(17), ' × ', bas(19)] },
        { texto: ['Las trampas: ', letra('A'), ' es el otro primo; ', letra('C'), ' deja resto 1; ', letra('D'), ' no es primo; ', letra('E'), ' se detuvo antes del 17.'] },
      ],
      respuesta: [letra('B'), ': ', res(17)] },
    { nivel: 3, titulo: 'Primos que terminan en 7',
      enunciado: '¿Cuántos números primos de dos cifras terminan en 7?',
      alternativas: ['9', '6', '5', '7', '8'],
      datos: [D2.raiz, 'Los números de dos cifras van del 10 al 99'],
      solucion: [
        { texto: 'Los que terminan en 7 son 17, 27, 37, 47, 57, 67, 77, 87 y 97. Basta probar hasta 7.' },
        { texto: '27 = 3 × 9, 57 = 3 × 19, 87 = 3 × 29 y 77 = 7 × 11 se tachan. Quedan 17, 37, 47, 67 y 97.' },
        { texto: ['Las trampas: ', letra('A'), ' los cuenta todos; ', letra('B'), ' deja el 77; ', letra('D'), ' deja el 57 y el 77; ', letra('E'), ' solo quita el 27.'] },
      ],
      respuesta: [letra('C'), ': ', res(5)] },
    { nivel: 3, titulo: 'El menor compuesto escondido',
      enunciado: '¿Cuál es el menor número compuesto que no es múltiplo de 2, 3, 5 ni 7?',
      alternativas: ['49', '77', '91', '143', '121'],
      datos: [D1.comp, D2.criba],
      solucion: [
        { texto: 'Sus primos tienen que ser 11 o mayores. El producto más chico es 11 × 11.', ecuacion: ['11 × 11 = ', res(121)] },
        { texto: ['Las trampas: ', letra('A'), ', ', letra('B'), ' y ', letra('C'), ' son múltiplos de 7; ', letra('D'), ' es 11 × 13, mayor que 121.'] },
      ],
      respuesta: [letra('E'), ': ', res(121)] },
  ];

  const criba = {
    id: 'criba',
    titulo: 'La criba tacha múltiplos',
    pregunta: '¿Hasta dónde hay que probar para saber si un número es primo?',
    temas: ['Criba de Eratóstenes'],
    pieza: BO,
    aprendizaje: 'Para saber si N es primo basta probar con los primos p que cumplen p × p ≤ N; la criba tacha los múltiplos de esos primos.',
    actividad: 'Tachar en la plancha de la rifa los múltiplos de cada primo.',
    // Lee: la plancha, cómo se tacha y las parejas de divisores (de la idea 1). No dice dónde empieza a tachar cada primo
    // ni hasta dónde llegar: eso es la misión y la predicción.
    lee: {
      tarjetas: [
        { titulo: 'La rifa de los primos', texto: 'Doña Juana quiere premiar solo los boletos que llevan un número primo. Para no probar uno por uno, tacha los que seguro no lo son.',
          pieza: BO, dibujo: { datos: { desde: 1, hasta: 30, columnas: 10 }, estado: {} } },
        { titulo: 'Tachar múltiplos', texto: ['Primero tacha el 1. Después deja el ', bas(2), ' y tacha sus múltiplos: 4, 6, 8… Ninguno es primo, porque todos van en 2 filas. Sigue con el siguiente número sin tachar.'],
          pieza: BO, dibujo: { datos: cribaDe(30, 2), estado: {} } },
        { titulo: 'La criba', texto: 'Este método se llama criba de Eratóstenes: como un cernidor, deja pasar los múltiplos y se quedan los primos. Recuerda que los divisores van en parejas.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir hasta qué primo se tacha. Mira cuál es el primer número nuevo que tacha cada primo, y cuándo un primo ya no tacha nada.' },
      ],
    },
    ejemplos: EJEMPLOS_CRIBA,
    juega: {
      pieza: BO,
      consigna: 'Doña Juana tacha en la plancha del 1 al 30 los boletos que no son primos. Elige hasta qué primo tacha.',
      mision: {
        // Una sola respuesta: con 3 queda el 25; con 5 ya no queda ningún compuesto; el 7 no es el menor.
        texto: 'Elige el menor primo con el que todo lo que queda sin tachar es primo.',
        logrado: v => v.p === 5,
        bien: 'Con el 5 cayó el 25 = 5 × 5. Desde ahí, ningún primo tacha nada nuevo.',
      },
      voz: 'Elige el primo y mira qué queda sin tachar.',
      leyenda: [
        { s: bas(2), t: 'el primo que tacha sus múltiplos' },
        { s: 'raya', t: 'tachado: no es primo' },
      ],
      controles: [{ id: 'p', etiqueta: 'Tachar hasta el', color: 'c-i', opciones: [2, 3, 5, 7].map(x => ({ valor: x, texto: String(x) })) }],
      dibujo: v => ({ datos: cribaDe(30, v.p, { letrero: LETRERO2(v.p) }), estado: {} }),
      lectura: v => {
        const qc = quedanComp(30, v.p);
        if (!qc.length) return [`Hasta el ${v.p}: quedan `, res(primosHasta(30).length), ' sin tachar, todos primos'];
        if (qc.length === 1) return [`Hasta el ${v.p}: sigue sin tachar el ${qc[0]} = `, bas(menorPrimo(qc[0])), ' × ', bas(qc[0] / menorPrimo(qc[0]))];
        return [`Hasta el ${v.p}: siguen sin tachar ${yLista(qc)}`];
      },
      minimo: 3,
    },
    predice: {
      pieza: BO,
      pregunta: 'La rifa grande tiene boletos del 1 al 100. ¿Hasta qué primo, como mínimo, hay que tachar múltiplos para que solo queden primos sin tachar?',
      datos: [D2.p20],
      voz: 'Piensa en el primer número que tacha cada primo.',
      opciones: [
        { id: 'c', texto: '7', correcta: true },
        { id: 'mismo', texto: '5', error: 'AT-CRIBA-MISMO', siFuera: 'Con 30 bastaba el 5, es cierto. Pero hasta 100 queda el 49 = 7 × 7.' },
        { id: 'pasa', texto: '11', error: 'AT-CRIBA-PASA', siFuera: 'Pasar de 10 parece seguro. Pero 11 × 11 = 121 no cabe: el 11 no tacha nada nuevo.' },
        { id: 'mitad', texto: '47', error: 'AT-CRIBA-MITAD', siFuera: 'Llegar a la mitad también deja solo primos, pero sobra: desde el 11 nada cambia.' },
      ],
      dibujo: { datos: { desde: 1, hasta: 100, columnas: 10, letrero: [['Rifa grande: del 1 al 100']], pie: [['¿Hasta qué primo se tacha?']] }, estado: {} },
      revelar: { datos: cribaDe(100, 7, { criba: { primos: primosHasta(7), uno: true, quedan: true }, letrero: [['Rifa grande: del 1 al 100']], pie: [['Hasta el '], ['7', 'f', 700], [': quedan 25 primos']] }), estado: {} },
      coincide: 'Coincide: 7 × 7 = 49 cabe en 100, y 11 × 11 = 121 ya no.',
      noCoincide: 'Revisemos dónde empieza a tachar cada primo.',
    },
    mira: {
      pieza: BO,
      datos: { desde: 1, hasta: 100, columnas: 10, letrero: [['Rifa grande: del 1 al 100']],
        pasos: [[], [2], [2, 3], [2, 3, 5], [2, 3, 5, 7]].map(ps => ({ criba: { primos: ps, uno: true }, pie: [[ps.length ? `Tachados los múltiplos de ${yLista(ps)}` : 'Tachado el 1']] }))
          .concat([{ criba: { primos: [2, 3, 5, 7], uno: true, quedan: true }, pie: [['Quedan '], ['25', 'f', 700], [' primos']] }]) },
      voz: 'Cada primo empieza a tachar más lejos.',
      pasos: [
        { estado: { paso: 0 }, texto: 'El 1 no es primo: se tacha primero.' },
        { estado: { paso: 1 }, texto: 'El 2 se queda y tacha sus múltiplos desde el 4.', ecuacion: ['4, 6, 8, …, 100'] },
        { estado: { paso: 2 }, texto: 'El 3 tacha algo nuevo recién en 9: el 6 ya estaba.', ecuacion: ['3 × 3 = 9'] },
        { estado: { paso: 3 }, texto: 'El 5 tacha algo nuevo recién en 25.', ecuacion: ['5 × 5 = 25'] },
        { estado: { paso: 4 }, texto: 'El 7 empieza en 49: tacha el 49, el 77 y el 91.', ecuacion: ['7 × 7 = 49'] },
        { estado: { paso: 5 }, texto: 'El 11 empezaría en 121: ya no tacha nada. Quedan 25 primos.', ecuacion: ['11 × 11 = 121 > 100'] },
      ],
    },
    regla: {
      texto: 'Para saber si N es primo, se divide entre los primos p con p × p ≤ N. Si ninguno lo divide sin que sobre nada, N es primo.',
      ecuacion: [{ llave: ['p × p ≤ N'], nota: 'basta probar esos p' }, SEP, 'N = ', bas('d'), ' × ', bas('k'), '  →  ', bas('d'), ' ≤ ', { raiz: ['N'] }, ' o ', bas('k'), ' ≤ ', { raiz: ['N'] }],
      condicion: 'Si un divisor pasa de la raíz cuadrada de N, su pareja no llega. Cada primo tacha desde p × p.',
      voz: 'Se prueba hasta la raíz, con primos.',
    },
    // Así se resuelve: ¿es primo un número de tres cifras que sí lo es? «Ahora tú» pide otra cosa: el mayor primo con el
    // que hay que probar, el menor primo que divide, los primos de un tramo y primos en progresión.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        const N = r.de(primosHasta(500).filter(x => x > 150));
        const ps = primosHasta(40).filter(p => p * p <= N), p = ps[ps.length - 1], sig = primosHasta(40).find(x => x > p);
        return {
          enunciado: `¿Es ${N} un número primo?`,
          datos: [D2.raiz, D2.p40],
          pasos: [
            { tipo: 'pide', texto: `Piden saber si ${N} tiene algún divisor además del 1 y de ${N}.` },
            { tipo: 'regla', texto: 'Basta dividir entre los primos cuyo cuadrado no pasa del número: si uno lo dividiera, su pareja sería más chica.' },
            { tipo: 'datos', texto: `${p} × ${p} = ${p * p} no pasa de ${N}, y ${sig} × ${sig} = ${sig * sig} sí: pruebo de 2 a ${p}.` },
            { tipo: 'cuentas', texto: `Con ${yLista(ps)} siempre sobra algo. Por ejemplo, con el último:`, ecuacion: [`${N} = `, bas(p), ` × ${Math.floor(N / p)} + `, sob(N % p)] },
            { tipo: 'sentido', texto: `Ningún primo hasta ${p} lo divide, así que no hay ninguna pareja: ${N} solo va en una fila.` },
          ],
          respuesta: [res('Sí'), `: ${N} es primo`],
        };
      },
    },
    ahoraTu: {
      voz: 'Prueba con primos, hasta la raíz.',
      generar(sem) {
        const r = azar(sem + 71), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoHasta, r);
        if (tipo === 1) return conCuatro(casoMenor, r);
        if (tipo === 2) return conCuatro(casoTramo, r);
        return conCuatro(casoPA, r);
      },
    },
  };

  // ---------- Idea 3 (rehecha, 19 nov): una sola factorización (teorema fundamental y números PESI) ----------
  // Propuesta §1 a §7. Conserva el id `factorizacion` y el control `n`; `d` (el primer corte) es nuevo.
  // Objeto: el pedido que doña Juana parte en partes iguales, y cada parte otra vez (pieza arit-arbol, de prueba), junto a
  // la bandeja de «Lee». Cambia: el número y el primer corte. · Permanece: cada parte se corta hasta ser prima. ·
  // Progresa: primer corte → partes → hojas primas → la forma canónica. · Se reserva: qué es PESI (la predicción). ·
  // Debe verse: se empiece por donde se empiece, las hojas son las mismas.
  // PESI sin el máximo común divisor (propuesta, decisión 2): «no comparten ningún primo en su factorización».
  // Errores (hipótesis de aula): AT-PESI-PRIMOS lee el nombre y cree que los dos tienen que ser primos (el error que
  // nombra la matriz) · AT-PESI-UN-PRIMO cree que basta que uno sea primo · AT-PESI-IMPARES cree que dos impares no
  // comparten nada · AT-FACT-INCOMPLETA deja un compuesto sin partir · AT-FACT-EXPONENTE no cuenta las veces de cada primo ·
  // AT-FACT-SUMA cuenta una vez de más · AT-FACT-DISTINTOS cuenta los primos distintos · AT-FACT-CORTA se detiene antes ·
  // AT-FACT-TODOS cuenta todos los primos · AT-FACT-BASES suma los exponentes de las potencias sin descomponer las bases
  // (San Marcos 2025-I) · AT-FACT-MULTIPLICA multiplica los exponentes · AT-FACT-UNA-BASE mira una sola base.
  const AR = 'arit-arbol';
  const ARBOL = () => Kit.piezas[AR];
  // El árbol de un corte (los datos de arit-arbol): N partido en d × (N ÷ d) y cada parte por su menor primo; si d no
  // divide a N, queda lo que sobra. Se arma aquí porque la pieza carga después que la unidad.
  const parteArbol = x => (esPrimo(x) || x < 2 ? { n: x } : { n: x, hijos: [{ n: factores(x)[0][0] }, parteArbol(x / factores(x)[0][0])] });
  const arbolDe = (N, d) => (!d ? parteArbol(N) : N % d ? { n: N, sobra: { d, r: N % d } } : { n: N, hijos: [parteArbol(d), parteArbol(N / d)] });
  // La forma canónica, en partes de ecuación (los primos en turquesa, los exponentes en tinta) y en texto.
  const canon = N => factores(N).flatMap(([p, e], i) => [i ? ' × ' : '', e > 1 ? { sup: [bas(p), String(e)] } : bas(p)]).filter(x => x !== '');
  const canonTxt = fs => fs.map(([p, e]) => (e > 1 ? `${p}${sup(e)}` : String(p))).join(' × ');
  const hojasTxt = N => factores(N).flatMap(([p, e]) => Array(e).fill(p)).join(' × ');
  const NS3 = [36, 48, 60, 64, 81, 100], DS3 = [2, 3, 4, 5, 6, 10];
  let alto3 = null;
  const altoJuego3 = () => { if (alto3) return alto3; let h = 0; for (const n of NS3) for (const d of DS3) h = Math.max(h, ARBOL().geometria({ arboles: [arbolDe(n, d)] }).H); return (alto3 = h); };
  const D3 = {
    tfa: 'Todo número mayor que 1 es un producto de primos, de una sola manera salvo el orden',
    canon: 'Forma canónica: los primos de menor a mayor, cada uno con su exponente: 2² × 3 × 5',
    exp: 'El exponente dice cuántas veces entra el primo: 2³ = 2 × 2 × 2',
    pesi: 'Dos números son PESI si no comparten ningún primo en su factorización',
    potProd: 'Potencia de un producto: (2 × 3)⁴ = 2⁴ × 3⁴',
    potPot: 'Potencia de una potencia: (2²)³ = 2⁶; se multiplican los exponentes',
    prod: 'Al multiplicar, los exponentes de un mismo primo se suman: 2² × 2³ = 2⁵',
  };

  // Ahora tú · tipo 0: la forma canónica entre cuatro.
  function casoCanon(r) {
    const N = r.ent(60, 999), fs = factores(N);
    if (fs.length < 2 || fs.some(([p]) => p > 13) || fs.every(([, e]) => e === 1)) return null;
    // Sin terminar: la primera potencia que se repite queda como un número compuesto (2³ × 3² → 8 × 3²).
    const iRep = fs.findIndex(([, e]) => e > 1), val = fs[iRep][0] ** fs[iRep][1];
    const incompleta = fs.map(([p, e], i) => (i === iRep ? String(val) : e > 1 ? `${p}${sup(e)}` : String(p))).join(' × ');
    const sinExp = fs.map(([p]) => String(p)).join(' × '), mas = canonTxt(fs.map(([p, e], i) => [p, i === 0 ? e + 1 : e]));
    return {
      pregunta: `¿Cuál es la descomposición canónica de ${N}?`,
      datos: [D3.tfa, D3.canon],
      opciones: opciones(canonTxt(fs), [
        { id: 'incompleta', valor: incompleta, error: 'AT-FACT-INCOMPLETA', siFuera: `El producto da ${N}, bien. Pero ${val} no es primo: falta partirlo.` },
        { id: 'sinexp', valor: sinExp, error: 'AT-FACT-EXPONENTE', siFuera: `Los primos están bien. Pero cada uno entra más de una vez: ${sinExp} no da ${N}.` },
        { id: 'mas', valor: mas, error: 'AT-FACT-SUMA', siFuera: `Los primos están bien. Pero el ${fs[0][0]} entra ${fs[0][1]} ${fs[0][1] === 1 ? 'vez' : 'veces'}, no ${fs[0][1] + 1}.` },
      ]),
      solucion: { texto: `Partiendo ${N} hasta llegar a primos: ${hojasTxt(N)}.`, ecuacion: [`${N} = `, ...canon(N)] },
    };
  }
  // Ahora tú · tipo 1: cuántas veces entra el 2.
  function casoExponente(r) {
    const a = r.ent(3, 6), m = r.de([9, 15, 21, 25, 27, 35, 45, 63, 75]), N = 2 ** a * m;
    if (N > 2000) return null;
    const fs = factores(N), todos = fs.reduce((x, [, e]) => x + e, 0);
    return {
      pregunta: `¿Cuántas veces entra el 2 en la factorización de ${N}?`,
      datos: [D3.tfa, D3.exp],
      opciones: opciones(a, [
        { id: 'distintos', valor: fs.length, error: 'AT-FACT-DISTINTOS', siFuera: `${N} tiene ${fs.length} primos distintos, es cierto. Pero se pregunta cuántas veces entra el 2.` },
        { id: 'corta', valor: a - 1, error: 'AT-FACT-CORTA', siFuera: `Dividir entre 2 está bien, pero una vez más: ${N / 2 ** (a - 1)} todavía es par.` },
        { id: 'todos', valor: todos, error: 'AT-FACT-TODOS', siFuera: `Esos son todos los primos de ${N}, contando los ${a} doses. Se piden solo los doses.` },
      ]),
      solucion: { texto: `Se divide entre 2 hasta que queda impar: ${N} = ${2 ** a} × ${m}.`, ecuacion: [`${N} = `, ...canon(N), ': el 2 entra ', res(a), ' veces'] },
    };
  }
  // Ahora tú · tipo 2: cuál par es PESI.
  const PARES_PESI = [[8, 9], [4, 15], [9, 10], [14, 25], [16, 27], [21, 22], [25, 36], [20, 21], [27, 32], [35, 48]];
  function casoPesi(r) {
    const [a, b] = r.de(PARES_PESI), p = r.de([3, 5, 7, 11]), k = r.de([2, 3, 4, 5].filter(x => x !== p)), u = [p, p * k];
    const [i1, i2] = r.de([[9, 21], [15, 25], [21, 33], [25, 35], [15, 21], [27, 45]]);
    const NO = 'Ninguno: los dos tendrían que ser primos';
    return {
      pregunta: 'Dos números son PESI (primos entre sí) si no comparten ningún primo en su factorización. ¿Cuál de estos pares es PESI?',
      datos: [D3.pesi, 'PESI se lee «primos entre sí»'],
      opciones: opciones(`${a} y ${b}`, [
        { id: 'unprimo', valor: `${u[0]} y ${u[1]}`, error: 'AT-PESI-UN-PRIMO', siFuera: `${p} es primo, bien. Pero ${u[1]} = ${k} × ${p}: comparten el ${p}.` },
        { id: 'impares', valor: `${i1} y ${i2}`, error: 'AT-PESI-IMPARES', siFuera: `Ninguno es par, es cierto. Pero ${i1} y ${i2} comparten el ${menorPrimo(mcd(i1, i2))}.` },
        { id: 'primos', valor: NO, error: 'AT-PESI-PRIMOS', siFuera: 'El nombre engaña: PESI pide no compartir primos, no que los dos sean primos.' },
      ]),
      solucion: { texto: `${a} = ${hojasTxt(a)} y ${b} = ${hojasTxt(b)}: ningún primo se repite.`, ecuacion: [res(`${a} y ${b}`), ' son PESI'] },
    };
  }
  // Ahora tú · tipo 3 (San Marcos 2025-I): el exponente de un primo en un producto de potencias de compuestos.
  const BASES3 = [6, 10, 12, 15, 18, 20, 24, 45, 50, 75];
  function casoPotencias(r) {
    const A = r.de(BASES3), B = r.de(BASES3.filter(x => x !== A)), x = r.ent(2, 5), y = r.ent(2, 4);
    const comunes = factores(A).map(f => f[0]).filter(p => B % p === 0);
    if (!comunes.length) return null;
    const P = r.de(comunes), eA = factores(A).find(f => f[0] === P)[1], eB = factores(B).find(f => f[0] === P)[1], c = eA * x + eB * y;
    if (eA === 1 && eB === 1) return null;
    return {
      pregunta: ['¿Cuál es el exponente de ', bas(P), ' en la descomposición canónica de ', { sup: [String(A), String(x)] }, ' × ', { sup: [String(B), String(y)] }, '?'],
      datos: [D3.potProd, D3.potPot, D3.prod],
      opciones: opciones(c, [
        { id: 'bases', valor: x + y, error: 'AT-FACT-BASES', siFuera: `Sumar exponentes está bien. Pero ${A} y ${B} no son primos: primero se descomponen.` },
        { id: 'multiplica', valor: x * y, error: 'AT-FACT-MULTIPLICA', siFuera: `Los exponentes de un producto se suman, no se multiplican. Y antes se descomponen ${A} y ${B}.` },
        { id: 'una', valor: eA * x, error: 'AT-FACT-UNA-BASE', siFuera: `Lo de ${A}${sup(x)} está bien: ${eA * x}. Falta el ${P} que trae ${B}${sup(y)}.` },
      ]),
      solucion: { texto: `${A} = ${canonTxt(factores(A))} y ${B} = ${canonTxt(factores(B))}: el ${P} entra ${eA} × ${x} + ${eB} × ${y} veces.`, ecuacion: [`${eA} × ${x} + ${eB} × ${y} = `, res(c)] },
    };
  }

  // Ejemplos resueltos de la idea 3. Cuentas rehechas aparte (cuentas-ideas.py): 84 = 2² × 3 × 7; 90 = 2 × 3² × 5; 36 por
  // 4 × 9 y por 6 × 6 llega a 2² × 3²; 9 = 3² y 16 = 2⁴; 162 = 2 × 3⁴; 1001 = 7 × 11 × 13; 35 = 5 × 7 y 42 = 2 × 3 × 7;
  // 12 × 18 = 2³ × 3³ = 216; 2310 = 2 × 3 × 5 × 7 × 11; 360 = 2³ × 3² × 5; 12³ × 45² = 2⁶ × 3⁷ × 5²; de 5, 9, 14, 25, 35 y 49
  // son PESI con 12 el 5, 25, 35 y 49; 2³ × 5 por 7 tiene los primos de 2 × 5² × 7; 6N = 2⁵ × 3³ da N = 2⁴ × 3² (a + b = 6);
  // 2⁴ × 6³ × 15² = 2⁷ × 3⁵ × 5² (tres primos distintos).
  const EJEMPLOS_FACT = [
    { nivel: 1, titulo: 'Factorizar 84',
      enunciado: '¿Cuál es la descomposición canónica de 84?',
      datos: [D3.tfa, D3.canon],
      figura: { pieza: AR, datos: { arboles: [{ n: 84 }] }, estado: {} },
      solucion: [{ texto: '84 se parte en 2 × 42, 42 en 2 × 21 y 21 en 3 × 7. Todas las hojas son primas.', ecuacion: ['84 = 2 × 2 × 3 × 7 = ', ...canon(84)] }],
      respuesta: [res('2² × 3 × 7')] },
    { nivel: 1, titulo: 'Factorizar 90',
      enunciado: '¿Cuál es la descomposición canónica de 90?',
      datos: [D3.tfa, D3.canon],
      solucion: [{ texto: '90 = 9 × 10, 9 = 3 × 3 y 10 = 2 × 5. Se ordenan los primos de menor a mayor.', ecuacion: ['90 = 2 × 3 × 3 × 5 = ', ...canon(90)] }],
      respuesta: [res('2 × 3² × 5')] },
    { nivel: 1, titulo: 'Dos caminos para 36',
      enunciado: 'Ana parte 36 primero en 4 × 9 y Beto en 6 × 6. ¿A qué primos llega cada uno?',
      datos: [D3.tfa],
      figura: { pieza: AR, datos: { arboles: [arbolDe(36, 4), arbolDe(36, 6)], profundidad: 1, pies: [[['Ana']], [['Beto']]] }, estado: {} },
      solucion: [
        { texto: 'Ana: 4 = 2 × 2 y 9 = 3 × 3. Beto: cada 6 es 2 × 3.' },
        { texto: 'Los dos llegan a dos doses y dos treses.', ecuacion: ['36 = ', ...canon(36)] },
      ],
      respuesta: ['A los mismos: ', res('2² × 3²')] },
    { nivel: 1, titulo: '¿Son PESI 9 y 16?',
      enunciado: '¿Son PESI 9 y 16?',
      datos: [D3.pesi],
      solucion: [{ texto: '9 = 3 × 3 solo tiene el primo 3; 16 = 2 × 2 × 2 × 2 solo tiene el 2. No comparten ninguno.' }],
      respuesta: [res('Sí'), ', son PESI'] },
    { nivel: 1, titulo: 'Los treses de 162',
      enunciado: '¿Cuántas veces entra el 3 en la factorización de 162?',
      datos: [D3.tfa, D3.exp],
      solucion: [{ texto: '162 = 2 × 81 y 81 = 3 × 3 × 3 × 3.', ecuacion: ['162 = ', ...canon(162)] }],
      respuesta: [res(4), ' veces'] },
    { nivel: 2, titulo: 'Factorizar 1001',
      enunciado: '¿Cuál es la descomposición canónica de 1001?',
      datos: [D3.tfa, D2.raiz, D2.p40],
      solucion: [
        { texto: 'No es múltiplo de 2, 3 ni 5. Con 7 no sobra nada: 1001 = 7 × 143.' },
        { texto: '143 no es múltiplo de 7, pero sí de 11.', ecuacion: ['1001 = ', ...canon(1001)] },
      ],
      respuesta: [res('7 × 11 × 13')] },
    { nivel: 2, titulo: '¿Son PESI 35 y 42?',
      enunciado: '¿Son PESI 35 y 42?',
      datos: [D3.pesi],
      solucion: [
        { texto: 'Factorizo los dos.', ecuacion: ['35 = ', ...canon(35), SEP, '42 = ', ...canon(42)] },
        { texto: 'Los dos tienen el 7: comparten un primo.' },
      ],
      respuesta: [res('No'), ': comparten el 7'] },
    { nivel: 2, titulo: 'Factorizar un producto',
      enunciado: '¿Cuál es la descomposición canónica de 12 × 18?',
      datos: [D3.canon, D3.prod],
      solucion: [
        { texto: 'Factorizo cada uno: 12 = 2² × 3 y 18 = 2 × 3².' },
        { texto: 'Junto los exponentes de cada primo: 2 + 1 = 3 y 1 + 2 = 3.', ecuacion: ['12 × 18 = ', ...canon(216)] },
      ],
      respuesta: [res('2³ × 3³')] },
    { nivel: 2, titulo: 'Los primos de 2310',
      enunciado: '¿Cuántos primos distintos tiene 2310?',
      datos: [D3.tfa],
      solucion: [
        { texto: '2310 = 10 × 231 = 2 × 5 × 231, y 231 = 3 × 77 = 3 × 7 × 11.' },
        { texto: 'Cada primo entra una vez.', ecuacion: ['2310 = ', ...canon(2310)] },
      ],
      respuesta: [res(5), ' primos distintos'] },
    { nivel: 2, titulo: 'El primo que falta',
      enunciado: '360 = 2³ × 3² × ?. ¿Qué primo falta, y con qué exponente?',
      datos: [D3.tfa, D3.canon],
      solucion: [
        { texto: '2³ × 3² = 8 × 9 = 72. Lo que falta es 360 ÷ 72.', ecuacion: ['360 ÷ 72 = 5'] },
        { texto: '5 es primo y entra una vez.', ecuacion: ['360 = ', ...canon(360)] },
      ],
      respuesta: ['Falta ', res('5'), ', con exponente 1'] },
    { nivel: 3, titulo: 'Potencias de compuestos',
      enunciado: ['¿Cuál es el exponente de 3 en la descomposición canónica de ', { sup: ['12', '3'] }, ' × ', { sup: ['45', '2'] }, '?'],
      alternativas: ['5', '7', '6', '4', '3'],
      datos: [D3.potProd, D3.potPot, D3.prod],
      solucion: [
        { texto: 'Primero se descomponen las bases: 12 = 2² × 3 y 45 = 3² × 5.' },
        { texto: '12³ trae 3 treses y 45² trae 2 × 2 = 4.', ecuacion: ['3 + 4 = ', res(7)] },
        { texto: ['Las trampas: ', letra('A'), ' suma 3 + 2 sin descomponer; ', letra('C'), ' multiplica 3 × 2; ', letra('D'), ' solo mira 45²; ', letra('E'), ' solo mira 12³.'] },
      ],
      respuesta: [letra('B'), ': ', res(7)] },
    { nivel: 3, titulo: 'Los PESI con 12',
      enunciado: '¿Cuántos de los números 5, 9, 14, 25, 35 y 49 son PESI con 12?',
      alternativas: ['1', '5', '4', '6', '3'],
      datos: [D3.pesi, D3.tfa],
      solucion: [
        { texto: '12 = 2² × 3. Un número es PESI con 12 si no tiene el 2 ni el 3.' },
        { texto: '9 tiene el 3 y 14 tiene el 2. Quedan 5, 25, 35 y 49.' },
        { texto: ['Las trampas: ', letra('A'), ' solo cuenta los primos; ', letra('B'), ' cuenta todos los impares; ', letra('D'), ' los cuenta todos; ', letra('E'), ' deja fuera el 49, que no tiene ni 2 ni 3.'] },
      ],
      respuesta: [letra('C'), ': ', res(4)] },
    { nivel: 3, titulo: 'Los mismos primos',
      enunciado: ['a = ', { sup: ['2', '3'] }, ' × 5 y b = 2 × ', { sup: ['5', '2'] }, ' × 7. ¿Cuál es el menor número por el que hay que multiplicar a para que tenga los mismos primos que b?'],
      alternativas: ['35', '70', '5', '7', '14'],
      datos: [D3.tfa, D3.prod],
      solucion: [
        { texto: 'Los primos de b son 2, 5 y 7. A a le falta solo el 7; los exponentes no importan.' },
        { texto: ['Las trampas: ', letra('A'), ' agrega un 5 que ya estaba; ', letra('B'), ' agrega 2, 5 y 7; ', letra('C'), ' no trae el 7; ', letra('E'), ' agrega un 2 de más.'] },
      ],
      respuesta: [letra('D'), ': ', res(7)] },
    { nivel: 3, titulo: 'Los exponentes de N',
      enunciado: ['N = ', { sup: ['2', 'α'] }, ' × ', { sup: ['3', 'β'] }, ' y 6 × N = ', { sup: ['2', '5'] }, ' × ', { sup: ['3', '3'] }, '. ¿Cuánto vale α + β?'],
      alternativas: ['8', '7', '4', '2', '6'],
      datos: [D3.prod, '6 = 2 × 3'],
      solucion: [
        { texto: 'Multiplicar por 6 agrega un 2 y un 3: α + 1 = 5 y β + 1 = 3.' },
        { texto: 'Entonces α = 4 y β = 2.', ecuacion: ['4 + 2 = ', res(6)] },
        { texto: ['Las trampas: ', letra('A'), ' suma 5 + 3 sin quitar el 6; ', letra('B'), ' quita solo el 2; ', letra('C'), ' es solo α; ', letra('D'), ' es solo β.'] },
      ],
      respuesta: [letra('E'), ': ', res(6)] },
    { nivel: 3, titulo: 'Primos de un producto',
      enunciado: ['¿Cuántos primos distintos tiene ', { sup: ['2', '4'] }, ' × ', { sup: ['6', '3'] }, ' × ', { sup: ['15', '2'] }, '?'],
      alternativas: ['9', '4', '2', '3', '5'],
      datos: [D3.potProd, D3.prod],
      solucion: [
        { texto: '6 = 2 × 3 y 15 = 3 × 5: las bases traen el 2, el 3 y el 5.', ecuacion: [{ sup: ['2', '4'] }, ' × ', { sup: ['6', '3'] }, ' × ', { sup: ['15', '2'] }, ' = ', ...canon(2 ** 7 * 3 ** 5 * 25)] },
        { texto: ['Las trampas: ', letra('A'), ' suma los exponentes 4 + 3 + 2; ', letra('B'), ' cuenta el 6 como primo; ', letra('C'), ' olvida el 5 del 15; ', letra('E'), ' cuenta también el 6 y el 15.'] },
      ],
      respuesta: [letra('D'), ': ', res(3)] },
  ];

  const fact = {
    id: 'factorizacion',
    titulo: 'Una sola factorización',
    pregunta: '¿Se puede factorizar un número de dos maneras distintas?',
    temas: ['Teorema fundamental de la aritmética', 'Números PESI'],
    pieza: AR,
    aprendizaje: 'Todo número mayor que 1 es un producto de primos de una sola manera; dos números son PESI si no comparten ningún primo.',
    actividad: 'Partir un número en dos partes, y cada parte otra vez, hasta llegar a primos.',
    // Lee: la bandeja que se parte, el árbol, y el nombre de lo que se descubre. No dice qué es PESI: eso lo pregunta Predice.
    lee: {
      tarjetas: [
        { titulo: 'Partir y volver a partir', texto: 'Doña Juana parte 12 caramelos en 3 filas de 4. Cada fila de 4 se parte otra vez en 2 de 2. El 3 y el 2 ya no se parten: son primos.',
          pieza: BA, dibujo: { datos: { n: 12, formas: [[3, 4]] }, estado: {} } },
        { titulo: 'El árbol de cortes', texto: 'Cada corte escribe un número como producto de dos. Se sigue hasta que todas las hojas son primos: los factores primos del número.',
          pieza: AR, dibujo: { datos: { arboles: [arbolDe(12, 3)] }, estado: {} } },
        { titulo: 'Con exponentes', texto: ['Si un primo se repite, se escribe con exponente: 2 × 2 × 3 = ', { sup: ['2', '2'] }, ' × 3. Esa es la descomposición canónica de 12, con los primos de menor a mayor.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a elegir el número y el primer corte. Compara las hojas que salen con cortes distintos del mismo número.' },
      ],
    },
    ejemplos: EJEMPLOS_FACT,
    juega: {
      pieza: AR,
      consigna: 'Doña Juana parte un pedido en partes iguales, y cada parte otra vez, hasta que ya no se pueda.',
      mision: {
        // Una sola respuesta: de la lista, solo 60 tiene tres primos distintos (2, 3 y 5).
        texto: 'Busca el número de la lista que tiene tres primos distintos.',
        logrado: v => v.n === 60,
        bien: '60 = 2² × 3 × 5: tres primos. Con otro primer corte salen los mismos.',
      },
      voz: 'Cambia el primer corte y mira las hojas.',
      leyenda: [
        { s: bas(2), t: 'hoja con aro: un primo, no se parte' },
        { s: 'corte', t: 'el número escrito como producto de dos' },
      ],
      controles: [
        { id: 'n', etiqueta: 'Caramelos', opciones: NS3.map(x => ({ valor: x, texto: String(x) })) },
        { id: 'd', etiqueta: 'Primer corte en', color: 'c-i', opciones: DS3.map(x => ({ valor: x, texto: String(x) })) },
      ],
      dibujo: v => ({ datos: { arboles: [arbolDe(v.n, v.d)], alto: altoJuego3() }, estado: {} }),
      lectura: v => (v.n % v.d
        ? [`${v.n} = ${v.d} × ${Math.floor(v.n / v.d)} + `, sob(v.n % v.d), `: no se parte en ${v.d}`]
        : [`${v.n} = `, bas(v.d), ' × ', bas(v.n / v.d), ' = ', ...canon(v.n)]),
      minimo: 3,
    },
    predice: {
      pieza: 'arit-tabla',
      pregunta: 'Dos números son PESI (primos entre sí) si no comparten ningún primo en su factorización. ¿Cuál de estos pares es PESI?',
      datos: ['PESI se lee «primos entre sí»'],
      voz: 'Piensa en los primos de cada número.',
      opciones: [
        { id: 'c', texto: '8 y 15', correcta: true },
        { id: 'unprimo', texto: '7 y 21', error: 'AT-PESI-UN-PRIMO', siFuera: '7 es primo, bien. Pero 21 = 3 × 7: los dos tienen el 7.' },
        { id: 'impares', texto: '9 y 15', error: 'AT-PESI-IMPARES', siFuera: 'Ninguno es par, es cierto. Pero 9 = 3 × 3 y 15 = 3 × 5 comparten el 3.' },
        { id: 'primos', texto: 'Ninguno: los dos tendrían que ser primos', error: 'AT-PESI-PRIMOS', siFuera: 'El nombre engaña: PESI pide no compartir primos, no que los dos sean primos.' },
      ],
      dibujo: { datos: { columnas: [{ t: 'Par' }, { t: '¿Comparten un primo?' }], filas: [['7 y 21', '?'], ['8 y 15', '?'], ['9 y 15', '?']], filasMax: 3, cabeza: true, alt: 'Tres pares de números: 7 y 21, 8 y 15, 9 y 15, sin decir si comparten un primo' }, estado: {} },
      revelar: { datos: { columnas: [{ t: 'Par' }, { t: '¿Comparten un primo?' }], filas: [['7 y 21', { t: 'el 7', color: 'i' }], ['8 y 15', { t: 'ninguno: PESI', color: 'f', resalta: true }], ['9 y 15', { t: 'el 3', color: 'i' }]], filasMax: 3, cabeza: true, alt: '7 y 21 comparten el 7; 8 y 15 no comparten ninguno: son PESI; 9 y 15 comparten el 3' }, estado: {} },
      coincide: 'Coincide: 8 = 2 × 2 × 2 y 15 = 3 × 5 no comparten ningún primo.',
      noCoincide: 'Revisemos los primos de cada número.',
    },
    mira: {
      pieza: AR,
      datos: { arboles: [arbolDe(8, 2), arbolDe(15, 3)], pies: [[['8']], [['15']]],
        pasos: [
          { arboles: [arbolDe(8, 2), arbolDe(15, 3)], pies: [[['8 = 2 × 2 × 2']], [['15 = 3 × 5']]] },
          { arboles: [arbolDe(8, 2), arbolDe(15, 3)], pies: [[['solo el 2']], [['el 3 y el 5']]] },
          { arboles: [arbolDe(9, 3), arbolDe(15, 3)], pies: [[['9 = 3 × 3']], [['15 = 3 × 5']]] },
          { arboles: [arbolDe(7), arbolDe(21, 3)], pies: [[['7']], [['21 = 3 × 7']]] },
          { arboles: [arbolDe(8, 2), arbolDe(15, 3)], pies: [[['8: no es primo']], [['15: no es primo']]] },
        ] },
      voz: 'Compara los primos de los dos números.',
      pasos: [
        { estado: { paso: 0 }, texto: '8 solo tiene el primo 2; 15 tiene el 3 y el 5.', ecuacion: ['8 = ', ...canon(8), SEP, '15 = ', ...canon(15)] },
        { estado: { paso: 1 }, texto: 'No comparten ningún primo: 8 y 15 son PESI.' },
        { estado: { paso: 2 }, texto: '9 y 15 comparten el 3: no son PESI, aunque sean impares.' },
        { estado: { paso: 3 }, texto: '7 y 21 comparten el 7, aunque el 7 sea primo.' },
        { estado: { paso: 4 }, texto: 'PESI pide no compartir primos; no pide que sean primos.', ecuacion: [res('8 y 15'), ' son PESI'] },
      ],
    },
    regla: {
      texto: 'Todo número mayor que 1 es un producto de primos de una sola manera, sin contar el orden. Dos números son PESI si no comparten ningún primo.',
      ecuacion: ['60 = 4 × 15 = 6 × 10 = ', { llave: canon(60), nota: 'forma canónica', color: 'c-i' }, SEP,
        'N = ', { llave: [{ sup: [bas('p'), 'α'] }, ' × ', { sup: [bas('q'), 'β'] }], nota: 'primos con sus exponentes', color: 'c-i' }, ' × …'],
      condicion: 'Se corta hasta que cada parte sea prima; el exponente dice cuántas veces entra. Dos PESI no tienen que ser primos.',
      voz: 'Una sola factorización. PESI: sin primos en común.',
      dibujo: { pieza: AR, datos: { arboles: [arbolDe(60, 4), arbolDe(60, 6)], pies: [[['60 = 4 × 15']], [['60 = 6 × 10']]] }, estado: {} },
    },
    // Así se resuelve: la forma canónica por divisiones sucesivas. «Ahora tú» pide otra cosa: elegir la forma canónica
    // entre cuatro, cuántas veces entra el 2, cuál par es PESI y el exponente en un producto de potencias.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const N = r.ent(180, 1500), fs = factores(N);
          if (fs.length < 3 || fs.some(([p]) => p > 11) || fs.every(([, e]) => e === 1) || fs.reduce((a, [, e]) => a + e, 0) > 6) continue;
          const cadena = []; let x = N; for (const [p, e] of fs) for (let i = 0; i < e; i++) { cadena.push(`${x} ÷ ${p} = ${x / p}`); x /= p; }
          return {
            enunciado: `¿Cuál es la descomposición canónica de ${N}?`,
            datos: [D3.tfa, D3.canon],
            pasos: [
              { tipo: 'pide', texto: `Piden escribir ${N} como producto de primos, cada uno con su exponente.` },
              { tipo: 'regla', texto: 'Divido entre el menor primo que lo divide, una y otra vez, hasta llegar a 1. Por el teorema fundamental, el orden no cambia el resultado.' },
              { tipo: 'cuentas', texto: `Las divisiones: ${cadena.join('; ')}.` },
              { tipo: 'cuentas', texto: `Junto los primos que se repiten: ${hojasTxt(N)}.`, ecuacion: [`${N} = `, ...canon(N)] },
              { tipo: 'sentido', texto: `Compruebo multiplicando: ${fs.map(([p, e]) => String(p ** e)).join(' × ')} = ${N}.` },
            ],
            respuesta: [`${N} = `, res(canonTxt(fs))],
          };
        }
      },
    },
    ahoraTu: {
      voz: 'Parte hasta que todo sea primo.',
      generar(sem) {
        const r = azar(sem + 89), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoCanon, r);
        if (tipo === 1) return conCuatro(casoExponente, r);
        if (tipo === 2) return conCuatro(casoPesi, r);
        return conCuatro(casoPotencias, r);
      },
    },
  };

  // ---------- Idea 4 (rehecha, 19 nov): elegir exponentes cuenta divisores (cantidad, suma y producto) ----------
  // Propuesta §1 a §7. Conserva el id `divisores` y los controles `a` y `b` (los exponentes de 2 y de 3); las mesas
  // `caja-divisores` (3D) y `otro-primo` siguen con la tabla y la caja. Objeto: la bandeja de 12 en «Lee» (sus seis
  // divisores en parejas) y la tabla de divisores (arit-tabla): columnas de potencias de 2, filas de potencias de 3.
  // Cambia: los exponentes. · Permanece: cada casilla es potencia de 2 por potencia de 3. · Progresa: columnas → filas →
  // casillas. · Se reserva: un tercer primo (la predicción). · Debe verse: la cantidad de divisores es columnas × filas, y
  // las columnas son el exponente más uno (el exponente 0 cuenta).
  // Errores (hipótesis de aula): AT-CD-OLVIDA se olvida de un primo · AT-CD-SIN-UNO multiplica los exponentes sin sumar
  // 1 · AT-CD-SUMA suma en vez de multiplicar · AT-SD-CUENTA da la cantidad por la suma · AT-SD-SUMA suma las sumas de
  // cada primo · AT-SD-PROPIOS deja fuera a N · AT-COND-TODOS cuenta todos los divisores · AT-COND-COMPLEMENTO cuenta los
  // que no cumplen · AT-COND-DE-K cuenta los divisores de k ·
  // AT-SIMPLE-UNO olvida que el 1 es simple (trampa de San Marcos 2025-II) · AT-COMPUESTO-PRIMOS solo quita el 1.
  const TA = 'arit-tabla';
  const TABLA = () => Kit.piezas[TA];
  const CD = N => divisores(N).length, SDv = N => divisores(N).reduce((x, y) => x + y, 0);
  // La tabla de divisores de 2ᵃ × 3ᵇ (y, con c, las filas también por 5): cada casilla, un divisor (turquesa).
  const tablaDiv = (a, b, c = 0) => {
    const filas = [];
    for (let k = 0; k <= c; k++) for (let j = 0; j <= b; j++) filas.push([{ t: `3${sup(j)}${k ? ` × 5${k > 1 ? sup(k) : ''}` : ''}` }, ...Array.from({ length: a + 1 }, (_, i) => ({ t: String(2 ** i * 3 ** j * 5 ** k), color: 'i' }))]);
    const N = 2 ** a * 3 ** b * 5 ** c;
    return { columnas: [{ t: '×' }, ...Array.from({ length: a + 1 }, (_, i) => ({ t: `2${sup(i)}` }))], filas, filasMax: c ? (b + 1) * (c + 1) : 4, cabeza: true,
      alt: `Tabla de divisores de ${N}: ${a + 1} columnas de potencias de 2 por ${filas.length} filas; cada casilla es un divisor` };
  };
  const vertice = (datos, b, a) => { const g = TABLA().geometria(datos); return { x: g.celda(b, a + 1).x, y: g.filaY(b) + g.altoFila }; };
  const esquina = (id, aMax, bMax) => ({
    id, etiqueta: 'esquina de la tabla: los exponentes del 2 y del 3',
    donde: v => vertice(tablaDiv(v.a, v.b), v.b, v.a),
    mover: (pt, v) => {
      const cs = [];
      for (let a = 0; a <= aMax; a++) for (let b = 0; b <= bMax; b++) cs.push(Object.assign({ a, b }, vertice(tablaDiv(a, b), b, a)));
      const m = masCerca(pt, cs);
      return { a: m.a, b: m.b };
    },
  });
  const D4 = {
    cd: 'CD(N) = (α + 1) × (β + 1), con N = pᵅ × qᵝ escrito en primos',
    cdMas: 'Con un primo más, se multiplica por un factor más: su exponente más 1',
    sd: 'SD(N) = (1 + p + … + pᵅ) × (1 + q + … + qᵝ)',
    pd: 'PD(N) = N elevado a la mitad de CD(N): los divisores van en parejas que dan N',
    prop: 'Divisores propios: todos los divisores menos N mismo',
    simple: 'Divisores simples: el 1 y los divisores primos; los demás son compuestos',
    mult: 'Los divisores de N que son múltiplos de k son k por cada divisor de N ÷ k',
    impar: 'Los divisores impares de N son los divisores de la parte de N sin el 2',
    prom: 'Promedio de los divisores = SD(N) ÷ CD(N)',
  };
  const canonTxtN = N => canonTxt(factores(N));
  const sumaPot = (p, e) => Array.from({ length: e + 1 }, (_, i) => p ** i).reduce((x, y) => x + y, 0);

  // Ahora tú · tipo 0: la cantidad de divisores de una forma canónica de tres primos.
  function casoCD(r) {
    const P = r.de([[2, 3, 5], [2, 3, 7], [2, 5, 7], [3, 5, 7]]), es = P.map(() => r.ent(1, 4)), N = P.reduce((x, p, i) => x * p ** es[i], 1);
    if (N === 720) return null;
    const c = es.reduce((x, e) => x * (e + 1), 1), sin = es.slice(0, 2).reduce((x, e) => x * (e + 1), 1);
    return {
      pregunta: `¿Cuántos divisores tiene N = ${canonTxtN(N)}?`,
      datos: [D4.cd, D4.cdMas],
      opciones: opciones(c, [
        { id: 'olvida', valor: sin, error: 'AT-CD-OLVIDA', siFuera: `Lo de ${P[0]} y ${P[1]} está bien: ${sin}. Falta el ${P[2]}: cada divisor lo lleva o no.` },
        { id: 'sinuno', valor: es.reduce((x, e) => x * e, 1), error: 'AT-CD-SIN-UNO', siFuera: 'Multiplicar está bien. Pero un primo también puede no entrar: el exponente 0 cuenta.' },
        { id: 'suma', valor: es.reduce((x, e) => x + e + 1, 0), error: 'AT-CD-SUMA', siFuera: 'Sumar 1 a cada exponente está bien. Pero esas opciones se combinan: se multiplican.' },
      ]),
      solucion: { texto: `Cada primo tiene su exponente más 1 opciones.`, ecuacion: [es.map(e => `(${e} + 1)`).join(' × '), ' = ', res(c)] },
    };
  }
  // Ahora tú · tipo 1: la suma de los divisores.
  function casoSD(r) {
    const [p, q] = r.de([[2, 3], [2, 5], [3, 5], [2, 7]]), a = r.ent(1, 4), b = r.ent(1, 2), N = p ** a * q ** b;
    if (N > 600) return null;
    const sp = sumaPot(p, a), sq = sumaPot(q, b), s = sp * sq;
    return {
      pregunta: `¿Cuánto suman todos los divisores de ${N} = ${canonTxtN(N)}?`,
      datos: [D4.sd, D4.cd],
      opciones: opciones(s, [
        { id: 'cuenta', valor: (a + 1) * (b + 1), error: 'AT-SD-CUENTA', siFuera: `${(a + 1) * (b + 1)} es cuántos divisores hay. Se pide cuánto suman.` },
        { id: 'suma', valor: sp + sq, error: 'AT-SD-SUMA', siFuera: `Las dos sumas, ${sp} y ${sq}, están bien. Pero se multiplican: cada divisor es un producto.` },
        { id: 'propios', valor: s - N, error: 'AT-SD-PROPIOS', siFuera: `Bien la suma de los demás. Pero ${N} también es divisor de ${N}: falta sumarlo.` },
      ]),
      solucion: { texto: `Suma de potencias de ${p}: ${sp}; de potencias de ${q}: ${sq}.`, ecuacion: [`${sp} × ${sq} = `, res(s)] },
    };
  }
  // Ahora tú · tipo 2 (nivel examen): divisores que son múltiplos de k, o impares.
  function casoCondicion(r) {
    const a = r.ent(2, 5), b = r.ent(1, 3), c = r.ent(1, 2), N = 2 ** a * 3 ** b * 5 ** c, todos = (a + 1) * (b + 1) * (c + 1);
    const k = r.de([6, 10, 15, 4, 9, 'impares']);
    let cuenta, M;
    if (k === 'impares') { M = 3 ** b * 5 ** c; cuenta = CD(M); }
    else { if (N % k) return null; M = N / k; cuenta = CD(M); }
    const q = k === 'impares' ? '¿Cuántos divisores impares tiene N?' : `¿Cuántos divisores de N son múltiplos de ${k}?`;
    return {
      pregunta: `N = ${canonTxtN(N)}. ${q}`,
      datos: [D4.cd, k === 'impares' ? D4.impar : D4.mult],
      opciones: opciones(cuenta, [
        { id: 'todos', valor: todos, error: 'AT-COND-TODOS', siFuera: `N tiene ${todos} divisores, es cierto. Pero se piden solo los ${k === 'impares' ? 'impares' : `múltiplos de ${k}`}.` },
        { id: 'compl', valor: todos - cuenta, error: 'AT-COND-COMPLEMENTO', siFuera: `Esos son los divisores que no ${k === 'impares' ? 'son impares' : `son múltiplos de ${k}`}: ${todos} − ${cuenta}.` },
        { id: 'dek', valor: k === 'impares' ? a + 1 : CD(k), error: 'AT-COND-DE-K', siFuera: k === 'impares' ? `Esas son las opciones del 2. Los impares no lo llevan: son los divisores de ${canonTxtN(M)}.` : `${k} tiene ${CD(k)} divisores. Pero se cuentan los de N ÷ ${k}.` },
      ]),
      solucion: { texto: k === 'impares' ? `Sin el 2 queda ${canonTxtN(M)}.` : `N ÷ ${k} = ${canonTxtN(M)}.`, ecuacion: ['CD = ', res(cuenta)] },
    };
  }
  // Ahora tú · tipo 3 (San Marcos 2027-I y 2025-II): el exponente que falta para tener tantos divisores.
  function casoExpOculto(r) {
    const b = r.ent(1, 3), al = r.ent(2, 6), T = (al + 1) * (b + 1), N = 2 ** al * 3 ** b, s = T - b - 2;
    if (N > 5000) return null;
    return {
      pregunta: ['N = ', { sup: ['2', 'α'] }, ' × ', { sup: ['3', String(b)] }, ` tiene ${T} divisores. ¿Cuánto vale N?`],
      datos: [D4.cd],
      opciones: opciones(N, [
        { id: 'sinuno', valor: 2 ** (al + 1) * 3 ** b, error: 'AT-CD-SIN-UNO', siFuera: `Dividir ${T} entre ${b + 1} está bien: da ${al + 1}. Pero eso es α + 1, no α.` },
        { id: 'suma', valor: s > 0 && s !== al ? 2 ** s * 3 ** b : null, error: 'AT-CD-SUMA', siFuera: `Las opciones α + 1 y ${b + 1} se multiplican, no se suman: así α saldría ${s}.` },
        { id: 'otra', valor: al, error: 'AT-RESPONDE-OTRA', siFuera: `α = ${al} está bien. Pero se pide N, no α.` },
      ]),
      solucion: { texto: `(α + 1) × ${b + 1} = ${T}: α + 1 = ${al + 1}, α = ${al}.`, ecuacion: [`N = 2${sup(al)} × 3${b > 1 ? sup(b) : ''} = `, res(N)] },
    };
  }
  // Ahora tú · tipo 4 (San Marcos 2025-II y 2026-I): divisores compuestos.
  function casoCompuestos(r) {
    const P = r.de([[2, 3, 5], [2, 3], [2, 5, 7], [3, 5]]), es = P.map(() => r.ent(1, 3)), N = P.reduce((x, p, i) => x * p ** es[i], 1);
    const c = es.reduce((x, e) => x * (e + 1), 1), k = P.length, comp = c - k - 1;
    return {
      pregunta: `¿Cuántos divisores compuestos tiene N = ${canonTxtN(N)}?`,
      datos: [D4.cd, D4.simple],
      opciones: opciones(comp, [
        { id: 'uno', valor: c - k, error: 'AT-SIMPLE-UNO', siFuera: `Quitar los ${k} primos está bien. Pero el 1 tampoco es compuesto: es simple.` },
        { id: 'primos', valor: c - 1, error: 'AT-COMPUESTO-PRIMOS', siFuera: `Quitar el 1 está bien. Pero los primos ${yLista(P)} tampoco son compuestos.` },
        { id: 'todos', valor: c, error: 'AT-COND-TODOS', siFuera: `N tiene ${c} divisores. Los simples (el 1 y ${k} primos) no son compuestos.` },
      ]),
      solucion: { texto: `CD = ${c}; los simples son el 1 y ${k} primos.`, ecuacion: [`${c} − ${k} − 1 = `, res(comp)] },
    };
  }

  // Ejemplos resueltos de la idea 4. Cuentas rehechas aparte (cuentas-ideas.py): CD(2⁴ × 3) = 10; CD(2³ × 5²) = 12;
  // divisores de 18: 1, 2, 3, 6, 9, 18; CD(7³) = 4; 12 tiene 5 propios; CD(360) = 24; SD(12) = 28; impares de 360: 6;
  // de 600 son múltiplos de 10 los 12 divisores de 60; PD(12) = 12³ = 1728; 2ᵅ × 3² con 21 divisores: α = 6; 60: 12
  // divisores, 4 simples, 8 compuestos; 45: SD = 78, CD = 6, promedio 13; 2⁴ × 3³ × 5: 40 divisores, 24 múltiplos de 6;
  // SD(200) = 15 × 31 = 465.
  const EJEMPLOS_DIV = [
    { nivel: 1, titulo: 'Divisores de 2⁴ × 3',
      enunciado: ['¿Cuántos divisores tiene N = ', { sup: ['2', '4'] }, ' × 3?'],
      datos: [D4.cd],
      solucion: [{ texto: 'El 2 puede entrar 0, 1, 2, 3 o 4 veces: 5 opciones. El 3, 0 o 1 vez: 2 opciones.', ecuacion: ['(4 + 1) × (1 + 1) = ', res(10)] }],
      respuesta: [res(10), ' divisores'] },
    { nivel: 1, titulo: 'Divisores de 2³ × 5²',
      enunciado: ['¿Cuántos divisores tiene N = ', { sup: ['2', '3'] }, ' × ', { sup: ['5', '2'] }, '?'],
      datos: [D4.cd],
      solucion: [{ texto: 'Cada divisor elige cuántas veces entra el 2 (de 0 a 3) y cuántas el 5 (de 0 a 2).', ecuacion: ['(3 + 1) × (2 + 1) = ', res(12)] }],
      respuesta: [res(12), ' divisores'] },
    { nivel: 1, titulo: 'Los divisores de 18',
      enunciado: '¿Cuáles son los divisores de 18?',
      datos: [D4.cd, D3.canon],
      solucion: [
        { texto: '18 = 2 × 3². Las potencias de 2 que sirven son 1 y 2; las de 3, 1, 3 y 9.' },
        { texto: 'Cada divisor es una de cada lista multiplicadas: 2 × 3 = 6 divisores.', ecuacion: ['1, 3, 9 ; 2, 6, 18'] },
      ],
      respuesta: [res('1, 2, 3, 6, 9 y 18')] },
    { nivel: 1, titulo: 'Un primo al cubo',
      enunciado: ['¿Cuántos divisores tiene ', { sup: ['7', '3'] }, '?'],
      datos: [D4.cd],
      solucion: [{ texto: 'Solo hay un primo, el 7, que entra de 0 a 3 veces: 1, 7, 49 y 343.', ecuacion: ['3 + 1 = ', res(4)] }],
      respuesta: [res(4), ' divisores'] },
    { nivel: 1, titulo: 'Divisores propios de 12',
      enunciado: '¿Cuántos divisores propios tiene 12?',
      datos: [D4.cd, D4.prop],
      solucion: [{ texto: '12 = 2² × 3 tiene (2 + 1) × (1 + 1) = 6 divisores. Sin el 12 mismo, quedan 5.', ecuacion: ['6 − 1 = ', res(5)] }],
      respuesta: [res(5), ' propios'] },
    { nivel: 2, titulo: 'Divisores de 360',
      enunciado: '¿Cuántos divisores tiene 360?',
      datos: [D4.cd, D4.cdMas, D3.tfa],
      solucion: [
        { texto: 'Primero en primos.', ecuacion: ['360 = ', ...canon(360)] },
        { texto: 'Cada exponente más 1, y se multiplican.', ecuacion: ['(3 + 1) × (2 + 1) × (1 + 1) = ', res(24)] },
      ],
      respuesta: [res(24), ' divisores'] },
    { nivel: 2, titulo: 'Suma de los divisores de 12',
      enunciado: '¿Cuánto suman todos los divisores de 12?',
      datos: [D4.sd],
      solucion: [
        { texto: '12 = 2² × 3. Las potencias de 2 suman 1 + 2 + 4 = 7; las de 3, 1 + 3 = 4.' },
        { texto: 'Cada divisor sale de multiplicar una de cada grupo: la suma es el producto de las dos sumas.', ecuacion: ['7 × 4 = ', res(28)] },
      ],
      respuesta: [res(28)] },
    { nivel: 2, titulo: 'Los impares de 360',
      enunciado: '¿Cuántos divisores impares tiene 360?',
      datos: [D4.cd, D4.impar],
      solucion: [
        { texto: '360 = 2³ × 3² × 5. Un divisor impar no lleva el 2: es divisor de 3² × 5 = 45.' },
        { texto: 'Se cuentan los divisores de 45.', ecuacion: ['(2 + 1) × (1 + 1) = ', res(6)] },
      ],
      respuesta: [res(6), ' impares'] },
    { nivel: 2, titulo: 'Múltiplos de 10',
      enunciado: '¿Cuántos divisores de 600 son múltiplos de 10?',
      datos: [D4.cd, D4.mult],
      solucion: [
        { texto: 'Cada uno es 10 × un divisor de 600 ÷ 10 = 60, y 60 = 2² × 3 × 5.' },
        { texto: 'Se cuentan los divisores de 60.', ecuacion: ['(2 + 1) × (1 + 1) × (1 + 1) = ', res(12)] },
      ],
      respuesta: [res(12), ' divisores'] },
    { nivel: 2, titulo: 'El producto de sus divisores',
      enunciado: '¿Cuánto da el producto de todos los divisores de 12?',
      datos: [D4.pd, D4.cd],
      solucion: [
        { texto: 'Los 6 divisores van en 3 parejas que dan 12: 1 × 12, 2 × 6 y 3 × 4.' },
        { texto: 'El producto es 12 × 12 × 12.', ecuacion: [{ sup: ['12', '3'] }, ' = ', res(1728)] },
      ],
      respuesta: [res(1728)] },
    { nivel: 3, titulo: 'El exponente que falta',
      enunciado: ['N = ', { sup: ['2', 'α'] }, ' × ', { sup: ['3', '2'] }, ' tiene 21 divisores. ¿Cuánto vale α?'],
      alternativas: ['6', '7', '18', '5', '3'],
      datos: [D4.cd],
      solucion: [
        { texto: '(α + 1) × (2 + 1) = 21, así que α + 1 = 7.', ecuacion: ['α = 7 − 1 = ', res(6)] },
        { texto: ['Las trampas: ', letra('B'), ' es α + 1; ', letra('C'), ' resta 21 − 3; ', letra('D'), ' resta 1 dos veces; ', letra('E'), ' es las opciones del 3.'] },
      ],
      respuesta: [letra('A'), ': ', res(6)] },
    { nivel: 3, titulo: 'Divisores compuestos de 60',
      enunciado: '¿Cuántos divisores compuestos tiene 60?',
      alternativas: ['9', '11', '12', '3', '8'],
      datos: [D4.cd, D4.simple],
      solucion: [
        { texto: '60 = 2² × 3 × 5 tiene (2 + 1) × (1 + 1) × (1 + 1) = 12 divisores.' },
        { texto: 'Los simples son el 1, el 2, el 3 y el 5.', ecuacion: ['12 − 4 = ', res(8)] },
        { texto: ['Las trampas: ', letra('A'), ' olvida que el 1 es simple; ', letra('B'), ' solo quita el 1; ', letra('C'), ' los cuenta todos; ', letra('D'), ' cuenta los primos.'] },
      ],
      respuesta: [letra('E'), ': ', res(8)] },
    { nivel: 3, titulo: 'El promedio de los divisores',
      enunciado: '¿Cuál es el promedio de todos los divisores de 45?',
      alternativas: ['13', '78', '6', '23', '33'],
      datos: [D4.prom, D4.sd, D4.cd],
      solucion: [
        { texto: '45 = 3² × 5: SD = (1 + 3 + 9) × (1 + 5) = 78 y CD = 3 × 2 = 6.', ecuacion: ['78 ÷ 6 = ', res(13)] },
        { texto: ['Las trampas: ', letra('B'), ' es la suma; ', letra('C'), ', la cantidad; ', letra('D'), ' promedia solo el 1 y el 45; ', letra('E'), ' suma solo los propios.'] },
      ],
      respuesta: [letra('A'), ': ', res(13)] },
    { nivel: 3, titulo: 'Múltiplos de 6',
      enunciado: ['¿Cuántos divisores de N = ', { sup: ['2', '4'] }, ' × ', { sup: ['3', '3'] }, ' × 5 son múltiplos de 6?'],
      alternativas: ['40', '16', '4', '24', '12'],
      datos: [D4.cd, D4.mult],
      solucion: [
        { texto: ['Cada uno es 6 × un divisor de N ÷ 6 = ', { sup: ['2', '3'] }, ' × ', { sup: ['3', '2'] }, ' × 5.'], ecuacion: ['(3 + 1) × (2 + 1) × (1 + 1) = ', res(24)] },
        { texto: ['Las trampas: ', letra('A'), ' son todos los divisores; ', letra('B'), ', los que no son múltiplos de 6; ', letra('C'), ', los divisores de 6; ', letra('E'), ' olvida el 5.'] },
      ],
      respuesta: [letra('D'), ': ', res(24)] },
    { nivel: 3, titulo: 'Suma de los divisores de 200',
      enunciado: '¿Cuánto suman todos los divisores de 200?',
      alternativas: ['12', '46', '265', '200', '465'],
      datos: [D4.sd, D3.tfa],
      solucion: [
        { texto: '200 = 2³ × 5². Las potencias de 2 suman 1 + 2 + 4 + 8 = 15; las de 5, 1 + 5 + 25 = 31.', ecuacion: ['15 × 31 = ', res(465)] },
        { texto: ['Las trampas: ', letra('A'), ' es la cantidad; ', letra('B'), ' suma 15 + 31; ', letra('C'), ' deja fuera al 200; ', letra('D'), ' es el número mismo.'] },
      ],
      respuesta: [letra('E'), ': ', res(465)] },
  ];

  const PRED4 = tablaDiv(4, 2, 1);
  const cantidad = {
    id: 'divisores',
    titulo: 'Elegir exponentes cuenta divisores',
    pregunta: '¿Cuántos divisores tiene 720?',
    temas: ['Cantidad, suma y producto de divisores'],
    pieza: TA,
    aprendizaje: 'Cada divisor de N = pᵅ × qᵝ elige un exponente para cada primo: hay (α + 1)(β + 1); la suma sale de la misma tabla.',
    actividad: 'Subir los exponentes y contar las casillas de la tabla de divisores.',
    // Lee: los divisores de 12 en la bandeja, cada divisor como producto de potencias, y la potencia 0. No dice la regla
    // (α + 1)(β + 1): eso se descubre al jugar, y la predicción la lleva a tres primos.
    lee: {
      tarjetas: [
        { titulo: 'Los divisores de 12', texto: 'Las formas de la bandeja de 12 dan sus seis divisores: 1, 2, 3, 4, 6 y 12. Contarlos así es lento cuando el número crece.',
          pieza: BA, dibujo: { datos: { n: 12 }, estado: {} } },
        { titulo: 'Cada divisor, de primos', texto: ['12 = ', { sup: ['2', '2'] }, ' × 3. Cada divisor de 12 lleva el 2 cero, una o dos veces, y el 3 cero o una vez: 6 = 2 × 3 y 4 = ', { sup: ['2', '2'] }, '.'] },
        { titulo: 'La potencia cero', texto: ['Todo número distinto de 0, elevado a 0, vale 1: ', { sup: ['2', '0'] }, ' = 1. Así, «el 2 no entra» también se escribe con exponente 0.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a subir los exponentes del 2 y del 3. Cuenta las columnas y las filas de la tabla, y compáralas con los exponentes.' },
      ],
    },
    ejemplos: EJEMPLOS_DIV,
    juega: {
      pieza: TA,
      consigna: 'Los divisores de N = 2ᵅ × 3ᵝ caben en una tabla: columnas de potencias de 2, filas de potencias de 3.',
      mision: {
        // Una sola respuesta: 10 = 5 × 2 (α = 4, β = 1); la otra, 2 × 5, pide β = 4, que no está.
        texto: 'Arma el N que tiene exactamente 10 divisores.',
        logrado: v => (v.a + 1) * (v.b + 1) === 10,
        bien: '48 = 2⁴ × 3: 5 columnas por 2 filas, 10 divisores.',
      },
      voz: 'Cuenta las columnas y las filas.',
      leyenda: [
        { s: bas('casilla'), t: 'divisor: potencia de 2 por potencia de 3' },
        { s: '2⁰ = 1', t: 'el 2 no entra: exponente 0' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Exponente del 2 (α)', min: 0, max: 4, paso: 1, inicio: 3, decimales: 0 },
        { id: 'b', etiqueta: 'Exponente del 3 (β)', min: 0, max: 3, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaDiv(v.a, v.b), estado: {} }),
      lectura: v => [`${2 ** v.a * 3 ** v.b} = 2${sup(v.a)} × 3${sup(v.b)}: ${v.a + 1} columnas por ${v.b + 1} filas, `, res((v.a + 1) * (v.b + 1)), ' divisores'],
      minimo: 3,
      arrastres: [esquina('esquina', 4, 3)],
    },
    predice: {
      pieza: TA,
      pregunta: ['720 = ', { sup: ['2', '4'] }, ' × ', { sup: ['3', '2'] }, ' × 5. ¿Cuántos divisores tiene 720?'],
      datos: ['720 = 2⁴ × 3² × 5¹'],
      voz: 'Ahora hay un tercer primo.',
      opciones: [
        { id: 'c', texto: '30', correcta: true },
        { id: 'olvida', texto: '15', error: 'AT-CD-OLVIDA', siFuera: 'La tabla del 2 y el 3 está bien: 15. Pero cada divisor puede llevar el 5 o no.' },
        { id: 'sinuno', texto: '8', error: 'AT-CD-SIN-UNO', siFuera: 'Multiplicar está bien. Pero cada primo puede no entrar: el exponente 0 también cuenta.' },
        { id: 'suma', texto: '10', error: 'AT-CD-SUMA', siFuera: 'Las opciones 5, 3 y 2 están bien. Pero se combinan: se multiplican.' },
      ],
      dibujo: { datos: tablaDiv(4, 2), estado: {} },
      revelar: { datos: PRED4, estado: {} },
      coincide: 'Coincide: 5 × 3 × 2 = 30. El 5 duplica la tabla.',
      noCoincide: 'Revisemos qué hace el 5 con la tabla.',
    },
    mira: {
      pieza: TA,
      datos: PRED4,
      voz: 'El tercer primo agrega filas.',
      pasos: [
        { estado: { fila: [0, 1, 2] }, texto: 'Las tres primeras filas son los 15 divisores de 144.', ecuacion: ['144 = ', ...canon(144)] },
        { estado: { fila: [3, 4, 5] }, texto: 'Las mismas, por 5: otros 15 divisores.' },
        { estado: {}, texto: 'Cada primo da su exponente más 1 opciones.', ecuacion: ['(4 + 1) × (2 + 1) × (1 + 1) = ', res(30)] },
        { estado: { fila: 0 }, texto: 'La suma: cada fila suma lo de la primera, por su potencia.', ecuacion: ['1 + 2 + 4 + 8 + 16 = 31'] },
        { estado: {}, texto: 'Las sumas de cada primo se multiplican.', ecuacion: ['SD(720) = 31 × 13 × 6 = ', res(2418)] },
        { estado: {}, texto: 'Los 30 divisores forman 15 parejas que dan 720.', ecuacion: ['PD(720) = ', { sup: ['720', '15'] }] },
      ],
    },
    regla: {
      texto: 'Cada divisor elige cuántas veces entra cada primo, de 0 hasta su exponente. La misma tabla da la cantidad, la suma y el producto de los divisores.',
      ecuacion: [{ llave: [res('CD(N)')], nota: 'cantidad' }, ' = (α + 1)(β + 1)', SEP,
        { llave: [res('SD(N)')], nota: 'suma' }, ' = (1 + ', bas('p'), ' + … + ', { sup: [bas('p'), 'α'] }, ')(1 + ', bas('q'), ' + … + ', { sup: [bas('q'), 'β'] }, ')', SEP,
        { llave: [res('PD(N)')], nota: 'producto' }, ' = ', { sup: ['N', 'CD ÷ 2'] }],
      condicion: 'Antes de contar, N va en primos: 12³ no es 2³. Propios: todos menos N. Simples: el 1 y los primos.',
      voz: 'Exponente más uno, y se multiplican.',
    },
    // Así se resuelve: la cantidad de divisores de un número que hay que factorizar. «Ahora tú» pide otra cosa: la
    // cantidad con la forma canónica dada, la suma, los que cumplen una condición, el exponente que falta y los compuestos.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const N = r.ent(200, 999), fs = factores(N);
          if (fs.length < 3 || fs.some(([p]) => p > 7)) continue;
          const c = fs.reduce((x, [, e]) => x * (e + 1), 1);
          return {
            enunciado: `¿Cuántos divisores tiene ${N}?`,
            datos: [D4.cd, D4.cdMas, D3.tfa],
            pasos: [
              { tipo: 'pide', texto: `Piden cuántos números dividen a ${N} sin que sobre nada.` },
              { tipo: 'cuentas', texto: `Primero lo escribo en primos: ${hojasTxt(N)}.`, ecuacion: [`${N} = `, ...canon(N)] },
              { tipo: 'regla', texto: 'Cada divisor elige cuántas veces entra cada primo, de 0 hasta su exponente: cada primo da su exponente más 1 opciones, y se multiplican.' },
              { tipo: 'cuentas', texto: 'Multiplico las opciones de cada primo.', ecuacion: [fs.map(([, e]) => `(${e} + 1)`).join(' × '), ' = ', res(c)] },
              { tipo: 'sentido', texto: Number.isInteger(Math.sqrt(N)) ? `${c} es impar: ${N} = ${Math.sqrt(N)} × ${Math.sqrt(N)} es un cuadrado, y ese divisor va con él mismo.` : `${c} es par: ${N} no es un cuadrado, y sus divisores van en parejas.` },
            ],
            respuesta: [res(c), ' divisores'],
          };
        }
      },
    },
    ahoraTu: {
      voz: 'Exponente más uno, por cada primo.',
      generar(sem) {
        const r = azar(sem + 97), tipo = sem % 5;
        if (tipo === 0) return conCuatro(casoCD, r);
        if (tipo === 1) return conCuatro(casoSD, r);
        if (tipo === 2) return conCuatro(casoCondicion, r);
        if (tipo === 3) return conCuatro(casoExpOculto, r);
        return conCuatro(casoCompuestos, r);
      },
    },
  };

  // ---------- Idea 5 (rehecha, 19 nov): función de Euler, los PESI con N ----------
  // Propuesta §1 a §7. Conserva el id `euler` y el control `n`. Objeto: la plancha de la rifa (arit-boletos, bloque
  // «criba» con propios: false): gana el boleto que no comparte ningún primo con el total. Cambia: el total de boletos. ·
  // Permanece: se tachan los múltiplos de los primos del total. · Progresa: múltiplos de un primo → del otro → los que
  // quedan. · Se reserva: la rifa de 100 (la predicción). · Debe verse: cada primo deja la parte que no es su múltiplo.
  // φ(N) por partes, multiplicando (propuesta, decisión 3): nunca se suman ni se restan comunes (eso es de MCD y MCM).
  // Errores (hipótesis de aula): AT-EULER-DOBLE quita los múltiplos de cada primo por separado y descuenta dos veces los
  // comunes (trampa de San Marcos 2023-I) · AT-EULER-UN-PRIMO quita solo un primo · AT-EULER-PRIMOS cuenta los primos ·
  // AT-EULER-FRACCION multiplica por 1/p en vez de por 1 − 1/p · AT-EULER-PRIMO-SIEMPRE cree que φ(N) = N − 1 · AT-EULER-
  // TODAS cuenta todas las fracciones · AT-EULER-MITAD toma la mitad · AT-EULER-COTA no descarta las de abajo de la cota ·
  // AT-EULER-EXTREMO cuenta también N/N.
  const PHI = N => { let c = 0; for (let k = 1; k <= N; k++) if (mcd(k, N) === 1) c++; return c; };
  const primosDe = N => factores(N).map(f => f[0]);
  const NS5 = [12, 14, 15, 18, 21, 22];
  const colsDe = n => [6, 7, 5, 8, 9, 10].find(c => n % c === 0) || 10;
  const rifaEuler = (n, cr = true, extra = {}) => Object.assign({ desde: 1, hasta: n, columnas: colsDe(n) }, cr ? { criba: { primos: primosDe(n), propios: false, quedan: true, unoQueda: true } } : {}, extra);
  const frac = (a, b) => ({ frac: [String(a), b] });
  const D5 = {
    def: 'φ(N): cuántos números del 1 al N son PESI con N',
    form: 'φ(N) = N × (1 − 1/p) × (1 − 1/q) × …, con p, q, … los primos distintos de N',
    primo: 'Si p es primo, φ(p) = p − 1',
    frac: 'Una fracción k/N es irreductible si k y N son PESI',
    sim: 'k/N y (N − k)/N son irreductibles a la vez: van en parejas que suman 1',
    propia: 'Una fracción propia es menor que 1: su numerador es menor que N',
  };
  const phiEc = N => [String(N), ...primosDe(N).flatMap(p => [' × (1 − ', frac(1, bas(p)), ')'])];

  // Ahora tú · tipo 0: φ de un número con dos primos.
  function casoPhi2(r) {
    const [p, q] = r.de([[2, 3], [2, 5], [2, 7], [3, 5], [3, 7], [2, 11], [5, 7]]), a = r.ent(1, 3), b = r.ent(1, 2), N = p ** a * q ** b;
    if (N > 400 || N < 20) return null;
    const c = PHI(N);
    return {
      pregunta: `¿Cuántos números del 1 al ${N} son PESI con ${N} = ${canonTxtN(N)}?`,
      datos: [D5.def, D5.form],
      opciones: opciones(c, [
        { id: 'doble', valor: N - N / p - N / q, error: 'AT-EULER-DOBLE', siFuera: `Quitar los múltiplos de ${p} y de ${q} está bien. Pero los de ${p * q} se quitaron dos veces.` },
        { id: 'uno', valor: N - N / p, error: 'AT-EULER-UN-PRIMO', siFuera: `Quitar los múltiplos de ${p} está bien. Falta quitar los de ${q}.` },
        { id: 'fraccion', valor: N / (p * q), error: 'AT-EULER-FRACCION', siFuera: `Cada primo deja la parte que no es su múltiplo: 1 − 1/${p}, no 1/${p}.` },
      ]),
      solucion: { texto: `Sin múltiplos de ${p} queda ${N - N / p}; de eso, la parte sin múltiplos de ${q}.`, ecuacion: [...phiEc(N), ' = ', res(c)] },
    };
  }
  // Ahora tú · tipo 1: φ con tres primos, o de una potencia de un primo.
  function casoPhi3(r) {
    const pot = r() < 0.4;
    const N = pot ? r.de([8, 16, 32, 27, 81, 25, 125, 49, 64]) : r.de([2, 4]) * r.de([3, 9]) * r.de([5, 7]);
    const c = PHI(N), ps = primosDe(N), p = ps[0];
    const ops = pot ? [
      { id: 'siempre', valor: N - 1, error: 'AT-EULER-PRIMO-SIEMPRE', siFuera: `N − 1 vale solo si N es primo. ${N} es ${canonTxtN(N)}: se quitan los múltiplos de ${p}.` },
      { id: 'fraccion', valor: N / p, error: 'AT-EULER-FRACCION', siFuera: `${N / p} son los múltiplos de ${p}. Quedan los que no lo son: ${N} − ${N / p}.` },
      { id: 'primos', valor: primosHasta(N).length, error: 'AT-EULER-PRIMOS', siFuera: 'Esos son los primos hasta N. Un PESI con N no tiene que ser primo: el 1 lo es.' },
    ] : [
      { id: 'uno', valor: N - N / p, error: 'AT-EULER-UN-PRIMO', siFuera: `Quitar los múltiplos de ${p} está bien. Faltan los de ${yLista(ps.slice(1))}.` },
      { id: 'siempre', valor: N - 1, error: 'AT-EULER-PRIMO-SIEMPRE', siFuera: `N − 1 vale solo si N es primo. ${N} tiene los primos ${yLista(ps)}.` },
      { id: 'primos', valor: primosHasta(N).length, error: 'AT-EULER-PRIMOS', siFuera: 'Esos son los primos hasta N. Un PESI con N no tiene que ser primo: el 1 lo es.' },
    ];
    return {
      pregunta: `¿Cuánto vale φ(${N})?`,
      datos: [D5.def, D5.form],
      opciones: opciones(c, ops),
      solucion: { texto: `${N} = ${canonTxtN(N)}: entran ${ps.length === 1 ? `solo el ${p}` : `los primos ${yLista(ps)}`}, sin sus exponentes.`, ecuacion: [...phiEc(N), ' = ', res(c)] },
    };
  }
  // Ahora tú · tipo 2 (San Marcos 2025-I): fracciones propias irreductibles de denominador N.
  function casoFracciones(r) {
    const N = r.de([12, 15, 18, 20, 21, 24, 28, 30, 35, 36, 40, 42, 45]), c = PHI(N);
    return {
      pregunta: `¿Cuántas fracciones propias irreductibles tienen denominador ${N}?`,
      datos: [D5.propia, D5.frac, D5.form],
      opciones: opciones(c, [
        { id: 'todas', valor: N - 1, error: 'AT-EULER-TODAS', siFuera: `Hay ${N - 1} fracciones propias, es cierto. Pero muchas se simplifican.` },
        { id: 'mitad', valor: c / 2, error: 'AT-EULER-MITAD', siFuera: `Esas son solo las mayores que 1/2. Las menores también cuentan.` },
        { id: 'compl', valor: N - 1 - c, error: 'AT-COND-COMPLEMENTO', siFuera: 'Esas son las que sí se simplifican. Se piden las que no.' },
      ]),
      solucion: { texto: `k/${N} es irreductible si k y ${N} son PESI.`, ecuacion: [`φ(${N}) = `, ...phiEc(N), ' = ', res(c)] },
    };
  }
  // Ahora tú · tipo 3 (San Marcos 2024-I): las irreductibles mayores que 1/2.
  function casoCota(r) {
    const N = r.de([14, 15, 18, 20, 21, 22, 24, 26, 28, 30, 33, 35, 36]), c = PHI(N);
    let todas = 0; for (let k = 1; k < N; k++) if (2 * k > N) todas++;
    return {
      pregunta: `¿Cuántas fracciones irreductibles de denominador ${N} son mayores que 1/2 y menores que 1?`,
      datos: [D5.frac, D5.sim, D5.form],
      opciones: opciones(c / 2, [
        { id: 'cota', valor: c, error: 'AT-EULER-COTA', siFuera: `Las ${c} irreductibles están bien. Pero la mitad es menor que 1/2.` },
        { id: 'todas', valor: todas, error: 'AT-EULER-TODAS', siFuera: `Hay ${todas} fracciones entre 1/2 y 1. Pero no todas son irreductibles.` },
        { id: 'extremo', valor: c / 2 + 1, error: 'AT-EULER-EXTREMO', siFuera: `La mitad de ${c} está bien. ${N}/${N} no entra: es igual a 1.` },
      ]),
      solucion: { texto: `Hay φ(${N}) = ${c} irreductibles; en parejas que suman 1, la mitad pasa de 1/2.`, ecuacion: [`${c} ÷ 2 = `, res(c / 2)] },
    };
  }

  // Ejemplos resueltos de la idea 5. Cuentas rehechas aparte (cuentas-ideas.py): φ(10) = 4; φ(13) = 12; φ(9) = 6;
  // φ(8) = 4; φ(21) = 12; φ(36) = 12; φ(60) = 16; φ(12) = 4 (1/12, 5/12, 7/12, 11/12); φ(49) = 42; 30 − φ(30) = 22;
  // φ(30) = 8, la mitad mayores que 1/2: 4 (de 16/30 a 29/30 hay 14); del 1 al 150, sin múltiplos de 3 ni de 5: 80 (150 −
  // 50 − 30 = 70); φ(84) = 24; φ(18) = 6; φ(3ᵅ) = 54 → 81.
  const EJEMPLOS_EULER = [
    { nivel: 1, titulo: 'φ de 10',
      enunciado: '¿Cuántos números del 1 al 10 son PESI con 10?',
      datos: [D5.def, D5.form],
      figura: { pieza: BO, datos: rifaEuler(10, false), estado: {} },
      solucion: [{ texto: '10 = 2 × 5. Sin los pares queda la mitad; de esos, sin los múltiplos de 5, cuatro quintos: 1, 3, 7 y 9.', ecuacion: [...phiEc(10), ' = ', res(4)] }],
      respuesta: [res(4), ' números'] },
    { nivel: 1, titulo: 'φ de un primo',
      enunciado: '¿Cuánto vale φ(13)?',
      datos: [D5.def, D5.primo],
      solucion: [{ texto: '13 es primo: del 1 al 13, solo el 13 comparte un primo con 13.', ecuacion: ['φ(13) = 13 − 1 = ', res(12)] }],
      respuesta: [res(12)] },
    { nivel: 1, titulo: 'Los PESI con 9',
      enunciado: '¿Cuántos números del 1 al 9 son PESI con 9?',
      datos: [D5.def, D5.form],
      solucion: [{ texto: '9 = 3²: solo entra el primo 3. Se quitan 3, 6 y 9; quedan dos tercios.', ecuacion: [...phiEc(9), ' = ', res(6)] }],
      respuesta: [res(6), ' números'] },
    { nivel: 1, titulo: 'φ de 8',
      enunciado: '¿Cuánto vale φ(8)?',
      datos: [D5.def, D5.form],
      solucion: [{ texto: '8 = 2³: solo entra el 2, sin su exponente. Quedan los impares: 1, 3, 5 y 7.', ecuacion: [...phiEc(8), ' = ', res(4)] }],
      respuesta: [res(4)] },
    { nivel: 1, titulo: 'φ de 21',
      enunciado: '¿Cuánto vale φ(21)?',
      datos: [D5.def, D5.form],
      solucion: [{ texto: '21 = 3 × 7: sin múltiplos de 3 quedan 14; sin múltiplos de 7, seis de cada siete.', ecuacion: [...phiEc(21), ' = ', res(12)] }],
      respuesta: [res(12)] },
    { nivel: 2, titulo: 'φ de 36',
      enunciado: '¿Cuánto vale φ(36)?',
      datos: [D5.def, D5.form, D3.tfa],
      solucion: [
        { texto: '36 = 2² × 3²: entran el 2 y el 3, sin los exponentes.' },
        { texto: 'Queda la mitad, y de eso, dos tercios.', ecuacion: [...phiEc(36), ' = ', res(12)] },
      ],
      respuesta: [res(12)] },
    { nivel: 2, titulo: 'φ de 60',
      enunciado: '¿Cuántos números del 1 al 60 son PESI con 60?',
      datos: [D5.def, D5.form, D3.tfa],
      solucion: [
        { texto: '60 = 2² × 3 × 5: entran el 2, el 3 y el 5.' },
        { texto: 'Cada primo deja la parte que no es su múltiplo.', ecuacion: [...phiEc(60), ' = ', res(16)] },
      ],
      respuesta: [res(16), ' números'] },
    { nivel: 2, titulo: 'Fracciones de denominador 12',
      enunciado: '¿Cuántas fracciones propias irreductibles tienen denominador 12?',
      datos: [D5.propia, D5.frac, D5.form],
      solucion: [
        { texto: 'k/12 no se simplifica si k y 12 son PESI: k no tiene el 2 ni el 3.' },
        { texto: 'Son 1/12, 5/12, 7/12 y 11/12.', ecuacion: [...phiEc(12), ' = ', res(4)] },
      ],
      respuesta: [res(4), ' fracciones'] },
    { nivel: 2, titulo: 'φ de 49',
      enunciado: '¿Cuánto vale φ(49)?',
      datos: [D5.def, D5.form],
      solucion: [
        { texto: '49 = 7²: solo el primo 7. Sus múltiplos hasta 49 son 7 de cada 49.' },
        { texto: 'Quedan seis de cada siete.', ecuacion: [...phiEc(49), ' = ', res(42)] },
      ],
      respuesta: [res(42)] },
    { nivel: 2, titulo: 'Los que no son PESI',
      enunciado: '¿Cuántos números del 1 al 30 comparten algún primo con 30?',
      datos: [D5.def, D5.form],
      solucion: [
        { texto: '30 = 2 × 3 × 5. Los PESI con 30 son φ(30).', ecuacion: [...phiEc(30), ' = 8'] },
        { texto: 'Los demás comparten un primo.', ecuacion: ['30 − 8 = ', res(22)] },
      ],
      respuesta: [res(22), ' números'] },
    { nivel: 3, titulo: 'Mayores que un medio',
      enunciado: '¿Cuántas fracciones irreductibles de denominador 30 son mayores que 1/2 y menores que 1?',
      alternativas: ['8', '4', '14', '5', '15'],
      datos: [D5.frac, D5.sim, D5.form],
      solucion: [
        { texto: 'φ(30) = 8 irreductibles, en parejas que suman 1: la mitad pasa de 1/2. Son 17/30, 19/30, 23/30 y 29/30.', ecuacion: ['8 ÷ 2 = ', res(4)] },
        { texto: ['Las trampas: ', letra('A'), ' no descarta las menores; ', letra('C'), ' cuenta todas, también las que se simplifican; ', letra('D'), ' cuenta 30/30; ', letra('E'), ' es la mitad de 30.'] },
      ],
      respuesta: [letra('B'), ': ', res(4)] },
    { nivel: 3, titulo: 'Ni de 3 ni de 5',
      enunciado: 'Del 1 al 150, ¿cuántos números no son múltiplos de 3 ni de 5?',
      alternativas: ['70', '100', '120', '80', '10'],
      datos: ['150 = 2 × 3 × 5²', 'Cada primo deja la parte que no es su múltiplo: 1 − 1/p'],
      solucion: [
        { texto: 'Sin los múltiplos de 3 quedan dos tercios: 100. De esos, sin los de 5, cuatro quintos.', ecuacion: ['150 × (1 − ', frac(1, '3'), ') × (1 − ', frac(1, '5'), ') = ', res(80)] },
        { texto: ['Las trampas: ', letra('A'), ' quita dos veces los de 15; ', letra('B'), ' solo quita los de 3; ', letra('C'), ' solo los de 5; ', letra('E'), ' son los de 15.'] },
      ],
      respuesta: [letra('D'), ': ', res(80)] },
    { nivel: 3, titulo: 'φ con tres primos',
      enunciado: '¿Cuánto vale φ(84)?',
      alternativas: ['42', '28', '83', '2', '24'],
      datos: [D5.def, D5.form, D3.tfa],
      solucion: [
        { texto: '84 = 2² × 3 × 7: entran el 2, el 3 y el 7.', ecuacion: [...phiEc(84), ' = ', res(24)] },
        { texto: ['Las trampas: ', letra('A'), ' solo quita los pares; ', letra('B'), ' olvida el 7; ', letra('C'), ' trata a 84 como primo; ', letra('D'), ' multiplica por 1/p y no por 1 − 1/p.'] },
      ],
      respuesta: [letra('E'), ': ', res(24)] },
    { nivel: 3, titulo: 'Fracciones de denominador 18',
      enunciado: '¿Cuántas fracciones propias irreductibles tienen denominador 18?',
      alternativas: ['6', '17', '11', '3', '9'],
      datos: [D5.propia, D5.frac, D5.form],
      solucion: [
        { texto: '18 = 2 × 3²: k no tiene el 2 ni el 3. Son 1, 5, 7, 11, 13 y 17.', ecuacion: [...phiEc(18), ' = ', res(6)] },
        { texto: ['Las trampas: ', letra('B'), ' cuenta todas las propias; ', letra('C'), ', las que se simplifican; ', letra('D'), ', solo las mayores que 1/2; ', letra('E'), ' solo quita los pares.'] },
      ],
      respuesta: [letra('A'), ': ', res(6)] },
    { nivel: 3, titulo: 'Un N con φ dado',
      enunciado: ['N = ', { sup: ['3', 'α'] }, ' y φ(N) = 54. ¿Cuánto vale N?'],
      alternativas: ['54', '81', '27', '55', '243'],
      datos: [D5.def, D5.form],
      solucion: [
        { texto: 'Solo entra el 3: φ(N) = N × (1 − 1/3), dos tercios de N.', ecuacion: ['N = 54 × 3 ÷ 2 = ', res(81)] },
        { texto: ['81 = 3⁴, que sí es potencia de 3. Las trampas: ', letra('A'), ' es φ(N); ', letra('C'), ' es la mitad de 54; ', letra('D'), ' usa N − 1; ', letra('E'), ' es una potencia de más.'] },
      ],
      respuesta: [letra('B'), ': ', res(81)] },
  ];

  const euler = {
    id: 'euler',
    titulo: 'Función de Euler: los PESI',
    pregunta: '¿Cuántos números del 1 al N no comparten ningún primo con N?',
    temas: ['Función de Euler'],
    pieza: BO,
    aprendizaje: 'φ(N) cuenta los números del 1 al N que son PESI con N: cada primo deja la parte que no es su múltiplo.',
    actividad: 'Tachar los boletos que comparten un primo con el total y contar los que quedan.',
    // Lee: la rifa de 12, qué se tacha, y los nombres. No dice cuántos quedan con 100 (la predicción) ni con 15 (la misión).
    lee: {
      tarjetas: [
        { titulo: 'Otra rifa', texto: 'Esta vez la rifa tiene 12 boletos, y gana cada número que no comparte ningún primo con 12: cada número que es PESI con 12.',
          pieza: BO, dibujo: { datos: rifaEuler(12, false), estado: {} } },
        { titulo: 'Tachar lo que comparte', texto: ['12 = ', { sup: ['2', '2'] }, ' × 3. Se tachan los múltiplos de 2 y de 3, también el 2 y el 3: comparten un primo con 12. El 1 se queda.'],
          pieza: BO, dibujo: { datos: rifaEuler(12), estado: {} } },
        { titulo: 'Un nombre', texto: 'La cantidad de números del 1 al N que son PESI con N se escribe φ(N) y se lee «fi de N»: es la función de Euler. Una fracción como 5/12, que ya no se simplifica, es una fracción irreductible.' },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cambiar el total de boletos. Cuenta los que quedan y compáralos con los primos del total.' },
      ],
    },
    ejemplos: EJEMPLOS_EULER,
    juega: {
      pieza: BO,
      consigna: 'La rifa tiene N boletos. Gana cada boleto que no comparte ningún primo con N; los demás se tachan.',
      mision: {
        // Una sola respuesta: φ de 12, 14, 15, 18, 21 y 22 es 4, 6, 8, 6, 12 y 10.
        texto: 'Elige cuántos boletos hay para que ganen justo 8.',
        logrado: v => v.n === 15,
        bien: 'Con 15 boletos ganan 8: el 1, 2, 4, 7, 8, 11, 13 y 14.',
      },
      voz: 'Mira qué primos tiene el total.',
      leyenda: [
        { s: res('gana'), t: 'no comparte ningún primo con N' },
        { s: 'raya', t: 'tachado: comparte un primo con N' },
      ],
      controles: [{ id: 'n', etiqueta: 'Boletos (N)', opciones: NS5.map(x => ({ valor: x, texto: String(x) })) }],
      dibujo: v => ({ datos: rifaEuler(v.n, true, { letrero: [[`N = ${v.n} = ${canonTxtN(v.n)}`]] }), estado: {} }),
      lectura: v => [`${v.n} = ${canonTxtN(v.n)}: sin tachar quedan `, res(PHI(v.n)), ` de ${v.n}`],
      minimo: 3,
    },
    predice: {
      pieza: BO,
      pregunta: 'La rifa grande tiene 100 boletos, del 1 al 100. Gana cada boleto que no comparte ningún primo con 100. ¿Cuántos ganan?',
      datos: ['100 = 2² × 5²', 'Los boletos van del 1 al 100'],
      voz: 'Piensa qué parte queda con cada primo.',
      opciones: [
        { id: 'c', texto: '40', correcta: true },
        { id: 'doble', texto: '30', error: 'AT-EULER-DOBLE', siFuera: 'Quitar 50 pares y 20 múltiplos de 5 está bien. Pero los de 10 se quitaron dos veces.' },
        { id: 'uno', texto: '50', error: 'AT-EULER-UN-PRIMO', siFuera: 'Quitar los pares está bien. Falta quitar los múltiplos de 5 que quedan.' },
        { id: 'primos', texto: '25', error: 'AT-EULER-PRIMOS', siFuera: 'Hay 25 primos hasta 100, pero ganar no pide ser primo: el 1, el 9 y el 21 ganan.' },
      ],
      dibujo: { datos: { desde: 1, hasta: 100, columnas: 10, letrero: [['Rifa grande: 100 = 2² × 5²']], pie: [['¿Cuántos ganan?']] }, estado: {} },
      revelar: { datos: { desde: 1, hasta: 100, columnas: 10, criba: { primos: [2, 5], propios: false, quedan: true, unoQueda: true }, letrero: [['Rifa grande: 100 = 2² × 5²']], pie: [['Ganan '], ['40', 'f', 700], [' boletos']] }, estado: {} },
      coincide: 'Coincide: queda la mitad sin pares, y de eso, cuatro quintos.',
      noCoincide: 'Revisemos qué parte deja cada primo.',
    },
    mira: {
      pieza: BO,
      datos: { desde: 1, hasta: 100, columnas: 10, letrero: [['Rifa grande: 100 = 2² × 5²']],
        pasos: [
          { pie: [['100 = 2² × 5²: sus primos son 2 y 5']] },
          { criba: { primos: [2], propios: false, quedan: true, unoQueda: true }, pie: [['Sin los pares: quedan 50']] },
          { criba: { primos: [2, 5], propios: false, quedan: true, unoQueda: true }, pie: [['Sin los múltiplos de 5: quedan 40']] },
          { criba: { primos: [2, 5], propios: false, quedan: true, unoQueda: true }, pie: [['Los de 10 ya se habían ido']] },
          { criba: { primos: [2, 5], propios: false, quedan: true, unoQueda: true }, pie: [['Ganan '], ['40', 'f', 700], [' boletos']] },
        ] },
      voz: 'Cada primo deja una parte.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Gana el que no tiene ni el 2 ni el 5.' },
        { estado: { paso: 1 }, texto: 'Sin los pares queda la mitad.', ecuacion: ['100 × (1 − ', frac(1, bas(2)), ') = 50'] },
        { estado: { paso: 2 }, texto: 'De esos 50, uno de cada 5 es múltiplo de 5.', ecuacion: ['50 × (1 − ', frac(1, bas(5)), ') = 40'] },
        { estado: { paso: 3 }, texto: 'Los múltiplos de 10 ya no estaban: no se quitan dos veces.' },
        { estado: { paso: 4 }, texto: 'Ganan 40: los PESI con 100.', ecuacion: ['φ(100) = ', ...phiEc(100), ' = ', res(40)] },
      ],
    },
    regla: {
      texto: 'φ(N) cuenta los números del 1 al N que son PESI con N. Cada primo de N deja la parte que no es su múltiplo.',
      ecuacion: [{ llave: [res('φ(N)')], nota: 'los PESI con N' }, ' = N × (1 − ', frac(1, bas('p')), ') × (1 − ', frac(1, bas('q')), ')', SEP, 'φ(', bas('p'), ') = ', bas('p'), ' − 1'],
      condicion: 'Entran los primos distintos de N, sin sus exponentes. Si p es primo, solo p no es PESI con p.',
      voz: 'Cada primo deja su parte.',
    },
    // Así se resuelve: φ de un número con dos primos, que hay que factorizar. «Ahora tú» pide otra cosa: φ con la forma
    // canónica dada, con tres primos o una potencia, las fracciones irreductibles y las mayores que 1/2.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const N = r.ent(40, 300), ps = primosDe(N);
          if (ps.length !== 2 || ps[1] > 13) continue;
          const [p, q] = ps, m = N - N / p, c = PHI(N);
          return {
            enunciado: `¿Cuántos números del 1 al ${N} son PESI con ${N}?`,
            datos: [D5.def, D5.form],
            pasos: [
              { tipo: 'pide', texto: `Piden φ(${N}): cuántos del 1 al ${N} no comparten ningún primo con ${N}.` },
              { tipo: 'cuentas', texto: `Primero, sus primos: ${N} = ${canonTxtN(N)}.` },
              { tipo: 'regla', texto: `Cada primo deja la parte que no es su múltiplo: el ${p} deja ${p - 1} de cada ${p}, y el ${q}, ${q - 1} de cada ${q}.` },
              { tipo: 'cuentas', texto: `Sin los múltiplos de ${p} quedan ${m}; de esos, sin los de ${q}:`, ecuacion: [...phiEc(N), ' = ', res(c)] },
              { tipo: 'sentido', texto: `${c} es menos que ${N} y más que la mitad de ${m}: tiene sentido.` },
            ],
            respuesta: [res(c), ' números'],
          };
        }
      },
    },
    ahoraTu: {
      voz: 'Cada primo de N deja su parte.',
      generar(sem) {
        const r = azar(sem + 101), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoPhi2, r);
        if (tipo === 1) return conCuatro(casoPhi3, r);
        if (tipo === 2) return conCuatro(casoFracciones, r);
        return conCuatro(casoCota, r);
      },
    },
  };

  // ---------- Idea 6 (rehecha, 19 nov): Fermat y Wilson con un primo ----------
  // Propuesta §1 a §7. Conserva el id `fermat-wilson` y el control `p`; `a` (la base) es nuevo. Objeto: el pedido que doña
  // Juana multiplica cada día por la base y empaca en bolsitas de un primo (arit-puesto en «Lee», de prueba), con la tabla
  // de sueltos de cada día (arit-tabla), como los restos potenciales de Divisibilidad. Cambia: la base y la bolsita. ·
  // Permanece: cada día es el anterior por la base. · Progresa: los sueltos de cada día → el día en que vuelven a 1 → el
  // día p − 1. · Se reserva: la bolsita de 101 (la predicción). · Debe verse: con bolsitas de un primo p, el día p − 1
  // deja 1 suelto, sea cual sea la base (si no es múltiplo de p).
  // Errores (hipótesis de aula): AT-FERMAT-BASE cree que vuelve a la base · AT-FERMAT-MENOS-UNO responde p − 1 ·
  // AT-POTENCIA-ENTERA (el de Divisibilidad) cree que hay que calcular la potencia · AT-FERMAT-SIEMPRE-UNO cree que
  // siempre da 1 · AT-EXP-DIVISOR (el de Divisibilidad) reduce el exponente entre p y no entre p − 1 · AT-CICLO-LUGAR (el
  // de Divisibilidad) da el exponente reducido · AT-FERMAT-MULTIPLO usa Fermat cuando p divide a la base · AT-FERMAT-NO-
  // PRIMO lo usa sin que p sea primo · AT-WILSON-UNO confunde Wilson con Fermat · AT-WILSON-CERO cree que el producto es
  // múltiplo de p · AT-WILSON-MENOS-DOS resta uno de más · AT-RESTO-MAYOR (el de Divisibilidad) no vuelve a dividir.
  const restosDe = (a, p, n) => Array.from({ length: n }, (_, i) => powmod(a, i + 1, p));
  const tablaRestos = (a, p) => ({
    columnas: [{ t: 'día' }, { t: 'pedido' }, { t: `sueltos con ${p}`, color: 'o' }],
    filas: restosDe(a, p, p - 1).map((r, i) => [String(i + 1), f(a ** (i + 1), 0), { t: String(r), color: 'o', resalta: i === p - 2 }]),
    filasMax: 6, cabeza: true, alt: `Pedido que se multiplica por ${a} cada día, en bolsitas de ${p}: los sueltos de los días 1 a ${p - 1} son ${restosDe(a, p, p - 1).join(', ')}`,
  });
  const TABLA7 = { columnas: [{ t: 'día' }, ...[2, 3, 4, 5, 6].map(a => ({ t: `base ${a}` }))],
    filas: [1, 2, 3, 4, 5, 6].map(e => [String(e), ...[2, 3, 4, 5, 6].map(a => ({ t: String(powmod(a, e, 7)), color: 'o', resalta: e === 6 }))]),
    filasMax: 6, cabeza: true, alt: 'Sueltos con bolsitas de 7 para las bases 2 a 6, de los días 1 a 6: el día 6 todas dejan 1' };
  const pot6 = (b, e) => ({ sup: [String(b), String(e)] });
  const D6 = {
    mu: [MU('p'), ' (p con un circulito): un múltiplo de p, es decir, p por un entero'],
    fermat: 'Fermat: si p es primo y a no es múltiplo de p, a elevado a p − 1 deja resto 1 entre p',
    wilson: 'Wilson: si p es primo, 1 × 2 × … × (p − 1) deja resto p − 1 entre p',
    exp: 'Al multiplicar potencias de una base, los exponentes se suman: a⁵ × a³ = a⁸',
    prod: 'El resto de un producto sale de multiplicar los restos y volver a dividir',
    suma: 'El resto de una suma sale de sumar los restos y volver a dividir',
    ciclo: 'Los restos de las potencias de un número se repiten en ciclo: se calculan hasta que uno se repite',
  };

  // Ahora tú · tipo 0: el resto de una potencia grande entre 5 o 7.
  function casoFermat(r) {
    const p = r.de([5, 7]), a = r.de([2, 3, 4, 6, 8, 9, 10, 12].filter(x => x % p)), n = r.ent(30, 99), s = n % (p - 1), v = powmod(a, n, p);
    if (s === 0) return null;
    return {
      pregunta: ['¿Qué resto deja ', pot6(a, n), ' al dividirlo entre ', bas(p), '?'],
      datos: [D6.fermat, D6.exp, D6.prod],
      opciones: opciones(v, [
        { id: 'uno', valor: 1, error: 'AT-FERMAT-SIEMPRE-UNO', siFuera: `Da 1 cuando el exponente es múltiplo de ${p - 1}. ${n} = ${p - 1} × ${Math.floor(n / (p - 1))} + ${s}.` },
        { id: 'base', valor: a % p, error: 'AT-FERMAT-BASE', siFuera: `Esos son los sueltos de ${a}${sup(1)}. Hay que ver el exponente ${n}.` },
        { id: 'exp', valor: powmod(a, n % p, p), error: 'AT-EXP-DIVISOR', siFuera: `Reducir el exponente está bien, pero entre ${p - 1}, no entre ${p}.` },
        { id: 'lugar', valor: s, error: 'AT-CICLO-LUGAR', siFuera: `${s} es el exponente que queda. Falta ver qué deja ${a}${sup(s)}.` },
      ]),
      solucion: { texto: `${n} = ${p - 1} × ${Math.floor(n / (p - 1))} + ${s}: cada bloque de ${p - 1} deja 1, y queda ${a}${sup(s)}.`, ecuacion: [pot6(a, n), ' = ', MU(p), ' + ', sob(v)] },
    };
  }
  // Ahora tú · tipo 1 (nivel examen): cuando Fermat no vale (p divide a la base, o el divisor no es primo).
  function casoNoVale(r) {
    if (r() < 0.5) {
      const p = r.de([5, 7, 11]), a = p * r.ent(2, 4);
      return {
        pregunta: ['¿Qué resto deja ', pot6(a, p - 1), ' al dividirlo entre ', bas(p), '?'],
        datos: [D6.fermat, D6.prod],
        opciones: opciones(0, [
          { id: 'multiplo', valor: 1, error: 'AT-FERMAT-MULTIPLO', siFuera: `Fermat pide que ${a} no sea múltiplo de ${p}, y sí lo es: ${a} = ${p} × ${a / p}.` },
          { id: 'menos', valor: p - 1, error: 'AT-FERMAT-MENOS-UNO', siFuera: `${p - 1} es el exponente. ${a} deja 0 entre ${p}, y 0 por 0 es 0.` },
          { id: 'mayor', valor: p, error: 'AT-RESTO-MAYOR', siFuera: `Un resto entre ${p} es menor que ${p}. Y ${a} = ${p} × ${a / p} ya no deja nada.` },
        ]),
        solucion: { texto: `${a} es múltiplo de ${p}: deja 0, y su potencia también.`, ecuacion: [pot6(a, p - 1), ' = ', MU(p), ' + ', sob(0)] },
      };
    }
    const m = r.de([9, 15, 21, 25]), a = r.de([2, 4, 8].filter(x => mcd(x, m) === 1)), v = powmod(a, m - 1, m);
    if (v === 1) return null;
    return {
      pregunta: ['¿Qué resto deja ', pot6(a, m - 1), ' al dividirlo entre ', bas(m), '?'],
      datos: [D6.fermat, D6.ciclo, D6.prod],
      opciones: opciones(v, [
        { id: 'noprimo', valor: 1, error: 'AT-FERMAT-NO-PRIMO', siFuera: `Fermat pide que el divisor sea primo, y ${m} = ${factores(m).map(([p, e]) => (e > 1 ? `${p}${sup(e)}` : p)).join(' × ')} no lo es.` },
        { id: 'menos', valor: m - 1, error: 'AT-FERMAT-MENOS-UNO', siFuera: `${m - 1} es el exponente, no lo que sobra.` },
        { id: 'base', valor: a, error: 'AT-FERMAT-BASE', siFuera: `Esos son los sueltos de ${a}${sup(1)}. Hay que seguir el ciclo hasta el exponente ${m - 1}.` },
      ]),
      solucion: { texto: `${m} no es primo: se sigue el ciclo de restos de ${a}: ${restosDe(a, m, 6).join(', ')}…`, ecuacion: [pot6(a, m - 1), ' = ', MU(m), ' + ', sob(v)] },
    };
  }
  // Ahora tú · tipo 2: Wilson.
  function casoWilson(r) {
    const p = r.de([11, 13, 17, 19, 23]);
    return {
      pregunta: [`¿Qué resto deja 1 × 2 × 3 × … × ${p - 1} al dividirlo entre `, bas(p), '?'],
      datos: [D6.wilson, D6.fermat],
      opciones: opciones(p - 1, [
        { id: 'uno', valor: 1, error: 'AT-WILSON-UNO', siFuera: `1 es lo que deja una potencia, por Fermat. Este es un producto de 1 a ${p - 1}: Wilson.` },
        { id: 'cero', valor: 0, error: 'AT-WILSON-CERO', siFuera: `Daría 0 si el producto llevara el ${p}. Llega hasta ${p - 1}, y ${p} es primo.` },
        { id: 'dos', valor: p - 2, error: 'AT-WILSON-MENOS-DOS', siFuera: `Wilson dice p − 1, no p − 2: el producto deja ${p - 1}.` },
      ]),
      solucion: { texto: `${p} es primo: el producto de 1 a ${p - 1} deja ${p - 1}.`, ecuacion: [`1 × 2 × … × ${p - 1} = `, MU(p), ' + ', sob(p - 1)] },
    };
  }
  // Ahora tú · tipo 3 (nivel examen): Wilson más un número.
  function casoWilsonMas(r) {
    const p = r.de([7, 11, 13, 17, 19]), c = r.ent(2, p - 2), v = (p - 1 + c) % p;
    return {
      pregunta: [`¿Qué resto deja 1 × 2 × 3 × … × ${p - 1} + ${c} al dividirlo entre `, bas(p), '?'],
      datos: [D6.wilson, D6.suma],
      opciones: opciones(v, [
        { id: 'cero', valor: c, error: 'AT-WILSON-CERO', siFuera: `Quedaría ${c} si el producto fuera múltiplo de ${p}. Deja ${p - 1}.` },
        { id: 'mayor', valor: p - 1 + c, error: 'AT-RESTO-MAYOR', siFuera: `Sumar ${p - 1} + ${c} está bien. Pero un resto entre ${p} es menor que ${p}.` },
        { id: 'uno', valor: (1 + c) % p, error: 'AT-WILSON-UNO', siFuera: `El producto no deja 1 (eso es Fermat, con potencias): deja ${p - 1}.` },
      ]),
      solucion: { texto: `El producto deja ${p - 1}; con ${c} más son ${p - 1 + c}, y se vuelve a dividir.`, ecuacion: [`${p - 1 + c} = `, bas(p), ` × 1 + `, sob(v)] },
    };
  }

  // Ejemplos resueltos de la idea 6. Cuentas rehechas aparte (cuentas-ideas.py, con pow(a, n, p) de Python): 2⁴ = 16 →
  // 1 entre 5; 3⁶ = 729 → 1 entre 7; 1 × 2 × 3 × 4 = 24 → 4 entre 5; 10⁴ → 0 entre 5; 2³ = 8 → 0 entre 4; 2⁶² → 4 entre 7;
  // 3²⁰ → 1 entre 11; 12! → 12 entre 13; 5! = 120 → 1 entre 7; 8²⁵ → 3 entre 5; 2¹⁰⁰ → 3 entre 13; 16! + 5 → 4 entre 17;
  // 2¹⁴ → 4 entre 15; 3⁴⁰ + 5⁴⁰ → 2 entre 41; 2⁶⁰ → 1 entre 7 (de lunes a martes).
  const EJEMPLOS_FW = [
    { nivel: 1, titulo: 'Fermat con 5',
      enunciado: ['¿Qué resto deja ', pot6(2, 4), ' al dividirlo entre 5?'],
      datos: [D6.fermat],
      solucion: [{ texto: '5 es primo y 2 no es múltiplo de 5: el exponente 4 = 5 − 1 deja 1. Se comprueba: 16 = 15 + 1.', ecuacion: [pot6(2, 4), ' = 16 = 5 × 3 + ', sob(1)] }],
      respuesta: ['Resto ', sob(1)] },
    { nivel: 1, titulo: 'Fermat con 7',
      enunciado: ['¿Qué resto deja ', pot6(3, 6), ' al dividirlo entre 7?'],
      datos: [D6.fermat],
      solucion: [{ texto: '7 es primo, 3 no es su múltiplo, y el exponente es 7 − 1.', ecuacion: [pot6(3, 6), ' = 729 = 7 × 104 + ', sob(1)] }],
      respuesta: ['Resto ', sob(1)] },
    { nivel: 1, titulo: 'Wilson con 5',
      enunciado: '¿Qué resto deja 1 × 2 × 3 × 4 al dividirlo entre 5?',
      datos: [D6.wilson],
      solucion: [{ texto: '5 es primo: el producto de 1 a 4 deja 5 − 1.', ecuacion: ['1 × 2 × 3 × 4 = 24 = 5 × 4 + ', sob(4)] }],
      respuesta: ['Resto ', sob(4)] },
    { nivel: 1, titulo: 'Una base múltiplo',
      enunciado: ['¿Qué resto deja ', pot6(10, 4), ' al dividirlo entre 5?'],
      datos: [D6.fermat, D6.prod],
      solucion: [{ texto: '10 es múltiplo de 5: Fermat no vale. 10 deja 0, y 0 × 0 × 0 × 0 = 0.', ecuacion: [pot6(10, 4), ' = 10000 = 5 × 2000 + ', sob(0)] }],
      respuesta: ['Resto ', sob(0)] },
    { nivel: 1, titulo: 'Un divisor que no es primo',
      enunciado: ['¿Qué resto deja ', pot6(2, 3), ' al dividirlo entre 4?'],
      datos: [D6.fermat],
      solucion: [{ texto: '4 no es primo: Fermat no se usa. Se calcula: 8 = 4 × 2, no sobra nada.', ecuacion: [pot6(2, 3), ' = 8 = 4 × 2 + ', sob(0)] }],
      respuesta: ['Resto ', sob(0)] },
    { nivel: 2, titulo: 'Un exponente grande',
      enunciado: ['¿Qué resto deja ', pot6(2, 62), ' al dividirlo entre 7?'],
      datos: [D6.fermat, D6.exp],
      solucion: [
        { texto: '62 = 6 × 10 + 2: son 10 bloques de 2⁶, que dejan 1 cada uno, y queda 2².', ecuacion: [pot6(2, 62), ' = ', { sup: [{ par: [pot6(2, 6)] }, '10'] }, ' × ', pot6(2, 2)] },
        { texto: '2² = 4 no llega a 7.', ecuacion: ['1 × 4 = ', sob(4)] },
      ],
      respuesta: ['Resto ', sob(4)] },
    { nivel: 2, titulo: 'Fermat con 11',
      enunciado: ['¿Qué resto deja ', pot6(3, 20), ' al dividirlo entre 11?'],
      datos: [D6.fermat, D6.exp],
      solucion: [
        { texto: '11 es primo: 3¹⁰ deja 1. Y 20 = 10 × 2.', ecuacion: [pot6(3, 20), ' = ', pot6(3, 10), ' × ', pot6(3, 10)] },
        { texto: 'Cada factor deja 1.', ecuacion: ['1 × 1 = ', sob(1)] },
      ],
      respuesta: ['Resto ', sob(1)] },
    { nivel: 2, titulo: 'Wilson con 13',
      enunciado: '¿Qué resto deja 1 × 2 × 3 × … × 12 al dividirlo entre 13?',
      datos: [D6.wilson],
      solucion: [
        { texto: '13 es primo y el producto va de 1 a 13 − 1.' },
        { texto: 'Por Wilson deja 13 − 1.', ecuacion: ['1 × 2 × … × 12 = ', MU(13), ' + ', sob(12)] },
      ],
      respuesta: ['Resto ', sob(12)] },
    { nivel: 2, titulo: 'Sin el último factor',
      enunciado: '¿Qué resto deja 1 × 2 × 3 × 4 × 5 al dividirlo entre 7?',
      datos: [D6.wilson, D6.prod],
      solucion: [
        { texto: 'Por Wilson, 1 × 2 × … × 6 deja 6. Ese producto es el pedido por 6, y 6 × 1 = 6: el de 1 a 5 deja 1.' },
        { texto: 'Se comprueba.', ecuacion: ['1 × 2 × 3 × 4 × 5 = 120 = 7 × 17 + ', sob(1)] },
      ],
      respuesta: ['Resto ', sob(1)] },
    { nivel: 2, titulo: 'Una base mayor que la bolsita',
      enunciado: ['¿Qué resto deja ', pot6(8, 25), ' al dividirlo entre 5?'],
      datos: [D6.fermat, D6.prod, D6.exp],
      solucion: [
        { texto: '8 deja 3 entre 5, así que la potencia deja lo mismo que 3²⁵. Y 25 = 4 × 6 + 1.' },
        { texto: 'Los 6 bloques de 3⁴ dejan 1; queda 3¹.', ecuacion: [pot6(8, 25), ' = ', MU(5), ' + ', sob(3)] },
      ],
      respuesta: ['Resto ', sob(3)] },
    { nivel: 3, titulo: 'Una potencia entre 13',
      enunciado: ['¿Qué resto deja ', pot6(2, 100), ' al dividirlo entre 13?'],
      alternativas: ['1', '2', '4', '12', '3'],
      datos: [D6.fermat, D6.exp],
      solucion: [
        { texto: '13 es primo: 2¹² deja 1. 100 = 12 × 8 + 4, así que queda 2⁴ = 16.', ecuacion: ['16 = 13 × 1 + ', sob(3)] },
        { texto: ['Las trampas: ', letra('A'), ' cree que siempre da 1; ', letra('B'), ' vuelve a la base; ', letra('C'), ' da el exponente que queda; ', letra('D'), ' es 13 − 1.'] },
      ],
      respuesta: [letra('E'), ': ', sob(3)] },
    { nivel: 3, titulo: 'Wilson más cinco',
      enunciado: '¿Qué resto deja 1 × 2 × 3 × … × 16 + 5 al dividirlo entre 17?',
      alternativas: ['5', '21', '4', '6', '0'],
      datos: [D6.wilson, D6.suma],
      solucion: [
        { texto: '17 es primo: el producto deja 16. Con 5 más son 21.', ecuacion: ['21 = 17 × 1 + ', sob(4)] },
        { texto: ['Las trampas: ', letra('A'), ' cree que el producto deja 0; ', letra('B'), ' no vuelve a dividir; ', letra('D'), ' cree que el producto deja 1; ', letra('E'), ' cree que todo es múltiplo de 17.'] },
      ],
      respuesta: [letra('C'), ': ', sob(4)] },
    { nivel: 3, titulo: 'Fermat no vale con 15',
      enunciado: ['¿Qué resto deja ', pot6(2, 14), ' al dividirlo entre 15?'],
      alternativas: ['1', '4', '2', '14', '0'],
      datos: [D6.fermat, D6.ciclo, D6.prod],
      solucion: [
        { texto: '15 no es primo: no se usa Fermat. Los restos de 2, 4, 8 y 16 entre 15 son 2, 4, 8 y 1: un ciclo de 4.' },
        { texto: '14 = 4 × 3 + 2: queda 2².', ecuacion: [pot6(2, 14), ' = ', MU(15), ' + ', sob(4)] },
        { texto: ['Las trampas: ', letra('A'), ' usa Fermat sin un primo; ', letra('C'), ' vuelve a la base; ', letra('D'), ' es 15 − 1; ', letra('E'), ' cree que es múltiplo.'] },
      ],
      respuesta: [letra('B'), ': ', sob(4)] },
    { nivel: 3, titulo: 'Dos potencias entre 41',
      enunciado: ['¿Qué resto deja ', pot6(3, 40), ' + ', pot6(5, 40), ' al dividirlo entre 41?'],
      alternativas: ['1', '0', '40', '2', '8'],
      datos: [D6.fermat, D6.suma],
      solucion: [
        { texto: '41 es primo y ni 3 ni 5 son sus múltiplos: cada potencia deja 1.', ecuacion: ['1 + 1 = ', sob(2)] },
        { texto: ['Las trampas: ', letra('A'), ' cuenta una sola potencia; ', letra('B'), ' cree que la suma es múltiplo; ', letra('C'), ' es 41 − 1; ', letra('E'), ' suma las bases.'] },
      ],
      respuesta: [letra('D'), ': ', sob(2)] },
    { nivel: 3, titulo: 'El día de la semana',
      enunciado: ['Hoy es lunes. ¿Qué día será dentro de ', pot6(2, 60), ' días?'],
      alternativas: ['martes', 'lunes', 'miércoles', 'domingo', 'viernes'],
      datos: [D6.fermat, 'La semana se repite cada 7 días', 'Los días, en orden: lunes, martes, miércoles, jueves, viernes, sábado y domingo'],
      solucion: [
        { texto: '7 es primo: 2⁶ deja 1, y 60 = 6 × 10. Entonces 2⁶⁰ deja 1: es una semana entera más un día.', ecuacion: [pot6(2, 60), ' = ', MU(7), ' + ', sob(1)] },
        { texto: ['Las trampas: ', letra('B'), ' cree que deja 0; ', letra('C'), ' avanza 2, la base; ', letra('D'), ' avanza 6; ', letra('E'), ' avanza 4: reduce 60 entre 7.'] },
      ],
      respuesta: [letra('A'), ': el ', res('martes')] },
  ];

  const fermat = {
    id: 'fermat-wilson',
    titulo: 'Fermat y Wilson con un primo',
    pregunta: '¿Qué resto deja una potencia enorme entre un primo?',
    temas: ['Teoremas de Fermat y Wilson'],
    pieza: TA,
    aprendizaje: 'Con p primo que no divide a la base, la potencia p − 1 deja resto 1 (Fermat); 1 × 2 × … × (p − 1) deja p − 1.',
    actividad: 'Multiplicar el pedido cada día y anotar los sueltos con bolsitas de 5 o de 7.',
    // Lee: el pedido que se multiplica, los sueltos que se multiplican y el circulito. No dice qué pasa el día p − 1.
    lee: {
      tarjetas: [
        { titulo: 'El pedido que crece', texto: ['Doña Juana empieza con 3 caramelos y cada día multiplica el pedido por 3: 3, 9, 27… Cada día lo empaca en bolsitas de ', bas(7), ' y anota los sueltos.'],
          pieza: 'arit-puesto', dibujo: { datos: { n: 7, bolsitas: 1, sueltos: 2, ceros: true, colorCifras: false, regla: [[['1 bolsita = '], ['7', 'i', 700], [' caramelos']], [['Día 2: 9 caramelos']]], rotulos: { bolsitas: '1 bolsita llena', sueltos: [['2', 'o', 700], [' sueltos']] } }, estado: {} } },
        { titulo: 'Los sueltos se multiplican', texto: 'No hace falta contar todo el pedido: los sueltos de mañana salen de multiplicar los de hoy por 3 y volver a empacar.',
          ecuacion: ['9 = 7 + 2', SEP, '2 × 3 = 6', SEP, '27 = 7 × 3 + 6'] },
        { titulo: 'El circulito', texto: ['Como en Divisibilidad, ', MU(7), ' + 1 se lee «un múltiplo de 7, más 1»: un pedido que deja 1 suelto. Las bolsitas de esta idea siempre llevan un número primo.'] },
        { titulo: 'Qué mirar al jugar', texto: 'Vas a cambiar la base y la bolsita. Mira el día en que los sueltos vuelven a ser 1, y compáralo con la bolsita.' },
      ],
    },
    ejemplos: EJEMPLOS_FW,
    juega: {
      pieza: TA,
      consigna: 'Cada día doña Juana multiplica el pedido por la base y lo empaca en bolsitas. La tabla anota los sueltos.',
      mision: {
        // Una sola respuesta: con bolsitas de 7, las bases 2 y 4 vuelven a 1 el día 3, la 6 el día 2 y la 3 el día 6.
        texto: 'Con bolsitas de 7, busca la base cuyos sueltos vuelven a 1 recién el día 6.',
        logrado: v => v.p === 7 && v.a === 3,
        bien: 'Con 3 vuelven a 1 recién el día 6: 3, 2, 6, 4, 5, 1.',
      },
      voz: 'Mira cuándo los sueltos vuelven a 1.',
      leyenda: [
        { s: sob('sueltos'), t: 'el resto del pedido entre la bolsita' },
        { s: bas('bolsitas de 7'), t: 'cada bolsita lleva 7: un primo' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Base', opciones: [2, 3, 4, 6].map(x => ({ valor: x, texto: String(x) })) },
        { id: 'p', etiqueta: 'Caramelos por bolsita', color: 'c-i', opciones: [7, 5].map(x => ({ valor: x, texto: String(x) })) },
      ],
      dibujo: v => ({ datos: tablaRestos(v.a, v.p), estado: {} }),
      lectura: v => [`Base ${v.a}, `, bas(`bolsitas de ${v.p}`), ': sueltos ', sob(restosDe(v.a, v.p, v.p - 1).join(', '))],
      minimo: 3,
    },
    predice: {
      pieza: TA,
      pregunta: ['101 es primo. ¿Qué resto deja ', pot6(2, 100), ' al dividirlo entre 101?'],
      datos: ['2¹⁰⁰ es 2 multiplicado por sí mismo 100 veces'],
      voz: 'Piensa en el día en que los sueltos vuelven a 1.',
      opciones: [
        { id: 'c', texto: '1', correcta: true },
        { id: 'base', texto: '2', error: 'AT-FERMAT-BASE', siFuera: 'Volver a la base pasa un día después: el día p − 1, con p primo, deja otra cosa.' },
        { id: 'menos', texto: '100', error: 'AT-FERMAT-MENOS-UNO', siFuera: '100 es el exponente, p − 1. El resto es lo que sobra de 2¹⁰⁰.' },
        { id: 'entera', texto: 'No se puede saber sin calcular 2¹⁰⁰', error: 'AT-POTENCIA-ENTERA', siFuera: 'Calcularla no hace falta: con un primo, el día p − 1 siempre deja lo mismo.' },
      ],
      dibujo: { datos: tablaRestos(2, 7), estado: {} },
      revelar: { datos: TABLA7, estado: { fila: 5 } },
      coincide: 'Coincide: 101 es primo y no divide a 2; el exponente 100 = 101 − 1 deja 1.',
      noCoincide: 'Revisemos qué deja el día 6 con bolsitas de 7.',
    },
    mira: {
      pieza: TA,
      datos: TABLA7,
      voz: 'El día p − 1 siempre deja 1.',
      pasos: [
        { estado: { fila: 5 }, texto: 'Con bolsitas de 7, el día 6 deja 1 suelto con cualquier base.', ecuacion: [pot6(3, 6), ' = 729 = 7 × 104 + ', sob(1)] },
        { estado: { fila: 5 }, texto: 'Con bolsitas de 101 pasa lo mismo el día 100.', ecuacion: [pot6(2, 100), ' = ', MU(101), ' + ', sob(1)] },
        { estado: {}, texto: 'Si la base es múltiplo de la bolsita, no: 7⁶ deja 0.', ecuacion: [pot6(7, 6), ' = ', MU(7), ' + ', sob(0)] },
        { estado: {}, texto: 'Y la bolsita tiene que ser un primo: con 9, 2⁸ deja 4.', ecuacion: [pot6(2, 8), ' = 256 = 9 × 28 + ', sob(4)] },
        { estado: {}, texto: 'Otro hecho con un primo: 1 × 2 × … × 6 deja 6 entre 7.', ecuacion: ['1 × 2 × 3 × 4 × 5 × 6 = 720 = 7 × 102 + ', sob(6)] },
      ],
    },
    regla: {
      texto: 'Con p primo y a sin el factor p: aᵖ⁻¹ deja resto 1 entre p (Fermat), y 1 × 2 × … × (p − 1) deja p − 1 (Wilson).',
      ecuacion: [{ llave: [{ sup: ['a', ['p − 1']] }], nota: 'a no es múltiplo de p' }, ' = ', MU('p'), ' + ', sob(1), SEP,
        { llave: ['1 × 2 × … × (', bas('p'), ' − 1)'], nota: 'se escribe (p − 1)!' }, ' = ', MU('p'), ' − 1'],
      condicion: 'p primo y a no múltiplo de p: 7⁶ deja 0 y, con 9, que no es primo, 2⁸ deja 4.',
      voz: 'Con un primo, el día p − 1 deja 1.',
    },
    // Así se resuelve: el resto de una potencia grande entre 11 o 13. «Ahora tú» pide otra cosa: entre 5 o 7, cuándo no
    // vale, Wilson y Wilson más un número.
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        for (;;) {
          const p = r.de([11, 13]), a = r.ent(2, 9), n = r.ent(40, 199), k = Math.floor(n / (p - 1)), q = n % (p - 1), v = powmod(a, n, p);
          if (q === 0 || q > 4) continue;
          const val = a ** q;
          return {
            enunciado: ['¿Qué resto deja ', pot6(a, n), ' al dividirlo entre ', bas(p), '?'],
            datos: [D6.fermat, D6.exp, D6.mu],
            pasos: [
              { tipo: 'pide', texto: `Piden lo que sobra de ${a}${sup(n)} entre ${p}, sin calcular la potencia.` },
              { tipo: 'regla', texto: `${p} es primo y ${a} no es su múltiplo: por Fermat, ${a}${sup(p - 1)} deja 1. Cada bloque de ${p - 1} en el exponente vale 1.` },
              { tipo: 'cuentas', texto: `${n} = ${p - 1} × ${k} + ${q}: ${k} bloques que dejan 1, y queda ${a}${sup(q)}.` },
              { tipo: 'cuentas', texto: `${a}${sup(q)} = ${val}, y se divide entre ${p}.`, ecuacion: [`${val} = `, bas(p), ` × ${Math.floor(val / p)} + `, sob(v)] },
              { tipo: 'sentido', texto: `El resto, ${v}, es menor que ${p}: tiene sentido.` },
            ],
            respuesta: ['Resto ', sob(v)],
          };
        }
      },
    },
    ahoraTu: {
      voz: 'Primo, y la base no es su múltiplo.',
      generar(sem) {
        const r = azar(sem + 113), tipo = sem % 4;
        if (tipo === 0) return conCuatro(casoFermat, r);
        if (tipo === 1) return conCuatro(casoNoVale, r);
        if (tipo === 2) return conCuatro(casoWilson, r);
        return conCuatro(casoWilsonMas, r);
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  const FICHAS = () => Kit.piezas['arit-fichas'];
  const masCerca = (pt, candidatos) => candidatos.reduce((m, c) => (Math.hypot(c.x - pt.x, c.y - pt.y) < Math.hypot(m.x - pt.x, m.y - pt.y) ? c : m));
  // Mesa «filas de c»: N fichas en filas de c; las sobrantes, en naranja (lo que sobra). Ficha de 14 y alto de 140 para
  // que la ficha mida lo mismo con cualquier c de 3 a 12 (a lo más 10 filas): así el borde derecho se mueve parejo con
  // el dedo. Si N < c, la fila se completa con huecos punteados: el ancho elegido se ve aunque no alcance ni una fila.
  const filasDe = (nv, c) => {
    const q = Math.floor(nv / c), r = nv % c;
    return { bloques: [{ n: nv, columnas: c, color: 'i', marcoFilas: true, rotulo: r ? `${q} ${q === 1 ? 'fila' : 'filas'} y ${r} ${r === 1 ? 'suelta' : 'sueltas'}` : `${q} × ${c}`, tramos: r ? [{ de: q * c, a: nv - 1, color: 'o' }] : [], huecos: Math.max(0, c - nv) }], ficha: 14, altoMax: 140 };
  };
  const sueltas = v => v.n % v.c;
  const mesaFilas = {
    id: 'filas-de-c', titulo: 'Filas de c fichas', pieza: 'arit-fichas',
    consigna: 'Acomoda N fichas en filas de c. Estira el ancho de las filas hasta que no sobre ninguna ficha.',
    controles: [
      { id: 'n', etiqueta: 'N', min: 2, max: 30, paso: 1, inicio: 12, decimales: 0 },
      { id: 'c', etiqueta: 'Filas de', color: 'c-i', min: 3, max: 12, paso: 1, inicio: 5, decimales: 0 },
    ],
    dibujo: v => ({ datos: filasDe(v.n, v.c), estado: {} }),
    lectura: v => {
      const q = Math.floor(v.n / v.c), r = v.n % v.c;
      return r ? [`${v.n} en filas de `, bas(v.c), `: ${plural(q, 'fila', 'filas')} y `, sob(r), r === 1 ? ' suelta' : ' sueltas'] : [`${v.n} = ${q} × `, bas(v.c), ': no sobra ninguna'];
    },
    invitaciones: [
      { texto: 'Arma una sola fila llena con una cantidad prima de fichas.',
        logrado: v => v.c === v.n && esPrimo(v.n),
        bien: 'Un primo solo se llena así, en una fila. ¿Probaste otros anchos?' },
      { texto: 'Con 12 fichas, busca el ancho más grande, menor que 12, sin sueltas.',
        logrado: v => v.n === 12 && sueltas(v) === 0 && v.c === Math.max(...divisores(v.n).filter(x => x < v.n)),
        bien: '2 filas de 6: el mayor divisor de 12 después del propio 12.' },
      { texto: 'Arma un cuadrado: tantas filas como fichas tiene cada fila.',
        logrado: v => sueltas(v) === 0 && v.n === v.c * v.c,
        bien: 'Un cuadrado: c va con él mismo, y la cantidad de divisores sale impar.' },
      { texto: 'Guarda dos casos con el mismo ancho y N seguidos: uno lleno, otro con una suelta.',
        logrado: (v, guardados) => guardados.some(g => g.c === v.c && Math.abs(g.n - v.n) === 1 && Math.min(sueltas(g), sueltas(v)) === 0 && Math.max(sueltas(g), sueltas(v)) === 1),
        bien: 'Una ficha más y ya sobra: ningún ancho de 3 o más llena dos seguidos.' },
    ],
    arrastres: [{ id: 'ancho', etiqueta: 'borde derecho de las filas: c', color: 'c-i',
      donde: v => { const g = FICHAS().geometria(filasDe(v.n, v.c)); const cj = g.caja(0); return { x: cj.x + cj.ancho, y: cj.y + g.paso / 2 }; },
      mover: (pt, v) => {
        // Borde derecho para cada ancho posible (la ficha mide lo mismo en todos: ver filasDe); el más cercano al dedo.
        const cs = Array.from({ length: 10 }, (_, i) => { const c = i + 3, cj = FICHAS().geometria(filasDe(v.n, c)).caja(0); return { valor: c, x: cj.x + cj.ancho, y: pt.y }; });
        return { c: masCerca(pt, cs).valor };
      } }],
  };

  // Mesa 3D (ronda 4, docs/3d.md): la tabla de divisores de la idea 4 con un tercer primo, que la vuelve caja.
  // Cambia: los exponentes y lo resaltado · Permanece: un cubito por divisor, los ejes ×2, ×3 y ×5 · Progresa: la caja de
  // plana (dos primos) a sólida (tres) · Se reserva: el resaltado violeta, solo para lo que se cuenta (antes verde: el mapa
  // de la unidad no usa verde) · Debe verse: la cantidad de divisores es el volumen. La caja la arma MD.cajaDivisores.
  const RESALTA = { todos: 'divisores', pares: 'divisores pares', impares: 'divisores impares', cuadrados: 'cuadrados perfectos', multiplos: 'múltiplos de 15' };
  const caja = v => MD.cajaDivisores([v.a, v.b, v.c], [2, 3, 5], v.res);
  const lados = r => r.lados.slice().sort((x, y) => x - y).join('×');
  function datosCaja(v) {
    const r = caja(v), [a, b, c] = r.exps;
    const otros = r.cantidad - r.resaltados;
    return {
      bloques: r.cubitos.map(x => ({ x: x.x, y: x.y, z: x.z, g: x.resaltado ? 0 : 1 })),
      grupos: [
        { nombre: RESALTA[v.res], color: 'c-f', dice: `${r.resaltados} ${RESALTA[v.res]} de ${f(r.n, 0)}` },
        { nombre: 'divisores sin resaltar', dice: `${otros} ${otros === 1 ? 'divisor queda' : 'divisores quedan'} sin resaltar` },
      ],
      marcas: [
        { p: [a + 1.4, -0.4, 0.5], texto: '×2', color: 'c-i' },
        { p: [-0.4, b + 1.4, 0.5], texto: '×3', color: 'c-i' },
        { p: [-0.5, -0.5, c + 2], texto: '×5', color: 'c-i' },
      ],
      alt: `Caja de ${r.lados.join(' por ')} cubitos para ${r.texto} = ${f(r.n, 0)}: ${r.cantidad} divisores, ${r.resaltados} ${RESALTA[v.res]} en violeta.`,
    };
  }
  const mesaCaja = {
    id: 'caja-divisores', titulo: 'La caja de los divisores', pieza: 'ari-cubitos-3d',
    consigna: 'Gira la caja con el dedo: cada cubito es un divisor de N. Sube los exponentes y mira crecer cada lado.',
    controles: [
      { id: 'a', etiqueta: 'exponente de 2', min: 0, max: 4, paso: 1, inicio: 3, decimales: 0 },
      { id: 'b', etiqueta: 'exponente de 3', min: 0, max: 3, paso: 1, inicio: 1, decimales: 0 },
      { id: 'c', etiqueta: 'exponente de 5', min: 0, max: 3, paso: 1, inicio: 0, decimales: 0 },
      { id: 'res', etiqueta: 'Resalta', opciones: Object.keys(RESALTA).map(k => ({ valor: k, texto: k === 'todos' ? 'Todos' : RESALTA[k][0].toUpperCase() + RESALTA[k].slice(1) })) },
    ],
    dibujo: v => ({ datos: datosCaja(v), estado: {} }),
    lectura: v => { const r = caja(v); return [`N = ${f(r.n, 0)}: `, res(r.cantidad), ' divisores' + (v.res === 'todos' ? '' : `, ${r.resaltados} resaltados`)]; },
    invitaciones: [
      { texto: 'Usa los tres primos y arma un N con exactamente 12 divisores.',
        logrado: v => v.a > 0 && v.b > 0 && v.c > 0 && caja(v).cantidad === 12,
        bien: 'Lado por lado por lado da 12. Cuéntalos: ninguno se repite.',
        pista: 'Cuenta los cubitos de cada lado: el producto de los tres lados tiene que dar 12.' },
      { texto: 'Haz que la caja sea un cubo de 27 cubitos.',
        logrado: v => caja(v).lados.every(x => x === 3),
        bien: '900 = 2² × 3² × 5²: tres cubitos por lado, 27 divisores.',
        pista: 'Un cubo tiene los tres lados iguales. ¿Qué exponente da 3 cubitos?' },
      { texto: 'Resalta los cuadrados perfectos y logra que sean 8.',
        logrado: v => v.res === 'cuadrados' && caja(v).resaltados === 8,
        bien: 'Cada primo elige exponente 0 o 2: dos opciones por lado, 2 × 2 × 2 = 8.',
        pista: 'Un cuadrado perfecto usa exponentes pares. Dale a cada primo al menos 2.' },
      { texto: 'Resalta los pares con los tres primos y busca la capa apagada.',
        logrado: v => v.res === 'pares' && v.a > 0 && v.b > 0 && v.c > 0,
        bien: 'Queda apagada la capa sin el 2: esos son los divisores impares.',
        pista: 'Elige «Divisores pares» y dale exponente 1 o más al 2, al 3 y al 5.' },
      { texto: 'Guarda dos N con la misma cantidad de divisores y cajas de distinta forma.',
        logrado: (v, g) => g.some(x => g.some(y => caja(x).cantidad === caja(y).cantidad && lados(caja(x)) !== lados(caja(y)))),
        bien: 'La cantidad es el volumen de la caja; la forma puede cambiar.',
        pista: 'Prueba 2³ × 3 y después 2 × 3 × 5. Guarda los dos.' },
    ],
  };
  // Mesa «otro primo»: la tabla de divisores con q en vez de 3 (5 o 7).
  const nQ = v => 2 ** v.a * v.q ** v.b;
  const memo = new Map();
  const infoN = nv => { if (!memo.has(nv)) { const ds = divisores(nv); memo.set(nv, { cant: ds.length, suma: ds.reduce((u, z) => u + z, 0) }); } return memo.get(nv); };
  let MAX_D = 0; for (const q0 of [3, 5, 7]) MAX_D = Math.max(MAX_D, infoN(2 ** 4 * q0 ** 3).cant);
  const tablaDivQ = (a, b, qq) => ({
    columnas: [{ t: '×' }, ...Array.from({ length: a + 1 }, (_, i) => ({ t: `2${sup(i)}` }))],
    filas: Array.from({ length: b + 1 }, (_, j) => [{ t: `${qq}${sup(j)}` }, ...Array.from({ length: a + 1 }, (_, i) => ({ t: String(2 ** i * qq ** j), color: 'i' }))]),
    filasMax: 4, cabeza: true, alt: `Divisores de 2 a la ${a} por ${qq} a la ${b}: una tabla de ${a + 1} columnas por ${b + 1} filas`,
  });
  const verticeQ = (datos, b, a) => { const g = TABLA().geometria(datos); return { x: g.celda(b, a + 1).x, y: g.filaY(b) + g.altoFila }; };
  const mesaOtro = {
    id: 'otro-primo', titulo: 'Divisores con otro primo', pieza: TA,
    consigna: 'N = 2ᵅ × qᵝ. Elige el primo q y estira la tabla desde su esquina. Compara cantidad y suma de divisores.',
    controles: [
      { id: 'q', etiqueta: 'q', color: 'c-i', opciones: [{ valor: 3, texto: '3' }, { valor: 5, texto: '5' }, { valor: 7, texto: '7' }] },
      { id: 'a', etiqueta: 'α', min: 0, max: 4, paso: 1, inicio: 2, decimales: 0 },
      { id: 'b', etiqueta: 'β', min: 0, max: 3, paso: 1, inicio: 1, decimales: 0 },
    ],
    dibujo: v => ({ datos: tablaDivQ(v.a, v.b, v.q), estado: {} }),
    lectura: v => { const nv = nQ(v), x = infoN(nv); return [`N = ${nv}: `, res(x.cant), ` divisores, suman ${f(x.suma, 0)}`]; },
    invitaciones: [
      { texto: 'Consigue un N con exactamente 9 divisores.',
        logrado: v => infoN(nQ(v)).cant === 9,
        bien: '9 = 3 × 3: α = 2 y β = 2, con cualquier q.' },
      { texto: 'Haz que los divisores sumen justo el doble de N.',
        logrado: v => infoN(nQ(v)).suma === 2 * nQ(v),
        bien: 'Los divisores menores que N suman lo mismo que N: un número perfecto.' },
      { texto: 'Busca el N con más divisores que deja esta mesa.',
        logrado: v => infoN(nQ(v)).cant === MAX_D,
        bien: '20 divisores: 5 columnas por 4 filas, sea cual sea q.' },
      { texto: 'Guarda dos N con la misma cantidad de divisores y distinta suma.',
        logrado: (v, guardados) => guardados.some(g => infoN(nQ(g)).cant === infoN(nQ(v)).cant && infoN(nQ(g)).suma !== infoN(nQ(v)).suma),
        bien: 'La misma tabla con otros números: contar divisores no es sumarlos.' },
    ],
    arrastres: [{ id: 'esquina', etiqueta: 'esquina de la tabla: los exponentes α y β',
      donde: v => verticeQ(tablaDivQ(v.a, v.b, v.q), v.b, v.a),
      mover: (pt, v) => { const cs = []; for (let a = 0; a <= 4; a++) for (let b = 0; b <= 3; b++) cs.push(Object.assign({ a, b }, verticeQ(tablaDivQ(a, b, v.q), b, a))); const m = masCerca(pt, cs); return { a: m.a, b: m.b }; } }],
  };
  // Mesa «la criba hasta 100», ahora en la plancha de la rifa (arit-boletos, bloque «criba»).
  const MARCAS = [2, 3, 5, 7, 11];
  const sinTachar = p => primosHasta(100).length + quedanComp(100, p).length;
  const mesaCriba = {
    id: 'criba-100', titulo: 'La criba hasta 100', pieza: BO,
    consigna: 'La plancha llega a 100. Elige el último primo que tacha. ¿El 11 tacha algo nuevo?',
    controles: [{ id: 'p', etiqueta: 'tachar hasta', color: 'c-i', opciones: MARCAS.map(x => ({ valor: x, texto: String(x) })) }],
    dibujo: v => ({ datos: cribaDe(100, v.p), estado: {} }),
    lectura: v => [`Hasta el ${v.p}: quedan ${sinTachar(v.p)} sin tachar de 100`],
    invitaciones: [
      { texto: 'Haz que el 49 quede tachado.',
        logrado: v => v.p >= 7,
        bien: '49 = 7 × 7: el primero que el 7 tacha sin ayuda de 2, 3 o 5.' },
      { texto: 'Busca el menor marcador que deje sin tachar solo primos.',
        logrado: v => quedanComp(100, v.p).length === 0 && quedanComp(100, MARCAS[Math.max(0, MARCAS.indexOf(v.p) - 1)]).length > 0,
        bien: 'Con el 5 quedaban 49, 77 y 91. El 7 los tacha.' },
      { texto: 'Guarda dos marcadores que dejen la misma cantidad sin tachar.',
        logrado: (v, guardados) => guardados.some(g => g.p !== v.p && sinTachar(g.p) === sinTachar(v.p)),
        bien: 'El 7 y el 11 dejan 25: basta llegar a la raíz de 100.' },
    ],
  };

  return {
    unidad: 'aritmetica.numeros-primos-y-divisores',
    version: '0.3.0',
    estado: 'completa',
    colores: COLORES,
    letras: { N: 'el número que se estudia', d: 'un divisor de N', k: 'un entero', p: 'un número primo', q: 'otro número primo, distinto de p',
      'α': 'el exponente de p en N', 'β': 'el exponente de q en N', 'φ': 'la función de Euler', a: 'la base de una potencia' },
    requiere: ['/nucleo/kit/piezas/arit-bandejas.js', '/nucleo/kit/piezas/arit-arbol.js', '/nucleo/kit/piezas/arit-boletos.js', '/nucleo/kit/piezas/arit-fichas.js', '/nucleo/kit/piezas/arit-tabla.js',
      '/nucleo/kit/piezas/arit-puesto.js', '/plantillas/divisores/motor.js', '/nucleo/kit/piezas/ari-cubitos-3d.js'],
    glosario: [
      // De 2 a 4 palabras por idea, con su aproximación y tres ejemplos. «divisor», «múltiplo» y «división exacta» son de
      // Las cuatro operaciones; «número primo», de Lógica: aquí no se definen (el lector los marca «se explica en…»).
      // Ningún ejemplo resuelve una predicción.
      { termino: 'número compuesto', formas: ['número compuesto', 'números compuestos'], def: 'Entero mayor que 1 que tiene más de dos divisores.',
        simple: 'El que se acomoda en la bandeja de más de una forma.', ver: ['divisor', 'pareja de divisores'],
        ejemplos: ['12 lo es: 1 × 12, 2 × 6 y 3 × 4.', '9 lo es: también va en 3 filas de 3.', '15 = 3 × 5: va en 3 filas de 5.'] },
      { termino: 'pareja de divisores', formas: ['pareja de divisores', 'parejas de divisores'], def: 'Dos divisores de N cuyo producto es N: las filas y los caramelos de cada fila.',
        simple: 'Las dos medidas de una bandeja llena: filas y caramelos por fila.', ver: ['divisor'],
        ejemplos: ['3 y 8 lo son de 24: 3 × 8 = 24.', 'En 16, el 4 va con él mismo: 4 × 4.', 'El 1 y el número mismo siempre lo son.'] },
      { termino: 'criba de Eratóstenes', formas: ['criba de Eratóstenes', 'criba'], def: 'Método para hallar primos: se tachan el 1 y los múltiplos de cada primo; los que quedan son primos.',
        simple: 'Un cernidor de números: se van los múltiplos y quedan los primos.', ver: ['número compuesto'],
        ejemplos: ['Del 1 al 10 deja sin tachar 2, 3, 5 y 7.', 'El 4, el 6 y el 8 caen con el 2.', 'El 1 se tacha desde el principio.'] },
      { termino: 'raíz cuadrada', simbolo: '√', formas: ['raíz cuadrada', 'raíces cuadradas'], def: 'El número positivo que, multiplicado por sí mismo, da el número dado.',
        simple: 'El lado del cuadrado que se arma con esa cantidad de caramelos.', ver: ['pareja de divisores'],
        ejemplos: ['√36 = 6, porque 6 × 6 = 36.', '√81 = 9.', '√20 está entre 4 y 5: 4 × 4 = 16 y 5 × 5 = 25.'] },
      { termino: 'factorización', formas: ['factorización', 'factorizaciones', 'factoriza', 'factorizo', 'descomposición canónica'], def: 'Escribir un número como producto de primos, con exponentes para los que se repiten.',
        simple: 'Partir un número hasta que todas sus partes sean primos.', ver: ['factor primo', 'teorema fundamental'],
        ejemplos: ['12 = 2² × 3.', '45 = 3² × 5.', '77 = 7 × 11.'] },
      { termino: 'factor primo', formas: ['factor primo', 'factores primos', 'divisor primo', 'divisores primos'], def: 'Primo que divide exacto a un número; aparece en su factorización.',
        simple: 'Cada hoja del árbol: un primo que entra en el número.', ver: ['factorización'],
        ejemplos: ['Los de 12 son 2 y 3.', 'El de 32 es solo el 2.', 'Los de 70 son 2, 5 y 7.'] },
      { termino: 'teorema fundamental', formas: ['teorema fundamental de la aritmética', 'teorema fundamental'], def: 'Todo entero mayor que 1 se escribe como producto de primos de una sola manera, sin contar el orden.',
        simple: 'Se parta como se parta, un número llega siempre a los mismos primos.', ver: ['factorización'],
        ejemplos: ['12 = 2 × 6 = 3 × 4, y siempre sale 2 × 2 × 3.', '45 llega a 3, 3 y 5, se empiece por 5 o por 9.', 'Por eso no hay dos formas canónicas de un número.'] },
      { termino: 'PESI', formas: ['PESI', 'primos entre sí'], def: 'Dos o más números que no comparten ningún primo en su factorización.',
        simple: 'Números que no tienen ningún primo en común.', ver: ['factor primo'],
        ejemplos: ['3 y 5 lo son: no comparten ningún primo.', '6 y 10 no: los dos tienen el 2.', 'El 1 es PESI con cualquier número.'] },
      { termino: 'cantidad de divisores', simbolo: 'CD(N)', formas: ['cantidad de divisores', 'CD'], def: 'Cuántos números dividen a N sin que sobre nada, contando el 1 y N.',
        simple: 'Cuántas casillas tiene la tabla de divisores.', ver: ['divisor', 'suma de divisores'],
        ejemplos: ['CD(12) = 6: 1, 2, 3, 4, 6 y 12.', 'CD(7) = 2: el 7 es primo.', 'CD(2³) = 4: 1, 2, 4 y 8.'] },
      { termino: 'suma de divisores', simbolo: 'SD(N)', formas: ['suma de divisores', 'suma de los divisores', 'SD'], def: 'El resultado de sumar todos los divisores de N, también el 1 y N.',
        simple: 'Juntar lo que dicen todas las casillas de la tabla.', ver: ['cantidad de divisores'],
        ejemplos: ['SD(6) = 1 + 2 + 3 + 6 = 12.', 'SD(9) = 1 + 3 + 9 = 13.', 'SD(5) = 6: un primo más uno.'] },
      { termino: 'divisor propio', formas: ['divisor propio', 'divisores propios'], def: 'Divisor de N distinto del mismo N.',
        simple: 'Un divisor que no es el número mismo.', ver: ['divisor'],
        ejemplos: ['Los de 6 son 1, 2 y 3.', 'El 1 es propio de todo número mayor que 1.', '10 tiene 3: 1, 2 y 5.'] },
      { termino: 'divisor simple', formas: ['divisor simple', 'divisores simples'], def: 'El 1 o un divisor primo de N; los demás divisores son compuestos.',
        simple: 'El 1 o una hoja del árbol del número.', ver: ['factor primo', 'número compuesto'],
        ejemplos: ['Los de 12 son 1, 2 y 3.', 'El 1 es simple pero no primo.', 'Los de 42 son 1, 2, 3 y 7.'] },
      { termino: 'función de Euler', simbolo: 'φ(N)', formas: ['función de Euler'], def: 'Cuenta los números del 1 al N que no comparten ningún primo con N.',
        simple: 'Cuántos boletos ganan si gana el que no comparte primos con el total.', ver: ['PESI'],
        ejemplos: ['φ(10) = 4: 1, 3, 7 y 9.', 'φ(7) = 6: todos menos el 7.', 'φ(9) = 6: 1, 2, 4, 5, 7 y 8.'] },
      { termino: 'fracción irreductible', formas: ['fracción irreductible', 'fracciones irreductibles', 'irreductible', 'irreductibles'], def: 'Fracción cuyo numerador y denominador son PESI: ya no se simplifica.',
        simple: 'Una fracción que ya no se puede simplificar.', ver: ['PESI', 'función de Euler'],
        ejemplos: ['3/4 lo es.', '6/8 no: es lo mismo que 3/4.', '5/12 lo es: 5 y 12 son PESI.'] },
      { termino: 'teorema de Fermat', formas: ['teorema de Fermat', 'Fermat'], def: 'Teorema sobre el resto de una potencia entre un primo que no divide a la base; evita calcular la potencia.',
        simple: 'Un atajo para el resto de una potencia entre un primo.', ver: ['teorema de Wilson'],
        ejemplos: ['Sirve para el resto de 2⁶⁰ entre 7 sin calcular 2⁶⁰.', 'No se usa entre 15: 15 no es primo.', 'No se usa con 7⁶ entre 7: la base es múltiplo de 7.'] },
      { termino: 'teorema de Wilson', formas: ['teorema de Wilson', 'Wilson'], def: 'Si p es primo, el producto de 1 hasta p − 1 deja resto p − 1 entre p.',
        simple: 'Multiplicar de 1 a p − 1 deja p − 1 sueltos.', ver: ['teorema de Fermat'],
        ejemplos: ['1 × 2 × 3 × 4 = 24 deja 4 entre 5.', '1 × 2 = 2 deja 2 entre 3.', '1 × 2 × … × 6 = 720 deja 6 entre 7.'] },
    ],
    laboratorio: [mesaCaja, mesaFilas, mesaOtro, mesaCriba],
    historia: {
      texto: 'En los Elementos, Euclides prueba que ninguna lista finita contiene todos los primos. Toma los primos de la lista, los multiplica y suma 1. Ese número no es múltiplo de ninguno de ellos, así que tiene un divisor primo que faltaba. La prueba no dice que el resultado sea primo: dice que la lista estaba incompleta.',
      pregunta: '¿Se acabarán alguna vez los primos?',
      fuente: { titulo: 'Euclides, Elementos IX.20; edición y comentario de David E. Joyce — Clark University', url: 'https://mathcs.clarku.edu/~djoyce/elements/bookIX/propIX20.html' },
    },
    laboratorioIdeas: {
      'caja-divisores': ['divisores'],
      'filas-de-c': ['rectangulos'],
      'otro-primo': ['divisores'],
      'criba-100': ['criba'],
    },
    ideas: [primos, criba, fact, cantidad, euler, fermat],
  };
});
