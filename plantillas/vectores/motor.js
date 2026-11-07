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

  // Azar con semilla (pruebas).
  function azar(sem) { let s = (sem >>> 0) || 1; return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296; }

  return {
    TOL, trig, vector, polar, suma, resta, resultante, rango, barrido, componentes, unitario,
    escalar, anguloEntre, vectorial, hexagono,
    BASES, MAGNITUDES, dimension, producto, cociente, potencia, iguales, texto, fraccion, homogenea, constante, exponentes,
    azar,
  };
});
