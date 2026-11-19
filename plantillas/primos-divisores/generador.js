/*
 * Generador «La vitrina de los primos»: práctica de «Números primos y divisores» (aritmetica.numeros-primos-y-divisores;
 * contenido/teoria/aritmetica/numeros-primos-y-divisores.js), con tipos separados por idea. Formato "predicciones"
 * (docs/arquitectura.md). Funciona en el navegador (window.Generadores['primos-divisores']) y en Node (require). No usa
 * ningún motor: las cuentas son divisiones de enteros que se hacen aquí.
 *
 * Propuesta: docs/etapa6/propuesta-aritmetica.md §5 y §8 (Gerson delegó el criterio y la revisa después). Hilo, como en
 * la teoría: la bandeja de la vitrina de doña Juana, la rifa de la promoción y el pedido en bolsitas. Valores de
 * problema, sin fuente.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 básico, 2 intermedio, 3 examen). generar(semilla, { idea }) da solo los de esa
 * idea; sin idea, las seis con el mismo peso. La unidad es una sola: { unidad } no cambia nada.
 *   rectangulos    cual-primo (1) cuál boleto es primo · cuantos-divisores (1) por parejas · formas-cuadrado (2) las
 *                  bandejas de un cuadrado · dos-primos (3) dos primos que suman un impar
 *   criba          hasta-primo (1) el mayor primo con el que se prueba · menor-primo (2) el menor primo que divide a
 *                  p × q · primos-tramo (2) cuántos primos hay en un tramo · primos-pa (3, San Marcos 2026-I) primos en
 *                  progresión aritmética
 *   factorizacion  canonica (1) la forma canónica · exponente (1) cuántas veces entra el 2 · pesi (2) cuál par es PESI ·
 *                  potencias (3, San Marcos 2025-I) el exponente de un primo en un producto de potencias de compuestos
 *   divisores      cd (1) la cantidad de divisores · sd (2) la suma · condicion (2) múltiplos de k o impares ·
 *                  compuestos (3, San Marcos 2025-II) divisores compuestos · exp-oculto (3, San Marcos 2027-I) el
 *                  exponente que falta
 *   euler          phi (1) φ con dos primos · phi-tres (2) con tres primos o una potencia · irreductibles (2, San Marcos
 *                  2025-I) fracciones propias irreductibles · cota (3, San Marcos 2024-I) las mayores que 1/2
 *   fermat-wilson  wilson (1) · fermat (2) el resto de una potencia grande · no-vale (3) cuando Fermat no se usa ·
 *                  wilson-mas (3) Wilson más un número
 *
 * Notación (propuesta §6): N el número, p y q primos, α y β sus exponentes; CD, SD, φ; × para multiplicar, nunca «·»;
 * las potencias con superíndice (2⁴); p̊ «un múltiplo de p». Las alternativas son texto plano.
 * Colores: un color fijo por magnitud, el de la teoría (def.colores): el envase en turquesa (e: un divisor, un primo, la
 * bolsita), lo que sobra en naranja (r: un resto), lo que se busca en violeta (b: cuántos, cuál, el número que se pide).
 * Lo que se pide va en tinta en la pregunta. Sin verde ni carmín.
 * Datos (docs/plan-calidad.md §3, punto 13): la definición de primo, la regla de la raíz, la forma canónica, CD, SD, φ,
 * Fermat y Wilson; nunca el paso hecho ni la respuesta.
 * Errores: los códigos AT-* de la teoría de la unidad (hipótesis de aula, sin medir; tabla «Números primos y divisores
 * (19 nov)» de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md).
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
  const ID = 'primos-divisores';
  const UNIDAD = 'aritmetica.numeros-primos-y-divisores';
  const v = P.v;
  const f0 = x => P.formatear(x, 0);
  const SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹', sup = x => [...String(x)].map(c => SUPD[c]).join('');
  const MU = 'p̊';
  const mcd = (x, y) => (y ? mcd(y, x % y) : x);
  const esPrimo = x => { if (x < 2) return false; for (let k = 2; k * k <= x; k++) if (x % k === 0) return false; return true; };
  const primosHasta = x => Array.from({ length: Math.max(0, x - 1) }, (_, i) => i + 2).filter(esPrimo);
  const divisores = x => { const o = []; for (let k = 1; k * k <= x; k++) if (x % k === 0) { o.push(k); if (k * k !== x) o.push(x / k); } return o.sort((a, b) => a - b); };
  const factores = x => { const o = []; for (let k = 2; x > 1; k++) { let e = 0; while (x % k === 0) { x /= k; e++; } if (e) o.push([k, e]); } return o; };
  const canon = N => factores(N).map(([p, e]) => (e > 1 ? `${p}${sup(e)}` : String(p))).join(' × ');
  const phi = N => { let c = 0; for (let k = 1; k <= N; k++) if (mcd(k, N) === 1) c++; return c; };
  const powmod = (b, e, k) => { let x = 1 % k; for (let i = 0; i < e; i++) x = (x * b) % k; return x; };
  const parejas = N => divisores(N).filter(a => a * a <= N).map(a => [a, N / a]);
  const yLista = xs => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} y ${xs[xs.length - 1]}` : String(xs[0]));

  const Ev = x => v('e', typeof x === 'number' ? f0(x) : String(x));
  const Rv = x => v('r', typeof x === 'number' ? f0(x) : String(x));
  const Bv = x => v('b', typeof x === 'number' ? f0(x) : String(x));
  const VARS = { e: { nombre: 'el envase: un divisor, un primo, la bolsita', color: 'i' },
    r: { nombre: 'lo que sobra: el resto', color: 'o' },
    b: { nombre: 'lo que se busca: cuántos, cuál, el número que se pide', color: 'f' } };

  const h = (id, valor, explicacion, fmt = f0) =>
    (valor === undefined || valor === null || (typeof valor === 'number' && (!Number.isFinite(valor) || valor < 0)) ? null
      : { id, clave: String(fmt(valor)), texto: String(fmt(valor)), explicacion, respaldo: 'hipotesis', fuente: null });

  const D = {
    primo: 'Un número primo tiene exactamente dos divisores: 1 y él mismo',
    comp: 'Un compuesto tiene más de dos divisores; el 1 no es primo ni compuesto',
    pareja: 'Cada forma de acomodar N en filas iguales da una pareja de divisores: filas × por fila = N',
    par: 'Un número par es 2 × un entero; un impar más un impar da un par',
    raiz: 'N es primo si no es múltiplo de ningún primo p con p × p ≤ N',
    p40: 'Los primos menores que 40: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31 y 37',
    p17: 'Los primos menores que 17: 2, 3, 5, 7, 11 y 13',
    pa: d => `Progresión de razón ${d}: cada término es el anterior más ${d}`,
    tfa: 'Todo número mayor que 1 es un producto de primos, de una sola manera salvo el orden',
    canon: 'Descomposición canónica: los primos de menor a mayor, cada uno con su exponente: 2² × 3 × 5',
    exp: 'El exponente dice cuántas veces entra el primo: 2³ = 2 × 2 × 2',
    pesi: 'Dos números son PESI si no comparten ningún primo en su factorización',
    potProd: 'Potencia de un producto: (2 × 3)⁴ = 2⁴ × 3⁴; potencia de una potencia: (2²)³ = 2⁶',
    prod: 'Al multiplicar, los exponentes de un mismo primo se suman: 2² × 2³ = 2⁵',
    cd: 'CD(N) = (α + 1) × (β + 1) × …, con N = pᵅ × qᵝ × … escrito en primos',
    sd: 'SD(N) = (1 + p + … + pᵅ) × (1 + q + … + qᵝ)',
    simple: 'Divisores simples: el 1 y los divisores primos; los demás son compuestos',
    mult: 'Los divisores de N que son múltiplos de k son k por cada divisor de N ÷ k',
    impar: 'Los divisores impares de N son los divisores de la parte de N sin el 2',
    phi: 'φ(N): cuántos números del 1 al N son PESI con N',
    phiF: 'φ(N) = N × (1 − 1/p) × (1 − 1/q) × …, con p, q, … los primos distintos de N',
    frac: 'Una fracción k/N es irreductible si k y N son PESI; es propia si k es menor que N',
    sim: 'k/N y (N − k)/N son irreductibles a la vez: van en parejas que suman 1',
    fermat: 'Fermat: si p es primo y a no es múltiplo de p, a elevado a p − 1 deja resto 1 entre p',
    wilson: 'Wilson: si p es primo, 1 × 2 × … × (p − 1) deja resto p − 1 entre p',
    expS: 'Al multiplicar potencias de una base, los exponentes se suman: a⁵ × a³ = a⁸',
    resto: 'El resto de un producto o de una suma sale de operar los restos y volver a dividir',
    ciclo: 'Los restos de las potencias de un número se repiten en ciclo: se calculan hasta que uno se repite',
  };

  const TIPOS_POR_IDEA = {
    rectangulos: ['cual-primo', 'cuantos-divisores', 'formas-cuadrado', 'dos-primos'],
    criba: ['hasta-primo', 'menor-primo', 'primos-tramo', 'primos-pa'],
    factorizacion: ['canonica', 'exponente', 'pesi', 'potencias'],
    divisores: ['cd', 'sd', 'condicion', 'compuestos', 'exp-oculto'],
    euler: ['phi', 'phi-tres', 'irreductibles', 'cota'],
    'fermat-wilson': ['wilson', 'fermat', 'no-vale', 'wilson-mas'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const TIPOS_POR_UNIDAD = { [UNIDAD]: IDEAS.flatMap(i => TIPOS_POR_IDEA[i]) };
  const NIVEL = { 'cual-primo': 1, 'cuantos-divisores': 1, 'formas-cuadrado': 2, 'dos-primos': 3,
    'hasta-primo': 1, 'menor-primo': 2, 'primos-tramo': 2, 'primos-pa': 3,
    canonica: 1, exponente: 1, pesi: 2, potencias: 3,
    cd: 1, sd: 2, condicion: 2, compuestos: 3, 'exp-oculto': 3,
    phi: 1, 'phi-tres': 2, irreductibles: 2, cota: 3,
    wilson: 1, fermat: 2, 'no-vale': 3, 'wilson-mas': 3 };
  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8» y rotula 3 básicos, 3 intermedios y 2
  // avanzados): una pregunta de cada idea, y las dos de examen son de San Marcos (2026-I y 2024-I).
  const PAPEL = { 'papel-1': 'cual-primo', 'papel-2': 'canonica', 'papel-3': 'cd', 'papel-4': 'menor-primo',
    'papel-5': 'irreductibles', 'papel-6': 'fermat', 'papel-7': 'primos-pa', 'papel-8': 'cota' };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const forzado = !o.idea && PAPEL[String(semilla)];
    let tipo;
    if (forzado) tipo = forzado;
    else { const idea = TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS); tipo = rng.elegir(TIPOS_POR_IDEA[idea]); }
    for (let intento = 0; intento < 500; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      const p = pr && cerrar(semilla, tipo, pr, rng);
      if (p) return p;
    }
    throw new Error(`No se pudo generar un problema de ${tipo} con 4 alternativas distintas`);
  }
  function cerrar(semilla, tipo, o, rng) {
    const fmt = o.fmt || f0, ct = String(fmt(o.correcta));
    const errores = o.errores.filter(e => e && e.clave !== ct);
    let alternativas;
    try { alternativas = P.armarTexto({ correcta: { clave: ct, texto: ct }, errores, rng }); } catch (e) { return null; }
    if (alternativas.length < 4) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object') usadas.add(x.v);
    return {
      id: `${ID}#${semilla}`, unidadCatalogo: UNIDAD, variables: Object.fromEntries([...usadas].map(k => [k, VARS[k]])),
      enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos, alternativas, solucion: o.solucion,
      respuesta: { valor: ct, texto: ct, unidad: '' },
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos),
    };
  }

  // ======================= Idea 1: primos y compuestos =======================
  function cualPrimo(rng) {
    const p = rng.elegir(primosHasta(97).filter(x => x > 40)), t = rng.elegir([39, 51, 57, 69, 87, 93]), s = rng.elegir([49, 77, 91, 119]);
    const ms = factores(s)[0][0], ops = [p, 1, t, s];
    return {
      enunciado: ['En la rifa quedan los boletos ', yLista(ops.slice().sort((a, b) => a - b)), '.'],
      pregunta: ['¿Cuál de ellos lleva un número primo?'],
      datos: [D.primo, D.comp],
      correcta: p,
      errores: [
        h('AT-PRIMO-UNO', 1, 'Bien buscar pocos divisores. Pero el 1 tiene uno solo, y un primo necesita dos.'),
        h('AT-PRIMO-IMPAR', t, `Bien, es impar. Pero ${t} = 3 × ${t / 3}: también va en 3 filas.`),
        h('AT-PRIMO-SIETE', s, `Bien, no es múltiplo de 2, 3 ni 5. Pero ${s} = ${ms} × ${s / ms}.`),
      ],
      solucion: [['Los otros se parten: ', `${t} = 3 × ${t / 3}`, ' y ', `${s} = ${ms} × ${s / ms}`, '; el 1 tiene un solo divisor.'], [Bv(p), ' solo tiene los divisores ', Ev(1), ' y ', Ev(p), '.']],
      _datos: { opciones: ops },
    };
  }
  function cuantosDivisores(rng) {
    const N = rng.entero(20, 99), ps = parejas(N), k = ps.length;
    if (k < 3 || ps.some(([a, b]) => a === b)) return null;
    return {
      enunciado: [`Doña Juana acomoda ${N} caramelos en la bandeja, en filas iguales y todas llenas.`],
      pregunta: [`¿Cuántos divisores tiene ${N}?`],
      datos: [D.pareja],
      correcta: 2 * k,
      errores: [
        h('AT-PAREJA-FORMAS', k, `Bien las ${k} formas. Pero cada forma da dos divisores.`),
        h('AT-DIV-EXTREMOS', 2 * k - 2, `Bien las parejas. Pero el 1 y ${N} también dividen a ${N}.`),
        h('AT-DIV-PROPIO', 2 * k - 1, `Bien contar desde el 1. Pero ${N} también divide a ${N}.`),
      ],
      solucion: [[`${N} = ${ps.map(([a, b]) => `${a} × ${b}`).join(' = ')}: `, `${k} formas.`], ['Cada forma da dos divisores distintos: ', Bv(2 * k), ' divisores.']],
      _datos: { N },
    };
  }
  function formasCuadrado(rng) {
    const N = rng.elegir([16, 36, 64, 81, 100, 144, 196, 225]), k = parejas(N).length, m = Math.sqrt(N);
    return {
      enunciado: [`Doña Juana tiene ${N} caramelos.`],
      pregunta: ['¿De cuántas formas distintas los acomoda en la bandeja, en filas iguales y todas llenas?'],
      datos: [D.pareja, '3 filas de 8 y 8 filas de 3 son la misma forma'],
      correcta: k,
      errores: [
        h('AT-PAREJA-CUADRADO', k - 1, `Bien las parejas. Pero ${m} filas de ${m} también es una forma.`),
        h('AT-PAREJA-GIRA', 2 * k - 1, 'Bien contar los divisores. Pero una forma y su giro son la misma.'),
        h('AT-PAREJA-DOBLE', k + 1, `Bien las parejas. Pero ${m} filas de ${m} es una sola forma.`),
      ],
      solucion: [[`${N} = ${parejas(N).map(([a, b]) => `${a} × ${b}`).join(' = ')}.`], ['El ', Ev(m), ' va con él mismo: son ', Bv(k), ' formas.']],
      _datos: { N },
    };
  }
  function dosPrimos(rng) {
    const p = rng.elegir(primosHasta(80).filter(x => x > 10)), S = p + 2, m1 = (S - 1) / 2, m2 = (S + 1) / 2;
    return {
      enunciado: [`Dos números primos suman ${S}.`],
      pregunta: ['¿Cuál es su producto?'],
      datos: [D.primo, D.par],
      correcta: 2 * p,
      errores: [
        h('AT-PRIMO-MITAD', m1 * m2, `Bien, ${m1} + ${m2} = ${S}. Pero uno de los dos no es primo.`),
        h('AT-PRIMO-PAR', 3 * (S - 3), `Bien, 3 es primo. Pero ${S - 3} es par y no es primo; el 2 sí lo es.`),
        h('AT-RESPONDE-OTRA', p, `Bien hallar el ${p}. Pero se pide el producto con el otro primo, el 2.`),
      ],
      solucion: [[`Dos impares suman un par, y ${S} es impar: uno de los primos es el `, Ev(2), '.'], [`El otro es ${p}: 2 × ${p} = `, Bv(2 * p), '.']],
      _datos: { S },
    };
  }

  // ======================= Idea 2: la criba =======================
  function hastaPrimo(rng) {
    const N = rng.elegir(primosHasta(999).filter(x => x > 120)), ps = primosHasta(40);
    const i = ps.filter(p => p * p <= N).length - 1, p = ps[i], sig = ps[i + 1], ant = ps[i - 1];
    return {
      enunciado: [`Se quiere comprobar que ${N} es primo.`],
      pregunta: ['¿Cuál es el mayor primo con el que hay que probar?'],
      datos: [D.raiz, D.p40],
      correcta: p,
      errores: [
        h('AT-CRIBA-PASA', sig, `Bien probar cerca de la raíz. Pero ${sig} × ${sig} = ${sig * sig} pasa de ${N}.`),
        h('AT-CRIBA-CORTA', ant, `Bien, pero corto: ${p} × ${p} = ${p * p} todavía no pasa de ${N}.`),
        h('AT-CRIBA-MITAD', primosHasta(Math.floor(N / 2)).pop(), 'Bien que llegue a todo, pero sobra: después de la raíz no hay parejas nuevas.'),
      ],
      solucion: [[`${p} × ${p} = ${p * p} no pasa de ${N}; ${sig} × ${sig} = ${sig * sig} sí.`], ['El mayor es ', Bv(p), '.']],
      _datos: { N },
    };
  }
  function menorPrimo(rng) {
    const p = rng.elegir([11, 13, 17, 19, 23]), q = rng.elegir(primosHasta(80).filter(x => x > p)), N = p * q;
    if (N > 999) return null;
    return {
      enunciado: [`El número ${N} no es múltiplo de 2, 3, 5 ni 7.`],
      pregunta: [`¿Cuál es el menor primo que divide a ${N}?`],
      datos: [D.raiz, D.p40],
      correcta: p,
      errores: [
        h('AT-CRIBA-OTRO', q, `Bien, ${q} divide a ${N}. Pero ${N} = ${p} × ${q}, y ${p} es menor.`),
        h('AT-PRIMO-UNO', 1, 'Bien, el 1 divide a todos. Pero no es primo.'),
        h('AT-CRIBA-SIETE', 7, `Bien probar el 7. Pero ${N} = 7 × ${Math.floor(N / 7)} + ${N % 7}: sobra.`),
      ],
      solucion: [[`Con los primos hasta el anterior a ${p} siempre sobra algo.`], [`${N} = `, Ev(p), ' × ', Ev(q), ': el menor es ', Bv(p), '.']],
      _datos: { N },
    };
  }
  function primosTramo(rng) {
    const a = rng.entero(50, 160), b = a + rng.entero(18, 30);
    if (esPrimo(a) || esPrimo(b)) return null;
    const xs = []; for (let x = a + 1; x < b; x++) xs.push(x);
    const pr = xs.filter(esPrimo), falsos = xs.filter(x => !esPrimo(x) && [2, 3, 5].every(k => x % k));
    if (!falsos.length) return null;
    const f = falsos[0], m = factores(f)[0][0];
    return {
      enunciado: [`En la rifa, los boletos van del ${a} al ${b}.`],
      pregunta: [`¿Cuántos números primos hay entre ${a} y ${b}?`],
      datos: [D.raiz, D.p17],
      correcta: pr.length,
      errores: [
        h('AT-CRIBA-SIETE', pr.length + falsos.length, `Bien tachar los múltiplos de 2, 3 y 5. Pero ${f} = ${m} × ${f / m} también se tacha.`),
        h('AT-PRIMO-IMPAR', xs.filter(x => x % 2).length, 'Bien quitar los pares. Pero muchos impares son múltiplos de 3, 5 o 7.'),
        h('AT-PRIMO-TERMINA', xs.filter(x => [1, 3, 7, 9].includes(x % 10)).length, `Bien mirar la última cifra. Pero no basta: ${f} = ${m} × ${f / m}.`),
      ],
      solucion: [[`Se prueba hasta 11 o 13. Quedan sin tachar ${yLista(pr)}.`], ['Son ', Bv(pr.length), pr.length === 1 ? ' primo.' : ' primos.']],
      _datos: { a, b },
    };
  }
  function primosPA(rng) {
    const n = rng.elegir([3, 4, 5]), d = rng.elegir([6, 10, 12, 14, 18, 30]), B = rng.entero(40, 110);
    const sirve = [], fallan = [];
    for (const p of primosHasta(B)) { const t = Array.from({ length: n }, (_, i) => p + i * d); if (t[n - 1] >= B) continue; (t.every(esPrimo) ? sirve : fallan).push(t); }
    if (sirve.length !== 1 || !fallan.length) return null;
    const t = sirve[0], mal = fallan[fallan.length - 1], c = mal.find(y => !esPrimo(y)), mc = factores(c)[0][0];
    const NUM = { 3: 'Tres', 4: 'Cuatro', 5: 'Cinco' };
    return {
      enunciado: [`${NUM[n]} números primos, todos menores que ${B}, forman una progresión aritmética: cada uno es el anterior más ${d}.`],
      pregunta: ['¿Cuál es el mayor?'],
      datos: [D.raiz, D.pa(d)],
      correcta: t[n - 1],
      errores: [
        h('AT-CRIBA-CORTA', mal[n - 1], `Bien empezar en el primo ${mal[0]}. Pero ${c} = ${mc} × ${c / mc} no es primo.`),
        h('AT-RESPONDE-OTRA', t[0], `Bien la progresión ${t.join(', ')}. Pero ${t[0]} es el menor.`),
        h('AT-PA-UNO-MAS', t[n - 1] + d, `Bien sumar ${d}. Pero son ${n} primos: ese es uno de más.`),
      ],
      solucion: [[`Se prueba cada primo de inicio; solo con ${t[0]} los ${n} son primos: ${t.join(', ')}.`], ['El mayor es ', Bv(t[n - 1]), '.']],
      _datos: { n, d, B },
    };
  }

  // ======================= Idea 3: factorización y PESI =======================
  function canonica(rng) {
    const N = rng.entero(60, 999), fs = factores(N);
    if (fs.length < 2 || fs.some(([p]) => p > 13) || fs.every(([, e]) => e === 1)) return null;
    const iRep = fs.findIndex(([, e]) => e > 1), val = fs[iRep][0] ** fs[iRep][1];
    const incompleta = fs.map(([p, e], i) => (i === iRep ? String(val) : e > 1 ? `${p}${sup(e)}` : String(p))).join(' × ');
    const sinExp = fs.map(([p]) => String(p)).join(' × '), mas = fs.map(([p, e], i) => { const k = i === 0 ? e + 1 : e; return k > 1 ? `${p}${sup(k)}` : String(p); }).join(' × ');
    return {
      enunciado: [`Doña Juana parte ${N} caramelos en partes iguales, y cada parte otra vez, hasta llegar a primos.`],
      pregunta: [`¿Cuál es la descomposición canónica de ${N}?`],
      datos: [D.tfa, D.canon],
      correcta: canon(N), fmt: String,
      errores: [
        h('AT-FACT-INCOMPLETA', incompleta, `Bien, el producto da ${N}. Pero ${val} no es primo: falta partirlo.`, String),
        // Solo los que se repiten (auditoría, 19 nov: «cada uno entra más de una vez» era falso con un exponente 1).
        h('AT-FACT-EXPONENTE', sinExp, `Bien los primos. Pero ${yLista(fs.filter(([, e]) => e > 1).map(([p]) => `el ${p}`))} ${fs.filter(([, e]) => e > 1).length === 1 ? 'entra' : 'entran'} más de una vez.`, String),
        h('AT-FACT-SUMA', mas, `Bien los primos. Pero el ${fs[0][0]} entra ${fs[0][1]} ${fs[0][1] === 1 ? 'vez' : 'veces'}.`, String),
      ],
      solucion: [[`Se divide entre el menor primo una y otra vez: ${fs.flatMap(([p, e]) => Array(e).fill(p)).join(' × ')}.`], [`${N} = `, Bv(canon(N)), '.']],
      _datos: { N },
    };
  }
  function exponente(rng) {
    const a = rng.entero(3, 6), m = rng.elegir([9, 15, 21, 25, 27, 35, 45, 63, 75]), N = 2 ** a * m;
    if (N > 2000) return null;
    const fs = factores(N);
    return {
      enunciado: [`Se factoriza ${N}.`],
      pregunta: ['¿Cuántas veces entra el ', Ev(2), ' en su factorización?'],
      datos: [D.tfa, D.exp],
      correcta: a,
      errores: [
        h('AT-FACT-DISTINTOS', fs.length, `Bien, ${N} tiene ${fs.length} primos distintos. Pero se pregunta por el 2.`),
        h('AT-FACT-CORTA', a - 1, `Bien dividir entre 2. Pero una vez más: ${N / 2 ** (a - 1)} todavía es par.`),
        h('AT-FACT-TODOS', fs.reduce((x, [, e]) => x + e, 0), `Bien contar los primos. Pero se piden solo los doses.`),
      ],
      solucion: [[`Se divide entre 2 hasta que queda impar: ${N} = ${2 ** a} × ${m}.`], [`${N} = ${canon(N)}: el 2 entra `, Bv(a), ' veces.']],
      _datos: { N },
    };
  }
  const PARES = [[8, 9], [4, 15], [9, 10], [14, 25], [16, 27], [21, 22], [25, 36], [20, 21], [27, 32], [35, 48]];
  function pesi(rng) {
    const [a, b] = rng.elegir(PARES), p = rng.elegir([3, 5, 7, 11]), k = rng.elegir([2, 3, 4, 5].filter(x => x !== p));
    const [i1, i2] = rng.elegir([[9, 21], [15, 25], [21, 33], [25, 35], [15, 21], [27, 45]]), g = factores(mcd(i1, i2))[0][0];
    const NO = 'Ninguno: los dos tendrían que ser primos';
    return {
      enunciado: ['Dos números son PESI (primos entre sí) si no comparten ningún primo en su factorización.'],
      pregunta: ['¿Cuál de estos pares es PESI?'],
      datos: [D.pesi, 'PESI se lee «primos entre sí»'],
      correcta: `${a} y ${b}`, fmt: String,
      errores: [
        h('AT-PESI-UN-PRIMO', `${p} y ${p * k}`, `Bien, ${p} es primo. Pero ${p * k} = ${k} × ${p}: comparten el ${p}.`, String),
        h('AT-PESI-IMPARES', `${i1} y ${i2}`, `Bien, ninguno es par. Pero los dos tienen el ${g}.`, String),
        h('AT-PESI-PRIMOS', NO, 'Bien leer el nombre. Pero PESI pide no compartir primos, no ser primos.', String),
      ],
      solucion: [[`${a} = ${canon(a)} y ${b} = ${canon(b)}: ningún primo se repite.`], [Bv(`${a} y ${b}`), ' son PESI.']],
      _datos: { pares: [[a, b], [p, p * k], [i1, i2]] },
    };
  }
  const BASES = [6, 10, 12, 15, 18, 20, 24, 45, 50, 75];
  function potencias(rng) {
    const A = rng.elegir(BASES), B = rng.elegir(BASES.filter(x => x !== A)), x = rng.entero(2, 5), y = rng.entero(2, 4);
    const com = factores(A).map(z => z[0]).filter(p => B % p === 0);
    if (!com.length) return null;
    const Pp = rng.elegir(com), eA = factores(A).find(z => z[0] === Pp)[1], eB = factores(B).find(z => z[0] === Pp)[1];
    if (eA === 1 && eB === 1) return null;
    const c = eA * x + eB * y;
    return {
      enunciado: [`Se escribe ${A}${sup(x)} × ${B}${sup(y)} en primos.`],
      pregunta: ['¿Cuál es el exponente de ', Ev(Pp), ' en su descomposición canónica?'],
      datos: [D.potProd, D.prod],
      correcta: c,
      errores: [
        h('AT-FACT-BASES', x + y, `Bien sumar exponentes. Pero ${A} y ${B} no son primos: primero se descomponen.`),
        h('AT-FACT-MULTIPLICA', x * y, 'Bien usar los exponentes. Pero en un producto se suman, después de descomponer las bases.'),
        h('AT-FACT-UNA-BASE', eA * x, `Bien lo de ${A}${sup(x)}. Falta el ${Pp} que trae ${B}${sup(y)}.`),
      ],
      solucion: [[`${A} = ${canon(A)} y ${B} = ${canon(B)}.`], [`El ${Pp} entra ${eA} × ${x} + ${eB} × ${y} = `, Bv(c), ' veces.']],
      _datos: { A, B, x, y, P: Pp },
    };
  }

  // ======================= Idea 4: cantidad, suma y producto de divisores =======================
  function cd(rng) {
    const P3 = rng.elegir([[2, 3, 5], [2, 3, 7], [2, 5, 7], [3, 5, 7]]), es = P3.map(() => rng.entero(1, 4)), N = P3.reduce((x, p, i) => x * p ** es[i], 1);
    const c = es.reduce((x, e) => x * (e + 1), 1);
    return {
      enunciado: [`N = ${canon(N)}.`],
      pregunta: ['¿Cuántos divisores tiene N?'],
      datos: [D.cd],
      correcta: c,
      errores: [
        h('AT-CD-OLVIDA', (es[0] + 1) * (es[1] + 1), `Bien con ${P3[0]} y ${P3[1]}. Falta el ${P3[2]}: cada divisor lo lleva o no.`),
        h('AT-CD-SIN-UNO', es.reduce((x, e) => x * e, 1), 'Bien multiplicar. Pero un primo también puede no entrar: el exponente 0 cuenta.'),
        h('AT-CD-SUMA', es.reduce((x, e) => x + e + 1, 0), 'Bien sumar 1 a cada exponente. Pero esas opciones se multiplican.'),
      ],
      solucion: [['Cada primo da su exponente más 1 opciones.'], [`${es.map(e => `(${e} + 1)`).join(' × ')} = `, Bv(c), ' divisores.']],
      _datos: { N },
    };
  }
  const sumaPot = (p, e) => Array.from({ length: e + 1 }, (_, i) => p ** i).reduce((x, y) => x + y, 0);
  function sd(rng) {
    const [p, q] = rng.elegir([[2, 3], [2, 5], [3, 5], [2, 7]]), a = rng.entero(1, 4), b = rng.entero(1, 2), N = p ** a * q ** b;
    if (N > 600) return null;
    const sp = sumaPot(p, a), sq = sumaPot(q, b), s = sp * sq;
    return {
      enunciado: [`${N} = ${canon(N)}.`],
      pregunta: [`¿Cuánto suman todos los divisores de ${N}?`],
      datos: [D.sd],
      correcta: s,
      errores: [
        h('AT-SD-CUENTA', (a + 1) * (b + 1), 'Bien la tabla. Pero ese es cuántos divisores hay, no cuánto suman.'),
        h('AT-SD-SUMA', sp + sq, `Bien las sumas ${sp} y ${sq}. Pero se multiplican: cada divisor es un producto.`),
        h('AT-SD-PROPIOS', s - N, `Bien la suma de los demás. Pero ${N} también es divisor de ${N}.`),
      ],
      solucion: [[`Las potencias de ${p} suman ${sp}; las de ${q}, ${sq}.`], [`${sp} × ${sq} = `, Bv(s), '.']],
      _datos: { N },
    };
  }
  function condicion(rng) {
    const a = rng.entero(2, 5), b = rng.entero(1, 3), c = rng.entero(1, 2), N = 2 ** a * 3 ** b * 5 ** c, todos = (a + 1) * (b + 1) * (c + 1);
    const k = rng.elegir([6, 10, 15, 4, 9, 'impares']);
    let M;
    if (k === 'impares') M = 3 ** b * 5 ** c; else { if (N % k) return null; M = N / k; }
    const cuenta = divisores(M).length;
    return {
      enunciado: [`N = ${canon(N)}.`],
      pregunta: [k === 'impares' ? '¿Cuántos divisores impares tiene N?' : `¿Cuántos divisores de N son múltiplos de ${k}?`],
      datos: [D.cd, k === 'impares' ? D.impar : D.mult],
      correcta: cuenta,
      errores: [
        h('AT-COND-TODOS', todos, `Bien, N tiene ${todos} divisores. Pero se piden solo los que cumplen.`),
        h('AT-COND-COMPLEMENTO', todos - cuenta, 'Bien la resta. Pero esos son los que no cumplen.'),
        h('AT-COND-DE-K', k === 'impares' ? a + 1 : divisores(k).length, k === 'impares' ? 'Bien mirar el 2. Pero los impares no lo llevan.' : `Bien usar el ${k}. Pero se cuentan los divisores de N ÷ ${k}.`),
      ],
      solucion: [[k === 'impares' ? `Sin el 2 queda ${canon(M)}.` : `N ÷ ${k} = ${canon(M)}.`], ['Sus divisores: ', Bv(cuenta), '.']],
      _datos: { N, k },
    };
  }
  function compuestos(rng) {
    const P3 = rng.elegir([[2, 3, 5], [2, 3], [2, 5, 7], [3, 5]]), es = P3.map(() => rng.entero(1, 3)), N = P3.reduce((x, p, i) => x * p ** es[i], 1);
    const c = es.reduce((x, e) => x * (e + 1), 1), k = P3.length, comp = c - k - 1;
    return {
      enunciado: [`N = ${canon(N)}.`],
      pregunta: ['¿Cuántos divisores compuestos tiene N?'],
      datos: [D.cd, D.simple],
      correcta: comp,
      errores: [
        h('AT-SIMPLE-UNO', c - k, `Bien quitar los ${k} primos. Pero el 1 tampoco es compuesto: es simple.`),
        h('AT-COMPUESTO-PRIMOS', c - 1, `Bien quitar el 1. Pero los primos ${yLista(P3)} tampoco son compuestos.`),
        h('AT-COND-TODOS', c, 'Bien contar los divisores. Pero los simples no son compuestos.'),
      ],
      solucion: [[`CD(N) = ${c}; los simples son el 1 y ${k} primos.`], [`${c} − ${k} − 1 = `, Bv(comp), '.']],
      _datos: { N },
    };
  }
  function expOculto(rng) {
    const b = rng.entero(1, 3), al = rng.entero(2, 6), T = (al + 1) * (b + 1), N = 2 ** al * 3 ** b, s = T - b - 2;
    if (N > 5000) return null;
    return {
      enunciado: [`N = 2ᵅ × 3${b > 1 ? sup(b) : ''} tiene ${T} divisores.`],
      pregunta: ['¿Cuánto vale N?'],
      datos: [D.cd],
      correcta: N,
      errores: [
        h('AT-CD-SIN-UNO', 2 ** (al + 1) * 3 ** b, `Bien dividir ${T} entre ${b + 1}. Pero eso da α + 1, no α.`),
        h('AT-CD-SUMA', s > 0 && s !== al ? 2 ** s * 3 ** b : null, `Bien usar α + 1 y ${b + 1}. Pero se multiplican, no se suman.`),
        h('AT-RESPONDE-OTRA', al, `Bien, α = ${al}. Pero se pide N.`),
      ],
      solucion: [[`(α + 1) × ${b + 1} = ${T}: α = ${al}.`], [`N = 2${sup(al)} × 3${b > 1 ? sup(b) : ''} = `, Bv(N), '.']],
      _datos: { b, T },
    };
  }

  // ======================= Idea 5: función de Euler =======================
  function phiDos(rng) {
    const [p, q] = rng.elegir([[2, 3], [2, 5], [2, 7], [3, 5], [3, 7], [2, 11], [5, 7]]), a = rng.entero(1, 3), b = rng.entero(1, 2), N = p ** a * q ** b;
    if (N > 400 || N < 20) return null;
    return {
      enunciado: [`N = ${N} = ${canon(N)}.`],
      pregunta: [`¿Cuántos números del 1 al ${N} son PESI con ${N}?`],
      datos: [D.phi, D.phiF],
      correcta: phi(N),
      errores: [
        h('AT-EULER-DOBLE', N - N / p - N / q, `Bien quitar los múltiplos de ${p} y de ${q}. Pero los de ${p * q} se quitaron dos veces.`),
        h('AT-EULER-UN-PRIMO', N - N / p, `Bien quitar los múltiplos de ${p}. Faltan los de ${q}.`),
        h('AT-EULER-FRACCION', N / (p * q), `Bien usar los dos primos. Pero cada uno deja 1 − 1/${p}, no 1/${p}.`),
      ],
      solucion: [[`Sin múltiplos de ${p} quedan ${N - N / p}; de esos, sin los de ${q}.`], [`${N} × (1 − 1/${p}) × (1 − 1/${q}) = `, Bv(phi(N)), '.']],
      _datos: { N },
    };
  }
  function phiTres(rng) {
    const pot = rng.entero(0, 4) < 2;
    const N = pot ? rng.elegir([8, 16, 32, 27, 81, 25, 125, 49, 64]) : rng.elegir([2, 4]) * rng.elegir([3, 9]) * rng.elegir([5, 7]);
    const ps = factores(N).map(z => z[0]), p = ps[0], c = phi(N);
    return {
      enunciado: [`N = ${N} = ${canon(N)}.`],
      pregunta: [`¿Cuánto vale φ(${N})?`],
      datos: [D.phi, D.phiF],
      correcta: c,
      errores: pot ? [
        h('AT-EULER-PRIMO-SIEMPRE', N - 1, `Bien, N − 1 vale con un primo. Pero ${N} no lo es.`),
        h('AT-EULER-FRACCION', N / p, `Bien hallar los múltiplos de ${p}. Pero se piden los que quedan.`),
        h('AT-EULER-PRIMOS', primosHasta(N).length, `Bien contar primos. Pero un PESI con ${N} no tiene que ser primo: el 1, que no es primo, también cuenta.`),
      ] : [
        h('AT-EULER-UN-PRIMO', N - N / p, `Bien quitar los múltiplos de ${p}. Faltan los de ${yLista(ps.slice(1))}.`),
        h('AT-EULER-PRIMO-SIEMPRE', N - 1, `Bien, N − 1 vale con un primo. Pero ${N} tiene los primos ${yLista(ps)}.`),
        h('AT-EULER-PRIMOS', primosHasta(N).length, `Bien contar primos. Pero un PESI con ${N} no tiene que ser primo: el 1, que no es primo, también cuenta.`),
      ],
      solucion: [[`Entran ${ps.length === 1 ? `solo el ${p}` : `los primos ${yLista(ps)}`}, sin sus exponentes.`], [`${N}${ps.map(x => ` × (1 − 1/${x})`).join('')} = `, Bv(c), '.']],
      _datos: { N },
    };
  }
  function irreductibles(rng) {
    const N = rng.elegir([12, 15, 18, 20, 21, 24, 28, 30, 35, 36, 40, 42, 45]), c = phi(N);
    return {
      enunciado: [`Una torta se parte en ${N} tajadas iguales.`],
      pregunta: [`¿Cuántas fracciones propias irreductibles tienen denominador ${N}?`],
      datos: [D.frac, D.phiF],
      correcta: c,
      errores: [
        h('AT-EULER-TODAS', N - 1, `Bien, hay ${N - 1} fracciones propias. Pero muchas se simplifican.`),
        h('AT-EULER-MITAD', c / 2, 'Bien las mayores que 1/2. Pero las menores también cuentan.'),
        h('AT-COND-COMPLEMENTO', N - 1 - c, 'Bien la resta. Pero esas son las que sí se simplifican.'),
      ],
      solucion: [[`k/${N} es irreductible si k y ${N} son PESI: son φ(${N}).`], [`${N}${factores(N).map(([x]) => ` × (1 − 1/${x})`).join('')} = `, Bv(c), '.']],
      _datos: { N },
    };
  }
  function cota(rng) {
    const N = rng.elegir([14, 15, 18, 20, 21, 22, 24, 26, 28, 30, 33, 35, 36]), c = phi(N);
    let todas = 0; for (let k = 1; k < N; k++) if (2 * k > N) todas++;
    return {
      enunciado: [`Se toman las fracciones de denominador ${N}.`],
      pregunta: [`¿Cuántas son irreductibles, mayores que 1/2 y menores que 1?`],
      datos: [D.frac, D.sim, D.phiF],
      correcta: c / 2,
      errores: [
        h('AT-EULER-COTA', c, `Bien las ${c} irreductibles. Pero la mitad es menor que 1/2.`),
        h('AT-EULER-TODAS', todas, `Bien, hay ${todas} entre 1/2 y 1. Pero no todas son irreductibles.`),
        h('AT-EULER-EXTREMO', c / 2 + 1, `Bien la mitad. Pero ${N}/${N} no entra: es igual a 1.`),
      ],
      solucion: [[`φ(${N}) = ${c} irreductibles, en parejas que suman 1.`], [`La mitad pasa de 1/2: ${c} ÷ 2 = `, Bv(c / 2), '.']],
      _datos: { N },
    };
  }

  // ======================= Idea 6: Fermat y Wilson =======================
  function wilson(rng) {
    const p = rng.elegir([11, 13, 17, 19, 23]);
    return {
      enunciado: [`Se multiplica 1 × 2 × 3 × … × ${p - 1}.`],
      pregunta: ['¿Qué resto deja al dividirlo entre ', Ev(p), '?'],
      datos: [D.wilson, D.fermat],
      correcta: p - 1,
      errores: [
        h('AT-WILSON-UNO', 1, 'Bien usar un teorema. Pero 1 es lo que deja una potencia (Fermat); esto es un producto.'),
        h('AT-WILSON-CERO', 0, `Bien pensar en múltiplos. Pero el producto llega a ${p - 1}, y ${p} es primo.`),
        h('AT-WILSON-MENOS-DOS', p - 2, `Bien usar Wilson. Pero dice p − 1, no p − 2.`),
      ],
      solucion: [[`${p} es primo: por Wilson, el producto deja ${p} − 1.`], ['Resto ', Rv(p - 1), '.']],
      _datos: { p, c: 0 },
    };
  }
  function fermat(rng) {
    const p = rng.elegir([5, 7, 11, 13]), a = rng.elegir([2, 3, 4, 6, 8, 9, 10, 12].filter(x => x % p)), n = rng.entero(30, 99), s = n % (p - 1), r = powmod(a, n, p);
    if (s === 0) return null;
    return {
      // Sin caramelos: 12⁹⁹ caramelos no es un pedido creíble (auditoría, 19 nov).
      enunciado: [`Se divide ${a}${sup(n)} entre `, Ev(p), '.'],
      pregunta: ['¿Qué resto deja?'],
      datos: [D.fermat, D.expS, D.resto],
      correcta: r,
      errores: [
        h('AT-FERMAT-SIEMPRE-UNO', 1, `Bien usar Fermat. Pero da 1 solo si el exponente es múltiplo de ${p - 1}.`),
        h('AT-FERMAT-BASE', a % p, `Bien, ${a} deja ${a % p}. Pero el exponente es ${n}.`),
        h('AT-EXP-DIVISOR', powmod(a, n % p, p), `Bien reducir el exponente. Pero entre ${p - 1}, no entre ${p}.`),
        h('AT-CICLO-LUGAR', s, `Bien, queda ${a}${sup(s)}. Pero falta ver qué deja.`),
      ],
      solucion: [[`${n} = ${p - 1} × ${Math.floor(n / (p - 1))} + ${s}: cada bloque de ${p - 1} deja 1, y queda ${a}${sup(s)}.`], [`${a}${sup(s)} deja `, Rv(r), ` entre ${p}.`]],
      _datos: { a, n, p },
    };
  }
  function noVale(rng) {
    if (rng.entero(0, 1) === 0) {
      const p = rng.elegir([5, 7, 11]), a = p * rng.entero(2, 4);
      return {
        enunciado: [`Se divide ${a}${sup(p - 1)} entre `, Ev(p), '.'],
        pregunta: ['¿Qué resto deja?'],
        datos: [D.fermat, D.resto],
        correcta: 0,
        errores: [
          h('AT-FERMAT-MULTIPLO', 1, `Bien, ${p} es primo. Pero ${a} es múltiplo de ${p}: Fermat no vale.`),
          h('AT-FERMAT-MENOS-UNO', p - 1, `Bien mirar el exponente. Pero ${p - 1} no es lo que sobra.`),
          h('AT-RESTO-MAYOR', p, `Bien, ${a} es múltiplo de ${p}. Pero un resto es menor que ${p}.`),
        ],
        solucion: [[`${a} = ${p} × ${a / p}: deja 0, y su potencia también.`], ['Resto ', Rv(0), '.']],
        _datos: { a, n: p - 1, p },
      };
    }
    // Sin el 25: sus ciclos de restos miden 10 o 20 (auditoría, 19 nov; ciclos de 3 a 6, como en Divisibilidad).
    const m = rng.elegir([9, 15, 21]), a = rng.elegir([2, 4, 8].filter(x => mcd(x, m) === 1)), r = powmod(a, m - 1, m);
    if (r === 1) return null;
    return {
      enunciado: [`Se divide ${a}${sup(m - 1)} entre `, Ev(m), '.'],
      pregunta: ['¿Qué resto deja?'],
      datos: [D.fermat, D.ciclo, D.resto],
      correcta: r,
      errores: [
        h('AT-FERMAT-NO-PRIMO', 1, `Bien pensar en Fermat. Pero ${m} = ${canon(m)} no es primo.`),
        h('AT-FERMAT-MENOS-UNO', m - 1, `Bien mirar el exponente. Pero ${m - 1} no es lo que sobra.`),
        h('AT-FERMAT-BASE', a, `Bien, ${a} deja ${a}. Pero hay que seguir el ciclo hasta ${m - 1}.`),
      ],
      solucion: [[`${m} no es primo: se sigue el ciclo de restos de ${a}: ${Array.from({ length: 6 }, (_, i) => powmod(a, i + 1, m)).join(', ')}…`], ['Resto ', Rv(r), '.']],
      _datos: { a, n: m - 1, p: m },
    };
  }
  function wilsonMas(rng) {
    const p = rng.elegir([7, 11, 13, 17, 19]), c = rng.entero(2, p - 2), r = (p - 1 + c) % p;
    return {
      enunciado: [`Se calcula 1 × 2 × 3 × … × ${p - 1} + ${c}.`],
      pregunta: ['¿Qué resto deja al dividirlo entre ', Ev(p), '?'],
      datos: [D.wilson, D.resto],
      correcta: r,
      errores: [
        h('AT-WILSON-CERO', c, `Bien sumar ${c}. Pero el producto no es múltiplo de ${p}: deja ${p - 1}.`),
        h('AT-RESTO-MAYOR', p - 1 + c, `Bien, ${p - 1} + ${c}. Pero un resto es menor que ${p}.`),
        h('AT-WILSON-UNO', (1 + c) % p, 'Bien sumar. Pero el producto no deja 1 (eso es Fermat): deja p − 1.'),
      ],
      solucion: [[`El producto deja ${p - 1}; con ${c} más son ${p - 1 + c}.`], [`${p - 1 + c} = ${p} × 1 + `, Rv(r), '.']],
      _datos: { p, c },
    };
  }

  const CONSTRUIR = {
    'cual-primo': cualPrimo, 'cuantos-divisores': cuantosDivisores, 'formas-cuadrado': formasCuadrado, 'dos-primos': dosPrimos,
    'hasta-primo': hastaPrimo, 'menor-primo': menorPrimo, 'primos-tramo': primosTramo, 'primos-pa': primosPA,
    canonica, exponente, pesi, potencias,
    cd, sd, condicion, compuestos, 'exp-oculto': expOculto,
    phi: phiDos, 'phi-tres': phiTres, irreductibles, cota,
    wilson, fermat, 'no-vale': noVale, 'wilson-mas': wilsonMas,
  };

  return { id: ID, titulo: 'La vitrina de los primos', generar, TIPOS_POR_IDEA, TIPOS_POR_UNIDAD, NIVEL };
});
