/*
 * Teoría de «Sucesiones y series» (aritmetica.sucesiones-y-series). Molde: docs/teoria.md; forma de porcentajes.js.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 18) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: RM2 de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver una progresión como una escalera de fichas y su suma como medio rectángulo.
 *   Persona y condiciones: postulante de 4.º y 5.º, celular de 360 px, sin audio, a veces sin conexión.
 *   Resultado observable: halla el término n y la cantidad de términos de una PA, el término y la suma de una PG,
 *     sumas notables, el siguiente término por diferencias (declarando el modelo) y una suma infinita con |r| < 1.
 *   Orden de atención: 1.º la escalera, las tiras o la tabla de diferencias · 2.º lo que se repite (d, r o Δ²) · acción: el botón fijo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué n − 1 y no n?» y «¿cómo una suma sin fin puede dar 2?».
 * Colores (regla 4): primer término a₁ naranja (c-o), la diferencia d o la razón r turquesa (c-i), el lugar n rojo (c-h),
 * la suma S verde (c-d).
 */
(function (root, fabrica) {
  const nodo = typeof module === 'object' && module.exports;
  // El motor de plantillas/sucesiones da la suma notable de los cuadrados de la mesa 3D (regla 1).
  const def = nodo ? fabrica(require('../../../nucleo/kit/kit.js'), require('../../../plantillas/sucesiones/motor.js'))
    : fabrica(root.Kit, root.MotorSucesiones);
  if (nodo) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit, MS) {
  'use strict';
  const f = (x, d = 2) => Kit.formatear(x, d);
  const a1 = { sub: [{ v: 'c-o', t: 'a' }, '1'] }, an = { sub: [{ v: 'c-o', t: 'a' }, 'n'] };
  const d = { v: 'c-i', t: 'd' }, r = { v: 'c-i', t: 'r' }, n = { v: 'c-h', t: 'n' };
  const Sn = { sub: [{ v: 'c-d', t: 'S' }, 'n'] }, Sinf = { sub: [{ v: 'c-d', t: 'S' }, '∞'] };
  function azar(s) {
    let q = (s * 2654435761 + 12345) >>> 0;
    const x = () => { q = (q + 0x6D2B79F5) >>> 0; let z = q; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    x.ent = (lo, hi) => lo + Math.floor(x() * (hi - lo + 1));
    x.de = xs => xs[Math.floor(x() * xs.length)];
    return x;
  }
  function opciones(correcta, distractores, fmt) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const x of distractores) {
      const txt = fmt(x.valor);
      if (vistos.has(txt) || (typeof x.valor === 'number' && !Number.isFinite(x.valor))) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }
  const terminos = (p, q, k, geo = false) => Array.from({ length: k }, (_, i) => (geo ? p * q ** i : p + q * i));
  const lista = xs => xs.map(x => f(x, 0)).join(', ');

  // Gesto directo (docs/teoria.md §4b): las manijas viven en las coordenadas de la pieza (geometria de arit-fichas y
  // arit-tiras); mover convierte el punto del dedo en valores y el lector los ajusta al paso y al rango del control.
  const FICHAS = () => Kit.piezas['arit-fichas'], TIRAS = () => Kit.piezas['arit-tiras'];
  // Fichas desde el borde izquierdo del bloque 0 hasta el punto x (la ficha bajo el dedo cuenta entera).
  const largoEn = (datos, px) => { const g = FICHAS().geometria(datos); return (px - g.xs[0] - g.paso / 2) / g.paso + 1; };
  // Centro de la última ficha naranja de la fila i (en escalera o dentro del rectángulo de ancho L).
  const finFila = (datos, t, i, L) => FICHAS().geometria(datos).ficha(0, (L ? i * L : t.slice(0, i).reduce((u, z) => u + z, 0)) + t[i] - 1);

  // ---------- Idea 1: progresión aritmética y cantidad de términos ----------
  // Cambia: a₁, d y cuántas filas. Permanece: el tamaño de las fichas. Progresa: cada fila tiene d fichas más que la anterior.
  // Se reserva: contar saltos y no términos (n − 1). Debe verse: entre el primero y el último hay un salto menos que filas.
  // Dos representaciones a propósito (auditoría, hallazgo 9): la escalera hace ver d como fichas que se agregan; la recta
  // hace contar los saltos, que es donde está el n − 1. «Mira» empieza diciendo que cada fila es ahora un punto.
  const escalera = (p, q, k) => ({ altoMax: 150, bloques: [{ filas: terminos(p, q, k), color: 'o', rotulo: lista(terminos(p, q, k)) }] });
  const pa = {
    id: 'progresion-aritmetica',
    titulo: 'Cada fila agrega lo mismo',
    temas: ['Progresión aritmética y cantidad de términos'],
    pieza: 'arit-fichas',
    // Lee (fase 2): vocabulario y contexto, sin adelantar cómo se cuentan los términos (eso se descubre en Predice).
    lee: {
      tarjetas: [
        { titulo: 'Una lista con orden', texto: 'Una sucesión es una lista de números en orden. Cada número es un término, y su lugar se cuenta: primero, segundo, tercero… El lugar se escribe con la letra n.',
          ecuacion: [a1, ', ', { sub: [{ v: 'c-o', t: 'a' }, '2'] }, ', ', { sub: [{ v: 'c-o', t: 'a' }, '3'] }, ', …, ', an] },
        { titulo: 'Sumar siempre lo mismo', texto: 'Si en tu alcancía tienes S/ 3 y cada semana echas S/ 5, la alcancía marca 3, 8, 13, 18… Cuando se suma siempre lo mismo, la lista es una progresión aritmética.' },
        { titulo: 'La diferencia común', texto: ['Lo que se suma en cada paso es la diferencia común, ', d, '. Se halla restando un término menos el anterior: en 3, 8, 13, 18 es 8 − 3 = 5.'] },
        { titulo: 'Qué mirar al jugar', texto: ['Cada fila de fichas es un término: la primera tiene ', a1, ' fichas. Cambia ', a1, ', ', d, ' y ', n, ', y mira cómo crece la escalera fila por fila.'] },
      ],
    },
    juega: {
      consigna: 'Elige con cuántas fichas empieza la escalera, cuántas agrega cada fila y cuántas filas tiene.',
      voz: 'Cuenta cuántas veces se agregó d hasta la última fila.',
      controles: [
        { id: 'a', etiqueta: 'a₁', color: 'c-o', min: 1, max: 5, paso: 1, inicio: 2, unidad: '', decimales: 0 },
        { id: 'd', etiqueta: 'd', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'n', etiqueta: 'n', color: 'c-h', min: 2, max: 7, paso: 1, inicio: 4, unidad: 'filas', decimales: 0 },
      ],
      dibujo: v => ({ datos: escalera(v.a, v.d, v.n), estado: {} }),
      lectura: v => [an, ` = ${v.a} + (${v.n} − 1) · ${v.d} = ${v.a + (v.n - 1) * v.d}`],
      minimo: 3,
      // Se agarra la escalera: el fin de la primera fila es a₁; el fin de la última fila, cuánto creció (d).
      arrastres: [
        { id: 'primera-fila', etiqueta: 'largo de la primera fila', color: 'c-o',
          donde: v => finFila(escalera(v.a, v.d, v.n), terminos(v.a, v.d, v.n), 0),
          mover: (pt, v) => ({ a: largoEn(escalera(v.a, v.d, v.n), pt.x) }) },
        { id: 'ultima-fila', etiqueta: 'largo de la última fila', color: 'c-i',
          donde: v => finFila(escalera(v.a, v.d, v.n), terminos(v.a, v.d, v.n), v.n - 1),
          mover: (pt, v) => ({ d: (largoEn(escalera(v.a, v.d, v.n), pt.x) - v.a) / (v.n - 1) }) },
      ],
    },
    predice: {
      pregunta: '¿Cuántos términos tiene la progresión 3, 7, 11, …, 39?',
      opciones: [
        { id: 'c', texto: '10 términos', correcta: true },
        { id: 'saltos', texto: '9 términos', error: 'AT-NMENOS1', siFuera: '9 son los saltos de 4 entre 3 y 39. Los términos son uno más.' },
        { id: 'divide', texto: '13 términos', error: 'AT-DIVIDE', siFuera: '39 ÷ 3 serían los términos si se contara desde 0 de 3 en 3.' },
        { id: 'diez', texto: '36 términos', error: 'AT-DIVIDE', siFuera: '36 es la distancia entre 3 y 39, no cuántos términos hay.' },
      ],
      dibujo: { datos: { min: 0, max: 40, paso: 1, cada: 5, decimales: 0, filas: 2, elementos: [{ tipo: 'punto', x: 3, color: 'o', fila: 1, rotulo: '3' }, { tipo: 'punto', x: 39, color: 'o', fila: 1, rotulo: '39' }] }, estado: {} },
      revelar: { datos: { min: 0, max: 40, paso: 1, cada: 5, decimales: 0, filas: 2, elementos: [...terminos(3, 4, 9).map((x, i) => ({ tipo: 'salto', a: x, b: x + 4, color: 'i', fila: 1 + (i % 2) })), { tipo: 'punto', x: 3, color: 'o', fila: 0, rotulo: '3' }, { tipo: 'punto', x: 39, color: 'o', fila: 0, rotulo: '39' }] }, estado: {} },
      pieza: 'recta',
      coincide: 'Coincide: 9 saltos de 4 unen 10 términos.',
    },
    mira: {
      pieza: 'recta',
      datos: { min: 0, max: 40, paso: 1, cada: 5, decimales: 0, filas: 2, elementos: [
        ...terminos(3, 4, 10).map(x => ({ tipo: 'punto', x, color: 'o', fila: 0, desde: 0 })),
        { tipo: 'distancia', a: 3, b: 39, color: 'i', fila: 2, rotulo: '39 − 3 = 36', desde: 1 },
        ...terminos(3, 4, 9).map((x, i) => ({ tipo: 'salto', a: x, b: x + 4, color: 'i', fila: 1, desde: 2 })),
      ] },
      pasos: [
        { estado: { corte: 0 }, texto: 'Cada fila es un punto: van de 3 a 39, de 4 en 4.', ecuacion: [a1, ' = 3', '   ·   ', d, ' = 4', '   ·   ', an, ' = 39'] },
        { estado: { corte: 1 }, texto: 'Del primero al último hay 36 de distancia.', ecuacion: ['39 − 3 = 36'] },
        { estado: { corte: 2 }, texto: 'Son 36 ÷ 4 = 9 saltos, y 9 saltos unen 10 términos.', ecuacion: [n, ' = ', { llave: [{ frac: ['36', '4'] }], nota: 'saltos', color: 'c-h' }, ' + 1 = 10'] },
      ],
    },
    regla: {
      texto: 'En una progresión aritmética cada término suma d, la diferencia común, al anterior. Del primero al término n hay n − 1 saltos.',
      ecuacion: [an, ' = ', a1, ' + ', { llave: ['(', n, ' − 1)'], nota: 'saltos', color: 'c-h' }, ' ', d, '   ·   ', n, ' = ', { frac: [[an, ' − ', a1], d] }, ' + 1'],
      condicion: 'la diferencia d es la misma entre todos los términos consecutivos y no es cero.',
    },
    // Así se resuelve (fase 2): el mismo tipo de problema de «Ahora tú», con otras semillas, resuelto paso a paso.
    resuelve: {
      generar(s) {
        const x = azar(s + 900), p = x.ent(2, 15), q = x.ent(2, 9), k = x.ent(8, 30), u = p + (k - 1) * q;
        const ak = { sub: [{ v: 'c-o', t: 'a' }, String(k)] };
        if (s % 2 === 0) return {
          enunciado: ['¿Cuántos términos tiene la progresión ', { v: 'c-o', t: `${p}, ${p + q}, ${p + 2 * q}, …, ${u}` }, '?'],
          pasos: [
            { tipo: 'pide', texto: ['Piden ', n, `, cuántos términos hay desde el ${p} hasta el ${u}.`] },
            { tipo: 'datos', texto: 'El primero, la diferencia que se repite y el último.', ecuacion: [a1, ` = ${p}`, '   ·   ', d, ` = ${p + q} − ${p} = ${q}`, '   ·   ', an, ` = ${u}`] },
            { tipo: 'regla', texto: ['Del primero al último se avanza con saltos iguales de ', d, '. Cuento los saltos y sumo uno: los términos son uno más que los saltos.'],
              ecuacion: [n, ' = ', { frac: [[an, ' − ', a1], d] }, ' + 1'] },
            { tipo: 'cuentas', texto: 'Primero la distancia del primero al último, luego los saltos, luego los términos.',
              ecuacion: [`${u} − ${p} = ${u - p}`, '   →   ', `${u - p} ÷ ${q} = ${(u - p) / q} saltos`, '   →   ', n, ` = ${(u - p) / q} + 1 = ${k}`] },
            { tipo: 'sentido', texto: `Comprueba hacia adelante: ${p} + (${k} − 1) · ${q} = ${p} + ${(k - 1) * q} = ${p + (k - 1) * q}, justo el último término. Cuadra.` },
          ],
          respuesta: [n, ` = ${k} términos`],
        };
        return {
          enunciado: ['En la progresión ', { v: 'c-o', t: `${p}, ${p + q}, ${p + 2 * q}, …` }, ', ¿cuál es el término de lugar ', { v: 'c-h', t: String(k) }, '?'],
          pasos: [
            { tipo: 'pide', texto: ['Piden ', ak, `, el término que ocupa el lugar ${k}.`] },
            { tipo: 'datos', texto: 'El primer término y lo que se suma en cada paso.', ecuacion: [a1, ` = ${p}`, '   ·   ', d, ` = ${p + q} − ${p} = ${q}`, '   ·   ', n, ` = ${k}`] },
            { tipo: 'regla', texto: ['Del lugar 1 al lugar ', n, ' se dan saltos de ', d, ': uno menos que el lugar, porque el primero ya está puesto.'],
              ecuacion: [an, ' = ', a1, ' + (', n, ' − 1) ', d] },
            { tipo: 'cuentas', texto: `Del lugar 1 al ${k} hay ${k - 1} saltos de ${q}.`, ecuacion: [ak, ` = ${p} + (${k} − 1) · ${q} = ${p} + ${(k - 1) * q} = ${u}`] },
            { tipo: 'sentido', texto: `Comprueba hacia atrás: (${u} − ${p}) ÷ ${q} = ${(u - p) / q} saltos, y ${(u - p) / q} + 1 = ${(u - p) / q + 1}, el lugar pedido. Cuadra.` },
          ],
          respuesta: [ak, ` = ${u}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s), p = x.ent(2, 15), q = x.ent(2, 9), k = x.ent(8, 30), u = p + (k - 1) * q;
        if (s % 2 === 0) return {
          pregunta: ['¿Cuántos términos tiene la progresión ', { v: 'c-o', t: `${p}, ${p + q}, ${p + 2 * q}, …, ${u}` }, '?'],
          opciones: opciones(k, [
            { id: 'saltos', valor: k - 1, error: 'AT-NMENOS1', siFuera: 'Esos son los saltos; los términos son uno más.' },
            { id: 'divide', valor: Math.round(u / q), error: 'AT-DIVIDE', siFuera: 'Eso cuenta desde 0, no desde el primer término.' },
            { id: 'mas', valor: k + 1, error: 'AT-NMENOS1', siFuera: 'Ese suma un término de más.' },
          ], z => `${z} términos`),
          solucion: { texto: 'Saltos entre el primero y el último, más uno.', ecuacion: [n, ` = (${u} − ${p}) ÷ ${q} + 1 = ${k}`] },
        };
        return {
          pregunta: ['En la progresión ', { v: 'c-o', t: `${p}, ${p + q}, ${p + 2 * q}, …` }, ', ¿cuál es el término de lugar ', { v: 'c-h', t: String(k) }, '?'],
          opciones: opciones(u, [
            { id: 'n', valor: p + k * q, error: 'AT-NMENOS1', siFuera: `Eso da ${k} saltos; hasta el lugar ${k} hay ${k - 1}.` },
            { id: 'rm2', valor: k * p, error: 'RM2', siFuera: 'Multiplicar el primero por el lugar supone una proporción que no hay.' },
            { id: 'sin-a1', valor: k * q, error: 'AT-NMENOS1', siFuera: 'Eso olvida el primer término.' },
          ], z => f(z, 0)),
          solucion: { texto: `Del lugar 1 al ${k} hay ${k - 1} saltos de ${q}.`, ecuacion: [an, ` = ${p} + (${k} − 1) · ${q} = ${u}`] },
        };
      },
    },
  };

  // ---------- Idea 2: la suma es medio rectángulo ----------
  // Cambia: cuántos términos. Permanece: la escalera naranja. Progresa: la copia al revés completa filas iguales.
  // Se reserva: dividir entre 2. Debe verse: cada fila mide a₁ + aₙ.
  const rectangulo = (p, q, k) => {
    const t = terminos(p, q, k), L = t[0] + t[k - 1];
    return { altoMax: 150, ficha: 22, bloques: [{ n: k * L, columnas: L, color: 'o', rotulo: `${k} filas de ${L}`, tramos: t.map((x, i) => ({ de: i * L + x, a: i * L + L - 1, color: 'i' })) }] };
  };
  const suma = {
    id: 'suma-rectangulo',
    titulo: 'La suma es medio rectángulo',
    temas: ['Sumas notables'],
    pieza: 'arit-fichas',
    // Lee: qué es una serie y qué sumas tienen nombre; no dice cómo se suma rápido (eso lo descubre el juego).
    lee: {
      tarjetas: [
        { titulo: 'Sumar la lista', texto: 'Una serie es lo que da sumar los términos de una sucesión. Si un puesto de la feria vende 2, 4, 6 y 8 kilos de quinua en cuatro días, la serie 2 + 4 + 6 + 8 dice cuánto vendió.' },
        { titulo: 'Sumas con nombre', texto: 'Algunas sumas salen tanto en los exámenes que tienen nombre propio: la de los primeros números, 1 + 2 + 3 + …, la de los impares y la de los cuadrados. Son las sumas notables.' },
        { titulo: 'Qué mirar al jugar', texto: ['La escalera naranja es la suma 1 + 2 + … + ', n, '. La turquesa es la misma escalera, volteada. Mira qué forma arman juntas y cuántas fichas tiene cada fila.'] },
      ],
    },
    juega: {
      consigna: 'La escalera naranja es la suma 1 + 2 + … + n. La turquesa es la misma suma al revés. Elige n.',
      voz: 'Cuenta las fichas de una fila completa.',
      controles: [{ id: 'n', etiqueta: 'n', color: 'c-h', min: 2, max: 9, paso: 1, inicio: 4, unidad: '', decimales: 0 }],
      dibujo: v => ({ datos: rectangulo(1, 1, v.n), estado: {} }),
      lectura: v => [`1 + … + ${v.n} = ${v.n} · ${v.n + 1} ÷ 2 = ${v.n * (v.n + 1) / 2}`],
      minimo: 3,
      // La esquina de arriba a la derecha estira el rectángulo en diagonal: una fila y una columna más por cada n.
      arrastres: [{ id: 'esquina', etiqueta: 'esquina del rectángulo', color: 'c-h',
        donde: v => FICHAS().geometria(rectangulo(1, 1, v.n)).ficha(0, v.n),
        mover: (pt, v) => {
          const datos = rectangulo(1, 1, v.n), g = FICHAS().geometria(datos);
          return { n: ((largoEn(datos, pt.x) - 1) + ((g.piso - pt.y) / g.paso + 0.5)) / 2 };
        } }],
    },
    predice: {
      pregunta: '¿Cuánto es 3 + 7 + 11 + 15 + 19?',
      opciones: [
        { id: 'c', texto: '55', correcta: true },
        { id: 'entero', texto: '110', error: 'AT-MITAD', siFuera: '110 es el rectángulo con la copia; la suma es la mitad.' },
        { id: 'ultimo', texto: '95', error: 'AT-SUMA', siFuera: '5 · 19 supone que todos valen 19; solo el último vale tanto.' },
        { id: 'primero', texto: '15', error: 'AT-SUMA', siFuera: '5 · 3 supone que todos valen 3.' },
      ],
      dibujo: { datos: { altoMax: 150, ficha: 22, bloques: [{ filas: [3, 7, 11, 15, 19], color: 'o', rotulo: '3 + 7 + 11 + 15 + 19' }] }, estado: {} },
      revelar: { datos: rectangulo(3, 4, 5), estado: {} },
      coincide: 'Coincide: 5 filas de 22 son 110, y la suma es la mitad.',
    },
    mira: {
      datos: rectangulo(3, 4, 5),
      pasos: [
        { estado: {}, texto: 'Naranja: una fila por término, de 3 a 19.', ecuacion: ['3 + 7 + 11 + 15 + 19'] },
        { estado: {}, texto: 'Turquesa: la misma suma al revés, de 19 a 3.', ecuacion: ['19 + 15 + 11 + 7 + 3'] },
        { estado: {}, texto: 'Cada fila junta un término y su pareja: siempre 22.', ecuacion: ['3 + 19 = 7 + 15 = … = 22'] },
        { estado: {}, texto: '5 filas de 22 son 110; la suma es la mitad.', ecuacion: [{ sub: ['S', '5'] }, ' = ', { frac: ['5 · 22', '2'] }, ' = 55'] },
        { estado: {}, texto: 'Otras sumas notables: los primeros impares y los cuadrados.', ecuacion: ['1 + 3 + … + (2', n, ' − 1) = ', { sup: [n, '2'] }, '   ·   ', { sup: ['1', '2'] }, ' + … + ', { sup: [n, '2'] }, ' = ', { frac: [[n, '(', n, ' + 1)(2', n, ' + 1)'], '6'] }] },
      ],
    },
    regla: {
      texto: 'En una progresión aritmética, la suma es el número de términos por el promedio del primero y el último. Con 1 + 2 + … + n, cada fila mide n + 1.',
      ecuacion: [Sn, ' = ', { frac: [[{ llave: [n], nota: 'filas', color: 'c-h' }, ' ', { llave: ['(', a1, ' + ', an, ')'], nota: 'una fila', color: 'c-o' }], '2'] }, '   ·   ', '1 + 2 + … + ', n, ' = ', { frac: [[n, ' (', n, ' + 1)'], '2'] }],
      condicion: 'la diferencia es constante. Las sumas de impares y de cuadrados del último paso no salen del rectángulo: se comprueban.',
    },
    resuelve: {
      generar(s) {
        const x = azar(s + 900), tipo = s % 4, k = x.ent(6, 25);
        if (tipo === 0) {
          const p = x.ent(1, 9), q = x.ent(2, 6), u = p + (k - 1) * q, S = k * (p + u) / 2;
          return {
            enunciado: ['Suma los ', { v: 'c-h', t: String(k) }, ' términos de ', { v: 'c-o', t: `${p} + ${p + q} + ${p + 2 * q} + … + ${u}` }, '.'],
            pasos: [
              { tipo: 'pide', texto: ['Piden ', Sn, `, la suma de los ${k} términos.`] },
              { tipo: 'datos', texto: `Es una progresión aritmética: se suma ${q} cada vez.`, ecuacion: [a1, ` = ${p}`, '   ·   ', an, ` = ${u}`, '   ·   ', n, ` = ${k}`] },
              { tipo: 'regla', texto: 'Junto la lista con su copia al revés: cada pareja suma el primero más el último. Sale un rectángulo, y la suma es su mitad.',
                ecuacion: [Sn, ' = ', { frac: [[n, ' (', a1, ' + ', an, ')'], '2'] }] },
              { tipo: 'cuentas', texto: `Cada fila mide ${p} + ${u} = ${p + u}, y hay ${k} filas.`, ecuacion: [Sn, ` = ${k} · ${p + u} ÷ 2 = ${f(k * (p + u))} ÷ 2 = ${f(S)}`] },
              { tipo: 'sentido', texto: `La suma queda entre ${k} · ${p} = ${f(k * p)} y ${k} · ${u} = ${f(k * u)}: lo que darían si todos valieran como el primero o como el último. Cuadra.` },
            ],
            respuesta: [Sn, ` = ${f(S)}`],
          };
        }
        if (tipo === 1) {
          const N = 2 * k, S = N * (N + 1) / 2;
          return {
            enunciado: ['¿Cuánto es 1 + 2 + 3 + … + ', { v: 'c-h', t: String(N) }, '?'],
            pasos: [
              { tipo: 'pide', texto: `Piden la suma de todos los números del 1 al ${N}.` },
              { tipo: 'datos', texto: ['Hay ', n, ` = ${N} términos; el primero es 1 y el último, ${N}.`] },
              { tipo: 'regla', texto: ['Con su copia al revés, cada fila mide ', n, ' + 1 y hay ', n, ' filas. La suma es la mitad de ese rectángulo.'],
                ecuacion: ['1 + 2 + … + ', n, ' = ', { frac: [[n, ' (', n, ' + 1)'], '2'] }] },
              { tipo: 'cuentas', texto: `${N} filas de ${N + 1} fichas, a la mitad.`, ecuacion: [`${N} · ${N + 1} ÷ 2 = ${f(N * (N + 1))} ÷ 2 = ${f(S)}`] },
              { tipo: 'sentido', texto: `Comprueba por parejas: 1 + ${N} = 2 + ${N - 1} = ${N + 1}, y hay ${N / 2} parejas. ${N / 2} · ${N + 1} = ${f(N / 2 * (N + 1))}. Cuadra.` },
            ],
            respuesta: f(S),
          };
        }
        if (tipo === 2) {
          const ult = 2 * k - 1, cuantos = (ult + 1) / 2;
          return {
            enunciado: ['¿Cuánto es 1 + 3 + 5 + … + ', { v: 'c-o', t: String(ult) }, '?'],
            pasos: [
              { tipo: 'pide', texto: `Piden la suma de los impares seguidos, del 1 al ${ult}.` },
              { tipo: 'datos', texto: `Empieza en 1, cada impar suma 2 al anterior y el último es ${ult}.` },
              { tipo: 'regla', texto: 'Primero cuento cuántos impares hay. La suma de los primeros impares es esa cantidad al cuadrado.',
                ecuacion: ['1 + 3 + … + (2', n, ' − 1) = ', { sup: [n, '2'] }] },
              { tipo: 'cuentas', texto: 'Cuántos impares hay y después el cuadrado.', ecuacion: [n, ` = (${ult} + 1) ÷ 2 = ${cuantos}`, '   ·   ', `${cuantos}² = ${f(cuantos * cuantos)}`] },
              { tipo: 'sentido', texto: `Comprueba con el rectángulo de la progresión: ${cuantos} · (1 + ${ult}) ÷ 2 = ${f(cuantos * (1 + ult) / 2)}. Da lo mismo.` },
            ],
            respuesta: f(cuantos * cuantos),
          };
        }
        const m = x.ent(4, 15), S = m * (m + 1) * (2 * m + 1) / 6;
        return {
          enunciado: ['¿Cuánto es ', { sup: ['1', '2'] }, ' + ', { sup: ['2', '2'] }, ' + … + ', { sup: [{ v: 'c-h', t: String(m) }, '2'] }, '?'],
          pasos: [
            { tipo: 'pide', texto: `Piden la suma de los cuadrados de los números del 1 al ${m}.` },
            { tipo: 'datos', texto: ['Son ', n, ` = ${m} términos: 1, 4, 9, 16, … hasta ${m}² = ${m * m}.`] },
            { tipo: 'regla', texto: 'Los cuadrados no suman siempre lo mismo: el rectángulo no sirve. Uso la suma notable de los cuadrados.',
              ecuacion: [{ sup: ['1', '2'] }, ' + … + ', { sup: [n, '2'] }, ' = ', { frac: [[n, '(', n, ' + 1)(2', n, ' + 1)'], '6'] }] },
            { tipo: 'cuentas', texto: `Reemplazo n por ${m}.`, ecuacion: [`${m} · ${m + 1} · ${2 * m + 1} ÷ 6 = ${f(m * (m + 1) * (2 * m + 1))} ÷ 6 = ${f(S)}`] },
            { tipo: 'sentido', texto: `Orden de magnitud: la pirámide de cuadrados llena cerca de un tercio de su cubo. ${m}³ ÷ 3 ≈ ${f(m ** 3 / 3, 0)}, y la suma es algo mayor: ${f(S)}. Cuadra.` },
          ],
          respuesta: f(S),
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s), tipo = s % 4, k = x.ent(6, 25);
        if (tipo === 0) {
          const p = x.ent(1, 9), q = x.ent(2, 6), u = p + (k - 1) * q, S = k * (p + u) / 2;
          return {
            pregunta: ['Suma los ', { v: 'c-h', t: String(k) }, ' términos de ', { v: 'c-o', t: `${p} + ${p + q} + ${p + 2 * q} + … + ${u}` }, '.'],
            opciones: opciones(S, [
              { id: 'entero', valor: k * (p + u), error: 'AT-MITAD', siFuera: 'Eso es el rectángulo completo; falta la mitad.' },
              { id: 'ultimo', valor: k * u, error: 'AT-SUMA', siFuera: 'Eso supone que todos valen como el último.' },
              { id: 'n1', valor: (k - 1) * (p + u) / 2, error: 'AT-NMENOS1', siFuera: 'Son ' + k + ' términos, no ' + (k - 1) + '.' },
            ], z => f(z)),
            solucion: { texto: 'Términos por el promedio del primero y el último.', ecuacion: [Sn, ` = ${k} · (${p} + ${u}) ÷ 2 = ${f(S)}`] },
          };
        }
        if (tipo === 1) return {
          pregunta: ['¿Cuánto es 1 + 2 + 3 + … + ', { v: 'c-h', t: String(k * 2) }, '?'],
          opciones: opciones(k * (2 * k + 1), [
            { id: 'entero', valor: 2 * k * (2 * k + 1), error: 'AT-MITAD', siFuera: 'Ese es el rectángulo; la suma es la mitad.' },
            { id: 'cuad', valor: 4 * k * k / 2, error: 'AT-SUMA', siFuera: 'Eso usa n · n ÷ 2; cada fila mide n + 1.' },
            { id: 'n1', valor: (2 * k - 1) * 2 * k / 2, error: 'AT-NMENOS1', siFuera: 'Eso deja fuera el último término.' },
          ], z => f(z, 0)),
          solucion: { texto: 'n filas de n + 1, a la mitad.', ecuacion: [`${2 * k} · ${2 * k + 1} ÷ 2 = ${k * (2 * k + 1)}`] },
        };
        if (tipo === 2) return {
          pregunta: ['¿Cuánto es 1 + 3 + 5 + … + ', { v: 'c-o', t: String(2 * k - 1) }, '?'],
          opciones: opciones(k * k, [
            { id: 'ultimo', valor: (2 * k - 1) ** 2, error: 'AT-IMPARES', siFuera: 'Se eleva la cantidad de términos, no el último.' },
            { id: 'nat', valor: (2 * k - 1) * 2 * k / 2, error: 'AT-IMPARES', siFuera: 'Esa es la suma de todos los números hasta ese, no solo los impares.' },
            { id: 'n1', valor: (k - 1) ** 2, error: 'AT-NMENOS1', siFuera: `Hay ${k} impares hasta ${2 * k - 1}, no ${k - 1}.` },
          ], z => f(z, 0)),
          solucion: { texto: `Hay ${k} impares; su suma es ${k} al cuadrado.`, ecuacion: [`(${2 * k - 1} + 1) ÷ 2 = ${k}`, '   ·   ', `${k}² = ${k * k}`] },
        };
        const m = x.ent(4, 15);
        return {
          pregunta: ['¿Cuánto es ', { sup: ['1', '2'] }, ' + ', { sup: ['2', '2'] }, ' + … + ', { sup: [{ v: 'c-h', t: String(m) }, '2'] }, '?'],
          opciones: opciones(m * (m + 1) * (2 * m + 1) / 6, [
            { id: 'cuad-suma', valor: (m * (m + 1) / 2) ** 2, error: 'AT-CUADRADOS', siFuera: 'Ese es el cuadrado de la suma; aquí se suma cada cuadrado.' },
            { id: 'nat', valor: m * (m + 1) / 2, error: 'AT-CUADRADOS', siFuera: 'Esa es la suma sin elevar al cuadrado.' },
            { id: 'ult', valor: m * m * m, error: 'AT-SUMA', siFuera: 'Eso supone que todos los cuadrados valen como el último.' },
          ], z => f(z, 0)),
          solucion: { texto: 'Se usa la suma notable de los cuadrados.', ecuacion: [`${m} · ${m + 1} · ${2 * m + 1} ÷ 6 = ${m * (m + 1) * (2 * m + 1) / 6}`] },
        };
      },
    },
  };

  // ---------- Idea 3: progresión geométrica ----------
  // Cambia: a₁, r y cuántos términos. Permanece: la escala común de las tiras. Progresa: cada tira es r veces la anterior.
  // Se reserva: el exponente n − 1. Debe verse: la diferencia entre tiras crece; lo que se repite es el cociente.
  const tirasGeo = (p, q, k, paso = false, filas = k, max = 0) => {
    const t = terminos(p, q, k, true);
    return { max: max || t[k - 1] * 1.25, filas, tiras: t.map((x, i) => ({ rotulo: i ? `× ${q}` : `${p}`, color: 'o', fin: f(x, 0), paso: paso ? i : 0, tramos: [{ valor: x, color: i ? 'i' : 'o' }] })) };
  };
  // En el juego la escala no depende de r (cabe la tira más larga posible, con r = 3) y se reservan las 4 filas:
  // al estirar la última tira nada más cambia de tamaño, y con r = 1 se ven todas iguales.
  const tirasJuego = v => tirasGeo(v.a, v.r, v.n, false, 4, 1.25 * v.a * 3 ** (v.n - 1));
  const pg = {
    id: 'progresion-geometrica',
    titulo: 'Cada término multiplica por r',
    temas: ['Progresión geométrica'],
    pieza: 'arit-tiras',
    // Lee: qué es multiplicar siempre por lo mismo y cómo se halla r; no dice cuántas veces se multiplica hasta el lugar n.
    lee: {
      tarjetas: [
        { titulo: 'Multiplicar siempre por lo mismo', texto: 'En un grupo del colegio, un aviso lo manda 1 alumno a 3, cada uno de ellos a otros 3, y así. Las cantidades 1, 3, 9, 27 crecen multiplicando: es una progresión geométrica.' },
        { titulo: 'La razón', texto: ['El número por el que se multiplica es la razón, ', r, '. Se halla dividiendo un término entre el anterior: en 1, 3, 9, 27 cada división da 3.'],
          ecuacion: [r, ' = ', { frac: ['9', '3'] }, ' = ', { frac: ['27', '9'] }, ' = 3'] },
        { titulo: 'Restar no sirve aquí', texto: 'En 1, 3, 9, 27 las restas dan 2, 6 y 18: cambian cada vez. Lo que se repite no es lo que se suma, sino por cuánto se multiplica.' },
        { titulo: 'Qué mirar al jugar', texto: ['Cada tira es la anterior multiplicada por ', r, '. Prueba ', r, ' = 1, 2 y 3, y compara cuánto se alarga la última tira.'] },
      ],
    },
    juega: {
      consigna: 'Elige el primer término, la razón y cuántos términos. Cada tira es la anterior multiplicada por r.',
      voz: 'Compara cuánto crece cada tira respecto de la anterior. Prueba también r = 1.',
      controles: [
        { id: 'a', etiqueta: 'a₁', color: 'c-o', min: 1, max: 3, paso: 1, inicio: 1, unidad: '', decimales: 0 },
        { id: 'r', etiqueta: 'r', color: 'c-i', min: 1, max: 3, paso: 1, inicio: 2, unidad: '', decimales: 0 },
        { id: 'n', etiqueta: 'n', color: 'c-h', min: 2, max: 4, paso: 1, inicio: 3, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tirasJuego(v), estado: {} }),
      lectura: v => { const t = terminos(v.a, v.r, v.n, true); return [an, ` = ${lista(t.slice(-1))} · `, Sn, ` = ${f(t.reduce((u, z) => u + z, 0), 0)}`]; },
      minimo: 3,
      // Se estira la última tira: es a₁ · rⁿ⁻¹, así que su largo decide r, y las tiras de en medio responden.
      arrastres: [{ id: 'ultima-tira', etiqueta: 'fin de la última tira', color: 'c-i',
        donde: v => { const g = TIRAS().geometria(tirasJuego(v)); return { x: g.x(v.a * v.r ** (v.n - 1)), y: g.centroY(v.n - 1) }; },
        mover: (pt, v) => ({ r: Math.pow(TIRAS().geometria(tirasJuego(v)).deX(pt.x) / v.a, 1 / (v.n - 1)) }) }],
    },
    predice: {
      pregunta: 'En la progresión 2, 6, 18, …, ¿cuál es el término de lugar 6?',
      opciones: [
        { id: 'c', texto: '486', correcta: true },
        { id: 'n', texto: '1 458', error: 'AT-NMENOS1', siFuera: '1 458 multiplica por 3 seis veces; hasta el lugar 6 son cinco veces.' },
        { id: 'aditivo', texto: '42', error: 'AT-ADITIVO', siFuera: 'Sumar 4, 12, … no es la regla: lo que se repite es multiplicar por 3.' },
        { id: 'rm2', texto: '36', error: 'RM2', siFuera: '6 · 6 supone que el término crece en proporción al lugar.' },
      ],
      dibujo: { datos: tirasGeo(2, 3, 3), estado: {} },
      revelar: { datos: tirasGeo(2, 3, 4), estado: {} },
      coincide: 'Coincide: 2 · 3⁵ = 486.',
    },
    mira: {
      datos: tirasGeo(2, 3, 4, true),
      pasos: [
        { estado: { paso: 0 }, texto: 'El primer término es 2.', ecuacion: [a1, ' = 2'] },
        { estado: { paso: 1 }, texto: 'Cada término es el anterior por 3: la razón.', ecuacion: [r, ' = ', { frac: ['6', '2'] }, ' = ', { frac: ['18', '6'] }, ' = 3'] },
        { estado: { paso: 3 }, texto: 'Al lugar 4 se llega multiplicando 3 veces.', ecuacion: [{ sub: ['a', '4'] }, ' = 2 · ', { sup: ['3', '3'] }, ' = 54'] },
        { estado: { paso: 3 }, texto: 'Al lugar 6, cinco veces.', ecuacion: [{ sub: ['a', '6'] }, ' = 2 · ', { sup: ['3', '5'] }, ' = 486'] },
      ],
    },
    regla: {
      texto: 'En una progresión geométrica cada término es el anterior por r. Hasta el lugar n se multiplica n − 1 veces.',
      ecuacion: [an, ' = ', a1, ' · ', { llave: [{ sup: [r, [n, ' − 1']] }], nota: 'n − 1 factores', color: 'c-i' }, '   ·   ', Sn, ' = ', a1, ' · ', { frac: [[{ sup: [r, n] }, ' − 1'], [r, ' − 1']] }],
      condicion: 'r es la misma entre términos consecutivos. Si r = 1, todos son iguales y la suma es n · a₁.',
    },
    resuelve: {
      generar(s) {
        const x = azar(s + 900), p = x.ent(1, 5), q = x.de([2, 3, 4, 5]), k = x.ent(4, 7);
        const t = terminos(p, q, k, true), u = t[k - 1], S = t.reduce((z, w) => z + w, 0);
        const ak = { sub: [{ v: 'c-o', t: 'a' }, String(k)] };
        const datos = { tipo: 'datos', texto: 'El primer término y la razón, que sale de dividir un término entre el anterior.',
          ecuacion: [a1, ` = ${p}`, '   ·   ', r, ` = ${p * q} ÷ ${p} = ${q}`, '   ·   ', n, ` = ${k}`] };
        if (s % 2 === 0) return {
          enunciado: ['En la progresión ', { v: 'c-o', t: `${p}, ${p * q}, ${p * q * q}, …` }, ', ¿cuál es el término de lugar ', { v: 'c-h', t: String(k) }, '?'],
          pasos: [
            { tipo: 'pide', texto: ['Piden ', ak, `, el término del lugar ${k}.`] },
            datos,
            { tipo: 'regla', texto: ['Desde el primero, multiplico por ', r, ' una vez por cada salto. Hasta el lugar ', n, ' hay un salto menos que el lugar.'],
              ecuacion: [an, ' = ', a1, ' · ', { sup: [r, [n, ' − 1']] }] },
            { tipo: 'cuentas', texto: `Se multiplica ${k - 1} veces por ${q}.`, ecuacion: [ak, ` = ${p} · `, { sup: [String(q), String(k - 1)] }, ` = ${p} · ${f(q ** (k - 1), 0)} = ${f(u, 0)}`] },
            { tipo: 'sentido', texto: `Comprueba escribiendo la lista hasta el lugar ${k}: el último es ${f(u, 0)}. Cuadra.`, ecuacion: [lista(t)] },
          ],
          respuesta: [ak, ` = ${f(u, 0)}`],
        };
        return {
          enunciado: ['¿Cuánto suman los ', { v: 'c-h', t: String(k) }, ' primeros términos de ', { v: 'c-o', t: `${p}, ${p * q}, ${p * q * q}, …` }, '?'],
          pasos: [
            { tipo: 'pide', texto: ['Piden ', Sn, `, la suma de los ${k} primeros términos.`] },
            datos,
            { tipo: 'regla', texto: 'Sumar uno por uno es largo. La suma geométrica lo hace de una vez: el primero por r a la n menos 1, entre r menos 1.',
              ecuacion: [Sn, ' = ', a1, ' · ', { frac: [[{ sup: [r, n] }, ' − 1'], [r, ' − 1']] }] },
            { tipo: 'cuentas', texto: `Reemplazo con r = ${q} y n = ${k}.`, ecuacion: [Sn, ` = ${p} · (`, { sup: [String(q), String(k)] }, ` − 1) ÷ (${q} − 1) = ${p} · ${f(q ** k - 1, 0)} ÷ ${q - 1} = ${f(S, 0)}`] },
            { tipo: 'sentido', texto: 'Comprueba sumando la lista término a término: da lo mismo.', ecuacion: [t.map(z => f(z, 0)).join(' + '), ` = ${f(S, 0)}`] },
          ],
          respuesta: [Sn, ` = ${f(S, 0)}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s), p = x.ent(1, 5), q = x.de([2, 3, 4, 5]), k = x.ent(4, 7);
        const t = terminos(p, q, k, true), u = t[k - 1], S = t.reduce((z, w) => z + w, 0);
        if (s % 2 === 0) return {
          pregunta: ['En la progresión ', { v: 'c-o', t: `${p}, ${p * q}, ${p * q * q}, …` }, ', ¿cuál es el término de lugar ', { v: 'c-h', t: String(k) }, '?'],
          opciones: opciones(u, [
            { id: 'n', valor: u * q, error: 'AT-NMENOS1', siFuera: `Eso multiplica ${k} veces; son ${k - 1}.` },
            { id: 'aditivo', valor: p + (k - 1) * (p * q - p), error: 'AT-ADITIVO', siFuera: 'Eso suma siempre la primera diferencia; aquí se multiplica.' },
            { id: 'pot', valor: (p * q) ** (k - 1), error: 'AT-POTENCIA', siFuera: 'Solo r va elevado; a₁ multiplica una vez.' },
          ], z => f(z, 0)),
          solucion: { texto: `Se multiplica ${k - 1} veces por ${q}.`, ecuacion: [an, ` = ${p} · `, { sup: [String(q), String(k - 1)] }, ` = ${f(u, 0)}`] },
        };
        return {
          pregunta: ['¿Cuánto suman los ', { v: 'c-h', t: String(k) }, ' primeros términos de ', { v: 'c-o', t: `${p}, ${p * q}, ${p * q * q}, …` }, '?'],
          opciones: opciones(S, [
            { id: 'ultimo', valor: u, error: 'AT-SUMA', siFuera: 'Ese es solo el último término.' },
            { id: 'falta', valor: S - u, error: 'AT-NMENOS1', siFuera: `Eso suma ${k - 1} términos.` },
            { id: 'sinmenos', valor: p * q ** k / (q - 1), error: 'AT-POTENCIA', siFuera: 'En la fórmula falta restar 1 arriba.' },
          ], z => f(z)),
          solucion: { texto: 'Se usa la suma geométrica.', ecuacion: [Sn, ` = ${p} · (`, { sup: [String(q), String(k)] }, ` − 1) ÷ (${q} − 1) = ${f(S, 0)}`] },
        };
      },
    },
  };

  // ---------- Idea 4: diferencias sucesivas y el modelo declarado ----------
  // Cambia: los coeficientes de an² + bn + c. Permanece: la tabla de términos, Δ y Δ². Progresa: términos → Δ → Δ² constante.
  // Se reserva: que una lista corta admite otra regla. Debe verse: el siguiente término se arma de abajo hacia arriba.
  const tablaDif = (t, conSig = false) => {
    const d1 = t.slice(1).map((x, i) => x - t[i]), d2 = d1.slice(1).map((x, i) => x - d1[i]);
    const cols = [{ t: '' }, ...t.map((_, i) => ({ t: `n=${i + 1}`, color: 'h' }))];
    const sig = conSig ? { t: String(t[t.length - 1]), color: 'd', resalta: true } : null;
    return {
      columnas: cols,
      filas: [
        ['término', ...t.map((x, i) => (i === t.length - 1 && sig ? sig : { t: String(x), color: 'o' }))],
        ['Δ', ...d1.map(x => ({ t: String(x), color: 'i' })), ''],
        ['Δ²', ...d2.map(x => ({ t: String(x), color: 'd' })), '', ''],
      ],
      filasMax: 3, cabeza: true,
    };
  };
  const cuad = (A, B, C, k) => Array.from({ length: k }, (_, i) => A * (i + 1) ** 2 + B * (i + 1) + C);
  const orden = {
    id: 'diferencias',
    titulo: 'Diferencias que se vuelven constantes',
    temas: ['Sucesiones de orden superior'],
    pieza: 'arit-tabla',
    // Lee: cómo se arman las filas de diferencias y qué es un polinomio; no dice nada sobre si el siguiente término es único.
    lee: {
      tarjetas: [
        { titulo: 'Restar vecinos', texto: 'Con 1, 4, 9, 16, resta cada término menos el anterior: 3, 5, 7. Esa fila son las primeras diferencias. Si vuelves a restar, salen las segundas diferencias: 2 y 2.',
          ecuacion: ['Δ: 3, 5, 7   ·   Δ²: 2, 2'] },
        { titulo: 'Un polinomio detrás', texto: 'Una regla como n² + 1 es un polinomio: con n = 1, 2 y 3 da 2, 5 y 10. Su grado es el mayor exponente de n; en n² + 1, el grado es 2.' },
        { titulo: 'Qué mirar al jugar', texto: 'En el juego eliges a, b y c de la regla an² + bn + c. Mira en qué fila de la tabla los números se vuelven todos iguales, y qué pasa si a = 0.' },
      ],
    },
    juega: {
      consigna: 'Elige a, b y c de la regla an² + bn + c. Mira en qué fila de diferencias aparece un valor que se repite.',
      voz: 'Prueba a = 0: ¿en qué fila se repite el valor?',
      controles: [
        { id: 'A', etiqueta: 'a', min: 0, max: 2, paso: 1, inicio: 1, unidad: '', decimales: 0 },
        { id: 'B', etiqueta: 'b', min: -2, max: 3, paso: 1, inicio: 0, unidad: '', decimales: 0 },
        { id: 'C', etiqueta: 'c', min: 0, max: 5, paso: 1, inicio: 1, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaDif(cuad(v.A, v.B, v.C, 5)), estado: {} }),
      lectura: v => [`Δ² = ${2 * v.A} en todos: ${v.A ? 'orden 2' : 'orden 1, una progresión aritmética'}`],
      minimo: 3,
    },
    predice: {
      pregunta: 'Una lista empieza 1, 2, 4, 8. ¿Qué número sigue?',
      opciones: [
        { id: 'c', texto: 'Depende de la regla que se declare', correcta: true },
        { id: 'unica', texto: 'Solo puede ser 16', error: 'AT-REGLA-UNICA', siFuera: '16 vale si se duplica. Si las terceras diferencias son constantes, sigue 15.' },
        { id: 'quince', texto: 'Solo puede ser 15', error: 'AT-REGLA-UNICA', siFuera: '15 sale de terceras diferencias constantes; duplicar da 16. Las dos reglas encajan.' },
      ],
      dibujo: { datos: tablaDif([1, 2, 4, 8]), estado: {} },
      revelar: { datos: { columnas: [{ t: 'regla' }, { t: '1.º' }, { t: '2.º' }, { t: '3.º' }, { t: '4.º' }, { t: '5.º', color: 'd' }], filas: [['×2', '1', '2', '4', '8', { t: '16', color: 'd', resalta: true }], ['Δ³ = 1', '1', '2', '4', '8', { t: '15', color: 'd', resalta: true }]], filasMax: 2, cabeza: true }, estado: {} },
      coincide: 'Coincide: cuatro términos encajan con varias reglas; hay que declarar cuál se usa.',
    },
    mira: {
      datos: tablaDif([2, 5, 10, 17, 26, 37], true),
      pasos: [
        { estado: { fila: 0 }, texto: 'Términos: 2, 5, 10, 17, 26.', ecuacion: ['2, 5, 10, 17, 26, …'] },
        { estado: { fila: 1 }, texto: 'Primeras diferencias: 3, 5, 7, 9. No son iguales.', ecuacion: ['Δ: 3, 5, 7, 9'] },
        { estado: { fila: 2 }, texto: 'Segundas diferencias: siempre 2. Modelo de orden 2.', ecuacion: ['Δ²: 2, 2, 2'] },
        { estado: { columna: 6 }, texto: 'De abajo hacia arriba: Δ sigue en 11, y 26 + 11 = 37.', ecuacion: ['9 + 2 = 11', '   ·   ', '26 + 11 = 37'] },
      ],
    },
    regla: {
      texto: 'Si las diferencias de orden k son constantes, la sucesión se modela con un polinomio de grado k. El modelo se declara: pocos términos no fijan una sola regla.',
      ecuacion: [{ sub: ['t', n] }, ' = a', { sup: [n, '2'] }, ' + b', n, ' + c', '   ·   ', 'Δ² = 2a'],
      condicion: 'se supone que el patrón de diferencias sigue igual; la lista finita por sí sola no lo garantiza.',
    },
    resuelve: {
      generar(s) {
        const x = azar(s + 900), A = x.ent(1, 3), B = x.ent(-3, 4), C = x.ent(-2, 6);
        const t = cuad(A, B, C, 6), sig = t[5], ult = t[4];
        const d1 = t.slice(1, 5).map((z, i) => z - t[i]), d2 = d1.slice(1).map((z, i) => z - d1[i]);
        const nueva = d1[3] + d2[2];
        const sg = z => (z < 0 ? ` − ${-z}` : ` + ${z}`);
        const regla = `${A === 1 ? '' : A}n²${B ? (B < 0 ? ` − ${B === -1 ? '' : -B}n` : ` + ${B === 1 ? '' : B}n`) : ''}${C ? sg(C) : ''}`;
        return {
          enunciado: ['Con diferencias segundas constantes, ¿qué término sigue en ', { v: 'c-o', t: lista(t.slice(0, 5)) }, '?'],
          dibujo: { datos: tablaDif(t.slice(0, 5)), estado: {} },
          pasos: [
            { tipo: 'pide', texto: `Piden el sexto término, el que sigue al ${f(ult, 0)}, con el modelo declarado: segundas diferencias constantes.` },
            { tipo: 'datos', texto: 'Resto cada término menos el anterior, y luego otra vez.', ecuacion: [`Δ: ${lista(d1)}`, '   ·   ', `Δ²: ${lista(d2)}`] },
            { tipo: 'regla', texto: 'Si la fila de abajo no cambia, la fila Δ crece siempre lo mismo. El siguiente se arma de abajo hacia arriba.' },
            { tipo: 'cuentas', texto: `La nueva diferencia es ${f(d1[3], 0)} más ${f(d2[2], 0)}; se la sumo al último término.`,
              ecuacion: [`${f(d1[3], 0)} + ${f(d2[2], 0)} = ${f(nueva, 0)}`, '   →   ', `${f(ult, 0)} + ${f(nueva, 0)} = ${f(ult + nueva, 0)}`],
              dibujo: { datos: tablaDif(t, true), estado: { columna: 6 } } },
            { tipo: 'sentido', texto: `La lista sale de la regla ${regla}. Con n = 6 da ${f(sig, 0)}, lo mismo que la tabla. Cuadra.`,
              ecuacion: [`${A} · 36${B ? `${sg(B)} · 6` : ''}${C ? sg(C) : ''} = ${f(sig, 0)}`] },
          ],
          respuesta: `El término que sigue es ${f(ult + nueva, 0)}.`,
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s), A = x.ent(1, 3), B = x.ent(-3, 4), C = x.ent(-2, 6);
        const t = cuad(A, B, C, 6), sig = t[5], ult = t[4], d1 = t[4] - t[3];
        return {
          pregunta: ['Con diferencias segundas constantes, ¿qué término sigue en ', { v: 'c-o', t: lista(t.slice(0, 5)) }, '?'],
          opciones: opciones(sig, [
            { id: 'delta1', valor: ult + d1, error: 'AT-DIFERENCIA', siFuera: 'Eso repite la última diferencia; la diferencia también crece.' },
            { id: 'doble', valor: ult * 2, error: 'AT-REGLA-UNICA', siFuera: 'Duplicar no es la regla que se declaró.' },
            { id: 'mas2', valor: ult + d1 + 4 * A, error: 'AT-DIFERENCIA', siFuera: `La diferencia crece ${2 * A} cada vez, no ${4 * A}.` },
          ], z => f(z, 0)),
          solucion: { texto: `Δ² = ${2 * A}: la diferencia siguiente es ${d1} + ${2 * A}.`, ecuacion: [`${ult} + ${d1 + 2 * A} = ${sig}`], dibujo: { datos: tablaDif(t, true), estado: { columna: 6 } } },
        };
      },
    },
  };

  // ---------- Idea 5: una suma infinita puede tener límite ----------
  // Cambia: cuántos términos se suman y la razón. Permanece: la tira hasta el límite a₁/(1 − r).
  // Progresa: cada término tapa una parte de lo que falta. Se reserva: la serie armónica, que no tiene límite.
  // Debe verse: lo que falta se achica pero la tira nunca pasa del límite.
  const tiraInf = (q, k) => {
    const lim = 1 / (1 - q), t = terminos(1, q, k, true), s = t.reduce((u, z) => u + z, 0);
    return { max: lim * 1.08, filas: 1, tiras: [{ rotulo: `límite ${f(lim)}`, color: 'd', fin: '', tramos: [...t.map((x, i) => ({ valor: x, color: i % 2 ? 'i' : 'o', texto: i < 3 ? f(x, 3) : '' })), { valor: Math.max(0, lim - s), hueco: true }] }] };
  };
  const RAZONES = { '1/2': 0.5, '1/3': 1 / 3, '2/3': 2 / 3 };
  // Cuántos términos de 1 + r + r² + … hacen falta para llegar a la suma s (inversa de (1 − rᵏ)/(1 − r)).
  // Pasado el límite, ningún k alcanza: se devuelve un número grande y el lector lo deja en el máximo del control.
  const terminosHasta = (q, s) => { const z = 1 - s * (1 - q); return z <= 0 ? 99 : Math.log(z) / Math.log(q); };
  const sumaHueco = (q, k) => (1 - q ** k) / (1 - q);
  // La manija va al final de lo ya sumado; arrastrarla a la derecha agrega términos.
  const manijaSuma = (datosDe, qDe) => ({
    id: 'suma', etiqueta: 'fin de lo ya sumado', color: 'c-h',
    donde: v => { const g = TIRAS().geometria(datosDe(v)); return { x: g.x(sumaHueco(qDe(v), v.k)), y: g.centroY(0) }; },
    mover: (pt, v) => ({ k: terminosHasta(qDe(v), TIRAS().geometria(datosDe(v)).deX(pt.x)) }),
  });
  const infinita = {
    id: 'suma-infinita',
    titulo: 'Sumar sin fin sin pasarse',
    temas: ['Sumas infinitas'],
    pieza: 'arit-tiras',
    // Lee: la pregunta y el vocabulario (límite, lo que falta); no dice a qué valor llega ninguna suma.
    lee: {
      tarjetas: [
        { titulo: 'Una suma que no termina', texto: 'Imagina que caminas hacia la orilla del lago y cada paso mide la mitad del anterior. Agregas pasos sin parar. ¿Llegas a alguna parte? Preguntas así llevan a las sumas infinitas.' },
        { titulo: 'Acercarse a un valor', texto: 'Cuando una suma se acerca tanto como quieras a un número sin pasarlo, ese número es su límite. Hay sumas sin fin que tienen límite y otras que crecen sin tope.' },
        { titulo: 'Qué mirar al jugar', texto: ['En la tira, cada pedazo naranja o turquesa es un término de 1 + ', r, ' + ', { sup: [r, '2'] }, ' + …, y el hueco del final es lo que falta. Agrega términos y mira el hueco.'] },
      ],
    },
    juega: {
      consigna: 'Se suma 1 + r + r² + … término a término. Elige la razón y cuántos términos. Mira el hueco que queda.',
      voz: 'Fíjate si el hueco desaparece o solo se achica.',
      controles: [
        { id: 'r', etiqueta: 'r', opciones: Object.keys(RAZONES).map(k => ({ valor: k, texto: k })) },
        { id: 'k', etiqueta: 'términos', color: 'c-h', min: 1, max: 8, paso: 1, inicio: 3, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tiraInf(RAZONES[v.r], v.k), estado: {} }),
      lectura: v => { const q = RAZONES[v.r], s = (1 - q ** v.k) / (1 - q); return [Sn, ` = ${f(s, 4)} · falta ${f(1 / (1 - q) - s, 4)}`]; },
      minimo: 4,
      arrastres: [manijaSuma(v => tiraInf(RAZONES[v.r], v.k), v => RAZONES[v.r])],
    },
    predice: {
      pregunta: 'Si se suma 1 + 1/2 + 1/4 + 1/8 + … sin terminar nunca, ¿a qué valor se acerca la suma?',
      opciones: [
        { id: 'c', texto: 'A 2', correcta: true },
        { id: 'crece', texto: 'Crece sin límite', error: 'AT-INFINITO', siFuera: 'Crecería sin límite si los términos no se achicaran tanto; cada uno tapa la mitad de lo que falta.' },
        { id: 'uno', texto: 'A 1', error: 'AT-LIMITE', siFuera: '1 sería el límite si se empezara en 1/2. Aquí se empieza en 1.' },
        { id: 'casi', texto: 'A 1,875', error: 'AT-LIMITE', siFuera: '1,875 es la suma de cuatro términos; la suma sigue.' },
      ],
      dibujo: { datos: tiraInf(0.5, 2), estado: {} },
      revelar: { datos: tiraInf(0.5, 8), estado: {} },
      coincide: 'Coincide: siempre falta tanto como el último término, y eso se acerca a 0.',
    },
    mira: {
      datos: tiraInf(0.5, 6),
      pasos: [
        { estado: {}, texto: 'Hasta 2 falta 1. El primer término es 1.', ecuacion: ['2 − 1 = 1'] },
        { estado: {}, texto: 'Cada término es la mitad de lo que faltaba.', ecuacion: ['1 + ', { frac: ['1', '2'] }, ' + ', { frac: ['1', '4'] }, ' + … ', ' = 2 − (último término)'] },
        { estado: {}, texto: 'Lo que falta se achica sin fin: la suma tiende a 2.', ecuacion: [Sinf, ' = ', { frac: ['1', '1 − 1/2'] }, ' = 2'] },
        { estado: {}, texto: 'Que los términos bajen no basta: 1 + 1/2 + 1/3 + … crece sin límite.', ecuacion: ['1 + ', { frac: ['1', '2'] }, ' + ', { frac: ['1', '3'] }, ' + …   no tiene límite'] },
      ],
    },
    regla: {
      texto: 'Una suma geométrica infinita con |r| < 1 se acerca a a₁/(1 − r). Si |r| ≥ 1, no tiene límite.',
      ecuacion: [Sinf, ' = ', { frac: [a1, ['1 − ', r]] }, '   si   |', r, '| < 1'],
      condicion: 'vale para progresiones geométricas. Que los términos se achiquen no basta en cualquier serie.',
    },
    resuelve: {
      generar(s) {
        const x = azar(s + 900), p = x.ent(1, 12);
        const [qn, qd] = x.de([[1, 2], [1, 3], [1, 4], [2, 3], [3, 4], [1, 5], [3, 2]]);
        const q = qn / qd, conv = q < 1, S = conv ? p / (1 - q) : NaN;
        const S5 = terminos(p, q, 5, true).reduce((z, w) => z + w, 0);
        return {
          enunciado: ['¿A qué valor se acerca la suma infinita ', { v: 'c-o', t: String(p) }, ` + ${f(p * q, 3)} + ${f(p * q * q, 3)} + …?`],
          pasos: [
            { tipo: 'pide', texto: 'Piden el valor al que se acerca la suma si se agregan términos sin parar, si es que ese valor existe.' },
            { tipo: 'datos', texto: 'El primer término y la razón, que sale de dividir el segundo entre el primero.', ecuacion: [a1, ` = ${p}`, '   ·   ', r, ` = ${f(p * q, 3)} ÷ ${p} ${Math.abs(p * q * 1000 - Math.round(p * q * 1000)) > 1e-6 ? '≈' : '='} ${qn}/${qd}`] },
            { tipo: 'regla', texto: 'Si la razón está entre −1 y 1, los términos se achican tan rápido que la suma se acerca a un valor. Si no, crece sin parar.',
              ecuacion: [Sinf, ' = ', { frac: [a1, ['1 − ', r]] }, '   si   |', r, '| < 1'] },
            conv
              ? { tipo: 'cuentas', texto: `La razón ${qn}/${qd} es menor que 1: hay límite. Divido el primer término entre 1 − r.`,
                ecuacion: [Sinf, ` = ${p} ÷ (1 − ${qn}/${qd}) = ${p} ÷ ${qd - qn}/${qd} = ${p} · ${qd - qn === 1 ? qd : `${qd}/${qd - qn}`} = ${f(S)}`] }
              : { tipo: 'cuentas', texto: `La razón ${qn}/${qd} es mayor que 1: cada término es más grande que el anterior.`, ecuacion: [`|r| = ${f(q)} ≥ 1`, '   →   ', 'no tiene límite'] },
            conv
              ? { tipo: 'sentido', texto: `Con 5 términos ya van ${f(S5, 3)}, un poco menos que ${f(S)}. Cada término nuevo acerca la suma, sin pasarse. Cuadra.` }
              : { tipo: 'sentido', texto: `Con 5 términos ya van ${f(S5, 3)}, y cada término nuevo suma más que el anterior: no hay tope.` },
          ],
          respuesta: conv ? [Sinf, ` = ${f(S)}`] : 'No tiene límite: la suma crece sin parar.',
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const x = azar(s), p = x.ent(1, 12);
        const [qn, qd] = x.de([[1, 2], [1, 3], [1, 4], [2, 3], [3, 4], [1, 5], [3, 2]]);
        const q = qn / qd, conv = q < 1;
        const S = conv ? p / (1 - q) : NaN;
        return {
          pregunta: ['¿A qué valor se acerca la suma infinita ', { v: 'c-o', t: String(p) }, ` + ${f(p * q, 3)} + ${f(p * q * q, 3)} + …?`],
          opciones: opciones(conv ? f(S) : 'No tiene límite', [
            { id: 'crece', valor: conv ? 'No tiene límite' : f(p / (1 - qd / qn)), error: 'AT-INFINITO', siFuera: conv ? `La razón ${qn}/${qd} es menor que 1: tiene límite.` : 'Con razón mayor que 1 los términos crecen: no hay límite.' },
            { id: 'sin-a', valor: conv ? f(1 / (1 - q)) : f(p * 3), error: 'AT-LIMITE', siFuera: 'Falta multiplicar por el primer término.' },
            { id: 'r', valor: conv ? f(p / q) : f(p * q * q), error: 'AT-LIMITE', siFuera: 'Se divide entre 1 − r, no entre r.' },
          ], String),
          solucion: { texto: conv ? `Razón ${qn}/${qd}, menor que 1.` : `Razón ${qn}/${qd}, mayor que 1: crece.`, ecuacion: conv ? [Sinf, ` = ${p} ÷ (1 − ${qn}/${qd}) = ${f(S)}`] : [`|r| = ${f(q)} ≥ 1`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  const anchoCopia = v => (v.copia === 'si' ? 2 * v.a + (v.n - 1) * v.d : 0);
  const mesaEscalera = v => {
    const t = terminos(v.a, v.d, v.n), L = anchoCopia(v);
    if (!L) return escalera(v.a, v.d, v.n);
    return { altoMax: 150, bloques: [{ n: v.n * L, columnas: L, color: 'o', rotulo: `${v.n} filas de ${L}`, tramos: t.map((x, i) => ({ de: i * L + x, a: i * L + L - 1, color: 'i' })) }] };
  };
  // Una sola escala para todas las razones (llega a 5, el límite de r = 4/5): así dos casos guardados se comparan.
  const RAZONES_LAB = { '1/3': 1 / 3, '1/2': 0.5, '2/3': 2 / 3, '3/4': 0.75, '4/5': 0.8 };
  const tiraLab = (q, k) => {
    const lim = 1 / (1 - q), t = terminos(1, q, k, true), s = t.reduce((u, z) => u + z, 0);
    return { max: 5.4, filas: 1, regla: { paso: 1, cada: 1 }, tiras: [{ rotulo: `límite ${f(lim)}`, color: 'd', tramos: [...t.map((x, i) => ({ valor: x, color: i % 2 ? 'i' : 'o' })), { valor: Math.max(0, lim - s), hueco: true }] }] };
  };

  // Para los retos: las mismas cuentas que escriben las lecturas de las mesas.
  const sumaPA = v => terminos(v.a, v.d, v.n).reduce((u, z) => u + z, 0);
  const ultimoPG = v => v.a * v.r ** (v.n - 1);
  const sumaPG = v => terminos(v.a, v.r, v.n, true).reduce((u, z) => u + z, 0);
  const falta = v => { const q = RAZONES_LAB[v.r]; return 1 / (1 - q) - sumaHueco(q, v.k); };
  const LEJOS = Object.keys(RAZONES_LAB).reduce((m, k) => (RAZONES_LAB[k] > RAZONES_LAB[m] ? k : m));   // la razón de límite más lejano
  // La mayor suma de la mesa de tiras: crece con a₁, r y n, así que es la de los tres máximos de sus controles.
  const MAXPG = sumaPG(Object.fromEntries(pg.juega.controles.map(c => [c.id, c.max])));
  const mismo = (g, v, ks) => g.some(x => ks.every(k => x[k] === v[k]));

  // Mesa 3D (ronda 4, docs/3d.md): la suma de los cuadrados, que en el plano «no sale del rectángulo», es el volumen de
  // una pirámide escalonada. Cambia: n y si se mira dentro del cubo n³ · Permanece: cada capa es un cuadrado de cubitos ·
  // Progresa: la pirámide, una capa por lugar · Se reserva: el rojo, para la última capa n² · Debe verse: S crece como
  // un volumen (cerca de n³/3). La suma la da MS.sumaNotable (regla 1); la pieza solo apila las capas.
  const sumaCuad = n => (n >= 1 ? MS.sumaNotable('cuadrados', n).S : 0);
  function datosPiramide(v) {
    const bloques = [];
    for (let k = v.n; k >= 1; k--) for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) bloques.push({ x: i, y: j, z: v.n - k, g: k === v.n ? 1 : 0 });
    const S = sumaCuad(v.n);
    return {
      bloques,
      grupos: [
        { nombre: 'capas de arriba', color: 'c-d', dice: `Las capas de arriba: ${sumaCuad(v.n - 1)} cubitos` },
        { nombre: `capa de ${v.n}²`, color: 'c-h', rotulo: `${v.n}²`, rotuloEn: [v.n / 2, -0.9 - 0.1 * v.n, 0], dice: `La última capa: ${v.n}² = ${v.n * v.n} cubitos` },
      ],
      marco: v.cubo === 1 ? { x: 0, y: 0, z: 0, w: v.n, h: v.n, d: v.n, rotulo: `${v.n}³ = ${v.n ** 3}` } : undefined,
      alt: `Pirámide escalonada de ${v.n} capas cuadradas, de 1² arriba a ${v.n}² abajo: ${S} cubitos` + (v.cubo === 1 ? ` dentro de un cubo de ${v.n ** 3}.` : '.'),
    };
  }
  const mesaPiramide = {
    id: 'piramide-cuadrados', titulo: 'La pirámide de cuadrados', pieza: 'ari-cubitos-3d',
    consigna: 'Cada capa es un cuadrado: 1², 2², …, n². Gira la pirámide, sube n y métela en su cubo.',
    controles: [
      { id: 'n', etiqueta: 'n', color: 'c-h', min: 1, max: 10, paso: 1, inicio: 6, decimales: 0 },
      { id: 'cubo', etiqueta: 'Cubo n³', opciones: [{ valor: 0, texto: 'Sin cubo' }, { valor: 1, texto: 'Con el cubo' }] },
    ],
    dibujo: v => ({ datos: datosPiramide(v), estado: {} }),
    lectura: v => [`1² + … + ${v.n}² = `, { v: 'c-d', t: String(sumaCuad(v.n)) }, v.cubo === 1 ? ` de ${v.n ** 3}` : ''],
    invitaciones: [
      { texto: 'Arma una pirámide de 55 cubitos.',
        logrado: v => sumaCuad(v.n) === 55,
        bien: '1 + 4 + 9 + 16 + 25 = 55: cada capa es un cuadrado.',
        pista: 'Baja n de uno en uno y resta la capa roja.' },
      { texto: 'Logra que la capa roja tenga más cubitos que todas las de arriba juntas.',
        logrado: v => v.n > 1 && v.n * v.n > sumaCuad(v.n - 1),
        bien: 'Hasta n = 4 gana la de abajo: 16 contra 14. Desde 5, ganan las de arriba.',
        pista: 'Baja n y compara la capa roja con el resto.' },
      { texto: 'Mete la pirámide en su cubo y haz que ocupe menos del 40 %.',
        logrado: v => v.cubo === 1 && sumaCuad(v.n) / v.n ** 3 < 0.4,
        bien: 'Se acerca a un tercio del cubo: S es casi n³/3 cuando n crece.',
        pista: 'Elige «Con el cubo» y sube n mirando la lectura.' },
      { texto: 'Guarda una pirámide de n capas y otra del doble de capas.',
        logrado: (v, g) => g.some(x => g.some(y => y.n === 2 * x.n)),
        bien: 'Con el doble de capas hay casi ocho veces más: crece como un volumen.',
        pista: 'Guarda n = 3 y después n = 6.' },
    ],
  };

  return {
    unidad: 'aritmetica.sucesiones-y-series',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-fichas.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/arit-tiras.js', '/nucleo/kit/piezas/arit-tabla.js', '/plantillas/sucesiones/motor.js', '/nucleo/kit/piezas/ari-cubitos-3d.js'],
    glosario: [
      { termino: 'sucesión', formas: ['sucesión', 'sucesiones'],
        def: 'Lista ordenada de números que siguen una regla; cada uno ocupa un lugar: primero, segundo…',
        ejemplo: '2, 5, 10, 17, … sigue la regla n² + 1.', ver: ['término', 'serie'] },
      { termino: 'progresión aritmética', formas: ['progresión aritmética', 'progresiones aritméticas'],
        def: 'Sucesión en que cada número se obtiene sumando siempre la misma cantidad al anterior.',
        ejemplo: '3, 7, 11, 15: se suma 4 cada vez.', ver: ['diferencia común', 'progresión geométrica'] },
      { termino: 'diferencia común', simbolo: 'd',
        def: 'Lo que se suma para pasar de un término al siguiente en una progresión aritmética.',
        ejemplo: 'En 3, 7, 11, 15 es 7 − 3 = 4.', ver: ['progresión aritmética'] },
      { termino: 'progresión geométrica', formas: ['progresión geométrica', 'progresiones geométricas'],
        def: 'Sucesión en que cada número se obtiene multiplicando el anterior siempre por la misma razón.',
        ejemplo: '2, 6, 18, 54: se multiplica por 3.', ver: ['progresión aritmética', 'suma infinita'] },
      { termino: 'serie', formas: ['serie', 'series'],
        def: 'La suma de los términos de una sucesión, que puede tener fin o seguir sin terminar.',
        ejemplo: '3 + 7 + 11 + 15 + 19 = 55.', ver: ['sucesión', 'suma infinita'] },
      { termino: 'suma infinita', formas: ['suma geométrica infinita', 'suma infinita', 'sumas infinitas'],
        def: 'Suma que nunca termina. Puede acercarse cada vez más a un valor fijo o crecer sin tope.',
        ejemplo: '1 + 1/2 + 1/4 + … se acerca a 2; 1 + 1 + 1 + … no.', ver: ['progresión geométrica'] },
      { termino: 'sumas notables', formas: ['sumas notables', 'suma notable'],
        def: 'Fórmulas conocidas para sumar listas que aparecen mucho, como los primeros impares o los cuadrados.',
        ejemplo: '1 + 3 + 5 + 7 = 4² = 16.', ver: ['serie'] },
      { termino: 'diferencias sucesivas', formas: ['diferencias sucesivas', 'primeras diferencias', 'segundas diferencias', 'diferencias de orden k'],
        def: 'Restas entre términos vecinos, repetidas fila tras fila; la fila en que se vuelven constantes da el grado.',
        ejemplo: '2, 5, 10, 17: primeras 3, 5, 7; segundas 2, 2.', ver: ['polinomio'] },
      { termino: 'polinomio', formas: ['polinomio', 'polinomios'],
        def: 'Suma de potencias de una variable multiplicadas por números fijos. Su grado es el mayor exponente.',
        ejemplo: 'n² + 1 es de grado 2: da 2, 5, 10, 17…', ver: ['diferencias sucesivas'] },
    ],
    // Laboratorio: juego libre, sin preguntas. La escalera con su copia junta las ideas 1 y 2 para cualquier progresión
    // (también d = 0); la suma sin fin usa una sola escala para comparar razones; la tercera es el juego de la idea 3.
    laboratorio: [
      mesaPiramide,
      {
        id: 'escalera-suma', titulo: 'Escalera y su copia', pieza: 'arit-fichas',
        consigna: 'Arma cualquier progresión aritmética, también con d = 0. Pon la copia al revés y cuenta el rectángulo.',
        controles: [
          { id: 'a', etiqueta: 'a₁', color: 'c-o', min: 1, max: 5, paso: 1, inicio: 2, unidad: '', decimales: 0 },
          { id: 'd', etiqueta: 'd', color: 'c-i', min: 0, max: 4, paso: 1, inicio: 2, unidad: '', decimales: 0 },
          { id: 'n', etiqueta: 'n', color: 'c-h', min: 2, max: 6, paso: 1, inicio: 4, unidad: 'filas', decimales: 0 },
          { id: 'copia', etiqueta: 'Copia al revés', opciones: [{ valor: 'no', texto: 'sin copia' }, { valor: 'si', texto: 'con copia' }] },
        ],
        dibujo: v => ({ datos: mesaEscalera(v), estado: {} }),
        lectura: v => {
          const t = terminos(v.a, v.d, v.n), S = t.reduce((u, z) => u + z, 0);
          return [`${lista(t)}: `, Sn, v.copia === 'si' ? ` = ${v.n} · ${t[0] + t[v.n - 1]} ÷ 2 = ${S}` : ` = ${S}`];
        },
        arrastres: [
          { id: 'primera-fila', etiqueta: 'largo de la primera fila', color: 'c-o',
            donde: v => finFila(mesaEscalera(v), terminos(v.a, v.d, v.n), 0, anchoCopia(v)),
            mover: (pt, v) => ({ a: largoEn(mesaEscalera(v), pt.x) }) },
          { id: 'ultima-fila', etiqueta: 'largo de la última fila', color: 'c-i',
            donde: v => finFila(mesaEscalera(v), terminos(v.a, v.d, v.n), v.n - 1, anchoCopia(v)),
            mover: (pt, v) => ({ d: (largoEn(mesaEscalera(v), pt.x) - v.a) / (v.n - 1) }) },
        ],
        invitaciones: [
          { texto: 'Pon la copia al revés y arma un rectángulo de 30 fichas.',
            logrado: v => v.copia === 'si' && v.n * anchoCopia(v) === 30,
            bien: 'El rectángulo es el doble de la suma: las naranjas son 15.' },
          { texto: 'Arma una progresión cuya suma sea justo 50.',
            logrado: v => sumaPA(v) === 50,
            bien: 'Comprueba: número de filas por el promedio del primero y el último.' },
          { texto: 'Haz que todas las filas midan lo mismo.',
            logrado: v => v.d === 0,
            bien: 'Con d = 0 la escalera ya es un rectángulo: la suma es n · a₁.' },
          { texto: 'Guarda dos progresiones distintas con la misma suma.',
            logrado: (v, g) => mismo(g, v, ['a', 'd', 'n']) && g.some(x => (x.a !== v.a || x.d !== v.d || x.n !== v.n) && sumaPA(x) === sumaPA(v)),
            bien: 'Otra escalera, las mismas fichas. ¿Qué tienen en común sus promedios?' },
        ],
      },
      {
        id: 'suma-sin-fin', titulo: 'Suma sin fin, misma regla', pieza: 'arit-tiras',
        consigna: 'Todas las razones se miden con la misma regla. Compara qué tan rápido se cierra el hueco y dónde está el límite.',
        controles: [
          { id: 'r', etiqueta: 'r', opciones: Object.keys(RAZONES_LAB).map(k => ({ valor: k, texto: k })) },
          { id: 'k', etiqueta: 'términos', color: 'c-h', min: 1, max: 12, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        ],
        dibujo: v => ({ datos: tiraLab(RAZONES_LAB[v.r], v.k), estado: {} }),
        lectura: v => { const q = RAZONES_LAB[v.r]; const lim = 1 / (1 - q); return [`r = ${v.r}, ${v.k} términos: falta ${f(lim - sumaHueco(q, v.k), 6)} para ${f(lim)}`]; },
        arrastres: [manijaSuma(v => tiraLab(RAZONES_LAB[v.r], v.k), v => RAZONES_LAB[v.r])],
        invitaciones: [
          { texto: 'Haz que lo que falta sea menor que una centésima.',
            logrado: v => falta(v) < 0.01,
            bien: 'Casi llega, pero nunca pasa del límite: siempre falta algo.' },
          { texto: 'Con r = 1/2, haz que falte justo 0,0625.',
            logrado: v => v.r === '1/2' && Math.abs(falta(v) - 0.0625) < 1e-9,
            bien: '0,0625 = 1/16: cada término tapó la mitad de lo que faltaba.' },
          { texto: 'Con la razón de límite más lejano, haz que falte menos de 1.',
            logrado: v => v.r === LEJOS && falta(v) < 1,
            bien: 'Con razón cerca de 1, el hueco se cierra despacio y el límite crece.' },
          { texto: 'Guarda dos razones distintas con la misma cantidad de términos.',
            logrado: (v, g) => mismo(g, v, ['r', 'k']) && g.some(x => x.k === v.k && x.r !== v.r),
            bien: 'Con los mismos términos, la razón más chica deja menos hueco.' },
        ],
      },
      Object.assign({ id: 'tiras-geometricas', titulo: 'Tiras que se multiplican', pieza: 'arit-tiras',
        invitaciones: [
          { texto: 'Haz que el último término sea justo 54.',
            logrado: v => ultimoPG(v) === 54,
            bien: '54 = 2 · 3³: al lugar 4 se llega multiplicando tres veces.' },
          { texto: 'Haz que todas las tiras midan lo mismo.',
            logrado: v => v.r === 1,
            bien: 'Con r = 1 no crece nada: la suma es n · a₁.' },
          { texto: 'Consigue la suma más grande que permite la mesa.',
            logrado: v => sumaPG(v) === MAXPG,
            bien: '3 + 9 + 27 + 81 = 120: la última tira pesa más que las otras juntas.' },
          { texto: 'Guarda dos casos con el mismo último término y distinta razón.',
            logrado: (v, g) => mismo(g, v, ['a', 'r', 'n']) && g.some(x => x.r !== v.r && ultimoPG(x) === ultimoPG(v)),
            bien: 'El mismo final por caminos distintos. ¿Suman lo mismo?' },
        ] }, pg.juega),
    ],
    historia: {
      texto: 'En el prefacio de la Cuadratura de la parábola, Arquímedes cuenta que el segmento de parábola mide cuatro tercios de un triángulo adecuado, y separa cómo lo exploró de cómo lo demostró. Esa idea de juntar aportes cada vez más chicos que se acercan a un valor es la de las sumas infinitas. La notación de términos y sumatorias es muy posterior.',
      pregunta: '¿Puede una suma sin fin dar un número?',
      fuente: { titulo: 'Arquímedes, prefacio a Quadrature of the parabola, traducción reproducida por MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Extras/Archimedes_parabola/' },
    },
    ideas: [pa, suma, pg, orden, infinita],
  };
});
