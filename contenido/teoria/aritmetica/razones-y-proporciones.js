/*
 * Teoría de «Razones y proporciones» (aritmetica.razones-y-proporciones). Molde: docs/teoria.md.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 3) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: AR6, AR7 y AR14 de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: distinguir comparar restando de comparar dividiendo, y usar la que conserva lo que el problema conserva.
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de gama baja de 360 px, en el aula o en la combi, sin audio.
 *   Resultado observable: resuelve razones con suma o diferencia, cuarta y media proporcional, medias y series de razones.
 *   Orden de atención: 1.º las tiras a la misma escala · 2.º las partes iguales de cada tira · acción: el botón fijo de abajo.
 *   Estados: juego sin tocar · casos probados · predicción elegida · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «si 4 es a 6, ¿por qué 6 no es a 8?».
 * Colores (regla 4): antecedente a naranja (c-o), consecuente b turquesa (c-i), constante k verde (c-d); en las medias,
 * la aritmética A rojo (c-h) y la geométrica G verde (c-d), la armónica H en tinta.
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const a = { v: 'c-o', t: 'a' }, b = { v: 'c-i', t: 'b' }, k = { v: 'c-d', t: 'k' };
  const c = { v: 'c-o', t: 'c' }, d = { v: 'c-i', t: 'd' };
  const A = { v: 'c-h', t: 'A' }, G = { v: 'c-d', t: 'G' };
  const mcd = (x, y) => (y ? mcd(y, x % y) : Math.abs(x));
  const razon = (x, y) => { const g = mcd(x, y) || 1; return `${f(x / g)}/${f(y / g)}`; };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const r = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const x of distractores) {
      const txt = fmt(x.valor);
      if (vistos.has(txt) || !Number.isFinite(x.valor) || x.valor < 0) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }
  // Una tira de n partes iguales de tamaño u (las partes se cuentan; el largo es n·u a la escala común).
  // Gesto directo (docs/teoria.md §4b): las manijas viven en el viewBox de arit-tiras; geometria(datos).x y deX
  // convierten entre valor y px con la misma escala común que dibuja la pieza.
  const TIRAS = () => Kit.piezas['arit-tiras'];
  // La manija va en el borde de abajo del fin de la tira: así no tapa el rótulo final, que va a media altura.
  const finTira = (datos, k, valor) => { const g = TIRAS().geometria(datos); return { x: g.x(valor), y: g.tiraY(k) + g.altoTira }; };
  const valorEn = (datos, px) => TIRAS().geometria(datos).deX(px);
  const tira = (rotulo, color, n, u, o = {}) => Object.assign({ rotulo, color, fin: o.fin, paso: o.paso, tramos: [{ valor: n * u, color, partes: n, texto: o.texto }] }, o.extra || {});

  // ---------- Idea 1: restar o dividir, dos comparaciones distintas ----------
  // Cambia: las dos tiras se estiran (×k) o se alargan (+s). Permanece: la escala común de 30 unidades.
  // Progresa: qué comparación sobrevive a cada cambio. Se reserva: el Sr. Alto, donde la diferencia no sirve.
  // Debe verse: al multiplicar, la razón queda igual y la diferencia crece.
  const tirasComparar = v => {
    const x = 3 * v.k + v.s, y = 5 * v.k + v.s;
    return { max: 26, regla: { paso: 1, cada: 5 }, filas: 2, tiras: [tira('a', 'o', x, 1, { fin: f(x) }), tira('b', 'i', y, 1, { fin: f(y) })] };
  };
  const comparar = {
    id: 'restar-dividir',
    titulo: 'Restar o dividir: dos comparaciones',
    temas: ['Razón aritmética y geométrica'],
    pieza: 'arit-tiras',
    // Lee (fase 2): vocabulario y contexto, sin adelantar qué comparación se conserva (eso lo descubre en Predice).
    lee: {
      tarjetas: [
        { titulo: 'Comparar dos cantidades', texto: 'Ana tiene 12 años y su hermano, 4. Puedes compararlos de dos maneras: «Ana le lleva 8 años» o «Ana tiene el triple de edad».' },
        { titulo: 'Dos nombres', texto: 'Comparar restando da una razón aritmética: 12 − 4 = 8. Comparar dividiendo da una razón geométrica: 12 : 4 = 3. Si no se dice cuál, es la que divide.' },
        { titulo: 'Cómo se lee', texto: ['La razón ', a, ' : ', b, ' se lee «', a, ' es a ', b, '». Si ', a, ' y ', b, ' están en razón 3 a 5, ', a, ' tiene 3 partes iguales y ', b, ', 5 de esas partes.'],
          ecuacion: [a, ' = 3', k, '   ·   ', b, ' = 5', k] },
      ],
    },
    juega: {
      consigna: 'Las tiras a y b empiezan en 3 y 5. Estíralas multiplicando o agrégales lo mismo a las dos. Mira qué comparación se mantiene.',
      voz: 'Prueba solo multiplicar, y luego solo sumar.',
      controles: [
        { id: 'k', etiqueta: 'Multiplica ×', color: 'c-d', min: 1, max: 4, paso: 1, inicio: 1, decimales: 0 },
        { id: 's', etiqueta: 'Suma +', min: 0, max: 6, paso: 1, inicio: 0, decimales: 0 },
      ],
      dibujo: v => ({ datos: tirasComparar(v), estado: {} }),
      lectura: v => { const x = 3 * v.k + v.s, y = 5 * v.k + v.s; return [b, ' − ', a, ` = ${f(y - x)}`, '   ·   ', a, ' : ', b, ` = ${razon(x, y)}`]; },
      minimo: 3,
      // El fin de b estira las dos tiras ×k (b = 5k + s); el fin de a les suma lo mismo a las dos (a = 3k + s).
      arrastres: [
        { id: 'fin-b', etiqueta: 'fin de la tira b: multiplica las dos', color: 'c-d',
          donde: v => finTira(tirasComparar(v), 1, 5 * v.k + v.s),
          mover: (pt, v) => ({ k: (valorEn(tirasComparar(v), pt.x) - v.s) / 5 }) },
        { id: 'fin-a', etiqueta: 'fin de la tira a: suma lo mismo a las dos',
          donde: v => finTira(tirasComparar(v), 0, 3 * v.k + v.s),
          mover: (pt, v) => ({ s: valorEn(tirasComparar(v), pt.x) - 3 * v.k }) },
      ],
    },
    predice: {
      pregunta: 'El Sr. Bajo mide 4 botones o 6 clips. El Sr. Alto mide 6 botones. ¿Cuántos clips mide el Sr. Alto?',
      opciones: [
        { id: 'c', texto: '9 clips', correcta: true },
        { id: 'resta', texto: '8 clips', error: 'AR6', siFuera: 'Sería cierto si se conservara la diferencia de 2. Se conserva la razón: 1 botón = 1,5 clips.' },
        { id: 'doble', texto: '12 clips', error: 'AR7', siFuera: 'Sería cierto si el Sr. Alto midiera el doble del Bajo. Mide 6 botones, no 8.' },
        { id: 'invierte', texto: '4 clips', error: 'AT-INVIERTE', siFuera: 'Eso usa la razón al revés: el clip es más chico, así que caben más clips.' },
      ],
      dibujo: { datos: { max: 9, filas: 4, tiras: [tira('Bajo en botones', 'o', 4, 1.5), tira('Bajo en clips', 'i', 6, 1), tira('Alto en botones', 'o', 6, 1.5)] }, estado: {} },
      revelar: { datos: { max: 9, filas: 4, tiras: [tira('Bajo en botones', 'o', 4, 1.5), tira('Bajo en clips', 'i', 6, 1), tira('Alto en botones', 'o', 6, 1.5), tira('Alto en clips', 'i', 9, 1, { fin: '9' })] }, estado: {} },
      coincide: 'Coincide: cada botón mide lo mismo que 1,5 clips, en los dos señores.',
    },
    // Hallazgo 9: «Mira» usa las mismas tiras a una escala común que el juego (arit-tiras); cambia el caso, no la
    // representación: las tiras de botones y clips son el par a, b del juego con unidades distintas.
    mira: {
      datos: { max: 9, filas: 4, tiras: [tira('Bajo en botones', 'o', 4, 1.5), tira('Bajo en clips', 'i', 6, 1), tira('Alto en botones', 'o', 6, 1.5, { paso: 2 }), tira('Alto en clips', 'i', 9, 1, { paso: 3, fin: '9' })] },
      pasos: [
        { estado: { paso: 1 }, texto: 'El Sr. Bajo mide lo mismo en botones que en clips.', ecuacion: ['4 botones = 6 clips'] },
        { estado: { paso: 1 }, texto: 'Un botón mide un clip y medio: es una razón.', ecuacion: [{ frac: ['6', '4'] }, ' = 1,5 clips por botón'] },
        { estado: { paso: 2 }, texto: 'El Sr. Alto mide 6 botones.', ecuacion: ['6 botones'] },
        { estado: { paso: 3 }, texto: 'Cada botón vale 1,5 clips: 6 por 1,5.', ecuacion: ['6 · 1,5 = 9 clips'] },
      ],
    },
    regla: {
      texto: 'La razón aritmética compara restando; la razón geométrica, dividiendo. Multiplicar las dos cantidades conserva la geométrica; sumarles lo mismo conserva la aritmética.',
      ecuacion: [{ llave: [a, ' − ', b], nota: 'aritmética' }, '   ·   ', { llave: [{ frac: [a, b] }], nota: 'geométrica' }, ' = ', k],
      condicion: 'b no es cero. «a y b están en razón 3 a 5» quiere decir a = 3k y b = 5k.',
    },
    // Así se resuelve (fase 2): el mismo tipo de problema de «Ahora tú», con otras semillas, resuelto paso a paso.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), m = r.ent(1, 5), n = m + r.ent(1, 4), kk = r.ent(2, 9);
        const x = m * kk, y = n * kk, suma = s % 2 === 0, dato = suma ? x + y : y - x, partes = suma ? m + n : n - m;
        const tiras = conValor => ({ datos: { max: y, filas: 2, tiras: [tira('a', 'o', m, kk, conValor ? { texto: f(kk), fin: f(x) } : {}), tira('b', 'i', n, kk, conValor ? { texto: f(kk), fin: f(y) } : {})] }, estado: {} });
        return {
          enunciado: ['Dos números ', a, ' y ', b, ` están en razón ${m} a ${n}, y su ${suma ? 'suma' : 'diferencia'} es ${f(dato)}. ¿Cuánto vale `, b, '?'],
          dibujo: tiras(false),
          pasos: [
            { tipo: 'pide', texto: ['Piden ', b, `, el número que tiene ${n} partes.`] },
            { tipo: 'datos', texto: ['La razón es ', `${m} a ${n}`, ` y la ${suma ? 'suma' : 'diferencia'} es ${f(dato)}.`], ecuacion: [a, ' : ', b, ` = ${m} : ${n}`] },
            { tipo: 'regla', texto: [`Razón ${m} a ${n} quiere decir que `, a, ` tiene ${m} partes iguales y `, b, `, ${n}. Cada parte vale `, k, '.'], ecuacion: [a, ` = ${m}`, k, '   ·   ', b, ` = ${n}`, k] },
            { tipo: 'cuentas', texto: [`La ${suma ? 'suma' : 'diferencia'} tiene ${partes} ${partes === 1 ? 'parte' : 'partes'}. Se halla `, k, ' y después ', b, '.'],
              ecuacion: [k, ` = ${f(dato)} ÷ ${partes} = ${f(kk)}   →   `, b, ` = ${n} · ${f(kk)} = ${f(y)}`], dibujo: tiras(true) },
            { tipo: 'sentido', texto: ['Comprueba: ', a, ` = ${m} · ${f(kk)} = ${f(x)}, y ${suma ? `${f(x)} + ${f(y)}` : `${f(y)} − ${f(x)}`} = ${f(dato)}. Cuadra.`] },
          ],
          respuesta: [b, ` = ${f(y)}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), m = r.ent(1, 5), n = m + r.ent(1, 4), kk = r.ent(2, 9);
        const x = m * kk, y = n * kk, suma = s % 2 === 0;
        const dato = suma ? x + y : y - x;
        const partes = (rot, col, cuantas) => ({ rotulo: rot, color: col, fin: f(cuantas * kk), tramos: Array.from({ length: cuantas }, () => ({ valor: kk, color: col, texto: f(kk) })) });
        const datos = { max: y, filas: 2, tiras: [partes('a', 'o', m), partes('b', 'i', n)] };
        return {
          pregunta: ['Dos números ', a, ' y ', b, ` están en razón ${m} a ${n}. Su ${suma ? 'suma' : 'diferencia'} es ${f(dato)}. ¿Cuánto vale `, b, '?'],
          opciones: opciones(y, [
            { id: 'a', valor: x, error: 'AT-CUAL', siFuera: 'Ese es a, el número menor.' },
            { id: 'k', valor: kk, error: 'AT-CONSTANTE', siFuera: 'Ese es el valor de cada parte, k; b tiene varias partes.' },
            { id: 'sin-k', valor: suma ? dato * n / (n - m) : dato * n / (m + n), error: 'AT-PARTES', siFuera: `Eso reparte entre ${suma ? n - m : m + n} partes; ${suma ? 'la suma tiene' : 'la diferencia tiene'} ${suma ? m + n : n - m}.` },
            { id: 'resta', valor: suma ? dato - n : dato + n, error: 'AR6', siFuera: 'Eso trata la razón como una resta.' },
          ], n2 => f(n2)),
          solucion: {
            texto: `${suma ? 'La suma' : 'La diferencia'} son ${suma ? m + n : n - m} partes iguales de ${f(kk)}.`,
            ecuacion: [k, ` = ${f(dato)} ÷ ${suma ? m + n : n - m} = ${f(kk)} → `, b, ` = ${n} · ${f(kk)} = ${f(y)}`],
            dibujo: { datos, estado: {} },
          },
          dibujo: { datos: { max: y, filas: 2, tiras: [tira('a', 'o', m, kk), tira('b', 'i', n, kk)] }, estado: {} },
        };
      },
    },
  };

  // ---------- Idea 2: proporción, productos cruzados; continua si se repite el medio ----------
  // Cambia: las tiras c y d como k veces a y b. Permanece: el par a, b y la escala.
  // Progresa: de proporción discreta (cuatro términos) a continua (medio repetido). Se reserva: x² = 36 en el caso continuo.
  // Debe verse: a·d y b·c dan el mismo número.
  const tirasProporcion = v => ({ max: 24, filas: 4, regla: { paso: 1, cada: 4 }, tiras: [tira('a', 'o', v.a, 1, { fin: f(v.a) }), tira('b', 'i', v.b, 1, { fin: f(v.b) }), tira('c', 'o', v.a * v.k, 1, { fin: f(v.a * v.k) }), tira('d', 'i', v.b * v.k, 1, { fin: f(v.b * v.k) })] });
  const proporcion = {
    id: 'proporcion',
    titulo: 'Proporción: los productos cruzados',
    lee: {
      tarjetas: [
        { titulo: 'Dos razones iguales', texto: '2 : 3 y 4 : 6 comparan igual: la segunda es la primera con números más grandes. Cuando dos razones son iguales, forman una proporción.',
          ecuacion: [{ frac: ['2', '3'] }, ' = ', { frac: ['4', '6'] }] },
        { titulo: 'Extremos y medios', texto: ['En ', a, ' : ', b, ' = ', c, ' : ', d, ', los de las puntas son los extremos: ', a, ' y ', d, '. Los del centro son los medios: ', b, ' y ', c, '.'] },
        { titulo: 'Cuando se repite', texto: 'A veces el mismo número está en los dos medios, como en 2 : 4 = 4 : 8. Esa proporción se llama continua. Juega y mira qué tienen de especial.' },
      ],
    },
    temas: ['Proporciones discretas y continuas'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Elige a y b, y el factor k que lleva a hasta c y b hasta d. Compara a · d con b · c.',
      voz: 'Comprueba los dos productos en cada caso.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 1, max: 6, paso: 1, inicio: 2, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 1, max: 6, paso: 1, inicio: 3, decimales: 0 },
        { id: 'k', etiqueta: 'k', color: 'c-d', min: 2, max: 4, paso: 1, inicio: 2, decimales: 0 },
      ],
      dibujo: v => ({ datos: tirasProporcion(v), estado: {} }),
      lectura: v => [a, ' · ', d, ` = ${f(v.a * v.b * v.k)}`, '   ·   ', b, ' · ', c, ` = ${f(v.a * v.b * v.k)}`],
      minimo: 3,
      // Se arrastran el fin de a, el de b y el de c (que fija k = c ÷ a); d sigue a b con el mismo k.
      arrastres: [
        { id: 'fin-a', etiqueta: 'fin de la tira a', color: 'c-o',
          donde: v => finTira(tirasProporcion(v), 0, v.a),
          mover: (pt, v) => ({ a: valorEn(tirasProporcion(v), pt.x) }) },
        { id: 'fin-b', etiqueta: 'fin de la tira b', color: 'c-i',
          donde: v => finTira(tirasProporcion(v), 1, v.b),
          mover: (pt, v) => ({ b: valorEn(tirasProporcion(v), pt.x) }) },
        { id: 'fin-c', etiqueta: 'fin de la tira c: fija k', color: 'c-d',
          donde: v => finTira(tirasProporcion(v), 2, v.a * v.k),
          mover: (pt, v) => ({ k: valorEn(tirasProporcion(v), pt.x) / v.a }) },
      ],
    },
    predice: {
      pregunta: ['En la proporción continua ', { frac: ['4', 'x'] }, ' = ', { frac: ['x', '9'] }, ', ¿cuánto vale x?'],
      opciones: [
        { id: 'c', texto: '6', correcta: true },
        { id: 'media', texto: '6,5', error: 'AT-MEDIA', siFuera: '6,5 es el promedio de 4 y 9: sería cierto si fueran diferencias iguales, no razones.' },
        { id: 'producto', texto: '36', error: 'AT-PRODUCTO', siFuera: '36 es x · x; falta sacar la raíz.' },
        { id: 'suma', texto: '13', error: 'AR6', siFuera: '13 suma los extremos; la proporción iguala cocientes.' },
      ],
      dibujo: { datos: { max: 9, filas: 3, tiras: [tira('4', 'o', 4, 1), tira('x', 'i', 0.0001, 1, { extra: { tramos: [{ valor: 9, hueco: true }] } }), tira('9', 'o', 9, 1)] }, estado: {} },
      revelar: { datos: { max: 9, filas: 3, tiras: [tira('4', 'o', 4, 1), tira('x = 6', 'i', 6, 1), tira('9', 'o', 9, 1)] }, estado: {} },
      coincide: 'Coincide: 4 · 9 = 36 y 6 · 6 = 36.',
    },
    // Hallazgo 9: las mismas tiras del juego; en la continua, b y c son la misma tira (x), por eso hay tres.
    mira: {
      datos: { max: 9, filas: 3, tiras: [tira('4', 'o', 4, 1), tira('x = 6', 'i', 6, 1, { paso: 3 }), tira('9', 'o', 9, 1)] },
      pasos: [
        { estado: { paso: 1 }, texto: 'En una proporción, los productos cruzados son iguales.', ecuacion: [{ frac: ['4', 'x'] }, ' = ', { frac: ['x', '9'] }, ' ⇔ 4 · 9 = x · x'] },
        { estado: { paso: 2 }, texto: 'Aquí el medio se repite: x por x es 36.', ecuacion: [{ sup: ['x', '2'] }, ' = 36'] },
        { estado: { paso: 3 }, texto: 'x es el número positivo que multiplicado por sí mismo da 36.', ecuacion: ['x = √36 = 6'] },
      ],
    },
    regla: {
      texto: 'Una proporción iguala dos razones: sus productos cruzados son iguales. Es continua si los dos medios son el mismo número; si no, es discreta y d es la cuarta proporcional.',
      ecuacion: [{ frac: [a, b] }, ' = ', { frac: [c, d] }, ' ⇔ ', { llave: [a, ' · ', d], nota: 'extremos' }, ' = ', { llave: [b, ' · ', c], nota: 'medios' }, '   ·   ', 'continua: ', { sup: [b, '2'] }, ' = ', a, ' · ', d],
      condicion: 'b y d no son cero. En la continua a : b = b : d, b es media proporcional y d, tercera proporcional.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        let x = r.ent(2, 9), y = r.ent(2, 9); const kk = r.ent(2, 5);
        if (x === y) y = x === 9 ? 2 : x + 1;
        const cc = x * kk, dd = y * kk;
        return {
          enunciado: ['Halla la cuarta proporcional: ', { frac: [String(x), String(y)] }, ' = ', { frac: [String(cc), d] }, '. ¿Cuánto vale ', d, '?'],
          pasos: [
            { tipo: 'pide', texto: ['Piden ', d, ', el cuarto término de la proporción.'] },
            { tipo: 'datos', texto: `Conozco tres términos: ${x} y ${y} en la primera razón, y ${cc} arriba en la segunda.` },
            { tipo: 'regla', texto: 'En una proporción, el producto de los extremos es igual al producto de los medios: se multiplica en cruz.',
              ecuacion: [{ frac: [a, b] }, ' = ', { frac: [c, d] }, ' ⇔ ', a, ' · ', d, ' = ', b, ' · ', c] },
            { tipo: 'cuentas', texto: ['Multiplico en cruz y despejo ', d, '.'], ecuacion: [`${x} · `, d, ` = ${y} · ${cc} = ${f(y * cc)}   →   `, d, ` = ${f(y * cc)} ÷ ${x} = ${f(dd)}`] },
            { tipo: 'sentido', texto: `Comprueba con cocientes: ${cc} ÷ ${f(dd)} da lo mismo que ${x} ÷ ${y}. Las dos razones son iguales.` },
          ],
          respuesta: [d, ` = ${f(dd)}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        if (s % 2 === 0) {     // cuarta proporcional (discreta)
          const x = r.ent(2, 9), y = r.ent(2, 9), kk = r.ent(2, 5);
          if (x === y) return this.generar(s + 1000);
          const cc = x * kk, dd = y * kk;
          return {
            pregunta: ['Halla la cuarta proporcional: ', { frac: [String(x), String(y)] }, ' = ', { frac: [String(cc), 'd'] }, '. ¿Cuánto vale d?'],
            opciones: opciones(dd, [
              { id: 'resta', valor: cc + (y - x), error: 'AR6', siFuera: 'Eso conserva la diferencia; la proporción conserva el cociente.' },
              { id: 'invierte', valor: x * cc / y, error: 'AT-INVIERTE', siFuera: 'Eso cruza los productos al revés.' },
              { id: 'producto', valor: y * cc, error: 'AT-PRODUCTO', siFuera: `Falta dividir entre ${x}.` },
            ], f),
            solucion: { texto: 'Los productos cruzados son iguales.', ecuacion: [`${x} · d = ${y} · ${cc} → d = ${f(dd)}`] },
          };
        }
        const m = r.ent(1, 4), n = r.ent(m + 1, 6), u = r.ent(1, 3);   // continua: m²u : m n u = m n u : n² u
        const x = m * m * u, z = n * n * u, med = m * n * u;
        return {
          pregunta: ['Halla la media proporcional de ', `${f(x)} y ${f(z)}: `, { frac: [f(x), 'b'] }, ' = ', { frac: ['b', f(z)] }, '. ¿Cuánto vale b?'],
          opciones: opciones(med, [
            { id: 'media', valor: (x + z) / 2, error: 'AT-MEDIA', siFuera: 'Ese es el promedio; aquí se igualan cocientes, no diferencias.' },
            { id: 'producto', valor: x * z, error: 'AT-PRODUCTO', siFuera: 'Ese es b · b; falta la raíz.' },
            { id: 'suma', valor: x + z, error: 'AR6', siFuera: 'Eso suma los extremos.' },
          ], f),
          solucion: { texto: 'El medio por sí mismo es el producto de los extremos.', ecuacion: [{ sup: ['b', '2'] }, ` = ${f(x)} · ${f(z)} = ${f(x * z)} → b = ${f(med)}`] },
        };
      },
    },
  };

  // ---------- Idea 3: tres medias; elegir según qué se suma ----------
  // Cambia: a y b, con A, G y H sobre la recta. Permanece: el orden H ≤ G ≤ A.
  // Progresa: A, luego G, luego H. Se reserva: la ida y vuelta, donde la media correcta es H.
  // Debe verse: H a la izquierda del promedio cuando los tramos tienen la misma distancia.
  const mediasDe = (x, y) => ({ A: (x + y) / 2, G: Math.sqrt(x * y), H: 2 * x * y / (x + y) });
  const rectaMedias = (x, y, extra = {}) => {
    const { A: Av, G: Gv, H: Hv } = mediasDe(x, y);
    return Object.assign({
      min: Math.floor(Math.min(x, y) - 1), max: Math.ceil(Math.max(x, y) + 1), paso: 1, cada: 2, decimales: 2, filas: 3, variable: 'valor',
      elementos: [
        { tipo: 'punto', x, color: 'o', rotulo: f(x), fila: 0 },
        { tipo: 'punto', x: y, color: 'i', rotulo: f(y), fila: 0 },
        { tipo: 'punto', x: Av, color: 'h', rotulo: `A = ${f(Av)}`, fila: 3, desde: extra.dA || 0 },
        { tipo: 'punto', x: Gv, color: 'd', rotulo: `G = ${f(Gv)}`, fila: 2, desde: extra.dG || 0 },
        { tipo: 'punto', x: Hv, rotulo: `H = ${f(Hv)}`, fila: 1, desde: extra.dH || 0 },
      ],
    }, extra.datos || {});
  };
  const RECTA = () => Kit.piezas.recta;
  const inversa = (escala, p, q) => px => p + (px - escala(p)) * (q - p) / (escala(q) - escala(p));
  const puntoRecta = (datos, v) => { const g = RECTA().geometria(datos); return { x: g.x(v), y: g.filaY(0) }; };
  const deRecta = (datos, px) => inversa(RECTA().geometria(datos).x, datos.min, datos.max)(px);
  const rectaJuego = v => rectaMedias(v.x, v.y, { datos: { min: 0, max: 20, cada: 5 } });
  const medias = {
    id: 'medias',
    titulo: 'Tres medias para dos números',
    temas: ['Medias aritmética, geométrica y armónica'],
    pieza: 'recta',
    // Lee: vocabulario de las tres medias, sin decir cuál sirve para un viaje de ida y vuelta (eso es la predicción).
    lee: {
      tarjetas: [
        { titulo: 'El promedio de siempre', texto: 'Si sacas 12 y 16 en dos prácticas, tu promedio es 14: sumas las notas y divides entre 2. Ese número se llama media aritmética y queda entre las dos notas.',
          ecuacion: [A, ' = ', { frac: ['12 + 16', '2'] }, ' = 14'] },
        { titulo: 'Hay más medias', texto: ['Dos números positivos tienen otras medias. La media geométrica, ', G, ', es el número que multiplicado por sí mismo da su producto: para 4 y 9 es 6. La media armónica, H, sale de otra cuenta.'],
          ecuacion: [G, ' · ', G, ' = 4 · 9 = 36   →   ', G, ' = 6'] },
        { titulo: 'Qué mirar', texto: 'Los dos puntos sobre la recta son tus números; los tres de más arriba son sus medias. Mueve los números y fíjate en qué orden quedan las medias y cuándo se juntan.' },
      ],
    },
    juega: {
      consigna: 'Elige dos números. En la recta ves sus tres medias: aritmética, geométrica y armónica. Mira su orden.',
      voz: 'Prueba también dos números iguales.',
      controles: [
        { id: 'x', etiqueta: 'a', color: 'c-o', min: 2, max: 18, paso: 2, inicio: 4, decimales: 0 },
        { id: 'y', etiqueta: 'b', color: 'c-i', min: 2, max: 18, paso: 2, inicio: 16, decimales: 0 },
      ],
      dibujo: v => ({ datos: rectaJuego(v), estado: {} }),
      lectura: v => [A, ` = ${f((v.x + v.y) / 2)}`, '   ·   ', G, ` = ${f(Math.sqrt(v.x * v.y))}`, '   ·   ', `H = ${f(2 * v.x * v.y / (v.x + v.y))}`],
      minimo: 3,
      // Se arrastran los dos números sobre la recta; las tres medias los siguen.
      arrastres: [
        { id: 'punto-a', etiqueta: 'el número a', color: 'c-o',
          donde: v => puntoRecta(rectaJuego(v), v.x),
          mover: (pt, v) => ({ x: deRecta(rectaJuego(v), pt.x) }) },
        { id: 'punto-b', etiqueta: 'el número b', color: 'c-i',
          donde: v => puntoRecta(rectaJuego(v), v.y),
          mover: (pt, v) => ({ y: deRecta(rectaJuego(v), pt.x) }) },
      ],
    },
    predice: {
      pregunta: 'Una combi va de Juliaca a Puno a 60 km/h y vuelve por la misma pista a 40 km/h. ¿Cuál es su rapidez media en todo el viaje?',
      opciones: [
        { id: 'c', texto: '48 km/h', correcta: true },
        { id: 'prom', texto: '50 km/h', error: 'AR14', siFuera: '50 sería cierto si viajara el mismo tiempo a cada rapidez. Viaja más tiempo a 40.' },
        { id: 'geo', texto: '49 km/h', error: 'AT-MEDIA', siFuera: 'Eso se acerca a la media geométrica; aquí lo que se suma son tiempos.' },
        { id: 'suma', texto: '100 km/h', error: 'AT-SUMA', siFuera: 'Eso suma las rapideces; la rapidez media queda entre 40 y 60.' },
      ],
      dibujo: { datos: rectaMedias(40, 60, { dA: 9, dG: 9, dH: 9 }), estado: {} },
      revelar: { datos: rectaMedias(40, 60, { dG: 9 }), estado: {} },
      coincide: 'Coincide: tarda más a 40 km/h, así que la rapidez media se acerca a 40.',
    },
    mira: {
      datos: rectaMedias(40, 60, { dA: 1, dG: 9, dH: 3 }),
      pasos: [
        { estado: { corte: 1 }, texto: 'El promedio simple sería 50, si los tiempos fueran iguales.', ecuacion: [A, ' = ', { frac: ['40 + 60', '2'] }, ' = 50'] },
        { estado: { corte: 2 }, texto: 'Con 120 km por tramo: 2 h de ida y 3 h de vuelta.', ecuacion: [{ frac: ['120', '60'] }, ' + ', { frac: ['120', '40'] }, ' = 5 h'] },
        { estado: { corte: 3 }, texto: 'Rapidez media: distancia total entre tiempo total.', ecuacion: [{ frac: ['240', '5'] }, ' = 48 = ', { frac: ['2 · 40 · 60', '40 + 60'] }] },
      ],
    },
    regla: {
      texto: 'La media armónica H, la media geométrica G y la media aritmética A de dos positivos cumplen H ≤ G ≤ A; coinciden solo si a = b.',
      ecuacion: [{ llave: [A], nota: 'aritmética', color: 'c-h' }, ' = ', { frac: [[a, ' + ', b], '2'] }, '   ·   ', { llave: [G], nota: 'geométrica', color: 'c-d' }, ' = ', { raiz: [a, b] }, '   ·   ', { llave: ['H'], nota: 'armónica' }, ' = ', { frac: [['2', a, b], [a, ' + ', b]] }],
      condicion: 'tiempos iguales piden la aritmética; distancias iguales en cada tramo piden la armónica; factores que se multiplican, la geométrica.',
    },
    resuelve: {
      generar(s) {
        const r = azar(s + 900), [x, y] = r.de([[4, 9], [2, 8], [4, 16], [9, 16], [3, 12], [5, 20], [8, 18], [6, 24], [1, 9]]);
        const { A: Av, G: Gv, H: Hv } = mediasDe(x, y);
        const pide = ['A', 'G', 'H'][s % 3];
        const valor = { A: Av, G: Gv, H: Hv }[pide], nombre = { A: 'aritmética', G: 'geométrica', H: 'armónica' }[pide];
        const sim = { A, G, H: 'H' }[pide];
        const xo = { v: 'c-o', t: f(x) }, yi = { v: 'c-i', t: f(y) };
        const regla = {
          A: { texto: 'La aritmética reparte la suma en dos partes iguales: sumo los dos números y divido entre 2.', ecuacion: [A, ' = ', { frac: [[a, ' + ', b], '2'] }] },
          G: { texto: 'La geométrica es el número que, multiplicado por sí mismo, da el producto de los dos: la raíz cuadrada del producto.', ecuacion: [G, ' = ', { raiz: [a, b] }] },
          H: { texto: 'La armónica es el doble del producto dividido entre la suma de los dos números.', ecuacion: ['H = ', { frac: [['2', a, b], [a, ' + ', b]] }] },
        }[pide];
        const cuenta = {
          A: [A, ` = (${f(x)} + ${f(y)}) ÷ 2 = ${f(x + y)} ÷ 2 = ${f(Av)}`],
          G: [G, ` = √(${f(x)} · ${f(y)}) = √${f(x * y)} = ${f(Gv)}`],
          H: [`H = 2 · ${f(x * y)} ÷ ${f(x + y)} = ${f(2 * x * y)} ÷ ${f(x + y)} = ${f(Hv)}`],
        }[pide];
        const solo = { A: { dG: 9, dH: 9 }, G: { dA: 9, dH: 9 }, H: { dA: 9, dG: 9 } }[pide];
        return {
          enunciado: [`¿Cuál es la media ${nombre} de `, xo, ' y ', yi, '?'],
          dibujo: { datos: rectaMedias(x, y, { dA: 9, dG: 9, dH: 9 }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden la media ${nombre} de ${f(x)} y ${f(y)}: un solo número que los representa a los dos.` },
            { tipo: 'datos', texto: ['Los números son ', xo, ' y ', yi, `. Su suma es ${f(x + y)} y su producto, ${f(x * y)}.`] },
            { tipo: 'regla', texto: regla.texto, ecuacion: regla.ecuacion },
            { tipo: 'cuentas', texto: `Reemplazo los dos números en la fórmula de la media ${nombre}.`, ecuacion: cuenta,
              dibujo: { datos: rectaMedias(x, y, solo), estado: {} } },
            { tipo: 'sentido', texto: `Comprueba: ${f(valor)} queda entre ${f(x)} y ${f(y)}, y se cumple H ≤ G ≤ A: ${f(Hv)} ≤ ${f(Gv)} ≤ ${f(Av)}.` },
          ],
          respuesta: [sim, ` = ${f(valor)}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), [x, y] = r.de([[4, 9], [2, 8], [4, 16], [9, 16], [3, 12], [5, 20], [8, 18], [6, 24], [1, 9]]);
        const Av = (x + y) / 2, Gv = Math.sqrt(x * y), Hv = 2 * x * y / (x + y);
        const pide = ['A', 'G', 'H'][s % 3];
        const valor = { A: Av, G: Gv, H: Hv }[pide], nombre = { A: 'aritmética', G: 'geométrica', H: 'armónica' }[pide];
        const otras = [{ id: 'A', valor: Av, nombre: 'aritmética' }, { id: 'G', valor: Gv, nombre: 'geométrica' }, { id: 'H', valor: Hv, nombre: 'armónica' }].filter(o => o.id !== pide);
        return {
          pregunta: [`¿Cuál es la media ${nombre} de `, { v: 'c-o', t: f(x) }, ' y ', { v: 'c-i', t: f(y) }, '?'],
          dibujo: { datos: rectaMedias(x, y, { dA: 9, dG: 9, dH: 9 }), estado: {} },
          opciones: opciones(valor, [
            ...otras.map(o => ({ id: o.id, valor: o.valor, error: 'AT-MEDIA', siFuera: `Esa es la media ${o.nombre}.` })),
            { id: 'prod', valor: x * y, error: 'AT-PRODUCTO', siFuera: 'Ese es el producto; la geométrica es su raíz.' },
          ], n2 => f(n2)),
          solucion: {
            texto: `La media ${nombre}, calculada con su fórmula.`,
            ecuacion: pide === 'A' ? [A, ` = (${f(x)} + ${f(y)}) ÷ 2 = ${f(Av)}`] : pide === 'G' ? [G, ` = √(${f(x)} · ${f(y)}) = ${f(Gv)}`] : [`H = 2 · ${f(x)} · ${f(y)} ÷ ${f(x + y)} = ${f(Hv)}`],
            dibujo: { datos: rectaMedias(x, y), estado: {} },
          },
        };
      },
    },
  };

  // ---------- Idea 4: serie de razones iguales; la suma conserva la razón ----------
  // Cambia: k, que estira las tres tiras de arriba. Permanece: los consecuentes 2, 3 y 5.
  // Progresa: cada par → la suma de todos. Se reserva: el total dado, de donde sale k.
  // Debe verse: sumar antecedentes y consecuentes da la misma razón k.
  const serieDatos = (bs, kk, o = {}) => {
    const tiras = [];
    bs.forEach((bi, i) => tiras.push(tira(`par ${i + 1}`, 'o', bi, kk, { texto: o.sinTexto ? undefined : f(bi * kk), paso: o.pasos ? 1 : 0, extra: { tramos: [{ valor: bi * kk, color: 'o', partes: bi, texto: o.sinTexto ? undefined : f(bi * kk) }] } })));
    const suma = bs.reduce((x, y) => x + y, 0);
    tiras.push(tira('consecuentes', 'i', suma, 1, { fin: f(suma), paso: o.pasos ? 2 : 0, extra: { tramos: bs.map(bi => ({ valor: bi, color: 'i', partes: bi })) } }));
    tiras.push(tira('antecedentes', 'o', suma, kk, { fin: o.sinTexto ? '?' : f(suma * kk), paso: o.pasos ? 3 : 0, extra: { tramos: bs.map(bi => ({ valor: bi * kk, color: 'o', partes: bi })) } }));
    return { max: suma * Math.max(kk, 1), filas: bs.length + 2, tiras };
  };
  const CONSEC = [2, 3, 5], SUMA_C = CONSEC.reduce((x, y) => x + y, 0);
  const sumaAnte = kk => SUMA_C * kk;
  const serieJuego = v => Object.assign(serieDatos(CONSEC, v.k), { max: 40 });
  const serie = {
    id: 'serie',
    titulo: 'Razones iguales: la suma también',
    temas: ['Serie de razones geométricas equivalentes'],
    pieza: 'arit-tiras',
    // Lee: vocabulario de la serie y qué comparar en el juego, sin decir que la suma conserva la razón.
    lee: {
      tarjetas: [
        { titulo: 'La misma receta, más grande', texto: 'Para cocinar quinua se usa 1 taza de quinua por cada 2 de agua. Para más gente, 2 por 4 o 3 por 6. Todas esas razones valen lo mismo.',
          ecuacion: [{ frac: ['1', '2'] }, ' = ', { frac: ['2', '4'] }, ' = ', { frac: ['3', '6'] }] },
        { titulo: 'Una serie de razones', texto: ['Cuando escribes juntas varias razones iguales, tienes una serie de razones. Los números de arriba son los antecedentes y los de abajo, los consecuentes. El valor que todas comparten se llama ', k, '.'] },
        { titulo: 'Qué mirar', texto: 'Las tres tiras de arriba son los antecedentes. Abajo, una tira junta los consecuentes 2, 3 y 5, y la otra junta los antecedentes. Cambia k y compara esas dos tiras largas.' },
      ],
    },
    juega: {
      consigna: 'Tres razones iguales: cada antecedente es k veces su consecuente 2, 3 y 5. Cambia k y compara las sumas.',
      voz: 'Divide la suma de arriba entre la suma de abajo.',
      controles: [{ id: 'k', etiqueta: 'k', color: 'c-d', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 }],
      dibujo: v => ({ datos: serieJuego(v), estado: {} }),
      lectura: v => [`Antecedentes ${f(sumaAnte(v.k))} ÷ consecuentes ${f(SUMA_C)} = `, k, ` = ${f(sumaAnte(v.k) / SUMA_C)}`],
      minimo: 3,
      // Se arrastra el fin del par 3 (5k): estira los tres antecedentes a la vez. Va arriba, donde la figura se ve
      // entera bajo la barra fija; la escala queda en 40 para que el dedo y la tira no se separen.
      arrastres: [
        { id: 'fin-par-3', etiqueta: 'fin del par 3: cambia k', color: 'c-d',
          donde: v => finTira(serieJuego(v), 2, 5 * v.k),
          mover: (pt, v) => ({ k: valorEn(serieJuego(v), pt.x) / 5 }) },
      ],
    },
    predice: {
      pregunta: ['Se cumple ', { frac: [a, '3'] }, ' = ', { frac: [b, '5'] }, ' = ', { frac: [c, '7'] }, ' y ', a, ' + ', b, ' + ', c, ' = 60. ¿Cuánto vale ', b, '?'],
      opciones: [
        { id: 'c', texto: '20', correcta: true },
        { id: 'divide', texto: '12', error: 'AT-PARTES', siFuera: '12 sería 60 ÷ 5: tomaría el 5 como todas las partes. Hay 3 + 5 + 7 = 15.' },
        { id: 'tercio', texto: '15', error: 'AT-REPARTE-IGUAL', siFuera: 'Eso no usa las razones: 15 es la suma de los consecuentes.' },
        { id: 'otro', texto: '28', error: 'AT-CUAL', siFuera: '28 es c, el que tiene 7 partes.' },
      ],
      dibujo: { datos: serieDatos([3, 5, 7], 4, { sinTexto: true }), estado: {} },
      revelar: { datos: serieDatos([3, 5, 7], 4), estado: {} },
      coincide: 'Coincide: 60 ÷ 15 = 4, y b son 5 partes de 4.',
    },
    mira: {
      datos: serieDatos([3, 5, 7], 4, { pasos: true }),
      pasos: [
        { estado: { paso: 1 }, texto: 'Cada antecedente es k veces su consecuente.', ecuacion: [a, ' = 3', k, '   ·   ', b, ' = 5', k, '   ·   ', c, ' = 7', k] },
        { estado: { paso: 2 }, texto: 'Los consecuentes suman 3 + 5 + 7 = 15 partes.', ecuacion: ['3 + 5 + 7 = 15'] },
        { estado: { paso: 3 }, texto: 'Los antecedentes suman 60: cada parte vale 4.', ecuacion: [k, ' = ', { frac: ['60', '15'] }, ' = 4'] },
        { estado: { paso: 3 }, texto: 'b tiene 5 partes de 4.', ecuacion: [b, ' = 5 · 4 = 20'] },
      ],
    },
    regla: {
      texto: 'En una serie de razones iguales a k, la suma de los antecedentes entre la suma de los consecuentes también es k.',
      ecuacion: [{ frac: [a, '3'] }, ' = ', { frac: [b, '5'] }, ' = … = ', k, '   ·   ', { frac: [[a, ' + ', b, ' + …'], '3 + 5 + …'] }, ' = ', { llave: [k], nota: 'la misma razón', color: 'c-d' }],
      condicion: 'ningún consecuente es cero y su suma tampoco. Con n razones, el producto de antecedentes entre el de consecuentes es kⁿ.',
    },
    resuelve: {
      generar(s) {
        let r, bs, kk;
        for (let t = s + 900; ; t += 977) {      // como «Ahora tú»: tres consecuentes distintos
          r = azar(t); bs = [r.ent(1, 4), r.ent(2, 6), r.ent(3, 8)]; kk = r.ent(2, 6);
          if (bs[0] !== bs[1] && bs[1] !== bs[2] && bs[0] !== bs[2]) break;
        }
        const i = s % 3, suma = bs.reduce((u, z) => u + z, 0), total = suma * kk, res = bs[i] * kk;
        const v = t => ({ v: 'c-o', t }), noms = ['a', 'b', 'c'], nom = v(noms[i]);
        const serieEc = [{ frac: [v('a'), String(bs[0])] }, ' = ', { frac: [v('b'), String(bs[1])] }, ' = ', { frac: [v('c'), String(bs[2])] }];
        return {
          enunciado: ['Se cumple ', ...serieEc, ` y a + b + c = ${f(total)}. ¿Cuánto vale `, nom, '?'],
          dibujo: { datos: serieDatos(bs, kk, { sinTexto: true }), estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden ', nom, `, el antecedente que va sobre ${bs[i]}.`] },
            { tipo: 'datos', texto: `Las tres razones son iguales y los antecedentes suman ${f(total)}. Los consecuentes son ${bs[0]}, ${bs[1]} y ${bs[2]}.`, ecuacion: [...serieEc, ' = ', k] },
            { tipo: 'regla', texto: ['Si varias razones valen lo mismo, la suma de los de arriba entre la suma de los de abajo da ese mismo valor ', k, '.'],
              ecuacion: [{ frac: [[v('a'), ' + ', v('b'), ' + ', v('c')], `${bs[0]} + ${bs[1]} + ${bs[2]}`] }, ' = ', k] },
            { tipo: 'cuentas', texto: ['Los consecuentes suman ', String(suma), '. Hallo ', k, ` y lo multiplico por ${bs[i]}.`],
              ecuacion: [k, ` = ${f(total)} ÷ ${suma} = ${f(kk)}   →   `, nom, ` = ${bs[i]} · ${f(kk)} = ${f(res)}`],
              dibujo: { datos: serieDatos(bs, kk), estado: {} } },
            { tipo: 'sentido', texto: `Comprueba: los antecedentes son ${f(bs[0] * kk)}, ${f(bs[1] * kk)} y ${f(bs[2] * kk)}, y suman ${f(total)}. Cuadra.` },
          ],
          respuesta: [nom, ` = ${f(res)}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), bs = [r.ent(1, 4), r.ent(2, 6), r.ent(3, 8)], kk = r.ent(2, 6), i = s % 3;
        if (bs[0] === bs[1] || bs[1] === bs[2] || bs[0] === bs[2]) return this.generar(s + 977);
        const suma = bs.reduce((x, y) => x + y, 0), total = suma * kk, nom = ['a', 'b', 'c'][i];
        const v = (t, col) => ({ v: col, t });
        return {
          pregunta: ['Se cumple ', { frac: [v('a', 'c-o'), String(bs[0])] }, ' = ', { frac: [v('b', 'c-o'), String(bs[1])] }, ' = ', { frac: [v('c', 'c-o'), String(bs[2])] }, ` y a + b + c = ${f(total)}. ¿Cuánto vale ${nom}?`],
          opciones: opciones(bs[i] * kk, [
            { id: 'divide', valor: total / bs[i], error: 'AT-PARTES', siFuera: `Eso toma ${bs[i]} como todas las partes; hay ${suma}.` },
            { id: 'igual', valor: total / 3, error: 'AT-REPARTE-IGUAL', siFuera: 'Eso reparte en tres partes iguales, sin usar las razones.' },
            { id: 'k', valor: kk, error: 'AT-CONSTANTE', siFuera: `Ese es k, lo que vale cada parte; ${nom} tiene ${bs[i]} partes.` },
          ], f),
          solucion: { texto: `Cada parte vale ${f(total)} ÷ ${suma}.`, ecuacion: [k, ` = ${f(total)} ÷ ${suma} = ${f(kk)} → ${nom} = ${bs[i]} · ${f(kk)} = ${f(bs[i] * kk)}`] },
        };
      },
    },
  };

  // Mesas del laboratorio: el par de antes (a, b) y el de después (a·k + s, b·k + s), a la misma escala de 40.
  const despues = v => ({ x: v.a * v.k + v.s, y: v.b * v.k + v.s });
  const tirasAntesDespues = v => {
    const { x, y } = despues(v);
    return { max: 40, filas: 4, regla: { paso: 1, cada: 5 }, tiras: [tira('a', 'o', v.a, 1, { fin: f(v.a) }), tira('b', 'i', v.b, 1, { fin: f(v.b) }), tira('a después', 'o', x, 1, { fin: f(x) }), tira('b después', 'i', y, 1, { fin: f(y) })] };
  };
  const rectaLarga = v => rectaMedias(v.x, v.y, { datos: { min: 0, max: 40, paso: 1, cada: 10 } });
  // Para los retos: la tira b de después más larga con razón 2/3, y la mayor separación entre A y H (toda la grilla).
  const rango = (lo, hi) => Array.from({ length: hi - lo + 1 }, (_, i) => lo + i);
  const MAX_23 = Math.max(...rango(1, 8).flatMap(aa => rango(1, 8).flatMap(bb => rango(1, 4).flatMap(kk => rango(0, 8).map(ss => {
    const p = despues({ a: aa, b: bb, k: kk, s: ss }); return razon(p.x, p.y) === '2/3' ? p.y : 0; })))));
  const MAX_AH = Math.max(...rango(1, 40).flatMap(xx => rango(1, 40).map(yy => { const m = mediasDe(xx, yy); return m.A - m.H; })));

  return {
    unidad: 'aritmetica.razones-y-proporciones',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-tiras.js', '/nucleo/kit/piezas/recta.js'],
    // Glosario del tema (docs/teoria.md, 4d): lo que esta unidad estrena en aritmética. «factor» y «producto» se estrenan
    // en Las cuatro operaciones (docs/etapa4/decisiones.md): el lector los marca aquí como «Se explica en…».
    glosario: [
      { termino: 'cociente', def: 'Resultado de dividir un número entre otro: cuántas veces cabe el segundo en el primero.',
        ejemplo: '12 ÷ 4 = 3.', ver: ['razón geométrica'] },
      { termino: 'entero', formas: ['entero', 'enteros', 'número entero', 'números enteros'], def: 'Número sin parte decimal: …, −2, −1, 0, 1, 2, …',
        ejemplo: '−3 y 12 lo son; 1,5 no.' },
      { termino: 'rapidez', formas: ['rapidez', 'rapideces', 'rapidez media'], medida: 'km/h', def: 'Distancia recorrida en cada unidad de tiempo, sin importar hacia dónde.',
        ejemplo: '120 km en 2 h: 60 km/h.', ver: ['media armónica'] },
      { termino: 'razón', def: 'Comparación entre dos cantidades, por resta o por cociente. Si no se dice cuál, es el cociente.',
        ejemplo: '6 y 4: por resta, 2; por cociente, 6/4 = 1,5.', ver: ['razón aritmética', 'razón geométrica'] },
      { termino: 'razón aritmética', def: 'Comparación por resta: cuánto le lleva una cantidad a la otra.',
        ejemplo: '8 y 5: 8 − 5 = 3.', ver: ['razón geométrica'] },
      { termino: 'razón geométrica', simbolo: 'k', def: 'Comparación por cociente: cuántas veces cabe la segunda cantidad en la primera.',
        ejemplo: '12 y 4: 12/4 = 3.', ver: ['razón aritmética', 'proporción'] },
      { termino: 'antecedente', def: 'El primer término de una razón: el de arriba en a/b, el primero en a − b.',
        ejemplo: 'En 3/5, es 3.', ver: ['consecuente'] },
      { termino: 'consecuente', def: 'El segundo término de una razón: el de abajo en a/b, el segundo en a − b.',
        ejemplo: 'En 3/5, es 5.', ver: ['antecedente'] },
      { termino: 'proporción', def: 'Igualdad entre dos razones del mismo tipo. Sirve para hallar un término que falta.',
        ejemplo: '2/3 = 4/6.', ver: ['productos cruzados', 'medios'] },
      { termino: 'productos cruzados', def: 'En a/b = c/d, los productos a · d y b · c. Si salen iguales, las razones son iguales.',
        ejemplo: '2/3 = 4/6: 2 · 6 = 3 · 4 = 12.', ver: ['proporción'] },
      { termino: 'medios', def: 'En a/b = c/d, los términos b y c; a y d se llaman extremos.',
        ejemplo: 'En 4/6 = 6/9, los dos valen 6.', ver: ['proporción continua'] },
      { termino: 'proporción continua', formas: ['proporción continua', 'proporciones continuas'],
        def: 'Proporción cuyos dos términos del centro son el mismo número: a/b = b/d.',
        ejemplo: '4/6 = 6/9.', ver: ['media proporcional', 'medios'] },
      { termino: 'cuarta proporcional', def: 'El término d que completa a/b = c/d cuando se conocen a, b y c.',
        ejemplo: '2/3 = 8/d: 2 · d = 3 · 8, d = 12.', ver: ['productos cruzados'] },
      { termino: 'media proporcional', def: 'En a/b = b/d, el número b que se repite: multiplicado por sí mismo da a · d.',
        ejemplo: '4 y 9: b · b = 36, b = 6.', ver: ['proporción continua', 'media geométrica'] },
      { termino: 'media aritmética', simbolo: 'A', formas: ['media aritmética', 'medias aritméticas', 'promedio', 'media'],
        def: 'Suma de los números dividida entre cuántos son. Para dos: (a + b)/2.',
        ejemplo: '40 y 60: (40 + 60)/2 = 50.', ver: ['media geométrica', 'media armónica'] },
      { termino: 'media geométrica', simbolo: 'G', def: 'Raíz cuadrada del producto de dos positivos, √(a · b). Sirve cuando las cantidades se multiplican.',
        ejemplo: '4 y 9: √36 = 6.', ver: ['media aritmética', 'media armónica'] },
      { termino: 'media armónica', simbolo: 'H', def: 'Para dos positivos, 2ab/(a + b). Da la rapidez media en dos tramos de igual distancia.',
        ejemplo: '40 y 60 km/h: 2 · 40 · 60/100 = 48 km/h.', ver: ['media aritmética', 'media geométrica'] },
      { termino: 'serie de razones', formas: ['serie de razones', 'series de razones'],
        def: 'Varias razones iguales a un mismo k. Sumando antecedentes y consecuentes, el cociente sigue siendo k.',
        ejemplo: 'a/3 = b/5 = c/7 y a + b + c = 60: k = 60/15 = 4.', ver: ['antecedente', 'consecuente'] },
    ],
    // Laboratorio: juego libre, sin preguntas. «Antes y después» junta las dos comparaciones con cuatro controles; «Tres
    // medias» abre el rango hasta 40 (con pares impares e iguales); la serie es el juego de la idea 4.
    laboratorio: [
      {
        id: 'antes-despues', titulo: 'Antes y después del cambio', pieza: 'arit-tiras',
        consigna: 'Elige un par a y b. Luego multiplícalo y súmale lo mismo. Compara qué pasa con la resta y con la razón.',
        controles: [
          { id: 'a', etiqueta: 'a', color: 'c-o', min: 1, max: 8, paso: 1, inicio: 2, decimales: 0 },
          { id: 'b', etiqueta: 'b', color: 'c-i', min: 1, max: 8, paso: 1, inicio: 3, decimales: 0 },
          { id: 'k', etiqueta: 'Multiplica ×', color: 'c-d', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
          { id: 's', etiqueta: 'Suma +', min: 0, max: 8, paso: 1, inicio: 0, decimales: 0 },
        ],
        dibujo: v => ({ datos: tirasAntesDespues(v), estado: {} }),
        lectura: v => {
          const { x, y } = despues(v);
          return [`${f(v.a)} : ${f(v.b)} → ${f(x)} : ${f(y)}`, '   ·   ', `razón ${razon(x, y)}`, '   ·   ', b, ' − ', a, ` = ${f(y - x)}`];
        },
        arrastres: [
          { id: 'fin-a', etiqueta: 'fin de la tira a', color: 'c-o',
            donde: v => finTira(tirasAntesDespues(v), 0, v.a), mover: (pt, v) => ({ a: valorEn(tirasAntesDespues(v), pt.x) }) },
          { id: 'fin-b', etiqueta: 'fin de la tira b', color: 'c-i',
            donde: v => finTira(tirasAntesDespues(v), 1, v.b), mover: (pt, v) => ({ b: valorEn(tirasAntesDespues(v), pt.x) }) },
          { id: 'fin-b2', etiqueta: 'fin de b después: multiplica', color: 'c-d',
            donde: v => finTira(tirasAntesDespues(v), 3, v.b * v.k + v.s), mover: (pt, v) => ({ k: (valorEn(tirasAntesDespues(v), pt.x) - v.s) / v.b }) },
        ],
        invitaciones: [
          { texto: 'Consigue que la resta quede igual y la razón cambie.',
            logrado: v => { const p = despues(v); return p.y - p.x === v.b - v.a && razon(p.x, p.y) !== razon(v.a, v.b); },
            bien: 'Sumar lo mismo conserva la resta; la razón ya es otra.' },
          { texto: 'Suma algo y deja el par de después en razón 1 : 2.',
            logrado: v => { const p = despues(v); return v.s > 0 && razon(p.x, p.y) === '1/2'; },
            bien: 'Llegaste a 1 : 2 con una suma: sumar sí mueve la razón.' },
          { texto: 'Busca la tira b de después más larga con razón 2 : 3.',
            logrado: v => { const p = despues(v); return razon(p.x, p.y) === '2/3' && p.y === MAX_23; },
            bien: 'Es la más larga que deja la mesa. ¿Qué sumaste para llegar ahí?' },
          { texto: 'Guarda dos casos con el mismo par de después y distinto par de antes.',
            logrado: (v, guardados) => guardados.some(g => { const p = despues(g), q = despues(v); return p.x === q.x && p.y === q.y && (g.a !== v.a || g.b !== v.b); }),
            bien: 'Mismo final desde dos inicios: mirar solo el final no basta.' },
        ],
      },
      {
        id: 'tres-medias', titulo: 'Tres medias en una recta larga', pieza: 'recta',
        consigna: 'Arrastra a y b por la recta, de 1 a 40. Busca cuándo las tres medias quedan juntas y cuándo se separan.',
        controles: [
          { id: 'x', etiqueta: 'a', color: 'c-o', min: 1, max: 40, paso: 1, inicio: 4, decimales: 0 },
          { id: 'y', etiqueta: 'b', color: 'c-i', min: 1, max: 40, paso: 1, inicio: 36, decimales: 0 },
        ],
        dibujo: v => ({ datos: rectaLarga(v), estado: {} }),
        lectura: v => { const m = mediasDe(v.x, v.y); return [`${f(v.x)} y ${f(v.y)}:`, ' ', 'H = ', f(m.H), '   ·   ', G, ` = ${f(m.G)}`, '   ·   ', A, ` = ${f(m.A)}`]; },
        arrastres: [
          { id: 'punto-a', etiqueta: 'el número a', color: 'c-o', donde: v => puntoRecta(rectaLarga(v), v.x), mover: (pt, v) => ({ x: deRecta(rectaLarga(v), pt.x) }) },
          { id: 'punto-b', etiqueta: 'el número b', color: 'c-i', donde: v => puntoRecta(rectaLarga(v), v.y), mover: (pt, v) => ({ y: deRecta(rectaLarga(v), pt.x) }) },
        ],
        invitaciones: [
          { texto: 'Haz que las tres medias caigan en el mismo punto.',
            logrado: v => { const m = mediasDe(v.x, v.y); return m.A === m.G && m.G === m.H; },
            bien: 'Solo pasa con a = b. Sepáralos un poco: ¿cuál se aleja primero?' },
          { texto: 'Busca dos números distintos cuya media armónica sea un entero.',
            logrado: v => v.x !== v.y && Number.isInteger(mediasDe(v.x, v.y).H),
            bien: '2ab entre a + b cayó exacto. Comprueba que H quedó a la izquierda.' },
          { texto: 'Consigue la mayor distancia entre la media aritmética y la armónica.',
            logrado: v => Math.abs(mediasDe(v.x, v.y).A - mediasDe(v.x, v.y).H - MAX_AH) < 1e-9,
            bien: 'Lo más distintos posible: así es como más se abren las medias.' },
          { texto: 'Guarda dos pares con la misma media aritmética y distinta geométrica.',
            logrado: (v, guardados) => guardados.some(g => mediasDe(g.x, g.y).A === mediasDe(v.x, v.y).A && mediasDe(g.x, g.y).G !== mediasDe(v.x, v.y).G),
            bien: 'Misma suma, otro producto: la geométrica baja cuando se separan.' },
        ],
      },
      Object.assign({ id: 'serie', titulo: 'Razones iguales que se suman', pieza: 'arit-tiras',
        invitaciones: [
          { texto: 'Haz que los antecedentes sumen 30.',
            logrado: v => sumaAnte(v.k) === 30,
            bien: '30 entre 10 da 3: la suma guarda la misma razón k.' },
          { texto: 'Lleva k a su menor valor.',
            logrado: v => v.k === 1,
            bien: 'Con k = 1, cada antecedente es igual a su consecuente.' },
          { texto: 'Guarda dos casos en que una suma de antecedentes sea el doble de la otra.',
            logrado: (v, guardados) => guardados.some(g => g.k !== v.k && (sumaAnte(g.k) === 2 * sumaAnte(v.k) || sumaAnte(v.k) === 2 * sumaAnte(g.k))),
            bien: 'Doble k, doble suma: los consecuentes no se movieron.' },
        ] }, serie.juega),
    ],
    historia: {
      texto: 'En la matemática griega había longitudes que ninguna unidad común medía un número entero de veces. La teoría atribuida a Eudoxo, conservada en el libro V de los Elementos, comparaba esas magnitudes por sus múltiplos. No eran todavía fracciones escritas como hoy. Una proporción afirma que dos comparaciones son iguales: primero se decide qué se compara y en qué orden.',
      pregunta: '¿Cómo compararías dos largos sin una regla común?',
      fuente: { titulo: 'O’Connor y Robertson, Eudoxus — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Biographies/Eudoxus/' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'antes-despues': ['restar-dividir'],
      'tres-medias': ['medias'],
      'serie': ['serie'],
    },
    ideas: [comparar, proporcion, medias, serie],
  };
});
