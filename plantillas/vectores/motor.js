/*
 * Motor de «Flechas que se suman»: vectores y análisis dimensional.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorVectores) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Vectores en el plano: { x, y } o [x, y]; ángulos en grados, medidos desde el eje x positivo, antihorario.
 *
 *   trig(grados, { exacto })       seno y coseno. Por defecto 37° y 53° (y sus reflejos: 127°, 143°, 217°…) usan
 *                                  el triángulo notable 3-4-5 de las academias, que es aproximado (sen 37° real es
 *                                  0,6018…); con { exacto: true } se usa la trigonometría exacta.
 *   vector(modulo, angulo)         el vector con ese módulo y esa dirección: componentes, módulo y ángulo
 *   polar(v)                       módulo y ángulo de un vector dado por componentes
 *   suma(lista)                    resultante por componentes (método del polígono: cola en la punta)
 *   resta(u, v)                    u − v = u + (−v)
 *   resultante(a, b, theta)        dos módulos y el ángulo entre ellos: R² = a² + b² + 2ab·cos θ (ley de cosenos)
 *   rango(a, b)                    |a − b| ≤ R ≤ a + b, con el ángulo de cada extremo
 *   barrido(a, b, n)               R para θ de 0° a 180°: siempre baja
 *   componentes(modulo, angulo)    las proyecciones sobre los ejes (sombras): módulo·cos y módulo·sen
 *   unitario(v)                    v dividido entre su módulo
 *   escalar(u, v), anguloEntre(u, v), vectorial(u, v)   producto escalar, ángulo y producto vectorial (3D)
 *   hexagono(L)                    los cinco vectores que salen de un vértice de un hexágono regular de lado L
 *   dimension(expr), texto(dim), producto, cociente, potencia, homogenea(terminos)
 *   constante(miembro, factores)   la dimensión de una constante K en un término K·(factores) que debe pesar
 *                                  lo mismo que el miembro (principio de homogeneidad)
 *   exponentes(miembro, factores)  despeja los exponentes de una fórmula miembro = k·A^α·B^β·C^γ (k sin dimensión)
 *
 * Versión 0.2.0 (figuras, sólidos y componentes). Puntos y vectores del plano como arriba; en el espacio, { x, y, z }.
 *   division(A, B, m, n)           P sobre el segmento AB con AP : PB = m : n (A y B son las puntas de OA y OB):
 *                                  OP = (n·OA + m·OB)/(m + n), pesos CRUZADOS. Da x, y, pesoA = n/(m+n), pesoB = m/(m+n),
 *                                  textoA, textoB, AP, PB; errores: derechos (pesos m/(m+n) y n/(m+n)), mitades (½ y ½) y
 *                                  sinDividir (pesos n y m), cada uno con su punto x, y.
 *   baricentro(P, Q, R)            G = (P + Q + R)/3; medio = M, punto medio de QR; mediana = PM y desdeVertice = PG (con
 *                                  modulo); fraccion = PG/PM = 2/3 y texto «2/3»; errores: invertido (1/3), mitad (1/2) y
 *                                  tresCuartos (3/4), cada uno con fraccion y el punto x, y sobre la mediana.
 *   trapecio(A, B, C, D)           AB ∥ DC, a = AB y b = DC con el mismo sentido; M y N, puntos medios de las diagonales
 *                                  AC y BD; MN = N − M = (a − b)/2 (coefA = 1/2, coefB = −1/2); mediana = (a + b)/2;
 *                                  errores: semisuma (a + b)/2, sinMitad a − b y opuesto (b − a)/2, con x, y y modulo.
 *   reduccion(figura)              figura = { puntos: { P: [x, y], … }, vectores: [['P', 'A'], …], marcado: ['P', 'Q'] }.
 *                                  Suma todas las flechas (x, y, modulo) y da k con R = k·c (c, el marcado; null si R no es
 *                                  paralela a c); grupos: caminos de flechas, cola con punta, de la cola a la punta del
 *                                  marcado (cada uno vale c; el último es el marcado mismo); sobran: las que no entran en un
 *                                  camino; errores: menosUno (k − 1)|c|, masUno (k + 1)|c|, doble 2k|c|, sumaModulos y
 *                                  soloMarcado |c|.
 *   caja(a, b, c), cubo(a), tetraedro(a, b, c)   vértices con coordenadas. Caja: largo a en x, fondo b en y, alto c en z;
 *                                  A(0,0,0) B(a,0,0) C(a,b,0) D(0,b,0) abajo y E F G H arriba (E sobre A, F sobre B…);
 *                                  aristas con su direccion 'x', 'y' o 'z'; diagonal = √(a² + b² + c²). Cubo: la caja con
 *                                  a = b = c. Tetraedro trirrectángulo: O en el origen y A, B, C sobre los ejes x, y, z.
 *   sumaSolido(solido, pares)      solido: el de arriba o { tipo: 'cubo' | 'caja' | 'tetraedro', a, b, c }; pares: [['A',
 *                                  'G'], …], cada vector es final menos inicio. Da x, y, z, modulo y vectores; errores:
 *                                  sumaModulos, plano (la suma medida en el dibujo como si fuera plano, con el fondo (y) a
 *                                  45° y su largo real: (x + y/√2, z + y/√2)), sinProfundidad (sin la componente y),
 *                                  alReves (lista: el módulo con el vector i dado vuelta) y seAnulan 0.
 *   inversoSumaDiferencia(k)       dos vectores IGUALES con |A + B| = k·|A − B|: cos θ = (k² − 1)/(k² + 1); theta exacto,
 *                                  academia (el notable 37, 53, 60, 90, 120, 127 o 143 si cos θ es 4/5, 3/5, 1/2, 0, −1/2,
 *                                  −3/5 o −4/5; si no, theta), notable, mitad = academia/2; errores: complementario
 *                                  90 − academia, diagonalesPerpendiculares 90 y conResultante academia/2.
 *   girarEjes(lista, angulo)       ejes x′ e y′ girados 'angulo' grados (antihorario); cada vector como {x, y}, [x, y] o
 *                                  {modulo, angulo} (trigonometría exacta). x′ = x cos φ + y sen φ, y′ = −x sen φ + y cos φ.
 *                                  Da vectores (x, y, modulo, angulo en los ejes nuevos), resultante (igual) y original (la
 *                                  resultante en los ejes de antes); errores: anguloDeReferencia (el agudo de R con el eje
 *                                  x′), anguloComplementario (90° menos ese) y anguloOriginal (el ángulo de R desde x).
 *   proyeccion(u, v)               la sombra de u sobre la dirección de v, con signo: escalar = u·v/|v|; producto = u·v;
 *                                  vector = (u·v/|v|²)·v; angulo entre u y v; errores: conSeno |u × v|/|v| e invertida u·v/|u|.
 *   area(u, v)                     z de u × v; paralelogramo = |u × v|; triangulo = |u × v|/2; sentido 'sale' (z > 0, hacia
 *                                  quien mira la pantalla), 'entra' (z < 0) o 'ninguno'; errores: sinMitad |u × v|,
 *                                  conCoseno |u·v|/2 y manoInvertida (el sentido contrario).
 *   unitarioConModulo(v, modulo)   w = modulo·v/|v| (x, y), antiparalelo −w, unitario v/|v|, factor = modulo/|v|; errores:
 *                                  sinEscalar (el unitario), sinDividir (modulo·v), opuesto (−w) y escalado (factor·unitario,
 *                                  como si el unitario de w = factor·v fuera factor veces el de v).
 *   dosSentidos(A, B, eje, modulo) A y B como [x, y] con null en las dos incógnitas (una en la componente del eje 'x' o 'y' y
 *                                  otra en la otra). R = A + B sobre ese eje y con ese módulo: la otra componente de R es 0 y
 *                                  la del eje, ±modulo (dos sentidos). soluciones: [positivo, negativo], cada una con A, B,
 *                                  R, incognitaEje, incognitaOtra y sentido; ecuacion: otra y cuadrado (modulo²); errores:
 *                                  unaSola (la positiva), signoCambiado [modulo + c, −modulo + c] y olvidaComponente
 *                                  [modulo, −modulo], donde c es la parte conocida de la componente del eje.
 *   radical(x)                     texto de x como entero, k√n o p ± q√n («2√3», «2 + 2√2»); null si no lo encuentra.
 *
 * Cada resultado que alimenta una predicción trae un campo 'errores' con lo que dan los errores típicos.
 * No hay informe propio de ideas erróneas sobre vectores: casi todos son hipótesis nuestras (ver index.html).
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorVectores = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TOL = 1e-9;
  const RAD = Math.PI / 180;
  const limpio = (x, esc) => (Math.abs(x) <= TOL * Math.max(1, esc || 1) ? 0 : x);

  function numero(x, que) {
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    return x;
  }
  function positivo(x, que) {
    numero(x, que);
    if (!(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    return x;
  }
  function vec(v, que) {
    let x, y;
    if (Array.isArray(v)) { x = v[0]; y = v[1]; }
    else if (v && typeof v === 'object') { x = v.x; y = v.y; }
    if (typeof x !== 'number' || typeof y !== 'number' || !Number.isFinite(x) || !Number.isFinite(y))
      throw new Error(`${que || 'el vector'} debe tener componentes numéricas x e y`);
    return { x: x + 0, y: y + 0 };
  }

  // ---------- Seno y coseno, con los notables de academia ----------
  function trig(grados, o) {
    numero(grados, 'el ángulo');
    const exacto = !!(o && o.exacto);
    const g = ((grados % 360) + 360) % 360;
    const q = Math.floor(g / 90), r = g - 90 * q;
    let c, s, notable = false;
    if (Math.abs(r) < 1e-12) { c = 1; s = 0; }
    else if (!exacto && Math.abs(r - 37) < 1e-12) { c = 4 / 5; s = 3 / 5; notable = true; }
    else if (!exacto && Math.abs(r - 53) < 1e-12) { c = 3 / 5; s = 4 / 5; notable = true; }
    else if (Math.abs(r - 30) < 1e-12) { c = Math.sqrt(3) / 2; s = 1 / 2; }
    else if (Math.abs(r - 45) < 1e-12) { c = Math.SQRT1_2; s = Math.SQRT1_2; }
    else if (Math.abs(r - 60) < 1e-12) { c = 1 / 2; s = Math.sqrt(3) / 2; }
    else { c = Math.cos(r * RAD); s = Math.sin(r * RAD); }
    // girar (c, s) q cuartos de vuelta
    for (let k = 0; k < q; k++) { const t = c; c = -s; s = t; }
    return { cos: c + 0, sen: s + 0, notable };
  }

  function polar(v0) {
    const v = vec(v0);
    const modulo = Math.hypot(v.x, v.y);
    let angulo = modulo === 0 ? 0 : Math.atan2(v.y, v.x) / RAD;
    if (angulo < 0) angulo += 360;
    if (Math.abs(angulo - 360) < 1e-9) angulo = 0;
    return { x: v.x, y: v.y, modulo, angulo };
  }
  function vector(modulo, angulo, o) {
    numero(modulo, 'el módulo');
    if (modulo < 0) throw new Error('el módulo no puede ser negativo');
    const t = trig(angulo, o);
    const x = limpio(modulo * t.cos, modulo), y = limpio(modulo * t.sen, modulo);
    return { x, y, modulo, angulo: ((angulo % 360) + 360) % 360, notable: t.notable };
  }

  // ---------- Suma y resta ----------
  function suma(lista) {
    if (!Array.isArray(lista) || lista.length === 0) throw new Error('la suma necesita una lista de vectores');
    const vs = lista.map((v, k) => vec(v, `el vector ${k + 1}`));
    let x = 0, y = 0, sumaModulos = 0;
    const puntas = [{ x: 0, y: 0 }];
    for (const v of vs) { x += v.x; y += v.y; sumaModulos += Math.hypot(v.x, v.y); puntas.push({ x, y }); }
    const esc = Math.max(1, sumaModulos);
    x = limpio(x, esc); y = limpio(y, esc);
    const p = polar({ x, y });
    return {
      x, y, modulo: limpio(p.modulo, esc), angulo: p.angulo, cerrado: p.modulo <= TOL * esc,
      puntas,   // método del polígono: cada vector empieza donde terminó el anterior
      errores: { sumaModulos },
    };
  }
  function resta(u0, v0) {
    const u = vec(u0, 'u'), v = vec(v0, 'v');
    const d = suma([u, { x: -v.x, y: -v.y }]);
    return Object.assign(d, { errores: { sumaEnVezDeResta: suma([u, v]).modulo, restaModulos: Math.abs(Math.hypot(u.x, u.y) - Math.hypot(v.x, v.y)) } });
  }

  // ---------- Dos vectores con un ángulo entre ellos ----------
  function resultante(a, b, theta, o) {
    numero(a, 'el módulo a'); numero(b, 'el módulo b');
    if (a < 0 || b < 0) throw new Error('los módulos no pueden ser negativos');
    const t = trig(theta, o);
    const cruzado = 2 * a * b * t.cos;
    const R2 = limpio(a * a + b * b + cruzado, a * a + b * b);
    const R = Math.sqrt(Math.max(0, R2));
    // Comprobación por componentes, con a sobre el eje x
    const bx = b * t.cos, by = b * t.sen;
    const Rx = a + bx, Ry = by;
    let angulo = R === 0 ? 0 : Math.atan2(Ry, Rx) / RAD;
    if (angulo < 0) angulo += 360;
    return {
      R, R2, terminoCruzado: limpio(cruzado, a * b), cos: t.cos, notable: t.notable,
      componentes: { x: limpio(Rx, a + b), y: limpio(Ry, a + b) },
      porComponentes: Math.hypot(Rx, Ry),
      angulo,   // ángulo entre R y a
      errores: {
        sumaModulos: a + b,                                          // sumar los módulos como números
        restaModulos: Math.abs(a - b),                               // restarlos
        cosenoMenos: Math.sqrt(Math.max(0, a * a + b * b - cruzado)), // ley de cosenos del triángulo con el signo menos
        pitagoras: Math.sqrt(a * a + b * b),                          // usar Pitágoras con cualquier ángulo
        sinCuadrados: Math.sqrt(a + b),                               // la raíz sin elevar al cuadrado
      },
    };
  }
  function rango(a, b) {
    numero(a, 'el módulo a'); numero(b, 'el módulo b');
    if (a < 0 || b < 0) throw new Error('los módulos no pueden ser negativos');
    return {
      minimo: Math.abs(a - b), maximo: a + b, thetaMinimo: 180, thetaMaximo: 0,
      perpendicular: Math.hypot(a, b),
      errores: { minimoCero: 0, entreModulos: [Math.min(a, b), Math.max(a, b)], maximoPerpendicular: Math.hypot(a, b) },
    };
  }
  function barrido(a, b, n) {
    const N = n === undefined ? 18 : n;
    if (!Number.isInteger(N) || N < 1) throw new Error('n debe ser un entero positivo');
    const puntos = [];
    for (let k = 0; k <= N; k++) { const th = 180 * k / N; puntos.push({ theta: th, R: resultante(a, b, th, { exacto: true }).R }); }
    let decrece = true;
    for (let k = 1; k < puntos.length; k++) if (!(puntos[k].R < puntos[k - 1].R + 1e-12)) decrece = false;
    const R90 = resultante(a, b, 90).R;
    return { puntos, decrece, R90, errores: { minimoEn90: R90 } };
  }

  // ---------- Componentes (las sombras sobre los ejes) ----------
  function componentes(modulo, angulo, o) {
    const v = vector(modulo, angulo, o);
    const t = trig(angulo, o);
    return {
      x: v.x, y: v.y, modulo, angulo: v.angulo, notable: t.notable,
      sumaCuadrados: v.x * v.x + v.y * v.y,
      errores: {
        cambiados: { x: limpio(modulo * t.sen, modulo), y: limpio(modulo * t.cos, modulo) },  // sen y cos al revés
        vectorEntero: modulo,                                   // creer que la sombra mide lo mismo que el vector
        sumanModulo: { x: modulo - Math.abs(v.y) },             // creer que las componentes suman el módulo
      },
    };
  }

  function unitario(v0) {
    const v = vec(v0), m = Math.hypot(v.x, v.y);
    if (!(m > 0)) throw new Error('el vector nulo no tiene vector unitario');
    const s = Math.abs(v.x) + Math.abs(v.y);
    return {
      x: v.x / m, y: v.y / m, modulo: 1, moduloOriginal: m,
      errores: {
        sinDividir: { x: v.x, y: v.y },                         // olvidar dividir entre el módulo
        entreSuma: { x: v.x / s, y: v.y / s },                   // dividir entre la suma de las componentes
        unos: { x: Math.sign(v.x), y: Math.sign(v.y) },          // poner 1 en cada componente
        moduloEntreSuma: Math.hypot(v.x / s, v.y / s),
      },
    };
  }

  // ---------- Productos ----------
  function vec3(v, que) {
    let x, y, z;
    if (Array.isArray(v)) { x = v[0]; y = v[1]; z = v[2] === undefined ? 0 : v[2]; }
    else if (v && typeof v === 'object') { x = v.x; y = v.y; z = v.z === undefined ? 0 : v.z; }
    if (![x, y, z].every(c => typeof c === 'number' && Number.isFinite(c))) throw new Error(`${que || 'el vector'} debe tener componentes numéricas`);
    return { x, y, z };
  }
  function escalar(u0, v0) { const u = vec3(u0, 'u'), v = vec3(v0, 'v'); return u.x * v.x + u.y * v.y + u.z * v.z; }
  function anguloEntre(u0, v0) {
    const u = vec3(u0, 'u'), v = vec3(v0, 'v');
    const mu = Math.hypot(u.x, u.y, u.z), mv = Math.hypot(v.x, v.y, v.z);
    if (!(mu > 0 && mv > 0)) throw new Error('el vector nulo no forma ángulo');
    const c = Math.max(-1, Math.min(1, escalar(u, v) / (mu * mv)));
    return Math.acos(c) / RAD;
  }
  function vectorial(u0, v0) {
    const u = vec3(u0, 'u'), v = vec3(v0, 'v');
    const p = { x: u.y * v.z - u.z * v.y, y: u.z * v.x - u.x * v.z, z: u.x * v.y - u.y * v.x };
    const mu = Math.hypot(u.x, u.y, u.z), mv = Math.hypot(v.x, v.y, v.z);
    return {
      x: p.x + 0, y: p.y + 0, z: p.z + 0, modulo: Math.hypot(p.x, p.y, p.z),
      errores: { conCoseno: Math.abs(escalar(u, v)), productoModulos: mu * mv },
    };
  }

  // ---------- Hexágono regular ----------
  // Centro en el origen; A a la izquierda y los demás en sentido horario: A(−L, 0), B arriba a la izquierda, …, D(L, 0).
  function hexagono(L) {
    positivo(L, 'el lado');
    const nombres = ['A', 'B', 'C', 'D', 'E', 'F'];
    const vertices = {};
    nombres.forEach((n, k) => { const v = vector(L, 180 - 60 * k, { exacto: true }); vertices[n] = { x: limpio(v.x, L), y: limpio(v.y, L) }; });
    const A = vertices.A;
    const desdeA = {};
    for (const n of nombres.slice(1)) {
      const d = { x: limpio(vertices[n].x - A.x, L), y: limpio(vertices[n].y - A.y, L) };
      desdeA['A' + n] = Object.assign(d, { modulo: Math.hypot(d.x, d.y) });
    }
    const lista = Object.values(desdeA);
    const s = suma(lista);
    const par = (p, q) => suma([desdeA[p], desdeA[q]]);
    return {
      vertices, desdeA, x: s.x, y: s.y, modulo: s.modulo,
      enDiagonales: s.modulo / desdeA.AD.modulo,   // la suma es 3 veces la diagonal AD
      pares: { 'AB+AF': par('AB', 'AF'), 'AC+AE': par('AC', 'AE') },
      errores: { sumaModulos: s.errores.sumaModulos, seAnulan: 0, soloDiagonal: desdeA.AD.modulo },
    };
  }

  // ---------- Análisis dimensional ----------
  // Las siete magnitudes fundamentales del SI y su símbolo de dimensión.
  const BASES = ['L', 'M', 'T', 'I', 'Θ', 'N', 'J'];
  const FUNDAMENTALES = {
    longitud: { dim: { L: 1 }, unidad: 'm' }, masa: { dim: { M: 1 }, unidad: 'kg' }, tiempo: { dim: { T: 1 }, unidad: 's' },
    corriente: { dim: { I: 1 }, unidad: 'A' }, temperatura: { dim: { 'Θ': 1 }, unidad: 'K' },
    cantidadDeSustancia: { dim: { N: 1 }, unidad: 'mol' }, intensidadLuminosa: { dim: { J: 1 }, unidad: 'cd' },
  };
  const DERIVADAS = {
    area: { L: 2 }, volumen: { L: 3 }, velocidad: { L: 1, T: -1 }, aceleracion: { L: 1, T: -2 },
    fuerza: { M: 1, L: 1, T: -2 }, trabajo: { M: 1, L: 2, T: -2 }, energia: { M: 1, L: 2, T: -2 },
    potencia: { M: 1, L: 2, T: -3 }, presion: { M: 1, L: -1, T: -2 }, densidad: { M: 1, L: -3 },
    frecuencia: { T: -1 }, velocidadAngular: { T: -1 }, cantidadDeMovimiento: { M: 1, L: 1, T: -1 },
    impulso: { M: 1, L: 1, T: -1 }, caudal: { L: 3, T: -1 }, carga: { I: 1, T: 1 }, angulo: {}, numero: {},
  };
  const MAGNITUDES = {};
  for (const [k, v] of Object.entries(FUNDAMENTALES)) MAGNITUDES[k] = { dim: v.dim, unidad: v.unidad, fundamental: true };
  for (const [k, v] of Object.entries(DERIVADAS)) MAGNITUDES[k] = { dim: v, fundamental: false };

  function normal(d) {
    const r = {};
    for (const b of BASES) if (d[b] !== undefined && Math.abs(d[b]) > 1e-12) r[b] = d[b] + 0;
    return r;
  }
  // expr: nombre de magnitud ('fuerza'), dimensión por bases ({ L: 1, T: -2 }) o mezcla de magnitudes con exponente
  // ({ velocidad: 1, tiempo: 1 }).
  function dimension(expr) {
    if (typeof expr === 'string') {
      const m = MAGNITUDES[expr];
      if (!m) throw new Error(`no conozco la magnitud «${expr}»`);
      return normal(m.dim);
    }
    if (!expr || typeof expr !== 'object' || Array.isArray(expr)) throw new Error('la dimensión debe ser un nombre o un objeto');
    const r = {};
    for (const [k, e] of Object.entries(expr)) {
      numero(e, `el exponente de ${k}`);
      if (BASES.includes(k)) r[k] = (r[k] || 0) + e;
      else if (MAGNITUDES[k]) for (const [b, x] of Object.entries(MAGNITUDES[k].dim)) r[b] = (r[b] || 0) + x * e;
      else throw new Error(`no conozco la magnitud «${k}»`);
    }
    return normal(r);
  }
  const producto = (...ds) => { const r = {}; for (const d0 of ds) { const d = dimension(d0); for (const b in d) r[b] = (r[b] || 0) + d[b]; } return normal(r); };
  const potencia = (d0, k) => { numero(k, 'el exponente'); const d = dimension(d0), r = {}; for (const b in d) r[b] = d[b] * k; return normal(r); };
  const cociente = (p, q) => producto(p, potencia(q, -1));
  const iguales = (p, q) => { const a = dimension(p), b = dimension(q); return BASES.every(k => Math.abs((a[k] || 0) - (b[k] || 0)) < 1e-9); };

  // Fracción corta para un exponente: 0,5 → "1/2"; −1,5 → "−3/2".
  function fraccion(x) {
    numero(x, 'el número');
    for (let d = 1; d <= 12; d++) {
      const n = Math.round(x * d);
      if (Math.abs(n / d - x) < 1e-9) return d === 1 ? String(n).replace('-', '−') : `${n < 0 ? '−' : ''}${Math.abs(n)}/${d}`;
    }
    return String(x).replace('-', '−').replace('.', ',');
  }
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '−': '⁻' };
  // Texto con el orden de las academias: M, L, T, luego el resto. Sin dimensión: "1". Fracciones: L^(1/2).
  function texto(d0) {
    const d = dimension(d0), orden = ['M', 'L', 'T', 'I', 'Θ', 'N', 'J'];
    const partes = orden.filter(b => d[b] !== undefined).map(b => {
      const e = fraccion(d[b]);
      if (e === '1') return b;
      if (e.includes('/')) return `${b}^(${e})`;   // exponente fraccionario: L^(1/2)
      return b + [...e].map(ch => SUP[ch] || ch).join('');
    });
    return partes.length ? partes.join('') : '1';
  }
  function homogenea(terminos) {
    if (!Array.isArray(terminos) || terminos.length < 2) throw new Error('hacen falta al menos dos términos');
    const ds = terminos.map(dimension);
    const distintos = [];
    ds.forEach((d, k) => { if (!iguales(d, ds[0])) distintos.push(k); });
    return { homogenea: distintos.length === 0, dimensiones: ds, textos: ds.map(texto), distintos };
  }
  // Término K·Π(factor^exp) que debe pesar lo mismo que el miembro: [K] = [miembro] / Π[factor]^exp.
  // factores: [{ dim, exp }] (exp 1 si falta).
  function constante(miembro, factores) {
    if (!Array.isArray(factores)) throw new Error('los factores deben ser una lista');
    const m = dimension(miembro);
    const fs = factores.map((f, k) => { if (!f || f.dim === undefined) throw new Error(`al factor ${k + 1} le falta dim`); return { dim: dimension(f.dim), exp: f.exp === undefined ? 1 : numero(f.exp, 'el exponente') }; });
    const prod = producto({}, ...fs.map(f => potencia(f.dim, f.exp)));
    const prodUno = producto({}, ...fs.map(f => f.dim));
    const dim = cociente(m, prod);
    return {
      dimension: dim, texto: texto(dim),
      errores: {
        igualAlMiembro: texto(m),                          // creer que la constante pesa lo mismo que el miembro
        multiplica: texto(producto(m, prod)),               // multiplicar en vez de dividir
        exponenteUno: texto(cociente(m, prodUno)),          // dividir sin el exponente del factor
      },
    };
  }
  // miembro = k · Π factor_i^(x_i), con k un número. Resuelve un sistema lineal por bases (eliminación de Gauss).
  // factores: [{ nombre, dim }].
  function exponentes(miembro, factores) {
    if (!Array.isArray(factores) || factores.length === 0) throw new Error('faltan los factores');
    const m = dimension(miembro);
    const fs = factores.map((f, k) => { if (!f || !f.nombre || f.dim === undefined) throw new Error(`al factor ${k + 1} le falta nombre o dim`); return { nombre: f.nombre, dim: dimension(f.dim) }; });
    const bases = BASES.filter(b => m[b] !== undefined || fs.some(f => f.dim[b] !== undefined));
    const n = fs.length;
    const filas = bases.map(b => [...fs.map(f => f.dim[b] || 0), m[b] || 0]);
    const ecuaciones = bases.map((b, i) => ({ base: b, coeficientes: filas[i].slice(0, n), igual: filas[i][n] }));
    // Gauss con pivoteo parcial
    const A = filas.map(f => f.slice());
    let fila = 0; const pivotes = [];
    for (let col = 0; col < n && fila < A.length; col++) {
      let p = fila; for (let r = fila + 1; r < A.length; r++) if (Math.abs(A[r][col]) > Math.abs(A[p][col])) p = r;
      if (Math.abs(A[p][col]) < 1e-12) continue;
      [A[fila], A[p]] = [A[p], A[fila]];
      const piv = A[fila][col];
      for (let c = col; c <= n; c++) A[fila][c] /= piv;
      for (let r = 0; r < A.length; r++) if (r !== fila && Math.abs(A[r][col]) > 1e-15) { const f = A[r][col]; for (let c = col; c <= n; c++) A[r][c] -= f * A[fila][c]; }
      pivotes.push(col); fila++;
    }
    const compatible = A.slice(fila).every(r => Math.abs(r[n]) < 1e-9);
    const unica = compatible && pivotes.length === n;
    const valores = {};
    if (unica) pivotes.forEach((col, i) => { valores[fs[col].nombre] = limpio(A[i][n]) + 0; });
    const textos = {};
    for (const k in valores) textos[k] = fraccion(valores[k]);
    return {
      exponentes: valores, textos, compatible, unica, bases, ecuaciones,
      errores: { todosUno: Object.fromEntries(fs.map(f => [f.nombre, 1])) },
    };
  }

  // ================= 0.2.0: figuras, sólidos y componentes =================
  const comb = (p, A, q, B) => ({ x: limpio(p * A.x + q * B.x, Math.abs(p * A.x) + Math.abs(q * B.x) + 1), y: limpio(p * A.y + q * B.y, Math.abs(p * A.y) + Math.abs(q * B.y) + 1) });
  const conModulo = v => Object.assign(v, { modulo: Math.hypot(v.x, v.y) });

  // Punto P del segmento AB con AP : PB = m : n. OP = (n·OA + m·OB)/(m + n): cada extremo pesa el trozo OPUESTO.
  function division(A0, B0, m, n) {
    const A = vec(A0, 'A'), B = vec(B0, 'B');
    positivo(m, 'm'); positivo(n, 'n');
    const s = m + n, pA = n / s, pB = m / s;
    const P = comb(pA, A, pB, B);
    const err = (p, q) => Object.assign({ pesoA: p, pesoB: q }, comb(p, A, q, B));
    return {
      x: P.x, y: P.y, pesoA: pA, pesoB: pB, textoA: fraccion(pA), textoB: fraccion(pB),
      AP: Math.hypot(P.x - A.x, P.y - A.y), PB: Math.hypot(B.x - P.x, B.y - P.y),
      errores: {
        derechos: err(m / s, n / s),      // a cada extremo el peso de su propio trozo
        mitades: err(1 / 2, 1 / 2),       // el punto medio, sea cual sea la razón
        sinDividir: err(n, m),            // los pesos cruzados sin dividir entre m + n
      },
    };
  }

  // Baricentro G del triángulo PQR y la mediana desde P (hasta el punto medio M de QR): PG = (2/3)·PM.
  function baricentro(P0, Q0, R0) {
    const P = vec(P0, 'P'), Q = vec(Q0, 'Q'), R = vec(R0, 'R');
    const area2 = (Q.x - P.x) * (R.y - P.y) - (Q.y - P.y) * (R.x - P.x);
    if (Math.abs(area2) < 1e-9) throw new Error('los tres puntos están alineados: no hay triángulo');
    const G = { x: (P.x + Q.x + R.x) / 3, y: (P.y + Q.y + R.y) / 3 };
    const M = { x: (Q.x + R.x) / 2, y: (Q.y + R.y) / 2 };
    const PM = conModulo({ x: M.x - P.x, y: M.y - P.y }), PG = conModulo({ x: G.x - P.x, y: G.y - P.y });
    const en = f => ({ fraccion: f, x: P.x + f * PM.x, y: P.y + f * PM.y });
    return {
      x: G.x, y: G.y, medio: M, mediana: PM, desdeVertice: PG, fraccion: PG.modulo / PM.modulo, texto: fraccion(PG.modulo / PM.modulo),
      errores: { invertido: en(1 / 3), mitad: en(1 / 2), tresCuartos: en(3 / 4) },
    };
  }

  // Trapecio ABCD con AB ∥ DC. a = AB y b = DC (el mismo sentido). M y N, puntos medios de las diagonales AC y BD:
  // MN = (a − b)/2, la semidiferencia; la base media (de los lados no paralelos) es la semisuma (a + b)/2.
  function trapecio(A0, B0, C0, D0) {
    const A = vec(A0, 'A'), B = vec(B0, 'B'), C = vec(C0, 'C'), D = vec(D0, 'D');
    const a = { x: B.x - A.x, y: B.y - A.y }, b = { x: C.x - D.x, y: C.y - D.y };
    if (Math.abs(a.x * b.y - a.y * b.x) > 1e-9 * Math.max(1, Math.hypot(a.x, a.y) * Math.hypot(b.x, b.y)) || a.x * b.x + a.y * b.y <= 0)
      throw new Error('AB y DC tienen que ser paralelos y con el mismo sentido');
    const M = { x: (A.x + C.x) / 2, y: (A.y + C.y) / 2 }, N = { x: (B.x + D.x) / 2, y: (B.y + D.y) / 2 };
    const MN = conModulo({ x: limpio(N.x - M.x, 1), y: limpio(N.y - M.y, 1) });
    return {
      M, N, MN, a: conModulo(a), b: conModulo(b), coefA: 1 / 2, coefB: -1 / 2,
      mediana: conModulo(comb(1 / 2, a, 1 / 2, b)),
      errores: {
        semisuma: conModulo(comb(1 / 2, a, 1 / 2, b)),   // la base media en vez de MN
        sinMitad: conModulo(comb(1, a, -1, b)),          // a − b sin dividir entre 2
        opuesto: conModulo(comb(-1 / 2, a, 1 / 2, b)),   // (b − a)/2: el sentido al revés
      },
    };
  }

  // Figura plana: puntos con nombre, vectores como pares de puntos y uno marcado (que también se dibuja).
  // Busca caminos de flechas, cola con punta, que van de la cola a la punta del marcado: cada uno vale lo mismo que él.
  // figura = { puntos: { P: [x, y], … }, vectores: [['P', 'A'], …], marcado: ['P', 'Q'] }
  function reduccion(fig) {
    if (!fig || !fig.puntos || !Array.isArray(fig.vectores) || !Array.isArray(fig.marcado)) throw new Error('la figura necesita puntos, vectores y marcado');
    const pt = n => { if (!fig.puntos[n]) throw new Error(`no hay un punto ${n}`); return vec(fig.puntos[n], n); };
    const vs = fig.vectores.map(([p, q]) => { const P = pt(p), Q = pt(q); return conModulo({ de: p, a: q, x: Q.x - P.x, y: Q.y - P.y }); });
    const [m0, m1] = fig.marcado;
    const c = conModulo({ x: pt(m1).x - pt(m0).x, y: pt(m1).y - pt(m0).y });
    if (!(c.modulo > 0)) throw new Error('el vector marcado no puede ser nulo');
    const im = vs.findIndex(v => v.de === m0 && v.a === m1);
    const s = suma(vs.map(v => ({ x: v.x, y: v.y })));
    const k = Math.abs(c.x * s.y - c.y * s.x) < 1e-9 * Math.max(1, c.modulo * s.modulo) ? (s.x * c.x + s.y * c.y) / (c.modulo * c.modulo) : null;
    // caminos sin repetir flechas (búsqueda en profundidad)
    const usado = vs.map((_, i) => i === im);
    const camino = (desde, hasta, visto) => {
      if (desde === hasta) return [];
      for (let i = 0; i < vs.length; i++) {
        if (usado[i] || vs[i].de !== desde || visto.has(vs[i].a)) continue;
        usado[i] = true; visto.add(vs[i].a);
        const r = camino(vs[i].a, hasta, visto);
        if (r) return [i, ...r];
        usado[i] = false; visto.delete(vs[i].a);
      }
      return null;
    };
    const grupos = [];
    for (;;) { const r = camino(m0, m1, new Set([m0])); if (!r || !r.length) break; grupos.push({ vectores: r, puntos: [m0, ...r.map(i => vs[i].a)] }); }
    if (im >= 0) grupos.push({ vectores: [im], puntos: [m0, m1] });
    const sobran = vs.map((_, i) => i).filter(i => !usado[i]);
    const resto = sobran.length ? suma(sobran.map(i => vs[i])) : { modulo: 0 };
    const kk = k === null ? null : Math.abs(k - Math.round(k)) < 1e-9 ? Math.round(k) + 0 : k;
    return {
      x: s.x, y: s.y, modulo: s.modulo, k: kk, c, vectores: vs, grupos, sobran, restoNulo: resto.modulo < 1e-9,
      errores: kk === null ? { sumaModulos: s.errores.sumaModulos } : {
        menosUno: (kk - 1) * c.modulo, masUno: (kk + 1) * c.modulo, doble: 2 * kk * c.modulo,
        sumaModulos: s.errores.sumaModulos, soloMarcado: c.modulo,
      },
    };
  }

  // ---------- Sólidos con coordenadas ----------
  // Caja (paralelepípedo rectangular) de largo a (eje x), fondo b (eje y) y alto c (eje z), con A en el origen:
  // abajo A B C D y arriba E F G H (E sobre A, F sobre B…). El cubo es la caja con a = b = c.
  const LETRAS = 'ABCDEFGH';
  function caja(a, b, c) {
    positivo(a, 'el largo'); positivo(b, 'el fondo'); positivo(c, 'el alto');
    const base = [[0, 0], [a, 0], [a, b], [0, b]], vertices = {};
    base.forEach(([x, y], i) => { vertices[LETRAS[i]] = { x, y, z: 0 }; vertices[LETRAS[i + 4]] = { x, y, z: c }; });
    const aristas = [['A', 'B'], ['D', 'C'], ['E', 'F'], ['H', 'G'], ['A', 'D'], ['B', 'C'], ['F', 'G'], ['E', 'H'], ['A', 'E'], ['B', 'F'], ['C', 'G'], ['D', 'H']]
      .map(([p, q], i) => ({ de: p, a: q, direccion: i < 4 ? 'x' : i < 8 ? 'y' : 'z' }));
    return { tipo: 'caja', a, b, c, vertices, aristas, diagonal: Math.hypot(a, b, c) };
  }
  const cubo = a => Object.assign(caja(a, a, a), { tipo: 'cubo' });
  // Tetraedro trirrectángulo: O en el origen y A, B, C sobre los ejes x, y, z.
  function tetraedro(a, b, c) {
    positivo(a, 'a'); positivo(b, 'b'); positivo(c, 'c');
    const vertices = { O: { x: 0, y: 0, z: 0 }, A: { x: a, y: 0, z: 0 }, B: { x: 0, y: b, z: 0 }, C: { x: 0, y: 0, z: c } };
    const aristas = [['O', 'A'], ['O', 'B'], ['O', 'C'], ['A', 'B'], ['B', 'C'], ['C', 'A']].map(([p, q]) => ({ de: p, a: q }));
    return { tipo: 'tetraedro', a, b, c, vertices, aristas };
  }
  function solido(s) {
    if (s && s.vertices) return s;
    if (!s || typeof s !== 'object') throw new Error('falta el sólido');
    if (s.tipo === 'cubo') return cubo(s.a);
    if (s.tipo === 'caja') return caja(s.a, s.b, s.c);
    if (s.tipo === 'tetraedro') return tetraedro(s.a, s.b, s.c);
    throw new Error(`no conozco el sólido «${s.tipo}»`);
  }
  // Dibujo de academia leído como plano: el eje y (el fondo) a 45° y con su largo real.
  const plano = v => ({ x: v.x + v.y * Math.SQRT1_2, y: v.z + v.y * Math.SQRT1_2 });
  // Suma de vectores dados por pares de vértices (final menos inicio).
  function sumaSolido(s0, pares) {
    const s = solido(s0);
    if (!Array.isArray(pares) || !pares.length) throw new Error('faltan los vectores');
    const vs = pares.map(([p, q]) => {
      const P = s.vertices[p], Q = s.vertices[q];
      if (!P || !Q) throw new Error(`vértice desconocido: ${!P ? p : q}`);
      const d = { de: p, a: q, x: Q.x - P.x, y: Q.y - P.y, z: Q.z - P.z };
      return Object.assign(d, { modulo: Math.hypot(d.x, d.y, d.z) });
    });
    const tot = (lista, f) => { const r = { x: 0, y: 0, z: 0 }; lista.forEach((v, i) => { const k = f ? f(i) : 1; r.x += k * v.x; r.y += k * v.y; r.z += k * v.z; }); return r; };
    const R = tot(vs), esc = Math.max(1, vs.reduce((t, v) => t + v.modulo, 0));
    for (const k of ['x', 'y', 'z']) R[k] = limpio(R[k], esc) + 0;
    const pl = vs.map(plano).reduce((t, v) => ({ x: t.x + v.x, y: t.y + v.y }), { x: 0, y: 0 });
    const sinY = tot(vs.map(v => ({ x: v.x, y: 0, z: v.z })));
    return {
      x: R.x, y: R.y, z: R.z, modulo: Math.hypot(R.x, R.y, R.z), vectores: vs,
      errores: {
        sumaModulos: vs.reduce((t, v) => t + v.modulo, 0),                       // sumar los largos
        plano: Math.hypot(pl.x, pl.y),                                            // medir en el dibujo, con el fondo a 45°
        sinProfundidad: Math.hypot(sinY.x, sinY.z),                               // olvidar lo que va hacia el fondo
        alReves: vs.map((_, i) => { const r = tot(vs, j => (j === i ? -1 : 1)); return Math.hypot(r.x, r.y, r.z); }), // un vector al revés
        seAnulan: 0,
      },
    };
  }

  // ---------- Dos vectores iguales: |A + B| = k·|A − B| ----------
  // Con módulos iguales, la suma y la diferencia son las diagonales de un rombo (perpendiculares):
  // |A + B| = 2A·cos(θ/2) y |A − B| = 2A·sen(θ/2), así que tan(θ/2) = 1/k y cos θ = (k² − 1)/(k² + 1).
  function inversoSumaDiferencia(k) {
    positivo(k, 'k');
    const cos = (k * k - 1) / (k * k + 1), theta = Math.acos(Math.max(-1, Math.min(1, cos))) / RAD;
    const NOT = [[3 / 5, 53], [4 / 5, 37], [-3 / 5, 127], [-4 / 5, 143], [0, 90], [1 / 2, 60], [-1 / 2, 120]];
    const n = NOT.find(([c]) => Math.abs(c - cos) < 1e-12), academia = n ? n[1] : theta;
    return {
      cos, theta, academia, notable: !!n, mitad: academia / 2,
      errores: { complementario: 90 - academia, diagonalesPerpendiculares: 90, conResultante: academia / 2 },
    };
  }

  // ---------- Girar los ejes ----------
  // Los ejes x′ e y′ son los de siempre girados 'angulo' grados (antihorario). Cada vector se da como {x, y}, [x, y]
  // o {modulo, angulo}. Las componentes cambian; el módulo de cada vector y el de la resultante, no.
  function enComponentes(v, que) {
    if (v && typeof v === 'object' && !Array.isArray(v) && v.modulo !== undefined && v.angulo !== undefined && v.x === undefined)
      return vector(numero(v.modulo, 'el módulo'), numero(v.angulo, 'el ángulo'), { exacto: true });
    return vec(v, que);
  }
  function girarEjes(lista, angulo) {
    if (!Array.isArray(lista) || !lista.length) throw new Error('faltan los vectores');
    numero(angulo, 'el ángulo de giro');
    const t = trig(angulo, { exacto: true });
    const vs = lista.map((v, i) => enComponentes(v, `el vector ${i + 1}`));
    const gira = v => { const x = v.x * t.cos + v.y * t.sen, y = -v.x * t.sen + v.y * t.cos, m = Math.hypot(v.x, v.y); return Object.assign(polar({ x: limpio(x, m), y: limpio(y, m) }), {}); };
    const R = suma(vs), Rp = gira(R);
    const ref = Math.min(Rp.angulo % 180, 180 - (Rp.angulo % 180));
    return {
      angulo, vectores: vs.map(gira), resultante: Rp, original: polar({ x: R.x, y: R.y }),
      errores: {
        anguloDeReferencia: ref,                      // el agudo con el eje x′, sin mirar el cuadrante
        anguloComplementario: 90 - ref,               // el agudo con el eje y′
        anguloOriginal: polar({ x: R.x, y: R.y }).angulo,   // el ángulo medido desde el eje x de antes
      },
    };
  }

  // ---------- Proyección (producto escalar) y área (producto vectorial) ----------
  // proyeccion(u, v): la sombra de u sobre la dirección de v, con signo: u·v/|v|.
  function proyeccion(u0, v0) {
    const u = vec3(u0, 'u'), v = vec3(v0, 'v'), mv = Math.hypot(v.x, v.y, v.z), mu = Math.hypot(u.x, u.y, u.z);
    if (!(mv > 0)) throw new Error('no se proyecta sobre el vector nulo');
    const p = escalar(u, v), e = limpio(p / mv, mu), k = p / (mv * mv);
    return {
      escalar: e, producto: limpio(p, mu * mv), vector: { x: limpio(k * v.x, mu), y: limpio(k * v.y, mu), z: limpio(k * v.z, mu) },
      angulo: mu > 0 ? anguloEntre(u, v) : 0,
      errores: { conSeno: vectorial(u, v).modulo / mv, invertida: mu > 0 ? p / mu : 0 },   // sen por cos; la sombra de v sobre u
    };
  }
  // area(u, v): el paralelogramo y el triángulo que forman u y v (en el plano), y el sentido de u × v.
  function area(u0, v0) {
    const u = vec3(u0, 'u'), v = vec3(v0, 'v'), w = vectorial(u, v), m = w.modulo;
    const sentido = Math.abs(w.z) < 1e-12 ? 'ninguno' : w.z > 0 ? 'sale' : 'entra';
    return {
      z: w.z, paralelogramo: m, triangulo: m / 2, sentido,
      errores: {
        sinMitad: m,                                  // el paralelogramo como área del triángulo
        conCoseno: Math.abs(escalar(u, v)) / 2,       // con el producto escalar (cos en vez de sen)
        manoInvertida: sentido === 'sale' ? 'entra' : sentido === 'entra' ? 'sale' : 'ninguno',
      },
    };
  }

  // ---------- Vector de módulo dado paralelo (y antiparalelo) a otro ----------
  function unitarioConModulo(v0, modulo) {
    const v = vec(v0, 'v'); positivo(modulo, 'el módulo');
    const u = unitario(v), f = modulo / u.moduloOriginal;
    const w = { x: limpio(modulo * u.x, modulo), y: limpio(modulo * u.y, modulo) };
    return {
      x: w.x, y: w.y, modulo, antiparalelo: { x: -w.x + 0, y: -w.y + 0 }, unitario: { x: u.x, y: u.y }, factor: f,
      errores: {
        sinEscalar: { x: u.x, y: u.y },                         // quedarse con el unitario
        sinDividir: { x: modulo * v.x, y: modulo * v.y },       // multiplicar v por el módulo sin dividir
        opuesto: { x: -w.x + 0, y: -w.y + 0 },                  // el antiparalelo
        escalado: { x: f * u.x, y: f * u.y },                   // creer que el unitario de w = f·v es f veces el de v
      },
    };
  }

  // ---------- Incógnitas con una condición: la resultante sobre un eje y con módulo dado ----------
  // A y B son [x, y] con null en las incógnitas: una en la componente del eje y otra en la otra componente.
  // R tiene que estar sobre el eje ('x' o 'y') y medir 'modulo': la otra componente de R es 0 y la del eje vale ±modulo.
  function dosSentidos(A, B, eje, modulo) {
    if (!Array.isArray(A) || !Array.isArray(B) || A.length !== 2 || B.length !== 2) throw new Error('A y B van como [x, y]');
    if (eje !== 'x' && eje !== 'y') throw new Error("el eje es 'x' o 'y'");
    positivo(modulo, 'el módulo');
    const e = eje === 'x' ? 0 : 1, o = 1 - e;
    const hueco = k => [A[k], B[k]].filter(c => c === null).length;
    if (hueco(e) !== 1 || hueco(o) !== 1) throw new Error('hace falta una incógnita en cada componente');
    [A, B].forEach(V => V.forEach(c => { if (c !== null) numero(c, 'una componente'); }));
    const conocido = k => (A[k] === null ? 0 : A[k]) + (B[k] === null ? 0 : B[k]);
    const W = -conocido(o) + 0;
    const armar = U => {
      const a = A.slice(), b = B.slice();
      (a[e] === null ? a : b)[e] = U; (a[o] === null ? a : b)[o] = W;
      return { A: a, B: b, R: [a[0] + b[0] + 0, a[1] + b[1] + 0], incognitaEje: U, incognitaOtra: W };
    };
    const ke = conocido(e);
    const soluciones = [armar(modulo - ke), armar(-modulo - ke)].map((s, i) => Object.assign(s, { sentido: i === 0 ? 'positivo' : 'negativo' }));
    return {
      soluciones, ecuacion: { otra: W, cuadrado: modulo * modulo },
      errores: {
        unaSola: soluciones[0].incognitaEje,                     // solo el sentido positivo
        signoCambiado: [modulo + ke, -modulo + ke],              // despejar sumando lo que se debía restar
        olvidaComponente: [modulo, -modulo],                     // olvidar la parte conocida de la componente del eje
      },
    };
  }

  // Texto de un número como radical simple: 2√3, 2 + 2√2, 12 (para las opciones de la escena).
  function radical(x) {
    numero(x, 'el número');
    const ent = Math.round(x);
    const t = n => String(n).replace('-', '−');
    if (Math.abs(x - ent) < 1e-9) return t(ent);
    const libres = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17, 19, 21, 22, 23, 26, 29, 30, 31, 33, 34, 35, 37, 41, 61];
    for (const n of libres) { const k = x / Math.sqrt(n), kr = Math.round(k); if (kr !== 0 && Math.abs(k - kr) < 1e-9 && Math.abs(kr) <= 40) return `${kr === 1 ? '' : kr === -1 ? '−' : t(kr)}√${n}`; }
    for (const n of libres) for (let p = -20; p <= 20; p++) {
      if (!p) continue;
      const q = (x - p) / Math.sqrt(n), qr = Math.round(q);
      if (qr !== 0 && Math.abs(q - qr) < 1e-9 && Math.abs(qr) <= 20) return `${t(p)} ${qr > 0 ? '+' : '−'} ${Math.abs(qr) === 1 ? '' : Math.abs(qr)}√${n}`;
    }
    return null;
  }

  // Azar con semilla (pruebas).
  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }

  return {
    TOL, trig, vector, polar, suma, resta, resultante, rango, barrido, componentes, unitario,
    escalar, anguloEntre, vectorial, hexagono,
    division, baricentro, trapecio, reduccion, caja, cubo, tetraedro, sumaSolido, inversoSumaDiferencia, girarEjes,
    proyeccion, area, unitarioConModulo, dosSentidos, radical,
    BASES, MAGNITUDES, dimension, producto, cociente, potencia, iguales, texto, fraccion, homogenea, constante, exponentes,
    azar,
  };
});
