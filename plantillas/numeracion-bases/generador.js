/*
 * Generador «El puesto de las bases»: práctica de «Sistemas de numeración» (aritmetica.numeracion;
 * contenido/teoria/aritmetica/numeracion.js), con tipos separados por idea. Formato "predicciones"
 * (docs/arquitectura.md). Funciona en el navegador (window.Generadores['numeracion-bases']) y en Node (require). No usa
 * ningún motor: las cuentas son divisiones enteras y potencias chicas.
 *
 * Propuesta aprobada: docs/etapa3/propuesta-aritmetica.md §7 y §9 (pregunta 8) y docs/etapa3/decisiones.md (Numeración).
 * Hilo, como en la teoría: el puesto de caramelos de doña Juana (n sueltos llenan una bolsita, n bolsitas una caja) y,
 * en la idea 5, la rifa y su imprenta. Valores de problema, sin fuente: bolsitas de 2 a 9, rifas de hasta 999 boletos.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 básico, 2 intermedio, 3 examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las cinco con el mismo peso.
 *   agrupar           etiqueta (1; sub cajas, 2) N caramelos en bolsitas de n: la etiqueta · mal-escrito (1) cuál está
 *                     mal escrito · menor-base (2; sub tres, 3) la menor base de uno o de tres numerales ·
 *                     sucesor (3) el numeral que sigue o el que queda si llegan k caramelos (llevadas en cadena)
 *   descomposicion    valor (1) un numeral a base 10 · ordenar (2) el mayor o el menor de cuatro numerales de bases
 *                     distintas · mayor-k (2) el mayor numeral de k cifras en base n · cruzados (3) a̅b̅₍ₙ₎ + b̅a̅₍ₙ₎
 *                     si se conoce a + b, o a̅b̅₍ₙ₎ − b̅a̅₍ₙ₎ si se conoce a − b
 *   cambio-base       de-10 (1) N a base n · entre-bases (2) de base n a otra base (verde) · suma-cifras (3, San Marcos
 *                     2022) · paquetes (3, San Marcos 2019-I) el mínimo de paquetes de 1, n, n², n³
 *   base-desconocida  lineal (1) d̅e̅₍ₙ₎ = N · cuadratica (2) 1̅2̅1̅₍ₙ₎ = N y sus parientes · otra-etiqueta (2) con una
 *                     etiqueta se halla la base y se lee otra · acotar (3, San Marcos 2022 y 2023-II) la misma cifra en
 *                     dos bases, o cuántos valores toma una cifra con parámetro · mayor-suma (3, San Marcos 2025-I)
 *   conteo-cifras     cifras (1) del 1 al N · hasta (2) con tantas cifras, hasta qué boleto · cuantos-k (2) cuántos
 *                     numerales de k cifras hay en base n · cifras-base (3) del 1 al N escritos en base n ·
 *                     bases-tres (3, San Marcos 2026-II) en cuántas bases N tiene tres cifras
 *
 * Notación (decisiones, Numeración): la base se llama n; numerales 342₍₆₎ con la base de subíndice entre paréntesis y,
 * si llevan letras, con raya (a̅b̅c̅₍ₙ₎, U+0305 sobre cada carácter: son cifras, no un producto). Sin base escrita, la
 * base es 10. «×» para multiplicar. Las alternativas son texto plano: el numeral va con sus subíndices Unicode.
 * Colores: un color fijo por magnitud, el de la teoría (cabecera de la unidad; docs/molde-unidad.md §5b): la cantidad en
 * base 10 violeta (N, f), la base turquesa (n, i), las cifras y los restos naranja (c, o), la segunda base verde (m, d),
 * solo en entre-bases. Sin carmín. Lo que se pide va en tinta en la pregunta, como en la teoría.
 * Datos (docs/plan-calidad.md §3, punto 13): la regla de las cifras, la descomposición en letras, la división con
 * resto, «del primero, p, al último, u, hay u − p + 1» (p y u, no a y z: a es siempre una cifra; auditoría, M6) y las
 * potencias como multiplicación; nunca el paso hecho ni la respuesta.
 * Errores: los códigos AT-* de la teoría de la unidad (hipótesis de aula, sin medir: el informe
 * docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md no trae cifras de numeración); los de cifras que no
 * respetan la base, restos al revés y poste y valla citan las trampas 23 y 24 de
 * docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md. Nuevos aquí (hipótesis): AT-RAIZ (toma √N como
 * base), AT-SIGUIENTE (da el primer numeral de k + 1 cifras), AT-SIN-CERO (no usa el 0 en ningún lugar).
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
  const ID = 'numeracion-bases';
  const TRAMPAS = 'docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md';
  const v = P.v;
  const f0 = x => P.formatear(x, 0);

  // ---- Escritura de numerales ----
  const SUBD = '₀₁₂₃₄₅₆₇₈₉', SUBL = { n: 'ₙ' };
  const SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sub = x => [...String(x)].map(c => (c >= '0' && c <= '9' ? SUBD[c] : SUBL[c] || c)).join('');
  const sup = x => [...String(x)].map(c => SUPD[c]).join('');
  const RAYA = '̅';
  // La raya va solo si el numeral lleva letras (a̅b̅₍ₙ₎); 342₍₆₎ va sin raya.
  const cifrasT = s => (/[a-z]/.test(s) ? [...s].map(c => c + RAYA).join('') : s);
  const numT = (cifras, base) => (base === 10 ? cifrasT(cifras) : `${cifrasT(cifras)}₍${sub(base)}₎`);
  // El numeral con sus colores: las cifras naranja, la base turquesa (o verde, si es la segunda base).
  const nv = (cifras, base, clave = 'n') => (base === 10 ? [v('c', cifrasT(cifras))] : [v('c', cifrasT(cifras)), v(clave, `₍${sub(base)}₎`)]);
  const Q = x => v('N', typeof x === 'number' ? f0(x) : x);   // cantidad en base 10, violeta
  const B = x => v('n', String(x));                           // la base, turquesa
  const C = x => v('c', String(x));                           // cifras, naranja
  const M = x => v('m', String(x));                           // la segunda base, verde
  const VARS = { N: { nombre: 'la cantidad en base 10', color: 'f' }, n: { nombre: 'la base', color: 'i' },
    c: { nombre: 'las cifras', color: 'o' }, m: { nombre: 'la segunda base', color: 'd' } };

  // ---- Cuentas ----
  const enBase = (N, n) => { if (N === 0) return '0'; let s = ''; while (N > 0) { s = String(N % n) + s; N = Math.floor(N / n); } return s; };
  const valor = (cifras, n) => [...cifras].reduce((a, c) => a * n + Number(c), 0);
  const divisiones = (N, n) => { const out = []; for (let x = N; x > 0; x = Math.floor(x / n)) out.push({ x, q: Math.floor(x / n), r: x % n }); return out; };
  const sumaCif = t => [...t].reduce((a, c) => a + Number(c), 0);
  const alReves = t => [...t].reverse().join('');
  // Cifras que se gastan al escribir del a al N en base n, bloque por bloque.
  function bloques(N, n, a = 1) {
    const out = [];
    for (let k = 1; n ** (k - 1) <= N; k++) {
      const lo = Math.max(a, n ** (k - 1)), hi = Math.min(N, n ** k - 1);
      if (hi >= lo) out.push({ k, a: lo, z: hi, cuantos: hi - lo + 1, cifras: (hi - lo + 1) * k });
    }
    return out;
  }
  const totalCif = bl => bl.reduce((s, b) => s + b.cifras, 0);

  // ---- Errores ----
  const h = (id, valor, explicacion, fuente = null) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  const ht = (id, cifras, base, explicacion, fuente = null) => { const t = numT(cifras, base); return { id, clave: t, texto: t, explicacion, respaldo: 'hipotesis', fuente }; };
  const T = TRAMPAS;
  const pl = (k, uno, varios) => (k === 1 ? uno : varios);

  // ---- Datos que se repiten (herramientas, no el paso hecho) ----
  const D = {
    cifras: 'En base n, las cifras van de 0 a n − 1',
    sinBase: 'Un numeral sin base escrita está en base 10',
    primera: 'La primera cifra de un numeral de varias cifras no es 0',
    baseEntera: 'La base es un número entero de 2 o más',
    f2: 'a̅b̅₍ₙ₎ = a × n + b',
    f3: 'a̅b̅c̅₍ₙ₎ = a × n² + b × n + c',
    f4: 'a̅b̅c̅d̅₍ₙ₎ = a × n³ + b × n² + c × n + d',
    fk: k => (k <= 2 ? D.f2 : k === 3 ? D.f3 : D.f4),
    pot: (n, k) => [`${n}² = ${n} × ${n}`, `${n}³ = ${n} × ${n} × ${n}`].slice(0, Math.max(1, k - 2)).join('; '),
    div: n => `N = q × ${n} + r, con 0 ≤ r < ${n} (q: cociente; r: resto)`,
    hasta: 'Del primero, p, al último, u, hay u − p + 1 números',
    bloques10: 'Del 1 al 9, una cifra; del 10 al 99, dos; del 100 al 999, tres',
    etiqueta: 'Etiqueta: primero lo más grande (cajas, bolsitas), al final los sueltos; abajo, la base',
  };

  // ---- Tipos por idea ----
  const TIPOS_POR_IDEA = {
    agrupar: ['etiqueta', 'mal-escrito', 'menor-base', 'sucesor'],
    descomposicion: ['valor', 'ordenar', 'mayor-k', 'cruzados'],
    'cambio-base': ['de-10', 'entre-bases', 'suma-cifras', 'paquetes'],
    'base-desconocida': ['lineal', 'cuadratica', 'otra-etiqueta', 'acotar', 'mayor-suma'],
    'conteo-cifras': ['cifras', 'hasta', 'cuantos-k', 'cifras-base', 'bases-tres'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));

  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8» y rotula 3 básicos, 3 intermedios y 2
  // avanzados): recorre las cinco ideas en orden de nivel.
  const PAPEL = { 'papel-1': ['etiqueta', 'bolsitas'], 'papel-2': ['valor'], 'papel-3': ['de-10'], 'papel-4': ['cuantos-k'],
    'papel-5': ['entre-bases'], 'papel-6': ['otra-etiqueta'], 'papel-7': ['acotar', 'suma'], 'papel-8': ['cruzados', 'suma'] };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const forzado = !o.idea && PAPEL[String(semilla)];
    let tipo, sub0;
    if (forzado) [tipo, sub0] = forzado;
    else {
      const idea = TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS);
      tipo = rng.elegir(TIPOS_POR_IDEA[idea]);
    }
    for (let intento = 0; intento < 500; intento++) {
      const pr = CONSTRUIR[tipo](rng, sub0);
      const p = pr && cerrar(rng, semilla, tipo, pr);
      if (p) return p;
    }
    throw new Error(`No se pudo generar un problema de ${tipo} con 4 alternativas distintas`);
  }

  // Arma las alternativas y el problema. Variables: solo las que se usan.
  function cerrar(rng, semilla, tipo, o) {
    let alternativas, respuesta;
    if (o.correctaTexto) {
      alternativas = P.armarTexto({ correcta: { clave: o.correctaTexto, texto: o.correctaTexto }, errores: o.errores.filter(Boolean), rng });
      respuesta = { valor: o.correctaTexto, texto: o.correctaTexto, unidad: '' };
    } else {
      const errores = o.errores.filter(e => e && Number.isInteger(e.valor) && e.valor > 0 && e.valor !== o.correcta && P.enEscala(e.valor, o.correcta, e.id));
      alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.texto || f0 });
      respuesta = { valor: o.correcta, unidad: o.unidad || '' };
    }
    if (alternativas.length < 4) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object') usadas.add(x.v);
    const variables = Object.fromEntries([...usadas].map(k => [k, VARS[k]]));
    return {
      id: `${ID}#${semilla}`, variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos,
      alternativas, solucion: o.solucion, respuesta,
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo }, o._datos),
    };
  }
  const NIVEL = { etiqueta: 1, 'mal-escrito': 1, 'menor-base': 2, sucesor: 3, valor: 1, ordenar: 2, 'mayor-k': 2, cruzados: 3,
    'de-10': 1, 'entre-bases': 2, 'suma-cifras': 3, paquetes: 3, lineal: 1, cuadratica: 2, 'otra-etiqueta': 2, acotar: 3,
    'mayor-suma': 3, cifras: 1, hasta: 2, 'cuantos-k': 2, 'cifras-base': 3, 'bases-tres': 3 };

  // ======================= Idea 1: agrupar de n en n =======================

  function etiqueta(rng, forzado) {
    const sub0 = forzado || rng.elegir(['bolsitas', 'bolsitas', 'cajas']);
    if (sub0 === 'bolsitas') {
      const n = rng.entero(3, 9), q = rng.entero(1, n - 1), r = rng.entero(1, n - 1);
      if (q === r) return null;
      const N = q * n + r, ok = `${q}${r}`;
      return {
        enunciado: ['Doña Juana empaca ', Q(`${N} caramelos`), ' en bolsitas de ', B(n), '. Llena todas las bolsitas que puede.'],
        pregunta: ['¿Qué etiqueta lleva el pedido?'],
        datos: [`1 bolsita = ${n} caramelos`, D.etiqueta],
        correctaTexto: numT(ok, n),
        errores: [
          ht('AT-ORDEN', `${r}${q}`, n, `Bien las cuentas: ${q} bolsitas y ${r} sueltos. Pero ${numT(`${r}${q}`, n)} dice ${r} bolsitas y ${q} sueltos: primero van las bolsitas.`),
          ht('AT-DECIMAL', String(N), n, `Bien el total, ${N} caramelos. Pero ${numT(String(N), n)} no es ${N}: en base ${n} se anota cuántas bolsitas y cuántos sueltos hay.`),
          q >= 2 && r + n <= 9 ? ht('AT-CIFRA-B', `${q - 1}${r + n}`, n, `Bien juntar en bolsitas. Pero ${numT(`${q - 1}${r + n}`, n)} deja ${r + n} sueltos, y con ${n} ya se llena otra bolsita: la cifra ${r + n} no existe en base ${n}.`, T) : null,
          ht('AT-SIN-SUELTOS', String(q), n, `Bien las ${q} bolsitas. Pero ${numT(String(q), n)} deja fuera los ${r} sueltos: también se anotan, a la derecha.`),
        ],
        solucion: [
          ['Se juntan los caramelos de ', B(n), ' en ', B(n), ': ', Q(N), ` = ${q} × `, B(n), ' + ', C(r), '.'],
          ['Quedan ', C(q), pl(q, ' bolsita y ', ' bolsitas y '), C(r), pl(r, ' suelto', ' sueltos'), '. La etiqueta es ', ...nv(ok, n), '.'],
        ],
        _datos: { sub: sub0, nivel: 1, N, n },
      };
    }
    // cajas: tres órdenes. Las bolsitas de la primera ronda son 9 o menos, para que el error «junta una vez» se lea.
    const n = rng.entero(3, 6), N = rng.entero(n * n, Math.min(n ** 3 - 1, 10 * n - 1));
    const t = enBase(N, n), q1 = Math.floor(N / n), r0 = N % n, q2 = Math.floor(q1 / n), r1 = q1 % n;
    if (r0 === 0) return null;
    return {
      enunciado: ['Doña Juana empaca ', Q(`${N} caramelos`), ' en bolsitas de ', B(n), ', y junta las bolsitas en cajas de ', B(n), ' bolsitas.'],
      pregunta: ['¿Qué etiqueta lleva el pedido?'],
      datos: [`1 bolsita = ${n} caramelos; 1 caja = ${n} bolsitas`, D.etiqueta],
      correctaTexto: numT(t, n),
      errores: [
        ht('AT-LLEVA-UNA', `${q1}${r0}`, n, `Bien la primera ronda: ${q1} bolsitas y ${r0} sueltos. Pero ${numT(`${q1}${r0}`, n)} deja ${q1} bolsitas, y cada ${n} forman una caja.`, T),
        r0 !== 0 && alReves(t) !== t ? ht('AT-ORDEN', alReves(t), n, `Bien las tres cifras. Pero ${numT(alReves(t), n)} las pone al revés: las cajas van primero y los sueltos al final.`) : null,
        ht('AT-DECIMAL', String(N), n, `Bien el total, ${N} caramelos. Pero ${numT(String(N), n)} no es ${N}: en base ${n} se anotan cajas, bolsitas y sueltos.`),
        ht('AT-SIN-SUELTOS', `${q2}${r1}`, n, `Bien las cajas y las bolsitas. Pero ${numT(`${q2}${r1}`, n)} deja fuera los ${r0} sueltos.`),
      ],
      solucion: [
        ['Primera ronda: ', Q(N), ` = ${q1} × `, B(n), ' + ', C(r0), `: ${q1} bolsitas y `, C(r0), pl(r0, ' suelto.', ' sueltos.')],
        ['Segunda ronda: ', `${q1} = ${q2} × `, B(n), ' + ', C(r1), ': ', C(q2), pl(q2, ' caja y ', ' cajas y '), C(r1), pl(r1, ' bolsita.', ' bolsitas.')],
        ['La etiqueta es ', ...nv(t, n), '.'],
      ],
      _datos: { sub: 'cajas', nivel: 2, N, n },
    };
  }

  function malEscrito(rng) {
    const n = rng.entero(3, 8), k = rng.entero(3, 4);
    const malo = [rng.entero(1, n - 1)].concat(Array.from({ length: k - 1 }, () => rng.entero(0, n - 1)));
    const lugar = rng.entero(1, k - 1), mala = rng.entero(n, Math.min(9, n + 1));
    malo[lugar] = mala;
    const mt = malo.join('');
    const m1 = rng.entero(3, 9), mayor = [rng.entero(1, m1 - 1), rng.entero(0, m1 - 1), m1 - 1].join('');
    const m2 = rng.entero(3, 9), conCero = [rng.entero(1, m2 - 1), 0, rng.entero(1, m2 - 1)].join('');
    const diez = [rng.entero(6, 9), rng.entero(5, 9), rng.entero(7, 9)].join('');
    const dos = rng.elegir(['1011', '1101', '1110', '111']);
    if (new Set([n, m1, m2]).size < 3) return null;
    return {
      enunciado: ['Doña Juana revisa las etiquetas de varios puestos del mercado.'],
      pregunta: ['¿Cuál de estos numerales está mal escrito?'],
      datos: [D.cifras, D.sinBase],
      correctaTexto: numT(mt, n),
      errores: [
        ht('AT-CIFRA-MAYOR', mayor, m1, `Bien revisar cada cifra. Pero en ${numT(mayor, m1)} la cifra mayor es ${m1 - 1}, y en base ${m1} sí existe: las cifras van de 0 a ${m1 - 1}.`),
        ht('AT-CERO', conCero, m2, `Bien mirar el 0. Pero ${numT(conCero, m2)} está bien escrito: el 0 en medio dice que en ese orden no quedó nada.`),
        ht('AT-SIN-BASE', diez, 10, `Bien buscar la base. Pero ${diez} no tiene base escrita: está en base 10, y ahí todas sus cifras sirven.`),
        ht('AT-CIFRA-MAYOR', dos, 2, `Bien mirar la base 2. Pero ahí las cifras son 0 y 1: ${numT(dos, 2)} está bien escrito.`),
      ],
      solucion: [
        ['En ', ...nv(mt, n), ' aparece la cifra ', C(mala), ', y en base ', B(n), ` las cifras van solo de 0 a ${n - 1}.`],
        ['Los otros están bien: cada cifra es menor que su base, y el que no tiene base está en base 10.'],
      ],
      _datos: { nivel: 1, n, malo: mt },
    };
  }

  function menorBase(rng, forzado) {
    const sub0 = forzado || rng.elegir(['uno', 'uno', 'tres']);
    if (sub0 === 'uno') {
      const m = rng.entero(2, 8), k = rng.entero(3, 4);
      const c = [rng.entero(1, m)].concat(Array.from({ length: k - 1 }, () => rng.entero(0, m)));
      if (!c.includes(m)) c[rng.entero(0, k - 1)] = m;
      const txt = c.join('');
      return {
        enunciado: ['En una etiqueta del puesto se borró la base y quedó ', C(txt), '.'],
        pregunta: ['¿Cuál es la menor base en la que ese numeral está bien escrito?'],
        datos: [D.cifras, D.baseEntera],
        correcta: m + 1, texto: x => `base ${x}`,
        errores: [
          h('AT-CIFRA-B', m, `Bien mirar la cifra mayor, ${m}. Pero en base ${m} la cifra ${m} no existe: la base tiene que ser mayor que ${m}.`, T),
          h('AT-DECIMAL', 10, `Bien: en base 10 está bien escrito. Pero también lo está en bases más chicas que 10.`),
          h('AT-LARGO', k, `Bien contar las cifras: son ${k}. Pero la base no depende de cuántas cifras hay, sino de la mayor; base ${k} no sirve.`),
          h('AT-MENOR', 2, `Bien: la base 2 es la menor que existe. Pero en base 2 solo valen el 0 y el 1, y aquí hay un ${m}.`),
        ],
        solucion: [
          ['La cifra mayor de ', C(txt), ' es ', C(m), '. En base ', B('n'), ' las cifras llegan hasta n − 1, así que ', C(m), ' < ', B('n'), '.'],
          ['La menor base es ', B(m + 1), '.'],
        ],
        _datos: { sub: sub0, nivel: 2, cifras: [txt] },
      };
    }
    // tres: la misma base para tres numerales; manda la cifra mayor de los tres.
    const m = rng.entero(4, 8), m1 = rng.entero(2, m - 2);
    const a = [rng.entero(1, m1), rng.entero(0, m1), m1].join('');
    const b = [rng.entero(1, m - 1), rng.entero(0, m - 1), rng.entero(0, m - 1)].join('');
    const cc = [rng.entero(1, m - 1), m, rng.entero(0, m - 1)];
    const ct = rng.moneda() ? cc.join('') : [cc[0], cc[2], cc[1]].join('');
    return {
      enunciado: ['Tres etiquetas del mismo puesto dicen ', C(a), ', ', C(b), ' y ', C(ct), ', sin la base.'],
      pregunta: ['¿Cuál es la menor base en la que las tres están bien escritas?'],
      datos: [D.cifras, D.baseEntera],
      correcta: m + 1, texto: x => `base ${x}`,
      errores: [
        h('AT-CIFRA-B', m, `Bien buscar la cifra mayor de las tres, ${m}. Pero en base ${m} esa cifra no existe.`, T),
        h('AT-UNO-SOLO', m1 + 1, `Bien: para ${a} sirve la base ${m1 + 1}. Pero la misma base tiene que servir para las tres etiquetas.`),
        h('AT-DECIMAL', 10, 'Bien: en base 10 las tres están bien escritas. Pero hay bases más chicas que también sirven.'),
        h('AT-MENOR', 2, `Bien: la base 2 es la menor que existe. Pero en base 2 solo valen el 0 y el 1.`),
      ],
      solucion: [
        ['La cifra mayor de las tres etiquetas es ', C(m), ', en ', C(ct), '.'],
        ['La base tiene que pasarla: ', C(m), ' < ', B('n'), '. La menor es ', B(m + 1), '.'],
      ],
      _datos: { sub: 'tres', nivel: 3, cifras: [a, b, ct] },
    };
  }

  function sucesor(rng, forzado) {
    const sub0 = forzado || rng.elegir(['sigue', 'llegan']);
    if (sub0 === 'sigue') {
      const n = rng.entero(3, 7), k = rng.entero(3, 4), t = rng.entero(2, k - 1);
      const Dg = [rng.entero(1, n - 1)];
      while (Dg.length < k - t) Dg.push(rng.entero(0, n - 1));
      Dg[Dg.length - 1] = rng.entero(Dg.length === 1 ? 1 : 0, n - 2);
      while (Dg.length < k) Dg.push(n - 1);
      const dt = Dg.join(''), val = valor(dt, n), ans = enBase(val + 1, n);
      const sin = Dg.slice(0, -1).join(''), antes = Dg.slice(0, -2).join('');
      return {
        enunciado: ['Un pedido del puesto de bolsitas de ', B(n), ' se anota ', ...nv(dt, n), '. Le agregan un caramelo.'],
        pregunta: ['¿Cómo queda la etiqueta?'],
        datos: [`1 bolsita = ${n} caramelos; 1 caja = ${n} bolsitas; 1 cajón = ${n} cajas`, D.cifras],
        correctaTexto: numT(ans, n),
        errores: [
          ht('AT-CIFRA-B', `${sin}${n}`, n, `Bien sumar 1 a la última cifra. Pero ${numT(`${sin}${n}`, n)} usa la cifra ${n}: ${n} sueltos ya forman una bolsita.`, T),
          ht('AT-LLEVA-UNA', `${antes}${n}0`, n, `Bien: los sueltos forman una bolsita y queda 0. Pero ${numT(`${antes}${n}0`, n)} deja ${n} bolsitas, y también se juntan.`, T),
          ht('AT-PIERDE', `${sin}0`, n, `Bien el 0 de la derecha. Pero ${numT(`${sin}0`, n)} pierde la bolsita nueva: se suma al orden siguiente.`),
          ht('AT-DECIMAL', String(val + 1), 10, `Bien: ahora son ${val + 1} caramelos. Pero ${val + 1} es la cantidad en base 10; la etiqueta se escribe en base ${n}.`),
        ],
        solucion: [
          ['La última cifra es ', C(n - 1), ': con el caramelo nuevo hay ', B(n), ' sueltos, que forman 1 bolsita, y queda 0.'],
          ['Cada orden que llega a ', B(n), ' se junta en 1 del siguiente, hasta que uno no llega: ', ...nv(dt, n), ' + 1 = ', ...nv(ans, n), '.'],
        ],
        _datos: { sub: sub0, nivel: 3, n, cifras: dt, llega: 1 },
      };
    }
    const n = rng.entero(4, 6), c = rng.entero(1, n - 2), bb = rng.entero(n - 2, n - 1), s = rng.entero(1, n - 1), k = rng.entero(n, 2 * n + 2);
    const q1 = Math.floor((s + k) / n), r0 = (s + k) % n, q2 = Math.floor((bb + q1) / n), r1 = (bb + q1) % n;
    if (q2 < 1 || c + q2 >= n) return null;
    const dt = `${c}${bb}${s}`, ans = `${c + q2}${r1}${r0}`;
    return {
      enunciado: ['Un pedido del puesto de bolsitas de ', B(n), ' se anota ', ...nv(dt, n), '. Le agregan ', Q(`${k} caramelos`), ' sueltos.'],
      pregunta: ['¿Cuál es la nueva etiqueta?'],
      datos: [`1 bolsita = ${n} caramelos; 1 caja = ${n} bolsitas`, D.cifras],
      correctaTexto: numT(ans, n),
      errores: [
        ht('AT-DECIMAL', String(Number(dt) + k), n, `Bien sumar los que llegan. Pero ${numT(String(Number(dt) + k), n)} suma como en base 10, y aquí se junta de ${n} en ${n}.`),
        ht('AT-LLEVA-UNA', `${c}${bb + q1}${r0}`, n, `Bien: los sueltos forman ${q1} ${pl(q1, 'bolsita', 'bolsitas')} y quedan ${r0}. Pero ${numT(`${c}${bb + q1}${r0}`, n)} deja ${bb + q1} bolsitas, y pasan de ${n - 1}.`, T),
        r0 !== s ? ht('AT-PIERDE', `${c}${bb}${r0}`, n, `Bien los ${r0} sueltos que quedan. Pero ${numT(`${c}${bb}${r0}`, n)} pierde las bolsitas que se armaron.`) : null,
        s + k <= 9 ? ht('AT-CIFRA-B', `${c}${bb}${s + k}`, n, `Bien sumar los caramelos a los sueltos. Pero ${numT(`${c}${bb}${s + k}`, n)} deja ${s + k} sueltos, y cada ${n} forman una bolsita.`, T) : null,
      ],
      solucion: [
        ['Sueltos: ', `${s} + `, Q(k), ` = ${s + k} = ${q1} × `, B(n), ' + ', C(r0), `: ${q1} ${pl(q1, 'bolsita', 'bolsitas')} más y quedan `, C(r0), '.'],
        ['Bolsitas: ', `${bb} + ${q1} = ${bb + q1} = ${q2} × `, B(n), ' + ', C(r1), `: ${q2} ${pl(q2, 'caja', 'cajas')} más y quedan `, C(r1), '.'],
        ['Cajas: ', `${c} + ${q2} = `, C(c + q2), '. La etiqueta es ', ...nv(ans, n), '.'],
      ],
      _datos: { sub: 'llegan', nivel: 3, n, cifras: dt, llega: k },
    };
  }

  // ======================= Idea 2: cada cifra vale según su lugar =======================

  function valorT(rng) {
    const n = rng.entero(3, 9), k = n >= 4 && n <= 6 ? rng.entero(3, 4) : 3;
    const c = [rng.entero(1, n - 1)].concat(Array.from({ length: k - 1 }, () => rng.entero(0, n - 1)));
    if (rng.entero(0, 2) === 0) c[rng.entero(1, k - 2)] = 0;
    const t = c.join(''), V = valor(t, n), rev = valor(alReves(t), n);
    const conCero = t.slice(1).includes('0') && /[1-9]/.test(t.slice(1));
    const suma = c.reduce((a, x) => a + x, 0);
    const puesto = rng.moneda();
    return {
      enunciado: puesto ? ['Un pedido del puesto de bolsitas de ', B(n), ' se anota ', ...nv(t, n), '.'] : ['Un numeral está escrito en base ', B(n), ': ', ...nv(t, n), '.'],
      pregunta: [puesto ? '¿Cuántos caramelos tiene?' : '¿Cuánto vale en base 10?'],
      datos: [D.fk(k), D.pot(n, k)],
      correcta: V,
      errores: [
        h('AT-DECIMAL', Number(t), `Bien leer las cifras. Pero ${f0(Number(t))} sería el valor en base 10; en base ${n} cada lugar vale ${n} veces el de su derecha.`),
        h('AT-ORDEN', rev, `Bien multiplicar cada cifra por una potencia de ${n}. Pero la mayor va con la cifra de la izquierda; al revés sale ${f0(rev)}.`),
        conCero ? h('AT-CERO-LUGAR', valor(t.replace(/0/g, ''), n), `Bien que el 0 no sume. Pero ocupa su lugar: sin él, las cifras se corren y sale ${f0(valor(t.replace(/0/g, ''), n))}.`) : null,
        h('AT-SUMA', suma * n, `Bien usar la base. Pero cada cifra va con la potencia de su lugar, no todas por ${n}: (${c.join(' + ')}) × ${n} = ${f0(suma * n)}.`),
      ],
      solucion: [
        ['Cada cifra por lo que vale su lugar: ', ...nv(t, n), ' = ', c.map((x, i) => `${x} × ${n ** (k - 1 - i)}`).join(' + '), '.'],
        ['Se suma todo: ', c.map((x, i) => f0(x * n ** (k - 1 - i))).join(' + '), ' = ', Q(V), '.'],
      ],
      _datos: { nivel: 1, n, cifras: t },
    };
  }

  // Cuatro pedidos armados para que cada trampa apunte a otro: el de base mayor (AT-BASE-MAYOR), el que leído en base 10
  // parece mayor (AT-DECIMAL) y el de primera cifra mayor (AT-PRIMERA) no son el que tiene más caramelos.
  function ordenar(rng) {
    const sub0 = 'mayor';
    const B3 = rng.entero(6, 8), B4 = rng.entero(B3 + 1, 9), B2 = rng.entero(4, 5);
    const pedidos = [
      { papel: 'valor', base: B3, t: [1, rng.entero(0, B3 - 1), rng.entero(0, B3 - 1)].join('') },
      { papel: 'decimal', base: 3, t: [2, rng.entero(1, 2), rng.entero(0, 2)].join('') },
      { papel: 'primera', base: B2, t: [B2 - 1, rng.entero(0, B2 - 1)].join('') },
      { papel: 'base', base: B4, t: [1, rng.entero(0, B4 - 1)].join('') },
    ];
    const orden = rng.barajar([0, 1, 2, 3]);
    const ns = orden.map(i => pedidos[i].t), bases = orden.map(i => pedidos[i].base), val = ns.map((t, i) => valor(t, bases[i]));
    const donde = papel => orden.findIndex(i => pedidos[i].papel === papel);
    const iv = donde('valor'), ib = donde('base'), id = donde('decimal'), ip = donde('primera');
    const mas = sub0 === 'mayor' ? 'más' : 'menos';
    const lista = ns.flatMap((t, i) => [i === 0 ? '' : i === 3 ? ' y ' : ', ', ...nv(t, bases[i])]).filter(x => x !== '');
    return {
      enunciado: ['Cuatro puestos de bolsitas distintas anotan sus pedidos: ', ...lista, '.'],
      pregunta: [`¿Qué pedido tiene ${mas} caramelos?`],
      datos: [D.f3, D.f2],
      correctaTexto: numT(ns[iv], bases[iv]),
      errores: [
        ht('AT-BASE-MAYOR', ns[ib], bases[ib], `Bien comparar las bases: la de ${numT(ns[ib], bases[ib])} es la ${sub0 === 'mayor' ? 'mayor' : 'menor'}. Pero ese pedido tiene ${val[ib]} caramelos, y otro tiene ${val[iv]}.`),
        ht('AT-DECIMAL', ns[id], bases[id], `Bien comparar cifra por cifra. Pero leído en base 10 engaña: ${numT(ns[id], bases[id])} tiene ${val[id]} caramelos.`),
        ht('AT-PRIMERA', ns[ip], bases[ip], `Bien mirar la primera cifra. Pero ${numT(ns[ip], bases[ip])} tiene ${val[ip]} caramelos: lo que vale cada lugar depende de la base.`),
      ],
      solucion: [
        ['Se pasa cada pedido a base 10:'],
        ns.flatMap((t, i) => [i ? ';  ' : '', ...nv(t, bases[i]), ' = ', i === iv ? Q(val[i]) : f0(val[i])]).filter(x => x !== ''),
        [`El que tiene ${mas} caramelos es `, ...nv(ns[iv], bases[iv]), '.'],
      ],
      _datos: { sub: sub0, nivel: 2, numerales: ns.map((t, i) => [t, bases[i]]) },
    };
  }

  function mayorK(rng) {
    const n = rng.entero(3, 9), k = n <= 5 ? rng.entero(2, 4) : rng.entero(2, 3);
    const t = String(n - 1).repeat(k), V = n ** k - 1;
    return {
      enunciado: ['En base ', B(n), ' se escriben todos los numerales de ', C(k), ' cifras.'],
      pregunta: ['¿Cuánto vale en base 10 el mayor de ellos?'],
      datos: [D.cifras, D.fk(k), D.pot(n, Math.max(k, 3))],
      correcta: V,
      errores: [
        h('AT-DECIMAL', Number(t), `Bien: el mayor es ${numT(t, n)}. Pero ${f0(Number(t))} es como se lee en base 10; falta pasarlo.`),
        h('AT-CIFRA-B', n * (n ** k - 1) / (n - 1), `Bien usar la cifra más grande en cada lugar. Pero en base ${n} la mayor es ${n - 1}, no ${n}; con ${n} sale ${f0(n * (n ** k - 1) / (n - 1))}.`, T),
        h('AT-SIGUIENTE', n ** k, `Bien: ${numT('1' + '0'.repeat(k), n)} vale ${f0(n ** k)}. Pero ese ya tiene ${k + 1} cifras; el mayor de ${k} es uno menos.`),
        h('AT-PRODUCTO', (n - 1) ** k, `Bien: el mayor es ${numT(t, n)}. Pero sus cifras no se multiplican entre sí: ${Array(k).fill(n - 1).join(' × ')} = ${f0((n - 1) ** k)}.`),
      ],
      solucion: [
        ['La cifra mayor en base ', B(n), ' es ', C(n - 1), ': el mayor numeral de ', C(k), ' cifras es ', ...nv(t, n), '.'],
        [...nv(t, n), ' = ', Array.from({ length: k }, (_, i) => `${n - 1} × ${n ** (k - 1 - i)}`).join(' + '), ' = ', Q(V), '.'],
      ],
      _datos: { nivel: 2, n, k },
    };
  }

  function cruzados(rng, forzado) {
    const sub0 = forzado || rng.elegir(['suma', 'resta']);
    const n = rng.entero(4, 9);
    if (sub0 === 'suma') {
      const a = rng.entero(1, n - 1), b = rng.entero(1, n - 1);
      if (a === b) return null;
      const S = a + b, V = (n + 1) * S;
      return {
        enunciado: ['Las cifras ', C('a'), ' y ', C('b'), ' cumplen ', C('a'), ' + ', C('b'), ' = ', C(S), '.'],
        pregunta: ['¿Cuánto vale ', ...nv('ab', n), ' + ', ...nv('ba', n), ' en base 10?'],
        datos: [D.f2, 'a y b son cifras distintas de 0'],
        correcta: V,
        errores: [
          h('AT-DECIMAL', 11 * S, `Bien juntar las a y las b. Pero ${f0(11 * S)} sale con 10 + 1 = 11, como en base 10; aquí la base es ${n}.`),
          h('AT-SIN-UNIDADES', n * S, `Bien que cada cifra de la izquierda valga ${n}. Pero la de la derecha también cuenta, y vale 1: sale ${f0(n * S)} sin ella.`),
          h('AT-SUMA', 2 * S, `Bien sumar las cifras. Pero cada una vale según su lugar: la de la izquierda, ${n} veces; sin eso sale ${f0(2 * S)}.`),
        ],
        solucion: [
          ['Por descomposición: (', C('a'), ` × ${n} + `, C('b'), ') + (', C('b'), ` × ${n} + `, C('a'), `) = ${n + 1} × `, C('a'), ` + ${n + 1} × `, C('b'), '.'],
          [`${n + 1} × (`, C('a'), ' + ', C('b'), `) = ${n + 1} × ${S} = `, Q(V), '.'],
        ],
        _datos: { sub: sub0, nivel: 3, n, S },
      };
    }
    const d = rng.entero(1, n - 2), a = rng.entero(d + 1, n - 1), V = (n - 1) * d;
    if (a - d < 1) return null;
    return {
      enunciado: ['Las cifras ', C('a'), ' y ', C('b'), ' cumplen ', C('a'), ' − ', C('b'), ' = ', C(d), '.'],
      pregunta: ['¿Cuánto vale ', ...nv('ab', n), ' − ', ...nv('ba', n), ' en base 10?'],
      datos: [D.f2, 'a y b son cifras distintas de 0'],
      correcta: V,
      errores: [
        h('AT-DECIMAL', 9 * d, `Bien restar en orden. Pero ${f0(9 * d)} sale con 10 − 1 = 9, como en base 10; aquí la base es ${n}.`),
        h('AT-SIN-UNIDADES', n * d, `Bien que cada cifra de la izquierda valga ${n}. Pero la de la derecha también cuenta, y vale 1: sale ${f0(n * d)} sin ella.`),
        h('AT-SUMA', 2 * d, `Bien restar cifra con cifra. Pero cada una vale según su lugar: la de la izquierda, ${n} veces; sin eso sale ${f0(2 * d)}.`),
      ],
      solucion: [
        ['Por descomposición: (', C('a'), ` × ${n} + `, C('b'), ') − (', C('b'), ` × ${n} + `, C('a'), `) = ${n - 1} × `, C('a'), ` − ${n - 1} × `, C('b'), '.'],
        [`${n - 1} × (`, C('a'), ' − ', C('b'), `) = ${n - 1} × ${d} = `, Q(V), '.'],
      ],
      _datos: { sub: 'resta', nivel: 3, n, d },
    };
  }

  // ======================= Idea 3: de base 10 a otra base =======================

  const filasDiv = (N, n, colorN = true, Bx = B) => divisiones(N, n).map((x, i) => [i === 0 && colorN ? Q(x.x) : f0(x.x), ` = ${x.q} × `, Bx(n), ' + ', C(x.r)]);

  function de10(rng) {
    const n = rng.entero(2, 8);
    const N = n === 2 ? rng.entero(9, 40) : n === 3 ? rng.entero(10, 80) : rng.entero(n * n, Math.min(n ** 3 - 1, 250));
    const t = enBase(N, n), q1 = Math.floor(N / n), r0 = N % n;
    return {
      enunciado: ['Doña Juana tiene ', Q(`${N} caramelos`), ' para empacar en bolsitas de ', B(n), ' y en cajas de ', B(n), ' bolsitas.'],
      pregunta: ['¿Cómo se escribe ', Q(N), ' en base ', B(n), '?'],
      datos: [D.div(n), D.cifras],
      correctaTexto: numT(t, n),
      errores: [
        t[t.length - 1] !== '0' ? ht('AT-ORDEN', alReves(t), n, `Bien: las cifras son los restos. Pero ${numT(alReves(t), n)} los pone en el orden en que salen; el primer resto es la cifra de la derecha.`, T) : null,
        t[1] !== '0' ? ht('AT-CONTEO', t.slice(1), n, `Bien los restos. Pero ${numT(t.slice(1), n)} se saltó la última división: se sigue hasta que el cociente es 0.`) : null,
        ht('AT-DECIMAL', String(N), n, `Bien que el número no cambie. Pero su escritura sí: ${numT(String(N), n)} no vale ${N}.`),
        q1 >= n && q1 <= 9 ? ht('AT-LLEVA-UNA', `${q1}${r0}`, n, `Bien la primera división: ${N} = ${q1} × ${n} + ${r0}. Pero ${numT(`${q1}${r0}`, n)} se quedó ahí, y ${q1} no es una cifra de base ${n}.`, T) : null,
      ],
      solucion: [
        ['Se divide entre ', B(n), ' hasta que el cociente es 0:'],
        ...filasDiv(N, n),
        ['Los restos, del último al primero: ', Q(N), ' = ', ...nv(t, n), '.'],
      ],
      _datos: { nivel: 1, N, n },
    };
  }

  function entreBases(rng) {
    const a = rng.entero(3, 7), c = rng.elegir([3, 4, 5, 6, 7, 8, 9].filter(x => x !== a));
    const N = rng.entero(a * a, Math.min(a ** 3 - 1, 150)), na = enBase(N, a), nc = enBase(N, c);
    if (na === nc) return null;
    return {
      enunciado: ['Un pedido del puesto de bolsitas de ', B(a), ' se anota ', ...nv(na, a), '. Se vuelve a empacar en bolsitas de ', M(c), '.'],
      pregunta: ['¿Qué etiqueta lleva ahora?'],
      datos: [D.fk(na.length), D.div(c)],
      correctaTexto: numT(nc, c),
      errores: [
        ht('AT-COPIA', na, c, `Bien cambiar la base. Pero ${numT(na, c)} copia las cifras: con otras bolsitas, el mismo pedido lleva otras cifras.`),
        nc[nc.length - 1] !== '0' && alReves(nc) !== nc ? ht('AT-ORDEN', alReves(nc), c, `Bien los restos. Pero ${numT(alReves(nc), c)} los pone al revés: el primero va a la derecha.`, T) : null,
        ht('AT-DECIMAL', String(N), c, `Bien: el pedido tiene ${N} caramelos. Pero ${numT(String(N), c)} es copiar ${N}; falta empacarlos de ${c} en ${c}.`),
        nc[1] !== '0' ? ht('AT-CONTEO', nc.slice(1), c, `Bien los primeros restos. Pero ${numT(nc.slice(1), c)} se saltó la última división.`) : null,
      ],
      solucion: [
        ['Primero, cuántos caramelos son: ', ...nv(na, a), ' = ', [...na].map((x, i) => `${x} × ${a ** (na.length - 1 - i)}`).join(' + '), ' = ', Q(N), '.'],
        ['Después, divisiones entre ', M(c), ':'],
        ...filasDiv(N, c, true, M),
        ['Los restos, del último al primero: ', ...nv(nc, c, 'm'), '.'],
      ],
      _datos: { nivel: 2, cifras: na, de: a, a: c },
    };
  }

  function sumaCifras(rng) {
    const n = rng.entero(3, 9), N = rng.entero(Math.max(40, n * n), Math.min(n ** 4 - 1, 400)), t = enBase(N, n), ds = divisiones(N, n);
    return {
      enunciado: ['Se escribe ', Q(N), ' en base ', B(n), '.'],
      pregunta: ['¿Cuánto suman sus cifras?'],
      datos: [D.div(n), D.cifras],
      correcta: sumaCif(t),
      errores: [
        h('AT-COCIENTE', ds.reduce((x, d) => x + d.q, 0), `Bien dividir hasta llegar a 0. Pero las cifras son los restos, no los cocientes: los cocientes suman ${ds.reduce((x, d) => x + d.q, 0)}.`),
        h('AT-DECIMAL', sumaCif(String(N)), `Bien sumar cifras. Pero ${sumaCif(String(N))} es la suma de las cifras de ${N} en base 10; primero se pasa a base ${n}.`),
        t.length > 2 ? h('AT-CONTEO', sumaCif(t.slice(1)), `Bien los primeros restos. Pero falta la última división: sin ella suman ${sumaCif(t.slice(1))}.`) : null,
        t[t.length - 1] !== '0' ? h('AT-SIN-SUELTOS', sumaCif(t.slice(0, -1)), `Bien las divisiones. Pero el primer resto también es una cifra: sin él suman ${sumaCif(t.slice(0, -1))}.`) : null,
      ],
      solucion: [
        ...filasDiv(N, n),
        ['Los restos, del último al primero: ', Q(N), ' = ', ...nv(t, n), '.'],
        ['Sus cifras suman ', [...t].join(' + '), ' = ', C(sumaCif(t)), '.'],
      ],
      _datos: { nivel: 3, N, n },
    };
  }

  function paquetes(rng) {
    const n = rng.entero(3, 6), N = rng.entero(Math.max(30, n * n), Math.min(n ** 4 - 1, 300)), t = enBase(N, n), ds = divisiones(N, n);
    const tam = [1, n, n * n, n ** 3].filter(x => x <= N);
    return {
      enunciado: ['Doña Juana guarda ', Q(`${N} caramelos`), ' en paquetes llenos de ', tam.join(', ').replace(/, (\d+)$/, ' y $1'), ' caramelos.'],
      pregunta: ['¿Cuántos paquetes usa, como mínimo?'],
      datos: [`${n} paquetes de un tamaño tienen lo mismo que uno del tamaño siguiente`, D.div(n)],
      correcta: sumaCif(t),
      errores: [
        h('AT-COCIENTE', ds.reduce((x, d) => x + d.q, 0), `Bien juntar de ${n} en ${n}. Pero lo que se cuenta al final es lo que sobra en cada ronda, no los cocientes: ${ds.reduce((x, d) => x + d.q, 0)}.`),
        h('AT-DECIMAL', sumaCif(String(N)), `Bien sumar cifras. Pero ${sumaCif(String(N))} sale con paquetes de 1, 10 y 100; aquí los tamaños crecen de ${n} en ${n}.`),
        h('AT-UNO-POR-TAMAÑO', [...t].filter(x => x !== '0').length, `Bien usar paquetes grandes. Pero con ${[...t].filter(x => x !== '0').length} paquetes, uno de cada tamaño, no se completa el pedido: de un tamaño pueden ir varios.`),
      ],
      solucion: [
        ['Cada ', B(n), ' paquetes iguales forman uno mayor: es escribir ', Q(N), ' en base ', B(n), '.'],
        ...filasDiv(N, n),
        [Q(N), ' = ', ...nv(t, n), ': ', [...t].join(' + '), ' = ', C(sumaCif(t)), ' paquetes.'],
      ],
      _datos: { nivel: 3, N, n },
    };
  }

  // ======================= Idea 4: la base que no se ve =======================

  function lineal(rng) {
    const n = rng.entero(5, 9), d1 = rng.elegir([2, 3, 4]), m = rng.entero(1, 2), d0 = m * d1;
    if (d0 > n - 1) return null;
    const t = `${d1}${d0}`, N = d1 * n + d0;
    const puesto = rng.moneda();
    return {
      enunciado: puesto ? ['Una bolsa de un puesto vecino dice ', ...nv(t, 'n'), ' y tiene ', Q(`${N} caramelos`), '.'] : ['Se sabe que ', ...nv(t, 'n'), ' = ', Q(N), '.'],
      pregunta: [puesto ? '¿De cuántos caramelos es cada bolsita?' : '¿Cuánto vale la base n?'],
      datos: [D.f2, D.cifras],
      correcta: n, texto: x => `n = ${x}`,
      errores: [
        h('AT-MENOR', d0 + 1, `Bien: ${d0 + 1} es la menor base en que ${t} se puede escribir. Pero con n = ${d0 + 1}, ${numT(t, d0 + 1)} vale ${valor(t, d0 + 1)}, no ${N}.`),
        h('AT-SIGNO', (N + d0) / d1, `Bien plantear ${d1} × n + ${d0} = ${N}. Pero al despejar, el ${d0} pasa restando; sumando sale n = ${(N + d0) / d1}.`),
        h('AT-SIN-SUELTOS', N / d1, `Bien que la cifra de la izquierda vaya por n. Pero la de la derecha también cuenta, y vale 1: sin ella sale n = ${N / d1}.`),
      ],
      solucion: [
        ['La descomposición da una ecuación en ', B('n'), ': ', ...nv(t, 'n'), ` = ${d1} × `, B('n'), ` + ${d0} = `, Q(N), '.'],
        [`${d1} × `, B('n'), ` = ${N} − ${d0} = ${N - d0}, así que `, B('n'), ' = ', B(n), '.'],
        ['Sirve: la base es mayor que las cifras ', C(d1), ' y ', C(d0), '.'],
      ],
      _datos: { nivel: 1, cifras: t, N },
    };
  }

  // 1̅2̅1̅₍ₙ₎, 1̅4̅4̅₍ₙ₎, 1̅6̅9̅₍ₙ₎: valen (n + 1)², (n + 2)², (n + 3)².
  function cuadratica(rng) {
    const j = rng.elegir([1, 1, 2]), t = `1${2 * j}${j * j}`, mx = Math.max(2 * j, j * j);
    const n = rng.entero(mx + 2, 9), N = valor(t, n);
    return {
      enunciado: ['Se sabe que ', ...nv(t, 'n'), ' = ', Q(N), '.'],
      pregunta: ['¿Cuánto vale la base n?'],
      datos: [D.f3, D.cifras],
      correcta: n, texto: x => `n = ${x}`,
      errores: [
        h('AT-RAIZ', n + j, `Bien ver que ${N} = ${n + j} × ${n + j}. Pero con n = ${n + j}, ${numT(t, n + j)} vale ${valor(t, n + j)}, no ${N}.`),
        h('AT-MENOR', mx + 1, `Bien: la base es mayor que ${mx}. Pero con n = ${mx + 1}, ${numT(t, mx + 1)} vale ${valor(t, mx + 1)}, no ${N}.`),
        h('AT-CIFRA-B', mx, `Bien mirar la cifra mayor, ${mx}. Pero la base tiene que ser mayor que ella: en base ${mx} la cifra ${mx} no existe.`, T),
      ],
      solucion: [
        ['La descomposición da una ecuación en ', B('n'), ': ', ...nv(t, 'n'), ' = ', B('n'), `² + ${2 * j} × `, B('n'), ` + ${j * j} = `, Q(N), '.'],
        ['La base es mayor que ', C(mx), '. Se prueba desde ', B(mx + 1), ': ', Array.from({ length: n - mx }, (_, i) => `con ${mx + 1 + i}, ${valor(t, mx + 1 + i)}`).join('; '), '.'],
        ['Cuadra con ', B('n'), ' = ', B(n), '.'],
      ],
      _datos: { nivel: 2, cifras: t, N },
    };
  }

  function otraEtiqueta(rng, forzado) {
    void forzado;
    const n = rng.entero(5, 9), d1 = rng.entero(2, n - 1), d0 = rng.entero(1, d1 - 1), A = `${d1}${d0}`, Bt = `${d0}${d1}`;
    const N1 = d1 * n + d0, V2 = d0 * n + d1, inv = alReves(String(N1));
    return {
      enunciado: ['En un puesto, la bolsa con etiqueta ', ...nv(A, 'n'), ' tiene ', Q(`${N1} caramelos`), '.'],
      pregunta: ['¿Cuántos caramelos tiene la bolsa ', ...nv(Bt, 'n'), ' del mismo puesto?'],
      datos: [D.f2, 'Las dos etiquetas son del mismo puesto: la misma base'],
      correcta: V2,
      errores: [
        h('AT-DECIMAL', Number(Bt), `Bien que sea la misma idea. Pero ${Bt} de este puesto no se lee en base 10.`),
        h('AT-PIDE-BASE', n, `Bien hallar que la bolsita es de ${n}. Falta usar esa base para leer la otra etiqueta.`),
        inv !== String(N1) && inv[0] !== '0' ? h('AT-INVIERTE', Number(inv), `Bien ver que ${Bt} es ${A} al revés. Pero el valor no se invierte: ${inv} no es lo que vale.`) : null,
        h('AT-SIN-SUELTOS', d0 * n, `Bien hallar la base, ${n}, y que el ${d0} vaya por ${n}. Pero el ${d1} de la derecha también cuenta: sin él sale ${d0 * n}.`),
      ],
      solucion: [
        ['Con la primera etiqueta sale la base: ', `${d1} × `, B('n'), ` + ${d0} = `, Q(N1), ', así que ', `${d1} × `, B('n'), ` = ${N1 - d0} y `, B('n'), ' = ', B(n), '.'],
        ['Con esa base se lee la otra: ', ...nv(Bt, n), ` = ${d0} × ${n} + ${d1} = `, Q(V2), '.'],
      ],
      _datos: { nivel: 2, n, A, B: Bt },
    };
  }

  function acotar(rng, forzado) {
    const sub0 = forzado || rng.elegir(['suma', 'cuantos']);
    if (sub0 === 'suma') {
      const p = rng.entero(5, 9), q = rng.entero(3, p - 1), u = rng.entero(0, p - 1), w = rng.entero(1, q - 1);
      const S = a => (a * p + u) + (w * q + a), amax = q - 1;
      const a1 = `a${u}`, a2 = `${w}a`;
      return {
        enunciado: ['Los numerales ', ...nv(a1, p), ' y ', ...nv(a2, q), ' están bien escritos.'],
        pregunta: ['¿Cuál es el mayor valor que puede tener su suma, en base 10?'],
        datos: [D.cifras, D.primera, D.f2],
        correcta: S(amax),
        errores: [
          h('AT-UNO-SOLO', S(p - 1), `Bien: en base ${p}, a llega a ${p - 1}. Pero en base ${q} no puede pasar de ${q - 1}; con a = ${p - 1} sale ${S(p - 1)}.`),
          h('AT-MENOR', S(1), `Bien: con a = 1 los dos están bien escritos. Pero piden el mayor valor posible; con a = 1 sale ${S(1)}.`),
          h('AT-DECIMAL', (10 * amax + u) + (10 * w + amax), `Bien a = ${amax}. Pero cada numeral se pasa a base 10 con su propia base; leídos en base 10 suman ${(10 * amax + u) + (10 * w + amax)}.`),
        ],
        solucion: [
          ['En base ', B(p), ', a < ', B(p), '; en base ', B(q), ', a < ', B(q), '. Además, a no es 0 (es la primera cifra de ', ...nv(a1, p), ').'],
          ['Las dos cotas a la vez: a llega a lo más a ', C(amax), '.'],
          [...nv(`${amax}${u}`, p), ' + ', ...nv(`${w}${amax}`, q), ` = ${amax * p + u} + ${w * q + amax} = `, Q(S(amax)), '.'],
        ],
        _datos: { sub: sub0, nivel: 3, p, q, u, w },
      };
    }
    // cuantos: cifras (a − s) y (k·a) en base n; cuántos valores puede tomar a.
    const n = rng.entero(5, 9), s = rng.entero(0, 2), m = rng.elegir([2, 3]);
    const tope = Math.floor((n - 1) / m), Cn = tope - s;
    if (Cn < 2) return null;
    const pri = s ? `(a−${s})` : 'a', seg = `(${m}a)`, t = pri + seg;
    const txt = numT(t, n);
    return {
      enunciado: ['El numeral ', ...nv(t, n), ' está bien escrito. Sus cifras son ', C(s ? `a − ${s}` : 'a'), ' y ', C(`${m}a`), '.'],
      pregunta: ['¿Cuántos valores puede tomar a?'],
      datos: [D.cifras, D.primera, D.hasta],
      correcta: Cn, texto: x => (x === 1 ? '1 valor' : `${x} valores`),
      errores: [
        h('AT-CERO', Cn + 1, `Bien la cota de la derecha. Pero con a = ${s} la primera cifra de ${txt} sería 0: así salen ${Cn + 1} valores.`, T),
        h('AT-CIFRA-B', Math.floor(n / m) - s, `Bien la cota de la primera cifra. Pero ${m}a tiene que ser menor que ${n}, no llegar a ${n}: así salen ${Math.floor(n / m) - s} valores.`, T),
        h('AT-UNO-SOLO', n - 1 - s, `Bien la cota de la primera cifra. Pero la cifra que no puede llegar a ${n} es ${m}a, no a: con a < ${n} salen ${n - 1 - s} valores.`),
        h('AT-CONTEO', Cn - 1, `Bien los dos extremos, ${s + 1} y ${tope}. Pero de ${s + 1} hasta ${tope} hay ${tope} − ${s + 1} + 1 valores, no ${Cn - 1}.`, T),
      ],
      solucion: [
        s ? ['La primera cifra no es 0: ', C(`a − ${s}`), ` ≥ 1, así que a ≥ ${s + 1}.`] : ['La primera cifra no es 0: ', C('a'), ' ≥ 1.'],
        ['Cada cifra es menor que la base: ', C(`${m}a`), ' < ', B(n), `, así que a ≤ ${tope}.`],
        [`a va de ${s + 1} a ${tope}: ${tope} − ${s + 1} + 1 = ${Cn}${Cn === 1 ? ' valor.' : ' valores.'}`],
      ],
      _datos: { sub: 'cuantos', nivel: 3, n, s, m },
    };
  }

  function mayorSuma(rng) {
    const n = rng.entero(4, 9), k = rng.elegir([2, 3, 3]), S = k * (n - 1), V = n ** k - 1, t = String(n - 1).repeat(k);
    const palabra = k === 2 ? 'dos' : 'tres';
    return {
      enunciado: [`El mayor numeral de ${palabra} cifras de cierta base tiene cifras que suman `, C(S), '.'],
      pregunta: ['¿Cuánto vale ese numeral en base 10?'],
      datos: [D.cifras, D.fk(k)],
      correcta: V,
      errores: [
        h('AT-DECIMAL', Number(t), `Bien: el numeral es ${numT(t, n)}. Pero ${f0(Number(t))} es como se lee en base 10; falta pasarlo.`),
        h('AT-PIDE-BASE', n, `Bien hallar la base, ${n}. Pero piden el valor del numeral, no la base.`),
        h('AT-CIFRA-B', (n - 1) ** k - 1, `Bien que cada cifra sea ${n - 1}. Pero esa es la cifra mayor: la base es una más, ${n}, no ${n - 1}; con ${n - 1} sale ${f0((n - 1) ** k - 1)}.`, T),
        h('AT-SIGUIENTE', n ** k, `Bien la base, ${n}. Pero ${f0(n ** k)} es ${numT('1' + '0'.repeat(k), n)}, que ya tiene ${k + 1} cifras; el numeral es uno menos.`),
      ],
      solucion: [
        [`El mayor de ${palabra} cifras repite la cifra mayor, `, B('n'), ' − 1: ', `${k} × (`, B('n'), ` − 1) = ${S}, así que `, B('n'), ' = ', B(n), '.'],
        ['El numeral es ', ...nv(t, n), ' = ', Array.from({ length: k }, (_, i) => `${n - 1} × ${n ** (k - 1 - i)}`).join(' + '), ' = ', Q(V), '.'],
      ],
      _datos: { nivel: 3, k, S },
    };
  }

  // ======================= Idea 5: contar cifras por bloques =======================

  const cuentaBloques = bl => [bl.map(b => `${f0(b.cuantos)} × ${b.k}`).join(' + '), ' = ', bl.map(b => f0(b.cifras)).join(' + ')];

  function cifras(rng) {
    const N = rng.elegir([rng.entero(40, 99), rng.entero(110, 999), rng.entero(110, 999)]), bl = bloques(N, 10), t = totalCif(bl), kmax = bl.length;
    return {
      enunciado: ['Una rifa tiene boletos numerados del 1 al ', Q(N), '.'],
      pregunta: ['¿Cuántas cifras imprime la imprenta en total?'],
      datos: [D.hasta, D.bloques10],
      correcta: t,
      errores: [
        h('AT-BLOQUE', kmax * N, `Bien: del ${10 ** (kmax - 1)} al ${N} cada boleto lleva ${kmax} cifras. Pero los de antes llevan menos: ${kmax} × ${N} = ${f0(kmax * N)}.`, T),
        h('AT-CONTEO', t - kmax, `Bien separar los bloques. Pero del ${10 ** (kmax - 1)} al ${N} hay ${N - 10 ** (kmax - 1) + 1} boletos, no ${N - 10 ** (kmax - 1)}: así salen ${f0(t - kmax)}.`, T),
        h('AT-BLOQUE', t - 9, `Bien los bloques de más cifras. Pero falta el del 1 al 9: sin él salen ${f0(t - 9)}.`, T),
        kmax === 3 ? h('AT-CONTEO', t - 2, `Bien los bloques. Pero del 10 al 99 hay 90 boletos, no 89: así salen ${f0(t - 2)}.`, T) : null,
      ],
      solucion: [
        ['Bloque por bloque: ', bl.map(b => `del ${b.a} al ${b.z}, ${f0(b.cuantos)} boletos de ${b.k} ${b.k === 1 ? 'cifra' : 'cifras'}`).join('; '), '.'],
        [...cuentaBloques(bl), ' = ', C(f0(t)), ' cifras.'],
      ],
      _datos: { nivel: 1, N, n: 10 },
    };
  }

  function hasta(rng) {
    const N = rng.entero(110, 999), Cc = totalCif(bloques(N, 10));
    return {
      enunciado: ['La imprenta imprimió ', C(`${f0(Cc)} cifras`), ' en los boletos de una rifa, numerados desde el 1.'],
      pregunta: ['¿Hasta qué boleto llegó?'],
      datos: [D.hasta, D.bloques10],
      correcta: N, texto: x => `el ${f0(x)}`,
      errores: [
        h('AT-CONTEO', N + 1, `Bien: hay ${N - 99} boletos de tres cifras. Pero empiezan en el 100: el último es el 99 + ${N - 99}, no el ${f0(N + 1)}.`, T),
        h('AT-BLOQUE', Cc / 3, `Bien dividir entre 3 para los de tres cifras. Pero los del 1 al 99 gastan menos: ${f0(Cc)} ÷ 3 = ${f0(Cc / 3)}.`, T),
        h('AT-SIN-DOS', 9 + (Cc - 9) / 3, `Bien empezar por los 9 de una cifra. Pero del 10 al 99 gastan dos cifras, no tres: así sale el ${f0(9 + (Cc - 9) / 3)}.`),
      ],
      solucion: [
        ['Hasta el 99 se gastan 9 × 1 + 90 × 2 = 189 cifras.'],
        [`Las otras ${f0(Cc)} − 189 = ${f0(Cc - 189)} cifras son de boletos de tres: ${f0(Cc - 189)} ÷ 3 = ${N - 99} boletos.`],
        [`Del 100 en adelante, ${N - 99} boletos: el último es 99 + ${N - 99} = `, Q(N), '.'],
      ],
      _datos: { nivel: 2, cifras: Cc },
    };
  }

  function cuantosK(rng) {
    const n = rng.entero(3, 9), k = rng.entero(2, n <= 5 ? 4 : 3), a = n ** (k - 1), z = n ** k - 1, V = z - a + 1;
    return {
      enunciado: ['En base ', B(n), ' se escriben todos los numerales de ', C(k), ' cifras.'],
      pregunta: ['¿Cuántos son?'],
      datos: [D.hasta, `${n}${sup(k - 1)} = ${f0(a)}; ${n}${sup(k)} = ${f0(z + 1)}`, D.primera],
      correcta: V,
      errores: [
        h('AT-CERO', z + 1, `Bien llegar hasta ${f0(z)}. Pero los que empiezan en 0 tienen menos cifras: contándolos salen ${f0(z + 1)}.`, T),
        h('AT-CONTEO', z - a, `Bien los extremos, ${f0(a)} y ${f0(z)}. Pero del primero al último hay u − p + 1, no ${f0(z - a)}.`, T),
        h('AT-DECIMAL', 9 * 10 ** (k - 1), `Bien contar los de ${k} cifras. Pero ${f0(9 * 10 ** (k - 1))} son los de base 10; aquí las cifras van de 0 a ${n - 1}.`),
        h('AT-SIN-CERO', (n - 1) ** k, `Bien que la primera cifra no sea 0. Pero en los otros lugares el 0 sí va: sin él salen ${f0((n - 1) ** k)}.`),
      ],
      solucion: [
        ['El menor es 1 seguido de ceros; el mayor repite la cifra ', C(n - 1), '.'],
        ['El menor: ', ...nv('1' + '0'.repeat(k - 1), n), ` = ${f0(a)}.`],
        ['El mayor: ', ...nv(String(n - 1).repeat(k), n), ` = ${f0(z + 1)} − 1 = ${f0(z)}.`],
        ['De ', f0(a), ' a ', f0(z), ': ', `${f0(z)} − ${f0(a)} + 1 = `, Q(V), ' numerales.'],
      ],
      _datos: { nivel: 2, n, k },
    };
  }

  function cifrasBase(rng) {
    const n = rng.entero(2, 6), N = rng.entero(n * n, Math.min(n ** 4 - 1, n === 2 ? 60 : 200));
    const bl = bloques(N, n), t = totalCif(bl), kmax = bl.length;
    const pot = Array.from({ length: kmax }, (_, i) => `${n}${sup(i + 1)} = ${f0(n ** (i + 1))}`).join('; ');
    return {
      enunciado: ['Se escriben en base ', B(n), ' todos los números del 1 al ', Q(N), '.'],
      pregunta: ['¿Cuántas cifras se usan en total?'],
      datos: [D.hasta, 'En base n, los de k cifras van de nᵏ⁻¹ a nᵏ − 1', pot],
      correcta: t,
      errores: [
        h('AT-DECIMAL', totalCif(bloques(N, 10)), `Bien contar por bloques. Pero ${f0(totalCif(bloques(N, 10)))} son las cifras en base 10; en base ${n} los bloques son otros.`),
        h('AT-CONTEO', t - kmax, `Bien los bloques. Pero en cada uno hay u − p + 1 números, no u − p: así salen ${f0(t - kmax)}.`, T),
        h('AT-BLOQUE', kmax * N, `Bien: los más grandes llevan ${kmax} cifras. Pero los de antes llevan menos: ${kmax} × ${N} = ${f0(kmax * N)}.`, T),
      ],
      solucion: [
        ['Bloques en base ', B(n), ': ', bl.map(b => `del ${f0(b.a)} al ${f0(b.z)}, ${f0(b.cuantos)} de ${b.k} ${b.k === 1 ? 'cifra' : 'cifras'}`).join('; '), '.'],
        [...cuentaBloques(bl), ' = ', C(f0(t)), ' cifras.'],
      ],
      _datos: { nivel: 3, N, n },
    };
  }

  function basesTres(rng) {
    const N = rng.entero(20, 400), bases = [];
    for (let n = 2; n * n <= N; n++) if (N < n ** 3) bases.push(n);
    const Cn = bases.length;
    if (Cn < 2) return null;
    const cuenta = ok => { let c = 0; for (let n = 2; n <= N; n++) if (ok(n)) c++; return c; };
    const exp = cuenta(n => n ** 3 <= N && N < n ** 4);
    const b0 = bases[0], b1 = bases[Cn - 1];
    return {
      enunciado: ['El número ', Q(N), ' se escribe en distintas bases.'],
      pregunta: ['¿En cuántas bases se escribe con tres cifras?'],
      datos: ['En base n, los de 3 cifras van de n² a n³ − 1', D.baseEntera, D.hasta],
      correcta: Cn, texto: x => (x === 1 ? '1 base' : `${x} bases`),
      errores: [
        h('AT-UNA-COTA', cuenta(n => n * n <= N), `Bien que n² no pase de ${N}. Pero ${N} también tiene que ser menor que n³: con una sola cota salen ${cuenta(n => n * n <= N)}.`),
        h('AT-EXPONENTE', exp, `Bien usar potencias. Pero tres cifras van de n² a n³ − 1, no de n³ a n⁴ − 1: así salen ${exp}.`),
        h('AT-MENOR', b0, `Bien: ${b0} es la menor base que sirve. Pero piden cuántas bases sirven, no la menor.`),
        h('AT-CONTEO', Cn - 1, `Bien los extremos, ${b0} y ${b1}. Pero de ${b0} a ${b1} hay ${b1} − ${b0} + 1 bases, no ${Cn - 1}.`, T),
      ],
      solucion: [
        ['Con tres cifras en base ', B('n'), ': ', B('n'), `² ≤ ${N} < `, B('n'), '³.'],
        [`${b0 - 1}³ = ${(b0 - 1) ** 3} no pasa a ${N}, y ${b0}³ = ${b0 ** 3} sí: n ≥ ${b0}. Además ${b1}² = ${b1 * b1} ≤ ${N} < ${(b1 + 1) ** 2} = ${b1 + 1}²: n ≤ ${b1}.`],
        [`Sirven las bases de ${b0} a ${b1}: ${b1} − ${b0} + 1 = ${Cn}${Cn === 1 ? ' base.' : ' bases.'}`],
      ],
      _datos: { nivel: 3, N },
    };
  }

  const CONSTRUIR = {
    etiqueta, 'mal-escrito': malEscrito, 'menor-base': menorBase, sucesor,
    valor: valorT, ordenar, 'mayor-k': mayorK, cruzados,
    'de-10': de10, 'entre-bases': entreBases, 'suma-cifras': sumaCifras, paquetes,
    lineal, cuadratica, 'otra-etiqueta': otraEtiqueta, acotar, 'mayor-suma': mayorSuma,
    cifras, hasta, 'cuantos-k': cuantosK, 'cifras-base': cifrasBase, 'bases-tres': basesTres,
  };

  return { id: ID, titulo: 'El puesto de las bases', generar, TIPOS_POR_IDEA, NIVEL };
});
