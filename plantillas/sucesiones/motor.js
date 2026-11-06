/*
 * Motor de «La torre de fichas»: sucesiones, patrones y series.
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM:
 * funciona igual en el navegador (window.MotorSucesiones) y en Node (require('./motor.js')),
 * donde lo prueban casos.json y papel.json.
 *
 *   aritmetica({ a1, r, n })                término n-ésimo aₙ = a₁ + (n − 1)·r y su fórmula r·n + (a₁ − r)
 *   desdeOtroTermino({ a1, r, m, n })        aₙ sabiendo aₘ (la figura 20 sabiendo la 10)
 *   cantidadTerminos({ a1, r, an })          cuántos términos hay de a₁ a aₙ: (aₙ − a₁)/r + 1
 *   sumaAritmetica({ a1, r, n })             Sₙ = (a₁ + aₙ)·n/2 (Gauss)
 *   geometrica({ a1, q, n })                 aₙ = a₁·qⁿ⁻¹
 *   sumaGeometrica({ a1, q, n })             Sₙ = a₁(qⁿ − 1)/(q − 1)
 *   sumaInfinita({ a1, q })                  S = a₁/(1 − q), con |q| < 1
 *   dobleces(d)                              capas de una hoja doblada d veces: 2ᵈ
 *   mitades(k)                               el cuadrado de área 1 partido en 1/2, 1/4, …: piezas y suma parcial
 *   diferencias(terminos)                    tabla de diferencias hasta que se vuelven constantes
 *   segundoOrden({ terminos, k })            sucesión cuadrática: an² + bn + c por el método de diferencias
 *   siguiente(terminos)                      qué tipo de sucesión es y qué término sigue
 *   figura(tipo, n)                          figuras de palitos o fichas: piezas con su paso, conteo y fórmula
 *   sumaNotable(tipo, n), sumaHasta({ tipo, ultimo })   1 + 2 + … + n, pares, impares, cuadrados y cubos
 *   gauss(n)                                 las dos escaleras que forman el rectángulo n × (n + 1)
 *   apretones(n)                             apretones de manos en un grupo de n: n(n − 1)/2
 *   regionesCirculo(n), cuerdas(angulos)     regiones que forman las cuerdas entre n puntos de una circunferencia
 *   regla(filas)                             analogías y distribuciones numéricas: la regla que cumplen todas las filas
 *
 * Cada resultado que es la respuesta de una predicción trae un campo 'errores' con lo que dan los errores típicos de
 * docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md (RM2, el «objeto entero» de Stacey; AR7, la ilusión de
 * linealidad) y los que suponemos (n en vez de n − 1, la diferencia como término, contar dos veces lo compartido).
 * Un error que en ese caso da justo la respuesta correcta no se devuelve: no puede ser una opción incorrecta.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorSucesiones = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const TOL = 1e-9;
  function numero(x, que, o) {
    o = o || {};
    if (typeof x !== 'number' || !Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
    if (o.positivo && !(x > 0)) throw new Error(`${que} debe ser mayor que cero`);
    if (o.entero && !Number.isInteger(x)) throw new Error(`${que} debe ser un número entero`);
    if (o.min !== undefined && x < o.min) throw new Error(`${que} debe ser al menos ${o.min}`);
    if (o.max !== undefined && x > o.max) throw new Error(`${que} debe ser como mucho ${o.max}`);
    return x;
  }
  // Redondea el ruido de coma flotante cerca de un entero (8,999999999 → 9).
  const limpio = x => (Number.isFinite(x) && Math.abs(x - Math.round(x)) <= TOL * Math.max(1, Math.abs(x)) ? Math.round(x) + 0 : x);
  const igual = (a, b) => a === b || (Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b)));
  function lista(xs, que, minimo) {
    if (!Array.isArray(xs) || xs.length < (minimo || 1)) throw new Error(`${que} debe ser una lista de al menos ${minimo || 1} números`);
    xs.forEach((x, k) => numero(x, `${que}[${k}]`));
    return xs;
  }
  // Quita los errores que en este caso coinciden con la respuesta (o que no existen): no sirven como distractor.
  function errores(e, correcto) {
    const r = {};
    for (const [k, v] of Object.entries(e)) if (v !== null && v !== undefined && !(typeof v === 'number' && Number.isNaN(v)) && !igual(v, correcto)) r[k] = typeof v === 'number' ? limpio(v) : v;
    return r;
  }
  function fraccion(x, maxDen) {
    numero(x, 'el número'); maxDen = maxDen || 10000;
    for (let q = 1; q <= maxDen; q++) {
      const p = Math.round(x * q);
      if (Math.abs(p / q - x) <= TOL * Math.max(1, Math.abs(x))) return { num: p + 0, den: q };
    }
    return null;
  }
  const textoFraccion = x => { const f = fraccion(x); return !f ? null : f.den === 1 ? String(f.num) : `${f.num}/${f.den}`; };
  const comb = (n, k) => { if (k < 0 || k > n) return 0; let c = 1; for (let j = 1; j <= k; j++) c = c * (n - k + j) / j; return Math.round(c); };

  // ---------- Progresión aritmética ----------
  // aₙ = a₁ + (n − 1)·r. La fórmula «de figura» es r·n + (a₁ − r): r es lo que se agrega en cada paso y a₁ − r, lo que
  // queda fijo (la «figura cero»). Errores: contar n saltos en vez de n − 1; la diferencia como término (r·n, sin lo fijo);
  // el objeto entero desde a₁ (aₙ = n·a₁).
  function aritmetica(o) {
    const a1 = numero(o.a1, 'a1'), r = numero(o.r, 'r'), n = numero(o.n, 'n', { entero: true, min: 1 });
    const an = limpio(a1 + (n - 1) * r);
    return { an, a1, r, n, saltos: n - 1, formula: { a: 0, b: limpio(r), c: limpio(a1 - r) },
      errores: errores({ nEnVezDeNmenos1: a1 + n * r, diferenciaComoTermino: r * n, objetoEntero: n > 1 ? a1 * n : null }, an) };
  }
  // aₙ sabiendo aₘ (y la diferencia r): aₙ = aₘ + (n − m)·r. El objeto entero de Stacey (RM2): aₙ = aₘ·n/m, como si la
  // figura n estuviera hecha de n/m figuras m; la diferencia como término: r·n; la aditiva: sumar n − m.
  function desdeOtroTermino(o) {
    const a1 = numero(o.a1, 'a1'), r = numero(o.r, 'r'), m = numero(o.m, 'm', { entero: true, min: 1 }), n = numero(o.n, 'n', { entero: true, min: 1 });
    const am = limpio(a1 + (m - 1) * r), an = limpio(a1 + (n - 1) * r);
    return { an, am, m, n, sobranFijos: limpio((n / m - 1) * (a1 - r)),
      errores: errores({ objetoEntero: am * n / m, diferenciaComoTermino: r * n, aditiva: am + (n - m) }, an) };
  }
  // Cuántos términos hay de a₁ a aₙ: (aₙ − a₁)/r saltos y uno más. Errores: olvidar el +1; dividir el último entre r.
  function cantidadTerminos(o) {
    const a1 = numero(o.a1, 'a1'), r = numero(o.r, 'r'), an = numero(o.an, 'an');
    if (r === 0) throw new Error('con r = 0 todos los términos son iguales');
    const saltos = limpio((an - a1) / r);
    if (!Number.isInteger(saltos) || saltos < 0) throw new Error('aₙ no es un término de la progresión');
    const n = saltos + 1;
    return { n, saltos, errores: errores({ sinMasUno: saltos, ultimoEntreRazon: an / r }, n) };
  }
  // Sₙ = (a₁ + aₙ)·n/2: la escalera y su copia girada forman un rectángulo de n por (a₁ + aₙ).
  function sumaAritmetica(o) {
    const a1 = numero(o.a1, 'a1'), r = numero(o.r, 'r'), n = numero(o.n, 'n', { entero: true, min: 1 });
    const an = limpio(a1 + (n - 1) * r), S = limpio((a1 + an) * n / 2);
    return { S, an, n, rectangulo: { lados: [n, limpio(a1 + an)], area: limpio((a1 + an) * n) },
      errores: errores({ sinDividir: (a1 + an) * n, ultimoPorN: an * n, nEnVezDeNmenos1: (a1 + (a1 + n * r)) * n / 2 }, S) };
  }

  // ---------- Progresión geométrica ----------
  // aₙ = a₁·qⁿ⁻¹. Errores: qⁿ en vez de qⁿ⁻¹; tratarla como aritmética con la primera diferencia (la razón por
  // diferencia); el objeto entero (a₂ₖ = 2·aₖ, que solo vale en las lineales que pasan por cero).
  function geometrica(o) {
    const a1 = numero(o.a1, 'a1'), q = numero(o.q, 'q'), n = numero(o.n, 'n', { entero: true, min: 1 });
    const pot = k => a1 * Math.pow(q, k - 1);
    const an = limpio(pot(n));
    return { an, a1, q, n, terminos: n <= 60 ? Array.from({ length: n }, (_, j) => limpio(pot(j + 1))) : null,
      errores: errores({ nEnVezDeNmenos1: a1 * Math.pow(q, n), comoAritmetica: a1 + (n - 1) * (a1 * q - a1),
        objetoEntero: n % 2 === 0 ? 2 * pot(n / 2) : null }, an) };
  }
  function sumaGeometrica(o) {
    const a1 = numero(o.a1, 'a1'), q = numero(o.q, 'q'), n = numero(o.n, 'n', { entero: true, min: 1 });
    const S = limpio(q === 1 ? a1 * n : a1 * (Math.pow(q, n) - 1) / (q - 1));
    const an = limpio(a1 * Math.pow(q, n - 1));
    return { S, an, errores: errores({ ultimoTermino: an, sinRestarUno: q === 1 ? null : a1 * Math.pow(q, n) / (q - 1), comoAritmetica: (a1 + an) * n / 2 }, S) };
  }
  // S = a₁/(1 − q) si |q| < 1. Errores: creer que una suma de infinitos sumandos positivos crece sin límite (Infinity);
  // usar 1 como primer término (1/(1 − q)); quedarse con los dos primeros.
  function sumaInfinita(o) {
    const a1 = numero(o.a1, 'a1'), q = numero(o.q, 'q');
    if (!(Math.abs(q) < 1)) throw new Error('la suma infinita solo existe si |q| < 1');
    const S = limpio(a1 / (1 - q));
    const parciales = Array.from({ length: 12 }, (_, k) => limpio(a1 * (1 - Math.pow(q, k + 1)) / (1 - q)));
    return { S, texto: textoFraccion(S), parciales, errores: errores({ diverge: a1 > 0 && q > 0 ? Infinity : null, primerTerminoUno: 1 / (1 - q), dosPrimeros: a1 + a1 * q }, S) };
  }
  // Una hoja doblada por la mitad d veces: 1, 2, 4, 8, … capas (2ᵈ). Errores: como aritmética de 2 en 2 (2d), la potencia
  // al revés (d²), el objeto entero (2·2^(d/2)) y un doblez de menos.
  function dobleces(d) {
    numero(d, 'd', { entero: true, min: 0, max: 50 });
    const capas = Math.pow(2, d);
    return { capas, serie: Array.from({ length: d + 1 }, (_, k) => Math.pow(2, k)),
      errores: errores({ comoAritmetica: 2 * d, potenciaAlReves: d * d, objetoEntero: d % 2 === 0 && d > 0 ? 2 * Math.pow(2, d / 2) : null, unDoblezMenos: d > 0 ? capas / 2 : null }, capas) };
  }
  // El cuadrado de área 1: la pieza j (1/2ʲ) es la mitad de lo que falta; se corta en vertical y en horizontal, por turnos.
  function mitades(k) {
    numero(k, 'k', { entero: true, min: 1, max: 40 });
    let x = 0, y = 0, w = 1, h = 1; const piezas = [];
    for (let j = 1; j <= k; j++) {
      if (j % 2) { piezas.push({ x, y, w: w / 2, h, valor: Math.pow(2, -j) }); x += w / 2; w /= 2; }
      else { piezas.push({ x, y, w, h: h / 2, valor: Math.pow(2, -j) }); y += h / 2; h /= 2; }
    }
    const suma = piezas.reduce((s, p) => s + p.valor, 0);
    return { piezas, suma: limpio(suma), falta: limpio(1 - suma), resto: { x, y, w, h } };
  }

  // ---------- Diferencias y sucesiones de orden superior ----------
  function diferencias(t) {
    lista(t, 'terminos', 2);
    const filas = [t.map(limpio)];
    while (filas[filas.length - 1].length > 1) {
      const f = filas[filas.length - 1];
      if (filas.length > 1 && f.every(x => igual(x, f[0]))) break;
      filas.push(f.slice(1).map((x, j) => limpio(x - f[j])));
    }
    const ult = filas[filas.length - 1];
    const constante = filas.length > 1 && ult.length >= 2 && ult.every(x => igual(x, ult[0]));
    return { filas, orden: constante ? filas.length - 1 : null, constante: constante ? ult[0] : null };
  }
  // tₙ = a·n² + b·n + c. Con la segunda diferencia d₂ y la primera diferencia d₁ (de t₁ a t₂): a = d₂/2, b = d₁ − 3a,
  // c = t₁ − a − b. Errores para el término k: tratarla como lineal con la primera diferencia, o con la última; el objeto
  // entero (t₂ₘ = 2·tₘ).
  function segundoOrden(o) {
    const t = lista(o.terminos, 'terminos', 3), k = numero(o.k, 'k', { entero: true, min: 1 });
    const d1 = t.slice(1).map((x, j) => limpio(x - t[j])), d2 = d1.slice(1).map((x, j) => limpio(x - d1[j]));
    if (!d2.every(x => igual(x, d2[0]))) throw new Error('la segunda diferencia no es constante: no es de segundo orden');
    const a = limpio(d2[0] / 2), b = limpio(d1[0] - 3 * a), c = limpio(t[0] - a - b);
    const f = n => limpio(a * n * n + b * n + c);
    const m = t.length, ak = f(k);
    return { a, b, c, d1, d2, d2Constante: d2[0], ak, termino: f, terminos: Array.from({ length: Math.max(m, k) }, (_, j) => f(j + 1)),
      errores: errores({ comoLineal: t[0] + (k - 1) * d1[0], comoLinealUltima: k > m ? t[m - 1] + (k - m) * d1[m - 2] : null,
        objetoEntero: k % 2 === 0 ? 2 * f(k / 2) : null }, ak) };
  }
  // Qué tipo de sucesión es (aritmética, geométrica, de Fibonacci o de orden superior) y qué término sigue.
  function siguiente(t) {
    lista(t, 'terminos', 3);
    const ult = t[t.length - 1], d = t.slice(1).map((x, j) => x - t[j]);
    let r = null;
    if (d.every(x => igual(x, d[0]))) r = { tipo: 'aritmetica', siguiente: ult + d[0], r: limpio(d[0]) };
    else if (t.every(x => x !== 0) && t.slice(1).every((x, j) => igual(x / t[j], t[1] / t[0]))) r = { tipo: 'geometrica', siguiente: ult * t[1] / t[0], q: limpio(t[1] / t[0]) };
    else if (t.length >= 4 && t.slice(2).every((x, j) => igual(x, t[j] + t[j + 1]))) r = { tipo: 'fibonacci', siguiente: ult + t[t.length - 2] };
    else {
      const D = diferencias(t);
      if (D.orden === null || D.filas[D.filas.length - 1].length < 2) throw new Error('no encuentro la ley de formación con estos términos');
      let s = D.constante;
      for (let j = D.filas.length - 2; j >= 0; j--) s += D.filas[j][D.filas[j].length - 1];
      r = { tipo: 'orden-' + D.orden, siguiente: s, orden: D.orden };
    }
    r.siguiente = limpio(r.siguiente);
    r.errores = errores({ comoAritmetica: ult + d[d.length - 1] }, r.siguiente);
    return r;
  }

  // ---------- Figuras de palitos y de fichas ----------
  // Cada figura de palitos es un conjunto de celdas (cuadrados o triángulos); un palito es un lado de una celda y, si dos
  // celdas lo comparten, se cuenta una sola vez. El conteo sale de la geometría (lados distintos), no de la fórmula:
  // las pruebas comprueban que coinciden. 'paso' es la figura en la que aparece la pieza por primera vez.
  const H3 = Math.sqrt(3) / 2;
  const FIGURAS = {
    // n cuadrados en fila: 3n + 1 palitos (los n − 1 lados de en medio son compartidos)
    cuadrados: { unidad: 'palitos', formula: { a: 0, b: 3, c: 1 },
      celdas: n => Array.from({ length: n }, (_, k) => ({ paso: k + 1, v: [[k, 0], [k + 1, 0], [k + 1, 1], [k, 1]] })),
      extra: n => ({ cuentaDoble: 4 * n, diferenciaComoTermino: 3 * n, nEnVezDeNmenos1: 4 + 3 * n }) },
    // n triángulos en fila, uno hacia arriba y otro hacia abajo: 2n + 1 palitos
    triangulos: { unidad: 'palitos', formula: { a: 0, b: 2, c: 1 },
      celdas: n => Array.from({ length: n }, (_, k) => {
        const i = Math.floor(k / 2);
        return { paso: k + 1, v: k % 2 === 0 ? [[i, 0], [i + 1, 0], [i + 0.5, H3]] : [[i + 0.5, H3], [i + 1.5, H3], [i + 1, 0]] };
      }),
      extra: n => ({ cuentaDoble: 3 * n, diferenciaComoTermino: 2 * n, nEnVezDeNmenos1: 3 + 2 * n }) },
    // cuadrícula de n × n cuadrados: 2n(n + 1) palitos; la figura n agrega una franja en L
    cuadricula: { unidad: 'palitos', formula: { a: 2, b: 2, c: 0 },
      celdas: n => { const c = []; for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) c.push({ paso: Math.max(i, j) + 1, v: [[i, -j - 1], [i + 1, -j - 1], [i + 1, -j], [i, -j]] }); return c; },
      extra: n => ({ cuentaDoble: 4 * n * n }) },
    // triángulo de lado n hecho de triangulitos: 3n(n + 1)/2 palitos. Cada palito es lado de un solo triangulito que
    // apunta hacia arriba; los que apuntan hacia abajo solo usan palitos ya puestos.
    'triangulo-palitos': { unidad: 'palitos', formula: { a: 1.5, b: 1.5, c: 0 },
      celdas: n => {
        const c = [];
        for (let i = 0; i < n; i++) {
          for (let j = 0; j <= i; j++) c.push({ paso: i + 1, arriba: true, v: [[j - i / 2 - 0.5, -(i + 1) * H3], [j - i / 2 + 0.5, -(i + 1) * H3], [j - i / 2, -i * H3]] });
          for (let j = 0; j < i; j++) c.push({ paso: i + 1, arriba: false, v: [[j - i / 2, -i * H3], [j + 1 - i / 2, -i * H3], [j - i / 2 + 0.5, -(i + 1) * H3]] });
        }
        return c;
      },
      extra: n => ({ cuentaDoble: 3 * n * n }) },
    // torre de fichas: 3 columnas de n fichas y 2 almenas arriba: 3n + 2 fichas
    torre: { unidad: 'fichas', formula: { a: 0, b: 3, c: 2 },
      fichas: n => { const f = []; for (let j = 0; j < n; j++) for (let i = 0; i < 3; i++) f.push({ x: i, y: j, paso: j + 1 }); f.push({ x: 0, y: n, paso: 1, almena: true }, { x: 2, y: n, paso: 1, almena: true }); return f; },
      extra: n => ({ diferenciaComoTermino: 3 * n, nEnVezDeNmenos1: 5 + 3 * n }) },
    // fichas en triángulo: la fila r tiene r fichas; n(n + 1)/2
    triangular: { unidad: 'fichas', formula: { a: 0.5, b: 0.5, c: 0 },
      fichas: n => { const f = []; for (let r = 1; r <= n; r++) for (let c = 0; c < r; c++) f.push({ x: c - (r - 1) / 2, y: -(r - 1), paso: r }); return f; },
      extra: n => ({ cuadradoMedio: n * n / 2 }) },
    // fichas en cuadrado: n²; cada paso agrega una L de 2n − 1 fichas (los impares)
    'cuadrado-fichas': { unidad: 'fichas', formula: { a: 1, b: 0, c: 0 },
      fichas: n => { const f = []; for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) f.push({ x: i, y: -j, paso: Math.max(i, j) + 1 }); return f; },
      extra: n => ({ sumaDeLados: 4 * n - 4 }) },
  };
  const evalFormula = (F, n) => limpio(F.a * n * n + F.b * n + F.c);
  const clave = (p, q) => { const k = z => `${Math.round(z[0] * 1e6)},${Math.round(z[1] * 1e6)}`; const a = k(p), b = k(q); return a < b ? a + '|' + b : b + '|' + a; };
  function piezasDe(tipo, n) {
    const F = FIGURAS[tipo];
    if (F.fichas) return F.fichas(n).map(f => Object.assign({ tipo: 'ficha', compartido: false }, f));
    const lados = new Map();
    for (const c of F.celdas(n)) c.v.forEach((p, j) => {
      const q = c.v[(j + 1) % c.v.length], k = clave(p, q);
      const s = lados.get(k);
      if (s) { s.celdas++; s.paso = Math.min(s.paso, c.paso); if (c.arriba) s.deArriba++; }
      else lados.set(k, { tipo: 'palito', x1: p[0], y1: p[1], x2: q[0], y2: q[1], paso: c.paso, celdas: 1, deArriba: c.arriba ? 1 : 0 });
    });
    return [...lados.values()].map(s => { const r = { tipo: 'palito', x1: s.x1, y1: s.y1, x2: s.x2, y2: s.y2, paso: s.paso, compartido: s.celdas > 1 }; if (tipo === 'triangulo-palitos') r.deArriba = s.deArriba; return r; });
  }
  function figura(tipo, n) {
    const F = FIGURAS[tipo];
    if (!F) throw new Error(`tipo de figura desconocido: ${tipo}`);
    numero(n, 'n', { entero: true, min: 1, max: 60 });
    const piezas = piezasDe(tipo, n), cantidad = piezas.length;
    const antes = n > 1 ? piezasDe(tipo, n - 1).length : 0;
    const celdas = F.celdas ? F.celdas(n).length : null;
    const e = Object.assign({}, F.extra(n));
    if (F.formula.a !== 0) e.comoLineal = evalFormula(F.formula, 1) + (n - 1) * (evalFormula(F.formula, 2) - evalFormula(F.formula, 1));
    if (n % 2 === 0) e.objetoEntero = 2 * evalFormula(F.formula, n / 2);
    return { tipo, unidad: F.unidad, n, cantidad, formula: Object.assign({}, F.formula), porFormula: evalFormula(F.formula, n),
      nuevos: cantidad - antes, compartidos: piezas.filter(p => p.compartido).length, celdas, piezas, errores: errores(e, cantidad) };
  }
  // La tabla n → cantidad de una figura, de 1 a nmax.
  function tablaFigura(tipo, nmax) {
    numero(nmax, 'nmax', { entero: true, min: 1, max: 60 });
    return Array.from({ length: nmax }, (_, j) => [j + 1, figura(tipo, j + 1).cantidad]);
  }

  // ---------- Sumas notables ----------
  const SUMAS = {
    naturales: { f: n => n * (n + 1) / 2, ultimo: n => n, n: u => u, e: n => ({ sinDividir: n * (n + 1), nCuadradoMedio: n * n / 2, nMenosUno: n * (n - 1) / 2 }) },
    pares: { f: n => n * (n + 1), ultimo: n => 2 * n, n: u => u / 2, e: n => ({ comoNaturales: n * (n + 1) / 2, nCuadrado: n * n }) },
    impares: { f: n => n * n, ultimo: n => 2 * n - 1, n: u => (u + 1) / 2, e: n => ({ nMasUno: (n + 1) * (n + 1), comoNaturales: n * (n + 1) / 2 }) },
    cuadrados: { f: n => n * (n + 1) * (2 * n + 1) / 6, ultimo: n => n * n, n: u => Math.sqrt(u), e: n => ({ cuadradoDeLaSuma: Math.pow(n * (n + 1) / 2, 2), sinElDosNmasUno: n * (n + 1) / 6 }) },
    cubos: { f: n => Math.pow(n * (n + 1) / 2, 2), ultimo: n => n * n * n, n: u => Math.cbrt(u), e: n => ({ sinCuadrado: n * (n + 1) / 2, cuadradosEnVezDeCubos: n * (n + 1) * (2 * n + 1) / 6 }) },
  };
  function sumaNotable(tipo, n) {
    const T = SUMAS[tipo]; if (!T) throw new Error(`suma desconocida: ${tipo}`);
    numero(n, 'n', { entero: true, min: 1 });
    const S = limpio(T.f(n));
    return { tipo, n, S, ultimo: T.ultimo(n), errores: errores(T.e(n), S) };
  }
  // 1 + 3 + … + 39: primero hay que saber cuántos términos son (n = 20). Errores: tomar el último como n; un término de menos.
  function sumaHasta(o) {
    const T = SUMAS[o.tipo]; if (!T) throw new Error(`suma desconocida: ${o.tipo}`);
    const u = numero(o.ultimo, 'ultimo', { positivo: true });
    const n = limpio(T.n(u));
    if (!Number.isInteger(n) || n < 1) throw new Error(`${u} no es el último término de una suma de ${o.tipo}`);
    const S = limpio(T.f(n));
    return { n, S, errores: errores({ ultimoComoN: u !== n ? T.f(u) : null, unTerminoMenos: n > 1 ? T.f(n - 1) : null }, S) };
  }
  // Las dos escaleras de Gauss: la fila j de la primera tiene j cuadritos; la de la copia girada, n + 1 − j. Juntas
  // llenan un rectángulo de n filas y n + 1 columnas: 2·S = n(n + 1).
  function gauss(n) {
    numero(n, 'n', { entero: true, min: 1 });
    const S = n * (n + 1) / 2;
    return { n, S, filas: n, columnas: n + 1, area: n * (n + 1),
      escalera: n <= 200 ? Array.from({ length: n }, (_, j) => j + 1) : null, copia: n <= 200 ? Array.from({ length: n }, (_, j) => n - j) : null,
      errores: errores(SUMAS.naturales.e(n), S) };
  }

  // ---------- Conteos que no son lineales ----------
  // n personas, cada par se da la mano una vez: la persona 1 da n − 1 apretones nuevos, la 2, n − 2, … (Gauss hasta n − 1).
  function apretones(n) {
    numero(n, 'n', { entero: true, min: 2, max: 60 });
    const total = n * (n - 1) / 2, pares = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pares.push([i, j]);
    return { n, total, porPersona: n - 1, nuevos: Array.from({ length: n - 1 }, (_, j) => n - 1 - j), pares,
      errores: errores({ cuentaDoble: n * (n - 1), nCuadrado: n * n, conUnoMismo: n * (n + 1) / 2, objetoEntero: n % 2 === 0 ? 2 * ((n / 2) * (n / 2 - 1) / 2) : null }, total) };
  }
  // Moser: con n puntos en una circunferencia y todas las cuerdas, sin que tres pasen por un mismo punto interior,
  // las regiones son 1 + C(n, 2) + C(n, 4). Para n = 1, …, 5 sale 1, 2, 4, 8, 16, y con 6 puntos, 31: no 32.
  // Errores: seguir duplicando; repetir el último aumento; el objeto entero; sumar una región por cuerda nueva sin
  // contar que cada cruce también parte una región (ignoraCruces: R(n − 1) + (n − 1)).
  function regionesCirculo(n) {
    numero(n, 'n', { entero: true, min: 1, max: 40 });
    const R = k => 1 + comb(k, 2) + comb(k, 4);
    const reg = R(n);
    return { n, regiones: reg, cuerdas: comb(n, 2), cruces: comb(n, 4), serie: Array.from({ length: n }, (_, j) => R(j + 1)),
      errores: errores({ geometrica: Math.pow(2, n - 1), mismoAumento: n >= 3 ? R(n - 1) + (R(n - 1) - R(n - 2)) : null, objetoEntero: n % 2 === 0 && n > 2 ? 2 * R(n / 2) : null, ignoraCruces: n >= 2 ? R(n - 1) + (n - 1) : null }, reg) };
  }
  // Las cuerdas entre puntos de la circunferencia unidad (ángulos en grados): dónde se cruzan y cuántas regiones dejan.
  // Regiones = 1 + cuerdas + Σ (m − 1) sobre los puntos interiores, con m las cuerdas que pasan por cada uno (Euler).
  function cuerdas(angulos) {
    lista(angulos, 'angulos', 1);
    const P = angulos.map(a => ({ x: Math.cos(a * Math.PI / 180), y: Math.sin(a * Math.PI / 180) }));
    const C = []; for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) C.push([i, j]);
    const orden = angulos.map(a => ((a % 360) + 360) % 360);
    const entre = (t, a, b) => (a < b ? t > a && t < b : t > a || t < b);
    const puntos = [];
    for (let s = 0; s < C.length; s++) for (let t = s + 1; t < C.length; t++) {
      const [a, b] = C[s], [c, d] = C[t];
      if (new Set([a, b, c, d]).size < 4) continue;
      if (entre(orden[c], orden[a], orden[b]) === entre(orden[d], orden[a], orden[b])) continue;   // no se cruzan
      const p = P[a], q = P[b], r = P[c], u = P[d];
      const den = (q.x - p.x) * (u.y - r.y) - (q.y - p.y) * (u.x - r.x);
      const k = ((r.x - p.x) * (u.y - r.y) - (r.y - p.y) * (u.x - r.x)) / den;
      const x = p.x + k * (q.x - p.x), y = p.y + k * (q.y - p.y);
      let pt = puntos.find(z => Math.hypot(z.x - x, z.y - y) < 1e-7);
      if (!pt) { pt = { x, y, cuerdas: new Set() }; puntos.push(pt); }
      pt.cuerdas.add(s); pt.cuerdas.add(t);
    }
    const cruces = puntos.map(z => { const cs = [...z.cuerdas].sort((p, q) => p - q); return { x: z.x, y: z.y, m: cs.length, entre: cs }; });
    const regiones = 1 + C.length + cruces.reduce((s, z) => s + z.m - 1, 0);
    // regiones después de trazar las k primeras cuerdas (k = 0, …, C): cada cuerda suma 1 más los cruces que corta
    const progreso = C.map((_, k) => 1 + (k + 1) + cruces.reduce((s, z) => s + Math.max(0, z.entre.filter(j => j <= k).length - 1), 0));
    progreso.unshift(1);
    return { puntos: P, cuerdas: C, cruces, generales: cruces.every(z => z.m === 2), regiones, progreso };
  }

  // ---------- Analogías y distribuciones numéricas ----------
  // Cada fila es [a, b, x], con x = f(a, b) y una sola x desconocida (null). En una analogía de academia, «a (x) b»;
  // en una distribución, la tercera columna sale de las otras dos. Se prueban reglas sencillas y se exige que todas las
  // reglas: si más de una regla del repertorio cumple todas las filas completas, se rechaza (faltan filas). Error: una
  // regla que cumple solo la primera fila.
  const REGLAS = [
    ['suma', 'a + b', (a, b) => a + b], ['diferencia', 'a − b', (a, b) => a - b], ['producto', 'a · b', (a, b) => a * b],
    ['cociente', 'a ÷ b', (a, b) => a / b], ['dobleDeLaSuma', '2(a + b)', (a, b) => 2 * (a + b)], ['mitadDeLaSuma', '(a + b) ÷ 2', (a, b) => (a + b) / 2],
    ['dobleDeLaDiferencia', '2(a − b)', (a, b) => 2 * (a - b)], ['productoMasUno', 'a · b + 1', (a, b) => a * b + 1], ['productoMenosUno', 'a · b − 1', (a, b) => a * b - 1],
    ['productoMasSuma', 'a · b + a + b', (a, b) => a * b + a + b], ['productoMenosSuma', 'a · b − (a + b)', (a, b) => a * b - (a + b)],
    ['sumaDeCuadrados', 'a² + b²', (a, b) => a * a + b * b], ['diferenciaDeCuadrados', 'a² − b²', (a, b) => a * a - b * b],
    ['cuadradoDeLaSuma', '(a + b)²', (a, b) => (a + b) * (a + b)], ['cuadradoDeLaDiferencia', '(a − b)²', (a, b) => (a - b) * (a - b)],
    ['dobleDelPrimeroMasSegundo', '2a + b', (a, b) => 2 * a + b], ['primeroMasDobleDelSegundo', 'a + 2b', (a, b) => a + 2 * b],
    ['triploDelPrimeroMenosSegundo', '3a − b', (a, b) => 3 * a - b],
    ['cuadradoDelPrimeroMasSegundo', 'a² + b', (a, b) => a * a + b], ['primeroMasCuadradoDelSegundo', 'a + b²', (a, b) => a + b * b],
    ['cuadradoDelPrimeroMenosSegundo', 'a² − b', (a, b) => a * a - b], ['cuadradoDelSegundoMenosPrimero', 'b² − a', (a, b) => b * b - a],
  ];
  function regla(filas) {
    if (!Array.isArray(filas) || filas.length < 2) throw new Error('hacen falta al menos dos filas');
    filas.forEach((f, j) => { if (!Array.isArray(f) || f.length !== 3) throw new Error(`fila ${j}: debe ser [a, b, x]`); numero(f[0], `a de la fila ${j}`); numero(f[1], `b de la fila ${j}`); if (f[2] !== null) numero(f[2], `x de la fila ${j}`); });
    const faltan = filas.filter(f => f[2] === null);
    if (faltan.length !== 1) throw new Error('exactamente una fila debe tener x en null');
    const completas = filas.filter(f => f[2] !== null), [a, b] = faltan[0];
    const cumple = (R, f) => igual(R[2](f[0], f[1]), f[2]);
    const valen = REGLAS.filter(R => completas.every(f => cumple(R, f)));
    if (!valen.length) throw new Error('ninguna regla sencilla cumple todas las filas');
    const vals = valen.map(R => limpio(R[2](a, b)));
    // Si dos reglas del repertorio cumplen todas las filas, la analogía no tiene una sola respuesta defendible: faltan filas.
    if (valen.length > 1) throw new Error(`hay más de una regla posible (${valen.map(R => R[1]).join('; ')}): faltan filas`);
    const solo1 = REGLAS.find(R => cumple(R, completas[0]) && !completas.every(f => cumple(R, f)));
    return { regla: valen[0][0], texto: valen[0][1], valor: vals[0], reglas: valen.map(R => R[0]),
      errores: errores({ primeraFila: solo1 ? solo1[2](a, b) : null }, vals[0]), reglaPrimeraFila: solo1 ? solo1[0] : null };
  }

  return { fraccion, textoFraccion, comb, aritmetica, desdeOtroTermino, cantidadTerminos, sumaAritmetica, geometrica, sumaGeometrica,
    sumaInfinita, dobleces, mitades, diferencias, segundoOrden, siguiente, figura, tablaFigura, TIPOS: Object.keys(FIGURAS),
    sumaNotable, sumaHasta, gauss, apretones, regionesCirculo, cuerdas, regla, REGLAS: REGLAS.map(R => R[0]) };
});
