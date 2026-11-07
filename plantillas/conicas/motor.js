/*
 * Motor de «La cuerda del jardinero»: lugar geométrico y cónicas (circunferencia, parábola, elipse e hipérbola).
 *
 * Aquí vive toda la matemática de la plantilla (regla 1 de CLAUDE.md). No toca el DOM: funciona igual en el
 * navegador (window.MotorConicas) y en Node (require('./motor.js')), donde lo prueban casos.json y papel.json.
 *
 * Números EXACTOS: fracciones y radicales de un término, n√r/d con r libre de cuadrados ('√7', '2√5', '√5/3', '18/5').
 * Las entradas son enteros, fracciones como texto ('3/2') u objetos { n, d }. Los puntos se escriben (x; y), con punto
 * y coma, porque la coma es decimal; con centro en el origen, los dos focos van juntos: '(±5; 0)'. Si no, se escriben
 * de izquierda a derecha (eje horizontal) o de arriba abajo (eje vertical): '(2; 3) y (2; −5)'. Signo menos tipográfico.
 * Notación de academia: V vértice, F foco, p (de V a F, con signo), LR lado recto, a, b, c, e excentricidad.
 *
 * Funciones exportadas (argumentos → lo que devuelve):
 *   circunferencia({ h, k, r2 })
 *       (x − h)² + (y − k)² = r2. → { tipo 'circunferencia', h, k, r2, r (valor), rTexto, centroTexto '(3; −4)',
 *       ecuacion, general ('x² + y² − 6x + 8y − 11 = 0'), D, E, F, texto ('(3; −4) y r = 6'), errores, coinciden, num }.
 *       errores: signos (CO8, centro (−h; −k)), radioCuadrado (CO9, r = r2). crudos: los mismos errores antes de quitar
 *       los que coinciden (los usa circunferenciaGeneral). La respuesta es un texto: 'valor' es null.
 *   circunferenciaGeneral({ A, D, E, F })
 *       A x² + A y² + D x + E y + F = 0 (A = 1 si no se da). Completa cuadrados: h = −D/(2A), k = −E/(2A),
 *       r² = (D² + E² − 4AF)/(4A²). → { tipo: 'circunferencia' | 'punto' | 'vacia', h, k, r2, completada
 *       ('(x − 3)² + (y + 4)² = 36'), texto, rTexto, centroTexto, errores, coinciden, noAplica }.
 *       errores: signos (CO8), radioCuadrado (CO9), sinSumar (CO10: r² = −F/A, sin sumar (D/2A)² y (E/2A)² al otro lado;
 *       si −F/A ≤ 0 va en noAplica). Con 'punto' o 'vacia' no hay errores.
 *   parabola({ eje, h, k, p | cuatroP })
 *       eje 'x': (y − k)² = 4p(x − h), eje del foco horizontal; eje 'y': (x − h)² = 4p(y − k). p ≠ 0 (o cuatroP = 4p).
 *       → { tipo 'parabola', eje, h, k, p, pTexto, verticeTexto, focoTexto, directriz ('x = 4'), abre ('a la derecha',
 *       'a la izquierda', 'hacia arriba', 'hacia abajo'), LR (valor 4|p|), ecuacion, extremosLR (texto), num,
 *       foco: { texto, errores, coinciden }, lr: { valor, texto, errores, coinciden } }.
 *       foco.errores: signo (CO11, V − p), cuatroP (CO12, V + 4p), eje (CO13, p sobre el otro eje).
 *       lr.errores: conSigno (CO14, 4p; coincide si p > 0), dosP (CO15, 2|p|), soloP (CO16, |p|).
 *   elipse({ h, k, nx, ny } | { h, k, a, c, eje } | { h, k, a2, b2, eje })
 *       (x − h)²/nx + (y − k)²/ny = 1 con nx ≠ ny (el eje mayor va con el denominador mayor), o desde a y c (enteros o
 *       fracciones, 0 < c < a) o desde a² > b². eje 'x' | 'y' es el del eje mayor ('x' si no se da).
 *       → { tipo 'elipse', eje, h, k, a2, b2, c2, a, b, c, e, LR (los cinco como { valor, texto }), ecuacion,
 *       centroTexto, verticesTexto, focosTexto, menoresTexto (extremos del eje menor), num, y cuatro preguntas con
 *       { valor, texto, errores, coinciden }:
 *         semiejeMenor  b = √(a² − c²); errores cHiperbola (CO1, √(a² + c²)), resta (CO3, a − c), sinRaiz (CO4, a² − c²).
 *         excentricidad e = c/a; errores invertida (CO5, a/c), otroSemieje (CO6, b/a), dosC (CO24, 2c/a).
 *         ladoRecto     LR = 2b²/a; errores sinCuadrado (CO25, 2b/a), sinDos (CO26, b²/a), cambiado (CO27, 2a²/b).
 *         focos         texto de los dos focos; errores signos (CO8, centro (−h; −k)), ejeCambiado (CO7, los focos
 *                       sobre el otro eje), cHiperbola (CO1, c = √(a² + b²)), vertices (CO18, en los vértices) }.
 *   hiperbola({ h, k, a2, b2, eje })
 *       eje 'x': (x − h)²/a2 − (y − k)²/b2 = 1; eje 'y': (y − k)²/a2 − (x − h)²/b2 = 1. a² va bajo el término POSITIVO,
 *       sea mayor o menor que b². → { tipo 'hiperbola', eje, h, k, a2, b2, c2, a, b, c, e, LR, ecuacion,
 *       verticesTexto, focosTexto, asintotas ('y = ±(4/3)x' o 'y − 1 = ±(2/3)(x + 2)'), num, y preguntas:
 *         focos     errores cElipse (CO2, c = √|a² − b²|; noAplica si a² = b²), aMayor (CO17, toma a² como el
 *                   denominador mayor y su eje; coincide si a² > b²), vertices (CO18).
 *         pendiente '±4/3', la de las asíntotas (b/a con eje x, a/b con eje y); errores invertida (CO21),
 *                   sinRaiz (CO22, la razón de los cuadrados), invertidaSinRaiz (CO23).
 *         excentricidad e = c/a > 1; errores invertida (CO5), dosC (CO24) }.
 *   general({ A, C, D, E, F })
 *       A x² + C y² + D x + E y + F = 0, enteros, sin término xy. Reconoce por los signos de A y C (A·C > 0 elipse, y
 *       circunferencia si A = C; A·C < 0 hipérbola; A o C cero, parábola) y completa cuadrados.
 *       → { tipo: 'circunferencia' | 'elipse' | 'hiperbola' | 'parabola' | 'punto' | 'vacia' | 'rectas',
 *       nombre ('una elipse'), porSignos (lo que dicen A y C antes de completar), completada
 *       ('4(x − 1)² + 9(y + 2)² = 36'), canonica (la ecuación de la cónica), conica (el resultado de circunferencia,
 *       elipse, hiperbola o parabola), errores, coinciden }. errores (nombres): cambiaSigno (CO19, elipse ↔ hipérbola),
 *       dosCuadrados (CO20, 'una circunferencia'), lineales (CO28, 'una parábola'); solo con elipse e hipérbola.
 *   jardinero({ a, c })
 *       La cuerda de largo 2a atada a dos clavos a distancia 2c (0 ≤ c ≤ a), centro en el origen. → { figura
 *       ('una circunferencia' si c = 0, 'una elipse' si 0 < c < a, 'un segmento' si c = a), conica (elipse o
 *       circunferencia; null si es un segmento), errores, coinciden }. errores, solo con c = 0: segmento (CO34),
 *       punto (CO35), parabola (CO36).
 *   plato({ ancho, hondo })
 *       Plato parabólico de boca 'ancho' y profundidad 'hondo' (cm): (ancho/2)² = 4p·hondo. → { valor p, texto
 *       '45 cm', errores: cuatroP (CO12, 4p), dosP (CO30, con x² = 2py: 2p), hondo (CO29, p = hondo), coinciden, conica }.
 *   cono({ inclinacion, generatriz })
 *       Corte de un cono doble por un plano. Ángulos en grados con la horizontal: el del plano (0 a 85) y el de la
 *       generatriz (entre 10 y 80); el plano pasa por el eje a una unidad debajo del vértice y se inclina hasta 85°. → { tipo, nombre ('una parábola'), e (sen inclinación / sen generatriz, numérico),
 *       cortes (puntos de la vista de costado donde el plano corta las generatrices, para el dibujo), errores (nombres
 *       de las otras curvas: cerrada CO31 'una elipse', abierta CO32 'una hipérbola', rectas CO33 'dos rectas'; cada
 *       uno solo si es distinto de la respuesta), coinciden, conica: { tipo 'polar', e, l } }.
 *   puntoEn(conica, t, rama)
 *       Punto de la cónica para el parámetro t: ángulo en radianes en la elipse (h + a cos t; k + b sen t, girado si
 *       el eje es y) y en la circunferencia; en la parábola (h + pt²; k + 2pt); en la hipérbola (h ± a ch t; k + b sh t),
 *       con rama 1 (la del lado positivo del eje) o −1. → { x, y }. conica es un resultado del motor o su campo num.
 *   sobre(conica, { x, y })
 *       El punto de la cónica que sigue al dedo: el de su mismo ángulo (elipse), su misma altura o abscisa a lo largo
 *       del eje (parábola) o su misma coordenada transversal en la rama del lado del dedo (hipérbola). → { x, y, t, rama }.
 *   distancias(conica, { x, y })
 *       Numérico. Elipse e hipérbola: { PF1, PF2, suma, diferencia (|PF1 − PF2|), F1, F2 }; parábola: { PF, PD, pie
 *       (el punto de la directriz más cercano), F }; circunferencia: { r }.
 *   trazar(conica, { x0, x1, y0, y1, n })
 *       Lista de trazos [[{ x, y }, …], …] dentro de la caja (la hipérbola da dos, una por rama). Para la cónica polar
 *       del cono, r = l/(1 − e cos θ) con el foco en el origen.
 *   texto(v), fraccion(x)
 *       Texto exacto de una fracción o radical; fraccion convierte la entrada a { n, d }.
 *   ERRORES
 *       id → descripción. CO1 a CO36 son hipótesis nuestras: los informes de docs/investigacion/ no tratan las cónicas
 *       (el de trigonometría las deja fuera; el de geometría deja fuera la analítica).
 *
 * Cada pregunta trae 'errores': nombre → { id, valor, texto }, lo que da cada error típico. Un error que con esos
 * números da lo mismo que la respuesta correcta se quita y su nombre queda en 'coinciden'; uno que no tiene sentido
 * (una raíz de un negativo) queda en 'noAplica'.
 */
(function (root, fabrica) {
  const motor = fabrica();
  if (typeof module === 'object' && module.exports) module.exports = motor;
  else root.MotorConicas = motor;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const MENOS = '−', GR = Math.PI / 180;
  const ERRORES = {
    CO1: 'elipse con c² = a² + b², la relación de la hipérbola',
    CO2: 'hipérbola con c² = a² − b², la relación de la elipse',
    CO3: 'b = a − c: resta los lados del triángulo sin elevar al cuadrado',
    CO4: 'olvida la raíz: da b² (o c²) en lugar de b',
    CO5: 'excentricidad invertida: e = a/c',
    CO6: 'excentricidad con el otro semieje: e = b/a',
    CO7: 'elipse: toma a² siempre bajo x, aunque el denominador mayor esté bajo y',
    CO8: 'centro con los signos cambiados: de (x + 3)² lee h = 3',
    CO9: 'lee r² como si fuera el radio',
    CO10: 'completa cuadrados sin sumar al otro lado lo que agregó',
    CO11: 'ignora el signo de p: el foco hacia el lado contrario',
    CO12: 'toma 4p como si fuera p',
    CO13: 'parábola: pone el foco sobre el otro eje',
    CO14: 'lado recto = 4p con su signo (negativo si p < 0)',
    CO15: 'lado recto = 2|p|',
    CO16: 'lado recto = |p|',
    CO17: 'hipérbola: toma a² como el denominador mayor, como en la elipse',
    CO18: 'pone los focos en los vértices (c = a)',
    CO19: 'confunde elipse e hipérbola: mira el signo de cada término y no si A y C tienen el mismo signo',
    CO20: 'dos cuadrados con el mismo signo son una circunferencia, aunque A ≠ C',
    CO21: 'asíntotas con la razón invertida',
    CO22: 'asíntotas sin raíz: la razón de los cuadrados',
    CO23: 'asíntotas con la razón invertida y sin raíz',
    CO24: 'excentricidad con la distancia entre los focos: e = 2c/a',
    CO25: 'lado recto sin el cuadrado: 2b/a',
    CO26: 'lado recto sin el 2: b²/a',
    CO27: 'lado recto con a y b cambiados: 2a²/b',
    CO28: 'llama parábola a la que tiene términos en x y en y',
    CO29: 'plato: pone el foco a la altura del borde (p = hondo)',
    CO30: 'plato: usa x² = 2py (da 2p)',
    CO31: 'cono: todo corte inclinado da una elipse',
    CO32: 'cono: el plano paralelo a la generatriz da una hipérbola',
    CO33: 'cono: el plano paralelo a la generatriz da dos rectas',
    CO34: 'con los clavos juntos, la cuerda dibuja un segmento',
    CO35: 'con los clavos juntos, la cuerda dibuja un punto',
    CO36: 'con los clavos juntos, la cuerda dibuja una parábola'
  };

  // ---------- Fracciones ----------
  function mcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; }
  function F(n, d) {
    if (d === undefined) d = 1;
    if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d)) throw new Error('números demasiado grandes o no enteros para el motor');
    if (d === 0) throw new Error('división entre cero');
    if (d < 0) { n = -n; d = -d; }
    const g = mcd(n, d) || 1;
    return { n: n / g + 0, d: d / g };
  }
  const fSum = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
  const fRes = (a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d);
  const fMul = (a, b) => F(a.n * b.n, a.d * b.d);
  const fDiv = (a, b) => { if (b.n === 0) throw new Error('división entre cero'); return F(a.n * b.d, a.d * b.n); };
  const fNeg = a => F(-a.n, a.d);
  const fAbs = a => F(Math.abs(a.n), a.d);
  const fNum = a => a.n / a.d + 0;
  const fCero = a => a.n === 0;
  const fIgual = (a, b) => a.n === b.n && a.d === b.d;
  const fCmp = (a, b) => a.n * b.d - b.n * a.d;
  function fraccion(x, que) {
    que = que || 'el dato';
    if (x && typeof x === 'object' && Number.isInteger(x.n) && Number.isInteger(x.d)) return F(x.n, x.d);
    if (typeof x === 'number') {
      if (!Number.isFinite(x)) throw new Error(`${que} debe ser un número`);
      if (Number.isInteger(x)) return F(x, 1);
      throw new Error(`${que} debe ser entero o una fracción como texto ('3/2')`);
    }
    if (typeof x === 'string') {
      const m = x.trim().replace(/−/g, '-').match(/^(-?\d+)(?:\/(\d+))?$/);
      if (m) return F(Number(m[1]), m[2] ? Number(m[2]) : 1);
    }
    throw new Error(`${que} debe ser un número`);
  }
  function fTexto(a) {
    const s = a.n < 0 ? MENOS : '';
    return a.d === 1 ? s + Math.abs(a.n) : `${s}${Math.abs(a.n)}/${a.d}`;
  }

  // ---------- Radicales de un término: n√r/d, r libre de cuadrados (n ≥ 0 en las longitudes) ----------
  function sacar(r) {
    let s = 1, t = r;
    for (let p = 2; p * p <= t; p++) while (t % (p * p) === 0) { t /= p * p; s *= p; }
    return { s, t };
  }
  function R(n, d, r) {
    if (r === 0 || n === 0) return { n: 0, d: 1, r: 1 };
    const q = sacar(r), f = F(n * q.s, d);
    return { n: f.n, d: f.d, r: q.t };
  }
  const deFr = f => R(f.n, f.d, 1);
  function raiz(f) {   // √(n/d) = √(n·d)/d
    if (f.n < 0) throw new Error('raíz de un negativo');
    return R(1, f.d, f.n * f.d);
  }
  const rMul = (A, B) => R(A.n * B.n, A.d * B.d, A.r * B.r);
  function rDiv(A, B) {   // (An√Ar/Ad)/(Bn√Br/Bd) = An·Bd·√(Ar·Br)/(Ad·Bn·Br)
    if (B.n === 0) throw new Error('división entre cero');
    return R(A.n * B.d, A.d * B.n * B.r, A.r * B.r);
  }
  const rEsc = (A, f) => R(A.n * f.n, A.d * f.d, A.r);
  const rValor = A => A.n * Math.sqrt(A.r) / A.d + 0;
  const rRacional = A => A.r === 1;
  function rTexto(A) {
    if (A.n === 0) return '0';
    const s = A.n < 0 ? MENOS : '', m = Math.abs(A.n);
    const num = A.r === 1 ? String(m) : (m === 1 ? `√${A.r}` : `${m}√${A.r}`);
    return s + (A.d === 1 ? num : `${num}/${A.d}`);
  }
  const rIgual = (A, B) => A.n === B.n && A.d === B.d && A.r === B.r;
  const nr = A => ({ valor: rValor(A), texto: rTexto(A) });

  // Coordenada h ± c (h fracción, c radical)
  function coord(h, c, signo) {
    if (rRacional(c)) return fTexto(fSum(h, F(signo * c.n, c.d)));
    const ct = rTexto(c);
    if (fCero(h)) return signo > 0 ? ct : MENOS + ct;
    return `${fTexto(h)} ${signo > 0 ? '+' : MENOS} ${ct}`;
  }
  const coordV = (h, c, signo) => fNum(h) + signo * rValor(c);
  const punto = (x, y) => `(${x}; ${y})`;
  // Los dos puntos centro ± c sobre el eje. Con centro en el origen: (±c; 0).
  function parTexto(h, k, c, eje) {
    if (c.n === 0) return punto(fTexto(h), fTexto(k));
    if (fCero(h) && fCero(k)) return eje === 'x' ? punto('±' + rTexto(c), '0') : punto('0', '±' + rTexto(c));
    const hT = fTexto(h), kT = fTexto(k);
    if (eje === 'x') return `${punto(coord(h, c, -1), kT)} y ${punto(coord(h, c, 1), kT)}`;
    return `${punto(hT, coord(k, c, 1))} y ${punto(hT, coord(k, c, -1))}`;
  }
  const parNum = (h, k, c, eje) => eje === 'x'
    ? [[coordV(h, c, -1), fNum(k)], [coordV(h, c, 1), fNum(k)]]
    : [[fNum(h), coordV(k, c, 1)], [fNum(h), coordV(k, c, -1)]];

  // (x − h)², (x + 3)², x²
  function cuadrado(v, h) {
    if (fCero(h)) return `${v}²`;
    return `(${v} ${h.n > 0 ? MENOS : '+'} ${fTexto(fAbs(h))})²`;
  }
  const sobreN = (t, n) => (n.n === 1 && n.d === 1 ? t : `${t}/${fTexto(n)}`);   // x²/9, y² (sin «/1»)
  function binomio(v, h) {
    if (fCero(h)) return v;
    return `${v} ${h.n > 0 ? MENOS : '+'} ${fTexto(fAbs(h))}`;
  }
  // Polinomio con términos [coef, 'x²'] → '9x² + 4y² − 18x = 0'
  function poli(terms) {
    let s = '';
    for (const [c, t] of terms) {
      if (fCero(c)) continue;
      const a = fAbs(c), coef = t && a.n === 1 && a.d === 1 ? '' : fTexto(a);
      const cuerpo = coef + t;
      if (!s) s = (c.n < 0 ? MENOS : '') + cuerpo;
      else s += (c.n < 0 ? ` ${MENOS} ` : ' + ') + cuerpo;
    }
    return s || '0';
  }

  // Quita los errores que coinciden con la respuesta (por texto) o se repiten entre sí.
  function pregunta(correcta, errs, extra) {
    const errores = {}, coinciden = [], noAplica = [];
    for (const [k, e] of Object.entries(errs)) {
      if (e === null) { noAplica.push(k); continue; }
      if (e.texto === correcta.texto) { coinciden.push(k); continue; }
      errores[k] = e;
    }
    return Object.assign({ valor: correcta.valor, texto: correcta.texto, errores, coinciden, noAplica }, extra || {});
  }
  const er = (id, valor, texto) => ({ id, valor, texto });

  function ejeDe(e) {
    if (e === undefined) return 'x';
    if (e !== 'x' && e !== 'y') throw new Error("el eje debe ser 'x' o 'y'");
    return e;
  }

  // ---------- Circunferencia ----------
  function circunferencia(o) {
    o = o || {};
    const h = fraccion(o.h || 0, 'h'), k = fraccion(o.k || 0, 'k'), r2 = fraccion(o.r2, 'r2');
    if (r2.n <= 0) throw new Error('r2 debe ser positivo');
    const r = raiz(r2), D = fMul(F(-2), h), E = fMul(F(-2), k), Fc = fRes(fSum(fMul(h, h), fMul(k, k)), r2);
    const centroTexto = punto(fTexto(h), fTexto(k)), rT = rTexto(r);
    const texto = `${centroTexto} y r = ${rT}`;
    const crudos = {
      signos: er('CO8', null, `${punto(fTexto(fNeg(h)), fTexto(fNeg(k)))} y r = ${rT}`),
      radioCuadrado: er('CO9', null, `${centroTexto} y r = ${fTexto(r2)}`)
    };
    const q = pregunta({ valor: null, texto }, crudos);
    return Object.assign(q, { crudos,
      tipo: 'circunferencia', h: fNum(h), k: fNum(k), r2: fNum(r2), r: rValor(r), rTexto: rT, centroTexto,
      ecuacion: `${cuadrado('x', h)} + ${cuadrado('y', k)} = ${fTexto(r2)}`,
      general: `${poli([[F(1), 'x²'], [F(1), 'y²'], [D, 'x'], [E, 'y'], [Fc, '']])} = 0`,
      D: fNum(D), E: fNum(E), F: fNum(Fc),
      num: { tipo: 'circunferencia', h: fNum(h), k: fNum(k), r: rValor(r) }
    });
  }
  function circunferenciaGeneral(o) {
    o = o || {};
    const A = fraccion(o.A === undefined ? 1 : o.A, 'A'), D = fraccion(o.D || 0, 'D'), E = fraccion(o.E || 0, 'E'), Fc = fraccion(o.F || 0, 'F');
    if (fCero(A)) throw new Error('A no puede ser 0');
    const h = fDiv(fNeg(D), fMul(F(2), A)), k = fDiv(fNeg(E), fMul(F(2), A));
    const r2 = fSum(fSum(fMul(h, h), fMul(k, k)), fDiv(fNeg(Fc), A));
    const completada = `${cuadrado('x', h)} + ${cuadrado('y', k)} = ${fTexto(r2)}`;
    if (r2.n <= 0) {
      const tipo = r2.n === 0 ? 'punto' : 'vacia';
      return { tipo, h: fNum(h), k: fNum(k), r2: fNum(r2), completada, centroTexto: punto(fTexto(h), fTexto(k)),
        texto: tipo === 'punto' ? `solo el punto ${punto(fTexto(h), fTexto(k))}` : 'ningún punto', errores: {}, coinciden: [], noAplica: [] };
    }
    const C = circunferencia({ h, k, r2 });
    const sinSumar = fDiv(fNeg(Fc), A);
    const errs = Object.assign({}, C.crudos);
    errs.sinSumar = sinSumar.n > 0 ? er('CO10', null, `${C.centroTexto} y r = ${rTexto(raiz(sinSumar))}`) : null;
    const q = pregunta({ valor: null, texto: C.texto }, errs);
    return Object.assign({}, C, q, { tipo: 'circunferencia', completada, ecuacion: C.ecuacion });
  }

  // ---------- Parábola ----------
  function parabola(o) {
    o = o || {};
    const eje = ejeDe(o.eje), h = fraccion(o.h || 0, 'h'), k = fraccion(o.k || 0, 'k');
    let p;
    if (o.p !== undefined) p = fraccion(o.p, 'p');
    else if (o.cuatroP !== undefined) p = fDiv(fraccion(o.cuatroP, 'cuatroP'), F(4));
    else throw new Error('falta p (o cuatroP)');
    if (fCero(p)) throw new Error('p no puede ser 0');
    const cuatroP = fMul(F(4), p), LR = fAbs(cuatroP), V = punto(fTexto(h), fTexto(k));
    const desplaza = (d, enEje) => (enEje === 'x' ? punto(fTexto(fSum(h, d)), fTexto(k)) : punto(fTexto(h), fTexto(fSum(k, d))));
    const otro = eje === 'x' ? 'y' : 'x';
    const focoT = desplaza(p, eje);
    const directriz = eje === 'x' ? `x = ${fTexto(fRes(h, p))}` : `y = ${fTexto(fRes(k, p))}`;
    const abre = eje === 'x' ? (p.n > 0 ? 'a la derecha' : 'a la izquierda') : (p.n > 0 ? 'hacia arriba' : 'hacia abajo');
    const c4 = fAbs(cuatroP).n === 1 && cuatroP.d === 1 ? (cuatroP.n < 0 ? MENOS : '') : (cuatroP.d === 1 ? fTexto(cuatroP) : `(${fTexto(cuatroP)})`);
    const lado = eje === 'x' ? binomio('x', h) : binomio('y', k);
    const derecha = c4 === '' || c4 === MENOS ? `${c4}${fCero(eje === 'x' ? h : k) ? lado : `(${lado})`}` : (fCero(eje === 'x' ? h : k) ? `${c4}${lado}` : `${c4}(${lado})`);
    const ecuacion = `${eje === 'x' ? cuadrado('y', k) : cuadrado('x', h)} = ${derecha}`;
    const dosP = fMul(F(2), fAbs(p));
    const fx = eje === 'x' ? fSum(h, p) : h, fy = eje === 'x' ? k : fSum(k, p);
    const extremosLR = eje === 'x'
      ? `${punto(fTexto(fx), fTexto(fSum(k, dosP)))} y ${punto(fTexto(fx), fTexto(fRes(k, dosP)))}`
      : `${punto(fTexto(fRes(h, dosP)), fTexto(fy))} y ${punto(fTexto(fSum(h, dosP)), fTexto(fy))}`;
    const foco = pregunta({ valor: null, texto: focoT }, {
      signo: er('CO11', null, desplaza(fNeg(p), eje)),
      cuatroP: er('CO12', null, desplaza(cuatroP, eje)),
      eje: er('CO13', null, desplaza(p, otro))
    });
    const lr = pregunta({ valor: fNum(LR), texto: fTexto(LR) }, {
      conSigno: er('CO14', fNum(cuatroP), fTexto(cuatroP)),
      dosP: er('CO15', fNum(dosP), fTexto(dosP)),
      soloP: er('CO16', fNum(fAbs(p)), fTexto(fAbs(p)))
    });
    return {
      tipo: 'parabola', eje, h: fNum(h), k: fNum(k), p: fNum(p), pTexto: fTexto(p), verticeTexto: V, focoTexto: focoT,
      directriz, abre, LR: fNum(LR), lrTexto: fTexto(LR), ecuacion, extremosLR, foco, lr,
      num: { tipo: 'parabola', eje, h: fNum(h), k: fNum(k), p: fNum(p), F: [fNum(fx), fNum(fy)] }
    };
  }

  // ---------- Elipse ----------
  function elipse(o) {
    o = o || {};
    const h = fraccion(o.h || 0, 'h'), k = fraccion(o.k || 0, 'k');
    let eje, a2, b2, desdeAC = false;
    if (o.nx !== undefined || o.ny !== undefined) {
      const nx = fraccion(o.nx, 'nx'), ny = fraccion(o.ny, 'ny');
      if (nx.n <= 0 || ny.n <= 0) throw new Error('los denominadores deben ser positivos');
      if (fIgual(nx, ny)) throw new Error('con denominadores iguales es una circunferencia');
      eje = fCmp(nx, ny) > 0 ? 'x' : 'y'; a2 = eje === 'x' ? nx : ny; b2 = eje === 'x' ? ny : nx;
    } else if (o.c !== undefined) {
      eje = ejeDe(o.eje);
      const a = fraccion(o.a, 'a'), c = fraccion(o.c, 'c');
      if (!(c.n > 0) || fCmp(c, a) >= 0) throw new Error('hace falta 0 < c < a');
      a2 = fMul(a, a); b2 = fRes(a2, fMul(c, c)); desdeAC = true;
    } else {
      eje = ejeDe(o.eje); a2 = fraccion(o.a2, 'a2'); b2 = fraccion(o.b2, 'b2');
      if (!(b2.n > 0) || fCmp(a2, b2) <= 0) throw new Error('hace falta a² > b² > 0');
    }
    const c2 = fRes(a2, b2), a = raiz(a2), b = raiz(b2), c = raiz(c2);
    const e = rDiv(c, a), LR = rDiv(deFr(fMul(F(2), b2)), a);
    const nx = eje === 'x' ? a2 : b2, ny = eje === 'x' ? b2 : a2;
    const ecuacion = `${sobreN(cuadrado('x', h), nx)} + ${sobreN(cuadrado('y', k), ny)} = 1`;
    const otro = eje === 'x' ? 'y' : 'x';
    const ch = raiz(fSum(a2, b2));
    // b desde a y c (el triángulo de la cuerda): errores
    const semiejeMenor = pregunta(nr(b), {
      cHiperbola: Object.assign(er('CO1'), nr(raiz(fSum(a2, c2)))),
      resta: rRacional(a) && rRacional(c) ? Object.assign(er('CO3'), nr(deFr(fRes(F(a.n, a.d), F(c.n, c.d))))) : null,
      sinRaiz: Object.assign(er('CO4'), nr(deFr(b2)))
    });
    const excentricidad = pregunta(nr(e), {
      invertida: Object.assign(er('CO5'), nr(rDiv(a, c))),
      otroSemieje: Object.assign(er('CO6'), nr(rDiv(b, a))),
      dosC: Object.assign(er('CO24'), nr(rDiv(rEsc(c, F(2)), a)))
    });
    const ladoRecto = pregunta(nr(LR), {
      sinCuadrado: Object.assign(er('CO25'), nr(rDiv(rEsc(b, F(2)), a))),
      sinDos: Object.assign(er('CO26'), nr(rDiv(deFr(b2), a))),
      cambiado: Object.assign(er('CO27'), nr(rDiv(deFr(fMul(F(2), a2)), b)))
    });
    const focosT = parTexto(h, k, c, eje);
    const focos = pregunta({ valor: null, texto: focosT }, {
      signos: er('CO8', null, parTexto(fNeg(h), fNeg(k), c, eje)),
      ejeCambiado: er('CO7', null, parTexto(h, k, c, otro)),
      cHiperbola: er('CO1', null, parTexto(h, k, ch, eje)),
      vertices: er('CO18', null, parTexto(h, k, a, eje))
    });
    return {
      tipo: 'elipse', eje, h: fNum(h), k: fNum(k), desdeAC,
      a2: { valor: fNum(a2), texto: fTexto(a2) }, b2: { valor: fNum(b2), texto: fTexto(b2) }, c2: { valor: fNum(c2), texto: fTexto(c2) },
      a: nr(a), b: nr(b), c: nr(c), e: nr(e), LR: nr(LR), ecuacion,
      centroTexto: punto(fTexto(h), fTexto(k)), verticesTexto: parTexto(h, k, a, eje), focosTexto: focosT,
      menoresTexto: parTexto(h, k, b, otro),
      semiejeMenor, excentricidad, ladoRecto, focos,
      num: { tipo: 'elipse', eje, h: fNum(h), k: fNum(k), a: rValor(a), b: rValor(b), c: rValor(c), focos: parNum(h, k, c, eje) }
    };
  }

  // ---------- Hipérbola ----------
  function hiperbola(o) {
    o = o || {};
    const eje = ejeDe(o.eje), h = fraccion(o.h || 0, 'h'), k = fraccion(o.k || 0, 'k');
    const a2 = fraccion(o.a2, 'a2'), b2 = fraccion(o.b2, 'b2');
    if (!(a2.n > 0) || !(b2.n > 0)) throw new Error('a² y b² deben ser positivos');
    const c2 = fSum(a2, b2), a = raiz(a2), b = raiz(b2), c = raiz(c2), e = rDiv(c, a), LR = rDiv(deFr(fMul(F(2), b2)), a);
    const otro = eje === 'x' ? 'y' : 'x';
    const ecuacion = eje === 'x'
      ? `${sobreN(cuadrado('x', h), a2)} ${MENOS} ${sobreN(cuadrado('y', k), b2)} = 1`
      : `${sobreN(cuadrado('y', k), a2)} ${MENOS} ${sobreN(cuadrado('x', h), b2)} = 1`;
    const m = eje === 'x' ? rDiv(b, a) : rDiv(a, b), mInv = eje === 'x' ? rDiv(a, b) : rDiv(b, a);
    const m2 = eje === 'x' ? fDiv(b2, a2) : fDiv(a2, b2), m2Inv = fDiv(F(1), m2);
    const pm = t => '±' + t;
    const mT = rTexto(m), mParen = /[/√]/.test(mT) && !/^\d+$/.test(mT) ? `(${mT})` : (mT === '1' ? '' : mT);
    const asintotas = fCero(h) && fCero(k) ? `y = ±${mParen}x` : `${binomio('y', k)} = ±${mParen}(${binomio('x', h)})`;
    const focosT = parTexto(h, k, c, eje);
    const ejeMayor = fCmp(b2, a2) > 0 ? otro : eje;   // CO17: a² = el denominador mayor (y su eje)
    const c2e = fAbs(fRes(a2, b2));
    const focos = pregunta({ valor: null, texto: focosT }, {
      cElipse: c2e.n === 0 ? null : er('CO2', null, parTexto(h, k, raiz(c2e), eje)),
      aMayor: er('CO17', null, parTexto(h, k, c, ejeMayor)),
      vertices: er('CO18', null, parTexto(h, k, a, eje))
    });
    const pendiente = pregunta({ valor: rValor(m), texto: pm(mT) }, {
      invertida: er('CO21', rValor(mInv), pm(rTexto(mInv))),
      sinRaiz: er('CO22', fNum(m2), pm(fTexto(m2))),
      invertidaSinRaiz: er('CO23', fNum(m2Inv), pm(fTexto(m2Inv)))
    });
    const excentricidad = pregunta(nr(e), {
      invertida: Object.assign(er('CO5'), nr(rDiv(a, c))),
      dosC: Object.assign(er('CO24'), nr(rDiv(rEsc(c, F(2)), a)))
    });
    return {
      tipo: 'hiperbola', eje, h: fNum(h), k: fNum(k),
      a2: { valor: fNum(a2), texto: fTexto(a2) }, b2: { valor: fNum(b2), texto: fTexto(b2) }, c2: { valor: fNum(c2), texto: fTexto(c2) },
      a: nr(a), b: nr(b), c: nr(c), e: nr(e), LR: nr(LR), ecuacion, centroTexto: punto(fTexto(h), fTexto(k)),
      verticesTexto: parTexto(h, k, a, eje), focosTexto: focosT, asintotas, focos, pendiente, excentricidad,
      num: { tipo: 'hiperbola', eje, h: fNum(h), k: fNum(k), a: rValor(a), b: rValor(b), c: rValor(c), focos: parNum(h, k, c, eje), m: rValor(m) }
    };
  }

  // ---------- Ecuación general ----------
  const NOMBRE = { circunferencia: 'una circunferencia', elipse: 'una elipse', hiperbola: 'una hipérbola', parabola: 'una parábola',
    punto: 'un punto', vacia: 'ningún punto', rectas: 'dos rectas' };
  function general(o) {
    o = o || {};
    const A = fraccion(o.A || 0, 'A'), C = fraccion(o.C || 0, 'C'), D = fraccion(o.D || 0, 'D'), E = fraccion(o.E || 0, 'E'), Fc = fraccion(o.F || 0, 'F');
    if (fCero(A) && fCero(C)) throw new Error('hace falta x² o y²: con A = C = 0 es una recta');
    const ecuacionGeneral = `${poli([[A, 'x²'], [C, 'y²'], [D, 'x'], [E, 'y'], [Fc, '']])} = 0`;
    let tipo, completada, canonica, conica = null, porSignos;
    if (!fCero(A) && !fCero(C)) {
      porSignos = A.n * C.n > 0 ? (fIgual(A, C) ? 'circunferencia' : 'elipse') : 'hiperbola';
      const h = fDiv(fNeg(D), fMul(F(2), A)), k = fDiv(fNeg(E), fMul(F(2), C));
      const Rr = fRes(fSum(fMul(A, fMul(h, h)), fMul(C, fMul(k, k))), Fc);   // A(x − h)² + C(y − k)² = R
      const term = (c, v, z) => { const a = fAbs(c), co = a.n === 1 && a.d === 1 ? '' : fTexto(a); return co ? `${co}${cuadrado(v, z)}` : cuadrado(v, z); };
      // escribe con A positivo (multiplica por −1 si hace falta)
      let sA = A, sC = C, sR = Rr;
      if (A.n < 0) { sA = fNeg(A); sC = fNeg(C); sR = fNeg(Rr); }
      completada = `${term(sA, 'x', h)} ${sC.n < 0 ? MENOS : '+'} ${term(sC, 'y', k)} = ${fTexto(sR)}`;
      if (porSignos !== 'hiperbola') {
        const q = fDiv(Rr, A);
        if (q.n === 0) tipo = 'punto'; else if (q.n < 0) tipo = 'vacia';
        else if (porSignos === 'circunferencia') { tipo = 'circunferencia'; conica = circunferencia({ h, k, r2: q }); canonica = conica.ecuacion; }
        else { tipo = 'elipse'; conica = elipse({ h, k, nx: fDiv(Rr, A), ny: fDiv(Rr, C) }); canonica = conica.ecuacion; }
      } else if (Rr.n === 0) tipo = 'rectas';
      else {
        tipo = 'hiperbola';
        const nx = fDiv(Rr, A), ny = fDiv(Rr, C);   // uno positivo, otro negativo
        conica = nx.n > 0 ? hiperbola({ h, k, a2: nx, b2: fNeg(ny), eje: 'x' }) : hiperbola({ h, k, a2: ny, b2: fNeg(nx), eje: 'y' });
        canonica = conica.ecuacion;
      }
    } else {
      porSignos = 'parabola';
      // A x² + D x + E y + F = 0 → (x − h)² = −(E/A)(y − k)   (o con y)
      const conX = !fCero(A), Q = conX ? A : C, L = conX ? D : E, M = conX ? E : D;
      const h = fDiv(fNeg(L), fMul(F(2), Q));
      const resto = fRes(Fc, fMul(Q, fMul(h, h)));   // Q(v − h)² + M w + resto = 0
      const vT = conX ? 'x' : 'y';
      if (fCero(M)) {
        const q = fDiv(fNeg(resto), Q);
        tipo = q.n > 0 ? 'rectas' : (q.n === 0 ? 'rectas' : 'vacia');
        completada = `${cuadrado(vT, h)} = ${fTexto(q)}`;
      } else {
        tipo = 'parabola';
        const k = fDiv(fNeg(resto), M), cuatroP = fDiv(fNeg(M), Q);
        conica = conX ? parabola({ eje: 'y', h, k, cuatroP }) : parabola({ eje: 'x', h: k, k: h, cuatroP });
        completada = conica.ecuacion; canonica = conica.ecuacion;
      }
    }
    const nombre = NOMBRE[tipo];
    let errs = {};
    if (tipo === 'elipse' || tipo === 'hiperbola' || tipo === 'circunferencia') {
      errs = {
        cambiaSigno: tipo === 'hiperbola' ? er('CO19', null, NOMBRE.elipse) : er('CO19', null, NOMBRE.hiperbola),
        dosCuadrados: er('CO20', null, NOMBRE.circunferencia),
        lineales: er('CO28', null, NOMBRE.parabola)
      };
    }
    const q = pregunta({ valor: null, texto: nombre }, errs);
    return Object.assign(q, { tipo, nombre, porSignos, ecuacionGeneral, completada, canonica: canonica || null, conica });
  }

  // ---------- La cuerda del jardinero ----------
  function jardinero(o) {
    o = o || {};
    const a = fraccion(o.a, 'a'), c = fraccion(o.c || 0, 'c');
    if (!(a.n > 0) || c.n < 0 || fCmp(c, a) > 0) throw new Error('hace falta 0 ≤ c ≤ a');
    let figura, conica = null;
    if (c.n === 0) { figura = 'una circunferencia'; conica = circunferencia({ h: 0, k: 0, r2: fMul(a, a) }); }
    else if (fIgual(c, a)) figura = 'un segmento';
    else { figura = 'una elipse'; conica = elipse({ a, c }); }
    const errs = c.n === 0 ? { segmento: er('CO34', null, 'un segmento'), punto: er('CO35', null, 'un punto'), parabola: er('CO36', null, 'una parábola') } : {};
    return Object.assign(pregunta({ valor: null, texto: figura }, errs), { figura, conica, a: fNum(a), c: fNum(c) });
  }

  // ---------- Plato parabólico ----------
  function plato(o) {
    o = o || {};
    const w = fraccion(o.ancho, 'ancho'), d = fraccion(o.hondo, 'hondo');
    if (!(w.n > 0) || !(d.n > 0)) throw new Error('ancho y hondo deben ser positivos');
    const x = fDiv(w, F(2)), p = fDiv(fMul(x, x), fMul(F(4), d));
    const cm = f => `${fTexto(f)} cm`;
    const q = pregunta({ valor: fNum(p), texto: cm(p) }, {
      cuatroP: er('CO12', fNum(fMul(F(4), p)), cm(fMul(F(4), p))),
      dosP: er('CO30', fNum(fMul(F(2), p)), cm(fMul(F(2), p))),
      hondo: er('CO29', fNum(d), cm(d))
    });
    return Object.assign(q, { conica: parabola({ eje: 'y', h: 0, k: 0, p }), borde: [fNum(x), fNum(d)] });
  }

  // ---------- El cono y el plano ----------
  function cono(o) {
    o = o || {};
    const fi = Number(o.inclinacion), g = Number(o.generatriz);
    if (!Number.isFinite(fi) || fi < 0 || fi > 85) throw new Error('la inclinación va de 0° a 85°');
    if (!Number.isFinite(g) || g < 10 || g > 80) throw new Error('la generatriz va de 10° a 80°');
    const T = 1e-9;
    const tipo = fi < T ? 'circunferencia' : (Math.abs(fi - g) < T ? 'parabola' : (fi < g ? 'elipse' : 'hiperbola'));
    const e = Math.sin(fi * GR) / Math.sin(g * GR);
    // Vista de costado: vértice del cono en (0; 0), generatrices y = ±tan(g)·x; plano y = tan(fi)·x − 1.
    const t = Math.tan(g * GR), m = Math.tan(fi * GR), cortes = [];
    for (const s of [1, -1]) {
      const den = s * t - m;
      if (Math.abs(den) < 1e-12) continue;
      const x = -1 / den; cortes.push({ x, y: s * t * x });
    }
    const nombre = NOMBRE[tipo];
    const q = pregunta({ valor: null, texto: nombre }, {
      cerrada: er('CO31', null, NOMBRE.elipse), abierta: er('CO32', null, NOMBRE.hiperbola), rectas: er('CO33', null, NOMBRE.rectas)
    });
    return Object.assign(q, { tipo, nombre, e, cortes, conica: { tipo: 'polar', e, l: 1 } });
  }

  // ---------- Puntos, distancias y trazos (numéricos, para el dibujo) ----------
  const numDe = C => (C && C.num ? C.num : C);
  function puntoEn(Cc, t, rama) {
    const C = numDe(Cc);
    if (C.tipo === 'circunferencia') return { x: C.h + C.r * Math.cos(t), y: C.k + C.r * Math.sin(t) };
    if (C.tipo === 'elipse') {
      const u = C.a * Math.cos(t), v = C.b * Math.sin(t);
      return C.eje === 'x' ? { x: C.h + u, y: C.k + v } : { x: C.h + v, y: C.k + u };
    }
    if (C.tipo === 'parabola') {
      const u = C.p * t * t, v = 2 * C.p * t;
      return C.eje === 'x' ? { x: C.h + u, y: C.k + v } : { x: C.h + v, y: C.k + u };
    }
    if (C.tipo === 'hiperbola') {
      const s = rama === -1 ? -1 : 1, u = s * C.a * Math.cosh(t), v = C.b * Math.sinh(t);
      return C.eje === 'x' ? { x: C.h + u, y: C.k + v } : { x: C.h + v, y: C.k + u };
    }
    throw new Error('cónica desconocida');
  }
  function sobre(Cc, P) {
    const C = numDe(Cc);
    if (C.tipo === 'circunferencia') { const t = Math.atan2(P.y - C.k, P.x - C.h); return Object.assign(puntoEn(C, t), { t }); }
    const u = C.eje === 'x' ? P.x - C.h : P.y - C.k, v = C.eje === 'x' ? P.y - C.k : P.x - C.h;   // u a lo largo del eje
    if (C.tipo === 'elipse') { const t = Math.atan2(v / C.b, u / C.a); return Object.assign(puntoEn(C, t), { t }); }
    if (C.tipo === 'parabola') { const t = v / (2 * C.p); return Object.assign(puntoEn(C, t), { t }); }
    if (C.tipo === 'hiperbola') { const rama = u < 0 ? -1 : 1, t = Math.asinh(v / C.b); return Object.assign(puntoEn(C, t, rama), { t, rama }); }
    throw new Error('cónica desconocida');
  }
  function distancias(Cc, P) {
    const C = numDe(Cc), d = (q, r) => Math.hypot(q[0] - r.x, q[1] - r.y);
    if (C.tipo === 'circunferencia') return { r: Math.hypot(P.x - C.h, P.y - C.k) };
    if (C.tipo === 'parabola') {
      const pie = C.eje === 'x' ? { x: C.h - C.p, y: P.y } : { x: P.x, y: C.k - C.p };
      return { PF: d(C.F, P), PD: Math.hypot(P.x - pie.x, P.y - pie.y), pie, F: C.F };
    }
    const PF1 = d(C.focos[0], P), PF2 = d(C.focos[1], P);
    return { PF1, PF2, suma: PF1 + PF2, diferencia: Math.abs(PF1 - PF2), F1: C.focos[0], F2: C.focos[1] };
  }
  function trazar(Cc, caja) {
    const C = numDe(Cc), B = Object.assign({ x0: -10, x1: 10, y0: -10, y1: 10, n: 160 }, caja || {}), n = B.n;
    const dentro = q => q.x >= B.x0 - 1e-9 && q.x <= B.x1 + 1e-9 && q.y >= B.y0 - 1e-9 && q.y <= B.y1 + 1e-9;
    const cortar = pts => { const out = []; let cur = []; for (const q of pts) { if (dentro(q)) cur.push(q); else if (cur.length) { if (cur.length > 1) out.push(cur); cur = []; } } if (cur.length > 1) out.push(cur); return out; };
    if (C.tipo === 'circunferencia' || C.tipo === 'elipse') {
      const pts = []; for (let i = 0; i <= n; i++) pts.push(puntoEn(C, 2 * Math.PI * i / n));
      return cortar(pts);
    }
    const L = Math.max(B.x1 - B.x0, B.y1 - B.y0) + Math.abs(C.h || 0) + Math.abs(C.k || 0) + 2;
    if (C.tipo === 'parabola') {
      const T = Math.sqrt(L / Math.abs(C.p)) + 1, pts = [];
      for (let i = 0; i <= n; i++) pts.push(puntoEn(C, -T + 2 * T * i / n));
      return cortar(pts);
    }
    if (C.tipo === 'hiperbola') {
      const T = Math.asinh(L / Math.min(C.a, C.b)) + .2, out = [];
      for (const r of [1, -1]) { const pts = []; for (let i = 0; i <= n; i++) pts.push(puntoEn(C, -T + 2 * T * i / n, r)); out.push(...cortar(pts)); }
      return out;
    }
    if (C.tipo === 'polar') {   // r = l/(1 − e cos θ), foco en el origen
      const pts = [], out = [];
      for (let i = 0; i <= 4 * n; i++) {
        const th = 2 * Math.PI * i / (4 * n), den = 1 - C.e * Math.cos(th);
        if (Math.abs(den) < 1e-3) { if (pts.length) { out.push(...cortar(pts)); pts.length = 0; } continue; }
        const r = C.l / den;
        if (pts.length && Math.sign(r) !== Math.sign(pts[pts.length - 1].r)) { out.push(...cortar(pts)); pts.length = 0; }
        pts.push({ x: r * Math.cos(th), y: r * Math.sin(th), r });
      }
      out.push(...cortar(pts));
      return out.map(tr => tr.map(q => ({ x: q.x, y: q.y })));
    }
    throw new Error('cónica desconocida');
  }

  function texto(v) {
    if (v && typeof v === 'object' && 'r' in v) return rTexto(v);
    if (v && typeof v === 'object' && 'n' in v) return fTexto(v);
    return fTexto(fraccion(v));
  }

  return { circunferencia, circunferenciaGeneral, parabola, elipse, hiperbola, general, jardinero, plato, cono,
    puntoEn, sobre, distancias, trazar, texto, fraccion: x => fraccion(x), ERRORES };
});
