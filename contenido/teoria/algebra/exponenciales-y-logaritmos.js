/*
 * Teoría de «Exponenciales y logaritmos» (algebra.exponenciales-y-logaritmos). Molde: docs/teoria.md; forma de
 * Álgebra: logica-y-conjuntos.js. Fuente: docs/teoria/matriz/algebra.json (unidad 13), expediente teoria-152-unidades
 * («el logaritmo cuenta escalones es una metáfora inicial; admite valores no enteros y exige base positiva distinta de 1
 * y argumento positivo») e historia-ecuaciones (pp. 57–68). Errores: AL10, AL31, AL32, AL33 de
 * docs/investigacion/algebra-funciones-ideas-erroneas.md; EL5, EL6, EL9, EL14 de plantillas/exponenciales-logaritmos/;
 * TAL-* nuevos (hipótesis de diseño, rutinas/teoria-algebra.md).
 * Colores (regla 4): x exponente naranja (c-o), y salida turquesa (c-i), la recta y = c o el logaritmo rojo (c-h),
 * la base b verde (c-d). Intervalos: [a; b] cerrado, ⟨a; b⟩ abierto.
 * Ronda 2 (14 nov 2026): gesto directo en cuatro de las seis ideas (el punto (x; bˣ) y el punto (1; b) que elige la
 * base, el punto (b; 1) del logaritmo, la recta y = c y el punto de corte de la inecuación), llaves en las reglas y un
 * laboratorio de tres mesas (base continua con b = 1, carrera bˣ contra xᵏ, inecuación con base menor que 1).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · ver el crecimiento por factor constante y usar el logaritmo como el exponente que lo deshace.
 * Persona y condiciones · 5.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · predice bˣ, usa log(MN) = log M + log N sin repartir sumas, reconoce e, da el dominio de un log,
 *   resuelve una ecuación revisando argumentos y una inecuación con base menor que 1.
 * Orden de atención · 1.º la curva o la tabla · 2.º el punto o la fila que cambia · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué log(a + b) no es log a + log b y por qué (1/2)ˣ > 1/8 da x < 3.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const x = { v: 'c-o', t: 'x' }, y = { v: 'c-i', t: 'y' }, bb = { v: 'c-d', t: 'b' };
  const log = (base, arg) => [{ sub: ['log', base] }, arg];          // log_b(arg) como partes
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    return r;
  }
  function distintas(ops) {
    const vistos = new Set(), out = [];
    for (const o of ops) { const t = Kit.plano(o.texto); if (vistos.has(t) || /NaN|undefined|Infinity/.test(t)) continue; vistos.add(t); out.push(o); }
    return out;
  }
  function muestra(fn, x0, x1, y0, y1, n = 200) {
    const out = [];
    let dentro = false;
    for (let i = 0; i <= n; i++) {
      const xx = x0 + (x1 - x0) * i / n, yy = fn(xx);
      const ok = Number.isFinite(yy) && yy >= y0 - 1e-9 && yy <= y1 + 1e-9;
      if (ok) { out.push([Math.round(xx * 1000) / 1000, Math.round(yy * 1000) / 1000]); dentro = true; }
      else if (dentro) { out.push(null); dentro = false; }
    }
    return out;
  }
  const signo = v => (v < 0 ? `− ${f(-v)}` : `+ ${f(v)}`);
  const ejesBase = (xm, xM, ym, yM, extra = {}, pasoY = 1) => Object.assign({
    x: { min: xm, max: xM, paso: 1, cada: 1, nombre: 'x', color: 'o', decimales: 0 },
    y: { min: ym, max: yM, paso: pasoY, cada: 2, nombre: 'y', color: 'i', decimales: 0 },
  }, extra);
  const SUP = n => String(n).replace(/-/g, '⁻').replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
  const BASES = { '1/2': 0.5, '2': 2, '3': 3 };
  // Gesto directo (docs/teoria.md §4b): manijas en coordenadas de la pieza «ejes», con la inversa lineal de su escala.
  // Los juegos con arrastre usan ejes de rango fijo, para que la manija no se escape.
  const invLineal = (escala, p, q) => px => p + (px - escala(p)) * (q - p) / (escala(q) - escala(p));
  const EJES = () => Kit.piezas.ejes;
  const lienzoDe = datos => { const g = EJES().geometria(datos); return { X: g.X, Y: g.Y, aX: invLineal(g.X, datos.x.min, datos.x.max), aY: invLineal(g.Y, datos.y.min, datos.y.max) }; };
  const lienzo = (xm, xM, ym, yM) => lienzoDe(ejesBase(xm, xM, ym, yM));
  // Altura de una manija que solo mueve x: sobre la curva si se ve; si la curva sale del plano, sobre el eje x.
  const enPlano = (v, lo, hi) => (v >= lo && v <= hi ? v : 0);
  // La base de opciones más cercana a una altura (o a una abscisa): el punto (1; b) elige la base.
  const baseCercana = v => Object.keys(BASES).reduce((m, k) => (Math.abs(BASES[k] - v) < Math.abs(BASES[m] - v) ? k : m));

  // ---------- Idea 1: multiplicar por b en cada paso ----------
  // Cambia: la base b y la entrada x · Permanece: el corte (0; 1) · Progresa: el punto (x; bˣ) y los escalones ×b
  // · Se reserva: la carrera de 2ˣ contra x² · Debe verse: sumar 1 a x multiplica la salida por b.
  // Gesto: el punto (x; bˣ) a lo ancho y el punto (1; b) a lo alto, que elige la base.
  // Dos representaciones a propósito (hallazgo 9): el juego es la curva; predecir y «Mira» usan una tabla porque la
  // carrera llega a 2¹⁰ = 1024, que no cabe en un plano legible a 360 px junto con los primeros valores.
  const exponencial = {
    id: 'exponencial',
    titulo: 'Cada paso multiplica por b',
    temas: ['Función exponencial'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige la base b y la entrada x en y = bˣ. Sube x de uno en uno y mira cuánto cambia y cada vez.',
      voz: 'Creo que no suma lo mismo cada vez. Compruébalo.',
      controles: [
        { id: 'b', etiqueta: 'b', opciones: Object.keys(BASES).map(t => ({ valor: t, texto: t })), inicio: '2' },
        { id: 'x', etiqueta: 'x', color: 'c-o', min: -2, max: 3, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => {
        const B = BASES[v.b], g = u => B ** u;
        return { datos: ejesBase(-3, 3, -1, 9, {
          curvas: [{ puntos: muestra(g, -3, 3, -1, 9), color: 'i' }],
          puntos: [{ x: 0, y: 1, color: 'd' }, { x: 1, y: B, color: 'd', rotulo: `(1; ${v.b})` }, ...(g(v.x) <= 9 ? [{ x: v.x, y: g(v.x), color: 'o', rotulo: `(${f(v.x)}; ${f(g(v.x))})`, guias: true }] : [])],
          alt: `Gráfica de y = ${v.b} elevado a x, con el punto de x = ${f(v.x)}`,
        }), estado: {} };
      },
      lectura: v => { const B = BASES[v.b]; return [y, ` = ${v.b}`, { sup: ['', x] }, ` = ${f(B ** v.x)} · al sumar 1: × ${v.b}`]; },
      minimo: 4,
      // Dos manijas: el punto (x; bˣ) se arrastra a lo ancho (mueve x); el punto (1; b), a lo alto, elige la base.
      arrastres: [
        { id: 'entrada', etiqueta: 'punto de la entrada x', color: 'c-o',
          donde: v => { const g = lienzo(-3, 3, -1, 9); return { x: g.X(v.x), y: g.Y(enPlano(BASES[v.b] ** v.x, -1, 9)) }; },
          mover: pt => ({ x: lienzo(-3, 3, -1, 9).aX(pt.x) }) },
        { id: 'base', etiqueta: 'punto (1; b): la base', color: 'c-d',
          donde: v => { const g = lienzo(-3, 3, -1, 9); return { x: g.X(1), y: g.Y(BASES[v.b]) }; },
          mover: pt => ({ b: baseCercana(lienzo(-3, 3, -1, 9).aY(pt.y)) }) },
      ],
    },
    predice: {
      pregunta: ['En ', x, ' = 3, ', x, '² = 9 le gana a ', { sup: ['2', x] }, ' = 8. En ', x, ' = 10, ¿cuál vale más?'],
      opciones: [
        { id: 'c', texto: [{ sup: ['2', x] }, ', y por mucho'], correcta: true },
        { id: 'cuadrado', texto: [x, '², como en x = 3'], error: 'AL33', siFuera: 'x² gana al inicio, pero 2ˣ se duplica en cada paso y termina adelante.' },
        { id: 'iguales', texto: 'Valen casi lo mismo', error: 'TAL-EXP-LINEAL', siFuera: 'Serían parecidas si las dos sumaran de a poco; 2ˣ multiplica por 2 en cada paso.' },
      ],
      dibujo: { datos: { columnas: ['x', 'x²', '2ˣ'], colorCol: ['o', 'i', 'd'], filas: [['3', '9', '8'], ['10', { t: '?', fuerte: true }, { t: '?', fuerte: true }]], alt: 'Tabla de x² y 2 elevado a x para x = 3 y x = 10' }, estado: {} },
      pieza: 'alg-tabla',
      revelar: { datos: { columnas: ['x', 'x²', '2ˣ'], colorCol: ['o', 'i', 'd'], filas: [['3', '9', '8'], ['10', f(100), { t: f(2 ** 10), fuerte: true, color: 'd' }]], alt: 'En x = 10, x² vale 100 y 2 elevado a x vale 1024' }, estado: {} },
      coincide: `Coincide: 10² = 100, pero 2¹⁰ = ${f(2 ** 10)}.`,
    },
    mira: {
      pieza: 'alg-tabla',
      datos: {
        columnas: ['x', 'x²', '2ˣ', 'cambio de 2ˣ'], colorCol: ['o', 'i', 'd'],
        filas: [3, 4, 5, 6, 10].map((n, k) => [String(n), { t: f(n * n), desde: k + 1 }, { t: f(2 ** n), desde: k + 1, fuerte: n === 10, color: n === 10 ? 'd' : undefined }, { t: k === 0 ? '' : k < 4 ? '× 2' : '× 2 cuatro veces', desde: k + 1 }]),
        resaltes: [{ f: 4, c: 0, ancho: 4, color: 'd', desde: 5 }],
        alt: 'Tabla de x² y 2 elevado a x de x = 3 a x = 10',
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'En x = 3, x² va adelante: 9 contra 8.', ecuacion: ['9 > 8'] },
        { estado: { corte: 2 }, texto: 'En x = 4 empatan: 16 y 16.', ecuacion: ['4² = ', { sup: ['2', '4'] }, ' = 16'] },
        { estado: { corte: 4 }, texto: 'Desde ahí, 2ˣ se duplica en cada paso y x² se queda atrás.', ecuacion: ['32 > 25', '   ·   ', '64 > 36'] },
        { estado: { corte: 5 }, texto: `En x = 10: ${f(2 ** 10)} contra 100.`, ecuacion: [{ sup: ['2', '10'] }, ` = ${f(2 ** 10)}`] },
      ],
    },
    regla: {
      texto: 'En y = bˣ, cada vez que x sube 1, la salida se multiplica por b. Crece si b > 1 y decrece si 0 < b < 1, y siempre es positiva.',
      ecuacion: [{ sup: [bb, [x, ' + 1']] }, ' = ', { llave: [bb], nota: 'un factor más', color: 'c-d' }, ' · ', { sup: [bb, x] }],
      condicion: 'b > 0 y b ≠ 1. El crecimiento es por un factor constante, no por una cantidad constante.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), n = r.ent(3, 6), crece = s % 2 === 0, fac = crece ? r.uno([2, 3]) : 2;
        // Al reducirse a la mitad, la cantidad inicial es múltiplo de 2ⁿ: todo resultado sale entero.
        const C0 = crece ? r.uno([100, 200, 300, 500, 800]) : r.uno([3, 5, 25]) * 2 ** n;
        const bien = crece ? C0 * fac ** n : C0 / fac ** n;
        const pregunta = crece ? `Un cultivo de ${f(C0)} bacterias se ${fac === 2 ? 'duplica' : 'triplica'} cada hora. ¿Cuántas hay después de ${f(n)} horas?`
          : `En la sangre hay ${f(C0)} mg de un medicamento, y la cantidad se reduce a la mitad cada hora. ¿Cuántos mg quedan después de ${f(n)} horas?`;
        return {
          pregunta: [pregunta],
          opciones: distintas([
            { id: 'c', texto: f(bien), correcta: true },
            { id: 'lineal', texto: f(crece ? C0 * fac * n : C0 / (fac * n)), error: 'EL9', siFuera: `Eso ${crece ? 'multiplica' : 'divide'} por ${f(fac)} · ${f(n)}; el factor se aplica ${f(n)} veces seguidas.` },
            { id: 'suma', texto: f(crece ? C0 + C0 * (fac - 1) * n : Math.max(1, C0 - C0 / 2 * n)), error: 'TAL-EXP-LINEAL', siFuera: 'Eso suma la misma cantidad cada hora; el cambio es por un factor.' },
            { id: 'uno-menos', texto: f(crece ? C0 * fac ** (n - 1) : C0 / fac ** (n - 1)), error: 'TAL-EXP-CONTEO', siFuera: `Eso cuenta ${f(n - 1)} horas; son ${f(n)} multiplicaciones.` },
          ]),
          solucion: { texto: `Se ${crece ? 'multiplica' : 'divide'} por ${f(fac)} una vez por hora.`, ecuacion: [`${f(C0)} ${crece ? '·' : '÷'} `, { sup: [f(fac), f(n)] }, ` = ${f(bien)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: el logaritmo es un exponente ----------
  // Cambia: los exponentes m y n de M = 2ᵐ y N = 2ⁿ · Permanece: la base 2 · Progresa: la fila del producto · Se reserva:
  // el logaritmo de una suma · Debe verse: multiplicar potencias suma exponentes; sumar números no.
  // Sin arrastre: la tabla no tiene nada que agarrar (m y n son exponentes, no lugares de la figura).
  const logaritmo = {
    id: 'logaritmo',
    titulo: 'El logaritmo es un exponente',
    temas: ['Logaritmo y propiedades'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'Elige M = 2ᵐ y N = 2ⁿ. La tabla da cada número y su logaritmo en base 2: el exponente que lleva el 2.',
      voz: 'Mira la columna de la derecha cuando multiplicas.',
      controles: [
        { id: 'm', etiqueta: 'm', color: 'c-o', min: 0, max: 5, paso: 1, inicio: 3, decimales: 0 },
        { id: 'n', etiqueta: 'n', color: 'c-h', min: 0, max: 5, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => ({ datos: {
        columnas: ['número', 'como potencia', 'log₂'], colorCol: [null, 'd', 'h'],
        filas: [['M = ' + f(2 ** v.m), `2${SUP(v.m)}`, f(v.m)], ['N = ' + f(2 ** v.n), `2${SUP(v.n)}`, f(v.n)], [{ t: 'M · N = ' + f(2 ** (v.m + v.n)), fuerte: true }, `2${SUP(v.m + v.n)}`, { t: f(v.m + v.n), fuerte: true, color: 'h' }]],
        separador: { fila: 2 }, alt: `M = ${2 ** v.m}, N = ${2 ** v.n}, su producto ${2 ** (v.m + v.n)} y sus logaritmos en base 2`,
      }, estado: {} }),
      lectura: v => [...log('2', `(${f(2 ** v.m)} · ${f(2 ** v.n)}) = ${f(v.m)} + ${f(v.n)} = ${f(v.m + v.n)}`)],
      minimo: 3,
    },
    predice: {
      pregunta: ['Ya sabes que ', ...log('2', ' 8'), ' = 3. ¿Cuánto vale ', ...log('2', '(8 + 8)'), '?'],
      opciones: [
        { id: 'c', texto: '4', correcta: true },
        { id: 'reparte', texto: '6', error: 'AL10', siFuera: '6 = log₂ 8 + log₂ 8 sería cierto con 8 · 8 = 64. Aquí se suma: 8 + 8 = 16.' },
        { id: 'igual', texto: '3', error: 'TAL-LOG-IGUAL', siFuera: '3 es log₂ 8. Sumar otro 8 cambia el número: 16 pide otro exponente.' },
        { id: 'numero', texto: '16', error: 'EL1', siFuera: '16 es el número; el logaritmo es el exponente que da 16.' },
      ],
      dibujo: { datos: { columnas: ['número', 'como potencia', 'log₂'], colorCol: [null, 'd', 'h'], filas: [['8', '2³', '3'], [{ t: '8 + 8 = 16', fuerte: true }, '?', '?']], separador: { fila: 1 }, alt: '8 es 2 al cubo; 8 + 8 = 16, su logaritmo está por ver' }, estado: {} },
      revelar: { datos: { columnas: ['número', 'como potencia', 'log₂'], colorCol: [null, 'd', 'h'], filas: [['8', '2³', '3'], [{ t: '8 + 8 = 16', fuerte: true }, '2⁴', { t: '4', fuerte: true, color: 'h' }], ['8 · 8 = 64', '2⁶', '6']], separador: { fila: 1 }, alt: '8 + 8 = 16 es 2 a la 4; 8 por 8 = 64 es 2 a la 6' }, estado: {} },
      coincide: 'Coincide: 8 + 8 = 16 = 2⁴. El 6 sería del producto 8 · 8.',
    },
    mira: {
      datos: {
        columnas: ['número', 'como potencia', 'log₂'], colorCol: [null, 'd', 'h'],
        filas: [['8', '2³', '3'], [{ t: '8 · 8 = 64', desde: 1 }, { t: '2³ · 2³ = 2⁶', desde: 1 }, { t: '3 + 3 = 6', desde: 2, color: 'h' }], [{ t: '8 + 8 = 16', desde: 3 }, { t: '2⁴', desde: 3 }, { t: '4', desde: 4, color: 'h', fuerte: true }]],
        separador: { fila: 1 }, alt: 'El logaritmo del producto 64 es 3 + 3; el de la suma 16 es 4',
      },
      pasos: [
        { estado: { corte: 0 }, texto: 'log₂ 8 = 3 porque 2³ = 8: el logaritmo es un exponente.', ecuacion: [...log('2', ' 8'), ' = 3  ⇔  ', { sup: ['2', '3'] }, ' = 8'] },
        { estado: { corte: 2 }, texto: 'Multiplicar potencias de 2 suma exponentes: el log del producto es la suma.', ecuacion: [...log('2', '(8 · 8)'), ' = 3 + 3 = 6'] },
        { estado: { corte: 3 }, texto: 'Sumar los números es otra cosa: 8 + 8 = 16.', ecuacion: ['16 = ', { sup: ['2', '4'] }] },
        { estado: { corte: 4 }, texto: 'Así que log₂(8 + 8) = 4, no 6.', ecuacion: [...log('2', '(8 + 8)'), ' = 4  ≠  ', ...log('2', ' 8'), ' + ', ...log('2', ' 8')] },
      ],
    },
    regla: {
      texto: 'El logaritmo en base b de N es el exponente que lleva b para dar N. El de un producto es una suma de logaritmos; el de una suma, no.',
      // A 360 px no cabe en una línea: los espacios sin corte (U+00A0) hacen que se parta solo después del «=», nunca
      // dentro de la suma.
      ecuacion: [...log(bb, '(MN)'), ' = ', ...log(bb, '\u00A0M'), '\u00A0+\u00A0', ...log(bb, '\u00A0N')],
      condicion: 'b > 0, b ≠ 1 y M, N > 0. El log de M/N resta; el de Mᵏ es k · log M.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), B = r.uno([2, 3, 5]), p = r.ent(1, 4), q = r.ent(1, 3), k = r.ent(2, 3), tipo = s % 4, q2 = r.ent(2, 3);
        const P = B ** p, Q = B ** q;
        if (tipo === 0) {
          return {
            pregunta: ['¿Cuánto vale ', ...log(String(B), ` ${f(P)} + `), ...log(String(B), ` ${f(Q)}`), '?'],
            opciones: distintas([
              { id: 'c', texto: f(p + q), correcta: true },
              { id: 'prod', texto: f(p * q), error: 'AL31', siFuera: 'Eso multiplica los logaritmos; se suman los exponentes.' },
              { id: 'num', texto: f(P + Q), error: 'EL1', siFuera: 'Eso suma los números; el logaritmo da exponentes.' },
              { id: 'uno', texto: f(p), error: 'EL2', siFuera: `Ese es solo el log de ${f(P)}; falta el de ${f(Q)}.` },
            ]),
            solucion: { texto: `${f(P)} = ${B}${SUP(p)} y ${f(Q)} = ${B}${SUP(q)}.`, ecuacion: [`${f(p)} + ${f(q)} = ${f(p + q)}`] },
          };
        }
        if (tipo === 1) {
          return {
            pregunta: ['¿Cuánto vale ', ...log(String(B), `(${f(P * Q)} ÷ ${f(Q)})`), '?'],
            opciones: distintas([
              { id: 'c', texto: f(p), correcta: true },
              { id: 'cociente', texto: f((p + q) / q), error: 'AL31', siFuera: 'Eso divide los logaritmos; el log de un cociente es una resta.' },
              { id: 'suma', texto: f(p + 2 * q), error: 'TAL-LOG-SIGNO', siFuera: 'Eso suma el log del divisor; dividir resta.' },
              { id: 'num', texto: f(P), error: 'EL1', siFuera: `${f(P)} es el número; se pide su exponente.` },
            ]),
            solucion: { texto: `${f(P * Q)} ÷ ${f(Q)} = ${f(P)} = ${B}${SUP(p)}.`, ecuacion: [`${f(p + q)} − ${f(q)} = ${f(p)}`] },
          };
        }
        if (tipo === 2) {
          return {
            pregunta: ['¿Cuánto vale ', ...log(String(B), `(${f(B ** q2)}${SUP(k)})`), '?'],
            opciones: distintas([
              { id: 'c', texto: f(k * q2), correcta: true },
              { id: 'pot', texto: f(q2 ** k), error: 'AL31', siFuera: `Eso eleva el logaritmo a ${k}; el exponente sale multiplicando.` },
              { id: 'suma', texto: f(k + q2), error: 'EL7', siFuera: 'Eso suma el exponente; potencia de potencia multiplica.' },
              { id: 'sin-k', texto: f(q2), error: 'TAL-LOG-IGUAL', siFuera: `Ese es log de ${f(B ** q2)}; falta el exponente ${k}.` },
              { id: 'num', texto: f(B ** (k * q2)), error: 'EL1', siFuera: 'Ese es el número; el logaritmo es su exponente.' },
            ]),
            solucion: { texto: `${f(B ** q2)} = ${B}${SUP(q2)}, así que ${f(B ** q2)}${SUP(k)} = ${B}${SUP(k * q2)}.`, ecuacion: [`${k} · ${f(q2)} = ${f(k * q2)}`] },
          };
        }
        // Logaritmo de una suma: se calcula la suma primero.
        const a = r.ent(1, 3), S = B ** (a + 1), parte = B ** a, otra = S - parte;
        return {
          pregunta: ['¿Cuánto vale ', ...log(String(B), `(${f(parte)} + ${f(otra)})`), '?'],
          opciones: distintas([
            { id: 'c', texto: f(a + 1), correcta: true },
            { id: 'reparte', texto: f(a + Math.log(otra) / Math.log(B), 2), error: 'AL10', siFuera: 'Eso reparte el logaritmo en la suma; primero se suma dentro.' },
            { id: 'num', texto: f(S), error: 'EL1', siFuera: `${f(S)} es el número; se pide el exponente.` },
            { id: 'uno', texto: f(a), error: 'EL2', siFuera: `Ese es el log de ${f(parte)} solo; falta sumar ${f(otra)} adentro.` },
          ]),
          solucion: { texto: `Adentro: ${f(parte)} + ${f(otra)} = ${f(S)} = ${B}${SUP(a + 1)}.`, ecuacion: [...log(String(B), ` ${f(S)}`), ` = ${f(a + 1)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: el número e ----------
  // Cambia: cuántas veces al año se capitaliza · Permanece: el 100 % anual · Progresa: el factor (1 + 1/n)ⁿ · Se
  // reserva: lo que pasa con n enorme · Debe verse: el factor crece cada vez menos y se acerca a 2,718…
  // Sin arrastre: n es una elección entre cinco frecuencias de capitalización; la tabla no tiene qué agarrar.
  const N_OPC = [1, 2, 4, 12, 365];
  const factor = n => (1 + 1 / n) ** n;
  const NOMBRE = { 1: 'anual', 2: 'semestral', 4: 'trimestral', 12: 'mensual', 365: 'diaria' };
  const numeroE = {
    id: 'numero-e',
    titulo: 'El número e aparece solo',
    temas: ['El número e'],
    pieza: 'alg-tabla',
    juega: {
      consigna: 'S/ 1 gana 100 % al año en n partes: cada parte suma 1/n de lo que hay. Elige n y mira el total.',
      voz: 'Creo que repartir más ayuda. ¿Cuánto más?',
      controles: [{ id: 'n', etiqueta: 'n', opciones: N_OPC.map(n => ({ valor: n, texto: `${n} (${NOMBRE[n]})` })) }],
      dibujo: v => ({ datos: {
        columnas: ['n', 'al final (S/)'], colorCol: ['o', 'i'],
        filas: N_OPC.filter(n => n <= v.n).map(n => [f(n), { t: f(factor(n), 4), fuerte: n === v.n, color: n === v.n ? 'i' : undefined }]),
        alt: `Con n = ${v.n}, S/ 1 se vuelve S/ ${f(factor(v.n), 4)}`,
      }, estado: {} }),
      lectura: v => ['(1 + 1/', String(v.n), `)${SUP(v.n)} = ${f(factor(v.n), 4)}`],
      minimo: 4,
    },
    predice: {
      pregunta: ['Si n crece sin parar (cada hora, cada segundo…), ¿qué pasa con (1 + 1/n)ⁿ?'],
      opciones: [
        { id: 'c', texto: 'Se acerca a 2,718…', correcta: true },
        { id: 'infinito', texto: 'Crece sin límite', error: 'TAL-E-INFINITO', siFuera: 'Sube, pero cada vez menos: de n = 365 a n = 1 000 000 gana menos de 0,01.' },
        { id: 'uno', texto: 'Se acerca a 1, porque 1/n se achica', error: 'TAL-E-UNO', siFuera: 'Sería así si el exponente no creciera; aquí se multiplica n veces.' },
        { id: 'dos', texto: 'Se queda en 2', error: 'TAL-E-DOS', siFuera: '2 es el caso anual, n = 1. Repartir siempre da algo más.' },
      ],
      dibujo: { datos: { columnas: ['n', 'al final (S/)'], colorCol: ['o', 'i'], filas: [['365', f(factor(365), 4)], ['1 000 000', '?']], alt: 'Con n = 365 da 2,7146; con un millón, por ver' }, estado: {} },
      revelar: { datos: { columnas: ['n', 'al final (S/)'], colorCol: ['o', 'i'], filas: [['365', f(factor(365), 4)], ['1 000 000', { t: f(factor(1e6), 4), fuerte: true, color: 'i' }], ['e', { t: f(Math.E, 5), fuerte: true }]], alt: 'Con un millón da 2,7183, casi e' }, estado: {} },
      coincide: `Coincide: con un millón de partes da ${f(factor(1e6), 4)}, casi e = ${f(Math.E, 5)}.`,
    },
    mira: {
      datos: {
        columnas: ['n', '(1 + 1/n)ⁿ', 'gana'], colorCol: ['o', 'i'],
        filas: [1, 10, 100, 1000, 1e6].map((n, k, l) => [f(n), { t: f(factor(n), 5), desde: k + 1 }, { t: k ? '+' + f(factor(n) - factor(l[k - 1]), 4) : '', desde: k + 1 }]),
        alt: 'Tabla de (1 + 1/n) a la n para n = 1, 10, 100, 1000 y un millón: se acerca a 2,71828',
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Con n = 1, el 100 % se suma una vez: S/ 2.', ecuacion: ['(1 + 1)¹ = 2'] },
        { estado: { corte: 3 }, texto: `Con n = 10 y n = 100 sube: ${f(factor(10), 3)} y ${f(factor(100), 3)}.`, ecuacion: ['(1 + 1/100)', { sup: ['', '100'] }, ` = ${f(factor(100), 5)}`] },
        { estado: { corte: 5 }, texto: 'Cada vez gana menos: el factor se estabiliza.', ecuacion: [`${f(factor(1e6), 5)}`] },
        { estado: { corte: 5 }, texto: 'Ese límite se llama e. Su logaritmo natural se escribe ln.', ecuacion: ['e ≈ 2,71828', '   ·   ', 'ln e = 1'] },
      ],
    },
    regla: {
      texto: 'Con 100 % de interés en n partes, el capital se multiplica por (1 + 1/n)ⁿ. Al crecer n, ese factor se acerca a e ≈ 2,71828: no crece sin límite.',
      ecuacion: ['e = lím ', { llave: ['(1 + ', { frac: ['1', 'n'] }, ')', { sup: ['', 'n'] }], nota: 'factor del año', color: 'c-i' }, '   ·   ', 'e ≈ 2,71828'],
      condicion: 'n crece sin límite. ln es el logaritmo de base e y cumple las mismas propiedades que los demás logaritmos.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), p = r.ent(2, 7), q = r.ent(1, 4), tipo = s % 3;
        if (tipo === 0) {
          return {
            pregunta: [`¿Cuánto vale ln(e${SUP(p)}) + ln(e${SUP(q)})?`],
            opciones: distintas([
              { id: 'c', texto: f(p + q), correcta: true },
              { id: 'prod', texto: f(p * q), error: 'AL31', siFuera: 'Eso multiplica; cada ln devuelve su exponente y se suman.' },
              { id: 'e', texto: `e${SUP(p + q)}`, error: 'EL1', siFuera: 'Ese es el número; ln da el exponente.' },
              { id: 'uno', texto: f(p), error: 'EL2', siFuera: `ln(e${SUP(p)}) = ${p}; falta el otro sumando.` },
            ]),
            solucion: { texto: 'ln deshace a e: devuelve el exponente.', ecuacion: [`${p} + ${q} = ${f(p + q)}`] },
          };
        }
        if (tipo === 1) {
          return {
            pregunta: ['¿Cuánto vale ', { sup: ['e', `ln ${p}`] }, '?'],
            opciones: distintas([
              { id: 'c', texto: f(p), correcta: true },
              { id: 'ln', texto: f(Math.log(p), 3), error: 'TAL-E-INVERSA', siFuera: `Ese es ln ${p}; e elevado a eso lo deshace.` },
              { id: 'e', texto: `${f(p)}e`, error: 'TAL-E-INVERSA', siFuera: 'e y ln no se multiplican: una deshace a la otra.' },
              { id: 'uno', texto: '1', error: 'EL13', siFuera: 'ln e = 1, pero aquí el ln es de otro número.' },
            ]),
            solucion: { texto: 'eˣ y ln x son inversas: una deshace a la otra.', ecuacion: [{ sup: ['e', `ln ${p}`] }, ` = ${f(p)}`] },
          };
        }
        const n = r.uno([2, 4, 12]), C = r.uno([100, 1000, 2000]);
        const bien = C * factor(n);
        return {
          pregunta: [`S/ ${f(C)} ganan 100 % al año, capitalizado ${NOMBRE[n]}. ¿Cuánto hay al final del año, redondeado al sol?`],
          opciones: distintas([
            { id: 'c', texto: `S/ ${f(Math.round(bien), 0)}`, correcta: true },
            { id: 'simple', texto: `S/ ${f(2 * C, 0)}`, error: 'TAL-E-DOS', siFuera: 'Eso suma el 100 % una sola vez; aquí se capitaliza varias veces.' },
            { id: 'e', texto: `S/ ${f(Math.round(C * Math.E), 0)}`, error: 'TAL-E-INFINITO', siFuera: `Eso sería con partes infinitas; aquí son ${n}.` },
            { id: 'menos', texto: `S/ ${f(Math.round(C * factor(n) / (1 + 1 / n)), 0)}`, error: 'TAL-EXP-CONTEO', siFuera: `Eso capitaliza ${n - 1} veces; en el año son ${n}.` },
          ]),
          solucion: { texto: `Se multiplica ${n} veces por (1 + 1/${n}).`, ecuacion: [`${f(C)} · (1 + 1/${n})${SUP(n)} ≈ ${f(Math.round(bien), 0)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: la función logarítmica ----------
  // Cambia: la base · Permanece: la recta y = x · Progresa: bˣ y su reflejo log_b x · Se reserva: el borde del dominio
  // de log₂(x − 3) · Debe verse: log solo acepta argumentos positivos; en el borde hay una asíntota, no un punto.
  // Gesto: el punto (b; 1) del logaritmo se arrastra a lo ancho y elige la base.
  const logaritmica = {
    id: 'logaritmica',
    titulo: 'El logaritmo pide positivos',
    temas: ['Función logarítmica'],
    pieza: 'ejes',
    juega: {
      consigna: 'Elige la base. La curva verde es y = bˣ; la roja, su reflejo en y = x: el logaritmo en base b. ¿Dónde existe cada una?',
      voz: 'Fíjate qué x nunca alcanza la curva roja.',
      controles: [{ id: 'b', etiqueta: 'b', opciones: Object.keys(BASES).map(t => ({ valor: t, texto: t })), inicio: '2' }],
      dibujo: v => {
        const B = BASES[v.b];
        return { datos: ejesBase(-3, 6, -3, 6, {
          curvas: [{ puntos: [[-3, -3], [6, 6]], color: 'o', discontinua: true }, { puntos: muestra(u => B ** u, -3, 6, -3, 6), color: 'd' }, { puntos: muestra(u => (u > 0 ? Math.log(u) / Math.log(B) : NaN), 0.01, 6, -3, 6, 300), color: 'h' }],
          puntos: [{ x: 1, y: 0, color: 'h', rotulo: '(1; 0)' }, { x: 0, y: 1, color: 'd' }, { x: B, y: 1, color: 'h', rotulo: `(${v.b}; 1)` }, { x: 1, y: B, color: 'd' }],
          alt: `y = ${v.b} elevado a x y su reflejo, el logaritmo de base ${v.b}`,
        }), estado: {} };
      },
      lectura: v => [...log(v.b, ' x'), ': solo x > 0 · vale 0 en x = 1'],
      minimo: 3,
      // Arrastra el punto (b; 1) del logaritmo a lo ancho: elige la base, y su reflejo (1; b) sube o baja en bˣ.
      arrastres: [{ id: 'base', etiqueta: 'punto (b; 1) del logaritmo', color: 'c-d',
        donde: v => { const g = lienzo(-3, 6, -3, 6); return { x: g.X(BASES[v.b]), y: g.Y(1) }; },
        mover: pt => ({ b: baseCercana(lienzo(-3, 6, -3, 6).aX(pt.x)) }) }],
    },
    predice: {
      pregunta: ['¿Cuál es el dominio de ', y, ' = ', ...log('2', '('), x, ' − 3)?'],
      opciones: [
        { id: 'c', texto: '⟨3; +∞⟩', correcta: true },
        { id: 'cerrado', texto: '[3; +∞⟩', error: 'TAL-LOG-CERO', siFuera: 'Con x = 3 queda log₂ 0, que no existe: 2ˣ nunca da 0.' },
        { id: 'izq', texto: '⟨−3; +∞⟩', error: 'AL28', siFuera: 'Eso sería con x + 3. Aquí el argumento x − 3 debe ser positivo.' },
        { id: 'todo', texto: 'ℝ', error: 'TAL-LOG-DOM', siFuera: 'Sería cierto para 2ˣ. El logaritmo solo acepta argumentos positivos.' },
      ],
      dibujo: { datos: ejesBase(-1, 10, -3, 4), estado: {} },
      revelar: { datos: ejesBase(-1, 10, -3, 4, {
        curvas: [{ puntos: [[3, -3], [3, 4]], color: 'h', discontinua: true }, { puntos: muestra(u => (u > 3 ? Math.log2(u - 3) : NaN), 3.01, 10, -3, 4, 400), color: 'i' }],
        puntos: [{ x: 4, y: 0, color: 'i', rotulo: '(4; 0)' }, { x: 7, y: 2, color: 'i', rotulo: '(7; 2)' }],
      }), estado: {} },
      coincide: 'Coincide: x − 3 > 0 pide x > 3, y el 3 no entra.',
    },
    mira: {
      datos: ejesBase(-1, 10, -3, 4, {
        curvas: [{ puntos: [[3, -3], [3, 4]], color: 'h', discontinua: true, desde: 3 }, { puntos: muestra(u => (u > 3 ? Math.log2(u - 3) : NaN), 3.01, 10, -3, 4, 400), color: 'i', desde: 2 }],
        puntos: [{ x: 4, y: 0, color: 'i', rotulo: '(4; 0)', desde: 1 }, { x: 5, y: 1, color: 'i', desde: 1 }, { x: 7, y: 2, color: 'i', rotulo: '(7; 2)', desde: 1 }],
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Con x = 4, 5 y 7 el argumento vale 1, 2 y 4.', ecuacion: [...log('2', ' 1'), ' = 0', '   ·   ', ...log('2', ' 2'), ' = 1', '   ·   ', ...log('2', ' 4'), ' = 2'] },
        { estado: { corte: 2 }, texto: 'Cerca de x = 3, el argumento tiende a 0: la curva baja sin fin.', ecuacion: [x, ' → 3  ⇒  ', y, ' → −∞'] },
        { estado: { corte: 3 }, texto: 'x = 3 es una asíntota: la curva nunca la toca.', ecuacion: [x, ' − 3 > 0  ⇒  ', x, ' > 3'] },
      ],
    },
    regla: {
      texto: 'El logaritmo en base b es la inversa de bˣ: su gráfica es su reflejo en y = x. Solo acepta x > 0 y vale 0 en x = 1.',
      ecuacion: [y, ' = ', ...log(bb, ' '), { llave: [x], nota: 'positivo', color: 'c-o' }, '  ⇔  ', { sup: [bb, y] }, ' = ', x],
      condicion: 'b > 0 y b ≠ 1. El argumento es siempre positivo, aunque el resultado pueda ser negativo o no entero.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), a = r.ent(-4, 5) || 2, B = r.uno([2, 3, 10]), tipo = s % 3;
        if (tipo < 2) {
          const dentroMenos = tipo === 1;        // log(a − x): pide x < a
          const bien = dentroMenos ? `⟨−∞; ${f(a)}⟩` : `⟨${f(a)}; +∞⟩`;
          const arg = dentroMenos ? `(${f(a)} − x)` : `(x ${signo(-a)})`;
          return {
            pregunta: ['¿Cuál es el dominio de ', y, ' = ', ...log(String(B), arg), '?'],
            opciones: distintas([
              { id: 'c', texto: bien, correcta: true },
              { id: 'cerrado', texto: dentroMenos ? `⟨−∞; ${f(a)}]` : `[${f(a)}; +∞⟩`, error: 'TAL-LOG-CERO', siFuera: `En x = ${f(a)} el argumento vale 0, y log 0 no existe.` },
              { id: 'vuelta', texto: dentroMenos ? `⟨${f(a)}; +∞⟩` : `⟨−∞; ${f(a)}⟩`, error: 'TAL-LOG-SENTIDO', siFuera: `Con esas x el argumento ${arg} es negativo.` },
              { id: 'signo', texto: dentroMenos ? `⟨−∞; ${f(-a)}⟩` : `⟨${f(-a)}; +∞⟩`, error: 'AL28', siFuera: `El argumento se anula en x = ${f(a)}, no en ${f(-a)}.` },
            ]),
            solucion: { texto: 'El argumento debe ser positivo.', ecuacion: [arg, ' > 0  ⇒  ', x, dentroMenos ? ` < ${f(a)}` : ` > ${f(a)}`] },
          };
        }
        const k = r.ent(-2, 4), N = B ** k;
        return {
          pregunta: ['¿Cuánto vale ', ...log(String(B), ` ${k < 0 ? `(1/${f(B ** -k)})` : f(N)}`), '?'],
          opciones: distintas([
            { id: 'c', texto: f(k), correcta: true },
            { id: 'num', texto: k < 0 ? `1/${f(B ** -k)}` : f(N), error: 'EL1', siFuera: 'Ese es el número; el logaritmo es su exponente.' },
            { id: 'abs', texto: f(Math.abs(k) + (k >= 0 ? 1 : 0)), error: 'TAL-LOG-NEG', siFuera: k < 0 ? 'Una fracción menor que 1 tiene logaritmo negativo.' : `Eso cuenta un escalón de más: ${B}${SUP(k)} = ${f(N)}.` },
            { id: 'div', texto: f(N / B), error: 'TAL-LOG-DIV', siFuera: 'Eso divide entre la base una vez; se cuenta cuántas veces.' },
          ]),
          solucion: { texto: `${B} elevado a ${f(k)} da ${k < 0 ? `1/${f(B ** -k)}` : f(N)}.`, ecuacion: [{ sup: [String(B), f(k)] }, ` = ${k < 0 ? `1/${f(B ** -k)}` : f(N)}`] },
        };
      },
    },
  };

  // ---------- Idea 5: resolver y revisar el argumento ----------
  // Cambia: la altura c en 2ˣ = c · Permanece: la curva y = 2ˣ · Progresa: el corte y su x = log₂ c · Se reserva: la
  // raíz que el dominio descarta · Debe verse: toda solución se prueba en los argumentos originales.
  // Gesto: la recta y = c se arrastra a lo alto. Dos representaciones a propósito (hallazgo 9): el juego resuelve
  // 2ˣ = c en la gráfica; predecir y «Mira» revisan candidatos en una tabla, porque descartar es una lista de pruebas.
  const ecuaciones = {
    id: 'ecuaciones',
    titulo: 'Resolver y revisar el argumento',
    temas: ['Ecuaciones exponenciales y logarítmicas'],
    pieza: 'ejes',
    juega: {
      consigna: 'Sube o baja la recta y = c. Su corte con y = 2ˣ resuelve la ecuación 2ˣ = c. Mira qué x sale, entera o no.',
      voz: 'Creo que no siempre sale un entero. Compruébalo.',
      controles: [{ id: 'c', etiqueta: 'c', color: 'c-h', min: 1, max: 12, paso: 1, inicio: 4, decimales: 0 }],
      dibujo: v => {
        const sol = Math.log2(v.c);
        return { datos: ejesBase(-2, 4, -1, 13, {
          curvas: [{ puntos: muestra(u => 2 ** u, -2, 4, -1, 13), color: 'i' }, { puntos: [[-2, v.c], [4, v.c]], color: 'h', discontinua: true }],
          puntos: [{ x: sol, y: v.c, color: 'o', rotulo: `x = ${f(sol)}`, guias: true }],
        }, 1), estado: {} };
      },
      lectura: v => [{ sup: ['2', x] }, ` = ${f(v.c)}  ⇒  `, x, ' = ', ...log('2', ` ${f(v.c)}`), ` ≈ ${f(Math.log2(v.c))}`],
      minimo: 4,
      // Arrastra la recta y = c desde su extremo izquierdo: a lo alto mueve c, y el corte se mueve solo.
      arrastres: [{ id: 'recta', etiqueta: 'recta horizontal y = c', color: 'c-h',
        donde: v => { const g = lienzo(-2, 4, -1, 13); return { x: g.X(-1.5), y: g.Y(v.c) }; },
        mover: pt => ({ c: lienzo(-2, 4, -1, 13).aY(pt.y) }) }],
    },
    predice: {
      pregunta: ['¿Qué valores de ', x, ' cumplen ', ...log('2', '('), x, ' − 1) + ', ...log('2', '('), x, ' + 1) = 3?'],
      opciones: [
        { id: 'c', texto: 'Solo x = 3', correcta: true },
        { id: 'dos', texto: 'x = 3 y x = −3', error: 'EL5', siFuera: 'x² − 1 = 8 da ±3, pero con −3 queda log₂(−4), que no existe.' },
        { id: 'suma', texto: 'x = 4', error: 'AL10', siFuera: 'x = 4 saldría de juntar (x − 1) + (x + 1). La suma de logs es el log del producto.' },
        { id: 'neg', texto: 'Solo x = −3', error: 'TAL-LOG-DOM', siFuera: 'Con x = −3 los argumentos son −4 y −2: negativos.' },
      ],
      dibujo: { datos: { columnas: ['candidato', 'x − 1', 'x + 1', '¿sirve?'], filas: [['3', '?', '?', '?'], ['−3', '?', '?', '?']], alt: 'Candidatos 3 y −3 por revisar' }, estado: {} },
      pieza: 'alg-tabla',
      revelar: { datos: { columnas: ['candidato', 'x − 1', 'x + 1', '¿sirve?'], filas: [['3', '2', '4', { t: 'sí', color: 'd', fuerte: true }], ['−3', { t: '−4', color: 'h' }, { t: '−2', color: 'h' }, { t: 'no', color: 'h', fuerte: true }]], alt: 'Con 3 los argumentos son 2 y 4; con −3 son negativos' }, estado: {} },
      coincide: 'Coincide: −3 sale de la cuenta, pero vuelve negativos los argumentos.',
    },
    mira: {
      pieza: 'alg-tabla',
      datos: {
        columnas: ['paso', 'ecuación'],
        filas: [
          ['1', { t: 'log₂[(x − 1)(x + 1)] = 3', desde: 1 }],
          ['2', { t: '(x − 1)(x + 1) = 2³ = 8', desde: 2 }],
          ['3', { t: 'x² = 9  ⇒  x = 3 o x = −3', desde: 3 }],
          ['4', { t: 'x = −3: log₂(−4) ✗', desde: 4, color: 'h' }],
          ['5', { t: 'x = 3: log₂ 2 + log₂ 4 = 3 ✓', desde: 5, color: 'd', fuerte: true }],
        ],
        alt: 'Pasos: producto, potencia de 2, x = ±3, se descarta −3',
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'La suma de logaritmos es el log del producto.', ecuacion: [...log('2', '[('), x, ' − 1)(', x, ' + 1)] = 3'] },
        { estado: { corte: 2 }, texto: 'Si el log₂ vale 3, el argumento es 2³.', ecuacion: [x, '² − 1 = 8'] },
        { estado: { corte: 3 }, texto: 'Salen dos candidatos.', ecuacion: [x, ' = 3   o   ', x, ' = −3'] },
        { estado: { corte: 5 }, texto: 'Se prueban en la ecuación original: solo 3 da argumentos positivos.', ecuacion: ['S = {3}'] },
      ],
    },
    regla: {
      texto: 'Con bases iguales se igualan los exponentes; si no, se aplica logaritmo. Toda solución se revisa en la ecuación original: sus argumentos deben ser positivos.',
      ecuacion: [...log(bb, ' '), { llave: ['u'], nota: 'positivo', color: 'c-o' }, ' = k  ⇒  u = ', { sup: [bb, 'k'] }],
      condicion: 'b > 0 y b ≠ 1. Juntar logaritmos puede agregar candidatos que la ecuación original no acepta.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {
          // (b²)^(x + p) = b^(x + q)  ⇒  2x + 2p = x + q  ⇒  x = q − 2p
          const [b0, b2] = r.uno([[2, 4], [3, 9], [2, 8]]), e = b2 === 8 ? 3 : 2, p = r.ent(-2, 2), q = r.ent(-1, 5) || 3;
          const bien = (q - e * p) / (e - 1);
          const arg1 = p ? `x ${signo(p)}` : 'x', arg2 = q ? `x ${signo(q)}` : 'x', par = a => (a === 'x' ? 'x' : `(${a})`);
          return {
            pregunta: [`Resuelve ${b2}`, { sup: ['', par(arg1)] }, ` = ${b0}`, { sup: ['', par(arg2)] }, '.'],
            opciones: distintas([
              { id: 'c', texto: `x = ${f(bien)}`, correcta: true },
              { id: 'sin-base', texto: 'No tiene solución', error: 'AL32', siFuera: `Igualar ${arg1} con ${arg2} solo vale con bases iguales; ${b2} = ${b0}${SUP(e)}.` },
              { id: 'sin-mult', texto: `x = ${f(q - p)}`, error: 'AL32', siFuera: `Eso iguala exponentes sin pasar ${b2} a base ${b0}; falta multiplicar por ${e}.` },
              { id: 'mitad', texto: `x = ${f((q - p) / e)}`, error: 'TAL-EXP-REPARTE', siFuera: `El ${e} multiplica todo el exponente ${arg1}, no solo a x.` },
            ]),
            solucion: { texto: `${b2} = ${b0}${SUP(e)}: se igualan exponentes con la misma base.`, ecuacion: [`${e}${par(arg1) === 'x' ? 'x' : par(arg1)} = ${arg2}  ⇒  x = ${f(bien)}`] },
          };
        }
        const B = r.uno([2, 3, 5]), k = r.ent(1, 3), p = r.ent(-4, 4);
        const bien = B ** k - p;
        const arg = p ? `(x ${signo(p)})` : 'x';
        return {
          pregunta: ['Resuelve ', ...log(String(B), arg), ` = ${k}.`],
          opciones: distintas([
            { id: 'c', texto: `x = ${f(bien)}`, correcta: true },
            { id: 'mult', texto: `x = ${f(B * k - p)}`, error: 'EL14', siFuera: `Eso multiplica ${B} · ${k}; el argumento es ${B} elevado a ${k}.` },
            { id: 'sin-base', texto: `x = ${f(k - p)}`, error: 'EL1', siFuera: `Eso iguala el argumento a ${k}; el ${k} es el exponente.` },
            { id: 'signo', texto: `x = ${f(B ** k + p)}`, error: 'TAL-SIGNO-PASO', siFuera: `Para despejar x se hace lo contrario de ${signo(p)}.` },
          ]),
          solucion: { texto: `El argumento es ${B} elevado a ${k}, y ${f(bien)} lo deja positivo.`, ecuacion: [`${arg} = ${B}${SUP(k)} = ${f(B ** k)}  ⇒  x = ${f(bien)}`] },
        };
      },
    },
  };

  // ---------- Idea 6: con base menor que 1, el orden se invierte ----------
  // Cambia: la base (mayor que 1) y el umbral · Permanece: la recta y = bᶜ · Progresa: el tramo de x que cumple ·
  // Se reserva: la base 1/2 (va al laboratorio) · Debe verse: si la curva baja, «mayor salida» queda a la izquierda.
  // Gesto: el punto de corte (c; bᶜ) se arrastra por la curva.
  // El tramo de x que cumple se dibuja justo debajo del eje (no encima, para no confundirse con él).
  const tramoX = (desde, hasta, yy = -0.6) => ({ puntos: [[desde, yy], [hasta, yy]], color: 'd' });
  const inecuaciones = {
    id: 'inecuaciones',
    titulo: 'Base menor que 1 invierte',
    temas: ['Inecuaciones exponenciales y logarítmicas'],
    pieza: 'ejes',
    juega: {
      consigna: 'Busca las x con bˣ > bᶜ: donde la curva queda sobre la recta. El tramo verde bajo el eje las marca. Cambia b y c.',
      voz: 'Mira de qué lado del corte queda el tramo verde.',
      controles: [
        { id: 'b', etiqueta: 'b', opciones: [{ valor: 2, texto: '2' }, { valor: 3, texto: '3' }] },
        { id: 'c', etiqueta: 'c', color: 'c-o', min: -1, max: 2, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => ({ datos: ejesBase(-3, 3, -1, 10, {
        curvas: [{ puntos: muestra(u => v.b ** u, -3, 3, -1, 10), color: 'i' }, { puntos: [[-3, v.b ** v.c], [3, v.b ** v.c]], color: 'h', discontinua: true }, tramoX(v.c, 3)],
        puntos: [{ x: v.c, y: v.b ** v.c, color: 'o', guias: true }, { x: v.c, y: -0.6, color: 'd', abierto: true, rotulo: `x > ${f(v.c)}` }],
        alt: `${v.b} elevado a x es mayor que ${v.b} elevado a ${v.c} para x mayor que ${v.c}`,
      }), estado: {} }),
      lectura: v => [{ sup: [String(v.b), x] }, ' > ', { sup: [String(v.b), String(v.c)] }, '  ⇔  ', x, ` > ${f(v.c)}`],
      minimo: 3,
      // Arrastra el punto de corte por la curva: a lo ancho mueve c, y el tramo verde lo sigue.
      arrastres: [{ id: 'corte', etiqueta: 'punto de corte (c; bᶜ)', color: 'c-o',
        donde: v => { const g = lienzo(-3, 3, -1, 10); return { x: g.X(v.c), y: g.Y(v.b ** v.c) }; },
        mover: pt => ({ c: lienzo(-3, 3, -1, 10).aX(pt.x) }) }],
    },
    predice: {
      pregunta: ['¿Qué valores de ', x, ' cumplen (1/2)', { sup: ['', x] }, ' > 4?'],
      opciones: [
        { id: 'c', texto: 'x < −2', correcta: true },
        { id: 'igual', texto: 'x > −2', error: 'EL6', siFuera: 'x > −2 sería cierto con base 2. Con base 1/2, la curva baja: el orden se invierte.' },
        { id: 'signo', texto: 'x > 2', error: 'EL25', siFuera: '(1/2)² = 1/4, no 4. Para dar 4, el exponente es −2.' },
        { id: 'neg', texto: 'x < 2', error: 'EL25', siFuera: 'El borde es −2: (1/2)⁻² = 2² = 4.' },
      ],
      dibujo: { datos: ejesBase(-4, 3, -1, 9, { curvas: [{ puntos: [[-4, 4], [3, 4]], color: 'h', discontinua: true, rotulo: 'y = 4' }] }), estado: {} },
      revelar: { datos: ejesBase(-4, 3, -1, 9, {
        curvas: [{ puntos: muestra(u => 0.5 ** u, -4, 3, -1, 9), color: 'i' }, { puntos: [[-4, 4], [3, 4]], color: 'h', discontinua: true }, tramoX(-4, -2)],
        puntos: [{ x: -2, y: 4, color: 'o', guias: true }, { x: -2, y: -0.6, color: 'd', abierto: true, rotulo: 'x < −2' }],
      }), estado: {} },
      coincide: 'Coincide: la curva baja, así que queda sobre 4 a la izquierda de −2.',
    },
    mira: {
      datos: ejesBase(-4, 3, -1, 9, {
        curvas: [{ puntos: muestra(u => 0.5 ** u, -4, 3, -1, 9), color: 'i', desde: 2 }, { puntos: [[-4, 4], [3, 4]], color: 'h', discontinua: true }, Object.assign(tramoX(-4, -2), { desde: 3 })],
        puntos: [{ x: -2, y: 4, color: 'o', rotulo: '(−2; 4)', guias: true, desde: 1 }, { x: -2, y: -0.6, color: 'd', abierto: true, desde: 3 }],
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Se escribe 4 con la misma base: (1/2)⁻² = 2² = 4.', ecuacion: ['(1/2)', { sup: ['', x] }, ' > (1/2)', { sup: ['', '−2'] }] },
        { estado: { corte: 2 }, texto: 'Con base 1/2, la curva baja: más x da menos y.', ecuacion: ['0 < 1/2 < 1  ⇒  decreciente'] },
        { estado: { corte: 3 }, texto: 'Por eso la salida es mayor a la izquierda del corte.', ecuacion: [x, ' < −2'] },
      ],
    },
    regla: {
      texto: 'Con base mayor que 1, bᵘ < bᵛ equivale a u < v. Con base entre 0 y 1 el orden se invierte. En logaritmos, además, el argumento debe ser positivo.',
      ecuacion: [{ llave: ['0 < ', bb, ' < 1'], nota: 'la curva baja', color: 'c-d' }, '   ·   ', { sup: [bb, 'u'] }, ' > ', { sup: [bb, 'v'] }, '  ⇔  ', { llave: ['u < v'], nota: 'se invierte' }],
      condicion: 'b > 0 y b ≠ 1. En una inecuación con logaritmo se pide además que el argumento sea positivo.',
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo < 2) {
          const menor = tipo === 1, B = menor ? r.uno([2, 3]) : r.uno([2, 3]), k = r.ent(1, 4), mayorQue = r.uno([true, false]);
          const base = menor ? `(1/${B})` : String(B), val = menor ? `1/${f(B ** k)}` : f(B ** k);
          const borde = k, sentido = mayorQue !== menor ? '>' : '<';
          return {
            pregunta: ['¿Qué valores de ', x, ` cumplen ${base}`, { sup: ['', x] }, ` ${mayorQue ? '>' : '<'} ${val}?`],
            opciones: distintas([
              { id: 'c', texto: `x ${sentido} ${f(borde)}`, correcta: true },
              { id: 'orden', texto: `x ${sentido === '>' ? '<' : '>'} ${f(borde)}`, error: menor ? 'EL6' : 'TAL-ORDEN-EXP', siFuera: menor ? 'Con base menor que 1 el orden se invierte.' : 'Con base mayor que 1 el orden se conserva.' },
              { id: 'num', texto: `x ${sentido} ${f(B ** k)}`, error: 'EL1', siFuera: `${f(B ** k)} es el número; el borde es su exponente, ${f(k)}.` },
              { id: 'neg', texto: `x ${sentido} ${f(-borde)}`, error: 'EL25', siFuera: `${val} = ${base}${SUP(k)}: el exponente es ${f(k)}.` },
            ]),
            solucion: { texto: `${val} = ${base}${SUP(k)}; con base ${menor ? 'menor' : 'mayor'} que 1 el orden ${menor ? 'se invierte' : 'se conserva'}.`, ecuacion: [x, ` ${sentido} ${f(borde)}`] },
          };
        }
        const B = r.uno([2, 3]), k = r.ent(1, 3), top = B ** k;
        return {
          pregunta: ['¿Qué valores de ', x, ' cumplen ', ...log(String(B), ' '), x, ` < ${k}?`],
          opciones: distintas([
            { id: 'c', texto: `0 < x < ${f(top)}`, correcta: true },
            { id: 'sin-dom', texto: `x < ${f(top)}`, error: 'TAL-LOG-DOM', siFuera: 'El logaritmo pide x > 0: los negativos y el 0 no entran.' },
            { id: 'k', texto: `0 < x < ${f(k)}`, error: 'EL1', siFuera: `${k} es el exponente; el borde es ${B}${SUP(k)} = ${f(top)}.` },
            { id: 'orden', texto: `x > ${f(top)}`, error: 'TAL-ORDEN-EXP', siFuera: 'Con base mayor que 1, el log crece: menor log, menor x.' },
          ]),
          solucion: { texto: [...log(String(B), ''), ' crece y solo acepta x > 0.'], ecuacion: ['0 < ', x, ` < ${B}${SUP(k)} = ${f(top)}`] },
        };
      },
    },
  };

  // ---------- Laboratorio: juego libre, sin preguntas ----------
  // Mesa 1: la base continua, de 0,2 a 4, con su reflejo. Deja probar b = 1, el caso raro: recta horizontal sin logaritmo.
  const mesaBase = {
    id: 'base-libre', titulo: 'La base que se arrastra', pieza: 'ejes',
    consigna: 'Arrastra el punto (1; b) para cambiar la base y el punto naranja para cambiar x. Prueba b = 1 y bases menores que 1.',
    controles: [
      { id: 'b', etiqueta: 'b', color: 'c-d', min: 0.2, max: 4, paso: 0.1, inicio: 1.5, decimales: 1 },
      { id: 'x', etiqueta: 'x', color: 'c-o', min: -3, max: 3, paso: 0.5, inicio: 2, decimales: 1 },
    ],
    dibujo: v => {
      const B = v.b, uno = Math.abs(B - 1) < 1e-9, yx = B ** v.x;
      return { datos: ejesBase(-3, 8, -3, 8, {
        curvas: [
          { puntos: [[-3, -3], [8, 8]], color: 'o', discontinua: true },
          { puntos: muestra(u => B ** u, -3, 8, -3, 8), color: 'd' },
          uno ? { puntos: [[1, -3], [1, 8]], color: 'h', discontinua: true } : { puntos: muestra(u => (u > 0 ? Math.log(u) / Math.log(B) : NaN), 0.01, 8, -3, 8, 300), color: 'h' },
        ],
        puntos: [{ x: 0, y: 1, color: 'd' }, { x: 1, y: B, color: 'd' }, ...(yx <= 8 ? [{ x: v.x, y: yx, color: 'o', guias: true }] : [])],
        alt: `y = ${f(B, 1)} elevado a x y su reflejo en y = x`,
      }, 1), estado: {} };
    },
    lectura: v => {
      const B = v.b, uno = Math.abs(B - 1) < 1e-9;
      return [{ sup: [f(B, 1), f(v.x, 1)] }, ` = ${f(B ** v.x)} · ${uno ? 'b = 1: no hay logaritmo' : B > 1 ? 'crece' : 'decrece'}`];
    },
    arrastres: [
      { id: 'base', etiqueta: 'punto (1; b): la base', color: 'c-d',
        donde: v => { const g = lienzo(-3, 8, -3, 8); return { x: g.X(1), y: g.Y(v.b) }; },
        mover: pt => ({ b: lienzo(-3, 8, -3, 8).aY(pt.y) }) },
      { id: 'entrada', etiqueta: 'punto de la entrada x', color: 'c-o',
        donde: v => { const g = lienzo(-3, 8, -3, 8); return { x: g.X(v.x), y: g.Y(enPlano(v.b ** v.x, -3, 8)) }; },
        mover: pt => ({ x: lienzo(-3, 8, -3, 8).aX(pt.x) }) },
    ],
  };
  // Mesa 2: la carrera entre bˣ y xᵏ (la idea 1 solo la pregunta con 2ˣ y x²).
  const EJE_CARRERA = { x: { min: 0, max: 8, paso: 1, nombre: 'x', color: 'o', decimales: 0 }, y: { min: 0, max: 100, paso: 20, nombre: 'y', color: 'i', decimales: 0 } };
  const mesaCarrera = {
    id: 'carrera', titulo: 'Carrera: potencia contra exponencial', pieza: 'ejes',
    consigna: 'Elige la base de bˣ y el exponente de xᵏ. Arrastra x y mira quién va adelante. ¿Cuántas veces se cruzan?',
    controles: [
      { id: 'b', etiqueta: 'b', opciones: [{ valor: 1.5, texto: '1,5' }, { valor: 2, texto: '2' }, { valor: 3, texto: '3' }], inicio: 2 },
      { id: 'k', etiqueta: 'k', opciones: [{ valor: 2, texto: '2' }, { valor: 3, texto: '3' }] },
      { id: 'x', etiqueta: 'x', color: 'c-o', min: 0, max: 8, paso: 0.5, inicio: 3, decimales: 1 },
    ],
    dibujo: v => {
      const E = u => v.b ** u, P = u => u ** v.k;
      return { datos: Object.assign({}, EJE_CARRERA, {
        curvas: [{ puntos: muestra(E, 0, 8, 0, 100), color: 'd', rotulo: `${f(v.b, 1)}ˣ` }, { puntos: muestra(P, 0, 8, 0, 100), color: 'i', rotulo: `x${SUP(v.k)}` }],
        puntos: [...(E(v.x) <= 100 ? [{ x: v.x, y: E(v.x), color: 'd' }] : []), ...(P(v.x) <= 100 ? [{ x: v.x, y: P(v.x), color: 'i' }] : [])],
        alt: `${f(v.b, 1)} elevado a x contra x elevado a ${v.k}; en x = ${f(v.x, 1)} van ${f(E(v.x))} y ${f(P(v.x))}`,
      }), estado: {} };
    },
    lectura: v => {
      const E = v.b ** v.x, P = v.x ** v.k;
      return [`En x = ${f(v.x, 1)}: ${f(v.b, 1)}ˣ = ${f(E, 1)}, x${SUP(v.k)} = ${f(P, 1)}${Math.abs(E - P) < 1e-9 ? ', empatan' : ''}`];
    },
    arrastres: [{ id: 'entrada', etiqueta: 'entrada x', color: 'c-o',
      donde: v => { const g = lienzoDe(EJE_CARRERA); return { x: g.X(v.x), y: g.Y(enPlano(Math.min(v.b ** v.x, v.x ** v.k), 0, 100)) }; },
      mover: pt => ({ x: lienzoDe(EJE_CARRERA).aX(pt.x) }) }],
  };
  // Mesa 3: la inecuación con cualquier base, también menor que 1 (la que la idea 6 reserva para predecir).
  const BASES_INEC = { '1/3': 1 / 3, '1/2': 0.5, '2': 2, '3': 3 };
  const mesaInecuacion = {
    id: 'inecuacion', titulo: 'Desigualdad con cualquier base', pieza: 'ejes',
    consigna: 'Elige la base, el sentido y arrastra el corte. El tramo verde marca las x que cumplen. ¿Cuándo queda a la izquierda?',
    controles: [
      { id: 'b', etiqueta: 'b', opciones: Object.keys(BASES_INEC).map(t => ({ valor: t, texto: t })), inicio: '1/2' },
      { id: 'sentido', etiqueta: 'Pide', opciones: [{ valor: '>', texto: 'mayor' }, { valor: '<', texto: 'menor' }] },
      { id: 'c', etiqueta: 'c', color: 'c-o', min: -2, max: 2, paso: 1, inicio: 1, decimales: 0 },
    ],
    dibujo: v => {
      const B = BASES_INEC[v.b], h = B ** v.c, derecha = (B > 1) === (v.sentido === '>');
      return { datos: ejesBase(-3, 3, -1, 10, {
        curvas: [{ puntos: muestra(u => B ** u, -3, 3, -1, 10), color: 'i' }, { puntos: [[-3, h], [3, h]], color: 'h', discontinua: true }, derecha ? tramoX(v.c, 3) : tramoX(-3, v.c)],
        puntos: [{ x: v.c, y: h, color: 'o', guias: true }, { x: v.c, y: -0.6, color: 'd', abierto: true }],
        alt: `${v.b} elevado a x ${v.sentido} ${v.b} elevado a ${v.c}: x ${derecha ? '>' : '<'} ${v.c}`,
      }), estado: {} };
    },
    lectura: v => {
      const B = BASES_INEC[v.b], derecha = (B > 1) === (v.sentido === '>');
      return [`(${v.b})`, { sup: ['', x] }, ` ${v.sentido} (${v.b})`, { sup: ['', f(v.c)] }, '  ⇔  ', x, ` ${derecha ? '>' : '<'} ${f(v.c)}`];
    },
    arrastres: [{ id: 'corte', etiqueta: 'punto de corte', color: 'c-o',
      donde: v => { const g = lienzo(-3, 3, -1, 10); return { x: g.X(v.c), y: g.Y(BASES_INEC[v.b] ** v.c) }; },
      mover: pt => ({ c: lienzo(-3, 3, -1, 10).aX(pt.x) }) }],
  };

  return {
    unidad: 'algebra.exponenciales-y-logaritmos',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/ejes.js', '/nucleo/kit/piezas/alg-tabla.js'],
    // Laboratorio: tres mesas propias con gesto directo, más amplias que los juegos (base continua, carrera, base < 1).
    laboratorio: [mesaBase, mesaCarrera, mesaInecuacion],
    historia: {
      texto: 'En 1614, John Napier publicó sus logaritmos para aliviar multiplicaciones, divisiones y raíces largas, donde un error era fácil. Su escala no es la escolar de hoy; las conversaciones con Briggs llevaron a formas más cómodas para calcular. La idea que perdura es convertir productos en sumas. La definición moderna, como inversa de la exponencial, llegó después y trae sus condiciones.',
      pregunta: '¿Cómo convertirías una multiplicación larga en una suma?',
      fuente: { titulo: 'O’Connor y Robertson, John Napier — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Napier/' },
    },
    ideas: [exponencial, logaritmo, numeroE, logaritmica, ecuaciones, inecuaciones],
  };
});
