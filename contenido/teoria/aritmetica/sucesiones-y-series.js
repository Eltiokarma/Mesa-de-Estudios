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
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
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

  // ---------- Idea 1: progresión aritmética y cantidad de términos ----------
  // Cambia: a₁, d y cuántas filas. Permanece: el tamaño de las fichas. Progresa: cada fila tiene d fichas más que la anterior.
  // Se reserva: contar saltos y no términos (n − 1). Debe verse: entre el primero y el último hay un salto menos que filas.
  const pa = {
    id: 'progresion-aritmetica',
    titulo: 'Cada fila agrega lo mismo',
    temas: ['Progresión aritmética y cantidad de términos'],
    pieza: 'arit-fichas',
    juega: {
      consigna: 'Elige con cuántas fichas empieza la escalera, cuántas agrega cada fila y cuántas filas tiene.',
      voz: 'Cuenta cuántas veces se agregó d hasta la última fila.',
      controles: [
        { id: 'a', etiqueta: 'a₁', color: 'c-o', min: 1, max: 5, paso: 1, inicio: 2, unidad: '', decimales: 0 },
        { id: 'd', etiqueta: 'd', color: 'c-i', min: 1, max: 4, paso: 1, inicio: 3, unidad: '', decimales: 0 },
        { id: 'n', etiqueta: 'n', color: 'c-h', min: 2, max: 7, paso: 1, inicio: 4, unidad: 'filas', decimales: 0 },
      ],
      dibujo: v => ({ datos: { altoMax: 150, bloques: [{ filas: terminos(v.a, v.d, v.n), color: 'o', rotulo: lista(terminos(v.a, v.d, v.n)) }] }, estado: {} }),
      lectura: v => [an, ` = ${v.a} + (${v.n} − 1) · ${v.d} = ${v.a + (v.n - 1) * v.d}`],
      minimo: 3,
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
        { estado: { corte: 0 }, texto: 'Los términos van de 3 a 39, de 4 en 4.', ecuacion: [a1, ' = 3;   ', d, ' = 4;   ', an, ' = 39'] },
        { estado: { corte: 1 }, texto: 'Del primero al último hay 36 de distancia.', ecuacion: ['39 − 3 = 36'] },
        { estado: { corte: 2 }, texto: 'Son 36 ÷ 4 = 9 saltos, y 9 saltos unen 10 términos.', ecuacion: [n, ' = ', { frac: ['36', '4'] }, ' + 1 = 10'] },
      ],
    },
    regla: {
      texto: 'En una progresión aritmética cada término suma d al anterior. Del primero al término n hay n − 1 saltos.',
      ecuacion: [an, ' = ', a1, ' + (', n, ' − 1) ', d, ';   ', n, ' = ', { frac: [[an, ' − ', a1], d] }, ' + 1'],
      condicion: 'la diferencia d es la misma entre todos los términos consecutivos y no es cero.',
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
    juega: {
      consigna: 'La escalera naranja es la suma 1 + 2 + … + n. La turquesa es la misma suma al revés. Elige n.',
      voz: 'Cuenta las fichas de una fila completa.',
      controles: [{ id: 'n', etiqueta: 'n', color: 'c-h', min: 2, max: 9, paso: 1, inicio: 4, unidad: '', decimales: 0 }],
      dibujo: v => ({ datos: rectangulo(1, 1, v.n), estado: {} }),
      lectura: v => [`1 + … + ${v.n} = ${v.n} · ${v.n + 1} ÷ 2 = ${v.n * (v.n + 1) / 2}`],
      minimo: 3,
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
        { estado: {}, texto: 'Otras sumas notables: los primeros impares y los cuadrados.', ecuacion: ['1 + 3 + … + (2', n, ' − 1) = ', { sup: [n, '2'] }, ';   ', { sup: ['1', '2'] }, ' + … + ', { sup: [n, '2'] }, ' = ', { frac: [[n, '(', n, ' + 1)(2', n, ' + 1)'], '6'] }] },
      ],
    },
    regla: {
      texto: 'En una progresión aritmética, la suma es el número de términos por el promedio del primero y el último. Con 1 + 2 + … + n, cada fila mide n + 1.',
      ecuacion: [Sn, ' = ', { frac: [[n, ' (', a1, ' + ', an, ')'], '2'] }, ';   1 + 2 + … + ', n, ' = ', { frac: [[n, ' (', n, ' + 1)'], '2'] }],
      condicion: 'la diferencia es constante. Las sumas de impares y de cuadrados del último paso no salen del rectángulo: se comprueban.',
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
          solucion: { texto: `Hay ${k} impares; su suma es ${k} al cuadrado.`, ecuacion: [`(${2 * k - 1} + 1) ÷ 2 = ${k};   ${k}² = ${k * k}`] },
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
  const tirasGeo = (p, q, k, paso = false) => {
    const t = terminos(p, q, k, true);
    return { max: t[k - 1] * 1.25, filas: k, tiras: t.map((x, i) => ({ rotulo: i ? `× ${q}` : `${p}`, color: 'o', fin: f(x, 0), paso: paso ? i : 0, tramos: [{ valor: x, color: i ? 'i' : 'o' }] })) };
  };
  const pg = {
    id: 'progresion-geometrica',
    titulo: 'Cada término multiplica por r',
    temas: ['Progresión geométrica'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Elige el primer término, la razón y cuántos términos. Cada tira es la anterior multiplicada por r.',
      voz: 'Compara cuánto crece cada tira respecto de la anterior.',
      controles: [
        { id: 'a', etiqueta: 'a₁', color: 'c-o', min: 1, max: 3, paso: 1, inicio: 1, unidad: '', decimales: 0 },
        { id: 'r', etiqueta: 'r', color: 'c-i', min: 2, max: 3, paso: 1, inicio: 2, unidad: '', decimales: 0 },
        { id: 'n', etiqueta: 'n', color: 'c-h', min: 2, max: 4, paso: 1, inicio: 4, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tirasGeo(v.a, v.r, v.n), estado: {} }),
      lectura: v => { const t = terminos(v.a, v.r, v.n, true); return [an, ` = ${lista(t.slice(-1))};  `, Sn, ` = ${f(t.reduce((u, z) => u + z, 0), 0)}`]; },
      minimo: 3,
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
      ecuacion: [an, ' = ', a1, ' · ', { sup: [r, [n, ' − 1']] }, ';   ', Sn, ' = ', a1, ' · ', { frac: [[{ sup: [r, n] }, ' − 1'], [r, ' − 1']] }],
      condicion: 'r es la misma entre términos consecutivos. Si r = 1, todos son iguales y la suma es n · a₁.',
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
        { estado: { columna: 6 }, texto: 'De abajo hacia arriba: Δ sigue en 11, y 26 + 11 = 37.', ecuacion: ['9 + 2 = 11;   26 + 11 = 37'] },
      ],
    },
    regla: {
      texto: 'Si las diferencias de orden k son constantes, la sucesión se modela con un polinomio de grado k. El modelo se declara: pocos términos no fijan una sola regla.',
      ecuacion: ['Δ² constante   ⇒   ', { sub: ['t', n] }, ' = a', { sup: [n, '2'] }, ' + b', n, ' + c'],
      condicion: 'se supone que el patrón de diferencias sigue igual; la lista finita por sí sola no lo garantiza.',
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
  const infinita = {
    id: 'suma-infinita',
    titulo: 'Sumar sin fin sin pasarse',
    temas: ['Sumas infinitas'],
    pieza: 'arit-tiras',
    juega: {
      consigna: 'Se suma 1 + r + r² + … término a término. Elige la razón y cuántos términos. Mira el hueco que queda.',
      voz: 'Fíjate si el hueco desaparece o solo se achica.',
      controles: [
        { id: 'r', etiqueta: 'r', opciones: Object.keys(RAZONES).map(k => ({ valor: k, texto: k })) },
        { id: 'k', etiqueta: 'términos', color: 'c-h', min: 1, max: 8, paso: 1, inicio: 3, unidad: '', decimales: 0 },
      ],
      dibujo: v => ({ datos: tiraInf(RAZONES[v.r], v.k), estado: {} }),
      lectura: v => { const q = RAZONES[v.r], s = (1 - q ** v.k) / (1 - q); return [Sn, ` = ${f(s, 4)};  falta ${f(1 / (1 - q) - s, 4)}`]; },
      minimo: 4,
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

  return {
    unidad: 'aritmetica.sucesiones-y-series',
    version: '0.1.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-fichas.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/arit-tiras.js', '/nucleo/kit/piezas/arit-tabla.js'],
    historia: {
      texto: 'En el prefacio de la Cuadratura de la parábola, Arquímedes cuenta que el segmento de parábola mide cuatro tercios de un triángulo adecuado, y separa cómo lo exploró de cómo lo demostró. Esa idea de juntar aportes cada vez más chicos que se acercan a un valor es la de las sumas infinitas. La notación de términos y sumatorias es muy posterior.',
      pregunta: '¿Puede una suma sin fin dar un número?',
      fuente: { titulo: 'Arquímedes, prefacio a Quadrature of the parabola, traducción reproducida por MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/Extras/Archimedes_parabola/' },
    },
    ideas: [pa, suma, pg, orden, infinita],
  };
});
