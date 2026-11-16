/*
 * Teoría de «Cuatro operaciones» (aritmetica.cuatro-operaciones). Molde: docs/teoria.md; modelo de forma: porcentajes.js.
 * Fuente del contenido: docs/teoria/matriz/aritmetica.json (unidad 12) y docs/teoria/fuentes/historia-ecuaciones.pdf.
 * Errores: AR7 de docs/investigacion/aritmetica-razonamiento-ideas-erroneas.md; los AT-* son hipótesis nuevas.
 *
 * Ficha de tarea (diseno-y-animacion):
 *   Promesa: ver por qué funcionan los atajos de las cuatro operaciones (sumatorias, complemento, llevadas, restos, cotas).
 *   Persona y condiciones: postulante de 3.º, celular de 360 px, sin audio, sin calculadora.
 *   Resultado observable: suma series de consecutivos, halla complementos y restos por exceso, opera en otra base y acota cifras.
 *   Orden de atención: 1.º la figura (fichas, recta o tabla) · 2.º lo que el paso agrega · acción: el botón fijo de abajo.
 *   Estados: juego sin tocar · casos probados · predicción · coincide / no coincide · paso a paso · caso nuevo · «No sé».
 *   Duda que resuelve: «¿por qué n(n + 1)/2, por qué el resto por exceso no es el mismo, por qué 9 y 10 en el complemento?».
 * Colores (regla 4): el primer dato (n, N, a) naranja (c-o), el divisor o la base turquesa (c-i), el resto rojo (c-h),
 * el resultado verde (c-d).
 */
(function (root, fabrica) {
  const def = fabrica(typeof module === 'object' && module.exports ? require('../../../nucleo/kit/kit.js') : root.Kit);
  if (typeof module === 'object' && module.exports) module.exports = def;
  else root.Teoria.unidad(def);
})(typeof self !== 'undefined' ? self : this, function (Kit) {
  'use strict';
  const f = (n, d = 2) => Kit.formatear(n, d);
  const n_ = { v: 'c-o', t: 'n' }, N = { v: 'c-o', t: 'N' }, a = { v: 'c-o', t: 'a' }, dd = { v: 'c-i', t: 'd' };
  const q = { v: 'c-d', t: 'q' }, r = { v: 'c-h', t: 'r' }, re = { sub: [{ v: 'c-h', t: 'r' }, 'e'] }, bb = { v: 'c-i', t: 'b' };
  const SUB = '₀₁₂₃₄₅₆₇₈₉', subi = x => String(x).split('').map(c => SUB[+c]).join('');
  const enBase = (x, base) => { if (x === 0) return '0'; let s = ''; while (x > 0) { s = String(x % base) + s; x = Math.floor(x / base); } return s; };
  const valor = (c, base) => c.split('').reduce((v, x) => v * base + +x, 0);
  const nb = (c, base) => `(${c})${subi(base)}`;
  const cifras = x => String(Math.abs(Math.round(x))).length;
  function azar(s) {
    let z0 = (s * 2654435761 + 12345) >>> 0;
    const g = () => { z0 = (z0 + 0x6D2B79F5) >>> 0; let z = z0; z = Math.imul(z ^ (z >>> 15), z | 1); z ^= z + Math.imul(z ^ (z >>> 7), z | 61); return ((z ^ (z >>> 14)) >>> 0) / 4294967296; };
    g.ent = (lo, hi) => lo + Math.floor(g() * (hi - lo + 1));
    g.de = xs => xs[Math.floor(g() * xs.length)];
    return g;
  }
  function opciones(correcta, distractores, fmt = x => String(x)) {
    const vistos = new Set([fmt(correcta)]);
    const ops = [{ id: 'c', texto: fmt(correcta), correcta: true }];
    for (const x of distractores) {
      if (x.valor === null || x.valor === undefined || (typeof x.valor === 'number' && (!Number.isFinite(x.valor) || x.valor < 0))) continue;
      const txt = fmt(x.valor);
      if (vistos.has(txt)) continue;
      vistos.add(txt);
      ops.push({ id: x.id, texto: txt, error: x.error, siFuera: x.siFuera });
    }
    return ops.slice(0, 4);
  }

  // Gesto directo (docs/teoria.md §4b). Las manijas leen posiciones con escalas que no cambian mientras se arrastra:
  // fichas de tamaño fijo, rectas con tramo fijo y tiras con la misma escala. Si la escala cambiara con el valor, la
  // manija saltaría bajo el dedo y se dispararía hasta el extremo.
  const FICHAS = () => Kit.piezas['arit-fichas'], RECTA = () => Kit.piezas.recta, TIRAS = () => Kit.piezas['arit-tiras'];
  const inversa = (escala, a0, b0) => px => a0 + (px - escala(a0)) * (b0 - a0) / (escala(b0) - escala(a0));
  // Bloques centrados con fichas de tamaño fijo: el borde derecho del último bloque está en centro + ancho total / 2.
  const bordeDerecho = datos => { const g = FICHAS().geometria(datos), k = g.xs.length - 1, c = g.caja(k); return { x: c.x + c.ancho, y: g.piso - g.paso / 2 }; };
  const anchoTotalEn = (datos, x) => { const g = FICHAS().geometria(datos); return 2 * (x - (g.caja(0).x + (bordeDerecho(datos).x - g.caja(0).x) / 2)); };

  // ---------- Idea 1: dos escaleras forman un rectángulo (adición y sumatorias) ----------
  // Cambia: n, el largo de la escalera. Permanece: el tamaño de cada ficha.
  // Progresa: escalera → su copia girada → rectángulo n × (n + 1) → la mitad. Se reserva: dividir entre 2.
  // Debe verse: dos escaleras iguales llenan exactamente el rectángulo.
  const escaleras = (k, con = 2) => {
    const filas = Array.from({ length: k }, (_, i) => i + 1);
    const tramos = []; for (let i = 0; i < k; i++) tramos.push({ de: i * (k + 1) + i + 1, a: i * (k + 1) + k, color: 'h', paso: con >= 2 ? 0 : 99 });
    return { bloques: [
      { filas, color: 'i', rotulo: `1 + … + ${k}` },
      { n: k * (k + 1), columnas: k + 1, color: 'i', tramos, rotulo: `${k} × ${k + 1}`, paso: con >= 1 ? 0 : 99 },
    ], altoMax: 150, ficha: 15, alt: `Escalera de 1 a ${k} fichas; al lado, dos escaleras iguales forman un rectángulo de ${k} por ${k + 1}` };
  };
  // Ficha fija de 15 (con n = 9 caben 19 columnas): el ancho total es (2n + 1) · 15 + 18, y de ahí sale n.
  const nDeAncho = ancho => (ancho - 18 - 15) / 30;
  const sumatorias = {
    id: 'sumatorias',
    titulo: 'Dos escaleras, un rectángulo',
    temas: ['Adición y sumatorias'],
    pieza: 'arit-fichas',
    // Lee (fase 2): contexto y vocabulario; no dice cómo se calcula la suma (eso se descubre en Predice).
    lee: {
      tarjetas: [
        { titulo: 'Latas en escalera', texto: 'En la feria de Juliaca, las latas de leche se apilan en escalera: 1 arriba, 2 debajo, 3 más abajo. Contarlas una por una cansa cuando la escalera es alta.' },
        { titulo: 'Sumandos consecutivos', texto: 'Cada número de una suma es un sumando. Si van de 1 en 1, sin saltarse ninguno, son consecutivos. Una suma larga que sigue una regla se llama sumatoria.',
          ecuacion: ['1 + 2 + 3 + … + ', n_] },
        { titulo: 'Qué mirar', texto: 'A la izquierda verás la escalera de fichas. A la derecha, dos escaleras iguales juntas. Cambia n y cuenta las filas y las columnas de lo que forman.' },
      ],
    },
    juega: {
      consigna: 'Elige n. A la izquierda, la escalera 1 + 2 + … + n. A la derecha, dos escaleras iguales juntas.',
      voz: 'Cuenta las filas y las columnas del rectángulo.',
      controles: [{ id: 'n', etiqueta: 'n', color: 'c-o', min: 3, max: 9, paso: 1, inicio: 4, decimales: 0 }],
      dibujo: v => ({ datos: escaleras(v.n), estado: {} }),
      lectura: v => [`1 + … + ${v.n} = `, { v: 'c-d', t: String(v.n * (v.n + 1) / 2) }, ` · rectángulo ${v.n} × ${v.n + 1}`],
      minimo: 3,
      // Se tira del borde derecho del rectángulo: agrega una columna y, con ella, un escalón.
      arrastres: [{ id: 'borde', etiqueta: 'borde derecho del rectángulo (n)', color: 'c-o',
        donde: v => bordeDerecho(escaleras(v.n)),
        mover: (pt, v) => ({ n: nDeAncho(anchoTotalEn(escaleras(v.n), pt.x)) }) }],
    },
    predice: {
      pregunta: '¿Cuánto es 1 + 2 + 3 + … + 20?',
      opciones: [
        { id: 'c', texto: '210', correcta: true },
        { id: 'sin-mitad', texto: '420', error: 'AT-MITAD', siFuera: '420 son las dos escaleras juntas. La suma es una sola escalera.' },
        { id: 'cuadrado', texto: '200', error: 'AT-CUADRADO', siFuera: 'Sería cierto si el rectángulo fuera de 20 × 20. Es de 20 × 21.' },
        { id: 'menos', texto: '190', error: 'AT-CONTEO', siFuera: '190 llega hasta 19. Falta sumar el 20.' },
      ],
      dibujo: { datos: escaleras(5, 0), estado: {} },
      revelar: { datos: escaleras(5), estado: {} },
      coincide: 'Coincide: 20 × 21 entre 2 es 210.',
    },
    mira: {
      datos: { bloques: [
        { filas: [1, 2, 3, 4, 5], color: 'i', rotulo: '1 + … + 5' },
        { n: 30, columnas: 6, color: 'i', paso: 1, rotulo: '5 × 6', tramos: [0, 1, 2, 3, 4].map(i => ({ de: i * 6 + i + 1, a: i * 6 + 5, color: 'h', paso: 2 })) },
      ], altoMax: 150, ficha: 26, alt: 'Escalera de 1 a 5; rectángulo de 5 por 6 hecho con dos escaleras' },
      pasos: [
        { estado: { paso: 0 }, texto: 'La escalera 1 + 2 + 3 + 4 + 5 tiene 15 fichas.', ecuacion: ['1 + 2 + 3 + 4 + 5'] },
        { estado: { paso: 1 }, texto: 'Pongo otra igual, girada, encima de ella.', ecuacion: ['dos escaleras'] },
        { estado: { paso: 2 }, texto: 'Juntas llenan un rectángulo de 5 filas y 6 columnas.', ecuacion: ['5 · 6 = 30'] },
        { estado: { paso: 2 }, texto: 'Una escalera es la mitad del rectángulo.', ecuacion: [{ frac: ['5 · 6', '2'] }, ' = ', { v: 'c-d', t: '15' }] },
      ],
    },
    regla: {
      texto: 'La sumatoria de 1 a n es la mitad de un rectángulo de n por n + 1. Para consecutivos de a hasta z: primero más último, por cuántos, entre 2.',
      ecuacion: ['1 + 2 + … + ', n_, ' = ', { llave: [{ frac: [[n_, '(', n_, ' + 1)'], '2'] }], nota: 'medio rectángulo', color: 'c-o' }, '   ·   ', 'a + … + z = ', { frac: ['(a + z)(z − a + 1)', '2'] }],
      condicion: 'los sumandos son consecutivos (suben de 1 en 1). Con pares 2 + 4 + … + 2n, la suma es n(n + 1).',
    },
    // Así se resuelve (fase 2): los tres tipos de «Ahora tú», con las mismas cuentas y otras semillas.
    resuelve: {
      generar(s) {
        const g = azar(s + 900), tipo = s % 3;
        if (tipo === 0) {
          const k = g.ent(12, 60), v = k * (k + 1) / 2;
          return {
            enunciado: `En la feria apilan latas en escalera: 1 arriba, 2 debajo, y así hasta ${k} en la fila de abajo. ¿Cuántas latas hay?`,
            pasos: [
              { tipo: 'pide', texto: `Piden el total de latas: la suma 1 + 2 + … + ${k}.` },
              { tipo: 'datos', texto: `Las filas tienen 1, 2, 3, … hasta ${k} latas: son ${k} sumandos consecutivos que empiezan en 1.` },
              { tipo: 'regla', texto: 'Si pongo otra escalera igual, girada, las dos llenan un rectángulo de n filas y n + 1 columnas. Una sola escalera es la mitad.',
                ecuacion: ['1 + … + ', n_, ' = ', { frac: [[n_, '(', n_, ' + 1)'], '2'] }] },
              { tipo: 'cuentas', texto: `El rectángulo es de ${k} por ${k + 1}; tomo la mitad.`, ecuacion: [{ frac: [`${k} · ${k + 1}`, '2'] }, ` = ${f(k * (k + 1))} ÷ 2 = `, { v: 'c-d', t: f(v) }] },
              { tipo: 'sentido', texto: `Hay ${k} filas y, en promedio, cada una tiene ${f((k + 1) / 2, 1)} latas: ${k} · ${f((k + 1) / 2, 1)} = ${f(v)}. Cuadra.` },
            ],
            respuesta: [`Hay ${f(v)} latas.`],
          };
        }
        if (tipo === 1) {
          const lo = g.ent(10, 40), hi = lo + g.ent(9, 40), c = hi - lo + 1, v = (lo + hi) * c / 2;
          return {
            enunciado: `En una rifa se venden los boletos del ${lo} al ${hi}. Si sumas todos sus números, ¿cuánto da?`,
            pasos: [
              { tipo: 'pide', texto: `Piden la suma ${lo} + ${lo + 1} + … + ${hi}.` },
              { tipo: 'datos', texto: `El primero es ${lo} y el último, ${hi}. Contando los dos extremos, hay ${hi} − ${lo} + 1 = ${c} sumandos.` },
              { tipo: 'regla', texto: 'La escalera y su copia girada forman un rectángulo: primero más último, por cuántos sumandos hay, y la mitad.',
                ecuacion: ['a + … + z = ', { frac: ['(a + z)(z − a + 1)', '2'] }] },
              { tipo: 'cuentas', texto: `Junto primero y último, multiplico por los ${c} sumandos y divido entre 2.`, ecuacion: [{ frac: [`(${lo} + ${hi}) · ${c}`, '2'] }, ` = ${f((lo + hi) * c)} ÷ 2 = `, { v: 'c-d', t: f(v) }] },
              { tipo: 'sentido', texto: `El sumando del medio vale ${f((lo + hi) / 2, 1)}; ${c} sumandos de ese tamaño dan ${f(v)}. Cuadra.` },
            ],
            respuesta: [`La suma da ${f(v)}.`],
          };
        }
        const k = g.ent(10, 40), v = k * (k + 1);
        return {
          enunciado: `¿Cuánto es 2 + 4 + 6 + … + ${2 * k}?`,
          pasos: [
            { tipo: 'pide', texto: `Piden la suma de los pares desde 2 hasta ${2 * k}.` },
            { tipo: 'datos', texto: `Cada sumando es el doble de 1, 2, 3, … hasta ${k}. Son ${k} sumandos.` },
            { tipo: 'regla', texto: 'Si cada sumando es el doble, la suma también es el doble. Y la suma de 1 a n es medio rectángulo de n por n + 1.' },
            { tipo: 'cuentas', texto: `Duplico la suma de 1 a ${k}: el 2 y la mitad se cancelan.`, ecuacion: ['2 · ', { frac: [`${k} · ${k + 1}`, '2'] }, ` = ${k} · ${k + 1} = `, { v: 'c-d', t: f(v) }] },
            { tipo: 'sentido', texto: `Hay ${k} pares y el del medio vale ${k + 1}: ${k} · ${k + 1} = ${f(v)}. Cuadra.` },
          ],
          respuesta: [`2 + 4 + … + ${2 * k} = ${f(v)}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), tipo = s % 3;
        if (tipo === 0) {
          const k = g.ent(12, 60), v = k * (k + 1) / 2;
          return {
            pregunta: `¿Cuánto es 1 + 2 + 3 + … + ${k}?`,
            opciones: opciones(v, [
              { id: 'sin-mitad', valor: k * (k + 1), error: 'AT-MITAD', siFuera: 'Eso son dos escaleras. La suma es una sola.' },
              { id: 'cuadrado', valor: k * k / 2, error: 'AT-CUADRADO', siFuera: `El rectángulo es de ${k} × ${k + 1}, no de ${k} × ${k}.` },
              { id: 'menos', valor: (k - 1) * k / 2, error: 'AT-CONTEO', siFuera: `Eso llega hasta ${k - 1}.` },
            ], x => f(x)),
            solucion: { texto: 'La mitad del rectángulo de n por n + 1.', ecuacion: [{ frac: [`${k} · ${k + 1}`, '2'] }, ` = ${f(v)}`] },
          };
        }
        if (tipo === 1) {
          const lo = g.ent(10, 40), hi = lo + g.ent(9, 40), c = hi - lo + 1, v = (lo + hi) * c / 2;
          return {
            pregunta: `¿Cuánto es ${lo} + ${lo + 1} + ${lo + 2} + … + ${hi}?`,
            opciones: opciones(v, [
              { id: 'cuantos', valor: (lo + hi) * (hi - lo) / 2, error: 'AT-CONTEO', siFuera: `De ${lo} a ${hi} hay ${c} números, no ${hi - lo}.` },
              { id: 'desde-1', valor: hi * (hi + 1) / 2, error: 'AT-DESDE-1', siFuera: `Eso suma desde 1. Aquí se empieza en ${lo}.` },
              { id: 'sin-mitad', valor: (lo + hi) * c, error: 'AT-MITAD', siFuera: 'Falta dividir entre 2.' },
            ], x => f(x)),
            solucion: { texto: `Primero más último, por los ${c} sumandos, entre 2.`, ecuacion: [{ frac: [`(${lo} + ${hi}) · ${c}`, '2'] }, ` = ${f(v)}`] },
          };
        }
        const k = g.ent(10, 40), v = k * (k + 1);
        return {
          pregunta: `¿Cuánto es 2 + 4 + 6 + … + ${2 * k}?`,
          opciones: opciones(v, [
            { id: 'mitad', valor: k * (k + 1) / 2, error: 'AT-MITAD', siFuera: 'Esa es la suma de 1 a n; cada par es el doble.' },
            { id: 'hasta-2k', valor: 2 * k * (2 * k + 1) / 2, error: 'AT-CONTEO', siFuera: `Eso suma todos los números hasta ${2 * k}, también los impares.` },
            { id: 'cuadrado', valor: k * k, error: 'AT-CUADRADO', siFuera: 'Esa es la suma de los impares.' },
          ], x => f(x)),
          solucion: { texto: `Es el doble de 1 + … + ${k}.`, ecuacion: [`2 · `, { frac: [`${k} · ${k + 1}`, '2'] }, ` = ${f(v)}`] },
        };
      },
    },
  };

  // ---------- Idea 2: lo que le falta para la potencia (sustracción y complemento aritmético) ----------
  // Cambia: N. Permanece: la recta de 0 a 10ᵏ, con k = cantidad de cifras de N.
  // Progresa: N → lo que falta hasta 10ᵏ → el atajo cifra por cifra. Se reserva: «de 10 la última no nula».
  // Debe verse: el complemento es una distancia en la recta.
  // fija: recta de 0 a 1 000 siempre (el juego): la meta salta de 100 a 1 000 cuando N gana una cifra, y la manija
  // no cambia de escala bajo el dedo. Sin fija, la recta llega justo a la potencia (predicción, mira, ahora tú).
  const rectaCA = (Nv, final = true, fija = false) => {
    const k = cifras(Nv), P = 10 ** k;
    return {
      min: 0, max: fija ? 1000 : P, paso: (fija ? 1000 : P) / 10, decimales: 0, variable: 'N', color: 'o', filas: 1,
      elementos: [
        // Con la recta fija, N cerca de la meta pierde su rótulo (chocaría con el de la meta; la lectura lo dice).
        { tipo: 'punto', x: Nv, color: 'o', rotulo: fija && P - Nv < 160 ? undefined : f(Nv), fila: 0 },
        { tipo: 'punto', x: P, color: 'i', rotulo: f(P), fila: 0 },
        { tipo: 'distancia', a: Nv, b: P, color: 'd', rotulo: `CA = ${f(P - Nv)}`, fila: 1, desde: final ? 0 : 1 },
      ],
    };
  };
  const ca = x => 10 ** cifras(x) - x;
  const complemento = {
    id: 'complemento',
    titulo: 'Lo que falta para la potencia',
    temas: ['Sustracción y complemento aritmético'],
    pieza: 'recta',
    // Lee (fase 2): el vuelto como contexto y el vocabulario; no da el atajo ni la meta de 3 400.
    lee: {
      tarjetas: [
        { titulo: 'El vuelto', texto: 'Compras algo de 37 soles en el mercado y pagas con un billete de 100. El vuelto es lo que le falta a 37 para llegar a 100.' },
        { titulo: 'Un nombre para eso', texto: 'Lo que le falta a un número para llegar a 10, 100, 1 000 o más se llama complemento aritmético. Se escribe CA.',
          ecuacion: ['CA(', N, ')'] },
        { titulo: 'Qué mirar', texto: 'En la recta, el punto naranja es N y el turquesa es la meta. La cota verde mide lo que falta. Mueve N y mira dónde cae la meta cuando N gana una cifra.' },
      ],
    },
    juega: {
      consigna: 'Elige N. Su complemento aritmético es lo que le falta para llegar a 10, 100 o 1 000, según sus cifras.',
      voz: 'Mira dónde cae la meta turquesa cuando N gana una cifra.',
      controles: [{ id: 'N', etiqueta: 'N', color: 'c-o', min: 20, max: 980, paso: 20, inicio: 80, decimales: 0 }],
      dibujo: v => ({ datos: rectaCA(v.N, true, true), estado: {} }),
      lectura: v => ['CA(', N, `) = ${f(10 ** cifras(v.N))} − ${f(v.N)} = `, { v: 'c-d', t: f(ca(v.N)) }],
      minimo: 3,
      arrastres: [{ id: 'n', etiqueta: 'el número N en la recta', color: 'c-o',
        donde: v => { const g = RECTA().geometria(rectaCA(v.N, true, true)); return { x: g.x(v.N), y: g.filaY(0) }; },
        mover: pt => ({ N: inversa(RECTA().geometria(rectaCA(10, true, true)).x, 0, 1000)(pt.x) }) }],
    },
    predice: {
      pregunta: ['¿Cuál es el complemento aritmético de ', { v: 'c-o', t: '3 400' }, '?'],
      opciones: [
        { id: 'c', texto: '6 600', correcta: true },
        { id: 'nueves', texto: '6 599', error: 'AT-CA9', siFuera: 'Eso resta de 9 todas las cifras. Ese número le falta a 9 999, no a 10 000.' },
        { id: 'k', texto: '96 600', error: 'AT-CA-K', siFuera: 'Sería cierto si 3 400 tuviera cinco cifras. Tiene cuatro: la potencia es 10 000.' },
        { id: 'cada10', texto: '7 600', error: 'AT-CA10', siFuera: 'Eso resta de 10 todas las cifras no nulas. Solo la última no nula se resta de 10.' },
      ],
      dibujo: { datos: rectaCA(3400, false), estado: { corte: 0 } },
      revelar: { datos: rectaCA(3400, false), estado: { corte: 1 } },
      coincide: 'Coincide: 3 400 + 6 600 = 10 000.',
    },
    mira: {
      datos: rectaCA(3400, false),
      pasos: [
        { estado: { corte: 0 }, texto: '3 400 tiene cuatro cifras: su potencia es 10 000.', ecuacion: ['k = 4 → ', { sup: ['10', '4'] }, ' = 10 000'] },
        { estado: { corte: 1 }, texto: 'El complemento aritmético es lo que falta para llegar.', ecuacion: ['CA(3 400) = 10 000 − 3 400 = ', { v: 'c-d', t: '6 600' }] },
        { estado: { corte: 1 }, texto: 'Atajo: 9 menos cada cifra, 10 menos la última no nula.', ecuacion: ['9 − 3 = 6 · 10 − 4 = 6 · 00'] },
      ],
    },
    regla: {
      texto: 'El complemento aritmético de N es lo que le falta para la potencia de 10 con tantos ceros como cifras tiene N.',
      ecuacion: ['CA(', N, ') = ', { llave: [{ sup: ['10', 'k'] }], nota: 'la meta' }, ' − ', N, '   ·   ', N, ' tiene k cifras'],
      condicion: 'k son las cifras de N. En base b la potencia es bᵏ: se resta de b − 1 y de b.',
    },
    // Así se resuelve (fase 2): el mismo número de «Ahora tú» (con s impar, redondeado a centenas), otra semilla.
    resuelve: {
      generar(s) {
        const g = azar(s + 900), k = g.ent(3, 5);
        let Nv = g.ent(10 ** (k - 1), 10 ** k - 1);
        if (s % 2) Nv = Math.floor(Nv / 100) * 100 || 10 ** (k - 1) * 2;
        const P = 10 ** k, v = ca(Nv);
        return {
          enunciado: ['¿Cuál es el complemento aritmético de ', { v: 'c-o', t: f(Nv) }, '?'],
          dibujo: { datos: rectaCA(Nv, false), estado: { corte: 0 } },
          pasos: [
            { tipo: 'pide', texto: ['Piden CA(', N, '): lo que le falta a ', N, ' para llegar a su potencia de 10.'] },
            { tipo: 'datos', texto: ['Cuento las cifras: ', { v: 'c-o', t: f(Nv) }, ` tiene ${k}. Entonces la meta es un 1 seguido de ${k} ceros.`], ecuacion: [{ sup: ['10', String(k)] }, ` = ${f(P)}`] },
            { tipo: 'regla', texto: 'El complemento es la distancia en la recta desde el número hasta esa meta: la meta menos el número.',
              ecuacion: ['CA(', N, ') = ', { sup: ['10', 'k'] }, ' − ', N] },
            { tipo: 'cuentas', texto: 'Resto el número de la meta.', ecuacion: [`CA(${f(Nv)}) = ${f(P)} − ${f(Nv)} = `, { v: 'c-d', t: f(v) }], dibujo: { datos: rectaCA(Nv, false), estado: { corte: 1 } } },
            { tipo: 'sentido', texto: 'Compruebo sumando: el número más su complemento da justo la meta.', ecuacion: [{ v: 'c-o', t: f(Nv) }, ' + ', { v: 'c-d', t: f(v) }, ` = ${f(P)}`] },
          ],
          respuesta: [`CA(${f(Nv)}) = `, { v: 'c-d', t: f(v) }],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), k = g.ent(3, 5);
        let Nv = g.ent(10 ** (k - 1), 10 ** k - 1);
        if (s % 2) Nv = Math.floor(Nv / 100) * 100 || 10 ** (k - 1) * 2;
        const v = ca(Nv), dig = String(Nv).split('');
        const nueves = +dig.map(x => 9 - +x).join('');
        return {
          pregunta: ['¿Cuál es el complemento aritmético de ', { v: 'c-o', t: f(Nv) }, '?'],
          opciones: opciones(v, [
            { id: 'nueves', valor: nueves, error: 'AT-CA9', siFuera: `Eso le falta a ${f(10 ** k - 1)}, no a ${f(10 ** k)}.` },
            { id: 'k', valor: 10 ** (k + 1) - Nv, error: 'AT-CA-K', siFuera: `${f(Nv)} tiene ${k} cifras: la potencia es ${f(10 ** k)}.` },
            { id: 'diez-todas', valor: +dig.map(x => (x === '0' ? '0' : String(10 - +x)).slice(-1)).join(''), error: 'AT-CA10', siFuera: 'Solo la última cifra no nula se resta de 10.' },
          ], x => f(x)),
          solucion: { texto: 'Lo que falta para la potencia de 10.', ecuacion: [`${f(10 ** k)} − ${f(Nv)} = ${f(v)}`], dibujo: { datos: rectaCA(Nv), estado: {} } },
        };
      },
    },
  };

  // ---------- Idea 3: división por defecto y por exceso ----------
  // Cambia: el dividendo y el divisor. Permanece: la recta de múltiplos del divisor.
  // Progresa: el múltiplo de abajo (defecto) → el de arriba (exceso). Se reserva: r + rₑ = d.
  // Debe verse: a está entre dos múltiplos consecutivos; cada resto es una distancia distinta.
  // tramo: [desde, hasta] fijo (el juego y el laboratorio): la recta no se corre cuando a pasa un múltiplo.
  const rectaDiv = (av, dv, final = true, tramo = null) => {
    const qv = Math.floor(av / dv), rv = av - qv * dv;
    const lo = tramo ? tramo[0] : dv * Math.max(0, qv - 1), hi = tramo ? tramo[1] : dv * (qv + 2);
    return {
      min: lo, max: hi, paso: dv, decimales: 0, variable: 'múltiplos de ' + dv, color: 'i', filas: 3,
      elementos: [
        { tipo: 'punto', x: qv * dv, color: 'i', fila: 0 },
        { tipo: 'punto', x: (qv + 1) * dv, color: 'i', fila: 0 },
        { tipo: 'punto', x: av, color: 'o', rotulo: `a = ${f(av)}`, fila: 1 },
        { tipo: 'distancia', a: qv * dv, b: av, color: 'h', rotulo: rv ? `r = ${rv}` : '', fila: 2, desde: final ? 0 : 1 },
        { tipo: 'distancia', a: av, b: (qv + 1) * dv, color: 'd', rotulo: `rₑ = ${dv - rv}`, fila: 3, desde: final ? 0 : 1 },
      ],
    };
  };
  const TRAMO = [15, 70];   // a de 20 a 60 y d hasta 9: los dos múltiplos vecinos caben siempre
  const aEnRecta = tramo => ({ id: 'a', etiqueta: 'el dividendo a en la recta', color: 'c-o',
    donde: v => { const g = RECTA().geometria(rectaDiv(v.a, v.d, true, tramo)); return { x: g.x(v.a), y: g.filaY(1) }; },
    mover: (pt, v) => ({ a: inversa(RECTA().geometria(rectaDiv(v.a, v.d, true, tramo)).x, tramo[0], tramo[1])(pt.x) }) });
  const division = {
    id: 'defecto-exceso',
    titulo: 'Resto por defecto y por exceso',
    temas: ['División entera por defecto y por exceso'],
    pieza: 'recta',
    // Lee (fase 2): vocabulario de la división y qué quiere decir «defecto» y «exceso»; no calcula ningún resto por exceso.
    lee: {
      tarjetas: [
        { titulo: 'Maples de huevos', texto: 'En el mercado, los huevos se venden en maples de 30. Con 100 huevos llenas 3 maples y sobran 10. Repartir en grupos iguales es dividir.' },
        { titulo: 'Los nombres', texto: ['En una división, ', a, ' es el dividendo, el que se reparte, y ', dd, ' es el divisor. El cociente entero ', q, ' cuenta los grupos completos.'],
          ecuacion: [a, ' ÷ ', dd] },
        { titulo: 'Quedarse corto o pasarse', texto: 'Defecto quiere decir quedarse corto; exceso, pasarse. Por eso una división entera se puede mirar de dos maneras: desde el múltiplo de abajo o desde el de arriba.' },
        { titulo: 'Qué mirar', texto: ['En la recta, los puntos turquesa son múltiplos de ', dd, ' y el naranja es ', a, '. Mide la distancia de ', a, ' a cada múltiplo vecino.'] },
      ],
    },
    juega: {
      consigna: 'Elige el dividendo a y el divisor d. La recta marca los múltiplos de d que rodean a a.',
      voz: 'Mide la distancia de a a cada múltiplo vecino.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 20, max: 60, paso: 1, inicio: 26, decimales: 0 },
        { id: 'd', etiqueta: 'd', color: 'c-i', min: 3, max: 9, paso: 1, inicio: 4, decimales: 0 },
      ],
      dibujo: v => ({ datos: rectaDiv(v.a, v.d, true, TRAMO), estado: { corte: 1 } }),
      lectura: v => { const qv = Math.floor(v.a / v.d), rv = v.a % v.d; return [`${v.a} = ${v.d}·${qv} + ${rv} = ${v.d}·${qv + 1} − ${rv ? v.d - rv : 0}`]; },
      minimo: 3,
      arrastres: [aEnRecta(TRAMO)],
    },
    predice: {
      pregunta: ['Al dividir ', { v: 'c-o', t: '47' }, ' entre ', { v: 'c-i', t: '6' }, ' por defecto, el cociente es 7 y el resto 5. ¿Cuál es el resto por exceso?'],
      opciones: [
        { id: 'c', texto: '1', correcta: true },
        { id: 'mismo', texto: '5', error: 'AT-EXCESO', siFuera: '5 es lo que pasa de 42. Por exceso se mide lo que falta para 48.' },
        { id: 'divisor', texto: '6', error: 'AT-EXCESO', siFuera: '6 es el divisor: la distancia entre dos múltiplos, no la de 47 a 48.' },
        { id: 'suma', texto: '11', error: 'AT-EXCESO', siFuera: '11 suma resto y divisor; el resto por exceso es menor que el divisor.' },
      ],
      dibujo: { datos: rectaDiv(47, 6, false), estado: { corte: 0 } },
      revelar: { datos: rectaDiv(47, 6, false), estado: { corte: 1 } },
      coincide: 'Coincide: a 47 le falta 1 para 48 = 6 · 8.',
    },
    mira: {
      datos: rectaDiv(47, 6, false),
      pasos: [
        { estado: { corte: 0 }, texto: '47 queda entre los múltiplos 42 y 48.', ecuacion: ['6 · 7 = 42 ≤ 47 < 48 = 6 · 8'] },
        { estado: { corte: 1 }, texto: 'Por defecto: lo que pasa de 42. Por exceso: lo que falta para 48.', ecuacion: ['47 = 6 · 7 + ', { v: 'c-h', t: '5' }, ' = 6 · 8 − 1'] },
        { estado: { corte: 1 }, texto: 'Los dos restos juntos cubren un salto de 6.', ecuacion: [{ v: 'c-h', t: '5' }, ' + 1 = 6'] },
      ],
    },
    regla: {
      texto: 'Por defecto, a = dq + r. Por exceso, el cociente sube uno y se resta lo que falta. Los dos restos suman el divisor.',
      ecuacion: [a, ' = ', dd, q, ' + ', { llave: [r], nota: 'lo que pasa', color: 'c-h' }, '   ·   ', a, ' = ', dd, '(', q, ' + 1) − ', { llave: [re], nota: 'lo que falta', color: 'c-h' }, '   ·   ', r, ' + ', re, ' = ', dd],
      condicion: 'd > 0 y 0 < r < d. Si la división es exacta, el resto es 0 y hay un solo cociente.',
    },
    // Así se resuelve (fase 2): los dos tipos de «Ahora tú» (hallar rₑ o hallar a), con las mismas cuentas.
    resuelve: {
      generar(s) {
        const g = azar(s + 900), dv = g.ent(4, 15), qv = g.ent(5, 30), rv = g.ent(1, dv - 1), av = dv * qv + rv;
        const abajo = dv * qv, arriba = dv * (qv + 1), rev = dv - rv;
        if (s % 2 === 0) return {
          enunciado: ['Divide ', { v: 'c-o', t: String(av) }, ' entre ', { v: 'c-i', t: String(dv) }, ' por exceso. ¿Cuánto vale el resto por exceso?'],
          dibujo: { datos: rectaDiv(av, dv, false), estado: { corte: 0 } },
          pasos: [
            { tipo: 'pide', texto: ['Piden ', re, ': lo que le falta al dividendo ', a, ' para llegar al múltiplo de ', dd, ' que queda encima.'] },
            { tipo: 'datos', texto: ['Busco los múltiplos de ', dd, ' que rodean al dividendo ', a, '.'], ecuacion: [`${dv} · ${qv} = ${abajo} < `, { v: 'c-o', t: String(av) }, ` < ${arriba} = ${dv} · ${qv + 1}`] },
            { tipo: 'regla', texto: 'Por exceso me paso al múltiplo de arriba: el cociente sube uno y el resto es lo que falta. Los dos restos juntos dan el divisor.' },
            { tipo: 'cuentas', texto: 'Resto el dividendo del múltiplo de arriba.', ecuacion: [`${arriba} − ${av} = `, { v: 'c-h', t: String(rev) }], dibujo: { datos: rectaDiv(av, dv, false), estado: { corte: 1 } } },
            { tipo: 'sentido', texto: `Por defecto sobran ${av} − ${abajo} = ${rv}. Los dos restos suman el divisor, y ${rev} es menor que ${dv}. Cuadra.`, ecuacion: [`${rv} + ${rev} = ${dv}`] },
          ],
          respuesta: [re, ` = ${rev}`],
        };
        return {
          enunciado: ['En una división, el divisor es ', { v: 'c-i', t: String(dv) }, `, el cociente por defecto es ${qv} y el resto por exceso es ${rev}. ¿Cuál es el dividendo?`],
          pasos: [
            { tipo: 'pide', texto: ['Piden el dividendo ', a, ', el número que se reparte.'] },
            { tipo: 'datos', texto: ['El divisor ', dd, ` es ${dv}, el cociente por defecto es ${qv} y el resto por exceso es ${rev}.`] },
            { tipo: 'regla', texto: 'Por exceso, el cociente es uno más que por defecto. El dividendo es ese múltiplo de arriba menos lo que le falta.',
              ecuacion: [a, ' = ', dd, '(', q, ' + 1) − ', re] },
            { tipo: 'cuentas', texto: `El cociente por exceso es ${qv} + 1 = ${qv + 1}.`, ecuacion: [a, ` = ${dv} · ${qv + 1} − ${rev} = ${arriba} − ${rev} = `, { v: 'c-o', t: String(av) }], dibujo: { datos: rectaDiv(av, dv), estado: { corte: 1 } } },
            { tipo: 'sentido', texto: `Vuelvo a dividir ${av} entre ${dv}: cabe ${qv} veces y sobran ${rv}. Los dos restos suman ${rv} + ${rev} = ${dv}. Cuadra.`, ecuacion: [`${av} = ${dv} · ${qv} + ${rv}`] },
          ],
          respuesta: [a, ` = ${av}`],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), dv = g.ent(4, 15), qv = g.ent(5, 30), rv = g.ent(1, dv - 1), av = dv * qv + rv;
        if (s % 2 === 0) return {
          pregunta: ['Divide ', { v: 'c-o', t: String(av) }, ' entre ', { v: 'c-i', t: String(dv) }, ' por exceso. ¿Cuánto vale el resto por exceso?'],
          opciones: opciones(dv - rv, [
            { id: 'defecto', valor: rv, error: 'AT-EXCESO', siFuera: 'Ese es el resto por defecto: lo que pasa del múltiplo de abajo.' },
            { id: 'divisor', valor: dv, error: 'AT-EXCESO', siFuera: 'Ese es el divisor, no lo que falta.' },
            { id: 'suma', valor: dv + rv, error: 'AT-EXCESO', siFuera: 'El resto por exceso siempre es menor que el divisor.' },
          ]),
          solucion: { texto: `Le falta eso para ${dv * (qv + 1)} = ${dv} · ${qv + 1}.`, ecuacion: [`${av} = ${dv} · ${qv + 1} − ${dv - rv}`], dibujo: { datos: rectaDiv(av, dv), estado: { corte: 1 } } },
        };
        return {
          pregunta: ['En una división, el divisor es ', { v: 'c-i', t: String(dv) }, `, el cociente por defecto es ${qv} y el resto por exceso es ${dv - rv}. ¿Cuál es el dividendo?`],
          opciones: opciones(av, [
            { id: 'suma', valor: dv * qv + (dv - rv), error: 'AT-EXCESO', siFuera: 'Eso suma el resto por exceso al múltiplo de abajo; se resta del de arriba.' },
            { id: 'exceso-q', valor: dv * qv - (dv - rv), error: 'AT-EXCESO', siFuera: `El cociente por exceso es ${qv + 1}, no ${qv}.` },
            { id: 'arriba', valor: dv * (qv + 1), error: 'AT-EXCESO', siFuera: 'Ese es el múltiplo de arriba; falta restar el resto por exceso.' },
          ]),
          solucion: { texto: 'Por exceso el cociente sube uno y se resta.', ecuacion: [`${dv} · ${qv + 1} − ${dv - rv} = ${av}`] },
        };
      },
    },
  };

  // ---------- Idea 4: llevar en base b (operaciones en otras bases) ----------
  // Cambia: la base, con los mismos sumandos (34)_b + (23)_b. Permanece: la columna de unidades y la de grupos.
  // Progresa: columna por columna, suma → escribe → lleva. Se reserva: la llevada que aparece cuando la suma llega a b.
  // Debe verse: se lleva 1 cuando la columna llega a b, no a 10.
  const sumaBase = (x, y, base, pasos) => {
    const xs = x.split('').reverse(), ys = y.split('').reverse(), n = Math.max(xs.length, ys.length);
    const filas = []; let lleva = 0, res = '';
    const LUG = ['unidades', `grupos de ${base}`, `grupos de ${base * base}`];
    for (let i = 0; i < n; i++) {
      const sm = (+xs[i] || 0) + (+ys[i] || 0) + lleva, esc = sm % base, ll = Math.floor(sm / base);
      filas.push([{ t: LUG[i], paso: pasos ? i + 1 : 0 }, { t: `${xs[i] || 0} + ${ys[i] || 0}${lleva ? ' + 1' : ''} = ${sm}`, paso: pasos ? i + 1 : 0 }, { t: String(esc), color: 'd', paso: pasos ? i + 1 : 0 }, { t: ll ? '1' : '—', color: 'h', paso: pasos ? i + 1 : 0 }]);
      res = esc + res; lleva = ll;
    }
    if (lleva) res = '1' + res;
    filas.push([{ t: 'resultado', paso: pasos ? n + 1 : 0 }, '', { t: nb(res, base), color: 'd', resalta: true, paso: pasos ? n + 1 : 0 }, '']);
    return { datos: { columnas: [{ t: 'lugar' }, { t: 'suma' }, { t: 'escribe', color: 'd' }, { t: 'lleva', color: 'h' }], filas, filasMax: 4 }, res };
  };
  const otrasBases = {
    id: 'otras-bases',
    titulo: 'Llevar cuando se llega a b',
    temas: ['Operaciones en otras bases'],
    pieza: 'arit-tabla',
    // Lee (fase 2): cómo se lee un número en otra base y qué columnas tiene la tabla; no dice cuándo se lleva.
    lee: {
      tarjetas: [
        { titulo: 'Otras maneras de agrupar', texto: 'En base 10 agrupamos de diez en diez. En base 5 se agrupa de cinco en cinco, como quien cuenta con los dedos de una mano.' },
        { titulo: 'Cómo se escribe', texto: 'El número pequeño de abajo es la base: (34)₅ se lee «tres cuatro en base cinco». Si no lleva ese número, se entiende que está en base 10.' },
        { titulo: 'Qué mirar', texto: 'La tabla suma columna por columna: el lugar, la suma, lo que se escribe y la llevada. Cambia la base y fíjate cuándo aparece un 1 en «lleva».' },
      ],
    },
    juega: {
      consigna: 'Se suman (34) y (23) en la base que elijas. La tabla suma columna por columna.',
      voz: 'Fíjate cuándo aparece un 1 en la columna «lleva».',
      controles: [{ id: 'b', etiqueta: 'b', color: 'c-i', min: 6, max: 9, paso: 1, inicio: 6, decimales: 0 }],
      dibujo: v => ({ datos: sumaBase('34', '23', v.b).datos, estado: {} }),
      lectura: v => [{ sub: ['(34)', String(v.b)] }, ' + ', { sub: ['(23)', String(v.b)] }, ' = ', { v: 'c-d', t: nb(sumaBase('34', '23', v.b).res, v.b) }],
      minimo: 3,
    },
    predice: {
      pregunta: ['¿Cuánto es ', { sub: ['(34)', { v: 'c-i', t: '5' }] }, ' + ', { sub: ['(23)', { v: 'c-i', t: '5' }] }, '?'],
      opciones: [
        { id: 'c', texto: '(112)₅', correcta: true },
        { id: 'decimal', texto: '(57)₅', error: 'AT-DECIMAL', siFuera: 'Así se suma en base 10. En base 5 la cifra 7 no existe.' },
        { id: 'diez', texto: '(102)₅', error: 'AT-LLEVA', siFuera: 'Eso olvida el 1 que se lleva de las unidades a la otra columna.' },
        { id: 'sin-lleva', texto: '(12)₅', error: 'AT-LLEVA', siFuera: 'Falta escribir lo que se lleva de la última columna.' },
      ],
      dibujo: { datos: { columnas: [{ t: 'lugar' }, { t: 'suma' }, { t: 'escribe', color: 'd' }, { t: 'lleva', color: 'h' }], filas: [], filasMax: 4 }, estado: {} },
      revelar: { datos: sumaBase('34', '23', 5).datos, estado: {} },
      coincide: 'Coincide: 19 + 13 = 32, y 32 = (112)₅.',
    },
    mira: {
      datos: sumaBase('34', '23', 5, true).datos,
      pasos: [
        { estado: { paso: 1, fila: 0 }, texto: 'Unidades: 4 + 3 = 7. Es un grupo de 5 y sobran 2.', ecuacion: ['7 = 1 · 5 + ', { v: 'c-d', t: '2' }] },
        { estado: { paso: 2, fila: 1 }, texto: 'Siguiente columna: 3 + 2 más el 1 que se lleva.', ecuacion: ['6 = 1 · 5 + ', { v: 'c-d', t: '1' }] },
        { estado: { paso: 3, fila: 2 }, texto: 'El último 1 que se lleva abre una columna nueva.', ecuacion: [{ sub: ['(34)', '5'] }, ' + ', { sub: ['(23)', '5'] }, ' = ', { v: 'c-d', t: '(112)₅' }] },
      ],
    },
    regla: {
      texto: 'En base b se opera columna por columna como en base 10, pero cada b unidades de una columna se llevan como 1 a la siguiente.',
      ecuacion: ['suma de la columna = ', { llave: [bb, ' · lleva'], nota: 'a la siguiente', color: 'c-i' }, ' + escribe'],
      condicion: 'todas las cifras son menores que b. Al restar, cada préstamo trae b unidades, no 10.',
    },
    // Así se resuelve (fase 2): la suma (con la tabla) o la resta (pasando por base 10), como «Ahora tú».
    resuelve: {
      generar(s) {
        const g = azar(s + 900), base = g.ent(3, 8);
        const x = enBase(g.ent(base * base, base * base * base - 1), base), y = enBase(g.ent(base, base * base - 1), base);
        const vx = valor(x, base), vy = valor(y, base), sm = vx + vy, res = enBase(sm, base);
        const B = { v: 'c-i', t: String(base) }, num = c => ({ sub: [`(${c})`, B] });
        // Descomposición por lugares, para mostrar el valor en base 10 de cada número.
        const POT = ['', '', '²', '³'];
        const poli = c => c.split('').map((d, i, xs) => { const e = xs.length - 1 - i; return e === 0 ? d : e === 1 ? `${d} · ${base}` : `${d} · ${base}${POT[e]}`; }).join(' + ');
        const datos = { tipo: 'datos', texto: ['Los dos números están en base ', B, `: sus cifras van de 0 a ${base - 1}.`] };
        if (s % 3 === 2 && vx > vy) {
          const df = vx - vy, rd = enBase(df, base);
          return {
            enunciado: ['¿Cuánto es ', num(x), ' − ', num(y), '?'],
            pasos: [
              { tipo: 'pide', texto: ['Piden la diferencia, escrita en base ', B, '.'] },
              datos,
              { tipo: 'regla', texto: ['El valor de un número no depende de cómo se escribe. Paso los dos a base 10, resto ahí y escribo el resultado en base ', B, '.'] },
              { tipo: 'cuentas', texto: 'Cada cifra vale según su lugar. Después resto en base 10.', ecuacion: [num(x), ` = ${poli(x)} = ${vx}   ·   `, num(y), ` = ${poli(y)} = ${vy}   ·   ${vx} − ${vy} = ${df}`] },
              { tipo: 'cuentas', texto: ['Escribo la diferencia en base ', B, ', agrupando de ', B, ' en ', B, '.'], ecuacion: [`${df} = ${poli(rd)} = `, { v: 'c-d', t: nb(rd, base) }] },
              { tipo: 'sentido', texto: 'Compruebo al revés: la diferencia más el número que resté debe dar el primero.', ecuacion: [`${df} + ${vy} = ${df + vy} = `, num(x)] },
            ],
            respuesta: [num(x), ' − ', num(y), ' = ', { v: 'c-d', t: nb(rd, base) }],
          };
        }
        return {
          enunciado: ['¿Cuánto es ', num(x), ' + ', num(y), '?'],
          dibujo: { datos: { columnas: [{ t: 'lugar' }, { t: 'suma' }, { t: 'escribe', color: 'd' }, { t: 'lleva', color: 'h' }], filas: [], filasMax: 4 }, estado: {} },
          pasos: [
            { tipo: 'pide', texto: ['Piden la suma, escrita en base ', B, '.'] },
            datos,
            { tipo: 'regla', texto: ['Sumo por columnas, de derecha a izquierda. Cuando una columna junta ', B, ' o más, cada grupo de ', B, ' pasa como 1 a la columna siguiente.'] },
            { tipo: 'cuentas', texto: 'La tabla suma cada columna, escribe lo que sobra y lleva lo que forma grupo.', ecuacion: [num(x), ' + ', num(y), ' = ', { v: 'c-d', t: nb(res, base) }], dibujo: { datos: sumaBase(x, y, base).datos, estado: {} } },
            { tipo: 'sentido', texto: 'Compruebo pasando todo a base 10: los dos sumandos y el resultado.', ecuacion: [`${vx} + ${vy} = ${sm}   ·   `, { v: 'c-d', t: nb(res, base) }, ` = ${poli(res)} = ${valor(res, base)}`] },
          ],
          respuesta: [num(x), ' + ', num(y), ' = ', { v: 'c-d', t: nb(res, base) }],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), base = g.ent(3, 8);
        const x = enBase(g.ent(base * base, base * base * base - 1), base), y = enBase(g.ent(base, base * base - 1), base);
        const sm = valor(x, base) + valor(y, base), res = enBase(sm, base);
        if (s % 3 === 2 && valor(x, base) > valor(y, base)) {
          const df = valor(x, base) - valor(y, base);
          return {
            pregunta: ['¿Cuánto es ', { sub: [`(${x})`, { v: 'c-i', t: String(base) }] }, ' − ', { sub: [`(${y})`, { v: 'c-i', t: String(base) }] }, '?'],
            opciones: opciones(nb(enBase(df, base), base), [
              { id: 'decimal', valor: nb(String(Math.abs(+x - +y)), base), error: 'AT-DECIMAL', siFuera: 'Eso resta como en base 10: el préstamo trae b, no 10.' },
              { id: 'valor', valor: nb(String(df), base), error: 'AT-DECIMAL', siFuera: `${df} es la diferencia en base 10; falta escribirla en base ${base}.` },
              { id: 'suma', valor: nb(res, base), error: 'AT-SENTIDO', siFuera: 'Esa es la suma, no la resta.' },
            ]),
            solucion: { texto: 'Se comprueba pasando por base 10.', ecuacion: [`${valor(x, base)} − ${valor(y, base)} = ${df} = `, { sub: [`(${enBase(df, base)})`, String(base)] }] },
          };
        }
        const decimal = +x + +y;
        return {
          pregunta: ['¿Cuánto es ', { sub: [`(${x})`, { v: 'c-i', t: String(base) }] }, ' + ', { sub: [`(${y})`, { v: 'c-i', t: String(base) }] }, '?'],
          opciones: opciones(nb(res, base), [
            { id: 'decimal', valor: nb(String(decimal), base), error: 'AT-DECIMAL', siFuera: 'Eso suma como en base 10; se lleva al llegar a b.' },
            { id: 'valor', valor: nb(String(sm), base), error: 'AT-DECIMAL', siFuera: `${sm} es la suma en base 10; falta escribirla en base ${base}.` },
            { id: 'sin-lleva', valor: nb(res.length > 1 ? res.slice(1) : '0', base), error: 'AT-LLEVA', siFuera: 'Falta la cifra que se lleva al final.' },
          ]),
          solucion: { texto: 'Columna por columna, llevando al llegar a la base.', ecuacion: [`${valor(x, base)} + ${valor(y, base)} = ${sm} = `, { sub: [`(${res})`, String(base)] }], dibujo: { datos: sumaBase(x, y, base).datos, estado: {} } },
        };
      },
    },
  };
  otrasBases.ahoraTu.pieza = 'arit-tabla';

  // ---------- Idea 5: multiplicar es sumar por partes (multiplicación) ----------
  // Cambia: los dos factores. Permanece: la escala de las tiras (una unidad, el mismo largo).
  // Progresa: a · b como decenas por b más unidades por b. Se reserva: el pedazo que se agrega al subir un factor.
  // Debe verse: si un factor sube k, el producto sube k veces el otro factor.
  const tirasProd = (av, bv, extra = 0, max) => {
    const dec = Math.floor(av / 10) * 10, uni = av - dec;
    const tramos = [{ valor: dec * bv, color: 'o', texto: `${dec}·${bv}` }];
    if (uni) tramos.push({ valor: uni * bv, color: 'i', texto: `${uni}·${bv}` });
    if (extra) tramos.push({ valor: extra * bv, color: 'h', texto: `+${extra}·${bv}`, paso: 1 });
    return { max: max || 360, tiras: [{ rotulo: `${av}${extra ? ' + ' + extra : ''} × ${bv}`, color: 'o', fin: f((av + extra) * bv), tramos }], filas: 1, alt: `Tira de ${av} por ${bv} partida en ${dec} por ${bv} y ${uni} por ${bv}${extra ? `, más ${extra} por ${bv}` : ''}` };
  };
  const multiplicacion = {
    id: 'multiplicar-partes',
    titulo: 'Multiplicar es sumar por partes',
    temas: ['Multiplicación'],
    pieza: 'arit-tiras',
    // Lee (fase 2): vocabulario (factores, producto) y cómo se parte la tira; no dice cuánto sube el producto.
    lee: {
      tarjetas: [
        { titulo: 'Factores y producto', texto: 'En 24 × 7, los números 24 y 7 son los factores, y lo que resulta es el producto. Multiplicar es juntar varios grupos del mismo tamaño.' },
        { titulo: 'De cabeza, en el mercado', texto: 'Para cobrar 12 kilos de papa a 3 soles, muchas caseras piensan 10 kilos y 2 kilos por separado: 30 más 6. Partir un factor ayuda a multiplicar sin papel.' },
        { titulo: 'Qué mirar', texto: 'La tira tiene un pedazo naranja, las decenas por b, y uno turquesa, las unidades por b. Suma los dos pedazos y compara con el número del final.' },
      ],
    },
    juega: {
      consigna: 'Elige los dos factores. La tira del producto se parte en decenas por b y unidades por b.',
      voz: 'Suma los dos pedazos y compara con el total.',
      controles: [
        { id: 'a', etiqueta: 'a', color: 'c-o', min: 11, max: 39, paso: 1, inicio: 24, decimales: 0 },
        { id: 'b', etiqueta: 'b', color: 'c-i', min: 3, max: 9, paso: 1, inicio: 7, decimales: 0 },
      ],
      dibujo: v => ({ datos: tirasProd(v.a, v.b), estado: {} }),
      lectura: v => { const dc = Math.floor(v.a / 10) * 10; return [`${v.a} · ${v.b} = ${dc * v.b} + ${(v.a - dc) * v.b} = `, { v: 'c-d', t: String(v.a * v.b) }]; },
      minimo: 3,
      // Se tira del final de la tira: cada grupo de b que se agrega sube a en 1 (la escala es fija: 360).
      arrastres: [{ id: 'fin', etiqueta: 'final de la tira (el factor a)', color: 'c-o',
        donde: v => { const g = TIRAS().geometria(tirasProd(v.a, v.b)); return { x: g.x(v.a * v.b), y: g.tiraY(0) }; },
        mover: (pt, v) => ({ a: TIRAS().geometria(tirasProd(v.a, v.b)).deX(pt.x) / v.b }) }],
    },
    predice: {
      pregunta: ['En ', { v: 'c-o', t: '24' }, ' × ', { v: 'c-i', t: '7' }, ', el primer factor aumenta en 3. ¿En cuánto aumenta el producto?'],
      opciones: [
        { id: 'c', texto: 'en 21', correcta: true },
        { id: 'tres', texto: 'en 3', error: 'AT-SUMA', siFuera: 'Sería cierto en una suma. En un producto, cada unidad más vale 7.' },
        { id: 'diez', texto: 'en 10', error: 'AT-SUMA', siFuera: 'Eso suma 3 y 7. Se agregan 3 grupos de 7.' },
        { id: 'triple', texto: 'en 336', error: 'AR7', siFuera: 'Eso triplica todo el producto; solo se agregan 3 grupos de 7.' },
      ],
      dibujo: { datos: tirasProd(24, 7, 3, 200), estado: { paso: 0 } },
      revelar: { datos: tirasProd(24, 7, 3, 200), estado: { paso: 1 } },
      coincide: 'Coincide: 27 × 7 = 24 × 7 + 3 × 7.',
    },
    mira: {
      datos: tirasProd(24, 7, 3, 200),
      pasos: [
        { estado: { paso: 0 }, texto: '24 × 7 es 20 grupos de 7 más 4 grupos de 7.', ecuacion: ['24 · 7 = 140 + 28 = 168'] },
        { estado: { paso: 1 }, texto: 'Con 3 más, se agregan 3 grupos de 7.', ecuacion: ['27 · 7 = 168 + 3 · 7'] },
        { estado: { paso: 1 }, texto: 'El producto sube 21.', ecuacion: ['189 − 168 = ', { v: 'c-d', t: '21' }] },
      ],
    },
    regla: {
      texto: 'Propiedad distributiva: multiplicar reparte sobre la suma. Si un factor aumenta k, el producto aumenta k veces el otro factor.',
      ecuacion: ['(m + n) · ', bb, ' = m · ', bb, ' + n · ', bb, '   ·   ', '(a + k) · ', bb, ' = a · ', bb, ' + ', { llave: ['k · ', bb], nota: 'lo que sube', color: 'c-h' }],
      condicion: 'el otro factor no cambia. Si los dos cambian, se suman los dos aportes y el de k por el otro cambio.',
    },
    // Así se resuelve (fase 2): cuánto cambia el producto (s par) o el producto por partes (s impar), como «Ahora tú».
    resuelve: {
      generar(s) {
        const g = azar(s + 900), av = g.ent(12, 60), bv = g.ent(4, 15), k = g.ent(2, 9);
        const B = { v: 'c-i', t: String(bv) };
        if (s % 2 === 0) {
          const baja = s % 4 !== 0, nuevo = baja ? av - k : av + k, max = (av + k) * bv;
          const mayor = Math.max(av, nuevo), menor = Math.min(av, nuevo);
          return {
            enunciado: [`En ${av} × `, B, `, el primer factor ${baja ? 'disminuye' : 'aumenta'} en ${k}. ¿En cuánto cambia el producto?`],
            dibujo: { datos: tirasProd(av, bv, 0, max), estado: {} },
            pasos: [
              { tipo: 'pide', texto: 'Piden cuánto cambia el producto, no cuánto vale el producto nuevo.' },
              { tipo: 'datos', texto: ['El segundo factor, ', B, `, no cambia. El primero pasa de ${av} a ${nuevo}.`] },
              { tipo: 'regla', texto: ['Multiplicar por ', B, ' es juntar grupos de ', B, `. Si el primer factor cambia en ${k}, cambian ${k} grupos de `, B, '; lo demás queda igual.'] },
              { tipo: 'cuentas', texto: [`El pedazo rojo son los ${k} grupos de `, B, baja ? ' que se quitan.' : ' que se agregan.'], ecuacion: [`${k} · ${bv} = `, { v: 'c-h', t: String(k * bv) }],
                dibujo: { datos: tirasProd(menor, bv, k, max), estado: { paso: 1 } } },
              { tipo: 'sentido', texto: 'Compruebo con los dos productos completos: su diferencia da lo mismo.', ecuacion: [`${mayor} · ${bv} − ${menor} · ${bv} = ${f(mayor * bv)} − ${f(menor * bv)} = ${f(mayor * bv - menor * bv)}`] },
            ],
            respuesta: [`El producto ${baja ? 'disminuye' : 'aumenta'} en `, { v: 'c-h', t: String(k * bv) }, '.'],
          };
        }
        const dec = Math.floor(av / 10) * 10, uni = av - dec, cerca = Math.round(av / 10) * 10;
        return {
          enunciado: [`¿Cuánto es ${av} × `, B, '? Hazlo por partes.'],
          dibujo: { datos: tirasProd(av, bv, 0, av * bv), estado: {} },
          pasos: [
            { tipo: 'pide', texto: 'Piden el producto, partiendo el primer factor en decenas y unidades.' },
            { tipo: 'datos', texto: [`${av} es ${dec} + ${uni}, y el otro factor es `, B, '.'] },
            { tipo: 'regla', texto: 'Multiplicar una suma es multiplicar cada parte y sumar los resultados: decenas por b más unidades por b.' },
            { tipo: 'cuentas', texto: uni ? 'El pedazo naranja son las decenas; el turquesa, las unidades.' : 'No hay unidades: la tira es un solo pedazo naranja, el de las decenas.',
              ecuacion: [`${dec} · ${bv} + ${uni} · ${bv} = ${f(dec * bv)} + ${f(uni * bv)} = `, { v: 'c-d', t: f(av * bv) }] },
            { tipo: 'sentido', texto: `Orden de magnitud: ${av} está cerca de ${cerca}, y ${cerca} · ${bv} = ${f(cerca * bv)}, cerca de ${f(av * bv)}. Cuadra.` },
          ],
          respuesta: [`${av} × ${bv} = `, { v: 'c-d', t: f(av * bv) }],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), av = g.ent(12, 60), bv = g.ent(4, 15), k = g.ent(2, 9);
        if (s % 2 === 0) return {
          pregunta: [`En ${av} × `, { v: 'c-i', t: String(bv) }, `, el primer factor ${s % 4 ? 'disminuye' : 'aumenta'} en ${k}. ¿En cuánto cambia el producto?`],
          opciones: opciones(k * bv, [
            { id: 'k', valor: k, error: 'AT-SUMA', siFuera: `Eso sería en una suma; cada unidad vale ${bv}.` },
            { id: 'suma', valor: k + bv, error: 'AT-SUMA', siFuera: `Se agregan o quitan ${k} grupos de ${bv}, no ${k} + ${bv}.` },
            { id: 'veces', valor: k * av * bv, error: 'AR7', siFuera: 'No se multiplica todo el producto; solo cambian unos grupos.' },
          ], x => `en ${f(x)}`),
          solucion: { texto: `${k} grupos de ${bv}.`, ecuacion: [`${k} · ${bv} = ${k * bv}`] },
        };
        const dec = Math.floor(av / 10) * 10;
        return {
          pregunta: `¿Cuánto es ${av} × ${bv}? Hazlo por partes.`,
          dibujo: { datos: tirasProd(av, bv, 0, av * bv), estado: {} },
          opciones: opciones(av * bv, [
            { id: 'sin-unidades', valor: dec * bv, error: 'AT-PARTES', siFuera: 'Falta el pedazo de las unidades.' },
            { id: 'unidades', valor: dec * bv + (av - dec), error: 'AT-PARTES', siFuera: `Las unidades también se multiplican por ${bv}.` },
            { id: 'suma', valor: av + bv, error: 'AT-SUMA', siFuera: 'Eso suma los factores.' },
          ], x => f(x)),
          solucion: { texto: 'Decenas por b más unidades por b.', ecuacion: [`${dec}·${bv} + ${av - dec}·${bv} = ${f(av * bv)}`] },
        };
      },
    },
  };

  // ---------- Idea 6: cuántas cifras tendrá (cantidad de cifras de un producto o cociente) ----------
  // Cambia: cuántas cifras tienen A y B. Permanece: la tabla con el menor y el mayor posible.
  // Progresa: extremos de A, de B y de A·B. Se reserva: las cifras del producto, entre dos valores.
  // Debe verse: con extremos se acota; no hay una sola respuesta.
  const tablaCotas = (m, n, con = 9) => {
    const loA = 10 ** (m - 1), hiA = 10 ** m - 1, loB = 10 ** (n - 1), hiB = 10 ** n - 1;
    const lo = loA * loB, hi = hiA * hiB;
    return { columnas: [{ t: '' }, { t: 'menor' }, { t: 'mayor' }, { t: 'cifras' }], filas: [
      [{ t: 'A', color: 'o' }, f(loA), f(hiA), { t: String(m), color: 'o' }],
      [{ t: 'B', color: 'i' }, f(loB), f(hiB), { t: String(n), color: 'i' }],
      [{ t: 'A·B', color: 'd', paso: con >= 1 ? 0 : 1 }, { t: f(lo), paso: con >= 1 ? 0 : 1 }, { t: f(hi), paso: con >= 1 ? 0 : 1 }, { t: `${cifras(lo)} o ${cifras(hi)}`, color: 'd', resalta: true, paso: con >= 1 ? 0 : 2 }],
    ], filasMax: 3, cabeza: true };
  };
  const cotas = {
    id: 'cifras-producto',
    titulo: 'Cuántas cifras tendrá',
    temas: ['Cantidad de cifras de un producto o cociente'],
    pieza: 'arit-tabla',
    // Lee (fase 2): para qué sirve estimar las cifras y qué es acotar; no dice cuántas cifras salen.
    lee: {
      tarjetas: [
        { titulo: 'Antes de multiplicar', texto: 'Si en la feria se venden 48 sacos de chuño de 52 kilos cada uno, ¿son cientos o miles de kilos? Saberlo sin hacer la cuenta ayuda a descartar respuestas.' },
        { titulo: 'Acotar', texto: 'Acotar es encerrar un número entre un menor y un mayor posibles. Si no conoces un número, pero sabes cuántas cifras tiene, ya puedes acotarlo.' },
        { titulo: 'Qué mirar', texto: 'La tabla multiplica el menor A por el menor B, y el mayor A por el mayor B. Cambia las cifras y compara cuántas cifras tienen esos dos productos.' },
      ],
    },
    juega: {
      consigna: 'Elige cuántas cifras tienen A y B. La tabla multiplica los menores y los mayores posibles.',
      voz: 'Compara las cifras del menor y del mayor producto.',
      controles: [
        { id: 'm', etiqueta: 'cifras de A', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 2, decimales: 0 },
        { id: 'n', etiqueta: 'cifras de B', color: 'c-i', min: 1, max: 3, paso: 1, inicio: 1, decimales: 0 },
      ],
      dibujo: v => ({ datos: tablaCotas(v.m, v.n), estado: {} }),
      lectura: v => [`A·B tiene ${v.m + v.n - 1} o ${v.m + v.n} cifras`],
      minimo: 3,
    },
    predice: {
      pregunta: ['A tiene ', { v: 'c-o', t: '5' }, ' cifras y B tiene ', { v: 'c-i', t: '3' }, '. ¿Cuántas cifras puede tener A × B?'],
      opciones: [
        { id: 'c', texto: '7 u 8', correcta: true },
        { id: 'suma', texto: 'siempre 8', error: 'AT-COTA', siFuera: '8 es el máximo; con 10 000 × 100 salen solo 7.' },
        { id: 'prod', texto: '15', error: 'AT-COTA', siFuera: 'Las cifras se suman, no se multiplican: 15 sería absurdo con números chicos.' },
        { id: 'menos', texto: 'siempre 7', error: 'AT-COTA', siFuera: '7 es el mínimo; con 99 999 × 999 salen 8.' },
      ],
      dibujo: { datos: tablaCotas(5, 3, 0), estado: { paso: 0 } },
      revelar: { datos: tablaCotas(5, 3, 0), estado: { paso: 2 } },
      coincide: 'Coincide: de 10 000 × 100 a 99 999 × 999.',
    },
    mira: {
      datos: tablaCotas(5, 3, 0),
      pasos: [
        { estado: { paso: 0, fila: [0, 1] }, texto: 'Cada número está entre el menor y el mayor de su cantidad de cifras.', ecuacion: [{ sup: ['10', '4'] }, ' ≤ A < ', { sup: ['10', '5'] }] },
        { estado: { paso: 1, fila: 2 }, texto: 'El producto queda entre el producto de los menores y el de los mayores.', ecuacion: [{ sup: ['10', '6'] }, ' ≤ A·B < ', { sup: ['10', '8'] }] },
        { estado: { paso: 2, fila: 2 }, texto: 'Por eso tiene 5 + 3 − 1 o 5 + 3 cifras.', ecuacion: ['7 ≤ cifras ≤ 8'] },
      ],
    },
    regla: {
      texto: 'Si A tiene m cifras y B tiene n, A · B tiene m + n − 1 o m + n. El cociente entero A ÷ B tiene m − n o m − n + 1.',
      ecuacion: ['m + n − 1 ≤ c ≤ m + n', '   ·   ', 'c: cifras de A·B'],
      condicion: 'A y B son enteros positivos y, en el cociente, A ≥ B. Para decidir entre los dos, se miran las primeras cifras.',
    },
    // Así se resuelve (fase 2): cifras del producto (s par, con la tabla) o del cociente (s impar), como «Ahora tú».
    resuelve: {
      generar(s) {
        const g = azar(s + 900), m = s % 2 === 0 ? g.ent(3, 5) : g.ent(4, 9), n = g.ent(2, m - 1);
        const loA = 10 ** (m - 1), hiA = 10 ** m - 1, loB = 10 ** (n - 1), hiB = 10 ** n - 1;
        const A = { v: 'c-o', t: 'A' }, Bv = { v: 'c-i', t: 'B' };
        const pide = que => ({ tipo: 'pide', texto: `Piden cuántas cifras puede tener ${que}.` });
        const datos = { tipo: 'datos', texto: [A, ` tiene ${m} cifras: va de ${f(loA)} a ${f(hiA)}. `, Bv, ` tiene ${n}: va de ${f(loB)} a ${f(hiB)}.`] };
        const cif = x => `${cifras(x)} ${cifras(x) === 1 ? 'cifra' : 'cifras'}`;
        if (s % 2 === 0) {
          const lo = loA * loB, hi = hiA * hiB;
          return {
            enunciado: [A, ' tiene ', { v: 'c-o', t: String(m) }, ' cifras y ', Bv, ' tiene ', { v: 'c-i', t: String(n) }, ' cifras. ¿Cuántas cifras puede tener A × B?'],
            dibujo: { datos: tablaCotas(m, n, 0), estado: { paso: 0 } },
            pasos: [
              pide('el producto A × B'),
              datos,
              { tipo: 'regla', texto: 'No conozco A ni B, así que acoto: el producto queda entre el de los dos menores y el de los dos mayores.' },
              { tipo: 'cuentas', texto: `El menor producto tiene ${cif(lo)} y el mayor, ${cif(hi)}.`, ecuacion: [`${f(lo)} ≤ A · B ≤ ${f(hi)}`], dibujo: { datos: tablaCotas(m, n, 0), estado: { paso: 2 } } },
              { tipo: 'sentido', texto: `Cuadra con la cuenta corta: ${m} + ${n} − 1 = ${m + n - 1} y ${m} + ${n} = ${m + n}.` },
            ],
            respuesta: [{ v: 'c-d', t: `${cifras(lo)} o ${cifras(hi)}` }, ' cifras'],
          };
        }
        const qlo = Math.floor(loA / hiB), qhi = Math.floor(hiA / loB);
        return {
          enunciado: [A, ' tiene ', { v: 'c-o', t: String(m) }, ' cifras y ', Bv, ' tiene ', { v: 'c-i', t: String(n) }, ' cifras. ¿Cuántas cifras puede tener el cociente entero de A entre B?'],
          pasos: [
            pide('el cociente entero de A entre B'),
            datos,
            { tipo: 'regla', texto: 'Acoto el cociente: es más chico con el menor A y el mayor B, y más grande con el mayor A y el menor B.' },
            { tipo: 'cuentas', texto: `El cociente entero más chico tiene ${cif(qlo)} y el más grande, ${cif(qhi)}.`,
              ecuacion: [`${f(loA)} ÷ ${f(hiB)} → ${f(qlo)}   ·   ${f(hiA)} ÷ ${f(loB)} → ${f(qhi)}`] },
            { tipo: 'sentido', texto: `Cuadra con la cuenta corta: ${m} − ${n} = ${m - n} y ${m} − ${n} + 1 = ${m - n + 1}.` },
          ],
          respuesta: [{ v: 'c-d', t: `${cifras(qlo)} o ${cifras(qhi)}` }, ' cifras'],
        };
      },
    },
    ahoraTu: {
      generar(s) {
        const g = azar(s), m = s % 2 === 0 ? g.ent(3, 5) : g.ent(4, 9), n = g.ent(2, m - 1);   // con tabla, A de 5 cifras como máximo (que quepa a 360 px)
        if (s % 2 === 0) return {
          pregunta: ['A tiene ', { v: 'c-o', t: String(m) }, ' cifras y B tiene ', { v: 'c-i', t: String(n) }, '. ¿Cuántas cifras puede tener A × B?'],
          opciones: opciones(`${m + n - 1} o ${m + n}`, [
            { id: 'suma', valor: `siempre ${m + n}`, error: 'AT-COTA', siFuera: `${m + n} es el máximo; el mínimo es ${m + n - 1}.` },
            { id: 'prod', valor: `${m * n}`, error: 'AT-COTA', siFuera: 'Las cifras no se multiplican.' },
            { id: 'menos', valor: `${m + n - 2} o ${m + n - 1}`, error: 'AT-COTA', siFuera: `Prueba con los mayores: llegan a ${m + n} cifras.` },
          ]),
          solucion: { texto: 'Entre el producto de los menores y el de los mayores.', ecuacion: [`${m + n - 1} ≤ cifras ≤ ${m + n}`], dibujo: { datos: tablaCotas(m, n), estado: {} } },
        };
        return {
          pregunta: ['A tiene ', { v: 'c-o', t: String(m) }, ' cifras y B tiene ', { v: 'c-i', t: String(n) }, '. ¿Cuántas cifras puede tener el cociente entero de A entre B?'],
          opciones: opciones(`${m - n} o ${m - n + 1}`, [
            { id: 'resta', valor: `siempre ${m - n}`, error: 'AT-COTA', siFuera: `Con ${f(10 ** m - 1)} ÷ ${f(10 ** (n - 1))} salen ${m - n + 1} cifras.` },
            { id: 'div', valor: `${f(m / n, 1)}`, error: 'AT-COTA', siFuera: 'Las cifras no se dividen.' },
            { id: 'suma', valor: `${m + n - 1} o ${m + n}`, error: 'AT-SENTIDO', siFuera: 'Eso es para el producto, no para el cociente.' },
          ]),
          solucion: { texto: 'Se acota con el menor y el mayor posible.', ecuacion: [`${m - n} ≤ cifras ≤ ${m - n + 1}`] },
        };
      },
    },
  };

  // ---------- Laboratorio ----------
  // Escalera de a hasta z y su copia girada: un rectángulo de (z − a + 1) filas por (a + z) columnas. Ficha fija de 11.
  function escalerasAZ(a0, z0) {
    const k = z0 - a0 + 1, c = a0 + z0;
    const filas = Array.from({ length: k }, (_, i) => a0 + i);
    const tramos = filas.map((x, i) => ({ de: i * c + x, a: i * c + c - 1, color: 'h' }));
    return { bloques: [
      { filas, color: 'i', rotulo: `${a0} + … + ${z0}` },
      { n: k * c, columnas: c, color: 'i', tramos, rotulo: `${k} × ${c}` },
    ], altoMax: 150, ficha: 11, alt: `Escalera de ${a0} a ${z0}; al lado, dos escaleras iguales forman un rectángulo de ${k} por ${c}` };
  }
  // Suma de la escalera de a hasta z (la misma que lee la mesa) y la menor suma que dejan sus controles.
  const sumaAZ = v => (v.z - v.a + 1) * (v.a + v.z) / 2;
  let MIN_AZ = Infinity; for (let a0 = 1; a0 <= 4; a0++) for (let z0 = 5; z0 <= 10; z0++) MIN_AZ = Math.min(MIN_AZ, sumaAZ({ a: a0, z: z0 }));
  // Restos de la mesa de la recta: por defecto y por exceso (0 si la división es exacta).
  const rLab = v => v.a % v.d, reLab = v => (rLab(v) ? v.d - rLab(v) : 0);
  // Lo que sube el producto de la tira de arriba a la de abajo, y la mayor subida con k ≤ 9 y b ≤ 9.
  const sube = v => (v.a + v.k) * v.b - v.a * v.b;
  const MAX_SUBE = sube({ a: 10, b: 9, k: 9 });
  // Recta de 0 a 112 (fija) con los dos múltiplos vecinos; si la división es exacta, a cae sobre el múltiplo.
  function rectaLab(av, dv) {
    const qv = Math.floor(av / dv), rv = av - qv * dv;
    return {
      min: 0, max: 112, paso: dv, decimales: 0, variable: 'múltiplos de ' + dv, color: 'i', filas: 3,
      elementos: [
        { tipo: 'punto', x: qv * dv, color: 'i', fila: 0 },
        { tipo: 'punto', x: (qv + 1) * dv, color: 'i', fila: 0 },
        { tipo: 'punto', x: av, color: 'o', rotulo: `a = ${f(av)}`, fila: 1 },
        ...(rv ? [
          { tipo: 'distancia', a: qv * dv, b: av, color: 'h', rotulo: `r = ${rv}`, fila: 2 },
          { tipo: 'distancia', a: av, b: (qv + 1) * dv, color: 'h', rotulo: `rₑ = ${dv - rv}`, fila: 3 },
        ] : []),
      ],
    };
  }
  // Dos tiras a la misma escala (0 a 432 = 48 · 9): a · b arriba y (a + k) · b abajo, con el pedazo k · b en rojo.
  function dosProductos(av, bv, k) {
    const base = Math.min(av, av + k), extra = Math.abs(k) * bv;
    const abajo = [{ valor: base * bv, color: 'o', texto: `${base}·${bv}` }];
    if (k > 0) abajo.push({ valor: extra, color: 'h', texto: `+${k}·${bv}` });
    const arriba = [{ valor: base * bv, color: 'o', texto: `${base}·${bv}` }];
    if (k < 0) arriba.push({ valor: extra, color: 'h', hueco: true });
    return { max: 432, filas: 2, alt: `Tira de ${av} por ${bv} y tira de ${av + k} por ${bv}: difieren en ${Math.abs(k)} por ${bv}`, tiras: [
      { rotulo: `${av} × ${bv}`, color: 'o', fin: f(av * bv), tramos: arriba },
      { rotulo: `${av + k} × ${bv}`, color: 'o', fin: f((av + k) * bv), tramos: abajo },
    ] };
  }

  return {
    unidad: 'aritmetica.cuatro-operaciones',
    version: '0.2.0',
    estado: 'completa',
    requiere: ['/nucleo/kit/piezas/arit-fichas.js', '/nucleo/kit/piezas/recta.js', '/nucleo/kit/piezas/arit-tabla.js', '/nucleo/kit/piezas/arit-tiras.js'],
    // Glosario: las palabras que esta unidad estrena en el curso (docs/teoria.md §4d). «cociente», «factor»,
    // «producto» y «múltiplo» se estrenan antes en el curso (magnitudes, razones y conjuntos): aquí no se repiten.
    glosario: [
      // «sumandos» va en plural a propósito: «sumando» suelto es el gerundio en razones y estadística.
      { termino: 'sumandos', def: 'Los números que se juntan en una suma.',
        ejemplo: 'En 3 + 4 + 5 = 12 son tres: 3, 4 y 5.', ver: ['sumatoria'] },
      { termino: 'sumatoria', def: 'Suma de muchos términos que siguen una regla, como 1 + 2 + … + n.',
        ejemplo: '1 + 2 + … + 20 = 20 · 21 / 2 = 210.', ver: ['sumandos', 'consecutivo'] },
      { termino: 'consecutivo', def: 'Números enteros que van uno detrás del otro, de 1 en 1, sin saltarse ninguno.',
        formas: ['consecutivos', 'consecutivo', 'consecutivas'], ejemplo: '7, 8 y 9 lo son; 7, 9 y 11 no.' },
      { termino: 'complemento aritmético', simbolo: 'CA', def: 'Lo que le falta a un número para llegar a 10, 100, 1000…, según cuántas cifras tiene.',
        ejemplo: 'CA(3 400) = 10 000 − 3 400 = 6 600.', ver: ['potencia'] },
      { termino: 'dividendo', simbolo: 'a', def: 'El número que se reparte en una división: el que va antes del signo ÷.',
        ejemplo: 'En 47 ÷ 6, es 47.', ver: ['divisor'] },
      { termino: 'divisor', simbolo: 'd', def: 'El número entre el que se divide. Si no sobra nada, se dice que divide al otro.',
        ejemplo: 'En 47 ÷ 6, es 6: 47 = 6 · 7 + 5.', ver: ['dividendo'] },
      { termino: 'cociente entero', simbolo: 'q', def: 'Cuántas veces cabe completo el divisor en el dividendo, sin contar lo que sobra.',
        formas: ['cociente entero', 'cocientes enteros'], ejemplo: '47 ÷ 6: cabe 7 veces, porque 6 · 7 = 42 ≤ 47.', ver: ['resto', 'divisor'] },
      { termino: 'resto por defecto', simbolo: 'r', def: 'Lo que pasa el dividendo del múltiplo del divisor que queda justo debajo.',
        formas: ['resto por defecto', 'restos por defecto', 'por defecto'], ejemplo: '47 = 6 · 7 + 5: es 5.', ver: ['resto por exceso'] },
      { termino: 'resto por exceso', simbolo: 'rₑ', def: 'Lo que le falta al dividendo para llegar al múltiplo del divisor que queda justo encima.',
        formas: ['resto por exceso', 'restos por exceso', 'por exceso'], ejemplo: '47 = 6 · 8 − 1: es 1, y 5 + 1 = 6.', ver: ['resto por defecto'] },
      { termino: 'división exacta', def: 'La que no deja nada sobrante: el dividendo es un múltiplo del divisor.',
        formas: ['división es exacta', 'división exacta', 'divisiones exactas'], ejemplo: '48 ÷ 6 = 8 y no sobra nada.', ver: ['divisor'] },
      { termino: 'préstamo', def: 'Al restar por columnas, la unidad que se pide a la columna de la izquierda cuando la cifra no alcanza.',
        ejemplo: 'En base 10 trae 10 unidades; en base 5, trae 5.', ver: ['base de numeración'] },
      { termino: 'acotar', def: 'Encerrar un número desconocido entre un valor menor y otro mayor que sí se conocen.',
        formas: ['acotar', 'acoto', 'acotarlo', 'acota'], ejemplo: 'Si A tiene 3 cifras, 100 ≤ A ≤ 999.' },
      { termino: 'propiedad distributiva', def: 'Multiplicar una suma da lo mismo que multiplicar cada parte y sumar los resultados.',
        ejemplo: '24 · 7 = 20 · 7 + 4 · 7 = 140 + 28 = 168.' },
    ],
    // Laboratorio: juego libre, sin preguntas. «Escaleras que no empiezan en 1» generaliza la idea 1 (de a hasta z);
    // «Restos con números grandes» abre a hasta 100 y d hasta 12, con divisiones exactas; «Dos productos» pone a · b
    // y (a + k) · b en la misma escala, con k negativo también.
    laboratorio: [
      {
        id: 'escaleras-a-z', titulo: 'Escaleras que no empiezan en 1', pieza: 'arit-fichas',
        consigna: 'La escalera va de a hasta z. Dos escaleras iguales forman un rectángulo. Tira de su borde para cambiar z.',
        controles: [
          { id: 'a', etiqueta: 'a', color: 'c-o', min: 1, max: 4, paso: 1, inicio: 3, decimales: 0 },
          { id: 'z', etiqueta: 'z', color: 'c-i', min: 5, max: 10, paso: 1, inicio: 7, decimales: 0 },
        ],
        dibujo: v => ({ datos: escalerasAZ(v.a, v.z), estado: {} }),
        lectura: v => { const k = v.z - v.a + 1; return [`${v.a} + … + ${v.z} = ${k} · ${v.a + v.z} / 2 = `, { v: 'c-d', t: String(sumaAZ(v)) }]; },
        invitaciones: [
          { texto: 'Haz que la escalera sume justo 42.',
            logrado: v => sumaAZ(v) === 42,
            bien: '3 + … + 9: siete sumandos, (3 + 9) · 7 / 2 = 42.' },
          { texto: 'Busca el rectángulo más parecido a un cuadrado.',
            logrado: v => (v.a + v.z) - (v.z - v.a + 1) === 1,
            bien: 'Desde 1, las columnas son una más que las filas: n por n + 1.' },
          { texto: 'Busca la escalera con la suma más chica.',
            logrado: v => sumaAZ(v) === MIN_AZ,
            bien: '4 + 5 = 9: dos sumandos, medio rectángulo de 2 por 9.' },
          { texto: 'Guarda dos escaleras distintas que sumen 15.',
            logrado: (v, guardados) => sumaAZ(v) === 15 && guardados.some(g => (g.a !== v.a || g.z !== v.z) && sumaAZ(g) === 15),
            bien: '5 × 6 y 3 × 10: dos rectángulos de 30, la misma mitad.' },
        ],
        arrastres: [{ id: 'borde', etiqueta: 'borde derecho del rectángulo (z)', color: 'c-i',
          donde: v => bordeDerecho(escalerasAZ(v.a, v.z)),
          // Ancho total: (z + (a + z)) · 11 + 18, de ahí z.
          mover: (pt, v) => ({ z: ((anchoTotalEn(escalerasAZ(v.a, v.z), pt.x) - 18) / 11 - v.a) / 2 }) }],
      },
      {
        id: 'restos-grandes', titulo: 'Restos con números grandes', pieza: 'recta',
        consigna: 'a de 0 a 100 y d de 2 a 12. Arrastra a: cuando cae en un múltiplo, la división es exacta.',
        controles: [
          { id: 'a', etiqueta: 'a', color: 'c-o', min: 0, max: 100, paso: 1, inicio: 47, decimales: 0 },
          { id: 'd', etiqueta: 'd', color: 'c-i', min: 2, max: 12, paso: 1, inicio: 6, decimales: 0 },
        ],
        dibujo: v => ({ datos: rectaLab(v.a, v.d), estado: { corte: 1 } }),
        lectura: v => {
          const qv = Math.floor(v.a / v.d), rv = v.a % v.d;
          return rv ? [`${v.a} ÷ ${v.d}: r = ${rv}, `, re, ` = ${v.d - rv} (suman ${v.d})`] : [`${v.a} ÷ ${v.d} es exacta: ${v.a} = ${v.d} · ${qv}`];
        },
        // Retos: rLab y reLab son los mismos restos que mide la recta (v.a % v.d y lo que falta).
        invitaciones: [
          { texto: 'Haz que la división sea exacta con a mayor que 90.',
            logrado: v => v.a > 90 && rLab(v) === 0,
            bien: 'a cae sobre un múltiplo: no sobra ni falta nada.' },
          { texto: 'Haz que los dos restos sean iguales.',
            logrado: v => rLab(v) > 0 && rLab(v) === reLab(v),
            bien: 'Solo pasa con divisor par: cada resto es la mitad de d.' },
          { texto: 'Con d = 12, consigue el resto por exceso más grande posible.',
            logrado: v => v.d === 12 && rLab(v) > 0 && reLab(v) === v.d - 1,
            bien: 'rₑ = 11 cuando r = 1: los dos restos siempre suman 12.' },
          { texto: 'Guarda dos casos con el mismo d y los restos intercambiados.',
            logrado: (v, guardados) => rLab(v) > 0 && guardados.some(g => g.d === v.d && rLab(g) > 0 && rLab(g) !== rLab(v) && rLab(g) === reLab(v)),
            bien: 'Lo que a uno le sobra, al otro le falta: posiciones en espejo.' },
        ],
        arrastres: [{ id: 'a', etiqueta: 'el dividendo a en la recta', color: 'c-o',
          donde: v => { const g = RECTA().geometria(rectaLab(v.a, v.d)); return { x: g.x(v.a), y: g.filaY(1) }; },
          mover: (pt, v) => ({ a: inversa(RECTA().geometria(rectaLab(v.a, v.d)).x, 0, 112)(pt.x) }) }],
      },
      {
        id: 'dos-productos', titulo: 'Dos productos', pieza: 'arit-tiras',
        consigna: 'Arriba a · b; abajo (a + k) · b, con la misma escala. Arrastra el final de cada tira.',
        controles: [
          { id: 'a', etiqueta: 'a', color: 'c-o', min: 10, max: 39, paso: 1, inicio: 24, decimales: 0 },
          { id: 'b', etiqueta: 'b', color: 'c-i', min: 2, max: 9, paso: 1, inicio: 7, decimales: 0 },
          { id: 'k', etiqueta: 'k', color: 'c-h', min: -9, max: 9, paso: 1, inicio: 3, decimales: 0 },
        ],
        dibujo: v => ({ datos: dosProductos(v.a, v.b, v.k), estado: {} }),
        lectura: v => [`${v.a + v.k} · ${v.b} − ${v.a} · ${v.b} = ${v.k} · ${v.b} = `, { v: 'c-h', t: f(sube(v)) }],
        invitaciones: [
          { texto: 'Haz que el producto baje justo 24.',
            logrado: v => sube(v) === -24,
            bien: 'Bajar 24 es quitar grupos de b: 4 de 6, o 3 de 8.' },
          { texto: 'Haz que las dos tiras midan lo mismo.',
            logrado: v => sube(v) === 0,
            bien: 'Con k = 0 no se agrega ni se quita ningún grupo.' },
          { texto: 'Consigue la mayor subida que dejan los controles.',
            logrado: v => sube(v) === MAX_SUBE,
            bien: 'Nueve grupos de 9: 81, sin importar cuánto vale a.' },
          { texto: 'Guarda dos casos con distinto a y la misma subida.',
            logrado: (v, guardados) => sube(v) !== 0 && guardados.some(g => g.a !== v.a && sube(g) === sube(v)),
            bien: 'Cambió a y la subida no: solo cuentan k y b.' },
        ],
        arrastres: [
          { id: 'fin-a', etiqueta: 'final de la tira de arriba (a)', color: 'c-o',
            donde: v => { const g = TIRAS().geometria(dosProductos(v.a, v.b, v.k)); return { x: g.x(v.a * v.b), y: g.tiraY(0) }; },
            mover: (pt, v) => ({ a: TIRAS().geometria(dosProductos(v.a, v.b, v.k)).deX(pt.x) / v.b }) },
          { id: 'fin-k', etiqueta: 'final de la tira de abajo (k)', color: 'c-h',
            donde: v => { const g = TIRAS().geometria(dosProductos(v.a, v.b, v.k)); return { x: g.x((v.a + v.k) * v.b), y: g.tiraY(1) }; },
            mover: (pt, v) => ({ k: TIRAS().geometria(dosProductos(v.a, v.b, v.k)).deX(pt.x) / v.b - v.a }) },
        ],
      },
    ],
    historia: {
      texto: 'Los papiros matemáticos egipcios multiplican sin nuestra tabla: duplican y suman algunos duplicados. Para 13 × 7 bastaba sumar 8 × 7, 4 × 7 y 1 × 7. Dividir era buscar qué múltiplos formaban una cantidad. Enseña que una operación y su procedimiento no son lo mismo: lo que se conserva es la propiedad de repartir.',
      pregunta: '¿Cómo multiplicarías solo duplicando y sumando?',
      fuente: { titulo: 'O’Connor y Robertson, Egyptian Papyri — MacTutor', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Egyptian_papyri/' },
    },
    ideas: [sumatorias, complemento, division, otrasBases, multiplicacion, cotas],
  };
});
