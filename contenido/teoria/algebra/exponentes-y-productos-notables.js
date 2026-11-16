/*
 * Teoría de «Exponentes, radicales y productos notables» (algebra.exponentes-y-productos-notables). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/algebra.json (unidad 3), expediente teoria-152-unidades (Álgebra y sus
 * precisiones: la figura de áreas ilustra lados positivos; la identidad vale por distributividad) e
 * historia-ecuaciones (pp. 57–68). Errores: AL8, AL9 y AL11 de docs/investigacion/algebra-funciones-ideas-erroneas.md;
 * los TAL-* son hipótesis de diseño (rutinas/teoria-algebra.md).
 * Colores (regla 4): a y el exponente m naranja (c-o), b y el exponente n turquesa (c-i), lo que se suma o resulta
 * verde (c-d), lo que falta o el contraejemplo rojo (c-h).
 *
 * Ficha de tarea (diseno-y-animacion):
 * Promesa · transformar potencias y radicales sin perder sus condiciones, y reconocer los productos notables.
 * Persona y condiciones · 3.º de secundaria, celular de gama baja a 360 px, sin audio, en el aula o en casa.
 * Resultado observable · simplifica aᵐ·aⁿ, √(x²), (a + b)², √(A ± 2√B) y racionaliza un denominador.
 * Orden de atención · 1.º la figura (tabla, cuadrado de piezas, gráfica) · 2.º la pieza o fila que cambia · acción: «Comprobar» · fondo: Nox.
 * Estados · juego sin tocar · casos probados · predicción elegida · revelado · paso a paso · caso nuevo · «No sé».
 * Duda que resuelve · por qué (a + b)² no es a² + b² y √(a + b) no es √a + √b.
 *
 * Ronda 2 (14 nov 2026): gesto directo en «El cuadrado de una suma» (las esquinas de a² y del cuadrado, con la escala
 * fija de alg-baldosas), llaves en las reglas y en «Mira», separador «   ·   » y laboratorio de tres mesas: el
 * rectángulo (x + p)(x + q) con dos esquinas, índice par contra impar con el punto que se arrastra hasta los negativos y
 * la tabla de exponentes con signo. Las ideas 1, 2, 4 y 5 juegan con tablas: no hay figura que agarrar (sus filas se
 * reacomodan con el valor) y se quedan con − y +.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const a = { v: 'c-o', t: 'a' }, b = { v: 'c-i', t: 'b' }, m = { v: 'c-o', t: 'm' }, n = { v: 'c-i', t: 'n' };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.uno = l => l[Math.floor(r() * l.length)];
    return r;
  }
  // Opciones distintas por su texto: la correcta primero; un distractor que repite un texto se descarta.
  function distintas(ops, max = 4) {
    const vistos = new Set(), out = [];
    for (const o of ops) { if (!o) continue; const t = JSON.stringify(o.texto); if (vistos.has(t) || /NaN|undefined/.test(t)) continue; vistos.add(t); out.push(o); }
    return out.slice(0, max);
  }
  // Exponente entero en superíndice Unicode: 2 → «²», −3 → «⁻³».
  const SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
  const sup = e => String(e).split('').map(c => SUP[c] || c).join('');
  const pot = (base, e) => `${base}${sup(e)}`;
  const mcd = (x, y) => { x = Math.abs(x); y = Math.abs(y); while (y) [x, y] = [y, x % y]; return x; };
  // Valor exacto de bᵉ como texto: entero o fracción 1/bᵏ.
  const valorPot = (base, e) => (e >= 0 ? f(base ** e, 0) : `1/${f(base ** -e, 0)}`);
  // √k escrito sin raíz si k es un cuadrado perfecto.
  const esCuad = k => Number.isInteger(Math.sqrt(k));
  const rz = k => (esCuad(k) ? String(Math.sqrt(k)) : `√${k}`);

  const BALD = () => Kit.piezas['alg-baldosas'], EJES = () => Kit.piezas.ejes;
  const inversa = (escala, p, q) => px => p + (px - escala(p)) * (q - p) / (escala(q) - escala(p));

  // ---------- Idea 1: los exponentes cuentan factores ----------
  // Cambia: la base y los dos exponentes · Permanece: la tabla «expresión, factores, valor» · Progresa: los
  // factores que se juntan · Se reserva: el exponente negativo, que no cuenta factores sino divisiones
  // · Debe verse: juntar m factores con n factores da m + n factores.
  const factores = (base, e) => (e === 0 ? 'ninguno' : Array(e).fill(base).join('·'));
  const leyes = {
    id: 'leyes-exponentes',
    titulo: 'El exponente cuenta factores',
    temas: ['Leyes de exponentes'],
    pieza: 'alg-tabla',
    // Lee (fase 2): contexto y vocabulario; no toca los exponentes negativos, que son la pregunta de «Predice».
    lee: {
      tarjetas: [
        { titulo: 'Cajas en un almacén', texto: 'En un almacén de Juliaca, las cajas se apilan en 2 filas, 2 columnas y 2 pisos. Son 2 · 2 · 2 = 8 cajas. Para no repetir tanto, se escribe 2³ y se lee «2 al cubo».',
          ecuacion: ['2 · 2 · 2 = ', { sup: ['2', '3'] }, ' = 8'] },
        { titulo: 'Base y exponente', texto: ['En la potencia ', { sup: [a, m] }, ', la base ', a, ' es el número que se repite. El exponente ', m, ' dice cuántas veces aparece como factor, es decir, cuántas veces se multiplica.'],
          ecuacion: [{ sup: [a, m] }, ' = ', { llave: [a, ' · ', a, ' · … · ', a], nota: 'm factores', color: 'c-o' }] },
        { titulo: 'Qué mirar al jugar', texto: 'La tabla escribe cada potencia como factores sueltos. Junta las dos primeras filas, cuenta los factores de la última y compara ese número con m y n.' },
      ],
    },
    juega: {
      consigna: 'Elige la base y dos exponentes. La tabla escribe cada potencia como factores y junta los dos productos.',
      voz: 'Cuenta los factores de la última fila.',
      controles: [
        { id: 'a', etiqueta: 'Base', min: 2, max: 5, paso: 1, inicio: 2, decimales: 0 },
        { id: 'm', etiqueta: 'm', min: 0, max: 4, paso: 1, inicio: 3, decimales: 0, color: 'c-o' },
        { id: 'n', etiqueta: 'n', min: 0, max: 4, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({
        datos: {
          columnas: ['potencia', 'factores', 'valor'],
          filas: [
            [{ t: pot(v.a, v.m), color: 'o', fuerte: true }, factores(v.a, v.m), f(v.a ** v.m, 0)],
            [{ t: pot(v.a, v.n), color: 'i', fuerte: true }, factores(v.a, v.n), f(v.a ** v.n, 0)],
            [{ t: `${pot(v.a, v.m)} · ${pot(v.a, v.n)}`, fuerte: true }, factores(v.a, v.m + v.n), f(v.a ** (v.m + v.n), 0)],
            [{ t: pot(v.a, v.m + v.n), color: 'd', fuerte: true }, `${v.m} + ${v.n} factores`, { t: f(v.a ** (v.m + v.n), 0), color: 'd', fuerte: true }],
          ],
          alt: `${v.a} elevado a ${v.m} por ${v.a} elevado a ${v.n} junta ${v.m + v.n} factores`,
        }, estado: {},
      }),
      lectura: v => [`${pot(v.a, v.m)} · ${pot(v.a, v.n)} = ${pot(v.a, v.m + v.n)} = ${f(v.a ** (v.m + v.n), 0)}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['Si aᵐ · aⁿ = aᵐ⁺ⁿ debe valer también con exponentes negativos, ¿cuánto vale 2⁻³?'],
      opciones: [
        { id: 'c', texto: [{ frac: ['1', '8'] }], correcta: true },
        { id: 'negativo', texto: '−8', error: 'TAL-EXP-NEG', siFuera: '−8 es −(2³). El exponente negativo no cambia el signo: indica dividir.' },
        { id: 'por', texto: '−6', error: 'TAL-EXP-POR', siFuera: '−6 es 2 · (−3). Una potencia no multiplica la base por el exponente.' },
        { id: 'sexto', texto: [{ frac: ['1', '6'] }], error: 'TAL-EXP-POR', siFuera: '1/6 divide entre 2 · 3. Hay que dividir entre 2 · 2 · 2.' },
      ],
      dibujo: { datos: { columnas: ['potencia', 'valor'], filas: [['2³', '8'], ['2²', '4'], ['2¹', '2'], ['2⁰', { t: '1', desde: 1 }], ['2⁻¹', { t: '1/2', desde: 1 }], ['2⁻³', { t: '?', fuerte: true }]], alt: 'Potencias de 2 desde el cubo hacia abajo' }, estado: {} },
      revelar: { datos: { columnas: ['potencia', 'valor'], filas: [['2³', '8'], ['2²', '4'], ['2¹', '2'], ['2⁰', '1'], ['2⁻¹', '1/2'], [{ t: '2⁻³', color: 'd', fuerte: true }, { t: '1/8', color: 'd', fuerte: true }]], alt: 'Cada vez que el exponente baja 1, el valor se divide entre 2: 2 elevado a −3 es 1/8' }, estado: {} },
      coincide: 'Coincide: 2³ · 2⁻³ = 2⁰ = 1, así que 2⁻³ es 1/8.',
    },
    mira: {
      datos: {
        columnas: ['potencia', 'valor', ''],
        filas: [3, 2, 1, 0, -1, -2, -3].map((e, k) => [{ t: pot(2, e), fuerte: e < 0 }, { t: valorPot(2, e), color: e < 0 ? 'd' : null, desde: e > 0 ? 1 : e === 0 ? 2 : 3 }, { t: k ? '÷ 2' : '', desde: e > 0 ? 1 : e === 0 ? 2 : 3 }]),
        alt: 'Potencias de 2 del 3 al −3: cada fila es la anterior dividida entre 2',
      },
      voz: 'Creo que el patrón decide. Bajemos de a un exponente.',
      pasos: [
        { estado: { corte: 1 }, texto: 'Bajar el exponente en 1 quita un factor 2: se divide entre 2.', ecuacion: ['8 → 4 → 2'] },
        { estado: { corte: 2 }, texto: 'Un paso más: 2 ÷ 2 = 1. Por eso a⁰ = 1.', ecuacion: ['2⁰ = 1'] },
        { estado: { corte: 3 }, texto: 'Si se sigue dividiendo, aparecen fracciones, no negativos.', ecuacion: ['2⁻³ = ', { frac: ['1', '2³'] }, ' = ', { frac: ['1', '8'] }] },
        { estado: { corte: 3 }, texto: 'Con la ley de la suma: 2³ · 2⁻³ = 2⁰ = 1.', ecuacion: ['2³ · 2⁻³ = ', { llave: ['2³⁺⁽⁻³⁾'], nota: 'se suman', color: 'c-d' }, ' = 1'] },
      ],
    },
    regla: {
      texto: 'Al multiplicar potencias de igual base se suman los exponentes; al elevar una potencia, se multiplican. Un exponente negativo indica dividir.',
      ecuacion: [{ sup: [a, m] }, ' · ', { sup: [a, n] }, ' = ', { llave: [{ sup: [a, [m, ' + ', n]] }], nota: 'se suman', color: 'c-d' }, '   ·   ',
        { sup: [{ par: [{ sup: [a, m] }] }, n] }, ' = ', { llave: [{ sup: [a, [m, n]] }], nota: 'se multiplican', color: 'c-d' }, '   ·   ',
        { sup: [a, ['−', n]] }, ' = ', { llave: [{ frac: ['1', { sup: [a, n] }] }], nota: 'indica dividir', color: 'c-d' }],
      condicion: 'a ≠ 0 cuando el exponente es cero o negativo; 0⁰ y 0⁻¹ no se definen. Las leyes piden la misma base.',
      voz: 'Misma base, exponentes que se suman. Revisemos la base primero.',
    },
    // Así se resuelve (fase 2): los tres tipos de «Ahora tú», con las mismas cuentas y otras semillas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), B = r.uno([2, 3, 5, 10]);
        const p = r.uno([-2, -1, 1, 2, 3, 4, 5]), q = r.uno([-3, -2, -1, 2, 3, 4]), w = r.ent(1, 4), tipo = s % 3;
        const g = e => f(e, 0), par = e => (e < 0 ? `(${g(e)})` : g(e));
        let expr, bien, cuenta, datos, regla, sentido;
        if (tipo === 0) {
          expr = `${pot(B, p)} · ${pot(B, q)} ÷ ${pot(B, w)}`; bien = p + q - w; cuenta = `${g(p)} + ${par(q)} − ${w}`;
          datos = `Hay un producto de dos potencias de ${B} y una división entre ${pot(B, w)}.`;
          regla = 'Con la misma base, al multiplicar se suman los exponentes y al dividir se resta el exponente del divisor.';
          sentido = `Lo reviso al revés: ${pot(B, bien)} · ${pot(B, w)} = ${pot(B, bien + w)}, que es justo ${pot(B, p)} · ${pot(B, q)}. Cuadra.`;
        } else if (tipo === 1) {
          expr = `(${pot(B, p)})${sup(w)} · ${pot(B, q)}`; bien = p * w + q; cuenta = `${g(p)} · ${w} + ${par(q)}`;
          datos = `Una potencia de ${B} está elevada a ${w}, y después se multiplica por ${pot(B, q)}.`;
          regla = 'Elevar una potencia multiplica los exponentes. Después, multiplicar por otra potencia de la misma base suma los exponentes.';
          sentido = `(${pot(B, p)})${sup(w)} multiplica ${w} ${w === 1 ? 'vez' : 'veces'} ${pot(B, p)}: el exponente ${g(p)}, sumado ${w} ${w === 1 ? 'vez' : 'veces'}, da ${g(p * w)}. Con ${par(q)} más, queda ${g(bien)}.`;
        } else {
          expr = `${pot(B, p)} · ${pot(B, q)} · ${pot(B, -w)}`; bien = p + q - w; cuenta = `${g(p)} + ${par(q)} + (−${w})`;
          datos = `Son tres potencias de ${B} multiplicadas; la última tiene exponente negativo, −${w}.`;
          regla = 'Con la misma base, en un producto se suman los exponentes, cada uno con su signo.';
          sentido = `Lo reviso al revés: ${pot(B, bien)} · ${pot(B, w)} = ${pot(B, p + q)}, igual que ${pot(B, p)} · ${pot(B, q)}. ${pot(B, -w)} y ${pot(B, w)} se anulan.`;
        }
        return {
          enunciado: `Escribe ${expr} como una sola potencia de ${B}.`,
          pasos: [
            { tipo: 'pide', texto: `Piden una sola potencia de ${B}: hay que hallar su exponente.` },
            { tipo: 'datos', texto: datos },
            { tipo: 'regla', texto: regla },
            { tipo: 'cuentas', texto: 'Junto todos los exponentes en una sola cuenta, sin perder ningún signo.', ecuacion: [`${cuenta} = ${g(bien)}   →   ${pot(B, bien)}`] },
            { tipo: 'sentido', texto: sentido },
          ],
          respuesta: `${pot(B, bien)}${Math.abs(bien) <= 3 ? ` = ${valorPot(B, bien)}` : ''}`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), B = r.uno([2, 3, 5, 10]);
        const p = r.uno([-2, -1, 1, 2, 3, 4, 5]), q = r.uno([-3, -2, -1, 2, 3, 4]), w = r.ent(1, 4), tipo = s % 3;
        let expr, bien, dist, pasos;
        if (tipo === 0) {
          expr = `${pot(B, p)} · ${pot(B, q)} ÷ ${pot(B, w)}`; bien = p + q - w; pasos = `${p} + (${q}) − ${w}`;
          dist = [{ e: p * q - w, error: 'TAL-EXP-PRODUCTO', siFuera: 'Eso multiplica los exponentes del producto; en un producto se suman.' },
            { e: p + q + w, error: 'TAL-EXP-COCIENTE', siFuera: 'Eso suma el exponente del divisor; al dividir se resta.' },
            { e: w - p - q, error: 'TAL-EXP-SIGNO', siFuera: 'Eso invierte la resta: se resta el exponente del divisor.' }];
        } else if (tipo === 1) {
          expr = `(${pot(B, p)})${sup(w)} · ${pot(B, q)}`; bien = p * w + q; pasos = `${p} · ${w} + (${q})`;
          dist = [{ e: p + w + q, error: 'TAL-EXP-ELEVAR', siFuera: 'Eso suma al elevar; elevar una potencia multiplica los exponentes.' },
            { e: p * w * q, error: 'TAL-EXP-PRODUCTO', siFuera: `Eso multiplica también por ${q}; en el producto final se suma.` },
            { e: p * w - q, error: 'TAL-EXP-SIGNO', siFuera: 'Eso resta el último exponente; en un producto se suma.' }];
        } else {
          expr = `${pot(B, p)} · ${pot(B, q)} · ${pot(B, -w)}`; bien = p + q - w; pasos = `${p} + (${q}) + (−${w})`;
          dist = [{ e: p * q * -w, error: 'TAL-EXP-PRODUCTO', siFuera: 'Eso multiplica los exponentes; en un producto se suman.' },
            { e: p + q + w, error: 'TAL-EXP-NEG', siFuera: `Eso suma ${w} en vez de −${w}: el signo del exponente cuenta.` },
            { e: Math.abs(p) + Math.abs(q) + w, error: 'TAL-EXP-NEG', siFuera: 'Eso quita los signos de los exponentes; un negativo resta.' }];
        }
        return {
          pregunta: `Escribe ${expr} como una sola potencia de ${B}.`,
          opciones: distintas([{ id: 'c', texto: pot(B, bien), correcta: true }, ...dist.map((d, k) => ({ id: `d${k}`, texto: pot(B, d.e), error: d.error, siFuera: d.siFuera }))]),
          solucion: { texto: ['Misma base: en el producto se suman exponentes y se resta el del divisor.', 'Elevar multiplica los exponentes; después, el producto los suma.', 'Misma base: en un producto se suman los exponentes, con su signo.'][tipo], ecuacion: [`${pasos} = ${bien}   →   ${pot(B, bien)} = ${valorPot(B, bien)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: la raíz principal no es negativa ----------
  // Cambia: los dos números bajo la raíz · Permanece: las cuatro filas de la tabla · Progresa: la diferencia
  // entre √(a + b) y √a + √b · Se reserva: el x negativo bajo el cuadrado · Debe verse: √(x²) = |x|.
  // Dos representaciones a propósito (hallazgo 9): el juego compara sumas y productos en la tabla, sin negativos, para
  // que la predicción sobre √((−5)²) sea algo no visto; «Mira» pasa a la gráfica porque el caso negativo es lo nuevo.
  // El laboratorio (índice par contra impar) junta las dos cosas con el punto que se arrastra.
  const ejesRaiz = (extra = {}) => Object.assign({
    x: { min: -6, max: 6, paso: 2, nombre: 'x', decimales: 0, color: 'o' },
    y: { min: -6, max: 6, paso: 2, nombre: 'y', decimales: 0 },
  }, extra);
  const VX = Array.from({ length: 13 }, (_, k) => k - 6);
  const radicales = {
    id: 'radicales',
    titulo: 'La raíz principal nunca es negativa',
    temas: ['Propiedades de radicales'],
    pieza: 'alg-tabla',
    // Lee (fase 2): la raíz como lado de un cuadrado y sus nombres; no habla de negativos bajo el cuadrado («Predice»).
    lee: {
      tarjetas: [
        { titulo: 'El lado de un terreno', texto: 'Un terreno cuadrado en Puno tiene 400 m² de área. Su lado es el número que, multiplicado por sí mismo, da 400: mide 20 m. Ese número es la raíz cuadrada de 400.',
          ecuacion: ['√400 = 20, porque 20 · 20 = 400'] },
        { titulo: 'Las partes', texto: 'En √a, el signo √ es el radical y lo que está debajo es el radicando. Si no lleva un número chico, el índice es 2 y se trata de la raíz cuadrada.' },
        { titulo: 'Qué mirar al jugar', texto: 'La tabla compara dos caminos: sumar primero y sacar la raíz después, o sacar las raíces y sumar. Lo mismo con el producto. Fíjate en qué filas sale verde y en cuáles rojo.' },
      ],
    },
    juega: {
      consigna: 'Elige a y b. Compara la raíz de la suma con la suma de raíces, y la raíz del producto con el producto de raíces.',
      voz: 'Mira cuándo coinciden y cuándo no.',
      controles: [
        { id: 'a', etiqueta: 'a', min: 0, max: 16, paso: 1, inicio: 9, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: 0, max: 16, paso: 1, inicio: 16, decimales: 0, color: 'c-i' },
      ],
      dibujo: v => {
        const s1 = Math.sqrt(v.a + v.b), s2 = Math.sqrt(v.a) + Math.sqrt(v.b), p1 = Math.sqrt(v.a * v.b), p2 = Math.sqrt(v.a) * Math.sqrt(v.b);
        const ig = (x, y) => Math.abs(x - y) < 1e-9;
        return {
          datos: {
            columnas: ['expresión', 'valor'],
            filas: [[`√(${v.a} + ${v.b})`, f(s1)], [`√${v.a} + √${v.b}`, { t: f(s2), color: ig(s1, s2) ? 'd' : 'h', fuerte: true }], [`√(${v.a} · ${v.b})`, f(p1)], [`√${v.a} · √${v.b}`, { t: f(p2), color: ig(p1, p2) ? 'd' : 'h', fuerte: true }]],
            separador: { fila: 2 },
            alt: `Raíz de la suma ${f(s1)} contra suma de raíces ${f(s2)}; raíz del producto ${f(p1)} igual al producto de raíces`,
          }, estado: {},
        };
      },
      lectura: v => [`√(a + b) = ${f(Math.sqrt(v.a + v.b))}`, '   ·   ', `√a + √b = ${f(Math.sqrt(v.a) + Math.sqrt(v.b))}`],
      minimo: 3,
    },
    predice: {
      pregunta: '¿Cuánto vale √((−5)²)?',
      opciones: [
        { id: 'c', texto: '5', correcta: true },
        { id: 'menos', texto: '−5', error: 'TAL-RAIZ-X', siFuera: '−5 sería cierto si √(x²) fuera siempre x. La raíz principal nunca es negativa.' },
        { id: 'doble', texto: '±5', error: 'TAL-RAIZ-DOBLE', siFuera: '±5 son las soluciones de x² = 25; el símbolo √ da solo la no negativa.' },
        { id: 'cuadrado', texto: '25', error: 'TAL-RAIZ-FALTA', siFuera: '25 es (−5)²; falta sacar la raíz.' },
      ],
      pieza: 'ejes',
      dibujo: { datos: ejesRaiz({ curvas: [{ puntos: [[-6, -6], [6, 6]], color: 'h', discontinua: true, rotulo: 'y = x', en: [4, 4] }], alt: 'Plano con la recta y = x, sin la gráfica de la raíz' }), estado: {} },
      revelar: { datos: ejesRaiz({ curvas: [{ puntos: [[-6, -6], [6, 6]], color: 'h', discontinua: true, rotulo: 'y = x', en: [4, 4] }, { puntos: VX.map(x => [x, Math.abs(x)]), color: 'd', rotulo: 'y = √(x²)', en: [-6, 6] }], puntos: [{ x: -5, y: 5, color: 'd', rotulo: '5', guias: true }], alt: 'La gráfica de raíz de x al cuadrado es la de valor absoluto: en x = −5 vale 5' }), estado: {} },
      coincide: 'Coincide: (−5)² = 25 y la raíz principal de 25 es 5.',
    },
    mira: {
      pieza: 'ejes',
      datos: ejesRaiz({
        curvas: [{ puntos: [[-6, -6], [6, 6]], color: 'h', discontinua: true, rotulo: 'y = x', en: [4, 4], desde: 1 },
          { puntos: VX.filter(x => x >= 0).map(x => [x, x]), color: 'd', desde: 1 },
          { puntos: VX.filter(x => x <= 0).map(x => [x, -x]), color: 'd', rotulo: 'y = √(x²)', en: [-6, 6], desde: 2 }],
        puntos: [{ x: -3, y: 3, color: 'd', rotulo: '|−3| = 3', guias: true, desde: 3 }],
        alt: 'Raíz de x al cuadrado coincide con x si x es positivo y con −x si es negativo: es |x|',
      }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Para x ≥ 0, √(x²) coincide con x.', ecuacion: ['√(3²) = √9 = 3'] },
        { estado: { corte: 2 }, texto: 'Para x < 0, el cuadrado borra el signo y la raíz da el positivo.', ecuacion: ['√((−3)²) = √9 = 3'] },
        { estado: { corte: 3 }, texto: 'En los dos casos el resultado es la distancia al cero.', ecuacion: [{ raiz: ['x²'] }, ' = ', { llave: [{ abs: ['x'] }], nota: 'distancia al cero', color: 'c-d' }] },
        { estado: { corte: 3 }, texto: 'El producto se reparte; la suma no.', ecuacion: ['√(9 · 16) = 3 · 4 = 12', '   ·   ', '√(9 + 16) = 5 ≠ 7'] },
      ],
    },
    regla: {
      texto: 'El símbolo √ da la raíz principal, que nunca es negativa; por eso √(x²) = |x|. La raíz se reparte sobre un producto de no negativos, nunca sobre una suma.',
      ecuacion: [{ raiz: ['x²'] }, ' = ', { llave: [{ abs: ['x'] }], nota: 'nunca negativo', color: 'c-d' }, '   ·   ', { raiz: [a, ' · ', b] }, ' = ', { raiz: [a] }, ' · ', { raiz: [b] }],
      condicion: 'en los reales, la raíz de índice par pide radicando no negativo (a, b ≥ 0); la impar admite negativos: ∛(−8) = −2.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), tipo = s % 3;
        if (tipo === 0) {
          const k = r.ent(2, 12), neg = r() < 0.5, xv = neg ? -k : k;
          return {
            enunciado: `Si x = ${f(xv, 0)}, ¿cuánto vale √(x²)?`,
            pasos: [
              { tipo: 'pide', texto: `Piden √(x²) cuando x vale ${f(xv, 0)}.` },
              { tipo: 'datos', texto: `x = ${f(xv, 0)}. Primero se eleva al cuadrado y después se saca la raíz.` },
              { tipo: 'regla', texto: 'El símbolo √ da el número no negativo que, al cuadrado, da lo de adentro. Por eso √(x²) es la distancia de x al cero.',
                ecuacion: [{ raiz: ['x²'] }, ' = ', { abs: ['x'] }] },
              { tipo: 'cuentas', texto: 'Elevo al cuadrado y saco la raíz.', ecuacion: [{ raiz: [`(${f(xv, 0)})²`] }, ` = √${k * k} = ${k}`] },
              { tipo: 'sentido', texto: `${k} no es negativo y ${k} · ${k} = ${k * k}: es la raíz principal. ${neg ? `Da ${k}, no ${f(xv, 0)}.` : `Aquí coincide con x.`}` },
            ],
            respuesta: `√(x²) = ${k}`,
          };
        }
        if (tipo === 1) {
          const c = r.ent(2, 6), t = r.uno([2, 3, 5, 6, 7]), N = c * c * t;
          return {
            enunciado: `Simplifica √${N} sacando de la raíz todo lo que se pueda.`,
            pasos: [
              { tipo: 'pide', texto: `Piden escribir √${N} con el número más chico posible bajo la raíz.` },
              { tipo: 'datos', texto: `El radicando es ${N}. Busco el mayor cuadrado perfecto que lo divide: ${N} = ${c * c} · ${t}.` },
              { tipo: 'regla', texto: 'La raíz de un producto de números no negativos es el producto de las raíces. Así, la raíz del cuadrado sale entera.',
                ecuacion: [{ raiz: [a, ' · ', b] }, ' = ', { raiz: [a] }, ' · ', { raiz: [b] }] },
              { tipo: 'cuentas', texto: `Separo ${c * c} y ${t}, y saco la raíz de ${c * c}.`, ecuacion: [`√${N} = √${c * c} · √${t} = ${c}√${t}`] },
              { tipo: 'sentido', texto: `Lo reviso al revés: (${c}√${t})² = ${c * c} · ${t} = ${N}. Y ${t} ya no tiene ningún cuadrado adentro.` },
            ],
            respuesta: `√${N} = ${c}√${t}`,
          };
        }
        const [p, q, h] = r.uno([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]]);
        return {
          enunciado: ['Si ', a, ` = ${p} y `, b, ` = ${q}, ¿cuánto vale `, { raiz: [a, '² + ', b, '²'] }, '?'],
          pasos: [
            { tipo: 'pide', texto: ['Piden la raíz de la suma ', a, '² + ', b, '².'] },
            { tipo: 'datos', texto: [a, ` = ${p} y `, b, ` = ${q}.`] },
            { tipo: 'regla', texto: 'La raíz no se reparte sobre una suma. Primero se hace todo lo de adentro y al final se saca la raíz.' },
            { tipo: 'cuentas', texto: 'Elevo al cuadrado, sumo bajo la raíz y saco la raíz.', ecuacion: [`√(${p}² + ${q}²) = √(${p * p} + ${q * q}) = √${h * h} = ${h}`] },
            { tipo: 'sentido', texto: `${h} · ${h} = ${h * h}: cuadra. Y ${h} es menor que ${p} + ${q} = ${p + q}: repartir la raíz habría dado de más.` },
          ],
          respuesta: ['√(', a, '² + ', b, `²) = ${h}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const k = r.ent(2, 12), neg = s % 2 === 0, x = neg ? -k : k;
          return {
            pregunta: `Si x = ${f(x, 0)}, ¿cuánto vale √(x²)?`,
            opciones: distintas([{ id: 'c', texto: f(k, 0), correcta: true },
              { id: 'x', texto: f(-k, 0), error: 'TAL-RAIZ-X', siFuera: neg ? 'Eso sería cierto si √(x²) fuera x; la raíz principal no es negativa.' : `Con x = ${k}, √(x²) = ${k}: la raíz principal no es negativa.` },
              { id: 'pm', texto: `±${k}`, error: 'TAL-RAIZ-DOBLE', siFuera: `±${k} resuelve t² = ${k * k}; √ da solo la no negativa.` },
              { id: 'cuad', texto: f(k * k, 0), error: 'TAL-RAIZ-FALTA', siFuera: `${k * k} es x²; falta sacar la raíz.` }]),
            solucion: { texto: 'La raíz del cuadrado es el valor absoluto.', ecuacion: [{ raiz: [`(${f(x, 0)})²`] }, ` = √${k * k} = ${k}`] },
          };
        }
        if (tipo === 1) {
          const c = r.ent(2, 6), t = r.uno([2, 3, 5, 6, 7]), N = c * c * t;
          return {
            pregunta: `Simplifica √${N} sacando de la raíz todo lo que se pueda.`,
            opciones: distintas([{ id: 'c', texto: `${c}√${t}`, correcta: true },
              { id: 'adentro', texto: `${c * c}√${t}`, error: 'TAL-RAIZ-FALTA', siFuera: `${c * c} sale de la raíz como √${c * c} = ${c}, no como ${c * c}.` },
              { id: 'invertido', texto: `${t}√${c}`, error: 'TAL-RAIZ-SIMP', siFuera: `${t}√${c} da √${t * t * c}; el que sale es el cuadrado ${c * c}.` },
              { id: 'suma', texto: `${c} + √${t}`, error: 'AL9', siFuera: `Eso sería √(${c * c} + ${t}) repartida; aquí es un producto: ${c * c} · ${t}.` }]),
            solucion: { texto: `${N} = ${c * c} · ${t}, y ${c * c} es un cuadrado.`, ecuacion: [`√${N} = √${c * c} · √${t} = ${c}√${t}`] },
          };
        }
        const [p, q, h] = r.uno([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]]);
        return {
          pregunta: ['Si ', a, ` = ${p} y `, b, ` = ${q}, ¿cuánto vale `, { raiz: [a, '² + ', b, '²'] }, '?'],
          opciones: distintas([{ id: 'c', texto: f(h, 0), correcta: true },
            { id: 'suma', texto: f(p + q, 0), error: 'AL9', siFuera: `${p + q} sería cierto si la raíz se repartiera sobre la suma; no se reparte.` },
            { id: 'sin', texto: f(p * p + q * q, 0), error: 'TAL-RAIZ-FALTA', siFuera: `${p * p + q * q} es a² + b²; falta sacar la raíz.` },
            { id: 'resta', texto: f(q - p, 0), error: 'AL9', siFuera: 'La raíz de una suma no se calcula con a y b sueltos.' }]),
          solucion: { texto: 'Primero se suma bajo la raíz; después se saca la raíz.', ecuacion: [`√(${p * p} + ${q * q}) = √${h * h} = ${h}`] },
        };
      },
    },
  };

  // ---------- Idea 3: el cuadrado de una suma tiene cuatro piezas ----------
  // Cambia: los largos a y b · Permanece: el cuadrado de lado a + b, a escala · Progresa: las piezas que lo llenan
  // · Se reserva: los dos rectángulos ab · Debe verse: a² + b² no alcanza a cubrir (a + b)².
  // Gesto: el alumno estira el cuadrado por sus esquinas; los huecos ab crecen con él a la vista.
  const cuadrado = (va, vb, conAB, extra = {}) => ({
    anchos: [{ t: `a = ${va}`, v: va, color: 'o' }, { t: `b = ${vb}`, v: vb, color: 'i' }],
    altos: [{ t: 'a', v: va, color: 'o' }, { t: 'b', v: vb, color: 'i' }],
    celdas: [[{ t: `a² = ${va * va}`, color: 'o' }, conAB ? { t: `ab = ${va * vb}`, color: 'd', desde: conAB === true ? 0 : conAB } : null],
      [conAB ? { t: `ab = ${va * vb}`, color: 'd', desde: conAB === true ? 0 : conAB } : null, { t: `b² = ${vb * vb}`, color: 'i' }]],
    total: { t: `(a + b)² = ${(va + vb) ** 2}` },
    alt: `Cuadrado de lado ${va} + ${vb}: ${conAB ? 'a², b² y dos rectángulos ab' : 'a² y b² dejan dos huecos'}`,
    ...extra,
  });
  // Gesto: la esquina interior de a² (diagonal) cambia a; la esquina de afuera de b² cambia b. Con escala fija
  // (alg-baldosas `escala`), el cuadrado crece de verdad: lo que se ve es a + b, no una proporción.
  const ESC_N = 24;   // px por unidad: a + b llega a 8 y el lado a 192 px, lo que cabe en la pieza
  // Con la escala fija, un tramo de menos de 56 px muestra solo su letra (el valor está en el control y la lectura).
  const rot = (t, v, val = v) => (v * ESC_N >= 56 ? `${t} = ${val}` : t);
  const cuadJ = v => ({
    anchos: [{ t: rot('a', v.a), v: v.a, color: 'o' }, { t: rot('b', v.b), v: v.b, color: 'i' }],
    altos: [{ t: 'a', v: v.a, color: 'o' }, { t: 'b', v: v.b, color: 'i' }],
    celdas: [[{ t: rot('a²', v.a, v.a * v.a), color: 'o' }, null], [null, { t: rot('b²', v.b, v.b * v.b), color: 'i' }]],
    total: { t: `(a + b)² = ${(v.a + v.b) ** 2}` },
    escala: ESC_N,
    alt: `Cuadrado de lado ${v.a} + ${v.b}: a² y b² dejan dos huecos`,
  });
  const notables = {
    id: 'cuadrado-suma',
    titulo: 'El cuadrado de una suma',
    temas: ['Productos notables'],
    pieza: 'alg-baldosas',
    // Lee (fase 2): el área de un cuadrado de lado a + b y el nombre «producto notable»; no dice qué falta («Predice»).
    lee: {
      tarjetas: [
        { titulo: 'Un patio cuadrado', texto: 'En una casa de Juliaca, un patio cuadrado mide a metros hasta una columna y b metros más hasta la pared. Su lado es a + b, y su área es el lado por el lado.',
          ecuacion: ['(', a, ' + ', b, ')(', a, ' + ', b, ') = (', a, ' + ', b, ')²'] },
        { titulo: 'Productos notables', texto: 'Algunas multiplicaciones salen tanto en los exámenes que conviene saber su resultado sin hacer toda la cuenta. Se llaman productos notables, y el cuadrado de una suma es el primero de la lista.' },
        { titulo: 'Qué mirar al jugar', texto: 'El cuadrado grande ya trae dos piezas: a² en una esquina y b² en la opuesta. Cambia a y b, y fíjate si esas dos piezas alcanzan a cubrir todo el cuadrado.' },
      ],
    },
    juega: {
      consigna: 'Elige los largos a y b. El cuadrado mide a + b de lado; adentro ya están las piezas a² y b².',
      voz: 'Mira lo que queda sin cubrir.',
      controles: [
        { id: 'a', etiqueta: 'a', min: 1, max: 5, paso: 1, inicio: 4, decimales: 0, color: 'c-o' },
        { id: 'b', etiqueta: 'b', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
      ],
      dibujo: v => ({ datos: cuadJ(v), estado: {} }),
      lectura: v => [`(a + b)² = ${(v.a + v.b) ** 2}`, '   ·   ', `a² + b² = ${v.a ** 2 + v.b ** 2}`],
      minimo: 3,
      arrastres: [
        { id: 'esquina-a', etiqueta: 'esquina de la pieza a²', color: 'c-o',
          donde: v => { const g = BALD().geometria(cuadJ(v)); return { x: g.xs[0][1], y: g.ys[0][1] }; },
          mover: (pt, v) => { const g = BALD().geometria(cuadJ(v)); return { a: ((pt.x - g.x0) + (pt.y - g.y0)) / 2 / g.esc }; } },
        { id: 'esquina-b', etiqueta: 'esquina de afuera del cuadrado', color: 'c-i',
          donde: v => { const g = BALD().geometria(cuadJ(v)); return { x: g.xs[1][1], y: g.ys[1][1] }; },
          mover: (pt, v) => { const g = BALD().geometria(cuadJ(v)); return { b: ((pt.x - g.xs[1][0]) + (pt.y - g.ys[1][0])) / 2 / g.esc }; } },
      ],
    },
    predice: {
      pregunta: ['Con ', a, ' = 5 y ', b, ' = 2, ¿cuánto le falta a ', a, '² + ', b, '² para llegar a (', a, ' + ', b, ')²?'],
      opciones: [
        { id: 'c', texto: '20', correcta: true },
        { id: 'cero', texto: '0', error: 'AL8', siFuera: '0 sería cierto si (a + b)² fuera a² + b². Quedan dos rectángulos sin cubrir.' },
        { id: 'uno', texto: '10', error: 'TAL-2AB', siFuera: '10 es un solo rectángulo ab; hay dos, uno en cada esquina.' },
        { id: 'b2', texto: '4', error: 'TAL-2AB', siFuera: '4 es b². Lo que falta mide a de un lado y b del otro.' },
      ],
      dibujo: { datos: cuadrado(5, 2, false), estado: {} },
      revelar: { datos: cuadrado(5, 2, true), estado: {} },
      coincide: 'Coincide: faltan dos rectángulos de 5 · 2 = 10 cada uno.',
    },
    mira: {
      datos: (() => {
        const d = cuadrado(3, 2, 3);
        d.celdas[0][0].desde = 1; d.celdas[1][1].desde = 2; d.total.desde = 4;
        return d;
      })(),
      voz: 'Creo que la figura alcanza para lados positivos. Después, el álgebra.',
      pasos: [
        { estado: { corte: 1 }, texto: 'La esquina de a por a: a².', ecuacion: [a, '² = 9'] },
        { estado: { corte: 2 }, texto: 'La esquina opuesta, de b por b: b².', ecuacion: [b, '² = 4'] },
        { estado: { corte: 3 }, texto: 'Los dos huecos miden a por b: son 2ab.', ecuacion: [{ llave: ['2', a, b], nota: 'dos rectángulos', color: 'c-d' }, ' = 2 · 3 · 2 = 12'] },
        { estado: { corte: 4 }, texto: 'Las cuatro piezas llenan el cuadrado de lado a + b.', ecuacion: ['9 + 12 + 4 = 25 = 5²'] },
        { estado: { corte: 4 }, texto: 'Con a = −3 no hay figura, pero la distributividad da igual.', ecuacion: ['(−3 + 2)² = 1 = 9 − 12 + 4'] },
      ],
    },
    regla: {
      texto: 'Son productos notables: el cuadrado de una suma tiene dos cuadrados y dos rectángulos iguales; la suma por la diferencia deja una diferencia de cuadrados.',
      ecuacion: ['(', a, ' + ', b, ')² = ', a, '² + ', { llave: ['2', a, b], nota: 'huecos', color: 'c-d' }, ' + ', b, '²', '   ·   ',
        '(', a, ' + ', b, ')(', a, ' − ', b, ') = ', a, '² − ', b, '²'],
      condicion: 'valen para todo par de números reales a y b; la figura de áreas solo ilustra el caso de lados positivos.',
    },
    resuelve: {
      pieza: 'alg-baldosas',
      generar(s) {
        const r = azar(s + 900), tipo = s % 3;
        if (tipo === 0) {
          const va = r.ent(2, 7), vb = r.ent(1, 5), Sv = va + vb, Pv = va * vb, bien = Sv * Sv - 2 * Pv;
          return {
            enunciado: ['Si ', a, ' + ', b, ` = ${Sv} y `, a, b, ` = ${Pv}, ¿cuánto vale `, a, '² + ', b, '²?'],
            dibujo: { datos: cuadrado(va, vb, false), estado: {} },
            pasos: [
              { tipo: 'pide', texto: ['Piden ', a, '² + ', b, '², sin conocer ', a, ' ni ', b, ' por separado.'] },
              { tipo: 'datos', texto: ['La suma ', a, ' + ', b, ` vale ${Sv} y el producto `, a, b, ` vale ${Pv}.`] },
              { tipo: 'regla', texto: 'El cuadrado de lado a + b tiene cuatro piezas: a², b² y dos rectángulos ab. Si le quito los dos rectángulos, quedan a² y b².',
                ecuacion: ['(', a, ' + ', b, ')² = ', a, '² + 2', a, b, ' + ', b, '²'] },
              { tipo: 'cuentas', texto: ['Al cuadrado de la suma le resto dos veces el producto.'], ecuacion: [a, '² + ', b, `² = ${Sv}² − 2 · ${Pv} = ${Sv * Sv} − ${2 * Pv} = ${bien}`],
                dibujo: { datos: cuadrado(va, vb, true), estado: {} } },
              { tipo: 'sentido', texto: `Los números ${va} y ${vb} suman ${Sv} y multiplican ${Pv}. Con ellos: ${va * va} + ${vb * vb} = ${bien}. Cuadra.` },
            ],
            respuesta: [a, '² + ', b, `² = ${bien}`],
          };
        }
        if (tipo === 1) {
          const k = r.ent(2, 9), mas = r() < 0.5, signo = mas ? '+' : '−', c = mas ? 2 * k : -2 * k;
          const des = `x² ${c < 0 ? '−' : '+'} ${Math.abs(c)}x + ${k * k}`, uno = (1 + (mas ? k : -k)) ** 2, seg = mas ? `${k}` : `(−${k})`;
          return {
            enunciado: `Al desarrollar (x ${signo} ${k})², ¿qué coeficiente acompaña a x?`,
            pasos: [
              { tipo: 'pide', texto: `Piden el número que multiplica a x cuando se desarrolla (x ${signo} ${k})².` },
              { tipo: 'datos', texto: `Es el cuadrado de un binomio: el primer término es x y el segundo es ${signo === '+' ? '' : '−'}${k}.` },
              { tipo: 'regla', texto: 'Al cuadrado de una suma salen los dos cuadrados y dos veces el producto de los términos, con su signo.',
                ecuacion: ['(', a, ' + ', b, ')² = ', a, '² + 2', a, b, ' + ', b, '²'] },
              { tipo: 'cuentas', texto: `El término del medio es 2 · x · ${seg}, y el último, ${k}² = ${k * k}.`, ecuacion: [`(x ${signo} ${k})² = x² + 2 · ${seg} · x + ${k}² = ${des}`] },
              { tipo: 'sentido', texto: `Pruebo con x = 1: (1 ${signo} ${k})² = ${uno}, y 1 ${c < 0 ? '−' : '+'} ${Math.abs(c)} + ${k * k} = ${1 + c + k * k}. Cuadra.` },
            ],
            respuesta: `El coeficiente de x es ${f(c, 0)}.`,
          };
        }
        const M = r.uno([20, 30, 40, 50, 60, 70]), d = r.ent(1, 4);
        return {
          enunciado: `Calcula ${M + d} · ${M - d} como (m + d)(m − d), con m = ${M}.`,
          pasos: [
            { tipo: 'pide', texto: `Piden el producto ${M + d} · ${M - d} sin hacer la multiplicación larga.` },
            { tipo: 'datos', texto: `Los dos números están a ${d} de ${M}: uno es ${M} + ${d} y el otro, ${M} − ${d}.` },
            { tipo: 'regla', texto: 'La suma por la diferencia de dos números da la diferencia de sus cuadrados: los productos cruzados se anulan.',
              ecuacion: ['(', a, ' + ', b, ')(', a, ' − ', b, ') = ', a, '² − ', b, '²'] },
            { tipo: 'cuentas', texto: `Elevo ${M} y ${d} al cuadrado y resto.`, ecuacion: [`${M}² − ${d}² = ${M * M} − ${d * d} = ${M * M - d * d}`] },
            { tipo: 'sentido', texto: `Queda un poco menos que ${M}² = ${M * M}: un factor subió ${d} y el otro bajó ${d}, y eso resta solo ${d * d}.` },
          ],
          respuesta: `${M + d} · ${M - d} = ${M * M - d * d}`,
        };
      },
    },
    ahoraTu: {
      pieza: 'alg-baldosas',
      generar(s) {
        const r = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const va = r.ent(2, 7), vb = r.ent(1, 5), S = va + vb, P = va * vb, bien = S * S - 2 * P;
          return {
            pregunta: ['Si ', a, ' + ', b, ` = ${S} y `, a, b, ` = ${P}, ¿cuánto vale `, a, '² + ', b, '²?'],
            opciones: distintas([{ id: 'c', texto: f(bien, 0), correcta: true },
              { id: 'al8', texto: f(S * S, 0), error: 'AL8', siFuera: `${S * S} sería cierto si (a + b)² fuera a² + b²; sobran los dos rectángulos ab.` },
              { id: 'uno', texto: f(S * S - P, 0), error: 'TAL-2AB', siFuera: `Eso resta un solo rectángulo ab; son dos: 2 · ${P}.` },
              { id: 'suma', texto: f(S * S + 2 * P, 0), error: 'TAL-2AB', siFuera: 'Los rectángulos ya están dentro de (a + b)²: se restan, no se suman.' }]),
            solucion: { texto: 'Al cuadrado de la suma se le quitan los dos rectángulos.', ecuacion: [a, '² + ', b, `² = ${S}² − 2 · ${P} = ${bien}`], dibujo: { datos: cuadrado(va, vb, true), estado: {} } },
          };
        }
        if (tipo === 1) {
          const k = r.ent(2, 9), signo = s % 2 ? '−' : '+', c = signo === '+' ? 2 * k : -2 * k;
          return {
            pregunta: `Al desarrollar (x ${signo} ${k})², ¿qué coeficiente acompaña a x?`,
            opciones: distintas([{ id: 'c', texto: f(c, 0), correcta: true },
              { id: 'uno', texto: f(c / 2, 0), error: 'TAL-2AB', siFuera: `Eso cuenta un solo rectángulo; son dos: 2 · ${k}.` },
              { id: 'cero', texto: '0', error: 'AL8', siFuera: `0 sería cierto si (x ${signo} ${k})² fuera x² + ${k * k}. Faltan los dos rectángulos.` },
              { id: 'signo', texto: f(-c, 0), error: 'TAL-SIGNO', siFuera: `El término cruzado lleva el signo de ${signo} ${k}.` }]),
            solucion: { texto: `Los dos productos cruzados x · (${signo}${k}) se suman.`, ecuacion: [`(x ${signo} ${k})² = x² ${c < 0 ? '−' : '+'} ${Math.abs(c)}x + ${k * k}`] },
          };
        }
        const M = r.uno([20, 30, 40, 50, 60, 70]), d = r.ent(1, 4);
        return {
          pregunta: `Calcula ${M + d} · ${M - d} como (m + d)(m − d), con m = ${M}.`,
          opciones: distintas([{ id: 'c', texto: f(M * M - d * d, 0), correcta: true },
            { id: 'mas', texto: f(M * M + d * d, 0), error: 'TAL-DIFCUAD', siFuera: 'Los productos cruzados se anulan, y d · (−d) resta d².' },
            { id: 'cuad', texto: f(M * M, 0), error: 'TAL-DIFCUAD', siFuera: `Falta restar ${d}² = ${d * d}.` },
            { id: 'dos', texto: f(M * M - 2 * d, 0), error: 'TAL-DIFCUAD', siFuera: `Se resta d² = ${d * d}, no 2d.` }]),
          solucion: { texto: 'La suma por la diferencia deja m² − d².', ecuacion: [`${M}² − ${d}² = ${M * M} − ${d * d} = ${M * M - d * d}`] },
        };
      },
    },
  };

  // ---------- Idea 4: radicales dobles, buscar suma y producto ----------
  // Cambia: el radical doble elegido · Permanece: la tabla de pares que suman A · Progresa: los productos que se
  // calculan · Se reserva: el par cuyo producto es B · Debe verse: la suma da A y el producto da B a la vez.
  const pares = A => { const l = []; for (let x = A - 1; x >= A / 2; x--) l.push([x, A - x]); return l; };
  const tablaPares = (A, B, ocultar = false, desde = {}) => ({
    columnas: ['x', 'y', 'x + y', 'x · y'], colorCol: ['o', 'i', null, null],
    filas: pares(A).map(([x, y]) => [{ t: String(x), desde: desde.par || 0 }, { t: String(y), desde: desde.par || 0 }, { t: String(A), desde: desde.par || 0 },
      { t: String(x * y), desde: ocultar ? 1 : desde.prod || 0, color: x * y === B ? 'd' : null, fuerte: x * y === B, marca: x * y === B ? 'ok' : undefined }]),
    alt: `Pares que suman ${A}; el de producto ${B} da el radical simple`,
  });
  const EJEMPLOS = [[5, 6], [8, 15], [9, 14], [11, 30]];
  const parDe = (A, B) => pares(A).find(([x, y]) => x * y === B);
  const dobles = {
    id: 'radicales-dobles',
    titulo: 'Dos números que suman y multiplican',
    temas: ['Radicales dobles'],
    pieza: 'alg-tabla',
    // Lee (fase 2): qué es un radical doble y de dónde sale; el par que lo desarma lo busca el juego.
    lee: {
      tarjetas: [
        { titulo: 'Una raíz con otra adentro', texto: 'A veces una raíz trae otra raíz adentro, como √(8 + 2√15). Eso es un radical doble. En los exámenes piden escribirlo con raíces sueltas, que son más fáciles de sumar y comparar.' },
        { titulo: 'De dónde sale', texto: 'Si elevas al cuadrado una suma de dos raíces, como (√x + √y)², sale un número más otra raíz: un radical doble. Simplificarlo es recorrer ese camino al revés.' },
        { titulo: 'Qué mirar al jugar', texto: 'En la tabla, cada fila trae dos números x e y que suman A. Mira la última columna: el producto cambia de fila en fila, aunque la suma sea la misma.' },
      ],
    },
    juega: {
      consigna: 'Elige un radical doble √(A + 2√B). La tabla lista los pares que suman A y su producto. Busca el producto B.',
      voz: 'La suma ya está; el producto decide.',
      controles: [
        { id: 'ej', etiqueta: 'Radical', opciones: EJEMPLOS.map(([A, B], k) => ({ valor: k, texto: `√(${A} + 2√${B})` })) },
        { id: 'sg', etiqueta: 'Signo', opciones: [{ valor: '+', texto: '+' }, { valor: '−', texto: '−' }] },
      ],
      dibujo: v => { const [A, B] = EJEMPLOS[v.ej]; return { datos: tablaPares(A, B), estado: {} }; },
      lectura: v => { const [A, B] = EJEMPLOS[v.ej], [x, y] = parDe(A, B); return [`√(${A} ${v.sg} 2√${B}) = ${rz(x)} ${v.sg} ${rz(y)}`]; },
      minimo: 3,
    },
    predice: {
      pregunta: '¿A qué es igual √(7 + 2√12)?',
      opciones: [
        { id: 'c', texto: '2 + √3', correcta: true },
        { id: 'reparte', texto: '√7 + √12', error: 'AL9', siFuera: 'Sería cierto si la raíz se repartiera sobre la suma; (√7 + √12)² da 19 + 2√84.' },
        { id: 'suma', texto: '1 + √6', error: 'TAL-RD-PRODUCTO', siFuera: '1 y 6 suman 7, pero su producto es 6, no 12.' },
        { id: 'raiz', texto: '√7 + 2√3', error: 'AL9', siFuera: 'Eso saca √12 = 2√3 y deja √7 suelto; la raíz grande no se reparte.' },
      ],
      dibujo: { datos: tablaPares(7, 12, true), estado: {} },
      revelar: { datos: tablaPares(7, 12), estado: {} },
      coincide: 'Coincide: 4 + 3 = 7 y 4 · 3 = 12, así que queda √4 + √3 = 2 + √3.',
    },
    mira: {
      datos: tablaPares(7, 12, false, { par: 1, prod: 2 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'Se buscan x e y que sumen 7: los pares posibles.', ecuacion: ['x + y = 7'] },
        { estado: { corte: 2 }, texto: 'De esos, el que multiplica 12 es 4 y 3.', ecuacion: ['x · y = 12'] },
        { estado: { corte: 2 }, texto: 'Entonces √(7 + 2√12) = √4 + √3 = 2 + √3.', ecuacion: ['√(7 + 2√12) = √4 + √3'] },
        { estado: { corte: 2 }, texto: 'Se comprueba elevando al cuadrado: vuelve el radical doble.', ecuacion: ['(2 + √3)² = 4 + 4√3 + 3 = 7 + 2√12'] },
      ],
    },
    regla: {
      texto: 'Un radical doble √(A ± 2√B) se vuelve simple si hay dos números x e y que suman A y se multiplican B.',
      ecuacion: [{ raiz: ['A ± 2', { raiz: ['B'] }] }, ' = ', { raiz: [{ v: 'c-o', t: 'x' }] }, ' ± ', { raiz: [{ v: 'c-i', t: 'y' }] }, '   ·   ',
        { llave: [{ v: 'c-o', t: 'x' }, ' + ', { v: 'c-i', t: 'y' }], nota: 'suman A', color: 'c-d' }, ' = A', '   ·   ', { llave: [{ v: 'c-o', t: 'x' }, ' · ', { v: 'c-i', t: 'y' }], nota: 'multiplican B', color: 'c-d' }, ' = B'],
      condicion: 'x ≥ y ≥ 0, y con el signo menos va primero el mayor: así nada queda negativo.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        let xv, yv;
        do { xv = r.ent(3, 11); yv = r.ent(1, xv - 1); } while (esCuad(xv * yv) || xv + yv > 15 || xv + yv < 5);
        const A = xv + yv, B = xv * yv, sg = s % 2 ? '−' : '+';
        const X = { v: 'c-o', t: 'x' }, Y = { v: 'c-i', t: 'y' };
        const simple = `√${xv} ${sg} √${yv}${esCuad(xv) || esCuad(yv) ? ` = ${rz(xv)} ${sg} ${rz(yv)}` : ''}`;
        return {
          enunciado: `¿A qué es igual √(${A} ${sg} 2√${B})?`,
          dibujo: { datos: tablaPares(A, B, true), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden escribir √(${A} ${sg} 2√${B}) con dos raíces simples.` },
            { tipo: 'datos', texto: `Es un radical doble: bajo la raíz grande está ${A}, y bajo la raíz chica, después del 2, está ${B}.` },
            { tipo: 'regla', texto: ['Busco dos números ', X, ' e ', Y, ` que sumen ${A} y se multipliquen ${B}. Si existen, el radical doble es √x ${sg} √y, con el mayor primero.`] },
            { tipo: 'cuentas', texto: `De los pares que suman ${A}, solo ${xv} y ${yv} multiplican ${B}.`,
              ecuacion: [X, ' + ', Y, ` = ${xv} + ${yv} = ${A}`, '   ·   ', X, ' · ', Y, ` = ${xv} · ${yv} = ${B}`],
              dibujo: { datos: tablaPares(A, B), estado: {} } },
            { tipo: 'sentido', texto: `Elevo al cuadrado: (√${xv} ${sg} √${yv})² = ${xv} + ${yv} ${sg} 2√${B} = ${A} ${sg} 2√${B}. Vuelve el radical de partida.${sg === '−' ? ` Y como ${xv} > ${yv}, no sale negativo.` : ''}` },
          ],
          respuesta: `√(${A} ${sg} 2√${B}) = ${simple}`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let x, y;
        do { x = r.ent(3, 11); y = r.ent(1, x - 1); } while (esCuad(x * y) || x + y > 15 || x + y < 5);
        const A = x + y, B = x * y, sg = s % 2 ? '−' : '+';
        const otro = pares(A).find(([u, w]) => u > w && u * w !== B && u !== x);
        return {
          pregunta: `¿A qué es igual √(${A} ${sg} 2√${B})?`,
          opciones: distintas([{ id: 'c', texto: `${rz(x)} ${sg} ${rz(y)}`, correcta: true },
            sg === '−' ? { id: 'orden', texto: `${rz(y)} − ${rz(x)}`, error: 'TAL-RD-ORDEN', siFuera: `Ese resultado es negativo; una raíz principal no lo es. Va primero ${rz(x)}.` }
              : { id: 'menos', texto: `${rz(x)} − ${rz(y)}`, error: 'TAL-RD-SIGNO', siFuera: 'El signo del radical simple es el mismo del radical doble.' },
            { id: 'reparte', texto: `√${A} ${sg} √${B}`, error: 'AL9', siFuera: 'Sería cierto si la raíz se repartiera sobre la suma; no se reparte.' },
            otro && { id: 'par', texto: `${rz(otro[0])} ${sg} ${rz(otro[1])}`, error: 'TAL-RD-PRODUCTO', siFuera: `${otro[0]} y ${otro[1]} suman ${A}, pero su producto es ${otro[0] * otro[1]}, no ${B}.` }]),
          solucion: { texto: `${x} + ${y} = ${A} y ${x} · ${y} = ${B}.`, ecuacion: [`√(${A} ${sg} 2√${B}) = √${x} ${sg} √${y}${esCuad(x) || esCuad(y) ? ` = ${rz(x)} ${sg} ${rz(y)}` : ''}`] },
        };
      },
    },
  };

  // ---------- Idea 5: racionalizar es multiplicar por uno ----------
  // Cambia: el número bajo la raíz y la forma del denominador · Permanece: el valor decimal de cada fila
  // · Progresa: la expresión que se transforma · Se reserva: el conjugado · Debe verse: el valor no cambia.
  const RACIONAL = {
    simple: A => ({ filas: [[`1/√${A}`, f(1 / Math.sqrt(A), 3)], [`× √${A}/√${A}`, 'por 1'], [{ t: `√${A}/${A}`, color: 'd', fuerte: true }, { t: f(Math.sqrt(A) / A, 3), color: 'd' }]] }),
    conj: A => ({ filas: [[`1/(√${A} − 1)`, f(1 / (Math.sqrt(A) - 1), 3)], [`× (√${A} + 1)/(√${A} + 1)`, 'por 1'], [{ t: `(√${A} + 1)/${A - 1}`, color: 'd', fuerte: true }, { t: f((Math.sqrt(A) + 1) / (A - 1), 3), color: 'd' }]] }),
  };
  const racionalizar = {
    id: 'racionalizar',
    titulo: 'Racionalizar es multiplicar por uno',
    temas: ['Racionalización'],
    pieza: 'alg-tabla',
    // Lee (fase 2): por qué molesta una raíz abajo y el nombre «racionalizar»; el conjugado queda para «Predice».
    lee: {
      tarjetas: [
        { titulo: 'Cifras que no terminan', texto: '√2 vale 1,4142… y sus cifras siguen sin fin. Dividir entre un número así es incómodo, por eso en los exámenes piden fracciones sin raíces en el denominador, el número de abajo.' },
        { titulo: 'Racionalizar', texto: 'Cambiar una fracción por otra del mismo valor, pero sin raíces abajo, se llama racionalizar. Arriba pueden quedar raíces: lo que importa es que el denominador quede limpio.' },
        { titulo: 'Qué mirar al jugar', texto: 'En la tabla, la primera fila es la fracción de partida y la última, la nueva. Compara sus valores decimales y mira qué se hace en la fila del medio.' },
      ],
    },
    juega: {
      consigna: 'Elige el número bajo la raíz y la forma del denominador. Mira la expresión que resulta y su valor decimal en cada fila.',
      voz: 'Compara los valores de la primera y la última fila.',
      controles: [
        { id: 'A', etiqueta: 'Bajo la raíz', min: 2, max: 10, paso: 1, inicio: 5, decimales: 0, color: 'c-o' },
        { id: 'forma', etiqueta: 'Forma', opciones: [{ valor: 'simple', texto: '1/√A' }, { valor: 'conj', texto: '1/(√A − 1)' }] },
      ],
      dibujo: v => ({ datos: Object.assign({ columnas: ['expresión', '≈ valor'], alt: 'La expresión cambia de forma y su valor decimal se mantiene' }, RACIONAL[v.forma](v.A)), estado: {} }),
      lectura: v => [`El valor no cambia: ≈ ${v.forma === 'simple' ? f(1 / Math.sqrt(v.A), 3) : f(1 / (Math.sqrt(v.A) - 1), 3)}`],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Por qué expresión conviene multiplicar ', { frac: ['1', '√5 − √3'] }, ' para que el denominador quede sin raíces?'],
      opciones: [
        { id: 'c', texto: [{ frac: ['√5 + √3', '√5 + √3'] }], correcta: true },
        { id: 'mismo', texto: [{ frac: ['√5 − √3', '√5 − √3'] }], error: 'TAL-RAC-MISMO', siFuera: 'Así el denominador queda (√5 − √3)² = 8 − 2√15: sigue con raíz.' },
        { id: 'una', texto: [{ frac: ['√5', '√5'] }], error: 'TAL-RAC-UNA', siFuera: 'Eso sirve con una sola raíz; aquí queda 5 − √15 abajo.' },
        { id: 'solo', texto: '√5 + √3', error: 'TAL-RAC-UNO', siFuera: 'Multiplicar solo por √5 + √3 cambia el valor; hay que multiplicar por 1.' },
      ],
      dibujo: { datos: { columnas: ['expresión', '≈ valor'], filas: [['1/(√5 − √3)', f(1 / (Math.sqrt(5) - Math.sqrt(3)), 3)], ['× ?', ''], ['?', '']], alt: 'Uno sobre raíz de 5 menos raíz de 3, y un factor por elegir' }, estado: {} },
      revelar: { datos: { columnas: ['expresión', '≈ valor'], filas: [['1/(√5 − √3)', f(1 / (Math.sqrt(5) - Math.sqrt(3)), 3)], ['× (√5 + √3)/(√5 + √3)', 'por 1'], [{ t: '(√5 + √3)/2', color: 'd', fuerte: true }, { t: f((Math.sqrt(5) + Math.sqrt(3)) / 2, 3), color: 'd' }]], alt: 'Con el conjugado, el denominador queda 5 − 3 = 2 y el valor no cambia' }, estado: {} },
      coincide: 'Coincide: (√5 − √3)(√5 + √3) = 5 − 3 = 2, sin raíces.',
    },
    mira: {
      datos: {
        columnas: ['paso', 'expresión'],
        filas: [['original', '1/(√5 − √3)'], [{ t: 'por 1', desde: 1 }, { t: '× (√5 + √3)/(√5 + √3)', desde: 1 }], [{ t: 'abajo', desde: 2 }, { t: '(√5)² − (√3)² = 2', desde: 2, color: 'd' }], [{ t: 'resultado', desde: 3 }, { t: '(√5 + √3)/2', desde: 3, color: 'd', fuerte: true }]],
        alt: 'Multiplicar por el conjugado sobre sí mismo deja el denominador 5 − 3 = 2',
      },
      pasos: [
        { estado: { corte: 1 }, texto: 'Se multiplica por el conjugado sobre sí mismo: eso vale 1.', ecuacion: [{ frac: ['√5 + √3', '√5 + √3'] }, ' = 1'] },
        { estado: { corte: 2 }, texto: 'Abajo queda una suma por diferencia: desaparecen las raíces.', ecuacion: ['(√5 − √3)(√5 + √3) = 5 − 3 = 2'] },
        { estado: { corte: 3 }, texto: 'El resultado tiene el mismo valor que la expresión original.', ecuacion: [{ frac: ['√5 + √3', '2'] }, ` ≈ ${f((Math.sqrt(5) + Math.sqrt(3)) / 2, 3)}`] },
      ],
    },
    regla: {
      texto: 'Racionalizar es multiplicar por una expresión igual a 1 que deja el denominador sin raíces. Con √a − √b se usa su conjugado √a + √b.',
      ecuacion: [{ frac: ['1', ['√', a, ' − √', b]] }, ' = ', { frac: [{ llave: ['√', a, ' + √', b], nota: 'el conjugado', color: 'c-d', arriba: true }, { llave: [a, ' − ', b], nota: 'sin raíces', color: 'c-d' }] }],
      condicion: 'a ≠ b y el denominador no vale cero; el valor de la expresión y sus restricciones no cambian.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        let A, B;
        do { A = r.ent(3, 15); B = r.ent(2, A - 1); } while (esCuad(A) || esCuad(B));
        const K = r.uno([1, 2, 3, 4, 6]), sg = s % 2 ? '+' : '−', inv = sg === '+' ? '−' : '+';
        const Dv = A - B, g = mcd(K, Dv), c = K / g, den = Dv / g;
        const arriba = (signo, coef) => (coef === 1 ? `√${A} ${signo} √${B}` : `${coef}(√${A} ${signo} √${B})`);
        const escribe = (signo, coef, d) => (d === 1 ? arriba(signo, coef) : [{ frac: [arriba(signo, coef), String(d)] }]);
        const orig = K / (Math.sqrt(A) + (sg === '+' ? 1 : -1) * Math.sqrt(B)), fin = c * (Math.sqrt(A) + (inv === '+' ? 1 : -1) * Math.sqrt(B)) / den;
        const tabla = conFin => ({ datos: { columnas: ['expresión', '≈ valor'], filas: [[`${K}/(√${A} ${sg} √${B})`, f(orig, 3)],
          conFin ? [`× (√${A} ${inv} √${B})/(√${A} ${inv} √${B})`, 'por 1'] : ['× ?', ''], conFin ? [{ t: `${c === 1 ? '' : c}(√${A} ${inv} √${B})${den === 1 ? '' : `/${den}`}`, color: 'd', fuerte: true }, { t: f(fin, 3), color: 'd' }] : ['?', '']],
          alt: 'La fracción de partida, el factor que vale 1 y la fracción sin raíces abajo, con su valor decimal' }, estado: {} });
        return {
          enunciado: ['Racionaliza ', { frac: [String(K), `√${A} ${sg} √${B}`] }, '.'],
          dibujo: tabla(false),
          pasos: [
            { tipo: 'pide', texto: 'Piden otra fracción del mismo valor, sin raíces en el denominador.' },
            { tipo: 'datos', texto: `Arriba está ${K}. Abajo hay dos raíces con un signo ${sg} en medio: √${A} ${sg} √${B}.` },
            { tipo: 'regla', texto: `Multiplico arriba y abajo por el conjugado, que cambia el signo del medio a ${inv}. Abajo queda una diferencia de cuadrados, sin raíces.` },
            { tipo: 'cuentas', texto: `Abajo: (√${A} ${sg} √${B})(√${A} ${inv} √${B}) = ${A} − ${B} = ${Dv}.${g > 1 ? ` Después simplifico entre ${g}.` : ''}`,
              ecuacion: [{ frac: [String(K), `√${A} ${sg} √${B}`] }, ' = ', { frac: [arriba(inv, K), String(Dv)] }, ...(g > 1 || den === 1 ? [' = ', ...[].concat(escribe(inv, c, den))] : [])],
              dibujo: tabla(true) },
            { tipo: 'sentido', texto: `Comparo los valores decimales: la de partida vale ≈ ${f(orig, 3)} y la nueva, ≈ ${f(fin, 3)}. Son iguales: solo cambió la forma.` },
          ],
          respuesta: [].concat(escribe(inv, c, den)),
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let A, B;
        do { A = r.ent(3, 15); B = r.ent(2, A - 1); } while (esCuad(A) || esCuad(B));
        const K = r.uno([1, 2, 3, 4, 6]), sg = s % 2 ? '+' : '−', inv = sg === '+' ? '−' : '+';
        const D = A - B, g = mcd(K, D), c = K / g, den = D / g;
        const arriba = (signo, coef) => (coef === 1 ? `√${A} ${signo} √${B}` : `${coef}(√${A} ${signo} √${B})`);
        const escribe = (signo, coef, d) => (d === 1 ? arriba(signo, coef) : [{ frac: [arriba(signo, coef), String(d)] }]);
        const g2 = mcd(K, A + B);
        return {
          pregunta: ['Racionaliza ', { frac: [String(K), `√${A} ${sg} √${B}`] }, '.'],
          opciones: distintas([
            { id: 'c', texto: escribe(inv, c, den), correcta: true },
            { id: 'mismo', texto: escribe(sg, c, den), error: 'TAL-RAC-MISMO', siFuera: `Arriba va el conjugado: el signo cambia a ${inv}.` },
            { id: 'suma', texto: escribe(inv, K / g2, (A + B) / g2), error: 'TAL-RAC-SUMA', siFuera: `Abajo queda ${A} − ${B}, no ${A} + ${B}: es suma por diferencia.` },
            { id: 'sin', texto: escribe(inv, K, 1), error: 'TAL-RAC-DEN', siFuera: `Falta dividir entre ${D}, lo que quedó en el denominador.` },
          ]),
          solucion: { texto: `Se multiplica por el conjugado; abajo queda ${A} − ${B} = ${D}.`, ecuacion: [{ frac: [String(K), `√${A} ${sg} √${B}`] }, ' = ', ...[].concat(escribe(inv, c, den))] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Mesa 1: el rectángulo (x + p)(x + q), con dos tramos distintos; si p = q vuelve el cuadrado de la idea 3.
  const xx = { v: 'c-o', t: 'x' }, pp = { v: 'c-i', t: 'p' }, qq = { v: 'c-d', t: 'q' };
  const rectXPQ = v => ({
    anchos: [{ t: rot('x', v.x), v: v.x, color: 'o' }, { t: rot('p', v.p), v: v.p, color: 'i' }],
    altos: [{ t: 'x', v: v.x, color: 'o' }, { t: rot('q', v.q), v: v.q, color: 'd' }],
    celdas: [[{ t: rot('x²', v.x, v.x * v.x), color: 'o' }, { t: `${v.p * v.x}`, color: 'i' }], [{ t: `${v.q * v.x}`, color: 'd' }, { t: `${v.p * v.q}`, color: 'f' }]],
    total: { t: `x² + ${v.p + v.q}x + ${v.p * v.q} = ${(v.x + v.p) * (v.x + v.q)}` },
    escala: ESC_N,
    alt: `Rectángulo de ${v.x} + ${v.p} por ${v.x} + ${v.q}: x², px, qx y pq suman ${(v.x + v.p) * (v.x + v.q)}`,
  });
  const mesaRect = {
    id: 'rectangulo-x-p-q', titulo: 'El rectángulo (x + p)(x + q)', pieza: 'alg-baldosas',
    consigna: 'Arrastra la esquina de x² para cambiar x y la esquina de afuera para cambiar p y q. ¿Cuándo vuelve a ser un cuadrado?',
    controles: [
      { id: 'x', etiqueta: 'x', min: 1, max: 5, paso: 1, inicio: 4, decimales: 0, color: 'c-o' },
      { id: 'p', etiqueta: 'p', min: 1, max: 3, paso: 1, inicio: 2, decimales: 0, color: 'c-i' },
      { id: 'q', etiqueta: 'q', min: 1, max: 3, paso: 1, inicio: 3, decimales: 0, color: 'c-d' },
    ],
    dibujo: v => ({ datos: rectXPQ(v), estado: {} }),
    lectura: v => [xx, ` = ${v.x}, `, pp, ` = ${v.p}, `, qq, ` = ${v.q}: área ${(v.x + v.p) * (v.x + v.q)}`],
    arrastres: [
      { id: 'esquina-x', etiqueta: 'esquina de la pieza x²', color: 'c-o',
        donde: v => { const g = BALD().geometria(rectXPQ(v)); return { x: g.xs[0][1], y: g.ys[0][1] }; },
        mover: (pt, v) => { const g = BALD().geometria(rectXPQ(v)); return { x: ((pt.x - g.x0) + (pt.y - g.y0)) / 2 / g.esc }; } },
      { id: 'esquina-pq', etiqueta: 'esquina de afuera: p a lo ancho, q a lo alto', color: 'c-i',
        donde: v => { const g = BALD().geometria(rectXPQ(v)); return { x: g.xs[1][1], y: g.ys[1][1] }; },
        mover: (pt, v) => { const g = BALD().geometria(rectXPQ(v)); return { p: (pt.x - g.xs[1][0]) / g.esc, q: (pt.y - g.ys[1][0]) / g.esc }; } },
    ],
    // Retos comprobados (docs/teoria.md §4d): miden las mismas piezas que pinta rectXPQ (x², px, qx y pq).
    invitaciones: [
      { texto: 'Haz que el rectángulo vuelva a ser un cuadrado.',
        logrado: v => v.x + v.p === v.x + v.q,
        bien: 'Con p = q sale (x + p)²: las dos piezas del medio son iguales.' },
      { texto: 'Busca un caso con área total 30.',
        logrado: v => (v.x + v.p) * (v.x + v.q) === 30,
        bien: 'x² + (p + q)x + pq dio 30. ¿Hay otro trío que lo logre?' },
      { texto: 'Haz que las dos piezas del medio juntas midan lo mismo que x².',
        logrado: v => v.p * v.x + v.q * v.x === v.x * v.x,
        bien: 'Pasa cuando x = p + q: el término en x iguala al cuadrado.' },
      { texto: 'Guarda dos casos con el mismo x y el mismo p + q, pero distinto pq.',
        logrado: (v, guardados) => guardados.some(g => g.x === v.x && g.p + g.q === v.p + v.q && g.p * g.q !== v.p * v.q)
          && guardados.some(g => g.x === v.x && g.p === v.p && g.q === v.q),
        bien: 'Las piezas del medio suman igual; solo cambia la de la esquina.' },
    ],
  };
  // Mesa 2: la raíz del cuadrado contra la raíz cúbica del cubo, con x negativo (lo que la idea 2 reserva).
  const ejesIndice = v => ejesRaiz({
    curvas: [{ puntos: [[-6, -6], [6, 6]], color: 'h', discontinua: true, rotulo: 'y = x', en: [4.5, 3] },
      { puntos: VX.map(x => [x, v.k === 2 ? Math.abs(x) : x]), color: 'd', rotulo: v.k === 2 ? 'y = √(x²)' : 'y = ∛(x³)', en: v.k === 2 ? [-6, 6] : [-6, -6] }],
    puntos: [{ x: v.x, y: v.k === 2 ? Math.abs(v.x) : v.x, color: 'o', rotulo: f(v.k === 2 ? Math.abs(v.x) : v.x, 0), guias: true }],
    alt: v.k === 2 ? `Raíz de x al cuadrado: en x = ${v.x} vale ${Math.abs(v.x)}` : `Raíz cúbica de x al cubo: en x = ${v.x} vale ${v.x}`,
  });
  const raizDe = v => (v.k === 2 ? Math.abs(v.x) : v.x);
  const XS_INDICE = Array.from({ length: 13 }, (_, k) => k - 6);
  const mesaIndice = {
    id: 'raiz-de-la-potencia', titulo: 'Índice par contra índice impar', pieza: 'ejes',
    consigna: 'Arrastra el punto por la gráfica, también hacia los negativos. Cambia el índice y compara.',
    controles: [
      { id: 'x', etiqueta: 'x', min: -6, max: 6, paso: 1, inicio: -3, decimales: 0, color: 'c-o' },
      { id: 'k', etiqueta: 'Índice', opciones: [{ valor: 2, texto: '√(x²)' }, { valor: 3, texto: '∛(x³)' }] },
    ],
    dibujo: v => ({ datos: ejesIndice(v), estado: {} }),
    lectura: v => (v.k === 2 ? [{ v: 'c-o', t: 'x' }, ` = ${f(v.x, 0)}   →   √(x²) = ${f(Math.abs(v.x), 0)}`] : [{ v: 'c-o', t: 'x' }, ` = ${f(v.x, 0)}   →   ∛(x³) = ${f(v.x, 0)}`]),
    arrastres: [
      { id: 'punto', etiqueta: 'punto de la gráfica', color: 'c-o',
        donde: v => { const g = EJES().geometria(ejesIndice(v)); return { x: g.X(v.x), y: g.Y(v.k === 2 ? Math.abs(v.x) : v.x) }; },
        mover: (pt, v) => { const g = EJES().geometria(ejesIndice(v)); return { x: inversa(g.X, -6, 6)(pt.x) }; } },
    ],
    invitaciones: [
      { texto: 'Con √(x²), pon el punto en un negativo donde la raíz dé 4.',
        logrado: v => v.k === 2 && v.x < 0 && raizDe(v) === 4,
        bien: '√((−4)²) = 4: el índice par devuelve el valor absoluto.' },
      { texto: 'Haz que ∛(x³) dé un número negativo.',
        logrado: v => v.k === 3 && raizDe(v) < 0,
        bien: 'El índice impar conserva el signo. ¿Y el par?' },
      { texto: 'Con √(x²), busca el punto que más se aleja de la recta y = x.',
        logrado: v => v.k === 2 && raizDe(v) - v.x === Math.max(...XS_INDICE.map(x => raizDe({ k: 2, x }) - x)),
        bien: 'En x = −6 la distancia es 12: la raíz da 6, no −6.' },
      { texto: 'Guarda el mismo x con los dos índices, cuando den resultados distintos.',
        logrado: (v, guardados) => guardados.some(g => g.x === v.x && g.k !== v.k && raizDe(g) !== raizDe(v)) && guardados.some(g => g.x === v.x && g.k === v.k),
        bien: 'Solo los negativos los separan: ahí √(x²) = −x.' },
    ],
  };
  // Mesa 3: la tabla de la idea 1 con exponentes negativos, que la idea solo deja predecir.
  const factoresConSigno = (base, e) => (e >= 0 ? factores(base, e) : `1/(${factores(base, -e)})`);
  const mesaSigno = {
    id: 'exponentes-con-signo', titulo: 'Exponentes con signo', pieza: 'alg-tabla',
    consigna: 'Elige la base y dos exponentes, también negativos. La última fila suma los exponentes: ¿el valor coincide?',
    controles: [
      { id: 'a', etiqueta: 'Base', min: 2, max: 5, paso: 1, inicio: 2, decimales: 0 },
      { id: 'm', etiqueta: 'm', min: -3, max: 3, paso: 1, inicio: 3, decimales: 0, color: 'c-o' },
      { id: 'n', etiqueta: 'n', min: -3, max: 3, paso: 1, inicio: -2, decimales: 0, color: 'c-i' },
    ],
    dibujo: v => ({
      datos: {
        columnas: ['potencia', 'factores', 'valor'],
        filas: [
          [{ t: pot(v.a, v.m), color: 'o', fuerte: true }, factoresConSigno(v.a, v.m), valorPot(v.a, v.m)],
          [{ t: pot(v.a, v.n), color: 'i', fuerte: true }, factoresConSigno(v.a, v.n), valorPot(v.a, v.n)],
          [{ t: pot(v.a, v.m + v.n), color: 'd', fuerte: true }, `${f(v.m, 0)} + (${f(v.n, 0)}) = ${f(v.m + v.n, 0)}`, { t: valorPot(v.a, v.m + v.n), color: 'd', fuerte: true }],
        ],
        alt: `${v.a} elevado a ${v.m} por ${v.a} elevado a ${v.n} es ${v.a} elevado a ${v.m + v.n}, que vale ${valorPot(v.a, v.m + v.n)}`,
      }, estado: {},
    }),
    lectura: v => [`${pot(v.a, v.m)} · ${pot(v.a, v.n)} = ${pot(v.a, v.m + v.n)} = ${valorPot(v.a, v.m + v.n)}`],
    invitaciones: [
      { texto: 'Consigue que el producto valga 1, sin que m ni n sean 0.',
        logrado: v => v.m !== 0 && Math.pow(v.a, v.m) * Math.pow(v.a, v.n) === 1,
        bien: 'Exponentes opuestos se anulan: la suma da 0 y a⁰ = 1.' },
      { texto: 'Busca el producto más pequeño de toda la mesa.',
        logrado: v => Math.pow(v.a, v.m + v.n) === Math.min(...[2, 3, 4, 5].map(a => Math.pow(a, -6))),
        bien: 'Base grande y exponente muy negativo: 1/5⁶, casi nada.' },
      { texto: 'Con m y n de distinto signo, haz que el producto sea menor que 1.',
        logrado: v => v.m * v.n < 0 && Math.pow(v.a, v.m + v.n) < 1,
        bien: 'Gana el exponente negativo: el resultado queda bajo la raya de fracción.' },
      { texto: 'Guarda dos casos con la misma base y el mismo valor, pero distinto m.',
        logrado: (v, guardados) => guardados.some(g => g.a === v.a && g.m !== v.m && g.m + g.n === v.m + v.n) && guardados.some(g => g.a === v.a && g.m === v.m && g.n === v.n),
        bien: 'Solo importa la suma m + n: muchas parejas dan la misma.' },
    ],
  };

  // ---------- El cubo que se abre (laboratorio 3D, 15 nov: exploración libre, sin predicciones) ----------
  // Las ocho piezas y sus volúmenes los arma plantillas/cuadrado-crece/motor.js (piezasCubo) a través de la pieza
  // alg-cubo-3d: los retos miden lo mismo que se dibuja (regla 1). abrir es el control de tiempo: nada se anima solo.
  const CUBO3 = () => Kit.piezas['alg-cubo-3d'];
  const cuentaCubo = v => CUBO3().cuenta(v);
  const vol = (v, k) => cuentaCubo(v).tipos[k].volumen;
  const mesaCubo = {
    id: 'cubo-se-abre', titulo: 'El cubo que se abre', pieza: 'alg-cubo-3d',
    consigna: 'Gira el cubo con el dedo y ábrelo. Cambia a y b: mira qué piezas crecen entre las dos esquinas.',
    controles: [
      { id: 'a', etiqueta: 'a', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0, color: 'c-o' },
      { id: 'b', etiqueta: 'b', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0, color: 'c-i' },
      { id: 'abrir', etiqueta: 'Abrir', min: 0, max: 1, paso: 0.25, inicio: 0, decimales: 2 },
    ],
    dibujo: v => ({ datos: { a: v.a, b: v.b, abrir: v.abrir }, estado: {} }),
    lectura: v => {
      const c = cuentaCubo(v), t = c.tipos;
      return [`(a + b)³ = ${f(c.suma)}: `, { v: 'c-o', t: f(t.a3.volumen) }, ' + ', { v: 'c-d', t: f(3 * t.a2b.volumen) }, ' + ',
        { v: 'c-f', t: f(3 * t.ab2.volumen) }, ' + ', { v: 'c-i', t: f(t.b3.volumen) }];
    },
    invitaciones: [
      { texto: 'Abre el cubo: logra que a³ y b³ juntos superen a las seis del medio.',
        logrado: v => v.abrir >= 0.5 && vol(v, 'a3') + vol(v, 'b3') > 3 * (vol(v, 'a2b') + vol(v, 'ab2')),
        bien: 'Pasa solo con a mucho mayor que b. Casi siempre, el medio pesa más.',
        pista: 'Creo que conviene un a grande y un b chico. Ábrelo y compara.' },
      { texto: 'Haz que las seis piezas del medio sean iguales entre sí.',
        logrado: v => vol(v, 'a2b') === vol(v, 'ab2'),
        bien: 'Con a = b, cada pieza del medio mide lo mismo que a³.',
        pista: 'a²b y ab² cambian una letra por otra. ¿Cuándo da igual?' },
      { texto: 'Arma un cubo de volumen 125 y ábrelo del todo.',
        logrado: v => cuentaCubo(v).suma === 125 && v.abrir === 1,
        bien: 'Arista 5: el volumen sale de a + b, no de a³ + b³.',
        pista: '125 = 5 · 5 · 5. ¿Cuánto debe sumar a + b?' },
      { texto: 'Consigue que una sola pieza ab² mida 18.',
        logrado: v => vol(v, 'ab2') === 18,
        bien: '2 · 3 · 3 = 18: dos lados miden b y uno mide a.',
        pista: 'Toca una pieza ab²: dos de sus lados miden b.' },
      { texto: 'Guarda dos cubos con la misma arista y distinto a³ + b³.',
        logrado: (v, guardados) => guardados.some(x => guardados.some(y => x.a + x.b === y.a + y.b
          && vol(x, 'a3') + vol(x, 'b3') !== vol(y, 'a3') + vol(y, 'b3'))),
        bien: 'El total no cambió; las esquinas y el medio se repartieron distinto.' },
    ],
  };

  return {
    unidad: 'algebra.exponentes-y-productos-notables',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/alg-tabla.js', '/nucleo/kit/piezas/alg-baldosas.js', '/nucleo/kit/piezas/ejes.js', '/plantillas/cuadrado-crece/motor.js', '/nucleo/kit/piezas/alg-cubo-3d.js'],
    historia: {
      texto: 'En La Géométrie, de 1637, Descartes mostró que los problemas de figuras podían escribirse y resolverse con relaciones algebraicas. No inventó cada identidad escolar: su obra continuó una tradición. Aquí las potencias y los productos notables traducen figuras en expresiones, con una salvedad: una partición de áreas explica una igualdad para lados positivos, y extenderla a negativos pide razones algebraicas.',
      pregunta: '¿Una figura demuestra una igualdad para todos los números?',
      fuente: { titulo: 'O’Connor y Robertson, René Descartes — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Descartes/' },
    },
    laboratorio: [mesaCubo, mesaRect, mesaIndice, mesaSigno],
    // Glosario por tema (docs/teoria.md §4d): las palabras que esta unidad estrena en álgebra.
    glosario: [
      { termino: 'potencia', simbolo: 'aⁿ', def: 'Producto de un número por sí mismo varias veces: 2⁴ = 2 · 2 · 2 · 2 = 16.',
        ver: ['base', 'exponente'] },
      { termino: 'base', def: 'El número que se repite como factor; en aⁿ es la a.', ejemplo: 'En 5³ es el 5: 5 · 5 · 5 = 125.', ver: ['exponente'] },
      { termino: 'exponente', def: 'El número pequeño de arriba en aⁿ: cuántas veces se multiplica la a. Si es negativo, indica dividir.',
        ejemplo: '2⁻³ = 1/2³ = 1/8.', ver: ['base', 'potencia'] },
      { termino: 'radical', simbolo: '√', def: 'Expresión con el signo √ que pide una raíz: el número que, elevado al índice, da lo de adentro.',
        ver: ['índice', 'radicando'] },
      { termino: 'índice', def: 'Número chico en el signo √ que dice qué raíz se saca: 2 la cuadrada, 3 la cúbica.',
        ejemplo: '∛8 = 2, porque 2³ = 8.', ver: ['radical'] },
      { termino: 'radicando', def: 'Lo que está debajo del signo √.', ejemplo: 'En √(x + 9), es x + 9.', ver: ['radical'] },
      { termino: 'producto notable', formas: ['producto notable', 'productos notables'],
        def: 'Multiplicación tan frecuente que su resultado se escribe de memoria, sin hacer toda la cuenta.',
        ejemplo: '(a + b)² = a² + 2ab + b².', ver: ['diferencia de cuadrados', 'identidad'] },
      { termino: 'diferencia de cuadrados', formas: ['diferencia de cuadrados', 'diferencias de cuadrados'],
        def: 'La resta a² − b²; sale de multiplicar la suma por la diferencia: (a + b)(a − b).',
        ejemplo: '7² − 3² = (7 + 3)(7 − 3) = 40.', ver: ['producto notable'] },
      { termino: 'arista', formas: ['arista', 'aristas'], def: 'Cada borde recto de un cubo o de una caja, donde se juntan dos caras.',
        ejemplo: 'Un cubo de arista 3 tiene volumen 3³ = 27.', ver: ['volumen'] },
      { termino: 'volumen', formas: ['volumen', 'volúmenes'], def: 'Cuánto espacio ocupa un cuerpo: en una caja, largo por ancho por alto.',
        ejemplo: 'Una caja de 2 por 1 por 1 tiene volumen 2.', ver: ['arista'] },
      { termino: 'área', formas: ['área', 'áreas'], def: 'Cuánta superficie cubre una figura plana: en un rectángulo, largo por ancho.',
        ejemplo: 'Un cuadrado de 20 m de lado tiene 400 m² de área.', ver: ['volumen'] },
      { termino: 'identidad', def: 'Igualdad que se cumple con cualquier valor de las letras, no solo con algunos.',
        ejemplo: '(a + b)² = a² + 2ab + b² vale para todo a y b.' },
      { termino: 'distributiva', formas: ['distributiva', 'distributividad'], def: 'Propiedad que reparte un producto sobre una suma: a(b + c) = ab + ac.',
        ejemplo: '3(x + 2) = 3x + 6.' },
      { termino: 'radical doble', formas: ['radical doble', 'radicales dobles'], def: 'Una raíz con otra raíz adentro, de la forma √(A ± 2√B).',
        ejemplo: '√(5 + 2√6) = √3 + √2, porque 3 + 2 = 5 y 3 · 2 = 6.', ver: ['radical'] },
      { termino: 'denominador', def: 'El número de abajo en una fracción: entre cuánto se divide.', ejemplo: 'En 3/4 es el 4.' },
      { termino: 'racionalizar', formas: ['racionalizar', 'racionaliza', 'racionalización'],
        def: 'Cambiar una fracción por otra de igual valor cuyo denominador ya no tenga raíces.',
        ejemplo: '1/√2 = √2/2.', ver: ['conjugado', 'denominador'] },
      { termino: 'conjugado', formas: ['conjugado', 'conjugados', 'conjugada'],
        def: 'La misma pareja de términos con el signo del medio cambiado: √a − √b y √a + √b.',
        ejemplo: '(√5 − √3)(√5 + √3) = 5 − 3 = 2.', ver: ['racionalizar', 'diferencia de cuadrados'] },
    ],
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'cubo-se-abre': ['cuadrado-suma'],
      'rectangulo-x-p-q': ['cuadrado-suma'],
      'raiz-de-la-potencia': ['radicales'],
      'exponentes-con-signo': ['leyes-exponentes'],
    },
    ideas: [leyes, radicales, notables, dobles, racionalizar],
  };
});
