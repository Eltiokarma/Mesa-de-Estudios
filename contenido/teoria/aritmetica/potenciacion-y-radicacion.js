/*
 * Teoría de «Potenciación y radicación» (aritmetica.potenciacion-y-radicacion), para 5.º de secundaria y
 * preuniversitario. Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 17) y la investigación previa
 * docs/investigacion/etapa9/aritmetica.potenciacion-y-radicacion.md (su idea 6; las ideas 1 a 5 son de Álgebra).
 *
 * Etapa 9 del plan de calidad (26 nov), EN PROCESO: la propuesta es docs/etapa9/propuesta-aritmetica.md (Gerson delegó
 * el criterio y la revisa después). Seis ideas, rehechas contra el contrato con sus 15 ejemplos: 1 `perfectos`
 * (cuadrados y cubos perfectos por sus exponentes), 2 `exclusion` (criterios que descartan cuadrados), 3 `raiz-entera`
 * (raíz cuadrada entera con sus residuos), 4 `raiz-cubica` (nueva: raíz cúbica entera), 5 `contar` (nueva: cuadrados y
 * cubos en un tramo, San Marcos 2026-II) y 6 `aproximadas` (encerrar una raíz por décimas y centésimas). Hilo de la rama:
 * el puesto de caramelos de doña Juana (la bandeja cuadrada, pieza arit-cuadrado, dibujo de prueba; el cubo de cubitos
 * de chocolate, ari-cubitos-3d; su calculadora, arit-calculadora). Práctica por idea: plantillas/potencias-raices. Con
 * calidad: 2 desde el 26 nov (redactor, auditor y dos lectores en frío).
 *
 * Letras (propuesta §6; def.letras): N, el número que se estudia (los caramelos, los cubitos); k, la raíz entera (el lado
 * de la bandeja cuadrada o la arista del cubo más grande que se arma); r, el residuo, lo que sobra (aviso: en la rama, r
 * es el resto de una división; aquí solo va con la raíz); rₑ, el residuo por exceso, lo que falta para el siguiente; p y
 * q, primos, y α y β, sus exponentes; m, el menor número por el que se multiplica o divide N (idea 1); a y b, los
 * extremos de un tramo (idea 5); x, una aproximación de la raíz (idea 6). × para multiplicar, nunca «·» (el «   ·   »
 * solo separa dos relaciones en una regla).
 *
 * REGLA DE COLORES DE LA UNIDAD: un color fijo por magnitud (docs/molde-unidad.md §5b; propuesta §7), en la tabla
 * COLORES (def.colores):
 *   - naranja (c-o), «número»: N, el número que se estudia (los caramelos, los cubitos, el radicando);
 *   - turquesa (c-i), «exponente»: el exponente de cada primo en la factorización (ideas 1 y 2);
 *   - violeta (c-f), «raíz»: k, la raíz entera (el lado, la arista), y x, la aproximación de la raíz;
 *   - carmín (c-h), «residuo»: r, lo que sobra (los caramelos y cubitos que sobran, punteados);
 *   - tinta: rₑ (lo que falta, con lugares punteados), m, a, b, las cantidades que se cuentan y «?».
 *   - nada en verde (la teoría de antes ponía el cuadrado siguiente en verde, junto al carmín del residuo).
 *   La letra de una alternativa va en negrita y en tinta ({ negrita }). Cada ficha de color dice su magnitud (m);
 *   contenido/teoria/aritmetica/potenciacion-y-radicacion.test.js falla si una cambia de color.
 * Errores: los AT-* son hipótesis de aula (ver el bloque de cada idea); H-TERM y la trampa de «restar las bases sin
 * sumar 1» salen de la investigación previa y del CSV de San Marcos (2026-II).
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver un cuadrado perfecto como una bandeja de caramelos que cierra, y la raíz entera como la bandeja más
 *     grande que cabe, con lo que sobra y lo que falta.
 *   Persona y condiciones: postulante de 5.º o de academia, celular de 360 px de gama baja, sin audio, con lápiz al lado.
 *   Resultado observable: decide si un número es cuadrado o cubo perfecto por sus exponentes y halla el menor factor
 *     que lo completa, descarta cuadrados por su cifra final sin confundir descartar con confirmar, halla raíz entera
 *     cuadrada y cúbica con sus residuos, cuenta cuadrados y cubos en un tramo y encierra una raíz por décimas.
 *   Orden de atención: 1.º el objeto (la bandeja, el cubo, la calculadora) · 2.º la lectura · acción: el botón fijo.
 *   Estados: juego sin tocar · casos probados · misión lograda · predicción · coincide / no coincide · paso a paso ·
 *     caso nuevo · «No sé».
 *   Duda que resuelve: «si 2 021 termina en 1, como 81, ¿por qué no es un cuadrado?».
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El motor de plantillas/potenciacion arma el cubo de cubitos y su residuo (regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/potenciacion/motor.js'))
    : fabrica(root.Kit, root.MotorPotenciacion);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MP) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = x => String(x).split('').map(c => SUPD[+c]).join('');
  const factores = x => { const out = []; for (let p = 2; x > 1; p++) { let e = 0; while (x % p === 0) { x /= p; e++; } if (e) out.push([p, e]); } return out; };
  const valorDe = fs => fs.reduce((a, [p, e]) => a * p ** e, 1);
  // «2³ × 3 × 5²»: la factorización en texto, con los exponentes como superíndice (el 1 no se escribe).
  const canonDe = fs => (fs.length ? fs.map(([p, e]) => (e > 1 ? `${p}${sup(e)}` : String(p))).join(' × ') : '1');
  const canon = x => canonDe(factores(x));
  const isqrt = n => { let x = Math.floor(Math.sqrt(n)); while (x * x > n) x--; while ((x + 1) * (x + 1) <= n) x++; return x; };
  const icbrt = n => { let x = Math.floor(Math.cbrt(n)); while (x * x * x > n) x--; while ((x + 1) ** 3 <= n) x++; return x; };
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
  const COLORES = { numero: 'o', exponente: 'i', raiz: 'f', residuo: 'h' };
  const ficha = mg => t => ({ v: `c-${COLORES[mg]}`, t: typeof t === 'number' ? f(t, 0) : String(t), m: mg });
  const nu = ficha('numero'), ex = ficha('exponente'), ra = ficha('raiz'), re = ficha('residuo');
  // La letra de una alternativa, en negrita y en tinta: sin color, para que una trampa no parezca la respuesta.
  const letra = L => ({ negrita: [L] });
  // Entre dos relaciones de una misma ecuación.
  const SEP = '   ·   ';
  // Una potencia con el exponente en turquesa (ideas 1 y 2): { sup: ['2', ⁴] }. Con exponente 1, el primo solo.
  const px = (p, e) => (e === 1 ? String(p) : [String(p), ex(sup(e))]);
  // La factorización como ecuación: 2³ × 3 × 5², con los exponentes en turquesa.
  const canonEc = fs => fs.flatMap(([p, e], i) => (i ? [' × ', px(p, e)] : [px(p, e)]));
  // La raíz al cuadrado (o al cubo), con la base en violeta: 60².
  const alK = (k, n = 2) => [ra(k), n === 2 ? '²' : '³'];
  const CU = 'arit-cuadrado', TA = 'arit-tabla', CA = 'arit-calculadora';
  // La bandeja más cuadrada que cierra con N caramelos: k × k si N es cuadrado; si no, el rectángulo filas × porFila
  // con filas ≤ porFila y filas lo más grande posible (72 → 8 × 9).
  function masCuadrada(Nv) {
    let a = isqrt(Nv); while (Nv % a) a--;
    return a * a === Nv ? { k: a } : { filas: a, porFila: Nv / a };
  }

  // ---------- Idea 1 (rehecha, 26 nov): cuadrados y cubos perfectos por sus exponentes ----------
  // Propuesta: docs/etapa9/propuesta-aritmetica.md §1 a §7. Conserva el id `perfectos`, con otra Predice. Objeto: la
  // bandeja cuadrada de doña Juana (pieza arit-cuadrado, dibujo de prueba): con 2ᵃ × 3ᵇ caramelos se arma la bandeja más
  // cuadrada que cierra. Cambia: los exponentes de 2 y de 3. · Permanece: la bandeja y la factorización. · Progresa: un
  // exponente impar (8 × 9) → los dos pares (6 × 6, 12 × 12). · Se reserva: un tercer primo y un exponente 1 (la
  // predicción, con 600 = 2³ × 3 × 5²; el juego solo tiene el 2 y el 3, con exponentes de 1 a 4 y de 1 a 2). · Debe verse:
  // basta un exponente impar para que la bandeja no cierre en cuadrado.
  // Errores (hipótesis de aula; la investigación previa no los trae para esta idea): AT-TODOS multiplica por todos los
  // primos · AT-COPIA multiplica por toda la parte impar (sale un cuadrado, no el menor) · AT-EXP-UNO olvida el
  // exponente 1 de un primo sin exponente escrito · AT-OTRO-INDICE completa para cuadrado cuando se pide cubo (o al
  // revés) · AT-MISMO multiplica N por sí mismo · AT-CUBO cree que un cubo es cuadrado · AT-SUMA-PAR mira la suma de los
  // exponentes · AT-BASE-NO-PRIMA mira el exponente de una base que no es prima (4³) · AT-MULTIPLICA da el multiplicador
  // cuando se pide el divisor · AT-CD cuenta todos los divisores · AT-SIN-CERO olvida el exponente 0 al contar.
  const D1 = {
    cuadrado: 'Cuadrado perfecto: cada primo de su factorización tiene exponente par',
    cubo: 'Cubo perfecto: cada primo de su factorización tiene exponente múltiplo de 3',
    uno: 'Un primo sin exponente escrito tiene exponente 1: 5 = 5¹',
    cuenta: 'El exponente cuenta cuántas veces se multiplica la base: 4³ = 4 × 4 × 4',
    divisor: 'Un divisor de N lleva cada primo de N con un exponente desde 0 hasta el que tiene en N',
    cero: 'Exponente 0: ese primo no está en el divisor (2⁰ = 1)',
  };
  // Casos que ya usan la predicción y los ejemplos: «Ahora tú» y «Así se resuelve» no los repiten.
  const USADOS1 = new Set([600, 144, 72, 216, 400, 108, 50, 180, 576, 64, 540, 1350, 3600, 75]);
  const tablaFact = (fs, o = {}) => ({
    columnas: [{ t: 'primo' }, { t: 'exponente', color: 'i' }].concat(o.par ? [{ t: '¿par?' }] : []).concat(o.por ? [{ t: 'falta' }] : []),
    filas: fs.map(([p, e]) => {
      const fila = [String(p), { t: String(e), color: 'i' }];
      if (o.par) fila.push(e % 2 ? 'no' : 'sí');
      if (o.por) fila.push(e % 2 ? `un ${p}` : 'nada');
      return fila;
    }),
    filasMax: Math.max(3, fs.length), cabeza: true,
  });
  const F600 = [[2, 3], [3, 1], [5, 2]];
  // El menor m que vuelve a N potencia de índice n (sube cada exponente al múltiplo de n que sigue) y el menor divisor
  // (le quita a cada exponente su resto entre n).
  const multDe = (fs, n) => fs.reduce((a, [p, e]) => a * p ** ((n - e % n) % n), 1);
  const divDe = (fs, n) => fs.reduce((a, [p, e]) => a * p ** (e % n), 1);
  const todosDe = fs => fs.reduce((a, [p]) => a * p, 1);
  // Multiplica por la parte de exponente impar entera (2³ × 3 → 24): sale un cuadrado, pero sobran factores.
  const copiaDe = fs => fs.reduce((a, [p, e]) => a * (e % 2 ? p ** e : 1), 1);
  // Olvida los primos de exponente 1 (no ve su exponente).
  const sinUnoDe = (fs, n) => fs.reduce((a, [p, e]) => a * (e === 1 ? 1 : p ** ((n - e % n) % n)), 1);
  const esPot = (fs, n) => fs.every(([, e]) => e % n === 0);
  const nombreDe = n => (n === 2 ? 'cuadrado' : 'cubo');
  // Factorización al azar con primos dados y exponentes de 0 a eMax, sin que ya sea potencia de índice n.
  function factAzar(r, primos, eMax, n, tope) {
    for (;;) {
      const fs = primos.map(p => [p, r.ent(0, eMax)]).filter(([, e]) => e > 0);
      const Nv = valorDe(fs);
      if (fs.length >= 2 && Nv <= tope && Nv >= 12 && !esPot(fs, n) && !USADOS1.has(Nv)) return fs;
    }
  }
  // La bandeja más cuadrada con N caramelos, con su rótulo «8 filas de 9» (pieza arit-cuadrado).
  const bandeja = (Nv, o = {}) => {
    const b = masCuadrada(Nv), fil = b.k || b.filas, por = b.k || b.porFila;
    return { pieza: CU, datos: Object.assign({ bandejas: [Object.assign(b, { rotulo: [[`${fil} filas de ${por}`]] }, o.pie ? { pie: o.pie } : {})], alto: o.alto || 240 }, o.mudo ? { mudo: true } : {}), estado: {} };
  };
  const potTxt = (b, e) => (e === 1 ? String(b) : `${b}${sup(e)}`);
  // «a, b y c»: una serie con su «y» antes del último.
  const yLista = xs => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}`);

  // Ahora tú · tipo 0: cuál de cuatro números escritos como potencias es cuadrado perfecto. La mitad de las veces, la
  // correcta tiene una base que no es prima con exponente impar (4³ × 3² = 2⁶ × 3²).
  function casoCualCuadrado(r) {
    const trampa = r() < 0.5;
    const [b1, e1, b2, e2] = trampa ? r.de([[4, 3, 3, 2], [4, 5, 3, 2], [9, 3, 2, 2], [4, 3, 5, 2], [9, 3, 5, 2]])
      : [r.de([2, 3, 5]), 2 * r.ent(1, 2), r.de([7, 11]), 2];
    const V = b1 ** e1 * b2 ** e2, correcta = `${potTxt(b1, e1)} × ${potTxt(b2, e2)}`;
    if (USADOS1.has(V)) return null;
    const a = r.de([2, 3]), b = r.de([5, 7]);
    const cubo = `${a}³ × ${b}³`, uno = `${a}² × ${b}`, suma = `${a}³ × ${b}⁵`;
    return {
      pregunta: '¿Cuál de estos números es un cuadrado perfecto?',
      datos: [D1.cuadrado, D1.uno, D1.cuenta],
      opciones: opciones(correcta, [
        { id: 'cubo', valor: cubo, error: 'AT-CUBO', siFuera: `${cubo} es un cubo perfecto, pero sus dos exponentes son 3, que es impar: no es un cuadrado.` },
        { id: 'uno', valor: uno, error: 'AT-EXP-UNO', siFuera: `El ${a}² está bien, pero el ${b} tiene exponente 1, que es impar: no es un cuadrado.` },
        { id: 'suma', valor: suma, error: 'AT-SUMA-PAR', siFuera: 'Los exponentes suman 8, que es par, pero se mira cada uno por separado, y 3 y 5 son impares.' },
      ]),
      solucion: { texto: trampa ? `${b1} no es primo: ${b1} = ${b1 === 4 ? '2 × 2' : '3 × 3'}, así que ${potTxt(b1, e1)} lleva ${2 * e1} veces el ${b1 === 4 ? 2 : 3}. Escrito con primos, todos los exponentes quedan pares.` : 'Las dos bases ya son primos y sus dos exponentes son pares.',
        ecuacion: [`${correcta} = `, ...canonEc(factores(V)), ' = ', alK(isqrt(V))] },
    };
  }
  // Ahora tú · tipos 1 y 2: el menor número por el que se multiplica N para obtener un cuadrado (n = 2) o un cubo (n = 3).
  // Primos 2, 3, 5 y 7 (el cubo, con 7: «Así se resuelve» usa el 5 y nunca el 7).
  function casoMultiplica(r, n) {
    const fs = factAzar(r, n === 2 ? [2, 3, 5, 7] : [2, 3, 7], n === 2 ? 3 : 4, n, 6000);
    if (n === 3 && !fs.some(([p]) => p === 7)) return null;
    const Nv = valorDe(fs), m = multDe(fs, n), otro = n === 2 ? 3 : 2, nom = nombreDe(n);
    const k = n === 2 ? isqrt(Nv * m) : icbrt(Nv * m);
    return {
      pregunta: [`¿Por qué número mínimo hay que multiplicar `, nu(Nv), ` para obtener un ${nom} perfecto?`],
      datos: [n === 2 ? D1.cuadrado : D1.cubo, D1.uno],
      opciones: opciones(m, [
        { id: 'todos', valor: todosDe(fs), error: 'AT-TODOS', siFuera: `Partir ${f(Nv, 0)} = ${canonDe(fs)} está bien, pero multiplicar por todos los primos sube también los exponentes que ya cumplían.` },
        { id: 'otro', valor: multDe(fs, otro) > 1 ? multDe(fs, otro) : null, error: 'AT-OTRO-INDICE', siFuera: `Ese número completa los exponentes para un ${nombreDe(otro)}, no para un ${nom}.` },
        { id: 'uno', valor: sinUnoDe(fs, n) > 1 ? sinUnoDe(fs, n) : null, error: 'AT-EXP-UNO', siFuera: `Completaste los primos con exponente escrito, pero el que no lo lleva tiene exponente 1 y también hay que completarlo.` },
        { id: 'mismo', valor: Nv, error: 'AT-MISMO', siFuera: n === 2 ? `Multiplicar por ${f(Nv, 0)} sí da un cuadrado, ${f(Nv, 0)}², pero no es el menor número que sirve.`
          : 'Multiplicar el número por sí mismo duplica cada exponente, y el que no era múltiplo de 3 sigue sin serlo: no sale un cubo.' },
      ], x => f(x, 0)),
      solucion: { texto: `${f(Nv, 0)} = ${canonDe(fs)}. Cada exponente que no cumple sube al ${n === 2 ? 'par' : 'múltiplo de 3'} que sigue; los demás no se tocan.`, ecuacion: [`${f(Nv, 0)} × ${f(m, 0)} = ${f(Nv * m, 0)} = `, alK(k, n)] },
    };
  }
  // Ahora tú · tipo 3: el menor número entre el que se divide N para obtener un cubo perfecto.
  function casoDivide(r) {
    const fs = factAzar(r, [2, 3, 5], 5, 3, 20000);
    if (!fs.some(([, e]) => e >= 3)) return null;
    const Nv = valorDe(fs), d = divDe(fs, 3), k = icbrt(Nv / d);
    if (Nv / d < 8) return null;
    return {
      pregunta: ['¿Entre qué número mínimo hay que dividir ', nu(Nv), ' para obtener un cubo perfecto?'],
      datos: [D1.cubo, D1.uno],
      opciones: opciones(d, [
        { id: 'multiplica', valor: multDe(fs, 3), error: 'AT-MULTIPLICA', siFuera: 'Ese número completa los exponentes si se multiplica. Aquí se divide, así que a cada exponente se le quita lo que le sobra.' },
        { id: 'otro', valor: divDe(fs, 2) > 1 ? divDe(fs, 2) : null, error: 'AT-OTRO-INDICE', siFuera: 'Dividir entre ese número deja un cuadrado perfecto, no un cubo.' },
        { id: 'todos', valor: todosDe(fs), error: 'AT-TODOS', siFuera: `Partir ${f(Nv, 0)} = ${canonDe(fs)} está bien, pero a cada exponente se le quita solo su resto entre 3, no un primo de cada uno.` },
      ], x => f(x, 0)),
      solucion: { texto: `${f(Nv, 0)} = ${canonDe(fs)}. A cada exponente se le quita su resto entre 3, para que baje al múltiplo de 3 anterior.`, ecuacion: [`${f(Nv, 0)} ÷ ${f(d, 0)} = ${f(Nv / d, 0)} = `, alK(k, 3)] },
    };
  }
  // Ahora tú · tipo 4 (examen; San Marcos 2025-II pregunta por divisores de un cuadrado): cuántos divisores de N son
  // cuadrados perfectos.
  function casoDivisoresCuadrados(r) {
    const fs = [[2, r.ent(2, 6)], [3, r.ent(1, 4)], [5, r.ent(1, 3)]].filter(([, e]) => e > 0);
    const Nv = valorDe(fs);
    if (Nv > 50000 || USADOS1.has(Nv)) return null;
    const c = fs.reduce((a, [, e]) => a * (Math.floor(e / 2) + 1), 1), cd = fs.reduce((a, [, e]) => a * (e + 1), 1);
    const sin0 = fs.reduce((a, [, e]) => a * Math.floor(e / 2), 1);
    return {
      pregunta: ['¿Cuántos divisores de ', nu(Nv), ` = ${canonDe(fs)} son cuadrados perfectos?`],
      datos: [D1.divisor, D1.cero, D1.cuadrado],
      opciones: opciones(c, [
        { id: 'cd', valor: cd, error: 'AT-CD', siFuera: `${cd} es la cantidad de todos los divisores, pero un divisor cuadrado solo lleva exponentes pares.` },
        { id: 'sin0', valor: sin0 || null, error: 'AT-SIN-CERO', siFuera: 'Elegir exponentes pares está bien, pero el 0 también es par: un primo puede no estar en el divisor.' },
        { id: 'mitad', valor: Math.floor(cd / 2), error: 'AT-MITAD', siFuera: `Los divisores cuadrados no son la mitad de los ${cd}: se cuentan los exponentes pares posibles de cada primo y se multiplican.` },
      ]),
      solucion: { texto: `Cada primo puede ir con un exponente par desde 0: ${yLista(fs.map(([p, e]) => `el ${p} tiene ${plural(Math.floor(e / 2) + 1, 'opción', 'opciones')}`))}.`,
        ecuacion: [fs.map(([, e]) => String(Math.floor(e / 2) + 1)).join(' × ') + ` = ${c}`] },
    };
  }

  // Así se resuelve (idea 1): el menor multiplicador para un cubo perfecto, con el primo 5 (el tipo de «Ahora tú» usa el 7).
  function resuelveCubo(s) {
    const r = azar(s + 900);
    let fs;
    do { fs = factAzar(r, [2, 3, 5], 4, 3, 6000); } while (!fs.some(([p]) => p === 5));
    const Nv = valorDe(fs), m = multDe(fs, 3), k = icbrt(Nv * m);
    const faltan = fs.filter(([, e]) => e % 3).map(([p, e]) => `a ${potTxt(p, e)} ${3 - e % 3 === 1 ? 'le falta un' : 'le faltan dos'} ${p}`);
    const fs2 = fs.map(([p, e]) => [p, e + (3 - e % 3) % 3]);
    return {
      enunciado: ['¿Por qué número mínimo hay que multiplicar ', nu(Nv), ' para obtener un cubo perfecto?'],
      datos: [D1.cubo, D1.uno],
      dibujo: { pieza: TA, datos: { columnas: [{ t: 'primo' }, { t: 'exponente', color: 'i' }], filas: fs.map(([p]) => [String(p), '?']), filasMax: 3, cabeza: true }, estado: {} },
      pasos: [
        { tipo: 'pide', texto: ['Piden el menor número que, multiplicado por ', nu(Nv), ', da un cubo perfecto.'] },
        { tipo: 'datos', texto: 'Parto el número en primos y anoto el exponente de cada uno.', ecuacion: [nu(Nv), ' = ', ...canonEc(fs)],
          dibujo: { pieza: TA, datos: tablaFact(fs), estado: {} } },
        { tipo: 'regla', texto: 'En un cubo perfecto cada exponente es múltiplo de 3. Subo cada uno al múltiplo de 3 que sigue; si ya lo es, no lo toco.' },
        { tipo: 'cuentas', texto: `Miro la tabla: ${faltan.join('; ')}.`, ecuacion: [`${f(Nv, 0)} × ${f(m, 0)} = `, ...canonEc(fs2), ` = ${f(Nv * m, 0)}`] },
        { tipo: 'sentido', texto: 'Con un número menor, algún exponente quedaría sin llegar a su múltiplo de 3.', ecuacion: [`${f(Nv * m, 0)} = `, alK(k, 3)] },
      ],
      respuesta: `Hay que multiplicar por ${f(m, 0)}.`,
    };
  }

  // Ejemplos resueltos (idea 1). Cuentas rehechas aparte (cuentas.py, con factorizaciones y raíces enteras de Python):
  // 144 = 2⁴ × 3² = 12²; 72 = 2³ × 3²; 216 = 2³ × 3³ = 6³; 2⁴ × 5² = 400 = 20²; 108 = 2² × 3³; 50 × 2 = 100 = 10²;
  // 72 × 3 = 216 = 6³; 180 ÷ 5 = 36 = 6²; 4³ × 9 = 576 = 2⁶ × 3² = 24²; 64 = 2⁶ = 8² = 4³. Nivel 3: 540 = 2² × 3³ × 5,
  // × 15 = 8 100 = 90² (30, 5, 3 no dan cuadrado; × 540 sí, pero no es el menor); 1 350 = 2 × 3³ × 5², × 20 = 27 000 = 30³
  // (10, 4 y 50 no dan cubo; × 6 da 8 100 = 90², cuadrado); 3 600 = 2⁴ × 3² × 5²: 3 × 2 × 2 = 12 divisores cuadrados (45
  // divisores en total; 3 + 2 + 2 = 7; 2 × 1 × 1 = 2; 45 ÷ 2 ≈ 22); 75 = 3 × 5²: los que dan cuadrado son 3 × j² (3, 12, 27,
  // 48…), el menor de dos cifras es 12 (75 × 12 = 900 = 30²; × 15 y × 10 no; × 27 = 2 025 = 45² y × 48 = 3 600 = 60² sí, pero
  // son mayores); 72 = 2³ × 3², × 648 = 46 656 = 2⁶ × 3⁶ = 216² = 36³ (× 6 = 432, × 72 = 5 184 = 72², × 18 = 1 296 = 36²
  // y × 216 = 15 552 no son cuadrado y cubo a la vez).
  const tablaEj = fs => ({ pieza: TA, datos: tablaFact(fs), estado: {} });
  const EJEMPLOS_PERF = [
    { nivel: 1, titulo: '¿144 es cuadrado?',
      enunciado: '¿Es 144 un cuadrado perfecto?',
      datos: [D1.cuadrado],
      solucion: [{ texto: '144 = 2⁴ × 3², y los dos exponentes son pares: es un cuadrado perfecto.', ecuacion: [nu(144), ' = ', ...canonEc([[2, 4], [3, 2]]), ' = ', alK(12)] }],
      respuesta: ['Sí: 144 = ', alK(12)] },
    { nivel: 1, titulo: '¿72 es cuadrado?',
      enunciado: '¿Es 72 un cuadrado perfecto?',
      datos: [D1.cuadrado],
      figura: tablaEj([[2, 3], [3, 2]]),
      solucion: [{ texto: '72 = 2³ × 3²: el exponente del 2 es 3, impar. Con un solo exponente impar ya no es cuadrado.', ecuacion: [nu(72), ' = ', ...canonEc([[2, 3], [3, 2]])] }],
      respuesta: 'No: el 2 tiene exponente impar' },
    { nivel: 1, titulo: '¿216 es cubo?',
      enunciado: '¿Es 216 un cubo perfecto?',
      datos: [D1.cubo],
      solucion: [{ texto: '216 = 2³ × 3³, y los dos exponentes son múltiplos de 3: es un cubo perfecto.', ecuacion: [nu(216), ' = ', ...canonEc([[2, 3], [3, 3]]), ' = ', alK(6, 3)] }],
      respuesta: ['Sí: 216 = ', alK(6, 3)] },
    { nivel: 1, titulo: '¿De qué número es cuadrado?',
      enunciado: 'El número 2⁴ × 5² es un cuadrado perfecto. ¿De qué número es el cuadrado?',
      datos: [D1.cuadrado, 'La raíz lleva cada primo con la mitad de su exponente'],
      solucion: [{ texto: 'La raíz lleva la mitad de cada exponente: la mitad de 4 es 2 y la mitad de 2 es 1. La raíz es 2² × 5 = 20.', ecuacion: [...canonEc([[2, 4], [5, 2]]), ' = 400 = ', alK(20)] }],
      respuesta: ['Es el cuadrado de ', ra(20)] },
    { nivel: 1, titulo: '¿108 es cubo?',
      enunciado: '¿Es 108 un cubo perfecto?',
      datos: [D1.cubo],
      figura: tablaEj([[2, 2], [3, 3]]),
      solucion: [{ texto: '108 = 2² × 3³: el 3³ sirve, pero el exponente del 2 es 2, que no es múltiplo de 3.', ecuacion: [nu(108), ' = ', ...canonEc([[2, 2], [3, 3]])] }],
      respuesta: 'No: el 2 tiene exponente 2' },
    { nivel: 2, titulo: 'Completar 50',
      enunciado: '¿Por qué número mínimo hay que multiplicar 50 para obtener un cuadrado perfecto?',
      datos: [D1.cuadrado, D1.uno],
      figura: tablaEj([[2, 1], [5, 2]]),
      solucion: [
        { texto: '50 = 2 × 5²: el 2 tiene exponente 1, que es impar, y el 5 tiene exponente 2, que ya es par.', ecuacion: [nu(50), ' = ', ...canonEc([[2, 1], [5, 2]])] },
        { texto: 'Con un 2 más, los dos exponentes quedan pares.', ecuacion: ['50 × 2 = ', ...canonEc([[2, 2], [5, 2]]), ' = 100 = ', alK(10)] },
      ],
      respuesta: 'Por 2' },
    { nivel: 2, titulo: 'Completar 72 a cubo',
      enunciado: '¿Por qué número mínimo hay que multiplicar 72 para obtener un cubo perfecto?',
      datos: [D1.cubo],
      figura: tablaEj([[2, 3], [3, 2]]),
      solucion: [
        { texto: '72 = 2³ × 3²: el 2³ ya sirve; al 3² le falta un 3 para llegar a 3³.', ecuacion: [nu(72), ' = ', ...canonEc([[2, 3], [3, 2]])] },
        { texto: 'Basta un 3 más para que los dos exponentes sean múltiplos de 3.', ecuacion: ['72 × 3 = ', ...canonEc([[2, 3], [3, 3]]), ' = 216 = ', alK(6, 3)] },
      ],
      respuesta: 'Por 3' },
    { nivel: 2, titulo: 'Dividir 180',
      enunciado: '¿Entre qué número mínimo hay que dividir 180 para obtener un cuadrado perfecto?',
      datos: [D1.cuadrado, D1.uno],
      figura: tablaEj([[2, 2], [3, 2], [5, 1]]),
      solucion: [
        { texto: '180 = 2² × 3² × 5: el 5 tiene exponente 1, que es impar. Al dividir entre 5, ese primo desaparece.', ecuacion: [nu(180), ' = ', ...canonEc([[2, 2], [3, 2], [5, 1]])] },
        { texto: 'Quedan el 2² y el 3², los dos con exponente par.', ecuacion: ['180 ÷ 5 = ', ...canonEc([[2, 2], [3, 2]]), ' = 36 = ', alK(6)] },
      ],
      respuesta: 'Entre 5' },
    { nivel: 2, titulo: 'Una base que no es prima',
      enunciado: '¿Es 4³ × 9 un cuadrado perfecto? Si lo es, ¿de qué número?',
      datos: [D1.cuadrado, D1.cuenta],
      solucion: [
        { texto: 'Las bases no son primos. 4 = 2 × 2 y 9 = 3 × 3, así que 4³ = 4 × 4 × 4 lleva seis veces el 2.', ecuacion: ['4³ × 9 = ', ...canonEc([[2, 6], [3, 2]])] },
        { texto: 'Los dos exponentes son pares: la raíz lleva la mitad de cada uno, 2³ × 3 = 24.', ecuacion: [...canonEc([[2, 6], [3, 2]]), ' = 576 = ', alK(24)] },
      ],
      respuesta: ['Sí: 4³ × 9 = 576 = ', alK(24)] },
    { nivel: 2, titulo: 'Cuadrado y cubo a la vez',
      enunciado: '¿El número 64 es cuadrado perfecto, cubo perfecto o las dos cosas?',
      datos: [D1.cuadrado, D1.cubo],
      solucion: [
        { texto: '64 = 2⁶, y 6 es par y también múltiplo de 3.', ecuacion: [nu(64), ' = ', px(2, 6)] },
        { texto: 'La raíz cuadrada lleva la mitad del exponente, 3, y la raíz cúbica lleva un tercio, 2.', ecuacion: [px(2, 6), ' = ', alK(8), SEP, px(2, 6), ' = ', alK(4, 3)] },
      ],
      respuesta: ['Las dos: 64 = ', alK(8), ' = ', alK(4, 3)] },
    { nivel: 3, titulo: 'Completar 540',
      enunciado: '¿Por qué número mínimo hay que multiplicar 540 para obtener un cuadrado perfecto?',
      alternativas: ['15', '30', '5', '3', '540'],
      datos: [D1.cuadrado, D1.uno],
      solucion: [
        { texto: '540 = 2² × 3³ × 5: son impares el exponente 3 del 3 y el exponente 1 del 5. Faltan un 3 y un 5.', ecuacion: ['540 × 15 = 8 100 = ', alK(90)] },
        { texto: ['Las trampas: ', letra('B'), ' multiplica por todos los primos y le sobra el 2; ', letra('C'), ' olvida completar el 3³; ', letra('D'), ' olvida el 5; con ', letra('E'), ' sale 540², pero no es el menor.'] },
      ],
      respuesta: [letra('A'), ': 15'] },
    { nivel: 3, titulo: 'Completar 1 350 a cubo',
      enunciado: '¿Por qué número mínimo hay que multiplicar 1 350 para obtener un cubo perfecto?',
      alternativas: ['10', '20', '4', '50', '6'],
      datos: [D1.cubo, D1.uno],
      solucion: [
        { texto: '1 350 = 2 × 3³ × 5²: al 2 le faltan dos 2 y al 5², un 5. Se multiplica por 2² × 5 = 20.', ecuacion: ['1 350 × 20 = 27 000 = ', alK(30, 3)] },
        { texto: ['Las trampas: ', letra('A'), ' pone un solo 2; ', letra('C'), ' olvida el 5; ', letra('D'), ' pone dos 5; ', letra('E'), ' lo completa para cuadrado: 1 350 × 6 = 8 100 = 90².'] },
      ],
      respuesta: [letra('B'), ': 20'] },
    { nivel: 3, titulo: 'Divisores que son cuadrados',
      enunciado: '¿Cuántos divisores de 3 600 = 2⁴ × 3² × 5² son cuadrados perfectos?',
      alternativas: ['45', '7', '12', '2', '22'],
      datos: [D1.divisor, D1.cero, D1.cuadrado],
      solucion: [
        { texto: 'Un divisor cuadrado lleva exponentes pares: el 2 puede ir con 0, 2 o 4; el 3, con 0 o 2; el 5, con 0 o 2.', ecuacion: ['3 × 2 × 2 = 12'] },
        { texto: ['Las trampas: ', letra('A'), ' cuenta todos los divisores, 5 × 3 × 3; ', letra('B'), ' suma 3 + 2 + 2; ', letra('D'), ' olvida el exponente 0; ', letra('E'), ' toma la mitad de 45.'] },
      ],
      respuesta: [letra('C'), ': 12'] },
    { nivel: 3, titulo: 'El menor de dos cifras',
      enunciado: '¿Cuál es el menor número de dos cifras por el que hay que multiplicar 75 para obtener un cuadrado perfecto?',
      alternativas: ['15', '27', '10', '12', '48'],
      datos: [D1.cuadrado, D1.uno],
      solucion: [
        { texto: '75 = 3 × 5²: falta un 3. Sirve cualquier 3 por un cuadrado, porque un cuadrado solo suma exponentes pares: 3, 12, 27, 48… El primero de dos cifras es el 12, que es 3 × 2².', ecuacion: ['75 × 12 = 900 = ', alK(30)] },
        { texto: ['Las trampas: ', letra('A'), ' pone también un 5; ', letra('C'), ' es el menor de dos cifras, pero 750 no es cuadrado; ', letra('B'), ' y ', letra('E'), ' sirven, pero son mayores.'] },
      ],
      respuesta: [letra('D'), ': 12'] },
    { nivel: 3, titulo: 'Cuadrado y cubo con 72',
      enunciado: '¿Por qué número mínimo hay que multiplicar 72 para obtener un número que sea cuadrado perfecto y cubo perfecto a la vez?',
      alternativas: ['6', '72', '18', '216', '648'],
      datos: [D1.cuadrado, D1.cubo],
      solucion: [
        { texto: 'Cada exponente tiene que ser par y múltiplo de 3 a la vez, es decir, múltiplo de 6. 72 = 2³ × 3²: faltan 2³ y 3⁴.', ecuacion: ['72 × 648 = ', ...canonEc([[2, 6], [3, 6]]), ' = ', alK(216), ' = ', alK(36, 3)] },
        { texto: ['Las trampas: ', letra('A'), ' junta el 2 del cuadrado y el 3 del cubo; ', letra('B'), ' y ', letra('C'), ' dan cuadrados que no son cubos; ', letra('D'), ' suma 3 a cada exponente.'] },
      ],
      respuesta: [letra('E'), ': 648'] },
  ];

  const perfectos = {
    id: 'perfectos',
    titulo: 'Cuadrados y cubos perfectos',
    pregunta: '¿Cómo saber si un número es cuadrado perfecto sin sacar su raíz?',
    temas: ['Cuadrados y cubos perfectos'],
    pieza: CU,
    aprendizaje: 'N es cuadrado perfecto si cada exponente de su factorización es par, y cubo perfecto si es múltiplo de 3. El menor factor los completa.',
    actividad: 'Armar bandejas de caramelos eligiendo los exponentes del 2 y del 3.',
    // Lee: la bandeja cuadrada (36 = 6 × 6), el cubo de chocolate (27 = 3³), la factorización de dos números y qué mirar.
    // No dice qué exponentes dan cuadrado (eso lo descubre el juego) ni el factor que falta (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'La vitrina de doña Juana', texto: 'Doña Juana acomoda caramelos en bandejas cuadradas: 7 filas de 7 caramelos son 49. Por eso 49 es un cuadrado perfecto: 7 × 7 = 7².',
          pieza: CU, dibujo: { datos: { bandejas: [{ k: 7, rotulo: [['7 filas de 7']] }] }, estado: {} } },
        { titulo: 'Cubo perfecto', texto: 'Con cubitos de chocolate, doña Juana arma cubos macizos: 3 pisos de 3 filas de 3 cubitos suman 27. Por eso 27 es un cubo perfecto.',
          ecuacion: ['3 × 3 × 3 = 3³ = 27'] },
        { titulo: 'Partir en primos', texto: ['Todo número mayor que 1 se puede escribir como un producto de primos: esa es su factorización. El ', ex('exponente'), ' de cada primo dice cuántas veces aparece en el producto.'],
          ecuacion: ['12 = ', ...canonEc([[2, 2], [3, 1]]), SEP, '45 = ', ...canonEc([[3, 2], [5, 1]])] },
        { titulo: 'Qué mirar al jugar', texto: ['Eliges el ', ex('exponente'), ' del 2 y el del 3, y la bandeja muestra el acomodo más cuadrado en que caben todos los caramelos. Fíjate en los exponentes cada vez que la bandeja sale cuadrada.'] },
      ],
    },
    ejemplos: EJEMPLOS_PERF,
    juega: {
      pieza: CU,
      consigna: 'Doña Juana acomoda sus caramelos en filas iguales, con tantas filas como caramelos por fila si se puede: 72 van en 8 filas de 9.',
      mision: {
        // Una sola manera en la grilla: con exponentes de 1 a 4 (del 2) y de 1 a 2 (del 3), los cuadrados son 36 y 144.
        texto: 'Elige los exponentes para que salga una bandeja cuadrada de más de 50 caramelos.',
        logrado: v => v.a === 4 && v.b === 2,
        bien: '2⁴ × 3² = 144: doce filas de doce caramelos, con los dos exponentes pares.',
      },
      voz: 'Mira los exponentes cuando la bandeja sale cuadrada.',
      leyenda: [
        { s: nu('N'), t: 'los caramelos de doña Juana' },
        { s: ex('exponente'), t: 'cuántas veces está cada primo' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Exponente del 2', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'Exponente del 3', color: 'c-i', min: 1, max: 2, paso: 1, inicio: 2, unidad: '', decimales: 0 },
      ],
      dibujo: v => bandeja(2 ** v.a * 3 ** v.b, { pie: [[`${2 ** v.a * 3 ** v.b} = 2`], [sup(v.a), 'i', 700], [' × 3'], [v.b === 1 ? '' : sup(v.b), 'i', 700]] }),
      lectura: v => {
        const Nv = 2 ** v.a * 3 ** v.b, k = isqrt(Nv);
        return [nu('N'), ` = ${Nv} = `, px(2, v.a), ' × ', px(3, v.b), k * k === Nv ? ': los exponentes son pares; es ' : ': hay un exponente impar; no es cuadrado'].concat(k * k === Nv ? [alK(k)] : []);
      },
      minimo: 3,
    },
    predice: {
      pieza: TA,
      pregunta: ['¿Por qué número mínimo hay que multiplicar ', nu(600), ' para obtener un cuadrado perfecto?'],
      datos: ['600 = 2³ × 3 × 5²', D1.uno],
      voz: 'Mira el exponente de cada primo, también el que no se escribe.',
      opciones: [
        { id: 'c', texto: '6', correcta: true },
        { id: 'todos', texto: '30', error: 'AT-TODOS', siFuera: 'Con 30 entra también un 5, y el 5² ya era par: pasa a 5³. Por eso 600 × 30 = 18 000 no es cuadrado.' },
        { id: 'copia', texto: '24', error: 'AT-COPIA', siFuera: 'Con 24 sí sale un cuadrado, 14 400 = 120², pero no es el menor: 24 = 6 × 2², y ese 2² sobra.' },
        { id: 'uno', texto: '2', error: 'AT-EXP-UNO', siFuera: 'Subir el 2³ a 2⁴ está bien, pero el 3 tiene exponente 1, que es impar: 1 200 no es cuadrado.' },
      ],
      dibujo: { datos: tablaFact(F600), estado: {} },
      revelar: { datos: tablaFact(F600, { par: true, por: true }), estado: { fila: [0, 1] } },
      coincide: 'Coincide: 600 × 6 = 3 600 = 2⁴ × 3² × 5² = 60².',
      noCoincide: 'Revisemos el exponente de cada primo.',
    },
    mira: {
      pieza: TA,
      datos: tablaFact(F600, { par: true, por: true }),
      voz: 'Mira cada exponente, uno por uno.',
      pasos: [
        { estado: { fila: 0 }, texto: 'El 2 tiene exponente 3, que es impar: hace falta un 2 más para llegar a 2⁴.', ecuacion: [nu(600), ' = ', ...canonEc(F600)] },
        { estado: { fila: 1 }, texto: 'El 3 no lleva exponente escrito, así que su exponente es 1, también impar: hace falta otro 3.', ecuacion: ['3 = 3', ex('¹')] },
        { estado: { fila: 2 }, texto: 'El 5 tiene exponente 2, que ya es par: no hace falta agregar ningún 5.', ecuacion: [px(5, 2), ' = 5 × 5'] },
        { estado: { fila: [0, 1] }, texto: 'Con un 2 y un 3 más, todos los exponentes quedan pares: el menor número es 2 × 3.', ecuacion: ['600 × 6 = ', ...canonEc([[2, 4], [3, 2], [5, 2]]), ' = ', alK(60)] },
      ],
    },
    regla: {
      texto: 'Un número es cuadrado perfecto si cada exponente de su factorización en primos es par, y cubo perfecto si cada uno es múltiplo de 3. Al multiplicar se completan los exponentes; al dividir, se quita lo que sobra.',
      ecuacion: [{ llave: ['600 × 6 = ', ...canonEc([[2, 4], [3, 2], [5, 2]])], nota: 'todos pares' }, SEP, { par: canonEc([[2, 2], [3, 1], [5, 1]]) }, '² = ', { llave: [alK(60)], nota: 'la raíz' }],
      condicion: 'se mira la factorización completa, con todos sus primos: un primo sin exponente escrito tiene exponente 1.',
      voz: 'Un solo exponente impar basta para que no sea cuadrado.',
      dibujo: { pieza: TA, datos: tablaFact(F600, { par: true, por: true }), estado: { fila: [0, 1] } },
    },
    // Así se resuelve: el menor multiplicador para un cubo (con el 5). «Ahora tú» pide cuál es cuadrado, el multiplicador
    // para cuadrado y para cubo (con el 7), el menor divisor para cubo y cuántos divisores son cuadrados.
    resuelve: { pieza: TA, generar: resuelveCubo },
    ahoraTu: {
      voz: 'Parte en primos y mira cada exponente.',
      generar(sem) {
        const r = azar(sem + 41), tipo = sem % 5;
        const casos = [casoCualCuadrado, function multCuadrado(x) { return casoMultiplica(x, 2); }, function multCubo(x) { return casoMultiplica(x, 3); }, casoDivide, casoDivisoresCuadrados];
        return conCuatro(casos[tipo], r);
      },
    },
  };


  // ---------- Idea 2 (rehecha, 26 nov): criterios que descartan cuadrados ----------
  // Propuesta §1 a §7. Conserva el id `exclusion`, con otra Predice (la de antes preguntaba lo mismo con otras opciones).
  // Objeto: la calculadora de doña Juana en «Lee» (13 × 13 y 23 × 23) y, en el juego, la tabla de las cifras finales,
  // que solo llena la fila de la k elegida (antes mostraba las diez filas llenas al abrir). Cambia: k (decena y cifra
  // final). · Permanece: la tabla de las diez cifras finales. · Progresa: las cifras finales que salen → las que nunca
  // salen (2, 3, 7, 8). · Se reserva: 2 021, que termina en 1 y no es cuadrado (la predicción; el juego va de 10 a 99).
  // · Debe verse: la cifra final de k² solo depende de la cifra final de k.
  // Errores: H-TERM (hipótesis de la investigación previa) cree que terminar bien basta · AT-IMPAR cree que ningún
  // cuadrado es impar · AT-POCOS-CASOS generaliza de pocos casos · E-MUL multiplica la cifra por el exponente
  // (documentado: Martínez Lobo, 2010) · E-SUM suma la cifra y el exponente (documentado, misma fuente) · AT-MISMA cree que
  // la cifra no cambia · AT-DECENA toma la cifra de las decenas de d × d · AT-DESCARTA-MAL descarta un cuadrado ·
  // AT-NO-PASA elige uno que ni siquiera pasa el criterio.
  const D2 = {
    final: 'La cifra final de k² es la cifra final de d × d, donde d es la cifra final de k',
    nunca: 'Ningún cuadrado perfecto termina en 2, 3, 7 u 8',
    ceros: 'Si un cuadrado termina en ceros, tiene una cantidad par de ceros',
    cinco: 'Si un cuadrado termina en 5, termina en 25',
    entre: 'Un número que queda entre dos cuadrados seguidos no es un cuadrado perfecto',
    cubo: 'Un cubo k³ termina en la cifra final de d × d × d, donde d es la cifra final de k',
  };
  const USADOS2 = new Set([2021, 3487, 6889, 4900, 25000, 1375, 2116, 2024, 4225, 2225, 7569, 2890, 5776, 2501]);
  // La tabla de las cifras finales: k termina en d (violeta, como la raíz) → k² termina en (naranja, como el número).
  // Con `solo`, solo esa fila trae su cifra (el juego); sin él, todas (Mira y la regla).
  const tablaCifras = (solo = null) => ({
    columnas: [{ t: 'k termina en', color: 'f' }, { t: 'k² termina en', color: 'o' }],
    filas: Array.from({ length: 10 }, (_, d) => [{ t: String(d), color: 'f' }, solo === null || solo === d ? { t: String((d * d) % 10), color: 'o' } : '']),
    filasMax: 10,
  });
  const fin = n => n % 10;
  const ceros = n => { let c = 0; while (n > 0 && n % 10 === 0) { n /= 10; c++; } return c; };
  // Pasa los criterios: cifra final 0, 1, 4, 5, 6 o 9; ceros en cantidad par; si termina en 5, en 25.
  const pasa = n => { const c = ceros(n), m = n / 10 ** c; return c % 2 === 0 && [1, 4, 5, 6, 9].includes(m % 10) && (m % 10 !== 5 || m % 100 === 25); };
  const porque = n => { const c = ceros(n), m = n / 10 ** c;
    if (c % 2) return `termina en ${c === 1 ? 'un solo cero' : c === 3 ? 'tres ceros' : plural(c, 'cero', 'ceros')}, una cantidad impar`;
    if (m % 10 === 5) return `termina en ${m % 100 < 10 ? '0' : ''}${m % 100}, no en 25`;
    return `termina en ${m % 10}`; };
  const esCuad = n => isqrt(n) ** 2 === n;
  const ent = n => f(n, 0);

  // Ahora tú · tipo 0: cuál no puede ser cuadrado (las otras tres son cuadrados de verdad).
  function casoNoPuede(r) {
    const modo = r.ent(0, 2);
    let mal;
    if (modo === 0) mal = r.ent(100, 999) * 10 + r.de([2, 3, 7, 8]);
    else if (modo === 1) mal = r.ent(11, 99) * r.de([10, 1000]);
    else mal = r.ent(10, 99) * 100 + r.de([15, 35, 45, 55, 65, 75, 85, 95]);
    // Con ceros, uno o tres: con dos o cuatro (20 000) se descarta por algo que el criterio no dice.
    if (pasa(mal) || USADOS2.has(mal) || (modo === 1 && ceros(mal) % 2 === 0)) return null;
    const ks = new Set(); while (ks.size < 3) ks.add(r.ent(32, 99));
    const cs = [...ks].map(k => k * k);
    if (cs.some(c => USADOS2.has(c))) return null;
    return {
      pregunta: '¿Cuál de estos números no puede ser un cuadrado perfecto?',
      datos: [D2.nunca, D2.ceros, D2.cinco],
      opciones: opciones(mal, cs.map((c, i) => ({ id: `c${i}`, valor: c, error: 'AT-DESCARTA-MAL', siFuera: `${ent(c)} sí es cuadrado: ${[...ks][i]}² = ${ent(c)}.` })), ent),
      solucion: { texto: `${ent(mal)} ${porque(mal)}: ningún cuadrado termina así.`, ecuacion: [nu(ent(mal)), ' no es cuadrado'] },
    };
  }
  // Ahora tú · tipo 1: en qué cifra termina el cuadrado de un número que termina en d.
  function casoCifraFinal(r) {
    const d = r.ent(2, 9), k = r.ent(1, 9) * 10 + d, c = (d * d) % 10;
    return {
      pregunta: ['Un número termina en ', ra(d), '. ¿En qué cifra termina su cuadrado?'],
      datos: [D2.final],
      opciones: opciones(c, [
        { id: 'misma', valor: d, error: 'AT-MISMA', siFuera: `Al elevar, la cifra final cambia: ${d} × ${d} = ${d * d}, termina en ${c}.` },
        { id: 'mul', valor: (2 * d) % 10, error: 'E-MUL', siFuera: `Eso es ${d} × 2. Elevar al cuadrado es ${d} × ${d} = ${d * d}.` },
        { id: 'sum', valor: (d + 2) % 10, error: 'E-SUM', siFuera: `Eso es ${d} + 2. Elevar al cuadrado es ${d} × ${d} = ${d * d}.` },
        { id: 'decena', valor: Math.floor(d * d / 10), error: 'AT-DECENA', siFuera: `${d} × ${d} = ${d * d}: esa es la cifra de las decenas; la final es ${c}.` },
      ]),
      solucion: { texto: `Solo importa la cifra final del número: ${d} × ${d} = ${d * d} termina en ${c}. Por ejemplo, ${k}² = ${ent(k * k)}.`, ecuacion: [`${d} × ${d} = ${d * d}`] },
    };
  }
  // Ahora tú · tipo 2 (examen; San Marcos 2023-I y 2026-I): la cifra tapada de un cuadrado de cuatro cifras, con una sola
  // cifra posible (comprobado aquí mismo, probando las diez).
  function casoOculta(r) {
    const k = r.ent(32, 99), N = k * k, s = String(N), i = r.ent(1, 2);
    if (USADOS2.has(N)) return null;
    const vale = d => esCuad(Number(s.slice(0, i) + d + s.slice(i + 1)));
    if ([...Array(10).keys()].filter(vale).length !== 1) return null;
    const tapado = s.slice(0, i) + '☐' + s.slice(i + 1), bien = Number(s[i]);
    const otros = [...Array(10).keys()].filter(d => d !== bien && (i > 0 || d > 0));
    const ds = []; while (ds.length < 3) { const d = r.de(otros); if (!ds.includes(d)) ds.push(d); }
    const con = d => Number(s.slice(0, i) + d + s.slice(i + 1));
    return {
      pregunta: `El número ${tapado} es un cuadrado perfecto. ¿Qué cifra va en ☐?`,
      datos: [D2.final, D2.entre],
      opciones: opciones(bien, ds.map(d => { const X = con(d), a = isqrt(X);
        return { id: `d${d}`, valor: d, error: 'H-TERM', siFuera: `Con ${d} queda ${ent(X)}: termina bien, pero está entre ${a}² = ${ent(a * a)} y ${a + 1}² = ${ent((a + 1) ** 2)}.` }; })),
      solucion: { texto: `Con ${bien} queda ${ent(N)}, que es ${k} × ${k}; con las otras cifras, el número queda entre dos cuadrados seguidos.`, ecuacion: [nu(ent(N)), ' = ', alK(k)] },
    };
  }
  // Ahora tú · tipo 3: cuál pasa el criterio de la cifra final y no es cuadrado.
  function casoPasaNoEs(r) {
    let x; do { x = r.ent(100, 999) * 10 + r.de([1, 4, 6, 9]); } while (esCuad(x) || USADOS2.has(x));
    const k1 = r.ent(32, 70), k2 = r.ent(71, 99), malo = r.ent(100, 999) * 10 + r.de([2, 3, 7, 8]);
    const a = isqrt(x);
    return {
      pregunta: '¿Cuál de estos números pasa el criterio de la cifra final, pero no es un cuadrado perfecto?',
      datos: [D2.nunca, D2.entre],
      opciones: opciones(x, [
        { id: 'c1', valor: k1 * k1, error: 'AT-DESCARTA-MAL', siFuera: `Pasa el criterio, pero sí es cuadrado: ${k1}² = ${ent(k1 * k1)}.` },
        { id: 'c2', valor: k2 * k2, error: 'AT-DESCARTA-MAL', siFuera: `Pasa el criterio, pero sí es cuadrado: ${k2}² = ${ent(k2 * k2)}.` },
        { id: 'malo', valor: malo, error: 'AT-NO-PASA', siFuera: `Es cierto que no es cuadrado, pero termina en ${fin(malo)}: ni siquiera pasa el criterio.` },
      ], ent),
      solucion: { texto: `${ent(x)} termina en ${fin(x)} y pasa el criterio, pero queda entre dos cuadrados seguidos: no es cuadrado.`, ecuacion: [`${a}² = ${ent(a * a)} < ${ent(x)} < ${ent((a + 1) ** 2)} = ${a + 1}²`] },
    };
  }
  // Así se resuelve (idea 2): de tres números, cuáles se descartan sin sacar raíces (uno por la cifra final, otro por los
  // ceros; el tercero pasa y se comprueba).
  function resuelveDescartar(s) {
    const r = azar(s + 900);
    for (;;) {
      const a = r.ent(100, 999) * 10 + r.de([2, 3, 7, 8]), b = r.ent(11, 99) * 1000, k = r.ent(32, 99), c = k * k;
      if (pasa(b) || b % 10000 === 0 || USADOS2.has(c)) continue;
      const lista = [a, b, c].sort(() => r() - 0.5);
      return {
        enunciado: `Sin sacar raíces, ¿cuáles de estos números no pueden ser cuadrados perfectos: ${lista.map(ent).join(', ').replace(/, ([^,]*)$/, ' y $1')}?`,
        datos: [D2.nunca, D2.ceros, D2.cinco],
        pasos: [
          { tipo: 'pide', texto: 'Piden cuáles se descartan con solo mirar cómo terminan.' },
          { tipo: 'datos', texto: `${ent(a)} termina en ${fin(a)}; ${ent(b)} termina en tres ceros; ${ent(c)} termina en ${fin(c)}.` },
          { tipo: 'regla', texto: 'Un cuadrado no termina en 2, 3, 7 u 8, y sus ceros finales van de dos en dos. Pasar el criterio no prueba que el número sea cuadrado.' },
          { tipo: 'cuentas', texto: `Descarto ${ent(a)}, que termina en ${fin(a)}, y ${ent(b)}, que tiene tres ceros. ${ent(c)} pasa el criterio, así que hay que comprobarlo con una cuenta.`, ecuacion: [nu(ent(c)), ' = ', alK(k)] },
          { tipo: 'sentido', texto: `${ent(c)} sí resultó cuadrado, pero eso lo probó la cuenta, no el criterio.` },
        ],
        respuesta: `${ent(a)} y ${ent(b)}`,
      };
    }
  }

  // Ejemplos resueltos (idea 2). Cuentas rehechas aparte (cuentas.py): 83² = 6 889; 70² = 4 900; 46² = 2 116; 44² = 1 936
  // < 2 024 < 2 025 = 45²; 65² = 4 225; 47² = 2 209 < 2 225 < 2 304 = 48²; 3³ = 27; 7569 = 87² y es la única cifra que
  // sirve en 7☐69 (7 169, 7 369, 7 769 y 7 969 quedan entre dos cuadrados); 35² = 1 225, 64² = 4 096, 80² = 6 400,
  // 99² = 9 801; 1 024 (6 = cifra 4), 2 025, 3 026 pasan y 4 027, 5 028 no; 74² = 5 476, 76² = 5 776; 41² = 1 681,
  // 49² = 2 401, 46² = 2 116, 56² = 3 136, 50² = 2 500 < 2 501 < 2 601 = 51².
  const EJEMPLOS_EXCL = [
    { nivel: 1, titulo: '¿Puede 3 487 ser cuadrado?',
      enunciado: '¿Puede 3 487 ser un cuadrado perfecto?',
      datos: [D2.nunca],
      solucion: [{ texto: '3 487 termina en 7, y ningún cuadrado termina en 7. Se descarta sin hacer más cuentas.' }],
      respuesta: 'No: termina en 7' },
    { nivel: 1, titulo: 'La cifra final de 83²',
      enunciado: '¿En qué cifra termina 83²?',
      datos: [D2.final],
      solucion: [{ texto: '83 termina en 3, y 3 × 3 = 9.', ecuacion: ['3 × 3 = 9', SEP, '83² = 6 889'] }],
      respuesta: ['Termina en ', nu(9)] },
    { nivel: 1, titulo: 'Dos ceros al final',
      enunciado: '¿Puede 4 900 ser un cuadrado perfecto?',
      datos: [D2.ceros],
      solucion: [{ texto: 'Termina en dos ceros, una cantidad par, así que pasa el criterio. Para confirmarlo hay que comprobar: 4 900 = 49 × 100, y 49 = 7² y 100 = 10².', ecuacion: ['4 900 = 49 × 100 = ', alK(70)] }],
      respuesta: ['Sí: 4 900 = ', alK(70)] },
    { nivel: 1, titulo: 'Tres ceros al final',
      enunciado: '¿Puede 25 000 ser un cuadrado perfecto?',
      datos: [D2.ceros],
      solucion: [{ texto: 'Termina en tres ceros, una cantidad impar: se descarta.' }],
      respuesta: 'No: tiene tres ceros' },
    { nivel: 1, titulo: 'Termina en 5',
      enunciado: '¿Puede 1 375 ser un cuadrado perfecto?',
      datos: [D2.cinco],
      solucion: [{ texto: 'Termina en 5, pero en 75 y no en 25: se descarta.' }],
      respuesta: 'No: termina en 75' },
    { nivel: 2, titulo: 'Pasa el criterio: ¿y ahora?',
      enunciado: '2 116 termina en 6. ¿Es un cuadrado perfecto?',
      datos: [D2.nunca, D2.final],
      solucion: [
        { texto: 'Termina en 6, así que pasa el criterio, pero eso no basta: hay que comprobar con una cuenta.' },
        { texto: '40² = 1 600 y 50² = 2 500: la raíz estaría entre 40 y 50 y terminaría en 4 o en 6. 46 × 46 = 2 116.', ecuacion: ['2 116 = ', alK(46)] },
      ],
      respuesta: ['Sí: 2 116 = ', alK(46)] },
    { nivel: 2, titulo: '¿Es 2 024 cuadrado?',
      enunciado: '2 024 termina en 4. ¿Es un cuadrado perfecto?',
      datos: [D2.nunca, D2.entre],
      solucion: [
        { texto: 'Termina en 4 y pasa el criterio, así que hay que buscar entre qué cuadrados queda.' },
        { texto: '44² = 1 936 y 45² = 2 025: 2 024 queda entre los dos, y entre 44 y 45 no hay otro entero.', ecuacion: ['44² = 1 936 < 2 024 < 2 025 = 45²'] },
      ],
      respuesta: 'No: queda entre 44² y 45²' },
    { nivel: 2, titulo: 'Al revés: de k² a k',
      enunciado: 'El cuadrado de un número k termina en 9. ¿En qué cifra puede terminar k?',
      datos: [D2.final],
      solucion: [
        { texto: 'Se prueban las diez cifras finales: solo 3 × 3 = 9 y 7 × 7 = 49 terminan en 9.', ecuacion: ['3 × 3 = 9', SEP, '7 × 7 = 49'] },
      ],
      respuesta: ['En ', ra(3), ' o en ', ra(7)] },
    { nivel: 2, titulo: 'Los cubos no se descartan',
      enunciado: '¿Puede un cubo perfecto terminar en 7?',
      datos: [D2.cubo],
      solucion: [
        { texto: 'Para los cubos se mira d × d × d. Con d = 3: 3 × 3 × 3 = 27, termina en 7.', ecuacion: ['3³ = 27', SEP, '13³ = 2 197'] },
        { texto: 'El criterio de los cuadrados no sirve para cubos: un cubo puede terminar en cualquier cifra.' },
      ],
      respuesta: 'Sí: 3³ = 27 termina en 7' },
    { nivel: 2, titulo: 'Dos que terminan en 25',
      enunciado: '4 225 y 2 225 terminan en 25. ¿Cuál es un cuadrado perfecto?',
      datos: [D2.cinco, D2.entre],
      solucion: [
        { texto: 'Los dos pasan el criterio. Como terminan en 25, su raíz terminaría en 5: para 4 225 se prueba 65, y sí da.', ecuacion: ['65² = 4 225'] },
        { texto: 'Para 2 225 no hay raíz que sirva: 47² = 2 209 y 48² = 2 304, y 2 225 queda entre los dos.', ecuacion: ['47² = 2 209 < 2 225 < 2 304 = 48²'] },
      ],
      respuesta: ['4 225 = ', alK(65)] },
    { nivel: 3, titulo: 'La cifra tapada',
      enunciado: 'El número 7☐69 es un cuadrado perfecto. ¿Qué cifra va en ☐?',
      alternativas: ['5', '3', '7', '1', '9'],
      datos: [D2.final, D2.entre],
      solucion: [
        { texto: '7☐69 está entre 7 000 y 8 000, y 83² = 6 889 y 90² = 8 100: la raíz va de 84 a 89. Como termina en 3 o en 7, es 87.', ecuacion: ['7 569 = ', alK(87)] },
        { texto: ['Las trampas ', letra('B'), ', ', letra('C'), ', ', letra('D'), ' y ', letra('E'), ' también terminan en 9, pero cada una queda entre dos cuadrados seguidos, como 85² < 7 369 < 86².'] },
      ],
      respuesta: [letra('A'), ': 5'] },
    { nivel: 3, titulo: 'El que no puede ser',
      enunciado: '¿Cuál de estos números no puede ser un cuadrado perfecto?',
      alternativas: ['1 225', '4 096', '6 400', '2 890', '9 801'],
      datos: [D2.nunca, D2.ceros, D2.cinco],
      solucion: [
        { texto: '2 890 termina en un solo cero, que es una cantidad impar: se descarta.' },
        { texto: ['Los demás sí son cuadrados: ', letra('A'), ' es 35²; ', letra('B'), ', 64²; ', letra('C'), ', 80²; ', letra('E'), ', 99².'] },
      ],
      respuesta: [letra('D'), ': 2 890'] },
    { nivel: 3, titulo: 'Cuántos pasan',
      enunciado: '¿Cuántos de estos números pasan el criterio de la cifra final: 1 024, 2 025, 3 026, 4 027 y 5 028?',
      alternativas: ['5', '2', '3', '1', '4'],
      datos: [D2.nunca, D2.cinco],
      solucion: [
        { texto: '1 024 termina en 4, 2 025 en 25 y 3 026 en 6, así que pasan. 4 027 y 5 028 terminan en 7 y en 8: no pasan.' },
        { texto: ['Las trampas: ', letra('A'), ' deja pasar todo; ', letra('B'), ' saca el 3 026; ', letra('D'), ' cuenta solo el 1 024; ', letra('E'), ' deja pasar el 4 027 o el 5 028.'] },
      ],
      respuesta: [letra('C'), ': 3'] },
    { nivel: 3, titulo: 'De k² a k',
      enunciado: 'Si k² = 5 776 y k es un número de dos cifras, ¿cuánto vale k?',
      alternativas: ['74', '76', '86', '66', '84'],
      datos: [D2.final],
      solucion: [
        { texto: '70² = 4 900 y 80² = 6 400, así que k está entre 70 y 80. Como 5 776 termina en 6, k termina en 4 o en 6.', ecuacion: ['74² = 5 476', SEP, '76² = 5 776'] },
        { texto: ['Las trampas: ', letra('A'), ' da 5 476; ', letra('C'), ', ', letra('D'), ' y ', letra('E'), ' terminan bien, pero están fuera del tramo de 70 a 80.'] },
      ],
      respuesta: [letra('B'), ': ', ra(76)] },
    { nivel: 3, titulo: 'Termina bien y no es',
      enunciado: '¿Cuál de estos números pasa el criterio de la cifra final, pero no es un cuadrado perfecto?',
      alternativas: ['1 681', '2 401', '2 116', '3 136', '2 501'],
      datos: [D2.nunca, D2.entre],
      solucion: [
        { texto: '2 501 termina en 1 y pasa el criterio, pero 50² = 2 500 y 51² = 2 601: queda entre los dos.', ecuacion: ['50² = 2 500 < 2 501 < 2 601 = 51²'] },
        { texto: ['Los demás sí son cuadrados: ', letra('A'), ' es 41²; ', letra('B'), ', 49²; ', letra('C'), ', 46²; ', letra('D'), ', 56².'] },
      ],
      respuesta: [letra('E'), ': 2 501'] },
  ];

  const exclusion = {
    id: 'exclusion',
    titulo: 'Criterios para descartar cuadrados',
    pregunta: '¿Qué cifras finales delatan que un número no es un cuadrado?',
    temas: ['Criterios de inclusión y exclusión'],
    pieza: TA,
    aprendizaje: 'Un cuadrado perfecto nunca termina en 2, 3, 7 u 8 ni en una cantidad impar de ceros. Cumplir el criterio no basta: solo descarta.',
    actividad: 'Elevar números al cuadrado y anotar en qué cifra termina cada uno.',
    // Lee: la calculadora (13 × 13 y 23 × 23 terminan igual), qué es un criterio de exclusión y qué mirar. No dice qué
    // cifras no salen (eso lo descubre el juego) ni si pasar el criterio confirma (la predicción).
    lee: {
      tarjetas: [
        { titulo: 'La calculadora de doña Juana', texto: 'Doña Juana eleva números al cuadrado en su calculadora. 13 × 13 da 169 y 23 × 23 da 529: los dos terminan en 9, como 3 × 3.',
          pieza: CA, dibujo: { datos: { casillas: 8, calcs: [{ cuenta: '13 × 13', pantalla: '169', color: false }, { cuenta: '23 × 23', pantalla: '529', color: false }] }, estado: {} } },
        { titulo: 'Una prueba rápida', texto: 'Un criterio de exclusión es una prueba rápida: mira un rasgo del número, como su cifra final, y descarta sin sacar ninguna raíz a los que no pueden ser cuadrados perfectos.' },
        { titulo: 'Qué mirar al jugar', texto: ['Eliges un número ', ra('k'), ' de dos cifras, y la tabla anota en qué cifra termina su cuadrado. Recorre las diez cifras finales de k y fíjate cuáles no salen nunca en la columna de k².'] },
      ],
    },
    ejemplos: EJEMPLOS_EXCL,
    juega: {
      pieza: TA,
      consigna: 'Doña Juana eleva números de dos cifras al cuadrado y anota solo la cifra final.',
      mision: {
        // Una sola manera: de las diez cifras finales, solo 4 y 6 dan un cuadrado que termina en 6.
        texto: 'Busca una cifra final de k, distinta de 4, que haga terminar k² en 6.',
        logrado: v => v.u === 6,
        bien: 'Con 6 también: 6 × 6 = 36. Solo manda la cifra final de k.',
      },
      voz: 'Recorre las diez cifras finales antes de concluir.',
      leyenda: [
        { s: ra('k'), t: 'el número que se eleva al cuadrado' },
        { s: nu('k²'), t: 'su cuadrado, k × k' },
      ],
      controles: [
        { id: 'dec', etiqueta: 'Decena de k', color: 'c-f', min: 1, max: 9, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'u', etiqueta: 'Cifra final de k', color: 'c-f', min: 0, max: 9, paso: 1, inicio: 7, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaCifras(v.u), estado: { fila: v.u } }),
      lectura: v => { const k = 10 * v.dec + v.u; return [ra(k), '² = ', nu(ent(k * k)), `: termina en ${(k * k) % 10}, como ${v.u} × ${v.u} = ${v.u * v.u}`]; },
      minimo: 4,
    },
    predice: {
      pieza: CA,
      pregunta: 'Doña Juana dice: «2 021 termina en 1, como 81 y 121, que son cuadrados perfectos. Entonces 2 021 también lo es». ¿Tiene razón?',
      datos: ['44 × 44 = 1 936', '45 × 45 = 2 025'],
      voz: 'Que termine en 1, ¿alcanza?',
      opciones: [
        { id: 'c', texto: 'No: queda entre dos cuadrados seguidos', correcta: true },
        { id: 'si', texto: 'Sí: todo número que termina en 1 es cuadrado', error: 'H-TERM', siFuera: 'Terminar en 1 no basta: 2 021 queda entre 44² = 1 936 y 45² = 2 025.' },
        { id: 'impar', texto: 'No: ningún cuadrado perfecto es impar', error: 'AT-IMPAR', siFuera: 'Hay cuadrados impares, como 81 y 121. La razón es otra: 2 021 queda entre 44² y 45².' },
        { id: 'pocos', texto: 'No: los cuadrados solo terminan en 0, 4 o 9', error: 'AT-POCOS-CASOS', siFuera: 'También terminan en 1, 5 y 6, como 81, 25 y 36. 2 021 no es cuadrado por otra razón.' },
      ],
      dibujo: { datos: { casillas: 8, calcs: [{ cuenta: '44 × 44', pantalla: '1936', color: false }, { cuenta: '45 × 45', pantalla: '2025', color: false }] }, estado: {} },
      revelar: { pieza: TA, datos: { columnas: [{ t: 'k', color: 'f' }, { t: 'k²', color: 'o' }], filas: [[{ t: '44', color: 'f' }, { t: '1 936', color: 'o' }], ['?', { t: '2 021', color: 'o', resalta: true }], [{ t: '45', color: 'f' }, { t: '2 025', color: 'o' }]], filasMax: 3 }, estado: {} },
      coincide: 'Coincide: 44² = 1 936 < 2 021 < 2 025 = 45², y entre 44 y 45 no hay otro entero.',
      noCoincide: 'Revisemos qué dice la cifra final y qué no.',
    },
    mira: {
      pieza: TA,
      datos: tablaCifras(),
      voz: 'Mira la columna de la derecha completa.',
      pasos: [
        { estado: {}, texto: 'La cifra final de k² solo depende de la cifra final de k.', ecuacion: ['13² = 169', SEP, '23² = 529'] },
        { estado: {}, texto: 'En la columna de k² nunca sale 2, 3, 7 ni 8.', ecuacion: ['termina en 2, 3, 7 u 8   ⇒   no es cuadrado'] },
        { estado: { fila: 0 }, texto: 'Si un cuadrado termina en ceros, los ceros van de dos en dos: cada cero de k da dos en k².', ecuacion: ['30² = 900', SEP, '300² = 90 000'] },
        { estado: { fila: 5 }, texto: 'Si k termina en 5, su cuadrado termina en 25.', ecuacion: ['15² = 225', SEP, '35² = 1 225'] },
        { estado: { fila: [1, 9] }, texto: 'Terminar bien no basta: 2 021 pasa el criterio y aun así no es cuadrado.', ecuacion: ['44² = 1 936 < 2 021 < 2 025 = 45²'] },
      ],
    },
    regla: {
      texto: 'Un cuadrado perfecto nunca termina en 2, 3, 7 u 8 ni en una cantidad impar de ceros, y si termina en 5, termina en 25. Un número que cumple todo esto todavía puede no ser cuadrado.',
      ecuacion: [{ llave: ['termina en 2, 3, 7 u 8'], nota: 'falla el criterio' }, '\u00a0\u00a0⇒\u00a0se\u00a0descarta'],
      condicion: 'se usa para descartar: terminar bien es una condición necesaria, pero no suficiente. No sirve para cubos, que pueden terminar en cualquier cifra.',
      voz: 'El criterio descarta; para confirmar hay que comprobar.',
      dibujo: { pieza: TA, datos: tablaCifras(), estado: {} },
    },
    // Así se resuelve: de tres números, cuáles se descartan. «Ahora tú» pide cuál no puede ser, la cifra final de un
    // cuadrado, la cifra tapada (examen) y uno que pasa el criterio sin ser cuadrado.
    resuelve: { generar: resuelveDescartar },
    ahoraTu: {
      voz: 'Mira cómo termina; si pasa, todavía hay que comprobar.',
      generar(sem) {
        const r = azar(sem + 41);
        return conCuatro([casoNoPuede, casoCifraFinal, casoOculta, casoPasaNoEs][sem % 4], r);
      },
    },
  };


  // ---------- Idea 3 (rehecha, 26 nov): raíz cuadrada entera, residuo y residuo por exceso ----------
  // Propuesta §1 a §7. Conserva el id `raiz-entera`, con otra Predice. Objeto: la bandeja cuadrada de doña Juana
  // (arit-cuadrado): la mayor bandeja que se arma con N caramelos, los que sobran en el borde de la siguiente y los lugares
  // que faltan, punteados. Cambia: N. · Permanece: la bandeja k × k y el borde de la siguiente. · Progresa: sobran pocos →
  // el borde casi lleno, con solo la esquina vacía. · Se reserva: el mayor residuo con k = 9 (la predicción; el juego llega a
  // N = 60, k = 7). · Debe verse: sobra lo que no completa el borde, y el borde tiene 2k + 1 lugares.
  // Errores (hipótesis de aula): AT-MAS-UNO cree que pueden sobrar 2k + 1 · AT-UNA-FILA cuenta una sola fila nueva ·
  // AT-ESQUINA cuenta dos veces la esquina · AT-CAMBIA da lo que falta por lo que sobra · AT-EXCESO toma la raíz por exceso ·
  // E-MUL (documentado, Martínez Lobo, 2010) eleva multiplicando por 2 · AT-RESTA resta el residuo · AT-SIN-RESIDUO olvida
  // el residuo · AT-SUMA suma los dos residuos · AT-MITAD parte r + rₑ en dos · AT-BORDE-4K cuenta cuatro lados enteros.
  const D3 = {
    raiz: 'Raíz entera: el mayor entero k con k² ≤ N',
    residuo: 'Residuo: r = N − k²',
    exceso: 'rₑ = (k + 1)² − N: el residuo por exceso, lo que falta',
    suma: 'Si la raíz no es exacta, r + rₑ = 2k + 1',
    maximo: 'El residuo es a lo más 2k',
  };
  const USADOS3 = new Set([50, 90, 30, 80, 107, 300, 164, 130, 500, 575, 139, 184, 440, 2000]);
  const sobra = (Nv, o = {}) => {
    const k = isqrt(Nv), r = Nv - k * k;
    return { pieza: CU, datos: Object.assign({ bandejas: [Object.assign({ k, sobran: r, siguiente: true },
      o.pie === false ? {} : { pie: [['k = '], [String(k), 'f', 700], ['; r = '], [String(r), 'h', 700], ['; rₑ = '], [String(2 * k + 1 - r), null, 700]] })], alto: o.alto || 240 }, o.mudo ? { mudo: true } : {}), estado: {} };
  };
  // Ahora tú · tipo 0: raíz entera y residuo de un N de tres cifras.
  function casoRaizResiduo(r) {
    const N = r.ent(110, 990), k = isqrt(N), rr = N - k * k, re_ = (k + 1) ** 2 - N;
    if (rr === 0 || USADOS3.has(N) || N - 2 * k < 0) return null;
    const t = (a, b) => `k = ${a}, r = ${b}`;
    return {
      pregunta: ['¿Cuál es la raíz cuadrada entera de ', nu(N), ' y cuánto sobra?'],
      datos: [D3.raiz, D3.residuo],
      opciones: opciones(t(k, rr), [
        { id: 'exceso', valor: t(k + 1, re_), error: 'AT-EXCESO', siFuera: `${k + 1}² = ${ent((k + 1) ** 2)} ya pasa de ${ent(N)}: esa es la raíz por exceso.` },
        { id: 'cambia', valor: t(k, re_), error: 'AT-CAMBIA', siFuera: `k = ${k} está bien, pero ${re_} es lo que falta para ${k + 1}²; sobran ${ent(N)} − ${ent(k * k)} = ${rr}.` },
        { id: 'mul', valor: t(k, N - 2 * k), error: 'E-MUL', siFuera: `k = ${k} está bien, pero ${k}² es ${k} × ${k} = ${ent(k * k)}, no ${k} × 2.` },
      ]),
      solucion: { texto: `${k}² cabe en ${ent(N)} y ${k + 1}² ya se pasa: la raíz entera es ${k}, y sobra lo que queda.`, ecuacion: [`${k}² = ${ent(k * k)} ≤ ${ent(N)} < ${ent((k + 1) ** 2)} = ${k + 1}²`, SEP, `r = ${ent(N)} − ${ent(k * k)} = ${rr}`] },
    };
  }
  // Ahora tú · tipo 1: cuántos faltan para el cuadrado siguiente.
  function casoFaltan(r) {
    const N = r.ent(60, 700), k = isqrt(N), rr = N - k * k, re_ = (k + 1) ** 2 - N;
    if (rr === 0 || USADOS3.has(N)) return null;
    return {
      pregunta: ['Doña Juana tiene ', nu(N), ' caramelos y arma la mayor bandeja cuadrada. ¿Cuántos caramelos le faltan para armar la siguiente?'],
      datos: [D3.raiz, D3.exceso],
      opciones: opciones(re_, [
        { id: 'sobran', valor: rr, error: 'AT-CAMBIA', siFuera: `${rr} son los que sobran sobre ${k}² = ${ent(k * k)}. Lo que falta es lo que le queda a ${ent(N)} para llegar a ${ent((k + 1) ** 2)}.` },
        { id: 'borde', valor: 2 * k + 1, error: 'AT-BORDE', siFuera: `${2 * k + 1} es todo el borde de la bandeja siguiente, pero ya hay ${rr} caramelos puestos en él.` },
        { id: 'cuadrado', valor: (k + 1) ** 2, error: 'AT-DA-EL-CUADRADO', siFuera: `${ent((k + 1) ** 2)} es lo que lleva toda la bandeja de ${k + 1} × ${k + 1}, no lo que falta para armarla.` },
      ], ent),
      solucion: { texto: `La mayor bandeja es de ${k} × ${k} y la siguiente, de ${k + 1} × ${k + 1}: faltan los que separan a ${ent(N)} de ${k + 1}².`, ecuacion: [`rₑ = ${k + 1}² − ${ent(N)} = ${ent((k + 1) ** 2)} − ${ent(N)} = ${re_}`] },
    };
  }
  // Ahora tú · tipo 2: reconstruir N desde su raíz entera y su residuo.
  function casoReconstruir(r) {
    const k = r.ent(11, 40), rr = r.ent(1, 2 * k), N = k * k + rr;
    if (USADOS3.has(N)) return null;
    return {
      pregunta: ['La raíz cuadrada entera de un número es ', ra(k), ' y su residuo es ', re(rr), '. ¿Cuál es el número?'],
      datos: [D3.residuo],
      opciones: opciones(N, [
        { id: 'resta', valor: k * k - rr, error: 'AT-RESTA', siFuera: `El residuo es lo que sobra: se suma a ${k}² = ${ent(k * k)}, no se resta.` },
        { id: 'mul', valor: 2 * k + rr, error: 'E-MUL', siFuera: `${k}² es ${k} × ${k} = ${ent(k * k)}, no ${k} × 2.` },
        { id: 'exceso', valor: (k + 1) ** 2 - rr, error: 'AT-EXCESO', siFuera: `Ahí el ${rr} se tomó como lo que falta para ${k + 1}², pero el residuo es lo que sobra sobre ${k}².` },
      ], ent),
      solucion: { texto: `El número es la bandeja de ${k} × ${k} más los caramelos que sobran.`, ecuacion: [nu('N'), ` = ${k}² + ${rr} = ${ent(k * k)} + ${rr} = ${ent(N)}`] },
    };
  }
  // Ahora tú · tipo 3 (examen): el mayor N cuya raíz entera es k.
  function casoMayorN(r) {
    const k = r.ent(11, 45), N = k * k + 2 * k;
    if (USADOS3.has(N)) return null;
    return {
      pregunta: ['¿Cuál es el mayor número cuya raíz cuadrada entera es ', ra(k), '?'],
      datos: [D3.raiz, D3.maximo],
      opciones: opciones(N, [
        { id: 'masuno', valor: (k + 1) ** 2, error: 'AT-MAS-UNO', siFuera: `${ent((k + 1) ** 2)} = ${k + 1}²: su raíz ya es ${k + 1}.` },
        { id: 'fila', valor: k * k + k, error: 'AT-UNA-FILA', siFuera: `Con ${ent(k * k + k)} sobran ${k}: aún caben ${k} más sin llegar a ${k + 1}².` },
        { id: 'sin', valor: k * k, error: 'AT-SIN-RESIDUO', siFuera: `${ent(k * k)} = ${k}² tiene raíz ${k}, pero hay mayores con la misma raíz.` },
      ], ent),
      solucion: { texto: `Sobran a lo más 2 × ${k} = ${2 * k}, porque con uno más ya se arma la bandeja de ${k + 1} × ${k + 1}.`, ecuacion: [`${k}² + ${2 * k} = ${ent(N)} = ${ent((k + 1) ** 2)} − 1`] },
    };
  }
  // Ahora tú · tipo 4 (examen): N a partir de sus dos residuos.
  function casoDosResiduos(r) {
    const k = r.ent(9, 30), rr = r.ent(1, 2 * k), re_ = 2 * k + 1 - rr, N = k * k + rr;
    if (USADOS3.has(N)) return null;
    return {
      pregunta: ['Al sacar la raíz cuadrada entera de un número, sobran ', re(rr), ' y faltan ', String(re_), ' para el cuadrado siguiente. ¿Cuál es el número?'],
      datos: [D3.residuo, D3.suma],
      opciones: opciones(N, [
        { id: 'suma', valor: rr + re_, error: 'AT-SUMA', siFuera: `${rr} + ${re_} = ${rr + re_} es 2k + 1, los lugares del borde: sirve para hallar k, pero no es el número.` },
        { id: 'dak', valor: k, error: 'AT-DA-K', siFuera: `Hallar k = ${k} con ${rr + re_} = 2k + 1 está bien, pero piden el número: ${k}² + ${rr}.` },
        { id: 'exceso', valor: (k + 1) ** 2 + rr, error: 'AT-EXCESO', siFuera: `k = ${k} está bien, pero los ${rr} sobran sobre ${k}², no sobre ${k + 1}².` },
      ], ent),
      solucion: { texto: `${rr} + ${re_} = ${2 * k + 1} = 2 × ${k} + 1, así que k = ${k}. El número es k² más lo que sobra.`, ecuacion: [nu('N'), ` = ${k}² + ${rr} = ${ent(N)}`] },
    };
  }
  // Así se resuelve (idea 3): raíz entera y los dos residuos de un N, y N reconstruido por los dos caminos.
  function resuelveDosCaminos(s) {
    const r = azar(s + 900);
    let N, k; do { N = r.ent(120, 980); k = isqrt(N); } while (N === k * k || USADOS3.has(N));
    const rr = N - k * k, re_ = (k + 1) ** 2 - N;
    return {
      enunciado: ['Halla la raíz cuadrada entera de ', nu(N), ', su residuo y su residuo por exceso.'],
      datos: [D3.raiz, D3.residuo, D3.exceso],
      pasos: [
        { tipo: 'pide', texto: ['Piden el lado de la mayor bandeja cuadrada con ', nu(N), ' caramelos, lo que sobra y lo que falta para la siguiente.'] },
        { tipo: 'datos', texto: `Busco los cuadrados vecinos: ${k}² = ${k * k} cabe y ${k + 1}² = ${ent((k + 1) ** 2)} ya se pasa.`, ecuacion: [`${k * k} ≤ ${N} < ${ent((k + 1) ** 2)}`] },
        { tipo: 'regla', texto: 'La raíz entera es el lado de la mayor bandeja que cabe. Sobra N − k² y falta (k + 1)² − N.' },
        { tipo: 'cuentas', texto: 'Resto para hallar lo que sobra y lo que falta.', ecuacion: [{ llave: ['r = ', `${N} − ${k * k} = `, re(rr)], nota: 'sobran' }, SEP, `rₑ = ${ent((k + 1) ** 2)} − ${N} = ${re_}`],
          dibujo: N <= 400 ? sobra(N) : undefined },
        { tipo: 'sentido', texto: `Compruebo por los dos caminos: ${k * k} + ${rr} = ${N} y ${ent((k + 1) ** 2)} − ${re_} = ${N}. Además ${rr} + ${re_} = ${2 * k + 1} = 2 × ${k} + 1.` },
      ],
      respuesta: ['k = ', ra(k), ', r = ', re(rr), `, rₑ = ${re_}`],
    };
  }

  // Ejemplos resueltos (idea 3). Cuentas rehechas aparte (cuentas.py): 50: k = 7, r = 1; 90: k = 9, r = 9; 30: 36 − 30 = 6;
  // 80: 8² = 64, r = 16; 10² + 7 = 107; 300: k = 17, r = 11; 12² + 20 = 164 (20 ≤ 24); 130: k = 11, r = 9, rₑ = 14, 9 + 14 =
  // 23 = 2 × 11 + 1; con k = 14, r ≤ 28; 500: 22² = 484, 23² = 529, se suma 29. Nivel 3: 23² + 46 = 575 = 24² − 1; 18 + 5 = 23
  // = 2 × 11 + 1, N = 121 + 18 = 139; borde de 36 sillas: 4k − 4 = 36, k = 10, 100 sillas; r = 40 = 2k, k = 20, N = 440;
  // 2 000: 44² = 1 936 ≤ 2 000 < 2 025 = 45², rₑ = 25.
  const EJEMPLOS_RAIZ = [
    { nivel: 1, titulo: 'Con 50 caramelos',
      enunciado: 'Doña Juana tiene 50 caramelos. ¿De qué lado es la mayor bandeja cuadrada que arma, y cuántos sobran?',
      datos: [D3.raiz, D3.residuo],
      figura: { pieza: CU, datos: { bandejas: [{ k: 7, siguiente: true }], mudo: true }, estado: {} },
      solucion: [{ texto: 'La bandeja de 7 × 7 = 49 cabe y la de 8 × 8 = 64 ya no.', ecuacion: ['7² = 49 ≤ 50 < 64 = 8²', SEP, 'r = 50 − 49 = 1'] }],
      respuesta: ['k = ', ra(7), ' y sobra ', re(1)] },
    { nivel: 1, titulo: 'El residuo de 90',
      enunciado: '¿Cuál es el residuo de la raíz cuadrada entera de 90?',
      datos: [D3.raiz, D3.residuo],
      solucion: [{ texto: '9² = 81 cabe y 10² = 100 no: la raíz entera es 9.', ecuacion: ['r = 90 − 81 = ', re(9)] }],
      respuesta: ['r = ', re(9)] },
    { nivel: 1, titulo: 'Lo que falta',
      enunciado: 'Con 30 caramelos, ¿cuántos faltan para la bandeja cuadrada siguiente a la mayor que se arma?',
      datos: [D3.raiz, D3.exceso],
      solucion: [{ texto: 'La mayor bandeja es de 5 × 5 = 25 y la siguiente, de 6 × 6 = 36.', ecuacion: ['rₑ = 36 − 30 = 6'] }],
      respuesta: 'Faltan 6' },
    { nivel: 1, titulo: '¿Raíz exacta?',
      enunciado: '¿Es exacta la raíz cuadrada de 80?',
      datos: [D3.raiz],
      solucion: [{ texto: '8² = 64 y 9² = 81: 80 queda entre los dos, así que sobran caramelos.', ecuacion: ['64 ≤ 80 < 81', SEP, 'r = 80 − 64 = ', re(16)] }],
      respuesta: ['No: k = ', ra(8), ' y r = ', re(16)] },
    { nivel: 1, titulo: 'Bandeja y sobrantes',
      enunciado: 'Doña Juana armó una bandeja de 10 × 10 y le sobraron 7 caramelos. ¿Cuántos tenía?',
      datos: [D3.residuo],
      figura: { pieza: CU, datos: { bandejas: [{ k: 10, sobran: 7, siguiente: true }], mudo: true }, estado: {} },
      solucion: [{ texto: 'Tenía los caramelos de la bandeja más los que le sobraron.', ecuacion: [nu('N'), ' = 10² + 7 = 100 + 7 = 107'] }],
      respuesta: ['Tenía ', nu(107)] },
    { nivel: 2, titulo: 'Raíz de 300',
      enunciado: 'Halla la raíz cuadrada entera de 300 y su residuo.',
      datos: [D3.raiz, D3.residuo],
      solucion: [
        { texto: '17² = 289 cabe y 18² = 324 ya se pasa.', ecuacion: ['289 ≤ 300 < 324'] },
        { texto: 'Sobra lo que no entra en la bandeja de 17 × 17.', ecuacion: ['r = 300 − 289 = ', re(11)] },
      ],
      respuesta: ['k = ', ra(17), ', r = ', re(11)] },
    { nivel: 2, titulo: 'De raíz y residuo al número',
      enunciado: 'La raíz cuadrada entera de un número es 12 y su residuo es 20. ¿Cuál es el número?',
      datos: [D3.residuo, D3.maximo],
      solucion: [
        { texto: 'Primero se revisa que el dato sea posible: con k = 12, sobran a lo más 24, y 20 ≤ 24.' },
        { texto: 'Se arma la bandeja de 12 × 12 y se suman los que sobran.', ecuacion: [nu('N'), ' = 12² + 20 = 144 + 20 = 164'] },
      ],
      respuesta: ['El número es ', nu(164)] },
    { nivel: 2, titulo: 'Los dos residuos de 130',
      enunciado: 'Para 130, halla el residuo y el residuo por exceso, y súmalos.',
      datos: [D3.raiz, D3.residuo, D3.exceso],
      solucion: [
        { texto: ['11² = 121 y 12² = 144: ', ra('k'), ' = ', ra(11), '.'], ecuacion: [re('r'), ' = 130 − 121 = ', re(9), SEP, 'rₑ = 144 − 130 = 14'] },
        { texto: 'Juntos llenan el borde de la bandeja de 12 × 12: una columna, una fila y la esquina.', ecuacion: ['9 + 14 = 23 = 2 × 11 + 1'] },
      ],
      respuesta: 'r = 9, rₑ = 14; suman 23' },
    { nivel: 2, titulo: '¿Residuo posible?',
      enunciado: '¿Puede un número tener raíz cuadrada entera 14 y residuo 30?',
      datos: [D3.maximo],
      solucion: [
        { texto: 'Con k = 14 sobran a lo más 2 × 14 = 28.' },
        { texto: 'Con 30 de más ya se completa la bandeja de 15 × 15: 196 + 30 = 226 ≥ 225, y su raíz entera sería 15.', ecuacion: ['14² + 30 = 226 ≥ 225 = 15²'] },
      ],
      respuesta: 'No: el residuo pasa de 28' },
    { nivel: 2, titulo: 'Lo mínimo que hay que sumar',
      enunciado: '¿Cuál es el menor número que hay que sumarle a 500 para obtener un cuadrado perfecto?',
      datos: [D3.raiz, D3.exceso],
      solucion: [
        { texto: '22² = 484 cabe y 23² = 529 se pasa: el cuadrado siguiente es 529.', ecuacion: ['484 ≤ 500 < 529'] },
        { texto: 'Hay que sumar lo que le falta a 500 para llegar a 529: el residuo por exceso.', ecuacion: ['rₑ = 529 − 500 = 29'] },
      ],
      respuesta: 'Hay que sumar 29' },
    { nivel: 3, titulo: 'El mayor con raíz 23',
      enunciado: '¿Cuál es el mayor número cuya raíz cuadrada entera es 23?',
      alternativas: ['529', '575', '576', '552', '46'],
      datos: [D3.raiz, D3.maximo],
      solucion: [
        { texto: 'El residuo llega a lo más a 2 × 23 = 46.', ecuacion: ['23² + 46 = 529 + 46 = 575'] },
        { texto: ['Las trampas: ', letra('A'), ' es 23², sin residuo; ', letra('C'), ' es 24², con raíz 24; ', letra('D'), ' suma solo 23, una fila; ', letra('E'), ' es el residuo más grande, 46, y no el número.'] },
      ],
      respuesta: [letra('B'), ': ', nu(575)] },
    { nivel: 3, titulo: 'Sobran 18 y faltan 5',
      enunciado: 'Al sacar la raíz cuadrada entera de un número, sobran 18 y faltan 5 para el cuadrado siguiente. ¿Cuál es el número?',
      alternativas: ['23', '144', '139', '162', '11'],
      datos: [D3.residuo, D3.suma],
      solucion: [
        { texto: 'Lo que sobra y lo que falta llenan el borde: 18 + 5 = 23 = 2k + 1, así que k = 11.', ecuacion: [nu('N'), ' = 11² + 18 = 121 + 18 = 139'] },
        { texto: ['Las trampas: ', letra('A'), ' suma los residuos; ', letra('B'), ' es 12², el siguiente; ', letra('D'), ' suma 18 a 12²; ', letra('E'), ' da la raíz, no el número.'] },
      ],
      respuesta: [letra('C'), ': ', nu(139)] },
    { nivel: 3, titulo: 'Las sillas del borde',
      enunciado: 'En el patio, unas sillas forman un cuadrado lleno. En el borde hay 36 sillas. ¿Cuántas sillas hay en total?',
      alternativas: ['81', '144', '121', '100', '90'],
      datos: ['Un cuadrado de k × k tiene k sillas por lado, y cada esquina es de dos lados'],
      solucion: [
        { texto: 'Cuatro lados de k sillas cuentan dos veces cada esquina: el borde tiene 4k − 4 sillas.', ecuacion: ['4k − 4 = 36', SEP, 'k = 10'] },
        { texto: ['Total: 10 × 10 = 100. Las trampas: ', letra('A'), ' hace 4k = 36; ', letra('C'), ' toma k = 11; ', letra('B'), ' toma k = 12; ', letra('E'), ' hace 9 × 10.'] },
      ],
      respuesta: [letra('D'), ': 100 sillas'] },
    { nivel: 3, titulo: 'El residuo más grande',
      enunciado: 'El residuo de la raíz cuadrada entera de N es 40 y es el mayor posible para su raíz. ¿Cuánto vale N?',
      alternativas: ['440', '400', '441', '1 640', '420'],
      datos: [D3.residuo, D3.maximo],
      solucion: [
        { texto: 'El mayor residuo posible es 2k: 2k = 40, así que k = 20.', ecuacion: [nu('N'), ' = 20² + 40 = 400 + 40 = 440'] },
        { texto: ['Las trampas: ', letra('B'), ' es 20², sin residuo; ', letra('C'), ' es 21²; ', letra('D'), ' toma k = 40; ', letra('E'), ' toma k = 20 y suma solo 20.'] },
      ],
      respuesta: [letra('A'), ': ', nu(440)] },
    { nivel: 3, titulo: 'Raíz por exceso de 2 000',
      enunciado: '¿Cuál es el residuo por exceso de la raíz cuadrada de 2 000?',
      alternativas: ['64', '45', '2 025', '89', '25'],
      datos: [D3.raiz, D3.exceso],
      solucion: [
        { texto: '44² = 1 936 cabe y 45² = 2 025 se pasa.', ecuacion: ['rₑ = 2 025 − 2 000 = 25'] },
        { texto: ['Las trampas: ', letra('A'), ' es el residuo, 2 000 − 1 936; ', letra('B'), ' es la raíz por exceso; ', letra('C'), ' es 45²; ', letra('D'), ' es el borde, 2 × 44 + 1.'] },
      ],
      respuesta: [letra('E'), ': 25'] },
  ];

  const raizEntera = {
    id: 'raiz-entera',
    titulo: 'Raíz cuadrada entera y residuo',
    pregunta: '¿Cuántos caramelos sobran, y cuántos faltan para la bandeja siguiente?',
    temas: ['Raíz cuadrada y cúbica entera'],
    pieza: CU,
    aprendizaje: 'Si k² ≤ N < (k + 1)², k es la raíz entera. Sobran r = N − k² y faltan rₑ; suman 2k + 1, así que r ≤ 2k.',
    actividad: 'Armar la mayor bandeja cuadrada y contar los caramelos que sobran.',
    // Lee: la bandeja más grande que cabe, qué es la raíz entera y el residuo, y qué mirar. No dice cuánto puede sobrar
    // como máximo (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'La bandeja más grande', texto: 'Doña Juana tiene 30 caramelos y arma la bandeja cuadrada más grande que puede: la de 5 × 5, con 25. La de 6 × 6 no le alcanza, porque pide 36.',
          pieza: CU, dibujo: { datos: { bandejas: [{ k: 5, sobran: 5, siguiente: true }] }, estado: {} } },
        { titulo: 'Raíz entera y residuo', texto: ['El lado de esa bandeja es la raíz cuadrada entera: ', ra('k'), ' = 5. Lo que sobra es el residuo: ', re('r'), ' = 30 − 25 = 5.'] },
        { titulo: 'Lo que falta', texto: 'Los caramelos que sobran se ponen en el borde de la bandeja siguiente, y los lugares que quedan vacíos son lo que falta: el residuo por exceso, rₑ. Con 30 caramelos, faltan 6.' },
        { titulo: 'Qué mirar al jugar', texto: ['Cambias cuántos caramelos hay. Fíjate cuántos ', re('sobran'), ' en el borde de la bandeja siguiente y cuántos lugares quedan vacíos.'] },
      ],
    },
    ejemplos: EJEMPLOS_RAIZ,
    juega: {
      pieza: CU,
      consigna: 'Doña Juana arma la bandeja cuadrada más grande que puede y pone los que sobran en el borde de la siguiente.',
      mision: {
        // Una sola manera: k = 6 y r = 5 dan N = 41.
        texto: 'Arma una bandeja de 6 × 6 de la que sobren 5 caramelos.',
        logrado: v => v.N === 41,
        bien: 'Con 41, la bandeja de 6 × 6 lleva 36 y sobran 5: raíz 6, residuo 5.',
      },
      voz: 'Cuenta los que sobran y los lugares vacíos del borde.',
      leyenda: [
        { s: nu('N'), t: 'los caramelos de doña Juana' },
        { s: ra('k'), t: 'el lado de la bandeja: la raíz entera' },
        { s: re('r'), t: 'los que sobran: el residuo' },
        { s: 'rₑ', t: 'residuo por exceso: lo que falta' },
      ],
      controles: [{ id: 'N', etiqueta: 'Caramelos (N)', color: 'c-o', min: 2, max: 60, paso: 1, inicio: 30, unidad: '', decimales: 0 }],
      dibujo: v => sobra(v.N),
      lectura: v => {
        const k = isqrt(v.N), rr = v.N - k * k;
        return rr ? [nu('N'), ` = ${v.N} = `, alK(k), ' + ', re(rr), `: faltan ${2 * k + 1 - rr} para ${k + 1}²`] : [nu('N'), ` = ${v.N} = `, alK(k), ': no sobra ninguno'];
      },
      minimo: 3,
    },
    predice: {
      pieza: CU,
      pregunta: 'La bandeja de 9 × 9 está armada. ¿Cuántos caramelos pueden sobrar, como máximo, sin que alcance para la de 10 × 10?',
      datos: ['9 × 9 = 81', '10 × 10 = 100'],
      voz: 'Piensa en el borde de la bandeja de 10 × 10.',
      opciones: [
        { id: 'c', texto: '18', correcta: true },
        { id: 'masuno', texto: '19', error: 'AT-MAS-UNO', siFuera: 'Con 19 de más se llena todo el borde: 81 + 19 = 100, ya es la de 10 × 10.' },
        { id: 'fila', texto: '9', error: 'AT-UNA-FILA', siFuera: 'Con 9 se llena una columna nueva, pero todavía caben más sin completar la bandeja: también la fila de abajo.' },
        { id: 'esquina', texto: '20', error: 'AT-ESQUINA', siFuera: 'Contar dos lados de 10 cuenta dos veces la esquina: el borde tiene 19 lugares, y 20 de más ya pasan de 100.' },
      ],
      dibujo: { datos: { bandejas: [{ k: 9, rotulo: [['9 × 9']] }], mudo: true, alto: 240 }, estado: {} },
      revelar: { datos: { bandejas: [{ k: 9, sobran: 18, rotulo: [['sobran 18: solo falta la esquina']] }], alto: 240 }, estado: {} },
      coincide: 'Coincide: el borde de la bandeja de 10 × 10 tiene 100 − 81 = 19 lugares, y con 19 ya se arma.',
      noCoincide: 'Revisemos el borde de la bandeja de 10 × 10.',
    },
    mira: {
      pieza: CU,
      datos: { bandejas: [{ k: 9, siguiente: true }], alto: 240,
        pasos: [{ bandejas: [{ k: 9, siguiente: true, rotulo: [['borde: 9 + 9 + 1 = 19']] }] }, { bandejas: [{ k: 9, sobran: 18, rotulo: [['sobran 18']] }] }, { bandejas: [{ k: 9, sobran: 18, rotulo: [['sobran 18']] }] }] },
      voz: 'Mira el borde de la bandeja siguiente.',
      pasos: [
        { estado: { paso: 0 }, texto: 'Para pasar a la bandeja de 10 × 10 se agregan una columna de 9, una fila de 9 y la esquina.', ecuacion: ['9 + 9 + 1 = 19', SEP, '100 − 81 = 19'] },
        { estado: { paso: 1 }, texto: 'Con 18 de más, solo queda vacía la esquina: todavía no alcanza.', ecuacion: ['81 + ', re(18), ' = 99 < 100'] },
        { estado: { paso: 2 }, texto: 'Con cualquier lado k, el borde tiene 2k + 1 lugares.', ecuacion: ['(', ra('k'), ' + 1)² − ', ra('k'), '² = 2', ra('k'), ' + 1'] },
      ],
    },
    regla: {
      texto: 'El lado k de la mayor bandeja cuadrada es la raíz entera de N. Lo que sobra y lo que falta para la siguiente suman 2k + 1, los lugares del borde, así que sobran a lo más 2k.',
      ecuacion: [alK('k'), ' ≤ ', nu('N'), ' < (', ra('k'), ' + 1)²', SEP, re('r'), ' = ', nu('N'), ' − ', alK('k'), SEP, { llave: [re('r'), ' + rₑ = 2', ra('k'), ' + 1'], nota: 'rₑ: lo que falta' }],
      condicion: 'N es un entero positivo. Si N es cuadrado perfecto, r = 0 y la raíz es exacta; rₑ y r + rₑ = 2k + 1 solo se usan cuando no lo es.',
      voz: 'Sobra todo lo que no completa el borde.',
      dibujo: { pieza: CU, datos: { bandejas: [{ k: 6, sobran: 5, siguiente: true, pie: [['k = '], ['6', 'f', 700], ['; r = '], ['5', 'h', 700], ['; rₑ = 8']] }], alto: 240 }, estado: {} },
    },
    // Así se resuelve: raíz y los dos residuos de un N, comprobando por los dos caminos. «Ahora tú» pide raíz y residuo, lo
    // que falta, el número desde k y r, el mayor N con raíz k y el número desde sus dos residuos (examen).
    resuelve: { pieza: CU, generar: resuelveDosCaminos },
    ahoraTu: {
      voz: 'Busca los dos cuadrados vecinos.',
      generar(sem) {
        const r = azar(sem + 41);
        return conCuatro([casoRaizResiduo, casoFaltan, casoReconstruir, casoMayorN, casoDosResiduos][sem % 5], r);
      },
    },
  };


  // ---------- Idea 4 (nueva, 26 nov): raíz cúbica entera y residuo ----------
  // Propuesta §1 a §7. Objeto: el cubo macizo de cubitos de chocolate de doña Juana (ari-cubitos-3d, que se gira con el
  // dedo; los cubitos los cuenta el motor de plantillas/potenciacion, regla 1). Cambia: N y si la cáscara va pegada o
  // aparte. · Permanece: el cubo k³ y la cáscara del siguiente. · Progresa: sobran pocos → caras llenas → aristas → falta
  // solo la esquina. · Se reserva: el paso de 8³ a 9³ (la predicción; el juego llega a N = 130, k = 5). · Debe verse: el
  // cubo siguiente pide tres caras, tres aristas y una esquina.
  // Errores (hipótesis de aula): AT-COPIA-CUADRADO usa el 2k + 1 del cuadrado · AT-CARAS cuenta solo las tres caras ·
  // AT-UNO cree que el cubo crece de a un cubito · AT-CUADRADA saca raíz cuadrada en vez de cúbica · E-RDIV (documentado:
  // Bejarano, 2022) divide entre el índice · AT-MISMA cree que la raíz termina en la misma cifra · AT-EXCESO, AT-SUMA,
  // AT-DA-K y AT-SIN-RESIDUO, como en la idea 3.
  const D4 = {
    raiz: 'Raíz cúbica entera: el mayor entero k con k³ ≤ N',
    residuo: 'Residuo: r = N − k³',
    paso: 'Para pasar de k³ a (k + 1)³ hacen falta 3k² + 3k + 1 cubitos',
    maximo: 'El residuo de la raíz cúbica es a lo más 3k² + 3k',
    litro: '1 L = 1 000 cm³',
  };
  const USADOS4 = new Set([100, 343, 135, 30, 1000, 2000, 266, 600, 1330, 412, 2744, 300, 4913, 512, 729, 74]);
  // El cubo de cubitos: el cubo k³ (neutro), los que sobran en la cáscara del siguiente (carmín, el residuo) y el
  // alambre del cubo (k + 1)³. Con `mudo`, el texto alternativo no dice cuántos faltan.
  function cuboDe(Nv, sep = false, o = {}) {
    const c = MP.cuboConResto(Nv, sep), K = c.k, abre = sep ? 1.5 : 0;
    return { pieza: 'ari-cubitos-3d', datos: {
      bloques: c.cubo.map(b => ({ x: b.x, y: b.y, z: b.z, g: 0 })).concat(c.resto.map(b => ({ x: b.x, y: b.y, z: b.z, g: 1 }))),
      grupos: [
        { nombre: `cubitos del cubo de ${K} × ${K} × ${K}`, rotulo: K ? `${K}³` : '', rotuloEn: [K / 2, -0.9, 0], dice: `${K}³ = ${c.potencia} cubitos: el mayor cubo que cabe` },
        { nombre: 'cubitos que sobran', color: 'c-h', rotulo: c.r && !o.mudo && !o.sinR ? `r = ${c.r}` : '', dice: `Sobran ${c.r}` },
      ],
      marco: { x: 0, y: 0, z: 0, w: K + 1 + abre, h: K + 1 + abre, d: K + 1 + abre, rotulo: `${K + 1}³` },
      alt: o.mudo ? `Un cubo macizo de ${K} × ${K} × ${K} cubitos, dentro del alambre del cubo de ${K + 1} × ${K + 1} × ${K + 1}.`
        : `${c.N} cubitos: el cubo ${K}³ = ${c.potencia} y ${c.r} que sobran; faltan ${c.falta} para ${K + 1}³ = ${c.siguiente}.`,
    }, estado: {} };
  }
  const cub = n => { let k = Math.floor(Math.cbrt(n)); while (k ** 3 > n) k--; while ((k + 1) ** 3 <= n) k++; return k; };
  // Ahora tú · tipo 0: raíz cúbica entera y residuo.
  function casoCubica(r) {
    const N = r.ent(130, 2190), k = cub(N), rr = N - k ** 3, re_ = (k + 1) ** 3 - N;
    if (rr === 0 || USADOS4.has(N)) return null;
    const t = (a, b) => `k = ${a}, r = ${typeof b === 'number' ? ent(b) : b}`, kc = isqrt(N);
    return {
      pregunta: ['¿Cuál es la raíz cúbica entera de ', nu(ent(N)), ' y cuánto sobra?'],
      datos: [D4.raiz, D4.residuo],
      opciones: opciones(t(k, rr), [
        { id: 'exceso', valor: t(k + 1, re_), error: 'AT-EXCESO', siFuera: `${k + 1}³ = ${ent((k + 1) ** 3)} ya pasa de ${ent(N)}: esa es la raíz por exceso.` },
        { id: 'cuadrada', valor: t(kc, N - kc * kc), error: 'AT-CUADRADA', siFuera: `Esa es la raíz cuadrada entera, porque ${kc}² = ${ent(kc * kc)}. Aquí se pide la cúbica, con k³.` },
        { id: 'cuad', valor: t(k, ent(N - k * k)), error: 'AT-CUADRADO', siFuera: `k = ${k} está bien, pero sobra N − ${k}³ = ${ent(N)} − ${ent(k ** 3)}, no N − ${k}².` },
      ]),
      solucion: { texto: `${k}³ cabe en ${ent(N)} y ${k + 1}³ ya se pasa: la raíz cúbica entera es ${k}.`, ecuacion: [`${k}³ = ${ent(k ** 3)} ≤ ${ent(N)} < ${ent((k + 1) ** 3)} = ${k + 1}³`, SEP, `r = ${ent(N)} − ${ent(k ** 3)} = ${rr}`] },
    };
  }
  // Ahora tú · tipo 1: cuántos cubitos hacen falta para pasar del cubo de arista k al siguiente.
  function casoSiguienteCubo(r) {
    const k = r.ent(4, 15), c = 3 * k * k + 3 * k + 1;
    if (k === 8) return null;
    return {
      pregunta: ['El cubo de ', ra(k), ` × ${k} × ${k} cubitos está armado. ¿Cuántos cubitos hay que agregar para armar el de ${k + 1} × ${k + 1} × ${k + 1}?`],
      datos: [`${k} × ${k} = ${k * k}`, `${k} × ${k} × ${k} = ${ent(k ** 3)}`],
      opciones: opciones(c, [
        { id: 'cuadrado', valor: 2 * k + 1, error: 'AT-COPIA-CUADRADO', siFuera: `${2 * k + 1} es lo que se agrega para pasar de un cuadrado al siguiente; un cubo crece por tres caras, tres aristas y una esquina.` },
        { id: 'caras', valor: 3 * k * k, error: 'AT-CARAS', siFuera: `Las tres caras, 3 × ${k * k}, están bien contadas, pero faltan las tres aristas y la esquina.` },
        { id: 'todo', valor: (k + 1) ** 3, error: 'AT-DA-EL-CUBO', siFuera: `${ent((k + 1) ** 3)} es todo el cubo nuevo, y ${ent(k ** 3)} de esos cubitos ya están puestos.` },
      ], ent),
      solucion: { texto: `Hacen falta tres caras de ${k} × ${k}, tres aristas de ${k} y una esquina.`, ecuacion: [`3 × ${k * k} + 3 × ${k} + 1 = ${ent(c)} = ${ent((k + 1) ** 3)} − ${ent(k ** 3)}`] },
    };
  }
  // Ahora tú · tipo 2: el número a partir de su raíz cúbica entera y su residuo.
  function casoReconstruirCubo(r) {
    const k = r.ent(4, 12), rr = r.ent(1, 3 * k * k + 3 * k), N = k ** 3 + rr;
    if (USADOS4.has(N) || k * k + rr === 3 * k + rr) return null;
    return {
      pregunta: ['La raíz cúbica entera de un número es ', ra(k), ' y su residuo es ', re(rr), '. ¿Cuál es el número?'],
      datos: [D4.residuo],
      opciones: opciones(N, [
        { id: 'cuadrado', valor: k * k + rr, error: 'AT-CUADRADO', siFuera: `Ahí se usó ${k}², pero la raíz es cúbica: ${k}³ = ${ent(k ** 3)}.` },
        { id: 'mul', valor: 3 * k + rr, error: 'E-MUL', siFuera: `${k}³ es ${k} × ${k} × ${k} = ${ent(k ** 3)}, no ${k} × 3.` },
        { id: 'exceso', valor: (k + 1) ** 3 - rr, error: 'AT-EXCESO', siFuera: `Ahí el ${rr} se tomó como lo que falta para ${k + 1}³, pero el residuo es lo que sobra sobre ${k}³.` },
      ], ent),
      solucion: { texto: `El número es el cubo de ${k} × ${k} × ${k} más los cubitos que sobran.`, ecuacion: [nu('N'), ` = ${k}³ + ${rr} = ${ent(k ** 3)} + ${rr} = ${ent(N)}`] },
    };
  }
  // Ahora tú · tipo 3 (examen): el mayor número cuya raíz cúbica entera es k.
  function casoMayorCubo(r) {
    const k = r.ent(5, 14), N = k ** 3 + 3 * k * k + 3 * k;
    if (k === 10) return null;
    return {
      pregunta: ['¿Cuál es el mayor número cuya raíz cúbica entera es ', ra(k), '?'],
      datos: [D4.raiz, D4.maximo],
      opciones: opciones(N, [
        { id: 'masuno', valor: (k + 1) ** 3, error: 'AT-MAS-UNO', siFuera: `${ent((k + 1) ** 3)} = ${k + 1}³: su raíz cúbica ya es ${k + 1}.` },
        { id: 'caras', valor: k ** 3 + 3 * k * k, error: 'AT-CARAS', siFuera: 'Con las tres caras llenas todavía caben las aristas sin completar el cubo siguiente: el residuo puede ser mayor.' },
        { id: 'cuadrado', valor: k ** 3 + 2 * k, error: 'AT-COPIA-CUADRADO', siFuera: `2k es el residuo máximo de la raíz cuadrada; el de la raíz cúbica es 3k² + 3k.` },
      ], ent),
      solucion: { texto: `Sobran a lo más 3 × ${k * k} + 3 × ${k} = ${3 * k * k + 3 * k}, porque con uno más se completa el cubo siguiente.`, ecuacion: [`${ent(k ** 3)} + ${3 * k * k + 3 * k} = ${ent(N)} = ${k + 1}³ − 1`] },
    };
  }
  // Ahora tú · tipo 4 (examen): la raíz cúbica de un cubo perfecto de cuatro cifras, por su cifra final y su tramo.
  function casoAristaCubo(r) {
    const k = r.ent(11, 19), N = k ** 3, d = N % 10;
    if (USADOS4.has(N) || k % 10 === d) return null;
    const misma = 10 * Math.floor(k / 10) + d, kc = isqrt(N);
    return {
      pregunta: ['El número ', nu(ent(N)), ' es un cubo perfecto. ¿Cuál es su raíz cúbica?'],
      datos: [D2.cubo, '10³ = 1 000; 20³ = 8 000'],
      opciones: opciones(k, [
        { id: 'misma', valor: misma, error: 'AT-MISMA', siFuera: `${misma}³ = ${ent(misma ** 3)}. Aquí la raíz no termina en la misma cifra que el cubo.` },
        { id: 'cuadrada', valor: kc, error: 'AT-CUADRADA', siFuera: `${kc} es la raíz cuadrada entera: ${kc}² = ${ent(kc * kc)}.` },
        { id: 'tercio', valor: Math.floor(N / 3), error: 'E-RDIV', siFuera: 'Dividir entre 3 no es sacar raíz cúbica: se busca k con k × k × k = N.' },
      ], ent),
      solucion: { texto: `El número está entre 10³ y 20³, y de las diez cifras finales solo el ${k % 10} da un cubo que termina en ${d}.`, ecuacion: [`${k}³ = ${ent(N)}`] },
    };
  }
  // Así se resuelve (idea 4): raíz cúbica entera y residuo de un N de cuatro cifras.
  function resuelveCubica(s) {
    const r = azar(s + 900);
    let N, k; do { N = r.ent(2200, 9900); k = cub(N); } while (N === k ** 3 || USADOS4.has(N));
    const rr = N - k ** 3, re_ = (k + 1) ** 3 - N;
    return {
      enunciado: ['Doña Juana tiene ', nu(ent(N)), ' cubitos de chocolate. Arma el mayor cubo macizo que puede. ¿De qué arista es y cuántos sobran?'],
      datos: [D4.raiz, D4.residuo],
      pasos: [
        { tipo: 'pide', texto: 'Piden la raíz cúbica entera, que es la arista del cubo, y el residuo, que es lo que sobra.' },
        { tipo: 'datos', texto: `Busco los cubos vecinos: ${k}³ = ${ent(k ** 3)} cabe y ${k + 1}³ = ${ent((k + 1) ** 3)} ya se pasa.`, ecuacion: [`${ent(k ** 3)} ≤ ${ent(N)} < ${ent((k + 1) ** 3)}`] },
        { tipo: 'regla', texto: 'La raíz cúbica entera es el mayor k con k³ ≤ N; el residuo es N − k³.' },
        { tipo: 'cuentas', texto: 'Resto el cubo para hallar lo que sobra.', ecuacion: ['r = ', `${ent(N)} − ${ent(k ** 3)} = `, re(rr)] },
        { tipo: 'sentido', texto: `El residuo no pasa de 3 × ${k * k} + 3 × ${k} = ${ent(3 * k * k + 3 * k)}, el máximo posible, así que la cuenta es coherente. Faltan ${ent(re_)} para ${k + 1}³.` },
      ],
      respuesta: ['Arista ', ra(k), ' y sobran ', re(rr)],
    };
  }

  // Ejemplos resueltos (idea 4). Cuentas rehechas aparte (cuentas.py): 100: k = 4, r = 36; 343 = 7³; 5³ + 10 = 135; 30:
  // 4³ − 30 = 34; 1 000 cm³ = 10³; 2 000: 12³ = 1 728, r = 272; 6³ + 50 = 266 (50 ≤ 126); 6³ − 5³ = 91 = 3 × 25 + 3 × 5 + 1;
  // con k = 3, r ≤ 36; 600: 8³ = 512, 9³ = 729, se suma 129. Nivel 3: 10³ + 330 = 1 330 = 11³ − 1; 69 + 100 = 169 = 3 × 49
  // + 3 × 7 + 1, N = 343 + 69 = 412; 14³ = 2 744 (√2 744 ≈ 52,4; 2 744 ÷ 3 ≈ 914; 14² = 196; 24³ = 13 824); 300: 6³ = 216,
  // 7³ = 343, faltan 43 (sobran 84); 4 913 = 17³ (13³ = 2 197, 23³ = 12 167, 27³ = 19 683, 70³ = 343 000).
  const EJEMPLOS_CUBO = [
    { nivel: 1, titulo: 'Con 100 cubitos',
      enunciado: 'Con 100 cubitos, ¿de qué arista es el mayor cubo macizo, y cuántos sobran?',
      datos: [D4.raiz, D4.residuo],
      solucion: [{ texto: '4³ = 64 cabe y 5³ = 125 ya no.', ecuacion: ['64 ≤ 100 < 125', SEP, 'r = 100 − 64 = ', re(36)] }],
      respuesta: ['Arista ', ra(4), ', sobran ', re(36)] },
    { nivel: 1, titulo: '¿343 es cubo?',
      enunciado: '¿Es 343 un cubo perfecto?',
      datos: [D4.raiz],
      solucion: [{ texto: '7 × 7 = 49 y 49 × 7 = 343: el cubo de 7 × 7 × 7 usa todo y no sobra nada.', ecuacion: ['343 = ', alK(7, 3)] }],
      respuesta: ['Sí: 343 = ', alK(7, 3)] },
    { nivel: 1, titulo: 'Cubo y sobrantes',
      enunciado: 'Doña Juana armó un cubo de 5 × 5 × 5 cubitos y le sobraron 10. ¿Cuántos tenía?',
      datos: [D4.residuo],
      solucion: [{ texto: 'Tenía los cubitos del cubo más los que le sobraron.', ecuacion: [nu('N'), ' = 5³ + 10 = 125 + 10 = 135'] }],
      respuesta: ['Tenía ', nu(135)] },
    { nivel: 1, titulo: 'Lo que falta',
      enunciado: 'Con 30 cubitos se arma el mayor cubo posible. ¿Cuántos faltan para el cubo siguiente?',
      datos: [D4.raiz],
      solucion: [{ texto: 'El mayor cubo es 3³ = 27 y el siguiente, 4³ = 64: faltan los que separan a 30 de 64.', ecuacion: ['64 − 30 = 34'] }],
      respuesta: 'Faltan 34' },
    { nivel: 1, titulo: 'Una caja de un litro',
      enunciado: 'Una caja cúbica tiene 1 L de capacidad. ¿Cuánto mide su arista por dentro?',
      datos: [D4.litro],
      solucion: [{ texto: '1 L = 1 000 cm³, y 10 × 10 × 10 = 1 000.', ecuacion: ['1 000 = ', alK(10, 3)] }],
      respuesta: ['La arista mide ', ra('10 cm')] },
    { nivel: 2, titulo: 'Raíz cúbica de 2 000',
      enunciado: 'Halla la raíz cúbica entera de 2 000 y su residuo.',
      datos: [D4.raiz, D4.residuo],
      solucion: [
        { texto: '12³ = 1 728 cabe y 13³ = 2 197 ya se pasa.', ecuacion: ['1 728 ≤ 2 000 < 2 197'] },
        { texto: 'Sobra lo que no entra en el cubo de 12.', ecuacion: ['r = 2 000 − 1 728 = ', re(272)] },
      ],
      respuesta: ['k = ', ra(12), ', r = ', re(272)] },
    { nivel: 2, titulo: 'De raíz y residuo al número',
      enunciado: 'La raíz cúbica entera de un número es 6 y su residuo es 50. ¿Cuál es el número?',
      datos: [D4.residuo, D4.maximo],
      solucion: [
        { texto: 'Primero se revisa que sea posible: con k = 6 sobran a lo más 3 × 36 + 3 × 6 = 126, y 50 ≤ 126.' },
        { texto: 'Después se suman el cubo y lo que sobra.', ecuacion: [nu('N'), ' = 6³ + 50 = 216 + 50 = 266'] },
      ],
      respuesta: ['El número es ', nu(266)] },
    { nivel: 2, titulo: 'De 5³ a 6³',
      enunciado: 'El cubo de 5 × 5 × 5 está armado. ¿Cuántos cubitos hacen falta para el de 6 × 6 × 6?',
      datos: [D4.paso],
      solucion: [
        { texto: 'Hacen falta tres caras de 5 × 5, tres aristas de 5 y una esquina.', ecuacion: ['3 × 25 + 3 × 5 + 1 = 91'] },
        { texto: 'Se comprueba restando los cubos.', ecuacion: ['216 − 125 = 91'] },
      ],
      respuesta: 'Hacen falta 91' },
    { nivel: 2, titulo: '¿Residuo posible?',
      enunciado: '¿Puede un número tener raíz cúbica entera 3 y residuo 40?',
      datos: [D4.maximo],
      solucion: [
        { texto: 'Con k = 3 sobran a lo más 3 × 9 + 3 × 3 = 36.' },
        { texto: 'Con 40 de más ya se completa el cubo de 4: 27 + 40 = 67 ≥ 64.', ecuacion: ['3³ + 40 = 67 ≥ 64 = 4³'] },
      ],
      respuesta: 'No: el residuo pasa de 36' },
    { nivel: 2, titulo: 'Lo mínimo que hay que sumar',
      enunciado: '¿Cuál es el menor número que hay que sumarle a 600 para obtener un cubo perfecto?',
      datos: [D4.raiz],
      solucion: [
        { texto: '8³ = 512 cabe y 9³ = 729 se pasa: el cubo siguiente es 729.', ecuacion: ['512 ≤ 600 < 729'] },
        { texto: 'Hay que sumar lo que le falta a 600 para llegar a 729.', ecuacion: ['729 − 600 = 129'] },
      ],
      respuesta: 'Hay que sumar 129' },
    { nivel: 3, titulo: 'El mayor con raíz 10',
      enunciado: '¿Cuál es el mayor número cuya raíz cúbica entera es 10?',
      alternativas: ['1 100', '1 331', '1 330', '1 020', '1 300'],
      datos: [D4.raiz, D4.maximo],
      solucion: [
        { texto: 'El residuo llega a lo más a 3 × 100 + 3 × 10 = 330.', ecuacion: ['1 000 + 330 = 1 330 = 1 331 − 1'] },
        { texto: ['Las trampas: ', letra('A'), ' suma una sola cara; ', letra('B'), ' es 11³; ', letra('D'), ' usa el 2k del cuadrado; ', letra('E'), ' suma solo las tres caras.'] },
      ],
      respuesta: [letra('C'), ': ', nu('1 330')] },
    { nivel: 3, titulo: 'Sobran 69 y faltan 100',
      enunciado: 'Al sacar la raíz cúbica entera de un número, sobran 69 y faltan 100 para el cubo siguiente. ¿Cuál es el número?',
      alternativas: ['412', '169', '443', '512', '7'],
      datos: [D4.residuo, D4.paso],
      solucion: [
        { texto: 'Lo que sobra y lo que falta llenan la cáscara: 69 + 100 = 169 = 3k² + 3k + 1. Se prueba k = 7: 147 + 21 + 1 = 169.', ecuacion: [nu('N'), ' = 7³ + 69 = 343 + 69 = 412'] },
        { texto: ['Las trampas: ', letra('B'), ' suma los residuos; ', letra('C'), ' resta 69 de 8³; ', letra('D'), ' es 8³; ', letra('E'), ' da la raíz, no el número.'] },
      ],
      respuesta: [letra('A'), ': ', nu(412)] },
    { nivel: 3, titulo: 'La arista de 2 744',
      enunciado: 'Un cubo macizo tiene 2 744 cubitos. ¿Cuántos cubitos tiene cada arista?',
      alternativas: ['52', '914', '196', '24', '14'],
      datos: [D2.cubo, '10³ = 1 000; 20³ = 8 000'],
      solucion: [
        { texto: 'Está entre 10³ y 20³ y termina en 4, así que la arista termina en 4, porque 4 × 4 × 4 = 64.', ecuacion: ['14³ = 2 744'] },
        { texto: ['Las trampas: ', letra('A'), ' saca la raíz cuadrada; ', letra('B'), ' divide entre 3; ', letra('C'), ' es una cara, 14²; ', letra('D'), ' termina en 4, pero 24³ = 13 824.'] },
      ],
      respuesta: [letra('E'), ': ', ra(14)] },
    { nivel: 3, titulo: 'Completar el cubo',
      enunciado: 'Doña Juana tiene 300 cubitos. Arma el mayor cubo y con los que sobran empieza el siguiente. ¿Cuántos cubitos más necesita para terminarlo?',
      alternativas: ['84', '43', '127', '343', '13'],
      datos: [D4.raiz, D4.residuo],
      solucion: [
        { texto: '6³ = 216 cabe y 7³ = 343 no, así que sobran 84 y faltan los que separan a 300 de 343.', ecuacion: ['343 − 300 = 43'] },
        { texto: ['Las trampas: ', letra('A'), ' es lo que sobra; ', letra('C'), ' es toda la cáscara, 3 × 36 + 3 × 6 + 1; ', letra('D'), ' es 7³; ', letra('E'), ' copia el 2 × 6 + 1 de las bandejas cuadradas.'] },
      ],
      respuesta: [letra('B'), ': 43'] },
    { nivel: 3, titulo: 'La raíz de 4 913',
      enunciado: 'El número 4 913 es un cubo perfecto. ¿Cuál es su raíz cúbica?',
      alternativas: ['13', '27', '23', '17', '70'],
      datos: [D2.cubo, '10³ = 1 000; 20³ = 8 000'],
      solucion: [
        { texto: 'Está entre 10³ y 20³ y termina en 3. De las diez cifras, solo 7 × 7 × 7 = 343 termina en 3: la raíz termina en 7.', ecuacion: ['17³ = 4 913'] },
        { texto: ['Las trampas: ', letra('A'), ' copia la cifra final; ', letra('B'), ' y ', letra('C'), ' están fuera del tramo; ', letra('E'), ' es casi la raíz cuadrada, 70² = 4 900.'] },
      ],
      respuesta: [letra('D'), ': ', ra(17)] },
  ];

  const raizCubica = {
    id: 'raiz-cubica',
    titulo: 'Raíz cúbica entera y residuo',
    pregunta: '¿Cuántos cubitos hacen falta para pasar al cubo siguiente?',
    temas: ['Raíz cuadrada y cúbica entera'],
    pieza: 'ari-cubitos-3d',
    aprendizaje: 'Si k³ ≤ N < (k + 1)³, k es la raíz cúbica entera y sobran N − k³. El cubo siguiente pide 3k² + 3k + 1 cubitos.',
    actividad: 'Armar el mayor cubo de cubitos y ver dónde van los que sobran.',
    // Lee: el cubo de chocolate, la raíz cúbica (∛), el residuo y qué mirar. No dice cuántos cubitos pide el cubo siguiente
    // (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'El cubo de chocolate', texto: 'Doña Juana arma cubos macizos con cubitos de chocolate. Con 30 cubitos, el mayor es de 3 × 3 × 3 = 27, y sobran 3.',
          pieza: 'ari-cubitos-3d', dibujo: cuboDe(30) },
        { titulo: 'Raíz cúbica', texto: ['La raíz cúbica, ∛, es la operación inversa de elevar al cubo: ∛27 = 3, porque 3 × 3 × 3 = 27. La raíz cúbica entera de 30 es la arista ', ra('k'), ' = 3, y sobran ', re('r'), ' = 3.'] },
        { titulo: 'Qué mirar al jugar', texto: ['Cambias cuántos cubitos hay. Los que ', re('sobran'), ' forman la cáscara, la capa que empieza a envolver al cubo. Con la cáscara «Aparte», la ves separada: fíjate qué partes del cubo siguiente llena.'] },
      ],
    },
    ejemplos: EJEMPLOS_CUBO,
    juega: {
      pieza: 'ari-cubitos-3d',
      consigna: 'Doña Juana arma el cubo macizo más grande que puede; los cubitos que sobran empiezan el siguiente. Gira el cubo con el dedo.',
      mision: {
        // Una sola manera: k = 4 y r = 10 dan N = 74.
        texto: 'Arma el cubo de 4 × 4 × 4 y que sobren 10 cubitos.',
        logrado: v => v.N === 74,
        bien: 'Con 74 cubitos, el cubo de 4 × 4 × 4 lleva 64 y sobran 10.',
      },
      voz: 'Pon la cáscara aparte y mira qué se llena primero.',
      leyenda: [
        { s: nu('N'), t: 'los cubitos de doña Juana' },
        { s: ra('k'), t: 'la arista del mayor cubo' },
        { s: re('r'), t: 'los cubitos que sobran' },
        { s: 'cáscara', t: 'los que sobran, que empiezan el siguiente' },
      ],
      controles: [
        { id: 'N', etiqueta: 'Cubitos (N)', color: 'c-o', min: 1, max: 130, paso: 1, inicio: 30, unidad: '', decimales: 0 },
        { id: 'sep', etiqueta: 'Cáscara', opciones: [{ valor: 0, texto: 'Pegada' }, { valor: 1, texto: 'Aparte' }] },
      ],
      dibujo: v => cuboDe(v.N, v.sep === 1),
      lectura: v => {
        const k = cub(v.N), rr = v.N - k ** 3;
        return [nu('N'), ` = ${v.N} = `, alK(k, 3), ' + ', re(rr), `, `, ra('k'), ` = ${k}: faltan ${(k + 1) ** 3 - v.N} para ${k + 1}³`];
      },
      minimo: 3,
    },
    predice: {
      pieza: 'ari-cubitos-3d',
      pregunta: 'El cubo de 8 × 8 × 8 cubitos está armado. ¿Cuántos cubitos hay que agregar para armar el de 9 × 9 × 9?',
      datos: ['8 × 8 = 64', '8 × 8 × 8 = 512'],
      voz: 'El cubo nuevo crece por varios lados a la vez.',
      opciones: [
        { id: 'c', texto: '217', correcta: true },
        { id: 'cuadrado', texto: '17', error: 'AT-COPIA-CUADRADO', siFuera: '17 = 2 × 8 + 1 es lo que se agrega para pasar de un cuadrado al siguiente, no de un cubo al siguiente.' },
        { id: 'caras', texto: '192', error: 'AT-CARAS', siFuera: 'Las tres caras, 3 × 64 = 192, están bien contadas, pero faltan las tres aristas y la esquina.' },
        { id: 'uno', texto: '1', error: 'AT-UNO', siFuera: 'La arista crece en 1, pero el cubo crece por tres caras a la vez.' },
      ],
      dibujo: cuboDe(512, false, { mudo: true }),
      revelar: cuboDe(728, true),
      coincide: 'Coincide: 3 × 64 + 3 × 8 + 1 = 217 = 729 − 512.',
      noCoincide: 'Revisemos qué partes tiene la cáscara del cubo nuevo.',
    },
    mira: {
      pieza: 'ari-cubitos-3d',
      // Sin «r = 216»: el rótulo se encimaba y chocaba con el 217 recién predicho (lector en frío, 26 nov).
      datos: cuboDe(728, true, { sinR: true }).datos,
      voz: 'Gira la cáscara: tres caras, tres aristas y una esquina.',
      pasos: [
        { estado: {}, texto: 'Tres caras de 8 × 8 tapan el cubo por tres lados.', ecuacion: ['3 × 64 = 192'] },
        { estado: {}, texto: 'Entre cada par de caras queda un hueco largo: una arista de 8 cubitos.', ecuacion: ['3 × 8 = 24'] },
        { estado: {}, texto: 'Todavía falta una esquina: el cubito que queda vacío en el dibujo.', ecuacion: ['192 + 24 + 1 = 217 = 729 − 512'] },
        { estado: {}, texto: 'Con cualquier arista k, el cubo siguiente pide 3k² + 3k + 1.', ecuacion: ['(', ra('k'), ' + 1)³ − ', ra('k'), '³ = 3', ra('k'), '² + 3', ra('k'), ' + 1'] },
      ],
    },
    regla: {
      texto: 'Si k³ ≤ N < (k + 1)³, k es la raíz cúbica entera de N y sobran r = N − k³. Para armar el cubo siguiente hacen falta tres caras, tres aristas y una esquina.',
      ecuacion: [alK('k', 3), ' ≤ ', nu('N'), ' < (', ra('k'), ' + 1)³', SEP, re('r'), ' = ', nu('N'), ' − ', alK('k', 3), SEP, { llave: ['3', ra('k'), '² + 3', ra('k'), ' + 1'], nota: 'caras, aristas y esquina' }],
      condicion: 'N es un entero positivo. El residuo es a lo más 3k² + 3k, y si r = 0, N es cubo perfecto y la raíz es exacta.',
      voz: 'Un cubo crece por tres caras a la vez.',
      dibujo: cuboDe(728, true, { sinR: true }),
    },
    // Así se resuelve: raíz cúbica entera y residuo de cuatro cifras. «Ahora tú» pide raíz y residuo, los cubitos para el
    // siguiente, el número desde k y r, el mayor con raíz k y la raíz de un cubo por su cifra final (examen).
    resuelve: { generar: resuelveCubica },
    ahoraTu: {
      voz: 'Busca los dos cubos vecinos.',
      generar(sem) {
        const r = azar(sem + 41);
        return conCuatro([casoCubica, casoSiguienteCubo, casoReconstruirCubo, casoMayorCubo, casoAristaCubo][sem % 5], r);
      },
    },
  };


  // ---------- Idea 5 (nueva, 26 nov): contar cuadrados y cubos en un tramo ----------
  // Propuesta §1 a §7. Objeto: bandejas cuadradas de varios tamaños en «Lee» (las que doña Juana puede armar sin que sobre
  // ninguno) y, en el juego, la recta con los cuadrados marcados y el tramo de a hasta b. Cambia: a y b. · Permanece: los
  // cuadrados de la recta. · Progresa: contar uno por uno → contar las bases. · Se reserva: los cuadrados de tres cifras (la
  // predicción; el juego llega a 200). · Debe verse: cada cuadrado del tramo es una base k, y las bases van seguidas.
  // Errores: AT-SIN-MAS-UNO resta las bases sin sumar 1 (la trampa que anota el CSV en San Marcos 2026-II; hipótesis de
  // aula) · AT-DESDE-UNO cuenta desde 1² · AT-RAIZ-DIF saca la raíz de la diferencia · AT-EXTREMO cuenta una base de más
  // en un extremo · AT-SIN-RESTAR suma cuadrados y cubos sin quitar los repetidos · AT-RESTA-DOS-VECES · AT-SOLO-AMBOS.
  const D5 = {
    contar: 'Cuadrados de a hasta b: sus bases van desde la menor k con k² ≥ a hasta la mayor con k² ≤ b',
    seguidos: 'Del entero menor al mayor, los dos incluidos, hay «mayor − menor + 1» enteros',
    cubos: 'Cubos de a hasta b: sus bases van desde la menor k con k³ ≥ a hasta la mayor con k³ ≤ b',
    sexta: 'Un número es cuadrado y cubo a la vez si es una sexta potencia, como 1, 64 o 729',
  };
  const USADOS5 = new Set(['1-50', '20-40', '200-1000', '55-160', '100-400', '1000-2000', '60-110']);
  const cuenta = (a, b, n = 2) => { let c = 0; for (let k = 0; k ** n <= b; k++) if (k ** n >= a) c++; return c; };
  const primera = (a, n = 2) => { let k = 0; while (k ** n < a) k++; return k; };
  const ultima = (b, n = 2) => { let k = 0; while ((k + 1) ** n <= b) k++; return k; };
  // La recta del juego: los cuadrados hasta 200 (naranja; los del tramo, con su rótulo el primero y el último) y el tramo.
  function rectaTramo(a, b, o = {}) {
    const max = o.max || 200, els = [];
    const k1 = primera(a), k2 = ultima(b);
    for (let k = 1; k * k <= max; k++) {
      // Con `mudo` (ejemplos), ningún punto se pinta: pintar los de adentro diría cuántos son.
      const dentro = !o.mudo && k * k >= a && k * k <= b;
      els.push({ tipo: 'punto', x: k * k, color: dentro ? 'o' : null, abierto: !dentro, fila: 1,
        rotulo: dentro && !o.mudo && (k === k1 || k === k2) ? `${k}²` : '' });
    }
    if (a <= b) els.push({ tipo: 'intervalo', a, b, ca: true, cb: true, fila: 2, rotulo: o.rotulo === undefined ? `de ${a} a ${b}` : o.rotulo });
    return { pieza: 'recta', datos: { min: 0, max, paso: max / 20, cada: 5, decimales: 0, variable: '', filas: 2, elementos: els }, estado: {} };
  }
  // Ahora tú · tipo 0: cuántos cuadrados hay de a hasta b.
  function casoEntre(r) {
    const a = r.ent(101, 900), b = r.ent(1100, 3000), k1 = primera(a), k2 = ultima(b), c = k2 - k1 + 1;
    if (USADOS5.has(`${a}-${b}`) || k1 * k1 === a) return null;
    return {
      pregunta: ['¿Cuántos cuadrados perfectos hay de ', String(a), ' hasta ', ent(b), '?'],
      datos: [D5.contar, D5.seguidos],
      opciones: opciones(c, [
        { id: 'sinuno', valor: c - 1, error: 'AT-SIN-MAS-UNO', siFuera: `Las bases van de ${k1} a ${k2}, bien, pero la resta ${k2} − ${k1} deja fuera una de ellas: hay que sumar 1.` },
        { id: 'desde1', valor: k2, error: 'AT-DESDE-UNO', siFuera: `${k2} cuenta los cuadrados desde 1², pero los menores que ${a} no están en el tramo.` },
        { id: 'dif', valor: isqrt(b - a), error: 'AT-RAIZ-DIF', siFuera: `La raíz de la diferencia, √(${ent(b)} − ${a}), no cuenta cuadrados: lo que se cuenta son las bases, de ${k1} a ${k2}.` },
        { id: 'extremo', valor: c + 1, error: 'AT-EXTREMO', siFuera: `${k1 - 1}² = ${(k1 - 1) ** 2} queda antes de ${a}: no entra.` },
      ]),
      solucion: { texto: `${k1 - 1}² = ${(k1 - 1) ** 2} queda fuera y ${k1}² = ${ent(k1 * k1)} entra; ${k2}² = ${ent(k2 * k2)} entra y ${k2 + 1}² = ${ent((k2 + 1) ** 2)} no.`, ecuacion: [`${k2} − ${k1} + 1 = ${c}`] },
    };
  }
  // Ahora tú · tipo 1: cuadrados o cubos de n cifras (sin los cuadrados de tres cifras: son la predicción).
  function casoCifras(r) {
    const [n, c] = r.de([[2, 2], [2, 4], [2, 5], [3, 2], [3, 3], [3, 4], [3, 5]]);
    const a = 10 ** (c - 1), b = 10 ** c - 1, k1 = primera(a, n), k2 = ultima(b, n), t = k2 - k1 + 1, nom = n === 2 ? 'cuadrados' : 'cubos';
    return {
      pregunta: `¿Cuántos ${nom} perfectos tienen ${c} cifras?`,
      datos: [n === 2 ? D5.contar : D5.cubos, D5.seguidos],
      opciones: opciones(t, [
        { id: 'sinuno', valor: t - 1, error: 'AT-SIN-MAS-UNO', siFuera: `Las bases van de ${k1} a ${k2}, bien, pero la resta deja fuera una de ellas: se cuentan ${k2} − ${k1} + 1.` },
        { id: 'desde1', valor: k2, error: 'AT-DESDE-UNO', siFuera: `${k2} cuenta también los de menos cifras, desde 1${n === 2 ? '²' : '³'}, y esos no van.` },
        { id: 'extremo', valor: t + 1, error: 'AT-EXTREMO', siFuera: `${k1 - 1}${n === 2 ? '²' : '³'} = ${ent((k1 - 1) ** n)} tiene ${c - 1} cifras: no entra.` },
      ]),
      solucion: { texto: `El primero es ${k1}${n === 2 ? '²' : '³'} = ${ent(k1 ** n)} y el último, ${k2}${n === 2 ? '²' : '³'} = ${ent(k2 ** n)}: las bases van de ${k1} a ${k2}.`, ecuacion: [`${k2} − ${k1} + 1 = ${t}`] },
    };
  }
  // Ahora tú · tipo 2: cuántos cubos hay de a hasta b.
  function casoCubosEntre(r) {
    const a = r.ent(30, 400), b = r.ent(1000, 9000), k1 = primera(a, 3), k2 = ultima(b, 3), c = k2 - k1 + 1;
    if (k1 ** 3 === a) return null;
    return {
      pregunta: ['¿Cuántos cubos perfectos hay de ', String(a), ' hasta ', ent(b), '?'],
      datos: [D5.cubos, D5.seguidos],
      opciones: opciones(c, [
        { id: 'sinuno', valor: c - 1, error: 'AT-SIN-MAS-UNO', siFuera: `Las bases van de ${k1} a ${k2}, bien, pero la resta deja fuera una de ellas: hay que sumar 1.` },
        { id: 'cuadrados', valor: ultima(b) - primera(a) + 1, error: 'AT-CUADRADA', siFuera: 'Esos son los cuadrados del tramo, pero se piden los cubos.' },
        { id: 'desde1', valor: k2, error: 'AT-DESDE-UNO', siFuera: `${k2} cuenta los cubos desde 1³, pero los menores que ${a} no entran.` },
      ]),
      solucion: { texto: `${k1}³ = ${ent(k1 ** 3)} es el primero y ${k2}³ = ${ent(k2 ** 3)}, el último: las bases van de ${k1} a ${k2}.`, ecuacion: [`${k2} − ${k1} + 1 = ${c}`] },
    };
  }
  // Ahora tú · tipo 3 (examen): cuántos números del 1 al L son cuadrados o cubos perfectos, sin contar dos veces.
  function casoCuadradoOCubo(r) {
    const L = r.ent(300, 5000), c2 = ultima(L), c3 = ultima(L, 3), c6 = ultima(L, 6), t = c2 + c3 - c6;
    if (L === 200) return null;
    return {
      pregunta: ['¿Cuántos números del 1 al ', ent(L), ' son cuadrados perfectos o cubos perfectos?'],
      datos: [D5.contar, D5.cubos, D5.sexta],
      opciones: opciones(t, [
        { id: 'suma', valor: c2 + c3, error: 'AT-SIN-RESTAR', siFuera: `Contar ${c2} cuadrados y ${c3} cubos está bien, pero ${c6} de ellos son las dos cosas y se contaron dos veces.` },
        { id: 'dos', valor: c2 + c3 - 2 * c6, error: 'AT-RESTA-DOS-VECES', siFuera: 'Los que son cuadrado y cubo a la vez se restan una sola vez: así quedan contados una vez, y no ninguna.' },
        { id: 'ambos', valor: c6, error: 'AT-SOLO-AMBOS', siFuera: `${c6} son los que son cuadrado y cubo a la vez, pero se piden los que son uno u otro.` },
      ]),
      solucion: { texto: `Hay ${c2} cuadrados y ${c3} cubos, pero ${c6} sextas potencias están en los dos grupos: se restan una vez.`, ecuacion: [`${c2} + ${c3} − ${c6} = ${t}`] },
    };
  }
  // Así se resuelve (idea 5): cuántos cuadrados hay de a hasta b, con a y b de cuatro cifras.
  function resuelveEntre(s) {
    const r = azar(s + 900);
    let a, b; do { a = r.ent(1001, 3000); b = r.ent(5000, 9999); } while (primera(a) ** 2 === a || ultima(b) ** 2 === b);
    const k1 = primera(a), k2 = ultima(b), c = k2 - k1 + 1;
    return {
      enunciado: ['¿Cuántos cuadrados perfectos hay de ', ent(a), ' hasta ', ent(b), '?'],
      datos: [D5.contar, D5.seguidos],
      pasos: [
        { tipo: 'pide', texto: 'Piden cuántos cuadrados perfectos caen en el tramo; los extremos también cuentan si fueran cuadrados.' },
        { tipo: 'datos', texto: `El primero: ${k1 - 1}² = ${ent((k1 - 1) ** 2)} queda antes y ${k1}² = ${ent(k1 * k1)} ya entra.`, ecuacion: [`${k1 - 1}² < ${ent(a)} ≤ ${k1}²`] },
        { tipo: 'datos', texto: `El último: ${k2}² = ${ent(k2 * k2)} entra y ${k2 + 1}² = ${ent((k2 + 1) ** 2)} se pasa.`, ecuacion: [`${k2}² ≤ ${ent(b)} < ${k2 + 1}²`] },
        { tipo: 'regla', texto: 'Cada cuadrado del tramo tiene su base, y las bases son enteros seguidos: basta contar las bases.' },
        { tipo: 'cuentas', texto: `Las bases van de ${k1} a ${k2}.`, ecuacion: [`${k2} − ${k1} + 1 = ${c}`] },
      ],
      respuesta: `Hay ${c} cuadrados perfectos`,
    };
  }

  // Ejemplos resueltos (idea 5). Cuentas rehechas aparte (cuentas.py, contando uno por uno): del 1 al 50, 7; de 20 a 40, 2;
  // cubos del 1 al 100, 4; el primer cuadrado mayor que 200, 225; de dos cifras, 6; de 200 a 1 000, 17; cubos de tres cifras,
  // 5; de 55 a 160, 5; cuadrados y cubos a la vez hasta 100, 2 (1 y 64); de 100 a 400, 11. Nivel 3: de cuatro cifras, 68 (32
  // a 99); del 1 al 200, 14 + 5 − 2 = 17; cubos de 3 cifras en base 7 (49 a 342), 3; de 1 000 a 2 000, 13 (32 a 44); de tres
  // cifras e impares, 11 (bases 11, 13, …, 31).
  const EJEMPLOS_CONTAR = [
    { nivel: 1, titulo: 'Del 1 al 50',
      enunciado: '¿Cuántos cuadrados perfectos hay del 1 al 50?',
      datos: [D5.contar],
      figura: rectaTramo(1, 50, { mudo: true, max: 100 }),
      solucion: [{ texto: '7² = 49 entra y 8² = 64 se pasa, así que las bases van de 1 a 7.', ecuacion: ['1, 4, 9, 16, 25, 36, 49'] }],
      respuesta: 'Hay 7' },
    { nivel: 1, titulo: 'De 20 a 40',
      enunciado: '¿Cuántos cuadrados perfectos hay de 20 a 40?',
      datos: [D5.contar],
      solucion: [{ texto: '4² = 16 queda antes; 5² = 25 y 6² = 36 entran; 7² = 49 se pasa.' }],
      respuesta: 'Hay 2: 25 y 36' },
    { nivel: 1, titulo: 'Cubos hasta 100',
      enunciado: '¿Cuántos cubos perfectos hay del 1 al 100?',
      datos: [D5.cubos],
      solucion: [{ texto: '4³ = 64 entra y 5³ = 125 se pasa, así que las bases van de 1 a 4.', ecuacion: ['1, 8, 27, 64'] }],
      respuesta: 'Hay 4' },
    { nivel: 1, titulo: 'El primero después de 200',
      enunciado: '¿Cuál es el primer cuadrado perfecto mayor que 200?',
      datos: ['14 × 14 = 196'],
      solucion: [{ texto: '14² = 196 todavía es menor que 200, así que el primero que lo pasa es el de base 15.', ecuacion: ['15² = 225'] }],
      respuesta: ['225 = ', alK(15)] },
    { nivel: 1, titulo: 'De dos cifras',
      enunciado: '¿Cuántos cuadrados perfectos tienen dos cifras?',
      datos: [D5.contar, D5.seguidos],
      solucion: [{ texto: '3² = 9 tiene una cifra; de 4² = 16 a 9² = 81 tienen dos; 10² = 100 ya tiene tres.', ecuacion: ['9 − 4 + 1 = 6'] }],
      respuesta: 'Hay 6' },
    { nivel: 2, titulo: 'De 200 a 1 000',
      enunciado: '¿Cuántos cuadrados perfectos hay de 200 a 1 000?',
      datos: [D5.contar, D5.seguidos],
      solucion: [
        { texto: 'El primero: 14² = 196 queda antes y 15² = 225 entra. El último: 31² = 961 entra y 32² = 1 024 se pasa.' },
        { texto: 'Las bases van de 15 a 31.', ecuacion: ['31 − 15 + 1 = 17'] },
      ],
      respuesta: 'Hay 17' },
    { nivel: 2, titulo: 'Cubos de tres cifras',
      enunciado: '¿Cuántos cubos perfectos tienen tres cifras?',
      datos: [D5.cubos, D5.seguidos],
      solucion: [
        { texto: '4³ = 64 tiene dos cifras y 5³ = 125, tres. 9³ = 729 tiene tres y 10³ = 1 000, cuatro.' },
        { texto: 'Las bases van de 5 a 9.', ecuacion: ['9 − 5 + 1 = 5'] },
      ],
      respuesta: 'Hay 5' },
    { nivel: 2, titulo: 'Bandejas sin sobrantes',
      enunciado: 'Doña Juana tendrá entre 55 y 160 caramelos. ¿Cuántas cantidades distintas le permiten armar una bandeja cuadrada sin que sobre ninguno?',
      datos: [D5.contar, D5.seguidos],
      figura: rectaTramo(55, 160, { mudo: true }),
      solucion: [
        { texto: 'Son los cuadrados de 55 a 160: 7² = 49 queda antes y 8² = 64 entra; 12² = 144 entra y 13² = 169 se pasa.' },
        { texto: 'Las bases van de 8 a 12.', ecuacion: ['12 − 8 + 1 = 5'] },
      ],
      respuesta: 'Hay 5: 64, 81, 100, 121 y 144' },
    { nivel: 2, titulo: 'Cuadrado y cubo a la vez',
      enunciado: '¿Cuántos números del 1 al 100 son cuadrados perfectos y cubos perfectos a la vez?',
      datos: [D5.sexta],
      solucion: [
        { texto: 'Tienen que ser sextas potencias: 1⁶ = 1 y 2⁶ = 64 entran, y 3⁶ = 729 ya se pasa.', ecuacion: ['64 = 8² = 4³'] },
      ],
      respuesta: 'Hay 2: 1 y 64' },
    { nivel: 2, titulo: 'De 100 a 400',
      enunciado: '¿Cuántos tamaños de bandeja cuadrada, sin sobrantes, se pueden armar con 100 a 400 caramelos?',
      datos: [D5.contar, D5.seguidos],
      solucion: [
        { texto: 'Los dos extremos ya son cuadrados, 100 = 10² y 400 = 20², y los dos entran en la cuenta.' },
        { texto: 'Las bases van de 10 a 20.', ecuacion: ['20 − 10 + 1 = 11'] },
      ],
      respuesta: 'Hay 11' },
    { nivel: 3, titulo: 'Cuadrados de cuatro cifras',
      enunciado: '¿Cuántos cuadrados perfectos tienen cuatro cifras?',
      alternativas: ['68', '67', '99', '69', '90'],
      datos: [D5.contar, D5.seguidos],
      solucion: [
        { texto: '31² = 961 tiene tres cifras y 32² = 1 024, cuatro. 99² = 9 801 tiene cuatro y 100² = 10 000, cinco.', ecuacion: ['99 − 32 + 1 = 68'] },
        { texto: ['Las trampas: ', letra('B'), ' resta sin sumar 1; ', letra('C'), ' cuenta desde 1²; ', letra('D'), ' empieza en 31; ', letra('E'), ' cuenta las bases de dos cifras, de 10 a 99.'] },
      ],
      respuesta: [letra('A'), ': 68'] },
    { nivel: 3, titulo: 'Cuadrados o cubos',
      enunciado: '¿Cuántos números del 1 al 200 son cuadrados perfectos o cubos perfectos?',
      alternativas: ['19', '15', '17', '2', '21'],
      datos: [D5.contar, D5.cubos, D5.sexta],
      solucion: [
        { texto: 'Cuadrados: 1² a 14² = 196, son 14. Cubos: 1³ a 5³ = 125, son 5. Los dos a la vez: 1 y 64, son 2.', ecuacion: ['14 + 5 − 2 = 17'] },
        { texto: ['Las trampas: ', letra('A'), ' no quita los repetidos; ', letra('B'), ' los quita dos veces; ', letra('D'), ' cuenta solo los repetidos; ', letra('E'), ' los suma en vez de restarlos.'] },
      ],
      respuesta: [letra('C'), ': 17'] },
    { nivel: 3, titulo: 'Cubos en base 7',
      enunciado: '¿Cuántos cubos perfectos se escriben con tres cifras en base 7?',
      alternativas: ['4', '6', '2', '7', '3'],
      datos: [D5.cubos, 'En base 7, los de tres cifras van de 100₍₇₎ = 7² hasta 666₍₇₎ = 7³ − 1'],
      solucion: [
        { texto: 'Van de 7² = 49 hasta 7³ − 1 = 342. 3³ = 27 queda antes; 4³ = 64, 5³ = 125 y 6³ = 216 entran, y 7³ = 343 se pasa.', ecuacion: ['6 − 4 + 1 = 3'] },
        { texto: ['Las trampas: ', letra('A'), ' cuenta 343, que ya es 1000₍₇₎; ', letra('B'), ' cuenta desde 1³; ', letra('C'), ' olvida el 64; ', letra('D'), ' da la base.'] },
      ],
      respuesta: [letra('E'), ': 3'] },
    { nivel: 3, titulo: 'De 1 000 a 2 000',
      enunciado: '¿Cuántos cuadrados perfectos hay de 1 000 a 2 000?',
      alternativas: ['12', '14', '44', '13', '31'],
      datos: [D5.contar, D5.seguidos],
      solucion: [
        { texto: '31² = 961 queda antes y 32² = 1 024 entra; 44² = 1 936 entra y 45² = 2 025 se pasa.', ecuacion: ['44 − 32 + 1 = 13'] },
        { texto: ['Las trampas: ', letra('A'), ' resta sin sumar 1; ', letra('B'), ' empieza en 31; ', letra('C'), ' cuenta desde 1²; ', letra('E'), ' saca la raíz de 2 000 − 1 000.'] },
      ],
      respuesta: [letra('D'), ': 13'] },
    { nivel: 3, titulo: 'Impares de tres cifras',
      enunciado: '¿Cuántos cuadrados perfectos de tres cifras son impares?',
      alternativas: ['22', '11', '10', '21', '12'],
      datos: [D5.contar, 'Un número impar al cuadrado da impar; uno par al cuadrado da par'],
      solucion: [
        { texto: 'Los cuadrados de tres cifras tienen bases de 10 a 31, y son impares los de base impar: 11, 13, …, 31.', ecuacion: ['(31 − 11) ÷ 2 + 1 = 11'] },
        { texto: ['Las trampas: ', letra('A'), ' cuenta todos; ', letra('C'), ' olvida el 31; ', letra('D'), ' resta sin sumar 1; ', letra('E'), ' empieza en 9, y 9² = 81 tiene dos cifras.'] },
      ],
      respuesta: [letra('B'), ': 11'] },
  ];

  const contar = {
    id: 'contar',
    titulo: 'Contar cuadrados en un tramo',
    pregunta: '¿Cuántos cuadrados perfectos hay entre dos números?',
    temas: ['Cuadrados y cubos perfectos', 'Raíz cuadrada y cúbica entera'],
    pieza: 'recta',
    aprendizaje: 'Los cuadrados de a hasta b tienen bases desde la primera k con k² ≥ a hasta la última con k² ≤ b: última − primera + 1.',
    actividad: 'Mover los extremos de un tramo y contar los cuadrados que caen dentro.',
    // Lee: las bandejas sin sobrantes de 60 a 110 caramelos, qué es contar en un tramo y qué mirar. No dice cuántos cuadrados
    // de tres cifras hay (eso es Predice).
    lee: {
      tarjetas: [
        { titulo: 'Bandejas sin sobrantes', texto: 'Doña Juana tendrá entre 60 y 110 caramelos y quiere una bandeja cuadrada sin que sobre ninguno. Le sirven 64, 81 y 100: tres cantidades.',
          pieza: CU, dibujo: { datos: { bandejas: [{ k: 8, rotulo: [['8 × 8']] }, { k: 9, rotulo: [['9 × 9']] }, { k: 10, rotulo: [['10 × 10']] }] }, estado: {} } },
        { titulo: 'Cada cuadrado, una base', texto: 'Cada cuadrado tiene su base, el número que se eleva: 64 es 8², 81 es 9² y 100 es 10². Las bases son enteros seguidos: 8, 9 y 10.' },
        { titulo: 'Qué mirar al jugar', texto: 'Mueves el comienzo y el final del tramo, y se pintan los cuadrados que caen dentro. Fíjate qué base tienen el primero y el último.' },
      ],
    },
    ejemplos: EJEMPLOS_CONTAR,
    juega: {
      pieza: 'recta',
      consigna: 'En la recta, cada punto es un cuadrado perfecto. El tramo va de a hasta b, con los dos extremos.',
      mision: {
        // Una sola manera: con a = 50, los cuatro primeros cuadrados son 64, 81, 100 y 121.
        texto: 'Con el tramo desde 50, haz el más corto que tenga 4 cuadrados.',
        logrado: v => v.a === 50 && v.b === 121,
        bien: 'De 50 a 121 entran 64, 81, 100 y 121, con bases de 8 a 11.',
      },
      voz: 'Mira la base del primero y la del último.',
      leyenda: [
        { s: 'a', t: 'dónde empieza el tramo' },
        { s: 'b', t: 'dónde termina el tramo' },
        { s: nu('●'), t: 'un cuadrado perfecto dentro del tramo' },
        { s: '○', t: 'un cuadrado perfecto fuera del tramo' },
      ],
      controles: [
        { id: 'a', etiqueta: 'Comienzo (a)', min: 1, max: 100, paso: 1, inicio: 30, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'Final (b)', min: 1, max: 200, paso: 1, inicio: 80, unidad: '', decimales: 0 },
      ],
      dibujo: v => rectaTramo(v.a, v.b, { rotulo: `a = ${v.a} hasta b = ${v.b}` }),
      lectura: v => {
        if (v.a > v.b) return 'El tramo está al revés: a pasa de b';
        const c = cuenta(v.a, v.b), k1 = primera(v.a), k2 = ultima(v.b);
        return c ? [`De ${v.a} a ${v.b} hay ${c} ${c === 1 ? 'cuadrado' : 'cuadrados'}: de `, alK(k1), ' a ', alK(k2)] : `De ${v.a} a ${v.b} no hay cuadrados`;
      },
      minimo: 3,
    },
    predice: {
      pieza: 'recta',
      pregunta: '¿Cuántos cuadrados perfectos de tres cifras hay?',
      datos: ['10 × 10 = 100', '31 × 31 = 961', '32 × 32 = 1 024'],
      voz: 'Piensa en las bases, no en los cuadrados.',
      opciones: [
        { id: 'c', texto: '22', correcta: true },
        { id: 'sinuno', texto: '21', error: 'AT-SIN-MAS-UNO', siFuera: 'Las bases van de 10 a 31, bien, pero la resta 31 − 10 deja fuera una de ellas: son 22.' },
        { id: 'desde1', texto: '31', error: 'AT-DESDE-UNO', siFuera: '31 cuenta los cuadrados desde 1², pero los de una y dos cifras no van.' },
        { id: 'dif', texto: '29', error: 'AT-RAIZ-DIF', siFuera: 'La raíz de la diferencia, √(999 − 100) ≈ 29,98, no cuenta cuadrados: lo que se cuenta son las bases.' },
      ],
      dibujo: { datos: { min: 0, max: 1100, paso: 50, cada: 4, decimales: 0, variable: '', filas: 1, elementos: [{ tipo: 'intervalo', a: 100, b: 999, ca: true, cb: true, fila: 1, rotulo: 'de 100 a 999' }] }, estado: {} },
      revelar: { datos: { min: 0, max: 1100, paso: 50, cada: 4, decimales: 0, variable: '', filas: 2, elementos: Array.from({ length: 33 }, (_, k) => k + 1).filter(k => k * k <= 1100).map(k => ({ tipo: 'punto', x: k * k, color: k >= 10 && k <= 31 ? 'o' : null, abierto: !(k >= 10 && k <= 31), fila: 1, rotulo: k === 10 || k === 31 ? `${k}²` : '' })).concat([{ tipo: 'intervalo', a: 100, b: 999, ca: true, cb: true, fila: 2, rotulo: 'bases de 10 a 31' }]) }, estado: {} },
      coincide: 'Coincide: las bases van de 10 a 31, y 31 − 10 + 1 = 22.',
      noCoincide: 'Revisemos las bases del primero y del último.',
    },
    mira: {
      pieza: TA,
      datos: { columnas: [{ t: 'base k', color: 'f' }, { t: 'k²', color: 'o' }, { t: '¿tres cifras?' }], filasMax: 6,
        filas: [[{ t: '9', color: 'f' }, { t: '81', color: 'o' }, { t: 'no', tenue: true }], [{ t: '10', color: 'f' }, { t: '100', color: 'o' }, 'sí'], [{ t: '11', color: 'f' }, { t: '121', color: 'o' }, 'sí'],
          ['…', '…', '…'], [{ t: '31', color: 'f' }, { t: '961', color: 'o' }, 'sí'], [{ t: '32', color: 'f' }, { t: '1 024', color: 'o' }, { t: 'no', tenue: true }]] },
      voz: 'Cuenta bases: van seguidas.',
      pasos: [
        { estado: { fila: [0, 1] }, texto: 'El primero de tres cifras: 9² = 81 no llega; 10² = 100 sí.', ecuacion: ['9² < 100 ≤ 10²'] },
        { estado: { fila: [4, 5] }, texto: 'El último: 31² = 961 entra, y 32² = 1 024 ya tiene cuatro cifras.', ecuacion: ['31² ≤ 999 < 32²'] },
        { estado: { fila: [1, 4] }, texto: 'Las bases van de 10 a 31 sin saltarse ninguna: se cuentan una por una.', ecuacion: ['31 − 10 + 1 = 22'] },
        { estado: {}, texto: 'Restar 31 − 10 deja fuera una base: por eso se suma 1.', ecuacion: ['de 1 a 3 hay 3 − 1 + 1 = 3'] },
      ],
    },
    regla: {
      texto: 'Para contar los cuadrados de a hasta b se cuentan sus bases: desde la primera k con k² ≥ a hasta la última con k² ≤ b. Con los cubos se hace lo mismo.',
      ecuacion: [{ llave: ['última − primera + 1'], nota: 'cuántos cuadrados hay' }, SEP, '31 − 10 + 1 = 22'],
      condicion: 'se cuentan los dos extremos. Los números que son cuadrado y cubo a la vez son sextas potencias: al contar «cuadrados o cubos», se restan una vez.',
      voz: 'Cada cuadrado, una base.',
    },
    // Así se resuelve: cuadrados de a hasta b con cuatro cifras. «Ahora tú» pide cuadrados entre dos números de tres y
    // cuatro cifras, cuadrados o cubos de n cifras, cubos en un tramo y cuadrados o cubos sin repetir (examen).
    resuelve: { generar: resuelveEntre },
    ahoraTu: {
      voz: 'Busca la base del primero y la del último.',
      generar(sem) {
        const r = azar(sem + 41);
        return conCuatro([casoEntre, casoCifras, casoCubosEntre, casoCuadradoOCubo][sem % 4], r);
      },
    },
  };


  // ---------- Idea 6 (rehecha, 26 nov): aproximar una raíz por décimas y centésimas ----------
  // Propuesta §1 a §7. Conserva el id `aproximadas` y su predicción (pregunta e ids de las opciones; ahora con Datos).
  // Objeto: la calculadora de doña Juana con √2 en «Lee» y, en el juego, la recta: el número N y el tramo de x² al
  // cuadrado de la décima siguiente. Cambia: N y la décima x. · Permanece: N en la recta. · Progresa: un tramo que no
  // encierra a N → uno que sí. · Se reserva: las centésimas de √2 (la predicción; el juego va por décimas). · Debe verse:
  // si N queda en el tramo de los cuadrados, su raíz queda entre las dos décimas.
  // Errores: AT-MEDIO cree que la raíz está en el medio · AT-COMPROBAR no eleva al cuadrado para comprobar ·
  // E-RSUMA (documentado: Abrate, Pochulu y Vargas, 2006) reparte la raíz en una suma · E-RDIV (documentado: Bejarano,
  // 2022) divide entre el índice · AT-DEFECTO-EXCESO cambia defecto por exceso · AT-RAIZ-DIF y AT-SIN-MAS-UNO, como en la
  // idea 5.
  const D6 = {
    encierra: 'Si x² ≤ N < (x + 0,1)², entonces x ≤ √N < x + 0,1',
    centesima: 'Si x² ≤ N < (x + 0,01)², entonces x ≤ √N < x + 0,01',
    defecto: 'Aproximación por defecto: la menor de las dos; por exceso: la mayor',
    suma: 'La raíz se saca de todo lo que está dentro: primero se opera adentro',
  };
  // Las cuentas con décimas y centésimas van en enteros: t décimas al cuadrado son t² centésimas (sin errores de coma).
  const dec = (t, n = 1) => (t / 10 ** n).toFixed(n).replace('.', ',');  // 31 → «3,1»; 20 → «2,0»
  const cuadDec = (t, n = 1) => f(t * t / 10 ** (2 * n), 2 * n);       // 31 → «9,61»
  const tDe = (N, n = 1) => { const u = 10 ** n; let t = Math.floor(Math.sqrt(N) * u); while (t * t > N * u * u) t--; while ((t + 1) ** 2 <= N * u * u) t++; return t; };
  // 6: la calculadora de «Lee» muestra √6 = 2,4494897; ningún «Ahora tú» pregunta por √6.
  const USADOS6 = new Set([2, 5, 50, 10, 30, 3, 7, 20, 11, 40, 300, 6]);
  // La recta de los cuadrados: N (naranja) y el tramo de x² a (x + 0,1)², con x en décimas (t).
  function rectaDec(N, t, o = {}) {
    const a = t * t / 100, b = (t + 1) ** 2 / 100;
    const min = o.min !== undefined ? o.min : 0, max = o.max !== undefined ? o.max : 22;
    return { pieza: 'recta', datos: { min, max, paso: o.paso || 1, cada: o.cada || 5, decimales: 2, variable: '', filas: 2, elementos: [
      { tipo: 'punto', x: N, color: 'o', fila: 1, rotulo: `N = ${f(N, 2)}` },
      { tipo: 'intervalo', a, b, ca: true, cb: false, fila: 2, rotulo: o.mudo ? 'tramo de cuadrados' : `${dec(t)}² a ${dec(t + 1)}²` },
    ] }, estado: {} };
  }
  // Ahora tú · tipo 0: entre qué décimas está √N.
  function casoDecimas(r) {
    const N = r.ent(2, 99), t = tDe(N);
    if (isqrt(N) ** 2 === N || USADOS6.has(N)) return null;
    const txt = u => `Entre ${dec(u)} y ${dec(u + 1)}`, k = isqrt(N);
    const medio = 10 * k + 5;
    return {
      pregunta: ['¿Entre qué décimas seguidas está √', nu(N), '?'],
      datos: [D6.encierra, `${k}² = ${k * k}; ${k + 1}² = ${(k + 1) ** 2}`],
      opciones: opciones(txt(t), [
        { id: 'arriba', valor: txt(t + 1), error: 'AT-COMPROBAR', siFuera: `${dec(t + 1)}² = ${cuadDec(t + 1)} ya pasa de ${N}, así que la raíz está antes de ${dec(t + 1)}.` },
        { id: 'abajo', valor: txt(t - 1), error: 'AT-COMPROBAR', siFuera: `${dec(t)}² = ${cuadDec(t)} todavía no pasa de ${N}: la raíz está después de ${dec(t)}.` },
        { id: 'medio', valor: medio !== t && medio !== t + 1 && medio !== t - 1 ? txt(medio) : null, error: 'AT-MEDIO', siFuera: `No se puede suponer que la raíz queda en el medio de ${k} y ${k + 1}: hay que elevar al cuadrado para comprobar.` },
      ]),
      solucion: { texto: `${dec(t)}² cabe en ${N} y ${dec(t + 1)}² ya se pasa: la raíz está entre las dos décimas.`, ecuacion: [`${dec(t)}² = ${cuadDec(t)} ≤ ${N} < ${cuadDec(t + 1)} = ${dec(t + 1)}²`] },
    };
  }
  // Ahora tú · tipo 1 (examen): el lado de un terreno cuadrado, por centésimas.
  function casoCentesimas(r) {
    const N = r.ent(3, 60), t = tDe(N, 2), t1 = tDe(N);
    if (isqrt(N) ** 2 === N || USADOS6.has(N)) return null;
    const txt = u => `Entre ${dec(u, 2)} y ${dec(u + 1, 2)} m`;
    return {
      pregunta: ['Un terreno cuadrado tiene ', nu(N), ' m² de área. Su lado está entre ', `${dec(t1)} y ${dec(t1 + 1)} m. ¿Entre qué centésimas está?`],
      datos: [D6.centesima, `${dec(t, 2)}² = ${cuadDec(t, 2)}; ${dec(t + 1, 2)}² = ${cuadDec(t + 1, 2)}; ${dec(t + 2, 2)}² = ${cuadDec(t + 2, 2)}`, 'El lado de un cuadrado es la raíz de su área'],
      opciones: opciones(txt(t), [
        { id: 'arriba', valor: txt(t + 1), error: 'AT-COMPROBAR', siFuera: `${dec(t + 1, 2)}² = ${cuadDec(t + 1, 2)} ya pasa de ${N}, así que el lado está antes de ${dec(t + 1, 2)} m.` },
        { id: 'abajo', valor: t - 1 >= 10 * t1 ? txt(t - 1) : null, error: 'AT-COMPROBAR', siFuera: `${dec(t, 2)}² = ${cuadDec(t, 2)} todavía no pasa de ${N}, así que el lado está después de ${dec(t, 2)} m.` },
        { id: 'medio', valor: txt(10 * t1 + 5) !== txt(t) ? txt(10 * t1 + 5) : null, error: 'AT-MEDIO', siFuera: `No se puede suponer que el lado está en el medio de ${dec(t1)} y ${dec(t1 + 1)}: hay que elevar al cuadrado para comprobar.` },
        { id: 'arriba2', valor: txt(t + 2), error: 'AT-COMPROBAR', siFuera: `${dec(t + 2, 2)}² = ${cuadDec(t + 2, 2)} ya pasa de ${N}.` },
      ]),
      solucion: { texto: `${dec(t, 2)}² cabe en ${N} y ${dec(t + 1, 2)}² ya se pasa: el lado está entre esas dos centésimas.`, ecuacion: [`${cuadDec(t, 2)} ≤ ${N} < ${cuadDec(t + 1, 2)}`] },
    };
  }
  // Ahora tú · tipo 2: la aproximación por exceso (o por defecto) al décimo.
  function casoDefectoExceso(r) {
    const N = r.ent(2, 99), t = tDe(N), exceso = r() < 0.5;
    // N ≥ 5: con N = 2 o 3, N/2 al cuadrado no pasa de N y el siFuera de E-RDIV sería falso.
    if (N < 5 || isqrt(N) ** 2 === N || USADOS6.has(N)) return null;
    const bien = exceso ? t + 1 : t, otro = exceso ? t : t + 1, lejos = exceso ? t + 2 : t - 1;
    return {
      pregunta: ['¿Cuál es la aproximación por ', exceso ? 'exceso' : 'defecto', ' de √', nu(N), ' a la décima?'],
      datos: [D6.encierra, D6.defecto, `${dec(t)}² = ${cuadDec(t)}; ${dec(t + 1)}² = ${cuadDec(t + 1)}`],
      opciones: opciones(dec(bien), [
        { id: 'otro', valor: dec(otro), error: 'AT-DEFECTO-EXCESO', siFuera: `El tramo de ${dec(t)} a ${dec(t + 1)} está bien, pero por ${exceso ? 'exceso se toma la mayor' : 'defecto se toma la menor'} de las dos.` },
        { id: 'mitad', valor: f(N / 2, 1), error: 'E-RDIV', siFuera: `Dividir ${N} entre 2 no es sacar raíz: ${f(N / 2, 1)}² pasa de ${N}.` },
        { id: 'lejos', valor: dec(lejos), error: 'AT-COMPROBAR', siFuera: exceso
          ? `${dec(lejos)}² = ${cuadDec(lejos)} pasa de ${N}, pero ${dec(t + 1)}² = ${cuadDec(t + 1)} ya pasaba: por exceso va la primera décima que se pasa.`
          : `${dec(lejos)}² = ${cuadDec(lejos)} cabe en ${N}, pero ${dec(t)}² = ${cuadDec(t)} también cabe: por defecto va la mayor décima que cabe.` },
      ]),
      solucion: { texto: `√${N} está entre ${dec(t)} y ${dec(t + 1)}, y por ${exceso ? 'exceso se toma la mayor' : 'defecto se toma la menor'}.`, ecuacion: [`${cuadDec(t)} ≤ ${N} < ${cuadDec(t + 1)}`] },
    };
  }
  // Ahora tú · tipo 3: la raíz de una suma (E-RSUMA).
  function casoRaizSuma(r) {
    const [a, b, c] = r.de([[9, 16, 5], [36, 64, 10], [25, 144, 13], [64, 225, 17], [81, 144, 15], [144, 256, 20], [49, 576, 25], [16, 9, 5]]);
    if (a === 9 || a === 144 && b === 25) return null;
    return {
      pregunta: `¿Cuánto vale √(${a} + ${b})?`,
      datos: [D6.suma],
      opciones: opciones(c, [
        { id: 'reparte', valor: Math.sqrt(a) + Math.sqrt(b), error: 'E-RSUMA', siFuera: `Eso es √${a} + √${b}, pero la raíz no se reparte: primero se suma ${a} + ${b} = ${a + b}.` },
        { id: 'mitad', valor: f((a + b) / 2, 1), error: 'E-RDIV', siFuera: `Sumar primero está bien, pero sacar raíz no es dividir entre 2: se busca el número que al cuadrado da ${a + b}.` },
        { id: 'sinraiz', valor: a + b, error: 'AT-SIN-RAIZ', siFuera: `La suma, ${a + b}, está bien, pero falta sacarle la raíz.` },
      ]),
      solucion: { texto: `Primero se hace la suma de adentro, ${a} + ${b} = ${a + b}, y después se saca la raíz.`, ecuacion: [`√(${a} + ${b}) = √${a + b} = ${c}`] },
    };
  }
  // Así se resuelve (idea 6): encerrar por décimas la raíz de un número de dos cifras.
  function resuelveDecimas(s) {
    const r = azar(s + 900);
    let N; do { N = r.ent(21, 99); } while (isqrt(N) ** 2 === N || USADOS6.has(N));
    const k = isqrt(N), t = tDe(N);
    return {
      enunciado: ['Encierra √', nu(N), ' entre dos décimas seguidas.'],
      datos: [D6.encierra],
      dibujo: rectaDec(N, t, { min: k * k - 1, max: (k + 1) ** 2 + 1, paso: 1, cada: 5, mudo: true }),
      pasos: [
        { tipo: 'pide', texto: 'Piden dos décimas seguidas, x y x + 0,1, que encierren la raíz.' },
        { tipo: 'datos', texto: `Primero los enteros: ${k}² = ${k * k} ≤ ${N} < ${(k + 1) ** 2} = ${k + 1}². La raíz está entre ${k} y ${k + 1}.` },
        { tipo: 'regla', texto: 'Pruebo décimas desde abajo, elevando al cuadrado, hasta que una se pase de N.' },
        { tipo: 'cuentas', texto: `${dec(t)}² todavía cabe; ${dec(t + 1)}² ya se pasa.`, ecuacion: [`${dec(t)}² = ${cuadDec(t)} ≤ ${N} < ${cuadDec(t + 1)} = ${dec(t + 1)}²`],
          dibujo: rectaDec(N, t, { min: k * k - 1, max: (k + 1) ** 2 + 1, paso: 1, cada: 5 }) },
        { tipo: 'sentido', texto: `El tramo mide 0,1, así que cualquiera de las dos décimas se separa de la raíz menos de una décima.` },
      ],
      respuesta: ['Entre ', ra(dec(t)), ' y ', ra(dec(t + 1))],
    };
  }

  // Ejemplos resueltos (idea 6). Cuentas rehechas aparte (cuentas.py, con décimas como enteros): 2² = 4 < 5 < 9 = 3²;
  // 7² = 49 < 50 < 64 = 8²; √(36 + 64) = √100 = 10; 2,2² = 4,84 < 5; √10: 9 < 10 < 16; 2,2² = 4,84 ≤ 5 < 5,29 = 2,3²;
  // 5,4² = 29,16 ≤ 30 < 30,25 = 5,5²; 1,73² = 2,9929 ≤ 3 < 3,0276 = 1,74²; 2,6² = 6,76 ≤ 7 < 7,29 = 2,7²; 4,4² = 19,36 ≤
  // 20 < 20,25 = 4,5². Nivel 3: 3,31² = 10,9561 ≤ 11 < 11,0224 = 3,32²; 7² = 49 ≤ 50 < 50,41 = 7,1²; √(144 + 25) = √169 = 13;
  // 6,3² = 39,69 ≤ 40 < 40,96 = 6,4²; enteros entre √50 ≈ 7,07 y √300 ≈ 17,3: de 8 a 17, son 10.
  const EJEMPLOS_APROX = [
    { nivel: 1, titulo: '√5 entre enteros',
      enunciado: '¿Entre qué enteros seguidos está √5?',
      datos: ['2² = 4; 3² = 9'],
      solucion: [{ texto: '5 está entre 4 y 9, así que su raíz está entre 2 y 3.', ecuacion: ['2² = 4 < 5 < 9 = 3²'] }],
      respuesta: ['Entre ', ra(2), ' y ', ra(3)] },
    { nivel: 1, titulo: '√50 entre enteros',
      enunciado: '¿Entre qué enteros seguidos está √50?',
      datos: ['7² = 49; 8² = 64'],
      solucion: [{ texto: '50 está entre 49 y 64, así que su raíz está entre 7 y 8.', ecuacion: ['49 < 50 < 64'] }],
      respuesta: ['Entre ', ra(7), ' y ', ra(8)] },
    { nivel: 1, titulo: 'La raíz de una suma',
      enunciado: '¿Cuánto vale √(36 + 64)?',
      datos: [D6.suma],
      solucion: [{ texto: 'Primero se suma lo de adentro y después se saca la raíz. Repartirla daría √36 + √64 = 14, que es otro número.', ecuacion: ['√(36 + 64) = √100 = 10'] }],
      respuesta: ['Vale ', ra(10)] },
    { nivel: 1, titulo: '¿Más o menos que 2,2?',
      enunciado: '¿√5 es mayor o menor que 2,2?',
      datos: ['2,2 × 2,2 = 4,84'],
      solucion: [{ texto: '2,2² = 4,84 todavía es menor que 5: la raíz de 5 está después de 2,2.', ecuacion: ['4,84 < 5'] }],
      respuesta: 'Mayor que 2,2' },
    { nivel: 1, titulo: 'Por defecto, al entero',
      enunciado: '¿Cuál es la aproximación por defecto de √10 al entero?',
      datos: [D6.defecto, '3² = 9; 4² = 16'],
      solucion: [{ texto: '√10 está entre 3 y 4, y por defecto se toma la menor.', ecuacion: ['9 < 10 < 16'] }],
      respuesta: ['Es ', ra(3)] },
    { nivel: 2, titulo: '√5 por décimas',
      enunciado: '¿Entre qué décimas seguidas está √5?',
      datos: [D6.encierra],
      figura: rectaDec(5, 22, { min: 4, max: 6, paso: 0.1, cada: 5, mudo: true }),
      solucion: [
        { texto: 'Está entre 2 y 3. Se prueban décimas: 2,1² = 4,41 y 2,2² = 4,84 caben, y 2,3² = 5,29 se pasa.' },
        { texto: 'El tramo de 2,2 a 2,3 encierra la raíz.', ecuacion: ['2,2² = 4,84 ≤ 5 < 5,29 = 2,3²'] },
      ],
      respuesta: ['Entre ', ra('2,2'), ' y ', ra('2,3')] },
    { nivel: 2, titulo: '√30 por décimas',
      enunciado: '¿Entre qué décimas seguidas está √30?',
      datos: [D6.encierra],
      solucion: [
        { texto: '5² = 25 y 6² = 36, así que está entre 5 y 6. Como 30 queda cerca del medio, conviene probar cerca de 5,5.' },
        { texto: '5,4² = 29,16 cabe y 5,5² = 30,25 se pasa.', ecuacion: ['29,16 ≤ 30 < 30,25'] },
      ],
      respuesta: ['Entre ', ra('5,4'), ' y ', ra('5,5')] },
    { nivel: 2, titulo: '√3 por centésimas',
      enunciado: '√3 está entre 1,7 y 1,8. ¿Entre qué centésimas está?',
      datos: [D6.centesima],
      solucion: [
        { texto: 'Se prueban centésimas desde 1,71: 1,71² = 2,9241 y 1,72² = 2,9584 caben, y 1,73² = 2,9929 también cabe.' },
        { texto: '1,74² = 3,0276 ya se pasa.', ecuacion: ['1,73² = 2,9929 ≤ 3 < 3,0276 = 1,74²'] },
      ],
      respuesta: ['Entre ', ra('1,73'), ' y ', ra('1,74')] },
    { nivel: 2, titulo: 'Por exceso, al décimo',
      enunciado: '¿Cuál es la aproximación por exceso de √7 a la décima?',
      datos: [D6.encierra, D6.defecto],
      solucion: [
        { texto: '2,6² = 6,76 cabe y 2,7² = 7,29 se pasa.', ecuacion: ['6,76 ≤ 7 < 7,29'] },
        { texto: 'Por exceso se toma la mayor de las dos.' },
      ],
      respuesta: ['Es ', ra('2,7')] },
    { nivel: 2, titulo: 'El lado de un piso',
      enunciado: 'Un piso cuadrado tiene 20 m² de área. ¿Cuánto mide su lado, por defecto a la décima?',
      datos: [D6.encierra, D6.defecto, 'El lado de un cuadrado es la raíz de su área'],
      solucion: [
        { texto: '4² = 16 y 5² = 25, así que el lado está entre 4 y 5 m.' },
        { texto: '4,4² = 19,36 cabe y 4,5² = 20,25 se pasa.', ecuacion: ['19,36 ≤ 20 < 20,25'] },
      ],
      respuesta: ['Unos ', ra('4,4 m'), ' por defecto'] },
    { nivel: 3, titulo: '√11 por centésimas',
      enunciado: '¿Entre qué centésimas seguidas está √11?',
      alternativas: ['3,30 y 3,31', '3,31 y 3,32', '3,32 y 3,33', '3,35 y 3,36', '3,3 y 3,4'],
      datos: [D6.centesima, '3,3 × 3,3 = 10,89'],
      solucion: [
        { texto: '3,3² = 10,89 cabe, así que se prueba desde 3,31: 3,31² = 10,9561 cabe y 3,32² = 11,0224 se pasa.', ecuacion: ['10,9561 ≤ 11 < 11,0224'] },
        { texto: ['Las trampas: ', letra('A'), ' se detiene un paso antes; ', letra('C'), ', uno después; ', letra('D'), ' supone el medio; ', letra('E'), ' son décimas, no centésimas.'] },
      ],
      respuesta: [letra('B'), ': ', ra('3,31'), ' y ', ra('3,32')] },
    { nivel: 3, titulo: '√50 con error menor que 0,1',
      enunciado: '¿Cuál es la aproximación por defecto de √50 con un error menor que 0,1?',
      alternativas: ['7,0', '7,1', '7,5', '25', '7,2'],
      datos: [D6.encierra, D6.defecto],
      solucion: [
        { texto: '7² = 49 cabe y 7,1² = 50,41 se pasa: √50 está entre 7,0 y 7,1.', ecuacion: ['49 ≤ 50 < 50,41'] },
        { texto: ['Las trampas: ', letra('B'), ' es por exceso; ', letra('C'), ' supone el medio de 7 y 8; ', letra('D'), ' divide 50 entre 2; ', letra('E'), ' se pasa: 7,2² = 51,84.'] },
      ],
      respuesta: [letra('A'), ': ', ra('7,0')] },
    { nivel: 3, titulo: 'La raíz de 144 + 25',
      enunciado: '¿Cuánto vale √(144 + 25)?',
      alternativas: ['17', '12', '13', '84,5', '169'],
      datos: [D6.suma],
      solucion: [
        { texto: 'Primero se hace la suma, 144 + 25 = 169, y después se saca la raíz: 13 × 13 = 169.', ecuacion: ['√(144 + 25) = √169 = 13'] },
        { texto: ['Las trampas: ', letra('A'), ' reparte la raíz, 12 + 5; ', letra('B'), ' olvida el 25; ', letra('D'), ' divide entre 2; ', letra('E'), ' no saca la raíz.'] },
      ],
      respuesta: [letra('C'), ': ', ra(13)] },
    { nivel: 3, titulo: 'Un terreno de 40 m²',
      enunciado: 'Un terreno cuadrado tiene 40 m² de área. ¿Cuánto mide su lado, por exceso a la décima?',
      alternativas: ['6,3', '6,2', '20', '6,4', '10'],
      datos: [D6.encierra, D6.defecto, 'El lado de un cuadrado es la raíz de su área'],
      solucion: [
        { texto: '6² = 36 y 7² = 49, así que el lado está entre 6 y 7. 6,3² = 39,69 cabe y 6,4² = 40,96 se pasa.', ecuacion: ['39,69 ≤ 40 < 40,96'] },
        { texto: ['Por exceso se toma la mayor. Las trampas: ', letra('A'), ' es por defecto; ', letra('B'), ' se queda una décima antes; ', letra('C'), ' divide entre 2; ', letra('E'), ' divide entre 4, como un perímetro.'] },
      ],
      respuesta: [letra('D'), ': ', ra('6,4 m')] },
    { nivel: 3, titulo: 'Enteros entre dos raíces',
      enunciado: '¿Cuántos enteros hay entre √50 y √300?',
      alternativas: ['250', '15', '17', '9', '10'],
      datos: ['7² = 49; 8² = 64; 17² = 289; 18² = 324', D5.seguidos],
      solucion: [
        { texto: '√50 está entre 7 y 8, y √300 entre 17 y 18. Los enteros del medio van de 8 a 17.', ecuacion: ['17 − 8 + 1 = 10'] },
        { texto: ['Las trampas: ', letra('A'), ' resta 300 − 50; ', letra('B'), ' saca la raíz de la diferencia; ', letra('C'), ' cuenta desde 1; ', letra('D'), ' no suma 1.'] },
      ],
      respuesta: [letra('E'), ': 10'] },
  ];

  const aproximadas = {
    id: 'aproximadas',
    titulo: 'Aproximar una raíz por décimas',
    pregunta: '¿Cómo se acerca uno a √2 sin calculadora?',
    temas: ['Raíces aproximadas'],
    pieza: 'recta',
    aprendizaje: '√N está entre x y x + 0,1 si x² ≤ N < (x + 0,1)², y se afina por centésimas. El error es menor que el paso.',
    actividad: 'Probar décimas en la recta hasta encerrar una raíz.',
    // Lee: la calculadora con √6 (no √2: su pantalla, 1,4142135, respondía la Predice; auditoría 26 nov), décimas y centésimas, y qué mirar.
    lee: {
      tarjetas: [
        { titulo: 'La calculadora de doña Juana', texto: 'En la calculadora de doña Juana, √6 da 2,4494897 y la pantalla se llena. Las cifras de √6 nunca terminan ni se repiten: es un número irracional.',
          pieza: CA, dibujo: { datos: { casillas: 8, calcs: [{ cuenta: '√6', pantalla: '2,4494897', rotulo: 'no termina' }] }, estado: {} } },
        { titulo: 'Décimas y centésimas', texto: 'Una décima es 0,1 y una centésima, 0,01: entre 3,1 y 3,2 caben 3,11, 3,12, 3,13… Con un paso más fino, la aproximación queda más cerca del valor exacto.' },
        { titulo: 'Qué mirar al jugar', texto: ['Eliges ', nu('N'), ' y una décima ', ra('x'), ', y la recta marca el tramo que va de x² al cuadrado de la décima siguiente. Fíjate si N cae dentro de ese tramo.'] },
      ],
    },
    ejemplos: EJEMPLOS_APROX,
    juega: {
      pieza: 'recta',
      consigna: 'Sin la tecla √, doña Juana eleva décimas al cuadrado y mira si N cae en el tramo. La recta mide N y los cuadrados.',
      mision: {
        // Una sola manera en la grilla: N = 10 y x = 3,1.
        texto: 'Encierra √10 entre dos décimas seguidas.',
        logrado: v => v.N === 10 && Math.round(v.x * 10) === 31,
        bien: '3,1² = 9,61 cabe y 3,2² = 10,24 se pasa: √10 está entre 3,1 y 3,2.',
      },
      voz: 'Eleva al cuadrado: no adivines a ojo.',
      leyenda: [
        { s: nu('N'), t: 'el número del que se busca la raíz' },
        { s: ra('x'), t: 'la décima que se prueba' },
        { s: 'tramo', t: 'de x² a (x + 0,1)²' },
      ],
      controles: [
        { id: 'N', etiqueta: 'Número (N)', color: 'c-o', min: 2, max: 20, paso: 1, inicio: 7, unidad: '', decimales: 0 },
        { id: 'x', etiqueta: 'Décima (x)', color: 'c-f', min: 1, max: 4.4, paso: 0.1, inicio: 2, unidad: '', decimales: 1 },
      ],
      dibujo: v => rectaDec(v.N, Math.round(v.x * 10)),
      lectura: v => {
        const t = Math.round(v.x * 10), dentro = t * t <= v.N * 100 && v.N * 100 < (t + 1) ** 2;
        return dentro ? [`${dec(t)}² = ${cuadDec(t)} ≤ `, nu(v.N), ` < ${cuadDec(t + 1)} = ${dec(t + 1)}²: el tramo encierra a N`]
          : [`${dec(t)}² = ${cuadDec(t)} y ${dec(t + 1)}² = ${cuadDec(t + 1)}: `, nu(v.N), ' queda fuera'];
      },
      minimo: 3,
    },
    predice: {
      pieza: 'recta',
      pregunta: '√2 está entre 1,4 y 1,5, porque 1,96 < 2 < 2,25. ¿Entre qué centésimas está?',
      datos: ['1,41 × 1,41 = 1,9881', '1,42 × 1,42 = 2,0164', '1,45 × 1,45 = 2,1025'],
      voz: 'Usa los cuadrados de los Datos.',
      opciones: [
        { id: 'c', texto: 'Entre 1,41 y 1,42', correcta: true },
        { id: 'medio', texto: 'Entre 1,45 y 1,46', error: 'AT-MEDIO', siFuera: 'Eso pasaría si 2 quedara en el medio de 1,96 y 2,25, pero está mucho más cerca de 1,96.' },
        { id: 'abajo', texto: 'Entre 1,40 y 1,41', error: 'AT-COMPROBAR', siFuera: '1,41² = 1,9881 todavía es menor que 2: la raíz está después de 1,41.' },
        { id: 'arriba', texto: 'Entre 1,42 y 1,43', error: 'AT-COMPROBAR', siFuera: '1,42² = 2,0164 ya se pasa de 2, así que la raíz está antes de 1,42.' },
      ],
      dibujo: { datos: { min: 1.9, max: 2.3, paso: 0.05, cada: 2, decimales: 2, variable: '', filas: 2, elementos: [
        { tipo: 'punto', x: 2, color: 'o', fila: 1, rotulo: 'N = 2' },
        { tipo: 'intervalo', a: 1.96, b: 2.25, ca: true, cb: false, fila: 2, rotulo: '1,4² a 1,5²' }] }, estado: {} },
      revelar: { datos: { min: 1.9, max: 2.3, paso: 0.05, cada: 2, decimales: 2, variable: '', filas: 2, elementos: [
        { tipo: 'punto', x: 2, color: 'o', fila: 1, rotulo: 'N = 2' },
        { tipo: 'intervalo', a: 1.9881, b: 2.0164, ca: true, cb: false, color: 'f', fila: 2, rotulo: '1,41² a 1,42²' }] }, estado: {} },
      coincide: 'Coincide: 1,41² = 1,9881 < 2 < 2,0164 = 1,42².',
      noCoincide: 'Revisemos los cuadrados de los Datos.',
    },
    mira: {
      pieza: 'recta',
      datos: { min: 1.9, max: 2.3, paso: 0.05, cada: 2, decimales: 2, variable: '', filas: 3, elementos: [
        { tipo: 'punto', x: 2, color: 'o', fila: 3, rotulo: 'N = 2' },
        { tipo: 'intervalo', a: 1.96, b: 2.25, ca: true, cb: false, fila: 1, rotulo: '1,4² a 1,5²', desde: 1 },
        { tipo: 'intervalo', a: 1.9881, b: 2.0164, ca: true, cb: false, color: 'f', fila: 2, rotulo: '1,41² a 1,42²', desde: 2 }] },
      voz: 'Cada paso achica el tramo diez veces.',
      pasos: [
        { estado: { corte: 0 }, texto: 'Se busca √2: un número que, al cuadrado, dé 2.', ecuacion: ['√2 = ?'] },
        { estado: { corte: 1 }, texto: 'Por décimas, 1,4² = 1,96 y 1,5² = 2,25 encierran a 2.', ecuacion: ['1,96 ≤ 2 < 2,25'] },
        { estado: { corte: 2 }, texto: 'Por centésimas, 1,41² = 1,9881 cabe y 1,42² = 2,0164 se pasa.', ecuacion: ['1,41 ≤ √2 < 1,42'] },
        { estado: { corte: 2 }, texto: 'El tramo mide 0,01, así que el error de 1,41 es menor que una centésima.', ecuacion: ['√2 ≈ 1,41'] },
      ],
    },
    regla: {
      texto: 'Si x² ≤ N < (x + 0,1)², √N está entre x y x + 0,1: x es la aproximación por defecto y x + 0,1, por exceso. Por centésimas se hace lo mismo con 0,01.',
      ecuacion: [{ llave: [ra('x'), '² ≤ ', nu('N'), ' < (', ra('x'), ' + 0,1)²'], nota: 'el tramo encierra a N' }, SEP, ra('x'), ' ≤ √', nu('N'), ' < ', ra('x'), ' + 0,1'],
      condicion: 'N es positivo, y el error es menor que el paso. Si N es una suma, primero se suma: la raíz no se reparte, √(9 + 16) = 5, no 7.',
      voz: 'Comprueba siempre elevando al cuadrado.',
    },
    // Así se resuelve: encerrar por décimas una raíz de dos cifras. «Ahora tú» pide décimas, centésimas (un terreno, de
    // examen), la aproximación por defecto o por exceso y la raíz de una suma.
    resuelve: { pieza: 'recta', generar: resuelveDecimas },
    ahoraTu: {
      voz: 'Eleva cada candidato al cuadrado.',
      generar(sem) {
        const r = azar(sem + 41);
        return conCuatro([casoDecimas, casoCentesimas, casoDefectoExceso, casoRaizSuma][sem % 4], r);
      },
    },
  };

  // ---------- Laboratorio (rehecho, 26 nov): una mesa por idea, más amplia que su juego ----------
  // Las mismas cuentas y los mismos colores de la unidad (def.colores). La mesa de los cuatro primos amplía la idea 1; la
  // de 200 caramelos, la 3; el cubo hasta 250 cubitos, la 4 (antes se asignaba a la 3); la de encerrar cualquier raíz
  // hasta 99, la 6.
  const residuo = Nv => Nv - isqrt(Nv) ** 2;
  const mismo = (g, v, ks) => g.some(x => ks.every(k => x[k] === v[k]));
  const PR4 = [2, 3, 5, 7];
  const clasif = es => { const c = es.every(e => e % 2 === 0), u = es.every(e => e % 3 === 0); return c && u ? 'cuadrado y cubo' : c ? 'cuadrado perfecto' : u ? 'cubo perfecto' : 'ni cuadrado ni cubo'; };
  const tablaExp4 = es => ({
    columnas: [{ t: 'primo' }, { t: 'exponente', color: 'i' }, { t: '¿par?' }, { t: '¿múltiplo de 3?' }],
    filas: PR4.map((p, i) => [String(p), { t: String(es[i]), color: 'i' }, es[i] % 2 === 0 ? 'sí' : 'no', es[i] % 3 === 0 ? 'sí' : 'no']),
    filasMax: 4, cabeza: true,
  });
  const laboratorio = [
    {
      id: 'cubo-de-cubitos', titulo: 'El cubo de cubitos', pieza: 'ari-cubitos-3d',
      consigna: 'Gira el cubo con el dedo. Cambia N: los cubitos que no caben en el mayor cubo quedan en carmín.',
      controles: [
        { id: 'N', etiqueta: 'Cubitos (N)', color: 'c-o', min: 1, max: 250, paso: 1, inicio: 50, unidad: '', decimales: 0 },
        { id: 'sep', etiqueta: 'Cáscara', opciones: [{ valor: 0, texto: 'Pegada' }, { valor: 1, texto: 'Aparte' }] },
      ],
      dibujo: v => cuboDe(v.N, v.sep === 1),
      lectura: v => { const k = cub(v.N); return [nu('N'), ` = ${v.N} = `, alK(k, 3), ' + ', re(v.N - k ** 3), `: faltan ${(k + 1) ** 3 - v.N}`]; },
      invitaciones: [
        { texto: 'Arma un cubo perfecto de más de 100 cubitos.',
          logrado: v => cub(v.N) ** 3 === v.N && v.N > 100,
          bien: 'No sobra ningún cubito: la raíz cúbica es exacta.',
          pista: 'Busca un N sin cubitos en carmín: 5 × 5 × 5 o 6 × 6 × 6.' },
        { texto: 'Pon la cáscara aparte y llena justo sus tres caras grandes.',
          logrado: v => { const k = cub(v.N); return v.sep === 1 && k > 1 && v.N - k ** 3 === 3 * k * k; },
          bien: 'Tres caras de k × k: el primer paso para el cubo siguiente.',
          pista: 'Con arista 3, las tres caras piden 3 × 9 = 27 cubitos.' },
        { texto: 'Haz que falte un solo cubito para el cubo siguiente.',
          logrado: v => (cub(v.N) + 1) ** 3 - v.N === 1,
          bien: 'Falta la esquina: sobran 3k² + 3k, lo más que puede sobrar.',
          pista: 'Pon la cáscara aparte y busca la esquina vacía.' },
        { texto: 'Encuentra un N mayor que 1 que sea cuadrado y cubo perfecto a la vez.',
          logrado: v => v.N > 1 && cub(v.N) ** 3 === v.N && residuo(v.N) === 0,
          bien: '64 = 8² = 4³: es una sexta potencia, 2⁶.',
          pista: 'Revisa los cubos perfectos uno por uno: ¿cuál es también cuadrado?' },
      ],
    },
    {
      id: 'raiz-grande', titulo: 'Bandejas hasta 200 caramelos', pieza: CU,
      consigna: 'Elige N hasta 200. Doña Juana arma la mayor bandeja cuadrada y pone los que sobran en el borde de la siguiente.',
      controles: [{ id: 'N', etiqueta: 'Caramelos (N)', color: 'c-o', min: 2, max: 200, paso: 1, inicio: 50, unidad: '', decimales: 0 }],
      dibujo: v => sobra(v.N),
      lectura: v => { const k = isqrt(v.N), rr = v.N - k * k; return [nu('N'), ` = ${v.N} = `, alK(k), ' + ', re(rr), `: faltan ${2 * k + 1 - rr}`]; },
      invitaciones: [
        { texto: 'Consigue que no sobre ningún caramelo.',
          logrado: v => residuo(v.N) === 0,
          bien: 'Residuo 0: N es un cuadrado perfecto y su raíz es exacta.' },
        { texto: 'Busca la bandeja cuadrada más grande de esta mesa, sin sobrantes.',
          logrado: v => residuo(v.N) === 0 && isqrt(v.N) === 14,
          bien: '14² = 196; la de 15 × 15 ya pide 225.' },
        { texto: 'Haz que falte justo un caramelo para la bandeja siguiente.',
          logrado: v => (isqrt(v.N) + 1) ** 2 - v.N === 1,
          bien: 'Sobran 2k, lo más que puede sobrar: solo falta la esquina.' },
        { texto: 'Guarda dos N con la misma raíz entera y distinto residuo.',
          logrado: (v, g) => mismo(g, v, ['N']) && g.some(x => x.N !== v.N && isqrt(x.N) === isqrt(v.N)),
          bien: 'La misma raíz sirve desde k² hasta (k + 1)² − 1.' },
      ],
    },
    {
      id: 'cuatro-primos', titulo: 'Cuadrados y cubos con cuatro primos', pieza: TA,
      consigna: 'Elige los exponentes de 2, 3, 5 y 7. La tabla dice si cada exponente es par o múltiplo de 3.',
      controles: PR4.map((p, i) => ({ id: `e${p}`, etiqueta: `Exponente del ${p}`, color: 'c-i', min: 0, max: 6, paso: 1, inicio: [2, 3, 0, 1][i], unidad: '', decimales: 0 })),
      dibujo: v => ({ datos: tablaExp4(PR4.map(p => v[`e${p}`])), estado: {} }),
      lectura: v => { const es = PR4.map(p => v[`e${p}`]), fs = PR4.map((p, i) => [p, es[i]]).filter(([, e]) => e > 0);
        return [nu('N'), ' = ', ...(fs.length ? canonEc(fs) : ['1']), `: ${clasif(es)}`]; },
      invitaciones: [
        { texto: 'Arma un número mayor que 1 que sea cuadrado y cubo a la vez.',
          logrado: v => { const es = PR4.map(p => v[`e${p}`]); return clasif(es) === 'cuadrado y cubo' && es.some(e => e > 0); },
          bien: 'Exponentes múltiplos de 6: es una sexta potencia, como 64 = 2⁶.' },
        { texto: 'Haz un cubo perfecto que no sea cuadrado perfecto.',
          logrado: v => clasif(PR4.map(p => v[`e${p}`])) === 'cubo perfecto',
          bien: 'Basta un exponente impar, como el 3, para que no sea cuadrado.' },
        { texto: 'Busca el menor cuadrado perfecto que use los cuatro primos.',
          logrado: v => PR4.every(p => v[`e${p}`] === 2),
          bien: '2² × 3² × 5² × 7² = 210² = 44 100.' },
      ],
    },
    {
      id: 'encerrar', titulo: 'Encerrar cualquier raíz', pieza: 'recta',
      consigna: 'Elige N hasta 99 y prueba décimas x. El tramo va de x² al cuadrado de la décima siguiente.',
      controles: [
        { id: 'N', etiqueta: 'Número (N)', color: 'c-o', min: 2, max: 99, paso: 1, inicio: 30, unidad: '', decimales: 0 },
        { id: 'x', etiqueta: 'Décima (x)', color: 'c-f', min: 1, max: 9.9, paso: 0.1, inicio: 5, unidad: '', decimales: 1 },
      ],
      dibujo: v => { const t = Math.round(v.x * 10); return rectaDec(v.N, t, { min: 0, max: 100, paso: 5, cada: 4 }); },
      lectura: v => { const t = Math.round(v.x * 10), dentro = t * t <= v.N * 100 && v.N * 100 < (t + 1) ** 2;
        return dentro ? [`√`, nu(v.N), ` está entre ${dec(t)} y ${dec(t + 1)}`] : [`${dec(t)}² = ${cuadDec(t)} y ${dec(t + 1)}² = ${cuadDec(t + 1)}: `, nu(v.N), ' queda fuera']; },
      invitaciones: [
        { texto: 'Encierra la raíz de 50 entre dos décimas seguidas.',
          logrado: v => v.N === 50 && Math.round(v.x * 10) === 70,
          bien: '7² = 49 y 7,1² = 50,41: √50 queda entre 7 y 7,1.' },
        { texto: 'Haz que N caiga justo en el borde izquierdo del tramo.',
          logrado: v => Math.round(v.x * 10) ** 2 === v.N * 100,
          bien: 'El borde es x²: si toca a N, la raíz es exacta.' },
        { texto: 'Encierra la raíz del mayor N de la mesa.',
          logrado: v => v.N === 99 && Math.round(v.x * 10) === 99,
          bien: '9,9² = 98,01 y 10² = 100: √99 está entre 9,9 y 10.' },
      ],
    },
  ];

  return {
    unidad: 'aritmetica.potenciacion-y-radicacion',
    version: '0.3.0',
    calidad: 2,
    estado: 'completa',
    colores: COLORES,
    letras: {
      N: 'el número que se estudia: los caramelos o los cubitos',
      k: 'la raíz entera: el lado de la bandeja cuadrada (o la arista del cubo) más grande que se arma',
      r: 'el residuo: lo que sobra',
      r_e: 'el residuo por exceso: lo que falta para el cuadrado (o el cubo) siguiente',
      p: 'un número primo', q: 'otro número primo', 'α': 'el exponente de p', 'β': 'el exponente de q',
      m: 'el menor número por el que se multiplica o divide N',
      a: 'el comienzo del tramo', b: 'el final del tramo',
      x: 'una aproximación de la raíz',
    },
    requiere: ['/nucleo/kit/piezas/arit-cuadrado.js', '/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/arit-calculadora.js', '/nucleo/kit/piezas/recta.js', '/plantillas/potenciacion/motor.js', '/nucleo/kit/piezas/ari-cubitos-3d.js'],
    glosario: [
      // Idea 1.
      { termino: 'cuadrado perfecto', formas: ['cuadrado perfecto', 'cuadrados perfectos'],
        def: 'Entero que es otro entero multiplicado por sí mismo: sus primos tienen exponentes pares.',
        simple: 'Los caramelos que llenan una bandeja cuadrada, sin que sobre ninguno.', ver: ['cubo perfecto'],
        ejemplos: ['49 = 7 × 7 = 7².', '100 = 10 × 10 = 2² × 5².', '50 no lo es: 50 = 2 × 5², y el 2 tiene exponente 1.'] },
      { termino: 'cubo perfecto', formas: ['cubo perfecto', 'cubos perfectos'],
        def: 'Entero que es otro entero multiplicado tres veces por sí mismo: sus exponentes son múltiplos de 3.',
        simple: 'Los cubitos que arman un cubo macizo, sin que sobre ninguno.', ver: ['cuadrado perfecto'],
        ejemplos: ['27 = 3 × 3 × 3 = 3³.', '1 000 = 10³ = 2³ × 5³.', '36 no lo es: 36 = 2² × 3², y 2 no es múltiplo de 3.'] },
      // Idea 2.
      { termino: 'criterio de exclusión', formas: ['criterio de exclusión', 'criterios de exclusión', 'criterio de la cifra final', 'criterio'],
        def: 'Prueba rápida que solo sirve para descartar: si falla, el número no es cuadrado; si se cumple, falta comprobar.',
        simple: 'Un filtro rápido que saca a los que no pueden ser.', ver: ['condición necesaria'],
        ejemplos: ['Ningún cuadrado termina en 7: 3 487 se descarta.', '25 000 tiene tres ceros finales: se descarta.', '1 369 termina en 9: pasa, y hay que comprobar (es 37²).'] },
      { termino: 'condición necesaria', formas: ['condición necesaria', 'condiciones necesarias'],
        def: 'Lo que tiene que cumplirse para que algo sea cierto, aunque cumplirlo no alcance.',
        simple: 'Un requisito: sin él no hay caso, pero solo no basta.', ver: ['condición suficiente'],
        ejemplos: ['Terminar en 0, 1, 4, 5, 6 o 9 es necesario para ser cuadrado.', 'Para ser cuadrado, 2 501 cumple lo necesario y no lo es: queda entre 50² y 51².', 'Tener DNI es necesario para votar, pero no basta.'] },
      { termino: 'condición suficiente', formas: ['condición suficiente', 'suficiente'],
        def: 'Lo que basta para asegurar algo: si se cumple, ya no hace falta comprobar más.',
        simple: 'Lo que alcanza para estar seguro.', ver: ['condición necesaria'],
        ejemplos: ['Tener todos los exponentes pares basta para ser cuadrado perfecto.', 'Ser 37 × 37 basta para ser cuadrado.', 'Terminar en 1 no es suficiente: 2 501 termina en 1 y no es cuadrado.'] },
      // Idea 3.
      { termino: 'raíz entera', formas: ['raíz cuadrada entera', 'raíz entera', 'raíces enteras'],
        def: 'El mayor entero cuyo cuadrado no pasa de N: el lado de la mayor bandeja cuadrada posible.',
        simple: 'El lado de la bandeja cuadrada más grande que alcanza.', ver: ['residuo'],
        ejemplos: ['De 50 es 7: 7² = 49 cabe y 8² = 64 no.', 'De 80 es 8, porque 64 ≤ 80 < 81.', 'De 49 es 7, y es exacta.'] },
      { termino: 'residuo', simbolo: 'r', formas: ['residuo', 'residuos'],
        def: 'Lo que sobra al sacar la raíz entera: N menos el cuadrado de esa raíz.',
        simple: 'Los caramelos que quedan fuera de la bandeja.', ver: ['raíz entera', 'residuo por exceso'],
        ejemplos: ['De 50: 50 − 49 = 1.', 'De 80: 80 − 64 = 16.', 'De 49: 0, la raíz es exacta.'] },
      { termino: 'residuo por exceso', simbolo: 'rₑ', formas: ['residuo por exceso', 'residuos por exceso'],
        def: 'Lo que le falta a N para llegar al cuadrado siguiente.',
        simple: 'Los caramelos que faltan para la bandeja siguiente.', ver: ['residuo'],
        ejemplos: ['De 50: 64 − 50 = 14.', 'De 80: 81 − 80 = 1.', 'De 30: 36 − 30 = 6.'] },
      // Idea 4.
      { termino: 'raíz cúbica', simbolo: '∛', formas: ['raíz cúbica entera', 'raíz cúbica', 'raíces cúbicas'],
        def: 'Número que, multiplicado tres veces por sí mismo, da N. La entera es el mayor k con k³ ≤ N.',
        simple: 'La arista del cubo de cubitos más grande que alcanza.', ver: ['cubo perfecto'],
        ejemplos: ['∛27 = 3, porque 3 × 3 × 3 = 27.', 'La entera de 30 es 3: 27 ≤ 30 < 64.', '∛1 000 = 10.'] },
      { termino: 'arista', formas: ['arista', 'aristas'],
        def: 'Línea donde se juntan dos caras de un cubo: en un cubo de cubitos, una fila de cubitos.',
        simple: 'El borde donde se tocan dos caras del cubo.', ver: ['raíz cúbica'],
        ejemplos: ['Un cubo tiene 12 aristas.', 'En un cubo de 4 × 4 × 4, cada arista tiene 4 cubitos.', 'Una caja de 1 L tiene aristas de 10 cm.'] },
      { termino: 'operación inversa', formas: ['operación inversa', 'operaciones inversas'],
        def: 'Operación que deshace lo que hizo otra: aplicada después, devuelve el número del inicio.',
        simple: 'La que deshace lo que hizo la otra.', ver: ['raíz cúbica'],
        ejemplos: ['5³ = 125 y ∛125 = 5.', '7² = 49 y √49 = 7.', 'Restar 4 deshace sumar 4.'] },
      // Idea 5.
      { termino: 'extremo', formas: ['extremo', 'extremos'],
        def: 'Cada uno de los dos números donde empieza y termina un tramo; con «de a hasta b», los dos cuentan.',
        simple: 'Donde empieza o donde termina el tramo.', ver: ['sexta potencia'],
        ejemplos: ['En «de 50 hasta 150», los extremos son 50 y 150.', 'De 100 hasta 400, los dos extremos son cuadrados y entran.', 'De 20 hasta 40, ningún extremo es cuadrado.'] },
      { termino: 'sexta potencia', formas: ['sexta potencia', 'sextas potencias'],
        def: 'Un número multiplicado seis veces por sí mismo: es cuadrado y cubo a la vez.',
        simple: 'Un número que es cuadrado y cubo a la vez.', ver: ['cuadrado perfecto', 'cubo perfecto'],
        ejemplos: ['64 = 2⁶ = 8² = 4³.', '729 = 3⁶ = 27² = 9³.', '1 = 1⁶.'] },
      // Idea 6.
      { termino: 'aproximación por defecto', formas: ['aproximación por defecto', 'por defecto'],
        def: 'Un valor un poco menor que el exacto, con el error que se pide: el borde de abajo del tramo.',
        simple: 'Quedarse un poquito corto, sin pasarse.', ver: ['aproximación por exceso'],
        ejemplos: ['√10 por defecto, al entero: 3.', '√5 por defecto, a la décima: 2,2.', '√30 por defecto, a la décima: 5,4.'] },
      { termino: 'aproximación por exceso', formas: ['aproximación por exceso', 'por exceso'],
        def: 'Un valor un poco mayor que el exacto, con el error que se pide: el borde de arriba del tramo.',
        simple: 'Pasarse un poquito, lo menos posible.', ver: ['aproximación por defecto'],
        ejemplos: ['√10 por exceso, al entero: 4.', '√5 por exceso, a la décima: 2,3.', '√7 por exceso, a la décima: 2,7.'] },
      { termino: 'error', formas: ['error'],
        def: 'Cuánto se separa una aproximación del valor exacto: si el tramo mide 0,1, se separa menos de 0,1.',
        simple: 'Lo que le falta o le sobra a una aproximación.', ver: ['aproximación por defecto'],
        ejemplos: ['√5 ≈ 2,2 tiene un error menor que 0,1.', '3 en vez de √10 tiene un error menor que 1.', 'Por centésimas, el error es menor que 0,01.'] },
    ],
    laboratorio,
    historia: {
      texto: 'La tablilla babilónica YBC 7289 muestra un cuadrado con su diagonal y una aproximación de la raíz de dos en base 60, muy precisa. Sabemos qué valor se escribió, pero no cómo se obtuvo: un número no revela el método. Esta unidad une potencias y raíces como operaciones inversas, y separa los valores exactos de las aproximaciones.',
      pregunta: '¿Cómo comprobarías una raíz sin calculadora?',
      fuente: { titulo: 'MCT 042 YBC 07289, P255048 — Cuneiform Digital Library Initiative', url: 'https://cdli.earth/artifacts/255048' },
    },
    laboratorioIdeas: {
      'cubo-de-cubitos': ['raiz-cubica'],
      'raiz-grande': ['raiz-entera'],
      'cuatro-primos': ['perfectos'],
      'encerrar': ['aproximadas'],
    },
    ideas: [perfectos, exclusion, raizEntera, raizCubica, contar, aproximadas],
  };
});

