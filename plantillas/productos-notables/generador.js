/*
 * Generador «Productos notables»: la práctica de las cinco ideas de algebra.productos-notables
 * (contenido/teoria/algebra/productos-notables.js). Formato "predicciones" (docs/arquitectura.md). Funciona en el
 * navegador (window.Generadores['productos-notables']) y en Node (require). No usa ningún motor: las cuentas son
 * productos de enteros chicos y raíces exactas o de enteros sin cuadrados.
 *
 * Propuesta aprobada: docs/etapa3/propuesta-algebra-exponentes.md §7 y §9 (pregunta 6: una plantilla «predicciones»
 * por unidad) y docs/etapa3/decisiones.md (Álgebra, rondas 2 a 4). Objetos, como en la teoría: el terreno de Juan en
 * Juliaca (idea 1), el triplay de la carpintería (idea 2), el taco de madera (idea 3), la mesa de cuatro planchas (idea
 * 4) y la cometa de agosto en Puno (idea 5). Valores de problema, sin fuente: terrenos de 6 a 14 m con franjas de 1 a 4
 * m, planchas de 8 a 15 dm, tacos de hasta 10 dm de arista, planchas de mesa de hasta 12 dm², varillas de 2 a 9 m.
 *
 * Tipos por idea (TIPOS_POR_IDEA; nivel 1 un paso, 2 dos pasos, 3 de examen). generar(semilla, { idea }) da solo los
 * de esa idea; sin idea, las cinco con el mismo peso.
 *   cuadrado-suma        desarrolla (1; sub suma o resta) (px ± k)² · terreno (1; sub total o compra) el terreno de
 *                        Juan con dos franjas · numero (2; sub suma o resta) N² sin la multiplicación larga ·
 *                        completar (2; sub suma o resta) x² ± kx + □ como cuadrado · suma-producto (2; sub suma o
 *                        diferencia) a² + b² con a ± b y ab · inverso (3; sub suma o resta) x² + 1/x² con x ± 1/x ·
 *                        figura (3) el lado de un cuadrado partido en dos cuadrados y dos rectángulos, como San
 *                        Marcos 2025-I (áreas D y E, pregunta 35; docs/datos/admision-unmsm.csv), con figura
 *   suma-por-diferencia  cercanos (1) N₁ · N₂ = (M + d)(M − d) · triplay (1) la plancha sin una esquina ·
 *                        suma-diferencia (2) (px + k)(px − k) · xpq (2) (x + p)(x + q) con signos · legendre (3; sub
 *                        ab o cuartas) ab con a ± b, y (a + b)⁴ − (a − b)⁴ con ab y a² + b², como San Marcos 2026-I
 *                        (área A, 40) · cambio-variable (3) (x + a)(x + b)(x + c)(x + d) con x² + sx dado, como San
 *                        Marcos 2024-I (áreas D y E, 39) · sextas (3) a³ con a³ − b³ y a⁶ − b⁶, como San Marcos
 *                        2025-I (áreas B y C, 42)
 *   cubo-binomio         desarrolla-cubo (1; sub suma o resta) (x ± k)³ · taco (1) la madera de las seis piezas que
 *                        no son cubos · numero-cubo (2; sub suma o resta) N³ · coeficiente (2; sub x2 o x) un término de
 *                        (px + k)³ · suma-producto-cubo (3; sub suma o diferencia) a³ ± b³ con a ± b y ab, como San
 *                        Marcos 2024-I (áreas B y C, 42) · factoriza-cubos (3) (px)³ ± k³
 *   radicales-dobles     mesa (1; sub area o lado) la mesa de cuatro planchas · simple (1) √(A + 2√B) · resta (2)
 *                        √(A − 2√B) · sin-dos (2; sub sin2 o coef) √(A + √C) y √(A + k√M) · suma-dobles (3) √(A + 2√B)
 *                        ± √(A − 2√B) · coef-resta (3) √(A − k√M)
 *   racionalizar         cometa (1) el lado d/√2 de la cometa · una-raiz (1) K/√A · conjugado (2; sub raices o
 *                        entero) K/(√A ± √B) y K/(√A ± c) · cubica (2) K/³√A · dos-fracciones (3) 1/(√A − √B) ±
 *                        1/(√A + √B) · inverso-rac (3; sub suma o resta) x ± 1/x con x = 1/(√A − √B)
 *
 * Notación: «·» multiplica; potencias con superíndice Unicode (x², a³); la raíz cúbica con el índice en superíndice
 * delante (³√4, no «∛», que en el celular sale con otra letra), como en exponentes-radicales; el signo menos
 * tipográfico «−». Las alternativas son texto plano; una fracción con raíces se escribe «3√2/2» o «(√7 + √3)/2».
 * Colores: un color fijo por magnitud, el de la teoría (cabecera de productos-notables.js; docs/molde-unidad.md §5b): el
 * primer término a naranja (a, o), el segundo b turquesa (b, i), las piezas del medio que se olvidan (2ab, 3a²b, las
 * planchas rectangulares) violeta (M, f) y el resultado violeta (R, f); los dos violetas, solo en la solución, como el
 * factor que vale 1 al racionalizar (U, f). La base, el total, ab² y lo que se pide van en tinta. El índice de una raíz
 * cúbica lleva su ficha de color (n, turquesa, como en exponentes-radicales; nunca junto a b). Ni carmín ni verde.
 * Datos (docs/plan-calidad.md §3, punto 13): las identidades como fórmula general, las áreas y volúmenes, la diagonal del
 * cuadrado; nunca el paso hecho ni la respuesta.
 * Errores: los códigos de la teoría (AL8 y AL9 parciales; AL11 hipótesis, de docs/investigacion/algebra-funciones-
 * ideas-erroneas.md; los TAL-*, hipótesis de diseño de la teoría). Nuevos aquí (hipótesis): TAL-ESQUINA-DOBLE cuenta la
 * esquina en las dos franjas · TAL-ESQUINA-LADO pone el lado de la esquina y no su área · TAL-PN-COPIA repite el
 * coeficiente del medio · TAL-PN-CUATRO quita o suma 4ab en vez de 2ab · TAL-DIFCUAD-DOBLE quita dos esquinas ·
 * TAL-SXD-CUAD toma lo que queda como un cuadrado de lado a − b · TAL-XPQ-DOBLE pone el doble en el término del medio ·
 * TAL-CV-SINY deja solo los números del cambio de variable · TAL-CV-SUMA suma los dos factores en vez de multiplicarlos ·
 * TAL-LEG-SUMA toma (a + b)² + (a − b)² como a² + b² · TAL-SEXTA-SUMA da a³ + b³ · TAL-SEXTA-MITAD no divide entre 2 ·
 * TAL-SEXTA-OTRO da b³ · TAL-CUBO-SEIS cuenta seis piezas iguales en el medio · TAL-CUBO-SINCUAD no eleva b al cuadrado
 * · TAL-CUBO-MEDIO da las piezas del medio y no lo que queda · TAL-CUBO-DOS usa la fórmula del cuadrado para los cubos ·
 * TAL-CUBO-CRUZA usa la fórmula de la suma de cubos para la diferencia (o al revés) · TAL-RD-AREA multiplica las áreas
 * y no los lados · TAL-RD-LADO da el lado de la plancha rectangular · TAL-RAC-PARCIAL se queda en x · TAL-RAC-NUM se
 * olvida del numerador · TAL-RAC-DIAG toma la varilla (la diagonal) como el lado. De todos los errores de un problema
 * van 3 o 4, elegidos para que la correcta no quede en el centro ni en un extremo (elegirErrores). Cada explicación empieza por lo que el alumno hizo bien y muestra lo que da su error; ninguna nombra
 * una alternativa por su letra.
 * La práctica no repite ninguna Predice de la unidad (Ejercicios se abre sin pasar por ella): ni el terreno de 7 m que
 * cede franjas de 2 m, ni 31 · 29, ni a + b = 7 con ab = 10, ni √(7 − 2√12), ni 1/(√5 − √3).
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
  const ID = 'productos-notables';
  const INV = 'docs/investigacion/algebra-funciones-ideas-erroneas.md';
  const TEO = 'contenido/teoria/algebra/productos-notables.js';
  const v = P.v;
  // Miles con espacio que no se parte (en el celular, «1 024» no queda en dos renglones).
  const f = (x, d = 0) => P.formatear(x, d).replace(/ /g, '\u00a0');

  // ---- Escritura ----
  const SUPS = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  const sup = s => [...String(s)].map(c => SUPS[c]).join('');
  const z = x => (x < 0 ? `−${-x}` : String(x));
  const sg = x => (x < 0 ? '−' : '+');
  const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; };
  const esCuad = k => k >= 0 && Number.isInteger(Math.sqrt(k));
  const r3 = k => `³√${k}`;                                              // raíz cúbica escrita con el índice delante
  // El mayor c con c² que divide a n.
  const mayorCuad = n => { let c = 1; for (let k = 2; k * k <= n; k++) if (n % (k * k) === 0) c = k; return c; };
  // c√k ya simplificada (2√3, √5, 6).
  // Radicando limpio: un cuadrado o sin factores cuadrados (√8 se escribiría 2√2).
  const limpio = k => esCuad(k) || mayorCuad(k) === 1;
  const simp = (c, k) => { const q = mayorCuad(k); c *= q; k /= q * q; return k === 1 ? String(c) : `${c === 1 ? '' : c}√${k}`; };
  const rz = k => simp(1, k);                                            // √k simplificada: √5, 2√2, 3
  // Un término con su coeficiente: 1·x² → «x²», 4·x² → «4x²».
  const ct = (c, x) => (c === 1 ? x : `${c}${x}`);
  // Polinomio con sus signos: [3, −2, 5] → «3x² − 2x + 5» (de mayor a menor grado; los 0 no van).
  function poli(cs, x = 'x') {
    const g = cs.length - 1, pot = n => (n === 0 ? '' : n === 1 ? x : `${x}${sup(n)}`);
    let t = '';
    cs.forEach((c, i) => {
      if (!c) return;
      const n = g - i, m = Math.abs(c), cuerpo = n === 0 ? String(m) : `${m === 1 ? '' : m}${pot(n)}`;
      t += t ? ` ${c < 0 ? '−' : '+'} ${cuerpo}` : `${c < 0 ? '−' : ''}${cuerpo}`;
    });
    return t || '0';
  }
  const pl = (k, uno, varios) => (k === 1 ? uno : varios);

  const VARS = {
    a: { nombre: 'el primer término', color: 'o' }, b: { nombre: 'el segundo término', color: 'i' },
    M: { nombre: 'las piezas del medio', color: 'f' }, U: { nombre: 'el factor que vale 1', color: 'f' },
    n: { nombre: 'el índice', color: 'i' }, R: { nombre: 'el resultado', color: 'f' },
  };
  const NOMBRES_IDEA = {
    'radicales-dobles': { a: 'x, el primer número', b: 'y, el segundo número', M: 'las planchas del medio' },
    racionalizar: { a: 'el primer radicando', b: 'el segundo término' },
  };
  const Ta = t => v('a', t), Tb = t => v('b', t), Tm = t => v('M', t), Tu = t => v('U', t), Tn = t => v('n', t), Tr = t => v('R', t);

  // ---- Errores: el respaldo sale del código ----
  const RESPALDO = { AL8: ['parcial', INV], AL9: ['parcial', INV], AL11: ['hipotesis', INV] };
  const de = id => RESPALDO[id] || ['hipotesis', TEO];
  // Error de texto (la clave es el texto, ya canónico): explicar(texto) → explicación.
  function e(id, texto, explicar) {
    const [respaldo, fuente] = de(id);
    return { id, clave: texto, texto, explicacion: explicar(texto), respaldo, fuente };
  }
  // Error numérico de armar.
  function en(id, valor, fmt, explicar) {
    const [respaldo, fuente] = de(id);
    return { id, valor, texto: fmt(valor), explicacion: explicar(fmt(valor)), respaldo, fuente };
  }

  // ---- Datos que se repiten (herramientas, no el paso hecho) ----
  const D = {
    cuad: '(a + b)² = a² + 2ab + b²',
    cuadR: '(a − b)² = a² − 2ab + b²',
    area: 'Área de un cuadrado = lado · lado',
    rect: 'Área de un rectángulo = largo · ancho',
    lado: 'Lado de un cuadrado = √(su área)',
    inv: 'x · (1/x) = 1, con x ≠ 0',
    sxd: '(a + b)(a − b) = a² − b²',
    xpq: '(x + p)(x + q) = x² + (p + q)x + pq',
    pot4: 'a⁴ = (a²)²',
    cubo: '(a + b)³ = a³ + 3a²b + 3ab² + b³',
    cuboR: '(a − b)³ = a³ − 3a²b + 3ab² − b³',
    sumaC: 'a³ + b³ = (a + b)(a² − ab + b²)',
    difC: 'a³ − b³ = (a − b)(a² + ab + b²)',
    vol: 'Volumen de una caja = largo · ancho · alto',
    rd: '√(A + 2√B) = √x + √y, si x + y = A y x · y = B',
    rdm: '√(A − 2√B) = √x − √y, con x mayor que y',
    meter: 'k√M = √(k² · M), con k positivo',
    prod: '√x · √y = √(xy)',
    uno: '√a · √a = a',
    conj: '(√a + √b)(√a − √b) = a − b',
    conjN: '(√a + c)(√a − c) = a − c²',
    cubica: '(³√a)³ = ³√a · ³√a · ³√a = a',
    prodC: '³√a · ³√b = ³√(ab)',
    diag: 'Diagonal de un cuadrado = lado · √2',
  };

  // ---- Tipos por idea ----
  const TIPOS_POR_IDEA = {
    'cuadrado-suma': ['desarrolla', 'terreno', 'numero', 'completar', 'suma-producto', 'inverso', 'figura'],
    'suma-por-diferencia': ['cercanos', 'triplay', 'suma-diferencia', 'xpq', 'legendre', 'cambio-variable', 'sextas'],
    'cubo-binomio': ['desarrolla-cubo', 'taco', 'numero-cubo', 'coeficiente', 'suma-producto-cubo', 'factoriza-cubos'],
    'radicales-dobles': ['mesa', 'simple', 'resta', 'sin-dos', 'suma-dobles', 'coef-resta'],
    racionalizar: ['cometa', 'una-raiz', 'conjugado', 'cubica', 'dos-fracciones', 'inverso-rac'],
  };
  const IDEAS = Object.keys(TIPOS_POR_IDEA);
  const IDEA_DE = Object.fromEntries(IDEAS.flatMap(i => TIPOS_POR_IDEA[i].map(t => [t, i])));
  const NIVEL = {
    desarrolla: 1, terreno: 1, numero: 2, completar: 2, 'suma-producto': 2, inverso: 3, figura: 3,
    cercanos: 1, triplay: 1, 'suma-diferencia': 2, xpq: 2, legendre: 3, 'cambio-variable': 3, sextas: 3,
    'desarrolla-cubo': 1, taco: 1, 'numero-cubo': 2, coeficiente: 2, 'suma-producto-cubo': 3, 'factoriza-cubos': 3,
    mesa: 1, simple: 1, resta: 2, 'sin-dos': 2, 'suma-dobles': 3, 'coef-resta': 3,
    cometa: 1, 'una-raiz': 1, conjugado: 2, cubica: 2, 'dos-fracciones': 3, 'inverso-rac': 3,
  };

  // Papel (regla 6; herramientas/papel-generador.js usa «papel-1» a «papel-8» y rotula 3 básicos, 3 intermedios y 2
  // avanzados): las cinco ideas, de menos a más, con dos preguntas de San Marcos al final.
  const PAPEL = { 'papel-1': ['desarrolla', 'suma'], 'papel-2': ['cercanos'], 'papel-3': ['simple'],
    'papel-4': ['numero-cubo', 'suma'], 'papel-5': ['conjugado', 'entero'], 'papel-6': ['completar', 'resta'],
    'papel-7': ['suma-producto-cubo', 'suma'], 'papel-8': ['legendre', 'ab'] };

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
    throw new Error(`${ID}: no se pudo generar un problema de ${tipo} con 4 alternativas distintas`);
  }

  // Qué errores van. Cada uno muestra lo que da un error real, pero si todos cambian una sola pieza de la correcta, la
  // correcta queda en el centro y se adivina sin resolver (probarFugas, nucleo/probar-generador.js). Por eso, de todos
  // los errores posibles se eligen 4 (o 3) con los que la correcta no es la más parecida a las demás ni, si es un
  // número, la mayor o la menor. La distancia es la de probarFugas: los textos partidos en números, letras y signos.
  const trozos = t => String(t).replace(/[()]/g, ' ').split(/[\s;,]+|(?=[+−\-·/])|(?<=[+−\-·/])/).filter(Boolean);
  const distancia = (a, b) => { const A = trozos(a), B = trozos(b); let d = 0; for (let i = 0; i < Math.max(A.length, B.length); i++) if (A[i] !== B[i]) d++; return d; };
  function subconjuntos(l, k) {
    if (k === 0) return [[]];
    const r = [];
    for (let i = 0; i <= l.length - k; i++) for (const resto of subconjuntos(l.slice(i + 1), k - 1)) r.push([l[i], ...resto]);
    return r;
  }
  function elegirErrores(rng, correcta, errores, numero) {
    const vistos = new Set([correcta.texto]), pool = [];
    for (const x of rng.barajar(errores)) if (!vistos.has(x.texto)) { vistos.add(x.texto); pool.push(x); }
    const bueno = sub => {
      const al = [correcta, ...sub], sc = al.map(a => al.reduce((t, b) => t + distancia(a.texto, b.texto), 0));
      const min = Math.min(...sc);
      if (sc[0] === min && sc.filter(x => x === min).length === 1) return false;
      if (numero) { const vs = al.map(a => a.valor); if (correcta.valor === Math.max(...vs) || correcta.valor === Math.min(...vs)) return false; }
      return true;
    };
    for (const k of [4, 3]) for (const sub of subconjuntos(pool, Math.min(k, pool.length))) if (sub.length >= 3 && bueno(sub)) return sub;
    return pool.slice(0, 4);
  }

  // Arma las alternativas y el problema. Variables: solo las que se usan.
  function cerrar(rng, semilla, tipo, o) {
    let alternativas, respuesta;
    if (typeof o.correcta === 'string') {
      const errores = elegirErrores(rng, { texto: o.correcta }, o.errores.filter(Boolean), false);
      alternativas = P.armarTexto({ correcta: { clave: o.correcta, texto: o.correcta }, errores, rng });
      respuesta = { valor: o.correcta, texto: o.correcta, unidad: '' };
    } else {
      const validos = o.errores.filter(x => x && Number.isFinite(x.valor) && x.valor > 0 && x.valor !== o.correcta && P.enEscala(x.valor, o.correcta, x.id));
      const errores = elegirErrores(rng, { texto: o.fmt(o.correcta), valor: o.correcta }, validos, true);
      alternativas = P.armar({ correcta: o.correcta, errores, rng, texto: o.fmt });
      respuesta = { valor: o.correcta, unidad: o.unidad || '' };
    }
    if (alternativas.length < 4) return null;
    const usadas = new Set();
    for (const linea of [o.enunciado, o.pregunta, ...o.solucion]) for (const x of linea) if (x && typeof x === 'object') usadas.add(x.v);
    const nombres = Object.assign({}, NOMBRES_IDEA[IDEA_DE[tipo]], o.nombres);
    const variables = Object.fromEntries([...usadas].map(k => [k, Object.assign({}, VARS[k], nombres[k] ? { nombre: nombres[k] } : {})]));
    const p = {
      id: `${ID}#${semilla}`, variables, enunciado: o.enunciado, pregunta: o.pregunta, datos: o.datos,
      alternativas, solucion: o.solucion, respuesta,
      _datos: Object.assign({ idea: IDEA_DE[tipo], tipo, nivel: NIVEL[tipo] }, o._datos),
    };
    if (o.figura) p.figura = o.figura;
    return p;
  }

  // Letras de las identidades con su color: a naranja y b turquesa.
  const LA = () => Ta('a'), LB = () => Tb('b');

  // ======================= Idea 1: el cuadrado de una suma =======================

  function desarrolla(rng, forzado) {
    const sub = forzado || rng.elegir(['suma', 'resta']);
    const p = rng.elegir([1, 1, 2, 3]), k = rng.entero(2, 9), x = ct(p, 'x'), s = sub === 'suma' ? 1 : -1, S = sg(s);
    const cs = [p * p, 2 * p * k * s, k * k], x2 = ct(p * p, 'x²'), dx = ct(2 * p * k, 'x');
    const err = (id, c, ex) => e(id, poli(c), ex);
    return {
      enunciado: ['Se tiene el cuadrado (', Ta(x), ` ${S} `, Tb(k), ')².'],
      pregunta: ['¿A qué es igual, desarrollado?'],
      datos: [sub === 'suma' ? D.cuad : D.cuadR],
      correcta: poli(cs),
      errores: [
        err('AL8', [p * p, 0, s * k * k], t => `Bien los dos cuadrados, ${x2} y ${k * k}. Pero faltan las dos piezas del medio, 2 · ${x} · ${k}; sin ellas queda ${t}.`),
        s < 0 && err('AL8', [p * p, 0, k * k], t => `Bien los dos cuadrados, y que la esquina ${k * k} vaya con +. Pero falta el doble producto, 2 · ${x} · ${k}, que se resta; sin él queda ${t}.`),
        err('TAL-2AB', [p * p, s * p * k, k * k], t => `Bien que pongas el producto ${x} · ${k}. Pero son dos piezas del medio, y va dos veces; con una sola queda ${t}.`),
        sub === 'suma'
          ? err('TAL-ESQUINA', [p * p, 2 * p * k, 0], t => `Bien el doble producto, ${dx}. Pero falta la esquina, ${k}² = ${k * k}; sin ella queda ${t}.`)
          : err('TAL-ESQUINA', [p * p, -2 * p * k, -k * k], t => `Bien restar el doble producto, ${dx}. Pero la esquina ${k}² se suma: al quitar las dos franjas se quitó dos veces; restarla da ${t}.`),
        sub === 'suma'
          ? err('TAL-ESQUINA-DOBLE', [p * p, 2 * p * k, 2 * k * k], t => `Bien el doble producto, ${dx}. Pero la esquina ${k}² = ${k * k} va una sola vez; contarla dos veces da ${t}.`)
          : err('TAL-SIGNO', [p * p, 2 * p * k, k * k], t => `Bien las tres piezas. Pero en una resta el doble producto se quita y va con −; con + queda ${t}.`),
        p > 1 && err('TAL-COEF', [p, 2 * p * k * s, k * k], t => `Bien el doble producto y la esquina. Pero el primer término es ${x}, y su cuadrado es ${x2}, no ${p}x²; así queda ${t}.`),
      ],
      solucion: [
        ['Los dos cuadrados: ', Ta(x2), ' y ', Tb(k * k), '.'],
        ['El doble producto', sub === 'suma' ? ': ' : ', que se resta: ', Tm(`2 · ${x} · ${k} = ${dx}`), '.'],
        ['(', Ta(x), ` ${S} `, Tb(k), ')² = ', Tr(poli(cs)), '.'],
      ],
      _datos: { sub, p, k },
    };
  }

  function terreno(rng, forzado) {
    const sub = forzado || rng.elegir(['total', 'compra']);
    const a = rng.entero(6, 14), b = rng.entero(1, 4);
    if (a === 7 && b === 2) return null;   // las medidas de la predicción de la idea 1
    const fmt = x => `${f(x)} m²`, A2 = a * a, B2 = b * b, AB = a * b;
    const enunciado = ['El terreno cuadrado de Juan, en Juliaca, mide ', Ta(`${a} m`), ' de lado. Compra una franja de ', Tb(`${b} m`),
      ' de ancho por el costado y otra por el fondo, y el terreno sigue cuadrado.'];
    const piezas = ['El terreno nuevo, de lado ', Ta(a), ' + ', Tb(b), `, tiene cuatro piezas: el de antes, ${A2} m²; dos franjas de `, Tm(`${a} · ${b} = ${AB} m²`), ' y la esquina, ', Tb(`${b} · ${b} = ${B2} m²`), '.'];
    if (sub === 'total') {
      const ans = (a + b) ** 2;
      return {
        enunciado, pregunta: ['¿Cuántos m² mide ahora el terreno?'],
        datos: [D.area, D.cuad],
        correcta: ans, fmt,
        errores: [
          en('AL8', A2 + B2, fmt, t => `Bien el terreno de antes, ${A2} m², y la esquina, ${B2} m². Pero faltan las dos franjas de ${a} por ${b}; sin ellas quedan ${t}.`),
          en('TAL-2AB', A2 + AB + B2, fmt, t => `Bien que cuentes una franja de ${AB} m². Pero son dos: el costado y el fondo; con una sola quedan ${t}.`),
          en('TAL-ESQUINA', A2 + 2 * AB, fmt, t => `Bien el terreno de antes y las dos franjas. Pero falta la esquina de ${b} por ${b}; sin ella quedan ${t}.`),
          en('TAL-ESQUINA-DOBLE', A2 + 2 * AB + 2 * B2, fmt, t => `Bien las dos franjas. Pero la esquina de ${B2} m² va una sola vez; contarla en las dos franjas da ${t}.`),
        ],
        solucion: [piezas, [`${A2} + 2 · ${AB} + ${B2} = ${(a + b) ** 2}: el terreno mide `, Tr(fmt(ans)), `, que es ${a + b} · ${a + b}.`]],
        _datos: { sub, a, b },
      };
    }
    const ans = 2 * AB + B2;
    return {
      enunciado, pregunta: ['¿Cuántos m² compra?'],
      datos: [D.area, D.cuad],
      correcta: ans, fmt,
      errores: [
        en('TAL-ESQUINA', 2 * AB, fmt, t => `Bien las dos franjas de ${a} por ${b}. Pero también compra la esquina de ${b} por ${b}; sin ella salen ${t}.`),
        en('TAL-2AB', AB + B2, fmt, t => `Bien la franja de ${AB} m² y la esquina. Pero las franjas son dos: el costado y el fondo; con una sola salen ${t}.`),
        en('TAL-ESQUINA-DOBLE', 2 * AB + 2 * B2, fmt, t => `Bien las dos franjas. Pero la esquina de ${B2} m² se compra una sola vez; contarla dos veces da ${t}.`),
        en('AL8', B2, fmt, t => `Bien la esquina de ${b} por ${b}. Pero compra también las dos franjas; solo la esquina son ${t}.`),
      ],
      solucion: [piezas, ['Compra lo nuevo, las dos franjas y la esquina: ', `2 · ${AB} + ${B2} = `, Tr(fmt(ans)), '.']],
      _datos: { sub, a, b },
    };
  }

  function numero(rng, forzado) {
    const sub = forzado || rng.elegir(['suma', 'resta']);
    const M = rng.elegir([20, 30, 40, 50, 60, 70, 80, 90, 100]), d = rng.entero(1, 4), s = sub === 'suma' ? 1 : -1, N = M + s * d, S = sg(s);
    const fmt = x => f(x), M2 = M * M, d2 = d * d, Md = M * d, ans = N * N;
    return {
      enunciado: [`Se quiere calcular ${N}² sin hacer la multiplicación larga.`],
      pregunta: ['¿Cuánto vale?'],
      datos: [sub === 'suma' ? D.cuad : D.cuadR],
      correcta: ans, fmt,
      errores: [
        en('AL8', M2 + s * d2, fmt, t => `Bien ${M}² = ${f(M2)} y ${d}² = ${d2}. Pero falta el doble producto, 2 · ${M} · ${d} = ${2 * Md}; sin él sale ${t}.`),
        en('TAL-2AB', M2 + s * Md + d2, fmt, t => `Bien el producto ${M} · ${d} = ${Md}. Pero va dos veces, el doble producto; con una sola vez sale ${t}.`),
        s > 0
          ? en('TAL-ESQUINA', M2 + 2 * Md, fmt, t => `Bien ${M}² y el doble producto, ${2 * Md}. Pero falta la esquina, ${d}² = ${d2}; sin ella sale ${t}.`)
          : en('TAL-ESQUINA', M2 - 2 * Md - d2, fmt, t => `Bien restar el doble producto, ${2 * Md}. Pero la esquina ${d}² se suma; restarla da ${t}.`),
        s > 0
          ? en('TAL-ESQUINA-DOBLE', M2 + 2 * Md + 2 * d2, fmt, t => `Bien ${M}² y el doble producto. Pero la esquina ${d}² = ${d2} va una sola vez; dos veces da ${t}.`)
          : en('TAL-SIGNO', M2 + 2 * Md + d2, fmt, t => `Bien las tres piezas. Pero ${N} es ${M} − ${d}: el doble producto se resta; sumarlo da ${t}.`),
      ],
      solucion: [
        [`${N} = `, Ta(M), ` ${S} `, Tb(d), ': el cuadrado de dos términos.'],
        ['Las piezas: ', Ta(`${M}² = ${f(M2)}`), ', el doble producto ', Tm(`2 · ${M} · ${d} = ${2 * Md}`), ' y ', Tb(`${d}² = ${d2}`), '.'],
        [`${f(M2)} ${S} ${2 * Md} + ${d2} = `, Tr(fmt(ans)), '.'],
      ],
      _datos: { sub, M, d },
    };
  }

  function completar(rng, forzado) {
    const sub = forzado || rng.elegir(['suma', 'resta']);
    const h = rng.entero(3, 10), k = 2 * h, c = h * h, S = sub === 'suma' ? '+' : '−', fmt = x => f(x);
    return {
      enunciado: [`Se tiene x² ${S} ${k}x + □.`],
      pregunta: ['¿Qué número va en el □ para que sea el cuadrado de un binomio?'],
      datos: [sub === 'suma' ? D.cuad : D.cuadR],
      correcta: c, fmt,
      errores: [
        en('TAL-2AB', k * k, fmt, t => `Bien que en el □ vaya el cuadrado de un número. Pero ${k}x es el doble producto, 2 · x · b, así que b es ${h}, no ${k}; con ${k} sale ${t}.`),
        en('TAL-ESQUINA-LADO', h, fmt, t => `Bien: ${k}x = 2 · x · ${h}, así que b = ${h}. Pero en el □ va la esquina, b², no su lado ${t}.`),
        en('TAL-PN-COPIA', k, fmt, t => `Bien que busques el número que completa el cuadrado. Pero ${k}x es el doble producto; repetir su coeficiente da ${t}.`),
      ],
      solucion: [
        [`${k}x es el doble producto: 2 · `, Ta('x'), ' · ', Tb(h), '. Así, b vale ', Tb(h), '.'],
        ['La esquina es ', Tb(`${h}²`), ' = ', Tr(c), `: x² ${S} ${k}x + ${c} = (x ${S} ${h})².`],
      ],
      _datos: { sub, h },
    };
  }

  function sumaProducto(rng, forzado) {
    const sub = forzado || rng.elegir(['suma', 'diferencia']);
    const x = rng.entero(2, 9), y = rng.entero(1, x - 1), S = x + y, Dd = x - y, Pp = x * y, fmt = n => f(n);
    if (S === 7 && Pp === 10) return null;   // los números de la predicción de la idea 3
    const pide = ['¿Cuánto vale ', LA(), '² + ', LB(), '²?'];
    if (sub === 'suma') {
      const ans = S * S - 2 * Pp;
      return {
        enunciado: ['Dos números cumplen ', LA(), ' + ', LB(), ` = ${S} y `, LA(), LB(), ` = ${Pp}.`],
        pregunta: pide, datos: [D.cuad], correcta: ans, fmt,
        errores: [
          en('AL8', S * S, fmt, t => `${S}² = ${t} está bien calculado. Pero ahí está también el doble producto 2ab: hay que quitarlo.`),
          en('TAL-2AB', S * S - Pp, fmt, t => `Bien quitar ab = ${Pp} de ${S}². Pero el doble producto es 2ab = ${2 * Pp}; quitar solo ${Pp} da ${t}.`),
          en('TAL-SIGNO', S * S + 2 * Pp, fmt, t => `Bien el doble producto, 2 · ${Pp} = ${2 * Pp}. Pero ya está dentro de ${S}²: se resta; sumarlo da ${t}.`),
          en('TAL-PN-CUATRO', S * S - 4 * Pp, fmt, t => `Bien quitar algo de ${S}². Pero se quita 2ab = ${2 * Pp}, no 4ab; así sale ${t}.`),
        ],
        solucion: [
          ['El cuadrado de la suma trae los dos cuadrados y el doble producto: ', `${S}² = a² + b² + `, Tm(`2 · ${Pp}`), '.'],
          [LA(), '² + ', LB(), `² = ${S * S} − ${2 * Pp} = `, Tr(fmt(ans)), '.'],
        ],
        _datos: { sub, x, y },
      };
    }
    const ans = Dd * Dd + 2 * Pp;
    return {
      enunciado: ['Dos números cumplen ', LA(), ' − ', LB(), ` = ${Dd} y `, LA(), LB(), ` = ${Pp}.`],
      pregunta: pide, datos: [D.cuadR], correcta: ans, fmt,
      errores: [
        en('AL8', Dd * Dd, fmt, t => `${Dd}² = ${t} está bien calculado. Pero a ese cuadrado se le quitó el doble producto 2ab: hay que devolverlo.`),
        en('TAL-2AB', Dd * Dd + Pp, fmt, t => `Bien devolver ab = ${Pp}. Pero el doble producto es 2ab = ${2 * Pp}; con ${Pp} sale ${t}.`),
        en('TAL-SIGNO', Dd * Dd - 2 * Pp, fmt, t => `Bien el doble producto, ${2 * Pp}. Pero en (a − b)² se restó: para llegar a a² + b² se suma; restarlo da ${t}.`),
        en('TAL-PN-CUATRO', Dd * Dd + 4 * Pp, fmt, t => `Bien sumar algo a ${Dd}². Pero se suma 2ab = ${2 * Pp}, no 4ab; así sale ${t}.`),
      ],
      solucion: [
        ['El cuadrado de la resta trae los dos cuadrados menos el doble producto: ', `${Dd}² = a² + b² − `, Tm(`2 · ${Pp}`), '.'],
        [LA(), '² + ', LB(), `² = ${Dd * Dd} + ${2 * Pp} = `, Tr(fmt(ans)), '.'],
      ],
      _datos: { sub, x, y },
    };
  }

  function inverso(rng, forzado) {
    const sub = forzado || rng.elegir(['suma', 'resta']);
    const k = rng.entero(3, 9), k2 = k * k, s = sub === 'suma' ? 1 : -1, S = sg(s), fmt = n => f(n);
    const ans = k2 - 2 * s;
    return {
      enunciado: ['Un número x, distinto de 0, cumple ', Ta('x'), ` ${S} `, Tb('1/x'), ` = ${k}.`],
      pregunta: ['¿Cuánto vale ', Ta('x²'), ' + ', Tb('1/x²'), '?'],
      datos: [s > 0 ? D.cuad : D.cuadR, D.inv],
      correcta: ans, fmt,
      errores: [
        en('AL8', k2, fmt, t => `${k}² = ${t} está bien calculado. Pero ahí está también el doble producto, 2 · x · (1/x) = 2.`),
        en('TAL-2AB', k2 - s, fmt, t => `Bien que el producto x · (1/x) valga 1. Pero el doble producto es 2 · 1 = 2; con 1 sale ${t}.`),
        en('TAL-SIGNO', k2 + 2 * s, fmt, t => `Bien el doble producto, 2. Pero ${k}² ya lo trae ${s > 0 ? 'sumado: se resta; sumarlo' : 'restado: se suma; restarlo'} da ${t}.`),
        en('TAL-PN-CUATRO', k2 - 4 * s, fmt, t => `Bien que el producto x · (1/x) valga 1. Pero el doble producto es 2, no 4; así sale ${t}.`),
      ],
      solucion: [
        ['Aquí a es ', Ta('x'), ' y b es ', Tb('1/x'), ': su producto es 1, y el doble producto vale ', Tm('2 · 1 = 2'), '.'],
        [`${k}² = x² + 1/x² ${S} 2, así que x² + 1/x² = ${k2} ${sg(-s)} 2 = `, Tr(fmt(ans)), '.'],
      ],
      _datos: { sub, k },
    };
  }

  // La figura del terreno partido (como San Marcos 2025-I): dos cuadrados en las esquinas y dos rectángulos.
  function figuraTerreno(x, y, Y) {
    const W = 320, L = 200, x0 = 60, y0 = 12, A = L * x / (x + y), B = L - A;
    const rect = (px, py, w, h, c) => `<rect x="${px.toFixed(1)}" y="${py.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" style="fill:var(--c-${c});fill-opacity:.14;stroke:var(--c-${c})" stroke-width="2"/>`;
    const txt = (px, py, t, gira) => `<text x="${px.toFixed(1)}" y="${py.toFixed(1)}" text-anchor="middle" dominant-baseline="central" font-size="14" fill="currentColor"${gira ? ` transform="rotate(-90 ${px.toFixed(1)} ${py.toFixed(1)})"` : ''}>${P.xml(t)}</text>`;
    const r = `${Y} m²`;
    return `<svg viewBox="0 0 ${W} ${L + 2 * y0}" xmlns="http://www.w3.org/2000/svg" font-family="inherit">`
      + rect(x0, y0, A, A, 'o') + rect(x0 + A, y0, B, A, 'f') + rect(x0, y0 + A, A, B, 'f') + rect(x0 + A, y0 + A, B, B, 'i')
      + txt(x0 + A + B / 2, y0 + A / 2, r, B < 52) + txt(x0 + A / 2, y0 + A + B / 2, r)
      + '</svg>';
  }

  // Como San Marcos 2025-I (áreas D y E, 35): un cuadrado de lado a + b partido en a², b² y dos rectángulos ab.
  function figura(rng) {
    const x = rng.entero(3, 9), y = rng.entero(2, x - 1), X = x * x + y * y, Y = x * y, L = x + y;
    const m = t => `${t} m`;
    return {
      enunciado: ['Un terreno cuadrado se parte en dos cuadrados y dos rectángulos iguales, como en la figura. Los dos cuadrados suman ',
        `${X}\u00a0m² y cada rectángulo mide ${Y}\u00a0m².`],
      pregunta: ['¿Cuánto mide el lado del terreno?'],
      datos: [D.area, D.rect, D.cuad],
      correcta: m(L),
      errores: [
        e('TAL-2AB', m(simp(1, X + Y)), t => `Bien sumar las piezas y sacar la raíz. Pero son dos rectángulos: ${X} + 2 · ${Y}; con uno solo sale ${t}.`),
        e('AL8', m(simp(1, X)), t => `Bien que uses los dos cuadrados, ${X} m². Pero el terreno también tiene los dos rectángulos; sin ellos sale ${t}.`),
        e('TAL-RAIZ-FALTA', m(L * L), t => `${L * L} m² es el área del terreno, bien sumada. Pero piden el lado: falta sacar la raíz; ${t} no es una longitud del terreno.`),
      ],
      solucion: [
        ['El área del terreno son sus cuatro piezas: ', `${X} + `, Tm(`2 · ${Y}`), ` = ${L * L} m².`],
        [`El lado es la raíz del área: √${L * L} = `, Tr(m(L)), `, porque ${L} · ${L} = ${L * L}.`],
      ],
      figura: { svg: figuraTerreno(x, y, Y), alt: `Un cuadrado partido en un cuadrado grande arriba a la izquierda, uno chico abajo a la derecha y dos rectángulos de ${Y} metros cuadrados cada uno` },
      _datos: { x, y },
    };
  }

  // ======================= Idea 2: suma por diferencia =======================

  function cercanos(rng) {
    const M = rng.elegir([20, 30, 40, 50, 60, 70, 80, 90, 100]), d = rng.entero(1, 4);
    if (M === 30 && d === 1) return null;   // 31 · 29 es la predicción de la idea 2
    const N1 = M + d, N2 = M - d, M2 = M * M, d2 = d * d, ans = M2 - d2, fmt = x => f(x);
    return {
      enunciado: [`Se quiere calcular ${N1} · ${N2} sin hacer la multiplicación larga.`],
      pregunta: ['¿Cuánto vale?'],
      datos: [D.sxd],
      correcta: ans, fmt,
      errores: [
        en('TAL-DIFCUAD-FALTA', M2, fmt, t => `Bien partir de ${M}² = ${t}. Pero falta quitar la esquina, ${d}² = ${d2}.`),
        en('TAL-DIFCUAD-SUMA', M2 + d2, fmt, t => `Bien ${M}² y ${d}². Pero la esquina se quita, no se suma; sumarla da ${t}.`),
        en('TAL-DIFCUAD-2B', M2 - 2 * d, fmt, t => `Bien quitarle algo a ${f(M2)}. Pero se quita ${d}² = ${d2}, no 2 · ${d}; así sale ${t}.`),
        en('TAL-DIFCUAD-DOBLE', M2 - 2 * d2, fmt, t => `Bien quitar la esquina ${d}² = ${d2}. Pero se quita una sola vez; dos veces da ${t}.`),
      ],
      solucion: [
        [`${N1} = `, Ta(M), ' + ', Tb(d), ` y ${N2} = `, Ta(M), ' − ', Tb(d), ': una suma por su diferencia.'],
        [Ta(`${M}²`), ' − ', Tb(`${d}²`), ` = ${f(M2)} − ${d2} = `, Tr(fmt(ans)), '.'],
      ],
      _datos: { M, d },
    };
  }

  function triplay(rng) {
    const a = rng.entero(8, 15), b = rng.entero(2, Math.min(6, a - 3)), fmt = x => `${f(x)} dm²`, ans = a * a - b * b;
    return {
      enunciado: ['En la carpintería hay una plancha cuadrada de triplay de ', Ta(`${a} dm`), ' de lado. Se le corta una esquina cuadrada de ', Tb(`${b} dm`), ' de lado.'],
      pregunta: ['¿Cuántos dm² de triplay quedan?'],
      datos: [D.area, D.sxd],
      correcta: ans, fmt,
      errores: [
        en('TAL-DIFCUAD-FALTA', a * a, fmt, t => `Bien el área de la plancha entera, ${t}. Pero falta quitar la esquina de ${b} por ${b}.`),
        en('TAL-SXD-CUAD', (a - b) ** 2, fmt, t => `Bien que la esquina mida ${b} dm de lado. Pero se cortó solo una esquina: lo que queda no es un cuadrado de ${a - b} dm de lado, que da ${t}.`),
        en('TAL-DIFCUAD-2B', a * a - 2 * b, fmt, t => `Bien quitarle algo a ${a * a} dm². Pero la esquina mide ${b} · ${b} = ${b * b} dm², no 2 · ${b}; así quedan ${t}.`),
      ],
      solucion: [
        ['Queda la plancha menos la esquina: ', Ta(`${a}²`), ' − ', Tb(`${b}²`), ` = ${a * a} − ${b * b}.`],
        [`La pieza en L se rearma en un tablero de ${a + b} por ${a - b}: ${a + b} · ${a - b} = `, Tr(fmt(ans)), '.'],
      ],
      _datos: { a, b },
    };
  }

  function sumaDiferencia(rng) {
    const p = rng.entero(2, 5), k = rng.entero(1, 9), x = ct(p, 'x'), x2 = ct(p * p, 'x²');
    const err = (id, c, ex) => e(id, poli(c), ex);
    return {
      enunciado: ['Se tiene el producto (', Ta(x), ' + ', Tb(k), ')(', Ta(x), ' − ', Tb(k), ').'],
      pregunta: ['¿A qué es igual, desarrollado?'],
      datos: [D.sxd],
      correcta: poli([p * p, 0, -k * k]),
      errores: [
        err('TAL-DIFCUAD-SUMA', [p * p, 0, k * k], t => `Bien los dos cuadrados, ${x2} y ${k * k}. Pero el segundo se resta: es la esquina que se quita; sumarlo da ${t}.`),
        err('TAL-COEF', [p, 0, -k * k], t => `Bien la resta de cuadrados. Pero el primer término es ${x}: su cuadrado es ${x2}; sin elevar el ${p} queda ${t}.`),
        err('TAL-MEDIO', [p * p, -2 * p * k, -k * k], t => `Bien los dos cuadrados. Pero las piezas del medio, +${ct(p * k, 'x')} y −${ct(p * k, 'x')}, se anulan; dejarlas da ${t}.`),
        err('TAL-COEF', [p, 0, k * k], t => `Bien que el ${k} vaya al cuadrado. Pero el primer término es ${x}, su cuadrado es ${x2}, y el segundo cuadrado se resta; así queda ${t}.`),
        err('TAL-SXD-CUAD', [p * p, -2 * p * k, k * k], t => `Bien los dos cuadrados. Pero (${x} + ${k})(${x} − ${k}) no es (${x} − ${k})²: las piezas del medio se anulan; con el cuadrado de la resta queda ${t}.`),
      ],
      solucion: [
        ['Las piezas del medio se anulan: ', Tm(`+${ct(p * k, 'x')} − ${ct(p * k, 'x')} = 0`), '.'],
        ['Queda el primer cuadrado menos el segundo: ', Ta(`(${x})²`), ' − ', Tb(`${k}²`), ' = ', Tr(poli([p * p, 0, -k * k])), '.'],
      ],
      _datos: { p, k },
    };
  }

  function xpq(rng) {
    const p = rng.entero(-9, 9), q = rng.entero(-9, 9);
    if (!p || !q || p === q || p === -q) return null;
    const s = p + q, m = p * q;
    const err = (id, c, ex) => e(id, poli(c), ex);
    return {
      enunciado: ['Se tiene el producto (', Ta('x'), ` ${sg(p)} `, Tb(Math.abs(p)), ')(', Ta('x'), ` ${sg(q)} ${Math.abs(q)}).`],
      pregunta: ['¿A qué es igual, desarrollado?'],
      datos: [D.xpq],
      correcta: poli([1, s, m]),
      errores: [
        err('TAL-XPQ-CAMBIA', [1, m, s], t => `Bien p + q = ${z(s)} y p · q = ${z(m)}. Pero la suma va con la x y el producto va solo; cambiarlos da ${t}.`),
        err('TAL-XPQ-MEDIO', [1, 0, m], t => `Bien x² y ${z(m)}. Pero p y q no son opuestos: el término del medio no se anula; sin él queda ${t}.`),
        err('TAL-SIGNO', [1, -s, m], t => `Bien p · q = ${z(m)}. Pero el término del medio es p + q = ${z(p)} ${sg(q)} ${Math.abs(q)} = ${z(s)}; con el signo cambiado queda ${t}.`),
        (s < 0 || m < 0) && err('TAL-SIGNO', [1, Math.abs(s), Math.abs(m)], t => `Bien los números ${Math.abs(s)} y ${Math.abs(m)}. Pero p y q traen signo: p + q = ${z(s)} y p · q = ${z(m)}; todo con + queda ${t}.`),
        err('TAL-SIGNO', [1, s, -m], t => `Bien el término del medio. Pero p · q = ${z(p)} · ${q < 0 ? `(${z(q)})` : q} = ${z(m)}; con el otro signo queda ${t}.`),
      ],
      solucion: [
        [`Aquí p = ${z(p)} y q = ${z(q)}: suman ${z(s)} y multiplican ${z(m)}.`],
        ['Las piezas del medio se juntan: ', Tm(`${poli([p, 0])} ${sg(q)} ${poli([Math.abs(q), 0])} = ${poli([s, 0])}`), '. Queda ', Tr(poli([1, s, m])), '.'],
      ],
      nombres: { b: 'p, el número del primer factor' },
      _datos: { p, q },
    };
  }

  function legendre(rng, forzado) {
    const sub = forzado || rng.elegir(['ab', 'cuartas']);
    const fmt = n => f(n);
    if (sub === 'ab') {
      const x = rng.entero(3, 9), y = rng.entero(1, x - 1), S = x + y, Dd = x - y, Q = S * S - Dd * Dd, ans = x * y;
      return {
        enunciado: ['Dos números cumplen ', LA(), ' + ', LB(), ` = ${S} y `, LA(), ' − ', LB(), ` = ${Dd}.`],
        pregunta: ['¿Cuánto vale ', LA(), LB(), '?'],
        datos: [D.cuad, D.cuadR, D.sxd],
        correcta: ans, fmt,
        errores: [
          en('TAL-LEG-DOS', Q / 2, fmt, t => `Bien ${S}² − ${Dd}² = ${Q}. Pero eso es 4ab: se divide entre 4, no entre 2; así sale ${t}.`),
          en('TAL-LEG-CUATRO', Q, fmt, t => `Bien la resta de cuadrados, ${S}² − ${Dd}² = ${t}. Pero eso es 4ab: falta dividir entre 4.`),
          en('TAL-LEG-PROD', S * Dd, fmt, t => `${S} · ${Dd} = ${t} está bien calculado. Pero eso es a² − b², y piden ab.`),
          en('AL8', (S - Dd) ** 2 / 4, fmt, t => `Bien dividir entre 4. Pero ${S}² − ${Dd}² no es (${S} − ${Dd})²; con ese cuadrado sale ${t}.`),
        ],
        solucion: [
          ['Al restar los dos cuadrados se van a² y b², y quedan cuatro piezas ab: ', `${S}² − ${Dd}² = `, Tm('4ab'), '.'],
          [`${Q} = 4ab, así que `, LA(), LB(), ` = ${Q} ÷ 4 = `, Tr(fmt(ans)), '.'],
        ],
        _datos: { sub, x, y },
      };
    }
    // Como San Marcos 2026-I (área A, 40): (a + b)⁴ − (a − b)⁴ con ab y a² + b².
    const x = rng.entero(2, 4), y = rng.entero(1, x - 1), Pp = x * y, Q = x * x + y * y, ans = 8 * Pp * Q;
    return {
      enunciado: ['Dos números cumplen ', LA(), LB(), ` = ${Pp} y `, LA(), '² + ', LB(), `² = ${Q}.`],
      pregunta: ['¿Cuánto vale (', LA(), ' + ', LB(), ')⁴ − (', LA(), ' − ', LB(), ')⁴?'],
      datos: [D.pot4, D.sxd, D.cuad, D.cuadR],
      correcta: ans, fmt,
      errores: [
        en('TAL-LEG-SUMA', 4 * Pp * Q, fmt, t => `Bien la diferencia, (a + b)² − (a − b)² = 4ab. Pero (a + b)² + (a − b)² = 2(a² + b²), no a² + b²; así sale ${t}.`),
        en('TAL-POT-CUAD', 16 * Pp * Pp, fmt, t => `Bien (a + b)² − (a − b)² = 4ab = ${4 * Pp}. Pero la resta de cuartas no es el cuadrado de esa resta; elevarla da ${t}.`),
        en('TAL-SIGNO', 4 * Pp * (2 * Q + 4 * Pp), fmt, t => `Bien la diferencia, 4ab. Pero en (a + b)² + (a − b)² los dobles productos se anulan; sumarlos da ${t}.`),
        en('TAL-POT-SUMA', 2 * Q + 4 * Pp, fmt, t => `Bien los dos factores, ${2 * Q} y ${4 * Pp}. Pero se multiplican, no se suman; sumarlos da ${t}.`),
      ],
      solucion: [
        ['Con u = (a + b)² y w = (a − b)², la resta de cuartas es u² − w² = (u + w)(u − w).'],
        ['u + w = 2(a² + b²) = ', `${2 * Q}`, ' y u − w = ', Tm(`4ab = ${4 * Pp}`), '.'],
        [`${2 * Q} · ${4 * Pp} = `, Tr(fmt(ans)), '.'],
      ],
      _datos: { sub, x, y },
    };
  }

  // Como San Marcos 2024-I (áreas D y E, 39): cuatro factores agrupados de a dos, con un cambio de variable.
  function cambioVariable(rng) {
    const a = rng.entero(1, 3), g1 = rng.entero(1, 2), g2 = rng.entero(1, 2), b = a + g1, c = b + g2, d = c + g1, s = a + d;
    const y0 = rng.entero(1, 6), ad = a * d, bc = b * c, fmt = n => f(n), ans = (y0 + ad) * (y0 + bc);
    return {
      enunciado: [`Un número x cumple x² + ${s}x = ${y0}.`],
      pregunta: [`¿Cuánto vale (x + ${a})(x + ${b})(x + ${c})(x + ${d})?`],
      datos: [D.xpq],
      correcta: ans, fmt,
      errores: [
        en('TAL-XPQ-MEDIO', y0 * y0 + ad * bc, fmt, t => `Bien agrupar en (y + ${ad})(y + ${bc}) con y = ${y0}. Pero ese producto tiene término del medio, ${ad + bc}y; sin él sale ${t}.`),
        en('TAL-XPQ-DOBLE', y0 * y0 + 2 * (ad + bc) * y0 + ad * bc, fmt, t => `Bien agrupar con y = x² + ${s}x. Pero el término del medio es (${ad} + ${bc})y, sin el 2 de un cuadrado; con el 2 sale ${t}.`),
        en('TAL-CV-SINY', ad * bc, fmt, t => `Bien los números de cada grupo, ${ad} y ${bc}. Pero y = x² + ${s}x vale ${y0}, no 0; dejar solo ${ad} · ${bc} da ${t}.`),
        en('TAL-CV-SUMA', 2 * y0 + ad + bc, fmt, t => `Bien los dos grupos, ${y0 + ad} y ${y0 + bc}. Pero se multiplican, no se suman; sumarlos da ${t}.`),
      ],
      solucion: [
        [`Se agrupan los de los extremos y los del centro, que suman lo mismo: (x + ${a})(x + ${d}) = x² + ${s}x + ${ad} y (x + ${b})(x + ${c}) = x² + ${s}x + ${bc}.`],
        [`Con y = x² + ${s}x = ${y0}: (${y0} + ${ad})(${y0} + ${bc}) = ${y0 + ad} · ${y0 + bc} = `, Tr(fmt(ans)), '.'],
      ],
      _datos: { a, b, c, d, y0 },
    };
  }

  // Como San Marcos 2025-I (áreas B y C, 42): a⁶ − b⁶ es una suma por diferencia de cubos.
  function sextas(rng) {
    const u = rng.entero(3, 15), w = rng.entero(1, u - 1), D3 = u - w, D6 = u * u - w * w, fmt = n => f(n);
    return {
      enunciado: ['Dos números reales cumplen ', LA(), '³ − ', LB(), `³ = ${D3} y `, LA(), '⁶ − ', LB(), `⁶ = ${D6}.`],
      pregunta: ['¿Cuánto vale ', LA(), '³?'],
      datos: [D.sxd, 'a⁶ = (a³)²'],
      correcta: u, fmt,
      errores: [
        en('TAL-SEXTA-SUMA', u + w, fmt, t => `Bien: ${D6} ÷ ${D3} = ${t} es a³ + b³. Pero piden solo a³: falta combinarlo con a³ − b³ = ${D3}.`),
        en('TAL-SEXTA-MITAD', 2 * u, fmt, t => `Bien sumar a³ + b³ = ${u + w} y a³ − b³ = ${D3}. Pero eso es dos veces a³; sin dividir entre 2 sale ${t}.`),
        en('TAL-SEXTA-OTRO', w, fmt, t => `Bien a³ + b³ = ${u + w} y a³ − b³ = ${D3}. Pero ${t} es b³, el menor; piden a³.`),
      ],
      solucion: [
        ['a⁶ − b⁶ = (a³ + b³)(a³ − b³), así que ', `a³ + b³ = ${D6} ÷ ${D3} = ${u + w}.`],
        [`Al sumar a³ + b³ = ${u + w} y a³ − b³ = ${D3} queda 2a³ = ${2 * u}: `, LA(), '³ = ', Tr(fmt(u)), '.'],
      ],
      _datos: { u, w },
    };
  }

  // ======================= Idea 3: el cubo de una suma =======================

  function desarrollaCubo(rng, forzado) {
    const sub = forzado || rng.elegir(['suma', 'resta']);
    const k = rng.entero(2, 6), s = sub === 'suma' ? 1 : -1, S = sg(s);
    const cs = [1, 3 * k * s, 3 * k * k, s * k ** 3];
    const err = (id, c, ex) => e(id, poli(c), ex);
    const errores = s > 0 ? [
      err('AL11', [1, 0, 0, k ** 3], t => `Bien los dos cubos, x³ y ${k ** 3}. Pero faltan las seis piezas del medio; sin ellas queda ${t}.`),
      err('TAL-CUBO-TRES', [1, k, k * k, k ** 3], t => `Bien las cuatro clases de piezas. Pero de las del medio hay tres de cada una; con una sola queda ${t}.`),
      err('TAL-CUBO-CAMBIA', [1, 3 * k * k, 3 * k, k ** 3], t => `Bien los coeficientes 3. Pero con x² va ${k} una vez, y con x va ${k}²; al revés queda ${t}.`),
      err('TAL-CUBO-SEIS', [1, 6 * k, 0, k ** 3], t => `Bien que haya seis piezas en el medio. Pero no son iguales: tres de x² · ${k} y tres de x · ${k}²; así queda ${t}.`),
    ] : [
      err('AL11', [1, 0, 0, -(k ** 3)], t => `Bien x³ y −${k ** 3}. Pero faltan las seis piezas del medio; sin ellas queda ${t}.`),
      err('TAL-SIGNO', [1, -3 * k, -3 * k * k, -(k ** 3)], t => `Bien las cuatro piezas. Pero los signos se alternan: −, +, −; todos con − queda ${t}.`),
      err('TAL-CUBO-SIGNO', [1, -3 * k, 3 * k * k, k ** 3], t => `Bien las tres primeras. Pero (−${k})³ es negativo, −${k ** 3}; con + queda ${t}.`),
      err('TAL-CUBO-TRES', [1, -k, k * k, -(k ** 3)], t => `Bien los signos alternados. Pero de las piezas del medio hay tres de cada una; con una sola queda ${t}.`),
      err('TAL-SIGNO', [1, 3 * k, 3 * k * k, k ** 3], t => `Bien las cuatro piezas y sus coeficientes. Pero en una resta los signos se alternan: −, +, −; todos con + queda ${t}.`),
    ];
    return {
      enunciado: ['Se tiene el cubo (', Ta('x'), ` ${S} `, Tb(k), ')³.'],
      pregunta: ['¿A qué es igual, desarrollado?'],
      datos: [s > 0 ? D.cubo : D.cuboR],
      correcta: poli(cs), errores,
      solucion: [
        ['Los dos cubos: ', Ta('x³'), ' y ', Tb(`${k}³ = ${k ** 3}`), '.'],
        ['Las piezas del medio: ', Tm(`3 · x² · ${k} = ${3 * k}x²`), ` y 3 · x · ${k}² = ${3 * k * k}x`, s > 0 ? '.' : ', con los signos alternados.'],
        ['(', Ta('x'), ` ${S} `, Tb(k), ')³ = ', Tr(poli(cs)), '.'],
      ],
      _datos: { sub, k },
    };
  }

  function taco(rng) {
    const a = rng.entero(2, 6), b = rng.entero(1, 4);
    if (a === b || (a === 3 && b === 2) || (a === 5 && b === 2)) return null;   // el taco del juego y el de la predicción
    const fmt = x => `${f(x)} dm³`, A2B = a * a * b, AB2 = a * b * b, ans = 3 * A2B + 3 * AB2;
    return {
      enunciado: ['Un taco de madera tiene forma de cubo. Cada arista se parte en dos tramos, de ', Ta(`${a} dm`), ' y de ', Tb(`${b} dm`),
        ', y el carpintero lo corta por esos puntos en ocho piezas: un corte a lo ancho, otro a lo largo y otro a lo alto.'],
      pregunta: ['¿Cuántos dm³ de madera suman las seis piezas que no son cubos?'],
      datos: [D.vol, D.cubo],
      correcta: ans, fmt,
      errores: [
        en('TAL-CUBO-TRES', A2B + AB2, fmt, t => `Bien las dos clases de piezas, de ${A2B} y de ${AB2} dm³. Pero hay tres de cada clase; con una de cada una salen ${t}.`),
        en('TAL-CUBO-UNA', 3 * A2B, fmt, t => `Bien las tres piezas de ${a} · ${a} · ${b} = ${A2B} dm³. Faltan las tres de ${a} · ${b} · ${b}; sin ellas salen ${t}.`),
        en('TAL-CUBO-SUMA', 3 * a * b, fmt, t => `Bien 3 · ${a} · ${b} = ${3 * a * b}. Pero las seis piezas suman 3ab(a + b): falta multiplicar por ${a + b}; sin eso salen ${t}.`),
        en('TAL-CUBO-SEIS', 6 * A2B, fmt, t => `Bien que sean seis piezas. Pero no son iguales: tres miden ${A2B} y tres ${AB2} dm³; seis de ${A2B} dan ${t}.`),
      ],
      solucion: [
        ['Tres piezas miden ', Tm(`${a} · ${a} · ${b} = ${A2B} dm³`), ` y tres, ${a} · ${b} · ${b} = ${AB2} dm³.`],
        [`3 · ${A2B} + 3 · ${AB2} = `, Tr(fmt(ans)), `. (El taco entero: ${a ** 3} + ${ans} + ${b ** 3} = ${(a + b) ** 3} = ${a + b}³.)`],
      ],
      _datos: { a, b },
    };
  }

  function numeroCubo(rng, forzado) {
    const sub = forzado || rng.elegir(['suma', 'resta']);
    const M = rng.elegir([10, 20, 30, 40, 50, 100]), d = rng.entero(1, 2), s = sub === 'suma' ? 1 : -1, N = M + s * d, S = sg(s);
    const fmt = x => f(x), M3 = M ** 3, M2d = M * M * d, Md2 = M * d * d, d3 = d ** 3, ans = N ** 3;
    const errores = s > 0 ? [
      en('AL11', M3 + d3, fmt, t => `Bien ${M}³ y ${d}³. Pero faltan las seis piezas del medio; sin ellas sale ${t}.`),
      en('TAL-CUBO-TRES', M3 + M2d + Md2 + d3, fmt, t => `Bien las cuatro clases de piezas. Pero de las del medio hay tres de cada una; con una sola sale ${t}.`),
      en('TAL-CUBO-UNA', M3 + 3 * M2d + d3, fmt, t => `Bien las tres piezas de ${M} · ${M} · ${d}. Faltan las tres de ${M} · ${d} · ${d}; sin ellas sale ${t}.`),
      en('TAL-CUBO-SEIS', M3 + 6 * M2d + d3, fmt, t => `Bien que haya seis piezas en el medio. Pero tres son de ${M} · ${M} · ${d} y tres de ${M} · ${d} · ${d}; seis de las grandes dan ${t}.`),
    ] : [
      en('AL11', M3 - d3, fmt, t => `Bien ${M}³ − ${d}³. Pero faltan las piezas del medio; sin ellas sale ${t}.`),
      en('TAL-CUBO-TRES', M3 - M2d + Md2 - d3, fmt, t => `Bien los signos alternados. Pero de las piezas del medio hay tres de cada una; con una sola sale ${t}.`),
      en('TAL-SIGNO', M3 - 3 * M2d - 3 * Md2 - d3, fmt, t => `Bien las cuatro piezas. Pero los signos se alternan: −, +, −; todos con − sale ${t}.`),
      en('TAL-CUBO-SIGNO', M3 - 3 * M2d + 3 * Md2 + d3, fmt, t => `Bien las tres primeras piezas. Pero (−${d})³ es negativo; sumarlo da ${t}.`),
    ];
    return {
      enunciado: [`Se quiere calcular ${N}³ sin hacer la multiplicación larga.`],
      pregunta: ['¿Cuánto vale?'],
      datos: [s > 0 ? D.cubo : D.cuboR],
      correcta: ans, fmt, errores,
      solucion: [
        [`${N} = `, Ta(M), ` ${S} `, Tb(d), ': el cubo de dos términos.'],
        ['Las piezas: ', Ta(`${M}³ = ${f(M3)}`), ', ', Tm(`3 · ${M}² · ${d} = ${f(3 * M2d)}`), `, 3 · ${M} · ${d}² = ${f(3 * Md2)} y `, Tb(`${d}³ = ${d3}`), '.'],
        [`${f(M3)} ${S} ${f(3 * M2d)} + ${f(3 * Md2)} ${S} ${d3} = `, Tr(fmt(ans)), '.'],
      ],
      _datos: { sub, M, d },
    };
  }

  function coeficiente(rng, forzado) {
    const sub = forzado || rng.elegir(['x2', 'x']);
    const p = rng.entero(1, 3), k = rng.entero(1, 5);
    if (p === 1 && k === 1) return null;
    const px = ct(p, 'x'), fmt = n => f(n);
    const enunciado = ['Se desarrolla (', Ta(px), ' + ', Tb(k), ')³.'];
    if (sub === 'x2') {
      const ans = 3 * p * p * k;
      return {
        enunciado, pregunta: ['¿Cuál es el coeficiente del término con x²?'], datos: [D.cubo],
        correcta: ans, fmt,
        errores: [
          en('TAL-CUBO-TRES', p * p * k, fmt, t => `Bien que sea la pieza a²b, ${pl(p, 'x²', `(${px})²`)} · ${k}. Pero hay tres de esas piezas; con una sola sale ${t}.`),
          p > 1 && en('TAL-COEF', 3 * p * k, fmt, t => `Bien 3 · a² · b. Pero a es ${px}: su cuadrado es ${p * p}x²; sin elevar el ${p} sale ${t}.`),
          en('TAL-CUBO-CAMBIA', 3 * p * k * k, fmt, t => `Bien los tres. Pero con x² va a²b: el ${k} una vez, no ${k}²; al revés sale ${t}.`),
          en('TAL-CUBO-SEIS', 6 * p * p * k, fmt, t => `Bien la pieza a²b. Pero hay tres de esas piezas, no seis; seis da ${t}.`),
        ],
        solucion: [
          ['El término con x² sale de las tres piezas a²b: ', Tm(p === 1 ? `3 · x² · ${k}` : `3 · (${px})² · ${k} = 3 · ${p * p}x² · ${k}`), '.'],
          ['El coeficiente es ', `3 · ${p * p} · ${k} = `, Tr(fmt(ans)), '.'],
        ],
        _datos: { sub, p, k },
      };
    }
    const ans = 3 * p * k * k;
    return {
      enunciado, pregunta: ['¿Cuál es el coeficiente del término con x, sin potencia?'], datos: [D.cubo],
      correcta: ans, fmt,
      errores: [
        en('TAL-CUBO-TRES', p * k * k, fmt, t => `Bien que sea la pieza ab², ${px} · ${k}². Pero hay tres de esas piezas; con una sola sale ${t}.`),
        k > 1 && en('TAL-CUBO-SINCUAD', 3 * p * k, fmt, t => `Bien 3 · a · b². Pero b es ${k}: su cuadrado es ${k * k}; sin elevarlo sale ${t}.`),
        en('TAL-CUBO-CAMBIA', 3 * p * p * k, fmt, t => `Bien los tres. Pero con x va ab²: el ${k} al cuadrado y la x una vez; al revés sale ${t}.`),
        en('TAL-CUBO-SEIS', 6 * p * k * k, fmt, t => `Bien la pieza ab². Pero hay tres de esas piezas, no seis; seis da ${t}.`),
      ],
      solucion: [
        ['El término con x sale de las tres piezas ab²: ', `3 · ${px} · ${k}² = 3 · ${px} · ${k * k}.`],
        ['El coeficiente es ', `3 · ${p} · ${k * k} = `, Tr(fmt(ans)), '.'],
      ],
      _datos: { sub, p, k },
    };
  }

  // Como San Marcos 2024-I (áreas B y C, 42): la suma de cubos con la suma y el producto.
  function sumaProductoCubo(rng, forzado) {
    const sub = forzado || rng.elegir(['suma', 'diferencia']);
    const x = rng.entero(2, 9), y = rng.entero(1, x - 1), Pp = x * y, fmt = n => f(n);
    if (sub === 'suma') {
      const S = x + y, ans = S ** 3 - 3 * Pp * S;
      if (S === 7 && Pp === 10) return null;   // la predicción de la idea 3
      return {
        enunciado: ['Dos números cumplen ', LA(), ' + ', LB(), ` = ${S} y `, LA(), LB(), ` = ${Pp}.`],
        pregunta: ['¿Cuánto vale ', LA(), '³ + ', LB(), '³?'],
        datos: [D.cubo], correcta: ans, fmt,
        errores: [
          en('AL11', S ** 3, fmt, t => `${S}³ = ${t} está bien calculado. Pero ahí están también las seis piezas del medio: hay que quitarlas.`),
          en('TAL-CUBO-SUMA', S ** 3 - 3 * Pp, fmt, t => `Bien quitar 3ab = ${3 * Pp}. Pero las piezas del medio son 3ab(a + b): falta multiplicar por ${S}; así sale ${t}.`),
          en('TAL-CUBO-TRES', S ** 3 - Pp * S, fmt, t => `Bien quitar ab(a + b) = ${Pp * S}. Pero son tres veces, ${3 * Pp * S}; quitar una vez da ${t}.`),
          en('TAL-CUBO-SEIS', S ** 3 - 6 * Pp * S, fmt, t => `Bien quitar las piezas del medio. Pero juntas suman 3ab(a + b) = ${3 * Pp * S}, no seis veces ab(a + b); así sale ${t}.`),
          en('TAL-CUBO-DOS', S * S - 2 * Pp, fmt, t => `Bien usar la suma y el producto. Pero ${t} es a² + b², con la fórmula del cuadrado; para los cubos va la del cubo.`),
          en('TAL-CUBO-MEDIO', 3 * Pp * S, fmt, t => `Bien calculadas las piezas del medio, 3ab(a + b) = ${t}. Pero eso es lo que se quita de ${S}³; lo que queda es a³ + b³.`),
        ],
        solucion: [
          ['El cubo de la suma trae los dos cubos y las seis piezas del medio, que juntas son 3ab(a + b): ', `${S}³ = a³ + b³ + `, Tm(`3 · ${Pp} · ${S}`), '.'],
          [LA(), '³ + ', LB(), `³ = ${S ** 3} − ${3 * Pp * S} = `, Tr(fmt(ans)), '.'],
        ],
        _datos: { sub, x, y },
      };
    }
    const Dd = x - y, ans = Dd ** 3 + 3 * Pp * Dd;
    return {
      enunciado: ['Dos números cumplen ', LA(), ' − ', LB(), ` = ${Dd} y `, LA(), LB(), ` = ${Pp}.`],
      pregunta: ['¿Cuánto vale ', LA(), '³ − ', LB(), '³?'],
      datos: [D.cuboR], correcta: ans, fmt,
      errores: [
        en('AL11', Dd ** 3, fmt, t => `${Dd}³ = ${t} está bien calculado. Pero a ese cubo se le restaron las piezas del medio: hay que devolverlas.`),
        en('TAL-CUBO-SUMA', Dd ** 3 + 3 * Pp, fmt, t => `Bien devolver 3ab = ${3 * Pp}. Pero las piezas del medio son 3ab(a − b): falta multiplicar por ${Dd}; así sale ${t}.`),
        en('TAL-CUBO-TRES', Dd ** 3 + Pp * Dd, fmt, t => `Bien devolver ab(a − b) = ${Pp * Dd}. Pero son tres veces, ${3 * Pp * Dd}; una vez da ${t}.`),
        en('TAL-SIGNO', Dd ** 3 - 3 * Pp * Dd, fmt, t => `Bien las piezas del medio, ${3 * Pp * Dd}. Pero en (a − b)³ se restaron: para llegar a a³ − b³ se suman; restarlas da ${t}.`),
        en('TAL-CUBO-DOS', Dd * Dd + 2 * Pp, fmt, t => `Bien usar la diferencia y el producto. Pero ${t} es a² + b², con la fórmula del cuadrado; para los cubos va la del cubo.`),
        en('TAL-CUBO-SEIS', Dd ** 3 + 6 * Pp * Dd, fmt, t => `Bien devolver las piezas del medio. Pero juntas suman 3ab(a − b) = ${3 * Pp * Dd}, no el doble; así sale ${t}.`),
      ],
      solucion: [
        ['En el cubo de una resta, las piezas del medio se restan: ', `${Dd}³ = a³ − b³ − `, Tm(`3 · ${Pp} · ${Dd}`), '.'],
        [LA(), '³ − ', LB(), `³ = ${Dd ** 3} + ${3 * Pp * Dd} = `, Tr(fmt(ans)), '.'],
      ],
      _datos: { sub, x, y },
    };
  }

  function factorizaCubos(rng) {
    const p = rng.elegir([1, 1, 2, 3]), k = rng.entero(1, 6), mas = rng.entero(0, 1) === 1;
    if (mcd(p, k) !== 1) return null;
    const s1 = mas ? '+' : '−', s2 = mas ? '−' : '+', px = ct(p, 'x'), ppx = p === 1 ? 'x' : `(${px})`;
    const fac = (signo, medio) => `(${px} ${s1} ${k})(${ct(p * p, 'x²')} ${signo} ${ct(medio, 'x')} + ${k * k})`;
    return {
      enunciado: ['Se tiene ', Ta(ct(p ** 3, 'x³')), ` ${s1} `, Tb(k ** 3), '.'],
      pregunta: ['¿Cómo se factoriza?'],
      datos: [D.sumaC, D.difC],
      correcta: fac(s2, p * k),
      errores: [
        e('AL11', `(${px} ${s1} ${k})³`, t => `Bien ver dos cubos, ${ppx}³ y ${k}³. Pero ${t} trae también las piezas del medio; no es lo mismo.`),
        e('TAL-SIGNO', fac(s1, p * k), t => `Bien el primer factor, ${px} ${s1} ${k}. Pero en el segundo el signo del medio es el contrario; con el mismo queda ${t}.`),
        e('TAL-CUBO-CRUZA', `(${px} ${s2} ${k})(${ct(p * p, 'x²')} ${s1} ${ct(p * k, 'x')} + ${k * k})`, t => `Bien la forma de la factorización, con a = ${px} y b = ${k}. Pero ${t} es la de la ${mas ? 'diferencia' : 'suma'} de cubos; aquí hay una ${mas ? 'suma' : 'diferencia'}.`),
        e('TAL-CUBO-CUAD', fac(s2, 2 * p * k), t => `Bien el primer factor. Pero el segundo es a² ${s2} ab + b², no un cuadrado: el medio es ${ct(p * k, 'x')}; con el doble queda ${t}.`),
      ],
      solucion: [
        [Ta(ct(p ** 3, 'x³')), ` = ${ppx}³ y `, Tb(k ** 3), ` = ${k}³: es una ${mas ? 'suma' : 'diferencia'} de cubos con a = `, Ta(px), ' y b = ', Tb(k), '.'],
        [`a² ${s2} ab + b² = ${ct(p * p, 'x²')} ${s2} ${ct(p * k, 'x')} + ${k * k}: `, Tr(fac(s2, p * k)), '.'],
      ],
      _datos: { p, k, mas },
    };
  }

  // ======================= Idea 4: radicales dobles =======================

  // Pares que suman A (x > y).
  const pares = A => { const l = []; for (let x = A - 1; x > A - x; x--) l.push([x, A - x]); return l; };
  // Otro par que suma A pero no multiplica B (para el error TAL-RD-PRODUCTO).
  const otrosPares = (rng, A, B) => rng.barajar(pares(A).filter(([u, w]) => u * w !== B)).slice(0, 2);
  const otroPar = (rng, A, B) => otrosPares(rng, A, B)[0] || null;
  // x > y con x + y entre 5 y 15, xy sin raíz exacta.
  function parRD(rng) {
    for (let i = 0; i < 200; i++) {
      const x = rng.entero(3, 12), y = rng.entero(1, x - 1);
      // 7 y 12 son los de la predicción de la idea 4 (√(7 − 2√12)): ningún radical doble de la práctica los usa.
      if (!esCuad(x * y) && limpio(x) && limpio(y) && x + y >= 5 && x + y <= 15 && !(x + y === 7 && x * y === 12)) return [x, y];
    }
    return [3, 2];
  }
  const rdT = (A, s, B) => `√(${A} ${s} 2√${B})`;

  function mesa(rng, forzado) {
    const sub = forzado || rng.elegir(['area', 'lado']);
    const x = rng.entero(3, 12), y = rng.entero(1, x - 1), B = x * y;
    if (mayorCuad(B) !== 1 || esCuad(x)) return null;   // √(xy) ya simplificada y √x sin raíz exacta
    const enunciado = ['Una mesa cuadrada se arma con cuatro planchas: una cuadrada de ', Ta(`${x} dm²`), ', otra cuadrada de ', Tb(`${y} dm²`),
      ' y dos rectangulares iguales que completan el cuadrado.'];
    const lado = `${rz(x)} + ${rz(y)}`;
    if (sub === 'area') {
      const dm2 = t => `${t} dm²`;
      return {
        enunciado, pregunta: ['¿Cuál es el área de la mesa?'],
        datos: [D.lado, D.rect, D.prod],
        correcta: dm2(`${x + y} + 2√${B}`),
        errores: [
          e('AL8', dm2(String(x + y)), t => `Bien las dos planchas cuadradas, ${x} + ${y}. Pero faltan las dos rectangulares; sin ellas quedan ${t}.`),
          e('TAL-2AB', dm2(`${x + y} + √${B}`), t => `Bien una plancha rectangular de √${x} por ${rz(y)}. Pero son dos; con una sola quedan ${t}.`),
          e('TAL-RD-AREA', dm2(String(x + y + 2 * B)), t => `Bien que haya dos planchas rectangulares. Pero cada una mide √${x} por ${rz(y)}, los lados, no ${x} por ${y}, las áreas; así salen ${t}.`),
        ],
        solucion: [
          ['Cada plancha rectangular mide √', Ta(x), ' por ', ...(esCuad(y) ? [Tb(rz(y))] : ['√', Tb(y)]), `: ${rz(x)} · ${rz(y)} = √${B} dm². Son dos: `, Tm(`2√${B}`), '.'],
          [`${x} + ${y} + 2√${B} = `, Tr(dm2(`${x + y} + 2√${B}`)), '.'],
        ],
        _datos: { sub, x, y },
      };
    }
    const dm = t => `${t} dm`;
    return {
      enunciado, pregunta: ['¿Cuánto mide el lado de la mesa?'],
      datos: [D.lado, D.rect],
      correcta: dm(lado),
      errores: [
        e('AL9', dm(simp(1, x + y)), t => `Bien que el lado salga de raíces. Pero la raíz de una suma no es la suma de raíces: ${t} deja fuera las planchas rectangulares.`),
        e('TAL-RD-LADO', dm(`√${B}`), t => `Bien √${x} · ${rz(y)} = √${B}. Pero ${t} es el área de una plancha rectangular, no un lado de la mesa.`),
        e('TAL-RAIZ-FALTA', dm(`${x + y} + 2√${B}`), t => `${x + y} + 2√${B} es el área de la mesa, bien sumada. Pero piden el lado: ${t} no es una longitud.`),
      ],
      solucion: [
        ['Un lado de la mesa es el lado de una plancha cuadrada más el de la otra: √', Ta(x), ' y ', ...(esCuad(y) ? [Tb(rz(y))] : ['√', Tb(y)]), '.'],
        ['Mide ', Tr(dm(lado)), `. (Su área: ${x} + ${y} + `, Tm(`2√${B}`), '.)'],
      ],
      _datos: { sub, x, y },
    };
  }

  // Solución común: x + y = A y x · y = B.
  const solRD = (x, y, A, B, extra) => [Ta(x), ' + ', Tb(y), ` = ${A} y `, Ta(x), ' · ', Tb(y), ` = ${B}${extra || ''}.`];

  function simple(rng) {
    const [x, y] = parRD(rng), A = x + y, B = x * y, otros = otrosPares(rng, A, B), q = rdT(A, '+', B);
    return {
      enunciado: [`Se tiene el radical doble ${q}.`],
      pregunta: ['¿A qué es igual, como dos raíces simples?'],
      datos: [D.rd],
      correcta: `${rz(x)} + ${rz(y)}`,
      errores: [
        e('TAL-RD-SIGNO', `${rz(x)} − ${rz(y)}`, t => `Bien ${x} y ${y}, que suman ${A} y multiplican ${B}. Pero el signo es el del radical doble, +; con − queda ${t}.`),
        e('AL9', `${rz(A)} + ${rz(B)}`, t => `Bien buscar dos raíces. Pero la raíz grande no se reparte sobre la suma; repartirla da ${t}.`),
        ...otros.map(([u, w]) => e('TAL-RD-PRODUCTO', `${rz(u)} + ${rz(w)}`, t => `Bien: ${u} + ${w} = ${A}. Pero ${u} · ${w} = ${u * w}, no ${B}; por eso ${t} no es.`)),
      ],
      solucion: [solRD(x, y, A, B), [`${q} = `, Tr(`${rz(x)} + ${rz(y)}`), '.']],
      _datos: { x, y },
    };
  }

  function resta(rng) {
    const [x, y] = parRD(rng), A = x + y, B = x * y;
    if (A === 7 && B === 12) return null;   // √(7 − 2√12) es la predicción de la idea 4
    const otro = otroPar(rng, A, B), q = rdT(A, '−', B);
    return {
      enunciado: [`Se tiene el radical doble ${q}.`],
      pregunta: ['¿A qué es igual, como dos raíces simples?'],
      datos: [D.rd, D.rdm],
      correcta: `${rz(x)} − ${rz(y)}`,
      errores: [
        e('TAL-RD-ORDEN', `${rz(y)} − ${rz(x)}`, t => `Bien ${x} y ${y}, que suman ${A} y multiplican ${B}. Pero ${t} es negativo, y una raíz cuadrada no lo es: va primero la mayor.`),
        e('AL9', `${rz(A)} − ${rz(B)}`, t => `Bien buscar dos raíces. Pero la raíz grande no se reparte sobre la resta; repartirla da ${t}.`),
        otro && e('TAL-RD-PRODUCTO', `${rz(otro[0])} − ${rz(otro[1])}`, t => `Bien: ${otro[0]} + ${otro[1]} = ${A}. Pero ${otro[0]} · ${otro[1]} = ${otro[0] * otro[1]}, no ${B}; por eso ${t} no es.`),
        e('TAL-RD-SIGNO', `${rz(x)} + ${rz(y)}`, t => `Bien ${x} y ${y}. Pero el signo es el del radical doble, −; con + queda ${t}.`),
      ],
      solucion: [solRD(x, y, A, B, '; con el menos, primero va la mayor'), [`${q} = `, Tr(`${rz(x)} − ${rz(y)}`), '.']],
      _datos: { x, y },
    };
  }

  // Un par x > y con xy = c²·M, c ≥ 2 y M ≥ 2 (para escribir 2√B como k√M).
  function parCoef(rng, maxA) {
    for (let i = 0; i < 400; i++) {
      const x = rng.entero(2, maxA - 1), y = rng.entero(1, x - 1), B = x * y, c = mayorCuad(B), M = B / (c * c);
      if (c >= 2 && M >= 2 && x + y <= maxA && limpio(x) && limpio(y) && !(x + y === 7 && B === 12)) return [x, y, c, M];
    }
    return null;
  }

  function sinDos(rng, forzado) {
    const sub = forzado || rng.elegir(['sin2', 'coef']);
    let x, y, A, B, q, paso, falso, C;
    if (sub === 'sin2') {
      [x, y] = parRD(rng); A = x + y; B = x * y; C = 4 * B;
      q = `√(${A} + √${C})`; paso = `√${C} = √(4 · ${B}) = 2√${B}`; falso = C;
    } else {
      const r = parCoef(rng, 15); if (!r) return null;
      let c, M; [x, y, c, M] = r; A = x + y; B = x * y;
      q = `√(${A} + ${2 * c}√${M})`; paso = `${2 * c}√${M} = 2 · ${c}√${M} = 2√${B}`; falso = M;
    }
    const otros = otrosPares(rng, A, B), dos = pares(A).find(([u, w]) => u * w === falso);
    return {
      enunciado: [`Se tiene el radical doble ${q}.`],
      pregunta: ['¿A qué es igual, como dos raíces simples?'],
      datos: [D.rd, D.meter],
      correcta: `${rz(x)} + ${rz(y)}`,
      errores: [
        e('AL9', sub === 'sin2' ? `${rz(A)} + ${rz(C)}` : `${rz(A)} + ${rz(falso)}`, t => `Bien buscar dos raíces. Pero la raíz grande no se reparte sobre la suma; repartirla da ${t}.`),
        e('TAL-RD-SIGNO', `${rz(x)} − ${rz(y)}`, t => `Bien ${x} y ${y}. Pero el signo es el del radical doble, +; con − queda ${t}.`),
        ...otros.filter(([u]) => !dos || u !== dos[0]).map(([u, w]) => e('TAL-RD-PRODUCTO', `${rz(u)} + ${rz(w)}`, t => `Bien: ${u} + ${w} = ${A}. Pero su producto es ${u * w}, no ${B}; por eso ${t} no es.`)),
        dos && e('TAL-RD-DOS', `${rz(dos[0])} + ${rz(dos[1])}`, t => `Bien dos números que suman ${A}. Pero antes hay que dejar un 2 delante de la raíz chica: el producto es ${B}, no ${falso}; así sale ${t}.`),
      ],
      solucion: [
        [`Primero se deja un 2 delante de la raíz chica: ${paso}.`],
        solRD(x, y, A, B),
        [`${q} = `, Tr(`${rz(x)} + ${rz(y)}`), '.'],
      ],
      _datos: { sub, x, y },
    };
  }

  function sumaDobles(rng) {
    const [x, y] = parRD(rng), A = x + y, B = x * y, suma = rng.entero(0, 1) === 1;
    const dos = k => simp(2, k);
    const ans = suma ? dos(x) : dos(y);
    return {
      enunciado: [`Se tiene ${rdT(A, '+', B)} ${suma ? '+' : '−'} ${rdT(A, '−', B)}.`],
      pregunta: ['¿Cuánto vale?'],
      datos: [D.rd, D.rdm],
      correcta: ans,
      errores: [
        e('TAL-RD-CANCELA', suma ? simp(2, A) : '0', t => suma ? `Bien sumar dos radicales parecidos. Pero cada radical doble se escribe primero como √x ± √y; sumar las raíces de ${A} da ${t}.` : `Bien ver que algo se anula. Pero se anulan las √${x}, no todo; así sale ${t}.`),
        e('TAL-RD-CRUZA', suma ? dos(y) : dos(x), t => `Bien ${x} y ${y}. Pero al ${suma ? `sumar se van +${rz(y)} y −${rz(y)}` : `restar se van las dos √${x}`}; ${t} se queda con la otra raíz.`),
        e('TAL-RD-SIGNO', `${rz(x)} + ${rz(y)}`, t => `Bien el primer radical doble, ${t}. Pero falta ${suma ? 'sumar' : 'restar'} el segundo.`),
      ],
      solucion: [
        solRD(x, y, A, B, `: los dos radicales usan √${x} y ${rz(y)}`),
        [`(${rz(x)} + ${rz(y)}) ${suma ? '+' : '−'} (${rz(x)} − ${rz(y)}) = `, Tr(ans), '.'],
      ],
      _datos: { x, y, suma },
    };
  }

  function coefResta(rng) {
    const r = parCoef(rng, 20); if (!r) return null;
    const [x, y, c, M] = r, A = x + y, B = x * y;
    if (A === 7 && B === 12) return null;   // √(7 − 4√3) es la predicción de la idea 4 escrita de otra forma
    const q = `√(${A} − ${2 * c}√${M})`, otro = otroPar(rng, A, B), dos = pares(A).find(([u, w]) => u * w === M);
    return {
      enunciado: [`Se tiene el radical doble ${q}.`],
      pregunta: ['¿A qué es igual, como dos raíces simples?'],
      datos: [D.rd, D.rdm, D.meter],
      correcta: `${rz(x)} − ${rz(y)}`,
      errores: [
        e('TAL-RD-ORDEN', `${rz(y)} − ${rz(x)}`, t => `Bien ${x} y ${y}, que suman ${A} y multiplican ${B}. Pero ${t} es negativo, y una raíz cuadrada no lo es: va primero la mayor.`),
        e('AL9', `${rz(A)} − ${rz(M)}`, t => `Bien buscar dos raíces. Pero la raíz grande no se reparte, y el ${2 * c} no se pierde; repartirla da ${t}.`),
        otro && e('TAL-RD-PRODUCTO', `${rz(otro[0])} − ${rz(otro[1])}`, t => `Bien: ${otro[0]} + ${otro[1]} = ${A}. Pero su producto es ${otro[0] * otro[1]}, no ${B}; por eso ${t} no es.`),
        dos && e('TAL-RD-DOS', `${rz(dos[0])} − ${rz(dos[1])}`, t => `Bien dos números que suman ${A}. Pero antes hay que dejar un 2 delante de la raíz chica: el producto es ${B}, no ${M}; así sale ${t}.`),
      ],
      solucion: [
        [`Se deja un 2 delante de la raíz chica: ${2 * c}√${M} = 2 · ${c}√${M} = 2√${B}.`],
        solRD(x, y, A, B, '; con el menos, primero va la mayor'),
        [`${q} = `, Tr(`${rz(x)} − ${rz(y)}`), '.'],
      ],
      _datos: { x, y },
    };
  }

  // ======================= Idea 5: racionalizar =======================

  // k·raíz sobre den, escrito corto: «2√3», «√5/5», «3√2/2», «(√7 + √3)/2», «2(√7 + √3)/3».
  const coefRaiz = (k, raiz) => `${k === 1 ? '' : k}${raiz}`;
  // Con la raíz cúbica, el número va con «·»: «2 · ³√4» (pegado, «2³√4» se leería como 2³ · √4).
  const coef3 = (k, raiz) => (k === 1 ? raiz : `${k} · ${raiz}`);
  const sobre = (arriba, den) => (den === 1 ? arriba : `${arriba}/${den}`);

  function cometa(rng) {
    const d = rng.entero(2, 9), m = t => `${t} m`;
    const ok = d % 2 === 0 ? coefRaiz(d / 2, '√2') : `${d}√2/2`;
    return {
      enunciado: ['En agosto, en Puno, se hacen volar cometas. Una cometa cuadrada tiene una varilla de punta a punta, su diagonal, de ', Ta(`${d} m`), '.'],
      pregunta: ['¿Cuánto mide su lado, escrito sin raíz en el denominador?'],
      datos: [D.diag, D.uno],
      correcta: m(ok),
      errores: [
        e('TAL-RAC-UNO', m(sobre(String(d % 2 ? d : d / 2), d % 2 ? 2 : 1)), t => `Bien que abajo quede √2 · √2 = 2. Pero si solo cambias abajo, cambia el valor: arriba también va √2; así sale ${t}.`),
        e('TAL-RAC-DEN', m(`${d}√2`), t => `Bien ${d}√2 arriba. Pero abajo quedó √2 · √2 = 2: falta dividir; sin eso sale ${t}.`),
        e('TAL-RAC-DIAG', m(String(d)), t => `Bien que la cometa sea un cuadrado. Pero la varilla de punta a punta es la diagonal, que mide el lado por √2; ${t} es la varilla, no el lado.`),
        e('TAL-RAC-INV', m(`√2/${d}`), t => `Bien llevar la raíz arriba. Pero arriba queda ${d}√2 y abajo 2: la fracción no se invierte; ${t} es otro número.`),
      ],
      solucion: [
        ['La diagonal es el lado por √2, así que el lado es ', Ta(d), '/√2.'],
        ['Se multiplica arriba y abajo por √2, que es multiplicar por 1: ', `${d}/√2 · `, Tu('√2/√2'), ` = ${d}√2/2 = `, Tr(m(ok)), '.'],
      ],
      nombres: { a: 'la varilla, d' },
      _datos: { d },
    };
  }

  function unaRaiz(rng) {
    let A; do { A = rng.entero(2, 15); } while (!limpio(A) || esCuad(A));
    const K = rng.entero(1, 12), g = mcd(K, A), ok = sobre(coefRaiz(K / g, `√${A}`), A / g);
    return {
      enunciado: [`Se tiene la fracción ${K}/√`, Ta(A), '.'],
      pregunta: ['¿Cómo se escribe sin raíz en el denominador?'],
      datos: [D.uno],
      correcta: ok,
      errores: [
        e('TAL-RAC-UNO', sobre(String(K / g), A / g), t => `Bien que abajo quede ${A}. Pero si solo cambias abajo, cambia el valor: arriba también va √${A}; así queda ${t}.`),
        e('TAL-RAC-DEN', coefRaiz(K, `√${A}`), t => `Bien ${t} arriba. Pero abajo quedó √${A} · √${A} = ${A}: falta dividir.`),
        e('TAL-RAC-INV', sobre(`√${A}`, K), t => `Bien llevar la raíz arriba. Pero arriba queda ${coefRaiz(K, `√${A}`)} y abajo ${A}: no se invierte; ${t} es otro número.`),
        K > 1 && e('TAL-RAC-NUM', `√${A}/${A}`, t => `Bien: 1/√${A} = ${t}. Pero arriba hay un ${K}, que también se multiplica por √${A}; sin él queda ${t}.`),
      ],
      solucion: [
        ['Se multiplica arriba y abajo por √', Ta(A), `: ${K}/√${A} · `, Tu(`√${A}/√${A}`), ` = ${coefRaiz(K, `√${A}`)}/${A}.`],
        [g > 1 ? `Se simplifica entre ${g}: ` : 'Queda ', Tr(ok), '.'],
      ],
      _datos: { K, A },
    };
  }

  function conjugado(rng, forzado) {
    const sub = forzado || rng.elegir(['raices', 'entero']);
    let A, B, c = 0;
    if (sub === 'entero') { c = rng.entero(1, 3); do { A = rng.entero(c * c + 1, 15); } while (!limpio(A) || esCuad(A)); B = c * c; }
    else { do { A = rng.entero(3, 15); B = rng.entero(2, A - 1); } while (!limpio(A) || !limpio(B) || esCuad(A) || esCuad(B)); }
    if (sub === 'raices' && A === 5 && B === 3) return null;   // 1/(√5 − √3) es la predicción de la idea 5
    const K = rng.elegir([1, 2, 3, 4, 6]), s = rng.entero(0, 1) ? '+' : '−', inv = s === '+' ? '−' : '+';
    const seg = sub === 'entero' ? String(c) : `√${B}`, Dv = A - B, g = mcd(K, Dv);
    const arriba = (signo, k) => (k === 1 ? `√${A} ${signo} ${seg}` : `${k}(√${A} ${signo} ${seg})`);
    const fr = (signo, k, den) => (den === 1 ? arriba(signo, k) : k === 1 ? `(${arriba(signo, k)})/${den}` : `${arriba(signo, k)}/${den}`);
    const g2 = mcd(K, A + B), ok = fr(inv, K / g, Dv / g);
    return {
      enunciado: [`Se tiene la fracción ${K}/(√`, Ta(A), ` ${s} `, ...(sub === 'entero' ? [Tb(c)] : ['√', Tb(B)]), ').'],
      pregunta: ['¿Cómo se escribe sin raíces en el denominador?'],
      datos: [sub === 'entero' ? D.conjN : D.conj],
      correcta: ok,
      errores: [
        e('TAL-RAC-MISMO', fr(s, K / g, Dv / g), t => `${Dv === 1 ? 'Bien multiplicar arriba y abajo por lo mismo' : `Bien dividir entre ${Dv}`}. Pero arriba va el conjugado: el signo cambia a ${inv}; con el mismo signo queda ${t}.`),
        e('TAL-RAC-SUMA', fr(inv, K / g2, (A + B) / g2), t => `Bien el conjugado arriba. Pero abajo queda ${A} − ${B} = ${Dv}, no ${A} + ${B}; así queda ${t}.`),
        e('TAL-RAC-DEN', arriba(inv, K), t => `Bien el conjugado arriba, ${t}. Pero falta dividir entre ${Dv}, lo que quedó abajo.`),
        e('TAL-RAC-UNO', sobre(String(K / g), Dv / g), t => `Bien que abajo quede ${Dv}. Pero si solo cambias abajo, cambia el valor: arriba también va √${A} ${inv} ${seg}; así queda ${t}.`),
      ],
      solucion: [
        ['Se multiplica arriba y abajo por el conjugado: ', Tu(`(√${A} ${inv} ${seg})/(√${A} ${inv} ${seg})`), `. Abajo queda ${A} − ${B} = ${Dv}.`],
        fr(inv, K, Dv) === ok ? ['Queda ', Tr(ok), '.'] : [fr(inv, K, Dv), `, simplificado entre ${g}: `, Tr(ok), '.'],
      ],
      _datos: { sub, A, B, K, s },
    };
  }

  function cubica(rng) {
    const A = rng.elegir([2, 3, 5, 6, 7]), K = rng.entero(1, 6), g = mcd(K, A), den = A / g;
    const ok = sobre(coef3(K / g, r3(A * A)), den);
    return {
      enunciado: [`Se tiene la fracción ${K}/`, Tn('³'), '√', Ta(A), '.'],
      pregunta: ['¿Cómo se escribe sin raíz en el denominador?'],
      datos: [D.cubica, D.prodC],
      correcta: ok,
      errores: [
        e('TAL-RAC-CUBO', sobre(coef3(K / g, r3(A)), den), t => `Bien la idea de multiplicar por 1. Pero ³√${A} · ³√${A} no da ${A}: hacen falta tres factores; con dos queda ${t}.`),
        e('TAL-RAC-DEN', coef3(K, r3(A * A)), t => `Bien ${t} arriba. Pero abajo quedó ³√${A ** 3} = ${A}: falta dividir.`),
        e('TAL-RAC-UNO', sobre(String(K / g), den), t => `Bien que abajo quede ${A}. Pero si solo cambias abajo, cambia el valor; así queda ${t}.`),
      ],
      solucion: [
        ['Para que abajo haya tres factores ', Tn('³'), '√', Ta(A), `, faltan dos: se multiplica arriba y abajo por ³√${A} · ³√${A} = ³√${A * A}.`],
        [`${K}/³√${A} · `, Tu(`³√${A * A}/³√${A * A}`), ` = ${coef3(K, r3(A * A))}/${A}`, g > 1 ? `, simplificado entre ${g}` : '', ': ', Tr(ok), '.'],
      ],
      _datos: { A, K },
    };
  }

  function dosFracciones(rng) {
    let A, B; do { A = rng.entero(3, 15); B = rng.entero(2, A - 1); } while (!limpio(A) || !limpio(B) || esCuad(A) || esCuad(B));
    if (A === 5 && B === 3) return null;   // los denominadores de la predicción de la idea 5
    const suma = rng.entero(0, 1) === 1, Dv = A - B, g = mcd(2, Dv), g2 = mcd(2, A + B);
    const res = (k, den, r) => sobre(coefRaiz(k, `√${r}`), den);
    const ok = res(2 / g, Dv / g, suma ? A : B);
    return {
      enunciado: [`Se tiene 1/(√`, Ta(A), ' − √', Tb(B), `) ${suma ? '+' : '−'} 1/(√`, Ta(A), ' + √', Tb(B), ').'],
      pregunta: ['¿Cuánto vale?'],
      datos: [D.conj],
      correcta: ok,
      errores: [
        e('TAL-RAC-CANCELA', '0', t => `Bien ver que algo se anula. Pero arriba quedan dos raíces iguales que no se van; ${t} no es.`),
        e('TAL-SIGNO', res(2 / g, Dv / g, suma ? B : A), t => `Bien el denominador ${Dv}. Pero al ${suma ? `sumar se anulan las √${B}` : `restar se anulan las √${A}`}; ${t} se queda con la otra.`),
        e('TAL-RAC-SUMA', res(2 / g2, (A + B) / g2, suma ? A : B), t => `Bien los conjugados. Pero abajo queda ${A} − ${B}, no ${A} + ${B}; así sale ${t}.`),
        Dv > 1 && e('TAL-RAC-DEN', `2√${suma ? A : B}`, t => `Bien ${suma ? 'sumar' : 'restar'} lo de arriba: ${t}. Pero abajo quedó ${A} − ${B} = ${Dv}: falta dividir.`),
      ],
      solucion: [
        ['Cada fracción se racionaliza con el conjugado: abajo queda ', `${A} − ${B} = ${Dv}; arriba, √${A} + √${B} y √${A} − √${B}.`],
        [`(√${A} + √${B}) ${suma ? '+' : '−'} (√${A} − √${B}) = 2√${suma ? A : B}; entre ${Dv}: `, Tr(ok), '.'],
      ],
      _datos: { A, B, suma },
    };
  }

  function inversoRac(rng, forzado) {
    const sub = forzado || rng.elegir(['suma', 'resta']);
    let A; do { A = rng.entero(2, 15); } while (!limpio(A) || esCuad(A) || !limpio(A - 1));
    const B = A - 1, sB = rz(B), x = `√${A} + ${sB}`;
    const ans = sub === 'suma' ? simp(2, A) : simp(2, B), otro = sub === 'suma' ? simp(2, B) : simp(2, A);
    return {
      enunciado: ['Se tiene x = 1/(√', Ta(A), ' − ', ...(esCuad(B) ? [Tb(sB)] : ['√', Tb(B)]), ').'],
      pregunta: [`¿Cuánto vale x ${sub === 'suma' ? '+' : '−'} 1/x?`],
      datos: [D.conj, esCuad(B) ? D.conjN : D.uno],
      correcta: ans,
      errores: [
        e('TAL-SIGNO', otro, t => `Bien x = ${x} y 1/x = √${A} − ${sB}. Pero al ${sub === 'suma' ? `sumar se van +${sB} y −${sB}` : `restar se van las dos √${A}`}; ${t} se queda con la otra raíz.`),
        e('TAL-RAC-CANCELA', '0', t => `Bien racionalizar x. Pero x y 1/x no son opuestos: ${t} no es.`),
        e('TAL-RAC-PARCIAL', x, t => `Bien: con el conjugado, abajo queda ${A} − ${B} = 1 y x = ${t}. Pero falta ${sub === 'suma' ? 'sumarle' : 'restarle'} 1/x.`),
      ],
      solucion: [
        ['Con el conjugado, abajo queda ', `${A} − ${B} = 1: x = ${x}. Y 1/x es √${A} − ${sB}.`],
        [`(${x}) ${sub === 'suma' ? '+' : '−'} (√${A} − ${sB}) = `, Tr(ans), '.'],
      ],
      _datos: { sub, A },
    };
  }

  const CONSTRUIR = {
    desarrolla, terreno, numero, completar, 'suma-producto': sumaProducto, inverso, figura,
    cercanos, triplay, 'suma-diferencia': sumaDiferencia, xpq, legendre, 'cambio-variable': cambioVariable, sextas,
    'desarrolla-cubo': desarrollaCubo, taco, 'numero-cubo': numeroCubo, coeficiente, 'suma-producto-cubo': sumaProductoCubo,
    'factoriza-cubos': factorizaCubos,
    mesa, simple, resta, 'sin-dos': sinDos, 'suma-dobles': sumaDobles, 'coef-resta': coefResta,
    cometa, 'una-raiz': unaRaiz, conjugado, cubica, 'dos-fracciones': dosFracciones, 'inverso-rac': inversoRac,
  };

  return { id: ID, titulo: 'Productos notables', generar, TIPOS_POR_IDEA, NIVEL, TIPOS: Object.keys(CONSTRUIR) };
});
