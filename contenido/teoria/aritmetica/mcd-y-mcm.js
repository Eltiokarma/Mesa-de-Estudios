/*
 * Teoría de «MCD y MCM» (aritmetica.mcd-y-mcm). Molde: docs/teoria.md; forma de contenido/teoria/aritmetica/porcentajes.js.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 15) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: AR13 de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: distinguir «cortar en trozos iguales lo más grandes posible» (MCD) de «volver a coincidir» (MCM).
 *   Persona y condiciones: postulante de 3.º a 5.º, celular de 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: elige MCD o MCM según lo que se maximiza o minimiza, los halla por factores o por
 *     Euclides, usa mcd · mcm = a · b solo con dos números y escribe la fracción continua de un cociente.
 *   Orden de atención: 1.º las dos cintas o las dos filas de múltiplos · 2.º el trozo que mide a las dos o el
 *     primer punto común · acción: el botón fijo de abajo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «¿cuándo es MCD y cuándo es MCM, si los dos dicen “común”?».
 * Colores (regla 4): a naranja (c-o), b turquesa (c-i), el MCD verde (c-d), el MCM rojo (c-h). En las mesas 3D, el
 *   tercer lado c va en violeta (c-f), y el lado m del cubo de prueba, en verde solo cuando llena justo (es divisor común).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El motor de plantillas/fracciones llena la caja (MCD) y arma el cubo de ladrillos (MCM) de las mesas 3D (regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/fracciones/motor.js'))
    : fabrica(root.Kit, root.MotorFracciones);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MF) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const A = { v: 'c-o', t: 'a' }, Bv = { v: 'c-i', t: 'b' };
  const MCD = { v: 'c-d', t: 'mcd' }, MCM = { v: 'c-h', t: 'mcm' };
  const mcdab = [MCD, '(', A, ', ', Bv, ')'], mcmab = [MCM, '(', A, ', ', Bv, ')'];
  function azar(s) {
    let a = (s * 2654435761 + 12345) >>> 0;
    const r = () => { a = (a + 0x6D2B79F5) >>> 0; let z = a; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    r.ent = (lo, hi) => lo + Math.floor(r() * (hi - lo + 1));
    r.de = xs => xs[Math.floor(r() * xs.length)];
    return r;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const d of distractores) {
      const txt = fmt(d.valor);
      if (vistos.has(txt) || (typeof d.valor === 'number' && !Number.isFinite(d.valor))) continue;
      vistos.add(txt);
      ops.push({ id: d.id, texto: txt, error: d.error, siFuera: d.siFuera });
    }
    return ops.slice(0, 4);
  }
  const mcd = (a, b) => (b ? mcd(b, a % b) : Math.abs(a));
  const mcm = (a, b) => a / mcd(a, b) * b;
  // Factores primos: [[p, e], …].
  function factores(n) {
    const out = [];
    for (let p = 2; p * p <= n; p++) { let e = 0; while (n % p === 0) { n /= p; e++; } if (e) out.push([p, e]); }
    if (n > 1) out.push([n, 1]);
    return out;
  }
  const potencia = fs => fs.map(([p, e]) => (e > 1 ? { sup: [String(p), String(e)] } : String(p))).reduce((acc, x, i) => (i ? acc.concat([' · ', x]) : [x]), []);
  // Pasos de Euclides: [{ a, b, q, r }] hasta resto 0.
  function euclides(a, b) {
    const out = [];
    while (b) { out.push({ a, b, q: Math.floor(a / b), r: a % b }); [a, b] = [b, a % b]; }
    return out;
  }

  // Gesto directo (docs/teoria.md §4b): las manijas usan la geometría de las piezas (arit-tiras.x/deX, recta.x/filaY).
  const TIRAS = () => Kit.piezas['arit-tiras'], RECTA = () => Kit.piezas.recta;
  const inversa = (escala, p, q) => px => p + (px - escala(p)) * (q - p) / (escala(q) - escala(p));
  // Manija en el borde de abajo de la tira k, en el valor dado (no tapa los rótulos, que van adentro o a media altura).
  const enTira = (datos, k, valor) => { const g = TIRAS().geometria(datos); return { x: g.x(valor), y: g.tiraY(k) + g.altoTira }; };
  const valorEn = (datos, px) => TIRAS().geometria(datos).deX(px);
  const enRecta = (datos, fila, valor) => { const g = RECTA().geometria(datos); return { x: g.x(valor), y: g.filaY(fila) }; };
  const deRecta = (datos, px) => inversa(RECTA().geometria(datos).x, datos.min, datos.max)(px);
  // Varias relaciones en una ecuación: se separan con el separador del molde, no con «;».
  const juntas = xs => xs.reduce((acc, x, i) => (i ? acc.concat(['   ·   ', x]) : [x]), []);

  // ---------- Idea 1: el MCD es el trozo más largo que mide a las dos ----------
  // Cambia: el largo del trozo t. Permanece: las dos cintas a la misma escala (40 cm de ancho).
  // Progresa: trozos que dejan sobrante → trozos que miden exacto a las dos → el mayor de ellos.
  // Se reserva: el trozo de 12 en la cinta de 24 y 36, que llega en el último paso. Debe verse: nada sobra.
  const MAXC = 40;
  const cinta = (n, t, color, rot) => {
    const q = Math.floor(n / t), r = n - q * t;
    const tramos = [{ valor: q * t, partes: q, color, texto: q > 1 && t >= 4 ? `${q} × ${t}` : '' }];
    if (r > 0) tramos.push({ valor: r, hueco: true, texto: `sobra ${r}` });
    return { rotulo: rot, color, fin: `${n} cm`, tramos, sinContorno: true };
  };
  const tirasCorte = (a, b, t, extra = {}) => Object.assign({ max: MAXC, tiras: [cinta(a, t, 'o', `a = ${a}`), cinta(b, t, 'i', `b = ${b}`)], filas: 2 }, extra);
  const PARES = { '18-30': [18, 30], '24-36': [24, 36], '16-40': [16, 40] };
  const trozo = {
    id: 'mcd-cintas',
    titulo: 'El trozo común más largo',
    temas: ['Máximo común divisor', 'Problemas de aplicación'],
    pieza: 'arit-tiras',
    // Lee (fase 2): contexto y vocabulario; no dice qué trozo gana en la predicción (24 y 36).
    lee: {
      tarjetas: [
        { titulo: 'Sin retazos', texto: 'En la feria de Juliaca, una vendedora corta cintas de tela para hacer moños. Quiere trozos iguales y que no le quede ningún retazo. Así empiezan muchos problemas de esta idea.' },
        { titulo: 'Divisor común', texto: 'Un número es divisor común de dos si divide exacto a los dos. Por ejemplo, 3 es divisor común de 9 y de 15: entra 3 veces en 9 y 5 veces en 15.',
          ecuacion: ['9 = 3 · 3', '   ·   ', '15 = 5 · 3'] },
        { titulo: 'Qué mirar', texto: 'En el juego eliges el largo del trozo, y se corta en las dos cintas a la vez. Mira lo que sobra en cada cinta: un trozo puede medir exacto una y dejar sobrante en la otra.' },
      ],
    },
    juega: {
      consigna: 'Elige dos cintas y el largo del trozo. Busca un trozo que corte las dos sin que sobre nada.',
      voz: 'Comprueba cada trozo en las dos cintas, no solo en una.',
      controles: [
        { id: 'par', etiqueta: 'Cintas', opciones: [{ valor: '18-30', texto: '18 y 30' }, { valor: '16-40', texto: '16 y 40' }] },
        { id: 't', etiqueta: 'Trozo', color: 'c-d', min: 1, max: 12, paso: 1, inicio: 4, unidad: 'cm', decimales: 0 },
      ],
      dibujo: v => { const [a, b] = PARES[v.par]; return { datos: tirasCorte(a, b, v.t), estado: {} }; },
      lectura: v => { const [a, b] = PARES[v.par]; return [`Trozo de ${v.t} cm: sobran ${a % v.t} y ${b % v.t} cm`]; },
      minimo: 4,
      // Se arrastra el fin del primer trozo de la cinta a: alargarlo o acortarlo cambia el trozo en las dos cintas.
      arrastres: [{ id: 'trozo', etiqueta: 'fin del primer trozo', color: 'c-d',
        donde: v => { const [a, b] = PARES[v.par]; return enTira(tirasCorte(a, b, v.t), 0, v.t); },
        mover: (pt, v) => { const [a, b] = PARES[v.par]; return { t: valorEn(tirasCorte(a, b, v.t), pt.x) }; } }],
    },
    predice: {
      pregunta: ['Dos cintas miden ', { v: 'c-o', t: '24 cm' }, ' y ', { v: 'c-i', t: '36 cm' }, '. Se cortan en trozos iguales, lo más largos posible, sin que sobre. ¿Cuánto mide cada trozo?'],
      opciones: [
        { id: 'c', texto: '12 cm', correcta: true },
        { id: 'mcm', texto: '72 cm', error: 'AR13', siFuera: '72 es el primer largo que se arma con las dos medidas. Aquí se corta, no se junta.' },
        { id: 'menor', texto: '6 cm', error: 'AT-NOMAX', siFuera: '6 cm mide a las dos sin sobrante, pero 12 cm también, y es más largo.' },
        { id: 'resta', texto: '24 cm', error: 'AT-MENOR', siFuera: '24 cm mide a la primera, pero en la de 36 sobran 12 cm.' },
      ],
      dibujo: { datos: { max: MAXC, tiras: [{ rotulo: 'a = 24', color: 'o', fin: '24 cm', tramos: [{ valor: 24 }] }, { rotulo: 'b = 36', color: 'i', fin: '36 cm', tramos: [{ valor: 36 }] }], filas: 2 }, estado: {} },
      revelar: { datos: tirasCorte(24, 36, 12), estado: {} },
      coincide: 'Coincide: 12 cm entra 2 veces en 24 y 3 veces en 36.',
    },
    mira: {
      datos: {
        max: MAXC, filas: 4,
        tiras: [
          Object.assign(cinta(24, 6, 'o', 'trozos de 6'), { paso: 1 }), Object.assign(cinta(36, 6, 'i', 'trozos de 6'), { paso: 1 }),
          Object.assign(cinta(24, 12, 'o', 'trozos de 12'), { paso: 2 }), Object.assign(cinta(36, 12, 'i', 'trozos de 12'), { paso: 2 }),
        ],
      },
      pasos: [
        { estado: { paso: 1 }, texto: 'Un trozo de 6 cm mide las dos cintas: es un divisor común.', ecuacion: ['24 = 4 · 6', '   ·   ', '36 = 6 · 6'] },
        { estado: { paso: 2 }, texto: 'Un trozo de 12 cm también, y es más largo.', ecuacion: ['24 = 2 · 12', '   ·   ', '36 = 3 · 12'] },
        { estado: { paso: 2 }, texto: 'Con factores primos: se toman los comunes con su menor exponente.', ecuacion: ['24 = ', { sup: ['2', '3'] }, ' · 3', '   ·   ', '36 = ', { sup: ['2', '2'] }, ' · ', { sup: ['3', '2'] }, '   ·   ', MCD, ' = ', { sup: ['2', '2'] }, ' · 3 = 12'] },
      ],
    },
    regla: {
      texto: 'El MCD es el mayor número que divide a los dos. Responde a «cortar en partes iguales lo más grandes posible».',
      ecuacion: [{ llave: [mcdab], nota: 'trozo más largo', color: 'c-d' }, ' = producto de los primos comunes con su menor exponente'],
      condicion: 'a y b son enteros positivos. Si no tienen primos comunes, el MCD es 1.',
    },
    // Así se resuelve (fase 2): el mismo tipo de «Ahora tú» (lotes o total de trozos), con otras semillas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), g = r.de([2, 3, 4, 5, 6, 8, 9, 10, 12, 15]);
        let m = r.ent(2, 7), n = r.ent(2, 9);
        while (mcd(m, n) !== 1 || m === n) n = n % 9 + 2;
        const a = g * m, b = g * n, d = mcd(a, b), u = s % 2 === 0 ? 'm' : 'cm';
        const tiras = cortadas => ({ datos: { max: Math.max(a, b) * 1.15, filas: 2, tiras: [
          { rotulo: 'a', color: 'o', fin: `${a} ${u}`, tramos: [cortadas ? { valor: a, partes: a / d, color: 'o' } : { valor: a }] },
          { rotulo: 'b', color: 'i', fin: `${b} ${u}`, tramos: [cortadas ? { valor: b, partes: b / d, color: 'i' } : { valor: b }] }] }, estado: {} });
        const ca = { v: 'c-o', t: `${a} ${u}` }, cb = { v: 'c-i', t: `${b} ${u}` };
        const cuentas = { tipo: 'cuentas', texto: 'Descompongo los dos en primos y tomo los comunes con su menor exponente.',
          ecuacion: [`${a} = `, ...potencia(factores(a)), '   ·   ', `${b} = `, ...potencia(factores(b)), '   ·   ', MCD, ' = ', ...potencia(factores(d)), ` = ${d}`],
          dibujo: tiras(true) };
        if (s % 2 === 0) return {
          enunciado: ['Dos terrenos de ', ca, ' y ', cb, ' de frente se dividen en lotes iguales, lo más anchos posible, sin que sobre. ¿Cuánto mide cada lote de frente?'],
          dibujo: tiras(false),
          pasos: [
            { tipo: 'pide', texto: 'Piden el frente de un lote: el más ancho que entre exacto en los dos terrenos.' },
            { tipo: 'datos', texto: ['Los frentes miden ', ca, ' y ', cb, '. En ninguno puede sobrar nada.'] },
            { tipo: 'regla', texto: 'Si entra exacto en los dos, es un divisor común. Como lo quiero lo más grande posible, busco el MCD.' },
            cuentas,
            { tipo: 'sentido', texto: `Comprueba: ${a} ÷ ${d} = ${a / d} lotes y ${b} ÷ ${d} = ${b / d} lotes, exactos. ${a / d} y ${b / d} no comparten divisores, así que no hay lote más ancho.` },
          ],
          respuesta: ['Cada lote mide ', { v: 'c-d', t: `${d} m` }, ' de frente.'],
        };
        return {
          enunciado: ['Dos cintas de ', ca, ' y ', cb, ' se cortan en trozos iguales, lo más largos posible, sin que sobre. ¿Cuántos trozos salen en total?'],
          dibujo: tiras(false),
          pasos: [
            { tipo: 'pide', texto: 'Piden cuántos trozos salen en total, no cuánto mide cada uno.' },
            { tipo: 'datos', texto: ['Las cintas miden ', ca, ' y ', cb, '. Los trozos son iguales y no sobra nada.'] },
            { tipo: 'regla', texto: 'El trozo más largo que mide exacto a las dos cintas es su MCD. Después cuento cuántos caben en cada cinta.' },
            cuentas,
            { tipo: 'cuentas', texto: `Con trozos de ${d} cm, cuento los de cada cinta y los sumo.`, ecuacion: [`${a} ÷ ${d} + ${b} ÷ ${d} = ${a / d} + ${b / d} = ${a / d + b / d}`] },
            { tipo: 'sentido', texto: `Comprueba: ${a / d + b / d} trozos de ${d} cm suman ${(a / d + b / d) * d} cm, igual que ${a} + ${b}. No sobra nada.` },
          ],
          respuesta: `Salen ${a / d + b / d} trozos de ${d} cm.`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), g = r.de([2, 3, 4, 5, 6, 8, 9, 10, 12, 15]);
        let m = r.ent(2, 7), n = r.ent(2, 9);
        while (mcd(m, n) !== 1 || m === n) n = n % 9 + 2;
        const a = g * m, b = g * n, c = mcm(a, b), sub = factores(g)[0][0];
        if (s % 2 === 0) return {
          pregunta: ['Dos terrenos de ', { v: 'c-o', t: `${a} m` }, ' y ', { v: 'c-i', t: `${b} m` }, ' de frente se dividen en lotes iguales, lo más anchos posible, sin que sobre. ¿Cuánto mide cada lote de frente?'],
          dibujo: { datos: { max: Math.max(a, b) * 1.15, tiras: [{ rotulo: 'a', color: 'o', fin: `${a} m`, tramos: [{ valor: a }] }, { rotulo: 'b', color: 'i', fin: `${b} m`, tramos: [{ valor: b }] }], filas: 2 }, estado: {} },
          opciones: opciones(g, [
            { id: 'mcm', valor: c, error: 'AR13', siFuera: `${c} es el MCM: sirve para juntar, no para dividir.` },
            { id: 'menor', valor: g / sub, error: 'AT-NOMAX', siFuera: `${g / sub} divide a los dos, pero hay uno más grande.` },
            { id: 'resta', valor: Math.abs(a - b), error: 'AT-RESTA', siFuera: 'La diferencia de los frentes no siempre divide a los dos.' },
          ], n2 => `${f(n2)} m`),
          solucion: {
            texto: 'El mayor divisor común de los dos frentes.', ecuacion: [MCD, `(${a}, ${b}) = ${g}`],
            dibujo: { datos: { max: Math.max(a, b) * 1.15, tiras: [{ rotulo: 'a', color: 'o', fin: `${a} m`, tramos: [{ valor: a, partes: m, color: 'o' }] }, { rotulo: 'b', color: 'i', fin: `${b} m`, tramos: [{ valor: b, partes: n, color: 'i' }] }], filas: 2 }, estado: {} },
          },
        };
        return {
          pregunta: ['Dos cintas de ', { v: 'c-o', t: `${a} cm` }, ' y ', { v: 'c-i', t: `${b} cm` }, ' se cortan en trozos iguales, lo más largos posible, sin que sobre. ¿Cuántos trozos salen en total?'],
          opciones: opciones(m + n, [
            { id: 'largo', valor: g, error: 'AT-PREGUNTA', siFuera: `${g} cm es el largo de cada trozo; se preguntó cuántos son.` },
            { id: 'menor', valor: a / (g / sub) + b / (g / sub), error: 'AT-NOMAX', siFuera: 'Eso usa un trozo más corto que el mayor posible.' },
            { id: 'mcm', valor: c / g, error: 'AR13', siFuera: 'Eso divide el MCM entre el MCD; se suman los trozos de cada cinta.' },
          ], n2 => `${f(n2)} trozos`),
          solucion: { texto: `Trozos de ${g} cm: ${m} en una cinta y ${n} en la otra.`, ecuacion: [`${a} ÷ ${g} + ${b} ÷ ${g} = ${m} + ${n} = ${m + n}`] },
        };
      },
    },
  };

  // ---------- Idea 2: el MCM es la primera vez que coinciden ----------
  // Cambia: los periodos a y b. Permanece: la recta de minutos de 0 a 90.
  // Progresa: múltiplos de a → múltiplos de b → el primer punto común. Se reserva: el rótulo «coinciden».
  // Debe verse: el primer punto que está en las dos filas.
  const rectaBuses = (a, b, max, conMcm = true, extra = {}) => Object.assign({
    min: 0, max, paso: 5, cada: 2, decimales: 0, variable: 'minutos', filas: 3,
    elementos: [
      { tipo: 'enteros', a: a, b: max, cada: a, color: 'o', fila: 2, rotulo: `cada ${a}` },
      { tipo: 'enteros', a: b, b: max, cada: b, color: 'i', fila: 1, rotulo: `cada ${b}` },
      ...(conMcm ? [{ tipo: 'punto', x: mcm(a, b), color: 'h', fila: 3, rotulo: `juntos: ${mcm(a, b)}`, desde: extra.desdeMcm || 0 }] : []),
    ],
  }, extra.datos || {});
  const buses = {
    id: 'mcm-coinciden',
    titulo: 'La primera vez que coinciden',
    temas: ['Mínimo común múltiplo', 'Problemas de aplicación'],
    pieza: 'recta',
    // Lee (fase 2): contexto y vocabulario; no dice cuándo coinciden las alarmas de la predicción.
    lee: {
      tarjetas: [
        { titulo: 'Cosas que se repiten', texto: 'En un paradero de Puno, una combi sale cada pocos minutos y otra, cada tantos más. Si salen juntas a las 7:00, ¿cuándo vuelven a salir juntas? Esa pregunta se repite en muchos problemas.' },
        { titulo: 'Múltiplos en fila', texto: 'Los múltiplos de 4 se arman sumando 4 una y otra vez: 4, 8, 12, 16… Un múltiplo común de dos números aparece en la lista de los dos.',
          ecuacion: ['4, 8, 12, 16, 20, 24, …'] },
        { titulo: 'Qué mirar', texto: 'En el juego, cada fila de puntos marca las salidas de una combi: naranja cada a minutos y turquesa cada b. Busca los minutos que tienen punto en las dos filas.' },
      ],
    },
    juega: {
      consigna: 'Los puntos naranjas son salidas de una combi, cada a minutos; los turquesa, de otra, cada b. Mira cuándo coinciden.',
      voz: 'Busca el primer punto que está en las dos filas.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 2, max: 9, paso: 1, inicio: 6, unidad: 'min', decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 2, max: 9, paso: 1, inicio: 8, unidad: 'min', decimales: 0 },
      ],
      dibujo: v => ({ datos: rectaBuses(v.a, v.b, 90), estado: {} }),
      lectura: v => [`Salen juntas cada ${mcm(v.a, v.b)} minutos`],
      minimo: 3,
      // Se arrastra la quinta salida de cada combi: estirarla separa todas sus salidas. (La primera queda muy cerca del
      // 0 en una recta de 90 minutos: con la quinta, un minuto más son 15 px de dedo.)
      arrastres: [
        { id: 'salida-a', etiqueta: 'quinta salida de la combi a', color: 'c-o',
          donde: v => enRecta(rectaBuses(v.a, v.b, 90), 2, 5 * v.a), mover: (pt, v) => ({ a: deRecta(rectaBuses(v.a, v.b, 90), pt.x) / 5 }) },
        { id: 'salida-b', etiqueta: 'quinta salida de la combi b', color: 'c-i',
          donde: v => enRecta(rectaBuses(v.a, v.b, 90), 1, 5 * v.b), mover: (pt, v) => ({ b: deRecta(rectaBuses(v.a, v.b, 90), pt.x) / 5 }) },
      ],
    },
    predice: {
      pregunta: ['Dos alarmas suenan juntas a las 8:00. Una suena cada ', { v: 'c-o', t: '12 min' }, ' y la otra cada ', { v: 'c-i', t: '18 min' }, '. ¿Cuántos minutos después vuelven a sonar juntas?'],
      opciones: [
        { id: 'c', texto: '36 minutos', correcta: true },
        { id: 'mcd', texto: '6 minutos', error: 'AR13', siFuera: '6 divide a 12 y a 18, pero a los 6 minutos ninguna alarma suena.' },
        { id: 'producto', texto: '216 minutos', error: 'AR13', siFuera: 'A los 216 también coinciden, pero ya lo hicieron antes, a los 36.' },
        { id: 'suma', texto: '30 minutos', error: 'AT-SUMA-PERIODOS', siFuera: '30 no es múltiplo de 12: a esa hora solo podría sonar si fuera.' },
      ],
      dibujo: { datos: rectaBuses(12, 18, 80, false), estado: {} },
      revelar: { datos: rectaBuses(12, 18, 80), estado: {} },
      coincide: 'Coincide: 36 es el primer número que está en las dos filas.',
    },
    mira: {
      datos: rectaBuses(12, 18, 80, true, { desdeMcm: 2 }),
      pasos: [
        { estado: { corte: 0 }, texto: 'Arriba, los múltiplos de 18; abajo, los de 12.', ecuacion: ['12, 24, 36, 48, …', '   ·   ', '18, 36, 54, …'] },
        { estado: { corte: 2 }, texto: 'El primer múltiplo común es 36: ahí suenan juntas.', ecuacion: [MCM, '(12, 18) = 36'] },
        { estado: { corte: 2 }, texto: 'Con factores primos: todos los primos, con su mayor exponente.', ecuacion: ['12 = ', { sup: ['2', '2'] }, ' · 3', '   ·   ', '18 = 2 · ', { sup: ['3', '2'] }, '   ·   ', MCM, ' = ', { sup: ['2', '2'] }, ' · ', { sup: ['3', '2'] }, ' = 36'] },
      ],
    },
    regla: {
      texto: 'El MCM es el menor múltiplo positivo de los dos. Responde a «¿cuándo vuelven a coincidir?» o «la menor cantidad que se arma con ambas medidas».',
      ecuacion: [{ llave: [mcmab], nota: 'primer encuentro', color: 'c-h' }, ' = producto de todos los primos con su mayor exponente'],
      condicion: 'a y b son enteros positivos y los dos sucesos parten juntos del instante 0.',
    },
    // Así se resuelve (fase 2): el mismo problema de «Ahora tú» (combis o pilas de cajas), con otras semillas.
    resuelve: {
      generar(s) {
        const r = azar(s + 900), g = r.de([2, 3, 4, 5, 6]);
        let m = r.ent(2, 5), n = r.ent(2, 7);
        while (mcd(m, n) !== 1 || m === n) n = n % 7 + 2;
        const a = g * m, b = g * n, c = mcm(a, b), combis = s % 2 === 0, u = combis ? 'min' : 'cm';
        const max = Math.max(c, a * b > 90 ? 90 : a * b) * 1.1 + 2;
        const ca = { v: 'c-o', t: String(a) }, cb = { v: 'c-i', t: String(b) };
        const fac = [`${a} = `, ...potencia(factores(a)), '   ·   ', `${b} = `, ...potencia(factores(b)), '   ·   ', MCM, ' = ', ...potencia(factores(c)), ` = ${c}`];
        return {
          enunciado: combis
            ? ['Dos combis salen juntas; una cada ', ca, ' min y otra cada ', cb, ' min. ¿En cuántos minutos vuelven a salir juntas?']
            : ['Se apilan cajas de ', ca, ' cm y, al lado, cajas de ', cb, ' cm. ¿A qué altura mínima coinciden las dos pilas?'],
          dibujo: { datos: rectaBuses(a, b, max, false), estado: {} },
          pasos: [
            { tipo: 'pide', texto: combis ? 'Piden el primer minuto, después de la salida, en que las dos vuelven a salir juntas.' : 'Piden la menor altura en que las dos pilas miden lo mismo.' },
            { tipo: 'datos', texto: ['En la recta, los puntos naranjas van cada ', ca, ` ${u} y los turquesa, cada `, cb, ` ${u}. Busco el primer punto que está en las dos filas.`] },
            { tipo: 'regla', texto: 'Coinciden en los múltiplos comunes, y la primera vez es el menor de ellos: el MCM. Tomo todos los primos con su mayor exponente.' },
            { tipo: 'cuentas', texto: 'Descompongo los dos en primos y armo el MCM.', ecuacion: fac, dibujo: { datos: rectaBuses(a, b, max), estado: {} } },
            { tipo: 'sentido', texto: `Comprueba: ${c} ÷ ${a} = ${c / a} y ${c} ÷ ${b} = ${c / b}, exactos. El producto ${a * b} también es común, pero llega después.` },
          ],
          respuesta: combis ? ['Vuelven a salir juntas a los ', { v: 'c-h', t: `${c} minutos` }, '.'] : ['Las pilas coinciden a ', { v: 'c-h', t: `${c} cm` }, ' de altura.'],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), g = r.de([2, 3, 4, 5, 6]);
        let m = r.ent(2, 5), n = r.ent(2, 7);
        while (mcd(m, n) !== 1 || m === n) n = n % 7 + 2;
        const a = g * m, b = g * n, c = mcm(a, b);
        const ctx = r.de([['Dos combis salen juntas; una cada ', ' min y otra cada ', ' min. ¿En cuántos minutos vuelven a salir juntas?', 'minutos'],
          ['Se apilan cajas de ', ' cm y, al lado, cajas de ', ' cm. ¿A qué altura mínima coinciden las dos pilas?', 'cm']]);
        return {
          pregunta: [ctx[0], { v: 'c-o', t: String(a) }, ctx[1], { v: 'c-i', t: String(b) }, ctx[2]],
          dibujo: { datos: rectaBuses(a, b, Math.max(c, a * b > 90 ? 90 : a * b) * 1.1 + 2, false), estado: {} },
          opciones: opciones(c, [
            { id: 'mcd', valor: g, error: 'AR13', siFuera: `${g} es el MCD: divide a los dos, pero no es múltiplo de ellos.` },
            { id: 'producto', valor: a * b, error: 'AR13', siFuera: `En ${a * b} también coinciden, pero ya lo hicieron antes.` },
            { id: 'suma', valor: a + b, error: 'AT-SUMA-PERIODOS', siFuera: 'La suma no tiene por qué ser múltiplo de los dos.' },
          ], n2 => `${f(n2)} ${ctx[3]}`),
          solucion: { texto: 'El primer múltiplo común de los dos.', ecuacion: [MCM, `(${a}, ${b}) = ${c}`], dibujo: { datos: rectaBuses(a, b, Math.max(c, a * b > 90 ? 90 : a * b) * 1.1 + 2), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: Euclides cambia el par sin cambiar el MCD ----------
  // Cambia: a y b. Permanece: la escala de las tiras. Progresa: (a, b) → (b, r) → … hasta resto 0.
  // Se reserva: la última tira, que se mide exacto. Debe verse: el resto de cada paso es la medida del siguiente.
  const tirasEuclides = (a, b, hasta) => {
    const ps = euclides(a, b).slice(0, 4);
    const tiras = ps.map((p, k) => ({
      rotulo: `${p.a} = ${p.q} · ${p.b}${p.r ? ` + ${p.r}` : ''}`, color: k % 2 ? 'i' : 'o', paso: k,
      tramos: [{ valor: p.q * p.b, partes: p.q, color: k % 2 ? 'i' : 'o' }, ...(p.r ? [{ valor: p.r, color: 'h', texto: String(p.r) }] : [])],
      sinContorno: true,
    }));
    return { max: a, tiras: hasta === undefined ? tiras : tiras.slice(0, hasta), filas: 4 };
  };
  const euclidesIdea = {
    id: 'euclides',
    titulo: 'Euclides: medir con el resto',
    temas: ['Algoritmo de Euclides'],
    pieza: 'arit-tiras',
    // Lee (fase 2): las partes de una división y quién fue Euclides; no dice qué par conserva el MCD.
    lee: {
      tarjetas: [
        { titulo: 'Las partes de una división', texto: 'En el mercado, 23 papas se reparten en bolsas de 5: salen 4 bolsas y sobran 3. Ahí 23 es el dividendo, 5 el divisor, 4 el cociente y 3 el resto.',
          ecuacion: ['23 = 4 · 5 + 3'] },
        { titulo: 'Un método muy antiguo', texto: 'Hace más de 2000 años, Euclides buscaba la mayor medida que cabe exacta en dos segmentos. Su método, el algoritmo de Euclides, usa solo divisiones, una detrás de otra.' },
        { titulo: 'Qué mirar', texto: 'En el juego, cada fila es una división. Fíjate en el tramo rojo de cada fila y en lo que pasa en la fila de abajo. Mira también cuándo ya no aparece.' },
      ],
    },
    juega: {
      consigna: 'Elige a y b. Cada fila mide la tira anterior con la medida que sobró. Mira cuándo ya no sobra nada.',
      voz: 'El resto rojo pasa a ser la medida de la fila siguiente.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 30, max: 90, paso: 6, inicio: 84, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 10, max: 28, paso: 2, inicio: 24, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tirasEuclides(v.a, v.b), estado: { paso: 4 } }),
      lectura: v => { const n = euclides(v.a, v.b).length; return [MCD, `(${v.a}, ${v.b}) = ${mcd(v.a, v.b)}, en ${n} ${n === 1 ? 'división' : 'divisiones'}`]; },
      minimo: 3,
      // Se arrastra la medida b en la primera fila (el fin de su primer tramo): la tira a fija la escala.
      arrastres: [{ id: 'medida-b', etiqueta: 'la medida b en la primera fila', color: 'c-i',
        donde: v => enTira(tirasEuclides(v.a, v.b), 0, v.b),
        mover: (pt, v) => ({ b: valorEn(tirasEuclides(v.a, v.b), pt.x) }) }],
    },
    predice: {
      pregunta: ['Al dividir ', { v: 'c-o', t: '91' }, ' entre ', { v: 'c-i', t: '35' }, ' el cociente es 2 y sobran 21. Sin factorizar, ¿qué par tiene el mismo MCD que (91, 35)?'],
      opciones: [
        { id: 'c', texto: '(35, 21)', correcta: true },
        { id: 'cociente', texto: '(35, 2)', error: 'AT-COCIENTE', siFuera: 'El cociente cuenta cuántas veces cupo; lo que sigue midiendo es el resto.' },
        { id: 'resta', texto: '(91, 21)', error: 'AT-EUCLIDES', siFuera: 'Ese par también lo comparte, pero no avanza: el algoritmo deja el menor y el resto.' },
        { id: 'suma', texto: '(126, 35)', error: 'AT-EUCLIDES', siFuera: 'Sumar no achica el problema; Euclides reemplaza por el resto, que es menor.' },
      ],
      dibujo: { datos: tirasEuclides(91, 35, 1), estado: { paso: 0 } },
      revelar: { datos: tirasEuclides(91, 35), estado: { paso: 4 } },
      coincide: 'Coincide: todo divisor de 91 y 35 divide también a 91 − 2 · 35 = 21.',
    },
    mira: {
      datos: tirasEuclides(91, 35),
      pasos: [
        { estado: { paso: 0 }, texto: '35 cabe 2 veces en 91 y sobran 21.', ecuacion: ['91 = 2 · 35 + 21'] },
        { estado: { paso: 1 }, texto: 'Ahora se mide 35 con 21: cabe 1 vez y sobran 14.', ecuacion: ['35 = 1 · 21 + 14'] },
        { estado: { paso: 2 }, texto: '21 con 14: cabe 1 vez y sobran 7.', ecuacion: ['21 = 1 · 14 + 7'] },
        { estado: { paso: 3 }, texto: '7 mide a 14 exacto: el último divisor es el MCD.', ecuacion: ['14 = 2 · 7', '   ·   ', MCD, '(91, 35) = 7'] },
      ],
    },
    regla: {
      texto: 'Si a = q · b + r, los divisores comunes de a y b son los mismos que los de b y r. Repetirlo hasta resto 0 es el algoritmo de Euclides.',
      ecuacion: [mcdab, ' = ', MCD, '(', Bv, ', ', 'r', ')', '   ·   ', A, ' = ', { llave: ['q'], nota: 'cociente' }, ' · ', Bv, ' + ', { llave: ['r'], nota: 'resto' }],
      condicion: 'a y b enteros positivos y 0 ≤ r < b. El MCD es el último divisor, el que da resto 0.',
    },
    // Así se resuelve (fase 2): el MCD por divisiones sucesivas o el par menor con el mismo MCD, como «Ahora tú».
    resuelve: {
      generar(s) {
        const r = azar(s + 900), g = r.de([3, 4, 6, 7, 8, 9, 11, 12]);
        let m = r.ent(5, 13), n = r.ent(2, m - 1);
        while (mcd(m, n) !== 1) n = n > 2 ? n - 1 : m - 1;
        const a = g * m, b = g * n, ps = euclides(a, b), p0 = ps[0], d = ps[ps.length - 1].b;
        const ca = { v: 'c-o', t: String(a) }, cb = { v: 'c-i', t: String(b) };
        const dibujo = { datos: tirasEuclides(a, b, 1), estado: { paso: 0 } };
        if (s % 2 === 0) return {
          enunciado: ['Usa divisiones sucesivas para hallar el MCD de ', ca, ' y ', cb, '.'],
          dibujo,
          pasos: [
            { tipo: 'pide', texto: ['Piden el MCD de ', ca, ' y ', cb, ' sin factorizar, con divisiones sucesivas.'] },
            { tipo: 'datos', texto: ['El mayor es ', ca, '. Empiezo dividiéndolo entre ', cb, '.'], ecuacion: [`${a} = ${p0.q} · ${b} + ${p0.r}`] },
            { tipo: 'regla', texto: 'Si cambio el par por el divisor y el resto, el MCD no cambia. Repito hasta que el resto sea 0; el último divisor es el MCD.' },
            { tipo: 'cuentas', texto: `Hago ${ps.length} divisiones; cada resto pasa a ser el divisor de la siguiente.`, ecuacion: juntas(ps.map(p => `${p.a} = ${p.q} · ${p.b} + ${p.r}`)),
              dibujo: { datos: tirasEuclides(a, b), estado: { paso: 4 } } },
            { tipo: 'sentido', texto: `Comprueba: ${d} divide a los dos, ${a} = ${a / d} · ${d} y ${b} = ${b / d} · ${d}, y ${a / d} y ${b / d} ya no comparten divisores.` },
          ],
          respuesta: [MCD, `(${a}, ${b}) = ${d}`],
        };
        return {
          enunciado: ['Al dividir ', ca, ' entre ', cb, ` el cociente es ${p0.q} y el resto ${p0.r}. ¿Qué par tiene el mismo MCD y es menor?`],
          dibujo,
          pasos: [
            { tipo: 'pide', texto: ['Piden un par de números más chicos que ', ca, ' y ', cb, ', con el mismo MCD.'] },
            { tipo: 'datos', texto: `La división ya está hecha: cociente ${p0.q} y resto ${p0.r}.`, ecuacion: [`${a} = ${p0.q} · ${b} + ${p0.r}`] },
            { tipo: 'regla', texto: 'Todo número que divide al dividendo y al divisor divide también al resto. Por eso el par divisor y resto conserva el MCD.' },
            { tipo: 'cuentas', texto: ['Dejo el divisor ', cb, ` y pongo el resto ${p0.r} en lugar de `, ca, '. El cociente no entra.'], ecuacion: [MCD, `(${a}, ${b}) = `, MCD, `(${b}, ${p0.r})`] },
            { tipo: 'sentido', texto: `Comprueba: los dos pares tienen MCD ${mcd(b, p0.r)}, y ${b} y ${p0.r} son menores que ${a}.`, ecuacion: [MCD, `(${a}, ${b}) = ${mcd(a, b)}`, '   ·   ', MCD, `(${b}, ${p0.r}) = ${mcd(b, p0.r)}`] },
          ],
          respuesta: `El par (${b}, ${p0.r}).`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), g = r.de([3, 4, 6, 7, 8, 9, 11, 12]);
        let m = r.ent(5, 13), n = r.ent(2, m - 1);
        while (mcd(m, n) !== 1) n = n > 2 ? n - 1 : m - 1;
        const a = g * m, b = g * n, ps = euclides(a, b);
        if (s % 2 === 0) return {
          pregunta: ['Usa divisiones sucesivas para hallar el MCD de ', { v: 'c-o', t: String(a) }, ' y ', { v: 'c-i', t: String(b) }, '.'],
          opciones: opciones(g, [
            { id: 'resto', valor: ps[0].r, error: 'AT-EUCLIDES', siFuera: 'Ese es el primer resto; hay que seguir hasta que el resto sea 0.' },
            { id: 'cociente', valor: ps[0].q, error: 'AT-COCIENTE', siFuera: 'El cociente no es una medida común; lo es el último divisor.' },
            { id: 'mcm', valor: mcm(a, b), error: 'AR13', siFuera: 'Ese es el MCM, el menor múltiplo común.' },
          ], String),
          solucion: { texto: 'El último divisor, el que deja resto 0.', ecuacion: juntas(ps.map(p => `${p.a} = ${p.q} · ${p.b} + ${p.r}`)), dibujo: { datos: tirasEuclides(a, b), estado: { paso: 4 } } },
        };
        return {
          pregunta: ['Al dividir ', { v: 'c-o', t: String(a) }, ' entre ', { v: 'c-i', t: String(b) }, ` el cociente es ${ps[0].q} y el resto ${ps[0].r}. ¿Qué par tiene el mismo MCD y es menor?`],
          opciones: opciones(`(${b}, ${ps[0].r})`, [
            { id: 'cociente', valor: `(${b}, ${ps[0].q})`, error: 'AT-COCIENTE', siFuera: 'El cociente cuenta veces; el que sigue midiendo es el resto.' },
            { id: 'a-r', valor: `(${a}, ${ps[0].r})`, error: 'AT-EUCLIDES', siFuera: 'Se conserva el divisor b, no el dividendo a.' },
            { id: 'q-r', valor: `(${ps[0].q}, ${ps[0].r})`, error: 'AT-COCIENTE', siFuera: 'El par nuevo es divisor y resto, no cociente y resto.' },
          ], String),
          solucion: { texto: 'El divisor pasa a dividendo y el resto, a divisor.', ecuacion: [MCD, `(${a}, ${b}) = `, MCD, `(${b}, ${ps[0].r})`] },
        };
      },
    },
  };

  // ---------- Idea 4: mcd · mcm = a · b, solo con dos números ----------
  // Cambia: a y b (números con primos 2, 3 y 5). Permanece: la tabla de exponentes.
  // Progresa: exponentes de a y b → menor y mayor de cada fila → productos. Se reserva: el tercer número que rompe la regla.
  // Debe verse: en cada fila, menor + mayor = los dos exponentes.
  const PRIMOS = [2, 3, 5];
  const exp = (n, p) => { let e = 0; while (n % p === 0) { n /= p; e++; } return e; };
  const tablaDos = (a, b, pasoMin = 0) => ({
    columnas: [{ t: 'primo' }, { t: String(a), color: 'o' }, { t: String(b), color: 'i' }, { t: 'menor', color: 'd' }, { t: 'mayor', color: 'h' }],
    filas: [...PRIMOS.map(p => [p, exp(a, p), exp(b, p), { t: String(Math.min(exp(a, p), exp(b, p))), color: 'd', paso: pasoMin }, { t: String(Math.max(exp(a, p), exp(b, p))), color: 'h', paso: pasoMin }]),
      ['valor', { t: String(a), color: 'o' }, { t: String(b), color: 'i' }, { t: String(mcd(a, b)), color: 'd', resalta: true, paso: pasoMin + 1 }, { t: String(mcm(a, b)), color: 'h', resalta: true, paso: pasoMin + 1 }]],
    filasMax: 4, cabeza: true,
  });
  const tablaTres = {
    columnas: [{ t: 'primo' }, { t: '4' }, { t: '6' }, { t: '10' }, { t: 'menor', color: 'd' }, { t: 'mayor', color: 'h' }],
    filas: [[2, 2, 1, 1, { t: '1', color: 'd' }, { t: '2', color: 'h', paso: 0 }], [3, 0, 1, 0, { t: '0', color: 'd' }, { t: '1', color: 'h' }], [5, 0, 0, 1, { t: '0', color: 'd' }, { t: '1', color: 'h' }],
      ['valor', '4', '6', '10', { t: '2', color: 'd', resalta: true, paso: 1 }, { t: '60', color: 'h', resalta: true, paso: 1 }]],
    filasMax: 4, cabeza: true,
  };
  const relacion = {
    id: 'mcd-por-mcm',
    titulo: 'MCD por MCM, con dos números',
    temas: ['Relación entre MCD y MCM'],
    pieza: 'arit-tabla',
    // Lee (fase 2): factores primos y cómo se lee la tabla; no dice qué pasa con tres números.
    lee: {
      tarjetas: [
        { titulo: 'Números hechos de primos', texto: 'Todo número mayor que 1 se escribe como producto de primos. El número chico de arriba es el exponente: dice cuántas veces se repite ese primo.',
          ecuacion: ['20 = 2 · 2 · 5 = ', { sup: ['2', '2'] }, ' · 5'] },
        { titulo: 'La tabla de exponentes', texto: 'En la tabla, cada fila es un primo y cada columna, un número. El 20 lleva un 2 en la fila del 2, un 0 en la del 3 y un 1 en la del 5.' },
        { titulo: 'Qué mirar', texto: 'Al jugar, compara en cada fila las columnas «menor» y «mayor» con los exponentes de a y de b. Después revisa la fila de abajo, la del valor.' },
      ],
    },
    juega: {
      consigna: 'Elige a y b. La tabla muestra sus exponentes; el MCD toma el menor de cada fila y el MCM, el mayor.',
      voz: 'Compara, en cada fila, el menor más el mayor con los dos exponentes.',
      controles: [
        { id: 'a', etiqueta: 'a', opciones: [12, 18, 20, 30, 45].map(x => ({ valor: x, texto: String(x) })) },
        { id: 'b', etiqueta: 'b', opciones: [8, 15, 24, 40, 50].map(x => ({ valor: x, texto: String(x) })) },
      ],
      dibujo: v => ({ datos: tablaDos(v.a, v.b), estado: { paso: 2 } }),
      lectura: v => [MCD, ' · ', MCM, ` = ${mcd(v.a, v.b)} · ${mcm(v.a, v.b)} = ${mcd(v.a, v.b) * mcm(v.a, v.b)} = ${v.a} · ${v.b}`],
      minimo: 3,
      // Sin arrastre: a y b se eligen de una lista y la tabla es una consecuencia; no hay medida que agarrar.
    },
    predice: {
      pregunta: 'Para 4, 6 y 10, el MCD es 2 y el MCM es 60. ¿El producto MCD · MCM es igual a 4 · 6 · 10?',
      opciones: [
        { id: 'c', texto: 'No: 2 · 60 = 120 y 4 · 6 · 10 = 240', correcta: true },
        { id: 'si', texto: 'Sí, siempre es igual al producto', error: 'AT-TRES', siFuera: 'Es cierto con dos números. Con tres, un exponente del medio no entra ni al menor ni al mayor.' },
        { id: 'mitad', texto: 'Sí, si se divide entre 2', error: 'AT-TRES', siFuera: 'Aquí falta un 2, pero en otros tríos falta otro factor: no hay arreglo fijo.' },
      ],
      dibujo: { datos: tablaTres, estado: { paso: 0 } },
      revelar: { datos: tablaTres, estado: { paso: 1, fila: 0 } },
      coincide: 'Coincide: en la fila del 2 hay tres exponentes (2, 1, 1) y solo entran el menor y el mayor.',
    },
    mira: {
      datos: tablaDos(12, 18, 1),
      pasos: [
        { estado: { paso: 0 }, texto: '12 = 2² · 3 y 18 = 2 · 3²: sus exponentes en la tabla.', ecuacion: ['12 = ', { sup: ['2', '2'] }, ' · 3', '   ·   ', '18 = 2 · ', { sup: ['3', '2'] }] },
        { estado: { paso: 1, columna: 3 }, texto: 'En cada fila, el MCD toma el menor y el MCM, el mayor.', ecuacion: [MCD, ' = 2 · 3 = 6', '   ·   ', MCM, ' = ', { sup: ['2', '2'] }, ' · ', { sup: ['3', '2'] }, ' = 36'] },
        { estado: { paso: 2 }, texto: 'Menor más mayor son los dos exponentes: no se pierde ninguno.', ecuacion: ['6 · 36 = 216 = 12 · 18'] },
      ],
    },
    regla: {
      texto: 'Para dos números, el MCD y el MCM se reparten los exponentes de cada primo sin perder ninguno. Por eso su producto es a · b.',
      ecuacion: [{ llave: [mcdab], nota: 'los menores', color: 'c-d' }, ' · ', { llave: [mcmab], nota: 'los mayores', color: 'c-h' }, ' = ', A, ' · ', Bv],
      condicion: 'vale solo con dos enteros positivos. Con tres o más, el producto de todos no es MCD · MCM.',
    },
    // Así se resuelve (fase 2): hallar el MCM o el otro número con MCD · MCM = a · b, como «Ahora tú».
    resuelve: {
      generar(s) {
        const r = azar(s + 900), g = r.de([2, 3, 4, 5, 6, 7, 8, 9, 12]);
        let m = r.ent(2, 7), n = r.ent(2, 9);
        while (mcd(m, n) !== 1 || m === n) n = n % 9 + 2;
        const a = g * m, b = g * n, c = mcm(a, b), P = a * b;
        const cg = { v: 'c-d', t: String(g) }, cc = { v: 'c-h', t: String(c) }, ca = { v: 'c-o', t: String(a) };
        const regla = { tipo: 'regla', texto: 'Con dos números, el MCD se lleva los menores exponentes y el MCM, los mayores. Juntos dan el producto de los dos.',
          ecuacion: [MCD, ' · ', MCM, ' = ', A, ' · ', Bv] };
        if (s % 2 === 0) return {
          enunciado: ['Dos números positivos tienen producto ', String(P), ' y su MCD es ', cg, '. ¿Cuál es su MCM?'],
          pasos: [
            { tipo: 'pide', texto: 'Piden el MCM de dos números que no conozco; solo sé su producto y su MCD.' },
            { tipo: 'datos', texto: ['El producto es ', String(P), ' y el MCD es ', cg, '.'] },
            regla,
            { tipo: 'cuentas', texto: 'Despejo el MCM: divido el producto entre el MCD.', ecuacion: [MCM, ` = ${P} ÷ ${g} = ${P / g}`] },
            { tipo: 'sentido', texto: `Comprueba: ${g} · ${c} = ${g * c}, el producto. Y ${c} es múltiplo de ${g}: ${c} ÷ ${g} = ${c / g}, como debe ser.` },
          ],
          respuesta: [MCM, ' = ', cc],
        };
        return {
          enunciado: ['El MCD de ', ca, ' y otro número es ', cg, ' y su MCM es ', cc, '. ¿Cuál es el otro número?'],
          pasos: [
            { tipo: 'pide', texto: ['Piden el otro número, ', Bv, ', que va con ', ca, '.'] },
            { tipo: 'datos', texto: ['Conozco ', A, ' = ', ca, '. El MCD es ', cg, ' y el MCM es ', cc, '.'] },
            regla,
            { tipo: 'cuentas', texto: ['Multiplico MCD por MCM y divido entre ', A, '.'], ecuacion: [A, ' · ', Bv, ` = ${g} · ${c} = ${g * c}   →   `, Bv, ` = ${g * c} ÷ ${a} = ${g * c / a}`] },
            { tipo: 'sentido', texto: `Comprueba con ${a} y ${g * c / a}: su MCD es ${mcd(a, g * c / a)} y su MCM es ${mcm(a, g * c / a)}, los datos del problema.` },
          ],
          respuesta: ['El otro número es ', Bv, ` = ${g * c / a}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s), g = r.de([2, 3, 4, 5, 6, 7, 8, 9, 12]);
        let m = r.ent(2, 7), n = r.ent(2, 9);
        while (mcd(m, n) !== 1 || m === n) n = n % 9 + 2;
        const a = g * m, b = g * n, c = mcm(a, b);
        if (s % 2 === 0) return {
          pregunta: ['Dos números positivos tienen producto ', `${a * b}`, ' y su MCD es ', { v: 'c-d', t: String(g) }, '. ¿Cuál es su MCM?'],
          opciones: opciones(c, [
            { id: 'producto', valor: a * b * g, error: 'AT-RELACION', siFuera: 'Eso multiplica por el MCD; el MCM sale de dividir el producto entre él.' },
            { id: 'cuadrado', valor: a * b / (g * g), error: 'AT-RELACION', siFuera: 'Eso divide dos veces entre el MCD.' },
            { id: 'prod', valor: a * b, error: 'AT-RELACION', siFuera: 'El producto es MCD · MCM, no el MCM solo.' },
          ], String),
          solucion: { texto: 'El producto es MCD por MCM.', ecuacion: [MCM, ` = ${a * b} ÷ ${g} = ${c}`] },
        };
        return {
          pregunta: ['El MCD de ', { v: 'c-o', t: String(a) }, ' y otro número es ', { v: 'c-d', t: String(g) }, ' y su MCM es ', { v: 'c-h', t: String(c) }, '. ¿Cuál es el otro número?'],
          opciones: opciones(b, [
            { id: 'cociente', valor: c / g, error: 'AT-RELACION', siFuera: 'Eso es MCM entre MCD; falta multiplicar por el MCD y dividir entre a.' },
            { id: 'sin-mcd', valor: c / a, error: 'AT-RELACION', siFuera: 'Eso olvida el MCD: a · b = MCD · MCM.' },
            { id: 'prod', valor: g * c, error: 'AT-RELACION', siFuera: 'Ese es MCD · MCM, que es a · b; falta dividir entre a.' },
          ], String),
          solucion: { texto: 'Se despeja de a · b = MCD · MCM.', ecuacion: [Bv, ` = ${g} · ${c} ÷ ${a} = ${b}`] },
        };
      },
    },
  };

  // ---------- Idea 5: la fracción continua sale de los cocientes de Euclides ----------
  // Cambia: la fracción a/b. Permanece: la tabla de divisiones. Progresa: cociente por cociente, y los
  // convergentes que se acercan. Se reserva: el último convergente, el único igual a a/b. Debe verse: cortar antes da otro número.
  function convergentes(qs) {
    const out = [];
    let [h1, h0, k1, k0] = [1, 0, 0, 1];
    for (const q of qs) { const h = q * h1 + h0, k = q * k1 + k0; out.push([h, k]); [h0, h1, k0, k1] = [h1, h, k1, k]; }
    return out;
  }
  const fr = ([h, k]) => (k === 1 ? String(h) : `${h}/${k}`);
  const tablaFC = (a, b, pasoConv = 0) => {
    const ps = euclides(a, b), cv = convergentes(ps.map(p => p.q));
    return {
      columnas: [{ t: 'división' }, { t: 'cociente', color: 'd' }, { t: 'resto', color: 'h' }, { t: 'corte' }],
      filas: ps.map((p, k) => [`${p.a} ÷ ${p.b}`, { t: String(p.q), color: 'd', resalta: true }, { t: String(p.r), color: 'h' }, { t: fr(cv[k]), paso: pasoConv + k }]),
      filasMax: 5,
    };
  };
  const fcIdea = {
    id: 'fraccion-continua',
    titulo: 'Los cocientes arman una fracción',
    temas: ['Fracciones continuas'],
    pieza: 'arit-tabla',
    // Lee (fase 2): qué es una fracción continua y cómo se anota; no calcula ningún corte.
    lee: {
      tarjetas: [
        { titulo: 'Una fracción en escalones', texto: 'Una fracción continua escribe un número como un entero más 1 sobre otro número. Ese otro número, a su vez, es un entero más 1 sobre otro, y así baja en escalones.',
          ecuacion: [{ frac: ['7', '3'] }, ' = 2 + ', { frac: ['1', '3'] }] },
        { titulo: 'Cómo se escribe', texto: 'Para no dibujar toda la escalera, se anotan solo sus términos entre corchetes. El primero va separado con punto y coma: es la parte entera.',
          ecuacion: ['[2; 3]'] },
        { titulo: 'Qué mirar', texto: 'En el juego, la tabla repite las divisiones de Euclides. La columna «corte» dice cuánto vale la escalera si la detienes en esa fila. Compárala con tu fracción.' },
      ],
    },
    juega: {
      consigna: 'Elige la fracción. Las divisiones de Euclides dan los cocientes, que se leen en orden como fracción continua.',
      voz: 'Mira la columna del corte: se acerca, pero solo la última es igual.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 20, max: 60, paso: 1, inicio: 30, unidad: '', decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 7, max: 19, paso: 1, inicio: 18, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaFC(v.a, v.b), estado: { paso: 6 } }),
      lectura: v => { const qs = euclides(v.a, v.b).map(p => p.q); return [`${v.a}/${v.b} = [${qs[0]}${qs.length > 1 ? '; ' + qs.slice(1).join(', ') : ''}]`]; },
      minimo: 3,
      // Sin arrastre: la tabla es el registro de las divisiones; a y b son datos, no medidas de la figura. (El gesto de
      // medir con el resto vive en la idea 3, con las tiras.)
    },
    predice: {
      pregunta: '30/18 = 1 + 1/(1 + 1/2), que se escribe [1; 1, 2]. Si se corta en [1; 1], es decir 1 + 1/1, ¿qué número da?',
      opciones: [
        { id: 'c', texto: '2', correcta: true },
        { id: 'igual', texto: '5/3, el mismo valor', error: 'AT-CONVERGENTE', siFuera: 'Sería cierto si cortar no cambiara nada; un corte es una aproximación.' },
        { id: 'medio', texto: '3/2', error: 'AT-CONVERGENTE', siFuera: '3/2 es 1 + 1/2: salta el segundo cociente.' },
        { id: 'uno', texto: '1', error: 'AT-CONVERGENTE', siFuera: '1 es el corte en [1]; [1; 1] suma 1/1.' },
      ],
      dibujo: { datos: tablaFC(30, 18, 9), estado: { paso: 0 } },
      revelar: { datos: tablaFC(30, 18), estado: { paso: 6, fila: 1 } },
      coincide: 'Coincide: 1 + 1/1 = 2; recién el último corte da 5/3.',
    },
    mira: {
      datos: tablaFC(30, 18, 1),
      pasos: [
        { estado: { paso: 0 }, texto: 'Euclides con 30 y 18 da los cocientes 1, 1 y 2.', ecuacion: juntas(['30 = 1 · 18 + 12', '18 = 1 · 12 + 6', '12 = 2 · 6']) },
        { estado: { paso: 1 }, texto: 'Primer corte: solo la parte entera.', ecuacion: ['[1] = 1'] },
        { estado: { paso: 2 }, texto: 'Segundo corte: 1 + 1/1.', ecuacion: ['[1; 1] = 1 + ', { frac: ['1', '1'] }, ' = 2'] },
        { estado: { paso: 3 }, texto: 'Con todos los cocientes sale el valor exacto.', ecuacion: ['[1; 1, 2] = 1 + ', { frac: ['1', ['1 + ', { frac: ['1', '2'] }]] }, ' = ', { frac: ['5', '3'] }, ' = ', { frac: ['30', '18'] }] },
      ],
    },
    regla: {
      texto: 'Los cocientes de Euclides son los términos de la fracción continua de a/b. Cada corte da un convergente; solo el último es igual a a/b.',
      ecuacion: [{ frac: [A, Bv] }, ' = ', { sub: ['q', '0'] }, ' + ', { frac: ['1', [{ sub: ['q', '1'] }, ' + ', { frac: ['1', [{ sub: ['q', '2'] }, ' + …']] }]] }],
      condicion: 'a y b son enteros positivos, así que la fracción continua es finita. Los cortes intermedios son aproximaciones.',
    },
    // Así se resuelve (fase 2): la fracción continua de a/b o su valor sin el último término, como «Ahora tú».
    resuelve: {
      generar(s) {
        const r = azar(s + 900);
        let a, b, ps;
        do { b = r.ent(5, 19); a = r.ent(b + 1, 3 * b + 9); ps = euclides(a, b); } while (mcd(a, b) !== 1 || ps.length < 2 || ps.length > 4);
        const qs = ps.map(p => p.q), cv = convergentes(qs);
        const lista = xs => `[${xs[0]}${xs.length > 1 ? '; ' + xs.slice(1).join(', ') : ''}]`;
        const fab = { frac: [{ v: 'c-o', t: String(a) }, { v: 'c-i', t: String(b) }] };
        const tabla = fila => ({ datos: tablaFC(a, b), estado: fila === undefined ? { paso: 6 } : { paso: 6, fila } });
        if (s % 2 === 0) return {
          enunciado: ['¿Cuál es la fracción continua de ', fab, '?'],
          pasos: [
            { tipo: 'pide', texto: 'Piden la fracción continua: la lista de sus términos, en orden.' },
            { tipo: 'datos', texto: ['La fracción es ', fab, '. Empiezo dividiendo el numerador entre el denominador.'] },
            { tipo: 'regla', texto: 'Los términos son los cocientes de las divisiones de Euclides, en el orden en que salen. El primero es la parte entera.' },
            { tipo: 'cuentas', texto: `Divido hasta que el resto sea 0; los cocientes son ${qs.join(', ')}.`, ecuacion: juntas(ps.map(p => `${p.a} = ${p.q} · ${p.b} + ${p.r}`)), dibujo: tabla() },
            { tipo: 'sentido', texto: 'Comprueba: si calculo la lista completa de abajo hacia arriba, vuelve a dar la fracción.', ecuacion: [`${lista(qs)} = ${fr(cv[cv.length - 1])} = `, fab] },
          ],
          respuesta: [fab, ` = ${lista(qs)}`],
        };
        const corto = qs.slice(0, -1), corte = cv[cv.length - 2];
        // De abajo hacia arriba: cada escalón es q + 1/(lo de abajo); el resultado se compara con el convergente del motor.
        const sube = [];
        let [h, k] = [corto[corto.length - 1], 1];
        for (let i = corto.length - 2; i >= 0; i--) { const nh = corto[i] * h + k; sube.push([`${corto[i]} + `, { frac: ['1', fr([h, k])] }, ` = ${fr([nh, h])}`]); [h, k] = [nh, h]; }
        if (h * corte[1] !== k * corte[0]) throw new Error('el escalón no da el convergente');
        return {
          enunciado: [fab, ` = ${lista(qs)}. ¿Qué fracción da si se quita el último término?`],
          pasos: [
            { tipo: 'pide', texto: 'Piden el valor de la fracción continua cortada antes del último término.' },
            { tipo: 'datos', texto: `Quito el ${qs[qs.length - 1]} del final: queda ${lista(corto)}.` },
            { tipo: 'regla', texto: 'Se calcula de abajo hacia arriba: el último término que queda va abajo, y cada término de arriba suma 1 sobre lo de abajo.' },
            sube.length
              ? { tipo: 'cuentas', texto: 'Subo escalón por escalón.', ecuacion: juntas(sube).reduce((acc, x) => acc.concat(x), []), dibujo: tabla(qs.length - 2) }
              : { tipo: 'cuentas', texto: 'Queda un solo término: el corte es la parte entera.', ecuacion: [`${lista(corto)} = ${fr(corte)}`], dibujo: tabla(qs.length - 2) },
            { tipo: 'sentido', texto: `Comprueba: ${fr(corte)} ≈ ${f(corte[0] / corte[1], 3)} y ${a}/${b} ≈ ${f(a / b, 3)}. Están cerca, pero no son iguales: es una aproximación.` },
          ],
          respuesta: `Sin el último término da ${fr(corte)}.`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const r = azar(s);
        let a, b, ps;
        do { b = r.ent(5, 19); a = r.ent(b + 1, 3 * b + 9); ps = euclides(a, b); } while (mcd(a, b) !== 1 || ps.length < 2 || ps.length > 4);
        const qs = ps.map(p => p.q), cv = convergentes(qs);
        const lista = xs => `[${xs[0]}${xs.length > 1 ? '; ' + xs.slice(1).join(', ') : ''}]`;
        if (s % 2 === 0) return {
          pregunta: ['¿Cuál es la fracción continua de ', { frac: [{ v: 'c-o', t: String(a) }, { v: 'c-i', t: String(b) }] }, '?'],
          opciones: opciones(lista(qs), [
            { id: 'restos', valor: lista([qs[0], ...ps.slice(0, -1).map(p => p.r)]), error: 'AT-COCIENTE', siFuera: 'Eso pone los restos; los términos son los cocientes.' },
            { id: 'invertido', valor: lista(qs.slice().reverse()), error: 'AT-CONVERGENTE', siFuera: 'Los cocientes van en el orden en que salen.' },
            { id: 'corto', valor: lista(qs.slice(0, -1)), error: 'AT-CONVERGENTE', siFuera: 'Falta el último cociente, el de resto 0.' },
          ], String),
          solucion: { texto: 'Los cocientes de las divisiones sucesivas, en orden.', ecuacion: juntas(ps.map(p => `${p.a} = ${p.q} · ${p.b} + ${p.r}`)), dibujo: { datos: tablaFC(a, b), estado: { paso: 6 } } },
        };
        const corte = cv[cv.length - 2];
        return {
          pregunta: [{ frac: [String(a), String(b)] }, ` = ${lista(qs)}. ¿Qué fracción da si se quita el último término?`],
          opciones: opciones(fr(corte), [
            { id: 'igual', valor: `${a}/${b}`, error: 'AT-CONVERGENTE', siFuera: 'Sin el último término el valor cambia: es una aproximación.' },
            { id: 'entero', valor: String(qs[0]), error: 'AT-CONVERGENTE', siFuera: 'Ese es el primer corte, solo la parte entera.' },
            { id: 'otro', valor: fr([corte[0] + 1, corte[1]]), error: 'AT-CONVERGENTE', siFuera: 'Revisa la cuenta de abajo hacia arriba, término por término.' },
          ], String),
          solucion: { texto: 'Se calcula de abajo hacia arriba sin el último término.', ecuacion: [`${lista(qs.slice(0, -1))} = ${fr(corte)}`], dibujo: { datos: tablaFC(a, b), estado: { paso: 6, fila: qs.length - 2 } } },
        };
      },
    },
  };

  // Mesa «tres combis»: tres filas de salidas en 0 a 120 minutos y el primer encuentro de las tres, si cae en la recta. La
  // tercera combi va en tinta: el verde es del MCD y el rojo del MCM (regla 4).
  const mcm3 = (a, b, c) => mcm(mcm(a, b), c);
  // Para los retos: el primer encuentro más temprano con tres periodos distintos (2 a 8). Lo calcula el motor.
  const TRES = []; for (let a = 2; a <= 8; a++) for (let b = a + 1; b <= 8; b++) for (let c = b + 1; c <= 8; c++) TRES.push(mcm3(a, b, c));
  const MIN3 = Math.min(...TRES);
  const mismo = (g, v, ks) => g.some(x => ks.every(k => x[k] === v[k]));
  const rectaTres = (a, b, c) => {
    const m = mcm3(a, b, c);
    return {
      min: 0, max: 120, paso: 5, cada: 4, decimales: 0, variable: 'minutos', filas: 4,
      elementos: [
        { tipo: 'enteros', a, b: 120, cada: a, color: 'o', fila: 3, rotulo: `cada ${a}` },
        { tipo: 'enteros', a: b, b: 120, cada: b, color: 'i', fila: 2, rotulo: `cada ${b}` },
        { tipo: 'enteros', a: c, b: 120, cada: c, fila: 1, rotulo: `cada ${c}` },
        ...(m <= 120 ? [{ tipo: 'punto', x: m, color: 'h', fila: 4, rotulo: `las tres: ${m}` }] : []),
      ],
    };
  };

  // Mesas 3D (ronda 4, docs/3d.md): el MCD y el MCM de tres números, que en las cintas no se ven juntos.
  // Caja · Cambia: los lados y el cubo de prueba · Permanece: la caja punteada · Progresa: de sobrar a llenar justo ·
  //   Se reserva: el verde, solo para el cubo que divide a los tres · Debe verse: el cubo más grande que llena es el MCD.
  // Ladrillos · Cambia: el ladrillo y el lado del cubo · Permanece: el cubo punteado, en rojo · Progresa: los ladrillos
  //   de cada lado, en el color de su medida · Se reserva: el cierre justo · Debe verse: el cubo más chico es el MCM.
  const C3 = { v: 'c-f', t: 'c' };
  const llena = v => MF.llenarCaja(v.a, v.b, v.c, v.m);
  const cierra = v => MF.cuboDeLadrillos(v.a, v.b, v.c, v.L);
  const ladosCaja = [
    { id: 'a', etiqueta: 'a', color: 'c-o', min: 2, max: 12, paso: 1, inicio: 12, unidad: 'cm', decimales: 0 },
    { id: 'b', etiqueta: 'b', color: 'c-i', min: 2, max: 12, paso: 1, inicio: 8, unidad: 'cm', decimales: 0 },
    { id: 'c', etiqueta: 'c', color: 'c-f', min: 2, max: 8, paso: 1, inicio: 6, unidad: 'cm', decimales: 0 },
  ];
  function datosLlena(v) {
    const r = llena(v);
    return {
      bloques: r.cubos.map(q => ({ x: q.x, y: q.y, z: q.z, w: r.m, h: r.m, d: r.m, g: 0 })),
      grupos: [{ nombre: `cubos de ${r.m} cm`, color: r.justo ? 'c-d' : null, dice: `${r.cantidad} cubos de ${r.m} cm${r.justo ? ', llenan justo' : ''}` }],
      marco: { x: 0, y: 0, z: 0, w: v.a, h: v.b, d: v.c },
      // Cada medida junto a su lado, afuera de la caja (el margen crece con la caja, para no caer encima).
      marcas: (o => [
        { p: [v.a / 2, -o, 0], texto: `${v.a}`, color: 'c-o' },
        { p: [v.a + o, v.b * 0.6, 0], texto: `${v.b}`, color: 'c-i' },
        { p: [v.a + o, -o, v.c / 2], texto: `${v.c}`, color: 'c-f' },
      ])(0.6 + 0.12 * Math.max(v.a, v.b, v.c)),
      hueco: 0.15 * Math.min(1, r.m / 2),
      alt: `Caja de ${v.a} por ${v.b} por ${v.c} cm con cubos de ${r.m} cm: caben ${r.cantidad}` + (r.justo ? ' y la llenan justo.' : ' y sobra espacio.'),
    };
  }
  function datosLadrillos(v) {
    const r = cierra(v), eje = ['c-o', 'c-i', 'c-f'];
    return {
      bloques: r.aristas.map(q => ({ x: q.x, y: q.y, z: q.z, w: v.a, h: v.b, d: v.c, g: q.eje + 1 })),
      grupos: [
        { nombre: 'ladrillo de la esquina', dice: 'El ladrillo de la esquina cuenta en los tres lados.' },
        ...[0, 1, 2].map(k => ({ nombre: `ladrillos a lo ${['largo', 'ancho', 'alto'][k]}`, color: eje[k], dice: `${r.porArista[k]} ladrillos de ${r.lados[k]} cm a lo ${['largo', 'ancho', 'alto'][k]}` })),
      ],
      marco: { x: 0, y: 0, z: 0, w: v.L, h: v.L, d: v.L, color: 'c-h' },
      marcas: [
        { p: [v.L / 2, -0.25 * v.L, 0], texto: `×${r.porArista[0]}`, color: 'c-o' },
        { p: [-0.25 * v.L, v.L / 2, 0], texto: `×${r.porArista[1]}`, color: 'c-i' },
        { p: [-0.15 * v.L, 0, 0.75 * v.L], texto: `×${r.porArista[2]}`, color: 'c-f' },
      ],
      hueco: 0.12,
      alt: `Cubo de lado ${v.L} con ladrillos de ${v.a} por ${v.b} por ${v.c}: ` + (r.justo ? `cierra justo con ${f(r.ladrillos, 0)} ladrillos.` : `${r.sobra.map((x, k) => (x ? `${v.L} no es múltiplo de ${r.lados[k]}` : '')).filter(Boolean).join(' y ')}.`),
    };
  }
  const mesaLlena = {
    id: 'caja-que-se-llena', titulo: 'La caja que se llena', pieza: 'ari-cubitos-3d',
    consigna: 'Gira la caja con el dedo. Cambia sus lados y el lado de los cubos: busca cubos que la llenen sin dejar hueco.',
    controles: ladosCaja.concat([{ id: 'm', etiqueta: 'Lado del cubo', color: 'c-d', min: 1, max: 12, paso: 1, inicio: 5, unidad: 'cm', decimales: 0 }]),
    dibujo: v => ({ datos: datosLlena(v), estado: {} }),
    lectura: v => { const r = llena(v); return [`Cubos de ${r.m}: caben ${r.porLado.join(' · ')} = ${r.cantidad}` + (r.esMcd ? ', justo: es el MCD' : r.justo ? ', llenan justo' : ', sobra espacio')]; },
    invitaciones: [
      { texto: 'Llena la caja de 12 × 8 × 6 con los cubos más grandes posibles.',
        logrado: v => v.a === 12 && v.b === 8 && v.c === 6 && llena(v).esMcd,
        bien: 'Lado 2: el mayor que divide a 12, a 8 y a 6. Es el MCD.',
        pista: 'Prueba lados que dividan a 12, a 8 y a 6. ¿Cuál es el mayor?' },
      { texto: 'Arma una caja cuyo MCD sea 4 y llénala con cubos de 4.',
        logrado: v => llena(v).esMcd && v.m === 4,
        bien: 'Cubos de 4 dividen a los tres lados, y ninguno más grande lo hace.',
        pista: 'Usa lados que sean múltiplos de 4, como 8, 12 y 4.' },
      { texto: 'Llena justo una caja que no sea cubo usando solo dos cubos.',
        logrado: v => llena(v).justo && llena(v).cantidad === 2 && !(v.a === v.b && v.b === v.c),
        bien: 'Dos cubos: un lado mide el doble y los otros dos, justo el cubo.',
        pista: 'Busca lados como 12, 6 y 6, con cubos de 6.' },
      { texto: 'Haz que el cubo divida a dos lados y deje hueco solo en el tercero.',
        logrado: v => llena(v).cantidad > 0 && llena(v).sobra.filter(x => x > 0).length === 1,
        bien: 'Basta un lado que el cubo no divida para que la caja no se llene.',
        pista: 'Mira cuál lado deja hueco y cambia solo ese.' },
      { texto: 'Guarda dos llenados justos de una caja: con el MCD y con cubos más chicos.',
        testigo: [{ a: 12, b: 8, c: 6, m: 2 }, { a: 12, b: 8, c: 6, m: 1 }],
        logrado: (v, g) => g.some(x => g.some(y => x.a === y.a && x.b === y.b && x.c === y.c && llena(x).esMcd && llena(y).justo && !llena(y).esMcd)),
        bien: 'Todo divisor común llena; el MCD lo hace con menos cubos.',
        pista: 'Con 12, 8 y 6, guarda cubos de 2 y después de 1.' },
    ],
  };
  const mesaLadrillos = {
    id: 'ladrillos-cubo', titulo: 'Ladrillos que arman un cubo', pieza: 'ari-cubitos-3d',
    consigna: 'Gira el cubo con el dedo. Elige el ladrillo y el lado del cubo: cada lado tiene que llevar ladrillos enteros.',
    controles: [
      { id: 'a', etiqueta: 'largo', color: 'c-o', min: 2, max: 6, paso: 1, inicio: 2, unidad: 'cm', decimales: 0 },
      { id: 'b', etiqueta: 'ancho', color: 'c-i', min: 2, max: 6, paso: 1, inicio: 3, unidad: 'cm', decimales: 0 },
      { id: 'c', etiqueta: 'alto', color: 'c-f', min: 2, max: 6, paso: 1, inicio: 4, unidad: 'cm', decimales: 0 },
      { id: 'L', etiqueta: 'Lado del cubo', color: 'c-h', min: 2, max: 60, paso: 1, inicio: 10, unidad: 'cm', decimales: 0 },
    ],
    dibujo: v => ({ datos: datosLadrillos(v), estado: {} }),
    lectura: v => { const r = cierra(v); return r.justo ? [`Cubo de ${v.L}: ${r.porArista.join(' · ')} = ${f(r.ladrillos, 0)} ladrillos` + (r.esMcm ? ' (MCM)' : '')] : [`Lado ${v.L}: no cierra, ${r.sobra.filter(x => x).length === 1 ? 'un lado sobra' : 'sobran lados'}`]; },
    invitaciones: [
      { texto: 'Arma el cubo más chico con ladrillos de 2 × 3 × 4.',
        logrado: v => v.a === 2 && v.b === 3 && v.c === 4 && cierra(v).esMcm,
        bien: 'Lado 12, el MCM: 6 · 4 · 3 = 72 ladrillos.',
        pista: 'El lado del cubo tiene que ser múltiplo de 2, de 3 y de 4.' },
      { texto: 'Cierra un cubo justo que no sea el más chico posible.',
        logrado: v => cierra(v).justo && !cierra(v).esMcm,
        bien: 'Cualquier múltiplo común cierra; el MCM es solo el primero.',
        pista: 'Encuentra el cubo más chico y duplica su lado.' },
      { texto: 'Elige un ladrillo cuyo cubo más chico mida 60 cm, y ármalo.',
        logrado: v => cierra(v).esMcm && v.L === 60,
        bien: '60 = 2² · 3 · 5: cada primo con su exponente mayor.',
        pista: 'Prueba un ladrillo de 3 × 4 × 5.' },
      { texto: 'Haz que dos lados cierren y uno no.',
        logrado: v => cierra(v).sobra.filter(x => x > 0).length === 1,
        bien: 'Basta un lado que no divida al cubo para que no cierre.',
        pista: 'Con 2 × 3 × 4, prueba un lado de 6 o de 18.' },
      { texto: 'Guarda dos ladrillos distintos con el mismo cubo más chico, ya armado.',
        logrado: (v, g) => g.some(x => g.some(y => cierra(x).esMcm && cierra(y).esMcm && x.L === y.L
          && [x.a, x.b, x.c].sort().join() !== [y.a, y.b, y.c].sort().join())),
        bien: 'El cubo depende de los tres lados juntos, no de un ladrillo en especial.',
        pista: 'Prueba 2 × 3 × 4 y 3 × 4 × 6: los dos cierran en 12.' },
    ],
  };

  return {
    unidad: 'aritmetica.mcd-y-mcm',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-tiras.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/arit-tabla.js', '/plantillas/fracciones/motor.js', '/nucleo/kit/piezas/ari-cubitos-3d.js'],
    // Laboratorio: juego libre, sin preguntas. «Cintas libres» deja elegir los largos (también dos que solo comparten el
    // 1); «Tres combis» agrega una tercera y el caso en que el encuentro cae fuera de la recta; Euclides es el juego de la idea 3.
    glosario: [
      { termino: 'MCM', formas: ['MCM', 'mínimo común múltiplo'],
        def: 'El menor número positivo que es múltiplo de todos los dados. Dice cuándo vuelven a coincidir dos ciclos.',
        ejemplo: 'Alarmas cada 12 y 18 min: suenan juntas a los 36 min, porque MCM(12, 18) = 36.', ver: ['múltiplo común', 'máximo común divisor'] },
      { termino: 'divisor común', formas: ['divisor común', 'divisores comunes'],
        def: 'Número que divide exacto, sin resto, a dos o más números a la vez.',
        ejemplo: '6 divide a 24 y a 36: 24 = 4 · 6 y 36 = 6 · 6.', ver: ['algoritmo de Euclides'] },
      { termino: 'múltiplo común', formas: ['múltiplo común', 'múltiplos comunes'],
        def: 'Número que es múltiplo de dos o más números a la vez: se arma entero con cualquiera de ellos.',
        ejemplo: '72 es múltiplo de 12 y de 18; el menor de esa lista es 36.', ver: ['MCM'] },
      { termino: 'algoritmo de Euclides', formas: ['algoritmo de Euclides'],
        def: 'Divisiones sucesivas donde el resto pasa a ser divisor, hasta resto 0. El último divisor es el MCD.',
        ejemplo: 'Con 91 y 35, los restos son 21, 14, 7 y 0: el MCD es 7.', ver: ['divisor común'] },
      { termino: 'fracción continua', formas: ['fracción continua', 'fracciones continuas'],
        def: 'Escritura de un número como entero más 1 sobre otro entero más 1 sobre…; sus términos son cocientes de Euclides.',
        ejemplo: '30/18 = 1 + 1/(1 + 1/2), que se escribe [1; 1, 2].', ver: ['convergente'] },
      { termino: 'convergente', formas: ['convergente', 'convergentes'],
        def: 'Lo que vale una fracción continua cortada antes del final: una aproximación que se acerca al número.',
        ejemplo: '[1; 1, 2] = 5/3; cortada en [1; 1] da 2.', ver: ['fracción continua'] },
      { termino: 'término', formas: ['término', 'términos'],
        def: 'Cada número de una lista ordenada o de una suma, con su lugar fijo: primero, segundo…',
        ejemplo: '[1; 1, 2] tiene tres: 1, 1 y 2.', ver: ['fracción continua'] },
      { termino: 'aproximación', formas: ['aproximación', 'aproximaciones'],
        def: 'Valor cercano al exacto que se usa en su lugar; conviene saber cuánto se aleja de él.',
        ejemplo: '1,41 aproxima √2: 1,41² = 1,9881, casi 2.', ver: ['convergente'] },
    ],
    laboratorio: [
      mesaLlena, mesaLadrillos,
      {
        id: 'cintas-libres', titulo: 'Cintas de cualquier largo', pieza: 'arit-tiras',
        consigna: 'Arrastra el fin de cada cinta y el fin del primer trozo. Busca el trozo más largo que no deje sobrante.',
        controles: [
          { id: 'a', etiqueta: 'a', color: 'c-o', min: 6, max: 40, paso: 1, inicio: 24, unidad: 'cm', decimales: 0 },
          { id: 'b', etiqueta: 'b', color: 'c-i', min: 6, max: 40, paso: 1, inicio: 36, unidad: 'cm', decimales: 0 },
          { id: 't', etiqueta: 'Trozo', color: 'c-d', min: 1, max: 20, paso: 1, inicio: 5, unidad: 'cm', decimales: 0 },
        ],
        dibujo: v => ({ datos: tirasCorte(v.a, v.b, v.t), estado: {} }),
        lectura: v => [`${v.a} y ${v.b} cm, trozo de ${v.t}: sobran ${v.a % v.t} y ${v.b % v.t}`],
        invitaciones: [
          { texto: 'Con dos cintas distintas, busca el trozo más largo que no deje sobrante.',
            logrado: v => v.a !== v.b && v.t === mcd(v.a, v.b),
            bien: 'Ese trozo es el MCD: ninguno más largo mide las dos cintas.' },
          { texto: 'Elige dos cintas que solo compartan el trozo de 1 cm, y córtalas con él.',
            logrado: v => mcd(v.a, v.b) === 1 && v.t === 1,
            bien: 'Solo el 1 las mide a las dos: no comparten ningún primo.' },
          { texto: 'Haz que el trozo mida exacto una cinta y en la otra sobre algo.',
            logrado: v => v.t > 1 && (v.a % v.t === 0) !== (v.b % v.t === 0),
            bien: 'Medir una cinta no basta: el trozo común tiene que medir las dos.' },
          { texto: 'Guarda dos pares de cintas distintos, sin sobrante, con el mismo trozo más largo.',
            logrado: (v, g) => v.t === mcd(v.a, v.b) && mismo(g, v, ['a', 'b', 't'])
              && g.some(x => (x.a !== v.a || x.b !== v.b) && x.t === mcd(x.a, x.b) && x.t === v.t),
            bien: 'Cintas distintas, la misma medida común: deciden los primos que comparten.' },
        ],
        arrastres: [
          { id: 'fin-a', etiqueta: 'fin de la cinta a', color: 'c-o',
            donde: v => enTira(tirasCorte(v.a, v.b, v.t), 0, v.a), mover: (pt, v) => ({ a: valorEn(tirasCorte(v.a, v.b, v.t), pt.x) }) },
          { id: 'fin-b', etiqueta: 'fin de la cinta b', color: 'c-i',
            donde: v => enTira(tirasCorte(v.a, v.b, v.t), 1, v.b), mover: (pt, v) => ({ b: valorEn(tirasCorte(v.a, v.b, v.t), pt.x) }) },
          { id: 'trozo', etiqueta: 'fin del primer trozo', color: 'c-d',
            donde: v => ({ x: enTira(tirasCorte(v.a, v.b, v.t), 0, v.t).x, y: TIRAS().geometria(tirasCorte(v.a, v.b, v.t)).tiraY(0) }),
            mover: (pt, v) => ({ t: valorEn(tirasCorte(v.a, v.b, v.t), pt.x) }) },
        ],
      },
      {
        id: 'tres-combis', titulo: 'Tres combis en el paradero', pieza: 'recta',
        consigna: 'Tres combis salen juntas, cada a, b y c minutos. Arrastra la quinta salida de cada una. ¿Cuándo vuelven a coincidir las tres?',
        controles: [
          { id: 'a', etiqueta: 'a', color: 'c-o', min: 2, max: 8, paso: 1, inicio: 4, unidad: 'min', decimales: 0 },
          { id: 'b', etiqueta: 'b', color: 'c-i', min: 2, max: 8, paso: 1, inicio: 6, unidad: 'min', decimales: 0 },
          { id: 'c', etiqueta: 'c', min: 2, max: 8, paso: 1, inicio: 5, unidad: 'min', decimales: 0 },
        ],
        dibujo: v => ({ datos: rectaTres(v.a, v.b, v.c), estado: {} }),
        invitaciones: [
          { texto: 'Elige tres periodos distintos que vuelvan a coincidir lo antes posible.',
            logrado: v => v.a !== v.b && v.b !== v.c && v.a !== v.c && mcm3(v.a, v.b, v.c) === MIN3,
            bien: 'Un periodo es múltiplo de los otros dos: el encuentro llega con él.' },
          { texto: 'Haz que las tres combis vuelvan a coincidir justo a los 24 minutos.',
            logrado: v => mcm3(v.a, v.b, v.c) === 24,
            bien: '24 = 2³ · 3: el MCM toma cada primo con su mayor exponente.' },
          { texto: 'Consigue que el encuentro de las tres caiga fuera de la recta de 120 minutos.',
            logrado: v => mcm3(v.a, v.b, v.c) > 120,
            bien: 'Con pocos factores comunes, el MCM se acerca al producto y crece rápido.' },
          { texto: 'Guarda dos casos con periodos distintos y el mismo encuentro de las tres.',
            logrado: (v, g) => mismo(g, v, ['a', 'b', 'c']) && g.some(x => [x.a, x.b, x.c].sort().join() !== [v.a, v.b, v.c].sort().join()
              && mcm3(x.a, x.b, x.c) === mcm3(v.a, v.b, v.c)),
            bien: 'El encuentro solo depende de cada primo con su mayor exponente.' },
        ],
        lectura: v => {
          const m = mcm3(v.a, v.b, v.c);
          return [`Cada ${v.a}, ${v.b} y ${v.c} min: juntas a los ${m} min${m > 120 ? ', fuera de la recta' : ''}`];
        },
        arrastres: ['a', 'b', 'c'].map((k, i) => ({
          id: `salida-${k}`, etiqueta: `quinta salida de la combi ${k}`, color: ['c-o', 'c-i', undefined][i],
          donde: v => enRecta(rectaTres(v.a, v.b, v.c), 3 - i, 5 * v[k]),
          mover: (pt, v) => ({ [k]: deRecta(rectaTres(v.a, v.b, v.c), pt.x) / 5 }),
        })),
      },
      Object.assign({ id: 'euclides', titulo: 'Euclides: medir con el resto', pieza: 'arit-tiras',
        invitaciones: [
          { texto: 'Busca un par que necesite cinco divisiones o más.',
            // En esta mesa, 7 de los 110 pares; el más largo, (42, 26), pide 6.
            logrado: v => euclides(v.a, v.b).length >= 5,
            bien: 'Restos que bajan despacio alargan el camino. ¿Cuál es su MCD?' },
          { texto: 'Haz que Euclides termine en una sola división.',
            logrado: v => euclides(v.a, v.b).length === 1,
            bien: 'Si b mide exacto a a, el MCD es b mismo.' },
          { texto: 'Busca un par cuyo último divisor, el MCD, sea 2.',
            logrado: v => mcd(v.a, v.b) === 2,
            bien: 'Aquí a y b siempre son pares: el MCD nunca baja de 2.' },
          { texto: 'Guarda dos pares con el mismo MCD y distinta cantidad de divisiones.',
            logrado: (v, g) => mismo(g, v, ['a', 'b']) && g.some(x => mcd(x.a, x.b) === mcd(v.a, v.b) && euclides(x.a, x.b).length !== euclides(v.a, v.b).length),
            bien: 'Caminos de distinto largo, mismo MCD: lo que cuenta es el último divisor.' },
        ] }, euclidesIdea.juega),
    ],
    historia: {
      texto: 'En el libro VII de los Elementos, el máximo común divisor aparece como la mayor medida común de dos números. Euclides lo busca quitando de una cantidad lo que cabe de la otra, con segmentos y restas. La división con resto de hoy comprime esas restas repetidas. El mínimo común múltiplo responde a la pregunta contraria: la primera cantidad que se arma entera con ambas medidas.',
      pregunta: '¿Qué medida cabe exacta en dos cintas distintas?',
      fuente: { titulo: 'Euclides, Elementos VII.2; edición y comentario de David E. Joyce — Clark University', url: 'https://mathcs.clarku.edu/~djoyce/elements/bookVII/propVII2.html' },
    },
    // A qué idea pertenece cada mesa del laboratorio (Gerson, 16 nov: el laboratorio se agrupa por idea). Una lista vacía:
    // la mesa no practica ninguna idea de la unidad y va en «Más mesas del tema».
    laboratorioIdeas: {
      'caja-que-se-llena': ['mcd-cintas'],
      'ladrillos-cubo': ['mcm-coinciden'],
      'cintas-libres': ['mcd-cintas'],
      'tres-combis': ['mcm-coinciden'],
      'euclides': ['euclides'],
    },
    ideas: [trozo, buses, euclidesIdea, relacion, fcIdea],
  };
});
