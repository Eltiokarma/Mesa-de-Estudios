/*
 * Generador «El cuaderno de las cuentas»: práctica de «Las cuatro operaciones» (aritmetica.cuatro-operaciones;
 * contenido/teoria/aritmetica/cuatro-operaciones.js), con tipos separados por idea. Formato "predicciones"
 * (docs/arquitectura.md). Funciona en el navegador (window.Generadores['operaciones-cifras']) y en Node (require). No usa
 * ningún motor: las cuentas son sumas, restas y productos por columnas que se hacen aquí, cifra por cifra.
 *
 * Propuesta aprobada: docs/etapa4/propuesta-aritmetica.md §5 a §8 (pregunta 9) y docs/etapa4/decisiones.md (Las cuatro
 * operaciones). Hilo, como en la teoría: el puesto de caramelos de doña Juana (10 sueltos llenan una bolsita, 10 bolsitas
 * una caja, 10 cajas un cajón; en otras bases, de n en n), su cuaderno de cuentas (manchas de chicha morada) y su
 * calculadora. Valores de problema, sin fuente: pedidos de hasta 4 cifras, bolsitas de 4 a 15, sobrinos de 4 a 12.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 básico, 2 intermedio, 3 examen). generar(semilla, { idea }) da solo los de
 * esa idea; sin idea, las siete con el mismo peso. La unidad es una sola: { unidad } no cambia nada.
 *   otras-bases        suma (1) dos pedidos con llevadas · varios (2) tres o cuatro sumandos, llevada de 2 o más ·
 *   (la llevada)       suma-base (2) dos pedidos en base n · cuanto-lleva (2) cuánto pasa a la columna de las cajas ·
 *                      base-cuadra (3) la base en que a̅b̅₍ₙ₎ + c̅d̅₍ₙ₎ = e̅f̅₍ₙ₎
 *   prestamo           resta (1) con préstamos · ceros (2) un minuendo con ceros (préstamo en cadena) · resta-base (2)
 *                      en base n, cruzando un 0 · aperturas (2) cuántos envases se abren · suma-tres (3) minuendo +
 *                      sustraendo + diferencia
 *   complemento        ca (1) CA de un número · ceros-finales (2) CA de un número que termina en ceros · ca-base (2)
 *                      CA en base n · ca-oculto (3, San Marcos 2026-I) CA con cifras ocultas
 *   cifras-ocultas     mancha-suma (1) una cifra manchada en una suma · mancha-dos (2) dos manchas en una suma ·
 *                      mancha-resta (3, San Marcos 2022 y 2024-I) la cifra de arriba o la de abajo en una resta
 *                      manchada con préstamos ·
 *                      reverso (3, San Marcos 2019-II) el mayor a̅b̅c̅ con a̅b̅c̅ − c̅b̅a̅ dado
 *   multiplicar-partes por-cifra (1) un pedido por una cifra · cuanto-sube (1) cuánto sube un producto ·
 *                      factor-falta (2) el factor que falta · por-cifra-base (2) por una cifra en base n ·
 *                      los-dos (3) cambian los dos factores
 *   defecto-exceso     exceso (1) el resto por exceso · dividendo (2) D desde q y rₑ · restos (2) los dos restos y su
 *                      relación · dos-repartos (3, San Marcos 2023-II) · uno-mas (3, San Marcos 2024-II)
 *   cifras-producto    producto (1) cifras de A × B · cociente (2) cifras del cociente entero · cifras-factor (2)
 *                      cifras de un factor · potencias (3) cifras de A² × B³
 *
 * Notación (decisiones, Las cuatro operaciones): × para multiplicar, nunca «·»; n es la base y sin base escrita es 10;
 * 34₍₅₎ con la base de subíndice entre paréntesis; a̅b̅c̅ con raya (U+0305 sobre cada carácter); ☐ es una mancha; D, d,
 * q, r y rₑ en la división (q + 1 es el cociente por exceso). Las alternativas son texto plano.
 * Colores: un color fijo por magnitud, el de la teoría (cabecera de la unidad; docs/molde-unidad.md §5b): el envase en
 * turquesa (e: la base, la bolsita, el divisor, las metas 10ᵏ), lo que se muda en naranja (m: la llevada, el préstamo,
 * el resto por defecto r), lo que se busca en violeta (b: el resultado de la cuenta, también cuando se da; el
 * complemento, lo que sube un producto, el resto por exceso rₑ y la cantidad de cifras). Los números que se operan, el
 * cociente q, las bolsas del pedido y las manchas van en tinta; lo que se pide va en tinta en la pregunta. Sin verde ni
 * carmín. Ninguna letra de alternativa lleva color.
 * Datos (docs/plan-calidad.md §3, punto 13): la regla de la columna, la de abrir un envase, CA(N) = 10ᵏ − N, la
 * descomposición a̅b̅c̅, la distributiva, D = d × q + r y D = d × (q + 1) − rₑ, el rango de un número de k cifras;
 * nunca el paso hecho, el atajo («de 9 todas y de 10 la última», a̅b̅c̅ − c̅b̅a̅ = 99 × (a − c), r + rₑ = d) ni la
 * respuesta.
 * Errores: los códigos AT-* de la teoría de la unidad (hipótesis de aula, sin medir; tabla en
 * docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md, «Las cuatro operaciones (18 nov)»). Las trampas 18 y 29
 * de docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md respaldan los del resto por exceso, el préstamo
 * olvidado y el complemento. Nuevo aquí (hipótesis): AT-CA-CEROS (saca el complemento sin los ceros finales y no los
 * repone).
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
  const ID = 'operaciones-cifras';
  const UNIDAD = 'aritmetica.cuatro-operaciones';
  const TRAMPAS = 'docs/clasificacion/trampas-admision-unmsm/aritmetica-algebra.md';
  const v = P.v;
  const f0 = x => P.formatear(x, 0);

  // ---- Escritura ----
  const SUBD = '₀₁₂₃₄₅₆₇₈₉';
  const sub = x => [...String(x)].map(c => (c >= '0' && c <= '9' ? SUBD[c] : c === 'n' ? 'ₙ' : c)).join('');
  const RAYA = '̅';
  const raya = s => [...String(s)].map(c => c + RAYA).join('');
  const numT = (cifras, base) => (base === 10 ? cifras : `${cifras}₍${sub(base)}₎`);
  // Los tres colores de la unidad.
  const Ev = x => v('e', String(x));                          // envase, turquesa
  const Mv = x => v('m', String(x));                          // lo que se muda, naranja
  const Bv = x => v('b', typeof x === 'number' ? f0(x) : x);  // lo que se busca, violeta
  const VARS = { e: { nombre: 'el envase: la base, la bolsita, el divisor, la meta 10ᵏ', color: 'i' },
    m: { nombre: 'lo que se muda o queda suelto: la llevada, el préstamo, lo que sobra', color: 'o' },
    b: { nombre: 'lo que se busca: el resultado, el complemento, lo que falta, las cifras', color: 'f' } };
  // Un numeral que se opera (cifras en tinta, base en turquesa) y uno del resultado (cifras en violeta).
  const baseV = n => Ev(`₍${sub(n)}₎`);
  const opN = (c, n) => (n === 10 ? [c] : [c, baseV(n)]);
  const resN = (c, n) => (n === 10 ? [Bv(c)] : [Bv(c), baseV(n)]);
  const COL = ['Sueltos', 'Bolsitas', 'Cajas', 'Cajones', 'Quinta columna'];
  const pl = (k, uno, varios) => (k === 1 ? uno : varios);
  const veces = x => (x === 1 ? '1 vez' : `${x} veces`);
  const sobran = k => (k === 1 ? ' sobra ' : ' sobran '), faltan = k => (k === 1 ? ' falta ' : ' faltan ');

  // ---- Cuentas por columnas (cifras desde las unidades) ----
  const enBase = (N, n) => { if (N === 0) return '0'; let s = ''; while (N > 0) { s = String(N % n) + s; N = Math.floor(N / n); } return s; };
  const valor = (s, n) => [...s].reduce((a, c) => a * n + Number(c), 0);
  const aDig = s => [...String(s)].reverse().map(Number);
  const deDig = d => { const s = d.slice().reverse().join('').replace(/^0+(?=\d)/, ''); return s; };
  const cifrasDe = (x, n) => aDig(enBase(x, n));

  /*
   * Suma por columnas. modo: 'ok'; 'olvida' (no suma la llevada que llega; la última columna se anota entera);
   * 'final' (no anota la última llevada); 'decimal' (lleva al llegar a 10, aunque la base sea otra); 'uno' (lleva 1
   * donde van 2 o más); 'doble' (suma dos veces la llevada que llega). factor: multiplica cada cifra de un solo
   * sumando (producto por una cifra). Devuelve { texto, cols } o undefined si el modo no da un numeral.
   */
  function columnas(nums, n, modo = 'ok', factor = 1) {
    const ds = nums.map(aDig), K = Math.max(...ds.map(d => d.length)), lleva = modo === 'decimal' ? 10 : n;
    const out = [], cols = [];
    let c = 0;
    for (let i = 0; i < K; i++) {
      const entran = ds.map(d => d[i] || 0), col = entran.reduce((s, x) => s + x * factor, 0);
      const cin = modo === 'olvida' ? 0 : modo === 'doble' ? 2 * c : c;
      const s = col + cin;
      const sale = modo === 'uno' ? (s >= lleva ? 1 : 0) : Math.floor(s / lleva);
      const cifra = s % lleva;
      cols.push({ entran: nums.length === 1 ? [entran[0]] : entran, cin: c, s, cout: sale, cifra });
      out.push(cifra);
      c = sale;
    }
    if (c > 0 && modo !== 'final') out.push(...cifrasDe(c, lleva));
    if (out.some(x => x > 9)) return undefined;
    return { texto: deDig(out), cols, final: c };
  }
  const sumaTexto = (nums, n, modo) => { const r = columnas(nums, n, modo); return r && r.texto; };
  const porCifraTexto = (N, m, n, modo) => { const r = columnas([N], n, modo, m); return r && r.texto; };

  /*
   * Resta por columnas. modo: 'ok'; 'menor' (en cada columna, el menor del mayor); 'sin' (presta y no le quita 1 a la
   * columna que prestó); 'doble' (le quita 2); 'cero10' (un 0 que presta queda en n, no en n − 1); 'decimal' (abrir un
   * envase da 10, aunque la base sea otra). Devuelve { texto, cols, abiertos } o undefined.
   */
  function restar(Ms, Ss, n, modo = 'ok') {
    const a = aDig(Ms), b = aDig(Ss), K = a.length, out = [], cols = [];
    if (b.length > K) return undefined;
    let bin = 0, abiertos = 0;
    for (let i = 0; i < K; i++) {
      const bi = b[i] || 0;
      let x, bout = 0, d;
      if (modo === 'menor') { d = Math.abs(a[i] - bi); }
      else {
        const abre = modo === 'decimal' ? 10 : n;
        if (modo === 'cero10' && a[i] === 0 && bin) { x = n; bout = 1; }
        else {
          x = a[i] - (modo === 'sin' ? 0 : modo === 'doble' ? 2 * bin : bin);
          if (x < bi) { x += abre; bout = 1; }
        }
        d = x - bi;
      }
      if (d < 0 || d > 9 || (modo !== 'decimal' && d >= n)) return undefined;
      cols.push({ a: a[i], b: bi, bin, bout, cifra: d });
      out.push(d); abiertos += bout; bin = bout;
    }
    if (bin) return undefined;
    return { texto: deDig(out), cols, abiertos };
  }
  const restaTexto = (Ms, Ss, n, modo) => { const r = restar(Ms, Ss, n, modo); return r && r.texto; };

  // ---- Líneas de solución (lo que pasa en cada columna) ----
  function lineasSuma(nums, n, factor = 1) {
    const R = columnas(nums, n, 'ok', factor);
    const ls = R.cols.map((c, i) => {
      const l = [`${COL[i]}: ${factor === 1 ? c.entran.join(' + ') : `${c.entran[0]} × ${factor}`}`];
      if (c.cin) l.push(' + ', Mv(c.cin));
      l.push(` = ${c.s}`);
      if (c.cout) l.push(' = ', Mv(c.cout), ' × ', Ev(n), ' + ', Bv(c.cifra), '.');
      else l.push(': se anota ', Bv(c.cifra), '.');
      return l;
    });
    if (R.final) ls.push(['La última llevada, ', Mv(R.final), ', abre otra columna.']);
    return ls;
  }
  function lineasResta(Ms, Ss, n) {
    const R = restar(Ms, Ss, n);
    return R.cols.map((c, i) => {
      const l = [`${COL[i]}: ${c.a}`];
      if (c.bout) l.push(' + ', Ev(n));
      if (c.bin) l.push(' − ', Mv(1));
      l.push(` − ${c.b} = `, Bv(c.cifra));
      l.push(c.bout ? `; se abre 1 de la columna de la izquierda.` : '.');
      return l;
    });
  }

  // ---- Errores ----
  const h = (id, valor, explicacion, fuente = null) => ({ id, valor, explicacion, respaldo: 'hipotesis', fuente });
  // Error de texto: el numeral (o la frase) que ve el alumno.
  const ht = (id, texto, explicacion, fuente = null) => (texto === undefined ? null : { id, clave: texto, texto, explicacion, respaldo: 'hipotesis', fuente });
  const htN = (id, cifras, base, explicacion, fuente = null) => (cifras === undefined ? null : ht(id, numT(cifras, base), explicacion, fuente));
  const T = TRAMPAS;
  const NOSE = 'No se puede saber';

  // ---- Datos que se repiten (herramientas, no el paso hecho) ----
  const D = {
    envases: '1 bolsita = 10 caramelos; 1 caja = 10 bolsitas; 1 cajón = 10 cajas',
    columna: n => `Suma de una columna = llevada × ${n} + cifra que se anota`,
    producto: n => `Cifra × factor + llevada que llega = llevada nueva × ${n} + cifra que se anota`,
    base: n => `En base ${n}, ${n} de una columna forman 1 de la columna siguiente`,
    cifras: 'En base n, las cifras van de 0 a n − 1',
    abrir: n => `Abrir 1 de una columna da ${n} de la columna de su derecha`,
    resta: n => `Cifra = arriba + p × ${n} − abajo, con p = 1 si se abrió un envase`,
    abrirEnvase: 'Abrir 1 envase da 10 del envase más chico',
    vacio: 'Un envase vacío no se puede abrir',
    prueba: 'Minuendo − sustraendo = diferencia',
    ca: 'CA(N) = 10ᵏ − N, con k las cifras de N',
    caBase: 'En base n: CA(N) = nᵏ − N, con k las cifras de N',
    letras: 'Cada letra es una cifra de 0 a 9; la primera cifra de un numeral no es 0',
    mancha: 'Bajo cada mancha ☐ hay una cifra de 0 a 9',
    bien: 'La cuenta del cuaderno está bien hecha',
    abc: `${raya('abc')} = 100 × a + 10 × b + c`,
    reverso: `${raya('cba')} es el reverso de ${raya('abc')}: las mismas cifras al revés`,
    acNo0: 'a, b y c son cifras; a y c no son 0',
    distrib: '(F + s) × G = F × G + s × G',
    fgs: 'F: caramelos de cada bolsa; G: bolsas; s: caramelos que se agregan a cada bolsa',
    pedido: 'Caramelos del pedido = caramelos de cada bolsa × bolsas',
    div: 'D = d × q + r, con 0 ≤ r < d',
    exceso: 'D = d × (q + 1) − rₑ',
    letrasDiv: 'D: los caramelos; d: lo que lleva una bolsita; q: bolsitas llenas; r: sobran; rₑ: faltan',
    reparto: 'Si al dar q a cada uno de d sobran r: D = d × q + r',
    repartoFalta: 'Si al dar q a cada uno de d faltan f: D = d × q − f',
    rango: 'Un número de k cifras va de 10ᵏ⁻¹ a 10ᵏ − 1',
    potProd: '10ᵃ × 10ᵇ = 10ᵃ⁺ᵇ',
    potDiv: '10ᵃ ÷ 10ᵇ = 10ᵃ⁻ᵇ',
    cuadradoCubo: 'A² = A × A; B³ = B × B × B',
  };

  // ---- Tipos por idea (los id de las ideas de la teoría) ----
  const TIPOS_POR_IDEA = {
    'otras-bases': ['suma', 'varios', 'suma-base', 'cuanto-lleva', 'base-cuadra'],
    prestamo: ['resta', 'ceros', 'resta-base', 'aperturas', 'suma-tres'],
    complemento: ['ca', 'ceros-finales', 'ca-base', 'ca-oculto'],
    'cifras-ocultas': ['mancha-suma', 'mancha-dos', 'mancha-resta', 'reverso'],
    'multiplicar-partes': ['por-cifra', 'cuanto-sube', 'factor-falta', 'por-cifra-base', 'los-dos'],
    'defecto-exceso': ['exceso', 'dividendo', 'restos', 'dos-repartos', 'uno-mas'],
    'cifras-producto': ['producto', 'cociente', 'cifras-factor', 'potencias'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  // Una sola unidad: los tipos de la unidad son todos (velocidad-relativa es el modelo si algún día sirve a otra).
  const TIPOS_POR_UNIDAD = { [UNIDAD]: IDEAS.flatMap(i => TIPOS_POR_IDEA[i]) };
  const NIVEL = { suma: 1, varios: 2, 'suma-base': 2, 'cuanto-lleva': 2, 'base-cuadra': 3,
    resta: 1, ceros: 2, 'resta-base': 2, aperturas: 2, 'suma-tres': 3,
    ca: 1, 'ceros-finales': 2, 'ca-base': 2, 'ca-oculto': 3,
    'mancha-suma': 1, 'mancha-dos': 2, 'mancha-resta': 3, reverso: 3,
    'por-cifra': 1, 'cuanto-sube': 1, 'factor-falta': 2, 'por-cifra-base': 2, 'los-dos': 3,
    exceso: 1, dividendo: 2, restos: 2, 'dos-repartos': 3, 'uno-mas': 3,
    producto: 1, cociente: 2, 'cifras-factor': 2, potencias: 3 };

  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8» y rotula 3 básicos, 3 intermedios y 2
  // avanzados): una pregunta de cada idea, y las dos de examen son de San Marcos (2024-I y 2023-II).
  const PAPEL = { 'papel-1': 'suma', 'papel-2': 'ca', 'papel-3': 'cuanto-sube', 'papel-4': 'ceros', 'papel-5': 'cociente',
    'papel-6': 'dividendo', 'papel-7': 'mancha-resta', 'papel-8': 'dos-repartos' };

  function generar(semilla, opciones) {
    const o = typeof opciones === 'string' ? { unidad: opciones } : opciones || {};
    const rng = Azar.crear(ID + '|' + semilla);
    const forzado = !o.idea && PAPEL[String(semilla)];
    let tipo;
    if (forzado) tipo = forzado;
    else {
      const idea = TIPOS_POR_IDEA[o.idea] ? o.idea : rng.elegir(IDEAS);
      tipo = rng.elegir(TIPOS_POR_IDEA[idea]);
    }
    for (let intento = 0; intento < 500; intento++) {
      const pr = CONSTRUIR[tipo](rng);
      const p = pr && cerrar(semilla, tipo, pr, rng);
      if (p) return p;
    }
    throw new Error(`No se pudo generar un problema de ${tipo} con 4 alternativas distintas`);
  }

  // Arma las alternativas y el problema. Variables: solo las que se usan.
  function cerrar(semilla, tipo, o, rng) {
    let alternativas, respuesta;
    if (o.correctaTexto !== undefined) {
      const errores = o.errores.filter(e => e && e.clave !== o.correctaTexto);
      alternativas = P.armarTexto({ correcta: { clave: o.correctaTexto, texto: o.correctaTexto }, errores, rng });
      respuesta = { valor: o.correctaTexto, texto: o.correctaTexto, unidad: '' };
    } else {
      const errores = o.errores.filter(e => e && Number.isInteger(e.valor) && e.valor > 0 && e.valor !== o.correcta && P.enEscala(e.valor, o.correcta, e.id));
      alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.texto || f0 });
      respuesta = { valor: o.correcta, unidad: '' };
    }
    if (alternativas.length < 4) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object') usadas.add(x.v);
    const variables = Object.fromEntries([...usadas].map(k => [k, VARS[k]]));
    return {
      id: `${ID}#${semilla}`, unidadCatalogo: UNIDAD, variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos,
      alternativas, solucion: o.solucion, respuesta,
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos),
    };
  }

  // Un número de k cifras al azar, sin ceros si sinCeros.
  const numero = (rng, k, sinCeros = false) => { let s = String(rng.entero(1, 9)); while (s.length < k) s += rng.entero(sinCeros ? 1 : 0, 9); return s; };
  const numeroBase = (rng, k, n) => { let s = String(rng.entero(1, n - 1)); while (s.length < k) s += rng.entero(0, n - 1); return s; };

  // ======================= Idea 1: la llevada llena una bolsita =======================

  function suma(rng) {
    const A = numero(rng, 3), B = numero(rng, 3), R = columnas([A, B], 10);
    const lleva = R.cols.filter(c => c.cout).length;
    if (!R.final || lleva < 2) return null;
    const ok = Number(R.texto), olv = Number(sumaTexto([A, B], 10, 'olvida')), fin = Number(sumaTexto([A, B], 10, 'final')), dob = sumaTexto([A, B], 10, 'doble');
    return {
      enunciado: ['Doña Juana junta un pedido de ', f0(+A), ' caramelos y otro de ', f0(+B), '.'],
      pregunta: ['¿Cuántos caramelos tiene ahora?'],
      datos: [D.envases, D.columna(10)],
      correcta: ok,
      errores: [
        h('AT-LLEVA-OLVIDA', olv, `Bien sumar columna por columna. Pero la bolsita llena que sube no se sumó en la columna siguiente: así salen ${f0(olv)}.`, T),
        h('AT-LLEVA-FINAL', fin, `Bien las columnas. Pero la última llevada también se anota: sin ella salen ${f0(fin)}.`),
        dob && h('AT-LLEVA-DOBLE', Number(dob), `Bien sumar la llevada. Pero se suma una sola vez: contándola dos veces salen ${f0(Number(dob))}.`),
      ],
      solucion: [...lineasSuma([A, B], 10), ['Tiene ', Bv(ok), ' caramelos.']],
      _datos: { sumandos: [A, B], n: 10 },
    };
  }

  function varios(rng) {
    const k = rng.elegir([3, 3, 4]), nums = Array.from({ length: k }, () => numero(rng, rng.elegir([2, 3])));
    const R = columnas(nums, 10);
    if (R.cols[0].cout < 2) return null;
    const ok = Number(R.texto);
    const uno = sumaTexto(nums, 10, 'uno'), olv = sumaTexto(nums, 10, 'olvida'), fin = R.final ? sumaTexto(nums, 10, 'final') : undefined, dob = sumaTexto(nums, 10, 'doble');
    return {
      enunciado: [`Doña Juana suma ${k === 3 ? 'tres' : 'cuatro'} pedidos: `, nums.slice(0, -1).map(x => f0(+x)).join(', '), ' y ', f0(+nums[k - 1]), ' caramelos.'],
      pregunta: ['¿Cuántos caramelos son en total?'],
      datos: [D.envases, D.columna(10)],
      correcta: ok,
      errores: [
        uno && h('AT-LLEVA-UNO', Number(uno), `Bien que los sueltos llenen bolsitas. Pero con ${R.cols[0].s} sueltos se llenan ${R.cols[0].cout}, no 1: llevando siempre 1 salen ${f0(Number(uno))}.`),
        olv && h('AT-LLEVA-OLVIDA', Number(olv), `Bien sumar cada columna. Pero las bolsitas que suben se suman en la columna siguiente: sin ellas salen ${f0(Number(olv))}.`, T),
        fin && h('AT-LLEVA-FINAL', Number(fin), `Bien las columnas. Pero la última llevada también se anota: sin ella salen ${f0(Number(fin))}.`),
        dob && h('AT-LLEVA-DOBLE', Number(dob), `Bien sumar la llevada. Pero se suma una sola vez: contándola dos veces salen ${f0(Number(dob))}.`),
      ],
      solucion: [...lineasSuma(nums, 10), ['En total, ', Bv(ok), ' caramelos.']],
      _datos: { sumandos: nums, n: 10 },
    };
  }

  function sumaBase(rng) {
    const n = rng.entero(4, 9), A = numeroBase(rng, rng.elegir([2, 3]), n), B = numeroBase(rng, rng.elegir([2, 3]), n);
    const R = columnas([A, B], n);
    if (!R.cols.some(c => c.cout)) return null;
    const dec = sumaTexto([A, B], n, 'decimal'), olv = sumaTexto([A, B], n, 'olvida'), fin = R.final ? sumaTexto([A, B], n, 'final') : undefined;
    return {
      enunciado: ['En el puesto de bolsitas de ', Ev(n), ', doña Juana junta dos pedidos: ', ...opN(A, n), ' y ', ...opN(B, n), '.'],
      pregunta: ['¿Cómo queda la etiqueta del total?'],
      datos: [D.base(n), D.columna(n)],
      correctaTexto: numT(R.texto, n),
      errores: [
        htN('AT-DECIMAL', dec, n, `Bien sumar por columnas. Pero ${numT(dec, n)} lleva al llegar a 10; en base ${n}, ${n} de una columna ya llenan 1 de la siguiente.`),
        htN('AT-LLEVA-OLVIDA', olv, n, `Bien cada columna. Pero ${numT(olv, n)} no suma la llevada en la columna siguiente.`, T),
        htN('AT-LLEVA-FINAL', fin, n, `Bien las columnas. Pero ${numT(fin, n)} olvida anotar la última llevada.`),
      ],
      solucion: [...lineasSuma([A, B], n), ['La etiqueta es ', ...resN(R.texto, n), '.']],
      _datos: { sumandos: [A, B], n },
    };
  }

  function cuantoLleva(rng) {
    const nums = Array.from({ length: rng.elegir([3, 4]) }, () => numero(rng, 3)), R = columnas(nums, 10), c1 = R.cols[0], c2 = R.cols[1];
    if (c1.cout < 1 || c2.cout < 2) return null;
    const sinLlega = Math.floor(c2.entran.reduce((s, x) => s + x, 0) / 10);
    return {
      enunciado: ['Doña Juana suma en su cuaderno ', nums.join(' + '), '.'],
      pregunta: ['¿Cuánto lleva de la columna de las bolsitas a la de las cajas?'],
      datos: ['1 bolsita = 10 caramelos; 1 caja = 10 bolsitas', D.columna(10)],
      correcta: c2.cout, texto: x => String(x),
      errores: [
        h('AT-LLEVA-TODO', c2.s, `Bien juntar la columna de las bolsitas: ${c2.s}. Pero eso no se lleva entero: se lleva cuántas veces cabe 10 en ${c2.s}.`),
        h('AT-LLEVA-CIFRA', c2.cifra, `Bien la cuenta de la columna. Pero ${c2.cifra} es la cifra que se anota; lo que se lleva son las cajas llenas.`),
        h('AT-CADENA', sinLlega, `Bien sumar las bolsitas de los números. Pero falta la llevada que llega de los sueltos: sin ella se lleva ${sinLlega}.`),
        h('AT-LLEVA-UNO', 1, `Bien que la columna pase de 9. Pero con ${c2.s} bolsitas se llenan más cajas que 1.`),
      ],
      solucion: [
        ['Sueltos: ', c1.entran.join(' + '), ` = ${c1.s} = `, Mv(c1.cout), ' × ', Ev(10), ' + ', Bv(c1.cifra), '.'],
        ['Bolsitas: ', c2.entran.join(' + '), ' + ', Mv(c1.cout), ` = ${c2.s} = `, Mv(c2.cout), ' × ', Ev(10), ' + ', Bv(c2.cifra), '.'],
        ['A la columna de las cajas lleva ', Mv(c2.cout), '.'],
      ],
      _datos: { sumandos: nums, n: 10 },
    };
  }

  function baseCuadra(rng) {
    const n = rng.entero(5, 9), a = rng.entero(1, n - 2), c = rng.entero(1, n - 2 - a), b = rng.entero(1, n - 1), d = rng.entero(n - b, n - 1);
    const f = b + d - n, e = a + c + 1;
    if (f < 1 || e >= n) return null;
    const ab = `${a}${b}`, cd = `${c}${d}`, ef = `${e}${f}`, maxd = Math.max(a, b, c, d, e, f);
    if (maxd + 1 >= n) return null;
    return {
      enunciado: ['En la etiqueta de un puesto se lee la suma ', ab, Ev('₍ₙ₎'), ' + ', cd, Ev('₍ₙ₎'), ' = ', Bv(ef), Ev('₍ₙ₎'), ', bien hecha, en cierta base ', Ev('n'), '.'],
      pregunta: ['¿Cuál es la base?'],
      datos: [D.columna('n'), D.cifras],
      correcta: n, texto: x => `base ${x}`,
      errores: [
        h('AT-MENOR', maxd + 1, `Bien: con base ${maxd + 1} todas las cifras están bien escritas. Pero falta comprobar la cuenta; en base ${maxd + 1} no cuadra.`),
        h('AT-SUMA-COLUMNA', b + d, `Bien empezar por los sueltos: ${b} + ${d} = ${b + d}. Pero se anota ${f}: subió una bolsita y sobraron ${f}, así que la base es ${b + d} − ${f}.`),
        h('AT-DECIMAL', 10, `Bien que hubo una llevada. Pero en base 10 se anotaría ${(b + d) % 10}, no ${f}.`),
      ],
      solucion: [
        ['Sueltos: ', `${b} + ${d} = ${b + d}`, ', y se anota ', Bv(f), ': subió ', Mv(1), ' bolsita de ', Ev('n'), '.'],
        [`${b + d} = `, Mv(1), ' × ', Ev('n'), ' + ', Bv(f), ', así que ', Ev('n'), ` = ${b + d} − ${f} = `, Ev(n), '.'],
        ['Compruebo la otra columna: ', `${a} + ${c} + `, Mv(1), ` = ${e}`, `, menor que ${n}: se anota `, Bv(e), ', como dice la etiqueta.'],
      ],
      _datos: { sumandos: [ab, cd], resultado: ef },
    };
  }

  // ======================= Idea 2: abrir una bolsita para restar =======================

  function resta(rng) {
    const M = numero(rng, 3, true), S = numero(rng, 3);
    if (+S >= +M) return null;
    const R = restar(M, S, 10);
    if (!R || R.abiertos < 1) return null;
    const ok = Number(R.texto), men = restaTexto(M, S, 10, 'menor'), sin = restaTexto(M, S, 10, 'sin'), dob = restaTexto(M, S, 10, 'doble');
    return {
      enunciado: ['Doña Juana tiene ', f0(+M), ' caramelos y despacha un pedido de ', f0(+S), '.'],
      pregunta: ['¿Cuántos caramelos le quedan?'],
      datos: ['1 bolsita = 10 caramelos; 1 caja = 10 bolsitas', D.resta(10)],
      correcta: ok,
      errores: [
        men && h('AT-MENOR-MAYOR', Number(men), `Bien restar por columnas. Pero siempre es arriba menos abajo: si no alcanza, se abre un envase. Restando el menor del mayor salen ${f0(Number(men))}.`),
        sin && h('AT-SIN-DESCONTAR', Number(sin), `Bien abrir un envase cuando no alcanza. Pero la columna que prestó queda con uno menos: sin descontarlo salen ${f0(Number(sin))}.`, T),
        dob && h('AT-DOBLE-DESCUENTO', Number(dob), `Bien descontar el préstamo. Pero se descuenta 1, una sola vez: descontando 2 salen ${f0(Number(dob))}.`),
      ],
      solucion: [...lineasResta(M, S, 10), ['Le quedan ', Bv(ok), ' caramelos.']],
      _datos: { minuendo: M, sustraendo: S, n: 10 },
    };
  }

  // Un minuendo de 4 cifras con ceros en medio (préstamos en cadena).
  function minuendoCeros(rng) {
    const forma = rng.elegir(['a00b', 'a00b', 'a0b0', 'ab00', 'a0bc']);
    const M = forma.replace('a', rng.entero(2, 9)).replace('b', rng.entero(1, 9)).replace('c', rng.entero(1, 9));
    const S = String(rng.entero(1000, +M - 1));
    return { M, S };
  }
  function ceros(rng) {
    const { M, S } = minuendoCeros(rng), R = restar(M, S, 10);
    if (!R || R.abiertos < 2) return null;
    const ok = Number(R.texto), men = restaTexto(M, S, 10, 'menor'), sin = restaTexto(M, S, 10, 'sin'), c10 = restaTexto(M, S, 10, 'cero10'), dob = restaTexto(M, S, 10, 'doble');
    return {
      enunciado: ['Doña Juana tiene ', f0(+M), ' caramelos en su puesto y despacha ', f0(+S), '.'],
      pregunta: ['¿Cuántos caramelos le quedan?'],
      datos: [D.envases, D.resta(10)],
      correcta: ok,
      errores: [
        men && h('AT-MENOR-MAYOR', Number(men), `Bien restar por columnas. Pero es arriba menos abajo: si no alcanza, se abre un envase. Así salen ${f0(Number(men))}.`),
        sin && h('AT-SIN-DESCONTAR', Number(sin), `Bien abrir envases. Pero cada columna que presta queda con uno menos: sin descontarlo salen ${f0(Number(sin))}.`, T),
        c10 && h('AT-CERO-DIEZ', Number(c10), `Bien seguir la cadena hasta un envase lleno. Pero un 0 que presta queda en 9, no en 10: así salen ${f0(Number(c10))}.`),
        dob && h('AT-DOBLE-DESCUENTO', Number(dob), `Bien descontar lo que se presta. Pero cada columna que presta pierde 1, una sola vez: descontando 2 salen ${f0(Number(dob))}.`),
      ],
      solucion: [...lineasResta(M, S, 10), ['Le quedan ', Bv(ok), ' caramelos.']],
      _datos: { minuendo: M, sustraendo: S, n: 10 },
    };
  }

  function restaBase(rng) {
    const n = rng.entero(4, 9), M = `${rng.entero(2, n - 1)}0${rng.entero(0, n - 2)}`;
    const vS = rng.entero(n * n, valor(M, n) - 1), S = enBase(vS, n), R = restar(M, S, n);
    if (!R || R.abiertos < 2) return null;
    const dec = restaTexto(M, S, n, 'decimal'), sin = restaTexto(M, S, n, 'sin'), c10 = restaTexto(M, S, n, 'cero10'), men = restaTexto(M, S, n, 'menor');
    return {
      enunciado: ['En el puesto de bolsitas de ', Ev(n), ', doña Juana tiene ', ...opN(M, n), ' caramelos y despacha ', ...opN(S, n), '.'],
      pregunta: ['¿Cómo queda la etiqueta de lo que le queda?'],
      datos: [D.abrir(n), D.resta(n)],
      correctaTexto: numT(R.texto, n),
      errores: [
        htN('AT-DECIMAL', dec, n, `Bien abrir un envase cuando no alcanza. Pero ${numT(dec, n)} sale de abrirlo en 10; en base ${n} un envase abierto da ${n}.`),
        htN('AT-SIN-DESCONTAR', sin, n, `Bien abrir envases. Pero ${numT(sin, n)} no le quita 1 a la columna que prestó.`, T),
        htN('AT-CERO-DIEZ', c10, n, `Bien la cadena de préstamos. Pero ${numT(c10, n)} deja el 0 que presta en ${n}; queda en ${n - 1}.`),
        htN('AT-MENOR-MAYOR', men, n, `Bien restar por columnas. Pero ${numT(men, n)} resta el menor del mayor; es arriba menos abajo.`),
      ],
      solucion: [...lineasResta(M, S, n), ['Le quedan ', ...resN(R.texto, n), '.']],
      _datos: { minuendo: M, sustraendo: S, n },
    };
  }

  function aperturas(rng) {
    const { M, S } = minuendoCeros(rng), R = restar(M, S, 10);
    if (!R) return null;
    const a = aDig(M), b = aDig(S);
    const columnasNo = a.filter((x, i) => x < (b[i] || 0)).length, cerosM = a.filter(x => x === 0).length, ok = R.abiertos;
    return {
      enunciado: ['Doña Juana tiene ', f0(+M), ' caramelos y despacha un pedido de ', f0(+S), '.'],
      pregunta: ['¿Cuántas veces abre un envase (bolsita, caja o cajón) al hacer la resta?'],
      datos: [D.abrirEnvase, D.vacio, D.resta(10)],
      correcta: ok, texto: veces,
      errores: [
        h('AT-PRESTA-COLUMNAS', columnasNo, `Bien ver qué columnas no alcanzan. Pero si al lado hay un 0, también se abre el de más allá: contando solo esas salen ${veces(columnasNo)}.`),
        h('AT-PRESTA-CEROS', cerosM, `Bien mirar los ceros. Pero se cuenta cada envase que se abre, no cada 0: así salen ${veces(cerosM)}.`),
        h('AT-DOBLE-DESCUENTO', ok + 1, `Bien seguir la cadena. Pero cada envase se abre una sola vez: así salen ${veces(ok + 1)}.`),
      ],
      solucion: [...lineasResta(M, S, 10), ['Cada «se abre» es un envase: ', Mv(veces(ok)), '.']],
      _datos: { minuendo: M, sustraendo: S, n: 10 },
    };
  }

  function sumaTres(rng) {
    const k = rng.entero(20, 160), M = 6 * k, S = 2 * M;
    return {
      enunciado: ['Doña Juana revisa una resta de su cuaderno: el minuendo, el sustraendo y la diferencia suman ', Bv(S), '.'],
      pregunta: ['¿Cuál es el minuendo?'],
      datos: [D.prueba, 'Minuendo: el número del que se resta; sustraendo: el que se quita'],
      correcta: M,
      errores: [
        h('AT-RESTA-TOTAL', S, `Bien juntar los tres números. Pero ${f0(S)} es la suma de los tres, no el minuendo.`),
        h('AT-RESTA-TERCIO', S / 3, `Bien repartir la suma. Pero los tres no valen lo mismo: dividir entre 3 da ${f0(S / 3)}.`),
        h('AT-RESTA-CUARTO', S / 4, `Bien usar la suma. Pero el minuendo no es la cuarta parte: ${f0(S / 4)} no cumple la resta.`),
      ],
      solucion: [
        ['El sustraendo más la diferencia es el minuendo: la suma es dos veces el minuendo.'],
        ['2 × minuendo = ', Bv(S), ', así que el minuendo es ', `${f0(S)} ÷ 2 = ${f0(M)}`, '.'],
      ],
      _datos: { suma: S },
    };
  }

  // ======================= Idea 3: lo que falta para llenar =======================

  const caTexto = (N, n = 10) => enBase(n ** N.length - valor(N, n), n);
  // De 9 (n − 1) todas las cifras hasta la última que no es 0; los ceros de adentro también; los de afuera quedan.
  const cerosQuedan = N => {
    const c = [...N].map(Number); let u = c.length - 1; while (c[u] === 0) u--;
    if (!c.slice(0, u).includes(0)) return undefined;
    return c.map((d, i) => (i < u ? (d === 0 ? 0 : 9 - d) : i === u ? 10 - d : 0)).join('').replace(/^0+(?=\d)/, '');
  };
  const caDiez = N => ([...N].some(c => c === '0') ? undefined : [...N].map(d => 10 - d).join(''));

  function ca(rng) {
    const k = rng.elegir([3, 4, 4]), forma = rng.moneda();
    let N = String(rng.entero(1, 4));
    while (N.length < k - 1) N += forma && N.length === 1 ? 0 : rng.entero(0, 9);
    N += rng.entero(1, 9);
    const V = +N, P10 = 10 ** k, ok = P10 - V;
    const cq = cerosQuedan(N), cd = caDiez(N);
    return {
      enunciado: ['Doña Juana anota en su cuaderno el número ', f0(V), '.'],
      pregunta: ['¿Cuál es su complemento aritmético?'],
      datos: [D.ca],
      correcta: ok,
      errores: [
        h('AT-CA9', P10 - 1 - V, `Bien restar de 9 las primeras cifras. Pero la última que no es 0 se resta de 10: de 9 todas sale ${f0(P10 - 1 - V)}.`, T),
        cq && h('AT-CERO-QUEDA', Number(cq), `Bien la última cifra. Pero un 0 de adentro también se resta de 9: dejándolo en 0 sale ${f0(Number(cq))}.`),
        h('AT-CA-K', 10 * P10 - V, `Bien restar desde un 1 con ceros. Pero ${f0(V)} tiene ${k} cifras: la meta es ${f0(P10)}, no ${f0(10 * P10)}; así sale ${f0(10 * P10 - V)}.`),
        cd && h('AT-CA-DIEZ', Number(cd), `Bien la última cifra, que se resta de 10. Pero las de antes se restan de 9: de 10 todas sale ${f0(Number(cd))}.`),
        h('AT-CA-K', 10 * P10 - 1 - V, `Bien restar las cifras de 9. Pero la meta es ${f0(P10)}, con tantos ceros como cifras tiene el número, y falta el 1 de la última: así sale ${f0(10 * P10 - 1 - V)}.`),
      ],
      solucion: [
        [`${f0(V)} tiene ${k} cifras: la meta es `, Ev(f0(P10)), '.'],
        ['CA(', f0(V), ') = ', Ev(f0(P10)), ` − ${f0(V)} = `, Bv(ok), '.'],
      ],
      _datos: { N, n: 10 },
    };
  }

  function cerosFinales(rng) {
    const z = rng.elegir([1, 1, 2]), sig = 4 - z;
    let N = String(rng.entero(1, 4));
    while (N.length < sig - 1) N += rng.entero(0, 9);
    N += rng.entero(1, 9);
    N += '0'.repeat(z);
    const V = +N, P10 = 10 ** 4, ok = P10 - V, corto = N.slice(0, sig), sinCeros = 10 ** sig - +corto;
    return {
      enunciado: ['En el cuaderno de doña Juana dice ', f0(V), ' caramelos.'],
      pregunta: ['¿Cuál es el complemento aritmético de ', f0(V), '?'],
      datos: [D.ca],
      correcta: ok,
      errores: [
        h('AT-CA9', P10 - 1 - V, `Bien restar las cifras de 9. Pero llegar a ${f0(P10)} es sumar 1 más: de 9 todas sale ${f0(P10 - 1 - V)}.`, T),
        h('AT-CA-K', 10 * P10 - V, `Bien partir de un 1 con ceros. Pero ${f0(V)} tiene 4 cifras: la meta es ${f0(P10)}; con ${f0(10 * P10)} sale ${f0(10 * P10 - V)}.`),
        h('AT-CA-CEROS', sinCeros, `Bien sacar el complemento de ${corto}. Pero los ceros del final son parte del número y se quedan: sin ellos sale ${f0(sinCeros)}.`),
        h('AT-CA-K', 10 * P10 - 1 - V, `Bien restar las cifras de 9. Pero la meta es ${f0(P10)}, de 4 ceros, y falta sumar 1: así sale ${f0(10 * P10 - 1 - V)}.`),
      ],
      solucion: [
        [`${f0(V)} tiene 4 cifras: la meta es `, Ev(f0(P10)), '.'],
        ['CA(', f0(V), ') = ', Ev(f0(P10)), ` − ${f0(V)} = `, Bv(ok), '.'],
      ],
      _datos: { N, n: 10 },
    };
  }

  function caBase(rng) {
    const n = rng.entero(4, 8), N = numeroBase(rng, 3, n);
    if (N[2] === '0') return null;
    const ok = caTexto(N, n), V = valor(N, n), n3 = n ** 3;
    const dec = [...N].map((d, i) => (i < 2 ? 9 - d : 10 - d)).join('').replace(/^0+(?=\d)/, '');
    const nueve = enBase(n3 - 1 - V, n), k4 = enBase(n ** 4 - V, n);
    return {
      enunciado: ['En el puesto de bolsitas de ', Ev(n), ', un pedido se anota ', ...opN(N, n), '.'],
      pregunta: ['¿Cuál es su complemento aritmético, en base ', Ev(n), '?'],
      datos: [D.caBase, `${n}³ = ${n} × ${n} × ${n}`, D.cifras],
      correctaTexto: numT(ok, n),
      errores: [
        htN('AT-CA-DECIMAL', dec, n, `Bien restar cifra por cifra. Pero ${numT(dec, n)} resta de 9 y de 10, como en base 10; en base ${n} la meta es ${n}³.`),
        htN('AT-CA9', nueve, n, `Bien restar de ${n - 1}, la mayor cifra. Pero falta llegar a la meta: ${numT(nueve, n)} se queda a 1.`, T),
        htN('AT-CA-K', k4, n, `Bien restar desde una potencia de ${n}. Pero el pedido tiene 3 cifras: la meta es ${n}³, no ${n}⁴; así sale ${numT(k4, n)}.`),
      ],
      solucion: [
        [...opN(N, n), ` = ${N[0]} × ${n * n} + ${N[1]} × ${n} + ${N[2]} = ${V}; la meta es `, Ev(`${n}³ = ${n3}`), '.'],
        ['CA = ', Ev(n3), ` − ${V} = ${n3 - V}`, ', que en base ', Ev(n), ' es ', ...resN(ok, n), '.'],
      ],
      _datos: { N, n },
    };
  }

  function caOculto(rng) {
    const p = rng.entero(1, 8), a = rng.entero(0, 9), q = rng.entero(1, 9), r = 9 - a, b = 9 - p, c = 10 - q;
    if (r === 4) return null;
    const S = a + b + c, sinRestar = r + b + c;
    if (sinRestar < 1) return null;
    return {
      enunciado: ['Doña Juana anotó en su cuaderno que CA(', raya(`${p}a${q}`), ') = ', Bv(raya(`b${r}c`)), '.'],
      pregunta: ['¿Cuánto vale a + b + c?'],
      datos: [D.ca, D.letras],
      correcta: S, texto: x => String(x),
      errores: [
        h('AT-CA9', S - 1, `Bien restar de 9 las primeras cifras. Pero la última, ${q}, no es 0 y se resta de 10: con c = ${9 - q} la suma da ${S - 1}.`, T),
        h('AT-CA-DIEZ', S + 2, `Bien la última cifra: c = ${c}. Pero las de antes se restan de 9, no de 10: así la suma da ${S + 2}.`),
        h('AT-CA-SIN-RESTAR', sinRestar, `Bien b = ${b} y c = ${c}. Pero a no es ${r}: la cifra del medio también se resta de 9. Así la suma da ${sinRestar}.`),
      ],
      solucion: [
        [raya(`${p}a${q}`), ' tiene 3 cifras: CA = ', Ev('1 000'), ' − ', raya(`${p}a${q}`), '.'],
        [`Restando de 1 000: las centenas, 9 − ${p} = b = ${b}; las decenas, 9 − a = ${r}, así que a = ${a}; las unidades, 10 − ${q} = c = ${c}.`],
        [`a + b + c = ${a} + ${b} + ${c} = ${S}.`],
      ],
      _datos: { p, q, r },
    };
  }

  // ======================= Idea 4: cifras que faltan, columna por columna =======================

  const cifraT = x => String(x);
  // Las cifras que cumplen una cuenta con manchas, probando todas (para que la respuesta sea única).
  function soluciones(prueba, huecos) {
    const out = [];
    for (let x = 0; x < 10 ** huecos; x++) { const ds = String(x).padStart(huecos, '0').split('').map(Number); if (prueba(ds)) out.push(ds); }
    return out;
  }

  function manchaSuma(rng) {
    const A = numero(rng, 3), B = numero(rng, 3), R = +A + +B;
    if (R >= 1000 || +A[1] === 0 || (+A[2] + +B[2]) < 10) return null;
    const x = +A[1], vis = `${A[0]}☐${A[2]}`;
    const sols = soluciones(([y]) => +`${A[0]}${y}${A[2]}` + +B === R, 1);
    if (sols.length !== 1) return null;
    const R1 = Math.floor(R / 10) % 10, olv = (R1 - +B[1] + 20) % 10, dob = (R1 - +B[1] - 2 + 20) % 10;
    return {
      enunciado: ['En el cuaderno de doña Juana, una mancha de chicha morada tapa una cifra de una suma: ', `${vis} + ${B} = `, Bv(String(R)), '.'],
      pregunta: ['¿Qué cifra está bajo la mancha?'],
      datos: [D.mancha, D.bien, D.columna(10)],
      correctaTexto: cifraT(x),
      errores: [
        ht('AT-LLEVA-OLVIDA', cifraT(olv), `Bien ir a la columna de la mancha. Pero de los sueltos llega 1: sin esa llevada sale ${olv}.`, T),
        ht('AT-LLEVA-DOBLE', cifraT(dob), `Bien contar la llevada que llega. Pero se cuenta una sola vez: contándola dos veces sale ${dob}.`),
        ht('AT-SUFICIENCIA', NOSE, `Bien ver que la mancha tapa una cifra. Pero la columna la deja en un solo valor: «${NOSE}» no va.`),
      ],
      solucion: [
        ['Sueltos: ', `${A[2]} + ${B[2]} = ${+A[2] + +B[2]} = `, Mv(1), ' × ', Ev(10), ' + ', Bv(R % 10), '.'],
        ['Bolsitas: ☐ + ', `${B[1]} + `, Mv(1), ' termina en ', Bv(R1), `: ☐ = ${x}.`],
        ['Compruebo: ', `${A} + ${B} = `, Bv(String(R)), '.'],
      ],
      _datos: { sumandos: [vis, B], resultado: String(R) },
    };
  }

  // Deducción columna por columna de la suma p☐q + ☐st = R con un modelo de llevada (k = 1 bien, 0 olvida, 2 doble).
  function deducirSuma(A, B, R, k) {
    const c1 = +A[2] + +B[2] >= 10 ? 1 : 0, R1 = Math.floor(R / 10) % 10, R2 = Math.floor(R / 100);
    const x = ((R1 - +B[1] - k * c1) % 10 + 20) % 10, c2 = x + +B[1] + k * c1 >= 10 ? 1 : 0, y = R2 - +A[0] - k * c2;
    return y >= 1 && y <= 9 ? x + y : undefined;
  }
  function manchaDos(rng) {
    const A = numero(rng, 3), B = numero(rng, 3), R = +A + +B;
    if (R >= 1000 || (+A[2] + +B[2]) < 10 || (+A[1] + +B[1] + 1) < 10) return null;
    const vA = `${A[0]}☐${A[2]}`, vB = `☐${B[1]}${B[2]}`;
    const sols = soluciones(([x, y]) => y > 0 && +`${A[0]}${x}${A[2]}` + +`${y}${B[1]}${B[2]}` === R, 2);
    if (sols.length !== 1) return null;
    const ok = +A[1] + +B[0], olv = deducirSuma(A, B, R, 0), dob = deducirSuma(A, B, R, 2);
    return {
      enunciado: ['Dos manchas de chicha morada tapan dos cifras de una suma del cuaderno: ', `${vA} + ${vB} = `, Bv(String(R)), '.'],
      pregunta: ['¿Cuánto suman las dos cifras manchadas?'],
      datos: [D.mancha, D.bien, D.columna(10)],
      correctaTexto: cifraT(ok),
      errores: [
        olv !== undefined && ht('AT-LLEVA-OLVIDA', cifraT(olv), `Bien empezar por los sueltos. Pero cada columna que pasa de 9 lleva 1 a la siguiente: sin esas llevadas la suma da ${olv}.`, T),
        dob !== undefined && ht('AT-LLEVA-DOBLE', cifraT(dob), `Bien contar las llevadas. Pero cada una se suma una vez: contándolas dos veces da ${dob}.`),
        ht('AT-SUFICIENCIA', NOSE, `Bien ver que faltan dos cifras. Pero cada columna deja una sola: «${NOSE}» no va.`),
      ],
      solucion: [
        ['Sueltos: ', `${A[2]} + ${B[2]} = ${+A[2] + +B[2]} = `, Mv(1), ' × ', Ev(10), ' + ', Bv(R % 10), '.'],
        ['Bolsitas: ☐ + ', `${B[1]} + `, Mv(1), ' termina en ', Bv(Math.floor(R / 10) % 10), `: la mancha de arriba es ${A[1]}, y se lleva `, Mv(1), '.'],
        ['Cajas: ', `${A[0]} + ☐ + `, Mv(1), ' = ', Bv(Math.floor(R / 100)), `: la mancha de abajo es ${B[0]}.`],
        [`Las dos suman ${A[1]} + ${B[0]} = ${ok}.`],
      ],
      _datos: { sumandos: [vA, vB], resultado: String(R) },
    };
  }

  // Deducción de la resta h☐u − ☐tw = Dif con un modelo de préstamo (k = 1 bien, 0 sin descontar, 2 doble): las dos
  // cifras manchadas, { x: la de arriba, y: la de abajo }. (Su suma no sirve de pregunta: los dos errores se compensan.)
  function deducirResta(M, S, Dif, k) {
    const bin = +M[2] < +S[2] ? 1 : 0, D1 = Math.floor(Dif / 10) % 10, D2 = Math.floor(Dif / 100);
    const t = D1 + +S[1] + k * bin, bout = t >= 10 ? 1 : 0, x = t - 10 * bout;
    if (x > 9) return {};
    const y = +M[0] - k * bout - D2;
    return { x, y: y >= 1 && y <= 9 ? y : undefined };
  }
  function manchaResta(rng) {
    const M = numero(rng, 3), S = numero(rng, 3), Dif = +M - +S, lado = rng.elegir(['arriba', 'abajo']);
    if (Dif < 100 || +M[2] >= +S[2] || +M[1] - 1 >= +S[1]) return null;
    const vM = `${M[0]}☐${M[2]}`, vS = `☐${S[1]}${S[2]}`;
    const sols = soluciones(([x, y]) => y > 0 && +`${M[0]}${x}${M[2]}` - +`${y}${S[1]}${S[2]}` === Dif, 2);
    if (sols.length !== 1) return null;
    const pide = lado === 'arriba' ? 'x' : 'y', ok = lado === 'arriba' ? +M[1] : +S[0];
    const sin = deducirResta(M, S, Dif, 0)[pide], dob = deducirResta(M, S, Dif, 2)[pide];
    const R = restar(M, S, 10), c = R.cols;
    return {
      enunciado: ['En una resta del cuaderno, dos manchas tapan dos cifras: ', `${vM} − ${vS} = `, Bv(String(Dif)), '.'],
      pregunta: [lado === 'arriba' ? '¿Qué cifra está bajo la mancha del minuendo (el número de arriba)?' : '¿Qué cifra está bajo la mancha del sustraendo (el número de abajo)?'],
      datos: [D.mancha, D.bien, D.resta(10)],
      correctaTexto: cifraT(ok),
      errores: [
        sin !== undefined && ht('AT-SIN-DESCONTAR', cifraT(sin), `Bien abrir un envase donde no alcanza. Pero la columna que prestó queda con uno menos: sin descontarlo sale ${sin}.`, T),
        dob !== undefined && ht('AT-DOBLE-DESCUENTO', cifraT(dob), `Bien descontar el préstamo. Pero cada columna presta una sola vez: descontando dos sale ${dob}.`),
        ht('AT-SUFICIENCIA', NOSE, `Bien ver que hay dos manchas. Pero cada columna deja una sola cifra: «${NOSE}» no va.`),
      ],
      solucion: [
        ['Sueltos: ', `${M[2]} no alcanza para ${S[2]}; se abre 1 bolsita: ${M[2]} + `, Ev(10), ` − ${S[2]} = `, Bv(c[0].cifra), '.'],
        ['Bolsitas: ☐ − ', Mv(1), ` − ${S[1]} tiene que dar `, Bv(c[1].cifra), '; no alcanza, se abre 1 caja: ☐ + ', Ev(10), ' − ', Mv(1), ` − ${S[1]} = ${c[1].cifra}, así que la mancha de arriba es ${M[1]}.`],
        ['Cajas: ', `${M[0]} − `, Mv(1), ' − ☐ = ', Bv(c[2].cifra), `: la mancha de abajo es ${S[0]}.`],
      ],
      _datos: { sub: lado, minuendo: vM, sustraendo: vS, diferencia: String(Dif) },
    };
  }

  function reverso(rng) {
    const k = rng.entero(2, 8), Dif = 99 * k, ok = 990 + (9 - k);
    return {
      enunciado: ['Doña Juana escribe un número de tres cifras, ', raya('abc'), ', y le resta su reverso, ', raya('cba'), ': le sale ', Bv(String(Dif)), '.'],
      pregunta: ['¿Cuál es el mayor número que pudo escribir?'],
      datos: [D.abc, D.reverso, D.acNo0],
      correcta: ok,
      errores: [
        h('AT-MEDIO-CERO', 900 + (9 - k), `Bien a = 9 y c = ${9 - k}. Pero la cifra del medio se cancela en la resta y puede ser 9: con 0 sale ${900 + (9 - k)}.`),
        h('AT-REVERSO-C', 990 + k, `Bien que a − c = ${k}. Pero c no es ${k}: es lo que le falta a 9 para eso, c = ${9 - k}. Con c = ${k} sale ${990 + k}.`),
        h('AT-MENOR', 100 * (k + 1) + 1, `Bien que a − c = ${k}. Pero ${100 * (k + 1) + 1} es el menor que cumple; se pide el mayor.`),
      ],
      solucion: [
        [raya('abc'), ' − ', raya('cba'), ' = 100 × a + c − 100 × c − a = 99 × (a − c).'],
        ['99 × (a − c) = ', Bv(String(Dif)), `: a − c = ${k}.`],
        [`El mayor: a = 9, c = ${9 - k} y b = 9 (la b se cancela): `, String(ok), '.'],
      ],
      _datos: { diferencia: Dif },
    };
  }

  // ======================= Idea 5: multiplicar es juntar bolsas iguales =======================

  function porCifra(rng) {
    const N = String(rng.entero(300, 999)), m = rng.entero(3, 9), R = columnas([N], 10, 'ok', m);
    if (!R.cols.some(c => c.cout >= 2) || !R.final) return null;
    const ok = +N * m, uno = porCifraTexto(N, m, 10, 'uno'), olv = porCifraTexto(N, m, 10, 'olvida'), fin = porCifraTexto(N, m, 10, 'final'), dob = porCifraTexto(N, m, 10, 'doble');
    return {
      enunciado: ['Doña Juana arma ', String(m), ' pedidos iguales de ', f0(+N), ' caramelos.'],
      pregunta: ['¿Cuántos caramelos son en total?'],
      datos: [D.envases, D.producto(10)],
      correcta: ok,
      errores: [
        uno && h('AT-LLEVA-UNO', Number(uno), `Bien multiplicar cifra por cifra. Pero la llevada puede ser 2 o más: llevando siempre 1 salen ${f0(Number(uno))}.`),
        olv && h('AT-LLEVA-OLVIDA', Number(olv), `Bien cada producto. Pero lo que se lleva se suma en la columna siguiente: sin eso salen ${f0(Number(olv))}.`, T),
        fin && h('AT-LLEVA-FINAL', Number(fin), `Bien las columnas. Pero la última llevada también se anota: sin ella salen ${f0(Number(fin))}.`),
        dob && h('AT-LLEVA-DOBLE', Number(dob), `Bien sumar la llevada al producto de la columna siguiente. Pero se suma una vez: contándola dos veces salen ${f0(Number(dob))}.`),
      ],
      solucion: [...lineasSuma([N], 10, m), ['Son ', Bv(ok), ' caramelos.']],
      _datos: { N, m, n: 10 },
    };
  }

  function cuantoSube(rng) {
    const G = rng.entero(6, 18), F = rng.entero(8, 30), s = rng.entero(2, 6);
    if (F === G || s * G === (F + s) * G) return null;
    return {
      enunciado: ['Doña Juana tiene ', String(G), ' bolsas con ', String(F), ' caramelos cada una. A cada bolsa le agrega ', String(s), ' caramelos más.'],
      pregunta: ['¿Cuántos caramelos sube el pedido?'],
      datos: [D.distrib, D.fgs],
      correcta: s * G,
      errores: [
        h('AT-SUBE-SOLO', s, `Bien ver que cada bolsa recibe ${s}. Pero son ${G} bolsas: ${s} es lo que sube una sola.`),
        h('AT-SUBE-MISMO', s * F, `Bien multiplicar el aumento. Pero por las bolsas, ${G}, no por los caramelos de cada bolsa: así salen ${f0(s * F)}.`),
        h('AT-PRODUCTO-NUEVO', (F + s) * G, `Bien el pedido nuevo: ${f0((F + s) * G)} caramelos. Pero se pide cuánto sube, no cuánto tiene ahora.`),
      ],
      solucion: [
        [`(${F} + ${s}) × ${G} = ${F} × ${G} + ${s} × ${G}.`],
        [`El pedido sube ${s} × ${G} = `, Bv(s * G), ' caramelos.'],
      ],
      _datos: { F, G, s },
    };
  }

  function factorFalta(rng) {
    const s = rng.entero(2, 4), G = rng.entero(6, 19), T = s * G;
    const divs = []; for (let x = s + 1; x <= 40; x++) if (T % x === 0 && x !== G && x !== T && T / x !== G) divs.push(x);
    if (!divs.length) return null;
    const F = rng.elegir(divs);
    return {
      enunciado: ['Cada bolsa de un pedido tiene ', String(F), ' caramelos. Doña Juana agrega ', String(s), ' caramelos a cada bolsa y el pedido sube ', Bv(T), ' caramelos.'],
      pregunta: ['¿Cuántas bolsas tiene el pedido?'],
      datos: [D.distrib, D.fgs],
      correcta: G,
      errores: [
        h('AT-RESTA-AUMENTO', T - s, `Bien usar lo que sube, ${T}. Pero no se le resta lo que recibe una bolsa: se divide entre eso. Restando sale ${T - s}.`),
        h('AT-MULTIPLICA', T * s, `Bien relacionar lo que sube con lo que recibe cada bolsa. Pero ${T} ya es ${s} por las bolsas: multiplicando sale ${f0(T * s)}.`),
        h('AT-SUBE-MISMO', T / F, `Bien dividir lo que sube. Pero entre lo que recibe de más cada bolsa, ${s}, no entre los ${F} que ya tenía: así sale ${T / F}.`),
        h('AT-SUMA-AUMENTO', T + s, `Bien usar lo que sube. Pero no se le suma lo que recibe una bolsa: así sale ${T + s}.`),
      ],
      solucion: [
        [`Cada bolsa recibe ${s} más: el pedido sube ${s} × bolsas.`],
        [`${s} × bolsas = `, Bv(T), `, así que hay ${T} ÷ ${s} = ${G} bolsas.`],
      ],
      _datos: { F, s, sube: T },
    };
  }

  function porCifraBase(rng) {
    const n = rng.entero(4, 9), N = numeroBase(rng, rng.elegir([2, 3]), n), m = rng.entero(2, n - 1), R = columnas([N], n, 'ok', m);
    if (!R.cols.some(c => c.cout)) return null;
    const dec = porCifraTexto(N, m, n, 'decimal'), uno = porCifraTexto(N, m, n, 'uno'), olv = porCifraTexto(N, m, n, 'olvida');
    return {
      enunciado: ['En el puesto de bolsitas de ', Ev(n), ', doña Juana arma ', String(m), ' pedidos iguales de ', ...opN(N, n), '.'],
      pregunta: ['¿Cómo queda la etiqueta del total?'],
      datos: [D.base(n), D.producto(n)],
      correctaTexto: numT(R.texto, n),
      errores: [
        htN('AT-DECIMAL', dec, n, `Bien multiplicar cifra por cifra. Pero ${numT(dec, n)} lleva de 10 en 10; en base ${n} se lleva de ${n} en ${n}.`),
        htN('AT-LLEVA-UNO', uno, n, `Bien multiplicar por columnas. Pero ${numT(uno, n)} lleva 1 donde van 2 o más.`),
        htN('AT-LLEVA-OLVIDA', olv, n, `Bien cada producto. Pero ${numT(olv, n)} no suma la llevada en la columna siguiente.`, T),
      ],
      solucion: [...lineasSuma([N], n, m), ['La etiqueta es ', ...resN(R.texto, n), '.']],
      _datos: { N, m, n },
    };
  }

  function losDos(rng) {
    const G = rng.entero(5, 15), F = rng.entero(6, 25), t = rng.entero(2, 6), s = rng.entero(2, 6);
    if (F === G || s === t) return null;
    const ok = (F + s) * (G + t) - F * G, esquina = s * G + t * F, cruz = s * F + t * G;
    if (cruz === ok || cruz === esquina) return null;
    return {
      enunciado: ['Un pedido tiene ', String(G), ' bolsas de ', String(F), ' caramelos. Doña Juana le agrega ', String(t), ' bolsas más y pone ', String(s), ' caramelos más en cada bolsa, también en las nuevas.'],
      pregunta: ['¿Cuántos caramelos sube el pedido?'],
      datos: [D.distrib, D.pedido],
      correcta: ok,
      errores: [
        h('AT-SIN-ESQUINA', esquina, `Bien lo que suben las bolsas de antes (${s} × ${G}) y lo que traen las nuevas (${t} × ${F}). Pero las nuevas también reciben ${s} más: falta ${s} × ${t}. Así sale ${f0(esquina)}.`),
        h('AT-PRODUCTO-NUEVO', (F + s) * (G + t), `Bien el pedido nuevo: ${f0((F + s) * (G + t))} caramelos. Pero se pide cuánto sube.`),
        h('AT-SUBE-MISMO', cruz, `Bien multiplicar cada aumento. Pero los caramelos de más van por las bolsas, y las bolsas nuevas por sus caramelos: cruzado sale ${f0(cruz)}.`),
      ],
      solucion: [
        [`Antes: ${F} × ${G} = ${f0(F * G)}. Después: (${F} + ${s}) × (${G} + ${t}) = ${F + s} × ${G + t} = ${f0((F + s) * (G + t))}.`],
        [`Sube ${f0((F + s) * (G + t))} − ${f0(F * G)} = `, Bv(ok), ` = ${s} × ${G} + ${t} × ${F} + ${s} × ${t}.`],
      ],
      _datos: { F, G, s, t },
    };
  }

  // ======================= Idea 6: sobran o faltan para otra bolsita =======================

  function exceso(rng) {
    const d = rng.entero(6, 15), q = rng.entero(3, 12), r = rng.entero(1, d - 1), Dv = d * q + r, re = d - r;
    if (2 * r === d) return null;
    return {
      enunciado: ['Doña Juana empaca ', String(Dv), ' caramelos en bolsitas de ', Ev(d), '. Llena todas las que puede.'],
      pregunta: ['¿Cuántos caramelos le faltan para llenar una bolsita más?'],
      datos: [D.div, D.exceso, D.letrasDiv],
      correcta: re, texto: x => String(x),
      errores: [
        h('AT-EXCESO-IGUAL', r, `Bien la división:${sobran(r)}${r}. Pero se pide lo que falta, no lo que sobra.`, T),
        h('AT-EXCESO-SUMA', d + r, `Bien hallar lo que sobra, ${r}. Pero lo que falta no se suma a la bolsita: ${d} + ${r} = ${d + r}.`),
        h('AT-EXCESO-DIVISOR', d, `Bien que una bolsita lleva ${d}. Pero ya ${r === 1 ? 'hay 1 suelto' : `hay ${r} sueltos`}: no faltan ${d}.`),
      ],
      solucion: [
        [`${Dv} = `, Ev(d), ` × ${q} + `, Mv(r), ': se llenan ', String(q), pl(r, ' bolsitas y sobra ', ' bolsitas y sobran '), Mv(r), '.'],
        ['Para otra bolsita', faltan(re), Ev(d), ' − ', Mv(r), ' = ', Bv(re), `: ${Dv} = `, Ev(d), ` × ${q + 1} − `, Bv(re), '.'],
      ],
      _datos: { D: Dv, d },
    };
  }

  function dividendo(rng) {
    const d = rng.entero(6, 25), q = rng.entero(4, 30), re = rng.entero(1, d - 1), Dv = d * (q + 1) - re;
    if (2 * re === d) return null;
    return {
      enunciado: ['Doña Juana empaca unos caramelos en bolsitas de ', Ev(d), '. Llena ', String(q), ' bolsitas, y para llenar una más le', faltan(re), Bv(re), '.'],
      pregunta: ['¿Cuántos caramelos empaca?'],
      datos: [D.div, D.exceso, D.letrasDiv],
      correcta: Dv,
      errores: [
        h('AT-EXCESO-RESTA', d * q - re, `Bien restar lo que falta. Pero desde ${d} × ${q + 1}, las bolsitas con la que falta llenar: desde ${d} × ${q} sale ${f0(d * q - re)}.`),
        h('AT-EXCESO-MAS', d * (q + 1) + re, `Bien usar ${q + 1} bolsitas. Pero lo que falta no está: se resta. Sumando sale ${f0(d * (q + 1) + re)}.`),
        h('AT-EXCESO-CAMBIA', d * q + re, `Bien ${d} × ${q}. Pero ${re} es lo que falta, no lo que sobra: así sale ${f0(d * q + re)}.`),
      ],
      solucion: [
        ['Con una bolsita más serían ', Ev(d), ` × ${q + 1} = ${f0(d * (q + 1))}, y`, faltan(re), Bv(re), '.'],
        ['D = ', Ev(d), ` × ${q + 1} − `, Bv(re), ` = ${f0(Dv)} caramelos.`],
      ],
      _datos: { d, q, re },
    };
  }

  const VECES = { 2: 'doble', 3: 'triple', 4: 'cuádruple' };
  function restos(rng) {
    const k = rng.entero(2, 4), re = rng.entero(2, 8), d = (k + 1) * re, r = k * re;
    const mitad = d % 2 === 0 && d / 2 !== r ? d / 2 : undefined;
    return {
      enunciado: ['Al empacar unos caramelos en bolsitas de ', Ev(d), ', los que sobran son el ', VECES[k], ' de los que faltan para llenar otra bolsita.'],
      pregunta: ['¿Cuántos caramelos sobran?'],
      datos: [D.div, D.exceso, D.letrasDiv],
      correcta: r, texto: x => String(x),
      errores: [
        h('AT-EXCESO-CAMBIA', re, `Bien repartir la bolsita en partes. Pero ${re} es lo que falta; lo que sobra es el ${VECES[k]}.`),
        h('AT-RESTO-MAX', d - 1, `Bien: ${d - 1} es lo más que puede sobrar. Pero aquí lo que sobra y lo que falta guardan una relación.`),
        mitad && h('AT-RESTO-MITAD', mitad, `Bien que lo que sobra y lo que falta llenan una bolsita. Pero ${mitad} sería si fueran iguales.`),
        h('AT-EXCESO-SUMA', d + re, `Bien hallar lo que falta, ${re}. Pero lo que sobra no es ${d} + ${re} = ${d + re}: nunca pasa de una bolsita.`),
      ],
      solucion: [
        ['Lo que sobra y lo que falta llenan justo una bolsita: ', Mv('r'), ' + ', Bv('rₑ'), ' = ', Ev(d), '.'],
        [`Con `, Mv('r'), ` = ${k} × `, Bv('rₑ'), `: ${k + 1} × `, Bv('rₑ'), ' = ', Ev(d), ', así que ', Bv('rₑ'), ' = ', Bv(re), ' y ', Mv('r'), ' = ', Mv(r), '.'],
      ],
      _datos: { d, k },
    };
  }

  function dosRepartos(rng) {
    const x = rng.entero(4, 12), p = rng.entero(3, 9), e = rng.entero(2, 3), a = rng.entero(1, x - 1), b = e * x - a, N = p * x + a;
    // Quien resta lo que sobra de lo que falta suele dividir después entre lo que se da de más.
    const resta = b > a && (b - a) % e === 0 ? (b - a) / e : Math.abs(b - a);
    return {
      enunciado: ['Doña Juana reparte sus caramelos entre sus sobrinos. Si da ', String(p), ' a cada uno, le', sobran(a), Mv(a), '; si da ', String(p + e), ' a cada uno, le', faltan(b), Bv(b), '.'],
      pregunta: ['¿Cuántos sobrinos tiene?'],
      datos: [D.reparto, D.repartoFalta],
      correcta: x, texto: y => String(y),
      errores: [
        h('AT-REPARTO-SIN-DIVIDIR', a + b, `Bien juntar lo que sobra y lo que falta: ${a + b}. Pero cada sobrino recibe ${e} más, no 1: hay que dividir.`),
        h('AT-REPARTO-TOTAL', N, `Bien: tiene ${N} caramelos. Pero se pide cuántos sobrinos son.`),
        resta && resta !== x && h('AT-REPARTO-RESTA', resta, `Bien usar lo que sobra y lo que falta. Pero se juntan, no se restan: restando sale ${resta}.`),
      ],
      solucion: [
        ['Los caramelos son los mismos: sobrinos × ', String(p), ' + ', Mv(a), ' = sobrinos × ', String(p + e), ' − ', Bv(b), '.'],
        ['Dar ', String(e), ' más a cada uno pide ', Mv(a), ' + ', Bv(b), ` = ${a + b} caramelos: sobrinos = ${a + b} ÷ ${e} = `, Ev(x), '.'],
      ],
      _datos: { p, e, sobran: a, faltan: b },
    };
  }

  function unoMas(rng) {
    const x = rng.entero(5, 12), p = rng.entero(3, 9), a = rng.entero(1, x - 1), b = x - a, N = p * x + a;
    return {
      enunciado: ['Doña Juana da ', String(p), ' caramelos a cada nieto y le', sobran(a), Mv(a), '. Para darles ', String(p + 1), ' a cada uno, le', b === 1 ? ' faltaría ' : ' faltarían ', Bv(b), '.'],
      pregunta: ['¿Cuántos caramelos tiene?'],
      datos: [D.div, D.exceso, 'Aquí d son los nietos y q lo que recibe cada uno'],
      correcta: N,
      errores: [
        h('AT-REPARTO-CUENTA', x, `Bien: son ${x} nietos. Pero se piden los caramelos.`),
        h('AT-REPARTO-NUEVO', (p + 1) * x, `Bien: con ${p + 1} a cada uno harían falta ${(p + 1) * x}. Pero le${faltan(b)}${b}: tiene menos.`),
        h('AT-REPARTO-SIN-RESTO', p * x, `Bien repartir ${p} a cada uno: ${p * x}. Pero falta sumar ${a === 1 ? 'el que sobra' : `los ${a} que sobran`}.`),
      ],
      solucion: [
        ['Dar 1 más a cada uno pide lo que sobra más lo que falta: ', Mv(a), ' + ', Bv(b), ' = ', Ev(x), ' nietos.'],
        ['D = ', Ev(x), ` × ${p} + `, Mv(a), ` = ${N} caramelos.`],
      ],
      _datos: { p, sobran: a, faltan: b },
    };
  }

  // ======================= Idea 7: ¿cabe el producto en la pantalla? =======================

  const dos = (lo, hi) => `${lo} o ${hi} cifras`;
  const siempre = k => `siempre ${k} ${k === 1 ? 'cifra' : 'cifras'}`;
  const rango = (lo, hi) => `de ${lo} a ${hi} cifras`;

  function producto(rng) {
    const p = rng.entero(2, 5), q = rng.entero(2, 4);
    if (p * q === p + q) return null;
    const lo = p + q - 1, hi = p + q;
    return {
      enunciado: ['En su calculadora, doña Juana multiplica un número A de ', String(p), ' cifras por un número B de ', String(q), ' cifras.'],
      pregunta: ['¿Cuántas cifras puede tener A × B?'],
      datos: [D.rango, D.potProd],
      correctaTexto: dos(lo, hi),
      errores: [
        ht('AT-COTA-MAX', siempre(hi), `Bien el caso mayor: ${hi} cifras. Pero con los menores, ${10 ** (p - 1)} × ${10 ** (q - 1)}, sale una menos: «${siempre(hi)}» no va.`),
        ht('AT-COTA-MIN', siempre(lo), `Bien el caso menor: ${lo} cifras. Pero con los mayores sale una más: «${siempre(lo)}» no va.`),
        ht('AT-COTA-MULT', dos(p * q - 1, p * q), `Bien mirar dos casos. Pero las cifras no se multiplican: «${dos(p * q - 1, p * q)}» no sale de ningún producto.`),
      ],
      solucion: [
        ['El menor: ', `${f0(10 ** (p - 1))} × ${f0(10 ** (q - 1))} = 10`, sup(lo - 1), ', de ', Bv(lo), ' cifras.'],
        ['El mayor no llega a ', `10${sup(p)} × 10${sup(q)} = 10${sup(hi)}`, ': tiene ', Bv(hi), ' cifras. A × B tiene ', Bv(dos(lo, hi)), '.'],
      ],
      _datos: { p, q },
    };
  }
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sup = k => [...String(k)].map(c => SUP[c]).join('');

  function cociente(rng) {
    const p = rng.entero(5, 8), q = rng.entero(2, 4);
    if (p - q < 2) return null;
    const lo = p - q, hi = p - q + 1;
    return {
      enunciado: ['En su calculadora, doña Juana divide un número A de ', String(p), ' cifras entre un número B de ', String(q), ' cifras y se queda con el cociente entero.'],
      pregunta: ['¿Cuántas cifras puede tener ese cociente?'],
      datos: [D.rango, D.potDiv],
      correctaTexto: dos(lo, hi),
      errores: [
        ht('AT-COTA-RESTA', siempre(lo), `Bien restar las cifras: ${p} − ${q} = ${lo}. Pero con A grande y B chico sale una más: «${siempre(lo)}» no va.`),
        ht('AT-COTA-MAX', siempre(hi), `Bien el caso mayor. Pero con A chico y B grande sale una menos: «${siempre(hi)}» no va.`),
        ht('AT-COTA-PRODUCTO', dos(p + q - 1, p + q), `Bien mirar dos casos. Pero «${dos(p + q - 1, p + q)}» es la regla del producto; al dividir, las cifras se restan.`),
      ],
      solucion: [
        ['El menor cociente: A lo más chico y B lo más grande, ', `${f0(10 ** (p - 1))} ÷ ${f0(10 ** q - 1)}`, ', da ', Bv(lo), ' cifras.'],
        ['El mayor: A lo más grande y B lo más chico, ', `${f0(10 ** p - 1)} ÷ ${f0(10 ** (q - 1))}`, ', da ', Bv(hi), ' cifras. El cociente tiene ', Bv(dos(lo, hi)), '.'],
      ],
      _datos: { p, q },
    };
  }

  function cifrasFactor(rng) {
    const p = rng.entero(2, 4), c = rng.entero(p + 2, 9);
    const lo = c - p, hi = c - p + 1;
    if (lo === p) return null;
    return {
      enunciado: ['En la calculadora de doña Juana, el producto A × B tiene ', Bv(c), ' cifras, y A tiene ', String(p), '.'],
      pregunta: ['¿Cuántas cifras puede tener B?'],
      datos: [D.rango, D.potProd],
      correctaTexto: dos(lo, hi),
      errores: [
        ht('AT-COTA-SUMA', dos(c + p - 1, c + p), `Bien mirar dos casos. Pero «${dos(c + p - 1, c + p)}» suma las cifras; aquí se busca un factor y se restan.`),
        ht('AT-COTA-RESTA', siempre(lo), `Bien restar: ${c} − ${p} = ${lo}. Pero el producto puede tener una cifra menos que la suma: «${siempre(lo)}» no va.`),
        ht('AT-COTA-MAX', siempre(hi), `Bien el caso en que el producto tiene una cifra menos. Pero también puede tener la suma justa: «${siempre(hi)}» no va.`),
      ],
      solucion: [
        ['Si B tiene k cifras, A × B tiene ', `${p} + k − 1 o ${p} + k cifras.`],
        [`${p} + k = ${c} da k = ${lo}; ${p} + k − 1 = ${c} da k = ${hi}. B tiene `, Bv(dos(lo, hi)), '.'],
      ],
      _datos: { p, c },
    };
  }

  function potencias(rng) {
    const p = rng.entero(2, 4), q = rng.entero(2, 4), lo = 2 * p + 3 * q - 4, hi = 2 * p + 3 * q;
    return {
      enunciado: ['A es un número de ', String(p), ' cifras y B, uno de ', String(q), ' cifras. Doña Juana calcula A² × B³.'],
      pregunta: ['¿Cuántas cifras puede tener A² × B³, como mínimo y como máximo?'],
      datos: [D.rango, D.cuadradoCubo, D.potProd],
      correctaTexto: rango(lo, hi),
      errores: [
        ht('AT-COTA-UNA', rango(hi - 1, hi), `Bien el caso mayor: ${hi} cifras. Pero al juntar 5 factores, el menor puede tener hasta 4 cifras menos: «${rango(hi - 1, hi)}» no va.`),
        ht('AT-COTA-EXPONENTE', rango(p + q - 1, p + q), `Bien la regla del producto. Pero «${rango(p + q - 1, p + q)}» es A × B; los exponentes repiten factores.`),
        ht('AT-COTA-MAX', siempre(hi), `Bien el caso mayor. Pero con A y B lo más chicos salen menos cifras: «${siempre(hi)}» no va.`),
      ],
      solucion: [
        ['El menor: A = ', `10${sup(p - 1)}`, ' y B = ', `10${sup(q - 1)}`, `: A² × B³ = 10${sup(lo - 1)}, de `, Bv(lo), ' cifras.'],
        ['El mayor no llega a ', `10${sup(2 * p)} × 10${sup(3 * q)} = 10${sup(hi)}`, ': tiene ', Bv(hi), ' cifras. A² × B³ tiene ', Bv(rango(lo, hi)), '.'],
      ],
      _datos: { p, q },
    };
  }

  const CONSTRUIR = {
    suma, varios, 'suma-base': sumaBase, 'cuanto-lleva': cuantoLleva, 'base-cuadra': baseCuadra,
    resta, ceros, 'resta-base': restaBase, aperturas, 'suma-tres': sumaTres,
    ca, 'ceros-finales': cerosFinales, 'ca-base': caBase, 'ca-oculto': caOculto,
    'mancha-suma': manchaSuma, 'mancha-dos': manchaDos, 'mancha-resta': manchaResta, reverso,
    'por-cifra': porCifra, 'cuanto-sube': cuantoSube, 'factor-falta': factorFalta, 'por-cifra-base': porCifraBase, 'los-dos': losDos,
    exceso, dividendo, restos, 'dos-repartos': dosRepartos, 'uno-mas': unoMas,
    producto, cociente, 'cifras-factor': cifrasFactor, potencias,
  };

  return { id: ID, titulo: 'El cuaderno de las cuentas', generar, TIPOS_POR_IDEA, TIPOS_POR_UNIDAD, NIVEL };
});
